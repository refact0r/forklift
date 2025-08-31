import { GITHUB_TOKEN } from '$env/static/private';
import { cacheWrapper, generateCacheKey } from '$lib/cache.js';

export async function load({ params, fetch }) {
	const { owner, repo } = params;

	// Create cache key for this repository
	const cacheKey = generateCacheKey('repo', owner, repo);

	// Use cache wrapper to get data
	const result = await cacheWrapper(
		cacheKey,
		async () => {
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

				const basicRepoData = await repoResponse.json();

				// Fetch detailed data needed for AI processing (these are optional)
				const [readmeData, languagesData, treeData] = await Promise.all([
					safeFetch(`https://api.github.com/repos/${owner}/${repo}/readme`),
					// safeFetch(`https://api.github.com/repos/${owner}/${repo}/contents/CONTRIBUTING.md`),
					safeFetch(`https://api.github.com/repos/${owner}/${repo}/languages`),
					safeFetch(
						`https://api.github.com/repos/${owner}/${repo}/git/trees/${basicRepoData.default_branch || 'main'}?recursive=1`
					)
				]);

				// Process README content
				const readmeContent = readmeData ? atob(readmeData.content) : null;

				// Process CONTRIBUTING.md content
				// const contributingContent = contributingData ? atob(contributingData.content) : null;

				// Process languages
				const languages = languagesData || {};

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

				return {
					owner,
					repo,
					repoData: {
						// Basic metadata
						name: basicRepoData.name,
						full_name: basicRepoData.full_name,
						description: basicRepoData.description || 'No description available',
						stars: basicRepoData.stargazers_count || 0,
						forks: basicRepoData.forks_count || 0,
						language: basicRepoData.language || 'Unknown',
						topics: basicRepoData.topics || [],
						default_branch: basicRepoData.default_branch || 'main',

						// Content for LLM processing
						readme: readmeContent,
						// contributing: contributingContent,

						// Tech stack data
						languages: languages,
						fileExtensions: fileExtensions,
						packageFiles: packageFiles
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
						topics: [],
						default_branch: 'main',
						readme: null,
						// contributing: null,
						languages: {},
						fileExtensions: [],
						packageFiles: {}
					}
				};
			}
		},
		3600 // Cache for 1 hour
	);

	return result;
}
