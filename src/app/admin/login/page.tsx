import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { LoginForm } from './login-form';
import { getSession } from '@/lib/admin/auth';

export const metadata: Metadata = {
    title: 'Sign in — RVJP Admin',
    robots: { index: false, follow: false },
};

/** What the panel manages. Labels, deliberately not figures — reach and
 *  participant counts are claims the organisation has to stand behind. */
const sections = [
    { label: 'Stories', note: 'Review & publish' },
    { label: 'Members', note: 'Roles & access' },
    { label: 'Donations', note: 'Ledger & receipts' },
];

export default async function AdminLoginPage() {
    if (await getSession()) redirect('/admin');

    return (
        <div className="grid h-dvh overflow-hidden bg-[#0a0a0a] text-[#f5f5f5] lg:grid-cols-2">
            {/* Brand side — desktop only. */}
            <aside className="relative hidden overflow-hidden border-r border-white/[0.07] bg-[#0c0c0c] lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-14">
                <span
                    aria-hidden="true"
                    className="font-display pointer-events-none absolute -right-10 bottom-4 select-none text-[12rem] uppercase leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.04)] xl:text-[15rem]"
                >
                    RVJP
                </span>

                <div className="relative z-10 flex items-center gap-3">
                    <Image
                        src="/rvjp-logo.png"
                        alt=""
                        width={180}
                        height={58}
                        className="h-10 w-auto object-contain"
                        priority
                    />
                    <span className="leading-none">
                        <span className="font-display block text-base uppercase leading-none xl:text-lg">
                            <span className="text-[#e30613]">Rape</span> Virodhi Janta Party
                        </span>
                        <span className="mt-1.5 block text-[9px] font-bold uppercase tracking-[0.2em] text-white/45">
                            A voice. A movement. A change.
                        </span>
                    </span>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h2 className="font-display text-[2.5rem] uppercase leading-[0.95] tracking-[0.01em] xl:text-[3.25rem]">
                        Every record here{' '}
                        <span className="text-[#e30613]">belongs to someone</span>
                    </h2>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-[#9a9693]">
                        Submissions, contact details and donor records all pass through this
                        panel. Treat every row as confidential, and sign out on shared machines.
                    </p>

                    <div className="mt-7 grid grid-cols-3 gap-2.5">
                        {sections.map((section) => (
                            <div
                                key={section.label}
                                className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5"
                            >
                                <p className="font-display text-lg uppercase leading-none text-[#e30613]">
                                    {section.label}
                                </p>
                                <p className="mt-1.5 text-[11px] leading-tight text-[#5c5854]">
                                    {section.note}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative z-10 text-xs text-[#4d4a47]">
                    © {new Date().getFullYear()} Rape Virodhi Janta Party · Placeholder build
                </p>
            </aside>

            {/* Form side. Scrolls only if the viewport is too short to hold the
                form — clipping the sign-in button would be worse. */}
            <main className="flex flex-col justify-center overflow-y-auto px-6 py-8 sm:px-10 lg:px-12 xl:px-16">
                <div className="mx-auto w-full max-w-[25rem]">
                    {/* Compact lockup for phones, where the brand panel is hidden. */}
                    <div className="mb-6 flex items-center gap-3 lg:hidden">
                        <Image
                            src="/rvjp-logo.png"
                            alt=""
                            width={180}
                            height={58}
                            className="h-9 w-auto object-contain"
                            priority
                        />
                        <span className="font-display text-base uppercase leading-none">
                            <span className="text-[#e30613]">Rape</span> Virodhi Janta Party
                        </span>
                    </div>

                    <h1 className="font-display text-[2rem] uppercase leading-none tracking-[0.01em] sm:text-4xl">
                        Sign in
                    </h1>
                    <p className="mt-2.5 text-sm leading-relaxed text-[#9a9693]">
                        Use a demo account below, or enter credentials.
                    </p>

                    <div className="mt-6">
                        <LoginForm />
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#5c5854] transition-colors hover:text-[#f5f5f5]"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Back to site
                        </Link>
                        <p className="text-[11px] text-[#3a3836]">Placeholder authentication</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
