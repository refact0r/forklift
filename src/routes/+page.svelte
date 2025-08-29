<script>
	import { goto } from '$app/navigation';

	let repoUrl = '';

	function handleSearch() {
		if (repoUrl.trim()) {
			const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
			if (match) {
				const [, owner, repo] = match;
				goto(`/repo/${owner}/${repo}`);
			} else {
				alert('Please enter a valid GitHub repository URL');
			}
		}
	}

	function handleSuggestion(owner, repo) {
		goto(`/repo/${owner}/${repo}`);
	}
</script>

<div class="content">
	<div class="container">
		<h1>forklift</h1>
		<p class="subtitle">find repositories, understand codebases, and start contributing.</p>
		<div class="search">
			<input
				type="text"
				bind:value={repoUrl}
				placeholder="enter github repository url"
				onkeydown={(e) => e.key === 'Enter' && handleSearch()}
			/>
			<button onclick={handleSearch}>start</button>
		</div>
		<div class="suggestions"></div>
	</div>
</div>

<style>
	h1 {
		font-size: 4rem;
		margin: 0;
	}

	.content {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.container {
		display: flex;
		flex-direction: column;
	}

	.search {
		display: flex;
		gap: 1rem;
		max-width: 50rem;
	}
</style>
