// s03_harbour · the harbour front at night (3.08 fog swallows the windows; 3.18 the window from 0.15 flickers again).
// Own consistent harbour row (chapter 00's lib/s00_world.mjs did not exist when this was built): a low row of
// houses along a quay, a dark headland behind (no pyramid), lamps, water with window reflections.
import { W, H, P, rgba, clamp, mix, prng, shade, mixHex, layer, plate, put, stipple, maskLinear, roughPoly, roughRect, roughLine, roughPath, hatch, fog, once, L, Lp, glowA, bloomSprite, stamp, vg, vnoise, fbm } from './s03_kit.mjs';
import { house } from './art.mjs';

export const HB = { quay: 700, water: 728, flick: null };
const WALLS = ['#22264f', '#2a2a55', '#1f2448', '#2d2650', '#252b58', '#1c2246', '#2a2f5c'];

function build() {
  const r = prng(303), wins = []; HB.lamps = [];
  const sky = plate(W, H, (g, c) => {
    vg(g, [[0, '#05071a'], [.45, '#0e1238'], [.62, '#232a5c'], [.66, '#2b3466']], 0, 0, 0, HB.quay, [0, 0, W, HB.quay + 4]);
    const rr = prng(5); for (let i = 0; i < 260; i++) { const x = rr() * W, y = Math.pow(rr(), 1.6) * 420, m = rr(); g.fillStyle = rgba('#dfe6ff', .1 + .5 * m * m); g.fillRect(x, y, m > .96 ? 2 : 1, m > .96 ? 2 : 1); }
    // the headland behind the town (a long low ridge, NOT a pyramid)
    const n = vnoise(8), ridge = (x) => 470 - 120 * Math.exp(-Math.pow((x - 1500) / 600, 2)) - 40 * fbm(n, x * .004, 1, 4);
    const pts = [[-20, HB.quay]]; for (let x = -20; x <= W + 20; x += 10) pts.push([x, ridge(x)]); pts.push([W + 20, HB.quay]);
    roughPoly(g, pts, '#141a40', { amp: 1.5, seed: 9 });
    g.save(); g.beginPath(); roughPath(g, pts, { amp: 1.5, seed: 9 }); g.clip(); hatch(g, [0, 300, W, 400], { angle: -.35, gap: 6, col: '#05071a', a: .35, seed: 10 }); g.restore();
    fog(g, { y0: 420, y1: 640, col: '#5a6aa8', a: .35, seed: 11, cover: .6, soft: .5, k: .3, sx: .003, sy: .02 });
  });
  // the row of houses along the quay: two depths, the far row smaller and fogged
  const town = plate(W, H, (g) => {
    let x = -30; const rr = prng(41);
    while (x < W + 40) { const w = 60 + rr() * 70, h = 110 + rr() * 90; house(g, rr, x + w / 2, HB.quay - 52, w, h, { wall: shade(WALLS[Math.floor(rr() * 7)], -.04), lit: () => 0, side: 0, amp: .7, floorH: 30, colW: 26, trim: false, door: false, chimney: .4, roofs: ['gable', 'steep', 'flat', 'hip', 'gable', 'parapet'] }); x += w - 4; }
    g.fillStyle = rgba('#2b3466', .45); g.fillRect(0, 380, W, HB.quay - 380);
    x = -50;
    while (x < W + 40) {
      const w = 80 + rr() * 90, h = 150 + rr() * 130, wall = WALLS[Math.floor(rr() * 7)];
      const res = house(g, rr, x + w / 2, HB.quay, w, h, { wall, lit: () => 0, side: 0, amp: .8, floorH: 44, colW: 34, trim: true, door: true, chimney: .5, wscale: 1.2 });
      for (const wn of res.win) if (!wn.door) wins.push({ x: wn.x, y: wn.y, w: wn.w, h: wn.h, arch: wn.arch, on: rr() < .62, ph: rr() * 6.28, hue: rr() });
      x += w + (rr() < .3 ? 6 : -2);
    }
    // quay wall + edge
    roughPoly(g, [[-10, HB.quay], [W + 10, HB.quay], [W + 10, HB.water], [-10, HB.water]], '#0d1130', { amp: 1, seed: 12 });
    roughLine(g, [[-10, HB.quay + 1], [W + 10, HB.quay + 1]], { w: 2.4, col: rgba('#ffb35c', .35), seed: 13 });
    for (let i = 0; i < 40; i++) { const xx = i * 50 + rr() * 20; g.fillStyle = rgba('#000', .25); g.fillRect(xx, HB.quay + 6, 2, HB.water - HB.quay - 8); }
    // lamp posts
    for (let i = 0; i < 9; i++) { const lx = 80 + i * 225 + rr() * 30; roughLine(g, [[lx, HB.quay], [lx, HB.quay - 92]], { w: 3, col: '#06081a', seed: i }); g.fillStyle = '#ffd59a'; g.beginPath(); g.ellipse(lx, HB.quay - 94, 4, 5, 0, 0, 7); g.fill(); HB.lamps.push([lx, HB.quay - 94]); }
  });
  const water = plate(W, H, (g) => {
    vg(g, [[0, '#121845'], [1, '#05071a']], 0, HB.water, 0, H, [0, HB.water, W, H - HB.water]);
    const rr = prng(77); for (let i = 0; i < 420; i++) { const y = HB.water + Math.pow(rr(), 1.4) * (H - HB.water), x = rr() * W, l = 20 + rr() * 90 * (1 + (y - HB.water) / 200); g.fillStyle = rgba('#8a9ad8', .05 + .08 * rr()); g.fillRect(x, y, l, 1.3); }
  });
  // the window that flickers in 0.15 and again in 3.18: the lit-able window nearest to (1010, 545)
  let best = null, bd = 1e9; for (const w of wins) { const d = Math.hypot(w.x - 1010, w.y - 545); if (d < bd) { bd = d; best = w; } }
  best.on = false; best.flick = true; HB.flick = best;
  return { sky, town, water, wins };
}
export const harbour = (until) => once('harbour', until, build);

// per-frame: lit windows (alpha per window via fn), lamp blooms, reflections
export function drawHarbour(ctx, t, C, until, { winA = () => 1, flick = 0, fogFront = null, lampA = 1 } = {}) {
  const hb = harbour(until), spr = bloomSprite('hb', P.amb, P.hot, .5);
  L(ctx, C, .3, (g) => g.drawImage(hb.sky, 0, 0));
  L(ctx, C, .6, (g) => {
    g.drawImage(hb.town, 0, 0);
    for (const w of hb.wins) {
      let a = (w.on ? 1 : 0) * winA(w.x, w.y);
      if (w.flick) a = flick;
      if (a <= .01) continue;
      const breathe = .85 + .15 * Math.sin(t * 1.3 + w.ph);
      g.fillStyle = rgba(mixHex('#ffb35c', '#ffe2b0', w.hue), a * breathe);
      if (w.arch) { g.beginPath(); g.moveTo(w.x - w.w / 2, w.y + w.h); g.lineTo(w.x - w.w / 2, w.y + w.w / 2); g.arc(w.x, w.y + w.w / 2, w.w / 2, Math.PI, 0); g.lineTo(w.x + w.w / 2, w.y + w.h); g.closePath(); g.fill(); }
      else g.fillRect(w.x - w.w / 2, w.y, w.w, w.h);
      g.fillStyle = rgba('#1a1d40', .6 * a); g.fillRect(w.x - .7, w.y, 1.4, w.h); g.fillRect(w.x - w.w / 2, w.y + w.h * .45, w.w, 1.4);
      if (w.flick) stamp(g, spr, w.x, w.y + w.h / 2, 70, .55 * a);
    }
    for (const [lx, ly] of HB.lamps || []) stamp(g, spr, lx, ly, 46, .5 * lampA);
  });
  L(ctx, C, .8, (g) => {
    g.drawImage(hb.water, 0, 0);
    g.save(); g.globalCompositeOperation = 'lighter';
    for (const w of hb.wins) {
      let a = (w.on ? 1 : 0) * winA(w.x, w.y); if (w.flick) a = flick; if (a <= .02) continue;
      const ry = HB.water + (HB.quay - w.y - w.h) * .55 + 6, len = 26 + w.h * 1.4;
      for (let k = 0; k < 4; k++) { const yy = ry + k * len / 4, wob = Math.sin(t * 2.1 + yy * .09 + w.ph) * 3; g.fillStyle = rgba('#ffb35c', a * .22 * (1 - k / 4)); g.fillRect(w.x - w.w / 2 + wob, yy, w.w * (1 - k * .12), len / 5); }
    }
    for (const [lx] of HB.lamps || []) { for (let k = 0; k < 7; k++) { const yy = HB.water + 8 + k * 22, wob = Math.sin(t * 1.7 + k + lx) * 5; g.fillStyle = rgba('#ffd59a', .14 * lampA * (1 - k / 7)); g.fillRect(lx - 9 + wob, yy, 18 - k, 6); } }
    g.restore();
  });
}
