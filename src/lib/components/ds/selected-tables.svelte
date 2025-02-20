<script lang="ts">
	const { tablesSel }: { tablesSel: number[] } = $props();
</script>

<div>
	tablesSel:
	{#each tablesSel as tid, i}
		<p>[{tid}]</p>
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
