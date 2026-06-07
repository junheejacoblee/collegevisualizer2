'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'home' },
  { href: '/schools', label: 'browse' },
  { href: '/rankings', label: 'rankings' },
  { href: '/compare', label: 'compare' },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <div style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {LINKS.map(({ href, label }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <Link key={href} href={href} style={{
            padding: '18px 12px',
            fontSize: 12,
            color: active ? 'var(--text)' : 'var(--muted)',
            display: 'block',
            borderBottom: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
            marginBottom: '-1px',
            transition: 'color 0.15s',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.04em',
          }}>
            {label}
          </Link>
        );
      })}
    </div>
  );
}
