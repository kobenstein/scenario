// Film 13 · builder B1 (c01 from 21.8 s, c02–c06): shared helpers and props, all built from the film's own things
// (the hourglass, its gold sand, the gold thread, the hand of light, the ring, you in yellow). Editorial-night look:
// light on night blue, no panels, no frames, no legends. Rules as in the kit: no canvas / pattern per frame, seeded randomness only.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './f13_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, card, cam3, F0, halo, glowFill, lin, rad, prng } = E;

export const COOL = mixHex(P.blue2, P.cream, .35);                 // the kit's cool (machine, not yet, cost)
export const ICE = mixHex(P.cream, P.blue0, .16);                  // the ring: cool cream
export const SCREEN = mixHex(P.cream, P.blue0, .3);                // phone / laptop light
export const rise = (x) => 1 - (1 - clamp(x)) ** 3;               // calm rise (cubic out)

// ---------- time ----------
// integral of smooth(span(t, t0, t1)) dt: a speed that ramps smoothly from 0 to 1 (for positions under a changing speed)
export function rampInt(t, t0, t1) { if (t <= t0) return 0; const D = t1 - t0, u = Math.min(1, (t - t0) / D); return D * (u ** 3 - u ** 4 / 2) + Math.max(0, t - t1); }
// a value that eases between keys: [[t, v], …] with sine in-out (numbers only)
export function keyed(t, K, e = sineIO) {
  if (t <= K[0][0]) return K[0][1]; if (t >= K[K.length - 1][0]) return K[K.length - 1][1];
  let i = 0; while (t > K[i + 1][0]) i++; return lerp(K[i][1], K[i + 1][1], e((t - K[i][0]) / (K[i + 1][0] - K[i][0])));
}

// ---------- camera ----------
// mix two cameras: x, y, f, roll linear, z in log distance to the reference card (a dolly that feels like constant speed)
export function camMix(a, b, w, ref = F0) {
  const out = cam3(); for (const k of ['x', 'y', 'f', 'roll']) out[k] = lerp(a[k] ?? out[k], b[k] ?? out[k], w);
  const da = Math.max(1, ref - (a.z || 0)), db = Math.max(1, ref - (b.z || 0)); out.z = ref - Math.exp(lerp(Math.log(da), Math.log(db), w)); return out;
}
// a push that keeps a design point (u,v) of card Z on a screen path: from where camera c shows it to (sx,sy) at magnification k1
export function pushTo(c, Z, u, v, k1, sx, sy, w) {
  const p = E.project(c, Z, u, v); if (!p) return c;
  const k = Math.exp(lerp(Math.log(p[2]), Math.log(k1), w));
  return E.aim(Z, u, v, k, lerp(p[0], sx, w), lerp(p[1], sy, w));
}

// ---------- the night: ONE sky for all of B1. Its camera is the camera the hook (sc01, approved) rests on after 1.06, with the same
// drift, and it draws exactly the hook's sky: so the street takes over from the hook without a seam, and every later hand-off
// between two images only has to match the carrier on top of it ----------
export const HOOKCAM = cam3({ z: -330, x: 74, y: 30 });
export const skyCam = (t) => E.camDrift(HOOKCAM, t, .8);
export function sky(ctx, c, t, cam) {   // cam: only while an image still shares the hook's camera (the street)
  card(ctx, cam ?? skyCam(t), 40000, () => {
    E.nightSky(ctx, [[0, P.night0], [.5, P.night1], [1, P.ind0]], -900, H);
    E.stars(ctx, 13, 190, t, [-300, -700, W + 600, H + 500], .85);
  });
}

// ---------- type: lines rise from an invisible baseline (u 0 → 1) and sink below it (u → 0) ----------
// o: { size (34), serif (false), col, align 'left'|'center'|'right', spacing (em, sans only), glow, weight }
export function textW(s, size, serif, spacing = 0, weight = 600) { return K.measure(s, size, serif, weight) + (serif ? 0 : spacing * size * s.length); }
export function line(ctx, s, x, y, u, o = {}) {
  if (u <= 0) return;
  const size = o.size ?? 34, serif = o.serif ?? false, sp = serif ? 0 : (o.spacing ?? .18), w = textW(s, size, serif, sp, o.weight);
  const x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x, k = expoOut(clamp(u)), dy = (1 - k) * size * 1.15;
  ctx.save(); ctx.beginPath(); ctx.rect(x0 - size, y - size * 1.3, w + size * 2, size * 1.3 + size * .34); ctx.clip();
  E.glowText(ctx, s, x0, y + dy, { size, serif, col: o.col ?? (serif ? P.cream : P.halo2), spacing: sp || undefined, glow: o.glow ?? serif, weight: o.weight, a: o.a });
  ctx.restore();
}
// in/out envelope for a text event: rises at a, sinks at b (sink is expo-in, staggered by k * .08 s)
export const inOut = (t, a, b, k = 0) => rise(span(t, a + k * .12, a + 1 + k * .12)) * (b == null ? 1 : 1 - expoIn(span(t, b + k * .08, b + .55 + k * .08)));
// number + label + source block (a graphic's text): at most one number, ≤ 6 words, plus source
export function caption(ctx, t, x, y, { num, label, src, a, b, align = 'left', numSize = 120, gap = 58 }) {
  let yy = y;
  if (num) { line(ctx, num, x, yy, inOut(t, a, b, 0), { size: numSize, serif: true, align }); yy += gap + 14; }
  if (label) { line(ctx, label, x, yy, inOut(t, a + .35, b, 1), { size: 56, align }); yy += 58; }   // phone-readable: 56 px (cap ≈ 40)
  if (src) line(ctx, src, x, yy, inOut(t, a + .7, b, 2), { size: 30, align, col: rgba(P.halo2, .85) });
}
// digits that roll in a slot (the scenario stamp idea): value v can be fractional while rolling; o { size, col, align }
export function rollDigits(ctx, v, x, y, o = {}) {
  const size = o.size ?? 120, dw = K.measure('0', size, true) * 1.02, n = o.n ?? 1, w = dw * n, x0 = o.align === 'center' ? x - w / 2 : x;
  ctx.save(); ctx.beginPath(); ctx.rect(x0 - 10, y - size * .95, w + 20, size * 1.12); ctx.clip();
  for (let i = 0; i < n; i++) {
    const place = 10 ** (n - 1 - i), dv = ((v / place) % 10 + 10) % 10, d0 = Math.floor(dv), f = dv - d0;
    for (const [d, off] of [[d0, -f], [(d0 + 1) % 10, 1 - f]]) E.glowText(ctx, String(d), x0 + i * dw, y + off * size * 1.05, { size, serif: true, col: o.col ?? P.cream });
  }
  ctx.restore();
}

// ---------- light fills (flight into a light: both sides of the hand-off draw a = 1) ----------
export function coolFill(ctx, a) {
  if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp(a);
  ctx.fillStyle = rad(ctx, W * .5, H * .42, W * .85, [[0, mixHex(SCREEN, P.cream, .35)], [.55, SCREEN], [1, mixHex(SCREEN, P.blue1, .55)]]); ctx.fillRect(0, 0, W, H); ctx.restore();
}

// ---------- the ring: the machine (cool cream). o { u (share of the circle drawn, from the top), a, pulse, w } ----------
export function ring(ctx, x, y, r, t, o = {}) {
  const u = clamp(o.u ?? 1), a = o.a ?? 1, w = o.w ?? r * .07; if (u <= 0) return;
  // (napi-rs: a full sweep that starts at -π/2 strokes to nothing, so a closed ring starts at 0)
  const p = new Path2D(); if (u >= 1) p.arc(x, y, r, 0, Math.PI * 2); else p.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + u * Math.PI * 2);
  const s = p.stroke({ width: w, cap: 1, join: 1 });
  glowFill(ctx, s, r * .5, .55 * a, P.blue0); glowFill(ctx, s, r * .12, .5 * a, P.blue1); glowFill(ctx, s, w * .8, .7 * a, ICE);
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = lin(ctx, x - r, y - r, x + r, y + r, [[0, P.cream], [.5, ICE], [1, mixHex(ICE, P.blue1, .35)]]); ctx.fill(s); ctx.restore();
  // thinking: faint rings pulse inwards
  if ((o.pulse ?? 1) > 0 && u >= 1) for (let k = 0; k < 3; k++) {
    const ph = ((t * .35 + k / 3) % 1), rr = r * (1 - .55 * ph);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(ICE, .3 * a * (o.pulse ?? 1) * Math.sin(ph * Math.PI)); ctx.lineWidth = w * .35;
    ctx.beginPath(); ctx.arc(x, y, rr, 0, 6.29); ctx.stroke(); ctx.restore();
  }
  if (u < 1) { const an = -Math.PI / 2 + u * Math.PI * 2; halo(ctx, x + Math.cos(an) * r, y + Math.sin(an) * r, w * 5, .8 * a, ICE, P.cream); }
}
// twelve month arcs round a ring; lit(i) 0..1 = how far month i is filled with gold
export function monthArcs(ctx, x, y, r, t, lit, o = {}) {
  const n = o.n ?? 12, gap = .07, w = o.w ?? 12;
  for (let i = 0; i < n; i++) {
    const a0 = -Math.PI / 2 + i / n * Math.PI * 2 + gap / 2, a1 = a0 + Math.PI * 2 / n - gap, k = clamp(lit(i));
    ctx.save(); ctx.strokeStyle = rgba(COOL, .28 * (o.a ?? 1)); ctx.lineWidth = w * .45; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke(); ctx.restore();
    if (k > 0) {
      const p = new Path2D(); p.arc(x, y, r, a0, lerp(a0, a1, k)); const s = p.stroke({ width: w, cap: 1, join: 1 });
      glowFill(ctx, s, w * 1.6, .55, P.halo1);
      ctx.save(); ctx.fillStyle = lin(ctx, x - r, y - r, x + r, y + r, [[0, P.core1], [1, P.halo0]]); ctx.fill(s); ctx.restore();
    }
  }
}

// ---------- gold bars of sand (time) and the sand that crumbles off them ----------
export function goldBar(ctx, x, y, w, h, t, o = {}) {
  if (w < 1) return;
  const p = new Path2D(); p.roundRect(x, y, w, h, Math.min(h * .5, w * .5, o.r ?? 10));
  if (o.cheap) {   // many bars: no blur passes
    ctx.save(); ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, P.core1], [.35, P.halo0], [1, P.halo1]]); ctx.globalAlpha = o.a ?? 1; ctx.fill(p); ctx.restore();
    glowFill(ctx, p, h * .6, .35 * (o.a ?? 1), P.halo1); return p;
  }
  E.lightShape(ctx, p, t, { lit: o.lit ?? 1, a: o.a ?? 1, dust: o.dust ?? 0, seed: o.seed ?? 3, cy: -.3, glow: o.glow ?? .5 });
  return p;
}
const GR = new Map();
function grains(seed, n) { const k = seed + ':' + n; if (!GR.has(k)) { const r = prng(seed), g = []; for (let i = 0; i < n; i++) g.push([r(), r(), r(), r()]); GR.set(k, g); } return GR.get(k); }
// sand that leaves a bar as its right end retreats: the region [xKeep, xFull] × [y, y+h]; edge(t) = current right end; each grain is
// released when the edge passes it, then falls (gravity) and thins out. o { seed, n, fall (px), dir (+1 right end retreats) }
export function crumble(ctx, x0, x1, y, h, tRel, edgeAt, o = {}) {
  const n = o.n ?? 220, fall = o.fall ?? 420, g = grains(o.seed ?? 5, n);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [u, v, r1, r2] of g) {
    const gx = lerp(x0, x1, u), gy = y + v * h, tr = edgeAt(gx); if (tr == null || tRel < tr) continue;
    const k = (tRel - tr) * (.9 + .5 * r1); if (k > 1.6) continue;
    const py = gy + fall * k * k * .8 + 10 * k, px = gx + (r2 - .5) * 40 * k + 18 * k;
    ctx.globalAlpha = (1 - k / 1.6) * (.6 + .4 * r2); ctx.fillStyle = r2 > .5 ? P.core1 : P.halo0;
    const s = 1.6 + r1 * 1.4; ctx.fillRect(px, py, s, s * (1 + 2 * Math.min(1, k)));
  }
  ctx.restore();
}

// ---------- a building of light windows (cached window grid). o { lit (0..1 share lit, in grid order), warm (share warm), rim } ----------
const BLD = new Map();
export function building(ctx, x, y, w, h, t, o = {}) {
  const key = `${x}|${y}|${w}|${h}|${o.seed ?? 1}`, cols = o.cols ?? Math.max(2, Math.round(w / 34)), rows = o.rows ?? Math.max(2, Math.round(h / 40));
  if (!BLD.has(key)) { const r = prng(o.seed ?? 1), wins = []; for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) wins.push([i, j, r(), r()]); BLD.set(key, wins); }
  ctx.fillStyle = lin(ctx, x, 0, x + w, 0, [[0, P.night1], [.6, P.ind2], [1, mixHex(P.ind2, P.blue1, .35)]]); ctx.fillRect(x, y, w, h);
  ctx.fillStyle = rgba(P.blue0, .8); ctx.fillRect(x + w - 2, y, 2, h); ctx.fillRect(x, y, w, 2);
  const mw = w / cols, mh = h / rows, ww = mw * (o.ww ?? .42), wh = mh * (o.wh ?? .5), lit = o.lit ?? .3;
  for (const [i, j, r1, r2] of BLD.get(key)) {
    const order = o.order === 'up' ? (rows - 1 - j + r1 * .9) / rows : r1;
    const on = clamp((lit - order) * 12); if (on <= 0) continue;
    const warm = r2 < (o.warm ?? 0), cx = x + (i + .5) * mw, cy = y + (j + .4) * mh;
    ctx.globalAlpha = on * (.55 + .45 * Math.sin(t * .3 + r2 * 9) ** 2 * (o.flicker ?? .3) + .25);
    ctx.fillStyle = warm ? P.halo1 : COOL; ctx.fillRect(cx - ww / 2, cy - wh / 2, ww, wh);
  }
  ctx.globalAlpha = 1;
  return { mw, mh, win: (i, j) => [x + (i + .5) * mw, y + (j + .4) * mh, ww, wh] };
}

// ---------- the washing machine of light (1.08 / 4.02): dark front, warm porthole (sand = laundry), cool rim ----------
// (cx, cy) = porthole centre, s = porthole radius. o { rise 0..1 (the body grows up from its foot), spin (rad), load 0..1, a }
export function washer(ctx, cx, cy, s, t, o = {}) {
  const bw = s * 2.95, top = cy - s * 1.62, bot = cy + s * 1.17, x0 = cx - bw / 2, rise1 = clamp(o.rise ?? 1);
  const body = new Path2D(); body.roundRect(x0, top, bw, bot - top, s * .14);
  ctx.save();
  if (rise1 < 1) { ctx.beginPath(); ctx.rect(x0 - 50, lerp(bot, top - 4, expoOut(rise1)), bw + 100, 9999); ctx.clip(); }
  ctx.fillStyle = lin(ctx, x0, 0, x0 + bw, 0, [[0, P.night1], [.55, P.ind2], [1, mixHex(P.ind2, P.blue1, .4)]]); ctx.fill(body);
  ctx.strokeStyle = rgba(P.blue0, .95); ctx.lineWidth = Math.max(1.2, s * .025); ctx.stroke(body);
  // control strip: a seam, a dial and two small lights
  ctx.strokeStyle = rgba(P.blue1, .8); ctx.lineWidth = Math.max(1, s * .015); ctx.beginPath(); ctx.moveTo(x0 + s * .1, top + s * .42); ctx.lineTo(x0 + bw - s * .1, top + s * .42); ctx.stroke();
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(x0 + bw - s * .45, top + s * .21, s * .12, 0, 6.29); ctx.fill(); ctx.strokeStyle = rgba(COOL, .7); ctx.stroke();
  for (const [dx, col] of [[.32, P.halo1], [.55, COOL]]) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x0 + s * dx, top + s * .21, s * .035, 0, 6.29); ctx.fill(); }
  ctx.restore();
  porthole(ctx, cx, cy, s, t, { ...o, a: (o.a ?? 1) * clamp(rise1 * 1.6 - .3) });
}
// the porthole on its own (it is also the lower bulb of the hourglass, seen close): warm ring of light, sand tumbling inside
export function porthole(ctx, cx, cy, s, t, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const rp = new Path2D(); rp.arc(cx, cy, s, 0, 6.29); const st = rp.stroke({ width: s * .13, cap: 1, join: 1 });
  ctx.save(); ctx.fillStyle = rad(ctx, cx, cy, s, [[0, rgba(P.night0, .9 * a)], [.8, rgba(P.ind1, .9 * a)], [1, rgba(P.blue1, .6 * a)]]); ctx.beginPath(); ctx.arc(cx, cy, s * .95, 0, 6.29); ctx.fill(); ctx.restore();
  // the laundry: clumps of gold sand carried round the drum and falling back (spin = drum angle)
  drumSand(ctx, cx, cy, s * .86, o.spin ?? t * 2.2, o.load ?? 1, a);
  E.lightShape(ctx, st, t, { lit: 1, a, dust: 0, glow: .6 });
}
const CLUMPS = (() => { const r = prng(808), c = []; for (let i = 0; i < 46; i++) c.push([r(), r(), r(), r()]); return c; })();
export function drumSand(ctx, cx, cy, R, spin, load, a = 1) {
  if (load <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.29); ctx.clip(); ctx.globalCompositeOperation = 'lighter';
  for (const [u, v, w, z] of CLUMPS) {
    // each clump rides up with the drum, then tumbles down across the middle (a loop: angle + radius change)
    const ph = (u + spin / (Math.PI * 2) * (.85 + .3 * z)) % 1, up = ph < .62;
    const ang = up ? lerp(Math.PI * .65, -Math.PI * .1, ph / .62) : lerp(-Math.PI * .1, Math.PI * .65 + Math.PI * 2, (ph - .62) / .38) % (Math.PI * 2);
    const rr = R * (up ? .62 + .3 * v : lerp(.92, .35 + .3 * v, Math.sin((ph - .62) / .38 * Math.PI)));
    const px = cx + Math.cos(ang) * rr, py = cy + Math.sin(ang) * rr, sz = R * (.07 + .09 * w) * Math.sqrt(load);
    ctx.globalAlpha = a * (.35 + .4 * w) * clamp(load * 2);
    ctx.fillStyle = rad(ctx, px, py, sz * 1.6, [[0, P.core1], [.4, rgba(P.halo0, .8)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(px, py, sz * 1.6, 0, 6.29); ctx.fill();
  }
  ctx.restore();
}

// ---------- the envelope of light (1.09, 4.07, 4.08): dark body, outline of cool light + flap ----------
// o { fold 0..1 (flap drawn), edge 0..1 (outline light), fill 0..1 (the face fills with screen light), a, seal 0..1 (gold seal), lit }
export function envelope(ctx, cx, cy, w, h, t, o = {}) {
  const a = o.a ?? 1, x0 = cx - w / 2, y0 = cy - h / 2, fill = clamp(o.fill ?? 0), edge = clamp(o.edge ?? 1);
  const box = new Path2D(); box.roundRect(x0, y0, w, h, Math.min(w, h) * .06);
  ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = lin(ctx, x0, 0, x0 + w, 0, [[0, mixHex(P.night1, SCREEN, fill * .8)], [.55, mixHex(P.ind2, SCREEN, fill * .9)], [1, mixHex(mixHex(P.ind2, P.blue1, .4), SCREEN, fill)]]);
  ctx.fill(box);
  ctx.strokeStyle = rgba(P.blue0, .95); ctx.lineWidth = Math.max(1.2, w * .008); ctx.stroke(box); ctx.restore();
  const s = box.stroke({ width: Math.max(1.5, w * .016), cap: 1, join: 1 });
  if (edge > 0) E.lightShape(ctx, s, t, { lit: o.lit ?? 0, a: a * edge, dust: 0, glow: .5 });
  const fold = clamp(o.fold ?? 1);
  if (fold > 0) {
    const f = new Path2D(), my = y0 + h * .58; f.moveTo(x0 + w * .04, y0 + h * .06); f.lineTo(cx, lerp(y0 + h * .06, my, fold)); f.lineTo(x0 + w * .96, y0 + h * .06);
    E.lightShape(ctx, f.stroke({ width: Math.max(1.2, w * .013), cap: 1, join: 1 }), t, { lit: o.lit ?? 0, a: a * Math.min(fold * 3, 1) * Math.max(edge, .3), dust: 0, glow: .4 });
  }
  if (o.seal > 0) { const sp = new Path2D(); sp.arc(cx, y0 + h * .58, Math.max(w, 60) * .055 * o.seal, 0, 6.29); E.lightShape(ctx, sp, t, { lit: 1, a, dust: 0 }); }
}

// ---------- a small hourglass of light (held, on a sill, on a table): the kit hourglass, sized ----------
export const smallGlass = (ctx, x, y, h, t, o = {}) => K.hourglass(ctx, x, y, h, t, { top: .6, bot: .35, flow: 1, glow: .8, ...o });

// ---------- a person's phone light (cool), at a hand ----------
export function phoneLight(ctx, x, y, s, a = 1) {
  halo(ctx, x, y, s * 9, .45 * a, SCREEN, P.cream);
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = mixHex(SCREEN, P.cream, .4); ctx.fillRect(x - s * .45, y - s * .75, s * .9, s * 1.5); ctx.restore();
}
// a polyline morph helper: sample a closed path given as a function f(u) → [x,y] into n points
export const sample = (f, n) => Array.from({ length: n }, (_, i) => f(i / n));
export function poly(ctx, pts, close = true) { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); if (close) ctx.closePath(); }
export { E, K };
