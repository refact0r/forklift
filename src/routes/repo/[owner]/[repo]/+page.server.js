import { GITHUB_TOKEN } from '$env/static/private';

export async function load({ params, fetch }) {
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

		// Fetch additional data in parallel (these are optional)
		const [readmeData, languagesData, treeData] = await Promise.all([
			safeFetch(`https://api.github.com/repos/${owner}/${repo}/readme`),
			safeFetch(`https://api.github.com/repos/${owner}/${repo}/languages`),
			safeFetch(
				`https://api.github.com/repos/${owner}/${repo}/git/trees/${repoData.default_branch}?recursive=1`
			)
		]);

		// Process the optional data
		const readmeContent = readmeData
			? atob(readmeData.content).slice(0, 1000)
			: 'No README available';
		const languages = languagesData ? Object.keys(languagesData) : [];
		const fileStructure = treeData?.tree
			? treeData.tree
					.filter((item) => item.type === 'blob')
					.map((item) => item.path)
					.slice(0, 50)
					.join('\n')
			: 'File structure could not be loaded';

		return {
			owner,
			repo,
			repoData: {
				name: repoData.name,
				description: repoData.description || 'No description available',
				stars: repoData.stargazers_count || 0,
				forks: repoData.forks_count || 0,
				language: repoData.language || 'Unknown',
				topics: repoData.topics || [],
				readme: readmeContent,
				techStack: languages,
				fileStructure
			}
		};
	} catch (error) {
		return {
			owner,
			repo,
			error: error.message,
			repoData: {
				name: `${owner}/${repo}`,
				description: 'Could not load repository data',
				stars: 0,
				forks: 0,
				language: 'Unknown',
				topics: [],
				readme: 'Could not load README',
				techStack: [],
				fileStructure: 'Could not load file structure'
			}
		};
	}
}
