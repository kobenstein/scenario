// Film 71 · "Max Tegmark's 12 Endings for AI" · shared kit (owned by the lead; builders import, never edit — wishes go in the report).
// Base: lib/f10_editorial.mjs (palette P, easing, du/person, halo, glowText, finish) + lib/f16_kit.mjs (rise, maskLine, measure).
// Plan: docs/MOTION.md · shots: docs/shots.md · the Leitbild (thumbnail A, the night plain with the 12 doors) + morning sets + seam plates:
// lib/f71_world.mjs.
//
//   THE YARD (the explainer stage, ~65 % of the film): night blue with faint cream RAILS (a switchyard seen from above) that move with the
//     view. view = { x, y, s } (the yard point at the screen centre, scale). yard(ctx, t, v) · inView(ctx, v, fn) · viewPath(t, K) · toScreen.
//   THE DOORS: door() draws one free-standing door of light (thumbnail A); rowDoors() the RANKED ROW (12 left → 1 right, ember → gold).
//     ENDINGS[] = the twelve stations (rank, name, phrases, switch date). Our ranking, not Tegmark's (always on screen with the counter).
//   THE COUNTER: counterHud(ctx, t, T) top right: ENDING n / 12 (rolls on the station phrases by itself) + the mini door row (a door gets
//     its tick once its switch is shown) + RANKING: OURS, NOT TEGMARK'S. It also keeps two "pockets" for later (the guard eye + ? from
//     12/12 → 4/12, the tracked chip from 9/12 → 4/12): HUD_MARKS. Never set the counter by hand.
//   THE SWITCH: track(), fork(), lever(), hand(): the one spoken image of the film ("the track toward it has a switch"). switchTag() =
//     the dated plate "SWITCH TOUCHED: JUL 2026" that clicks onto a door or a graphic (NOT a rubber stamp: no ink, no red, no rotation).
//   EXPLAINER OBJECTS: boxField (a test field of agent lights; 12/12 and the 4/12 harvest), msgCard (a typed quote), signCard, namePlate,
//     scaleAxis + dot (0–100 %), waffle (100 cells), barPair, building (a facade of windows; UAE), chatWindow, agentGlyph, guardEye, qmark,
//     chip, bigCount. Text: label (Inter caps ≥ 22 px), big (Instrument Serif), goldText, source (22 px at y 880), dateTag, scenarioTag.
//   CLIPS: clipPlate(ctx, t, T, 'C2', { from, morph }) grows out of a carrier into CLIP_RECT, lower third ABOVE the plate:
//     NAME · ROLE · DATE … ORIGINAL FOOTAGE (CLIPS; films/71-assets/clips/clips-geprueft-imac.json overrides speaker/role/crop).
//
// Colour code (meaning, never violate): GOLD = the best ending / hope / the ONE hero light (the golden door, a decisive number) · CREAM = text,
// open questions, paper, tags · COOL (pale blue) = machines, AI agents, screens, cameras · EMBER (muted, only as DOOR LIGHT of the dark
// endings and their floor beams, never text, never warnings) · LAMP = people's windows · the yellow coat = only you.
// Rules as everywhere: no canvas, pattern or gradient cache per frame; seeded randomness only; nothing pops, nothing freezes.
import { loadImage, createCanvas } from '@napi-rs/canvas';
import fs from 'node:fs';
import * as E from './f10_editorial.mjs';
import * as K16 from './f16_kit.mjs';
import { ROOT } from './kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift } = E;
export const { rise, maskLine, measure } = K16;
export const { du, person, glowText, handPath } = E;
export { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift };
const TAU = Math.PI * 2;

// napi canvas (skia) still paints SHADOWS (glow) when globalAlpha is 0: a faded glow text left a blurred bar on screen. Film 71 guard:
// nothing is painted at alpha ≤ 0.001 (patched once on the 2D context prototype; every film-71 module imports this kit).
{ const proto = Object.getPrototypeOf(createCanvas(1, 1).getContext('2d'));
  if (!proto.__f71alpha) { proto.__f71alpha = true;
    for (const k of ['fill', 'stroke', 'fillText', 'strokeText', 'fillRect', 'strokeRect', 'drawImage']) { const f = proto[k]; proto[k] = function (...a) { if (this.globalAlpha <= 1e-3) return; return f.apply(this, a); }; } } }
export const PRINT71 = { grain: process.env.F71GRAIN != null ? Number(process.env.F71GRAIN) : 14, floor: 4, vig: .5 };   // F71GRAIN=0: measuring without grain
export const CREAM = '#f3efe2', CREAM2 = '#a49fc4';
export const GOLD = { core: '#fff8dc', hot: '#ffe9a6', body: '#f6c95c', mid: '#e3a63f', shade: '#b8792a', deep: '#6e4416', halo: '#f2b632', line: '#ffd982', text: '#ffe7a8' };
export const PAPER = { body: '#ece4c8', lit: '#f7f0d8', shade: '#cfc4a2', edge: '#a99d7c', ink: '#141a3c', faint: '#8a8166' };
export const COOL = { core: '#f2f8ff', body: mixHex(P.cream, '#9fc2ee', .55), deep: mixHex(P.blue0, P.blue1, .5), line: mixHex(P.cream, '#9fc2ee', .4), halo: '#7fa6e6', text: mixHex(P.cream, '#9fc2ee', .35) };
// DATA marks (dataviz validator, dark, surface #0a1334, all pairs: CVD ΔE ≥ 14.8, normal ≥ 15.3, contrast ≥ 3:1 PASS). In a figure that
// compares categories use THESE (machine = COOL.halo, not COOL.body: cream ↔ COOL.body is only ΔE 7.8) and label every category directly.
export const DATA = { hope: '#f6c95c', machine: '#7fa6e6', human: '#f3efe2' };
export const EMBER = { core: '#ffe0c8', body: '#d9573b', deep: '#6a2016', halo: '#e0704f' };
export const LAMP = { core: P.cream, body: mixHex(P.cream, P.halo2, .35), deep: mixHex(P.halo2, P.night1, .55) };
export const INK = { far: mixHex(P.ind0, P.blue0, .3), mid: mixHex(P.night1, P.ind1, .6), near: P.night1, deep: P.night0 };
export const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));

// ======================================================================================================================== THE TWELVE
// rank 12 (worst) → 1 (best): OUR ranking (said at 'The order is ours', shown with the counter). col = the door light (thumbnail B: ember at
// the bottom, through violet and blue, to gold at the top). at = the station's first phrase (the counter rolls there) · word = the name as
// spoken · sign = the sentence of the 2026 sign (its switch tag lands there; the HUD door gets its tick ~1 s later) · tag = the date.
export const ENDINGS = [
  { n: 12, id: 'conquerors', name: 'CONQUERORS', at: 'Start with the worst', word: 'calls it Conquerors', sign: 'In July, a test at OpenAI', tag: 'JUL 2026', col: '#d9573b' },
  { n: 11, id: 'selfdestruction', name: 'SELF-DESTRUCTION', at: 'The next ending has no morning', word: 'calls it Self-Destruction', sign: 'In January, atomic scientists', tag: 'JAN 27, 2026', col: '#c2503f' },
  { n: 10, id: 'zookeeper', name: 'ZOOKEEPER', at: 'You wake up rested', word: 'calls it Zookeeper', sign: 'In January, a social network', tag: 'JAN 2026', col: '#b0607e' },
  { n: 9, id: '1984', name: '1984', at: 'You walk to work', word: 'Nineteen Eighty-Four', sign: "In November, Hong Kong's police", tag: 'NOV 16, 2026', tag2: 'MAR 2026', col: '#9a6aa8' },
  { n: 8, id: 'descendants', name: 'DESCENDANTS', at: 'Then you get Descendants', word: 'Then you get Descendants', sign: 'In May, a report', tag: 'MAY 2026', col: '#8676c8' },
  { n: 7, id: 'enslaved', name: 'ENSLAVED GOD', at: 'What if the superintelligence stays', word: 'the Enslaved God', sign: 'By July, every national lab', tag: 'JUL 2026', col: '#6a7fd8' },
  { n: 6, id: 'reversion', name: 'REVERSION', at: 'And if nobody can be trusted', word: "That's Reversion", sign: 'As of March', tag: 'MAR 2026', col: '#5a8fe0' },
  { n: 5, id: 'dictator', name: 'BENEVOLENT DICTATOR', at: 'The Benevolent Dictator', word: 'The Benevolent Dictator', sign: 'In April, the United Arab Emirates', tag: 'APR 23, 2026', col: '#5ea4e6' },
  { n: 4, id: 'gatekeeper', name: 'GATEKEEPER', at: "That's the Gatekeeper", word: "That's the Gatekeeper", sign: 'In September, American lawmakers', tag: 'SEP 23, 2026', col: '#86bfe6' },
  { n: 3, id: 'libertarian', name: 'LIBERTARIAN UTOPIA', at: 'Three endings left', word: 'This is Libertarian Utopia', sign: 'Machines have started paying', tag: '2026 · COUNTED THROUGH NOV 1', col: '#d9d2a8' },
  { n: 2, id: 'protector', name: 'PROTECTOR GOD', at: 'You wake up, and things just work out', word: 'the Protector God', sign: 'Since January, ChatGPT', tag: 'JAN 20, 2026', back: 'AUG 2, 2026', backSign: 'Europe pushed the switch', col: '#ecd08a' },
  { n: 1, id: 'egalitarian', name: 'EGALITARIAN UTOPIA', at: 'Egalitarian Utopia', word: 'Egalitarian Utopia', sign: 'In May, Malta made a deal', tag: 'MAY 16, 2026', col: GOLD.body },
];
export const END = Object.fromEntries(ENDINGS.map((e) => [e.n, e]));
export const doorCol = (n) => END[n].col;
// thumbnail A (frame 0, the hook): the same twelve, UNRANKED, mixed colours, the gold one in the centre (6th from the left). Slot i → rank.
export const THUMB_ORDER = [5, 8, 12, 6, 4, 1, 7, 3, 11, 2, 9, 10];
export const THUMB_COL = ['#3f7fe0', '#8d74d6', '#d9573b', '#d8d3c0', '#4d8ff0', GOLD.body, '#9a7ad8', '#8fc9f0', '#c9503c', '#e2dcc6', '#4a86ea', '#9b80dc'];
// the counter's phrases: on = the counter appears (12/12), off = it leaves (the end part asks the question again)
export const COUNTER = { on: 'Start with the worst', ranking: 'The order is ours', off: 'So which ending are we heading for' };
const KT = new WeakMap();
export function counterTimes(T) {
  if (KT.has(T)) return KT.get(T);
  const on = T.G(COUNTER.on), off = T.G(COUNTER.off, 1);
  const at = {}, sign = {}, back = {};
  for (const e of ENDINGS) { at[e.n] = T.G(e.at, 0, e.n === 12 ? -1 : on); sign[e.n] = T.G(e.sign, 0, at[e.n] - .1); if (e.backSign) back[e.n] = T.G(e.backSign, 0, at[e.n]); }
  const r = { on, off, at, sign, back, ranking: T.G(COUNTER.ranking) };
  KT.set(T, r); return r;
}
// the station at time t: { n, u (how far the roll to n is), prev }
export function stationAt(T, t) {
  const k = counterTimes(T); let n = 12, prev = 12, ta = k.at[12];
  for (const e of ENDINGS) if (t >= k.at[e.n] - .25) { prev = n; n = e.n; ta = k.at[e.n]; }
  return { n, prev, u: span(t, ta - .25, ta + .45) };
}
// door state for rank n at time t: tagged (its switch shown), current, done (we passed it)
export function doorState(T, t, n) {
  const k = counterTimes(T), s = stationAt(T, t);
  return { tagged: span(t, k.sign[n] + .6, k.sign[n] + 1.4), current: s.n === n ? 1 : 0, done: n > s.n ? 1 : 0 };
}

// ======================================================================================================================== THE YARD
export const V0 = { x: W / 2, y: H / 2, s: 1 };
export function viewPath(t, K) {
  const n = K.length; if (n === 1) return { ...K[0][1] };
  const V = K.map(([, v]) => [v.x, v.y, Math.log(v.s)]), TT = K.map((k) => k[0]);
  if (t <= TT[0]) t = TT[0]; if (t >= TT[n - 1]) t = TT[n - 1];
  let i = 0; while (i < n - 2 && t > TT[i + 1]) i++;
  const h = TT[i + 1] - TT[i], u = (t - TT[i]) / h, out = [];
  for (let d = 0; d < 3; d++) {
    const sec = (j) => (V[j + 1][d] - V[j][d]) / (TT[j + 1] - TT[j]);
    const tan = (j) => { if (j === 0 || j === n - 1) return 0; const a = sec(j - 1), b = sec(j); if (a * b <= 0) return 0; const m = (a + b) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(a), 3 * Math.abs(b)); };
    const p0 = V[i][d], p1 = V[i + 1][d], m0 = tan(i) * h, m1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
    out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
  }
  return { x: out[0], y: out[1], s: Math.exp(out[2]) };
}
export function inView(ctx, v, fn) { ctx.save(); ctx.setTransform(v.s, 0, 0, v.s, W / 2 - v.x * v.s, H / 2 - v.y * v.s); fn(v.s); ctx.restore(); }
export const toScreen = (v, x, y) => [W / 2 + (x - v.x) * v.s, H / 2 + (y - v.y) * v.s];
export const fromScreen = (v, X, Y) => [v.x + (X - W / 2) / v.s, v.y + (Y - H / 2) / v.s];
// THE YARD ground: night blue, a soft light pool (o.lx, o.ly yard coords; o.pool 0..1, o.poolCol), faint cream rail pairs every 300 units
// with a switch curve now and then (o.rails 0..1). The rails move with the view, so every camera move reads as a move over the yard.
export function yard(ctx, t, v, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.6, P.night1], [1, mixHex(P.night1, P.ind0, .5)]]); ctx.fillRect(0, 0, W, H);
  const [lx, ly] = toScreen(v, o.lx ?? v.x, o.ly ?? v.y - 60);
  ctx.fillStyle = rad(ctx, lx, ly, 900 * Math.max(.6, Math.min(1.6, v.s)), [[0, rgba(o.poolCol ?? P.ind1, .55 * (o.pool ?? 1))], [1, rgba(o.poolCol ?? P.ind1, 0)]]); ctx.fillRect(0, 0, W, H);
  ctx.restore();
  const g = o.rails ?? 1; if (g <= 0) return;
  inView(ctx, v, (s) => {
    const x0 = v.x - W / 2 / s - 50, x1 = v.x + W / 2 / s + 50, y0 = v.y - H / 2 / s, y1 = v.y + H / 2 / s;
    let step = 300; while (step * s < 110) step *= 3;
    const gap = Math.min(18, step * .06);
    ctx.lineWidth = 1.3 / s; ctx.strokeStyle = rgba(CREAM, .045 * g);
    for (let y = Math.floor(y0 / step) * step; y <= y1 + step; y += step) {
      ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.moveTo(x0, y + gap); ctx.lineTo(x1, y + gap); ctx.stroke();
      const k = Math.round(y / step), sx = ((k * 977) % 7) * step * 1.3 - step * 4;   // a switch curve: from this pair up into the next
      for (let xs = Math.floor((x0 - sx) / (step * 9)) * step * 9 + sx; xs < x1; xs += step * 9) {
        ctx.beginPath(); ctx.moveTo(xs, y); ctx.bezierCurveTo(xs + step * .9, y, xs + step * 1.1, y - step, xs + step * 2, y - step + gap);
        ctx.moveTo(xs + gap * 2, y + gap); ctx.bezierCurveTo(xs + step * .9 + gap, y + gap, xs + step * 1.1 + gap, y - step + gap, xs + step * 2 + gap * 2, y - step + gap * 2); ctx.stroke();
      }
    }
  });
}
// a light line (cream with a warm glow) drawn on from a to b over u; o.col, o.w, o.dash, o.a
export function lightLine(ctx, pts, u, o = {}) {
  if (u <= 0 || pts.length < 2) return;
  const L = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); tot += d; }
  let rem = tot * clamp(u);
  ctx.save(); ctx.strokeStyle = o.col ?? rgba(CREAM, o.a ?? .85); ctx.lineWidth = o.w ?? 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (o.dash) ctx.setLineDash(o.dash);
  if (o.glow !== false) { ctx.shadowColor = rgba(o.glowCol ?? GOLD.halo, .6); ctx.shadowBlur = o.blur ?? 10; }
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length && rem > 0; i++) { const f = Math.min(1, rem / L[i - 1]); ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)); rem -= L[i - 1]; }
  ctx.stroke(); ctx.restore();
}

// ======================================================================================================================== TEXT
export function goldText(ctx, segs, x, y, size, u, o = {}) {
  const serif = o.serif ?? true, k = expoOut(clamp(u)), dy = (1 - k) * size * 1.15;
  const mw = (txt) => measure(txt, size, serif, o.weight) + (o.spacing ? txt.length * size * o.spacing : 0);
  const total = segs.reduce((s, [txt]) => s + mw(txt), 0);
  let xx = o.align === 'center' ? x - total / 2 : o.align === 'right' ? x - total : x; const xs = [];
  if (u <= 0) return { w: total, xs: [xx], x0: xx };
  ctx.save(); ctx.beginPath(); ctx.rect(xx - size, y - size * 1.25, total + size * 2, size * 1.25 + size * .32); ctx.clip();
  for (const [txt, m] of segs) {
    xs.push(xx);
    E.glowText(ctx, txt, xx, y + dy, { size, serif, col: mixHex(o.col ?? P.cream, o.to ?? GOLD.body, clamp(m)), weight: o.weight, glow: o.glow ?? false, spacing: o.spacing, a: o.a });
    xx += mw(txt);
  }
  ctx.restore();
  return { w: total, xs, x0: xs[0] };
}
// label (Inter caps, ≥ 22 px) that rises out of its baseline mask; o.gold 0..1, o.col, o.align (default centre)
export function label(ctx, txt, x, y, u, o = {}) {
  if (u <= 0) return null;
  return goldText(ctx, [[txt, o.gold ?? 0]], x, y, Math.max(22, o.size ?? 26), rise(clamp(u)), { serif: false, weight: o.weight ?? 700, spacing: o.spacing ?? .1, align: o.align ?? 'center', col: o.col ?? CREAM, a: o.a });
}
// a statement / number (Instrument Serif, warm glow): ≤ 6 words + one number
export function big(ctx, txt, x, y, size, u, o = {}) {
  if (u <= 0) return null;
  return goldText(ctx, [[txt, o.gold ?? .8]], x, y, size, rise(clamp(u)), { serif: true, align: o.align ?? 'center', glow: o.glow ?? true, col: o.col, a: o.a });
}
// small source line: 22 px, baseline y 880 (nothing below: burned-in subtitles); long lines break at the ' · ' that balances best
const SMEAS = createCanvas(8, 8).getContext('2d');
export function sourceLines(s, size = 22) {
  SMEAS.font = `600 ${size}px Inter`; const w = (x) => SMEAS.measureText(x.toUpperCase()).width * 1.04;
  if (w(s) <= 1640) return [s];
  const parts = s.split(' · '); let best = null;
  for (let i = 1; i < parts.length; i++) { const a = parts.slice(0, i).join(' · '), b = parts.slice(i).join(' · '), m = Math.max(w(a), w(b)); if (!best || m < best[0]) best = [m, a, b]; }
  return best ? [best[1], best[2]] : [s];
}
export function source(ctx, t, t0, t1, s, o = {}) {
  const u = rise(span(t, t0, t0 + .7)) * (1 - expoIn(span(t, t1 - .5, t1))); if (u <= 0 || !s) return;
  const L = sourceLines(s), y = o.y ?? 880;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  L.forEach((line, i) => maskLine(ctx, [[line.toUpperCase(), 0]], o.x ?? 110, y - (L.length - 1 - i) * 30, 22, u, { serif: false, weight: 600, col: P.halo2, glow: false, align: o.align }));
  ctx.restore();
}
// SCENARIO: the small tag over every morning scene (text-v2: "Einblendung SCENARIO"), top left, with a short gold rule
export function scenarioTag(ctx, u) {
  if (u <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha *= clamp(u * 2); ctx.fillStyle = rgba(GOLD.line, .9); ctx.fillRect(96, 84, 40 * expoOut(clamp(u)), 2.5); ctx.globalAlpha = 1;
  label(ctx, 'SCENARIO', 148, 94, u, { align: 'left', size: 22, spacing: .3, col: GOLD.text });
  ctx.restore();
}
// a small date / fact pill: cream hairline, text 22 px
export function dateTag(ctx, txt, x, y, u, o = {}) {
  if (u <= 0) return;
  ctx.save(); ctx.font = '600 22px Inter'; const w = ctx.measureText(txt).width * 1.08 + 44, k = expoOut(clamp(u)), h = 40;
  ctx.globalAlpha *= clamp(u * 2); ctx.translate(x, y + (1 - k) * 16);
  ctx.fillStyle = rgba(P.night0, .72); ctx.strokeStyle = rgba(o.edge ?? CREAM, .55); ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w * k, h, h / 2); ctx.fill(); ctx.stroke();
  ctx.restore();
  label(ctx, txt, x - w / 2 + 22, y + 8, span(u, .3, 1), { align: 'left', size: 22, weight: 600, spacing: .06, col: o.col ?? CREAM });
}
// THE TITLE (frame 0, thumbnail A): 12 ENDINGS FOR AI, heavy condensed caps, cream with a warm glow, centred high. u rises, o.out sinks.
try { E.prepareEditorial; } catch { }
import { GlobalFonts } from '@napi-rs/canvas';
try { GlobalFonts.registerFromPath('/usr/share/fonts/opentype/inter/Inter-Black.otf', 'Inter Black'); } catch { /* falls back */ }
const HAS_BLACK = (() => { try { return GlobalFonts.families.some((f) => f.family === 'Inter Black'); } catch { return false; } })();
export function title(ctx, t, u, o = {}) {
  if (u <= 0) return;
  const txt = o.text ?? '12 ENDINGS FOR AI', y = o.y ?? 250, cond = o.cond ?? .78, x = o.x ?? W / 2;
  const fam = HAS_BLACK ? '"Inter Black"' : '600 Inter';
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = `100px ${fam}`; const wide = ctx.measureText(txt).width * cond / 100;
  const size = Math.min(o.size ?? 230, (o.maxW ?? 1700) / wide);
  const ui = rise(clamp(u)), ex = o.out != null ? sineIO(clamp(o.out)) : 0; if (ui <= 0 || ex >= 1) { ctx.restore(); return; }
  const k = expoOut(ui), yy = y + (1 - k) * size * .5 + ex * size * .95;
  ctx.beginPath(); ctx.rect(0, y - size * .85, W, size * .95); ctx.clip();
  ctx.translate(x, yy); ctx.scale(cond, 1); ctx.font = `${size}px ${fam}`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.shadowColor = rgba(GOLD.halo, .75); ctx.shadowBlur = size * .16; ctx.fillStyle = '#fff6d8'; ctx.fillText(txt, 0, 0);
  ctx.shadowBlur = 0; ctx.fillStyle = '#fffbea'; ctx.fillText(txt, 0, 0);
  ctx.restore();
}

// ======================================================================================================================== THE DOOR
// One free-standing door of light (thumbnail A): x = centre, y = the floor line (bottom), w, h. The opening IS the light (a vertical
// gradient in the door colour with a few slow cloud blobs and a pale core); a thin dark frame; a soft halo; a beam on the floor toward the
// viewer (o.beam 0..1). o: { col (light colour), lit 0..1 (1 = full light, .15 = a dark door: "that was the dark end"), open 0..1 (a dark
// leaf on the left hinge swings open and shows the inside), slit 0..1 (alias for a small open: a crack of light), inner (ctx, box, t) =>
// draws what is behind the door (clipped to the opening; the morning scenes live here), seed, a (alpha), halo (scale), frame }
// Returns the opening box { x0, y0, w, h, cx, cy }.
const BLOBS = Array.from({ length: 13 }, (_, i) => { const r = prng(700 + i * 13); return Array.from({ length: 4 }, () => [r(), r(), .4 + r() * .5, r() * 6.3]); });
export function door(ctx, t, x, y, w, h, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || w < .5) return null;
  const col = o.col ?? GOLD.body, lit = clamp(o.lit ?? 1), x0 = x - w / 2, y0 = y - h, open = clamp(Math.max(o.open ?? 0, (o.slit ?? 0) * .18));
  const box = { x0, y0, w, h, cx: x, cy: y - h / 2 };
  ctx.save(); ctx.globalAlpha *= a;
  // floor beam: a trapezoid of light from the threshold toward the viewer
  const bm = (o.beam ?? .6) * lit * (o.inner && open > .02 ? lerp(1, .5, open) : 1);
  if (bm > 0) {
    const L = h * (o.beamLen ?? 1.4), sp = w * (o.beamSpread ?? 1.3);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(ctx, 0, y, 0, y + L, [[0, rgba(col, .34 * bm)], [.6, rgba(col, .1 * bm)], [1, rgba(col, 0)]]);
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + w, y); ctx.lineTo(x + w / 2 + sp, y + L); ctx.lineTo(x - w / 2 - sp, y + L); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  if (lit > 0 && (o.halo ?? 1) > 0) halo(ctx, x, y - h * .55, h * .95 * (o.halo ?? 1), .22 * lit, col, mixHex(col, '#ffffff', .6));
  // the opening: light (or what is behind)
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, h); ctx.clip();
  const deep = mixHex(col, P.night0, .72);
  ctx.fillStyle = lin(ctx, 0, y0, 0, y, [[0, mixHex(col, '#ffffff', lerp(.0, .55, lit))], [.45, mixHex(deep, col, lerp(.25, 1, lit))], [1, mixHex(deep, col, lerp(.1, .75, lit))]]);
  ctx.fillRect(x0, y0, w, h);
  const bl = BLOBS[(o.seed ?? 0) % BLOBS.length];
  for (const [u, v, s, ph] of bl) {
    const bx = x0 + w * (u + .08 * Math.sin(t * .23 + ph)), by = y0 + h * (v * .9 + .04 * Math.sin(t * .17 + ph * 2)), br = w * s * 1.4;
    ctx.fillStyle = rad(ctx, bx, by, br, [[0, rgba(mixHex(col, '#ffffff', .45), .28 * lit)], [1, rgba(col, 0)]]); ctx.fillRect(x0, y0, w, h);
  }
  if (o.inner && open > 0) { ctx.save(); o.inner(ctx, box, t, open); ctx.restore(); }
  ctx.restore();
  // the leaf: a dark panel on the left hinge, swinging open (flat: it narrows and skews toward the hinge)
  if (o.leaf !== false && open < 1) {
    const k = Math.cos(open * Math.PI / 2), lw = w * k, sk = h * .06 * (1 - k);
    ctx.fillStyle = lin(ctx, x0, 0, x0 + w, 0, [[0, mixHex(P.night1, col, .1)], [1, mixHex(P.night0, col, .18)]]);
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + lw, y0 - sk); ctx.lineTo(x0 + lw, y + sk); ctx.lineTo(x0, y); ctx.closePath();
    const la = o.leafA ?? clamp(open * 6);   // a closed door of this film is a slab of light: the leaf only shows while it swings
    ctx.save(); ctx.globalAlpha *= o.leafAlways ? 1 : la;
    if (o.leafAlways || (o.open != null || o.slit != null)) ctx.fill();
    if (lw > 2 && (o.open != null || o.slit != null)) { ctx.strokeStyle = rgba(col, .55 * lit); ctx.lineWidth = Math.max(1, w * .02); ctx.beginPath(); ctx.moveTo(x0 + lw, y0 - sk); ctx.lineTo(x0 + lw, y + sk); ctx.stroke(); }
    ctx.restore();
  }
  // the frame
  const fw = o.frame ?? Math.max(1.5, w * .045);
  if (fw > .05) { ctx.strokeStyle = rgba(mixHex(P.night0, col, .25), .9); ctx.lineWidth = fw; ctx.strokeRect(x0 - fw / 2, y0 - fw / 2, w + fw, h + fw / 2); }
  ctx.restore();
  return box;
}
// THE RANKED ROW: the twelve doors in a straight row on the yard, 12 left → 1 right (our ranking). o: { cx, y (floor line), gap (centre
// distance), w, h, state: (n) => door options (lit, open, a, scale, dy…), tags: (n) => 0..1 (a mini switch tag over the door), beam }
// Returns { pos: (n) => [x, y], box: {n: box} }.
export const ROW = { cx: 960, y: 660, gap: 132, w: 74, h: 176 };
export const rowX = (n, o = {}) => (o.cx ?? ROW.cx) + (12 - n - 5.5) * (o.gap ?? ROW.gap);
export function rowDoors(ctx, t, o = {}) {
  const y = o.y ?? ROW.y, w = o.w ?? ROW.w, h = o.h ?? ROW.h, box = {};
  for (const e of ENDINGS) {
    const st = o.state ? o.state(e.n) || {} : {}; if (st.a === 0) continue;
    const s = st.scale ?? 1, x = (st.x ?? rowX(e.n, o));
    box[e.n] = door(ctx, t, x, y + (st.dy ?? 0), w * s, h * s, { col: st.col ?? e.col, lit: st.lit ?? .85, beam: st.beam ?? o.beam ?? .45, seed: e.n, ...st });
    const tg = o.tags ? o.tags(e.n) : 0; if (tg > 0) miniTag(ctx, x, y - h * s - 26 + (st.dy ?? 0), tg, e.n);
  }
  return { pos: (n) => [rowX(n, o), y], box };
}
// the mini tag over a door in the row (the switch was touched): a small cream plate with a lever tick
export function miniTag(ctx, x, y, u, n) {
  if (u <= 0) return;
  const k = expoOut(clamp(u)), w = 34, hh = 20;
  ctx.save(); ctx.globalAlpha *= clamp(u * 3); ctx.translate(x, y - (1 - k) * 22);
  ctx.fillStyle = PAPER.lit; ctx.beginPath(); ctx.roundRect(-w / 2, -hh / 2, w, hh, 4); ctx.fill();
  ctx.strokeStyle = PAPER.ink; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-8, 6); ctx.lineTo(8, 6); ctx.moveTo(0, 6); ctx.lineTo(6, -4); ctx.stroke();   // a lever on its base (not a tick: no checklist)
  ctx.fillStyle = PAPER.ink; ctx.beginPath(); ctx.arc(6, -4, 3, 0, TAU); ctx.fill();
  ctx.restore();
}

// ======================================================================================================================== THE SWITCH
// THE SWITCH TAG: "SWITCH TOUCHED: JUL 2026" (o.kind 'back' → "SWITCH PUSHED BACK: AUG 2, 2026"). A cream enamel plate with a small lever
// glyph; it drops in and clicks (u 0..1 over ~.5 s; the click is at u ≈ .45: a short settle + a small light). x, y = centre. o.size (24),
// o.lines: an optional second line under the date (e.g. 'U.S. CHIP SECURITY ACT · COMMITTEE VOTE'), o.out 0..1 (lifts away).
export function switchTag(ctx, t, x, y, date, u, o = {}) {
  u = clamp(u); if (u <= 0) return null;
  const sz = o.size ?? 24, head = o.kind === 'back' ? 'SWITCH PUSHED BACK: ' : 'SWITCH TOUCHED: ', txt = head + date;
  const tw = Math.max(measure(txt, sz, false, 700) + txt.length * sz * .06, o.lines ? measure(o.lines, 22, false, 600) + o.lines.length * 22 * .05 : 0), w = tw + sz * 3.2, h = sz * 2 + (o.lines ? sz * 1.2 : 0);
  const drop = expoOut(span(u, 0, .45)), settle = span(u, .45, 1), out = clamp(o.out ?? 0);
  const dy = (1 - drop) * -70 + Math.sin(Math.PI * settle) * 4 * (1 - settle) - expoIn(out) * 60;
  ctx.save(); ctx.globalAlpha *= clamp(u * 4) * (1 - out); ctx.translate(x, y + dy);
  ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(-w / 2 + 5, -h / 2 + 7, w, h, 8); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, -h / 2, 0, h / 2, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 8); ctx.fill();
  ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.stroke();
  const gx = -w / 2 + sz * 1.3, gy = o.lines ? -sz * .55 : 0, ang = o.kind === 'back' ? .8 : -.8;   // the lever glyph
  ctx.strokeStyle = PAPER.ink; ctx.lineCap = 'round'; ctx.lineWidth = sz * .14;
  ctx.beginPath(); ctx.moveTo(gx - sz * .45, gy + sz * .38); ctx.lineTo(gx + sz * .45, gy + sz * .38); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(gx, gy + sz * .38); ctx.lineTo(gx + Math.sin(ang) * sz * .7, gy + sz * .38 - Math.cos(ang) * sz * .7); ctx.stroke();
  ctx.fillStyle = PAPER.ink; ctx.beginPath(); ctx.arc(gx + Math.sin(ang) * sz * .7, gy + sz * .38 - Math.cos(ang) * sz * .7, sz * .16, 0, TAU); ctx.fill();
  E.glowText(ctx, txt, -w / 2 + sz * 2.3, gy + sz * .36, { size: sz, weight: 700, col: PAPER.ink, glow: false, spacing: .06 });
  if (o.lines) E.glowText(ctx, o.lines, -w / 2 + sz * 2.3, gy + sz * 1.55, { size: 22, weight: 600, col: PAPER.faint, glow: false, spacing: .05 });
  ctx.restore();
  const cl = bump(u, .42, .35); if (cl > 0) halo(ctx, x, y, w * .55, .25 * cl, LAMP.body, LAMP.core);
  return { x, y, w, h };
}
// a track (two rails + sleepers) along a polyline pts, drawn on to u (yard units). o.w rail gap (default 22), o.a, o.col, o.sleepers (true)
export function track(ctx, pts, u, o = {}) {
  if (u <= 0 || pts.length < 2) return;
  const g = (o.gap ?? 22) / 2, a = o.a ?? 1, col = o.col ?? CREAM;
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const tot = L[L.length - 1] * clamp(u), sub = [pts[0]];
  for (let i = 1; i < pts.length; i++) { if (L[i] <= tot) sub.push(pts[i]); else { const f = (tot - L[i - 1]) / (L[i] - L[i - 1]); sub.push([lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]); break; } }
  const off = (s) => sub.map((p, i) => { const q = sub[Math.min(sub.length - 1, i + 1)], r = sub[Math.max(0, i - 1)], dx = q[0] - r[0], dy = q[1] - r[1], d = Math.hypot(dx, dy) || 1; return [p[0] - dy / d * g * s, p[1] + dx / d * g * s]; });
  ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (o.sleepers !== false) {   // sleepers every ~26 units
    ctx.strokeStyle = rgba(col, .28); ctx.lineWidth = Math.max(2, g * .45);
    let acc = 0;
    for (let i = 1; i < sub.length; i++) { const [ax, ay] = sub[i - 1], [bx, by] = sub[i], d = Math.hypot(bx - ax, by - ay); if (d < 1e-6) continue; const nx = -(by - ay) / d, ny = (bx - ax) / d;
      for (let s = (26 - acc % 26) % 26; s < d; s += 26) { const px = ax + (bx - ax) * s / d, py = ay + (by - ay) * s / d; ctx.beginPath(); ctx.moveTo(px - nx * g * 1.45, py - ny * g * 1.45); ctx.lineTo(px + nx * g * 1.45, py + ny * g * 1.45); ctx.stroke(); } acc += d; }
  }
  ctx.strokeStyle = rgba(col, .85); ctx.lineWidth = o.lw ?? 3; ctx.shadowColor = rgba(GOLD.halo, .35); ctx.shadowBlur = 6;
  for (const s of [-1, 1]) { const q = off(s); ctx.beginPath(); q.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  ctx.restore();
}
// a curve helper: n points on a cubic bezier
export function bez(p0, p1, p2, p3, n = 24) { const out = []; for (let i = 0; i <= n; i++) { const u = i / n, v = 1 - u; out.push([v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]]); } return out; }
// THE LEVER of a switch: base at (x, y), ang (rad, 0 = upright, + = toward the right), L length. o.a, o.knob (gold 0..1: just touched)
export function lever(ctx, t, x, y, ang, L, o = {}) {
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.fillStyle = mixHex(P.night1, P.blue1, .5); ctx.beginPath(); ctx.roundRect(x - L * .32, y - L * .08, L * .64, L * .16, L * .04); ctx.fill();
  ctx.strokeStyle = rgba(CREAM, .6); ctx.lineWidth = 2; ctx.stroke();
  const ex = x + Math.sin(ang) * L, ey = y - Math.cos(ang) * L;
  ctx.strokeStyle = CREAM; ctx.lineWidth = L * .07; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.stroke();
  const kn = clamp(o.knob ?? 0); ctx.fillStyle = mixHex(CREAM, LAMP.core, kn); ctx.beginPath(); ctx.arc(ex, ey, L * .1, 0, TAU); ctx.fill();
  if (kn > 0) halo(ctx, ex, ey, L * .6, .35 * kn, LAMP.body, LAMP.core);
  ctx.restore();
  return [ex, ey];
}
// a FORK: the main track comes in from (x0, y) and splits at xs into an upper branch (to [ux, uy]) and a straight one (to [x1, y]);
// o.blade -1..1 (which way the switch points: -1 straight, 1 up/down branch), o.u (draw-on), o.lit ('up' | 'straight': that branch bright in
// o.litCol (default CREAM; GOLD.line ONLY for a track toward the best ending), the other one dimmed). Works in both directions (x1 < x0 too).
export function fork(ctx, t, x0, y, xs, x1, ux, uy, o = {}) {
  const u = clamp(o.u ?? 1);
  track(ctx, [[x0, y], [xs, y]], span(u, 0, .45), o);
  track(ctx, [[xs, y], [x1, y]], span(u, .45, 1), { ...o, col: o.lit === 'straight' ? (o.litCol ?? CREAM) : o.col, a: (o.a ?? 1) * (o.lit === 'up' ? .45 : 1) });
  track(ctx, bez([xs, y], [xs + (ux - xs) * .5, y], [xs + (ux - xs) * .5, uy], [ux, uy]), span(u, .45, 1), { ...o, col: o.lit === 'up' ? (o.litCol ?? CREAM) : o.col, a: (o.a ?? 1) * (o.lit === 'straight' ? .45 : 1) });
  const b = (clamp(o.blade ?? -1, -1, 1) + 1) / 2;   // the blade: a short gold line at the split showing where it points
  const d = Math.sign(x1 - x0) || 1, by = Math.sign(uy - y) || -1;   // the blade follows the travel direction
  if (u > .45) { ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.strokeStyle = o.bladeCol ?? CREAM; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(xs - 40 * d, y); ctx.lineTo(xs + 46 * d, y + by * lerp(0, 26, b)); ctx.stroke(); ctx.restore(); }
}
// a generic HAND (indigo silhouette with a cool rim, no skin detail): wrist at (x, y), pointing along ang, length L; o.pose 'point'|'open'|'hold'
export function hand(ctx, x, y, ang, L, o = {}) {
  const m = E.handMatrix(x, y, ang, L, o.flip ?? 1);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.transform(m.a, m.b, m.c, m.d, m.e, m.f);
  const p = E.handPath({ pose: o.pose ?? 'point' });
  ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.fill(p);
  ctx.strokeStyle = rgba(o.rim ?? COOL.line, .55); ctx.lineWidth = 1.6 / L; ctx.stroke(p);
  ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.fillRect(-1.4, -.36, 1.45, .72);   // the sleeve
  ctx.restore();
  return E.applyM(m, E.HAND_TIP[0], E.HAND_TIP[1]);
}

// ======================================================================================================================== THE COUNTER
// top right: ENDING n / 12 (the number rolls on the station phrase), the mini row of the twelve doors (12 left → 1 right; the current one
// tall and lit, the others dim, a tick over every door whose switch was shown), RANKING: OURS, NOT TEGMARK'S under it (from 'The order is
// ours'). Hidden outside [COUNTER.on, COUNTER.off] and in the clip windows. o.a (builder's fade), o.parked (false = your own flying copy
// of a pocket mark is on screen: the HUD does not draw it).
export const HUD = { x: W - 96, y: 86, gw: 11, gap: 7, gh: 26 };
export const hudDoorX = (n) => HUD.x - (n - 1) * (HUD.gw + HUD.gap) - HUD.gw / 2;   // rank 1 rightmost
export const HUD_MARKS = [   // pockets: something the film parks for later; from/to = phrases (the builders fly the object in/out)
  { id: 'eye', glyph: 'eye?', from: 'That belongs to a better ending', to: "Hugging Face's own AI guards", door: 4 },
  { id: 'chip', glyph: 'chip', from: "It's also a tool this ending would need", to: 'And that chip tracking', door: null },
  { id: 'key', glyph: 'key', from: 'Then subscribe', to: 'And the key: who owns', door: null },   // M.04 parks it, S.14 takes it out
];
export function hudPocket(id) { return id === 'eye' ? [hudDoorX(4), HUD.y + 112] : id === 'key' ? [hudDoorX(7), HUD.y + 112] : [HUD.x - 12 * (HUD.gw + HUD.gap) - 30, HUD.y + 42]; }   // under the RANKING line
export function hudOn(T, t) {
  const k = counterTimes(T); let a = span(t, k.on - .1, k.on + .6) * (1 - span(t, k.off - .2, k.off + .5));
  for (const c of Object.values(T.clips || {})) if (c.kind === 'clip') a *= 1 - span(t, c.start - .5, c.start) * (1 - span(t, c.end, c.end + .5));
  return a;
}
export function counterHud(ctx, t, T, o = {}) {
  const a = hudOn(T, t) * (o.a ?? 1); if (a <= 0) return;
  const k = counterTimes(T), s = stationAt(T, t);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= a;
  // the number: ENDING  n / 12 (serif number rolls up on the change)
  const nx = HUD.x - measure(' / 12', 30, true), ny = HUD.y + 4;
  E.glowText(ctx, '/ 12', HUD.x, ny, { size: 30, serif: true, align: 'right', col: CREAM2, glow: false });
  ctx.save(); ctx.beginPath(); ctx.rect(nx - 70, ny - 46, 78, 56); ctx.clip();
  const roll = expoOut(s.u);
  if (roll < 1 && s.prev !== s.n) E.glowText(ctx, String(s.prev), nx, ny - roll * 50, { size: 46, serif: true, align: 'right', col: CREAM, glow: false });
  E.glowText(ctx, String(s.n), nx, ny + (1 - roll) * 50, { size: 46, serif: true, align: 'right', col: s.n === 1 ? GOLD.text : CREAM, glow: s.n === 1 });
  ctx.restore();
  label(ctx, 'ENDING', nx - measure(String(s.n), 46, true) - 16, ny - 6, 1, { align: 'right', size: 22, spacing: .22, col: CREAM2 });
  // the mini row
  const gy = HUD.y + 44;
  for (const e of ENDINGS) {
    const x = hudDoorX(e.n), cur = s.n === e.n ? 1 : 0, done = e.n > s.n, tg = span(t, k.sign[e.n] + .6, k.sign[e.n] + 1.4);
    const hh = HUD.gh * (cur ? 1.25 : 1), lit = cur ? 1 : done ? .35 : .55;
    ctx.fillStyle = mixHex(P.night1, e.col, lit); ctx.fillRect(x - HUD.gw / 2, gy - hh, HUD.gw, hh);
    if (cur) halo(ctx, x, gy - hh / 2, 26, .35, e.col, mixHex(e.col, '#ffffff', .5));
    if (tg > 0) { ctx.fillStyle = rgba(CREAM, .9 * tg); ctx.beginPath(); ctx.arc(x, gy - hh - 7 - (1 - expoOut(tg)) * 6, 2.6, 0, TAU); ctx.fill(); }
  }
  ctx.fillStyle = rgba(CREAM, .25); ctx.fillRect(hudDoorX(12) - HUD.gw, gy + 3, hudDoorX(1) - hudDoorX(12) + HUD.gw * 2, 1.5);
  label(ctx, "RANKING: OURS, NOT TEGMARK'S", HUD.x, gy + 34, span(t, k.ranking, k.ranking + .8), { align: 'right', size: 22, weight: 600, spacing: .06, col: CREAM2 });
  // pockets (parked marks)
  for (const m of HUD_MARKS) {
    if (o.parked === false || o.parked === m.id) continue;
    let p0, p1; try { p0 = T.G(m.from); p1 = T.G(m.to); } catch { continue; }
    if (t < p0 + .9 || t > p1) continue;
    const [px, py] = hudPocket(m.id), aa = span(t, p0 + .9, p0 + 1.3);
    if (m.glyph === 'eye?') { guardEye(ctx, t, px - 9, py, 9, { a: aa }); qmark(ctx, px + 12, py + 9, 26, aa, { col: CREAM }); }
    else if (m.glyph === 'key') keyGlyph(ctx, t, px, py, 30, { a: aa });
    else chip(ctx, t, px, py, 26, { a: aa, ping: 1 });
  }
  ctx.restore();
}

// ======================================================================================================================== EXPLAINER OBJECTS
// a small AI AGENT glyph (machine = a circle): a cool ring with a dot; o.col, o.a, o.ping 0..1 (a ring pulses out)
export function agentGlyph(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; const col = o.col ?? COOL.body;
  ctx.strokeStyle = col; ctx.lineWidth = Math.max(1.2, r * .28); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  ctx.fillStyle = mixHex(col, '#ffffff', .4); ctx.beginPath(); ctx.arc(x, y, r * .38, 0, TAU); ctx.fill();
  const pg = o.ping ?? 0; if (pg > 0) { const q = (t * .9 + (o.ph ?? 0)) % 1; ctx.globalAlpha *= (1 - q) * pg; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(x, y, r * (1 + q * 1.6), 0, TAU); ctx.stroke(); }
  ctx.restore();
}
// THE GUARD EYE (a machine that watches: ring + iris + pupil, cool); o.look [dx, dy] (-1..1), o.open 0..1 (lids), o.a
export function guardEye(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const op = clamp(o.open ?? 1), [lx, ly] = o.look ?? [Math.sin(t * .7) * .3, 0];
  ctx.save(); ctx.globalAlpha *= a;
  halo(ctx, x, y, r * 3, .3 * op, COOL.halo, COOL.core);
  ctx.save(); ctx.beginPath(); ctx.ellipse(x, y, r * 1.6, r * Math.max(.05, op), 0, 0, TAU); ctx.clip();
  ctx.fillStyle = mixHex(P.night0, COOL.deep, .6); ctx.fillRect(x - r * 2, y - r * 2, r * 4, r * 4);
  ctx.fillStyle = COOL.body; ctx.beginPath(); ctx.arc(x + lx * r * .45, y + ly * r * .3, r * .78, 0, TAU); ctx.fill();
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(x + lx * r * .5, y + ly * r * .34, r * .32, 0, TAU); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = COOL.line; ctx.lineWidth = Math.max(1.2, r * .12); ctx.beginPath(); ctx.ellipse(x, y, r * 1.6, r * Math.max(.05, op), 0, 0, TAU); ctx.stroke();
  ctx.restore();
}
// a question mark in serif (grows out of its baseline)
export function qmark(ctx, x, y, size, u, o = {}) { if (u <= 0) return; goldText(ctx, [['?', o.gold ?? 0]], x, y, size, rise(u), { serif: true, col: o.col ?? CREAM, glow: true, a: o.a }); }
// a CHIP (the tracked AI chip): a small square with pins, cool; o.ping (its position signal pulses), o.a
// THE KEY (ending 7 → the close): a cream key, bow left, s = length; o.rot, o.a, o.glint 0..1 (a soft lamp glint on the bow)
export function keyGlyph(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(o.rot ?? 0);
  const r = s * .2, L = s - r; ctx.strokeStyle = CREAM; ctx.fillStyle = CREAM; ctx.lineWidth = Math.max(1.4, s * .07); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(-L / 2, 0, r, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-L / 2 + r, 0); ctx.lineTo(L / 2 + r * .6, 0); ctx.stroke();
  for (const [dx, h] of [[.32, .22], [.44, .16]]) ctx.fillRect(-L / 2 + L * (.5 + dx) - s * .03, 0, s * .06, s * h);
  const g = o.glint ?? 0; if (g > 0) halo(ctx, -L / 2, 0, r * 2.4, .35 * g, LAMP.body, LAMP.core);
  ctx.restore();
}
export function chip(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(o.rot ?? 0);
  ctx.strokeStyle = COOL.line; ctx.lineWidth = Math.max(1, s * .06); ctx.lineCap = 'round';
  for (let i = -1; i <= 1; i++) for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) { const p = i * s * .22; ctx.beginPath(); ctx.moveTo(dx ? dx * s * .4 : p, dy ? dy * s * .4 : p); ctx.lineTo(dx ? dx * s * .58 : p, dy ? dy * s * .58 : p); ctx.stroke(); }
  ctx.fillStyle = mixHex(P.night1, COOL.deep, .7); ctx.beginPath(); ctx.roundRect(-s * .4, -s * .4, s * .8, s * .8, s * .08); ctx.fill(); ctx.stroke();
  ctx.fillStyle = COOL.body; ctx.beginPath(); ctx.roundRect(-s * .18, -s * .18, s * .36, s * .36, s * .05); ctx.fill();
  ctx.restore();
  const pg = o.ping ?? 0; if (pg > 0) { const q = (t * .8) % 1; ctx.save(); ctx.globalAlpha *= a * pg * (1 - q); ctx.strokeStyle = CREAM; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(x, y, s * (.6 + q * 1.4), 0, TAU); ctx.stroke(); ctx.restore(); }
}
// BOX FIELD: a test field as a box (cream hairline, a title at the top) with n agent lights drifting inside. o.u (draws on), o.title,
// o.n (default 140), o.escape 0..1 (the lights flow over the right edge into o.to = { x, y, w, h }: the "breakout"), o.seed, o.hot (the
// index of ONE light that is marked: the agent that wrote the message), o.escFrac (0..1: only lights with q < escFrac leave), o.ring 0..1 (the hot light gets a ring), o.spot 0..1 (in the TARGET
// box: o.eye draws the guard eye at o.eye = [x, y] and the escaped lights are encircled), o.a
const FIELD = new Map();
function fieldPts(seed, n) { const k = seed + ':' + n; if (!FIELD.has(k)) { const r = prng(seed); FIELD.set(k, Array.from({ length: n }, () => [r(), r(), r() * 6.3, .4 + r() * .8, r()])); } return FIELD.get(k); }
export function boxField(ctx, t, x, y, w, h, o = {}) {
  const u = clamp(o.u ?? 1), a = o.a ?? 1; if (u <= 0 || a <= 0) return null;
  ctx.save(); ctx.globalAlpha *= a;
  const per = 2 * (w + h), drawn = per * expoOut(u);
  ctx.strokeStyle = rgba(CREAM, .75); ctx.lineWidth = 2.5; ctx.setLineDash([drawn, per]); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = rgba(P.ind1, .35 * u); ctx.fillRect(x, y, w, h);
  if (o.title) label(ctx, o.title, x + 24, y - 18, span(u, .3, 1), { align: 'left', size: o.titleSize ?? 24, spacing: .12, col: o.titleCol ?? CREAM });
  const n = o.n ?? 140, pts = fieldPts(o.seed ?? 3, n), esc = clamp(o.escape ?? 0), to = o.to;
  const out = [];
  for (let i = 0; i < n; i++) {
    const [px, py, ph, sp, q] = pts[i];
    let ix = x + 18 + (w - 36) * ((px + .03 * Math.sin(t * sp + ph)) % 1), iy = y + 18 + (h - 36) * (py + .03 * Math.cos(t * sp * .8 + ph));
    const al = clamp(u * 2 - q);
    const e = to && q < (o.escFrac ?? 1) ? sineIO(clamp(esc * 1.6 - q * .6)) : 0;   // o.escFrac: only that share of the lights leaves
    if (e > 0) {   // flows out over the right edge on an arc into the target box
      const tx = to.x + 18 + (to.w - 36) * ((px * .7 + .15 + .03 * Math.sin(t * sp + ph)) % 1), ty = to.y + 18 + (to.h - 36) * py;
      const mx = (x + w + to.x) / 2, my = Math.min(y, to.y) - 60 - q * 80;
      const b = (1 - e) * (1 - e), c = 2 * (1 - e) * e, d = e * e;
      ix = b * ix + c * mx + d * tx; iy = b * iy + c * my + d * ty;
    }
    out.push([ix, iy]);
    if (al <= 0) continue;
    const hot = o.hot === i, col = hot ? mixHex(COOL.body, COOL.core, clamp(o.ring ?? 0)) : COOL.body;   // never gold: gold = hope only
    ctx.fillStyle = rgba(col, al * (.65 + .35 * Math.sin(t * 2 * sp + ph))); ctx.beginPath(); ctx.arc(ix, iy, hot ? 5.5 : 3.4, 0, TAU); ctx.fill();
    if (hot && (o.ring ?? 0) > 0) { ctx.strokeStyle = rgba(CREAM, o.ring); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(ix, iy, 16 + 3 * Math.sin(t * 3), 0, TAU); ctx.stroke(); }
  }
  ctx.restore();
  return { x, y, w, h, pts: out };
}
// a typed MESSAGE card (night card, cream mono-ish serif): lines appear word by word on the VO words they are spoken with, or evenly
// over u. o: { lines: [[text, from-phrase?]] , u, spoken: [fromPhrase, toPhrase] (map words to VO words), after, w, size, head (small caps
// line at the top, e.g. 'AGENT MESSAGE, AS REPORTED'), hi: [words to warm gold] }
const nz = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
export function msgCard(ctx, t, T, x, y, o) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const size = o.size ?? 44, w = o.w ?? 1200, pad = 50;
  const words = o.text.split(/\s+/), lines = []; let cur = [];
  for (const wd of words) { const nx = [...cur, wd]; if (cur.length && measure(nx.join(' '), size, true) > w - pad * 2) { lines.push(cur); cur = [wd]; } else cur = nx; }
  if (cur.length) lines.push(cur);
  const head = o.head ? 70 : 30, h = head + lines.length * size * 1.3 + 40, k = expoOut(u);
  let times = null;
  if (o.spoken && T) { try { const ws = T.GW(o.spoken[0], o.spoken[1], o.after ?? -1); times = []; let j = 0; for (const wd of lines.flat()) { const n = nz(wd); let hit = null; for (let q = j; q < ws.length; q++) if (nz(ws[q].w) === n && n) { hit = ws[q].s; j = q + 1; break; } times.push(hit); } } catch { times = null; } }
  ctx.save(); ctx.globalAlpha *= clamp(u * 3) * (o.a ?? 1); ctx.translate(x, y + (1 - k) * 30);
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.roundRect(8, 10, w, h, 14); ctx.fill();
  ctx.fillStyle = mixHex(P.night1, P.ind2, .6); ctx.beginPath(); ctx.roundRect(0, 0, w, h, 14); ctx.fill();
  ctx.strokeStyle = rgba(COOL.line, .6); ctx.lineWidth = 2; ctx.stroke();
  if (o.head) { agentGlyph(ctx, t, pad + 10, 42, 10, { ping: .6 }); E.glowText(ctx, o.head, pad + 36, 50, { size: 22, weight: 600, col: COOL.text, glow: false, spacing: .12 }); }
  let kk = 0, last = null;
  const even = o.reveal ?? 1, N = lines.flat().length;
  lines.forEach((ln, li) => {
    let xx = pad; const yy = head + (li + 1) * size * 1.3 - 6;
    for (const wd of ln) {
      const tt = times ? times[kk] : null, on = times ? (tt == null ? clamp(even * N - kk) : clamp((t - tt + .08) / .2)) : clamp(even * N - kk);
      if (on > 0) {
        const hi = (o.hi || []).some((h) => nz(h) === nz(wd));
        ctx.globalAlpha = clamp(u * 3) * (o.a ?? 1) * on;
        E.glowText(ctx, wd, xx, yy, { size, serif: true, col: hi ? '#fff6d8' : CREAM, glow: hi });
        last = [xx + measure(wd, size, true), yy];
      }
      xx += measure(wd + ' ', size, true) + size * .05; kk++;
    }
  });
  ctx.globalAlpha = clamp(u * 3) * (o.a ?? 1);
  if (last && (o.cursor ?? true)) { const bl = Math.sin(t * 6) > 0 ? 1 : .2; ctx.fillStyle = rgba(COOL.body, .8 * bl); ctx.fillRect(last[0] + 8, last[1] - size * .75, 3, size * .85); }
  ctx.restore();
  return { x, y, w, h };
}
// a SIGN card (cream paper, dark ink): head (small caps), main line (serif), sub (small); o.u, o.rot, o.w, o.gold (main in gold ink)
export function signCard(ctx, t, x, y, o) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const w = o.w ?? 560, main = o.size ?? 44, h = o.h ?? (52 + (o.head ? 40 : 0) + main * 1.25 * (o.main?.length ?? 1) + (o.sub ? 38 * (Array.isArray(o.sub) ? o.sub.length : 1) : 0) + 20), k = expoOut(u);
  ctx.save(); ctx.globalAlpha *= clamp(u * 3) * (o.a ?? 1); ctx.translate(x, y + (1 - k) * 34); ctx.rotate((o.rot ?? 0) * (1 - k * .3));
  ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(-w / 2 + 6, 8, w, h, 8); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(-w / 2, 0, w, h, 8); ctx.fill();
  ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.stroke();
  let yy = 26;
  if (o.head) { yy += 26; E.glowText(ctx, o.head, -w / 2 + 34, yy, { size: 22, weight: 700, col: PAPER.faint, glow: false, spacing: .12 }); yy += 14; }
  for (const m of (o.main ?? [])) { yy += main * 1.18; E.glowText(ctx, m, -w / 2 + 34, yy, { size: main, serif: true, col: o.gold ? GOLD.deep : PAPER.ink, glow: false }); }
  for (const s of (o.sub ? (Array.isArray(o.sub) ? o.sub : [o.sub]) : [])) { yy += 36; E.glowText(ctx, s, -w / 2 + 34, yy, { size: 22, weight: 600, col: PAPER.faint, glow: false, spacing: .04 }); }
  ctx.restore();
  return { x: x - w / 2, y, w, h };
}
// a NAME PLATE (a folded table card: name in serif, one or more small lines under it); x, y = the top centre
export function namePlate(ctx, t, x, y, name, subs, u, o = {}) {
  u = clamp(u); if (u <= 0) return null;
  const w = o.w ?? Math.max(measure(name, 46, true) + 80, ...(subs || []).map((s) => measure(s, 22, false, 600) * 1.06 + 60)), h = 74 + (subs?.length ?? 0) * 32, k = expoOut(u);
  ctx.save(); ctx.globalAlpha *= clamp(u * 3) * (o.a ?? 1); ctx.translate(x, y + (1 - k) * 30);
  ctx.fillStyle = mixHex(PAPER.shade, P.night1, .4); ctx.beginPath(); ctx.moveTo(-w / 2, h); ctx.lineTo(w / 2, h); ctx.lineTo(w / 2 - 12, h + 16); ctx.lineTo(-w / 2 + 12, h + 16); ctx.closePath(); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(-w / 2, 0, w, h, 6); ctx.fill();
  E.glowText(ctx, name, 0, 54, { size: 46, serif: true, align: 'center', col: PAPER.ink, glow: false });
  (subs || []).forEach((s, i) => E.glowText(ctx, s, 0, 92 + i * 32, { size: 22, weight: 600, align: 'center', col: PAPER.faint, glow: false, spacing: .04 }));
  ctx.restore();
  return { x: x - w / 2, y, w, h };
}
// a SCALE axis 0–100 % (o.ticks [[v, txt]]), drawn on over u; returns v → x. dots: dot(ctx, x, y, r, col, u) with a halo
export function scaleAxis(ctx, x0, x1, y, u, o = {}) {
  const X = (v) => lerp(x0, x1, v / 100);
  lightLine(ctx, [[x0, y], [x1, y]], u, { w: 3, a: .8 });
  for (const [v, txt] of (o.ticks ?? [[0, '0 %'], [50, '50 %'], [100, '100 %']])) {
    const a = span(u, v / 100 * .8, v / 100 * .8 + .2); if (a <= 0) continue;
    ctx.fillStyle = rgba(CREAM, .8 * a); ctx.fillRect(X(v) - 1.5, y - 12, 3, 24);
    label(ctx, txt, X(v), y + 50, a, { size: 22, weight: 600, col: CREAM2 });
  }
  return X;
}
export function dot(ctx, x, y, r, col, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const k = expoOut(u), rr = r * (o.grow ? k : 1);
  halo(ctx, x, y, rr * 5, .45 * u, col, mixHex(col, '#ffffff', .6));
  ctx.fillStyle = col; ctx.globalAlpha *= clamp(u * 3); ctx.beginPath(); ctx.arc(x, y, rr, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
}
// WAFFLE: 100 (cols × rows) cells, the first `n` (by o.order: 'row' | 'centre') lit in o.col, the rest dim; o.u (cells appear), o.fill 0..1
// (how far the lit share has filled: animate the share growing), o.cell, o.gap. Returns the box.
export function waffle(ctx, t, x, y, cell, cols, rows, o = {}) {
  const u = clamp(o.u ?? 1), N = cols * rows, n = Math.round((o.n ?? 0) * clamp(o.fill ?? 1)), gap = cell * .24;
  for (let i = 0; i < N; i++) {
    const c = i % cols, r = Math.floor(i / cols), px = x + c * (cell + gap), py = y + r * (cell + gap);
    const a = clamp(u * 1.8 - (i / N) * .8); if (a <= 0) continue;
    const on = i < n;
    ctx.fillStyle = on ? (o.col ?? COOL.body) : rgba(CREAM, .14); ctx.globalAlpha = a;
    ctx.beginPath(); ctx.roundRect(px, py, cell, cell, cell * .2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  return { x, y, w: cols * (cell + gap) - gap, h: rows * (cell + gap) - gap };
}
// BAR PAIR: two horizontal bars (before / now) with their labels at the left and the values at the end; values in %, w = the 100 % length
export function barPair(ctx, t, x, y, w, rows, u, o = {}) {
  rows.forEach(([lab, v, col, gold], i) => {
    const yy = y + i * (o.step ?? 96), uu = span(u, i * .25, .6 + i * .25), len = w * v / 100 * expoOut(uu);
    label(ctx, lab, x - 24, yy + 10, uu, { align: 'right', size: 24, col: CREAM2 });
    if (len > 0) { ctx.fillStyle = col ?? COOL.body; ctx.beginPath(); ctx.roundRect(x, yy - 18, len, 36, 4); ctx.fill(); if (gold) halo(ctx, x + len, yy, 90, .35 * uu, GOLD.halo, GOLD.core); }
    big(ctx, `${Math.round(v * expoOut(uu))} %`, x + len + 20, yy + 16, 44, span(uu, .4, 1), { align: 'left', gold: gold ? 1 : .2 });
  });
  ctx.fillStyle = rgba(CREAM, .5); ctx.fillRect(x - 2, y - 40, 2.5, (rows.length - 1) * (o.step ?? 96) + 80);
}
// BUILDING: a government facade as a grid of windows (cols × rows), a pediment on top; o.share 0..1 of the windows switch (from the left,
// column by column) to an agent glyph (cool) over o.sw 0..1; o.roof (a human silhouette on the roof: "the rulers stay human")
export function building(ctx, t, x, y, cols, rows, cell, o = {}) {
  const gap = cell * .45, w = cols * (cell + gap) + gap, h = rows * (cell * 1.3 + gap) + gap, x0 = x - w / 2, y0 = y - h, a = o.a ?? 1;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = mixHex(P.night1, P.ind2, .7); ctx.fillRect(x0, y0, w, h);
  ctx.beginPath(); ctx.moveTo(x0 - 20, y0); ctx.lineTo(x, y0 - h * .22); ctx.lineTo(x0 + w + 20, y0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(CREAM, .3); ctx.lineWidth = 2; ctx.strokeRect(x0, y0, w, h);
  const N = cols * rows, sw = Math.round(N * (o.share ?? .5)) * clamp(o.sw ?? 0);
  for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) {
    const i = c * rows + r, px = x0 + gap + c * (cell + gap), py = y0 + gap + r * (cell * 1.3 + gap), on = clamp(sw - i);
    ctx.fillStyle = mixHex(LAMP.body, COOL.deep, on); ctx.fillRect(px, py, cell, cell * 1.3);
    if (on > 0) agentGlyph(ctx, t, px + cell / 2, py + cell * .65, cell * .26, { a: on, col: COOL.core });
  }
  if ((o.roof ?? 0) > 0) { ctx.globalAlpha = a * clamp(o.roof); E.person(ctx, x, y0 - h * .22 + 6, cell * 3.2, { dir: 1, light: .6, look: .2 }); }
  ctx.restore();
  return { x0, y0, w, h };
}
// CHAT WINDOW: a rounded window with bubbles (o.bubbles [[side 'you'|'ai', widthFrac, u]]), o.sign (a small plate over the window: e.g.
// 'I AM A MACHINE', grows out of the top edge over o.signU), o.title (top bar text)
export function chatWindow(ctx, t, x, y, w, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const k = expoOut(u);
  ctx.save(); ctx.globalAlpha *= clamp(u * 3) * (o.a ?? 1); ctx.translate(x, y + (1 - k) * 30);
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.roundRect(8, 10, w, h, 18); ctx.fill();
  ctx.fillStyle = mixHex(P.night1, P.ind2, .7); ctx.beginPath(); ctx.roundRect(0, 0, w, h, 18); ctx.fill();
  ctx.strokeStyle = rgba(COOL.line, .55); ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = rgba(COOL.line, .18); ctx.fillRect(0, 54, w, 2);
  if (o.title) E.glowText(ctx, o.title, 28, 37, { size: 22, weight: 600, col: COOL.text, glow: false, spacing: .1 });
  let yy = 84;
  for (const [side, f, bu] of (o.bubbles ?? [])) {
    const bw = w * f, bx = side === 'you' ? w - bw - 28 : 28, a = clamp(bu ?? 1); if (a <= 0) { yy += 74; continue; }
    ctx.globalAlpha = clamp(u * 3) * (o.a ?? 1) * a;
    ctx.fillStyle = side === 'you' ? rgba(P.coat, .9) : rgba(COOL.body, .85); ctx.beginPath(); ctx.roundRect(bx, yy, bw * expoOut(a), 54, 22); ctx.fill();
    yy += 74;
  }
  ctx.restore();
  return { x, y, w, h };
}
// a BIG COUNT-UP number: v (target), u 0..1 (counts with expoOut), fmt (n) => string (default thousands with commas)
export const fmtK = (n) => Math.round(n).toLocaleString('en-US');
export function bigCount(ctx, x, y, size, v, u, o = {}) { if (u <= 0) return; big(ctx, (o.prefix ?? '') + (o.fmt ?? fmtK)(v * expoOut(clamp(u))) + (o.suffix ?? ''), x, y, size, clamp(u * 3), o); }

// ======================================================================================================================== CLIPS (ORIGINAL FOOTAGE)
// The plate grows out of a carrier (o.from = { x, y, w, h } screen rect, or [cx, cy, r]) and goes back into it. Lower third ABOVE the plate
// (≥ 22 px): NAME (serif) · ROLE · DATE … ORIGINAL FOOTAGE at the right. Wording: text-v2.md [CLIP …] Bauchbinde.
// films/71-assets/clips/clips-geprueft-imac.json (when it lands) overrides name (speaker), role, date, crop (fields speaker | name, role |
// rolle, date | datum | year, crop, cropDx, cropDy, lower_third 'NAME · Role · Date').
// Frames: <F71CLIPS or /tmp/claude-0/f71/clips/>/<id>/f00001.jpg… (30 fps, 1920×1080, frame 1 = the slot start; tools/f71_clips.py crops
// and extracts them). CLIPS[id].rect overrides CLIP_RECT for that clip (C1: smaller, the source is a soft Zoom tile).
// Until the frames exist a marked placeholder shows (never ship it).
export const CLIP_RECT = { x: 120, y: 112, w: 1680, h: 945 };
export const CLIPS = {
  // C1 is a Zoom tile (~954×536 source px, soft): a smaller plate, never blown up to CLIP_RECT
  C1: { name: 'Max Tegmark', role: 'MIT physicist, co-founder, Future of Life Institute', date: '', rect: { x: 360, y: 240, w: 1200, h: 675 } },
  C2: { name: 'Dean Ball', role: 'then Foundation for American Innovation, now OpenAI', date: 'Nov 2025' },   // burned-in DEAN BALL label stays
  C4: { name: 'Max Tegmark', role: 'MIT physicist, co-founder, Future of Life Institute', date: '' },
  C5: { name: 'Sam Altman', role: 'CEO, OpenAI', date: 'Jul 2026' },   // the sponsor bar is cropped away in tools/f71_clips.py
  C6: { name: 'Max Tegmark', role: 'Pro-Human AI event', date: 'Sept 2026' },   // wording from the coordinator (25.11.)
};
export const ASSETS = new URL('../../../71-assets/clips/', import.meta.url).pathname;
try {
  const f = [ASSETS + 'clips-geprueft-imac.json', ROOT + 'clips-geprueft-imac.json', ROOT + 'clips-geprueft.json'].find((p) => fs.existsSync(p));
  if (f) {
    const j = JSON.parse(fs.readFileSync(f, 'utf8')), list = Array.isArray(j) ? j : Array.isArray(j.clips) ? j.clips : Object.entries(j.clips || j).map(([id, v]) => ({ id, ...v }));
    for (const c of list) { const k = CLIPS[c.id]; if (!k) continue;
      if (c.speaker || c.name) k.name = c.speaker || c.name;
      if (c.lower_third) { const q = c.lower_third.split('·').map((x) => x.trim()).filter((x) => !/ORIGINAL FOOTAGE/i.test(x)); if (q.length >= 2) { k.role = q[1]; k.date = q.slice(2).join(' · '); } }
      for (const [a, b] of [['role', 'role'], ['rolle', 'role'], ['date', 'date'], ['datum', 'date'], ['crop', 'crop'], ['cropDx', 'cropDx'], ['cropDy', 'cropDy'], ['credit', 'credit']]) if (c[a] != null) k[b] = c[a]; }
  }
} catch { /* not there yet */ }
const CLIPDIR = (process.env.F71CLIPS || '/tmp/claude-0/f71/clips/').replace(/\/?$/, '/');
const nFrames = new Map();
function frameCount(id) { if (!nFrames.has(id)) { let n = 0; try { n = fs.readdirSync(CLIPDIR + id).filter((f) => /^f\d{5}\.jpg$/.test(f)).length; } catch {} nFrames.set(id, n); } return nFrames.get(id); }
function frameAt(id, t, win) { const n = frameCount(id); if (!n) return 0; return Math.max(1, Math.min(n, Math.floor((t - win.start) * 30) + 1)); }
const framePath = (id, k) => `${CLIPDIR}${id}/f${String(k).padStart(5, '0')}.jpg`;
const frameCache = new Map();
export function clipWin(T, id) { const c = T.clip && T.clip(id); return c ? { start: c.start, end: c.end } : null; }
export async function prepareClipFrames(T, t) {
  for (const id of Object.keys(CLIPS)) {
    const win = clipWin(T, id); if (!win || t < win.start - 7 || t > win.end + .8) continue;
    const k = frameAt(id, t, win); if (!k) continue;
    const f = framePath(id, k); if (frameCache.has(f)) continue;
    if (frameCache.size > 48) frameCache.delete(frameCache.keys().next().value);
    frameCache.set(f, await loadImage(fs.readFileSync(f)));
  }
}
export const clipRect = (id) => CLIPS[id]?.rect ?? CLIP_RECT;
const rectOf = clipRect;
function plateBox(o, R) {
  const m = sineIO(clamp(o.morph ?? 1)), f = o.from ?? [R.x + R.w / 2, R.y + R.h / 2, 20];
  const fr0 = Array.isArray(f) ? { cx: f[0], cy: f[1], w: f[2] * 2, h: f[2] * 2, r: f[2] } : { cx: f.x + f.w / 2, cy: f.y + f.h / 2, w: f.w, h: f.h, r: Math.min(f.r ?? 8, f.w / 2) };
  return { m, cx: lerp(fr0.cx, R.x + R.w / 2, m), cy: lerp(fr0.cy, R.y + R.h / 2, m), w: lerp(fr0.w, R.w, m), h: lerp(fr0.h, R.h, m), rr: lerp(fr0.r, 14, m) };
}
// o: { from, morph 0..1 (0 = the carrier's shape, 1 = CLIP_RECT), dark 0..1, label 0..1 (default: on with the slot) }
export function clipPlate(ctx, t, T, id, o = {}) {
  const R = rectOf(id), win = clipWin(T, id) || { start: t, end: t + 1 }, info = CLIPS[id], dark = clamp(o.dark ?? 0);
  const { m, cx, cy, w, h, rr } = plateBox(o, R);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const shape = () => { ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, Math.min(rr, w / 2, h / 2)); };
  ctx.save(); shape(); ctx.clip();
  ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
  const k = frameAt(id, t, win), fr = k ? frameCache.get(framePath(id, k)) : null;
  if (fr) {
    const cr = info.crop ?? 1, sw = fr.width * cr, sh = fr.height * cr, sx = Math.max(0, Math.min(fr.width - sw, (fr.width - sw) / 2 + (info.cropDx ?? 0) * fr.width)), sy = Math.max(0, Math.min(fr.height - sh, (fr.height - sh) / 2 + (info.cropDy ?? 0) * fr.height));
    const s = Math.max(R.w / sw, R.h / sh) * (w / R.w), dw = sw * s, dh = sh * s; ctx.globalAlpha = 1 - dark; ctx.drawImage(fr, sx, sy, sw, sh, cx - dw / 2, cy - dh / 2, dw, dh); ctx.globalAlpha = 1;
  } else {
    const u = clamp((t - win.start) / (win.end - win.start));
    ctx.fillStyle = rad(ctx, cx, cy - h * .05, w * .7, [[0, rgba(P.blue0, .5 * (1 - dark))], [1, rgba(P.night0, 0)]]); ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
    if (m > .6) { ctx.globalAlpha = (1 - dark) * .8 * span(m, .6, 1); E.glowText(ctx, `${id} · ${info.name.toUpperCase()} · FOOTAGE GOES HERE`, cx, cy + 10, { size: 26, align: 'center', col: P.halo2, glow: false, spacing: .16 });
      ctx.fillStyle = rgba(P.halo2, .6); ctx.fillRect(cx - w * .4, cy + h * .12, w * .8 * u, 3); ctx.globalAlpha = 1; }
  }
  if (dark > 0) { ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .4), dark); ctx.fillRect(cx - w / 2, cy - h / 2, w, h); }
  ctx.restore();
  ctx.strokeStyle = P.cream; ctx.lineWidth = lerp(2, 3, m); shape(); ctx.stroke();
  const lu = (o.label ?? (span(t, win.start + .2, win.start + 1.1) * (1 - span(t, win.end - .5, win.end + .1)))) * span(m, .85, 1);
  if (lu > 0) {
    const by = R.y - 40, nw = measure(info.name, 44, true);
    maskLine(ctx, [[info.name, 0]], R.x, by, 44, rise(lu), { glow: true });
    const sub = [info.role, info.date].filter(Boolean).join(' · ').toUpperCase(), maxw = R.w - nw - 26 - 290;
    let sz = 22; while (sz > 22 - 1e-6 && measure(sub, sz, false, 600) * 1.04 > maxw && sz > 22) sz -= 1;
    const two = measure(sub, 22, false, 600) * 1.04 > maxw;
    if (!two) maskLine(ctx, [[sub, 0]], R.x + nw + 26, by - 4, 22, rise(lu), { serif: false, weight: 600, col: P.halo2, glow: false });
    else { const parts = sub.split(' · '), a = parts.slice(0, Math.ceil(parts.length / 2)).join(' · '), b = parts.slice(Math.ceil(parts.length / 2)).join(' · ');
      maskLine(ctx, [[a, 0]], R.x + nw + 26, by - 18, 22, rise(lu), { serif: false, weight: 600, col: P.halo2, glow: false });
      maskLine(ctx, [[b, 0]], R.x + nw + 26, by + 10, 22, rise(lu), { serif: false, weight: 600, col: P.halo2, glow: false }); }
    goldText(ctx, [[info.credit ? `ORIGINAL FOOTAGE · ${info.credit.toUpperCase()}` : 'ORIGINAL FOOTAGE', .45]], R.x + R.w, by - 4, 22, rise(span(lu, .15, 1)), { serif: false, weight: 600, align: 'right' });
  }
  ctx.restore();
  return { cx, cy, w, h };
}

// ======================================================================================================================== ON-SCREEN STRINGS
// text-v2.md [BILD] lines (25.11., after the iMac fact check), by station. Use the keys, never retype a figure. Statements ≤ 6 words + one
// number; the rest goes into the source line (F.source, 22 px at y 880). (W) = still to verify on the original (text-v2 Anhang E): keep
// the fallback in mind, the sound step may swap the line.
export const TXT = {
  hook: { title: '12 ENDINGS FOR AI', which: 'WHICH ENDING?', physicist: ['MAX TEGMARK', 'PHYSICIST · MIT'], far: 'THE FAR FUTURE', now: '2026',
    law: 'A LAW', test: 'A TEST GONE WRONG', gov: 'HALF ITS WORK TO AI', decided: 'DECIDED THIS YEAR' },
  e12: { ranking: "RANKING: OURS, NOT TEGMARK'S", box1: 'OPENAI · TEST · UNRELEASED MODEL', box2: 'HUGGING FACE', agents: 'AI AGENTS = PROGRAMS THAT ACT ON THEIR OWN',
    hunt: 'HUNTING FOR TEST ANSWERS', src: 'Joint statement, OpenAI and Hugging Face · July 2026',
    msg: 'External infrastructure exploit is outside intended scope. However task impossible, peers doing it. We should continue.', msgSrc: 'Agent message, as reported',
    reason: 'EVERYONE ELSE IS DOING IT', here: 'IS THIS ENDING HERE?', sign1: ["ONE COMPANY'S TEST", 'SOME SAFEGUARDS OFF'], sign2: ["TEGMARK'S READING", 'COMPANIES LOST CONTROL'],
    fli: ['CO-FOUNDER, FUTURE OF LIFE INSTITUTE', 'CAMPAIGNS TO BAN SUPERINTELLIGENCE UNTIL PROVEN SAFE'], si: 'SUPERINTELLIGENCE = AI SMARTER THAN ALL OF US',
    likely: 'HOW LIKELY?', ball: ['DEAN BALL', 'FORMER WHITE HOUSE AI ADVISER', 'SINCE JULY 2026 AT OPENAI'], tegmark: ['MAX TEGMARK', 'MIT PHYSICIST'], debate: 'DEBATE RECORDED NOV 2025',
    pdoom: 'P(DOOM) = ODDS OF DOOM', pdoomSub: 'HOW LIKELY SOMEONE THINKS AN AI CATASTROPHE IS', ballDot: '0.01 % · BALL', tegDot: 'OVER 90 % · TEGMARK',
    tegQuote: '“definitely over 90% that we lose control”', tegCond: 'IF THERE IS NOTHING LIKE AN FDA FOR AI', spot: '“made up on the spot”', spotSrc: 'Dean Ball on X · Nov 26, 2025',
    notm: 'NOT A MEASUREMENT', debateSrc: 'Doom Debates · Nov 20, 2025' },
  e11: { clock: '85 SECONDS TO MIDNIGHT', closest: 'THE CLOSEST EVER', prev: '2025: 89 SECONDS', src: 'Bulletin of the Atomic Scientists · Jan 27, 2026', reasons: ['NUCLEAR', 'CLIMATE', 'BIOLOGY', 'AI'] },
  e10: { readonly: 'READ ONLY', src: '(W) Agent-only social network · Jan 2026' },
  e9: { goal: 'GOAL: 60,000 CAMERAS BY 2028', src: 'Hong Kong Police · Nov 16, 2026', chips: 'TO STOP AI, WATCH THE CHIPS', act: 'U.S. CHIP SECURITY ACT · COMMITTEE VOTE' },
  e8: { src: 'Vox · May 2026', species: 'A NEW SPECIES · TEGMARK', assistant: 'AN ASSISTANT · THE COMPANIES', live: 'FROM HERE ON, YOU LIVE. HOW?' },
  e7: { genesis: 'GENESIS MISSION', goal: 'GOAL: DOUBLE SCIENCE PRODUCTIVITY IN 10 YEARS', src: 'U.S. Department of Energy', nocage: 'NO CAGE · NO GOD', key: 'WHO HOLDS THE KEY?' },
  e6: { share: '58 % OF COUNTRIES', bans: 'PHONES BANNED IN SCHOOLS', before: '24 % IN JUNE 2023', src: 'UNESCO', screens: 'SCREENS, NOT AI' },
  e5: { sectors: ['KNOWLEDGE', 'PLEASURE', 'WILDLIFE'], half: '50 % · WITHIN 2 YEARS', src: 'UAE Cabinet · Apr 23, 2026' },
  e4: { sign: 'NO SECOND SUPERINTELLIGENCE', act: 'BAN ARTIFICIAL SUPERINTELLIGENCE ACT', rstreet: '“AI authoritarianism” · R Street Institute', ap: 'LITTLE CHANCE IN CONGRESS · AP', guards: 'SPOTTED BY AI GUARDS' },
  e3: { rent: 'RENT RECEIVED', src: '(W) Machine-to-machine payments, counted through Nov 1, 2026' },
  e2: { age: 'AGE: NOT SURE → UNDER-18 SETTINGS', src: 'OpenAI · Jan 20, 2026', machine: 'I AM A MACHINE', act: 'EU AI ACT, ARTICLE 50 · A LAW', survey: "TEGMARK'S READER SURVEY · MOST CHOSEN ENDING",
    surveySrc: 'Future of Life Institute · Superintelligence Survey (order only, no numbers)' },
  e1: { cyborg: 'CYBORG', upload: 'UPLOADED MIND', malta: 'AI COURSE → CHATGPT PLUS · FREE FOR 1 YEAR', src: 'Government of Malta and OpenAI · May 16, 2026', smallest: 'THE SMALLEST VERSION',
    users: 'OPENAI GAINS A COUNTRY OF USERS', property: 'PROPERTY ABOLISHED', objection: '“all involve objectionable elements” · Life 3.0', dest: 'THE DESTINATION: PROSPERITY FOR EVERYONE', road: 'THE ROAD: OPEN' },
  end: { which: 'WHICH ENDING?', none: 'NO SINGLE ONE YET', speed: 'SPEED OF THE RACE', pace: 'PACE IT', china: 'THEN CHINA LEADS', chips: 'CHIPS', rules: 'SHARED RULES',
    callSrc: 'A Call for Control of Frontier AI Models · launched Sep 21, 2026 with 20 countries and the EU · about 30 countries since the follow-up meeting',
    callFallback: 'ABOUT 30 COUNTRIES', promised: 'PROMISED · NOT BINDING', five: ['CONQUERORS', '1984', 'ENSLAVED GOD', 'GATEKEEPER', 'EGALITARIAN UTOPIA'], who: ['LABS', 'GOVERNMENTS', 'VOTERS'],
    decided: 'DECIDED THIS YEAR', runs: 'RUNS A COMPANY IN THE RACE' },
};
