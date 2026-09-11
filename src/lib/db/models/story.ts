import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose';

import { MAX_STORY_LENGTH, STORY_STATUSES } from '@/lib/stories';

/**
 * A submission from /shareStory.
 *
 * Privacy note: `name` and `contact` are absent, not empty, on anonymous
 * submissions — the form promises they "won't be stored", so the action must
 * never write them. The schema cannot enforce that on its own, so the rule
 * lives in `submitStory` and is asserted by the validator below.
 */
const StorySchema = new Schema(
    {
        isAnonymous: { type: Boolean, required: true, default: true },

        name: { type: String, trim: true, maxlength: 120 },
        contact: { type: String, trim: true, maxlength: 200 },

        /**
         * Submitter IP, for abuse triage in the admin panel.
         *
         * Note this is recorded for anonymous submissions too — the anonymity
         * promise on the form covers name and contact, not network metadata.
         * Worth saying so in the form copy.
         */
        ip: { type: String, trim: true, maxlength: 64 },

        /**
         * The category *name*, not a reference to the Category row.
         *
         * No `enum` here: the list is managed at /admin/categories and changes
         * at runtime, so a schema-level enum would reject valid new categories
         * and, worse, block saves on stories filed under one since removed.
         * `submitStory` checks the submitted value against the active list.
         */
        category: {
            type: String,
            required: [true, 'Please choose the category that fits best.'],
            trim: true,
            index: true,
        },

        story: {
            type: String,
            required: [true, 'Please write your story before submitting.'],
            trim: true,
            maxlength: [
                MAX_STORY_LENGTH,
                `Stories are limited to ${MAX_STORY_LENGTH} characters.`,
            ],
        },

        // Nothing is public until a human approves it, so new rows start here.
        status: {
            type: String,
            enum: [...STORY_STATUSES],
            default: 'pending',
            index: true,
        },
    },
    { timestamps: true },
);

// Belt and braces on the privacy promise: reject at the schema level too, so a
// future caller that forgets cannot quietly persist identifying details.
StorySchema.pre('validate', async function enforceAnonymity() {
    if (this.isAnonymous && (this.name || this.contact)) {
        throw new Error('An anonymous story must not carry a name or contact.');
    }
});

// The admin list is "newest first, optionally filtered by status".
StorySchema.index({ status: 1, createdAt: -1 });

export type Story = InferSchemaType<typeof StorySchema>;

/**
 * `models.Story ??` matters in dev: hot reload re-runs this module, and
 * calling `model()` twice for one name throws OverwriteModelError.
 */
export const StoryModel: Model<Story> =
    (models.Story as Model<Story>) ?? model<Story>('Story', StorySchema);
