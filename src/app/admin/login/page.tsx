import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { LoginForm } from './login-form';
import { getSession } from '@/lib/admin/auth';

export const metadata: Metadata = {
    title: 'Sign in — RVJP Admin',
    robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
    if (await getSession()) redirect('/admin');

    return (
        <div className="flex min-h-dvh items-center justify-center bg-[#0a0a0a] px-6 py-16 text-[#f5f5f5]">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <span className="font-display text-4xl uppercase leading-none text-[#e30613]">
                        RVJP
                    </span>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#5c5854]">
                        Admin panel
                    </p>
                </div>

                <LoginForm />

                <p className="mt-8 text-center text-xs leading-relaxed text-[#5c5854]">
                    Demo credentials — <span className="text-[#9a9693]">admin / rvjp@2026</span>
                    <br />
                    Placeholder auth over dummy data. Not for real submissions.
                </p>
            </div>
        </div>
    );
}
