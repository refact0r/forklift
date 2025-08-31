<script>
	import { marked } from 'marked';
	import { isMatchingSkill } from '$lib/skillMatcher.js';
	import { savedRepos } from '$lib/savedRepos.svelte.js';

	let { data } = $props();

	// console.log(data);

	// Extract data for easier access
	const { overview, error } = data;
</script>

{#if error}
	<div class="error-section">
		<p>could not load overview data: {error}</p>
	</div>
{:else if overview}
	<section class="overview-section">
		<h2>quick context</h2>
		<div class="context-grid">
			<div class="context-item">
				<h3>what</h3>
				<p>{overview.quick_context.what}</p>
			</div>
			<div class="context-item">
				<h3>who</h3>
				<p>{overview.quick_context.who}</p>
			</div>
			<div class="context-item">
				<h3>why</h3>
				<p>{overview.quick_context.why}</p>
			</div>
		</div>
	</section>

	<section class="overview-section">
		<h2>project landscape</h2>
		<div class="landscape-content">
			{#if overview.project_landscape.languages?.length > 0}
				<div class="tech-group">
					<h4>languages</h4>
					<div class="tech-tags">
						{#each overview.project_landscape.languages as lang}
							<span
								class="tech-tag"
								class:highlighted={isMatchingSkill(lang, savedRepos.userSkills)}>{lang}</span
							>
						{/each}
					</div>
				</div>
			{/if}

			{#if overview.project_landscape.tools?.length > 0}
				<div class="tech-group">
					<h4>tools & frameworks</h4>
					<div class="tech-tags">
						{#each overview.project_landscape.tools as tool}
							<span
								class="tech-tag"
								class:highlighted={isMatchingSkill(tool, savedRepos.userSkills)}>{tool}</span
							>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</section>

	{#if overview.onboarding_essentials}
		<section class="overview-section">
			<h2>onboarding essentials</h2>
			<div class="markdown-content">
				{@html marked(overview.onboarding_essentials)}
			</div>
		</section>
	{/if}
{/if}

<style>
	.error-section {
		text-align: center;
		padding: 2rem;
		color: var(--txt-2);
	}

	h2 {
		color: var(--acc-1);
		margin: 0 0 1rem 0;
	}

	.overview-section {
		margin-bottom: 2.5rem;
	}

	.context-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: 1.5rem;
	}

	.context-item h3 {
		margin: 0 0 0.5rem 0;
	}

	.context-item p {
		margin: 0;
		color: var(--txt-1);
	}

	.tech-group {
		margin-bottom: 1.5rem;
	}

	.tech-group h4 {
		margin: 0 0 0.75rem 0;
	}

	.tech-tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.tech-tag {
		background: var(--bg-2);
		border: 1px solid var(--bg-3);
		padding: 0.5rem 0.75rem;
		color: var(--txt-1);
		transition: all 0.2s ease;
	}

	.tech-tag.highlighted {
		border-color: var(--acc-1);
		font-weight: 800;
	}
</style>
