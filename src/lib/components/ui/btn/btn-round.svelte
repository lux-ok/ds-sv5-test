<script lang="ts" module>
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { Tooltip as TT } from 'bits-ui'; // !

	type ButtonProps = WithElementRef<HTMLButtonAttributes> & WithElementRef<HTMLAnchorAttributes>;

	interface Props extends ButtonProps {
		ttText?: string;
		ttClass?: string;
		ttDelay?: number;
	}
</script>

<script lang="ts">
	import { cn } from '$lib/utils.js';

	let {
		class: className,
		ref = $bindable(null),
		children,
		// - for tooltip
		ttText,
		ttClass: ttClassName,
		ttDelay: delayDuration = 500,
		//
		...restProps
	}: Props = $props();
</script>

<TT.Provider>
	<TT.Root {delayDuration} disabled={!ttText}>
		<TT.Trigger class="rounded-full disabled:pointer-events-none" disabled={restProps.disabled}>
			<button
				bind:this={ref}
				class={cn(
					'inline-flex h-10 w-10 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-input text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
					className
				)}
				{...restProps}
			>
				{@render children?.()}</button
			>
		</TT.Trigger>

		<TT.Content
			sideOffset={2}
			class={cn(
				'z-50 overflow-hidden rounded-lg bg-primary px-2 py-1 text-sm text-primary-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
				ttClassName
			)}
		>
			<TT.Arrow>
				<div class={cn('h-2 w-2 -translate-y-1 rotate-45 bg-primary')}></div>
			</TT.Arrow>
			{ttText}
		</TT.Content>
	</TT.Root>
</TT.Provider>
