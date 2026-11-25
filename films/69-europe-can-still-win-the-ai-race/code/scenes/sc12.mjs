// c12 · B3 · SUBSCRIBE 2 + END SCREEN · 'This channel exists' (2nd) → the end. Also the home of B3's shared helpers (exported below):
// the lead's kit (lib/f69_*.mjs) is imported, never edited, and B3 owns only scenes/sc09–sc12.mjs, so the objects that c09–c12 share
// live here; sc09 → sc10 → sc11 → sc12 import "forwards" (no cycles). The finale (ANCHOR 4/4, 10.10 → A.01 → E.01) is ONE take that
// c11 starts at 'Europe was never too small' and c12 continues: the frame at the c11|c12 boundary is the same function on both sides.
//
// | ID    | anchor (phrase)                 | zeigt wörtlich                                                    | kind   | carrier out          |
// |-------|---------------------------------|-------------------------------------------------------------------|--------|----------------------|
// | 10.10 | Europe was never too small      | the plan sheet falls away: thumbnail A again, TOO SMALL struck through, the 27 lights link up, you lift the 5th piece | ANCHOR | the moon |
// | A.01  | This channel exists (2nd)       | the same final picture glides into the end-screen framing; FOR EVERYBODY · MORE VOICES AT THE TABLE · SUBSCRIBE | ANCHOR | the camera |
// | E.01  | (end screen, 15 s, music only)  | the moon centred high (2 HALFWAY · 2 ON PAPER · 1 OPEN), 27 lights linked, you small lifting the 5th piece; free: left + right end cards, subscribe circle | ANCHOR | — |
import { Path2D } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f69_kit.mjs';
import * as S from '../lib/f69_world.mjs';
import * as X from '../lib/f69_explain.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, prng } = E;
const { GOLD, COOL, LAMP, PAPER, CREAM, CREAM2, EARTH, SOURCES: SRC } = F;
const TAU = Math.PI * 2;
const PR = F.PRINT69;

// ======================================================================================================================== B3 HELPERS
// ------------------------------------------------------------------------------------------------ view helpers
// zoom the sheet view v0 onto sheet point p (it travels to the screen centre) up to scale s1; e 0..1 (eased by the caller)
export function zoomView(v0, p, s1, e) {
  const sp = X.toScreen(v0, p[0], p[1]), s = v0.s * Math.pow(s1 / v0.s, e), sx = lerp(sp[0], W / 2, e), sy = lerp(sp[1], H / 2, e);
  return { x: p[0] - (sx - W / 2) / s, y: p[1] - (sy - H / 2) / s, s };
}
export const mixView = (a, b, u) => (u <= 0 ? a : u >= 1 ? b : { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), u)) });
// the sheet ground only below screen y = top: the plan comes up from below over the Leitbild / falls away downwards off it.
// Its top edge is a cream paper edge with a soft shadow above it.
export function sheetFrom(ctx, t, v, top, o = {}) {
  if (top >= H) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (top > -40) { ctx.fillStyle = lin(ctx, 0, top - 70, 0, top, [[0, rgba(P.night0, 0)], [1, rgba(P.night0, .6)]]); ctx.fillRect(0, top - 70, W, 70); }
  ctx.beginPath(); ctx.rect(-20, Math.max(-20, top), W + 40, H + 60); ctx.clip();
  X.sheet(ctx, t, v, o);
  ctx.restore();
  if (top > 2) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = rgba(CREAM, .5 * clamp(top / 30)); ctx.fillRect(0, top, W, 2); ctx.restore(); }
}
// draw fn shifted down by dy screen px (inView-based drawing needs the view shifted instead: shiftView)
export const shiftView = (v, dy) => ({ x: v.x, y: v.y - dy / v.s, s: v.s });

// ------------------------------------------------------------------------------------------------ the two race tracks (8.02, 10.03–10.04)
// Sheet units. A lane = a faint band between two cream edge lines, a dashed centre, distance ticks, a start line. Lane A: THE MOST
// COMPUTERS (crowded with cool compute cells, the big chatbot at its head). Lane B: PUTTING AI TO WORK (ten workshops along it).
export const TR = { x0: 420, x1: 1820, yA: 440, yB: 700, half: 26, sx: 640, step: 120 };
export const shopX = (i) => TR.sx + i * TR.step;
export const SHOP = { w: 92, h: 58 };
export const shopBase = () => TR.yB - TR.half;
export const OLD = [0, 2, 3, 5, 6, 8];   // six of ten: "more than half" are over 100 years old
export const STAR_SHOP = 5;              // the old works we push into (★ 8.04)
export const SAT_SHOP = 1;               // the satellite maker's workshop (8.03)
export const shopWin = (i) => ({ x: shopX(i) - 12, y: shopBase() - 40, w: 24, h: 13.5 });
export function lane(ctx, t, y, u, o = {}) {
  if (u <= 0) return;
  const x0 = o.x0 ?? TR.x0, x1 = lerp(x0, o.x1 ?? TR.x1, sineIO(u)), a = o.a ?? 1, hf = TR.half;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = rgba(o.fill ?? CREAM, .045); ctx.fillRect(x0, y - hf, x1 - x0, hf * 2); ctx.restore();
  for (const dy of [-hf, hf]) X.lightLine(ctx, [[x0, y + dy], [x1, y + dy]], 1, { a: .62 * a, w: 2.2, col: o.col, blur: 6 });
  ctx.save(); ctx.globalAlpha *= a * .35; ctx.strokeStyle = CREAM; ctx.lineWidth = 1.2; ctx.setLineDash([10, 14]); ctx.lineDashOffset = -t * 6;
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.setLineDash([]);
  ctx.globalAlpha = a * .4; ctx.fillStyle = CREAM; for (let x = x0 + 140; x < x1 - 10; x += 140) ctx.fillRect(x, y + hf - 8, 2, 8);
  ctx.restore();
  if (u > .05) X.lightLine(ctx, [[x0, y - hf], [x0, y + hf]], span(u, .05, .3), { a: .8 * a, w: 3 });   // the start line
}
// the lead-ins from the disc rim (cx, cy, r) into the start of each lane; u draws on, out 0..1 retracts them from the disc end
export function leadIns(ctx, t, cx, cy, r, uA, uB, out = 0) {
  for (const [y, u, ang] of [[TR.yA, uA, -.42], [TR.yB, uB, .42]]) {
    if (u <= 0) continue;
    const p0 = [cx + Math.cos(ang) * r, cy + Math.sin(ang) * r], pts = E.catmull([p0, [lerp(p0[0], TR.x0, .55), lerp(p0[1], y, .78)], [TR.x0, y]], 10).map((p) => [p[0], p[1]]);
    const seg = out > 0 ? pts.slice(Math.min(pts.length - 2, Math.floor(clamp(out) * (pts.length - 1)))) : pts;
    if (out < 1) X.lightLine(ctx, seg, u, { a: .7, w: 2.4 });
  }
}
// the big chatbot: a cool speech bubble with three breathing dots (x, y = its centre), u grows it up out of its foot
export function chatBubble(ctx, t, x, y, w, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const k = expoOut(u), h = w * .62, a = o.a ?? 1;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y + (1 - k) * h * .5); ctx.scale(lerp(.3, 1, k), Math.max(.01, k));
  halo(ctx, 0, 0, w * 1.1, .35 * (o.glow ?? 1), COOL.halo, COOL.core);
  ctx.fillStyle = lin(ctx, 0, -h / 2, 0, h / 2, [[0, mixHex(COOL.deep, COOL.body, .55)], [1, mixHex(P.night1, COOL.deep, .7)]]);
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h * .3); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-w * .28, h / 2 - 2); ctx.lineTo(-w * .36, h / 2 + h * .32); ctx.lineTo(-w * .1, h / 2 - 2); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(COOL.core, .55); ctx.lineWidth = Math.max(.6, w * .012); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h * .3); ctx.stroke();
  for (let i = 0; i < 3; i++) { const b = .55 + .45 * Math.sin(t * 3.2 - i * .9); ctx.fillStyle = rgba(COOL.core, .5 + .5 * b); ctx.beginPath(); ctx.arc((i - 1) * w * .2, 0, w * .055 * (.85 + .15 * b), 0, TAU); ctx.fill(); }
  ctx.restore();
}
// lane A's compute: stacks of cool cells (the same cells as the world's compute in the hook) rising out of the lane edge; o.dim
export function computeStacks(ctx, t, u, o = {}) {
  if (u <= 0) return;
  const base = TR.yA - TR.half - 4, c = 22, g = 5, dim = clamp(o.dim ?? 0);
  if (dim < 1) halo(ctx, 1260, base - 60, 520, .16 * (1 - dim) * clamp(u), COOL.halo, COOL.core);
  for (let k = 0; k < 14; k++) {
    const x = 790 + k * 72, n = 2 + ((k * 7 + 3) % 4) + (k % 5 === 2 ? 1 : 0), uk = expoOut(clamp(u * 1.8 - k / 14 * .8));
    if (uk <= 0) continue;
    ctx.save(); ctx.beginPath(); ctx.rect(x - 30, base - 220, 60, 220); ctx.clip();
    for (let j = 0; j < n; j++) {
      const y = base - (j + 1) * (c + g) + (1 - uk) * (n * (c + g) + 10), p = .82 + .18 * Math.sin(t * 2 + k * .7 + j);
      ctx.fillStyle = rgba(mixHex(COOL.body, P.blue1, .5 * dim), (1 - .55 * dim) * .85 * p); ctx.beginPath(); ctx.roundRect(x - c / 2, y, c, c, 4); ctx.fill();
    }
    ctx.restore();
  }
}
// one workshop of lane B (sheet units). o: u (rises out of the lane edge), old 0..1 (turns into an old works: brick, a taller sawtooth
// roof, a chimney), lit (warm windows), ai 0..1 (a cool screen glints in its window), win(ctx) (draws inside the central window)
export function workshop(ctx, t, i, o = {}) {
  const u = expoOut(clamp(o.u ?? 1)); if (u <= 0) return;
  const x = shopX(i), base = shopBase(), w = SHOP.w, old = sineIO(clamp(o.old ?? 0)), h = SHOP.h + 6 * old, x0 = x - w / 2;
  const col = mixHex(mixHex(P.ind1, P.night1, .3), EARTH.body, .5 * old), roofC = mixHex(mixHex(P.ind2, P.blue1, .3), EARTH.warm, .4 * old);
  ctx.save(); ctx.beginPath(); ctx.rect(x0 - 20, base - 170, w + 40, 170); ctx.clip(); ctx.translate(0, (1 - u) * (h + 90));
  if (old > 0) {   // the chimney (brick)
    const chH = 64 * old, cx = x0 + w * .78; ctx.fillStyle = mixHex(col, EARTH.warm, .25);
    ctx.beginPath(); ctx.moveTo(cx - 6, base - h); ctx.lineTo(cx - 4, base - h - chH); ctx.lineTo(cx + 4, base - h - chH); ctx.lineTo(cx + 6, base - h); ctx.fill();
    ctx.fillRect(cx - 5.5, base - h - chH - 4, 11, 4 * old);
  }
  ctx.fillStyle = col; ctx.fillRect(x0, base - h, w, h);
  const teeth = old > .5 ? 4 : 3, th = lerp(12, 20, old); ctx.fillStyle = roofC; ctx.beginPath();
  for (let k = 0; k < teeth; k++) { const a = x0 + k * w / teeth; ctx.moveTo(a, base - h); ctx.lineTo(a + w / teeth, base - h - th); ctx.lineTo(a + w / teeth, base - h); }
  ctx.fill();
  ctx.fillStyle = rgba(mixHex(CREAM, EARTH.rim, old), .3); ctx.fillRect(x0, base - h, w, 1.4);
  const lit = clamp(o.lit ?? 1), wi = shopWin(i);
  for (const dx of [-36, 24]) { ctx.fillStyle = rgba(LAMP.body, (.25 + .55 * lit) * (.85 + .15 * Math.sin(t * .5 + i + dx))); ctx.fillRect(x + dx, base - 38, 12, 10); }
  ctx.fillStyle = mixHex(LAMP.deep, P.night1, .4); ctx.fillRect(wi.x, wi.y, wi.w, wi.h);
  ctx.fillStyle = rgba(LAMP.body, (.3 + .5 * lit) * (.85 + .15 * Math.sin(t * .4 + i))); ctx.fillRect(wi.x, wi.y, wi.w, wi.h);
  const ai = clamp(o.ai ?? 0); if (ai > 0) { ctx.fillStyle = rgba(COOL.body, .9 * ai); ctx.fillRect(wi.x + wi.w * .58, wi.y + wi.h * .3, wi.w * .28, wi.h * .4); halo(ctx, wi.x + wi.w * .72, wi.y + wi.h * .5, 14, .4 * ai, COOL.halo, COOL.core); }
  if (o.win) { ctx.save(); ctx.beginPath(); ctx.rect(wi.x, wi.y, wi.w, wi.h); ctx.clip(); ctx.translate(wi.x, wi.y); ctx.scale(wi.w / 1920, wi.h / 1080); o.win(ctx); ctx.restore(); }
  else { ctx.fillStyle = col; ctx.fillRect(wi.x + wi.w / 2 - .4, wi.y, .8, wi.h); }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ 8.03 the satellite maker (a scene in a window)
// local 1920 × 1080 units (the window maps it). o: shrink 0..1 (the design cycle tightens), cyc (ring shown), phase (the gold mark)
export function satelliteScene(ctx, t, o = {}) {
  ctx.fillStyle = lin(ctx, 0, 0, 0, 1080, [[0, mixHex(P.night1, COOL.deep, .3)], [1, mixHex(P.night0, P.ind1, .4)]]); ctx.fillRect(0, 0, 1920, 1080);
  ctx.fillStyle = rgba(P.night0, .55); ctx.fillRect(0, 860, 1920, 220);
  ctx.fillStyle = rgba(CREAM, .12); ctx.fillRect(0, 860, 1920, 2);
  const sx = 900, sy = 200, sw = 700, sh = 450;   // the big screen
  halo(ctx, sx + sw / 2, sy + sh / 2, 900, .3, COOL.halo, COOL.core);
  ctx.fillStyle = mixHex(P.night0, P.blue1, .3); ctx.fillRect(sx + sw / 2 - 22, sy + sh, 44, 200); ctx.fillRect(sx + sw / 2 - 160, 852, 320, 10);
  ctx.fillStyle = mixHex(P.night0, P.blue2, .5); ctx.beginPath(); ctx.roundRect(sx - 14, sy - 14, sw + 28, sh + 28, 14); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, sy, 0, sy + sh, [[0, mixHex(COOL.deep, COOL.body, .3)], [1, COOL.deep]]); ctx.fillRect(sx, sy, sw, sh);
  ctx.strokeStyle = rgba(COOL.core, .12); ctx.lineWidth = 1.5;
  for (let k = 1; k < 8; k++) { ctx.beginPath(); ctx.moveTo(sx + k * sw / 8, sy); ctx.lineTo(sx + k * sw / 8, sy + sh); ctx.stroke(); }
  for (let k = 1; k < 5; k++) { ctx.beginPath(); ctx.moveTo(sx, sy + k * sh / 5); ctx.lineTo(sx + sw, sy + k * sh / 5); ctx.stroke(); }
  satellite(ctx, t, sx + sw / 2, sy + sh / 2 + 10, 1.2, o.turn ?? t * .7);
  const hand = Math.sin(t * .9) * .12;   // the engineer at the screen, one hand turning the model
  E.person(ctx, 690, 862, 430, { dir: 1, light: .9, look: .35, armR: [1.75 + hand, 2.05 + hand], armL: [-.15, -.1], rim: mixHex(COOL.line, P.blue1, .3), long: true });
  const cyc = clamp(o.cyc ?? 1); if (cyc > 0) {   // the design cycle: three arrows in a loop; it tightens, a gold mark runs round it
    const sh2 = sineIO(clamp(o.shrink ?? 0)), r = lerp(180, 88, sh2), cx = 330, cy = 400;
    ctx.save(); ctx.globalAlpha *= cyc;
    for (let k = 0; k < 3; k++) {
      const a0 = -Math.PI / 2 + k * TAU / 3 + .16, a1 = a0 + TAU / 3 - .32;
      ctx.strokeStyle = rgba(CREAM, .72); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(cx, cy, r, a0, a1); ctx.stroke();
      const ax = cx + Math.cos(a1) * r, ay = cy + Math.sin(a1) * r, d = a1 + Math.PI / 2;
      ctx.fillStyle = rgba(CREAM, .85); ctx.beginPath(); ctx.moveTo(ax + Math.cos(d) * 16, ay + Math.sin(d) * 16); ctx.lineTo(ax + Math.cos(d + 2.4) * 14, ay + Math.sin(d + 2.4) * 14); ctx.lineTo(ax + Math.cos(d - 2.4) * 14, ay + Math.sin(d - 2.4) * 14); ctx.closePath(); ctx.fill();
    }
    const ph = o.phase ?? t * 1.2, gx = cx + Math.cos(ph) * r, gy = cy + Math.sin(ph) * r;
    halo(ctx, gx, gy, 60, .7, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(gx, gy, 10, 0, TAU); ctx.fill();
    ctx.restore();
  }
}
// a satellite in cool line light: a body box, a dish, two solar wings that turn about the vertical axis (rot)
export function satellite(ctx, t, x, y, s, rot) {
  const c = Math.cos(rot), sd = Math.sin(rot), bw = 120 * s * (.62 + .38 * Math.abs(c)), bh = 100 * s;
  ctx.save(); ctx.translate(x, y + Math.sin(t * .8) * 4);
  ctx.strokeStyle = rgba(COOL.core, .9); ctx.lineWidth = 2.5; ctx.fillStyle = rgba(COOL.body, .18); ctx.lineJoin = 'round';
  for (const side of [-1, 1]) {
    const ww = 190 * s * Math.max(.06, Math.abs(c)), wx = side * (bw / 2 + 20 * s), xa = side > 0 ? wx : wx - ww, xb = side > 0 ? wx + ww : wx;
    ctx.globalAlpha = .6 + .4 * Math.max(0, side * sd);
    ctx.beginPath(); ctx.moveTo(side * bw / 2, 0); ctx.lineTo(wx, 0); ctx.stroke();
    ctx.beginPath(); ctx.rect(xa, -36 * s, xb - xa, 72 * s); ctx.fill(); ctx.stroke();
    for (let k = 1; k < 4; k++) { const xx = lerp(xa, xb, k / 4); ctx.beginPath(); ctx.moveTo(xx, -36 * s); ctx.lineTo(xx, 36 * s); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(xa, 0); ctx.lineTo(xb, 0); ctx.stroke();
  }
  ctx.globalAlpha = 1; ctx.fillStyle = rgba(COOL.body, .3); ctx.beginPath(); ctx.rect(-bw / 2, -bh / 2, bw, bh); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-bw / 2, -bh / 6); ctx.lineTo(bw / 2, -bh / 6); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(sd * bw * .2, -bh / 2 - 26 * s, 34 * s * (.4 + .6 * Math.abs(c)), 14 * s, 0, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(sd * bw * .2, -bh / 2 - 12 * s); ctx.lineTo(sd * bw * .1, -bh / 2); ctx.stroke();
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ 8.04 ★ the old works, opened (sheet units)
// drawn over STAR_SHOP after it turned old. o: cut 0..1 (the front wall opens from the middle), data 0..1 (decades of drawings light up
// shelf by shelf, oldest first: GOLD, the hero), net 0..1 (the internet comes in from the right and ends at the wall), bot 0..1 (a
// chatbot: its reading beam stops at the wall). Returns the interior rect (sheet units): the carrier for the clip plate.
export function worksOpen(ctx, t, o = {}) {
  const x = shopX(STAR_SHOP), base = shopBase(), w = SHOP.w, h = SHOP.h + 6, x0 = x - w / 2;
  const ins = { x: x0 + 5, y: base - h + 6, w: w - 10, h: h - 8 };
  const net = clamp(o.net ?? 0);
  if (net > 0) {
    const r = prng(77), nodes = [];
    for (let k = 0; k < 30; k++) nodes.push([x0 + w + 4 + Math.pow(r(), .8) * 160, base - 8 - r() * 96, r()]);
    nodes.push([x0 + w + 1.5, base - 30, 0], [x0 + w + 1.5, base - 52, .05], [x0 + w + 1.5, base - 14, .1]);
    const reachOf = (px) => clamp(net * 1.7 - (1 - (px - x0 - w) / 160) * .95 - .1);
    ctx.save(); ctx.lineCap = 'round';
    for (let a = 0; a < nodes.length; a++) for (let b = a + 1; b < nodes.length; b++) {
      const A = nodes[a], B = nodes[b]; if (Math.hypot(A[0] - B[0], A[1] - B[1]) > 32) continue;
      const [P0, P1] = A[0] > B[0] ? [A, B] : [B, A], reach = reachOf(P1[0]) > 0 ? 1 : clamp(reachOf(P0[0]) * 3);   // links grow right → left
      if (reachOf(P0[0]) <= 0) continue;
      ctx.strokeStyle = rgba(COOL.body, .5); ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(P0[0], P0[1]); ctx.lineTo(lerp(P0[0], P1[0], reach), lerp(P0[1], P1[1], reach)); ctx.stroke();
    }
    for (const [nx, ny, q] of nodes) { const re = reachOf(nx); if (re <= 0) continue; ctx.fillStyle = rgba(COOL.core, .85 * clamp(re * 3) * (.75 + .25 * Math.sin(t * 2 + q * 9))); ctx.beginPath(); ctx.arc(nx, ny, 1.5, 0, TAU); ctx.fill(); }
    const wall = clamp((net - .7) * 4); if (wall > 0) { ctx.fillStyle = rgba(CREAM, .75 * wall); ctx.fillRect(x0 + w - .4, base - h, 1.6, h); }   // the wall: the net ends here
    ctx.restore();
  }
  const bot = clamp(o.bot ?? 0);
  if (bot > 0) {   // the chatbot outside: its reading beam hits the wall and stops
    const bx = x0 + w + 66, by = base - 80, k = expoOut(bot);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(ctx, bx, by, x0 + w, base - 30, [[0, rgba(COOL.body, .3 * k)], [1, rgba(COOL.body, .08 * k)]]);
    const reach = lerp(bx - 8, x0 + w + .8, clamp(bot * 1.5));
    ctx.beginPath(); ctx.moveTo(bx - 8, by + 3); ctx.lineTo(reach, lerp(by + 3, base - 58, clamp(bot * 1.5))); ctx.lineTo(reach, lerp(by + 3, base - 6, clamp(bot * 1.5))); ctx.closePath(); ctx.fill(); ctx.restore();
    chatBubble(ctx, t, bx, by, 28, { u: bot, glow: .5 });
  }
  const cut = sineIO(clamp(o.cut ?? 0)); if (cut <= 0) return ins;
  const ox = ins.x + ins.w / 2, cw = ins.w * cut;
  ctx.save(); ctx.beginPath(); ctx.rect(ox - cw / 2, ins.y, cw, ins.h); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, ins.y, 0, ins.y + ins.h, [[0, mixHex(P.night1, EARTH.deep, .35)], [1, mixHex(P.night0, EARTH.deep, .3)]]); ctx.fillRect(ins.x, ins.y, ins.w, ins.h);
  const data = clamp(o.data ?? 0), rows = 4, cols = 7;
  if (data > 0) halo(ctx, ox, ins.y + 15, 52, .5 * data, GOLD.halo, GOLD.core);
  for (let rI = 0; rI < rows; rI++) {   // shelves of drawings: the bottom shelf is the oldest; they light up from the bottom to the top
    const yy = ins.y + 4 + rI * 7.2, ru = clamp(data * 1.7 - (rows - 1 - rI) / rows * .9);
    ctx.fillStyle = rgba(EARTH.line, .4); ctx.fillRect(ins.x + 3, yy + 5.4, ins.w - 6, .6);
    for (let cI = 0; cI < cols; cI++) {
      const cwid = (ins.w - 8) / cols, px = ins.x + 4 + cI * cwid, q = clamp(ru * 1.5 - cI / cols * .5), fl = .85 + .15 * Math.sin(t * 1.3 + rI * 2 + cI);
      ctx.fillStyle = q > 0 ? mixHex(PAPER.shade, GOLD.hot, q * fl) : rgba(PAPER.shade, .35); ctx.fillRect(px, yy + (cI % 2) * .4, cwid - 1.6, 4.6);
      if (q > .3) { ctx.fillStyle = rgba(GOLD.deep, .5); ctx.fillRect(px + .6, yy + 1.4, cwid * .55, .35); ctx.fillRect(px + .6, yy + 2.6, cwid * .4, .35); }
    }
  }
  for (let k = 0; k < 3; k++) {   // three old machines on the floor
    const mx = ins.x + 14 + k * 27, my = ins.y + ins.h;
    ctx.fillStyle = mixHex(P.night0, EARTH.deep, .5); ctx.fillRect(mx - 9, my - 14, 18, 14); ctx.fillRect(mx - 4, my - 20, 8, 6); ctx.fillRect(mx + 4, my - 17, 9, 3);
    ctx.fillStyle = rgba(LAMP.body, .7 * (.8 + .2 * Math.sin(t * 1.7 + k))); ctx.fillRect(mx - 6, my - 10, 2.2, 1.6);
  }
  ctx.restore();
  return ins;
}

// ------------------------------------------------------------------------------------------------ data boxes (8.07)
export const DB = { n: 12, base: 640, x0: 328, step: 115, w: 86, enough: 470, cols: 4, rows: 3, bh: 62 };
const DBH = [52, 64, 42, 70, 58, 46, 66, 54, 60, 48, 72, 40];
export const DB_PLATE = 5;   // the clip plate shrinks into this box
export const dbBox = (k) => ({ x: DB.x0 + k * DB.step - DB.w / 2, y: DB.base - DBH[k], w: DB.w, h: DBH[k] });
export const dbSlot = (k) => { const c = k % DB.cols, r = Math.floor(k / DB.cols), bx = 960 - DB.cols * DB.w / 2; return { x: bx + c * DB.w, y: DB.base - (r + 1) * DB.bh, w: DB.w, h: DB.bh }; };
export const dbBlock = () => ({ x: 960 - DB.cols * DB.w / 2, y: DB.base - DB.rows * DB.bh, w: DB.cols * DB.w, h: DB.rows * DB.bh });
export function dataBox(ctx, t, b, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || b.w < 1 || b.h < 1) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fillRect(b.x + 1, b.y + 1, b.w - 2, b.h - 2);
  ctx.save(); ctx.beginPath(); ctx.rect(b.x + 3, b.y + 3, b.w - 6, b.h - 6); ctx.clip();
  const rows = Math.max(1, Math.floor((b.h - 8) / 7)), sd = o.seed ?? 0;
  for (let j = 0; j < rows; j++) { const q = .7 + .3 * Math.sin(t * 1.7 + j * 1.3 + sd); ctx.fillStyle = rgba(COOL.body, .55 * q); ctx.fillRect(b.x + 7, b.y + 6 + j * 7, (b.w - 14) * (.45 + .5 * (((j + sd) * 37) % 10) / 10), 2.4); }
  ctx.restore();
  ctx.strokeStyle = rgba(o.gold ? GOLD.line : CREAM, .72); ctx.lineWidth = 1.6; ctx.strokeRect(b.x + 1, b.y + 1, b.w - 2, b.h - 2);
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ hands, ballot, plan board, table
// a flat hand silhouette (no light hand, no faces): wrist at (x, y), fingers along ang, palm length L; the forearm reaches out of frame
export function flatHand(ctx, x, y, ang, L, o = {}) {
  const m = E.handMatrix(x, y, ang, L, o.flip ?? 1), p = new Path2D(); p.addPath(E.handPath({ pose: o.pose ?? 'open', curl: o.curl ?? 0 }), m);
  const arm = new Path2D(); arm.moveTo(-.05, -.37); arm.lineTo(-12, -.66); arm.lineTo(-12, .86); arm.lineTo(-.05, .38); arm.closePath();
  const ext = new Path2D(); ext.addPath(arm, m);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  const c = o.col ?? mixHex(P.ind2, P.blue1, .55);
  ctx.fillStyle = c; ctx.fill(ext); ctx.fill(p);
  ctx.strokeStyle = rgba(o.rim ?? CREAM, .5); ctx.lineWidth = Math.max(1, L * .025); ctx.stroke(p);
  ctx.restore();
}
// a hand that comes in along its own axis: u 0..1 (0 = far out, back along -ang); returns the wrist point
export function handIn(ctx, t, tx, ty, ang, L, u, o = {}) {
  if (u <= 0) return null;
  const k = expoOut(clamp(u)), out = (1 - k) * (o.reach ?? 1000), x = tx - Math.cos(ang) * out, y = ty - Math.sin(ang) * out;
  flatHand(ctx, x + Math.sin(t * .9 + (o.seed ?? 0)) * 2.5, y + Math.cos(t * .7 + (o.seed ?? 0)) * 2.5, ang, L, o);
  return [x, y];
}
// the ballot: a small folded cream slip with one empty box printed on it (never a cross)
export function ballot(ctx, t, x, y, w, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const h = w * .62;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? -.08);
  ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-w / 2 + 4, -h / 2 + 5, w, h);
  ctx.fillStyle = lin(ctx, 0, -h / 2, 0, h / 2, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.fillStyle = rgba(PAPER.edge, .5); ctx.fillRect(-w / 2, -1, w, 2);
  ctx.strokeStyle = rgba(PAPER.ink, .6); ctx.lineWidth = 2; ctx.strokeRect(w * .2, -h * .34, h * .26, h * .26);
  ctx.fillStyle = rgba(PAPER.faint, .6); ctx.fillRect(-w * .4, -h * .26, w * .5, 2.5); ctx.fillRect(-w * .4, h * .12, w * .6, 2.5); ctx.fillRect(-w * .4, h * .26, w * .4, 2.5);
  ctx.restore();
}
// the plan board (as in the hook, but square to the screen, so the disc on it can match the moon): x, y centre, w
export function planBoard(ctx, t, x, y, w) {
  const h = w * .66;
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(-w / 2 + 10, -h / 2 + 14, w, h);
  ctx.fillStyle = lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, mixHex(P.blue0, P.ind1, .35)], [1, mixHex(P.ind1, P.night1, .4)]]); ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.strokeStyle = rgba(CREAM, .12); ctx.lineWidth = 1;
  for (let i = 1; i < 12; i++) { ctx.beginPath(); ctx.moveTo(-w / 2 + i * w / 12, -h / 2); ctx.lineTo(-w / 2 + i * w / 12, h / 2); ctx.stroke(); }
  for (let j = 1; j < 8; j++) { ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2 + j * h / 8); ctx.lineTo(w / 2, -h / 2 + j * h / 8); ctx.stroke(); }
  ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 2; ctx.strokeRect(-w / 2 + 14, -h / 2 + 14, w - 28, h - 28);
  ctx.restore();
  return { disc: [x - w * .12, y, h * .32], machine: [x + w * .3, y + h * .12, w * .24], w, h };
}
// the negotiating table (side view): top at y from x0 to x1 (u draws it out from the middle), legs
export function table(ctx, t, x0, x1, y, u = 1) {
  if (u <= 0) return;
  const k = sineIO(clamp(u)), cx = (x0 + x1) / 2, a = lerp(cx, x0, k), b = lerp(cx, x1, k);
  ctx.fillStyle = mixHex(P.night1, P.blue1, .32); ctx.fillRect(a, y, b - a, 22);
  ctx.fillStyle = rgba(mixHex(GOLD.line, P.blue1, .5), .35); ctx.fillRect(a, y, b - a, 2);
  const lh = 150 * clamp(u * 2 - 1); if (lh > 0) { ctx.fillStyle = mixHex(P.night1, P.blue1, .32); ctx.fillRect(x0 + 50, y + 22, 14, lh); ctx.fillRect(x1 - 64, y + 22, 14, lh); }
}
// the Draghi report (1.07): a cream cover, x, y = centre, w; o.flip (−1..1 card flip), o.rot. Returns its rect.
export function report(ctx, t, x, y, w, o = {}) {
  const h = w * 1.32, flip = o.flip ?? 1;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.scale(Math.max(.02, flip), 1);
  ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(-w / 2 + 6, -h / 2 + 9, w, h);
  ctx.fillStyle = lin(ctx, 0, -h / 2, 0, h / 2, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.fillStyle = rgba(PAPER.edge, .8); ctx.fillRect(-w / 2, -h / 2, w * .05, h);
  ctx.fillStyle = mixHex(GOLD.mid, GOLD.deep, .3); ctx.fillRect(-w * .36, -h * .02, w * .62, Math.max(1.5, w * .012));
  const fs = w * .1;
  E.glowText(ctx, 'THE FUTURE OF', -w * .36, -h * .24, { size: Math.max(4, fs * .6), weight: 700, col: PAPER.faint, glow: false, spacing: .08 });
  E.glowText(ctx, 'European', -w * .36, -h * .24 + fs * 1.15, { size: fs * 1.15, serif: true, col: PAPER.ink, glow: false });
  E.glowText(ctx, 'competitiveness', -w * .36, -h * .24 + fs * 2.25, { size: fs * 1.15, serif: true, col: PAPER.ink, glow: false });
  E.glowText(ctx, 'MARIO DRAGHI · SEPTEMBER 2024', -w * .36, h * .1, { size: Math.max(4, fs * .48), weight: 700, col: PAPER.faint, glow: false, spacing: .08 });
  ctx.restore();
  return { x: x - w / 2, y: y - h / 2, w, h };
}
// the kitchen window (the savings): a warm window with a lamp, a table and a jar of coins; x, y = window centre, w; u rises it
export function kitchenWindow(ctx, t, x, y, w, o = {}) {
  const u = expoOut(clamp(o.u ?? 1)); if (u <= 0) return;
  const h = w * .82;
  ctx.save(); ctx.beginPath(); ctx.rect(x - w, y - h * 1.2, w * 2, h * 1.2 + (o.clipY ?? h)); ctx.clip(); ctx.translate(x, y + (1 - u) * h * 1.4);
  ctx.fillStyle = mixHex(P.ind1, P.night1, .4); ctx.fillRect(-w / 2 - 22, -h / 2 - 22, w + 44, h + 44);
  ctx.fillStyle = lin(ctx, 0, -h / 2, 0, h / 2, [[0, mixHex(LAMP.deep, P.night1, .2)], [1, mixHex(LAMP.body, LAMP.deep, .4)]]); ctx.fillRect(-w / 2, -h / 2, w, h);
  halo(ctx, -w * .1, -h * .18, w * .7, .55 * (.92 + .08 * Math.sin(t * 1.1)), LAMP.body, LAMP.core);
  ctx.fillStyle = mixHex(P.night1, EARTH.deep, .4); ctx.fillRect(-w / 2, h * .18, w, h * .06); ctx.fillRect(-w * .36, h * .24, w * .04, h * .26); ctx.fillRect(w * .32, h * .24, w * .04, h * .26);
  ctx.strokeStyle = rgba(P.night0, .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-w * .1, -h / 2); ctx.lineTo(-w * .1, -h * .3); ctx.stroke();
  ctx.fillStyle = mixHex(P.night0, LAMP.deep, .3); ctx.beginPath(); ctx.moveTo(-w * .18, -h * .18); ctx.lineTo(-w * .02, -h * .18); ctx.lineTo(-w * .06, -h * .3); ctx.lineTo(-w * .14, -h * .3); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(CREAM, .45); ctx.fillRect(w * .1, h * .0, w * .14, h * .18);   // the jar of savings
  for (let k = 0; k < 4; k++) { ctx.fillStyle = mixHex(GOLD.mid, LAMP.body, .4); ctx.beginPath(); ctx.ellipse(w * .17, h * .15 - k * h * .03, w * .055, h * .014, 0, 0, TAU); ctx.fill(); }
  ctx.strokeStyle = mixHex(P.ind1, P.night1, .4); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, -h / 2); ctx.lineTo(0, h / 2); ctx.moveTo(-w / 2, -h * .05); ctx.lineTo(w / 2, -h * .05); ctx.stroke();
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ the verdict disc with labels (10.01–10.02)
// like F.kitHud(o.big), drawn by B3 so the disc can stay put while labels and date tags come and go. o: lab 0..1, tags [5 × 0..1], stars
export const VD = { x: 960, y: 410, r: 220 };
export const LOOSE = (cx, cy, r) => ({ x: cx + r * 1.56, y: cy + r * .52, rot: .35 });
export function verdictDisc(ctx, t, parts, cx, cy, r, o = {}) {
  if ((o.stars ?? 0) > 0) F.kitDisc(ctx, t, cx, cy, r, F.KIT.parts.map(() => ({ kind: 'blank', u: 0, fade: 0 })), { glow: 0, stars: o.stars, loose: false });   // only the ring of 12
  F.kitDisc(ctx, t, cx, cy, r, parts, { glow: o.glow ?? 1, stars: 0, loose: o.loose ?? LOOSE(cx, cy, r) });
  const labs = Array.isArray(o.lab) ? o.lab : [0, 1, 2, 3, 4].map(() => o.lab ?? 0), tag = o.tags ?? [];
  if (Math.max(...labs) <= 0) return;
  F.KIT.parts.forEach((p, i) => {
    const q = F.PIECE_ANG[i], lx = cx + Math.cos(q) * r * 1.42, ly = cy + Math.sin(q) * r * 1.42 + (i === 2 ? -6 : 0), al = Math.abs(Math.cos(q)) < .3 ? 'center' : Math.cos(q) > 0 ? 'left' : 'right';
    const st = parts[i], li = clamp(labs[i]), lo = clamp(o.out ?? 0);
    const sink = (u) => F.rise(u) * (1 - expoIn(clamp(lo * 1.4 - i * .08)));
    F.goldText(ctx, [[p.name, 0]], lx, ly, 26, sink(li), { serif: false, weight: 700, spacing: .06, align: al, col: CREAM });
    if (st.kind !== 'blank') F.goldText(ctx, [[p.verdict, st.kind === 'half' ? 1 : 0]], lx, ly + 34, 24, sink(clamp(li - .15)), { serif: false, weight: 700, spacing: .1, align: al, col: st.kind === 'half' ? GOLD.text : CREAM2 });
    const tu = clamp(tag[i] ?? 0) * (1 - clamp(lo * 1.6)); if (tu > 0) {
      const txt = SRC.started[i], tw = F.measure(txt, 22, false, 600) * 1.08 + 44 + txt.length * 22 * .06, tx = al === 'center' ? lx : al === 'left' ? lx + tw / 2 : lx - tw / 2;
      X.dateTag(ctx, txt, tx, i === 2 ? ly - 52 : ly + 74, tu);
    }
  });
}
// the moon's path on the water for a disc drawn in screen space (seaWorld draws it only for its own moon)
export function moonPath(ctx, t, x, r, gold, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  for (let k = 0; k < 16; k++) {
    const f = k / 15, y = S.HZN + 8 + f * f * (H - S.HZN - 8), w = 20 + f * r * 1.1, jx = Math.sin(t * 1.3 + k * 2.3) * (6 + f * 30);
    ctx.fillStyle = rgba(gold > .3 ? GOLD.line : COOL.line, (.12 + .5 * gold) * a * (1 - f * .6) * (.7 + .3 * Math.sin(t * 2 + k))); ctx.fillRect(x - w / 2 + jx, y, w, 3 + f * 5);
  }
  ctx.restore();
}
// a big plan disc flies up into the KIT HUD (top right) and becomes it: from = { x, y, r, glow, lx, ly, rot } (screen; lx, ly = the loose
// piece's offset in disc radii), u 0..1; at u = 1 the lead's F.kitHud takes over with the identical picture. o.dx/dy shift the HUD.
export function discToHud(ctx, t, T, from, u, o = {}) {
  if (u >= 1) { F.kitHud(ctx, t, T, { dx: o.dx, dy: o.dy }); return; }
  const e = sineIO(clamp(u)), parts = F.kitParts(T, t).parts, Hd = F.HUD;
  const cx = lerp(from.x, Hd.x, e) + (o.dx ?? 0) * e, cy = lerp(from.y, Hd.y, e) + (o.dy ?? 0) * e, r = Math.exp(lerp(Math.log(from.r), Math.log(Hd.r), e));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  F.kitDisc(ctx, t, cx, cy, r, parts, { glow: lerp(from.glow ?? .8, .35, e), stars: 0, loose: { x: cx + r * lerp(from.lx ?? 1.32, 1.3, e), y: cy + r * lerp(from.ly ?? 1.06, 1.1, e), rot: lerp(from.rot ?? .35, .35, e) } });
  ctx.restore();
}
// the clip plate at morph 0 is a dark card with a cream edge; this draws that card (flip −1..1 = a card flip) so an object can flip into it
export function darkCard(ctx, b, flip = 1) {
  const k = Math.max(.02, Math.abs(flip)), cx = b.x + b.w / 2;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(cx, 0); ctx.scale(k, 1); ctx.translate(-cx, 0);
  ctx.beginPath(); ctx.roundRect(b.x, b.y, b.w, b.h, Math.min(8, b.w / 2)); ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.fill();
  ctx.strokeStyle = P.cream; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
}
export const goldOf = (parts) => parts.reduce((a, p) => a + (p.kind === 'gold' ? 1 : p.kind === 'half' ? .6 * clamp(p.u) : 0), 0) / 4;

// ======================================================================================================================== THE FINALE (10.10 → E.01)
// One take from 'Europe was never too small' to the last frame. Starts where c11's harvest ends: the plan sheet (with the three harvest
// objects, drawn by c11 through o.sheet) falls away downwards and uncovers thumbnail A. The camera then glides from thumbnail A's framing
// (HOME, the moon upper right on its far card) into the end-screen framing (the moon centred high, you small in the middle) by the end of
// the subscribe call; the end screen keeps the lead's slow pull-back (S.endScreen), refined: same camera as A.01 (no jump), the moon
// drawn in screen space so it can travel, the 27 links breathing, the lower half calm for the end cards.
const memo = new WeakMap();
export function finaleAnchors(T) {
  if (memo.has(T)) return memo.get(T);
  const never = T.G('Europe was never too small'), only = T.G('The only question is whether'), ch = T.G('This channel exists', 1);
  const A = { never, too: T.G('too small for this race', 0, never), only, together: T.G('puts itself together', 0, only), ch,
    every: T.G('goes well for everybody', 0, ch), voices: T.G('That takes more voices', 0, ch), want: T.G('Want that too', 0, ch), sub: T.G('Then subscribe', 0, ch),
    subE: T.GE('Then subscribe', 0, ch), end: T.duration, es: T.duration - 15 };
  memo.set(T, A); return A;
}
// the end-screen camera of the lead (S.endScreen) at time t (k = slow pull back after the end screen starts)
const endCam = (t, A) => { const k = 1 - .006 * Math.max(0, t - A.es); return E.aim(S.Z_ROOF, S.ROOF.you + 30, S.ROOF.y - 200, .92 * k, 960, 600); };
const keepAbove = (c, gap = 40) => ({ ...c, y: Math.min(c.y, (S.HZN - H / 2) * c.z / E.F0 + S.HH - gap) });
// o.sheet(ctx, t, dy): c11 draws its sheet content shifted down by dy (screen px) while it falls away
export function finale(ctx, t, T, o = {}) {
  const A = finaleAnchors(T);
  const fall = sineIO(span(t, A.never - .35, A.never + 1.5)), dy = fall * (H + 160);
  // camera: thumbnail A (HOME with a slow breath) → the end-screen framing (glide 1.6 s after 'everybody' … 'subscribe')
  const g0 = A.voices - .6, g1 = A.sub + .4, g = sineIO(span(t, g0, g1));
  const home = E.camDrift(E.cam3({ x: 50 * sineIO(span(t, A.never, g0)), y: -22 * sineIO(span(t, A.never, g0)), z: 420 * sineIO(span(t, A.never, g0)) }), t, .9);
  const c = g <= 0 ? home : g >= 1 ? keepAbove(endCam(t, A)) : F.camPath(t, [[g0, home], [g1, keepAbove(endCam(g1, A))]]);
  // the moon: on its far card at thumbnail A's place, then in screen space to the end screen's place (centred high, r 170)
  const pm = E.project(home, S.Z_MOON, S.MOON.x, S.MOON.y), m0 = pm ? [pm[0], pm[1], S.MOON.r * pm[2]] : [S.MOON.x, S.MOON.y, S.MOON.r];
  const mx = lerp(m0[0], 960, g), my = lerp(m0[1], 270, g), mr = lerp(m0[2], 170, g);
  const parts = S.END_PARTS;
  const links = sineIO(span(t, A.together - .2, A.together + 3.2)), lift = sineIO(span(t, A.only + .3, A.together + 2.0));
  S.seaWorld(ctx, c, t, { moon: false, links: { u: links, a: .45 + .08 * Math.sin(t * .7) }, lit: .9, away: .2,
    you: { h: lerp(190, 150, g), piece: { u: lift, kind: 'blank', lit: 1, r: lerp(132, 120, g), glow: .6, rot: lerp(-.55, -.35, lift) } } });
  // the puzzle moon (screen space), its ring of 12 and its path on the water
  F.kitDisc(ctx, t, mx, my, mr, F.KIT.parts.map(() => ({ kind: 'blank', u: 0, fade: 0 })), { glow: 0, stars: 1, loose: false });
  F.kitDisc(ctx, t, mx, my, mr, parts, { glow: .9 + .06 * Math.sin(t * .5), stars: 0, loose: false });
  moonPath(ctx, t, mx, mr, goldOf(parts), 1);
  // TOO SMALL (callback H.02 / H.15): the tile comes in on 'never … too small', a gold line strikes it through, then it tips away
  const ts = span(t, A.never + .9, A.never + 1.6), tf = span(t, A.only - .5, A.only + .3);
  if (ts > 0 && tf < 1) {
    const tx = 560, ty = 400; F.headTile(ctx, t, tx, ty, 640, 'TOO SMALL', { u: ts, rot: -.04, fall: tf });
    const st = span(t, A.too + .1, A.too + .7) * (1 - tf); X.lightLine(ctx, [[tx - 290, ty + 10], [tx + 290, ty - 12]], st, { w: 6, col: rgba(GOLD.hot, .95) });
  }
  // the plan sheet falls away (c11's harvest on it)
  if (fall < 1 && o.sheet) o.sheet(ctx, t, dy);
  // subscribe 2: three short lines at the left, each held ≥ 1.5 s, sinking behind their mask
  const L1 = span(t, A.every - .3, A.every + .4) * (1 - span(t, A.voices - .45, A.voices - .05));
  const L2 = span(t, A.voices + .05, A.voices + .75) * (1 - span(t, A.sub - .45, A.sub - .05));
  const L3 = span(t, A.sub, A.sub + .6) * (1 - span(t, A.es - 1.4, A.es - .6));
  X.label(ctx, 'SO SUPERINTELLIGENCE', 140, 420, L1, { align: 'left', size: 34, spacing: .12 });
  X.label(ctx, 'GOES WELL FOR EVERYBODY', 140, 470, span(L1, .15, 1), { align: 'left', size: 34, spacing: .12, gold: .5, col: GOLD.text });
  X.big(ctx, 'More voices', 140, 470, 84, L2, { align: 'left', gold: .2 });
  X.big(ctx, 'at the table', 140, 556, 84, span(L2, .12, 1), { align: 'left', gold: .2 });
  if (L3 > 0) { F.verdict(ctx, t, 140, 470, 'SUBSCRIBE', L3, { size: 46, align: 'left' }); }
}

// ======================================================================================================================== c12 entries
export default async (T, R) => {
  const draw = (ctx, t) => finale(ctx, t, T);
  const A = finaleAnchors(T);
  const marks = [R.a, A.every, A.voices, A.sub, A.es].filter((x) => x >= R.a && x < R.b);
  return marks.map((t) => ({ t, draw, print: PR }));
};
