export async function load({ parent }) {
	// Get issues and classifications from parent layout
	const parentData = await parent();

	// Return all the data from parent - classifiedIssues, owner, repo, etc.
	return parentData;
}
