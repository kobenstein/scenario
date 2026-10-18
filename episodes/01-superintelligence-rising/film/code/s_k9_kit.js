// Shared helpers for chunk k9 (not a scene: T0/T1 are never active, draw is a no-op).
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, out, rgba, lin, rad } = L;

let PAT = null;
// grainFill with a bounded speckle rect; box = [x, y, w, h] in local coordinates
function gf(ctx, pathFn, fill, grain = 0.45, box = null) {
  ctx.save(); ctx.beginPath(); pathFn(ctx); ctx.fillStyle = fill; ctx.fill();
  if (grain > 0) {
    if (!PAT) PAT = ctx.createPattern(L.tex().dark, 'repeat');
    ctx.clip(); ctx.globalAlpha *= grain; ctx.fillStyle = PAT;
    if (box) ctx.fillRect(box[0], box[1], box[2], box[3]);
    else { const m = ctx.getTransform().inverse(), xs = [], ys = [];
      for (const [x, y] of [[0, 0], [W, 0], [0, H], [W, H]]) { xs.push(m.a * x + m.c * y + m.e); ys.push(m.b * x + m.d * y + m.f); }
      ctx.fillRect(Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)); }
  }
  ctx.restore();
}
function rr(c, x, y, w, h, r) { c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
// tapered limb (x0,y0,r0) -> (x1,y1,r1)
function cap(c, x0, y0, x1, y1, r0, r1) {
  const a = Math.atan2(y1 - y0, x1 - x0), n = a + Math.PI / 2;
  c.moveTo(x0 + Math.cos(n) * r0, y0 + Math.sin(n) * r0); c.lineTo(x1 + Math.cos(n) * r1, y1 + Math.sin(n) * r1);
  c.arc(x1, y1, r1, n, n - Math.PI, true); c.lineTo(x0 - Math.cos(n) * r0, y0 - Math.sin(n) * r0); c.arc(x0, y0, r0, n + Math.PI, n, true); c.closePath();
}
// two-bone IK: returns elbow point for shoulder s, target t, lengths a, b; bend = +1/-1
function ik2(sx, sy, tx, ty, a, b, bend = 1) {
  const dx = tx - sx, dy = ty - sy, d = clamp(Math.hypot(dx, dy), Math.abs(a - b) + 1, (a + b) * 0.999);
  const base = Math.atan2(dy, dx), A = Math.acos(clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1));
  const an = base - bend * A; return [sx + Math.cos(an) * a, sy + Math.sin(an) * a];
}
const CACHE = {};
function cached(ctx, key, x0, y0, x1, y1, fn, S = 1) {
  if (!CACHE[key]) { const cv = L.createCanvas(Math.ceil((x1 - x0) * S), Math.ceil((y1 - y0) * S)), c = cv.getContext('2d'); c.scale(S, S); c.translate(-x0, -y0); fn(c); CACHE[key] = cv; }
  ctx.drawImage(CACHE[key], x0, y0, x1 - x0, y1 - y0);
}
// quote card: serif quote with an amber rule and an Inter attribution
function quote(ctx, t, t0, t1, text, who, x, y, opt = {}) {
  const a = ramp(t, t0, t0 + 0.5) * (1 - ramp(t, t1 - 0.5, t1)); if (a <= 0) return;
  const rise = (1 - out((t - t0) / 0.9)) * 14, size = opt.size ?? 64, lines = Array.isArray(text) ? text : [text];
  ctx.save(); ctx.globalAlpha = a; ctx.textBaseline = 'top'; ctx.shadowColor = 'rgba(4,4,16,0.85)'; ctx.shadowBlur = 26;
  const hgt = lines.length * size * 1.08;
  ctx.fillStyle = opt.color ?? C.amber; ctx.fillRect(x - 26, y + rise + 6, 3, hgt * out((t - t0) / 0.7));
  ctx.fillStyle = C.cream; ctx.font = `${size}px "Instrument Serif"`;
  lines.forEach((ln, i) => ctx.fillText((i === 0 ? '“' : '') + ln + (i === lines.length - 1 ? '”' : ''), x - (i === 0 ? size * 0.32 : 0), y + rise + i * size * 1.08));
  if (who) { ctx.font = '24px "Inter Medium"'; ctx.letterSpacing = '5px'; ctx.fillStyle = C.lav; ctx.fillText(who.toUpperCase(), x + 2, y + rise + hgt + 18); }
  ctx.restore();
}
// small faceless person (for groups): x,y = feet centre, s = scale (1 = ~175 px tall)
// o: { pal:[light,mid,dark], hair, facing:'front'|'back', walk: phase|null, arm: 0..1 raised (right arm), armL, br, coat, bag, lean, skin, long (hair) }
function tiny(ctx, x, y, s, o = {}) {
  const pal = o.pal || ['#ffb35c', '#c36a2b', '#5a2a12'], br = o.br || 0, lean = o.lean || 0, back = o.facing === 'back';
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(4,4,16,0.4)'; ctx.beginPath(); ctx.ellipse(0, 0, 28, 5, 0, 0, 7); ctx.fill();
  ctx.rotate(lean);
  const w = o.walk, sw = w == null ? 0 : Math.sin(w);
  const lf = w == null ? 0 : Math.max(0, sw) * 9, rf = w == null ? 0 : Math.max(0, -sw) * 9;
  const g = o.grain ?? 0.35, box = [-44, -180, 88, 186], trou = o.trousers || '#3a1a0c';
  // legs (trousers) and shoes
  gf(ctx, c => { cap(c, -9, -76, -10 + sw * 3, -6 - lf, 9, 6.5); }, trou, 0);
  gf(ctx, c => { cap(c, 9, -76, 10 - sw * 3, -6 - rf, 9, 6.5); }, lin(ctx, 0, -76, 0, 0, [[0, trou], [1, '#1c0c06']]), 0);
  ctx.fillStyle = '#140804'; ctx.beginPath(); ctx.ellipse(-11 + sw * 3, -3 - lf, 9, 4.5, 0, 0, 7); ctx.ellipse(11 - sw * 3, -3 - rf, 9, 4.5, 0, 0, 7); ctx.fill();
  // far-side arm behind the body when walking
  const ar = o.arm || 0, al = o.armL || 0;
  const armPath = (side, raise) => c => { const sx = side * 22, sy = -138, ex = side * lerp(27, 36, raise) + (w == null ? 0 : -side * sw * 0), ey = lerp(-100, -156, raise),
      hx = side * lerp(25, 30, raise) + (w == null ? 0 : side * sw * 6), hy = lerp(-70, -192, raise);
    cap(c, sx, sy, ex, ey, 7.5, 6); cap(c, ex, ey, hx, hy, 6, 5); c.moveTo(hx + 5, hy); c.arc(hx, hy, 5.5, 0, 7); };
  // torso: shoulders, coat or jacket
  const len = o.coat ? 100 : 82, hem = -148 + len;
  gf(ctx, c => { c.moveTo(-8, -152 + br); c.quadraticCurveTo(-22, -150 + br, -27, -138); c.bezierCurveTo(-30, -120, -24, -100, o.coat ? -25 : -20, hem);
    c.quadraticCurveTo(0, hem + 4, o.coat ? 25 : 20, hem); c.bezierCurveTo(24, -100, 30, -120, 27, -138); c.quadraticCurveTo(22, -150 + br, 8, -152 + br); c.closePath(); },
    lin(ctx, -27, -150, 27, hem, [[0, pal[0]], [0.55, pal[1]], [1, pal[2]]]), g, box);
  // fold / centre seam and collar
  ctx.strokeStyle = rgba('#2a1206', 0.35); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(back ? 0 : 2, -146); ctx.lineTo(back ? 0 : 3, hem - 2); ctx.stroke();
  gf(ctx, c => { c.moveTo(-14, -151 + br); c.quadraticCurveTo(0, back ? -146 : -134, 14, -151 + br); c.lineTo(10, -156 + br); c.quadraticCurveTo(0, -150, -10, -156 + br); c.closePath(); }, pal[2], 0);
  gf(ctx, armPath(-1, al), lin(ctx, 0, -140, 0, -70, [[0, pal[1]], [1, pal[2]]]), 0);
  gf(ctx, armPath(1, ar), lin(ctx, 0, -140, 0, -70, [[0, pal[0]], [1, pal[1]]]), 0);
  if (o.bag) { gf(ctx, c => rr(c, 20, -92, 24, 20, 3), pal[2], 0); ctx.strokeStyle = pal[2]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-18, -146); ctx.lineTo(28, -92); ctx.stroke(); }
  // neck and head
  const sk = o.skin || ['#ffd29a', '#e0904a', '#7a3b17'];
  ctx.fillStyle = sk[2]; ctx.fillRect(-5, -162 + br, 10, 12);
  const hx = 0, hy = -174 + br;
  ctx.fillStyle = lin(ctx, -12, hy - 14, 12, hy + 14, [[0, sk[0]], [0.6, sk[1]], [1, sk[2]]]);
  ctx.beginPath(); ctx.ellipse(hx, hy, 12, 14.5, 0, 0, 7); ctx.fill();
  ctx.fillStyle = o.hair || '#2e140a'; ctx.beginPath();
  if (back) { ctx.ellipse(hx, hy - 1, 12.8, 14.6, 0, 0, 7); if (o.long) { ctx.moveTo(-12, hy); ctx.quadraticCurveTo(-15, hy + 22, -8, hy + 26); ctx.lineTo(8, hy + 26); ctx.quadraticCurveTo(15, hy + 22, 12, hy); } }
  else { ctx.moveTo(-13, hy + 2); ctx.bezierCurveTo(-15, hy - 20, 15, hy - 20, 13, hy + 2); ctx.quadraticCurveTo(8, hy - 9, -2, hy - 8); ctx.quadraticCurveTo(-9, hy - 6, -13, hy + 2);
    if (o.long) { ctx.moveTo(-13, hy); ctx.quadraticCurveTo(-16, hy + 20, -9, hy + 24); ctx.lineTo(-9, hy + 4); ctx.moveTo(13, hy); ctx.quadraticCurveTo(16, hy + 20, 9, hy + 24); ctx.lineTo(9, hy + 4); } }
  ctx.fill();
  if (!back) { ctx.fillStyle = rgba('#3a1608', 0.22); ctx.beginPath(); ctx.ellipse(hx + 5, hy + 3, 6, 11, 0, 0, 7); ctx.fill(); }
  ctx.restore();
}
module.exports = { T0: -100, T1: -100, draw() {}, gf, rr, cap, ik2, cached, quote, tiny };
