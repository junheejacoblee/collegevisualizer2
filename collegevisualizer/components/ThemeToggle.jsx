'use client';
import { useState } from 'react';
import { THEMES, useThemeCtx } from './ThemeProvider';

export default function ThemeToggle() {
  const { themeKey, setThemeKey } = useThemeCtx();
  const [open, setOpen] = useState(false);

  const darkThemes = Object.entries(THEMES).filter(([, t]) => t.dark);
  const lightThemes = Object.entries(THEMES).filter(([, t]) => !t.dark);

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{
          background: 'none', border: '1px solid var(--border)',
          borderRadius: 6, padding: '5px 10px', color: 'var(--muted)',
          cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}
      >
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', border: '1px solid var(--border)' }} />
        {themeKey}
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 199 }} />
          <div style={{
            position: 'absolute', top: 'calc(100% + 10px)', right: 0,
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, zIndex: 200, padding: '1rem',
            boxShadow: '0 16px 48px rgba(0,0,0,0.4)', width: 300,
          }}>
            <Group label="dark" themes={darkThemes} current={themeKey} onSelect={k => { setThemeKey(k); setOpen(false); }} />
            <div style={{ height: 1, background: 'var(--border)', margin: '10px 0' }} />
            <Group label="light" themes={lightThemes} current={themeKey} onSelect={k => { setThemeKey(k); setOpen(false); }} />
          </div>
        </>
      )}
    </div>
  );
}

function Group({ label, themes, current, onSelect }) {
  return (
    <>
      <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 5, marginBottom: 4 }}>
        {themes.map(([k, t]) => (
          <button key={k} onClick={() => onSelect(k)} title={t.label}
            style={{
              background: t.bg, border: `2px solid ${current === k ? t.accent : t.border}`,
              borderRadius: 7, padding: '9px 4px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              transition: 'border-color 0.15s', outline: 'none',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = t.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor = current === k ? t.accent : t.border}
          >
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: t.accent, display: 'block', border: `1px solid ${t.border}` }} />
            <span style={{ fontSize: 8, color: t.muted, letterSpacing: '0.02em', fontFamily: 'inherit', textAlign: 'center', lineHeight: 1.2 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
