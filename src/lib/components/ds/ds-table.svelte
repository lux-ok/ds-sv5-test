<script lang="ts">
	import type { MyType } from '$lib/test-data/object';

	interface Props {
		table: MyType[];
		tid: number;
		isSelectedTable?: (tid: number) => boolean;
		isSelectedRow?: (loc: { t: number; r: number }) => boolean;
		onTableSelect?: (tid: number, e: MouseEvent) => void;
		onTableDelete?: (tid: number) => void;
		onRowSelect?: (loc: { t: number; r: number }, e: MouseEvent) => void;
		onRowDelete?: (loc: { t: number; r: number }) => void;
	}
	const {
		table,
		tid,
		isSelectedTable,
		isSelectedRow,
		onTableSelect,
		onTableDelete,
		onRowSelect,
		onRowDelete
	}: Props = $props();
</script>

<div-wrap class:isSelectedTable={isSelectedTable?.(tid)}>
	<div-head>
		<button class="btn-select" onclick={(e) => onTableSelect?.(tid, e)}>Select Table {tid}</button>
		<button class="btn-delete" onclick={() => onTableDelete?.(tid)}>Del</button>
	</div-head>

	{#each table as row, rid}
		<div-row class:isSelectedRow={isSelectedRow?.({ t: tid, r: rid })}>
			<button class="btn-select" onclick={(e) => onRowSelect?.({ t: tid, r: rid }, e)}>
				<p>id: {row.id}</p>
				<p>{row.rem}</p>
				<p>{row.meta?.title}</p>
			</button>
			<button class="btn-delete" onclick={() => onRowDelete?.({ t: tid, r: rid })}> Del </button>
		</div-row>
	{/each}
</div-wrap>

<style>
	.isSelectedTable {
		border-color: red;
	}

	.isSelectedRow {
		background-color: rgb(254 252 232);
	}

	div-wrap {
		display: flex;
		flex-direction: column;
		width: 18rem;
		border-width: 1px;
		height: fit-content;
	}

	div-head {
		display: flex;
		flex-direction: row;
	}

	div-row {
		display: flex;
		flex-direction: row;
		border-top-width: 1px;
	}

	.btn-select {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
		flex: 1 1 0%;
		border-right-width: 1px;
		padding: 0.5rem 1rem;
	}

	.btn-delete {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
	}

	p {
		font-size: 0.875rem;
		line-height: 1.25rem;
	}
</style>
