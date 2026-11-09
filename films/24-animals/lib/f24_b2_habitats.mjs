// Film 24 · B2 (c05–c08) · the habitats inside the medallions (2.5D card stages, ONE warm light each, living animals).
// Owned by builder B2. Each stage is drawn in DESIGN coordinates with an E.cam3 camera; it works full frame and inside a medallion
// (E.withOuter / inMed). Screen-space layers inside a stage use the current ctx transform only (never setTransform).
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f24_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, rad, prng } = E;
const F0 = E.F0, TAU = Math.PI * 2, { rise } = F;

// ======================================================================================================================== LEÓN
// a crop field at dawn near León: the low sun left (the hero light), rolling hills, a crow family on the stubble.
export const LEON = { ground: 800, sun: [380, 572], tagged: { x: 930, h: 150 } };
const STUB = (() => { const r = prng(2501), s = []; for (let i = 0; i < 420; i++) { const y = LEON.ground - 30 + r() ** 1.5 * 330; s.push([-400 + r() * 2720, y, r(), 8 + r() * 20 * (y - 700) / 300]); } return s; })();
const HILLS = (() => { const p = new Path2D(), r = prng(2502); p.moveTo(-1600, 700); for (let x = -1600; x <= 3600; x += 160) p.lineTo(x, 655 - 26 * Math.sin(x * .0021 + 1) - 14 * Math.sin(x * .0057) - r() * 6); p.lineTo(3600, 1400); p.lineTo(-1600, 1400); p.closePath(); return p; })();
const RIDGE = (() => { const p = new Path2D(); p.moveTo(-2600, 640); for (let x = -2600; x <= 4600; x += 200) p.lineTo(x, 610 - 40 * Math.sin(x * .0013 + 2.2) - 18 * Math.sin(x * .0041)); p.lineTo(4600, 1400); p.lineTo(-2600, 1400); p.closePath(); return p; })();
export function leonStage(ctx, c, t, o = {}) {
  const [sx, sy] = LEON.sun, br = 1 + .015 * Math.sin(t * .9);
  E.card(ctx, c, 16000, () => {   // the dawn sky: night above, a warm band at the horizon round the sun
    ctx.fillStyle = lin(ctx, 0, -800, 0, 760, [[0, P.night0], [.45, mixHex(P.night1, P.ind0, .5)], [.8, mixHex(P.ind1, P.blue1, .35)], [1, mixHex(P.shade0, P.blue1, .45)]]); ctx.fillRect(-3000, -1600, W + 6000, 2500);
    ctx.fillStyle = rad(ctx, sx, sy, 1300, [[0, rgba(P.shade0, .5)], [.4, rgba(P.shade0, .16)], [1, rgba(P.shade0, 0)]]); ctx.fillRect(-3000, -1600, W + 6000, 2500);
    E.stars(ctx, 2503, 60, t, [-1200, -900, W + 2400, 900], .5);
  });
  E.card(ctx, c, 9000, () => {   // the sun, just above the far ridge
    halo(ctx, sx, sy, 520 * br, .55, P.halo1, P.core1);
    ctx.fillStyle = rad(ctx, sx, sy, 46, [[0, P.core0], [.7, P.core1], [1, rgba(P.halo0, 0)]]); ctx.beginPath(); ctx.arc(sx, sy, 44, 0, TAU); ctx.fill();
    ctx.fillStyle = lin(ctx, 0, 600, 0, 760, [[0, mixHex(P.ind1, P.blue1, .3)], [1, P.night1]]); ctx.fill(RIDGE);
    ctx.save(); ctx.clip(RIDGE); ctx.strokeStyle = rgba(P.halo1, .35); ctx.lineWidth = 4; ctx.stroke(RIDGE); ctx.restore();
  });
  E.card(ctx, c, 4000, () => {   // the near hills with a lit rim toward the sun, a lone tree on the right
    ctx.fillStyle = lin(ctx, -400, 0, 2400, 0, [[0, mixHex(P.ind2, P.shade0, .25)], [.4, P.ind2], [1, P.night1]]); ctx.fill(HILLS);
    ctx.save(); ctx.clip(HILLS); ctx.strokeStyle = rgba(P.halo1, .28); ctx.lineWidth = 5; ctx.stroke(HILLS); ctx.restore();
    const tx = 1640, ty = 655, sw = .01 * Math.sin(t * .5);
    ctx.fillStyle = mixHex(P.night0, P.ind1, .35); ctx.fillRect(tx - 7, ty - 120, 14, 124);
    ctx.save(); ctx.translate(tx, ty - 130); ctx.rotate(sw);
    for (const [dx, dy, r] of [[0, -40, 78], [-62, 4, 54], [60, 0, 58], [-20, 30, 50], [30, -90, 46]]) { ctx.beginPath(); ctx.ellipse(dx, dy, r * 1.1, r * .8, 0, 0, TAU); ctx.fill(); }
    ctx.restore();
  });
  E.card(ctx, c, F0, () => {   // the field: stubble catching the sun, the crows (drawn by the caller in o.cast)
    const g = LEON.ground;
    ctx.fillStyle = lin(ctx, 0, g - 90, 0, H + 400, [[0, mixHex(P.shade0, P.ind1, .6)], [.3, mixHex(P.shade0, P.night1, .78)], [1, P.night0]]); ctx.fillRect(-1600, g - 92, W + 3200, H + 900);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = rad(ctx, sx, g - 40, 900, [[0, rgba(P.halo1, .22)], [.6, rgba(P.shade0, .06)], [1, rgba(P.shade0, 0)]]); ctx.save(); ctx.translate(sx, g - 40); ctx.scale(1.6, .3); ctx.translate(-sx, -(g - 40)); ctx.fillRect(sx - 1000, g - 1000, 2000, 2000); ctx.restore();
    ctx.restore();
    ctx.lineCap = 'round';
    for (const [x, y, q, len] of STUB) {
      const d = clamp(1 - Math.hypot((x - sx) / 2.2, (y - g) * 2) / 900), aa = -1.35 + .25 * (q - .5) + .025 * Math.sin(t * .7 + q * 9);
      ctx.strokeStyle = rgba(mixHex(P.shade0, P.halo1, d), (.16 + .42 * d) * (.6 + .4 * q)); ctx.lineWidth = 1.6 + 1.6 * q;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(aa) * len, y + Math.sin(aa) * len); ctx.stroke();
    }
    if (o.cast) o.cast();
  });
  E.card(ctx, c, 1150, () => {   // foreground: dark tufts in the corners (depth)
    ctx.fillStyle = mixHex(P.night0, P.ind0, .3);
    for (const [x0, s] of [[-140, 1], [1820, -1]]) {
      for (let i = 0; i < 9; i++) { const x = x0 + s * i * 26, h = 120 + 60 * Math.sin(i * 1.7), sw = 10 * Math.sin(t * .6 + i); ctx.beginPath(); ctx.moveTo(x - 16, H + 40); ctx.quadraticCurveTo(x + sw * .5, H - h * .5, x + sw + s * 18, H + 20 - h); ctx.quadraticCurveTo(x + 8, H - h * .4, x + 16, H + 40); ctx.closePath(); ctx.fill(); }
    }
  });
}
// the crow family (F0 design px). st: { tag: { x, y, fly, peck, open, lift (0..1 airborne), dir }, open: [o1..o4], peck: [..] }
export const FAMILY = [
  { x: 610, y: 818, h: 112, dir: 1, seed: 2 },
  { x: 1340, y: 806, h: 120, dir: -1, seed: 3 },
  { x: 1560, y: 830, h: 102, dir: -1, seed: 4 },
  { x: 770, y: 784, h: 80, dir: 1, seed: 5 },
];
export function crowCast(ctx, t, st = {}) {
  const out = { fam: [] };
  FAMILY.forEach((f, i) => {
    const pk = st.peck?.[i] ?? Math.max(0, Math.sin(t * .8 + i * 2.1)) ** 6, op = st.open?.[i] ?? 0;
    out.fam.push(F.crow(ctx, t, f.x, f.y, f.h, { dir: f.dir, light: -1, warm: .45, seed: f.seed, peck: pk, open: op }));
  });
  const g = st.tag || {}, x = g.x ?? LEON.tagged.x, y = g.y ?? LEON.ground + 30, h = LEON.tagged.h, dir = g.dir ?? -1;
  out.tag = F.crow(ctx, t, x, y, h, { dir, light: -1, warm: .6, seed: 1, tag: true, fly: g.fly, peck: g.peck ?? 0, open: g.open ?? 0 });
  // the recorder on the tail feather: local (−.55, −.34) of the crow frame (fly lifts the body by .5 h)
  out.rec = [x - .55 * h * dir, y - (.34 + (g.fly != null ? .5 : 0)) * h];
  return out;
}

// ======================================================================================================================== THE BARN (B2)
// the hook's barn with a life line along the floor: BIRTH → SLAUGHTER, many small calls on it (no violence). F0 design px.
export const LIFE = { y: 905, x0: 600, x1: 1650 };
const LIFECALLS = (() => { const r = prng(2510), s = []; for (let i = 0; i < 26; i++) s.push({ f: .03 + .94 * (i + r() * .6) / 26, kind: r() < .7 ? 'grunt' : 'squeal', h: 22 + r() * 26, ph: r() * 6, seed: 40 + i }); return s; })();
export function lifeLine(ctx, t, u, cu, o = {}) {   // u: the line drawn 0..1, cu: the calls on it 0..1 (they ride the line's head)
  if (u <= 0 && cu <= 0) return;
  const { y, x0, x1 } = LIFE, a = o.a ?? 1, ra = o.retract ?? 0;
  ctx.save();
  if (u * (1 - ra) > .002) F.rule(ctx, lerp(x0, x1, ra * u), y, lerp(x0, x1, u), y, 1, { w: 3 });
  if (u > .98 && ra < .02) { ctx.strokeStyle = P.cream; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x1 - 14, y - 9); ctx.lineTo(x1, y); ctx.lineTo(x1 - 14, y + 9); ctx.stroke(); }
  F.maskLine(ctx, [['BIRTH', 0]], x0, y + 50, 34, rise(span(u, 0, .2)) * (1 - expoIn(span(ra, 0, .35))), { serif: false, weight: 600, col: P.cream, glow: false });
  const sw = F.measure('SLAUGHTER', 34, false);
  F.maskLine(ctx, [['SLAUGHTER', 0]], x1 - sw, y + 50, 34, rise(span(u, .82, 1)) * (1 - expoIn(span(ra, .5, 1))), { serif: false, weight: 600, col: mixHex(P.blue0, P.cream, .6), glow: false });
  for (const c of LIFECALLS) {
    const k = clamp((cu - c.f) * 8) * clamp((c.f - ra) * 8); if (k <= 0) continue;
    const live = .75 + .25 * Math.sin(t * 2.2 + c.ph);
    F.wave(ctx, t, lerp(x0, x1, c.f), y - 34, 40, c.h * expoOut(k) * live, c.kind, { u: 1, bars: 9, seed: c.seed, head: false, a: .7, col: 'cream' });
  }
  ctx.restore();
}

// ======================================================================================================================== THE SEA
// deep water off Dominica: a light shaft from the surface (the hero light) falls left; marine snow; the sperm whale sinks through it.
const SNOW = (() => { const r = prng(2520), s = []; for (let i = 0; i < 160; i++) s.push([r() * 2600 - 340, r() * 1500 - 200, .6 + r() * 1.8, r() * 6.3, .2 + r() * .6]); return s; })();
function snow(ctx, t, a, sp = 1) {
  ctx.save(); ctx.fillStyle = P.cream;
  for (const [x, y, s, ph, f] of SNOW) { const yy = ((y + t * 14 * f * sp) % 1500 + 1500) % 1500 - 200, xx = x + 14 * Math.sin(t * .3 * f + ph); ctx.globalAlpha = a * (.25 + .25 * Math.sin(t * f + ph)); ctx.fillRect(xx, yy, s, s); }
  ctx.restore();
}
function shaft(ctx, x, w0, w1, len, a, t) {   // a soft light shaft from the surface (lighter)
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let k = 0; k < 3; k++) {
    const sw = 40 * Math.sin(t * .23 + k * 2), dx = (k - 1) * w0 * .45;
    ctx.fillStyle = lin(ctx, 0, -300, 0, len, [[0, rgba(P.halo2, a * (k === 1 ? .22 : .1))], [.6, rgba(P.blue0, a * .05)], [1, rgba(P.blue0, 0)]]);
    ctx.beginPath(); ctx.moveTo(x + dx - w0 / 2, -300); ctx.lineTo(x + dx + w0 / 2, -300); ctx.lineTo(x + dx + w1 / 2 + sw + 260, len); ctx.lineTo(x + dx - w1 / 2 + sw + 260, len); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}
export function deepSea(ctx, c, t, o = {}) {
  E.card(ctx, c, 12000, () => {
    ctx.fillStyle = lin(ctx, 0, -1200, 0, H + 1200, [[0, mixHex(P.blue0, P.ind1, .35)], [.42, P.ind0], [.75, P.night1], [1, P.night0]]); ctx.fillRect(-3000, -1600, W + 6000, H + 3200);
    halo(ctx, 560, -160, 1100, .32, P.blue0, P.halo2);
    shaft(ctx, 560, 300, 900, 1500, 1, t);
  });
  E.card(ctx, c, 5200, () => { snow(ctx, t, .5, .6); if (o.far) o.far(); });
  E.card(ctx, c, F0, () => { if (o.cast) o.cast(); });
  E.card(ctx, c, 1150, () => snow(ctx, t * 1.3 + 40, .7, 1.2));
}
// clear water off Bimini: bright surface shimmer above (the hero light), sand below, rays; dolphins and a diver
const RAYS = (() => { const r = prng(2530), s = []; for (let i = 0; i < 9; i++) s.push([r() * 2200 - 140, 40 + r() * 90, r() * 6.3, .15 + r() * .2]); return s; })();
export function clearWater(ctx, c, t, o = {}) {
  E.card(ctx, c, 9000, () => {
    ctx.fillStyle = lin(ctx, 0, -700, 0, H + 700, [[0, mixHex(P.blue0, P.halo2, .28)], [.3, P.blue0], [.7, mixHex(P.ind1, P.blue1, .4)], [1, P.ind0]]); ctx.fillRect(-3000, -1600, W + 6000, H + 3200);
    halo(ctx, 1150, -120, 1300, .38, P.halo2, P.core1);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const [x, w, ph, a] of RAYS) { const sw = 60 * Math.sin(t * .31 + ph), aa = a * (.7 + .3 * Math.sin(t * .7 + ph)); ctx.fillStyle = lin(ctx, 0, -200, 0, 1300, [[0, rgba(P.core1, aa * .5)], [1, rgba(P.blue0, 0)]]); ctx.beginPath(); ctx.moveTo(x, -200); ctx.lineTo(x + w, -200); ctx.lineTo(x + w * 2.4 + sw + 180, 1300); ctx.lineTo(x - w * .6 + sw + 180, 1300); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  });
  E.card(ctx, c, 3600, () => {   // the sand bottom with soft light patches
    ctx.fillStyle = lin(ctx, 0, 820, 0, 1400, [[0, mixHex(P.shade1, P.blue1, .55)], [1, mixHex(P.night1, P.blue1, .3)]]);
    ctx.beginPath(); ctx.moveTo(-2000, 860); for (let x = -2000; x <= 4000; x += 120) ctx.lineTo(x, 845 + 18 * Math.sin(x * .004) + 8 * Math.sin(x * .013)); ctx.lineTo(4000, 1600); ctx.lineTo(-2000, 1600); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 14; k++) { const x = -600 + k * 230 + 40 * Math.sin(t * .4 + k), y = 900 + 30 * Math.sin(k * 2.1); ctx.fillStyle = rad(ctx, x, y, 120, [[0, rgba(P.halo2, .1 + .05 * Math.sin(t * .9 + k))], [1, rgba(P.halo2, 0)]]); ctx.fillRect(x - 130, y - 60, 260, 120); }
    ctx.restore();
  });
  E.card(ctx, c, F0, () => { if (o.cast) o.cast(); });
  E.card(ctx, c, 1150, () => snow(ctx, t * .8 + 9, .35, .5));
}
// a diver drifting horizontally (head right), fins kicking slowly, the recorder (a small cream box) held forward. h = body length. → { rec }
export function diver(ctx, t, x, y, h, o = {}) {
  const bob = 8 * Math.sin(t * .6), ang = .06 * Math.sin(t * .35) + (o.ang ?? 0), kick = Math.sin(t * 1.6);
  const C = { base: mixHex(P.ind2, P.blue1, .5), lit: mixHex(P.blue1, P.halo2, .35), shade: P.night1 };
  ctx.save(); ctx.translate(x, y + bob); ctx.rotate(ang); ctx.scale(h, h);
  const limb = (pts, w0, w1, col) => { ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; for (let i = 0; i < pts.length - 1; i++) { ctx.lineWidth = lerp(w0, w1, i / Math.max(1, pts.length - 2)); ctx.beginPath(); ctx.moveTo(...pts[i]); ctx.lineTo(...pts[i + 1]); ctx.stroke(); } };
  // far leg + fin, near leg + fin (kicking in counter-phase)
  for (const [k, col] of [[-1, C.shade], [1, C.base]]) {
    const a = .12 * kick * k, kx = -.32, ky = .02 + .02 * k, fx = -.62, fy = ky + a * .8;
    limb([[-.05, .02], [kx, ky + a * .4], [fx, fy]], .085, .06, col);
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(fx + .02, fy - .03); ctx.lineTo(fx - .22, fy - .07 + a * .6); ctx.lineTo(fx - .2, fy + .05 + a * .6); ctx.lineTo(fx + .02, fy + .03); ctx.closePath(); ctx.fill();
  }
  // torso with the tank on the back
  ctx.fillStyle = mixHex(C.shade, C.base, .4); ctx.beginPath(); ctx.roundRect(-.12, -.135, .36, .07, .035); ctx.fill();
  const tor = new Path2D(); tor.ellipse(.1, .0, .2, .07, 0, 0, TAU);
  ctx.fillStyle = lin(ctx, 0, -.08, 0, .08, [[0, C.lit], [.5, C.base], [1, C.shade]]); ctx.fill(tor);
  // head with the mask, the arm reaching forward with the recorder
  ctx.fillStyle = C.base; ctx.beginPath(); ctx.arc(.36, -.02, .06, 0, TAU); ctx.fill();
  ctx.fillStyle = rgba(P.halo2, .55); ctx.beginPath(); ctx.ellipse(.405, -.03, .022, .03, 0, 0, TAU); ctx.fill();
  limb([[.22, .02], [.36, .07 + .01 * Math.sin(t * .9)], [.5, .05]], .045, .038, mixHex(C.base, C.lit, .3));
  ctx.restore();
  const c = Math.cos(ang), sn = Math.sin(ang), rx = x + (.54 * c - .05 * sn) * h, ry = y + bob + (.54 * sn + .05 * c) * h;
  ctx.save(); ctx.translate(rx, ry); ctx.rotate(ang); ctx.fillStyle = mixHex(P.cream, P.halo2, .3); ctx.fillRect(-12, -8, 24, 16); ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(6, 0, 3.5, 0, 7); ctx.fill(); ctx.restore();
  halo(ctx, rx, ry, 36, .22, P.halo2, P.core1);
  return { rec: [rx, ry] };
}

// ======================================================================================================================== PEOPLE (simple)
const PERS = { base: P.ind2, lit: mixHex(P.ind2, P.blue0, .85), shade: P.night1 };
// a toddler: big round head, short round body, short legs; o { dir, arm (0 down … 1 pointing up/forward), open (calling), bob }
export function toddler(ctx, t, x, y, h, o = {}) {
  const dir = o.dir ?? 1, bob = (o.bob ?? 1) * .015 * Math.sin(t * 2.2), arm = clamp(o.arm ?? 0), C = PERS;
  ctx.save(); ctx.translate(x, y); ctx.scale(h * dir, h);
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.ellipse(0, 0, .3, .03, 0, 0, TAU); ctx.fill();
  const limb = (pts, w, col) => { ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(...pts[0]); for (const p of pts.slice(1)) ctx.lineTo(...p); ctx.stroke(); };
  limb([[-.06, -.3], [-.07, -.03]], .1, C.shade); limb([[.06, -.3], [.07, -.03]], .1, mixHex(C.base, C.lit, .3));
  ctx.translate(0, bob);
  const b = new Path2D(); b.ellipse(0, -.42, .17, .2, 0, 0, TAU);
  ctx.fillStyle = lin(ctx, -.17, 0, .17, 0, [[0, C.shade], [.5, C.base], [1, C.lit]]); ctx.fill(b);
  const a0 = [.08, -.52], ang = lerp(.25, -1.2, arm);   // the near arm: hanging → pointing forward-up
  limb([a0, [a0[0] + Math.cos(ang) * .2, a0[1] + Math.sin(ang) * .2 + .16 * (1 - arm)]], .075, mixHex(C.base, C.lit, .4));
  ctx.fillStyle = mixHex(C.base, C.lit, .25); ctx.beginPath(); ctx.arc(.02, -.8, .16, 0, TAU); ctx.fill();
  ctx.fillStyle = rgba(P.halo2, .25 + .2 * clamp(o.open ?? 0)); ctx.beginPath(); ctx.arc(.12, -.78, .03 + .02 * clamp(o.open ?? 0), 0, TAU); ctx.fill();
  ctx.restore();
  return { mouth: [x + .17 * h * dir, y - .78 * h + bob * h], head: [x + .02 * h * dir, y - .8 * h], hand: [x + (a0[0] + Math.cos(ang) * .2) * h * dir, y + (a0[1] + Math.sin(ang) * .2) * h] };
}
// a seated listener (1970) on a sofa: y = floor, seat .30·h above it; o { dir, tilt (head), lit (rim from behind), seed, hair 0|1|2 }
export function seated(ctx, t, x, y, h, o = {}) {
  const dir = o.dir ?? 1, C = PERS, br = .006 * Math.sin(t * 1.1 + (o.seed ?? 0)), lit = o.lit ?? 0;
  const body = mixHex(C.base, C.shade, .35), rim = rgba(mixHex(P.halo1, P.core1, .3), .55 * lit);
  ctx.save(); ctx.translate(x, y); ctx.scale(h * dir, h);
  const fill = (p) => { ctx.fillStyle = body; ctx.fill(p); };
  const shin = new Path2D(); shin.roundRect(.22, -.31, .09, .31, .04); fill(shin);
  const foot = new Path2D(); foot.roundRect(.22, -.035, .14, .035, .015); fill(foot);
  const thigh = new Path2D(); thigh.roundRect(-.08, -.37, .38, .12, .06); fill(thigh);
  const torso = new Path2D(); torso.moveTo(-.1, -.3); torso.bezierCurveTo(-.13, -.45, -.11, -.62, -.06, -.7 - br); torso.lineTo(.08, -.7 - br); torso.bezierCurveTo(.12, -.6, .12, -.45, .1, -.3); torso.closePath(); fill(torso);
  ctx.strokeStyle = body; ctx.lineCap = 'round'; ctx.lineWidth = .07; ctx.beginPath(); ctx.moveTo(.04, -.66 - br); ctx.lineTo(.1, -.47); ctx.lineTo(.24, -.4); ctx.stroke();   // the arm, resting on the lap
  ctx.save(); ctx.translate(.02, -.8 - br); ctx.rotate((o.tilt ?? 0) + .03 * Math.sin(t * .4 + (o.seed ?? 0)));
  const head = new Path2D(); head.ellipse(0, 0, .075, .088, 0, 0, TAU); fill(head);
  const hair = new Path2D(); const hk = o.hair ?? 0;
  if (hk === 1) { hair.ellipse(-.02, -.02, .085, .09, 0, Math.PI * .9, Math.PI * 2.05); hair.roundRect(-.1, -.02, .07, .17, .03); }   // long hair
  else if (hk === 2) hair.ellipse(-.01, -.05, .09, .06, 0, Math.PI, TAU);   // a full crop
  else hair.ellipse(-.02, -.04, .08, .055, 0, Math.PI * .95, Math.PI * 2);
  ctx.fillStyle = mixHex(C.shade, P.night0, .3); ctx.fill(hair);
  ctx.restore();
  if (lit > 0) { ctx.strokeStyle = rim; ctx.lineWidth = .012; ctx.beginPath(); ctx.moveTo(-.11, -.33); ctx.bezierCurveTo(-.14, -.45, -.12, -.62, -.07, -.69); ctx.stroke(); }   // the lamp's rim on the back
  ctx.restore();
}

// ======================================================================================================================== KITCHEN
// a kitchen at night: the warm window (the hero light) on the back wall, a counter, a table with a cup; parent and toddler.
export const KITCHEN = { floor: 830, win: [1060, 250, 320, 300] };
export function cup(ctx, x, y) { ctx.fillStyle = mixHex(P.cream, P.halo2, .5); ctx.fillRect(x - 17, y - 46, 34, 46); ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(x - 17, y - 46, 12, 46); ctx.strokeStyle = mixHex(P.cream, P.halo2, .5); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x + 19, y - 24, 10, -1.3, 1.3); ctx.stroke(); }
export function kitchen(ctx, c, t, o = {}) {
  const [wx, wy, ww, wh] = KITCHEN.win, g = KITCHEN.floor, lit = 1 + .02 * Math.sin(t * 1.3);
  E.card(ctx, c, 6000, () => {
    ctx.fillStyle = lin(ctx, 0, -600, 0, H + 600, [[0, P.night0], [.5, mixHex(P.night1, P.ind1, .5)], [1, P.night1]]); ctx.fillRect(-2000, -1200, W + 4000, H + 2400);
    ctx.fillStyle = E.rad(ctx, wx + ww / 2, wy + wh / 2, 1000, [[0, rgba(P.shade0, .35 * lit)], [.6, rgba(P.blue0, .06)], [1, rgba(P.night1, 0)]]); ctx.fillRect(-2000, -1200, W + 4000, H + 2400);
  });
  E.card(ctx, c, 2600, () => {   // the window: warm panes, a cross frame (the hero light)
    halo(ctx, wx + ww / 2, wy + wh / 2, 640 * lit, .5, P.halo1, P.core1);
    ctx.fillStyle = lin(ctx, 0, wy, 0, wy + wh, [[0, P.core0], [1, P.halo1]]); ctx.fillRect(wx, wy, ww, wh);
    ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.fillRect(wx + ww / 2 - 7, wy, 14, wh); ctx.fillRect(wx, wy + wh / 2 - 7, ww, 14);
    ctx.lineWidth = 16; ctx.strokeStyle = mixHex(P.night0, P.ind1, .3); ctx.strokeRect(wx, wy, ww, wh);
  });
  E.card(ctx, c, F0, () => {
    ctx.fillStyle = lin(ctx, 0, g - 10, 0, H + 300, [[0, mixHex(P.shade0, P.ind1, .62)], [1, P.night0]]); ctx.fillRect(-1600, g - 10, W + 3200, H + 900);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.rad(ctx, wx + ww / 2, g + 60, 600, [[0, rgba(P.halo1, .2)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(wx - 700, g - 40, ww + 1400, 600); ctx.restore();
    ctx.fillStyle = mixHex(P.night0, P.ind1, .45); ctx.fillRect(1380, g - 300, 700, 300); ctx.fillStyle = rgba(P.halo1, .3); ctx.fillRect(1380, g - 300, 700, 5);   // the counter
    ctx.fillStyle = mixHex(P.night0, P.ind2, .5); ctx.fillRect(560, g - 190, 420, 18); ctx.fillRect(590, g - 172, 14, 172); ctx.fillRect(936, g - 172, 14, 172);   // the table
    ctx.fillStyle = rgba(P.halo1, .35); ctx.fillRect(560, g - 190, 420, 3);
    if (o.cup !== false) cup(ctx, ...(o.cup ?? [897, g - 190]));   // the cup (o.cup = [x, base y] or false)
    if (o.cast) o.cast();
  });
}

// ======================================================================================================================== ALASKA
// under the sea off Alaska: the surface above with a boat hull, a rope down to the underwater speaker, a humpback answering.
export function alaskaSea(ctx, c, t, o = {}) {
  deepSea(ctx, c, t, { far: () => {
    ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.beginPath(); ctx.moveTo(240, 40); ctx.lineTo(980, 40); ctx.quadraticCurveTo(940, 140, 860, 150); ctx.lineTo(330, 150); ctx.quadraticCurveTo(270, 120, 240, 40); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(P.cream, .3); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(560, 150); ctx.quadraticCurveTo(570 + 8 * Math.sin(t * .5), 380, 560, 560); ctx.stroke();
  }, cast: o.cast });
}
export function speaker(ctx, t, x, y, s, on = 0) {   // a small underwater speaker: a dark box, a cream cone that glows while it plays
  ctx.save(); ctx.translate(x, y + 6 * Math.sin(t * .5)); ctx.rotate(.04 * Math.sin(t * .4));
  ctx.fillStyle = mixHex(P.night0, P.ind2, .5); ctx.beginPath(); ctx.roundRect(-s * .6, -s * .5, s * 1.2, s, s * .12); ctx.fill();
  ctx.fillStyle = mixHex(P.cream, P.blue0, .4); ctx.beginPath(); ctx.arc(s * .1, 0, s * .32, 0, TAU); ctx.fill();
  ctx.restore();
  if (on > 0) halo(ctx, x + s * .1, y, s * 2.5, .45 * on, F.CREAM.body, F.CREAM.core);
  return [x + s * .5, y];
}

// ======================================================================================================================== DUSK (Amboseli)
// the savanna at dusk: a big low sun on the horizon (the hero light), acacias, the elephant family with the calf in the middle.
const ACACIA = (x, y, s) => { const p = new Path2D(); p.rect(x - 5 * s, y - 120 * s, 10 * s, 120 * s); p.ellipse(x, y - 130 * s, 120 * s, 22 * s, 0, 0, TAU); p.ellipse(x - 40 * s, y - 140 * s, 70 * s, 16 * s, 0, 0, TAU); return p; };
const GRASS = (() => { const r = prng(2540), s = []; for (let i = 0; i < 300; i++) { const y = 760 + r() ** 1.4 * 320; s.push([-500 + r() * 2900, y, r(), 10 + 26 * (y - 740) / 340]); } return s; })();
export function dusk(ctx, c, t, o = {}) {
  const sx = 1180, sy = 668, hy = 742;
  E.card(ctx, c, 16000, () => {
    ctx.fillStyle = lin(ctx, 0, -900, 0, hy + 20, [[0, P.night0], [.45, mixHex(P.ind1, P.night1, .4)], [.78, mixHex(P.blue1, P.shade0, .45)], [1, mixHex(P.shade0, P.halo1, .45)]]); ctx.fillRect(-3000, -1600, W + 6000, 2400);
    halo(ctx, sx, sy, 900, .5, P.halo1, P.core1);
    E.stars(ctx, 2541, 50, t, [-1000, -800, W + 2000, 700], .4);
  });
  E.card(ctx, c, 9000, () => {
    ctx.fillStyle = rad(ctx, sx, sy, 90, [[0, P.core0], [.75, P.core1], [1, rgba(P.halo0, 0)]]); ctx.beginPath(); ctx.arc(sx, sy, 86, 0, TAU); ctx.fill();
    ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.fillRect(-3000, hy, W + 6000, 1200);
    ctx.fillStyle = mixHex(P.night0, P.ind1, .3); for (const [x, s] of [[160, 1.4], [1800, 1.55], [2400, .9]]) ctx.fill(ACACIA(x, hy + 4, s));
    ctx.strokeStyle = rgba(P.halo1, .45); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-3000, hy); ctx.lineTo(W + 3000, hy); ctx.stroke();
  });
  E.card(ctx, c, F0, () => {
    ctx.fillStyle = lin(ctx, 0, hy + 30, 0, H + 300, [[0, mixHex(P.shade0, P.night1, .6)], [1, P.night0]]); ctx.fillRect(-1600, hy + 30, W + 3200, H + 900);
    ctx.lineCap = 'round';
    for (const [x, y, q, len] of GRASS) { const d = clamp(1 - Math.abs(x - sx) / 1200); ctx.strokeStyle = rgba(mixHex(P.shade0, P.halo1, d * .6), .2 + .35 * d * q); ctx.lineWidth = 1.5 + 1.5 * q; const aa = -1.45 + .3 * (q - .5) + .04 * Math.sin(t * .8 + q * 7); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(aa) * len, y + Math.sin(aa) * len); ctx.stroke(); }
    if (o.cast) o.cast();
  });
}
export function elephantFamily(ctx, t, o = {}) {
  const g = 900, wk = o.walk ?? 0;
  F.elephant(ctx, t, 1480, g - 40, 175, { dir: -1, light: -1, warm: .8, seed: 6, dark: .45, ears: .3 + .1 * Math.sin(t * .5), trunk: .15 + .12 * Math.sin(t * .4) });   // stands, waits for them
  F.elephant(ctx, t, 700 + wk * 40, g, 210, { dir: 1, light: 1, warm: .8, seed: 2, dark: .4, ears: .25, trunk: .1 * Math.sin(t * .3), walk: o.walkPh });
  F.elephant(ctx, t, 965 + wk * 40, g + 6, 105, { dir: 1, light: 1, warm: .9, seed: 9, dark: .3, calf: true, ears: .4, trunk: .2 + .15 * Math.sin(t * .7), walk: o.walkPh != null ? o.walkPh + .7 : undefined });
}

// ======================================================================================================================== 1970
// a living room in 1970: a floor lamp (the hero light), a record player on a low cabinet, the album leaning beside it, the family on
// the sofa listening. REC = the record label's centre (design px, F0): the 1970 dot of the timeline becomes this label.
export const ROOM70 = { floor: 840, rec: [760, 676], recR: 22 };
const SONGS = ['SONGS OF THE', 'HUMPBACK WHALE'];
export function room70(ctx, c, t, o = {}) {
  const g = ROOM70.floor, [rx, ry] = ROOM70.rec, L = [1700, 452], br = 1 + .015 * Math.sin(t * 1.1);
  E.card(ctx, c, 4200, () => {   // the wall: dark wallpaper stripes, the lamp's warm pool
    ctx.fillStyle = lin(ctx, 0, -600, 0, H + 600, [[0, P.night0], [.55, mixHex(P.night1, P.ind1, .55)], [1, P.night1]]); ctx.fillRect(-2400, -1400, W + 4800, H + 2800);
    ctx.fillStyle = rgba(P.ind2, .35); for (let x = -2400; x < W + 2400; x += 90) ctx.fillRect(x, -1400, 34, H + 2800);
    ctx.fillStyle = rad(ctx, L[0], L[1] + 40, 1100, [[0, rgba(P.halo1, .28 * br)], [.5, rgba(P.shade0, .08)], [1, rgba(P.shade0, 0)]]); ctx.fillRect(-2400, -1400, W + 4800, H + 2800);
    ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.fillRect(250, 300, 300, 210); ctx.strokeStyle = rgba(P.halo1, .25); ctx.lineWidth = 6; ctx.strokeRect(250, 300, 300, 210);   // a picture frame
  });
  E.card(ctx, c, F0, () => {
    ctx.fillStyle = lin(ctx, 0, g - 10, 0, H + 300, [[0, mixHex(P.shade0, P.night1, .72)], [1, P.night0]]); ctx.fillRect(-1600, g - 10, W + 3200, H + 900);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, L[0], g + 40, 700, [[0, rgba(P.halo1, .22 * br)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(L[0] - 800, g - 40, 1600, 600); ctx.restore();
    // the floor lamp
    ctx.fillStyle = mixHex(P.night0, P.ind2, .5); ctx.fillRect(L[0] - 4, L[1] + 30, 8, g - L[1] - 30); ctx.beginPath(); ctx.ellipse(L[0], g, 50, 8, 0, 0, TAU); ctx.fill();
    halo(ctx, L[0], L[1] + 20, 520 * br, .55, P.halo1, P.core1);
    ctx.fillStyle = lin(ctx, 0, L[1] - 40, 0, L[1] + 40, [[0, P.halo1], [1, P.core0]]); ctx.beginPath(); ctx.moveTo(L[0] - 46, L[1] - 40); ctx.lineTo(L[0] + 46, L[1] - 40); ctx.lineTo(L[0] + 76, L[1] + 40); ctx.lineTo(L[0] - 76, L[1] + 40); ctx.closePath(); ctx.fill();
    // the sofa
    ctx.fillStyle = mixHex(P.night1, P.shade0, .22); ctx.beginPath(); ctx.roundRect(1110, 640, 520, 150, 26); ctx.fill();
    ctx.fillStyle = mixHex(P.night1, P.shade0, .3); ctx.beginPath(); ctx.roundRect(1090, 740, 560, 80, 18); ctx.fill(); ctx.fillRect(1110, 820, 16, 20); ctx.fillRect(1614, 820, 16, 20);
    // the cabinet and the record player (seen a little from above)
    ctx.fillStyle = mixHex(P.night0, P.shade0, .25); ctx.fillRect(520, 700, 600, g - 700); ctx.fillStyle = rgba(P.halo1, .25); ctx.fillRect(520, 700, 600, 3);
    ctx.fillStyle = mixHex(P.night0, P.ind2, .6); ctx.fillRect(620, 682, 300, 18);
    ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.beginPath(); ctx.ellipse(rx, ry, 120, 26, 0, 0, TAU); ctx.fill();   // the record
    ctx.strokeStyle = rgba(P.cream, .12); ctx.lineWidth = 1.5; for (let k = 1; k < 5; k++) { ctx.beginPath(); ctx.ellipse(rx, ry, 120 - k * 18, 26 - k * 3.9, 0, 0, TAU); ctx.stroke(); }
    const sp = t * 3.5; ctx.strokeStyle = rgba(P.cream, .25); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(rx, ry, 92, 20, 0, sp, sp + .5); ctx.stroke();   // a turning glint
    ctx.fillStyle = mixHex(P.cream, P.halo2, .3); ctx.beginPath(); ctx.ellipse(rx, ry, ROOM70.recR, ROOM70.recR * .45, 0, 0, TAU); ctx.fill();   // the label
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(rx, ry, 2.5, 0, TAU); ctx.fill();
    ctx.fillStyle = mixHex(P.cream, P.blue1, .55); ctx.beginPath(); ctx.arc(890, 672, 10, 0, TAU); ctx.fill(); ctx.strokeStyle = mixHex(P.cream, P.blue1, .5); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(890, 672); ctx.lineTo(rx + 62, ry - 6); ctx.stroke(); ctx.fillRect(rx + 52, ry - 12, 20, 9);   // the tone arm
    // the album, leaning against the cabinet
    ctx.save(); ctx.translate(330, g); ctx.rotate(.1); const AS = 190;
    ctx.fillStyle = lin(ctx, 0, -AS, 0, 0, [[0, mixHex(P.blue0, P.ind1, .3)], [1, P.ind1]]); ctx.fillRect(0, -AS, AS, AS);
    ctx.save(); ctx.beginPath(); ctx.rect(0, -AS, AS, AS); ctx.clip(); F.humpback(ctx, t, 100, -58, 28, { dir: 1, light: 1, warm: .3, base: mixHex(P.blue1, P.cream, .25), seed: 3, tilt: -.15, swim: .3 }); ctx.restore();
    SONGS.forEach((w, i) => E.glowText(ctx, w, 14, -AS + 30 + i * 22, { size: 16, weight: 700, col: P.cream, glow: false, spacing: .06 }));
    ctx.restore();
    if (o.cast) o.cast();
  });
}
