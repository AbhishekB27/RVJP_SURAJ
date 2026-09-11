import { connectToDatabase } from '@/lib/db/mongoose';
import { CategoryModel } from '@/lib/db/models/category';
import { StoryModel } from '@/lib/db/models/story';
import {
    DEFAULT_CATEGORIES,
    type CategoryColor,
    type CategoryDTO,
} from '@/lib/categories';

/**
 * Seed the launch categories the first time the collection is read.
 *
 * `insertMany` with `ordered: false` plus the unique index makes this safe to
 * race: two concurrent requests both try, the duplicates are rejected, and the
 * collection still ends up with exactly one of each.
 */
async function seedDefaults() {
    if ((await CategoryModel.estimatedDocumentCount()) > 0) return;

    try {
        await CategoryModel.insertMany(
            DEFAULT_CATEGORIES.map((c, index) => ({ ...c, order: index })),
            { ordered: false },
        );
    } catch {
        // Duplicate-key errors here mean another request seeded first, which is
        // the desired end state anyway.
    }
}

/** Categories in display order. Pass `activeOnly` for the public form. */
export async function getCategories(
    { activeOnly = false }: { activeOnly?: boolean } = {},
): Promise<CategoryDTO[]> {
    await connectToDatabase();
    await seedDefaults();

    const [rows, counts] = await Promise.all([
        CategoryModel.find(activeOnly ? { isActive: true } : {})
            .sort({ order: 1, name: 1 })
            .lean(),
        // One grouped count beats a countDocuments() per category.
        StoryModel.aggregate<{ _id: string; count: number }>([
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]),
    ]);

    const byName = new Map(counts.map((row) => [row._id, row.count]));

    return rows.map((row) => ({
        id: String(row._id),
        name: row.name,
        color: row.color as CategoryColor,
        isActive: row.isActive,
        order: row.order,
        storyCount: byName.get(row.name) ?? 0,
    }));
}

/** The names the form is allowed to submit. */
export async function getActiveCategoryNames(): Promise<string[]> {
    await connectToDatabase();
    await seedDefaults();

    const rows = await CategoryModel.find({ isActive: true })
        .sort({ order: 1, name: 1 })
        .select('name')
        .lean();

    return rows.map((row) => row.name);
}

/** Name → colour, for rendering a story's badge. */
export async function getCategoryColors(): Promise<Record<string, CategoryColor>> {
    await connectToDatabase();
    await seedDefaults();

    const rows = await CategoryModel.find().select('name color').lean();

    return Object.fromEntries(
        rows.map((row) => [row.name, row.color as CategoryColor]),
    );
}
