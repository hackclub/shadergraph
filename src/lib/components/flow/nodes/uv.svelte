<script>
	import { useSvelteFlow } from "@xyflow/svelte";
	import Wrapper from "../wrapper.svelte";

	const { id } = $props();
	const { updateNodeData } = useSvelteFlow();

	const dim = 2;

	updateNodeData(id, {
		out: {
			uv: "uv"
		},
		dim
	});

	const outputs = [{ id: "uv", label: "UV" }];
</script>

<Wrapper {id} label="UV" {dim} {outputs} />
