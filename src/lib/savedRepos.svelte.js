import { supabase } from './supabase.js';
import { auth } from './auth.svelte.js';

class SavedReposManager {
	savedRepos = $state([]);
	isLoading = $state(false);

	async loadSavedRepos() {
		if (!auth.user) {
			this.savedRepos = [];
			return;
		}

		this.isLoading = true;
		try {
			const { data, error } = await supabase
				.from('saved_repositories')
				.select('*')
				.eq('user_id', auth.user.id)
				.order('saved_at', { ascending: false });

			if (error) {
				console.error('Error loading saved repos:', error);
			} else {
				this.savedRepos = data || [];
			}
		} catch (error) {
			console.error('Error loading saved repos:', error);
		} finally {
			this.isLoading = false;
		}
	}

	async saveRepo(repoData) {
		if (!auth.user) return false;

		try {
			const { error } = await supabase
				.from('saved_repositories')
				.insert({
					user_id: auth.user.id,
					repo_owner: repoData.owner,
					repo_name: repoData.name,
					repo_full_name: repoData.full_name,
					repo_description: repoData.description,
					repo_stars: repoData.stargazers_count || 0,
					repo_language: repoData.language
				});

			if (error) {
				console.error('Error saving repo:', error);
				return false;
			}

			// Add to local state
			this.savedRepos = [{
				repo_owner: repoData.owner,
				repo_name: repoData.name,
				repo_full_name: repoData.full_name,
				repo_description: repoData.description,
				repo_stars: repoData.stargazers_count || 0,
				repo_language: repoData.language,
				saved_at: new Date().toISOString()
			}, ...this.savedRepos];

			return true;
		} catch (error) {
			console.error('Error saving repo:', error);
			return false;
		}
	}

	async unsaveRepo(owner, name) {
		if (!auth.user) return false;

		try {
			const { error } = await supabase
				.from('saved_repositories')
				.delete()
				.eq('user_id', auth.user.id)
				.eq('repo_owner', owner)
				.eq('repo_name', name);

			if (error) {
				console.error('Error unsaving repo:', error);
				return false;
			}

			// Remove from local state
			this.savedRepos = this.savedRepos.filter(
				repo => !(repo.repo_owner === owner && repo.repo_name === name)
			);

			return true;
		} catch (error) {
			console.error('Error unsaving repo:', error);
			return false;
		}
	}

	isRepoSaved(owner, name) {
		return this.savedRepos.some(
			repo => repo.repo_owner === owner && repo.repo_name === name
		);
	}
}

export const savedRepos = new SavedReposManager();