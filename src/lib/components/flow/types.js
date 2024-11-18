const nodes = Object.values(import.meta.glob("./nodes/*.svelte", { eager: true }));

export const nodeTypes = Object.fromEntries(
	nodes.map((n) => {
		const name = n.default[Object.getOwnPropertySymbols(n.default)[0]]
			.split("/")
			.at(-1)
			.split(".svelte")[0] // Kebab case name to camel case name
			.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase()); // Ditto

		return [name, n.default];
	})
);
