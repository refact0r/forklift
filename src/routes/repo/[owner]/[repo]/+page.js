export function load({ params }) {
	return {
		owner: params.owner,
		repo: params.repo
	};
}
