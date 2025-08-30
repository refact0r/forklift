import { GITHUB_TOKEN } from '$env/static/private';

const BACKEND_URL = 'https://opensauce-ffw3451di-derek-yao-s-projects.vercel.app';

export async function load({ params, fetch }) {
	const { owner, repo } = params;

	const headers = {
		Accept: 'application/vnd.github.v3+json',
		'User-Agent': 'SvelteKit-Open-Source-Helper'
	};

	// Add GitHub token if available
	if (GITHUB_TOKEN) {
		headers.Authorization = `token ${GITHUB_TOKEN}`;
		console.log('✅ Using GitHub token for API requests');
	} else {
		console.log('⚠️ No GitHub token available, using public API limits');
	}

	try {
		// Step 1: Fetch open issues from GitHub API
		console.log(`🔍 Fetching issues from GitHub: ${owner}/${repo}`);
		const issuesResponse = await fetch(
			`https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=10`,
			{ headers }
		);

		if (!issuesResponse.ok) {
			throw new Error(`Failed to fetch issues: ${issuesResponse.status}`);
		}

		const githubIssues = await issuesResponse.json();
		console.log(`✅ GitHub API returned ${githubIssues.length} issues`);

		// Filter out pull requests (issues only)
		const actualIssues = githubIssues.filter((issue) => !issue.pull_request);
		console.log(`📋 Found ${actualIssues.length} actual issues (not PRs)`);

		// If no issues, return early without calling classification API
		if (actualIssues.length === 0) {
			console.log('⚠️ No issues found, skipping classification API call');
			return {
				owner,
				repo,
				issues: [],
				error: null
			};
		}

		// Step 2: Call classification API with up to 5 issues
		console.log('🤖 Testing classification API...');
		const issuesToClassify = actualIssues.slice(0, 5).map((issue) => ({
			number: issue.number,
			title: issue.title,
			url: issue.html_url
		}));

		const classificationResponse = await fetch(`${BACKEND_URL}/classify-issues`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json'
			},
			body: JSON.stringify({
				context: {
					repo: `${owner}/${repo}`,
					repo_url: `https://github.com/${owner}/${repo}`
				},
				issues: issuesToClassify,
				batch_size: 5
			})
		});

		console.log(`📡 Classification API response status: ${classificationResponse.status}`);

		if (!classificationResponse.ok) {
			throw new Error(`Classification API error: ${classificationResponse.status}`);
		}

		const classificationResult = await classificationResponse.json();
		console.log('✅ Classification API success!');
		console.log('📊 Classification result:', JSON.stringify(classificationResult, null, 2));

		return {
			owner,
			repo,
			issues: classificationResult.issues || [],
			error: null
		};
	} catch (error) {
		console.error('❌ Error in load function:', error);
		return {
			owner,
			repo,
			issues: [],
			error: error.message
		};
	}
}
