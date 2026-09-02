"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
  SmoothScroll — one app-wide Lenis instance.

  - A single rAF loop: GSAP's ticker drives Lenis, with lagSmoothing off, so
    Lenis and ScrollTrigger can never drift apart on a heavy frame.
  - ScrollTrigger.update runs on every Lenis scroll, keeping the scrubbed and
    triggered sections in sync with the smoothed position.
  - Lenis scrolls the real document, so window.scrollY and native scroll events
    keep working — the Stories carousel reads both for its scroll velocity.

  Rendered once, in the root layout.
*/

let lenisInstance: Lenis | null = null;

/** For programmatic scrolls elsewhere (nav anchors, back-to-top). */
export const getLenis = () => lenisInstance;

export default function SmoothScroll() {
    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.1, // higher is snappier
            smoothWheel: true,
            // textareas, modals and any nested scroller keep native scrolling
            allowNestedScroll: true,
            // "#section" links glide instead of jumping. The offset keeps the
            // target clear of the 64px fixed header.
            anchors: { offset: -88 },
        });
        lenisInstance = lenis;

        lenis.on("scroll", ScrollTrigger.update);

        const raf = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);

        // positions were measured before Lenis took over the scroller
        ScrollTrigger.refresh();

        return () => {
            lenis.off("scroll", ScrollTrigger.update);
            gsap.ticker.remove(raf);
            gsap.ticker.lagSmoothing(500, 33); // back to GSAP's default
            lenis.destroy();
            lenisInstance = null;
        };
    }, []);

    return null;
}
