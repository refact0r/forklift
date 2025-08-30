import { GITHUB_TOKEN } from '$env/static/private';

export async function load({ params, fetch, setHeaders }) {
	// cache for 30 minutes
	setHeaders({
		'cache-control': 'max-age=1800'
	});

	const { owner, repo } = params;

	const baseHeaders = {
		Accept: 'application/vnd.github.v3+json'
	};

	// Add GitHub token if available
	if (GITHUB_TOKEN) {
		baseHeaders.Authorization = `token ${GITHUB_TOKEN}`;
	}

	try {
		// Fetch open issues
		const issuesResponse = await fetch(
			`https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=20`,
			{ headers: baseHeaders }
		);

		if (!issuesResponse.ok) {
			throw new Error(`GitHub API error: ${issuesResponse.status}`);
		}

		const issues = await issuesResponse.json();

		return {
			issues: issues || []
		};
	} catch (error) {
		console.error('Failed to fetch GitHub issues:', error);
		return {
			issues: [],
			error: error.message
		};
	}
}
