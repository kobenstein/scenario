// Film 10 · builder B2 (c04–c07): shared helpers on top of the editorial kit (lib/f10_editorial.mjs, never changed here).
//   run(stages)          one draw(ctx, t) for a chunk: stages [[t0, fn(ctx, t)]], the last stage that started owns the frame
//   wipe / writeOn       text that rises from its baseline (mask) or is written left → right by a spark (never fades in)
//   iris                 a dark dish behind a graphic so light on night stays readable over the world
//   mark(...)            extra icons of light (broom, basket, bag, box, clock, bank, data centre, phone, drawer, vine robot …)
//   rings3               rings in 3D seen at a tilt (bowl on the wheel → top view → dome of the planet)
//   floodK               how much a light card fills the screen → lightFlood amount
// Everything is a pure function of t; nothing creates canvases or patterns per frame.
import { Path2D, PathOp } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
const { W, H, P, clamp, lerp, span, smooth, expoOut, rgba, mixHex, lin, rad } = E;

export const COOLC = mixHex(P.blue2, P.cream, .35);
export const ease = { s: E.sineIO, q: E.quartIO, o: expoOut, i: E.expoIn, sm: smooth };
// rise a→b and fall c→d (0..1), smooth
export const env = (t, a, b, c = 1e9, d = 1e9) => smooth(span(t, a, b)) * (1 - smooth(span(t, c, d)));

// ---------- the chunk timeline ----------
export function run(stages) {
  const S = stages.slice().sort((p, q) => p[0] - q[0]);
  return (ctx, t) => {
    let st = S[0]; for (const s of S) if (t >= s[0] - 1e-9) st = s;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none';
    ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H);
    st[1](ctx, t); ctx.restore();
  };
}

// ---------- type ----------
// text rising out of its baseline (mask): u 0..1. o as glowText + o.size
export function wipe(ctx, s, x, y, u, o = {}) {
  if (u <= 0) return; const size = o.size ?? E.TYPE.label, k = expoOut(u);
  ctx.save(); ctx.beginPath(); ctx.rect(-1e4, y - size * 1.25 - 40, 2e4, size * 1.25 + 40 + size * (o.desc ?? .1)); ctx.clip();
  E.glowText(ctx, s, x, y + (1 - k) * size * 1.3, o); ctx.restore();
}
// text written left → right by a small spark (the trace writes it). u 0..1
export function writeOn(ctx, s, x, y, u, o = {}) {
  if (u <= 0) return; const size = o.size ?? E.TYPE.label;
  ctx.save(); ctx.font = o.serif ? `${size}px "Instrument Serif"` : `${o.weight ?? 600} ${size}px Inter`; if (o.spacing) ctx.letterSpacing = `${o.spacing}em`;
  const w = ctx.measureText(s).width; ctx.restore();
  const x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x, xh = x0 + w * clamp(u);
  ctx.save(); ctx.beginPath(); ctx.rect(x0 - 40, y - size * 1.3, xh - x0 + 40, size * 1.8); ctx.clip(); E.glowText(ctx, s, x, y, o); ctx.restore();
  if (u < 1 && o.spark !== false) E.halo(ctx, xh, y - size * .32, size * .9, .7);
  return w;
}
export function textW(s, size, o = {}) { return measure(s, size, o); }
function measure(s, size, o) { const c = MEAS.ctx; c.font = o.serif ? `${size}px "Instrument Serif"` : `${o.weight ?? 600} ${size}px Inter`; c.letterSpacing = o.spacing ? `${o.spacing}em` : '0px'; return c.measureText(s).width; }
import { createCanvas } from '@napi-rs/canvas';
const MEAS = { ctx: createCanvas(8, 8).getContext('2d') };   // one tiny canvas, made once

// ---------- a dark dish that lifts a graphic off the world ----------
export function iris(ctx, x, y, r, a = 1, rx = 1) {
  if (a <= 0 || r <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(rx, 1);
  ctx.fillStyle = rad(ctx, 0, 0, r, [[0, rgba(P.night0, .82 * a)], [.55, rgba(P.night0, .62 * a)], [1, rgba(P.night0, 0)]]);
  ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.29); ctx.fill(); ctx.restore();
}

// ---------- extra icons of light (unit size: height ≈ 1, centred) ----------
const MK = new Map();
const U = (a, b) => a.op(b, PathOp.Union), D = (a, b) => a.op(b, PathOp.Difference);
const stroke = (pts, w, close = false) => { const p = new Path2D(); p.moveTo(...pts[0]); for (const q of pts.slice(1)) p.lineTo(...q); if (close) p.closePath(); return p.stroke({ width: w, cap: 1, join: 1 }); };
export function markPath(name) {
  if (MK.has(name)) return MK.get(name);
  let p = new Path2D();
  switch (name) {
    case 'broom': { p = stroke([[.18, -.5], [-.04, .12]], .07); const b = new Path2D(); b.moveTo(-.1, .08); b.lineTo(.04, .14); b.lineTo(-.06, .5); b.lineTo(-.34, .38); b.closePath(); p = U(p, b); break; }
    case 'basket': { p.moveTo(-.42, -.05); p.lineTo(.42, -.05); p.lineTo(.32, .42); p.lineTo(-.32, .42); p.closePath(); const c = new Path2D(); c.moveTo(-.36, -.05); c.bezierCurveTo(-.3, -.32, -.1, -.2, 0, -.3); c.bezierCurveTo(.1, -.4, .3, -.22, .36, -.05); c.closePath(); p = U(p, c);
      for (const y of [.1, .25]) p = D(p, stroke([[-.3, y], [.3, y]], .035)); break; }
    case 'bag': { p.moveTo(-.34, -.18); p.lineTo(.34, -.18); p.lineTo(.38, .46); p.lineTo(-.38, .46); p.closePath(); const hd = new Path2D(); hd.arc(0, -.18, .17, Math.PI, 0); p = U(p, hd.stroke({ width: .07, cap: 1, join: 1 })); break; }
    case 'box': { p.rect(-.42, -.28, .84, .72); p = D(p, stroke([[-.42, -.06], [.42, -.06]], .04)); p = D(p, stroke([[0, -.28], [0, -.06]], .06)); break; }
    case 'boxup': { p.rect(-.34, -.06, .68, .52); p = D(p, stroke([[-.34, .12], [.34, .12]], .035)); p = U(p, stroke([[0, -.18], [0, -.48]], .07)); p = U(p, stroke([[-.13, -.36], [0, -.5], [.13, -.36]], .07)); break; }
    case 'bank': { p.moveTo(-.5, -.18); p.lineTo(0, -.48); p.lineTo(.5, -.18); p.closePath(); const base = new Path2D(); base.rect(-.5, .38, 1, .1); p = U(p, base); const ar = new Path2D(); ar.rect(-.46, -.16, .92, .07); p = U(p, ar);
      for (const x of [-.36, -.12, .12, .36]) { const c = new Path2D(); c.rect(x - .055, -.06, .11, .42); p = U(p, c); } break; }
    case 'datacenter': { for (const y of [-.42, -.12, .18]) { const r = new Path2D(); r.roundRect(-.4, y, .8, .24, .03); p = U(p, r); p = D(p, stroke([[-.3, y + .12], [.05, y + .12]], .045)); const d = new Path2D(); d.arc(.24, y + .12, .04, 0, 6.29); p = D(p, d); } break; }
    case 'bolt': { p.moveTo(.08, -.5); p.lineTo(-.26, .06); p.lineTo(-.02, .06); p.lineTo(-.1, .5); p.lineTo(.26, -.08); p.lineTo(.02, -.08); p.closePath(); break; }
    case 'wave': { for (const r of [.16, .32, .48]) { const a = new Path2D(); a.arc(-.3, 0, r, -.75, .75); p = U(p, a.stroke({ width: .06, cap: 1, join: 1 })); } const d = new Path2D(); d.arc(-.3, 0, .06, 0, 6.29); p = U(p, d); break; }
    case 'cloud': { for (const [x, y, r] of [[-.22, .08, .2], [.02, -.06, .26], [.26, .1, .18]]) { const c = new Path2D(); c.arc(x, y, r, 0, 6.29); p = U(p, c); } const b = new Path2D(); b.rect(-.4, .08, .8, .2); p = U(p, b); break; }
    case 'phone': { p.roundRect(-.22, -.46, .44, .92, .08); const s = new Path2D(); s.roundRect(-.17, -.38, .34, .7, .03); p = D(p, s); break; }
    case 'bed': { p.rect(-.5, .02, 1, .2); const hb = new Path2D(); hb.rect(-.5, -.3, .08, .64); p = U(p, hb); const leg = new Path2D(); leg.rect(.42, .2, .08, .14); p = U(p, leg);
      const sh = new Path2D(); sh.moveTo(-.3, .02); sh.bezierCurveTo(-.2, -.14, 0, -.04, .1, -.12); sh.bezierCurveTo(.25, -.2, .38, -.04, .46, .02); sh.closePath(); p = U(p, sh); const pil = new Path2D(); pil.ellipse(-.33, -.04, .08, .05, 0, 0, 6.29); p = U(p, pil); break; }
    case 'fridge': { p.roundRect(-.26, -.5, .52, 1, .05); p = D(p, stroke([[-.26, -.12], [.26, -.12]], .03)); const dr = new Path2D(); dr.moveTo(.26, -.5); dr.lineTo(.56, -.42); dr.lineTo(.56, .42); dr.lineTo(.26, .5); dr.closePath(); p = U(p, dr); break; }
    case 'door': { p.rect(-.3, -.5, .6, 1); const o = new Path2D(); o.rect(-.22, -.42, .44, .92); p = D(p, o); break; }
    case 'bulb': { p.arc(0, -.08, .3, 0, 6.29); const b = new Path2D(); b.rect(-.12, .16, .24, .26); p = U(p, b); break; }
    case 'hole': { p.ellipse(0, 0, .5, .16, 0, 0, 6.29); break; }
    case 'pickaxe': { const a = new Path2D(); a.moveTo(-.45, -.1); a.quadraticCurveTo(0, -.45, .45, -.1); p = a.stroke({ width: .1, cap: 1, join: 1 }); p = U(p, stroke([[0, -.27], [0, .5]], .09)); break; }
    case 'vinebot': { p.moveTo(-.48, .3); p.lineTo(-.4, -.32); p.lineTo(.4, -.32); p.lineTo(.48, .3); p.lineTo(.34, .3); p.lineTo(.27, -.18); p.lineTo(-.27, -.18); p.lineTo(-.34, .3); p.closePath();
      for (const x of [-.41, .41]) { const w = new Path2D(); w.arc(x, .36, .1, 0, 6.29); p = U(p, w); } const m = new Path2D(); m.roundRect(-.18, -.46, .36, .16, .03); p = U(p, m); break; }
    case 'tractor': { const b = new Path2D(); b.roundRect(-.4, -.08, .62, .24, .04); p = U(p, b); const cab = new Path2D(); cab.rect(-.2, -.4, .3, .34); p = U(p, cab); const w1 = new Path2D(); w1.arc(-.24, .22, .22, 0, 6.29); p = U(p, w1); const w2 = new Path2D(); w2.arc(.26, .28, .14, 0, 6.29); p = U(p, w2); break; }
    case 'headset': { p.arc(0, -.36, .13, 0, Math.PI * 2); const b = new Path2D(); b.moveTo(-.12, -.2); b.bezierCurveTo(-.22, -.18, -.26, 0, -.3, .46); b.lineTo(.3, .46); b.bezierCurveTo(.26, 0, .22, -.18, .12, -.2); b.closePath(); p = U(p, b);
      const hs = new Path2D(); hs.arc(0, -.36, .19, Math.PI * 1.08, Math.PI * 1.92); p = U(p, hs.stroke({ width: .04, cap: 1, join: 1 })); const ear = new Path2D(); ear.ellipse(.17, -.33, .05, .07, 0, 0, 6.29); p = U(p, ear); break; }
    case 'car': { p.roundRect(-.5, -.02, 1, .26, .07); const cab = new Path2D(); cab.moveTo(-.3, -.02); cab.lineTo(-.18, -.24); cab.lineTo(.2, -.24); cab.lineTo(.34, -.02); cab.closePath(); p = U(p, cab);
      const wnd = new Path2D(); wnd.moveTo(-.2, -.05); wnd.lineTo(-.12, -.19); wnd.lineTo(.15, -.19); wnd.lineTo(.24, -.05); wnd.closePath(); p = D(p, wnd); for (const x of [-.28, .28]) { const w = new Path2D(); w.arc(x, .26, .12, 0, 6.29); p = U(p, w); } break; }
    case 'question': { const a = new Path2D(); a.arc(0, -.2, .2, Math.PI * 1.05, Math.PI * .45); a.lineTo(0, .12); p = a.stroke({ width: .09, cap: 1, join: 1 }); const d = new Path2D(); d.arc(0, .36, .065, 0, 6.29); p = U(p, d); break; }
    default: p.arc(0, 0, .45, 0, 6.29);
  }
  MK.set(name, p); return p;
}
const KIT_ICONS = new Set(E.ICONS);
// one mark of light. o { lit, a, u (grow 0..1 from the centre, expoOut), dust, glow, rot }
export function mark(ctx, name, x, y, size, t, o = {}) {
  const g = o.u == null ? 1 : expoOut(o.u); if (g <= .002 || (o.a ?? 1) <= 0) return null;
  const s = size * g;
  if (KIT_ICONS.has(name) && !o.rot) { const q = { ...o }; delete q.u; return E.icon(ctx, name, x, y, s, t, { dust: 0, ...q }); }
  const c = Math.cos(o.rot || 0) * s, sn = Math.sin(o.rot || 0) * s;
  const p = new Path2D(); p.addPath(markPath(name), { a: c, b: sn, c: -sn, d: c, e: x, f: y });
  E.lightShape(ctx, p, t, { dust: 0, ...o }); return p;
}
// a person icon of light that can bend under a load (b 0..1) and lift both arms (arms 0..1)
export function figMark(ctx, x, y, s, t, o = {}) {
  const b = o.bend ?? 0, ar = o.arms ?? 0, d = o.dir ?? 1;
  let p = new Path2D(); const hx = .1 * b * d, hy = -.64 + .16 * b;
  p.arc(hx * s, hy * s, .11 * s, 0, 6.29);
  const body = new Path2D(); body.moveTo((-.13 + .06 * b * d) * s, (-.47 + .12 * b) * s); body.bezierCurveTo(-.24 * s, (-.4 + .1 * b) * s, -.26 * s, -.1 * s, -.28 * s, .46 * s);
  body.lineTo(.28 * s, .46 * s); body.bezierCurveTo(.26 * s, -.1 * s, .24 * s, (-.4 + .1 * b) * s, (.13 + .06 * b * d) * s, (-.47 + .12 * b) * s); body.closePath(); p = U(p, body);
  if (ar > 0) for (const sd of [-1, 1]) { const sh = [sd * .16 * s, (-.36 + .1 * b) * s], hd = [sd * lerp(.32, .4, ar) * s, lerp(-.0, -.8, ar) * s + .16 * b * s]; p = U(p, stroke([sh, hd], .09 * s)); }
  { const lg = new Path2D(); lg.moveTo(-.035 * s, .47 * s); lg.lineTo(0, .12 * s); lg.lineTo(.035 * s, .47 * s); lg.closePath(); p = D(p, lg); }
  const q = new Path2D(); q.addPath(p, { a: 1, b: 0, c: 0, d: 1, e: x, f: y - .46 * s });   // (x, y) = feet
  E.lightShape(ctx, q, t, { dust: 0, ...o }); return q;
}
// a robot icon of light (feet at x,y, height s) whose arms lift (arms 0 down … 1 straight up); returns both hand points
export function botMark(ctx, x, y, s, t, o = {}) {
  const ar = o.arms ?? 0, k = (u, v) => [x + u * s, y + v * s];
  let p = new Path2D(); p.ellipse(x, y - .9 * s, .085 * s, .08 * s, 0, 0, 6.29);
  const ch = new Path2D(); ch.moveTo(...k(-.07, -.8)); ch.bezierCurveTo(...k(-.2, -.8), ...k(-.22, -.74), ...k(-.2, -.66)); ch.lineTo(...k(-.12, -.46)); ch.lineTo(...k(.12, -.46)); ch.lineTo(...k(.2, -.66));
  ch.bezierCurveTo(...k(.22, -.74), ...k(.2, -.8), ...k(.07, -.8)); ch.closePath(); p = U(p, ch);
  const pel = new Path2D(); pel.roundRect(x - .12 * s, y - .48 * s, .24 * s, .1 * s, .03 * s); p = U(p, pel);
  for (const sd of [-1, 1]) {
    p = U(p, stroke([k(sd * .07, -.4), k(sd * .075, -.2), k(sd * .08, -.02)], .085 * s));
    const sh = [sd * .2, -.72], el = [sd * lerp(.26, .3, ar), lerp(-.5, -.92, ar)], hd = [sd * lerp(.26, .22, ar), lerp(-.3, -1.1, ar)];
    p = U(p, stroke([k(...sh), k(...el), k(...hd)], .07 * s));
  }
  E.lightShape(ctx, p, t, { lit: 0, dust: 0, ...o });
  return { R: k(lerp(.26, .22, ar), lerp(-.3, -1.1, ar)), L: k(-lerp(.26, .22, ar), lerp(-.3, -1.1, ar)), head: k(0, -.9) };
}

// ---------- the clock of light: ring, 12 ticks, two hands; returns centre ----------
export function clock(ctx, x, y, r, t, o = {}) {
  const a = o.a ?? 1, ring = new Path2D(); ring.arc(x, y, r, 0, 6.29);
  E.lightShape(ctx, ring.stroke({ width: r * .07, cap: 0, join: 1 }), t, { lit: o.lit ?? 1, a, dust: 0 });
  for (let i = 0; i < 12; i++) { const q = i / 12 * 6.283, r0 = r * (i % 3 ? .86 : .8); const tk = stroke([[x + Math.cos(q) * r0, y + Math.sin(q) * r0], [x + Math.cos(q) * r * .92, y + Math.sin(q) * r * .92]], r * (i % 3 ? .018 : .03)); ctx.fillStyle = rgba(P.halo0, .85 * a); ctx.fill(tk); }
  if (o.hands !== false) {
    const hm = o.min ?? t * .25, hh = o.hour ?? t * .02;
    for (const [ang, len, w] of [[hh, .5, .045], [hm, .74, .028]]) { const q = ang - Math.PI / 2; ctx.fillStyle = rgba(P.core1, a); ctx.fill(stroke([[x, y], [x + Math.cos(q) * r * len, y + Math.sin(q) * r * len]], r * w)); }
    E.halo(ctx, x, y, r * .08, .8 * a);
  }
}
// a wedge (pie slice) between angles a0..a1 (0 = 12 o'clock, clockwise), inner radius r0..r1
export function wedge(x, y, r0, r1, a0, a1) {
  const p = new Path2D(), q0 = a0 - Math.PI / 2, q1 = a1 - Math.PI / 2;
  p.arc(x, y, r1, q0, q1); p.arc(x, y, r0, q1, q0, true); p.closePath(); return p;
}

// ---------- 3D rings at a tilt (bowl → top view → dome) ----------
// rings [{r, z}] in model units; view { x, y (screen centre of the base), s (px per unit), tilt (0 side … π/2 top) }
export function ringEll(v, rg) { const st = Math.sin(v.tilt), ct = Math.cos(v.tilt); return { cx: v.x, cy: v.y - rg.z * ct * v.s, rx: rg.r * v.s, ry: Math.max(.5, rg.r * v.s * st) }; }

// ---------- flood helpers ----------
// how much of the screen a light of design size w (card Z, camera c) fills → flood amount
export function floodK(c, Z, w) { const m = E.cardM(c, Z); if (!m) return 1; return smooth(span(m.k * w / W, 1.1, 3.6)); }
// t-locked flood around a cut at tc (in: a rises to 1 at tc; out: falls from 1 at tc)
export const floodIn = (t, tc, d = .55) => smooth(span(t, tc - d, tc));
export const floodOut = (t, tc, d = .55) => 1 - smooth(span(t, tc, tc + d));

// ---------- world pieces ----------
export function sky(ctx, c, t, o = {}) {
  E.card(ctx, c, 40000, () => {
    E.nightSky(ctx, o.stops || [[0, P.night0], [.55, P.night1], [1, P.ind0]], -400, o.hor ?? H);
    if (o.glow !== false) { ctx.fillStyle = rad(ctx, o.gx ?? W * .6, o.gy ?? H * .55, o.gr ?? 1300, [[0, rgba(P.blue0, o.ga ?? .55)], [.5, rgba(P.blue0, (o.ga ?? .55) * .35)], [1, rgba(P.ind1, 0)]]); ctx.fillRect(-W * 2, -H * 2, W * 5, H * 5); }
    E.stars(ctx, o.seed ?? 7, o.n ?? 170, t, o.box || [-400, -300, W + 800, H * .85 + 300], o.sa ?? .85);
  });
}
// a plain house silhouette: x = left, y = ground, w × h body, roof; windows [{x,y,w,h,lit}] relative to body
export function house(ctx, x, y, w, h, o = {}) {
  const roof = o.roof ?? h * .62, p = new Path2D();
  p.moveTo(x - w * .06, y - h); p.lineTo(x + w * .5, y - h - roof); p.lineTo(x + w * 1.06, y - h); p.lineTo(x + w, y - h); p.lineTo(x + w, y); p.lineTo(x, y); p.lineTo(x, y - h); p.closePath();
  if (o.chimney) { const ch = new Path2D(); ch.rect(x + w * .72, y - h - roof * .9, w * .1, roof * .6); p.addPath(ch); }
  ctx.fillStyle = lin(ctx, x, 0, x + w, 0, o.stops || [[0, P.night1], [1, mixHex(P.ind0, P.blue0, .25)]]); ctx.fill(p);
  ctx.strokeStyle = o.rim || rgba(P.blue0, .9); ctx.lineWidth = o.rimW ?? 2.5; ctx.beginPath(); ctx.moveTo(x - w * .06, y - h); ctx.lineTo(x + w * .5, y - h - roof); ctx.lineTo(x + w * 1.06, y - h); ctx.stroke();
  return p;
}
export { E };
