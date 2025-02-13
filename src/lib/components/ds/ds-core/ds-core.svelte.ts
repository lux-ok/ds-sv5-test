import { Ds } from '../../../ds2';
import { DsState } from './ds-state.svelte';
import { DsInsert } from './ds-insert';
import { DsFetch } from './ds-fetch';
import { DsUpdate } from './ds-update';
import { DsDelete } from './ds-delete';
import { State, type DsCoreConf } from './type';
import type { DsLog } from './type';

export class DsCore<T> {
	constructor(conf: DsCoreConf<T>) {
		this.#dsState = new DsState({ callback: { stateChanged: conf.callback?.stateChanged } });
		this.#ds = conf.dataset;
		this.#log = conf.callback?.log;

		// - CRUD plugin
		const ds = conf.dataset;
		const dsState = this.#dsState;
		if (conf.callback) {
			const { dbInsert, dbFetch, dbUpdate, dbDelete, log } = conf.callback;
			if (dbInsert) this.#insert = new DsInsert({ ds, dsState, callback: { dbInsert, log } });
			if (dbFetch) this.#fetch = new DsFetch({ ds, dsState, callback: { dbFetch, log } });
			if (dbUpdate) this.#update = new DsUpdate({ ds, dsState, callback: { dbUpdate, log } });
			if (dbDelete) this.#delete = new DsDelete({ ds, dsState, callback: { dbDelete, log } });
		}
	}

	#disabled: boolean = $state(false);
	set disabled(d: boolean) {
		this.#disabled = d;
	}
	get disabled() {
		return this.#disabled;
	}

	/* ~ ds dataset */
	#ds: Ds<T>;
	get ds() {
		return this.#ds;
	}

	selectTable(t: number) {
		// if (!this.disabled) this.#ds.indexT = t;
		if (!this.disabled) this.#ds.setIndexT(t);
	}

	selectRow(i: number) {
		if (!this.disabled) this.#ds.setIndexR(i);
	}
	// check: concern need change dataset?

	/* ~ dsState */
	#dsState: DsState;

	get state() {
		return this.#dsState;
	}
	get busy() {
		return !this.#dsState.isBrowse;
	}

	/* ~ CRUD callback func  */
	#insert?: DsInsert<T>;
	#fetch?: DsFetch<T>;
	#update?: DsUpdate<T>;
	#delete?: DsDelete<T>;

	get insertDisabled() {
		return this.disabled || this.#insert === undefined;
	}
	get fetchDisabled() {
		return this.disabled || this.#fetch === undefined;
	}
	get updateDisabled() {
		return this.disabled || this.#update === undefined;
	}
	get deleteDisabled() {
		return this.disabled || this.#delete === undefined;
	}

	/* ~ Start = UI change mode to data editing or condition fetchng */
	#startSwitch: {
		[key in State]?: (params: { dbParams: T; submitted?: boolean; changeIndex?: boolean }) => void;
	} = {
		[State.InsertStart]: (p) => this.#insert?.start(p),
		[State.FetchStart]: (p) => this.#fetch?.start(p),
		[State.FetchNewStart]: (p) => this.#fetch?.start(p, { fetchToNew: true }),
		[State.UpdateStart]: (p) => this.#update?.start(p),
		[State.DeleteStart]: (p) => this.#delete?.start(p)
	};
	start(params: { startState: State; dbParams: T; submitted?: boolean; changeIndex?: boolean }) {
		const { startState, ...restParams } = params;
		if (!this.disabled) this.#startSwitch[startState]?.(restParams);
	}

	/* ~ Submit = [Save / cancel] or  [Submit / cancel] button */
	submit(confirmed?: boolean) {
		if (!this.disabled) this.#submitSwitch[this.#dsState.now]?.(confirmed);
	}
	cancel() {
		if (!this.disabled) this.#dsState.now = State.Browse; // - back to Browse state
	}

	#submitSwitch: { [key in State]?: (confirmed?: boolean) => void } = {
		[State.InsertStart]: (c) => this.#insert?.submit(c),
		[State.FetchStart]: (c) => this.#fetch?.submit(c),
		[State.FetchNewStart]: (c) => this.#fetch?.submit(c),
		[State.UpdateStart]: (c) => this.#update?.submit(c),
		[State.DeleteStart]: (c) => this.#delete?.submit(c)
	};

	/* ~ Confirm = submit confirmation dialog: [Yes / No] or [Confirm / Abort] button */
	// ! Remarks: action() functions are private use, don't change to public
	confirm() {
		if (!this.disabled) this.#actionSwitch[this.#dsState.now]?.();
	}
	abort() {
		if (!this.disabled) this.#dsState.now = this.#dsState.ex;
	}

	#actionSwitch: { [key in State]?: () => void } = {
		[State.InsertSubmit]: () => this.#insert?.action(),
		[State.FetchSubmit]: () => this.#fetch?.action(),
		[State.FetchNewSubmit]: () => this.#fetch?.action(),
		[State.UpdateSubmit]: () => this.#update?.action(),
		[State.DeleteSubmit]: () => this.#delete?.action()
	};

	/* ~ private common func  */
	#log?: DsLog;
	get log() {
		return this.#log;
	}
}
