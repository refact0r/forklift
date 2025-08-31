import { GITHUB_TOKEN } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function GET({ fetch, url }) {
	// Get user skills from query parameters
	const userSkillsParam = url.searchParams.get('skills');

	if (!userSkillsParam) {
		return json({
			recommendations: [],
			hasSkills: false,
			userSkills: [],
			error: null
		});
	}

	try {
		const userSkills = JSON.parse(decodeURIComponent(userSkillsParam));

		if (userSkills.length === 0) {
			return json({
				recommendations: [],
				hasSkills: false,
				userSkills: [],
				error: null
			});
		}

		// Build GitHub API queries based on user skills (limit to first 3 skills for faster loading)
		const topSkills = userSkills.slice(0, 3);

		const headers = {
			Accept: 'application/vnd.github.v3+json',
			'User-Agent': 'SvelteKit-Open-Source-Helper'
		};

		if (GITHUB_TOKEN) {
			headers.Authorization = `token ${GITHUB_TOKEN}`;
		}

		// Create topic-based search query - much more flexible
		const fullQuery = topSkills.join(' OR ') + ' stars:>10';
		const apiUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(fullQuery)}&sort=stars&order=desc&per_page=30`;

		const response = await fetch(apiUrl, { headers });
		
		if (!response.ok) {
			const errorText = await response.text();
			console.error('GitHub API error:', response.status, errorText);
			throw new Error(`Search failed: ${response.status} - ${errorText}`);
		}

		const data = await response.json();
		const allRepos = data.items.map((repo) => ({
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
			url: repo.html_url,
			matchedSkill:
				userSkills.find(
					(skill) =>
						// Check if skill matches language exactly
						skill.toLowerCase() === repo.language?.toLowerCase() ||
						// Check if skill appears in repo name, description, or topics
						repo.name.toLowerCase().includes(skill.toLowerCase()) ||
						repo.description?.toLowerCase().includes(skill.toLowerCase()) ||
						repo.topics.some((topic) => topic.toLowerCase().includes(skill.toLowerCase()))
				) || repo.language
		}));

		// Remove duplicates
		const uniqueRepos = allRepos.filter((repo, index, self) => {
			return index === self.findIndex((r) => r.fullName === repo.fullName);
		});

		// Score and sort repos
		const scoredRepos = uniqueRepos.map((repo) => {
			let score = 0;

			// Skill match bonus
			if (
				userSkills.some(
					(skill) =>
						skill.toLowerCase() === repo.language?.toLowerCase() ||
						repo.topics.some((topic) => topic.toLowerCase().includes(skill.toLowerCase()))
				)
			) {
				score += 3;
			}

			// Activity bonus (recent commits)
			const lastUpdate = new Date(repo.updatedAt);
			const daysSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
			if (daysSinceUpdate < 30) score += 2;
			else if (daysSinceUpdate < 90) score += 1;

			// Star range bonus (not too popular, not too unknown)
			if (repo.stars >= 50 && repo.stars <= 1000) score += 2;
			else if (repo.stars > 1000 && repo.stars <= 5000) score += 1;

			// Issues bonus
			if (repo.openIssues > 0) score += 1;

			return { ...repo, score };
		});

		// Sort by score and limit to 30
		const finalRecommendations = scoredRepos.sort((a, b) => b.score - a.score).slice(0, 30);

		return json({
			recommendations: finalRecommendations,
			hasSkills: true,
			userSkills: userSkills,
			error: null
		});
	} catch (error) {
		console.error('Error loading recommendations:', error);
		return json(
			{
				recommendations: [],
				hasSkills: false,
				userSkills: [],
				error: error.message
			},
			{ status: 500 }
		);
	}
}
