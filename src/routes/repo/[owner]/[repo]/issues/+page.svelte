<script>
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let { data } = $props();

	// Use real issues data from the load function
	let issues = $state(data.issues || []);
	let error = $state(data.error);
	let selectedIssue = $state(null);

	function goBack() {
		goto(`/repo/${data.owner}/${data.repo}`);
	}

	function selectIssue(issue) {
		selectedIssue = issue;
	}

	function closeIssue() {
		selectedIssue = null;
	}

	function openInGitHub(issue) {
		if (issue.url) {
			window.open(issue.url, '_blank');
		}
	}

	function getDifficultyColor(difficulty) {
		switch (difficulty) {
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
		switch (difficulty) {
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

	function formatDate(dateString) {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleDateString();
	}
</script>

<main class="container">
	<div class="header">
		<button class="back-btn" onclick={goBack}>← Back to Repository</button>
		<h1>Open Issues</h1>
		<p class="subtitle">Find issues to contribute to in {data.owner}/{data.repo}</p>
	</div>

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
		<div class="issues-grid">
			<div class="issues-list">
				<h2>Available Issues ({issues.length})</h2>

				{#each issues as issue}
					<button class="issue-card" onclick={() => selectIssue(issue)}>
						<div class="issue-header">
							<h3>#{issue.id} - {issue.title}</h3>
							<div class="issue-meta">
								<span
									class="difficulty"
									style="background-color: {getDifficultyColor(issue.difficulty)}"
								>
									{getDifficultyLabel(issue.difficulty)}
								</span>
								<span class="time">⏱️ {issue.timeEstimate}</span>
							</div>
						</div>

						<p class="issue-description">{issue.description}</p>

						<div class="issue-footer">
							<div class="issue-labels">
								{#each issue.labels.slice(0, 3) as label}
									<span class="label">{label}</span>
								{/each}
								{#if issue.labels.length > 3}
									<span class="label-more">+{issue.labels.length - 3} more</span>
								{/if}
							</div>

							<div class="issue-stats">
								{#if issue.comments > 0}
									<span class="comments">💬 {issue.comments}</span>
								{/if}
								{#if issue.author}
									<span class="author">by {issue.author}</span>
								{/if}
							</div>
						</div>
					</button>
				{/each}
			</div>

			{#if selectedIssue}
				<div class="issue-detail">
					<div class="detail-header">
						<h2>#{selectedIssue.id} - {selectedIssue.title}</h2>
						<button class="close-btn" onclick={closeIssue}>×</button>
					</div>

					<div class="detail-content">
						<div class="detail-section">
							<h3>Description</h3>
							<p class="issue-body">{selectedIssue.description}</p>
						</div>

						<div class="detail-section">
							<h3>Difficulty & Time Estimate</h3>
							<div class="meta-info">
								<span
									class="difficulty-badge"
									style="background-color: {getDifficultyColor(selectedIssue.difficulty)}"
								>
									{getDifficultyLabel(selectedIssue.difficulty)}
								</span>
								<span class="time-badge">⏱️ {selectedIssue.timeEstimate}</span>
							</div>
						</div>

						{#if selectedIssue.labels && selectedIssue.labels.length > 0}
							<div class="detail-section">
								<h3>Labels</h3>
								<div class="labels">
									{#each selectedIssue.labels as label}
										<span class="label">{label}</span>
									{/each}
								</div>
							</div>
						{/if}

						<div class="detail-section">
							<h3>AI Guidance - Getting Started</h3>
							<div class="guidance-box">
								<p>{selectedIssue.aiGuidance}</p>
							</div>
						</div>

						<div class="detail-section">
							<h3>Issue Details</h3>
							<div class="issue-details">
								{#if selectedIssue.comments}
									<p><strong>Comments:</strong> {selectedIssue.comments}</p>
								{/if}
								{#if selectedIssue.author}
									<p><strong>Created by:</strong> {selectedIssue.author}</p>
								{/if}
								{#if selectedIssue.created}
									<p><strong>Created:</strong> {formatDate(selectedIssue.created)}</p>
								{/if}
							</div>
						</div>

						<div class="detail-actions">
							<button class="primary-btn" onclick={() => openInGitHub(selectedIssue)}>
								View on GitHub
							</button>
							<button class="secondary-btn" onclick={closeIssue}> Close Details </button>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</main>

<style>
	.container {
		max-width: 1400px;
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
		color: #c33;
	}

	.error-message h2 {
		margin-top: 0;
		color: #a11;
	}

	.no-issues {
		background: #f0f8ff;
		border: 1px solid #cce7ff;
		border-radius: 8px;
		padding: 2rem;
		text-align: center;
		color: #0066cc;
	}

	.no-issues h2 {
		margin-top: 0;
		color: #004499;
	}

	.issues-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}

	.issues-list h2 {
		margin-bottom: 1.5rem;
	}

	.issue-card {
		background: white;
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 1rem;
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
		width: 100%;
	}

	.issue-card:hover {
		border-color: #007acc;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.issue-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1rem;
	}

	.issue-header h3 {
		margin: 0;
		flex: 1;
		margin-right: 1rem;
		font-size: 1rem;
		line-height: 1.3;
	}

	.issue-meta {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: flex-end;
	}

	.difficulty {
		color: white;
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: bold;
	}

	.time {
		font-size: 0.875rem;
		color: #666;
	}

	.issue-description {
		color: #666;
		margin-bottom: 1rem;
		line-height: 1.5;
		font-size: 0.9rem;
	}

	.issue-footer {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 1rem;
	}

	.issue-labels {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		flex: 1;
	}

	.issue-stats {
		display: flex;
		gap: 1rem;
		font-size: 0.8rem;
		color: #666;
		align-items: center;
	}

	.label {
		background: #f0f0f0;
		color: #333;
		padding: 0.25rem 0.5rem;
		border-radius: 12px;
		font-size: 0.75rem;
	}

	.label-more {
		background: #e0e0e0;
		color: #666;
		padding: 0.25rem 0.5rem;
		border-radius: 12px;
		font-size: 0.75rem;
		font-style: italic;
	}

	.comments,
	.author {
		white-space: nowrap;
	}

	.issue-detail {
		background: white;
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 2rem;
		height: fit-content;
		position: sticky;
		top: 2rem;
		max-height: calc(100vh - 4rem);
		overflow-y: auto;
	}

	.detail-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #eee;
	}

	.detail-header h2 {
		margin: 0;
		font-size: 1.5rem;
		line-height: 1.3;
		flex: 1;
		margin-right: 1rem;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: #666;
		padding: 0.5rem;
		flex-shrink: 0;
	}

	.close-btn:hover {
		color: #333;
	}

	.detail-section {
		margin-bottom: 2rem;
	}

	.detail-section h3 {
		margin: 0 0 1rem 0;
		color: #333;
	}

	.issue-body {
		line-height: 1.6;
		white-space: pre-wrap;
		color: #444;
	}

	.meta-info {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.difficulty-badge,
	.time-badge {
		padding: 0.5rem 1rem;
		border-radius: 20px;
		font-size: 0.875rem;
		font-weight: bold;
	}

	.difficulty-badge {
		color: white;
	}

	.time-badge {
		background: #f0f0f0;
		color: #333;
	}

	.labels {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.guidance-box {
		background: #f8f9fa;
		padding: 1.5rem;
		border-radius: 8px;
		border-left: 4px solid #007acc;
	}

	.guidance-box p {
		margin: 0;
		line-height: 1.6;
	}

	.issue-details p {
		margin: 0.5rem 0;
		color: #666;
	}

	.detail-actions {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
		flex-wrap: wrap;
	}

	.primary-btn,
	.secondary-btn {
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		font-size: 1rem;
		cursor: pointer;
		border: none;
	}

	.primary-btn {
		background: #007acc;
		color: white;
	}

	.primary-btn:hover {
		background: #005a9e;
	}

	.secondary-btn {
		background: #f0f0f0;
		color: #333;
	}

	.secondary-btn:hover {
		background: #e0e0e0;
	}

	/* Responsive design */
	@media (max-width: 1024px) {
		.issues-grid {
			grid-template-columns: 1fr;
		}

		.issue-detail {
			position: static;
			max-height: none;
		}
	}

	@media (max-width: 768px) {
		.container {
			padding: 1rem;
		}

		.issue-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}

		.issue-meta {
			flex-direction: row;
			align-items: center;
		}

		.issue-footer {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.detail-header h2 {
			font-size: 1.2rem;
		}

		.detail-actions {
			flex-direction: column;
		}
	}
</style>
