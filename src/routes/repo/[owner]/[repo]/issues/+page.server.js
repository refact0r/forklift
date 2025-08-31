import { GITHUB_TOKEN } from '$env/static/private';

export async function load({ fetch, parent }) {
	// Get detailed repo data from parent layout
	const { repoData, owner, repo, error } = await parent();

	// If there was an error getting repo data, pass it through
	if (error) {
		return { owner, repo, error, classifiedIssues: [] };
	}

	const baseHeaders = {
		Accept: 'application/vnd.github.v3+json'
	};

	// Add GitHub token if available
	if (GITHUB_TOKEN) {
		baseHeaders.Authorization = `token ${GITHUB_TOKEN}`;
	}

	try {
		// Fetch open issues from GitHub
		const issuesResponse = await fetch(
			`https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=30`,
			{ headers: baseHeaders }
		);

		if (!issuesResponse.ok) {
			throw new Error(`GitHub API error: ${issuesResponse.status}`);
		}

		const githubIssues = await issuesResponse.json();

		// Filter out pull requests (issues only)
		const actualIssues = githubIssues.filter((issue) => !issue.pull_request);

		// If no issues, return early
		if (actualIssues.length === 0) {
			return { owner, repo, classifiedIssues: [] };
		}

		// Prepare issues for AI classification
		const issuesToClassify = actualIssues.slice(0, 10).map((issue) => ({
			number: issue.number,
			title: issue.title,
			body: issue.body ? issue.body.slice(0, 2000) : '',
			labels: issue.labels.map((label) => label.name),
			comments: issue.comments,
			html_url: issue.html_url,
			created_at: issue.created_at,
			user: issue.user
		}));

		// Prepare repository context for AI (now available from layout)
		const repoContext = {
			name: repoData.full_name,
			description: repoData.description,
			languages: repoData.languages || {},
			readme: repoData.readme ? repoData.readme.slice(0, 2000) : '',
			fileExtensions: repoData.fileExtensions || []
		};

		// Call AI to classify issues
		let classifiedIssues = [];
		try {
			const classificationResponse = await fetch('/api/classify-issues', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					repoContext,
					issues: issuesToClassify
				})
			});

			if (classificationResponse.ok) {
				const classificationData = await classificationResponse.json();
				if (classificationData.success) {
					classifiedIssues = classificationData.issues;
				}
			}
		} catch (error) {
			console.error('Failed to classify issues:', error);
		}

		// Fallback: return issues with basic data if AI classification fails
		if (classifiedIssues.length === 0) {
			classifiedIssues = issuesToClassify.map((issue) => ({
				...issue,
				ai_analysis: {
					difficulty: 'medium',
					difficulty_score: 2,
					topics: [],
					summary: 'AI analysis unavailable'
				}
			}));
		}

		return {
			owner,
			repo,
			classifiedIssues
		};
	} catch (error) {
		console.error('Failed to fetch GitHub issues:', error);
		return {
			owner,
			repo,
			classifiedIssues: [],
			error: error.message
		};
	}
}
