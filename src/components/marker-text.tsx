// components/marker-text.tsx
"use client";

import { Fragment } from "react";
import gsap from "gsap";

export type Segment = {
    text: string;
    /** Colour (or any other) classes for this run of words. */
    className?: string;
    /** Start this segment on a fresh line. */
    br?: boolean;
};

/** How far apart consecutive words are struck. The overlap between one word's
 *  wipe-out and the next word's wipe-in is what makes the separate bars read as
 *  a single travelling marker stroke. */
const STEP = 0.07;

/** Length of a single bar's wipe-in (and of its wipe-out). */
const PHASE = 0.13;

/**
 * Renders `segments` as one span per word, each carrying its own marker bar.
 * The trailing space lives inside the inline-block (whitespace-pre) so words
 * still wrap normally — and so consecutive bars tile into a continuous stroke.
 *
 * Drop it inside whatever element you want (h2, p, …) and keep a ref on that
 * element to drive it with the helpers below.
 */
export function MarkerWords({ segments }: { segments: Segment[] }) {
    return (
        <>
            {segments.map((segment, si) => (
                <Fragment key={si}>
                    {segment.br && <br />}
                    {segment.text.split(" ").map((word, wi) => (
                        <span
                            key={wi}
                            className="mv-word relative inline-block whitespace-pre"
                        >
                            <span className={`mv-text ${segment.className ?? ""}`}>
                                {word + " "}
                            </span>
                            <span
                                aria-hidden="true"
                                className="mv-mark pointer-events-none absolute inset-0 z-10 origin-left scale-x-0 bg-[#e30613]"
                            />
                        </span>
                    ))}
                </Fragment>
            ))}
        </>
    );
}

/**
 * Hides the words until their bar passes, so the stroke looks like it is
 * writing the line onto blank space. Done from JS rather than CSS so the text
 * still renders if scripting never runs.
 */
export function hideMarkerText(root: HTMLElement) {
    gsap.set(root.querySelectorAll(".mv-text"), { opacity: 0 });
}

/**
 * Lays a marker stroke across the words inside `root`, starting at time `at`.
 * Per word: a red bar wipes in from the left, the word snaps to full strength
 * underneath it, then the bar wipes out to the right — leaving solid text
 * behind. Returns the time the stroke finishes.
 */
export function addMarkerStroke(
    tl: gsap.core.Timeline,
    root: HTMLElement,
    at = 0
) {
    const words = root.querySelectorAll<HTMLElement>(".mv-word");

    words.forEach((word, i) => {
        const mark = word.querySelector<HTMLElement>(".mv-mark");
        const text = word.querySelector<HTMLElement>(".mv-text");
        if (!mark || !text) return;

        const start = at + i * STEP;

        tl.fromTo(
            mark,
            { scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, duration: PHASE, ease: "power2.in" },
            start
        )
            // the bar fully covers the word here — swap it to solid out of sight
            .set(text, { opacity: 1 }, start + PHASE)
            .set(mark, { transformOrigin: "right center" }, start + PHASE)
            .to(
                mark,
                { scaleX: 0, duration: PHASE, ease: "power2.out" },
                start + PHASE
            );
    });

    return at + Math.max(words.length - 1, 0) * STEP + PHASE * 2;
}
