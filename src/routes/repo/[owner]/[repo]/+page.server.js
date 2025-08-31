export async function load({ fetch, parent }) {
	// Get detailed repo data from parent layout
	const { repoData, owner, repo, error } = await parent();

	// If there was an error getting repo data, pass it through
	if (error) {
		return { owner, repo, error, repoData, overview: null };
	}

	try {
		// Call AI API to generate overview using the detailed repo data from layout
		let overview = null;
		try {
			const overviewResponse = await fetch('/api/repo-overview', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ repoData })
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
			repoData,
			overview
		};
	} catch (error) {
		console.error('Failed to generate overview:', error);
		return {
			owner,
			repo,
			repoData,
			overview: null
		};
	}
}
