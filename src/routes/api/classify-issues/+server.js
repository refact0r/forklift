import { OPENAI_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import OpenAI from 'openai';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY
});

function mapDifficultyScore(score) {
	const mapping = { 1: 'easy', 2: 'medium', 3: 'hard' };
	return mapping[score] || 'medium';
}

function cleanTopics(topics) {
	if (!Array.isArray(topics)) return ['general'];

	return (
		topics
			.map((topic) => (typeof topic === 'string' ? topic.toLowerCase().replace(/\s+/g, '') : ''))
			.filter((topic) => topic && topic.length > 0)
			.slice(0, 5) || ['general']
	);
}

async function classifyIssues(repoContext, issues) {
	if (!OPENAI_API_KEY) {
		console.log('No OpenAI key available, using fallback classification');
		// Return fallback classification if no OpenAI
		return issues.map((issue) => ({
			...issue,
			ai_analysis: {
				difficulty: 'medium',
				difficulty_score: 2,
				topics: ['general'],
				summary: 'AI classification unavailable'
			}
		}));
	}

	const issuesText = issues
		.map(
			(issue) =>
				`#${issue.number}: ${issue.title}\nLabels: ${issue.labels.join(', ')}\nBody: ${issue.body.slice(0, 300)}...`
		)
		.join('\n\n');

	const prompt = `You are an assistant that classifies GitHub issues for new contributors.
Use 1-3 difficulty scores where:
1: Easy - Simple fixes, docs, typos, small enhancements
2: Medium - Standard features, bug fixes requiring moderate code changes
3: Hard - Complex features, architectural changes, deep system knowledge required

Topics should be 2-5 lowercase tokens like: docs, api, testing, bug, feature, etc.

REPO: ${repoContext.name}
DESCRIPTION: ${repoContext.description}
LANGUAGES: ${Object.keys(repoContext.languages || {}).join(', ')}
README EXCERPT: ${repoContext.readme?.slice(0, 800) || 'No README'}

ISSUES:
${issuesText}

Return STRICT JSON array with exact structure for each issue:
{
  "number": int,
  "title": string,
  "difficulty_score": 1-3,
  "topics": string[],
  "rationale": string (≤20 words)
}

Return array of ${issues.length} objects only.`;

	try {
		// Call OpenAI using the modern responses API
		const response = await openai.responses.create({
			model: 'gpt-5-nano',
			input: prompt
		});

		if (response.status !== 'completed') {
			throw new Error(`OpenAI response not completed: ${response.status}`);
		}

		// Extract text content from the response
		const content = response.output_text;

		// Try to parse JSON response
		let parsedIssues;
		try {
			parsedIssues = JSON.parse(content);
		} catch {
			// Extract JSON array if wrapped in text
			const arrayMatch = content.match(/\[.*\]/s);
			if (arrayMatch) {
				parsedIssues = JSON.parse(arrayMatch[0]);
			} else {
				throw new Error('No valid JSON found');
			}
		}

		// Validate and clean the results
		return parsedIssues.map((result, index) => {
			const originalIssue = issues[index];
			const difficulty = mapDifficultyScore(result.difficulty_score || 2);
			return {
				...originalIssue,
				ai_analysis: {
					difficulty: difficulty,
					difficulty_score: Math.max(1, Math.min(3, result.difficulty_score || 2)),
					topics: cleanTopics(result.topics),
					summary: (result.rationale || 'unknown').slice(0, 100)
				}
			};
		});
	} catch (error) {
		console.error('OpenAI classification error:', error);
		// Return fallback classification
		return issues.map((issue) => ({
			...issue,
			ai_analysis: {
				difficulty: 'medium',
				difficulty_score: 2,
				topics: [],
				summary: 'AI analysis unavailable'
			}
		}));
	}
}

export async function POST({ request }) {
	try {
		const { repoContext, issues } = await request.json();

		if (!repoContext || !Array.isArray(issues)) {
			return json({ success: false, error: 'Invalid request data' }, { status: 400 });
		}

		const classifiedIssues = await classifyIssues(repoContext, issues);

		return json({
			success: true,
			issues: classifiedIssues
		});
	} catch (error) {
		console.error('Classification API error:', error);
		return json({ success: false, error: 'Classification failed' }, { status: 500 });
	}
}
