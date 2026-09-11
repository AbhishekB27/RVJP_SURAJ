'use client';

import {
    useEffect,
    useMemo,
    useOptimistic,
    useRef,
    useState,
    useTransition,
} from 'react';
import {
    Clock,
    Inbox,
    Search,
    ShieldCheck,
    SlidersHorizontal,
    X,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { relativeTime } from '@/lib/format-time';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { categoryStyle, type CategoryColor } from '@/lib/categories';
import type { StoryDTO, StoryStatus } from '@/lib/stories';

import { deleteStory, setStoryStatus } from './actions';
import { StoryDetail } from './story-detail';
import { STATUS_STYLE, avatarTint, initials } from './story-styles';

type Patch =
    | { kind: 'status'; id: string; status: StoryStatus }
    | { kind: 'delete'; id: string };

const MINUTE = 60_000;

export function StoryInbox({
    stories,
    categoryColors,
    categoryNames,
}: {
    stories: StoryDTO[];
    /** Category name → colour token, from /admin/categories. */
    categoryColors: Record<string, CategoryColor>;
    /** Active categories, for the filter menu. */
    categoryNames: string[];
}) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('all');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    // Mobile shows one pane at a time; desktop shows both.
    const [detailOpen, setDetailOpen] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);

    /**
     * Moderating should feel instant. The action still re-renders the page from
     * the database afterwards — this only removes the wait in between.
     */
    const [items, applyPatch] = useOptimistic(
        stories,
        (state: StoryDTO[], patch: Patch) =>
            patch.kind === 'delete'
                ? state.filter((s) => s.id !== patch.id)
                : state.map((s) =>
                      s.id === patch.id ? { ...s, status: patch.status } : s,
                  ),
    );

    /**
     * `Date.now()` is fixed at mount rather than read during render: reading it
     * per render makes server and client disagree over how long the request
     * took, which is a hydration mismatch on every timestamp.
     */
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), MINUTE);
        return () => clearInterval(id);
    }, []);

    // The server already returns these newest first, so order is left alone.
    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();

        return items.filter((s) => {
            if (category !== 'all' && s.category !== category) return false;
            if (!q) return true;
            return (
                s.story.toLowerCase().includes(q) ||
                s.category.toLowerCase().includes(q) ||
                (s.name ?? '').toLowerCase().includes(q) ||
                (s.contact ?? '').toLowerCase().includes(q)
            );
        });
    }, [items, query, category]);

    // Derived, not stored: after a delete or a filter change the selected id may
    // no longer be in the list, and falling back here avoids setting state
    // during render.
    const selected = visible.find((s) => s.id === selectedId) ?? visible[0] ?? null;

    const move = (delta: number) => {
        if (visible.length === 0) return;
        const index = selected ? visible.findIndex((s) => s.id === selected.id) : -1;
        setSelectedId(
            visible[Math.min(Math.max(index + delta, 0), visible.length - 1)].id,
        );
    };

    const moderate = (status: StoryStatus) => {
        if (!selected) return;
        const id = selected.id;
        setError(null);
        startTransition(async () => {
            applyPatch({ kind: 'status', id, status });
            try {
                await setStoryStatus(id, status);
            } catch {
                setError('That change did not save. Please try again.');
            }
        });
    };

    const remove = () => {
        if (!selected) return;
        const id = selected.id;
        setError(null);
        startTransition(async () => {
            applyPatch({ kind: 'delete', id });
            try {
                await deleteStory(id);
            } catch {
                setError('The story could not be deleted. Please try again.');
            }
        });
        setDetailOpen(false);
    };

    // Triage is repetitive, so it gets keys. Ignored while typing in a field or
    // while a dialog holds focus.
    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            if (target?.closest('input, textarea, [contenteditable], [role=dialog]')) {
                if (event.key === 'Escape') target.blur?.();
                return;
            }
            if (event.metaKey || event.ctrlKey || event.altKey) return;

            switch (event.key) {
                case 'j':
                case 'ArrowDown':
                    event.preventDefault();
                    move(1);
                    break;
                case 'k':
                case 'ArrowUp':
                    event.preventDefault();
                    move(-1);
                    break;
                case 'a':
                    moderate('approved');
                    break;
                case 'r':
                    moderate('rejected');
                    break;
                case '/':
                    event.preventDefault();
                    searchRef.current?.focus();
                    break;
            }
        };

        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    });

    return (
        <div className="flex min-h-0 flex-1 gap-4">
            {/* List rail */}
            <div
                className={cn(
                    'flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card lg:max-w-[23rem] lg:flex-none',
                    detailOpen && 'hidden lg:flex',
                )}
            >
                <div className="shrink-0 border-b border-border p-3">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search
                                className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
                                aria-hidden="true"
                            />
                            <Input
                                ref={searchRef}
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search stories by name, contact or content…"
                                aria-label="Search stories"
                                className="h-9 pr-8 pl-8"
                            />
                            {query ? (
                                <button
                                    type="button"
                                    onClick={() => setQuery('')}
                                    aria-label="Clear search"
                                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="size-3.5" aria-hidden="true" />
                                </button>
                            ) : null}
                        </div>

                        {/* Category filter — status already has the pill bar above,
                            so this narrows by what the story is about. */}
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={<Button variant="outline" size="icon-sm" />}
                                aria-label="Filter by category"
                                className={cn(
                                    'size-9 shrink-0',
                                    category !== 'all' &&
                                        'border-[#4f7cff]/50 text-[#8fb0ff]',
                                )}
                            >
                                <SlidersHorizontal aria-hidden="true" />
                            </DropdownMenuTrigger>
                            {/* `w-auto` undoes the component's default
                                `w-(--anchor-width)`, which sizes the popup to the
                                trigger — here a 36px icon button, so every label
                                wrapped onto two lines. */}
                            <DropdownMenuContent
                                align="end"
                                className="w-auto min-w-48"
                            >
                                <DropdownMenuRadioGroup
                                    value={category}
                                    onValueChange={setCategory}
                                >
                                    <DropdownMenuRadioItem
                                        value="all"
                                        className="whitespace-nowrap"
                                    >
                                        All categories
                                    </DropdownMenuRadioItem>
                                    {categoryNames.map((option) => (
                                        <DropdownMenuRadioItem
                                            key={option}
                                            value={option}
                                            className="whitespace-nowrap"
                                        >
                                            {option}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                </div>

                <ul className="min-h-0 flex-1 overflow-y-auto p-2">
                    {visible.length === 0 ? (
                        <li className="px-5 py-16 text-center">
                            <Inbox
                                className="mx-auto size-7 text-muted-foreground"
                                aria-hidden="true"
                            />
                            <p className="mt-3 text-sm font-medium">
                                {query ? 'Nothing matches that search' : 'Nothing here'}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {query
                                    ? 'Try a different word, or clear the search.'
                                    : 'New submissions will appear in this list.'}
                            </p>
                        </li>
                    ) : (
                        visible.map((story) => {
                            const active = selected?.id === story.id;
                            const name = story.isAnonymous
                                ? 'Anonymous'
                                : (story.name ?? 'Name not given');

                            return (
                                <li key={story.id}>
                                    <button
                                        type="button"
                                        aria-current={active ? 'true' : undefined}
                                        onClick={() => {
                                            setSelectedId(story.id);
                                            setDetailOpen(true);
                                        }}
                                        className={cn(
                                            'w-full rounded-lg border p-3 text-left transition-colors',
                                            active
                                                ? 'border-[#4f7cff]/60 bg-[#4f7cff]/10'
                                                : 'border-transparent hover:bg-muted/50',
                                        )}
                                    >
                                        <div className="flex gap-2.5">
                                            <Avatar className="mt-0.5 size-8">
                                                <AvatarFallback
                                                    className={cn(
                                                        'text-[11px] font-medium',
                                                        story.isAnonymous
                                                            ? 'bg-muted text-muted-foreground'
                                                            : avatarTint(name),
                                                    )}
                                                >
                                                    {story.isAnonymous ? (
                                                        <ShieldCheck
                                                            className="size-3.5"
                                                            aria-hidden="true"
                                                        />
                                                    ) : (
                                                        initials(name)
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="truncate text-[13px] font-semibold">
                                                        {name}
                                                    </span>
                                                    <span
                                                        suppressHydrationWarning
                                                        className="ml-auto flex shrink-0 items-center gap-1 text-[11px] whitespace-nowrap text-muted-foreground"
                                                    >
                                                        <Clock
                                                            className="size-3"
                                                            aria-hidden="true"
                                                        />
                                                        {relativeTime(
                                                            story.createdAt,
                                                            now,
                                                        )}
                                                    </span>
                                                </div>

                                                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                                    {story.story}
                                                </p>

                                                <div className="mt-2 flex items-center gap-1.5">
                                                    <span
                                                        className={cn(
                                                            'inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium',
                                                            categoryStyle(
                                                                categoryColors[
                                                                    story.category
                                                                ],
                                                            ),
                                                        )}
                                                    >
                                                        {story.category}
                                                    </span>
                                                    <span
                                                        className={cn(
                                                            'ml-auto inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium capitalize',
                                                            STATUS_STYLE[story.status],
                                                        )}
                                                    >
                                                        {story.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                </li>
                            );
                        })
                    )}
                </ul>
            </div>

            {/* Reading pane */}
            <div
                className={cn(
                    'min-w-0 flex-1 overflow-hidden rounded-xl border border-border bg-card lg:block',
                    detailOpen ? 'block' : 'hidden',
                )}
            >
                {selected ? (
                    <StoryDetail
                        // Remounting on selection resets the pane's own state
                        // (scroll position, open dialog) between stories.
                        key={selected.id}
                        story={selected}
                        now={now}
                        categoryColors={categoryColors}
                        isPending={isPending}
                        error={error}
                        onModerate={moderate}
                        onDelete={remove}
                        onBack={() => setDetailOpen(false)}
                    />
                ) : (
                    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                        <Inbox
                            className="size-8 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <p className="mt-4 font-medium">Nothing selected</p>
                        <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
                            Choose a submission from the list to read it in full.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
