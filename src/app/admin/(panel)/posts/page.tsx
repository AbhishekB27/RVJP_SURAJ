import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { SectionPlaceholder } from '@/components/admin/section-placeholder';

export default function BlogPage() {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <SectionPlaceholder title="Blog" />

            <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-xl bg-[#e30613] px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#ff2733] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e30613]"
            >
                Go to blog page
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
        </div>
    );
}
