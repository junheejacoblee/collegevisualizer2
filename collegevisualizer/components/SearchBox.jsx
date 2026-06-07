'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

function toSlug(name) {
  return (name || '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
}
function ownerLabel(c) {
  return { 1: 'Public', 2: 'Private Nonprofit', 3: 'For-Profit' }[c] || '—';
}

// Singleton cache — only fetch once per browser session
let _schoolsCache = null;
let _fetchPromise = null;

function getSchoolsIndex() {
  if (_schoolsCache) return Promise.resolve(_schoolsCache);
  if (_fetchPromise) return _fetchPromise;
  _fetchPromise = fetch('/schools_index.json')
    .then(r => r.json())
    .then(data => { _schoolsCache = data; return data; });
  return _fetchPromise;
}

export default function SearchBox({ schools: schoolsProp, compact, onSelectOverride }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [allSchools, setAllSchools] = useState(schoolsProp || null);
  const ref = useRef();
  const router = useRouter();

  // If no schools prop, fetch the index lazily
  useEffect(() => {
    if (!schoolsProp) {
      getSchoolsIndex().then(setAllSchools);
    }
  }, [schoolsProp]);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const hits = q.trim().length >= 2 && allSchools
    ? allSchools.filter(s => {
        const name = s.display_name || s.name || '';
        return name.toLowerCase().includes(q.toLowerCase());
      }).slice(0, 10)
    : [];

  useEffect(() => setOpen(hits.length > 0), [hits.length]);

  const pick = (s) => {
    setQ(''); setOpen(false);
    const name = s.display_name || s.name;
    if (onSelectOverride) onSelectOverride(s);
    else router.push(`/schools/${toSlug(name)}`);
  };

  return (
    <div ref={ref} style={{ position: 'relative', width: compact ? 240 : '100%', maxWidth: compact ? 240 : 640 }}>
      <div style={{
        display: 'flex', background: 'var(--surface)', borderRadius: 8,
        padding: '0 14px', alignItems: 'center',
        boxShadow: open ? '0 0 0 2px var(--accent)' : 'none', transition: 'box-shadow 0.2s',
      }}>
        <span style={{ color: 'var(--muted)', fontSize: 18, marginRight: 10 }}>⌕</span>
        <input value={q} onChange={e => setQ(e.target.value)}
          placeholder={compact ? 'search...' : 'search colleges...'}
          style={{
            flex: 1, padding: compact ? '10px 0' : '15px 0',
            background: 'transparent', border: 'none',
            color: 'var(--text)', fontSize: compact ? 13 : 15,
            outline: 'none', fontFamily: 'inherit',
          }} />
        {q && <button onClick={() => { setQ(''); setOpen(false); }}
          style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 18, padding: 0 }}>×</button>}
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
          background: 'var(--surface)', borderRadius: 10, zIndex: 999,
          overflow: 'hidden', maxHeight: 380, overflowY: 'auto',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        }}>
          {hits.map(s => {
            const name = s.display_name || s.name;
            return (
              <div key={s.id} onClick={() => pick(s)}
                style={{ padding: '11px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text)' }}>{name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3, fontFamily: "'JetBrains Mono', monospace" }}>
                    {s.city}, {s.state} · {ownerLabel(s.control)}
                  </div>
                </div>
                {s.adm != null && (
                  <span style={{ fontSize: 11, color: 'var(--accent)', background: 'var(--surface2)', borderRadius: 4, padding: '3px 8px', flexShrink: 0, marginLeft: 8, fontFamily: "'JetBrains Mono', monospace" }}>
                    {Math.round(s.adm * 100)}% admit
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
