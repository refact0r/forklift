<script>
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let { data } = $props();

	// Mock issues data - in a real app this would come from the load function
	let issues = $state([
		{
			id: 1,
			title: 'Fix navigation bug in mobile view',
			description:
				'The navigation menu is not working properly on mobile devices. Users cannot access the main menu items.',
			difficulty: 'easy',
			timeEstimate: '2-4 hours',
			labels: ['bug', 'mobile', 'ui'],
			aiGuidance:
				'Start by checking the mobile navigation component in the header. Look for CSS media queries and JavaScript event handlers that might be missing for touch events.'
		},
		{
			id: 2,
			title: 'Add unit tests for user authentication',
			description:
				'We need comprehensive unit tests for the authentication system to ensure reliability and catch regressions.',
			difficulty: 'medium',
			timeEstimate: '1-2 days',
			labels: ['testing', 'auth', 'enhancement'],
			aiGuidance:
				"Begin by examining the existing auth service files. Look for test files in the __tests__ directory. You'll need to mock external dependencies and test both success and failure scenarios."
		},
		{
			id: 3,
			title: 'Implement dark mode theme',
			description:
				'Users have requested a dark mode option for better accessibility and user preference.',
			difficulty: 'hard',
			timeEstimate: '3-5 days',
			labels: ['feature', 'ui', 'accessibility'],
			aiGuidance:
				'This is a larger feature that touches multiple components. Start by creating a theme context/provider, then systematically update components to use CSS variables for colors. Consider using a design system approach.'
		},
		{
			id: 4,
			title: 'Optimize database queries for large datasets',
			description:
				'Performance issues when loading large amounts of data. Need to implement pagination and query optimization.',
			difficulty: 'hard',
			timeEstimate: '1-2 weeks',
			labels: ['performance', 'database', 'backend'],
			aiGuidance:
				'Begin by profiling the current database queries to identify bottlenecks. Look at the database schema and consider adding indexes. Implement pagination using cursor-based or offset-based approaches.'
		}
	]);

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
</script>

<main class="container">
	<div class="header">
		<button class="back-btn" onclick={goBack}>← Back to Repository</button>
		<h1>Open Issues</h1>
		<p class="subtitle">Find issues to contribute to in {data.owner}/{data.repo}</p>
	</div>

	<div class="issues-grid">
		<div class="issues-list">
			<h2>Available Issues ({issues.length})</h2>

			{#each issues as issue}
				<button class="issue-card" onclick={() => selectIssue(issue)}>
					<div class="issue-header">
						<h3>{issue.title}</h3>
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

					<div class="issue-labels">
						{#each issue.labels as label}
							<span class="label">{label}</span>
						{/each}
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
						<p>{selectedIssue.description}</p>
					</div>

					<div class="detail-section">
						<h3>Difficulty & Time</h3>
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

					<div class="detail-section">
						<h3>Labels</h3>
						<div class="labels">
							{#each selectedIssue.labels as label}
								<span class="label">{label}</span>
							{/each}
						</div>
					</div>

					<div class="detail-section">
						<h3>AI Guidance - Getting Started</h3>
						<div class="guidance-box">
							<p>{selectedIssue.aiGuidance}</p>
						</div>
					</div>

					<div class="detail-actions">
						<button class="primary-btn">Start Working on This Issue</button>
						<button class="secondary-btn">View on GitHub</button>
					</div>
				</div>
			</div>
		{/if}
	</div>
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
	}

	.issue-labels {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.label {
		background: #f0f0f0;
		color: #333;
		padding: 0.25rem 0.5rem;
		border-radius: 12px;
		font-size: 0.75rem;
	}

	.issue-detail {
		background: white;
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 2rem;
		height: fit-content;
		position: sticky;
		top: 2rem;
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
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: #666;
		padding: 0.5rem;
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

	.meta-info {
		display: flex;
		gap: 1rem;
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

	.detail-actions {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
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
</style>
