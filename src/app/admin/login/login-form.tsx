'use client';

import { useActionState, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import {
    AlertTriangle,
    ArrowRight,
    Eye,
    EyeOff,
    PenLine,
    ShieldCheck,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { login, type LoginState } from '../actions';

const FIELD =
    'w-full rounded-xl border border-white/[0.1] bg-[#0d0d0d] px-4 py-3 text-sm text-[#f5f5f5] transition-colors placeholder:text-[#4d4a47] hover:border-white/[0.18] focus:border-[#e30613] focus:outline-none';

const LABEL =
    'mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#9a9693]';

/** PLACEHOLDER — remove with the demo accounts in `lib/admin/auth.ts`. */
const demoAccounts = [
    {
        role: 'Administrator',
        username: 'admin',
        password: 'rvjp@2026',
        icon: ShieldCheck,
        note: 'Full access to every section',
    },
    {
        role: 'Editor',
        username: 'editor',
        password: 'rvjp@2026',
        icon: PenLine,
        note: 'Stories and blog only',
    },
];

function SubmitButton({
    buttonRef,
}: {
    buttonRef: React.RefObject<HTMLButtonElement | null>;
}) {
    // useFormStatus only reports the parent form, so this has to stay its own
    // component rendered inside it.
    const { pending } = useFormStatus();
    return (
        <button
            ref={buttonRef}
            type="submit"
            disabled={pending}
            className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#e30613] px-6 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#ff2733] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e30613] disabled:opacity-60"
        >
            {pending ? 'Signing in…' : 'Sign in'}
            <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            />
        </button>
    );
}

export function LoginForm() {
    const [state, formAction] = useActionState<LoginState, FormData>(login, {
        error: null,
    });
    const [showPassword, setShowPassword] = useState(false);
    /** Which demo account was loaded, so the card can show it took effect. */
    const [filled, setFilled] = useState<string | null>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const submitRef = useRef<HTMLButtonElement>(null);

    // Only fills the fields — signing in stays a deliberate second click. The
    // inputs are uncontrolled, so writing to the DOM is enough; FormData reads
    // the same values.
    const fillDemoAccount = (username: string, password: string) => {
        if (usernameRef.current) usernameRef.current.value = username;
        if (passwordRef.current) passwordRef.current.value = password;
        setFilled(username);
        submitRef.current?.focus();
    };

    return (
        <form action={formAction} noValidate>
            {state.error ? (
                <div
                    role="alert"
                    className="mb-5 flex items-start gap-3 rounded-xl border border-[#e30613]/30 bg-[#e30613]/[0.08] px-4 py-3"
                >
                    <AlertTriangle
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#ff7b82]"
                        aria-hidden="true"
                    />
                    <p className="text-xs leading-relaxed text-[#ff9aa0]">{state.error}</p>
                </div>
            ) : null}

            <div className="space-y-4">
                <div>
                    <label htmlFor="username" className={LABEL}>
                        Username
                    </label>
                    <input
                        ref={usernameRef}
                        id="username"
                        name="username"
                        type="text"
                        required
                        autoComplete="username"
                        placeholder="admin"
                        aria-invalid={state.error ? true : undefined}
                        className={FIELD}
                    />
                </div>

                <div>
                    <label htmlFor="password" className={LABEL}>
                        Password
                    </label>
                    <div className="relative">
                        <input
                            ref={passwordRef}
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            autoComplete="current-password"
                            placeholder="••••••••"
                            aria-invalid={state.error ? true : undefined}
                            className={cn(FIELD, 'pr-12')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((value) => !value)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            aria-pressed={showPassword}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#4d4a47] transition-colors hover:text-[#f5f5f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e30613]"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <SubmitButton buttonRef={submitRef} />
            </div>

            {/* Demo accounts — these fill the fields only; the user still
                presses Sign in. ------------------------------------------- */}
            <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.24em] text-[#5c5854]">
                Demo accounts — tap to fill
            </p>

            <div className="mt-3 space-y-2">
                {demoAccounts.map((account) => {
                    const isFilled = filled === account.username;
                    return (
                        <button
                            key={account.username}
                            type="button"
                            aria-pressed={isFilled}
                            onClick={() => fillDemoAccount(account.username, account.password)}
                            className={cn(
                                'group flex w-full items-center gap-3.5 rounded-xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e30613]',
                                isFilled
                                    ? 'border-[#e30613]/50 bg-[#e30613]/[0.07]'
                                    : 'border-white/[0.07] bg-white/[0.02] hover:border-[#e30613]/40 hover:bg-white/[0.04]',
                            )}
                        >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e30613]/12">
                                <account.icon
                                    className="h-4 w-4 text-[#ff7b82]"
                                    aria-hidden="true"
                                />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-[13px] font-bold text-[#f5f5f5]">
                                    {account.role}
                                </span>
                                <span className="mt-0.5 block truncate text-[11px] text-[#5c5854]">
                                    {account.username} · {account.password}
                                </span>
                            </span>
                            {isFilled ? (
                                <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] text-[#e30613]">
                                    Filled
                                </span>
                            ) : (
                                <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] text-[#3a3836] transition-colors group-hover:text-[#e30613]">
                                    Fill
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </form>
    );
}
