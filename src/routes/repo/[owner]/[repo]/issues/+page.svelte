<!-- <script>
	let { data } = $props();

	const { issues, error } = data;

	function formatDate(dateString) {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleDateString();
	}
</script>

{#if error}
	<div class="error-section">
		<p>Could not load issues: {error}</p>
	</div>
{:else if issues?.length > 0}
	<div class="issues-list">
		<h2>Open Issues ({issues.length})</h2>
		{#each issues as issue}
			<div class="issue-card">
				<div class="issue-header">
					<h3>
						<a href={issue.html_url} target="_blank" rel="noopener noreferrer">
							{issue.title}
						</a>
					</h3>
					<span class="issue-number">#{issue.number}</span>
				</div>
				{#if issue.body}
					<p class="issue-body">{issue.body.slice(0, 200)}{issue.body.length > 200 ? '...' : ''}</p>
				{/if}
				<div class="issue-meta">
					<span class="issue-author">by {issue.user.login}</span>
					<span class="issue-date">{formatDate(issue.created_at)}</span>
					{#if issue.labels?.length > 0}
						<div class="issue-labels">
							{#each issue.labels as label}
								<span class="label" style="background-color: #{label.color}">
									{label.name}
								</span>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{:else}
	<div class="empty-state">
		<h2>No Open Issues</h2>
		<p>This repository doesn't have any open issues at the moment.</p>
	</div>
{/if}

<style>
	.error-section {
		text-align: center;
		padding: 2rem;
		color: var(--txt-2);
	}

	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
		color: var(--txt-2);
	}

	.empty-state h2 {
		color: var(--acc-1);
		margin-bottom: 0.5rem;
	}

	h2 {
		color: var(--acc-1);
		margin: 0 0 1.5rem 0;
	}

	.issues-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.issue-card {
		border: 1px solid var(--bg-3);
		padding: 1.5rem;
		background: var(--bg-1);
	}

	.issue-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 0.75rem;
		gap: 1rem;
	}

	.issue-header h3 {
		margin: 0;
		flex: 1;
	}

	.issue-header h3 a {
		color: var(--acc-1);
		text-decoration: none;
	}

	.issue-header h3 a:hover {
		text-decoration: underline;
	}

	.issue-number {
		color: var(--txt-3);
		font-size: 0.875rem;
		flex-shrink: 0;
	}

	.issue-body {
		color: var(--txt-1);
		margin: 0 0 1rem 0;
		line-height: 1.5;
	}

	.issue-meta {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		font-size: 0.875rem;
		color: var(--txt-2);
	}

	.issue-labels {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-left: auto;
	}

	.label {
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		color: white;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
	}
</style> -->
