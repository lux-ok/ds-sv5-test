<script lang="ts">
	import { Btn } from '../btn/index';
	import { cn } from '$lib/utils';
	import { Sun } from 'lucide-svelte';
	interface Props {
		size?: 'default' | 'sm' | 'lg' | 'icon';
		variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
		class?: string;
	}
	const { size = 'icon', variant, class: className }: Props = $props();

	import { onMount } from 'svelte';
	import { isFullscreen } from './store';

	// - Check if the fullscreen API is supported
	const fullscreenSupported = !!(
		document.fullscreenEnabled ||
		(document as any).webkitFullscreenEnabled ||
		(document as any).mozFullScreenEnabled ||
		(document as any).msFullscreenEnabled
	);

	// - Toggle fullscreen mode
	function toggleFullscreen() {
		if (!fullscreenSupported) return;

		if ($isFullscreen) {
			document.exitFullscreen?.() ||
				(document as any).webkitExitFullscreen?.() ||
				(document as any).mozCancelFullScreen?.() ||
				(document as any).msExitFullscreen?.();
		} else {
			document.documentElement.requestFullscreen?.() ||
				(document as any).documentElement.webkitRequestFullscreen?.() ||
				(document as any).documentElement.mozRequestFullScreen?.() ||
				(document as any).documentElement.msRequestFullscreen?.();
		}

		$isFullscreen = !$isFullscreen;
	}

	// - Listen for fullscreen change events to update the state
	onMount(() => {
		function onFullscreenChange() {
			$isFullscreen = !!(
				document.fullscreenElement ||
				(document as any).webkitFullscreenElement ||
				(document as any).mozFullScreenElement ||
				(document as any).msFullscreenElement
			);
		}

		document.addEventListener('fullscreenchange', onFullscreenChange);
		document.addEventListener('webkitfullscreenchange', onFullscreenChange);
		document.addEventListener('mozfullscreenchange', onFullscreenChange);
		document.addEventListener('MSFullscreenChange', onFullscreenChange);

		// - Cleanup event listeners on component destroy
		return () => {
			document.removeEventListener('fullscreenchange', onFullscreenChange);
			document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
			document.removeEventListener('mozfullscreenchange', onFullscreenChange);
			document.removeEventListener('MSFullscreenChange', onFullscreenChange);
		};
	});
</script>

{#if fullscreenSupported}
	<Btn variant="outline" onclick={() => toggleFullscreen()}>
		{$isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
	</Btn>
{:else}
	<p>Fullscreen is not supported in this browser.</p>
{/if}
