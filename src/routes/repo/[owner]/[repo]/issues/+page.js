import { GITHUB_TOKEN } from '$env/static/private';

export async function load({ params, fetch }) {
	const { owner, repo } = params;

	const headers = {
		Accept: 'application/vnd.github.v3+json',
		'User-Agent': 'SvelteKit-Open-Source-Helper'
	};

	// Add GitHub token if available
	if (GITHUB_TOKEN) {
		headers.Authorization = `token ${GITHUB_TOKEN}`;
	}

	try {
		// Fetch open issues from GitHub API
		const issuesResponse = await fetch(
			`https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=50`,
			{ headers }
		);
		if (!issuesResponse.ok) {
			throw new Error(`Failed to fetch issues: ${issuesResponse.status}`);
		}

		const issuesData = await issuesResponse.json();

		// Filter out pull requests (GitHub API returns both issues and PRs)
		const issues = issuesData
			.filter((issue) => !issue.pull_request)
			.map((issue) => ({
				id: issue.number,
				title: issue.title,
				description: issue.body
					? issue.body.slice(0, 300) + (issue.body.length > 300 ? '...' : '')
					: 'No description available',
				difficulty: assignDifficulty(issue),
				timeEstimate: estimateTime(issue),
				labels: issue.labels.map((label) => label.name),
				aiGuidance: generateBasicGuidance(issue),
				url: issue.html_url,
				comments: issue.comments,
				created: issue.created_at,
				author: issue.user.login
			}));

		return {
			owner,
			repo,
			issues
		};
	} catch (error) {
		console.error('Error loading issues:', error);

		return {
			owner,
			repo,
			issues: [],
			error: error.message
		};
	}
}

// Simple difficulty assignment based on labels and content
function assignDifficulty(issue) {
	const title = issue.title.toLowerCase();
	const body = (issue.body || '').toLowerCase();
	const labels = issue.labels.map((label) => label.name.toLowerCase());

	// Easy indicators
	if (
		labels.some(
			(label) =>
				label.includes('good first issue') ||
				label.includes('beginner') ||
				label.includes('documentation') ||
				label.includes('typo')
		)
	) {
		return 'easy';
	}

	if (
		title.includes('typo') ||
		title.includes('docs') ||
		title.includes('readme') ||
		body.includes('simple') ||
		body.includes('easy')
	) {
		return 'easy';
	}

	// Hard indicators
	if (
		labels.some(
			(label) =>
				label.includes('enhancement') ||
				label.includes('feature') ||
				label.includes('architecture') ||
				label.includes('breaking')
		)
	) {
		return 'hard';
	}

	if (
		title.includes('implement') ||
		title.includes('architecture') ||
		title.includes('refactor') ||
		body.includes('complex') ||
		body.includes('breaking change')
	) {
		return 'hard';
	}

	// Default to medium
	return 'medium';
}

// Simple time estimation based on difficulty and complexity indicators
function estimateTime(issue) {
	const difficulty = assignDifficulty(issue);
	const title = issue.title.toLowerCase();
	const body = (issue.body || '').toLowerCase();

	// Check for complexity indicators
	const isSimple = title.includes('fix') || title.includes('update') || body.includes('small');
	const isComplex =
		title.includes('implement') || title.includes('add') || body.includes('feature');

	switch (difficulty) {
		case 'easy':
			return isSimple ? '1-2 hours' : '2-4 hours';
		case 'medium':
			return isComplex ? '1-2 days' : '4-8 hours';
		case 'hard':
			return isComplex ? '1-2 weeks' : '3-5 days';
		default:
			return '4-8 hours';
	}
}

// Generate basic guidance based on issue content
function generateBasicGuidance(issue) {
	const title = issue.title.toLowerCase();
	const labels = issue.labels.map((label) => label.name.toLowerCase());

	if (labels.some((label) => label.includes('bug'))) {
		return 'Start by reproducing the bug described in the issue. Look for related test files and examine the affected components. Check recent commits that might have introduced this issue.';
	}

	if (labels.some((label) => label.includes('documentation') || label.includes('docs'))) {
		return "Review the existing documentation structure. Look for README files, doc folders, or inline code comments that need updating. Ensure consistency with the project's documentation style.";
	}

	if (labels.some((label) => label.includes('feature') || label.includes('enhancement'))) {
		return 'Understand the feature requirements by reading the issue description carefully. Look at similar existing features in the codebase for patterns. Consider creating tests first (TDD approach).';
	}

	if (title.includes('test')) {
		return 'Examine the existing test structure and frameworks used in the project. Look for test files in __tests__, spec, or test directories. Follow the established testing patterns and conventions.';
	}

	return 'Start by exploring the codebase to understand the project structure. Read the contributing guidelines if available. Look for related files and components mentioned in the issue description.';
}
