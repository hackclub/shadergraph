<script>
	import {
		Handle,
		Position,
		useHandleConnections,
		useNodesData,
		useSvelteFlow
	} from "@xyflow/svelte";
	import Wrapper from "./wrapper.svelte";

	const { id, data } = $props();

	const { updateNodeData } = useSvelteFlow();
	const connections = useHandleConnections({
		nodeId: id,
		type: "target"
	});

	const nodeData = $derived(useNodesData($connections.map((connection) => connection.source)));

	$effect(() => {
		if (!$nodeData) return;

		const out = `(${$nodeData.map(({ data }) => data.out).join(" * ")})`;
		updateNodeData(id, { out });
	});
</script>

<Wrapper label="Multiply">
	<Handle type="target" position={Position.Left} />
	<div>{JSON.stringify(data)}</div>
	<Handle type="source" position={Position.Right} />
</Wrapper>
