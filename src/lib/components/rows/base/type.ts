export interface DataInterface {
	id?: number;
}

export interface DatasetInterface<T extends DataInterface> {
	// - data array
	set rows(rs: T[]);
	get rows(): T[];

	// - row selected index number (pointer of rows array)
	set i(i: number);
	get i(): number;

	// - Ex-index number
	set iEx(i: number);
	get iEx(): number;

	get row(): T; // check
}

export interface Dataset2DInterface<T extends DataInterface> extends DatasetInterface<T> {
	get groups(): T[][];
	get level(): number;
	get crumbs(): number[];
}

export const iNull = -1;

// - Log Callback
export enum LogType {
	Prompt,
	Warn,
	Sucess,
	Reject,
	Rrror,
	Hint,
	Debug,
	DbSucess,
	DbError
}
export const LogTypeMap = new Map<number, string>(
	Object.entries(LogType).map(([key, value]) => [value, key] as [number, string])
);
export type LogParams = { type?: LogType; text: string };
export type Log = (params: LogParams) => void;

// - CRUD FSM state
export enum State {
	Browse = 0,
	Insert = 10,
	Fetch = 11,
	Update = 12,
	Delete = 13,
	SubmitInsert = 20,
	SubmitFetch = 21,
	SubmitUpdate = 22,
	SubmitDelete = 23,
	Inserting = 30,
	Fetching = 31,
	Updating = 32,
	Deleting = 33
}

export const StateMap = new Map<number, string>(
	Object.entries(State).map(([key, value]) => [value, key] as [number, string])
);

// - CRUD FSM callback
type DbResult<T> = { data: T | null; errMsg?: string | null };
type DbResults<T> = { data: T[]; errMsg?: string | null };
export type DbInsert<T extends DataInterface> = (params: T) => Promise<DbResult<T>>;
export type DbFetch<T extends DataInterface> = (params?: T) => Promise<DbResults<T>>;
export type DbUpdate<T extends DataInterface> = (params: T) => Promise<DbResult<T>>;
export type DbDelete<T extends DataInterface> = (params: T) => Promise<DbResult<T>>;

// - Event callback
export type IndexChanged = (index: { ex: number; new: number }) => void;
export type SelectedRowChanged<T> = (row: T | null) => void;
export type StateChanged = (state: { ex: State; new: State }) => void;

export type DataSetCallback<T extends DataInterface> = {
	log?: Log;
	insert?: DbInsert<T>;
	fetch?: DbFetch<T>;
	update?: DbUpdate<T>;
	delete?: DbDelete<T>;
	indexChanged?: IndexChanged;
	selectedRowChanged?: SelectedRowChanged<T>;
	stateChanged?: StateChanged;
};

export type DatasetConf<T extends DataInterface> = {
	dataset: DatasetInterface<T>;
	callback?: DataSetCallback<T>;
	debug?: boolean;
};

export type InfoParams = DataInterface & {
	id_o?: number;
	lang?: number;
	rem?: string;
	desc?: string;
	intro?: string;
	sort?: number;
};
