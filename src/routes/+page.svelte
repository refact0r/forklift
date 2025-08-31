<script>
	import { goto } from '$app/navigation';
	import SearchIcon from '~icons/ph/magnifying-glass';
	import RepoCard from '$lib/components/RepoCard.svelte';

	let searchInput = $state('');

	function detectSearchType(input) {
		const githubUrlPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
		return githubUrlPattern.test(input) ? 'direct' : 'search';
	}

	// Handle search submission
	function handleSearch() {
		const input = searchInput.trim();
		if (!input) return;

		const searchType = detectSearchType(input);

		if (searchType === 'direct') {
			const match = input.match(/github\.com\/([^\/]+)\/([^\/]+)/);
			if (match) {
				const [, owner, repo] = match;
				goto(`/repo/${owner}/${repo}`);
			}
		} else {
			goto(`/search?q=${encodeURIComponent(input)}`);
		}
	}

	function generateContributionData() {
		const cols = 24;
		const rows = 7;
		const data = [];

		for (let week = 0; week < cols; week++) {
			const weekData = [];
			for (let day = 0; day < rows; day++) {
				const random = Math.random();
				let level;
				if (random < 0.3) level = 0;
				else if (random < 0.5) level = 1;
				else if (random < 0.7) level = 2;
				else if (random < 0.9) level = 3;
				else level = 4;
				weekData.push(level);
			}
			data.push(weekData);
		}
		return data;
	}

	const contributionData = generateContributionData();

	// Mock repo data for popular repositories
	const popularRepos = [
		{
			owner: 'refact0r',
			name: 'roocodehack',
			fullName: 'refact0r/roocodehack',
			description: 'Your shortcut to open source - find repositories, understand codebases, discover issues, and start contributing.',
			stars: 1,
			forks: 1,
			language: 'Svelte',
			topics: ['open-source', 'contributing', 'github', 'developer-tools'],
			openIssues: 0,
			updatedAt: '2025-01-27T12:00:00Z'
		},
		{
			owner: 'microsoft',
			name: 'vscode',
			fullName: 'microsoft/vscode',
			description: 'Visual Studio Code',
			stars: 162000,
			forks: 28500,
			language: 'TypeScript',
			topics: [],
			openIssues: 5200,
			updatedAt: '2025-08-30T08:15:00Z'
		},
		{
			owner: 'nodejs',
			name: 'node',
			fullName: 'nodejs/node',
			description: 'Node.js JavaScript runtime',
			stars: 106000,
			forks: 28800,
			language: 'JavaScript',
			topics: [],
			openIssues: 1650,
			updatedAt: '2025-08-29T16:45:00Z'
		},
		{
			owner: 'vercel',
			name: 'next.js',
			fullName: 'vercel/next.js',
			description: 'The React Framework for the Web',
			stars: 124000,
			forks: 26400,
			language: 'JavaScript',
			topics: [],
			openIssues: 2100,
			updatedAt: '2025-08-30T12:20:00Z'
		}
	];
</script>

<div class="content">
	<div class="hero">
		<div class="left">
			<h1>your shortcut to <span>open source</span></h1>
			<p>find repositories, understand codebases, discover issues, and start contributing.</p>
		</div>
		<div class="right">
			<div class="graph-container">
				<div class="month-labels">
					<span style="grid-column: 1 / 6;">Sep</span>
					<span style="grid-column: 6 / 10;">Nov</span>
					<span style="grid-column: 11 / 16;">Dec</span>
					<span style="grid-column: 16 / 21;">Jan</span>
					<span style="grid-column: 21 / 25;">Feb</span>
				</div>

				<div class="graph-with-days">
					<div class="day-labels">
						<span></span>
						<span>Mon</span>
						<span></span>
						<span>Wed</span>
						<span></span>
						<span>Fri</span>
						<span></span>
					</div>

					<div class="graph-grid">
						{#each contributionData as week}
							<div class="week">
								{#each week as day}
									<div class="day level-{day}" title="Contributions"></div>
								{/each}
							</div>
						{/each}
					</div>
				</div>

				<div class="graph-legend">
					<span>less</span>
					<div class="legend-squares">
						<div class="legend-square level-0"></div>
						<div class="legend-square level-1"></div>
						<div class="legend-square level-2"></div>
						<div class="legend-square level-3"></div>
						<div class="legend-square level-4"></div>
					</div>
					<span>more</span>
				</div>
			</div>
		</div>
	</div>
	<div class="search-container">
		<div class="searchbar">
			<SearchIcon />
			<input
				type="text"
				bind:value={searchInput}
				onkeydown={(e) => e.key === 'Enter' && handleSearch()}
				placeholder="enter github url or search repositories..."
			/>
		</div>
		<button onclick={handleSearch} class="accent">
			{detectSearchType(searchInput) === 'direct' ? 'analyze' : 'search'}
		</button>
	</div>

	<div class="suggestions">
		<h3>popular repositories</h3>
		<div class="suggestion-grid">
			{#each popularRepos as repo}
				<RepoCard {repo} />
			{/each}
		</div>
	</div>
</div>

<style>
	h1 {
		margin: 0 0 1.5rem 0;
		font-size: 3rem;
		line-height: 1.1;

		span {
			color: var(--acc-1);
		}
	}

	.hero {
		margin: 2rem 0;
		display: flex;
		gap: 4rem;
	}

	p {
		margin-bottom: 1rem;
	}

	.search-container {
		margin-bottom: 3rem;
	}

	.graph-container {
		height: 100%;
		max-width: 500px;
		display: flex;
		flex-direction: column;
		justify-content: center;

		--gap: 4px;
		--width: 14px;
	}

	.month-labels {
		display: grid;
		grid-template-columns: repeat(24, 1fr);
		gap: var(--gap);
		margin-bottom: 0.25rem;
		padding-left: 2rem;
		font-size: 0.75rem;
	}

	.graph-with-days {
		display: flex;
		gap: 0.5rem;
		align-items: flex-start;
	}

	.day-labels {
		display: flex;
		flex-direction: column;
		gap: var(--gap);
		font-size: 0.75rem;
		width: 1.5rem;
		text-align: right;
		line-height: 12px;
	}

	.day-labels span {
		height: 12px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.graph-grid {
		display: flex;
		gap: var(--gap);
		margin-bottom: 1rem;
	}

	.week {
		display: flex;
		flex-direction: column;
		gap: var(--gap);
	}

	.day {
		width: var(--width);
		height: var(--width);
	}

	.graph-legend {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-size: 0.75rem;
	}

	.legend-squares {
		display: flex;
		gap: var(--gap);
	}

	.legend-square {
		width: var(--width);
		height: var(--width);
	}

	.level-0 {
		background: var(--acc-1);
		opacity: 0.1;
	}
	.level-1 {
		background: var(--acc-1);
		opacity: 0.325;
	}
	.level-2 {
		background: var(--acc-1);
		opacity: 0.55;
	}
	.level-3 {
		background: var(--acc-1);
		opacity: 0.775;
	}
	.level-4 {
		background: var(--acc-1);
		opacity: 1;
	}

	.suggestion-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(25rem, 1fr));
		gap: 1rem;
	}
</style>
