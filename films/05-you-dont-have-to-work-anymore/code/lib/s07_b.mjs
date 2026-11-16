// s07_b · chapter 07, second part: 07b (time stops, 4,000 weeks, Bronnie Ware), 07c (the weeks left, old + young hand,
// the line on screen), 07d up to "for as long as there have been people" (procession, tilt into the sky), and 7.25–7.26.
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, lin, sm, eio, eout, ein, quart, drift, PX, PY, LW, LH, cache, wl, camT, drawL, proj,
  stip, skyLayer, twinkle, ridgeLayer, fogLayer, lightLayer, figSprite, drawFig, tintSprite, groundShadow, txt, vig } from './s07_kit.mjs';
import { layer, roughPath, roughPoly, roughRect, roughLine, hatch, house, vnoise, fbm, quadMap } from './art.mjs';
import { meadowWorld, meadowBack, ridgeMid, sine, heron } from './s07_a.mjs';

const CREAM = '#f3efe2', HOT = '#ffd9a0', AMBER = '#ffb35c', INK = '#070918', MUTED = '#a49fc4';

// ================================================================== time warp for "let time stop" (never zero)
function warp(t, ts) { // seconds of "scene time" elapsed; slows to 4 % after ts
  if (t <= ts) return t;
  let s = ts, n = 24, d = (t - ts) / n; for (let i = 0; i < n; i++) { const u = ts + (i + .5) * d; s += d * mix(1, .04, sm(lin(ts, ts + .7, u))); } return s;
}
// ================================================================== the dandelion seeds (7.14 → G8)
const HEAD = [760, 610], HR = 150, NSEED = 150;
const SEEDS = (() => { const r = prng(321), a = []; for (let i = 0; i < NSEED; i++) { const th = r() * 6.283, ph = Math.acos(2 * r() - 1), dx = Math.sin(ph) * Math.cos(th), dy = Math.cos(ph), front = Math.sin(ph) * Math.sin(th);
  a.push({ dx, dy, front, launch: r(), vx: 60 + r() * 140, vy: -30 - r() * 90, wob: r() * 6, sz: .7 + r() * .5, tgt: Math.floor(r() * 12), tr: r(), tc: r() }); } return a.sort((p, q) => p.front - q.front); })();
function seedPos(sd, t, T) {
  const t14 = T.S('07b', 'So let time') - .25, ts = T.S('07b', 'stop');
  const tl = mix(t14 - .2, ts - .1, sd.launch) + (sd.launch > .78 ? 99 : 0);   // a fifth stay on the head
  const hx = HEAD[0] + sd.dx * HR, hy = HEAD[1] + sd.dy * HR;
  if (t < tl) return [hx, hy, 0];
  const tau = warp(t, ts) - warp(tl, ts);
  return [hx + sd.vx * tau + Math.sin(tau * 1.3 + sd.wob) * 18 * Math.min(1, tau), hy + sd.vy * tau - 6 * tau * tau, Math.min(1, tau * 2)];
}
function drawSeed(ctx, x, y, s, a, ang = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.globalAlpha = a;
  ctx.strokeStyle = rgba(CREAM, .55); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 16 * s); ctx.stroke();
  for (let k = -4; k <= 4; k++) { const an = k * .3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(an) * 13 * s, -Math.cos(an) * 9 * s); ctx.stroke(); }
  ctx.fillStyle = '#fbf8ee'; ctx.beginPath(); ctx.ellipse(0, 17 * s, 1.6 * s, 3 * s, 0, 0, 7); ctx.fill();
  ctx.restore();
}
// ================================================================== the weeks wall (G8, in the g3 look)
const WQ = [[330, 70], [930, 70], [1010, 960], [250, 960]], WM = quadMap(WQ), COLS = 52, ROWS = 80, NOW = [34, 20];
const sqC = (row, col) => WM((col + .5) / COLS, 1 - (row + .5) / ROWS);
const sqQ = (row, col, g = 0) => { const v0 = 1 - (row + 1) / ROWS, v1 = 1 - row / ROWS, u0 = col / COLS, u1 = (col + 1) / COLS, gu = (.16 + g) / COLS, gv = (.2 + g) / ROWS; return [WM(u0 + gu, v0 + gv), WM(u1 - gu, v0 + gv), WM(u1 - gu, v1 - gv), WM(u0 + gu, v1 - gv)]; };
const CLUST = (() => { const r = prng(55), a = []; for (let i = 0; i < 12; i++) a.push([Math.floor(6 + r() * 68), Math.floor(4 + r() * 44)]); return a; })();
function wallLayers() {
  const n = vnoise(4);
  const mk = (fill, halo) => { const [c, x] = layer(W, H);
    for (let row = 0; row < ROWS; row++) for (let col = 0; col < COLS; col++) { const q = sqQ(row, col), fl = .82 + .18 * n(col * .4, row * .3); x.fillStyle = fill(row, col, fl); x.beginPath(); x.moveTo(...q[0]); x.lineTo(...q[1]); x.lineTo(...q[2]); x.lineTo(...q[3]); x.closePath(); x.fill(); }
    if (halo) { const [hc, hx] = layer(W, H); hx.filter = 'blur(10px)'; hx.drawImage(c, 0, 0); x.save(); x.globalCompositeOperation = 'destination-over'; x.globalAlpha = .5; x.drawImage(hc, 0, 0); x.restore(); }
    return c; };
  const lived = mk((r, c, fl) => mixHex('#f0a24e', HOT, (fl - .82) * 4), true);
  const ahead = mk((r, c, fl) => mixHex('#3a3b78', '#5c5c9c', (fl - .82) * 4 + (1 - r / 80) * .3), false);
  // backdrop: night ground, the wall's dark slab, fog at its foot, a glow
  const [bg, bx] = layer(W, H);
  { const g = bx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#05071a'); g.addColorStop(.6, '#0d1236'); g.addColorStop(1, '#1b1d4a'); bx.fillStyle = g; bx.fillRect(0, 0, W, H); }
  { const r = prng(9); for (let i = 0; i < 500; i++) { bx.fillStyle = rgba(CREAM, .1 + .4 * r() * r()); bx.fillRect(r() * W, r() * H * .8, 1.3, 1.3); } }
  roughPoly(bx, [WM(-.02, -.012), WM(1.02, -.012), WM(1.02, 1.01), WM(-.02, 1.01)], '#0b0e2a', { amp: 1.5, seed: 3 });
  const [fg, fx] = layer(W, H);
  roughPoly(fx, [[-10, 1000], [W + 10, 985], [W + 10, H + 10], [-10, H + 10]], '#070919', { amp: 1.5, seed: 5 });
  const fogc = fogLayer({ y0: 860 - PY, y1: 1080 + PY, col: '#4a4f8a', a: .45, seed: 9, cover: .7, soft: .5, k: .3 });
  const you = figSprite(.62, { lean: -.05, head: -.45, sh: [.15, -.12], el: [.4, .45], hip: [.04, -.06], kn: [0, .05], hood: true, coat: 1 },
    { dress: { coat: '#e59a3a', pants: '#14141e', shoes: '#0b0a12', skin: '#e9c3a0', hair: '#2a1a14' }, flip: true, light: { x: -400, y: -400, col: HOT, a: .55 }, rim: HOT, rimSide: -1, rimW: 1.8 });
  const glowL = lightLayer(630, 600, 760, { col: AMBER, core: HOT, a: .2, sy: .9, seed: 2, k: .35 });
  const pool = lightLayer(630, 1010, 560, { col: AMBER, core: HOT, a: .4, sy: .09, seed: 4 });
  return { lived, ahead, bg, fg, fogc, you, glowL, pool };
}
function clipRows(ctx, k) { // weeks 0..k-1 (row-major from the bottom)
  const fullRows = Math.floor(k / COLS), rem = k % COLS;
  ctx.beginPath();
  if (fullRows > 0) { const v = 1 - fullRows / ROWS; ctx.moveTo(...WM(-.01, 1.01)); ctx.lineTo(...WM(1.01, 1.01)); ctx.lineTo(...WM(1.01, v)); ctx.lineTo(...WM(-.01, v)); ctx.closePath(); }
  if (rem > 0) { const v0 = 1 - (fullRows + 1) / ROWS, v1 = 1 - fullRows / ROWS, u = rem / COLS; ctx.moveTo(...WM(-.01, v1)); ctx.lineTo(...WM(u, v1)); ctx.lineTo(...WM(u, v0)); ctx.lineTo(...WM(-.01, v0)); ctx.closePath(); }
  ctx.clip();
}
function clipBand(ctx, r0, r1) { ctx.beginPath(); ctx.moveTo(...WM(-.01, 1 - r0 / ROWS)); ctx.lineTo(...WM(1.01, 1 - r0 / ROWS)); ctx.lineTo(...WM(1.01, 1 - r1 / ROWS)); ctx.lineTo(...WM(-.01, 1 - r1 / ROWS)); ctx.closePath(); ctx.clip(); }

// wall scene: o = { asm: 0..1 assembly radius, lived: weeks lived shown, pulse: row band 0..1 or -1, nowA, labels: fn(ctx,t) }
function drawWall(ctx, t, cm, L, o) {
  ctx.drawImage(L.bg, 0, 0);
  ctx.save(); camT(ctx, cm, .3); ctx.drawImage(L.glowL, -PX, -PY); ctx.restore();
  ctx.save(); camT(ctx, cm, 1);
  // squares still ahead (assembled from the landing points outward)
  ctx.save();
  if (o.asm < 1) { for (const [k, a] of [[1.25, .35], [1, 1]]) { ctx.save(); ctx.beginPath(); for (const [r, c] of CLUST) { const [x, y] = sqC(r, c), R = o.asm * 1300 * k; ctx.moveTo(x + R, y); ctx.arc(x, y, R, 0, 6.2831); } ctx.clip(); ctx.globalAlpha = a; ctx.drawImage(L.ahead, 0, 0); ctx.restore(); } }
  else ctx.drawImage(L.ahead, 0, 0);
  if (o.lived > 0) { ctx.save(); clipRows(ctx, o.lived); ctx.drawImage(L.lived, 0, 0); ctx.restore(); }
  ctx.restore();
  if (o.pulse >= 0 && o.pulse <= 1) { const rr = o.pulse * 92 - 6; ctx.save(); clipBand(ctx, Math.max(0, rr), Math.min(80, rr + 6)); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .35; ctx.drawImage(L.lived, 0, 0); ctx.restore(); }
  // "now": one brighter week
  if (o.nowA > 0) { const [x, y] = sqC(...NOW), q = sqQ(...NOW, -.1); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y, 0, x, y, 46); g.addColorStop(0, rgba('#fff6e0', .9 * o.nowA)); g.addColorStop(.3, rgba(AMBER, .35 * o.nowA)); g.addColorStop(1, rgba(AMBER, 0)); ctx.fillStyle = g; ctx.fillRect(x - 46, y - 46, 92, 92); ctx.restore(); ctx.fillStyle = rgba('#fffaf0', o.nowA); ctx.beginPath(); ctx.moveTo(...q[0]); ctx.lineTo(...q[1]); ctx.lineTo(...q[2]); ctx.lineTo(...q[3]); ctx.fill(); }
  ctx.restore();
  // ground, fog, you looking up
  ctx.save(); camT(ctx, cm, 1.05); ctx.drawImage(L.fogc, -PX + (t * 6) % 40 - 20, -PY); ctx.drawImage(L.fg, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .5 + .5 * clamp(o.lived / 1500); ctx.drawImage(L.pool, -PX, -PY); ctx.restore();
  ctx.save(); camT(ctx, cm, 1.05); drawFig(ctx, L.you, 1110, 1000, t, { ph: 3 }); ctx.restore();
}
function wallTicks(ctx, a, cm) {
  if (a <= 0) return;
  ctx.save(); camT(ctx, cm, 1);
  for (const age of [0, 20, 40, 60, 80]) { const [x, y] = WM(0, 1 - age / ROWS); ctx.strokeStyle = rgba('#d6d1ea', .55 * a); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x - 8, y); ctx.lineTo(x - 26, y); ctx.stroke(); txt(ctx, String(age), x - 34, y + 6, { size: 18, weight: 500, color: '#cfcae6', align: 'right', alpha: a }); }
  txt(ctx, 'AGE', WM(0, .48)[0] - 94, WM(0, .48)[1], { size: 13, weight: 600, color: '#8f8ab0', spacing: 4, alpha: a });
  ctx.restore();
}

// ================================================================== 7.14 "So let time stop for a moment."
function shot14(T, t0) {
  const ts = T.S('07b', 'stop');
  const cam = (t) => ({ x: drift(t, 4, 1) + (t - t0) * 6, y: drift(t, 3, 2), z: 1.0 });
  return {
    t: t0, tr: 'zoom', d: .9, depth: 5,
    draw(ctx, t) {
      const L = cache('s07-meadow', 'world', t, meadowWorld), cm = cam(t), tau = warp(t, ts);
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(1.25, 1.25); ctx.translate(-W / 2, -H / 2 + 80); meadowBack(ctx, tau, cm, L, warp(t0, ts)); drawL(ctx, L.mid, cm, .45, { a: .55 }); ctx.restore();
      ctx.fillStyle = rgba('#05061a', .25); ctx.fillRect(0, 0, W, H);
      // the stem and the seed head, swaying (the sway also slows with time)
      const sw = Math.sin(tau * 1.1) * .03 + Math.sin(tau * 2.3) * .01;
      ctx.save(); ctx.translate(HEAD[0], H + 40); ctx.rotate(sw); ctx.translate(-HEAD[0], -H - 40);
      ctx.strokeStyle = '#1a1c48'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(HEAD[0] - 30, H + 40); ctx.quadraticCurveTo(HEAD[0] - 50, 900, HEAD[0], HEAD[1]); ctx.stroke();
      ctx.strokeStyle = rgba('#d8d2ff', .45); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(HEAD[0] - 24, H + 40); ctx.quadraticCurveTo(HEAD[0] - 44, 900, HEAD[0] + 5, HEAD[1]); ctx.stroke();
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(HEAD[0], HEAD[1], 0, HEAD[0], HEAD[1], HR * 1.9); g.addColorStop(0, rgba('#e8e4ff', .2)); g.addColorStop(1, rgba('#e8e4ff', 0)); ctx.fillStyle = g; ctx.fillRect(HEAD[0] - HR * 2, HEAD[1] - HR * 2, HR * 4, HR * 4); ctx.restore();
      ctx.restore();
      // seeds: attached ones are drawn as spokes from the receptacle, launched ones fly with the wind
      for (const sd of SEEDS) { const [x, y, f] = seedPos(sd, t, T), lit = .55 + .45 * (sd.dx * .6 - sd.dy * .4);
        if (f === 0) { const hx = HEAD[0] + Math.sin(sw) * (H - HEAD[1]), ang = Math.atan2(sd.dy, sd.dx) + Math.PI / 2; ctx.strokeStyle = rgba(CREAM, .25 * lit); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(hx, HEAD[1]); ctx.lineTo(x + Math.sin(sw) * 40, y); ctx.stroke(); drawSeed(ctx, x + Math.sin(sw) * 40, y, sd.sz * 1.4, (.5 + .5 * lit) * (.6 + .4 * (sd.front + 1) / 2), ang); }
        else drawSeed(ctx, x, y, sd.sz * 1.4, .9, Math.sin(warp(t, ts) * 1.5 + sd.wob) * .3 + .2);
      }
      ctx.fillStyle = '#2a2c5a'; ctx.beginPath(); ctx.arc(HEAD[0] + Math.sin(sw) * 40, HEAD[1], 16, 0, 6.2831); ctx.fill();
      vig(ctx, .55);
    },
  };
}

// ================================================================== G8 · 7.15–7.17 the 4,000 weeks
function shotG8(T, t0) {
  const tFour = T.S('07b', 'four thousand'), tE = T.S('07b', 'Eighty'), tB = T.S('07b', 'behind'), tSome = T.S('07b', 'Some of yours'), tEnd = T.S('07b', 'Bronnie');
  const LIVED = NOW[0] * COLS + NOW[1];
  const cam = (t) => ({ x: drift(t, 4, 3), y: drift(t, 3, 5), z: 1 + .025 * sm(lin(t0, tEnd, t)) });
  const self = {
    t: t0, tr: 'match', d: .8,
    cam,
    draw(ctx, t) {
      const L = cache('s07-wall', 'w', t, wallLayers), cm = cam(t);
      const asm = sm(lin(t0 + .9, tFour + .2, t));
      const lived = Math.round(LIVED * eio(lin(tSome + .2, tB + .25, t)));
      drawWall(ctx, t, cm, L, { asm, lived, pulse: lin(tE - .1, tE + 1.1, t) * (t < tE - .1 ? -1 : 1), nowA: sm(lin(tB, tB + .4, t)) * (.85 + .15 * Math.sin(t * 3)) });
      // the seeds from 7.14 fly in and become the first weeks
      const tf = t0 + .45;
      if (t < tFour + .6) for (const [i, sd] of SEEDS.entries()) {
        const [sx, sy] = seedPos(sd, Math.min(t, tf), T), [r0, c0] = CLUST[sd.tgt], row = clamp(r0 + Math.floor((sd.tr - .5) * 6), 0, 79), col = clamp(c0 + Math.floor((sd.tc - .5) * 6), 0, 51);
        const [gx, gy] = proj(cm, 1, ...sqC(row, col)), u = eio(lin(tf + i * .004, tf + 1.3 + i * .004, t));
        const x = mix(sx, gx, u) + Math.sin(u * Math.PI) * 60 * (sd.tc - .5), y = mix(sy, gy, u) - Math.sin(u * Math.PI) * 80;
        if (u < 1) drawSeed(ctx, x, y, sd.sz * mix(1.4, .4, u), 1 - sm(lin(.85, 1, u)), (1 - u) * .3);
        if (u > .8) { ctx.fillStyle = rgba('#fff1cf', (1 - sm(lin(tFour - .4, tFour + .6, t))) * .9); ctx.fillRect(gx - 3, gy - 2, 6, 4); }
      }
      wallTicks(ctx, sm(lin(tE - .2, tE + .5, t)), cm);
      // right column: the editorial typesetting of g3
      const X = 1290, a1 = sm(lin(tFour - .3, tFour + .5, t)), dy = (1 - a1) * 14;
      if (a1 > 0) { ctx.fillStyle = rgba(AMBER, a1); ctx.fillRect(X, 128, 28 * a1, 2); }
      txt(ctx, 'A LIFE IN WEEKS', X, 160 + dy, { size: 16, weight: 600, color: MUTED, spacing: 6, alpha: a1 });
      txt(ctx, 'about 4,000 weeks', X, 236 + dy, { size: 64, font: 'Instrument Serif', color: CREAM, alpha: a1 });
      const a2 = sm(lin(tE - .1, tE + .6, t));
      txt(ctx, '80 years × 52 weeks. One square is one week, one row is one year.', X, 274 + (1 - a2) * 10, { size: 17, weight: 400, color: '#b9b3d8', alpha: a2 });
      const a3 = sm(lin(tB - .3, tB + .4, t)), sq = (y, col, label, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; roughRect(ctx, X, y, 22, 22, col, { amp: .4, seed: y }); ctx.restore(); txt(ctx, label, X + 40, y + 19, { size: 26, font: 'Instrument Serif', color: CREAM, alpha: a }); };
      sq(330, '#f6b55f', 'a week lived', a3); sq(378, '#45458a', 'a week still ahead', a3 * sm(lin(tB, tB + .6, t)));
      txt(ctx, 'NOW', sqC(...NOW)[0] + 30, sqC(...NOW)[1] - 14, { size: 14, weight: 600, color: HOT, spacing: 4, alpha: a3 });
      txt(ctx, '80 × 52 = 4,160 weeks. After Oliver Burkeman, Four Thousand Weeks (2021).', X, 1040, { size: 14, weight: 400, color: '#8f8ab0', alpha: a2 });
      vig(ctx, .45);
    },
  };
  self.now = (t) => proj(cam(t), 1, ...sqC(...NOW));
  return self;
}

// ================================================================== 7.18 Bronnie Ware at a bedside (wide, then close)
const LAMP = [318, 520];
function bedroom() {
  const [g, x] = wl();
  // wall, floor, window with the night, the bed, the bedside table with the lamp
  x.fillStyle = '#2a1c22'; x.fillRect(-PX, -PY, LW, 860 + PY);
  hatch(x, [-PX, -PY, LW, 860 + PY], { angle: 1.5, gap: 9, col: '#000', a: .2, seed: 2 });
  roughPoly(x, [[-PX, 860], [W + PX, 850], [W + PX, H + PY], [-PX, H + PY]], '#3a2620', { amp: 1.5, seed: 3 });
  for (let k = 0; k < 12; k++) { x.strokeStyle = rgba('#000', .3); x.lineWidth = 1.5; x.beginPath(); x.moveTo(-PX, 870 + k * k * 2.2); x.lineTo(W + PX, 860 + k * k * 2.2); x.stroke(); }
  // window
  roughRect(x, 1330, 150, 330, 400, '#1a1018', { amp: .8, seed: 4 });
  { const wg = x.createLinearGradient(0, 170, 0, 530); wg.addColorStop(0, '#0a0e34'); wg.addColorStop(1, '#2a2e6e'); x.fillStyle = wg; x.fillRect(1350, 170, 290, 360); const r = prng(5); for (let i = 0; i < 70; i++) { x.fillStyle = rgba(CREAM, .2 + .6 * r() * r()); x.fillRect(1350 + r() * 290, 170 + r() * 300, 1.5, 1.5); } }
  x.fillStyle = '#1a1018'; x.fillRect(1492, 170, 6, 360); x.fillRect(1350, 340, 290, 6);
  roughPoly(x, [[1300, 130], [1380, 130], [1360, 600], [1290, 610]], '#5a3a3a', { amp: 2, seed: 6 }); roughPoly(x, [[1620, 130], [1700, 130], [1712, 610], [1640, 600]], '#5a3a3a', { amp: 2, seed: 7 });
  // bed
  roughRect(x, 610, 560, 40, 300, '#3a2418', { amp: .8, seed: 8 });                                    // headboard post
  roughRect(x, 620, 590, 30, 180, '#4a2e1e', { amp: .8, seed: 9 });
  roughPoly(x, [[640, 700], [1580, 700], [1580, 790], [640, 790]], '#d8cfc0', { amp: 1.2, seed: 10 });   // mattress + sheet
  roughPoly(x, [[640, 790], [1580, 790], [1580, 812], [640, 812]], '#3a2418', { amp: .8, seed: 11 });
  for (const lx of [650, 1555]) roughRect(x, lx, 800, 20, 70, '#2a1a12', { amp: .5, seed: lx });
  roughPoly(x, [[660, 650], [830, 640], [850, 700], [660, 708]], '#efe6d6', { amp: 2, seed: 12 });      // pillow
  // blanket over the body: a soft hump, folded edge
  roughPoly(x, [[800, 702], [880, 668], [1100, 650], [1300, 662], [1480, 676], [1590, 700], [1600, 800], [800, 800]], '#7a4a3e', { amp: 2.5, seed: 13 });
  x.save(); x.beginPath(); roughPath(x, [[800, 702], [880, 668], [1100, 650], [1300, 662], [1480, 676], [1590, 700], [1600, 800], [800, 800]], { amp: 2.5, seed: 13 }); x.clip(); hatch(x, [790, 640, 820, 170], { angle: .3, gap: 6, col: '#2a1410', a: .3, seed: 14 }); x.restore();
  roughPoly(x, [[800, 702], [880, 670], [905, 690], [830, 712]], '#e8ded0', { amp: 1, seed: 15 });
  // the patient's head on the pillow (grey hair)
  x.fillStyle = '#d8b090'; x.beginPath(); x.ellipse(770, 668, 34, 28, -.2, 0, 6.2831); x.fill();
  x.fillStyle = '#c8c2ba'; x.beginPath(); x.ellipse(752, 660, 30, 26, -.2, 0, 6.2831); x.fill();
  // bedside table + lamp
  roughRect(x, 230, 600, 180, 26, '#4a2e1e', { amp: .8, seed: 16 }); roughRect(x, 246, 626, 150, 230, '#3a2418', { amp: .8, seed: 17 });
  roughRect(x, LAMP[0] - 8, LAMP[1] + 10, 16, 70, '#2a1a12', { amp: .5, seed: 18 }); roughRect(x, LAMP[0] - 32, 586, 64, 16, '#2a1a12', { amp: .5, seed: 19 });
  roughPoly(x, [[LAMP[0] - 40, LAMP[1] + 14], [LAMP[0] + 40, LAMP[1] + 14], [LAMP[0] + 26, LAMP[1] - 40], [LAMP[0] - 26, LAMP[1] - 40]], '#ffcf8a', { amp: .8, seed: 20 });
  // a glass of water and a book
  roughRect(x, 360, 570, 18, 30, rgba('#cfe6ea', .6), { amp: .3, seed: 21 });
  // the lamp light over everything
  x.save(); x.globalCompositeOperation = 'screen'; const lg = x.createRadialGradient(LAMP[0], LAMP[1], 0, LAMP[0], LAMP[1], 1500); lg.addColorStop(0, rgba('#ffd59a', .85)); lg.addColorStop(.25, rgba('#e08a40', .35)); lg.addColorStop(.6, rgba('#7a3b17', .1)); lg.addColorStop(1, rgba('#000', 0)); x.fillStyle = lg; x.fillRect(-PX, -PY, LW, LH); x.restore();
  { const sg = x.createLinearGradient(-PX, 0, W + PX, 0); sg.addColorStop(0, rgba('#000', 0)); sg.addColorStop(.6, rgba('#0a0610', .15)); sg.addColorStop(1, rgba('#0a0610', .5)); x.fillStyle = sg; x.fillRect(-PX, -PY, LW, LH); }
  stip(g, { k: .35, seed: 3 });
  const pose = (q) => ({ lean: mix(.3, .45, q), head: mix(.35, .55, q), hip: [1.5, 1.4], kn: [1.5, 1.4], sh: [mix(1.25, 1.4, q), 1.0], el: [mix(.2, .1, q), .9], hair: 'long', coat: 1 });
  const carer = [0, 1].map((q) => figSprite(2.35, pose(q), { dress: { coat: '#3a5a6a', pants: '#2a2a3a', skin: '#e0b48e', hair: '#6a3a1e' }, light: { x: -300, y: -150, col: '#ffcf8a', a: .65 }, rim: '#ffd59a', rimSide: -1, rimW: 2.4 }));
  const chair = (() => { const [c, cx] = wl(); roughRect(cx, 340, 600, 26, 260, '#2a1a12', { amp: .6, seed: 30 }); roughPoly(cx, [[340, 760], [560, 760], [560, 784], [340, 784]], '#3a2418', { amp: .6, seed: 31 }); for (const lx of [350, 540]) roughRect(cx, lx, 784, 14, 80, '#2a1a12', { amp: .4, seed: lx }); return c; })();
  const glow = lightLayer(LAMP[0], LAMP[1] - 10, 380, { col: AMBER, core: '#fff1cf', a: .5, seed: 22 });
  return { g, carer, chair, glow };
}
function drawBedroom(ctx, t, cm, L, q, tRef) {
  drawL(ctx, L.g, cm, 1); drawL(ctx, L.chair, cm, 1);
  ctx.save(); camT(ctx, cm, 1);
  const sp = L.carer[q > .5 ? 1 : 0], FX = 450, FY = 870;
  drawFig(ctx, sp, FX, FY, t, { ph: 2, sway: .3 });
  // her hand holds the patient's hand, which lies on the blanket's edge
  const [hx, hy] = [FX + (sp.hand(0)[0] - sp.fx), FY + (sp.hand(0)[1] - sp.fy)];
  ctx.strokeStyle = '#cfc4b6'; ctx.lineCap = 'round'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(820, 716); ctx.quadraticCurveTo(760, 744, hx + 26, hy + 8); ctx.stroke();
  ctx.strokeStyle = '#d8b090'; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(hx + 26, hy + 8); ctx.lineTo(hx + 12, hy + 6); ctx.stroke();
  ctx.fillStyle = '#d0a482'; ctx.beginPath(); ctx.ellipse(hx + 9, hy + 6, 12, 8, .2, 0, 6.2831); ctx.fill();
  ctx.fillStyle = rgba('#ffd59a', .6); ctx.beginPath(); ctx.ellipse(hx, hy, 6, 4, .3, 0, 6.2831); ctx.fill();
  ctx.restore();
  drawL(ctx, L.glow, cm, 1, { op: 'lighter', a: .85 + .08 * Math.sin(t * 2.3) });
}
function shot18(T, t0, now) {
  const tF = T.S('07b', 'final'), t1 = T.S('07b', 'She listened');
  const cam = (t) => { const u = lin(t0 - .5, t1 + .3, t); return { x: mix(60, 0, sine(u)) + drift(t, 4, 2), y: mix(-20, 10, sine(u)), z: mix(1.0, 1.1, sine(u)) }; };
  return {
    t: t0, tr: 'zoom', d: 1.1, depth: 8,
    draw(ctx, t) { const L = cache('s07-bed', 'w', t, bedroom); drawBedroom(ctx, t, cam(t), L, 0); vig(ctx, .55, '#0a0408'); },
  };
}
function shot18b(T, t0) {
  const tL = T.S('07b', 'listened'), tEnd = T.S('07b', 'I wish');
  const cam = (t) => { const u = lin(t0 - .4, tEnd + .4, t); return { x: mix(-330, -380, u) + drift(t, 3, 4), y: mix(-10, -30, u), z: mix(1.75, 1.95, sine(u)) }; };
  const self = {
    t: t0, tr: 'push', d: .8,
    draw(ctx, t) { const L = cache('s07-bed', 'w', t, bedroom); drawBedroom(ctx, t, cam(t), L, sm(lin(tL - .2, tL + .6, t))); vig(ctx, .6, '#0a0408'); },
  };
  self.lamp = (t) => proj(cam(t), 1, LAMP[0], LAMP[1] - 10);
  return self;
}

// ================================================================== W1 / W2 · the Bronnie Ware quote cards (K8 language)
const CARD = { x: 350, y: 210, w: 1220, h: 620 };
function cardBack() {
  const [c, x] = layer(W, H);
  { const g = x.createRadialGradient(W / 2, H * .55, 100, W / 2, H * .55, 1200); g.addColorStop(0, '#141850'); g.addColorStop(1, '#05061a'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
  // dot field (halftone of week-dots) around the card
  for (let yy = 110; yy < 980; yy += 18) for (let xx = 260; xx < 1670; xx += 18) { const d = Math.hypot((xx - W / 2) / 800, (yy - H / 2) / 500), a = .22 * clamp(1.2 - d) * (xx < 720 ? 1.3 : 1); x.fillStyle = rgba(xx < 700 && yy < 600 ? '#c88a4a' : '#6a6aa8', a); x.beginPath(); x.arc(xx, yy, 1.9, 0, 6.2831); x.fill(); }
  x.fillStyle = '#080a20'; x.fillRect(CARD.x + 10, CARD.y + 10, CARD.w - 20, CARD.h - 20);
  return c;
}
function frameLines(ctx, a) {
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = rgba('#d08a4a', .9); ctx.lineWidth = 1.5; ctx.strokeRect(CARD.x, CARD.y, CARD.w, CARD.h);
  ctx.fillStyle = '#d08a4a'; for (const [cx, cy] of [[CARD.x, CARD.y], [CARD.x + CARD.w, CARD.y], [CARD.x, CARD.y + CARD.h], [CARD.x + CARD.w, CARD.y + CARD.h]]) { ctx.fillRect(cx - 6, cy - .75, 12, 1.5); ctx.fillRect(cx - .75, cy - 6, 1.5, 12); } ctx.restore();
}
// lay out lines of words; ws = word timing objects for the same words in order
function writeLines(ctx, t, lines, ws, x0, y0, { size = 66, lh = 88, hi = -1, exitT = null } = {}) {
  ctx.font = `${size}px "Instrument Serif"`; let k = 0;
  lines.forEach((ln, li) => {
    const words = ln.split(' '); let xx = x0;
    const ex = exitT ? eio(lin(exitT + li * .12, exitT + li * .12 + .45, t)) : 0;
    for (const wd of words) {
      const w = ws[k++], a = w ? sm(lin(w.s - .05, w.s + .25, t)) : 1;
      const al = a * (1 - ex);
      txt(ctx, wd, xx, y0 + li * lh + (1 - a) * 8 - ex * 140, { size, font: 'Instrument Serif', color: li === hi ? '#f6c27a' : CREAM, alpha: al });
      ctx.font = `${size}px "Instrument Serif"`; xx += ctx.measureText(wd + ' ').width;
    }
  });
}
function textDots(lines, x0, y0, size, lh, seed) { // sample points from typeset text (for the dissolve into weeks/stars)
  const [c, x] = layer(W, H); x.fillStyle = '#fff'; x.font = `${size}px "Instrument Serif"`; lines.forEach((ln, i) => x.fillText(ln, x0, y0 + i * lh));
  const d = x.getImageData(0, 0, W, H).data, r = prng(seed), pts = [];
  for (let yy = 0; yy < H; yy += 3) for (let xx = 0; xx < W; xx += 3) if (d[(yy * W + xx) * 4 + 3] > 128 && r() < .5) pts.push([xx, yy, r(), r()]);
  return pts;
}
const CARD2 = ['I wish I hadn’t', 'worked so hard.'];
function card2Dots() { return textDots(CARD2, CARD.x + 200, CARD.y + 260, 66, 88, 7); }
// the dots of card 2 fall back into the weeks wall (shared by W2 and 7.19 so they cross the cut)
function dots2(ctx, t, T, cm) {
  const t0 = T.E('07b', 'hard') + .45, pts = cache('s07-cards', 'dots', t, card2Dots);
  for (const [i, [x, y, r1, r2]] of pts.entries()) {
    const row = 35 + Math.floor(r1 * 44), col = Math.floor(r2 * 52), [gx, gy] = proj(cm, 1, ...sqC(row, col));
    const u = eio(lin(t0 + r1 * .5, t0 + 1.4 + r1 * .5, t)); if (u >= 1) continue;
    const xx = mix(x, gx, u) + Math.sin(u * 3.14) * (r2 - .5) * 120, yy = mix(y, gy, u) - Math.sin(u * 3.14) * 60 * r1;
    ctx.fillStyle = rgba(u < .3 ? CREAM : '#b8b4e8', .9 * sm(lin(t0 - .1, t0 + .2, t)) * (1 - sm(lin(.8, 1, u)))); ctx.fillRect(xx, yy, 2.4, 2.4);
  }
}
function shotCards(T, t0) {
  const w1 = T.W('07b', 'I wish', 'me'), w2s = T.S('07b', 'hadn'), w2 = T.words.filter((w) => w.sec === '07b' && w.s >= T.S('07b', 'hard') - 1.8 && w.s <= T.E('07b', 'hard'));
  const tEx1 = T.E('07b', 'me') + .1, tHard = T.E('07b', 'hard'), tEnd = T.S('07c', 'So what');
  return {
    t: t0, tr: 'zoom', d: 1.0, depth: 6,
    draw(ctx, t) {
      const bg = cache('s07-cards', 'bg', t, cardBack);
      const sc = 1 + .02 * lin(t0, tEnd, t), dx = drift(t, 4, 1), dy = drift(t, 3, 2);
      ctx.save(); ctx.translate(W / 2 + dx, H / 2 + dy); ctx.scale(sc, sc); ctx.translate(-W / 2, -H / 2);
      ctx.drawImage(bg, 0, 0);
      const fade = 1 - sm(lin(tHard + .35, tHard + .75, t));
      frameLines(ctx, sm(lin(t0, t0 + .6, t)) * fade);
      txt(ctx, '“', CARD.x + 110, CARD.y + 150, { size: 120, font: 'Instrument Serif', color: '#d08a4a', alpha: sm(lin(t0, t0 + .6, t)) * fade });
      // card 1 (written at reading pace, highlighted line in amber); its lines exit upward, card 2 writes in
      if (t < tEx1 + .9) writeLines(ctx, t, ['I wish I’d had the courage', 'to live a life true to myself,', 'not the life others expected of me.'], w1, CARD.x + 200, CARD.y + 210, { hi: 1, exitT: tEx1 });
      if (t > tEx1 + .2) { ctx.save(); ctx.globalAlpha = fade; writeLines(ctx, t, CARD2, w2, CARD.x + 200, CARD.y + 260, { hi: 1 }); ctx.restore(); }
      // attribution: what her patients told her (not her own regret)
      const aa = sm(lin(t0 + .8, t0 + 1.4, t)) * fade;
      if (aa > 0) { ctx.fillStyle = rgba(AMBER, aa); ctx.fillRect(CARD.x + 200, CARD.y + 470, 3, 70); }
      txt(ctx, 'Bronnie Ware', CARD.x + 222, CARD.y + 504, { size: 36, font: 'Instrument Serif', color: CREAM, alpha: aa });
      txt(ctx, 'WHAT THE DYING TOLD HER  ·  THE TOP FIVE REGRETS OF THE DYING', CARD.x + 224, CARD.y + 538, { size: 15, weight: 600, color: MUTED, spacing: 4, alpha: aa });
      ctx.restore();
      // card 2 breaks into dots that fall back into the weeks
      if (t > tHard) { const L = cache('s07-wall', 'w', t, wallLayers); dots2(ctx, t, T, wallCam19(T)(t)); }
      vig(ctx, .45);
    },
  };
}

// ================================================================== 7.19 "So what would you do with the weeks you have left?"
const TGT19 = [62, 31];
function wallCam19(T) {
  const t0 = T.S('07c', 'So what') - .35, tLeft = T.S('07c', 'left'), t1 = T.S('07c', 'What would you need');
  const P = sqC(...TGT19);
  return (t) => { const u = quart(lin(tLeft - 1.4, t1 + .2, t)), u0 = lin(t0 - 1, t0 + 3, t); return { x: (P[0] - W / 2) * u + drift(t, 4, 3), y: (P[1] - H / 2) * u + drift(t, 3, 5), z: mix(1.0, 3.2, u) * (1 + .02 * u0) }; };
}
function shot19(T, t0) {
  const tLeft = T.S('07c', 'left'), cam = wallCam19(T), LIVED = NOW[0] * COLS + NOW[1];
  const self = {
    t: t0, tr: 'match', d: .7,
    draw(ctx, t) {
      const L = cache('s07-wall', 'w', t, wallLayers), cm = cam(t);
      drawWall(ctx, t, cm, L, { asm: 1, lived: LIVED, pulse: -1, nowA: .85 + .15 * Math.sin(t * 3) });
      wallTicks(ctx, 1 - lin(t0, t0 + 1.5, t), cm);
      // the weeks still ahead wake up: a soft cream shimmer, one of them lights on "left"
      ctx.save(); camT(ctx, cm, 1); ctx.save(); clipBand(ctx, NOW[0] + 1, 80); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .12 * sm(lin(t0 + .5, tLeft, t)) * (.7 + .3 * Math.sin(t * 2)); ctx.drawImage(L.lived, 0, 0); ctx.restore();
      { const [x, y] = sqC(...TGT19), a = sm(lin(tLeft - .3, tLeft + .5, t)), q = sqQ(...TGT19, -.1); ctx.fillStyle = rgba('#fbf6e8', a); ctx.beginPath(); ctx.moveTo(...q[0]); ctx.lineTo(...q[1]); ctx.lineTo(...q[2]); ctx.lineTo(...q[3]); ctx.fill(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y, 0, x, y, 40); g.addColorStop(0, rgba('#fbf6e8', .6 * a)); g.addColorStop(1, rgba('#fbf6e8', 0)); ctx.fillStyle = g; ctx.fillRect(x - 40, y - 40, 80, 80); }
      ctx.restore();
      dots2(ctx, t, T, cm);
      vig(ctx, .45);
    },
  };
  self.target = (t) => proj(cam(t), 1, ...sqC(...TGT19));
  return self;
}

// ================================================================== 7.20 old and young, hand in hand (close) · 7.21 the line on screen (wide)
function pair(k) {
  const kid0 = figSprite(k * .62, { lean: -.02, head: -.35, sh: [.1, -.75], el: [.2, -.2], hip: [.04, -.04], kn: [0, .04], hair: 'curly' }, {});
  const khy = (kid0.hand(1)[1] - kid0.fy) / k;   // child's hand height above the feet, in old-figure units
  // search the old figure's front arm (rig of art.mjs person) for a hand at that height, ~18 units in front
  let best = [.6, .25], bd = 1e9;
  for (let a = 0; a <= 1.4; a += .02) for (let e = -.2; e <= 1.2; e += .02) { const ex = 3 + Math.sin(a) * 29, ey = -57 + Math.cos(a) * 29, hx = ex + Math.sin(a + e) * 26 + Math.sin(a + e) * 4, hy = ey + Math.cos(a + e) * 26 + Math.cos(a + e) * 4;
    const c = .06, rx = hx * Math.cos(c) - hy * Math.sin(c), ry = hx * Math.sin(c) + hy * Math.cos(c), d = Math.abs((ry - 95) - khy) * 3 + Math.abs(rx - 20) + Math.abs(e - .25) * 4; if (d < bd) { bd = d; best = [a, e]; } }
  const old = figSprite(k, { lean: .06, head: -.25, sh: [best[0], -.1], el: [best[1], .3], hip: [.05, -.06], kn: [.04, .08], hair: 'grey', coat: 1, bulk: 1.05 },
    { dress: { coat: '#6a4a6a', pants: '#2a2236', shoes: '#14101c', skin: '#e0b494', hair: '#d8d2ca', hairBack: '#cfc8c0' }, light: { x: 600, y: -500, col: '#e8e4ff', a: .45 }, rim: '#f3efe2', rimW: 2.2 });
  const kid = (up) => figSprite(k * .62, { lean: -.02, head: up ? -.7 : -.35, sh: [.1, -.75], el: [.2, -.2], hip: [.04, -.04], kn: [0, .04], hair: 'curly' },
    { dress: { coat: '#e59a3a', pants: '#2a2236', shoes: '#14101c', skin: '#c99068', hair: '#2a1a14' }, light: { x: 600, y: -500, col: '#ffe0b0', a: .45 }, rim: '#f3efe2', rimW: 1.8 });
  return { old, kid: kid(false), kidUp: kid(true) };
}
// draws the two (old behind, child in front-right) so the hands meet; returns the clasp point
function drawPair(ctx, t, P, X, Y, { up = 0, grip = 0 } = {}) {
  const oh = [X + (P.old.hand(0)[0] - P.old.fx), Y + (P.old.hand(0)[1] - P.old.fy)];
  const k = P.kid, kh = [k.hand(1)[0] - k.fx, k.hand(1)[1] - k.fy];
  const KX = oh[0] - kh[0] + 2, KY = Y - Math.max(-30, Math.min(30, (oh[1] - Y) - kh[1])) * 0;
  const lift = -grip * 3;
  drawFig(ctx, P.old, X, Y, t, { ph: 1, sway: .5 });
  ctx.save(); ctx.globalAlpha = 1 - up; drawFig(ctx, P.kid, KX, KY + lift, t, { ph: 4, sway: .5 }); ctx.globalAlpha = up; drawFig(ctx, P.kidUp, KX, KY + lift, t, { ph: 4, sway: .5 }); ctx.restore();
  return [oh[0], oh[1] + lift * .5];
}
function clasp(ctx, x, y, s, a, grip) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const R = 60 * s * (1 + grip * .5); const g = ctx.createRadialGradient(x, y, 0, x, y, R); g.addColorStop(0, rgba('#ffe6b8', .5 * a)); g.addColorStop(.3, rgba(AMBER, .2 * a)); g.addColorStop(1, rgba(AMBER, 0)); ctx.fillStyle = g; ctx.fillRect(x - R, y - R, 2 * R, 2 * R); ctx.restore();
}
function shot20(T, t0) {
  const tSay = T.S('07c', 'say'), t1 = T.S('07c', '"I had') ;
  const cam = (t) => { const u = lin(t0 - .5, t1 + .5, t); return { x: mix(-40, 30, sine(u)) + drift(t, 3, 2), y: mix(20, -10, u), z: mix(1.0, 1.06, sine(u)) }; };
  const X = 820, Y = 1150;
  const self = {
    t: t0, tr: 'zoom', d: 1.0, depth: 6,
    draw(ctx, t) {
      const L = cache('s07-meadow', 'world', t, meadowWorld), P = cache('s07-meadow', 'pairBig', t, () => pair(3.3)), cm = cam(t);
      const c2 = { ...cm, y: cm.y + 120 };
      meadowBack(ctx, t, c2, L, t0); drawL(ctx, L.mid, c2, .45); drawL(ctx, L.pool, c2, .45, { op: 'lighter', a: .8 });
      const grip = Math.sin(Math.PI * lin(tSay - .15, tSay + .5, t)), up = sm(lin(tSay - .1, tSay + .5, t));
      ctx.save(); camT(ctx, cm, 1);
      const [cx, cy] = drawPair(ctx, t, P, X, Y, { up, grip });
      clasp(ctx, cx, cy, 3.3, .5 + .5 * grip + .15 * Math.sin(t * 1.4), grip);
      ctx.restore();
      vig(ctx, .55);
    },
  };
  self.pairAt = (t) => proj(cam(t), 1, X + 40, Y - 300);
  return self;
}
const LINE1 = '“I had a wonderful life.', LINE2 = 'And I brought good into this world.”', TX = 960, TY1 = 250, TY2 = 340, TSZ = 76;
function lineDots() {
  const [c, x] = layer(W, H); x.fillStyle = '#fff'; x.font = `${TSZ}px "Instrument Serif"`; x.textAlign = 'center'; x.fillText(LINE1, TX, TY1); x.fillText(LINE2, TX, TY2);
  const d = x.getImageData(0, 0, W, H).data, r = prng(17), pts = [];
  for (let yy = 150; yy < 380; yy += 3) for (let xx = 0; xx < W; xx += 3) if (d[(yy * W + xx) * 4 + 3] > 128 && r() < .45) pts.push([xx, yy, r(), r(), r()]);
  return pts;
}
// the line's letters loosen into points that rise and become stars (shared by 7.21 and 7.22a)
function lineStars(ctx, t, T) {
  const t0 = T.E('07c', 'world') + .5, pts = cache('s07-line', 'dots', t, lineDots);
  if (t < t0) return;
  for (const [x, y, a, b, c] of pts) {
    const u = lin(t0 + a * .8, t0 + 3.2 + a * .8, t), e = eout(u);
    const xx = x + (b - .5) * 700 * e + Math.sin(t * .7 + c * 9) * 6 * e, yy = y - (40 + 260 * c) * e - b * 120 * e;
    const al = (c > .55 ? .35 + .5 * c : .25) * (1 - .3 * e) * (.7 + .3 * Math.sin(t * (1 + c * 2) + a * 7)) * (u >= 1 && c < .55 ? 1 - lin(t0 + 3.2, t0 + 4.4, t) : 1);
    ctx.fillStyle = rgba(c > .8 ? '#ffe2b0' : CREAM, clamp(al)); const s = c > .92 ? 2.4 : 1.6; ctx.fillRect(xx, yy, s, s);
  }
}
function shot21(T, t0) {
  const tw = T.W('07c', '"I had', 'world'), tEnd = T.E('07c', 'world') + .5;
  const cam = (t) => { const u = lin(t0 - .5, tEnd + 1.5, t); return { x: mix(0, 40, u) + drift(t, 4, 6), y: mix(10, -20, sine(u)), z: mix(1.0, 1.05, sine(u)) }; };
  return {
    t: t0, tr: 'out', d: 1.2, depth: 4,
    draw(ctx, t) {
      const L = cache('s07-meadow', 'world', t, meadowWorld), P = cache('s07-meadow', 'pairSmall', t, () => pair(.95)), cm = cam(t);
      meadowBack(ctx, t, cm, L, t0); drawL(ctx, L.mid, cm, .45); drawL(ctx, L.pool, cm, .45, { op: 'lighter', a: .8 });
      ctx.save(); camT(ctx, cm, .45); const X = 1030, Y = ridgeMid(1030) + 30; const [cx, cy] = drawPair(ctx, t, P, X, Y, { up: 1 }); clasp(ctx, cx, cy, 1, .9 + .1 * Math.sin(t * 1.4), 0); ctx.restore();
      drawL(ctx, L.near, cm, 1.15);
      // the line, word by word with the voice; then the letters loosen into points
      const loosen = sm(lin(tEnd - .1, tEnd + .5, t));
      ctx.save(); ctx.globalAlpha = 1 - loosen; ctx.font = `${TSZ}px "Instrument Serif"`;
      const lay = (line, y, ws) => { const words = line.split(' '), tot = ctx.measureText(line).width; let xx = TX - tot / 2;
        words.forEach((wd, i) => { const w = ws[i], a = w ? sm(lin(w.s - .05, w.s + .3, t)) : 0; txt(ctx, wd, xx, y + (1 - a) * 10, { size: TSZ, font: 'Instrument Serif', color: CREAM, alpha: a }); ctx.font = `${TSZ}px "Instrument Serif"`; xx += ctx.measureText(wd + ' ').width; }); };
      lay(LINE1, TY1, tw.slice(0, 5)); lay(LINE2, TY2, tw.slice(5));
      ctx.restore();
      lineStars(ctx, t, T);
      vig(ctx, .5);
    },
  };
}

// ================================================================== 7.22a "And maybe, underneath that, there's an even older question." (a shepherd by a fire)
function shot22a(T, t0) {
  const t1 = T.S('07d', 'The one people');
  const cam = (t) => { const u = lin(t0 - .5, t1 + .5, t); return { x: mix(0, 60, u) + drift(t, 4, 7), y: mix(-60, 20, sine(u)), z: 1.03 }; };
  const FIRE = [820, 860];
  return {
    t: t0, tr: 'match', d: 1.2,
    draw(ctx, t) {
      const L = cache('s07-old', 'w', t, () => {
        const sky = skyLayer({ stops: [[0, '#020314'], [.5, '#0a0e3a'], [.75, '#1e2262'], [1, '#2a2050']], stars: 1.6, seed: 61, band: { x0: 200, y0: -200, k: .5, w: 320, a: .35 } });
        const far = ridgeLayer((x) => 720 + (fbm(vnoise(61), x * .003, 1, 3) - .5) * 80, { col: '#141640', hc: '#6a68b0', ha: .25, seed: 61, hatchN: 12, rim: '#8a88d0', rimA: .4 });
        const hill = ridgeLayer((x) => 880 - 60 * Math.exp(-Math.pow((x - 820) / 500, 2)) + (fbm(vnoise(62), x * .004, 1, 3) - .5) * 30, { col: '#0a0b22', hc: '#5a5a9a', ha: .3, seed: 62, hatchN: 20, grassCol: '#4a4a8a', grassN: 4000, light: { x: FIRE[0], y: FIRE[1], col: AMBER, a: .45, r: 500 } });
        const shep = figSprite(1.5, { lean: .1, head: -.6, hip: [1.5, 1.2], kn: [1.4, 1.0], sh: [.9, .5], el: [.6, .9], hood: true, coat: 1, bulk: 1.1 },
          { dress: { coat: '#6a4a30', pants: '#3a2a1c', skin: '#b88a62', hair: '#2a1a10' }, light: { x: -120, y: 60, col: '#ffb35c', a: .6 }, rim: '#ffcf8a', rimSide: -1, rimW: 2.2,
            prop: (g, a0) => { g.strokeStyle = '#3a2418'; g.lineWidth = 4; g.beginPath(); g.moveTo(a0.hx - 20, a0.hy + 60); g.lineTo(a0.hx + 10, a0.hy - 90); g.quadraticCurveTo(a0.hx + 16, a0.hy - 112, a0.hx + 30, a0.hy - 100); g.stroke(); } });
        const sheep = (() => { const [c, x] = wl(); const r = prng(63); for (let i = 0; i < 9; i++) { const sx = 1000 + i * 92 + r() * 60, sy = 878 + r() * 36 - (i % 3) * 12, s = .62 + r() * .3, warm = clamp(1 - (sx - 700) / 900);
            x.fillStyle = '#1a1420'; x.fillRect(sx - 16 * s, sy + 6 * s, 3, 16 * s); x.fillRect(sx + 14 * s, sy + 6 * s, 3, 16 * s);
            const blob = (dx, dy, rr, col) => { x.fillStyle = col; for (let q = 0; q < 7; q++) { const a = q / 7 * 6.2831; x.beginPath(); x.arc(sx + dx + Math.cos(a) * 20 * s, sy + dy + Math.sin(a) * 9 * s, rr * s, 0, 6.2831); x.fill(); } x.beginPath(); x.ellipse(sx + dx, sy + dy, 24 * s, 12 * s, 0, 0, 6.2831); x.fill(); };
            blob(0, 0, 11, '#4a4258'); blob(-3 * s, -3 * s, 8, mixHex('#6a6478', '#e8b878', warm * .8));
            x.fillStyle = '#1a1420'; x.beginPath(); x.ellipse(sx - 32 * s, sy - 4 * s, 9 * s, 6 * s, -.5, 0, 6.2831); x.fill(); } return c; })();
        return { sky, far, hill, shep, sheep, glow: lightLayer(FIRE[0], FIRE[1] - 20, 520, { col: AMBER, core: '#fff1cf', a: .45, seed: 64 }) };
      });
      const cm = cam(t);
      drawL(ctx, L.sky, cm, .08); twinkle(ctx, t, cm, { seed: 31, n: 110, p: .08, y1: 640 });
      lineStars(ctx, t, T);
      drawL(ctx, L.far, cm, .4); drawL(ctx, L.hill, cm, 1); drawL(ctx, L.sheep, cm, 1);
      ctx.save(); camT(ctx, cm, 1);
      drawFig(ctx, L.shep, 680, 892, t, { ph: 3, sway: .3 });
      // the fire: a few flame tongues, sparks rising
      const fl = (k) => 1 + .15 * Math.sin(t * (9 + k) + k * 2);
      ctx.fillStyle = '#2a1a10'; ctx.save(); ctx.translate(FIRE[0], FIRE[1]); for (const r of [-.3, .25, 0]) { ctx.save(); ctx.rotate(r); ctx.fillRect(-36, -5, 72, 10); ctx.restore(); } ctx.restore();
      for (let k = 0; k < 4; k++) { const h = (58 - k * 11) * fl(k), w = 24 - k * 5, x0 = FIRE[0] + Math.sin(t * 5 + k) * 3, y0 = FIRE[1] - 4, sw = Math.sin(t * 4 + k * 1.7) * 8; ctx.fillStyle = ['#c84a1a', '#ff9a40', '#ffd59a', '#fff1cf'][k];
        ctx.beginPath(); ctx.moveTo(x0 - w, y0); ctx.quadraticCurveTo(x0 - w, y0 - h * .5, x0 + sw, y0 - h); ctx.quadraticCurveTo(x0 + w, y0 - h * .5, x0 + w, y0); ctx.closePath(); ctx.fill(); }
      { const r = prng(8); for (let i = 0; i < 16; i++) { const f = ((t * .6) + r()) % 1; ctx.fillStyle = rgba('#ffcf8a', .8 * (1 - f)); ctx.fillRect(FIRE[0] + (r() - .5) * 40 + Math.sin(f * 6 + i) * 20 * f, FIRE[1] - 40 - f * 260, 2, 2); } }
      ctx.restore();
      drawL(ctx, L.glow, cm, 1, { op: 'lighter', a: .8 + .15 * Math.sin(t * 7) });
      vig(ctx, .55);
    },
  };
}

// ================================================================== 7.22b procession through time on the horizon; tilt up on "night sky"
const PW = 4200;
const SEA = 905;
const pRidge0 = (x) => 820 - 50 * Math.sin(x * .0011) + (fbm(vnoise(71), x * .003, 1, 3) - .5) * 50;
const pRidge = (x) => mix(pRidge0(x), SEA + 4, sm(lin(2280, 2560, x)) * (1 - sm(lin(3060, 3240, x))));
function shot22b(T, t0, tEndW) {
  const tSil = T.S('07d', 'silence'), tPr = T.S('07d', 'prayer'), tNS = T.S('07d', 'night sky');
  const camX = (t) => mix(0, 1900, eio(lin(t0 - .3, tNS + .9, t))) + (t - t0) * 12;
  const camY = (t) => -1150 * quart(lin(tNS - .2, tNS + 2.6, t));
  // the figures along the ridge (world x), each a different age of people, all looking up
  const FIG = [
    { x: 1050, k: 1.6, pose: { lean: .02, head: -.65, hood: true, coat: 1, sh: [.12, .06], el: [.5, .6] }, dress: { coat: '#4a3a4a', pants: '#2a2030', skin: '#c89a78', hair: '#1a1210' }, at: tSil },     // a monk in silence
    { x: 1500, k: 1.6, pose: { lean: -.1, head: -.6, hip: [0, .05], kn: [1.57, 1.5], sh: [2.6, 2.5], el: [.2, .3], skirt: true, hair: 'long' }, dress: { coat: '#6a2a3a', pants: '#2a1420', skin: '#a8754e', hair: '#1a0e0a', skirt: '#4a1a2a' }, at: tPr },  // kneeling in prayer, hands raised
    { x: 2150, k: 1.0, pose: { lean: -.05, head: -.7, hip: [1.5, 1.4], kn: [1.5, 1.4], sh: [.4, .9], el: [.8, .6], hair: 'curly' }, dress: { coat: '#e59a3a', pants: '#2a2236', skin: '#c99068', hair: '#2a1a14' }, roof: true },     // a child on a roof
    { x: 2750, k: 1.5, pose: { lean: -.05, head: -.6, sh: [-.2, .4], el: [.2, .3], hair: 'cap' }, dress: { coat: '#2a4a6a', pants: '#1a2030', skin: '#c08a60', hair: '#1a1210', hairBack: '#1a1210' }, boat: true },               // a sailor at the mast
    { x: 3300, k: 1.6, pose: { lean: -.04, head: -.5, sh: [.2, -.15], el: [.45, .5], hood: true, coat: 1 }, dress: { coat: '#e59a3a', pants: '#14141e', skin: '#e9c3a0', hair: '#2a1a14' } },                          // and someone today
  ];
  return {
    t: t0, tr: 'right', d: .7,
    draw(ctx, t) {
      const L = cache('s07-proc', 'w', t, () => {
        // tall sky (for the tilt) and a wide ridge (for the truck)
        const SW = W + 1400, SH = H + 1500, [sky, sx] = layer(SW, SH);
        { const g = sx.createLinearGradient(0, 0, 0, SH); g.addColorStop(0, '#01020c'); g.addColorStop(.5, '#060930'); g.addColorStop(.8, '#141a52'); g.addColorStop(1, '#2a2a66'); sx.fillStyle = g; sx.fillRect(0, 0, SW, SH);
          const r = prng(73); for (let i = 0; i < 5200; i++) { const m = r(), x = r() * SW, y = r() * SH * .95; sx.fillStyle = rgba(r() < .15 ? '#ffd9a0' : CREAM, (.1 + .6 * m * m) * (.5 + .5 * (1 - y / SH))); const s = m > .985 ? 2.6 : m > .9 ? 1.8 : 1.1; sx.fillRect(x, y, s, s); }
          const n = vnoise(74); const [bc, bx] = layer(SW, SH); const d = bx.createImageData(SW, SH), p = d.data;
          for (let j = 0; j < SH; j += 2) for (let i = 0; i < SW; i += 2) { const dist = Math.abs((j - SH * .55) + (i - SW * .2) * .45) / 300, v = Math.exp(-dist * dist * 2) * (.4 + .9 * (fbm(n, i * .004, j * .005, 4) - .3)); if (v <= 0) continue; for (const [a, b] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const o = ((j + b) * SW + i + a) * 4; p[o] = 214; p[o + 1] = 208; p[o + 2] = 240; p[o + 3] = 255 * clamp(v) * .3; } }
          bx.putImageData(d, 0, 0); stip(bc, { k: .85, g: 1.2, seed: 75, mid: false, boost: 1.5 }); sx.globalCompositeOperation = 'screen'; sx.drawImage(bc, 0, 0); }
        const [rid, rx] = layer(PW, H + 200);
        { const pts = [[-10, H + 210]]; for (let x = -10; x <= PW + 10; x += 8) pts.push([x, pRidge(x)]); pts.push([PW + 10, H + 210]); roughPoly(rx, pts, '#07081c', { amp: 1.2, seed: 76 });
          rx.save(); rx.beginPath(); roughPath(rx, pts, { amp: 1.2, seed: 76 }); rx.clip(); const r = prng(77); for (let k = 1; k < 18; k++) { let x = r() * 60; while (x < PW) { const len = 40 + r() * 180; rx.strokeStyle = '#3a3a7a'; rx.globalAlpha = .3 * r(); rx.lineWidth = 1; rx.beginPath(); for (let q = x; q < Math.min(PW, x + len); q += 8) rx.lineTo(q, pRidge(q) + k * 7 * (1 + k * .05)); rx.stroke(); x += len + 20 + r() * 80; } } rx.globalAlpha = 1; rx.restore();
          rx.strokeStyle = rgba('#a8a4f0', .55); rx.lineWidth = 1.6; rx.beginPath(); for (let x = 0; x <= PW; x += 6) rx.lineTo(x, pRidge(x)); rx.stroke();
          // the sea at the far right, a small boat, a house with a roof
          rx.fillStyle = '#07081c'; rx.fillRect(2556, SEA + 4, 3070 - 2556, H + 200 - SEA);
          { const r = prng(79); for (let k = 0; k < 70; k++) { const yy = SEA + 4 + Math.pow(r(), 1.6) * 260, x0 = 2570 + r() * 470; rx.fillStyle = rgba('#b8b4f0', .12 + .25 * (1 - (yy - SEA) / 260)); rx.fillRect(x0, yy, 20 + r() * 70 * (1 + (yy - SEA) / 120), 1.4); } }
          const hx = 2150, hy = pRidge(2150); roughPoly(rx, [[hx - 110, hy + 4], [hx - 110, hy - 90], [hx, hy - 160], [hx + 110, hy - 90], [hx + 110, hy + 4]], '#05061a', { amp: 1.5, seed: 80 });
          roughRect(rx, hx - 30, hy - 70, 34, 30, '#ffb35c', { amp: .5, seed: 81 });
          const bx = 2750, by = SEA + 30; roughPoly(rx, [[bx - 170, by - 26], [bx + 180, by - 30], [bx + 130, by + 18], [bx - 130, by + 18]], '#04051a', { amp: 1, seed: 82 }); roughRect(rx, bx + 40, by - 360, 7, 340, '#04051a', { amp: .4, seed: 83 }); roughPoly(rx, [[bx + 50, by - 350], [bx + 50, by - 60], [bx + 200, by - 70]], '#0e1036', { amp: 1, seed: 84 }); }
        const figs = FIG.map((f) => tintSprite(figSprite(f.k * 1.05, { hip: [.03, -.04], kn: [0, .04], ...f.pose }, { dress: f.dress, light: { x: 300, y: -500, col: '#d8d2ff', a: .5 }, rim: '#e8e4ff', rimW: 2 }), '#06071c', 1));
        const rims = FIG.map((f) => figSprite(f.k * 1.05, { hip: [.03, -.04], kn: [0, .04], ...f.pose }, { dress: f.dress, light: { x: 300, y: -500, col: '#d8d2ff', a: .5 }, rim: '#e8e4ff', rimW: 2.4, shadeA: .75 }));
        const shep = figSprite(1.6, { lean: .05, head: -.6, coat: 1, hood: true, sh: [.5, .2], el: [.6, .6] }, { dress: { coat: '#4a3a2a', pants: '#2a2018', skin: '#b88a62' }, rim: '#e8e4ff', shadeA: .75, prop: (g, a0) => { g.strokeStyle = '#1a1210'; g.lineWidth = 4; g.beginPath(); g.moveTo(a0.hx, a0.hy + 110); g.lineTo(a0.hx + 8, a0.hy - 120); g.quadraticCurveTo(a0.hx + 14, a0.hy - 148, a0.hx + 36, a0.hy - 132); g.stroke(); } });
        return { sky, rid, figs, rims, shep };
      });
      const cx = camX(t), cy = camY(t);
      // sky: parallax .25 sideways, .55 on the tilt
      ctx.drawImage(L.sky, -200 - cx * .25, -(L.sky.height - H) - 150 - cy * .55 + 1300 * 0);
      { const r = prng(41), ox = -200 - cx * .25, oy = -(L.sky.height - H) - 150 - cy * .55; for (let i = 0; i < 140; i++) { const x = ox + r() * L.sky.width, y = oy + r() * L.sky.height * .9, ph = r() * 7, m = r(); if (x < -4 || x > W + 4 || y < -4 || y > H + 4) continue; ctx.fillStyle = rgba(CREAM, (.3 + .6 * m) * (.55 + .45 * Math.sin(t * (.6 + m * 1.5) + ph))); const sz = m > .8 ? 2.2 : 1.5; ctx.fillRect(x, y, sz, sz); } }
      // a low glow along the horizon so the silhouettes read
      { const hy = 800 - cy, g = ctx.createLinearGradient(0, hy - 360, 0, hy + 60); g.addColorStop(0, rgba('#3a3a8a', 0)); g.addColorStop(.6, rgba('#5a52a8', .32)); g.addColorStop(.88, rgba('#b88aa8', .3)); g.addColorStop(1, rgba('#d8a8a0', .22)); ctx.fillStyle = g; ctx.fillRect(0, hy - 360, W, 420); }
      // ridge + figures (move fully with the camera)
      ctx.save(); ctx.translate(-cx, -cy);
      ctx.drawImage(L.rid, 0, 0);
      // the shepherd from 7.22a stands at the start of the line
      drawFig(ctx, L.shep, 420, pRidge(420) + 2, t, { ph: 1 });
      FIG.forEach((f, i) => {
        let y = pRidge(f.x) + 2, x = f.x;
        if (f.roof) { x = 2190; y = pRidge(2150) - 100; }
        if (f.boat) y = SEA + 6;
        const tilt = f.at ? sm(lin(f.at - .3, f.at + .5, t)) : 1;
        drawFig(ctx, L.rims[i], x, y, t, { ph: i * 1.7, alpha: 1 });
      });
      ctx.restore();
      vig(ctx, .5);
    },
  };
}

// ================================================================== 7.25–7.26 the night sky as the noise stops; rose light creeps in (→ ch 08 dawn)
function shot25(T, t0, tEnd) {
  const tSoon = T.S('07d', 'Soon'), tStop = T.E('07d', 'might stop');
  return {
    t: t0, tr: 'up', d: 1.6,
    draw(ctx, t) {
      const L = cache('s07-night', 'w', t, () => ({
        sky: skyLayer({ stops: [[0, '#01020c'], [.5, '#060930'], [.85, '#121850'], [1, '#1a1c4a']], stars: 1.8, seed: 91, band: { x0: 300, y0: -200, k: .55, w: 340, a: .35 } }),
        rose: (() => { const [c, x] = layer(W, H); const g = x.createLinearGradient(0, H, 0, H * .45); g.addColorStop(0, rgba('#ffb38a', .85)); g.addColorStop(.25, rgba('#e8a3a0', .45)); g.addColorStop(.6, rgba('#a86a9a', .12)); g.addColorStop(1, rgba('#a86a9a', 0)); x.fillStyle = g; x.fillRect(0, 0, W, H); return stip(c, { k: .6, g: 1.1, seed: 92 }); })(),
      }));
      // only the stars drift: a very slow glide upward (the camera keeps tilting, slower and slower)
      const u = lin(t0 - .8, tEnd + .6, t), cm = { x: drift(t, 3, 1) + (t - t0) * 3, y: -60 * eout(u) - (t - t0) * 2, z: 1.0 + .015 * u };
      drawL(ctx, L.sky, cm, 1);
      twinkle(ctx, t, cm, { seed: 51, n: 160, p: 1, y1: H + 100, a: .9 });
      // rose light creeps in at the bottom edge after the last word
      const r = sm(lin(tStop + .8, tEnd + .6, t));
      if (r > 0) { ctx.save(); ctx.globalAlpha = r; ctx.translate(0, (1 - r) * 260); ctx.drawImage(L.rose, 0, 0); ctx.restore(); }
      vig(ctx, .45);
    },
  };
}

// ================================================================== assemble
export function shots(T, { s13 }) {
  const S = (seg, p) => T.S(seg, p);
  const s14 = shot14(T, S('07b', 'So let time') - .25); s14.x = s13.seed(s14.t)[0]; s14.y = s13.seed(s14.t)[1];
  const g8 = shotG8(T, S('07b', 'A human life') - .35);
  const s18 = shot18(T, S('07b', 'Bronnie') - .2); s18.x = g8.now(s18.t)[0]; s18.y = g8.now(s18.t)[1];
  const s18b = shot18b(T, S('07b', 'She listened') - .15);
  const cards = shotCards(T, S('07b', 'I wish') - .3); cards.x = s18b.lamp(cards.t)[0]; cards.y = s18b.lamp(cards.t)[1];
  const s19 = shot19(T, S('07c', 'So what') - .35);
  const s20 = shot20(T, S('07c', 'What would you need') - .15); s20.x = s19.target(s20.t)[0]; s20.y = s19.target(s20.t)[1];
  const s21 = shot21(T, S('07c', '"I had') - .3); s21.x = s20.pairAt(s21.t)[0]; s21.y = s20.pairAt(s21.t)[1];
  const s22a = shot22a(T, S('07d', 'And maybe') - .25);
  const s22b = shot22b(T, S('07d', 'The one people') - .15, S('07d', 'What is this life') - .6);
  const s25 = shot25(T, S('07d', 'It\'s a question') - .5, T.seg('08a').start - 1.2);
  // when chapter 07 is rendered alone, keep the hill window visibly empty-free: 7.22b ends where hill.mjs starts
  return [s14, g8, s18, s18b, cards, s19, s20, s21, s22a, s22b, s25];
}
