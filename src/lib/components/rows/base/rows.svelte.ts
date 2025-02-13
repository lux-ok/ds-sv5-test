import type { DataInterface, DataSetCallback, DatasetConf, DatasetInterface, Log } from './type';
import { iNull, LogType, LogTypeMap, State, StateMap } from './type';

export const log: Log = (params) =>
	console.log(`${LogTypeMap.get(params.type ?? -1)}: ${params.text}`);
const stateCommand = new Set([State.Insert, State.Fetch, State.Update, State.Delete]);
const stateSubmit = new Set([
	State.SubmitInsert,
	State.SubmitFetch,
	State.SubmitUpdate,
	State.SubmitDelete
]);
const stateProcess = new Set([State.Inserting, State.Fetching, State.Updating, State.Deleting]);

export class Dataset<T extends DataInterface> implements DatasetInterface<T> {
	rows: T[] = $state([]);
	i: number = $state(iNull);
	iEx: number = iNull;
	// ~ row: pointer of rows base on i
	get row(): T {
		return this.rows[this.i];
	}
}

/**
 * - DatasetCore
 */
export class DatasetCore<T extends DataInterface> {
	constructor(conf: DatasetConf<T>) {
		this._ds = conf.dataset;
		this._cb = conf.callback;
		this._debug = conf.debug; // todo: for future use
	}

	disable = $state(false);

	private _debug? = false;
	get debug() {
		return this._debug;
	}

	protected _ds: DatasetInterface<T>;
	protected _cb?: DataSetCallback<T>;

	// ~ CRUD command params
	protected _params?: T = $state(); // - buffer of CRUD command params input
	protected _needSubmit?: boolean; // - Back to correct state when db action not success

	// ~ rows
	get rows() {
		return this._ds.rows;
	}
	get rowsCnt() {
		return this._ds.rows.length;
	}
	get params() {
		return this._params;
	}
	// ~ row: pointer of rows base on i
	get row(): T {
		return this._ds.row;
	}

	private _selectedRow: T | null = $state(null);
	get selectedRow() {
		return this._selectedRow;
	}

	// ~ i: rows index
	set i(i: number) {
		if (this._state !== State.Browse) {
			this._msgFuncNotAllow('Index selection');
			return;
		}
		if (i < iNull || i >= this._ds.rows.length) {
			this._cb?.log?.({ type: LogType.Reject, text: 'Invalid index number' });
			return;
		}
		this._ds.iEx = this._ds.i;
		this._ds.i = i === this._ds.i ? iNull : i;
		this._cb?.indexChanged?.({ ex: this._ds.iEx, new: this._ds.i });
		// check: set _selectedRow
		this._selectedRow = this._ds.i > iNull ? this.rows[this._ds.i] : null;
		this._cb?.selectedRowChanged?.(this._selectedRow);
	}
	get i() {
		return this._ds.i;
	}
	get iEx() {
		return this._ds.iEx;
	}

	// ~ state: UI FSM:
	// - Browse <-> Fetch <-> SubmitFetch <-> Fetching --> Browse
	private _state: State = $state(State.Browse);
	protected _stateEx: State = $state(State.Browse);

	get state() {
		return this._state;
	}
	get lock() {
		return this._state !== State.Browse;
	}
	get stateBrowse() {
		return this._state !== State.Browse;
	}
	get stateCommand() {
		return stateCommand.has(this._state);
	}
	get stateSubmit() {
		return stateSubmit.has(this._state);
	}
	get stateProcess() {
		return stateProcess.has(this._state);
	}
	get stateEx() {
		return this._stateEx;
	}
	protected set state(state: State) {
		// ! important !!! clear params buffer
		if (state === State.Browse) this._params = undefined;
		this._stateEx = this._state;
		this._state = state;
		this._cb?.stateChanged?.({ ex: this._stateEx, new: this._state });
	}

	// ~ message
	protected _msgFuncNotAllow(funcName: string) {
		this._cb?.log?.({
			type: LogType.Reject,
			text: `${funcName} function not allow in ${StateMap.get(this.state)} state`
		});
	}
	protected _msgCallbackNotDefine(funcName: string) {
		this._cb?.log?.({
			type: LogType.Reject,
			text: `${funcName} callback function not defined}`
		});
	}
	protected _msgDbSuccess(funcName: string) {
		this._cb?.log?.({ type: LogType.DbSucess, text: `Data successfully ${funcName}` });
	}
	protected _msgDbError(msg?: string | null) {
		this._cb?.log?.({ type: LogType.DbError, text: msg ?? 'No data return' });
	}
	protected _msgParamsUndefined() {
		this._cb?.log?.({ type: LogType.Debug, text: 'Params undefined' });
	}
}

/**
 * - DatasetBrowse
 */
export class DatasetBrowse<T extends DataInterface> extends DatasetCore<T> {
	constructor(conf: DatasetConf<T>) {
		super(conf);
	}

	// ~ State Browse: for cancel or bact to Browse mode exit button
	protected _cancelActions: { [key in State]?: () => void } = {}; // check: may be no need
	cancel() {
		this._cancelActions[this.state]?.(); // check: may be no need
		this.state = State.Browse;
	}

	// ~ State Fetch
	fetch(params: T, needSubmit?: boolean) {
		if (this.state !== State.Browse) {
			this._msgFuncNotAllow('Fetch');
			return;
		}
		this.state = State.Fetch; // - to Fetch state, wait for submit button
		this._needSubmit = needSubmit;
		this._params = params;
		if (needSubmit !== true) this.submitFetch(false); // - no submit button
	}
	// ~ State SubmitFetch: for Save/Submit button
	submitFetch(needConfirm?: boolean) {
		if (this.state === State.Fetch)
			needConfirm ? (this.state = State.SubmitFetch) : this._fetching();
	}
	// ~ for submit confirmation dialog: Yes/No button
	protected _submitActions: { [key in State]?: () => void } = {
		[State.SubmitFetch]: () => this._fetching()
	};
	submitConfirm(answer: boolean) {
		answer ? this._submitActions[this.state]?.() : (this.state = this._stateEx);
	}
	// ~ State Fetching: call database action
	protected _fetching() {
		if (!this._cb?.fetch) {
			this._msgCallbackNotDefine('Fetch');
			return;
		}
		this.state = State.Fetching;
		this._cb.fetch(this._params).then((r) => {
			if (r.errMsg) {
				// - error
				this.state = this._needSubmit ? State.Fetch : State.Browse;
				this._msgDbError(r.errMsg);
			} else {
				// - success
				this._ds.rows = r.data;
				this.state = State.Browse;
				this.i = iNull;
			}
		});
	}
}

/**
 * - DatasetBrowse
 */
export class DatasetCRUD<T extends DataInterface> extends DatasetBrowse<T> {
	constructor(conf: DatasetConf<T>) {
		super(conf);

		this._submitActions = {
			[State.SubmitInsert]: () => this._inserting(),
			[State.SubmitFetch]: () => this._fetching(),
			[State.SubmitUpdate]: () => this._updating(),
			[State.SubmitDelete]: () => this._deleting()
		};

		this._cancelActions = {
			// check: may be no need
			[State.Insert]: () => {},
			[State.Fetch]: () => {},
			[State.Update]: () => {},
			[State.Delete]: () => {}
		};
	}

	// ~ State action: Insert, Update, Delete
	insert(params: T, needSubmit?: boolean) {
		if (this.state !== State.Browse) {
			this._msgFuncNotAllow('Insert');
			return;
		}
		// - to Insert state, wait for submit button
		this._needSubmit = needSubmit;
		this._params = params;
		this.state = State.Insert;
		// - no need Submit button, auto submit
		if (needSubmit !== true) this.submitInsert(false);
	}

	update(params: T, needSubmit?: boolean) {
		if (this.state !== State.Browse) {
			this._msgFuncNotAllow('Update');
			return;
		}
		// - to Update state, wait for submit button
		this._needSubmit = needSubmit;
		this._params = params;
		this.state = State.Update;
		// - no need Submit button, auto submit
		if (needSubmit !== true) this.submitUpdate(false);
	}

	delete(params: T, needSubmit?: boolean) {
		if (this.state !== State.Browse) {
			this._msgFuncNotAllow('Delete');
			return;
		}
		// - to Update state, wait for submit button
		this._needSubmit = needSubmit;
		this._params = params;
		this.state = State.Delete;
		// - no need Submit button, auto submit
		if (needSubmit !== true) this.submitDelete(false);
	}

	// ~ State action: SubmitInsert, SubmitUpdate, SubmitDelete
	submitInsert(needConfirm?: boolean) {
		if (this.state === State.Insert)
			needConfirm ? (this.state = State.SubmitInsert) : this._inserting();
	}

	submitUpdate(needConfirm?: boolean) {
		if (this.state === State.Update)
			needConfirm ? (this.state = State.SubmitUpdate) : this._updating();
	}

	submitDelete(needConfirm?: boolean) {
		if (this.state === State.Delete)
			needConfirm ? (this.state = State.SubmitDelete) : this._deleting();
	}

	// ~ State action: Inserting, Updating, Deleting
	protected _inserting() {
		if (!this._cb?.insert) {
			this._msgCallbackNotDefine('Insert');
			return;
		}
		if (this._params === undefined) {
			this._msgParamsUndefined();
			return;
		}
		this.state = State.Inserting;
		this._cb.insert(this._params).then((r) => {
			if (r.errMsg || !r.data) {
				this.state = this._needSubmit ? State.Insert : State.Browse;
				this._msgDbError(r.errMsg);
			} else {
				// - success
				this.rows.push(r.data);
				this.state = State.Browse;
				this.i = this.rows.length - 1;
				this._msgDbSuccess('inserted');
			}
		});
	}

	protected _updating() {
		if (!this._cb?.update) {
			this._msgCallbackNotDefine('Update');
			return;
		}
		if (this._params === undefined) {
			this._msgParamsUndefined();
			return;
		}
		this.state = State.Updating;
		this._cb.update(this._params).then((r) => {
			if (r.errMsg || !r.data) {
				// - error
				this.state = this._needSubmit ? State.Update : State.Browse;
				this._msgDbError(r.errMsg);
			} else {
				// - success:
				// - use finIndex instead of this.rows[this.i]
				// - can updating in no selected row situation
				const index = this._ds.rows.findIndex((row) => row.id === r.data?.id);
				if (index > -1) this._ds.rows[index] = r.data;
				this.state = State.Browse;
				this._msgDbSuccess('updated');
			}
		});
	}

	protected _deleting() {
		if (!this._cb?.delete) {
			this._msgCallbackNotDefine('Delete');
			return;
		}
		if (this._params === undefined) {
			this._msgParamsUndefined();
			return;
		}

		this.state = State.Deleting;
		this._cb.delete(this._params).then((r) => {
			if (r.errMsg || !r.data) {
				// - error
				this.state = this._needSubmit ? State.Delete : State.Browse;
				this._msgDbError(r.errMsg);
			} else {
				// - success:
				// - use finIndex instead of this.rows[this.i]
				// - can deleting in no selected row situation
				const index = this._ds.rows.findIndex((row) => row.id === r.data?.id);
				if (index > -1) this._ds.rows.splice(index, 1);
				this.state = State.Browse;
				this.i = iNull;
				this._msgDbSuccess('deleted');
			}
		});
	}
}
