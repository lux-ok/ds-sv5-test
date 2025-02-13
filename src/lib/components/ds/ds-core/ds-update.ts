import type { DsState } from './ds-state.svelte';
import type { DbUpdate, DsUpdateConf } from './type';
import { State } from './type';
import { Ds } from '../../../ds2';
import { LogType, type DsLog } from './type';

/**
 * + DsCoreUpdate
 */
export class DsUpdate<T> {
	constructor(conf: DsUpdateConf<T>) {
		this.#dsState = conf.dsState;
		this.#ds = conf.ds;
		this.#dbUpdate = conf.callback.dbUpdate;
		this.#log = conf.callback.log;
	}

	#dsState: DsState;
	#ds: Ds<T>;
	#dbUpdate: DbUpdate<T>;
	#log?: DsLog;
	#buffer!: T; // - delay init, params definitely write to #buffer when run start()
	#submitted?: boolean;
	#changeIndex?: boolean; // todo

	start(params: { dbParams: T; submitted?: boolean; changeIndex?: boolean }) {
		// ! allow no selected row
		if (!this.#dsState.isBrowse) return;

		this.#buffer = params.dbParams;
		this.#submitted = params.submitted;
		this.#changeIndex = params.changeIndex;

		if (params.submitted) {
			// - no need submit() & confirm(), direct goto action()
			this.#dsState.now = State.UpdateSubmit;
			this.action();
		} else {
			// - wait for submit button
			this.#dsState.now = State.UpdateStart;
		}
	}

	submit(confirmed?: boolean) {
		const dsStates = this.#dsState;
		if (!dsStates.isUpdateStart) return;

		dsStates.now = State.UpdateSubmit;
		if (confirmed) this.action();
	}

	action() {
		// check: allow no selected row
		if (!this.#dsState.isUpdateSubmit) return;

		const dsState = this.#dsState;
		dsState.now = State.UpdateAction;

		this.#dbUpdate(this.#buffer).then((r) => {
			if (r.errMsg || !r.data) {
				// - error
				dsState.now = this.#submitted ? State.Browse : State.UpdateStart;
				this.#log?.({
					type: LogType.DbError,
					text: r.errMsg ?? 'Ds Update action(): No data return'
				});
			} else {
				// - success
				this.#ds.setRow({ row: r.data, changeIndex: this.#changeIndex });
				dsState.now = State.Browse;
				this.#log?.({ type: LogType.DbSucess, text: r.errMsg ?? 'Row successfully updated' });
			}
		});
	}
}
