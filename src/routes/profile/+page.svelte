<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import PlusIcon from '~icons/ph/plus';
	import XIcon from '~icons/ph/x';
	import { auth } from '$lib/auth.svelte.js';
	import { supabase } from '$lib/supabase.js';
	import { savedRepos } from '$lib/savedRepos.svelte.js';
	import RepoCard from '$lib/components/RepoCard.svelte';

	let languages = $state([]);
	let newLanguage = $state('');
	let loading = $state(true);
	let saving = $state(false);
	let displayLimit = $state(10);
	let loadingMore = $state(false);

	onMount(async () => {
		// Redirect if not authenticated
		if (!auth.user) {
			goto('/');
			return;
		}
		
		await loadLanguages();
		await savedRepos.loadSavedRepos();
		loading = false;
	});

	async function loadLanguages() {
		if (!auth.user) return;

		const { data, error } = await supabase
			.from('user_languages')
			.select('language')
			.eq('user_id', auth.user.id)
			.order('created_at');

		if (error) {
			console.error('Error loading languages:', error);
		} else {
			languages = data.map(item => item.language);
		}
	}

	async function addLanguage() {
		const language = newLanguage.trim();
		if (!language || !auth.user || languages.includes(language)) {
			newLanguage = '';
			return;
		}

		saving = true;
		const { error } = await supabase
			.from('user_languages')
			.insert({ user_id: auth.user.id, language });

		if (error) {
			console.error('Error adding language:', error);
		} else {
			languages = [...languages, language];
			newLanguage = '';
		}
		saving = false;
	}

	async function removeLanguage(languageToRemove) {
		if (!auth.user) return;

		saving = true;
		const { error } = await supabase
			.from('user_languages')
			.delete()
			.eq('user_id', auth.user.id)
			.eq('language', languageToRemove);

		if (error) {
			console.error('Error removing language:', error);
		} else {
			languages = languages.filter(lang => lang !== languageToRemove);
		}
		saving = false;
	}

	function handleKeydown(event) {
		if (event.key === 'Enter') {
			addLanguage();
		}
	}

	async function loadMore() {
		if (loadingMore) return;
		
		loadingMore = true;
		// Simulate loading delay for better UX
		await new Promise(resolve => setTimeout(resolve, 300));
		displayLimit += 10;
		loadingMore = false;
	}
</script>

<div class="content">
	{#if loading}
		<div class="loading">Loading...</div>
	{:else if !auth.user}
		<div class="error">Please log in to view your profile.</div>
	{:else}
		<div class="profile-header">
			<h1>{auth.user.user_metadata?.user_name || auth.user.email}</h1>
			<p>Manage your technology stack and development interests</p>
		</div>

		<div class="section">
			<h3>Your Technologies</h3>
			<p class="section-description">Add technologies, frameworks, and languages you're familiar with or interested in learning</p>
			
			{#if languages.length > 0}
				<div class="language-tags">
					{#each languages as language}
						<div class="language-tag">
							<span class="language-name">{language}</span>
							<button 
								class="remove-btn" 
								onclick={() => removeLanguage(language)}
								disabled={saving}
								title="Remove {language}"
							>
								<XIcon />
							</button>
						</div>
					{/each}
				</div>
			{:else}
				<div class="empty-state">
					<p>No technologies added yet. Add some technologies to personalize your experience!</p>
				</div>
			{/if}

			<div class="add-language">
				<div class="input-group">
					<input
						type="text"
						bind:value={newLanguage}
						onkeydown={handleKeydown}
						placeholder="Enter a technology (e.g. python, flask, sveltekit)..."
						disabled={saving}
					/>
					<button 
						class="add-btn accent" 
						onclick={addLanguage}
						disabled={saving || !newLanguage.trim()}
					>
						<PlusIcon />
						Add
					</button>
				</div>
			</div>
		</div>

		<div class="section">
			<h3>My List</h3>
			<p class="section-description">Repositories you've saved for later</p>
			
			{#if savedRepos.savedRepos.length > 0}
				<div class="saved-repos-grid">
					{#each savedRepos.savedRepos.slice(0, displayLimit) as savedRepo}
						<div class="saved-repo-wrapper">
							<RepoCard repo={{
								owner: savedRepo.repo_owner,
								name: savedRepo.repo_name,
								fullName: savedRepo.repo_full_name,
								description: savedRepo.repo_description,
								stars: savedRepo.repo_stars,
								forks: 0,
								language: savedRepo.repo_language,
								openIssues: 0,
								updatedAt: savedRepo.saved_at,
								topics: []
							}} />
							<button 
								class="unsave-button"
								onclick={() => savedRepos.unsaveRepo(savedRepo.repo_owner, savedRepo.repo_name)}
								title="Remove from saved"
							>
								<XIcon />
							</button>
						</div>
					{/each}
				</div>
				
				{#if savedRepos.savedRepos.length > displayLimit}
					<div class="load-more-section">
						<button 
							class="button secondary"
							onclick={loadMore}
							disabled={loadingMore}
						>
							{loadingMore ? 'Loading...' : `Load More (${savedRepos.savedRepos.length - displayLimit} remaining)`}
						</button>
					</div>
				{/if}
			{:else}
				<div class="empty-state">
					<p>No saved repositories yet. Browse repositories and click "Add to My List" to save them here!</p>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.profile-header {
		margin-bottom: 3rem;
	}

	.profile-header h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2.5rem;
		color: var(--acc-1);
	}

	.profile-header p {
		margin: 0;
		color: var(--txt-2);
		font-size: 1.125rem;
	}

	.section {
		margin-bottom: 2rem;
	}

	.section h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.5rem;
	}

	.section-description {
		margin: 0 0 1.5rem 0;
		color: var(--txt-2);
	}

	.language-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.language-tag {
		display: flex;
		align-items: center;
		background: var(--bg-2);
		border: 1px solid var(--bg-3);
		border-radius: 6px;
		padding: 0.5rem 0.75rem;
		gap: 0.5rem;
		transition: all 0.2s;
	}

	.language-tag:hover {
		border-color: var(--acc-1);
	}

	.language-name {
		color: var(--acc-1);
		font-size: 0.875rem;
		font-weight: 500;
	}

	.remove-btn {
		background: transparent;
		border: none;
		color: var(--txt-3);
		cursor: pointer;
		display: flex;
		align-items: center;
		padding: 0.125rem;
		border-radius: 3px;
		transition: all 0.2s;
		opacity: 0;
	}

	.language-tag:hover .remove-btn {
		opacity: 1;
	}

	.remove-btn:hover {
		background: var(--bg-3);
		color: var(--txt-1);
	}

	.remove-btn :global(.icon) {
		font-size: 0.875rem;
	}

	.empty-state {
		background: var(--bg-2);
		border: 1px dashed var(--bg-3);
		border-radius: 8px;
		padding: 2rem;
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.empty-state p {
		margin: 0;
		color: var(--txt-2);
	}

	.add-language {
		max-width: 400px;
	}

	.input-group {
		display: flex;
		gap: 0.75rem;
	}

	.input-group input {
		flex: 1;
		padding: 0.75rem;
		border: 1px solid var(--bg-3);
		border-radius: 4px;
		background: var(--bg-1);
		color: var(--txt-1);
		font-size: 0.875rem;
	}

	.input-group input:focus {
		outline: none;
		border-color: var(--acc-1);
	}

	.add-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		white-space: nowrap;
	}

	.add-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.loading, .error {
		text-align: center;
		padding: 3rem;
		color: var(--txt-2);
		font-size: 1.125rem;
	}

	.error {
		color: #ef4444;
	}

	.saved-repos-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(24rem, 1fr));
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.saved-repo-wrapper {
		position: relative;
	}

	.unsave-button {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		background: var(--bg-1);
		border: 1px solid var(--bg-3);
		border-radius: 4px;
		color: var(--txt-3);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		transition: all 0.2s;
		opacity: 0;
	}

	.saved-repo-wrapper:hover .unsave-button {
		opacity: 1;
	}

	.unsave-button:hover {
		background: var(--bg-2);
		border-color: var(--acc-1);
		color: var(--txt-1);
	}

	.unsave-button :global(.icon) {
		font-size: 0.875rem;
	}

	.load-more-section {
		display: flex;
		justify-content: center;
		margin-top: 1.5rem;
	}

	.load-more-section button {
		min-width: 200px;
	}
</style>