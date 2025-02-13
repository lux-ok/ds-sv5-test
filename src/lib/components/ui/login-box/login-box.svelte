<script lang="ts">
	import { Btn, buttonVariants } from '$lib/components/ui/btn';
	import * as Dlg from '$lib/components/ui/dlg';
	import { Inp } from '$lib/components/ui/inp';
	import { Lbl } from '$lib/components/ui/lbl';
	import { login, logout } from '$lib/db/user';
	import { cn } from '$lib/utils';
	import { toast } from 'svelte-sonner';
	import { user } from './login-box-base.svelte';
	import { goto } from '$app/navigation';

	interface Props {
		btnClass?: string;
		href?: string;
		hrefUser?: string;
	}
	const { btnClass, href = '/', hrefUser = '/' }: Props = $props();

	const btnClassName = cn('select-none', buttonVariants({ variant: 'default' }), btnClass);

	let email = $state('');
	let password = $state('');
	let inpElement: HTMLInputElement | null = $state(null);

	async function handleLogin() {
		const { user: u, error, session } = await login(email, password);
		if (u) {
			$user = u;
			toast(`Welcome! ${u.user_metadata.display_name}`);
			goto(href);
		}
		if (error) {
			inpElement?.focus();
			password = '';
			toast(error.message);
		}
	}

	async function handleLogout() {
		const { error } = await logout();
		if (error) toast(error.message);
		else {
			$user = null;
			toast('Logout successful');
			goto(hrefUser);
		}
	}
</script>

{#if $user}
	<Btn href={hrefUser} variant="link" class="px-4">{$user.user_metadata.display_name}</Btn>
	<Btn variant="secondary" class={btnClassName} onclick={handleLogout}>Logout</Btn>
{:else}
	<Dlg.Root>
		<Dlg.Trigger class={btnClassName}>Login</Dlg.Trigger>
		<Dlg.Content class="sm:max-w-[425px]">
			<Dlg.Header>
				<Dlg.Title>User Login</Dlg.Title>
				<Dlg.Description>Please enter user email and submit password.</Dlg.Description>
			</Dlg.Header>
			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<Lbl for="email" class="text-right">Email</Lbl>
					<Inp id="email" type="email" bind:value={email} class="col-span-3" autocomplete="on" />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Lbl for="password" class="text-right">Password</Lbl>
					<Inp
						bind:ref={inpElement}
						onkeydown={(e: KeyboardEvent) => {
							if (e.key === 'Enter') {
								e.preventDefault();
								handleLogin();
							}
						}}
						id="password"
						type="password"
						bind:value={password}
						class="col-span-3"
					/>
				</div>
			</div>
			<Dlg.Footer>
				<Btn type="submit" onclick={handleLogin}>Login</Btn>
			</Dlg.Footer>
		</Dlg.Content>
	</Dlg.Root>
{/if}
