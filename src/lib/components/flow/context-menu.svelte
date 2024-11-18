<script>
	import { fly } from "svelte/transition";
	import { useSvelteFlow } from "@xyflow/svelte";

	import { nodeTypes } from "./types";
	const { pos, nodes } = $props();
	const { screenToFlowPosition } = useSvelteFlow();

	/**
	 * Converts a camelCase string to Title Case
	 * @param {string} str - The camelCase string to convert
	 * @returns {string} The converted Title Case string
	 * @throws {Error} If input is not a string
	 *
	 * @example
	 * camelToTitle('helloWorld') // returns 'Hello World'
	 * camelToTitle('thisIsALongVariable') // returns 'This Is A Long Variable'
	 * camelToTitle('ABC') // returns 'A B C'
	 * camelToTitle('PDFFile') // returns 'PDF File'
	 */
	function camelToTitle(str) {
		// Input validation
		if (typeof str !== "string") {
			throw new Error("Input must be a string");
		}

		if (str.length === 0) {
			return "";
		}

		// Handle acronyms by keeping consecutive uppercase letters together
		const withSpaces = str
			.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2") // Split "PDFFile" -> "PDF File"
			.replace(/([a-z])([A-Z])/g, "$1 $2"); // Split "camelCase" -> "camel Case"

		const split = withSpaces.toLowerCase().split(" ");
		split[0] = split[0].charAt(0).toUpperCase() + split[0].slice(1);
		return split.join(" ");
	}
</script>

<div
	in:fly={{ y: -20, duration: 200 }}
	out:fly={{ y: 20, duration: 200 }}
	class="absolute z-10 min-w-20 flex-col rounded-2xl border border-solid border-gray-200 bg-white/70 shadow-[0_7px_9px_0_rgba(0,0,0,0.02)]"
	style:left={`${pos.x}px`}
	style:top={`${pos.y}px`}
>
	<div
		class="flex justify-between rounded-t-2xl border-b border-solid border-gray-200 px-3 py-2 font-mono text-xs font-semibold"
	>
		Add a node
	</div>

	<div class="flex flex-col">
		{#each Object.keys(nodeTypes) as nodeType}
			<button
				class="w-full p-0.5 text-left transition-colors hover:bg-gray-100"
				onclick={(e) => {
					console.log();
					nodes.set([
						...$nodes,
						{
							id: `vec-${crypto.randomUUID()}`,
							type: nodeType,
							data: { dim: 1 },
							position: screenToFlowPosition({
								x: e.clientX,
								y: e.clientY
							})
						}
					]);
				}}>{camelToTitle(nodeType)}</button
			>
		{/each}
	</div>
</div>
