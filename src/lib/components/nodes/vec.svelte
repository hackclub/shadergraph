<script>
	import { Handle, Position, useSvelteFlow } from "@xyflow/svelte";
	import Wrapper from "./wrapper.svelte";

	const { id, data } = $props();
	const { updateNodeData } = useSvelteFlow();

	const vectorDimensionality = $derived(data.dim || 1);

	let x = $derived.by(() => {
		const d = data.x ?? 0;
		return Number.isInteger(d) ? d + "." : d.toString();
	});
	let y = $derived.by(() => {
		const d = data.y ?? 0;
		return Number.isInteger(d) ? d + "." : d.toString();
	});
	let z = $derived.by(() => {
		const d = data.z ?? 0;
		return Number.isInteger(d) ? d + "." : d.toString();
	});
	let w = $derived.by(() => {
		const d = data.w ?? 0;
		return Number.isInteger(d) ? d + "." : d.toString();
	});

	$effect(() => {
		let out;
		switch (vectorDimensionality) {
			case 2:
				out = `vec2(${x}, ${y})`;
				break;
			case 3:
				out = `vec3(${x}, ${y}, ${z})`;
				break;
			case 4:
				out = `vec4(${x}, ${y}, ${z}, ${w})`;
				break;
			default:
				out = x;
		}

		updateNodeData(id, { out });
	});
</script>

<Wrapper label={`vec${vectorDimensionality}${vectorDimensionality === 1 ? " (float)" : ""}`}>
	<div class="flex flex-col gap-1">
		{#each ["x", "y", "z", "w"].slice(0, vectorDimensionality) as dim}
			<label class="font-mono">
				{dim}
				<input
					value={data[dim]}
					type="number"
					step="0.1"
					class="w-32 rounded p-0.5"
					oninput={({ currentTarget }) => {
						updateNodeData(id, { [dim]: Number(currentTarget.value) });
					}}
				/>
			</label>
		{/each}
	</div>
	{JSON.stringify(data)}
	<Handle type="source" position={Position.Right} />
</Wrapper>
