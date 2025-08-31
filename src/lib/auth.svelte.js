import { supabase } from './supabase.js';
import { browser } from '$app/environment';

let user = $state(null);
let loading = $state(true);

export const auth = {
	get user() {
		return user;
	},
	get loading() {
		return loading;
	},

	async signInWithGitHub() {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'github',
			options: {
				redirectTo: `${window.location.origin}/`
			}
		});

		if (error) {
			console.error('Error during sign in:', error);
			return { error };
		}

		return { error: null };
	},

	async signOut() {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('Error during sign out:', error);
			return { error };
		}
		user = null;
		return { error: null };
	},

	async initialize() {
		if (!browser) return;

		// Get initial session
		const {
			data: { session }
		} = await supabase.auth.getSession();
		user = session?.user ?? null;
		loading = false;

		// Listen for auth changes
		supabase.auth.onAuthStateChange((event, session) => {
			user = session?.user ?? null;
			loading = false;
		});
	}
};
