<script>
	import { marked } from 'marked';
	import StarIcon from '~icons/ph/star';
	import ForkIcon from '~icons/ph/git-fork';

	let { data } = $props();
	// let data = {
	// 	owner: 'refact0r',
	// 	repo: 'gradenight',
	// 	repoData: {
	// 		name: 'gradenight',
	// 		full_name: 'refact0r/gradenight',
	// 		description: 'A better version of the StudentVue website',
	// 		stars: 34,
	// 		forks: 17,
	// 		language: 'Svelte',
	// 		topics: ['studentvue', 'education', 'webapp'],
	// 		readme:
	// 			"# gradenight\n\nA better looking and easier to use version of StudentVue using [StudentVue.js](https://github.com/StudentVue/StudentVue.js) and [Sveltekit](https://kit.svelte.dev).\n\nThis app stores your login info as a cookie in your browser and nowhere else. If you don't trust me, feel free to fork and run it yourself on netlify or vercel.\n\n## features\n- clean design\n- fancy graphs\n- create fake assignments and see impact on grade\n- edit assignments and see impact on grade\n- color-coded scores and percentages\n- themes\n\n![image](https://user-images.githubusercontent.com/34758569/156866029-5837c698-fc16-476e-b7a0-63c38d485449.png)\n\n![image](https://user-images.githubusercontent.com/34758569/156866013-fce15e25-c5f3-498b-9e7c-9188e8ab87ac.png)\n",
	// 		contributing: null,
	// 		languages: ['Svelte', 'JavaScript', 'CSS', 'SCSS', 'HTML'],
	// 		fileExtensions: [
	// 			'json',
	// 			'cjs',
	// 			'md',
	// 			'js',
	// 			'html',
	// 			'scss',
	// 			'png',
	// 			'css',
	// 			'woff',
	// 			'svg',
	// 			'jpg'
	// 		],
	// 		packageFiles: {
	// 			'package.json':
	// 				'{\n\t"name": "gradenight",\n\t"version": "1.3.1",\n\t"scripts": {\n\t\t"dev": "vite dev",\n\t\t"build": "vite build",\n\t\t"preview": "vite preview",\n\t\t"check": "svelte-kit sync && svelte-check --tsconfig ./jsconfig.json",\n\t\t"check:watch": "svelte-kit sync && svelte-check --tsconfig ./jsconfig.json --watch",\n\t\t"lint": "prettier --plugin-search-dir . --check .",\n\t\t"format": "prettier --plugin-search-dir . --write ."\n\t},\n\t"devDependencies": {\n\t\t"@playwright/test": "1.25.0",\n\t\t"@sveltejs/adapter-auto": "^1.0.0-next.91",\n\t\t"@sveltejs/kit": "next",\n\t\t"eslint": "^7.32.0",\n\t\t"eslint-config-prettier": "^8.3.0",\n\t\t"eslint-plugin-svelte3": "^3.2.1",\n\t\t"prettier": "^2.4.1",\n\t\t"prettier-plugin-svelte": "^2.4.0",\n\t\t"pwa-asset-generator": "^6.2.1",\n\t\t"sass": "^1.55.0",\n\t\t"svelte": "^3.44.0",\n\t\t"svelte-preprocess": "^4.10.1",\n\t\t"vite": "^4.0.0"\n\t},\n\t"dependencies": {\n\t\t"chart.js": "^3.7.0",\n\t\t"cookie": "^0.4.1",\n\t\t"studentvue.js": "^0.1.1"\n\t},\n\t"engines": {\n\t\t"node": ">=16.0.0"\n\t},\n\t"type": "module"\n}\n'
	// 		}
	// 	},
	// 	overview: {
	// 		quick_context: {
	// 			what: 'A cleaner, easier-to-use reimplementation of the StudentVue interface built with SvelteKit and StudentVue.js.',
	// 			who: 'Students and families who rely on StudentVue for grades and assignments.',
	// 			why: 'It improves usability and provides client-side storage via cookies to protect privacy and portability.'
	// 		},
	// 		project_landscape: {
	// 			languages: ['Svelte', 'JavaScript', 'CSS', 'SCSS', 'HTML'],
	// 			tools: ['SvelteKit', 'StudentVue.js', 'Vite', 'Netlify', 'Vercel']
	// 		},
	// 		onboarding_essentials:
	// 			'## Prerequisites\n- Node.js LTS (>=14) installed\n- npm (or yarn)\n\n## Quick Start\n\nClone the repository and install dependencies:\n```bash\ngit clone https://github.com/refact0r/gradenight.git\ncd gradenight\nnpm install\n```\n\n## Run the app\n```bash\nnpm run dev\n```\n\nThe dev server will start with Vite. Open http://localhost:5173 in your browser.\n\n## Build and Preview\n```bash\nnpm run build\nnpm run preview\n```\n\n## Notes\n- The app stores login info as a cookie in your browser (client-side only). No server stores credentials.\n- To deploy, you can host on Netlify or Vercel as suggested in the README.'
	// 	}
	// };

	console.log(data);

	// Extract data for easier access
	const { owner, repo, repoData, overview, error } = data;
</script>

<div class="content">
	{#if error}
		<div class="error-section">
			<h1>Repository Not Found</h1>
			<p>Could not load {owner}/{repo}: {error}</p>
		</div>
	{:else}
		<header class="repo-header">
			<h1>{repoData.full_name}</h1>
			<p class="repo-description">{repoData.description}</p>
			<div class="repo-stats">
				<span class="stat">
					<StarIcon class="icon" />
					{repoData.stars}
				</span>
				<span class="stat">
					<ForkIcon class="icon" />
					{repoData.forks}
				</span>
				{#if repoData.topics?.length > 0}
					<div class="topics">
						{#each repoData.topics as topic}
							<span class="topic">{topic}</span>
						{/each}
					</div>
				{/if}
			</div>
		</header>

		{#if overview}
			<section class="overview-section">
				<h2>quick context</h2>
				<div class="context-grid">
					<div class="context-item">
						<h3>what</h3>
						<p>{overview.quick_context.what}</p>
					</div>
					<div class="context-item">
						<h3>who</h3>
						<p>{overview.quick_context.who}</p>
					</div>
					<div class="context-item">
						<h3>why</h3>
						<p>{overview.quick_context.why}</p>
					</div>
				</div>
			</section>

			<section class="overview-section">
				<h2>project landscape</h2>
				<div class="landscape-content">
					{#if overview.project_landscape.languages?.length > 0}
						<div class="tech-group">
							<h4>languages</h4>
							<div class="tech-tags">
								{#each overview.project_landscape.languages as lang}
									<span class="tech-tag">{lang}</span>
								{/each}
							</div>
						</div>
					{/if}

					{#if overview.project_landscape.tools?.length > 0}
						<div class="tech-group">
							<h4>tools & frameworks</h4>
							<div class="tech-tags">
								{#each overview.project_landscape.tools as tool}
									<span class="tech-tag">{tool}</span>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</section>

			{#if overview.onboarding_essentials}
				<section class="overview-section">
					<h2>onboarding essentials</h2>
					<div class="onboarding-content">
						{@html marked(overview.onboarding_essentials)}
					</div>
				</section>
			{/if}
		{/if}

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
		padding-bottom: 1rem;
		margin-bottom: 2rem;
	}

	h1 {
		margin: 0 0 1rem 0;
		font-size: 2rem;
		color: var(--acc-1);
	}

	h2 {
		color: var(--acc-1);
	}

	.repo-description {
		color: var(--txt-1);
		margin: 0 0 1rem 0;
	}

	.repo-stats {
		display: flex;
		gap: 1.5rem;
		margin-bottom: 1rem;
	}

	.stat {
		color: var(--txt-2);
		display: flex;
		align-items: center;
		gap: 0.5rem;
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
		font-size: 0.875rem;
		color: var(--txt-2);
	}

	.overview-section {
		margin-bottom: 2.5rem;
	}

	.context-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
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

	.tech-group {
		margin-bottom: 1.5rem;
	}

	.tech-group h4 {
		margin: 0 0 0.75rem 0;
	}

	.tech-tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.tech-tag {
		background: var(--bg-2);
		border: 1px solid var(--bg-3);
		padding: 0.5rem 0.75rem;
		color: var(--txt-1);
	}

	.onboarding-content {
		border: 1px solid var(--bg-3);
		padding: 1.5rem;
	}

	.onboarding-content :global(*:first-child) {
		margin-top: 0;
	}

	.onboarding-content :global(code) {
		background: var(--bg-2);
		font-family: 'DM Mono', monospace;
	}

	.onboarding-content :global(pre) {
		background: var(--bg-2);
		padding: 0.75rem;
		overflow-x: auto;
	}

	.actions-section {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--bg-3);
	}
</style>
