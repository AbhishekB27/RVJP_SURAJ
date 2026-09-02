import type { Metadata } from 'next';

import { AdminShell } from '@/components/admin/admin-shell';
import { requireSession } from '@/lib/admin/auth';

export const metadata: Metadata = {
    title: 'RVJP Admin',
    robots: { index: false, follow: false },
};

/**
 * Everything inside this group is signed-in only. `/admin/login` sits outside
 * it, which is why the guard can live in a layout instead of a middleware.
 */
export default async function PanelLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await requireSession();
    return <AdminShell session={session}>{children}</AdminShell>;
}
