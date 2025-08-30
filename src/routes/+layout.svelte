<script>
	import '../app.css';
	import { goto } from '$app/navigation';
	import { navigating } from '$app/state';
	import GitIcon from '~icons/ph/git-fork';

	let { children } = $props();
</script>

<svelte:head>
	<title>forklift</title>
</svelte:head>

<header>
	<a class="heading" href="/">
		<GitIcon />
		<h1>forklift</h1>
	</a>
	<a href="/">home</a>
	<a href="/search">search</a>
	{#if navigating.to}
		<div class="loading-indicator">
			<div class="loading-bar"></div>
		</div>
	{/if}
</header>

<main class:loading={navigating.to}>
	{@render children?.()}
</main>

<style>
	h1 {
		margin: 0;
		font-size: 1.25rem;
	}
	header {
		padding: 1rem 1rem;
		border-bottom: 1px solid var(--bg-3);
		position: relative;
		display: flex;
		align-items: center;
		gap: 2rem;

		a {
			color: var(--txt-2);

			&:hover {
				color: var(--acc-1);
			}
		}
	}
	.heading {
		width: fit-content;
		display: flex;
		align-items: center;
		gap: 0.5rem;

		:global(.icon) {
			font-size: 1.25rem;
			color: var(--acc-1);
		}
	}
	main {
		position: relative;
		overflow: hidden;
	}
	.loading {
		opacity: 0.7;
	}
	.loading-indicator {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 2px;
		z-index: 1000;
		width: 100%;
		overflow-x: hidden;
	}
	.loading-bar {
		height: 100%;
		background: var(--acc-1);
		width: 40%;
		animation: loadingProgress 1s ease infinite;
	}
	@keyframes loadingProgress {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(250%);
		}
	}
</style>
