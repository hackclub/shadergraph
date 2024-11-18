<script>
	import { tweened } from "svelte/motion";
	import { cubicOut } from "svelte/easing";

	const { onclick, class: klass, children, ...rest } = $props();

	const displacement = tweened(0, {
		duration: 2_000,
		easing: cubicOut
	});
	const opacity = tweened(1, { duration: 2_000, easing: cubicOut });

	function onclickWrapper() {
		onclick();
		console.log("clicked!");
		$displacement = 1_000;
		$opacity = 0;
	}
</script>

<div>
	<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
		<defs>
			<filter
				id="dissolve-filter"
				x="-500%"
				y="-500%"
				width="1000%"
				height="1000%"
				color-interpolation-filters="sRGB"
				overflow="visible"
			>
				<!-- Generate large-scale fractal noise -->
				<feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="1" result="bigNoise" />

				<!-- Enhance noise contrast -->
				<feComponentTransfer in="bigNoise" result="bigNoiseAdjusted">
					<feFuncR type="linear" slope="3" intercept="-1" />
					<feFuncG type="linear" slope="3" intercept="-1" />
				</feComponentTransfer>

				<!-- Generate fine-grained fractal noise -->
				<feTurbulence type="fractalNoise" baseFrequency="1" numOctaves="1" result="fineNoise" />

				<!-- Merge the adjusted big noise and fine noise -->
				<feMerge result="mergedNoise">
					<feMergeNode in="bigNoiseAdjusted" />
					<feMergeNode in="fineNoise" />
				</feMerge>

				<!-- Apply displacement map to distort the image -->
				<feDisplacementMap
					in="SourceGraphic"
					in2="mergedNoise"
					scale={$displacement}
					xChannelSelector="R"
					yChannelSelector="G"
				/>
			</filter>
		</defs>
	</svg>

	<div>
		<div id="effect" style:opacity={$opacity}>
			<button class={klass} onclick={onclickWrapper} {...rest}>{@render children()}</button>
		</div>
	</div>
</div>

<style>
	#effect {
		filter: url(#dissolve-filter);
		-webkit-filter: url(#dissolve-filter);
	}
</style>
