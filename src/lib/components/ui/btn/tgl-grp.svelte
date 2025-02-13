<script lang="ts">
	import { ToggleGroup as TG } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		...restProps
	}: TG.RootProps = $props();
</script>

<!--
Discriminated Unions + Destructing (required for bindable) do not
get along, so we shut typescript up by casting `value` to `never`.
-->
<TG.Root
	bind:value={value as never}
	bind:ref
	class={cn('flex items-center justify-center gap-1', className)}
	{...restProps}
/>
