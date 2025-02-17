<script lang="ts">
	interface Props {
		sourceTable: number;
	}
	let { sourceTable = $bindable() }: Props = $props();
</script>

<select name="sourceTable" id="sourceTable" bind:value={sourceTable}>
	{#each { length: 6 } as _, i}
		<option value={i}>table{i}</option>
	{/each}
</select>

<style>
	select {
		border-width: 1px;
		padding: 0.25rem 0.5rem;
		flex: 1 1 0%;
	}
</style>
