import type { CategoryColor } from '@/lib/categories';
import type { StoryStatus } from '@/lib/stories';

/**
 * Category and status colours, shared by the filter bar, the list rail and the
 * detail pane so a row and its open story never disagree.
 *
 * These are literal Tailwind classes rather than generated strings on purpose:
 * Tailwind scans source text, so `bg-${colour}-500/10` would compile to nothing.
 */
export const STATUS_STYLE: Record<StoryStatus, string> = {
    pending: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    approved: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    rejected: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
};

export const STATUS_DOT: Record<StoryStatus, string> = {
    pending: 'bg-amber-400',
    approved: 'bg-emerald-400',
    rejected: 'bg-rose-400',
};

/**
 * Category colours live in the database now (managed at /admin/categories), so
 * they arrive as a name → colour-token map and are resolved through
 * `categoryStyle`. A story filed under a category since deleted resolves to the
 * neutral fallback rather than throwing.
 */
export type CategoryColorMap = Record<string, CategoryColor>;

/** Deterministic avatar tint, so the same person keeps the same colour. */
const AVATAR_TINTS = [
    'bg-violet-500/15 text-violet-300',
    'bg-sky-500/15 text-sky-300',
    'bg-emerald-500/15 text-emerald-300',
    'bg-amber-500/15 text-amber-300',
    'bg-rose-500/15 text-rose-300',
    'bg-cyan-500/15 text-cyan-300',
];

export function avatarTint(seed: string): string {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
        hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return AVATAR_TINTS[hash % AVATAR_TINTS.length];
}

export function initials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}
