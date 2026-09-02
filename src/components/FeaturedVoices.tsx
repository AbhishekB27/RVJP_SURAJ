'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface Story {
    initial: string;
    age: number;
    location: string;
    quote: string;
    body: string;
}

const stories: Story[] = [
    {
        initial: 'R',
        age: 24,
        location: 'Lucknow, UP',
        quote: 'I stopped waiting for someone to believe me.',
        body: 'For two years I carried it alone, thinking silence was safer. The day I told my sister, something in my chest finally put itself down. I\u2019m not healed. I\u2019m heard. Right now, that\u2019s enough.',
    },
    {
        initial: 'A',
        age: 31,
        location: 'Nagpur, MH',
        quote: 'Justice took three years. My voice took three seconds.',
        body: 'The system moved slower than my courage did. I couldn\u2019t control the courts, but I could control whether I stayed quiet. I testified, then helped two other women get ready to do the same.',
    },
    {
        initial: 'S',
        age: 19,
        location: 'Haldwani, UK',
        quote: 'My family didn\u2019t have words for it. So I found my own.',
        body: 'There\u2019s no clean term for it in the language we speak at home. I explained it in pieces, over months, until they understood without needing the exact word.',
    },
    {
        initial: 'P',
        age: 27,
        location: 'Ahmedabad, GJ',
        quote: 'I am not the worst thing that happened to me.',
        body: 'For a long time, that one night was the only chapter anyone read. I\u2019m writing the rest of the book now \u2014 the parts with my work, my friends, my ordinary Tuesdays.',
    },
    {
        initial: 'M',
        age: 22,
        location: 'Bhopal, MP',
        quote: 'Sharing this costs me something. Not sharing it cost me more.',
        body: 'I weighed both silences and picked the harder, honest one. If one person reads this and calls a helpline instead of calling themselves broken, it was worth it.',
    },
];

// ============================================================================
// Carousel physics / visual constants
// ============================================================================
const FRICTION = 0.9;
const DRAG_SENS = 1.0;
/** Idle drift (px/s) — slow enough to read, quick enough to signal "draggable". */
const DRIFT = 48;
/** How long the carousel holds still after a snap before drifting again. */
const SNAP_HOLD = 2200;
/** Carousel velocity (px/s) gained per pixel of page scroll. */
const SCROLL_LINK = 4;
/** Ceiling on carousel velocity, so a fast fling can't spin it into a blur. */
const MAX_V = 2000;
const MAX_ROTATION = 26;
const MAX_DEPTH = 130;
const MIN_SCALE = 0.9;
const SCALE_RANGE = 0.12;
const GAP = 36;

function mod(n: number, m: number) {
    return ((n % m) + m) % m;
}

interface CardItem {
    x: number;
}

export default function StoriesSection() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const headRef = useRef<HTMLDivElement | null>(null);
    const stageRef = useRef<HTMLDivElement | null>(null);
    const cardsRootRef = useRef<HTMLDivElement | null>(null);
    const ctaRef = useRef<HTMLDivElement | null>(null);
    // The cards render as <article>, so these are HTMLElement, not HTMLDivElement.
    const cardElsRef = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(headRef.current, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: { trigger: headRef.current, start: 'top 85%' },
            });

            gsap.from(stageRef.current, {
                opacity: 0,
                y: 40,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: { trigger: stageRef.current, start: 'top 85%' },
            });

            gsap.from(ctaRef.current, {
                opacity: 0,
                y: 40,
                scale: 0.97,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: { trigger: ctaRef.current, start: 'top 90%' },
            });
        }, sectionRef);

        const stage = stageRef.current;
        const cardsRoot = cardsRootRef.current;
        if (!stage || !cardsRoot) return () => ctx.revert();

        const cardEls = cardElsRef.current.filter(Boolean) as HTMLElement[];
        if (!cardEls.length) return () => ctx.revert();

        // -------------------- state --------------------
        const items: CardItem[] = cardEls.map(() => ({ x: 0 }));
        let positions = new Float32Array(cardEls.length);

        let CARD_W = 320;
        let STEP = CARD_W + GAP;
        let TRACK = cardEls.length * STEP;
        let SCROLL_X = 0;
        let VW_HALF = stage.clientWidth * 0.5;
        let vX = 0;

        let rafId: number | null = null;
        let lastTime = 0;

        // Drift / snap state.
        let ready = false;        // entrance finished, interaction allowed
        let onScreen = false;     // section is in (or near) the viewport
        let driftPaused = false;  // pointer is resting over the stage
        let snapping = false;     // a snap tween owns SCROLL_X right now
        let holdUntil = 0;        // drift stays off until this timestamp

        // Page-scroll distance banked since the last frame, spent as velocity.
        let scrollDelta = 0;
        let lastScrollY = window.scrollY;

        /** Proxy the snap tween drives, so SCROLL_X can wrap without fighting it. */
        const snapProxy = { x: 0 };

        function measure() {
            const r = cardEls[0].getBoundingClientRect();
            CARD_W = r.width || CARD_W;
            STEP = CARD_W + GAP;
            TRACK = cardEls.length * STEP;
            items.forEach((it, i) => {
                it.x = i * STEP;
            });
            positions = new Float32Array(cardEls.length);
        }

        function computeTransformComponents(screenX: number) {
            const norm = Math.max(-1, Math.min(1, screenX / VW_HALF));
            const absNorm = Math.abs(norm);
            const invNorm = 1 - absNorm;
            const ry = -norm * MAX_ROTATION;
            const tz = invNorm * MAX_DEPTH;
            const scale = MIN_SCALE + invNorm * SCALE_RANGE;
            return { ry, tz, scale };
        }

        function transformForScreenX(screenX: number) {
            const { ry, tz, scale } = computeTransformComponents(screenX);
            return {
                transform: `translate3d(${screenX}px,-50%,${tz}px) rotateY(${ry}deg) scale(${scale})`,
                z: tz,
            };
        }

        function updateCarouselTransforms() {
            const half = TRACK / 2;
            let closestIdx = -1;
            let closestDist = Infinity;

            for (let i = 0; i < cardEls.length; i++) {
                let pos = items[i].x - SCROLL_X;
                if (pos < -half) pos += TRACK;
                if (pos > half) pos -= TRACK;
                positions[i] = pos;

                const dist = Math.abs(pos);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestIdx = i;
                }
            }

            const prevIdx = (closestIdx - 1 + cardEls.length) % cardEls.length;
            const nextIdx = (closestIdx + 1) % cardEls.length;

            for (let i = 0; i < cardEls.length; i++) {
                const el = cardEls[i];
                const pos = positions[i];
                const norm = Math.max(-1, Math.min(1, pos / VW_HALF));
                const { transform, z } = transformForScreenX(pos);

                el.style.transform = transform;
                el.style.zIndex = String(1000 + Math.round(z));

                const isCore = i === closestIdx || i === prevIdx || i === nextIdx;
                const blur = isCore ? 0 : 2.4 * Math.pow(Math.abs(norm), 1.1);
                el.style.filter = `blur(${blur.toFixed(2)}px)`;
                el.style.opacity = isCore ? '1' : String(Math.max(0.35, 1 - Math.abs(norm) * 0.7));
            }
        }

        function tick(t: number) {
            const dt = lastTime ? (t - lastTime) / 1000 : 0;
            lastTime = t;

            // Scrolling the page is a direct steer, so a snap in progress
            // yields to it rather than fighting the reader.
            if (scrollDelta !== 0 && snapping) {
                gsap.killTweensOf(snapProxy);
                snapping = false;
            }

            // While snapping, the tween owns SCROLL_X. While dragging, the
            // pointer does. Otherwise momentum decays back into the idle drift
            // rather than to a standstill.
            if (!snapping && !dragging) {
                const idle = driftPaused || t < holdUntil ? 0 : DRIFT;
                const decay = Math.pow(FRICTION, dt * 60);

                vX = idle + (vX - idle) * decay;

                // scroll velocity feeds straight into the carousel: scroll down
                // and it runs on, scroll up and it reverses
                if (scrollDelta !== 0) {
                    vX = Math.max(-MAX_V, Math.min(MAX_V, vX + scrollDelta * SCROLL_LINK));
                }

                if (Math.abs(vX - idle) < 0.02) vX = idle;
                SCROLL_X = mod(SCROLL_X + vX * dt, TRACK);
            }

            scrollDelta = 0;

            updateCarouselTransforms();
            rafId = requestAnimationFrame(tick);
        }

        function startCarousel() {
            if (rafId !== null) return;
            lastTime = 0; // first frame gets dt 0, so resuming never jumps
            scrollDelta = 0; // and no scroll banked while paused is spent at once
            lastScrollY = window.scrollY;
            updateCarouselTransforms();
            rafId = requestAnimationFrame(tick);
        }
        function cancelCarousel() {
            if (rafId !== null) cancelAnimationFrame(rafId);
            rafId = null;
        }

        /** Run the loop only once the entrance is done and the section is near view. */
        function syncCarousel() {
            if (ready && onScreen && !document.hidden) startCarousel();
            else cancelCarousel();
        }

        /**
         * Settles a released drag on a card instead of wherever momentum happens
         * to die. `velocity` is projected forward under the same friction curve
         * the loop uses, then rounded to the nearest card slot.
         */
        function snapToNearest(velocity: number) {
            const projected = SCROLL_X + velocity / (60 * (1 - FRICTION));
            const target = Math.round(projected / STEP) * STEP;
            const slots = Math.abs(target - SCROLL_X) / STEP;

            vX = 0;
            snapping = true;
            snapProxy.x = SCROLL_X;

            gsap.killTweensOf(snapProxy);
            gsap.to(snapProxy, {
                x: target,
                duration: Math.min(1.1, 0.45 + slots * 0.18),
                ease: 'power3.out',
                onUpdate: () => {
                    SCROLL_X = mod(snapProxy.x, TRACK);
                },
                onComplete: () => {
                    snapping = false;
                    holdUntil = performance.now() + SNAP_HOLD;
                },
            });
        }

        function onResize() {
            // Re-read the ref: TypeScript drops the null-narrowing from line 123
            // once we are inside a nested function.
            const stageEl = stageRef.current;
            if (!stageEl) return;
            const prevStep = STEP || 1;
            const ratio = SCROLL_X / (cardEls.length * prevStep);
            measure();
            VW_HALF = stageEl.clientWidth * 0.5;
            SCROLL_X = mod(ratio * TRACK, TRACK);
            updateCarouselTransforms();
        }

        let resizeTimeout: ReturnType<typeof setTimeout>;
        const handleWindowResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(onResize, 80);
        };

        const onDragStart = (e: DragEvent) => e.preventDefault();

        let dragging = false;
        let lastX = 0;
        let lastT = 0;
        let lastDelta = 0;

        // Only commit to a carousel drag once the pointer has moved mostly
        // horizontally. This keeps normal page scroll (mouse wheel, trackpad,
        // touch swipe down) completely untouched.
        let dragCandidate = false;
        let downX = 0;
        let downY = 0;

        const onPointerDown = (e: PointerEvent) => {
            if (!ready) return;
            // grabbing mid-snap hands control straight back to the pointer
            gsap.killTweensOf(snapProxy);
            snapping = false;
            vX = 0;
            dragCandidate = true;
            dragging = false;
            downX = e.clientX;
            downY = e.clientY;
            lastX = e.clientX;
            lastT = performance.now();
            lastDelta = 0;
        };

        const onPointerMove = (e: PointerEvent) => {
            if (!dragCandidate) return;

            if (!dragging) {
                const dx = e.clientX - downX;
                const dy = e.clientY - downY;
                if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;

                if (Math.abs(dx) <= Math.abs(dy)) {
                    // Vertical intent (page scroll / swipe) — let the browser handle it.
                    dragCandidate = false;
                    return;
                }

                dragging = true;
                stage.setPointerCapture(e.pointerId);
                stage.classList.add('cursor-grabbing');
                stage.classList.remove('cursor-grab');
            }

            e.preventDefault();
            const now = performance.now();
            const dx = e.clientX - lastX;
            const dt = Math.max(1, now - lastT) / 1000;
            SCROLL_X = mod(SCROLL_X - dx * DRAG_SENS, TRACK);
            lastDelta = dx / dt;
            lastX = e.clientX;
            lastT = now;
        };

        const endDrag = (e: PointerEvent) => {
            if (dragging) {
                try {
                    stage.releasePointerCapture(e.pointerId);
                } catch {
                    /* noop */
                }
                stage.classList.remove('cursor-grabbing');
                stage.classList.add('cursor-grab');
                dragging = false;
                dragCandidate = false;
                snapToNearest(-lastDelta * DRAG_SENS);
                return;
            }
            dragging = false;
            dragCandidate = false;
        };

        // Hovering pauses the drift so a card can be read without chasing it.
        // Touch only ever fires enter (never leave), so it must not latch.
        const onPointerEnter = (e: PointerEvent) => {
            driftPaused = e.pointerType === 'mouse';
        };
        const onPointerLeave = () => {
            driftPaused = false;
        };

        // Bank page-scroll distance for the next frame. Only while the section
        // is on screen, so a long scroll past it can't build up a huge kick.
        const onWindowScroll = () => {
            const y = window.scrollY;
            const dy = y - lastScrollY;
            lastScrollY = y;
            if (onScreen) scrollDelta += dy;
        };

        const onVisibilityChange = () => syncCarousel();

        // Nothing should drift while the section is nowhere near the viewport.
        const io = new IntersectionObserver(
            ([entry]) => {
                onScreen = entry.isIntersecting;
                syncCarousel();
            },
            { rootMargin: '150px' }
        );
        io.observe(stage);

        stage.addEventListener('dragstart', onDragStart as EventListener);
        stage.addEventListener('pointerdown', onPointerDown);
        stage.addEventListener('pointermove', onPointerMove);
        stage.addEventListener('pointerup', endDrag);
        stage.addEventListener('pointercancel', endDrag);
        stage.addEventListener('pointerenter', onPointerEnter);
        stage.addEventListener('pointerleave', onPointerLeave);
        window.addEventListener('resize', handleWindowResize);
        window.addEventListener('scroll', onWindowScroll, { passive: true });
        document.addEventListener('visibilitychange', onVisibilityChange);

        // -------------------- init --------------------
        measure();
        updateCarouselTransforms();

        gsap.set(cardEls, { opacity: 0, y: 30 });
        gsap.to(cardEls, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.06,
            onComplete: () => {
                ready = true;
                syncCarousel();
            },
        });

        return () => {
            clearTimeout(resizeTimeout);
            cancelCarousel();
            io.disconnect();
            gsap.killTweensOf(snapProxy);
            stage.removeEventListener('dragstart', onDragStart as EventListener);
            stage.removeEventListener('pointerdown', onPointerDown);
            stage.removeEventListener('pointermove', onPointerMove);
            stage.removeEventListener('pointerup', endDrag);
            stage.removeEventListener('pointercancel', endDrag);
            stage.removeEventListener('pointerenter', onPointerEnter);
            stage.removeEventListener('pointerleave', onPointerLeave);
            window.removeEventListener('resize', handleWindowResize);
            window.removeEventListener('scroll', onWindowScroll);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            ctx.revert();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="stories"
            aria-label="Survivor stories"
            className="relative overflow-hidden bg-[#0a0a0a] px-6 py-[6.5rem] font-sans text-[#f5f5f5]"
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute top-2 left-1/2 z-0 -translate-x-1/2 whitespace-nowrap text-[clamp(5rem,16vw,11rem)] font-black uppercase tracking-tight text-transparent select-none [-webkit-text-stroke:1px_rgba(255,255,255,0.05)]"
            >
                Stories
            </span>

            <div ref={headRef} className="relative z-10 mx-auto mb-16 max-w-[40rem] text-center">
                <span className="mb-4 block text-xs font-bold uppercase tracking-[0.3em] text-[#e30613]">
                    Stories
                </span>
                <h2 className="font-display mb-[1.1rem] text-[clamp(2rem,4.2vw,3rem)] font-bold uppercase leading-[1.02] tracking-[0.01em]">
                    Voices from the <span className="text-[#e30613]">movement</span>
                </h2>
                <div className="mx-auto mb-5 h-1 w-14 bg-[#e30613]" />
                <p className="text-base leading-relaxed text-[#9a9693]">
                    Real testimonies, shared on their own terms. Names are held back to
                    protect the people behind them. Drag sideways to explore.
                </p>
            </div>

            <div
                ref={stageRef}
                aria-label="Draggable carousel of survivor stories"
                className="cursor-grab relative z-10 h-[min(112vw,560px)] min-h-[26rem] w-full touch-pan-y overflow-hidden select-none sm:h-[min(64vw,560px)] [perspective:1800px]"
            >
                <div ref={cardsRootRef} className="absolute inset-0 z-[1] [transform-style:preserve-3d]">
                    {stories.map((story, i) => (
                        <article
                            key={story.initial + i}
                            ref={(el) => {
                                cardElsRef.current[i] = el;
                            }}
                            // 30vw is ~112px on a phone — unreadable. The carousel
                            // measures the rendered width, so the maths follows.
                            className="absolute top-1/2 left-1/2 w-[min(80vw,340px)] rounded-[22px] p-[1.5px] will-change-transform sm:w-[min(52vw,360px)] lg:w-[min(30vw,360px)] [background:linear-gradient(160deg,rgba(227,6,19,0.35),rgba(255,255,255,0.06)_40%,transparent_70%)] [backface-visibility:hidden] [transform-origin:center_center]"
                        >
                            <div className="relative flex h-full flex-col overflow-hidden rounded-[20.5px] [background:linear-gradient(160deg,#131313,#0d0d0d_70%)]">
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -top-[35%] -right-[25%] h-44 w-44 [background:radial-gradient(circle,rgba(227,6,19,0.22),transparent_70%)]"
                                />
                                <div className="relative flex flex-grow flex-col px-[1.9rem] pt-8 pb-[1.8rem]">
                                    <span className="mb-[1.1rem] inline-flex self-start rounded-full border border-[rgba(227,6,19,0.3)] bg-[rgba(227,6,19,0.14)] px-[0.7rem] py-[0.3rem] text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#e30613]">
                                        Testimony
                                    </span>
                                    <svg
                                        width="30"
                                        height="22"
                                        viewBox="0 0 34 26"
                                        fill="currentColor"
                                        aria-hidden="true"
                                        className="mb-[0.7rem] text-[#e30613] opacity-70"
                                    >
                                        <path d="M14.5 0C7 2.2 2 8.4 2 16c0 5.5 3.6 9.4 8.3 9.4 4.2 0 7.3-3.2 7.3-7.2 0-3.7-2.6-6.6-6-6.9C12.4 7 15.4 3.3 20 1.6L14.5 0zm18 0C25 2.2 20 8.4 20 16c0 5.5 3.6 9.4 8.3 9.4 4.2 0 7.3-3.2 7.3-7.2 0-3.7-2.6-6.6-6-6.9C30.4 7 33.4 3.3 38 1.6L32.5 0z" />
                                    </svg>
                                    <h3 className="mb-[0.8rem] text-[1.08rem] font-bold leading-[1.4]">
                                        {story.quote}
                                    </h3>
                                    <p className="mb-[1.6rem] flex-grow text-[0.92rem] leading-[1.65] text-[#9a9693]">
                                        {story.body}
                                    </p>
                                    <div className="flex items-center gap-3 border-t border-[rgba(255,255,255,0.09)] pt-[1.2rem]">
                                        <span className="flex h-[2.4rem] w-[2.4rem] flex-shrink-0 items-center justify-center rounded-full border border-[rgba(227,6,19,0.35)] bg-[rgba(227,6,19,0.14)] text-[0.95rem] font-extrabold text-[#e30613]">
                                            {story.initial}
                                        </span>
                                        <div className="flex flex-col">
                                            <strong className="text-[0.85rem] font-bold">
                                                {story.initial}. &middot; {story.age}
                                            </strong>
                                            <span className="text-[0.76rem] text-[#9a9693]">{story.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            <div
                ref={ctaRef}
                className="
    group relative z-10 mx-6 mt-20 overflow-hidden
    rounded-[28px]
    border border-white/[0.08]
    bg-[#0d0d0d]
    px-7 py-10
    sm:px-10 sm:py-12
    lg:mx-auto lg:max-w-[74rem] lg:px-14 lg:py-14
  "
            >
                {/* Large background text */}
                <div
                    aria-hidden="true"
                    className="
      pointer-events-none absolute
      -right-6 top-1/2
      -translate-y-1/2
      select-none
      text-[7rem] font-black uppercase
      leading-none tracking-[-0.08em]
      text-white/[0.025]
      sm:text-[10rem]
      lg:text-[13rem]
    "
                >
                    VOICE
                </div>

                {/* Red ambient glow */}
                <div
                    aria-hidden="true"
                    className="
      pointer-events-none absolute
      -left-32 -top-32
      h-72 w-72
      rounded-full
      bg-[#e30613]/10
      blur-[100px]
      transition-all duration-700
      group-hover:bg-[#e30613]/20
    "
                />

                {/* Top line */}
                <div
                    aria-hidden="true"
                    className="
      absolute left-0 right-0 top-0 h-[2px]
      bg-gradient-to-r
      from-transparent
      via-[#e30613]
      to-transparent
      opacity-70
    "
                />

                <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">

                    {/* Content */}
                    <div className="max-w-[38rem]">
                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-8 bg-[#e30613]" />

                            <span className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#e30613]">
                                Your voice matters
                            </span>
                        </div>

                        <h3
                            className="
          max-w-[34rem]
          text-[clamp(2rem,5vw,4rem)]
          font-black uppercase
          leading-[0.95]
          tracking-[-0.045em]
          text-[#f5f5f5]
        "
                        >
                            Your story
                            <br />
                            <span className="text-[#e30613]">can create change.</span>
                        </h3>

                        <p
                            className="
          mt-6 max-w-[32rem]
          text-[0.95rem]
          leading-[1.7]
          text-[#8f8b88]
          sm:text-base
        "
                        >
                            Sharing your experience can help others feel less alone.
                            Your story can be shared anonymously and only with your consent.
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="relative z-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                        <Link
                            href="/shareStory"
                            className="
          group/btn
          relative inline-flex w-full shrink-0 items-center justify-center gap-3.5
          whitespace-nowrap
          sm:w-auto
          overflow-hidden
          rounded-full
          bg-[#e30613]
          px-7 py-[0.95rem]
          text-[0.78rem]
          font-extrabold
          uppercase
          tracking-[0.12em]
          text-white
          transition-[transform,background-color,box-shadow] duration-300 ease-out
          hover:-translate-y-1
          hover:bg-[#f01522]
          hover:shadow-[0_20px_50px_-15px_rgba(227,6,19,0.7)]
          focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white
          active:translate-y-0 active:duration-75
        "
                        >
                            <span className="relative z-10">Share your story</span>

                            {/* Arrow badge — the arrow leaves right, a fresh one
                                arrives from the left */}
                            <span
                                aria-hidden="true"
                                className="
            relative z-10
            flex h-7 w-7 shrink-0
            items-center justify-center
            overflow-hidden
            rounded-full
            bg-white/15
            transition-colors duration-300
            group-hover/btn:bg-white/25
          "
                            >
                                <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    className="absolute transition-transform duration-300 ease-out group-hover/btn:translate-x-[180%]"
                                >
                                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    className="absolute -translate-x-[180%] transition-transform duration-300 ease-out group-hover/btn:translate-x-0"
                                >
                                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>

                            {/* Sheen — sweeps once on hover, then snaps back with
                                zero duration so it never wipes in reverse */}
                            <span
                                aria-hidden="true"
                                className="
            pointer-events-none absolute inset-y-0 left-0
            w-1/3
            -translate-x-[250%] -skew-x-[20deg]
            bg-white/20
            transition-transform duration-0
            group-hover/btn:translate-x-[420%]
            group-hover/btn:duration-700 group-hover/btn:ease-out
          "
                            />
                        </Link>

                        <span className="text-[0.68rem] uppercase tracking-[0.16em] text-white/30">
                            Anonymous · Consent based
                        </span>
                    </div>
                </div>

                {/* Bottom decorative details */}
                <div
                    aria-hidden="true"
                    className="
      absolute bottom-5 left-7
      flex items-center gap-2
      opacity-30
    "
                >
                    <span className="h-1 w-1 rounded-full bg-[#e30613]" />
                    <span className="h-px w-16 bg-white/30" />
                    <span className="text-[9px] uppercase tracking-[0.3em] text-white">
                        Stories matter
                    </span>
                </div>
            </div>
        </section>
    );
}