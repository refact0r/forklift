<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/auth.svelte.js';
	import { savedRepos } from '$lib/savedRepos.svelte.js';
	import RepoCard from '$lib/components/RepoCard.svelte';

	let { data } = $props();
	let currentFilter = $state('all');
	let filteredRecommendations = $state([]);

	// Reactive state from server data
	let recommendations = $derived(data.recommendations);
	let hasSkills = $derived(data.hasSkills);
	let userSkills = $derived(data.userSkills);
	let error = $derived(data.error);

	onMount(async () => {
		if (!auth.user) {
			goto('/');
			return;
		}

		if (data.needsSkillsLoad) {
			await savedRepos.loadUserSkills();

			if (savedRepos.userSkills.length === 0) {
				return;
			}

			const skillsParam = encodeURIComponent(JSON.stringify(savedRepos.userSkills));
			goto(`/for-you?skills=${skillsParam}`, { replaceState: true });
		}
	});

	// Filter recommendations by skill
	$effect(() => {
		filteredRecommendations =
			currentFilter === 'all'
				? recommendations
				: recommendations.filter(
						(repo) =>
							repo.language?.toLowerCase() === currentFilter.toLowerCase() ||
							repo.matchedSkill?.toLowerCase() === currentFilter.toLowerCase()
					);
	});

	function handleFilterChange(skill) {
		currentFilter = skill;
	}
</script>

<svelte:head>
	<title>forklift | for you</title>
</svelte:head>

<div class="content">
	{#if error}
		<div class="error-state">
			<h2>unable to load recommendations</h2>
			<p>{error}</p>
		</div>
	{:else if !hasSkills}
		<div class="no-skills-state">
			<h2>add some skills to get started</h2>
			<p>
				to see personalized repository recommendations, add your programming skills and interests in
				your profile.
			</p>
			<button class="button accent" onclick={() => goto('/profile')}> go to profile </button>
		</div>
	{:else if recommendations.length === 0}
		<div class="no-results-state">
			<h2>no recommendations found</h2>
			<p>
				we couldn't find any repositories matching your skills. try adding more skills to your
				profile or check back later.
			</p>
			<button class="button secondary" onclick={() => goto('/profile')}> manage skills </button>
		</div>
	{:else}
		<div class="header">
			<div class="title-section">
				<h1>for you</h1>
				<p class="subtitle">repositories recommended based on your skills and interests</p>
			</div>

			{#if userSkills && userSkills.length > 0}
				<div class="skill-filters">
					<button
						class="filter-button"
						class:active={currentFilter === 'all'}
						onclick={() => handleFilterChange('all')}
					>
						All ({recommendations.length})
					</button>
					{#each userSkills.slice(0, 8) as skill}
						{@const skillCount = recommendations.filter(
							(repo) =>
								repo.language?.toLowerCase() === skill.toLowerCase() ||
								repo.matchedSkill?.toLowerCase() === skill.toLowerCase()
						).length}
						{#if skillCount > 0}
							<button
								class="filter-button"
								class:active={currentFilter === skill}
								onclick={() => handleFilterChange(skill)}
							>
								{skill} ({skillCount})
							</button>
						{/if}
					{/each}
				</div>
			{/if}
		</div>

		{#if filteredRecommendations.length > 0}
			<div class="recommendations-grid">
				{#each filteredRecommendations as repo (repo.id)}
					<RepoCard {repo} />
				{/each}
			</div>
		{:else}
			<div class="no-filter-results">
				<p>no repositories found for {currentFilter}.</p>
				<button class="link-button" onclick={() => handleFilterChange('all')}>
					show all recommendations
				</button>
			</div>
		{/if}
	{/if}
</div>

<style>
	.header {
		margin-bottom: 2rem;
	}

	.title-section {
		margin-bottom: 1.5rem;
	}

	.title-section h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2.5rem;
		color: var(--acc-1);
	}

	.subtitle {
		margin: 0;
		color: var(--txt-2);
		font-size: 1.125rem;
	}

	.skill-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.filter-button {
		font-size: 0.875rem;
		color: var(--txt-1);
	}

	.filter-button:hover {
		background: var(--bg-3);
	}

	.filter-button.active {
		background: var(--acc-1);
		border-color: var(--acc-1);
		color: var(--bg-1);
	}

	.recommendations-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		max-width: 100%;
		width: 100%;
	}

	.error-state,
	.no-skills-state,
	.no-results-state {
		text-align: center;
		padding: 4rem 2rem;
	}

	.error-state h2,
	.no-skills-state h2,
	.no-results-state h2 {
		margin: 0 0 1rem 0;
		font-size: 1.75rem;
		color: var(--txt-1);
	}

	.error-state p,
	.no-skills-state p,
	.no-results-state p {
		margin: 0 0 2rem 0;
		color: var(--txt-2);
		font-size: 1.125rem;
		max-width: 32rem;
		margin-left: auto;
		margin-right: auto;
	}

	.no-filter-results {
		text-align: center;
		padding: 2rem;
		color: var(--txt-2);
	}

	.no-filter-results p {
		margin: 0 0 1rem 0;
	}

	.link-button {
		background: none;
		border: none;
		color: var(--acc-1);
		cursor: pointer;
		text-decoration: underline;
		font-size: inherit;
	}

	.link-button:hover {
		color: var(--acc-2);
	}
</style>
