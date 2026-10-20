// C02 kit (Film 4 minute 1 in the Film 5 machinery): the daydream sheet, the conference stage, the timeline ruler, the IF seal and the
// engraved staircase. Everything static is cached once (offscreen layers); the live parts (light, particles, camera) are drawn per frame.
//   nightBG(ctx, t, o)                      deep indigo plate with stipple and a faint guilloche sweep (parallax by o.dx/dy)
//   VIG, vigLines(), vigLayer()             the wall vignette (pale engraved wall, pinned amber income slip, guilloche "?") as polylines + raster
//   sheetLayer()                            the floating sheet that carries the vignette (2x raster)
//   dotsOf(lines, pitch)                    points along polylines (the ghost dots that leave the vignette)
//   STAGE, stageLayer(), audienceRow(k), rimRow(k, col), coneLayer(), screenRosette(), lectern()
//   RULER, rulerLayer(), yearX(y)           the engraved timeline ruler (cream strip, guilloche bands, ticks, years)
//   ifSeal(ctx, x, y, r, t, o)              the foil seal with the engraved word IF (o.wipe 0..1: engraved round by the burin)
//   STEP, slabLayer(i)                      one stair slab, its engraving finer with every step
import { W, H, rgba, clamp, mix, prng, canvas, text, addGlow, lin, sm, eout } from '../engine.mjs';
import { Path2D } from '@napi-rs/canvas';
import { stipple, vnoise } from './art.mjs';
import { guilloche, microtext, microRing, FOIL } from './certificate.mjs';
import { paperSheet } from './paper.mjs';
import { fibreFill } from './print.mjs';
import { slipTex } from './sc01_m1_open.mjs';   // c01's income slip (the same artefact as on the wall in 1.09)

export const TAU = Math.PI * 2;
export const AMBER = '#ffb35c', CORE = '#fff1d6', CREAM = '#f3efe2', PAPER = '#ece2c9', INK = '#241d2a', NIGHT = '#0b0f2a', ICE = '#cfe9ff', CYAN = '#8fe6ff';
const CACHE = new Map();
export function once(key, f) { if (!CACHE.has(key)) CACHE.set(key, f()); return CACHE.get(key); }
export const strokePoly = (g, P, close = false) => { if (P.length < 2) return; g.beginPath(); g.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) g.lineTo(P[i][0], P[i][1]); if (close) g.closePath(); g.stroke(); };

// ---------------------------------------------------------------- ground
export function nightBG(ctx, t, o = {}) {
  const L = once('night', () => {
    const w = W + 360, h = H + 360, [c, g] = canvas(w, h);
    const bg = g.createRadialGradient(w * .48, h * .42, 0, w * .5, h * .5, w * .72); bg.addColorStop(0, '#1d1f4a'); bg.addColorStop(.55, '#121436'); bg.addColorStop(1, '#06071a');
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.save(); g.globalAlpha = .045; g.strokeStyle = CREAM; g.lineWidth = .8; for (let y = -h; y < h * 2; y += 7) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y + w * .3); g.stroke(); } g.restore();
    const G = guilloche({ R: 980, A: 120, B: 40, n: 9, m: 4, lines: 20 }); g.save(); g.translate(w * .55, h * 1.3); g.strokeStyle = rgba(CREAM, .04); g.lineWidth = 1;
    for (let k = 0; k < G.lines; k++) strokePoly(g, G.line(k)); g.restore();
    stipple(c, { k: .5, g: 1, seed: 31, mid: false, boost: 1.4 });
    return c;
  });
  ctx.fillStyle = NIGHT; ctx.fillRect(0, 0, W, H);
  ctx.drawImage(L, -180 + (o.dx ?? 0), -180 + (o.dy ?? 0));
}
export function motes(ctx, t, seed, n, a, col = '255,226,190', box = [0, 0, W, H]) {
  const r = prng(seed); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const x0 = r() * box[2], y0 = r() * box[3], sp = 5 + r() * 14, ph = r() * 9, z = r() < .85 ? 1.3 : 2.4, al = (.08 + .3 * r()) * a;
    const x = box[0] + ((x0 + t * sp) % box[2] + box[2]) % box[2], y = box[1] + ((y0 + Math.sin(t * .5 + ph) * 16 - t * 6) % box[3] + box[3]) % box[3];
    ctx.fillStyle = `rgba(${col},${al})`; ctx.fillRect(x, y, z, z);
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the wall vignette (2.01)
// vignette units: 0..VIG.w × 0..VIG.h; it is exactly W/depth × H/depth so c01's wall shrinks into it ('out' transition)
export const VIG = { w: 600, h: 337.5, slip: { x: 104, y: 100, w: 200, h: 105, rot: -.045 }, q: { x: 420, y: 168, s: 1 } };
function rotP(p, cx, cy, a) { const c = Math.cos(a), s = Math.sin(a), dx = p[0] - cx, dy = p[1] - cy; return [cx + dx * c - dy * s, cy + dx * s + dy * c]; }
export function vigLines() {
  return once('vigLines', () => {
    const out = [], S = VIG.slip, n = vnoise(7);
    const push = (P, kind) => { P.kind = kind; out.push(P); };
    // the engraved wall: fine horizontal rules, a little uneven (plaster), broken where the slip and the "?" sit
    for (let y = 12; y < VIG.h - 6; y += 13) {
      let cur = [];
      for (let x = 8; x <= VIG.w - 8; x += 6) {
        const yy = y + n(x * .02, y * .1) * 1.4, inSlip = x > S.x - 14 && x < S.x + S.w + 14 && yy > S.y - 22 && yy < S.y + S.h + 14, inQ = Math.hypot(x - VIG.q.x, yy - VIG.q.y + 10) < 100;
        if (inSlip || inQ) { if (cur.length > 1) push(cur, 'wall'); cur = []; continue; }
        cur.push([x, yy]);
      }
      if (cur.length > 1) push(cur, 'wall');
    }
    // the slip: outline, inner frame, a woven guilloche band between them, three type lines, a small rosette
    const cx = S.x + S.w / 2, cy = S.y + S.h / 2, R = (P) => P.map((p) => rotP(p, cx, cy, S.rot));
    const rect = (x, y, w, h) => { const P = []; const st = 5; for (let i = 0; i <= w; i += st) P.push([x + i, y]); for (let i = 0; i <= h; i += st) P.push([x + w, y + i]); for (let i = w; i >= 0; i -= st) P.push([x + i, y + h]); for (let i = h; i >= 0; i -= st) P.push([x, y + i]); return P; };
    push(R(rect(S.x, S.y, S.w, S.h)), 'slip'); push(R(rect(S.x + 9, S.y + 9, S.w - 18, S.h - 18)), 'slip');
    for (let k = 0; k < 2; k++) { const P = [], per = rect(S.x + 4.5, S.y + 4.5, S.w - 9, S.h - 9); per.forEach((p, i) => { const d = 2.6 * Math.sin(i * .9 + k * Math.PI); const ex = p[0] - cx, ey = p[1] - cy, L = Math.hypot(ex, ey) || 1; P.push([p[0] + ex / L * d, p[1] + ey / L * d]); }); push(R(P), 'foil'); }
    for (let k = 0; k < 3; k++) { const y = S.y + 34 + k * 18, P = []; for (let x = S.x + 20; x <= S.x + (k === 0 ? 112 : 92); x += 4) P.push([x, y + Math.sin(x * .7 + k) * .7]); push(R(P), 'type'); }
    { const P = []; for (let i = 0; i <= 64; i++) { const a = i / 64 * TAU, r = 14 + 2.2 * Math.sin(a * 9); P.push([S.x + S.w - 34 + Math.cos(a) * r, S.y + S.h - 34 + Math.sin(a) * r]); } push(R(P), 'foil'); }
    // the guilloche "?": four strands woven round the hook, the stem and a ring for the dot
    const Q = VIG.q, path = [];
    for (let i = 0; i <= 70; i++) { const a = Math.PI * 1.08 + i / 70 * Math.PI * 1.32; path.push([Q.x + Math.cos(a) * 44, Q.y - 48 + Math.sin(a) * 42]); }
    const e = path[path.length - 1]; for (let i = 1; i <= 18; i++) { const u = i / 18; path.push([mix(e[0], Q.x, u) - Math.sin(u * Math.PI) * 4, mix(e[1], Q.y + 16, u)]); }
    for (let i = 1; i <= 8; i++) path.push([Q.x, Q.y + 16 + i * 3.4]);
    for (let k = 0; k < 4; k++) {
      const P = []; for (let i = 0; i < path.length; i++) { const a = path[Math.max(0, i - 1)], b = path[Math.min(path.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, d = 6.5 * Math.sin(i * .42 + k * Math.PI / 2); P.push([path[i][0] - dy / L * d, path[i][1] + dx / L * d]); }
      push(P, 'q');
    }
    for (let k = 0; k < 2; k++) { const P = []; for (let i = 0; i <= 50; i++) { const a = i / 50 * TAU, r = 8.5 + k * 3.5 + 1.4 * Math.sin(a * 7 + k); P.push([Q.x + Math.cos(a) * r, Q.y + 66 + Math.sin(a) * r]); } push(P, 'q'); }
    return out;
  });
}
const LINECOL = { wall: ['#6d6250', .42, .9], slip: ['#6a4320', .8, 1.1], foil: ['#c8742c', .95, 1.1], type: ['#4a3a2a', .55, 1.4], q: ['#2a2238', .85, 1.15] };
// the vignette raster (2x): pale wall paper, the slip (cream + foil), all engraved lines solid
export function vigLayer(K = 2) {
  return once('vig' + K, () => {
    const [c, g] = canvas(Math.ceil(VIG.w * K), Math.ceil(VIG.h * K)); g.scale(K, K);
    const bg = g.createRadialGradient(VIG.w * .3, VIG.h * .35, 10, VIG.w * .5, VIG.h * .5, VIG.w * .75); bg.addColorStop(0, '#f1ead6'); bg.addColorStop(.6, '#e2d7bb'); bg.addColorStop(1, '#b9aa8a');
    g.fillStyle = bg; g.fillRect(0, 0, VIG.w, VIG.h);
    // the slip: cream card with a foil band, soft shadow on the wall
    const S = VIG.slip; g.save(); g.translate(S.x + S.w / 2, S.y + S.h / 2); g.rotate(S.rot);
    g.shadowColor = 'rgba(60,40,20,.45)'; g.shadowBlur = 10; g.shadowOffsetX = 5; g.shadowOffsetY = 7; g.fillStyle = '#f6ecd3'; g.fillRect(-S.w / 2, -S.h / 2, S.w, S.h); g.shadowColor = 'rgba(0,0,0,0)';
    let tex = null; try { tex = slipTex(.4, { sealed: true }); } catch { }
    if (tex) g.drawImage(tex, -S.w / 2, -S.h / 2, S.w, S.h);
    else { const fg = g.createLinearGradient(-S.w / 2, -S.h / 2, S.w / 2, S.h / 2); FOIL.forEach((col, i) => fg.addColorStop(i / (FOIL.length - 1), col)); g.strokeStyle = fg; g.lineWidth = 7; g.globalAlpha = .55; g.strokeRect(-S.w / 2 + 4.5, -S.h / 2 + 4.5, S.w - 9, S.h - 9); g.globalAlpha = 1; }
    VIG.tex = !!tex;
    g.restore();
    for (const P of vigLines()) { if (VIG.tex && P.kind !== 'wall' && P.kind !== 'q') continue; const [col, a, w] = LINECOL[P.kind]; g.strokeStyle = rgba(col, a); g.lineWidth = w; g.lineJoin = 'round'; g.lineCap = 'round'; strokePoly(g, P); }
    // the pin
    const px = S.x + S.w / 2, py = S.y - 2; g.fillStyle = 'rgba(40,20,10,.35)'; g.beginPath(); g.arc(px + 3, py + 4, 5, 0, TAU); g.fill();
    const pg = g.createRadialGradient(px - 1.5, py - 1.5, 0, px, py, 5.5); pg.addColorStop(0, '#fff4dc'); pg.addColorStop(1, '#9a4a18'); g.fillStyle = pg; g.beginPath(); g.arc(px, py, 5.2, 0, TAU); g.fill();
    // a darkening at the vignette edge (engraved plate), stippled
    const [m, mg] = canvas(c.width, c.height); const vg = mg.createRadialGradient(c.width * .45, c.height * .45, c.height * .3, c.width * .5, c.height * .5, c.width * .62); vg.addColorStop(0, 'rgba(60,45,30,0)'); vg.addColorStop(1, 'rgba(60,45,30,.55)'); mg.fillStyle = vg; mg.fillRect(0, 0, c.width, c.height);
    stipple(m, { k: .8, g: 1, seed: 4, mid: true, boost: 1.6 }); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(m, 0, 0);
    return c;
  });
}
// the sheet (2x raster) that carries the vignette; sheet units, vignette at SHEET.vx, SHEET.vy
export const SHEET = { w: 820, h: 590, vx: 110, vy: 74 };
export function sheetLayer(K = 2) {
  return once('sheet' + K, () => {
    const pad = 60, [c, g] = canvas(Math.ceil((SHEET.w + pad * 2) * K), Math.ceil((SHEET.h + pad * 2) * K)); g.scale(K, K); g.translate(pad, pad);
    paperSheet(g, 0, 0, SHEET.w, SHEET.h, { seed: 12, tone: '#e9dfc6', light: [SHEET.w * .3, SHEET.h * .2], shadow: false });
    // engraved double frame around the plate mark and around the vignette
    g.strokeStyle = rgba('#5a4a36', .5); g.lineWidth = 1; g.strokeRect(34, 30, SHEET.w - 68, SHEET.h - 60); g.lineWidth = .6; g.strokeRect(40, 36, SHEET.w - 80, SHEET.h - 72);
    g.strokeStyle = rgba('#3a2e22', .7); g.lineWidth = 1.4; g.strokeRect(SHEET.vx - 8, SHEET.vy - 8, VIG.w + 16, VIG.h + 16); g.lineWidth = .7; g.strokeRect(SHEET.vx - 13, SHEET.vy - 13, VIG.w + 26, VIG.h + 26);
    // caption: microtext rules and an unreadable title in the plate's margin (no invented words)
    microtext(g, SHEET.vx, SHEET.vy + VIG.h + 40, VIG.w, 'YOUR INCOME · EVERY MONTH', { size: 6, col: '#5a4a36', a: .65 });
    microtext(g, SHEET.vx + 80, SHEET.vy + VIG.h + 64, VIG.w - 160, 'FOR THE REST OF YOUR LIFE', { size: 6, col: '#5a4a36', a: .5 });
    for (const [x, y] of [[62, 58], [SHEET.w - 62, 58], [62, SHEET.h - 58], [SHEET.w - 62, SHEET.h - 58]]) { const G = guilloche({ R: 13, A: 4, B: 1.6, n: 9, m: 4, lines: 10 }); g.save(); g.translate(x, y); g.strokeStyle = rgba('#7a5a34', .55); g.lineWidth = .5; for (let k = 0; k < G.lines; k++) strokePoly(g, G.line(k)); g.restore(); }
    return { c, pad, K };
  });
}
export function dotsOf(lines, pitch = 6.5) {
  const out = [];
  for (const P of lines) {
    let acc = 0;
    for (let i = 1; i < P.length; i++) {
      const [x0, y0] = P[i - 1], [x1, y1] = P[i], L = Math.hypot(x1 - x0, y1 - y0);
      while (acc <= L) { const q = acc / (L || 1); out.push({ x: mix(x0, x1, q), y: mix(y0, y1, q), kind: P.kind }); acc += pitch; }
      acc -= L;
    }
  }
  return out;
}

// ---------------------------------------------------------------- the conference stage (2.02, 2.03)
// stage units = screen pixels at camera scale 1
export const STAGE = { scr: { x: 700, y: 112, w: 880, h: 495 }, lect: { x: 470, top: 628, bot: 792 }, floor: { back: 712, lip: 806 }, spot: { x: 300, y: 64 }, pool: { x: 470, y: 772, rx: 190, ry: 34 } };
export function stageLayer() {
  return once('stage', () => {
    const [c, g] = canvas(W + 400, H + 300), ox = 200, oy = 150; g.translate(ox, oy);
    // back wall: very dark, acoustic panels ruled in fine vertical hatching
    const bg = g.createLinearGradient(0, -oy, 0, H); bg.addColorStop(0, '#05061a'); bg.addColorStop(.6, '#0c0e2c'); bg.addColorStop(1, '#090a1f'); g.fillStyle = bg; g.fillRect(-ox, -oy, W + 400, H + 300);
    g.save(); g.strokeStyle = rgba('#8c93c8', .06); g.lineWidth = 1; for (let x = -ox; x < W + ox; x += 9) { g.beginPath(); g.moveTo(x, -oy); g.lineTo(x, STAGE.floor.back); g.stroke(); } g.restore();
    g.save(); g.strokeStyle = rgba('#8c93c8', .08); for (let x = -ox + 40; x < W + ox; x += 180) { g.beginPath(); g.moveTo(x, -oy); g.lineTo(x, STAGE.floor.back); g.stroke(); } g.restore();
    // the lighting truss across the top: two rails, lattice, dark lamp housings (the left one will be the lit spot)
    g.save(); g.strokeStyle = rgba('#a7acd6', .22); g.lineWidth = 1.4; for (const y of [30, 52]) { g.beginPath(); g.moveTo(-ox, y); g.lineTo(W + ox, y); g.stroke(); }
    g.lineWidth = .8; for (let x = -ox; x < W + ox; x += 22) { g.beginPath(); g.moveTo(x, 30); g.lineTo(x + 22, 52); g.moveTo(x + 22, 30); g.lineTo(x, 52); g.stroke(); }
    for (const x of [STAGE.spot.x, 620, 980, 1340, 1700]) { g.fillStyle = '#0a0b1c'; g.beginPath(); g.roundRect(x - 16, 52, 32, 26, 5); g.fill(); g.strokeStyle = rgba('#a7acd6', .25); g.stroke(); }
    g.restore();
    // the screen housing (dark glass with a thin bezel); its picture is drawn live
    const S = STAGE.scr; g.fillStyle = '#04050d'; g.fillRect(S.x - 14, S.y - 14, S.w + 28, S.h + 28); g.strokeStyle = rgba('#b9c3ee', .2); g.lineWidth = 1.2; g.strokeRect(S.x - 14, S.y - 14, S.w + 28, S.h + 28);
    g.fillStyle = '#070816'; g.fillRect(S.x, S.y, S.w, S.h);
    g.fillStyle = '#05060f'; g.fillRect(S.x + S.w / 2 - 70, S.y + S.h + 14, 140, STAGE.floor.back - S.y - S.h - 14);   // the stand
    // stage floor: engraved planks in perspective, a front lip
    const F = STAGE.floor; const fg = g.createLinearGradient(0, F.back, 0, F.lip); fg.addColorStop(0, '#15142e'); fg.addColorStop(1, '#221d36'); g.fillStyle = fg; g.fillRect(-ox, F.back, W + 400, F.lip - F.back);
    g.save(); g.strokeStyle = rgba('#c9b99a', .07); g.lineWidth = 1; const vx = 1000, vy = 200;
    for (let x = -1400; x < W + 1600; x += 70) { g.beginPath(); const k1 = (F.back - vy) / (F.lip - vy); g.moveTo(vx + (x - vx) * k1, F.back); g.lineTo(x, F.lip); g.stroke(); } g.restore();
    g.fillStyle = '#0b0a1b'; g.fillRect(-ox, F.lip, W + 400, 12); g.strokeStyle = rgba('#e9dcc0', .14); g.beginPath(); g.moveTo(-ox, F.lip); g.lineTo(W + ox, F.lip); g.stroke();
    g.fillStyle = '#050510'; g.fillRect(-ox, F.lip + 12, W + 400, H - F.lip + 150);
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .45, g: 1, seed: 9, mid: false, boost: 1.4 });
    return { c, ox, oy };
  });
}
// an engraved wooden lectern with a guilloche roundel; x = centre, y = floor line
export function lectern() {
  return once('lectern', () => {
    const w = 190, h = 190, pad = 30, [c, g] = canvas(w + pad * 2, h + pad * 2); g.translate(pad + w / 2, pad);
    const body = [[-62, 26], [62, 26], [74, h], [-74, h]];
    const wg = g.createLinearGradient(-74, 0, 74, 0); wg.addColorStop(0, '#2a1a12'); wg.addColorStop(.35, '#4a2e1c'); wg.addColorStop(.75, '#2f1d14'); wg.addColorStop(1, '#180e0a');
    g.fillStyle = wg; g.beginPath(); body.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fill();
    // fluting: engraved verticals that follow the taper
    g.save(); g.clip(); g.strokeStyle = 'rgba(10,5,3,.55)'; g.lineWidth = 1.1; for (let k = -9; k <= 9; k++) { g.beginPath(); g.moveTo(k * 6.6, 26); g.lineTo(k * 7.9, h); g.stroke(); }
    g.strokeStyle = 'rgba(255,214,160,.10)'; for (let k = -9; k <= 9; k++) { g.beginPath(); g.moveTo(k * 6.6 + 2, 26); g.lineTo(k * 7.9 + 2.4, h); g.stroke(); } g.restore();
    // slanted reading top
    g.fillStyle = '#5a3820'; g.beginPath(); g.moveTo(-80, 26); g.lineTo(80, 26); g.lineTo(70, 4); g.lineTo(-70, 4); g.closePath(); g.fill(); g.strokeStyle = 'rgba(255,220,170,.35)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-70, 4); g.lineTo(70, 4); g.stroke();
    // a guilloche roundel on the front (the film's through-line, no logo)
    g.save(); g.translate(0, 92); const G = guilloche({ R: 22, A: 6, B: 2.5, n: 11, m: 4, lines: 14 }); g.strokeStyle = 'rgba(255,200,130,.5)'; g.lineWidth = .7; for (let k = 0; k < G.lines; k++) strokePoly(g, G.line(k)); g.beginPath(); g.arc(0, 0, 31, 0, TAU); g.stroke(); g.restore();
    // gooseneck microphone
    g.strokeStyle = '#1a1a22'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(40, 6); g.bezierCurveTo(46, -16, 30, -30, 14, -34); g.stroke(); g.fillStyle = '#20202a'; g.beginPath(); g.ellipse(12, -35, 6, 4, -.4, 0, TAU); g.fill();
    return { c, w, h, pad };
  });
}
// audience heads and shoulders seen from behind; row k = 0 near … 2 far. Returns a cached layer (stage units, offset by ox, oy).
const ROWS = [{ y: 1075, r: 74, gap: 235, seed: 3, x0: -90 }, { y: 960, r: 44, gap: 128, seed: 5, x0: -30 }, { y: 884, r: 27, gap: 78, seed: 8, x0: 10 }];
function headsPath(g, k) {
  const R = ROWS[k], r = prng(R.seed);
  for (let x = R.x0 - 200; x < W + 260; x += R.gap * (.8 + r() * .45)) {
    if (r() < .12) { x += R.gap * .5; continue; }
    const hr = R.r * (.86 + r() * .28), hy = R.y - R.r * .9 + (r() - .5) * R.r * .35, sw = hr * (2.5 + r() * .5), bun = r() < .25, lean = (r() - .5) * .12;
    g.moveTo(x - sw, R.y + R.r * 3); g.bezierCurveTo(x - sw, hy + hr * 1.6, x - sw * .55, hy + hr * 1.05, x - hr * .45, hy + hr * .9);
    g.lineTo(x + hr * .45, hy + hr * .9); g.bezierCurveTo(x + sw * .55, hy + hr * 1.05, x + sw, hy + hr * 1.6, x + sw, R.y + R.r * 3); g.closePath();
    g.moveTo(x + hr, hy); g.ellipse(x + lean * hr, hy, hr * .86, hr, lean, 0, TAU);
    if (bun) { g.moveTo(x + hr * .45, hy - hr * .95); g.arc(x, hy - hr * .95, hr * .4, 0, TAU); }
  }
}
export function audienceRow(k) {
  return once('aud' + k, () => {
    const [c, g] = canvas(W + 400, H + 300); g.translate(200, 150);
    g.fillStyle = ['#040410', '#06071a', '#0a0b22'][k]; g.beginPath(); headsPath(g, k); g.fill();
    return c;
  });
}
// a rim of light along the tops of the heads (light from above-behind = the screen / the spot); col per call, alpha live
export function rimRow(k, col) {
  return once('rim' + k + col, () => {
    const [c, g] = canvas(W + 400, H + 300); g.translate(200, 150);
    g.strokeStyle = col; g.lineWidth = [3, 2.4, 1.8][k]; g.beginPath(); headsPath(g, k); g.stroke();
    // keep only the upper edges: mask with the shape moved down a little
    g.globalCompositeOperation = 'destination-out'; g.translate(0, [5, 4, 3][k]); g.fillStyle = '#000'; g.beginPath(); headsPath(g, k); g.fill();
    return c;
  });
}
// the spotlight cone (stippled, additive) from the truss lamp onto the lectern
export function coneLayer() {
  return once('cone', () => {
    const [c, g] = canvas(W, H), { x, y } = STAGE.spot, P = STAGE.pool;
    const lg = g.createLinearGradient(x, y, P.x, P.y); lg.addColorStop(0, rgba(AMBER, .55)); lg.addColorStop(.3, rgba(AMBER, .2)); lg.addColorStop(1, rgba(AMBER, .07));
    for (let s = 0; s < 7; s++) { const sp = (s - 3) / 3, half = P.rx * (.62 + .42 * Math.abs(sp) * 0) * (1 + .12 * s) * .72; g.globalAlpha = .2; g.fillStyle = lg; g.beginPath(); g.moveTo(x - 4, y); g.lineTo(x + 4, y); g.lineTo(P.x + half, P.y); g.lineTo(P.x - half, P.y); g.closePath(); g.fill(); }
    g.globalAlpha = 1;
    // the pool on the floor
    g.save(); g.translate(P.x, P.y); g.scale(1, P.ry / P.rx); const pg = g.createRadialGradient(0, 0, 0, 0, 0, P.rx); pg.addColorStop(0, rgba(AMBER, .55)); pg.addColorStop(.5, rgba(AMBER, .2)); pg.addColorStop(1, rgba(AMBER, 0)); g.fillStyle = pg; g.beginPath(); g.arc(0, 0, P.rx, 0, TAU); g.fill(); g.restore();
    stipple(c, { k: .8, g: 1.25, seed: 3 });
    return c;
  });
}
// a speaker at the lectern: a small dark silhouette (no face, from far), rim-lit by the spot from above-left
export function speaker(ctx, x, y, s, t, lit) {
  const b = Math.sin(t * 1.5) * 1.2, sway = Math.sin(t * .45) * 2.2;
  ctx.save(); ctx.translate(x + sway, y + b); ctx.scale(s, s);
  const body = new Path2D(); body.moveTo(-44, 80); body.bezierCurveTo(-44, 30, -34, 14, -12, 10); body.lineTo(12, 10); body.bezierCurveTo(34, 14, 44, 30, 44, 80); body.closePath();
  ctx.fillStyle = '#07060f'; ctx.fill(body); ctx.beginPath(); ctx.ellipse(0, -8, 14, 17, 0, 0, TAU); ctx.fill(); ctx.fillRect(-6, 4, 12, 10);
  if (lit > 0) { ctx.strokeStyle = rgba(AMBER, .75 * lit); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(0, -8, 14, 17, 0, Math.PI * 1.05, Math.PI * 1.75); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-40, 40); ctx.bezierCurveTo(-38, 22, -30, 14, -12, 10); ctx.stroke(); }
  ctx.restore();
}
// the stage screen's own picture before the clip: a cyan guilloche rosette on deep blue (cached), drawn on by u
export function screenRosette() {
  return once('scrRos', () => {
    const S = STAGE.scr, [c, g] = canvas(S.w, S.h);
    const bg = g.createRadialGradient(S.w * .5, S.h * .5, 0, S.w * .5, S.h * .5, S.w * .62); bg.addColorStop(0, '#1d3f86'); bg.addColorStop(.6, '#0d1d4c'); bg.addColorStop(1, '#060c26'); g.fillStyle = bg; g.fillRect(0, 0, S.w, S.h);
    g.save(); g.translate(S.w / 2, S.h / 2); const G = guilloche({ R: 150, A: 46, B: 18, n: 22, m: 7, lines: 40 }); g.strokeStyle = rgba(ICE, .5); g.lineWidth = .9; for (let k = 0; k < G.lines; k++) strokePoly(g, G.line(k));
    const G2 = guilloche({ R: 238, A: 14, B: 6, n: 60, m: 9, lines: 12 }); g.strokeStyle = rgba(CYAN, .3); for (let k = 0; k < G2.lines; k++) strokePoly(g, G2.line(k)); g.restore();
    g.strokeStyle = rgba(ICE, .12); g.lineWidth = 1; for (let y = 0; y < S.h; y += 3) { g.beginPath(); g.moveTo(0, y); g.lineTo(S.w, y); g.stroke(); }
    stipple(c, { k: .4, g: 1, seed: 6, mid: false, boost: 1.3 });
    return c;
  });
}

// ---------------------------------------------------------------- the timeline ruler (2.04, 2.05)
export const RULER = { y: 520, h: 132, x0: 230, px: 72, y0: 2025, y1: 2045, left: -260, right: 3700 };
export const yearX = (yr) => RULER.x0 + (yr - RULER.y0) * RULER.px;
export function rulerLayer() {
  return once('ruler', () => {
    const { h, left, right } = RULER, w = right - left, pad = 30, [c, g] = canvas(w + pad * 2, h + pad * 2); g.translate(pad - left, pad + h / 2);   // origin: x world, y = ruler centre
    // the strip: cream paper, rough edges, light from the upper left
    const edge = []; const n = vnoise(21); for (let x = left; x <= right; x += 10) edge.push([x, -h / 2 + n(x * .05, 0) * 1.2]); for (let x = right; x >= left; x -= 10) edge.push([x, h / 2 + n(x * .05, 40) * 1.2]);
    g.save(); g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 18; g.shadowOffsetY = 10; g.fillStyle = PAPER; g.beginPath(); edge.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fill(); g.restore();
    const pg = g.createLinearGradient(0, -h / 2, 0, h / 2); pg.addColorStop(0, 'rgba(255,250,236,.5)'); pg.addColorStop(.6, 'rgba(255,250,236,0)'); pg.addColorStop(1, 'rgba(120,96,64,.25)'); g.fillStyle = pg; g.beginPath(); edge.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fill();
    g.save(); g.beginPath(); edge.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); fibreFill(g, .45); g.restore();
    // guilloche bands along both edges (woven sines), framing hairlines
    for (const [yc, band] of [[-h / 2 + 15, 13], [h / 2 - 15, 13]]) {
      g.strokeStyle = rgba('#3d4a63', .55); g.lineWidth = .7;
      for (let k = 0; k < 6; k++) { const ph = k / 6 * TAU; g.beginPath(); for (let x = left; x <= right; x += 2) { const q = x * .085, d = band * .42 * (Math.sin(q + ph) * .75 + Math.sin(q * 2.03 - ph * 1.5) * .25); x === left ? g.moveTo(x, yc + d) : g.lineTo(x, yc + d); } g.stroke(); }
      g.lineWidth = 1; g.strokeStyle = rgba('#3d4a63', .6); for (const o of [-band * .55, band * .55]) { g.beginPath(); g.moveTo(left, yc + o); g.lineTo(right, yc + o); g.stroke(); }
    }
    microtext(g, left, -h / 2 + 28, w, 'YEARS FROM NOW', { size: 5.5, col: '#3d4a63', a: .55 });
    // intaglio shading at the lower edge
    g.save(); g.strokeStyle = rgba('#3d2c1c', .16); g.lineWidth = .8; for (let x = left; x < right; x += 4) { g.beginPath(); g.moveTo(x, h / 2 - 30); g.lineTo(x + 8, h / 2 - 3); g.stroke(); } g.restore();
    // the scale on its own layer (the burin engraves it from left to right)
    const [sc, sg] = canvas(c.width, c.height); sg.translate(pad - left, pad + h / 2); scale(sg);
    return { c, sc, pad, left };
  });
}
function scale(g) {
  const { left, right } = RULER;
  {
    const ink = INK, yb = 0; g.strokeStyle = rgba(ink, .8); g.lineWidth = 1.2; g.beginPath(); g.moveTo(left, yb); g.lineTo(right, yb); g.stroke();
    for (let yr = 2016; yr <= 2054; yr++) {
      const x = yearX(yr), big = yr % 5 === 0; g.lineWidth = big ? 2 : 1.1; g.beginPath(); g.moveTo(x, yb); g.lineTo(x, yb - (big ? 34 : 17)); g.stroke();
      g.lineWidth = .6; for (let q = 1; q < 4; q++) { const xx = x + q * RULER.px / 4; g.beginPath(); g.moveTo(xx, yb); g.lineTo(xx, yb - 7); g.stroke(); }
      if (big) { g.font = '400 34px "Instrument Serif"'; g.fillStyle = rgba(ink, .9); g.textAlign = 'center'; g.fillText(String(yr), x, yb + 34); }
    }
  }
}

// ---------------------------------------------------------------- the IF seal (2.05)
export function ifSeal(ctx, x, y, r, t, o = {}) {
  const wipe = clamp(o.wipe ?? 1), a = o.a ?? 1; if (a <= 0 || wipe <= 0) return;
  const body = once('ifseal' + r, () => {
    const S = Math.ceil(r * 2.8), [c, g] = canvas(S, S); g.translate(S / 2, S / 2);
    // the film's seal (copied from certificate.seal, with the foil stipple placed correctly): scallops, emboss, foil, rings, ring microtext
    const scal = 36, edge = (gg, rr) => { gg.beginPath(); for (let i = 0; i <= 360; i++) { const a = i / 360 * TAU, q = rr * (1 + .035 * Math.cos(scal * a)); i ? gg.lineTo(Math.cos(a) * q, Math.sin(a) * q) : gg.moveTo(Math.cos(a) * q, Math.sin(a) * q); } gg.closePath(); };
    g.save(); g.translate(-r * .025, -r * .025); edge(g, r); g.fillStyle = '#ffe9c0'; g.fill(); g.restore();
    g.save(); g.translate(r * .035, r * .04); edge(g, r); g.fillStyle = 'rgba(70,30,8,.85)'; g.fill(); g.restore();
    edge(g, r); const fg = g.createLinearGradient(-r, -r, r, r); FOIL.forEach((col, i) => fg.addColorStop(i / (FOIL.length - 1), col)); g.fillStyle = fg; g.fill();
    g.strokeStyle = 'rgba(90,40,10,.75)'; g.lineWidth = Math.max(.8, r * .012); for (const q of [.9, .72, .7]) { g.beginPath(); g.arc(0, 0, r * q, 0, TAU); g.stroke(); }
    microRing(g, 0, 0, r * .81, 'IF AI AND ROBOTS KEEP GETTING BETTER', { size: Math.max(5, r * .085), col: '#5a2a08', a: .8 });
    { const [nc, nx] = canvas(S, S); nx.translate(S / 2, S / 2); edge(nx, r); nx.fillStyle = 'rgba(255,240,200,.35)'; nx.fill(); nx.setTransform(1, 0, 0, 1, 0, 0); stipple(nc, { k: 1, g: 1.4, seed: 5, mid: false, boost: 1.4 });
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'overlay'; g.drawImage(nc, 0, 0); g.restore(); }
    const cg = g.createRadialGradient(-r * .2, -r * .25, 0, 0, 0, r * .66); cg.addColorStop(0, '#ffe7b8'); cg.addColorStop(.6, '#d98d3c'); cg.addColorStop(1, '#8a4416'); g.fillStyle = cg; g.beginPath(); g.arc(0, 0, r * .64, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(90,40,10,.6)'; g.lineWidth = Math.max(.8, r * .01); for (let k = 0; k < 26; k++) { g.beginPath(); g.arc(0, 0, r * (.2 + k * .017), 0, TAU); g.stroke(); }
    g.font = `400 ${Math.round(r * .82)}px "Instrument Serif"`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = 'rgba(70,28,6,.85)'; g.fillText('IF', r * .025, r * .1); g.fillStyle = 'rgba(255,246,222,.95)'; g.fillText('IF', -r * .015, r * .055);
    g.fillStyle = '#b5621f'; g.fillText('IF', 0, r * .075);
    return c;
  });
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.globalAlpha = a; const S = body.width;
  if (wipe < 1) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, S, -Math.PI / 2, -Math.PI / 2 + wipe * TAU); ctx.closePath(); ctx.clip(); }
  ctx.drawImage(body, -S / 2, -S / 2);
  // a slow foil glint across the face
  if (o.glint != null) { const p = o.glint, gx = mix(-r * 1.4, r * 1.4, p), gg = ctx.createLinearGradient(gx - r * .4, -r, gx + r * .4, r); gg.addColorStop(0, 'rgba(255,240,210,0)'); gg.addColorStop(.5, `rgba(255,248,232,${.55 * Math.sin(Math.PI * clamp(p))})`); gg.addColorStop(1, 'rgba(255,240,210,0)');
    ctx.globalCompositeOperation = 'lighter'; ctx.beginPath(); ctx.arc(0, 0, r * 1.02, 0, TAU); ctx.clip(); ctx.fillStyle = gg; ctx.fillRect(-r * 1.2, -r * 1.2, r * 2.4, r * 2.4); }
  ctx.restore();
}

// ---------------------------------------------------------------- the staircase (2.06, 2.07)
// slab i: an engraved plate floating as a step; front face RUN × TH, top face with depth vector D; finer engraving with every i
export const STEP = { run: 172, rise: 112, th: 46, D: [64, -40], n: 14 };
export function slabLayer(i) {
  return once('slab' + i, () => {
    const { run, th, D } = STEP, pad = 24, w = run + D[0] + pad * 2, h = th - D[1] + pad * 2, [c, g] = canvas(w, h); g.translate(pad, pad - D[1]);   // origin = front face top-left
    const gap = Math.max(1.7, 6.2 * Math.pow(.82, i)), waves = 10 + i * 4;
    // top face (the tread), lit warm from the upper right
    const top = new Path2D(); top.moveTo(0, 0); top.lineTo(run, 0); top.lineTo(run + D[0], D[1]); top.lineTo(D[0], D[1]); top.closePath();
    const tg = g.createLinearGradient(0, 0, run + D[0], D[1]); tg.addColorStop(0, '#e9dcbf'); tg.addColorStop(1, '#fff3da'); g.fillStyle = tg; g.fill(top);
    g.save(); g.clip(top); g.strokeStyle = rgba('#7a5a34', .35); g.lineWidth = .6; for (let k = 0; k < 5; k++) { const q = (k + 1) / 6; g.beginPath(); g.moveTo(D[0] * q, D[1] * q); g.lineTo(run + D[0] * q, D[1] * q); g.stroke(); } g.restore();
    // right side face (shadow)
    const side = new Path2D(); side.moveTo(run, 0); side.lineTo(run + D[0], D[1]); side.lineTo(run + D[0], D[1] + th); side.lineTo(run, th); side.closePath();
    g.fillStyle = '#5b4a3a'; g.fill(side); g.save(); g.clip(side); g.strokeStyle = 'rgba(20,12,8,.55)'; g.lineWidth = .8; for (let k = -40; k < 80; k += 3.2) { g.beginPath(); g.moveTo(run + k, -40); g.lineTo(run + k + 40, 60); g.stroke(); } g.restore();
    // front face: paper plate with intaglio lines (finer per step) and a woven guilloche band
    const front = new Path2D(); front.rect(0, 0, run, th);
    const fg = g.createLinearGradient(0, 0, 0, th); fg.addColorStop(0, '#d9ccb0'); fg.addColorStop(1, '#a8977a'); g.fillStyle = fg; g.fill(front);
    g.save(); g.clip(front); g.strokeStyle = rgba(INK, .72); g.lineWidth = Math.max(.45, gap * .22); for (let y = gap * .5; y < th; y += gap) { g.beginPath(); for (let x = 0; x <= run; x += 3) { const yy = y + Math.sin(x * .05 + y) * .6; x ? g.lineTo(x, yy) : g.moveTo(x, yy); } g.stroke(); }
    g.strokeStyle = rgba('#2a3550', .65); g.lineWidth = .55; for (let k = 0; k < 3; k++) { const ph = k / 3 * TAU; g.beginPath(); for (let x = 0; x <= run; x += 1.5) { const yy = th * .5 + th * .22 * Math.sin(x / run * waves * TAU / 2 + ph); x ? g.lineTo(x, yy) : g.moveTo(x, yy); } g.stroke(); }
    g.restore();
    g.strokeStyle = rgba('#2a1d14', .7); g.lineWidth = 1; g.strokeRect(0, 0, run, th);
    // the foil edge where top meets front
    const eg = g.createLinearGradient(0, 0, run, 0); FOIL.forEach((col, k) => eg.addColorStop(k / (FOIL.length - 1), col)); g.strokeStyle = eg; g.lineWidth = 2.2; g.beginPath(); g.moveTo(0, 0); g.lineTo(run, 0); g.stroke();
    return { c, pad, D };
  });
}
