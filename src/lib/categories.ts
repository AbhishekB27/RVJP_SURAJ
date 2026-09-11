/**
 * Story categories — the vocabulary the share-story form offers and the admin
 * panel filters by. Managed at /admin/categories.
 *
 * Free of any mongoose import: the share-story form is a client component, so
 * anything it imports must not drag the driver into the browser bundle.
 */

/**
 * Colours are stored as tokens, never as class strings.
 *
 * Tailwind compiles by scanning source text, so a class assembled at runtime
 * (`bg-${row.colour}-500/10`) matches nothing and silently renders unstyled.
 * The database holds one of these tokens and the maps below turn it into
 * literal classes that Tailwind can see.
 */
export const CATEGORY_COLORS = [
    'violet',
    'rose',
    'orange',
    'amber',
    'emerald',
    'sky',
    'cyan',
    'slate',
] as const;

export type CategoryColor = (typeof CATEGORY_COLORS)[number];

/** Badge styling — border, tinted fill, readable text. */
export const CATEGORY_COLOR_STYLE: Record<CategoryColor, string> = {
    violet: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
    rose: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    orange: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
    amber: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    sky: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
    cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
    slate: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
};

/** Solid swatch, for the colour picker and list dots. */
export const CATEGORY_COLOR_SWATCH: Record<CategoryColor, string> = {
    violet: 'bg-violet-500',
    rose: 'bg-rose-500',
    orange: 'bg-orange-500',
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-500',
    sky: 'bg-sky-500',
    cyan: 'bg-cyan-500',
    slate: 'bg-slate-500',
};

/** Fallback for a story whose category was renamed or deleted after the fact. */
export const UNKNOWN_CATEGORY_STYLE =
    'border-border bg-muted text-muted-foreground';

export function categoryStyle(
    color: CategoryColor | undefined | null,
): string {
    return color ? CATEGORY_COLOR_STYLE[color] : UNKNOWN_CATEGORY_STYLE;
}

export const MAX_CATEGORY_NAME = 40;

/** A category as it crosses the server/client boundary. */
export interface CategoryDTO {
    id: string;
    name: string;
    color: CategoryColor;
    isActive: boolean;
    order: number;
    /** How many stories currently carry this name. */
    storyCount: number;
}

/**
 * The list the site launched with. Seeded on first read so an empty database
 * still shows a working form, and so existing stories keep a matching colour.
 */
export const DEFAULT_CATEGORIES: Array<{ name: string; color: CategoryColor }> = [
    { name: 'Harassment', color: 'violet' },
    { name: 'Assault', color: 'rose' },
    { name: 'Domestic violence', color: 'orange' },
    { name: 'Workplace misconduct', color: 'sky' },
    { name: 'Online abuse', color: 'cyan' },
    { name: 'Other', color: 'slate' },
];
