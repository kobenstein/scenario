// Film 8 · chunk c10 · the civic end of the street (9.14–9.16) and the people of the bakery street (9.11–9.12). Owner B3.
// All in street units (ground G = 800), drawn through P from f8_c10_world.proj(cam). Figures are drawn under the plane transform with a
// constant scale (the figure caches are keyed by scale, never by the camera).
//   LECTERN, PORTICO, SHOPS            positions
//   lectern(ctx, t, P, o)              the lawmaker in profile writing a rule sheet at a lectern; o = { sheet 0..1 (the sheet rises out of
//                                      the desk), write 0..1, press 0..1, glint }
//   portico(ctx, t, P)                 the public building (pediment, six columns, steps)
//   shops(ctx, t, P, o)                three small places of 9.16: W1 a workshop being built (stone courses), W2 a workshop with a bright
//                                      door and a group, W3 a bakery counter; o = { stone 0..1, join 0..1, coin 0..1, lit[3], crates }
//   people(ctx, t, P, list)            figures on the street: { x, flip, pose, from, u, seed, s, coat, thread: { u, to: [x, y] } }
//   you(ctx, t, P, o)                  "you": the conductor from behind in the foreground, o = { x, pose, from, u }
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, prng } from '../engine.mjs';
import { F8, conductor, workshop, swarm, eoutX, qio } from './f8_kit.mjs';
import { figure, walk } from './figure.mjs';
import { crate, glow } from './f8_c09_world.mjs';
import { waxSeal } from './f8_c09_plate.mjs';
import { G } from './f8_c10_world.mjs';

const TAU = Math.PI * 2, WARM = '#ffcf96', AMBER = '#ffb35c', GOLD = '#f3d9a0', INKC = '#3a2614';
export const LECTERN = { x: -300 };
export const PORTICO = { x0: -1000, x1: -540 };
export const SHOPS = [-1860, -1520, -1190];
const stroke = (ctx, c, w) => { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.stroke(); };
function hatch(ctx, x, y, w, h, gap, ang, a, lw) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.strokeStyle = rgba('#000000', a); ctx.lineWidth = lw; ctx.beginPath();
  const c = Math.cos(ang), s = Math.sin(ang), R = Math.hypot(w, h) / 2 + 2, cx = x + w / 2, cy = y + h / 2;
  for (let d = -R; d <= R; d += gap) { ctx.moveTo(cx - s * d - c * R, cy + c * d - s * R); ctx.lineTo(cx - s * d + c * R, cy + c * d + s * R); }
  ctx.stroke(); ctx.restore();
}

// ---------------------------------------------------------------- 9.14 the lectern
export function lectern(ctx, t, P, o = {}) {
  const x = LECTERN.x, k = P.k, lw = 1.3 / k;
  if (P.X(x + 260) < -40 || P.X(x - 260) > W + 40) return;
  ctx.save(); ctx.setTransform(...P.M);
  // a small raised platform (two steps) and the lectern: a post and a slanted desk
  ctx.fillStyle = '#4a4058'; ctx.fillRect(x - 170, G - 22, 340, 22); ctx.fillStyle = '#54486a'; ctx.fillRect(x - 140, G - 40, 280, 18);
  ctx.strokeStyle = rgba(WARM, .4); ctx.lineWidth = 1.2 * lw; ctx.strokeRect(x - 170, G - 22, 340, 22); ctx.strokeRect(x - 140, G - 40, 280, 18);
  ctx.fillStyle = '#3a2a22'; ctx.fillRect(x + 22, G - 150, 16, 110); ctx.fillRect(x - 4, G - 48, 68, 8);
  const desk = [[x - 18, G - 150], [x + 82, G - 172], [x + 82, G - 160], [x - 18, G - 140]];
  ctx.beginPath(); desk.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); ctx.closePath(); ctx.fillStyle = '#4a3428'; ctx.fill(); stroke(ctx, rgba(WARM, .45), lw);
  ctx.restore();
  // the figure in profile (facing right), writing; on "rules" the hand goes down onto the seal
  ctx.save(); ctx.setTransform(...P.M);
  const pose = o.press > 0 && o.press < 1 ? 'handFlat' : 'handHalf';
  conductor(ctx, t, x - 62, G - 40, .82, { view: 'profile', pose, from: 'handHalf', u: o.press > 0 ? Math.sin(Math.PI * clamp(o.press)) : 1, glow: 0, seed: 21, light: { x: x + 900, y: G - 600, col: F8.amber, a: .9 } });
  ctx.restore();
  // the rule sheet lying on the desk, seen from the front as an inset that rises above it (the camera reads it): engraved lines,
  // the pen writing them, the seal at the bottom
  const sx = x + 20, sy = G - 440, sw = 150, sh = 196, wr = clamp(o.write ?? 0);
  const su = eoutX(clamp(o.sheet ?? 1)); if (su <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.rect(P.X(sx - 14), P.Y(sy + sh * (1 - su) - 14), (sw + 30) * k, (sh * su + 120) * k); ctx.clip();
  ctx.save(); ctx.setTransform(...P.M);
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(sx + 5, sy + 7, sw, sh);
  ctx.fillStyle = '#efe0bc'; ctx.fillRect(sx, sy, sw, sh); ctx.strokeStyle = 'rgba(120,90,50,.55)'; ctx.lineWidth = 1.4; ctx.strokeRect(sx + 6, sy + 6, sw - 12, sh - 12);
  ctx.fillStyle = INKC; ctx.font = '600 13px "Inter"'; try { ctx.letterSpacing = '3px'; } catch { } ctx.fillText('RULES', sx + 18, sy + 28);
  const N = 9; ctx.strokeStyle = rgba(INKC, .8); ctx.lineWidth = 1.6; ctx.beginPath();
  let pen = null;
  for (let i = 0; i < N; i++) { const q = clamp(wr * N - i); if (q <= 0) break; const y = sy + 48 + i * 13, x1 = sx + 18 + (sw - 36 - (i % 3) * 14) * q; ctx.moveTo(sx + 18, y); for (let xx = sx + 18; xx < x1; xx += 3) ctx.lineTo(xx, y + Math.sin(xx * .9 + i) * 1.4); if (q < 1) pen = [x1, y]; }
  ctx.stroke();
  // a thin leader from the desk to the sheet (it is the desk's sheet, shown large)
  ctx.strokeStyle = rgba('#efe0bc', .55); ctx.lineWidth = lw; ctx.setLineDash([3 * lw, 4 * lw]); ctx.beginPath(); ctx.moveTo(x + 50, G - 170); ctx.lineTo(sx + 40, sy + sh); ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
  if (pen) glow(ctx, P.X(pen[0]), P.Y(pen[1]), 14 * k, GOLD, .7, F8.goldCore);
  // the seal at the foot of the sheet
  ctx.save(); ctx.setTransform(...P.M); waxSeal(ctx, t, sx + sw - 34, sy + sh - 30, 17, { press: clamp(o.press ?? 0), glint: o.glint ?? 0, seed: 9 }); ctx.restore();
  if (o.press > 0 && o.press < 1) glow(ctx, P.X(sx + sw - 34), P.Y(sy + sh - 30), 60 * k, '#ffd6c8', .5 * Math.sin(Math.PI * o.press));
  ctx.restore();
}

// ---------------------------------------------------------------- 9.15 the portico
export function portico(ctx, t, P) {
  const { x0, x1 } = PORTICO, k = P.k, lw = 1.3 / k, top = G - 360;
  if (P.X(x1 + 60) < -40 || P.X(x0 - 60) > W + 40) return;
  ctx.save(); ctx.setTransform(...P.M);
  ctx.fillStyle = '#4c4f68'; ctx.fillRect(x0 + 20, top + 40, x1 - x0 - 40, G - top - 70); hatch(ctx, x0 + 20, top + 40, x1 - x0 - 40, G - top - 70, Math.max(7, 4 / k), -1.05, .22, lw * .8);
  // the dark hall behind the columns, warm light inside
  const hg = ctx.createLinearGradient(0, top + 60, 0, G - 40); hg.addColorStop(0, '#221a26'); hg.addColorStop(1, '#3a2a2a'); ctx.fillStyle = hg; ctx.fillRect(x0 + 50, top + 70, x1 - x0 - 100, G - top - 110);
  ctx.fillStyle = rgba(AMBER, .25); ctx.fillRect(x0 + 200, G - 200, 100, 160);
  // pediment + entablature
  ctx.beginPath(); ctx.moveTo(x0 - 10, top + 30); ctx.lineTo((x0 + x1) / 2, top - 70); ctx.lineTo(x1 + 10, top + 30); ctx.closePath(); ctx.fillStyle = '#3a3c54'; ctx.fill(); stroke(ctx, rgba(WARM, .5), 1.6 * lw);
  ctx.fillStyle = '#5a5e7a'; ctx.fillRect(x0 - 14, top + 28, x1 - x0 + 28, 34); ctx.strokeStyle = rgba('#000000', .4); ctx.lineWidth = lw; ctx.strokeRect(x0 - 14, top + 28, x1 - x0 + 28, 34);
  // columns with flutes, then steps
  for (let i = 0; i < 6; i++) {
    const cx = x0 + 30 + i * (x1 - x0 - 60) / 5;
    ctx.fillStyle = '#6a6e8a'; ctx.fillRect(cx - 16, top + 62, 32, G - top - 112); ctx.strokeStyle = rgba('#000000', .35); ctx.lineWidth = lw; ctx.beginPath(); for (let f = -10; f <= 10; f += 7) { ctx.moveTo(cx + f, top + 66); ctx.lineTo(cx + f, G - 54); } ctx.stroke();
    ctx.strokeStyle = rgba(WARM, .4); ctx.beginPath(); ctx.moveTo(cx + 16, top + 62); ctx.lineTo(cx + 16, G - 50); ctx.stroke();
    ctx.fillStyle = '#5a5e7a'; ctx.fillRect(cx - 22, top + 58, 44, 8); ctx.fillRect(cx - 22, G - 58, 44, 8);
  }
  for (let s = 0; s < 3; s++) { ctx.fillStyle = ['#585c78', '#4e526c', '#454860'][s]; ctx.fillRect(x0 - 20 - s * 14, G - 50 + s * 16, x1 - x0 + 40 + s * 28, 16); ctx.strokeStyle = rgba(WARM, .3); ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x0 - 20 - s * 14, G - 50 + s * 16); ctx.lineTo(x1 + 20 + s * 14, G - 50 + s * 16); ctx.stroke(); }
  ctx.restore();
}

// ---------------------------------------------------------------- 9.15–9.16 three small places
export function shops(ctx, t, P, o = {}) {
  const k = P.k, lw = 1.3 / k, lit = o.lit || [1, 1, 1];
  if (P.X(SHOPS[2] + 200) < -40 || P.X(SHOPS[0] - 200) > W + 40) return;
  // W1: a workshop being built: stone courses up to a ragged top, a gap where the last stone goes; scaffold poles
  { const x = SHOPS[0]; ctx.save(); ctx.setTransform(...P.M);
    ctx.strokeStyle = '#5a3e2a'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x - 130, G); ctx.lineTo(x - 130, G - 170); ctx.moveTo(x + 130, G); ctx.lineTo(x + 130, G - 170); ctx.moveTo(x - 140, G - 120); ctx.lineTo(x + 140, G - 120); ctx.stroke();
    const rows = 6, sw = 40, sh = 18;
    for (let r = 0; r < rows; r++) for (let c = 0; c < 6; c++) {
      const sx = x - 120 + c * sw + (r % 2 ? sw / 2 : 0), sy = G - (r + 1) * sh; if (sx + sw > x + 125) continue;
      const last = r === rows - 1 && c === 3; if (last) continue; if (r === rows - 1 && c > 3) continue;
      ctx.fillStyle = ['#7a6a70', '#6e6068', '#84747a'][(r + c) % 3]; ctx.fillRect(sx + 1, sy + 1, sw - 2, sh - 2); ctx.strokeStyle = rgba('#000000', .4); ctx.lineWidth = lw; ctx.strokeRect(sx + 1, sy + 1, sw - 2, sh - 2);
    }
    // the stone in flight (from the hand of "you") and settling into the gap
    const u = clamp(o.stone ?? 0); if (u > 0) { const tx = x - 120 + 3 * sw + sw / 2, ty = G - rows * sh; const fx = o.from ? o.from[0] : x - 300, fy = o.from ? o.from[1] : G - 100, e = eio(u);
      const sx = mix(fx, tx, e), sy = mix(fy, ty, e) - Math.sin(Math.PI * e) * 120; ctx.save(); ctx.translate(sx + sw / 2 - sw / 2, sy + sh / 2); ctx.rotate((1 - e) * 1.4);
      ctx.fillStyle = '#9a8a8e'; ctx.fillRect(-sw / 2 + 1, -sh / 2 + 1, sw - 2, sh - 2); ctx.strokeStyle = rgba('#000000', .5); ctx.lineWidth = lw; ctx.strokeRect(-sw / 2 + 1, -sh / 2 + 1, sw - 2, sh - 2); ctx.restore();
      if (u >= 1) { ctx.strokeStyle = rgba(GOLD, .8 * Math.exp(-(o.stoneT ?? 0) * 3)); ctx.lineWidth = 2 * lw; ctx.strokeRect(tx - sw / 2, ty, sw, sh); } }
    ctx.restore(); }
  // W2: a workshop (kit) with a bright open door and a small group in it
  { const x = SHOPS[1], j = clamp(o.join ?? 0);
    ctx.save(); ctx.setTransform(...P.M); workshop(ctx, t, x, G, 1.35, { lit: lit[1], wall: '#4e3a52', seed: 23, fireflies: 0, glowA: .7, figure: false }); ctx.restore();
    const door = [x + 101 * 1.35, G - 23 * 1.35];
    glow(ctx, P.X(door[0]), P.Y(door[1]), (90 + 80 * j) * k, AMBER, .35 + .35 * j, '#fff1d6');
    // the light of the door spreads on the ground toward the viewer (the invitation)
    if (j > 0) { ctx.save(); ctx.setTransform(...P.M); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, G, 0, G + 260); g.addColorStop(0, rgba(AMBER, .35 * j)); g.addColorStop(1, rgba(AMBER, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(door[0] - 9, G); ctx.lineTo(door[0] + 9, G); ctx.lineTo(door[0] + 9 + 120 * j, G + 260); ctx.lineTo(door[0] - 9 - 160 * j, G + 260); ctx.closePath(); ctx.fill(); ctx.restore(); }
    ctx.save(); ctx.setTransform(...P.M);
    const grp = [[door[0] - 46, false, 'stand'], [door[0] + 30, true, 'stand'], [door[0] + 62, true, 'stand']];
    grp.forEach(([gx, fl, pose], i) => { const wave = i === 1 && j > 0 ? 'handRaised' : 'stand'; conductor(ctx, t, gx, G + 4, .5, { view: 'profile', pose: wave, from: 'stand', u: i === 1 ? eoutX(j * 2) : 1, flip: fl, glow: 0, seed: 30 + i, light: { x: door[0], y: door[1], col: F8.amber, a: 1 } }); });
    ctx.restore(); }
  // W3: a bakery counter under an awning; a baker behind it; the coin lands on the counter
  { const x = SHOPS[2], c = clamp(o.coin ?? 0);
    ctx.save(); ctx.setTransform(...P.M);
    ctx.fillStyle = '#5c4452'; ctx.fillRect(x - 120, G - 200, 240, 200); hatch(ctx, x - 120, G - 200, 240, 200, Math.max(6, 3.5 / k), -1.0, .2, lw * .8);
    ctx.fillStyle = '#ffd89a'; const L = lit[2]; ctx.fillStyle = `rgb(${Math.round(mix(40, 255, L))},${Math.round(mix(28, 214, L))},${Math.round(mix(30, 150, L))})`; ctx.fillRect(x - 96, G - 160, 192, 92);
    ctx.fillStyle = rgba('#5a3418', .85); for (let j = 0; j < 6; j++) { ctx.beginPath(); ctx.ellipse(x - 76 + j * 30, G - 84, 12, 6, 0, 0, TAU); ctx.fill(); }
    ctx.restore();
    ctx.save(); ctx.setTransform(...P.M); conductor(ctx, t, x + 20, G - 40, .55, { view: 'profile', pose: c >= 1 ? 'handHalf' : 'stand', from: 'stand', u: eoutX(((o.coinT ?? 0)) * 3), flip: true, glow: 0, seed: 41, light: { x: x, y: G - 120, col: F8.amber, a: 1 } }); ctx.restore();
    ctx.save(); ctx.setTransform(...P.M);
    ctx.fillStyle = '#6a4a2c'; ctx.fillRect(x - 110, G - 68, 220, 20); ctx.fillStyle = '#4a3020'; ctx.fillRect(x - 104, G - 48, 208, 48); ctx.strokeStyle = rgba(WARM, .45); ctx.lineWidth = lw; ctx.strokeRect(x - 110, G - 68, 220, 20);
    // awning stripes
    for (let j = 0; j < 8; j++) { ctx.fillStyle = j % 2 ? '#e8d6b0' : '#a8553a'; ctx.beginPath(); ctx.moveTo(x - 130 + j * 32.5, G - 200); ctx.lineTo(x - 130 + (j + 1) * 32.5, G - 200); ctx.lineTo(x - 126 + (j + 1) * 32.5, G - 168); ctx.lineTo(x - 126 + j * 32.5, G - 168); ctx.closePath(); ctx.fill(); }
    ctx.strokeStyle = rgba('#000000', .4); ctx.strokeRect(x - 130, G - 200, 260, 32);
    // the coin: an arc from the hand of "you" onto the counter, a glint when it lands
    if (c > 0) { const fx = o.from ? o.from[0] : x - 300, fy = o.from ? o.from[1] : G - 100, e = eio(c), cx = mix(fx, x - 30, e), cy = mix(fy, G - 74, e) - Math.sin(Math.PI * e) * 110;
      ctx.fillStyle = '#e8c070'; ctx.beginPath(); ctx.ellipse(cx, cy, 7, c < 1 ? 7 * Math.abs(Math.cos(e * 9)) + 1 : 2.5, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = '#8a6020'; ctx.lineWidth = 1.2; ctx.stroke(); }
    ctx.restore();
    if (c >= 1) glow(ctx, P.X(x - 30), P.Y(G - 74), 40 * k, '#ffe7b0', .8 * Math.exp(-(o.coinT ?? 0) * 2.5));
    glow(ctx, P.X(x), P.Y(G - 114), 140 * k, AMBER, .3 * L);
  }
  // crates (9.15): flown from the portico steps to each place; on "fund" the lids open and fireflies go in through the windows
  if (o.crates) for (const [i, cr] of o.crates.entries()) {
    const u = clamp(cr.u); if (u <= 0) continue; const e = eio(u), x = mix(cr.from[0], cr.to[0], e), y = mix(cr.from[1], cr.to[1], e) - Math.sin(Math.PI * e) * 90;
    ctx.save(); ctx.setTransform(...P.M); crate(ctx, t, x, y, .9, { seed: 5 + i, lid: .6 * clamp(cr.open ?? 0) }); ctx.restore();
    const op = clamp(cr.open ?? 0);
    if (op > 0) { const q = eoutX(op), cx = P.X(mix(x, cr.win[0], q)), cy = P.Y(mix(y - 40, cr.win[1], q)); swarm(ctx, t, { n: 4, mode: 'orbit', cx, cy, rx: 30 * k * (1 - q * .7) + 4, ry: 14 * k + 2, seed: 9 + i, s: Math.min(.5 * k, 1.2), trail: .25 }); }
  }
}

// ---------------------------------------------------------------- figures on the street
export function people(ctx, t, P, list) {
  ctx.save(); ctx.setTransform(...P.M);
  const hands = [];
  for (const f of list) {
    if (P.X(f.x + 120) < -60 || P.X(f.x - 120) > W + 60) { hands.push(null); continue; }
    const h = conductor(ctx, t, f.x, f.y ?? G + 14, f.s ?? .8, { view: 'profile', pose: f.pose || 'stand', from: f.from || 'stand', u: f.u ?? 1, flip: f.flip, glow: 0, seed: f.seed ?? 3, light: { x: f.x + (f.flip ? -600 : 600), y: G - 500, col: F8.amber, a: .9 } });
    hands.push(h.hand);
  }
  ctx.restore();
  // their threads rise from the hands into the canopy (gold, lighter); the head of a growing thread glows
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  list.forEach((f, i) => {
    const th = f.thread, hd = hands[i]; if (!th || !hd) return; const u = clamp(th.u); if (u <= 0) return;
    const pts = th.path ? th.path(u) : (() => { const e = eout(u), a = [], [x1, y1] = th.to; for (let j = 0; j <= 20; j++) { const q = j / 20 * e; a.push([mix(hd[0], x1, q) + 16 * Math.sin(q * Math.PI * 2 + t), mix(hd[1], y1, q)]); } return a; })();
    ctx.strokeStyle = rgba(GOLD, .32); ctx.lineWidth = Math.max(2, 4 * P.k); ctx.beginPath(); pts.forEach(([x, y], j) => (j ? ctx.lineTo(P.X(x), P.Y(y)) : ctx.moveTo(P.X(x), P.Y(y)))); ctx.stroke();
    ctx.strokeStyle = rgba(F8.goldCore, .9); ctx.lineWidth = Math.max(.8, 1.1 * P.k); ctx.stroke();
    const [hx, hy] = pts[pts.length - 1]; if (u < 1 || th.head) glow(ctx, P.X(hx), P.Y(hy), 14 * Math.max(1, P.k), GOLD, .85, F8.goldCore);
  });
  ctx.restore();
  return hands;
}

// ---------------------------------------------------------------- "you" (the conductor from behind, foreground)
export function you(ctx, t, P, o = {}) {
  ctx.save(); ctx.setTransform(...P.M);
  const r = conductor(ctx, t, o.x, o.y ?? G + 150, o.s ?? 1.25, { view: 'back', pose: o.pose || 'stand', from: o.from || 'stand', u: o.u ?? 1, seed: 8, glow: o.glow ?? .6, light: { x: o.lx ?? o.x + 300, y: G - 200, col: F8.amber, a: 1 } });
  ctx.restore();
  return r;
}
