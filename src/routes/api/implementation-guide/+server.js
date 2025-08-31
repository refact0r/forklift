import { OPENAI_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import OpenAI from 'openai';
import { cacheWrapper, generateCacheKey } from '$lib/cache.js';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY
});

export async function POST({ request }) {
	try {
		const { issue, repoContext, aiAnalysis } = await request.json();

		if (!issue) {
			return json({ error: 'Issue data is required' }, { status: 400 });
		}

		if (!OPENAI_API_KEY) {
			return json({ error: 'OpenAI API key not configured' }, { status: 500 });
		}

		// Create cache key based on issue and repository
		const cacheKey = generateCacheKey(
			'implementation',
			repoContext.full_name,
			issue.number.toString()
		);

		// Use cache wrapper for AI implementation guide
		const result = await cacheWrapper(
			cacheKey,
			async () => {
				// Create implementation guide prompt
				const prompt = `You are a repository onboarding assistant that helps developers implement a solution to a GitHub issue. Generate a practical and actionable but concise implementation guide in MARKDOWN FORMAT.
Assume the developer already has the project set up. Provide pointers on how the issue might be solved. Do not add a top level heading (h1) or introductory text.

REPOSITORY CONTEXT:
- Name: ${repoContext.name}
- Description: ${repoContext.description}
- Main Languages: ${Object.keys(repoContext.languages || {}).join(', ')}
- Topics: ${(repoContext.topics || []).join(', ')}

ISSUE DETAILS:
- Title: ${issue.title}
- Body: ${issue.body || 'No description provided'}
- Labels: ${(issue.labels || []).map((l) => l.name).join(', ')}

${
	aiAnalysis
		? `- Topics: ${aiAnalysis.topics?.join(', ')}
- Summary: ${aiAnalysis.summary}
`
		: ''
}

README CONTENT (first 5000 chars):
${(repoContext.readme || '').substring(0, 5000)}`;

				// Call OpenAI using the modern responses API
				const response = await openai.responses.create({
					model: 'gpt-5-nano',
					input: prompt
				});

				if (response.status !== 'completed') {
					throw new Error(`OpenAI response not completed: ${response.status}`);
				}

				// Extract text content from the response
				const guide = response.output_text || 'Failed to generate implementation guide';

				return {
					guide,
					generated_at: new Date().toISOString()
				};
			},
			7200 // Cache implementation guides for 2 hours
		);

		return json(result);
	} catch (error) {
		console.error('Implementation guide generation error:', error);
		return json(
			{
				error: 'Failed to generate implementation guide',
				details: error.message
			},
			{ status: 500 }
		);
	}
}
