<script>
	import { onMount } from "svelte";
	import { frag } from "$lib/index";
	import hljs from "highlight.js/lib/core";
	import glsl from "highlight.js/lib/languages/glsl";
	import "highlight.js/styles/github-dark.css";
	hljs.registerLanguage("glsl", glsl);

	let code;

	frag.subscribe((f) => {
		if (!code) return;

		delete code.dataset.highlighted;
		code.textContent = f;
		hljs.highlightAll();
	});

	onMount(() => {
		hljs.highlightAll();
	});
</script>

<div id="shadergraph-codeview" class="h-full overflow-auto rounded-lg">
	<pre class="h-full"><code class="language-glsl h-full" bind:this={code}
			>{$frag}
</code></pre>
</div>
