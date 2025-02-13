import type { Ds } from '../ds/ds.svelte';
import type { DsState } from './ds-state.svelte';

// - CRUD FSM state
export enum State {
	Browse = 0,
	InsertStart = 10,
	FetchStart = 11,
	FetchNewStart = 12,
	UpdateStart = 13,
	DeleteStart = 14,
	InsertSubmit = 20,
	FetchSubmit = 21,
	FetchNewSubmit = 22,
	UpdateSubmit = 23,
	DeleteSubmit = 24,
	InsertAction = 30,
	FetchAction = 31,
	FetchNewAction = 32,
	UpdateAction = 33,
	DeleteAction = 34
}

export const StateMap = new Map<number, string>(
	Object.entries(State).map(([key, value]) => [value, key] as [number, string])
);

export const StateStart = new Set([
	State.InsertStart,
	State.FetchStart,
	State.FetchNewStart,
	State.UpdateStart,
	State.DeleteStart
]);

export const StateSubmit = new Set([
	State.InsertSubmit,
	State.FetchSubmit,
	State.FetchNewSubmit,
	State.UpdateSubmit,
	State.DeleteSubmit
]);

export const StateAction = new Set([
	State.InsertAction,
	State.FetchAction,
	State.FetchNewAction,
	State.UpdateAction,
	State.DeleteAction
]);

export type StateChanged = (state: { ex: State; now: State }) => void;

/**
 * + DsCoreInsertConf
 */
export type DsInsertConf<T> = {
	dsState: DsState;
	ds: Ds<T>;
	callback: { dbInsert: DbInsert<T>; log?: DsLog };
};

/**
 * + DsCoreFetchConf
 */
export type DsFetchConf<T> = {
	dsState: DsState;
	ds: Ds<T>;
	callback: { dbFetch: DbFetch<T>; log?: DsLog };
};

/**
 * + DsCoreUpdateConf
 */
export type DsUpdateConf<T> = {
	dsState: DsState;
	ds: Ds<T>;
	callback: { dbUpdate: DbUpdate<T>; log?: DsLog };
};

/**
 * + DsCoreDeleteConf
 */
export type DsDeleteConf<T> = {
	dsState: DsState;
	ds: Ds<T>;
	callback: { dbDelete: DbDelete<T>; log?: DsLog };
};

// - CRUD FSM callback
type DbResult<T> = { data: T | null; errMsg?: string | null };
type DbResults<T> = { data: T[]; errMsg?: string | null };
export type DbInsert<T> = (params: T) => Promise<DbResult<T>>;
export type DbFetch<T> = (params: T) => Promise<DbResults<T>>;
export type DbUpdate<T> = (params: T) => Promise<DbResult<T>>;
export type DbDelete<T> = (params: T) => Promise<DbResult<T>>;

export type DsCallback<T> = {
	log?: DsLog;
	dbInsert?: DbInsert<T>;
	dbFetch?: DbFetch<T>;
	dbUpdate?: DbUpdate<T>;
	dbDelete?: DbDelete<T>;
	stateChanged?: StateChanged;
};

export type DsCoreConf<T> = {
	dataset: Ds<T>;
	callback?: DsCallback<T>;
}; // - Log Callback

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

export type DsLogParams = { type?: LogType; text: string };
export type DsLog = (params: DsLogParams) => void;
// - Event callback
// export type SelectedRowChanged<T> = (row: T | null) => void;

export const DefaultLog: DsLog = (params) =>
	console.log(`${LogTypeMap.get(params.type ?? -1)}: ${params.text}`);
