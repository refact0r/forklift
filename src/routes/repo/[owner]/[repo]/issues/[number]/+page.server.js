import { error } from '@sveltejs/kit';

export async function load({ params, parent, fetch }) {
	try {
		// Get parent data (repo info and README)
		const parentData = await parent();

		const { owner, repo, number } = params; // Fetch specific issue from GitHub API
		const issueResponse = await fetch(
			`https://api.github.com/repos/${owner}/${repo}/issues/${number}`
		);

		if (!issueResponse.ok) {
			if (issueResponse.status === 404) {
				throw error(404, 'Issue not found');
			}
			throw error(issueResponse.status, 'Failed to fetch issue');
		}

		const issue = await issueResponse.json();

		// Check if this is actually a pull request
		if (issue.pull_request) {
			throw error(400, 'This is a pull request, not an issue');
		}

		// Prepare context for AI analysis
		const repoContext = {
			name: `${owner}/${repo}`,
			description: parentData.description || '',
			readme: parentData.readme || '',
			languages: parentData.languages || {},
			topics: parentData.topics || []
		};

		// Get AI analysis for this specific issue
		let aiAnalysis = null;
		try {
			const classifyResponse = await fetch('/api/classify-issues', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					issues: [issue],
					repoContext
				})
			});

			if (classifyResponse.ok) {
				const classifiedData = await classifyResponse.json();
				aiAnalysis = classifiedData.issues?.[0]?.ai_analysis || null;
			}
		} catch (err) {
			console.error('Failed to get AI analysis:', err);
		}

		// Generate implementation guide using AI
		let implementationGuide = null;
		try {
			const guideResponse = await fetch('/api/implementation-guide', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					issue,
					repoContext,
					aiAnalysis
				})
			});

			if (guideResponse.ok) {
				const guideData = await guideResponse.json();
				implementationGuide = guideData.guide;
			}
		} catch (err) {
			console.error('Failed to get implementation guide:', err);
		}

		return {
			owner,
			repo,
			issue,
			aiAnalysis,
			implementationGuide,
			repoContext
		};
	} catch (err) {
		console.error('Error in issue page load:', err);
		if (err.status) {
			throw err; // Re-throw SvelteKit errors
		}
		throw error(500, 'Failed to load issue data');
	}
}
