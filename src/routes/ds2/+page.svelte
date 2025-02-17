<script lang="ts">
	import { type MyType, allTables, allRows } from '$lib/test-data/object';
	import { Dsm, type DsCore } from '@lux721/ds';
	import {
		addBulkTables,
		addTableAbove,
		addTableBelow,
		delRow,
		delTable,
		delTables,
		popRow,
		popTable,
		pushRow,
		pushTable,
		shiftRow,
		shiftTable,
		unshiftRow,
		unshiftTable
	} from '@lux721/ds/func';
	import SelectTable from '$lib/components/ds/select-table.svelte';
	import SelectRow from '$lib/components/ds/select-row.svelte';
	import SelectedTables from '$lib/components/ds/selected-tables.svelte';
	import SelectedRows from '$lib/components/ds/selected-rows.svelte';
	import DsTable from '$lib/components/ds/ds-table.svelte';

	let changeSel = $state(false);
	let sort = $state(false);
	let sourceTable: number = $state(0);
	let sourceRow: number = $state(0);

	const srcTable = $derived(allTables[sourceTable]);
	const srcRow = $derived(allRows[sourceRow]);

	const core: DsCore<MyType> = $state({ tables: [], tablesSel: [], rowsSel: [] });
	const ds = new Dsm({ core, useClone: true });

	function handleDelTable(tid: number) {
		delTable(ds, { select: tid });
	}
</script>

<!-- - deselect all tables and rows - -->
<svelte:window onkeydown={(e) => e.code === 'Escape' && e.ctrlKey && ds.deselectAll()} />

<section>
	<div-checkbox>
		<label for="changeSel">changeSel</label>
		<input type="checkbox" id="changeSel" bind:checked={changeSel} />
		<label for="sort">sort selected</label>
		<input type="checkbox" id="sort" bind:checked={sort} />
	</div-checkbox>

	<SelectedTables tablesSel={ds.tablesSel} />
	<SelectedRows rowsSel={ds.rowsSel} />
</section>

<section>
	<SelectTable bind:sourceTable />
	<SelectRow bind:sourceRow />
</section>

<section>
	<button
		onclick={() => addBulkTables(ds, allTables, { select: 'tables', which: 'all', changeSel })}
		>addBulkTables</button
	>
	<button onclick={() => unshiftTable(ds, srcTable, { changeSel })}>unshiftTable</button>
	<button onclick={() => pushTable(ds, srcTable, { changeSel })}>pushTable</button>
	<button onclick={() => shiftTable(ds, { changeSel })}>shiftTable</button>
	<button onclick={() => popTable(ds, { changeSel })}>popTable</button>
	<button onclick={() => addTableAbove(ds, srcTable, { changeSel })}>addTableAbove</button>
	<button onclick={() => addTableBelow(ds, srcTable, { changeSel })}>addTableBelow</button>
	<button onclick={() => delTables(ds, { changeSel })}>delTables</button>
</section>

<section>
	<button onclick={() => unshiftRow(ds, srcRow, { changeSel })}>unshiftRow</button>
	<button onclick={() => pushRow(ds, srcRow, { changeSel })}>pushRow</button>
	<button onclick={() => shiftRow(ds, { changeSel })}>shiftRow</button>
	<button onclick={() => popRow(ds, { changeSel })}>popRow</button>
</section>

<section>
	{#each ds.tables as table, tid}
		<DsTable
			{table}
			{tid}
			isSelectedTable={(tid) => ds.isSelectedTable(tid)}
			isSelectedRow={(loc) => ds.isSelectedRow(loc)}
			onTableSelect={(tid, e) => ds.clickTable(tid, e)}
			onRowSelect={(loc, e) => ds.clickRow(loc, e)}
			onTableDelete={(tid) => delTable(ds, { select: tid })}
			onRowDelete={(loc) => delRow(ds, { select: loc })}
		/>
	{/each}
</section>

<style>
	section {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border-bottom-width: 1px;
	}

	div-checkbox {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1rem;
		border-right-width: 1px;
		width: 18rem;
	}

	button {
		border-width: 1px;
		padding: 0.5rem 1rem;

		&:hover {
			background-color: lightskyblue;
			cursor: pointer;
		}
	}
</style>
