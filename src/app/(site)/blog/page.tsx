import type { Metadata } from 'next';
import Link from 'next/link';
import { posts } from '@/lib/posts';

export const metadata: Metadata = {
    title: 'Blog — RVJP',
    description:
        'Reporting, resources, and reflections from the ground — written to inform, not to sensationalize.',
    openGraph: {
        title: 'Blog — RVJP',
        description: 'Stories, guides and updates from the movement.',
        type: 'website',
        locale: 'en_IN',
        siteName: 'RVJP',
    },
};

export default function BlogIndexPage() {
    return (
        <section className="bg-[#0a0a0a] px-6 pb-24 pt-28 font-sans text-[#f5f5f5] lg:px-10">
            <div className="mx-auto max-w-[74rem]">
                <Link
                    href="/"
                    className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#9a9693] transition-colors hover:text-[#f5f5f5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e30613]"
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        aria-hidden="true"
                        className="transition-transform duration-300 ease-out group-hover:-translate-x-1"
                    >
                        <path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back to home
                </Link>

                <header className="mt-10 mb-14 max-w-2xl">
                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#e30613]">
                        Blog
                    </p>
                    <h1 className="font-display mt-5 text-[clamp(2.2rem,7vw,2.8rem)] uppercase leading-[0.98] lg:text-[clamp(2.6rem,3.6vw,3.4rem)]">
                        Stories, guides <span className="text-[#e30613]">&amp; updates</span>
                    </h1>
                    <div className="mt-6 h-1 w-14 bg-[#e30613]" />
                    <p className="mt-6 text-base leading-relaxed text-[#9a9693]">
                        Reporting, resources, and reflections from the ground — written to
                        inform, not to sensationalize.
                    </p>
                </header>

                <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group flex flex-col overflow-hidden rounded-[20px] border border-white/[0.09] bg-[#111] transition-colors duration-300 hover:border-[rgba(227,6,19,0.45)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e30613]"
                        >
                            <span className="relative block aspect-[16/10] overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={post.image}
                                    alt={post.alt}
                                    loading="lazy"
                                    className="h-full w-full object-cover"
                                />
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-0 bg-[linear-gradient(to_top,rgba(17,17,17,0.9),rgba(17,17,17,0.1)_55%)]"
                                />
                                <span className="absolute left-4 top-4 rounded-full border border-[rgba(227,6,19,0.3)] bg-[rgba(10,10,10,0.75)] px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-[#e30613] backdrop-blur-[6px]">
                                    {post.category}
                                </span>
                            </span>

                            <span className="flex flex-1 flex-col p-6">
                                <span className="text-[1.05rem] font-extrabold leading-[1.35] transition-colors duration-300 group-hover:text-[#e30613]">
                                    {post.title}
                                </span>
                                <span className="mt-3 flex-1 text-[0.86rem] leading-[1.6] text-[#9a9693]">
                                    {post.excerpt}
                                </span>
                                <span className="mt-5 border-t border-white/[0.09] pt-4 text-[0.74rem] text-[#5c5854]">
                                    {post.author} &middot; {post.date} &middot; {post.readTime}
                                </span>
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
