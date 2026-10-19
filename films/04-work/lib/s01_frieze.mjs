// s01_frieze · the work frieze: one long landscape strip with four stations of work, night and day.
//   A hospital ward (nurse, patient) · B early train at a platform (driver, commuters) · C harvest field (two pickers)
//   D warehouse + call desk (packer, caller). Night: cyan points take over the tasks, people lift their heads.
//   Day: people still work, but on "having" the whole frieze exhales (shoulders drop, the train slows, pickers straighten).
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, layer, put, stipple, maskLinear, roughPath, roughPoly, roughRect, roughLine, sagLine, hatch, fog, bloom, pool, cone, vnoise, fbm, printFinish } from './art.mjs';
import { lin, sm, eio, eout, drift } from '../engine.mjs';
import { memo, spot, fig, lerpPose } from './s01_kit.mjs';

export const FW = 3600, GY = 800;
const HOT = '#ffd9a0', AMB = '#ffb35c', CY = '#8fe6ff', CYW = '#d8f7ff';
const PAL = {
  night: { sky: ['#04061a', '#0e1240', '#1f2160'], ground: '#0b0c26', ground2: '#05061a', wall: '#1b1d47', wall2: '#141539', roof: '#10112f', room: '#e9a560', roomDeep: '#7a4424', far: '#15164a', far2: '#1c1d55', fogc: '#4d4f98', wheat: '#3a3560', wheatHi: '#6a5a8a', line: '#04050f', rail: '#30305a', plat: '#22224a' },
  day: { sky: ['#1d3466', '#7c86b8', '#f2b892'], ground: '#4a4060', ground2: '#2a2240', wall: '#8a7aa0', wall2: '#6a5d86', roof: '#4a3f66', room: '#ffe2b8', roomDeep: '#d89a6a', far: '#7d7aa8', far2: '#9a90b8', fogc: '#f0c4b0', wheat: '#d9a65a', wheatHi: '#ffe0a0', line: '#2a2040', rail: '#5a4a6a', plat: '#7a6a8a' },
};
const ST = { A: [120, 1000], B: [1060, 1900], C: [1950, 2800], D: [2850, 3560] };
// room boxes (world): [x0, y0, x1, y1]
const ROOM_A = [250, 450, 880, GY - 8], ROOM_D = [2900, 430, 3520, GY - 8];

// ---------------------------------------------------------------- static drawing (world coords)
function drawMid(g, mode) {
  const P = PAL[mode], night = mode === 'night', r = prng(night ? 5 : 6), n = vnoise(8);
  // ground
  { const gr = g.createLinearGradient(0, GY - 20, 0, 1500); gr.addColorStop(0, P.ground); gr.addColorStop(1, P.ground2); g.fillStyle = gr; const pts = [[-50, GY]]; for (let x = -50; x <= FW + 50; x += 20) pts.push([x, GY + (n(x * .004, 1) - .5) * 6]); pts.push([FW + 50, 1500], [-50, 1500]); g.beginPath(); roughPath(g, pts, { amp: 1, seed: 2 }); g.fill();
    g.save(); g.clip(); hatch(g, [-50, GY, FW + 100, 700], { angle: -.03, gap: 8, w: 1, col: night ? '#2a2c66' : '#6a5a7a', a: .25, seed: 3, broken: .5 }); g.restore(); }
  // a path running the whole length (it ties the stations into one frieze)
  { const pts = []; for (let x = -50; x <= FW + 50; x += 20) pts.push([x, GY + 34 + Math.sin(x * .002) * 8]); const bot = pts.map(([x, y]) => [x, y + 22]).reverse(); roughPoly(g, [...pts, ...bot], night ? '#191a42' : '#8a7a8a', { amp: 1.5, seed: 9 }); }
  // telegraph poles + wires along the frieze
  { const poles = []; for (let x = 60; x < FW; x += 430 + r() * 60) poles.push(x);
    const ptop = (x) => [x, GY - 330];
    for (let i = 0; i < poles.length - 1; i++) for (const dy of [0, 18]) { const a = ptop(poles[i]), b = ptop(poles[i + 1]); g.strokeStyle = rgba(P.line, .7); g.lineWidth = 1.3; g.beginPath(); for (const [k, p] of sagLine([a[0], a[1] + dy], [b[0], b[1] + dy], 26).entries()) k ? g.lineTo(...p) : g.moveTo(...p); g.stroke(); }
    for (const x of poles) { roughLine(g, [[x, GY + 30], [x, GY - 340]], { w: 7, col: P.line, seed: x | 0 }); roughRect(g, x - 26, GY - 334, 52, 5, P.line, { amp: .4, seed: x | 1 }); } }
  // trees between stations (round crowns, hatched shadow side)
  const tree = (x, h, w) => { roughLine(g, [[x, GY + 4], [x + 3, GY - h * .55]], { w: w * .09, col: P.line, seed: x | 0 });
    for (let k = 0; k < 6; k++) { const bx = x + (r() - .5) * w * .7, by = GY - h * .6 - r() * h * .4, br = w * (.25 + r() * .2); g.fillStyle = shade(night ? '#141638' : '#4a5a6a', (r() - .5) * .03); g.beginPath(); roughPath(g, Array.from({ length: 22 }, (_, i) => { const a = i / 22 * 6.283; return [bx + Math.cos(a) * br, by + Math.sin(a) * br * .8]; }), { amp: 3, step: 8, seed: k + (x | 0) }); g.fill(); } };
  for (const x of [1020, 1930, 2830, 3570]) tree(x, 300 + r() * 80, 170);
  for (const x of [40, 1010]) tree(x, 240, 120);

  // ---- A · hospital
  { const [x0, x1] = [120, 1000], top = 300; roughRect(g, x0, top, x1 - x0, GY - top, P.wall, { amp: 1, seed: 11 }); roughRect(g, x0 - 10, top - 14, x1 - x0 + 20, 16, P.roof, { amp: .6, seed: 12 });
    // a small red cross sign on the roof edge (soft, not a logo)
    roughRect(g, 900, top - 70, 40, 12, night ? '#b84a4a' : '#c45a5a', { amp: .3, seed: 13 }); roughRect(g, 914, top - 84, 12, 40, night ? '#b84a4a' : '#c45a5a', { amp: .3, seed: 14 });
    // upper floor windows
    for (let i = 0; i < 6; i++) { const wx = 160 + i * 140, on = night ? (i % 3 === 1 ? 1 : .08) : .2; roughRect(g, wx, 340, 70, 70, mixHex(P.wall2, night ? '#ffcf8a' : '#cfe0f0', on), { amp: .4, seed: 20 + i }); }
    hatch(g, [x0, top, 90, GY - top], { angle: .8, gap: 6, w: 1, col: P.line, a: .3, seed: 15 });
    roomBox(g, ROOM_A, P, night, 'A');
    // bed, IV pole, monitor, chair
    const [rx0, ry0, rx1, ry1] = ROOM_A;
    roughRect(g, 420, ry1 - 78, 250, 16, night ? '#3a3a6a' : '#b0a0b8', { amp: .5, seed: 30 });   // mattress base
    roughRect(g, 425, ry1 - 62, 6, 62, P.line, { amp: .3, seed: 31 }); roughRect(g, 660, ry1 - 62, 6, 62, P.line, { amp: .3, seed: 32 });
    roughRect(g, 410, ry1 - 120, 10, 120, P.line, { amp: .3, seed: 33 });   // headboard
    roughLine(g, [[730, ry1], [728, ry1 - 230]], { w: 3.5, col: P.line, seed: 34 }); roughRect(g, 714, ry1 - 232, 26, 34, night ? '#5a6a90' : '#d0e0ee', { amp: .3, seed: 35 });
    roughRect(g, 790, ry1 - 220, 70, 48, '#0a0b1e', { amp: .3, seed: 36 });   // monitor housing
  }
  // ---- B · platform + canopy + lamp
  { const [x0, x1] = ST.B;
    roughRect(g, x0, GY - 10, x1 - x0, 18, P.rail, { amp: .5, seed: 40 }); for (let x = x0; x < x1; x += 22) roughRect(g, x, GY + 6, 12, 5, P.line, { amp: .2, seed: x });
    g.fillStyle = rgba(P.line, .9); g.fillRect(x0, GY - 2, x1 - x0, 2.5);
    // canopy behind the train: posts and roof
    for (let x = x0 + 40; x < x1; x += 190) roughLine(g, [[x, GY - 10], [x, GY - 330]], { w: 7, col: shade(P.wall2, -.06), seed: x | 0 });
    roughPoly(g, [[x0 - 20, GY - 330], [x1 + 20, GY - 330], [x1, GY - 360], [x0, GY - 360]], P.roof, { amp: .8, seed: 41 });
    hatch(g, [x0, GY - 360, x1 - x0, 30], { angle: .6, gap: 5, w: 1, col: P.line, a: .4, seed: 42 });
    // station sign (no text, just a board)
    roughRect(g, 1420, GY - 300, 140, 34, night ? '#24305a' : '#4a5a8a', { amp: .4, seed: 43 }); roughRect(g, 1430, GY - 292, 120, 4, rgba('#ffffff', .4), { amp: .2, seed: 44 });
  }
  // ---- C · wheat field rows (back part static; front stalks animate)
  { const [x0, x1] = ST.C; const rr = prng(50);
    for (let row = 0; row < 7; row++) { const y = GY - 70 + row * 14; roughPoly(g, [[x0 - 30, y + 10], [x0, y - 12], [x1, y - 12], [x1 + 30, y + 10]], mixHex(P.wheat, P.ground, .25 + row * .05), { amp: 2, seed: 51 + row }); }
    g.save(); g.beginPath(); g.rect(x0 - 30, GY - 100, x1 - x0 + 60, 110); g.clip();
    for (let i = 0; i < 2600; i++) { const x = x0 - 20 + rr() * (x1 - x0 + 40), y = GY - 80 + rr() * 90, l = 8 + rr() * 16; g.strokeStyle = rr() < .35 ? P.wheatHi : shade(P.wheat, -.08); g.globalAlpha = .35 + .4 * rr(); g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rr() - .3) * 4, y - l); g.stroke(); }
    g.restore(); g.globalAlpha = 1;
    roughRect(g, 2420, GY - 36, 70, 40, night ? '#3a2a30' : '#a0683a', { amp: .6, seed: 55 });   // crate
    roughRect(g, 2500, GY - 30, 60, 34, night ? '#33262e' : '#8a5a34', { amp: .6, seed: 56 });
  }
  // ---- D · warehouse with shelves, packing table, call desk
  { const top = 360; roughRect(g, 2860, top, 680, GY - top, P.wall, { amp: 1, seed: 60 }); roughPoly(g, [[2840, top + 4], [3200, top - 90], [3560, top + 4]], P.roof, { amp: 1, seed: 61 });
    roomBox(g, ROOM_D, P, night, 'D');
    const [rx0, ry0, rx1, ry1] = ROOM_D, rr = prng(62);
    for (let s = 0; s < 3; s++) { const y = ry0 + 70 + s * 85; roughRect(g, rx0 + 20, y, 300, 6, P.line, { amp: .3, seed: 63 + s });
      for (let k = 0; k < 7; k++) { const w = 26 + rr() * 16, h = 22 + rr() * 30; roughRect(g, rx0 + 30 + k * 41, y - h, w, h, mixHex(night ? '#8a5a3a' : '#c48a54', night ? '#5a3a2a' : '#a06a3a', rr()), { amp: .4, seed: k + s * 9 }); } }
    roughRect(g, rx0 + 18, ry0 + 60, 6, ry1 - ry0 - 60, P.line, { amp: .3, seed: 70 }); roughRect(g, rx0 + 318, ry0 + 60, 6, ry1 - ry0 - 60, P.line, { amp: .3, seed: 71 });
    roughRect(g, 3270, ry1 - 92, 120, 10, P.line, { amp: .3, seed: 72 }); roughRect(g, 3280, ry1 - 82, 6, 82, P.line, { amp: .2, seed: 73 }); roughRect(g, 3380, ry1 - 82, 6, 82, P.line, { amp: .2, seed: 74 });   // packing table
    roughRect(g, 3420, ry1 - 76, 90, 8, P.line, { amp: .3, seed: 75 }); roughRect(g, 3460, ry1 - 120, 46, 34, '#0a0b1e', { amp: .3, seed: 76 }); roughRect(g, 3480, ry1 - 86, 6, 12, P.line, { amp: .2, seed: 77 });   // call desk + screen
    roughRect(g, 3505, ry1 - 68, 6, 68, P.line, { amp: .2, seed: 78 });
  }
  // lamps along the path (amber pools at night, off by day)
  if (night) for (const x of [1010, 1940, 2840]) { roughLine(g, [[x + 40, GY + 30], [x + 40, GY - 160]], { w: 4, col: P.line, seed: x | 0 }); pool(g, x + 40, GY + 40, 150, 26, { col: AMB, a: .35, k: .6, seed: x | 0 }); bloom(g, x + 40, GY - 160, 60, { col: AMB, core: HOT, a: .5, k: .4, seed: x | 0 }); }
}
function roomBox(g, box, P, night, id) {
  const [x0, y0, x1, y1] = box;
  // the room interior: lit warm, deeper toward the back corners; floor plane; back window
  const gr = g.createRadialGradient((x0 + x1) / 2, y0 + 60, 20, (x0 + x1) / 2, y0 + 60, (x1 - x0) * .8); gr.addColorStop(0, P.room); gr.addColorStop(1, P.roomDeep);
  g.fillStyle = gr; g.beginPath(); roughPath(g, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], { amp: 1, seed: id === 'A' ? 80 : 81 }); g.fill();
  g.save(); g.clip();
  g.fillStyle = rgba('#000000', .14); g.fillRect(x0, y1 - 40, x1 - x0, 40);   // floor
  roughPoly(g, [[x0, y1 - 40], [x1, y1 - 40], [x1, y1 - 38], [x0, y1 - 38]], rgba('#000000', .25), { amp: .3, seed: 82 });
  hatch(g, [x0, y0, x1 - x0, y1 - y0], { angle: .7, gap: 7, w: 1, col: P.roomDeep, a: .22, seed: 83, broken: .5 });
  if (id === 'A' && !night) { g.save(); g.globalCompositeOperation = 'screen'; const gr2 = g.createLinearGradient(x0 + 100, y0 + 100, x0 + 420, y1); gr2.addColorStop(0, rgba('#fff6e0', .55)); gr2.addColorStop(1, rgba('#fff6e0', .05)); g.fillStyle = gr2; g.beginPath(); g.moveTo(x0 + 40, y0 + 40); g.lineTo(x0 + 160, y0 + 40); g.lineTo(x0 + 520, y1 - 2); g.lineTo(x0 + 250, y1 - 2); g.closePath(); g.fill(); g.restore(); }
  if (id === 'A') { const wx = x0 + 40, wy = y0 + 40; roughRect(g, wx, wy, 120, 120, night ? '#0e1440' : '#a8c4e8', { amp: .4, seed: 84 }); g.fillStyle = rgba(P.line, .6); g.fillRect(wx + 58, wy, 4, 120); g.fillRect(wx, wy + 58, 120, 4); if (night) { const r = prng(4); for (let i = 0; i < 14; i++) { g.fillStyle = rgba('#e4ecff', .5 * r()); g.fillRect(wx + r() * 120, wy + r() * 120, 1.3, 1.3); } } }
  g.restore();
  // the cut-away edge: wall thickness frames the room
  g.strokeStyle = rgba(P.line, .9); g.lineWidth = 6; g.strokeRect(x0, y0, x1 - x0, y1 - y0);
}
function drawFar(g, mode) {
  const P = PAL[mode], n = vnoise(19), night = mode === 'night', r = prng(20);
  const ridge = (base, amp, f, sd, col) => { const pts = [[0, 1300]]; for (let x = 0; x <= 3600; x += 10) pts.push([x, base - amp * fbm(n, x * f, sd, 4)]); pts.push([3600, 1300]); roughPoly(g, pts, col, { amp: 1, seed: sd }); };
  ridge(640, 170, .0018, 2, P.far);
  // a far town on the ridge: tiny lit windows
  for (let i = 0; i < 70; i++) { const x = 400 + r() * 2800, h = 20 + r() * 50, w = 14 + r() * 26, y = 640 - 40 * fbm(n, x * .0018, 2, 4) + 30; roughRect(g, x, y - h, w, h + 40, P.far2, { amp: .5, seed: i }); if (night && r() < .5) { g.fillStyle = rgba(HOT, .6); g.fillRect(x + w * .3, y - h * .6, 2, 2); } }
  fog(g, { y0: 520, y1: 760, col: P.fogc, a: night ? .3 : .45, seed: 22, cover: .6, soft: .5, k: .35, sx: .002, sy: .03, x1: 3600 });
  ridge(760, 90, .003, 7, shade(P.far, -.03));
}
function sky(mode) {
  return memo('f.sky.' + mode, () => {
    const P = PAL[mode], [c, g] = layer(W, H), gr = g.createLinearGradient(0, 0, 0, H);
    gr.addColorStop(0, P.sky[0]); gr.addColorStop(.55, P.sky[1]); gr.addColorStop(.85, P.sky[2]); gr.addColorStop(1, P.sky[2]); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    if (mode === 'night') { const r = prng(7); for (let i = 0; i < 380; i++) { const m = r(); g.fillStyle = rgba('#e4ecff', .1 + .5 * m * m); g.fillRect(r() * W, Math.pow(r(), 1.4) * 700, m > .95 ? 2 : 1, m > .95 ? 2 : 1); } }
    else { bloom(g, 1500, 760, 700, { col: '#ffb070', core: '#fff1cf', a: .55, k: .35, seed: 3, sy: .55, op: 'screen' });
      g.save(); g.beginPath(); for (const [y, x0, x1, th] of [[380, 700, 1900, 18], [450, 1000, 2000, 10], [300, -100, 800, 14]]) { g.moveTo(x0, y); for (let x = x0; x <= x1; x += 12) g.lineTo(x, y - th * Math.pow(Math.sin(Math.PI * (x - x0) / (x1 - x0)), .6)); for (let x = x1; x >= x0; x -= 12) g.lineTo(x, y + th * .4 * Math.pow(Math.sin(Math.PI * (x - x0) / (x1 - x0)), .8)); g.closePath(); }
      g.fillStyle = rgba('#f0a080', .5); g.fill(); g.clip(); hatch(g, [0, 250, W, 260], { angle: -.015, gap: 4, w: 1.1, col: '#ffd9a4', a: .55, seed: 5, broken: .3 }); g.restore(); }
    return c;
  });
}
// cached layer of a world region at a resolution scale
function midLayer(mode, S, reg = [0, 0, FW, 1500]) {
  return memo(`f.mid.${mode}.${S}.${reg}`, () => { const [c, g] = layer(Math.ceil(reg[2] * S), Math.ceil(reg[3] * S)); g.scale(S, S); g.translate(-reg[0], -reg[1]); drawMid(g, mode); return { c, reg, S }; });
}
function farLayer(mode) { return memo('f.far.' + mode, () => { const [c, g] = layer(3600, 1300); drawFar(g, mode); return c; }); }

// ---------------------------------------------------------------- dynamic parts (world coords; drawn under the camera transform)
// pose library
const POSE = {
  nurseBusy: { lean: .06, head: .3, sh: [.95, .75], el: [.9, .85], hip: [.05, -.05], kn: [0, 0], hair: 'bun' },
  nurseUp: { lean: -.04, head: -.22, sh: [.7, .55], el: [.9, .8], hip: [.05, -.05], kn: [0, 0], hair: 'bun' },
  nurseSit: { lean: .22, head: .3, sh: [1.3, .9], el: [.2, .7], hip: [1.5, 1.42], kn: [1.5, 1.4], hair: 'bun' },
  nurseSitEx: { lean: .14, head: .16, sh: [1.25, .8], el: [.25, .8], hip: [1.5, 1.42], kn: [1.5, 1.4], hair: 'bun' },
  pickBent: { lean: .8, head: .35, sh: [.05, -.1], el: [.15, .2], hip: [.35, .15], kn: [.3, .35], hair: 'cap' },
  pickUp: { lean: -.1, head: -.2, sh: [.35, -.25], el: [.5, .7], hip: [.05, -.05], kn: [0, .05], hair: 'cap' },
  pick2Bent: { lean: .7, head: .4, sh: [.2, .1], el: [.2, .2], hip: [.3, .1], kn: [.25, .3], hair: 'long' },
  pick2Up: { lean: -.06, head: -.15, sh: [.25, -.1], el: [.4, .3], hip: [.05, -.03], kn: [0, .03], hair: 'long' },
  packBent: { lean: .4, head: .4, sh: [1.0, .85], el: [.4, .45], hip: [.1, -.05], kn: [.05, 0], hair: 'short' },
  packUp: { lean: -.06, head: -.2, sh: [.35, .9], el: [.3, 1.5], hip: [.05, -.05], kn: [0, 0], hair: 'short' },
  callSit: { lean: .3, head: .35, sh: [1.15, 1.05], el: [.6, .55], hip: [1.5, 1.5], kn: [1.5, 1.5], hair: 'curly' },
  callUp: { lean: -.12, head: -.15, sh: [.5, .3], el: [1.3, .4], hip: [1.5, 1.5], kn: [1.5, 1.5], hair: 'curly' },
  commTense: { lean: .14, head: .35, sh: [.25, .1], el: [.35, .45], hip: [.05, -.05], kn: [0, 0], hair: 'short' },
  commUp: { lean: -.03, head: -.18, sh: [.12, -.12], el: [.3, .2], hip: [.05, -.05], kn: [0, 0], hair: 'short' },
};
const DR = {
  nurse: { key: 'nurse', dress: { coat: '#4f9a96', pants: '#2f6a70', skin: '#d9a77e', hair: '#2a1a14' } },
  pick1: { key: 'pick1', dress: { coat: '#e59a3a', pants: '#2a2c3a', skin: '#c98f6a', hair: '#2a1a14', hairBack: '#2a1a14' } },
  pick2: { key: 'pick2', dress: { coat: '#c4482a', pants: '#2a2438', skin: '#e9c3a0', hair: '#3a2214' } },
  pack: { key: 'pack', dress: { coat: '#4a6a9a', pants: '#1c2030', skin: '#b07a56', hair: '#1a1210' } },
  call: { key: 'call', dress: { coat: '#9a5a8a', pants: '#2a2034', skin: '#d9a77e', hair: '#1a1210' } },
  comm1: { key: 'comm1', dress: { coat: '#6a7a5a', pants: '#20242a', skin: '#e0b48e', hair: '#3a2a20' } },
  comm2: { key: 'comm2', dress: { coat: '#e59a3a', pants: '#2a2c3a', skin: '#e9c3a0', hair: '#2a1a14' } },
};
function figW(ctx, cam, x, feet, s, pose, d, o = {}) {
  const [sx, sy, z] = toS(cam, x, o.hip ?? feet - 88 * s);
  const lightCol = o.night ? AMB : '#ffe0b0';
  const opts = { ...d, light: { x: sx + (o.lx ?? 400), y: sy - 300, col: lightCol, a: .5 }, rim: o.night ? '#ffcf8a' : '#fff0d0', rimSide: o.flip ? -1 : 1, rimW: 1.6 * s * z, flip: o.flip, shadeA: o.night ? .25 : .1, shadeCol: '#0a0b20' };
  opts.key = d.key + (o.night ? 'n' : 'd') + (o.flip ? 'f' : '');
  if (o.squash && o.squash !== 1) { ctx.save(); const fy = sy + 88 * s * z; ctx.translate(sx, fy); ctx.scale(1, o.squash); ctx.translate(-sx, -fy); const r = fig(ctx, sx, sy, s * z, pose, opts); ctx.restore(); return r; }
  return fig(ctx, sx, sy, s * z, pose, opts);
}
const toS = (cam, x, y) => [W / 2 + (x - cam.x) * cam.z, H / 2 + (y - cam.y) * cam.z, cam.z];
function dot(ctx, cam, x, y, a, { r = 5, col = CY, core = CYW, halo = 26 } = {}) { const [sx, sy, z] = toS(cam, x, y); spot(ctx, sx, sy, halo * z, a * .8, col, core); ctx.fillStyle = rgba(core, a); ctx.beginPath(); ctx.arc(sx, sy, Math.max(1.2, r * .5 * z), 0, 7); ctx.fill(); }

// the train at platform B; x = rear end; returns cab window
function trainB(ctx, cam, x, P, night, t, driverUp, cyanA) {
  const z = cam.z, L = 760, y0 = GY - 200, y1 = GY - 14;
  const S = (wx, wy) => toS(cam, wx, wy);
  const [ax, ay] = S(x, y0), [bx, by] = S(x + L, y1);
  ctx.fillStyle = night ? '#24224a' : '#5a6a9a'; ctx.beginPath(); ctx.roundRect(ax, ay, bx - ax, by - ay, 18 * z); ctx.fill();
  ctx.fillStyle = night ? '#1a1838' : '#3e4a78'; ctx.fillRect(ax, by - 30 * z, bx - ax, 30 * z);
  ctx.fillStyle = rgba(night ? '#a9a7e0' : '#ffffff', .35); ctx.fillRect(ax + 10 * z, ay + 3 * z, bx - ax - 20 * z, 2 * z);
  ctx.fillStyle = night ? '#0d0c22' : '#2a2a48'; ctx.fillRect(ax + (L * .5 - 3) * z, ay, 6 * z, by - ay);   // car joint
  for (let w = 0; w < 8; w++) { const wx = x + 30 + w * 82; if (wx > x + L - 120) break; const [px, py] = S(wx, y0 + 40); ctx.fillStyle = night ? mixHex('#7a4a2a', HOT, .9) : '#cfe0f0'; ctx.beginPath(); ctx.roundRect(px, py, 56 * z, 54 * z, 6 * z); ctx.fill(); if (w % 2) { ctx.fillStyle = rgba('#2a1a22', .6); ctx.beginPath(); ctx.ellipse(px + 28 * z, py + 30 * z, 9 * z, 11 * z, 0, 0, 7); ctx.fill(); } }
  // cab window + driver silhouette (head lifts)
  const [cx, cy] = S(x + L - 100, y0 + 34); ctx.fillStyle = night ? HOT : '#e8f0f8'; ctx.beginPath(); ctx.roundRect(cx, cy, 84 * z, 64 * z, 8 * z); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.rect(cx, cy, 84 * z, 64 * z); ctx.clip();
  const hy = cy + mix(42, 26, driverUp) * z, hx = cx + 40 * z; ctx.fillStyle = '#1a1424'; ctx.beginPath(); ctx.ellipse(hx, hy, 11 * z, 13 * z, mix(.4, 0, driverUp), 0, 7); ctx.fill(); ctx.fillRect(hx - 20 * z, hy + 12 * z, 40 * z, 40 * z); ctx.restore();
  // nose + headlight
  const [nx, ny] = S(x + L, y0 + 120); spot(ctx, nx, ny, 50 * z, night ? .8 : .3, AMB, HOT);
  for (let k = 0; k < 6; k++) { const [wx, wy] = S(x + 60 + k * 125, y1 - 2); ctx.fillStyle = '#0a0a1a'; ctx.beginPath(); ctx.arc(wx, wy, 13 * z, 0, 7); ctx.fill(); ctx.strokeStyle = rgba('#8a8ab0', .5); ctx.lineWidth = 1.2 * z; ctx.beginPath(); const a = x * .05; ctx.moveTo(wx + Math.cos(a) * 11 * z, wy + Math.sin(a) * 11 * z); ctx.lineTo(wx - Math.cos(a) * 11 * z, wy - Math.sin(a) * 11 * z); ctx.stroke(); }
  if (cyanA > 0) dot(ctx, cam, x + L - 60, y0 + 70, cyanA, { r: 7 });
  if (night) { const g = ctx.createLinearGradient(0, by, 0, by + 60 * z); g.addColorStop(0, rgba(AMB, .2)); g.addColorStop(1, rgba(AMB, 0)); ctx.fillStyle = g; ctx.fillRect(ax, by, bx - ax, 60 * z); }
}
// patient in bed (custom: head on pillow, blanket, arm on the blanket), returns hand position (world)
function patient(ctx, cam, night, t, breath) {
  const S = (x, y) => toS(cam, x, y), z = cam.z, by = GY - 8 - 78;
  const [px, py] = S(445, by - 18); ctx.fillStyle = night ? '#c8c8e0' : '#ffffff'; ctx.beginPath(); ctx.ellipse(px, py, 34 * z, 13 * z, -.05, 0, 7); ctx.fill();   // pillow
  const [hx, hy] = S(458, by - 26); ctx.fillStyle = '#d9b08e'; ctx.beginPath(); ctx.ellipse(hx, hy, 12 * z, 14 * z, -.3, 0, 7); ctx.fill(); ctx.fillStyle = '#c9c2b6'; ctx.beginPath(); ctx.ellipse(hx - 4 * z, hy - 3 * z, 11 * z, 11 * z, -.3, Math.PI * .7, Math.PI * 1.9); ctx.fill();
  // blanket hump (breathes)
  const b = 1 + .03 * breath; ctx.fillStyle = night ? '#4a5a8a' : '#8fb0d8'; ctx.beginPath(); const [ax, ay] = S(470, by), [bx2, by2] = S(668, by);
  ctx.moveTo(ax, ay); ctx.bezierCurveTo(ax + 30 * z, ay - 36 * z * b, bx2 - 90 * z, ay - 30 * z * b, bx2, by2 - 6 * z); ctx.lineTo(bx2, by2 + 4 * z); ctx.lineTo(ax, ay + 4 * z); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba('#000000', .15); ctx.lineWidth = 1.2 * z; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(ax + k * 40 * z, ay - 18 * z * b); ctx.quadraticCurveTo(ax + k * 40 * z + 20 * z, ay - 6 * z, ax + k * 40 * z + 10 * z, ay + 2 * z); ctx.stroke(); }
  // arm resting on the blanket, hand toward the chair side
  ctx.fillStyle = '#d9b08e'; ctx.lineCap = 'round'; ctx.strokeStyle = '#e8e4f0'; ctx.lineWidth = 11 * z; const [s0x, s0y] = S(510, by - 22), [h0x, h0y] = S(628, by - 22 - 3 * breath);
  ctx.beginPath(); ctx.moveTo(s0x, s0y); ctx.lineTo(h0x, h0y); ctx.stroke(); ctx.beginPath(); ctx.ellipse(h0x + 6 * z, h0y, 7 * z, 5 * z, 0, 0, 7); ctx.fill();
  return [634, by - 22];
}

// ---------------------------------------------------------------- draw the frieze for a camera
// st: { mode, cam, t, cyan (0..1 night intensity), tLift (time heads lift), ex (exhale 0..1 per x fn), warm, trainX, wind, nurseSit }
export function frieze(ctx, st) {
  const { mode, cam, t } = st, night = mode === 'night', P = PAL[mode];
  ctx.drawImage(sky(mode), 0, drift(t, 4, 9) - (cam.y - 560) * .05);
  // far layer (p .35 on position, half the zoom change)
  { const zf = 1 + (cam.z - 1) * .5, fx = 960 + (cam.x - 960) * .3, fy = 650 + (cam.y - 560) * .4; ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(zf, zf); ctx.translate(-fx, -fy); ctx.drawImage(farLayer(mode), -480, 0); ctx.restore(); }
  // mid layer: pick the cached resolution that fits the zoom
  const hi = st.hiA && cam.z > 1.25;
  const L = hi ? midLayer(mode, 2.2, [40, 250, 1000, 720]) : midLayer(mode, cam.z < .8 ? .6 : 1);
  { const [x0, y0, w, h] = L.reg; const [sx, sy] = toS(cam, x0, y0); ctx.drawImage(L.c, sx, sy, w * cam.z, h * cam.z); }
  if (hi && st.blendLo) { const L2 = midLayer(mode, 1), [sx, sy] = toS(cam, 0, 0); ctx.save(); ctx.globalAlpha = st.blendLo; ctx.drawImage(L2.c, sx, sy, FW * cam.z, 1500 * cam.z); ctx.restore(); }
  const ex = st.ex || (() => 0), cyan = st.cyan || 0, lift = st.lift || (() => 0);
  const br = (ph, f = 1.2) => Math.sin(t * f * 2 + ph);

  // ---- A · ward
  { const [sx0, sy0] = toS(cam, ROOM_A[0], ROOM_A[1]), [sx1, sy1] = toS(cam, ROOM_A[2], ROOM_A[3]);
    if (sx1 > -50 && sx0 < W + 50) {
      ctx.save(); ctx.beginPath(); ctx.rect(sx0, sy0, sx1 - sx0, sy1 - sy0); ctx.clip();
      // monitor screen (cyan at night: the machine watches the numbers)
      { const [mx, my] = toS(cam, 794, GY - 8 - 216), z = cam.z; ctx.fillStyle = night ? mixHex('#1a2a4a', CY, .5 + .5 * cyan) : '#2a4a5a'; ctx.fillRect(mx, my, 62 * z, 40 * z);
        ctx.strokeStyle = night ? CYW : '#8fe6ff'; ctx.lineWidth = 1.5 * z; ctx.beginPath(); for (let k = 0; k <= 30; k++) { const u = k / 30, beat = ((u * 3 + t * .9) % 1); const v = beat > .45 && beat < .55 ? Math.sin((beat - .45) * 31.4) * 12 : 0; ctx.lineTo(mx + 4 * z + u * 54 * z, my + 22 * z - v * z); } ctx.stroke();
        if (night) spot(ctx, mx + 31 * z, my + 20 * z, 90 * z, .35 + .3 * cyan, CY, CYW); }
      const hand = patient(ctx, cam, night, t, br(0, .9));
      if (st.nurseSit) {
        const e = ex(500), P0 = lerpPose(POSE.nurseSit, POSE.nurseSitEx, e), b = br(1, .8) * .015;
        const chair = toS(cam, 706, GY - 8); ctx.fillStyle = P.line; const z = cam.z; ctx.fillRect(chair[0] - 26 * z, chair[1] - 60 * z, 56 * z, 7 * z); ctx.fillRect(chair[0] + 24 * z, chair[1] - 120 * z, 6 * z, 120 * z); ctx.fillRect(chair[0] - 24 * z, chair[1] - 60 * z, 5 * z, 60 * z);
        figW(ctx, cam, 712, 0, 1.02, { ...P0, lean: P0.lean + b, head: P0.head + br(2, .5) * .03 }, DR.nurse, { night, flip: true, lx: -500, hip: GY - 8 - 66 });
      } else {
        const l = lift(500), P0 = lerpPose(POSE.nurseBusy, POSE.nurseUp, l);
        figW(ctx, cam, 760, GY - 8, 1.02, { ...P0, head: P0.head + br(2) * .02 }, DR.nurse, { night, lx: 400 });
      }
      ctx.restore();
      if (night && cyan > 0) { for (let k = 0; k < 2; k++) { const a = t * 1.3 + k * 3.1; dot(ctx, cam, 760 + Math.cos(a) * 40, GY - 210 + Math.sin(a * 1.3) * 26, cyan * (k ? .7 : 1)); } }
      // room light spill onto the ground in front
      if (night) { const [cx, cy] = toS(cam, 560, GY + 30); spot(ctx, cx, cy, 380 * cam.z, .25, AMB, HOT, { sy: .2 }); }
    } }
  // ---- B · train + commuters
  { const [sx0] = toS(cam, ST.B[0] - 200, 0), [sx1] = toS(cam, ST.B[1] + 200, 0);
    if (sx1 > 0 && sx0 < W) {
      trainB(ctx, cam, st.trainX ?? 1110, P, night, t, night ? lift(1500) : ex(1500), night ? cyan : .5 * (st.dayCyan || 0));
      const e1 = night ? lift(1300) : ex(1300), e2 = night ? lift(1420) : ex(1420);
      figW(ctx, cam, 1250, GY + 6, .98, { ...lerpPose(POSE.commTense, POSE.commUp, e1), head: mix(.35, -.18, e1) + br(4) * .02 }, DR.comm1, { night, squash: mix(1, .985, e1 * (night ? 0 : 1)) });
      figW(ctx, cam, 1390, GY + 10, .94, { ...lerpPose(POSE.commTense, POSE.commUp, e2), hair: 'long', sh: [mix(.9, .3, e2), mix(.8, .1, e2)], el: [mix(.9, .3, e2), mix(.8, .2, e2)] }, DR.comm2, { night, flip: true, lx: -400 });
      if (night) { const [lx, ly] = toS(cam, 1700, GY - 300); spot(ctx, lx, ly, 120 * cam.z, .5, AMB, HOT); }
    } }
  // ---- C · harvest
  { const [sx0] = toS(cam, ST.C[0] - 100, 0), [sx1] = toS(cam, ST.C[1] + 100, 0);
    if (sx1 > 0 && sx0 < W) {
      // night: a line of cyan points sweeps the rows; behind it the wheat is cut (darker stubble)
      if (night && cyan > 0) {
        const sweep = mix(ST.C[0], ST.C[1], clamp(st.sweep ?? cyan));
        const [ax, ay] = toS(cam, ST.C[0] - 30, GY - 84), [bx, by] = toS(cam, sweep, GY + 10); ctx.fillStyle = rgba('#141236', .55); ctx.fillRect(ax, ay, bx - ax, by - ay);
        for (let k = 0; k < 7; k++) dot(ctx, cam, sweep + Math.sin(t * 3 + k) * 6, GY - 70 + k * 13, cyan, { r: 5, halo: 20 });
      }
      const e1 = night ? lift(2200) : ex(2200), e2 = night ? lift(2560) : ex(2560);
      figW(ctx, cam, 2200, GY - 4, 1.0, { ...lerpPose(POSE.pickBent, POSE.pickUp, e1), lean: mix(.8, -.1, e1) + br(5, 1.6) * .03 * (1 - e1) }, DR.pick1, { night });
      figW(ctx, cam, 2600, GY + 2, .96, { ...lerpPose(POSE.pick2Bent, POSE.pick2Up, e2), lean: mix(.7, -.06, e2) + br(6, 1.4) * .03 * (1 - e2) }, DR.pick2, { night, flip: true, lx: -400 });
      // front stalks: wind wave (st.wind = gust front x, or none)
      wheatFront(ctx, cam, t, P, st.wind);
    } }
  // ---- D · warehouse
  { const [sx0, sy0] = toS(cam, ROOM_D[0], ROOM_D[1]), [sx1, sy1] = toS(cam, ROOM_D[2], ROOM_D[3]);
    if (sx1 > -50 && sx0 < W + 50) {
      ctx.save(); ctx.beginPath(); ctx.rect(sx0, sy0, sx1 - sx0, sy1 - sy0); ctx.clip();
      // call screen
      { const [mx, my] = toS(cam, 3462, GY - 8 - 118), z = cam.z; ctx.fillStyle = night ? mixHex('#1a2a4a', CY, .3 + .5 * cyan) : '#3a5a6a'; ctx.fillRect(mx, my, 42 * z, 30 * z); if (night) spot(ctx, mx + 20 * z, my + 15 * z, 70 * z, .3 + .3 * cyan, CY, CYW); }
      const e1 = night ? lift(3330) : ex(3330), e2 = night ? lift(3440) : ex(3440);
      figW(ctx, cam, 3320, GY - 8, 1.0, { ...lerpPose(POSE.packBent, POSE.packUp, e1), head: mix(.4, -.2, e1) + br(7) * .02 }, DR.pack, { night });
      figW(ctx, cam, 3450, GY - 8 - 40, .98, { ...lerpPose(POSE.callSit, POSE.callUp, e2), head: mix(.35, -.15, e2) + br(8) * .02 }, DR.call, { night, flip: true, lx: -400 });
      // cyan points carry parcels from the shelves to the table (arcs)
      const ca = night ? cyan : (st.dayCyan || 0) * .7;
      if (ca > 0) for (let k = 0; k < 5; k++) { const ph = ((t * .45 + k / 5) % 1), go = ph < .5, u = go ? ph * 2 : (1 - ph) * 2, e = sm(u);
        const ax = 2960 + k * 55, ay = ROOM_D[1] + 70 + (k % 3) * 85 - 14, bx = 3300 + (k % 2) * 40, by = GY - 108;
        const x = mix(ax, bx, e), y = mix(ay, by, e) - Math.sin(Math.PI * e) * 70;
        if (go) { const [px, py] = toS(cam, x - 12, y + 6); ctx.fillStyle = night ? '#8a5a3a' : '#c48a54'; ctx.fillRect(px, py, 24 * cam.z, 18 * cam.z); }
        dot(ctx, cam, x, y, ca * (k < 2 + cyan * 3 || !night ? 1 : 0)); }
      ctx.restore();
      if (night) { const [cx, cy] = toS(cam, 3200, GY + 30); spot(ctx, cx, cy, 380 * cam.z, .22, AMB, HOT, { sy: .2 }); }
    } }
}
function nearLayer(mode) {
  return memo('f.near.' + mode, () => {
    const NW = Math.ceil(FW * 1.35) + 400, [c, g] = layer(NW, 420), r = prng(mode === 'night' ? 91 : 92), n = vnoise(93), night = mode === 'night';
    const col = night ? '#04050f' : '#2a2038';
    // tall grass, reeds and a broken fence: silhouettes
    const pts = [[0, 420]]; for (let x = 0; x <= NW; x += 8) pts.push([x, 250 + 60 * fbm(n, x * .004, 1, 4)]); pts.push([NW, 420]); roughPoly(g, pts, col, { amp: 2, seed: 2 });
    g.strokeStyle = col; g.lineCap = 'round';
    for (let i = 0; i < 2600; i++) { const x = r() * NW, y0 = 250 + 60 * fbm(n, x * .004, 1, 4) + 6, l = 20 + r() * 90 * (n(x * .01, 3) > .5 ? 1 : .4); g.lineWidth = 1 + r() * 2; g.beginPath(); g.moveTo(x, y0); g.quadraticCurveTo(x + (r() - .5) * 10, y0 - l * .5, x + (r() - .4) * 24, y0 - l); g.stroke(); }
    for (let x = 300; x < NW; x += 900 + r() * 700) { for (let k = 0; k < 4; k++) roughLine(g, [[x + k * 90, 300], [x + k * 90 + (r() - .5) * 8, 180 - r() * 30]], { w: 7, col, seed: x + k }); roughLine(g, [[x - 10, 210], [x + 290, 220 + (r() - .5) * 20]], { w: 4, col, seed: x | 7 }); }
    return c;
  });
}
function wheatFront(ctx, cam, t, P, wind) {
  const r = prng(77), z = cam.z;
  ctx.save(); ctx.lineCap = 'round';
  for (let i = 0; i < 260; i++) {
    const x = ST.C[0] - 20 + r() * (ST.C[1] - ST.C[0] + 40), y = GY + 12 + r() * 30, l = 26 + r() * 22, ph = r() * 6;
    let bend = Math.sin(t * 1.3 + x * .01 + ph) * .06;
    if (wind !== undefined && wind !== null) { const d = (wind - x) / 220; bend += .55 * Math.exp(-d * d) + (d > 0 ? .12 * Math.exp(-d * .6) : 0); }
    const [sx, sy] = toS(cam, x, y), tx = sx + Math.sin(bend) * l * z, ty = sy - Math.cos(bend) * l * z;
    ctx.strokeStyle = r() < .4 ? P.wheatHi : P.wheat; ctx.globalAlpha = .7; ctx.lineWidth = 1.3 * z; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(sx, sy - l * z * .5, tx, ty); ctx.stroke();
    ctx.fillStyle = P.wheatHi; ctx.beginPath(); ctx.ellipse(tx, ty, 2 * z, 5 * z, bend, 0, 7); ctx.fill();
  }
  ctx.restore();
}
export function nearFG(ctx, cam, mode, t) {
  const p = 1.35, z = 1 + (cam.z - 1) * 1.15, c = nearLayer(mode);
  const sx = W / 2 + (0 - cam.x * p) * z + 200, sy = H / 2 + (GY + 50 - cam.y) * cam.z - 250 * z;
  ctx.drawImage(c, sx, sy, c.width * z, c.height * z);
  const yb = sy + c.height * z - 2; if (yb < H) { ctx.fillStyle = mode === 'night' ? '#04050f' : '#2a2038'; ctx.fillRect(0, yb, W, H - yb); }
}
export { POSE, PAL, ST, ROOM_A };
