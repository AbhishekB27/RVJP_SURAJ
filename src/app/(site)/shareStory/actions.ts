'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { connectToDatabase } from '@/lib/db/mongoose';
import { StoryModel } from '@/lib/db/models/story';
import { getActiveCategoryNames } from '@/lib/db/categories';
import { MAX_STORY_LENGTH, type StoryFormState } from '@/lib/stories';

/**
 * Note: a `'use server'` module may only export async functions. Anything else
 * — a const, an object — is a build error, so the result type lives in
 * `@/lib/stories` and only `submitStory` is exported from here.
 */

function field(formData: FormData, key: string): string {
    const value = formData.get(key);
    return typeof value === 'string' ? value.trim() : '';
}

/**
 * Caller IP, for abuse triage in the admin panel.
 *
 * `x-forwarded-for` is a comma-separated chain of proxies; the client is the
 * first entry. Any hop can forge it, so treat this as a hint, never as proof.
 */
async function callerIp(): Promise<string | undefined> {
    const list = await headers();
    const forwarded = list.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0]?.trim() || undefined;
    return list.get('x-real-ip')?.trim() || undefined;
}

/**
 * Persist a /shareStory submission.
 *
 * Every rule is re-checked here rather than trusted from the form: a Server
 * Action is reachable by direct POST, so the browser-side `required` attributes
 * and chip validation are a convenience for real users, not a guarantee.
 */
export async function submitStory(
    formData: FormData,
): Promise<StoryFormState> {
    const isAnonymous = field(formData, 'isAnonymous') !== 'false';
    const category = field(formData, 'category');
    const story = field(formData, 'story');
    const consent = formData.get('consent');

    if (!consent) {
        return {
            status: 'error',
            error: 'Please confirm you understand how your story will be handled.',
        };
    }

    // Checked against the live list rather than a constant: categories are
    // managed at /admin/categories, and one turned off mid-session must not be
    // accepted just because the open page still shows its chip.
    //
    // This is a database read, so it gets the same handling as the save below.
    // Left bare, an unreachable database made the action throw — the submitter
    // saw a crash instead of the calm "try again" message.
    let allowed: string[];
    try {
        allowed = await getActiveCategoryNames();
    } catch (error) {
        console.error('[submitStory] could not load categories:', error);
        return {
            status: 'error',
            error:
                'We could not save your story just now. Please try again in a moment.',
        };
    }

    if (!allowed.includes(category)) {
        return {
            status: 'error',
            error: 'Please choose the category that fits best.',
        };
    }

    if (!story) {
        return {
            status: 'error',
            error: 'Please write your story before submitting.',
        };
    }

    if (story.length > MAX_STORY_LENGTH) {
        return {
            status: 'error',
            error: `Stories are limited to ${MAX_STORY_LENGTH} characters.`,
        };
    }

    try {
        await connectToDatabase();

        await StoryModel.create({
            isAnonymous,
            // The toggle promises anonymous submissions store no name or
            // contact. The inputs are unmounted when the toggle is on, but a
            // direct POST could still carry them — so they are dropped here.
            ...(isAnonymous
                ? {}
                : {
                      name: field(formData, 'name') || undefined,
                      contact: field(formData, 'contact') || undefined,
                  }),
            category,
            story,
            status: 'pending',
            ip: await callerIp(),
        });
    } catch (error) {
        // The submitter gets a calm, non-technical message; the detail goes to
        // the server log where we can actually act on it.
        console.error('[submitStory] failed to save story:', error);

        return {
            status: 'error',
            error:
                'We could not save your story just now. Please try again in a moment.',
        };
    }

    // So the admin queue shows the new submission on its next visit.
    revalidatePath('/admin/stories');

    return { status: 'success', error: null };
}
