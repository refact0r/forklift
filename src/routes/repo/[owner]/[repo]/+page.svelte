<script>
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let { data } = $props();

	// Mock data for now - in a real app this would come from the load function
	let repoData = $state({
		name: 'Sample Repository',
		description: 'A sample repository for demonstration purposes',
		stars: 1234,
		forks: 567,
		language: 'JavaScript',
		topics: ['web', 'javascript', 'react'],
		readme: 'This is a sample README file that would contain information about the project.',
		techStack: ['JavaScript', 'React', 'Node.js', 'Express'],
		setupGuide:
			'1. Clone the repository\n2. Install dependencies with npm install\n3. Run the development server with npm run dev',
		fileStructure: 'src/\n  components/\n  pages/\n  utils/\npackage.json\nREADME.md'
	});

	function goToIssues() {
		goto(`/repo/${data.owner}/${data.repo}/issues`);
	}

	function goBack() {
		goto('/');
	}
</script>

<main class="container">
	<div class="header">
		<button class="back-btn" onclick={goBack}>← Back to Search</button>
		<h1>{data.owner}/{data.repo}</h1>
	</div>

	<div class="repo-info">
		<div class="stats">
			<span class="stat">⭐ {repoData.stars}</span>
			<span class="stat">🍴 {repoData.forks}</span>
			<span class="stat">💻 {repoData.language}</span>
		</div>

		<p class="description">{repoData.description}</p>

		<div class="topics">
			{#each repoData.topics as topic}
				<span class="topic">{topic}</span>
			{/each}
		</div>
	</div>

	<div class="content-grid">
		<div class="section">
			<h2>AI Summary</h2>
			<div class="content-box">
				<p>{repoData.readme}</p>
			</div>
		</div>

		<div class="section">
			<h2>Tech Stack & Skills Needed</h2>
			<div class="content-box">
				<ul>
					{#each repoData.techStack as tech}
						<li>{tech}</li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="section">
			<h2>Setup & Contributing Guide</h2>
			<div class="content-box">
				<pre>{repoData.setupGuide}</pre>
			</div>
		</div>

		<div class="section">
			<h2>File Structure Overview</h2>
			<div class="content-box">
				<pre>{repoData.fileStructure}</pre>
			</div>
		</div>
	</div>

	<div class="actions">
		<button class="primary-btn" onclick={goToIssues}>View Open Issues</button>
	</div>
</main>

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
		margin: 0;
		font-size: 2.5rem;
	}

	.repo-info {
		margin-bottom: 3rem;
	}

	.stats {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.stat {
		background: #f0f0f0;
		padding: 0.5rem 1rem;
		border-radius: 20px;
		font-size: 0.875rem;
	}

	.description {
		font-size: 1.2rem;
		color: #666;
		margin-bottom: 1rem;
	}

	.topics {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.topic {
		background: #e3f2fd;
		color: #1976d2;
		padding: 0.25rem 0.75rem;
		border-radius: 16px;
		font-size: 0.875rem;
	}

	.content-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
		gap: 2rem;
		margin-bottom: 3rem;
	}

	.section h2 {
		margin-bottom: 1rem;
		color: #333;
	}

	.content-box {
		background: #f8f9fa;
		padding: 1.5rem;
		border-radius: 8px;
		border-left: 4px solid #007acc;
	}

	.content-box pre {
		white-space: pre-wrap;
		font-family: monospace;
		margin: 0;
	}

	.content-box ul {
		margin: 0;
		padding-left: 1.5rem;
	}

	.actions {
		text-align: center;
	}

	.primary-btn {
		background: #007acc;
		color: white;
		border: none;
		padding: 1rem 2rem;
		border-radius: 8px;
		font-size: 1.1rem;
		cursor: pointer;
	}

	.primary-btn:hover {
		background: #005a9e;
	}
</style>
