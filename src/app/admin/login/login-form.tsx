'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Lock } from 'lucide-react';

import { login, type LoginState } from '../actions';

const FIELD =
    'w-full rounded-xl border border-white/[0.1] bg-[#0a0a0a] px-4 py-3.5 text-sm text-[#f5f5f5] transition-colors placeholder:text-[#5c5854] focus:border-[#e30613] focus:outline-none';

const LABEL = 'mb-2 block text-xs font-bold uppercase tracking-wide';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#e30613] px-6 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-[#ff2733] disabled:opacity-60"
        >
            <Lock className="h-4 w-4" aria-hidden="true" />
            {pending ? 'Signing in…' : 'Sign in'}
        </button>
    );
}

export function LoginForm() {
    const [state, formAction] = useActionState<LoginState, FormData>(login, {
        error: null,
    });

    return (
        <form
            action={formAction}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6"
        >
            <div className="mb-4">
                <label htmlFor="username" className={LABEL}>
                    Username
                </label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    autoComplete="username"
                    autoFocus
                    placeholder="admin"
                    className={FIELD}
                />
            </div>

            <div className="mb-4">
                <label htmlFor="password" className={LABEL}>
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={FIELD}
                />
            </div>

            {state.error ? (
                <p
                    role="alert"
                    className="mb-4 rounded-xl border border-[#e30613]/30 bg-[#e30613]/10 px-4 py-3 text-xs text-[#ff8f95]"
                >
                    {state.error}
                </p>
            ) : null}

            <SubmitButton />
        </form>
    );
}
