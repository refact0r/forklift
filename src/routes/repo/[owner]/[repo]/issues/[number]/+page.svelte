<script>
	import { goto } from '$app/navigation';

	let { data } = $props();

	function goBack() {
		goto(`/repo/${data.owner}/${data.repo}/issues`);
	}

	function openInGitHub() {
		window.open(data.issue.html_url, '_blank');
	}

	function getDifficultyColor(difficulty) {
		switch (difficulty?.toLowerCase()) {
			case 'easy':
				return '#10B981'; // green
			case 'medium':
				return '#F59E0B'; // yellow
			case 'hard':
				return '#EF4444'; // red
			default:
				return '#6B7280'; // gray
		}
	}

	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<div class="container">
	<div class="header">
		<button class="back-btn" onclick={goBack}>← Back to Issues</button>
		<div class="issue-meta">
			<div class="issue-number">#{data.issue.number}</div>
			<h1 class="issue-title">{data.issue.title}</h1>
			<div class="issue-info">
				<span class="issue-state {data.issue.state}">{data.issue.state}</span>
				<span class="issue-date">opened on {formatDate(data.issue.created_at)}</span>
				<span class="issue-author">by {data.issue.user.login}</span>
			</div>
		</div>
	</div>

	<div class="content-grid">
		<div class="main-content">
			<!-- Issue Description -->
			<div class="section">
				<h2>Description</h2>
				<div class="issue-body">
					{#if data.issue.body}
						<pre class="description-text">{data.issue.body}</pre>
					{:else}
						<p class="no-description">No description provided.</p>
					{/if}
				</div>
				<button class="github-btn" onclick={openInGitHub}> View on GitHub </button>
			</div>

			<!-- Implementation Guide -->
			{#if data.implementationGuide}
				<div class="section">
					<h2>AI Implementation Guide</h2>
					<div class="implementation-guide">
						<pre class="guide-text">{data.implementationGuide}</pre>
					</div>
				</div>
			{/if}
		</div>

		<div class="sidebar">
			<!-- AI Analysis -->
			{#if data.aiAnalysis}
				<div class="analysis-card">
					<h3>AI Analysis</h3>

					<div class="analysis-item">
						<span class="analysis-label">Difficulty</span>
						<div
							class="difficulty-badge"
							style="background-color: {getDifficultyColor(data.aiAnalysis.difficulty)}"
						>
							{data.aiAnalysis.difficulty || 'Unknown'}
						</div>
					</div>

					{#if data.aiAnalysis.topics && data.aiAnalysis.topics.length > 0}
						<div class="analysis-item">
							<span class="analysis-label">Topics</span>
							<div class="topics">
								{#each data.aiAnalysis.topics as topic}
									<span class="topic-tag">{topic}</span>
								{/each}
							</div>
						</div>
					{/if}

					{#if data.aiAnalysis.summary}
						<div class="analysis-item">
							<span class="analysis-label">Summary</span>
							<p class="summary-text">{data.aiAnalysis.summary}</p>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Labels -->
			{#if data.issue.labels && data.issue.labels.length > 0}
				<div class="labels-card">
					<h3>Labels</h3>
					<div class="labels">
						{#each data.issue.labels as label}
							<span
								class="label-tag"
								style="background-color: #{label.color}; color: {label.color === 'ffffff'
									? '#000'
									: '#fff'}"
							>
								{label.name}
							</span>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Repository Info -->
			<div class="repo-card">
				<h3>Repository</h3>
				<div class="repo-name">{data.owner}/{data.repo}</div>
				{#if data.repoContext.description}
					<p class="repo-description">{data.repoContext.description}</p>
				{/if}
				{#if data.repoContext.languages && Object.keys(data.repoContext.languages).length > 0}
					<div class="languages">
						<span class="analysis-label">Languages</span>
						<div class="language-list">
							{#each Object.keys(data.repoContext.languages) as language}
								<span class="language-tag">{language}</span>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

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

	.issue-meta {
		margin-bottom: 2rem;
	}

	.issue-number {
		font-size: 1.2rem;
		color: #666;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.issue-title {
		margin: 0 0 1rem 0;
		font-size: 2rem;
		font-weight: 600;
		color: #1a1a1a;
		line-height: 1.3;
	}

	.issue-info {
		display: flex;
		align-items: center;
		gap: 1rem;
		color: #666;
		font-size: 0.9rem;
	}

	.issue-state {
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: capitalize;
	}

	.issue-state.open {
		background: #dcfdf7;
		color: #065f46;
	}

	.issue-state.closed {
		background: #fee2e2;
		color: #991b1b;
	}

	.content-grid {
		display: grid;
		grid-template-columns: 1fr 300px;
		gap: 2rem;
		align-items: start;
	}

	.section {
		background: white;
		border: 1px solid #e1e5e9;
		border-radius: 8px;
		padding: 2rem;
		margin-bottom: 2rem;
	}

	.section h2 {
		margin: 0 0 1.5rem 0;
		font-size: 1.5rem;
		font-weight: 600;
		color: #1a1a1a;
	}

	.issue-body {
		margin-bottom: 1.5rem;
	}

	.description-text {
		white-space: pre-wrap;
		line-height: 1.6;
		color: #333;
		margin: 0;
		font-family: inherit;
		background: #f8f9fa;
		padding: 1rem;
		border-radius: 6px;
		border: 1px solid #e1e5e9;
	}

	.no-description {
		color: #666;
		font-style: italic;
		margin: 0;
	}

	.implementation-guide {
		background: #f8f9fa;
		border: 1px solid #e1e5e9;
		border-radius: 6px;
		padding: 1.5rem;
	}

	.guide-text {
		white-space: pre-wrap;
		line-height: 1.6;
		color: #333;
		margin: 0;
		font-family: inherit;
	}

	.github-btn {
		background: #24292f;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		font-size: 0.875rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.github-btn:hover {
		background: #1c2128;
	}

	.sidebar {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.analysis-card,
	.labels-card,
	.repo-card {
		background: white;
		border: 1px solid #e1e5e9;
		border-radius: 8px;
		padding: 1.5rem;
	}

	.analysis-card h3,
	.labels-card h3,
	.repo-card h3 {
		margin: 0 0 1rem 0;
		font-size: 1.1rem;
		font-weight: 600;
		color: #1a1a1a;
	}

	.analysis-item {
		margin-bottom: 1rem;
	}

	.analysis-item:last-child {
		margin-bottom: 0;
	}

	.analysis-label {
		display: block;
		font-size: 0.85rem;
		font-weight: 600;
		color: #666;
		margin-bottom: 0.5rem;
	}

	.difficulty-badge {
		color: white;
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: capitalize;
		display: inline-block;
	}

	.time-estimate {
		color: #666;
		font-size: 0.9rem;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.topics {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.topic-tag {
		background: #f1f3f4;
		color: #5f6368;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.summary-text {
		color: #666;
		margin: 0;
		line-height: 1.5;
		font-size: 0.9rem;
	}

	.labels {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.label-tag {
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.repo-name {
		font-weight: 600;
		color: #007acc;
		margin-bottom: 0.5rem;
	}

	.repo-description {
		color: #666;
		margin: 0 0 1rem 0;
		line-height: 1.5;
		font-size: 0.9rem;
	}

	.language-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	.language-tag {
		background: #e1e5e9;
		color: #5f6368;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	/* Responsive design */
	@media (max-width: 968px) {
		.content-grid {
			grid-template-columns: 1fr;
		}

		.sidebar {
			order: -1;
		}
	}

	@media (max-width: 768px) {
		.container {
			padding: 1rem;
		}

		.section {
			padding: 1.5rem;
		}

		.analysis-card,
		.labels-card,
		.repo-card {
			padding: 1rem;
		}

		.issue-title {
			font-size: 1.5rem;
		}

		.issue-info {
			flex-wrap: wrap;
			gap: 0.5rem;
		}
	}
</style>
