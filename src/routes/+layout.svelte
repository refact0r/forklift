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
		padding: 0rem 1rem;
		height: 4rem;
		border-bottom: 1px solid var(--bg-3);
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;

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

	.sign-in,
	.sign-out {
		/* Add styles if needed */
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
