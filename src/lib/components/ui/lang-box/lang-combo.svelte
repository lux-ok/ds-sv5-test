<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		lang?: number;
		class?: string;
		children?: Snippet;
		id?: string;
		disabled?: boolean;
		chk?: { invalid: boolean; changed: boolean };
	}
	let {
		id,
		disabled,
		chk,
		lang = $bindable(),
		class: className,
		children,
		...restProps
	}: Props = $props();
</script>

<select
	class={cn(
		'w-12 appearance-none bg-secondary px-2 py-0.5 text-center text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:bg-transparent disabled:opacity-100 md:text-sm',
		className
	)}
	{id}
	{disabled}
	class:invalid={chk?.invalid}
	class:changed={chk?.changed}
	bind:value={lang}
	{...restProps}
>
	<option value={-1}>XX</option>
	<option value={1}>EN</option>
	<option value={2}>CN</option>
	<option value={3}>HK</option>
</select>

<style lang="postcss">
	option {
		@apply inline-flex items-start;
	}
	.invalid {
		@apply bg-yellow-100;
	}
	.changed {
		@apply text-blue-600;
	}
</style>
