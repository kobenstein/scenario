// "People who study technology have a name for this kind of moment. Early on, a technology is easy to change, but
//  nobody knows where it's going. By the time everyone knows, it's set."
// A potter's wheel in a foggy studio. Two hands shape a glowing, soft lump of clay; it gives way to every touch and
// becomes a bowl, a tall jar, something wider, while faint dashed outlines of other possible shapes drift in the fog.
// Then the fog clears, the shape is plain to see, the clay cools into hard, fired stone and the wheel stops.
// The hands press once more: nothing moves.
const L = require('./lib');
const { W, H, C, sm, ease, out, ramp, lerp, drift, rng, lin, rad, rgba, light, clamp, label } = L;
const { grainFill, roundRect, cap, glowStroke } = require('./s_k3_clock');

const T0 = 181.0, T1 = 193.95;

// ---------- clay profiles: radius at 12 heights, plus total height ----------
const PROF = {
  lump: { h: 150, r: [126, 132, 134, 132, 126, 116, 102, 86, 68, 48, 26, 0] },
  bowl: { h: 160, r: [74, 98, 118, 132, 142, 148, 152, 155, 157, 158, 158, 156] },
  tall: { h: 340, r: [82, 92, 100, 98, 90, 76, 62, 54, 52, 56, 64, 70] },
  wide: { h: 230, r: [80, 120, 150, 166, 168, 160, 140, 112, 84, 66, 62, 66] },
  vase: { h: 300, r: [72, 98, 118, 126, 120, 100, 74, 54, 46, 48, 58, 68] },
};
const mixProf = (a, b, k) => ({ h: lerp(a.h, b.h, k), r: a.r.map((v, i) => lerp(v, b.r[i], k)) });
// sequence of shapes over time: [time, profile]
function profileAt(seq, t) {
  if (t <= seq[0][0]) return seq[0][1];
  for (let i = 0; i < seq.length - 1; i++) { const [t0, p0] = seq[i], [t1, p1] = seq[i + 1]; if (t < t1) return mixProf(p0, p1, ease((t - t0) / (t1 - t0))); }
  return seq[seq.length - 1][1];
}
function radiusAt(pr, hh) { const f = clamp(hh) * 11, i = Math.min(10, Math.floor(f)), k = f - i; return lerp(pr.r[i], pr.r[i + 1], k); }

const STONE = ['#f3efe2', '#c9c1d9', '#8a82a8', '#3e3860'];
// the pot: soft (glowing wet clay) to set (fired stone). o: { cool, edge, lean, wob, spin, dents:[{hh, side, d}] }
function pot(ctx, cx, base, pr, t, o = {}) {
  const N = 40, cool = o.cool || 0, wob = o.wob || 0, lean = o.lean || 0, spin = o.spin || 0;
  const pts = [];
  for (let i = 0; i <= N; i++) {
    const hh = i / N, y = base - hh * pr.h;
    let r = radiusAt(pr, hh) * (1 + wob * 0.035 * Math.sin(hh * 9 + t * 2.1) + wob * 0.02 * Math.sin(hh * 17 - t * 3.3));
    let rl = r, rr = r;
    for (const d of o.dents || []) { const g = Math.exp(-Math.pow((hh - d.hh) / 0.09, 2)) * d.d; if (d.side < 0) rl -= g; else rr -= g; }
    const lx = lean * (base - y);
    pts.push({ y, l: cx - rl + lx, r: cx + rr + lx, rc: r, x: cx + lx });
  }
  const top = pts[N], rTop = (top.r - top.l) / 2, eTop = rTop * 0.22;
  const outline = c => {
    c.moveTo(pts[0].l, pts[0].y);
    for (const p of pts) c.lineTo(p.l, p.y);
    if (rTop > 4) c.ellipse(top.x, top.y, rTop, eTop, 0, Math.PI, Math.PI * 2, false); else c.lineTo(top.r, top.y);
    for (let i = N; i >= 0; i--) c.lineTo(pts[i].r, pts[i].y);
    c.ellipse(pts[0].x, pts[0].y, (pts[0].r - pts[0].l) / 2, (pts[0].r - pts[0].l) / 2 * 0.22, 0, 0, Math.PI, false);
    c.closePath();
  };
  const rmax = Math.max(...pts.map(p => (p.r - p.l) / 2)), x0 = cx - rmax - 10, x1 = cx + rmax + 10;
  // soft clay
  grainFill(ctx, outline, lin(ctx, x0, 0, x1, 0, [[0, '#ffc07a'], [0.3, '#ff9a4a'], [0.7, '#d2602a'], [1, '#6a2410']]), 0.4);
  ctx.save(); ctx.beginPath(); outline(ctx); ctx.clip();
  // inner glow of the soft clay
  if (cool < 1) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, cx - rmax * 0.25, base - pr.h * 0.5, 0, rmax * 1.3, [[0, rgba('#ffe2a8', 0.35 * (1 - cool))], [1, rgba('#ffb35c', 0)]]); ctx.fillRect(x0, base - pr.h - 40, x1 - x0, pr.h + 80); ctx.globalCompositeOperation = 'source-over'; }
  // fired stone, globally (cool) and creeping in from the rim and the foot (edge)
  const e = o.edge || 0;
  if (cool > 0) { ctx.globalAlpha = cool; ctx.fillStyle = lin(ctx, x0, 0, x1, 0, [[0, STONE[0]], [0.3, STONE[1]], [0.72, STONE[2]], [1, STONE[3]]]); ctx.fillRect(x0, base - pr.h - 60, x1 - x0, pr.h + 120); ctx.globalAlpha = 1; }
  if (e > 0) {
    const y0 = base - pr.h - eTop, y1 = base + 30, a = e * 0.5, sc = (k, al) => [k, rgba('#b8b0cc', al)];
    ctx.fillStyle = lin(ctx, 0, y0, 0, y1, [sc(0, 0.95), sc(clamp(a * 0.9), 0.85), sc(clamp(a + 0.08), 0), sc(clamp(1 - a - 0.08), 0), sc(clamp(1 - a * 0.9), 0.85), sc(1, 0.95)]);
    ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    // and from the outer walls
    ctx.fillStyle = lin(ctx, x0, 0, x1, 0, [[0, rgba('#b8b0cc', 0.9 * e)], [clamp(0.12 * e + 0.02), rgba('#b8b0cc', 0)], [clamp(1 - 0.12 * e - 0.02), rgba('#8a82a8', 0)], [1, rgba('#8a82a8', 0.9 * e)]]);
    ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  }
  // shading: lit from the left
  ctx.fillStyle = lin(ctx, x0, 0, x1, 0, [[0, 'rgba(255,240,220,0.22)'], [0.35, 'rgba(255,240,220,0)'], [0.75, 'rgba(20,10,30,0.15)'], [1, 'rgba(20,10,30,0.45)']]); ctx.fillRect(x0, base - pr.h - 60, x1 - x0, pr.h + 120);
  // throwing rings, and specks that travel round while the wheel spins
  ctx.lineWidth = 2; ctx.strokeStyle = rgba(cool > 0.5 ? '#3e3860' : '#7a3b17', 0.28 + 0.1 * cool);
  for (let k = 1; k < 9; k++) { const p = pts[Math.round(k / 9 * N)], r = (p.r - p.l) / 2; ctx.beginPath(); ctx.ellipse(p.x, p.y, r, r * 0.2, 0, 0.15, Math.PI - 0.15); ctx.stroke(); }
  for (let k = 0; k < 14; k++) {
    const p = pts[3 + (k * 7) % (N - 6)], r = (p.r - p.l) / 2, th = spin + k * 2.4, s = Math.sin(th), c = Math.cos(th);
    if (c < 0) continue;
    ctx.fillStyle = rgba(cool > 0.5 ? '#3e3860' : '#7a3b17', 0.35 * c); ctx.beginPath(); ctx.ellipse(p.x + s * r * 0.95, p.y + c * r * 0.2, 6 * c + 1, 2, 0, 0, 7); ctx.fill();
  }
  // glaze highlight once fired
  if (cool > 0.3) { ctx.fillStyle = lin(ctx, x0, 0, x1, 0, [[0.18, 'rgba(255,255,255,0)'], [0.26, rgba('#ffffff', 0.35 * cool)], [0.32, 'rgba(255,255,255,0)']]); ctx.fillRect(x0, base - pr.h, x1 - x0, pr.h); }
  ctx.restore();
  // the opening at the top
  if (rTop > 18) {
    const op = c => c.ellipse(top.x, top.y, rTop - 9, eTop - 3, 0, 0, Math.PI * 2);
    grainFill(ctx, op, lin(ctx, top.x - rTop, top.y, top.x + rTop, top.y, cool > 0.5 ? [[0, '#2a2448'], [1, '#141030']] : [[0, '#5a2a12'], [1, '#2a1208']]), 0.4);
    ctx.strokeStyle = rgba(cool > 0.5 ? '#f3efe2' : '#ffe2a8', 0.55); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(top.x, top.y, rTop - 3, eTop - 1, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
  }
  return { pts, top, rmax };
}

// ---------- the wheel ----------
function wheel(ctx, cx, base, t, spin, cool) {
  // splash pan and body
  grainFill(ctx, c => { c.moveTo(cx - 330, base + 20); c.lineTo(cx + 330, base + 20); c.lineTo(cx + 300, base + 150); c.lineTo(cx - 300, base + 150); c.closePath(); }, lin(ctx, 0, base, 0, base + 150, [[0, '#2c2758'], [1, '#110f2a']]), 0.5);
  grainFill(ctx, c => c.ellipse(cx, base + 20, 330, 58, 0, 0, 7), lin(ctx, 0, base - 40, 0, base + 80, [[0, '#3b2f6e'], [1, '#1b1840']]), 0.5);
  grainFill(ctx, c => c.ellipse(cx, base + 14, 300, 48, 0, 0, 7), '#120f2c', 0.5);
  // wheel head, with marks that run round while it spins
  grainFill(ctx, c => c.ellipse(cx, base + 8, 230, 40, 0, 0, 7), lin(ctx, cx - 230, 0, cx + 230, 0, [[0, '#6a5a9a'], [0.5, '#3b2f6e'], [1, '#1f1a46']]), 0.4);
  grainFill(ctx, c => { c.ellipse(cx, base + 8, 230, 40, 0, 0, Math.PI); c.ellipse(cx, base + 22, 230, 40, 0, Math.PI, 0, true); c.closePath(); }, '#1a1640', 0.4);
  ctx.strokeStyle = 'rgba(243,239,226,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, base + 8, 230, 40, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
  for (let k = 0; k < 10; k++) { const th = spin + k * Math.PI / 5, s = Math.sin(th), c = Math.cos(th); if (c < 0.1) continue;
    ctx.strokeStyle = rgba('#a49fc4', 0.4 * c); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx + s * 200, base + 8 + c * 34); ctx.lineTo(cx + s * 222, base + 8 + c * 38); ctx.stroke(); }
  // a little slip on the wheel head while it is soft
  if (cool < 1) { ctx.fillStyle = rgba('#c9702e', 0.4 * (1 - cool)); ctx.beginPath(); ctx.ellipse(cx - 40, base + 18, 150, 16, 0, 0, Math.PI); ctx.fill(); }
}

// ---------- hands ----------
// a hand pressing a wall, with the coat sleeve. (x, y): where the fingers touch; side -1 = left hand.
function band(c, x0, y0, x1, y1, r0, r1) {
  const a = Math.atan2(y1 - y0, x1 - x0), n = a + Math.PI / 2, cn = Math.cos(n), sn = Math.sin(n);
  c.moveTo(x0 + cn * r0, y0 + sn * r0); c.lineTo(x1 + cn * r1, y1 + sn * r1); c.lineTo(x1 - cn * r1, y1 - sn * r1); c.lineTo(x0 - cn * r0, y0 - sn * r0); c.closePath();
}
function hand(ctx, x, y, side, t, o = {}) {
  const press = o.press ?? 1, lift = o.lift || 0, ang = (o.ang || 0), wrap = o.wrap ?? 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(side < 0 ? 1 : -1, 1); ctx.rotate(ang);
  ctx.translate(-lift * 34, lift * 16);
  // sleeve of a knitted jumper, pushed up, from the lower corner of the frame
  const E = [-150, 118], Wr = [-44, 26];
  grainFill(ctx, c => band(c, -720, 600, E[0] - 10, E[1] + 10, 110, 60), lin(ctx, -720, 600, E[0], E[1], [[0, '#3e1c0c'], [0.55, '#8a451c'], [1, '#b0602a']]), 0.5);
  ctx.strokeStyle = 'rgba(40,16,6,0.45)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  for (let k = 0; k < 3; k++) { const q = 0.35 + k * 0.2, px = lerp(-420, E[0], q), py = lerp(360, E[1], q); ctx.beginPath(); ctx.moveTo(px - 40, py - 44); ctx.quadraticCurveTo(px + 6, py - 8, px + 34, py + 42); ctx.stroke(); }
  grainFill(ctx, c => band(c, E[0] - 22, E[1] + 22, E[0] + 8, E[1] - 8, 62, 58), lin(ctx, E[0] - 40, E[1] - 40, E[0] + 30, E[1] + 30, [[0, '#d27a34'], [1, '#8a451c']]), 0.45);
  // forearm and wrist
  const skin = lin(ctx, -150, -60, 40, 60, [[0, '#f2c49a'], [0.45, '#c98a5a'], [1, '#6e3a1e']]);
  grainFill(ctx, c => cap(c, E[0] + 6, E[1] - 6, Wr[0], Wr[1], 40, 29), skin, 0.4);
  // back of the hand, cupped against the clay
  grainFill(ctx, c => { c.moveTo(-70, 48); c.bezierCurveTo(-82, 4, -64, -38, -24, -44); c.bezierCurveTo(-4, -46, 10, -40, 14, -30); c.lineTo(16, 34); c.bezierCurveTo(-6, 50, -40, 60, -70, 48); c.closePath(); }, skin, 0.4);
  // four fingers wrapping round the front of the pot, stacked, index on top
  const curl = 0.06 * Math.sin(t * 1.3) * press;
  const F = [{ y: -30, l: 64 }, { y: -12, l: 72 }, { y: 6, l: 68 }, { y: 23, l: 54 }];
  F.forEach((f, k) => {
    const bx = 8, by = f.y, L1 = f.l * 0.55 * wrap, L2 = f.l * 0.45 * wrap, a1 = 0.10 + k * 0.05 + curl, a2 = a1 + 0.28 + curl;
    const mx = bx + Math.cos(a1) * L1, my = by + Math.sin(a1) * L1, tx = mx + Math.cos(a2) * L2, ty = my + Math.sin(a2) * L2;
    grainFill(ctx, c => { cap(c, bx, by, mx, my, 10, 9.4); cap(c, mx, my, tx, ty, 9.4, 7.6); }, lin(ctx, bx, by, tx, ty, [[0, ['#f2c49a', '#e2b088', '#d49e76', '#c08a62'][k]], [1, '#8a5030']]), 0.35);
    ctx.strokeStyle = 'rgba(90,42,18,0.4)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(mx - 2, my - 8); ctx.quadraticCurveTo(mx + 3, my, mx - 2, my + 8); ctx.stroke();
    ctx.strokeStyle = 'rgba(70,30,12,0.35)'; ctx.beginPath(); ctx.moveTo(bx + 4, by + 9); ctx.lineTo(tx, ty + 7); ctx.stroke();
  });
  // thumb rides along the top
  grainFill(ctx, c => { cap(c, -30, -36, 0, -58, 14, 12); cap(c, 0, -58, 34, -64, 12, 9.5); }, lin(ctx, -30, -40, 34, -64, [[0, '#c98a5a'], [1, '#f2c49a']]), 0.35);
  // light catching the knuckles
  ctx.strokeStyle = 'rgba(255,226,170,0.45)'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-60, -10); ctx.quadraticCurveTo(-40, -42, 6, -40); ctx.stroke();
  ctx.restore();
}

// ---------- fog ----------
const FOG = (() => { const r = rng(14), a = []; for (let i = 0; i < 16; i++) a.push({ x: r() * 2400 - 240, y: 150 + r() * 800, w: 300 + r() * 420, v: (r() - 0.5) * 40, a: 0.5 + r() * 0.5, ph: r() * 7 }); return a; })();
function fog(ctx, t, dens, tint = '#8a82a8', veil = 0) {
  if (dens <= 0.01) return;
  if (veil > 0) { ctx.fillStyle = rgba(tint, veil * dens); ctx.fillRect(-200, -200, W + 400, H + 400); }
  for (const f of FOG) {
    const x = f.x + t * f.v + Math.sin(t * 0.3 + f.ph) * 40, y = f.y + Math.sin(t * 0.21 + f.ph) * 20;
    ctx.fillStyle = rad(ctx, x, y, 0, f.w, [[0, rgba(tint, 0.5 * f.a * dens)], [0.6, rgba(tint, 0.2 * f.a * dens)], [1, rgba(tint, 0)]]);
    ctx.fillRect(x - f.w, y - f.w, 2 * f.w, 2 * f.w);
  }
}

// ---------- studio backdrop ----------
const SHELF = (() => { const r = rng(23), a = []; let x = 120; while (x < 1800) { const w = 40 + r() * 60, h = 50 + r() * 70; a.push({ x, w, h, n: r() }); x += w + 20 + r() * 50; } return a; })();
const STUDIO = {};
function studio(ctx, t, clear) {
  for (const k of [0, 1]) if (!STUDIO[k]) { const cv = L.createCanvas(W + 200, H + 200), c = cv.getContext('2d'); c.translate(100, 100); studioArt(c, t, k); STUDIO[k] = cv; }
  if (clear < 1) ctx.drawImage(STUDIO[0], -100, -100);
  if (clear > 0) { ctx.save(); ctx.globalAlpha = clear; ctx.drawImage(STUDIO[1], -100, -100); ctx.restore(); }
}
function studioArt(ctx, t, clear) {
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, '#0d0f2c'], [0.6, '#1b1846'], [1, '#100e28']]); ctx.fillRect(-100, -100, W + 200, H + 200);
  // the window: diffuse in the fog, crisp once it clears
  const wx = 1240, wy = 120, ww = 520, wh = 420;
  light(ctx, wx + ww / 2, wy + wh / 2, 900, '#d9c8ff', 0.18 + 0.12 * clear);
  ctx.save(); ctx.globalAlpha = 0.25 + 0.75 * clear;
  grainFill(ctx, c => c.rect(wx, wy, ww, wh), lin(ctx, 0, wy, 0, wy + wh, [[0, '#cfd8ff'], [0.6, '#f6e2d0'], [1, '#ffd29a']]), 0.25);
  ctx.fillStyle = '#1b1846'; ctx.fillRect(wx + ww / 2 - 6, wy, 12, wh); ctx.fillRect(wx, wy + wh / 2 - 6, ww, 12);
  ctx.strokeStyle = '#1b1846'; ctx.lineWidth = 16; ctx.strokeRect(wx, wy, ww, wh);
  ctx.restore();
  // a shelf of finished, fired pots
  ctx.save(); ctx.globalAlpha = 0.3 + 0.6 * clear;
  ctx.fillStyle = '#0c0b22'; ctx.fillRect(60, 420, 1100, 12);
  for (const s of SHELF) { if (s.x > 1120) continue; grainFill(ctx, c => { c.moveTo(s.x, 420); c.bezierCurveTo(s.x - 8, 420 - s.h * 0.6, s.x + s.w * 0.2, 420 - s.h, s.x + s.w * 0.3, 420 - s.h); c.lineTo(s.x + s.w * 0.7, 420 - s.h); c.bezierCurveTo(s.x + s.w * 0.8, 420 - s.h, s.x + s.w + 8, 420 - s.h * 0.6, s.x + s.w, 420); c.closePath(); }, lin(ctx, s.x, 0, s.x + s.w, 0, [[0, '#6a5a9a'], [1, '#2a2252']]), 0.4); }
  ctx.restore();
  // window light falling on the floor
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.5 * clear;
  ctx.fillStyle = lin(ctx, 0, 700, 0, 1000, [[0, 'rgba(255,226,190,0.18)'], [1, 'rgba(255,226,190,0)']]);
  ctx.beginPath(); ctx.moveTo(wx - 200, 760); ctx.lineTo(wx + ww - 100, 760); ctx.lineTo(wx + ww + 200, 1080); ctx.lineTo(wx - 500, 1080); ctx.closePath(); ctx.fill(); ctx.restore();
  // floor
  grainFill(ctx, c => c.rect(-100, 760, W + 200, 400), lin(ctx, 0, 760, 0, H, [[0, '#1d1942'], [1, '#0b0a1e']]), 0.5);
}

// ghosts: other shapes this could become, dashed in the fog
function ghostPot(ctx, cx, base, pr, a, t, k) {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.setLineDash([8, 10]); ctx.lineDashOffset = -t * 14 * (k % 2 ? 1 : -1);
  ctx.strokeStyle = rgba('#ffe2a8', a); ctx.lineWidth = 2.5; ctx.beginPath();
  for (let i = 0; i <= 24; i++) { const hh = i / 24, y = base - hh * pr.h, r = radiusAt(pr, hh); i ? ctx.lineTo(cx - r, y) : ctx.moveTo(cx - r, y); }
  for (let i = 24; i >= 0; i--) { const hh = i / 24, y = base - hh * pr.h, r = radiusAt(pr, hh); ctx.lineTo(cx + r, y); }
  ctx.stroke(); ctx.restore();
}

// ---------- this scene ----------
const CX = 960, BASE = 640, SC = 1.3;
const SEQ = [[181.0, PROF.lump], [184.3, PROF.lump], [186.6, PROF.bowl], [187.9, PROF.tall], [189.3, PROF.wide], [190.9, PROF.vase]];
const GH = [{ p: PROF.tall, dx: -560, s: 0.75, t: 186.2 }, { p: PROF.bowl, dx: 560, s: 0.8, t: 186.8 }, { p: PROF.wide, dx: -330, s: 0.55, t: 188.6 }, { p: PROF.tall, dx: 390, s: 0.5, t: 189.2 }];

function draw(ctx, t) {
  const clear = ramp(t, 190.9, 192.5), cool = ramp(t, 192.2, 193.1), dens = 1 - 0.93 * clear;
  const z = lerp(1.04, 1.12, sm((t - T0) / 9)) - 0.07 * ease((t - 190.9) / 2.5), dx = drift(t, 1, 2) * 6, dy = drift(t, 1, 5) * 4;
  const spinRate = 7 * (1 - ramp(t, 192.4, 193.6)), spin = (() => { // integrate a slowing wheel
    const tt = Math.min(t, 193.6) - T0; return tt * 7 - (t > 192.4 ? 7 * Math.pow(Math.min(t, 193.6) - 192.4, 2) / 2.4 : 0); })();
  ctx.save(); ctx.translate(W / 2, H / 2 + 40); ctx.scale(z, z); ctx.translate(-W / 2 + dx, -H / 2 - 40 + dy);
  studio(ctx, t, clear);
  fog(ctx, t * 0.8, dens, '#8a82a8', 0.22);
  // where it might go
  GH.forEach((g, i) => ghostPot(ctx, CX + g.dx, BASE + 60, { h: g.p.h * g.s * 1.3, r: g.p.r.map(v => v * g.s * 1.2) }, 0.6 * ramp(t, g.t, g.t + 0.8) * (1 - clear) * (0.6 + 0.4 * Math.sin(t * 1.5 + i)), t, i));
  ctx.save(); ctx.translate(CX, BASE); ctx.scale(SC, SC); ctx.translate(-CX, -BASE);
  wheel(ctx, CX, BASE, t, spin, cool);
  // the clay
  const pr = profileAt(SEQ, t);
  const handH = 0.45 + 0.18 * Math.sin(t * 1.1) * (1 - clear);       // hands travel up and down the wall while throwing
  const soft = 1 - cool, press = (0.6 + 0.4 * Math.sin(t * 2.3)) * soft;
  const set = ramp(t, 193.15, 193.4) * (1 - ramp(t, 193.55, 193.95));   // the last press: nothing gives
  const info = pot(ctx, CX, BASE, pr, t, { cool, wob: soft * 1.0, spin, dents: [{ hh: handH, side: -1, d: 14 * press }, { hh: handH, side: 1, d: 14 * press }] });
  light(ctx, CX - 40, BASE - pr.h * 0.5, 420, C.amber, 0.30 * soft * (0.9 + 0.1 * Math.sin(t * 2)));
  // hands on the walls; they lift away a little once it is set, then press once more
  const hh = handH, y = BASE - hh * pr.h, rL = radiusAt(pr, hh) - 14 * press, lift = 1.6 * ramp(t, 192.4, 192.95) * (1 - 0.85 * set);
  const wrap = clamp(radiusAt(pr, hh) / 120, 0.55, 1);
  hand(ctx, CX - rL + 6, y, -1, t, { press: soft, lift, ang: 0.05, wrap });
  hand(ctx, CX + rL - 6, y + 8, 1, t + 1.3, { press: soft, lift, ang: 0.02, wrap });
  ctx.restore();
  fog(ctx, t * 1.1 + 40, dens * 0.5, '#a49fc4', 0.06);
  ctx.restore();
  label(ctx, t, 183.6, 188.6, 'The Collingridge dilemma', 'named by David Collingridge, 1980', 96, 90, { color: C.amber });
}

module.exports = { T0, T1, draw, PROF, profileAt, radiusAt, mixProf, pot, wheel, hand, fog, studio, ghostPot };
