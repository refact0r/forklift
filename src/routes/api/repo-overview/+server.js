import { OPENAI_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import OpenAI from 'openai';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY
});

export async function POST({ request }) {
	let repoData;

	try {
		const requestData = await request.json();
		repoData = requestData.repoData;

		if (!OPENAI_API_KEY) {
			throw new Error('OpenAI API key not configured');
		}

		// Prepare data for LLM processing
		const packageInfo = Object.entries(repoData.packageFiles || {})
			.map(([filename, content]) => `${filename}: ${content?.slice(0, 200)}...`)
			.join('\n');

		const prompt = `You are a repository onboarding assistant that helps newcomers understand GitHub repositories. Generate 3 sections based on the repository data below. 

1. quick_context: Human-readable summary (what/who/why the project exists).
2. project_landscape: Two concise, comma separated list of languages and frameworks/tools needed.
3. onboarding_essentials: Distilled prerequisites and setup instructions in MARKDOWN format. There should be no h1 or starting text.

RETURN STRICT JSON: {
  "quick_context": {
    "what": "Description of what the project does (1-2 sentences)",
    "who": "Target audience and users (1 sentence)", 
    "why": "Why this project matters and what problems it solves (1 sentence)"
  },
  "project_landscape": {
    "languages": ["JavaScript", "TypeScript", etc.],
    "tools": ["React", "Next.js", "Tailwind", etc.],
  },
  "onboarding_essentials": "Setup instructions in MARKDOWN format"
}

REPOSITORY DATA:
REPO: ${repoData.full_name}
DESCRIPTION: ${repoData.description}
STARS: ${repoData.stars} | LANGUAGE: ${repoData.language}
TOPICS: ${repoData.topics?.join(', ') || 'None'}
TECH STACK DATA:
- Languages: ${Object.keys(repoData.languages || {}).join(', ') || 'Unknown'}
- File extensions: ${repoData.fileExtensions?.slice(0, 20).join(', ') || 'None'}

README CONTENT:
${repoData.readme?.slice(0, 10000) || 'No README available'}

PACKAGE FILES:
${packageInfo || 'No package files found'}`;

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

		// Parse the JSON response - if this fails, it'll be caught by the outer try-catch
		const parsedContent = JSON.parse(content);

		return json({
			success: true,
			overview: parsedContent
		});
	} catch (error) {
		console.error('Error generating repo overview:', error);

		// Return fallback response for any error (API, network, JSON parsing, etc.)
		const fallbackOverview = {
			project_landscape: {
				languages:
					Object.keys(repoData?.languages || {}) || [repoData?.language].filter(Boolean) || [],
				frameworks: [],
				tools: [],
				skills: []
			},
			quick_context: {
				what: repoData?.description || 'Repository analysis failed',
				who: '',
				why: ''
			},
			onboarding_essentials: `## Getting Started

Please check the repository README for setup instructions.

### Prerequisites
- Git
- Basic programming knowledge

### Setup
1. Clone the repository
2. Follow the README instructions`
		};

		return json(
			{
				success: false,
				error: error.message,
				overview: fallbackOverview
			},
			{ status: 500 }
		);
	}
}

// CONTRIBUTING GUIDELINES:
// ${repoData.contributing?.slice(0, 10000) || 'No CONTRIBUTING.md found'}
