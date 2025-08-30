<script>
	import { goto } from '$app/navigation';
	import SearchIcon from '~icons/ph/magnifying-glass';
	import StarIcon from '~icons/ph/star';
	import ForkIcon from '~icons/ph/git-fork';

	let { data } = $props();
	let searchInput = $state(data.query || '');

	// Handle search submission
	function handleSearch() {
		const input = searchInput.trim();
		if (!input) return;
		goto(`/search?q=${encodeURIComponent(input)}`);
	}

	// Handle repository selection
	function handleRepoSelect(repo) {
		goto(`/repo/${repo.owner}/${repo.name}`);
	}

	// Format date
	function formatDate(dateString) {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleDateString();
	}

	// Format large numbers
	function formatNumber(num) {
		if (num >= 1000) {
			return (num / 1000).toFixed(1) + 'k';
		}
		return num.toString();
	}
</script>

<div class="content">
	<div class="header">
		<h1>search repositories</h1>
	</div>

	<div class="search-container">
		<div class="searchbar">
			<SearchIcon />
			<input
				type="text"
				bind:value={searchInput}
				onkeydown={(e) => e.key === 'Enter' && handleSearch()}
				placeholder="search repositories..."
			/>
		</div>
		<button onclick={handleSearch} class="accent">search</button>
	</div>

	{#if data.hasSearched}
		<div class="results-section">
			{#if data.error}
				<div class="message">
					<h2>search error</h2>
					<p>try a different search term or check your connection.</p>
				</div>
			{:else if data.results.length === 0}
				<div class="message">
					<h2>no results found</h2>
					<p>no repositories found for "{data.query}"</p>
					<p>try specific names or keywords like "ai" or "web"</p>
				</div>
			{:else}
				<p>{data.totalCount} repositories found for "{data.query}"</p>

				<div class="results-grid">
					{#each data.results as repo}
						<a class="repo-card" href={`/repo/${repo.owner}/${repo.name}`}>
							<div class="repo-header">
								<h3 class="repo-name">{repo.fullName}</h3>
								<div class="repo-stats">
									<span class="stars"><StarIcon /> {formatNumber(repo.stars)}</span>
									<span class="forks"><ForkIcon /> {formatNumber(repo.forks)}</span>
								</div>
							</div>

							{#if repo.description}
								<p class="repo-description">{repo.description}</p>
							{/if}

							<div class="repo-meta">
								<div class="repo-details">
									{#if repo.language}
										<span class="language">{repo.language}</span>
									{/if}

									{#if repo.openIssues > 0}
										<span class="open-issues">{repo.openIssues} issues</span>
									{/if}
									<span class="updated">updated {formatDate(repo.updatedAt)}</span>
								</div>
								{#if repo.topics.length > 0}
									<div class="repo-topics">
										{#each repo.topics.slice(0, 4) as topic}
											<span class="topic">{topic}</span>
										{/each}
										{#if repo.topics.length > 4}
											<span class="topic-more">+{repo.topics.length - 4}</span>
										{/if}
									</div>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	{:else}
		<div class="message">
			<h2>search repositories</h2>
			<p>try specific names or keywords like "ai" or "web"</p>
		</div>
	{/if}
</div>

<style>
	.header {
		margin-bottom: 2rem;
	}

	h1 {
		margin: 0;
		font-size: 2.5rem;
	}

	.search-container {
		margin-bottom: 3rem;
	}

	.message {
		background: var(--bg-1);
		border: 1px solid var(--bg-3);
		padding: 2rem;

		h2 {
			margin-top: 0;
		}
		:last-child {
			margin-bottom: 0;
		}
	}

	.results-grid {
		display: grid;
		gap: 1rem;
	}

	.repo-card {
		background: var(--bg-1);
		border: 1px solid var(--bg-3);
		padding: 1.5rem;
		text-align: left;
		transition: border-color 0.2s;
		width: 100%;
	}

	.repo-card:hover {
		border-color: var(--acc-1);
	}

	.repo-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1rem;
		gap: 1rem;
	}

	.repo-name {
		margin: 0;
		font-size: 1.25rem;
		color: var(--acc-1);
		flex: 1;
	}

	.repo-stats {
		display: flex;
		gap: 1rem;
		color: var(--txt-2);
		flex-shrink: 0;
		align-items: center;

		span {
			display: flex;
			align-items: center;
			gap: 0.5rem;
		}
	}

	.repo-description {
		margin: 0 0 1rem 0;
	}

	.repo-meta {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 1rem;
	}

	.repo-details {
		display: flex;
		gap: 1rem;
		font-size: 0.875rem;
		color: var(--txt-2);
		flex-wrap: wrap;
	}

	.language {
		color: var(--acc-1);
	}

	.repo-topics {
		display: flex;
		gap: 1rem;
		color: var(--txt-2);
	}

	.topic {
		font-size: 0.875rem;
	}

	.topic-more {
		font-size: 0.875rem;
		font-style: italic;
	}
</style>
