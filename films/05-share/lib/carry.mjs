// Carriers across a cut (shots-v0 §2): both neighbours draw the same object at the same place at the same time.
//   carry(id, T, R?) → { id, kind, t (the cut, film seconds), into: { t, tr, x, y, d } (spread into the incoming first shot),
//                        pos(t) → { x, y, s, r, a }, draw(ctx, t, o) }      id = 'c01>c02' … (lib/handoffs.mjs)
//   track(keys, t0) → pos(t)   the same easing for your own carriers inside a chunk: keys = [{ dt, x, y, s, r, a }] relative to t0
//   drawCarrier(ctx, kind, x, y, s, r, t, o)   the carrier objects in the film's look (pen, coin, nib, drop, envelope, knot,
//                                               sprout, line, light, thread, ring); o.a alpha, o.col accent
// Usage: outgoing last shot:  const C = carry('c03>c04', T); … if (t < C.t + .5) C.draw(ctx, t);
//        incoming first shot: { t: C.into.t, tr: C.into.tr, x: C.into.x, y: C.into.y, d: C.into.d, draw: (ctx, t) => { …; C.draw(ctx, t); } }
import { rgba, clamp, mix, eio, prng, addGlow } from '../engine.mjs';
import { HANDOFFS } from './handoffs.mjs';
import { shareLight } from './share.mjs';
import { pen } from './paper.mjs';
import { ring } from './certificate.mjs';
import { CHUNKS, chunkRanges } from '../film.mjs';

export function track(keys, t0 = 0) {
  const K = keys.map((k) => ({ x: 960, y: 540, s: 1, r: 0, a: 1, ...k })).sort((p, q) => p.dt - q.dt);
  return (t) => {
    const d = t - t0; if (d <= K[0].dt) return { ...K[0] }; if (d >= K[K.length - 1].dt) return { ...K[K.length - 1] };
    let i = 0; while (i < K.length - 2 && d > K[i + 1].dt) i++;
    const A = K[i], B = K[i + 1], u = (A.ease || eio)(clamp((d - A.dt) / (B.dt - A.dt)));
    return { x: mix(A.x, B.x, u), y: mix(A.y, B.y, u), s: mix(A.s, B.s, u), r: mix(A.r, B.r, u), a: mix(A.a, B.a, u) };
  };
}
const RCACHE = new WeakMap();
export function carry(id, T, R) {
  const H = HANDOFFS[id]; if (!H) throw new Error('carry: unknown handoff ' + id);
  let base;
  if (H.cut.chunk) { let RR = R && R.id === H.cut.chunk ? R : null; if (!RR) { if (!RCACHE.has(T)) RCACHE.set(T, chunkRanges(T)); RR = RCACHE.get(T)[H.cut.chunk]; } base = RR.first; }
  else base = H.cut.phrase ? T.S(H.cut.sec, H.cut.phrase) : T.seg(H.cut.sec).start;
  const t = base + (H.cut.dt ?? 0), pos = track(H.keys, t), at = pos(t);
  return { id, kind: H.kind, t, pos, into: { t, tr: H.into?.tr || 'cut', x: at.x, y: at.y, d: H.into?.d ?? .6 },
    draw: (ctx, tt, o = {}) => { const p = pos(tt); drawCarrier(ctx, o.kind || H.kind, p.x, p.y, p.s, p.r, tt, { ...o, a: (o.a ?? 1) * p.a }); } };
}
export function drawCarrier(ctx, kind, x, y, s, r, t, o = {}) {
  const a = o.a ?? 1, col = o.col || '#ffb35c'; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  switch (kind) {
    case 'pen': pen(ctx, x, y, s, { ang: r, t }); break;
    case 'nib': { ctx.translate(x, y); ctx.rotate(r); ctx.scale(s, s); addGlow(ctx, 0, 0, 40, .45, col, '#fff1d6');
      ctx.fillStyle = '#c9b48a'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(26, -8); ctx.lineTo(26, 8); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#1d1a24'; ctx.fillRect(26, -9, 60, 18);
      ctx.strokeStyle = 'rgba(40,30,20,.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(20, 0); ctx.stroke(); break; }
    case 'coin': { ctx.translate(x, y); ctx.scale(s, s); const R = 46; ctx.save(); ctx.translate(6, 40); ctx.scale(1, .25); ctx.fillStyle = 'rgba(5,3,10,.4)'; ctx.beginPath(); ctx.arc(0, 0, R, 0, 7); ctx.fill(); ctx.restore();
      ctx.rotate(r); const g = ctx.createRadialGradient(-R * .3, -R * .3, 0, 0, 0, R); g.addColorStop(0, '#fff4dc'); g.addColorStop(.6, '#efe4cc'); g.addColorStop(1, '#c8b48e'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R, 0, 7); ctx.fill();
      ring(ctx, 0, 0, R * .74, R * .74, { lines: 5, band: 8, wave: 9, col: '#8a5a24', glow: null, op: 'source-over', lineA: 1, a: .8, lw: .7 });
      ctx.strokeStyle = 'rgba(90,60,30,.7)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(0, 0, R - 2, 0, 7); ctx.stroke(); shareLight(ctx, 0, 0, R * .22, t, { a: .9 }); break; }
    case 'drop': { ctx.translate(x, y); ctx.scale(s, s); addGlow(ctx, 0, 0, 70, .5, col, '#fff1d6'); const g = ctx.createRadialGradient(-5, -8, 0, 0, 0, 22); g.addColorStop(0, '#fff1d6'); g.addColorStop(.5, col); g.addColorStop(1, '#a5541c');
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -30); ctx.bezierCurveTo(14, -10, 18, 4, 0, 16); ctx.bezierCurveTo(-18, 4, -14, -10, 0, -30); ctx.fill(); break; }
    case 'envelope': { ctx.translate(x, y); ctx.rotate(r); ctx.scale(s, s); ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 10; ctx.fillStyle = '#efe4cc'; ctx.fillRect(-110, -70, 220, 140); ctx.restore();
      ctx.strokeStyle = 'rgba(80,60,40,.55)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-110, -70); ctx.lineTo(0, 10); ctx.lineTo(110, -70); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 10, 16, 0, 7); ctx.fillStyle = '#8e2f2a'; ctx.fill(); break; }
    case 'knot': { ctx.translate(x, y); ctx.scale(s, s); addGlow(ctx, 0, 0, 60, .35, col, '#fff1d6'); ctx.strokeStyle = '#c9a26a'; ctx.lineWidth = 7; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-70, 18); ctx.bezierCurveTo(-20, 22, -24, -24, 0, -20); ctx.bezierCurveTo(26, -16, 20, 26, -6, 20); ctx.bezierCurveTo(-26, 14, 30, -6, 74, -2); ctx.stroke(); break; }
    case 'sprout': { ctx.translate(x, y); ctx.scale(s, s); addGlow(ctx, 0, -30, 70, .35, '#8fd27a', '#f3efe2'); ctx.strokeStyle = '#6fae5a'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      const sw = .08 * Math.sin(t * 1.3); ctx.beginPath(); ctx.moveTo(0, 20); ctx.quadraticCurveTo(4, -10, -2 + sw * 40, -40); ctx.stroke(); ctx.fillStyle = '#8fd27a';
      for (const sg of [-1, 1]) { ctx.save(); ctx.translate(-1 + sw * 30, -30); ctx.rotate(sg * .9 + sw); ctx.beginPath(); ctx.ellipse(sg * 14, 0, 15, 7, 0, 0, 7); ctx.fill(); ctx.restore(); } break; }
    case 'line': { ctx.translate(x, y); ctx.rotate(r); ctx.scale(s, s); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
      for (const [w, al] of [[14, .08], [5, .25], [1.6, .95]]) { ctx.strokeStyle = rgba(w > 2 ? col : '#fff1d6', al * a); ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(-260, 0); ctx.lineTo(260, 0); ctx.stroke(); } break; }
    case 'thread': { ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; const L = 300 * s, pts = []; for (let i = 0; i <= 60; i++) { const q = i / 60; pts.push([x - L * (1 - q), y + 14 * s * Math.sin(q * 9 + t * 2) * (1 - q)]); }
      for (const [w, al] of [[12, .07], [4, .22], [1.5, .95]]) { ctx.strokeStyle = rgba(w > 2 ? col : '#fff1d6', al * a); ctx.lineWidth = w; ctx.beginPath(); pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.stroke(); }
      addGlow(ctx, x, y, 60 * s, .6, col, '#fff1d6'); break; }
    case 'ring': ring(ctx, x, y, 80 * s, 80 * s, { lines: 7, band: 14, wave: 24, col: '#fff1d6', glow: col, a }); break;
    default: shareLight(ctx, x, y, 14 * s, t, { a });
  }
  ctx.restore();
}
export { CHUNKS };
