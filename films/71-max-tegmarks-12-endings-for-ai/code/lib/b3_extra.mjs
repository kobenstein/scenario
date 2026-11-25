// Film 71 · B3 helpers (c12 + c13): additive only, the shared kit (lib/f71_kit.mjs, lib/f71_world.mjs) stays untouched.
//   arcDoors(ctx, t, v, o)     the Leitbild arc of twelve (thumbnail A) drawn with per-door overrides (position, colour, seed) so the ranked row
//                              can morph into it (1.01) without a seed pop inside the doors.
//   kitchenWindows(rc)         the 24 windows of the houses across the kitchen window (S.rooms), in screen px for room view rc (1.06 → 1.07).
//   MALTA                      the island outline (Malta, Comino, Gozo) + the citizen dots (seeded), in local px around (0, 0).
//   planScene(ctx, t, T, v, o) THE TWELVE FROM ABOVE (1.14 – S.03): door slabs seen from above at (rowX(n), PLAN.y), a fan of tracks from you,
//                              a lever on every branch.
//   tableFigures, coinStack, shield, headline, contract, crowd: small explainer objects.
import * as F from './f71_kit.mjs';
import * as S from './f71_world.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, halo, lin, rad, prng, GOLD, CREAM, CREAM2, COOL, PAPER, LAMP } = F;
const TAU = Math.PI * 2;

// ------------------------------------------------------------------------------------------------ the Leitbild arc (own copy: seeds per rank)
// o: { doors: (i) => { x, y, w, h, col, lit, open, inner, a, seed, halo, beamA }, beams 0..1, stars 0..1, plainA 0..1 (the plain over the yard), you }
export function arcDoors(ctx, t, v, o = {}) {
  const ds = Array.from({ length: 12 }, (_, i) => ({ ...S.slotDoor(i), seed: i, ...(o.doors ? o.doors(i) || {} : {}) }));
  F.inView(ctx, v, () => {
    const bm = o.beams ?? 1;
    for (let i = 0; i < 12; i++) { const d = ds[i]; if ((d.a ?? 1) > 0 && bm > 0) S.beam(ctx, d.x, d.y, d.w, d.col, bm * (d.beamA ?? (i === S.GOLD_SLOT ? 1.55 : .9)) * (d.a ?? 1) * d.lit); }
    for (let i = 0; i < 12; i++) {
      const d = ds[i]; if ((d.a ?? 1) <= 0) continue;
      F.door(ctx, t, d.x, d.y, d.w, d.h, { col: d.col, lit: d.lit, beam: d.beam ?? 0, seed: d.seed, a: d.a, open: d.open, inner: d.inner, halo: d.halo ?? (i === S.GOLD_SLOT ? 1.3 : .8), frame: d.frame ?? 0 });
    }
  });
  return ds;
}

// ------------------------------------------------------------------------------------------------ the kitchen windows (S.rooms HOUSES, replicated)
const HOUSES = (() => { const r = prng(7111); return Array.from({ length: 6 }, (_, i) => ({ x: 1050 + i * 100 + r() * 20, w: 80 + r() * 30, h: 90 + r() * 70, win: Array.from({ length: 4 }, () => [r(), r()]) })); })();
export function kitchenWindows(rc) {
  const out = [], by = 170 + 450;
  HOUSES.forEach((hs) => hs.win.forEach(([a, b]) => {
    const x = hs.x + 10 + a * (hs.w - 34), y = by - hs.h + 16 + b * (hs.h - 46);
    if (x < 1080 || x + 14 > 1600) return;   // clipped by the window frame
    out.push({ x: W / 2 + (x + 7 - rc.x) * rc.s, y: H / 2 + (y + 9 - rc.y) * rc.s, w: 14 * rc.s, h: 18 * rc.s });
  }));
  return out;
}

// ------------------------------------------------------------------------------------------------ MALTA (a small island outline: the one map exception, MOTION §6)
const U = 22;   // px per unit (1 unit ≈ 1 km)
const MALTA_PTS = [[0, 0], [2.5, -1.6], [5.5, -2.6], [9, -3.2], [12, -3.1], [14.6, -2.2], [16.8, -.6], [19.2, 1.2], [21.6, 3], [23.8, 4.9], [25.6, 7.1], [25.2, 9.2], [23, 10.6], [20.2, 11.6], [17, 12], [13.6, 11.5], [10.4, 10.2], [7.3, 8.6], [4.6, 6.6], [2.4, 4.4], [.8, 2.2]];
const GOZO_PTS = [[-14.4, -9.4], [-11.6, -11.4], [-7.6, -12.4], [-4.2, -12.1], [-1.9, -10.7], [-1.4, -8.6], [-3, -6.9], [-6.4, -6.1], [-10, -6.3], [-13, -7.4]];
const COMINO = [-1.1, -4.6, .9];
const CX = 6, CY = -.4;
const toPx = ([x, y]) => [(x - CX) * U, (y - CY) * U];
export const MALTA = { malta: MALTA_PTS.map(toPx), gozo: GOZO_PTS.map(toPx), comino: [(COMINO[0] - CX) * U, (COMINO[1] - CY) * U, COMINO[2] * U] };
function inPoly(p, x, y) { let c = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) { const [xi, yi] = p[i], [xj, yj] = p[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; }
MALTA.dots = (() => {
  const r = prng(7171), pts = [], polys = [MALTA.malta, MALTA.gozo];
  let guard = 0;
  while (pts.length < 230 && guard++ < 40000) {
    const x = -470 + r() * 940, y = -280 + r() * 560;
    if (!polys.some((p) => inPoly(p, x, y))) continue;
    if (pts.some(([a, b]) => (a - x) ** 2 + (b - y) ** 2 < 15 * 15)) continue;
    pts.push([x, y, r(), r() * TAU]);
  }
  return pts;
})();
export function maltaShape(ctx, u, o = {}) {
  if (u <= 0) return;
  ctx.save(); ctx.globalAlpha *= clamp(u * 2);
  for (const p of [MALTA.malta, MALTA.gozo]) {
    ctx.beginPath(); p.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath();
    ctx.fillStyle = rgba(P.ind1, .55); ctx.fill();
    const per = p.reduce((s, q, i) => s + Math.hypot(q[0] - p[(i + 1) % p.length][0], q[1] - p[(i + 1) % p.length][1]), 0);
    ctx.setLineDash([per * expoOut(clamp(u)), per]); ctx.strokeStyle = rgba(CREAM, .55 * (o.a ?? 1)); ctx.lineWidth = 2.2; ctx.stroke(); ctx.setLineDash([]);
  }
  ctx.beginPath(); ctx.arc(MALTA.comino[0], MALTA.comino[1], MALTA.comino[2] * expoOut(clamp(u)), 0, TAU); ctx.fillStyle = rgba(P.ind1, .55); ctx.fill(); ctx.strokeStyle = rgba(CREAM, .5); ctx.stroke();
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ THE TWELVE FROM ABOVE (plan)
export const PLAN = { y: 200, you: [960, 830], split: [960, 690], levU: .64 };
export const branch = (n) => F.bez(PLAN.split, [PLAN.split[0], 520], [F.rowX(n), 470], [F.rowX(n), PLAN.y + 22], 30);
export const ptOn = (pts, u) => { const k = clamp(u) * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(k)), f = k - i; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; };
// a door seen from above: a lit slab (the threshold), light spilling toward the viewer (down)
export function slab(ctx, t, x, y, n, lit, a = 1, o = {}) {
  if (a <= 0) return;
  const col = o.col ?? F.END[n].col, w = o.w ?? F.ROW.w, d = o.d ?? 16;
  ctx.save(); ctx.globalAlpha *= a;
  halo(ctx, x, y, w * 1.4, .28 * lit, col, mixHex(col, '#ffffff', .6));
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = lin(ctx, 0, y, 0, y + 150, [[0, rgba(col, .32 * lit)], [1, rgba(col, 0)]]);
  ctx.beginPath(); ctx.moveTo(x - w / 2, y + d / 2); ctx.lineTo(x + w / 2, y + d / 2); ctx.lineTo(x + w * .9, y + 150); ctx.lineTo(x - w * .9, y + 150); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.fillStyle = mixHex(mixHex(P.night1, col, .35), mixHex(col, '#ffffff', .45), lit); ctx.fillRect(x - w / 2, y - d / 2, w, d);
  ctx.strokeStyle = rgba(mixHex(P.night0, col, .3), .9); ctx.lineWidth = 2.5; ctx.strokeRect(x - w / 2, y - d / 2, w, d);
  ctx.restore();
}
// o: { slabs: (n) => { lit, a }, fan 0..1 (the tracks draw on from you), fanA, lev: (n) => ang, levA, you 0..1, pulse 0..1 (a lamp pulse up the trunk) }
export function planScene(ctx, t, v, o = {}) {
  F.inView(ctx, v, () => {
    for (const e of F.ENDINGS) { const s = o.slabs ? o.slabs(e.n) : { lit: .6, a: 1 }; slab(ctx, t, F.rowX(e.n), PLAN.y, e.n, s.lit ?? .6, s.a ?? 1); }
    const fu = o.fan ?? 0;
    if (fu > 0) {
      F.track(ctx, [PLAN.you, PLAN.split], span(fu, 0, .3), { gap: 16, a: o.fanA ?? .9 });
      for (const e of F.ENDINGS) {
        const k = Math.abs(e.n - 6.5) / 5.5, u = span(fu, .25 + k * .1, .85 + k * .15);
        F.track(ctx, branch(e.n), u, { gap: 12, a: (o.fanA ?? .9) * .75, lw: 2.2, col: e.n === 1 ? mixHex(CREAM, GOLD.line, .4) : CREAM });
        const la = span(u, .7, 1) * (o.levA ?? 1);
        if (la > 0) { const [lx, ly] = ptOn(branch(e.n), PLAN.levU); F.lever(ctx, t, lx + 18, ly, o.lev ? o.lev(e.n) : .45, 26, { a: la, knob: o.knob ? o.knob(e.n) : 0 }); }
      }
    }
    const pu = o.pulse ?? 0;
    if (pu > 0) { const y = lerp(PLAN.you[1], PLAN.split[1], sineIO(clamp(pu))); halo(ctx, PLAN.you[0], y, 60, .55 * clamp(o.pulseA ?? 1), LAMP.body, LAMP.core); ctx.fillStyle = rgba(LAMP.core, .95 * clamp(o.pulseA ?? 1)); ctx.beginPath(); ctx.arc(PLAN.you[0], y, 7, 0, TAU); ctx.fill(); }
    if ((o.you ?? 1) > 0) { ctx.save(); ctx.globalAlpha *= o.you ?? 1; F.du(ctx, PLAN.you[0], PLAN.you[1] + 52, 56, { hood: false, view: 'back', look: .3 + .05 * Math.sin(t * .5), light: 1, back: .5 }); ctx.restore(); }
  });
}

// ------------------------------------------------------------------------------------------------ small explainer objects
// a stack of coins (gold: the hope ending's income), x = centre, y = the surface, s = coin width, n coins, u = rise
export function coinStack(ctx, x, y, s, n, u, o = {}) {
  if (u <= 0) return;
  const col = o.col ?? GOLD.body;
  ctx.save(); ctx.globalAlpha *= clamp(u * 3) * (o.a ?? 1);
  for (let i = 0; i < n; i++) {
    const k = expoOut(clamp(u * 1.6 - i * .2)); if (k <= 0) continue;
    const yy = y - i * s * .22 - (1 - k) * s * .8;
    if (o.dash) { ctx.setLineDash([4, 4]); ctx.strokeStyle = rgba(CREAM, .7); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(x, yy, s / 2, s * .14, 0, 0, TAU); ctx.stroke(); ctx.setLineDash([]); continue; }
    ctx.fillStyle = mixHex(col, GOLD.deep, .45); ctx.beginPath(); ctx.ellipse(x, yy + s * .05, s / 2, s * .14, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = mixHex(col, GOLD.hot, .3); ctx.beginPath(); ctx.ellipse(x, yy, s / 2, s * .14, 0, 0, TAU); ctx.fill();
  }
  ctx.restore();
}
// the three at one table in front of the gold door (plain coords): human, cyborg, uploaded mind. u: [human, cyborg, upload] 0..1
export function tableFigures(ctx, t, cx, y, u) {
  const xs = [cx - 112, cx, cx + 112];
  // human
  if (u[0] > 0) { ctx.save(); ctx.globalAlpha *= clamp(u[0] * 2); F.person(ctx, xs[0], y + 48 - (1 - expoOut(u[0])) * 10, 112, { dir: 1, light: 1, back: 1, look: .15 }); ctx.restore(); }
  // cyborg: a person with a machine ring at the temple and a cool forearm
  if (u[1] > 0) {
    ctx.save(); ctx.globalAlpha *= clamp(u[1] * 2); const dy = -(1 - expoOut(u[1])) * 10;
    const hands = F.person(ctx, xs[1], y + 48 + dy, 112, { dir: -1, light: 1, back: 1, look: .1 });
    F.agentGlyph(ctx, t, xs[1] + 8, y - 50 + dy, 7, { col: COOL.body, ping: .5 });
    ctx.strokeStyle = COOL.line; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(xs[1] + 15, y - 20 + dy); ctx.lineTo(xs[1] + 28, y + dy); ctx.stroke();
    ctx.restore();
  }
  // uploaded mind: a screen on a stand with a head-and-shoulders outline (no face)
  if (u[2] > 0) {
    const k = expoOut(u[2]), sx = xs[2], sy = y - 44, w = 62, h = 46;
    ctx.save(); ctx.globalAlpha *= clamp(u[2] * 2); ctx.translate(sx, sy + 26); ctx.scale(1, k); ctx.translate(-sx, -sy - 26);
    ctx.fillStyle = mixHex(P.night1, P.ind2, .6); ctx.fillRect(sx - 3, sy + 20, 6, 26);
    ctx.fillStyle = mixHex(P.night0, COOL.deep, .6); ctx.beginPath(); ctx.roundRect(sx - w / 2, sy - h / 2, w, h, 4); ctx.fill();
    ctx.strokeStyle = COOL.line; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.roundRect(sx - w / 2, sy - h / 2, w, h, 4); ctx.clip();
    ctx.fillStyle = rgba(CREAM, .85 + .1 * Math.sin(t * 2.1)); ctx.beginPath(); ctx.arc(sx, sy - 4, 8, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(sx, sy + 22, 18, 13, 0, Math.PI, TAU); ctx.fill();
    ctx.restore();
    halo(ctx, sx, sy, 50, .25, COOL.halo, COOL.core);
    ctx.restore();
  }
  return xs;
}
export function table(ctx, x0, x1, y, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = mixHex(P.night1, GOLD.deep, .25); ctx.fillRect(x0 + 14, y + 22, 7, 30); ctx.fillRect(x1 - 21, y + 22, 7, 30);
  ctx.fillStyle = mixHex(P.night0, GOLD.deep, .3); ctx.fillRect(x0, y + 5, x1 - x0, 18);
  ctx.fillStyle = mixHex(GOLD.shade, P.night1, .35); ctx.fillRect(x0 - 4, y, x1 - x0 + 8, 6);
  ctx.restore();
}
// a shield (protects: cream, human) — x, y centre, s height
export function shield(ctx, x, y, s, u) {
  if (u <= 0) return; const k = expoOut(u);
  ctx.save(); ctx.globalAlpha *= clamp(u * 3); ctx.translate(x, y); ctx.scale(k, k);
  ctx.beginPath(); ctx.moveTo(0, -s / 2); ctx.lineTo(s * .42, -s * .36); ctx.lineTo(s * .38, s * .06); ctx.quadraticCurveTo(s * .26, s * .36, 0, s / 2); ctx.quadraticCurveTo(-s * .26, s * .36, -s * .38, s * .06); ctx.lineTo(-s * .42, -s * .36); ctx.closePath();
  ctx.fillStyle = rgba(CREAM, .12); ctx.fill(); ctx.strokeStyle = CREAM; ctx.lineWidth = s * .05; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.restore();
  halo(ctx, x, y, s * .9, .2 * u, LAMP.body, LAMP.core);
}
// a HEADLINE without text: a newspaper strip, a thick bar and three thin lines (x, y = centre)
export function headline(ctx, x, y, w, h, u, o = {}) {
  if (u <= 0) return null; const k = expoOut(clamp(u));
  ctx.save(); ctx.globalAlpha *= clamp(u * 3) * (o.a ?? 1); ctx.translate(x, y); ctx.rotate((o.rot ?? 0) * (1 - k));
  ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(-w / 2 + 6, -h / 2 + 8, w, h);
  ctx.fillStyle = lin(ctx, 0, -h / 2, 0, h / 2, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.fillStyle = PAPER.ink; ctx.fillRect(-w / 2 + 28, -h / 2 + 24, w * .78, h * .22);
  ctx.fillStyle = rgba(PAPER.ink, .25); for (let i = 0; i < 3; i++) ctx.fillRect(-w / 2 + 28, -h / 2 + 24 + h * .34 + i * h * .14, (w - 56) * (i === 2 ? .6 : 1), 5);
  ctx.restore();
  return { x: x - w / 2, y: y - h / 2, w, h };
}
// a CONTRACT: PROMISED, an empty signature line (x, y = top centre)
export function contract(ctx, t, x, y, w, u, o = {}) {
  if (u <= 0) return; const k = expoOut(clamp(u)), h = 300;
  ctx.save(); ctx.globalAlpha *= clamp(u * 3); ctx.translate(x, y + (1 - k) * 30);
  ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(-w / 2 + 6, 8, w, h, 6); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(-w / 2, 0, w, h, 6); ctx.fill();
  ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.stroke();
  F.glowText(ctx, o.head ?? 'A SHARE FOR THE PUBLIC', -w / 2 + 30, 48, { size: 22, weight: 700, col: PAPER.faint, glow: false, spacing: .1 });
  F.glowText(ctx, 'PROMISED', -w / 2 + 30, 116, { size: 56, serif: true, col: PAPER.ink, glow: false });
  ctx.fillStyle = rgba(PAPER.ink, .22); for (let i = 0; i < 2; i++) ctx.fillRect(-w / 2 + 30, 146 + i * 22, (w - 60) * (i ? .7 : 1), 5);
  // the signature line: dashed, nobody signs
  ctx.setLineDash([10, 8]); ctx.strokeStyle = rgba(PAPER.ink, .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-w / 2 + 30, 250); ctx.lineTo(w / 2 - 30, 250); ctx.stroke(); ctx.setLineDash([]);
  F.glowText(ctx, 'SIGNATURE', -w / 2 + 30, 278, { size: 22, weight: 600, col: PAPER.faint, glow: false, spacing: .1 });
  const nb = clamp(o.empty ?? 0); if (nb > 0) { ctx.globalAlpha *= nb * (Math.sin(t * 5) > 0 ? 1 : .25); ctx.fillStyle = PAPER.ink; ctx.fillRect(-w / 2 + 34, 222, 3, 24); }
  ctx.restore();
}
// a small crowd of people (indigo silhouettes), n of them around cx on the floor y, height h; u = they rise in from the floor, stagger
export function crowd(ctx, t, cx, y, n, h, u, seed = 1) {
  if (u <= 0) return; const r = prng(seed);
  for (let i = 0; i < n; i++) {
    const x = cx + (i - (n - 1) / 2) * h * .42 + (r() - .5) * h * .12, hh = h * (.86 + r() * .22), k = clamp(u * 2.2 - i * .12);
    if (k <= 0) continue;
    ctx.save(); ctx.globalAlpha *= clamp(k * 2); F.person(ctx, x, y - (1 - expoOut(k)) * 14, hh, { dir: i % 2 ? 1 : -1, light: 1, look: .35 + .05 * Math.sin(t * .7 + i), back: .4 }); ctx.restore();
  }
}
export { TAU };
