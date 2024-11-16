<script>
	import { Handle, Position, useSvelteFlow } from "@xyflow/svelte";
	import Wrapper from "./wrapper.svelte";

	const { id } = $props();
	const { updateNodeData } = useSvelteFlow();

	updateNodeData(id, { out: "(fragCoord/iResolution.xy)" });
</script>

<Wrapper label="UV (vec2)">
	<Handle type="source" position={Position.Right} />
</Wrapper>
