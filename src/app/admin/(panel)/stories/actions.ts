'use server';

import { revalidatePath } from 'next/cache';
import { isValidObjectId } from 'mongoose';

import { requireSession } from '@/lib/admin/auth';
import { connectToDatabase } from '@/lib/db/mongoose';
import { StoryModel } from '@/lib/db/models/story';
import { STORY_STATUSES, type StoryStatus } from '@/lib/stories';

/**
 * Moderation actions for the story queue.
 *
 * `requireSession()` is called inside each one, not just in the panel layout:
 * a Server Action is a POST endpoint of its own, so the layout guard does
 * nothing to stop a request that never renders the layout.
 */

export async function setStoryStatus(id: string, status: StoryStatus) {
    await requireSession();

    if (!isValidObjectId(id)) {
        throw new Error('That story id is not valid.');
    }

    if (!STORY_STATUSES.includes(status)) {
        throw new Error(`Unknown story status: ${status}`);
    }

    await connectToDatabase();
    await StoryModel.findByIdAndUpdate(id, { status });

    revalidatePath('/admin/stories');
}

export async function deleteStory(id: string) {
    await requireSession();

    if (!isValidObjectId(id)) {
        throw new Error('That story id is not valid.');
    }

    await connectToDatabase();
    await StoryModel.findByIdAndDelete(id);

    revalidatePath('/admin/stories');
}
