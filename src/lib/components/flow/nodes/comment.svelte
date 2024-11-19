<script>
	import { Handle, Position, useSvelteFlow } from "@xyflow/svelte";
	import Wrapper from "../wrapper.svelte";

	const { id, data } = $props();
	const { updateNodeData } = useSvelteFlow();

	let str = $state(`I love no-op nodes!
Especially ones that scale with their content :3`);

	$effect(() => {
		updateNodeData(id, { out: { str } });
	});
</script>

<Wrapper {id} label="Comment">
	<textarea
		class="rounded border-0 p-0"
		style="field-sizing: content; resize: none;"
		bind:value={str}
	></textarea>
</Wrapper>
