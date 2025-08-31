<script>
	import '../app.css';
	import { goto } from '$app/navigation';
	import { navigating } from '$app/state';
	import { onMount } from 'svelte';
	import GitIcon from '~icons/ph/git-fork';
	import UserIcon from '~icons/ph/user';
	import SignOutIcon from '~icons/ph/sign-out';
	import UserCircleIcon from '~icons/ph/user-circle';
	import RepoIcon from '~icons/ph/folder';
	import { auth } from '$lib/auth.svelte.js';

	let { children } = $props();

	onMount(() => {
		auth.initialize();
	});

	async function handleSignIn() {
		await auth.signInWithGitHub();
	}

	async function handleSignOut() {
		await auth.signOut();
	}
</script>

<svelte:head>
	<title>forklift</title>
</svelte:head>

<header>
	<div class="nav-left">
		<a class="heading" href="/">
			<GitIcon />
			<h1>forklift</h1>
		</a>
		<a href="/">home</a>
		<a href="/search">search</a>
		{#if auth.user}
			<a href="/for-you">for you</a>
		{/if}
	</div>

	<div class="nav-right">
		{#if auth.loading}
			<div class="loading-text">loading...</div>
		{:else if auth.user}
			<div class="user-info">
				<a href="/profile" class="profile-link">
					<UserIcon />
					<span>{auth.user.user_metadata?.user_name || auth.user.email}</span>
				</a>
				<button class="sign-out icon" onclick={handleSignOut}>
					<SignOutIcon style="height: " />
				</button>
			</div>
		{:else}
			<button class="sign-in" onclick={handleSignIn}>sign in with github </button>
		{/if}
	</div>
</header>

<main class:loading={navigating.to}>
	{@render children?.()}
</main>

{#if navigating.to}
	<div class="loading-indicator">
		<div class="loading-content">
			<div class="loading-spinner">
				<div class="square"></div>
				<div class="square"></div>
				<div class="square"></div>
				<div class="square"></div>
			</div>
			<div class="loading-messages">
				<span class="loading-message">loading data...</span>
				<span class="loading-subtitle">it may take a minute <br />to generate content</span>
			</div>
		</div>
	</div>
{/if}

<style>
	h1 {
		margin: 0;
		font-size: 1.25rem;
	}
	header {
		padding: 0rem 1rem;
		height: 4rem;
		border-bottom: 1px solid var(--bg-3);
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
		z-index: 1001; /* Higher than loading indicator */
		background: var(--bg-1); /* Ensure solid background */

		a {
			color: var(--txt-2);

			&:hover {
				color: var(--acc-1);
			}
		}
	}

	.nav-left {
		display: flex;
		align-items: center;
		gap: 2rem;
	}

	.nav-right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.profile-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--txt-2);
		text-decoration: none;

		:global(.icon) {
			color: var(--acc-1);
		}

		&:hover {
			color: var(--acc-1);
		}
	}

	.loading-text {
		color: var(--txt-3);
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
	.loading-indicator {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(3px);
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: 0.2s;
	}

	.loading-content {
		/* background: var(--bg-1);
		border: 1px solid var(--bg-3); */
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		/* box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); */
	}

	.loading-messages {
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.loading-subtitle {
		color: var(--txt-2);
	}

	.loading-message {
		font-size: 1.125rem;
	}

	.loading-spinner {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.375rem;
		width: 2rem;
		height: 2rem;
	}

	.square {
		background: var(--acc-1);
		animation: squarePulse 1.2s linear infinite;
	}

	.square:nth-child(1) {
		animation-delay: 0s;
	}
	.square:nth-child(2) {
		animation-delay: 0.3s;
	}
	.square:nth-child(3) {
		animation-delay: 0.6s;
	}
	.square:nth-child(4) {
		animation-delay: 0.9s;
	}

	@keyframes squarePulse {
		0%,
		100% {
			opacity: 0.2;
			transform: scale(0.8);
		}
		50% {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
