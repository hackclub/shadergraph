<script>
	import { Handle, Position, useSvelteFlow } from "@xyflow/svelte";
	import Wrapper from "./wrapper.svelte";

	const { id } = $props();
	const { updateNodeData } = useSvelteFlow();

	updateNodeData(id, { out: "iTime" });
</script>

<Wrapper label="Time">
	<Handle type="source" position={Position.Right} />
</Wrapper>
