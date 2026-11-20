// Film 8 · chunk c03 (02a–02c start: the hands) · the world of this chunk around the shared kit. Owner: B1. Others may import, never edit.
//
// ONE CAMERA for the whole chunk. World plane Z = 0 = screen px at the reference camera { x 960, y 540, k 1 }; nearer objects have Z < 0
// (the clip print hangs at Z = −700). cam = { x, y, k }: (x, y) of the Z = 0 plane at the screen centre, k its zoom.
//   S(cam, X, Y, Z) → [sx, sy, s]        project;  plane(ctx, cam, fn) draw fn in Z = 0 coords
//   land(ctx, t, cam, { day 0..1, dusk 0..1, rot (star-field turn, rad), sun { u 0..1 } })   sky (time of day), stars, ridges, ground
//   NET, netRect(cam)                    where the memory hangs (a brain-shaped network, kit weave)
//   gear(ctx, t, x, y, r, ang, a)        the engraved gear the hands turn (2.03)
//   letter(ctx, t, x, y, s, seal 0..1, rot)   a small engraved letter, its wax seal pressing in
//   tower(ctx, t, cam, o)                the Block building at night (no logo): windows lit / going out in waves, people leaving at its foot
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, prng, drift, text } from '../engine.mjs';
import { vnoise, fbm } from './art.mjs';
import { F8, ridgeY, mistBand, landCam, qio, eoutX } from './f8_kit.mjs';

const TAU = Math.PI * 2;
export const FCAM = 1500, FLOOR = 830;
export const NET = { x: 300, y: 110, w: 1240, h: 620 };            // the brain, Z = 0
export function S(c, X, Y, Z = 0) { const s = FCAM / (Z + FCAM / c.k); return [W / 2 + (X - c.x) * s, H / 2 + (Y - c.y) * s, s]; }
export function plane(ctx, c, fn) { ctx.save(); ctx.translate(W / 2 - c.x * c.k, H / 2 - c.y * c.k); ctx.scale(c.k, c.k); fn(ctx); ctx.restore(); }
export const netRect = (c, R = NET) => { const a = S(c, R.x, R.y); return { x: a[0], y: a[1], w: R.w * c.k, h: R.h * c.k }; };
const lerpHex = (a, b, u) => { const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16), f = (s) => Math.round(mix((pa >> s) & 255, (pb >> s) & 255, clamp(u))); return `rgb(${f(16)},${f(8)},${f(0)})`; };
const lerp3 = (n, d, k, day, dusk) => { const base = lerpHex(n, k, day); return dusk > 0 ? lerpHex2(base, d, dusk) : base; };
function lerpHex2(rgbStr, hex, u) { const m = rgbStr.match(/\d+/g).map(Number), pb = parseInt(hex.slice(1), 16), b = [(pb >> 16) & 255, (pb >> 8) & 255, pb & 255]; return `rgb(${m.map((v, i) => Math.round(mix(v, b[i], clamp(u)))).join(',')})`; }

// ---------------------------------------------------------------- sky, stars, ridges, ground (time of day: day 0 night … 1 pale day)
const STARS = (() => { const r = prng(303), s = []; for (let i = 0; i < 900; i++) { const m = r(); s.push([(r() - .5) * 4200, (r() - .5) * 3000, m < .93 ? .5 + r() * .8 : 1.1 + r() * 1.3, r() * TAU, .5 + r() * 1.8]); } return s; })();
const RID = [
  { d: 6, i: 0, c0: '#1d1a4a', c1: '#141436', dc0: '#6f7690', dc1: '#5f6680', rim: '#8a7fd0' },
  { d: 3, i: 1, c0: '#17173e', c1: '#0f1130', dc0: '#58607a', dc1: '#4a5268', rim: '#7a70c0' },
  { d: 1.4, i: 2, c0: '#111334', c1: '#0b0d26', dc0: '#454c64', dc1: '#384058', rim: '#6a62b0' },
];
const RPTS = new Map();
function ridgePts(i) { if (RPTS.has(i)) return RPTS.get(i); const p = []; for (let x = -1400; x <= W + 1400; x += 10) p.push([x, ridgeY(i, x, 1)]); RPTS.set(i, p); return p; }
export function land(ctx, t, c, o = {}) {
  const day = clamp(o.day ?? 0), dusk = clamp(o.dusk ?? 0), night = 1 - day;
  // sky (o.noSky: the caller drew it, e.g. a handoff sky plate)
  if (!o.noSky) {
  const g = ctx.createLinearGradient(0, -120, 0, H);
  g.addColorStop(0, lerp3('#04070f', '#141a3a', '#7f8ea6', day, dusk * .5)); g.addColorStop(.55, lerp3('#0c1424', '#3a2c55', '#a5afbe', day, dusk));
  g.addColorStop(.85, lerp3('#18213c', '#7a4a5a', '#d2cdc0', day, dusk)); g.addColorStop(1, lerp3('#222a46', '#a0605a', '#ddd6c6', day, dusk));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // stars (a far field that turns about a pole above the frame during the time-lapse)
  const sa = Math.pow(night, 2.2) * (1 - .6 * dusk);
  if (sa > .01) {
    const P = landCam({ x: c.x, y: c.y, dist: 1 / c.k }, 40), rot = o.rot ?? 0, px = W * .55, py = -500, cr = Math.cos(rot), sr = Math.sin(rot);
    for (const [x0, y0, s, ph, f] of STARS) {
      const dx = x0, dy = y0 - py + H / 2, X = px + dx * cr - dy * sr + (P.RX(W / 2) - W / 2) * .02, Y = py + dx * sr + dy * cr;
      if (X < -4 || X > W + 4 || Y < -4 || Y > H * .95) continue;
      const tw = .55 + .45 * Math.sin(t * f + ph); ctx.fillStyle = `rgba(243,239,226,${(.3 + .6 * tw) * sa})`; ctx.fillRect(X, Y, s, s);
      if (s > 1.8) { ctx.fillStyle = `rgba(243,239,226,${.08 * tw * sa})`; ctx.fillRect(X - s * 1.5, Y + s / 2 - .4, s * 4, .8); }
    }
  }
  }
  // the sun crossing the sky (2.05 "all day")
  if (o.sun && o.sun.u > 0 && o.sun.u < 1) { const u = o.sun.u, sx = mix(-80, W + 80, u), sy = H * .62 - Math.sin(Math.PI * u) * H * .5, rg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 180);
    rg.addColorStop(0, rgba('#fff6e2', .95 * (o.sun.a ?? 1))); rg.addColorStop(.12, rgba('#ffe7b8', .7 * (o.sun.a ?? 1))); rg.addColorStop(1, 'rgba(255,231,184,0)'); ctx.fillStyle = rg; ctx.fillRect(sx - 180, sy - 180, 360, 360); }
  // ridges with mist
  const cam = { x: c.x, y: c.y, dist: 1 / c.k };
  for (const R of RID) {
    const P = landCam(cam, R.d), pts = ridgePts(R.i);
    if ((o.mist ?? 1) > 0) mistBand(ctx, t, cam, R.d + .2, (R.i === 0 ? 590 : R.i === 1 ? 650 : 740) + 10, { seed: 3 + R.i, a: (o.mist ?? 1) * (.5 - R.i * .08) * (1 - .5 * day), v: 5 + R.i * 3, col: day > .5 ? '#c7c6d6' : '#5d5a9c' });
    ctx.beginPath(); let first = true, top = 1e9;
    for (const [x, y] of pts) { const X = P.RX(x), Y = P.RY(y); if (X < -40 || X > W + 40) continue; top = Math.min(top, Y); if (first) { ctx.moveTo(X, H + 10); ctx.lineTo(X, Y); first = false; } else ctx.lineTo(X, Y); }
    if (first) continue; ctx.lineTo(W + 40, H + 10); ctx.closePath();
    const gr = ctx.createLinearGradient(0, top, 0, top + 420 * P.s); gr.addColorStop(0, lerpHex(R.c0, R.dc0, day)); gr.addColorStop(1, lerpHex(R.c1, R.dc1, day)); ctx.fillStyle = gr; ctx.fill();
    ctx.strokeStyle = rgba(R.rim, .4 * (1 - .5 * day)); ctx.lineWidth = 1.4; ctx.stroke();
  }
  // the near ground (Z = 0 plane), dark earth with engraved grass ticks
  plane(ctx, c, (g2) => {
    const y = FLOOR, gr = g2.createLinearGradient(0, y, 0, y + 300); gr.addColorStop(0, lerpHex('#0e1226', '#3a4054', day)); gr.addColorStop(1, lerpHex('#05060f', '#22283a', day));
    g2.fillStyle = gr; g2.fillRect(-4000, y, 9000, 3000);
    g2.strokeStyle = rgba('#7a74b8', .3); g2.lineWidth = 1.2 / Math.max(.5, c.k); g2.beginPath(); g2.moveTo(-4000, y + .5); g2.lineTo(5000, y + .5); g2.stroke();
    const r = prng(61); g2.strokeStyle = rgba('#6f6aa8', .2); g2.lineWidth = 1 / Math.max(.5, c.k); g2.beginPath();
    for (let i = 0; i < 700; i++) { const x = -3000 + r() * 7000, yy = y + 4 + r() * r() * 200, L = 3 + r() * 6, sw = Math.sin(t * .8 + i) * 1.2; g2.moveTo(x, yy); g2.lineTo(x + sw + 1, yy - L); } g2.stroke();
  });
}

// ---------------------------------------------------------------- engraved props
export function gear(ctx, t, x, y, r, ang = 0, a = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); const n = 12, k = r / 60;
  ctx.beginPath();
  for (let i = 0; i < n; i++) { const q0 = i / n * TAU, q1 = (i + .5) / n * TAU, w = .11; ctx.lineTo(Math.cos(q0 - w) * r, Math.sin(q0 - w) * r); ctx.lineTo(Math.cos(q0 - w * .6) * r * 1.18, Math.sin(q0 - w * .6) * r * 1.18); ctx.lineTo(Math.cos(q0 + w * .6) * r * 1.18, Math.sin(q0 + w * .6) * r * 1.18); ctx.lineTo(Math.cos(q0 + w) * r, Math.sin(q0 + w) * r); ctx.lineTo(Math.cos(q1) * r * .99, Math.sin(q1) * r * .99); }
  ctx.closePath(); ctx.moveTo(r * .32, 0); ctx.arc(0, 0, r * .32, 0, TAU, true);
  ctx.fillStyle = rgba('#141838', a); ctx.fill('evenodd'); ctx.strokeStyle = rgba(o.rim || '#cfc6ee', .75 * a); ctx.lineWidth = 1.4; ctx.stroke();
  ctx.save(); ctx.clip('evenodd'); ctx.strokeStyle = rgba('#000000', .5 * a); ctx.lineWidth = 1; ctx.beginPath(); for (let d = -r * 1.3; d < r * 1.3; d += 4.5 * Math.max(.6, k)) { ctx.moveTo(d, -r * 1.3); ctx.lineTo(d + r * .6, r * 1.3); } ctx.stroke(); ctx.restore();
  ctx.strokeStyle = rgba(o.rim || '#cfc6ee', .45 * a); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(0, 0, r * .62, 0, TAU); ctx.stroke();
  for (let i = 0; i < 4; i++) { const q = i / 4 * TAU; ctx.beginPath(); ctx.moveTo(Math.cos(q) * r * .32, Math.sin(q) * r * .32); ctx.lineTo(Math.cos(q) * r * .62, Math.sin(q) * r * .62); ctx.stroke(); }
  // a green light where the hands touched it last
  if (o.lit) { ctx.globalCompositeOperation = 'lighter'; const gg = ctx.createRadialGradient(r * .9, -r * .4, 0, r * .9, -r * .4, r * 1.2); gg.addColorStop(0, rgba(F8.green, .35 * o.lit)); gg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.rotate(-ang); ctx.fillStyle = gg; ctx.fillRect(-r * 2, -r * 2, r * 4, r * 4); }
  ctx.restore();
}
export function letter(ctx, t, x, y, s = 1, seal = 0, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = '#e9dfc4'; ctx.strokeStyle = '#4a3e36'; ctx.lineWidth = 1 / s; ctx.beginPath(); ctx.rect(-22, -14, 44, 28); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-22, -14); ctx.lineTo(0, 3); ctx.lineTo(22, -14); ctx.stroke();
  ctx.strokeStyle = 'rgba(80,60,40,.35)'; ctx.beginPath(); for (let i = -20; i < 22; i += 3) { ctx.moveTo(i, 14); ctx.lineTo(i + 6, 6); } ctx.stroke();
  if (seal > 0) { const e = eoutX(seal), sq = 1 + .25 * (1 - e); ctx.fillStyle = rgba('#8e2f2a', Math.min(1, seal * 3)); ctx.beginPath(); ctx.arc(0, 3, 6 * sq, 0, TAU); ctx.fill(); ctx.strokeStyle = rgba('#3a0e0a', .6 * e); ctx.beginPath(); ctx.arc(0, 3, 3.4, 0, TAU); ctx.stroke(); }
  ctx.restore();
}
// a little standing figure in profile (the YC team, 2.05): engraved, faceless, breathing
export function smallFigure(ctx, t, x, y, h, o = {}) {
  const k = h / 100, d = o.dir ?? 1, b = Math.sin(t * 1.5 + (o.seed || 0)) * .8, coat = o.coat || '#2a3046';
  ctx.save(); ctx.translate(x, y); ctx.scale(k * d, k); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.strokeStyle = '#141626'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-4, -40); ctx.lineTo(-6, -1); ctx.moveTo(5, -40); ctx.lineTo(7, -1); ctx.stroke();
  ctx.fillStyle = coat; ctx.beginPath(); ctx.moveTo(-11, -36); ctx.bezierCurveTo(-12, -55, -11, -72, -8, -78 + b); ctx.quadraticCurveTo(0, -83 + b, 8, -78 + b); ctx.bezierCurveTo(11, -72, 12, -55, 11, -36); ctx.quadraticCurveTo(0, -33, -11, -36); ctx.fill();
  ctx.fillStyle = o.skin || '#b98a6a'; ctx.beginPath(); ctx.arc(1, -90 + b, 8, 0, TAU); ctx.fill(); ctx.fillStyle = o.hair || '#1e1618'; ctx.beginPath(); ctx.arc(-.5, -92 + b, 8.2, Math.PI * .95, Math.PI * 2.05); ctx.fill();
  const arm = o.arm ?? .15; ctx.strokeStyle = coat; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(3, -74 + b); ctx.lineTo(3 + Math.sin(arm) * 15, -74 + Math.cos(arm) * 15 + b); ctx.lineTo(3 + Math.sin(arm) * 15 + Math.sin(arm + .5) * 14, -74 + Math.cos(arm) * 15 + Math.cos(arm + .5) * 14 + b); ctx.stroke();
  if (o.rim) { ctx.strokeStyle = rgba(o.rim, .6); ctx.lineWidth = 1.4 / k; ctx.beginPath(); ctx.moveTo(9, -76 + b); ctx.bezierCurveTo(12, -66, 12, -50, 11, -38); ctx.moveTo(6, -97 + b); ctx.quadraticCurveTo(9.5, -90 + b, 6, -83 + b); ctx.stroke(); }
  ctx.restore();
}

// ---------------------------------------------------------------- the Block building (2.13): a tall engraved office block at night
export const TOWER = { x: -1750, w: 560, top: -230, cols: 16, rows: 38, base: FLOOR, side: 96 };
const RH = (TOWER.base - 70 - TOWER.top - 60) / TOWER.rows, CW = TOWER.w / TOWER.cols;
const twin = (i, j) => { const T = TOWER; return { x: T.x - T.w / 2 + i * CW + CW * .14, y: T.top + 60 + j * RH + RH * .2, w: CW * .72, h: RH * .62 }; };
export const towerWin = twin;
// per-window character: tint, a lamp, a figure at a desk, blinds (deterministic)
const WCH = (() => { const r = prng(4411), m = []; for (let j = 0; j < TOWER.rows; j++) for (let i = 0; i < TOWER.cols; i++) { const v = r(); m.push({ tint: v < .55 ? 0 : v < .85 ? 1 : 2, lamp: r() < .18 ? r() : -1, fig: r() < .16 ? r() : -1, blind: r() < .25 ? .2 + r() * .5 : 0, ph: r() * TAU }); } return m; })();
const TINTS = [['#f6e8c4', '#e7cf98'], ['#ffd9a0', '#e8b56e'], ['#e4ecf2', '#b9c8d6']];
// out(i, j) → 0..1 progress of that window going out (it flickers as it goes); dim(i, j) → brightness of a lit window (1 = full)
export function tower(ctx, t, c, o = {}) {
  const T = TOWER, out = o.out || (() => 0), dim = o.dim || (() => 1), k = c.k;
  plane(ctx, c, (g) => {
    const x0 = T.x - T.w / 2, x1 = T.x + T.w / 2, lw = 1 / Math.max(.3, k), sd = T.side;
    const lit = o.litFrac ?? 1;
    // glow in the night around it and its light on the ground
    let gl = g.createRadialGradient(T.x, T.base - 300, 0, T.x, T.base - 300, 1100); gl.addColorStop(0, rgba('#e9d2a0', .12 * lit)); gl.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gl; g.fillRect(T.x - 1100, T.base - 1400, 2200, 1500);
    gl = g.createLinearGradient(0, T.base, 0, T.base + 160); gl.addColorStop(0, rgba('#f1dcae', .2 * lit)); gl.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gl; g.beginPath(); g.moveTo(x0, T.base); g.lineTo(x1 + sd, T.base); g.lineTo(x1 + sd + 260, T.base + 160); g.lineTo(x0 - 260, T.base + 160); g.fill();
    // the side face (darker, few narrow windows)
    g.fillStyle = '#0b0d24'; g.fillRect(x1, T.top + 34, sd, T.base - T.top - 34);
    for (let j = 0; j < T.rows; j++) for (let q = 0; q < 3; q++) { const y = T.top + 60 + j * RH + RH * .2, x = x1 + 10 + q * 30, u = clamp(out(T.cols - 1, j)); const on = (1 - u) * (u > 0 ? .55 + .45 * Math.cos(u * 21) : 1) * dim(T.cols - 1, j);
      g.fillStyle = on > .02 ? lerpHex('#191a30', '#b9a57c', on * .75) : '#090a18'; g.fillRect(x, y, 16, RH * .62); }
    g.strokeStyle = rgba('#6a62b0', .35); g.lineWidth = lw; g.strokeRect(x1, T.top + 34, sd, T.base - T.top - 34);
    // the front: a slab with a setback crown
    const body = () => { g.beginPath(); g.moveTo(x0, T.base); g.lineTo(x0, T.top + 34); g.lineTo(x0 + 26, T.top + 34); g.lineTo(x0 + 26, T.top); g.lineTo(x1 - 26, T.top); g.lineTo(x1 - 26, T.top + 34); g.lineTo(x1, T.top + 34); g.lineTo(x1, T.base); g.closePath(); };
    const bg = g.createLinearGradient(x0, 0, x1, 0); bg.addColorStop(0, '#171b3e'); bg.addColorStop(.6, '#12163a'); bg.addColorStop(1, '#0e1130'); g.fillStyle = bg; body(); g.fill();
    // windows: lit panes with lamps, people at desks, blinds; a soft halo; they flicker out
    g.save(); g.globalCompositeOperation = 'lighter';
    for (let j = 0; j < T.rows; j++) for (let i = 0; i < T.cols; i++) { const u = clamp(out(i, j)); if (u >= 1) continue; const R = twin(i, j), on = (1 - u) * (u > 0 ? .5 + .5 * Math.cos(u * 23) : 1) * dim(i, j); g.fillStyle = rgba('#f0d49a', .07 * on * lit); g.fillRect(R.x - 6, R.y - 5, R.w + 12, R.h + 10); }
    g.restore();
    for (let j = 0; j < T.rows; j++) for (let i = 0; i < T.cols; i++) {
      const R = twin(i, j), u = clamp(out(i, j)), ch = WCH[j * T.cols + i];
      const on = u >= 1 ? 0 : (1 - u) * (u > 0 ? .5 + .5 * Math.cos(u * 23) : 1) * (.93 + .07 * Math.sin(t * .6 + ch.ph)) * dim(i, j);
      if (on <= .02) { g.fillStyle = '#0a0b1c'; g.fillRect(R.x, R.y, R.w, R.h); g.fillStyle = 'rgba(120,118,180,.08)'; g.fillRect(R.x + R.w * .55, R.y, R.w * .12, R.h); continue; }
      const [ca, cb] = TINTS[ch.tint], wg = g.createLinearGradient(0, R.y, 0, R.y + R.h); wg.addColorStop(0, lerpHex('#2a2840', ca, on)); wg.addColorStop(1, lerpHex('#221f34', cb, on)); g.fillStyle = wg; g.fillRect(R.x, R.y, R.w, R.h);
      if (k * R.w > 9) {
        if (ch.blind) { g.fillStyle = rgba('#5a4a3a', .35 * on); for (let b = 0; b < ch.blind * R.h; b += 2.2) g.fillRect(R.x, R.y + b, R.w, 1); }
        if (ch.lamp >= 0) { const lx = R.x + R.w * (.15 + .7 * ch.lamp); g.fillStyle = rgba('#fff4d0', .9 * on); g.beginPath(); g.arc(lx, R.y + R.h * .58, 1.6, 0, TAU); g.fill(); }
        if (ch.fig >= 0) { const fx = R.x + R.w * (.2 + .6 * ch.fig); g.fillStyle = rgba('#2a2236', .8 * on); g.beginPath(); g.arc(fx, R.y + R.h * .45, R.h * .13, 0, TAU); g.fill(); g.fillRect(fx - R.h * .2, R.y + R.h * .58, R.h * .4, R.h * .42); }
        g.fillStyle = rgba('#1a1a2c', .55); g.fillRect(R.x + R.w * .5 - .5, R.y, 1, R.h);   // mullion
      }
    }
    // piers and spandrels (engraved): vertical piers with a rim on their right edge, a floor band each storey
    g.save(); body(); g.clip();
    g.strokeStyle = rgba('#8b84c8', .16); g.lineWidth = lw; g.beginPath();
    for (let i = 0; i <= T.cols; i++) { const x = x0 + i * CW + CW * .07; g.moveTo(x, T.top + 50); g.lineTo(x, T.base - 70); } g.stroke();
    g.strokeStyle = rgba('#8b84c8', .12); g.beginPath(); for (let j = 0; j <= T.rows; j++) { const y = T.top + 60 + j * RH; g.moveTo(x0, y); g.lineTo(x1, y); } g.stroke();
    if (k > 1.2) { g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = .6 * lw; g.beginPath(); for (let j = 0; j < T.rows; j++) { const y = T.top + 60 + j * RH + RH * .86; for (let q = 0; q < 3; q++) { g.moveTo(x0, y + q * 1.3); g.lineTo(x1, y + q * 1.3); } } g.stroke(); }
    g.restore();
    g.strokeStyle = rgba('#a49ad8', .6); g.lineWidth = 1.4 * lw; body(); g.stroke();
    // the cornice and the crown: a band of light, a mast with a slow red light
    g.fillStyle = rgba('#e9d9b0', .5 * lit); g.fillRect(x0 + 26, T.top + 10, T.w - 52, 3);
    g.strokeStyle = rgba('#a49ad8', .7); g.lineWidth = 2 * lw; g.beginPath(); g.moveTo(T.x + 60, T.top); g.lineTo(T.x + 60, T.top - 170); g.moveTo(T.x + 60, T.top - 60); g.lineTo(T.x + 40, T.top); g.moveTo(T.x + 60, T.top - 60); g.lineTo(T.x + 80, T.top); g.stroke();
    { const bl = Math.pow(.5 + .5 * Math.sin(t * 3.4), 6); const rg = g.createRadialGradient(T.x + 60, T.top - 172, 0, T.x + 60, T.top - 172, 22); rg.addColorStop(0, rgba('#ff5a4a', .9 * bl)); rg.addColorStop(1, 'rgba(255,90,74,0)'); g.fillStyle = rg; g.fillRect(T.x + 38, T.top - 194, 44, 44); g.fillStyle = '#ff7a64'; g.fillRect(T.x + 58.5, T.top - 173.5, 3, 3); }
    // the lobby: a lit glass base with a canopy
    const lb = g.createLinearGradient(0, T.base - 60, 0, T.base); lb.addColorStop(0, rgba('#f6e7c2', .75 * lit)); lb.addColorStop(1, rgba('#d6b878', .55 * lit)); g.fillStyle = lb; g.fillRect(x0 + 40, T.base - 60, T.w - 80, 60);
    g.strokeStyle = rgba('#2a2a40', .7); g.lineWidth = 1.2 * lw; g.beginPath(); for (let x = x0 + 40; x <= x1 - 40; x += 40) { g.moveTo(x, T.base - 60); g.lineTo(x, T.base); } g.stroke();
    g.fillStyle = '#0d0f26'; g.fillRect(x0 + 20, T.base - 70, T.w - 40, 8); g.strokeStyle = rgba('#a49ad8', .5); g.lineWidth = lw; g.strokeRect(x0 + 20, T.base - 70, T.w - 40, 8);
  });
}
