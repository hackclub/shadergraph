<script>
	import {
		Handle,
		Position,
		useHandleConnections,
		useNodesData,
		useSvelteFlow
	} from "@xyflow/svelte";
	import Wrapper from "./wrapper.svelte";
	import { frag } from "$lib/index";

	const { id, data } = $props();

	const { updateNodeData } = useSvelteFlow();
	const connections = useHandleConnections({
		nodeId: id,
		type: "target"
	});

	const nodeData = $derived(useNodesData($connections[0]?.source));
	const isConnectable = $derived($connections.length === 0);

	$effect(() => {
		console.log({ $nodeData });
		if (!$nodeData) return;

		const finalColour = $nodeData.data.out;
		console.log(finalColour);

		const out = finalColour
			? `void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
			fragColor = vec4(${finalColour}, 1.);
		}
`
			: null;

		updateNodeData(id, { out });
		frag.set(out);
	});
</script>

<Wrapper label="Fragment output">
	<Handle type="target" position={Position.Left} {isConnectable} />
	<div>{JSON.stringify(data)}</div>
</Wrapper>
