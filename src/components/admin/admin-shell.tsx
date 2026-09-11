'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from '@base-ui/react/menu';
import {
    ArrowUpRight,
    ChevronDown,
    FileText,
    HeartHandshake,
    LayoutDashboard,
    LogOut,
    Mail,
    Megaphone,
    Menu as MenuIcon,
    ShieldAlert,
    Tag,
    Users,
} from 'lucide-react';

import { logout } from '@/app/admin/actions';
import type { AdminSession } from '@/lib/admin/auth';
import { cn } from '@/lib/utils';

/** The sidebar. Each entry opens its own section — all empty for now. */
export const navGroups = [
    {
        label: null,
        items: [{ href: '/admin', label: 'Overview', icon: LayoutDashboard }],
    },
    {
        label: 'Content',
        items: [
            { href: '/admin/stories', label: 'Stories', icon: ShieldAlert },
            { href: '/admin/categories', label: 'Categories', icon: Tag },
            { href: '/admin/posts', label: 'Blog', icon: FileText },
            { href: '/admin/campaigns', label: 'Campaigns', icon: Megaphone },
        ],
    },
    {
        label: 'Community',
        items: [
            { href: '/admin/members', label: 'Members', icon: Users },
            { href: '/admin/messages', label: 'Messages', icon: Mail },
        ],
    },
    {
        label: 'Fundraising',
        items: [
            { href: '/admin/donations', label: 'Donations', icon: HeartHandshake },
        ],
    },
] as const;

export function AdminShell({
    session,
    children,
}: {
    session: AdminSession;
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    // Navigating on mobile should close the drawer behind you.
    useEffect(() => setMenuOpen(false), [pathname]);

    const isActive = (href: string) =>
        href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

    const sidebar = (
        <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-center border-b border-white/[0.07] px-5">
                <span className="font-display text-2xl uppercase leading-none text-[#e30613]">
                    RVJP
                </span>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-5">
                {navGroups.map((group, index) => (
                    <div key={group.label ?? 'root'} className={cn(index > 0 && 'mt-6')}>
                        {group.label ? (
                            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#4d4a47]">
                                {group.label}
                            </p>
                        ) : null}
                        <ul className="space-y-0.5">
                            {group.items.map((item) => {
                                const active = isActive(item.href);
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            aria-current={active ? 'page' : undefined}
                                            className={cn(
                                                'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors',
                                                active
                                                    ? 'bg-white/[0.06] text-white'
                                                    : 'text-[#9a9693] hover:bg-white/[0.03] hover:text-[#f5f5f5]',
                                            )}
                                        >
                                            {active ? (
                                                <span
                                                    aria-hidden="true"
                                                    className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-[#e30613]"
                                                />
                                            ) : null}
                                            <item.icon
                                                className={cn(
                                                    'h-4 w-4 shrink-0',
                                                    active ? 'text-[#e30613]' : 'text-[#5c5854]',
                                                )}
                                                aria-hidden="true"
                                            />
                                            <span className="truncate">{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            <div className="border-t border-white/[0.07] p-3">
                <Link
                    href="/"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-[#9a9693] transition-colors hover:bg-white/[0.03] hover:text-[#f5f5f5]"
                >
                    <ArrowUpRight className="h-4 w-4 text-[#5c5854]" aria-hidden="true" />
                    View public site
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-dvh bg-[#0a0a0a] text-[#f5f5f5]">
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-white/[0.07] bg-[#0c0c0c] lg:block">
                {sidebar}
            </aside>

            {menuOpen ? (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={() => setMenuOpen(false)}
                        className="absolute inset-0 h-full w-full bg-black/75"
                    />
                    <aside className="absolute inset-y-0 left-0 w-64 border-r border-white/[0.07] bg-[#0c0c0c]">
                        {sidebar}
                    </aside>
                </div>
            ) : null}

            <div className="lg:pl-60">
                <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-white/[0.07] bg-[#0a0a0a]/95 px-5 backdrop-blur lg:px-10">
                    <button
                        type="button"
                        onClick={() => setMenuOpen(true)}
                        aria-label="Open menu"
                        className="rounded-lg border border-white/[0.12] p-2 text-[#9a9693] transition-colors hover:text-white lg:hidden"
                    >
                        <MenuIcon className="h-4 w-4" />
                    </button>

                    <span className="font-display text-xl uppercase leading-none text-[#e30613] lg:hidden">
                        RVJP
                    </span>

                    <UserMenu session={session} />
                </header>

                <main className="px-5 py-7 lg:px-10 lg:py-9">{children}</main>
            </div>
        </div>
    );
}

function UserMenu({ session }: { session: AdminSession }) {
    const initials = session.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <Menu.Root>
            <Menu.Trigger className="ml-auto flex items-center gap-2.5 rounded-xl border border-transparent px-2 py-1.5 transition-colors hover:border-white/[0.12] hover:bg-white/[0.03] data-[popup-open]:border-white/[0.12]">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e30613] text-[11px] font-bold text-white">
                    {initials}
                </span>
                <span className="hidden text-left sm:block">
                    <span className="block text-xs font-semibold leading-tight text-[#f5f5f5]">
                        {session.name}
                    </span>
                    <span className="block text-[10px] uppercase tracking-[0.14em] text-[#5c5854]">
                        {session.role}
                    </span>
                </span>
                <ChevronDown className="hidden h-3.5 w-3.5 text-[#5c5854] sm:block" />
            </Menu.Trigger>

            <Menu.Portal>
                <Menu.Positioner sideOffset={8} align="end" className="z-[60]">
                    <Menu.Popup className="min-w-52 rounded-xl border border-white/[0.1] bg-[#141414] p-1.5 shadow-[0_24px_60px_-24px_rgba(0,0,0,1)] outline-none">
                        <div className="border-b border-white/[0.07] px-2.5 pb-2.5 pt-1.5">
                            <p className="text-sm font-semibold text-[#f5f5f5]">{session.name}</p>
                            <p className="mt-0.5 text-xs text-[#5c5854]">@{session.username}</p>
                        </div>
                        <form action={logout} className="pt-1.5">
                            <Menu.Item
                                render={<button type="submit" />}
                                className="flex w-full cursor-default items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-[#ff7b82] outline-none transition-colors data-[highlighted]:bg-[#e30613]/12"
                            >
                                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                                Sign out
                            </Menu.Item>
                        </form>
                    </Menu.Popup>
                </Menu.Positioner>
            </Menu.Portal>
        </Menu.Root>
    );
}
