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
	const connections = useHandleConnections({
		nodeId: id,
		type: "target"
	});

	const nodeData = $derived(useNodesData($connections[0]?.source));
	const isConnectable = $derived($connections.length === 0);

	$effect(() => {
		if (!$nodeData) return;

		const prev = $nodeData.data.out;

		const om = prev ? `(1. - ${prev})` : null;
		updateNodeData(id, { out: { om } });
	});
</script>

<Wrapper {id} label="One minus">
	<Handle type="target" position={Position.Left} {isConnectable} />
	<div>{JSON.stringify(data)}</div>
	<Handle type="source" position={Position.Right} id="om" />
</Wrapper>
