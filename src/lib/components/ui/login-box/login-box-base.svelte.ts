import { writable } from 'svelte/store';
import type { User } from '@supabase/supabase-js';
import { getSession } from '$lib/db/user';
import { redirect } from '@sveltejs/kit';

export const user = writable<User | null>(null);
let u: User | null = null;
user.subscribe((val) => {
	u = val;
});

export const routeProtect = async (redirectPath: string) => {
	const { session } = await getSession();
	if (session) {
		user.set(session.user);
	} else {
		redirect(302, redirectPath);
	}
};
