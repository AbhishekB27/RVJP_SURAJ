'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { posts } from '@/lib/posts';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function BlogSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headRef.current,
          start: 'top 85%',
        },
      });

      if (gridRef.current) {
        gsap.from(gridRef.current.children, {
          opacity: 0,
          y: 40,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
          },
        });
      }

      gsap.from(ctaRef.current, {
        opacity: 0,
        y: 40,
        scale: 0.97,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 90%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="rvjp-blog" ref={sectionRef} id="blog" aria-label="Blog">
      <style>{`
        .rvjp-blog {
          --bg: #0a0a0a;
          --card: #131313;
          --card-2: #0d0d0d;
          --card-border: rgba(255, 255, 255, 0.09);
          --ink: #f5f5f5;
          --red: #e30613;
          --red-soft: rgba(227, 6, 19, 0.14);
          --muted: #9a9693;
          position: relative;
          background: var(--bg);
          color: var(--ink);
          font-family: var(--font-sans), system-ui, sans-serif;
          padding: 6.5rem 1.5rem;
          overflow: hidden;
        }

        .rvjp-blog__watermark {
          position: absolute;
          top: 0.5rem;
          left: 50%;
          transform: translateX(-50%);
          font-family: var(--font-display), "Arial Narrow", Impact, sans-serif;
          font-size: clamp(5rem, 16vw, 11rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.05);
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
          z-index: 0;
        }

        .rvjp-blog__head {
          position: relative;
          z-index: 1;
          max-width: 40rem;
          margin: 0 auto 3.5rem;
          text-align: center;
        }

        .rvjp-blog__eyebrow {
          display: block;
          font-size: 0.75rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--red);
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .rvjp-blog__title {
          font-family: var(--font-display), "Arial Narrow", Impact, sans-serif;
          font-size: clamp(2rem, 4.2vw, 3rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.01em;
          line-height: 1.02;
          margin: 0 0 1.1rem;
        }

        .rvjp-blog__title span {
          color: var(--red);
        }

        .rvjp-blog__rule {
          width: 3.5rem;
          height: 4px;
          background: var(--red);
          margin: 0 auto 1.3rem;
        }

        .rvjp-blog__lede {
          color: var(--muted);
          font-size: 1rem;
          line-height: 1.6;
        }

        /* ---------- Blog grid ---------- */
        .rvjp-blog__grid {
          position: relative;
          z-index: 1;
          max-width: 74rem;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.75rem;
        }

        @media (max-width: 64rem) {
          .rvjp-blog__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 42rem) {
          .rvjp-blog__grid {
            grid-template-columns: 1fr;
          }
        }

        .blog-card {
          position: relative;
          display: block;
          border-radius: 22px;
          padding: 1.5px;
          background: linear-gradient(160deg, rgba(227, 6, 19, 0.35), rgba(255, 255, 255, 0.06) 40%, transparent 70%);
          cursor: pointer;
          color: inherit;
          text-decoration: none;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .blog-card:hover {
          transform: translateY(-6px);
        }

        .blog-card:focus-visible {
          outline: 2px solid var(--red);
          outline-offset: 4px;
        }

        .blog-card__inner {
          position: relative;
          height: 100%;
          border-radius: 20.5px;
          background: linear-gradient(160deg, var(--card), var(--card-2) 70%);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .blog-card__media {
          position: relative;
          aspect-ratio: 16 / 10;
          background: linear-gradient(150deg, #1a1a1a, #0c0c0c);
          overflow: hidden;
        }

        .blog-card__media img {
          position: absolute;
          inset: 0;
          z-index: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          /* held back a little so the brand tint reads, released on hover */
          filter: grayscale(0.45) contrast(1.06);
          transition: filter 0.5s ease;
        }

        .blog-card:hover .blog-card__media img {
          filter: grayscale(0) contrast(1);
        }

        /* red wash + a scrim so the chips and the card body stay readable */
        .blog-card__media::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            radial-gradient(circle at 30% 20%, rgba(227, 6, 19, 0.34), transparent 62%),
            linear-gradient(to top, rgba(19, 19, 19, 0.96), rgba(19, 19, 19, 0.12) 48%, rgba(10, 10, 10, 0.4));
        }

        /* halftone dots, printed over the photo */
        .blog-card__media::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 1;
          background-image: radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px);
          background-size: 14px 14px;
        }

        .blog-card__read {
          position: absolute;
          top: 1rem;
          right: 1rem;
          z-index: 2;
          font-size: 0.66rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.78);
          background: rgba(10, 10, 10, 0.6);
          backdrop-filter: blur(6px);
          padding: 0.35rem 0.7rem;
          border-radius: 999px;
        }

        .blog-card__category {
          position: absolute;
          top: 1rem;
          left: 1rem;
          z-index: 2;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--red);
          background: rgba(10, 10, 10, 0.75);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(227, 6, 19, 0.3);
          padding: 0.35rem 0.75rem;
          border-radius: 999px;
        }

        .blog-card__body {
          position: relative;
          padding: 1.7rem 1.7rem 1.6rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .blog-card__title {
          font-size: 1.08rem;
          font-weight: 800;
          line-height: 1.35;
          margin: 0 0 0.65rem;
        }

        .blog-card__excerpt {
          color: var(--muted);
          font-size: 0.88rem;
          line-height: 1.6;
          margin: 0 0 1.4rem;
          flex-grow: 1;
        }

        .blog-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding-top: 1.1rem;
          border-top: 1px solid var(--card-border);
        }

        .blog-card__meta {
          display: flex;
          flex-direction: column;
        }

        .blog-card__meta strong {
          font-size: 0.8rem;
          font-weight: 700;
        }

        .blog-card__meta span {
          font-size: 0.74rem;
          color: var(--muted);
        }

        .blog-card__arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.2rem;
          height: 2.2rem;
          border-radius: 50%;
          background: var(--red-soft);
          border: 1px solid rgba(227, 6, 19, 0.35);
          color: var(--red);
          flex-shrink: 0;
          transition: transform 0.25s ease, background 0.25s ease;
        }

        .blog-card:hover .blog-card__arrow {
          background: var(--red);
          color: #ffffff;
          transform: rotate(45deg);
        }

        /* ---------- CTA bar ---------- */
        .rvjp-blog__cta {
          position: relative;
          z-index: 1;
          max-width: 74rem;
          margin: 4.5rem auto 0;
          background: #0f0f0f;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 22px;
          padding: 3rem;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1.75rem;
          overflow: hidden;
          background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 16px 16px;
        }

        .rvjp-blog__cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--red), transparent);
        }

        .rvjp-blog__cta-icon {
          position: absolute;
          right: -2rem;
          bottom: -2rem;
          width: 13rem;
          height: 13rem;
          opacity: 0.14;
          color: var(--red);
          pointer-events: none;
        }

        .rvjp-blog__cta-text {
          position: relative;
          z-index: 1;
          max-width: 30rem;
        }

        .rvjp-blog__cta-text span {
          display: block;
          font-size: 0.72rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--red);
          font-weight: 700;
          margin-bottom: 0.7rem;
        }

        .rvjp-blog__cta-text h3 {
          font-size: clamp(1.5rem, 3.2vw, 2.2rem);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          line-height: 1.05;
          margin: 0 0 0.6rem;
          color: var(--ink);
        }

        .rvjp-blog__cta-text p {
          margin: 0;
          color: var(--muted);
          font-size: 0.95rem;
          line-height: 1.5;
        }

        /* ---------- Newsletter form ---------- */
        .rvjp-blog__form {
          position: relative;
          z-index: 1;
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .rvjp-blog__input {
          flex: 1 1 15rem;
          min-width: 0;
          background: #0a0a0a;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          padding: 1.05rem 1.1rem;
          color: var(--ink);
          font-family: inherit;
          font-size: 0.9rem;
          transition: border-color 0.2s ease;
        }

        .rvjp-blog__input::placeholder {
          color: #5c5854;
        }

        .rvjp-blog__input:focus {
          outline: none;
          border-color: var(--red);
        }

        .rvjp-blog__note {
          position: relative;
          z-index: 1;
          flex-basis: 100%;
          margin: 0;
          font-size: 0.72rem;
          color: #5c5854;
        }

        .rvjp-blog__done {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--ink);
        }

        .rvjp-blog__done span {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.2rem;
          height: 2.2rem;
          flex-shrink: 0;
          border-radius: 50%;
          background: var(--red-soft);
          border: 1px solid rgba(227, 6, 19, 0.4);
          color: var(--red);
        }

        .rvjp-blog__btn {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: var(--red);
          color: #ffffff;
          border: none;
          padding: 1.05rem 2.2rem;
          font-weight: 800;
          font-size: 0.9rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border-radius: 10px;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s ease;
        }

        .rvjp-blog__btn:hover {
          background: #ff2733;
        }

        .rvjp-blog__btn:focus-visible {
          outline: 2px solid #ffffff;
          outline-offset: 3px;
        }

        /* Takes the reader from the three teasers here to the full index. */
        .rvjp-blog__more {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: center;
          margin-top: 3rem;
        }

        .rvjp-blog__more-link {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 1rem 2.2rem;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 10px;
          color: var(--ink);
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: none;
          transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
        }

        .rvjp-blog__more-link:hover {
          border-color: var(--red);
          background: var(--red);
          color: #ffffff;
        }

        .rvjp-blog__more-link:focus-visible {
          outline: 2px solid var(--red);
          outline-offset: 3px;
        }

        .rvjp-blog__more-link svg {
          transition: transform 0.2s ease;
        }

        .rvjp-blog__more-link:hover svg {
          transform: translate(2px, -2px);
        }
      `}</style>

      <span className="rvjp-blog__watermark" aria-hidden="true">
        Blog
      </span>

      <div className="rvjp-blog__head" ref={headRef}>
        <span className="rvjp-blog__eyebrow">Blog</span>
        <h2 className="rvjp-blog__title">
          Stories, guides <span>&amp; updates</span>
        </h2>
        <div className="rvjp-blog__rule" />
        <p className="rvjp-blog__lede">
          Reporting, resources, and reflections from the ground — written to
          inform, not to sensationalize.
        </p>
      </div>

      <div className="rvjp-blog__grid" ref={gridRef}>
        {posts.map((post) => (
          <Link href={`/blog/${post.slug}`} className="blog-card" key={post.slug}>
            <article className="blog-card__inner">
              <div className="blog-card__media">
                <img src={post.image} alt={post.alt} loading="lazy" />
                <span className="blog-card__category">{post.category}</span>
                <span className="blog-card__read">{post.readTime}</span>
              </div>
              <div className="blog-card__body">
                <h3 className="blog-card__title">{post.title}</h3>
                <p className="blog-card__excerpt">{post.excerpt}</p>
                <div className="blog-card__footer">
                  <div className="blog-card__meta">
                    <strong>{post.author}</strong>
                    <span>{post.date}</span>
                  </div>
                  <span className="blog-card__arrow" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M7 17L17 7M17 7H9M17 7V15" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      <div className="rvjp-blog__more">
        <Link href="/blog" className="rvjp-blog__more-link">
          Read all articles
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path
              d="M7 17L17 7M17 7H9M17 7V15"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      <div className="rvjp-blog__cta" ref={ctaRef}>
        <svg
          className="rvjp-blog__cta-icon"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M20 30h60M20 45h60M20 60h40" strokeLinecap="round" />
        </svg>
        <div className="rvjp-blog__cta-text">
          <span>Stay informed</span>
          <h3>Get new articles in your inbox</h3>
          <p>One thoughtful email a month. No spam, unsubscribe anytime.</p>
        </div>

        {subscribed ? (
          <p className="rvjp-blog__done" role="status">
            <span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            You&rsquo;re on the list. Look out for the next one.
          </p>
        ) : (
          <form className="rvjp-blog__form" onSubmit={handleSubscribe}>
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              className="rvjp-blog__input"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="rvjp-blog__btn" type="submit">
              Subscribe
            </button>
            <p className="rvjp-blog__note">
              We&rsquo;ll never share your address.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
