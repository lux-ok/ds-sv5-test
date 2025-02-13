<script lang="ts">
	import { Btn } from './index';
	import { cn } from '$lib/utils';
	import { Moon, Sun } from 'lucide-svelte';
	import { toggleMode } from 'mode-watcher';

	interface Props {
		size?: 'default' | 'sm' | 'lg' | 'icon';
		variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
		class?: string;
	}
	const { size = 'icon', variant, class: className }: Props = $props();
</script>

<Btn onclick={toggleMode} {size} {variant} class={cn('rounded-none p-0', className)}>
	{#if size === 'icon'}
		<Sun class="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
		<Moon class="absolute  rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
	{:else}
		<span class="w-14 dark:hidden">Day</span>
		<span class="hidden w-14 dark:inline">Night</span>
	{/if}
</Btn>
