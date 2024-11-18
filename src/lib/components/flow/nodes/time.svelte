<script>
	import { useSvelteFlow } from "@xyflow/svelte";
	import Wrapper from "../wrapper.svelte";

	const { id } = $props();
	const { updateNodeData } = useSvelteFlow();

	const dim = 1;

	updateNodeData(id, {
		out: {
			time: "iTime",
			sinTime: "sin(iTime)",
			cosTime: "cos(iTime)"
		},
		dim
	});

	const outputs = [
		{ id: "time", label: "Time" },
		{ id: "sinTime", label: "Sine Time" },
		{ id: "cosTime", label: "Cosine Time" }
	];
</script>

<Wrapper {id} label="Time" {dim} {outputs} />
