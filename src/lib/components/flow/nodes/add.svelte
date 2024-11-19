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

	const nodeData = $derived(useNodesData($connections.map((connection) => connection.source)));

	$effect(() => {
		if (!$nodeData) return;

		const inStrings = $connections.map((c) => {
			const foundNodeData = $nodeData.find((nd) => nd.id === c.source);
			return foundNodeData.data.out[c.sourceHandle];
		});

		const sum = `(${inStrings.join(" + ")})`;
		updateNodeData(id, { out: { sum } });
	});
</script>

<Wrapper {id} label="Add">
	<Handle type="target" position={Position.Left} />
	<Handle type="source" position={Position.Right} id="sum" />
</Wrapper>
