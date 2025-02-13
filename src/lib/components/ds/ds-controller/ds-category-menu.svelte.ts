import { State, type DsCore } from '../ds-core';

export type FetchParamsExp<T> = {
	[K in keyof T]?: () => T[K];
};

export class dsCategoryMenu<T> {
	constructor(conf: { dsCore: DsCore<T>; fetchParamsExps: FetchParamsExp<T>[] }) {
		this.#dsCore = conf.dsCore;
		this.#fetchParamsExps = conf.fetchParamsExps;
		this.#tableMax = conf.fetchParamsExps.length;
	}

	#fetchParamsExps: FetchParamsExp<T>[];

	#fetchParamGen(index: number): T | undefined {
		const exp = this.#fetchParamsExps[index];

		// - 若索引無對應運算式，返回 undefined
		if (!exp) return undefined;

		const result = {} as Partial<T>;
		for (const key in exp) {
			const expK = exp[key];
			if (expK) {
				result[key] = expK();
			}
		}

		return result as T;
	}

	#dsCore: DsCore<T>;
	#tableMax: number;

	get dsCore() {
		return this.#dsCore;
	}

	nextTable() {
		// todo: 麵包碎, disabled, isBusy
		const tablesCnt = this.#dsCore.ds.tablesCnt;
		if (tablesCnt >= this.#tableMax) return;

		const dbParams = this.#fetchParamGen(tablesCnt);
		const startState = State.FetchNewStart;

		if (dbParams) this.#dsCore.start({ startState, dbParams, changeIndex: true, submitted: true });
	}

	prevTable() {
		// todo: disabled, isBusy

		if (this.#dsCore.ds.tablesCnt <= 0) return;
		this.#dsCore.ds.popTable({ changeIndex: true });
		// this.#dsCore.ds.delTable({ indexT: 0, changeIndex: false });
	}
	jumpPrevTable() {}

	reload() {
		// todo: disabled, isBusy

		const indexT = this.#dsCore.ds.indexT;
		if (indexT === null || indexT < 0 || indexT >= this.#tableMax) return;
		const dbParams = this.#fetchParamGen(indexT);

		if (dbParams) this.#dsCore.start({ startState: State.FetchStart, dbParams, submitted: true });
	}
}
