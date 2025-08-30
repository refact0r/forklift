<script>
	let { data } = $props();

	// Use real data from the load function
	let repoData = $state(data.repoData);
	let error = $state(data.error);

	function goToIssues() {
		goto(`/repo/${data.owner}/${data.repo}/issues`);
	}

	function goBack() {
		goto('/');
	}

	// Format the README content for better display
	function formatReadme(content) {
		if (!content || content === 'No README available') {
			return content;
		}
		// Basic markdown-like formatting - just handle line breaks for now
		return content.replace(/\n/g, '\n');
	}

	// Format tech stack for display
	function formatTechStack(languages) {
		if (!languages || languages.length === 0) {
			return ['No languages detected'];
		}
		return languages;
	}
</script>

<div class="content">
	<div class="header">
		<a class="button" href="/" onclick={goBack}>back</a>
		<h1>{data.owner}/{data.repo}</h1>
		{#if repoData.url}
			<a href={repoData.url} target="_blank" rel="noopener noreferrer" class="github-link">
				View on GitHub →
			</a>
		{/if}
	</div>

	{#if error}
		<div class="error-message">
			<h2>Error Loading Repository</h2>
			<p>{error}</p>
			<p>Please check that the repository exists and is public.</p>
		</div>
	{:else}
		<div class="repo-info">
			<div class="stats">
				<span class="stat">⭐ {repoData.stars.toLocaleString()}</span>
				<span class="stat">🍴 {repoData.forks.toLocaleString()}</span>
				<span class="stat">💻 {repoData.language}</span>
			</div>

			<p class="description">{repoData.description}</p>

			{#if repoData.topics && repoData.topics.length > 0}
				<div class="topics">
					{#each repoData.topics as topic}
						<span class="topic">{topic}</span>
					{/each}
				</div>
			{/if}
		</div>

		<div class="content-grid">
			<div class="section">
				<h2>README Preview</h2>
				<div class="content-box">
					<pre class="readme-content">{formatReadme(repoData.readme)}</pre>
					{#if repoData.readme.length >= 1000}
						<p class="truncated-note">... (truncated, view full README on GitHub)</p>
					{/if}
				</div>
			</div>

			<div class="section">
				<h2>Languages & Tech Stack</h2>
				<div class="content-box">
					<ul>
						{#each formatTechStack(repoData.techStack) as tech}
							<li>{tech}</li>
						{/each}
					</ul>
				</div>
			</div>

			<div class="section">
				<h2>File Structure Overview</h2>
				<div class="content-box">
					<pre class="file-structure">{repoData.fileStructure}</pre>
					{#if repoData.fileStructure.split('\n').length >= 50}
						<p class="truncated-note">... (showing first 50 files)</p>
					{/if}
				</div>
			</div>
		</div>

		<div class="actions">
			<button class="primary-btn" onclick={goToIssues}>View Open Issues</button>
		</div>
	{/if}
</div>

<style>
</style>
