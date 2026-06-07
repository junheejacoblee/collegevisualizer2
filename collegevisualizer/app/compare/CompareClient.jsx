'use client';
import { useState } from 'react';
import Link from 'next/link';
import { toSlug, safeNum, ownerLabel, fmt, getDisplayName } from '../../lib/utils';
import SearchBox from '../../components/SearchBox';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

const TT = {
  contentStyle: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text)' },
  cursor: { fill: 'rgba(255,255,255,0.03)' },
  itemStyle: { color: 'var(--text)' },
  labelStyle: { color: 'var(--muted)' },
};

// Shade-based colors using opacity on accent — no hardcoded palette
const OPACITIES = [1, 0.65, 0.45, 0.25];

const ROWS = [
  { label: 'location',             fn: s => `${s.city || '—'}, ${s.state || '—'}`,               section: 'academics' },
  { label: 'type',                 fn: s => ownerLabel(s.control),                                section: 'academics' },
  { label: 'acceptance rate',      fn: s => fmt(s.adm, 'pct'),                                    section: 'academics' },
  { label: 'avg SAT',              fn: s => safeNum(s.sat) != null ? Math.round(s.sat) : '—',     section: 'academics' },
  { label: 'ACT midpoint',         fn: s => safeNum(s.act) != null ? Math.round(s.act) : '—',     section: 'academics' },
  { label: 'enrollment',           fn: s => fmt(s.size, 'num'),                                   section: 'academics' },
  { label: 'grad rate',            fn: s => fmt(s.grad_rate, 'pct'),                              section: 'academics' },
  { label: 'app cycles',           fn: s => s.app?.appTypes || '—',                               section: 'application' },
  { label: 'counselor rec',        fn: s => s.app?.counselorRec || '—',                           section: 'application' },
  { label: 'teacher recs (req)',    fn: s => s.app?.teacherReqRec != null ? String(s.app.teacherReqRec) : '—', section: 'application' },
  { label: 'teacher recs (opt)',    fn: s => s.app?.teacherOptRec != null ? String(s.app.teacherOptRec) : '—', section: 'application' },
  { label: 'other recs (req)',      fn: s => s.app?.otherReqRec != null ? String(s.app.otherReqRec) : '—',     section: 'application' },
  { label: 'other recs (opt)',      fn: s => s.app?.otherOptRec != null ? String(s.app.otherOptRec) : '—',     section: 'application' },
  { label: 'common app essay',     fn: s => s.app?.commonAppEssay || '—',                         section: 'application' },
  { label: 'supplemental essays',  fn: s => s.app?.supplements != null ? String(s.app.supplements) : '—', section: 'application' },
  { label: 'in-state tuition',     fn: s => fmt(s.tuit_in, 'usd'),                               section: 'cost' },
  { label: 'out-of-state',         fn: s => fmt(s.tuit_out, 'usd'),                              section: 'cost' },
  { label: 'avg net price',        fn: s => fmt(s.npt_pub ?? s.npt_priv, 'usd'),                  section: 'cost' },
  { label: 'median debt',          fn: s => fmt(s.debt, 'usd'),                                   section: 'cost' },
  { label: 'earnings 6yr',         fn: s => fmt(s.earn6, 'usd'),                                  section: 'cost' },
  { label: 'earnings 10yr',        fn: s => fmt(s.earn10, 'usd'),                                 section: 'cost' },
  { label: '% women',              fn: s => fmt(s.women, 'pct'),                                  section: 'cost' },
];

const SECTION_LABELS = { academics: 'academics', application: 'application', cost: 'cost & outcomes' };

export default function CompareClient({ schools }) {
  const [list, setList] = useState([]);
  const add = s => { if (!list.find(c => c.id === s.id) && list.length < 4) setList(p => [...p, s]); };
  const remove = i => setList(p => p.filter((_, idx) => idx !== i));
  const sn = s => (getDisplayName(s) || '').split(' ')[0];

  const earnData = [
    { period: '6yr',  ...Object.fromEntries(list.map(s => [sn(s), safeNum(s.earn6)])) },
    { period: '10yr', ...Object.fromEntries(list.map(s => [sn(s), safeNum(s.earn10)])) },
  ];

  const radarData = ['adm', 'grad_rate', 'sat', 'earn10', 'size'].map(k => {
    const vals = list.map(s => safeNum(s[k]) ?? 0);
    const mx = Math.max(...vals, 1);
    return {
      m: { adm: 'admit', grad_rate: 'grad', sat: 'sat', earn10: 'earn', size: 'size' }[k],
      ...Object.fromEntries(list.map(s => [sn(s), Math.round(((safeNum(s[k]) ?? 0) / mx) * 100)]))
    };
  });

  return (
    <div style={{ maxWidth: 1020, margin: '0 auto', padding: '2.5rem 2rem' }}>
      <h1 style={{ ...mono, fontSize: 22, fontWeight: 400, letterSpacing: '-0.01em', marginBottom: '0.5rem', color: 'var(--text)' }}>compare</h1>
      <p style={{ ...mono, color: 'var(--muted)', fontSize: 12, marginBottom: '2rem', letterSpacing: '0.03em' }}>search and add up to 4 schools</p>

      <div style={{ display: 'flex', gap: 10, marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchBox schools={schools} onSelectOverride={add} compact />
        {list.map((s, i) => (
          <div key={i} style={{
            background: 'var(--surface)', borderRadius: 7, padding: '7px 12px',
            display: 'flex', alignItems: 'center', gap: 8,
            borderLeft: `3px solid var(--accent)`,
            opacity: 1 - i * 0.15,
          }}>
            <Link href={`/schools/${toSlug(getDisplayName(s))}`} style={{ ...mono, fontSize: 12, color: 'var(--text)', letterSpacing: '0.02em' }}>{getDisplayName(s)}</Link>
            <button onClick={() => remove(i)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 16, padding: 0, lineHeight: 1 }}>×</button>
          </div>
        ))}
      </div>

      {list.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--muted)' }}>
          <div style={{ ...mono, fontSize: 13, letterSpacing: '0.05em' }}>search for a college above to start comparing</div>
        </div>
      )}

      {list.length >= 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: '2rem' }}>
          <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '1.2rem', overflow: 'hidden' }}>
            <div style={{ ...mono, fontSize: 10, color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>post-grad earnings</div>
            <div style={{ height: 190 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={earnData} barGap={3} barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="period" tick={{ fill: 'var(--muted)', fontSize: 10, fontFamily: "'JetBrains Mono'" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--muted)', fontSize: 9, fontFamily: "'JetBrains Mono'" }} axisLine={false} tickLine={false} tickFormatter={v => v ? `$${Math.round(v / 1000)}k` : ''} />
                  <Tooltip {...TT} formatter={v => v ? [`$${Number(v).toLocaleString()}`, ''] : ['—', '']} />
                  {list.map((s, i) => (
                    <Bar key={i} dataKey={sn(s)} fill="var(--accent)" fillOpacity={OPACITIES[i]} radius={[3, 3, 0, 0]} isAnimationActive={false} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '1.2rem', overflow: 'hidden' }}>
            <div style={{ ...mono, fontSize: 10, color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>profile radar</div>
            <div style={{ height: 190 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="m" tick={{ fill: 'var(--muted)', fontSize: 9, fontFamily: "'JetBrains Mono'" }} />
                  {list.map((s, i) => (
                    <Radar key={i} dataKey={sn(s)} stroke="var(--accent)" strokeOpacity={OPACITIES[i]} fill="var(--accent)" fillOpacity={OPACITIES[i] * 0.12} strokeWidth={1.5} isAnimationActive={false} />
                  ))}
                  <Tooltip {...TT} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {list.length > 0 && (
        <div style={{ background: 'var(--surface)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 480 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ ...mono, padding: '10px 16px', textAlign: 'left', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.12em', fontWeight: 400, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>metric</th>
                  {list.map((s, i) => (
                    <th key={i} style={{ ...mono, padding: '10px 16px', textAlign: 'left', fontSize: 12, color: 'var(--text)', fontWeight: 400, opacity: OPACITIES[i] }}>
                      {(getDisplayName(s) || '').split(' ').slice(0, 3).join(' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(() => {
                  let lastSection = null;
                  return ROWS.flatMap((row, ri) => {
                    const showHeader = row.section !== lastSection;
                    lastSection = row.section;
                    return [
                      showHeader && (
                        <tr key={`sec-${row.section}`}>
                          <td colSpan={list.length + 1} style={{ ...mono, padding: '8px 16px', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.18em', textTransform: 'uppercase', background: 'var(--surface2)', borderBottom: '1px solid var(--border)', borderTop: ri > 0 ? '1px solid var(--border)' : 'none' }}>
                            {SECTION_LABELS[row.section]}
                          </td>
                        </tr>
                      ),
                      <tr key={ri}
                        style={{ background: 'transparent', transition: 'background 0.1s', cursor: 'default' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ ...mono, padding: '9px 16px', color: 'var(--muted)', borderBottom: '1px solid var(--border)', fontSize: 12, whiteSpace: 'nowrap', letterSpacing: '0.03em' }}>{row.label}</td>
                        {list.map((s, si) => {
                          const val = row.fn(s);
                          return (
                            <td key={si} style={{ ...mono, padding: '9px 16px', color: val === '—' ? 'var(--muted)' : 'var(--text)', borderBottom: '1px solid var(--border)', fontSize: 12, letterSpacing: '0.03em' }}>{val}</td>
                          );
                        })}
                      </tr>
                    ].filter(Boolean);
                  });
                })()}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
