// Film 26 · B1 · c03 content (line 1, the warehouse by the river): 1,000,000+ robots · three office windows on their words · the tiles
// join the bar ALMOST EVERYTHING (NOT YET) · the bar pours into a stack of crates on the roof, +20–30 % · one coin beside it, unchanged ·
// ★ the stack grows into the sky, a rocket, the Moon with its launch rail · back down: ✓ (F.testCard) · the conveyor rolls out.
import * as E from './f10_editorial.mjs';
import * as F from './f26_kit.mjs';
import * as S from './f26_seams.mjs';
import { F0, TAU, bump, qb, cap, serif, qcardUp, Z_T, OFFICE_WIN, officeWin, STACK, MOON, GATE } from './f26_b1_core.mjs';
const { P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, smooth, halo, lin, prng } = E;

export const BAR = { x0: 430, x1: 1690, y: -170, h: 40 };
const ISAAC = { lines: F.QUOTES.isaacson.lines, src: F.QUOTES.isaacson.src, quoted: true };

// ---------------------------------------------------------------- pieces
export function crate(ctx, x, y, w, h, glow = 0) {   // (x, y) = bottom centre
  ctx.fillStyle = lin(ctx, x - w / 2, y - h, x + w / 2, y, [[0, mixHex(P.halo0, P.shade0, .2)], [1, mixHex(P.shade0, P.night1, .35)]]); ctx.fillRect(x - w / 2, y - h, w, h);
  ctx.strokeStyle = rgba(mixHex(P.shade0, P.night0, .4), .9); ctx.lineWidth = Math.max(1, w * .025); ctx.strokeRect(x - w / 2 + 2, y - h + 2, w - 4, h - 4);
  ctx.beginPath(); ctx.moveTo(x - w / 2 + 4, y - h + 4); ctx.lineTo(x + w / 2 - 4, y - 4); ctx.stroke();
  if (glow > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(P.halo1, .35 * glow); ctx.fillRect(x - w / 2, y - h, w, h); ctx.restore(); }
}
// how many crates the stack holds at t (float: the fractional one is arriving from above)
export function stackN(a, t) {
  if (t < a.guess) return 0;
  let n = 8 + clamp((t - a.twenty) / .45) + clamp((t - a.twenty - .4) / .45);
  const g = span(t, a.space + .5, a.moon + .5); n += 52 * g * g;
  return n;
}
function stack(ctx, t, a) {
  const rise = expoOut(span(t, a.guess + .3, a.guess + 1.9)); if (rise <= 0) return null;
  const n = stackN(a, t), { x, base, cw, ch } = STACK, full = Math.floor(n), f = n - full;
  ctx.save(); ctx.beginPath(); ctx.rect(x - 600, -9000, 1200, base + 9000); ctx.clip();   // rises out of the roof deck
  const dy = (1 - rise) * 8 * ch;
  for (let i = 0; i < full; i++) {
    const xo = 6 * Math.sin(i * 2.3), gl = i >= 8 && i < 10 ? bump(t, a.twenty + (i - 8) * .4, 2.6) : i >= 10 ? .25 : 0;
    crate(ctx, x + xo, base - i * ch + dy, cw, ch, gl);
  }
  if (f > 0) { const y = base - full * ch - (1 - expoOut(f)) * ch * 1.2; crate(ctx, x + 6 * Math.sin(full * 2.3), y, cw, ch, .6); }
  ctx.restore();
  // "That's a lot … He's right": the stack stands bigger, lit
  const lit = bump(t, a.lot, 3.2); if (lit > 0) halo(ctx, x, base - 5 * ch, 520, .22 * lit);
  return base - n * ch;
}
// the climbing rover ("robots"): carries the next crate up the side of the stack
function climber(ctx, t, a) {
  const u = span(t, a.robots3 - .3, a.first); if (u <= 0 || u >= 1) return;
  const top = STACK.base - stackN(a, t) * STACK.ch, per = .9, ph = ((t - a.robots3) / per) % 1;
  const y = lerp(top + 900, top + 20, sineIO(ph)), x = STACK.x + STACK.cw / 2 + 26;
  ctx.save(); ctx.translate(x, y); ctx.rotate(-Math.PI / 2); F.rover(ctx, t, 0, 0, 70, { shelf: false, ph: 3 }); ctx.restore();
  crate(ctx, x + 34, y + 20, 56, 30, .5); halo(ctx, x, y, 60, .3, F.COOL.halo, F.COOL.core);
}
// the Moon, with a long launch rail: cargo leaves it in a steady stream (the hero light of 3.07)
function moon(ctx, t, a) {
  const { x, y, r } = MOON, lit = .8 + .2 * smooth(span(t, a.moon - .4, a.moon + .6));
  halo(ctx, x, y, r * 1.6, .45 * lit, P.halo1, P.core1);
  ctx.fillStyle = E.rad(ctx, x - r * .35, y - r * .35, r * 1.5, [[0, P.core0], [.45, mixHex(P.core1, P.halo2, .4)], [1, mixHex(P.halo2, P.shade0, .45)]]);
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  const rr = prng(2630); ctx.fillStyle = rgba(mixHex(P.halo2, P.shade0, .5), .35);
  for (let i = 0; i < 9; i++) { const ang = rr() * TAU, d = rr() * r * .78, cr = r * (.05 + rr() * .12); ctx.beginPath(); ctx.ellipse(x + Math.cos(ang) * d, y + Math.sin(ang) * d, cr, cr * .8, ang, 0, TAU); ctx.fill(); }
  // the rail: a long straight line on the surface, rising off the right limb; cargo pellets run along it and fly on into space
  const r0 = [x - r * .55, y + r * .55], r1 = [x + r * .95, y - r * .62];
  ctx.strokeStyle = mixHex(P.shade0, P.night1, .3); ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(...r0); ctx.lineTo(...r1); ctx.stroke();
  ctx.strokeStyle = rgba(P.core0, .8); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(...r0); ctx.lineTo(...r1); ctx.stroke();
  for (let k = 0; k < 7; k++) {
    const p = ((t * .55 + k / 7) % 1), d = p * 1.9, px = lerp(r0[0], r1[0], d), py = lerp(r0[1], r1[1], d), a0 = d < 1 ? 1 : 1 - (d - 1) / .9;
    ctx.fillStyle = rgba(P.core0, a0); ctx.beginPath(); ctx.arc(px, py, 7, 0, TAU); ctx.fill(); halo(ctx, px, py, 40, .4 * a0);
  }
}
// the rocket: lifts off beside the stack and flies to the Moon's rail
const ROCK0 = [1220, 440], ROCK1 = [MOON.x - MOON.r * .45, MOON.y + MOON.r * .4];
function rocketAt(a, t) {
  const u = span(t, a.rockets - .35, a.moon + 1.2), k = u * u * (3 - 2 * u), c1 = [ROCK0[0] + 150, ROCK0[1] - 1500];
  const p = qb(ROCK0, c1, ROCK1, k), q = qb(ROCK0, c1, ROCK1, Math.min(1, k + .01));
  return { p, ang: Math.atan2(q[1] - p[1], q[0] - p[0]) + Math.PI / 2, u, k, c1 };
}
function rocket(ctx, t, a) {
  if (t < a.rockets - 1.2) return;
  const R = rocketAt(a, t); if (R.u >= 1) return;
  const ig = smooth(span(t, a.rockets - 1.2, a.rockets - .35));
  if (R.u > 0) { const trail = []; for (let j = 0; j <= 10; j++) trail.push(qb(ROCK0, R.c1, ROCK1, Math.max(0, R.k - j * .02))); F.goldDust(ctx, t, trail.reverse(), { n: 90, seed: 233, spread: 22, a: .9, size: 3.2, speed: .9 }); }
  const [x, y] = R.p, s = 1.6;
  ctx.save(); ctx.translate(x, y); ctx.rotate(R.ang); ctx.scale(s, s);
  halo(ctx, 0, 70, 70 * (.6 + ig), .8 * ig, P.halo1, P.core0);
  ctx.fillStyle = P.core1; ctx.beginPath(); ctx.moveTo(-9, 46); ctx.lineTo(9, 46); ctx.lineTo(0, 46 + 40 * ig + 6 * Math.sin(t * 30)); ctx.closePath(); ctx.fill();
  ctx.fillStyle = lin(ctx, -14, 0, 14, 0, [[0, P.cream], [1, mixHex(P.cream, P.blue1, .45)]]);
  ctx.beginPath(); ctx.moveTo(0, -60); ctx.quadraticCurveTo(15, -32, 13, 44); ctx.lineTo(-13, 44); ctx.quadraticCurveTo(-15, -32, 0, -60); ctx.fill();
  ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.beginPath(); ctx.moveTo(-13, 20); ctx.lineTo(-26, 50); ctx.lineTo(-13, 44); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(13, 20); ctx.lineTo(26, 50); ctx.lineTo(13, 44); ctx.closePath(); ctx.fill();
  ctx.fillStyle = P.halo0; ctx.beginPath(); ctx.arc(0, -18, 5, 0, TAU); ctx.fill();
  ctx.restore();
}
function bar(ctx, t, a) {
  const on = span(t, a.isnt - .5, a.isnt + .5), off = span(t, a.guess - .1, a.guess + 1.0); if (on <= 0 || off >= 1) return;
  const { x0, x1, y, h } = BAR, w = (x1 - x0) * expoOut(on) * (1 - expoIn(off)), f = .05 + .08 * smooth(span(t, a.isnt + .4, a.isnt + 1.6)) + .01 * Math.max(0, t - a.isnt - 1.6);
  ctx.strokeStyle = rgba(P.cream, .75); ctx.lineWidth = 2.5; ctx.strokeRect(x0, y, w, h);
  const fw = Math.min(w, (x1 - x0) * f);
  ctx.fillStyle = lin(ctx, x0, 0, x0 + fw, 0, [[0, rgba(P.halo0, .85)], [1, rgba(P.core1, .95)]]); ctx.fillRect(x0 + 3, y + 3, Math.max(0, fw - 6), h - 6);
  F.goldDust(ctx, t, [[x0 + 10, y + h / 2], [x0 + fw + 30, y + h / 2]], { n: 70, seed: 241, spread: 14, a: .8 * (1 - off), size: 2.2, speed: .25 });
  halo(ctx, x0 + fw, y + h / 2, 70, .45 * (1 - off));
  cap(ctx, 'ALMOST EVERYTHING', (x0 + x1) / 2, y - 22, 28, span(t, a.isnt, a.isnt + .8) * (1 - off), { col: P.cream });
  cap(ctx, 'NOT YET', x0 + fw + 8, y + h + 38, 24, span(t, a.notyet - .05, a.notyet + .6) * (1 - off), { align: 'left' });
  // the fill pours down into the roof deck (where the stack will rise)
  if (off > 0 && off < 1) F.goldDust(ctx, t, [[x0 + fw * .5, y + h], [lerp(x0 + fw * .5, STACK.x, .5), y + 260], [STACK.x, STACK.base - 10]], { n: 140, seed: 242, spread: 26, a: bump(t, a.guess - .1, 1.6), size: 2.4, speed: .6 });
}

// ---------------------------------------------------------------- hooks
export function c03(a, t, w, L, cam, world) {
  if (world !== 'ware') return;
  // the gate is lit; the office windows do their work on their words; the tiles leave them
  w.office = [span(t, a.drafts - .7, a.drafts + 1.3), span(t, a.code - .5, a.code + 1.2), span(t, a.answers - .5, a.answers + 1.1)];
  w.tiles = t > a.isnt - .1 ? 1 : 0;
  w.conveyor = { u: span(t, a.belt0, a.belt0 + 3.2), t0: a.belt0 };
  L.field.push((ctx, c) => E.card(ctx, c, F0, () => { moon(ctx, t, a); }));
  L.front.push((ctx, c) => E.card(ctx, c, F0, () => {
    bar(ctx, t, a);
    const top = stack(ctx, t, a);
    climber(ctx, t, a); rocket(ctx, t, a);
    // the coin beside the stack: it does not change
    const cu = expoOut(span(t, a.lot - .2, a.lot + .5)); if (cu > 0) {
      const cx = 1100, cy = STACK.base - 26 - (1 - cu) * 160; F.coin(ctx, cx, cy, 26, { flip: .25 + (1 - cu) * 6, glint: bump(t, a.endm + .2, 1.6) });
      halo(ctx, cx, cy, 120, .5 * bump(t, a.endm + .1, 2.2)); }
    // +20–30 %: on the two new crates
    if (top != null) { const n10 = STACK.base - 10 * STACK.ch;
      serif(ctx, '+20–30 %', STACK.x + 112, n10 + 74, 64, span(t, a.twenty + .2, a.twenty + 1.0) * (1 - expoIn(span(t, a.space + .2, a.space + .9))), { align: 'left', warm: .7 }); }
    // the Isaacson line (source of the guess), unfolding up out of the hall roof at the left
    const qu = span(t, a.guess + 1.4, a.guess + 2.6) * (1 - span(t, a.space - .4, a.space + .3));
    if (qu > 0) qcardUp(ctx, t, 470, 410, 720, 150, ISAAC, qu, { size: 27 });
    // 1,000,000+ ROBOTS, pinned to the gate
    F.label(ctx, GATE.x + 150, GATE.y + 40, '1,000,000+ ROBOTS', null, span(t, a.million - .3, a.million + .7) * (1 - span(t, a.offices + .5, a.offices + 1.2)), { dx: -40, dy: -120, size: 34 });
  }));
  L.screen.push((ctx, c) => {
    F.source(ctx, t, a.amazon + .5, a.offices + 1.4, F.SOURCES.amazon);
    // the tiles: the three office screens lift off the tower and fly into the bar's fill
    if (t > a.isnt - .1 && t < a.isnt + 2.2) for (let i = 0; i < 3; i++) {
      const [wx, wy] = OFFICE_WIN[i], u = sineIO(span(t, a.isnt + .25 + i * .18, a.isnt + 1.55 + i * .18)); if (u >= 1) continue;
      const p0 = E.project(c, Z_T, wx, wy), p1 = E.project(c, F0, BAR.x0 + 20 + i * 34, BAR.y + 6); if (!p0 || !p1) continue;
      const k = lerp(p0[2], p1[2] * .35, u), [x, y] = qb([p0[0], p0[1]], [lerp(p0[0], p1[0], .5), Math.min(p0[1], p1[1]) - 200], [p1[0], p1[1]], u);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(x, y); ctx.scale(k, k); officeWin(ctx, t, 0, 0, 120, 80, i, 1); ctx.restore();
      halo(ctx, x + 60 * k, y + 40 * k, 80 * k, .3);
    }
  });
}
