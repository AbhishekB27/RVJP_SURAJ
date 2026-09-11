/**
 * Shared story vocabulary.
 *
 * Deliberately free of any mongoose import: the share-story form is a client
 * component, and importing the model there would pull the driver into the
 * browser bundle. Model and form both import from here instead, so the
 * category list cannot drift between what is offered and what is accepted.
 */

/**
 * Categories are rows in the database now, managed at /admin/categories, so
 * this is a plain string rather than a union of fixed literals. The list a
 * submission is checked against comes from `getActiveCategoryNames()`; the
 * colour for a given name comes from `getCategoryColors()`.
 */
export type StoryCategory = string;

export const STORY_STATUSES = ['pending', 'approved', 'rejected'] as const;

export type StoryStatus = (typeof STORY_STATUSES)[number];

export const MAX_STORY_LENGTH = 3000;

/**
 * What `submitStory` hands back. It lives here rather than beside the action
 * because a `'use server'` module may only export async functions.
 */
export interface StoryFormState {
    status: 'success' | 'error';
    error: string | null;
}

/** A story as it crosses the server/client boundary — no ObjectId, no Date. */
export interface StoryDTO {
    id: string;
    isAnonymous: boolean;
    name: string | null;
    contact: string | null;
    category: StoryCategory;
    story: string;
    status: StoryStatus;
    ip: string | null;
    createdAt: string;
}
