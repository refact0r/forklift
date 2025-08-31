import { OPENAI_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import OpenAI from 'openai';

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

		// Create implementation guide prompt
		const prompt = `You are a senior software engineer helping a developer implement a solution for a GitHub issue. Generate a comprehensive implementation guide.

REPOSITORY CONTEXT:
- Name: ${repoContext.name}
- Description: ${repoContext.description}
- Main Languages: ${Object.keys(repoContext.languages || {}).join(', ')}
- Topics: ${(repoContext.topics || []).join(', ')}

ISSUE DETAILS:
- Title: ${issue.title}
- Number: #${issue.number}
- Body: ${issue.body || 'No description provided'}
- Labels: ${(issue.labels || []).map((l) => l.name).join(', ')}

${
	aiAnalysis
		? `AI ANALYSIS:
- Difficulty: ${aiAnalysis.difficulty}
- Topics: ${aiAnalysis.topics?.join(', ')}
- Summary: ${aiAnalysis.summary}
`
		: ''
}

README CONTENT (first 2000 chars):
${(repoContext.readme || '').substring(0, 2000)}

Generate a detailed implementation guide with the following sections:

1. **Understanding the Issue**
   - What needs to be done
   - Why this change is needed
   - Expected outcome

2. **Technical Approach**
   - High-level solution strategy
   - Key files/components that need changes
   - Dependencies or prerequisites

3. **Step-by-Step Implementation**
   - Specific coding steps
   - Code snippets or examples where helpful
   - Testing approach

4. **Edge Cases & Considerations**
   - Potential challenges
   - Things to watch out for
   - Performance or security considerations

5. **Validation**
   - How to test the implementation
   - Acceptance criteria
   - How to verify the fix works

Keep the guide practical and actionable. Include code examples where relevant, but focus on the implementation strategy rather than complete code solutions.`;

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

		return json({
			guide,
			generated_at: new Date().toISOString()
		});
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
