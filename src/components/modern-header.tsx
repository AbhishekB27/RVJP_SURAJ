"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { Plus } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { getLenis } from "./smooth-scroll";
import Image from "next/image";

gsap.registerPlugin(CustomEase);

/*
  Header — top bar + Osmo-style side navigation wipe.

  The drawer slides in from the right with three staggered wipe panels
  (red → white → near-black), big menu links roll in with a slight
  rotation, and details fade up last. Links smooth-scroll to page
  sections (SPA anchors), some are dedicated routes. Escape / overlay click closes.
*/

// hybrid nav: section links smooth-scroll on the home page,
// path links navigate to dedicated pages, "top" scrolls to page top
const LINKS: { label: string; section?: string; path?: string }[] = [
    { label: "Home", section: "top" },
    { label: "About RVJP", section: "about" },
    { label: "Mission & Vision", section: "mission" },
    { label: "Stories", path: "/stories" },
    { label: "Resources", path: "/resources" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" },
    { label: "Donate", path: "/donate" },
];

let easeCreated = false;

const Header = () => {
    const router = useRouter();
    const pathname = usePathname();
    const barRef = useRef<HTMLElement>(null);
    const navRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const btnTextRef = useRef<HTMLDivElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const openRef = useRef(false);
    const lastScroll = useRef(0);
    const isHidden = useRef(false);

    useEffect(() => {
        const hash = window.location.hash.replace("#", "");
        if (!hash) return;

        // thoda delay dena zaroori hai — page mount hote hi target element
        // shayad ready na ho, aur Lenis bhi init ho raha ho
        const timer = setTimeout(() => {
            const target = document.getElementById(hash);
            if (!target) return;
            const lenis = getLenis();
            if (lenis) lenis.scrollTo(target, { duration: 1.4 });
            else target.scrollIntoView({ behavior: "smooth" });
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!easeCreated) {
            CustomEase.create("navEase", "0.65, 0.01, 0.05, 0.99");
            easeCreated = true;
        }
        gsap.set(navRef.current, { display: "none" });
        tlRef.current = gsap.timeline({ defaults: { ease: "navEase", duration: 0.7 } });

        // hide-on-scroll top bar (paused while the menu is open)
        const bar = barRef.current;
        const handleScroll = () => {
            if (openRef.current) return;
            const current = window.scrollY;

            if (current > 50) bar?.classList.add("bg-active");
            else bar?.classList.remove("bg-active");

            if (current > lastScroll.current + 5 && current > 80 && !isHidden.current) {
                isHidden.current = true;
                gsap.to(bar, { y: "-110%", duration: 0.25, ease: "power2.in" });
            } else if (current < lastScroll.current - 5 && isHidden.current) {
                isHidden.current = false;
                gsap.to(bar, { y: 0, duration: 0.45, ease: "power3.out" });
            }
            lastScroll.current = current;
        };
        window.addEventListener("scroll", handleScroll);

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && openRef.current) closeNav();
        };
        document.addEventListener("keydown", onKey);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("keydown", onKey);
            tlRef.current?.kill();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openNav = () => {
        const nav = navRef.current;
        const tl = tlRef.current;
        if (!nav || !tl) return;
        openRef.current = true;
        document.body.style.overflow = "hidden";
        getLenis()?.stop();

        // make sure the bar (and its Close button) is visible
        if (isHidden.current) {
            isHidden.current = false;
            gsap.to(barRef.current, { y: 0, duration: 0.3, ease: "power3.out" });
        }

        const overlay = nav.querySelector(".nav-overlay");
        const menu = nav.querySelector(".nav-menu");
        const panels = nav.querySelectorAll(".bg-panel");
        const links = nav.querySelectorAll(".menu-link");
        const fades = nav.querySelectorAll("[data-menu-fade]");
        const btnTexts = btnTextRef.current?.querySelectorAll("p") ?? [];

        tl.clear()
            .set(nav, { display: "block" })
            .set(menu, { xPercent: 0 }, "<")
            .fromTo(btnTexts, { yPercent: 0 }, { yPercent: -100, stagger: 0.2 })
            .fromTo(iconRef.current, { rotate: 0 }, { rotate: 315 }, "<")
            .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
            .fromTo(panels, { xPercent: 101 }, { xPercent: 0, stagger: 0.12, duration: 0.575 }, "<")
            .fromTo(links, { yPercent: 140, rotate: 10 }, { yPercent: 0, rotate: 0, stagger: 0.05 }, "<+=0.35")
            .fromTo(fades, { autoAlpha: 0, yPercent: 50 }, { autoAlpha: 1, yPercent: 0, stagger: 0.04 }, "<+=0.2");
    };

    const closeNav = () => {
        const nav = navRef.current;
        const tl = tlRef.current;
        if (!nav || !tl) return;
        openRef.current = false;
        document.body.style.overflow = "";
        getLenis()?.start();

        const overlay = nav.querySelector(".nav-overlay");
        const menu = nav.querySelector(".nav-menu");
        const btnTexts = btnTextRef.current?.querySelectorAll("p") ?? [];

        tl.clear()
            .to(overlay, { autoAlpha: 0 })
            .to(menu, { xPercent: 120 }, "<")
            .to(btnTexts, { yPercent: 0 }, "<")
            .to(iconRef.current, { rotate: 0 }, "<")
            .set(nav, { display: "none" });
    };

    const toggleNav = () => (openRef.current ? closeNav() : openNav());

    const goTop = () => {
        if (pathname !== "/") {
            router.push("/");
            return;
        }
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(0, { duration: 1.2 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const goTo = (link: (typeof LINKS)[number]) => {
        closeNav();

        // dedicated page
        if (link.path) {
            if (pathname !== link.path) router.push(link.path);
            return;
        }

        if (!link.section) return;

        if (link.section === "top") {
            goTop();
            return;
        }

        // home section — navigate home first if we're on another page
        if (pathname !== "/") {
            router.push(`/#${link.section}`);
            return;
        }
        const target = document.getElementById(link.section);
        if (!target) return;
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(target, { duration: 1.4 });
        else target.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            {/* ── top bar ── */}
            <nav
                ref={barRef}
                className="header-bar fixed top-0 z-[210] flex w-full items-center justify-between px-6 py-5 transition-all duration-300 md:px-12"
            >
                {/* LOGO */}
                <button onClick={goTop} className="flex items-center gap-2">
                    <Image
                        src="/rvjp-logo.png"
                        alt="RVJP — Rape Virodhi Janta Party"
                        width={120}
                        height={120}
                        className="h-14 w-auto object-contain md:h-16"
                        priority
                    />

                </button>

                {/* MENU TOGGLE */}
                <button
                    onClick={toggleNav}
                    className="menu-button flex items-center gap-2.5 p-2 text-white"
                >
                    <div ref={btnTextRef} className="flex h-[1.15em] flex-col items-end overflow-hidden text-sm font-bold uppercase tracking-widest">
                        <p>Menu</p>
                        <p className="text-[#dc2626]">Close</p>
                    </div>
                    <div ref={iconRef} className="icon-wrap text-[#dc2626]">
                        <Plus size={20} strokeWidth={2.5} />
                    </div>
                </button>
            </nav>

            {/* ── side nav ── */}
            <div ref={navRef} className="fixed inset-0 z-[200]">
                {/* dim overlay */}
                <div className="nav-overlay absolute inset-0 cursor-pointer bg-black/50" onClick={closeNav} />

                {/* sliding menu column */}
                {/* sliding menu column */}
                <nav className="nav-menu relative ml-auto flex h-full w-full flex-col justify-between pb-6 pt-24 md:w-[35em]">
                    {/* wipe panels */}
                    <div className="absolute inset-0 z-0">
                        <div className="bg-panel absolute inset-0 bg-[#dc2626] md:rounded-l-3xl" />
                        <div className="bg-panel absolute inset-0 bg-white md:rounded-l-3xl" />
                        <div className="bg-panel absolute inset-0 bg-[#0e0e0e] md:rounded-l-3xl" />
                    </div>

                    <div className="relative z-10 flex h-full flex-col justify-between gap-8">
                        {/* big links */}
                        <ul className="flex w-full flex-col justify-center">
                            {LINKS.map((link, i) => (
                                <li key={link.label} className="menu-list-item relative overflow-hidden">
                                    <button
                                        onClick={() => goTo(link)}
                                        className="menu-link flex w-full items-start gap-3 py-1.5 pl-8 text-left md:pl-10"
                                    >
                                        <p className="menu-link-heading relative z-10 text-[1.6rem] font-black uppercase leading-[0.85] tracking-tight text-white md:text-[2.2rem]">
                                            {link.label}
                                        </p>
                                        <p className="relative z-10 text-xs font-bold text-[#dc2626]">0{i + 1}</p>
                                        <div className="menu-link-bg absolute inset-0 z-0 bg-[#1a1a1a]" />
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {/* details */}
                        <div className="flex flex-col gap-3 pl-8 md:pl-10">
                            <p data-menu-fade className="text-xs uppercase tracking-[0.3em] text-zinc-500">Socials</p>
                            <div className="flex gap-6">
                                {["Instagram", "YouTube", "X/Twitter"].map((s) => (
                                    <a key={s} data-menu-fade href="#" className="text-link relative text-sm font-semibold text-zinc-300">
                                        {s}
                                    </a>
                                ))}
                            </div>
                            <p data-menu-fade className="text-xs text-zinc-600">
                                RVJP · contact@rvjp.org
                            </p>
                        </div>
                    </div>
                </nav>
            </div>

            {/* component styles (hover micro-interactions) */}
            <style>{`
                .header-bar { background: transparent; }
                .header-bar.bg-active {
                    background: rgba(10, 10, 10, 0.6);
                    backdrop-filter: blur(16px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                }

                .icon-wrap { transition: transform 0.4s cubic-bezier(0.65, 0.05, 0, 1); }
                .menu-button:hover .icon-wrap { transform: rotate(90deg); }

                .menu-link-heading {
                    text-shadow: 0px 1em 0px #dc2626;
                    transition: transform 0.55s cubic-bezier(0.65, 0.05, 0, 1);
                }
                .menu-link:hover .menu-link-heading {
                    transform: translateY(-1em);
                    transition-delay: 0.1s;
                }
                .menu-link-bg {
                    transform: scale3d(1, 0, 1);
                    transform-origin: 50% 100%;
                    transition: transform 0.55s cubic-bezier(0.65, 0.05, 0, 1);
                }
                .menu-link:hover .menu-link-bg { transform: scale3d(1, 1, 1); }

                .text-link::after {
                    content: "";
                    position: absolute;
                    left: 0;
                    bottom: -3px;
                    width: 100%;
                    height: 1px;
                    background: #dc2626;
                    transform-origin: right center;
                    transform: scale(0, 1);
                    transition: transform 0.4s cubic-bezier(0.65, 0.05, 0, 1);
                }
                .text-link:hover::after {
                    transform-origin: left center;
                    transform: scale(1, 1);
                }
            `}</style>
        </>
    );
};

export default Header;