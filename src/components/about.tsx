// components/about-section.tsx
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

const methods = [
    "Public awareness campaigns",
    "Educational resources",
    "Volunteer engagement",
    "Responsible storytelling",
];

const headline: Segment[] = [
    { text: "Every voice" },
    { text: "deserves to be heard.", className: "text-red-600", br: true },
];

export default function AboutSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // eyebrow + headline reveal
            gsap.from(".about-eyebrow", {
                opacity: 0,
                y: 16,
                duration: 0.6,
                ease: "power3.out",
                scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
            });

            // headline is struck word by word with the marker stroke
            if (headlineRef.current) {
                hideMarkerText(headlineRef.current);

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                        once: true,
                    },
                });

                addMarkerStroke(tl, headlineRef.current);
            }

            gsap.from(".about-intro", {
                opacity: 0,
                y: 20,
                duration: 0.7,
                delay: 0.15,
                ease: "power3.out",
                scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
            });

            // column divider draws in vertically, connecting the two halves
            gsap.from(".column-divider", {
                scaleY: 0,
                transformOrigin: "center",
                duration: 1,
                ease: "power2.out",
                scrollTrigger: { trigger: ".about-grid", start: "top 65%" },
            });

            // closing statement + method chips
            gsap.from(".closing-statement", {
                opacity: 0,
                y: 24,
                duration: 0.7,
                ease: "power3.out",
                scrollTrigger: { trigger: ".closing-statement", start: "top 80%" },
            });

            gsap.from(".method-chip", {
                opacity: 0,
                y: 10,
                duration: 0.5,
                stagger: 0.06,
                ease: "power2.out",
                scrollTrigger: { trigger: ".method-row", start: "top 85%" },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="about"
            className="relative overflow-hidden bg-black px-6 py-24 text-white sm:py-32 lg:px-10"
        >
            {/* ambient glow, consistent with hero */}
            <div className="pointer-events-none absolute left-[-10%] top-[10%] h-[500px] w-[500px] rounded-full bg-red-700/10 blur-[160px]" />

            <div className="about-grid mx-auto grid max-w-[1200px] grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1fr_1px_1fr] lg:gap-0">
                {/* ============ HEADER ============ */}
                <div className="max-w-3xl lg:pr-16">
                    <p className="about-eyebrow mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-red-500">
                        About RVJP
                    </p>

                    <h2
                        ref={headlineRef}
                        className="about-headline font-display text-[11vw] uppercase leading-[0.92] sm:text-6xl lg:text-7xl"
                    >
                        <MarkerWords segments={headline} />
                    </h2>

                    <p className="about-intro mt-8 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
                        Rape Virodhi Janta Party (RVJP) is a people&rsquo;s movement dedicated
                        to creating a safer society through awareness, education, survivor
                        support, and advocacy for lawful accountability in cases of sexual
                        violence.
                    </p>
                </div>

                {/* ============ COLUMN DIVIDER — full-height, soft-faded gradient ============ */}
                <div className="column-divider hidden bg-gradient-to-b from-transparent via-red-600/50 to-transparent lg:block" />

                {/* ============ CLOSING STATEMENT ============ */}
                <div className="closing-statement max-w-3xl self-center border-l-2 border-red-600 pl-6 lg:pl-16 lg:border-l-0">
                    <p className="text-lg leading-relaxed text-white/85 sm:text-xl lg:text-2xl">
                        RVJP believes that every individual deserves to live with{" "}
                        <span className="text-white">dignity, safety, and respect.</span>{" "}
                        We aim to encourage prevention, support survivors, and inspire{" "}
                        <span className="font-semibold text-red-500">
                            positive social change.
                        </span>
                    </p>

                    {/* methods, named exactly as stated in the mission */}
                    <div className="method-row mt-8 flex flex-wrap gap-3">
                        {methods.map((method) => (
                            <span
                                key={method}
                                className="method-chip rounded-full border border-white/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/70"
                            >
                                {method}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}