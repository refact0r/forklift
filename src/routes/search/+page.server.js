import { GITHUB_TOKEN } from '$env/static/private';

export async function load({ url, fetch, setHeaders }) {
	const query = url.searchParams.get('q');

	// Set cache headers for 1 hour
	setHeaders({
		'cache-control': 'public, max-age=3600, s-maxage=3600'
	});

	if (!query) {
		return {
			query: '',
			results: [],
			hasSearched: false
		};
	}

	const headers = {
		Accept: 'application/vnd.github.v3+json'
	};

	// Add GitHub token if available
	if (GITHUB_TOKEN) {
		headers.Authorization = `token ${GITHUB_TOKEN}`;
	}

	try {
		// Enhanced search query for beginner-friendly repos
		const response = await fetch(
			`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=20`,
			{ headers }
		);

		if (!response.ok) {
			throw new Error(`Search failed: ${response.status}`);
		}

		const data = await response.json();

		const results = data.items.map((repo) => ({
			id: repo.id,
			name: repo.name,
			fullName: repo.full_name,
			owner: repo.owner.login,
			description: repo.description,
			stars: repo.stargazers_count,
			forks: repo.forks_count,
			language: repo.language,
			topics: repo.topics || [],
			openIssues: repo.open_issues_count,
			updatedAt: repo.updated_at,
			url: repo.html_url
		}));

		return {
			query,
			results,
			hasSearched: true,
			totalCount: data.total_count
		};
	} catch (error) {
		console.error('Search error:', error);

		return {
			query,
			results: [],
			hasSearched: true,
			error: error.message
		};
	}
}
