'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';
import { ministryRegistry, ministryOrder } from '@/lib/data';

function LoginCard() {
  const handleSignIn = () => {
    authClient.signIn.social({
      provider: 'google',
      callbackURL: '/dashboard',
    });
  };

  return (
    <div className="w-full space-y-5">
      <button
        onClick={handleSignIn}
        className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-lg bg-text-on-dark text-sidebar font-bold text-[length:var(--text-body)] hover:bg-gold transition-all cursor-pointer"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Sign in with Google
      </button>
      <p className="text-text-on-dark-faint text-[length:var(--text-micro)] text-center">
        Use your government Google Workspace account
      </p>
    </div>
  );
}


function MinistryCarousel() {
  const ministers = ministryOrder.map(slug => {
    const d = ministryRegistry[slug];
    return {
      name: d.overview.minister.name,
      title: d.overview.shortName,
      src: d.overview.minister.avatarUrl,
      slug,
    };
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf: number;
    let speed = 0.5;

    const step = () => {
      if (!paused && el) {
        el.scrollLeft += speed;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  const doubled = [...ministers, ...ministers];

  return (
    <div
      ref={scrollRef}
      className="flex gap-6 sm:gap-8 overflow-x-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {doubled.map((m, i) => (
        <div key={`${m.slug}-${i}`} className="flex-shrink-0 flex flex-col items-center text-center w-28 sm:w-32 group">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-3 shimmer-hover rounded-full">
            <Image
              src={m.src}
              alt={m.name}
              fill
              className="rounded-full object-cover border-2 border-gold/30 group-hover:border-gold transition-colors"
            />
          </div>
          <p className="text-text-on-dark text-[length:var(--text-micro)] sm:text-[length:var(--text-caption)] font-semibold leading-tight">{m.name.replace(/^(Most Hon\.|Hon\.|Sen\.|Senator Hon\.|Dr\. the Hon\.) /, '')}</p>
          <p className="text-gold text-[length:var(--text-micro)] mt-1 leading-snug">{m.title}</p>
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  useEffect(() => {
    const c = document.cookie;
    const hasSession =
      c.includes('better-auth.session_token') ||
      c.includes('better-auth.session_data');
    if (hasSession) {
      window.location.href = '/dashboard';
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="/kingstonjm.jpg"
          alt="Kingston, Jamaica"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 py-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left: copy */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
              <Image
                src="/Coat_of_arms_of_Jamaica.svg.png"
                alt="Jamaica Coat of Arms"
                width={64}
                height={64}
                className="w-14 h-14 sm:w-16 sm:h-16"
              />
              <div>
                <p className="text-gold font-semibold text-[length:var(--text-caption)] tracking-widest uppercase">Government of Jamaica</p>
                <p className="text-text-on-dark-muted text-[length:var(--text-micro)] tracking-wide">Ministry of Finance &amp; the Public Service</p>
              </div>
            </div>

            <h1 className="text-[length:clamp(1.75rem,6vw,2.625rem)] sm:text-[length:clamp(2.625rem,5vw+1rem,4rem)] font-bold text-text-on-dark leading-[1.1] tracking-tight font-[family-name:var(--font-display)]">
              What Gets Measured Gets Done
          </h1>

            <p className="mt-6 text-[length:var(--text-h3)] sm:text-[length:var(--text-h2)] text-text-on-dark-muted max-w-xl mx-auto lg:mx-0 leading-[1.65]">
              The GoJ Budget Tracker gives Cabinet Ministers vital leading performance indicators across ministries, departments and agencies for accountability and accelerated outcomes.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-[length:var(--text-caption)] text-text-on-dark-faint">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-jm-green" />
                18 ministries
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold" />
                FY 2026-27
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-text-on-dark-faint" />
                Updated monthly
              </span>
            </div>

            <a
              href="#features"
              className="inline-flex items-center gap-2 mt-10 text-gold hover:text-white transition-colors text-[length:var(--text-caption)] font-medium"
            >
              Learn more
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
              </svg>
            </a>
          </div>

          {/* Right: login */}
          <div className="w-full max-w-sm flex-shrink-0">
            <div className="bg-surface-dark-raised border border-border-dark rounded-2xl p-6 sm:p-8">
              <h2 className="text-[length:var(--text-h2)] font-bold text-text-on-dark mb-1">Sign in</h2>
              <p className="text-text-on-dark-muted text-[length:var(--text-caption)] mb-6">Access the Cabinet Dashboard</p>
              <LoginCard />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <svg className="w-5 h-5 text-text-on-dark-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-page">
        {/* Feature 1 */}
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 sm:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-[length:var(--text-h1)] sm:text-[length:var(--text-display)] font-bold text-text-primary tracking-tight font-[family-name:var(--font-display)] leading-tight">
                Your Spending at a Glance
              </h2>
              <p className="mt-5 text-text-secondary text-[length:var(--text-h3)] leading-relaxed max-w-lg">
                See how <strong className="text-text-primary">$1.4 trillion</strong> in public funds flows across 18 ministries, from allocation to expenditure, in a single view.
              </p>
              <div className="mt-6 flex items-center gap-6 text-[length:var(--text-caption)] text-text-secondary">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-jm-green" />
                  Recurrent
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold" />
                  Capital
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sidebar" />
                  Debt Service
                </span>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="bg-sidebar rounded-xl p-3 sm:p-4 shadow-2xl shadow-black/20">
                <Image
                  src="/feature-spending.png"
                  alt="Budget spending overview showing allocation across ministries"
                  width={1200}
                  height={800}
                  className="rounded-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2 — Early Indicators */}
        <div className="border-t border-border-default">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 sm:py-24 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <div className="bg-sidebar rounded-xl p-3 sm:p-4 shadow-2xl shadow-black/20">
                  <Image
                    src="/feature-indicators.png"
                    alt="Early progress indicators showing on track, at risk, and off track statuses"
                    width={1200}
                    height={800}
                    className="rounded-lg w-full h-auto"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-[length:var(--text-h1)] sm:text-[length:var(--text-display)] font-bold text-text-primary tracking-tight font-[family-name:var(--font-display)] leading-tight">
                  See Early Progress Indicators
                </h2>
                <p className="mt-5 text-text-secondary text-[length:var(--text-h3)] leading-relaxed max-w-lg">
                  Your near-real time automated status assessment shows whether spending is <strong className="text-jm-green-dark">on track</strong>, <strong className="text-gold-dark">at risk</strong>, or <strong className="text-status-off-track">off track</strong>, with reasons why.
                </p>
                <p className="mt-4 text-text-secondary text-[length:var(--text-caption)] max-w-lg">
                  No subjective ratings. Status is derived from data using transparent rules tied to the fiscal calendar.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3 — Blockers */}
        <div className="border-t border-border-default">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 sm:py-24 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="text-[length:var(--text-h1)] sm:text-[length:var(--text-display)] font-bold text-text-primary tracking-tight font-[family-name:var(--font-display)] leading-tight">
                  Your Blockers Made Visible
                </h2>
                <p className="mt-5 text-text-secondary text-[length:var(--text-h3)] leading-relaxed max-w-lg">
                  See critical issues ahead of time, and use AI to drill down for new insights.
                </p>
                <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-[length:var(--text-caption)] text-text-secondary">
                  <span><strong className="text-[length:var(--text-h2)] font-bold text-text-primary">3</strong> levels deep</span>
                  <span className="text-border-strong">/</span>
                  <span><strong className="text-[length:var(--text-h2)] font-bold text-text-primary">100+</strong> budget heads</span>
                  <span className="text-border-strong">/</span>
                  <span><strong className="text-[length:var(--text-h2)] font-bold text-text-primary">6</strong> months data</span>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="bg-sidebar rounded-xl p-3 sm:p-4 shadow-2xl shadow-black/20">
                  <Image
                    src="/feature-blockers.png"
                    alt="Blockers and critical issues visibility with AI drill-down"
                    width={1200}
                    height={800}
                    className="rounded-lg w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ministry Breakdown */}
      <section className="relative py-14 sm:py-20 md:py-28 overflow-hidden">
        <Image
          src="/kingstonjm.jpg"
          alt="Kingston backdrop"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/85" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-gold text-[length:var(--text-caption)] font-semibold tracking-widest uppercase mb-4">Across Government</p>
            <h2 className="text-[length:var(--text-h1)] sm:text-[length:var(--text-display)] font-bold text-text-on-dark tracking-tight font-[family-name:var(--font-display)]">
              Ministry by Ministry Breakdown
            </h2>
            <p className="mt-4 text-text-on-dark-muted text-[length:var(--text-h3)] max-w-2xl mx-auto leading-[1.65]">
              Every ministry has a dedicated dashboard with budget execution data, staffing, KPIs, and project tracking &mdash; led by the ministers accountable for results.
            </p>
          </div>

          <MinistryCarousel />

          <div className="text-center mt-10 sm:mt-12">
            <p className="text-text-on-dark-faint text-[length:var(--text-caption)]">
              <strong className="text-text-on-dark-muted">18 ministries</strong> &middot; <strong className="text-text-on-dark-muted">90+ entities</strong> &middot; <strong className="text-text-on-dark-muted">Updated monthly</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Source / Trust */}
      <section className="bg-page py-12 border-t border-border-default">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <Image
              src="/Coat_of_arms_of_Jamaica.svg.png"
              alt="Jamaica Coat of Arms"
              width={40}
              height={40}
              className="w-8 h-8 sm:w-10 sm:h-10 opacity-60 flex-shrink-0"
            />
            <div className="text-[length:var(--text-caption)] text-text-secondary">
              <p>Data sourced from the <strong className="text-text-primary">Estimates of Expenditure 2026-27</strong></p>
              <p className="text-[length:var(--text-micro)] mt-0.5">As Passed in the House of Representatives, 24 March 2026</p>
            </div>
          </div>
          <p className="text-[length:var(--text-micro)] text-text-secondary/60">
            &copy; {new Date().getFullYear()} Government of Jamaica &middot; Cabinet Dashboard Prototype
          </p>
        </div>
      </section>
    </div>
  );
}
