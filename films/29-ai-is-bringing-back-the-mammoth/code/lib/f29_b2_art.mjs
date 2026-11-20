// Film 29 · builder B2 (c07–c11) · own drawings that the kit does not have (B2 only; the lead's kit stays untouched).
//   comb(ctx, x, y0, y1, a)                the machine's comb standing VERTICAL over a strand (cyan line, trailing light, teeth)
//   dish(ctx, x, y, r, u, o { gold, ring }) a small glass dish on the bench (the lab test that waits for its tick)
//   egg(ctx, t, x, y, s, o { hatch, chick }) the artificial egg: a see-through skin held in a 3D-printed cup (vo-v4); hatch parts the skin
//   chick(ctx, t, x, y, s, o { dir, look, a }) a downy chick (buff, never yellow: yellow is only you)
//   tooth(ctx, x, y, s, o { a, glow })     an old canine tooth (ivory), the ancient DNA
//   gate: gatePanel(ctx, c, t, open) + gatePatch(ctx, c, t, st, open) (the fence segment between two posts swings open; the rails behind
//         are patched from a second world pass without the fence: module-level canvas, made once)
//   island(ctx, t, x, y, s, u) a low island on the horizon (rises out of it) · pyramids(ctx, x, y, s, u) three small silhouettes
//   frostMask(ctx, t, cx, cy, r, o)        the ice closing over the frame (outside the circle r is frost), a sprite made once
import { createCanvas, Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f29_kit.mjs';
import * as S from './f29_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, halo, lin, rad, prng } = E;
const { GOLD, MACH, LAMP, FROST, SNOW, rise } = F;
const TAU = Math.PI * 2;

// ---------------------------------------------------------------------------------------------------------------- the vertical comb
export function comb(ctx, x, y0, y1, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = lin(ctx, x - 60, 0, x, 0, [[0, rgba(MACH.halo, 0)], [1, rgba(MACH.halo, .3)]]); ctx.fillRect(x - 60, y0, 60, y1 - y0);
  ctx.restore();
  F.accentSpan(ctx, [[x, y0], [x, y1]], 0, 1, { w: 2.2, spark: false, col: MACH });
  ctx.fillStyle = rgba(MACH.line, .55); for (let y = y0 + 8; y < y1; y += 14) ctx.fillRect(x + 2, y - 1, 8, 2);
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- the bench dishes
export function dish(ctx, x, y, r, u, o = {}) {
  const e = rise(clamp(u)); if (e <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(e, e);
  ctx.fillStyle = rgba(FROST.body, .14); ctx.beginPath(); ctx.ellipse(0, 0, r, r * .32, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba(FROST.core, .6); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(0, 0, r, r * .32, 0, 0, TAU); ctx.stroke();
  ctx.strokeStyle = rgba(FROST.shade, .5); ctx.beginPath(); ctx.ellipse(0, r * .12, r * .92, r * .26, 0, .1, Math.PI - .1); ctx.stroke();
  const g = clamp(o.gold ?? 0);
  if (g > 0) { halo(ctx, 0, -1, r * 1.6, .45 * g, GOLD.halo, GOLD.core); ctx.fillStyle = rgba(GOLD.core, g); ctx.beginPath(); ctx.arc(0, -1, r * .22, 0, TAU); ctx.fill(); }
  if (o.ring) { ctx.strokeStyle = rgba(P.cream, .38 * o.ring); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(0, -r * 1.25, r * .3, 0, TAU); ctx.stroke(); }
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- the clear egg and the chick
const CHICK_BODY = '#e6d3ad', CHICK_SHADE = '#a88d63';
export function chick(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const dir = o.dir ?? 1, lk = o.look ?? 0, bob = .02 * Math.sin(t * 3.1) + (o.peck ?? 0) * .08;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s); ctx.globalAlpha *= a;
  ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.ellipse(0, 0, .42, .05, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#c98f3a'; ctx.lineWidth = .045; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-.08, -.2); ctx.lineTo(-.1, 0); ctx.moveTo(.08, -.2); ctx.lineTo(.1, 0); ctx.stroke();
  const b = new Path2D(); b.ellipse(-.04, -.38, .36, .3, 0, 0, TAU);
  const hx = .26, hy = -.74 + bob - lk * .05; b.moveTo(hx + .2, hy); b.ellipse(hx, hy, .2, .2, 0, 0, TAU);
  ctx.save(); ctx.clip(b); ctx.fillStyle = rgba(LAMP.core, .8); ctx.fillRect(-1, -1.2, 2, 1.3); ctx.translate(-.03, .03);
  ctx.fillStyle = lin(ctx, 0, -.95, 0, -.08, [[0, mixHex(CHICK_BODY, P.cream, .3)], [.6, CHICK_BODY], [1, CHICK_SHADE]]); ctx.fill(b); ctx.restore();
  // down: a few soft tufts on the crown and the back
  ctx.fillStyle = rgba(mixHex(CHICK_BODY, P.cream, .4), .8); for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.ellipse(hx - .06 + k * .04, hy - .19, .015, .05, -.4 + k * .25, 0, TAU); ctx.fill(); }
  ctx.fillStyle = mixHex(CHICK_SHADE, P.night1, .2); ctx.beginPath(); ctx.ellipse(-.12, -.42, .17, .1, .4, 0, TAU); ctx.fill();   // the wing
  ctx.fillStyle = '#d9a248'; ctx.beginPath(); ctx.moveTo(hx + .17, hy - .02); ctx.lineTo(hx + .3, hy + .02); ctx.lineTo(hx + .17, hy + .06); ctx.closePath(); ctx.fill();   // beak
  const blink = Math.sin(t * 1.7 + 1) > .985 ? .2 : 1;
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.ellipse(hx + .07, hy - .03, .026, .026 * blink, 0, 0, TAU); ctx.fill();
  ctx.restore();
}
// the artificial egg (vo-v4): a see-through skin held in a 3D-printed cup. (x, y) = bottom, s = height. hatch 0..1: the skin parts at
// the top and its two flaps fold back; o.chick 0..1 = how much of the curled chick shows through the skin
export function egg(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const hatch = clamp(o.hatch ?? 0), w = s * .39, breathe = 1 + .006 * Math.sin(t * 1.4);
  const prof = (hh) => w * Math.sin(Math.acos(clamp(1 - 2 * hh, -1, 1))) * (1 - .18 * hh);   // half width at height hh (0 bottom .. 1 top)
  const skin = (path, h0, h1, side = 0) => {   // the skin between heights h0..h1; side -1 / 1 = only the left / right half
    const L = [], R = []; for (let k = 0; k <= 30; k++) { const hh = lerp(h0, h1, k / 30), ww = prof(hh) * breathe; L.push([-ww, -hh * s]); R.push([ww, -hh * s]); }
    const pts = side < 0 ? [...L, [0, -h1 * s], [0, -h0 * s]] : side > 0 ? [[0, -h0 * s], [0, -h1 * s], ...R.reverse()] : [...L, ...R.reverse()];
    pts.forEach((p, i) => (i ? path.lineTo(p[0], p[1]) : path.moveTo(p[0], p[1]))); path.closePath();
  };
  ctx.save(); ctx.translate(x, y); ctx.globalAlpha *= a;
  ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.ellipse(0, 0, w * 1.25, s * .045, 0, 0, TAU); ctx.fill();
  const cutH = .62;
  // the chick, curled, seen through the skin (until it hatches)
  if ((o.chick ?? 1) > 0 && hatch < .5) { const whole = new Path2D(); skin(whole, 0, 1); ctx.save(); ctx.clip(whole); ctx.globalAlpha *= .8 * (o.chick ?? 1); chick(ctx, t, -s * .02, -s * .08, s * .55, { dir: 1, look: -.4 }); ctx.restore(); }
  // the skin below the split (soft, translucent, a faint sheen)
  const low = new Path2D(); skin(low, 0, cutH);
  ctx.fillStyle = rgba(FROST.body, .13); ctx.fill(low); ctx.strokeStyle = rgba(FROST.core, .5); ctx.lineWidth = Math.max(1.2, s * .008); ctx.stroke(low);
  // the two top flaps: closed they make the dome; hatching they fold outward about the split
  const up = rise(hatch);
  for (const side of [-1, 1]) {
    const f = new Path2D(); skin(f, cutH - .01, 1, side);
    ctx.save(); ctx.translate(side * prof(cutH) * .9, -cutH * s); ctx.rotate(side * 1.15 * up); ctx.scale(1 - .25 * up, 1 - .25 * up); ctx.translate(-side * prof(cutH) * .9, cutH * s);
    ctx.fillStyle = rgba(FROST.body, .13); ctx.fill(f); ctx.strokeStyle = rgba(FROST.core, .5); ctx.lineWidth = Math.max(1.2, s * .008); ctx.stroke(f);
    ctx.restore();
  }
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(FROST.core, .3 * (1 - up)); ctx.lineWidth = s * .025; ctx.beginPath(); ctx.arc(-w * .25, -s * .58, s * .24, Math.PI * 1.08, Math.PI * 1.36); ctx.stroke(); ctx.restore();
  // the printed cup that holds the skin: solid, layered, with an open lattice
  const cupH = .42, cup = new Path2D(); const cw = (hh) => prof(hh) * 1.06 + s * .015;
  for (let k = 0; k <= 20; k++) { const hh = cupH * k / 20; (k ? cup.lineTo(-cw(hh), -hh * s) : cup.moveTo(-cw(hh), -hh * s)); }
  for (let k = 20; k >= 0; k--) { const hh = cupH * k / 20; cup.lineTo(cw(hh), -hh * s); }
  cup.closePath();
  ctx.save(); ctx.clip(cup);
  ctx.fillStyle = lin(ctx, -w, 0, w, 0, [[0, mixHex('#d8d2c4', P.night1, .35)], [.45, mixHex('#e8e2d2', LAMP.core, .2)], [1, mixHex('#b7b0a0', P.night1, .5)]]); ctx.fillRect(-w * 1.3, -s, w * 2.6, s * 1.1);
  ctx.fillStyle = rgba(P.night0, .16); for (let yy = -s * .02; yy > -s * cupH; yy -= s * .028) ctx.fillRect(-w * 1.3, yy, w * 2.6, 1.1);   // the printer's layers
  ctx.fillStyle = rgba(mixHex(P.night1, LAMP.deep, .3), .55);   // the lattice windows (the skin shows through)
  for (let r2 = 0; r2 < 2; r2++) for (let k = -3; k <= 3; k++) { const cx = k * w * .3 + (r2 % 2) * w * .15, cy = -s * (.12 + r2 * .15); ctx.beginPath(); for (let q = 0; q < 6; q++) { const an = q / 6 * TAU + TAU / 12; ctx.lineTo(cx + Math.cos(an) * s * .045, cy + Math.sin(an) * s * .045); } ctx.closePath(); ctx.fill(); }
  ctx.restore();
  ctx.fillStyle = rgba(mixHex('#f2ede0', LAMP.core, .3), .9); ctx.beginPath(); ctx.ellipse(0, -cupH * s, cw(cupH), s * .03, 0, 0, TAU); ctx.fill();   // the cup's rim
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- the old tooth
export function tooth(ctx, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= a;
  const p = new Path2D();
  p.moveTo(-.18, .0); p.bezierCurveTo(-.2, -.3, -.12, -.62, .0, -1.0); p.bezierCurveTo(.1, -.62, .2, -.3, .18, .0);   // the crown
  p.bezierCurveTo(.16, .25, .1, .6, .02, .9); p.bezierCurveTo(-.06, .6, -.16, .25, -.18, .0); p.closePath();       // the root
  if (o.glow) halo(ctx, 0, -.2, 1.6, .35 * o.glow, GOLD.halo, GOLD.core);
  ctx.fillStyle = lin(ctx, -.2, -1, .2, .9, [[0, '#efe5cc'], [.45, '#cdbd98'], [1, '#7d6a4c']]); ctx.fill(p);
  ctx.strokeStyle = rgba(P.cream, .6); ctx.lineWidth = .02; ctx.stroke(p);
  ctx.fillStyle = rgba(P.night0, .25); ctx.fillRect(-.18, -.02, .36, .04);
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- the gate in the fence
// The gate is the fence section between POSTS[G0] and POSTS[G0 + 1] (right of you). It swings on the left post, away from you.
export const G0 = 26;
const GP = () => [S.POSTS[G0], S.POSTS[G0 + 1]];
const WOOD = mixHex(P.night1, '#4a3530', .6), WOODLIT = mixHex(WOOD, mixHex(P.blue1, '#8a6a58', .4), .45);
const quad = (ctx, q) => { ctx.beginPath(); q.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); };
export function gateGeo(open) {
  const [A, B] = GP(), dx = B.x - A.x, dz = B.z - A.z, L = Math.hypot(dx, dz), ux = dx / L, uz = dz / L, nx = -uz, nz = ux, th = open * .95;
  const vx = Math.cos(th) * ux + Math.sin(th) * nx, vz = Math.cos(th) * uz + Math.sin(th) * nz;
  const h0 = A.w / 2 + 2, h1 = L - B.w / 2 - 4;
  return { A, B, L, at: (d, Y) => [A.x + vx * d, Y, A.z + vz * d], h0, h1 };
}
// screen quad of the rails between the two posts (what the patch replaces)
function railQuad(c) {
  const [A, B] = GP(); const p = (x, Y, z) => S.proj(c, x, Y, z - 8);
  const a0 = p(A.x + A.w / 2, 132, A.z), a1 = p(A.x + A.w / 2, 36, A.z), b0 = p(B.x - B.w / 2, 132, B.z), b1 = p(B.x - B.w / 2, 36, B.z);
  return a0 && a1 && b0 && b1 ? [a0, b0, b1, a1] : null;
}
const PATCH = createCanvas(W, H), PX = PATCH.getContext('2d');
// st = the same world state the main pass used (the patch is the same world without the fence and the people)
export function gatePatch(ctx, c, t, st) {
  const q = railQuad(c); if (!q) return;
  const xs = q.map((p) => p[0]); if (Math.max(...xs) < -20 || Math.min(...xs) > W + 20) return;
  PX.save(); PX.setTransform(1, 0, 0, 1, 0, 0); PX.globalAlpha = 1; PX.globalCompositeOperation = 'source-over';
  S.fenceWorld(PX, c, t, { ...st, fence: 0, you: false, child: false, bird: false, extra: null });
  PX.restore();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); quad(ctx, q.map((p) => [p[0] + (p === q[0] || p === q[3] ? -1 : 1), p[1]])); ctx.clip(); ctx.drawImage(PATCH, 0, 0); ctx.restore();
}
export function gatePanel(ctx, c, t, open) {
  const g = gateGeo(open), P2 = (d, Y) => S.proj(c, ...g.at(d, Y));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const bar = (d0, d1, y0, y1, col) => { const a = P2(d0, y1), b = P2(d1, y1), cc = P2(d1, y0), d = P2(d0, y0); if (!a || !b || !cc || !d) return; ctx.fillStyle = col; quad(ctx, [a, b, cc, d]); ctx.fill(); };
  // rails (like the fence's), the two stiles, a brace; snow on the top edges
  for (const [y0, th] of [[44, 17], [104, 17]]) { bar(g.h0, g.h1, y0, y0 + th, lin(ctx, 0, (P2(g.h0, y0 + th) || [0, 0])[1], 0, (P2(g.h0, y0) || [0, 1])[1], [[0, WOODLIT], [1, WOOD]])); bar(g.h0, g.h1, y0 + th, y0 + th + 5, rgba(mixHex(SNOW.lit, P.cream, .3), .85)); }
  bar(g.h0, g.h0 + 14, 30, 132, WOOD); bar(g.h1 - 14, g.h1, 30, 132, WOODLIT); bar(g.h1 - 14, g.h1, 132, 137, rgba(mixHex(SNOW.lit, P.cream, .3), .85));
  const a = P2(g.h0 + 10, 56), b = P2(g.h1 - 12, 110), a2 = P2(g.h0 + 10, 66), b2 = P2(g.h1 - 12, 120);
  if (a && b && a2 && b2) { ctx.fillStyle = WOOD; quad(ctx, [a2, b2, b, a]); ctx.fill(); }
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- the horizon: island, pyramids
// island(ctx, t, x, y = horizon y, s = width px, u 0..1 rises out of the horizon). Returns the top point (for a label).
export function island(ctx, t, x, y, s, u) {
  if (u <= 0) return null;
  const hh = s * .09 * rise(u);
  ctx.save(); ctx.beginPath(); ctx.rect(x - s, y - s, s * 2, s + 1); ctx.clip();
  ctx.fillStyle = mixHex(P.night0, P.ind1, .45);
  ctx.beginPath(); ctx.moveTo(x - s * .5, y + 2);
  for (let k = 0; k <= 24; k++) { const v = k / 24, hgt = Math.sin(Math.PI * v) ** .7 * (1 + .25 * Math.sin(v * 17 + 2) + .15 * Math.sin(v * 41)); ctx.lineTo(x - s * .5 + s * v, y + 2 - hh * hgt); }
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(FROST.body, .55); ctx.beginPath(); ctx.moveTo(x - s * .36, y + 2 - hh * .7);   // snow on the island's crest
  for (let k = 0; k <= 12; k++) { const v = .14 + .6 * k / 12, hgt = Math.sin(Math.PI * v) ** .7 * (1 + .25 * Math.sin(v * 17 + 2) + .15 * Math.sin(v * 41)); ctx.lineTo(x - s * .5 + s * v, y + 2 - hh * hgt); }
  ctx.lineTo(x + s * .24, y + 2 - hh * .8); ctx.closePath(); ctx.fill();
  ctx.restore();
  return [x, y - hh];
}
export function pyramids(ctx, x, y, s, u) {
  if (u <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.rect(x - s * 2, y - s * 2, s * 4, s * 2 + 1); ctx.clip();
  const dy = (1 - rise(u)) * s * .8;
  for (const [ox, k] of [[-.9, .7], [0, 1], [.75, .55]]) {
    const hw = s * .5 * k, hh = s * .62 * k, bx = x + ox * s;
    ctx.fillStyle = mixHex(P.night0, P.ind1, .55); ctx.beginPath(); ctx.moveTo(bx - hw, y + 2 + dy); ctx.lineTo(bx, y + 2 - hh + dy); ctx.lineTo(bx + hw, y + 2 + dy); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(mixHex(P.blue1, LAMP.body, .25), .45); ctx.beginPath(); ctx.moveTo(bx, y + 2 - hh + dy); ctx.lineTo(bx + hw, y + 2 + dy); ctx.lineTo(bx + hw * .35, y + 2 + dy); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- the frost (ice closing over)
// a night frost sprite, made once: cold blue-grey with feathered crystals. frostMask draws it OUTSIDE the circle (cx, cy, r) (r = 0: all frost)
const FROST_SPR = (() => {
  const w = 960, h = 540, cv = createCanvas(w, h), g = cv.getContext('2d'), r = prng(2931);
  const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, mixHex(FROST.deep, P.night0, .35)); gr.addColorStop(.5, mixHex(FROST.deep, FROST.shade, .3)); gr.addColorStop(1, mixHex(FROST.deep, P.night0, .3));
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.lineCap = 'round';
  for (let k = 0; k < 60; k++) {   // feather crystals: a stem with short barbs
    let x = r() * w, y = r() * h, a = r() * TAU; const L = 40 + r() * 120;
    g.strokeStyle = `rgba(232,240,244,${(.12 + r() * .22).toFixed(3)})`; g.lineWidth = .7 + r() * 1.1;
    for (let s = 0; s < L; s += 6) {
      const nx = x + Math.cos(a) * 6, ny = y + Math.sin(a) * 6; g.beginPath(); g.moveTo(x, y); g.lineTo(nx, ny); g.stroke();
      const bl = (1 - s / L) * 10 * (.5 + r()); for (const sg of [-1, 1]) { const ba = a + sg * .9; g.beginPath(); g.moveTo(nx, ny); g.lineTo(nx + Math.cos(ba) * bl, ny + Math.sin(ba) * bl); g.stroke(); }
      x = nx; y = ny; a += (r() - .5) * .25;
    }
  }
  for (let k = 0; k < 2200; k++) { g.fillStyle = `rgba(240,246,248,${(r() * .18).toFixed(3)})`; g.fillRect(r() * w, r() * h, 1, 1); }
  return cv;
})();
export function frostMask(ctx, t, cx, cy, r) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.beginPath(); ctx.rect(0, 0, W, H); if (r > 0) { ctx.moveTo(cx + r, cy); ctx.arc(cx, cy, r, 0, TAU, true); } ctx.clip();
  ctx.drawImage(FROST_SPR, 0, 0, W, H);
  ctx.restore();
  if (r > 0) {   // the frost front: a cold bright rim
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = rgba(FROST.core, .22); ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(cx, cy, r + 4, 0, TAU); ctx.stroke();
    ctx.strokeStyle = rgba(FROST.core, .4); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke();
    ctx.restore();
  }
}
