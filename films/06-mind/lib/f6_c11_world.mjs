// Film 6 · c11 · the world of §7a part 1: the big sheet under one lamp, the writers, the small pane that reads, the hall of a thousand,
// the paper world map with its cards, the two profiles, the engraved figures, the ink and the cool line. World space is 1920×1080 at
// camera z 1 (the table scene); the hall and the map extend far beyond it. Everything is a pure function of t (deterministic prng).
// Copied patterns (not edited): c09's page() idea (a plate drawn at identity inside a clipped sheet), c09's sourceLine/motes, c04's lotus (imported).
import { W, H, rgba, clamp, lin, mix, sm, eout, ein, prng, canvas, text, rough, poly, drift } from '../engine.mjs';
import { F6, once, layer, ember, coolText, breathe, figureDesk } from './f6_kit.mjs';
import { fibreFill } from './print.mjs';
import { stipple, vnoise, hatch as artHatch, pool } from './art.mjs';
import { figure, figureFlat, POSES, walk, handPos } from './figure.mjs';
import { scribble, pen, inkStroke } from './paper.mjs';
import { worldMap, ll } from './map.mjs';
import { lotus, PETAL_COUNT } from './f6_c04_room.mjs';

const TAU = Math.PI * 2;
export const QUART = (x) => (x = clamp(x), x < .5 ? 8 * x * x * x * x : 1 - 8 * Math.pow(1 - x, 4));
export const EXPO_OUT = (x) => (x = clamp(x), x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
export const EXPO_IN = (x) => (x = clamp(x), x <= 0 ? 0 : Math.pow(2, 10 * (x - 1)));

// ---------------------------------------------------------------- geometry (world units)
export const G0 = '#0e0c15';                                                 // the ground of this world (§7: paper and hands, ink, lamp amber)
export const SHEET = { x: 300, y: 370, w: 1180, h: 680, rot: -.012 };         // the big sheet (top-left, local coords 0..w, 0..h)
export const LAMP = { x: 1700, y: 400, s: 1.15, dir: .5 };
export const LAMPTIP = [LAMP.x + LAMP.s * (Math.sin(-LAMP.dir) * 70 - 14 - Math.sin(LAMP.dir) * 50), LAMP.y + LAMP.s * (-120 - Math.cos(LAMP.dir) * 60 + Math.cos(LAMP.dir) * 50)];
export const PANE = { x: 1690, y: 760, w: 330, h: 250 };                       // the machine: a small standing pane at the right (centre)
export const TABLE = { yFar: 330, yNear: 1500, xFar: [-400, 2300], xNear: [-900, 2800] };
export const DOCS = [
  { x: 490, y: 1260, w: 330, h: 220, rot: -.07, seed: 21, lines: ['ANTHROPIC', 'CONSTITUTION'] },
  { x: 900, y: 1280, w: 330, h: 220, rot: .05, seed: 22, lines: ['OPENAI', 'MODEL SPEC'] },
];
export const FLOOR = { x0: -2400, y0: -1300, x1: 4300, y1: 1800 };             // the hall's dark floor (its footprint on the card)
export const CARDM = 140;                                                    // the US card's cream margin around the floor
export const KS = 2.2;                                                       // a blank card = the sheet × KS (same proportions: a sheet to be written)
export const CARD = { w: SHEET.w * KS, h: SHEET.h * KS };
export const PPU = (FLOOR.x1 - FLOOR.x0 + 2 * CARDM) / (ll(-67, 39)[0] - ll(-125, 39)[0]);   // world px per Equal Earth unit: the US card ≈ the USA
const USA = ll(-98, 39), CARDC = [(FLOOR.x0 + FLOOR.x1) / 2, (FLOOR.y0 + FLOOR.y1) / 2];
export const MAPC = [CARDC[0] - USA[0] * PPU, CARDC[1] + USA[1] * PPU];       // world position of Equal Earth (0, 0)
export const MAPW = 2 * 2.70663 * PPU, MAPH = 2 * 1.31727 * PPU;
export const geo = (lon, lat) => { const [ex, ey] = ll(lon, lat); return [MAPC[0] + ex * PPU, MAPC[1] - ey * PPU]; };
export const sheetPt = (lx, ly) => { const c = Math.cos(SHEET.rot), s = Math.sin(SHEET.rot); return [SHEET.x + lx * c - ly * s, SHEET.y + lx * s + ly * c]; };
// the blank cards on the map (lon, lat of their centres); the one at index IDX_IN is the one the camera flies into
export const GHOSTS = [[-115, 60], [-75, 56], [-100, 20], [-70, 5], [-78, -12], [-52, -12], [-65, -36], [-8, 30], [8, 10], [28, 26], [37, 2], [23, -5], [25, -28],
  [-2, 48], [18, 50], [38, 54], [60, 58], [95, 63], [125, 63], [47, 38], [54, 22], [71, 32], [78, 22], [92, 47], [100, 34], [118, 30], [138, 37], [103, 14], [116, -2], [127, -24], [146, -31]];
export const IDX_IN = GHOSTS.findIndex(([lo, la]) => lo === 78 && la === 22);
export const ghostAt = (i) => geo(GHOSTS[i][0], GHOSTS[i][1]);

// ---------------------------------------------------------------- paper: one surface for the sheet and every card (drawn at identity, so a push lands in it)
function paperLayer() {
  return layer('c11:paper', W, H, (g, c) => {
    g.fillStyle = '#ebdfc4'; g.fillRect(0, 0, W, H);
    const r = prng(77); g.lineCap = 'round';
    for (let i = 0; i < 520; i++) { const x = r() * W, y = r() * H, a = (r() - .5) * 2.4, L = 6 + r() * 26, k = r(); g.strokeStyle = rgba(k < .5 ? '#8a7350' : '#fffaf0', .07 + .06 * k); g.lineWidth = .7 + k * .6; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke(); }
    stipple(c, { k: .18, g: 1, seed: 5, mid: false, boost: 1 });
  });
}
// paperFace: the cream face in screen space with a slow light drift (alive, never frozen). Call inside a clip, at any transform: it resets to identity.
export function paperFace(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(paperLayer(), 0, 0);
  const lx = W * .62 + 40 * drift(t, 1, 2), ly = H * .3 + 20 * drift(t, 1, 5);
  const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, 1900); g.addColorStop(0, 'rgba(255,248,230,.22)'); g.addColorStop(.55, 'rgba(255,248,230,0)'); g.addColorStop(1, 'rgba(90,70,40,.18)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.restore();
}
// the sheet's own shading in local units (the lamp's falloff: darker away from the lamp at the top right); the same on the blank card we fly into
export function sheetShade(ctx, w, h, k = 1) {
  const g = ctx.createLinearGradient(0, h, w, 0); g.addColorStop(0, `rgba(40,30,20,${.55 * k})`); g.addColorStop(.5, `rgba(40,30,20,${.22 * k})`); g.addColorStop(1, `rgba(40,30,20,${.03 * k})`); ctx.fillStyle = g; ctx.fillRect(-2, -2, w + 4, h + 4);
}
const edgeOf = (key, w, h, amp, seed) => once(key, () => rough([[0, 0], [w, 0], [w, h], [0, h]], amp, seed, { step: 14 }));
// a sheet of paper lying in the world: rough edge, shadow, the paper face (identity), the local shading, then content(g, w, h) in local units
export function sheetAt(ctx, t, { x, y, w, h, rot = 0, seed = 9, shade = 1, lift = 6, edgeAmp, content, shadow = true, key }) {
  const edge = edgeOf(key || `c11:edge:${w}x${h}:${seed}`, w, h, edgeAmp ?? Math.max(1.2, w * .003), seed);
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  if (shadow) { ctx.save(); ctx.translate(6 + lift * .5, 8 + lift); ctx.fillStyle = 'rgba(0,0,0,.45)'; poly(ctx, edge); ctx.fill(); ctx.restore(); }
  poly(ctx, edge); ctx.save(); ctx.clip();
  paperFace(ctx, t);
  if (shade > 0) sheetShade(ctx, w, h, shade);
  if (content) content(ctx, w, h);
  ctx.restore();
  ctx.strokeStyle = 'rgba(90,70,50,.38)'; ctx.lineWidth = 1.1; poly(ctx, edge); ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------- the table (cached wood at half resolution) and the lamp
function tableLayer() {
  const { yFar, yNear, xFar, xNear } = TABLE, x0 = xNear[0], w = xNear[1] - xNear[0], h = yNear - yFar + 10, S = .5;
  return layer('c11:table', Math.ceil(w * S), Math.ceil(h * S), (g, c) => {
    g.scale(S, S); g.translate(-x0, -yFar);
    const tg = g.createLinearGradient(0, yFar, 0, yNear); tg.addColorStop(0, '#3a2a1d'); tg.addColorStop(.5, '#2c1f16'); tg.addColorStop(1, '#1a120c');
    g.fillStyle = tg; g.beginPath(); g.moveTo(xFar[0], yFar); g.lineTo(xFar[1], yFar); g.lineTo(xNear[1], yNear + 10); g.lineTo(xNear[0], yNear + 10); g.closePath(); g.fill();
    g.save(); g.clip();
    // grain: long slightly wavy lines running toward the viewer
    const r = prng(31), n = vnoise(9); g.lineCap = 'round';
    for (let i = 0; i < 170; i++) { const u = i / 170, xa = mix(xFar[0], xFar[1], u) + (r() - .5) * 40, xb = mix(xNear[0], xNear[1], u) + (r() - .5) * 60, k = r(); g.strokeStyle = rgba(k < .6 ? '#120b06' : '#6a4a30', .12 + .14 * r()); g.lineWidth = .8 + r() * 1.6; g.beginPath(); for (let j = 0; j <= 24; j++) { const q = j / 24, x = mix(xa, xb, q) + 14 * (n(u * 30, q * 9) - .5), y = mix(yFar, yNear, q); j ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
    g.restore();
    g.strokeStyle = 'rgba(255,220,180,.16)'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(xFar[0], yFar); g.lineTo(xFar[1], yFar); g.stroke();   // the far edge catches the light
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .3, g: 1, seed: 12, mid: false, boost: 1.2 });
  });
}
export function tableTop(ctx) {
  const { yFar, xNear } = TABLE, L = tableLayer();
  ctx.drawImage(L, xNear[0], yFar, L.width * 2, L.height * 2);
}
// the lamp on the table: the ember (breathing), its pool of light on the wood and on the sheet
export function lamp(ctx, t, a = 1, part = 'cone') {
  if (part === 'cone') { pool(ctx, LAMPTIP[0] - 260, LAMPTIP[1] + 420, 760, 230, { col: F6.amber, a: .13 * a, seed: 4 }); return ember(ctx, t, { x: LAMP.x, y: LAMP.y, kind: 'lamp', s: LAMP.s, dir: LAMP.dir, r: 1, a, phase: .1 }); }
  return ember(ctx, t, { x: LAMP.x, y: LAMP.y, kind: 'lamp', s: LAMP.s, dir: LAMP.dir, r: 250, a, phase: .1, cone: 0 });
}
// is a world rect on screen under the camera mapping m?
export const onScreen = (m, x, y, w, h, pad = 0) => { const x0 = m.X(x), y0 = m.Y(y), x1 = m.X(x + w), y1 = m.Y(y + h); return x1 > -pad && y1 > -pad && x0 < W + pad && y0 < H + pad; };

// ---------------------------------------------------------------- the writers (different origins around the table)
const SKINS = ['#d9b08e', '#8d5f40', '#e9c3a0', '#5c3a26', '#b98762', '#f0d2b4'];
export const WRITERS = [
  { x: 560, y: 346, s: 1.7, seed: 11, flip: false, coat: '#43365a', skin: SKINS[1], hair: 'short', side: -1 },
  { x: 1090, y: 340, s: 1.75, seed: 12, flip: false, coat: '#2f3a46', skin: SKINS[0], hair: 'bob', side: 1 },
  { x: 1430, y: 346, s: 1.7, seed: 13, flip: true, coat: '#3a3448', skin: SKINS[3], hair: 'curly', side: 1 },
  { x: -520, y: 640, s: 1.85, seed: 14, flip: false, coat: '#2c3450', skin: SKINS[4], hair: 'short', side: 1, left: true },
];
const WPOSE = { ...POSES.lean, lean: .3, head: .5, sh: [.95, .72], el: [1.0, .95], gaze: .9 };
export function writer(ctx, t, i, o = {}) {
  const Wr = WRITERS[i], pose = { ...WPOSE, hair: Wr.hair, lean: Wr.left ? .2 : .3 };
  const light = { x: LAMPTIP[0], y: LAMPTIP[1], col: F6.amberCore, a: .6 * (o.lightA ?? 1) };
  figure(ctx, Wr.x, Wr.y, Wr.s, pose, { t, seed: Wr.seed, flip: Wr.flip, dress: { coat: Wr.coat, pants: '#1a1426', skin: Wr.skin }, light, rim: rgba(F6.amber, .7), rimSide: Wr.x < LAMP.x ? 1 : -1, shadow: false, shadeA: o.shadeA ?? 0 });
  // the pen in the front hand, its nib on the paper, a small writing movement (position leads, the tilt follows)
  const hp = handPos(Wr.x, Wr.y, Wr.s, pose, 0, Wr.flip, { t, seed: Wr.seed }), wr = Math.sin(t * 5.1 + Wr.seed) * 5 + Math.sin(t * 2.3 + Wr.seed) * 3;
  const nib = [hp[0] + (Wr.flip ? -8 : 8) + wr, hp[1] + 16], ang = (Wr.flip ? -1.25 : -1.9) + .05 * Math.sin(t * 5.1 + Wr.seed + .4);
  pen(ctx, nib[0], nib[1], .3 * Wr.s / 1.7, { ang, t, lift: 0 });
  return nib;
}
// the near writer from behind (bottom left of the table): a seated back, shoulders moving with the writing
export function nearWriter(ctx, t) {
  const x = 262, y = 1092, s = 2.0, r0 = 5 * 1.37, k2 = Math.sin(t * 7.3 + r0 + 2.4) * 1.4;
  figureDesk(ctx, t, x, y, s, { seed: 5, typing: true, lamp: { x: LAMPTIP[0], y: LAMPTIP[1] }, screen: { x: PANE.x, y: PANE.y }, screenA: .25, dress: { coat: '#2e3a52', skin: '#8d5f40' } });
  pen(ctx, x + (31 + k2 * .3) * s + 8, y + (-30 + k2) * s + 4, .34, { ang: -.85, t, lift: 0 });
}

// ---------------------------------------------------------------- what is written on the sheet (local units)
// the four sentences (scribble lines growing with u), each with its 'because' margin note (red ink + a scribbled reason)
export const ROWS = [66, 118, 170, 222];
export function sheetText(ctx, t, { sent, notes }) {
  const ink = rgba(F6.ink, .82);
  ROWS.forEach((y, i) => {
    const u = clamp(sent[i] ?? 0); if (u > 0) scribble(ctx, 60, y, 470 - (i % 2) * 60, 9, { seed: 101 + i, ink, lw: 1.7, u });
    const k = clamp(notes[i] ?? 0); if (k > 0) {
      const sc = 1 + .05 * (1 - eout(clamp(k * 2))), al = .45 + .55 * clamp(k * 2);
      ctx.save(); ctx.translate(640, y + 4); ctx.scale(sc, sc); text(ctx, 'because', 0, 0, { size: 21, weight: 500, color: rgba('#8e2f2a', .85 * al), spacing: 3 }); ctx.restore();
      scribble(ctx, 760, y, 320 - (i % 3) * 40, 8, { seed: 131 + i, ink: rgba('#8e2f2a', .62), lw: 1.3, u: clamp((k - .25) / .75) });
    }
  });
}
// the lotus engraved in the margin (c04's lotus, small, on paper): first the ink outline, then the petals open (open per petal), the ember heart
export function marginLotus(ctx, t, { u, open, glow }) {
  const L = 40, x = 330, y = 586;
  ctx.save(); ctx.translate(x, y);
  if (u > 0) { // the engraved outline: a faint ink lotus shape drawing on (the "margin engraving")
    ctx.strokeStyle = rgba(F6.ink, .45); ctx.lineWidth = 1.1; ctx.lineCap = 'round';
    const n = 9, m = Math.floor(n * clamp(u)) + (u >= 1 ? 0 : 1);
    for (let i = 0; i < Math.min(n, m); i++) { const ph = (i / (n - 1) - .5) * 2.4, len = L * (1.35 - .35 * Math.abs(ph)), uu = i === m - 1 && u < 1 ? (u * n) % 1 : 1; ctx.beginPath(); ctx.moveTo(0, 4); ctx.quadraticCurveTo(Math.sin(ph) * len * .9, -len * .4, Math.sin(ph) * len * uu * .62, (4 - len * 1.05) * uu); ctx.stroke(); }
    ctx.beginPath(); ctx.ellipse(0, 10, L * 1.5 * clamp(u * 1.5), L * .34 * clamp(u * 1.5), 0, 0, TAU); ctx.stroke();
  }
  if (open.some((v) => v > 0)) lotus(ctx, t, { open, glow, L, a: .96 });
  ctx.restore();
}
// the two head profiles (engraved ink lines drawing on), facing each other; the box is 150 wide × 180 tall
const PROFILE = [[.56, 1], [.5, .9], [.36, .86], [.2, .76], [.12, .58], [.13, .38], [.2, .2], [.32, .08], [.46, .02], [.6, .01], [.72, .06], [.82, .17], [.86, .3], [.84, .42], [.9, .52], [.93, .6], [.87, .64], [.9, .7], [.86, .74], [.88, .8], [.81, .87], [.72, .92], [.68, 1]];
const profilePts = () => once('c11:profile', () => {   // smooth through the control points (Catmull-Rom), then engraved jitter
  const P = PROFILE, out = []; const r = prng(5);
  for (let i = 0; i < P.length - 1; i++) { const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)]; for (let j = 0; j < 8; j++) { const q = j / 8, q2 = q * q, q3 = q2 * q; const f = (a, b, c, d) => .5 * (2 * b + (c - a) * q + (2 * a - 5 * b + 4 * c - d) * q2 + (3 * b - a - 3 * c + d) * q3); out.push([f(p0[0], p1[0], p2[0], p3[0]) + (r() - .5) * .006, f(p0[1], p1[1], p2[1], p3[1]) + (r() - .5) * .006]); } }
  out.push(P[P.length - 1]); return out;
});
export const PROF = { lx: 450, rx: 760, y: 252, w: 150, h: 180, brain: [.44, .36] };
export function profile(ctx, t, x, y, u, flip, o = {}) {
  if (u <= 0) return; const pts = profilePts(), n = Math.max(2, Math.floor(pts.length * clamp(u))), w = PROF.w, h = PROF.h;
  ctx.save(); ctx.translate(x, y); if (flip) { ctx.translate(w, 0); ctx.scale(-1, 1); }
  ctx.strokeStyle = rgba(F6.ink, .85 * (o.a ?? 1)); ctx.lineWidth = 2.1; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); for (let i = 0; i < n; i++) { const [px, py] = pts[i]; i ? ctx.lineTo(px * w, py * h) : ctx.moveTo(px * w, py * h); }
  if (u < 1) { const q = (pts.length * u) % 1, a = pts[n - 1], b = pts[Math.min(pts.length - 1, n)]; ctx.lineTo(mix(a[0], b[0], q) * w, mix(a[1], b[1], q) * h); }
  ctx.stroke();
  // engraved shading inside the back of the head (a few hatch strokes), once the line is closed
  if (u >= 1) { ctx.strokeStyle = rgba(F6.ink, .22); ctx.lineWidth = .9; ctx.beginPath(); for (let i = 0; i < 9; i++) { const yy = h * (.2 + i * .07); ctx.moveTo(w * (.17 + i * .01), yy); ctx.lineTo(w * (.3 + i * .02), yy + h * .05); } ctx.stroke(); }
  ctx.restore();
}
// the hot flicker (empathic distress) and its draining; drawn in local units at the brain point of the left profile
export function distress(ctx, t, x, y, { a, sink }) {
  if (a <= 0) return; const n = once('c11:fl', () => vnoise(23)), fl = .62 + .38 * n(t * 6.3, 1.5), R = 34 * (1 - .55 * sink);
  const cy = y + 92 * ein(sink), al = a * (1 - .72 * sink) * fl;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, cy, 0, x, cy, R); g.addColorStop(0, rgba('#ffd0b0', .95 * al)); g.addColorStop(.3, rgba('#ff5a3c', .7 * al)); g.addColorStop(1, rgba('#ff5a3c', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, cy, R, 0, TAU); ctx.fill();
  ctx.restore();
  // jagged red ink spikes around it (the flicker is drawn, not a disc)
  ctx.save(); ctx.strokeStyle = rgba('#b8321f', .75 * a * (1 - .5 * sink)); ctx.lineWidth = 1.3; ctx.lineCap = 'round'; ctx.beginPath();
  for (let i = 0; i < 11; i++) { const q = i / 11 * TAU + t * .3, k = .6 + .4 * n(i * 2.1, t * 5.1), r0 = R * .55, r1 = R * (.75 + .5 * k) * fl; ctx.moveTo(x + Math.cos(q) * r0, cy + Math.sin(q) * r0 * .9); ctx.lineTo(x + Math.cos(q) * r1, cy + Math.sin(q) * r1 * .9); }
  ctx.stroke(); ctx.restore();
}
export function labelOn(ctx, t, s, x, y, t0, o = {}) {
  const a = lin(t0, t0 + .45, t); if (a <= 0) return;
  ctx.save(); ctx.font = `600 ${o.size ?? 15}px "Inter"`; try { ctx.letterSpacing = '4px'; } catch { } ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  const w = ctx.measureText(s).width; ctx.beginPath(); ctx.rect(x - w / 2 - 4, y - 22, (w + 8) * eout(a), 32); ctx.clip();
  ctx.fillStyle = rgba(o.col || F6.ink, .8); ctx.fillText(s, x, y); ctx.restore();
}
// the engraved figures beside the compassion profile: one stands by the other; on "moves you to help" the first takes two real steps toward
// the other and reaches out; the ember travels in its chest. Ink on paper (figureFlat in ink with hatch).
export function stepFigures(ctx, t, { walkU, reach, a, emberA }) {
  if (a <= 0) return; const s = .44, ink = '#2a2420', y = 410, x1 = 1120, x0 = 935, dist = x1 - x0 - 58;
  const px = x0 + dist * walkU, ph = walkU * TAU * 2.0;
  // the one who needs help: standing, head bowed, arms close
  figureFlat(ctx, x1, y, s, { head: .4, sh: [.3, .22], el: [.9, .85], lean: -.04 }, { t, seed: 7, col: ink, flip: true, shadow: false, hatch: true, shade: .5 });
  // the helper: a real gait while walking, then the reach
  const pose = walkU > 0 && walkU < 1 ? walk(ph) : (reach > 0 ? { sh: [mix(.2, 1.3, reach), .3], el: [mix(.3, .1, reach), .3], lean: .05 * reach } : {});
  figureFlat(ctx, px, y, s, pose, { t, seed: 8, col: ink, shadow: false, hatch: true, shade: .5 });
  if (emberA > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const b = breathe(t, 60, .4); const g = ctx.createRadialGradient(px + 3, y - 52 * s, 0, px + 3, y - 52 * s, 20 * b); g.addColorStop(0, rgba(F6.amberCore, .9 * emberA)); g.addColorStop(.4, rgba(F6.amber, .5 * emberA)); g.addColorStop(1, rgba(F6.amberDeep, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px + 3, y - 52 * s, 20 * b, 0, TAU); ctx.fill(); ctx.restore(); }
}
// ink writing by a mask reveal with the pen at the front (the human hand's precision): 'care =' and 'feel what they feel'; the red strike-through
export const CARE = { x: 500, y: 505, feelY: 578, helpY: 650 };
export function inkWriting(ctx, t, { care, feel, strike }) {
  let front = null;
  if (care > 0) { ctx.save(); ctx.font = '600 26px "Inter"'; try { ctx.letterSpacing = '7px'; } catch { } const w = ctx.measureText('care =').width; ctx.beginPath(); ctx.rect(CARE.x - 4, CARE.y - 30, (w + 10) * care, 42); ctx.clip(); ctx.fillStyle = rgba(F6.ink, .62); ctx.fillText('care =', CARE.x, CARE.y); ctx.restore(); if (care < 1) front = [CARE.x + w * care, CARE.y - 2]; }
  if (feel > 0) { ctx.save(); ctx.font = '62px "Instrument Serif"'; const w = ctx.measureText('feel what they feel').width; ctx.beginPath(); ctx.rect(CARE.x - 6, CARE.feelY - 60, (w + 14) * feel, 84); ctx.clip(); ctx.fillStyle = rgba(F6.ink, .9); ctx.fillText('feel what they feel', CARE.x, CARE.feelY); ctx.restore(); if (feel < 1) front = [CARE.x + w * feel, CARE.feelY - 10]; }
  if (strike > 0) { ctx.save(); ctx.font = '62px "Instrument Serif"'; const w = ctx.measureText('feel what they feel').width; ctx.restore(); const pts = Array.from({ length: 40 }, (_, i) => [CARE.x - 8 + (w + 18) * i / 39, CARE.feelY - 21 + Math.sin(i * .9) * 2.2 - i * .12]); inkStroke(ctx, pts, strike, { w: 5.5, ink: '#8e2f2a', seed: 4 }); if (strike < 1) { const k = Math.min(39, Math.floor(40 * strike)); front = pts[k]; } }
  return front;
}

// ---------------------------------------------------------------- the small pane (the machine): dark glass = the glass plate at identity, cool lines on it
// plate(ctx, t) draws the glass plate (handoff) at identity; lines: [{ t0, seed }] glyph lines; read: { words|text, t0 } readable copy; glow 0..1
export function machinePane(ctx, t, { plate, lines = [], read = null, glow = 0, paneFn }) {
  const { x, y, w, h } = PANE;
  // the stand on the table (a small foot behind the pane)
  ctx.fillStyle = '#0c0f1c'; ctx.beginPath(); ctx.roundRect(x - 60, y + h / 2 + 2, 120, 16, 5); ctx.fill(); ctx.fillStyle = '#141a2c'; ctx.fillRect(x - 110, y + h / 2 + 14, 220, 7);
  ctx.save(); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 4); ctx.clip();
  plate(ctx, t);                                               // the glass (screen space, identical to the plate we push into)
  // the cool haze of a screen that is on (ramped by glow, never the kit's full haze at once)
  if (glow > 0) { const hz = ctx.createRadialGradient(x, y, 0, x, y, Math.max(w, h) * .7); hz.addColorStop(0, rgba('#17264a', .55 * glow)); hz.addColorStop(1, rgba('#0a0f24', 0)); ctx.fillStyle = hz; ctx.fillRect(x - w / 2, y - h / 2, w, h); }
  // the lines it has read (glyph runs, one per because-note), then the readable copy
  lines.forEach((L, i) => { if (t >= L.t0) coolText(ctx, t, { x: x - w / 2 + 22, y: y - h / 2 + 62 + i * 20, w: w - 44, size: 9, lines: 1, t0: L.t0, cps: 30, seed: 40 + i, a: .85, cursor: false, lengths: [L.len ?? .7] }); });
  if (read && t >= read.t0 - .2) coolText(ctx, t, { x: x - w / 2 + 22, y: y - h / 2 + 12, w: w - 40, text: read.text, words: read.words, t0: read.t0, per: read.per ?? .18, fontSize: read.size ?? 30, a: 1, col: '#9fd0ff', core: '#f4fbff', cursor: true });
  ctx.restore();
  paneFn(ctx, t, { x, y, w, h, frame: 'thin', edge: .7, sheen: 0, dark: false, spill: false, seed: 3 });
}

// ---------------------------------------------------------------- the two documents (11.03): land on the table side by side, neither highlighted
export function documents(ctx, t, t0) {
  DOCS.forEach((D, i) => {
    const u = EXPO_OUT(lin(t0 + i * .22, t0 + i * .22 + .62, t)); if (u <= 0) return;
    const dy = -220 * (1 - u), rot = D.rot + (i ? -.1 : .1) * (1 - EXPO_OUT(lin(t0 + i * .22 + .1, t0 + i * .22 + .75, t))), lift = 40 * (1 - u);
    sheetAt(ctx, t, { x: D.x - D.w / 2, y: D.y - D.h / 2 + dy, w: D.w, h: D.h, rot, seed: D.seed, lift, shade: .5, key: 'c11:doc' + i, content: (g, w, h) => {
      const k = clamp((t - t0 - i * .22 - .5) / .3);
      D.lines.forEach((s, j) => { if (k <= 0) return; const sc = 1 + .05 * (1 - eout(k)); g.save(); g.translate(34, 50 + j * 34); g.scale(sc, sc); text(g, s, 0, 0, { size: j ? 17 : 21, weight: 700, color: rgba(F6.ink, (j ? .62 : .82) * (.4 + .6 * k)), spacing: 4 }); g.restore(); });
      g.strokeStyle = rgba(F6.ink, .3); g.lineWidth = 1; g.beginPath(); g.moveTo(34, 104); g.lineTo(w - 34, 104); g.stroke();
      for (let j = 0; j < 4; j++) scribble(g, 34, 128 + j * 20, w * (.62 - .08 * (j % 3)), 5, { seed: 150 + i * 10 + j, ink: rgba(F6.ink, .5), lw: 1 });
    } });
  });
}

// ---------------------------------------------------------------- the hall of a thousand: tiers of seated people behind the table, cards held up
export const HALL = (() => {
  const r = prng(4040), rows = [];
  for (let i = 0; i < 14; i++) {
    const y = 236 - i * 94, s = 1.04 - i * .042, n = 60 + i * 2, x0 = -2200 + i * 40, x1 = 4100 - i * 40, people = [];
    for (let k = 0; k < n; k++) { const x = mix(x0, x1, (k + .5 + (r() - .5) * .5) / n), seed = Math.floor(r() * 1e4), delay = r() * 2.3, tone = Math.floor(r() * 4), up = r() < .97; people.push({ x, seed, delay, tone, up, rot: (r() - .5) * .2 }); }
    rows.push({ y, s, people, x0, x1 });
  }
  return rows;
})();
export const HALL_COUNT = HALL.reduce((a, r) => a + r.people.length, 0);
const TONES = ['#1b2238', '#222a42', '#1e2536', '#252b3e'];
const SEG = 4;   // each row is cached in SEG segment canvases (half resolution) so the segments can breathe on their own
function rowSeg(i, j) {
  const R = HALL[i], w = (R.x1 - R.x0) / SEG + 160, S = .5, h = 300 * R.s + 40, xs = R.x0 + j * (R.x1 - R.x0) / SEG - 80;
  return layer(`c11:row:${i}:${j}`, Math.ceil(w * S), Math.ceil(h * S), (g, c) => {
    g.scale(S, S); g.translate(-xs, -(R.y - 200 * R.s));
    for (const p of R.people) { if (p.x < xs || p.x >= xs + w) continue;
      const pose = { head: .08 + .1 * ((p.seed % 5) / 5), sh: [.22, .14], el: [.5, .4], hair: ['short', 'bob', 'curly', 'beanie'][p.seed % 4] };
      figureFlat(g, p.x, R.y, R.s, pose, { t: 0, seed: p.seed, col: TONES[p.tone], rim: '#4a5578', rimSide: p.x < 960 ? 1 : -1, flip: p.seed % 2 === 1, shadow: false, fast: true }); }
    // the tier front in front of this row's lower bodies
    const yb = R.y - 22 * R.s; const tg = g.createLinearGradient(0, yb, 0, yb + 110 * R.s); tg.addColorStop(0, '#2a2234'); tg.addColorStop(1, '#120e18'); g.fillStyle = tg; g.fillRect(xs - 10, yb, w + 20, 110 * R.s);
    g.fillStyle = 'rgba(255,220,180,.13)'; g.fillRect(xs - 10, yb, w + 20, 2.5);
    g.setTransform(1, 0, 0, 1, 0, 0); artHatch(g, [0, 0, c.width, c.height], { angle: -1.0, gap: 3, a: .18, col: '#05060c', w: .5, seed: 3 + i });
  });
}
// the hall: rows back to front, each segment breathing on its own; the cards (held up, staggered from tCards) live on top of each row
export function hall(ctx, t, { tCards, shade = 0, m }) {
  for (let i = HALL.length - 1; i >= 0; i--) {
    const R = HALL[i], w = (R.x1 - R.x0) / SEG + 160;
    if (m && !onScreen(m, R.x0 - 80, R.y - 200 * R.s, R.x1 - R.x0 + 160, 300 * R.s + 40, 40)) continue;
    for (let j = 0; j < SEG; j++) { const L = rowSeg(i, j), xs = R.x0 + j * (R.x1 - R.x0) / SEG - 80; if (m && !onScreen(m, xs, R.y - 200 * R.s, w, 300 * R.s + 40, 40)) continue; const b = Math.sin(t * TAU / (4.1 + .3 * ((i * 3 + j) % 5)) + i * 1.7 + j * 2.3) * .9 * R.s; ctx.drawImage(L, xs, R.y - 200 * R.s + b, L.width * 2, L.height * 2); }
    if (tCards != null) cardsRow(ctx, t, R, tCards, i, m);
  }
  if (shade > 0) { ctx.fillStyle = rgba(G0, shade); ctx.fillRect(FLOOR.x0, FLOOR.y0, FLOOR.x1 - FLOOR.x0, FLOOR.y1 - FLOOR.y0); }
}
function cardsRow(ctx, t, R, tCards, i, m) {
  const s = R.s, cw = 44 * s, ch = 31 * s;
  ctx.save(); ctx.lineCap = 'round';
  for (const p of R.people) {
    if (!p.up) continue; if (m && !onScreen(m, p.x - 40 * s, R.y - 260 * s, 80 * s, 120 * s, 20)) continue; const u = EXPO_OUT(lin(tCards + p.delay, tCards + p.delay + .55, t)); if (u <= 0) continue;
    const sx = p.x + 15 * s * (p.seed % 2 ? -1 : 1), hy = R.y - 172 * s, cx = p.x + 10 * s * (p.seed % 2 ? -1 : 1), cy = hy - 12 * s - 62 * s * u;
    // the raised arm (from the shoulder to the card's lower edge), then the card, its rotation following the rise
    ctx.strokeStyle = TONES[p.tone]; ctx.lineWidth = 7 * s; ctx.beginPath(); ctx.moveTo(sx, hy + 34 * s); ctx.lineTo(cx, cy + ch * .5); ctx.stroke();
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(p.rot * (1 - u) + p.rot * .3);
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-cw / 2 + 2, -ch / 2 + 3, cw, ch);
    ctx.fillStyle = `rgb(${236 - i * 3},${225 - i * 3},${200 - i * 3})`; ctx.fillRect(-cw / 2, -ch / 2, cw, ch);
    if (s > .72) { ctx.strokeStyle = 'rgba(42,36,32,.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-cw * .36, -ch * .18); ctx.lineTo(cw * .3, -ch * .18); ctx.moveTo(-cw * .36, ch * .1); ctx.lineTo(cw * .18, ch * .1); ctx.stroke(); }
    ctx.restore();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the paper world map (cached once at 1/10, drawn under the camera) and its cards
const MS = .1;
function mapLayer() {
  const w = Math.ceil(MAPW * MS) + 40, h = Math.ceil(MAPH * MS) + 40;
  return layer('c11:map', w, h, (g, c) => {
    worldMap(g, { cx: 0, cy: 0, z: PPU * MS / 330, rot: 0, tilt: 0, x: w / 2, y: h / 2, f: 1e6 }, { t: 0, paper: '#e9dfc4', land: '#e2d6b8', sea: '#d3c6a5', ink: '#2a2030', borders: true, hatch: true, graticule: true, sheet: true, light: [w * .45, h * .3], detail: '110m' });
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .25, g: 1, seed: 19, mid: false, boost: 1 });
  });
}
export function mapSheet(ctx, t, { night = .5 }) {
  const L = mapLayer(), x = MAPC[0] - (L.width / MS) / 2, y = MAPC[1] - (L.height / MS) / 2;
  ctx.drawImage(L, x, y, L.width / MS, L.height / MS);
  if (night > 0) { ctx.fillStyle = `rgba(12,10,24,${night})`; ctx.fillRect(x - 10, y - 10, L.width / MS + 20, L.height / MS + 20); }
}
// a blank card on the map (dotted edge = not written yet); rise 0..1 (its paper rises out of the dark), the one we fly into has the sheet's shading
export function blankCard(ctx, t, i, rise, o = {}) {
  if (rise <= 0) return; const [cx, cy] = ghostAt(i), w = CARD.w, h = CARD.h, k = eout(rise);
  if (o.m && !onScreen(o.m, cx - w / 2 - 10, cy - h / 2 - 10, w + 20, h + 20)) return;
  ctx.save(); ctx.translate(cx - w / 2, cy - h / 2);
  ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.save(); ctx.clip(); paperFace(ctx, t); if (o.shade) sheetShade(ctx, w, h, o.shade); if (k < 1) { ctx.fillStyle = rgba('#0c0a18', 1 - k); ctx.fillRect(0, 0, w, h); } ctx.restore();
  ctx.setLineDash([60, 48]); ctx.lineDashOffset = -t * 20; ctx.strokeStyle = rgba('#5a4a38', .75 * k); ctx.lineWidth = 16; ctx.strokeRect(0, 0, w, h); ctx.restore();
}
// the US card under the hall: cream margin around the dark floor, a warm glow (the hall's light seen from afar)
export function usCard(ctx, t, { rise, glow }) {
  if (rise <= 0) return; const k = eout(rise), x = FLOOR.x0 - CARDM, y = FLOOR.y0 - CARDM, w = FLOOR.x1 - FLOOR.x0 + 2 * CARDM, h = FLOOR.y1 - FLOOR.y0 + 2 * CARDM;
  ctx.save(); ctx.translate(x + 60, y + 80); ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(0, 0, w, h); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); paperFace(ctx, t); if (k < 1) { ctx.fillStyle = rgba('#0c0a18', 1 - k); ctx.fillRect(x, y, w, h); } ctx.restore();
  ctx.strokeStyle = rgba('#5a4a38', .6 * k); ctx.lineWidth = 14; ctx.strokeRect(x, y, w, h);
}
export function usGlow(ctx, t, glow) {
  if (glow <= 0) return; const x = FLOOR.x0 - CARDM, y = FLOOR.y0 - CARDM, w = FLOOR.x1 - FLOOR.x0 + 2 * CARDM, h = FLOOR.y1 - FLOOR.y0 + 2 * CARDM;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const b = breathe(t, 60, .2);
  const g = ctx.createRadialGradient(x + w / 2, y + h / 2, 0, x + w / 2, y + h / 2, w * .9 * b); g.addColorStop(0, rgba(F6.amber, .5 * glow)); g.addColorStop(.35, rgba(F6.amber, .22 * glow)); g.addColorStop(1, rgba(F6.amberDeep, 0)); ctx.fillStyle = g; ctx.fillRect(x - w, y - h, 3 * w, 3 * h); ctx.restore();
}
export function hallFloor(ctx) { const fg = ctx.createLinearGradient(0, FLOOR.y0, 0, FLOOR.y1); fg.addColorStop(0, '#0a0810'); fg.addColorStop(.6, '#120e18'); fg.addColorStop(1, '#17110f'); ctx.fillStyle = fg; ctx.fillRect(FLOOR.x0, FLOOR.y0, FLOOR.x1 - FLOOR.x0, FLOOR.y1 - FLOOR.y0); }

// ---------------------------------------------------------------- screen-space helpers
// a source line in Inter caps (baseline ≤ 860), written by a mask reveal, held, then wiped (pattern: c09)
export function sourceLine(ctx, t, s, t0, t1, o = {}) {
  const a = Math.min(lin(t0, t0 + .5, t), 1 - lin(t1, t1 + .3, t)); if (a <= 0) return;
  const y = o.y ?? 850, size = o.size ?? 19; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.font = `600 ${size}px "Inter"`; try { ctx.letterSpacing = '4px'; } catch { }
  const w = ctx.measureText(s).width, x = o.align === 'right' ? W - 110 - w : o.x ?? 110;
  ctx.beginPath(); ctx.rect(x - 4, y - size - 8, (w + 12) * eout(a), size + 16); ctx.clip();
  ctx.fillStyle = rgba('#000000', .3); ctx.fillText(s, x + 1, y + 1); ctx.fillStyle = rgba(o.col || '#dfe7f2', .85); ctx.fillText(s, x, y); ctx.restore();
}
// dust motes in the lamp's light (world units)
export function motes(ctx, t, cx, cy, seed = 5, n = 24, R = 420, A = 1) {
  const r = prng(seed); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) { const ph = r() * TAU, rr = r() * R, sp = .3 + r() * .7, sz = .8 + r() * 1.6; const x = cx + Math.cos(ph + t * .07 * sp) * rr + 18 * Math.sin(t * .5 * sp + i), y = cy + Math.sin(ph * 1.3 + t * .05 * sp) * rr * .6 + 12 * Math.cos(t * .4 * sp + i * 2); const a = (.25 + .45 * Math.abs(Math.sin(t * .9 * sp + i))) * A * (1 - rr / R); ctx.fillStyle = rgba(F6.amberCore, a); ctx.beginPath(); ctx.arc(x, y, sz, 0, TAU); ctx.fill(); }
  ctx.restore();
}
