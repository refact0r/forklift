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

	// Helper function to safely fetch data
	async function safeFetch(url, fallback = null) {
		try {
			const response = await fetch(url, { headers: baseHeaders });
			return response.ok ? await response.json() : fallback;
		} catch {
			return fallback;
		}
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

		// Fetch all data in parallel (these are optional)
		const [readmeData, contributingData, languagesData, treeData] = await Promise.all([
			safeFetch(`https://api.github.com/repos/${owner}/${repo}/readme`),
			safeFetch(`https://api.github.com/repos/${owner}/${repo}/contents/CONTRIBUTING.md`),
			safeFetch(`https://api.github.com/repos/${owner}/${repo}/languages`),
			safeFetch(
				`https://api.github.com/repos/${owner}/${repo}/git/trees/${repoData.default_branch}?recursive=1`
			)
		]);

		// Process README content
		const readmeContent = readmeData ? atob(readmeData.content) : null;

		// Process CONTRIBUTING.md content
		const contributingContent = contributingData ? atob(contributingData.content) : null;

		// Process languages
		const languages = languagesData ? Object.keys(languagesData) : [];

		// Find package files from tree data
		const packageFiles = {};
		if (treeData?.tree) {
			const packageFilenames = [
				'package.json',
				'requirements.txt',
				'Cargo.toml',
				'composer.json',
				'pom.xml',
				'go.mod',
				'Gemfile'
			];

			for (const item of treeData.tree) {
				if (item.type === 'blob' && packageFilenames.includes(item.path)) {
					const fileData = await safeFetch(
						`https://api.github.com/repos/${owner}/${repo}/contents/${item.path}`
					);
					if (fileData) {
						packageFiles[item.path] = atob(fileData.content);
					}
				}
			}
		}

		// Get file extensions for tech stack analysis
		const fileExtensions = treeData?.tree
			? [
					...new Set(
						treeData.tree
							.filter((item) => item.type === 'blob' && item.path.includes('.'))
							.map((item) => item.path.split('.').pop().toLowerCase())
							.filter((ext) => ext.length <= 4) // Filter out long extensions
					)
				]
			: [];

		// Prepare repo data for AI processing
		const repoDataForAI = {
			// Basic metadata
			name: repoData.name,
			full_name: repoData.full_name,
			description: repoData.description || 'No description available',
			stars: repoData.stargazers_count || 0,
			forks: repoData.forks_count || 0,
			language: repoData.language || 'Unknown',
			topics: repoData.topics || [],

			// Content for LLM processing
			readme: readmeContent,
			contributing: contributingContent,

			// Tech stack data
			languages: languages,
			fileExtensions: fileExtensions,
			packageFiles: packageFiles
		};

		// Call AI API to generate overview
		let overview = null;
		try {
			const overviewResponse = await fetch('/api/repo-overview', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ repoData: repoDataForAI })
			});

			if (overviewResponse.ok) {
				const overviewData = await overviewResponse.json();
				if (overviewData.success) {
					overview = overviewData.overview;
				}
			}
		} catch (error) {
			console.error('Failed to generate AI overview:', error);
		}

		return {
			owner,
			repo,
			repoData: {
				// Basic metadata
				name: repoData.name,
				full_name: repoData.full_name,
				description: repoData.description || 'No description available',
				stars: repoData.stargazers_count || 0,
				forks: repoData.forks_count || 0,
				language: repoData.language || 'Unknown',
				topics: repoData.topics || [],

				// Content for LLM processing
				readme: readmeContent,
				contributing: contributingContent,

				// Tech stack data
				languages: languages,
				fileExtensions: fileExtensions,
				packageFiles: packageFiles
			},
			overview: overview
		};
	} catch (error) {
		console.error('Failed to fetch GitHub repository data:', error);
		return {
			owner,
			repo,
			error: error.message,
			repoData: {
				name: `${owner}/${repo}`,
				full_name: `${owner}/${repo}`,
				description: 'Could not load repository data',
				stars: 0,
				forks: 0,
				language: 'Unknown',
				topics: [],
				readme: null,
				contributing: null,
				languages: [],
				fileExtensions: [],
				packageFiles: {}
			}
		};
	}
}
