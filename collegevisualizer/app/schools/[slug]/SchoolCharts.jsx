'use client';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const mono = "'JetBrains Mono', monospace";

const TT = {
  contentStyle: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, fontFamily: mono, color: 'var(--text)' },
  cursor: { fill: 'rgba(255,255,255,0.03)' },
  itemStyle: { color: 'var(--text)' },
  labelStyle: { color: 'var(--muted)' },
};

// Shades for pie slices — all derived from muted/text/accent opacity levels
const SHADES = ['var(--accent)', 'var(--text)', 'var(--muted)', 'var(--accent)', 'var(--text)', 'var(--muted)', 'var(--accent)'];
// For pie charts we need hex values (recharts can't use CSS vars in fill)
// We pass pieceCols from the server which are actual hex values
export default function SchoolCharts({ earningsData, genderData, progData, raceData, pieceCols }) {
  const axisStyle = { fill: 'var(--muted)', fontSize: 10, fontFamily: mono };

  return (
    <>
      {/* Earnings */}
      {earningsData.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
            post-graduation earnings
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {earningsData.map(d => (
                <div key={d.yr} style={{ background: 'var(--surface)', borderRadius: 8, padding: '1rem 1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: mono, fontSize: 10, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>median {d.yr}</div>
                    <div style={{ fontFamily: mono, fontSize: 28, color: 'var(--accent)', fontWeight: 300, letterSpacing: '-0.02em' }}>${Math.round(d.v).toLocaleString()}</div>
                  </div>
                  <div style={{ fontFamily: mono, fontSize: 24, opacity: 0.15, color: 'var(--text)' }}>$</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--surface)', borderRadius: 8, padding: '1rem' }}>
              <div style={{ height: 155 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={earningsData}>
                    <defs>
                      <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="yr" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={v => `$${Math.round(v / 1000)}k`} />
                    <Tooltip {...TT} formatter={v => [`$${Number(v).toLocaleString()}`, 'median earnings']} />
                    <Area type="monotone" dataKey="v" stroke="var(--accent)" strokeWidth={2} fill="url(#eg)" dot={{ fill: 'var(--accent)', r: 4, strokeWidth: 0 }} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gender + Programs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        {genderData.length > 0 && (
          <div>
            <div style={{ fontFamily: mono, fontSize: 10, color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
              gender split
            </div>
            <div style={{ background: 'var(--surface)', borderRadius: 8, padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              <div style={{ width: 120, height: 120, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={genderData} cx="50%" cy="50%" innerRadius={32} outerRadius={54} dataKey="v" paddingAngle={3} startAngle={90} endAngle={-270} isAnimationActive={false}>
                      {genderData.map((_, i) => <Cell key={i} fill={pieceCols[i % pieceCols.length]} />)}
                    </Pie>
                    <Tooltip {...TT} formatter={v => [`${Math.round(v * 100)}%`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {genderData.map((d, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: pieceCols[i % pieceCols.length], display: 'inline-block' }} />
                      <span style={{ fontFamily: mono, fontSize: 11, color: 'var(--muted)', letterSpacing: '0.04em' }}>{d.name}</span>
                    </div>
                    <div style={{ fontFamily: mono, fontSize: 22, color: 'var(--text)', fontWeight: 300 }}>{Math.round(d.v * 100)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {progData.length > 0 && (
          <div>
            <div style={{ fontFamily: mono, fontSize: 10, color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
              top programs
            </div>
            <div style={{ background: 'var(--surface)', borderRadius: 8, padding: '1.1rem' }}>
              <div style={{ height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progData} layout="vertical" barSize={8}>
                    <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={v => `${Math.round(v * 100)}%`} />
                    <YAxis type="category" dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} width={82} />
                    <Tooltip {...TT} formatter={v => [`${Math.round(v * 100)}%`, 'of students']} />
                    <Bar dataKey="v" radius={[0, 3, 3, 0]} isAnimationActive={false}>
                      {progData.map((_, i) => <Cell key={i} fill={pieceCols[i % pieceCols.length]} fillOpacity={0.9 - i * 0.12} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Race pie */}
      {raceData.length > 0 && (
        <div style={{ height: 180, marginBottom: 12 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={raceData} cx="50%" cy="50%" outerRadius={82} dataKey="v" paddingAngle={2} startAngle={90} endAngle={-270} isAnimationActive={false}>
                {raceData.map((_, i) => <Cell key={i} fill={pieceCols[i % pieceCols.length]} />)}
              </Pie>
              <Tooltip {...TT} formatter={v => [`${Math.round(v * 100)}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}
