// C06 (Film 4 v2) · the view out of your back window W2 (owner c06): the town climbing the hill behind your house, the clock tower,
// the sky by the hour (moon and stars at night, clouds by day, 4 pm gold, heavy blue dusk), the lane with its street lamps.
//   far layer  Z = 4000 cm: two rows of engraved houses + the clock tower body, cached once per palette (night / day / gold) and lit by
//              mixing the three (same geometry, so no double image), a hazy stepped silhouette of the upper terraces behind
//   live       sky gradient, stars, moon, clouds, the clock face (hands = the hour of the time-lapse), the bell in the belfry, sound rings
//   near layer Z = 1300 cm: the lane's parapet and two street lamps that come on at dusk
import { W, H, rgba, clamp, mix, sm, prng, canvas } from '../engine.mjs';
import { ring } from './certificate.mjs';
import { TAU, once, mixH, shadeH, plane, wallClock, hash } from './v2_c06_kit.mjs';

export const FAR = { Z: 4000, x0: -2400, x1: 1700, y0: -1300, y1: 720, res: .75 };
export const TOWER = { x: -584, base: 40, top: -800, w: 240, face: -520, r: 118, bel0: -800, bel1: -660, roof: -1010 };
export const MOON = { x: -150, y: -800, r: 46 };
export const NEAR = { Z: 1300, top: 62, lamps: [-470, 160] };

// ---------------------------------------------------------------- palettes (night / day / gold)
const PAL = {
  night: { walls: ['#141a36', '#171c3a', '#121732', '#1a1f3e', '#151a35'], roof: '#0d1028', roofLine: '#060816', win: '#070917', frame: '#232a4c', shutter: ['#141c34', '#1a1830'], shade: .55, rim: '#9fb4e8', rimA: .45, hatch: '#03040c', hatchA: .35, wallLine: '#05060f', haze: '#1b2350', hill: '#10153a', tower: '#171c3c', towerSide: '#0c1028', stone: '#0f1430', sky: false },
  day: { walls: ['#e6d3b0', '#dcc39a', '#e8c9a8', '#d6c4a4', '#ecd9b8'], roof: '#b3593a', roofLine: '#6a2c1c', win: '#3a4a5c', frame: '#f2e8d4', shutter: ['#4f7a6a', '#5a7a9a'], shade: .3, rim: '#fff4dc', rimA: .5, hatch: '#5a4030', hatchA: .22, wallLine: '#8a6a4a', haze: '#c8d8e8', hill: '#a9b9cc', tower: '#d8c29c', towerSide: '#a88a68', stone: '#bfa883', sky: true },
  gold: { walls: ['#f2bf86', '#e9ae78', '#f5c592', '#e3a874', '#f7cf9c'], roof: '#c0502c', roofLine: '#6a2412', win: '#4a3a40', frame: '#ffe6c0', shutter: ['#5a6a52', '#6a6a7a'], shade: .42, rim: '#fff0c8', rimA: .7, hatch: '#5a2a18', hatchA: .25, wallLine: '#8a4a2a', haze: '#f2b48a', hill: '#c88a78', tower: '#efb47c', towerSide: '#a86a48', stone: '#d29a6a', sky: true },
};

// ---------------------------------------------------------------- geometry (deterministic)
const ROWS = (() => {
  const r = prng(4061), rows = [];
  // row B (higher, behind): base −60, on the terrace above the lane; a little square in front of the tower stays open
  for (const [row, base, hMin, hMax, x0, x1] of [[1, -40, 330, 470, -2500, 1800], [0, 300, 400, 560, -2500, 1800]]) {
    let x = x0;
    while (x < x1) {
      const w = 300 + r() * 260, h = hMin + r() * (hMax - hMin);
      if (row === 1 && x + w > TOWER.x - 190 && x < TOWER.x + 190) { x = TOWER.x + 190 + r() * 30; continue; }
      rows.push({ row, x, base, w, h, roof: r() < .55 ? 'gable' : r() < .5 ? 'hip' : 'flat', wall: Math.floor(r() * 5), shut: r() < .6, sh: Math.floor(r() * 2), bal: r() < .35, chim: r() < .55, seed: Math.floor(r() * 1e6), side: 26 + r() * 30 });
      x += w + 8 + r() * 40;
    }
  }
  return rows;
})();

function house(g, h, P) {
  const r = prng(h.seed), x0 = h.x, x1 = h.x + h.w, top = h.base - h.h, wall = P.walls[h.wall], side = h.side;
  // side wall (the house stands a little forward of its neighbour): the shaded right face
  g.fillStyle = shadeH(wall, -P.shade); g.beginPath(); g.moveTo(x1, h.base); g.lineTo(x1, top); g.lineTo(x1 + side, top + side * .35); g.lineTo(x1 + side, h.base); g.closePath(); g.fill();
  // facade
  g.fillStyle = wall; g.fillRect(x0, top, h.w, h.h);
  // roof
  const eave = 18, rh = h.roof === 'gable' ? h.w * .3 : h.roof === 'hip' ? h.w * .16 : 0;
  g.fillStyle = P.roof; g.beginPath();
  if (h.roof === 'gable') { g.moveTo(x0 - eave, top + 6); g.lineTo(x0 + h.w / 2, top - rh); g.lineTo(x1 + eave, top + 6); }
  else if (h.roof === 'hip') { g.moveTo(x0 - eave, top + 6); g.lineTo(x0 + h.w * .22, top - rh); g.lineTo(x1 - h.w * .22, top - rh); g.lineTo(x1 + eave, top + 6); }
  else { g.moveTo(x0 - 6, top + 4); g.lineTo(x0 - 6, top - 26); g.lineTo(x1 + 6, top - 26); g.lineTo(x1 + 6, top + 4); }
  g.closePath(); g.fill();
  // roof tiles: rows of small arcs (gable / hip), a coping line on the flat roof's parapet
  g.save(); g.clip(); g.strokeStyle = P.roofLine; g.lineWidth = 2.2; g.globalAlpha = .55;
  if (h.roof !== 'flat') { for (let y = top - rh + 10; y < top + 8; y += 13) { g.beginPath(); for (let x = x0 - eave; x < x1 + eave; x += 16) { g.moveTo(x, y); g.quadraticCurveTo(x + 8, y + 7, x + 16, y); } g.stroke(); }
    g.lineWidth = 1.4; g.globalAlpha = .35; g.beginPath(); for (let x = x0 - eave; x < x1 + eave; x += 16) { g.moveTo(x, top - rh); g.lineTo(x + (x - (x0 + h.w / 2)) * .08, top + 8); } g.stroke(); }
  else { g.fillStyle = shadeH(P.roof, .15); g.fillRect(x0 - 8, top - 30, h.w + 16, 6); }
  g.restore();
  // the eave's shadow on the facade
  const sg = g.createLinearGradient(0, top, 0, top + 44); sg.addColorStop(0, rgba('#000000', .45 * P.shade)); sg.addColorStop(1, rgba('#000000', 0)); g.fillStyle = sg; g.fillRect(x0, top, h.w, 44);
  // the moon / sun rim along the roof's upper edges
  g.strokeStyle = rgba(P.rim, P.rimA); g.lineWidth = 3; g.beginPath();
  if (h.roof === 'gable') { g.moveTo(x0 - eave, top + 6); g.lineTo(x0 + h.w / 2, top - rh); } else if (h.roof === 'hip') { g.moveTo(x0 - eave, top + 6); g.lineTo(x0 + h.w * .22, top - rh); g.lineTo(x1 - h.w * .22, top - rh); } else { g.moveTo(x0 - 6, top - 26); g.lineTo(x1 + 6, top - 26); }
  g.stroke();
  // chimney
  if (h.chim) { const cx = x0 + h.w * (.62 + r() * .2), cy = h.roof === 'flat' ? top - 26 : top - rh * .55; g.fillStyle = shadeH(wall, -.15); g.fillRect(cx, cy - 70, 34, 80); g.fillStyle = P.roof; g.fillRect(cx - 5, cy - 78, 44, 10); g.fillStyle = rgba(P.rim, P.rimA * .7); g.fillRect(cx - 5, cy - 78, 44, 2.5); }
  // windows: floors × columns, frames, shutters, a balcony on some
  const floors = Math.max(2, Math.floor((h.h - 60) / 130)), cols = Math.max(2, Math.floor(h.w / 105));
  for (let j = 0; j < floors; j++) for (let i = 0; i < cols; i++) {
    const ww = 46, wh = 74, cx = x0 + (i + .5) * h.w / cols, wy = top + 58 + j * ((h.h - 70) / floors);
    if (wy + wh > h.base - 12) continue;
    if (h.shut) { g.fillStyle = P.shutter[h.sh]; g.fillRect(cx - ww / 2 - 22, wy - 2, 20, wh + 4); g.fillRect(cx + ww / 2 + 2, wy - 2, 20, wh + 4); g.strokeStyle = rgba('#000000', .3); g.lineWidth = 1.2; g.beginPath(); for (let yy = wy + 4; yy < wy + wh; yy += 7) { g.moveTo(cx - ww / 2 - 21, yy); g.lineTo(cx - ww / 2 - 3, yy); g.moveTo(cx + ww / 2 + 3, yy); g.lineTo(cx + ww / 2 + 21, yy); } g.stroke(); }
    g.fillStyle = P.frame; g.fillRect(cx - ww / 2 - 4, wy - 4, ww + 8, wh + 8);
    g.fillStyle = P.win; g.fillRect(cx - ww / 2, wy, ww, wh);
    g.fillStyle = P.frame; g.fillRect(cx - 1.5, wy, 3, wh); g.fillRect(cx - ww / 2, wy + wh * .38, ww, 3);
    if (P.sky) { g.fillStyle = rgba('#ffffff', .12); g.beginPath(); g.moveTo(cx - ww / 2, wy + wh); g.lineTo(cx - ww / 2, wy + wh * .5); g.lineTo(cx + ww / 2, wy); g.lineTo(cx + ww / 2, wy + wh * .2); g.closePath(); g.fill(); }
    g.fillStyle = shadeH(wall, .12); g.fillRect(cx - ww / 2 - 8, wy + wh + 4, ww + 16, 6);
    if (h.bal && j === 0) { g.strokeStyle = rgba('#000000', .55); g.lineWidth = 2; g.beginPath(); g.moveTo(cx - ww / 2 - 14, wy + wh - 26); g.lineTo(cx + ww / 2 + 14, wy + wh - 26); for (let x = cx - ww / 2 - 12; x <= cx + ww / 2 + 12; x += 7) { g.moveTo(x, wy + wh - 26); g.lineTo(x, wy + wh + 4); } g.stroke(); g.fillStyle = shadeH(P.shutter[0], -.2); for (const dx of [-ww / 2 - 6, ww / 2 - 2]) { g.beginPath(); g.ellipse(cx + dx + 4, wy + wh - 30, 12, 9, 0, 0, TAU); g.fill(); } }
  }
  // engraving: vertical hatch, denser toward the shaded right side; courses at the base; a crack or two
  g.strokeStyle = rgba(P.hatch, P.hatchA); g.lineWidth = 1.3; g.beginPath();
  for (let x = x0 + 4; x < x1; x += 5 + 7 * (1 - (x - x0) / h.w)) { g.moveTo(x, top + 10); g.lineTo(x + (r() - .5) * 3, h.base); }
  g.stroke();
  g.strokeStyle = rgba(P.wallLine, .35); g.lineWidth = 1.4; g.beginPath(); for (let y = h.base - 60; y < h.base; y += 14) { g.moveTo(x0, y); g.lineTo(x1, y); } g.stroke();
  g.strokeStyle = rgba(P.hatch, P.hatchA * 1.4); g.lineWidth = 1.3; g.beginPath(); for (let x = x1 + 3; x < x1 + side; x += 4) { g.moveTo(x, top + side * .35 * (x - x1) / side); g.lineTo(x, h.base); } g.stroke();
}
function towerBody(g, P) {
  const T = TOWER, x0 = T.x - T.w / 2, x1 = T.x + T.w / 2;
  // shaft with a stone plinth, pilasters, the clock stage, the belfry stage (opening drawn live), a pyramid roof with a finial
  g.fillStyle = P.towerSide; g.beginPath(); g.moveTo(x1, T.base); g.lineTo(x1, T.bel0 - 20); g.lineTo(x1 + 40, T.bel0); g.lineTo(x1 + 40, T.base); g.closePath(); g.fill();
  g.fillStyle = P.tower; g.fillRect(x0, T.bel0 - 20, T.w, T.base - T.bel0 + 20);
  g.fillStyle = shadeH(P.tower, -.12); g.fillRect(x0 - 10, T.face - T.r - 34, T.w + 20, 16); g.fillRect(x0 - 10, T.bel1 + 8, T.w + 20, 14); g.fillRect(x0 - 14, T.bel0 - 26, T.w + 28, 18);
  g.fillStyle = rgba(P.rim, P.rimA); g.fillRect(x0 - 10, T.face - T.r - 34, T.w + 20, 3); g.fillRect(x0 - 14, T.bel0 - 26, T.w + 28, 3);
  g.strokeStyle = rgba(P.hatch, P.hatchA * 1.2); g.lineWidth = 1.3; g.beginPath(); for (let y = T.bel0; y < T.base; y += 22) { g.moveTo(x0, y); g.lineTo(x1, y); } for (let y = T.bel0, k = 0; y < T.base; y += 22, k++) for (let x = x0 + (k % 2 ? 30 : 0); x < x1; x += 60) { g.moveTo(x, y); g.lineTo(x, y + 22); } g.stroke();
  g.strokeStyle = rgba(P.hatch, P.hatchA * 1.6); g.beginPath(); for (let x = x1 + 3; x < x1 + 40; x += 4) { g.moveTo(x, T.bel0 + (x - x1) * .5); g.lineTo(x, T.base); } g.stroke();
  // the clock dial's stone surround (the face itself is live)
  g.fillStyle = shadeH(P.tower, -.2); g.beginPath(); g.arc(T.x, T.face, T.r + 16, 0, TAU); g.fill();
  // roof
  g.fillStyle = P.roof; g.beginPath(); g.moveTo(x0 - 26, T.bel0 - 22); g.lineTo(T.x, T.roof); g.lineTo(x1 + 26, T.bel0 - 22); g.closePath(); g.fill();
  g.save(); g.clip(); g.strokeStyle = P.roofLine; g.globalAlpha = .5; g.lineWidth = 2; g.beginPath(); for (let y = T.roof + 20; y < T.bel0; y += 14) { const hw = (y - T.roof) / (T.bel0 - 22 - T.roof) * (T.w / 2 + 26); g.moveTo(T.x - hw, y); g.lineTo(T.x + hw, y); } g.stroke(); g.restore();
  g.strokeStyle = rgba(P.rim, P.rimA); g.lineWidth = 3; g.beginPath(); g.moveTo(x0 - 26, T.bel0 - 22); g.lineTo(T.x, T.roof); g.stroke();
  g.strokeStyle = shadeH(P.roof, -.3); g.lineWidth = 5; g.beginPath(); g.moveTo(T.x, T.roof); g.lineTo(T.x, T.roof - 70); g.moveTo(T.x - 18, T.roof - 48); g.lineTo(T.x + 18, T.roof - 48); g.stroke();
}
// the upper terraces in haze (the hill above you: Belonging, Esteem … stepped up to the summit)
function hillSilhouette(g, P) {
  g.fillStyle = P.hill; g.beginPath(); g.moveTo(FAR.x0, FAR.y1); g.lineTo(FAR.x0, -330);
  const steps = [[-2400, -330], [-1900, -330], [-1820, -470], [-1300, -470], [-1220, -600], [-700, -620], [-640, -760], [300, -760], [360, -640], [900, -620], [960, -480], [1500, -470], [1560, -340], [1700, -330]];
  for (const [x, y] of steps) g.lineTo(x, y); g.lineTo(FAR.x1, FAR.y1); g.closePath(); g.fill();
  // little roofs along the steps, very faint
  const r = prng(77); g.fillStyle = shadeH(P.hill, -.12); for (let i = 1; i < steps.length - 1; i += 2) { const [xa, ya] = steps[i], [xb] = steps[i + 1]; for (let x = xa + 20; x < xb - 60; x += 70 + r() * 60) { const hh = 40 + r() * 50; g.beginPath(); g.moveTo(x, ya); g.lineTo(x, ya - hh); g.lineTo(x + 30, ya - hh - 22); g.lineTo(x + 60, ya - hh); g.lineTo(x + 60, ya); g.fill(); } }
}
function farLayer(kind) {
  return once('c06far:' + kind, () => {
    const P = PAL[kind], s = FAR.res, w = Math.ceil((FAR.x1 - FAR.x0) * s), h = Math.ceil((FAR.y1 - FAR.y0) * s), [c, g] = canvas(w, h);
    g.setTransform(s, 0, 0, s, -FAR.x0 * s, -FAR.y0 * s);
    hillSilhouette(g, P);
    // haze between the hill and the rows
    const hg = g.createLinearGradient(0, -700, 0, 0); hg.addColorStop(0, rgba(P.haze, 0)); hg.addColorStop(1, rgba(P.haze, .45)); g.fillStyle = hg; g.fillRect(FAR.x0, -700, FAR.x1 - FAR.x0, 700);
    towerBody(g, P);
    // retaining wall of row B's terrace, then row B, then row A's wall and row A
    for (const row of [1, 0]) {
      const base = row ? -40 : 300; g.fillStyle = P.stone; g.fillRect(FAR.x0, base, FAR.x1 - FAR.x0, 340);
      g.strokeStyle = rgba(P.hatch, P.hatchA * 1.3); g.lineWidth = 1.4; g.beginPath(); for (let y = base + 26; y < base + 340; y += 26) { g.moveTo(FAR.x0, y); g.lineTo(FAR.x1, y); } for (let y = base, k = 0; y < base + 340; y += 26, k++) for (let x = FAR.x0 + (k % 2) * 40; x < FAR.x1; x += 80) { g.moveTo(x, y); g.lineTo(x, y + 26); } g.stroke();
      for (const hs of ROWS) if (hs.row === row) house(g, hs, P);
    }
    return c;
  });
}

// ---------------------------------------------------------------- the whole view (call inside the W2 clip)
export function drawView(ctx, c, t, S, L) {
  // sky (screen space, aligned to the far plane so the horizon parallaxes)
  const kF = c.F / (FAR.Z - c.z), yS = (Y) => H / 2 + (Y - c.y) * kF + (c.oy || 0);
  const night = clamp(1 - L.day * 1.25), gold = L.gold, day = L.day;
  const top = mixH(mixH('#060a22', '#3a3a78', gold * .8), '#6f9fd4', day * (1 - gold * .6)), mid = mixH(mixH('#121a44', '#9a6a8a', gold), '#a8c6e4', day * (1 - gold * .6)), low = mixH(mixH('#232c62', '#f2a070', gold), '#e6eef0', day * (1 - gold * .7));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const sg = ctx.createLinearGradient(0, yS(-1500), 0, yS(-300)); sg.addColorStop(0, top); sg.addColorStop(.6, mid); sg.addColorStop(1, low); ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H);
  ctx.restore();
  const k = plane(ctx, c, FAR.Z); shift(ctx, c);
  // stars and the moon
  if (L.moon > .03) {
    const r = prng(91); for (let i = 0; i < 120; i++) { const x = FAR.x0 + r() * (FAR.x1 - FAR.x0), y = -1500 + r() * 1100, s = (.8 + r() * 1.6) / k, ph = r() * TAU, a = L.moon * (.35 + .4 * Math.sin(t * 1.3 + ph)); if (a > .03) { ctx.fillStyle = rgba('#f3efe2', a); ctx.fillRect(x, y, s, s); } }
    const M = MOON; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const mg = ctx.createRadialGradient(M.x, M.y, 0, M.x, M.y, M.r * 6); mg.addColorStop(0, rgba('#dfe8ff', .45 * L.moon)); mg.addColorStop(.3, rgba('#9fb4e8', .12 * L.moon)); mg.addColorStop(1, rgba('#9fb4e8', 0)); ctx.fillStyle = mg; ctx.fillRect(M.x - M.r * 6, M.y - M.r * 6, M.r * 12, M.r * 12); ctx.restore();
    ctx.fillStyle = mixH('#16204a', '#f4f1e4', L.moon); ctx.beginPath(); ctx.arc(M.x, M.y, M.r, 0, TAU); ctx.fill();
    ctx.fillStyle = rgba('#b9b3a0', .45 * L.moon); for (const [dx, dy, rr] of [[-12, -9, 10], [13, 7, 7], [-3, 17, 5], [17, -16, 4.5]]) { ctx.beginPath(); ctx.arc(M.x + dx, M.y + dy, rr, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = rgba('#7a7460', .35 * L.moon); ctx.lineWidth = 1.2 / k * .8; ctx.beginPath(); for (let i = -4; i <= 4; i++) { ctx.moveTo(M.x + i * 9 - 30, M.y - 40); ctx.lineTo(M.x + i * 9 + 30, M.y + 40); } ctx.save(); ctx.beginPath(); ctx.arc(M.x, M.y, M.r, 0, TAU); ctx.clip(); ctx.stroke(); ctx.restore();
  }
  // clouds by day (engraved strands, drifting), rose at the low sun
  if (day + gold > .05) {
    const cc = mixH('#fff7ea', '#ffc39a', gold), a = (.45 * day + .3 * gold);
    for (let i = 0; i < 5; i++) { const cx = ((i * 900 + t * 40) % 4600) - 2700, cy = -1180 + (i % 3) * 150; ctx.fillStyle = rgba(cc, a * .55); ctx.beginPath(); ctx.ellipse(cx, cy, 380, 44, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(cx + 150, cy - 30, 220, 40, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = rgba(mixH('#8aa0c0', '#c87a6a', gold), a * .5); ctx.lineWidth = 2.2; ctx.beginPath(); for (let j = 0; j < 4; j++) { ctx.moveTo(cx - 330 + j * 30, cy + 18 + j * 6); ctx.lineTo(cx + 300 - j * 40, cy + 18 + j * 6); } ctx.stroke(); }
  }
  // the town: three cached palettes, mixed by the light (same geometry)
  const wN = night, wG = gold * (1 - night), wD = Math.max(0, 1 - wN - wG);
  const im = (kind) => farLayer(kind), dx = FAR.x0, dy = FAR.y0, dw = FAR.x1 - FAR.x0, dh = FAR.y1 - FAR.y0;
  // draw the strongest first at full alpha, then the others on top with their share (lighting only: identical drawings)
  const parts = [['day', wD], ['gold', wG], ['night', wN]].sort((a, b) => b[1] - a[1]);
  ctx.drawImage(im(parts[0][0]), dx, dy, dw, dh); let acc = parts[0][1];
  for (const [kind, w] of parts.slice(1)) { if (w < .01) continue; acc += w; ctx.globalAlpha = clamp(w / acc); ctx.drawImage(im(kind), dx, dy, dw, dh); ctx.globalAlpha = 1; }
  // the clock face (lit from behind at night), the belfry opening with its bell, the strikes
  towerLive(ctx, t, S, L, k);
  // the lane right behind the house: the parapet and the street lamps (Z = 1300)
  const kn = plane(ctx, c, NEAR.Z); shift(ctx, c);
  nearLayer(ctx, t, S, L, kn);
}
// lens shift (a small pan, used for the look up at the clock): moves the whole image
function shift() { }   // the lens shift is in plane() itself

function towerLive(ctx, t, S, L, k) {
  const T = TOWER, night = clamp(1 - L.day * 1.25);
  // belfry opening: dark arch with the bell swinging on the strikes
  const bx0 = T.x - 62, bx1 = T.x + 62, by0 = T.bel0 + 18, by1 = T.bel1 - 8;
  ctx.fillStyle = mixH('#1a1414', '#05060f', night); ctx.beginPath(); ctx.moveTo(bx0, by1); ctx.lineTo(bx0, by0 + 62); ctx.arc(T.x, by0 + 62, 62, Math.PI, 0); ctx.lineTo(bx1, by1); ctx.closePath(); ctx.fill();
  let sw = 0; for (const b of S.bells) { const d = t - b; if (d > -.2 && d < 3) sw += Math.sin(clamp((d + .2) / 2.2) * Math.PI * 3) * Math.exp(-Math.max(0, d) * 1.1) * .42; }
  ctx.save(); ctx.translate(T.x, by0 + 40); ctx.rotate(sw);
  ctx.fillStyle = mixH(mixH('#9a7a3a', '#c8903a', L.gold), '#4a4030', night); ctx.beginPath(); ctx.moveTo(-14, 0); ctx.quadraticCurveTo(-18, 34, -42, 78); ctx.lineTo(42, 78); ctx.quadraticCurveTo(18, 34, 14, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba('#000000', .35); ctx.fillRect(-42, 72, 84, 6);
  ctx.strokeStyle = rgba(night > .5 ? '#cfe0ff' : '#fff2c8', .55); ctx.lineWidth = 3.2; ctx.beginPath(); ctx.moveTo(-34, 74); ctx.quadraticCurveTo(-14, 36, -9, 4); ctx.stroke();
  ctx.fillStyle = '#2a2018'; ctx.beginPath(); ctx.arc(Math.sin(sw * 2) * 10, 80, 7, 0, TAU); ctx.fill();
  ctx.restore();
  // the face: lit from inside at night (warm), its glow on the stone
  if (night > .2) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(T.x, T.face, T.r * .6, T.x, T.face, T.r * 2.8); g.addColorStop(0, rgba('#ffd9a0', .32 * night)); g.addColorStop(1, rgba('#ffd9a0', 0)); ctx.fillStyle = g; ctx.fillRect(T.x - T.r * 3, T.face - T.r * 3, T.r * 6, T.r * 6); ctx.restore(); }
  wallClock(ctx, T.x, T.face, T.r, S.h, { blur: clamp((Math.abs(S.rate) - .5) / 4), face: mixH(mixH('#efe4c8', '#ffe2b8', L.gold), '#ffe6b8', night), ink: '#1a1622', light: { col: '#ffe2b0', a: .5 * night } });
  // the strikes: engraved rings of sound opening from the belfry
  for (const b of S.bells) { const d = t - b; if (d < 0 || d > 1.9) continue; for (let i = 0; i < 3; i++) { const q = d - i * .24; if (q < 0) continue; const rr = 110 + q * 820, a = (1 - q / 1.9) * .7;
    ring(ctx, T.x, by0 + 70, rr, rr * .9, { lines: 3, band: 16, wave: 40, col: night > .5 ? '#fff1d6' : '#fffaf0', glow: null, a, lw: 3.2 }); } }
}
function nearLayer(ctx, t, S, L, k) {
  const night = clamp(1 - L.day * 1.25), stone = mixH(mixH('#b9a07a', '#d79a6a', L.gold), '#141834', night), cap = shadeH(stone, .12);
  // the parapet across the lane (a low stone wall with a coping), seen at the bottom of the window
  ctx.fillStyle = stone; ctx.fillRect(-2600, NEAR.top, 5200, 900);
  ctx.fillStyle = cap; ctx.fillRect(-2600, NEAR.top - 9, 5200, 12);
  ctx.fillStyle = rgba(night > .5 ? '#9fb4e8' : '#fff4dc', .35 + .2 * L.gold); ctx.fillRect(-2600, NEAR.top - 9, 5200, 2.2);
  ctx.strokeStyle = rgba('#000000', .28); ctx.lineWidth = 1.1; ctx.beginPath(); for (let y = NEAR.top + 16; y < NEAR.top + 300; y += 16) { ctx.moveTo(-2600, y); ctx.lineTo(2600, y); } for (let y = NEAR.top + 3, j = 0; y < NEAR.top + 300; y += 16, j++) for (let x = -2600 + (j % 2) * 22; x < 2600; x += 44) { ctx.moveTo(x, y); ctx.lineTo(x, y + 13); } ctx.stroke();
  // street lamps (iron posts with a lantern), on at dusk: warm amber, their pools on the parapet and the far facades
  for (const lx of NEAR.lamps) {
    const post = mixH('#2a2622', '#06070e', night); ctx.fillStyle = post; ctx.fillRect(lx - 4, -250, 8, 330); ctx.fillRect(lx - 9, 40, 18, 40);
    ctx.strokeStyle = post; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(lx, -250); ctx.quadraticCurveTo(lx + 4, -292, lx + 40, -290); ctx.stroke();
    ctx.fillStyle = post; ctx.beginPath(); ctx.moveTo(lx + 26, -290); ctx.lineTo(lx + 54, -290); ctx.lineTo(lx + 50, -262); ctx.lineTo(lx + 30, -262); ctx.closePath(); ctx.fill();
    const on = S.street * (.94 + .06 * Math.sin(t * 9 + lx));
    ctx.fillStyle = mixH(mixH('#3a3a40', '#5a4a3a', L.gold), '#ffd9a0', on); ctx.fillRect(lx + 32, -284, 16, 20);
    if (on > .01) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(lx + 40, -274, 0, lx + 40, -274, 220); g.addColorStop(0, rgba('#ffc070', .7 * on)); g.addColorStop(.25, rgba('#ffb35c', .22 * on)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(lx - 180, -494, 440, 440);
      const p = ctx.createRadialGradient(lx + 40, NEAR.top, 0, lx + 40, NEAR.top, 260); p.addColorStop(0, rgba('#ff9a3c', .3 * on)); p.addColorStop(1, rgba('#ff9a3c', 0)); ctx.fillStyle = p; ctx.fillRect(lx - 220, NEAR.top - 260, 520, 420); ctx.restore(); }
  }
}
export async function warmView() { for (const k of ['night', 'day', 'gold']) farLayer(k); }
