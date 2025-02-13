import { State, StateAction, StateStart, StateSubmit, type StateChanged } from './type';

/**
 * + DsState
 */
export class DsState {
	constructor(conf: { callback: { stateChanged?: StateChanged } }) {
		this.#stateChanged = conf.callback.stateChanged;
	}

	#now: State = $state(State.Browse);
	#ex: State = $state(State.Browse);
	#stateChanged?: StateChanged;

	set now(state: State) {
		this.#ex = this.#now;
		this.#now = state;
		this.#stateChanged?.({ now: this.#now, ex: this.#ex });
	}
	get now() {
		return this.#now;
	}
	get ex() {
		return this.#ex;
	}

	get isStart() {
		return StateStart.has(this.#now);
	}
	get isSubmit() {
		return StateSubmit.has(this.#now);
	}
	get isAction() {
		return StateAction.has(this.#now);
	}

	get isBrowse() {
		return this.#now === State.Browse;
	}

	get isInsertStart() {
		return this.#now === State.InsertStart;
	}
	get isFetchStart() {
		return this.#now === State.FetchStart;
	}
	get isFetchNewStart() {
		return this.#now === State.FetchNewStart;
	}
	get isUpdateStart() {
		return this.#now === State.UpdateStart;
	}
	get isDeleteStart() {
		return this.#now === State.DeleteStart;
	}

	get isInsertSubmit() {
		return this.#now === State.InsertSubmit;
	}
	get isFetchSubmit() {
		return this.#now === State.FetchSubmit;
	}
	get isFetchNewSubmit() {
		return this.#now === State.FetchNewSubmit;
	}
	get isUpdateSubmit() {
		return this.#now === State.UpdateSubmit;
	}
	get isDeleteSubmit() {
		return this.#now === State.DeleteSubmit;
	}

	get isInsertAction() {
		return this.#now === State.InsertAction;
	}
	get isFetchAction() {
		return this.#now === State.FetchAction;
	}
	get isFetchNewAction() {
		return this.#now === State.FetchNewAction;
	}
	get isUpdateAction() {
		return this.#now === State.UpdateAction;
	}
	get isDeleteAction() {
		return this.#now === State.DeleteAction;
	}
}
