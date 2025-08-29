<script>
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	function goHome() {
		goto('/');
	}
</script>

<main class="error-container">
	<div class="error-content">
		<h1>Oops! Something went wrong</h1>
		<p class="error-code">{$page.status}: {$page.error?.message || 'Page not found'}</p>
		<p class="error-description">
			The page you're looking for doesn't exist or there was an error.
		</p>
		<button class="home-btn" onclick={goHome}>Go Home</button>
	</div>
</main>

<style>
	.error-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		padding: 2rem;
	}

	.error-content {
		text-align: center;
		max-width: 500px;
	}

	h1 {
		color: #e74c3c;
		margin-bottom: 1rem;
	}

	.error-code {
		font-size: 1.2rem;
		font-weight: bold;
		color: #666;
		margin-bottom: 1rem;
	}

	.error-description {
		color: #666;
		margin-bottom: 2rem;
		line-height: 1.5;
	}

	.home-btn {
		background: #007acc;
		color: white;
		border: none;
		padding: 1rem 2rem;
		border-radius: 8px;
		font-size: 1.1rem;
		cursor: pointer;
	}

	.home-btn:hover {
		background: #005a9e;
	}
</style>
