<script>
	import { goto } from '$app/navigation';

	import SearchIcon from '~icons/ph/magnifying-glass';

	let repoUrl = '';

	function handleSearch() {
		if (repoUrl.trim()) {
			const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
			if (match) {
				const [, owner, repo] = match;
				goto(`/repo/${owner}/${repo}`);
			} else {
				alert('Please enter a valid GitHub repository URL');
			}
		}
	}

	function handleSuggestion(owner, repo) {
		goto(`/repo/${owner}/${repo}`);
	}

	function generateContributionData() {
		const cols = 20;
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
</script>

<div class="content">
	<div class="container">
		<div class="hero">
			<div class="left">
				<h1>your shortcut to <span>open source</span></h1>
				<p>find repositories, understand codebases, discover issues, and start contributing.</p>
			</div>
			<div class="right">
				<div class="graph-container">
					<div class="month-labels">
						<span style="grid-column: 1 / 6;">Nov</span>
						<span style="grid-column: 6 / 11;">Dec</span>
						<span style="grid-column: 11 / 16;">Jan</span>
						<span style="grid-column: 16 / 21;">Feb</span>
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
		<div class="search">
			<div class="searchbar">
				<SearchIcon />
				<input
					type="text"
					bind:value={repoUrl}
					placeholder="enter github repository url"
					onkeydown={(e) => e.key === 'Enter' && handleSearch()}
				/>
			</div>
			<button onclick={handleSearch}>start</button>
		</div>

		<!-- suggestions -->
	</div>
</div>

<style>
	h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2.5rem;
		line-height: 1.1;

		span {
			color: var(--acc-1);
		}
	}

	.content {
		padding: 2rem;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.container {
		display: flex;
		flex-direction: column;
		max-width: 50rem;
	}

	.hero {
		margin: 2rem 0;
		display: flex;
		gap: 3rem;
	}

	p {
		margin-bottom: 1rem;
	}

	.search {
		display: flex;
		gap: 1rem;
		width: 100%;
	}

	.searchbar {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.75rem;
		background: var(--bg-2);
		border: 1px solid var(--bg-3);

		&:focus-within {
			border-color: var(--acc-1);
		}
	}

	.graph-container {
		height: 100%;
		max-width: 500px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.month-labels {
		display: grid;
		grid-template-columns: repeat(20, 1fr);
		gap: 3px;
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
		gap: 3px;
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
		gap: 3px;
		margin-bottom: 1rem;
	}

	.week {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.day {
		width: 12px;
		height: 12px;
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
		gap: 3px;
	}

	.legend-square {
		width: 12px;
		height: 12px;
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
</style>
