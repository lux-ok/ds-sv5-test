<script lang="ts">
	interface Props {
		sourceRow: number;
	}
	let { sourceRow = $bindable() }: Props = $props();
</script>

<select name="sourceRow" id="sourceRow" bind:value={sourceRow} class="w-24">
	{#each { length: 30 } as _, i}
		<option value={i}>row{i}</option>
	{/each}
</select>

<style>
	select {
		border-width: 1px;
		padding: 0.25rem 0.5rem;
		flex: 1 1 0%;
	}
</style>
