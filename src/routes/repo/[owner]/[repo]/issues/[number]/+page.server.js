import { error } from '@sveltejs/kit';
import { GITHUB_TOKEN } from '$env/static/private';

export async function load({ params, parent, fetch }) {
	try {
		// Get parent data (includes classified issues and repo context)
		const parentData = await parent();
		const { classifiedIssues, repoContext } = parentData;

		const { owner, repo, number } = params;
		const issueNumber = parseInt(number);

		// First, try to find the issue in our classified issues
		let issue = classifiedIssues?.find((issue) => issue.number === issueNumber);
		let aiAnalysis = issue?.ai_analysis || null;

		// If not found in classified issues, fetch it directly from GitHub
		if (!issue) {
			const baseHeaders = {
				Accept: 'application/vnd.github.v3+json'
			};

			if (GITHUB_TOKEN) {
				baseHeaders.Authorization = `token ${GITHUB_TOKEN}`;
			}

			const issueResponse = await fetch(
				`https://api.github.com/repos/${owner}/${repo}/issues/${number}`,
				{ headers: baseHeaders }
			);

			if (!issueResponse.ok) {
				if (issueResponse.status === 404) {
					throw error(404, 'Issue not found');
				}
				throw error(issueResponse.status, 'Failed to fetch issue');
			}

			issue = await issueResponse.json();

			// Check if this is actually a pull request
			if (issue.pull_request) {
				throw error(400, 'This is a pull request, not an issue');
			}

			// Since this issue wasn't in our classified list, generate AI analysis for it
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
			...parentData,
			issue,
			aiAnalysis,
			implementationGuide
		};
	} catch (err) {
		console.error('Error in issue page load:', err);
		if (err.status) {
			throw err; // Re-throw SvelteKit errors
		}
		throw error(500, 'Failed to load issue data');
	}
}
