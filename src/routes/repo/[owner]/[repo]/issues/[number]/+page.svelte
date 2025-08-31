<script>
	import { marked } from 'marked';

	let { data } = $props();

	function openInGitHub() {
		window.open(data.issue.html_url, '_blank');
	}

	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>forklift | {data.owner}/{data.repo} issue #{data.issue.number}</title>
</svelte:head>

<div class="header">
	<div class="header-row">
		<h1>{data.issue.title}</h1>
		<button class="button" onclick={openInGitHub}>github</button>
	</div>
	<div class="header-content">
		<!-- <span class="issue-state {data.issue.state}">{data.issue.state}</span> -->
		<span class="issue-number">#{data.issue.number}</span>
		<span>opened on {formatDate(data.issue.created_at)}</span>
		<span>by {data.issue.user.login}</span>
	</div>
</div>

<!-- Quick Analysis -->
{#if data.aiAnalysis}
	<div class="analysis-section">
		<h2>quick analysis</h2>

		<!-- First row: difficulty, topics, labels -->
		<div class="analysis-row">
			<div class="analysis-item">
				<h4>difficulty</h4>
				<div class="difficulty-badge {data.aiAnalysis.difficulty}">
					{data.aiAnalysis.difficulty || 'unknown'}
				</div>
			</div>

			{#if data.aiAnalysis.topics && data.aiAnalysis.topics.length > 0}
				<div class="analysis-item">
					<h4>topics</h4>
					<div class="topics">
						{#each data.aiAnalysis.topics as topic}
							<span class="topic-tag">{topic}</span>
						{/each}
					</div>
				</div>
			{/if}

			{#if data.issue.labels && data.issue.labels.length > 0}
				<div class="analysis-item">
					<h4>labels</h4>
					<div class="labels">
						{#each data.issue.labels as label}
							<span class="label-tag">{label}</span>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<!-- Second row: summary -->
		{#if data.aiAnalysis.summary}
			<div class="analysis-row">
				<div class="analysis-item summary-item">
					<h4>summary</h4>
					<p class="summary">{data.aiAnalysis.summary}</p>
				</div>
			</div>
		{/if}
	</div>
{/if}

<!-- Issue Description -->
<section>
	<h2>description</h2>
	{#if data.issue.body}
		<div class="markdown-content">
			{@html marked(data.issue.body)}
		</div>
	{:else}
		<p>No description provided.</p>
	{/if}
</section>

<!-- Implementation Guide -->
{#if data.implementationGuide}
	<section>
		<h2>implementation guide</h2>
		<div class="markdown-content">
			{@html marked(data.implementationGuide)}
		</div>
	</section>
{/if}

<style>
	.header {
		margin-bottom: 2rem;
	}

	.header-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	h1 {
		color: var(--acc-1);
		margin: 0;
	}

	.header-content {
		display: flex;
		align-items: center;
		color: var(--txt-2);
		gap: 1rem;
	}

	.issue-state {
		padding: 0.25rem 0.5rem;
	}

	.issue-state.open {
		background: var(--green);
		color: var(--bg-1);
	}

	.issue-state.closed {
		background: var(--red);
		color: var(--bg-1);
	}

	.analysis-section,
	.labels-section {
		margin-bottom: 2rem;
	}

	.analysis-row {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
		align-items: flex-start;
		margin-bottom: 1rem;
	}

	.analysis-row:last-child {
		margin-bottom: 0;
	}

	.summary-item {
		flex: 1;
		min-width: 100%;
	}

	section {
		margin-bottom: 2rem;
	}

	h2 {
		color: var(--acc-1);
		margin: 0 0 1rem 0;
	}

	h4 {
		margin: 0 0 0.75rem 0;
	}

	.difficulty-badge {
		display: inline-block;
		padding: 0.25rem 0.5rem;
	}

	.topics,
	.labels {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.topic-tag,
	.label-tag {
		border: 1px solid var(--bg-3);
		color: var(--txt-2);
		padding: 0.25rem 0.5rem;
	}

	.summary {
		color: var(--txt-1);
		margin: 0;
	}

	@media (max-width: 768px) {
		.header {
			flex-direction: column;
			align-items: stretch;
		}

		.analysis-row {
			flex-direction: column;
			gap: 1rem;
		}

		.summary-item {
			min-width: auto;
		}
	}
</style>
