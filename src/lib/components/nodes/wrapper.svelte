<script>
	const { label, children } = $props();
</script>

<div
	class="flex h-full flex-col rounded-2xl border border-solid border-gray-200 bg-white/70 shadow-[0_7px_9px_0_rgba(0,0,0,0.02)]"
>
	<div
		class="rounded-t-2xl border-b border-solid border-gray-200 px-3 py-2 font-mono text-xs font-semibold"
	>
		{label}
	</div>
	<div class="relative flex rounded-b-2xl bg-white p-3">{@render children()}</div>
</div>
