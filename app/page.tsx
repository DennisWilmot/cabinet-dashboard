'use client';

import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';

function LoginCard() {
  const { signIn, isLoading } = useAuth();

  return (
    <div className="w-full space-y-5">
      <button
        onClick={() => signIn()}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-lg bg-text-on-dark text-sidebar font-bold text-[length:var(--text-body)] hover:bg-gold transition-all disabled:opacity-60 cursor-pointer"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {isLoading ? 'Connecting...' : 'Sign in with Google'}
      </button>
      <p className="text-text-on-dark-faint text-[length:var(--text-micro)] text-center">
        Use your government Google Workspace account
      </p>
    </div>
  );
}


const PEOPLE = [
  { name: 'Hon. Fayval Williams, MP', title: 'Minister of Finance', src: '/avatars/fayval-williams.jpeg' },
  { name: 'Hon. Zavia Mayne, MP', title: 'State Minister, Finance', src: '/avatars/zavia-mayne.jpg' },
  { name: 'Ms. Darlene Morrison, CD', title: 'Financial Secretary', src: '/avatars/darlene-morrison.jpg' },
  { name: 'Ainsley Powell, CD', title: 'Commissioner General, TAJ', src: '/avatars/ainsley-powell.jpg' },
  { name: 'Dr. Wayne Henry', title: 'Director General, PIOJ', src: '/avatars/wayne-henry.jpg' },
];

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && isAuthenticated) {
    if (typeof window !== 'undefined') window.location.href = '/dashboard';
    return null;
  }

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

            <h1 className="text-[length:var(--text-display)] sm:text-[length:clamp(2.625rem,5vw+1rem,4rem)] font-bold text-text-on-dark leading-[1.1] tracking-tight font-[family-name:var(--font-display)]">
              Track how Jamaica&rsquo;s budget is being spent
            </h1>

            <p className="mt-6 text-[length:var(--text-h3)] sm:text-[length:var(--text-h2)] text-text-on-dark-muted max-w-xl mx-auto lg:mx-0 leading-[1.65]">
              Real-time budget execution data for every ministry, department, and agency &mdash; built for transparency and accountability.
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
            <div className="bg-surface-dark-raised border border-border-dark rounded-2xl p-8">
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

      {/* Features — alternating image/text rows */}
      <section id="features" className="bg-page">
        {/* Feature 1 */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[420px]">
            <div className="relative overflow-hidden bg-sidebar min-h-[280px] lg:min-h-0">
              <Image
                src="/kingstonjm.jpg"
                alt="Kingston skyline"
                fill
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30 lg:bg-gradient-to-l" />
              <div className="absolute bottom-6 left-6 right-6 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sidebar/90 text-gold text-[length:var(--text-micro)] font-semibold tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  18 Ministries
                </div>
              </div>
            </div>
            <div className="flex items-center px-8 sm:px-14 py-14 lg:py-20">
              <div>
                <div className="w-12 h-12 rounded-lg bg-jm-green/10 text-jm-green flex items-center justify-center mb-6">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                  </svg>
                </div>
                <h2 className="text-[length:var(--text-h1)] sm:text-[length:var(--text-display)] font-bold text-text-primary tracking-tight font-[family-name:var(--font-display)] leading-tight">
                  Budget at a Glance
                </h2>
                <p className="mt-4 text-text-secondary text-[length:var(--text-h3)] leading-relaxed max-w-md">
                  See how <strong className="text-text-primary">$1.4 trillion</strong> in public funds flows across 18 ministries &mdash; from allocation to expenditure, in a single view.
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
            </div>
          </div>
        </div>

        {/* Feature 2 — reversed */}
        <div className="max-w-7xl mx-auto border-t border-border-default">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[420px]">
            <div className="flex items-center px-8 sm:px-14 py-14 lg:py-20 order-2 lg:order-1">
              <div>
                <div className="w-12 h-12 rounded-lg bg-gold/15 text-gold-dark flex items-center justify-center mb-6">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                  </svg>
                </div>
                <h2 className="text-[length:var(--text-h1)] sm:text-[length:var(--text-display)] font-bold text-text-primary tracking-tight font-[family-name:var(--font-display)] leading-tight">
                  Drill Down to Detail
                </h2>
                <p className="mt-4 text-text-secondary text-[length:var(--text-h3)] leading-relaxed max-w-md">
                  From the full Cabinet overview, drill into individual ministries, operational programmes, recurring obligations, and capital projects.
                </p>
                <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-[length:var(--text-caption)] text-text-secondary">
                  <span><strong className="text-[length:var(--text-h2)] font-bold text-text-primary">3</strong> levels deep</span>
                  <span className="text-border-strong">/</span>
                  <span><strong className="text-[length:var(--text-h2)] font-bold text-text-primary">100+</strong> budget heads</span>
                  <span className="text-border-strong">/</span>
                  <span><strong className="text-[length:var(--text-h2)] font-bold text-text-primary">6</strong> months data</span>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden bg-sidebar min-h-[280px] lg:min-h-0 order-1 lg:order-2">
              <div className="absolute inset-0 bg-sidebar flex items-center justify-center p-10">
                <div className="w-full max-w-sm space-y-3">
                  {['Cabinet Overview', 'Ministry of Finance', 'Tax Administration Jamaica', 'Revenue Collection Programme'].map((label, i) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg border transition-all"
                      style={{
                        marginLeft: `${i * 16}px`,
                        borderColor: i === 3 ? 'oklch(83% 0.17 85)' : 'oklch(32% 0.015 155)',
                        background: i === 3 ? 'oklch(24% 0.015 155)' : 'oklch(18% 0.01 155)',
                      }}
                    >
                      <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
                        style={{
                          background: i === 3 ? 'oklch(83% 0.17 85)' : 'oklch(32% 0.015 155)',
                          color: i === 3 ? 'oklch(16% 0.01 155)' : 'oklch(55% 0.01 155)',
                        }}
                      >
                        L{i}
                      </div>
                      <span className="text-sm text-text-on-dark-muted font-medium">{label}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 ml-12 mt-1">
                    <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                    <span className="text-xs text-text-on-dark-faint">Keep drilling</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="max-w-7xl mx-auto border-t border-border-default">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[420px]">
            <div className="relative overflow-hidden min-h-[280px] lg:min-h-0">
              <div className="absolute inset-0 bg-sidebar flex items-center justify-center p-10">
                <div className="w-full max-w-xs space-y-5">
                  {[
                    { label: 'On Track', pct: 72, color: 'oklch(56% 0.16 155)', bg: 'rgba(34,139,34,0.15)' },
                    { label: 'At Risk', pct: 45, color: 'oklch(83% 0.17 85)', bg: 'rgba(218,165,32,0.15)' },
                    { label: 'Off Track', pct: 18, color: 'oklch(55% 0.22 27)', bg: 'rgba(178,34,34,0.15)' },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                          <span className="text-sm font-semibold text-text-on-dark-muted">{s.label}</span>
                        </span>
                        <span className="text-sm font-bold text-text-on-dark-faint">{s.pct}%</span>
                      </div>
                      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: s.bg }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, background: s.color }} />
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-border-dark flex items-center gap-2 text-xs text-text-on-dark-faint">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Updated monthly &middot; Status auto-derived
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center px-8 sm:px-14 py-14 lg:py-20">
              <div>
                <div className="w-12 h-12 rounded-lg bg-status-off-track/10 text-status-off-track flex items-center justify-center mb-6">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <h2 className="text-[length:var(--text-h1)] sm:text-[length:var(--text-display)] font-bold text-text-primary tracking-tight font-[family-name:var(--font-display)] leading-tight">
                  Track Progress Monthly
                </h2>
                <p className="mt-4 text-text-secondary text-[length:var(--text-h3)] leading-relaxed max-w-md">
                  Every ministry gets an automatic status assessment. Clear thresholds determine whether spending is <strong className="text-jm-green-dark">on track</strong>, <strong className="text-gold-dark">at risk</strong>, or <strong className="text-status-off-track">off track</strong> &mdash; with tooltips explaining exactly why.
                </p>
                <p className="mt-4 text-text-secondary text-[length:var(--text-caption)]">
                  No subjective ratings. Status is derived from data using transparent rules tied to the fiscal calendar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* People */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <Image
          src="/kingstonjm.jpg"
          alt="Kingston backdrop"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/85" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-14">
            <p className="text-gold text-[length:var(--text-caption)] font-semibold tracking-widest uppercase mb-4">Accountable Leadership</p>
            <h2 className="text-[length:var(--text-h1)] sm:text-[length:var(--text-display)] font-bold text-text-on-dark tracking-tight font-[family-name:var(--font-display)]">
              The people behind the numbers
            </h2>
            <p className="mt-4 text-text-on-dark-muted text-[length:var(--text-h3)] max-w-2xl mx-auto leading-[1.65]">
              Jamaica&rsquo;s cabinet ministers and permanent secretaries are accountable for delivering results. This dashboard helps citizens and officials track progress at every level.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8">
            {PEOPLE.map(p => (
              <div key={p.name} className="flex flex-col items-center text-center group">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-4 shimmer-hover rounded-full">
                  <Image
                    src={p.src}
                    alt={p.name}
                    fill
                    className="rounded-full object-cover border-2 border-gold/30 group-hover:border-gold transition-colors"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-sidebar" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                </div>
                <p className="text-text-on-dark text-[length:var(--text-caption)] font-semibold leading-tight">{p.name}</p>
                <p className="text-gold text-[length:var(--text-micro)] mt-1.5 leading-snug">{p.title}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-text-on-dark-faint text-[length:var(--text-caption)]">
              Tracking leadership across <strong className="text-text-on-dark-muted">18 ministries</strong> and <strong className="text-text-on-dark-muted">90+ entities</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Source / Trust */}
      <section className="bg-page py-12 border-t border-border-default">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Image
              src="/Coat_of_arms_of_Jamaica.svg.png"
              alt="Jamaica Coat of Arms"
              width={40}
              height={40}
              className="w-10 h-10 opacity-60"
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
