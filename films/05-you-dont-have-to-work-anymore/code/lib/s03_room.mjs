// s03_room · the K3 living room (night: cyan screen light, amber seam in the curtain; morning: the curtain opens).
// Static layers are built once (per mode) and cached; per frame only the screen flicker, the breathing figure,
// the seam, the curtain and the light shaft are drawn.
import { W, H, P, rgba, clamp, mix, prng, shade, mixHex, layer, plate, put, stipple, maskLinear, maskRadial, roughPoly, roughRect, roughLine, roughPath, hatch, fog, cone, once, L, Lp, fig, glowA, washLayer, bloomSprite, stamp, vg, rg, vnoise } from './s03_kit.mjs';

export const R = {
  floorY: 800, wallTop: 92, leftX: 270, vp: [1060, 430],
  tv: [[70, 405], [232, 448], [232, 612], [70, 650]],
  sofa: { x0: 560, x1: 1320, seat: 712, back: 548, foot: 846 },
  table: [380, 520, 772],
  cur: [1470, 1920], seamX: 1704,
};
const tvC = () => [(R.tv[0][0] + R.tv[2][0]) / 2, (R.tv[0][1] + R.tv[2][1]) / 2];
export const tvCentre = tvC;

// ---------------------------------------------------------------- static layers
function wallsPlate(morning) {
  return plate(W, H, (g, c) => {
    const wallA = morning ? '#3a3250' : '#121a3e', wallB = morning ? '#241f3c' : '#0a0f2a';
    // ceiling, back wall, left wall, floor
    vg(g, [[0, shade(wallB, -.03)], [1, wallB]], 0, 0, 0, R.wallTop, [0, 0, W, R.wallTop + 2]);
    vg(g, [[0, wallB], [.6, wallA], [1, shade(wallA, -.02)]], 0, R.wallTop, 0, R.floorY, [0, R.wallTop, W, R.floorY - R.wallTop + 2]);
    roughPoly(g, [[-10, -10], [R.leftX, R.wallTop], [R.leftX, R.floorY], [-10, 990]], shade(wallB, -.015), { amp: 1, seed: 4 });
    // skirting + cornice lines
    roughPoly(g, [[R.leftX, R.floorY - 16], [W + 10, R.floorY - 16], [W + 10, R.floorY], [R.leftX, R.floorY]], shade(wallB, -.02), { amp: .6, seed: 5 });
    roughLine(g, [[R.leftX, R.wallTop + 4], [W, R.wallTop + 4]], { w: 3, col: rgba('#000000', .3), seed: 6 });
    roughLine(g, [[R.leftX, R.wallTop], [R.leftX, R.floorY]], { w: 2, col: rgba('#000000', .25), seed: 7 });
    // floor with boards converging to the vanishing point
    const fl = morning ? '#2a2236' : '#080b20';
    roughPoly(g, [[-10, 990], [R.leftX, R.floorY], [W + 10, R.floorY], [W + 10, H + 10], [-10, H + 10]], fl, { amp: 1, seed: 8 });
    g.save(); g.beginPath(); g.rect(0, R.floorY, W, H); g.clip();
    for (let i = -14; i < 30; i++) { const x = R.vp[0] + i * 150; g.strokeStyle = rgba(morning ? '#7a5a52' : '#2a3460', .22); g.lineWidth = 1.2; g.beginPath(); g.moveTo(mix(R.vp[0], x, (R.floorY - R.vp[1]) / (H - R.vp[1])), R.floorY); g.lineTo(x, H); g.stroke(); }
    vg(g, [[0, rgba('#000000', .35)], [1, rgba('#000000', 0)]], 0, R.floorY, 0, R.floorY + 140, [0, R.floorY, W, 140]);
    g.restore();
    // a picture frame and a dead floor lamp on the back wall (things that wait)
    roughRect(g, 880, 236, 230, 164, shade(wallA, -.035), { amp: .8, seed: 9 });
    roughRect(g, 892, 248, 206, 140, shade(wallA, .02), { amp: .6, seed: 10 });
    hatch(g, [892, 248, 206, 140], { angle: .5, gap: 6, col: '#000', a: .12, seed: 3 });
    g.save(); g.beginPath(); g.rect(892, 248, 206, 140); g.clip(); roughPoly(g, [[892, 360], [960, 320], [1010, 345], [1098, 300], [1098, 388], [892, 388]], shade(wallA, -.02), { amp: 2, seed: 11 }); g.restore();
    roughLine(g, [[1400, 790], [1400, 360]], { w: 5, col: shade(wallB, -.03), seed: 12 });
    roughPoly(g, [[1356, 360], [1444, 360], [1428, 300], [1372, 300]], shade(wallA, -.03), { amp: .6, seed: 13 });
    // window wall behind the curtain (morning: the bright window itself)
    if (morning) {
      vg(g, [[0, '#fff3d8'], [.5, '#ffd9a0'], [1, '#f7b56c']], 0, 120, 0, 790, [R.cur[0], 110, W - R.cur[0], 690]);
      // mullions and the far town as a pale silhouette through the glass
      roughPoly(g, [[R.cur[0], 640], [1560, 610], [1600, 625], [1660, 585], [1700, 600], [1760, 560], [1830, 590], [1920, 570], [1920, 790], [R.cur[0], 790]], rgba('#e7a774', .65), { amp: 1.5, seed: 14 });
      for (const x of [1560, 1700, 1840]) roughRect(g, x, 110, 14, 690, '#5a3a3a', { amp: .5, seed: x });
      roughRect(g, R.cur[0], 430, W - R.cur[0], 12, '#5a3a3a', { amp: .5, seed: 15 });
    }
    // texture: faint vertical paper hatch on the walls, darker toward the corners
    { const [hc, hx] = layer(); hatch(hx, [0, 0, W, R.floorY], { angle: 1.5708, gap: 9, w: 1, col: morning ? '#ffe0b0' : '#4a5a9a', a: .06, seed: 21, broken: .4 }); put(g, hc); }
  });
}
// the TV on the left wall (screen glows; per-frame flicker is a separate additive stamp)
function tvPlate() {
  return plate(W, H, (g) => {
    const q = R.tv, e = 9;
    roughPoly(g, [[q[0][0] - e, q[0][1] - e * 1.2], [q[1][0] + e, q[1][1] - e], [q[2][0] + e, q[2][1] + e], [q[3][0] - e, q[3][1] + e * 1.2]], '#05060f', { amp: .5, seed: 2 });
    roughPoly(g, q, '#9fe8fb', { amp: .4, seed: 3 });
    // something on the screen: soft blocks of a show, all in cyan values
    g.save(); g.beginPath(); roughPath(g, q, { amp: .4, seed: 3 }); g.clip();
    vg(g, [[0, '#d8f7ff'], [1, '#4fb6d6']], 0, 410, 0, 650, [60, 400, 190, 260]);
    roughPoly(g, [[70, 560], [130, 520], [180, 548], [232, 520], [232, 650], [70, 650]], rgba('#2a7f9e', .6), { amp: 2, seed: 4 });
    g.fillStyle = rgba('#ffffff', .5); g.beginPath(); g.ellipse(170, 500, 16, 18, 0, 0, 7); g.fill();
    g.restore();
    // stand
    roughPoly(g, [[60, 700], [250, 668], [250, 700], [60, 760]], '#04050c', { amp: .6, seed: 5 });
    roughRect(g, 140, 640, 14, 46, '#04050c', { amp: .3, seed: 6 });
  });
}
function lightPlates(morning) {
  if (morning) return {
    shaft: plate(W, H, (g, c) => {
      // the morning shaft: from the window across the floor and over the sofa
      const gr = g.createLinearGradient(1500, 300, 500, 1000); gr.addColorStop(0, rgba('#ffd9a0', .75)); gr.addColorStop(.6, rgba('#ffb35c', .35)); gr.addColorStop(1, rgba('#ffb35c', 0));
      g.fillStyle = gr; g.beginPath(); g.moveTo(1480, 120); g.lineTo(1480, 800); g.lineTo(300, 1080); g.lineTo(-200, 1080); g.lineTo(-200, 900); g.closePath(); g.fill();
      stipple(c, { k: .4, g: 1.1, seed: 41 });
    }),
    wash: washLayer(1500, 450, 1600, '#ffb35c', .7, { sy: .7, k: .35, seed: 42 }),
  };
  return {
    wash: (() => { const c = washLayer(200, 520, 1250, P.cy, .26, { sy: .8, k: .55, seed: 31 }); const g = c.getContext('2d'); g.drawImage(washLayer(330, 860, 700, P.cy, .2, { sy: .3, k: .7, seed: 32 }), 0, 0);
      // a soft cone from the screen across to the sofa
      cone(g, 232, 520, { dir: 1.43, spread: .2, len: 1200, col: P.cy, a: .12, k: .6, seed: 33, op: 'lighter' }); return c; })(),
  };
}
// sofa: 3/4 front view, rounded and lumpy, with a cyan rim on the left and seat cushions
function sofaPlate(morning) {
  const S = R.sofa;
  return plate(W, H, (g) => {
    const base = morning ? '#4a3a62' : '#1c2560', dark = shade(base, -.06), rim = morning ? '#ffcf8a' : '#8fe6ff';
    // shadow under
    g.fillStyle = rgba('#000000', .45); g.beginPath(); g.ellipse((S.x0 + S.x1) / 2, S.foot + 4, (S.x1 - S.x0) * .55, 22, 0, 0, 7); g.fill();
    // back
    roughPoly(g, [[S.x0 + 40, S.back + 30], [S.x0 + 70, S.back], [S.x1 - 70, S.back - 6], [S.x1 - 40, S.back + 24], [S.x1 - 40, S.seat], [S.x0 + 40, S.seat]], shade(base, -.02), { amp: 2.5, seed: 51 });
    // back cushions
    for (let i = 0; i < 3; i++) { const x0 = mix(S.x0 + 90, S.x1 - 90, i / 3), x1 = mix(S.x0 + 90, S.x1 - 90, (i + 1) / 3); roughPoly(g, [[x0 + 6, S.back + 34], [x0 + 18, S.back + 18], [x1 - 18, S.back + 16], [x1 - 6, S.back + 32], [x1 - 4, S.seat - 6], [x0 + 4, S.seat - 6]], shade(base, .015 - i * .01), { amp: 3, seed: 60 + i }); }
    // seat
    roughPoly(g, [[S.x0 + 30, S.seat - 8], [S.x1 - 30, S.seat - 10], [S.x1 - 20, S.seat + 30], [S.x0 + 20, S.seat + 32]], shade(base, .03), { amp: 2, seed: 52 });
    roughPoly(g, [[S.x0 + 20, S.seat + 30], [S.x1 - 20, S.seat + 28], [S.x1 - 26, S.foot - 16], [S.x0 + 26, S.foot - 14]], dark, { amp: 2, seed: 53 });
    // arms (rolled)
    const arm = (x, s2, seed) => { roughPoly(g, [[x, S.back + 90], [x + s2 * 26, S.back + 70], [x + s2 * 84, S.back + 76], [x + s2 * 96, S.back + 104], [x + s2 * 92, S.foot - 10], [x + s2 * 4, S.foot - 8]], shade(base, s2 < 0 ? -.01 : .01), { amp: 2.5, seed }); g.fillStyle = rgba('#000', .18); g.beginPath(); g.ellipse(x + s2 * 50, S.back + 92, 40, 16, 0, 0, 7); g.fill(); };
    arm(S.x0 + 96, -1, 54); arm(S.x1 - 96, 1, 55);
    // feet
    for (const x of [S.x0 + 40, S.x1 - 46]) roughRect(g, x, S.foot - 14, 12, 22, '#05060f', { amp: .3, seed: x });
    // form shading: top light from the screen side, hatch in the shadows
    g.save(); g.globalCompositeOperation = 'source-atop';
    vg(g, [[0, rgba(rim, morning ? .0 : .16)], [.35, rgba(rim, 0)], [1, rgba('#000000', morning ? .1 : .35)]], S.x0, 0, S.x1, 0, [S.x0 - 40, S.back - 40, S.x1 - S.x0 + 80, S.foot - S.back + 80]);
    vg(g, [[0, rgba('#000000', 0)], [1, rgba('#000000', .35)]], 0, S.seat, 0, S.foot, [S.x0 - 40, S.seat, S.x1 - S.x0 + 80, S.foot - S.seat + 20]);
    hatch(g, [S.x0, S.seat + 30, S.x1 - S.x0, S.foot - S.seat], { angle: -.7, gap: 6, col: '#000', a: .13, seed: 56 });
    g.restore();
    // rim along the left contour
    roughLine(g, [[S.x0 + 2, S.back + 104], [S.x0 + 14, S.back + 76], [S.x0 + 60, S.back + 70]], { w: 2.2, col: rgba(rim, morning ? .5 : .75), seed: 57 });
    roughLine(g, [[S.x0 + 70, S.back + 2], [S.x0 + 300, S.back - 2]], { w: 1.6, col: rgba(rim, .45), seed: 58 });
  });
}
function tablePlate(morning) {
  const [x0, x1, y] = R.table;
  return plate(W, H, (g) => {
    const col = morning ? '#2a1c2a' : '#05060f';
    roughPoly(g, [[x0, y], [x1, y - 4], [x1 + 8, y + 10], [x0 - 6, y + 14]], col, { amp: .5, seed: 71 });
    roughRect(g, (x0 + x1) / 2 - 6, y + 12, 12, R.floorY + 40 - y, col, { amp: .4, seed: 72 });
    roughPoly(g, [[(x0 + x1) / 2 - 50, R.floorY + 52], [(x0 + x1) / 2 + 50, R.floorY + 48], [(x0 + x1) / 2 + 40, R.floorY + 58], [(x0 + x1) / 2 - 44, R.floorY + 60]], col, { amp: .4, seed: 73 });
  });
}
// wine glass (outline + optional wine), drawn per frame (cheap) so the wine can move
export function wineGlass(g, x, y, s, { fill = .55, col = P.wine, rim = '#cfe9f5', a = .8, lit = 0, tilt = 0 } = {}) {
  g.save(); g.translate(x, y); g.rotate(tilt); g.scale(s, s);
  const bowl = () => { g.beginPath(); g.moveTo(-22, -110); g.bezierCurveTo(-26, -70, -18, -48, 0, -46); g.bezierCurveTo(18, -48, 26, -70, 22, -110); };
  if (fill > 0) { g.save(); bowl(); g.closePath(); g.clip(); const top = mix(-48, -104, fill); vg(g, [[0, shade(col, .1)], [1, shade(col, -.08)]], 0, top, 0, -46, [-30, top, 60, 70]); g.fillStyle = rgba('#ffffff', .18 + lit * .3); g.fillRect(-24, top, 48, 2.2); g.restore(); }
  g.strokeStyle = rgba(rim, a); g.lineWidth = 2.2 / s * 1.4; bowl(); g.stroke();
  g.beginPath(); g.moveTo(0, -46); g.lineTo(0, -6); g.stroke();
  g.beginPath(); g.ellipse(0, -3, 16, 3.5, 0, 0, 7); g.stroke();
  g.strokeStyle = rgba('#ffffff', .35 * a); g.lineWidth = 1.5 / s * 1.4; g.beginPath(); g.moveTo(-14, -100); g.quadraticCurveTo(-17, -74, -9, -60); g.stroke();
  g.restore();
}
// curtain panel with folds between x0..x1 (per frame; cheap gradient strips)
export function curtain(g, x0, x1, y0, y1, { col = '#1b1640', light = 0, seam = 0, seamSide = 0, sway = 0, folds = 7 } = {}) {
  const w = x1 - x0; if (w <= 2) return;
  for (let i = 0; i < folds; i++) {
    const a = x0 + w * i / folds, b = x0 + w * (i + 1) / folds + 1, sw = Math.sin(i * 1.7 + sway) * 4;
    const gr = g.createLinearGradient(a, 0, b, 0);
    gr.addColorStop(0, shade(col, -.03)); gr.addColorStop(.45, shade(col, .035 + light * .08)); gr.addColorStop(1, shade(col, -.045));
    g.fillStyle = gr; g.beginPath(); g.moveTo(a + sw * .3, y0); g.lineTo(b + sw * .3, y0); g.lineTo(b + sw, y1); g.quadraticCurveTo((a + b) / 2 + sw, y1 + 8, a + sw, y1); g.closePath(); g.fill();
  }
  // rail
  g.fillStyle = '#05060f'; g.fillRect(x0 - 30, y0 - 10, w + 60, 8);
}

// ---------------------------------------------------------------- composer
// o: { C (camera), t, until, mode: 'night'|'morning', open (0..1 curtain), seam (px), tv (0..1 screen), pose: 'lie'|'shield', arm (0..1 arm lowered), hand (0..1 hand on curtain) }
export function drawRoom(ctx, o) {
  const { C, t, until } = o, morning = o.mode === 'morning';
  const k = o.mode;
  const walls = once('room-walls-' + k, until, () => { const c = wallsPlate(morning); if (!morning) c.getContext('2d').drawImage(tvPlate(), 0, 0); return c; });
  const lights = once('room-lights-' + k, until, () => lightPlates(morning));
  const sofa = once('room-sofa-' + k, until, () => { const c = tablePlate(morning); c.getContext('2d').drawImage(sofaPlate(morning), 0, 0); return c; });
  const open = o.open ?? 0, flick = o.tv ?? 1;
  // 1 · walls (+ morning window behind the curtain)
  L(ctx, C, .55, (g) => {
    g.drawImage(walls, 0, 0);
    // morning: when the curtain opens, the room itself warms (lit plate is the same walls; light added below)
    if (!morning) {
      const fl = flick * (0.82 + .18 * Math.sin(t * 23.1) * Math.sin(t * 7.3) + .1 * Math.sin(t * 3.1));
      g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = clamp(fl); g.drawImage(lights.wash, 0, 0); g.restore();
      const [cx, cy] = tvC(); glowA(g, cx, cy, 160, .3 * fl);
    }
    // the curtain (closed at night with the amber seam; slides right when pulled)
    const y0 = R.wallTop + 20, y1 = R.floorY - 2, cx0 = R.cur[0], cx1 = R.cur[1] + 20;
    if (!morning) {
      const sx = R.seamX, sw = o.seam ?? 1.5;
      curtain(g, cx0, sx - sw / 2, y0, y1, { col: '#18143a', folds: 4, sway: t * .3 });
      curtain(g, sx + sw / 2, cx1, y0, y1, { col: '#18143a', folds: 3, sway: t * .3 + 1 });
      g.fillStyle = rgba(P.hot, .95); g.fillRect(sx - sw / 2, y0 + 4, sw, y1 - y0 - 8);
      glowA(g, sx, (y0 + y1) / 2, 60 + sw * 10, .35 + sw * .04, P.amb, P.hot, 5);
      // the morning stripe on the floor
      g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = rgba(P.amb, .18 + sw * .03); g.beginPath(); g.moveTo(sx - sw / 2, y1); g.lineTo(sx + sw / 2, y1); g.lineTo(820 + sw * 30, H + 40); g.lineTo(790 - sw * 20, H + 40); g.closePath(); g.fill(); g.restore();
    } else {
      // morning: curtain left part pulled toward the right edge (open 0..1)
      const sx = mix(R.seamX, R.cur[0] + 4, 0) , gap = mix(2, 380, open);
      const lx1 = R.cur[0] + mix(R.seamX - R.cur[0], 34, open);   // left panel bunches toward the left side
      const rx0 = mix(R.seamX, R.cur[1] - 60, open);              // right panel pulled right
      curtain(g, cx0 - 10, lx1, y0, y1, { col: '#3a2a48', light: .3 * open, folds: 4, sway: t * .4 });
      curtain(g, rx0, cx1, y0, y1, { col: '#3a2a48', light: .5 * open, folds: 3, sway: t * .4 + open * 6 });
    }
  });
  // 2 · light shaft (morning) under the furniture
  if (morning && open > 0) {
    L(ctx, C, .7, (g) => { g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = clamp(open * 1.1); g.drawImage(lights.shaft, 0, 0); g.globalAlpha = clamp(open) * .8; g.drawImage(lights.wash, 0, 0); g.restore(); });
  }
  // 3 · table + glasses, sofa, figure
  L(ctx, C, .8, (g) => {
    if (o.glasses !== false) { wineGlass(g, 420, R.table[2] + 2, .62, { fill: 0, a: .55, rim: morning ? '#ffe0b0' : '#b8e8f8' }); wineGlass(g, 478, R.table[2] - 1, .62, { fill: .42, a: .65, rim: morning ? '#ffe0b0' : '#b8e8f8' }); }
    g.drawImage(sofa, 0, 0);
    drawSleeper(g, o);
    // the shaft lies over the sofa and the sleeper too
    if (morning && open > 0) { g.save(); g.globalCompositeOperation = 'screen'; g.globalAlpha = clamp(open) * .45; g.drawImage(lights.shaft, 0, 0); g.restore(); }
  });
  // 4 · morning: warm the whole frame as light comes in; dust motes in the shaft
  if (morning) {
    const u = clamp(open);
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = rgba('#ffb35c', .6 * u); ctx.fillRect(0, 0, W, H); ctx.restore();
    { const [wx, wy] = Lp(o.C, .55, 1700, 420); stamp(ctx, bloomSprite('morn', '#ffb35c', '#fff1cf', .35), wx, wy, 900 * o.C.z, .55 * u); }
    ctx.save(); ctx.fillStyle = rgba('#0a0820', .55 * (1 - u)); ctx.fillRect(0, 0, W, H); ctx.restore();
    const r = prng(9); ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 140; i++) { const bx = r() * 1500, by = r() * 900, sp = .3 + r(); const x = bx + Math.sin(t * .4 * sp + i) * 30, y = by + Math.cos(t * .3 * sp + i * 2) * 20 - t * 6 * sp % 900; const inShaft = (y > 120 && x > 300 + (1080 - y) * .1); ctx.fillStyle = rgba('#fff1cf', (.15 + .5 * r()) * u * (inShaft ? 1 : .2)); ctx.fillRect(x, ((y % 900) + 900) % 900 + 100, 1.6, 1.6); }
    ctx.restore();
  }
  // 5 · the hand that pulls the curtain (morning)
  if (morning && (o.hand ?? 0) > 0) {
    const h = o.hand, gx = Lp(C, .55, mix(R.seamX, R.cur[1] - 60, open), 470);
    ctx.save(); ctx.globalAlpha = clamp(h * 3);
    const sx = W + 60, sy = 620, hx = gx[0] + 18, hy = gx[1];
    ctx.lineCap = 'round'; ctx.strokeStyle = '#2a2a48'; ctx.lineWidth = 46; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo((sx + hx) / 2 + 40, sy - 20, hx + 30, hy + 4); ctx.stroke();
    ctx.strokeStyle = rgba('#ffcf8a', .45); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sx, sy - 22); ctx.quadraticCurveTo((sx + hx) / 2 + 40, sy - 42, hx + 30, hy - 18); ctx.stroke();
    ctx.fillStyle = '#d9a77e'; ctx.beginPath(); ctx.ellipse(hx + 6, hy, 20, 24, -.3, 0, 7); ctx.fill();
    ctx.fillStyle = rgba('#ffe0b0', .5); ctx.beginPath(); ctx.ellipse(hx - 2, hy - 8, 8, 12, -.3, 0, 7); ctx.fill();
    ctx.restore();
  }
}
// the person on the sofa: lying, head on the right arm; 'shield' = arm over the eyes (morning), lowers with o.arm
function drawSleeper(g, o) {
  const t = o.t, morning = o.mode === 'morning', br = Math.sin(t * 1.6) * .5 + .5;
  const S = R.sofa, hx = 940, hy = S.seat + 22, s = 2.35;
  const dress = morning ? { coat: '#6a5a8a', pants: '#2a2440', shoes: '#151020', skin: '#e2b48e', hair: '#2a1a14' } : { coat: '#2a3470', pants: '#141a3a', shoes: '#080a18', skin: '#7f8fb8', hair: '#0c0e22' };
  const arm = o.arm ?? 1;   // 1 = resting, 0 = over the eyes
  const pose = morning
    ? { lean: -.05, head: -.2 + br * .02, sh: [mix(2.75, .15, arm), .1], el: [mix(1.75, 2.5, arm), 2.3], hip: [.12, .55], kn: [.05, 1.0], hair: 'short' }
    : { lean: -.05, head: -.25 + br * .02, sh: [.15 + br * .03, .08], el: [2.55, 2.3], hip: [.1, .5], kn: [0, .95], hair: 'short' };
  g.save(); g.translate(hx, hy); g.rotate(1.36);
  fig(g, 'sleeper' + o.mode, 0, 0, s, pose, { flip: true, dress, rim: morning ? '#ffd59a' : '#9fe8fb', rimSide: -1, rimW: 2.4, shadeA: morning ? .12 : .35, shadeCol: morning ? '#2a1830' : '#050818' });
  g.restore();
  if (!morning) {   // the remote in the resting hand: a tiny cyan LED
    glowA(g, hx + 80, hy - 60, 12, .5 * (o.tv ?? 1));
  }
}
