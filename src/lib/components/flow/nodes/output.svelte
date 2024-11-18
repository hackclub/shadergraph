<script>
	import {
		Handle,
		Position,
		useHandleConnections,
		useNodesData,
		useSvelteFlow
	} from "@xyflow/svelte";
	import Wrapper from "../wrapper.svelte";
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
		if (!$nodeData) return;

		// No mapping is needed because this is a single input node.
		const sourceHandle = $connections[0].sourceHandle;
		const finalColour = $nodeData.data.out[sourceHandle];

		console.log({ sourceHandle, dd: $nodeData.data, finalColour });

		const fragString = `void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	// Normalized pixel coordinates (from 0 to 1)
	vec2 uv = fragCoord / iResolution.xy;

	// vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0, 2, 4));
	vec3 col = ${finalColour};

	// Output to screen
    fragColor = vec4(col, 1.);
}
`;

		updateNodeData(id, { out: { frag } });
		frag.set(fragString);
	});
</script>

<Wrapper {id} label="Fragment output">
	<Handle type="target" position={Position.Left} {isConnectable} />
	<div>{JSON.stringify(data)}</div>
</Wrapper>
