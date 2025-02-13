import type { DsState } from './ds-state.svelte';
import type { DbFetch, DsFetchConf } from './type';
import { State } from './type';
import { Ds } from '../../../ds2';
import { LogType, type DsLog } from './type';

/**
 * + DsCoreFetch
 */
export class DsFetch<T> {
	constructor(conf: DsFetchConf<T>) {
		this.#dsState = conf.dsState;
		this.#ds = conf.ds;
		this.#dbFetch = conf.callback.dbFetch;
		this.#log = conf.callback.log;
	}

	#dsState: DsState;
	#ds: Ds<T>;
	#dbFetch: DbFetch<T>;
	#log?: DsLog;
	#buffer!: T; // - delay init, params definitely write to #buffer when run start()
	#submitted?: boolean;
	#changeIndex?: boolean;

	start(
		params: { dbParams: T; submitted?: boolean; changeIndex?: boolean },
		options?: { fetchToNew?: boolean }
	) {
		if (!this.#dsState.isBrowse) return;

		this.#buffer = params.dbParams;
		this.#submitted = params.submitted;
		this.#changeIndex = params.changeIndex;

		options?.fetchToNew ? this.#startFetchNew() : this.#startFetch();
	}

	submit(confirmed?: boolean) {
		const dsState = this.#dsState;
		if (dsState.isFetchStart) {
			dsState.now = State.FetchSubmit;
			if (confirmed) this.#actionFetch();
		} else if (dsState.isFetchNewStart) {
			dsState.now = State.FetchNewSubmit;
			if (confirmed) this.#actionFetchNew();
		}
	}

	action() {
		const dsState = this.#dsState;
		if (dsState.isFetchSubmit) {
			this.#actionFetch();
		} else if (dsState.isFetchNewSubmit) {
			this.#actionFetchNew();
		}
	}

	/* ~ private func */
	#startFetch() {
		if (this.#submitted) {
			// - no need submit() & confirm(), direct goto action()
			this.#dsState.now = State.FetchSubmit;
			this.#actionFetch();
		} else {
			// - wait for submit button
			this.#dsState.now = State.FetchStart;
		}
	}

	#startFetchNew() {
		if (this.#submitted === true) {
			// - no need submit() & confirm(), direct goto action()
			this.#dsState.now = State.FetchNewSubmit;
			this.#actionFetchNew();
		} else {
			// - wait for submit button
			this.#dsState.now = State.FetchNewStart;
		}
	}

	#actionFetch() {
		const dsState = this.#dsState;
		dsState.now = State.FetchAction;

		this.#dbFetch(this.#buffer).then((r) => {
			if (r.errMsg) {
				// - error
				dsState.now = this.#submitted ? State.Browse : State.FetchStart;
				this.#log?.({ type: LogType.DbError, text: r.errMsg });
			} else {
				// - success
				this.#ds.setTable({ rows: r.data, changeIndex: this.#changeIndex });
				dsState.now = State.Browse;
			}
		});
	}

	#actionFetchNew() {
		const dsState = this.#dsState;
		dsState.now = State.FetchNewAction;

		this.#dbFetch(this.#buffer).then((r) => {
			// const { data: rows, errMsg } = r;
			if (r.errMsg) {
				// - error
				dsState.now = this.#submitted ? State.Browse : State.FetchNewStart;
				this.#log?.({ type: LogType.DbError, text: r.errMsg });
			} else {
				// - success
				this.#ds.addTable({ rows: r.data, changeIndex: this.#changeIndex });
				dsState.now = State.Browse;
			}
		});
	}
}
