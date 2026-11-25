// Film 71 · B2 (c07–c11, ENDINGS 6 → 2) · additive helpers (owned by B2; the shared kit lib/f71_kit.mjs + lib/f71_world.mjs stay untouched).
//   · camera helpers (seam creep continuation, a door fly-through for the ranked row, ref overlays as in sc01)
//   · the B2 mornings (same recipe as S.rooms: warm wall, ONE window = the hero light, you small): wood room (6), street window (5),
//     kitchen with the helper (4), bedroom with the rent notice (3), the street (2)
//   · the B2 explainer objects (cables + plug, school, locker, AI monitor, throne, world disc + sectors, glass case, balance, booth, gate,
//     sentinel, workshop, helper, law sheet, coins, ruler, register, plot + fence + hall, shimmer, car, walk signal, cloud, ring, survey)
//   · flyTag: a switch tag that flies into its door's mini tag in the counter HUD
// Colour code as everywhere: COOL = machines, CREAM = text / paper, LAMP = people's windows, GOLD only for hope (the gold door).
import * as F from './f71_kit.mjs';
import * as S from './f71_world.mjs';
import { Path2D, PathOp } from '@napi-rs/canvas';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, rad, prng, GOLD, CREAM, CREAM2, COOL, PAPER, LAMP, DATA } = F;
const TAU = Math.PI * 2;

// ------------------------------------------------------------------------------------------------ camera helpers
export const ref = (ctx, vd) => ctx.transform(1 / vd.s, 0, 0, 1 / vd.s, vd.x - W / 2 / vd.s, vd.y - H / 2 / vd.s);
export const inRef = (ctx, v, vd, fn, a = 1) => { if (a <= .002) return; F.inView(ctx, v, () => { ref(ctx, vd); ctx.globalAlpha *= a; fn(); }); };
export const mixV = (a, b, u) => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), u)) });
export const shiftV = (v, dx, dy) => ({ x: v.x + dx, y: v.y + dy, s: v.s });
// the seam plate creeps 4 %/s from SEAM_HALF before the seam; after the seam the creep eases out (same speed at the hand-over, max 1.06)
export function seamCreep(t, t0) { const x = t - (t0 - S.SEAM_HALF); if (x <= 1) return 1 + S.CREEP * Math.max(0, x); return 1 + S.CREEP * (1 + .5 * (1 - Math.exp(-2 * (x - 1)))); }
// a fly-through into a row door: v = the yard view, box = the door opening (yard), rc = the room view at full size, sFill = view scale at
// which the opening fills the frame (parallax: the room is farther than the door, as S.roomThroughDoor)
export function roomAt(ctx, t, box, Z, rc, drawRoom, o) {
  const rs = rc.s * Math.pow(clamp(Z / S.ZEND, 1e-3, 1), .5), cx = box.x0 + box.w / 2, cy = box.y0 + box.h / 2, f = clamp(Math.log(Math.max(Z, 1)) / Math.log(S.ZEND));
  drawRoom(ctx, t, { x: rc.x - (cx - W / 2) * (1 - f) / rs, y: rc.y - (cy - H / 2) * (1 - f) / rs, s: rs }, o);
}
export function doorInner(v, t, rc, drawRoom, o, sFill) {
  return (c, box) => { const [x0, y0] = F.toScreen(v, box.x0, box.y0); c.setTransform(1, 0, 0, 1, 0, 0); roomAt(c, t, { x0, y0, w: box.w * v.s, h: box.h * v.s }, S.ZEND * v.s / sFill, rc, drawRoom, o); };
}
// a window (in room coords) as the opening to fly through: returns the screen rect of the window for view rc
export const rectOn = (v, r) => { const [x, y] = F.toScreen(v, r.x, r.y); return { x, y, w: r.w * v.s, h: r.h * v.s }; };

// a SWITCH TAG that sits on the yard (pos yard, view v) and flies into door n's mini tag in the HUD (fly 0..1)
export function flyTag(ctx, t, v, pos, date, u, fly, n, o = {}) {
  if (u <= 0) return; const e = sineIO(fly); if (e >= 1) return;
  const [sx, sy] = F.toScreen(v, pos[0], pos[1]), hx = F.hudDoorX(n), hy = F.HUD.y + 44 - F.HUD.gh - 10;
  const x = lerp(sx, hx, e), y = lerp(sy, hy, e) - 90 * Math.sin(Math.PI * e), k = lerp(o.scale ?? v.s, .1, e);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(x, y); ctx.scale(k, k); ctx.globalAlpha *= 1 - span(e, .85, 1);
  F.switchTag(ctx, t, 0, 0, date, u, { kind: o.kind, lines: o.lines, size: o.size });
  ctx.restore();
}
// the station's mini tag flies from the big switch tag (screen point from) into door n of the counter HUD, exactly while the HUD adds its tick
// (F.counterTimes(T).sign[n] + .5 … + 1.35), so the big tag can stay where it is
export function tagToHud(ctx, t, T, n, from, t0) {
  const s0 = t0 ?? F.counterTimes(T).sign[n], u = span(t, s0 + .5, s0 + 1.35); if (u <= 0 || u >= 1) return;
  const e = sineIO(u), tx = F.hudDoorX(n), ty = F.HUD.y + 44 - F.HUD.gh * 1.25 - 7;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const x = lerp(from[0], tx, e), y = lerp(from[1], ty, e) - 120 * Math.sin(Math.PI * e), s = lerp(1, .3, e);
  ctx.translate(x, y); ctx.scale(s, s); F.miniTag(ctx, 0, 0, 1, n); ctx.restore();
}
// person helper (indigo silhouette); you (yellow coat, no hood)
export const you = (ctx, t, x, y, h, o = {}) => F.du(ctx, x, y, h, { hood: false, light: 1, look: .15 + .04 * Math.sin(t * .6), ...o });
export const other = (ctx, t, x, y, h, o = {}) => F.person(ctx, x, y, h, { light: 1, look: .1 + .05 * Math.sin(t * .5 + x), ...o });

// ------------------------------------------------------------------------------------------------ small shared shapes
export function poly(ctx, pts) { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); }
// a soft cream cloud (circles on a flat base); o.a, o.col
export function cloud(ctx, t, x, y, s, o = {}) {
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.fillStyle = o.col ?? mixHex(CREAM, '#c9d8ee', .35);
  ctx.beginPath();
  for (const [dx, dy, r] of [[-1.1, .1, .55], [-.45, -.25, .75], [.3, -.38, .85], [1.0, -.05, .6], [.0, .1, .7]]) ctx.arc(x + (dx + .03 * Math.sin(t * .4 + dx)) * s, y + dy * s, r * s, 0, TAU);
  ctx.fill(); ctx.fillRect(x - 1.5 * s, y + .05 * s, 3.1 * s, .5 * s);
  ctx.fillStyle = rgba(P.ind2, .16); ctx.fillRect(x - 1.5 * s, y + .38 * s, 3.1 * s, .17 * s);
  ctx.restore();
}
// THE PROTECTOR's outline: a big faint ring (machine = circle) with a few inner rings; o.a (faint), o.lit (0..1: in the open)
export function ring(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1, lit = clamp(o.lit ?? 0); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  if (lit > 0) halo(ctx, x, y, r * 2.6, .45 * lit, COOL.halo, COOL.core);
  const ink = o.ink ? mixHex(o.ink, COOL.body, lit) : COOL.body, ink2 = o.ink ? mixHex(o.ink, COOL.line, lit) : COOL.line;   // o.ink: a darker stroke on a day sky
  ctx.strokeStyle = rgba(ink, lerp(.35, .95, lit)); ctx.lineWidth = r * .05; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  ctx.lineWidth = r * .02; ctx.strokeStyle = rgba(ink2, lerp(.22, .7, lit));
  for (const k of [.72, .46]) { ctx.beginPath(); ctx.arc(x, y, r * (k + .02 * Math.sin(t * (1.1 - k) * 2)), 0, TAU); ctx.stroke(); }
  ctx.fillStyle = rgba(mixHex(COOL.body, '#ffffff', .4), lerp(.3, 1, lit)); ctx.beginPath(); ctx.arc(x, y, r * .2, 0, TAU); ctx.fill();
  if (lit > 0) { ctx.strokeStyle = rgba(COOL.core, .5 * lit); ctx.lineWidth = 2; const q = (t * .5) % 1; ctx.globalAlpha *= 1 - q; ctx.beginPath(); ctx.arc(x, y, r * (1 + q * .8), 0, TAU); ctx.stroke(); }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ ENDING 6 · the wood room + the fields
// the field plots as seen through the window: R = the window rect (any coords), returns the 100 plot polygons (row-major, far row first)
export function fieldPlots(R, t) {
  const out = [];
  const vv = (r) => .47 + .53 * Math.pow(r / 10, 1.18), hw = (v) => lerp(.3, .78, (v - .47) / .53);
  const X = (u, v) => [R.x + R.w * (.5 + (u * 2 - 1) * hw(v)), R.y + R.h * v];
  for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) {
    const v0 = vv(r) + .004, v1 = vv(r + 1) - .004, u0 = c / 10 + .006, u1 = (c + 1) / 10 - .006;
    out.push([X(u0, v0), X(u1, v0), X(u1, v1), X(u0, v1)]);
  }
  return out;
}
const PLOT_COL = (() => { const r = prng(6061), cs = ['#b39a55', '#93a05a', '#c2a862', '#869255', '#cdb46e', '#a2a85e']; return Array.from({ length: 100 }, () => cs[Math.floor(r() * cs.length)]); })();
export const plotCol = (k) => PLOT_COL[k];
// the outside of the wood window: sky, low sun, hills, the ground between the plots, the two field workers (o.workers 0..1 = still there)
export function fieldBack(ctx, t, R, o = {}) {
  const hz = R.y + R.h * .45;
  ctx.fillStyle = lin(ctx, 0, R.y, 0, hz, [[0, mixHex('#9fc2ee', GOLD.hot, .45)], [1, mixHex(GOLD.hot, CREAM, .3)]]); ctx.fillRect(R.x, R.y, R.w, hz - R.y + 2);
  const sx = R.x + R.w * .2, sy = R.y + R.h * .3; halo(ctx, sx, sy, R.w * .3, .8, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.core; ctx.beginPath(); ctx.arc(sx, sy, R.w * .045, 0, TAU); ctx.fill();
  ctx.fillStyle = mixHex(GOLD.shade, '#7f8c4f', .55); ctx.beginPath(); ctx.moveTo(R.x, hz + 4);
  for (let i = 0; i <= 12; i++) ctx.lineTo(R.x + R.w * i / 12, hz - R.h * (.03 + .03 * Math.sin(i * 1.7 + 1)));
  ctx.lineTo(R.x + R.w, hz + 4); ctx.closePath(); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, hz, 0, R.y + R.h, [[0, '#6f6a3e'], [1, '#4f4a2c']]); ctx.fillRect(R.x, hz, R.w, R.y + R.h - hz);
}
export function fieldPlotsDraw(ctx, t, R) {
  const pl = fieldPlots(R, t);
  pl.forEach((q, k) => { ctx.fillStyle = PLOT_COL[k]; poly(ctx, q); ctx.fill(); });
  return pl;
}
export function fieldWorkers(ctx, t, R, a = 1) {
  if (a <= 0) return;
  for (const [u, v, ph, d] of [[.34, .86, 0, 1], [.7, .78, 1.7, -1]]) {
    const x = R.x + R.w * u, y = R.y + R.h * v, h = R.h * .2 * (v / .8), sw = Math.sin(t * 2.1 + ph);
    ctx.save(); ctx.translate(x, y); ctx.scale(a, a); ctx.translate(-x, -y);
    const hands = F.person(ctx, x, y, h, { dir: d, light: 1, lean: .3 + .08 * sw, armR: [1.1 + .25 * sw, .5], armL: [.9 + .25 * sw, .3] });
    ctx.strokeStyle = mixHex(GOLD.deep, P.night0, .3); ctx.lineWidth = h * .035; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(hands.R[0], hands.R[1]); ctx.lineTo(hands.R[0] + d * h * .3, y + h * .02); ctx.stroke();
    ctx.restore();
  }
}
// the wood room (room coords ~0..1920 × 0..1080). o: { you {x, pose, look}, sunlit 0..1 }
export const WOOD_WIN = { x: 1000, y: 170, w: 520, h: 430 };
export function roomWood(ctx, t, v, o = {}) {
  F.inView(ctx, v, () => {
    ctx.fillStyle = lin(ctx, 0, 0, 1920, 0, [[0, mixHex(GOLD.deep, P.night1, .35)], [.55, mixHex(GOLD.shade, GOLD.deep, .45)], [1, mixHex(GOLD.mid, GOLD.shade, .5)]]); ctx.fillRect(-400, -400, 2800, 1300);
    ctx.fillStyle = rgba(GOLD.deep, .35); for (let x = -380; x < 2400; x += 74) ctx.fillRect(x, -400, 3, 1300);   // the planks
    ctx.fillStyle = lin(ctx, 0, 880, 0, 1500, [[0, mixHex(GOLD.deep, P.night1, .2)], [1, mixHex(GOLD.deep, P.night0, .6)]]); ctx.fillRect(-400, 880, 2800, 700);
    ctx.fillStyle = rgba(P.night0, .2); for (let y = 905; y < 1500; y += 46) ctx.fillRect(-400, y, 2800, 2);
    // the window (hero light): the fields outside
    const R = WOOD_WIN;
    ctx.save(); ctx.beginPath(); ctx.rect(R.x, R.y, R.w, R.h); ctx.clip();
    fieldBack(ctx, t, R); if (o.plots !== false) fieldPlotsDraw(ctx, t, R); if (o.workers !== false) fieldWorkers(ctx, t, R, 1);
    ctx.restore();
    ctx.strokeStyle = mixHex(GOLD.deep, P.night0, .45); ctx.lineWidth = 22; ctx.strokeRect(R.x, R.y, R.w, R.h);
    // two casements (hinged at the sides): o.casement 0..1 swings them open, the bars fold into the side frames
    const cs = Math.cos(clamp(o.casement ?? 0) * Math.PI / 2), lw = R.w / 2 * cs;
    if (lw > .5) { ctx.lineWidth = 10; for (const [hx, d] of [[R.x, 1], [R.x + R.w, -1]]) { const ex = hx + d * lw; ctx.strokeRect(Math.min(hx, ex), R.y + 5, Math.abs(ex - hx), R.h - 10); ctx.beginPath(); ctx.moveTo(hx, R.y + R.h * .5); ctx.lineTo(ex, R.y + R.h * .5); ctx.stroke(); } }
    ctx.fillStyle = mixHex(GOLD.deep, P.night0, .3); ctx.fillRect(R.x - 30, R.y + R.h + 8, R.w + 60, 18);   // the sill
    // the sun patch: light falls as a shape
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(GOLD.hot, .15 + .02 * Math.sin(t * .5));
    ctx.beginPath(); ctx.moveTo(R.x, R.y + R.h); ctx.lineTo(R.x + R.w, R.y + R.h); ctx.lineTo(R.x + R.w - 340, 1080); ctx.lineTo(R.x - 560, 1080); ctx.closePath(); ctx.fill(); ctx.restore();
    // the inner door with your tools leaning beside it
    ctx.fillStyle = mixHex(GOLD.deep, P.night0, .45); ctx.fillRect(1640, 300, 200, 580); ctx.fillStyle = rgba(GOLD.shade, .3); for (let x = 1660; x < 1840; x += 46) ctx.fillRect(x, 300, 3, 580);
    ctx.fillStyle = GOLD.shade; ctx.beginPath(); ctx.arc(1810, 600, 9, 0, TAU); ctx.fill();
    ctx.strokeStyle = mixHex(GOLD.shade, P.night1, .35); ctx.lineCap = 'round';
    ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(1560, 880); ctx.lineTo(1610, 440); ctx.stroke();   // rake handle
    ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(1578, 448); ctx.lineTo(1642, 456); ctx.stroke(); for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(1582 + k * 15, 450); ctx.lineTo(1584 + k * 15, 480); ctx.stroke(); }
    ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(1530, 880); ctx.lineTo(1556, 470); ctx.stroke();   // hoe
    ctx.fillStyle = mixHex(CREAM2, P.night1, .4); ctx.beginPath(); ctx.moveTo(1540, 470); ctx.lineTo(1590, 476); ctx.lineTo(1584, 510); ctx.lineTo(1546, 500); ctx.closePath(); ctx.fill();
    // the table: bread, a cup, a plate; no screen
    ctx.fillStyle = mixHex(GOLD.deep, P.night0, .3); ctx.fillRect(180, 690, 700, 30); ctx.fillRect(220, 720, 26, 210); ctx.fillRect(814, 720, 26, 210);
    ctx.fillStyle = mixHex(GOLD.mid, GOLD.shade, .4); ctx.beginPath(); ctx.ellipse(420, 660, 110, 40, 0, Math.PI, TAU); ctx.fill(); ctx.fillRect(310, 658, 220, 32);
    ctx.strokeStyle = rgba(GOLD.deep, .6); ctx.lineWidth = 5; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(360 + k * 50, 640); ctx.lineTo(385 + k * 50, 672); ctx.stroke(); }
    ctx.fillStyle = mixHex(CREAM, GOLD.shade, .2); ctx.beginPath(); ctx.ellipse(650, 684, 80, 12, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = CREAM; ctx.beginPath(); ctx.roundRect(735, 636, 50, 52, 8); ctx.fill(); ctx.strokeStyle = CREAM; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(787, 662, 13, -1.2, 1.2); ctx.stroke();
    ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 3; for (let k = 0; k < 2; k++) { ctx.beginPath(); for (let s = 0; s <= 1; s += .1) { const y = 626 - s * 70, x = 750 + k * 20 + 7 * Math.sin(s * 7 + t * 2.2 + k); s ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
    // you in the light
    const y = o.you || {}; you(ctx, t, y.x ?? 960, 900 + Math.sin(t * 1.3) * 1.5, 420, { pose: y.pose ?? 'stand', armR: y.armR, armL: y.armL, look: y.look, dir: y.dir ?? 1, back: .2 });
  });
}
// ------------------------------------------------------------------------------------------------ ENDING 6 · waffle cells, locker, monitor, school, throne
export const CELL = 30, CGAP = 7;
export const cellXY = (x0, y0, k) => [x0 + (k % 10) * (CELL + CGAP), y0 + Math.floor(k / 10) * (CELL + CGAP)];
export function locker(ctx, t, x, y, s, o = {}) {   // x, y = bottom centre; a tall locker, door open, a dark phone inside
  const w = 86 * s, h = 210 * s, x0 = x - w / 2, y0 = y - h;
  ctx.fillStyle = mixHex(P.ind2, COOL.deep, .3); ctx.fillRect(x0, y0, w, h); ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 2; ctx.strokeRect(x0, y0, w, h);
  ctx.fillStyle = P.night0; ctx.fillRect(x0 + 8 * s, y0 + 8 * s, w - 16 * s, h - 16 * s);
  ctx.fillStyle = mixHex(P.ind2, P.night1, .4); ctx.fillRect(x0 + 10 * s, y0 + h * .55, w - 20 * s, 5 * s);   // the shelf
  ctx.fillStyle = mixHex(P.night1, P.ind2, .6); ctx.beginPath(); ctx.roundRect(x - 15 * s, y0 + h * .55 - 56 * s, 30 * s, 56 * s, 5 * s); ctx.fill();
  ctx.strokeStyle = rgba(CREAM2, .7); ctx.lineWidth = 1.6 * s; ctx.stroke();   // the phone: screen off
  const dw = (w - 4) * (o.door ?? .35);   // the door, swung open toward the viewer (a narrow panel on the left hinge)
  ctx.fillStyle = mixHex(P.ind2, COOL.deep, .45); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 - dw, y0 + 10 * s); ctx.lineTo(x0 - dw, y - 10 * s); ctx.lineTo(x0, y); ctx.closePath(); ctx.fill(); ctx.strokeStyle = rgba(CREAM, .45); ctx.stroke();
  ctx.fillStyle = rgba(CREAM, .35); for (let k = 0; k < 3; k++) ctx.fillRect(x0 - dw * .75, y0 + 26 * s + k * 9 * s, dw * .5, 3 * s);
}
export function aiMonitor(ctx, t, x, y, s, o = {}) {   // bottom centre; a screen on a stand where an AI keeps computing (cool)
  const w = 250 * s, h = 160 * s, x0 = x - w / 2, y0 = y - h - 50 * s, on = o.on ?? 1;
  ctx.fillStyle = mixHex(P.night1, P.blue1, .5); ctx.fillRect(x - 8 * s, y - 50 * s, 16 * s, 50 * s); ctx.fillRect(x - 50 * s, y - 8 * s, 100 * s, 8 * s);
  if (on > 0) halo(ctx, x, y0 + h / 2, w * .9, .3 * on, COOL.halo, COOL.core);
  ctx.fillStyle = mixHex(P.night0, COOL.deep, .7); ctx.beginPath(); ctx.roundRect(x0, y0, w, h, 8 * s); ctx.fill(); ctx.strokeStyle = rgba(COOL.line, .8); ctx.lineWidth = 2.5; ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.rect(x0 + 6, y0 + 6, w - 12, h - 12); ctx.clip();
  for (let k = 0; k < 7; k++) { const yy = y0 + 20 * s + ((k * 22 * s - t * 40 * s) % (h + 20 * s) + h + 20 * s) % (h + 20 * s), ww = (60 + 90 * ((k * 37) % 5) / 5) * s; ctx.fillStyle = rgba(COOL.body, .55 * on); ctx.fillRect(x0 + 110 * s, yy, ww, 5 * s); }
  ctx.restore();
  F.agentGlyph(ctx, t, x0 + 60 * s, y0 + h / 2, 22 * s, { ping: on, col: COOL.body });
  return { x0, y0, w, h };
}
export function school(ctx, t, x, y, o = {}) {   // a low school building (bottom centre); o.rise 0..1 (rises out of the ground line)
  const u = clamp(o.rise ?? 1), w = 820, h = 170; if (u <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.rect(x - w, y - 600, w * 2, 600); ctx.clip(); ctx.translate(0, (1 - expoOut(u)) * (h + 70));
  ctx.fillStyle = mixHex(P.night1, P.ind2, .75); ctx.fillRect(x - w / 2, y - h, w, h);
  ctx.beginPath(); ctx.moveTo(x - 110, y - h); ctx.lineTo(x, y - h - 64); ctx.lineTo(x + 110, y - h); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(CREAM, .28); ctx.lineWidth = 2; ctx.strokeRect(x - w / 2, y - h, w, h);
  for (let k = 0; k < 12; k++) { if (k === 5 || k === 6) continue; const wx = x - w / 2 + 28 + k * 66; ctx.fillStyle = mixHex(LAMP.deep, LAMP.body, .35 + .1 * Math.sin(t * .7 + k)); ctx.fillRect(wx, y - h + 34, 38, 52); }
  ctx.fillStyle = mixHex(LAMP.deep, P.night1, .3); ctx.fillRect(x - 36, y - 96, 72, 96);
  E_label(ctx, 'SCHOOL', x, y - h - 12, 22);
  ctx.restore();
}
function E_label(ctx, s, x, y, size) { F.glowText(ctx, s, x, y, { size, weight: 700, align: 'center', col: rgba(CREAM, .75), glow: false, spacing: .2 }); }
// THE THRONE: a tall high-backed seat of cool light (the machine that rules), its crown = the machine disc. x, y = bottom centre, h = height.
// o.grow 0..1 (rises out of the ground line y: grows from behind what stands in front), o.disc 0..1 (the disc on its back lights), o.k (scale)
export function throne(ctx, t, x, y, h, o = {}) {
  const g = clamp(o.grow ?? 1); if (g <= 0) return null;
  const k = o.k ?? 1, w = h * .62;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.beginPath(); ctx.rect(x - h, y - h * 2, h * 2, h * 2); ctx.clip();
  ctx.translate(x, y); ctx.scale(k, k); ctx.translate(0, (1 - expoOut(g)) * h * 1.04);
  halo(ctx, 0, -h * .7, h * .9, .22, COOL.halo, COOL.core);
  const R = (x0, y0, x1, y1) => { const p = new Path2D(); p.rect(x0 * w, y0 * h, (x1 - x0) * w, (y1 - y0) * h); return p; };
  const crest = new Path2D(); [[-.27, -.4], [-.27, -.9], [-.2, -.97], [-.12, -.92], [0, -1.02], [.12, -.92], [.2, -.97], [.27, -.9], [.27, -.4]].forEach(([a, b], i) => (i ? crest.lineTo(a * w, b * h) : crest.moveTo(a * w, b * h))); crest.closePath();
  let body = crest;
  for (const p of [R(-.38, -.42, .38, -.34), R(-.5, -.56, -.3, -.5), R(.3, -.56, .5, -.5), R(-.47, -.5, -.39, -.4), R(.39, -.5, .47, -.4), R(-.36, -.34, -.26, 0), R(.26, -.34, .36, 0), R(-.26, -.14, .26, -.09)]) body = body.op(p, PathOp.Union);
  ctx.fillStyle = lin(ctx, 0, -h, 0, 0, [[0, mixHex(COOL.body, P.ind2, .3)], [.55, mixHex(COOL.deep, P.ind2, .3)], [1, mixHex(P.night1, COOL.deep, .4)]]); ctx.fill(body);
  ctx.strokeStyle = rgba(COOL.line, .75); ctx.lineWidth = 3 / k; ctx.stroke(body);
  ctx.fillStyle = rgba(COOL.core, .14); ctx.fillRect(-w * .19, -h * .86, w * .38, h * .4);   // the back panel
  ctx.fillStyle = rgba(COOL.core, .25); ctx.fillRect(-w * .38, -h * .42, w * .76, h * .02);
  const d = clamp(o.disc ?? 0), dy = -h * .78;
  if (d > 0) { halo(ctx, 0, dy, h * .5, .5 * d, COOL.halo, COOL.core); }
  ctx.restore();
  return { x, y: y + (dy) * k, top: y - h * k };
}
// the machine disc (the calm light / the crown): a cool disc with a ring; x, y centre
export function machineDisc(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || r <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  halo(ctx, x, y, r * (4 + .2 * Math.sin(t * .8)), .55 * (o.glow ?? 1), COOL.halo, COOL.core);
  ctx.fillStyle = mixHex(COOL.body, '#ffffff', .45); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba(COOL.line, .8); ctx.lineWidth = Math.max(1.5, r * .08); ctx.beginPath(); ctx.arc(x, y, r * (1.35 + .05 * Math.sin(t * 1.3)), 0, TAU); ctx.stroke();
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ ENDING 5 · world disc, house, glass case, balance, booth
export const DISC = { cx: 960, cy: 300, rx: 560, ry: 165 };
const SECT = [[-150, -30], [-30, 90], [90, 210]];   // KNOWLEDGE (back), PLEASURE (right front), WILDLIFE (left front); parametric angles (deg)
const SECT_COL = [mixHex(P.ind2, COOL.deep, .55), mixHex(P.ind2, LAMP.deep, .5), mixHex(P.ind2, '#3f6b4a', .55)];
export const sectorMid = (i, f = .55) => { const a = (SECT[i][0] + SECT[i][1]) / 2 * Math.PI / 180; return [DISC.cx + DISC.rx * f * Math.cos(a), DISC.cy + DISC.ry * f * Math.sin(a)]; };
const PEOPLE = (() => { const r = prng(5051); return Array.from({ length: 16 }, () => { const a = r() * TAU, f = .25 + r() * .62; return [Math.cos(a) * f, Math.sin(a) * f, r() < .82, r() * 6.3]; }); })();
export const discPeople = () => PEOPLE.map(([px, py, likes]) => [DISC.cx + px * DISC.rx, DISC.cy + py * DISC.ry + 8, likes]);
// o: { u (grows 0..1 from its centre), split 0..1 (three sectors move apart + tint), icons [k, p, w] 0..1, people 0..1, glad 0..1, house 0..1, a }
export function worldDisc(ctx, t, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const { cx, cy, rx, ry } = DISC, k = expoOut(u), sp = sineIO(clamp(o.split ?? 0));
  ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k); ctx.translate(-cx, -cy);
  // the thickness (an edge below the disc)
  ctx.fillStyle = mixHex(P.night1, P.ind2, .5); ctx.beginPath(); ctx.ellipse(cx, cy + 22, rx, ry, 0, 0, Math.PI); ctx.lineTo(cx - rx, cy); ctx.ellipse(cx, cy, rx, ry, 0, Math.PI, 0, true); ctx.closePath(); ctx.fill();
  for (let i = 0; i < 3; i++) {
    const [a0, a1] = SECT[i].map((d) => d * Math.PI / 180), am = (a0 + a1) / 2, off = 26 * sp;
    ctx.save(); ctx.translate(Math.cos(am) * off, Math.sin(am) * off * .5);
    ctx.beginPath(); ctx.moveTo(cx, cy); for (let s = 0; s <= 24; s++) { const a = lerp(a0, a1, s / 24); ctx.lineTo(cx + rx * Math.cos(a), cy + ry * Math.sin(a)); } ctx.closePath();
    ctx.fillStyle = mixHex(mixHex(P.ind1, P.blue1, .35), SECT_COL[i], sp); ctx.fill();
    ctx.strokeStyle = rgba(CREAM, .35 * sp + .25); ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();
  }
  ctx.strokeStyle = rgba(CREAM, .3 * (1 - sp)); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, TAU); ctx.stroke();
  // icons per sector (each grows on its word)
  const ic = o.icons || [0, 0, 0];
  const at = (i, f, dx = 0) => { const [x, y] = sectorMid(i, f); const am = (SECT[i][0] + SECT[i][1]) / 2 * Math.PI / 180; return [x + dx + Math.cos(am) * 26 * sp, y + Math.sin(am) * 13 * sp]; };
  if (ic[0] > 0) { const [x, y] = at(0, .55); const e = expoOut(ic[0]); for (let j = 0; j < 4; j++) { ctx.fillStyle = mixHex(CREAM, COOL.line, j % 2 ? .3 : 0); ctx.fillRect(x - 60 + j * 34, y - 54 * e, 22, 54 * e); } ctx.fillStyle = CREAM; ctx.fillRect(x - 70, y - 54 * e - 10, 140 * e, 10); }
  if (ic[1] > 0) { const [x, y] = at(1, .55); const e = expoOut(ic[1]); for (let j = 0; j < 3; j++) { const lx = x - 50 + j * 50, ly = y - 40 - 10 * Math.sin(j * 2); ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx, y); ctx.lineTo(lx, ly + 14); ctx.stroke(); halo(ctx, lx, ly, 46 * e, .6 * e, LAMP.body, LAMP.core); ctx.fillStyle = LAMP.core; ctx.beginPath(); ctx.arc(lx, ly, 9 * e, 0, TAU); ctx.fill(); } }
  if (ic[2] > 0) { const [x, y] = at(2, .55); const e = expoOut(ic[2]); for (let j = 0; j < 4; j++) { const tx = x - 70 + j * 46, th = (46 + (j % 2) * 18) * e; ctx.fillStyle = mixHex('#3f6b4a', CREAM, .25 + .1 * (j % 2)); ctx.beginPath(); ctx.moveTo(tx - 18, y); ctx.lineTo(tx, y - th); ctx.lineTo(tx + 18, y); ctx.closePath(); ctx.fill(); } }
  // the people (content: a warm glow over most of them when glad)
  const pu = clamp(o.people ?? 0), gl = clamp(o.glad ?? 0);
  PEOPLE.forEach(([px, py, likes, ph], j) => {
    const a = clamp(pu * 2.4 - j * .08); if (a <= 0) return;
    const x = cx + px * rx, y = cy + py * ry + 8;
    if (o.skip && o.skip(x, y)) return;
    if (likes && gl > 0) halo(ctx, x, y - 22, 34, .55 * gl * clamp(gl * 2 - j * .05), LAMP.body, LAMP.core);
    ctx.save(); ctx.translate(x, y); const e = expoOut(a); ctx.scale(e, e); ctx.translate(-x, -y);
    other(ctx, t, x, y, 44, { dir: j % 2 ? 1 : -1, look: likes ? .5 * gl : .1 });
    ctx.restore();
  });
  // the small house with a lit window (the morning is inside)
  const hu = clamp(o.house ?? 0);
  if (hu > 0) { const [hx, hy] = HOUSE5; const e = expoOut(hu); ctx.save(); ctx.translate(hx, hy); ctx.scale(e, e); ctx.translate(-hx, -hy);
    ctx.fillStyle = mixHex(P.night1, P.ind2, .6); ctx.fillRect(hx - 34, hy - 46, 68, 46); ctx.beginPath(); ctx.moveTo(hx - 40, hy - 46); ctx.lineTo(hx, hy - 74); ctx.lineTo(hx + 40, hy - 46); ctx.closePath(); ctx.fill();
    ctx.fillStyle = LAMP.core; ctx.fillRect(HWIN5.x, HWIN5.y, HWIN5.w, HWIN5.h); halo(ctx, hx, hy - 26, 40, .5, LAMP.body, LAMP.core); ctx.restore(); }
  ctx.restore();
}
export const HOUSE5 = [1230, 296], HWIN5 = { x: 1230 - 10, y: 296 - 36, w: 20, h: 18 };
// a GLASS CASE on a pedestal (x, y = bottom centre): the rule book inside, no handle; o.u (rises), o.tap (your hand at the glass)
export function glassCase(ctx, t, x, y, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const k = expoOut(u);
  ctx.save(); ctx.translate(x, y); ctx.scale(1, k); ctx.translate(-x, -y);
  ctx.fillStyle = mixHex(P.night1, P.ind2, .6); ctx.fillRect(x - 46, y - 110, 92, 110); ctx.fillRect(x - 62, y - 118, 124, 12);
  ctx.restore();
  if (u < .4) return;
  const g = span(u, .4, 1), by = y - 118, bw = 150, bh = 150;
  // the book (open, lines of rules)
  if (!o.noBook) { ctx.fillStyle = PAPER.lit; ctx.beginPath(); ctx.moveTo(x - 54, by - 20); ctx.lineTo(x, by - 12); ctx.lineTo(x + 54, by - 20); ctx.lineTo(x + 54, by - 84); ctx.lineTo(x, by - 76); ctx.lineTo(x - 54, by - 84); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(PAPER.ink, .5); ctx.lineWidth = 2; for (let j = 0; j < 4; j++) { ctx.beginPath(); ctx.moveTo(x - 46, by - 74 + j * 13); ctx.lineTo(x - 8, by - 68 + j * 13); ctx.moveTo(x + 8, by - 68 + j * 13); ctx.lineTo(x + 46, by - 74 + j * 13); ctx.stroke(); } }
  // the glass box: cool pane, a bright edge, no handle
  ctx.save(); ctx.globalAlpha *= g;
  ctx.fillStyle = rgba(COOL.deep, .28); ctx.fillRect(x - bw / 2, by - bh, bw, bh);
  ctx.strokeStyle = rgba(COOL.line, .85); ctx.lineWidth = 3; ctx.strokeRect(x - bw / 2, by - bh, bw, bh);
  ctx.strokeStyle = rgba(COOL.core, .22); ctx.lineWidth = 16; const sx = x - 40 + 30 * Math.sin(t * .4); ctx.beginPath(); ctx.moveTo(sx, by - bh); ctx.lineTo(sx + 60, by); ctx.stroke();
  ctx.restore();
}
// THE BALANCE: pivot (x, y); o.tilt (rad), o.u (draws on), o.table 0..1, o.ballot 0..1 (the ballot on the right pan; 0 = lifted away)
export function balance(ctx, t, x, y, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const L = 170 * expoOut(u), tl = o.tilt ?? 0, c = Math.cos(tl), s = Math.sin(tl);
  ctx.strokeStyle = rgba(CREAM, .85); ctx.lineCap = 'round'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 180 * expoOut(u)); ctx.stroke(); ctx.fillStyle = rgba(CREAM, .8); ctx.fillRect(x - 60, y + 176 * expoOut(u), 120, 8);
  const lx = x - L * c, ly = y - L * s, rx = x + L * c, ry = y + L * s;
  ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(rx, ry); ctx.stroke(); ctx.fillStyle = CREAM; ctx.beginPath(); ctx.arc(x, y, 10, 0, TAU); ctx.fill();
  const pan = (px, py) => { ctx.lineWidth = 2; ctx.strokeStyle = rgba(CREAM, .6); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - 50, py + 96); ctx.moveTo(px, py); ctx.lineTo(px + 50, py + 96); ctx.stroke(); ctx.fillStyle = rgba(CREAM, .85); ctx.beginPath(); ctx.ellipse(px, py + 100, 64, 10, 0, 0, TAU); ctx.fill(); return [px, py + 92]; };
  const pl = pan(lx, ly), pr = pan(rx, ry);
  const tb = clamp(o.table ?? 1);
  if (tb > 0) { const [px, py] = pl, e = expoOut(tb); ctx.save(); ctx.translate(px, py); ctx.scale(e, e);
    ctx.fillStyle = mixHex(LAMP.deep, GOLD.deep, .3); ctx.fillRect(-44, -26, 88, 8); ctx.fillRect(-38, -18, 6, 18); ctx.fillRect(32, -18, 6, 18);
    [[-26, -34, LAMP.body], [-4, -40, mixHex(LAMP.body, '#8fd27a', .35)], [20, -34, mixHex(LAMP.body, '#e0704f', .3)]].forEach(([bx, by, cc]) => { ctx.fillStyle = cc; ctx.beginPath(); ctx.arc(bx, by, 10, 0, TAU); ctx.fill(); });
    ctx.restore(); }
  return { lx, ly, rx, ry, pl, pr };
}
// a BALLOT: a cream paper with a box and a cross; x, y = centre; s scale
export function ballot(ctx, t, x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.scale(s, s);
  ctx.fillStyle = PAPER.lit; ctx.fillRect(-28, -36, 56, 72); ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.strokeRect(-28, -36, 56, 72);
  ctx.strokeStyle = PAPER.ink; ctx.lineWidth = 2.4; ctx.strokeRect(-18, -22, 16, 16); ctx.beginPath(); ctx.moveTo(-16, -20); ctx.lineTo(-4, -8); ctx.moveTo(-4, -20); ctx.lineTo(-16, -8); ctx.stroke();
  ctx.strokeStyle = rgba(PAPER.ink, .4); for (let j = 0; j < 3; j++) { ctx.beginPath(); ctx.moveTo(4, -18 + j * 0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-18, 6 + j * 10); ctx.lineTo(18, 6 + j * 10); ctx.stroke(); }
  ctx.restore();
}
// the GUARD BOOTH (bottom centre x, y): a small hut, its window holds a cool ring (the guard); o.u grows, o.ring 0..1
export function booth(ctx, t, x, y, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const e = expoOut(u);
  ctx.save(); ctx.translate(x, y); ctx.scale(e, e);
  ctx.fillStyle = mixHex(P.night1, P.ind2, .75); ctx.fillRect(-48, -130, 96, 130); ctx.beginPath(); ctx.moveTo(-60, -130); ctx.lineTo(0, -168); ctx.lineTo(60, -130); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(CREAM, .35); ctx.lineWidth = 2; ctx.strokeRect(-48, -130, 96, 130);
  ctx.fillStyle = mixHex(P.night0, COOL.deep, .6); ctx.fillRect(-30, -112, 60, 46);
  ctx.restore();
  const r = clamp(o.ring ?? 1); if (r > 0) { F.agentGlyph(ctx, t, x, y - 89 * e, 14 * e, { ping: .6 * r, col: COOL.body, a: r }); halo(ctx, x, y - 89 * e, 60 * e, .35 * r, COOL.halo, COOL.core); }
}
// the GATE: two posts and a bar (x0 → x1 at ground y); o.u (posts rise, bar swings down)
export function gate(ctx, t, x0, x1, y, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const ph = 170 * expoOut(span(u, 0, .6)), bar = span(u, .4, 1), open = clamp(o.open ?? 0);
  ctx.fillStyle = mixHex(P.night1, P.blue1, .5); ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 2;
  for (const x of [x0, x1]) { ctx.fillRect(x - 9, y - ph, 18, ph); ctx.strokeRect(x - 9, y - ph, 18, ph); }
  if (bar > 0) { const ang = lerp(-Math.PI / 2, 0, expoOut(bar)) - open * 1.2; ctx.save(); ctx.translate(x0, y - ph * .62); ctx.rotate(ang); ctx.fillStyle = rgba(CREAM, .85); ctx.fillRect(0, -6, (x1 - x0) - 10, 12);
    ctx.fillStyle = mixHex(P.night1, P.blue1, .5); for (let k = 1; k < 5; k++) ctx.fillRect(k * (x1 - x0) / 5 - 10, -6, 20, 12); ctx.restore(); }
}

// ------------------------------------------------------------------------------------------------ ENDING 5 · the street window (no want, no locks)
export const STREET5_WIN = { x: 560, y: 160, w: 800, h: 540 };
export function roomStreet5(ctx, t, v, o = {}) {
  F.inView(ctx, v, () => {
    ctx.fillStyle = lin(ctx, 0, 0, 1920, 0, [[0, mixHex(P.ind2, GOLD.shade, .35)], [.5, mixHex(GOLD.shade, LAMP.deep, .45)], [1, mixHex(P.ind2, GOLD.shade, .3)]]); ctx.fillRect(-400, -400, 2800, 1300);
    ctx.fillStyle = mixHex(GOLD.deep, P.night1, .45); ctx.fillRect(-400, 880, 2800, 700);
    const R = STREET5_WIN;
    ctx.save(); ctx.beginPath(); ctx.rect(R.x, R.y, R.w, R.h); ctx.clip();
    ctx.fillStyle = lin(ctx, 0, R.y, 0, R.y + R.h, [[0, mixHex('#9fc2ee', CREAM, .4)], [.7, mixHex(GOLD.hot, CREAM, .5)], [1, GOLD.hot]]); ctx.fillRect(R.x, R.y, R.w, R.h);
    const gy = R.y + R.h * .78;
    for (let i = 0; i < 6; i++) {   // houses across the street, every front door open (warm), no locks
      const hx = R.x + 20 + i * 135, hw = 118, hh = 150 + (i % 3) * 30;
      ctx.fillStyle = mixHex(P.ind2, GOLD.shade, .45 + .08 * (i % 2)); ctx.fillRect(hx, gy - hh, hw, hh);
      ctx.beginPath(); ctx.moveTo(hx - 6, gy - hh); ctx.lineTo(hx + hw / 2, gy - hh - 40); ctx.lineTo(hx + hw + 6, gy - hh); ctx.closePath(); ctx.fill();
      ctx.fillStyle = LAMP.core; ctx.fillRect(hx + hw / 2 - 16, gy - 62, 32, 62);   // the open door
      ctx.fillStyle = mixHex(P.ind2, GOLD.shade, .3); ctx.beginPath(); ctx.moveTo(hx + hw / 2 - 16, gy - 62); ctx.lineTo(hx + hw / 2 - 30, gy - 58); ctx.lineTo(hx + hw / 2 - 30, gy - 2); ctx.lineTo(hx + hw / 2 - 16, gy); ctx.closePath(); ctx.fill();
      ctx.fillStyle = mixHex(LAMP.body, P.ind2, .3); ctx.fillRect(hx + 14, gy - hh + 30, 26, 30); ctx.fillRect(hx + hw - 40, gy - hh + 30, 26, 30);
    }
    ctx.fillStyle = mixHex(GOLD.shade, P.ind2, .5); ctx.fillRect(R.x, gy, R.w, R.h);
    // a stall full of fruit, free; people strolling
    const sx = R.x + 470, sy = gy + 60; ctx.fillStyle = mixHex(GOLD.deep, P.night1, .2); ctx.fillRect(sx - 80, sy - 40, 160, 40);
    ctx.fillStyle = mixHex(CREAM, GOLD.mid, .3); for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(sx - 90 + k * 36, sy - 110); ctx.lineTo(sx - 54 + k * 36, sy - 110); ctx.lineTo(sx - 60 + k * 36, sy - 92); ctx.lineTo(sx - 84 + k * 36, sy - 92); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = mixHex(P.night1, GOLD.deep, .4); ctx.fillRect(sx - 84, sy - 92, 6, 52); ctx.fillRect(sx + 78, sy - 92, 6, 52);
    [[-50, GOLD.mid], [-20, '#e0704f'], [10, '#8fd27a'], [40, GOLD.body], [62, '#e0704f']].forEach(([dx, c], k) => { ctx.fillStyle = mixHex(c, CREAM, .1); ctx.beginPath(); ctx.arc(sx + dx, sy - 48 - (k % 2) * 6, 11, 0, TAU); ctx.fill(); });
    for (let k = 0; k < 4; k++) { const px = R.x + ((k * 230 + t * (k % 2 ? 22 : -18)) % (R.w + 120) + R.w + 120) % (R.w + 120) - 60; other(ctx, t, px, gy + 120 + (k % 2) * 30, 110, { walk: t * 4 + k, dir: k % 2 ? 1 : -1 }); }
    ctx.restore();
    ctx.strokeStyle = mixHex(P.night1, GOLD.deep, .4); ctx.lineWidth = 20; ctx.strokeRect(R.x, R.y, R.w, R.h); ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(R.x + R.w / 2, R.y); ctx.lineTo(R.x + R.w / 2, R.y + R.h); ctx.stroke();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(GOLD.hot, .12); ctx.beginPath(); ctx.moveTo(R.x, R.y + R.h); ctx.lineTo(R.x + R.w, R.y + R.h); ctx.lineTo(R.x + R.w + 200, 1080); ctx.lineTo(R.x - 200, 1080); ctx.closePath(); ctx.fill(); ctx.restore();
    you(ctx, t, 1040, 960 + Math.sin(t * 1.3) * 1.5, 430, { view: 'back', back: .5, look: .3, pose: o.pose ?? 'stand' });
  });
}

// ------------------------------------------------------------------------------------------------ ENDING 4 · sentinel, workshop, your house, kitchen, helper, law sheet
// THE SENTINEL (the gatekeeper: a slim column of cool light, the ring as its head; no face). x, y bottom centre, h height; o.m (0 booth-like → 1)
export function sentinel(ctx, t, x, y, h, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || h <= 0) return null;
  ctx.save(); ctx.globalAlpha *= a;
  const w = o.w ?? h * .16;
  halo(ctx, x, y - h * .7, h * .7, .25, COOL.halo, COOL.core);
  ctx.fillStyle = lin(ctx, 0, y - h, 0, y, [[0, mixHex(COOL.body, P.ind2, .3)], [1, mixHex(COOL.deep, P.night1, .5)]]);
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h * .82, w, h * .82, w * .45); ctx.fill(); ctx.strokeStyle = rgba(COOL.line, .7); ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();
  const hy = y - h * .82 - w * .7;
  F.agentGlyph(ctx, t, x, hy, w * .55, { ping: .5, col: COOL.body, a });
  return [x, hy];
}
export function workshop(ctx, t, x, y, o = {}) {   // bottom centre; o.u draws its outline on, then fills
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const w = 420, h = 220, x0 = x - w / 2, y0 = y - h, f = span(u, .55, 1);
  const pts = [[x0, y], [x0, y0], [x, y0 - 90], [x0 + w, y0], [x0 + w, y], [x0, y]];
  if (f > 0) { ctx.save(); ctx.globalAlpha *= f; ctx.fillStyle = mixHex(P.night1, P.ind2, .7); poly(ctx, pts.slice(0, 5)); ctx.fill();
    ctx.fillStyle = mixHex(LAMP.deep, P.night1, .35); ctx.fillRect(x - 60, y - 130, 120, 130);   // the big door, shut
    ctx.strokeStyle = rgba(CREAM, .2); ctx.lineWidth = 2; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(x - 60, y - 130 + k * 32); ctx.lineTo(x + 60, y - 130 + k * 32); ctx.stroke(); }
    ctx.fillStyle = mixHex(LAMP.body, P.night1, .4); ctx.fillRect(x0 + 40, y0 + 40, 60, 46); ctx.fillRect(x0 + w - 100, y0 + 40, 60, 46);
    ctx.restore(); }
  F.lightLine(ctx, pts, span(u, 0, .7), { w: 2.5, a: .7, glow: false });
}
export function yourHouse(ctx, t, x, y, o = {}) {   // bottom centre; a small house with one lit window HWIN4 (relative)
  const u = clamp(o.u ?? 1); if (u <= 0) return; const e = expoOut(u);
  ctx.save(); ctx.translate(x, y); ctx.scale(e, e);
  ctx.fillStyle = mixHex(P.night1, P.ind2, .65); ctx.fillRect(-100, -150, 200, 150); ctx.beginPath(); ctx.moveTo(-116, -150); ctx.lineTo(0, -222); ctx.lineTo(116, -150); ctx.closePath(); ctx.fill();
  ctx.fillStyle = LAMP.core; ctx.fillRect(HWIN4.x, HWIN4.y, HWIN4.w, HWIN4.h); ctx.strokeStyle = mixHex(P.night1, P.ind2, .65); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(HWIN4.x + HWIN4.w / 2, HWIN4.y); ctx.lineTo(HWIN4.x + HWIN4.w / 2, HWIN4.y + HWIN4.h); ctx.stroke();
  ctx.restore(); halo(ctx, x, y - 95 * e, 90 * e, .45 * e, LAMP.body, LAMP.core);
}
export const HWIN4 = { x: -24, y: -118, w: 48, h: 40 };
// the HELPER (a soft machine shape, circle language, no face): x, y bottom centre, h; o.arm 0..1 (reach to the table), o.a
export function helper(ctx, t, x, y, h, o = {}) {
  const bob = Math.sin(t * 2.2) * h * .01, w = h * .36;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(0, bob);
  ctx.fillStyle = rgba(P.night0, .35); ctx.beginPath(); ctx.ellipse(x, y - bob, w * .7, h * .03, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, y - h, 0, y, [[0, mixHex(COOL.body, CREAM, .3)], [1, mixHex(COOL.deep, P.ind2, .4)]]);
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h * .72, w, h * .66, w * .45); ctx.fill();
  ctx.strokeStyle = rgba(COOL.line, .8); ctx.lineWidth = h * .01; ctx.stroke();
  const ar = clamp(o.arm ?? 0), sx = x + w * .42, sy = y - h * .52, ex = sx + h * lerp(.1, .34, ar), ey = sy + h * lerp(.2, .1, ar);
  ctx.strokeStyle = mixHex(COOL.body, CREAM, .2); ctx.lineWidth = h * .045; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(sx + h * .08, sy + h * .12, ex, ey); ctx.stroke();
  ctx.restore();
  F.agentGlyph(ctx, t, x, y - h * .86 + bob, h * .1, { ping: .4, col: COOL.body, a: o.a ?? 1 });
  return { hand: [ex, ey + bob], head: [x, y - h * .86 + bob] };
}
export const KITCHEN4_WIN = { x: 160, y: 150, w: 520, h: 480 };
export function roomKitchen4(ctx, t, v, o = {}) {
  F.inView(ctx, v, () => {
    ctx.fillStyle = lin(ctx, 0, 0, 1920, 0, [[0, mixHex(GOLD.mid, CREAM, .35)], [.5, mixHex(GOLD.shade, CREAM, .25)], [1, mixHex(GOLD.shade, P.ind2, .45)]]); ctx.fillRect(-400, -400, 2800, 1300);
    ctx.fillStyle = rgba(CREAM, .1); for (let x = 760; x < 1900; x += 64) for (let y = 260; y < 560; y += 64) ctx.fillRect(x, y, 60, 60);   // tiles over the counter
    ctx.fillStyle = mixHex(GOLD.deep, P.night1, .35); ctx.fillRect(-400, 880, 2800, 700);
    const R = KITCHEN4_WIN;
    ctx.save(); ctx.beginPath(); ctx.rect(R.x, R.y, R.w, R.h); ctx.clip();
    ctx.fillStyle = lin(ctx, 0, R.y, 0, R.y + R.h, [[0, mixHex('#9fc2ee', CREAM, .35)], [.75, GOLD.hot], [1, GOLD.body]]); ctx.fillRect(R.x, R.y, R.w, R.h);
    halo(ctx, R.x + 340, R.y + 360, 230, .9, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.core; ctx.beginPath(); ctx.arc(R.x + 340, R.y + 360, 46, 0, TAU); ctx.fill();
    ctx.fillStyle = mixHex(P.ind2, GOLD.shade, .4); for (let i = 0; i < 5; i++) ctx.fillRect(R.x + i * 110, R.y + R.h - 90 - (i % 2) * 30, 96, 140);
    ctx.restore();
    ctx.strokeStyle = mixHex(CREAM, GOLD.shade, .5); ctx.lineWidth = 16; ctx.strokeRect(R.x, R.y, R.w, R.h); ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(R.x + R.w / 2, R.y); ctx.lineTo(R.x + R.w / 2, R.y + R.h); ctx.stroke();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(GOLD.hot, .13); ctx.beginPath(); ctx.moveTo(R.x, R.y + R.h); ctx.lineTo(R.x + R.w, R.y + R.h); ctx.lineTo(R.x + R.w + 500, 1080); ctx.lineTo(R.x + 200, 1080); ctx.closePath(); ctx.fill(); ctx.restore();
    // the counter (right), the table (centre)
    ctx.fillStyle = mixHex(CREAM, GOLD.shade, .45); ctx.fillRect(1500, 560, 520, 320); ctx.fillStyle = mixHex(CREAM, GOLD.shade, .25); ctx.fillRect(1490, 548, 540, 18);
    ctx.fillStyle = mixHex(GOLD.deep, P.night0, .25); ctx.fillRect(700, 700, 640, 26); ctx.fillRect(740, 726, 22, 200); ctx.fillRect(1278, 726, 22, 200);
    const pl = o.plates ?? [1, 1];
    [[860, pl[0]], [1170, pl[1]]].forEach(([px, p]) => { if (p <= 0) return; ctx.fillStyle = mixHex(CREAM, GOLD.shade, .1); ctx.beginPath(); ctx.ellipse(lerp(px - 220, px, sineIO(p)), lerp(640, 694, sineIO(p)), 70, 12, 0, 0, TAU); ctx.fill(); });
    ctx.fillStyle = CREAM; ctx.beginPath(); ctx.roundRect(1010, 652, 44, 46, 7); ctx.fill();
    // you and the helper
    you(ctx, t, 1420, 910 + Math.sin(t * 1.3) * 1.5, 400, { pose: 'hold', dir: -1, look: .2 });
    const hp = helper(ctx, t, 560, 910, 380, { arm: o.arm ?? 0 });
    o.out && (o.out.helper = hp);
  });
}
// a LAW SHEET (paper, x/y centre, w/h): § head, title lines (o.title [[text, u]]), body rules; o.tip 0..1 (tips back flat), o.u
export function lawSheet(ctx, t, x, y, w, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const tip = sineIO(clamp(o.tip ?? 0));
  ctx.save(); ctx.translate(x, y + h / 2); ctx.transform(1, 0, -.6 * tip, 1 - .78 * tip, 0, 0); ctx.translate(-x, -(y + h / 2));
  ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(x - w / 2 + 8, y - h / 2 + 10, w, h);
  ctx.fillStyle = lin(ctx, 0, y - h / 2, 0, y + h / 2, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(x - w / 2, y - h / 2, w, h);
  ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.strokeRect(x - w / 2, y - h / 2, w, h);
  F.glowText(ctx, '§', x - w / 2 + 34, y - h / 2 + 70, { size: 60, serif: true, col: PAPER.ink, glow: false });
  let yy = y - h / 2 + 150;
  for (const [txt, tu] of (o.title || [])) { if (tu > 0) { ctx.save(); ctx.globalAlpha *= clamp(tu * 2); F.glowText(ctx, txt, x - w / 2 + 34, yy + (1 - expoOut(tu)) * 14, { size: o.size ?? 38, serif: true, col: PAPER.ink, glow: false }); ctx.restore(); } yy += (o.size ?? 38) * 1.18; }
  if (o.sub && o.sub[1] > 0) { ctx.save(); ctx.globalAlpha *= clamp(o.sub[1] * 2); F.glowText(ctx, o.sub[0], x - w / 2 + 34, yy + 12, { size: 22, weight: 700, col: PAPER.faint, glow: false, spacing: .12 }); ctx.restore(); }
  ctx.strokeStyle = rgba(PAPER.ink, .22); ctx.lineWidth = 3; for (let j = 0; j < 5; j++) { const ly = y + h / 2 - 150 + j * 26; if (ly < yy + 30) continue; ctx.beginPath(); ctx.moveTo(x - w / 2 + 34, ly); ctx.lineTo(x + w / 2 - 34 - (j % 2) * 60, ly); ctx.stroke(); }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ ENDING 3 · the bedroom, the plot, register, coins
export const BED3_WIN = { x: 1080, y: 170, w: 600, h: 460 };
// the plot as seen from the window: R = the window rect; your fence, the machine hall with a LEASE sign
export function plotView(ctx, t, R, o = {}) {   // o.lease 0..1 (the sign drops in), o.hall (hall centre, fraction of R.w)
  ctx.fillStyle = lin(ctx, 0, R.y, 0, R.y + R.h, [[0, mixHex('#9fc2ee', CREAM, .4)], [.5, mixHex(GOLD.hot, CREAM, .3)], [1, GOLD.mid]]); ctx.fillRect(R.x, R.y, R.w, R.h);
  const gy = R.y + R.h * .55; ctx.fillStyle = lin(ctx, 0, gy, 0, R.y + R.h, [[0, '#8a9358'], [1, '#6d7445']]); ctx.fillRect(R.x, gy, R.w, R.h);
  // the fence (posts + rails) round the plot
  const fx0 = R.x + R.w * .12, fx1 = R.x + R.w * .88, fy = gy + R.h * .3;
  ctx.strokeStyle = mixHex(CREAM, GOLD.shade, .3); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(fx0, fy); ctx.lineTo(fx1, fy); ctx.moveTo(fx0, fy - 14); ctx.lineTo(fx1, fy - 14); ctx.stroke();
  for (let x = fx0; x <= fx1 + 1; x += (fx1 - fx0) / 12) { ctx.beginPath(); ctx.moveTo(x, fy + 4); ctx.lineTo(x, fy - 26); ctx.stroke(); }
  // the machine hall on the plot (cool lit), a lease sign
  const hx = R.x + R.w * (o.hall ?? .55), hy = gy + R.h * .26, hw = R.w * .4, hh = R.h * .26;
  ctx.fillStyle = mixHex(P.ind2, COOL.deep, .45); ctx.fillRect(hx - hw / 2, hy - hh, hw, hh);
  ctx.beginPath(); ctx.moveTo(hx - hw / 2, hy - hh); ctx.quadraticCurveTo(hx, hy - hh * 1.5, hx + hw / 2, hy - hh); ctx.fill();
  for (let k = 0; k < 4; k++) { ctx.fillStyle = rgba(COOL.body, .6 + .2 * Math.sin(t * 1.5 + k)); ctx.fillRect(hx - hw / 2 + 16 + k * (hw - 32) / 4, hy - hh * .62, (hw - 32) / 4 - 10, hh * .22); }
  F.agentGlyph(ctx, t, hx, hy - hh * .2, hh * .09, { ping: .5, col: COOL.core });
  const lu = clamp(o.lease ?? 1); if (lu <= 0) return;
  const sx = hx - hw / 2 - R.w * .1, sy = fy - 30 + (1 - expoOut(lu)) * 40; ctx.save(); ctx.beginPath(); ctx.rect(R.x, R.y, R.w, fy + 4 - R.y); ctx.clip();
  ctx.fillStyle = mixHex(GOLD.deep, P.night1, .3); ctx.fillRect(sx - 3, sy - 10, 6, 46);
  ctx.fillStyle = PAPER.lit; ctx.fillRect(sx - 52, sy - 46, 104, 38); F.glowText(ctx, 'LEASE', sx, sy - 18, { size: 22, weight: 700, align: 'center', col: PAPER.ink, glow: false, spacing: .14 });
  ctx.restore();
}
export function roomBed3(ctx, t, v, o = {}) {
  F.inView(ctx, v, () => {
    ctx.fillStyle = lin(ctx, 0, 0, 1920, 0, [[0, mixHex(P.ind2, GOLD.deep, .35)], [.6, mixHex(GOLD.shade, P.ind2, .35)], [1, mixHex(GOLD.mid, GOLD.shade, .5)]]); ctx.fillRect(-400, -400, 2800, 1300);
    ctx.fillStyle = mixHex(GOLD.deep, P.night1, .5); ctx.fillRect(-400, 880, 2800, 700);
    const R = BED3_WIN; ctx.save(); ctx.beginPath(); ctx.rect(R.x, R.y, R.w, R.h); ctx.clip(); plotView(ctx, t, R, o.plot); ctx.restore();
    ctx.strokeStyle = mixHex(CREAM, GOLD.deep, .45); ctx.lineWidth = 18; ctx.strokeRect(R.x, R.y, R.w, R.h); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(R.x, R.y + R.h * .42); ctx.lineTo(R.x + R.w, R.y + R.h * .42); ctx.stroke();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(GOLD.hot, .12); ctx.beginPath(); ctx.moveTo(R.x, R.y + R.h); ctx.lineTo(R.x + R.w, R.y + R.h); ctx.lineTo(R.x + R.w - 300, 1080); ctx.lineTo(R.x - 500, 1080); ctx.closePath(); ctx.fill(); ctx.restore();
    // the bed (left), the bedside table with the notice
    ctx.fillStyle = mixHex(GOLD.deep, P.night0, .35); ctx.fillRect(120, 560, 36, 360); ctx.beginPath(); ctx.roundRect(120, 560, 140, 300, 16); ctx.fill();
    ctx.fillStyle = mixHex(CREAM, GOLD.shade, .5); ctx.beginPath(); ctx.roundRect(150, 760, 640, 96, 12); ctx.fill();
    ctx.fillStyle = mixHex(CREAM, GOLD.shade, .3); ctx.beginPath(); ctx.roundRect(170, 726, 160, 48, 20); ctx.fill();
    ctx.fillStyle = mixHex(CREAM, GOLD.mid, .45); ctx.beginPath(); ctx.moveTo(340, 752); ctx.quadraticCurveTo(560, 720, 790, 770); ctx.lineTo(790, 800); ctx.lineTo(340, 790); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mixHex(GOLD.deep, P.night0, .3); ctx.fillRect(150, 856, 640, 50); ctx.fillRect(760, 760, 30, 160);
    ctx.fillStyle = mixHex(GOLD.deep, P.night0, .2); ctx.fillRect(830, 720, 170, 200);   // bedside table
    notice(ctx, t, 915, 660, o.notice ?? 0, o.arrow ?? 0, o.paid ?? 0);
    you(ctx, t, 640, 910 + Math.sin(t * 1.3) * 1.5, 400, { pose: o.pose ?? 'stand', dir: 1, look: o.look ?? .25, ...(o.you || {}) });
  });
}
// the RENT notice on the bedside table (a small cream card with an arrow); u shows the text, arrow 0..1 turns toward you (left), paid
export function notice(ctx, t, x, y, u, arrow, paid) {
  ctx.fillStyle = PAPER.lit; ctx.beginPath(); ctx.roundRect(x - 120, y - 70, 240, 130, 10); ctx.fill(); ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = mixHex(PAPER.body, GOLD.deep, .25); ctx.fillRect(x - 10, y + 60, 20, 4);
  if (u > 0) { ctx.save(); ctx.globalAlpha *= clamp(u * 2); F.glowText(ctx, F.TXT.e3.rent, x, y - 22 + (1 - expoOut(u)) * 10, { size: 24, weight: 700, align: 'center', col: PAPER.ink, glow: false, spacing: .08 }); ctx.restore(); }
  const ang = lerp(0, Math.PI, sineIO(arrow)), ax = x, ay = y + 22;   // the arrow points right (out) → turns to point left (to you)
  if (u > 0) { ctx.save(); ctx.globalAlpha *= clamp(u * 2); ctx.translate(ax, ay); ctx.rotate(ang); ctx.strokeStyle = PAPER.ink; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-40, 0); ctx.lineTo(40, 0); ctx.moveTo(26, -12); ctx.lineTo(40, 0); ctx.lineTo(26, 12); ctx.stroke(); ctx.restore(); }
  if (paid > 0) { ctx.save(); ctx.globalAlpha *= clamp(paid * 2); F.glowText(ctx, '+ PAID TO YOU', x, y - 92 - (1 - expoOut(paid)) * 10, { size: 22, weight: 700, align: 'center', col: CREAM, glow: false, spacing: .1 }); ctx.restore(); }
}
// a COIN (tiny, cream rim): x, y, r
export function coin(ctx, x, y, r, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = mixHex(CREAM, LAMP.body, .5); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = Math.max(1, r * .2); ctx.beginPath(); ctx.arc(x, y, r * .65, 0, TAU); ctx.stroke(); ctx.restore(); }
// the big machine (agent glyph with a small base) that pushes coins
export function payMachine(ctx, t, x, y, r, o = {}) {
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.fillStyle = mixHex(P.night1, COOL.deep, .5); ctx.beginPath(); ctx.roundRect(x - r * 1.1, y + r * 1.05, r * 2.2, r * .5, r * .15); ctx.fill();
  ctx.restore(); F.agentGlyph(ctx, t, x, y, r, { ping: o.ping ?? .5, col: COOL.body, a: o.a ?? 1 });
}

// ------------------------------------------------------------------------------------------------ ENDING 2 · the street (car, walk signal, cloud, ring)
export function roomStreet2(ctx, t, v, o = {}) {
  F.inView(ctx, v, () => {
    // sky (morning), the ring and the cloud are drawn by the caller in this space (o.sky(ctx))
    ctx.fillStyle = lin(ctx, 0, -900, 0, 700, [[0, mixHex('#6f97d8', '#9fc2ee', .3)], [.6, mixHex('#9fc2ee', CREAM, .45)], [1, mixHex(GOLD.hot, CREAM, .3)]]); ctx.fillRect(-2000, -1200, 6000, 1900);
    if (o.sky) o.sky(ctx);
    const gy = 700;
    for (let i = 0; i < 22; i++) {   // houses behind the street
      const hx = -1280 + i * 270, hw = 230, hh = 260 + (i % 3) * 50;
      ctx.fillStyle = mixHex(P.ind2, GOLD.shade, .35 + .1 * (i % 2)); ctx.fillRect(hx, gy - hh, hw, hh);
      ctx.fillStyle = mixHex(LAMP.body, P.ind2, .25); for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) ctx.fillRect(hx + 30 + c * 66, gy - hh + 40 + r * 90, 36, 50);
    }
    ctx.fillStyle = mixHex(CREAM2, P.ind2, .55); ctx.fillRect(-2000, gy, 6000, 60);   // the far pavement
    ctx.fillStyle = mixHex(P.ind2, P.night1, .45); ctx.fillRect(-2000, gy + 60, 6000, 220);   // the road
    for (let k = 0; k < 8; k++) { ctx.fillStyle = rgba(CREAM, .8); ctx.fillRect(1000 + k * 0, gy + 74 + k * 26, 220, 14); }   // the crossing (stripes across the road, seen from the side: as bars)
    ctx.fillStyle = rgba(CREAM, .35); for (let x = -2000; x < 4000; x += 160) if (x < 940 || x > 1260) ctx.fillRect(x, gy + 166, 90, 6);
    ctx.fillStyle = mixHex(CREAM2, P.ind2, .45); ctx.fillRect(-2000, gy + 280, 6000, 400);   // the near pavement
    // the walk signal (at the crossing): stop hand (dim) → walking figure (lit cream)
    const sx = 1290, sy = gy + 290; ctx.fillStyle = mixHex(P.night1, P.blue1, .4); ctx.fillRect(sx - 6, sy - 300, 12, 300); ctx.fillRect(sx - 34, sy - 380, 68, 90);
    const go = clamp(o.go ?? 0);
    ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.fillRect(sx - 26, sy - 372, 52, 74);
    if (go > 0) halo(ctx, sx, sy - 335, 90, .6 * go, LAMP.body, LAMP.core);
    ctx.fillStyle = mixHex(P.ind2, CREAM, go * .95); ctx.save(); ctx.translate(sx, sy - 335); ctx.beginPath(); ctx.arc(0, -22, 6, 0, TAU); ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = ctx.fillStyle; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(0, 6); ctx.moveTo(0, 6); ctx.lineTo(-9, 24); ctx.moveTo(0, 6); ctx.lineTo(9, 24); ctx.moveTo(0, -8); ctx.lineTo(-10, 4); ctx.moveTo(0, -8); ctx.lineTo(10, 2); ctx.stroke(); ctx.restore();
    // the car (from the left; brakes by itself before the crossing)
    const cx = o.carX ?? 600, dip = o.dip ?? 0; car(ctx, t, cx, gy + 210, dip);
    // you
    const y = o.you || { x: 400, walk: null };
    you(ctx, t, y.x, (y.y ?? gy + 330) + Math.sin(t * 1.3) * 1.5, y.h ?? 330, { walk: y.walk, view: y.view, dir: y.dir ?? 1, look: y.look ?? .2, pose: y.pose });
    if (o.front) o.front(ctx);
  });
}
export function car(ctx, t, x, y, dip = 0) {   // x = front bumper, y = road line (wheels); faces right
  ctx.save(); ctx.translate(x, y); ctx.rotate(.035 * dip);
  ctx.fillStyle = mixHex(P.blue1, P.ind2, .3); ctx.beginPath(); ctx.roundRect(-380, -110, 380, 80, 22); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-320, -110); ctx.lineTo(-260, -176); ctx.lineTo(-110, -176); ctx.lineTo(-50, -110); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mixHex('#9fc2ee', CREAM, .35); ctx.beginPath(); ctx.moveTo(-300, -112); ctx.lineTo(-252, -166); ctx.lineTo(-190, -166); ctx.lineTo(-190, -112); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-176, -112); ctx.lineTo(-176, -166); ctx.lineTo(-116, -166); ctx.lineTo(-66, -112); ctx.closePath(); ctx.fill();
  ctx.fillStyle = LAMP.core; ctx.fillRect(-18, -96, 16, 18); halo(ctx, -6, -86, 60, .4, LAMP.body, LAMP.core);
  ctx.fillStyle = P.night0; for (const wx of [-300, -84]) { ctx.beginPath(); ctx.arc(wx, -30, 36, 0, TAU); ctx.fill(); ctx.fillStyle = mixHex(P.blue1, CREAM2, .3); ctx.beginPath(); ctx.arc(wx, -30, 14, 0, TAU); ctx.fill(); ctx.fillStyle = P.night0; }
  ctx.restore();
}
// the READER SURVEY list (no numbers, no axis): x, y top-left, w; u (draws), o.cover (the top line stays covered), o.fold 0..1
export function survey(ctx, t, x, y, w, u, o = {}) {
  if (u <= 0) return null;
  const rows = [[null, 1], ['LIBERTARIAN UTOPIA', .82], [null, .6], [null, .42]], rh = 64;
  F.label(ctx, F.TXT.e2.survey, x, y, span(u, 0, .5), { align: 'left', size: 24, spacing: .08 });
  const out = [];
  rows.forEach(([txt, len], i) => {
    const ru = span(u, .15 + i * .12, .6 + i * .12); if (ru <= 0) return;
    const yy = y + 40 + i * rh, ww = w * len * expoOut(ru);
    if (i === 0 && o.lift) { ctx.strokeStyle = rgba(CREAM, .35); ctx.lineWidth = 2; ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.roundRect(x, yy, ww, 44, 6); ctx.stroke(); ctx.setLineDash([]); out.push({ x, y: yy, w: ww, h: 44 }); }
    else if (i === 0) {   // the covered top line: a cream plate with a soft glint, no text
      ctx.fillStyle = mixHex(PAPER.lit, LAMP.body, .2); ctx.beginPath(); ctx.roundRect(x, yy, ww, 44, 6); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.roundRect(x, yy, ww, 44, 6); ctx.clip(); ctx.fillStyle = rgba('#ffffff', .35); const gx = x + ((t * 220) % (w + 300)) - 150; ctx.beginPath(); ctx.moveTo(gx, yy); ctx.lineTo(gx + 40, yy); ctx.lineTo(gx + 10, yy + 44); ctx.lineTo(gx - 30, yy + 44); ctx.closePath(); ctx.fill(); ctx.restore();
      out.push({ x, y: yy, w: ww, h: 44 });
    } else if (txt) { ctx.fillStyle = rgba(CREAM, .14); ctx.beginPath(); ctx.roundRect(x, yy, ww, 44, 6); ctx.fill(); F.label(ctx, txt, x + 20, yy + 31, span(ru, .3, 1), { align: 'left', size: 24, spacing: .08 }); }
    else { ctx.fillStyle = rgba(CREAM, .08); ctx.beginPath(); ctx.roundRect(x, yy, ww, 44, 6); ctx.fill(); }
  });
  return out[0] || null;
}
