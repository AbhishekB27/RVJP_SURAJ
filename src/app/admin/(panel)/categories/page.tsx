import { getCategories } from '@/lib/db/categories';

import { CategoryManager } from './category-manager';

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span
                    aria-hidden="true"
                    className="h-6 w-1 rounded-full bg-[#e30613]"
                />
                <h1 className="font-display text-2xl leading-none uppercase sm:text-[1.75rem]">
                    Categories
                </h1>
                <span
                    aria-hidden="true"
                    className="hidden h-4 w-px bg-border sm:block"
                />
                <p className="text-[11px] font-bold tracking-[0.16em] text-muted-foreground uppercase">
                    Story vocabulary
                </p>
            </div>

            <p className="mt-2.5 max-w-2xl text-[13px] text-muted-foreground">
                What someone can file a story under. Changes reach the
                share-your-story form immediately, so keep the list short enough to
                choose from at a glance.
            </p>

            <div className="mt-6 max-w-4xl">
                <CategoryManager categories={categories} />
            </div>
        </div>
    );
}
