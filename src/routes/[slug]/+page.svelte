<script>
	import { onMount } from "svelte";
	import { enhance } from "$app/forms";
	import { PaneGroup, Pane, PaneResizer } from "paneforge";

	import Canvas from "$lib/components/canvas.svelte";
	import Flow from "$lib/components/flow.svelte";
	import Glsl from "$lib/components/glsl.svelte";
	import Tour from "$lib/components/tour.svelte";

	let mounted = $state(false);
	onMount(
		() => (mounted = true),
		() => (mounted = false)
	);

	const { data } = $props();

	$effect(() => {
		console.log(data.tour, mounted, data);
	});
</script>

{#if data.tour && mounted && data.slug === "new"}
	<Tour />
{/if}

<div class="flex h-full gap-2 overflow-hidden p-2 pt-20">
	<PaneGroup direction="horizontal">
		<Pane defaultSize={50}>
			<PaneGroup direction="vertical">
				<Pane defaultSize={50} class="flex flex-col">
					{#if data.slug === "new"}
						<form method="POST" id="shader-save" class="mb-2 flex gap-2" use:enhance>
							<input class="flex-grow rounded" placeholder="Name your shader" />
							<button class="rounded bg-gray-100 px-3 py-2">Save</button>
						</form>
					{:else}
						<h1 class="ml-1 text-xl">{data.slug}</h1>
					{/if}

					<Canvas />
				</Pane>
				<PaneResizer class="z-20 mx-auto">
					<div class="-m-2">
						<img src="https://icons.hackclub.com/api/icons/black/more" class="h-8 w-8" />
					</div>
				</PaneResizer>
				<Pane defaultSize={50}>
					<Glsl />
				</Pane>
			</PaneGroup>
		</Pane>
		<PaneResizer class="z-20 my-auto">
			<div class="-m-2 rotate-90">
				<img src="https://icons.hackclub.com/api/icons/black/more" class="h-8 w-8" />
			</div>
		</PaneResizer>
		<Pane defaultSize={50}><Flow /></Pane>
	</PaneGroup>
</div>
