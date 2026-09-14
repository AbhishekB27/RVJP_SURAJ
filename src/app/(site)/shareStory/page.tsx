import { connection } from 'next/server';

import { DEFAULT_CATEGORIES } from '@/lib/categories';
import { getActiveCategoryNames } from '@/lib/db/categories';

import { StoryForm } from './story-form';

/**
 * A thin server shell. The form itself is a Client Component (GSAP, the chip
 * group, the anonymity toggle), so the category list is read here and handed
 * down — a Client Component cannot reach the database, and importing the model
 * there would pull mongoose into the browser bundle.
 */
export default async function ShareStoryPage() {
    // Without this the page uses no request-time API, so `next build` prerenders
    // it — which means connecting to MongoDB during the build, and baking in
    // whatever categories existed at that moment. Categories are edited live
    // from /admin/categories, so the list has to be read per request.
    await connection();

    // A survivor who reaches this page must always get the form. If the
    // database is unreachable the category list falls back to the defaults
    // rather than taking the whole page down with a 500 — submission will
    // still report a failure honestly, but the page itself stays up.
    let categories: string[];
    try {
        categories = await getActiveCategoryNames();
    } catch (error) {
        console.error(
            '[shareStory] could not load categories, falling back to defaults:',
            error,
        );
        categories = DEFAULT_CATEGORIES.map((category) => category.name);
    }

    return <StoryForm categories={categories} />;
}
