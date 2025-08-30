<script>
	let { data } = $props();

	console.log(data);

	// Extract data for easier access
	const { owner, repo, repoData, overview, error } = data;
	const hasOverview = overview && !error;
</script>

<div class="content">
	{#if error}
		<div class="error-section">
			<h1>Repository Not Found</h1>
			<p>Could not load {owner}/{repo}: {error}</p>
		</div>
	{:else}
		<!-- Repository Header -->
		<header class="repo-header">
			<h1>{repoData.full_name}</h1>
			<p class="repo-description">{repoData.description}</p>
			<div class="repo-stats">
				<span class="stat">⭐ {repoData.stars}</span>
				<span class="stat">🔀 {repoData.forks}</span>
				<span class="stat">📝 {repoData.language}</span>
			</div>
			{#if repoData.topics?.length > 0}
				<div class="topics">
					{#each repoData.topics as topic}
						<span class="topic">{topic}</span>
					{/each}
				</div>
			{/if}
		</header>

		{#if hasOverview}
			<!-- Section 1: Quick Context -->
			<section class="overview-section">
				<h2>Quick Context</h2>
				<div class="context-grid">
					<div class="context-item">
						<h3>What</h3>
						<p>{overview.quick_context.what}</p>
					</div>
					<div class="context-item">
						<h3>Who</h3>
						<p>{overview.quick_context.who}</p>
					</div>
					<div class="context-item">
						<h3>Why</h3>
						<p>{overview.quick_context.why}</p>
					</div>
				</div>
			</section>

			<!-- Section 2: Project Landscape -->
			<section class="overview-section">
				<h2>Project Landscape</h2>
				<div class="landscape-content">
					{#if overview.project_landscape.languages?.length > 0}
						<div class="tech-group">
							<h4>Languages</h4>
							<div class="tech-tags">
								{#each overview.project_landscape.languages as lang}
									<span class="tech-tag">{lang}</span>
								{/each}
							</div>
						</div>
					{/if}

					{#if overview.project_landscape.tools?.length > 0}
						<div class="tech-group">
							<h4>Tools & Frameworks</h4>
							<div class="tech-tags">
								{#each overview.project_landscape.tools as tool}
									<span class="tech-tag">{tool}</span>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</section>

			<!-- Section 3: Onboarding Essentials -->
			<section class="overview-section">
				<h2>Onboarding Essentials</h2>
				<div class="onboarding-content">
					{@html overview.onboarding_essentials}
				</div>
			</section>
		{:else}
			<!-- Fallback: Show basic repo info without AI overview -->
			<section class="overview-section">
				<h2>Repository Information</h2>
				<p>AI overview not available. Here's what we found:</p>

				{#if repoData.languages?.length > 0}
					<div class="tech-group">
						<h4>Languages</h4>
						<div class="tech-tags">
							{#each repoData.languages as lang}
								<span class="tech-tag">{lang}</span>
							{/each}
						</div>
					</div>
				{/if}

				{#if repoData.readme}
					<div class="readme-section">
						<h4>README Preview</h4>
						<pre class="readme-preview">{repoData.readme.slice(0, 500)}...</pre>
					</div>
				{/if}
			</section>
		{/if}

		<!-- Actions -->
		<section class="actions-section">
			<a href="https://github.com/{owner}/{repo}" target="_blank" class="button accent">
				View on GitHub
			</a>
			<a href="/repo/{owner}/{repo}/issues" class="button"> Browse Issues </a>
		</section>
	{/if}
</div>

<style>
	.error-section {
		text-align: center;
		padding: 2rem;
	}

	.repo-header {
		border-bottom: 1px solid var(--bg-3);
		padding-bottom: 1.5rem;
		margin-bottom: 2rem;
	}

	.repo-header h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2rem;
	}

	.repo-description {
		color: var(--txt-1);
		font-size: 1.1rem;
		margin: 0 0 1rem 0;
	}

	.repo-stats {
		display: flex;
		gap: 1.5rem;
		margin-bottom: 1rem;
	}

	.stat {
		color: var(--txt-2);
		font-size: 0.9rem;
	}

	.topics {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.topic {
		background: var(--bg-2);
		border: 1px solid var(--bg-3);
		padding: 0.25rem 0.5rem;
		font-size: 0.8rem;
		color: var(--txt-2);
	}

	.overview-section {
		margin-bottom: 2.5rem;
	}

	.overview-section h2 {
		margin: 0 0 1rem 0;
		font-size: 1.5rem;
		color: var(--acc-1);
	}

	.context-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
	}

	.context-item h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.1rem;
		color: var(--txt-0);
	}

	.context-item p {
		margin: 0;
		color: var(--txt-1);
		line-height: 1.4;
	}

	.landscape-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.tech-group h4 {
		margin: 0 0 0.75rem 0;
		font-size: 1rem;
		color: var(--txt-0);
	}

	.tech-tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.tech-tag {
		background: var(--bg-2);
		border: 1px solid var(--bg-3);
		padding: 0.4rem 0.8rem;
		font-size: 0.9rem;
		color: var(--txt-1);
	}

	.onboarding-content {
		background: var(--bg-2);
		border: 1px solid var(--bg-3);
		padding: 1.5rem;
	}

	.onboarding-content :global(h1),
	.onboarding-content :global(h2),
	.onboarding-content :global(h3) {
		margin-top: 0;
		color: var(--txt-0);
	}

	.onboarding-content :global(code) {
		background: var(--bg-3);
		padding: 0.2rem 0.4rem;
		font-family: 'DM Mono', monospace;
	}

	.onboarding-content :global(pre) {
		background: var(--bg-3);
		padding: 1rem;
		overflow-x: auto;
	}

	.readme-section {
		margin-top: 1.5rem;
	}

	.readme-section h4 {
		margin: 0 0 0.75rem 0;
		color: var(--txt-0);
	}

	.readme-preview {
		background: var(--bg-2);
		border: 1px solid var(--bg-3);
		padding: 1rem;
		font-size: 0.85rem;
		color: var(--txt-2);
		white-space: pre-wrap;
		overflow: hidden;
	}

	.actions-section {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--bg-3);
	}
</style>
