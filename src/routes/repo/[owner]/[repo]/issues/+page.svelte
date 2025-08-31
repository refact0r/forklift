<script>
	import { goto } from '$app/navigation';

	let { data } = $props();

	// Use classified issues data from the load function
	let issues = $state(data.classifiedIssues || []);
	let error = $state(data.error);

	function viewIssue(issue) {
		goto(`/repo/${data.owner}/${data.repo}/issues/${issue.number}`);
	}

	function openInGitHub(issue) {
		if (issue.html_url) {
			window.open(issue.html_url, '_blank');
		}
	}

	function getDifficultyColor(difficulty) {
		switch (difficulty?.toLowerCase()) {
			case 'easy':
				return 'var(--green)';
			case 'medium':
				return 'var(--acc-1)';
			case 'hard':
				return 'var(--red)';
			default:
				return 'var(--txt-3)';
		}
	}
</script>

<svelte:head>
	<title>forklift | {data.owner}/{data.repo} issues</title>
</svelte:head>

{#if error}
	<div class="error-section">
		<h2>Error Loading Issues</h2>
		<p>{error}</p>
		<p>Please check that the repository exists and has public issues.</p>
	</div>
{:else if issues.length === 0}
	<div class="empty-section">
		<h2>No Open Issues Found</h2>
		<p>This repository doesn't have any open issues at the moment.</p>
		<p>
			You can still explore the codebase and consider contributing documentation or improvements!
		</p>
	</div>
{:else}
	<div class="issues-header">
		<h2>{issues.length} open issue{issues.length === 1 ? '' : 's'}</h2>
	</div>

	<div class="issues-list">
		{#each issues as issue}
			<div
				class="issue-card"
				onclick={() => viewIssue(issue)}
				role="button"
				tabindex="0"
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') viewIssue(issue);
				}}
			>
				<div class="issue-header">
					<span class="issue-number">#{issue.number}</span>
					<span
						class="difficulty-badge"
						style="color: {getDifficultyColor(issue.ai_analysis?.difficulty)}"
					>
						{issue.ai_analysis?.difficulty || 'unknown'}
					</span>

					{#if issue.ai_analysis?.topics && issue.ai_analysis.topics.length > 0}
						<div class="topics">
							{#each issue.ai_analysis.topics.slice(0, 4) as topic}
								<span class="topic-tag">{topic}</span>
							{/each}
						</div>
					{/if}
				</div>

				<h3 class="issue-title">{issue.title}</h3>

				{#if issue.ai_analysis?.summary}
					<p class="issue-summary">{issue.ai_analysis.summary}</p>
				{/if}

				<div class="issue-actions">
					<span class="view-btn">view details</span>
					<button
						class="github-btn"
						onclick={(e) => {
							e.stopPropagation();
							openInGitHub(issue);
						}}
					>
						github
					</button>
				</div>
			</div>
		{/each}
	</div>
{/if}

<style>
	.error-section,
	.empty-section {
		text-align: center;
		padding: 2rem;
		color: var(--txt-2);
	}

	.issues-header h2 {
		color: var(--acc-1);
		margin: 0 0 1rem 0;
	}

	.issues-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.issue-card {
		/* background: var(--bg-2); */
		border: 1px solid var(--bg-3);
		padding: 1.5rem;
		cursor: pointer;
	}

	.issue-card:hover {
		border-color: var(--acc-1);
	}

	.issue-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.issue-number {
		color: var(--txt-2);
	}

	.difficulty-badge {
	}

	.issue-title {
		margin: 0 0 1rem 0;
		color: var(--txt-0);
	}

	.topics {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.topic-tag {
		color: var(--txt-2);
		font-size: 0.875rem;
	}

	.issue-summary {
		margin: 0 0 1rem 0;
	}

	.issue-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-top: auto;
	}

	.view-btn {
		color: var(--acc-1);
	}

	.github-btn {
		font-size: 0.875rem;
	}
</style>
