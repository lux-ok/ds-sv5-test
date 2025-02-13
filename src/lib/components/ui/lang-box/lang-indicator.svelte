<script lang="ts">
	import { cn } from '$lib/utils';
	import { langMap } from '.';
	let { lang, class: className }: { lang: number; class?: string } = $props();
</script>

<div class={cn('rounded-md bg-secondary px-2 py-1 text-xs', className)}>
	{langMap.get(lang)?.toUpperCase()}
</div>
