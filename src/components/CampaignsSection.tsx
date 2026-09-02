'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    MarkerWords,
    addMarkerStroke,
    hideMarkerText,
    type Segment,
} from '@/components/marker-text';
import { campaigns, type CampaignStatus } from '@/lib/campaigns';

gsap.registerPlugin(ScrollTrigger);

const heading: Segment[] = [
    { text: 'Latest' },
    { text: 'campaigns', className: 'text-[#e30613]' },
];

const statusTone: Record<CampaignStatus, string> = {
    Active: 'border-[rgba(227,6,19,0.45)] bg-[rgba(227,6,19,0.14)] text-[#e30613]',
    Ongoing: 'border-white/20 bg-white/[0.06] text-[#f5f5f5]',
    Upcoming: 'border-white/12 bg-transparent text-[#9a9693]',
};

export default function CampaignsSection() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const headingRef = useRef<HTMLHeadingElement | null>(null);

    /** Which panel is expanded on desktop. Below lg every panel is open. */
    const [open, setOpen] = useState(0);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: { ease: 'power3.out' },
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 72%',
                    once: true,
                },
            });

            tl.from('.cp-eyebrow', { opacity: 0, y: 14, duration: 0.6 }, 0);

            if (headingRef.current) {
                hideMarkerText(headingRef.current);
                addMarkerStroke(tl, headingRef.current, 0.15);
            }

            tl.from('.cp-rule', {
                scaleX: 0,
                transformOrigin: 'left center',
                duration: 0.6,
            }, 0.5)
                .from('.cp-lede', { opacity: 0, y: 16, duration: 0.6 }, 0.55)
                // panels rise like a hand of cards being fanned out
                .from('.cp-panel', {
                    opacity: 0,
                    y: 60,
                    duration: 0.8,
                    stagger: 0.09,
                }, 0.55);
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="campaigns"
            aria-label="Latest campaigns"
            className="relative overflow-hidden bg-[#0a0a0a] px-6 py-24 font-sans text-[#f5f5f5] lg:px-10 lg:py-28"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-40 top-1/4 h-[520px] w-[520px] rounded-full bg-[#e30613]/10 blur-[170px]"
            />

            <div className="relative z-10 mx-auto max-w-[80rem]">
                {/* ============ HEADER ============ */}
                <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="cp-eyebrow flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[#e30613]">
                            <span className="h-1.5 w-1.5 bg-[#e30613]" />
                            On the ground
                        </p>

                        <h2
                            ref={headingRef}
                            className="font-display mt-6 max-w-2xl text-[clamp(2.2rem,7vw,2.9rem)] uppercase leading-[0.96] lg:text-[clamp(2.6rem,3.8vw,3.8rem)]"
                        >
                            <MarkerWords segments={heading} />
                        </h2>

                        <div className="cp-rule mt-6 h-1 w-14 bg-[#e30613]" />

                        <p className="cp-lede mt-6 max-w-lg text-base leading-relaxed text-[#9a9693]">
                            What the movement is actually doing right now — in colleges,
                            district towns, and the streets people walk home on.
                        </p>
                    </div>

                    <p className="hidden shrink-0 items-center gap-2.5 text-[0.66rem] font-bold uppercase tracking-[0.24em] text-[#5c5854] lg:flex">
                        <span className="h-px w-8 bg-[#5c5854]" />
                        Hover to open
                    </p>
                </div>

                {/* ============ ACCORDION ============ */}
                <div className="flex flex-col gap-4 lg:h-[30rem] lg:flex-row lg:gap-3">
                    {campaigns.map((campaign, i) => {
                        const isOpen = open === i;

                        return (
                            <article
                                key={campaign.id}
                                onMouseEnter={() => setOpen(i)}
                                onFocus={() => setOpen(i)}
                                className={`cp-panel group relative min-h-[22rem] overflow-hidden rounded-2xl border border-white/[0.09] transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:min-h-0 ${isOpen ? 'lg:grow-[4]' : 'lg:grow'
                                    }`}
                                style={{ flexBasis: 0 }}
                            >
                                {/* Every panel reads as open below lg, where they stack;
                                   the dimming is a desktop-accordion cue only. */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={campaign.image}
                                    alt={campaign.alt}
                                    loading="lazy"
                                    className={`absolute inset-0 h-full w-full object-cover transition-[filter,opacity] duration-700 ${isOpen ? '' : 'lg:opacity-55 lg:grayscale'
                                        }`}
                                />

                                {/* scrim — heavier when closed so the rail label reads */}
                                <span
                                    aria-hidden="true"
                                    className={`absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,10,0.96),rgba(10,10,10,0.35)_55%,rgba(227,6,19,0.18))] transition-opacity duration-700 ${isOpen
                                        ? ''
                                        : 'lg:bg-[linear-gradient(to_top,rgba(10,10,10,0.96),rgba(10,10,10,0.7))]'
                                        }`}
                                />

                                {/* ---- collapsed rail: index + kicker, turned on its side ---- */}
                                <div
                                    aria-hidden={isOpen}
                                    className={`absolute inset-0 hidden flex-col items-center justify-between py-7 transition-opacity duration-300 lg:flex ${isOpen ? 'pointer-events-none opacity-0' : 'opacity-100 delay-200'
                                        }`}
                                >
                                    <span className="font-mono text-[10px] font-bold tracking-[0.28em] text-[#e30613]">
                                        {campaign.n}
                                    </span>
                                    <span className="font-display whitespace-nowrap text-xl uppercase text-white [writing-mode:vertical-rl]">
                                        {campaign.kicker}
                                    </span>
                                    <span className="h-8 w-px bg-white/25" />
                                </div>

                                {/* ---- open content ---- */}
                                <div
                                    className={`relative flex h-full flex-col justify-end p-7 transition-opacity duration-500 lg:p-8 ${isOpen ? 'opacity-100 lg:delay-200' : 'lg:pointer-events-none lg:opacity-0'
                                        }`}
                                >
                                    <div className="mb-4 flex flex-wrap items-center gap-2.5">
                                        <span
                                            className={`rounded-full border px-3 py-1 text-[0.64rem] font-bold uppercase tracking-[0.14em] ${statusTone[campaign.status]}`}
                                        >
                                            {campaign.status}
                                        </span>
                                        <span className="text-[0.68rem] uppercase tracking-[0.14em] text-white/55">
                                            {campaign.region} &middot; {campaign.period}
                                        </span>
                                    </div>

                                    <h3 className="font-display max-w-md text-[clamp(1.5rem,3.4vw,2.1rem)] uppercase leading-[1.0] text-white">
                                        {campaign.title}
                                    </h3>

                                    <p className="mt-4 max-w-md text-[0.88rem] leading-[1.7] text-[#b6b2af]">
                                        {campaign.description}
                                    </p>

                                    <Link
                                        href="/join"
                                        className="mt-6 inline-flex w-fit items-center gap-2.5 text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-white transition-colors hover:text-[#e30613] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e30613]"
                                    >
                                        Take part
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            aria-hidden="true"
                                            className="text-[#e30613] transition-transform duration-300 ease-out group-hover:translate-x-1"
                                        >
                                            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </Link>
                                </div>

                                {/* A real control, so a closed panel can be opened without
                                    a mouse. Only present while closed — otherwise it would
                                    sit over the open panel and swallow its "Take part" link. */}
                                {!isOpen && (
                                    <button
                                        type="button"
                                        aria-expanded={false}
                                        onClick={() => setOpen(i)}
                                        className="absolute inset-0 hidden lg:block"
                                    >
                                        <span className="sr-only">Open {campaign.title}</span>
                                    </button>
                                )}
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
