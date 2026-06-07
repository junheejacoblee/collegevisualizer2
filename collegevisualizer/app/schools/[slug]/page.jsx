import Link from 'next/link';
import { getAllSchools, getSchoolBySlug, toSlug, ownerLabel, safeNum, fmt, admLabel, getDisplayName } from '../../../lib/schools';
import SchoolCharts from './SchoolCharts';

export async function generateStaticParams() {
  return getAllSchools().map(s => ({ slug: toSlug(getDisplayName(s)) }));
}

export async function generateMetadata({ params }) {
  const s = getSchoolBySlug(params.slug);
  if (!s) return { title: 'School Not Found' };
  const dn = getDisplayName(s);
  const adm = safeNum(s.adm);
  const sat = safeNum(s.sat);
  const act = safeNum(s.act);
  const earn6 = safeNum(s.earn6);
  const earn10 = safeNum(s.earn10);
  const tuitIn = safeNum(s.tuit_in);
  const tuitOut = safeNum(s.tuit_out);
  const netPrice = safeNum(s.npt_pub) ?? safeNum(s.npt_priv);
  const gr = safeNum(s.grad_rate);
  const debt = safeNum(s.debt);
  const app = s.app;

  const desc = [
    `${dn} admissions, application requirements, and student outcomes.`,
    adm != null ? `Acceptance rate: ${Math.round(adm * 100)}%.` : '',
    sat != null ? `Average SAT: ${Math.round(sat)}.` : '',
    act != null ? `ACT midpoint: ${Math.round(act)}.` : '',
    app?.appTypes ? `Application cycles: ${app.appTypes}.` : '',
    app?.supplements != null ? `${app.supplements} supplemental essay${app.supplements === '1' || app.supplements === 1 ? '' : 's'}.` : '',
    app?.teacherReqRec != null ? `Requires ${app.teacherReqRec} teacher rec${app.teacherReqRec !== 1 ? 's' : ''}.` : '',
    app?.counselorRec ? `Counselor rec: ${app.counselorRec}.` : '',
    tuitIn != null ? `In-state tuition: ${fmt(tuitIn, 'usd')}.` : '',
    earn10 != null ? `Median earnings 10yr: ${fmt(earn10, 'usd')}.` : '',
    gr != null ? `Graduation rate: ${Math.round(gr * 100)}%.` : '',
  ].filter(Boolean).join(' ');

  const titleAdm = adm != null ? ` · ${Math.round(adm * 100)}% Acceptance Rate` : '';
  const titleSupp = app?.supplements != null ? ` · ${app.supplements} Essays` : '';

  return {
    title: `${dn}${titleAdm}${titleSupp} | College Visualizer`,
    description: desc.substring(0, 160),
    keywords: [
      `${dn} acceptance rate`, `${dn} SAT scores`, `${dn} ACT scores`,
      `${dn} tuition`, `${dn} admissions`, `${dn} supplemental essays`,
      `${dn} supplemental essay prompts`, `${dn} recommendation letters`,
      `${dn} application requirements`, `${dn} early decision`,
      `${dn} early action`, `${dn} regular decision`,
      app?.appTypes ? `${dn} ${app.appTypes}` : null,
      `${dn} graduation rate`, `${dn} earnings after graduation`,
      `${dn} tuition cost`, `${dn} financial aid`, `${dn} common app`, dn,
    ].filter(Boolean),
    openGraph: { title: `${dn} — College Visualizer`, description: desc.substring(0, 160), type: 'article' },
  };
}

const mono = { fontFamily: "'JetBrains Mono', monospace" };

function SLabel({ children }) {
  return (
    <div style={{ ...mono, fontSize: 10, letterSpacing: '0.18em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
      {children}
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{ background: 'var(--surface)', borderRadius: 8, padding: '12px 14px' }}>
      <div style={{ ...mono, fontSize: 10, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 7 }}>{label}</div>
      <div style={{ ...mono, fontSize: 22, fontWeight: 400, color: accent ? 'var(--accent)' : 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}>{value ?? '—'}</div>
    </div>
  );
}

function Meter({ value }) {
  const pct = value != null ? Math.min(Math.max(value, 0), 1) * 100 : 0;
  return (
    <div style={{ height: 4, background: 'var(--surface2)', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', borderRadius: 2 }} />
    </div>
  );
}

function AppBadge({ label, value }) {
  const hasData = value != null && value !== '' && String(value) !== 'nan';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center' }}>
      <div style={{ ...mono, fontSize: 9, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.4 }}>{label}</div>
      <div style={{ ...mono, fontSize: 16, fontWeight: 400, color: hasData ? 'var(--text)' : 'var(--muted)' }}>
        {hasData ? String(value) : '—'}
      </div>
    </div>
  );
}

export default function SchoolPage({ params }) {
  const s = getSchoolBySlug(params.slug);
  if (!s) return (
    <div style={{ maxWidth: 500, margin: '6rem auto', padding: '0 2rem', textAlign: 'center' }}>
      <div style={{ fontSize: 15, color: 'var(--text)', marginBottom: 8 }}>school not found</div>
      <Link href="/schools" style={{ color: 'var(--accent)', fontSize: 13 }}>← browse all schools</Link>
    </div>
  );

  const dn = getDisplayName(s);
  const adm = safeNum(s.adm);
  const gr = safeNum(s.grad_rate);
  const netPrice = safeNum(s.npt_pub) ?? safeNum(s.npt_priv);
  const app = s.app;
  const PCOLS = ['var(--accent)', 'var(--muted)', 'var(--text)', 'var(--accent)', 'var(--muted)'];
  const PIESLICE = ['#e2b714','#a1a1aa','#818cf8','#38bdf8','#fb923c','#4ade80','#f43f5e'];

  const raceData = [
    { name: 'White', v: safeNum(s.white) }, { name: 'Hispanic', v: safeNum(s.hisp) },
    { name: 'Black', v: safeNum(s.black) }, { name: 'Asian', v: safeNum(s.asian) },
    { name: 'Two or More', v: safeNum(s.two) }, { name: 'AIAN', v: safeNum(s.aian) },
  ].filter(d => d.v != null && d.v > 0).sort((a, b) => b.v - a.v);

  const progData = [
    { name: 'Business', v: safeNum(s.pcip_biz) }, { name: 'Engineering', v: safeNum(s.pcip_eng) },
    { name: 'Computer Science', v: safeNum(s.pcip_cs) }, { name: 'Health', v: safeNum(s.pcip_health) },
    { name: 'Social Science', v: safeNum(s.pcip_social) }, { name: 'Humanities', v: safeNum(s.pcip_hum) },
  ].filter(d => d.v != null && d.v > 0).sort((a, b) => b.v - a.v).slice(0, 5);

  const earningsData = [
    { yr: '6yr', v: safeNum(s.earn6) }, { yr: '10yr', v: safeNum(s.earn10) },
  ].filter(d => d.v != null && d.v > 0);

  const genderData = [
    { name: 'Women', v: safeNum(s.women) }, { name: 'Men', v: safeNum(s.men) },
  ].filter(d => d.v != null && d.v > 0);

  const tuitionMax = Math.max(safeNum(s.tuit_in) || 0, safeNum(s.tuit_out) || 0, netPrice || 0);
  const appTypes = app?.appTypes ? app.appTypes.split('/').map(t => t.trim()) : [];

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1.5rem 8rem' }}>

      {/* Hidden SEO headings */}
      <h2 style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        {dn} Acceptance Rate{adm != null ? `: ${Math.round(adm * 100)}%` : ''} — Admissions Statistics
      </h2>
      <h2 style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        {dn} Application Requirements{app ? ` — ${app.appTypes || ''} — ${app.supplements != null ? app.supplements + ' supplemental essays' : ''} — ${app.teacherReqRec != null ? app.teacherReqRec + ' teacher recommendations' : ''}` : ''}
      </h2>

      {/* Breadcrumb */}
      <nav style={{ ...mono, fontSize: 11, color: 'var(--muted)', marginBottom: '2rem', letterSpacing: '0.03em' }}>
        <Link href="/" style={{ color: 'var(--muted)' }}>home</Link>
        <span style={{ margin: '0 8px' }}>›</span>
        <Link href="/schools" style={{ color: 'var(--muted)' }}>schools</Link>
        <span style={{ margin: '0 8px' }}>›</span>
        <span style={{ color: 'var(--text)' }}>{dn}</span>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: 'clamp(22px,4vw,38px)', fontWeight: 400, letterSpacing: '-0.03em', margin: '0 0 8px', color: 'var(--text)', lineHeight: 1.1 }}>{dn}</h1>
        <div style={{ ...mono, display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: 12, color: 'var(--muted)', alignItems: 'center', letterSpacing: '0.03em' }}>
          {s.city && s.state && <span>{s.city}, {s.state}</span>}
          <span>·</span>
          <span>{ownerLabel(s.control)}</span>
          {s.url && <a href={s.url.startsWith('http') ? s.url : `https://${s.url}`} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>↗ website</a>}
        </div>
      </div>

      {/* APPLICATION STRIP */}
      {app ? (
        <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '1.2rem 1.5rem', marginBottom: '2.5rem', border: '1px solid var(--border)' }}>
          <div style={{ ...mono, fontSize: 10, color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '1rem' }}>application info</div>
          {appTypes.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1.25rem', alignItems: 'center' }}>
              <span style={{ ...mono, fontSize: 10, color: 'var(--muted)', letterSpacing: '0.08em' }}>cycles:</span>
              {appTypes.map(t => (
                <span key={t} style={{ ...mono, padding: '3px 9px', borderRadius: 4, fontSize: 11, border: '1px solid var(--accent)', color: 'var(--accent)', letterSpacing: '0.04em' }}>{t}</span>
              ))}
            </div>
          )}
          <div className="app-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '1rem' }}>
            <AppBadge label="Common App Essay" value={app.commonAppEssay} />
            <AppBadge label="Counselor Rec" value={app.counselorRec} />
            <AppBadge label="Teacher Recs (Req)" value={app.teacherReqRec} />
            <AppBadge label="Teacher Recs (Opt)" value={app.teacherOptRec} />
            <AppBadge label="Other Recs (Req)" value={app.otherReqRec} />
            <AppBadge label="Other Recs (Opt)" value={app.otherOptRec} />
            <AppBadge label="Supplemental Essays" value={app.supplements} />
          </div>
        </div>
      ) : (
        <div style={{ ...mono, background: 'var(--surface)', borderRadius: 10, padding: '0.9rem 1.4rem', marginBottom: '2.5rem', border: '1px solid var(--border)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em' }}>
          application info — not available for this school
        </div>
      )}

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 8, marginBottom: '2.5rem' }}>
        <StatCard label="Acceptance Rate" value={fmt(s.adm, 'pct')} accent />
        <StatCard label="Avg SAT Score" value={safeNum(s.sat) != null ? Math.round(s.sat) : '—'} />
        <StatCard label="ACT Midpoint" value={safeNum(s.act) != null ? Math.round(s.act) : '—'} />
        <StatCard label="Enrollment" value={fmt(s.size, 'num')} />
        <StatCard label="Grad Rate" value={fmt(s.grad_rate, 'pct')} />
        <StatCard label="Median Debt" value={fmt(s.debt, 'usd')} />
      </div>



      {/* Cost */}
      <div style={{ marginBottom: '2.5rem' }}>
        <SLabel>cost &amp; financial aid</SLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 8, marginBottom: 12 }}>
          <StatCard label="In-State Tuition" value={fmt(s.tuit_in, 'usd')} />
          <StatCard label="Out-of-State" value={fmt(s.tuit_out, 'usd')} />
          <StatCard label="Avg Net Price" value={fmt(netPrice, 'usd')} accent />
          <StatCard label="Median Debt" value={fmt(s.debt, 'usd')} />
        </div>
        {tuitionMax > 0 && (
          <div style={{ background: 'var(--surface)', borderRadius: 8, padding: '1.1rem 1.4rem' }}>
            {[
              { label: 'in-state tuition', val: safeNum(s.tuit_in) },
              { label: 'out-of-state tuition', val: safeNum(s.tuit_out) },
              { label: 'avg net price', val: netPrice },
            ].filter(r => r.val != null).map(row => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <span style={{ ...mono, width: 145, fontSize: 11, color: 'var(--muted)', flexShrink: 0, letterSpacing: '0.03em' }}>{row.label}</span>
                <div style={{ flex: 1 }}><Meter value={row.val / tuitionMax} /></div>
                <span style={{ ...mono, width: 80, fontSize: 12, color: 'var(--text)', textAlign: 'right' }}>{fmt(row.val, 'usd')}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Charts (client) */}
      <SchoolCharts earningsData={earningsData} genderData={genderData} progData={progData} raceData={raceData} pieceCols={PIESLICE} />

      {/* Race bars */}
      {raceData.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <SLabel>race &amp; ethnicity</SLabel>
          <div style={{ background: 'var(--surface)', borderRadius: 8, padding: '1.1rem 1.4rem' }}>
            {raceData.map((d, i) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < raceData.length - 1 ? 10 : 0 }}>
                <span style={{ width: 6, height: 6, borderRadius: 1, background: 'var(--muted)', flexShrink: 0 }} />
                <span style={{ ...mono, width: 100, fontSize: 11, color: 'var(--muted)', flexShrink: 0, letterSpacing: '0.03em' }}>{d.name}</span>
                <div style={{ flex: 1 }}><Meter value={d.v} /></div>
                <span style={{ ...mono, width: 36, fontSize: 11, color: 'var(--text)', textAlign: 'right' }}>{Math.round(d.v * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEO paragraph */}
      <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--border)', color: 'var(--muted)', fontSize: 13, lineHeight: 1.9 }}>
        <h2 style={{ fontSize: 14, color: 'var(--text)', fontWeight: 400, marginBottom: '0.75rem' }}>About {dn}</h2>
        <p>
          {dn} is a {ownerLabel(s.control).toLowerCase()} institution in {s.city}, {s.state}.
          {adm != null ? ` Acceptance rate: ${Math.round(adm * 100)}% (${admLabel(adm).toLowerCase()}).` : ''}
          {safeNum(s.sat) != null ? ` Average SAT: ${Math.round(s.sat)}.` : ''}
          {safeNum(s.act) != null ? ` ACT midpoint: ${Math.round(s.act)}.` : ''}
          {safeNum(s.size) != null ? ` Enrollment: ~${Math.round(s.size).toLocaleString()} undergraduates.` : ''}
          {gr != null ? ` 4-year graduation rate: ${Math.round(gr * 100)}%.` : ''}
        </p>
        {app && (
          <p style={{ marginTop: '0.75rem' }}>
            {dn} accepts applications through {app.appTypes || 'Regular Decision'}.
            {app.counselorRec ? ` Counselor recommendation: ${app.counselorRec}.` : ''}
            {app.teacherReqRec != null ? ` Required teacher recs: ${app.teacherReqRec}.` : ''}
            {app.teacherOptRec != null ? ` Optional teacher recs: ${app.teacherOptRec}.` : ''}
            {app.otherReqRec != null ? ` Required other recs: ${app.otherReqRec}.` : ''}
            {app.otherOptRec != null ? ` Optional other recs: ${app.otherOptRec}.` : ''}
            {app.supplements != null ? ` Supplemental essays: ${app.supplements}.` : ''}
            {app.commonAppEssay ? ` Common App essay: ${app.commonAppEssay}.` : ''}
          </p>
        )}
        <p style={{ marginTop: '0.75rem' }}>
          {safeNum(s.tuit_in) != null ? `In-state tuition: ${fmt(s.tuit_in, 'usd')}.` : ''}
          {safeNum(s.tuit_out) != null ? ` Out-of-state: ${fmt(s.tuit_out, 'usd')}.` : ''}
          {netPrice != null ? ` Avg net price: ${fmt(netPrice, 'usd')}.` : ''}
          {safeNum(s.debt) != null ? ` Median debt: ${fmt(s.debt, 'usd')}.` : ''}
          {earningsData.find(d => d.yr === '6yr') ? ` Median earnings 6yr: ${fmt(earningsData.find(d => d.yr === '6yr').v, 'usd')}.` : ''}
          {earningsData.find(d => d.yr === '10yr') ? ` Median earnings 10yr: ${fmt(earningsData.find(d => d.yr === '10yr').v, 'usd')}.` : ''}
        </p>
      </div>

      <p style={{ ...mono, fontSize: 11, color: 'var(--muted)', marginTop: '1.5rem', lineHeight: 1.8, letterSpacing: '0.02em' }}>
        institutional data — U.S. Department of Education College Scorecard, 2025–26.
        {app && ' application data — Common App, 2025–26.'}
      </p>

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href="/schools" style={{ ...mono, fontSize: 12, color: 'var(--muted)', letterSpacing: '0.03em' }}>← all schools</Link>
        <Link href="/rankings" style={{ ...mono, fontSize: 12, color: 'var(--muted)', letterSpacing: '0.03em' }}>rankings</Link>
        <Link href="/compare" style={{ ...mono, fontSize: 12, color: 'var(--accent)', letterSpacing: '0.03em' }}>compare →</Link>
      </div>
    </div>
  );
}
