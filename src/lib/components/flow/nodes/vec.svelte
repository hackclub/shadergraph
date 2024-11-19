<script>
	import {
		Handle,
		Position,
		useHandleConnections,
		useNodesData,
		useSvelteFlow
	} from "@xyflow/svelte";
	import Wrapper from "../wrapper.svelte";

	const { id, data } = $props();
	const { updateNodeData } = useSvelteFlow();

	let x = $state(data?.out?.x ?? 0);
	let y = $state(data?.out?.y ?? 0);
	let z = $state(data?.out?.z ?? 0);
	let w = $state(data?.out?.w ?? 0);
	const numberToGlslFloat = (n) => (Number.isInteger(n) ? n + "." : n.toString());

	const xConnections = useHandleConnections({
		nodeId: id,
		type: "target",
		id: "x"
	});
	const yConnections = useHandleConnections({
		nodeId: id,
		type: "target",
		id: "y"
	});
	const zConnections = useHandleConnections({
		nodeId: id,
		type: "target",
		id: "z"
	});
	const wConnections = useHandleConnections({
		nodeId: id,
		type: "target",
		id: "w"
	});

	const vectorDimensionality = $derived(data.dim || 1);

	const connections = $derived.by(() => {
		const cs = [$xConnections, $yConnections, $zConnections, $wConnections];
		const relevantConnections = cs.slice(0, vectorDimensionality).map((c) => c[0]);
		return relevantConnections;
	});
	const nodeDataArray = $derived(useNodesData(connections.map((c) => c?.source)));

	const inputs = $derived(
		[
			{ id: "x", label: "X" },
			{ id: "y", label: "Y" },
			{ id: "z", label: "Z" },
			{ id: "w", label: "W" }
		].slice(0, vectorDimensionality)
	);

	$effect(() => {
		/* For every `connection`, find the corresponding node in `nodeDataArray`
		 * that has the same `id` as the connections's `source`.
		 * Then, with the connection's `sourceHandle`, get the corresponding GLSL
		 * with `nodeDataArrayNode.data.out[connection.sourceHandle]`
		 */
		const inStrings = connections.map(($c) => {
			const found = $nodeDataArray.find((nodeData) => nodeData.id === $c?.source);
			return found?.data?.out?.[$c?.sourceHandle];
		});

		let outVec;
		switch (vectorDimensionality) {
			case 2:
				outVec = `vec2(${inStrings[0] ?? numberToGlslFloat(x)}, ${inStrings[1] ?? numberToGlslFloat(y)})`;
				break;
			case 3:
				outVec = `vec3(${inStrings[0] ?? numberToGlslFloat(x)}, ${inStrings[1] ?? numberToGlslFloat(y)}, ${inStrings[2] ?? numberToGlslFloat(z)})`;
				break;
			case 4:
				outVec = `vec4(${inStrings[0] ?? numberToGlslFloat(x)}, ${inStrings[1] ?? numberToGlslFloat(y)}, ${inStrings[2] ?? numberToGlslFloat(z)}, ${inStrings[3] ?? numberToGlslFloat(w)})`;
				break;
			default:
				outVec = inStrings[0] ?? numberToGlslFloat(x);
		}

		updateNodeData(id, { out: { x, y, z, w, outVec, dim: vectorDimensionality } });
	});
</script>

<!-- <svelte:window onclick={() => console.log("clicked, the vec  connections are", connections)} /> -->

<Wrapper
	{id}
	label={`Vec${vectorDimensionality}${vectorDimensionality === 1 ? " (float)" : ""}`}
	dim={vectorDimensionality}
	dimControls={true}
	{inputs}
	outputs={[{ id: "outVec", label: "Out" }]}
>
	<div class="mr-3 flex flex-col">
		<!-- {JSON.stringify(data)} -->
		{#if $xConnections.length === 0}
			<input id={`inputel-x`} bind:value={x} type="number" step="0.1" class="w-32 rounded p-0" />
		{/if}
		{#if $yConnections.length === 0 && vectorDimensionality > 1}
			<input id={`inputel-y`} bind:value={y} type="number" step="0.1" class="w-32 rounded p-0" />
		{/if}
		{#if $zConnections.length === 0 && vectorDimensionality > 2}
			<input
				id={`inputel-z`}
				bind:value={z}
				type="number"
				step="0.1"
				class="w-32 rounded p-0"
				oninput={({ currentTarget }) => {
					updateNodeData(id, { out: { z: Number(currentTarget.value) } });
				}}
			/>
		{/if}
		{#if $wConnections.length === 0 && vectorDimensionality > 3}
			<input
				id={`inputel-w`}
				bind:value={w}
				type="number"
				step="0.1"
				class="w-32 rounded p-0"
				oninput={({ currentTarget }) => {
					updateNodeData(id, { out: { w: Number(currentTarget.value) } });
				}}
			/>
		{/if}
	</div>
</Wrapper>
