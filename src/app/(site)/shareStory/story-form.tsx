'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import {
    MarkerWords,
    addMarkerStroke,
    hideMarkerText,
    type Segment,
} from '@/components/marker-text';
import { submitStory } from './actions';
import { MAX_STORY_LENGTH } from '@/lib/stories';

const heading: Segment[] = [
    { text: 'Share' },
    { text: 'your story', className: 'text-[#e30613]' },
];


const trustPoints = [
    {
        title: 'Confidential',
        note: 'Shared only with your consent',
        path: <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" strokeLinecap="round" strokeLinejoin="round" />,
    },
    {
        title: 'Human reviewed',
        note: 'Read with care, every time',
        path: (
            <>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" strokeLinecap="round" />
            </>
        ),
    },
    {
        title: 'Your control',
        note: 'Edit or remove anytime',
        path: (
            <>
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="9" />
            </>
        ),
    },
];

const FIELD =
    'w-full rounded-xl border border-white/[0.09] bg-[#0a0a0a] px-4 py-3.5 text-sm text-[#f5f5f5] transition-colors placeholder:text-[#5c5854] focus:border-[#e30613] focus:outline-none';

const RING =
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e30613]';

const MAX_STORY = MAX_STORY_LENGTH;

/**
 * The categories come from the server page rather than a constant — they are
 * rows managed at /admin/categories now. `submitStory` re-checks the chosen one
 * against the live list, so a category turned off while this page sat open is
 * rejected rather than trusted.
 */
export function StoryForm({ categories }: { categories: string[] }) {
    const sectionRef = useRef<HTMLElement | null>(null);
    const headRef = useRef<HTMLDivElement | null>(null);
    const headingRef = useRef<HTMLHeadingElement | null>(null);
    const formRef = useRef<HTMLDivElement | null>(null);
    const trustRef = useRef<HTMLDivElement | null>(null);

    const [isAnonymous, setIsAnonymous] = useState(true);
    const [category, setCategory] = useState<string | null>(null);
    const [story, setStory] = useState('');
    const [error, setError] = useState<string | null>(null);
    // Kept apart from `error`, which belongs to the category chips — this one
    // is about the submission itself and renders next to the button.
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Everything here is above the fold, so it plays on load rather than
            // on scroll: back link → headline → promises → form.
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.from('.ss-back', { opacity: 0, x: -12, duration: 0.5 }, 0)
                .from('.ss-eyebrow', { opacity: 0, y: 14, duration: 0.6 }, 0.1);

            // headline is struck word by word, same marker used across the site
            if (headingRef.current) {
                hideMarkerText(headingRef.current);
                addMarkerStroke(tl, headingRef.current, 0.25);
            }

            tl.from('.ss-rule', {
                scaleX: 0,
                transformOrigin: 'center',
                duration: 0.6,
            }, 0.6)
                .from('.ss-lede', { opacity: 0, y: 16, duration: 0.6 }, 0.65);

            if (trustRef.current) {
                tl.from(
                    trustRef.current.children,
                    { opacity: 0, y: 20, duration: 0.6, stagger: 0.1 },
                    0.8
                );
            }

            tl.from(formRef.current, { opacity: 0, y: 40, duration: 0.8 }, 0.95);
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        // the browser handles the empty-story and consent cases via `required`;
        // the chip group is not a native control, so it is checked here
        if (!category) {
            setError('Please choose the category that fits best.');
            return;
        }

        setError(null);
        setSubmitError(null);

        // The chips and the toggle are not form controls, so their values are
        // added by hand rather than picked up from the DOM.
        const formData = new FormData(e.currentTarget);
        formData.set('category', category);
        formData.set('isAnonymous', String(isAnonymous));

        startTransition(async () => {
            const result = await submitStory(formData);

            if (result.status === 'success') {
                setSubmitted(true);
                return;
            }

            setSubmitError(result.error);
        });
    };

    const shareAnother = () => {
        setSubmitted(false);
        setStory('');
        setCategory(null);
        setError(null);
        setSubmitError(null);
    };

    // Confirmation takes over the whole page — the same treatment /join uses,
    // so the two sibling forms end the same way.
    if (submitted) {
        return (
            <section className="flex min-h-dvh items-center bg-[#0a0a0a] px-6 py-28 font-sans text-[#f5f5f5]">
                <div role="status" className="mx-auto max-w-xl text-center">
                    <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(227,6,19,0.4)] bg-[rgba(227,6,19,0.14)] text-[#e30613]">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>

                    <h1 className="font-display text-[clamp(1.9rem,5vw,2.6rem)] uppercase leading-[1.02]">
                        Thank you for trusting us
                    </h1>

                    <p className="mx-auto mt-5 max-w-md text-[0.95rem] leading-relaxed text-[#9a9693]">
                        Your story has been received. Our team reads every submission with
                        care — nothing is published, and you are never identified, without
                        your permission.
                    </p>

                    <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            href="/"
                            className={`w-full rounded-xl bg-[#e30613] px-6 py-3 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#ff2733] sm:w-auto ${RING}`}
                        >
                            Back to home
                        </Link>
                        <button
                            type="button"
                            onClick={shareAnother}
                            className={`w-full rounded-xl border border-white/[0.14] px-6 py-3 text-xs font-bold uppercase tracking-wide text-[#f5f5f5] transition-colors hover:border-[#e30613] hover:text-[#e30613] sm:w-auto ${RING}`}
                        >
                            Share another story
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            ref={sectionRef}
            aria-label="Share your story"
            className="relative min-h-screen overflow-hidden bg-[#0a0a0a] px-6 pb-20 pt-28 font-sans text-[#f5f5f5]"
        >
            <Link
                href="/"
                className={`ss-back group relative z-10 mb-12 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#9a9693] transition-colors hover:text-[#f5f5f5] ${RING}`}
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

            {/* Heading */}
            <div ref={headRef} className="relative z-10 mx-auto mb-12 max-w-2xl text-center">
                <span className="ss-eyebrow mb-4 block text-xs font-bold uppercase tracking-[0.3em] text-[#e30613]">
                    Your voice matters
                </span>
                <h1
                    ref={headingRef}
                    className="font-display mb-4 text-[clamp(2rem,4.2vw,3rem)] uppercase leading-[1.02]"
                >
                    <MarkerWords segments={heading} />
                </h1>
                <div className="ss-rule mx-auto mb-5 h-1 w-14 bg-[#e30613]" />
                <p className="ss-lede text-base leading-relaxed text-[#9a9693]">
                    Whatever happened, however long ago — you decide what to share and how.
                    This space is yours.
                </p>
            </div>

            {/* What we promise — sits above the form so it is read before
                anything is typed, not after */}
            <div
                ref={trustRef}
                // three across only from md — at 640px each box is too narrow for
                // an icon plus two lines of text
                className="relative z-10 mx-auto mb-6 grid max-w-3xl grid-cols-1 gap-3 md:grid-cols-3"
            >
                {trustPoints.map((point) => (
                    <div
                        key={point.title}
                        className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-4"
                    >
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(227,6,19,0.14)] text-[#e30613]">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                {point.path}
                            </svg>
                        </span>
                        <div>
                            <strong className="block text-sm font-bold">{point.title}</strong>
                            <span className="block text-xs leading-snug text-[#9a9693]">
                                {point.note}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Form card */}
            <div
                ref={formRef}
                className="relative z-10 mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-[rgba(227,6,19,0.35)] via-[rgba(255,255,255,0.06)] to-transparent p-[1.5px]"
            >
                <div className="rounded-[22.5px] bg-gradient-to-br from-[#131313] to-[#0d0d0d] p-6 sm:p-10">
                    <form onSubmit={handleSubmit} className="space-y-7">
                            {/* Anonymous toggle */}
                            <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.09] bg-[#0a0a0a] px-5 py-4">
                                <div>
                                    <strong id="anon-label" className="block text-sm font-bold">
                                        Submit anonymously
                                    </strong>
                                    <span id="anon-note" className="mt-0.5 block text-xs text-[#9a9693]">
                                        Your name and contact details won&rsquo;t be stored
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={isAnonymous}
                                    aria-labelledby="anon-label"
                                    aria-describedby="anon-note"
                                    onClick={() => setIsAnonymous((v) => !v)}
                                    className={`relative h-7 w-12 flex-shrink-0 rounded-full border transition-colors ${RING} ${isAnonymous
                                        ? 'border-[rgba(227,6,19,0.5)] bg-[rgba(227,6,19,0.14)]'
                                        : 'border-white/[0.09] bg-[#0a0a0a]'
                                        }`}
                                >
                                    <span
                                        className={`absolute top-1/2 h-[1.15rem] w-[1.15rem] -translate-y-1/2 rounded-full transition-all ${isAnonymous
                                            ? 'left-[1.35rem] bg-[#e30613]'
                                            : 'left-[0.2rem] bg-[#9a9693]'
                                            }`}
                                    />
                                </button>
                            </div>

                            {!isAnonymous && (
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="name" className="mb-2 block text-xs font-bold uppercase tracking-wide">
                                            Your name
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            autoComplete="name"
                                            placeholder="Enter your name"
                                            className={FIELD}
                                        />
                                    </div>
                                    <div>
                                        {/* hint stays inline — a second line here would
                                            push this input below its partner in the row */}
                                        <label htmlFor="contact" className="mb-2 block text-xs font-bold uppercase tracking-wide">
                                            Contact info{' '}
                                            <span className="font-normal normal-case tracking-normal text-[#5c5854]">
                                                (optional)
                                            </span>
                                        </label>
                                        <input
                                            id="contact"
                                            name="contact"
                                            type="text"
                                            autoComplete="email"
                                            placeholder="Email or phone number"
                                            className={FIELD}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Category chips — not native controls, so the group is
                                labelled and validated by hand */}
                            <fieldset>
                                <legend className="mb-2 block text-xs font-bold uppercase tracking-wide">
                                    What happened
                                    <small className="mt-0.5 block text-xs font-normal normal-case tracking-normal text-[#9a9693]">
                                        Choose the category that fits best
                                    </small>
                                </legend>
                                <div className="flex flex-wrap gap-2.5">
                                    {categories.map((cat) => (
                                        <button
                                            type="button"
                                            key={cat}
                                            aria-pressed={category === cat}
                                            onClick={() => {
                                                setCategory(cat);
                                                setError(null);
                                            }}
                                            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${RING} ${category === cat
                                                ? 'border-[rgba(227,6,19,0.5)] bg-[rgba(227,6,19,0.14)] text-[#e30613]'
                                                : 'border-white/[0.09] bg-[#0a0a0a] text-[#9a9693] hover:border-[rgba(227,6,19,0.4)] hover:text-[#f5f5f5]'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                                {error && (
                                    <p role="alert" className="mt-3 text-xs font-semibold text-[#ff5a63]">
                                        {error}
                                    </p>
                                )}
                            </fieldset>

                            {/* Story */}
                            <div>
                                <label htmlFor="story" className="mb-2 block text-xs font-bold uppercase tracking-wide">
                                    Your story
                                    <small className="mt-0.5 block text-xs font-normal normal-case tracking-normal text-[#9a9693]">
                                        Share as much or as little as you&rsquo;re comfortable with
                                    </small>
                                </label>
                                <textarea
                                    id="story"
                                    name="story"
                                    required
                                    value={story}
                                    aria-describedby="story-count"
                                    placeholder="Start writing here..."
                                    maxLength={MAX_STORY}
                                    onChange={(e) => setStory(e.target.value)}
                                    className={`${FIELD} min-h-[11rem] resize-y leading-relaxed`}
                                />
                                <span
                                    id="story-count"
                                    className="mt-1.5 block text-right text-xs text-[#9a9693]"
                                >
                                    {story.length} / {MAX_STORY}
                                </span>
                            </div>

                            <div>
                                <label className="flex items-start gap-3 text-sm leading-relaxed text-[#9a9693]">
                                    <input
                                        type="checkbox"
                                        name="consent"
                                        required
                                        className={`mt-0.5 h-4 w-4 flex-shrink-0 accent-[#e30613] ${RING}`}
                                    />
                                    <span>
                                        I understand this submission will be reviewed by the
                                        team before being shared, and that I can request
                                        removal at any time.
                                    </span>
                                </label>
                            </div>

                            {submitError && (
                                <p
                                    role="alert"
                                    className="rounded-xl border border-[rgba(255,90,99,0.3)] bg-[rgba(255,90,99,0.08)] px-4 py-3 text-sm font-semibold text-[#ff5a63]"
                                >
                                    {submitError}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isPending}
                                className={`w-full rounded-xl bg-[#e30613] px-8 py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-[0_16px_32px_-14px_rgba(227,6,19,0.6)] transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-[#ff2733] hover:shadow-[0_20px_36px_-12px_rgba(227,6,19,0.7)] active:translate-y-0 active:duration-75 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-[#e30613] ${RING}`}
                            >
                                {isPending ? 'Sending…' : 'Submit your story'}
                            </button>
                    </form>
                </div>
            </div>

            {/* Nobody should hit a dead end here if they change their mind */}
            <div className="relative z-10 mx-auto mt-14 max-w-3xl border-t border-white/[0.08] pt-10 text-center">
                <p className="text-sm font-bold text-[#f5f5f5]">
                    Not ready yet? That&rsquo;s completely fine.
                </p>
                <p className="mx-auto mt-2 max-w-md text-[0.85rem] leading-relaxed text-[#9a9693]">
                    There is no deadline on this, and no wrong time. The form will still
                    be here whenever you are.
                </p>

                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                        href="/blog"
                        className={`w-full rounded-xl border border-white/[0.12] px-6 py-3 text-xs font-bold uppercase tracking-wide text-[#f5f5f5] transition-colors hover:border-[#e30613] hover:text-[#e30613] sm:w-auto ${RING}`}
                    >
                        Read other stories
                    </Link>
                    <Link
                        href="/join"
                        className={`w-full rounded-xl border border-white/[0.12] px-6 py-3 text-xs font-bold uppercase tracking-wide text-[#f5f5f5] transition-colors hover:border-[#e30613] hover:text-[#e30613] sm:w-auto ${RING}`}
                    >
                        Get involved another way
                    </Link>
                </div>
            </div>
        </section>
    );
}
