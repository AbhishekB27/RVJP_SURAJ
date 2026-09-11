'use server';

import { revalidatePath } from 'next/cache';
import { isValidObjectId } from 'mongoose';

import { requireSession } from '@/lib/admin/auth';
import { connectToDatabase } from '@/lib/db/mongoose';
import { CategoryModel } from '@/lib/db/models/category';
import { StoryModel } from '@/lib/db/models/story';
import {
    CATEGORY_COLORS,
    MAX_CATEGORY_NAME,
    type CategoryColor,
} from '@/lib/categories';

/**
 * Category management.
 *
 * `requireSession()` runs inside every action, not just in the panel layout: a
 * Server Action is a POST endpoint of its own, so the layout guard does nothing
 * to stop a request that never renders the layout.
 */

export interface CategoryActionState {
    error: string | null;
}

/** Both list pages read categories, and stories render their colours. */
function revalidateAll() {
    revalidatePath('/admin/categories');
    revalidatePath('/admin/stories');
    revalidatePath('/shareStory');
}

function validate(name: string, color: string): string | null {
    if (!name) return 'Give the category a name.';
    if (name.length > MAX_CATEGORY_NAME) {
        return `Category names are limited to ${MAX_CATEGORY_NAME} characters.`;
    }
    if (!CATEGORY_COLORS.includes(color as CategoryColor)) {
        return 'Pick one of the available colours.';
    }
    return null;
}

/** Mongo's duplicate-key error, surfaced as something a person can act on. */
function isDuplicate(error: unknown): boolean {
    return (
        typeof error === 'object' &&
        error !== null &&
        (error as { code?: number }).code === 11000
    );
}

export async function createCategory(
    _prev: CategoryActionState,
    formData: FormData,
): Promise<CategoryActionState> {
    await requireSession();

    const name = String(formData.get('name') ?? '').trim();
    const color = String(formData.get('color') ?? 'slate');

    const invalid = validate(name, color);
    if (invalid) return { error: invalid };

    try {
        await connectToDatabase();

        // New categories go to the end of the list.
        const last = await CategoryModel.findOne().sort({ order: -1 }).select('order').lean();

        await CategoryModel.create({
            name,
            // `validate` above already proved this is one of CATEGORY_COLORS;
            // the cast just carries that through to the schema's enum type.
            color: color as CategoryColor,
            order: (last?.order ?? -1) + 1,
        });
    } catch (error) {
        if (isDuplicate(error)) {
            return { error: `“${name}” already exists.` };
        }
        console.error('[createCategory] failed:', error);
        return { error: 'That could not be saved. Please try again.' };
    }

    revalidateAll();
    return { error: null };
}

/**
 * Colour and availability only. Renaming goes through `renameCategory`, which
 * has to move existing stories as well — keeping the two apart means that
 * rewrite is never an invisible side effect of a colour change.
 */
export async function updateCategory(
    id: string,
    patch: { color?: CategoryColor; isActive?: boolean },
) {
    await requireSession();

    if (!isValidObjectId(id)) throw new Error('That category id is not valid.');

    await connectToDatabase();

    const existing = await CategoryModel.findById(id);
    if (!existing) throw new Error('That category no longer exists.');

    const color = patch.color ?? (existing.color as CategoryColor);

    const invalid = validate(existing.name, color);
    if (invalid) throw new Error(invalid);

    existing.color = color;
    if (patch.isActive !== undefined) existing.isActive = patch.isActive;

    await existing.save();

    revalidateAll();
}

/**
 * Rename, carrying existing stories across.
 *
 * Stories store the category name, so without the second write they would keep
 * the old label — dropping out of their own filter and losing their colour.
 */
export async function renameCategory(id: string, name: string) {
    await requireSession();

    if (!isValidObjectId(id)) throw new Error('That category id is not valid.');

    const trimmed = name.trim();
    await connectToDatabase();

    const existing = await CategoryModel.findById(id);
    if (!existing) throw new Error('That category no longer exists.');

    const invalid = validate(trimmed, existing.color as string);
    if (invalid) throw new Error(invalid);

    const previous = existing.name;
    if (previous === trimmed) return;

    existing.name = trimmed;

    try {
        await existing.save();
    } catch (error) {
        if (isDuplicate(error)) throw new Error(`“${trimmed}” already exists.`);
        throw error;
    }

    await StoryModel.updateMany(
        { category: previous },
        { $set: { category: trimmed } },
    );

    revalidateAll();
}

export async function deleteCategory(id: string) {
    await requireSession();

    if (!isValidObjectId(id)) throw new Error('That category id is not valid.');

    await connectToDatabase();

    const existing = await CategoryModel.findById(id);
    if (!existing) return;

    // Refuse rather than orphan: the stories would keep a label that no longer
    // appears in any filter, so they would effectively vanish from the queue.
    const inUse = await StoryModel.countDocuments({ category: existing.name });
    if (inUse > 0) {
        throw new Error(
            `${inUse} ${inUse === 1 ? 'story uses' : 'stories use'} this category. ` +
                'Turn it off instead — it stays on those stories but is no longer offered.',
        );
    }

    await existing.deleteOne();
    revalidateAll();
}

/** Move a category one place up or down in the offered order. */
export async function moveCategory(id: string, direction: 'up' | 'down') {
    await requireSession();

    if (!isValidObjectId(id)) throw new Error('That category id is not valid.');

    await connectToDatabase();

    const all = await CategoryModel.find().sort({ order: 1, name: 1 });
    const index = all.findIndex((c) => String(c._id) === id);
    if (index === -1) return;

    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= all.length) return;

    // Order values can arrive duplicated or sparse from earlier edits, so the
    // whole list is renumbered from the reordered array rather than swapping
    // two values that might already collide.
    const reordered = [...all];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    await Promise.all(
        reordered.map((doc, position) =>
            CategoryModel.updateOne({ _id: doc._id }, { $set: { order: position } }),
        ),
    );

    revalidateAll();
}
