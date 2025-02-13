<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { Btn } from '$lib/components/ui/btn';
	import { DsCore } from '../ds-core/ds-core.svelte';

	import Tgl from '$lib/components/ui/btn/tgl.svelte';

	import { DsFilter } from '../ds-filter';
	import { State, StateMap } from '../ds-core';
	import { dsCategoryMenu, type FetchParamsExp } from '../ds-controller';

	type Props = {
		core: DsCore<InfoParams>;
		children?: Snippet;
	};
	let { core, children }: Props = $props();

	let lang = $state(0);
	let id_o = $state(1);

	const newMeta = (id_o: number): InfoParams => ({ id_o, lang: -1, rem: 'REM#' + id_o.toString() });

	let params: InfoParams = $state({});

	// - filter
	let targetRem = $state('');
	let targetLang = $state(1);
	let checkRem = $state(false);
	let checkLang = $state(false);
	let filterEnabled = $state(false);
	const filter = new DsFilter<InfoParams>(
		{
			rem: (value) =>
				typeof value === 'string' && value.toLocaleLowerCase().includes(targetRem.toLowerCase()),
			lang: (value) => typeof value === 'number' && value === targetLang
		},
		{
			rem: () => checkRem,
			lang: () => checkLang
		}
	);

	const fetchParamsExps: FetchParamsExp<InfoParams>[] = [
		{ id_o: () => 1 },
		{ id_o: () => 2 },
		{ id_o: () => 3 }
	];

	const menu = new dsCategoryMenu<InfoParams>({ dsCore: core, fetchParamsExps });

	// onMount(() => menu.init());

	$effect(() => {
		if (core.ds.indexR !== null) {
			params = JSON.parse(JSON.stringify(core.ds.row));
		} else {
			params = {};
		}
	});
</script>

<div class="flex flex-col gap-2 p-4">
	<div class="flex flex-row items-center gap-4">
		<p class="text-neutral-500">stateEx: <span>{StateMap.get(core.state.ex)}</span></p>
		<p class="text-green-800">stateNow: <span>{StateMap.get(core.state.now)}</span></p>
		<p class="text-blue-500">stateStart: <span>{core.state.isStart}</span></p>
		<p class="text-blue-500">stateSubmit: <span>{core.state.isSubmit}</span></p>
		<p class="text-blue-500">stateAction: <span>{core.state.isAction}</span></p>
		<!-- params:
		<p>id: <span>{core.params?.id}</span></p>
		<p>id_o: <span>{core.params?.id_o}</span></p>
		<p>lang: <span>{core.params?.lang}</span></p>
		<p>rem: <span>{core.params?.rem}</span></p> -->
	</div>
	<div class="flex flex-row items-center gap-4">
		<!-- <p class="text-neutral-500">iEx: <span>{core.iEx}</span></p> -->
		<p>tablesCnt: <span>{core.ds.tablesCnt}</span></p>
		<p>rowsCnt: <span>{core.ds.rowsCnt ?? '-'}</span></p>
		<p class="text-green-800">indexT: <span>{core.ds.indexT ?? '-'}</span></p>
		<p class="text-green-800">indexR: <span>{core.ds.indexR ?? '-'}</span></p>
	</div>

	<div class="flex flex-row items-center gap-4">
		<input type="text" name="keyword" id="keyword" bind:value={targetRem} />
		<input type="number" name="sort" id="sort" bind:value={targetLang} />
		<Tgl variant="outline" bind:pressed={checkRem}>REM</Tgl>
		<Tgl variant="outline" bind:pressed={checkLang}>LANG</Tgl>
		<Tgl variant="outline" bind:pressed={filterEnabled}>EN</Tgl>
		<Btn onclick={() => menu.prevTable()}>Prev</Btn>
		<Btn onclick={() => menu.nextTable()}>Next</Btn>
	</div>

	<div class="flex flex-row items-center gap-4 border p-4">
		id_o:<input id="id_o" type="number" bind:value={id_o} class="w-24" />
		lang:<input id="lang" type="number" bind:value={lang} class="w-24" />
		<Btn onclick={() => (core.disabled = !core.disabled)}>
			<span class:text-red-500={core.disabled}>Disable</span>
		</Btn>

		<Btn
			onclick={() => core.start({ startState: State.InsertStart, dbParams: newMeta(id_o) })}
			disabled={core.insertDisabled}>Insert</Btn
		>
		<Btn onclick={() => menu.reload()}>Reload</Btn>
		<Btn
			onclick={() => core.start({ startState: State.UpdateStart, dbParams: params })}
			disabled={core.updateDisabled}>Update</Btn
		>
		<Btn
			onclick={() => core.start({ startState: State.DeleteStart, dbParams: params })}
			disabled={core.deleteDisabled}>Delete</Btn
		>

		{#if core.state.isStart}
			<div class="flex flex-row items-center gap-4 border px-4 py-2">
				{#if core.state.isInsertStart}
					<Btn onclick={() => core.submit()}>Submit Insert</Btn>
				{:else if core.state.isFetchStart}
					<Btn onclick={() => core.submit()}>Submit Fetch</Btn>
				{:else if core.state.isFetchNewStart}
					<Btn onclick={() => core.submit()}>Submit Fetch to New</Btn>
				{:else if core.state.isUpdateStart}
					<Btn onclick={() => core.submit()}>Submit Update</Btn>
				{:else if core.state.isDeleteStart}
					<Btn onclick={() => core.submit()}>Submit Delete</Btn>
				{/if}
				<Btn onclick={() => core.cancel()}>Cancel</Btn>
			</div>
		{/if}

		<!-- - CONFIRMATION BOX - -->
		{#if core.state.isSubmit}
			<div class="flex flex-row items-center gap-4 border bg-yellow-100 px-4 py-2">
				Confirm?
				<Btn onclick={() => core.confirm()}>YES</Btn>
				<Btn onclick={() => core.abort()}>NO</Btn>
			</div>
		{/if}
	</div>

	<div class="flex flex-col">
		{#each core.ds.rows ?? [] as r, i}
			<button
				class=" flex flex-row items-center gap-4 border-b border-l-8 px-4 py-2 hover:border-l-blue-300"
				onclick={() => {
					core.selectRow(i);
				}}
				class:border-l-blue-500={core.ds.row === r}
				class:hover:border-l-blue-600={core.ds.row === r}
				style:order={r.id_o}
				class:bg-yellow-50={core.state.isUpdateStart && core.ds.row === r}
				class:hidden={filterEnabled ? !filter.match(r) : false}
			>
				[ {i} ]
				<p>match: <span>{filterEnabled ? filter.match(r) : true}</span></p>
				<p>id: <span>{r.id}</span></p>
				<p>id_o: <span>{r.id_o}</span></p>
				<p>lang: <span>{r.lang}</span></p>
				<p>rem: <span>{r.rem}</span></p>
				<p>desc: <span>{r.desc}</span></p>
			</button>
		{:else}
			<p>No data</p>
		{/each}
	</div>

	{#if core.ds.indexR !== null}
		<div class="flex flex-col gap-2">
			<label for="lang-edit"
				>lang: <input
					id="lang-edit"
					type="number"
					bind:value={params.lang}
					class="border px-2 py-1"
					disabled={!core.state.isUpdateStart}
				/>
			</label>
		</div>
		<div class="flex flex-col gap-2">
			<label for="rem-edit"
				>rem: <input
					id="rem-edit"
					type="text"
					bind:value={params.rem}
					class="border px-2 py-1"
					disabled={!core.state.isUpdateStart}
				/>
			</label>
		</div>
		<div class="flex flex-col gap-2">
			<label for="desc-edit"
				>desc: <input
					id="desc-edit"
					type="text"
					bind:value={params.desc}
					class="border px-2 py-1"
					disabled={!core.state.isUpdateStart}
				/>
			</label>
		</div>
		<div class="flex flex-col gap-2">
			<label for="sort-edit"
				>sort: <input
					id="sort-edit"
					type="number"
					bind:value={params.sort}
					class="border px-2 py-1"
					disabled={!core.state.isUpdateStart}
				/>
			</label>
		</div>
	{/if}
</div>

<style lang="postcss">
	p {
		@apply text-xs font-light;
		span {
			@apply text-sm font-normal;
		}
	}
	input {
		@apply border px-2 py-1;
	}
</style>
