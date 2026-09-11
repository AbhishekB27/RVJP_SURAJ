import { CheckCheck, Clock } from 'lucide-react';

import { getCategories, getCategoryColors } from '@/lib/db/categories';
import { connectToDatabase } from '@/lib/db/mongoose';
import { StoryModel } from '@/lib/db/models/story';
import {
    STORY_STATUSES,
    type StoryCategory,
    type StoryDTO,
    type StoryStatus,
} from '@/lib/stories';

import { StoryFilterTabs } from './story-filter-tabs';
import { StoryInbox } from './story-inbox';

const FILTERS = ['all', ...STORY_STATUSES] as const;
type Filter = (typeof FILTERS)[number];

function isFilter(value: string | undefined): value is Filter {
    return !!value && (FILTERS as readonly string[]).includes(value);
}

export default async function StoriesPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string | string[] }>;
}) {
    const raw = (await searchParams).status;
    const requested = Array.isArray(raw) ? raw[0] : raw;
    const filter: Filter = isFilter(requested) ? requested : 'all';

    await connectToDatabase();

    // One round trip for the list, one for the tab counts, and the category
    // vocabulary the filter and the badges are drawn from.
    const [documents, grouped, categoryColors, categories] = await Promise.all([
        StoryModel.find(filter === 'all' ? {} : { status: filter })
            .sort({ createdAt: -1 })
            .limit(200)
            .lean(),
        StoryModel.aggregate<{ _id: StoryStatus; count: number }>([
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
        getCategoryColors(),
        getCategories({ activeOnly: true }),
    ]);

    const counts = grouped.reduce<Record<string, number>>(
        (acc, row) => ({ ...acc, [row._id]: row.count }),
        {},
    );
    counts.all = Object.values(counts).reduce((sum, n) => sum + n, 0);

    // Mongoose documents carry ObjectIds and Dates, neither of which can cross
    // into a Client Component — flatten to plain values here.
    const stories: StoryDTO[] = documents.map((doc) => ({
        id: String(doc._id),
        isAnonymous: doc.isAnonymous,
        name: doc.name ?? null,
        contact: doc.contact ?? null,
        category: doc.category as StoryCategory,
        story: doc.story,
        status: doc.status as StoryStatus,
        ip: doc.ip ?? null,
        createdAt: (doc.createdAt as Date).toISOString(),
    }));

    const pending = counts.pending ?? 0;

    return (
        /* The inbox owns the viewport rather than growing the page: the list and
           the reading pane scroll independently, so neither loses its place.
           Height is what the shell leaves behind — a 4rem header plus its own
           vertical padding.

           `min-h` is the floor. Without it, a short window leaves so little
           after the masthead and filter bar that both panes collapse to a
           couple of rows; past that floor the page scrolls instead. */
        <div className="flex h-[calc(100dvh-4rem-3.5rem)] min-h-[36rem] flex-col lg:h-[calc(100dvh-4rem-4.5rem)]">
            <div className="shrink-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    {/* The display face and the red rule are the panel's own
                        identity — the rest of /admin heads its sections this way. */}
                    <span
                        aria-hidden="true"
                        className="h-6 w-1 rounded-full bg-[#e30613]"
                    />
                    <h1 className="font-display text-2xl leading-none uppercase sm:text-[1.75rem]">
                        Stories
                    </h1>
                    <span
                        aria-hidden="true"
                        className="hidden h-4 w-px bg-border sm:block"
                    />
                    <p className="text-[11px] font-bold tracking-[0.16em] text-muted-foreground uppercase">
                        Moderation queue
                    </p>

                    {/* Pulled out of the sentence: the number is the one thing
                        worth scanning for, and it was buried mid-paragraph. */}
                    {pending > 0 ? (
                        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-400">
                            <Clock className="size-3" aria-hidden="true" />
                            {pending} awaiting review
                        </span>
                    ) : (
                        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
                            <CheckCheck className="size-3" aria-hidden="true" />
                            All caught up
                        </span>
                    )}
                </div>

                <p className="mt-2.5 max-w-2xl text-[13px] text-muted-foreground">
                    Submissions from the share-your-story form. Nothing appears on
                    the public site until it is approved here.
                </p>
            </div>

            <div className="mt-4 shrink-0">
                <StoryFilterTabs filters={FILTERS} active={filter} counts={counts} />
            </div>

            <div className="mt-4 flex min-h-0 flex-1 flex-col">
                {/* Keyed so switching tabs resets selection to the new list's
                    first row instead of holding a story that filtered away. */}
                <StoryInbox
                    key={filter}
                    stories={stories}
                    categoryColors={categoryColors}
                    categoryNames={categories.map((c) => c.name)}
                />
            </div>
        </div>
    );
}
