const BACKEND_URL = 'https://opensauce-ffw3451di-derek-yao-s-projects.vercel.app';

export async function analyzeRepo(repoUrl, maxIssues = 30) {
	try {
		const response = await fetch(`${BACKEND_URL}/analyze`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json'
			},
			body: JSON.stringify({
				repo_url: repoUrl,
				max_issues: maxIssues
			})
		});

		if (!response.ok) {
			throw new Error(`Analyze API error: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error calling analyze API:', error);
		throw error;
	}
}

export async function classifyIssues(context, issues, batchSize = 20) {
	try {
		const response = await fetch(`${BACKEND_URL}/classify-issues`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json'
			},
			body: JSON.stringify({
				context: context,
				issues: issues,
				batch_size: batchSize
			})
		});

		if (!response.ok) {
			throw new Error(`Classify API error: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error calling classify API:', error);
		throw error;
	}
}
