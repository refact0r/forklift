/**
 * Find matching skills between repository tech stack and user's profile skills
 * @param {Object} repoTech - Repository technology object with languages and tools arrays
 * @param {Array} userSkills - User's skill list from profile
 * @returns {Array} Array of matching skill names
 */
export function findMatchingSkills(repoTech, userSkills) {
	if (!repoTech || !userSkills || userSkills.length === 0) {
		return [];
	}

	const matches = new Set();
	
	// Normalize for comparison
	const normalize = (str) => str.toLowerCase().trim();
	
	const normalizedUserSkills = userSkills.map(normalize);
	const allRepoTech = [...(repoTech.languages || []), ...(repoTech.tools || [])];
	const normalizedRepoTech = allRepoTech.map(normalize);
	
	// Direct matches
	normalizedRepoTech.forEach((tech, idx) => {
		if (normalizedUserSkills.includes(tech)) {
			matches.add(allRepoTech[idx]); // Add original casing
		}
	});
	
	// Partial matches (contains)
	allRepoTech.forEach((repoTechOriginal, idx) => {
		const repoTechNorm = normalize(repoTechOriginal);
		
		normalizedUserSkills.forEach(userSkillNorm => {
			// Check if one contains the other (e.g., "react" matches "reactjs")
			if (repoTechNorm.includes(userSkillNorm) || userSkillNorm.includes(repoTechNorm)) {
				matches.add(repoTechOriginal);
			}
		});
	});
	
	return Array.from(matches);
}

/**
 * Check if a specific skill matches any user skill
 * @param {string} skill - Skill to check
 * @param {Array} userSkills - User's skill list
 * @returns {boolean} Whether the skill matches
 */
export function isMatchingSkill(skill, userSkills) {
	if (!skill || !userSkills || userSkills.length === 0) {
		return false;
	}

	const normalize = (str) => str.toLowerCase().trim();
	const normalizedSkill = normalize(skill);
	const normalizedUserSkills = userSkills.map(normalize);

	// Direct match
	if (normalizedUserSkills.includes(normalizedSkill)) {
		return true;
	}

	// Partial match
	return normalizedUserSkills.some(userSkill => 
		normalizedSkill.includes(userSkill) || userSkill.includes(normalizedSkill)
	);
}