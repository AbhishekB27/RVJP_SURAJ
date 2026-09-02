// components/mission-vision-section.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    MarkerWords,
    addMarkerStroke,
    hideMarkerText,
    type Segment,
} from "@/components/marker-text";

gsap.registerPlugin(ScrollTrigger);

const missionText: Segment[] = [
    { text: "To build a" },
    { text: "safer society", className: "text-red-600" },
    { text: "through awareness, education, survivor support, and lawful accountability." },
];

const visionText: Segment[] = [
    { text: "A society where every individual lives with" },
    { text: "dignity, safety, and respect", className: "text-red-600" },
    { text: "— free from fear, and confident justice will be served." },
];

export default function MissionVisionSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const missionRef = useRef<HTMLParagraphElement>(null);
    const visionRef = useRef<HTMLParagraphElement>(null);
    const seamRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mission = missionRef.current;
        const vision = visionRef.current;
        if (!mission || !vision) return;

        const ctx = gsap.context(() => {
            hideMarkerText(mission);
            hideMarkerText(vision);

            const mm = gsap.matchMedia();

            // ---- desktop: both panels are on screen together, so both
            //      statements are struck at once ----
            mm.add("(min-width: 1024px)", () => {
                gsap.set(seamRef.current, { scaleY: 0, transformOrigin: "top center" });

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 60%",
                        once: true,
                    },
                });

                tl.to(
                    seamRef.current,
                    { scaleY: 1, duration: 1.1, ease: "power2.out" },
                    0
                );

                addMarkerStroke(tl, mission, 0.15);
                addMarkerStroke(tl, vision, 0.15);
            });

            // ---- stacked: each panel gets struck as it reaches the viewport ----
            mm.add("(max-width: 1023px)", () => {
                [mission, vision].forEach((root) => {
                    const tl = gsap.timeline({
                        scrollTrigger: { trigger: root, start: "top 78%", once: true },
                    });
                    addMarkerStroke(tl, root, 0);
                });
            });

            return () => mm.revert();
        }, sectionRef);

        // the hero image above settles late — remeasure once everything has loaded
        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener("load", refresh);

        return () => {
            window.removeEventListener("load", refresh);
            ctx.revert();
        };
    }, []);

    return (
        <section ref={sectionRef} id="mission" className="relative overflow-hidden bg-black">
            <p className="absolute left-6 top-10 z-20 text-[11px] font-bold uppercase tracking-[0.25em] text-red-500 sm:left-10">
                Mission &amp; Vision
            </p>

            <div className="flex min-h-[600px] flex-col lg:h-screen lg:min-h-[640px] lg:flex-row">
                {/* ============ MISSION — dark panel ============ */}
                <div className="relative flex flex-1 items-end overflow-hidden bg-[#0a0a0a] px-6 py-16 sm:px-10 lg:items-center lg:px-14 lg:py-0">
                    <div className="pointer-events-none absolute -left-20 top-0 h-[400px] w-[400px] rounded-full bg-red-700/10 blur-[140px]" />

                    <span
                        aria-hidden="true"
                        className="font-display pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[22vw] leading-none text-white/[0.035] lg:-bottom-10 lg:text-[13vw]"
                    >
                        MISSION
                    </span>

                    <span className="pointer-events-none absolute right-6 top-10 hidden text-[11px] font-bold uppercase tracking-[0.3em] text-white/30 [writing-mode:vertical-rl] lg:block">
                        01 — Today
                    </span>

                    <div className="relative z-10 max-w-xl">
                        <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                            Our Mission
                        </p>
                        <p
                            ref={missionRef}
                            className="font-display text-4xl uppercase leading-[1.05] text-white sm:text-5xl lg:text-[3.2rem]"
                        >
                            <MarkerWords segments={missionText} />
                        </p>
                    </div>
                </div>

                {/* thin seam — draws downward as the section arrives */}
                <div
                    ref={seamRef}
                    className="hidden w-px bg-gradient-to-b from-transparent via-red-600/50 to-transparent lg:block"
                />

                {/* ============ VISION — light panel ============ */}
                <div className="relative flex flex-1 items-end overflow-hidden bg-[#f5f5f5] px-6 py-16 sm:px-10 lg:items-center lg:px-14 lg:py-0">
                    <div className="pointer-events-none absolute -right-20 bottom-0 h-[400px] w-[400px] rounded-full bg-red-600/10 blur-[140px]" />

                    <span
                        aria-hidden="true"
                        className="font-display pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[22vw] leading-none text-black/[0.045] lg:-bottom-10 lg:text-[13vw]"
                    >
                        VISION
                    </span>

                    <span className="pointer-events-none absolute left-6 top-10 hidden text-[11px] font-bold uppercase tracking-[0.3em] text-black/30 [writing-mode:vertical-rl] lg:block">
                        02 — Tomorrow
                    </span>

                    <div className="relative z-10 ml-auto max-w-xl text-right">
                        <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-red-600">
                            Our Vision
                        </p>
                        <p
                            ref={visionRef}
                            className="font-display text-4xl uppercase leading-[1.05] text-black sm:text-5xl lg:text-[3.2rem]"
                        >
                            <MarkerWords segments={visionText} />
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
