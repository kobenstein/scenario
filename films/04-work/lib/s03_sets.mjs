// s03_sets · static plates for chapter 03 (first half): the house at night, the sofa grid, the pond, the night bus,
// the bridge at dawn, the garden without a fence, the small town square. Each builder returns cached canvases.
import { W, H, P, rgba, clamp, mix, prng, shade, mixHex, layer, plate, put, stipple, maskLinear, maskRadial, roughPoly, roughRect, roughLine, roughPath, hatch, fog, cone, pool, once, glowA, vg, rg, vnoise, fbm, washLayer } from './s03_kit.mjs';
import { house, facade, quadMap, quadIn, limb, qpts, stratus, strokes } from './art.mjs';

// ---------------------------------------------------------------- 3.01 your house at night (3/4 view)
export const HOUSE = { win: [[780, 392], [1010, 414], [1010, 596], [780, 586]] };   // the hero window quad (plate coords)
export function houseSet(until) {
  return once('house', until, () => {
    const sky = plate(W, H, (g) => {
      vg(g, [[0, '#2a2350'], [.18, '#141838'], [.6, '#0b1030'], [1, '#0e1436']], 0, 0, 0, H);
      const r = prng(3); for (let i = 0; i < 180; i++) { const x = r() * W, y = Math.pow(r(), 1.5) * 500, m = r(); g.fillStyle = rgba('#dfe6ff', .08 + .4 * m * m); g.fillRect(x, y, 1, 1); }
      fog(g, { y0: 520, y1: 820, col: '#3a4a8a', a: .35, seed: 4, cover: .6, soft: .5, k: .3, sx: .003, sy: .02 });
      // neighbouring roofs far right, low and dark
      let x = 1380; const rr = prng(9); while (x < W + 60) { const w = 90 + rr() * 80; house(g, rr, x + w / 2, 840, w, 150 + rr() * 80, { wall: '#141a3e', lit: (a, b, q) => q() < .15 ? .7 : 0, amp: .6, floorH: 32, trim: false }); x += w + 8; }
    });
    const front = plate(W, H, (g) => {
      // the house: front facade (quad, receding right) + gable + side wall
      const q = [[560, 200], [1160, 262], [1160, 860], [560, 900]];
      roughPoly(g, [[548, 206], [860, 40], [1172, 268]], '#1a1c44', { amp: 1.2, seed: 2 });   // gable roof
      roughPoly(g, [[860, 40], [1172, 268], [1360, 300], [1060, 70]], '#10122e', { amp: 1.2, seed: 3 });   // roof plane
      roughPoly(g, [[1160, 262], [1360, 300], [1360, 820], [1160, 860]], '#0f1330', { amp: 1, seed: 4 });   // side wall
      const m = facade(g, prng(5), q, { wall: '#1b2152', floors: 2, cols: 3, ww: .34, wh: .5, top: .14, bottom: .96, style: 0, lit: () => 0, skip: 0, cornice: true,
        shade: [[0, rgba('#3a4a9a', .12)], [1, rgba('#000000', .25)]] });
      // the hero window gets a bigger opening: dark first, lit per frame
      roughPoly(g, HOUSE.win.map(([x, y], i) => [x + (i === 0 || i === 3 ? -10 : 10), y + (i < 2 ? -10 : 10)]), '#2a3266', { amp: .5, seed: 6 });
      roughPoly(g, HOUSE.win, '#05061a', { amp: .4, seed: 7 });
      roughPoly(g, [[766, 592], [1024, 602], [1026, 616], [764, 606]], '#3a4280', { amp: .4, seed: 8 });   // sill
      // door + steps
      roughPoly(g, [[1050, 700], [1120, 706], [1120, 868], [1050, 872]], '#0a0c22', { amp: .4, seed: 9 });
      g.fillStyle = rgba('#ffb35c', .5); g.fillRect(1102, 780, 4, 4);
      roughPoly(g, [[1030, 872], [1140, 866], [1150, 892], [1020, 900]], '#14183c', { amp: .6, seed: 10 });
      // plaster texture
      g.save(); g.beginPath(); roughPath(g, q, { amp: 1, seed: 1 }); g.clip(); hatch(g, [560, 200, 600, 700], { angle: -.08, gap: 7, col: '#000', a: .12, seed: 11, broken: .5 }); g.restore();
      // ground: front garden, path, a low wall with a gate
      roughPoly(g, [[-20, 900], [W + 20, 860], [W + 20, H + 20], [-20, H + 20]], '#0a0e26', { amp: 1.2, seed: 12 });
      roughPoly(g, [[1030, 900], [1150, 892], [1400, H + 20], [900, H + 20]], '#141a3c', { amp: 1, seed: 13 });
      for (let i = 0; i < 9; i++) { const y = 920 + i * i * 2.6, a = mix(1030, 900, (y - 900) / 180), b = mix(1150, 1400, (y - 900) / 180); g.strokeStyle = rgba('#000', .3); g.lineWidth = 1.2; g.beginPath(); g.moveTo(a, y); g.lineTo(b, y); g.stroke(); }
      const r = prng(14); for (let i = 0; i < 26; i++) { const x = 380 + i * 34 + r() * 20, y = 920 + r() * 30, rr = 30 + r() * 28; g.fillStyle = shade('#0d1430', (r() - .5) * .03); g.beginPath(); g.ellipse(x, y, rr, rr * .8, 0, 0, 7); g.fill(); }   // hedge
      g.save(); g.globalCompositeOperation = 'source-atop'; vg(g, [[0, rgba('#5a74c8', .1)], [1, rgba('#000', 0)]], 0, 880, 0, 960, [0, 880, W, 80]); g.restore();
    });
    // foreground tree (left) on its own layer so it parallaxes and sways
    const tree = plate(760, H, (g) => {
      limb(g, qpts([150, H + 20], [190, 640], [120, 260]), 70, 30, '#04050f', 1);
      for (const [a, b, c2, w0, w1] of [[[150, 560], [300, 430], [470, 380], 26, 6], [[130, 380], [260, 260], [420, 180], 20, 5], [[125, 300], [40, 160], [-20, 60], 18, 4], [[160, 470], [330, 520], [560, 470], 16, 3], [[300, 430], [380, 300], [520, 240], 9, 2], [[260, 260], [330, 120], [450, 60], 8, 2]]) limb(g, qpts(a, b, c2), w0, w1, '#04050f', a[0]);
      const r = prng(15); for (let i = 0; i < 260; i++) { const x = 60 + r() * 520, y = 40 + r() * 520; if (Math.hypot(x - 300, y - 300) > 300) continue; g.fillStyle = mixHex('#05061a', '#16224a', r() * .6); g.beginPath(); g.ellipse(x, y, 7 + r() * 9, 4 + r() * 5, r() * 3, 0, 7); g.fill(); }
      g.save(); g.globalCompositeOperation = 'source-atop'; vg(g, [[0, rgba('#000', 0)], [.75, rgba('#000', 0)], [1, rgba('#6a7ad0', .2)]], 0, 0, 760, 0, [0, 0, 760, H]); g.restore();
    });
    return { sky, front, tree };
  });
}

// ---------------------------------------------------------------- 3.10 the grid of sofas (seen from above)
export const GRID = { cols: 9, rows: 7, cw: 330, ch: 270, w: 3200, h: 2100 };
export function gridSet(until) {
  return once('grid', until, () => {
    const cells = [], { cols, rows, cw, ch } = GRID, x0 = (GRID.w - cols * cw) / 2, y0 = (GRID.h - rows * ch) / 2, r = prng(21);
    const c = plate(GRID.w, GRID.h, (g) => {
      g.fillStyle = '#04050f'; g.fillRect(0, 0, GRID.w, GRID.h);
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const x = x0 + i * cw + 12, y = y0 + j * ch + 12, w = cw - 24, h = ch - 24, tvx = x + 30 + r() * 20, tvy = y + h * (.3 + r() * .4);
        roughRect(g, x, y, w, h, shade('#0d1230', (r() - .5) * .03), { amp: 1, seed: i * 31 + j });
        // floor boards
        g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); for (let k = 0; k < 14; k++) { g.fillStyle = rgba('#000', .12); g.fillRect(x, y + k * 18, w, 1.2); } g.restore();
        // the sofa (top view): back + arms + seat, facing the TV on the left wall
        const sx = x + w * .62, sy = y + h * .22, sw = w * .22, sh = h * .56;
        roughRect(g, sx + sw * .7, sy, sw * .3, sh, '#1a2258', { amp: 1, seed: i + j * 9 });
        roughRect(g, sx, sy - 6, sw, sh * .16, '#1d265e', { amp: 1, seed: i + j * 9 + 1 }); roughRect(g, sx, sy + sh * .86, sw, sh * .16, '#1d265e', { amp: 1, seed: i + j * 9 + 2 });
        roughRect(g, sx + 4, sy + sh * .16, sw * .7, sh * .7, '#232c6a', { amp: 1, seed: i + j * 9 + 3 });
        // the person on it, top view (head + shoulders + legs)
        const px = sx + sw * .4, py = sy + sh * (.35 + r() * .3);
        g.fillStyle = '#2a3474'; g.beginPath(); g.ellipse(px, py, sw * .22, sh * .17, 0, 0, 7); g.fill();
        g.fillStyle = '#9fb0d8'; g.beginPath(); g.arc(px + sw * .1, py, sw * .14, 0, 7); g.fill(); g.strokeStyle = rgba(P.cy, .7); g.lineWidth = 2; g.beginPath(); g.arc(px + sw * .1, py, sw * .14, 2.2, 4.2); g.stroke();
        g.strokeStyle = '#1c2250'; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(px - 4, py - 6); g.lineTo(px - sw * .7, py - 10 + r() * 20); g.stroke();
        // the TV on the left wall and its light across the floor
        roughRect(g, x + 4, tvy - 34, 10, 68, '#cfefff', { amp: .4, seed: i * 3 + j });
        cells.push({ x: x + 14, y: tvy, cx: x + w / 2, cy: y + h / 2, x0: x, y0: y, w, h, ph: r() * 6.28, f: 4 + r() * 9 });
        // a rug and a plant: every flat slightly different, all the same evening
        g.fillStyle = shade('#151a40', (r() - .5) * .03); g.beginPath(); g.roundRect(x + w * .28, y + h * .25, w * .3, h * .5, 6); g.fill();
        g.fillStyle = '#14301e'; g.beginPath(); g.arc(x + w - 26, y + 26, 16, 0, 7); g.fill();
        // walls between flats (thick), windows as notches
        g.fillStyle = '#020309'; g.fillRect(x - 12, y - 12, w + 24, 12); g.fillRect(x - 12, y - 12, 12, h + 24);
      }
      // the light pools from every screen, stippled
      const [lc, lx] = layer(GRID.w, GRID.h); lx.globalCompositeOperation = 'lighter';
      for (const q of cells) { lx.save(); lx.beginPath(); lx.rect(q.x0, q.y0, q.w, q.h); lx.clip(); const gr = lx.createRadialGradient(q.x, q.y, 0, q.x, q.y, q.w * .9); gr.addColorStop(0, rgba(P.cy, .6)); gr.addColorStop(.35, rgba(P.cy, .2)); gr.addColorStop(1, rgba(P.cy, 0)); lx.fillStyle = gr; lx.fillRect(q.x0, q.y0, q.w, q.h); lx.restore(); }
      stipple(lc, { k: .6, g: 1.2, seed: 22 }); g.save(); g.globalCompositeOperation = 'lighter'; g.drawImage(lc, 0, 0); g.restore();
    });
    return { c, cells };
  });
}

// ---------------------------------------------------------------- 3.12 the pond at night
export const POND = { cx: 960, cy: 700, rx: 760, ry: 210, moon: [1250, 712] };
export function pondSet(until) {
  return once('pond', until, () => {
    const bg = plate(W, H, (g) => {
      vg(g, [[0, '#060818'], [.5, '#0e1236'], [1, '#141a40']], 0, 0, 0, 520);
      const r = prng(31); for (let i = 0; i < 200; i++) { const m = r(); g.fillStyle = rgba('#e8ecff', .1 + .5 * m * m); g.fillRect(r() * W, r() * 420, 1, 1); }
      // the moon (upper right) and its halo
      g.fillStyle = '#f3efe2'; g.beginPath(); g.arc(1250, 160, 40, 0, 7); g.fill();
      const hg = g.createRadialGradient(1250, 160, 30, 1250, 160, 260); hg.addColorStop(0, rgba('#f3efe2', .25)); hg.addColorStop(1, rgba('#f3efe2', 0)); g.fillStyle = hg; g.fillRect(900, 0, 700, 450);
      // treeline and banks
      const n = vnoise(32), tl = (x) => 470 - 70 * fbm(n, x * .006, 2, 4) - 30 * Math.sin(x * .002);
      const pts = [[-20, 560]]; for (let x = -20; x <= W + 20; x += 8) pts.push([x, tl(x)]); pts.push([W + 20, 560]);
      roughPoly(g, pts, '#070a1c', { amp: 2, seed: 33 });
      roughPoly(g, [[-20, 520], [W + 20, 520], [W + 20, H + 20], [-20, H + 20]], '#0a0e26', { amp: 1, seed: 34 });
      // the water: an ellipse in perspective with the sky reflected
      g.save(); g.beginPath(); g.ellipse(POND.cx, POND.cy, POND.rx, POND.ry, 0, 0, 7); g.clip();
      vg(g, [[0, '#1a2050'], [1, '#080b20']], 0, POND.cy - POND.ry, 0, POND.cy + POND.ry);
      for (let i = 0; i < 160; i++) { const y = POND.cy - POND.ry + r() * POND.ry * 2, x = POND.cx - POND.rx + r() * POND.rx * 2; g.fillStyle = rgba('#8a9ad8', .05 + .06 * r()); g.fillRect(x, y, 30 + r() * 80, 1.2); }
      g.restore();
      g.strokeStyle = rgba('#000', .5); g.lineWidth = 6; g.beginPath(); g.ellipse(POND.cx, POND.cy, POND.rx, POND.ry, 0, Math.PI * 1.05, Math.PI * 1.95); g.stroke();
      fog(g, { y0: 470, y1: 660, col: '#6a78b8', a: .4, seed: 35, cover: .6, soft: .5, k: .35, sx: .003, sy: .025 });
    });
    const reeds = plate(W, H, (g) => {
      const r = prng(36);
      for (const [x0, x1, base] of [[-40, 420, H + 10], [1500, 1980, H + 10], [180, 520, 820], [1560, 1800, 820]]) for (let i = 0; i < 70; i++) {
        const x = x0 + r() * (x1 - x0), h = 120 + r() * 300, lean = (r() - .5) * 60; limb(g, qpts([x, base], [x + lean * .3, base - h * .5], [x + lean, base - h]), 5 + r() * 4, 1, '#03040c', i);
        if (r() < .25) { g.fillStyle = '#03040c'; g.beginPath(); g.ellipse(x + lean * .95, base - h * .95, 5, 18, lean * .004, 0, 7); g.fill(); }
      }
      g.save(); g.globalCompositeOperation = 'source-atop'; g.fillStyle = rgba('#6a78b8', .08); g.fillRect(0, 0, W, H); g.restore();
    });
    return { bg, reeds };
  });
}

// ---------------------------------------------------------------- 3.13 the night bus (side view): street that scrolls
export const BUS = { x: 300, y: 430, w: 1320, h: 380 };
export function busSet(until) {
  return once('bus', until, () => {
    const TW = 2 * W;
    const tile = plate(W, H, (g) => {
      vg(g, [[0, '#0a0c1e'], [.55, '#1a1a36'], [1, '#2a2438']], 0, 0, 0, H, [0, 0, W, H]);
      const r = prng(41); let x = -20;
      while (x < W - 100) { const w = 120 + r() * 160, h = 380 + r() * 360; roughRect(g, x, 820 - h, w, h + 40, shade('#15162e', (r() - .5) * .03), { amp: 1, seed: x | 0 });
        for (let fy = 840 - h + 30; fy < 780; fy += 46) for (let fx = x + 16; fx < x + w - 20; fx += 34) if (r() < .32) { g.fillStyle = rgba(r() < .7 ? '#f2a54a' : '#cfd6ff', .35 + .4 * r()); g.fillRect(fx, fy, 16, 22); }
        x += w + 6; }
      fog(g, { y0: 500, y1: 860, col: '#c08a5a', a: .2, seed: 42, cover: .6, soft: .5, k: .3, sx: .003, sy: .02 });
    });
    const far = plate(TW, H, (g) => { g.drawImage(tile, 0, 0); g.drawImage(tile, W, 0); });   // repeat so the strip tiles
    const road = plate(TW, H, (g) => {
      roughPoly(g, [[-10, 818], [TW + 10, 818], [TW + 10, H + 10], [-10, H + 10]], '#0c0c18', { amp: 1, seed: 43 });
      for (let i = 0; i < 40; i++) { g.fillStyle = rgba('#e8d8a8', .25); g.fillRect(i * 96, 960, 48, 5); }
      roughLine(g, [[-10, 822], [TW + 10, 822]], { w: 3, col: rgba('#f2a54a', .3), seed: 44 });
    });
    const bus = plate(W, H, (g) => {
      const { x, y, w, h } = BUS;
      g.fillStyle = rgba('#000', .5); g.beginPath(); g.ellipse(x + w / 2, y + h + 14, w * .52, 18, 0, 0, 7); g.fill();
      g.fillStyle = '#c9cbd4'; g.beginPath(); g.roundRect(x, y, w, h, [34, 34, 14, 14]); g.fill();
      vg(g, [[0, rgba('#ffffff', .08)], [1, rgba('#000', .35)]], 0, y, 0, y + h, [x, y, w, h]);
      g.fillStyle = '#7a2a2a'; g.fillRect(x, y + h * .72, w, 14);
      // wheels
      for (const wx of [x + 210, x + w - 230]) { g.fillStyle = '#05050a'; g.beginPath(); g.arc(wx, y + h, 58, 0, 7); g.fill(); g.fillStyle = '#3a3a48'; g.beginPath(); g.arc(wx, y + h, 24, 0, 7); g.fill(); }
      // window band (dark glass, lit per frame inside)
      g.fillStyle = '#1a1712'; g.beginPath(); g.roundRect(x + 40, y + 46, w - 80, 170, 10); g.fill();
      for (let i = 1; i < 6; i++) { g.fillStyle = '#b8bac4'; g.fillRect(x + 40 + i * (w - 80) / 6 - 6, y + 46, 12, 170); }
      g.fillStyle = '#f2e6c8'; g.fillRect(x + w - 30, y + h * .5, 16, 26);   // tail light / front light
    });
    return { far, road, bus };
  });
}

// ---------------------------------------------------------------- 3.19/3.20 the bridge at dawn
export const BR = { y: (x) => 640 + (x - 960) * .06, rail: (x) => 640 + (x - 960) * .06 - 70 };
export function bridgeSet(until) {
  return once('bridge', until, () => {
    const sky = plate(W, H, (g) => {
      vg(g, [[0, '#2a3048'], [.45, '#5a6074'], [.62, '#9a8c90'], [.7, '#b89a98']], 0, 0, 0, 720);
      const [hc, hx] = layer(); hx.beginPath(); for (const [y, a, b, th] of [[200, -100, 900, 26], [300, 600, 2100, 20], [120, 1100, 2100, 30]]) stratus(hx, y, a, b, th, y); hx.fillStyle = rgba('#7a7c90', .5); hx.fill(); hx.clip(); hatch(hx, [0, 60, W, 300], { angle: -.02, gap: 4, col: '#c8b8b8', a: .4, seed: 5 }); put(g, hc);
      // the far city on the other bank, flat grey layers
      const r = prng(51); for (const [y0, col, s] of [[560, '#6a6e80', .6], [600, '#4e5268', .85]]) { let x = -20; while (x < W + 20) { const w = (60 + r() * 120) * s, h = (60 + r() * 220) * s; roughRect(g, x, y0 - h, w, h + 200, col, { amp: .6, seed: x | 0 }); x += w + 2; } fog(g, { y0: y0 - 160, y1: y0 + 40, col: '#a89aa0', a: .45, seed: y0, cover: .7, soft: .5, k: .3, sx: .003, sy: .02 }); }
      vg(g, [[0, '#4a4e62'], [1, '#2a2e40']], 0, 640, 0, H, [0, 640, W, H - 640]);   // river
      for (let i = 0; i < 160; i++) { g.fillStyle = rgba('#c8b8b8', .06 + .06 * r()); g.fillRect(r() * W, 660 + r() * 420, 40 + r() * 120, 1.2); }
    });
    // the bridge deck in perspective + railing posts (front), drawn as its own layer
    const deck = plate(W, H, (g) => {
      const top = (x) => BR.y(x), pts = [[-20, top(-20) + 4], [W + 20, top(W + 20) + 4], [W + 20, top(W + 20) + 150], [-20, top(-20) + 150]];
      roughPoly(g, pts, '#22263a', { amp: 1, seed: 52 });
      roughPoly(g, [[-20, top(-20) + 4], [W + 20, top(W + 20) + 4], [W + 20, top(W + 20) + 18], [-20, top(-20) + 18]], '#4a4e64', { amp: .6, seed: 53 });
      // arches under the deck
      for (let i = 0; i < 5; i++) { const cx = 100 + i * 440, y = top(cx) + 150; g.fillStyle = '#2e3246'; g.beginPath(); g.ellipse(cx, y + 120, 200, 130, 0, Math.PI, 0); g.lineTo(cx + 220, y); g.lineTo(cx - 220, y); g.fill(); }
      hatch(g, [0, 650, W, 200], { angle: -.6, gap: 6, col: '#000', a: .15, seed: 54 });
    });
    const rail = plate(W, H, (g) => {
      const r = (x) => BR.y(x) + 110;
      roughLine(g, [[-20, r(-20) - 96], [W + 20, r(W + 20) - 96]], { w: 7, col: '#141624', seed: 55 });
      for (let x = -20; x < W + 40; x += 56) roughLine(g, [[x, r(x)], [x, r(x) - 96]], { w: 4, col: '#141624', seed: x });
      roughLine(g, [[-20, r(-20) - 40], [W + 20, r(W + 20) - 40]], { w: 3, col: '#141624', seed: 56 });
    });
    return { sky, deck, rail };
  });
}

// ---------------------------------------------------------------- 3.21 the garden without a fence (high oblique view)
export const GARD = { cx: 960, cy: 640, rx: 560, ry: 250 };
export const loopPt = (u) => { const a = u * Math.PI * 2, k = 4, c = Math.cos(a), s = Math.sin(a); const sq = (v) => Math.sign(v) * Math.pow(Math.abs(v), 2 / k); return [GARD.cx + GARD.rx * sq(c), GARD.cy + GARD.ry * sq(s)]; };
export function gardenSet(until) {
  return once('garden', until, () => plate(W, H, (g) => {
    vg(g, [[0, '#8a9a80'], [1, '#56664e']], 0, 0, 0, H);
    const r = prng(61), n = vnoise(66);
    // mown stripes, diagonal (perspective of a lawn seen from an upstairs window)
    for (let k = -8; k < 20; k++) { g.fillStyle = rgba(k % 2 ? '#c8d0a8' : '#2a3a2a', .06); g.beginPath(); g.moveTo(k * 160, -20); g.lineTo(k * 160 + 160, -20); g.lineTo(k * 160 + 160 - 500, H + 20); g.lineTo(k * 160 - 500, H + 20); g.closePath(); g.fill(); }
    // grass strokes
    for (let i = 0; i < 14000; i++) { const x = r() * W, y = r() * H, l = 4 + r() * 9, d = fbm(n, x * .004, y * .004, 3); g.strokeStyle = r() < .45 + d * .2 ? '#a8b890' : '#34443a'; g.globalAlpha = .12 + .3 * r(); g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - .3) * 4, y - l); g.stroke(); }
    g.globalAlpha = 1;
    // a flower bed along the bottom edge, a stepping-stone path from the back door
    roughPoly(g, [[-20, 960], [700, 990], [1300, 970], [W + 20, 1000], [W + 20, H + 20], [-20, H + 20]], '#4a3a2a', { amp: 3, seed: 67 });
    for (let i = 0; i < 70; i++) { const x = r() * W, y = 985 + r() * 90; g.fillStyle = ['#e8a3a0', '#ffd59a', '#f3efe2', '#c8604a'][Math.floor(r() * 4)]; g.beginPath(); g.arc(x, y, 3 + r() * 4, 0, 7); g.fill(); g.fillStyle = '#2a3a26'; g.beginPath(); g.ellipse(x + 6, y + 6, 8, 4, r(), 0, 7); g.fill(); }
    for (let i = 0; i < 6; i++) { const x = 380 + i * 60 + i * i * 6, y = 230 + i * 70; roughPoly(g, [[x - 34, y - 14], [x + 30, y - 18], [x + 36, y + 14], [x - 30, y + 18]], '#a8a49a', { amp: 2, seed: 68 + i }); }
    // the worn loop where the fence used to stand: bare earth path
    g.lineCap = 'round'; g.lineJoin = 'round';
    for (const [w, col, a] of [[46, '#8a7a5c', .55], [30, '#a8946c', .7], [14, '#c0aa7a', .35]]) { g.strokeStyle = rgba(col, a); g.lineWidth = w; g.beginPath(); for (let k = 0; k <= 200; k++) { const [x, y] = loopPt(k / 200); k ? g.lineTo(x + (r() - .5) * 2, y + (r() - .5) * 2) : g.moveTo(x, y); } g.closePath(); g.stroke(); }
    // fence post stumps along the loop (outside edge), holes where posts were
    for (let k = 0; k < 28; k++) { const [x, y] = loopPt(k / 28), dx = x - GARD.cx, dy = y - GARD.cy, l = Math.hypot(dx, dy / .45), px = x + dx / l * 40, py = y + dy / l * 18; g.fillStyle = '#3a2e22'; g.beginPath(); g.ellipse(px, py, 9, 5, 0, 0, 7); g.fill(); g.fillStyle = '#5a4a36'; g.beginPath(); g.ellipse(px, py - 3, 8, 4.5, 0, 0, 7); g.fill(); }
    // the house corner and a back door step (top left), a tree shadow, a shed (right)
    roughPoly(g, [[-20, -20], [520, -20], [480, 150], [-20, 210]], '#3a3a46', { amp: 1.5, seed: 62 });
    roughPoly(g, [[300, 140], [420, 128], [430, 170], [310, 182]], '#6a6a70', { amp: .8, seed: 63 });
    roughPoly(g, [[1620, 120], [1900, 100], [1940, 360], [1660, 390]], '#4a3e36', { amp: 1.5, seed: 64 });
    { const [sc, sx] = layer(); sx.fillStyle = rgba('#14241a', .5); for (let i = 0; i < 26; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * 260; sx.beginPath(); sx.ellipse(1520 + Math.cos(a) * d, 860 + Math.sin(a) * d * .45, 70 + r() * 60, 30 + r() * 30, r(), 0, 7); sx.fill(); }
      sx.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 60; i++) { sx.fillStyle = rgba('#000', .8); sx.beginPath(); sx.arc(1250 + r() * 560, 740 + r() * 260, 6 + r() * 14, 0, 7); sx.fill(); }
      put(g, sc); }
    // pale morning light from the top right
    const lg = g.createLinearGradient(W, 0, 0, H); lg.addColorStop(0, rgba('#fff1cf', .35)); lg.addColorStop(.6, rgba('#fff1cf', 0)); g.fillStyle = lg; g.fillRect(0, 0, W, H);
  }));
}

// ---------------------------------------------------------------- 3.25 the small town square (morning)
export function squareSet(until) {
  return once('square', until, () => {
    const VP = [960, 470];
    return plate(W, H, (g) => {
      vg(g, [[0, '#6a9ac8'], [.7, '#bcd0e0'], [1, '#e8dcc8']], 0, 0, 0, 520);
      const r = prng(71);
      // facades left and right receding to VP, a church tower at the end
      const side = (s) => { for (let i = 0; i < 5; i++) { const t0 = .18 + i * .17, t1 = t0 + .17, xa = mix(VP[0], s < 0 ? -200 : W + 200, t1), xb = mix(VP[0], s < 0 ? -200 : W + 200, t0), ga = mix(VP[1], 1000, t1), gb = mix(VP[1], 1000, t0), ha = 620 * t1, hb = 620 * t0;
        const q = s < 0 ? [[xa, ga - ha], [xb, gb - hb], [xb, gb], [xa, ga]] : [[xb, gb - hb], [xa, ga - ha], [xa, ga], [xb, gb]];
        facade(g, r, q, { wall: ['#d9b48a', '#c9876a', '#e2cfa0', '#b8a07a', '#d29a7a'][i], floors: 3, cols: 3, ww: .36, wh: .55, lit: () => 0, winOff: '#4a3a3a', trimCol: '#f0e2c8', style: i % 4, shade: [[0, rgba('#fff3d8', s < 0 ? .0 : .2)], [1, rgba('#3a2a2a', s < 0 ? .35 : .1)]] }); } };
      roughPoly(g, [[900, 300], [1020, 300], [1020, 480], [900, 480]], '#c9b08a', { amp: .8, seed: 72 }); roughPoly(g, [[890, 300], [960, 170], [1030, 300]], '#6a4a40', { amp: .8, seed: 73 });
      g.fillStyle = '#f3efe2'; g.beginPath(); g.arc(960, 340, 18, 0, 7); g.fill();
      roughPoly(g, [[-20, 1000], [W + 20, 1000], [W + 20, H + 20], [-20, H + 20]], '#b8a488', { amp: 1, seed: 74 });
      roughPoly(g, [[VP[0] - 120, VP[1] + 10], [VP[0] + 120, VP[1] + 10], [W + 300, H + 20], [-300, H + 20]], '#c8b496', { amp: 1, seed: 75 });
      // cobbles converge
      for (let k = 0; k < 40; k++) { const y = VP[1] + 20 + Math.pow(k / 40, 1.7) * 620, s2 = (y - VP[1]) / 610; g.strokeStyle = rgba('#7a6a58', .3); g.lineWidth = 1; g.beginPath(); g.moveTo(VP[0] - 130 - s2 * 1300, y); g.lineTo(VP[0] + 130 + s2 * 1300, y); g.stroke(); }
      side(-1); side(1);
      vg(g, [[0, rgba('#fff1cf', .0)], [1, rgba('#fff1cf', .25)]], 0, 300, 0, 600, [0, 300, W, 300]);
    });
  });
}
