// Film 28 · builder B1 (c02–c06) · small shared helpers for the B1 chunks (owned by B1; nobody else imports it).
// Cameras, world ↔ screen, boundary rides (inner chunk seams are one continuous take: both sides ride the SAME creep line),
// a portal (an inner world seen through a window, then the window becomes the screen), and a few small drawn things.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f28_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, halo, lin, rad, prng } = E;
const TAU = Math.PI * 2;

// magnification of card Z (1 at home) and the c01 drift: the drift shrinks while diving, so dives stay steady
export const zs = (c, Z) => Z / Math.max(1, Z - c.z);
export const drifted = (c, Z, t, amt = 1) => E.camDrift(c, t, 2.6 * amt / Math.max(1, zs(c, Z)), 3);
// world (X, Y relative to the axis, depth Z) ↔ design px on card Z
export const toDesign = (X, Y, Z) => [X * E.F0 / Z + W / 2, Y * E.F0 / Z + H / 2];
export const toWorld = (u, v, Z) => [(u - W / 2) * Z / E.F0, (v - H / 2) * Z / E.F0];
// world point → screen [x, y, pxPerWorldUnit]
export const P3 = (c, X, Y, Z) => { const [u, v] = toDesign(X, Y, Z), p = E.project(c, Z, u, v); return p ? [p[0], p[1], p[2] * E.F0 / Z] : null; };
// mix two cameras (x, y linear, z in log distance to the card Zr)
export function mixCam(a, b, u, Zr = E.F0) {
  u = clamp(u); if (u <= 0) return a; if (u >= 1) return b;
  const da = Math.max(1, Zr - a.z), db = Math.max(1, Zr - b.z);
  return E.cam3({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), z: Zr - Math.exp(lerp(Math.log(da), Math.log(db), u)), f: lerp(a.f ?? E.F0, b.f ?? E.F0, u) });
}
// an inner boundary ride: from t0 the camera creeps (push 3 %/s, truck 12 design px/s) from aim(Z, u, v, s). Both chunks call it.
export const RIDE = { push: .03, truck: 12 };
export const ride = (Z, u, v, s, t0, sx, sy) => (t) => E.aim(Z, u + RIDE.truck * (t - t0), v, s * (1 + RIDE.push * (t - t0)), sx, sy);

// a portal: an inner world (drawn in its own 1920×1080 design space with its own cards) seen through the screen rect r = { x, y, w, h }
// (16:9). fn(ctx) draws the inner world; everything inside is mapped by E.withOuter, so inner cards stay glued to the window.
export function portal(ctx, r, fn, o = {}) {
  const k = r.w / W;
  ctx.save(); ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip();
  E.withOuter({ k, e: r.x, f: r.y }, () => fn(ctx));
  ctx.restore();
  if (o.frame) { ctx.save(); ctx.strokeStyle = o.frame; ctx.lineWidth = o.fw ?? 3; ctx.strokeRect(r.x, r.y, r.w, r.h); ctx.restore(); }
}
// fill the whole visible area of the current card (screen rect inverted through the current transform) with a style
export function fillView(ctx, style) {
  const m = ctx.getTransform(), inv = m.inverse(), p0 = inv.transformPoint({ x: -40, y: -40 }), p1 = inv.transformPoint({ x: W + 40, y: H + 40 });
  ctx.fillStyle = style; ctx.fillRect(Math.min(p0.x, p1.x), Math.min(p0.y, p1.y), Math.abs(p1.x - p0.x), Math.abs(p1.y - p0.y));
}

// a cool voice: the machine talking (a cool firefly with a quick small wave); amp/speed say how chatty it is
export function coolVoice(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || s < .5) return;
  const ph = o.ph ?? 0, amp = (o.amp ?? .2) * s, sp = o.speed ?? 9, fl = .85 + .15 * Math.sin(t * 6.1 + ph * 3);
  halo(ctx, x, y, s * 1.5, .3 * a * fl, F.COOL.halo, F.COOL.body);
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = mixHex(F.COOL.body, P.cream, .4); ctx.lineWidth = Math.max(.8, s * (o.lw ?? .06)); ctx.lineCap = 'round'; ctx.beginPath();
  const n = o.n ?? 26, len = o.len ?? s;
  for (let i = 0; i <= n; i++) { const u = i / n, env = Math.sin(Math.PI * u) ** .7; const yy = y + Math.sin(u * TAU * (o.cyc ?? 2.5) + t * sp + ph) * amp * env * (.6 + .4 * Math.sin(t * 2.3 + u * 5 + ph)); i ? ctx.lineTo(x - len / 2 + u * len, yy) : ctx.moveTo(x - len / 2, yy); }
  ctx.stroke(); ctx.restore();
}
// a ring of warm voices round (x, y): n voices on an ellipse rx × ry, grown by u (staggered); s = voice size; spin speed
export function voiceRing(ctx, t, x, y, rx, ry, u, o = {}) {
  const n = o.n ?? 14, s = o.s ?? 30;
  for (let k = 0; k < n; k++) {
    const e = expoOut(span(u, k / n * .6, k / n * .6 + .4)); if (e <= 0) continue;
    const a = t * (o.spin ?? .35) + k / n * TAU, w = .9 + .08 * Math.sin(t * 1.3 + k);
    F.voiceWave(ctx, t, x + Math.cos(a) * rx * w, y + Math.sin(a) * ry * w, s * e * (o.sz ? o.sz(k) : 1), { a: e * (o.a ?? 1), ph: k });
  }
}
// a flat eagle silhouette (indigo body, warm rim if lit), wingspan s, flapping phase ph (0 = glide), heading dir ±1, bank (rad)
export function eagle(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || s < 1) return;
  const d = o.dir ?? 1, flap = o.flap ?? 0, w = Math.sin(o.ph ?? t * 5) * flap;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(o.bank ?? 0); ctx.scale(d * s / 100, s / 100);
  const col = o.col ?? mixHex(P.night1, P.ind1, .6), tip = -10 - 22 * w, mid = -4 - 10 * w;
  if (o.glow) halo(ctx, 0, 0, 90, .35 * o.glow, P.halo0, P.core1);
  const p = new Path2D();
  p.moveTo(30, -2); p.quadraticCurveTo(38, -6, 42, -2); p.lineTo(36, 2);                       // head + beak
  p.quadraticCurveTo(20, 6, 6, 6);                                                              // belly
  p.lineTo(-22, 9); p.lineTo(-34, 4); p.lineTo(-24, 1);                                          // tail
  p.quadraticCurveTo(-14, 0, -8, -1);
  p.quadraticCurveTo(-22, mid - 6, -50, tip);                                                    // far wing back edge (fingers)
  p.lineTo(-44, tip + 4); p.lineTo(-48, tip + 7); p.lineTo(-40, tip + 8);
  p.quadraticCurveTo(-16, mid + 4, 6, -4);
  p.quadraticCurveTo(14, mid - 10, 30, -2); p.closePath();
  ctx.fillStyle = col; ctx.fill(p);
  if (o.rim) { ctx.strokeStyle = rgba(o.rim, .8); ctx.lineWidth = 1.4 * 100 / s; ctx.stroke(p); }
  ctx.restore();
}
// a wind turbine (tower + nacelle + three blades) at (x, y) = tower foot, height h, blade angle ang; o { col, a, rim }
export function turbine(ctx, x, y, h, ang, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const col = o.col ?? mixHex(P.night1, P.ind1, .55), hub = [x, y - h], L = h * .52;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col;
  ctx.beginPath(); ctx.moveTo(x - h * .028, y); ctx.lineTo(x - h * .012, y - h); ctx.lineTo(x + h * .012, y - h); ctx.lineTo(x + h * .028, y); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.ellipse(hub[0] + h * .02, hub[1], h * .045, h * .022, 0, 0, TAU); ctx.fill();
  for (let k = 0; k < 3; k++) {
    const b = ang + k * TAU / 3, c = Math.cos(b), s = Math.sin(b);
    ctx.beginPath(); ctx.moveTo(hub[0] + -s * h * .012, hub[1] + c * h * .012);
    ctx.quadraticCurveTo(hub[0] + c * L * .4 - s * h * .03, hub[1] + s * L * .4 + c * h * .03, hub[0] + c * L, hub[1] + s * L);
    ctx.quadraticCurveTo(hub[0] + c * L * .5 + s * h * .008, hub[1] + s * L * .5 - c * h * .008, hub[0] + s * h * .012, hub[1] - c * h * .012); ctx.closePath(); ctx.fill();
  }
  ctx.beginPath(); ctx.arc(hub[0], hub[1], h * .018, 0, TAU); ctx.fill();
  if (o.lamp) { halo(ctx, hub[0], hub[1] - h * .03, h * .08, .5 * o.lamp, '#c0503c', '#ff9c7a'); }
  ctx.restore();
}
// an old armchair (wingback) seen from the front-side: (x, y) = floor centre, h = height; o { col, rim, a }
export function armchair(ctx, x, y, h, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const s = h / 100, col = o.col ?? mixHex(P.night1, P.ind1, .55), lit = o.lit ?? mixHex(col, P.shade0, .45);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.roundRect(-40, -100, 80, 70, [22, 22, 6, 6]); ctx.fill();                        // back
  ctx.beginPath(); ctx.roundRect(-52, -72, 22, 52, [10, 10, 4, 4]); ctx.fill();                         // wings / arms
  ctx.beginPath(); ctx.roundRect(30, -72, 22, 52, [10, 10, 4, 4]); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, -38, 0, -18, [[0, lit], [1, col]]); ctx.beginPath(); ctx.roundRect(-34, -40, 68, 22, 6); ctx.fill();   // seat cushion (lamp light on it)
  ctx.fillStyle = mixHex(col, P.night0, .4); ctx.fillRect(-46, -20, 92, 10);
  ctx.fillStyle = P.night0; ctx.fillRect(-44, -10, 7, 10); ctx.fillRect(37, -10, 7, 10);              // feet
  if (o.rim) { ctx.strokeStyle = rgba(o.rim, .55); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(40, -96); ctx.quadraticCurveTo(42, -70, 40, -40); ctx.moveTo(52, -66); ctx.lineTo(52, -22); ctx.stroke(); }
  ctx.restore();
}
// a floor lamp: foot at (x, y), height h, light 0..1 (warm cone + halo), o.a
export function floorLamp(ctx, t, x, y, h, light = 1, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  const top = y - h, sh = h * .16;
  if (light > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(ctx, 0, top, 0, y, [[0, rgba(P.halo1, .22 * light)], [1, rgba(P.halo1, 0)]]);
    ctx.beginPath(); ctx.moveTo(x - sh * .45, top + sh); ctx.lineTo(x + sh * .45, top + sh); ctx.lineTo(x + h * .55, y); ctx.lineTo(x - h * .55, y); ctx.closePath(); ctx.fill(); ctx.restore();
    halo(ctx, x, top + sh * .8, h * .55 * (1 + .02 * Math.sin(t * 1.7)), .55 * light, P.halo0, P.core1);
    F.pool(ctx, x, y, h * .6, h * .07, .9 * light);
  }
  ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.fillRect(x - 2.5, top + sh, 5, h - sh); ctx.beginPath(); ctx.ellipse(x, y, h * .09, h * .018, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, top, 0, top + sh, [[0, mixHex(P.shade0, P.halo1, .4 * light)], [1, mixHex(P.shade0, P.core1, .6 * light)]]);
  ctx.beginPath(); ctx.moveTo(x - sh * .32, top); ctx.lineTo(x + sh * .32, top); ctx.lineTo(x + sh * .5, top + sh); ctx.lineTo(x - sh * .5, top + sh); ctx.closePath(); ctx.fill();
  ctx.restore();
}
// a cool envelope (the offer): centre (x, y), width s, open 0..1 (flap), o { a, tilt }
export function envelope(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || s < 1) return;
  const w = s, h = s * .62;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(o.tilt ?? 0);
  halo(ctx, 0, 0, s * 1.4, .3 * (o.glow ?? 1), F.COOL.halo, F.COOL.body);
  ctx.fillStyle = lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, mixHex(F.COOL.body, P.cream, .55)], [.5, F.COOL.body], [1, mixHex(F.COOL.deep, F.COOL.body, .5)]]);
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, s * .04); ctx.fill();
  ctx.strokeStyle = rgba(F.COOL.deep, .75); ctx.lineWidth = Math.max(1, s * .03); ctx.beginPath(); ctx.moveTo(-w / 2 + s * .03, -h / 2 + s * .03); ctx.lineTo(0, h * .08); ctx.lineTo(w / 2 - s * .03, -h / 2 + s * .03); ctx.stroke();
  ctx.fillStyle = rgba(P.cream, .5); ctx.fillRect(-w * .38, -h * .44, w * .2, h * .05);   // gloss
  ctx.restore();
}
