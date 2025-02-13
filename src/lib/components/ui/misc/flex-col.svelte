<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		class?: string;
	}
	const { children, class: className, ...restProps }: Props = $props();
</script>

<div class={cn('flex w-full flex-col', className)} {...restProps}>
	{@render children?.()}
</div>
