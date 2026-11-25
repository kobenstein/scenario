// Film 76 "Your Kids Will Grow Up With Superintelligence" · shared kit (owned by the lead; builders import it and never edit it — wishes go
// in the report; own helpers go into lib/b1_*.mjs, lib/b2_*.mjs, lib/b3_*.mjs). Base: lib/f68_kit.mjs (re-exports f67_kit: cap, serif, big,
// tag, bar, column, lightLine, donut, dots, counter, src, clipShot, phr, bg, shotCam, orb, icon, folk, paperCard, maskLine, rise …).
// Plan: docs/MOTION.md · shots: docs/shots.md (tools/shots76.mjs from scenes/plan.mjs).
//
//   THE GATE (Leitbild, thumbnail C): night city by the water, a ramp of light, a giant arched gate of gold light; parent + child walk up
//     hand in hand (from behind). 4 anchors only (h1, h11, s4, s6/e1). gateWorld().
//   THE CHIP (thumbnail A): the machine. A rounded chip of pale light with gold pins and a CYAN heart (the machine colour); it can hang
//     like a lamp. Never a robot, never a face. chip().
//   THE AGE CLOCK (thumbnail B): five flat steps rising left → right (AGE 0 · 6 · 12 · 18 · 30), a rolling counter AGE n · YEAR top left,
//     the SCENARIO tag. Not a dial (clocks are an earlier film's motif). ageClock(), stepTop(), rollText().
//   THE KITCHEN TABLE: side view under a low pendant lamp; you from behind in the foreground, the child across. kitchen().
//   THE PAPER PLANE (the carrier): the child's question, folded in h5; film.mjs flies it between shots. paperPlane().
//   People: kid() (yellow coat, proportions by age), E.du (you), folk()/E.person (everyone else, indigo, no yellow).
//   Explainer pieces: tablet() (the tutor; screen = machine cyan), lightSwitch(), seesaw() (replaces the scale of #63), figRow() (unit
//     charts of people, dataviz: one colour = one meaning, direct labels), wordRise() (a word rising on its spoken word).
//
// Colour code (meaning, never broken): the yellow coat = you and your child (only them) · CYAN = the machine's own light (the chip's heart,
//   screens, the companion glow) · GOLD = the human things that grow in value, the gate's light, numbers that matter · CREAM = questions,
//   labels, what is open · indigo silhouettes = other people. No red anywhere.
// Rules: no canvas, pattern or gradient cache per frame; seeded randomness only; nothing from nowhere (things grow out of the plane's
// landing point S.in, rise behind a mask, unfold, are carried in); text above y 880 (subtitles below), sources at y 880, ≥ 22 px.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './f68_kit.mjs';
export * from './f68_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, rad, lin, prng, drift } = E;
const TAU = Math.PI * 2;
export { E };

// ---------------------------------------------------------------------------------------------------------------- palette
export const MACH = { core: '#fffdf0', body: '#f4e6b4', rim: '#e7cf8a', pin: '#f0d590', deep: '#8a6a2e', heart: '#8fe6ff', heartCore: '#e9fbff', heartDeep: '#0a6f8c', halo: '#f2d27a' };
export const PAPER76 = { lit: '#f6eed6', body: '#e6dcbc', shade: '#b4a984', fold: '#8f8566', ink: '#2a2f55' };
export const SKY = { top: '#070a24', mid: '#0c1a52', low: '#173a8c', glow: '#2b56b8' };
export const WIN = { lit: '#ffd27a', dim: '#7a6a4a' };
export const KIDS = { 0: { head: 1.75, hood: true }, 4: { head: 1.55 }, 6: { head: 1.45 }, 10: { head: 1.28 }, 12: { head: 1.18 }, 18: { head: 1.03 }, 30: { head: 1 } };
export const AGES = [[0, 2026], [6, 2032], [12, 2038], [18, 2044], [30, 2056]];

// ---------------------------------------------------------------------------------------------------------------- people
// a child in the yellow coat. h = full height in px (a 6-year-old next to a 170-px adult ≈ 105). o.age picks the head scale; other options
// as E.du (pose, dir, view 'back'|'side', walk, look, armR/armL, light, back). age 0 = sitting baby (pose 'sit' unless given).
export function kid(ctx, x, y, h, o = {}) {
  const ages = Object.keys(KIDS).map(Number), a = o.age ?? 6, k = ages.reduce((b, v) => (Math.abs(v - a) < Math.abs(b - a) ? v : b), ages[0]);
  return E.du(ctx, x, y, h, { head: KIDS[k].head, ...(a === 0 && !o.pose ? { pose: 'sit' } : {}), ...o });
}
// a row of people for unit charts: n figures from x with gap, colOf(i) → { dim 0..1, col (rim colour), pose } ; u reveals left → right
export function figRow(ctx, t, x, y, n, gap, h, u, colOf = () => ({}), o = {}) {
  for (let i = 0; i < n; i++) {
    const e = K.rise(span(u, i / n * .6, i / n * .6 + .4)); if (e <= 0) continue;
    const c = colOf(i) || {}, bob = Math.sin(t * 1.3 + i * 1.7) * .004 * h;
    ctx.save(); ctx.globalAlpha *= e * (1 - .55 * clamp(c.dim ?? 0));
    if (c.lit) halo(ctx, x + i * gap, y - h * .55, h * .7, .25 * c.lit, c.halo ?? K.GOLD.halo, c.core ?? K.GOLD.core);
    E.person(ctx, x + i * gap, y + (1 - e) * 16 + bob, h, { pose: c.pose ?? 'stand', look: c.look ?? .1, light: .7, rim: c.rim, long: c.long, dir: c.dir });
    ctx.restore();
  }
}

// ---------------------------------------------------------------------------------------------------------------- THE PAPER PLANE
// nose along +x of the local frame rotated by ang; s = half length; o.bank (-1..1) shows the underside; o.open 0..1 unfolds it to a flat
// sheet (landing); o.a alpha; o.glow. Light paper with a fold line; no outline strokes (flat shapes only).
export function paperPlane(ctx, x, y, s, ang = 0, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || s <= 0) return;
  const op = clamp(o.open ?? 0), bank = clamp(o.bank ?? 0, -1, 1), t = o.t ?? 0;
  const L = (p, q) => [lerp(p[0], q[0], op), lerp(p[1], q[1], op)];
  // plane points (local, nose at +1) → sheet points (a square) when open
  const nose = L([1, 0], [.62, -.62]), tailT = L([-.8, -.36], [-.62, -.62]), tailB = L([-.8, .36 * (.35 + .65 * Math.abs(bank))], [-.62, .62]), keel = L([-.62, .05], [-.62, .62]), noseB = L([1, 0], [.62, .62]);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  if (o.glow !== false) halo(ctx, .1, 0, 3.2, .16 * (1 - op * .5), PAPER76.body, PAPER76.lit);
  // soft shadow below (paper casts a little night)
  ctx.fillStyle = rgba(P.night0, .25 * (1 - op)); ctx.beginPath(); ctx.ellipse(-.1, .55, .8, .12, 0, 0, TAU); ctx.fill();
  // lower wing (underside, shaded)
  ctx.fillStyle = lin(ctx, -.8, 0, 1, 0, [[0, PAPER76.shade], [1, PAPER76.body]]);
  ctx.beginPath(); ctx.moveTo(...noseB); ctx.lineTo(...tailB); ctx.lineTo(...keel); ctx.closePath(); ctx.fill();
  // upper wing (lit)
  ctx.fillStyle = lin(ctx, -.8, -.36, 1, 0, [[0, PAPER76.body], [.6, PAPER76.lit], [1, '#fffaf0']]);
  ctx.beginPath(); ctx.moveTo(...nose); ctx.lineTo(...tailT); ctx.lineTo(...keel); ctx.closePath(); ctx.fill();
  // the fold line (a thin darker sliver, not a stroke)
  if (op < .95) { ctx.fillStyle = rgba(PAPER76.fold, .55 * (1 - op)); ctx.beginPath(); ctx.moveTo(...nose); ctx.lineTo(keel[0], keel[1] - .025); ctx.lineTo(keel[0], keel[1] + .02); ctx.closePath(); ctx.fill(); }
  if (op > 0) { ctx.fillStyle = rgba(PAPER76.ink, .35 * op); for (let i = 0; i < 3; i++) ctx.fillRect(-.45, -.3 + i * .22, .8 - i * .2, .045); }   // faint handwriting lines on the open sheet
  // a glint that travels along the wing
  const gl = (t * .8) % 1; ctx.fillStyle = rgba('#ffffff', .35 * Math.sin(Math.PI * gl) * (1 - op)); ctx.beginPath(); ctx.arc(lerp(-.5, .8, gl), lerp(-.2, -.02, gl), .06, 0, TAU); ctx.fill();
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- THE CHIP (the machine)
// centre x, y; s = half width of the body. o: { a, lit 0..1 (light on), rays 0..1, pins 0..1 (grown), heart 0..1 (cyan core), hang (y of a
// ceiling: draws a cord up to it), think (pulse rate) }. Returns { x, y, s }.
export function chip(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || s <= 0) return { x, y, s };
  const lit = clamp(o.lit ?? 1), pins = clamp(o.pins ?? 1), heart = clamp(o.heart ?? 1), br = 1 + .02 * Math.sin(t * 1.1);
  ctx.save(); ctx.globalAlpha *= a;
  if (o.hang != null) { ctx.fillStyle = rgba(P.night0, .9); ctx.fillRect(x - 2, o.hang, 4, y - s - o.hang); ctx.fillStyle = rgba(MACH.rim, .25 * lit); ctx.fillRect(x - 1, o.hang, 1.5, y - s - o.hang); }
  if (o.rays ?? 0) E.rays(ctx, x, y, s * 1.2, s * 5.5, 10, .06 * clamp(o.rays) * lit, t * .02);
  halo(ctx, x, y, s * 5 * br, .38 * lit, MACH.halo, MACH.core);
  halo(ctx, x, y, s * 2.2, .3 * lit * heart, MACH.heart, MACH.heartCore);
  // pins (3 per side), grown out of the body
  const pl = s * .34 * expoOut(pins), pw = s * .16;
  ctx.fillStyle = mixHex(MACH.pin, P.night1, .55 * (1 - lit));
  for (let i = -1; i <= 1; i++) {
    const q = i * s * .42;
    ctx.beginPath(); ctx.roundRect(x + q - pw / 2, y - s - pl, pw, pl + 4, pw * .4); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x + q - pw / 2, y + s - 4, pw, pl + 4, pw * .4); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x - s - pl, y + q - pw / 2, pl + 4, pw, pw * .4); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x + s - 4, y + q - pw / 2, pl + 4, pw, pw * .4); ctx.fill();
  }
  // body: pale light with a soft darker inner edge (volume)
  ctx.fillStyle = rad(ctx, x - s * .3, y - s * .35, s * 1.8, [[0, mixHex(MACH.core, P.night1, .7 * (1 - lit))], [.55, mixHex(MACH.body, P.night1, .72 * (1 - lit))], [1, mixHex(MACH.rim, P.night0, .75 * (1 - lit))]]);
  ctx.beginPath(); ctx.roundRect(x - s, y - s, s * 2, s * 2, s * .28); ctx.fill();
  // the die: the cyan heart (the machine's own light), pulsing inward when it thinks
  const d = s * .46;
  ctx.fillStyle = rad(ctx, x, y, d * 1.4, [[0, mixHex(MACH.heartCore, P.night1, .8 * (1 - lit * heart))], [.6, mixHex(MACH.heart, P.night1, .75 * (1 - lit * heart))], [1, mixHex(MACH.heartDeep, P.night0, .6)]]);
  ctx.beginPath(); ctx.roundRect(x - d, y - d, d * 2, d * 2, d * .18); ctx.fill();
  if (o.think) { for (let i = 0; i < 2; i++) { const ph = (t * o.think + i / 2) % 1; ctx.strokeStyle = rgba(MACH.heartCore, .45 * Math.sin(Math.PI * ph) * lit * heart); ctx.lineWidth = Math.max(1.2, s * .02); ctx.beginPath(); ctx.roundRect(x - d * (1.6 - ph * .6), y - d * (1.6 - ph * .6), d * 2 * (1.6 - ph * .6), d * 2 * (1.6 - ph * .6), d * .3); ctx.stroke(); } }
  ctx.restore();
  return { x, y, s };
}

// ---------------------------------------------------------------------------------------------------------------- THE GATE (Leitbild)
// o: { cam: { z, fx, fy } (a slow push about a focus), walk 0..1 (how far up the ramp the pair is), stop (bool: they stand), windows 0..1
// (city lights on, left → right), power 0..1 (a power line from the city up the ramp into the gate), gateU 0..1 (the gate opens up from its
// base), inside 0..1 (the pair is inside the light: end), throw 0..1 (the child lets the plane go), plane false, over(ctx, G) callback with
// G = { gate: {x, y, w, h}, pair: {x, y, h}, horizon } drawn in world space (labels that belong to the world) }.
export const GATE = { x: 1330, y: 120, w: 300, h: 690, base: 810, horizon: 742 };
export function gateWorld(ctx, t, o = {}) {
  const c = o.cam ?? {}, z = c.z ?? 1, fx = c.fx ?? 1300, fy = c.fy ?? 620;
  ctx.save();
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, SKY.top], [.45, SKY.mid], [.72, SKY.low], [1, P.night1]]); ctx.fillRect(0, 0, W, H);
  ctx.translate(fx, fy); ctx.scale(z, z); ctx.translate(-fx, -fy);
  // sky: stars (slow drift) + the gate's glow on the sky
  E.stars(ctx, 76, 160, t, [drift(t * .2, 14, 3) - 20, -20, W + 40, GATE.horizon], .8);
  const gu = sineIO(clamp(o.gateU ?? 1)), G = { x: GATE.x, y: lerp(GATE.base, GATE.y, gu), w: GATE.w, h: (GATE.base - GATE.y) * gu };
  halo(ctx, G.x + G.w / 2, G.y + G.h * .45, 900, .22 * gu, '#e8b85a', '#fff3c4');
  // far city on the left: blocks with windows (seeded), a bridge with lamps, water with reflections
  const r = prng(761), bl = [];
  for (let xx = -40; xx < 1240;) { const w = 40 + r() * 70, h = 50 + r() * 170 * (1 - xx / 1700); bl.push([xx, w, h, r()]); xx += w + r() * 8; }
  const winU = clamp(o.windows ?? 1);
  for (const [bx, bw, bh, q] of bl) {
    const top = GATE.horizon - bh;
    ctx.fillStyle = mixHex(P.ind0, P.night1, .45 + q * .3); ctx.fillRect(bx, top, bw, bh + 4);
    const rr = prng(Math.floor(bx * 7 + 3));
    for (let wy = top + 10; wy < GATE.horizon - 8; wy += 17) for (let wx = bx + 6; wx < bx + bw - 8; wx += 14) {
      if (rr() > .2) continue;
      const on = clamp((winU * 1.25 - bx / 1500) * 4), fl = .75 + .25 * Math.sin(t * (.3 + rr()) + wx);
      ctx.fillStyle = rgba(WIN.lit, .85 * on * fl); ctx.fillRect(wx, wy, 5, 7);
    }
  }
  // water
  ctx.fillStyle = lin(ctx, 0, GATE.horizon, 0, H, [[0, mixHex(SKY.low, P.night1, .5)], [1, P.night0]]); ctx.fillRect(-W, GATE.horizon, 1400 + W, H);
  for (let i = 0; i < 40; i++) { const rx = (i * 97.3) % 1240, ry = GATE.horizon + 10 + (i * 37) % 120, wv = Math.sin(t * .8 + i) * 6; ctx.fillStyle = rgba(WIN.lit, .18 * winU); ctx.fillRect(rx + wv, ry, 10 + (i % 4) * 5, 2); }
  // bridge lamps
  for (let i = 0; i < 18; i++) halo(ctx, 300 + i * 40, GATE.horizon - 14, 10, .4 * winU, WIN.lit, '#fff6dd');
  // the power line (h11): from the city's windows along the ramp edge into the gate
  const pw = clamp(o.power ?? 0);
  if (pw > 0) K.lightLine(ctx, [[160, GATE.horizon - 60], [700, GATE.horizon - 30], [1080, 960], [1300, 830], [G.x + 20, G.y + G.h - 40]], 0, sineIO(pw), { body: K.GOLD.body, line: K.GOLD.line, deep: K.GOLD.deep }, { w: 3, head: true });
  // the ramp: a wide plane of night stone rising to the gate base, lit by the gate
  const ramp = new Path2D(); ramp.moveTo(GATE.x - 50, GATE.base); ramp.lineTo(GATE.x + GATE.w + 60, GATE.base); ramp.lineTo(W + 200, H + 40); ramp.lineTo(330, H + 40); ramp.closePath();
  ctx.fillStyle = lin(ctx, 0, GATE.base, 0, H, [[0, '#3c4a86'], [.5, '#22306a'], [1, '#121a44']]); ctx.fill(ramp);
  ctx.save(); ctx.clip(ramp); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = rad(ctx, G.x + G.w / 2, GATE.base, 900, [[0, rgba('#ffd98a', .42 * gu)], [.5, rgba('#ffd98a', .1 * gu)], [1, rgba('#ffd98a', 0)]]); ctx.fillRect(0, GATE.base, W, H);
  ctx.restore();
  ctx.fillStyle = rgba('#ffe7b0', .35 * gu); ctx.beginPath(); ctx.moveTo(GATE.x - 50, GATE.base); ctx.lineTo(330, H + 40); ctx.lineTo(322, H + 40); ctx.lineTo(GATE.x - 52, GATE.base); ctx.fill();   // lit ramp edge
  // the gate: an arch of gold light with soft clouds inside
  if (G.h > 2) {
    const arch = new Path2D(); arch.moveTo(G.x, G.y + G.h); arch.lineTo(G.x, G.y + G.w / 2); arch.arc(G.x + G.w / 2, G.y + G.w / 2, G.w / 2, Math.PI, 0); arch.lineTo(G.x + G.w, G.y + G.h); arch.closePath();
    E.glowFill(ctx, arch, 40, .55 * gu, '#f2c46a');
    ctx.fillStyle = lin(ctx, 0, G.y, 0, G.y + G.h, [[0, '#fff4cf'], [.5, '#ffe6a2'], [1, '#ffd77e']]); ctx.fill(arch);
    ctx.save(); ctx.clip(arch);
    for (let i = 0; i < 7; i++) { const cx = G.x + ((i * 83 + t * 6) % (G.w + 160)) - 80, cy = G.y + 120 + (i * 97) % (G.h - 150); ctx.fillStyle = rgba('#f2c873', .22); ctx.beginPath(); ctx.ellipse(cx, cy, 90 + (i % 3) * 30, 34, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(cx + 50, cy - 18, 60, 30, 0, 0, TAU); ctx.fill(); }
    ctx.restore();
    E.dust(ctx, 77, 260, G.x + G.w / 2, G.y + G.h * .5, G.w * .9, G.h * .45, t, .55 * gu, '#ffe7a8');
  }
  // the pair: parent (you) and child, from behind, hand in hand, walking up the ramp toward the gate
  const wk = clamp(o.walk ?? .3), inside = clamp(o.inside ?? 0);
  const px = lerp(1180, G.x + G.w * .42, sineIO(wk)), py = lerp(1010, GATE.base + 6, sineIO(wk)), ph = lerp(250, 120, sineIO(wk)) * (1 - inside * .35);
  const step = o.stop ? 0 : t * 4.2, wa = o.stop ? null : step;
  // long shadows down the ramp (light from the gate)
  ctx.save(); ctx.globalAlpha *= .45 * gu * (1 - inside); ctx.fillStyle = P.night0;
  for (const [sx, sh] of [[px, ph], [px + ph * .32, ph * .62]]) { ctx.beginPath(); ctx.moveTo(sx - ph * .06, py); ctx.lineTo(sx + ph * .06, py); ctx.lineTo(sx - ph * .9, py + ph * 1.9); ctx.lineTo(sx - ph * 1.25, py + ph * 1.9); ctx.closePath(); ctx.fill(); }
  ctx.restore();
  ctx.save(); ctx.globalAlpha *= 1 - inside * .8;
  const kx = px + ph * .32, ky = py + 2;
  E.du(ctx, px, py, ph, { view: 'back', walk: wa, back: .85 * gu, light: .2, armR: [.5, .35], hood: true });
  kid(ctx, kx, ky, ph * .58, { age: 4, view: 'back', walk: wa == null ? null : wa + 1.4, back: .85 * gu, light: .2, armL: [-.55, -.4] });
  // the held hands: a small bridge of coat colour between parent's right hand and child's left hand
  ctx.fillStyle = mixHex(P.coat, P.night1, .35); ctx.beginPath(); ctx.ellipse(px + ph * .16, py - ph * .43, ph * .055, ph * .028, -.2, 0, TAU); ctx.fill();
  ctx.restore();
  const pair = { x: px, y: py, h: ph, kx, ky };
  if (o.over) o.over(ctx, { gate: G, pair, horizon: GATE.horizon });
  ctx.restore();
  return { gate: G, pair, z, fx, fy };
}

// ---------------------------------------------------------------------------------------------------------------- THE KITCHEN TABLE
// side view, evening: a window with the night city behind, a low pendant lamp (warm cone), the table top, the child across (upper body
// above the table), you in the foreground from behind (big, cut by the frame bottom-left). o: { childAge 6, childH, look 0..1 (child looks
// up), lamp 0..1, you (bool, default true), youX, grand 0..1 (a grandparent joins at the side), cam { z, fx, fy }, notebook 0..1, page
// 0..1 (the page lifts: caller draws the fold), table items: o.items(ctx, top) }. Returns { top (table top y), nb: [x, y] notebook centre,
// head: [x, y] child head, lamp: [x, y] }.
export const KT = { top: 700, x0: 420, x1: 1560, lampX: 1020, lampY: 300 };
export function kitchen(ctx, t, o = {}) {
  const c = o.cam ?? {}, z = c.z ?? 1, fx = c.fx ?? 1000, fy = c.fy ?? 560, lamp = clamp(o.lamp ?? 1);
  ctx.save();
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, '#0a0f30'], [1, '#070a22']]); ctx.fillRect(0, 0, W, H);
  ctx.translate(fx, fy); ctx.scale(z, z); ctx.translate(-fx, -fy);
  // back wall + window with the night city
  ctx.fillStyle = lin(ctx, 0, 0, 0, KT.top, [[0, '#0d1440'], [1, '#141d52']]); ctx.fillRect(-200, -200, W + 400, KT.top + 200);
  const wx = 1250, wy = 170, ww = 470, wh = 380;
  ctx.fillStyle = lin(ctx, 0, wy, 0, wy + wh, [[0, SKY.mid], [1, SKY.low]]); ctx.fillRect(wx, wy, ww, wh);
  E.stars(ctx, 33, 24, t, [wx, wy, ww, wh * .5], .6);
  const r = prng(7601); for (let i = 0; i < 9; i++) { const bx = wx + i * 54, bh = 60 + r() * 120; ctx.fillStyle = mixHex(P.ind0, P.night1, .5); ctx.fillRect(bx, wy + wh - bh, 50, bh); for (let k = 0; k < 6; k++) if (r() < .5) { ctx.fillStyle = rgba(WIN.lit, .7 * (.8 + .2 * Math.sin(t * .5 + i + k))); ctx.fillRect(bx + 8 + (k % 3) * 13, wy + wh - bh + 12 + Math.floor(k / 3) * 22, 5, 7); } }
  ctx.fillStyle = '#0a0f30'; ctx.fillRect(wx + ww / 2 - 5, wy, 10, wh); ctx.fillRect(wx, wy + wh * .45, ww, 9);   // mullions
  ctx.strokeStyle = rgba('#1c2766', 1); ctx.lineWidth = 16; ctx.strokeRect(wx - 8, wy - 8, ww + 16, wh + 16);
  // the pendant lamp: cord, shade, warm cone onto the table
  ctx.fillStyle = '#050818'; ctx.fillRect(KT.lampX - 2, -200, 4, KT.lampY + 200 - 40);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = lin(ctx, 0, KT.lampY, 0, KT.top + 40, [[0, rgba('#ffd98a', .34 * lamp)], [1, rgba('#ffd98a', .05 * lamp)]]);
  ctx.beginPath(); ctx.moveTo(KT.lampX - 70, KT.lampY + 10); ctx.lineTo(KT.lampX + 70, KT.lampY + 10); ctx.lineTo(KT.lampX + 520, KT.top + 40); ctx.lineTo(KT.lampX - 520, KT.top + 40); ctx.closePath(); ctx.fill();
  ctx.restore();
  halo(ctx, KT.lampX, KT.lampY + 14, 300, .5 * lamp, '#f2c46a', '#fff4cf');
  ctx.fillStyle = lin(ctx, KT.lampX - 90, 0, KT.lampX + 90, 0, [[0, '#2a2140'], [.5, '#4a3a52'], [1, '#2a2140']]);
  ctx.beginPath(); ctx.moveTo(KT.lampX - 26, KT.lampY - 46); ctx.lineTo(KT.lampX + 26, KT.lampY - 46); ctx.lineTo(KT.lampX + 92, KT.lampY + 14); ctx.lineTo(KT.lampX - 92, KT.lampY + 14); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba('#fff2c4', lamp); ctx.beginPath(); ctx.ellipse(KT.lampX, KT.lampY + 14, 92, 9, 0, 0, TAU); ctx.fill();
  // the child across the table (upper body above the table top)
  const age = o.childAge ?? 6, ch = o.childH ?? (age >= 18 ? 430 : age >= 12 ? 360 : 300), cx = o.childX ?? 1180, look = clamp(o.look ?? 0);
  kid(ctx, cx, KT.top + ch * .46, ch, { age, dir: -1, look: lerp(-.15, .55, look), lean: lerp(.22, 0, look), light: -1, armR: [lerp(1.2, .9, look), lerp(1.9, 1.2, look)], armL: [-.3, .8] });
  // a grandparent joins at the side (a chair back + an indigo figure)
  const gr = clamp(o.grand ?? 0);
  if (gr > 0) { ctx.save(); ctx.globalAlpha *= K.rise(gr); E.person(ctx, 1520, KT.top + 330 * .44 + (1 - K.rise(gr)) * 30, 330, { dir: -1, look: .2, light: -1, long: true }); ctx.restore(); }
  // the table: top plane + front edge, lit by the lamp
  ctx.fillStyle = lin(ctx, 0, KT.top - 30, 0, KT.top + 26, [[0, '#4a3a4e'], [1, '#2c2440']]);
  ctx.beginPath(); ctx.moveTo(KT.x0 + 60, KT.top - 30); ctx.lineTo(KT.x1 - 60, KT.top - 30); ctx.lineTo(KT.x1, KT.top + 26); ctx.lineTo(KT.x0, KT.top + 26); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, KT.lampX, KT.top, 520, [[0, rgba('#ffd98a', .3 * lamp)], [1, rgba('#ffd98a', 0)]]); ctx.fillRect(KT.x0, KT.top - 30, KT.x1 - KT.x0, 56); ctx.restore();
  ctx.fillStyle = '#1a1533'; ctx.fillRect(KT.x0, KT.top + 26, KT.x1 - KT.x0, 22);
  ctx.fillStyle = '#100c26'; ctx.fillRect(KT.x0 + 40, KT.top + 48, 26, 300); ctx.fillRect(KT.x1 - 66, KT.top + 48, 26, 300);
  // notebook on the table in front of the child
  const nb = [cx - 150, KT.top - 12], nu = clamp(o.notebook ?? 1);
  if (nu > 0) { ctx.save(); ctx.globalAlpha *= nu; ctx.fillStyle = PAPER76.lit; ctx.beginPath(); ctx.moveTo(nb[0] - 90, nb[1] + 10); ctx.lineTo(nb[0] + 80, nb[1] + 10); ctx.lineTo(nb[0] + 64, nb[1] - 12); ctx.lineTo(nb[0] - 74, nb[1] - 12); ctx.closePath(); ctx.fill(); ctx.fillStyle = rgba(PAPER76.fold, .6); ctx.fillRect(nb[0] - 6, nb[1] - 12, 3, 22); ctx.restore(); }
  if (o.items) o.items(ctx, KT.top);
  // you in the foreground, from behind (big; the frame cuts you at the hip)
  if (o.you !== false) E.du(ctx, o.youX ?? 640, KT.top + 560, 900, { view: 'back', back: .55 * lamp, light: 1, look: .05, armR: [.14, .32], armL: [-.12, -.28] });
  ctx.restore();
  const hy = KT.top + ch * .46 - ch * .9;
  return { top: KT.top, nb, head: [cx, hy], lamp: [KT.lampX, KT.lampY], z, fx, fy };
}

// ---------------------------------------------------------------------------------------------------------------- THE AGE CLOCK
// five flat steps rising left → right (thumbnail B). Step i (0..4) top-left corner: stepTop(i). o: { u 0..1 (steps build left → right),
// lit [5] 0..1 per step (a soft gold top light), figs: [{ i, age, x (0..1 along the step), pose, look, a }], counter: { age, year, u, from: {age, year}
// } (rolling AGE n · YEAR top left), scenario 0..1 (the SCENARIO · YEAR tag), city 0..1 (night city behind), dx/dz camera, marks: [{ i, text, u }] }
export const STEP = { x0: 150, w: 330, gap: 0, y0: 900, rise: 92 };
export const stepTop = (i) => [STEP.x0 + i * (STEP.w + STEP.gap), STEP.y0 - i * STEP.rise];
export function ageClock(ctx, t, o = {}) {
  const u = clamp(o.u ?? 1), lit = o.lit ?? [];
  if (o.city !== 0) {   // the night city behind (thumbnail B), very low key
    const r = prng(7602); ctx.save(); ctx.globalAlpha *= clamp(o.city ?? 1) * .9;
    for (let xx = 0; xx < W;) { const w = 50 + r() * 70, h = 60 + r() * 200; ctx.fillStyle = mixHex(P.ind0, P.night1, .55); ctx.fillRect(xx, 760 - h, w, h + 400); for (let k = 0; k < 8; k++) if (r() < .35) { ctx.fillStyle = rgba(WIN.lit, .45 * (.8 + .2 * Math.sin(t * .4 + k + xx))); ctx.fillRect(xx + 6 + (k % 4) * 12, 770 - h + Math.floor(k / 4) * 24, 5, 7); } xx += w + 6; }
    ctx.restore();
  }
  for (let i = 0; i < 5; i++) {
    const e = expoOut(span(u, i * .14, i * .14 + .44)); if (e <= 0) continue;
    const [x, y] = stepTop(i), w = STEP.w, yy = lerp(H + 40, y, e);
    ctx.fillStyle = lin(ctx, 0, yy, 0, H, [[0, '#1a2560'], [.25, '#121a4a'], [1, '#0a0f30']]); ctx.fillRect(x, yy, w + 2, H - yy + 40);
    const L = clamp(lit[i] ?? 0);
    ctx.fillStyle = rgba(mixHex('#3a4a8c', '#ffe2a0', L), .9); ctx.fillRect(x, yy, w + 2, 5);   // the lit top edge
    if (L > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, yy - 160, 0, yy + 4, [[0, rgba('#ffd98a', 0)], [1, rgba('#ffd98a', .22 * L)]]); ctx.fillRect(x, yy - 160, w, 164); ctx.restore(); }
    // the age number engraved small in the step face
    ctx.save(); ctx.globalAlpha *= .55 * e; E.glowText(ctx, String(AGES[i][0]), x + w - 24, yy + 46, { size: 34, serif: true, align: 'right', col: mixHex('#7d86c0', '#ffe7a8', L), glow: false }); ctx.restore();
  }
  for (const m of o.marks ?? []) { const [x, y] = stepTop(m.i); K.cap(ctx, m.text, x + STEP.w / 2, y - (m.dy ?? 250), m.u, { size: 26, align: 'center', col: m.col ?? K.GOLD.text }); }
  for (const f of o.figs ?? []) {
    const [x, y] = stepTop(f.i), a = clamp(f.a ?? 1); if (a <= 0) continue;
    const hh = f.h ?? { 0: 70, 4: 105, 6: 115, 10: 140, 12: 155, 18: 185, 30: 195 }[f.age] ?? 150;
    ctx.save(); ctx.globalAlpha *= a; kid(ctx, x + STEP.w * (f.x ?? .5), y + (1 - K.rise(a)) * 20, hh, { age: f.age, pose: f.pose, look: f.look ?? .7, light: -1, dir: f.dir ?? 1, view: f.view }); ctx.restore();
  }
  if (o.counter) counterAge(ctx, t, o.counter);
  if ((o.scenario ?? 0) > 0) K.tag(ctx, `SCENARIO · ${o.counter?.year ?? ''}`.replace(/ · $/, ''), 330, 250, o.scenario, { size: 22, col: K.GOLD.text });
}
// AGE n · YEAR, rolling from `from` to the new value (odometer digits), top left. c: { age, year, u, from: { age, year }, x, y, size }
export function counterAge(ctx, t, c) {
  const x = c.x ?? 120, y = c.y ?? 170, size = c.size ?? 92, u = clamp(c.u ?? 1); if (u <= 0) return;
  const f = c.from ?? { age: c.age, year: c.year };
  ctx.save(); ctx.globalAlpha *= clamp(u * 3);
  K.cap(ctx, 'AGE', x, y - size * .72, K.rise(u), { size: 24, col: K.CREAM });
  const w1 = rollText(ctx, String(f.age), String(c.age), u, x, y, size, { col: '#fff6d8' });
  E.glowText(ctx, '·', x + w1 + size * .22, y - size * .06, { size: size * .7, serif: true, col: K.GOLD.text, glow: false });
  rollText(ctx, String(f.year), String(c.year), u, x + w1 + size * .55, y, size, { col: K.GOLD.text });
  ctx.restore();
}
// digits roll vertically from a to b (right-aligned digit columns), like an odometer; returns the width. Inside a mask, nothing pops.
export function rollText(ctx, a, b, u, x, y, size, o = {}) {
  const n = Math.max(a.length, b.length); a = a.padStart(n, ' '); b = b.padStart(n, ' ');
  const dw = K.measure('0', size, true) * 1.02; let xx = x;
  ctx.save(); ctx.beginPath(); ctx.rect(x - 10, y - size * .95, dw * n + 20, size * 1.18); ctx.clip();
  for (let i = 0; i < n; i++) {
    const ca = a[i], cb = b[i], k = expoOut(span(u, i * .08, .55 + i * .08));
    if (ca === cb) { if (cb !== ' ') E.glowText(ctx, cb, xx, y, { size, serif: true, col: o.col }); }
    else { if (ca !== ' ') E.glowText(ctx, ca, xx, y - k * size * 1.1, { size, serif: true, col: o.col, a: 1 - k }); if (cb !== ' ') E.glowText(ctx, cb, xx, y + (1 - k) * size * 1.1, { size, serif: true, col: o.col, a: k }); }
    xx += dw;
  }
  ctx.restore();
  return dw * b.trim().length;
}

// ---------------------------------------------------------------------------------------------------------------- objects
// the tutor tablet: rounded device; screen glows machine-cyan (lit 0..1) or stays dark. o: { a, lit, rot, content(ctx, sx, sy, sw, sh) }
export function tablet(ctx, t, x, y, w, h, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return; const lit = clamp(o.lit ?? 1);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(o.rot ?? 0);
  if (lit > 0) halo(ctx, 0, 0, Math.max(w, h) * 1.1, .2 * lit, MACH.heart, MACH.heartCore);
  ctx.fillStyle = '#1b2147'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, Math.min(w, h) * .08); ctx.fill();
  const m = Math.min(w, h) * .07, sw = w - m * 2, sh = h - m * 2;
  ctx.fillStyle = lit > 0 ? rad(ctx, 0, -sh * .2, Math.max(sw, sh), [[0, mixHex('#0b1236', '#c9f4ff', .85 * lit)], [.6, mixHex('#0b1236', '#5fd0f2', .6 * lit)], [1, mixHex('#0b1236', '#0a6f8c', .5 * lit)]]) : '#0b1236';
  ctx.beginPath(); ctx.roundRect(-sw / 2, -sh / 2, sw, sh, m * .6); ctx.fill();
  if (o.content) { ctx.save(); ctx.beginPath(); ctx.roundRect(-sw / 2, -sh / 2, sw, sh, m * .6); ctx.clip(); o.content(ctx, -sw / 2, -sh / 2, sw, sh); ctx.restore(); }
  ctx.restore();
}
// a light switch plate on a wall; on 0..1 flips the toggle. Returns the toggle tip [x, y] (for a hand).
export function lightSwitch(ctx, x, y, s, on, o = {}) {
  const k = sineIO(clamp(on));
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.fillStyle = lin(ctx, x - s, y - s * 1.5, x + s, y + s * 1.5, [[0, '#d9d0b4'], [1, '#9e9478']]); ctx.beginPath(); ctx.roundRect(x - s, y - s * 1.5, s * 2, s * 3, s * .2); ctx.fill();
  ctx.fillStyle = rgba(P.night0, .35); ctx.beginPath(); ctx.roundRect(x - s * .35, y - s * .8, s * .7, s * 1.6, s * .12); ctx.fill();
  const ty = lerp(s * .45, -s * .45, k);
  ctx.fillStyle = lin(ctx, 0, y + ty - s * .4, 0, y + ty + s * .4, [[0, '#f6eed6'], [1, '#c8bd9c']]); ctx.beginPath(); ctx.roundRect(x - s * .26, y + ty - s * .38, s * .52, s * .76, s * .1); ctx.fill();
  ctx.restore();
  return [x, y + ty];
}
// a playground seesaw: pivot at (x, y), plank half-length L, tilt (rad, + = right end down). o.left/o.right(ctx, ex, ey, ang) draw what sits on
// each end (in screen space, ang = plank angle). Replaces the scale (#63). Returns the two end points.
export function seesaw(ctx, t, x, y, L, tilt, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return null; const ang = tilt + Math.sin(t * .9) * .004;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = lin(ctx, 0, y, 0, y + 120, [[0, '#2a3672'], [1, '#141c4c']]); ctx.beginPath(); ctx.moveTo(x - 60, y + 120); ctx.lineTo(x, y + 6); ctx.lineTo(x + 60, y + 120); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.ellipse(x, y + 124, L * .9, 12, 0, 0, TAU); ctx.fill();
  const c = Math.cos(ang), s = Math.sin(ang), l = [x - c * L, y - s * L], r = [x + c * L, y + s * L];
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  ctx.fillStyle = lin(ctx, 0, -10, 0, 12, [[0, '#6a78b8'], [1, '#2c3878']]); ctx.beginPath(); ctx.roundRect(-L, -10, L * 2, 20, 8); ctx.fill();
  ctx.fillStyle = rgba('#ffe7a8', .35); ctx.fillRect(-L, -10, L * 2, 2);
  ctx.fillStyle = '#1b2456'; ctx.fillRect(-L + 24, -44, 10, 34); ctx.fillRect(L - 34, -44, 10, 34);   // handles
  ctx.restore();
  ctx.fillStyle = '#c9b98a'; ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.fill();
  if (o.left) o.left(ctx, l[0], l[1] - 12, ang); if (o.right) o.right(ctx, r[0], r[1] - 12, ang);
  ctx.restore();
  return { l, r, ang };
}
// a word (or short phrase) that rises behind its baseline on its spoken word; serif by default; gold if o.gold
export function wordRise(ctx, s, x, y, size, u, o = {}) { if (u <= 0) return 0; return o.gold ? (K.big(ctx, s, x, y, size, u, { align: o.align ?? 'center', serif: o.serif ?? true }), K.measure(s, size, o.serif ?? true)) : K.serif(ctx, s, x, y, size, u, { align: o.align ?? 'center', col: o.col, glow: o.glow }); }
