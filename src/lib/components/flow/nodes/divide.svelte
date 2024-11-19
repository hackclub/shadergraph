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
	const isConnectable = $derived($connections.length <= 1);

	$effect(() => {
		if (!$nodeData) return;

		const inStrings = $connections.map((c) => {
			const foundNodeData = $nodeData.find((nd) => nd.id === c.source);
			return foundNodeData.data.out[c.sourceHandle];
		});

		const quotient = `(${inStrings.join(" / ")})`;
		updateNodeData(id, { out: { quotient } });
	});
</script>

<Wrapper {id} label="Divide">
	<Handle type="target" position={Position.Left} {isConnectable} />
	<Handle type="source" position={Position.Right} id="quotient" />
</Wrapper>
