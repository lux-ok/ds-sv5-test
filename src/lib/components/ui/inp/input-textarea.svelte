<script lang="ts">
	import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements';
	import type { WithElementRef } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		value = $bindable(),
		autocomplete = 'off',
		class: className,
		chk = { invalid: false, changed: false },
		...restProps
	}: WithElementRef<HTMLTextareaAttributes> & {
		chk?: { invalid?: boolean; changed?: boolean };
	} = $props();
</script>

<textarea
	bind:this={ref}
	class={cn(
		' flex w-full bg-secondary px-3 py-1.5 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:bg-transparent md:text-sm',
		className
	)}
	class:invalid={chk.invalid}
	class:changed={chk.changed}
	bind:value
	disabled
	{autocomplete}
	{...restProps}
></textarea>

<style lang="postcss">
	.invalid {
		@apply bg-yellow-100;
	}
	.changed {
		@apply text-blue-600;
	}
</style>
