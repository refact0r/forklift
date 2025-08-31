<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import PlusIcon from '~icons/ph/plus';
	import XIcon from '~icons/ph/x';
	import { auth } from '$lib/auth.svelte.js';
	import { supabase } from '$lib/supabase.js';
	import { savedRepos } from '$lib/savedRepos.svelte.js';
	import RepoCard from '$lib/components/RepoCard.svelte';
	import { COMMON_SKILLS } from '$lib/commonSkills.js';

	let languages = $state([]);
	let newLanguage = $state('');
	let loading = $state(true);
	let saving = $state(false);
	let displayLimit = $state(10);
	let loadingMore = $state(false);
	let showSuggestions = $state(false);
	let filteredSuggestions = $state([]);
	let selectedSuggestionIndex = $state(-1);

	onMount(async () => {
		// Redirect if not authenticated
		if (!auth.user) {
			goto('/');
			return;
		}

		await loadLanguages();
		await savedRepos.loadSavedRepos();
		await savedRepos.loadUserSkills();
		loading = false;

		// Add click outside listener
		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
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
			languages = data.map((item) => item.language);
		}
	}

	async function addLanguage() {
		const language = newLanguage.trim();
		if (!language || !auth.user || languages.includes(language)) {
			newLanguage = '';
			return;
		}

		// Limit to 15 skills maximum
		if (languages.length >= 15) {
			alert('Maximum 15 skills allowed');
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
			// Update skills in savedRepos manager too
			await savedRepos.loadUserSkills();
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
			languages = languages.filter((lang) => lang !== languageToRemove);
			// Update skills in savedRepos manager too
			await savedRepos.loadUserSkills();
		}
		saving = false;
	}

	function handleInput() {
		const query = newLanguage.trim();

		if (query.length === 0) {
			showSuggestions = false;
			filteredSuggestions = [];
			return;
		}

		// Filter suggestions based on input
		const suggestions = COMMON_SKILLS.filter(
			(skill) => skill.toLowerCase().includes(query.toLowerCase()) && !languages.includes(skill)
		).slice(0, 8); // Show max 8 suggestions

		filteredSuggestions = suggestions;
		showSuggestions = suggestions.length > 0;
		selectedSuggestionIndex = -1;
	}

	function handleKeydown(event) {
		if (!showSuggestions) {
			if (event.key === 'Enter') {
				addLanguage();
			}
			return;
		}

		// Handle suggestion navigation
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			selectedSuggestionIndex = Math.min(
				selectedSuggestionIndex + 1,
				filteredSuggestions.length - 1
			);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
		} else if (event.key === 'Enter') {
			event.preventDefault();
			if (selectedSuggestionIndex >= 0) {
				selectSuggestion(filteredSuggestions[selectedSuggestionIndex]);
			} else {
				addLanguage();
			}
		} else if (event.key === 'Escape') {
			showSuggestions = false;
			selectedSuggestionIndex = -1;
		}
	}

	function selectSuggestion(skill) {
		newLanguage = skill;
		showSuggestions = false;
		selectedSuggestionIndex = -1;
		addLanguage();
	}

	function handleClickOutside(event) {
		if (!event.target.closest('.add-language')) {
			showSuggestions = false;
			selectedSuggestionIndex = -1;
		}
	}

	async function loadMore() {
		if (loadingMore) return;

		loadingMore = true;
		// Simulate loading delay for better UX
		await new Promise((resolve) => setTimeout(resolve, 300));
		displayLimit += 10;
		loadingMore = false;
	}
</script>

<svelte:head>
	<title>forklift | profile</title>
</svelte:head>

<div class="content">
	{#if loading}
		<div class="loading">loading...</div>
	{:else if !auth.user}
		<div class="error">please log in to view your profile.</div>
	{:else}
		<div class="profile-header">
			<h1>{auth.user.user_metadata?.user_name || auth.user.email}</h1>
			<p>manage your skills and development interests</p>
		</div>

		<div class="section">
			<h3>your skills ({languages.length}/15)</h3>
			<p class="section-description">
				add programming languages, frameworks, and tools you're familiar with or interested in
				learning
			</p>

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
					<p>no skills added yet. add some skills to personalize your experience!</p>
				</div>
			{/if}

			<div class="add-language">
				<div class="input-group">
					<div class="input-wrapper">
						<input
							type="text"
							bind:value={newLanguage}
							onkeydown={handleKeydown}
							oninput={handleInput}
							placeholder="Enter a skill (e.g. python, flask, sveltekit)..."
							disabled={saving}
							autocomplete="off"
						/>
						{#if showSuggestions && filteredSuggestions.length > 0}
							<div class="suggestions-dropdown">
								{#each filteredSuggestions as suggestion, index}
									<button
										class="suggestion-item"
										class:selected={index === selectedSuggestionIndex}
										onclick={() => selectSuggestion(suggestion)}
									>
										{suggestion}
									</button>
								{/each}
							</div>
						{/if}
					</div>
					<button
						class="add-btn accent"
						onclick={addLanguage}
						disabled={saving || !newLanguage.trim() || languages.length >= 15}
					>
						<PlusIcon />
						add
					</button>
				</div>
			</div>
		</div>

		<div class="section">
			<h3>my list</h3>
			<p class="section-description">repositories you've saved for later</p>

			{#if savedRepos.savedRepos.length > 0}
				<div class="saved-repos-grid">
					{#each savedRepos.savedRepos.slice(0, displayLimit) as savedRepo}
						<div class="saved-repo-wrapper">
							<RepoCard
								repo={{
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
								}}
							/>
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
						<button class="button secondary" onclick={loadMore} disabled={loadingMore}>
							{loadingMore
								? 'Loading...'
								: `Load More (${savedRepos.savedRepos.length - displayLimit} remaining)`}
						</button>
					</div>
				{/if}
			{:else}
				<div class="empty-state">
					<p>
						no saved repositories yet. browse repositories and click "add to list" to save them
						here!
					</p>
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
		padding: 2rem;
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.empty-state p {
		margin: 0;
		color: var(--txt-2);
	}

	.add-language {
		max-width: 600px;
	}

	.input-group {
		display: flex;
		gap: 0.75rem;
	}

	.input-wrapper {
		position: relative;
		flex: 1;
	}

	.input-group input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--bg-3);
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

	.loading,
	.error {
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

	.suggestions-dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: var(--bg-1);
		border: 1px solid var(--bg-3);
		border-top: none;
		max-height: 200px;
		overflow-y: auto;
		z-index: 1000;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.suggestion-item {
		display: block;
		width: 100%;
		padding: 0.75rem;
		text-align: left;
		background: transparent;
		border: none;
		color: var(--txt-1);
		cursor: pointer;
		font-size: 0.875rem;
		transition: background-color 0.15s ease;
		border-bottom: 1px solid var(--bg-2);
	}

	.suggestion-item:last-child {
		border-bottom: none;
	}

	.suggestion-item:hover,
	.suggestion-item.selected {
		background: var(--bg-2);
		color: var(--acc-1);
	}

	.suggestion-item.selected {
		background: var(--acc-1);
		color: white;
	}
</style>
