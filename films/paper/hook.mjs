// hook.mjs · 10-second style example: a cut-paper dawn landscape, one slow camera move through the lit window
// of a small house into a bedroom, where the morning (and a letter) arrive.
// VO: "One day soon, you might never have to work again." (1.5–4.5) "Your income, taken care of." (6.4–8.2)
//     "For the rest of your life." (8.7–10.3)
import { W, H, F, canvas, sheet, shadowOf, stipple, renderWorld, camPath, screenGlow, finish, proj,
  clamp, mix, lin, sm, smoo, prng, rgba, mixHex, vnoise, fbm } from './paper.mjs';

export const DUR = 11.2;
const P = {
  skyTop: '#1d1b49', skyMid: '#4f3b78', skyLow: '#b8728a', skyHz: '#f3b48c', sun: '#fff1cf', sunGlow: '#ffc98a',
  m1: '#b58aa9', m2: '#8b6396', bay: '#cf9098', town: '#5d4679', near: '#34284f', fg: '#1a132b', amber: '#ffb35c', amberHot: '#ffd59a',
};

// ---------------------------------------------------------------- helpers
const ridge = (seed, amp, freq, oct = 4) => { const n = vnoise(seed); return (x) => fbm(n, x * freq, seed * .37, oct) * amp; };
function grad(g, x0, y0, x1, y1, stops) { const gr = g.createLinearGradient(x0, y0, x1, y1); for (const [o, c] of stops) gr.addColorStop(o, c); return gr; }
// a ridge sheet: profile y(x) (sheet units, from top), filled down to the bottom with a lit top fading to shade
function ridgeSheet(w, h, res, prof, col, { lit = '#f6c6a0', litA = .35, dark = .25, seed = 1, edge = '#ffe2c2', edgeA = .5, extra } = {}) {
  return sheet(w, h, res, (g) => {
    g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w; x += 6) g.lineTo(x, prof(x)); g.lineTo(w, h); g.closePath();
    g.fillStyle = grad(g, 0, 0, 0, h, [[0, col], [1, mixHex(col, '#0b0718', dark)]]); g.fill();
    if (litA) {   // light falls on the slopes that face the sun (left), dissolving into grain
      const [l, lg] = canvas(w * res, h * res); lg.scale(res, res);
      lg.beginPath(); lg.moveTo(0, h); for (let x = 0; x <= w; x += 6) lg.lineTo(x, prof(x)); lg.lineTo(w, h); lg.closePath(); lg.clip();
      for (let x = 0; x <= w; x += 4) { const d = prof(x + 8) - prof(x - 8); if (d > 0) { lg.fillStyle = rgba(lit, clamp(d / 14) * litA); lg.fillRect(x, prof(x), 4.5, 18 + d * 3); } }
      const [l2, lg2] = canvas(l.width, l.height); lg2.filter = 'blur(3px)'; lg2.drawImage(l, 0, 0); stipple(l2, { k: .6, seed });
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(l2, 0, 0); g.restore();
    }
    if (extra) extra(g);
  }, { edge, edgeA });
}
// haze band: a soft sheet of mist in front of a layer (depth through air)
function hazeSheet(w, h, res, col, a, top = .0) {
  const [c, g] = canvas(w * res, h * res);
  g.fillStyle = grad(g, 0, 0, 0, c.height, [[top, rgba(col, 0)], [.55, rgba(col, a * .7)], [1, rgba(col, a)]]); g.fillRect(0, 0, c.width, c.height);
  const n = vnoise(5); const d = g.getImageData(0, 0, c.width, c.height), p = d.data;
  for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) { const i = (y * c.width + x) * 4 + 3; p[i] *= .55 + .9 * fbm(n, x / res * .004, y / res * .03, 3); }
  g.putImageData(d, 0, 0); stipple(c, { k: .5, seed: 9 });
  return { img: c, w, h, res };
}
// place a sheet so that, seen from cam0 = (0,0,0), its top-left lands on screen (sx, sy)
const atScreen = (z, sx, sy) => ({ x: (sx - W / 2) * z / F, y: (sy - H / 2) * z / F });

// ---------------------------------------------------------------- the house (the carrier: its lit window)
const HZ = 1500;                                   // house sheet depth
const HW = 230, HH = 250;                          // house sheet size (world units)
const WIN = [118, 92, 42, 52];                     // window hole in sheet units [x, y, w, h]
const HSX = 1012, HSY = 470;                       // house sheet top-left on screen at the start
const HPOS = (() => { const a = atScreen(HZ, HSX, HSY); return { x: a.x + HW / 2 * HZ / F * 0 + HW / 2, y: a.y + HH / 2 }; })();
// world centre of the window (where the camera passes through)
const WINC = { x: HPOS.x - HW / 2 + WIN[0] + WIN[2] / 2, y: HPOS.y - HH / 2 + WIN[1] + WIN[3] / 2 };

function houseSheet(res) {
  return sheet(HW, HH, res, (g) => {
    const wall = '#4a3963', wallLit = '#8a6476', roof = '#271d3d';
    // chimney
    g.fillStyle = '#2f2448'; g.fillRect(150, 22, 20, 46);
    // roof: gable, slightly hand-cut
    g.fillStyle = roof; g.beginPath(); g.moveTo(14, 84); g.lineTo(108, 18); g.lineTo(122, 16); g.lineTo(218, 82); g.lineTo(214, 90); g.lineTo(18, 92); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,214,170,.18)'; g.beginPath(); g.moveTo(14, 84); g.lineTo(108, 18); g.lineTo(112, 22); g.lineTo(22, 86); g.closePath(); g.fill();   // sunlit roof edge
    // walls with warm light from the left (sun) and shade to the right
    g.fillStyle = grad(g, 30, 0, 200, 0, [[0, wallLit], [.45, wall], [1, mixHex(wall, '#0b0718', .35)]]); g.fillRect(30, 88, 172, 140);
    // door + small dark window + window boxes
    g.fillStyle = '#2a2040'; g.beginPath(); g.moveTo(52, 228); g.lineTo(52, 156); g.quadraticCurveTo(66, 142, 80, 156); g.lineTo(80, 228); g.fill();
    g.fillStyle = '#ffcf8a'; g.fillRect(64, 186, 3, 3);
    g.fillStyle = '#2b2142'; g.fillRect(170, 112, 18, 24);
    // the big window: frame (the hole itself is cut below)
    const [x, y, w, h] = WIN; g.fillStyle = '#e8c79c'; g.fillRect(x - 5, y - 5, w + 10, h + 10);
    g.fillStyle = '#9a6f62'; g.fillRect(x - 8, y + h + 3, w + 16, 6);   // sill
    // flowers on the sill
    const r = prng(4); for (let i = 0; i < 9; i++) { g.fillStyle = ['#e7745c', '#f2b35b', '#d65d6b'][i % 3]; g.beginPath(); g.arc(x - 4 + i * 6 + r() * 3, y + h + 2 - r() * 4, 2.4, 0, 7); g.fill(); }
    g.fillStyle = '#3c5a43'; for (let i = 0; i < 8; i++) g.fillRect(x - 3 + i * 6.5, y + h - 1, 1.2, 4);
    // ground strip + a small tree hugging the right wall
    g.fillStyle = '#2c2244'; g.fillRect(0, 226, HW, 24);
    g.fillStyle = '#2e2547'; g.fillRect(210, 120, 7, 110);
    const rt = prng(9); for (let i = 0; i < 26; i++) { g.fillStyle = mixHex('#3b3a5c', '#5c5070', rt() * .6); g.beginPath(); g.arc(196 + rt() * 40, 70 + rt() * 70, 9 + rt() * 9, 0, 7); g.fill(); }
    // cut the window hole
    g.globalCompositeOperation = 'destination-out'; g.fillRect(x, y, w, h); g.globalCompositeOperation = 'source-over';
    // mullions (cross) stay as paper strips
    g.fillStyle = '#e8c79c'; g.fillRect(x + w / 2 - 1.4, y, 2.8, h); g.fillRect(x, y + h * .42, w, 2.6);
  }, { edgeA: .5, edgeW: .7 });
}

// ---------------------------------------------------------------- world A: the dawn landscape
function landscape(room) {
  const planes = [];
  // far mountains, bay, town hill, near hill, foreground
  const mk = (z, sy, w, h, res, prof, col, o = {}) => { const s = ridgeSheet(w, h, res, prof, col, o); const a = atScreen(z, 0, sy); const x0 = (0 - W / 2) * z / F; return { z, x: (x0 - (w - W * z / F) / 2) + w / 2, y: a.y + h / 2, w, h, img: s, near: 60 }; };
  const z1 = 7200, z2 = 5000, zb = 4200, z3 = 3000;
  const w1 = W * z1 / F * 1.5, w2 = W * z2 / F * 1.5, w3 = W * z3 / F * 1.6;
  const r1 = ridge(11, 520, .00042), r2 = ridge(23, 430, .0006), r3 = ridge(37, 230, .0011, 5);
  planes.push(mk(z1, 380, w1, 2600, .22, (x) => 120 + r1(x) * 1.1 - 300 * Math.exp(-(((x - w1 * .32) / 1400) ** 2)), P.m1, { lit: '#ffd3ae', litA: .35, dark: .05, seed: 3, edgeA: .35 }));
  planes.push({ z: z1 - 400, ...(() => { const a = atScreen(z1 - 400, 0, 470); return { x: 0, y: a.y + 600 }; })(), w: w1, h: 1200, img: hazeSheet(w1, 1200, .1, '#f0b0a0', .75), near: 60 });
  planes.push(mk(z2, 455, w2, 2000, .3, (x) => 150 + r2(x) - 160 * Math.exp(-(((x - w2 * .7) / 900) ** 2)), P.m2, { lit: '#ffc8a0', litA: .4, dark: .15, seed: 5, edgeA: .4 }));
  planes.push({ z: z2 - 300, ...(() => { const a = atScreen(z2 - 300, 0, 520); return { x: 0, y: a.y + 500 }; })(), w: w2, h: 1000, img: hazeSheet(w2, 1000, .12, '#eaa79f', .7), near: 60 });
  // the bay: a sheet of water with the sun's road on it
  const bay = { z: zb, ...(() => { const a = atScreen(zb, 0, 548); return { x: 0, y: a.y + 400 }; })(), w: w2, h: 800, near: 60,
    img: sheet(w2, 800, .25, (g) => { g.fillStyle = grad(g, 0, 0, 0, 800, [[0, '#e9a9a2'], [.25, P.bay], [1, '#5b4170']]); g.fillRect(0, 0, w2, 800);
      const r = prng(3); g.fillStyle = 'rgba(255,233,200,.22)'; for (let i = 0; i < 260; i++) { const y = r() * 520; g.fillRect(r() * w2, y, 40 + r() * 260, 2 + y * .006); } }, { edgeA: .6, edge: '#ffe8cc', edgeW: 3, texture: .1 }),
    draw: (g, t) => {   // the sun's glitter road
      const sx = (sunScreen(t).x - W / 2) * zb / F + w2 / 2 + 0, r = prng(77 + Math.floor(t * 8));
      g.save(); g.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 160; i++) { const y = Math.pow(r(), 1.4) * 420, spread = 40 + y * 1.6, x = sx + (r() - .5) * 2 * spread * (.3 + r() * .7);
        g.fillStyle = rgba('#ffe7bf', (.35 + .4 * r()) * (1 - y / 460) * sunUp(t)); g.fillRect(x, y + 4, 10 + r() * 34, 2.2 + y * .006); }
      g.restore(); } };
  planes.push(bay);
  // town hill with small houses whose windows still glow from the night
  const townExtra = (w) => (g) => {
    const r = prng(21);
    for (let i = 0; i < 70; i++) {
      const x = w * .18 + r() * w * .5, base = 150 + r3(x) + 14, hw = 22 + r() * 30, hh = 18 + r() * 22;
      g.fillStyle = mixHex('#4b3a6c', '#6d5585', r() * .5); g.fillRect(x, base - hh, hw, hh + 30);
      g.fillStyle = '#3a2d58'; g.beginPath(); g.moveTo(x - 3, base - hh); g.lineTo(x + hw / 2, base - hh - 12 - r() * 8); g.lineTo(x + hw + 3, base - hh); g.fill();
      if (r() < .55) { g.fillStyle = mixHex('#ffb35c', '#ffd89a', r()); g.fillRect(x + 5 + r() * (hw - 12), base - hh + 6 + r() * 6, 4, 5); }
    }
  };
  planes.push(mk(z3, 545, w3, 1200, .5, (x) => 150 + r3(x), P.town, { lit: '#ffc497', litA: .45, dark: .3, seed: 7, edgeA: .5, extra: townExtra(w3) }));
  planes.push({ z: z3 - 250, ...(() => { const a = atScreen(z3 - 250, 0, 600); return { x: 0, y: a.y + 300 }; })(), w: w3, h: 600, img: hazeSheet(w3, 600, .2, '#c88aa0', .55), near: 60 });
  // near hill: the house stands on its crest
  const zn = HZ + 30, wn = W * zn / F * 1.4;
  const hp = ridge(51, 60, .004, 3), crest = (x) => { const hx = (HPOS.x - (-wn / 2)); return 230 + hp(x) - 60 * Math.exp(-(((x - hx) / 260) ** 2)) + 70 * ((x - hx) / wn) ** 2 * 4; };
  const nearHill = ridgeSheet(wn, 900, .9, crest, P.near, { lit: '#f2a98c', litA: .45, dark: .4, seed: 13, edgeA: .55, extra: (g) => {
    const r = prng(5);   // a path, a fence and a few bushes, all paper
    g.strokeStyle = 'rgba(232,170,150,.35)'; g.lineWidth = 6; g.beginPath(); const hx = HPOS.x + wn / 2; g.moveTo(hx - 70, crest(hx - 70) + 4); g.bezierCurveTo(hx - 160, 380, hx - 420, 520, hx - 700, 900); g.stroke();
    for (let i = 0; i < 40; i++) { const x = r() * wn, y = crest(x) + 10 + r() * 80; g.fillStyle = mixHex('#2b2246', '#4a3a62', r()); g.beginPath(); g.ellipse(x, y, 14 + r() * 26, 8 + r() * 12, 0, 0, 7); g.fill(); }
    g.strokeStyle = '#2a2142'; g.lineWidth = 2.5; for (let i = 0; i < 14; i++) { const x = hx + 70 + i * 22; g.beginPath(); g.moveTo(x, crest(x) + 4); g.lineTo(x, crest(x) - 22); g.stroke(); }
  } });
  // sheet centred on x = 0; its top sits so the crest dip lies exactly under the house's ground strip
  const nh = { z: zn, x: 0, y: (HPOS.y - HH / 2 + 232) - crest(HPOS.x + wn / 2) + 450, w: wn, h: 900, img: nearHill, near: 30 };
  planes.push(nh);
  // the house, with its window as a portal into the room world
  const hs = houseSheet(9);
  planes.push({ z: HZ, x: HPOS.x, y: HPOS.y, w: HW, h: HH, img: hs, near: 4, portal: { rect: WIN, world: room },
    shadow: { ...shadowOf(hs, 5, .12), dx: 10, dy: 6, dz: 30, a: .45 },
    draw: (g, t) => {   // chimney smoke, curling slowly
      g.save(); const r = prng(3);
      for (let i = 0; i < 14; i++) { const k = ((t * .22 + i / 14) % 1), x = 160 + Math.sin(k * 5 + i) * 8 * k + k * 40, y = 20 - k * 120;
        g.fillStyle = rgba('#e9c6c9', .28 * (1 - k) * Math.min(1, k * 6)); g.beginPath(); g.arc(x, y, 5 + k * 16, 0, 7); g.fill(); }
      g.restore(); } });
  // foreground grasses (left and right), very dark, rim-lit by the sun
  const fz = 520, fw = W * fz / F * 1.25;
  const fg = sheet(fw, 520, 2.2, (g) => {
    const r = prng(8);
    g.fillStyle = P.fg;
    g.beginPath(); g.moveTo(0, 520); g.bezierCurveTo(fw * .1, 300, fw * .2, 380, fw * .32, 470); g.lineTo(fw * .32, 520); g.fill();
    g.beginPath(); g.moveTo(fw, 520); g.bezierCurveTo(fw * .9, 330, fw * .78, 400, fw * .7, 480); g.lineTo(fw * .7, 520); g.fill();
    for (let i = 0; i < 90; i++) { const left = i < 45, x = left ? r() * fw * .3 : fw * (.7 + r() * .3), h = 60 + r() * 220, lean = (r() - .5) * 40;
      g.beginPath(); g.moveTo(x - 3, 520); g.quadraticCurveTo(x + lean * .3, 520 - h * .6, x + lean, 520 - h); g.quadraticCurveTo(x + lean * .3 + 2, 520 - h * .6, x + 3, 520); g.fill(); }
    // seed heads catching the light
    for (let i = 0; i < 16; i++) { const left = i < 8, x = left ? r() * fw * .26 : fw * (.74 + r() * .24), y = 520 - 200 - r() * 120; g.fillStyle = '#3a2a40'; g.beginPath(); g.ellipse(x, y, 4, 11, .2, 0, 7); g.fill(); }
  }, { edge: '#ffc996', edgeA: .8, edgeW: 1.2 });
  planes.push({ z: fz, x: 0, y: atScreen(fz, 0, 1080 - 520 * F / fz + 60).y + 260, w: fw, h: 520, img: fg, near: 40,
    draw: null });
  return {
    bg: (g, cam, t) => {
      g.fillStyle = grad(g, 0, 0, 0, H, [[0, P.skyTop], [.38, P.skyMid], [.6, P.skyLow], [.72, P.skyHz], [.8, '#f8c99c']]); g.fillRect(0, 0, W, H);
      // high thin clouds, drifting
      const r = prng(12); g.save();
      for (let i = 0; i < 9; i++) { const y = 130 + r() * 300, x = ((r() * 2600 + t * (6 + r() * 6)) % 2600) - 300, w = 300 + r() * 500;
        g.fillStyle = rgba(mixHex('#d9909a', '#ffd2b0', y / 450), .22 + r() * .2); g.beginPath(); g.ellipse(x, y, w / 2, 5 + r() * 9, 0, 0, 7); g.fill(); }
      g.restore();
      const s = sunScreen(t), u = sunUp(t);
      screenGlow(g, s.x, s.y, 760, '#ffb88a', .35 + .25 * u, .55);
      screenGlow(g, s.x, s.y, 220, P.sunGlow, .5 + .3 * u);
      g.fillStyle = P.sun; g.beginPath(); g.arc(s.x, s.y, 42, 0, Math.PI * 2); g.fill();
    },
    planes,
    post: (g, cam, t) => {
      // birds crossing far away, slow wing beats
      for (let i = 0; i < 3; i++) { const p = proj(cam, 3800, -900 + t * (60 + i * 9) + i * 140, -520 - i * 40 + Math.sin(t + i) * 10); if (!p) continue;
        const k = Math.sin(t * 7 + i * 2) * 5 * p.s; g.strokeStyle = 'rgba(40,26,60,.8)'; g.lineWidth = 2.4 * p.s; g.beginPath(); g.moveTo(p.x - 12 * p.s, p.y - k); g.quadraticCurveTo(p.x - 5 * p.s, p.y - 3 * p.s, p.x, p.y); g.quadraticCurveTo(p.x + 5 * p.s, p.y - 3 * p.s, p.x + 12 * p.s, p.y - k); g.stroke(); }
      // the warm wash when the sun clears the horizon ("again")
      const u = sunUp(t); g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = rgba('#ffb070', .28 * u); g.fillRect(0, 0, W, H); g.restore();
    },
  };
}
// the sun rises slowly; it clears the far ridge on "again" (~4.0 s)
const sunScreen = (t) => ({ x: 640, y: mix(610, 470, smoo(clamp(t / 6.5))) });
const sunUp = (t) => smoo(lin(2.6, 5.2, t));

// ---------------------------------------------------------------- world B: the bedroom behind the window
function bedroom() {
  const C0 = WINC;                      // the room is built around the window's line of sight
  const zw = HZ + 620, zb = HZ + 360, zt = HZ + 300, zc = HZ + 150;
  const planes = [];
  // outside, beyond the bedroom's own window: the same dawn, nearer and warmer
  const outside = { z: HZ + 1400, x: C0.x + 330, y: C0.y - 120, w: 1500, h: 1100,
    img: sheet(1500, 1100, 1.2, (g) => {
      g.fillStyle = grad(g, 0, 0, 0, 1100, [[0, '#5a4382'], [.45, '#d48a8c'], [.62, '#f7be90'], [.7, '#e8a49c'], [1, '#7a5584']]); g.fillRect(0, 0, 1500, 1100);
      g.fillStyle = '#9b6f97'; g.beginPath(); g.moveTo(0, 700); for (let x = 0; x <= 1500; x += 20) g.lineTo(x, 690 - 40 * Math.sin(x * .004) - 20 * Math.sin(x * .013)); g.lineTo(1500, 1100); g.lineTo(0, 1100); g.fill();
    }, { edgeA: 0, texture: .08 }),
    draw: (g, t) => { const gx = 520, gy = 640; g.save(); g.globalCompositeOperation = 'lighter';
      const gr = g.createRadialGradient(gx, gy, 0, gx, gy, 420); gr.addColorStop(0, rgba('#ffe6bf', .9)); gr.addColorStop(.25, rgba('#ffc890', .4)); gr.addColorStop(1, rgba('#ffb070', 0)); g.fillStyle = gr; g.fillRect(0, 0, 1500, 1100);
      g.restore(); g.fillStyle = '#fff3d6'; g.beginPath(); g.arc(gx, gy - 30 * smoo(lin(6, 11, t)), 34, 0, 7); g.fill(); } };
  planes.push(outside);
  // back wall with the window (hole) on the right
  const BW = 1500, BH = 1000, bwin = [940, 250, 300, 380];
  const back = sheet(BW, BH, 2.2, (g) => {
    g.fillStyle = grad(g, 0, 0, BW, 0, [[0, '#2e2546'], [.55, '#4a3a63'], [.8, '#5e4669'], [1, '#3b2e52']]); g.fillRect(0, 0, BW, BH);
    // floor
    g.fillStyle = grad(g, 0, 760, 0, BH, [[0, '#3a2c4c'], [1, '#231a34']]); g.fillRect(0, 770, BW, BH - 770);
    g.fillStyle = 'rgba(0,0,0,.18)'; for (let x = -40; x < BW; x += 90) { g.beginPath(); g.moveTo(x, 770); g.lineTo(x - 60, BH); g.lineTo(x - 58, BH); g.lineTo(x + 2, 770); g.fill(); }
    // a framed picture and a shelf
    g.fillStyle = '#c99a6e'; g.fillRect(330, 260, 120, 92); g.fillStyle = '#6c5a86'; g.fillRect(338, 268, 104, 76); g.fillStyle = '#e7a16a'; g.beginPath(); g.arc(392, 318, 14, 0, 7); g.fill();
    g.fillStyle = '#7a5a4a'; g.fillRect(560, 340, 200, 8); const r = prng(2); for (let i = 0; i < 9; i++) { g.fillStyle = ['#c46a54', '#e0b26a', '#6f8a8c', '#d9cfb0'][i % 4]; const h = 26 + r() * 16; g.fillRect(568 + i * 20, 340 - h, 14, h); }
    // window frame + sill, then cut the opening
    const [x, y, w, h] = bwin; g.fillStyle = '#e5c49a'; g.fillRect(x - 14, y - 14, w + 28, h + 28); g.fillStyle = '#a77a62'; g.fillRect(x - 26, y + h + 10, w + 52, 14);
    g.globalCompositeOperation = 'destination-out'; g.fillRect(x, y, w, h); g.globalCompositeOperation = 'source-over';
    g.fillStyle = '#e5c49a'; g.fillRect(x + w / 2 - 4, y, 8, h); g.fillRect(x, y + h * .45, w, 7);
    // plant on the sill
    g.fillStyle = '#b8684a'; g.fillRect(x + 20, y + h - 30, 34, 40); g.fillStyle = '#4c6b4f'; for (let i = 0; i < 9; i++) { g.beginPath(); g.ellipse(x + 37 + Math.sin(i * 1.7) * 22, y + h - 40 - i * 7, 6, 15, Math.sin(i) * .9, 0, 7); g.fill(); }
  }, { edgeA: .4, edgeW: 1.2 });
  planes.push({ z: zw, x: C0.x + 60, y: C0.y + 60, w: BW, h: BH, img: back, near: 30 });
  const wallX0 = C0.x + 60 - BW / 2, wallY0 = C0.y + 60 - BH / 2;
  // the morning light: a warm shaft from the window across the room (grows on "For the rest of your life")
  planes.push({ z: zw - 40, x: C0.x + 60, y: C0.y + 60, w: BW, h: BH, near: 30,
    draw: (g, t) => {
      const k = .55 + .45 * smoo(lin(8.4, 10.6, t)), [x, y, w, h] = bwin;
      g.save(); g.globalCompositeOperation = 'lighter';
      const gr = g.createLinearGradient(x, y, x - 700, 1000); gr.addColorStop(0, rgba('#ffd49a', .38 * k)); gr.addColorStop(1, rgba('#ffb070', 0));
      g.fillStyle = gr; g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y); g.lineTo(x + w - 260, 1000); g.lineTo(x - 760, 1000); g.closePath(); g.fill();
      // dust motes drifting in the shaft
      const r = prng(31); for (let i = 0; i < 70; i++) { const u = r(), v = (r() + t * .02 * (.5 + r())) % 1, px = mix(x + w * r(), x - 600 + r() * 400, v) + Math.sin(t * .7 + i) * 6, py = mix(y, 980, v);
        g.fillStyle = rgba('#fff0d0', (.25 + .45 * u) * k * Math.sin(v * Math.PI)); g.fillRect(px, py, 2.2, 2.2); }
      g.restore(); } });
  // the bed (side view), the sleeper under a warm blanket
  const BDW = 760, BDH = 330;
  const bed = sheet(BDW, BDH, 3.4, (g) => {
    g.fillStyle = '#5b3d36'; g.fillRect(20, 60, 26, 270); g.fillRect(BDW - 40, 150, 22, 180);   // head- and footboard
    g.fillStyle = '#6e4a40'; g.beginPath(); g.moveTo(14, 70); g.quadraticCurveTo(33, 30, 52, 70); g.fill();
    g.fillStyle = '#3c2a34'; g.fillRect(40, 250, BDW - 70, 26);   // frame
    g.fillStyle = '#d8cbb8'; g.fillRect(44, 200, BDW - 84, 52);   // mattress / sheet
    g.fillStyle = '#efe4d2'; g.beginPath(); g.ellipse(120, 196, 72, 26, -.05, 0, 7); g.fill();   // pillow
    g.fillStyle = '#9c8ca8'; g.fillRect(60, 300, 10, 30); g.fillRect(BDW - 70, 300, 10, 30);
  }, { edgeA: .5, edgeW: .6 });
  planes.push({ z: zb, x: C0.x - 210, y: C0.y + 280, w: BDW, h: BDH, img: bed, shadow: { ...shadowOf(bed, 8, .25), dx: 18, dy: 10, dz: 40, a: .4 }, near: 30,
    draw: (g, t) => {   // sleeper: head on the pillow, blanket rising and falling with slow breath
      const br = Math.sin(t * 1.25) * .5 + .5, stir = smoo(lin(9.2, 10.6, t));
      // hair + head
      g.fillStyle = '#e2b996'; g.beginPath(); g.ellipse(132, 170 - stir * 4, 22, 25, .3, 0, 7); g.fill();
      g.fillStyle = '#3a2420'; g.beginPath(); g.ellipse(118, 166 - stir * 4, 24, 26, .35, Math.PI * .45, Math.PI * 1.6); g.fill();
      g.beginPath(); g.ellipse(104, 186, 18, 12, .2, 0, 7); g.fill();
      // blanket: one soft paper shape with a fold, amber (human warmth)
      g.save(); g.translate(0, -br * 2.5);
      g.fillStyle = '#d9893f'; g.beginPath(); g.moveTo(150, 205); g.bezierCurveTo(190, 150 - br * 2, 300, 140, 380, 160); g.bezierCurveTo(470, 180, 560, 170, 640, 196); g.lineTo(700, 210); g.lineTo(704, 262); g.lineTo(150, 262); g.closePath(); g.fill();
      g.fillStyle = '#b86a2c'; g.beginPath(); g.moveTo(380, 160); g.bezierCurveTo(420, 190, 470, 214, 560, 216); g.bezierCurveTo(470, 222, 410, 210, 380, 160); g.fill();
      g.fillStyle = '#f0b468'; g.beginPath(); g.moveTo(150, 205); g.bezierCurveTo(190, 150 - br * 2, 300, 140, 380, 160); g.bezierCurveTo(300, 152, 200, 166, 156, 214); g.fill();   // lit ridge
      g.fillStyle = '#efe0c8'; g.fillRect(150, 200, 24, 62);   // folded sheet edge
      g.restore();
    } });
  // the bedside table with the letter (catches the light on "taken care of")
  const TW = 150, TH = 180;
  const table = sheet(TW, TH, 4, (g) => {
    g.fillStyle = '#6a4636'; g.fillRect(10, 40, 130, 14); g.fillRect(20, 54, 110, 70); g.fillStyle = '#7d5643'; g.fillRect(20, 54, 110, 30);
    g.fillStyle = '#5a3b2e'; g.fillRect(24, 124, 10, 56); g.fillRect(116, 124, 10, 56);
    g.fillStyle = '#d7b07a'; g.fillRect(68, 66, 14, 4);
    g.fillStyle = '#b9b2c8'; g.fillRect(28, 6, 14, 34); g.fillStyle = '#efe6d0'; g.beginPath(); g.arc(35, 6, 12, Math.PI, 0); g.fill();   // little lamp, off
  }, { edgeA: .45, edgeW: .5 });
  planes.push({ z: zt, x: C0.x + 300, y: C0.y + 330, w: TW, h: TH, img: table, near: 30, shadow: { ...shadowOf(table, 6, .3), dx: 14, dy: 6, dz: 30, a: .35 },
    draw: (g, t) => {   // the envelope on the table, with a small amber seal that glows
      const k = smoo(lin(6.3, 7.6, t)), pulse = .85 + .15 * Math.sin(t * 2.2);
      g.save(); g.translate(92, 34); g.rotate(-.08);
      g.fillStyle = '#f2e7d2'; g.fillRect(-30, -9, 60, 12); g.fillStyle = '#ddd0b6'; g.beginPath(); g.moveTo(-30, -9); g.lineTo(0, 0); g.lineTo(30, -9); g.fill();
      g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(0, -3, 0, 0, -3, 60); gr.addColorStop(0, rgba('#ffcf8a', .55 * k * pulse)); gr.addColorStop(1, rgba('#ffb35c', 0)); g.fillStyle = gr; g.fillRect(-70, -60, 140, 110);
      g.globalCompositeOperation = 'source-over'; g.fillStyle = mixHex('#c46a2c', '#ffc46e', k); g.beginPath(); g.arc(0, -2, 4, 0, 7); g.fill();
      g.restore(); } });
  // a curtain at the near left edge, swaying a little in the morning air
  const CW = 260, CH = 900;
  const curtain = sheet(CW, CH, 3, (g) => {
    g.fillStyle = grad(g, 0, 0, CW, 0, [[0, '#2a1f3c'], [.7, '#4a3352'], [1, '#6b4a5e']]);
    g.beginPath(); g.moveTo(0, 0); g.lineTo(CW * .8, 0); g.bezierCurveTo(CW * .55, 300, CW, 600, CW * .7, CH); g.lineTo(0, CH); g.closePath(); g.fill();
    g.fillStyle = 'rgba(0,0,0,.2)'; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(30 + i * 40, 0); g.bezierCurveTo(40 + i * 38, 300, 20 + i * 44, 600, 30 + i * 40, CH); g.lineTo(40 + i * 40, CH); g.bezierCurveTo(30 + i * 44, 600, 50 + i * 38, 300, 40 + i * 40, 0); g.fill(); }
  }, { edge: '#ffcf9a', edgeA: .4, edgeW: 1 });
  planes.push({ z: zc, x: (t) => C0.x - 330 + Math.sin(t * .6) * 4, y: C0.y + 30, w: CW, h: CH, img: curtain, near: 25 });
  return { planes, post: (g, cam, t) => { g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = rgba('#ff9e5e', .12 + .12 * smoo(lin(8.4, 10.6, t))); g.fillRect(0, 0, W, H); g.restore(); } };
}

// ---------------------------------------------------------------- camera: one continuous move
// wide and almost still while the line lands, then a calm glide toward the window, through it, and a soft landing inside
const cam = camPath([
  [0, { x: 0, y: 0, z: 0 }],
  [4.6, { x: WINC.x * .18, y: WINC.y * .14, z: 380 }],
  [7.7, { x: WINC.x, y: WINC.y, z: HZ + 4 }],
  [11.2, { x: WINC.x - 40, y: WINC.y + 70, z: HZ + 90 }],
], { drift: 1 });

export async function build() {
  const room = bedroom(), world = landscape(room);
  const [c, g] = canvas(W, H);
  return {
    duration: DUR,
    frame(t) {
      const cm = cam(t); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
      if (cm.z < HZ) renderWorld(g, world, cm, t); else renderWorld(g, room, cm, t);
      finish(g, t, { vig: .4 });
      return c;
    },
  };
}
