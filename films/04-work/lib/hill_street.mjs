// hill_street.mjs · HILL 3: the cut-away street on the Esteem / Self-actualization terrace (A2 look: petrol night,
// warm rooms, stipple light, hatched walls). A 5600 px panorama in plate coords, cached as three parallax layers
// (back p .55 · houses + rooms p 1 · street + lamp posts p 1.18) + one front panel per room that lifts away.
// Everything that moves (figures, wheel, balls, bow, plane, paper doves, the sign) is drawn per frame.
import { C, rgba, clamp, mix, prng, mixHex, shade, roughPath, roughPoly, roughRect, roughLine, sagLine, hatch, house, vnoise } from './art.mjs';
import { cv, toImg, fx, fogW, bloomW, coneW, poolW, mLin, mRad, mips, drawLayer, proj, setRegion, fig, q, drift } from './hill_art.mjs';
import { text } from '../engine.mjs';

export const FL = 850;                       // floor line of the rooms (plate px)
const sm = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
const lin = (a, b, t) => clamp((t - a) / (b - a));
// rooms: x0..x1, ceiling y, theme
export const ROOMS = [
  { id: 'potter', x0: 300, x1: 920, cy: 452, wall: ['#7a4636', '#3e2230'], lamp: .5, top: 210, roof: 'gable', bw: '#16232c' },
  { id: 'violin', x0: 1180, x1: 1800, cy: 470, wall: ['#5a4472', '#2c2244'], lamp: .62, top: 120, roof: 'mansard', bw: '#1a2833', jug: { x0: 1360, x1: 1640, y0: 236, y1: 410 } },
  { id: 'carp', x0: 2060, x1: 2700, cy: 440, wall: ['#86563a', '#3a2418'], lamp: .55, top: 190, roof: 'hip', bw: '#14212a' },
  { id: 'office', x0: 2960, x1: 3560, cy: 300, wall: ['#5d6c74', '#2a3640'], lamp: .5, top: 268, roof: 'flatopen', bw: '#1b2830', cold: true },
  { id: 'sign', x0: 3820, x1: 4440, cy: 462, wall: ['#6c3e58', '#33203c'], lamp: .58, top: 160, roof: 'gable', bw: '#172530' },
  { id: 'sew', x0: 4700, x1: 5240, cy: 470, wall: ['#3f5a5a', '#1d2a33'], lamp: .45, top: 230, roof: 'steep', bw: '#132028' },
];
const BACK = { x: -1400, y: -700, w: 7600, h: 1400 }, MID = { x: -200, y: -300, w: 6000, h: 1180 }, FRONT = { x: -600, y: 840, w: 7400, h: 1000 };
let L = null;
function mk(rect, S, paint) { const [c, g] = cv(rect.w * S, rect.h * S); g.setTransform(S, 0, 0, S, -rect.x * S, -rect.y * S); setRegion([rect.x, rect.y, rect.x + rect.w, rect.y + rect.h]); paint(g, S); setRegion(null); return c; }
const WARM = '#ffb35c', HOT = '#ffd9a0';

function paintBack(ctx, S) {
  const g = ctx.createLinearGradient(0, BACK.y, 0, 560); g.addColorStop(0, '#050c14'); g.addColorStop(.45, '#0d2232'); g.addColorStop(.8, '#21454f'); g.addColorStop(1, '#3d6a6c');
  ctx.fillStyle = g; ctx.fillRect(BACK.x, BACK.y, BACK.w, BACK.h);
  const r = prng(8); for (let i = 0; i < 900; i++) { const x = BACK.x + r() * BACK.w, y = BACK.y + Math.pow(r(), 1.5) * 800, m = r(); ctx.fillStyle = rgba('#d9f0ee', .1 + .5 * m * m * m); const s = m > .96 ? 2 : 1; ctx.fillRect(x, y, s, s); }
  fogW(ctx, S, { x0: BACK.x, x1: BACK.x + BACK.w, y0: -60, y1: 330, col: '#6f9da1', a: .35, seed: 61, cover: .6, soft: .5, k: .2, sx: .002, sy: .02, edgeTop: .8, edgeBot: .2 });
  // the next terrace up: a row of small houses behind a retaining wall (we are inside the hill town)
  const rr = prng(31); let x = BACK.x;
  while (x < BACK.x + BACK.w) { const w = 50 + rr() * 80, h = 50 + rr() * 70, gy = 250 + rr() * 8;
    house(ctx, rr, x + w / 2, gy, w, h, { wall: mixHex('#1c3640', '#2a4a52', rr()), lit: (a, b, q2) => q2() < .18 ? .75 : 0, amp: .6, floorH: 24, colW: 22, trim: false, door: false, chimney: .4, roofs: ['gable', 'flat', 'hip', 'gable', 'steep', 'parapet'] });
    x += w + rr() * 6; }
  fogW(ctx, S, { x0: BACK.x, x1: BACK.x + BACK.w, y0: 150, y1: 290, col: '#86b4b2', a: .45, seed: 6, cover: .7, soft: .4, k: .25, sx: .004, sy: .03, edgeTop: .3, edgeBot: .5 });
  roughRect(ctx, BACK.x, 250, BACK.w, 120, '#0f1e26', { amp: 1, seed: 3 });
  ctx.fillStyle = rgba(HOT, .22); ctx.fillRect(BACK.x, 250, BACK.w, 1.5);
  ctx.save(); ctx.beginPath(); ctx.rect(BACK.x, 252, BACK.w, 118); ctx.clip(); hatch(ctx, [BACK.x, 252, BACK.w, 118], { angle: 0, gap: 9, w: 1, col: '#5d8088', a: .12, seed: 4, broken: .5 }); ctx.restore();
}
function roofPts(R, x0, x1, top) {
  const w = x1 - x0;
  switch (R.roof) {
    case 'gable': return [[x0 - 14, top], [x0 + w / 2, top - w * .22], [x1 + 14, top]];
    case 'mansard': return [[x0 - 10, top], [x0 + w * .1, top - 70], [x1 - w * .1, top - 70], [x1 + 10, top]];
    case 'hip': return [[x0 - 14, top], [x0 + w * .3, top - 90], [x1 - w * .3, top - 90], [x1 + 14, top]];
    case 'steep': return [[x0 - 10, top], [x0 + w / 2, top - w * .45], [x1 + 10, top]];
    default: return [[x0 - 6, top], [x0 - 6, top - 16], [x1 + 6, top - 16], [x1 + 6, top]];
  }
}
function paintMid(ctx, S) {
  const r = prng(17);
  // a darker row of houses set back behind the street (fills the alleys, gives depth between the cut-away houses)
  { const rr = prng(23); let x = MID.x;
    while (x < MID.x + MID.w) { const w = 130 + rr() * 150, h = FL - 300 - rr() * 120;
      house(ctx, rr, x + w / 2, FL, w, h, { wall: mixHex('#0d171e', '#15232b', rr()), lit: (a, b, q2) => q2() < .12 ? .55 + .3 * q2() : 0, amp: 1, floorH: 110, colW: 80, wscale: 1.8, trim: false, door: false, chimney: .5, roofs: ['gable', 'flat', 'hip', 'steep', 'parapet'] });
      x += w + 4 + rr() * 8; }
    fogW(ctx, S, { x0: MID.x, x1: MID.x + MID.w, y0: 250, y1: FL, col: '#4f7f84', a: .32, seed: 41, cover: .6, soft: .5, k: .25, sx: .003, sy: .015, edgeTop: .4, edgeBot: .6 }); }
  // continuous building mass between the rooms (alleys, side walls in 3/4 so it never reads as tiles)
  for (let i = 0; i < ROOMS.length; i++) {
    const R = ROOMS[i], x0 = R.x0 - 70, x1 = R.x1 + 70, top = R.top;
    // side wall in perspective (alternating sides) + a dark alley before the next house
    const sd = i % 2 ? 1 : -1, sw = 46;
    roughPoly(ctx, sd < 0 ? [[x0, top + 4], [x0 - sw, top + 18], [x0 - sw, FL + 6], [x0, FL]] : [[x1, top + 4], [x1 + sw, top + 18], [x1 + sw, FL + 6], [x1, FL]], shade(R.bw, -.04), { amp: 1, seed: i + 70 });
    roughPoly(ctx, [...roofPts(R, x0, x1, top), [x1, FL], [x0, FL]], R.bw, { amp: 1.4, seed: i + 10 });
    if (R.roof !== 'flatopen') roughPoly(ctx, roofPts(R, x0, x1, top), shade(R.bw, -.05), { amp: 1.2, seed: i + 20 });
    ctx.save(); ctx.beginPath(); roughPath(ctx, [...roofPts(R, x0, x1, top), [x1, FL], [x0, FL]], { amp: 1.4, seed: i + 10 }); ctx.clip();
    hatch(ctx, [x0 - 30, top - 200, x1 - x0 + 60, FL - top + 220], { angle: -.9, gap: 7, w: 1, col: '#8fb4b8', a: .07, seed: 30 + i, broken: .45 });
    const sh = ctx.createLinearGradient(x0, 0, x1, 0); sh.addColorStop(0, rgba('#9fc4c8', .06)); sh.addColorStop(1, rgba('#000000', .14)); ctx.fillStyle = sh; ctx.fillRect(x0, top - 300, x1 - x0, 1000);
    ctx.restore();
    // cornice + upper windows (some warm)
    roughRect(ctx, x0 - 6, top - 2, x1 - x0 + 12, 8, shade(R.bw, .03), { amp: .5, seed: i + 30 });
    if (R.id !== 'office') {
      const floors = Math.max(1, Math.round((R.cy - top - 40) / 120)), cols = Math.round((x1 - x0) / 120);
      for (let f = 0; f < floors; f++) for (let c = 0; c < cols; c++) {
        const wx = x0 + (c + .5) * (x1 - x0) / cols, wy = top + 34 + f * ((R.cy - top - 40) / floors), ww = 34 + r() * 10, wh = Math.min(70, (R.cy - top - 40) / floors - 34);
        if (R.jug && wx > R.jug.x0 - 40 && wx < R.jug.x1 + 40 && f === floors - 1) continue;
        const lit = r() < .3;
        roughRect(ctx, wx - ww / 2 - 4, wy - 4, ww + 8, wh + 10, shade(R.bw, .035), { amp: .4, seed: f * 9 + c });
        roughRect(ctx, wx - ww / 2, wy, ww, wh, lit ? mixHex('#c87a3a', HOT, r()) : shade(R.bw, -.05), { amp: .4, seed: f * 7 + c + i });
        if (lit) { ctx.fillStyle = rgba(shade(R.bw, -.08), .8); ctx.fillRect(wx - .8, wy, 1.6, wh); ctx.fillRect(wx - ww / 2, wy + wh * .45, ww, 1.6); }
      }
    }
    if (R.jug) { const J = R.jug; roughRect(ctx, J.x0 - 8, J.y0 - 8, J.x1 - J.x0 + 16, J.y1 - J.y0 + 22, shade(R.bw, .04), { amp: .5, seed: 99 }); }
    // the room (cut-away interior): back wall, floor, shelves, pendant lamp, light cone
    const g = ctx.createLinearGradient(0, R.cy, 0, FL); g.addColorStop(0, R.wall[0]); g.addColorStop(1, R.wall[1]);
    roughRect(ctx, R.x0, R.cy, R.x1 - R.x0, FL - R.cy, null, { amp: .6, seed: i }); ctx.fillStyle = g; ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.rect(R.x0, R.cy, R.x1 - R.x0, FL - R.cy); ctx.clip();
    hatch(ctx, [R.x0, R.cy, R.x1 - R.x0, FL - R.cy], { angle: 1.57, gap: 26, w: 1.2, col: '#000000', a: .08, seed: 50 + i, broken: .2 });   // panelling
    roughRect(ctx, R.x0, FL - 30, R.x1 - R.x0, 30, shade(R.wall[1], -.04), { amp: .4, seed: i + 3 });
    const lx = mix(R.x0, R.x1, R.lamp);
    ctx.strokeStyle = 'rgba(15,10,20,.85)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx, R.cy); ctx.lineTo(lx, R.cy + 46); ctx.stroke();
    roughPoly(ctx, [[lx - 20, R.cy + 64], [lx + 20, R.cy + 64], [lx + 9, R.cy + 46], [lx - 9, R.cy + 46]], '#241a22', { amp: .4, seed: i + 4 });
    coneW(ctx, S, lx, R.cy + 64, { dir: 0, spread: .62, len: FL - R.cy - 60, col: R.cold ? '#cfe6ee' : '#ffe0b0', a: R.cold ? .22 : .32, k: .4, seed: 60 + i });
    bloomW(ctx, S, lx, R.cy + 66, (R.x1 - R.x0) * .55, { col: R.cold ? '#bfe0ea' : WARM, core: R.cold ? '#f0fbff' : '#fff1d0', a: R.cold ? .3 : .5, k: .3, seed: 70 + i });
    bloomW(ctx, S, lx, R.cy + 66, 30, { core: '#fff8e6', a: .9, k: .1, seed: 80 + i });
    // furniture per trade
    const rr = prng(200 + i);
    if (R.id === 'potter') { for (const sy of [560, 640]) { roughRect(ctx, R.x0 + 30, sy, 200, 6, '#2a1a1e', { amp: .4, seed: sy }); for (let k = 0; k < 5; k++) { ctx.fillStyle = ['#c98f6a', '#d9b48f', '#a86a5a'][k % 3]; ctx.beginPath(); ctx.ellipse(R.x0 + 52 + k * 38, sy - 15, 11 - (k % 2) * 3, 15, 0, 0, 7); ctx.fill(); } } }
    if (R.id === 'violin') { roughRect(ctx, R.x0 + 40, R.cy + 70, 90, 110, '#2c2238', { amp: .5, seed: 5 }); roughRect(ctx, R.x0 + 50, R.cy + 80, 70, 90, '#8a6a9a', { amp: .5, seed: 6 }); }
    if (R.id === 'carp') { for (let k = 0; k < 7; k++) roughRect(ctx, R.x0 + 40 + k * 26, 560, 5, 44 + (k * 13) % 30, '#4a2a18', { amp: .5, seed: k }); roughRect(ctx, R.x0 + 30, 554, 200, 6, '#3a1a10', { amp: .5, seed: 9 }); }
    if (R.id === 'office') { // fluorescent tubes, filing cabinets, desks with paper stacks
      for (let k = 0; k < 3; k++) { roughRect(ctx, R.x0 + 80 + k * 170, R.cy + 20, 110, 6, '#dfeef2', { amp: .3, seed: k }); }
      for (let k = 0; k < 4; k++) roughRect(ctx, R.x1 - 80 - k * 0, 560 + k * 70, 60, 64, '#3a464e', { amp: .4, seed: k + 3 });
      for (let k = 0; k < 3; k++) { const dx = R.x0 + 60 + k * 160; roughRect(ctx, dx, 740, 130, 10, '#26323a', { amp: .4, seed: k + 9 }); roughRect(ctx, dx + 8, 750, 8, 100, '#1e282e', { amp: .3, seed: k }); roughRect(ctx, dx + 114, 750, 8, 100, '#1e282e', { amp: .3, seed: k + 1 }); }
    }
    if (R.id === 'sign') { for (let k = 0; k < 4; k++) { ctx.fillStyle = ['#e8a3a0', '#ffb35c', '#8fe6ff', '#f3efe2'][k]; ctx.beginPath(); ctx.arc(R.x0 + 60 + k * 22, 600, 8, 0, 7); ctx.fill(); } roughRect(ctx, R.x0 + 40, 612, 110, 6, '#2a1a22', { amp: .4, seed: 4 }); }
    if (R.id === 'sew') { for (let k = 0; k < 6; k++) roughRect(ctx, R.x0 + 40 + k * 30, 560, 22, 70, ['#c4482a', '#e8d6b4', '#3f7f8a', '#d9a35a'][k % 4], { amp: .5, seed: k }); }
    ctx.restore();
    // a dark sill strip so the cut-away reads as a cut through a wall
    roughRect(ctx, R.x0 - 4, FL - 2, R.x1 - R.x0 + 8, 10, '#0b1418', { amp: .4, seed: i + 40 });
  }
  // the juggler's upstairs room
  { const J = ROOMS[1].jug, g = ctx.createRadialGradient((J.x0 + J.x1) / 2, J.y0 + 30, 0, (J.x0 + J.x1) / 2, J.y0 + 30, 180); g.addColorStop(0, '#f2b46a'); g.addColorStop(1, '#8a4a2a'); ctx.fillStyle = g; roughRect(ctx, J.x0, J.y0, J.x1 - J.x0, J.y1 - J.y0, null, { amp: .5, seed: 98 }); ctx.fill(); }
}
function paintFront(ctx, S) {
  const g = ctx.createLinearGradient(0, FL, 0, FRONT.y + FRONT.h); g.addColorStop(0, '#1b2a32'); g.addColorStop(.3, '#121c24'); g.addColorStop(1, '#070b10');
  ctx.fillStyle = g; ctx.fillRect(FRONT.x, FL + 8, FRONT.w, FRONT.h);
  roughRect(ctx, FRONT.x, FL + 8, FRONT.w, 26, '#22323a', { amp: .8, seed: 2 });       // sidewalk
  ctx.fillStyle = rgba('#86a8ac', .25); ctx.fillRect(FRONT.x, FL + 34, FRONT.w, 2);
  const n1 = vnoise(9); ctx.strokeStyle = '#5d8088'; ctx.lineWidth = 1;
  for (let k = 0; k < 40; k++) { const y = FL + 44 + Math.pow(k / 40, 1.4) * 760; ctx.globalAlpha = .05 + .05 * (k % 2); ctx.beginPath(); let pen = false; for (let x = FRONT.x; x < FRONT.x + FRONT.w; x += 14) { if (n1(x * .01, k * 3) < .35) { pen = false; continue; } const Y = y + (n1(x * .02, k) - .5) * 3; pen ? ctx.lineTo(x, Y) : ctx.moveTo(x, Y); pen = true; } ctx.stroke(); }
  ctx.globalAlpha = 1;
  // light pools under every room (the rooms light the street)
  for (const R of ROOMS) poolW(ctx, S, (R.x0 + R.x1) / 2, FL + 70, (R.x1 - R.x0) * .62, 90, { col: R.cold ? '#bfe0ea' : WARM, a: R.cold ? .16 : .3, k: .5, seed: R.x0 | 0 });
  // lamp posts (foreground, between the rooms)
  for (let i = 0; i <= ROOMS.length; i++) { const x = i < ROOMS.length ? ROOMS[i].x0 - 130 : ROOMS[ROOMS.length - 1].x1 + 130, y = FL + 120;
    roughLine(ctx, [[x, y], [x, y - 470]], { w: 6, col: '#060c11', seed: i }); roughLine(ctx, [[x, y - 470], [x + 34, y - 476]], { w: 4, col: '#060c11', seed: i + 9 });
    roughRect(ctx, x + 24, y - 482, 22, 12, '#060c11', { amp: .3, seed: i });
    coneW(ctx, S, x + 35, y - 470, { dir: .05, spread: .42, len: 380, col: WARM, a: .25, k: .45, seed: 90 + i });
    bloomW(ctx, S, x + 35, y - 468, 26, { a: .9, k: .1, seed: 95 + i });
    poolW(ctx, S, x + 50, y + 10, 160, 34, { a: .25, k: .5, seed: 99 + i }); }
}
// front panels (the house fronts that lift away)
function paintPanel(R, i) {
  const w = R.x1 - R.x0 + 20, h = FL - R.cy + 14, [c, ctx] = cv(w, h), r = prng(400 + i);
  ctx.translate(10 - R.x0, -R.cy + 4);
  roughRect(ctx, R.x0 - 10, R.cy - 4, w, h, shade(R.bw, .02), { amp: 1, seed: i });
  ctx.save(); ctx.beginPath(); ctx.rect(R.x0 - 10, R.cy - 4, w, h); ctx.clip(); hatch(ctx, [R.x0 - 10, R.cy - 4, w, h], { angle: -.9, gap: 7, w: 1, col: '#8fb4b8', a: .08, seed: 30 + i, broken: .45 }); ctx.restore();
  // shop window + door
  const sw0 = R.x0 + 40, sw1 = R.x1 - 150, sy0 = R.cy + 90, sy1 = FL - 60;
  roughRect(ctx, sw0 - 8, sy0 - 8, sw1 - sw0 + 16, sy1 - sy0 + 16, shade(R.bw, .05), { amp: .5, seed: i + 1 });
  const g = ctx.createLinearGradient(0, sy0, 0, sy1); g.addColorStop(0, rgba(mixHex(R.wall[0], '#ffb35c', .3), .9)); g.addColorStop(1, rgba(R.wall[1], .95));
  roughRect(ctx, sw0, sy0, sw1 - sw0, sy1 - sy0, null, { amp: .5, seed: i + 2 }); ctx.fillStyle = g; ctx.fill();
  ctx.fillStyle = rgba('#0b1418', .9); for (const u of [.33, .66]) ctx.fillRect(mix(sw0, sw1, u) - 3, sy0, 6, sy1 - sy0);
  roughRect(ctx, R.x1 - 120, FL - 230, 80, 230, shade(R.bw, -.06), { amp: .5, seed: i + 3 });
  ctx.fillStyle = rgba(HOT, .5); ctx.fillRect(R.x1 - 116, FL - 226, 72, 3);
  roughRect(ctx, R.x0 - 10, sy0 - 52, w, 26, shade(R.bw, -.03), { amp: .5, seed: i + 4 });
  return toImg(c);
}
export function streetLayers() {
  if (L) return L;
  L = { B: { m: mips(mk(BACK, 1, paintBack), 1), ...BACK }, M: { m: mips(mk(MID, 1, paintMid), 1), ...MID }, F: { m: mips(mk(FRONT, 1, paintFront), 1), ...FRONT }, P: ROOMS.map(paintPanel) };
  return L;
}
export async function prepareStreet() { const l = streetLayers(); const all = [l.B, l.M, l.F].flatMap((x) => x.m.map((m) => m.c)).concat(l.P); await Promise.all(all.map((im) => im.decode())); }

// ------------------------------------------------------------------ per-frame
const S11 = 1.1;
function F(ctx, M, key, x, feetY, s, pose, o, t, ph = 0, alpha = 1) {
  const sR = s * 1.15, sc = s * M.k / sR, hipY = M.Y(feetY) - 88 * s * M.k;
  const e = fig(ctx, key, M.X(x), hipY, sR, pose, o, { t, ph, alpha, sc });
  return { hand: (i) => { const [hx, hy] = e.hand(i); return [M.X(x) + (hx - e.pad) * sc, hipY + (hy - e.pad) * sc]; } };
}
const RIM = '#ffd9a8';
const walkPose = (ph, extra = {}) => { const s = Math.sin(ph * 6.283); return { lean: .04, head: 0, sh: [.25 * s, -.25 * s], el: [.35, .35], hip: [.38 * s, -.38 * s], kn: [.05 + .3 * Math.max(0, -s), .05 + .3 * Math.max(0, s)], ...extra }; };

// tm = { lift: t, joy, violin, grand, disappear, meaning, look, working, end }
export function drawStreet(ctx, t, cam, tm, { strokeU = 0 } = {}) {
  const Ly = streetLayers();
  const Mb = proj(cam, .55), M = proj(cam, 1), Mf = proj(cam, 1.18);
  ctx.fillStyle = '#050c14'; ctx.fillRect(0, 0, 1920, 1080);
  drawLayer(ctx, Ly.B, Mb);
  drawLayer(ctx, Ly.M, M);
  const k = M.k;
  // the office: roof panels slide open, the cold room below
  { const R = ROOMS[3], o = sm(lin(tm.disappear - 1.7, tm.disappear - .7, t)), x0 = R.x0 - 70, x1 = R.x1 + 70, w = (x1 - x0) / 2;
    for (const s of [-1, 1]) { const xa = s < 0 ? x0 - o * w * .9 : x0 + w + o * w * .9; ctx.fillStyle = '#121d24'; ctx.fillRect(M.X(xa), M.Y(R.top - 20), w * k, 22 * k); ctx.fillStyle = rgba('#9fc4c8', .2); ctx.fillRect(M.X(xa), M.Y(R.top - 20), w * k, 2); } }
  // ---- room life
  const room = (i) => ROOMS[i];
  // potter
  { const R = room(0), px = R.x0 + 250, ph = q((t * 1.3) % 1, 6), sway = Math.sin(ph * 6.283) * .05;
    roughRect(ctx, M.X(px - 24), M.Y(FL - 60), 48 * k, 8 * k, '#2a1a1e', { amp: .3, seed: 1 }); ctx.fillStyle = '#2a1a1e'; ctx.fillRect(M.X(px - 4), M.Y(FL - 52), 8 * k, 52 * k);
    const P = { lean: .32 + sway, head: .4, sh: [.95 + sway, .72 + sway], el: [.55, .75], hip: [1.5, 1.45], kn: [1.5, 1.4], hair: 'bun' };
    const f = F(ctx, M, 'pot' + ph, px, FL - 60 + 88 * S11 - 4, S11, P, { dress: { coat: '#5a2c1e', pants: '#2a140e', shoes: '#120a08', skin: '#c98a66', hair: '#1a0c08' }, rim: RIM, rimSide: 1, light: { x: 900, y: 500, col: '#ffe9c4', a: .4 } }, t, 1);
    const [hx, hy] = f.hand(0), wx = hx + 30 * k, wy = M.Y(FL - 120);
    ctx.fillStyle = '#2a1a1e'; ctx.fillRect(wx - 6 * k, wy, 12 * k, M.Y(FL) - wy);
    ctx.fillStyle = '#3a2838'; ctx.beginPath(); ctx.ellipse(wx, wy, 56 * k, 10 * k, 0, 0, 7); ctx.fill();
    const grow = sm(lin(tm.lift, tm.lift + 4, t)), ch = (40 + 26 * grow) * k;
    ctx.fillStyle = '#c98f6a'; ctx.beginPath(); ctx.moveTo(wx - 22 * k, wy); ctx.bezierCurveTo(wx - 30 * k, wy - ch * .4, wx - 10 * k, wy - ch * .7, wx - 12 * k, wy - ch); ctx.lineTo(wx + 12 * k, wy - ch); ctx.bezierCurveTo(wx + 10 * k, wy - ch * .7, wx + 30 * k, wy - ch * .4, wx + 22 * k, wy); ctx.fill();
    ctx.strokeStyle = rgba(HOT, .5); ctx.lineWidth = 1.5; for (let j = 0; j < 3; j++) { const a0 = t * 7 + j * 2; ctx.beginPath(); ctx.ellipse(wx, wy + 1, (60 + j * 6) * k, (10 + j) * k, 0, a0, a0 + 1); ctx.stroke(); }
    for (let j = 0; j < 4; j++) { const yy = wy - ch * (.2 + j * .2); ctx.strokeStyle = rgba('#7a4a32', .5); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(wx - 18 * k * (1 - j * .15), yy); ctx.lineTo(wx + 18 * k * (1 - j * .15), yy); ctx.stroke(); } }
  // juggler upstairs (joy): balls go higher on "joy"
  { const J = ROOMS[1].jug, jx = (J.x0 + J.x1) / 2;
    ctx.save(); ctx.beginPath(); ctx.rect(M.X(J.x0), M.Y(J.y0), (J.x1 - J.x0) * k, (J.y1 - J.y0) * k); ctx.clip();
    const ph = q((t * 1.8) % 1, 8), s2 = Math.sin(ph * 6.283);
    const f = F(ctx, M, 'jug' + ph, jx, J.y1 + 62, .92, { lean: 0, head: -.25, sh: [.6 + .25 * s2, .6 - .25 * s2], el: [1.3, 1.3], hip: [.05, -.05], kn: [0, 0], hair: 'curly' }, { dress: { coat: '#2f5560', pants: '#2a2a3a', skin: '#efc39d', hair: '#3a2214' }, rim: RIM, rimSide: -1, light: { x: jx, y: J.y0, a: .45 } }, t, 2);
    ctx.restore();
    const amp = mix(34, 92, sm(lin(tm.joy - .6, tm.joy + .2, t))) * k, [h0x, h0y] = f.hand(0), [h1x, h1y] = f.hand(1);
    for (let b = 0; b < 3; b++) { const u = (t * 1.8 + b / 3) % 1, from = b % 2 ? [h0x, h0y] : [h1x, h1y], to = b % 2 ? [h1x, h1y] : [h0x, h0y];
      const X = mix(from[0], to[0], u), Y = mix(from[1], to[1], u) - Math.sin(Math.PI * u) * amp - 6 * k;
      ctx.fillStyle = ['#ffb35c', '#e8a3a0', '#f3efe2'][b]; ctx.beginPath(); ctx.arc(X, Y, 7 * k, 0, 7); ctx.fill(); } }
  // violinist (the violin at forty)
  { const R = room(1), fx0 = R.x0 + 300, bow = q(.5 + .5 * Math.sin(t * 2.4), 8), ins = sm(lin(tm.violin - .5, tm.violin + .2, t));
    const P = { lean: -.08, head: -.3, sh: [mix(.6, 1.15, bow * ins + (1 - ins) * .3), 1.7], el: [1.45, .35], hip: [.12, -.1], kn: [.05, .12], hair: 'short' };
    const f = F(ctx, M, 'vio' + bow + ':' + (ins > .5), fx0, FL - 4, S11, P, { dress: { coat: '#2b2030', pants: '#1a1420', skin: '#d9a77e', hair: '#3a2a20' }, rim: RIM, rimSide: 1, flip: true, light: { x: R.x0 + 380, y: 520, a: .4 } }, t, 3);
    const [nx, ny] = f.hand(1), [bx, by] = f.hand(0), cx0 = M.X(fx0 - 6), cy0 = M.Y(FL - 4 - 88 * S11 - 58 * S11);
    ctx.save(); ctx.translate(cx0, cy0); ctx.rotate(Math.atan2(ny - cy0, nx - cx0)); ctx.fillStyle = '#8a4a2e'; ctx.beginPath(); ctx.ellipse(10 * k, 0, 18 * k, 8 * k, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#5a2e1e'; ctx.fillRect(22 * k, -2 * k, Math.hypot(nx - cx0, ny - cy0) - 18 * k, 4 * k); ctx.restore();
    ctx.strokeStyle = rgba('#f0e2c8', .9); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(bx + 16 * k, by - 30 * k); ctx.lineTo(bx - 34 * k, by + 26 * k); ctx.stroke();
    // music stand + notes
    const sx = M.X(R.x0 + 470); ctx.strokeStyle = '#21182c'; ctx.lineWidth = 3 * k; ctx.beginPath(); ctx.moveTo(sx, M.Y(FL)); ctx.lineTo(sx, M.Y(650)); ctx.stroke();
    ctx.save(); ctx.translate(sx, M.Y(640)); ctx.rotate(-.25); ctx.fillStyle = '#e8dcc4'; ctx.fillRect(-26 * k, -20 * k, 52 * k, 34 * k); ctx.restore();
    for (let j = 0; j < 4; j++) { const u = ((t * .35 + j / 4) % 1), X = M.X(fx0 - 80 - u * 120) + Math.sin(u * 6 + j) * 8 * k, Y = M.Y(FL - 230 - u * 200); ctx.fillStyle = rgba('#f4e2c0', .7 * Math.sin(Math.PI * u) * (.3 + .7 * ins)); ctx.beginPath(); ctx.ellipse(X, Y, 4.5 * k, 3.2 * k, -.4, 0, 7); ctx.fill(); ctx.fillRect(X + 3 * k, Y - 17 * k, 1.6 * k, 17 * k); } }
  // the grandfather guiding the child at the plane
  { const R = room(2), ph = q((Math.sin(t * 1.6) * .5 + .5), 8), bx0 = R.x0 + 330, by = FL - 100;
    roughRect(ctx, M.X(bx0), M.Y(by), 230 * k, 14 * k, '#4a2216', { amp: .4, seed: 7 }); ctx.fillStyle = '#3a1a10'; ctx.fillRect(M.X(bx0 + 10), M.Y(by + 14), 12 * k, 86 * k); ctx.fillRect(M.X(bx0 + 205), M.Y(by + 14), 12 * k, 86 * k);
    roughRect(ctx, M.X(bx0 + 4), M.Y(by - 11), 222 * k, 11 * k, '#e9c28c', { amp: .3, seed: 8 });
    F(ctx, M, 'old' + ph, R.x0 + 210, FL - 4, S11 * 1.05, { lean: .42, head: .45, sh: [mix(.95, 1.15, ph), .85], el: [mix(.75, .55, ph), .75], hip: [.06, -.04], kn: [0, .06], hair: 'grey', bulk: 1.1, coat: .6 }, { dress: { coat: '#6e3b2a', pants: '#3a2018', shoes: '#22100a', skin: '#e7b993', hair: '#d9d2c6' }, rim: RIM, rimSide: 1, light: { x: R.x0 + 400, y: 520, col: '#ffe9c4', a: .45 } }, t, 4);
    const kf = F(ctx, M, 'kid' + ph, R.x0 + 280, FL - 4, S11 * .7, { lean: .14, head: .22, sh: [mix(1.05, 1.4, ph), mix(.9, 1.2, ph)], el: [.5, .55], hip: [.06, -.06], kn: [0, .05], hair: 'curly' }, { dress: { coat: '#2f5560', pants: '#2a2a3a', shoes: '#1a1010', skin: '#efc39d', hair: '#3a2214' }, rim: RIM, rimSide: 1, light: { x: R.x0 + 400, y: 520, a: .5 } }, t, 5);
    const [hx] = kf.hand(0); ctx.fillStyle = '#2a1810'; ctx.fillRect(hx - 8 * k, M.Y(by - 24), 34 * k, 13 * k); ctx.fillRect(hx + 14 * k, M.Y(by - 32), 7 * k, 10 * k);
    for (let j = 0; j < 7; j++) { const u = ((t * .9 + j / 7) % 1), X = hx + (40 + u * 70) * k, Y = M.Y(by - 18) - Math.sin(u * 3) * 16 * k + u * u * 100 * k; ctx.strokeStyle = rgba('#fbe2b6', .85 * (1 - u)); ctx.lineWidth = 1.8 * k; ctx.beginPath(); ctx.arc(X, Y, (4 + j % 3) * k, -2.5 + u * 4, .6 + u * 4); ctx.stroke(); }
    ctx.fillStyle = rgba('#f1d4a8', .6); for (let j = 0; j < 12; j++) ctx.fillRect(M.X(bx0 + 10 + j * 18), M.Y(FL - 5), 7 * k, 2 * k); }
  // the office: paper stacks lift off like doves through the open roof
  { const R = room(3), r = prng(5);
    for (let j = 0; j < 46; j++) {
      const dx = R.x0 + 70 + (j % 3) * 160 + r() * 100, y0 = 732 - Math.floor(j / 3) % 4 * 6, st = tm.disappear - 1.7 + r() * 1.5, u = (t - st) / (2.2 + r() * 1.2);
      const sz = (20 + r() * 12) * k, ph = r() * 7, drift2 = (r() - .5) * 700, rise = 1100 + r() * 700;
      if (u <= 0) { ctx.fillStyle = '#e8e4d6'; ctx.fillRect(M.X(dx), M.Y(y0 - 6), 22 * k, 5 * k); ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.fillRect(M.X(dx), M.Y(y0 - 1), 22 * k, 1 * k); continue; }
      const e = Math.pow(u, 1.25), X = M.X(dx + 11 + drift2 * e * e + Math.sin(u * 5 + ph) * 30), Y = M.Y(y0 - rise * e);
      if (Y < -60 || u > 2) continue;
      const flap = Math.sin(t * 11 + ph) * sm(u * 3), a = sm(u * 4);
      ctx.save(); ctx.translate(X, Y); ctx.rotate(Math.sin(u * 3 + ph) * .3); ctx.fillStyle = rgba('#f1ede0', .95 * a);
      ctx.beginPath(); ctx.moveTo(-sz, -flap * sz * .9); ctx.lineTo(0, -sz * .15); ctx.lineTo(sz, -flap * sz * .9); ctx.lineTo(sz * .2, sz * .3); ctx.lineTo(-sz * .2, sz * .3); ctx.closePath(); ctx.fill();
      ctx.fillStyle = rgba('#c9c3b2', .7 * a); ctx.beginPath(); ctx.moveTo(-sz * .2, sz * .3); ctx.lineTo(0, -sz * .15); ctx.lineTo(sz * .2, sz * .3); ctx.closePath(); ctx.fill(); ctx.restore();
    } }
  // the sign painter finishes "Open" (last stroke on "meaning")
  { const R = room(4), ex = M.X(R.x0 + 400), ey = M.Y(560), reveal = sm(lin(tm.meaning - 2.2, tm.meaning - .15, t)), swash = sm(lin(tm.meaning - .1, tm.meaning + .35, t));
    ctx.strokeStyle = '#2a1a22'; ctx.lineWidth = 5 * k; ctx.beginPath(); ctx.moveTo(ex - 60 * k, M.Y(FL)); ctx.lineTo(ex, M.Y(600)); ctx.lineTo(ex + 60 * k, M.Y(FL)); ctx.stroke();
    ctx.fillStyle = '#efe4cc'; ctx.fillRect(ex - 110 * k, ey - 20 * k, 220 * k, 160 * k); ctx.fillStyle = '#2b2a5e'; ctx.fillRect(ex - 100 * k, ey - 10 * k, 200 * k, 140 * k);
    ctx.save(); ctx.beginPath(); ctx.rect(ex - 100 * k, ey - 10 * k, 160 * k * reveal + 1, 140 * k); ctx.clip(); text(ctx, 'Open', ex - 78 * k, ey + 82 * k, { size: 68 * k, font: 'Instrument Serif', color: '#ffd59a' }); ctx.restore();
    if (swash > 0) { ctx.strokeStyle = '#e8a3a0'; ctx.lineWidth = 3.5 * k; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(ex - 78 * k, ey + 98 * k); ctx.lineTo(ex - 78 * k + 140 * k * swash, ey + 98 * k - 4 * k * Math.sin(swash * 3)); ctx.stroke(); }
    const done = sm(lin(tm.meaning + .3, tm.meaning + 1.2, t)), armU = reveal < 1 ? reveal : 1 - done * .5;
    const P = { lean: .08 - done * .05, head: -.1 + done * .25, sh: [mix(1.9, 2.35, armU) - done * 1.2, .8], el: [.35 + done * .4, 1.2], hip: [.1, -.08], kn: [.04, .1], hair: 'long', skirt: true };
    const f = F(ctx, M, 'sgn' + q(armU, 10) + q(done, 4), R.x0 + 210, FL - 4, S11, P, { dress: { coat: '#d9d2c0', pants: '#2a3a44', shoes: '#14141e', skin: '#d9a77e', hair: '#2a1a14', skirt: '#3a3550' }, rim: RIM, rimSide: 1, light: { x: R.x0 + 400, y: 520, a: .4 } }, t, 6);
    const [bx, by] = f.hand(0); ctx.strokeStyle = '#3a2830'; ctx.lineWidth = 3 * k; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + 24 * k, by - 16 * k); ctx.stroke(); ctx.fillStyle = C.amber; ctx.beginPath(); ctx.arc(bx + 26 * k, by - 17 * k, 3.4 * k, 0, 7); ctx.fill(); }
  // seamstress
  { const R = room(5), ph = q((t * 2.2) % 1, 6);
    roughRect(ctx, M.X(R.x0 + 200), M.Y(FL - 120), 200 * k, 12 * k, '#2a3a3a', { amp: .3, seed: 3 }); ctx.fillStyle = '#1a2626'; ctx.fillRect(M.X(R.x0 + 210), M.Y(FL - 108), 10 * k, 104 * k); ctx.fillRect(M.X(R.x0 + 380), M.Y(FL - 108), 10 * k, 104 * k);
    roughRect(ctx, M.X(R.x0 + 270), M.Y(FL - 170), 70 * k, 50 * k, '#141c1e', { amp: .3, seed: 4 }); ctx.fillStyle = '#c4482a'; ctx.fillRect(M.X(R.x0 + 230), M.Y(FL - 126), 150 * k, 6 * k);
    F(ctx, M, 'sew' + ph, R.x0 + 170, FL - 52 + 88 * S11 * .95 - 4, S11 * .95, { lean: .28, head: .35, sh: [1.0 + Math.sin(ph * 6.28) * .06, .8], el: [.5, .6], hip: [1.5, 1.45], kn: [1.5, 1.4], hair: 'bun' }, { dress: { coat: '#3f7f8a', pants: '#1a2a30', skin: '#c99a76', hair: '#151018' }, rim: RIM, rimSide: 1, light: { x: R.x0 + 300, y: 520, a: .4 } }, t, 7); }
  // the fronts lift away on "hands" (staggered outward from the potter), cut edges stay as a warm line
  ROOMS.forEach((R, i) => {
    const u = sm(lin(tm.lift + Math.abs(i) * .14 - .1, tm.lift + Math.abs(i) * .14 + .8, t)), ant = Math.sin(Math.PI * clamp((t - tm.lift - i * .14 + .35) / .35)) * (u < .05 ? 1 : 0);
    if (u < 1) { const im = Ly.P[i], dy = -u * (FL - R.cy + 260) + ant * 6; ctx.save(); ctx.globalAlpha = 1 - sm(lin(.55, 1, u)); ctx.drawImage(im, M.X(R.x0 - 10), M.Y(R.cy - 4 + dy), im.width * k, im.height * k); ctx.restore(); }
    if (u > 0) { ctx.strokeStyle = rgba(HOT, .45 * u); ctx.lineWidth = 2; ctx.strokeRect(M.X(R.x0), M.Y(R.cy), (R.x1 - R.x0) * k, (FL - R.cy) * k); }
  });
  drawLayer(ctx, Ly.F, Mf);
  // neighbours on the street: walkers; two stop to look in at the sign painter's on "meaning"
  { const walkers = [
      { k0: 'w1', x0: 3250, v: 46, st: tm.look - 3.2, stopX: 4020, dress: { coat: '#4a6670', pants: '#1a2028', skin: '#d9b08e', hair: '#1c1420' }, hair: 'short' },
      { k0: 'w2', x0: 3150, v: 46, st: tm.look - 3.4, stopX: 3950, dress: { coat: '#8a5a3a', pants: '#20181a', skin: '#e7b993', hair: '#3a2214' }, hair: 'bun', skirt: true },
      { k0: 'w3', x0: 300, v: 60, st: tm.lift - 1, dress: { coat: '#2b4048', pants: '#141c22', skin: '#c99a76', hair: '#151018' }, hair: 'curly' },
      { k0: 'w4', x0: 2700, v: -52, st: tm.lift + 6, dress: { coat: '#6a3a2e', pants: '#24182a', skin: '#e2b48e', hair: '#2a1a14' }, hair: 'long' },
      { k0: 'w5', x0: 1400, v: 40, st: tm.violin, dress: { coat: '#3e3550', pants: '#1a1626', skin: '#c99a76', hair: '#151018' }, hair: 'short' },
    ];
    for (const w of walkers) {
      let x = w.x0 + w.v * Math.max(0, t - w.st), stopped = 0;
      if (w.stopX && x > w.stopX) { stopped = sm((x - w.stopX) / 60); x = w.stopX + (x - w.stopX) * .0 + 30 * stopped; }
      const ph = stopped > .9 ? 0 : q(((x - w.x0) / 140) % 1, 12), pose = stopped > .9 ? { lean: -.03, head: -.25 + .08 * Math.sin(t), sh: [.3, -.1], el: [.6, .5], hip: [.08, -.1], kn: [.05, .15], hair: w.hair, skirt: w.skirt } : walkPose(ph, { hair: w.hair, skirt: w.skirt, head: -.05 });
      if (M.X(x) < -200 || M.X(x) > 2120) continue;
      F(ctx, M, w.k0 + ph + (stopped > .9), x, FL + 150, S11 * 1.2, pose, { dress: w.dress, rim: RIM, rimSide: w.v > 0 ? -1 : 1, flip: w.v < 0 || stopped > .9, rimW: 2 }, t, w.x0 % 7, sm(lin(w.st - .5, w.st, t) + (w.k0 === 'w3' || w.k0 === 'w5' ? 1 : 0)));
    } }
  // level tag (like H4)
  const tagA = sm(lin(tm.lift, tm.lift + 1, t)) * (1 - sm(lin(tm.end - 1, tm.end, t)));
  if (tagA > 0) { ctx.fillStyle = rgba(C.amber, tagA); ctx.fillRect(80, 64, 28, 2); text(ctx, 'ESTEEM · SELF-ACTUALIZATION', 80, 96, { size: 16, weight: 600, color: '#d6d1ea', spacing: 6, alpha: tagA }); }
  // the sign painter's brush stroke sweeps across at mid-height (c), left → right
  if (strokeU > 0) brushStroke(ctx, strokeU, t);
  return M;
}
export function brushStroke(ctx, u, t, y = 540) {
  const head = mix(-200, 2300, Math.pow(u, 1.6)), tail = mix(-400, 900, Math.pow(clamp(u - .25) / .75, 1.2));
  if (head < tail) return;
  const r = prng(3);
  ctx.save(); ctx.lineCap = 'round';
  for (let i = 0; i < 26; i++) { const off = (i / 25 - .5) * 70, w = 2 + r() * 5, a = .55 + r() * .45, gap = r() * 120;
    ctx.strokeStyle = rgba(i % 5 === 0 ? '#ffd59a' : '#ffb35c', a); ctx.lineWidth = w; ctx.beginPath();
    ctx.moveTo(tail + gap, y + off + Math.sin(tail * .004 + i) * 6); for (let x = tail + gap; x <= head - Math.abs(off) * .6; x += 40) ctx.lineTo(x, y + off * (1 - .15 * Math.sin(x * .003)) + Math.sin(x * .004 + i) * 6); ctx.stroke(); }
  ctx.restore();
}
