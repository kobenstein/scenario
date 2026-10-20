// C01 (Film 4 minute 1) · the opening take, 1.01 → 1.03: a dark office, the wall rack of time cards, your card, its back is
// the engraved income slip, the slip fans out into a row of slips (one per month) running to the light on the horizon.
// One world per part, both seen through the same pinhole camera (cam3); every frame is a pure function of t.
//   openTake(ctx, t, K)     the whole take (K = anchors from scenes/sc01.mjs)  → { light: [x, y] } (the far light on screen)
//   rowLight(t, K)          screen point of the far light (for the zoom into 1.04)
//   slipTex(res, o)         the income slip as a cached texture (also used on the wall in 1.09)
//   cam3, quadSprite, once, eoX, eiX, qio   small helpers shared with lib/sc01_m1_world.mjs
import { W, H, rgba, clamp, mix, eio, sm, prng, drift, canvas, text } from '../engine.mjs';
import { stipple, vnoise, fbm } from './art.mjs';
import { gBorder, rosette, microtext, seal, guilloche, FOIL } from './certificate.mjs';
import { ghostLine } from './ghost.mjs';
import { scribble } from './paper.mjs';

const CACHE = new Map(); export const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
export const eoX = (x) => (x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * x));            // expo-out (landings)
export const eiX = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, 10 * x - 10));            // expo-in (exits)
export const qio = (x) => { x = clamp(x); return x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2; };   // quart in-out (moves)
const TAU = Math.PI * 2;

// ---------- pinhole camera: world y up, the camera looks along -Z rotated by yaw (+ = to the right) and pitch (+ = up) ----------
export function cam3(o) {
  const cy = Math.cos(o.yaw || 0), sy = Math.sin(o.yaw || 0), cp = Math.cos(o.pitch || 0), sp = Math.sin(o.pitch || 0), F = o.f || 1400, ox = o.ox ?? W / 2, oy = o.oy ?? H / 2;
  const P = (X, Y, Z) => {
    const dx = X - o.x, dy = Y - o.y, dz = Z - o.z;
    const xc = dx * cy + dz * sy, zc0 = dx * sy - dz * cy;
    const yc = dy * cp - zc0 * sp, zc = dy * sp + zc0 * cp, q = F / Math.max(1, zc);
    return [ox + xc * q, oy - yc * q, zc];
  };
  P.F = F; return P;
}
// draw img onto a projected quad (corners TL, TR, BR, BL on screen): n vertical strips, each an affine map (n = 1: no clip)
export function quadSprite(ctx, img, q, n = 1, a = 1) {
  const [A, B, C, D] = q, iw = img.width, ih = img.height;
  ctx.save(); ctx.globalAlpha = a;
  for (let i = 0; i < n; i++) {
    const u0 = i / n, u1 = (i + 1) / n;
    const t0 = [mix(A[0], B[0], u0), mix(A[1], B[1], u0)], t1 = [mix(A[0], B[0], u1), mix(A[1], B[1], u1)];
    const b0 = [mix(D[0], C[0], u0), mix(D[1], C[1], u0)], b1 = [mix(D[0], C[0], u1), mix(D[1], C[1], u1)];
    const sw = iw * (u1 - u0), aa = (t1[0] - t0[0]) / sw, bb = (t1[1] - t0[1]) / sw, cc = (b0[0] - t0[0]) / ih, dd = (b0[1] - t0[1]) / ih;
    if (n > 1) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const e = .6; ctx.beginPath(); ctx.moveTo(t0[0] - e, t0[1] - e); ctx.lineTo(t1[0] + e, t1[1] - e); ctx.lineTo(b1[0] + e, b1[1] + e); ctx.lineTo(b0[0] - e, b0[1] + e); ctx.closePath(); ctx.clip(); }
    ctx.setTransform(aa, bb, cc, dd, t0[0] - aa * iw * u0, t0[1] - bb * iw * u0);
    ctx.drawImage(img, 0, 0);
    if (n > 1) ctx.restore();
  }
  ctx.restore();
}
const poly = (ctx, pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); };
function foilGrad(g, x, y, w, h, ang = .3) { const gr = g.createLinearGradient(x, y, x + Math.cos(ang) * w, y + Math.sin(ang) * h); FOIL.forEach((c, i) => gr.addColorStop(i / (FOIL.length - 1), c)); return gr; }
function paperFibres(g, w, h, seed, n) { const r = prng(seed); g.lineCap = 'round'; for (let i = 0; i < n; i++) { const px = r() * w, py = r() * h, L = 2 + r() * 12, a0 = r() * TAU; g.strokeStyle = r() < .5 ? `rgba(255,252,240,${.15 + r() * .25})` : `rgba(110,85,50,${.06 + r() * .12})`; g.lineWidth = .5; g.beginPath(); g.moveTo(px, py); g.lineTo(px + Math.cos(a0) * L, py + Math.sin(a0) * L); g.stroke(); } }

// =====================================================================================================================
// 1.01 · the time card (world units: 180 × 342; rows of two weeks; times punched in amber ink)
// =====================================================================================================================
export const CARD = { w: 180, h: 342, row0: 92, rowH: 17.2, rows: 14, cols: [8, 30, 67, 104, 141, 172] };
const DAYS = 'MTWTFSSMTWTFSS';
const INK = '#2a3346', AMB_INK = '#b8621f';
// texture of one card; res = px per world unit; o: { seed, past (rows punched), ghostFrom (rows >= this: no rules, drawn live), num }
export function cardTex(res, o = {}) {
  const key = 'card' + JSON.stringify([res, o]);
  return once(key, () => {
    const { w, h } = CARD, [c, g] = canvas(Math.ceil(w * res), Math.ceil(h * res)), r = prng(o.seed ?? 1);
    g.scale(res, res);
    // manila stock: warm, a little darker at the edges, rounded corners, fibres
    g.beginPath(); g.roundRect(0, 0, w, h, 5);
    const pg = g.createLinearGradient(0, 0, w * .4, h); pg.addColorStop(0, '#efe2bf'); pg.addColorStop(.6, '#e6d6ad'); pg.addColorStop(1, '#d4c193'); g.fillStyle = pg; g.fill();
    g.save(); g.clip(); if (res >= 1) paperFibres(g, w, h, (o.seed ?? 1) + 3, 700);
    // header: number, name, week
    g.fillStyle = '#8e2f2a'; g.font = '15px "Instrument Serif"'; g.fillText('Nº', 10, 24); g.font = '600 13px "Inter"'; g.fillText(String(o.num ?? 417).padStart(4, '0'), 30, 24);
    g.strokeStyle = rgba(INK, .55); g.lineWidth = .6; g.beginPath(); g.moveTo(8, 32); g.lineTo(w - 8, 32); g.stroke();
    g.fillStyle = rgba(INK, .7); g.font = '600 5.2px "Inter"'; try { g.letterSpacing = '1px'; } catch { }
    g.fillText('NAME', 9, 44); g.fillText('WEEK ENDING', 9, 66); try { g.letterSpacing = '0px'; } catch { }
    scribble(g, 34, 46, 120, 7, { seed: (o.seed ?? 1) * 7 + 1, ink: '#1f1a2e', lw: 1.1 });
    scribble(g, 58, 67, 70, 5, { seed: (o.seed ?? 1) * 7 + 2, ink: '#1f1a2e', lw: .9 });
    g.lineWidth = .5; g.strokeStyle = rgba(INK, .5); g.beginPath(); g.moveTo(32, 48); g.lineTo(w - 10, 48); g.moveTo(54, 69); g.lineTo(w - 10, 69); g.stroke();
    g.lineWidth = 1.1; g.strokeStyle = rgba(INK, .75); g.beginPath(); g.moveTo(6, 78); g.lineTo(w - 6, 78); g.moveTo(6, 81); g.lineTo(w - 6, 81); g.stroke();
    // table head
    g.font = '600 4.6px "Inter"'; g.fillStyle = rgba(INK, .75); [['IN', 48], ['OUT', 85], ['IN', 122], ['OUT', 156]].forEach(([s, x]) => { g.textAlign = 'center'; g.fillText(s, x, 89); }); g.textAlign = 'left';
    const { row0, rowH, rows, cols } = CARD, gf = o.ghostFrom ?? 99;
    for (let i = 0; i < rows; i++) {
      const y = row0 + i * rowH;
      if (i === 7) { g.fillStyle = rgba(INK, .14); g.fillRect(6, y - 1, w - 12, 2); }
      g.fillStyle = rgba(INK, i < gf ? .75 : .35); g.font = '600 6px "Inter"'; g.fillText(DAYS[i], 13, y + 11.5);
      if (i < gf) { g.strokeStyle = rgba(INK, .45); g.lineWidth = .45; g.beginPath(); g.moveTo(6, y + rowH); g.lineTo(w - 6, y + rowH); for (const cx of cols.slice(1, -1)) { g.moveTo(cx, y); g.lineTo(cx, y + rowH); } g.stroke(); }
      // punched times: amber ink, a little crooked, uneven pressure
      if (i < (o.past ?? 0) && DAYS[i] !== 'S') {
        const tm = [`${8 + (r() < .2)}:${String(Math.floor(r() * 59)).padStart(2, '0')}`, `12:${String(Math.floor(r() * 30)).padStart(2, '0')}`, `12:${String(30 + Math.floor(r() * 29)).padStart(2, '0')}`, `17:${String(Math.floor(r() * 59)).padStart(2, '0')}`];
        g.font = '600 8.4px "Inter"'; g.textAlign = 'center';
        tm.forEach((s, k) => { g.save(); g.translate((cols[k + 1] + cols[k + 2]) / 2 + (r() - .5) * 2, y + 12.2 + (r() - .5) * 1.2); g.rotate((r() - .5) * .06); g.fillStyle = rgba(AMB_INK, .72 + r() * .25); g.fillText(s, 0, 0); g.fillStyle = rgba(AMB_INK, .18); g.fillText(s, .6, .4); g.restore(); });
        g.textAlign = 'left';
      }
    }
    g.restore();
    g.strokeStyle = 'rgba(90,70,40,.45)'; g.lineWidth = .8; g.beginPath(); g.roundRect(0, 0, w, h, 5); g.stroke();
    g.setTransform(1, 0, 0, 1, 0, 0); if (res >= 1) stipple(c, { k: .2, g: 1, seed: (o.seed ?? 1) + 11, mid: false, boost: 1 });
    return c;
  });
}
// the future rows of the hero card as polylines (card units)
function futureLines(gf) {
  const { row0, rowH, rows, cols, w } = CARD, out = [];
  for (let i = gf; i < rows; i++) { const y = row0 + i * rowH; out.push({ i, pts: [[6, y + rowH], [w - 6, y + rowH]] }); for (const cx of cols.slice(1, -1)) out.push({ i, pts: [[cx, y + 1], [cx, y + rowH - 1]] }); }
  return out;
}

// ---------- the rack (world: the wall is Z = 0, x right, y up, the camera in front at Z > 0) ----------
const RACK = { cols: 24, pitchX: 236, rows: 6, pitchY: 420, y0: -2.5, plateH: 172, depth: 30, hero: { i: 15, j: 2 } };
const colX = (i) => i * RACK.pitchX, rowY = (j) => (j + RACK.y0) * RACK.pitchY;   // plate top of row j
// one card's world corners (TL, TR, BR, BL); lift = how far it slid up; z = distance off the wall
function cardQuad(P, i, j, lift = 0, z = 9, w = CARD.w, h = CARD.h) {
  const x = colX(i) - w / 2, y1 = rowY(j) + 230 + lift, y0 = y1 - h;
  return [P(x, y1, z), P(x + w, y1, z), P(x + w, y0, z), P(x, y0, z)];
}
const rackLight = (t, K) => {   // the amber light sweeping along the rack (world x on the wall), settles on your card
  const hx = colX(RACK.hero.i), u = qio(clamp((t - .2) / (K.never - .35)));
  return { x: mix(-300, hx, u) + Math.sin(t * 1.3) * 18 * (1 - u), y: mix(260, rowY(RACK.hero.j) + 60, u) + Math.sin(t * .9) * 10, r: mix(520, 360, u) };
};
export function rackCam(t, K) {
  const hx = colX(RACK.hero.i), hy = rowY(RACK.hero.j) + 124;
  const u = qio(clamp((t - .9) / (K.never - .15 - .9)));                       // the glide, landing just before "never"
  const pre = clamp(t / .9);                                                    // the pre-roll creep
  const push = eio(clamp((t - K.never) / (K.again - K.never)));                 // a slow lean in while it turns to ghost
  const lift = eoX(clamp((t - K.again) / .7));
  return { x: mix(-1350 + 120 * pre, hx, u) + drift(t, 6, 1), y: mix(160, hy, u) + 62 * lift + drift(t, 4, 2), z: mix(1250 - 60 * pre, 500, u) - 40 * push + 120 * lift,
    yaw: mix(.78, 0, u) + .004 * Math.sin(t * .7), pitch: mix(-.06, 0, u), f: 1400 };
}
function poolTex() { return once('pool', () => { const S = 1024, [c, g] = canvas(S, S), rg = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2); rg.addColorStop(0, 'rgba(255,196,120,.85)'); rg.addColorStop(.25, 'rgba(255,170,90,.42)'); rg.addColorStop(.6, 'rgba(255,150,70,.1)'); rg.addColorStop(1, 'rgba(255,140,60,0)'); g.fillStyle = rg; g.fillRect(0, 0, S, S); return c; }); }
function wallTex() {   // the office wall: dark plaster with engraved hatch and a dado rail (world units 7000 × 2400, res .5)
  return once('wall', () => {
    const res = .35, w = 7600, h = 2600, [c, g] = canvas(Math.ceil(w * res), Math.ceil(h * res)), n = vnoise(5), r = prng(9);
    g.scale(res, res);
    const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#0c1122'); bg.addColorStop(.6, '#121a30'); bg.addColorStop(1, '#0a0e1c'); g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 2.4; g.beginPath(); for (let x = -h; x < w; x += 9 + r() * 4) { g.moveTo(x, 0); g.lineTo(x + h * .55, h); } g.stroke();
    for (let i = 0; i < 900; i++) { const x = r() * w, y = r() * h, a = .04 + .06 * fbm(n, x * .002, y * .002, 3); g.fillStyle = `rgba(150,170,220,${a})`; g.fillRect(x, y, 6, 6); }
    g.fillStyle = '#070a14'; g.fillRect(0, h - 520, w, 14); g.fillStyle = 'rgba(160,180,230,.12)'; g.fillRect(0, h - 522, w, 3);
    for (let x = 300; x < w; x += 1400) { g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(x, 0, 6, h - 520); }
    return c;
  });
}
// the punch clock beside the rack: a cast housing, a cream dial, the card slot below (texture, world 380 × 560)
const CLOCK = { x: -620, y: 40, z: 60, w: 380, h: 560 };
function clockTex() {
  return once('clock', () => {
    const res = 2, { w, h } = CLOCK, [c, g] = canvas(w * res, h * res); g.scale(res, res);
    const body = g.createLinearGradient(0, 0, w, h); body.addColorStop(0, '#3a4258'); body.addColorStop(.5, '#232a3d'); body.addColorStop(1, '#141826');
    g.fillStyle = body; g.beginPath(); g.moveTo(30, 0); g.lineTo(w - 30, 0); g.quadraticCurveTo(w, 0, w, 40); g.lineTo(w, h - 20); g.quadraticCurveTo(w, h, w - 20, h); g.lineTo(20, h); g.quadraticCurveTo(0, h, 0, h - 20); g.lineTo(0, 40); g.quadraticCurveTo(0, 0, 30, 0); g.fill();
    g.strokeStyle = 'rgba(210,220,255,.18)'; g.lineWidth = 3; g.stroke();
    // dial: bezel, cream face, minute ticks, numerals
    const cx = w / 2, cy = 200, R = 150;
    const bz = g.createLinearGradient(cx - R, cy - R, cx + R, cy + R); bz.addColorStop(0, '#9aa3b8'); bz.addColorStop(.5, '#3b4256'); bz.addColorStop(1, '#1a1e2b'); g.fillStyle = bz; g.beginPath(); g.arc(cx, cy, R + 16, 0, TAU); g.fill();
    const fg = g.createRadialGradient(cx - 40, cy - 50, 10, cx, cy, R); fg.addColorStop(0, '#f6eedb'); fg.addColorStop(1, '#d9caa6'); g.fillStyle = fg; g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.fill();
    g.strokeStyle = INK; for (let k = 0; k < 60; k++) { const a = k / 60 * TAU, L = k % 5 ? 8 : 18; g.lineWidth = k % 5 ? 1.4 : 3.2; g.beginPath(); g.moveTo(cx + Math.sin(a) * (R - 6), cy - Math.cos(a) * (R - 6)); g.lineTo(cx + Math.sin(a) * (R - 6 - L), cy - Math.cos(a) * (R - 6 - L)); g.stroke(); }
    g.fillStyle = INK; g.font = '34px "Instrument Serif"'; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (let k = 1; k <= 12; k++) { const a = k / 12 * TAU; g.fillText(String(k), cx + Math.sin(a) * (R - 46), cy - Math.cos(a) * (R - 46) + 2); }
    rosette(g, cx, cy, { R: 34, A: 9, B: 4, n: 12, m: 5, lines: 14, col: '#8a5a24', w: .6, a: .5 });
    // glass sheen
    const sh = g.createLinearGradient(cx - R, cy - R, cx + R * .2, cy + R * .3); sh.addColorStop(0, 'rgba(255,255,255,.18)'); sh.addColorStop(.5, 'rgba(255,255,255,0)'); g.fillStyle = sh; g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.fill();
    // name plate, card slot, two screws
    g.fillStyle = '#b89a5c'; g.fillRect(cx - 70, 388, 140, 26); g.strokeStyle = 'rgba(60,40,10,.6)'; g.lineWidth = 1; g.strokeRect(cx - 66, 392, 132, 18);
    g.fillStyle = '#05060b'; g.fillRect(cx - 62, 456, 124, 16); g.fillStyle = 'rgba(200,210,240,.25)'; g.fillRect(cx - 62, 472, 124, 2);
    for (const sx of [34, w - 34]) { g.fillStyle = '#5a6278'; g.beginPath(); g.arc(sx, h - 34, 7, 0, TAU); g.fill(); }
    g.textBaseline = 'alphabetic'; g.textAlign = 'left'; g.setTransform(1, 0, 0, 1, 0, 0);
    stipple(c, { k: .25, g: 1, seed: 4, mid: false, boost: 1 });
    return c;
  });
}
// which cards stand in the rack (a few pockets empty), each with its own texture variant
const SLOTS = (() => { const r = prng(77), s = []; for (let j = 0; j < RACK.rows; j++) for (let i = 0; i < RACK.cols; i++) { const hero = i === RACK.hero.i && j === RACK.hero.j; if (!hero && r() < .1) continue; s.push({ i, j, v: Math.floor(r() * 6), dz: r() * 4, tilt: (r() - .5) * 6, hero }); } return s; })();
const variant = (v, res) => cardTex(res, { seed: 11 + v * 5, past: 3 + (v % 5) * 2, num: 300 + v * 37 });

function drawRack(ctx, t, K, P, o = {}) {
  ctx.fillStyle = '#05070f'; ctx.fillRect(0, 0, W, H);
  // the wall (affine quad, wide strips) and the dado
  quadSprite(ctx, wallTex(), [P(-1800, 1600, 0), P(5800, 1600, 0), P(5800, -1000, 0), P(-1800, -1000, 0)], 8);
  // rack back panel + side rails
  const x0 = colX(0) - 150, x1 = colX(RACK.cols - 1) + 150, yb = rowY(0) - 120, yt = rowY(RACK.rows) + 40;
  poly(ctx, [P(x0, yt, 4), P(x1, yt, 4), P(x1, yb, 4), P(x0, yb, 4)]); ctx.fillStyle = '#161c2e'; ctx.fill();
  // the sweeping light on the wall (a pool texture mapped onto the wall plane)
  const L = rackLight(t, K), la = o.lightA ?? 1;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  quadSprite(ctx, poolTex(), [P(L.x - L.r * 1.6, L.y + L.r, 2), P(L.x + L.r * 1.6, L.y + L.r, 2), P(L.x + L.r * 1.6, L.y - L.r, 2), P(L.x - L.r * 1.6, L.y - L.r, 2)], 1, .75 * la);
  ctx.restore();
  for (const sx of [x0, x1]) { poly(ctx, [P(sx - 14, yt + 20, 30), P(sx + 14, yt + 20, 30), P(sx + 14, yb - 20, 30), P(sx - 14, yb - 20, 30)]); ctx.fillStyle = '#2a3246'; ctx.fill(); }
  // cards and pocket ledges, bottom row first (each ledge hides the card tops below it and the bottoms of its own row)
  const heroQ = { q: null };
  for (let j = 0; j < RACK.rows; j++) {
    for (const s of SLOTS) {
      if (s.j !== j) continue;
      if (s.hero) { heroQ.q = cardQuad(P, s.i, s.j, 0, 9); heroQ.j = j; if (o.heroInRack) o.heroInRack(ctx, P); continue; }
      const q = cardQuad(P, s.i, s.j, s.tilt, 8 + s.dz), wpx = Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]);
      if (q[0][2] < 20 || Math.max(q[0][0], q[1][0]) < -50 || Math.min(q[0][0], q[1][0]) > W + 50) continue;
      const res = wpx > 140 ? 2 : wpx > 40 ? .7 : .25;
      // light falls off along the rack from the pool: darker cards far from it
      const d = Math.abs(colX(s.i) - L.x) / 330 + Math.abs(rowY(s.j) + 60 - L.y) / 480, lit = Math.exp(-d * d * 1.2);
      quadSprite(ctx, variant(s.v, res), q, wpx > 220 ? 3 : 1, .95);
      poly(ctx, q.slice(0, 4)); ctx.fillStyle = `rgba(6,8,20,${.78 - .62 * lit * la})`; ctx.fill();
    }
    // the ledge of row j: sheet metal tilted out from the wall, with dividers and number tags
    const y1 = rowY(j), y0 = y1 - RACK.plateH, xa = x0 + 40, xb = x1 - 40;
    const top = [P(xa, y1, RACK.depth), P(xb, y1, RACK.depth)], bot = [P(xb, y0, 6), P(xa, y0, 6)];
    poly(ctx, [top[0], top[1], bot[0], bot[1]]);
    const lg = ctx.createLinearGradient(0, top[0][1], 0, bot[1][1]); lg.addColorStop(0, '#39425c'); lg.addColorStop(.15, '#252c42'); lg.addColorStop(1, '#141828'); ctx.fillStyle = lg; ctx.fill();
    ctx.strokeStyle = 'rgba(200,215,255,.32)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(top[0][0], top[0][1]); ctx.lineTo(top[1][0], top[1][1]); ctx.stroke();
    // warm rim on the ledge lip where the light falls
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const pa = P(L.x - L.r * 1.4, y1, RACK.depth), pb = P(L.x + L.r * 1.4, y1, RACK.depth);
    const rg = ctx.createLinearGradient(pa[0], 0, pb[0], 0); rg.addColorStop(0, 'rgba(255,180,100,0)'); rg.addColorStop(.5, `rgba(255,190,120,${.55 * la})`); rg.addColorStop(1, 'rgba(255,180,100,0)'); ctx.strokeStyle = rg; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(top[0][0], top[0][1]); ctx.lineTo(top[1][0], top[1][1]); ctx.stroke(); ctx.restore();
    for (let i = 0; i < RACK.cols; i++) {
      const xc = colX(i), p1 = P(xc - 30, y1 - 30, (RACK.depth + 6) / 2 + 8), p2 = P(xc + 30, y1 - 52, (RACK.depth + 6) / 2 + 7);
      if (p1[2] < 20 || p1[0] < -60 || p1[0] > W + 60) continue;
      ctx.fillStyle = 'rgba(214,206,186,.55)'; ctx.fillRect(Math.min(p1[0], p2[0]), Math.min(p1[1], p2[1]), Math.abs(p2[0] - p1[0]), Math.abs(p2[1] - p1[1]));
      const dv = [P(xc + RACK.pitchX / 2, y1, RACK.depth), P(xc + RACK.pitchX / 2, y0, 6)]; ctx.strokeStyle = 'rgba(5,6,12,.7)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(dv[0][0], dv[0][1]); ctx.lineTo(dv[1][0], dv[1][1]); ctx.stroke();
    }
    // shadow of the ledge on the cards above it is implicit; a soft shadow below the ledge on the next row's tops
    const sh0 = P(xa, y0, 6), sh1 = P(xb, y0, 6), sh2 = P(xb, y0 - 30, 6), sh3 = P(xa, y0 - 30, 6);
    poly(ctx, [sh0, sh1, sh2, sh3]); ctx.fillStyle = 'rgba(3,4,10,.35)'; ctx.fill();
  }
  // the punch clock on the wall at the start of the rack, its second hand sweeping
  const cq = [P(CLOCK.x - CLOCK.w / 2, CLOCK.y + CLOCK.h / 2, CLOCK.z), P(CLOCK.x + CLOCK.w / 2, CLOCK.y + CLOCK.h / 2, CLOCK.z), P(CLOCK.x + CLOCK.w / 2, CLOCK.y - CLOCK.h / 2, CLOCK.z), P(CLOCK.x - CLOCK.w / 2, CLOCK.y - CLOCK.h / 2, CLOCK.z)];
  if (cq[0][2] > 30 && Math.min(cq[0][0], cq[3][0]) < W + 100) {
    // the housing's side (depth) toward the camera
    const sd = [P(CLOCK.x + CLOCK.w / 2, CLOCK.y + CLOCK.h / 2, CLOCK.z), P(CLOCK.x + CLOCK.w / 2, CLOCK.y + CLOCK.h / 2, 0), P(CLOCK.x + CLOCK.w / 2, CLOCK.y - CLOCK.h / 2, 0), P(CLOCK.x + CLOCK.w / 2, CLOCK.y - CLOCK.h / 2, CLOCK.z)];
    poly(ctx, sd); ctx.fillStyle = '#0d101a'; ctx.fill();
    quadSprite(ctx, clockTex(), cq, 6);
    const dc = [CLOCK.x, CLOCK.y + CLOCK.h / 2 - 200, CLOCK.z + 2], hand = (ang, L, w, col) => { const a = P(dc[0], dc[1], dc[2]), b = P(dc[0] + Math.sin(ang) * L, dc[1] + Math.cos(ang) * L, dc[2]), c0 = P(dc[0] - Math.sin(ang) * L * .18, dc[1] - Math.cos(ang) * L * .18, dc[2]); ctx.strokeStyle = col; ctx.lineWidth = w * a[2] ** -1 * 1400; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(c0[0], c0[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); };
    hand((8 + 59 / 60) / 12 * TAU, 78, 7, '#1d2433'); hand(59 / 60 * TAU + t * .002, 118, 5, '#1d2433'); hand(t / 60 * TAU * 6 + 1.2, 128, 2, '#8e2f2a');
    // its dark side away from the light, a cool rim on the bezel
    poly(ctx, cq.slice(0, 4)); ctx.fillStyle = `rgba(5,6,14,${.25 + .35 * clamp((t - 1) / 2)})`; ctx.fill();
  }
  return { heroQ: heroQ.q, L };
}
// dust in the beam (screen space, around the light)
function dust(ctx, t, x, y, R, a) {
  if (a <= 0) return; const r = prng(17); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 90; i++) { const ang = r() * TAU, d = R * Math.sqrt(r()), sp = .15 + r() * .35, px = x + Math.cos(ang) * d * 1.4 + Math.sin(t * sp + i) * 30, py = y + Math.sin(ang) * d - ((t * 9 * sp + r() * 400) % 400) + 200; const f = Math.max(0, 1 - Math.hypot(px - x, (py - y) * 1.3) / (R * 1.4)); ctx.fillStyle = `rgba(255,214,170,${(.15 + .5 * r()) * f * a})`; const z = r() < .8 ? 1.6 : 2.8; ctx.fillRect(px, py, z, z); }
  ctx.restore();
}

// =====================================================================================================================
// 1.02 · the income slip (world units 1300 × 684 = the card's back, turned)
// =====================================================================================================================
export const SLIP = { w: 1300, h: 684 };
const SINK = '#28405a';
function slipBase(o) {
  const { w, h } = SLIP;
  return once('slipbase' + (o.sealed ? 1 : 0), () => {
    const [c, g] = canvas(w, h), n = vnoise(13), r = prng(4);
    g.beginPath(); g.roundRect(0, 0, w, h, 10);
    const pg = g.createRadialGradient(w * .55, h * .35, 0, w * .5, h * .5, w * .7); pg.addColorStop(0, '#f8f0dd'); pg.addColorStop(.7, '#eee3c9'); pg.addColorStop(1, '#d6c49f'); g.fillStyle = pg; g.fill();
    g.save(); g.clip(); paperFibres(g, w, h, 4, 2400);
    // security ground: a faint rosette field and wave lines behind the title
    rosette(g, 780, 330, { R: 360, A: 46, B: 22, n: 34, m: 11, lines: 64, col: '#9a7a4a', w: .4, a: .15 });
    g.strokeStyle = rgba('#9a7a4a', .22); g.lineWidth = .6; for (let k = 0; k < 26; k++) { g.beginPath(); for (let x = 300; x <= w - 40; x += 6) { const y = 230 + k * 9 + 7 * Math.sin(x * .021 + k * .5) + 4 * Math.sin(x * .053 - k); x === 300 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
    g.restore();
    gBorder(g, 18, 18, w - 36, h - 36, { band: 34, lines: 9, waves: 170, col: SINK, w: .8, a: .78, radius: 18 });
    gBorder(g, 290, 70, w - 360, h - 140, { band: 12, lines: 4, waves: 220, col: '#8a5a24', w: .6, a: .7, radius: 10 });
    // the stub: perforation, medallion, number
    g.fillStyle = 'rgba(90,70,45,.55)'; for (let y = 64; y < h - 60; y += 11) { g.beginPath(); g.arc(262, y, 2.4, 0, TAU); g.fill(); }
    rosette(g, 150, 300, { R: 92, A: 22, B: 10, n: 18, m: 7, lines: 36, col: SINK, w: .55, a: .9 });
    { const sg = g.createRadialGradient(140, 290, 0, 150, 300, 36); sg.addColorStop(0, '#fff4dc'); sg.addColorStop(.45, '#ffb35c'); sg.addColorStop(1, '#8a4a18'); g.fillStyle = sg; g.beginPath(); g.arc(150, 300, 30, 0, TAU); g.fill(); g.strokeStyle = 'rgba(80,40,10,.6)'; g.lineWidth = 1.2; g.stroke(); }
    text(g, 'Nº', 92, 478, { size: 34, font: 'Instrument Serif', color: '#8e2f2a' }); text(g, '001', 134, 478, { size: 28, weight: 600, color: '#8e2f2a', spacing: 2 });
    text(g, 'MONTHLY', 150, 530, { size: 15, weight: 600, color: SINK, align: 'center', spacing: 5 });
    microtext(g, 60, 560, 180, 'YOUR INCOME · EVERY MONTH · YOUR INCOME · EVERY MONTH', { size: 5, col: SINK, a: .8 });
    // lettering on the main field
    text(g, 'INCOME SLIP', 780, 132, { size: 20, weight: 600, color: SINK, align: 'center', spacing: 10 });
    microtext(g, 360, 160, 840, 'YOUR INCOME · TAKEN CARE OF · EVERY MONTH · FOR AS LONG AS YOU LIVE · YOUR INCOME · TAKEN CARE OF · EVERY MONTH', { size: 6, col: SINK, a: .8 });
    text(g, 'EVERY MONTH', 780, 436, { size: 26, weight: 600, color: '#3a2a14', align: 'center', spacing: 14 });
    microtext(g, 360, 470, 840, 'PAYABLE MONTHLY · NO SHIFTS · NO CLOCK · NO CARD TO PUNCH · PAYABLE MONTHLY · NO SHIFTS · NO CLOCK', { size: 6, col: SINK, a: .8 });
    text(g, 'PAY TO', 360, 560, { size: 15, weight: 600, color: SINK, spacing: 5 });
    g.strokeStyle = rgba(SINK, .7); g.lineWidth = 1.4; g.beginPath(); g.moveTo(450, 566); g.lineTo(900, 566); g.stroke();
    scribble(g, 470, 552, 330, 22, { seed: 21, ink: '#1b2a6b', lw: 2.4 });
    text(g, 'JAN 2031', 1150, 132, { size: 16, weight: 600, color: '#8e2f2a', align: 'center', spacing: 5 });
    // foil title
    const T = foilTitle(); g.save(); g.globalAlpha = .5; g.drawImage(T.shadow, 780 - T.w / 2 + 3, 330 - T.h * .74 + 4); g.restore(); g.drawImage(T.foil, 780 - T.w / 2, 330 - T.h * .74);
    if (o.sealed) seal(g, SEAL.x, SEAL.y, SEAL.r, 0, { foil: true, rot: -.25, label: 'TAKEN CARE OF · EVERY MONTH · ' });
    stipple(c, { k: .2, g: 1, seed: 3, mid: false, boost: 1 });
    return c;
  });
}
const SEAL = { x: 1135, y: 540, r: 88 };
function foilTitle() {
  return once('foiltitle', () => {
    const s = 'Income', size = 170, [m, mx] = canvas(10, 10); mx.font = `${size}px "Instrument Serif"`; try { mx.letterSpacing = '6px'; } catch { }
    const w = Math.ceil(mx.measureText(s).width + 40), h = Math.ceil(size * 1.15);
    const mk = (fill) => { const [c, x] = canvas(w, h); x.font = `${size}px "Instrument Serif"`; try { x.letterSpacing = '6px'; } catch { } x.fillStyle = fill(x); x.fillText(s, 20, h * .74); return c; };
    const L = { w, h, mask: mk(() => '#fff'), shadow: mk(() => 'rgba(40,20,8,1)'), foil: mk((x) => foilGrad(x, 0, 0, w, h, .25)), scratch: canvas(w, h) };
    { const fx = L.foil.getContext('2d'), [nc, nx] = canvas(w, h); nx.drawImage(L.mask, 0, 0); nx.globalCompositeOperation = 'source-in'; nx.fillStyle = 'rgba(255,236,190,.55)'; nx.fillRect(0, 0, w, h); stipple(nc, { k: 1, g: 1.5, seed: 9, mid: false, boost: 1.3 }); fx.globalCompositeOperation = 'overlay'; fx.drawImage(nc, 0, 0); }
    return L;
  });
}
// slip textures at a few resolutions (mip levels); res = 1 → 1300 × 684
export function slipTex(res = 1, o = {}) {
  const base = slipBase(o); if (res >= .99) return base;
  return once('slip' + res + (o.sealed ? 's' : ''), () => { const [c, g] = canvas(Math.ceil(SLIP.w * res), Math.ceil(SLIP.h * res)); g.imageSmoothingQuality = 'high'; let src = base, cw = SLIP.w, ch = SLIP.h; while (cw * .5 > SLIP.w * res * 1.2) { const [h2, hg] = canvas(Math.ceil(cw * .5), Math.ceil(ch * .5)); hg.drawImage(src, 0, 0, Math.ceil(cw * .5), Math.ceil(ch * .5)); src = h2; cw *= .5; ch *= .5; } g.drawImage(src, 0, 0, c.width, c.height); return c; });
}
// the live foil glint on the title of a slip drawn with the current transform at slip units
function titleGlint(ctx, t, a = 1) {
  const T = foilTitle(), [gc, gx] = T.scratch; gx.globalCompositeOperation = 'source-over'; gx.clearRect(0, 0, T.w, T.h); gx.drawImage(T.mask, 0, 0);
  gx.globalCompositeOperation = 'source-in'; const ph = ((t * .22 + .55) % 1.7) - .35, bx = ph * (T.w + 400) - 200;
  const gg = gx.createLinearGradient(bx - 110, 0, bx + 110, T.h * .4); gg.addColorStop(0, 'rgba(255,179,92,0)'); gg.addColorStop(.5, `rgba(255,246,225,${.9 * a})`); gg.addColorStop(1, 'rgba(255,179,92,0)'); gx.fillStyle = gg; gx.fillRect(0, 0, T.w, T.h);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(gc, 780 - T.w / 2, 330 - T.h * .74); ctx.restore();
}
// draw a slip in slip units (0..w, 0..h) under the current transform, with the live seal and glint (hero only)
export function slipLive(ctx, t, o = {}) {
  ctx.drawImage(slipTex(1, { sealed: !!o.sealedTex }), 0, 0);
  titleGlint(ctx, t, o.glint ?? 1);
  if (o.seal != null && o.seal > 0 && !o.sealedTex) {
    const u = clamp(o.seal), land = eoX(u), sc = mix(2.4, 1, land);
    if (u < 1) { ctx.save(); ctx.globalAlpha = .35 * (1 - land); ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(SEAL.x + 18 * sc, SEAL.y + 22 * sc, SEAL.r * sc, SEAL.r * sc, 0, 0, TAU); ctx.fill(); ctx.restore(); }
    ctx.save(); ctx.globalAlpha = clamp(u * 4); ctx.translate(SEAL.x, SEAL.y); ctx.scale(sc, sc); seal(ctx, 0, 0, SEAL.r, t, { foil: true, rot: -.25 + (1 - land) * .4, label: 'TAKEN CARE OF · EVERY MONTH · ' }); ctx.restore();
    if (o.sealT != null && t > o.sealT) { const d = t - o.sealT; if (d < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let k = 0; k < 2; k++) { const q = clamp(d / .8 - k * .15); if (q <= 0) continue; ctx.strokeStyle = `rgba(255,214,150,${.6 * (1 - q)})`; ctx.lineWidth = 3 * (1 - q) + .5; ctx.beginPath(); ctx.arc(SEAL.x, SEAL.y, SEAL.r * (1 + eoX(q) * 1.3), 0, TAU); ctx.stroke(); } ctx.restore(); } }
  }
}

// =====================================================================================================================
// 1.02/1.03 · the row world: the slips stand on a dark engraved ground; the row runs to a light on the horizon
// =====================================================================================================================
const ROW = { n: 480, sp: 70, ground: -SLIP.h / 2, markX: SLIP.w / 2 + 330, far: 480 * 70 };
function rowCam(t, K) {
  const D0 = 1468, sw = qio(clamp((t - (K.rest - .3)) / 1.25));                    // the swing round to the side of the row
  const tr = clamp((t - (K.life - .35)) / (K.so - .2 - (K.life - .35))), tru = tr * tr * (3 - 2 * tr) * .55 + eiX(tr) * .45;   // the truck along the row, accelerating into the light
  const push = eio(clamp((t - K.flipEnd) / (K.rest - K.flipEnd)));
  return { x: mix(0, 1250, sw) + drift(t, 5, 1), y: mix(0, 330, sw) + drift(t, 3, 2), z: mix(D0 - 70 * push, 2150, sw) - 13000 * tru, yaw: mix(0, -.235, sw) + .003 * Math.sin(t * .5), pitch: mix(0, -.085, sw) + .04 * tru, f: 1400 };
}
const slipZ = (k, t, K) => { if (k === 0) return 0; const q = Math.pow(k / ROW.n, .55), s0 = K.rest - .32 + .5 * q, d = .45 + 1.0 * q; return -k * ROW.sp * eoX(clamp((t - s0) / d)); };
function skyTex() {   // the sky over the row world (screen-tall gradient, drawn offset with the horizon)
  return once('rowsky', () => { const [c, g] = canvas(W, H * 2), lg = g.createLinearGradient(0, 0, 0, H * 2); lg.addColorStop(0, '#04050f'); lg.addColorStop(.32, '#0a0e26'); lg.addColorStop(.47, '#1f1e3c'); lg.addColorStop(.5, '#3a2d40'); lg.addColorStop(.505, '#120f1e'); lg.addColorStop(.6, '#090a16'); lg.addColorStop(1, '#030409'); g.fillStyle = lg; g.fillRect(0, 0, W, H * 2);
    const r = prng(3); for (let i = 0; i < 260; i++) { const y = r() * H * .95, a = .1 + r() * .5 * (1 - y / H); g.fillStyle = `rgba(220,230,255,${a})`; const z = r() < .9 ? 1.2 : 2; g.fillRect(r() * W, y, z, z); }
    stipple(c, { k: .4, g: 1, seed: 8, mid: false, boost: 1 }); return c; });
}
function bloomTex() { return once('rowbloom', () => { const R = 700, [c, g] = canvas(R * 2, R * 2), rg = g.createRadialGradient(R, R, 0, R, R, R); rg.addColorStop(0, 'rgba(255,240,214,1)'); rg.addColorStop(.04, 'rgba(255,214,160,.85)'); rg.addColorStop(.15, 'rgba(255,170,90,.32)'); rg.addColorStop(.45, 'rgba(255,140,70,.07)'); rg.addColorStop(1, 'rgba(255,140,70,0)'); g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2); stipple(c, { k: .3, g: 1.2, seed: 41 }); return c; }); }
function hazeTex() { return once('rowhaze', () => { const [c, g] = canvas(W * 2, 300), lg = g.createLinearGradient(0, 0, 0, 300); lg.addColorStop(0, 'rgba(255,190,130,0)'); lg.addColorStop(.5, 'rgba(255,180,120,.22)'); lg.addColorStop(1, 'rgba(255,190,130,0)'); g.fillStyle = lg; g.fillRect(0, 0, W * 2, 300); const rg = g.createRadialGradient(W, 150, 0, W, 150, W); rg.addColorStop(0, 'rgba(0,0,0,0)'); rg.addColorStop(1, 'rgba(0,0,0,1)'); g.globalCompositeOperation = 'destination-out'; g.fillStyle = rg; g.fillRect(0, 0, W * 2, 300); stipple(c, { k: .8, g: 1.2, seed: 12 }); return c; }); }
export function rowLight(t, K) { const P = cam3(rowCam(t, K)); const p = P(0, ROW.ground + 120, -ROW.far - 2000); return [p[0], p[1]]; }

function drawRow(ctx, t, K, o = {}) {
  const C = rowCam(t, K), P = cam3(C);
  const hz = P(C.x, C.y, C.z - 1e7)[1], LP = P(0, ROW.ground + 120, -ROW.far - 2000);
  ctx.drawImage(skyTex(), 0, hz - H);
  // the light at the end of the row: grows as the camera trucks toward it
  const grow = eiX(clamp((t - (K.lifeE - .2)) / (K.so - K.lifeE))), la = o.lightA ?? 1;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const B = bloomTex(), bs = mix(.9, 2.4, grow) * (1 + .03 * Math.sin(t * 1.7)); ctx.globalAlpha = la * mix(.75, 1, grow); ctx.drawImage(B, LP[0] - B.width / 2 * bs, LP[1] - B.height / 2 * bs, B.width * bs, B.height * bs);
  const Hz = hazeTex(); ctx.globalAlpha = la * .9; ctx.drawImage(Hz, LP[0] - Hz.width / 2, hz - 150); ctx.restore();
  // ground: engraved lines across (constant Z) and along (constant X), fading into the haze
  ctx.save(); ctx.lineCap = 'round';
  for (let k = 0; k < 70; k++) {
    const z = C.z - 200 - Math.pow(k / 70, 2.2) * 40000, a = P(-30000, ROW.ground, z), b = P(30000, ROW.ground, z); if (a[2] < 30) continue;
    const f = clamp(1 - k / 70); ctx.strokeStyle = `rgba(150,140,190,${.16 * f})`; ctx.lineWidth = Math.max(.5, 1.6 * f); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  }
  for (let k = -22; k <= 22; k++) {
    const x = k * 420 + (k > 0 ? 300 : -300), a = P(x, ROW.ground, Math.min(C.z - 60, 3000)), b = P(x, ROW.ground, -60000); if (a[2] < 30 || !(Math.hypot(b[0] - a[0], b[1] - a[1]) > 2)) continue;
    const g2 = ctx.createLinearGradient(a[0], a[1], b[0], b[1]); g2.addColorStop(0, 'rgba(150,140,190,.14)'); g2.addColorStop(1, 'rgba(255,190,130,.05)'); ctx.strokeStyle = g2; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  }
  ctx.restore();
  // a long warm glint along the ground under the row (the light's reflection)
  { const a = P(0, ROW.ground, -ROW.far), b = P(0, ROW.ground, Math.min(C.z - 100, 400)); if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 2 && b[2] > 30) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g3 = ctx.createLinearGradient(a[0], a[1], b[0], b[1]); g3.addColorStop(0, `rgba(255,190,120,${.5 * la})`); g3.addColorStop(1, 'rgba(255,190,120,0)'); ctx.strokeStyle = g3; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore(); } }
  // the year marks, engraved into the ground beside the row (every 12th slip is a January)
  for (let y = 0; y <= 40; y++) {
    const z = -y * 12 * ROW.sp, emerge = clamp((t - (K.rest - .1 + .9 * Math.pow(y / 40, .6))) / .5); if (emerge <= 0) continue;
    const o0 = P(ROW.markX, ROW.ground, z), ex = P(ROW.markX + 1, ROW.ground, z), ez = P(ROW.markX, ROW.ground, z + 1); if (o0[2] < 120) continue;
    const s = Math.hypot(ex[0] - o0[0], ex[1] - o0[1]); if (s * 150 < 5) continue;
    ctx.save(); ctx.setTransform(ex[0] - o0[0], ex[1] - o0[1], ez[0] - o0[0], ez[1] - o0[1], o0[0], o0[1]);
    ctx.globalAlpha = emerge * clamp((s * 150 - 5) / 20);
    ctx.font = '170px "Instrument Serif"'; ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillText(String(2031 + y), 4, 6); ctx.fillStyle = y === 0 ? '#ffcf96' : '#d9c9a8'; ctx.fillText(String(2031 + y), 0, 0);
    ctx.fillStyle = 'rgba(255,200,140,.5)'; ctx.fillRect(-60, -40, 40, 4);
    ctx.restore();
  }
  // the slips, far to near
  const hidden = o.heroHidden;
  for (let k = ROW.n - 1; k >= 0; k--) {
    if (k === 0 && hidden) continue;
    const z = slipZ(k, t, K); if (k > 0 && z > -1) continue;
    const x0 = -SLIP.w / 2, x1 = SLIP.w / 2, y0 = ROW.ground, y1 = ROW.ground + SLIP.h;
    const q = [P(x0, y1, z), P(x1, y1, z), P(x1, y0, z), P(x0, y0, z)]; if (q[0][2] < 60) continue;
    const wpx = Math.max(Math.abs(q[1][0] - q[0][0]), Math.abs(q[3][1] - q[0][1]) * 1.9);
    if (Math.max(q[0][0], q[1][0]) < -20 || Math.min(q[0][0], q[1][0]) > W + 20) continue;
    if (wpx < 3) { ctx.fillStyle = 'rgba(255,210,160,.5)'; ctx.fillRect(q[0][0], q[0][1], 1.5, Math.max(1, q[3][1] - q[0][1])); continue; }
    // the slip's edge (thickness) toward the camera side
    const e = [P(x1, y1, z), P(x1, y1, z - 6), P(x1, y0, z - 6), P(x1, y0, z)]; poly(ctx, e); ctx.fillStyle = '#7a6040'; ctx.fill();
    const res = wpx > 700 ? 1 : wpx > 260 ? .5 : wpx > 60 ? .2 : .06;
    quadSprite(ctx, slipTex(res, { sealed: true }), q, wpx > 900 ? 10 : wpx > 300 ? 4 : 1);
    // back-lit: the faces fall into shade with distance, a warm rim on the top edge
    const dist = q[0][2], sh = clamp((dist - 1500) / 9000) * .55 + .12;
    poly(ctx, q); ctx.fillStyle = `rgba(14,10,24,${sh})`; ctx.fill();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,200,140,${.5 * la})`; ctx.lineWidth = Math.max(.6, Math.min(2, wpx / 300)); ctx.beginPath(); ctx.moveTo(q[0][0], q[0][1]); ctx.lineTo(q[1][0], q[1][1]); ctx.lineTo(q[2][0], q[2][1]); ctx.stroke(); ctx.restore();
    // contact shadow
    const s0 = P(x0 - 40, y0, z + 30), s1 = P(x1 + 40, y0, z + 30), s2 = P(x1 + 40, y0, z - 60), s3 = P(x0 - 40, y0, z - 60); poly(ctx, [s0, s1, s2, s3]); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fill();
  }
  return { P, C, LP };
}

// =====================================================================================================================
// the take: 1.01 rack → lift → flip → 1.02 slip → seal → 1.03 row → push into the light
// =====================================================================================================================
const BUF = new Map(); function buf(k) { if (!BUF.has(k)) BUF.set(k, canvas()); const [c, g] = BUF.get(k); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; return [c, g]; }
const FL = futureLines(4);
// the hero card on screen: a rectangle (centre, size, rotation, flip angle). Before the flip it is the card's projection.
export function heroCardScreen(t, K) {
  const P = cam3(rackCam(t, K)), lift = eoX(clamp((t - K.again) / .6)) * 125;
  const fwd = qio(clamp((t - (K.again + .15)) / (K.flip0 + .1 - (K.again + .15)))) * 10;
  const q = cardQuad(P, RACK.hero.i, RACK.hero.j, lift, 9 + fwd);
  const cx = (q[0][0] + q[2][0]) / 2, cy = (q[0][1] + q[2][1]) / 2, w = Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]), h = Math.hypot(q[3][0] - q[0][0], q[3][1] - q[0][1]);
  return { cx, cy, w, h, q, P };
}
function drawHeroCard(ctx, t, K, S, flip, rot, ghost, a = 1, clipTop = null) {
  const { cx, cy, w, h } = S, c = Math.cos(flip);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(cx, cy); ctx.rotate(rot);
  // soft shadow on what is behind (only once it leaves the rack)
  ctx.scale(c, 1);
  if (c >= 0) {
    if (clipTop != null) { ctx.beginPath(); ctx.rect(-w, -h / 2 - 2, w * 2, clipTop + 2); ctx.clip(); }
    const sx = w / CARD.w; ctx.save(); ctx.scale(sx, h / CARD.h); ctx.translate(-CARD.w / 2, -CARD.h / 2);
    ctx.drawImage(cardTex(5, { seed: 3, past: 4, ghostFrom: 4, num: 417 }), 0, 0, CARD.w, CARD.h);
    // the future rows: solid ruled cells → dotted ghost lines (staggered by row); a breath of smoke on the dots
    const gs = (i) => clamp(ghost * 1.6 - (i - 4) * .06);
    for (const L of FL) ghostLine(ctx, L.pts, { ghost: sm(gs(L.i)), col: '#2a3346', w: mix(.5, .9, gs(L.i)), a: mix(.5, 1, gs(L.i)), dot: 3.6, t, seed: L.i + 1, smoke: .08 * gs(L.i), glow: gs(L.i) > .2 ? '#ffb35c' : null });
    // the light on the card (warm pool from the sweep) and the edge
    ctx.restore();
    const lg = ctx.createRadialGradient(-w * .1, -h * .25, 0, 0, 0, h * .8); lg.addColorStop(0, 'rgba(255,200,130,.18)'); lg.addColorStop(1, 'rgba(20,10,30,.22)'); ctx.fillStyle = lg; ctx.fillRect(-w / 2, -h / 2, w, h);
  } else {
    ctx.scale(-1, 1); ctx.rotate(Math.PI / 2);
    const sx = h / SLIP.w; ctx.scale(sx, w / SLIP.h); ctx.translate(-SLIP.w / 2, -SLIP.h / 2);
    slipLive(ctx, t, { glint: .6 });
  }
  // the sheen of the turn
  const sheen = Math.sin(clamp(flip / Math.PI) * Math.PI); if (sheen > .02) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,236,206,${.25 * sheen})`; ctx.fillRect(-w / 2, -h / 2, w, h); }
  ctx.restore();
}
export function openTake(ctx, t, K) {
  const flipU = clamp((t - K.flip0) / (K.flipEnd - K.flip0)), fe = qio(flipU);
  const ghost = eoX(clamp((t - K.never) / .9));
  const rackA = 1 - sm(clamp((t - (K.flip0 + .1)) / (K.flipEnd - K.flip0 - .1)));
  // ---- the rack world (until the turn), rendered into a buffer when it must fade ----
  if (t < K.flipEnd) {
    const [bc, bg] = rackA < 1 ? buf('rack') : [null, ctx];
    const S = heroCardScreen(t, K);
    const lifted = t >= K.again - .02;
    const R = drawRack(bg, t, K, S.P, { lightA: 1 - .5 * clamp((t - K.again) / 1.2), heroInRack: lifted ? null : (g2) => { drawHeroCard(g2, t, K, S, 0, Math.atan2(S.q[1][1] - S.q[0][1], S.q[1][0] - S.q[0][0]), ghost, 1, 248 / CARD.h * S.h); } });
    if (lifted && t < K.flip0) {
      // the ledges in front of the card's lower part must still cover it while it slides up: clip the card above the ledge top
      const ledgeTop = S.P(colX(RACK.hero.i), rowY(RACK.hero.j), RACK.depth)[1], fwd = clamp((t - (K.again + .15)) / .5);
      bg.save(); if (fwd < .02) { bg.beginPath(); bg.rect(0, 0, W, ledgeTop); bg.clip(); }
      drawHeroCard(bg, t, K, S, 0, 0, ghost); bg.restore();
    }
    const Lp = S.P(R.L.x, R.L.y, 10); dust(bg, t, Lp[0], Lp[1], 300 * 1400 / Math.max(300, Lp[2]), .8 * (1 - clamp((t - K.again) / 1.2)));
    // darkness: the office falls away behind the rising card
    const dk = clamp((t - (K.again + .2)) / (K.flip0 + .4 - K.again)); if (dk > 0) { bg.fillStyle = `rgba(4,5,12,${.75 * sm(dk)})`; bg.fillRect(0, 0, W, H); }
    if (rackA < 1) { drawRow(ctx, t, K, { heroHidden: true, lightA: 1 - rackA }); ctx.save(); ctx.globalAlpha = rackA; ctx.drawImage(bc, 0, 0); ctx.restore(); }
    // the card leaves the rack, comes forward, turns over; its back is the slip, landing where the row world holds it
    if (t >= K.flip0) {
      const S0 = heroCardScreen(K.flip0, K), C = cam3(rowCam(K.flipEnd, K)), a = C(-SLIP.w / 2, ROW.ground + SLIP.h, 0), b = C(SLIP.w / 2, ROW.ground, 0);
      const tw = b[1] - a[1], th = b[0] - a[0];   // the card's short side becomes the slip's height, its long side the width
      const lift = Math.sin(fe * Math.PI) * -40;
      const S1 = { cx: mix(S0.cx, (a[0] + b[0]) / 2, fe), cy: mix(S0.cy, (a[1] + b[1]) / 2, fe) + lift, w: mix(S0.w, tw, fe), h: mix(S0.h, th, fe) };
      // shadow and glow under the turning card
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gl = ctx.createRadialGradient(S1.cx, S1.cy, 0, S1.cx, S1.cy, Math.max(S1.w, S1.h)); gl.addColorStop(0, `rgba(255,190,120,${.22 * fe})`); gl.addColorStop(1, 'rgba(255,190,120,0)'); ctx.fillStyle = gl; ctx.fillRect(S1.cx - 1200, S1.cy - 1200, 2400, 2400); ctx.restore();
      drawHeroCard(ctx, t, K, S1, fe * Math.PI, -fe * Math.PI / 2, ghost);
    }
    return { light: rowLight(t, K) };
  }
  // ---- the row world: the slip stands on the ground, the seal lands, it fans out into the row ----
  const R = drawRow(ctx, t, K, { heroHidden: t < K.rest - .3 });
  if (t < K.rest - .3) {   // the hero slip, frontal (exact), with the live seal and glint
    const P = R.P, a = P(-SLIP.w / 2, ROW.ground + SLIP.h, 0), b = P(SLIP.w / 2, ROW.ground, 0);
    // back light: a halo round the slip (it stands in front of the far light)
    ctx.save(); ctx.translate(a[0], a[1]); ctx.scale((b[0] - a[0]) / SLIP.w, (b[1] - a[1]) / SLIP.h);
    const dip = t > K.care ? Math.exp(-(t - K.care - .06) * 12) * Math.sin((t - K.care - .06) * 30) * 4 * (t > K.care + .06) : 0;
    ctx.translate(0, dip);
    ctx.save(); ctx.shadowColor = 'rgba(255,170,90,.55)'; ctx.shadowBlur = 60; ctx.fillStyle = '#e9dcc0'; ctx.beginPath(); ctx.roundRect(4, 4, SLIP.w - 8, SLIP.h - 8, 10); ctx.fill(); ctx.restore();
    slipLive(ctx, t, { seal: (t - (K.care - .22)) / .22, sealT: K.care });
    ctx.restore();
  }
  return { light: [R.LP[0], R.LP[1]] };
}
