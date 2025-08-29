<script>
	import '../app.css';

	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let { children } = $props();
</script>

<svelte:head>
	<title>forklift</title>
</svelte:head>

<header></header>

<main>
	{@render children?.()}
</main>

<style>
	main {
		margin: 3rem;
		width: 100%;
	}
</style>
