export async function load({ params }) {
	return { slug: params.slug, tour: true };
}

export const actions = {
	default: async (event) => {
		console.log("making a new shader!");
	}
};
