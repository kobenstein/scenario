// Film 74 · YOUR STREET (the leitbild) and the home (bedroom, kitchen, hallway door) as 2.5D card stages.
// Home view (cam3 at 0,0,0): eye level, looking down the street, vanishing point VP. Cards: sky 40000 · hills/town 16000 · far houses 7000 ·
// mid 4200 · near 2600 · FOCUS 1700 (people, robot, chalk) · foreground 1150 (branch, bush).
import * as K from './f74_kit.mjs';
const { W, H, rgba, mixHex, clamp, lerp, span, smooth, rad, lin, prng, drift } = K;
export const VP = [960, 560];
const hw = (y) => Math.max(0, (y - VP[1]) * 1.35);   // road half width at screen y
function roadBand(ctx, y0, y1, L, o = {}) {
  K.band(ctx, y0, y1 + 2, mixHex(L.grass, L.walk, .45), mixHex(L.grass, L.walk, .25));   // verge / pavement
  const a0 = hw(y0), a1 = hw(y1 + 2), pav = 1.32;
  ctx.fillStyle = lin(ctx, 0, y0, 0, y1, [[0, mixHex(L.walk, L.haze, .3)], [1, L.walk]]);
  ctx.beginPath(); ctx.moveTo(VP[0] - a0 * pav, y0); ctx.lineTo(VP[0] + a0 * pav, y0); ctx.lineTo(VP[0] + a1 * pav, y1 + 2); ctx.lineTo(VP[0] - a1 * pav, y1 + 2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, y0, 0, y1, [[0, mixHex(L.road, L.haze, .35)], [1, L.road]]);
  ctx.beginPath(); ctx.moveTo(VP[0] - a0, y0); ctx.lineTo(VP[0] + a0, y0); ctx.lineTo(VP[0] + a1, y1 + 2); ctx.lineTo(VP[0] - a1, y1 + 2); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba('#fffaf0', .35); ctx.lineWidth = 2; for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(VP[0] + s * a0, y0); ctx.lineTo(VP[0] + s * a1, y1 + 2); ctx.stroke(); }
  const bays = [];
  for (const s of [-1, 1]) for (let y = y0; y < y1; y += Math.max(10, (y - VP[1]) * .42)) {   // the old parking bays (garden beds now)
    const yb = Math.min(y1, y + Math.max(8, (y - VP[1]) * .3)), xa = VP[0] + s * hw(y) * .97, xb = VP[0] + s * hw(yb) * .97, xc = VP[0] + s * hw(yb) * .78, xd = VP[0] + s * hw(y) * .78;
    ctx.fillStyle = mixHex('#7a5a3e', L.shade, .3); ctx.beginPath(); ctx.moveTo(xa, y); ctx.lineTo(xb, yb); ctx.lineTo(xc, yb); ctx.lineTo(xd, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mixHex(L.leaf, L.light, .1); for (let k = 0; k < 3; k++) { const u = (k + .5) / 3, xx = lerp(lerp(xd, xa, .5), lerp(xc, xb, .5), u), yy = lerp(y, yb, u); ctx.beginPath(); ctx.arc(xx, yy - 2, Math.max(2, (yy - VP[1]) * .025), 0, 7); ctx.fill(); }
    bays.push({ x: (xa + xb + xc + xd) / 4, y: (y + yb) / 2, s: ((y + yb) / 2 - VP[1]) / 440, side: s });
  }
  return bays;
}
// a parked car of 2026 seen from behind, as a thin cold ink outline (the ghost row along the kerb)
export function inkCarRear(ctx, x, base, s, a = 1, col = '#eef2ff') {
  if (a <= 0) return; const w = 190 * s, h = 150 * s; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = Math.max(1.2, 2.6 * s); ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x - w / 2, base - h * .12); ctx.lineTo(x - w / 2, base - h * .5); ctx.lineTo(x - w * .38, base - h * .56); ctx.lineTo(x - w * .3, base - h); ctx.lineTo(x + w * .3, base - h); ctx.lineTo(x + w * .38, base - h * .56); ctx.lineTo(x + w / 2, base - h * .5); ctx.lineTo(x + w / 2, base - h * .12); ctx.closePath(); ctx.stroke();
  ctx.strokeRect(x - w * .26, base - h * .92, w * .52, h * .3);
  ctx.fillStyle = rgba('#ff5a4a', .9); ctx.fillRect(x - w * .46, base - h * .46, w * .16, h * .08); ctx.fillRect(x + w * .3, base - h * .46, w * .16, h * .08);
  ctx.restore();
}
function bayLife(ctx, t, bays, L, o, Z) {   // what stands in the bays: ghost cars (2026) or apple trees (2050, growing near→far)
  for (const b of bays) {
    if (o.ghostCars) inkCarRear(ctx, b.x, b.y + 6 * b.s, b.s, o.ghostCars * (o.ghostWipe ? clamp((o.ghostWipe - (1 - b.s)) * 4) : 1));
    if (o.bayTrees) { const g = K.expoOut(clamp((o.bayTrees - (1 - b.s) * .55) * 2.2)); if (g > .01) K.tree(ctx, t, b.x, b.y, b.s * .78 * g, L, { apples: Math.round(10 * g), leaf: K.hz(L.leaf, Z, L), wind: .6 }); }
  }
}
const HL = (ctx, g, a, L) => { if (!a || a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(L.light, .32 * a); ctx.fillRect(g.x, g.base - g.h, g.w, g.h); ctx.restore(); };
// the whole street (leitbild). o: sunAt, fusion, solar, walkers, garage, workers, chime, ghostCars (+ghostWipe), bayTrees, apples, printed, tiles,
// lanterns, roofBot, hl(i) house light 0..1 (far 0–3, mid 4–5, near 6–7), chalk, kids, ladder (1 = picking, 2 = hands an apple down), pod, you,
// youNear [x,y,h] (at your door), girlAt, focus(ctx,t), fore. Returns { yours, across, mid: [g1, g2] } (design coords of their cards).
export function street(ctx, t, cam, L, o = {}) {
  const out = {}, hl = o.hl || (() => 0);
  K.stage(ctx, cam, [
    [40000, () => K.sky(ctx, t, L, { horizon: 600, sunAt: o.sunAt })],
    [16000, () => {
      K.hills(ctx, 590, 40, null, 4, { grad: [K.hz(mixHex(L.leafS, L.shade, .3), 16000, L), K.hz(L.leafS, 12000, L)] });
      K.townLine(ctx, 800, 1120, 592, K.hz(mixHex(L.wallS, L.shade, .4), 16000, L), L, { towerX: 960, seed: 9 });
      if (o.fusion) fusionFar(ctx, t, 1500, 560, L, o.fusion);
    }],
    [7000, () => {
      const bays = roadBand(ctx, 588, 668, L);
      [[470, 1], [620, 1], [1170, -1], [1320, -1]].forEach(([x, side], i) => { const g = K.house(ctx, x, 600, 140, 120, L, { col: K.hz(['#d8b98a', '#c9a0a0', '#b7c0a0', '#d1b090'][i], 7000, L), side, lit: L.night * .9, solar: o.solar, t }); HL(ctx, g, hl(i), L); });
      for (const x of [760, 1150]) K.tree(ctx, t, x, 606, .32, L, { leaf: K.hz(L.leaf, 7000, L) });
      bayLife(ctx, t, bays, L, o, 7000);
      if (o.walkers) for (let i = 0; i < 3; i++) K.folk(ctx, t, i + 2, 900 + i * 50 + Math.sin(t * .2 + i) * 30, 640 + i * 6, 34, { walk: K.walkPh(t, .5) + i, dir: i % 2 ? 1 : -1 });
    }],
    [4200, () => {
      const bays = roadBand(ctx, 650, 790, L);
      const g1 = K.house(ctx, 330, 668, 230, 200, L, { col: '#cfa77e', side: 1, lit: L.night, solar: o.solar, t, garage: o.garage ?? 0 });
      const g2 = K.house(ctx, 1330, 668, 230, 200, L, { col: '#b9a2b8', side: -1, lit: L.night, solar: o.solar, t, garage: o.garage ?? 0 });
      HL(ctx, g1, hl(4), L); HL(ctx, g2, hl(5), L); out.mid = [g1, g2];
      for (const x of [650, 1250]) K.tree(ctx, t, x, 690, .55, L, { apples: o.apples ? 9 : 0 });
      if (o.workers && o.garage) {
        const [ax, ay, aw, ah] = g1.garage, [bx, by, bw, bh] = g2.garage;
        ctx.fillStyle = '#9a6a3e'; ctx.beginPath(); ctx.moveTo(ax + 8, ay + ah * .55); ctx.quadraticCurveTo(ax + aw * .45, ay + ah * 1.05, ax + aw - 30, ay + ah * .55); ctx.closePath(); ctx.fill();   // a wooden hull on trestles
        ctx.fillStyle = '#2b2240'; for (const [cx, r] of [[bx + bw * .3, 11], [bx + bw * .72, 11]]) { ctx.beginPath(); ctx.arc(cx, by + bh - 12, r, 0, 7); ctx.fill(); } ctx.fillRect(bx + bw * .3, by + bh - 28, bw * .42, 8);   // an old motorbike
        K.folk(ctx, t, 3, ax + aw - 22, 668, 66, { pose: 'reach', armR: [1.5 + .25 * Math.sin(t * 3), 1.7 + .25 * Math.sin(t * 3)], look: .2, dir: -1 }); K.folk(ctx, t, 5, bx + 22, 668, 64, { pose: 'hold', look: .3 + .2 * Math.sin(t) });
      }
      bayLife(ctx, t, bays, L, o, 4200);
      if (o.walkers) { K.folk(ctx, t, 1, 640 + (t * 14) % 300, 740, 70, { walk: K.walkPh(t, .6), dir: 1 }); K.folk(ctx, t, 4, 1300 - (t * 11) % 260, 735, 66, { walk: K.walkPh(t, .5) + 1, dir: -1 }); }
      if (o.chime) chimeDots(ctx, t, [g1, g2], o.chime);
    }],
    [2600, () => {
      const bays = roadBand(ctx, 770, 1100, L);
      const yours = K.house(ctx, -330, 800, 560, 470, L, { col: '#d9b58c', side: 1, door: 'yellow', doorCol: 1, lit: L.night, solar: o.solar, t, tiles: o.tiles ?? 0, roofH: 190, garage: o.garage ? 0 : 0 });
      const across = o.printed != null ? printedHouse(ctx, t, 1600, 800, 560, 440, L, o.printed) : K.house(ctx, 1640, 800, 560, 440, L, { col: '#b7c2a8', side: -1, lit: L.night, solar: o.solar, t, roofH: 180, doorCol: 1, garage: o.garage ?? 0, garageAt: .06 });
      HL(ctx, yours, hl(6), L); HL(ctx, across, hl(7), L); out.yours = yours; out.across = across;
      if (o.workers && across.garage) { const [ax, ay, aw, ah] = across.garage;   // the workshop across the road: a hull on trestles, your neighbour at the plane
        ctx.fillStyle = mixHex('#7a5030', L.shade, .2); ctx.fillRect(ax + 30, ay + ah * .72, 10, ah * .28); ctx.fillRect(ax + aw - 60, ay + ah * .72, 10, ah * .28);
        ctx.fillStyle = lin(ctx, 0, ay + ah * .4, 0, ay + ah * .75, [[0, '#c98a52'], [1, '#7a4a28']]); ctx.beginPath(); ctx.moveTo(ax + 10, ay + ah * .45); ctx.quadraticCurveTo(ax + aw * .45, ay + ah * .95, ax + aw - 20, ay + ah * .42); ctx.closePath(); ctx.fill();
        K.folk(ctx, t, 4, ax + aw * .56, ay + ah, ah * .82, { armR: [1.35 + .3 * Math.sin(t * 3.2), 1.6 + .3 * Math.sin(t * 3.2)], armL: [-1.2, -1.4], dir: -1, look: .5 }); }
      if (o.youNear) K.you(ctx, t, o.youNear[0], o.youNear[1], o.youNear[2], { dir: 1, look: .3 });
      for (const x of [420, 1530]) K.tree(ctx, t, x, 860, 1.05, L, { apples: o.apples ? 22 : 0 });
      bayLife(ctx, t, bays, L, o, 2600);
      if (o.lanterns) lanternString(ctx, t, -200, 380, 2100, 360, L, o.lanterns);
      if (o.chime) chimeDots(ctx, t, [yours, across], o.chime);
      if (o.roofBot) roofBot(ctx, t, yours, L, o.roofBot);
      if (o.near) o.near(ctx, t);
    }],
    [1700, () => {
      if (o.chalk) chalk(ctx, t, 700, 940, o.chalk, L);
      if (o.kids) { K.folk(ctx, t, 2, 610, 960, 120, { pose: 'sit', look: .4 }); K.girl(ctx, t, 820 + Math.sin(t * .6) * 10, 972, 128, { pose: o.kidsLook ? 'look' : 'reach', look: o.kidsLook ? .8 : -.3, armR: o.kidsLook ? [2.4, 2.6] : undefined }); }
      if (o.ladder) {
        K.tree(ctx, t, 1470, 1000, 1.7, L, { apples: 26, wind: .4 });
        const L0 = [1250, 1000], L1 = [1420, 600]; K.ladder(ctx, ...L0, ...L1, L, 44);
        const hnd = K.bot(ctx, t, 1340, 820, 290, L, { pose: 'reach', dir: -1, armR: [2.3 + .25 * Math.sin(t * 1.4), 2.45], armL: o.ladder > 1 ? [-1.2 - .3 * Math.sin(t * 1.1), -1.5] : undefined, hand: 'gripper' });
        if (o.ladder > 1) { const p = (t * .5) % 1, ax = lerp(hnd.L[0], 1090, smooth(p)), ay = lerp(hnd.L[1], 900, p * p); ctx.fillStyle = '#e2553f'; ctx.beginPath(); ctx.arc(ax, ay, 10, 0, 7); ctx.fill();
          K.folk(ctx, t, 0, 1080, 1012, 140, { pose: 'lift', look: -.6 }); }
      }
      if (o.pod != null) K.pod(ctx, o.pod, 975, .95, L, { dir: o.podDir ?? -1 });
      if (o.you) K.you(ctx, t, o.you[0], o.you[1], o.you[2] ?? 230, { walk: o.youWalk, pose: o.youPose, dir: o.youDir ?? 1, look: o.youLook });
      if (o.girlAt) K.girl(ctx, t, o.girlAt[0], o.girlAt[1], o.girlAt[2] ?? 150, { pose: o.girlPose, walk: o.girlWalk, dir: o.girlDir ?? 1 });
      if (o.focus) o.focus(ctx, t);
    }],
    [1150, () => {
      if (o.fore === false) return;
      const sw = Math.sin(t * .7) * 6;   // an apple branch out of focus, top right
      ctx.fillStyle = mixHex(L.leafS, '#0c1438', .25); ctx.beginPath(); for (const [x, y, r] of [[2000, -60, 200], [1800, 10, 110], [1700, -20, 80], [1890, 90, 90]]) { ctx.moveTo(x + sw + r, y); ctx.arc(x + sw, y, r, 0, 7); } ctx.fill();
      ctx.fillStyle = rgba(mixHex(L.leaf, L.light, .2), .35); ctx.beginPath(); ctx.arc(1780 + sw, -10, 70, 0, 7); ctx.fill();
      if (o.apples) { ctx.fillStyle = '#c9402f'; for (const [x, y] of [[1800, 120], [1880, 150], [1700, 90]]) { ctx.beginPath(); ctx.arc(x + sw, y, 16, 0, 7); ctx.fill(); } }

    }],
  ]);
  return out;
}
export function chalk(ctx, t, x, y, u, L) {   // a chalk sun and a house on the road
  ctx.save(); ctx.strokeStyle = rgba('#fff6dc', .85); ctx.lineWidth = 5; ctx.lineCap = 'round';
  K.strokeIn(ctx, Array.from({ length: 33 }, (_, i) => [x + Math.cos(i / 32 * 6.283) * 60, y + Math.sin(i / 32 * 6.283) * 22]), u);
  for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283, uu = clamp(u * 2 - 1 - i * .05); if (uu > 0) K.strokeIn(ctx, [[x + Math.cos(a) * 80, y + Math.sin(a) * 30], [x + Math.cos(a) * 110, y + Math.sin(a) * 41]], uu); }
  ctx.strokeStyle = rgba('#ffb3a0', .8); K.strokeIn(ctx, [[x + 240, y + 30], [x + 240, y - 20], [x + 290, y - 50], [x + 340, y - 20], [x + 340, y + 30], [x + 240, y + 30]], clamp(u * 1.5 - .5));
  ctx.restore();
}
function chimeDots(ctx, t, hs, u) {   // a light point in every house, rings spreading (the noon chime)
  for (const g of hs) { if (!g.win) continue; const [wx, wy, ww, wh] = g.win[0]; const x = wx + ww / 2, y = wy + wh / 2, e = clamp(u);
    K.ring(ctx, t, x, y, 18 + 10 * e, e); }
}
function lanternString(ctx, t, x0, y0, x1, y1, L, a) {
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = rgba('#1a1a3a', .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2, y0 + 120, x1, y1); ctx.stroke();
  for (let i = 1; i < 14; i++) { const u = i / 14, x = lerp(x0, x1, u), y = lerp(y0, y1, u) + 120 * 2 * u * (1 - u) * 2 / 2 + Math.sin(t * 1.3 + i) * 3; const fl = .85 + .15 * Math.sin(t * 7 + i * 2.1);
    ctx.fillStyle = rad(ctx, x, y, 60, [[0, rgba('#ffd98a', .5 * fl)], [1, rgba('#ffb35c', 0)]]); ctx.fillRect(x - 60, y - 60, 120, 120); ctx.fillStyle = '#fff0c0'; ctx.beginPath(); ctx.arc(x, y + 8, 9, 0, 7); ctx.fill(); }
  ctx.restore();
}
// the roof robot on your house (g = house geometry): kneels on the slope, lays a tile, cyan joint light
export function roofBot(ctx, t, g, L, u = 1) {
  const [p0, p1] = g.roofPts, x = lerp(p0[0], p1[0], .62), y = lerp(p0[1], p1[1], .62);
  ctx.save(); ctx.translate(x, y); ctx.rotate(Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) * .35);
  K.bot(ctx, t, 0, 18, 210, L, { pose: 'reach', armR: [2.1 + .35 * Math.sin(t * 1.7), 1.6 + .3 * Math.sin(t * 1.7)], dir: 1 });
  ctx.restore();
}
// the printed house: u 0..1 (0 = empty lot with a ghost outline, .1–.9 walls rise in layers under a gantry, 1 = done with windows)
export function printedHouse(ctx, t, x, base, w, h, L, u) {
  if (u >= .98) return K.house(ctx, x, base, w, h, L, { col: '#e2d6bf', side: -1, lit: L.night, roof: 'flat', t, cols: 2, rows: 2 });
  ctx.save(); ctx.strokeStyle = rgba('#fffaf0', .5); ctx.setLineDash([12, 10]); ctx.lineWidth = 3; ctx.strokeRect(x, base - h, w, h); ctx.restore();
  const hh = h * clamp((u - .08) / .8), layers = Math.floor(hh / 14);
  for (let i = 0; i < layers; i++) { ctx.fillStyle = i % 2 ? mixHex('#d9cbb0', L.light, .2) : mixHex('#cbbd9f', L.shade, .15); ctx.fillRect(x, base - (i + 1) * 14, w, 14); }
  const gy = base - hh - 30; ctx.fillStyle = mixHex('#3a4a8a', L.shade, .2); ctx.fillRect(x - 40, gy, w + 80, 16); ctx.fillRect(x - 40, gy, 14, base - gy); ctx.fillRect(x + w + 26, gy, 14, base - gy);
  const nx = x + (Math.sin(t * 2.2) * .5 + .5) * w; ctx.fillRect(nx - 16, gy + 10, 32, 30); ctx.fillStyle = '#ffd98a'; ctx.beginPath(); ctx.arc(nx, gy + 44, 5, 0, 7); ctx.fill();
  return { x, base, w, h, win: [], door: [x + w * .4, base - h * .34, w * .2, h * .34] };
}
export function fusionFar(ctx, t, x, y, L, a = 1) {   // the fusion plant beyond the hills: a dome and a glowing ring
  ctx.save(); ctx.globalAlpha *= a; const c = K.hz('#c9cfe6', 9000, L);
  ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, 70, 46, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(x - 110, y - 8, 220, 10);
  K.ring(ctx, t, x, y - 18, 30, .8);
  ctx.restore();
}

// ---------------------------------------------------------------- the home: bedroom, kitchen, hallway
const ROOM = (L) => ({ wall: mixHex('#e7d6b8', L.light, .35), wallS: mixHex('#b9a48a', L.shade, .4), floor: mixHex('#a7785a', L.shade, .2), wood: mixHex('#8a5a3e', L.shade, .15) });
// sunlight patch through a window onto wall/floor
function sunPatch(ctx, pts, a, L) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(L.light, a); ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.closePath(); ctx.fill(); ctx.restore(); }
function windowView(ctx, t, x, y, w, h, L) {   // the street seen through a window (simplified): sky, a tree, a house
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, L.top], [1, L.low]]); ctx.fillRect(x, y, w, h);
  K.sunDisc(ctx, t, [x + w * .25, y + h * .3], L, 26);
  K.house(ctx, x + w * .5, y + h * .95, w * .45, h * .5, L, { col: '#b7c2a8', lit: 0 });
  K.tree(ctx, t, x + w * .2, y + h, .5, L, { apples: 6 });
  ctx.restore();
}
export function bedroom(ctx, t, cam, L, o = {}) {
  const R = ROOM(L);
  K.stage(ctx, cam, [
    [4200, () => { ctx.fillStyle = lin(ctx, 0, -300, 0, 900, [[0, R.wall], [1, R.wallS]]); ctx.fillRect(-1200, -800, W + 2400, 1700);
      windowView(ctx, t, 1180, 150, 420, 470, L); ctx.fillStyle = mixHex('#f4ecd8', L.light, .2); for (const [a, b, c, d] of [[1160, 130, 460, 20], [1160, 620, 460, 22], [1160, 130, 22, 510], [1580, 130, 22, 510], [1380, 140, 10, 480]]) ctx.fillRect(a, b, c, d);
      sunPatch(ctx, [[1180, 640], [1600, 640], [1500, 1000], [940, 1000]], .18, L);
      ctx.fillStyle = R.floor; ctx.fillRect(-1200, 880, W + 2400, 600); }],
    [2600, () => { // curtain swaying, the frame of a picture
      const s = Math.sin(t * .9) * 10; ctx.fillStyle = lin(ctx, 1090, 0, 1180, 0, [[0, mixHex('#e9c88f', L.shade, .2)], [1, mixHex('#f6dca8', L.light, .3)]]);
      ctx.beginPath(); ctx.moveTo(1060, 80); ctx.lineTo(1170, 80); ctx.quadraticCurveTo(1150 + s, 400, 1180 + s * 1.5, 720); ctx.lineTo(1040 + s, 720); ctx.quadraticCurveTo(1080 + s, 400, 1060, 80); ctx.fill();
      ctx.fillStyle = mixHex('#33497a', L.shade, .2); ctx.fillRect(420, 260, 300, 200); ctx.fillStyle = mixHex('#e7d19a', L.light, .2); ctx.fillRect(440, 280, 260, 160); ctx.save(); ctx.beginPath(); ctx.rect(440, 280, 260, 160); ctx.clip(); K.hills(ctx, 400, 20, mixHex('#5f8f4a', L.light, .2), 2, { x0: 440, x1: 700 }); ctx.restore(); }],
    [1700, () => { // bed, you sitting up, nightstand
      ctx.fillStyle = R.wood; ctx.fillRect(160, 560, 60, 380); ctx.fillStyle = lin(ctx, 0, 700, 0, 960, [[0, mixHex('#f3ead6', L.light, .3)], [1, mixHex('#c9bba0', L.shade, .3)]]); ctx.beginPath(); ctx.roundRect(200, 720, 880, 230, 30); ctx.fill();
      const up = o.up ?? 1;   // sitting up: 0 lying, 1 upright (torso above the blanket)
      K.you(ctx, t, 540, 1075 + (1 - up) * 200, 480, { lean: (1 - up) * -.9 - .05, look: o.youLook ?? .3 + .1 * Math.sin(t * .5), armR: [1.0, 2.2], armL: [-.5, -.3], dir: 1 });
      ctx.fillStyle = lin(ctx, 0, 760, 0, 960, [[0, mixHex('#6a86c4', L.light, .2)], [1, mixHex('#3e5a9a', L.shade, .25)]]); ctx.beginPath(); ctx.roundRect(300, 770, 780, 190, 40); ctx.fill();   // blanket
      ctx.fillStyle = rgba('#fffaf0', .12); ctx.beginPath(); ctx.ellipse(560, 790, 200, 18, 0, 0, 7); ctx.fill();
      ctx.fillStyle = lin(ctx, 0, 930, 0, 1100, [[0, mixHex(R.wood, L.light, .1)], [1, mixHex(R.wood, '#20264e', .3)]]); ctx.beginPath(); ctx.roundRect(180, 935, 920, 200, 14); ctx.fill();   // the bed's side
      // the nightstand: empty, a cup, a pale ring in the dust where the clock stood
      ctx.fillStyle = R.wood; ctx.fillRect(1100, 760, 230, 190); ctx.fillStyle = mixHex(R.wood, L.light, .25); ctx.fillRect(1090, 748, 250, 20);
      ctx.fillStyle = rgba(mixHex('#8f8a7a', L.light, .2), .55); ctx.fillRect(1094, 748, 242, 12);   // a film of dust
      ctx.strokeStyle = rgba('#fff6dc', .85); ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(1240, 754, 34, 6, 0, 0, 7); ctx.stroke();   // where the clock stood
      ctx.fillStyle = mixHex('#e9e3d3', L.light, .2); ctx.fillRect(1130, 712, 40, 38); ctx.strokeStyle = rgba('#fffaf0', .3 + .2 * Math.sin(t * 2)); ctx.lineWidth = 2; for (let k = 0; k < 2; k++) { ctx.beginPath(); ctx.moveTo(1142 + k * 14, 704); ctx.bezierCurveTo(1135 + k * 14, 690 - 6 * Math.sin(t * 1.5 + k), 1155 + k * 14, 680, 1146 + k * 14, 664); ctx.stroke(); }
    }],
    [1150, () => { ctx.fillStyle = rgba('#20264e', .85); ctx.beginPath(); ctx.ellipse(1900, 1060, 300, 160, 0, 0, 7); ctx.fill(); }],
  ]);
}
// the old brass alarm clock with two bells (prop); ring 0..1 shakes the bells; returns the face centre
export function alarmClock(ctx, t, x, y, s, o = {}) {
  const sh = (o.ring ?? 0) * Math.sin(t * 70) * .06;
  ctx.save(); ctx.translate(x, y); ctx.rotate(sh + (o.rot ?? 0)); ctx.scale(s, s);
  const brass = lin(ctx, -60, -60, 60, 60, [[0, '#ffe2a0'], [.5, '#d4a24c'], [1, '#8a5a24']]);
  ctx.fillStyle = brass; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 40, -58, 26, Math.PI, 0); ctx.fill(); }
  ctx.fillRect(-4, -92, 8, 20); ctx.fillStyle = '#6a4418'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 30, 52); ctx.lineTo(sx * 46, 74); ctx.lineTo(sx * 38, 74); ctx.lineTo(sx * 22, 54); ctx.fill(); }
  ctx.fillStyle = brass; ctx.beginPath(); ctx.arc(0, 0, 62, 0, 7); ctx.fill();
  ctx.fillStyle = '#fbf4e0'; ctx.beginPath(); ctx.arc(0, 0, 50, 0, 7); ctx.fill();
  ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 3; for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 40, Math.sin(a) * 40); ctx.lineTo(Math.cos(a) * 46, Math.sin(a) * 46); ctx.stroke(); }
  ctx.lineWidth = 4; ctx.lineCap = 'round'; const hh = o.hh ?? -1.9, mm = o.mm ?? -1.57 + .9; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(hh) * 24, Math.sin(hh) * 24); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(mm) * 36, Math.sin(mm) * 36); ctx.stroke();
  ctx.strokeStyle = '#c8473a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(-2.4) * 34, Math.sin(-2.4) * 34); ctx.stroke();
  ctx.fillStyle = rgba('#ffffff', .35); ctx.beginPath(); ctx.ellipse(-18, -22, 14, 7, -.6, 0, 7); ctx.fill();
  if (o.ring) { ctx.strokeStyle = rgba('#ffe7a8', .7 * o.ring); ctx.lineWidth = 3; for (const sx of [-1, 1]) for (let k = 0; k < 3; k++) { const p = (t * 2.4 + k / 3) % 1; ctx.globalAlpha = 1 - p; ctx.beginPath(); ctx.arc(sx * 40, -64, 34 + p * 60, sx < 0 ? 3.6 : 4.8, sx < 0 ? 4.6 : 5.8); ctx.stroke(); } ctx.globalAlpha = 1; }
  ctx.restore();
  return [x, y, 62 * s];
}
export function kitchen(ctx, t, cam, L, o = {}) {
  const R = ROOM(L);
  K.stage(ctx, cam, [
    [5200, () => { ctx.fillStyle = lin(ctx, 0, -300, 0, 900, [[0, R.wall], [1, R.wallS]]); ctx.fillRect(-1200, -800, W + 2400, 1700);
      windowView(ctx, t, 1240, 170, 520, 430, L); ctx.fillStyle = mixHex('#f4ecd8', L.light, .2); for (const [a, b, c, d] of [[1222, 152, 556, 20], [1222, 598, 556, 24], [1222, 152, 20, 470], [1758, 152, 20, 470], [1492, 160, 12, 440]]) ctx.fillRect(a, b, c, d);
      if (o.strollers) for (let i = 0; i < 3; i++) K.folk(ctx, t, i + 1, 1260 + ((t * 18 + i * 170) % 520), 590, 62, { walk: K.walkPh(t, .45) + i, dir: 1 });
      ctx.fillStyle = mixHex('#7a8db8', L.shade, .3); ctx.fillRect(100, 560, 380, 24); for (let i = 0; i < 4; i++) { ctx.fillStyle = ['#e2553f', '#f0a23a', '#5f8f4a', '#e7d19a'][i]; ctx.beginPath(); ctx.arc(160 + i * 70, 540, 22, 0, 7); ctx.fill(); }
      sunPatch(ctx, [[1240, 600], [1760, 600], [1580, 1000], [900, 1000]], .16, L); ctx.fillStyle = R.floor; ctx.fillRect(-1200, 900, W + 2400, 600); }],
    [2400, () => { // the table with the old box, the girl
      ctx.fillStyle = R.wood; ctx.fillRect(260, 760, 980, 36); ctx.fillRect(300, 790, 30, 200); ctx.fillRect(1170, 790, 30, 200);
      ctx.fillStyle = mixHex('#a7744a', L.shade, .2); ctx.fillRect(820, 650, 260, 112); ctx.fillStyle = mixHex('#c79a6a', L.light, .2); ctx.beginPath(); ctx.moveTo(820, 650); ctx.lineTo(1080, 650); ctx.lineTo(1120, 600); ctx.lineTo(860, 600); ctx.fill();
      if (o.box) o.box(ctx, t);
      const hd = K.girl(ctx, t, o.girlX ?? 700, 990 - (o.girlHop ?? 0), o.girlH ?? 330, { pose: o.girlPose ?? 'lift', armR: o.armR, armL: o.armL, look: o.girlLook ?? .2, dir: o.girlDir ?? 1, lean: o.girlLean });
      if (o.clock) o.clock(ctx, t, hd);
    }],
    [1500, () => { if (o.you) K.you(ctx, t, o.you[0], o.you[1], o.you[2], { pose: o.youPose ?? 'stand', dir: o.youDir ?? -1, look: o.youLook ?? -.3, back: o.youBack ?? .4 }); }],
  ]);
}
export function hallway(ctx, t, cam, L, open, o = {}) {   // the front door from inside; open 0..1 swings it into light; returns the door rect (screen at home cam)
  const R = ROOM(L), door = [760, 190, 400, 760];
  K.stage(ctx, cam, [
    [3000, () => { ctx.fillStyle = lin(ctx, 0, -300, 0, 1000, [[0, mixHex(R.wallS, '#20264e', .3)], [1, mixHex(R.wall, R.wallS, .5)]]); ctx.fillRect(-1200, -800, W + 2400, 1700);
      ctx.fillStyle = mixHex(R.floor, '#20264e', .25); ctx.fillRect(-1200, 950, W + 2400, 600); ctx.fillStyle = mixHex('#c4583a', L.shade, .35); ctx.beginPath(); ctx.moveTo(700, 960); ctx.lineTo(1220, 960); ctx.lineTo(1500, 1200); ctx.lineTo(420, 1200); ctx.fill();   // runner
      ctx.fillStyle = mixHex('#33497a', L.shade, .2); ctx.fillRect(1330, 360, 220, 160); ctx.fillStyle = mixHex('#e7d19a', L.light, .1); ctx.fillRect(1345, 375, 190, 130); ctx.fillStyle = mixHex('#c4583a', L.light, .1); ctx.beginPath(); ctx.arc(1440, 450, 30, 0, 7); ctx.fill();   // a child's drawing
      ctx.fillStyle = mixHex(R.wood, '#20264e', .2); ctx.fillRect(1300, 820, 300, 130); for (let i = 0; i < 4; i++) { ctx.fillStyle = ['#2e4a8a', '#c4583a', '#f2b632', '#5d6b8f'][i]; ctx.beginPath(); ctx.ellipse(1340 + i * 70, 810, 28, 12, 0, 0, 7); ctx.fill(); }
      ctx.fillStyle = lin(ctx, 0, 190, 0, 950, [[0, L.top], [.55, L.low], [.56, L.walk], [1, L.road]]); ctx.fillRect(...door);
      ctx.save(); ctx.beginPath(); ctx.rect(...door); ctx.clip(); K.tree(ctx, t, 860, 960, .9, L, { apples: 10 }); K.house(ctx, 1000, 780, 300, 300, L, { col: '#b7c2a8' }); ctx.restore();
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, 960, 600, 700 * (.3 + open), [[0, rgba(L.light, .45 * open)], [1, rgba(L.light, 0)]]); ctx.fillRect(-400, -300, W + 800, H + 600);
      ctx.fillStyle = rgba(L.light, .25 * open); ctx.beginPath(); ctx.moveTo(760, 950); ctx.lineTo(1160, 950); ctx.lineTo(1500, 1100); ctx.lineTo(420, 1100); ctx.fill(); ctx.restore();
      // the door leaf, swinging inward to the left
      const wq = 400 * (1 - .82 * K.quartIO(open)); ctx.fillStyle = lin(ctx, 760, 0, 760 + wq, 0, [[0, '#d99a2a'], [1, '#ffd36a']]); ctx.beginPath(); ctx.moveTo(760, 190); ctx.lineTo(760 + wq, 190 - 40 * open); ctx.lineTo(760 + wq, 950 + 40 * open); ctx.lineTo(760, 950); ctx.fill();
      ctx.fillStyle = '#5a3a18'; ctx.beginPath(); ctx.arc(760 + wq * .88, 580, 8, 0, 7); ctx.fill();
      ctx.fillStyle = mixHex(R.wood, '#20264e', .3); ctx.fillRect(730, 170, 460, 24); ctx.fillRect(730, 170, 30, 790); ctx.fillRect(1160, 170, 30, 790); }],
    [1600, () => { // coat hooks, the girl looking at the door, you
      ctx.fillStyle = mixHex('#6a4a3a', '#20264e', .3); ctx.fillRect(250, 330, 300, 16);
      ctx.fillStyle = lin(ctx, 260, 0, 400, 0, [[0, K.COAT.shade], [.6, K.COAT.base], [1, K.COAT.lit]]); ctx.beginPath(); ctx.moveTo(318, 346); ctx.quadraticCurveTo(250, 360, 262, 420); ctx.lineTo(250, 620); ctx.lineTo(410, 620); ctx.lineTo(398, 420); ctx.quadraticCurveTo(410, 360, 342, 346); ctx.closePath(); ctx.fill();   // your yellow coat on the hook
      ctx.fillStyle = rgba(K.COAT.deep, .35); ctx.fillRect(328, 380, 4, 230);
      if (o.girl !== false) K.girl(ctx, t, 560, 1040, 430, { look: .9, dir: 1, back: .3, pose: o.girlPose, armR: o.girlArm });
      if (o.you) K.you(ctx, t, o.you, 1010, 470, { dir: 1, back: .7, walk: o.youWalk });
    }],
  ]);
  return door;
}
