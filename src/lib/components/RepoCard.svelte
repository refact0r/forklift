<script>
	import StarIcon from '~icons/ph/star';
	import ForkIcon from '~icons/ph/git-fork';

	let { repo } = $props();

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

	<div class="repo-meta" class:small={repo.topics.length === 0}>
		<div class="repo-details">
			{#if repo.language}
				<span class="language">{repo.language}</span>
			{/if}

			{#if repo.openIssues > 0}
				<span class="open-issues">{repo.openIssues} issues</span>
			{/if}

			{#if repo.updatedAt}
				<span class="updated">updated {formatDate(repo.updatedAt)}</span>
			{/if}
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

<style>
	.repo-card {
		background: var(--bg-1);
		border: 1px solid var(--bg-3);
		padding: 1.5rem;
		text-align: left;
		transition: border-color 0.2s;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.repo-card:hover {
		border-color: var(--acc-1);
	}

	.repo-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
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
	}

	.repo-stats span {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.repo-description {
		margin: 0 0 1rem 0;
	}

	.repo-meta {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 1rem;
		margin-top: auto;
	}

	.repo-details {
		display: flex;
		gap: 1rem;
		font-size: 0.875rem;
		color: var(--txt-2);
		flex-wrap: wrap;
	}

	/* .repo-meta.small .repo-details {
		width: 100%;
		justify-content: space-between;
	} */

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
