<script>
	import { i18n } from "$lib/i18n";
	import { availableLanguageTags, languageTag } from "$lib/paraglide/runtime.js";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { enhance } from "$app/forms";
	import * as m from "$lib/paraglide/messages.js";
	import { Toaster, toast } from "svelte-sonner";
	let { user } = $props();

	/**
	 * @param import("$lib/paraglide/runtime").AvailableLanguageTag newLanguage
	 */
	async function switchToLanguage(newLanguage) {
		const canonicalPath = i18n.route($page.url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);

		await goto(localisedPath);

		if (user) {
			const formData = new FormData();
			formData.append("language", newLanguage);
			fetch("/?/prefs", { method: "POST", body: formData })
				.then(() => toast(m.language_saved()))
				.catch(console.error);
		}
	}
</script>

<Toaster />
<nav
	class="fixed left-0 right-0 top-0 m-2 flex h-16 justify-between rounded border border-black bg-gray-200 px-4"
>
	<div class="flex items-center gap-8">
		<a href="https://hackclub.com" aria-label="hack club" class="cursor-pointer">
			<enhanced:img
				src="/static/flag-orpheus-top.png"
				alt="hack club flag"
				class="h-16 w-auto origin-top-left object-contain hover:animate-wave"
			/>
		</a>
		<a href="/">
			<img src="/logo.png" class="h-16 w-auto origin-top-left object-contain py-1" alt="logo" />
		</a>
	</div>

	<div class="flex items-center gap-2">
		{#if user}
			<form method="post" action="/?/logout" use:enhance>
				<button>{m.log_out()}</button>
			</form>

			<p>{m.short_greeting({ name: user.name })}</p>
			<img src={user.avatarUrl} alt="your github avatar" class="h-8 w-8 rounded-full" />
		{:else}
			<form method="post" action="/?/login" use:enhance>
				<button>{m.log_in()}</button>
			</form>
		{/if}

		<select
			name="language"
			onchange={({ target }) => switchToLanguage(target.value)}
			class="appearance-none rounded border border-gray-300 px-2 py-1 pr-8 text-sm
                           hover:border-gray-400 focus:border-blue-500 focus:outline-none"
		>
			{#each availableLanguageTags as tag}
				<option value={tag} selected={tag === languageTag()}>{tag}</option>
			{/each}
		</select>
	</div>
</nav>
