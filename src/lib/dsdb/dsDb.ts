import { $ } from 'bun';
await $`clear`;

import type { Loc } from '../ds/type';
import * as d from '../../routes/ds/test-data/object';

class dsDb<T extends object> {
	// create1(
	// 	row: Partial<T>,
	// 	target?: {
	// 		rowSel?: Loc;
	// 		tableSel?: number;
	// 		selLast?: boolean;
	// 		after?: boolean;
	// 		changeSel?: boolean;
	// 	}
	// ) {
	// 	console.log('row:', row);
	// }

	// create1(
	// 	row?: Partial<T>,
	// 	target?: {
	// 		rowSel?: Loc;
	// 		tableSel?: number;
	// 		selLast?: boolean;
	// 		after?: boolean;
	// 		changeSel?: boolean;
	// 	}
	// ) {
	// 	console.log('rows:', row);
	// }

	// create(
	// 	rows?: Partial<T>[],
	// 	target?: {
	// 		rowSel?: Loc;
	// 		tableSel?: number;
	// 		selLast?: boolean;
	// 		after?: boolean;
	// 		changeSel?: boolean;
	// 	}
	// ) {
	// 	console.log('rows:', rows);
	// }

	create(params: { row: Partial<T>; changeSel?: boolean }): void;
	create(params: { row: Partial<T>; rowSel: Loc; after?: boolean; changeSel?: boolean }): void;
	create(params: { rows: Partial<T>[]; changeSel?: boolean }): void;
	create(params: { rows: Partial<T>[]; rowSel: Loc; after?: boolean; changeSel?: boolean }): void;
	create(params: { row: Partial<T>; tableSel: number; after?: boolean; changeSel?: boolean }): void;
	create(params: {
		rows: Partial<T>[];
		tableSel: number;
		after?: boolean;
		changeSel?: boolean;
	}): void;

	create(params: {
		row?: Partial<T>;
		rows?: Partial<T>[];
		rowSel?: Loc;
		tableSel?: number;
		selLast?: boolean;
		after?: boolean;
		changeSel?: boolean;
	}) {
		const { rows } = params;
		// test
		rows && console.log('rows:', rows);
	}

	read1(row: T) {}
	read(rows: T[]) {}

	update1(row: T) {}
	update(rows: T[]) {}

	delete1(row: T) {}
	delete(rows: T[]) {}
}

const a = new dsDb<d.MyType>();

a.create({ row: {}, tableSel: 1, after: true });
