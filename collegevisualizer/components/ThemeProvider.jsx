'use client';
import { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = {
  // ── DEFAULT THEMES ────────────────────────────────────────────
  obsidian:   { label: 'obsidian',    dark: true,  accent: '#eeeeee', bg: '#111111', surface: '#191919', surface2: '#222222', border: '#2a2a2a', muted: '#444444', text: '#eeeeee',  favbg: '#191919' },
  ivory:      { label: 'ivory',       dark: false, accent: '#444444', bg: '#eeeeee', surface: '#dddddd', surface2: '#cccccc', border: '#bbbbbb', muted: '#b2b2b2', text: '#444444',  favbg: '#dddddd' },
  // ── CUSTOM THEMES ─────────────────────────────────────────────
  wisteria:   { label: 'wisteria',    dark: false, accent: '#b94189', bg: '#fffbfe', surface: '#ecdcee', surface2: '#e0cce3', border: '#d4b8d8', muted: '#e094c2', text: '#5c2954',  favbg: '#ecdcee' },
  dawnwood:   { label: 'dawnwood',    dark: false, accent: '#56949f', bg: '#fffaf3', surface: '#f0e9df', surface2: '#e6ddd4', border: '#d8d0c6', muted: '#c4a7e7', text: '#286983',  favbg: '#f0e9df' },
  glacier:    { label: 'glacier',     dark: false, accent: '#2d539e', bg: '#e8e9ec', surface: '#ccceda', surface2: '#bbbdc9', border: '#adb1c4', muted: '#adb1c4', text: '#33374c',  favbg: '#ccceda' },
  skyberry:   { label: 'skyberry',    dark: false, accent: '#506477', bg: '#dae0f5', surface: '#c1c7df', surface2: '#b0b7d4', border: '#92a4be', muted: '#92a4be', text: '#678198',  favbg: '#c1c7df' },
  velvet:     { label: 'velvet',      dark: false, accent: '#ae185e', bg: '#dadbdc', surface: '#bec1d2', surface2: '#aeB1c2', border: '#9ea1b2', muted: '#3846b1', text: '#414141',  favbg: '#bec1d2' },
  metro:      { label: 'metro',       dark: false, accent: '#8fd1c3', bg: '#dbdbdb', surface: '#e8e8e8', surface2: '#d0d0d0', border: '#b8b8b8', muted: '#a3a2a2', text: '#454545',  favbg: '#e8e8e8' },
  skyline:    { label: 'skyline',     dark: false, accent: '#81c4dd', bg: '#ced7e0', surface: '#b7cada', surface2: '#a5b9ca', border: '#7599b1', muted: '#7599b1', text: '#3b4c58',  favbg: '#b7cada' },
  windflower: { label: 'windflower',  dark: false, accent: '#7d67a9', bg: '#e8d5c4', surface: '#f6e6da', surface2: '#e8d8cc', border: '#d4c4b0', muted: '#3a98b9', text: '#3a98b9',  favbg: '#f6e6da' },
  aquapaper:  { label: 'aqua paper',  dark: false, accent: '#fcfbf6', bg: '#afcbdd', surface: '#9fc1d4', surface2: '#8fb1c4', border: '#85a5bb', muted: '#85a5bb', text: '#1a2633',  favbg: '#9fc1d4' },
  willowmist: { label: 'willow mist', dark: true,  accent: '#eaf1f3', bg: '#7b9c98', surface: '#72908d', surface2: '#687f7c', border: '#495755', muted: '#495755', text: '#eaf1f3',  favbg: '#72908d' },
  horizon:    { label: 'horizon',     dark: true,  accent: '#ffffff', bg: '#6c687f', surface: '#77738c', surface2: '#67637c', border: '#9994b8', muted: '#9994b8', text: '#ffffff',  favbg: '#77738c' },
  cloudveil:  { label: 'cloudveil',   dark: true,  accent: '#f8cdc6', bg: '#4a5b6e', surface: '#425366', surface2: '#384a5e', border: '#9ec1cc', muted: '#9ec1cc', text: '#f5efee',  favbg: '#425366' },
  flux:       { label: 'flux',        dark: true,  accent: '#80cbc4', bg: '#263238', surface: '#2e3c43', surface2: '#374a53', border: '#4c6772', muted: '#4c6772', text: '#e6edf3',  favbg: '#2e3c43' },
  sandrift:   { label: 'sandrift',    dark: true,  accent: '#af8f5c', bg: '#1a2b3e', surface: '#152231', surface2: '#0f1828', border: '#3a506c', muted: '#3a506c', text: '#c9c8bf',  favbg: '#152231' },
  bliss:      { label: 'bliss',       dark: true,  accent: '#f0d3c9', bg: '#262727', surface: '#343231', surface2: '#3e3d3b', border: '#665957', muted: '#665957', text: '#ffffff',  favbg: '#343231' },
  frost:      { label: 'frost',       dark: true,  accent: '#2b5f6d', bg: '#242425', surface: '#303333', surface2: '#3a3d3d', border: '#505b5e', muted: '#505b5e', text: '#ccc2b1',  favbg: '#303333' },
  nocturne:   { label: 'nocturne',    dark: true,  accent: '#60759f', bg: '#0b0e13', surface: '#141a24', surface2: '#1c2433', border: '#394760', muted: '#394760', text: '#9fadc6',  favbg: '#141a24' },
  abyss:      { label: 'abyss',       dark: true,  accent: '#e51376', bg: '#00021b', surface: '#18214c', surface2: '#1f2a5c', border: '#3c4c79', muted: '#3c4c79', text: '#ffffff',  favbg: '#18214c' },
};

const ThemeCtx = createContext({ theme: THEMES.obsidian, themeKey: 'obsidian', setThemeKey: () => {} });
export const useThemeCtx = () => useContext(ThemeCtx);

export default function ThemeProvider({ children }) {
  const [key, setKey] = useState('obsidian');

  useEffect(() => {
    const saved = localStorage.getItem('cv-theme');
    if (saved && THEMES[saved]) setKey(saved);
  }, []);

  useEffect(() => {
    const t = THEMES[key];
    const root = document.documentElement;
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--bg', t.bg);
    root.style.setProperty('--surface', t.surface);
    root.style.setProperty('--surface2', t.surface2);
    root.style.setProperty('--border', t.border);
    root.style.setProperty('--muted', t.muted);
    root.style.setProperty('--text', t.text);
    root.style.setProperty('color-scheme', t.dark ? 'dark' : 'light');
    localStorage.setItem('cv-theme', key);
    updateFavicon(key);
  }, [key]);

  const setThemeKey = (k) => { if (THEMES[k]) setKey(k); };

  return (
    <ThemeCtx.Provider value={{ theme: THEMES[key], themeKey: key, setThemeKey }}>
      {children}
    </ThemeCtx.Provider>
  );
}

const FAVICON_SVGS = {
  obsidian: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#191919"/><line x1="7" y1="9" x2="25" y2="9" stroke="#eeeeee" stroke-width="2.2" stroke-linecap="round"/><line x1="9" y1="16" x2="23" y2="16" stroke="#eeeeee" stroke-width="2.2" stroke-linecap="round"/><line x1="7" y1="23" x2="25" y2="23" stroke="#eeeeee" stroke-width="2.2" stroke-linecap="round"/></svg>',
  ivory: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#dddddd"/><line x1="7" y1="9" x2="25" y2="9" stroke="#444444" stroke-width="2.2" stroke-linecap="round"/><line x1="9" y1="16" x2="23" y2="16" stroke="#444444" stroke-width="2.2" stroke-linecap="round"/><line x1="7" y1="23" x2="25" y2="23" stroke="#444444" stroke-width="2.2" stroke-linecap="round"/></svg>',
  wisteria: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#ecdcee"/><line x1="7" y1="9" x2="25" y2="9" stroke="#b94189" stroke-width="2.2" stroke-linecap="round"/><line x1="9" y1="16" x2="23" y2="16" stroke="#b94189" stroke-width="2.2" stroke-linecap="round"/><line x1="7" y1="23" x2="25" y2="23" stroke="#b94189" stroke-width="2.2" stroke-linecap="round"/></svg>',
  dawnwood: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#f0e9df"/><line x1="7" y1="9" x2="25" y2="9" stroke="#56949f" stroke-width="2.2" stroke-linecap="round"/><line x1="9" y1="16" x2="23" y2="16" stroke="#56949f" stroke-width="2.2" stroke-linecap="round"/><line x1="7" y1="23" x2="25" y2="23" stroke="#56949f" stroke-width="2.2" stroke-linecap="round"/></svg>',
  glacier: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#ccceda"/><line x1="7" y1="9" x2="25" y2="9" stroke="#2d539e" stroke-width="2.2" stroke-linecap="round"/><line x1="9" y1="16" x2="23" y2="16" stroke="#2d539e" stroke-width="2.2" stroke-linecap="round"/><line x1="7" y1="23" x2="25" y2="23" stroke="#2d539e" stroke-width="2.2" stroke-linecap="round"/></svg>',
  skyberry: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#c1c7df"/><line x1="7" y1="9" x2="25" y2="9" stroke="#506477" stroke-width="2.2" stroke-linecap="round"/><line x1="9" y1="16" x2="23" y2="16" stroke="#506477" stroke-width="2.2" stroke-linecap="round"/><line x1="7" y1="23" x2="25" y2="23" stroke="#506477" stroke-width="2.2" stroke-linecap="round"/></svg>',
  velvet: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#bec1d2"/><line x1="7" y1="9" x2="25" y2="9" stroke="#ae185e" stroke-width="2.2" stroke-linecap="round"/><line x1="9" y1="16" x2="23" y2="16" stroke="#ae185e" stroke-width="2.2" stroke-linecap="round"/><line x1="7" y1="23" x2="25" y2="23" stroke="#ae185e" stroke-width="2.2" stroke-linecap="round"/></svg>',
  metro: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#e8e8e8"/><line x1="7" y1="9" x2="25" y2="9" stroke="#8fd1c3" stroke-width="2.2" stroke-linecap="round"/><line x1="9" y1="16" x2="23" y2="16" stroke="#8fd1c3" stroke-width="2.2" stroke-linecap="round"/><line x1="7" y1="23" x2="25" y2="23" stroke="#8fd1c3" stroke-width="2.2" stroke-linecap="round"/></svg>',
  skyline: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#b7cada"/><line x1="7" y1="9" x2="25" y2="9" stroke="#81c4dd" stroke-width="2.2" stroke-linecap="round"/><line x1="9" y1="16" x2="23" y2="16" stroke="#81c4dd" stroke-width="2.2" stroke-linecap="round"/><line x1="7" y1="23" x2="25" y2="23" stroke="#81c4dd" stroke-width="2.2" stroke-linecap="round"/></svg>',
  windflower: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#f6e6da"/><line x1="7" y1="9" x2="25" y2="9" stroke="#7d67a9" stroke-width="2.2" stroke-linecap="round"/><line x1="9" y1="16" x2="23" y2="16" stroke="#7d67a9" stroke-width="2.2" stroke-linecap="round"/><line x1="7" y1="23" x2="25" y2="23" stroke="#7d67a9" stroke-width="2.2" stroke-linecap="round"/></svg>',
  aquapaper: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#9fc1d4"/><line x1="7" y1="9" x2="25" y2="9" stroke="#1a2633" stroke-width="2.2" stroke-linecap="round"/><line x1="9" y1="16" x2="23" y2="16" stroke="#1a2633" stroke-width="2.2" stroke-linecap="round"/><line x1="7" y1="23" x2="25" y2="23" stroke="#1a2633" stroke-width="2.2" stroke-linecap="round"/></svg>',
  willowmist: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#72908d"/><line x1="7" y1="9" x2="25" y2="9" stroke="#eaf1f3" stroke-width="2.2" stroke-linecap="round"/><line x1="9" y1="16" x2="23" y2="16" stroke="#eaf1f3" stroke-width="2.2" stroke-linecap="round"/><line x1="7" y1="23" x2="25" y2="23" stroke="#eaf1f3" stroke-width="2.2" stroke-linecap="round"/></svg>',
  horizon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#77738c"/><line x1="7" y1="9" x2="25" y2="9" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/><line x1="9" y1="16" x2="23" y2="16" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/><line x1="7" y1="23" x2="25" y2="23" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/></svg>',
  cloudveil: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#425366"/><line x1="7" y1="9" x2="25" y2="9" stroke="#f8cdc6" stroke-width="2.2" stroke-linecap="round"/><line x1="9" y1="16" x2="23" y2="16" stroke="#f8cdc6" stroke-width="2.2" stroke-linecap="round"/><line x1="7" y1="23" x2="25" y2="23" stroke="#f8cdc6" stroke-width="2.2" stroke-linecap="round"/></svg>',
  flux: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#2e3c43"/><line x1="7" y1="9" x2="25" y2="9" stroke="#80cbc4" stroke-width="2.2" stroke-linecap="round"/><line x1="9" y1="16" x2="23" y2="16" stroke="#80cbc4" stroke-width="2.2" stroke-linecap="round"/><line x1="7" y1="23" x2="25" y2="23" stroke="#80cbc4" stroke-width="2.2" stroke-linecap="round"/></svg>',
  sandrift: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#152231"/><line x1="7" y1="9" x2="25" y2="9" stroke="#af8f5c" stroke-width="2.2" stroke-linecap="round"/><line x1="9" y1="16" x2="23" y2="16" stroke="#af8f5c" stroke-width="2.2" stroke-linecap="round"/><line x1="7" y1="23" x2="25" y2="23" stroke="#af8f5c" stroke-width="2.2" stroke-linecap="round"/></svg>',
  bliss: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#343231"/><line x1="7" y1="9" x2="25" y2="9" stroke="#f0d3c9" stroke-width="2.2" stroke-linecap="round"/><line x1="9" y1="16" x2="23" y2="16" stroke="#f0d3c9" stroke-width="2.2" stroke-linecap="round"/><line x1="7" y1="23" x2="25" y2="23" stroke="#f0d3c9" stroke-width="2.2" stroke-linecap="round"/></svg>',
  frost: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#303333"/><line x1="7" y1="9" x2="25" y2="9" stroke="#2b5f6d" stroke-width="2.2" stroke-linecap="round"/><line x1="9" y1="16" x2="23" y2="16" stroke="#2b5f6d" stroke-width="2.2" stroke-linecap="round"/><line x1="7" y1="23" x2="25" y2="23" stroke="#2b5f6d" stroke-width="2.2" stroke-linecap="round"/></svg>',
  nocturne: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#141a24"/><line x1="7" y1="9" x2="25" y2="9" stroke="#60759f" stroke-width="2.2" stroke-linecap="round"/><line x1="9" y1="16" x2="23" y2="16" stroke="#60759f" stroke-width="2.2" stroke-linecap="round"/><line x1="7" y1="23" x2="25" y2="23" stroke="#60759f" stroke-width="2.2" stroke-linecap="round"/></svg>',
  abyss: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#18214c"/><line x1="7" y1="9" x2="25" y2="9" stroke="#e51376" stroke-width="2.2" stroke-linecap="round"/><line x1="9" y1="16" x2="23" y2="16" stroke="#e51376" stroke-width="2.2" stroke-linecap="round"/><line x1="7" y1="23" x2="25" y2="23" stroke="#e51376" stroke-width="2.2" stroke-linecap="round"/></svg>',
};

function updateFavicon(themeKey) {
  if (typeof document === 'undefined') return;
  const svgStr = FAVICON_SVGS[themeKey];
  if (!svgStr) return;
  const encoded = encodeURIComponent(svgStr);
  const dataUrl = `data:image/svg+xml,${encoded}`;

  // Remove ALL existing favicon links — browsers cache them aggressively
  // so we must remove and re-add to force a refresh
  document.querySelectorAll("link[rel*='icon']").forEach(el => {
    try { el.parentNode && el.parentNode.removeChild(el); } catch(e) {}
  });

  // Create a fresh link element and append — guaranteed to trigger browser update
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = dataUrl;
  document.head.appendChild(link);
}
