'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useMockData } from '@/lib/context';
import { useAuth } from '@/lib/auth-context';

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
      </svg>
    ),
  },
  {
    href: '/recovery',
    label: 'Recovery',
    section: 'National',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      </svg>
    ),
  },
  {
    href: '/national-outcomes',
    label: 'Vision 2030',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
  {
    href: '/meetings',
    label: 'Meetings',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
  {
    href: '/actions',
    label: 'Actions',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    href: '/blockers',
    label: 'Blockers',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
    ),
  },
  {
    href: '/okrs',
    label: 'OKRs',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
];

const COLLAPSE_KEY = 'sidebar-collapsed';

export function Sidebar() {
  const pathname = usePathname();
  const { mockDataEnabled, toggleMockData } = useMockData();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COLLAPSE_KEY);
    if (stored === 'true') setCollapsed(true);
  }, []);

  const toggleCollapse = () => {
    setCollapsed(prev => {
      localStorage.setItem(COLLAPSE_KEY, String(!prev));
      return !prev;
    });
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const navLinks = (isMobile = false) => {
    let lastSection: string | undefined;
    return (
      <nav className="flex-1 px-2 py-4 space-y-1">
        {NAV_ITEMS.map(item => {
          const active = isActive(item.href);
          const section = (item as { section?: string }).section;
          const showSection = section && section !== lastSection;
          if (section) lastSection = section;
          return (
            <div key={item.href}>
              {showSection && (!collapsed || isMobile) && (
                <p className="px-3 pt-4 pb-1 text-[length:var(--text-micro)] font-semibold uppercase tracking-wider text-text-inverse/30">
                  {section}
                </p>
              )}
              <Link
                href={item.href}
                onClick={() => isMobile && setMobileOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={`relative group/tip flex items-center gap-3 rounded-lg text-[length:var(--text-body)] font-medium transition-all focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:outline-none ${
                  collapsed && !isMobile ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'
                } ${
                  active
                    ? 'bg-gold/15 text-gold'
                    : 'text-text-inverse/60 hover:text-text-inverse hover:bg-text-inverse/5'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {(!collapsed || isMobile) && <span>{item.label}</span>}
                {collapsed && !isMobile && (
                  <span className="absolute left-full ml-2 px-2 py-1 rounded bg-text-primary text-page text-[length:var(--text-caption)] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover/tip:opacity-100 transition-opacity z-50 shadow-lg">
                    {item.label}
                  </span>
                )}
              </Link>
            </div>
          );
        })}
      </nav>
    );
  };

  const userControls = (isMobile = false) => (
    <div className={`border-t border-text-inverse/10 flex-shrink-0 ${collapsed && !isMobile ? 'px-2 py-3' : 'px-3 py-3'}`}>
      {/* Mock data toggle */}
      <button
        onClick={toggleMockData}
        aria-pressed={mockDataEnabled}
        className={`relative group/tip flex items-center gap-2 w-full rounded-lg text-[length:var(--text-caption)] font-medium transition-all text-text-inverse/60 hover:text-text-inverse hover:bg-text-inverse/5 cursor-pointer focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:outline-none ${
          collapsed && !isMobile ? 'justify-center px-0 py-2' : 'px-3 py-2'
        }`}
      >
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${mockDataEnabled ? 'bg-jm-green' : 'bg-status-off-track'}`} />
        {(!collapsed || isMobile) && <span>Mock Data {mockDataEnabled ? 'ON' : 'OFF'}</span>}
        {collapsed && !isMobile && (
          <span className="absolute left-full ml-2 px-2 py-1 rounded bg-text-primary text-page text-[length:var(--text-caption)] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover/tip:opacity-100 transition-opacity z-50 shadow-lg">
            Mock Data {mockDataEnabled ? 'ON' : 'OFF'}
          </span>
        )}
      </button>

      {/* User profile + sign out */}
      {user && (
        <div className={`mt-2 ${collapsed && !isMobile ? '' : ''}`}>
          {(!collapsed || isMobile) && (
            <div className="flex items-center gap-2 px-3 py-2">
              {user.image && (
                <img src={user.image} alt={user.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" referrerPolicy="no-referrer" />
              )}
              <span className="text-[length:var(--text-caption)] text-text-inverse/80 font-medium truncate">{user.name}</span>
            </div>
          )}
          <button
            onClick={logout}
            className={`relative group/tip flex items-center gap-2 w-full rounded-lg text-[length:var(--text-caption)] font-medium transition-all text-text-inverse/60 hover:text-text-inverse hover:bg-text-inverse/5 cursor-pointer ${
              collapsed && !isMobile ? 'justify-center px-0 py-2' : 'px-3 py-2'
            }`}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
            </svg>
            {(!collapsed || isMobile) && <span>Sign Out</span>}
            {collapsed && !isMobile && (
              <span className="absolute left-full ml-2 px-2 py-1 rounded bg-text-primary text-page text-[length:var(--text-caption)] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover/tip:opacity-100 transition-opacity z-50 shadow-lg">
                Sign Out
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-sidebar flex-shrink-0 sticky top-0 h-dvh z-40 transition-[width] duration-200 ${
          collapsed ? 'w-[60px]' : 'w-[220px]'
        }`}
      >
        {/* Header with logo + collapse toggle */}
        <div className={`h-14 flex items-center flex-shrink-0 border-b border-text-inverse/10 ${collapsed ? 'justify-center px-2' : 'px-4 gap-2.5'}`}>
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity min-w-0">
              <Image src="/Coat_of_arms_of_Jamaica.svg.png" alt="Jamaica Coat of Arms" width={28} height={28} className="w-7 h-7 flex-shrink-0" />
              <span className="font-semibold text-[length:var(--text-body)] tracking-wide font-[family-name:var(--font-display)] text-text-inverse truncate">
                Cabinet Dashboard
              </span>
            </Link>
          )}
          {collapsed && (
            <Link href="/dashboard" className="hover:opacity-90 transition-opacity" title="Dashboard">
              <Image src="/Coat_of_arms_of_Jamaica.svg.png" alt="Jamaica Coat of Arms" width={28} height={28} className="w-7 h-7" />
            </Link>
          )}
          <button
            onClick={toggleCollapse}
            className={`flex items-center justify-center w-7 h-7 rounded-md text-text-inverse/40 hover:text-text-inverse hover:bg-text-inverse/10 transition-colors cursor-pointer flex-shrink-0 ${collapsed ? '' : 'ml-auto'}`}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
        </div>

        {navLinks(false)}
        {userControls(false)}
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-[51] w-9 h-9 flex items-center justify-center rounded-lg bg-sidebar text-text-inverse hover:bg-sidebar/90 transition-colors cursor-pointer shadow-md"
        aria-label="Open navigation"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-[60] bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-[61] w-[260px] bg-sidebar animate-slide-in-left flex flex-col">
            <div className="h-14 flex items-center px-4 gap-2.5 border-b border-text-inverse/10 flex-shrink-0">
              <Image src="/Coat_of_arms_of_Jamaica.svg.png" alt="Jamaica Coat of Arms" width={28} height={28} className="w-7 h-7" />
              <span className="font-semibold text-[length:var(--text-body)] tracking-wide font-[family-name:var(--font-display)] text-text-inverse">
                Cabinet Dashboard
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="ml-auto w-7 h-7 flex items-center justify-center rounded-md text-text-inverse/40 hover:text-text-inverse hover:bg-text-inverse/10 transition-colors cursor-pointer"
                aria-label="Close navigation"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {navLinks(true)}
            {userControls(true)}
          </aside>
        </>
      )}
    </>
  );
}
