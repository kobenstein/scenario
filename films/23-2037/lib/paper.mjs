// M3 · paper, the empty signature line and the pen. (Base version by K0; C2 owns and extends this file — keep signatures.)
//   paperSheet(ctx, x, y, w, h, { rot, seed, tone: '#efe4cc', light: [x,y] (warm spot), fold (0..1 crease), shadow (true), lift (px above the table),
//              lines: n (faint ruled lines), content(ctx, w, h) drawn in sheet units (0..w, 0..h) })  → { toScreen(px, py) }
//   sigLine(ctx, x, y, w, { u (0..1 signature progress), label: 'signature', ink, seed, t, dotted })   an empty line, optionally being signed
//   scribble(ctx, x, y, w, h, { seed, u, ink, lw })   unreadable handwriting (use for every name, label, note: never invented readable names)
//   pen(ctx, x, y, s, { ang, t, lift (0..1 tip off the paper), body: '#1d1a24', clip: '#c9a45a' })   x,y = the nib tip
//   inkStroke(ctx, pts, u, { w, ink, seed })   a pressure-varying ink line that frays at the end
//   stamp(ctx, x, y, text, { t0, t, col: '#8e2f2a', rot, size })   rubber stamp landing with a bounce and bleeding ink
import { rgba, clamp, lin, eout, mix, prng, rough, poly, hatch, text, back } from '../engine.mjs';
import { fibreFill } from './print.mjs';

export function paperSheet(ctx, x, y, w, h, o = {}) {
  const rot = o.rot ?? 0, seed = o.seed ?? 3, tone = o.tone || '#efe4cc', lift = o.lift ?? 0;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const edge = rough([[0, 0], [w, 0], [w, h], [0, h]], Math.max(1, w * .0035), seed, { step: 12 });
  if (o.shadow !== false) { ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 18 + lift * .8; ctx.shadowOffsetX = 8 + lift * .6; ctx.shadowOffsetY = 12 + lift; ctx.fillStyle = 'rgba(0,0,0,.4)'; poly(ctx, edge); ctx.fill(); ctx.restore(); }
  poly(ctx, edge);
  const L = o.light ? [(o.light[0] - x), (o.light[1] - y)] : [w * .8, -h * .2];
  const g = ctx.createRadialGradient(L[0], L[1], 0, L[0], L[1], Math.max(w, h) * 1.4);
  g.addColorStop(0, '#fbf3e1'); g.addColorStop(.5, tone); g.addColorStop(1, '#b9a689'); ctx.fillStyle = g; ctx.fill();
  poly(ctx, edge); fibreFill(ctx, .5);
  if (o.lines) { ctx.strokeStyle = 'rgba(80,90,130,.16)'; ctx.lineWidth = 1; for (let i = 1; i <= o.lines; i++) { const yy = h * .12 + i * (h * .8 / o.lines); ctx.beginPath(); ctx.moveTo(w * .08, yy); ctx.lineTo(w * .94, yy); ctx.stroke(); } }
  if (o.fold) { ctx.save(); poly(ctx, edge); ctx.clip(); const fx = w * .5, fg = ctx.createLinearGradient(fx - 30, 0, fx + 30, 0); fg.addColorStop(0, 'rgba(0,0,0,0)'); fg.addColorStop(.5, `rgba(60,40,20,${.18 * o.fold})`); fg.addColorStop(.52, `rgba(255,250,240,${.25 * o.fold})`); fg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = fg; ctx.fillRect(fx - 30, 0, 60, h); ctx.restore(); }
  if (o.content) { ctx.save(); poly(ctx, edge); ctx.clip(); o.content(ctx, w, h); ctx.restore(); }
  // edge darkening (the sheet has a thickness)
  ctx.strokeStyle = 'rgba(90,70,50,.35)'; ctx.lineWidth = 1.2; poly(ctx, edge); ctx.stroke();
  ctx.restore();
  const c = Math.cos(rot), s = Math.sin(rot);
  return { toScreen: (px, py) => [x + px * c - py * s, y + px * s + py * c] };
}
export function scribble(ctx, x, y, w, h, o = {}) {
  const r = prng(o.seed ?? 5), u = clamp(o.u ?? 1); if (u <= 0) return;
  const pts = [], n = Math.max(8, Math.round(w / 7));
  let px = 0;
  for (let i = 0; i < n; i++) {
    px += w / n * (.6 + r() * .8); const up = r() < .25 ? -h * (.5 + r() * .5) : r() < .15 ? h * .45 : 0;
    pts.push([x + Math.min(px, w), y - h * .2 * Math.sin(i * 1.9 + r()) + up * (i % 2 ? 1 : .3)]);
    if (r() < .12) { px += w * .04; }
  }
  const m = Math.max(2, Math.floor(pts.length * u));
  ctx.save(); ctx.strokeStyle = o.ink || '#1f1a26'; ctx.lineWidth = o.lw ?? Math.max(1.2, h * .12); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < m; i++) { const [ax, ay] = pts[i - 1], [bx, by] = pts[i]; ctx.quadraticCurveTo(ax + (bx - ax) * .5, ay - h * .35, bx, by); }
  ctx.stroke(); ctx.restore();
}
export function sigLine(ctx, x, y, w, o = {}) {
  const ink = o.ink || '#1f1a26';
  ctx.save(); ctx.strokeStyle = rgba(ink, .7); ctx.lineWidth = 1.6; if (o.dotted) ctx.setLineDash([3, 6]);
  const pts = rough([[x, y], [x + w, y]], .8, o.seed ?? 2, { closed: false, step: 18 }); poly(ctx, pts, false); ctx.stroke(); ctx.restore();
  if (o.label !== false) text(ctx, (o.label || 'signature').toUpperCase(), x, y + 24, { size: Math.max(11, w * .035), weight: 600, color: rgba(ink, .5), spacing: 3 });
  ctx.save(); ctx.strokeStyle = rgba(ink, .55); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x - 4, y - 16); ctx.lineTo(x + 6, y - 6); ctx.moveTo(x + 6, y - 16); ctx.lineTo(x - 4, y - 6); ctx.stroke(); ctx.restore(); // the "x"
  if (o.u > 0) scribble(ctx, x + w * .06, y - 8, w * .8, Math.max(10, w * .07), { seed: (o.seed ?? 2) + 7, u: o.u, ink: o.signInk || '#1b2a6b', lw: Math.max(1.6, w * .007) });
}
export function pen(ctx, x, y, s, o = {}) {
  const ang = o.ang ?? -2.2, lift = clamp(o.lift ?? 0), t = o.t ?? 0, L = 230, R = 9;
  ctx.save(); ctx.translate(x, y - lift * 14 * s);
  // shadow on the paper, offset more the higher the pen is
  ctx.save(); ctx.translate((6 + lift * 20) * s, (8 + lift * 26) * s); ctx.rotate(ang); ctx.scale(s, s); ctx.fillStyle = `rgba(10,6,4,${.32 - lift * .12})`; ctx.beginPath(); ctx.roundRect(8, -R, L, R * 2, R); ctx.fill(); ctx.restore();
  ctx.rotate(ang); ctx.scale(s, s);
  ctx.fillStyle = '#c9b48a'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(16, -5); ctx.lineTo(16, 5); ctx.closePath(); ctx.fill(); // nib
  ctx.fillStyle = '#2a2a33'; ctx.beginPath(); ctx.moveTo(16, -5); ctx.lineTo(30, -R); ctx.lineTo(30, R); ctx.lineTo(16, 5); ctx.closePath(); ctx.fill();
  const g = ctx.createLinearGradient(0, -R, 0, R); g.addColorStop(0, '#5a5668'); g.addColorStop(.3, o.body || '#1d1a24'); g.addColorStop(1, '#09080d');
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(30, -R, L - 30, R * 2, R); ctx.fill();
  ctx.fillStyle = o.clip || '#c9a45a'; ctx.fillRect(L - 70, -R - 3, 46, 4); // clip
  ctx.strokeStyle = 'rgba(255,240,220,.35)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(34, -R * .55); ctx.lineTo(L - 6, -R * .55); ctx.stroke(); // highlight
  ctx.restore();
}
export function inkStroke(ctx, pts, u = 1, o = {}) {
  const n = Math.max(2, Math.floor(pts.length * clamp(u))), w = o.w ?? 4, r = prng(o.seed ?? 3);
  ctx.save(); ctx.strokeStyle = o.ink || '#1b1626'; ctx.lineCap = 'round';
  for (let i = 1; i < n; i++) { const f = i / pts.length, p = .65 + .35 * Math.sin(f * 9 + 1) * (1 - f * .5); ctx.lineWidth = w * p; ctx.beginPath(); ctx.moveTo(pts[i - 1][0], pts[i - 1][1]); ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke(); }
  // frayed end: dry-brush hairs
  const e = pts[n - 1]; ctx.lineWidth = .8; ctx.globalAlpha = .6;
  for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.moveTo(e[0], e[1] + (r() - .5) * w); ctx.lineTo(e[0] + 4 + r() * 10, e[1] + (r() - .5) * w * 1.4); ctx.stroke(); }
  ctx.restore();
}
export function stamp(ctx, x, y, label, o = {}) {
  const t = o.t ?? 0, t0 = o.t0 ?? 0, u = lin(t0 - .35, t0, t); if (u <= 0) return;
  const col = o.col || '#8e2f2a', size = o.size ?? 40, land = t >= t0, sq = land ? 1 + .04 * Math.exp(-(t - t0) * 9) * Math.cos((t - t0) * 40) : mix(1.6, 1, eout(u));
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? -.06); ctx.scale(sq, sq); ctx.globalAlpha = land ? .92 : .25 * u;
  ctx.font = `600 ${size}px "Inter"`; try { ctx.letterSpacing = size * .12 + 'px'; } catch { }
  const tw = ctx.measureText(label).width, bw = tw + size * 1.1, bh = size * 1.7;
  const frame = rough([[-bw / 2, -bh / 2], [bw / 2, -bh / 2], [bw / 2, bh / 2], [-bw / 2, bh / 2]], size * .05, o.seed ?? 4, { step: 10 });
  ctx.strokeStyle = col; ctx.lineWidth = size * .09; poly(ctx, frame); ctx.stroke();
  ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, size * .05);
  if (land) { // uneven ink: knock out specks, bleed at the edge
    const r = prng(o.seed ?? 4); ctx.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 70; i++) { ctx.globalAlpha = .3 + r() * .5; ctx.beginPath(); ctx.arc((r() - .5) * bw, (r() - .5) * bh, r() * size * .06, 0, 7); ctx.fill(); }
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = .12 * eout(lin(t0, t0 + 1.2, t)); ctx.strokeStyle = col; ctx.lineWidth = size * .3; poly(ctx, frame); ctx.stroke();
  }
  ctx.restore();
}
