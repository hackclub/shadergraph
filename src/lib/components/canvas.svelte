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

<canvas class="aspect-video h-96 rounded" bind:this={canvas}></canvas>
