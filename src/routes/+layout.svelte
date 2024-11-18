<script>
	import { onNavigate } from "$app/navigation";

	import Nav from "$lib/components/nav.svelte";

	import { i18n } from "$lib/i18n";
	import { ParaglideJS } from "@inlang/paraglide-sveltekit";
	import "../app.css";

	let { children, data } = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<ParaglideJS {i18n}>
	<Nav user={data.locals.user} />

	<main class="h-full">
		{@render children()}
	</main>
</ParaglideJS>
