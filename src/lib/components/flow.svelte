<script>
	import { writable } from "svelte/store";
	import { fade } from "svelte/transition";

	import {
		SvelteFlow,
		Controls,
		Background,
		BackgroundVariant,
		MiniMap
		// getViewportForBounds
	} from "@xyflow/svelte";
	import "@xyflow/svelte/dist/style.css";

	import OutputNode from "./nodes/output.svelte";
	import TextNode from "./nodes/text.svelte";
	import VecNode from "./nodes/vec.svelte";
	import AddNode from "./nodes/add.svelte";
	import MultiplyNode from "./nodes/multiply.svelte";
	import OneMinusNode from "./nodes/one-minus.svelte";
	import SineNode from "./nodes/sine.svelte";
	import TimeNode from "./nodes/time.svelte";
	import UvNode from "./nodes/uv.svelte";

	// We are using writables for the nodes and edges to sync them easily. When a user drags a node for example, Svelte Flow updates its position.
	const nodes = writable([
		{
			id: "1",
			type: "input",
			data: { label: "Input Node" },
			position: { x: -300, y: 0 }
		},
		{
			id: "2",
			type: "default",
			data: { label: "Node" },
			position: { x: -300, y: 150 }
		},
		{
			id: "output",
			type: "output",
			position: { x: 200, y: 200 }
		},
		{
			id: "vec-1",
			type: "vec",
			data: { dim: 1 },
			position: { x: 0, y: 400 }
		},
		{
			id: "vec-2",
			type: "vec",
			data: { dim: 2 },
			position: { x: 200, y: 400 }
		},
		{
			id: "vec-3",
			type: "vec",
			data: { dim: 3 },
			position: { x: 400, y: 400 }
		},
		{
			id: "vec-4",
			type: "vec",
			data: { dim: 4 },
			position: { x: 600, y: 400 }
		},
		{
			id: "om-1",
			type: "oneMinus",
			position: { x: 50, y: 200 }
		},
		{
			id: "add-1",
			type: "add",
			position: { x: 200, y: 200 }
		},
		{
			id: "multiply-1",
			type: "multiply",
			position: { x: 200, y: 200 }
		},
		{
			id: "sin-1",
			type: "sine",
			position: { x: 200, y: 100 }
		},
		{
			id: "time-1",
			type: "time",
			position: { x: 100, y: 100 }
		},
		{
			id: "uv-1",
			type: "uv",
			position: { x: -100, y: 100 }
		}
	]);

	// same for edges
	const edges = writable([
		{
			id: "1-2",
			type: "default",
			source: "1",
			target: "2",
			label: "Edge Text"
		}
	]);

	const snapGrid = [20, 20];

	const nodeTypes = {
		output: OutputNode,
		text: TextNode,
		vec: VecNode,
		add: AddNode,
		multiply: MultiplyNode,
		oneMinus: OneMinusNode,
		sine: SineNode,
		time: TimeNode,
		uv: UvNode
	};

	let contextPos = $state(null);
</script>

<svelte:window
	oncontextmenu={(e) => {
		const pane = document.querySelector(".svelte-flow__pane");
		if (pane.contains(e.target)) {
			e.preventDefault();
			console.log(e);
			contextPos = { x: e.offsetX, y: e.offsetY };
		} else {
			contextPos = null;
		}
	}}
	onclick={(e) => {
		contextPos = null;
	}}
/>

<div
	class="relative h-full w-full select-none rounded-lg bg-black p-1"
	role="none"
	onkeydown={console.log}
>
	<SvelteFlow
		{nodes}
		{nodeTypes}
		{edges}
		{snapGrid}
		fitView
		class="rounded"
		on:paneclick={() => (contextPos = null)}
	>
		<!-- on:nodeclick={(event) => console.log("on node click", event.detail.node)} -->
		<Controls />
		<Background variant={BackgroundVariant.Dots} />
		<MiniMap />

		{#if contextPos}
			<div
				transition:fade={{ duration: 60 }}
				class="absolute z-20 border border-red-500 bg-red-100"
				style:left={`${contextPos.x}px`}
				style:top={`${contextPos.y}px`}
			>
				Add a node

				<div class="flex flex-col items-start gap-1">
					{#each Object.keys(nodeTypes) as nodeType}
						<button
							onclick={() => {
								nodes.set([
									...$nodes,
									{
										id: `vec-${crypto.randomUUID()}`,
										type: nodeType,
										data: { dim: 1 },
										position: { x: 0, y: 0 }
									}
								]);
							}}>{nodeType}</button
						>
					{/each}
				</div>
			</div>
		{/if}
	</SvelteFlow>
</div>
