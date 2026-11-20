// A2 · the possibilities street — art upgrade test.
// Standing at the top of a steep street that falls toward the lower town and the sea (a1 move). Cornices stay level
// (they run to the horizon VP), the street runs to a lower VP, so the houses step down the hill.
// ONE hero light: the carpenter's workshop window (right), an old man teaching a child to plane wood; its light
// spills across the cobbles. Smaller warm notes down the street: a violinist on a balcony, a potter's window,
// a sign painter on a ladder. Walker in an amber coat stops to look in.
import { soften } from './art.mjs';
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, layer, put, stipple, maskLinear, maskRadial, roughPath, roughPoly, roughRect, roughLine, sagLine, hatch, strokes, fog, cone, pool, bloom, house, person, castShadow, printFinish, vnoise, facade, quadMap, quadIn } from './art.mjs';
import { text, save } from './lib.mjs';

const HZ = 455, HVP = [1010, HZ], SVP = [1010, 650];      // horizon vanishing point, street vanishing point (below: the street dives)
const S = (t, side) => [SVP[0] + ((side < 0 ? -80 : 2100) - SVP[0]) * t, SVP[1] + (1150 - SVP[1]) * t];   // street edge (house line)
const towardH = (p, x) => [x, p[1] + (HVP[1] - p[1]) * (x - p[0]) / (HVP[0] - p[0])];   // level line through p, evaluated at x
const WARM = '#ffb35c', HOT = '#ffd9a0', RED = '#ff7a3c';
const n1 = vnoise(9);

function row(ctx, r, side, ts, hs, walls, opts = {}) {
  const out = [];
  for (let i = 0; i < ts.length - 1; i++) {
    const ta = ts[i], tb = ts[i + 1], A = S(ta, side), B = S(tb, side), h = hs[i];
    const topA = [A[0], A[1] - h * ta], topB = towardH(topA, B[0]), floorB = towardH(A, B[0]);
    const q = [topB, topA, A, floorB];   // u=0 far, u=1 near
    const wall = walls[i % walls.length];
    // foundation step where the street falls away under the level floor
    roughPoly(ctx, [floorB, A, B], shade(wall, -.035), { amp: .6, seed: i + 50 });
    const floors = Math.max(2, Math.round(h / 200 + r() * .8)), cols = Math.max(2, Math.round((Math.abs(A[0] - B[0]) / ta) / (110 + r() * 50)));
    const fogA = Math.pow(clamp(1 - ta / .9), 1.8) * .6;
    const m = facade(ctx, r, q, { wall, floors, cols, top: .1 + r() * .04, bottom: .95, ww: .3 + r() * .12, wh: .48 + r() * .14, lit: opts.lit ? (f, c, rr) => opts.lit(i, f, c, rr) : () => 0, winOn: opts.winOn, skip: .08, amp: 1.5, bays: .3, trimCol: shade(wall, .028),
      shade: [[0, rgba('#9fc4c8', opts.farLight ?? .05)], [1, rgba('#000000', .12)]], fogA, fogCol: '#6f9da1', edgeLight: rgba('#9fc4c8', .12) });
    // roof furniture: parapet steps, chimneys, a water tank — breaks the skyline, never twice the same
    const nF = Math.floor(r() * 3);
    for (let k = 0; k < nF; k++) { const u = .15 + r() * .7, [x, y] = m(u, 0), cw = (14 + r() * 26) * ta, ch = (20 + r() * 60) * ta; roughRect(ctx, x - cw / 2, y - ch, cw, ch + 2, shade(wall, -.02), { amp: .8, seed: i * 7 + k }); }
    if (r() < .5) { const [x, y] = m(.5 + (r() - .5) * .4, 0), pw = (60 + r() * 80) * ta, ph = (16 + r() * 22) * ta; roughRect(ctx, x - pw / 2, y - ph, pw, ph + 2, wall, { amp: .8, seed: i * 3 }); }
    out.push({ m, q, ta, tb, A, B, wall });
  }
  return out;
}

export function frame(out) {
  const [cv, ctx] = layer();
  const r = prng(17);
  // ---- sky: ink → petrol → pale teal at the horizon, high hatched cloud bars
  { const g = ctx.createLinearGradient(0, 0, 0, HZ); g.addColorStop(0, '#060f17'); g.addColorStop(.5, '#10283a'); g.addColorStop(.88, '#34666c'); g.addColorStop(1, '#6a9c9c'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HZ + 2); }
  { const rr = prng(3); for (let i = 0; i < 160; i++) { const x = rr() * W, y = Math.pow(rr(), 1.7) * 300, m = rr(); ctx.fillStyle = rgba('#d9f0ee', (.12 + .5 * m * m)); const s = m > .95 ? 2 : 1; ctx.fillRect(x, y, s, s); } }
  fog(ctx, { y0: 300, y1: HZ + 10, col: '#6f9da1', a: .35, seed: 61, cover: .6, soft: .5, k: .2, sx: .003, sy: .02, edgeTop: .8, edgeBot: .1 });
  // ---- the sea + far shore, the lower town tumbling toward it (in fog, cold, a few warm windows)
  { const g = ctx.createLinearGradient(0, HZ, 0, 720); g.addColorStop(0, '#3f6e74'); g.addColorStop(1, '#16303a'); ctx.fillStyle = g; ctx.fillRect(0, HZ, W, 300); }
  // far shore with the Maslow hill, tiny, base lit — continuity with A1
  roughPoly(ctx, [[1180, HZ + 2], [1320, HZ - 14], [1400, HZ - 10], [1520, HZ - 22], [1700, HZ - 6], [1800, HZ + 2]], '#2c5058', { amp: 1, seed: 2 });
  roughPoly(ctx, [[1420, HZ + 2], [1478, HZ - 64], [1490, HZ - 66], [1556, HZ + 2]], '#2a4a54', { amp: .8, seed: 3 });
  for (let i = 0; i < 9; i++) { ctx.fillStyle = rgba(HOT, .8); ctx.fillRect(1440 + i * 11 + (i % 3), HZ - 6 - (i % 2) * 3, 2, 2); }
  bloom(ctx, 1488, HZ - 4, 60, { a: .35, sy: .4, k: .2, seed: 4 });
  for (let i = 0; i < 40; i++) { const y = HZ + 6 + r() * 60, x = 300 + r() * 1400; ctx.fillStyle = rgba('#a9cfcf', .12 + .15 * r()); ctx.fillRect(x, y, 20 + r() * 80, 1.2); }
  // lower town: three depths of rooftops below the street's end, each fogged more
  const lowerTown = (y0, y1, s, col, seed, litP) => { const rr = prng(seed); let x = 340 + rr() * 30;
    while (x < 1700) { const w = (40 + rr() * 60) * s, gy = y1 - rr() * 18 * s + Math.abs(x - 1010) * .03; const h = (40 + rr() * 70) * s;
      house(ctx, rr, x + w / 2, gy + (y1 - y0), w, h + (y1 - y0), { wall: mixHex(col, shade(col, -.03), rr()), lit: (wx, wy, q) => q() < litP ? .8 : 0, side: 0, amp: .6, floorH: 22 * s + 6, colW: 22 * s + 6, trim: false, door: false, chimney: .3, roofs: ['gable', 'flat', 'hip', 'gable', 'steep', 'parapet'] });
      x += w + rr() * 4; } };
  lowerTown(500, 520, .55, '#28474f', 31, .05);
  fog(ctx, { y0: 460, y1: 600, col: '#86b4b2', a: .7, seed: 6, cover: .75, soft: .4, k: .2, sx: .005, sy: .03, edgeTop: .3, edgeBot: .5 });
  lowerTown(560, 590, .8, '#1d3640', 32, .08);
  fog(ctx, { y0: 540, y1: 690, col: '#73a3a4', a: .6, seed: 7, cover: .7, soft: .4, k: .2, sx: .005, sy: .03, edgeTop: .4, edgeBot: .4 });
  lowerTown(630, 680, 1.05, '#142830', 33, .1);

  // ---- street + sidewalks (cobbles as converging hatch), the street dives toward SVP
  const curbL = (t) => [SVP[0] + (330 - SVP[0]) * t, SVP[1] + (1150 - SVP[1]) * t], curbR = (t) => [SVP[0] + (1700 - SVP[0]) * t, SVP[1] + (1150 - SVP[1]) * t];
  roughPoly(ctx, [S(.07, -1), S(1.2, -1), S(1.2, 1), S(.07, 1)], '#121c24', { amp: 1, seed: 8 });
  roughPoly(ctx, [curbL(.07), curbL(1.2), curbR(1.2), curbR(.07)], '#17242c', { amp: 1, seed: 9 });
  { const [sc, sx] = layer(); sx.strokeStyle = '#5d8088'; sx.lineWidth = 1;
    for (let i = 0; i < 26; i++) { const t0 = .1, q = i / 25, a = curbL(1.2), b = curbR(1.2), p0 = [mix(a[0], b[0], q), a[1]]; sx.globalAlpha = .05; sx.beginPath(); sx.moveTo(p0[0], p0[1]); sx.lineTo(mix(p0[0], SVP[0], .9), mix(p0[1], SVP[1], .9)); sx.stroke(); }
    for (let k = 0; k < 60; k++) { const t = Math.pow(k / 60, 1.6) * 1.2 + .08, a = curbL(t), b = curbR(t); sx.globalAlpha = .06 + .05 * (k % 2); sx.beginPath(); let pen = false; for (let q = 0; q <= 1; q += .03) { if (n1(q * 14, k * 3) < .35) { pen = false; continue; } const X = mix(a[0], b[0], q), Y = a[1] + (n1(q * 9, k) - .5) * 4 * t; pen ? sx.lineTo(X, Y) : sx.moveTo(X, Y); pen = true; } sx.stroke(); }
    maskLinear(sc, 0, 650, 0, 1080, [[0, 0], [.3, .7], [1, 1]]); put(ctx, sc); }
  // curb lines
  for (const cf of [curbL, curbR]) roughLine(ctx, [cf(.07), cf(1.2)], { w: 2, col: rgba('#86a8ac', .3), seed: 4 });
  // the left sidewalk is stepped (a steep street): riser lines, lighter tread edges, a handrail
  for (let k = 0; k < 26; k++) { const t = .12 + Math.pow(k / 25, 1.5) * 1.1, a = S(t, -1), b = curbL(t); ctx.strokeStyle = rgba('#86a8ac', .22); ctx.lineWidth = 1 + t * 1.5; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.strokeStyle = rgba('#000000', .35); ctx.beginPath(); ctx.moveTo(a[0], a[1] + 2 + 4 * t); ctx.lineTo(b[0], b[1] + 2 + 4 * t); ctx.stroke(); }
  { const rail = [], posts = []; for (let k = 0; k <= 20; k++) { const t = .14 + k / 20 * 1.0, b = curbL(t); rail.push([b[0] - 22 * t, b[1] - 120 * t]); if (k % 3 === 0) posts.push([[b[0] - 22 * t, b[1] - 4 * t], [b[0] - 22 * t, b[1] - 120 * t], t]); }
    roughLine(ctx, rail, { w: 3, col: '#070d12', seed: 5 }); for (const [a, b, t] of posts) roughLine(ctx, [a, b], { w: 2 + 4 * t, col: '#070d12', seed: t * 100 }); }

  // ---- left row: tall houses stepping down the hill
  const L = row(ctx, r, -1, [1.25, .9, .62, .44, .32, .24, .175, .13, .1], [880, 1000, 760, 900, 820, 900, 820, 860],
    ['#0a1218', '#0f1a20', '#0e171e', '#152027', '#132028', '#1a2830', '#132029', '#1a2731', '#14212a', '#192730'],
    { lit: (i, f, c, rr) => (i === 2 && f === 2 && c === 1) ? 1 : rr() < .12 ? .55 + rr() * .3 : 0, farLight: .06 });
  // ---- right row beyond the workshop
  const Rr = row(ctx, r, 1, [.44, .32, .24, .175, .13, .1], [980, 800, 900, 840, 900],
    ['#162430', '#111d27', '#1a2832', '#13212a', '#182530', '#111c26', '#172430'],
    { lit: (i, f, c, rr) => rr() < .14 ? .5 + rr() * .3 : 0, farLight: .08 });

  // ---- the hero: the workshop (right foreground)
  const ta = .9, tb = .44, A = S(ta, 1), B = S(tb, 1), hh = 1040;
  const topA = [A[0], A[1] - hh * ta], topB = towardH(topA, B[0]), floorB = towardH(A, B[0]), q = [topB, topA, A, floorB];
  roughPoly(ctx, [floorB, A, B], '#0c151c', { amp: .6, seed: 70 });
  const m = facade(ctx, r, q, { wall: '#121d25', floors: 3, cols: 3, top: .08, bottom: .42, ww: .34, wh: .6, lit: (f, c) => (f === 2 && c === 0) ? .55 : 0, skip: 0, amp: 1.5, bays: .5, style: 1, edgeLight: rgba('#ffcf96', .2), shade: [[0, rgba('#9fc4c8', .05)], [1, rgba('#000000', .1)]] });
  // shop window: interior seen through a big pane
  const win = quadIn(m, .07, .5, .7, .93);
  const winPath = (g) => { g.beginPath(); roughPath(g, win, { amp: 1, seed: 71 }); };
  ctx.save(); winPath(ctx); ctx.clip();
  { const [x0, y0] = win[0], [x1] = win[1], g = ctx.createLinearGradient(0, win[0][1], 0, win[3][1]);
    g.addColorStop(0, '#4a2216'); g.addColorStop(.35, '#b0602e'); g.addColorStop(.7, '#e8a058'); g.addColorStop(1, '#f2b46a'); ctx.fillStyle = g; ctx.fillRect(1400, 380, 600, 600);
    roughRect(ctx, 1400, 800, 600, 200, '#6a3a22', { amp: .5, seed: 77 }); roughRect(ctx, 1400, 798, 600, 4, '#3a1a10', { amp: .3, seed: 78 });
    // lamp in the room, back wall tools, shelves (all slightly irregular)
    bloom(ctx, 1700, 560, 360, { col: WARM, core: '#fff1d0', a: .55, k: .25, seed: 12 });
    ctx.fillStyle = '#5a2a18'; for (let i = 0; i < 7; i++) roughRect(ctx, 1560 + i * 26 + (i % 2) * 4, 590, 5, 40 + (i * 13) % 30, '#5a2a18', { amp: .6, seed: i });
    roughRect(ctx, 1548, 584, 200, 6, '#4a2214', { amp: .6, seed: 3 });
    roughRect(ctx, 1810, 520, 120, 5, '#4a2214', { amp: .6, seed: 4 });
    for (let i = 0; i < 4; i++) roughRect(ctx, 1818 + i * 26, 488 + (i % 2) * 8, 18, 32 - (i % 2) * 8, ['#8a4a2a', '#6a3420', '#a0603a'][i % 3], { amp: .5, seed: i + 9 });
    // pendant lamp
    ctx.strokeStyle = '#3a1a10'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1700, 470); ctx.lineTo(1700, 520); ctx.stroke();
    roughPoly(ctx, [[1680, 540], [1720, 540], [1710, 518], [1690, 518]], '#3a1a10', { amp: .4, seed: 5 });
    bloom(ctx, 1700, 544, 40, { core: '#fff8e6', a: .9, k: .1, seed: 5 });
    cone(ctx, 1700, 540, { spread: .55, len: 300, col: '#ffe0b0', a: .35, k: .35, seed: 6 });
    // the old carpenter, behind the child, guiding; and the child planing
    const col = { coat: '#6e3b2a', pants: '#3a2018', shoes: '#22100a', skin: '#e7b993', hair: '#d9d2c6' };
    person(ctx, 1662, 690, 1.0, { lean: .45, head: .45, sh: [1.0, .85], el: [.7, .75], hip: [.06, -.04], kn: [0, .06], hair: 'grey', bulk: 1.12, coat: .6 }, { dress: col, light: { x: 1700, y: 520, col: '#ffe9c4', a: .45 }, shadeA: .12 });
    // apron
    const kid = { coat: '#2f5560', pants: '#2a2a3a', shoes: '#1a1010', skin: '#efc39d', hair: '#3a2214' };
    const k = person(ctx, 1712, 742 - 88 * .7 + 30, .7, { lean: .14, head: .22, sh: [1.25, 1.05], el: [.5, .55], hip: [.06, -.06], kn: [0, .05], hair: 'curly' }, { dress: kid, light: { x: 1700, y: 520, col: '#ffe9c4', a: .5 }, shadeA: .08 });
    // bench + plank + shavings
    roughRect(ctx, 1600, 698, 260, 16, '#4a2216', { amp: .6, seed: 7 }); roughRect(ctx, 1615, 713, 14, 170, '#3a1a10', { amp: .5, seed: 8 }); roughRect(ctx, 1830, 713, 14, 170, '#3a1a10', { amp: .5, seed: 9 }); roughRect(ctx, 1615, 790, 230, 8, '#3a1a10', { amp: .4, seed: 10 });
    roughRect(ctx, 1610, 686, 240, 12, '#e9c28c', { amp: .4, seed: 10 });
    for (let k = 0; k < 6; k++) { ctx.strokeStyle = rgba('#fbe2b6', .9); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(1790 + k * 11, 676 - k * 3, 4 + k, -Math.PI * .8, Math.PI * .6); ctx.stroke(); }
    const [hx, hy] = k.hand(0); roughRect(ctx, hx - 12, 672, 34, 13, '#2a1810', { amp: .4, seed: 11 }); roughRect(ctx, hx + 10, 662, 7, 12, '#2a1810', { amp: .3, seed: 12 });
  }
  ctx.restore();
  // window frame + mullions, glass glint, awning in red-orange (the shop's own colour)
  { const mm = (u, v) => quadMap(win)(u, v); ctx.strokeStyle = '#0d161d'; ctx.lineWidth = 7; ctx.beginPath(); roughPath(ctx, win, { amp: 1, seed: 71 }); ctx.stroke();
    ctx.lineWidth = 5; for (const u of [.36, .7]) { const [a, b] = [mm(u, 0), mm(u, 1)]; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); }
    const [g0, g1] = [mm(.05, .05), mm(.3, .5)]; ctx.strokeStyle = rgba('#fff4dc', .15); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(...g0); ctx.lineTo(...g1); ctx.stroke();
    const aw = [m(.04, .43), m(.74, .43), m(.74, .47), m(.04, .47)]; const awD = aw.map(([x, y], i) => i >= 2 ? [x - 30 * (i === 2 ? 1 : .55), y + 22] : [x, y]);
    roughPoly(ctx, awD, '#c4482a', { amp: 1, seed: 72 });
    ctx.save(); ctx.beginPath(); roughPath(ctx, awD, { amp: 1, seed: 72 }); ctx.clip(); for (let i = 0; i < 12; i++) { const a = quadMap(awD)(i / 12, 0), b = quadMap(awD)(i / 12 + .04, 1); roughPoly(ctx, [a, quadMap(awD)(i / 12 + .04, 0), quadMap(awD)(i / 12 + .08, 1), b], '#e8d6b4', { amp: .3, seed: i }); i++; } ctx.restore();
    // hanging sign with the trade: a plane
    const [sx, sy] = m(.82, .47); roughLine(ctx, [[sx, sy], [sx - 60, sy - 4]], { w: 3, col: '#0d161d', seed: 2 }); roughRect(ctx, sx - 58, sy + 4, 46, 30, '#e8d6b4', { amp: .6, seed: 3 }); roughRect(ctx, sx - 48, sy + 15, 26, 9, '#2a1810', { amp: .3, seed: 4 });
  }
  // the light spill: through the window, across the sidewalk and the cobbles (stippled falloff)
  { const [c, g] = layer(); const wm = quadMap(win);
    // each pane throws its own parallelogram of light down-left onto the cobbles; mullions leave dark bars
    const panes = [[0, .34], [.38, .68], [.72, 1]], dx = -560, dy = 260;
    for (const [u0, u1] of panes) { const a = wm(u0, 1), b = wm(u1, 1), a2 = wm(u0, .1), b2 = wm(u1, .1);
      const pts = [a, b, [b2[0] + dx * 1.15, b2[1] + dy * 1.6 + 120], [a2[0] + dx * 1.15, a2[1] + dy * 1.6 + 120]];
      g.beginPath(); roughPath(g, pts, { amp: 3, seed: u0 * 10 }); g.fillStyle = rgba(WARM, .62); g.fill(); }
    const sc = soften(c, 5); maskLinear(sc, 1700, 820, 900, 1100, [[0, 1], [.5, .55], [1, 0]]);
    stipple(sc, { k: .45, g: 1.1, seed: 9 }); put(ctx, sc, { op: 'lighter' }); }
  bloom(ctx, 1640, 760, 520, { col: WARM, core: HOT, a: .22, k: .4, seed: 13, sy: .7 });

  // ---- crafts down the street (small warm notes)
  // violinist on a balcony (left house #2, upper floor)
  { const h2 = L[1], [bx, by] = h2.m(.55, .62), s = .64;
    const door = quadIn(h2.m, .4, .42, .7, .64); roughPoly(ctx, door, '#e8954a', { amp: .6, seed: 1 });
    bloom(ctx, (door[0][0] + door[1][0]) / 2, (door[0][1] + door[3][1]) / 2, 200, { a: .35, k: .4, seed: 21 });
    const P = { lean: -.08, head: -.3, sh: [.95, 1.7], el: [1.45, .35], hip: [.12, -.1], kn: [.05, .12], hair: 'long' };
    const f = person(ctx, bx, by - 88 * s, s, P, { dress: { coat: '#2b2030', pants: '#1a1420', skin: '#d9a77e', hair: '#1a1010' }, rim: HOT, rimSide: 1, flip: true, shadeA: .45 });
    const [nx, ny] = f.hand(1), cx0 = bx - 4, cy0 = by - 88 * s - 58 * s; ctx.save(); ctx.translate(cx0, cy0); ctx.rotate(Math.atan2(ny - cy0, nx - cx0)); ctx.fillStyle = '#7a3a22'; ctx.beginPath(); ctx.ellipse(6, 0, 12, 6, 0, 0, 7); ctx.fill(); ctx.fillRect(12, -1.5, Math.hypot(nx - cx0, ny - cy0) - 12, 3); ctx.restore();
    const [bx2, by2] = f.hand(0); ctx.strokeStyle = rgba('#f4e2c0', .9); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(bx2 + 12, by2 - 22); ctx.lineTo(bx2 - 22, by2 + 22); ctx.stroke();
    // balcony rail
    const rl = [h2.m(.32, .64), h2.m(.78, .64)]; roughLine(ctx, rl, { w: 3, col: '#0b141b', seed: 5 }); roughLine(ctx, [h2.m(.32, .72), h2.m(.78, .72)], { w: 4, col: '#0b141b', seed: 6 });
    for (let u = .34; u < .78; u += .045) roughLine(ctx, [h2.m(u, .64), h2.m(u, .72)], { w: 1.4, col: '#0b141b', seed: u * 100 });
    // notes drifting out
    for (let k = 0; k < 3; k++) { ctx.fillStyle = rgba('#f4e2c0', .6 - k * .15); ctx.beginPath(); ctx.ellipse(bx + 60 + k * 30, by - 170 - k * 22, 4.5, 3.2, -.4, 0, 7); ctx.fill(); ctx.fillRect(bx + 63 + k * 30, by - 188 - k * 22, 1.6, 17); }
  }
  // potter in the ground-floor window of left house #4
  { const h4 = L[3], w4 = quadIn(h4.m, .2, .7, .8, .93); roughPoly(ctx, w4, '#d9874a', { amp: .5, seed: 2 });
    ctx.save(); ctx.beginPath(); roughPath(ctx, w4, { amp: .5, seed: 2 }); ctx.clip(); const [px, py] = h4.m(.42, .9), s = .3;
    person(ctx, px, py - 30 * s, s, { lean: .35, head: .4, sh: [.95, .7], el: [.55, .75], hip: [1.5, 1.45], kn: [1.5, 1.4], hair: 'bun' }, { dress: { coat: '#3a1c14', pants: '#2a140e', skin: '#5a2c1a', hair: '#1a0c08' } });
    roughRect(ctx, px + 20, py - 32, 20, 18, '#3a1c14', { amp: .3, seed: 3 }); ctx.restore();
    bloom(ctx, (w4[0][0] + w4[2][0]) / 2, (w4[0][1] + w4[2][1]) / 2, 80, { a: .3, k: .4, seed: 22 }); }
  // sign painter on a ladder, left house #5, a fresh sign "OPEN" (cream on red-orange)
  { const h5 = L[4], [lx, ly] = h5.m(.55, 1), s = .27, top = h5.m(.5, .62);
    const sign = quadIn(h5.m, .25, .5, .75, .62); roughPoly(ctx, sign, '#c4482a', { amp: .4, seed: 4 });
    const [sx0, sy0] = quadMap(sign)(.5, .8); text(ctx, 'OPEN', sx0, sy0, { size: 12, weight: 600, color: '#f4e2c0', spacing: 1, align: 'center' });
    roughLine(ctx, [[lx + 8, ly], [top[0] + 4, top[1] + 10]], { w: 1.6, col: '#0b141b', seed: 6 }); roughLine(ctx, [[lx + 18, ly], [top[0] + 14, top[1] + 10]], { w: 1.6, col: '#0b141b', seed: 7 });
    const f = person(ctx, lx + 12, ly - 70, s, { lean: -.05, head: -.2, sh: [2.3, .6], el: [.3, 1.1], hip: [.3, -.1], kn: [.5, .1], hair: 'cap' }, { dress: { coat: '#d9d2c0', pants: '#2a3a44', skin: '#d9a77e', hair: '#1a2a34' }, light: { x: lx - 40, y: ly - 120, a: .4 } });
    // the street lamp that lights them
    const [px, py] = S(.33, -1); roughLine(ctx, [[px + 30, py + 4], [px + 30, py - 150]], { w: 2.5, col: '#0b141b', seed: 8 }); roughLine(ctx, [[px + 30, py - 150], [px + 48, py - 154]], { w: 2, col: '#0b141b', seed: 9 });
    cone(ctx, px + 50, py - 150, { dir: -.15, spread: .42, len: 170, col: WARM, a: .45, k: .45, seed: 23 }); bloom(ctx, px + 50, py - 150, 20, { a: .9, k: .1, seed: 24 }); }

  // ---- power lines (a1's graphic device): poles on the left, wires sagging across to the right row
  { const poles = [[.98, -1], [.5, -1], [.27, -1], [.16, -1]];
    const tops = poles.map(([t]) => { const [x, y] = S(t, -1); return [x + 200 * t, y - 1150 * t]; });
    for (const [i, [t]] of poles.entries()) { const [x, y] = S(t, -1); roughLine(ctx, [[x + 200 * t, y + 10], tops[i]], { w: 14 * t + 1.5, col: '#060c11', seed: i }); roughLine(ctx, [[tops[i][0] - 60 * t, tops[i][1] + 30 * t], [tops[i][0] + 60 * t, tops[i][1] + 30 * t]], { w: 7 * t + 1, col: '#060c11', seed: i + 9 }); }
    for (let k = -1; k <= 1; k++) for (let i = 0; i < tops.length - 1; i++) { const a = [tops[i][0] + k * 55 * poles[i][0], tops[i][1] + 30 * poles[i][0]], b = [tops[i + 1][0] + k * 55 * poles[i + 1][0], tops[i + 1][1] + 30 * poles[i + 1][0]]; roughLine(ctx, sagLine(a, b, 40 * poles[i][0]), { w: 1.6 + poles[i][0] * 1.6, col: '#060c11', seed: k * 10 + i }); }
    for (let k = 0; k < 3; k++) { const a = [tops[0][0] - 60 + k * 50, tops[0][1] + 28], b = [W + 40, 40 + k * 70]; roughLine(ctx, sagLine(a, b, 90), { w: 2.4, col: '#060c11', seed: 40 + k }); }
    roughLine(ctx, sagLine([tops[1][0], tops[1][1] + 15], [1460, 360], 60), { w: 1.6, col: '#060c11', seed: 50 });
  }
  // street lamp right, mid distance
  { const [x, y] = S(.3, 1); const bx = x - 90 * .3; roughLine(ctx, [[bx, y], [bx, y - 420 * .3]], { w: 3, col: '#0b141b', seed: 60 }); roughLine(ctx, [[bx, y - 420 * .3], [bx - 22, y - 424 * .3]], { w: 2.4, col: '#0b141b', seed: 61 }); cone(ctx, bx - 24, y - 126, { dir: .12, spread: .45, len: 160, col: WARM, a: .4, k: .45, seed: 62 }); bloom(ctx, bx - 24, y - 126, 18, { a: .9, k: .1, seed: 63 }); }

  // ---- the walker: amber coat, stopped on the steep sidewalk, turned toward the workshop
  { const fx = 1120, fy = 1010 - 88 * .8, s = .8;
    castShadow(ctx, fx, fy + 88 * s, s, 1700, 700, { a: .5, len: 2.2 });
    person(ctx, fx, fy, s, { lean: -.05, head: .12, sh: [.35, -.2], el: [.55, .7], hip: [.22, -.18], kn: [.1, .35], hood: true, coat: 1 }, { dress: { coat: '#e59a3a', pants: '#14141e', shoes: '#0b0a12', skin: '#e9c3a0', hair: '#2a1a14' }, light: { x: 1640, y: 720, col: '#ffe0b0', a: .55 }, rim: HOT, rimSide: 1, rimW: 2 });
  }
  // street-level fog in the dip, cold, between us and the lower town
  fog(ctx, { y0: 600, y1: 760, col: '#7aa5a8', a: .32, seed: 41, cover: .65, soft: .4, k: .25, sx: .004, sy: .025, mask: (c) => maskRadial(c, 1010, 660, 0, 700, [[0, 1], [.7, .6], [1, 0]], .4) });
  printFinish(ctx, { grain: .09, vig: .55, vigCol: '#03070b' });
  save(cv, out);
}
frame(process.argv[2] || 'a2.png');
