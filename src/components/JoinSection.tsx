'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    MarkerWords,
    addMarkerStroke,
    hideMarkerText,
    type Segment,
} from '@/components/marker-text';
import { roles } from '@/lib/join-roles';
import { cn } from '@/lib/utils';
import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage,
} from '@/components/ui/avatar';

gsap.registerPlugin(ScrollTrigger);

const heading: Segment[] = [
    { text: 'Join the' },
    { text: 'movement', className: 'text-[#e30613]' },
];

/**
 * DUMMY PORTRAITS — stock photos of strangers, not RVJP members.
 * Replace with photos of real members who have agreed to appear before launch:
 * on a site about sexual violence, a real stranger's face beside "have already
 * joined" is an association they never consented to.
 *
 * If the image host is unreachable the initials fallback renders instead, so a
 * broken URL never shows as an empty circle.
 */
const members = [
    { initials: 'PS', src: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { initials: 'RM', src: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { initials: 'AK', src: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { initials: 'VT', src: 'https://randomuser.me/api/portraits/men/75.jpg' },
    { initials: 'SR', src: 'https://randomuser.me/api/portraits/women/12.jpg' },
];

export default function JoinSection() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const headingRef = useRef<HTMLHeadingElement | null>(null);

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

            tl.from('.jn-eyebrow', { opacity: 0, y: 14, duration: 0.6 }, 0);

            if (headingRef.current) {
                hideMarkerText(headingRef.current);
                addMarkerStroke(tl, headingRef.current, 0.15);
            }

            tl.from('.jn-rule', {
                scaleX: 0,
                transformOrigin: 'left center',
                duration: 0.6,
            }, 0.5)
                .from('.jn-lede', { opacity: 0, y: 16, duration: 0.6 }, 0.55)
                .from('.jn-row', { opacity: 0, y: 26, duration: 0.6, stagger: 0.09 }, 0.5)
                .from('.jn-avatar', { opacity: 0, scale: 0.6, duration: 0.5, stagger: 0.07 }, 0.7)
                .from('.jn-cta', { opacity: 0, y: 16, duration: 0.6 }, 0.9);
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            aria-label="Join the movement"
            className="relative overflow-hidden bg-[#0a0a0a] px-6 py-24 font-sans text-[#f5f5f5] lg:px-10 lg:py-32"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-40 top-1/3 h-[520px] w-[520px] rounded-full bg-[#e30613]/10 blur-[170px]"
            />

            <div className="relative z-10 mx-auto grid max-w-[1200px] grid-cols-1 gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
                {/* ============ LEFT — the pitch ============ */}
                <div className="lg:self-center">
                    <p className="jn-eyebrow flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[#e30613]">
                        <span className="h-1.5 w-1.5 bg-[#e30613]" />
                        Get involved
                    </p>

                    <h2
                        ref={headingRef}
                        className="font-display mt-6 text-[clamp(2.4rem,7vw,3.2rem)] uppercase leading-[0.95] lg:text-[clamp(2.8rem,3.8vw,4rem)]"
                    >
                        <MarkerWords segments={heading} />
                    </h2>

                    <div className="jn-rule mt-6 h-1 w-14 bg-[#e30613]" />

                    <p className="jn-lede mt-6 max-w-md text-base leading-relaxed text-[#9a9693]">
                        Whether you have five minutes or five hours a week — there&rsquo;s a
                        place for you here. Pick the part that fits your life.
                    </p>

                    {/* social proof — one contained pill, so the faces and the
                        number read as a single statement instead of two loose
                        pieces floating side by side */}
                    {/* `flex w-fit`, not `inline-flex`: the Join button below is
                        itself inline-flex, and two inline boxes in a row sit on the
                        same line on wide screens instead of stacking. */}
                    <div className="mt-10 flex w-fit max-w-full items-center gap-4 rounded-full border border-white/[0.08] bg-white/[0.03] py-1.5 pr-6 pl-1.5">
                        {/* Decorative — the text beside it carries the meaning — so
                            it is hidden from screen readers rather than announcing
                            five unnamed images.

                            The ring colour is the pill's own surface (white at 3%
                            over #0a0a0a ≈ #111), so each face looks cut out of the
                            pill rather than outlined in a mismatched black. */}
                        <AvatarGroup
                            aria-hidden="true"
                            className="-space-x-2.5 *:data-[slot=avatar]:ring-[3px] *:data-[slot=avatar]:ring-[#111]"
                        >
                            {members.map((member, index) => (
                                <Avatar
                                    key={member.src}
                                    size="lg"
                                    className={cn(
                                        // `after:hidden` removes the component's own
                                        // hairline border, which otherwise draws a
                                        // second, lighter edge just inside the ring.
                                        'jn-avatar size-10 after:hidden',
                                        // Five faces plus the text overflow a phone
                                        // width; three still say "a crowd".
                                        index >= 3 && 'max-sm:hidden',
                                    )}
                                >
                                    <AvatarImage src={member.src} alt="" />
                                    <AvatarFallback className="bg-[#222] text-[0.65rem] font-bold text-[#9a9693]">
                                        {member.initials}
                                    </AvatarFallback>
                                </Avatar>
                            ))}

                            {/* Tinted, not solid: a solid red disc reads as a
                                notification badge and fights the red CTA below. */}
                            <AvatarGroupCount className="jn-avatar size-10 bg-[#2a0d0f] text-[0.66rem] font-bold tracking-tight text-[#ff5a63] ring-[3px] ring-[#111]">
                                +1.2k
                            </AvatarGroupCount>
                        </AvatarGroup>

                        <span aria-hidden="true" className="h-8 w-px shrink-0 bg-white/10" />

                        <p className="min-w-0 leading-none">
                            <span className="font-display block text-xl text-[#f5f5f5]">
                                1,200<span className="text-[#e30613]">+</span>
                            </span>
                            <span className="mt-1 block text-xs whitespace-nowrap text-[#9a9693]">
                                people have joined
                            </span>
                        </p>
                    </div>

                    <Link
                        href="/join"
                        className="
              jn-cta group/btn
              relative mt-10 inline-flex w-full shrink-0 items-center justify-center gap-3.5
              whitespace-nowrap
              overflow-hidden
              rounded-full
              bg-[#e30613]
              px-7 py-[0.95rem]
              text-[0.78rem] font-extrabold uppercase tracking-[0.12em] text-white
              transition-[transform,background-color,box-shadow] duration-300 ease-out
              hover:-translate-y-1
              hover:bg-[#f01522]
              hover:shadow-[0_20px_50px_-15px_rgba(227,6,19,0.7)]
              focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white
              active:translate-y-0 active:duration-75
              sm:w-auto
            "
                    >
                        <span className="relative z-10">Join now</span>

                        <span
                            aria-hidden="true"
                            className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15 transition-colors duration-300 group-hover/btn:bg-white/25"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="absolute transition-transform duration-300 ease-out group-hover/btn:translate-x-[180%]">
                                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="absolute -translate-x-[180%] transition-transform duration-300 ease-out group-hover/btn:translate-x-0">
                                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>

                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[250%] -skew-x-[20deg] bg-white/20 transition-transform duration-0 group-hover/btn:translate-x-[420%] group-hover/btn:duration-700 group-hover/btn:ease-out"
                        />
                    </Link>
                </div>

                {/* ============ RIGHT — the ways in ============ */}
                <div className="border-b border-white/[0.09]">
                    {roles.map((role) => (
                        <Link
                            key={role.id}
                            href={`/join?role=${role.id}`}
                            className="
                jn-row group relative flex items-center gap-5
                overflow-hidden border-t border-white/[0.09]
                px-4 py-6 sm:px-6 sm:py-7
                focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#e30613]
              "
                        >
                            {/* the marker language again — red wipes in from the left */}
                            <span
                                aria-hidden="true"
                                className="absolute inset-0 origin-left scale-x-0 bg-[#e30613] transition-transform duration-500 ease-out group-hover:scale-x-100"
                            />

                            <span className="relative z-10 font-mono text-[11px] font-bold tracking-[0.28em] text-[#e30613] transition-colors duration-300 group-hover:text-white/75">
                                {role.n}
                            </span>

                            <span className="relative z-10 flex-1">
                                <span className="font-display block text-2xl uppercase leading-none text-white sm:text-[1.75rem]">
                                    {role.title}
                                </span>
                                <span className="mt-2 block text-xs leading-snug text-[#9a9693] transition-colors duration-300 group-hover:text-white/85 sm:text-[0.8rem]">
                                    {role.note}
                                </span>
                            </span>

                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                aria-hidden="true"
                                className="relative z-10 shrink-0 -translate-x-2 text-white/25 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:text-white"
                            >
                                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
