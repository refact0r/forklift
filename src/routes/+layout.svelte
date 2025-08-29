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

<main class="main-content">
	{@render children?.()}
</main>

<style>
</style>
