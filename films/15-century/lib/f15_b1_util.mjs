// Film 15 · B1 (c03–c06) · shared helpers for the four B1 sets (no kit edits: everything B1 needs beyond the kit lives here).
//   nightBg()      the screen-space night of every B1 set (same radial lift as the seam plates, so set switches and plates match)
//   numBlock()     F.numberBlock with free sizes (cards are often seen at scale < 1: sizes are given in DESIGN px = screen px / s)
//   slip()         a paper slip of light with ink capitals, one or two lines, unfold + write (the strips, the essay tag, the list slip)
//   envelope()     the sealed program: a paper envelope of light, flap folds shut, a gold seal, an empty dashed APPROVED field
//   tile()         a gold letter tile (a picked mark of the tumour text)
//   gateRing()     an upright ring of light (back / front halves, so carriers pass THROUGH it)
//   invCard()      the design point of card Z that lands on a screen point (place far things by where they must appear)
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f15_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, expoOut, rad, lin, halo, glowFill, cardM } = E;

// ---------- the night (screen space). o { cx, cy, r, lift (0..1 extra ind1 in the core), wob } ----------
export function nightBg(ctx, t, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H);
  const cx = o.cx ?? 960, cy = (o.cy ?? 540) + (o.wob ?? 0), r = o.r ?? 1250;
  ctx.fillStyle = rad(ctx, cx, cy, r, [[0, P.ind1], [o.mid ?? .45, P.ind0], [1, P.night0]]); ctx.fillRect(0, 0, W, H);
  if (o.lift > 0) { ctx.fillStyle = rad(ctx, cx, cy, r * .8, [[0, rgba(P.blue0, .35 * o.lift)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(0, 0, W, H); }
  ctx.restore();
}

// ---------- design point of card Z under camera c that shows at screen (sx, sy) ----------
export function invCard(c, Z, sx, sy) { const m = cardM(c, Z); return m ? [(sx - m.e) / m.k, (sy - m.f) / m.k] : [sx, sy]; }

// ---------- explainer block with free sizes ----------
// o { x, y (number baseline), num, label, src, u, size, labelSize, srcSize, align, warm, gap, lines: [label line 2] }
export function numBlock(ctx, o) {
  const u = clamp(o.u ?? 1), size = o.size ?? 132, ls = o.labelSize ?? 34, ss = o.srcSize ?? 22, al = o.align ?? 'left';
  if (u <= 0) return o.y;
  const ly = o.y + (o.gap ?? size * .48) + ls * .5;
  if (o.num != null) F.maskLine(ctx, [[String(o.num), o.warm ?? 0]], o.x, o.y, size, span(u, 0, .55), { align: al });
  let yy = ly;
  const labels = o.label ? (Array.isArray(o.label) ? o.label : [o.label]) : [];
  labels.forEach((s, i) => { F.maskLine(ctx, [[s.toUpperCase(), 0]], o.x, yy, ls, span(u, .2 + i * .08, .75 + i * .08), { serif: false, col: P.cream, glow: false, align: al, weight: 600 }); yy += ls * 1.3; });
  if (o.src) F.maskLine(ctx, [[o.src.toUpperCase(), 0]], o.x, yy + ss * .5 + (labels.length ? ls * .15 : 0), ss, span(u, .4, 1), { serif: false, col: P.halo2, glow: false, align: al, weight: 600 });
  return yy;
}
// one line of label caps (Inter 600, cream) or a source line (halo2), rising from its baseline
export const capsLine = (ctx, s, x, y, size, u, o = {}) => F.maskLine(ctx, [[s.toUpperCase(), o.warm ?? 0]], x, y, size, u, { serif: false, col: o.col ?? P.cream, glow: false, align: o.align ?? 'left', weight: 600 });

// ---------- a paper slip of light. (x, y) = centre. o { lines [s] | s, size (px of the caps), w, h (auto), rot, unfold 0..1, write 0..1,
//            lit 0..1, a, pad, lift (shadow offset: how far it floats above its surface) } ----------
export function slip(ctx, x, y, o = {}) {
  const size = o.size ?? 26, lines = o.lines || (o.s ? [o.s] : []), pad = o.pad ?? size * .55;
  ctx.save(); ctx.font = `600 ${size}px Inter`; ctx.letterSpacing = '0.12em';
  const tw = Math.max(1, ...lines.map((s) => ctx.measureText(s).width));
  const w = o.w ?? tw + pad * 2, lh = size * 1.22, h = o.h ?? Math.max(size * 1.55, lines.length * lh + size * .5);
  const unfold = expoOut(clamp(o.unfold ?? 1)), write = clamp(o.write ?? 1), a = o.a ?? 1, lift = o.lift ?? 3;
  ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); ctx.globalAlpha = a;
  if (o.sx != null) ctx.scale(o.sx, 1);
  ctx.save(); ctx.translate(-w / 2, 0); ctx.scale(Math.max(.001, unfold), 1);
  ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(lift * .7, -h / 2 + lift, w, h);                      // its shadow on the surface
  const back = o.back ?? 0;                                                                               // 0 front (cream) … 1 back side (gold shade)
  ctx.fillStyle = lin(ctx, 0, -h / 2, 0, h / 2, [[0, mixHex(mixHex(P.core1, P.core0, o.lit ?? 0), P.shade1, back * .5)], [1, mixHex(mixHex(P.halo2, P.halo1, .5), P.shade0, back * .55)]]);
  ctx.fillRect(0, -h / 2, w, h);
  ctx.fillStyle = rgba(P.shade0, .5); ctx.fillRect(0, h / 2 - 1.5, w, 1.5);
  ctx.restore();
  if (write > 0 && lines.length && unfold > .6) {
    ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w * write, h); ctx.clip();
    const k = Math.min(1, (w - pad * 1.2) / tw);
    ctx.fillStyle = F.INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    lines.forEach((s, i) => { ctx.save(); ctx.translate(0, (i - (lines.length - 1) / 2) * lh + size * .04); ctx.scale(k, k); ctx.fillText(s, 0, 0); ctx.restore(); });
    ctx.restore();
  }
  ctx.restore();
  return { w, h };
}

// ---------- the sealed program: an envelope of light. (x, y) = centre of the body, w × h.
// o { fold 0..1 (flap open → shut), seal 0..1 (the gold seal pressed on), label (ink caps on a slip), labelU, stamp 0..1 (the empty
//     dashed APPROVED field draws itself), t, a, glow } ----------
export function envelope(ctx, x, y, w, h, t, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return null;
  const x0 = x - w / 2, y0 = y - h / 2, fold = clamp(o.fold ?? 1);
  ctx.save(); ctx.globalAlpha = a;
  const body = new Path2D(); body.roundRect(x0, y0, w, h, w * .012);
  glowFill(ctx, body, w * .16 * (o.glow ?? 1), .5 * a, P.blue0);
  glowFill(ctx, body, w * .035, .35 * a, P.halo1);
  // the flap behind the body while it is open (inner side, darker gold)
  const ph = h * .58 * clamp(o.flap ?? 1), tipY = lerp(y0 - ph, y0 + ph, smooth(fold));
  if (tipY < y0) {
    const fp = new Path2D(); fp.moveTo(x0, y0); fp.lineTo(x, tipY); fp.lineTo(x0 + w, y0); fp.closePath();
    ctx.fillStyle = lin(ctx, 0, tipY, 0, y0, [[0, mixHex(P.halo1, P.shade0, .55)], [1, mixHex(P.halo1, P.shade0, .3)]]); ctx.fill(fp);
  }
  ctx.fillStyle = lin(ctx, x0, y0, x0 + w * .3, y0 + h, [[0, P.core1], [.55, mixHex(P.core1, P.halo2, .5)], [1, P.halo2]]); ctx.fill(body);
  // the folded side and bottom panels: two soft diagonal creases meeting under the flap
  ctx.strokeStyle = rgba(P.shade0, .38); ctx.lineWidth = Math.max(1.2, w * .004); ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x0 + 2, y0 + h - 2); ctx.lineTo(x - w * .06, y + h * .08); ctx.moveTo(x0 + w - 2, y0 + h - 2); ctx.lineTo(x + w * .06, y + h * .08); ctx.stroke();
  ctx.fillStyle = rgba(P.shade0, .5); ctx.fillRect(x0, y0 + h - 2, w, 2);
  // the flap in front once it has passed edge-on (outer side: lighter paper, a crease along its edges)
  if (tipY >= y0) {
    const fp = new Path2D(); fp.moveTo(x0, y0); fp.lineTo(x, tipY); fp.lineTo(x0 + w, y0); fp.closePath();
    ctx.fillStyle = lin(ctx, 0, y0, 0, tipY + 1, [[0, P.core0], [1, mixHex(P.core1, P.halo2, .35)]]); ctx.fill(fp);
    ctx.save(); ctx.filter = `blur(${w * .006}px)`; ctx.strokeStyle = rgba(P.shade0, .55); ctx.lineWidth = Math.max(1.5, w * .005); ctx.stroke(fp); ctx.restore();
  }
  // the empty stamp field: a dashed frame that draws itself, the word inside in cool ink (nothing stamped yet)
  const st = clamp(o.stamp ?? 0);
  if (st > 0) {
    const sw = w * .34, sh = h * .3, sx = x0 + w * .6, sy = y0 + h * .58, per = 2 * (sw + sh), len = per * expoOut(st);
    ctx.save(); ctx.setLineDash([w * .022, w * .016]); ctx.strokeStyle = rgba(mixHex(P.blue1, F.INK, .4), .9); ctx.lineWidth = Math.max(1.5, w * .006);
    ctx.lineDashOffset = 0; ctx.beginPath();
    // walk the frame from its top-left corner clockwise up to len
    const pts = [[sx, sy], [sx + sw, sy], [sx + sw, sy + sh], [sx, sy + sh], [sx, sy]]; let left = len; ctx.moveTo(sx, sy);
    for (let i = 1; i < pts.length && left > 0; i++) { const [px, py] = pts[i - 1], [qx, qy] = pts[i], d = Math.hypot(qx - px, qy - py), f = Math.min(1, left / d); ctx.lineTo(px + (qx - px) * f, py + (qy - py) * f); left -= d; }
    ctx.stroke(); ctx.restore();
    const wu = span(st, .45, 1);
    if (wu > 0) { ctx.save(); ctx.beginPath(); ctx.rect(sx, sy, sw * wu, sh); ctx.clip(); ctx.font = `600 ${sh * .3}px Inter`; ctx.letterSpacing = '0.16em'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = rgba(mixHex(P.blue1, F.INK, .5), .85); ctx.fillText('APPROVED', sx + sw / 2, sy + sh / 2 + sh * .02); ctx.restore(); }
  }
  // the label slip (ink caps) on the lower left
  if (o.label) slip(ctx, x0 + w * .27, y0 + h * .73, { s: o.label, size: h * .085, write: o.labelU ?? 1, unfold: span(o.labelU ?? 1, 0, .3) * 1.6, lift: 2 });
  // the seal: a gold disc pressed on the flap tip (lands with a small overshoot of light)
  const se = clamp(o.seal ?? 0);
  if (se > 0 && tipY >= y0) {
    const r = h * .1 * (1 + .25 * (1 - expoOut(se))), sx = x, sy = tipY - h * .02;
    halo(ctx, sx, sy, r * 4, .35 * se + .4 * Math.max(0, 1 - Math.abs(se - .35) * 4), P.halo1, P.core0);
    const sp = new Path2D(); for (let k = 0; k <= 24; k++) { const q = k / 24 * Math.PI * 2, rr = r * (1 + .07 * Math.sin(q * 7 + 1.3)); k ? sp.lineTo(sx + Math.cos(q) * rr, sy + Math.sin(q) * rr) : sp.moveTo(sx + rr, sy); } sp.closePath();
    ctx.save(); ctx.globalAlpha = a * clamp(se * 3);
    ctx.fillStyle = rad(ctx, sx - r * .3, sy - r * .35, r * 1.3, [[0, P.core0], [.35, P.halo0], [1, P.shade0]]); ctx.fill(sp);
    ctx.strokeStyle = rgba(P.shade0, .8); ctx.lineWidth = Math.max(1, r * .08); ctx.beginPath(); ctx.arc(sx, sy, r * .62, 0, 6.29); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
  return { tipY, x0, y0 };
}

// ---------- a gold letter tile (a picked mark). (x, y) = baseline centre of the letter; size = letter size ----------
export function tile(ctx, x, y, ch, size, o = {}) {
  const a = o.a ?? 1, k = clamp(o.glow ?? 1); if (a <= 0) return;
  const w = size * .9, h = size * 1.12, ty = y - size * .86;
  ctx.save(); ctx.globalAlpha = a;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(P.halo0, .3 * k); ctx.filter = `blur(${size * .35}px)`; ctx.fillRect(x - w * .6, ty - h * .1, w * 1.2, h * 1.2); ctx.restore();
  ctx.fillStyle = lin(ctx, 0, ty, 0, ty + h, [[0, P.core0], [.5, P.core1], [1, P.halo0]]);
  ctx.beginPath(); ctx.roundRect(x - w / 2, ty, w, h, size * .12); ctx.fill();
  ctx.font = `600 ${size}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = F.INK; ctx.fillText(ch, x, y);
  ctx.restore();
}

// ---------- an upright ring of light (a gate). (x, y) centre, rx × ry. half: 'back' | 'front' | 'all'. o { a, glow, col, w } ----------
export function gateRing(ctx, x, y, rx, ry, half, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const lw = o.w ?? Math.max(3, ry * .035), [s0, s1] = half === 'back' ? [Math.PI, 2 * Math.PI] : half === 'front' ? [0, Math.PI] : [0, 2 * Math.PI];
  const p = new Path2D(); p.ellipse(x, y, rx, ry, 0, s0, s1);
  ctx.save(); ctx.globalAlpha = a; ctx.lineCap = 'round';
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = `blur(${lw * 2.4}px)`; ctx.strokeStyle = rgba(P.blue0, .9 * (o.glow ?? 1)); ctx.lineWidth = lw * 3.2; ctx.stroke(p); ctx.restore();
  ctx.strokeStyle = half === 'back' ? mixHex(o.col ?? P.halo1, P.blue1, .45) : (o.col ?? P.halo2); ctx.lineWidth = lw; ctx.stroke(p);
  if (half !== 'back') { ctx.strokeStyle = rgba(P.core0, .8); ctx.lineWidth = lw * .35; ctx.stroke(p); }
  ctx.restore();
}

// ---------- small math ----------
export const lerp2 = (p, q, u) => [lerp(p[0], q[0], u), lerp(p[1], q[1], u)];
// a point on a quadratic arc from p to q that bows by `bow` (px, + = up) at the middle
export const arcPt = (p, q, u, bow) => { const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2 - bow]; const a = lerp2(p, m, u), b = lerp2(m, q, u); return lerp2(a, b, u); };
// integral of smoothstep over [0, u] (for speeds that ease: position = v0 · ∫ (1 − k·smooth))
export const smoothInt = (u) => { u = clamp(u); return u * u * u - u * u * u * u / 2; };

// ---------- a camera through keys WITHOUT stopping at each key (monotone cubic Hermite per component, Fritsch–Carlson) ----------
// Same keys as E.camAt ([[t, cam]], z interpolated in log distance to the card ref). The camera only comes to rest at the first and
// last key and where a component turns round (a push that becomes a pull); everywhere else it glides through the key.
export function camGlide(t, K, ref = E.F0) {
  if (t <= K[0][0]) return { ...K[0][1] };
  const n = K.length; if (t >= K[n - 1][0]) return { ...K[n - 1][1] };
  let i = 0; while (t > K[i + 1][0]) i++;
  const T = K.map((k) => k[0]), out = E.cam3();
  const comp = (get) => {
    const v = K.map((k) => get(k[1])), d = []; for (let j = 0; j < n - 1; j++) d.push((v[j + 1] - v[j]) / (T[j + 1] - T[j]));
    const m = (j) => { if (j === 0 || j === n - 1) return 0; const a = d[j - 1], b = d[j]; if (a * b <= 0) return 0; const w1 = 2 * (T[j + 1] - T[j]) + (T[j] - T[j - 1]), w2 = (T[j + 1] - T[j]) + 2 * (T[j] - T[j - 1]); return (w1 + w2) / (w1 / a + w2 / b); };
    const h = T[i + 1] - T[i], s = (t - T[i]) / h, s2 = s * s, s3 = s2 * s;
    return (2 * s3 - 3 * s2 + 1) * v[i] + (s3 - 2 * s2 + s) * h * m(i) + (-2 * s3 + 3 * s2) * v[i + 1] + (s3 - s2) * h * m(i + 1);
  };
  for (const k of ['x', 'y', 'f', 'roll']) out[k] = comp((c) => c[k] ?? (k === 'f' ? E.F0 : 0));
  out.z = ref - Math.exp(comp((c) => Math.log(Math.max(1, ref - (c.z || 0)))));
  return out;
}
