<script>
	import Nav from "$lib/components/nav.svelte";

	import { i18n } from "$lib/i18n";
	import { ParaglideJS } from "@inlang/paraglide-sveltekit";
	import "../app.css";

	let { children, data } = $props();
</script>

<ParaglideJS {i18n}>
	<Nav user={data.locals.user} />
	{@render children()}
</ParaglideJS>
