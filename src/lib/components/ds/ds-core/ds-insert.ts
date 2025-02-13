import type { DsState } from './ds-state.svelte';
import type { DbInsert, DsInsertConf } from './type';
import { State } from './type';
import { Ds } from '../../../ds2';
import { LogType, type DsLog } from './type';

/**
 * + DsCoreInsert
 */
export class DsInsert<T> {
	constructor(conf: DsInsertConf<T>) {
		this.#dsState = conf.dsState;
		this.#ds = conf.ds;
		this.#dbInsert = conf.callback.dbInsert;
		this.#log = conf.callback.log;
	}

	#dsState: DsState;
	#ds: Ds<T>;
	#dbInsert: DbInsert<T>;
	#log?: DsLog;
	#buffer!: T; // - delay init, params definitely write to #buffer when run start()
	#submitted?: boolean;
	#changeIndex?: boolean; // todo

	start(params: { dbParams: T; submitted?: boolean; changeIndex?: boolean }) {
		if (!this.#dsState.isBrowse) return;

		this.#buffer = params.dbParams;
		this.#submitted = params.submitted;
		this.#changeIndex = params.changeIndex;

		if (params.submitted) {
			// - no need submit() & confirm(), direct goto action()
			this.#dsState.now = State.InsertSubmit;
			this.action();
		} else {
			// - wait for submit button
			this.#dsState.now = State.InsertStart;
		}
	}

	submit(confirmed?: boolean) {
		const dsStates = this.#dsState;
		if (!dsStates.isInsertStart) return;

		dsStates.now = State.InsertSubmit;
		if (confirmed) this.action();
	}

	action() {
		if (!this.#dsState.isInsertSubmit) return;

		const dsState = this.#dsState;
		dsState.now = State.InsertAction;

		this.#dbInsert(this.#buffer).then((r) => {
			if (r.errMsg || !r.data) {
				// - error
				dsState.now = this.#submitted ? State.Browse : State.InsertStart;
				this.#log?.({ type: LogType.DbError, text: r.errMsg ?? 'dsAction: No data return' });
			} else {
				// - success
				this.#ds.addRow({ row: r.data, changeIndex: this.#changeIndex });
				dsState.now = State.Browse;
				this.#log?.({ type: LogType.DbSucess, text: r.errMsg ?? 'Data successfully inserted' });
			}
		});
	}
}
