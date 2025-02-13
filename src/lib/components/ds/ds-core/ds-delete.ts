import type { DsState } from './ds-state.svelte';
import type { DbDelete, DsDeleteConf } from './type';
import { State } from './type';
import { Ds } from '../../../ds2';
import { LogType, type DsLog } from './type';

export class DsDelete<T> {
	constructor(conf: DsDeleteConf<T>) {
		this.#dsState = conf.dsState;
		this.#ds = conf.ds;
		this.#dbDelete = conf.callback.dbDelete;
		this.#log = conf.callback.log;
	}

	#dsState: DsState;
	#ds: Ds<T>;
	#dbDelete: DbDelete<T>;
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
			this.#dsState.now = State.DeleteSubmit;
			this.action();
		} else {
			// - wait for submit button
			this.#dsState.now = State.DeleteStart;
		}
	}

	submit(confirmed?: boolean) {
		const dsStates = this.#dsState;
		if (!dsStates.isDeleteStart) return;

		dsStates.now = State.DeleteSubmit;
		if (confirmed) this.action();
	}

	action() {
		// check: allow no selected row
		if (!this.#dsState.isDeleteSubmit) return;

		const dsState = this.#dsState;
		dsState.now = State.DeleteAction;

		this.#dbDelete(this.#buffer).then((r) => {
			if (r.errMsg || !r.data) {
				// - error
				dsState.now = this.#submitted ? State.Browse : State.DeleteStart;
				this.#log?.({
					type: LogType.DbError,
					text: r.errMsg ?? 'DsDelete action(): No data return'
				});
			} else {
				// - success
				const { indexT, indexR } = findTargetIndex<T>(this.#ds.tables, this.#buffer);
				if (indexT !== null && indexR !== null)
					this.#ds.delRow({ indexT, indexR, changeIndex: this.#changeIndex });
				dsState.now = State.Browse;
				this.#log?.({ type: LogType.DbSucess, text: r.errMsg ?? 'Row successfully deleted' });
			}
		});
	}
}

function findTargetIndex<T>(
	tables: T[][],
	target: T
): { indexT: number | null; indexR: number | null } {
	for (let indexT = 0; indexT < tables.length; indexT++) {
		const indexR = tables[indexT].indexOf(target);
		if (indexR !== -1) {
			return { indexT, indexR };
		}
	}
	return { indexT: null, indexR: null };
}
