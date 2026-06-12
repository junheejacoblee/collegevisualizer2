const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

// ── CLOUDVEIL THEME ────────────────────────────────────────────────────────
const C = {
  bg:       "4a5b6e",
  surface:  "425366",
  surface2: "384a5e",
  border:   "9ec1cc",
  accent:   "f8cdc6",
  text:     "f5efee",
  muted:    "9ec1cc",
  dim:      "7a9aae",
};

// ── HELPERS ────────────────────────────────────────────────────────────────
const fmt = {
  pct: v => v != null ? `${Math.round(v * 100)}%` : "—",
  usd: v => v != null ? `$${Math.round(v).toLocaleString()}` : "—",
  num: v => v != null ? Math.round(v).toLocaleString() : "—",
};

function makeShadow() {
  return { type: "outer", color: "000000", blur: 8, offset: 3, angle: 45, opacity: 0.18 };
}

const W = 7.5, H = 7.5, PAD = 0.38;

function ownerLabel(c) {
  return { 1: "Public", 2: "Private Nonprofit", 3: "For-Profit" }[c] || "Unknown";
}

function admLabel(a) {
  if (a == null) return "";
  if (a < 0.1) return "Elite";
  if (a < 0.25) return "Highly Selective";
  if (a < 0.5) return "Selective";
  if (a < 0.75) return "Moderately Selective";
  return "Open Enrollment";
}

// Build school object from JSON record
function buildSchool(s) {
  const dn = s.display_name || s.name || "";
  // Extract short name — use abbreviation in parens if present, else first word
  const parenMatch = dn.match(/\(([^)]+)\)$/);
  const shortName = parenMatch ? parenMatch[1] : dn.split(" ")[0];

  const programs = [
    { name: "Engineering",    pct: s.pcip_eng    ? +(s.pcip_eng * 100).toFixed(1)    : null },
    { name: "Computer Sci",   pct: s.pcip_cs     ? +(s.pcip_cs * 100).toFixed(1)     : null },
    { name: "Business",       pct: s.pcip_biz    ? +(s.pcip_biz * 100).toFixed(1)    : null },
    { name: "Health",         pct: s.pcip_health ? +(s.pcip_health * 100).toFixed(1) : null },
    { name: "Social Science", pct: s.pcip_social ? +(s.pcip_social * 100).toFixed(1) : null },
    { name: "Humanities",     pct: s.pcip_hum    ? +(s.pcip_hum * 100).toFixed(1)    : null },
  ].filter(p => p.pct != null && p.pct > 0).sort((a, b) => b.pct - a.pct).slice(0, 5);

  return {
    name: dn,
    shortName,
    city: s.city && s.state ? `${s.city}, ${s.state}` : (s.city || s.state || ""),
    type: ownerLabel(s.control),
    adm: s.adm != null ? +s.adm : null,
    sat: s.sat != null ? Math.round(s.sat) : null,
    act: s.act != null ? Math.round(s.act) : null,
    size: s.size != null ? +s.size : null,
    gradRate: s.grad_rate != null ? +s.grad_rate : null,
    tuitIn: s.tuit_in != null ? +s.tuit_in : null,
    tuitOut: s.tuit_out != null ? +s.tuit_out : null,
    netPrice: s.npt_pub != null ? +s.npt_pub : s.npt_priv != null ? +s.npt_priv : null,
    debt: s.debt != null ? +s.debt : null,
    earn6: s.earn6 != null ? +s.earn6 : null,
    earn10: s.earn10 != null ? +s.earn10 : null,
    white: s.white != null ? +s.white : null,
    black: s.black != null ? +s.black : null,
    hisp: s.hisp != null ? +s.hisp : null,
    asian: s.asian != null ? +s.asian : null,
    two: s.two != null ? +s.two : null,
    men: s.men != null ? +s.men : null,
    women: s.women != null ? +s.women : null,
    app: s.app || null,
    programs,
  };
}

// ── SHARED HELPERS ─────────────────────────────────────────────────────────
function addBackground(slide) { slide.background = { color: C.bg }; }

function addLogo(slide) {
  slide.addText("Ξ", {
    x: W - PAD - 0.4, y: PAD - 0.05, w: 0.4, h: 0.35,
    fontSize: 14, color: C.accent, fontFace: "Arial", align: "right", margin: 0,
  });
  slide.addText("collegevisualizer", {
    x: PAD, y: PAD - 0.02, w: 2.2, h: 0.28,
    fontSize: 8, color: C.dim, fontFace: "Arial", charSpacing: 1.5, margin: 0,
  });
}

// ── SLIDE 1: COVER ─────────────────────────────────────────────────────────
function slide1(pres, school) {
  const s = pres.addSlide();
  addBackground(s); addLogo(s);

  s.addText(school.shortName, {
    x: PAD, y: 1.5, w: W - PAD * 2, h: 1.7,
    fontSize: Math.min(80, Math.max(40, 80 - Math.max(0, school.shortName.length - 4) * 8)),
    fontFace: "Arial", bold: true, color: C.accent, align: "center", margin: 0,
  });
  s.addText(school.name.replace(`(${school.shortName})`, "").trim(), {
    x: PAD, y: 3.3, w: W - PAD * 2, h: 0.5,
    fontSize: 14, fontFace: "Arial", color: C.text, align: "center", margin: 0,
  });
  s.addText(`${school.city}  ·  ${school.type}`, {
    x: PAD, y: 3.88, w: W - PAD * 2, h: 0.3,
    fontSize: 10, fontFace: "Arial", color: C.muted, align: "center", charSpacing: 1, margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: W / 2 - 1, y: 4.34, w: 2, h: 0.02,
    fill: { color: C.border }, line: { color: C.border, width: 0 },
  });

  const stats = [
    { label: "ACCEPTANCE", val: fmt.pct(school.adm) },
    { label: "AVG SAT",    val: school.sat ? String(school.sat) : "—" },
    { label: "GRAD RATE",  val: fmt.pct(school.gradRate) },
  ];
  stats.forEach((st, i) => {
    const x = PAD + i * ((W - PAD * 2) / 3);
    const bw = (W - PAD * 2) / 3;
    s.addText(st.val, { x, y: 4.6, w: bw, h: 0.55, fontSize: 22, fontFace: "Arial", bold: true, color: C.accent, align: "center", margin: 0 });
    s.addText(st.label, { x, y: 5.18, w: bw, h: 0.26, fontSize: 8, fontFace: "Arial", color: C.muted, align: "center", charSpacing: 1.5, margin: 0 });
  });

  s.addText("swipe for full profile →", {
    x: PAD, y: 6.9, w: W - PAD * 2, h: 0.26,
    fontSize: 9, fontFace: "Arial", color: C.dim, align: "center", charSpacing: 1, margin: 0,
  });
}

// ── SLIDE 2: ADMISSIONS ───────────────────────────────────────────────────
function slide2(pres, school) {
  const s = pres.addSlide();
  addBackground(s); addLogo(s);

  s.addText("ADMISSIONS", { x: PAD, y: 0.72, w: W - PAD * 2, h: 0.4, fontSize: 10, fontFace: "Arial", charSpacing: 3, color: C.muted, align: "left", margin: 0 });
  s.addText("Selectivity & Scores", { x: PAD, y: 1.08, w: W - PAD * 2, h: 0.55, fontSize: 26, fontFace: "Arial", bold: true, color: C.text, align: "left", margin: 0 });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: PAD, y: 1.82, w: W - PAD * 2, h: 1.5, fill: { color: C.surface }, rectRadius: 0.1, shadow: makeShadow() });
  s.addText(fmt.pct(school.adm), { x: PAD + 0.3, y: 1.9, w: 2.2, h: 1.3, fontSize: 64, fontFace: "Arial", bold: true, color: C.accent, align: "left", margin: 0 });
  s.addText("ACCEPTANCE\nRATE", { x: PAD + 2.6, y: 2.15, w: 2, h: 0.8, fontSize: 11, fontFace: "Arial", color: C.muted, align: "left", charSpacing: 1.5, margin: 0 });
  s.addText(admLabel(school.adm), { x: PAD + 2.6, y: 2.82, w: 2.5, h: 0.36, fontSize: 13, fontFace: "Arial", bold: true, color: C.accent, align: "left", margin: 0 });

  const scores = [
    { label: "Avg SAT", val: school.sat ? String(school.sat) : "—", sub: "out of 1600" },
    { label: "ACT Mid", val: school.act ? String(school.act) : "—", sub: "out of 36" },
    { label: "Enrollment", val: fmt.num(school.size), sub: "undergrads" },
    { label: "Grad Rate", val: fmt.pct(school.gradRate), sub: "4-year" },
  ];
  const cw = (W - PAD * 2 - 0.12) / 2;
  scores.forEach((sc, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const cx = PAD + col * (cw + 0.12), cy = 3.55 + row * 1.05;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx, y: cy, w: cw, h: 0.92, fill: { color: C.surface }, rectRadius: 0.08, shadow: makeShadow() });
    s.addText(sc.val, { x: cx + 0.15, y: cy + 0.08, w: cw - 0.3, h: 0.44, fontSize: 22, fontFace: "Arial", bold: true, color: C.text, align: "left", margin: 0 });
    s.addText(`${sc.label}  ·  ${sc.sub}`, { x: cx + 0.15, y: cy + 0.52, w: cw - 0.3, h: 0.28, fontSize: 8.5, fontFace: "Arial", color: C.muted, align: "left", charSpacing: 0.5, margin: 0 });
  });

  s.addText(`${school.shortName}  ·  2 / 8`, { x: PAD, y: 7.06, w: W - PAD * 2, h: 0.22, fontSize: 8, fontFace: "Arial", color: C.dim, align: "center", charSpacing: 1, margin: 0 });
}

// ── SLIDE 3: COST ─────────────────────────────────────────────────────────
function slide3(pres, school) {
  const s = pres.addSlide();
  addBackground(s); addLogo(s);

  s.addText("COST & AID", { x: PAD, y: 0.72, w: W - PAD * 2, h: 0.4, fontSize: 10, fontFace: "Arial", charSpacing: 3, color: C.muted, align: "left", margin: 0 });
  s.addText("Tuition & Financial Aid", { x: PAD, y: 1.08, w: W - PAD * 2, h: 0.55, fontSize: 26, fontFace: "Arial", bold: true, color: C.text, align: "left", margin: 0 });

  const items = [
    { label: "Tuition (Out-of-State)", val: school.tuitOut },
    { label: "Avg Net Price (after aid)", val: school.netPrice },
    { label: "Median Student Debt", val: school.debt },
  ];
  const maxVal = Math.max(...items.map(i => i.val || 0), 1);
  const barW = W - PAD * 2 - 2.4;

  items.forEach((item, i) => {
    const y = 1.85 + i * 1.4;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: PAD, y, w: W - PAD * 2, h: 1.22, fill: { color: C.surface }, rectRadius: 0.1, shadow: makeShadow() });
    s.addText(item.label, { x: PAD + 0.2, y: y + 0.13, w: W - PAD * 2 - 0.4, h: 0.3, fontSize: 9, fontFace: "Arial", color: C.muted, align: "left", charSpacing: 1, margin: 0 });
    s.addText(fmt.usd(item.val), { x: PAD + 0.2, y: y + 0.42, w: 2, h: 0.36, fontSize: 20, fontFace: "Arial", bold: true, color: i === 1 ? C.accent : C.text, align: "left", margin: 0 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: PAD + 2.3, y: y + 0.52, w: barW, h: 0.14, fill: { color: C.surface2 }, rectRadius: 0.04 });
    const fillPct = item.val ? item.val / maxVal : 0;
    if (fillPct > 0) s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: PAD + 2.3, y: y + 0.52, w: barW * fillPct, h: 0.14, fill: { color: i === 1 ? C.accent : C.border }, rectRadius: 0.04 });
    if (i === 1) s.addText("← avg after financial aid", { x: PAD + 0.2, y: y + 0.82, w: W - PAD * 2 - 0.4, h: 0.24, fontSize: 8, fontFace: "Arial", italic: true, color: C.dim, align: "left", margin: 0 });
  });

  s.addText(`${school.shortName}  ·  3 / 8`, { x: PAD, y: 7.06, w: W - PAD * 2, h: 0.22, fontSize: 8, fontFace: "Arial", color: C.dim, align: "center", charSpacing: 1, margin: 0 });
}

// ── SLIDE 4: EARNINGS ─────────────────────────────────────────────────────
function slide4(pres, school) {
  const s = pres.addSlide();
  addBackground(s); addLogo(s);

  s.addText("OUTCOMES", { x: PAD, y: 0.72, w: W - PAD * 2, h: 0.4, fontSize: 10, fontFace: "Arial", charSpacing: 3, color: C.muted, align: "left", margin: 0 });
  s.addText("Post-Grad Earnings", { x: PAD, y: 1.08, w: W - PAD * 2, h: 0.55, fontSize: 26, fontFace: "Arial", bold: true, color: C.text, align: "left", margin: 0 });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: PAD, y: 1.82, w: W - PAD * 2, h: 1.8, fill: { color: C.surface }, rectRadius: 0.1, shadow: makeShadow() });
  s.addText("MEDIAN EARNINGS  ·  10 YEARS AFTER ENROLLMENT", { x: PAD + 0.25, y: 1.96, w: W - PAD * 2 - 0.5, h: 0.28, fontSize: 8, fontFace: "Arial", charSpacing: 1.2, color: C.muted, align: "left", margin: 0 });
  s.addText(fmt.usd(school.earn10), { x: PAD + 0.25, y: 2.25, w: W - PAD * 2 - 0.5, h: 0.9, fontSize: 56, fontFace: "Arial", bold: true, color: C.accent, align: "left", margin: 0 });
  s.addText("per year", { x: PAD + 0.25, y: 3.15, w: W - PAD * 2 - 0.5, h: 0.28, fontSize: 11, fontFace: "Arial", color: C.dim, align: "left", margin: 0 });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: PAD, y: 3.82, w: W - PAD * 2, h: 1.1, fill: { color: C.surface }, rectRadius: 0.1, shadow: makeShadow() });
  s.addText("6 YEARS AFTER ENROLLMENT", { x: PAD + 0.25, y: 3.95, w: W - PAD * 2 - 0.5, h: 0.26, fontSize: 8, fontFace: "Arial", charSpacing: 1.2, color: C.muted, align: "left", margin: 0 });
  s.addText(fmt.usd(school.earn6), { x: PAD + 0.25, y: 4.22, w: 3, h: 0.52, fontSize: 28, fontFace: "Arial", bold: true, color: C.text, align: "left", margin: 0 });

  if (school.earn6 && school.earn10) {
    const growth = Math.round(((school.earn10 - school.earn6) / school.earn6) * 100);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: W - PAD - 1.8, y: 4.16, w: 1.8, h: 0.52, fill: { color: C.surface2 }, rectRadius: 0.08 });
    s.addText(`+${growth}% growth`, { x: W - PAD - 1.8, y: 4.16, w: 1.8, h: 0.52, fontSize: 11, fontFace: "Arial", bold: true, color: C.accent, align: "center", valign: "middle", margin: 0 });
  }

  s.addText("Source: U.S. Dept. of Education College Scorecard, 2025–26", { x: PAD, y: 5.12, w: W - PAD * 2, h: 0.24, fontSize: 7.5, fontFace: "Arial", italic: true, color: C.dim, align: "left", margin: 0 });
  s.addText(`${school.shortName}  ·  4 / 8`, { x: PAD, y: 7.06, w: W - PAD * 2, h: 0.22, fontSize: 8, fontFace: "Arial", color: C.dim, align: "center", charSpacing: 1, margin: 0 });
}

// ── SLIDE 5: APPLICATION ──────────────────────────────────────────────────
function slide5(pres, school) {
  const s = pres.addSlide();
  addBackground(s); addLogo(s);

  s.addText("APPLICATION", { x: PAD, y: 0.72, w: W - PAD * 2, h: 0.4, fontSize: 10, fontFace: "Arial", charSpacing: 3, color: C.muted, align: "left", margin: 0 });
  s.addText("Requirements & Cycles", { x: PAD, y: 1.08, w: W - PAD * 2, h: 0.55, fontSize: 26, fontFace: "Arial", bold: true, color: C.text, align: "left", margin: 0 });

  const app = school.app;
  if (app?.appTypes) {
    const types = app.appTypes.split("/").map(t => t.trim());
    let cx = PAD;
    types.forEach(t => {
      const chipW = Math.max(0.6, t.length * 0.12 + 0.4);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx, y: 1.82, w: chipW, h: 0.38, fill: { color: C.surface2 }, rectRadius: 0.06, line: { color: C.accent, width: 1 } });
      s.addText(t, { x: cx, y: 1.82, w: chipW, h: 0.38, fontSize: 11, fontFace: "Arial", bold: true, color: C.accent, align: "center", valign: "middle", margin: 0 });
      cx += chipW + 0.14;
    });
  }

  const reqs = [
    { label: "Counselor Rec",       val: app?.counselorRec || "—" },
    { label: "Teacher Recs (Req)",   val: app?.teacherReqRec != null ? String(app.teacherReqRec) : "—" },
    { label: "Teacher Recs (Opt)",   val: app?.teacherOptRec != null ? String(app.teacherOptRec) : "—" },
    { label: "Other Recs (Opt)",     val: app?.otherOptRec != null ? String(app.otherOptRec) : "—" },
    { label: "Supplemental Essays",  val: app?.supplements != null ? String(app.supplements) : "—" },
    { label: "Common App Essay",     val: "Required" },
  ];

  const cw = (W - PAD * 2 - 0.12) / 2;
  reqs.forEach((r, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const cx = PAD + col * (cw + 0.12), cy = 2.42 + row * 1.0;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx, y: cy, w: cw, h: 0.85, fill: { color: C.surface }, rectRadius: 0.08, shadow: makeShadow() });
    s.addText(r.val, { x: cx + 0.15, y: cy + 0.08, w: cw - 0.3, h: 0.4, fontSize: r.val.length > 8 ? 14 : 22, fontFace: "Arial", bold: true, color: C.text, align: "left", margin: 0 });
    s.addText(r.label, { x: cx + 0.15, y: cy + 0.5, w: cw - 0.3, h: 0.26, fontSize: 8.5, fontFace: "Arial", color: C.muted, align: "left", charSpacing: 0.5, margin: 0 });
  });

  if (!app) {
    s.addText("application data not available for this school", { x: PAD, y: 2.8, w: W - PAD * 2, h: 0.4, fontSize: 13, fontFace: "Arial", italic: true, color: C.muted, align: "center", margin: 0 });
  }

  s.addText("Source: Common App, 2025–26", { x: PAD, y: 5.6, w: W - PAD * 2, h: 0.22, fontSize: 7.5, fontFace: "Arial", italic: true, color: C.dim, align: "left", margin: 0 });
  s.addText(`${school.shortName}  ·  5 / 8`, { x: PAD, y: 7.06, w: W - PAD * 2, h: 0.22, fontSize: 8, fontFace: "Arial", color: C.dim, align: "center", charSpacing: 1, margin: 0 });
}

// ── SLIDE 6: DEMOGRAPHICS ─────────────────────────────────────────────────
function slide6(pres, school) {
  const s = pres.addSlide();
  addBackground(s); addLogo(s);

  s.addText("DEMOGRAPHICS", { x: PAD, y: 0.72, w: W - PAD * 2, h: 0.4, fontSize: 10, fontFace: "Arial", charSpacing: 3, color: C.muted, align: "left", margin: 0 });
  s.addText("Student Body", { x: PAD, y: 1.08, w: W - PAD * 2, h: 0.55, fontSize: 26, fontFace: "Arial", bold: true, color: C.text, align: "left", margin: 0 });

  // Gender card
  const gBarX = PAD + 0.2, gBarW = W - PAD * 2 - 0.4;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: PAD, y: 1.82, w: W - PAD * 2, h: 1.1, fill: { color: C.surface }, rectRadius: 0.1, shadow: makeShadow() });
  s.addText(`Women  ${fmt.pct(school.women)}`, { x: gBarX, y: 1.9, w: 2.5, h: 0.3, fontSize: 12, fontFace: "Arial", bold: true, color: C.accent, align: "left", margin: 0 });
  s.addText(`Men  ${fmt.pct(school.men)}`, { x: W - PAD - 2.2, y: 1.9, w: 2.2, h: 0.3, fontSize: 12, fontFace: "Arial", bold: true, color: C.muted, align: "right", margin: 0 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: gBarX, y: 2.3, w: gBarW, h: 0.22, fill: { color: C.surface2 }, rectRadius: 0.06 });
  if (school.women) s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: gBarX, y: 2.3, w: gBarW * school.women, h: 0.22, fill: { color: C.accent }, rectRadius: 0.06 });

  // Race bars
  const races = [
    { name: "Asian",       val: school.asian },
    { name: "White",       val: school.white },
    { name: "Hispanic",    val: school.hisp },
    { name: "Black",       val: school.black },
    { name: "Two or More", val: school.two },
  ].filter(r => r.val != null && r.val > 0).sort((a, b) => b.val - a.val);

  s.addText("RACE & ETHNICITY", { x: PAD, y: 3.1, w: W - PAD * 2, h: 0.28, fontSize: 8, fontFace: "Arial", charSpacing: 1.5, color: C.muted, align: "left", margin: 0 });

  const maxRace = Math.max(...races.map(r => r.val), 0.001);
  const rBarW = W - PAD * 2 - 2.2;

  races.forEach((r, i) => {
    const y = 3.44 + i * 0.62;
    s.addText(r.name, { x: PAD, y, w: 1.5, h: 0.3, fontSize: 10, fontFace: "Arial", color: C.dim, align: "left", margin: 0 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: PAD + 1.6, y: y + 0.06, w: rBarW, h: 0.18, fill: { color: C.surface2 }, rectRadius: 0.04 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: PAD + 1.6, y: y + 0.06, w: Math.max(0.05, rBarW * (r.val / maxRace)), h: 0.18, fill: { color: C.border }, rectRadius: 0.04 });
    s.addText(fmt.pct(r.val), { x: PAD + 1.6 + rBarW + 0.08, y, w: 0.5, h: 0.3, fontSize: 10, fontFace: "Arial", bold: true, color: C.text, align: "left", margin: 0 });
  });

  s.addText(`${school.shortName}  ·  6 / 8`, { x: PAD, y: 7.06, w: W - PAD * 2, h: 0.22, fontSize: 8, fontFace: "Arial", color: C.dim, align: "center", charSpacing: 1, margin: 0 });
}

// ── SLIDE 7: PROGRAMS ─────────────────────────────────────────────────────
function slide7(pres, school) {
  const s = pres.addSlide();
  addBackground(s); addLogo(s);

  s.addText("TOP PROGRAMS", { x: PAD, y: 0.72, w: W - PAD * 2, h: 0.4, fontSize: 10, fontFace: "Arial", charSpacing: 3, color: C.muted, align: "left", margin: 0 });
  s.addText("Fields of Study", { x: PAD, y: 1.08, w: W - PAD * 2, h: 0.55, fontSize: 26, fontFace: "Arial", bold: true, color: C.text, align: "left", margin: 0 });

  const programs = school.programs.length > 0 ? school.programs : [{ name: "Data not available", pct: 0 }];
  const maxProg = Math.max(...programs.map(p => p.pct), 0.001);
  const pBarW = W - PAD * 2 - 3.1;

  programs.forEach((p, i) => {
    const y = 1.85 + i * 0.72;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: PAD, y, w: W - PAD * 2, h: 0.6, fill: { color: C.surface }, rectRadius: 0.08, shadow: makeShadow() });
    s.addText(p.name, { x: PAD + 0.18, y: y + 0.14, w: 2.0, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.text, align: "left", margin: 0 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: PAD + 2.3, y: y + 0.21, w: pBarW, h: 0.18, fill: { color: C.surface2 }, rectRadius: 0.04 });
    if (p.pct > 0) s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: PAD + 2.3, y: y + 0.21, w: Math.max(0.05, pBarW * (p.pct / maxProg)), h: 0.18, fill: { color: i === 0 ? C.accent : C.border }, rectRadius: 0.04 });
    s.addText(`${p.pct.toFixed(1)}%`, { x: PAD + 2.3 + pBarW + 0.1, y: y + 0.14, w: 0.6, h: 0.3, fontSize: 11, fontFace: "Arial", bold: true, color: C.text, align: "left", margin: 0 });
  });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: PAD, y: 5.68, w: W - PAD * 2, h: 1.1, fill: { color: C.surface2 }, rectRadius: 0.1, shadow: makeShadow(), line: { color: C.accent, width: 0.5 } });
  s.addText("explore full profile →", { x: PAD, y: 5.72, w: W - PAD * 2, h: 0.42, fontSize: 14, fontFace: "Arial", bold: true, color: C.accent, align: "center", margin: 0 });
  s.addText("collegevisualizer.com", { x: PAD, y: 6.14, w: W - PAD * 2, h: 0.3, fontSize: 10, fontFace: "Arial", color: C.muted, align: "center", charSpacing: 1, margin: 0 });

  s.addText(`${school.shortName}  ·  7 / 8`, { x: PAD, y: 7.06, w: W - PAD * 2, h: 0.22, fontSize: 8, fontFace: "Arial", color: C.dim, align: "center", charSpacing: 1, margin: 0 });
}

// ── SLIDE 8: AD ───────────────────────────────────────────────────────────
function slide8(pres) {
  const s = pres.addSlide();
  addBackground(s); addLogo(s);

  s.addText("explore", { x: PAD, y: 1.1, w: W - PAD * 2, h: 0.7, fontSize: 48, fontFace: "Arial", bold: true, color: C.text, align: "center", margin: 0 });
  s.addText("1,400+", { x: PAD, y: 1.78, w: W - PAD * 2, h: 1.1, fontSize: 82, fontFace: "Arial", bold: true, color: C.accent, align: "center", margin: 0 });
  s.addText("college profiles", { x: PAD, y: 2.85, w: W - PAD * 2, h: 0.65, fontSize: 38, fontFace: "Arial", bold: true, color: C.text, align: "center", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: W / 2 - 1.2, y: 3.66, w: 2.4, h: 0.025, fill: { color: C.border }, line: { color: C.border, width: 0 } });

  const features = ["admissions", "costs", "earnings", "demographics", "application info"];
  let fy = 3.9, fx = PAD;
  features.forEach(f => {
    const fw = f.length * 0.115 + 0.38;
    if (fx + fw > W - PAD) { fx = PAD; fy += 0.46; }
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: fx, y: fy, w: fw, h: 0.34, fill: { color: C.surface2 }, rectRadius: 0.06 });
    s.addText(f, { x: fx, y: fy, w: fw, h: 0.34, fontSize: 10, fontFace: "Arial", color: C.muted, align: "center", valign: "middle", margin: 0 });
    fx += fw + 0.12;
  });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: PAD, y: 5.08, w: W - PAD * 2, h: 1.55, fill: { color: C.surface }, rectRadius: 0.12, shadow: makeShadow(), line: { color: C.accent, width: 0.8 } });
  s.addText("collegevisualizer.com", { x: PAD, y: 5.18, w: W - PAD * 2, h: 0.5, fontSize: 20, fontFace: "Arial", bold: true, color: C.accent, align: "center", margin: 0 });
  s.addText("free · no signup · link in bio", { x: PAD, y: 5.68, w: W - PAD * 2, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.muted, align: "center", charSpacing: 1.5, margin: 0 });
  s.addText("↑", { x: PAD, y: 5.98, w: W - PAD * 2, h: 0.36, fontSize: 18, fontFace: "Arial", color: C.dim, align: "center", margin: 0 });
}

// ── GENERATE ONE PPTX ─────────────────────────────────────────────────────
async function generateCarousel(school, outputPath) {
  const pres = new pptxgen();
  pres.defineLayout({ name: "SQUARE", width: 7.5, height: 7.5 });
  pres.layout = "SQUARE";
  pres.title = `${school.shortName} — College Visualizer`;
  pres.author = "College Visualizer";

  slide1(pres, school);
  slide2(pres, school);
  slide3(pres, school);
  slide4(pres, school);
  slide5(pres, school);
  slide6(pres, school);
  slide7(pres, school);
  slide8(pres);

  await pres.writeFile({ fileName: outputPath });
}

// ── SAFE FILENAME ─────────────────────────────────────────────────────────
function safeFilename(name) {
  return name
    .replace(/[^a-zA-Z0-9\s\-]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 60)
    .trim();
}

// ── MAIN ──────────────────────────────────────────────────────────────────
async function main() {
  // Load schools.json — looks in public/ folder relative to this script
  const jsonPath = path.join(__dirname, "public", "schools.json");
  if (!fs.existsSync(jsonPath)) {
    console.error("Error: public/schools.json not found.");
    console.error("Make sure this script is in your collegevisualizer project folder.");
    process.exit(1);
  }

  const rawSchools = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  // Output folder
  const outDir = path.join(__dirname, "carousels");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  // Optional: filter to only schools with decent data
  const schools = rawSchools.filter(s => {
    const dn = s.display_name || s.name || "";
    return dn.length > 0 && (s.adm != null || s.sat != null || s.earn10 != null);
  });

  console.log(`\nCollege Visualizer — Carousel Generator`);
  console.log(`========================================`);
  console.log(`Found ${schools.length} schools with data`);
  console.log(`Output folder: ${outDir}\n`);

  let success = 0, skipped = 0;
  const startTime = Date.now();

  for (let i = 0; i < schools.length; i++) {
    const raw = schools[i];
    const school = buildSchool(raw);
    const filename = safeFilename(school.name) + ".pptx";
    const outputPath = path.join(outDir, filename);

    // Skip if already generated (allows resuming)
    if (fs.existsSync(outputPath)) {
      process.stdout.write(`\r[${i + 1}/${schools.length}] skipping (exists): ${school.shortName}    `);
      skipped++;
      continue;
    }

    try {
      await generateCarousel(school, outputPath);
      success++;
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      const rate = (success / (Date.now() - startTime) * 1000).toFixed(1);
      process.stdout.write(`\r[${i + 1}/${schools.length}] ✓ ${school.name.substring(0, 45).padEnd(45)} ${elapsed}s elapsed    `);
    } catch (err) {
      console.error(`\n✗ Error generating ${school.name}: ${err.message}`);
      skipped++;
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n\n========================================`);
  console.log(`Done! Generated ${success} carousels in ${totalTime}s`);
  if (skipped > 0) console.log(`Skipped: ${skipped} (already existed or errored)`);
  console.log(`Files saved to: ${outDir}`);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
