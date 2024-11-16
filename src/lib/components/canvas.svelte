<script>
	import { ShaderCanvas } from "$lib/shader-canvas";
	import { onMount } from "svelte";
	import { frag } from "$lib/index";

	let canvas, shaderCanvas;

	onMount(() => {
		shaderCanvas = new ShaderCanvas(canvas);
		shaderCanvas.resize();

		shaderCanvas.setFragmentShader($frag);
		shaderCanvas.render();
	});

	frag.subscribe((f) => {
		if (shaderCanvas) {
			shaderCanvas.setFragmentShader(f);
		}
	});
</script>

<div class="flex-grow-0 rounded-lg bg-black p-1">
	<canvas class="aspect-video h-96 w-full rounded" bind:this={canvas}></canvas>
	{#if canvas}
		<span class="m-0 p-0 text-white">{canvas.clientWidth} x {canvas.clientHeight}</span>
	{/if}
</div>
