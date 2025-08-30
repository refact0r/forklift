<script>
	import { goto } from '$app/navigation';

	let { data } = $props();

	// Use real issues data from the load function
	let issues = $state(data.issues || []);
	let error = $state(data.error);

	function goBack() {
		goto(`/repo/${data.owner}/${data.repo}`);
	}

	function openInGitHub(issue) {
		if (issue.url) {
			window.open(issue.url, '_blank');
		}
	}

	function getDifficultyColor(difficulty) {
		switch (difficulty?.toLowerCase()) {
			case 'easy':
				return '#4caf50';
			case 'medium':
				return '#ff9800';
			case 'hard':
				return '#f44336';
			default:
				return '#666';
		}
	}

	function getDifficultyLabel(difficulty) {
		switch (difficulty?.toLowerCase()) {
			case 'easy':
				return 'Easy';
			case 'medium':
				return 'Medium';
			case 'hard':
				return 'Hard';
			default:
				return 'Unknown';
		}
	}
</script>

{#if error}
	<div class="error-message">
		<h2>Error Loading Issues</h2>
		<p>{error}</p>
		<p>Please check that the repository exists and has public issues.</p>
	</div>
{:else if issues.length === 0}
	<div class="no-issues">
		<h2>No Open Issues Found</h2>
		<p>This repository doesn't have any open issues at the moment.</p>
		<p>
			You can still explore the codebase and consider contributing documentation or improvements!
		</p>
	</div>
{:else}
	<div class="issues-container">
		<div class="issues-header">
			<h2>Available Issues ({issues.length})</h2>
		</div>

		<div class="issues-table">
			<div class="table-header">
				<div class="col-number">#</div>
				<div class="col-title">Title</div>
				<div class="col-difficulty">Difficulty</div>
				<div class="col-action">Action</div>
			</div>

			{#each issues as issue}
				<div class="issue-row">
					<div class="col-number">{issue.number}</div>
					<div class="col-title">
						<span class="issue-title">{issue.title}</span>
					</div>
					<div class="col-difficulty">
						<span
							class="difficulty-badge"
							style="background-color: {getDifficultyColor(issue.difficulty)}"
						>
							{getDifficultyLabel(issue.difficulty)}
						</span>
					</div>
					<div class="col-action">
						<button class="solve-btn" onclick={() => openInGitHub(issue)}> View Issue </button>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.header {
		margin-bottom: 2rem;
	}

	.back-btn {
		background: none;
		border: none;
		color: #007acc;
		cursor: pointer;
		font-size: 1rem;
		margin-bottom: 1rem;
	}

	.back-btn:hover {
		text-decoration: underline;
	}

	h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2rem;
	}

	.subtitle {
		color: #666;
		margin: 0;
	}

	.error-message {
		background: #fee;
		border: 1px solid #fcc;
		border-radius: 8px;
		padding: 2rem;
		text-align: center;
		padding: 2rem;
		color: var(--txt-2);
	}

	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
		color: var(--txt-2);
	}

	.no-issues h2 {
		margin-top: 0;
		color: #004499;
	}

	.issues-container {
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.issues-header {
		padding: 1.5rem;
		border-bottom: 1px solid #eee;
	}

	.issues-header h2 {
		margin: 0;
		font-size: 1.5rem;
	}

	.issues-table {
		width: 100%;
	}

	.table-header {
		display: grid;
		grid-template-columns: 80px 1fr 120px 120px;
		gap: 1rem;
		padding: 1rem 1.5rem;
		background: #f8f9fa;
		border-bottom: 1px solid #eee;
		font-weight: 600;
		color: #333;
	}

	.issue-row {
		display: grid;
		grid-template-columns: 80px 1fr 120px 120px;
		gap: 1rem;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid #eee;
		align-items: center;
		transition: background-color 0.2s;
	}

	.issue-row:hover {
		background-color: #f8f9fa;
	}

	.issue-row:last-child {
		border-bottom: none;
	}

	.col-number {
		font-weight: 600;
		color: #666;
	}

	.col-title {
		display: flex;
		align-items: center;
	}

	.issue-title {
		font-weight: 500;
		color: #333;
		line-height: 1.4;
	}

	.col-difficulty {
		display: flex;
		justify-content: center;
	}

	.difficulty-badge {
		color: white;
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: bold;
		text-align: center;
		min-width: 60px;
	}

	.col-action {
		display: flex;
		justify-content: center;
	}

	.solve-btn {
		background: #007acc;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		font-size: 0.875rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.solve-btn:hover {
		background: #005a9e;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.container {
			padding: 1rem;
		}

		.table-header,
		.issue-row {
			grid-template-columns: 60px 1fr 100px;
			gap: 0.5rem;
			padding: 0.75rem 1rem;
		}

		.col-action {
			display: none;
		}

		.issue-title {
			font-size: 0.9rem;
		}

		.difficulty-badge {
			font-size: 0.7rem;
			padding: 0.2rem 0.5rem;
		}
	}

	@media (max-width: 480px) {
		.table-header,
		.issue-row {
			grid-template-columns: 50px 1fr 80px;
			gap: 0.25rem;
			padding: 0.5rem;
		}

		.issue-title {
			font-size: 0.8rem;
		}

		.difficulty-badge {
			font-size: 0.65rem;
			padding: 0.15rem 0.4rem;
		}
	}
</style>
