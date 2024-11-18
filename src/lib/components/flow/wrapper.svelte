<script>
	import { Handle, Position, useSvelteFlow } from "@xyflow/svelte";
	const { id, label, dim, dimControls = false, inputs, outputs, children } = $props();
	const { updateNodeData } = useSvelteFlow();
</script>

<div
	class="h-full min-w-20 flex-col rounded-2xl border border-solid border-gray-200 bg-white/70 shadow-[0_7px_9px_0_rgba(0,0,0,0.02)]"
>
	<div
		class="flex justify-between rounded-t-2xl border-b border-solid border-gray-200 px-3 py-2 font-mono text-xs font-semibold"
	>
		{label}

		{#if dim}
			<div class="flex items-center gap-4 text-[#8492a6]">
				{#if dimControls}
					<div class="flex">
						<button
							title="increase dimensionality"
							onclick={() => {
								if (dim < 4) {
									updateNodeData(id, { dim: dim + 1 });
								}
							}}
							><img
								src="https://icons.hackclub.com/api/icons/hackclub-muted/up-caret"
								alt="up caret"
								class="h-6"
							/></button
						>
						<button
							title="decrease dimensionality"
							onclick={() => {
								if (dim > 1) {
									console.log("reducing from ", dim);
									updateNodeData(id, { dim: dim - 1 });
								}
							}}
							><img
								src="https://icons.hackclub.com/api/icons/hackclub-muted/down-caret"
								alt="down caret"
								class="h-6"
							/></button
						>
					</div>
				{/if}

				<div class="flex">
					<img src="https://icons.hackclub.com/api/icons/hackclub-muted/grid" class="h-4" alt="" />
					<span class="font-normal">{dim}</span>
				</div>
			</div>
		{/if}
	</div>
	<div class="relative flex rounded-b-2xl bg-white p-3">
		<div>
			{#each inputs as { id, label }, idx}
				<div class="relative">
					<p class="text-right">{label}</p>
					<Handle
						type="target"
						position={Position.Left}
						{id}
						style="left: -12.5px; width: 8px; height: 8px;"
					/>
				</div>
			{/each}
		</div>
		{@render children?.()}
		<div>
			{#each outputs as { id, label }, idx}
				<div class="relative">
					<p class="text-right">{label}</p>
					<Handle
						type="source"
						position={Position.Right}
						{id}
						style="right: -12.5px; width: 8px; height: 8px;"
					/>
				</div>
			{/each}
		</div>
	</div>
</div>
