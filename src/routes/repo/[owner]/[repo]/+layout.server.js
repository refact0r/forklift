import { GITHUB_TOKEN } from '$env/static/private';

export async function load({ params, fetch, setHeaders }) {
	// cache for 1 hour
	setHeaders({
		'cache-control': 'max-age=3600'
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
		// Fetch main repository data (this is required)
		const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
			headers: baseHeaders
		});

		if (!repoResponse.ok) {
			throw new Error(
				repoResponse.status === 404
					? 'Repository not found'
					: `GitHub API error: ${repoResponse.status}`
			);
		}

		const repoData = await repoResponse.json();

		return {
			owner,
			repo,
			repoData: {
				name: repoData.name,
				full_name: repoData.full_name,
				description: repoData.description || 'No description available',
				stars: repoData.stargazers_count || 0,
				forks: repoData.forks_count || 0,
				language: repoData.language || 'Unknown',
				topics: repoData.topics || []
			}
		};
	} catch (error) {
		console.error('Failed to fetch GitHub repository data:', error);
		return {
			owner,
			repo,
			error: error.message,
			repoData: {
				name: `${repo}`,
				full_name: `${owner}/${repo}`,
				description: 'Could not load repository data',
				stars: 0,
				forks: 0,
				language: '',
				topics: []
			}
		};
	}
}
