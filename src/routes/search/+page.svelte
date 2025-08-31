<script>
	import { goto } from '$app/navigation';
	import SearchIcon from '~icons/ph/magnifying-glass';
	import RepoCard from '$lib/components/RepoCard.svelte';

	let { data } = $props();
	let searchInput = $state(data.query || '');

	// Handle search submission
	function handleSearch() {
		const input = searchInput.trim();
		if (!input) return;
		goto(`/search?q=${encodeURIComponent(input)}`);
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
						<RepoCard {repo} />
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
		color: var(--acc-1);
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

	/* Responsive design */
	@media (max-width: 768px) {
		.content {
			padding: 1rem;
		}

		.search-container {
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>
