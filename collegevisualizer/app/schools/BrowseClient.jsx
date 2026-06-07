'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { toSlug, safeNum, ownerLabel, fmt, getDisplayName } from '../../lib/utils';
import SearchBox from '../../components/SearchBox';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

export default function BrowseClient({ schools }) {
  const [stateF, setStateF] = useState('');
  const [typeF, setTypeF] = useState('');
  const [sizeF, setSizeF] = useState('');
  const [sortF, setSortF] = useState('name');
  const [page, setPage] = useState(0);
  const PER = 25;

  const filtered = useMemo(() => {
    let s = schools;
    if (stateF) s = s.filter(x => x.state === stateF);
    if (typeF) s = s.filter(x => x.control === Number(typeF));
    if (sizeF === 'small') s = s.filter(x => safeNum(x.size) != null && x.size < 5000);
    else if (sizeF === 'med') s = s.filter(x => safeNum(x.size) != null && x.size >= 5000 && x.size < 20000);
    else if (sizeF === 'large') s = s.filter(x => safeNum(x.size) != null && x.size >= 20000);
    const copy = [...s];
    if (sortF === 'name') copy.sort((a, b) => getDisplayName(a).localeCompare(getDisplayName(b)));
    else if (sortF === 'adm') copy.sort((a, b) => (safeNum(a.adm) ?? 99) - (safeNum(b.adm) ?? 99));
    else if (sortF === 'earn') copy.sort((a, b) => (safeNum(b.earn10) ?? 0) - (safeNum(a.earn10) ?? 0));
    else if (sortF === 'size') copy.sort((a, b) => (safeNum(b.size) ?? 0) - (safeNum(a.size) ?? 0));
    return copy;
  }, [schools, stateF, typeF, sizeF, sortF]);

  const states = useMemo(() => [...new Set(schools.map(s => s.state).filter(Boolean))].sort(), [schools]);
  const paged = filtered.slice(page * PER, (page + 1) * PER);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER));

  const btn = disabled => ({
    ...mono, padding: '7px 16px', background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 5, color: disabled ? 'var(--muted)' : 'var(--text)',
    cursor: disabled ? 'default' : 'pointer', fontSize: 12,
    opacity: disabled ? 0.4 : 1, letterSpacing: '0.04em',
  });

  return (
    <div style={{ maxWidth: 1020, margin: '0 auto', padding: '2.5rem 2rem' }}>
      <h1 style={{ ...mono, fontSize: 22, fontWeight: 400, letterSpacing: '-0.01em', margin: '0 0 2rem', color: 'var(--text)' }}>browse</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchBox compact />
        <select value={stateF} onChange={e => { setStateF(e.target.value); setPage(0); }}>
          <option value="">all states</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={typeF} onChange={e => { setTypeF(e.target.value); setPage(0); }}>
          <option value="">all types</option>
          <option value="1">public</option>
          <option value="2">private nonprofit</option>
        </select>
        <select value={sizeF} onChange={e => { setSizeF(e.target.value); setPage(0); }}>
          <option value="">all sizes</option>
          <option value="small">small &lt;5k</option>
          <option value="med">medium 5–20k</option>
          <option value="large">large 20k+</option>
        </select>
        <select value={sortF} onChange={e => { setSortF(e.target.value); setPage(0); }}>
          <option value="name">sort: name</option>
          <option value="adm">sort: admit rate</option>
          <option value="earn">sort: earnings</option>
          <option value="size">sort: size</option>
        </select>
        <span style={{ ...mono, fontSize: 11, color: 'var(--muted)', marginLeft: 'auto', letterSpacing: '0.06em' }}>{filtered.length.toLocaleString()} schools</span>
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: 10, overflow: 'hidden' }}>
        <div className="browse-grid" style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1fr', padding: '9px 16px', borderBottom: '1px solid var(--border)' }}>
          {['institution', 'type', 'admit', 'sat', '10yr earnings'].map(h => (
            <span key={h} style={{ ...mono, fontSize: 10, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{h}</span>
          ))}
        </div>
        {paged.map((s, i) => {
          const dn = getDisplayName(s);
          return (
            <Link key={s.id} href={`/schools/${toSlug(dn)}`}
              className="row-link browse-grid"
              style={{ gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1fr', padding: '11px 16px', borderBottom: i < paged.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text)' }}>{dn}</div>
                <div style={{ ...mono, fontSize: 11, color: 'var(--muted)', marginTop: 2, letterSpacing: '0.02em' }}>{s.city}, {s.state}</div>
              </div>
              <span className="browse-type" style={{ ...mono, fontSize: 11, color: 'var(--muted)', letterSpacing: '0.02em' }}>{ownerLabel(s.control)}</span>
              <span style={{ ...mono, fontSize: 12, color: safeNum(s.adm) != null ? 'var(--text)' : 'var(--muted)' }}>{fmt(s.adm, 'pct')}</span>
              <span className="browse-sat" style={{ ...mono, fontSize: 12, color: 'var(--text)' }}>{safeNum(s.sat) != null ? Math.round(s.sat) : '—'}</span>
              <span className="browse-earn" style={{ ...mono, fontSize: 12, color: 'var(--text)' }}>{fmt(s.earn10, 'usd')}</span>
            </Link>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16, alignItems: 'center' }}>
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={btn(page === 0)}>← prev</button>
        <span style={{ ...mono, fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em' }}>{page + 1} / {totalPages}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * PER >= filtered.length} style={btn((page + 1) * PER >= filtered.length)}>next →</button>
      </div>

      <p style={{ ...mono, fontSize: 11, color: 'var(--muted)', marginTop: '2rem', letterSpacing: '0.03em' }}>
        data — U.S. Department of Education College Scorecard, 2025–26
      </p>
    </div>
  );
}
