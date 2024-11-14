<script>
	import HcLogo from "/flag-orpheus-top.svg";
	// import Flag from "svelte-flagpack";

	import { i18n } from "$lib/i18n";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import * as m from "$lib/paraglide/messages.js";

	/**
	 * @param import("$lib/paraglide/runtime").AvailableLanguageTag newLanguage
	 */
	function switchToLanguage(newLanguage) {
		console.log("Switching to", newLanguage);
		const canonicalPath = i18n.route($page.url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		goto(localisedPath);
	}
</script>

<nav class="flex h-16 justify-between border border-red-500">
	<div class="flex items-center gap-8">
		<a href="https://hackclub.com" class="cursor-pointer"
			><img src={HcLogo} alt="hack club flag" class="hover:animate-wave h-16 origin-top-left" /></a
		>
		<a href="/">{m.shadergraph()}</a>
	</div>

	<div class="flex items-center gap-2">
		<a class="border border-red-500" href="/login/github">{m.log_in()}</a>
		<button class="border border-red-500" onclick={() => switchToLanguage("en")}>🇬🇧 EN</button>
		<button class="border border-red-500" onclick={() => switchToLanguage("fr")}>🇫🇷 FR</button>
	</div>
</nav>
