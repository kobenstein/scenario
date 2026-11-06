// Film 19 · "Computers Now Run on Human Brain Cells" · shared kit (owned by the lead; builders import, never edit — wishes go in the report).
// Base: lib/f10_editorial.mjs (palette P, easing, du/person, halo/glowFill, glowText, finish) + lib/f16_kit.mjs (quote, rule, rise,
// maskLine, trailSpan, measure, along). This file adds the ONE world of Film 19 (docs/MOTION.md §2) and its objects:
//
//   THE RACK (the world, anchor scenes): a quiet server aisle at night in Singapore. One rack is ALIVE: twenty drawers, each with a
//   thin gold seam of light (living cells inside); its neighbours are ordinary servers (cool LEDs only). A drawer slides out and
//   shows THE DISH: a glass dish on a chip with a glowing gold NEURON NET. Gold = living / human, cool blue-cream = silicon / A.I.,
//   yellow = only you.
//   THE DISH FIELD (the explainer stage): the same dish seen straight from above (camera pitch −90°). Its dark medium is the night on
//   which the explainers grow (cells, pulses, the Pong field, curves, the scoreboard, the size ladder); the net's SPARK is the carrier.
//
// 3D world with a PITCHED camera (the f10 cam3 has no pitch; this one does). World units ≈ mm. X right, Y UP, Z away from the viewer.
// The floor is Y = 0, the rack front is the plane Z = 0 (the rack body runs to Z = RACK.d).
//   cam({ tx, ty, tz, d, p, f, ox, oy })  look-at camera: target (tx,ty,tz), distance d, pitch p (rad, − = looking down), focal f,
//                                          ox/oy = where the target sits on screen relative to the centre (px)
//   camAt(t, K)                           keys [[t, cam, ease]] (ease 's' sine default · 'q' quart · 'o' expo-out · 'i' expo-in);
//                                          target/pitch/f/ox/oy lerp, distance lerps in log (a dolly feels like constant speed)
//   camDrift(c, t, amt)                   the never-still breath on top of any camera
//   view(c) → v ; proj(v, X, Y, Z) → [x, y, s] (s = px per world unit there) or null behind the camera
//   bill(ctx, v, X, Y, Z, fn)             draw fn() in WORLD units at a world point, y up = −, upright (a flat card / figure / label)
//   quad(ctx, v, pts, fill)               fill a projected polygon (null if any corner is behind the camera)
//   hall(ctx, v, t, o)                    the dark aisle: back wall, floor, the neighbour racks (cool), ceiling lights; o.pool (drawer light)
//   rack(ctx, v, t, o)                    THE RACK at X = o.x (default 0): o.alive (gold seams), o.open (drawer index), o.slide 0..1,
//                                          o.glow, o.seam, o.leds, o.net (net options for the open dish). Returns { dish: map, … }
//   dish(ctx, t, map, o)                  THE DISH drawn through a mapping map(u, v) → [x, y] (u, v in dish radii, v = far / screen up):
//                                          glass rim, medium, the chip with its electrode grid, THE NET (o.net) — same drawing in 3D and 2D
//   planeMap(v, X, Y, Z, R) / fieldMap(cx, cy, r)   a dish mapping in the 3D world (horizontal plane) / on screen (the dish field)
//   NET, net(ctx, t, map, o)              the neuron net (34 somas, dendrites, links). o: { grow 0..1, lit, dim, focus, ambient, fire, a }
//   spark(ctx, t, map, edge, u, o)        one pulse running along a link (u 0..1); sparksAmbient(t, o) the seeded ambient pulses
//   cell(ctx, t, x, y, r, o)              one cell in screen space: kind 'blood' | 'stem' | 'neuron' (o.sprout 0..1 grows dendrites),
//                                          o.warm (cool → gold), o.clock 0..1 (a clock ring), o.hand (rad, minute hand), o.a
//   glyph(ctx, kind, x, y, s, o)          small light glyphs: 'hand' 'eye' 'star' 'controller' 'pipette' 'paddle' ; o.strike 0..1, o.cool
//   vial(ctx, t, x, y, h, o)              the blood tube (cap, fill level, label): o.fill, o.label, o.a
//   cl1(ctx, t, x, y, w, o)               the box (CL1) in flat front view: dish window, life-support tubes, status light; o.lit, o.pump
//   monitor(ctx, v, t, X, Y, Z, w, o)     a screen on a stand in the aisle (16:9); returns the projected content rect
//   CLIP_RECT, CLIPS, clipWin, clipPlate  ORIGINAL FOOTAGE: the fixed screen rect where clips play, credits, placeholder (§ clips)
//   ladder(ctx, t, T, o) + LADDER         THE LADDER (6 rungs + top): progress rail on the left edge, driven by phrase anchors
//   scoreboard(ctx, t, x, y, o)           CELLS vs A.I. (c07–c08)
//   creature(ctx, kind, x, y, h, o)       size-ladder silhouettes: 'fly' 'bee' 'mouse' 'head' (+ 'box' = cl1 outline) with o.fill
// Rules as everywhere: no canvas, pattern or gradient cache per frame; seeded randomness only; nothing fades in from nowhere.
import { Path2D, PathOp } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K16 from './f16_kit.mjs';
import { clipFrame } from './kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, glowFill, halo, rad, lin, prng, drift } = E;
export const { rise, quote, rule, along, trailSpan, maskLine, measure } = K16;
export const { du, person } = E;

export const PRINT19 = { grain: 14, floor: 4, vig: .5 };
// silicon / the machine: cool blue-cream (never gold). Gold (P.core/halo) = living cells and human value. P.coat = only you.
export const COOL = { core: '#eef3ff', mid: '#b4c8ee', edge: '#6a8cd2', deep: '#2b4a96' };
export const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));
const TAU = Math.PI * 2;

// ======================================================================================================================== camera
export const cam = (o = {}) => ({ tx: 0, ty: 1200, tz: 0, d: 2400, p: 0, f: 1500, ox: 0, oy: 0, ...o });
export function camAt(t, K) {
  if (t <= K[0][0]) return { ...cam(), ...K[0][1] };
  if (t >= K[K.length - 1][0]) return { ...cam(), ...K[K.length - 1][1] };
  let i = 0; while (t > K[i + 1][0]) i++;
  const a = { ...cam(), ...K[i][1] }, b = { ...cam(), ...K[i + 1][1] };
  const e = { s: sineIO, q: quartIO, i: expoIn, o: expoOut }[K[i + 1][2] || 's'], u = e((t - K[i][0]) / (K[i + 1][0] - K[i][0]));
  const out = {};
  for (const k of ['tx', 'ty', 'tz', 'p', 'f', 'ox', 'oy']) out[k] = lerp(a[k], b[k], u);
  out.d = Math.exp(lerp(Math.log(a.d), Math.log(b.d), u));
  return out;
}
export const camDrift = (c, t, amt = 1, seed = 0) => ({ ...c, tx: c.tx + drift(t, 7 * amt, seed), ty: c.ty + drift(t, 5 * amt, seed + 2),
  d: c.d * (1 + .006 * amt * drift(t, 1, seed + 4)), p: c.p + .0016 * amt * drift(t, 1, seed + 6) });
export function view(c) {
  const sp = Math.sin(c.p), cp = Math.cos(c.p);
  return { sp, cp, x: c.tx, y: c.ty - sp * c.d, z: c.tz - cp * c.d, f: c.f, ox: c.ox || 0, oy: c.oy || 0, c };
}
export function proj(v, X, Y, Z) {
  const dx = X - v.x, dy = Y - v.y, dz = Z - v.z, zc = dy * v.sp + dz * v.cp;
  if (zc < 25) return null;
  const s = v.f / zc;
  return [W / 2 + v.ox + dx * s, H / 2 + v.oy - (dy * v.cp - dz * v.sp) * s, s];
}
export function bill(ctx, v, X, Y, Z, fn) {
  const p = proj(v, X, Y, Z); if (!p) return null;
  ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(p[2], p[2]); fn(p[2]); ctx.restore(); return p;
}
export function quad(ctx, v, pts, fill) {
  const q = []; for (const [X, Y, Z] of pts) { const p = proj(v, X, Y, Z); if (!p) return null; q.push(p); }
  ctx.beginPath(); q.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  return q;
}

// ======================================================================================================================== the aisle
export const RACK = { hw: 330, h: 2240, d: 1100, n: 20, y0: 150, pitch: 100, dh: 86, tray: 640, dishR: 205 };
export const drawerY = (i) => RACK.y0 + i * RACK.pitch;           // bottom of drawer i (0 = lowest)
export const OPEN = 11;                                            // the drawer that opens in the hook (and closes at the end)
export const NEIGH = [-2160, -1440, -720, 720, 1440, 2160];        // neighbour racks (X of their centres): ordinary servers
// hall: back wall (dark), floor (night with a faint cool sheen far away), a row of cool ceiling lights, the neighbour racks
export function hall(ctx, v, t, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.6, P.night2], [1, P.night0]]); ctx.fillRect(0, 0, W, H);
  // floor
  const fq = quad(ctx, v, [[-9000, 0, -4000], [9000, 0, -4000], [9000, 0, 9000], [-9000, 0, 9000]]);
  if (fq) {
    const far = proj(v, 0, 0, 9000), near = proj(v, 0, 0, -4000);
    const y0 = far ? far[1] : 0, y1 = near ? near[1] : H;
    ctx.fillStyle = lin(ctx, 0, Math.min(y0, y1 - 1), 0, Math.max(y1, y0 + 1), [[0, mixHex(P.night2, P.ind0, .3)], [.3, mixHex(P.night1, P.ind0, .35)], [1, P.night0]]); ctx.fill();
  }
  // floor tiles: a few faint lines toward the back (depth cue), cool
  ctx.strokeStyle = rgba(P.blue2, .16); ctx.lineWidth = 1.2;
  for (let k = -6; k <= 6; k++) { const a = proj(v, k * 600, 0, -3000), b = proj(v, k * 600, 0, 0); if (a && b) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } }
  for (const z of [-2400, -1800, -1200, -600]) { const a = proj(v, -6000, 0, z), b = proj(v, 6000, 0, z); if (a && b) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } }
  // the drawer's light on the floor (a warm pool in front of the rack)
  if ((o.pool ?? 0) > 0) {
    const c = proj(v, o.poolX ?? 0, 0, -700);
    if (c) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(c[0], c[1]); ctx.scale(1, .22 + .5 * Math.abs(v.sp));
      const r = 1500 * c[2]; ctx.fillStyle = rad(ctx, 0, 0, r, [[0, rgba(P.halo1, .22 * o.pool)], [.5, rgba(P.halo1, .06 * o.pool)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.restore(); }
  }
  // ceiling lights: a row of small cool slits far up (machine light)
  for (let k = -4; k <= 4; k++) for (const z of [-1500, 600, 2600]) {
    const p = proj(v, k * 900, 3400, z); if (!p) continue;
    ctx.fillStyle = rgba(COOL.mid, .35); ctx.fillRect(p[0] - 90 * p[2], p[1] - 6 * p[2], 180 * p[2], 12 * p[2]);
  }
  ctx.restore();
  // neighbours: opaque (the floor line must not show through), sinking into the night with distance from the alive rack
  for (const x of (o.neigh ?? NEIGH)) {
    rack(ctx, v, t, { x, alive: 0, leds: 1, seed: Math.round(x) });
    const k = Math.abs(x) < 1000 ? .38 : Math.abs(x) < 1800 ? .62 : .8;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); quad(ctx, v, [[x - RACK.hw - 2, 0, -8], [x + RACK.hw + 2, 0, -8], [x + RACK.hw + 2, RACK.h + 2, -8], [x - RACK.hw - 2, RACK.h + 2, -8]], rgba(P.night0, k)); ctx.restore();
  }
}
// THE RACK. o: { x, alive 0..1 (gold seams = living cells), open (drawer index | null), slide 0..1, glow 0..1, leds 0..1, net {} }
export function rack(ctx, v, t, o = {}) {
  const X = o.x ?? 0, { hw, h, d, n } = RACK, alive = o.alive ?? 1, leds = o.leds ?? 1, seed = o.seed ?? 19;
  const out = {};
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  // side faces (only the one turned to the camera), top
  const sideX = !o.side ? null : v.x < X - hw ? X - hw : v.x > X + hw ? X + hw : null;   // racks stand in a row: sides only on request
  if (sideX != null) quad(ctx, v, [[sideX, 0, 0], [sideX, h, 0], [sideX, h, d], [sideX, 0, d]], mixHex(P.night0, P.night1, .5));
  if (v.y > h) quad(ctx, v, [[X - hw, h, 0], [X + hw, h, 0], [X + hw, h, d], [X - hw, h, d]], mixHex(P.night1, P.ind2, .4));
  // the front frame
  const fr = quad(ctx, v, [[X - hw, 0, 0], [X + hw, 0, 0], [X + hw, h, 0], [X - hw, h, 0]]);
  if (fr) {
    ctx.fillStyle = lin(ctx, fr[0][0], 0, fr[1][0], 0, [[0, P.night1], [.5, mixHex(P.night1, P.ind2, .55)], [1, P.night0]]); ctx.fill();
    ctx.strokeStyle = rgba(alive > 0 ? mixHex(P.blue0, P.halo1, .25 * alive) : P.blue1, .6); ctx.lineWidth = Math.max(1, 6 * fr[0][2]); ctx.stroke();
  }
  const r = prng(seed);
  for (let i = 0; i < n; i++) {
    const y0 = drawerY(i), y1 = y0 + RACK.dh, ph = r() * 6.3, blink = r();
    if (i === o.open && (o.slide ?? 0) > 0) { out.slot = drawerOpen(ctx, v, t, X, i, o, out); continue; }
    const q = quad(ctx, v, [[X - hw + 26, y0, -4], [X + hw - 26, y0, -4], [X + hw - 26, y1, -4], [X - hw + 26, y1, -4]]);
    if (!q) continue;
    ctx.fillStyle = alive > 0 ? mixHex(P.night1, P.ind1, .4) : mixHex(P.night0, P.night1, .6); ctx.fill();
    // the gold seam: living cells inside leak a thin line of light at the drawer's lower edge (it breathes slowly, never blinks)
    if (alive > 0) {
      const a = alive * (o.seam ?? 1) * (.55 + .25 * Math.sin(t * .6 + ph)) * (i === o.open ? 1 + (o.glow ?? 0) : 1);
      const s0 = proj(v, X - hw + 40, y0 + 6, -5), s1 = proj(v, X + hw - 120, y0 + 6, -5);
      if (s0 && s1) { ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(mixHex(P.halo1, P.core1, .4 * a), .95 * Math.min(1, a)); ctx.lineWidth = Math.max(1.2, 7 * s0[2]); ctx.beginPath(); ctx.moveTo(s0[0], s0[1]); ctx.lineTo(s1[0], s1[1]); ctx.stroke();
        ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(P.halo1, .2 * a); ctx.lineWidth = Math.max(3, 40 * s0[2]); ctx.stroke(); ctx.restore(); }
    }
    // handle notch + the status LED (cool; servers blink slowly, the alive rack's LED stays steady)
    const hp = proj(v, X - hw + 60, y0 + RACK.dh * .55, -6);
    if (hp) { ctx.fillStyle = rgba(P.blue1, .8); ctx.fillRect(hp[0], hp[1] - 4 * hp[2], 70 * hp[2], 8 * hp[2]); }
    const lp = proj(v, X + hw - 70, y0 + RACK.dh * .5, -6);
    if (lp && leds > 0) {
      const on = alive > 0 ? .8 : (Math.sin(t * (1.1 + blink * 2.3) + ph * 3) > .2 ? .95 : .3);
      ctx.fillStyle = rgba(alive > 0 && blink < .5 ? P.halo0 : COOL.mid, on * leds); ctx.fillRect(lp[0] - 6 * lp[2], lp[1] - 6 * lp[2], 12 * lp[2], 12 * lp[2]);
      if (on > .5) halo(ctx, lp[0], lp[1], 40 * lp[2], .25 * on * leds, alive > 0 && blink < .5 ? P.halo0 : COOL.edge, COOL.core);
    }
  }
  ctx.restore();
  return out;
}
// the open drawer: dark slot, tray floor, walls, the dish (emerges from the slot), front panel. Light rises from the dish.
function drawerOpen(ctx, v, t, X, i, o, out) {
  const { hw, dh, tray, dishR } = RACK, y0 = drawerY(i), zf = -tray * clamp(o.slide), wx = hw - 30, glow = (o.glow ?? 1);
  // the slot in the rack front (dark), the tray floor (Z zf..0), the side walls' inner faces
  quad(ctx, v, [[X - hw + 26, y0, 0], [X + hw - 26, y0, 0], [X + hw - 26, y0 + dh, 0], [X - hw + 26, y0 + dh, 0]], P.night0);
  const fl = quad(ctx, v, [[X - wx, y0 + 10, zf], [X + wx, y0 + 10, zf], [X + wx, y0 + 10, 0], [X - wx, y0 + 10, 0]], mixHex(P.night1, P.ind2, .5));
  for (const sx of [-1, 1]) if ((v.x - (X + sx * wx)) * sx < 0) quad(ctx, v, [[X + sx * wx, y0 + 10, zf], [X + sx * wx, y0 + dh, zf], [X + sx * wx, y0 + dh, 0], [X + sx * wx, y0 + 10, 0]], P.night1);
  // the dish sits at the tray's middle; clip it to the tray floor (the part still inside the rack stays hidden)
  const dz = zf + tray * .5, map = planeMap(v, X, y0 + 12, dz, dishR);
  out.dish = { map, X, Y: y0 + 12, Z: dz, R: dishR };
  if (fl) {
    ctx.save(); ctx.beginPath(); fl.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.clip();
    dish(ctx, t, map, { glow, ...(o.dishO || {}), net: o.net });
    ctx.restore();
  }
  // light rising out of the open drawer (warm column + halo over the dish)
  const c = proj(v, X, y0 + 60, dz);
  if (c && glow > 0) {
    halo(ctx, c[0], c[1], 900 * c[2] * (1 + .03 * Math.sin(t * 1.1)), .5 * glow * clamp(o.slide * 2), P.halo1, P.core1);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const top = proj(v, X, y0 + 900, dz);
    if (top) { ctx.fillStyle = lin(ctx, 0, c[1], 0, top[1], [[0, rgba(P.halo1, .2 * glow * clamp(o.slide * 2))], [1, rgba(P.halo1, 0)]]); ctx.fillRect(c[0] - hw * c[2], top[1], 2 * hw * c[2], c[1] - top[1]); }
    ctx.restore();
  }
  // front panel (its top edge catches the light)
  const fp = quad(ctx, v, [[X - hw + 26, y0, zf - 4], [X + hw - 26, y0, zf - 4], [X + hw - 26, y0 + dh, zf - 4], [X - hw + 26, y0 + dh, zf - 4]], mixHex(P.night1, P.ind1, .5));
  quad(ctx, v, [[X - hw + 26, y0 + dh, zf - 4], [X + hw - 26, y0 + dh, zf - 4], [X + hw - 26, y0 + dh, zf + 16], [X - hw + 26, y0 + dh, zf + 16]], rgba(P.halo1, .55 * glow));
  if (fp) { const hp = proj(v, X - hw + 60, y0 + dh * .55, zf - 6); if (hp) { ctx.fillStyle = rgba(P.blue1, .8); ctx.fillRect(hp[0], hp[1] - 4 * hp[2], 70 * hp[2], 8 * hp[2]); } }
  return fl;
}

// ======================================================================================================================== the dish
// A dish mapping: map(u, v) → [x, y]; map.r = px per dish radius near the centre; map.c = screen centre. u right, v far (= up on the field).
export function planeMap(v, X, Y, Z, R) {
  const f = (u, w) => { const p = proj(v, X + u * R, Y, Z + w * R); return p ? [p[0], p[1]] : null; };
  const c = proj(v, X, Y, Z); f.c = c ? [c[0], c[1]] : null; f.r = c ? c[2] * R : 0;
  const a = proj(v, X, Y, Z + R), b = proj(v, X, Y, Z - R); f.ry = a && b ? Math.abs(b[1] - a[1]) / 2 : f.r;   // vertical radius (foreshortened)
  return f;
}
export function fieldMap(cx, cy, r) { const f = (u, w) => [cx + u * r, cy - w * r]; f.c = [cx, cy]; f.r = r; f.ry = r; return f; }
// the polyline of a circle through a mapping (n points), as a Path2D
function ring(map, rr, n = 72) { const p = new Path2D(); let first = true; for (let k = 0; k <= n; k++) { const a = k / n * TAU, q = map(Math.cos(a) * rr, Math.sin(a) * rr); if (!q) { first = true; continue; } if (first) { p.moveTo(q[0], q[1]); first = false; } else p.lineTo(q[0], q[1]); } p.closePath(); return p; }
// THE DISH: glass rim, medium (dark, warm in the middle where the net lives), chip square + electrode grid (cool), the net.
// o: { glow 0..1 (warm light of the medium), chip 0..1, electrodes 0..1 (grid brightness), ePulse (i, j) => 0..1 (an electrode lit),
//      net: { … net options } | false, rim 0..1, a }
export function dish(ctx, t, map, o = {}) {
  if (!map.c) return;
  const a = o.a ?? 1, glow = o.glow ?? 1, [cx, cy] = map.c, rx = map.r, ry = map.ry;
  ctx.save(); ctx.globalAlpha *= a;
  const inner = ring(map, 1), outer = ring(map, 1.07);
  // medium
  ctx.save(); ctx.clip(inner);
  ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.fillRect(cx - rx * 1.2, cy - ry * 1.2, rx * 2.4, ry * 2.4);
  ctx.translate(cx, cy); ctx.scale(1, ry / Math.max(1, rx));
  ctx.fillStyle = rad(ctx, 0, 0, rx, [[0, rgba(mixHex(P.blue0, P.halo1, .5), .3 * glow)], [.5, rgba(P.blue0, .16 * glow)], [1, rgba(P.night0, .3)]]); ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
  ctx.restore();
  // the chip: a square plate under the cells with the electrode grid (8 × 8 minus the corners = 60 pads ≈ the CL1's 59)
  const ch = o.chip ?? 1;
  if (ch > 0) {
    const q = [map(-.56, -.56), map(.56, -.56), map(.56, .56), map(-.56, .56)];
    if (q.every(Boolean)) {
      ctx.beginPath(); q.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
      ctx.fillStyle = rgba(COOL.deep, .28 * ch); ctx.fill(); ctx.strokeStyle = rgba(COOL.edge, .45 * ch); ctx.lineWidth = Math.max(1, rx * .006); ctx.stroke();
      const eb = o.electrodes ?? .6;
      for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
        if ((i === 0 || i === 7) && (j === 0 || j === 7)) continue;
        const u = -.44 + i * .1257, w = -.44 + j * .1257, p = map(u, w); if (!p) continue;
        const pu = o.ePulse ? clamp(o.ePulse(i, j)) : 0, s = Math.max(1.5, rx * .018);
        ctx.fillStyle = rgba(mixHex(COOL.edge, COOL.core, pu), (.35 + .6 * pu) * eb * ch); ctx.fillRect(p[0] - s, p[1] - s * ry / rx, 2 * s, 2 * s * ry / rx);
        if (pu > .05) halo(ctx, p[0], p[1], rx * .07, .45 * pu * ch, COOL.edge, COOL.core);
      }
    }
  }
  if (o.net !== false) net(ctx, t, map, { ...(o.net || {}) });
  // glass rim: a cool ring with a bright arc on the far-left (the light catches the glass)
  ctx.fillStyle = rgba(COOL.mid, .12 * (o.rim ?? 1)); ctx.fill(new Path2D(outer).op(inner, PathOp.Difference));
  ctx.strokeStyle = rgba(COOL.mid, .5 * (o.rim ?? 1)); ctx.lineWidth = Math.max(1, rx * .006); ctx.stroke(outer); ctx.stroke(inner);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(COOL.core, .35 * (o.rim ?? 1)); ctx.lineWidth = Math.max(1.5, rx * .012);
  ctx.beginPath(); for (let k = 0; k <= 16; k++) { const ang = Math.PI * (.62 + k / 16 * .3), q = map(Math.cos(ang) * 1.035, Math.sin(ang) * 1.035); if (q) k ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } ctx.stroke(); ctx.restore();
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- THE NET
// Built once (seeded): 34 somas inside radius .86, each with 3–5 dendrites that fork once; links to the two nearest neighbours.
// Every polyline point carries g (0..1): the growth order (0 at the soma). Links grow from both ends and meet in the middle.
export const NET = (() => {
  const r = prng(1919), S = [];
  while (S.length < 34) { const a = r() * TAU, d = Math.sqrt(r()) * .86, p = [Math.cos(a) * d, Math.sin(a) * d]; if (S.every((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) > .19)) S.push(p); }
  const dend = [];
  S.forEach((s, i) => {
    const k = 3 + Math.floor(r() * 3), a0 = r() * TAU;
    for (let j = 0; j < k; j++) {
      const a = a0 + j / k * TAU + (r() - .5) * .8, L = .07 + r() * .07, pts = [[s[0], s[1], 0]];
      let x = s[0], y = s[1], ang = a;
      for (let q = 1; q <= 5; q++) { ang += (r() - .5) * .5; x += Math.cos(ang) * L / 5; y += Math.sin(ang) * L / 5; pts.push([x, y, q / 5 * .6]); }
      dend.push({ s: i, pts, w: .010 });
      for (const sgn of [-1, 1]) {                   // the fork
        const b = [[x, y, .6]]; let bx = x, by = y, ba = ang + sgn * (.4 + r() * .4); const BL = L * (.45 + r() * .3);
        for (let q = 1; q <= 4; q++) { ba += (r() - .5) * .5; bx += Math.cos(ba) * BL / 4; by += Math.sin(ba) * BL / 4; b.push([bx, by, .6 + q / 4 * .4]); }
        dend.push({ s: i, pts: b, w: .006 });
      }
    }
  });
  const links = [], seen = new Set();
  S.forEach((s, i) => {
    const nn = S.map((q, j) => [j, Math.hypot(q[0] - s[0], q[1] - s[1])]).filter(([j]) => j !== i).sort((p, q) => p[1] - q[1]).slice(0, 2);
    for (const [j] of nn) {
      const key = Math.min(i, j) + ':' + Math.max(i, j); if (seen.has(key)) continue; seen.add(key);
      const A = S[i], B = S[j], mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2, nx = -(B[1] - A[1]), ny = B[0] - A[0], bend = (r() - .5) * .5;
      const pts = []; for (let q = 0; q <= 10; q++) { const u = q / 10, x = lerp(lerp(A[0], mx + nx * bend, u), lerp(mx + nx * bend, B[0], u), u), y = lerp(lerp(A[1], my + ny * bend, u), lerp(my + ny * bend, B[1], u), u); pts.push([x, y, Math.min(u, 1 - u) * 2]); }
      links.push({ a: i, b: j, pts });
    }
  });
  // the soma nearest the centre (a natural focus) and a deterministic order of somas from the centre outward
  const order = S.map((p, i) => [i, Math.hypot(p[0], p[1])]).sort((p, q) => p[1] - q[1]).map((p) => p[0]);
  return { somas: S, dend, links, centre: order[0], order };
})();
// ambient pulses: n seeded sparks hop from link to link (each ~0.9–1.6 s per link). Returns [{ link, u, from, to, arrive }]
export function sparksAmbient(t, o = {}) {
  const n = o.n ?? 7, out = [];
  for (let k = 0; k < n; k++) {
    const per = .9 + ((k * 0.618) % 1) * .7, ph = k * 1.37, c = Math.floor((t + ph) / per), u = (t + ph) / per - c;
    const h = Math.abs(Math.sin((c + 1) * 12.9898 + k * 78.233) * 43758.5453) % 1, L = NET.links[Math.floor(h * NET.links.length)];
    const flip = (Math.floor(h * 1000) % 2) === 1;
    out.push({ link: L, u: flip ? 1 - u : u, to: flip ? L.a : L.b, from: flip ? L.b : L.a, age: u * per, arrive: (1 - u) * per });
  }
  return out;
}
// THE NET through a mapping. o: { grow 0..1, lit 0..1 (overall light), dim 0..1 (how much all somas except o.focus dim),
//   focus (soma index | null), ambient 0..1 (pulses), fire (i) => 0..1 extra flash per soma, a, cool 0..1 (silicon tint), w (line scale) }
export function net(ctx, t, map, o = {}) {
  if (!map.c) return;
  const g = o.grow ?? 1, lit = o.lit ?? 1, dim = o.dim ?? 0, a = o.a ?? 1, rx = map.r, cool = o.cool ?? 0;
  if (a <= 0 || lit <= 0) return;
  const somaA = (i) => (o.focus == null || i === o.focus ? 1 : 1 - dim);
  const pulses = (o.ambient ?? 1) > 0 ? sparksAmbient(t, { n: o.nSparks ?? 7 }) : [];
  const flash = new Array(NET.somas.length).fill(0);
  for (const s of pulses) if (s.u > .82) flash[s.to] = Math.max(flash[s.to], (o.ambient ?? 1) * (s.u - .82) / .18);
  for (const s of pulses) { const age = s.age; if (age < .35) flash[s.from] = Math.max(flash[s.from], (o.ambient ?? 1) * (1 - age / .35) * .7); }
  if (o.fire) for (let i = 0; i < flash.length; i++) flash[i] = Math.max(flash[i], clamp(o.fire(i)));
  const gold = mixHex(P.core1, COOL.mid, cool), halo0 = mixHex(P.halo0, COOL.edge, cool);
  const lw = (o.w ?? 1) * Math.max(.6, rx * .0045);
  // build paths (grown part only) — two weights: dendrites and links
  const pD = new Path2D(), pL = new Path2D(), pDim = new Path2D();
  const addPoly = (path, pts, gmax) => { let started = false; for (const [u, w, gg] of pts) { if (gg > gmax) break; const q = map(u, w); if (!q) { started = false; continue; } if (!started) { path.moveTo(q[0], q[1]); started = true; } else path.lineTo(q[0], q[1]); } };
  const gD = clamp(g * 1.6), gL = clamp((g - .35) / .65);
  for (const d of NET.dend) addPoly(somaA(d.s) < .5 ? pDim : pD, d.pts, gD);
  if (gL > 0) for (const L of NET.links) {
    const target = (o.focus != null && dim > .5) ? pDim : pL;
    // grow from both ends: points with g <= gL (g is 0 at both ends, 1 in the middle)
    let started = false;
    for (const [u, w, gg] of L.pts) { const q = map(u, w); if (!q || gg > gL) { started = false; continue; } if (!started) { target.moveTo(q[0], q[1]); started = true; } else target.lineTo(q[0], q[1]); }
  }
  ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = rgba(halo0, .1 * lit); ctx.lineWidth = lw * 5; ctx.stroke(pD); ctx.stroke(pL);
  ctx.strokeStyle = rgba(halo0, .045 * lit); ctx.lineWidth = lw * 5; ctx.stroke(pDim);
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = rgba(gold, .82 * lit); ctx.lineWidth = lw * 1.25; ctx.stroke(pD);
  ctx.strokeStyle = rgba(gold, .6 * lit); ctx.lineWidth = lw; ctx.stroke(pL);
  ctx.strokeStyle = rgba(mixHex(P.shade0, P.blue1, .4), .5 * lit); ctx.lineWidth = lw; ctx.stroke(pDim);
  // somas
  NET.somas.forEach((s, i) => {
    const q = map(s[0], s[1]); if (!q) return;
    const sa = somaA(i), fl = flash[i], r0 = Math.max(1.6, rx * .016) * (1 + .5 * fl) * clamp(g * 4);
    if (r0 <= 0) return;
    halo(ctx, q[0], q[1], r0 * (5 + 6 * fl), (.3 + .55 * fl) * lit * sa * sa, halo0, gold);
    ctx.fillStyle = mixHex(mixHex(P.blue1, P.ind2, .4), gold, (.12 + .88 * sa) * lit); ctx.beginPath(); ctx.arc(q[0], q[1], r0, 0, TAU); ctx.fill();
  });
  // the pulses themselves
  if (gL >= 1) for (const s of pulses) spark(ctx, t, map, s.link, s.u, { a: (o.ambient ?? 1) * lit * (o.focus != null ? 1 - dim * .8 : 1), r: rx * .012, cool });
  ctx.restore();
}
// one pulse on a link (u 0..1 from a to b) with a short trail
export function spark(ctx, t, map, L, u, o = {}) {
  if (!L || u <= 0 || u >= 1) return null;
  const pts = L.pts.map(([x, y]) => [x, y]), p = along(pts, u), q = map(p[0], p[1]); if (!q) return null;
  const a = o.a ?? 1, r = o.r ?? 3, col = mixHex(P.core0, COOL.core, o.cool ?? 0);
  for (let k = 1; k <= 5; k++) { const pp = along(pts, Math.max(0, u - k * .025)), qq = map(pp[0], pp[1]); if (qq) { ctx.fillStyle = rgba(col, a * (1 - k / 6) * .6); ctx.beginPath(); ctx.arc(qq[0], qq[1], r * (1 - k / 8), 0, TAU); ctx.fill(); } }
  halo(ctx, q[0], q[1], r * 7, .7 * a, mixHex(P.halo0, COOL.edge, o.cool ?? 0), col);
  ctx.fillStyle = rgba(col, a); ctx.beginPath(); ctx.arc(q[0], q[1], r * 1.2, 0, TAU); ctx.fill();
  return q;
}
// soma position through a map (for carriers: "the spark lands here")
export const somaAt = (map, i) => map(NET.somas[i][0], NET.somas[i][1]);

// ======================================================================================================================== cells
// One cell in screen space (x, y = centre, r = radius). kind 'blood' (cool cream, a slightly lumpy white blood cell), 'stem' (warm
// round, bright core), 'neuron' (warm soma; o.sprout 0..1 grows six dendrites with forks). o.warm 0..1 blends cool → gold.
// o.clock 0..1 draws a clock ring (12 ticks + hands) at o.clockR (default 2.3 r); o.hand = minute-hand angle (rad, 0 = 12 o'clock).
const CELL_D = (() => { const r = prng(77), out = []; for (let j = 0; j < 6; j++) { const a = j / 6 * TAU + (r() - .5) * .5, L = 1.6 + r() * 1.4; out.push({ a, L, f: [(r() - .5) * .9, (r() - .5) * .9 + (r() < .5 ? .6 : -.6)], wob: r() * 6 }); } return out; })();
export function cell(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1, warm = clamp(o.warm ?? (o.kind === 'blood' ? 0 : 1)), sp = clamp(o.sprout ?? 0), br = 1 + .025 * Math.sin(t * 1.6 + (o.seed ?? 0));
  if (a <= 0 || r <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  const body = mixHex(mixHex(COOL.mid, COOL.core, .4), P.core1, warm), rimC = mixHex(COOL.edge, P.halo0, warm), deep = mixHex(COOL.deep, P.shade0, warm);
  // dendrites (neuron)
  if (sp > 0) {
    ctx.lineCap = 'round'; ctx.strokeStyle = mixHex(P.halo0, P.core1, .3);
    for (const d of CELL_D) {
      const L = d.L * r * sineIO(sp), ex = x + Math.cos(d.a) * (r + L), ey = y + Math.sin(d.a) * (r + L), mx = x + Math.cos(d.a + .15 * Math.sin(t * .5 + d.wob)) * (r + L * .5), my = y + Math.sin(d.a + .15 * Math.sin(t * .5 + d.wob)) * (r + L * .5);
      ctx.lineWidth = r * .16; ctx.beginPath(); ctx.moveTo(x + Math.cos(d.a) * r * .8, y + Math.sin(d.a) * r * .8); ctx.quadraticCurveTo(mx, my, ex, ey); ctx.stroke();
      const fk = clamp((sp - .45) / .55);
      if (fk > 0) { ctx.lineWidth = r * .09; for (const fa of d.f) { ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex + Math.cos(d.a + fa) * r * .9 * fk, ey + Math.sin(d.a + fa) * r * .9 * fk); ctx.stroke(); } }
    }
  }
  // membrane (blood: lumpy outline)
  const p = new Path2D(), lump = o.kind === 'blood' ? .06 * (1 - warm) : 0;
  for (let k = 0; k <= 48; k++) { const ang = k / 48 * TAU, rr = r * br * (1 + lump * Math.sin(ang * 7 + t * .7)); const px = x + Math.cos(ang) * rr, py = y + Math.sin(ang) * rr; k ? p.lineTo(px, py) : p.moveTo(px, py); }
  p.closePath();
  glowFill(ctx, p, r * .6, .5 * a, mixHex(P.blue0, P.halo1, warm * .6));
  ctx.fillStyle = rad(ctx, x - r * .25, y - r * .3, r * 1.25, [[0, mixHex(body, P.core0, .5)], [.6, body], [1, deep]]); ctx.fill(p);
  ctx.strokeStyle = rgba(rimC, .9); ctx.lineWidth = r * .05; ctx.stroke(p);
  // nucleus (blood: lobed; stem/neuron: one round bright core)
  if (o.kind === 'blood' && warm < .5) { ctx.fillStyle = rgba(COOL.deep, .55 * (1 - warm * 2)); for (const [dx, dy, rr] of [[-.28, -.1, .26], [.08, -.24, .24], [.22, .14, .25]]) { ctx.beginPath(); ctx.arc(x + dx * r, y + dy * r, rr * r, 0, TAU); ctx.fill(); } }
  else { halo(ctx, x, y, r * 1.2, .5 * warm, P.halo0, P.core0); ctx.fillStyle = rgba(mixHex(P.shade0, P.halo1, .4), .55); ctx.beginPath(); ctx.arc(x + r * .05, y + r * .05, r * .34, 0, TAU); ctx.fill(); }
  ctx.restore();
  // the clock ring
  const ck = clamp(o.clock ?? 0);
  if (ck > 0) clockRing(ctx, t, x, y, (o.clockR ?? 2.3) * r, ck, o.hand ?? 0, o.clockCool ?? 0, a);
}
export function clockRing(ctx, t, x, y, R, u, hand, cool = 0, a = 1) {
  const col = mixHex(P.halo0, COOL.mid, cool), k = expoOut(u);
  ctx.save(); ctx.globalAlpha *= a;
  ctx.strokeStyle = rgba(col, .5 * k); ctx.lineWidth = R * .012; ctx.beginPath(); ctx.arc(x, y, R, -Math.PI / 2, -Math.PI / 2 + TAU * clamp(u * 1.4)); ctx.stroke();
  for (let i = 0; i < 12; i++) {
    const ti = clamp((u - i / 24) * 3); if (ti <= 0) continue;
    const ang = i / 12 * TAU - Math.PI / 2, L = (i % 3 === 0 ? .09 : .05) * R;
    ctx.strokeStyle = rgba(col, .9 * ti); ctx.lineWidth = R * (i % 3 === 0 ? .018 : .011);
    ctx.beginPath(); ctx.moveTo(x + Math.cos(ang) * (R - L), y + Math.sin(ang) * (R - L)); ctx.lineTo(x + Math.cos(ang) * R, y + Math.sin(ang) * R); ctx.stroke();
  }
  const hu = clamp((u - .45) / .55);
  if (hu > 0) {
    ctx.lineCap = 'round';
    for (const [ang, L, w] of [[hand, .78, .016], [hand / 12, .55, .024]]) {
      const aa = ang - Math.PI / 2; ctx.strokeStyle = rgba(mixHex(col, P.core0, .4), hu); ctx.lineWidth = R * w;
      ctx.beginPath(); ctx.moveTo(x + Math.cos(aa) * R * .32, y + Math.sin(aa) * R * .32); ctx.lineTo(x + Math.cos(aa) * R * L * (.6 + .4 * hu), y + Math.sin(aa) * R * L * (.6 + .4 * hu)); ctx.stroke();
    }
  }
  ctx.restore();
}

// ======================================================================================================================== glyphs
// Small light glyphs (screen space, s = size in px). o: { a, cool 0..1, strike 0..1 (a cool line drawn across), lit }
export function glyph(ctx, kind, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const col = mixHex(P.core1, COOL.mid, o.cool ?? 0), gl = mixHex(P.halo0, COOL.edge, o.cool ?? 0);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s / 100, s / 100);
  const p = new Path2D();
  if (kind === 'hand') {   // open palm: four fingers + thumb as rounded strokes on a palm
    p.roundRect(-30, -10, 60, 55, 18);
    for (const [fx, L] of [[-22, 44], [-7, 54], [8, 52], [22, 42]]) p.roundRect(fx - 7, -10 - L, 14, L + 10, 7);
    p.roundRect(-58, 0, 34, 14, 7);
  } else if (kind === 'eye') {
    p.moveTo(-56, 0); p.quadraticCurveTo(0, -46, 56, 0); p.quadraticCurveTo(0, 46, -56, 0); p.closePath();
  } else if (kind === 'star') {
    for (let k = 0; k < 10; k++) { const ang = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? 22 : 54; k ? p.lineTo(Math.cos(ang) * rr, Math.sin(ang) * rr) : p.moveTo(Math.cos(ang) * rr, Math.sin(ang) * rr); } p.closePath();
  } else if (kind === 'controller') {
    p.moveTo(-60, -18); p.quadraticCurveTo(-60, -30, -44, -30); p.lineTo(44, -30); p.quadraticCurveTo(60, -30, 60, -18); p.lineTo(66, 22); p.quadraticCurveTo(68, 40, 50, 36); p.lineTo(30, 14); p.lineTo(-30, 14); p.lineTo(-50, 36); p.quadraticCurveTo(-68, 40, -66, 22); p.closePath();
  } else if (kind === 'paddle') { p.roundRect(-9, -50, 18, 100, 8); }
  else if (kind === 'pipette') { p.roundRect(-8, -90, 16, 60, 6); p.moveTo(-6, -30); p.lineTo(6, -30); p.lineTo(2, 60); p.lineTo(-2, 60); p.closePath(); }
  glowFill(ctx, p, 18, .55, gl);
  ctx.fillStyle = rad(ctx, -10, -15, 90, [[0, P.core0], [.5, col], [1, gl]]); ctx.fill(p);
  if (kind === 'eye') { ctx.fillStyle = mixHex(P.night1, COOL.deep, o.cool ?? 0); ctx.beginPath(); ctx.arc(0, 0, 17, 0, TAU); ctx.fill(); }
  if (kind === 'controller') { ctx.fillStyle = mixHex(P.shade0, P.night1, .4); ctx.fillRect(-42, -12, 22, 7); ctx.fillRect(-34.5, -19.5, 7, 22); for (const [bx, by] of [[30, -14], [42, -4]]) { ctx.beginPath(); ctx.arc(bx, by, 5.5, 0, TAU); ctx.fill(); } }
  const st = clamp(o.strike ?? 0);
  if (st > 0) {
    ctx.lineCap = 'round'; ctx.strokeStyle = rgba(COOL.core, .95); ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(-62, 52); ctx.lineTo(-62 + 124 * expoOut(st), 52 - 104 * expoOut(st)); ctx.stroke();
    ctx.strokeStyle = rgba(COOL.edge, .35); ctx.lineWidth = 20; ctx.stroke();
  }
  ctx.restore();
}
// the blood tube: (x, y) = bottom centre, h = height. o: { fill 0..1 (level), label, a, cap }
export function vial(ctx, t, x, y, h, o = {}) {
  const a = o.a ?? 1, w = h * .26; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  const tube = new Path2D(); tube.moveTo(x - w / 2, y - h); tube.lineTo(x - w / 2, y - w / 2); tube.arc(x, y - w / 2, w / 2, Math.PI, 0, true); tube.lineTo(x + w / 2, y - h); tube.closePath();
  glowFill(ctx, tube, w * .5, .35, COOL.edge);
  ctx.fillStyle = rgba(COOL.deep, .35); ctx.fill(tube);
  const lv = clamp(o.fill ?? .65), top = lerp(y, y - h * .92, lv) + Math.sin(t * 1.3) * h * .004;
  ctx.save(); ctx.clip(tube);
  ctx.fillStyle = lin(ctx, 0, top, 0, y, [[0, mixHex(P.shade0, P.halo1, .2)], [.3, P.shade0], [1, mixHex(P.shade0, P.night1, .45)]]); ctx.fillRect(x - w, top, w * 2, y - top + 2);
  ctx.fillStyle = rgba(P.halo1, .6); ctx.fillRect(x - w, top - h * .006, w * 2, h * .012);
  ctx.restore();
  ctx.strokeStyle = rgba(COOL.mid, .7); ctx.lineWidth = Math.max(1.5, w * .04); ctx.stroke(tube);
  ctx.strokeStyle = rgba(COOL.core, .4); ctx.beginPath(); ctx.moveTo(x - w * .28, y - h * .9); ctx.lineTo(x - w * .28, y - h * .2); ctx.stroke();
  // cap
  ctx.fillStyle = lin(ctx, x - w * .6, 0, x + w * .6, 0, [[0, P.night1], [.5, mixHex(P.ind2, P.blue1, .5)], [1, P.night0]]); ctx.beginPath(); ctx.roundRect(x - w * .62, y - h - h * .16, w * 1.24, h * .2, w * .12); ctx.fill();
  ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = Math.max(1, w * .03); ctx.stroke();
  // label band
  if (o.label) {
    ctx.fillStyle = rgba(P.cream, .92); ctx.fillRect(x - w / 2, y - h * .62, w, h * .22);
    ctx.save(); ctx.translate(x, y - h * .51); ctx.rotate(-Math.PI / 2); ctx.font = `600 ${w * .22}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = mixHex(P.shade0, P.night1, .5);
    ctx.letterSpacing = '0.12em'; ctx.fillText(o.label, 0, 0); ctx.restore();
  }
  ctx.restore();
}
// THE BOX (CL1), flat front view: (x, y) = bottom centre, w = width. A rounded slab, a round window on top-front where the dish
// glows (the net in miniature), two life-support tubes on the side, a cool status light. o: { lit 0..1, pump 0..1, a, net }
export function cl1(ctx, t, x, y, w, o = {}) {
  const a = o.a ?? 1, h = w * .62, lit = o.lit ?? 1; if (a <= 0) return null;
  ctx.save(); ctx.globalAlpha *= a;
  const body = new Path2D(); body.roundRect(x - w / 2, y - h, w, h, w * .06);
  glowFill(ctx, body, w * .12, .3, P.blue0);
  ctx.fillStyle = lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, mixHex(P.night1, P.ind2, .6)], [.55, mixHex(P.ind1, P.blue1, .35)], [1, P.night1]]); ctx.fill(body);
  ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = Math.max(1, w * .008); ctx.stroke(body);
  ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(x - w / 2 + w * .05, y - h * .22, w * .9, h * .02);
  // the window: the dish from above, the net inside
  const wx = x - w * .12, wy = y - h * .56, wr = h * .3;
  const m = fieldMap(wx, wy, wr * .92);
  ctx.save(); ctx.beginPath(); ctx.arc(wx, wy, wr, 0, TAU); ctx.fillStyle = P.night0; ctx.fill(); ctx.clip();
  dish(ctx, t, m, { glow: lit, electrodes: .4, net: { lit, ambient: lit, w: .7, nSparks: 4, ...(o.net || {}) }, rim: .6 });
  ctx.restore();
  halo(ctx, wx, wy, wr * 2.2, .35 * lit, P.halo1, P.core1);
  ctx.strokeStyle = rgba(COOL.mid, .7); ctx.lineWidth = Math.max(1, w * .01); ctx.beginPath(); ctx.arc(wx, wy, wr, 0, TAU); ctx.stroke();
  // life support: two tubes (a pump pulse travels along them) + a small reservoir
  const pump = o.pump ?? .6, rx = x + w * .3;
  ctx.strokeStyle = rgba(COOL.edge, .75); ctx.lineWidth = w * .022; ctx.lineCap = 'round';
  for (const k of [0, 1]) { ctx.beginPath(); ctx.moveTo(wx + wr * .9, wy - wr * .2 + k * wr * .4); ctx.bezierCurveTo(wx + wr * 1.6, wy - wr * .4 + k * wr * .8, rx - w * .08, y - h * .78 + k * h * .3, rx, y - h * .7 + k * h * .3); ctx.stroke(); }
  ctx.fillStyle = mixHex(P.night1, COOL.deep, .5); ctx.beginPath(); ctx.roundRect(rx - w * .06, y - h * .84, w * .14, h * .62, w * .03); ctx.fill(); ctx.stroke();
  const lvl = .55 + .05 * Math.sin(t * 1.2); ctx.fillStyle = rgba(COOL.edge, .5); ctx.fillRect(rx - w * .05, y - h * .24 - h * .56 * lvl, w * .12, h * .56 * lvl);
  if (pump > 0) { const u = (t * .8) % 1; const px = lerp(wx + wr, rx, u), py = lerp(wy, y - h * .7, u) - Math.sin(Math.PI * u) * h * .08; halo(ctx, px, py, w * .03, .6 * pump, COOL.edge, COOL.core); }
  // status light
  const sl = .7 + .3 * Math.sin(t * 2.1); ctx.fillStyle = rgba(COOL.core, sl); ctx.beginPath(); ctx.arc(x + w * .41, y - h * .12, w * .012, 0, TAU); ctx.fill();
  ctx.restore();
  return { window: [wx, wy, wr], top: [x, y - h], rect: [x - w / 2, y - h, w, h] };
}
// a screen on a stand in the aisle (world, faces the camera). Returns the projected screen rect [x, y, w, h] (axis-aligned bounds).
export function monitor(ctx, v, t, X, Y, Z, w, o = {}) {
  const h = w * 9 / 16, b = w * .025;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  // stand + foot
  quad(ctx, v, [[X - 24, 0, Z + 40], [X + 24, 0, Z + 40], [X + 24, Y - h / 2, Z + 40], [X - 24, Y - h / 2, Z + 40]], P.night1);
  quad(ctx, v, [[X - 260, 2, Z - 160], [X + 260, 2, Z - 160], [X + 260, 2, Z + 220], [X - 260, 2, Z + 220]], mixHex(P.night1, P.ind2, .4));
  const bz = quad(ctx, v, [[X - w / 2 - b, Y - h / 2 - b, Z], [X + w / 2 + b, Y - h / 2 - b, Z], [X + w / 2 + b, Y + h / 2 + b, Z], [X - w / 2 - b, Y + h / 2 + b, Z]], mixHex(P.night0, P.ind2, .35));
  if (bz) { ctx.strokeStyle = rgba(COOL.edge, .55); ctx.lineWidth = Math.max(1, 3 * bz[0][2]); ctx.stroke(); }
  const s0 = proj(v, X - w / 2, Y + h / 2, Z - 1), s1 = proj(v, X + w / 2, Y - h / 2, Z - 1);
  ctx.restore();
  if (!s0 || !s1) return null;
  return [s0[0], s0[1], s1[0] - s0[0], s1[1] - s0[1]];
}

// ======================================================================================================================== clips
// ORIGINAL FOOTAGE (clips-v1.md; schreibraum/clip-schritt.md: "the animation leads into a frame or screen where the clip runs, and
// out again"). During a clip the footage fills CLIP_RECT exactly (screen space). The handing shot steers its screen onto CLIP_RECT
// before clip.start and leaves after clip.end. The footage comes from ROOT/clips/<id>/f00001.jpg… (30 fps, lib/kit.mjs clipFrame,
// loaded by prepareClips) once downloaded; until then a calm placeholder runs (marked as such, never ship it).
export const CLIP_RECT = { x: 336, y: 150, w: 1248, h: 702 };
export const CLIPS = {
  C1: { name: 'Cortical Labs', role: 'CL1 playing DOOM', year: '2026', len: 8, under: true },
  C2: { name: 'Brett Kagan', role: 'Chief Scientific Officer, Cortical Labs', year: '2026', len: 11 },
  C3: { name: 'Lena Smirnova', role: 'Johns Hopkins University', year: '2023', len: 14 },
};
// the clip window [start, end]: from the timing file (audio agent / provisional), else derived from the framing phrase
export function clipWin(T, id) {
  const c = T.clip && T.clip(id); if (c) return { start: c.start, end: c.end };
  const anchor = { C1: ['Cells like these'], C2: ["on how it works", 'Brett Kagan'], C3: ['on what that means', 'Lena Smirnova'] }[id] || [];
  for (const ph of anchor) if (T.gHas(ph)) { const s = id === 'C1' ? T.G(ph) : T.GE(ph) + .7; return { start: s, end: s + CLIPS[id].len }; }
  return null;
}
// the plate: the screen, the footage (or placeholder), the credit line above it. rect defaults to CLIP_RECT. o.on 0..1 (screen lit),
// o.label 0..1 (credits; default: rises .2 s after start, sinks .4 s before end), o.dark 0..1 (the screen dims to night after the clip)
export function clipPlate(ctx, t, T, id, o = {}) {
  const R = o.rect ? { x: o.rect[0], y: o.rect[1], w: o.rect[2], h: o.rect[3] } : CLIP_RECT, win = clipWin(T, id) || { start: t, end: t + 1 }, info = CLIPS[id];
  const on = o.on ?? 1, dark = clamp(o.dark ?? 0);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.save(); ctx.beginPath(); ctx.rect(R.x, R.y, R.w, R.h); ctx.clip();
  ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.fillRect(R.x, R.y, R.w, R.h);
  const k = Math.floor(clamp(t - win.start, 0, win.end - win.start) * 30) + 1, fr = clipFrame(id, k);
  if (fr && on > 0) {
    const s = Math.max(R.w / fr.width, R.h / fr.height), dw = fr.width * s, dh = fr.height * s;
    ctx.globalAlpha = on * (1 - dark); ctx.drawImage(fr, R.x + (R.w - dw) / 2, R.y + (R.h - dh) / 2, dw, dh); ctx.globalAlpha = 1;
  } else if (on > 0) {
    // PLACEHOLDER (no footage yet): soft cool screen light, slow scan band, a thin progress line, the slot id. Never ship this.
    const u = clamp((t - win.start) / (win.end - win.start));
    ctx.fillStyle = rad(ctx, R.x + R.w * .5, R.y + R.h * .45, R.w * .7, [[0, rgba(COOL.deep, .55 * on * (1 - dark))], [1, rgba(P.night0, 0)]]); ctx.fillRect(R.x, R.y, R.w, R.h);
    const by = R.y + ((t * .18) % 1) * R.h; ctx.fillStyle = rgba(COOL.mid, .05 * on * (1 - dark)); ctx.fillRect(R.x, by - 40, R.w, 80);
    ctx.globalAlpha = on * (1 - dark) * .8;
    E.glowText(ctx, `${id} · ${info.name.toUpperCase()} · FOOTAGE GOES HERE`, R.x + R.w / 2, R.y + R.h / 2 + 10, { size: 26, align: 'center', col: COOL.mid, glow: false, spacing: .16 });
    ctx.fillStyle = rgba(COOL.mid, .6); ctx.fillRect(R.x + R.w * .1, R.y + R.h * .62, R.w * .8 * u, 3);
    ctx.globalAlpha = 1;
  }
  if (dark > 0) { ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .4), dark); ctx.fillRect(R.x, R.y, R.w, R.h); }
  // glass sheen
  const sh = ctx.createLinearGradient(R.x, R.y, R.x + R.w, R.y + R.h); sh.addColorStop(0, rgba(COOL.core, .05)); sh.addColorStop(.5, rgba(COOL.core, 0)); ctx.fillStyle = sh; ctx.fillRect(R.x, R.y, R.w, R.h);
  ctx.restore();
  // bezel
  ctx.strokeStyle = rgba(COOL.edge, .55); ctx.lineWidth = 3; ctx.strokeRect(R.x - 1.5, R.y - 1.5, R.w + 3, R.h + 3);
  // credits above the screen: name (serif) + role · year, and the ORIGINAL FOOTAGE tag on the right (rise from the baseline)
  const lu = o.label ?? (span(t, win.start + .2, win.start + 1.1) * (1 - span(t, win.end - .5, win.end + .1)));
  if (lu > 0 && o.credits !== false) {
    const by = R.y - 24;
    const nw = maskLine(ctx, [[info.name, 0]], R.x, by, 40, rise(lu), { glow: true });
    maskLine(ctx, [[`${info.role.toUpperCase()} · ${info.year}`, 0]], R.x + nw.w + 22, by - 2, 22, rise(lu), { serif: false, col: P.halo2, glow: false });
    maskLine(ctx, [['ORIGINAL FOOTAGE', 0]], R.x + R.w - measure('ORIGINAL FOOTAGE', 22, false), by - 2, 22, rise(lu), { serif: false, col: P.halo0, glow: false });   // maskLine knows no 'right'
  }
  ctx.restore();
  return R;
}

// ======================================================================================================================== THE LADDER
// The six-rung question ladder (never spoken; text-v2.md): a thin gold rail on the left edge. Each rung shows its QUESTION while it
// is asked, then its ANSWER word; done rungs keep a small lit tick. It is on screen only around its own beats (question −0.3 s …
// +5 s, answer −0.3 s … +4.5 s) and otherwise sinks into its baseline. Anchors are phrases (candidates, first found wins), so every
// builder draws the same ladder from the same T: just call ladder(ctx, t, T) last in your draw (screen space). o.hide 0..1 forces off.
export const LADDER = [
  { q: ['how do you teach a dish of cells'], qT: 'HOW DO YOU TEACH A DISH OF CELLS?', a: null, intro: true },
  { q: ['grew up inside a head', 'Your brain cells grew'], qT: 'WHERE DO THE CELLS COME FROM?', a: ['blood sample'], aT: 'BLOOD' },
  { q: ['So how do you teach it', 'without a reward'], qT: 'HOW DO YOU TEACH THEM?', a: ['nothing but order and noise', 'order and noise'], aT: 'ORDER VS. NOISE' },
  { q: ['just a lab trick', 'lab trick'], qT: 'JUST A LAB TRICK?', a: ['it became a product', 'became a product'], aT: 'FOR SALE' },
  { q: ['in a server rack?', 'So why put these boxes'], qT: 'WHY A DATA CENTER?', a: ['about twenty watts', 'twenty watts'], aT: '20 WATTS' },
  { q: ['really compete with artificial', 'compete with artificial intelligence'], qT: 'CAN CELLS COMPETE?', a: ['Final score'], aT: '2 : 1 · WITH CATCHES' },
  { q: ['is anyone in there'], qT: 'IS ANYONE IN THERE?', a: ["there's no evidence", 'no evidence'], aT: 'NO EVIDENCE · STAY CAREFUL' },
  { q: ['So what do we do now', 'what do we do now'], qT: 'WHAT NOW?', a: ['Three would be a start', 'Three would be'], aT: '3 RULES', top: true },
];
const LAD = { x: 92, y0: 800, y1: 300 };                      // rail bottom/top (screen); rung k (1..7) at y0 − k·(y0−y1)/7
const ladderCache = new WeakMap();
function ladderTimes(T) {
  if (ladderCache.has(T)) return ladderCache.get(T);
  const find = (cands) => { if (!cands) return null; for (const c of cands) if (T.gHas(c)) return T.G(c); return null; };
  const out = LADDER.map((L) => ({ ...L, tq: find(L.q), ta: find(L.a) }));
  ladderCache.set(T, out); return out;
}
// visible windows (sorted); the rail is up while any window is on
export function ladderOn(T, t) {
  let on = 0;
  for (const L of ladderTimes(T)) for (const [t0, d] of [[L.tq, L.intro ? 4.2 : 5], [L.ta, 4.5]]) if (t0 != null) on = Math.max(on, smooth(span(t, t0 - .3, t0 + .35)) * (1 - smooth(span(t, t0 + d, t0 + d + .6))));
  return on;
}
export function ladder(ctx, t, T, o = {}) {
  const Ls = ladderTimes(T), on = ladderOn(T, t) * (1 - clamp(o.hide ?? 0));
  if (on <= 0) return;
  const { x, y0, y1 } = LAD, n = 7, step = (y0 - y1) / n;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  // the rail grows up from its foot (two thin uprights)
  const top = lerp(y0, y1 - 20, expoOut(on));
  ctx.strokeStyle = rgba(P.halo1, .55); ctx.lineWidth = 2;
  for (const dx of [-14, 14]) { ctx.beginPath(); ctx.moveTo(x + dx, y0 + 10); ctx.lineTo(x + dx, top); ctx.stroke(); }
  // rungs 1..7: state per rung at t: 0 = future (dim), 1 = asked (bright, question text), 2 = answered (lit tick + answer)
  let active = -1;
  for (let k = 1; k < Ls.length; k++) { const L = Ls[k]; if (L.tq != null && t >= L.tq - .3) active = k; }
  for (let k = 1; k < Ls.length; k++) {
    const L = Ls[k], y = y0 - k * step; if (y < top) continue;
    const asked = L.tq != null && t >= L.tq - .3, answered = L.ta != null && t >= L.ta - .3;
    const au = asked ? smooth(span(t, L.tq - .3, L.tq + .4)) : 0, an = answered ? smooth(span(t, L.ta - .3, L.ta + .4)) : 0;
    const col = mixHex(P.blue1, answered ? P.core1 : P.halo0, Math.max(au * .7, an));
    ctx.strokeStyle = rgba(col, .45 + .55 * Math.max(au, an)); ctx.lineWidth = L.top ? 4 : 3;
    ctx.beginPath(); ctx.moveTo(x - 14, y); ctx.lineTo(x + 14, y); ctx.stroke();
    if (an > 0) halo(ctx, x, y, 34, .35 * an, P.halo0, P.core1);
    // the text of the ACTIVE rung only (question until answered, then the answer), rising from its baseline
    if (k === active) {
      const qOn = asked && !answered, txt = qOn ? L.qT : L.aT, t0 = qOn ? L.tq : L.ta, d = qOn ? 5 : 4.5;
      const u = rise(span(t, t0 - .2, t0 + .6)) * (1 - expoIn(span(t, t0 + d, t0 + d + .5)));
      if (u > 0 && txt) maskLine(ctx, [[txt, qOn ? 0 : 1]], x + 34, y + 9, qOn ? 24 : 28, u, { serif: !qOn, col: qOn ? P.halo2 : P.cream, glow: !qOn, weight: 600 });
    }
  }
  ctx.restore();
}
// the hook's question line (rung 0): big, centred-top, rises on its phrase. Exported so c01 and c11 (callback) draw the same thing.
export function questionLine(ctx, t, t0, t1, o = {}) {
  const u = rise(span(t, t0 - .15, t0 + .7)) * (t1 != null ? 1 - expoIn(span(t, t1, t1 + .5)) : 1);
  if (u <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  maskLine(ctx, [[o.text ?? 'How do you teach a dish of cells?', o.warm ?? 0]], o.x ?? 960, o.y ?? 150, o.size ?? 64, u, { align: 'center' });
  ctx.restore();
}

// ======================================================================================================================== scoreboard
// CELLS vs A.I. (c07–c08). (x, y) = centre of the board. o: { u 0..1 (board rises), cells, ai (scores, numbers count), round 0..3
// (lamps lit), cellPts: [{ u, catch, cu }], aiPts: [{ u, big 0..1 }], a }. Cells gold, A.I. cool. Point tokens hang under the names.
export function scoreboard(ctx, t, x, y, o = {}) {
  const u = clamp(o.u ?? 1), a = o.a ?? 1; if (u <= 0 || a <= 0) return;
  const k = expoOut(u), w = 980;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y + (1 - k) * 40);
  // the two names and the colon
  maskLine(ctx, [['CELLS', 0]], -w * .26, -40, 44, rise(u), { serif: false, align: 'center', col: P.halo0, weight: 600 });
  maskLine(ctx, [['A.I.', 0]], w * .26, -40, 44, rise(u), { serif: false, align: 'center', col: COOL.mid, weight: 600 });
  maskLine(ctx, [[`${o.cells ?? 0}`, 0]], -w * .26, 110, 150, rise(u), { align: 'center' });
  maskLine(ctx, [[`${o.ai ?? 0}`, 0]], w * .26, 110, 150, rise(u), { align: 'center', col: COOL.core });
  maskLine(ctx, [[':', 0]], 0, 96, 120, rise(u), { align: 'center', col: P.halo2 });
  // round lamps
  for (let i = 0; i < 3; i++) { const lit = clamp((o.round ?? 0) - i); ctx.fillStyle = rgba(mixHex(P.blue1, P.core1, lit), .5 + .5 * lit); ctx.beginPath(); ctx.arc(-40 + i * 40, -120, 9, 0, TAU); ctx.fill(); if (lit > 0) halo(ctx, -40 + i * 40, -120, 30, .4 * lit, P.halo0, P.core1); }
  // point tokens
  (o.cellPts || []).forEach((p, i) => { const pu = clamp(p.u); if (pu <= 0) return; const px = -w * .26 + (i - .5) * 90, py = 200 + (1 - expoOut(pu)) * -120;
    halo(ctx, px, py, 60, .45 * pu, P.halo0, P.core1); ctx.fillStyle = P.core1; ctx.beginPath(); ctx.arc(px, py, 22 * pu, 0, TAU); ctx.fill();
    if (p.catch && (p.cu ?? 0) > 0) { ctx.strokeStyle = rgba(P.halo2, .7 * p.cu); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px, py + 24); ctx.lineTo(px, py + 60); ctx.stroke(); maskLine(ctx, [[p.catch, 0]], px, py + 92, 22, rise(p.cu), { serif: false, align: 'center', col: P.halo2, glow: false }); } });
  (o.aiPts || []).forEach((p) => { const pu = clamp(p.u); if (pu <= 0) return; const big = clamp(p.big ?? 0), R = 22 * pu * (1 + 9 * expoOut(big)), py = 200 + R - 22;
    halo(ctx, w * .26, py, R * 2.6, .4 * pu, COOL.edge, COOL.core); ctx.fillStyle = rad(ctx, w * .26 - R * .3, py - R * .3, R * 1.3, [[0, COOL.core], [.6, COOL.mid], [1, COOL.edge]]); ctx.beginPath(); ctx.arc(w * .26, py, R, 0, TAU); ctx.fill(); });
  ctx.restore();
}

// ======================================================================================================================== creatures
// Size-ladder silhouettes (c09): flat shapes in light. (x, y) = bottom centre, h = height. o: { fill 0..1 (gold fill from the bottom:
// how much of its neurons), a, lit (rim), cool }. kinds: 'fly' 'bee' 'mouse' 'head' (a human head in profile, faceless) 'box'.
const CREATURE = {};
function creaturePath(kind) {
  if (CREATURE[kind]) return CREATURE[kind];
  const el = (x, y, rx, ry, r = 0) => { const q = new Path2D(); q.ellipse(x, y, rx, ry, r, 0, TAU); return q; };
  const U = (...ps) => ps.reduce((acc, q) => acc.op(q, PathOp.Union));
  let p;   // unit space: x −.5….5, y −1…0 (up = −), facing left
  if (kind === 'fly') p = U(el(.08, -.3, .3, .17, .08), el(-.26, -.36, .12, .12), el(-.33, -.4, .07, .09), el(.12, -.58, .32, .1, -.35), el(.02, -.56, .28, .085, -.75));
  else if (kind === 'bee') p = U(el(.12, -.3, .32, .2, .1), el(-.22, -.36, .14, .14), el(-.36, -.4, .08, .09), el(.1, -.62, .3, .11, -.45), el(-.02, -.6, .24, .09, -.9));
  else if (kind === 'mouse') { const tail = new Path2D(); tail.moveTo(.42, -.16); tail.quadraticCurveTo(.66, -.06, .6, -.42); tail.lineTo(.63, -.42); tail.quadraticCurveTo(.7, -.02, .42, -.1); tail.closePath();
    p = U(el(.1, -.27, .36, .26), el(-.26, -.32, .17, .15, -.3), el(-.4, -.3, .06, .05), el(-.2, -.5, .09, .1), tail); }
  else if (kind === 'head') { p = new Path2D(); p.moveTo(-.12, 0); p.lineTo(-.12, -.22); p.bezierCurveTo(-.36, -.3, -.42, -.62, -.3, -.8); p.bezierCurveTo(-.16, -1.0, .2, -1.02, .32, -.82); p.bezierCurveTo(.4, -.68, .36, -.56, .42, -.48); p.lineTo(.36, -.44); p.bezierCurveTo(.34, -.34, .3, -.3, .2, -.3); p.lineTo(.18, -.18); p.lineTo(.2, 0); p.closePath(); }
  else { p = new Path2D(); p.roundRect(-.5, -.62, 1, .62, .05); }
  return (CREATURE[kind] = p);
}
export function creature(ctx, kind, x, y, h, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const p = creaturePath(kind), cool = o.cool ?? 0;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(h, h);
  ctx.fillStyle = mixHex(P.ind1, P.blue1, .3); ctx.fill(p);
  const f = clamp(o.fill ?? 0);
  if (f > 0) { ctx.save(); ctx.clip(p); ctx.fillStyle = lin(ctx, 0, 0, 0, -1, [[0, mixHex(P.halo1, COOL.mid, cool)], [1, mixHex(P.core0, COOL.core, cool)]]); ctx.fillRect(-1, -f * 1.02, 2, f * 1.02 + .01); ctx.restore(); }
  if (kind === 'bee') { ctx.save(); ctx.clip(p); ctx.fillStyle = rgba(P.night0, .45); for (const bx of [.0, .14, .28]) { ctx.beginPath(); ctx.ellipse(bx, -.3, .035, .22, .1, 0, TAU); ctx.fill(); } ctx.restore(); }
  ctx.strokeStyle = rgba(mixHex(P.halo0, COOL.edge, cool), .85 * (o.lit ?? 1)); ctx.lineWidth = 2.2 / h; ctx.stroke(p);
  ctx.restore();
}

// ======================================================================================================================== small things
// the gloved hand with a pipette (c01 "someone feeds them", reused in c11): drawn in world units at the pipette tip (0, 0), the arm
// comes down from above (y up = −). o: { drop 0..1 (a drop forms and falls: returns its y), a }
export function feeder(ctx, t, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  // pipette: a slim cool glass tube with a bulb
  ctx.fillStyle = rgba(COOL.mid, .55); ctx.beginPath(); ctx.moveTo(-6, -40); ctx.lineTo(6, -40); ctx.lineTo(2, 0); ctx.lineTo(-2, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(COOL.mid, .35); ctx.fillRect(-9, -330, 18, 290);
  ctx.strokeStyle = rgba(COOL.core, .7); ctx.lineWidth = 2.5; ctx.strokeRect(-9, -330, 18, 290);
  ctx.fillStyle = mixHex(P.ind2, P.blue1, .5); ctx.beginPath(); ctx.roundRect(-16, -420, 32, 92, 14); ctx.fill();
  // the gloved hand (cool blue glove) and the sleeve (indigo) coming from above-right
  ctx.fillStyle = mixHex(COOL.deep, P.blue1, .4); ctx.beginPath(); ctx.ellipse(18, -380, 62, 46, -.5, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.roundRect(-30, -410, 40, 26, 12); ctx.fill();
  ctx.strokeStyle = rgba(COOL.edge, .7); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(18, -380, 62, 46, -.5, Math.PI * 1.1, Math.PI * 1.7); ctx.stroke();
  ctx.fillStyle = P.ind2; ctx.beginPath(); ctx.moveTo(40, -420); ctx.lineTo(420, -1400); ctx.lineTo(620, -1300); ctx.lineTo(90, -350); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(40, -420); ctx.lineTo(420, -1400); ctx.stroke();
  ctx.restore();
}
