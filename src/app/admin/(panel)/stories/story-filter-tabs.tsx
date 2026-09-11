'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
    CheckCircle2,
    Circle,
    Inbox,
    RefreshCw,
    XCircle,
    type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const FILTER_META: Record<string, { icon: LucideIcon; count: string }> = {
    all: { icon: Inbox, count: 'bg-[#4f7cff]/20 text-[#8fb0ff]' },
    pending: { icon: Circle, count: 'bg-amber-500/20 text-amber-400' },
    approved: { icon: CheckCircle2, count: 'bg-emerald-500/20 text-emerald-400' },
    rejected: { icon: XCircle, count: 'bg-rose-500/20 text-rose-400' },
};

/**
 * The status filter lives in the URL so the page stays a Server Component and
 * every view is linkable; this wrapper only turns a click into a navigation.
 */
export function StoryFilterTabs({
    filters,
    active,
    counts,
}: {
    filters: readonly string[];
    active: string;
    counts: Record<string, number>;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    return (
        <div className="flex flex-wrap items-center gap-2">
            {filters.map((value) => {
                const meta = FILTER_META[value] ?? FILTER_META.all;
                const Icon = meta.icon;
                const isActive = value === active;

                return (
                    <button
                        key={value}
                        type="button"
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() =>
                            startTransition(() =>
                                router.push(
                                    value === 'all'
                                        ? '/admin/stories'
                                        : `/admin/stories?status=${value}`,
                                ),
                            )
                        }
                        className={cn(
                            'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-medium capitalize transition-colors',
                            isActive
                                ? 'border-[#4f7cff]/50 bg-[#4f7cff]/12 text-foreground'
                                : 'border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                        )}
                    >
                        <Icon
                            className={cn(
                                'size-4',
                                isActive ? 'text-[#8fb0ff]' : 'text-muted-foreground',
                            )}
                            aria-hidden="true"
                        />
                        {value}
                        <span
                            className={cn(
                                'rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums',
                                meta.count,
                            )}
                        >
                            {counts[value] ?? 0}
                        </span>
                    </button>
                );
            })}

            <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={() => startTransition(() => router.refresh())}
                className="ml-auto"
            >
                <RefreshCw
                    className={cn(isPending && 'animate-spin')}
                    aria-hidden="true"
                />
                Refresh
            </Button>
        </div>
    );
}
