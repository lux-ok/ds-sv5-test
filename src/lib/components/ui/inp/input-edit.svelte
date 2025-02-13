<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { WithElementRef } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		value = $bindable(),
		autocomplete = 'off',
		class: className,
		chk = { invalid: false, changed: false },
		...restProps
	}: WithElementRef<HTMLInputAttributes> & {
		chk?: { invalid?: boolean; changed?: boolean };
	} = $props();
</script>

<input
	bind:this={ref}
	class={cn(
		'flex h-7 w-full bg-secondary px-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:bg-transparent md:text-sm',
		className
	)}
	bind:value
	{autocomplete}
	{...restProps}
	class:invalid={chk.invalid}
	class:changed={chk.changed}
/>

<style lang="postcss">
	.invalid {
		@apply bg-yellow-100;
	}
	.changed {
		@apply text-blue-600;
	}
</style>
