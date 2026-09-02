import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPost, posts } from '@/lib/posts';

export function generateStaticParams() {
    return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
    props: PageProps<'/blog/[slug]'>
): Promise<Metadata> {
    const { slug } = await props.params;
    const post = getPost(slug);

    if (!post) return { title: 'Article not found — RVJP' };

    return {
        title: `${post.title} — RVJP`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
            siteName: 'RVJP',
            images: [{ url: post.hero, alt: post.alt }],
        },
    };
}

export default async function ArticlePage(props: PageProps<'/blog/[slug]'>) {
    const { slug } = await props.params;
    const post = getPost(slug);

    if (!post) notFound();

    const more = posts.filter((p) => p.slug !== post.slug);

    return (
        <article className="bg-[#0a0a0a] px-6 pb-24 pt-28 font-sans text-[#f5f5f5] lg:px-10">
            <div className="mx-auto max-w-[46rem]">
                <Link
                    href="/blog"
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
                    All articles
                </Link>

                {/* ============ HEADER ============ */}
                <header className="mt-10">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-[rgba(227,6,19,0.3)] bg-[rgba(227,6,19,0.14)] px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-[#e30613]">
                            {post.category}
                        </span>
                        <span className="text-[0.7rem] uppercase tracking-[0.14em] text-[#5c5854]">
                            {post.readTime}
                        </span>
                    </div>

                    <h1 className="font-display mt-6 text-[clamp(2rem,6vw,2.6rem)] uppercase leading-[1.02] lg:text-[clamp(2.4rem,3.4vw,3.2rem)]">
                        {post.title}
                    </h1>

                    <p className="mt-6 text-lg leading-relaxed text-[#b6b2af]">
                        {post.excerpt}
                    </p>

                    <p className="mt-8 border-t border-white/[0.09] pt-5 text-[0.8rem] text-[#9a9693]">
                        <strong className="font-bold text-[#f5f5f5]">{post.author}</strong>
                        {' · '}
                        {post.date}
                    </p>
                </header>
            </div>

            {/* ============ HERO ============ */}
            <div className="mx-auto mt-12 max-w-[64rem] overflow-hidden rounded-[22px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={post.hero}
                    alt={post.alt}
                    className="aspect-[16/9] w-full object-cover"
                />
            </div>

            {/* ============ BODY ============ */}
            <div className="mx-auto mt-14 max-w-[42rem]">
                {post.body.map((paragraph, i) => (
                    <p
                        key={i}
                        className="mb-6 text-[1.05rem] leading-[1.8] text-[#c9c5c2]"
                    >
                        {paragraph}
                    </p>
                ))}

                {/* ============ CTA ============ */}
                <div className="mt-14 border-t border-white/[0.09] pt-10">
                    <h2 className="font-display text-2xl uppercase leading-tight">
                        Your story can create change
                    </h2>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-[#9a9693]">
                        Share your experience anonymously, on your own terms. Nothing is
                        published without your consent.
                    </p>
                    <Link
                        href="/shareStory"
                        className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#e30613] px-7 py-3.5 text-[0.75rem] font-extrabold uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:bg-[#ff2733] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    >
                        Share your story
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* ============ MORE ============ */}
            <div className="mx-auto mt-20 max-w-[64rem]">
                <h2 className="mb-6 text-[11px] font-bold uppercase tracking-[0.3em] text-[#e30613]">
                    Keep reading
                </h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {more.map((next) => (
                        <Link
                            key={next.slug}
                            href={`/blog/${next.slug}`}
                            className="group flex flex-col border-t border-white/12 pt-5 transition-colors duration-300 hover:border-[#e30613] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e30613]"
                        >
                            <span className="text-[0.66rem] font-bold uppercase tracking-[0.2em] text-[#e30613]">
                                {next.category}
                            </span>
                            <span className="mt-3 text-[1.05rem] font-extrabold leading-[1.35] transition-colors duration-300 group-hover:text-[#e30613]">
                                {next.title}
                            </span>
                            <span className="mt-2 text-[0.75rem] text-[#5c5854]">
                                {next.author} &middot; {next.readTime}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </article>
    );
}
