<script>
	import { writable } from "svelte/store";
	import { fade } from "svelte/transition";

	import {
		SvelteFlow,
		Controls,
		ControlButton,
		Background,
		BackgroundVariant,
		MiniMap
		// getViewportForBounds
	} from "@xyflow/svelte";
	import "@xyflow/svelte/dist/style.css";

	import { nodeTypes } from "./flow/types";
	import ContextMenu from "./flow/context-menu.svelte";

	// We are using writables for the nodes and edges to sync them easily. When a user drags a node for example, Svelte Flow updates its position.
	const nodes = writable([
		{
			id: "output",
			type: "output",
			position: { x: 900, y: 300 }
		},
		{
			id: "vec1",
			type: "vec",
			data: { dim: 3, out: { x: 0.2, y: 0.5, z: 0.1, vec: "vec3(.2, .5, .1)" } },
			position: { x: 200, y: 400 }
		},
		// {
		// 	id: "vec-1",
		// 	type: "vec",
		// 	data: { dim: 1 },
		// 	position: { x: 0, y: 400 }
		// },
		// {
		// 	id: "vec-2",
		// 	type: "vec",
		// 	data: { dim: 2 },
		// 	position: { x: 200, y: 400 }
		// },

		// {
		// 	id: "vec-4",
		// 	type: "vec",
		// 	data: { dim: 4 },
		// 	position: { x: 600, y: 400 }
		// },
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
		// {
		// 	id: "output-vec1",
		// 	type: "default",
		// 	source: "vec1",
		// 	target: "output"
		// 	// label: "Edge Text"
		// }
	]);

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
	}

	function onNodeDragStop() {
		$edges.forEach((edge) => {
			if (edge.class === "temp") {
				edge.class = "";
			}
		});
		$edges = $edges;
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
	>
		<!-- on:nodedrag={onNodeDrag} -->
		<!-- on:nodedragstop={onNodeDragStop} -->
		<!-- on:nodeclick={(event) => console.log("on node click", event.detail.node)} -->
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
