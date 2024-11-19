<script>
	import { writable } from "svelte/store";
	import {
		SvelteFlow,
		Controls,
		ControlButton,
		Background,
		BackgroundVariant,
		MiniMap,
		useSvelteFlow
	} from "@xyflow/svelte";
	import "@xyflow/svelte/dist/style.css";
	import { flowState } from "$lib";
	import { nodeTypes } from "./flow/types";
	import ContextMenu from "./flow/context-menu.svelte";
	import * as exampleScene from "./example-scene";

	const { state: initialFlowState } = $props();
	console.log("Restoring state", initialFlowState);

	const { toObject } = useSvelteFlow();

	// We are using writables for the nodes and edges to sync them easily. When a user drags a node for example, Svelte Flow updates its position.
	const nodes = writable(initialFlowState?.nodes || exampleScene.nodes);

	// same for edges
	const edges = writable(initialFlowState?.edges || exampleScene.edges);

	let snapGrid = $state([20, 20]);

	const MIN_DISTANCE = 150;

	function getClosestEdge(node, nodes) {
		const closestNode = nodes.reduce(
			(res, n) => {
				if (n.id !== node.id) {
					const dx = n.position.x - node.position.x;
					const dy = n.position.y - node.position.y;
					const d = Math.sqrt(dx * dx + dy * dy);

					if (d < res.distance && d < MIN_DISTANCE) {
						res.distance = d;
						res.node = n;
					}
				}

				return res;
			},
			{
				distance: Number.MAX_VALUE,
				node: null
			}
		);

		if (!closestNode.node) {
			return null;
		}

		const closeNodeIsSource = closestNode.node.position.x < node.position.x;

		return {
			id: closeNodeIsSource
				? `${node.id}-${closestNode.node.id}`
				: `${closestNode.node.id}-${node.id}`,
			source: closeNodeIsSource ? closestNode.node.id : node.id,
			target: closeNodeIsSource ? node.id : closestNode.node.id,
			class: "temp"
		};
	}

	function onNodeDrag({ detail: { targetNode: node } }) {
		const closestEdge = getClosestEdge(node, $nodes);

		let edgeAlreadyExists = false;
		$edges.forEach((edge, i) => {
			if (edgeAlreadyExists) {
				return;
			}

			if (closestEdge) {
				// non-temporary edge already exists
				if (edge.source === closestEdge.source && edge.target === closestEdge.target) {
					edgeAlreadyExists = true;
					return;
				}

				if (edge.class !== "temp") {
					return;
				}

				if (edge.source !== closestEdge.source || edge.target !== closestEdge.target) {
					$edges[i] = closestEdge; // replace the edge
					edgeAlreadyExists = true;
				}
			} else if (edge.class === "temp") {
				$edges.splice(i, 1); // remove edge
			}
		});

		if (closestEdge && !edgeAlreadyExists) {
			$edges.push(closestEdge);
		}

		$edges = $edges;

		flowState.set(toObject());
	}

	function onNodeDragStop() {
		$edges.forEach((edge) => {
			if (edge.class === "temp") {
				edge.class = "";
			}
		});
		$edges = $edges;

		flowState.set(toObject());
	}

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
	id="shadergraph-flowview"
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
		on:nodedrag={onNodeDrag}
		on:nodedragstop={onNodeDragStop}
	>
		<Controls>
			<ControlButton on:click={() => (snapGrid = snapGrid ? null : [20, 20])} title="snap to grid">
				<img src="https://icons.hackclub.com/api/icons/black/link" alt="snap to grid" />
			</ControlButton>
		</Controls>
		<Background variant={BackgroundVariant.Dots} />
		<MiniMap />

		{#if contextPos}
			<ContextMenu pos={contextPos} {nodes} />
		{/if}
	</SvelteFlow>
</div>
