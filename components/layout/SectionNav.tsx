'use client';

import { useState, useEffect } from 'react';

interface SectionNavItem {
  id: string;
  label: string;
}

export function SectionNav({ items }: { items: SectionNavItem[] }) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-60px 0px -60% 0px', threshold: 0 }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 56;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex gap-[var(--space-xs)] overflow-x-auto py-[6px] scrollbar-none">
      {items.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => handleClick(id)}
          className={`
            flex-shrink-0 px-[var(--space-sm)] sm:px-[var(--space-md)] py-[6px] text-[length:var(--text-caption)] font-medium
            rounded-sm transition-colors whitespace-nowrap cursor-pointer
            ${activeId === id
              ? 'bg-sidebar text-text-inverse'
              : 'text-text-secondary hover:text-text-primary hover:bg-border-default/40'
            }
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
