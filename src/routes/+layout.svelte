<script>
	import '../app.css';

	import { page } from '$app/state';
	import { goto } from '$app/navigation';

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
</header>

<main>
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
	}
</style>
