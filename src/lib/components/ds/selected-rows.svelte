<script lang="ts">
	const { rowsSel }: { rowsSel: { t: number; r: number }[] } = $props();
</script>

<div class="flex flex-1 flex-row flex-wrap gap-4">
	rowsSel:
	{#each rowsSel as loc, i}
		<p>[{loc.t},{loc.r}]</p>
	{/each}
</div>

<style>
	div {
		display: flex;
		flex-direction: row;
		flex: 1 1 0%;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: baseline;

		/* p {
			font-size: 0.875rem;
			line-height: 1.25rem;
		} */
	}
</style>
