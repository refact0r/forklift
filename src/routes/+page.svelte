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

<main class="container">
	<h1>forklift</h1>
	<p class="subtitle">find repositories, understand codebases, and start contributing.</p>

	<div class="search-section">
		<div class="search-box">
			<input
				type="text"
				bind:value={repoUrl}
				placeholder="Enter GitHub repository URL (e.g., https://github.com/owner/repo)"
				onkeydown={(e) => e.key === 'Enter' && handleSearch()}
			/>
			<button onclick={handleSearch}>GO</button>
		</div>
	</div>

	<div class="suggestions"></div>
</main>

<style>
	h1 {
		font-size: 6rem;
		margin: 0;
	}
</style>
