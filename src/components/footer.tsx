import Image from "next/image";
import Link from "next/link";

import { CONTACT_EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/site-contact";

/**
 * Every href here points at a route or section that actually exists. The old
 * list carried /help, /resources, /faq, /privacy, /terms, /cookies and
 * /share-your-story — all of which 404. Legal pages should go back in as soon
 * as they are written.
 */
const navLinks = [
    {
        heading: "Explore",
        links: [
            { label: "About RVJP", href: "/#about" },
            { label: "Mission & vision", href: "/#mission" },
            { label: "Campaigns", href: "/#campaigns" },
            { label: "Stories", href: "/#stories" },
            { label: "Blog", href: "/blog" },
        ],
    },
    {
        heading: "Take action",
        links: [
            { label: "Share your story", href: "/shareStory" },
            { label: "Join the movement", href: "/join" },
            { label: "Volunteer", href: "/join?role=volunteer" },
            { label: "Offer legal aid", href: "/join?role=legal-aid" },
            { label: "Donate", href: "/donate" },
        ],
    },
    {
        heading: "Connect",
        links: [
            { label: "Contact us", href: "/contact" },
            { label: "Press & media", href: "/contact" },
            { label: "Partnerships", href: "/contact" },
            { label: "What people say", href: "/#testimonials" },
        ],
    },
];

/**
 * Only accounts that actually exist. X, Facebook and YouTube were placeholders
 * pointing at each platform's home page — a dead end for anyone who clicked —
 * so they are gone until real profiles are set up.
 */
const socials = [
    {
        label: "Instagram",
        display: `@${INSTAGRAM_HANDLE}`,
        href: INSTAGRAM_URL,
        external: true,
        icon: (
            <>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </>
        ),
    },
    {
        label: "Email",
        display: CONTACT_EMAIL,
        href: `mailto:${CONTACT_EMAIL}`,
        // mailto hands off to the mail app; a new tab would just open blank
        external: false,
        icon: (
            <>
                <rect x="3" y="5" width="18" height="14" rx="2.5" />
                <path d="M3.5 6.5l8.5 6.5 8.5-6.5" strokeLinecap="round" strokeLinejoin="round" />
            </>
        ),
    },
];

export default function Footer() {
    return (
        <footer className="relative overflow-hidden bg-[#080808] font-sans text-[#f5f5f5]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-40 top-40 h-[30rem] w-[30rem] rounded-full bg-[#e30613]/[0.06] blur-[130px]"
            />

            {/* =========================================================
                  CLOSING CALL — the footer's real job on a site like this
              ========================================================== */}
            <div className="relative z-10 border-b border-white/[0.08]">
                <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14 lg:flex-row lg:items-end lg:justify-between lg:py-16">
                    <div className="max-w-xl">
                        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[#e30613]">
                            <span className="h-1.5 w-1.5 bg-[#e30613]" />
                            Before you go
                        </p>

                        <h2 className="font-display mt-5 text-[clamp(1.9rem,5.5vw,2.4rem)] uppercase leading-[1.0] lg:text-[clamp(2.2rem,3vw,3rem)]">
                            Break the silence <span className="text-[#e30613]">with us</span>
                        </h2>

                        <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-[#898581]">
                            Every voice makes the next one easier. Give an hour, give a
                            rupee, or just pass this on.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
                        <Link
                            href="/donate"
                            className="rounded-xl bg-[#e30613] px-7 py-3.5 text-center text-[0.75rem] font-extrabold uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:bg-[#ff2733] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
                        >
                            Donate
                        </Link>
                        <Link
                            href="/join"
                            className="rounded-xl border border-white/[0.16] px-7 py-3.5 text-center text-[0.75rem] font-extrabold uppercase tracking-[0.12em] text-[#f5f5f5] transition-colors duration-300 hover:border-[#e30613] hover:text-[#e30613] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#e30613]"
                        >
                            Join the movement
                        </Link>
                    </div>
                </div>
            </div>

            {/* =========================================================
                  MAIN FOOTER
              ========================================================== */}
            <div className="relative z-10 mx-auto max-w-6xl px-6 py-16">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
                    {/* Brand */}
                    <div className="max-w-sm">
                        <Link
                            href="/"
                            className="inline-flex items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e30613]"
                        >
                            <Image
                                src="/rvjp-logo.png"
                                alt="RVJP Movement"
                                width={180}
                                height={58}
                                className="h-[42px] w-auto object-contain"
                            />
                        </Link>

                        <p className="mt-6 text-sm leading-[1.8] text-[#898581]">
                            A movement committed to building awareness, encouraging
                            action, supporting survivors, and creating a society where
                            everyone can live with dignity and safety.
                        </p>

                        {/* The address and handle are shown as text, not just
                            icons: people copy an email or search a handle far
                            more often than they click a round logo. */}
                        <ul className="mt-7 space-y-3">
                            {socials.map((social) => (
                                <li key={social.label}>
                                    <a
                                        href={social.href}
                                        {...(social.external
                                            ? { target: "_blank", rel: "noopener noreferrer" }
                                            : {})}
                                        className="group inline-flex max-w-full items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e30613]"
                                    >
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.015] text-[#85817d] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-[#e30613]/50 group-hover:bg-[#e30613]/[0.06] group-hover:text-[#e30613]">
                                            <svg
                                                width="17"
                                                height="17"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                aria-hidden="true"
                                            >
                                                {social.icon}
                                            </svg>
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#5c5854]">
                                                {social.label}
                                            </span>
                                            {/* break-all: the Gmail address has no natural
                                                break point and overflows a phone-width column */}
                                            <span className="block text-sm break-all text-[#b5b1ad] transition-colors duration-200 group-hover:text-white">
                                                {social.display}
                                            </span>
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Navigation columns */}
                    {navLinks.map((col) => (
                        <div key={col.heading}>
                            <div className="mb-5 flex items-center gap-2.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#e30613]" />
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#e30613]">
                                    {col.heading}
                                </h3>
                            </div>

                            <ul className="space-y-3.5">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-[#85817d] transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e30613]"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Quote */}
                <div className="mt-16 border-t border-white/[0.07] pt-10">
                    <blockquote className="max-w-2xl">
                        <span aria-hidden="true" className="font-display text-5xl leading-none text-[#e30613]">
                            &ldquo;
                        </span>
                        <p className="mt-1 text-[clamp(1.1rem,2vw,1.5rem)] font-medium leading-[1.5] text-white/80">
                            Silence protects the problem. Voices create the beginning of
                            change.
                        </p>
                    </blockquote>
                </div>
            </div>

            {/* =========================================================
                  BOTTOM BAR
              ========================================================== */}
            <div className="relative z-10 border-t border-white/[0.08]">
                <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-[11px] text-[#696562] sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        © {new Date().getFullYear()} RVJP Movement. All rights reserved.
                    </p>

                    <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#e30613]" />
                        <p className="uppercase tracking-[0.12em]">
                            Built for awareness. Built for change.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
