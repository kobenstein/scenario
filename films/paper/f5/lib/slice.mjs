// The pie and the one slice (0.03, 0.10, 2.04, 3.09, 5.08–5.10): a disc lying on a tilted plane, with thickness, engraved side
// hatching and a guilloche rosette on its face (the certificate language); one slice can come loose, lift and widen.
//   slicePie(ctx, x, y, r, o)   x,y = centre of the top face, r = radius px
//     o: { share .12 (fraction of the slice), at (angle where the slice sits, default -0.35 = front right), grow 0..1 (the slice lifts
//          and slides out along its bisector), widen 0 (extra fraction added as it grows, e.g. .1 → the slice ends at share + .1),
//          dotted false (the slice is only a dotted outline: it does not exist yet), tilt .55 (0 = from above, 1 = low angle),
//          depth 28 (thickness px), col '#efe4cc' (the pie), sliceCol '#ffb35c', ink '#2a2030', t (breathing light), glow true }
//   Returns { tip: [x, y] (outer middle of the slice, e.g. for a label or a carrier), centre: [x, y] of the slice face }
import { rgba, clamp, mix, eout } from '../engine.mjs';
import { rosette } from './certificate.mjs';
import { shareLight } from './share.mjs';

const TAU = Math.PI * 2;
export function slicePie(ctx, x, y, r, o = {}) {
  const tilt = clamp(o.tilt ?? .55), sy = mix(1, .32, tilt), dep = (o.depth ?? 28) * (1 - sy) * 1.6, ink = o.ink || '#2a2030';
  const grow = eout(clamp(o.grow ?? 0)), share = clamp((o.share ?? .12) + (o.widen ?? 0) * grow, .005, .95), mid = o.at ?? -.35;
  const a0 = mid - share * Math.PI, a1 = mid + share * Math.PI, col = o.col || '#efe4cc', sc = o.sliceCol || '#ffb35c', t = o.t ?? 0;
  const off = r * .34 * grow, lift = r * .12 * grow, sx = Math.cos(mid) * off, syy = Math.sin(mid) * off * sy - lift;
  const P = (cx, cy, a, rr = r) => [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * sy];
  // shadow on the table
  ctx.save(); ctx.translate(x + r * .08, y + dep + r * .1 * sy); ctx.scale(1, sy); const sg = ctx.createRadialGradient(0, 0, r * .6, 0, 0, r * 1.25); sg.addColorStop(0, 'rgba(4,3,10,.45)'); sg.addColorStop(1, 'rgba(4,3,10,0)'); ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(0, 0, r * 1.25, 0, TAU); ctx.fill(); ctx.restore();
  const side = (cx, cy, b0, b1, fill) => {   // the front part of the rim wall between angles b0..b1
    const s0 = Math.max(b0, 0), s1 = Math.min(b1, Math.PI), segs = [];
    for (const [u0, u1] of [[s0, s1], [Math.max(b0, TAU), Math.min(b1, TAU + Math.PI)], [Math.max(b0, -TAU), Math.min(b1, -Math.PI)]]) if (u1 > u0) segs.push([u0, u1]);
    for (const [u0, u1] of segs) {
      ctx.beginPath(); for (let i = 0; i <= 24; i++) { const [px, py] = P(cx, cy, mix(u0, u1, i / 24)); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
      for (let i = 24; i >= 0; i--) { const [px, py] = P(cx, cy, mix(u0, u1, i / 24)); ctx.lineTo(px, py + dep); } ctx.closePath();
      ctx.fillStyle = fill; ctx.fill(); ctx.save(); ctx.clip(); ctx.strokeStyle = rgba(ink, .3); ctx.lineWidth = .8;
      for (let a = u0; a <= u1; a += .035) { const [px, py] = P(cx, cy, a); ctx.beginPath(); ctx.moveTo(px, py + 2); ctx.lineTo(px, py + dep); ctx.stroke(); } ctx.restore();
      ctx.strokeStyle = rgba(ink, .7); ctx.lineWidth = 1.1; ctx.stroke();
    }
  };
  const face = (cx, cy, b0, b1, fill, whole) => { ctx.beginPath(); if (!whole) ctx.moveTo(cx, cy); for (let i = 0; i <= 64; i++) { const [px, py] = P(cx, cy, mix(b0, b1, i / 64)); (i || whole) ? ctx.lineTo(px, py) : ctx.lineTo(px, py); } ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };
  const cut = (cx, cy, a) => { const [px, py] = P(cx, cy, a); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.lineTo(px, py + dep); ctx.lineTo(cx, cy + dep); ctx.closePath(); ctx.fillStyle = 'rgba(120,98,70,1)'; ctx.fill(); ctx.strokeStyle = rgba(ink, .65); ctx.lineWidth = 1; ctx.stroke(); };
  // the body: everything but the slice
  const b0 = a1, b1 = a0 + TAU, bodyFill = (() => { const g = ctx.createLinearGradient(x - r, y - r * sy, x + r, y + r * sy); g.addColorStop(0, '#fbf3e1'); g.addColorStop(.6, col); g.addColorStop(1, '#b9a689'); return g; })();
  side(x, y, b0, b1, '#b39f80'); if (grow > .02 || o.dotted) { cut(x, y, a0); cut(x, y, a1); }
  face(x, y, b0, b1, bodyFill, false); ctx.save(); ctx.clip(); ctx.translate(x, y); ctx.scale(1, sy); rosette(ctx, 0, 0, { R: r * .62, A: r * .08, B: r * .04, n: 18, m: 7, lines: 18, col: ink, w: .55, a: .32, cache: true }); ctx.restore();
  ctx.strokeStyle = rgba(ink, .75); ctx.lineWidth = 1.2; face(x, y, b0, b1, 'rgba(0,0,0,0)', false); ctx.stroke();
  // the slice
  const cx = x + sx, cy = y + syy;
  if (o.dotted) {
    ctx.save(); ctx.setLineDash([4, 6]); ctx.strokeStyle = rgba(sc, .9); ctx.lineWidth = 2; face(cx, cy, a0, a1, rgba(sc, .08), false); ctx.stroke(); ctx.restore();
  } else {
    if (o.glow !== false) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const [gx, gy] = P(cx, cy, mid, r * .55); const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, r * 1.1); g.addColorStop(0, `rgba(255,190,110,${.35 + .08 * Math.sin(t * 2)})`); g.addColorStop(1, 'rgba(255,170,90,0)'); ctx.fillStyle = g; ctx.fillRect(gx - r * 1.1, gy - r * 1.1, r * 2.2, r * 2.2); ctx.restore(); }
    side(cx, cy, a0, a1, '#b8661f'); if (grow > .02) { cut(cx, cy, a0); cut(cx, cy, a1); }
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, '#fff1d6'); g.addColorStop(.55, sc); g.addColorStop(1, '#d9842e'); face(cx, cy, a0, a1, g, false);
    ctx.save(); ctx.clip(); ctx.translate(cx, cy); ctx.scale(1, sy); rosette(ctx, 0, 0, { R: r * .62, A: r * .08, B: r * .04, n: 18, m: 7, lines: 18, col: '#7a3b17', w: .6, a: .45, cache: true }); ctx.restore();
    ctx.strokeStyle = rgba('#7a3b17', .85); ctx.lineWidth = 1.3; face(cx, cy, a0, a1, 'rgba(0,0,0,0)', false); ctx.stroke();
    const [lx, ly] = P(cx, cy, mid, r * .55); shareLight(ctx, lx, ly, r * .05, t, { a: .9 });
  }
  return { tip: P(cx, cy, mid, r), centre: P(cx, cy, mid, r * .55) };
}
