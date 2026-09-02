'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import {
    MarkerWords,
    addMarkerStroke,
    hideMarkerText,
    type Segment,
} from '@/components/marker-text';

const heading: Segment[] = [
    { text: 'Talk' },
    { text: 'to us', className: 'text-[#e30613]' },
];

const topics = [
    'General enquiry',
    'Volunteering',
    'Press & media',
    'Legal support',
    'Partnership',
];

/**
 * PLACEHOLDERS — replace with the organisation's real details before launch.
 * The phone is deliberately all zeros so it cannot be mistaken for a live line.
 */
const channels = [
    {
        label: 'General',
        value: 'hello@rvjp.org',
        href: 'mailto:hello@rvjp.org',
        note: 'Anything that does not fit the boxes',
    },
    {
        label: 'Press & media',
        value: 'press@rvjp.org',
        href: 'mailto:press@rvjp.org',
        note: 'Interviews, statements, spokespeople',
    },
    {
        label: 'Phone',
        value: '+91 00000 00000',
        href: null,
        note: 'Weekdays, working hours',
    },
];

const FIELD =
    'w-full rounded-xl border border-white/[0.1] bg-[#0a0a0a] px-4 py-3.5 text-sm text-[#f5f5f5] transition-colors placeholder:text-[#5c5854] focus:border-[#e30613] focus:outline-none';

const RING =
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e30613]';

const LABEL = 'mb-2 block text-xs font-bold uppercase tracking-wide';

export default function ContactForm() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const headingRef = useRef<HTMLHeadingElement | null>(null);
    const formRef = useRef<HTMLDivElement | null>(null);

    const [topic, setTopic] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.from('.ct-back', { opacity: 0, x: -12, duration: 0.5 }, 0)
                .from('.ct-eyebrow', { opacity: 0, y: 14, duration: 0.6 }, 0.1);

            if (headingRef.current) {
                hideMarkerText(headingRef.current);
                addMarkerStroke(tl, headingRef.current, 0.25);
            }

            tl.from('.ct-rule', {
                scaleX: 0,
                transformOrigin: 'left center',
                duration: 0.6,
            }, 0.6)
                .from('.ct-lede', { opacity: 0, y: 16, duration: 0.6 }, 0.65)
                .from('.ct-support', { opacity: 0, y: 20, duration: 0.6 }, 0.75)
                .from(formRef.current, { opacity: 0, y: 30, duration: 0.7 }, 0.85)
                .from('.ct-channel', { opacity: 0, y: 20, duration: 0.6, stagger: 0.08 }, 0.95);
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // the browser covers the text fields via `required`; the chips are not
        // native controls, so they are checked here
        if (!topic) {
            setError('Pick what your message is about.');
            return;
        }

        setError(null);
        setSubmitted(true);
    };

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
                        Message sent
                    </h1>

                    <p className="mx-auto mt-5 max-w-md text-[0.95rem] leading-relaxed text-[#9a9693]">
                        Thank you for writing to us. A person will read this and get back
                        to you — we do not run automated replies.
                    </p>

                    <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            href="/"
                            className={`w-full rounded-xl bg-[#e30613] px-6 py-3 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#ff2733] sm:w-auto ${RING}`}
                        >
                            Back to home
                        </Link>
                        <Link
                            href="/blog"
                            className={`w-full rounded-xl border border-white/[0.14] px-6 py-3 text-xs font-bold uppercase tracking-wide text-[#f5f5f5] transition-colors hover:border-[#e30613] hover:text-[#e30613] sm:w-auto ${RING}`}
                        >
                            Read the blog
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            ref={sectionRef}
            aria-label="Contact RVJP"
            className="bg-[#0a0a0a] px-6 pb-24 pt-28 font-sans text-[#f5f5f5] lg:px-10"
        >
            <div className="mx-auto max-w-[68rem]">
                <Link
                    href="/"
                    className={`ct-back group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#9a9693] transition-colors hover:text-[#f5f5f5] ${RING}`}
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

                {/* ============ HEADER ============ */}
                <header className="mt-12 max-w-2xl">
                    <p className="ct-eyebrow flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[#e30613]">
                        <span className="h-1.5 w-1.5 bg-[#e30613]" />
                        Get in touch
                    </p>

                    <h1
                        ref={headingRef}
                        className="font-display mt-6 text-[clamp(2.4rem,7vw,3.2rem)] uppercase leading-[0.95] lg:text-[clamp(2.8rem,4vw,4rem)]"
                    >
                        <MarkerWords segments={heading} />
                    </h1>

                    <div className="ct-rule mt-6 h-1 w-14 bg-[#e30613]" />

                    <p className="ct-lede mt-6 text-base leading-relaxed text-[#9a9693]">
                        Questions, offers of help, press enquiries, or something that does
                        not fit anywhere else — this reaches a person, not an inbox
                        nobody checks.
                    </p>
                </header>

                {/* Anyone who needs support should not have to work that out from a
                    general contact form. */}
                <div className="ct-support mt-12 rounded-2xl border border-[rgba(227,6,19,0.3)] bg-[rgba(227,6,19,0.07)] p-6 sm:p-7">
                    <p className="text-sm font-bold text-[#f5f5f5]">
                        Looking for support rather than an answer?
                    </p>
                    <p className="mt-2 max-w-2xl text-[0.88rem] leading-relaxed text-[#b6b2af]">
                        If you want to tell us what happened to you, there is a private
                        space for that — you can send it anonymously and nothing is shared
                        without your consent.
                    </p>
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/shareStory"
                            className={`w-full rounded-xl bg-[#e30613] px-6 py-3 text-center text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#ff2733] sm:w-auto ${RING}`}
                        >
                            Share your story
                        </Link>
                        <Link
                            href="/join"
                            className={`w-full rounded-xl border border-white/[0.14] px-6 py-3 text-center text-xs font-bold uppercase tracking-wide text-[#f5f5f5] transition-colors hover:border-[#e30613] hover:text-[#e30613] sm:w-auto ${RING}`}
                        >
                            I want to volunteer
                        </Link>
                    </div>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
                    {/* ============ FORM ============ */}
                    <div
                        ref={formRef}
                        className="rounded-3xl bg-gradient-to-br from-[rgba(227,6,19,0.3)] via-[rgba(255,255,255,0.06)] to-transparent p-[1.5px]"
                    >
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-7 rounded-[22.5px] bg-gradient-to-br from-[#131313] to-[#0d0d0d] p-6 sm:p-9"
                        >
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="name" className={LABEL}>Your name</label>
                                    <input id="name" name="name" type="text" required autoComplete="name" placeholder="Enter your name" className={FIELD} />
                                </div>
                                <div>
                                    <label htmlFor="email" className={LABEL}>Email</label>
                                    <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={FIELD} />
                                </div>
                            </div>

                            <div>
                                {/* hint inline — a second line would push this input below
                                    its partner if the field is ever paired in a row */}
                                <label htmlFor="phone" className={LABEL}>
                                    Phone{' '}
                                    <span className="font-normal normal-case tracking-normal text-[#5c5854]">
                                        (optional)
                                    </span>
                                </label>
                                <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="Mobile number" className={FIELD} />
                            </div>

                            {/* Topic */}
                            <fieldset>
                                <legend className={LABEL}>
                                    What is this about
                                    <small className="mt-0.5 block text-xs font-normal normal-case tracking-normal text-[#9a9693]">
                                        So it reaches the right person first time
                                    </small>
                                </legend>
                                <div className="flex flex-wrap gap-2.5">
                                    {topics.map((option) => (
                                        <button
                                            type="button"
                                            key={option}
                                            aria-pressed={topic === option}
                                            onClick={() => {
                                                setTopic(option);
                                                setError(null);
                                            }}
                                            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${RING} ${topic === option
                                                ? 'border-[rgba(227,6,19,0.5)] bg-[rgba(227,6,19,0.14)] text-[#e30613]'
                                                : 'border-white/[0.1] bg-[#0a0a0a] text-[#9a9693] hover:border-[rgba(227,6,19,0.4)] hover:text-[#f5f5f5]'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                                {error && (
                                    <p role="alert" className="mt-3 text-xs font-semibold text-[#ff5a63]">
                                        {error}
                                    </p>
                                )}
                            </fieldset>

                            <div>
                                <label htmlFor="message" className={LABEL}>Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    maxLength={2000}
                                    placeholder="Tell us what you need..."
                                    className={`${FIELD} min-h-[10rem] resize-y leading-relaxed`}
                                />
                            </div>

                            <label className="flex items-start gap-3 text-sm leading-relaxed text-[#9a9693]">
                                <input
                                    type="checkbox"
                                    name="consent"
                                    required
                                    className={`mt-0.5 h-4 w-4 flex-shrink-0 accent-[#e30613] ${RING}`}
                                />
                                <span>
                                    I&rsquo;m happy for RVJP to reply to me at the details
                                    above. They won&rsquo;t be shared with anyone else.
                                </span>
                            </label>

                            <button
                                type="submit"
                                className={`w-full rounded-xl bg-[#e30613] px-8 py-4 text-sm font-extrabold uppercase tracking-wide text-white transition-colors duration-300 hover:bg-[#ff2733] ${RING}`}
                            >
                                Send message
                            </button>
                        </form>
                    </div>

                    {/* ============ OTHER WAYS ============ */}
                    <aside className="lg:pt-2">
                        <p className="mb-7 text-[11px] font-bold uppercase tracking-[0.3em] text-[#e30613]">
                            Other ways to reach us
                        </p>

                        <div className="space-y-7">
                            {channels.map((channel) => (
                                <div
                                    key={channel.label}
                                    className="ct-channel border-t border-white/12 pt-5"
                                >
                                    <span className="block text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#5c5854]">
                                        {channel.label}
                                    </span>

                                    {channel.href ? (
                                        <a
                                            href={channel.href}
                                            className={`mt-2 block text-[1.05rem] font-bold text-[#f5f5f5] transition-colors hover:text-[#e30613] ${RING}`}
                                        >
                                            {channel.value}
                                        </a>
                                    ) : (
                                        <span className="mt-2 block text-[1.05rem] font-bold text-[#f5f5f5]">
                                            {channel.value}
                                        </span>
                                    )}

                                    <span className="mt-1.5 block text-[0.82rem] leading-snug text-[#9a9693]">
                                        {channel.note}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <p className="mt-10 border-t border-white/12 pt-5 text-[0.82rem] leading-relaxed text-[#5c5854]">
                            Every message is read by a person. If it is urgent and you are
                            in immediate danger, please contact your local emergency
                            services first.
                        </p>
                    </aside>
                </div>
            </div>
        </section>
    );
}
