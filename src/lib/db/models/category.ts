import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose';

import { CATEGORY_COLORS, MAX_CATEGORY_NAME } from '@/lib/categories';

/**
 * A story category, managed from /admin/categories.
 *
 * Stories store the category *name*, not a reference to this row. That keeps
 * historical submissions intact when a category is renamed or removed, and it
 * means no migration was needed to introduce this collection. The trade-off is
 * that a rename does not retitle old stories — deliberate, since the label they
 * were filed under is part of the record.
 */
const CategorySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Give the category a name.'],
            trim: true,
            maxlength: [
                MAX_CATEGORY_NAME,
                `Category names are limited to ${MAX_CATEGORY_NAME} characters.`,
            ],
        },

        color: {
            type: String,
            required: true,
            enum: [...CATEGORY_COLORS],
            default: 'slate',
        },

        /** Inactive categories stay on old stories but are no longer offered. */
        isActive: { type: Boolean, default: true },

        /** Display order in the form and the admin filter. */
        order: { type: Number, default: 0 },
    },
    { timestamps: true },
);

/**
 * Case-insensitive uniqueness. Without the collation "Harassment" and
 * "harassment" would both be accepted and then read as two separate filters.
 */
CategorySchema.index(
    { name: 1 },
    { unique: true, collation: { locale: 'en', strength: 2 } },
);

CategorySchema.index({ order: 1 });

export type Category = InferSchemaType<typeof CategorySchema>;

/**
 * `models.Category ??` matters in dev: hot reload re-runs this module, and
 * calling `model()` twice for one name throws OverwriteModelError.
 */
export const CategoryModel: Model<Category> =
    (models.Category as Model<Category>) ??
    model<Category>('Category', CategorySchema);
