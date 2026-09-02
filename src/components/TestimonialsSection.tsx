'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import {
    MarkerWords,
    addMarkerStroke,
    hideMarkerText,
    type Segment,
} from '@/components/marker-text';

gsap.registerPlugin(ScrollTrigger);

/** Hypotenuse of the 50px corner cut — the length of the diagonal edge line. */
const SQRT_5000 = Math.sqrt(5000);

const heading: Segment[] = [
    { text: 'What it looks like' },
    { text: 'from the inside', className: 'text-[#e30613]' },
];

/** How long a card holds the middle before the deck advances. */
const AUTO_MS = 4200;

/** Cards that run past the stage fade out instead of being cut off at the edge. */
const EDGE_FADE = {
    maskImage:
        'linear-gradient(to right, transparent, black 14%, black 86%, transparent)',
    WebkitMaskImage:
        'linear-gradient(to right, transparent, black 14%, black 86%, transparent)',
};

interface Testimonial {
    tempId: number;
    quote: string;
    name: string;
    role: string;
    place: string;
}

/**
 * From the people who run the work — deliberately not survivor testimony,
 * which lives in the Stories section and belongs to the people who wrote it.
 * Placeholder copy: review before launch.
 *
 * Kept short on purpose: the card is a fixed square, so long quotes overflow.
 */
const seed: Testimonial[] = [
    {
        tempId: 0,
        quote: 'I came for one afternoon of handing out pamphlets. Four months later I was running the Thursday circle.',
        name: 'Priya',
        role: 'Volunteer coordinator',
        place: 'Nagpur',
    },
    {
        tempId: 1,
        quote: 'As a lawyer you get used to files. Here you meet the person before the paperwork.',
        name: 'Rohan',
        role: 'Advocate, pro-bono network',
        place: 'Lucknow',
    },
    {
        tempId: 2,
        quote: 'You do not need a background in this. You need to sit with someone and not fill the silence.',
        name: 'Anil',
        role: 'Listening rooms facilitator',
        place: 'Haldwani',
    },
    {
        tempId: 3,
        quote: 'We had run awareness drives before. What was different here was that nobody was performing.',
        name: 'Meera',
        role: 'Campus partner',
        place: 'Bhopal',
    },
    {
        tempId: 4,
        quote: 'The training was the opposite of what I expected. Less script, more listening.',
        name: 'Kavita',
        role: 'Counsellor',
        place: 'Indore',
    },
    {
        tempId: 5,
        quote: 'I joined expecting to fetch photocopies. By the third month I was drafting.',
        name: 'Imran',
        role: 'Legal aid volunteer',
        place: 'Nagpur',
    },
    {
        tempId: 6,
        quote: 'We started with five people in a room nobody wanted to book. It is a waiting list now.',
        name: 'Sunita',
        role: 'Community organiser',
        place: 'Jabalpur',
    },
    {
        tempId: 7,
        quote: 'Walking my own street at night with a clipboard changed how I see it.',
        name: 'Deepak',
        role: 'Safe streets volunteer',
        place: 'Bhopal',
    },
    {
        tempId: 8,
        quote: 'I give an hour a week. That is all it ever asked of me, and it has been enough to matter.',
        name: 'Farah',
        role: 'Amplify volunteer',
        place: 'Raipur',
    },
];

function TestimonialCard({
    position,
    item,
    handleMove,
    cardSize,
    onHold,
}: {
    position: number;
    item: Testimonial;
    handleMove: (steps: number) => void;
    cardSize: number;
    /** Holds the auto-advance while a card is being read. */
    onHold: (hold: boolean) => void;
}) {
    const isCenter = position === 0;

    return (
        <div
            // A div rather than a button: the card holds a blockquote, which a
            // button may not contain. Role + key handling keep it operable.
            role="button"
            tabIndex={isCenter ? -1 : 0}
            aria-label={isCenter ? undefined : `Show testimonial from ${item.name}`}
            onClick={() => handleMove(position)}
            onMouseEnter={() => onHold(true)}
            onMouseLeave={() => onHold(false)}
            onFocus={() => onHold(true)}
            onBlur={() => onHold(false)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleMove(position);
                }
            }}
            className={cn(
                // slower and strongly eased-out, so a one-slot advance reads as
                // travel rather than a swap
                // tighter padding on the 290px mobile card, or the quote runs
                // into the attribution pinned at the bottom
                'absolute left-1/2 top-1/2 cursor-pointer border-2 p-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-8',
                'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e30613]',
                isCenter
                    ? 'z-10 border-[#e30613] bg-[#e30613] text-white'
                    : 'z-0 border-white/[0.14] bg-[#121212] text-[#f5f5f5] hover:border-[rgba(227,6,19,0.55)]'
            )}
            style={{
                width: cardSize,
                height: cardSize,
                clipPath:
                    'polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)',
                transform: `
                    translate(-50%, -50%)
                    translateX(${(cardSize / 1.5) * position}px)
                    translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
                    rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
                `,
                boxShadow: isCenter
                    ? '0px 8px 0px 4px rgba(255,255,255,0.1)'
                    : '0px 0px 0px 0px transparent',
            }}
        >
            {/* draws the cut edge across the notched top-right corner */}
            <span
                aria-hidden="true"
                className={cn(
                    'absolute block origin-top-right rotate-45',
                    isCenter ? 'bg-white/40' : 'bg-white/[0.14]'
                )}
                style={{ right: -2, top: 48, width: SQRT_5000, height: 2 }}
            />

            {/* initial tile — stands in for a portrait until real ones exist */}
            <span
                aria-hidden="true"
                className={cn(
                    'mb-4 flex h-14 w-12 items-center justify-center text-xl font-extrabold',
                    isCenter
                        ? 'bg-[#0a0a0a] text-white'
                        : 'bg-[rgba(227,6,19,0.16)] text-[#e30613]'
                )}
                style={{ boxShadow: '3px 3px 0px #0a0a0a' }}
            >
                {item.name.charAt(0)}
            </span>

            <blockquote
                className={cn(
                    'text-[0.95rem] font-medium leading-snug sm:text-lg',
                    isCenter ? 'text-white' : 'text-[#f5f5f5]'
                )}
            >
                &ldquo;{item.quote}&rdquo;
            </blockquote>

            <p
                className={cn(
                    'absolute bottom-6 left-6 right-6 mt-2 text-[0.8rem] italic sm:bottom-8 sm:left-8 sm:right-8 sm:text-sm',
                    isCenter ? 'text-white/80' : 'text-[#9a9693]'
                )}
            >
                &mdash; {item.name}, {item.role} &middot; {item.place}
            </p>
        </div>
    );
}

export default function TestimonialsSection() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const headingRef = useRef<HTMLHeadingElement | null>(null);

    const [cardSize, setCardSize] = useState(365);
    const [list, setList] = useState(seed);
    const [paused, setPaused] = useState(false);

    // Functional update, so this stays stable and the auto-advance effect below
    // does not have to re-subscribe on every list change.
    const handleMove = useCallback((steps: number) => {
        setList((prev) => {
            const next = [...prev];

            if (steps > 0) {
                for (let i = steps; i > 0; i--) {
                    const item = next.shift();
                    if (!item) return prev;
                    next.push({ ...item, tempId: Math.random() });
                }
            } else {
                for (let i = steps; i < 0; i++) {
                    const item = next.pop();
                    if (!item) return prev;
                    next.unshift({ ...item, tempId: Math.random() });
                }
            }

            return next;
        });
    }, []);

    // Auto-advance. Depending on `list` means any move — auto or manual —
    // restarts the clock, so a card always gets its full time in the middle.
    useEffect(() => {
        if (paused) return;

        const id = window.setTimeout(() => handleMove(1), AUTO_MS);
        return () => window.clearTimeout(id);
    }, [list, paused, handleMove]);


    useEffect(() => {
        const updateSize = () => {
            setCardSize(window.matchMedia('(min-width: 640px)').matches ? 365 : 290);
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: { ease: 'power3.out' },
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 75%',
                    once: true,
                },
            });

            tl.from('.tm-badge', { opacity: 0, y: 14, duration: 0.6 }, 0);

            if (headingRef.current) {
                hideMarkerText(headingRef.current);
                addMarkerStroke(tl, headingRef.current, 0.15);
            }

            tl.from('.tm-lede', { opacity: 0, y: 16, duration: 0.6 }, 0.5)
                .from('.tm-stage', { opacity: 0, y: 50, duration: 1 }, 0.55);
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="testimonials"
            aria-labelledby="testimonials-heading"
            className="relative overflow-hidden bg-[#0d0d0d] px-6 pb-16 pt-24 font-sans text-[#f5f5f5] lg:px-10 lg:pt-28"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-40 top-1/3 h-[520px] w-[520px] rounded-full bg-[#e30613]/10 blur-[170px]"
            />

            {/* ============ HEADER ============ */}
            <div className="relative z-10 mx-auto mb-6 flex max-w-[36rem] flex-col items-center text-center">
                <span className="tm-badge rounded-full border border-[rgba(227,6,19,0.35)] bg-[rgba(227,6,19,0.12)] px-4 py-1 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#e30613]">
                    Testimonials
                </span>

                <h2
                    id="testimonials-heading"
                    ref={headingRef}
                    className="font-display mt-7 text-[clamp(2rem,6.5vw,2.6rem)] uppercase leading-[0.98] lg:text-[clamp(2.4rem,3.4vw,3.2rem)]"
                >
                    <MarkerWords segments={heading} />
                </h2>

                <p className="tm-lede mt-6 text-base leading-relaxed text-[#9a9693]">
                    Not survivor testimony — that lives in Stories, and belongs to the
                    people who wrote it. This is from the volunteers, advocates and
                    partners who keep the work running.
                </p>
            </div>

            {/* ============ STAGGERED DECK ============ */}
            <div
                className="tm-stage relative z-10 w-full overflow-hidden"
                // derived from the card, so the 290px mobile card is not sitting
                // in a stage sized for the 365px desktop one
                style={{ height: cardSize + 200, ...EDGE_FADE }}
                role="group"
                aria-roledescription="carousel"
                aria-label="Testimonials"
                // Safety net only: a card that unmounts mid-hover never fires its
                // own mouseleave, so leaving the stage always releases the hold.
                onMouseLeave={() => setPaused(false)}
            >
                {list.map((item, index) => (
                    <TestimonialCard
                        key={item.tempId}
                        item={item}
                        handleMove={handleMove}
                        // centred for odd counts too — index - floor(n/2) keeps
                        // the same number of cards either side of the middle
                        position={index - Math.floor(list.length / 2)}
                        cardSize={cardSize}
                        onHold={setPaused}
                    />
                ))}

                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                    <button
                        type="button"
                        onClick={() => handleMove(-1)}
                        className="flex h-14 w-14 items-center justify-center border-2 border-white/[0.14] bg-[#0a0a0a] text-2xl text-[#f5f5f5] transition-colors hover:border-[#e30613] hover:bg-[#e30613] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e30613]"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft />
                    </button>
                    <button
                        type="button"
                        onClick={() => handleMove(1)}
                        className="flex h-14 w-14 items-center justify-center border-2 border-white/[0.14] bg-[#0a0a0a] text-2xl text-[#f5f5f5] transition-colors hover:border-[#e30613] hover:bg-[#e30613] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e30613]"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight />
                    </button>
                </div>
            </div>
        </section>
    );
}
