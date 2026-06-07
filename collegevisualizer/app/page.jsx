import Link from 'next/link';
import { getAllSchools, toSlug, safeNum, getDisplayName } from '../lib/schools';
import SearchBox from '../components/SearchBox';

export const metadata = {
  title: 'College Visualizer — U.S. College Data, Admissions & Application Requirements',
  description: 'Search 1,400+ top U.S. colleges. Acceptance rates, SAT scores, tuition, earnings, supplemental essay counts, and application cycles — all in one place.',
};

const TOP_ORDER = [
  'Massachusetts Institute of Technology',
  'Stanford University',
  'California Institute of Technology',
  'Harvard University',
  'Princeton University',
  'Yale University',
  'Johns Hopkins University',
  'Cornell University',
  'Carnegie Mellon University',
];

export default function HomePage() {
  const schools = getAllSchools();
  const withApp = schools.filter(s => s.app).length;

  const topColleges = TOP_ORDER.map(name =>
    schools.find(s => s.name.toLowerCase().includes(name.toLowerCase().split(' ').slice(0, 2).join(' ')))
  ).filter(Boolean);

  const monoStyle = { fontFamily: "'JetBrains Mono', monospace" };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '5rem 2rem 4rem' }}>

      {/* Hero */}
      <div style={{ marginBottom: '5rem' }}>
        <h1 style={{ ...monoStyle, fontSize: 'clamp(26px,4vw,44px)', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: '1.5rem', lineHeight: 1.1 }}>
          collegevisualizer
        </h1>
        <p style={{ ...monoStyle, fontSize: 12, color: 'var(--muted)', marginBottom: '1rem', lineHeight: 1.8, letterSpacing: '0.04em' }}>
          {schools.length.toLocaleString()} u.s. institutions · admissions · costs · earnings · demographics
        </p>
        <div style={{ ...monoStyle, fontSize: 11, color: 'var(--muted)', marginBottom: '2.5rem', maxWidth: 500, lineHeight: 1.7, padding: '10px 14px', background: 'var(--surface)', borderRadius: 6, borderLeft: '2px solid var(--accent)' }}>
          application data for {withApp}+ colleges — cycles, recs, essay counts.{' '}
          fields marked <span style={{ color: 'var(--accent)' }}>—</span> = not available.
        </div>
        <SearchBox />
      </div>

      {/* Quick nav */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: '4rem' }}>
        {[
          { href: '/schools', label: 'browse', desc: 'filter by state, type, size' },
          { href: '/rankings', label: 'rankings', desc: 'earnings, value, selectivity' },
          { href: '/compare', label: 'compare', desc: 'side-by-side up to 4' },
        ].map(item => (
          <Link key={item.href} href={item.href} className="card-link" style={{ padding: '1.3rem 1.5rem' }}>
            <div style={{ ...monoStyle, fontSize: 14, color: 'var(--accent)', marginBottom: 6, letterSpacing: '0.02em' }}>{item.label}</div>
            <div style={{ ...monoStyle, fontSize: 11, color: 'var(--muted)', lineHeight: 1.6, letterSpacing: '0.02em' }}>{item.desc}</div>
          </Link>
        ))}
      </div>

      {/* Top colleges */}
      <div style={{ ...monoStyle, fontSize: 10, color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 14 }}>
        top colleges in the u.s.
      </div>
      <div style={{ background: 'var(--surface)', borderRadius: 12, overflow: 'hidden', marginBottom: '5rem' }}>
        {topColleges.map((s, i) => {
          const dn = getDisplayName(s);
          return (
            <Link key={s.id} href={`/schools/${toSlug(dn)}`} className="rank-row"
              style={{ gap: 16, padding: '13px 18px', borderBottom: i < topColleges.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ ...monoStyle, width: 26, fontSize: 12, color: i < 3 ? 'var(--accent)' : 'var(--muted)', fontWeight: 500, textAlign: 'right', flexShrink: 0 }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dn}</div>
                <div style={{ ...monoStyle, fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>{s.city}, {s.state}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {safeNum(s.adm) != null && (
                  <span style={{ ...monoStyle, background: 'var(--surface2)', borderRadius: 4, padding: '3px 8px', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.04em' }}>
                    {Math.round(s.adm * 100)}% admit
                  </span>
                )}
                {safeNum(s.sat) != null && (
                  <span style={{ ...monoStyle, background: 'var(--surface2)', borderRadius: 4, padding: '3px 8px', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.04em' }}>
                    {Math.round(s.sat)} SAT
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* SEO text */}
      <div style={{ paddingTop: '3rem', borderTop: '1px solid var(--border)', color: 'var(--muted)', fontSize: 13, lineHeight: 1.9 }}>
        <h2 style={{ fontSize: 15, color: 'var(--text)', marginBottom: '1rem', fontWeight: 400 }}>About College Visualizer</h2>
        <p style={{ marginBottom: '1rem' }}>
          College Visualizer provides free, data-driven profiles for {schools.length.toLocaleString()}+ top U.S. colleges and universities. Every profile includes acceptance rates, SAT and ACT scores, tuition, graduation rates, post-graduation earnings, demographics, and — for {withApp}+ schools — full application requirements including admissions cycles, recommendation letter requirements, and supplemental essay counts.
        </p>
        <p style={{ marginBottom: '2rem' }}>
          Whether you're researching <Link href="/schools/massachusetts-institute-of-technology-mit" style={{ color: 'var(--accent)' }}>MIT's acceptance rate</Link>, comparing <Link href="/schools/harvard-university" style={{ color: 'var(--accent)' }}>Harvard</Link> to <Link href="/schools/yale-university" style={{ color: 'var(--accent)' }}>Yale</Link>, or building your college list, College Visualizer has the data you need.
        </p>
        <p style={{ ...monoStyle, fontSize: 11, color: 'var(--muted)', marginBottom: '0.5rem', lineHeight: 1.8 }}>
          institutional data — U.S. Department of Education College Scorecard, 2025–26.<br />
          application data — Common App, 2025–26.
        </p>
        <p style={{ ...monoStyle, fontSize: 11, color: 'var(--muted)' }}>
          themes inspired by <a href="https://monkeytype.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>monkeytype.com</a>
        </p>
      </div>
    </div>
  );
}
