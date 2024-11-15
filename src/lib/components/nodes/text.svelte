<script>
	import { Handle, Position, useSvelteFlow } from "@xyflow/svelte";

	const { id, data } = $props();
	const { updateNodeData } = useSvelteFlow();
</script>

<div>
	<div class="label">text <span class="text-xs">({JSON.stringify(data)})</span></div>
	<div>
		<input
			value={data.text}
			oninput={(evt) => updateNodeData(id, { text: evt.currentTarget.value })}
		/>
	</div>
	<Handle type="source" position={Position.Right} />
</div>
