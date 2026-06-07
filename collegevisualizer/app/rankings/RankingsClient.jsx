'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ownerLabel, fmt } from '../../lib/utils';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

const CATS = [
  { id: 'earnings',  label: 'top earners',    desc: 'Median earnings 10 years after enrollment', valFn: s => s.earn10,  fmtFn: v => fmt(v, 'usd') },
  { id: 'selective', label: 'most selective',  desc: 'Lowest acceptance rates',                   valFn: s => s.adm,     fmtFn: v => fmt(v, 'pct') },
  { id: 'sat',       label: 'highest SAT',     desc: 'Highest average SAT scores',                valFn: s => s.sat,     fmtFn: v => v != null ? Math.round(v) : '—' },
  { id: 'grad',      label: 'graduation rate', desc: 'Highest 4-year completion rates',           valFn: s => s.grad_rate, fmtFn: v => fmt(v, 'pct') },
  { id: 'value',     label: 'best value',      desc: 'Lowest average net price after aid',        valFn: s => s.npt,     fmtFn: v => fmt(v, 'usd') },
  { id: 'debt',      label: 'lowest debt',     desc: 'Lowest median student debt',                valFn: s => s.debt,    fmtFn: v => fmt(v, 'usd') },
];

export default function RankingsClient({ data }) {
  const [active, setActive] = useState('earnings');
  const cat = CATS.find(c => c.id === active);
  const ranked = data[active] || [];
  const vals = ranked.map(s => Math.abs(cat.valFn(s) ?? 0));
  const max = Math.max(...vals, 1);

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '2.5rem 2rem' }}>
      <h1 style={{ ...mono, fontSize: 22, fontWeight: 400, letterSpacing: '-0.01em', marginBottom: '0.4rem', color: 'var(--text)' }}>
        rankings
      </h1>
      <p style={{ ...mono, color: 'var(--muted)', fontSize: 11, marginBottom: '2rem', letterSpacing: '0.04em' }}>
        U.S. Department of Education College Scorecard, 2025–26
      </p>

      <div className="tab-row" style={{ display: 'flex', gap: 6, marginBottom: '2rem', flexWrap: 'wrap' }}>
        {CATS.map(c => (
          <button key={c.id} onClick={() => setActive(c.id)}
            className={`tab-btn${active === c.id ? ' active' : ''}`}>
            {c.label}
          </button>
        ))}
      </div>

      <p style={{ ...mono, fontSize: 11, color: 'var(--muted)', marginBottom: '1.25rem', letterSpacing: '0.04em' }}>
        {cat.desc} — top {ranked.length}
      </p>

      <div style={{ background: 'var(--surface)', borderRadius: 12, overflow: 'hidden' }}>
        {ranked.map((s, i) => {
          const val = cat.valFn(s);
          const pct = max ? Math.abs(val ?? 0) / max * 100 : 0;
          return (
            <Link key={s.id} href={`/schools/${s.slug}`} className="rank-row"
              style={{ gap: 14, padding: '13px 18px', borderBottom: i < ranked.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ ...mono, width: 28, fontSize: 12, color: i < 3 ? 'var(--accent)' : 'var(--muted)', fontWeight: 500, textAlign: 'right', flexShrink: 0 }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="rank-name" style={{ fontSize: 13, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                <div style={{ ...mono, fontSize: 11, color: 'var(--muted)', marginTop: 2, letterSpacing: '0.03em' }}>{s.city}, {s.state} · {ownerLabel(s.control)}</div>
              </div>
              <div className="rank-bar" style={{ width: 160, flexShrink: 0 }}>
                <div style={{ height: 3, background: 'var(--surface2)', borderRadius: 2, marginBottom: 5, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', borderRadius: 2 }} />
                </div>
                <div style={{ ...mono, fontSize: 13, color: 'var(--accent)', letterSpacing: '0.02em' }}>{cat.fmtFn(val)}</div>
              </div>
            </Link>
          );
        })}
      </div>

      <p style={{ ...mono, fontSize: 11, color: 'var(--muted)', marginTop: '2rem', letterSpacing: '0.03em' }}>
        data — U.S. Department of Education College Scorecard, 2025–26
      </p>
    </div>
  );
}
