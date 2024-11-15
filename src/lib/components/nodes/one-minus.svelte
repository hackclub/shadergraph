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

	const nodeData = $derived(useNodesData($connections[0]?.source));
	const isConnectable = $derived($connections.length === 0);

	$effect(() => {
		if (!$nodeData) return;

		const prev = $nodeData.data.out;
		const out = prev ? `(1. - ${prev})` : null;
		console.log(prev, out);

		updateNodeData(id, { out });
	});
</script>

<Wrapper label="om">
	<Handle type="target" position={Position.Left} {isConnectable} />
	<div>{JSON.stringify(data)}</div>
	<Handle type="source" position={Position.Right} />
</Wrapper>
