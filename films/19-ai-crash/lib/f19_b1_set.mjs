// Film 19 · builder B1 (c03–c06) · shared helpers and the pictures that live on both sides of B1's inner seams.
// Owned by B1. Not kit: the lead may lift pieces into f19_kit later.
//   cam2At(t, K)              2D camera from word keys: K = [[t, { x, y, s }, ease]] (x, y = world point at the frame centre, s = zoom;
//                             s interpolated in log space, ease 's' sine (default) | 'q' quart in-out | 'o' expo out | 'i' expo in)
//   withCam(ctx, c, fn)       draw fn in world space under camera c (screen = (p − c) · s + centre)
//   toScr(c, x, y)            world → screen
//   camLive(c, t, k)          the permanent breath (k = 0 switches it off, e.g. on a seam frame)
//   riseText(ctx, s, x, y, t, t0, o)  text rising from its baseline (mask), o.out = time it sinks back; o as glowText
//   huds(ctx, t, T, o)        the two kit HUDs (o.umb / o.day alpha 0..1)
//   night(ctx, t)             the plate's night (same as lib/f19_seams.mjs), screen space
//   screenFlood(ctx, t, r)    the lit phone screen as a warm panel at screen rect r (c03 → c04: gore 1 drops and becomes the screen)
//   FLOOD                     the full-frame rect of the flood (both sides draw it around the c03|c04 seam)
//   TABLE / tableWorld(ctx, t, T, c, st)  your table at night (c04 and the first second of c05): wall, big window onto the night
//                             plain, the table, the lamp (hero), laptop, second phone, your phone; st = state of the screens
//   EDGE                      the glide over the table edge (c04 → c05): camEdge(t, T) and the road behind the window
import { Path2D, createCanvas } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f19_kit.mjs';
import * as PR from './f19_props.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, lin, rad, halo, drift } = E;
// E.glowFill sets globalAlpha absolutely; this local one respects the alpha already in effect (fades fade the glow too)
const glowFill = (ctx, p, b, a, col) => E.glowFill(ctx, p, b, a * ctx.globalAlpha, col);

// ------------------------------------------------------------------------------------------------------------- camera
export function cam2At(t, K) {
  if (t <= K[0][0]) return { ...K[0][1] };
  if (t >= K[K.length - 1][0]) return { ...K[K.length - 1][1] };
  let i = 0; while (t > K[i + 1][0]) i++;
  const a = K[i][1], b = K[i + 1][1], e = { s: sineIO, q: quartIO, i: expoIn, o: expoOut }[K[i + 1][2] || 's'];
  const u = e((t - K[i][0]) / (K[i + 1][0] - K[i][0]));
  const s = Math.exp(lerp(Math.log(a.s), Math.log(b.s), u));
  // keep the zoom centre consistent: interpolate the screen-anchored point so a push lands where it aims
  return { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), s };
}
export const camLive = (c, t, k = 1) => ({ x: c.x + drift(t, 5 * k / c.s, 3), y: c.y + drift(t, 3 * k / c.s, 7), s: c.s * (1 + .006 * k * Math.sin(t * .21 + 1)) });
export function withCam(ctx, c, fn) { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(c.s, c.s); ctx.translate(-c.x, -c.y); fn(); ctx.restore(); }
export const toScr = (c, x, y) => [W / 2 + (x - c.x) * c.s, H / 2 + (y - c.y) * c.s];
export const toWorld = (c, x, y) => [c.x + (x - W / 2) / c.s, c.y + (y - H / 2) / c.s];
export const rectScr = (c, r) => { const [x, y] = toScr(c, r.x, r.y); return { x, y, w: r.w * c.s, h: r.h * c.s }; };

// ------------------------------------------------------------------------------------------------------------- type
export function riseText(ctx, s, x, y, t, t0, o = {}) {
  const u = expoOut(span(t, t0, t0 + (o.d ?? .55))); if (u <= 0) return;
  const d = o.out != null ? expoIn(span(t, o.out, o.out + .4)) : 0; if (d >= 1) return;
  const size = o.size ?? 34, lift = size * 1.25;
  ctx.save(); ctx.beginPath(); ctx.rect(x - 4000, y - size * 1.5, 8000, size * 1.5 + size * .32); ctx.clip();
  E.glowText(ctx, s, x, y + (1 - u) * lift + d * lift, o);
  ctx.restore();
}
export const SRC = { size: 22, weight: 600, col: P.halo2, glow: false, spacing: .12 };
export const LBL = { size: 34, weight: 600, spacing: .06 };

// ------------------------------------------------------------------------------------------------------------- HUD + night
export function huds(ctx, t, T, o = {}) {
  if ((o.umb ?? 1) > 0) F.hudUmbrella(ctx, t, T, { a: o.umb ?? 1 });
  if ((o.day ?? 1) > 0) F.hudDay(ctx, t, T, { a: o.day ?? 1 });
}
export function night(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.6, P.night1], [1, mixHex(P.ind0, P.blue1, .2)]]); ctx.fillRect(0, 0, W, H);
  E.stars(ctx, 1919, 70, t, [0, 0, W, H], .4);
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------------------- the flood (gore 1 → your phone)
export const FLOOD = { x: -40, y: -40, w: W + 80, h: H + 80 };
export function screenFlood(ctx, t, r, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= a;
  const p = new Path2D(); p.roundRect(r.x, r.y, r.w, r.h, Math.min(r.w, r.h) * .08);
  if (r.w < W) glowFill(ctx, p, Math.max(10, r.w * .12), .55, P.halo0);
  ctx.fillStyle = rad(ctx, r.x + r.w * (.5 + .05 * Math.sin(t * .9)), r.y + r.h * (.42 + .04 * Math.cos(t * .7)), Math.max(r.w, r.h) * (.75 + .03 * Math.sin(t * 1.3)), [[0, mixHex(P.halo0, P.core1, .35)], [.55, mixHex(P.halo1, P.shade0, .25)], [1, mixHex(P.shade0, P.ind1, .35)]]);
  ctx.fill(p);
  // the panel hums: two slow bands of brighter light run through it (alive, never still)
  ctx.save(); ctx.clip(p);
  for (let k = 0; k < 2; k++) { const yy = r.y + r.h * (((t * .11 + k * .5) % 1) * 1.4 - .2); ctx.fillStyle = lin(ctx, 0, yy - r.h * .12, 0, yy + r.h * .12, [[0, rgba(P.core0, 0)], [.5, rgba(P.core0, .2)], [1, rgba(P.core0, 0)]]); ctx.fillRect(r.x, yy - r.h * .12, r.w, r.h * .24); }
  ctx.restore();
  ctx.restore();
}

// F.vWindow, but the window grows out of its source instead of popping in: for the first third of `open` the glow, the rim and the
// night fill and the content come up from 0 over the source (same in reverse when it closes).
export function vWin(ctx, t, rect, open, draw, o = {}) {
  const u = clamp(open); if (u <= 0) return null;
  const from = o.from ?? { x: rect.x + rect.w * .45, y: rect.y + rect.h / 2 - 2, w: rect.w * .1, h: 4 };
  const e = quartIO(u), r = { x: lerp(from.x, rect.x, e), y: lerp(from.y, rect.y, e), w: lerp(from.w, rect.w, e), h: lerp(from.h, rect.h, e) }, rr = o.radius ?? 10;
  const k = smooth(clamp(u / .34));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if ((o.mat ?? 0) > 0) { ctx.fillStyle = rgba(P.night0, .55 * o.mat * u); ctx.fillRect(0, 0, W, H); }
  const p = new Path2D(); p.roundRect(r.x, r.y, r.w, r.h, rr);
  E.glowFill(ctx, p, 40, .5 * k * ctx.globalAlpha, P.halo0);
  ctx.save(); ctx.clip(p); ctx.globalAlpha *= k; ctx.fillStyle = P.night0; ctx.fillRect(r.x, r.y, r.w, r.h);
  draw(ctx, r, u); ctx.restore();
  ctx.strokeStyle = rgba(P.halo0, (o.fromRim ?? .55) + (1 - (o.fromRim ?? .55)) * k); ctx.lineWidth = o.rim ?? 4; ctx.shadowColor = rgba(P.halo0, .9 * k); ctx.shadowBlur = 18; ctx.stroke(p);
  ctx.restore();
  return r;
}

// ------------------------------------------------------------------------------------------------------------- your table (c04, c05 head)
// World layout (camera { x 960, y 540, s 1 } shows it as designed): a dark wall with one huge window onto the night plain (the road's
// plain: F.road in screen space behind it), the table top across the lower third, the lamp right, your phone centre, the laptop at the
// back left, a second phone right.
export const TABLE = { x: 960, y: 640, w: 1640, lampX: .8 };
export const PHONE = { x: 900, y: 772, h: 300 };              // your phone (front view, lying on the table seen from above-front)
export const PHONE2 = { x: 1240, y: 790, h: 210, tilt: .32 };  // the group chat
export const LAPTOP = { x: 520, y: 640, w: 330 };              // the news
export const WIN = { x: 70, y: -40, w: 1780, h: 680 };        // the window opening (world)
export function phoneScreenRect(h = PHONE.h) { const w = h * .5; return { x: PHONE.x - w / 2 + w * .06, y: PHONE.y - h / 2 + w * .06, w: w * .88, h: h - w * .12 }; }
export function roadCamForTable(t) { return F.roadSetCam(0 + t * 0, {}); }
// the glide over the table edge (c04 4.11 → c05 5.01): one camera both chunks use between EDGE.t0 and EDGE.t1
export function edgeTimes(T) { const t0 = T.G('face down') - .5, b = T.G('Day forty-eight'); return { t0, b, t1: b + 1.5 }; }
export function camEdge(t, T) {
  const { t0, b, t1 } = edgeTimes(T);
  // at b the table's far edge sits on the road horizon (screen y = ROADSET.hy); then the camera rises and glides on: the edge leaves below.
  // The zoom runs through the whole glide (never stops at b), the edge's screen height is eased separately: 646 → hy (sine) → 1180 (expo in).
  const A = { x: 900, y: 690, s: 1.6 };                 // = the c04 framing for the flip (sc04 hands over at t0)
  if (t <= t0) return { ...A };
  const s = Math.exp(lerp(Math.log(A.s), Math.log(2.05), sineIO(clamp((t - t0) / (t1 - t0)))));
  const eA = H / 2 + (TABLE.y - A.y) * A.s, hy = F.ROADSET.hy;
  const e = t < b ? lerp(eA, hy, sineIO((t - t0) / (b - t0))) : lerp(hy, 1180, expoIn(clamp((t - b) / (t1 - b))));
  return { x: lerp(A.x, 1000, sineIO(clamp((t - t0) / (b - t0)))), y: TABLE.y - (e - H / 2) / s, s };
}
export function edgeY(c) { return H / 2 + (TABLE.y - c.y) * c.s; }

// screens: st { lock 0..1 (red arrows), news 0..1, chat 0..1, face 1/0, glow (the warm screen right after the flood) }
export function tableWorld(ctx, t, T, c, st = {}) {
  // the night plain through the window: the road world in screen space (horizon fixed), the walk not started yet
  if (st.bg) st.bg(ctx, t); else F.road(ctx, t, F.roadSetCam(0), { mist: F.ROADSET.mist, lit: 0, dash: .32 });
  withCam(ctx, c, () => {
    // the wall around the window (dark indigo), mullions
    const wall = new Path2D(); wall.rect(-3000, -3000, 7000, 7000); wall.rect(WIN.x, WIN.y, WIN.w, WIN.h);
    ctx.fillStyle = lin(ctx, 0, -600, 0, 900, [[0, mixHex(P.night0, P.ind0, .5)], [1, mixHex(P.ind0, P.night1, .4)]]); ctx.fill(wall, 'evenodd');
    ctx.fillStyle = mixHex(P.night0, P.ind0, .7);
    ctx.fillRect(380, WIN.y, 14, WIN.h); ctx.fillRect(1540, WIN.y, 14, WIN.h);
    ctx.strokeStyle = rgba(P.blue0, .35); ctx.lineWidth = 3; ctx.strokeRect(WIN.x, WIN.y, WIN.w, WIN.h);
    // the table top (props.table), lamp right: the warm hero
    const lamp = PR.table(ctx, t, TABLE.x, TABLE.y, TABLE.w, { lamp: 1 * (.94 + .06 * Math.sin(t * 1.7)), lampX: TABLE.lampX });
    ctx.fillStyle = mixHex(P.night1, P.night0, .5); ctx.fillRect(-3000, TABLE.y + 220, 7000, 3000);   // under the table edge
    // laptop at the back: screen with the red ticker on "news"
    const L = LAPTOP, lh = L.w * .62;
    ctx.fillStyle = mixHex(P.night0, P.ind0, .5); ctx.beginPath(); ctx.moveTo(L.x - L.w / 2 - 30, L.y + 26); ctx.lineTo(L.x + L.w / 2 + 30, L.y + 26); ctx.lineTo(L.x + L.w / 2, L.y + 4); ctx.lineTo(L.x - L.w / 2, L.y + 4); ctx.closePath(); ctx.fill();
    const lsr = new Path2D(); lsr.roundRect(L.x - L.w / 2, L.y - lh, L.w, lh, 8);
    ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.fill(lsr);
    const nw = clamp(st.news ?? 0);
    if (nw > 0) {
      glowFill(ctx, lsr, 30, .35 * nw, F.RED.deep);
      ctx.save(); ctx.clip(lsr); ctx.globalAlpha *= nw;
      ctx.fillStyle = mixHex(P.ind1, F.RED.ink, .5); ctx.fillRect(L.x - L.w / 2, L.y - lh, L.w, lh);
      ctx.fillStyle = rgba(P.cream, .5); for (let k = 0; k < 3; k++) ctx.fillRect(L.x - L.w / 2 + 24, L.y - lh + 30 + k * 26, L.w * (.55 - k * .12), 9);
      ctx.fillStyle = F.RED.line; ctx.fillRect(L.x - L.w / 2, L.y - 52, L.w, 34);
      ctx.font = '600 20px Inter'; ctx.fillStyle = P.cream; ctx.textBaseline = 'middle';
      const tick = '▼ −4.4 %   ▼ −3.1 %   ▼ −5.2 %   ▼ −2.7 %   ';
      const off = (t * 70) % 420; ctx.fillText(tick + tick, L.x - L.w / 2 - off, L.y - 35);
      ctx.restore();
    }
    ctx.strokeStyle = rgba(P.blue0, .5); ctx.lineWidth = 2; ctx.stroke(lsr);
    // second phone, lying askew: red chart bubbles on "group chat"
    const ch = clamp(st.chat ?? 0);
    PR.phone(ctx, t, PHONE2.x, PHONE2.y, PHONE2.h, { tilt: PHONE2.tilt, buzz: ch > 0 && ch < 1 ? .5 : 0, screen: (cx, r) => {
      if (ch <= 0) { cx.fillStyle = mixHex(P.night0, P.ind1, .5); cx.fillRect(r.x, r.y, r.w, r.h); return; }
      cx.fillStyle = mixHex(P.ind1, F.RED.ink, .25 * ch); cx.fillRect(r.x, r.y, r.w, r.h);
      for (let k = 0; k < 3; k++) { const u = clamp(ch * 3 - k); if (u <= 0) continue; const bx = r.x + r.w * (k % 2 ? .3 : .08), by = r.y + r.h * (.14 + k * .27); cx.globalAlpha = u; cx.fillStyle = mixHex(P.blue1, P.ind2, .3); cx.beginPath(); cx.roundRect(bx, by, r.w * .62, r.h * .2, 8); cx.fill(); cx.strokeStyle = F.RED.line; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(bx + 8, by + 10); cx.lineTo(bx + r.w * .3, by + r.h * .1); cx.lineTo(bx + r.w * .55, by + r.h * .17); cx.stroke(); cx.globalAlpha = 1; }
    } });
    // your phone
    drawYourPhone(ctx, t, st);
    // the lamp's warm pool reaches the phone (the hero stays the lamp)
    halo(ctx, lamp[0], lamp[1] + 40, 120, .25 * (.9 + .1 * Math.sin(t * 2.3)));
  });
}
// the arrows on the lock screen (on "phone"), the warm glow (just after the flood), or a content callback (the explainer inside)
export function drawYourPhone(ctx, t, st) {
  const face = st.face ?? 1, lock = clamp(st.lock ?? 0), glow = clamp(st.glow ?? 0);
  return PR.phone(ctx, t, PHONE.x, PHONE.y, PHONE.h, { face, buzz: st.buzz ?? 0, screen: (cx, r) => {
    cx.fillStyle = lin(cx, 0, r.y, 0, r.y + r.h, [[0, P.night0], [.6, P.night1], [1, mixHex(P.ind0, P.blue1, .2)]]); cx.fillRect(r.x, r.y, r.w, r.h);
    if (st.content) st.content(cx, r);
    if (lock > 0) {
      cx.fillStyle = rgba(F.RED.ink, .5 * lock * (st.redDim ?? 1)); cx.fillRect(r.x, r.y, r.w, r.h);
      cx.globalAlpha = lock * (st.redDim ?? 1);
      for (let k = 0; k < 4; k++) { const u = clamp(lock * 4 - k), yy = r.y + r.h * (.2 + k * .17); if (u <= 0) continue; cx.fillStyle = mixHex(P.ind1, P.blue1, .5); cx.beginPath(); cx.roundRect(r.x + r.w * .08, yy, r.w * .84, r.h * .12, 6); cx.fill(); cx.fillStyle = F.RED.line; cx.font = `600 ${Math.round(r.w * .13)}px Inter`; cx.textBaseline = 'middle'; cx.fillText(`▼ −${(2 + k * 1.3).toFixed(1)} %`, r.x + r.w * .14, yy + r.h * .06); }
      cx.globalAlpha = 1;
    }
    if (glow > 0) { cx.globalAlpha = glow; cx.fillStyle = rad(cx, r.x + r.w * .5, r.y + r.h * .42, Math.max(r.w, r.h) * .75, [[0, mixHex(P.halo0, P.core1, .35)], [.55, mixHex(P.halo1, P.shade0, .25)], [1, mixHex(P.shade0, P.ind1, .35)]]); cx.fillRect(r.x, r.y, r.w, r.h); cx.globalAlpha = 1; }
  } });
}

// the content space of your phone: frame coordinates when the camera is pushed into the screen (cDeep). Draw the explainers there and
// they ride on the phone when the camera pulls back.
export function phoneDeep() { const r = phoneScreenRect(); const s = W / r.w * 1.0; return { x: r.x + r.w / 2, y: PHONE.y, s }; }
export function inPhone(ctx, c, fn) {
  const D = phoneDeep();
  withCam(ctx, c, () => { ctx.translate(D.x, D.y); ctx.scale(1 / D.s, 1 / D.s); ctx.translate(-W / 2, -H / 2); fn(); });
}

// the clip window "warms up": a dark veil inside the window that lifts over 1 s after the window has opened from its rect (and falls
// again before it closes), so the footage arrives gradually (no lurch). r = the rect clipWindow returned.
// F.clipWindow + clipVeil; while the window is small (open < .34) it is laid over its source by `open` instead of popping on/off
let CLAYER = null;
export function clipWin(ctx, t, T, id, rect, o = {}) {
  const c = T.clip(id); if (!c) return null;
  const open = smooth(span(t, c.start - .6, c.start)) * (1 - smooth(span(t, c.end, c.end + .6))); if (open <= 0) return null;
  const k = smooth(clamp(open / .34));
  if (k >= 1) { const r = F.clipWindow(ctx, t, T, id, rect, o); clipVeil(ctx, t, T, id, r); return r; }
  const cv = ctx.canvas; if (!CLAYER || CLAYER.width !== cv.width || CLAYER.height !== cv.height) CLAYER = createCanvas(cv.width, cv.height);
  const lx = CLAYER.getContext('2d'); lx.setTransform(1, 0, 0, 1, 0, 0); lx.clearRect(0, 0, CLAYER.width, CLAYER.height); lx.setTransform(ctx.getTransform());
  const r = F.clipWindow(lx, t, T, id, rect, o); clipVeil(lx, t, T, id, r);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= k; ctx.drawImage(CLAYER, 0, 0); ctx.restore();
  return r;
}
export function clipVeil(ctx, t, T, id, r) {
  const c = T.clip(id); if (!c || !r) return;
  const v = clamp(1 - smooth(span(t, c.start - .5, c.start + .6)) + smooth(span(t, c.end - .6, c.end + .5)));
  if (v <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = v;
  const p = new Path2D(); p.roundRect(r.x, r.y, r.w, r.h, 10); ctx.clip(p);
  ctx.fillStyle = rad(ctx, r.x + r.w / 2, r.y + r.h * .3, r.w * .7, [[0, mixHex(P.blue1, P.ind1, .3)], [1, P.night0]]); ctx.fillRect(r.x, r.y, r.w, r.h);
  ctx.restore();
}
