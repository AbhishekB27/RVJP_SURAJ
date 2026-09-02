'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { SESSION_COOKIE, encodeSession, verifyCredentials } from '@/lib/admin/auth';

export interface LoginState {
    error: string | null;
}

export async function login(
    _prev: LoginState,
    formData: FormData,
): Promise<LoginState> {
    const username = String(formData.get('username') ?? '');
    const password = String(formData.get('password') ?? '');

    if (!username || !password) {
        return { error: 'Enter both a username and a password.' };
    }

    const session = verifyCredentials(username, password);
    if (!session) {
        return { error: 'Those credentials did not match. Check the demo hint below.' };
    }

    (await cookies()).set(SESSION_COOKIE, encodeSession(session), {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        // Eight hours — long enough for a shift, short enough to expire.
        maxAge: 60 * 60 * 8,
        secure: process.env.NODE_ENV === 'production',
    });

    redirect('/admin');
}

export async function logout() {
    (await cookies()).delete(SESSION_COOKIE);
    redirect('/admin/login');
}
