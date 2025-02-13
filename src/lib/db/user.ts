import { AuthError } from '@supabase/supabase-js';
import { db } from './db';

export const login = async (email: string, password: string) => {
  if (email.trim() === '' || password.trim() === '')
    return { user: null, error: null, session: null };
  const resp = await db().auth.signInWithPassword({ email, password });
  return {
    user: resp.data.user,
    error: resp.error,
    session: resp.data.session
  };
};

export const logout = async () => {
  return await db().auth.signOut();
};

export const updateUser = async (params: { name?: string; pass?: string; verify?: string }) => {
  let name = params.name?.trim();
  let pass = params.pass?.trim();
  let verify = params.verify?.trim();

  if (name === '') name = undefined;
  if (pass === '') pass = undefined;
  if (verify === '') verify = undefined;

  let errorString: string = '';

  if (!name && !pass && !verify) {
    errorString += 'No entries for update.\n';
  }

  if (name && name.length < 3) errorString += 'Name must more than 3 chars';

  if (pass || verify) {
    if (pass !== undefined) {
      const passwordRegex = /^[\w!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]+$/;
      if (!passwordRegex.test(pass)) errorString += 'Invalid password chars';
    }
    if (pass !== undefined && pass.length < 6)
      errorString += 'Password string need more than 6 chars.\n';
    if (pass !== verify) errorString += 'Password and verify must be same.\n';
  }

  if (errorString !== '') return { user: null, error: new AuthError(errorString) };

  const { data, error } = await db().auth.updateUser({
    password: pass,
    data: name !== undefined ? { display_name: name } : undefined
  });

  return { user: data.user, error };
};

export const getUser = async () => {
  const resp = await db().auth.getUser();
  return { user: resp.data.user, error: resp.error };
};

export const getSession = async () => {
  const resp = await db().auth.getSession();
  return { session: resp.data.session, error: resp.error };
};
