import { redirect } from '@sveltejs/kit';

export async function load({ url, locals, fetch }) {
	// Note: Authentication check happens client-side for now
	// The client will redirect to home if not authenticated
	
	const skillsParam = url.searchParams.get('skills');
	
	if (!skillsParam) {
		// Return empty state, client will handle skill loading and redirect to load data
		return {
			recommendations: [],
			hasSkills: false,
			userSkills: [],
			error: null,
			needsSkillsLoad: true
		};
	}

	try {
		const skills = JSON.parse(decodeURIComponent(skillsParam));
		
		// Call the recommendations API
		const response = await fetch(`/api/recommendations?skills=${skillsParam}`);
		
		if (!response.ok) {
			throw new Error(`API request failed: ${response.status} ${response.statusText}`);
		}

		const result = await response.json();
		
		return {
			recommendations: result.recommendations || [],
			hasSkills: result.hasSkills || false,
			userSkills: result.userSkills || skills,
			error: result.error || null,
			needsSkillsLoad: false
		};
	} catch (err) {
		return {
			recommendations: [],
			hasSkills: false,
			userSkills: [],
			error: err.message,
			needsSkillsLoad: false
		};
	}
}
