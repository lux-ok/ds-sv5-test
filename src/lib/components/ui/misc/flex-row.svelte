<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface SpringProps {
		children?: Snippet;
		class?: string;
	}
	const { children, class: className, ...restProps }: SpringProps = $props();
</script>

<div class={cn('flex flex-row items-center', className)} {...restProps}>
	{@render children?.()}
</div>
