// Film 20 · B1 (c02–c04) · objects of the riddles, drawn in the style of lib/f20_kit.mjs (owned by B1; the lead may lift any of these
// into the kit). Everything is a flat shape of light or a line of light; sizes are in the caller's space (bench units or screen px).
//   cell(ctx, t, x, y, r, o)          a cell with a membrane and a nucleus. o: { shape 0 (grown: long, with processes) … 1 (round stem cell),
//                                     lump 0..1 (a lumpy cluster: tumour), warm 0..1 (younger), cool 0..1 (gray), nerve 0..1 (nerve stem
//                                     processes), blood 0..1 (a small round blood cell), u 0..1 (rises / grows), a, seed }
//   outline(ctx, pts, u0, u1, o)      a smooth line of light through pts (catmull), drawn from u0 to u1 (kit trailSpan)
//   GRANNY / FETUS                    the two nested outlines of 2.05 (normalised: x right, y up, feet at 0, height 1)
//   dnaGauge(ctx, t, x, y, w, o)      a DNA twist lying across (length w) with an age dial clamped on it (the epigenetic clock).
//                                     o: { u (unspools from the middle), marks 0..1, read (years 0..100), dial 0..1, sweep (0..1 | null:
//                                     a cool reading light running along), wobble 0..1 (the needle's uncertainty band), a, ink }
//   pressGauge(ctx, t, x, y, w, o)    TOO LITTLE · WINDOW · TOO MUCH; o: { u, v (pointer 0..1), lit (window light 0..1) }
//   sharpBar(ctx, t, x, y, h, o)      a vertical bar: o: { u, full 1, lost (fallen level), v (current level) }
//   mouse(ctx, t, x, y, L, o)         a lab mouse in profile (nose right when dir 1), o: { dir, step (phase when it scurries), a }
//   dish(ctx, t, x, y, r, o)          a petri dish lying on the tabletop (seen from just above)
//   slip(ctx, x, y, h, o)             THE BILL: a small slip of light (zig-zag foot, three written lines u 0..1), o: { u, fold 0..1, a }
//   board(ctx, t, o)                  THE SWITCHBOARD: a dark plate with a grid of sockets, some holding protein mixes; drawn in the
//                                     plate's own units (call it inside stand()); o: { n (grown sockets 0..1), sweep, gold, cand, … }
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f20_kit.mjs';
const { P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, halo, rad, lin, prng } = E;
const { COOL, INK } = F;

// ---------------------------------------------------------------------------------------------------------------------- cell
const CELL_SEED = (() => { const r = prng(4242); return Array.from({ length: 8 }, () => [r() * 6.283, .4 + r() * .6, r()]); })();
const LUMPS = (() => { const r = prng(778); return Array.from({ length: 9 }, (_, i) => { const a = i / 9 * 6.283 + r() * .5, d = .45 + r() * .55; return [Math.cos(a) * d, Math.sin(a) * d * .8, .42 + r() * .22, r()]; }); })();
export function cell(ctx, t, x, y, r, o = {}) {
  const u = clamp(o.u ?? 1), a = (o.a ?? 1); if (u <= 0 || a <= 0) return;
  const shape = clamp(o.shape ?? 0), lump = clamp(o.lump ?? 0), warm = clamp(o.warm ?? 0), cool = clamp(o.cool ?? 0), nerve = clamp(o.nerve ?? 0), blood = clamp(o.blood ?? 0);
  const R = r * lerp(.3, 1, expoOut(u)) * (1 + .018 * Math.sin(t * 1.3 + x * .01));
  const el = (1 - shape) * (1 - blood);
  const rr = (th) => {
    let k = 1 + .42 * el * Math.cos(2 * (th - .35)) + .025 * Math.sin(5 * th + t * .7);
    for (let i = 0; i < 3; i++) { const [p0, amp] = CELL_SEED[i], d = Math.atan2(Math.sin(th - p0), Math.cos(th - p0)); k += .55 * el * amp * Math.exp(-(d * d) / .05); }
    for (let i = 0; i < 4; i++) { const p0 = i * 1.571 + .4 + .1 * Math.sin(t * .4 + i), d = Math.atan2(Math.sin(th - p0), Math.cos(th - p0)); k += 1.1 * nerve * Math.exp(-(d * d) / .012) * (.7 + .3 * CELL_SEED[i + 3][1]); }
    return k * lerp(1, .62, blood);
  };
  const path = new Path2D(); const N = 96;
  for (let i = 0; i <= N; i++) { const th = i / N * 6.283, k = rr(th); const px = x + Math.cos(th) * R * k * 1.08, py = y + Math.sin(th) * R * k * .82; i ? path.lineTo(px, py) : path.moveTo(px, py); }
  path.closePath();
  const gray = mixHex(P.blue2, '#9aa3b8', .55);
  const body0 = mixHex(mixHex(mixHex(P.blue2, P.halo1, .55), P.core1, warm * .85), gray, cool);
  const body1 = mixHex(mixHex(P.ind2, P.shade0, .25 + .55 * warm), mixHex(P.ind2, gray, .5), cool);
  const rim = mixHex(mixHex(P.halo1, P.core0, warm), COOL.mid, cool);
  ctx.save(); ctx.globalAlpha *= a * clamp(u * 3);
  // the tumour: a lumpy cluster growing round the cell (behind it), cool gray
  if (lump > 0) for (const [lx, ly, lr, s] of LUMPS) {
    const q = clamp(lump * 1.6 - s * .6); if (q <= 0) continue;
    const cx = x + lx * R * 1.15 * expoOut(q), cy = y + ly * R * 1.15 * expoOut(q), cr = R * lr * expoOut(q);
    ctx.fillStyle = rad(ctx, cx - cr * .3, cy - cr * .3, cr * 1.3, [[0, mixHex(gray, P.cream, .25)], [1, mixHex(P.ind2, gray, .4)]]); ctx.beginPath(); ctx.arc(cx, cy, cr, 0, 6.29); ctx.fill();
    ctx.strokeStyle = rgba(COOL.mid, .7); ctx.lineWidth = Math.max(1, R * .03); ctx.stroke();
    ctx.fillStyle = rgba(P.night1, .55); ctx.beginPath(); ctx.arc(cx + cr * .1, cy + cr * .05, cr * .3, 0, 6.29); ctx.fill();
  }
  halo(ctx, x, y, R * 2.2, (.18 + .4 * warm) * (1 - cool * .7), P.halo0, P.core1);
  ctx.fillStyle = rad(ctx, x - R * .3, y - R * .35, R * 1.5, [[0, body0], [1, body1]]); ctx.fill(path);
  ctx.strokeStyle = rgba(rim, .85); ctx.lineWidth = Math.max(1.2, R * .045); ctx.stroke(path);
  // inner membrane line (a second, thinner contour: the cell has a body, not a blob)
  ctx.save(); ctx.clip(path); ctx.strokeStyle = rgba(P.core0, .18 + .2 * warm); ctx.lineWidth = Math.max(1, R * .12); ctx.stroke(path); ctx.restore();
  // the nucleus (a darker body, bigger in a stem cell) and its nucleolus
  const nr = R * lerp(.32, .46, shape) * lerp(1, .0, blood), nx = x + R * .08 * el, ny = y - R * .02;
  if (nr > .5) {
    ctx.fillStyle = rad(ctx, nx - nr * .3, ny - nr * .3, nr * 1.4, [[0, mixHex(mixHex(P.blue1, P.shade0, warm * .7), gray, cool)], [1, mixHex(P.night1, P.ind2, .5)]]);
    ctx.beginPath(); ctx.ellipse(nx, ny, nr * 1.1, nr * .9, .3, 0, 6.29); ctx.fill();
    ctx.strokeStyle = rgba(mixHex(P.halo1, COOL.mid, cool), .5); ctx.lineWidth = Math.max(1, R * .02); ctx.stroke();
    ctx.fillStyle = rgba(mixHex(P.core1, COOL.core, cool), .75); ctx.beginPath(); ctx.arc(nx + nr * .3, ny - nr * .2, nr * .2, 0, 6.29); ctx.fill();
  }
  if (blood > 0) {   // a blood cell: a pale dimple in the middle
    ctx.fillStyle = rgba(P.night1, .35 * blood); ctx.beginPath(); ctx.ellipse(x, y, R * .3, R * .22, 0, 0, 6.29); ctx.fill();
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------------- outlines
// 2.05: the grandmother (standing, side view, facing right, expecting) and the unborn mother curled inside her. Normalised units.
export const GRANNY = [
  [-.07, 0], [-.06, .12], [-.075, .26], [-.095, .4], [-.105, .5], [-.09, .58], [-.085, .66], [-.095, .74], [-.08, .8], [-.05, .835], [-.045, .855],
  [-.075, .88], [-.085, .925], [-.06, .965], [-.015, .995], [.035, .99], [.065, .955], [.075, .925], [.088, .9], [.07, .885], [.068, .865], [.045, .85],
  [.04, .83], [.07, .8], [.085, .75], [.075, .7], [.11, .65], [.155, .58], [.165, .52], [.14, .45], [.08, .4], [.07, .3], [.06, .15], [.085, .03], [.12, 0]];
export const GRANNY_ARM = [[-.02, .8], [-.02, .7], [.02, .6], [.1, .55], [.13, .53]];
export const FETUS = [   // a curled unborn child: head (top right), back curving left and down, knees drawn up to the head
  [.32, .55], [.5, .78], [.38, .98], [.12, 1], [-.12, .9], [-.32, .66], [-.42, .32], [-.3, .02], [0, -.08], [.28, .02], [.36, .2], [.2, .32], [.05, .3], [.12, .48], [.32, .55]];
export function outline(ctx, pts, u0, u1, o = {}) {
  if (u1 <= u0) return null;
  const sm = E.catmull(pts, 6);
  return F.trailSpan(ctx, sm, u0, u1, { w: o.w ?? 3, spark: o.spark ?? (u1 < 1), a: o.a ?? 1 });
}
export const mapPts = (pts, x, y, h) => pts.map(([u, v]) => [x + u * h, y - v * h]);

// ---------------------------------------------------------------------------------------------------------------------- the epigenetic clock
const MARKS = (() => { const r = prng(353); return Array.from({ length: 18 }, (_, i) => [(i + .5) / 18 + (r() - .5) * .03, r() < .5 ? 0 : 1, r()]); })();
export function dnaGauge(ctx, t, x, y, w, o = {}) {
  const u = clamp(o.u ?? 1), a = o.a ?? 1; if (u <= 0 || a <= 0) return null;
  const amp = w * .055, half = w / 2 * expoOut(u), turns = 5.5, ph = t * .5;
  ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round';
  const yAt = (xx, s) => y + s * Math.sin((xx - x) / w * turns * 6.283 + ph) * amp;
  // rungs, then the two strands (the back strand darker)
  ctx.strokeStyle = rgba(P.blue2, .8); ctx.lineWidth = Math.max(1, w * .004);
  for (let k = -24; k <= 24; k++) { const xx = x + k / 24 * w / 2; if (Math.abs(xx - x) > half) continue; ctx.beginPath(); ctx.moveTo(xx, yAt(xx, 1)); ctx.lineTo(xx, yAt(xx, -1)); ctx.stroke(); }
  for (const [s, col, lw] of [[-1, mixHex(P.blue1, P.halo1, .35), .009], [1, mixHex(P.halo1, P.core1, .4), .011]]) {
    ctx.strokeStyle = col; ctx.lineWidth = Math.max(1.2, w * lw); ctx.beginPath();
    for (let k = 0; k <= 120; k++) { const xx = x - half + k / 120 * half * 2, yy = yAt(xx, s); k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
    ctx.stroke();
  }
  // the marks on the DNA: small flags of light sitting on the strands (the clock reads them)
  const mk = clamp(o.marks ?? 0), sw = o.sweep;
  if (mk > 0) for (const [p, s, d] of MARKS) {
    const q = clamp(mk * 1.8 - d * .8); if (q <= 0) continue;
    const xx = x - w / 2 + p * w; if (Math.abs(xx - x) > half) continue;
    const yy = yAt(xx, s ? 1 : -1), hgt = w * .03 * expoOut(q);
    const read = sw != null ? Math.exp(-(((p - sw) * 9) ** 2)) : 0;
    const col = mixHex(P.core1, COOL.core, read);
    ctx.strokeStyle = rgba(col, .9); ctx.lineWidth = Math.max(1, w * .004); ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx, yy - hgt); ctx.stroke();
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(xx, yy - hgt, w * .007 * (1 + .6 * read), 0, 6.29); ctx.fill();
    if (read > .3) halo(ctx, xx, yy - hgt, w * .03, .5 * read, COOL.mid, COOL.core);
  }
  // the cool reading light (a narrow band running along the strand)
  if (sw != null && sw > -.1 && sw < 1.1) { const sx = x - w / 2 + sw * w; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, sx - w * .06, 0, sx + w * .06, 0, [[0, rgba(COOL.mid, 0)], [.5, rgba(COOL.mid, .28)], [1, rgba(COOL.mid, 0)]]); ctx.fillRect(sx - w * .06, y - amp * 2.5, w * .12, amp * 5); ctx.restore(); }
  // the dial clamped on the strand in the middle
  const dl = clamp(o.dial ?? 1), out = { dial: null };
  if (dl > 0) {
    const R = w * .12, cx = x, cy = y - amp * 1.6 - R * 1.25 - (1 - expoOut(dl)) * R * .6;
    ctx.globalAlpha *= clamp(dl * 2);
    ctx.fillStyle = mixHex(P.night1, P.shade0, .45); ctx.fillRect(cx - R * .08, cy + R * .9, R * .16, y - cy - R * .9 + amp * 1.2);   // the clamp
    ctx.fillRect(cx - R * .3, y + amp * 1.05, R * .6, R * .12);
    halo(ctx, cx, cy, R * 2, .25, P.halo0, P.core1);
    ctx.fillStyle = rad(ctx, cx - R * .3, cy - R * .3, R * 1.3, [[0, P.core0], [.6, P.core1], [1, P.halo1]]); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.29); ctx.fill();
    ctx.strokeStyle = mixHex(P.night1, P.shade0, .5); ctx.lineWidth = R * .07; ctx.stroke();
    const ang = (v) => -Math.PI * 1.17 + clamp(v / 100) * Math.PI * 1.34;   // 0 years lower left … 100 lower right, over the top
    ctx.strokeStyle = rgba(INK, .85);
    for (let k = 0; k <= 10; k++) { const an = ang(k * 10), r0 = R * (k % 5 ? .8 : .7); ctx.lineWidth = R * (k % 5 ? .025 : .045); ctx.beginPath(); ctx.moveTo(cx + Math.cos(an) * r0, cy + Math.sin(an) * r0); ctx.lineTo(cx + Math.cos(an) * R * .9, cy + Math.sin(an) * R * .9); ctx.stroke(); }
    ctx.fillStyle = rgba(INK, .85); ctx.font = `${R * .26}px "Instrument Serif"`; ctx.textAlign = 'center';
    for (const v of [0, 50, 100]) { const an = ang(v); ctx.fillText(String(v), cx + Math.cos(an) * R * .5, cy + Math.sin(an) * R * .5 + R * .09); }
    ctx.font = `600 ${R * .15}px Inter`; ctx.letterSpacing = `${R * .02}px`; ctx.fillText('YEARS', cx, cy + R * .62); ctx.letterSpacing = '0px';
    // the wobble band: the needle's uncertainty (an estimate)
    const wb = clamp(o.wobble ?? 0), read = o.read ?? 30;
    if (wb > 0) {
      const a0 = ang(read - 11 * expoOut(wb)), a1 = ang(read + 11 * expoOut(wb));
      ctx.fillStyle = rgba(COOL.edge, .32 * clamp(wb * 2)); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R * .86, a0, a1); ctx.closePath(); ctx.fill();
      ctx.save(); ctx.setLineDash([R * .06, R * .05]); ctx.strokeStyle = rgba(COOL.deep, .8 * clamp(wb * 2)); ctx.lineWidth = R * .02;
      for (const an of [a0, a1]) { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(an) * R * .86, cy + Math.sin(an) * R * .86); ctx.stroke(); }
      ctx.restore();
    }
    const an = ang(read + wb * 4.5 * Math.sin(t * 5.3) * Math.sin(t * 1.7 + 1));
    ctx.strokeStyle = mixHex(P.night1, INK, .5); ctx.lineWidth = R * .06; ctx.beginPath(); ctx.moveTo(cx - Math.cos(an) * R * .14, cy - Math.sin(an) * R * .14); ctx.lineTo(cx + Math.cos(an) * R * .8, cy + Math.sin(an) * R * .8); ctx.stroke();
    ctx.fillStyle = mixHex(P.night1, P.shade0, .4); ctx.beginPath(); ctx.arc(cx, cy, R * .09, 0, 6.29); ctx.fill();
    out.dial = [cx, cy, R];
  }
  ctx.restore();
  return out;
}

// ---------------------------------------------------------------------------------------------------------------------- press gauge
export function pressGauge(ctx, t, x, y, w, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const h = w * .1, k = expoOut(u), lit = clamp(o.lit ?? 0), w0 = .38, w1 = .62;
  ctx.save(); ctx.globalAlpha *= clamp(u * 2);
  const p = new Path2D(); p.roundRect(x, y - h / 2, w * k, h, h / 2);
  ctx.fillStyle = rgba(P.night1, .9); ctx.fill(p); ctx.strokeStyle = rgba(P.halo1, .55); ctx.lineWidth = Math.max(1, h * .06); ctx.stroke(p);
  // the window (lit) between too little and too much
  if (k > w0) { const ww = (Math.min(k, w1) - w0) * w; ctx.fillStyle = rgba(mixHex(P.ind2, P.halo0, lit), .35 + .6 * lit); ctx.fillRect(x + w0 * w, y - h / 2 + h * .12, ww, h * .76); if (lit > 0) halo(ctx, x + (w0 + w1) / 2 * w, y, w * .22, .45 * lit, P.halo0, P.core1); }
  ctx.strokeStyle = rgba(P.halo2, .6); ctx.lineWidth = Math.max(1, h * .05);
  for (const v of [w0, w1]) if (k > v) { ctx.beginPath(); ctx.moveTo(x + v * w, y - h * .7); ctx.lineTo(x + v * w, y + h * .7); ctx.stroke(); }
  // the pointer (a small triangle of light above the bar)
  const pv = o.v ?? 0;
  if (u > .6) { const px = x + clamp(pv) * w, py = y - h * .75; ctx.fillStyle = P.core1; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - h * .45, py - h * .7); ctx.lineTo(px + h * .45, py - h * .7); ctx.closePath(); ctx.fill(); halo(ctx, px, py - h * .3, h * 1.4, .5, P.halo0, P.core0); }
  ctx.restore();
  return { win: [x + (w0 + w1) / 2 * w, y], x0: x, x1: x + w, h };
}

// ---------------------------------------------------------------------------------------------------------------------- sharpness bar
export function sharpBar(ctx, t, x, y, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const w = h * .16, k = expoOut(u), lost = o.lost ?? .25, v = o.v ?? lost;
  ctx.save(); ctx.globalAlpha *= clamp(u * 2);
  const fr = new Path2D(); fr.roundRect(x - w / 2, y - h * k, w, h * k, w * .2);
  ctx.fillStyle = rgba(P.night1, .9); ctx.fill(fr); ctx.strokeStyle = rgba(P.halo1, .5); ctx.lineWidth = Math.max(1, w * .06); ctx.stroke(fr);
  // the level (gold) and the part won back (brighter)
  const lv = h * k * clamp(v);
  ctx.fillStyle = lin(ctx, 0, y, 0, y - h, [[0, P.shade0], [1, P.core1]]); ctx.fillRect(x - w / 2 + w * .14, y - lv, w * .72, lv);
  if (v > lost) { halo(ctx, x, y - lv, w * 1.8, .55, P.halo0, P.core0); }
  // the old level before the damage (dashed) and where it had fallen (thin)
  ctx.save(); ctx.setLineDash([w * .2, w * .14]); ctx.strokeStyle = rgba(P.cream, .85); ctx.lineWidth = Math.max(1.2, w * .05);
  ctx.beginPath(); ctx.moveTo(x - w * .9, y - h * k * .96); ctx.lineTo(x + w * .9, y - h * k * .96); ctx.stroke(); ctx.restore();
  ctx.strokeStyle = rgba(COOL.mid, .9); ctx.lineWidth = Math.max(1, w * .04); ctx.beginPath(); ctx.moveTo(x - w * .9, y - h * k * lost); ctx.lineTo(x + w * .9, y - h * k * lost); ctx.stroke();
  ctx.restore();
  return { top: [x, y - h * .96], lost: [x, y - h * lost], now: [x, y - lv], w };
}

// ---------------------------------------------------------------------------------------------------------------------- mouse
export function mouse(ctx, t, x, y, L, o = {}) {
  const a = o.a ?? 1, dir = o.dir ?? 1, st = o.step; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(dir * L, L);
  const bob = st != null ? Math.abs(Math.sin(st)) * .02 : .006 * Math.sin(t * 2.2), sn = .01 * Math.sin(t * 9);
  ctx.fillStyle = rgba(P.night0, .55); ctx.beginPath(); ctx.ellipse(0, 0, .45, .035, 0, 0, 6.29); ctx.fill();
  // tail: a long curve to the back
  ctx.strokeStyle = mixHex(P.blue1, P.halo1, .35); ctx.lineWidth = .025; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-.38, -.1); ctx.bezierCurveTo(-.6, -.05, -.72, -.02, -.82, -.12 + .03 * Math.sin(t * 1.4)); ctx.stroke();
  // feet
  ctx.fillStyle = mixHex(P.shade0, P.night1, .3);
  for (const [fx, ph] of [[-.22, 0], [.18, Math.PI]]) { const sw = st != null ? Math.sin(st + ph) * .05 : 0; ctx.beginPath(); ctx.ellipse(fx + sw, -.012, .05, .018, 0, 0, 6.29); ctx.fill(); }
  // body: a rounded teardrop, head to the right, ear, eye, whiskers
  const b = new Path2D();
  b.moveTo(-.4, -.03 - bob); b.bezierCurveTo(-.44, -.28 - bob, -.18, -.42 - bob, .05, -.36 - bob); b.bezierCurveTo(.2, -.33 - bob, .3, -.25 - bob, .42, -.12 - bob + sn);
  b.quadraticCurveTo(.47, -.07 - bob + sn, .42, -.05 - bob); b.bezierCurveTo(.3, -.02 - bob, .1, -.02 - bob, -.4, -.03 - bob); b.closePath();
  ctx.fillStyle = lin(ctx, -.4, 0, .45, 0, [[0, mixHex(P.ind2, P.blue1, .4)], [.6, mixHex(P.blue1, P.halo1, .35)], [1, mixHex(P.halo1, P.core1, .3)]]); ctx.fill(b);
  ctx.strokeStyle = rgba(P.halo1, .7); ctx.lineWidth = .014; ctx.stroke(b);
  ctx.fillStyle = mixHex(P.blue1, P.halo1, .5); ctx.beginPath(); ctx.ellipse(.17, -.36 - bob, .07, .085, -.3, 0, 6.29); ctx.fill();
  ctx.fillStyle = rgba(P.shade0, .7); ctx.beginPath(); ctx.ellipse(.17, -.355 - bob, .04, .05, -.3, 0, 6.29); ctx.fill();
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(.3, -.2 - bob, .022, 0, 6.29); ctx.fill();
  ctx.fillStyle = P.core1; ctx.beginPath(); ctx.arc(.445, -.085 - bob + sn, .018, 0, 6.29); ctx.fill();
  ctx.strokeStyle = rgba(P.cream, .5); ctx.lineWidth = .007;
  for (const d of [-.04, 0, .04]) { ctx.beginPath(); ctx.moveTo(.43, -.09 - bob + sn); ctx.lineTo(.56, -.1 + d * 1.5 - bob + sn); ctx.stroke(); }
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------------- dish
export function dish(ctx, t, x, y, r, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const k = expoOut(u), ry = r * .28, R = r * k;
  ctx.save(); ctx.globalAlpha *= clamp(u * 2.5);
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.ellipse(x, y + ry * .25, R * 1.04, ry * k * 1.04, 0, 0, 6.29); ctx.fill();
  ctx.fillStyle = rgba(mixHex(P.blue1, P.halo2, .2), .45); ctx.beginPath(); ctx.ellipse(x, y, R, ry * k, 0, 0, 6.29); ctx.fill();
  ctx.strokeStyle = rgba(P.halo2, .8); ctx.lineWidth = Math.max(1.2, r * .025); ctx.stroke();
  ctx.strokeStyle = rgba(P.core0, .45); ctx.lineWidth = Math.max(1, r * .012); ctx.beginPath(); ctx.ellipse(x, y - r * .05, R * .97, ry * k * .9, 0, Math.PI * 1.05, Math.PI * 1.7); ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------------- the bill
export function slip(ctx, x, y, h, o = {}) {
  const a = o.a ?? 1, fold = clamp(o.fold ?? 0), w = h * .66; if (a <= 0 || h <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(1 - .85 * fold, 1 - .92 * fold);
  halo(ctx, 0, -h * .5, h * 1.2, .45 + .5 * fold, P.halo0, P.core0);
  const p = new Path2D(); p.moveTo(-w / 2, -h); p.lineTo(w / 2, -h); p.lineTo(w / 2, -h * .08);
  for (let k = 0; k <= 6; k++) p.lineTo(w / 2 - k * w / 6, k % 2 ? 0 : -h * .08);
  p.closePath();
  ctx.fillStyle = lin(ctx, 0, -h, 0, 0, [[0, P.core0], [1, P.halo1]]); ctx.fill(p);
  const lu = clamp(o.u ?? 1); ctx.strokeStyle = rgba(INK, .8); ctx.lineWidth = Math.max(1, h * .045); ctx.lineCap = 'round';
  [.78, .6, .42].forEach((v, i) => { const q = clamp(lu * 3 - i); if (q <= 0) return; const x0 = -w * .32, x1 = x0 + w * (i === 2 ? .38 : .64) * q; ctx.beginPath(); ctx.moveTo(x0, -h * v); ctx.lineTo(x1, -h * v); ctx.stroke(); });
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------------- the switchboard
// The plate's own units: sockets on a grid (cols × rows, pitch), origin = the bottom-centre socket (0, 0), rows go up (−y).
// o: { n 0..1 (how far the grid has spread out from the origin), sweep (x of the cool reading light in plate units | null),
//      sweep2 (a second light), lit(i) (candidate lit cool), gold 0..1 (the 20+ that worked), plate 0..1 (the dark backing), a }
export const BOARD = { cols: 33, rows: 15, pitch: 300 };
const SOCK = (() => { const r = prng(3000), out = [];
  for (let j = 0; j < BOARD.rows; j++) for (let i = 0; i < BOARD.cols; i++) {
    const x = (i - (BOARD.cols - 1) / 2) * BOARD.pitch, y = -j * BOARD.pitch, d = Math.hypot(x / BOARD.pitch, y / BOARD.pitch * 1.3);
    out.push({ x, y, d, mix: r() < .62 ? [Math.floor(r() * 4), Math.floor(r() * 4), Math.floor(r() * 4)].slice(0, 1 + Math.floor(r() * 3)) : null, c: r(), g: r(), j: r() });
  }
  const dMax = Math.max(...out.map((s) => s.d)); for (const s of out) s.dn = s.d / dMax;
  // the 22 that worked (gold): candidates near the middle of the plate
  const cand = out.filter((s) => s.mix && Math.abs(s.x) < BOARD.pitch * 13 && s.y < -BOARD.pitch * 1.5 && s.y > -BOARD.pitch * 12.5).sort((p, q) => p.g - q.g).slice(0, 22);
  cand.forEach((s, i) => (s.gold = i / 22)); return out; })();
const PCOL = [P.core1, P.halo0, mixHex(P.halo1, P.cream, .5), P.halo2];
export function boardBox(n) {   // the plate around the grown sockets (plate units)
  const e = expoOut(clamp(n)), hw = lerp(BOARD.pitch * 1.2, BOARD.pitch * (BOARD.cols / 2 + .2), e), top = lerp(-BOARD.pitch * 1.1, -BOARD.pitch * (BOARD.rows - .4), e);
  return { x0: -hw, x1: hw, y0: top, y1: BOARD.pitch * .7 };
}
export function board(ctx, t, o = {}) {
  const n = clamp(o.n ?? 1), a = o.a ?? 1, pl = clamp(o.plate ?? 1); if (n <= 0 || a <= 0) return;
  const pitch = BOARD.pitch, rs = pitch * .26;
  ctx.save(); ctx.globalAlpha *= a;
  if (pl > 0) {   // the dark plate behind the sockets (a flat card of night, gold rim)
    const b = boardBox(n), p = new Path2D(); p.roundRect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, pitch * .3);
    ctx.save(); ctx.globalAlpha *= pl;
    ctx.fillStyle = lin(ctx, 0, b.y0, 0, b.y1, [[0, rgba(P.night1, .93)], [1, rgba(mixHex(P.night1, P.ind1, .5), .93)]]); ctx.fill(p);
    ctx.strokeStyle = rgba(P.halo1, .55); ctx.lineWidth = pitch * .03; ctx.stroke(p); ctx.restore();
  }
  const sw = o.sweep, sw2 = o.sweep2, gold = clamp(o.gold ?? 0), cand = o.cand ?? 0, sa = clamp(o.sockA ?? 1);
  if (sa <= 0) { ctx.restore(); return; }
  ctx.globalAlpha *= sa;
  for (const s of SOCK) {
    const q = clamp(n * 1.25 - s.dn * 1.05 - s.j * .04); if (q <= 0) continue;
    const k = expoOut(clamp(q * 3)), x = s.x, y = s.y;
    let cl = 0; for (const w of [sw, sw2]) if (w != null) cl = Math.max(cl, Math.exp(-(((x - w) / (pitch * 1.6)) ** 2)));
    // a candidate stays lit cool after the light has passed it (its turn has been read)
    const seen = sw != null && s.mix && s.c < cand && x < sw ? .55 : 0;
    const g = s.gold != null ? smooth(clamp(gold * 1.4 - s.gold * .4)) : 0;
    ctx.strokeStyle = rgba(mixHex(mixHex(P.blue2, COOL.core, Math.max(cl, seen)), P.core1, g), .55 + .4 * Math.max(cl, g));
    ctx.lineWidth = pitch * (.035 + .03 * g);
    ctx.beginPath(); ctx.ellipse(x, y, rs * k, rs * .62 * k, 0, 0, 6.29); ctx.stroke();
    if (g > 0) halo(ctx, x, y, rs * 3.2, .6 * g, P.halo0, P.core0);
    else if (cl > .15 || seen) halo(ctx, x, y, rs * 2.2, .35 * Math.max(cl, seen), COOL.edge, COOL.core);
    if (s.mix && k > .3) s.mix.forEach((m, mi) => {
      const px = x + (mi - (s.mix.length - 1) / 2) * rs * .62, py = y - rs * .15, pr = rs * (.3 - .03 * s.mix.length) * k;
      ctx.fillStyle = mixHex(mixHex(PCOL[m], COOL.core, Math.max(cl, seen) * .7), P.core0, g * .5);
      ctx.beginPath(); ctx.arc(px, py, pr, 0, 6.29); ctx.fill();
      if (m % 2) { ctx.beginPath(); ctx.arc(px + pr * .6, py - pr * .5, pr * .55, 0, 6.29); ctx.fill(); }
    });
  }
  // the reading light itself (a cool band across the plate)
  for (const w of [sw, sw2]) if (w != null) { const b = boardBox(n); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, w - pitch * 1.4, 0, w + pitch * 1.4, 0, [[0, rgba(COOL.edge, 0)], [.5, rgba(COOL.mid, .2)], [1, rgba(COOL.edge, 0)]]); ctx.fillRect(w - pitch * 1.4, b.y0, pitch * 2.8, b.y1 - b.y0); ctx.restore(); }
  ctx.restore();
}
