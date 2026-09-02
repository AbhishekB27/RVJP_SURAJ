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
import { roles } from '@/lib/join-roles';

const heading: Segment[] = [
    { text: 'Join the' },
    { text: 'movement', className: 'text-[#e30613]' },
];

const commitments = [
    'A few hours a month',
    'A few hours a week',
    'Weekends',
    'Flexible — ask me',
];

const nextSteps = [
    {
        n: '01',
        title: 'We read it',
        note: 'Every form is read by a person, not sorted by a script.',
    },
    {
        n: '02',
        title: 'A coordinator gets in touch',
        note: 'Usually by email first, so you can reply on your own time.',
    },
    {
        n: '03',
        title: 'You meet your local team',
        note: 'No commitment until you have seen what the work actually looks like.',
    },
];

const FIELD =
    'w-full rounded-xl border border-white/[0.1] bg-[#0a0a0a] px-4 py-3.5 text-sm text-[#f5f5f5] transition-colors placeholder:text-[#5c5854] focus:border-[#e30613] focus:outline-none';

const RING =
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e30613]';

const LABEL = 'mb-2 block text-xs font-bold uppercase tracking-wide';

export default function JoinForm({ initialRole }: { initialRole?: string }) {
    const sectionRef = useRef<HTMLElement | null>(null);
    const headingRef = useRef<HTMLHeadingElement | null>(null);
    const formRef = useRef<HTMLDivElement | null>(null);

    const [role, setRole] = useState<string | null>(initialRole ?? null);
    const [commitment, setCommitment] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.from('.jn-back', { opacity: 0, x: -12, duration: 0.5 }, 0)
                .from('.jn-eyebrow', { opacity: 0, y: 14, duration: 0.6 }, 0.1);

            if (headingRef.current) {
                hideMarkerText(headingRef.current);
                addMarkerStroke(tl, headingRef.current, 0.25);
            }

            tl.from('.jn-rule', {
                scaleX: 0,
                transformOrigin: 'left center',
                duration: 0.6,
            }, 0.6)
                .from('.jn-lede', { opacity: 0, y: 16, duration: 0.6 }, 0.65)
                .from('.jn-role', { opacity: 0, y: 24, duration: 0.6, stagger: 0.08 }, 0.75)
                .from(formRef.current, { opacity: 0, y: 30, duration: 0.7 }, 0.95)
                .from('.jn-step', { opacity: 0, y: 20, duration: 0.6, stagger: 0.08 }, 1.1);
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // the browser covers the text inputs via `required`; the role tiles are
        // not native controls, so they are checked here
        if (!role) {
            setError('Pick the part you would like to take on.');
            return;
        }

        setError(null);
        setSubmitted(true);
    };

    if (submitted) {
        const chosen = roles.find((r) => r.id === role);

        return (
            <section className="flex min-h-dvh items-center bg-[#0a0a0a] px-6 py-28 font-sans text-[#f5f5f5]">
                <div role="status" className="mx-auto max-w-xl text-center">
                    <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(227,6,19,0.4)] bg-[rgba(227,6,19,0.14)] text-[#e30613]">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>

                    <h1 className="font-display text-[clamp(1.9rem,5vw,2.6rem)] uppercase leading-[1.02]">
                        You&rsquo;re in
                    </h1>

                    <p className="mx-auto mt-5 max-w-md text-[0.95rem] leading-relaxed text-[#9a9693]">
                        Thank you for signing up
                        {chosen ? (
                            <>
                                {' '}as{' '}
                                <span className="font-semibold text-[#f5f5f5]">
                                    {chosen.title.toLowerCase()}
                                </span>
                            </>
                        ) : null}
                        . A coordinator will be in touch — nothing is expected of you until
                        you have seen what the work looks like.
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
            aria-label="Join RVJP"
            className="bg-[#0a0a0a] px-6 pb-24 pt-28 font-sans text-[#f5f5f5] lg:px-10"
        >
            <div className="mx-auto max-w-[64rem]">
                <Link
                    href="/"
                    className={`jn-back group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#9a9693] transition-colors hover:text-[#f5f5f5] ${RING}`}
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
                    <p className="jn-eyebrow flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[#e30613]">
                        <span className="h-1.5 w-1.5 bg-[#e30613]" />
                        Get involved
                    </p>

                    <h1
                        ref={headingRef}
                        className="font-display mt-6 text-[clamp(2.4rem,7vw,3.2rem)] uppercase leading-[0.95] lg:text-[clamp(2.8rem,4vw,4rem)]"
                    >
                        <MarkerWords segments={heading} />
                    </h1>

                    <div className="jn-rule mt-6 h-1 w-14 bg-[#e30613]" />

                    <p className="jn-lede mt-6 text-base leading-relaxed text-[#9a9693]">
                        Whether you have five minutes or five hours a week — there&rsquo;s a
                        place for you here. Tell us which part fits, and we&rsquo;ll take it
                        from there.
                    </p>
                </header>

                {/* ============ PICK A PART ============ */}
                <fieldset className="mt-14">
                    <legend className="mb-6 flex items-baseline gap-3">
                        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#e30613]">
                            Pick your part
                        </span>
                        <span className="text-[0.72rem] text-[#5c5854]">
                            You can change this later
                        </span>
                    </legend>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {roles.map((r) => {
                            const active = role === r.id;

                            return (
                                <button
                                    type="button"
                                    key={r.id}
                                    aria-pressed={active}
                                    onClick={() => {
                                        setRole(r.id);
                                        setError(null);
                                    }}
                                    className={`jn-role relative overflow-hidden rounded-2xl border p-6 text-left transition-colors duration-300 ${RING} ${active
                                        ? 'border-[rgba(227,6,19,0.55)] bg-[rgba(227,6,19,0.1)]'
                                        : 'border-white/[0.1] bg-[#101010] hover:border-[rgba(227,6,19,0.35)]'
                                        }`}
                                >
                                    <span className="flex items-start justify-between gap-4">
                                        <span className="font-mono text-[10px] font-bold tracking-[0.28em] text-[#e30613]">
                                            {r.n}
                                        </span>

                                        {/* selection tick */}
                                        <span
                                            aria-hidden="true"
                                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${active
                                                ? 'border-[#e30613] bg-[#e30613] text-white'
                                                : 'border-white/20 text-transparent'
                                                }`}
                                        >
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                    </span>

                                    <span className="font-display mt-4 block text-2xl uppercase leading-none text-white">
                                        {r.title}
                                    </span>

                                    <span className="mt-3 block text-[0.85rem] leading-snug text-[#9a9693]">
                                        {r.note}
                                    </span>

                                    <span
                                        className={`mt-3 block overflow-hidden text-[0.8rem] leading-relaxed text-[#7d7975] transition-all duration-300 ${active ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                                            }`}
                                    >
                                        {r.detail}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {error && (
                        <p role="alert" className="mt-4 text-xs font-semibold text-[#ff5a63]">
                            {error}
                        </p>
                    )}
                </fieldset>

                {/* ============ FORM ============ */}
                <div
                    ref={formRef}
                    className="mt-10 rounded-3xl bg-gradient-to-br from-[rgba(227,6,19,0.3)] via-[rgba(255,255,255,0.06)] to-transparent p-[1.5px]"
                >
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-7 rounded-[22.5px] bg-gradient-to-br from-[#131313] to-[#0d0d0d] p-6 sm:p-10"
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
                            <div>
                                {/* hint stays inline — a second line here would push
                                    this input below its partner in the same row */}
                                <label htmlFor="phone" className={LABEL}>
                                    Phone{' '}
                                    <span className="font-normal normal-case tracking-normal text-[#5c5854]">
                                        (optional)
                                    </span>
                                </label>
                                <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="Mobile number" className={FIELD} />
                            </div>
                            <div>
                                <label htmlFor="city" className={LABEL}>City &amp; state</label>
                                <input id="city" name="city" type="text" required autoComplete="address-level2" placeholder="e.g. Nagpur, MH" className={FIELD} />
                            </div>
                        </div>

                        {/* Commitment */}
                        <div>
                            <span className={LABEL}>
                                Time you can give
                                <small className="mt-0.5 block text-xs font-normal normal-case tracking-normal text-[#9a9693]">
                                    An estimate is fine — nobody is held to it
                                </small>
                            </span>
                            <div className="flex flex-wrap gap-2.5">
                                {commitments.map((option) => (
                                    <button
                                        type="button"
                                        key={option}
                                        aria-pressed={commitment === option}
                                        onClick={() => setCommitment(option)}
                                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${RING} ${commitment === option
                                            ? 'border-[rgba(227,6,19,0.5)] bg-[rgba(227,6,19,0.14)] text-[#e30613]'
                                            : 'border-white/[0.1] bg-[#0a0a0a] text-[#9a9693] hover:border-[rgba(227,6,19,0.4)] hover:text-[#f5f5f5]'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="message" className={LABEL}>
                                Anything you&rsquo;d like us to know
                                <small className="mt-0.5 block text-xs font-normal normal-case tracking-normal text-[#9a9693]">
                                    Optional — skills, availability, questions
                                </small>
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                maxLength={1000}
                                placeholder="Tell us a little about yourself..."
                                className={`${FIELD} min-h-[8rem] resize-y leading-relaxed`}
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
                                I&rsquo;m happy for RVJP to contact me about volunteering.
                                My details won&rsquo;t be shared with anyone else.
                            </span>
                        </label>

                        <button
                            type="submit"
                            className={`w-full rounded-xl bg-[#e30613] px-8 py-4 text-sm font-extrabold uppercase tracking-wide text-white transition-colors duration-300 hover:bg-[#ff2733] ${RING}`}
                        >
                            Count me in
                        </button>
                    </form>
                </div>

                {/* ============ WHAT HAPPENS NEXT ============ */}
                <div className="mt-16">
                    <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.3em] text-[#e30613]">
                        What happens next
                    </p>

                    <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
                        {nextSteps.map((step) => (
                            <div key={step.n} className="jn-step border-t border-white/12 pt-5">
                                <span className="font-mono text-[10px] font-bold tracking-[0.28em] text-[#e30613]">
                                    {step.n}
                                </span>
                                <strong className="mt-3 block text-[0.95rem] font-bold text-[#f5f5f5]">
                                    {step.title}
                                </strong>
                                <span className="mt-1.5 block text-[0.82rem] leading-snug text-[#9a9693]">
                                    {step.note}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
