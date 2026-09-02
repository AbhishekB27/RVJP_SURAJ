'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import {
    MarkerWords,
    addMarkerStroke,
    hideMarkerText,
    type Segment,
} from '@/components/marker-text';
import { inr } from '@/lib/donate';

const heading: Segment[] = [
    { text: 'Donate to' },
    { text: 'RVJP', className: 'text-[#e30613]' },
];

const currencies = [
    { code: 'INR', symbol: '₹' },
    { code: 'USD', symbol: '$' },
];

/** Diaspora donors are common for Indian organisations; trim if not needed. */
const dialCodes = ['+91', '+1', '+44', '+61', '+971'];

const LABEL = 'mb-2 block text-sm font-semibold text-[#f5f5f5]';

const FIELD =
    'w-full rounded-lg border border-white/[0.14] bg-[#0f0f0f] px-4 py-3.5 text-sm text-[#f5f5f5] transition-colors placeholder:text-[#5c5854] focus:border-[#e30613] focus:outline-none';

const SELECT =
    'h-full cursor-pointer appearance-none border-0 bg-[#181818] py-3.5 pl-4 pr-9 text-sm font-semibold text-[#f5f5f5] transition-colors hover:text-white focus:outline-none';

const RING =
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e30613]';

export default function DonateForm({ initialAmount }: { initialAmount?: number }) {
    const sectionRef = useRef<HTMLElement | null>(null);
    const headingRef = useRef<HTMLHeadingElement | null>(null);

    const [currency, setCurrency] = useState('INR');
    const [amount, setAmount] = useState(initialAmount ? String(initialAmount) : '');

    const symbol = currencies.find((c) => c.code === currency)?.symbol ?? '₹';
    const value = Number(amount) || 0;

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.from('.dn-back', { opacity: 0, x: -12, duration: 0.5 }, 0)
                .from('.dn-eyebrow', { opacity: 0, y: 14, duration: 0.6 }, 0.1);

            if (headingRef.current) {
                hideMarkerText(headingRef.current);
                addMarkerStroke(tl, headingRef.current, 0.25);
            }

            tl.from('.dn-rule', {
                scaleX: 0,
                transformOrigin: 'left center',
                duration: 0.6,
            }, 0.6)
                .from('.dn-lede', { opacity: 0, y: 16, duration: 0.6 }, 0.65)
                .from('.dn-field', { opacity: 0, y: 18, duration: 0.6, stagger: 0.07 }, 0.75);
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // INTEGRATION POINT — hand `value` and `currency` to the payment
        // provider here. Nothing is charged until this is wired up.
    };

    return (
        <section
            ref={sectionRef}
            aria-label="Donate to RVJP"
            className="relative isolate overflow-hidden bg-[#0a0a0a] px-6 pb-24 pt-28 font-sans text-[#f5f5f5]"
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-8 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[#e30613]/[0.12] blur-[150px]"
            />

            <div className="mx-auto max-w-[58rem]">
                {/* ---- Back: a pill, so it reads as a control rather than body text ---- */}
                <Link
                    href="/"
                    className={`dn-back group inline-flex items-center gap-2.5 rounded-full border border-white/[0.14] px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#9a9693] transition-colors duration-300 hover:border-[#e30613] hover:text-[#f5f5f5] ${RING}`}
                >
                    <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        aria-hidden="true"
                        className="text-[#e30613] transition-transform duration-300 ease-out group-hover:-translate-x-1"
                    >
                        <path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back to home
                </Link>

                {/* ---- Header: headline and copy side by side, so the page does
                     not read as one narrow column stacked all the way down ---- */}
                <div className="mt-14 grid grid-cols-1 gap-x-14 gap-y-6 lg:grid-cols-[1.05fr_1fr] lg:items-end">
                    <div>
                        <p className="dn-eyebrow flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[#e30613]">
                            <span className="h-1.5 w-1.5 bg-[#e30613]" />
                            Donate
                        </p>

                        <h1
                            ref={headingRef}
                            className="font-display mt-6 text-[clamp(2.4rem,8vw,3rem)] uppercase leading-[0.94] lg:text-[clamp(2.8rem,4.2vw,3.8rem)]"
                        >
                            <MarkerWords segments={heading} />
                        </h1>

                        <div className="dn-rule mt-6 h-1 w-14 bg-[#e30613]" />
                    </div>

                    <p className="dn-lede text-[1rem] leading-relaxed text-[#9a9693] lg:pb-2">
                        Awareness is free to talk about and expensive to do. Your gift
                        funds legal aid, counselling, and the outreach that reaches
                        districts we otherwise could not.
                    </p>
                </div>

                {/* ============ FORM — no card, the fields carry themselves ============ */}
                <form onSubmit={handleSubmit} className="mt-12">
                    {/* ---- Amount ---- */}
                    <div className="dn-field">
                        <label htmlFor="donate-amount" className={LABEL}>
                            Amount
                        </label>

                        <div className="flex overflow-hidden rounded-lg border border-white/[0.14] transition-colors focus-within:border-[#e30613]">
                            <div className="relative shrink-0 border-r border-white/[0.14]">
                                <label htmlFor="donate-currency" className="sr-only">
                                    Currency
                                </label>
                                <select
                                    id="donate-currency"
                                    name="currency"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className={`${SELECT} ${RING} [color-scheme:dark]`}
                                >
                                    {currencies.map((c) => (
                                        <option key={c.code} value={c.code}>
                                            {c.code}
                                        </option>
                                    ))}
                                </select>
                                <svg
                                    aria-hidden="true"
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9693]"
                                >
                                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            <input
                                id="donate-amount"
                                name="amount"
                                type="number"
                                min={1}
                                required
                                autoFocus
                                inputMode="decimal"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-[#0f0f0f] px-4 py-3.5 text-sm text-[#f5f5f5] outline-none placeholder:text-[#5c5854] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                        </div>
                    </div>

                    {/* ---- Name & contact ---- */}
                    <div className="mt-7 grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2">
                        <div className="dn-field">
                            <label htmlFor="donor-first" className={LABEL}>
                                First name
                            </label>
                            <input
                                id="donor-first"
                                name="firstName"
                                type="text"
                                required
                                autoComplete="given-name"
                                placeholder="First name"
                                className={FIELD}
                            />
                        </div>

                        <div className="dn-field">
                            <label htmlFor="donor-last" className={LABEL}>
                                Last name
                            </label>
                            <input
                                id="donor-last"
                                name="lastName"
                                type="text"
                                required
                                autoComplete="family-name"
                                placeholder="Last name"
                                className={FIELD}
                            />
                        </div>

                        <div className="dn-field">
                            <label htmlFor="donor-email" className={LABEL}>
                                Email address
                            </label>
                            <input
                                id="donor-email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="Email address"
                                className={FIELD}
                            />
                        </div>

                        <div className="dn-field">
                            <label htmlFor="donor-phone" className={LABEL}>
                                Phone number
                            </label>

                            <div className="flex overflow-hidden rounded-lg border border-white/[0.14] transition-colors focus-within:border-[#e30613]">
                                <div className="relative shrink-0 border-r border-white/[0.14]">
                                    <label htmlFor="donor-dial" className="sr-only">
                                        Country code
                                    </label>
                                    <select
                                        id="donor-dial"
                                        name="dialCode"
                                        defaultValue="+91"
                                        className={`${SELECT} ${RING} [color-scheme:dark]`}
                                    >
                                        {dialCodes.map((code) => (
                                            <option key={code} value={code}>
                                                {code}
                                            </option>
                                        ))}
                                    </select>
                                    <svg
                                        aria-hidden="true"
                                        width="13"
                                        height="13"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9693]"
                                    >
                                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>

                                <input
                                    id="donor-phone"
                                    name="phone"
                                    type="tel"
                                    autoComplete="tel-national"
                                    placeholder="Phone number"
                                    className="w-full bg-[#0f0f0f] px-4 py-3.5 text-sm text-[#f5f5f5] outline-none placeholder:text-[#5c5854]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ---- Opt in and submit share a row, so the form ends wide
                         rather than adding two more stacked bands ---- */}
                    <div className="dn-field mt-9 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[#c2beba]">
                            <input
                                type="checkbox"
                                name="signUp"
                                className={`mt-0.5 h-[18px] w-[18px] shrink-0 accent-[#e30613] ${RING}`}
                            />
                            I would like to sign up as a donor on RVJP
                        </label>

                        <button
                            type="submit"
                            disabled={value <= 0}
                            className={`shrink-0 rounded-lg bg-[#e30613] px-8 py-3.5 text-sm font-bold text-white transition-colors duration-300 hover:bg-[#ff2733] disabled:cursor-not-allowed disabled:bg-[#3a1113] disabled:text-white/40 ${RING}`}
                        >
                            {value > 0 ? `Donate ${symbol}${inr(value)}` : 'Donate now'}
                        </button>
                    </div>
                </form>

                <p className="dn-field mt-8 border-t border-white/[0.09] pt-6 text-[0.8rem] leading-relaxed text-[#5c5854]">
                    Receipt emailed · Details never shared ·{' '}
                    <Link
                        href="/join"
                        className={`font-semibold text-[#9a9693] underline underline-offset-4 transition-colors hover:text-[#f5f5f5] ${RING}`}
                    >
                        Rather give time?
                    </Link>
                </p>
            </div>
        </section>
    );
}
