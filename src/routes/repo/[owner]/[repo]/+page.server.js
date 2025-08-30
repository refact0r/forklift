import { GITHUB_TOKEN } from '$env/static/private';

export async function load({ fetch, parent }) {
	// Get basic repo data from parent layout
	const { repoData: basicRepoData, owner, repo, error } = await parent();

	// If there was an error getting basic repo data, pass it through
	if (error) {
		return { owner, repo, error, repoData: basicRepoData };
	}

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
		// Fetch detailed data needed for AI processing (these are optional)
		const [readmeData, contributingData, languagesData, treeData] = await Promise.all([
			safeFetch(`https://api.github.com/repos/${owner}/${repo}/readme`),
			safeFetch(`https://api.github.com/repos/${owner}/${repo}/contents/CONTRIBUTING.md`),
			safeFetch(`https://api.github.com/repos/${owner}/${repo}/languages`),
			safeFetch(
				`https://api.github.com/repos/${owner}/${repo}/git/trees/${basicRepoData.default_branch || 'main'}?recursive=1`
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
			// Basic metadata from layout
			...basicRepoData,

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
			repoData: repoDataForAI,
			overview: overview
		};
	} catch (error) {
		console.error('Failed to fetch detailed GitHub repository data:', error);
		return {
			owner,
			repo,
			repoData: {
				...basicRepoData,
				readme: null,
				contributing: null,
				languages: [],
				fileExtensions: [],
				packageFiles: {}
			},
			overview: null
		};
	}
}
