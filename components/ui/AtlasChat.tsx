'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { AtlasBlock, AtlasMessage, ChartBlock } from '@/lib/atlas/types';

const SUGGESTED_PROMPTS: Record<string, string[]> = {
  '/dashboard': ['Which ministries are off track?', 'Compare the top 3 spenders', 'Show overdue action items', 'Give me a PM briefing'],
  '/meetings': ['Summarize the last cabinet meeting', 'Who missed the most meetings?', 'What decisions were made recently?'],
  '/actions': ["What's overdue?", 'Which minister has the most open items?', 'Show resolved items this month'],
  '/blockers': ["What's the oldest unresolved blocker?", 'Show PM-level escalations', 'What trends do you see in recent blockers?'],
};

function getSuggestions(path: string): string[] {
  if (SUGGESTED_PROMPTS[path]) return SUGGESTED_PROMPTS[path];
  if (path.startsWith('/ministry/')) return ['How is this ministry performing?', 'Show capital project status', 'What are the open blockers?'];
  if (path.startsWith('/minister/')) return ['How is this minister doing on action items?', 'Show OKR progress', "What's their attendance rate?"];
  if (path.startsWith('/meetings/')) return ['Summarize this meeting', 'What action items came out of this meeting?', 'Who attended?'];
  return ['Give me a system overview', 'Which ministries need attention?', 'Show overdue action items'];
}

function ChartRenderer({ block }: { block: ChartBlock }) {
  const max = Math.max(...block.data.map(x => Math.max(x.value, x.value2 ?? 0)));
  const h = 96;

  if (block.chartType === 'line') {
    const points = block.data.map((d, i) => {
      const x = block.data.length > 1 ? (i / (block.data.length - 1)) * 280 + 10 : 150;
      const y = max > 0 ? h - (d.value / max) * (h - 16) : h - 8;
      return { x, y, d };
    });
    const points2 = block.data[0]?.value2 != null ? block.data.map((d, i) => {
      const x = block.data.length > 1 ? (i / (block.data.length - 1)) * 280 + 10 : 150;
      const y = max > 0 ? h - ((d.value2 ?? 0) / max) * (h - 16) : h - 8;
      return { x, y };
    }) : null;
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    const pathD2 = points2?.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

    return (
      <div className="my-2 p-3 bg-surface border border-border-default rounded-lg">
        {block.title && <p className="text-[length:var(--text-micro)] font-semibold text-text-primary mb-2">{block.title}</p>}
        {block.series && (
          <div className="flex items-center gap-3 mb-1.5">
            <span className="flex items-center gap-1 text-[8px] text-text-secondary"><span className="w-2.5 h-0.5 rounded bg-jm-green inline-block" />{block.series[0]}</span>
            {block.series[1] && <span className="flex items-center gap-1 text-[8px] text-text-secondary"><span className="w-2.5 h-0.5 rounded bg-gold inline-block" />{block.series[1]}</span>}
          </div>
        )}
        <svg viewBox={`0 0 300 ${h + 16}`} className="w-full h-28">
          <path d={pathD} fill="none" stroke="var(--color-jm-green)" strokeWidth="2" strokeLinejoin="round" />
          {pathD2 && <path d={pathD2} fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinejoin="round" strokeDasharray="4 2" />}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="3" fill="var(--color-jm-green)" />
              <text x={p.x} y={h + 12} textAnchor="middle" className="fill-text-secondary" style={{ fontSize: '7px' }}>{p.d.name}</text>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  if (block.chartType === 'grouped_bar') {
    return (
      <div className="my-2 p-3 bg-surface border border-border-default rounded-lg">
        {block.title && <p className="text-[length:var(--text-micro)] font-semibold text-text-primary mb-2">{block.title}</p>}
        {block.series && (
          <div className="flex items-center gap-3 mb-1.5">
            <span className="flex items-center gap-1 text-[8px] text-text-secondary"><span className="w-2.5 h-2.5 rounded-sm bg-jm-green/60 inline-block" />{block.series[0]}</span>
            {block.series[1] && <span className="flex items-center gap-1 text-[8px] text-text-secondary"><span className="w-2.5 h-2.5 rounded-sm bg-gold/60 inline-block" />{block.series[1]}</span>}
          </div>
        )}
        <div className="flex items-end gap-2 h-24">
          {block.data.map((d, i) => {
            const h1 = max > 0 ? (d.value / max) * 100 : 0;
            const h2 = max > 0 ? ((d.value2 ?? 0) / max) * 100 : 0;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="flex items-end gap-px w-full h-full">
                  <div className="flex-1 bg-jm-green/60 rounded-t" style={{ height: `${h1}%` }} title={`${d.label ?? 'Alloc'}: ${d.value}`} />
                  {d.value2 != null && <div className="flex-1 bg-gold/60 rounded-t" style={{ height: `${h2}%` }} title={`${d.label2 ?? 'Spent'}: ${d.value2}`} />}
                </div>
                <span className="text-[7px] text-text-secondary truncate max-w-full">{d.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Default: simple bar chart
  return (
    <div className="my-2 p-3 bg-surface border border-border-default rounded-lg">
      {block.title && <p className="text-[length:var(--text-micro)] font-semibold text-text-primary mb-2">{block.title}</p>}
      <div className="flex items-end gap-1 h-24">
        {block.data.map((d, i) => {
          const barH = max > 0 ? (d.value / max) * 100 : 0;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-jm-green/60 rounded-t" style={{ height: `${barH}%` }} title={`${d.name}: ${d.value}`} />
              <span className="text-[8px] text-text-secondary truncate max-w-full">{d.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BlockRenderer({ block }: { block: AtlasBlock }) {
  const router = useRouter();

  switch (block.type) {
    case 'text':
      return <div className="text-[length:var(--text-caption)] text-text-primary leading-relaxed whitespace-pre-wrap atlas-prose" dangerouslySetInnerHTML={{ __html: simpleMarkdown(block.content) }} />;

    case 'heading':
      return block.level === 2
        ? <h2 className="text-[length:var(--text-body)] font-bold text-text-primary mt-3 mb-1">{block.content}</h2>
        : <h3 className="text-[length:var(--text-caption)] font-bold text-text-primary mt-2 mb-1">{block.content}</h3>;

    case 'table':
      return (
        <div className="overflow-x-auto my-2">
          {block.caption && <p className="text-[length:var(--text-micro)] text-text-secondary mb-1">{block.caption}</p>}
          <table className="w-full text-[length:var(--text-micro)] border-collapse">
            <thead>
              <tr>{block.headers.map((h, i) => <th key={i} className="text-left py-1.5 px-2 font-semibold text-text-secondary border-b border-border-default">{h}</th>)}</tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-border-default/50">
                  {row.map((cell, ci) => <td key={ci} className="py-1.5 px-2 text-text-primary" dangerouslySetInnerHTML={{ __html: simpleMarkdown(cell) }} />)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'stat':
      return (
        <div className="inline-flex flex-col p-3 bg-surface border border-border-default rounded-lg my-1">
          <span className="text-[length:var(--text-micro)] text-text-secondary font-medium">{block.label}</span>
          <span className={`text-[length:var(--text-h3)] font-bold ${toneColor(block.tone)}`}>{block.value}</span>
        </div>
      );

    case 'statGroup':
      return (
        <div className="flex flex-wrap gap-2 my-2">
          {block.stats.map((s, i) => (
            <div key={i} className="flex-1 min-w-[80px] p-2.5 bg-surface border border-border-default rounded-lg">
              <span className="block text-[length:var(--text-micro)] text-text-secondary font-medium">{s.label}</span>
              <span className={`block text-[length:var(--text-body)] font-bold ${toneColor(s.tone)}`}>{s.value}</span>
            </div>
          ))}
        </div>
      );

    case 'list':
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <Tag className={`my-1 text-[length:var(--text-caption)] text-text-primary space-y-0.5 ${block.ordered ? 'list-decimal' : 'list-disc'} pl-4`}>
          {block.items.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: simpleMarkdown(item) }} />)}
        </Tag>
      );

    case 'status': {
      const cfg = { on_track: { bg: 'bg-jm-green/15', text: 'text-jm-green-dark', label: 'On Track' }, at_risk: { bg: 'bg-gold/15', text: 'text-gold-dark', label: 'At Risk' }, off_track: { bg: 'bg-status-off-track/15', text: 'text-status-off-track', label: 'Off Track' } };
      const s = cfg[block.status] || cfg.on_track;
      return (
        <div className="flex items-center gap-2 my-1">
          <span className="text-[length:var(--text-caption)] text-text-secondary">{block.label}:</span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[length:var(--text-micro)] font-semibold ${s.bg} ${s.text}`}>{s.label}</span>
        </div>
      );
    }

    case 'link':
      return <button onClick={() => router.push(block.href)} className="text-[length:var(--text-caption)] text-gold-dark hover:underline cursor-pointer font-medium my-0.5 block">{block.label} →</button>;

    case 'navigation':
      return (
        <button onClick={() => router.push(block.route)} className="inline-flex items-center gap-2 px-4 py-2 mt-2 bg-sidebar text-text-on-dark rounded-lg text-[length:var(--text-caption)] font-semibold hover:bg-sidebar/90 transition-colors cursor-pointer">
          {block.label}
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
        </button>
      );

    case 'chart':
      return <ChartRenderer block={block} />;

    case 'callout': {
      const tones = { info: 'bg-jm-green/10 border-jm-green/30 text-jm-green-dark', warning: 'bg-gold/10 border-gold/30 text-gold-dark', danger: 'bg-status-off-track/10 border-status-off-track/30 text-status-off-track' };
      return <div className={`my-2 p-3 rounded-lg border text-[length:var(--text-caption)] ${tones[block.tone] || tones.info}`} dangerouslySetInnerHTML={{ __html: simpleMarkdown(block.content) }} />;
    }

    case 'divider':
      return <hr className="my-3 border-border-default" />;

    default:
      return null;
  }
}

function toneColor(tone?: string): string {
  if (tone === 'success') return 'text-jm-green-dark';
  if (tone === 'warning') return 'text-gold-dark';
  if (tone === 'danger') return 'text-status-off-track';
  return 'text-text-primary';
}

function simpleMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="px-1 py-0.5 bg-surface rounded text-[length:var(--text-micro)]">$1</code>')
    .replace(/\n/g, '<br/>');
}

export function AtlasChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AtlasMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState('Thinking...');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: AtlasMessage = { id: `u-${Date.now()}`, role: 'user', content: text.trim(), timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setLoadingLabel('Thinking...');

    const timer = setTimeout(() => setLoadingLabel('Analyzing data...'), 2000);
    const timer2 = setTimeout(() => setLoadingLabel('Composing response...'), 5000);

    try {
      const chatHistory = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/atlas/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory,
          currentRoute: pathname,
          currentDate: new Date().toISOString().slice(0, 10),
        }),
      });

      const data = await res.json();
      const assistantMsg: AtlasMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: data.content || '',
        blocks: data.blocks || [],
        toolsUsed: data.toolsUsed || [],
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: `e-${Date.now()}`, role: 'assistant', content: 'Atlas is temporarily unavailable.',
        blocks: [{ type: 'callout', tone: 'danger', content: 'Atlas is temporarily unavailable. Try again in a moment.' }],
        timestamp: Date.now(),
      }]);
    } finally {
      clearTimeout(timer);
      clearTimeout(timer2);
      setLoading(false);
    }
  }, [loading, messages, pathname]);

  const suggestions = getSuggestions(pathname);

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/40 transition-opacity" onClick={close} aria-hidden />}

      <div
        role="dialog"
        aria-modal={open}
        aria-label="Atlas budget assistant"
        className={`fixed z-50 bottom-0 right-0 sm:right-6 sm:bottom-6 flex flex-col bg-page border border-border-default shadow-2xl transition-all duration-300 ease-out origin-bottom-right ${
        open
          ? 'w-full sm:w-[440px] h-dvh sm:h-[calc(100dvh-48px)] sm:rounded-xl opacity-100 scale-100'
          : 'w-0 h-0 opacity-0 scale-95 pointer-events-none'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-default flex-shrink-0">
          <div className="flex items-center gap-3">
            <img src="/intellibus-logo.png" alt="Atlas" className="w-8 h-8 rounded-full object-cover" />
            <div>
              <p className="text-[length:var(--text-body)] font-bold text-text-primary leading-tight">Atlas</p>
              <p className="text-[length:var(--text-micro)] text-text-secondary">Budget intelligence assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button onClick={() => setMessages([])} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface transition-colors cursor-pointer" aria-label="Clear chat" title="New conversation">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" /></svg>
              </button>
            )}
            <button onClick={close} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:outline-none" aria-label="Close Atlas">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <img src="/intellibus-logo.png" alt="Atlas" className="w-12 h-12 rounded-full object-cover mb-4" />
              <p className="text-[length:var(--text-h3)] font-semibold text-text-primary mb-1">Ask Atlas anything</p>
              <p className="text-[length:var(--text-caption)] text-text-secondary mb-6 max-w-[280px] leading-relaxed">
                Budget analysis, ministry comparisons, accountability tracking — powered by your data.
              </p>
              <div className="flex flex-col gap-2 w-full max-w-[300px]">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => send(s)}
                    className="text-left px-3 py-2.5 bg-surface border border-border-default rounded-lg text-[length:var(--text-caption)] text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors cursor-pointer">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'user' ? (
                <div className="max-w-[85%] px-4 py-2.5 bg-sidebar text-text-on-dark rounded-2xl rounded-br-sm text-[length:var(--text-caption)]">
                  {msg.content}
                </div>
              ) : (
                <div className="max-w-[95%] space-y-1">
                  {msg.blocks && msg.blocks.length > 0
                    ? msg.blocks.map((block, i) => <BlockRenderer key={i} block={block} />)
                    : <div className="text-[length:var(--text-caption)] text-text-primary atlas-prose" dangerouslySetInnerHTML={{ __html: simpleMarkdown(msg.content) }} />
                  }
                  {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                    <details className="mt-2">
                      <summary className="text-[length:var(--text-micro)] text-text-secondary/50 cursor-pointer hover:text-text-secondary">
                        Analyzed {msg.toolsUsed.length} data source{msg.toolsUsed.length > 1 ? 's' : ''}
                      </summary>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {[...new Set(msg.toolsUsed)].map((t, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-surface border border-border-default rounded text-[9px] text-text-secondary font-mono">{t}</span>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-jm-green animate-pulse" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-jm-green animate-pulse" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-jm-green animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-[length:var(--text-micro)] text-text-secondary">{loadingLabel}</span>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-4 pb-4 pt-2 border-t border-border-default flex-shrink-0">
          <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a question..."
              aria-label="Message to Atlas"
              disabled={loading}
              className="flex-1 bg-surface border border-border-default rounded-lg px-4 py-2.5 text-[length:var(--text-body)] placeholder:text-text-secondary/50 outline-none focus:border-jm-green focus:ring-1 focus:ring-jm-green/30 disabled:opacity-50"
            />
            <button type="submit" disabled={!input.trim() || loading}
              aria-label="Send message"
              className="w-9 h-9 rounded-lg bg-jm-green/20 flex items-center justify-center flex-shrink-0 hover:bg-jm-green/30 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:outline-none">
              <svg className="w-4 h-4 text-jm-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* FAB */}
      {!open && (
        <button onClick={() => setOpen(true)}
          className="fixed z-50 bottom-6 right-6 w-14 h-14 rounded-full bg-surface border border-border-default shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer group focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2"
          aria-label="Open Atlas assistant">
          <svg className="w-7 h-7 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 5.58 2 10c0 2.24 1.12 4.27 2.94 5.72L4 20l4.28-2.14C9.46 18.28 10.69 18.5 12 18.5c5.52 0 10-3.58 10-8S17.52 2 12 2Z" fill="oklch(0.99 0 0)" stroke="oklch(0.25 0 0)" strokeWidth="1.5" strokeLinejoin="round"/>
            <circle cx="8.5" cy="10" r="1.25" fill="oklch(0.25 0 0)"/>
            <circle cx="12" cy="10" r="1.25" fill="oklch(0.25 0 0)"/>
            <circle cx="15.5" cy="10" r="1.25" fill="oklch(0.25 0 0)"/>
          </svg>
        </button>
      )}
    </>
  );
}
