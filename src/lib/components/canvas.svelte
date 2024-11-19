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

<div
	id="shadergraph-canvas"
	class="flex h-full min-h-0 w-full min-w-0 flex-col rounded-lg bg-black p-1"
>
	<canvas class="h-full min-h-0 w-full min-w-0 rounded" bind:this={canvas}></canvas>
	{#if canvas}
		<div class="flex items-center justify-between pt-1">
			<p class="m-0 p-0 pl-1 text-white">{canvas.clientWidth} x {canvas.clientHeight}</p>

			<button class="h-6" onclick={() => canvas.requestFullscreen()}
				><img
					src="https://icons.hackclub.com/api/icons/white/expand"
					alt="fullscreen"
					class="h-full"
				/></button
			>
		</div>
	{/if}
</div>
