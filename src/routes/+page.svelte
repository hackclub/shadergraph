<script>
	import Canvas from "$lib/components/canvas.svelte";
	import Flow from "$lib/components/flow.svelte";
	import Glsl from "$lib/components/glsl.svelte";
</script>

<div class="flex h-full gap-2 overflow-hidden p-2 pt-20">
	<div class="flex h-full flex-col gap-2">
		<Canvas />
		<Glsl />
	</div>
	<Flow />
</div>
