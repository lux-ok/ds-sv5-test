<script lang="ts">
	// import { Ds } from '@lux721/ds';
	// import type { DsCore, Loc } from '@lux721/ds';
	import { Dsm } from '../../../../ds/src';
	import type { DsCore, Loc } from '../../../../ds/src';

	import * as d from './test-data/object';

	const core: DsCore<d.MyType> = $state({
		tables: [],
		tablesSel: [],
		rowsSel: [],
		mode: undefined,
		state: undefined
	});

	/** ! Don't do like this, no reactive ! */
	class c<T> {
		tables: T[][] = $state([]);
		tablesSel: number[] = $state([]);
		rowsSel: Loc[] = $state([]);
		state: number = $state(0);
		stateEx: number = $state(0);
	}

	const core2 = new c<d.MyType>();
	/** ! Don't do like this, no reactive ! */

	const ds = new Dsm({ core, useClone: true });

	// - common vars
	let changeSel = $state(false);
	let sort = $state(false);
	let sourceTable: d.MyType[] = $state([]);
	let sourceRow: d.MyType[] = $state([]);

	// - newTables
	let newTablesSelect: 'tables' | '' = $state('');
	let newTablesWhich: 'top' | 'all' | 'bottom' | '' = $state('bottom');
	let newTablesPlace: 'newTableAbove' | 'newTableBelow' | '' = $state('newTableBelow');
	function newTablesClick() {
		ds.newTables(d.tables, {
			select: newTableSelect !== '' ? `${newTableSelect}` : undefined,
			which: newTableWhich !== '' ? `${newTableWhich}` : undefined,
			place: newTablePlace !== '' ? `${newTablePlace}` : undefined,
			changeSel
		});
	}

	// - newTable
	let newTableSelect: 'tables' | '' = $state('');
	let newTableWhich: 'top' | 'all' | 'bottom' | '' = $state('bottom');
	let newTablePlace: 'newTableAbove' | 'newTableBelow' | '' = $state('newTableBelow');
	function newTableClick() {
		ds.newTable(sourceTable, {
			select: newTableSelect !== '' ? `${newTableSelect}` : undefined,
			which: newTableWhich !== '' ? `${newTableWhich}` : undefined,
			place: newTablePlace !== '' ? `${newTablePlace}` : undefined,
			changeSel
		});
	}

	// - newRows
	let newRowsSelect: 'tables' | 'rows' | '' = $state('rows');
	let newRowsWhich: 'top' | 'all' | 'bottom' | '' = $state('all');
	let newRowsPlace: 'above' | 'replace' | 'below' | '' = $state('below');
	function newRowsClick() {
		ds.newRows(sourceRow, {
			select: newRowsSelect !== '' ? `${newRowsSelect}` : undefined,
			which: newRowsWhich !== '' ? `${newRowsWhich}` : undefined,
			place: newRowsPlace !== '' ? `${newRowsPlace}` : undefined,
			changeSel
		});
	}

	// - delRows
	let delRowsSelect: 'tables' | 'rows' | '' = $state('rows');
	let delRowsWhich: 'top' | 'all' | 'bottom' | '' = $state('all');
	let delRowsPlace: 'above' | 'below' | '' = $state('below');
	function delRowsClick() {
		ds.delRows({
			select: delRowsSelect !== '' ? `${delRowsSelect}` : undefined,
			which: delRowsWhich !== '' ? `${delRowsWhich}` : undefined,
			place: delRowsPlace !== '' ? `${delRowsPlace}` : undefined,
			changeSel
		});
	}

	// - delTables
	let delTablesWhich: 'top' | 'all' | 'bottom' | '' = $state('all');

	function delTablesClick() {
		ds.delTables({
			which: delTablesWhich !== '' ? `${delTablesWhich}` : undefined,
			changeSel
		});
	}

	// - delTable
	let delTableSelect: 'shift' | 'pop' | '' = $state('');
	function delTableClick() {
		ds.delTable({
			select: delTableSelect !== '' ? `${delTableSelect}` : undefined
		});
	}

	// onMount(() => ds.newTables(d.tables, { select: [0], place: 'newTableAbove', changeSel }));
</script>

<svelte:window onkeydown={(e) => e.code === 'Escape' && e.ctrlKey && ds.deselectAll()} />

<div class="flex flex-row items-baseline gap-4 p-4">
	<div class="flex w-72 flex-row items-center gap-4 border-r">
		<label for="changeSel">changeSel</label>
		<input type="checkbox" id="changeSel" bind:checked={changeSel} />
		<label for="sort">sort selected</label>
		<input type="checkbox" id="sort" bind:checked={sort} />
	</div>

	<div class="flex flex-1 flex-row flex-wrap gap-4">
		tableSelLoc:
		{#each ds.tablesSel as r, i}
			<p>[{r}]</p>
		{/each}
	</div>

	<div class="flex flex-1 flex-row flex-wrap gap-4">
		rowSelLoc:
		{#each ds.rowsSel as r, i}
			<p>[{r.t},{r.r}]</p>
		{/each}
	</div>
</div>

<hr />

<!-- check start -->
<cmd-div>
	<button class="w-36" onclick={() => newTablesClick()}> newTables()</button>

	<p>select:</p>
	<select name="newTablesSelect" id="newTablesSelect" bind:value={newTablesSelect}>
		<option value="">undefined</option>
		<option value="tables">tables</option>
	</select>

	<p>which:</p>
	<select name="newTablesWhich" id="newTablesWhich" bind:value={newTablesWhich}>
		<option value="">undefined</option>
		<option value="top">top</option>
		<option value="all">all</option>
		<option value="bottom">bottom</option>
	</select>

	<p>place:</p>
	<select name="newTablesPlace" id="newTablesPlace" bind:value={newTablesPlace}>
		<option value="">undefined</option>
		<option value="newTableAbove">newTableAbove</option>
		<option value="newTableBelow">newTableBelow</option>
	</select>
</cmd-div>

<cmd-div>
	<button class="w-36" onclick={() => newTableClick()}> newTable()</button>

	<p>source:</p>
	<select name="sourceTable" id="sourceTable" bind:value={sourceTable} class="w-24">
		<option value={d.table0}>table0</option>
		<option value={d.table1}>table1</option>
		<option value={d.table2}>table2</option>
		<option value={d.table3}>table3</option>
		<option value={d.table4}>table4</option>
		<option value={d.table5}>table5</option>
	</select>

	<p>select:</p>
	<select name="newTableSelect" id="newTableSelect" bind:value={newTableSelect}>
		<option value="">undefined</option>
		<option value="tables">tables</option>
	</select>

	<p>which:</p>
	<select name="newTableWhich" id="newTableWhich" bind:value={newTableWhich}>
		<option value="">undefined</option>
		<option value="top">top</option>
		<option value="all">all</option>
		<option value="bottom">bottom</option>
	</select>

	<p>place:</p>
	<select name="newTablePlace" id="newTablePlace" bind:value={newTablePlace}>
		<option value="">undefined</option>
		<option value="newTableAbove">newTableAbove</option>
		<option value="newTableBelow">newTableBelow</option>
	</select>
</cmd-div>

<cmd-div>
	<button class="w-36" onclick={() => newRowsClick()}>newRows()</button>

	<p>source:</p>
	<select name="sourceRow" id="sourceRow" bind:value={sourceRow} class="w-24">
		<option value={[d.row0]}>row0</option>
		<option value={[d.row1]}>row1</option>
		<option value={[d.row2]}>row2</option>
		<option value={[d.row3]}>row3</option>
		<option value={[d.row4]}>row4</option>
		<option value={[d.row10]}>row10</option>
		<option value={[d.row11]}>row11</option>
		<option value={[d.row12]}>row12</option>
		<option value={[d.row13]}>row13</option>
		<option value={[d.row14]}>row14</option>
		<option value={[d.row20]}>row20</option>
		<option value={[d.row21]}>row21</option>
		<option value={[d.row22]}>row22</option>
		<option value={[d.row23]}>row23</option>
		<option value={[d.row24]}>row24</option>
		<option value={[d.row30]}>row30</option>
		<option value={[d.row31]}>row31</option>
		<option value={[d.row32]}>row32</option>
		<option value={[d.row33]}>row33</option>
		<option value={[d.row34]}>row34</option>
		<option value={[d.row40]}>row40</option>
		<option value={[d.row41]}>row41</option>
		<option value={[d.row42]}>row42</option>
		<option value={[d.row43]}>row43</option>
		<option value={[d.row44]}>row44</option>
		<option value={[d.row50]}>row50</option>
		<option value={[d.row51]}>row51</option>
		<option value={[d.row52]}>row52</option>
		<option value={[d.row53]}>row53</option>
		<option value={[d.row54]}>row54</option>
	</select>

	<p>select:</p>
	<select name="newRowsSelect" id="newRowsSelect" bind:value={newRowsSelect}>
		<option value="">undefined</option>
		<option value="tables">tables</option>
		<option value="rows">rows</option>
	</select>

	<p>which:</p>
	<select name="newRowsWhich" id="newRowsWhich" bind:value={newRowsWhich}>
		<option value="">undefined</option>
		<option value="top">top</option>
		<option value="all">all</option>
		<option value="bottom">bottom</option>
	</select>

	<p>place:</p>
	<select name="newRowsPlace" id="newRowsPlace" bind:value={newRowsPlace}>
		<option value="">undefined</option>
		<option value="above">above</option>
		<option value="replace">replace</option>
		<option value="below">below</option>
	</select>
</cmd-div>

<cmd-div>
	<button class="w-36" onclick={() => delRowsClick()}>delRows()</button>

	<p>select:</p>
	<select name="delRowsSelect" id="delRowsSelect" bind:value={delRowsSelect}>
		<option value="">undefined</option>
		<option value="tables">tables</option>
		<option value="rows">rows</option>
	</select>

	<p>which:</p>
	<select name="delRowsWhich" id="delRowsWhich" bind:value={delRowsWhich}>
		<option value="">undefined</option>
		<option value="top">top</option>
		<option value="all">all</option>
		<option value="bottom">bottom</option>
	</select>

	<p>place:</p>
	<select
		name="delRowsPlace"
		id="delRowsPlace"
		bind:value={delRowsPlace}
		disabled={delRowsSelect === 'rows' || delRowsSelect === ''}
	>
		<option value="">undefined</option>
		<option value="above">above</option>
		<option value="below">below</option>
	</select>
</cmd-div>

<cmd-div>
	<button class="w-36" onclick={() => delTablesClick()}>delTables()</button>

	<p>which:</p>
	<select name="delTablesWhich" id="delTablesWhich" bind:value={delTablesWhich}>
		<option value="">undefined</option>
		<option value="top">top</option>
		<option value="all">all</option>
		<option value="bottom">bottom</option>
	</select>
</cmd-div>

<cmd-div>
	<!-- <h3>delTable</h3> -->
	<button class="w-36" onclick={() => delTableClick()}>delTable()</button>

	<p>select</p>
	<select name="delTableSelect" id="delTableSelect" bind:value={delTableSelect}>
		<option value="">undefined</option>
		<option value="shift">shift</option>
		<option value="pop">pop</option>
	</select>
</cmd-div>

<!-- check end -->

<btn-div>
	<button
		onclick={() =>
			ds.newRows([d.row54], { select: [{ t: 0, r: ds.tables[0].length - 1 }], place: 'below' })}
		>test</button
	>
	<button
		onclick={() => {
			ds.newTable(d.table1);
			ds.newTable(d.table2);
			ds.newTable(d.table3);
			ds.newTable(d.table4);
			ds.newTable(d.table5);
		}}>Gen tables</button
	>

	<button onclick={() => ds.newTables(d.tables, { select: [0], place: 'newTableAbove', changeSel })}
		>newTables above</button
	>
	<button
		onclick={() =>
			ds.newTables(d.tables, { select: [ds.tablesCnt - 1], place: 'newTableBelow', changeSel })}
		>newTables below</button
	>

	<button
		onclick={() =>
			ds.newTable([], { select: [ds.tablesCnt - 1], place: 'newTableBelow', changeSel })}
		>new empty table below</button
	>
</btn-div>

<hr />

<div class="flex w-full flex-row flex-wrap gap-2 p-4 text-sm">
	{#each core.tables as t, idxT}
		<div class="flex h-fit w-72 flex-col border" class:border-yellow-500={ds.isSelectedTableRef(t)}>
			<div class="flex flex-row">
				<button
					class="flex-1 border-r px-4 py-2"
					onclick={(e) => ds.clickTable(idxT, e, sort ? 'forward' : undefined)}
					>Select Table {idxT}</button
				>
				<button class="px-4 py-2" onclick={() => ds.delTable({ select: idxT })}>Del</button>
			</div>
			<div class="w-full">
				{#each t as r, idxR}
					<div class="flex flex-row border-t" class:bg-yellow-50={ds.isSelectedRowRef(r)}>
						<button
							class="flex flex-1 flex-row gap-2 border-r px-4 py-2"
							onclick={(e) => ds.clickRow({ t: idxT, r: idxR }, e, sort ? 'forward' : undefined)}
						>
							<p>id: {r.id}</p>
							<p>{r.rem}</p>
							<p>{r.meta?.title}</p>
						</button>
						<button class="px-4 py-2" onclick={() => ds.delRow({ select: { t: idxT, r: idxR } })}
							>Del</button
						>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>

{#if ds.tableSelRef}
	{#each ds.tableSelRef as r, idxR}
		<div class="flex flex-row gap-2">
			<button
				class="flex w-full flex-row gap-4 border-b px-4 py-2"
				class:bg-yellow-50={ds.isSelectedRowRef(r)}
				onclick={(e) => ds.clickRow(r, e, sort ? 'forward' : undefined)}
			>
				<p>id: {r.id}</p>
				<p>rem: {r.rem}</p>
			</button>
		</div>
	{/each}
{/if}

{#if ds.rowSelRef}
	<div class="flex flex-col gap-2 p-4">
		{ds.rowSelRef.id}
		{ds.rowSelRef.rem}
		<input id="rowId" type="text" bind:value={ds.rowSelRef.id} />
		<input id="rowRem" type="text" bind:value={ds.rowSelRef.rem} />
		{#if ds.rowSelRef.meta}
			<input id="rowMetaTitle" type="text" bind:value={ds.rowSelRef.meta.title} />
		{/if}
	</div>
{/if}

<style lang="postcss">
	cmd-div {
		@apply flex flex-row items-center gap-4 px-4 py-2;
		button {
			@apply w-36 rounded-md border px-2 py-1;
		}
		p {
			@apply w-20 text-right;
		}
		select {
			@apply w-40 border px-2 py-1;
		}
	}
	btn-div {
		@apply flex flex-row items-center gap-4 px-4 py-2;
		button {
			@apply rounded-md border px-2 py-1;
		}
	}

	input {
		@apply border px-4 py-2;
	}
</style>
