<script>
	import { onMount } from "svelte";
	import { enhance } from "$app/forms";
	import { PaneGroup, Pane, PaneResizer } from "paneforge";
	import { SvelteFlowProvider } from "@xyflow/svelte";
	import moment from "moment";

	import { flowState, frag } from "$lib";

	let flowValue = $state();
	flowState.subscribe((v) => (flowValue = JSON.stringify(v)));

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

<SvelteFlowProvider>
	<div class="flex h-full gap-2 overflow-hidden p-2 pt-20">
		<PaneGroup direction="horizontal">
			<Pane defaultSize={50}>
				<PaneGroup direction="vertical">
					<Pane defaultSize={50} class="flex flex-col @container">
						<div id="shader-info">
							{#if data?.locals?.user?.id && (data.slug === "new" || data.locals.user.id === data.shader.userId)}
								<form
									method="POST"
									id="shader-save"
									class="mb-2 flex flex-col gap-2 @sm:flex-row"
									use:enhance
								>
									<input
										name="title"
										class="flex-grow rounded"
										placeholder="Name your shader"
										value={data?.shader?.title}
									/>
									<input name="state" bind:value={flowValue} hidden />
									<input name="glsl" bind:value={$frag} hidden />
									<button class="rounded bg-gray-100 px-3 py-2">Save</button>
								</form>
							{:else}
								<div class="mb-1 flex justify-between">
									<h1 class="ml-1 text-xl">{data.shader?.title || "New shader"}</h1>
									{#if data.user}
										<p class="inline-flex items-center">
											by {data.user.name}
											<img
												src={data.user.avatarUrl}
												alt={`avatar for author of shader`}
												class="inline h-6 w-6 rounded-full"
											/>
										</p>
									{/if}
								</div>
							{/if}

							{#if data.shader}
								Created {moment(data.shader.createdAt).fromNow()}
								<br />
								Updated {moment(data.shader.updatedAt).fromNow()}
							{/if}
						</div>

						<Canvas />
					</Pane>
					<PaneResizer class="z-20 mx-auto">
						<div class="-m-2">
							<img src="https://icons.hackclub.com/api/icons/black/more" class="h-8 w-8" />
						</div>
					</PaneResizer>
					<Pane defaultSize={50}>
						<div class="flex h-full flex-col">
							<Glsl />
							<p class="mt-1 max-h-32 overflow-auto rounded border border-black text-xs">
								{JSON.stringify($flowState)}
							</p>
						</div>
					</Pane>
				</PaneGroup>
			</Pane>
			<PaneResizer class="z-20 my-auto">
				<div class="-m-2 rotate-90">
					<img src="https://icons.hackclub.com/api/icons/black/more" class="h-8 w-8" />
				</div>
			</PaneResizer>
			<Pane defaultSize={50}><Flow state={JSON.parse(data?.shader?.state || "{}")} /></Pane>
		</PaneGroup>
	</div>
</SvelteFlowProvider>
