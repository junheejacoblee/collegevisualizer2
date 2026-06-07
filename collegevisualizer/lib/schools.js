// SERVER ONLY — uses fs/path, never import from client components
import path from 'path';
import { readFileSync } from 'fs';
import { toSlug } from './utils.js';

let _cache = null;

export function getAllSchools() {
  if (_cache) return _cache;
  const filePath = path.join(process.cwd(), 'public', 'schools.json');
  _cache = JSON.parse(readFileSync(filePath, 'utf-8'));
  return _cache;
}

export function getSchoolBySlug(slug) {
  return getAllSchools().find(s => toSlug(getDisplayName(s)) === slug) || null;
}

export function getDisplayName(s) {
  return s.display_name || s.name;
}

export { toSlug, ownerLabel, safeNum, fmt, admLabel } from './utils.js';
