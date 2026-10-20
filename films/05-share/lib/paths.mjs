// The three engraved guilloche paths with the fork (TAKE rust, PRINT verdigris, AGREE amber), owner C3 (2.01 …); also used by C4 (2.20, 2.23).
// paths(ctx, t, { view = 'persp' | 'top', cam = { x: 0, y: 0, z: 1 }, u = [1, 1, 1] (draw-on of TAKE, PRINT, AGREE), hi = null | 'take' | 'print' | 'agree',
//   fork = { x: 960, y: 760 }, fog = .5, life = { take: 0..1 (crowd, dust), print: 0..1 (rushing stream), agree: 0..1 (foil glint) } })
//   draws the whole frame. → { along(name, q) → { x, y, ang } (screen point on a path, q 0 = fork … 1 = far end) }
//
// v1 by C3 (real version; signature and anchors unchanged). The world is a dark engraved plate (indigo, chart grid, a faint rosette field)
// lying on the ground; the three paths are woven guilloche bands (interlaced sine lines between two hairlines, like a banknote border)
// that leave one trunk at the fork: TAKE curves off to the left, PRINT runs straight ahead, AGREE bends gently to the right.
//   view 'persp'  low flat perspective, the bands recede like roads on a map toward a hazy horizon (fork = the fork's screen point)
//   view 'top'    from high above (2.23): an engraved chart, fork at `fork`, the bands fan out across the frame
//   cam           { x, y } moves the camera over the ground (world units ≈ px at the fork, y = forward), z zooms around the fork
// Extra options (all optional, defaults keep the call above unchanged):
//   tilt 0..1 (blend persp → top; overrides view), rot (rad, turns the world in top view), trunk 0..1 (draw-on of the stem that the
//   nib draws toward the fork; default 1), labels true (TAKE / PRINT / AGREE engraved at the far ends), labelA 1, bg true (false: draw
//   only the paths over your own frame), glow 1, a 1 (alpha of the paths), horizon (screen y of the horizon in persp, default fork.y - 470).
// Returned anchors: along(name, q) for 'take' | 'print' | 'agree' | 'trunk' (trunk: q 0 = the nib end, 1 = the fork), fork { x, y } (screen),
//   P(X, Y) → [x, y, scale] (ground point → screen), world(name, q) → [X, Y] (ground point).
import { W, H, rgba, clamp, mix, prng, canvas, drift, text } from '../engine.mjs';
import { fog as artFog, stipple, vnoise } from './art.mjs';
import { rosette } from './certificate.mjs';

export const PATH_COL = { take: '#c4512e', print: '#3fae9a', agree: '#ffb35c' };
const COL = PATH_COL, NAMES = ['take', 'print', 'agree'], LABEL = { take: 'TAKE', print: 'PRINT', agree: 'AGREE' };
const TAU = Math.PI * 2;
const CACHE = new Map(); const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };

// ---- the ground geometry (world units; X right, Y forward away from the viewer; fork at 0,0) ----
const bez = (p0, p1, p2, p3, q) => { const a = 1 - q; return [a * a * a * p0[0] + 3 * a * a * q * p1[0] + 3 * a * q * q * p2[0] + q * q * q * p3[0], a * a * a * p0[1] + 3 * a * a * q * p1[1] + 3 * a * q * q * p2[1] + q * q * q * p3[1]]; };
const CURVES = {
  take: [[0, 0], [-90, 520], [-900, 1050], [-2300, 1500]],
  print: [[0, 0], [30, 700], [130, 1500], [260, 2700]],
  agree: [[0, 0], [110, 480], [760, 980], [2000, 1700]],
  trunk: [[60, -1900], [40, -1200], [0, -500], [0, 0]],
};
function centre(name, n = 260) {
  return once('c' + name + n, () => { const C = CURVES[name], pts = []; for (let i = 0; i <= n; i++) pts.push(bez(...C, i / n));
    // arc-length parametrisation so draw-on and along() move evenly
    const d = [0]; for (let i = 1; i < pts.length; i++) d.push(d[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const L = d[d.length - 1], out = []; let j = 0;
    for (let i = 0; i <= n; i++) { const s = i / n * L; while (j < d.length - 2 && d[j + 1] < s) j++; const q = (s - d[j]) / ((d[j + 1] - d[j]) || 1); out.push([mix(pts[j][0], pts[j + 1][0], q), mix(pts[j][1], pts[j + 1][1], q)]); }
    const nrm = out.map((p, i) => { const a = out[Math.max(0, i - 1)], b = out[Math.min(n, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; });
    return { pts: out, nrm, L };
  });
}
// band half-width in world units: wide at the fork, a little narrower far away (the road thins with distance on the map, too)
const BAND = { take: 70, print: 70, agree: 70, trunk: 46 };

// ---- projection ----
function projector(o) {
  const fork = o.fork || { x: 960, y: 760 }, cam = { x: 0, y: 0, z: 1, ...(o.cam || {}) }, z = cam.z ?? 1;
  const tilt = o.tilt != null ? clamp(o.tilt) : (o.view === 'top' ? 1 : 0), rot = o.rot ?? 0, cr = Math.cos(rot), sr = Math.sin(rot);
  const Hy = o.horizon ?? fork.y - 470, D0 = 1000, f = 1000, ch = (fork.y - Hy) * D0 / f, ks = .42;   // top view: .42 px per unit at z 1
  const P = (X, Y) => {
    const x0 = X - cam.x, y0 = Y - cam.y;
    let px = 0, py = 0, sc = 1;
    if (tilt < 1) { const D = Math.max(40, y0 + D0), q = f / D; px = fork.x + x0 * q; py = Hy + ch * f / D; sc = q; }
    if (tilt > 0) { const xr = x0 * cr - y0 * sr, yr = x0 * sr + y0 * cr, tx = fork.x + xr * ks, ty = fork.y - yr * ks; px = mix(px, tx, tilt); py = mix(py, ty, tilt); sc = mix(sc, ks, tilt); }
    return [fork.x + (px - fork.x) * z, fork.y + (py - fork.y) * z, sc * z];
  };
  return { P, fork, cam, z, tilt, Hy };
}

// ---- the plate under the paths (cached; drawn with a small parallax) ----
function plate() {
  return once('plate', () => {
    const [c, g] = canvas(W + 240, H + 160);
    const bg = g.createRadialGradient(W * .55, H * .35, 0, W * .55, H * .45, 1500); bg.addColorStop(0, '#1a2150'); bg.addColorStop(.5, '#0e1336'); bg.addColorStop(1, '#05071a');
    g.fillStyle = bg; g.fillRect(0, 0, c.width, c.height);
    const [p, pg] = canvas(W + 240, H + 160);
    rosette(pg, W * .62, H * .5, { R: 720, A: 60, B: 26, n: 46, m: 13, lines: 64, col: '#b4bfe8', w: .6, a: .045 });
    rosette(pg, W * .15, H * .95, { R: 380, A: 40, B: 18, n: 30, m: 11, lines: 40, col: '#b4bfe8', w: .55, a: .04 });
    g.filter = 'blur(2px)'; g.drawImage(p, 0, 0); g.filter = 'none';
    stipple(c, { k: .45, g: 1, seed: 52, mid: false, boost: 1 });
    return c;
  });
}
function fogLayer(k) { return once('fog' + k, () => { const [c, g] = canvas(W + 400, H); artFog(g, { y0: k ? 120 : 40, y1: k ? 900 : 760, col: k ? '#4a5f96' : '#6f86b8', a: k ? .26 : .3, seed: 7 + k * 9, sx: .0016, sy: .006, cover: .55, soft: .4, k: .55, x1: W + 400 }); return c; }); }
function dustSprite() { return once('dust', () => { const R = 90, [c, g] = canvas(R * 2, R * 2), rg = g.createRadialGradient(R, R, 0, R, R, R); rg.addColorStop(0, 'rgba(214,150,110,.42)'); rg.addColorStop(.5, 'rgba(196,110,70,.16)'); rg.addColorStop(1, 'rgba(196,110,70,0)'); g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2); stipple(c, { k: .95, g: 1.1, seed: 61, boost: 2 }); return c; }); }

// woven band along a centre polyline (world), projected; u = how much of it exists (from its start)
function band(ctx, Pr, name, u, o) {
  const C = centre(name), n = C.pts.length - 1, m = Math.max(1, Math.round(n * clamp(u))); if (u <= 0) return;
  const col = COL[name] || '#f3efe2', bw = BAND[name], lines = name === 'trunk' ? 5 : 7, waves = name === 'trunk' ? 26 : 46, a = (o.a ?? 1);
  const hiK = o.hi ? (o.hi === name ? 1 : .45) : 1, glowK = (o.glow ?? 1) * hiK;
  const proj = []; for (let i = 0; i <= m; i++) proj.push(i);
  const pt = (i, off) => { const [X, Y] = C.pts[i], [nx, ny] = C.nrm[i], w = bw * (1 - .25 * i / n); return Pr.P(X + nx * off * w, Y + ny * off * w); };
  // the bed of the band: a soft dark trough + coloured glow (the road on the plate)
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const strip = (off0, off1) => { ctx.beginPath(); for (let i = 0; i <= m; i++) { const [x, y] = pt(i, off0); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } for (let i = m; i >= 0; i--) { const [x, y] = pt(i, off1); ctx.lineTo(x, y); } ctx.closePath(); };
  strip(-1.25, 1.25); ctx.fillStyle = rgba('#03040f', .45 * a); ctx.fill();
  ctx.globalCompositeOperation = 'lighter';
  strip(-1.1, 1.1); ctx.fillStyle = rgba(col, .07 * a * glowK); ctx.fill();
  strip(-.55, .55); ctx.fillStyle = rgba(col, .06 * a * glowK); ctx.fill();
  // the woven lines
  const ph0 = (o.t ?? 0) * (name === 'print' ? .9 : .25);
  for (let k = 0; k < lines; k++) {
    const ph = k / lines * TAU; ctx.strokeStyle = rgba(k % 2 ? '#f3efe2' : col, (k % 2 ? .55 : .9) * a * (.65 + .35 * hiK)); ctx.lineWidth = 1.05;
    ctx.beginPath();
    for (let i = 0; i <= m; i++) { const q = i / n * waves * TAU, d = .78 * (Math.sin(q + ph + ph0) * .75 + Math.sin(q * 2.03 - ph * 1.5) * .25); const [x, y, s] = pt(i, d); ctx.lineWidth = 1; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke();
  }
  ctx.globalCompositeOperation = 'source-over';
  // two framing hairlines (cream ink)
  for (const off of [-1, 1]) { ctx.strokeStyle = rgba('#f3efe2', .7 * a * (.6 + .4 * hiK)); ctx.lineWidth = 1.3; ctx.beginPath(); for (let i = 0; i <= m; i++) { const [x, y] = pt(i, off); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
  // the drawing head (when the band is still being drawn): a hot point
  if (u < 1 && u > 0) { const [x, y, s] = Pr.P(...C.pts[m]); ctx.globalCompositeOperation = 'lighter'; const r = 40 * Math.max(.4, s), gg = ctx.createRadialGradient(x, y, 0, x, y, r); gg.addColorStop(0, rgba('#fff1d6', .9 * a)); gg.addColorStop(.3, rgba(col, .4 * a)); gg.addColorStop(1, rgba(col, 0)); ctx.fillStyle = gg; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); }
  ctx.restore();
}

export function paths(ctx, t, o = {}) {
  const Pr = projector(o), u = o.u || [1, 1, 1], life = o.life || {}, fogA = o.fog ?? .5, trunk = o.trunk ?? 1, a = o.a ?? 1;
  const camx = (Pr.cam.x || 0), camy = (Pr.cam.y || 0);
  // background plate with parallax (moves slower than the ground)
  if (o.bg !== false) {
    ctx.drawImage(plate(), -120 - (camx * .08) % 120 + drift(t, 8, 1), -80 + (camy * .04) % 80 + drift(t, 5, 2));
    // the ground: chart grid on the plate, in the same projection as the paths (engraved, faint)
    ctx.save(); ctx.strokeStyle = rgba('#9fb0e0', .085); ctx.lineWidth = 1; ctx.setLineDash([2, 7]);
    const gx0 = Math.floor((camx - 3200) / 400) * 400, gy0 = Math.floor((camy - 1500) / 400) * 400;
    for (let X = gx0; X <= camx + 3200; X += 400) { ctx.beginPath(); for (let Y = Math.max(gy0, camy - 900); Y <= camy + 5200; Y += 200) { const [x, y] = Pr.P(X, Y); Y === Math.max(gy0, camy - 900) ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
    for (let Y = Math.max(gy0, camy - 900); Y <= camy + 5200; Y += 400) { ctx.beginPath(); for (let X = camx - 3600; X <= camx + 3600; X += 300) { const [x, y] = Pr.P(X, Y); X === camx - 3600 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
    ctx.setLineDash([]); ctx.restore();
    // horizon haze (perspective only)
    if (Pr.tilt < 1) { const k = 1 - Pr.tilt, hy = Pr.fork.y + (Pr.Hy - Pr.fork.y) * Pr.z, hg = ctx.createLinearGradient(0, hy - 260, 0, hy + 220); hg.addColorStop(0, 'rgba(60,78,140,0)'); hg.addColorStop(.55, `rgba(120,140,200,${.2 * k})`); hg.addColorStop(1, 'rgba(60,78,140,0)'); ctx.fillStyle = hg; ctx.fillRect(0, hy - 260, W, 480);
      const sky = ctx.createLinearGradient(0, 0, 0, hy); sky.addColorStop(0, `rgba(4,5,18,${.55 * k})`); sky.addColorStop(1, 'rgba(4,5,18,0)'); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, Math.max(0, hy)); }
    // far fog band behind the paths
    if (fogA > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = fogA * .8; ctx.drawImage(fogLayer(0), -200 - ((t * 9 + camx * .1) % 200), mix(-60, 0, Pr.tilt)); ctx.restore(); }
  }
  // the trunk the nib draws (from the near end to the fork), then the three bands from the fork outward
  if (trunk > 0) band(ctx, Pr, 'trunk', trunk, { ...o, t });
  // far bands first (perspective: PRINT runs farthest), then the side ones
  for (const name of ['print', 'take', 'agree']) band(ctx, Pr, name, u[NAMES.indexOf(name)] ?? 1, { ...o, t });
  // the fork knot: a small engraved rosette where the bands part
  if (trunk >= 1 || Math.max(...u) > 0) { const [fx, fy, fs] = Pr.P(0, 0); ctx.save(); ctx.translate(fx, fy); ctx.scale(1, mix(.42, 1, Pr.tilt)); ctx.globalCompositeOperation = 'lighter';
    rosette(ctx, 0, 0, { R: 52 * fs, A: 10 * fs, B: 5 * fs, n: 12, m: 5, lines: 14, col: '#f3efe2', w: .7, a: .5 * a, rot: t * .1 }); ctx.restore(); }
  const along = (name, q) => {
    const C = centre(name), n = C.pts.length - 1, i = clamp(q) * n, i0 = Math.floor(i), i1 = Math.min(n, i0 + 1), f = i - i0;
    const X = mix(C.pts[i0][0], C.pts[i1][0], f), Y = mix(C.pts[i0][1], C.pts[i1][1], f), [x, y] = Pr.P(X, Y);
    const [xa, ya] = Pr.P(...C.pts[Math.max(0, i0 - 1)]), [xb, yb] = Pr.P(...C.pts[Math.min(n, i0 + 2)]);
    return { x, y, ang: Math.atan2(yb - ya, xb - xa) };
  };
  // life on the paths
  if (life.take > 0 && u[0] > .3) {   // TAKE: a jostling crowd and dust
    const r = prng(91), L = life.take, D = dustSprite();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 9; i++) { const q = .32 + r() * .5, p = along('take', q), [, , s] = Pr.P(...centre('take').pts[Math.round(q * 260)]), sz = (90 + r() * 120) * Math.max(.25, s) * (.7 + .3 * Math.sin(t * .7 + i));
      ctx.globalAlpha = .55 * L; ctx.drawImage(D, p.x - sz + drift(t, 14, i), p.y - sz * .8 - 10 * s - (t * 6 + i * 13) % 30, sz * 2, sz * 1.4); }
    ctx.restore();
    for (let i = 0; i < 70; i++) { const q = .3 + r() * .55, off = (r() - .5) * 1.5, C = centre('take'), k = Math.round(q * 260), [X, Y] = C.pts[k], [nx, ny] = C.nrm[k];
      const jx = Math.sin(t * (2 + r() * 2) + i) * 14, jy = Math.cos(t * (1.6 + r()) + i * 1.3) * 10, [x, y, s] = Pr.P(X + nx * off * 70 + jx, Y + ny * off * 70 + jy), h = 26 * s * (.85 + r() * .3);
      if (h < 1.2) continue; ctx.globalAlpha = Math.min(1, L * 1.4) * a; ctx.fillStyle = '#0a0b1c'; ctx.beginPath(); ctx.ellipse(x, y - h * .55, h * .2, h * .5, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(x, y - h * 1.18, h * .16, 0, TAU); ctx.fill();
      ctx.fillStyle = rgba(COL.take, .8); ctx.fillRect(x + h * .12, y - h, Math.max(.8, h * .06), h * .8); }
    ctx.globalAlpha = 1;
  }
  if (life.print > 0 && u[1] > .3) {   // PRINT: a rushing stream of notes
    const r = prng(77), L = life.print, C = centre('print');
    ctx.save(); for (let i = 0; i < 150; i++) { const sp = .09 + r() * .07, q = (r() + t * sp) % 1, off = (r() - .5) * 1.4 + Math.sin(t * 3 + i) * .08, k = Math.round(q * 260), [X, Y] = C.pts[k], [nx, ny] = C.nrm[k];
      const [x, y, s] = Pr.P(X + nx * off * 60, Y + ny * off * 60), w = 22 * s, h = 11 * s; if (w < .8) continue;
      ctx.globalAlpha = L * a * (.5 + .5 * r()) * clamp(q * 8) * clamp((1 - q) * 4); ctx.fillStyle = r() < .6 ? '#bfe8dc' : COL.print; ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(i + t * 4) * .6); ctx.fillRect(-w / 2, -h / 2, w, h); ctx.restore(); }
    ctx.restore(); ctx.globalAlpha = 1;
  }
  if (life.agree > 0 && u[2] > .2) {   // AGREE: one slow foil glint travelling along the line
    const L = life.agree, C = centre('agree'), q0 = (t * .07) % 1;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    const i0 = Math.round(q0 * 260), i1 = Math.min(260, i0 + 26);
    for (const [w, al] of [[16, .08], [6, .28], [2, .95]]) { ctx.strokeStyle = rgba(w > 3 ? COL.agree : '#fff1d6', al * L * a); ctx.lineWidth = w; ctx.beginPath(); for (let i = i0; i <= i1; i++) { const [x, y, s] = Pr.P(...C.pts[i]); ctx.lineWidth = Math.max(.6, w * s); i === i0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
    const p = along('agree', (i1) / 260), gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 60); gr.addColorStop(0, rgba('#fff1d6', .7 * L)); gr.addColorStop(1, rgba(COL.agree, 0)); ctx.fillStyle = gr; ctx.fillRect(p.x - 60, p.y - 60, 120, 120);
    ctx.restore();
  }
  // labels at the far ends (engraved caps; AGREE in foil)
  if (o.labels !== false) {
    const la = (o.labelA ?? 1) * a;
    for (const name of NAMES) {
      const uu = u[NAMES.indexOf(name)] ?? 1; if (uu < .55 || la <= 0) continue;
      const q = name === 'print' ? .5 : .56, p = along(name, q), [, , s] = Pr.P(...centre(name).pts[Math.round(q * 260)]);
      const size = clamp(64 * s * 1.6, 30, 96), al = la * clamp((uu - .55) / .25) * (o.hi ? (o.hi === name ? 1 : .5) : 1), side = name === 'take' ? -1 : name === 'agree' ? 1 : 0;
      const x = p.x + side * 30 * s, y = p.y - 70 * Math.max(.5, s) - size * .2;
      ctx.save(); ctx.shadowColor = 'rgba(2,3,12,.9)'; ctx.shadowBlur = 12;
      text(ctx, LABEL[name], x, y, { size, font: 'Instrument Serif', color: rgba(name === 'agree' ? '#ffd59a' : name === 'print' ? '#9fe0cf' : '#f0a07c', al), align: 'center', spacing: size * .12 });
      ctx.restore();
      if (name === 'agree' && al > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gx = x + Math.sin(t * .9) * size * 1.2, g = ctx.createRadialGradient(gx, y - size * .35, 0, gx, y - size * .35, size * 1.1); g.addColorStop(0, rgba('#fff1d6', .22 * al)); g.addColorStop(1, rgba(COL.agree, 0)); ctx.fillStyle = g; ctx.fillRect(gx - size * 1.2, y - size * 1.5, size * 2.4, size * 2.4); ctx.restore(); }
    }
  }
  // near fog over everything (drifts)
  if (o.bg !== false && fogA > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = fogA * .7; ctx.drawImage(fogLayer(1), -300 + ((t * 14 - camx * .2) % 300 + 300) % 300 - 300, mix(120, 60, Pr.tilt)); ctx.restore(); }
  return { along, fork: { x: Pr.P(0, 0)[0], y: Pr.P(0, 0)[1] }, P: Pr.P, world: (name, q) => { const C = centre(name), i = Math.round(clamp(q) * (C.pts.length - 1)); return C.pts[i]; } };
}
