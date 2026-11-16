// Film 19 · B3 (c09 · c10 · c11 + end screen) · shared set, cameras and props of the three chunks (owned by B3; the lead may fold
// parts into the kit). The set is c01's set (same places): the open drawer F.OPEN with THE DISH, you at YOU, the screen at MON.
// Seams inside the group are drawn by the SAME functions on both sides:
//   c09 → c10 at T.G('Still, some researchers'): the aisle at C_AISLE (the open drawer, the dish glowing, you, the screen dark)
//   c10 → c11 at T.G('At the start, the question'): the dish field from straight above (C_TOP = fieldMap(960, 540, 470)), fieldDish()
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f19_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, lin, halo } = E;
const { cam, view, proj, bill, COOL, bump } = F;
const TAU = Math.PI * 2;

// ---------------------------------------------------------------------------------------------------------------- the set
export const DISH = { X: 0, Y: F.drawerY(F.OPEN) + 12, Z: -F.RACK.tray * .5, R: F.RACK.dishR };   // the open dish (slide 1)
export const YOU = { X: -1150, Z: -1100, h: 1700 };
export const MON = { X: 1180, Y: 1240, Z: -660, w: 760 };
export const FIELD = { cx: 960, cy: 540, r: 470 };
export const FRONT = { Y: F.drawerY(F.OPEN) + F.RACK.dh, Z: -F.RACK.tray - 4 };   // top edge of the open drawer's front panel
export const BEE = { X: 150, h: 92 };                                              // the bee rests on that edge (stylised: ~2× life size)

// cameras (world units ≈ mm)
export const C_TOP = cam({ tx: DISH.X, ty: DISH.Y, tz: DISH.Z, d: 1500 * DISH.R / FIELD.r, p: -Math.PI / 2, f: 1500 });
export const C_MON = cam({ tx: MON.X, ty: MON.Y, tz: MON.Z, d: 1500 * MON.w / F.CLIP_RECT.w, p: 0, f: 1500, oy: F.CLIP_RECT.y + F.CLIP_RECT.h / 2 - H / 2 });
// the aisle at the c09 | c10 seam: the alive rack with the open drawer centre-right, you left, the screen right (dark)
export const C_AISLE = cam({ tx: -300, ty: 1200, tz: -600, d: 2650, p: -.2 });

export const night = (ctx) => { ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.55, P.night1], [1, P.night0]]); ctx.fillRect(0, 0, W, H); };

// the dish's look in the field at the seams (c10 | c11) and in the aisle (one set of options for every B3 chunk)
export const DISH_FIELD = { glow: .55, chip: .5, electrodes: .25, rim: .7 };
export const DISH_AISLE = { glow: .9, chip: 1, electrodes: .6, rim: 1 };
export const NET_STD = { lit: 1, ambient: 1, w: 1.25 };

// camera interpolation between two cams with SEPARATE eases for the target and for pitch/distance (a tilt that leads with the
// target: c01 camDesc; or leads with pitch: the tilt up out of the dish). uT/uP = [from, to] windows inside 0..1.
export function camSplit(A, B, u, uT = [0, .7], uP = [.2, 1]) {
  const eT = sineIO(clamp((u - uT[0]) / (uT[1] - uT[0]))), eP = sineIO(clamp((u - uP[0]) / (uP[1] - uP[0]))), o = {};
  for (const k of ['tx', 'ty', 'tz', 'ox', 'oy', 'f']) o[k] = lerp(A[k] ?? 0, B[k] ?? 0, eT);
  o.p = lerp(A.p, B.p, eP); o.d = Math.exp(lerp(Math.log(A.d), Math.log(B.d), eP));
  return o;
}
// a gentle dolly that runs THROUGH a seam: d is scaled by exp(k (t-s) e^(-((t-s)/w)^2)): 0 offset at s and far from it, speed k at s.
// Both chunks of a seam call it with the same s, k, w, so the camera is identical at s and never stands still there.
export function seamGlide(c, t, s, k = -.05, w = 1) {
  const x = t - s; if (Math.abs(x) > 4 * w) return c;
  return { ...c, d: c.d * Math.exp(k * x * Math.exp(-(x / w) * (x / w))) };
}
// drift that fades to 0 near given seam times (both sides of a seam then show the identical camera)
export function driftAmt(t, seams, base = .35, ramp = 1.2) {
  let k = 1; for (const s of seams) k = Math.min(k, smooth(clamp(Math.abs(t - s) / ramp)));
  return base * k;
}

// ---------------------------------------------------------------------------------------------------------------- you
// you in the aisle (yellow raincoat), the same net glowing in your hood. o: { look, arms, dir, view, on (head net), x, z }
export function youAisle(ctx, t, v, o = {}) {
  const X = o.x ?? YOU.X, Z = o.z ?? YOU.Z, h = YOU.h, look = (o.look ?? 0) + .04 * Math.sin(t * .7), br = .02 * Math.sin(t * 1.6);
  const p = bill(ctx, v, X, 0, Z, () => {
    ctx.scale(1, 1 + .006 * Math.sin(t * 1.6));
    E.du(ctx, 0, 0, h, { dir: o.dir ?? 1, view: o.view ?? 'side', look, light: 1, armR: o.armR ?? [.16 + br, .12], armL: o.armL ?? [-.1 - br, -.06], walk: o.walk });
  });
  const on = o.on ?? .55;
  if (!p || on <= 0) return p;
  const hp = proj(v, X + (o.dir ?? 1) * (.03 - .012 * look) * h, .875 * h, Z);
  if (hp) {
    const r = .07 * h * hp[2];
    halo(ctx, hp[0], hp[1], r * 2.4, .3 * on, P.halo1, P.core1);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.arc(hp[0], hp[1], r, 0, TAU); ctx.clip();
    ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .75;
    F.net(ctx, t, F.fieldMap(hp[0], hp[1], r * 2.3), { lit: on, ambient: 1, w: .9, nSparks: 9 });
    ctx.restore();
  }
  return p;
}

// ---------------------------------------------------------------------------------------------------------------- the bee
// a bee in world units at (X, Y, Z) (Y = where its feet are). o: { fly 0..1 (wings beat, body bobs), rot, a, h }
export function bee(ctx, t, v, X, Y, Z, o = {}) {
  const h = o.h ?? BEE.h, fly = o.fly ?? 0;
  return bill(ctx, v, X, Y, Z, (s) => {
    ctx.rotate(o.rot ?? 0);
    halo(ctx, 0, -h * .35, h * 1.6, .28, P.halo1, P.core1);
    F.creature(ctx, 'bee', 0, 0, h, { fill: .75, lit: 1 });
    // wings: two thin cream ellipses that beat while flying, rest folded back when landed (a slow breath)
    const beat = fly > 0 ? Math.sin(t * 70) : 0, open = lerp(.12 + .05 * Math.sin(t * 1.3), .5 + .45 * beat, fly);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const [dx, k] of [[.06, 1], [-.04, .7]]) {
      ctx.save(); ctx.translate(dx * h, -.55 * h); ctx.rotate(-.5 - open * 1.1 * k);
      ctx.fillStyle = rgba(P.cream, .22 + .1 * k); ctx.beginPath(); ctx.ellipse(.2 * h, 0, .26 * h, .085 * h, 0, 0, TAU); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  });
}

// ---------------------------------------------------------------------------------------------------------------- the dish field
// the field at the c10 | c11 seam: night + the dish at the given map (default FIELD), standard options, the net alive
export function fieldDish(ctx, t, map, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (o.night !== false) night(ctx);
  F.dish(ctx, t, map || F.fieldMap(FIELD.cx, FIELD.cy, FIELD.r), { ...DISH_FIELD, ...(o.dishO || {}), net: { ...NET_STD, ...(o.net || {}) } });
  ctx.restore();
}

// a small cool chat bubble (a chatbot, no logo): (x, y) centre, s size px. o: { u 0..1 (grows from its tail), a }
export function chatBubble(ctx, t, x, y, s, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const k = expoOut(u), w = s * 1.5 * k, hh = s * k;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  const p = new Path2D(); p.roundRect(x - w / 2, y - hh / 2, w, hh, hh * .3); p.moveTo(x - w * .2, y + hh / 2 - 1); p.lineTo(x - w * .32, y + hh / 2 + s * .28 * k); p.lineTo(x - w * .02, y + hh / 2 - 1); p.closePath();
  halo(ctx, x, y, s * 1.6 * k, .3, COOL.edge, COOL.core);
  ctx.fillStyle = rgba(COOL.deep, .7); ctx.fill(p); ctx.strokeStyle = rgba(COOL.mid, .85); ctx.lineWidth = Math.max(1.5, s * .035); ctx.stroke(p);
  for (let i = 0; i < 3; i++) { const b = .5 + .5 * Math.sin(t * 4 - i * .9); ctx.fillStyle = rgba(COOL.core, (.45 + .5 * b) * clamp(u * 2 - 1)); ctx.beginPath(); ctx.arc(x + (i - 1) * s * .32 * k, y, s * .075 * k, 0, TAU); ctx.fill(); }
  ctx.restore();
}

// a place / name label like c01's SINGAPORE: a rule from an anchor point, a line, a caps label (+ optional second line)
export function label(ctx, t, x0, y0, txt, sub, u, o = {}) {
  if (u <= 0) return;
  const dx = o.dx ?? 70, dy = o.dy ?? -70, x1 = x0 + dx, y1 = y0 + dy, w = o.w ?? 260;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  F.rule(ctx, x0, y0, x1, y1, smooth(clamp(u * 1.6)), { w: 2 });
  ctx.strokeStyle = rgba(P.halo1, .6 * u); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 + (dx < 0 ? -1 : 1) * w * expoOut(u), y1); ctx.stroke();
  const lx = dx < 0 ? x1 - w : x1 + 4;
  F.maskLine(ctx, [[txt, 0]], lx, y1 - 14, o.size ?? 30, u, { serif: false, weight: 600, col: P.cream, glow: false });
  if (sub) F.maskLine(ctx, [[sub, 0]], lx, y1 + 30, 18, u, { serif: false, weight: 600, col: P.halo2, glow: false });
  ctx.restore();
}

// THE BOX (cl1) without its window dish and without the blur glow (the blur is far too costly when the camera pulls back from deep
// inside the window): same body, tubes, reservoir and status light as F.cl1; returns the window [wx, wy, wr] (draw the dish there).
// o: { pump, a, glow 0..1 (soft blue aura), lit (window halo) }
export function boxBody(ctx, t, x, y, w, o = {}) {
  const a = o.a ?? 1, h = w * .62; if (a <= 0) return null;
  const wx = x - w * .12, wy = y - h * .56, wr = h * .3;
  ctx.save(); ctx.globalAlpha *= a;
  halo(ctx, x, y - h * .5, w * .75, .16 * (o.glow ?? 1), P.blue0, P.blue1);
  const body = new Path2D(); body.roundRect(x - w / 2, y - h, w, h, w * .06);
  ctx.fillStyle = lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, mixHex(P.night1, P.ind2, .6)], [.55, mixHex(P.ind1, P.blue1, .35)], [1, P.night1]]); ctx.fill(body);
  ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = Math.max(1, w * .008); ctx.stroke(body);
  ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(x - w / 2 + w * .05, y - h * .22, w * .9, h * .02);
  if (o.hole !== false) { ctx.beginPath(); ctx.arc(wx, wy, wr, 0, TAU); ctx.fillStyle = P.night0; ctx.fill(); }
  const pump = o.pump ?? .6, rx = x + w * .3;
  ctx.strokeStyle = rgba(COOL.edge, .75); ctx.lineWidth = w * .022; ctx.lineCap = 'round';
  for (const k of [0, 1]) { ctx.beginPath(); ctx.moveTo(wx + wr * .9, wy - wr * .2 + k * wr * .4); ctx.bezierCurveTo(wx + wr * 1.6, wy - wr * .4 + k * wr * .8, rx - w * .08, y - h * .78 + k * h * .3, rx, y - h * .7 + k * h * .3); ctx.stroke(); }
  ctx.fillStyle = mixHex(P.night1, COOL.deep, .5); ctx.beginPath(); ctx.roundRect(rx - w * .06, y - h * .84, w * .14, h * .62, w * .03); ctx.fill(); ctx.stroke();
  const lvl = .55 + .05 * Math.sin(t * 1.2); ctx.fillStyle = rgba(COOL.edge, .5); ctx.fillRect(rx - w * .05, y - h * .24 - h * .56 * lvl, w * .12, h * .56 * lvl);
  if (pump > 0) { const u = (t * .8) % 1; const px = lerp(wx + wr, rx, u), py = lerp(wy, y - h * .7, u) - Math.sin(Math.PI * u) * h * .08; halo(ctx, px, py, w * .03, .6 * pump, COOL.edge, COOL.core); }
  const sl = .7 + .3 * Math.sin(t * 2.1); ctx.fillStyle = rgba(COOL.core, sl); ctx.beginPath(); ctx.arc(x + w * .41, y - h * .12, w * .012, 0, TAU); ctx.fill();
  ctx.restore();
  return { window: [wx, wy, wr], rect: [x - w / 2, y - h, w, h] };
}
// the window's glass ring and its halo (drawn after the dish in the window)
export function boxWindowRim(ctx, wx, wy, wr, w, lit = 1) {
  halo(ctx, wx, wy, wr * 2.2, .35 * lit, P.halo1, P.core1);
  ctx.strokeStyle = rgba(COOL.mid, .7); ctx.lineWidth = Math.max(1, w * .01); ctx.beginPath(); ctx.arc(wx, wy, wr, 0, TAU); ctx.stroke();
}
// a small dish seen from above (cheap: rim, medium, a few lit somas). (x, y) centre, r = dish radius px. o: { lit, a, t }
export function miniDish(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || r <= .5) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.fillStyle = rgba(mixHex(P.blue0, P.halo1, .5), .22 * (o.lit ?? 1)); ctx.beginPath(); ctx.arc(x, y, r * .7, 0, TAU); ctx.fill();
  const n = r > 30 ? 34 : r > 12 ? 12 : 5;
  ctx.fillStyle = rgba(P.core1, .85 * (o.lit ?? 1));
  for (let i = 0; i < n; i++) { const s = F.NET.somas[(i * 7) % 34], fl = .6 + .4 * Math.sin(t * 2.3 + i * 1.7 + (o.ph ?? 0)); ctx.globalAlpha = a * fl; ctx.beginPath(); ctx.arc(x + s[0] * r, y - s[1] * r, Math.max(.9, r * .045), 0, TAU); ctx.fill(); }
  ctx.globalAlpha = a;
  halo(ctx, x, y, r * 1.4, .16 * (o.lit ?? 1), P.halo1, P.core1);
  ctx.strokeStyle = rgba(COOL.mid, .55); ctx.lineWidth = Math.max(1, r * .04); ctx.beginPath(); ctx.arc(x, y, r * 1.07, 0, TAU); ctx.stroke();
  ctx.restore();
}
