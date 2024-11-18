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

	const inputNodeData = $derived(useNodesData($connections[0]?.source));
	const isConnectable = $derived($connections.length === 0);

	let outputs = $derived(
		[
			{ id: "x", label: "X" },
			{ id: "y", label: "Y" },
			{ id: "z", label: "Z" },
			{ id: "w", label: "W" }
		].slice(0, $inputNodeData?.data?.dim || 0)
	);

	$effect(() => {
		if (!$inputNodeData) return;

		const sourceHandleId = $connections[0].sourceHandle;
		const inputContent = $inputNodeData.data.out[sourceHandleId];

		console.log({ sourceHandleId, $inputNodeData });

		const outputProps = ["x", "y", "z", "w"].slice(0, $inputNodeData.data.dim);
		const out = Object.fromEntries(outputProps.map((prop) => [prop, `${inputContent}.${prop}`]));

		console.log(outputs, out);
		updateNodeData(id, { out });
	});
</script>

<Wrapper {id} label="Split" {outputs} dim={outputs.length}>
	<Handle type="target" position={Position.Left} {isConnectable} />
	<div>{JSON.stringify(data)}</div>
	<!-- <Handle type="source" position={Position.Right} /> -->
</Wrapper>
