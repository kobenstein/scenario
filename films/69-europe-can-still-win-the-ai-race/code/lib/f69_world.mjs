// Film 69 · THE LEITBILD: the night sea of 27 lights under THE PUZZLE MOON (used ONLY at the 4 anchors: hook, turn, verdict, end;
// Jakob 24.11.: no one-world film, no camera ride through a world) + the seam plates (on the plan sheet) + the end screen
// (owned by the lead; builders import, never edit — wishes go in the report).
//
// THE LEITBILD WORLD: a calm night sea. On it 27 separate islands of light at different depths = Europe's 27 pieces (no map, no borders, no flags).
// Above them hangs THE PUZZLE MOON: the KIT (lib/f69_kit.mjs kitDisc) in the ring of 12 stars, far away (Z_MOON), the one gold light.
// Inside an anchor the camera may glide a little IN DEPTH across the sea (forward = into the archipelago, back = the whole picture),
// trucks sideways, cranes up. Away = screen right (beyond the horizon on the right is "elsewhere": the cool glow, where machines, people
// and founders go). Coming back = right → left.
//
// GEOMETRY (true perspective through the 2.5D card stage of f10_editorial): an island lives at world (X, Z); it is drawn on its own card
// at depth Z, at design point u = W/2 + X·F0/Z, waterline v = HZN + HH·F0/Z, in LOCAL WORLD UNITS (origin = the island's waterline
// centre, x right, y down; 1 unit at Z = F0 is 1 px at home). The sea is a plane: its horizon stays at screen y HZN for every camera
// (f = F0). The camera is cam3 { x, y, z } (y up = negative): pushing in = z up; craning up = y down (near islands sink, the horizon stays).
//
// ISLANDS (ISLES, id → index): 'home' (your city, near left) · 'machine' (the Dutch town: the hall with THE CHIP MACHINE + a harbour) ·
// 'savings' (a dense town of warm windows: the savings, off right at home) · 'paris' (a start-up town) · 'dam' (Sweden's north: a dam
// between hills, far) · 'reactor' (France: two cooling towers) · 'cern' (a town with THE RING in the ground) · 'works' (old works,
// sawtooth roofs, brick chimneys: the 100-year-old companies, off left) + 19 small towns out to the horizon.
// Your ROOF is a separate near card (Z_ROOF, home right): you stand on it (thumbnail A).
//
// seaWorld(ctx, c, t, st) st (all optional):
//   lit       0..1 | (i) => 0..1   windows on (default .85)          screens 0..1 | (i) => …   share of lit windows that turn COOL (AI)
//   mark      (i) => 0..1          island i outlined as a piece (cream ring + light)   books 0..1 | (i) => …   a rule booklet over each island
//   links     { u, a }             light threads between neighbouring islands (connected) · threads { u, a } cool threads from beyond the
//             horizon (right) into the islands (foreign AI) · away 0..1 the cool glow beyond the horizon right
//   machine   { a, beam, glow, out 0..1 (rolls out onto the quay), crate, ship 0..1 (on the barge, away right), L } | false
//   ring 0..1 (CERN ring lights) · dam 0..1 (power on the dam + lines) · reactor 0..1 (steam, glow) · savings 0..1 (the savings windows
//   glow) · works 0..1 (old works' windows)
//   moon      { parts (default BLANK), a, glow, stars (ring of 12, default 1), write, loose, x, y, r (design, card Z_MOON) | screen: true
//             (x, y, r in screen px) } | false
//   you       { x, y, h, o (du options), piece: { u 0..1 (in hands), kind, lit, r, rot } } | false   (on the ROOF card)
//   roof      false hides your roof · isle { [id]: (ctx, t) => … } drawn on island id in local units after it · sky(ctx) on the star card
//   far(ctx)  on the horizon card Z_FAR (columns of light) · near(ctx) on the ROOF card after you · fg(ctx) Z_FG
// Returns { moon: [x, y, r] (screen) }.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f69_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, halo, lin, prng } = E;
const { GOLD, COOL, LAMP, PAPER, CREAM, INK, EARTH, F0 } = F;
const TAU = Math.PI * 2;

// ------------------------------------------------------------------------------------------------ seams
export const SEAM_HALF = .5;
export const CREEP = .04;
export const creep = (t, T, phrase, nth = 0) => 1 + CREEP * Math.max(0, t - (T.G(phrase, nth) - SEAM_HALF));
export const TRUCK = 30;
export const trk = (k) => TRUCK * (k - 1) / CREEP;

// ------------------------------------------------------------------------------------------------ geometry
export const HZN = 760, HH = 300, Z_SKY = 40000, Z_MOON = 60000, Z_FAR = 36000, Z_ROOF = 2000, Z_FG = 1150;
export const MOON = { x: 1410, y: 360, r: 255 };                      // thumbnail A (design px on the moon card = screen px at home)
export const ROOF = { x0: 1020, x1: 2900, y: 872, you: 1405 };          // your roof (design px on Z_ROOF): ledge top y, where you stand
const HAZE = mixHex(P.ind0, P.blue0, .38);
// stations (named) + 19 towns; u = design x at home (→ X), Z depth, w = width in world units
const ST = [
  ['home', 'town', -0, 2900, 3000, { dense: 1, tall: 1.2 }],
  ['machine', 'hall', 478, 6000, 2300, {}],
  ['savings', 'town', 2119, 4400, 2400, { dense: 1.4 }],
  ['paris', 'startup', 1682, 8000, 1900, {}],
  ['dam', 'dam', 440, 17000, 3400, {}],
  ['reactor', 'reactor', 1849, 13000, 2600, {}],
  ['cern', 'ring', -42, 9500, 2100, {}],
  ['works', 'works', -468, 5000, 2500, {}],
];
const TOWNS = [[1180, 9000, 1600], [760, 11000, 1800], [1460, 15000, 2400], [230, 13000, 2200], [1010, 19000, 2600], [1760, 21000, 2400],
  [560, 23000, 3000], [1300, 26000, 2800], [90, 27000, 2600], [1600, 30000, 3000], [840, 32000, 3200], [360, 35000, 3000], [1180, 37000, 3400],
  [1900, 34000, 3000], [2150, 12000, 2000], [2400, 20000, 2600], [-260, 18000, 2400], [2050, 26000, 2800], [-150, 32000, 3000]];
export const ISLES = [
  ...ST.map(([id, kind, u, Z, w, o], i) => ({ i, id, kind, u, Z, w, X: (u - W / 2) * Z / F0, seed: 11 + i * 7, ...o })),
  ...TOWNS.map(([u, Z, w], k) => ({ i: ST.length + k, id: 't' + (k + 1), kind: 'town', u, Z, w, X: (u - W / 2) * Z / F0, seed: 101 + k * 13 })),
];
export const ISLE = Object.fromEntries(ISLES.map((s) => [s.id, s]));
export const BY_DEPTH = ISLES.slice().sort((a, b) => b.Z - a.Z);        // far → near
export const isleV = (s) => HZN + HH * F0 / s.Z;                         // design waterline of an island on its card
// a local point of island id (world units from its waterline centre) → design point on its card
export const isleDesign = (id, lx = 0, ly = 0) => { const s = ISLE[id] || ISLES[id]; return [s.u + lx * F0 / s.Z, isleV(s) + ly * F0 / s.Z]; };
// … → screen [x, y, k] (k = px per design px of that card); null if behind the camera
export function islePt(c, id, lx = 0, ly = 0) { const s = ISLE[id] || ISLES[id], [u, v] = isleDesign(id, lx, ly); return E.project(c, s.Z, u, v); }
// the sea plane under the camera (world y, down positive): the camera must stay above it
const seaY = (z) => (HZN - H / 2) * z / F0 + HH;
const keepAbove = (c, gap = 40) => ({ ...c, y: Math.min(c.y, seaY(c.z) - gap) });
// THE camera helper: show local point (lx, ly) of island id at screen (sx, sy), magnified s (1 = as at home)
export function focus(id, lx = 0, ly = -150, s = 1, sx = W / 2, sy = H / 2) {
  const S = ISLE[id] || ISLES[id], [u, v] = isleDesign(id, lx, ly); return keepAbove(E.aim(S.Z, u, v, s, sx, sy));
}
export const HOME = () => E.cam3();
// named cameras (k = creep factor, tr = truck in px): every station framed with the moon upper right and the sea below
export const MACHINE_CAM = (k = 1, tr = 0) => focus('machine', 60 + tr * 6000 / F0 / 2.4, -170, 2.4 * k, 860, 700);
export const SAVINGS_CAM = (k = 1, tr = 0) => focus('savings', tr * 4400 / F0 / 1.7, -150, 1.7 * k, 900, 690);
export const PARIS_CAM = (k = 1, tr = 0) => focus('paris', tr * 8000 / F0 / 2.6, -160, 2.6 * k, 900, 690);
export const ENERGY_CAM = (k = 1, tr = 0) => keepAbove(E.aim(15000, 1150 + tr, 700, 1.25 * k, 960, 640));   // the dam (left, far) + the reactors (right)
export const DAM_CAM = (k = 1, tr = 0) => focus('dam', tr * 17000 / F0 / 3, -260, 3 * k, 900, 680);
export const REACTOR_CAM = (k = 1, tr = 0) => focus('reactor', tr * 13000 / F0 / 2.6, -240, 2.6 * k, 980, 680);
export const CERN_CAM = (k = 1, tr = 0) => focus('cern', tr * 9500 / F0 / 2.2, -120, 2.2 * k, 960, 700);
export const WORKS_CAM = (k = 1, tr = 0) => focus('works', tr * 5000 / F0 / 1.9, -190, 1.9 * k, 1000, 690);
export const ROOF_CAM = (k = 1, tr = 0) => keepAbove(E.aim(Z_ROOF, ROOF.you + tr, ROOF.y - 140, 1.5 * k, 1180, 600));
// the whole archipelago: pulled back and craned up, all 27 lights on screen (the "27 pieces" picture)
export const WIDE_CAM = (k = 1, tr = 0) => E.cam3({ x: 700 + tr * 3, y: -1500, z: -2600 + 3000 * (k - 1) });

// ------------------------------------------------------------------------------------------------ island content (seeded once; numbers only)
const DATA = ISLES.map((s) => {
  const r = prng(s.seed), w = s.w, land = [], blds = [], n = 9;
  for (let k = 0; k <= n; k++) { const x = -w / 2 + w * k / n, e = Math.sin(Math.PI * k / n); land.push([x, -(16 + e * (40 + r() * 70) * (s.kind === 'dam' ? 0 : 1))]); }
  land[0][1] = 6; land[n][1] = 6;
  const dense = s.dense ?? 1, tall = s.tall ?? 1, span0 = s.kind === 'town' || s.kind === 'ring' ? .78 : .5;
  let x = -w * span0 / 2;
  const fill = (x0, x1, hMin, hMax, litP) => {
    let xx = x0;
    while (xx < x1) {
      const bw = (70 + r() * 150) / Math.sqrt(dense), centre = 1 - Math.abs((xx + bw / 2) / (w * .5)), bh = (hMin + r() * (hMax - hMin)) * (.55 + .6 * centre) * tall;
      const cols = Math.max(1, Math.floor(bw / 34)), rows = Math.max(1, Math.floor(bh / 44)), wins = [];
      for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { const q = r(); if (q < litP * dense) wins.push([(i + .5) / cols, (j + .35) / rows, r(), r()]); }
      blds.push({ x: xx, w: bw, h: bh, roof: r(), cols, rows, wins, ph: r() * 6 });
      xx += bw + (r() * 30 - 6) / dense;
    }
  };
  if (s.kind === 'town' || s.kind === 'ring') fill(x, w * span0 / 2, 60, 300, .5);
  else if (s.kind === 'startup') { fill(-w * .32, -w * .02, 80, 260, .45); fill(w * .14, w * .34, 60, 180, .45); }
  else if (s.kind === 'hall') { fill(-w * .46, -w * .26, 60, 170, .4); }
  else if (s.kind === 'reactor') { fill(w * .1, w * .36, 50, 150, .4); }
  else if (s.kind === 'works') { fill(w * .2, w * .4, 60, 160, .45); }
  else if (s.kind === 'dam') { fill(w * .22, w * .4, 40, 110, .5); }
  const near = s.Z < 7000 ? 1 : 0, links = [];
  return { land, blds, near };
});
// neighbour links (each island to its 2 nearest, measured on the home screen and in log depth)
export const LINKS = (() => {
  const out = [], seen = new Set();
  for (const a of ISLES) {
    const d = ISLES.filter((b) => b !== a).map((b) => [Math.hypot((a.u - b.u) / 900, Math.log(a.Z / b.Z) / .45), b]).sort((p, q) => p[0] - q[0]).slice(0, 2);
    for (const [, b] of d) { const key = Math.min(a.i, b.i) + ':' + Math.max(a.i, b.i); if (!seen.has(key)) { seen.add(key); out.push([a.i, b.i]); } }
  }
  return out;
})();
const val = (v, i, d) => (typeof v === 'function' ? v(i) : v ?? d);

// ------------------------------------------------------------------------------------------------ drawing the parts
function landFill(s) { const d = clamp((s.Z - 2500) / 30000); return mixHex(mixHex(P.night1, P.ind1, .35), HAZE, .1 + .62 * Math.sqrt(d)); }
function bldFill(s) { const d = clamp((s.Z - 2500) / 30000); return mixHex(mixHex(P.night0, P.ind1, .25), HAZE, .08 + .6 * Math.sqrt(d)); }
function landPath(D) { const p = new Path2D(); const pts = E.catmull(D.land, 4); p.moveTo(pts[0][0], 8); for (const [x, y] of pts) p.lineTo(x, y); p.lineTo(pts[pts.length - 1][0], 8); p.closePath(); return p; }
const LANDP = DATA.map((D) => landPath(D));

function buildings(ctx, t, s, D, lit, scr, o = {}) {
  const col = bldFill(s), base = -20;
  ctx.fillStyle = col;
  for (const b of D.blds) {
    ctx.fillRect(b.x, base - b.h, b.w, b.h + 24);
    if (b.roof > .62) { ctx.beginPath(); ctx.moveTo(b.x - 3, base - b.h); ctx.lineTo(b.x + b.w / 2, base - b.h - b.w * .34); ctx.lineTo(b.x + b.w + 3, base - b.h); ctx.closePath(); ctx.fill(); }
    else if (b.roof < .08 && b.h > 200) ctx.fillRect(b.x + b.w * .45, base - b.h - 60, 5, 60);
  }
  if (lit <= 0) return;
  const boost = o.boost ?? 0;
  for (const b of D.blds) {
    const cw = b.w / b.cols, rh = b.h / b.rows;
    for (const [u, v, q, q2] of b.wins) {
      const on = clamp(lit * 1.25 - q * .25); if (on <= 0) continue;
      const cool = q2 < scr, fl = .8 + .2 * Math.sin(t * (cool ? 2.1 : .35) + q * 30 + b.ph);
      ctx.fillStyle = cool ? rgba(COOL.body, .9 * on * fl) : rgba(mixHex(LAMP.body, LAMP.core, boost), (.7 + .3 * boost) * on * fl);
      ctx.fillRect(b.x + u * b.w - cw * .2, base - b.h + v * b.h, Math.max(6, cw * .4), Math.max(8, rh * .42));
    }
  }
}
function reflections(ctx, t, s, D, lit, scr) {   // the windows' light on the water: broken horizontal strokes under each lit building
  if (lit <= 0) return;
  for (const b of D.blds) {
    if (!b.wins.length) continue;
    const n = Math.min(1, b.wins.length / 8), coolish = scr > .5;
    for (let k = 0; k < 6; k++) {
      const y = 26 + k * 20, a = .16 * lit * n * (1 - k / 6.5), jx = Math.sin(t * 1.1 + k * 1.7 + b.ph) * 10, ww = b.w * (.5 - k * .05);
      ctx.fillStyle = rgba(coolish ? COOL.body : LAMP.body, a); ctx.fillRect(b.x + b.w / 2 - ww / 2 + jx, y, ww, 5);
    }
  }
}
// THE MACHINE ISLAND: a long hall with a sawtooth roof, the door open on THE CHIP MACHINE (cool light inside), a quay + 2 harbour cranes right
export const HALL = { x0: -520, x1: 460, h: 250, door: [-300, 260], quay: 560, mL: 520 };
function hall(ctx, t, s, st) {
  const col = bldFill(s), m = st.machine === false ? null : st.machine ?? {}, base = -22, A = HALL;
  ctx.fillStyle = col; ctx.fillRect(A.x0, base - A.h, A.x1 - A.x0, A.h + 24);
  ctx.beginPath(); for (let k = 0; k < 7; k++) { const x = A.x0 + k * (A.x1 - A.x0) / 7; ctx.moveTo(x, base - A.h); ctx.lineTo(x + (A.x1 - A.x0) / 7, base - A.h - 70); ctx.lineTo(x + (A.x1 - A.x0) / 7, base - A.h); } ctx.fill();
  const g = m ? (m.glow ?? 1) : .3, [d0, d1] = A.door, dh = A.h * .78;
  ctx.fillStyle = lin(ctx, 0, base - dh, 0, base, [[0, mixHex(P.night1, COOL.deep, .5 + .3 * g)], [1, mixHex(COOL.deep, COOL.body, .35 * g)]]); ctx.fillRect(d0, base - dh, d1 - d0, dh);
  halo(ctx, (d0 + d1) / 2, base - dh * .4, (d1 - d0) * .9, .25 * g, COOL.halo, COOL.core);
  ctx.fillStyle = col; for (let k = 1; k < 4; k++) ctx.fillRect(d0 + k * (d1 - d0) / 4 - 3, base - dh, 6, dh * .12);
  // quay + cranes (right)
  ctx.fillStyle = mixHex(col, P.blue1, .15); ctx.fillRect(A.x1, base - 8, A.quay + 380 - A.x1, 14);
  for (const cx of [A.quay + 120, A.quay + 300]) {
    ctx.fillRect(cx - 6, base - 330, 12, 330); ctx.fillRect(cx - 140, base - 330, 230, 10); ctx.fillRect(cx - 140, base - 330, 8, 60);
    halo(ctx, cx + 86, base - 334, 30, .5, LAMP.body, LAMP.core);
  }
  if (!m) return;
  const L = m.L ?? A.mL, out = sineIO(clamp(m.out ?? 0)), ship = clamp(m.ship ?? 0), sh = ship * ship;
  const mx = lerp((d0 + d1) / 2, A.quay + 180, out) + sh * 5200, my = base + (ship > 0 ? 10 : 0);
  if (ship > 0) F.barge(ctx, t, mx, my + 16, L * 1.25, {});
  F.chipMachine(ctx, t, mx, my, L, { beam: m.beam ?? 0, glow: g, wheels: out > 0 && ship <= 0, crate: m.crate ?? 0, a: m.a ?? 1 });
}
function dam(ctx, t, s, st) {   // two hills, a curved dam between them, lights along its crest; pylons with lines (power) running right
  const col = landFill(s), u = clamp(st.dam ?? .4);
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.moveTo(-1700, 10); ctx.bezierCurveTo(-1300, -200, -900, -620, -520, -640); ctx.bezierCurveTo(-400, -640, -360, -520, -330, -380); ctx.lineTo(-330, 10); ctx.fill();
  ctx.beginPath(); ctx.moveTo(1700, 10); ctx.bezierCurveTo(1300, -160, 900, -560, 520, -600); ctx.bezierCurveTo(400, -600, 360, -500, 330, -380); ctx.lineTo(330, 10); ctx.fill();
  ctx.fillStyle = mixHex(col, PAPER.shade, .18); ctx.beginPath(); ctx.moveTo(-340, -400); ctx.quadraticCurveTo(0, -380, 340, -400); ctx.lineTo(300, 10); ctx.quadraticCurveTo(0, 30, -300, 10); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(COOL.line, .25 + .4 * u); for (let k = 0; k < 4; k++) ctx.fillRect(-240 + k * 150, -250, 36, 260);   // spillways: water light
  for (let k = 0; k <= 8; k++) halo(ctx, -320 + k * 80, -404, 40, (.25 + .5 * u) * (.8 + .2 * Math.sin(t * 1.4 + k)), LAMP.body, LAMP.core);
  ctx.strokeStyle = rgba(CREAM, .18 + .35 * u); ctx.lineWidth = 6; ctx.fillStyle = col;
  for (let k = 0; k < 3; k++) { const px = 700 + k * 380, ph = -300 + k * 60; ctx.fillRect(px - 8, ph, 16, -ph + 10); ctx.fillRect(px - 50, ph, 100, 10); }
  ctx.beginPath(); ctx.moveTo(330, -330); for (let k = 0; k < 3; k++) { const px = 700 + k * 380, ph = -300 + k * 60; ctx.quadraticCurveTo(px - 190, ph + 70, px, ph); } ctx.stroke();
}
function reactor(ctx, t, s, st) {   // two cooling towers (curved), slow cream steam, a warm glow at their feet
  const col = bldFill(s), u = clamp(st.reactor ?? .5);
  for (const [cx, h, w] of [[-520, 560, 300], [-120, 500, 270]]) {
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(cx - w / 2, -10); ctx.quadraticCurveTo(cx - w * .26, -h * .62, cx - w * .32, -h); ctx.lineTo(cx + w * .32, -h); ctx.quadraticCurveTo(cx + w * .26, -h * .62, cx + w / 2, -10); ctx.closePath(); ctx.fill();
    for (let k = 0; k < 5; k++) {   // steam: soft cream ovals rising and drifting right (away is right)
      const ph = (t * .05 + k / 5) % 1, sx = cx + ph * 260 + Math.sin(t * .3 + k) * 20, sy = -h - 40 - ph * 520, rr = w * (.3 + ph * .7);
      ctx.fillStyle = rgba(mixHex(CREAM, P.blue1, .45), .12 * (1 - ph) * (.4 + .6 * u)); ctx.beginPath(); ctx.ellipse(sx, sy, rr, rr * .55, 0, 0, TAU); ctx.fill();
    }
    halo(ctx, cx, -30, w * .9, .2 * u, LAMP.body, LAMP.core);
  }
}
function works(ctx, t, s, st) {   // the old works: long sawtooth halls, three brick chimneys, warm old windows (100+ years)
  const col = mixHex(bldFill(s), EARTH.body, .28), u = clamp(st.works ?? .5);
  ctx.fillStyle = col;
  for (const [x0, x1, h] of [[-1000, -380, 200], [-360, 300, 240]]) {
    ctx.fillRect(x0, -22 - h, x1 - x0, h + 24);
    ctx.beginPath(); const n = Math.round((x1 - x0) / 110); for (let k = 0; k < n; k++) { const x = x0 + k * (x1 - x0) / n; ctx.moveTo(x, -22 - h); ctx.lineTo(x + (x1 - x0) / n, -22 - h - 60); ctx.lineTo(x + (x1 - x0) / n, -22 - h); } ctx.fill();
    for (let k = 0; k < n; k++) { const x = x0 + (k + .5) * (x1 - x0) / n; ctx.fillStyle = rgba(LAMP.body, (.3 + .55 * u) * (.85 + .15 * Math.sin(t * .4 + k))); ctx.fillRect(x - 20, -22 - h * .72, 40, h * .42); ctx.fillStyle = col; }
  }
  ctx.fillStyle = mixHex(col, EARTH.warm, .2);
  for (const [cx, h] of [[-820, 620], [-520, 700], [-60, 560]]) { ctx.beginPath(); ctx.moveTo(cx - 34, -20); ctx.lineTo(cx - 22, -h); ctx.lineTo(cx + 22, -h); ctx.lineTo(cx + 34, -20); ctx.closePath(); ctx.fill(); ctx.fillRect(cx - 28, -h - 18, 56, 18); }
}
function startup(ctx, t, s, st) {   // a small modern block with big glass (lit), the founders' window
  const col = bldFill(s);
  ctx.fillStyle = col; ctx.fillRect(-40, -22 - 300, 240, 324);
  for (let j = 0; j < 5; j++) for (let i = 0; i < 3; i++) { ctx.fillStyle = rgba(LAMP.body, (.45 + .35 * ((i + j) % 2)) * (.85 + .15 * Math.sin(t * .5 + i + j))); ctx.fillRect(-20 + i * 74, -300 + j * 56, 56, 38); }
}
function ring(ctx, t, s, u) {   // CERN: the ring lies in the ground under the island and the water around it (flattened ellipse)
  if (u <= 0) return;
  const rx = s.w * .62, ry = rx * .11;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = rgba(CREAM, .5 * u); ctx.lineWidth = 10; ctx.setLineDash([60, 30]); ctx.lineDashOffset = -t * 60;
  ctx.beginPath(); ctx.ellipse(0, 20, rx, ry, 0, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
  ctx.lineWidth = 26; ctx.strokeStyle = rgba(LAMP.body, .12 * u); ctx.beginPath(); ctx.ellipse(0, 20, rx, ry, 0, 0, TAU); ctx.stroke();
  ctx.restore();
}
function markRing(ctx, t, s, u) {   // island i as ONE PIECE: a cream ring on the water + a light that flares once
  if (u <= 0) return;
  const rx = s.w * .58, ry = rx * .14, k = expoOut(u);
  ctx.save(); ctx.strokeStyle = rgba(CREAM, .55 * clamp(u * 2)); ctx.lineWidth = Math.max(3, s.Z / 1700 * 1.6);
  ctx.beginPath(); ctx.ellipse(0, 10, rx * (.85 + .15 * k), ry * (.85 + .15 * k), 0, 0, TAU); ctx.stroke(); ctx.restore();
  halo(ctx, 0, -120, s.w * .5, .22 * Math.sin(Math.PI * clamp(u)), LAMP.body, LAMP.core);
}

// ------------------------------------------------------------------------------------------------ one island
function island(ctx, c, t, s, st) {
  const m = E.cardM(c, s.Z); if (!m) return false;
  const hw = s.w * .7 * F0 / s.Z * m.k, cx = m.e + s.u * m.k; if (cx + hw < -120 || cx - hw > W + 120) return false;
  const D = DATA[s.i], lit = val(st.lit, s.i, .85), scr = val(st.screens, s.i, 0), v = isleV(s);
  E.card(ctx, c, s.Z, () => {
    ctx.save(); ctx.translate(s.u, v); ctx.scale(F0 / s.Z, F0 / s.Z);
    reflections(ctx, t, s, D, lit, scr);
    if (s.kind === 'ring') ring(ctx, t, s, clamp(st.ring ?? 0));
    if (s.kind === 'dam') dam(ctx, t, s, st);
    ctx.fillStyle = landFill(s); ctx.fill(LANDP[s.i]);
    ctx.fillStyle = rgba(INK.rim, .16); ctx.fillRect(-s.w * .46, -2, s.w * .92, 3);   // a moonlit lip on the water line
    if (s.kind === 'reactor') reactor(ctx, t, s, st);
    if (s.kind === 'works') works(ctx, t, s, st);
    if (s.kind === 'startup') startup(ctx, t, s, st);
    buildings(ctx, t, s, D, lit, scr, { boost: s.id === 'savings' ? clamp(st.savings ?? 0) : 0 });
    if (s.kind === 'hall') hall(ctx, t, s, st);
    markRing(ctx, t, s, val(st.mark, s.i, 0));
    const bk = val(st.books, s.i, 0);
    if (bk > 0) F.ruleBook(ctx, t, (s.i % 3 - 1) * 60, -480 - (s.i % 4) * 30, 150 * Math.pow(Math.max(1, s.Z / 7000), .7), { u: bk, seed: s.i, rot: (s.i % 5 - 2) * .05 });
    if (st.isle?.[s.id]) st.isle[s.id](ctx, t);
    ctx.restore();
  });
  return true;
}
// a screen point on top of island i (for threads and links)
function topPt(c, s) { return islePt(c, s.i, 0, -180); }

// ------------------------------------------------------------------------------------------------ the world
export function seaWorld(ctx, c, t, st = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, HZN, [[0, P.night0], [.5, mixHex(P.night1, P.ind0, .5)], [1, mixHex(P.ind1, P.blue0, .32)]]); ctx.fillRect(0, 0, W, HZN + 2);
  ctx.restore();
  E.card(ctx, c, Z_SKY, () => { E.stars(ctx, 69, 260, t, [-4000, -1600, 12000, 2300], .8); if (st.sky) st.sky(ctx); });
  // the puzzle moon
  let moon = null;
  if (st.moon !== false) {
    const mo = st.moon ?? {}, parts = mo.parts ?? F.BLANK;
    const draw = (cx, cy, r) => F.kitDisc(ctx, t, cx, cy, r, parts, { a: mo.a ?? 1, glow: mo.glow ?? 1, stars: mo.stars ?? 1, write: mo.write ?? 1, loose: mo.loose ?? false });
    if (mo.screen) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); draw(mo.x ?? MOON.x, mo.y ?? MOON.y, mo.r ?? MOON.r); ctx.restore(); moon = [mo.x ?? MOON.x, mo.y ?? MOON.y, mo.r ?? MOON.r]; }
    else { E.card(ctx, c, Z_MOON, () => draw(mo.x ?? MOON.x, mo.y ?? MOON.y, mo.r ?? MOON.r)); const p = E.project(c, Z_MOON, mo.x ?? MOON.x, mo.y ?? MOON.y); moon = p ? [p[0], p[1], (mo.r ?? MOON.r) * p[2]] : null; }
  }
  // the sea (screen space: its horizon is fixed) + the moon's path on the water + "elsewhere" beyond the horizon right
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, HZN, 0, H, [[0, mixHex(P.ind0, P.blue0, .3)], [.25, mixHex(P.night1, P.ind0, .55)], [1, P.night0]]); ctx.fillRect(0, HZN, W, H - HZN);
  ctx.fillStyle = rgba(mixHex(P.blue0, CREAM, .3), .22); ctx.fillRect(0, HZN - 1, W, 2);
  const away = clamp(st.away ?? .25); if (away > 0) { halo(ctx, W + 120, HZN - 10, 900, .3 * away, COOL.halo, COOL.core); }
  if (moon) {
    const gold = (st.moon?.parts ?? F.BLANK).reduce((a, p) => a + (p.kind === 'gold' ? 1 : p.kind === 'half' ? .6 * clamp(p.u) : 0), 0) / 4, ga = (.12 + .5 * gold) * (st.moon?.a ?? 1);
    for (let k = 0; k < 16; k++) {
      const f = k / 15, y = HZN + 8 + f * f * (H - HZN - 8), w = 20 + f * moon[2] * 1.1, jx = Math.sin(t * 1.3 + k * 2.3) * (6 + f * 30);
      ctx.fillStyle = rgba(gold > .3 ? GOLD.line : COOL.line, ga * (1 - f * .6) * (.7 + .3 * Math.sin(t * 2 + k))); ctx.fillRect(moon[0] - w / 2 + jx, y, w, 3 + f * 5);
    }
  }
  ctx.restore();
  if (st.far) E.card(ctx, c, Z_FAR, () => st.far(ctx));
  // threads from beyond the horizon (right) into the islands: foreign AI reaching in (COOL)
  const th = st.threads;
  if (th && (th.u ?? 0) > 0) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    for (const s of ISLES) {
      const p = topPt(c, s); if (!p || p[0] < -100 || p[0] > W + 100) continue;
      const u = clamp((th.u ?? 0) * 1.6 - (1 - s.u / W) * .5), o0 = [W + 60, HZN - 40 - (s.i % 5) * 18]; if (u <= 0) continue;
      const mx = (o0[0] + p[0]) / 2, my = Math.min(o0[1], p[1]) - 140 - (s.i % 4) * 40;
      ctx.strokeStyle = rgba(COOL.body, (th.a ?? .5) * .5); ctx.lineWidth = Math.max(1.2, 2.4 * Math.min(1, p[2] * 2));
      ctx.beginPath(); ctx.moveTo(o0[0], o0[1]); const n = 24; for (let k = 1; k <= Math.round(n * u); k++) { const q = k / n, a = (1 - q) * (1 - q), b = 2 * q * (1 - q), d = q * q; ctx.lineTo(a * o0[0] + b * mx + d * p[0], a * o0[1] + b * my + d * p[1]); } ctx.stroke();
    }
    ctx.restore();
  }
  for (const s of BY_DEPTH) if (s.Z > c.z + 30) island(ctx, c, t, s, st);
  // links between neighbours: the pieces connected (LAMP threads)
  const lk = st.links;
  if (lk && (lk.u ?? 0) > 0) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    LINKS.forEach(([i, j], n) => {
      const A = topPt(c, ISLES[i]), B = topPt(c, ISLES[j]); if (!A || !B) return;
      const u = clamp((lk.u ?? 0) * 1.5 - (n / LINKS.length) * .5); if (u <= 0) return;
      const mx = (A[0] + B[0]) / 2, my = Math.min(A[1], B[1]) - 30 - Math.abs(A[0] - B[0]) * .08;
      ctx.strokeStyle = rgba(LAMP.body, (lk.a ?? .6) * .7); ctx.lineWidth = Math.max(1.2, 2.2 * Math.min(1, (A[2] + B[2])));
      ctx.beginPath(); ctx.moveTo(A[0], A[1]); const N = 20; for (let k = 1; k <= Math.round(N * u); k++) { const q = k / N, a = (1 - q) * (1 - q), b = 2 * q * (1 - q), d = q * q; ctx.lineTo(a * A[0] + b * mx + d * B[0], a * A[1] + b * my + d * B[1]); } ctx.stroke();
    });
    ctx.restore();
  }
  // your roof (near card) + you
  if (st.roof !== false) E.card(ctx, c, Z_ROOF, () => { roof(ctx, t); if (st.you !== false) you(ctx, t, st.you ?? {}); if (st.near) st.near(ctx); });
  if (st.fg) E.card(ctx, c, Z_FG, st.fg);
  return { moon };
}
function roof(ctx, t) {   // a flat roof ledge at the right (thumbnail A), a small parapet, a chimney stack, a few windows below
  const R = ROOF, col = mixHex(P.night0, P.ind1, .3);
  ctx.fillStyle = col; ctx.fillRect(R.x0, R.y, R.x1 - R.x0, 900);
  ctx.fillStyle = mixHex(col, P.blue1, .25); ctx.fillRect(R.x0 - 10, R.y - 12, R.x1 - R.x0 + 10, 14);
  ctx.fillStyle = rgba(mixHex(GOLD.line, P.blue1, .45), .5); ctx.fillRect(R.x0 - 10, R.y - 12, R.x1 - R.x0 + 10, 2);   // moon rim on the ledge
  ctx.fillStyle = col; ctx.fillRect(R.x0 + 520, R.y - 92, 70, 82); ctx.fillRect(R.x0 + 510, R.y - 100, 90, 12);
}
function you(ctx, t, y) {   // YOU (yellow coat) on the roof; o.piece: THE MINDS piece in your hands, held up (thumbnail A)
  const x = y.x ?? ROOF.you, base = y.y ?? ROOF.y - 12, h = y.h ?? 190, pu = clamp(y.piece?.u ?? 0);
  const pose = pu > 0 ? { armR: [lerp(.2, 2.85, pu), lerp(.1, 3.05, pu)], armL: [lerp(-.2, -2.7, pu), lerp(-.1, -3.0, pu)], look: lerp(.3, 1, pu) } : {};
  const hands = E.du(ctx, x, base, h, { light: 1, back: .25, dir: 1, look: .7, ...pose, ...(y.o ?? {}) });
  if (pu > 0 && hands?.R && hands?.L) {
    const hx = (hands.R[0] + hands.L[0]) / 2, hy = Math.min(hands.R[1], hands.L[1]), r = y.piece.r ?? 150;
    F.loosePiece(ctx, t, 4, hx + r * .02, hy - r * .2, r, { kind: y.piece.kind ?? 'gold', lit: y.piece.lit ?? 0, rot: y.piece.rot ?? -.55, a: clamp(pu * 3), glow: y.piece.glow ?? 1 });
  }
  return hands;
}

// ------------------------------------------------------------------------------------------------ the seam plates
// A plate is the EXACT picture at a group boundary. The handing side steers its last move so its frame converges to the plate and draws
// the plate for t in [T0 − .5, T0); the receiving side draws the same plate for t in [T0, T0 + .5) and grows its next picture out of it.
// Plates keep a slow push (CREEP 4 %/s from T0 − .5); the receiving side continues it. All three plates are on THE PLAN SHEET (explainer
// ground, lib/f69_explain.mjs), not in the Leitbild world:
//   Lead → B1 at T.G('Those chip machines') (c01 → c02): plateMachine   THE CHIP MACHINE, big, side view, centred on the plan sheet (its
//            line drawing from the plan has grown to full size): cool windows, the light path on. No text. B1 pulls back: the hall, the
//            Dutch town (ASML · VELDHOVEN), then the bus and the three cargo jets.
//   B1 → B2  at T.G('None of it runs') (c05 → c06): plateEnergy   THE PLAN, big: the disc centred (r 250) with the honest state (money
//            HALFWAY, rules ON PAPER), piece 3 THE ENERGY pulsing; the HUD is hidden (the disc IS the HUD here). B2 pushes into piece 3,
//            it opens on the data centre with its thick cables ("Fach 3 wird groß").
//   B2 → B3  at T.G('So suppose all five') (c08 → c09): plateFour   THE PLAN, big: the four placed parts lit (2 HALFWAY, 2 ON PAPER), THE
//            MINDS piece lying next to the disc (open). B3 draws the second race track out of the disc's rim.
import * as X from './f69_explain.mjs';
export const momentParts = (T, t) => F.kitParts(T, t).parts;
export const PLATE_DISC = { x: W / 2, y: 470, r: 250 };
export function plateMachine(ctx, t, T) {
  const k = creep(t, T, 'Those chip machines'), v = { x: W / 2, y: 520, s: k };
  X.sheet(ctx, t, v, { lx: W / 2, ly: 470 });
  X.inView(ctx, v, () => F.chipMachine(ctx, t, W / 2, 700, 1100, { beam: 1, glow: 1 }));
}
function plateDisc(ctx, t, T, phrase, lit) {
  const k = creep(t, T, phrase), v = { x: W / 2, y: H / 2, s: k }, D = PLATE_DISC;
  X.sheet(ctx, t, v, { lx: D.x, ly: D.y });
  const parts = momentParts(T, t).map((p, i) => (i === lit ? { ...p, lit: 1 } : p));
  X.inView(ctx, v, () => F.kitDisc(ctx, t, D.x, D.y, D.r, parts, { glow: .8, stars: 0, loose: { x: D.x + D.r * 1.32, y: D.y + D.r * 1.06, rot: .35 } }));
}
export const plateEnergy = (ctx, t, T) => plateDisc(ctx, t, T, 'None of it runs', 2);
export const plateFour = (ctx, t, T) => plateDisc(ctx, t, T, 'So suppose all five', -1);

// ------------------------------------------------------------------------------------------------ the end screen (last 15 s)
// The final picture: thumbnail A again, calm and honest. The moon centred high (money + energy HALFWAY, rules + lab ON PAPER, the minds
// slot OPEN), the 27 islands lit and linked, you small on the roof in the middle, lifting THE MINDS piece (cream: not won yet) towards
// the gap. Lower half calm for the two YouTube tiles + the subscribe circle. A slow pull-back, nothing else moves but light.
export const END_TILES = { left: { x: 80, y: 600, w: 640, h: 360 }, right: { x: 1200, y: 600, w: 640, h: 360 }, sub: { x: 960, y: 900, r: 80 } };
export const END_PARTS = F.KIT.parts.map((p) => ({ kind: p.kind, u: 1, lit: 0 }));
export function endScreen(ctx, t, T) {
  const t0 = T.duration - 15, q = Math.max(0, t - t0), k = 1 - .006 * q;
  const c = keepAbove(E.aim(Z_ROOF, ROOF.you + 30, ROOF.y - 200, .92 * k, 960, 600));
  seaWorld(ctx, c, t, { moon: { parts: END_PARTS, screen: true, x: 960, y: 270, r: 170, glow: .9 }, links: { u: 1, a: .45 }, lit: .9, away: .2,
    you: { h: 150, piece: { u: 1, kind: 'blank', lit: 1, r: 120, glow: .6 } } });
}
