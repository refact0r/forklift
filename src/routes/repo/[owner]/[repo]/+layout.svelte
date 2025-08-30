<script>
	import { page } from '$app/state';
	import StarIcon from '~icons/ph/star';
	import ForkIcon from '~icons/ph/git-fork';

	let { data, children } = $props();

	const { owner, repo, repoData, error } = data;
</script>

<div class="content">
	{#if error}
		<div class="error-section">
			<h1>Repository Not Found</h1>
			<p>Could not load {owner}/{repo}: {error}</p>
		</div>
	{:else}
		<div class="repo-header">
			<div class="header-top">
				<h1>{repoData.full_name}</h1>
				<a
					href="https://github.com/{owner}/{repo}"
					target="_blank"
					class="button accent github-button"
				>
					view on github
				</a>
			</div>
			<p class="repo-description">{repoData.description}</p>
			<div class="repo-stats">
				<span class="stat">
					<StarIcon class="icon" />
					{repoData.stars}
				</span>
				<span class="stat">
					<ForkIcon class="icon" />
					{repoData.forks}
				</span>
				{#if repoData.topics?.length > 0}
					<div class="topics">
						{#each repoData.topics as topic}
							<span class="topic">{topic}</span>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<nav class="repo-nav">
			<a href="/repo/{owner}/{repo}" class:active={page.url.pathname === `/repo/${owner}/${repo}`}>
				overview
			</a>
			<a href="/repo/{owner}/{repo}/issues" class:active={page.url.pathname.includes('/issues')}>
				issues
			</a>
		</nav>

		<div class="repo-content">
			{@render children?.()}
		</div>
	{/if}
</div>

<style>
	.error-section {
		text-align: center;
		padding: 2rem;
	}

	.repo-header {
		margin-bottom: 1rem;
	}

	.header-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.github-button {
		margin: 0;
		flex-shrink: 0;
	}

	h1 {
		margin: 0;
		font-size: 2rem;
		color: var(--acc-1);
	}

	.repo-description {
		color: var(--txt-1);
		margin: 0 0 1rem 0;
	}

	.repo-stats {
		display: flex;
		gap: 1.5rem;
	}

	.stat {
		color: var(--txt-2);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.topics {
		margin-left: auto;
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.topic {
		border: 1px solid var(--bg-3);
		padding: 0.25rem 0.5rem;
		font-size: 0.875rem;
		color: var(--txt-2);
	}

	.repo-nav {
		display: flex;
		gap: 2rem;
		border-bottom: 1px solid var(--bg-3);
		margin-bottom: 2rem;
	}

	.repo-nav a {
		color: var(--txt-2);
		text-decoration: none;
		padding: 0.75rem 0;
		border-bottom: 2px solid transparent;
		position: relative;
		bottom: -1px;
	}

	.repo-nav a:hover {
		color: var(--acc-1);
	}

	.repo-nav a.active {
		color: var(--acc-1);
		border-bottom-color: var(--acc-1);
	}
</style>
