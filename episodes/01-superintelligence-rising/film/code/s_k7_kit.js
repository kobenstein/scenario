// Chunk k7 shared helpers (not a scene: T0/T1 lie before the film, so render.js never draws it).
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light } = L;
const TL = require('./s_timeline');

// grainFill with a bounded speckle rect (box = [x, y, w, h] in local coords); without box it falls back to lib's frame cover
let PAT = new WeakMap();
function gf(ctx, pathFn, fill, grain = 0.45, box = null) {
  if (!box) return L.grainFill(ctx, pathFn, fill, grain);
  ctx.save(); ctx.beginPath(); pathFn(ctx); ctx.fillStyle = fill; ctx.fill();
  if (grain > 0) {
    let p = PAT.get(ctx); if (!p) { p = ctx.createPattern(L.tex().dark, 'repeat'); PAT.set(ctx, p); }
    ctx.clip(); ctx.globalAlpha = grain; ctx.fillStyle = p; ctx.fillRect(box[0], box[1], box[2], box[3]);
  }
  ctx.restore();
}
const CACHE = {};
function cached(ctx, key, x0, y0, x1, y1, fn, S = 1) {
  if (!CACHE[key]) { const cv = L.createCanvas(Math.ceil((x1 - x0) * S), Math.ceil((y1 - y0) * S)), c = cv.getContext('2d'); c.scale(S, S); c.translate(-x0, -y0); fn(c); CACHE[key] = cv; }
  ctx.drawImage(CACHE[key], x0, y0, x1 - x0, y1 - y0);
}
function rr(c, x, y, w, h, r) { c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function cap(c, x0, y0, x1, y1, r0, r1) {
  const a = Math.atan2(y1 - y0, x1 - x0), n = a + Math.PI / 2;
  c.moveTo(x0 + Math.cos(n) * r0, y0 + Math.sin(n) * r0); c.lineTo(x1 + Math.cos(n) * r1, y1 + Math.sin(n) * r1);
  c.arc(x1, y1, r1, n, n - Math.PI, true); c.lineTo(x0 - Math.cos(n) * r0, y0 - Math.sin(n) * r0); c.arc(x0, y0, r0, n + Math.PI, n, true); c.closePath();
}
// camera: push z0->z1 over [a,b], drift, optional pan; returns layer(par, fn)
function camera(ctx, t, a, b, o = {}) {
  const k = sm((t - a) / (b - a)), z = lerp(o.z0 ?? 1, o.z1 ?? 1.07, k);
  const dx = drift(t, 1, o.seed ?? 3) * (o.amp ?? 6), dy = drift(t, 1, (o.seed ?? 3) + 5) * (o.amp ?? 6) * 0.66;
  const px = o.px ? o.px(t) : 0, py = o.py ? o.py(t) : 0, cx = o.cx ?? W / 2, cy = o.cy ?? H / 2;
  return (par, fn) => { ctx.save(); ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx + (dx - px) * par, -cy + (dy - py) * par); fn(); ctx.restore(); };
}
function sky(ctx, stops, grain = 0.55) {
  L.grainFill(ctx, c => c.rect(0, 0, W, H), lin(ctx, 0, 0, 0, H, stops), grain);
}
const STARS = (() => { const r = rng(77), a = []; for (let i = 0; i < 140; i++) a.push([r() * 2400 - 240, r() * 700, 0.6 + r() * 1.6, r() * 6.28, 0.3 + r() * 0.7]); return a; })();
function stars(ctx, t, a = 1, maxY = 700) {
  for (const [x, y, s, ph, b] of STARS) { if (y > maxY) continue; ctx.fillStyle = rgba(C.cream, a * b * (0.35 + 0.25 * Math.sin(t * 1.3 + ph))); ctx.fillRect(x, y, s, s); }
}
// drifting fog banks
function fog(ctx, t, seed, y0, y1, col = C.lav, amt = 1, n = 8) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const w = 300 + r() * 520, x = ((r() * 2600 + t * (6 + r() * 14)) % 2800) - 440, y = y0 + r() * (y1 - y0), h = 30 + r() * 70, a = (0.04 + r() * 0.06) * amt;
    ctx.save(); ctx.translate(x, y); ctx.scale(1, h / w);
    ctx.fillStyle = rad(ctx, 0, 0, 0, w, [[0, rgba(col, a)], [1, rgba(col, 0)]]); ctx.fillRect(-w, -w, 2 * w, 2 * w); ctx.restore();
  }
}
// floating dust motes in a light
const DUST = (() => { const r = rng(5), a = []; for (let i = 0; i < 60; i++) a.push([r(), r(), r() * 6.28, 0.5 + r()]); return a; })();
function dust(ctx, t, x, y, w, h, col = C.cream, a = 0.5) {
  for (const [u, v, ph, s] of DUST) {
    const px = x + ((u * w + t * 9 * s + Math.sin(t * 0.7 + ph) * 20) % w), py = y + ((v * h - t * 5 * s + h * 10) % h);
    ctx.fillStyle = rgba(col, a * (0.4 + 0.6 * Math.sin(t * 1.1 + ph * 3) ** 2)); ctx.beginPath(); ctx.arc(px, py, 1.4 * s, 0, 7); ctx.fill();
  }
}

// ---------- a walking person, side view, facing right (dir -1 mirrors) ----------
const LEG = { th: 86, sh: 84 };
function legPose(p, stride = 1) {
  const th = 0.46 * stride * Math.sin(p);
  const knee = 0.08 + 1.05 * stride * Math.pow(Math.max(0, Math.cos(p + 0.45)), 2);
  const kx = Math.sin(th) * LEG.th, ky = Math.cos(th) * LEG.th;
  const ph = th - knee, ax = kx + Math.sin(ph) * LEG.sh, ay = ky + Math.cos(ph) * LEG.sh;
  return { kx, ky, ax, ay, fa: clamp(-ph * 0.6 - 0.05, -0.5, 0.7) };
}
// o: { coat:[light,dark], pants:[near,far], hair, skin, look (0..1 glance back), badge: hex|null, bag: bool, papers: n, stride, rim: hex }
function walkerFig(ctx, p, o = {}) {
  const st = o.stride ?? 1, A = legPose(p, st), B = legPose(p + Math.PI, st);
  const hipY = -Math.max(A.ay, B.ay) - 10, lean = 0.06, sx = Math.sin(lean) * 128, sy = hipY - Math.cos(lean) * 128;
  const rim = o.rim, G = rim ? 0 : (o.grain ?? 1), box = [-140, -360, 280, 380];
  const col = (a, b) => rim || lin(ctx, 0, sy - 60, 0, 0, [[0, a], [1, b]]);
  const coat = o.coat || ['#ffb35c', '#b0602a'], pants = o.pants || ['#7a3b17', '#3e1c0c'];
  const leg = (L0, near) => {
    const kx = L0.kx, ky = hipY + L0.ky, ax = L0.ax, ay = hipY + L0.ay;
    gf(ctx, c => { cap(c, 0, hipY, kx, ky, 18, 13); cap(c, kx, ky, ax, ay, 13, 9.5); }, near ? col(pants[0], pants[1]) : col(pants[1], '#24100a'), 0.4 * G, box);
    gf(ctx, c => { c.save(); c.translate(ax, ay); c.rotate(L0.fa); c.moveTo(-13, -9); c.lineTo(22, -7); c.quadraticCurveTo(36, -2, 33, 10); c.lineTo(-15, 10); c.closePath(); c.restore(); }, rim || (near ? '#2a140b' : '#1a0c06'), 0);
  };
  const swing = Math.sin(p) * 0.42 * st;
  const arm = (a, near) => {
    const ex = sx + 2 + Math.sin(a) * 62, ey = sy + 16 + Math.cos(a) * 62, a2 = a + 0.25 + 0.2 * Math.max(0, Math.sin(a + 0.3));
    const hx = ex + Math.sin(a2) * 58, hy = ey + Math.cos(a2) * 58;
    gf(ctx, c => { cap(c, sx + 2, sy + 16, ex, ey, near ? 15 : 13, 12); cap(c, ex, ey, hx, hy, 12, 9); }, near ? col(coat[0], coat[1]) : col(coat[1], '#4a2210'), 0.4 * G, box);
    gf(ctx, c => c.ellipse(hx + Math.sin(a2) * 5, hy + Math.cos(a2) * 5, 8, 10, -a2, 0, 7), rim || (near ? (o.skin || '#e08a42') : '#8a451c'), 0);
    return [hx, hy];
  };
  leg(B, false);
  if (o.legsBehind) leg(A, true);
  arm(-swing, false);
  if (o.bag) gf(ctx, c => { c.save(); c.translate(sx, sy); c.rotate(lean); rr(c, -54, 6, 34, 92, 13); c.restore(); }, rim || lin(ctx, 0, sy, 0, sy + 100, [[0, '#a2521f'], [1, '#4a2210']]), 0.5 * G, box);
  // coat torso: long coat to mid-thigh
  gf(ctx, c => {
    c.moveTo(-26, hipY + 34);
    c.bezierCurveTo(-30, hipY - 40, -34 + sx * 0.5, sy + 60, -24 + sx, sy + 12);
    c.bezierCurveTo(-18 + sx, sy - 6, -4 + sx, sy - 12, 8 + sx, sy - 12);
    c.bezierCurveTo(24 + sx, sy - 8, 30 + sx, sy + 20, 28 + sx, sy + 50);
    c.bezierCurveTo(26 + sx * 0.5, sy + 90, 28, hipY - 20, 30, hipY + 34); c.quadraticCurveTo(2, hipY + 40, -26, hipY + 34); c.closePath();
  }, col(coat[0], coat[1]), 0.42 * G, box);
  if (!o.legsBehind) leg(A, true);
  if (!rim) { ctx.strokeStyle = rgba('#3a1608', 0.45); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sx + 16, sy + 2); ctx.quadraticCurveTo(sx + 22, sy + 70, 22, hipY + 30); ctx.stroke(); }
  // head
  ctx.save(); ctx.translate(sx + 6, sy - 8); ctx.rotate(0.05 - (o.look || 0) * 0.2 + (o.nod || 0));
  gf(ctx, c => cap(c, 0, 4, 2, -22, 10, 9), rim || '#b0602a', 0);
  const head = c => { c.moveTo(-18, -26); c.bezierCurveTo(-22, -52, -10, -70, 6, -70); c.bezierCurveTo(24, -70, 32, -56, 30, -40);
    c.bezierCurveTo(30, -32, 34, -30, 32, -24); c.bezierCurveTo(28, -14, 18, -10, 8, -12); c.bezierCurveTo(-4, -12, -14, -16, -18, -26); c.closePath(); };
  gf(ctx, head, col('#ffc488', '#c36a2b'), 0.35 * G, [-40, -90, 80, 90]);
  if (!rim) {
    const hs = o.hairStyle || 0;
    if (hs === 1) gf(ctx, c => { c.moveTo(-22, -10); c.bezierCurveTo(-30, -60, -10, -78, 8, -76); c.bezierCurveTo(28, -76, 36, -60, 30, -48); c.bezierCurveTo(16, -58, 2, -52, -4, -40); c.bezierCurveTo(-6, -24, -10, -6, -22, -10); c.closePath(); }, o.hair || '#3a1a0c', 0.4, [-40, -90, 80, 90]);
    else gf(ctx, c => { c.moveTo(-20, -28); c.bezierCurveTo(-26, -56, -10, -76, 8, -74); c.bezierCurveTo(26, -74, 34, -60, 30, -50); c.bezierCurveTo(18, -58, 4, -54, -2, -44); c.bezierCurveTo(-6, -36, -10, -30, -20, -28); c.closePath(); }, o.hair || '#4a2210', 0.4, [-40, -90, 80, 90]);
    if (o.capHat) gf(ctx, c => { c.moveTo(-22, -52); c.quadraticCurveTo(4, -86, 30, -56); c.lineTo(46, -52); c.lineTo(28, -46); c.quadraticCurveTo(4, -52, -22, -46); c.closePath(); }, o.capHat, 0.3, [-40, -90, 100, 90]);
    gf(ctx, c => c.ellipse(-1, -36, 5, 8, 0.1, 0, 7), '#b0602a', 0.3, [-10, -50, 20, 30]);
  }
  ctx.restore();
  // collar
  gf(ctx, c => { c.moveTo(sx - 16, sy - 2); c.quadraticCurveTo(sx + 2, sy - 22, sx + 22, sy - 6); c.lineTo(sx + 18, sy + 6); c.quadraticCurveTo(sx + 2, sy - 6, sx - 12, sy + 8); c.closePath(); }, rim || coat[1], 0.4 * G, box);
  let hand;
  if (o.papers) {
    // near arm bent, holding a sheaf of papers against the chest
    const ex = sx + 4, ey = sy + 70, hx = sx + 40, hy = sy + 52;
    if (!rim && o.papers === 'clip') { ctx.save(); ctx.translate(hx + 10, hy + 16); ctx.rotate(-0.5); ctx.scale(1.3, 1.3); ctx.fillStyle = '#5a3420'; ctx.fillRect(-4, -46, 40, 58); ctx.fillStyle = '#f3efe2'; ctx.fillRect(0, -42, 32, 50); ctx.fillStyle = '#2a2050'; ctx.fillRect(10, -48, 12, 6);
      if (o.clipFn) o.clipFn(ctx); ctx.restore(); }
    else if (!rim) { ctx.save(); ctx.translate(hx - 4, hy - 8); ctx.rotate(-0.25); for (let k = 0; k < 3; k++) { ctx.fillStyle = k === 2 ? '#f3efe2' : '#d9d2bd'; ctx.fillRect(-6 + k * 2, -38 + k * 2, 34, 46); } ctx.restore(); }
    gf(ctx, c => { cap(c, sx + 2, sy + 16, ex, ey, 15, 12); cap(c, ex, ey, hx, hy, 12, 9); }, col(coat[0], coat[1]), 0.4 * G, box);
    gf(ctx, c => c.ellipse(hx + 4, hy, 9, 8, 0, 0, 7), rim || (o.skin || '#e08a42'), 0);
    hand = [hx, hy];
  } else hand = arm(swing, true);
  if (o.writeAt) {
    // the far arm comes round in front of the body to write on what the near hand holds
    const [a1, a2] = TL.ik(sx + 6, sy + 18, o.writeAt[0], o.writeAt[1], 60, 56, -1);
    const ex = sx + 6 + Math.cos(a1) * 60, ey = sy + 18 + Math.sin(a1) * 60, hx = ex + Math.cos(a2) * 56, hy = ey + Math.sin(a2) * 56;
    gf(ctx, c => { cap(c, sx + 6, sy + 18, ex, ey, 14, 11); cap(c, ex, ey, hx, hy, 11, 8.5); }, col(coat[0], coat[1]), 0.4 * G, box);
    if (!rim) { ctx.strokeStyle = '#1a1438'; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(hx + 2, hy + 6); ctx.lineTo(hx - 10, hy - 16); ctx.stroke(); }
    gf(ctx, c => c.ellipse(hx, hy, 8, 7, 0, 0, 7), rim || (o.skin || '#e08a42'), 0);
  }
  if (o.badge && !rim) {
    // lanyard and badge on the chest
    ctx.strokeStyle = rgba('#2a140b', 0.7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx - 2, sy - 4); ctx.lineTo(sx + 18, sy + 44); ctx.stroke();
    ctx.fillStyle = o.badge; ctx.fillRect(sx + 12, sy + 42, 15, 20);
    if (o.badgeGlow) light(ctx, sx + 19, sy + 52, 40, o.badge, o.badgeGlow);
  }
  return { hand, head: [sx + 6, sy - 50] };
}
// place a walker: x,y = ground point, s scale, dir 1 right / -1 left
function walker(ctx, x, y, s, p, o = {}, dir = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s);
  ctx.fillStyle = 'rgba(4,4,16,0.45)'; ctx.beginPath(); ctx.ellipse(8, 2, 64, 8, 0, 0, 7); ctx.fill();
  if (o.rimCol) { ctx.save(); ctx.globalAlpha = o.rimA ?? 0.7; ctx.translate(o.rimDx ?? -4, -3); walkerFig(ctx, p, { ...o, rim: o.rimCol }); ctx.restore(); }
  const r = walkerFig(ctx, p, o); ctx.restore(); return r;
}

// a lamp-lit checkmark stroke drawn progressively
function check(ctx, x, y, s, k, col, w = 6) {
  if (k <= 0) return;
  const pts = [[-0.5, 0.05], [-0.15, 0.4], [0.6, -0.5]], seg1 = 0.4;
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
  ctx.moveTo(x + pts[0][0] * s, y + pts[0][1] * s);
  if (k < seg1) { const u = k / seg1; ctx.lineTo(x + lerp(pts[0][0], pts[1][0], u) * s, y + lerp(pts[0][1], pts[1][1], u) * s); }
  else { const u = (k - seg1) / (1 - seg1); ctx.lineTo(x + pts[1][0] * s, y + pts[1][1] * s); ctx.lineTo(x + lerp(pts[1][0], pts[2][0], u) * s, y + lerp(pts[1][1], pts[2][1], u) * s); }
  ctx.stroke(); ctx.restore();
}

// quote-style small caption anywhere
function caption(ctx, t, t0, t1, text, x, y, o = {}) {
  const a = ramp(t, t0, t0 + 0.5) * (1 - ramp(t, t1 - 0.4, t1)); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.shadowColor = 'rgba(4,4,16,0.8)'; ctx.shadowBlur = 14; ctx.textBaseline = 'top'; ctx.textAlign = o.align || 'left';
  ctx.fillStyle = o.color || C.cream; ctx.font = o.font || '30px "Inter SemiBold"'; if (o.ls) ctx.letterSpacing = o.ls;
  ctx.fillText(text, x, y + (1 - L.out((t - t0) / 0.7)) * 10); ctx.restore();
}

module.exports = { T0: -100, T1: -100, draw() {}, gf, cached, rr, cap, camera, sky, stars, fog, dust, walker, walkerFig, legPose, check, caption, figure: TL.figure, ik: TL.ik, capsule: TL.capsule };
