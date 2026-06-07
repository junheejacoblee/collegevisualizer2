// Client-safe utilities — no fs/path

export function toSlug(name) {
  return (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function ownerLabel(c) {
  return { 1: 'Public', 2: 'Private Nonprofit', 3: 'For-Profit' }[c] || '—';
}

export function safeNum(v) {
  if (v == null) return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}

export function fmt(v, type) {
  const n = safeNum(v);
  if (n == null) return '—';
  if (type === 'pct') return `${Math.round(n * 100)}%`;
  if (type === 'usd') return `$${Math.round(n).toLocaleString()}`;
  if (type === 'num') return Math.round(n).toLocaleString();
  return String(n);
}

export function admLabel(a) {
  if (a == null) return '';
  if (a < 0.1) return 'Elite';
  if (a < 0.25) return 'Highly Selective';
  if (a < 0.5) return 'Selective';
  if (a < 0.75) return 'Moderately Selective';
  return 'Open Enrollment';
}

export function getDisplayName(s) {
  return s.display_name || s.name;
}
