// components/header.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import gsap from "gsap";

// Trimmed: removed "SHARE YOUR STORY" & "JOIN RVJP" — already primary CTAs in hero.
// "DONATE" promoted to a standalone button instead of a plain nav link.
// Every entry points somewhere real. "RESOURCES" is gone — that page does not
// exist; "CAMPAIGNS" takes its slot and lands on a section that does.
const navItems = [
    { label: "HOME", href: "/" },
    { label: "ABOUT RVJP", href: "/#about" },
    { label: "MISSION & VISION", href: "/#mission" },
    { label: "CAMPAIGNS", href: "/#campaigns" },
    { label: "STORIES", href: "/#stories" },
    { label: "BLOG", href: "/blog" },
    { label: "CONTACT", href: "/contact" },
];

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const headerRef = useRef<HTMLElement>(null);
    const logoRef = useRef<HTMLAnchorElement>(null);
    const navRef = useRef<HTMLElement>(null);
    const drawerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    // Entrance animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.from(headerRef.current, { y: -20, opacity: 0, duration: 0.5 })
                .from(logoRef.current, { opacity: 0, x: -20, duration: 0.5 }, "-=0.3")
                .from(
                    navRef.current?.children ?? [],
                    { opacity: 0, y: -10, duration: 0.4, stagger: 0.05 },
                    "-=0.3"
                );
        }, headerRef);

        return () => ctx.revert();
    }, []);

    // Subtle shadow/border once scrolled (only matters if hero isn't 100vh-locked)
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 4);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Mobile drawer animation
    useEffect(() => {
        if (!drawerRef.current || !overlayRef.current) return;

        const ctx = gsap.context(() => {
            if (menuOpen) {
                gsap.set(drawerRef.current, { display: "flex" });
                gsap.set(overlayRef.current, { display: "block" });

                gsap.fromTo(
                    overlayRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.3, ease: "power2.out" }
                );
                gsap.fromTo(
                    drawerRef.current,
                    { x: "100%" },
                    { x: "0%", duration: 0.4, ease: "power3.out" }
                );
                gsap.fromTo(
                    drawerRef.current?.querySelectorAll("a") ?? [],
                    { opacity: 0, x: 30 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.35,
                        stagger: 0.04,
                        delay: 0.15,
                        ease: "power2.out",
                    }
                );
            } else {
                gsap.to(drawerRef.current, {
                    x: "100%",
                    duration: 0.35,
                    ease: "power3.in",
                });
                gsap.to(overlayRef.current, {
                    opacity: 0,
                    duration: 0.25,
                    onComplete: () => {
                        gsap.set(drawerRef.current, { display: "none" });
                        gsap.set(overlayRef.current, { display: "none" });
                    },
                });
            }
        });

        return () => ctx.revert();
    }, [menuOpen]);

    return (
        <header
            ref={headerRef}
            // `fixed` + an explicit top: pinned to the viewport, not to wherever
            // it happened to land in the body's flex flow.
            className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${scrolled
                ? "border-white/15 bg-black/85"
                : "border-white/10 bg-black/10"
                }`}
        >
            <div className="mx-auto flex h-[64px] max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">
                {/* Logo */}
                <a ref={logoRef} href="/" className="flex shrink-0 items-center gap-3">
                    <Image
                        src="/rvjp-logo.png"
                        alt="RVJP"
                        width={180}
                        height={58}
                        className="h-[36px] w-auto object-contain sm:h-[42px]"
                        priority
                    />
                </a>

                {/* Desktop Nav */}
                <div className="hidden items-center gap-8 xl:flex">
                    <nav ref={navRef} className="flex items-center gap-6">
                        {navItems.map((item, i) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className={`group relative py-1.5 text-[12px] font-bold tracking-wide transition-colors ${i === 0 ? "text-white" : "text-white/65 hover:text-white"
                                    }`}
                            >
                                {item.label}
                                <span
                                    className={`absolute -bottom-[1px] left-0 h-[2px] w-full bg-red-600 transition-transform duration-300 ${i === 0
                                        ? "scale-x-100"
                                        : "scale-x-0 group-hover:scale-x-100"
                                        }`}
                                />
                            </a>
                        ))}
                    </nav>
                    {/* Donate — standalone highlighted CTA */}
                    <a
                        href="/donate"
                        className="rounded-md bg-red-600 px-5 py-2 text-[12px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-500"
                    >
                        Donate
                    </a>
                </div>

                {/* Mobile: donate + hamburger */}
                <div className="flex items-center gap-2 xl:hidden">
                    <a
                        href="/donate"
                        className="hidden rounded-md bg-red-600 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-500 sm:inline-block"
                    >
                        Donate
                    </a>
                    <button
                        type="button"
                        onClick={() => setMenuOpen(true)}
                        className="flex items-center justify-center rounded-md p-2 text-white transition-colors hover:bg-white/10"
                        aria-label="Open menu"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div >
            </div >

            {/* Mobile overlay */}
            < div
                ref={overlayRef}
                onClick={() => setMenuOpen(false)
                }
                className="fixed inset-0 z-[60] hidden bg-black/70 backdrop-blur-sm xl:hidden"
            />

            {/* Mobile drawer */}
            < div
                ref={drawerRef}
                // dvh, not vh: with a phone's address bar showing, 100vh runs
                // past the visible area and the drawer's Donate button is cut off
                className="fixed right-0 top-0 z-[70] hidden h-dvh w-[80vw] max-w-[340px] flex-col overflow-y-auto bg-black shadow-2xl xl:hidden"
                style={{ transform: "translateX(100%)" }}
            >
                <div className="flex h-[64px] shrink-0 items-center justify-between border-b border-white/10 px-5">
                    <span className="text-sm font-bold uppercase tracking-wide text-red-600">
                        Menu
                    </span>
                    <button
                        type="button"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-center rounded-md p-2 text-white transition-colors hover:bg-white/10"
                        aria-label="Close menu"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <nav className="flex flex-1 flex-col gap-1 px-5 py-6">
                    {navItems.map((item, i) => (
                        <a
                            key={item.label}
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            // 44px minimum touch target
                            className={`border-b border-white/5 py-3.5 text-sm font-bold uppercase tracking-wide transition-colors ${i === 0 ? "text-red-600" : "text-white/80 hover:text-white"
                                }`}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav >

                <div className="shrink-0 border-t border-white/10 p-5">
                    <a
                        href="/donate"
                        onClick={() => setMenuOpen(false)}
                        className="block w-full rounded-md bg-red-600 px-5 py-3 text-center text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-500"
                    >
                        Donate
                    </a>
                </div >
            </div >
        </header >
    );
}