<script lang="ts">
	import { Tooltip as TT } from 'bits-ui';
	import { ToggleGroup as TG } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		// - for tooltip
		ttText,
		// ttTextPressed = ttText,
		ttClass,
		ttDelay: delayDuration = 500,
		// - restProps for toggle
		...restProps
	}: TG.ItemProps & {
		// - for tooltip
		ttText?: string;
		// ttTextPressed?: string;
		ttClass?: string;
		ttDelay?: number;
	} = $props();
</script>

<TT.Provider>
	<TT.Root {delayDuration} disabled={!ttText}>
		<TT.Trigger class="disabled:pointer-events-none" disabled={restProps.disabled}>
			<!-- ! -->
			<TG.Item
				bind:ref
				class={cn(
					'inline-flex h-10 w-10 items-center justify-center gap-2 rounded-full border border-input bg-transparent text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
					className
				)}
				{value}
				{...restProps}
			/>
			<!-- ! -->
		</TT.Trigger>

		<!-- <TooltipPrimitive.Portal> -->
		<TT.Content
			sideOffset={4}
			class={cn(
				'z-50 overflow-hidden rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
				ttClass
			)}
		>
			<TT.Arrow class="text-primary" />
			{ttText}
		</TT.Content>
		<!-- </TooltipPrimitive.Portal> -->
	</TT.Root>
</TT.Provider>
