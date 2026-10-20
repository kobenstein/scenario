// c05 · the city in the morning (Film 4 v2): everything outside your bedroom window, as ONE world seen by the translation-only camera of
// lib/v2_c05_kit.mjs (metres, y down, z east; your floor is y 0, the inside face of your window wall z 0). The sun rises in the east over
// the side street across the road; the office tower on the right corner of that street has the corner office on your level and the corner
// shop on the ground floor (awning, wicker fruit baskets). The bay lies east, below the town, under a golden haze.
//   CITY                         the layout
//   sun(tod) → { az, el, col }   the sun direction (tangents: az + = toward +x, el + = up) and colour at a time of day (hours)
//   drawOutside(ctx, t, cam, S)  the whole outside, far → near. S = { tod, k (aureole scale), sunXY (forced screen centre of the glow),
//                                plate (1 → the exact handoff plate), office: { chair, lamp }, shopInterior(ctx, t, cam, rect) }
import { W, H, rgba, clamp, mix, prng, canvas, once, poly3, rect3, bb, seg3, plateGlow, mixHex, shade, ramp3, putGlow, TAU } from './v2_c05_kit.mjs';
import { house, vnoise, fbm, stipple } from './art.mjs';
import { plate } from './handoff4.mjs';

export const CITY = {
  street: 6.2,                 // street level below your floor (y down)
  opp: 8.6,                    // the facades across the street
  gap: { x0: -6.6, x1: -2.4 }, // the side street running east, down to the harbour (the sun rises over it)
  left: { x0: -18, x1: -6.6, eave: -.6, ridge: -2.9 },              // the house left of the side street
  tower: { x0: -2.4, x1: 13.6, top: -22.5 },                         // the office tower on the right corner
  office: { x0: -2.0, x1: .5, y0: -3.35, y1: -1.0, floor: -.65 },   // its corner office (2nd floor), straight across from your window B
  win: { x0: -2.05, x1: .3, y0: 3.0, y1: 5.45 },                    // the corner shop's display window
  door: { x0: .5, x1: 1.4, y0: 3.0 },
};

// ---------------------------------------------------------------- sun and sky over one day (tod = hour of the day)
export function sun(tod) {
  const h = clamp(tod, 6, 21), el = Math.max(.03, h < 13 ? (7 + (h - 7) * 8.6) : (59 - (h - 13) * 8.0)) * Math.PI / 180, az = (-6 + (h - 7) * 9) * Math.PI / 180;
  return { az: Math.tan(clamp(az, -1.3, 1.3)), el: Math.tan(el), col: ramp3([[7, '#ffd9a0'], [9, '#ffe2b4'], [11, '#fff0d6'], [14, '#ffe6c0'], [16.5, '#ffd39a'], [18.5, '#ffb07e'], [20, '#f08f84']], h) };
}
// sky colour by elevation (tangent) at a time of day
const SKY = {
  7: [[-.1, '#e7b48e'], [0, '#f6c896'], [.05, '#efb798'], [.16, '#d9a3a2'], [.36, '#a596be'], [.8, '#5e66a3']],
  10: [[-.1, '#ecd0ae'], [0, '#f4d9b6'], [.05, '#ecd3bc'], [.16, '#d0c4cc'], [.36, '#a0b0d6'], [.8, '#6282c4']],
  13: [[-.1, '#ecd8b8'], [0, '#f3ddb8'], [.05, '#e9d6c2'], [.16, '#c9c6d8'], [.36, '#95add8'], [.8, '#5a7cc4']],
};
function skyStops(tod) {
  const a = tod < 10 ? 7 : 10, b = tod < 10 ? 10 : 13, u = clamp((tod - a) / (b - a));
  return SKY[a].map(([e, c], i) => [e, mixHex(c, SKY[b][i][1], u)]);
}
export function drawSky(ctx, cam, tod) {
  const st = skyStops(tod), y = (e) => cam.py - cam.f * e, y0 = y(st[st.length - 1][0]), y1 = y(st[0][0]);
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  for (const [e, c] of st) g.addColorStop(clamp((y(e) - y0) / (y1 - y0)), c);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
export const skyAt = (tod, e) => ramp3(skyStops(tod), e);

// ---------------------------------------------------------------- far: the bay, the sun's glitter path, the golden haze bank
export const SEA = { y: 34, z0: 120 };            // the sea level below your floor and where the bay begins
function hazeTex() {
  return once('c5:haze', () => {
    const w = 2400, h = 300, [c, g] = canvas(w, h), n = vnoise(51);
    const id = g.createImageData(w, h), p = id.data;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const v = (y - 190) / 190, f = fbm(n, x * .0045, y * .018, 4), a = clamp(1 - Math.abs(v) * 1.25 + (f - .5) * 1.2) ** 1.35 * (y > 190 ? 1.2 : 1);
      const o = (y * w + x) * 4; p[o] = 255; p[o + 1] = 232; p[o + 2] = 200; p[o + 3] = 255 * clamp(a);
    }
    g.putImageData(id, 0, 0); stipple(c, { k: .35, g: 1.1, seed: 9 }); return c;
  });
}
export function drawFar(ctx, t, cam, S) {
  const s = sun(S.tod), tod = S.tod, u = clamp((tod - 7) / 5);
  // the water: from the horizon down, a gradient by depression angle, the sun's glitter path below the sun
  const yh = cam.py, yq = cam.P(cam.x, SEA.y, SEA.z0), y1 = yq ? Math.min(H + 50, yq[1]) : H + 50;
  if (y1 > yh) {
    const g = ctx.createLinearGradient(0, yh, 0, Math.max(yh + 1, y1));
    g.addColorStop(0, mixHex('#efc9a2', '#e2d2b8', u)); g.addColorStop(.3, mixHex('#c3958f', '#9faabd', u)); g.addColorStop(1, mixHex('#5d5074', '#4d6188', u));
    ctx.fillStyle = g; ctx.fillRect(0, yh, W, Math.max(0, y1 - yh));
    const [sx] = cam.dir(s.az, -s.el), r = prng(77 + Math.floor(t * 10)), sc = cam.f / 1300;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(s.col, .5);
    for (let i = 0; i < 480; i++) {
      const v = Math.pow(r(), 2.2), e = .0015 + v * .14, yy = yh + cam.f * e; if (yy > y1) { r(); r(); r(); continue; }
      const spread = (12 + 380 * v) * sc, xx = sx + (r() - .5) * 2 * spread * (.3 + r() * .7), w2 = (2 + r() * 9) * (1 - v * .5) * sc;
      ctx.globalAlpha = (.25 + .55 * (1 - v)) * (S.glitter ?? 1); ctx.fillRect(xx - w2 / 2, yy, w2, Math.max(1, sc * (1 + v * 1.5)));
    }
    ctx.restore();
  }
  // the haze bank over the far water (hides the far shore): a band at infinity (only the lens moves it), centred a little left of east
  const [hx, hy] = cam.dir(-.12, 0), hw = cam.f * 2.2, hh = cam.f * .26;
  ctx.save(); ctx.globalAlpha = clamp(S.hazeA ?? .9); ctx.drawImage(hazeTex(), hx - hw / 2, hy - hh * 190 / 300, hw, hh); ctx.restore();
}

// ---------------------------------------------------------------- the sun: the plate light, shrunk to its aureole
export function drawSun(ctx, t, cam, S) {
  const s = sun(S.tod), [x, y] = S.sunXY || cam.dir(s.az, -s.el);
  if (S.plate >= .9999) { plate(ctx, t, 'light', { tone: 'dawn' }); return [x, y]; }
  plateGlow(ctx, t, x, y, S.k ?? .12, S.glowCols ? { cols: S.glowCols } : {});
  return [x, y];
}

// ---------------------------------------------------------------- rows of houses (billboards): the town going down to the harbour
const ROWS = [
  { key: 'r1', z: 24, x0: -46, w: 84, ground: 9.4, hMin: 6, hMax: 11, seed: 11, wall: '#5a4a6e', haze: .2 },
  { key: 'r2', z: 48, x0: -80, w: 150, ground: 16.5, hMin: 5, hMax: 9, seed: 23, wall: '#6d5a7a', haze: .36 },
  { key: 'r3', z: 78, x0: -110, w: 210, ground: 22, hMin: 4, hMax: 8, seed: 37, wall: '#806a84', haze: .52 },
];
function rowTex(R) {
  return once('c5:row:' + R.key, () => {
    const ppm = R.z < 30 ? 30 : 22, top = R.hMax * 1.9, w = Math.ceil(R.w * ppm), h = Math.ceil(top * ppm), [c, g] = canvas(w, h), r = prng(R.seed);
    const wall = mixHex(R.wall, '#e9c0a0', R.haze * .55), rim = '#ffd9a8';
    let x = 4;
    while (x < w - 4) {
      const hw = (4.5 + r() * 6) * ppm, hh = (R.hMin + r() * (R.hMax - R.hMin)) * ppm;
      const res = house(g, r, x + hw / 2, h, hw, hh, { wall: shade(wall, (r() - .5) * .06), roofs: ['gable', 'gable', 'hip', 'steep', 'flat', 'parapet', 'mansard'], chimney: .5, bay: .1, floorH: 3.1 * ppm, colW: 2.6 * ppm, wscale: ppm / 22,
        lit: (wx, wy, rr) => (rr() < .05 ? .55 : 0), winOff: shade(wall, -.07), winOn: '#ffcf8a', door: true, amp: ppm * .04 });
      g.save(); g.strokeStyle = rgba(rim, .7); g.lineWidth = Math.max(1.2, ppm * .07); g.lineJoin = 'round'; g.beginPath();
      res.outline.slice(1, -1).forEach(([px, py], i) => (i ? g.lineTo(px, py) : g.moveTo(px, py))); g.stroke(); g.restore();
      x += hw * (.82 + r() * .3);
    }
    const vg = g.createLinearGradient(0, h * .3, 0, h); vg.addColorStop(0, rgba('#f2c8a4', 0)); vg.addColorStop(1, rgba('#f2c8a4', .35 + R.haze * .4));
    g.globalCompositeOperation = 'source-atop'; g.fillStyle = vg; g.fillRect(0, 0, w, h); g.globalCompositeOperation = 'source-over';
    return c;
  });
}
export function drawRows(ctx, t, cam, S, zMin = 0) {
  for (let i = ROWS.length - 1; i >= 0; i--) {
    const R = ROWS[i]; if (R.z <= cam.z + .5 || R.z < zMin) continue;
    const top = R.hMax * 1.9; bb(ctx, cam, rowTex(R), R.x0, R.ground - top, R.z, R.w, top);
  }
}

// ---------------------------------------------------------------- across the street
const PPM = 64;
// the house left of the side street (residential, shutters, geraniums) and its side wall along the side street
function leftTex() {
  return once('c5:left', () => {
    const B = CITY.left, ppm = PPM, x0 = B.x0, w = B.x1 - B.x0, top = B.ridge - .4, h = CITY.street - top;
    const [c, g] = canvas(Math.ceil(w * ppm), Math.ceil(h * ppm)), r = prng(4), X = (x) => (x - x0) * ppm, Y = (y) => (y - top) * ppm;
    const wall = '#4b3d5c', wallLit = '#6a5470';
    // roof seen from a little below: tiles in rows, the warm ridge
    g.fillStyle = '#3a2b40'; g.beginPath(); g.moveTo(X(x0), Y(B.eave)); g.lineTo(X(x0 + .6), Y(B.ridge)); g.lineTo(X(B.x1 - .6), Y(B.ridge)); g.lineTo(X(B.x1), Y(B.eave)); g.closePath(); g.fill();
    g.strokeStyle = rgba('#1c1424', .55); g.lineWidth = 1.4;
    for (let y = B.ridge + .18; y < B.eave; y += .26) { g.beginPath(); g.moveTo(X(x0 + .3), Y(y)); for (let x = x0 + .3; x < B.x1 - .3; x += .3) g.lineTo(X(x), Y(y) + Math.sin(x * 10.5) * 1.6); g.stroke(); }
    g.strokeStyle = rgba('#ffd2a0', .75); g.lineWidth = 2.2; g.beginPath(); g.moveTo(X(x0 + .6), Y(B.ridge)); g.lineTo(X(B.x1 - .6), Y(B.ridge)); g.stroke();
    for (const cx of [-15.2, -9.4]) { g.fillStyle = '#3d2e45'; g.fillRect(X(cx), Y(B.ridge - 1.4), .7 * ppm, 1.6 * ppm); g.fillStyle = rgba('#ffd2a0', .6); g.fillRect(X(cx) + .6 * ppm, Y(B.ridge - 1.4), .1 * ppm, 1.6 * ppm); }
    const fg = g.createLinearGradient(0, Y(B.eave), 0, Y(CITY.street)); fg.addColorStop(0, wallLit); fg.addColorStop(1, wall);
    g.fillStyle = fg; g.fillRect(X(x0), Y(B.eave), w * ppm, (CITY.street - B.eave) * ppm);
    const n = vnoise(5); for (let i = 0; i < 2600; i++) { const px = r() * w * ppm, py = Y(B.eave) + r() * (CITY.street - B.eave) * ppm; g.fillStyle = rgba(r() < .5 ? '#000' : '#fff', .04 + r() * .05); g.fillRect(px, py, 1 + r() * 2, 1 + r() * 2); }
    g.strokeStyle = rgba('#1a1222', .18); g.lineWidth = 1; for (let y = B.eave + .3; y < 2.4; y += .32) { g.beginPath(); g.moveTo(0, Y(y)); g.lineTo(w * ppm, Y(y) + (n(y, 1) - .5) * 2); g.stroke(); }
    g.fillStyle = '#5d4b68'; g.fillRect(0, Y(B.eave) - 6, w * ppm, 14); g.fillStyle = rgba('#140c1c', .45); g.fillRect(0, Y(B.eave) + 8, w * ppm, 5);
    g.fillStyle = '#56455f'; g.fillRect(0, Y(2.45), w * ppm, 11); g.fillStyle = rgba('#140c1c', .4); g.fillRect(0, Y(2.45) + 11, w * ppm, 4);
    // first-floor windows: louvred shutters (two closed, two open with geraniums)
    for (const [cx, open] of [[-16.2, 0], [-13.4, 1], [-10.6, 0], [-7.9, 1]]) {
      const ww = 1.05, y0 = .2, y1 = 1.85, wx0 = X(cx - ww / 2), wy0 = Y(y0), wpx = ww * ppm, hpx = (y1 - y0) * ppm;
      g.fillStyle = '#2a2034'; g.fillRect(wx0, wy0, wpx, hpx);
      if (open) { const lg = g.createLinearGradient(0, wy0, 0, wy0 + hpx); lg.addColorStop(0, rgba('#e8b48c', .4)); lg.addColorStop(1, rgba('#e8b48c', .05)); g.fillStyle = lg; g.fillRect(wx0 + 6, wy0 + 6, wpx - 12, hpx - 12); }
      g.strokeStyle = '#5e4c66'; g.lineWidth = 4; g.strokeRect(wx0, wy0, wpx, hpx); g.beginPath(); g.moveTo(X(cx), wy0); g.lineTo(X(cx), wy0 + hpx); g.stroke();
      const shutter = (sx0) => { g.fillStyle = open ? '#3f5b5e' : '#466568'; g.fillRect(sx0, wy0, wpx / 2, hpx); g.strokeStyle = rgba('#14202a', .5); g.lineWidth = 1.5; for (let yy = wy0 + 6; yy < wy0 + hpx - 4; yy += 7) { g.beginPath(); g.moveTo(sx0 + 4, yy); g.lineTo(sx0 + wpx / 2 - 4, yy + 2); g.stroke(); } };
      if (open) { shutter(wx0 - wpx / 2 - 3); shutter(wx0 + wpx + 3); } else { shutter(wx0); shutter(wx0 + wpx / 2); }
      g.fillStyle = '#5a4762'; g.fillRect(wx0 - .1 * ppm, wy0 + hpx, wpx + .2 * ppm, 9);
      if (open) { g.fillStyle = '#3a2a30'; g.fillRect(wx0, wy0 + hpx - 16, wpx, 18); for (let k = 0; k < 9; k++) { const fx = wx0 + 6 + k * (wpx - 12) / 8, fy = wy0 + hpx - 18 - r() * 8; g.fillStyle = '#2f4a38'; g.beginPath(); g.arc(fx, fy + 4, 7, 0, TAU); g.fill(); g.fillStyle = r() < .5 ? '#d8525a' : '#e8a3a0'; g.beginPath(); g.arc(fx + (r() - .5) * 4, fy - 2, 4.5, 0, TAU); g.fill(); } }
    }
    // ground floor: rusticated plinth, a carriage door and two barred windows (a quiet house)
    g.fillStyle = '#3c3048'; g.fillRect(0, Y(2.6), w * ppm, (CITY.street - 2.6) * ppm);
    g.strokeStyle = rgba('#15101c', .35); g.lineWidth = 1.2; for (let y = 2.9; y < CITY.street; y += .45) { g.beginPath(); g.moveTo(0, Y(y)); g.lineTo(w * ppm, Y(y)); g.stroke(); for (let x = x0 + ((y * 7) % 1) * .9; x < B.x1; x += .9) { g.beginPath(); g.moveTo(X(x), Y(y)); g.lineTo(X(x), Y(y + .45)); g.stroke(); } }
    const dx0 = X(-12.9), dw = 2.2 * ppm; g.fillStyle = '#2b2036'; g.beginPath(); g.moveTo(dx0, Y(CITY.street)); g.lineTo(dx0, Y(3.6)); g.arc(dx0 + dw / 2, Y(3.6), dw / 2, Math.PI, 0); g.lineTo(dx0 + dw, Y(CITY.street)); g.closePath(); g.fill();
    g.strokeStyle = rgba('#120c18', .6); g.lineWidth = 3; for (let k = 1; k < 6; k++) { g.beginPath(); g.moveTo(dx0 + k * dw / 6, Y(3.4)); g.lineTo(dx0 + k * dw / 6, Y(CITY.street)); g.stroke(); }
    for (const wx of [-16.4, -9.3]) { g.fillStyle = '#231b2e'; g.fillRect(X(wx), Y(3.4), 1.0 * ppm, 1.5 * ppm); g.strokeStyle = '#5a4a62'; g.lineWidth = 3; for (let k = 1; k < 5; k++) { g.beginPath(); g.moveTo(X(wx) + k * .2 * ppm, Y(3.4)); g.lineTo(X(wx) + k * .2 * ppm, Y(4.9)); g.stroke(); } }
    // the corner (right edge) catches the morning sun over the side street
    const eg = g.createLinearGradient(X(B.x1) - 46, 0, X(B.x1), 0); eg.addColorStop(0, rgba('#ffcf9a', 0)); eg.addColorStop(1, rgba('#ffcf9a', .32)); g.fillStyle = eg; g.fillRect(X(B.x1) - 46, Y(B.eave), 46, (CITY.street - B.eave) * ppm);
    return c;
  });
}
// the office tower (Beaux-Arts stone): ground floor 6.2 → 2.6 (arcade + the corner shop), then floors of 3.25 m; the corner bay of the
// 2nd floor is the corner office (left black here: its interior is drawn live)
export const TOWER_FLOORS = (() => { const f = [2.6]; while (f[f.length - 1] - 3.25 > CITY.tower.top + 1) f.push(f[f.length - 1] - 3.25); return f; })();
function towerTex() {
  return once('c5:tower', () => {
    const T = CITY.tower, ppm = 44, w = T.x1 - T.x0, top = T.top - 3, h = CITY.street - top, X = (x) => (x - T.x0) * ppm, Y = (y) => (y - top) * ppm;
    const [c, g] = canvas(Math.ceil(w * ppm), Math.ceil(h * ppm)), r = prng(8), o = CITY.office;
    const fg = g.createLinearGradient(0, Y(T.top), 0, Y(CITY.street)); fg.addColorStop(0, '#6c5f80'); fg.addColorStop(.5, '#4e4466'); fg.addColorStop(1, '#3a3250');
    g.fillStyle = fg; g.fillRect(0, Y(T.top), w * ppm, (CITY.street - T.top) * ppm);
    // mansard crown with dormers and a warm ridge
    g.fillStyle = '#3a3048'; g.beginPath(); g.moveTo(0, Y(T.top)); g.lineTo(X(T.x0 + .8), Y(T.top - 2.6)); g.lineTo(X(T.x1 - .8), Y(T.top - 2.6)); g.lineTo(w * ppm, Y(T.top)); g.closePath(); g.fill();
    g.strokeStyle = rgba('#ffd6a8', .7); g.lineWidth = 2; g.beginPath(); g.moveTo(X(T.x0 + .8), Y(T.top - 2.6)); g.lineTo(X(T.x1 - .8), Y(T.top - 2.6)); g.stroke();
    for (let x = T.x0 + 1.6; x < T.x1 - 1; x += 2.5) { g.fillStyle = '#4a3d58'; g.fillRect(X(x), Y(T.top - 1.9), .9 * ppm, 1.5 * ppm); g.fillStyle = '#251d30'; g.fillRect(X(x) + 6, Y(T.top - 1.6), .9 * ppm - 12, 1.1 * ppm); }
    // stone courses
    g.strokeStyle = rgba('#1b1426', .2); g.lineWidth = 1; for (let y = T.top + .4; y < CITY.street; y += .42) { g.beginPath(); g.moveTo(0, Y(y)); g.lineTo(w * ppm, Y(y)); g.stroke(); }
    // pilasters between the bays
    for (let x = T.x0 + .3; x < T.x1; x += 2.5) { g.fillStyle = rgba('#7a6c8e', .35); g.fillRect(X(x) - 5, Y(T.top), 10, Y(2.6) - Y(T.top)); g.fillStyle = rgba('#140e1e', .3); g.fillRect(X(x) + 5, Y(T.top), 4, Y(2.6) - Y(T.top)); }
    TOWER_FLOORS.forEach((fy, fi) => {
      g.fillStyle = '#5b4f72'; g.fillRect(0, Y(fy) - 5, w * ppm, 10); g.fillStyle = rgba('#120c1c', .4); g.fillRect(0, Y(fy) + 5, w * ppm, 4);
      const fl = fy - 3.25; if (fl < T.top + .5) return;
      for (let x = T.x0 + .4, bi = 0; x < T.x1 - 1.2; x += 2.5, bi++) {
        const corner = fi === 1 && bi === 0, x0 = corner ? o.x0 : x + .5, ww = corner ? o.x1 - o.x0 : 1.5, y0 = fy - 2.7, y1 = fy - .35;
        g.fillStyle = '#5d5174'; g.fillRect(X(x0) - 7, Y(y0) - 7, ww * ppm + 14, (y1 - y0) * ppm + 14);
        g.fillStyle = corner ? '#000000' : (r() < .1 ? '#7a5a52' : '#2b2440'); g.fillRect(X(x0), Y(y0), ww * ppm, (y1 - y0) * ppm);
        if (!corner) {
          const rg = g.createLinearGradient(0, Y(y0), 0, Y(y1)); rg.addColorStop(0, rgba('#d2b0b8', .34)); rg.addColorStop(1, rgba('#c6a6b4', .04)); g.fillStyle = rg; g.fillRect(X(x0), Y(y0), ww * ppm, (y1 - y0) * ppm);
          g.fillStyle = '#4a3f5e'; g.fillRect(X(x0) + ww * ppm / 2 - 2, Y(y0), 4, (y1 - y0) * ppm); g.fillRect(X(x0), Y(y0 + .8), ww * ppm, 3);
        }
        // pediment over the window + sill
        g.fillStyle = '#6a5e82'; g.beginPath(); g.moveTo(X(x0) - 12, Y(y0) - 8); g.lineTo(X(x0 + ww / 2), Y(y0) - 26); g.lineTo(X(x0 + ww) + 12, Y(y0) - 8); g.closePath(); g.fill();
        g.fillStyle = '#665a7c'; g.fillRect(X(x0) - 10, Y(y1) + 6, ww * ppm + 20, 7);
      }
    });
    // ground floor: rusticated stone with arched windows (the corner shop's frame is drawn live)
    g.fillStyle = '#463c58'; g.fillRect(0, Y(2.6), w * ppm, (CITY.street - 2.6) * ppm);
    g.strokeStyle = rgba('#140e1e', .4); g.lineWidth = 1.4; for (let y = 2.95; y < CITY.street; y += .5) { g.beginPath(); g.moveTo(0, Y(y)); g.lineTo(w * ppm, Y(y)); g.stroke(); }
    for (let x = 2.4; x < T.x1 - 1.5; x += 2.5) { g.fillStyle = '#231b30'; g.beginPath(); g.moveTo(X(x), Y(CITY.street - .4)); g.lineTo(X(x), Y(4.0)); g.arc(X(x + .8), Y(4.0), .8 * ppm, Math.PI, 0); g.lineTo(X(x + 1.6), Y(CITY.street - .4)); g.closePath(); g.fill();
      const ag = g.createLinearGradient(0, Y(3.2), 0, Y(CITY.street)); ag.addColorStop(0, rgba('#d8b0a8', .22)); ag.addColorStop(1, rgba('#d8b0a8', 0)); g.fillStyle = ag; g.fill(); }
    // the corner catches the sun
    const eg = g.createLinearGradient(0, 0, 64, 0); eg.addColorStop(0, rgba('#ffd3a0', .42)); eg.addColorStop(1, rgba('#ffd3a0', 0)); g.fillStyle = eg; g.fillRect(0, Y(T.top - 2.6), 64, h * ppm);
    return c;
  });
}
// the corner office seen through its window: the empty executive chair (turning slowly), the desk, the green banker's lamp
export function officeInterior(ctx, t, cam, S) {
  const o = CITY.office, Z0 = CITY.opp + .05, lampOn = S.lamp ?? 1;
  const r = rect3(cam, o.x0, o.y0, Z0, o.x1 - o.x0, o.y1 - o.y0); if (!r) return;
  ctx.save(); ctx.beginPath(); ctx.rect(r[0], r[1], r[2], r[3]); ctx.clip();
  const Zb = Z0 + 4.2, wb = rect3(cam, o.x0 - 2, o.floor - 3.25, Zb, (o.x1 - o.x0) + 4, 3.25);
  { const g = ctx.createLinearGradient(0, r[1], 0, r[1] + r[3]); g.addColorStop(0, '#231a26'); g.addColorStop(1, '#30222a'); ctx.fillStyle = g; ctx.fillRect(r[0], r[1], r[2], r[3]); }
  if (wb) {
    ctx.strokeStyle = rgba('#0c0810', .55); ctx.lineWidth = Math.max(1, wb[4] * .015); for (let x = o.x0 - 2; x < o.x1 + 2; x += .7) { const a = cam.P(x, o.floor - 3.25, Zb), b = cam.P(x, o.floor, Zb); if (a && b) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } }
    const cf = rect3(cam, o.x0 + .25, o.floor - 2.5, Zb - .02, .62, .46); if (cf) { ctx.fillStyle = '#6a5340'; ctx.fillRect(cf[0], cf[1], cf[2], cf[3]); ctx.fillStyle = '#d8ccb0'; ctx.fillRect(cf[0] + cf[2] * .1, cf[1] + cf[3] * .12, cf[2] * .8, cf[3] * .76); }
    // a bookcase on the right
    const bk = rect3(cam, o.x1 - .2, o.floor - 2.4, Zb - .3, 1.2, 2.4); if (bk) { ctx.fillStyle = '#2a1a16'; ctx.fillRect(bk[0], bk[1], bk[2], bk[3]); const rr = prng(3); for (let s = 0; s < 5; s++) { const sy = bk[1] + bk[3] * (.06 + s * .19); let x = bk[0] + bk[2] * .05; while (x < bk[0] + bk[2] * .93) { const bw = bk[2] * (.03 + rr() * .04); ctx.fillStyle = ['#5a2a2a', '#2a3a4a', '#4a3a2a', '#3a2a3a', '#6a5a3a'][Math.floor(rr() * 5)]; ctx.fillRect(x, sy + bk[3] * .02 * rr(), bw, bk[3] * .15); x += bw * 1.1; } } }
  }
  poly3(ctx, cam, [[o.x0 - 2, o.floor, Z0], [o.x1 + 2, o.floor, Z0], [o.x1 + 2, o.floor, Zb], [o.x0 - 2, o.floor, Zb]], '#1c1418');
  const lx = o.x0 + 1.55, lz = Z0 + 2.0, deskY = o.floor - .76;
  const lp = cam.P(lx, deskY - .35, lz);
  if (lp && lampOn > 0) putGlow(ctx, lp[0], lp[1], 3.4 * lp[2], .6 * lampOn, '#ffb35c', '#fff1d6');
  // the executive chair behind the desk: a high tufted leather back, turning slowly (its width follows cos of the turn)
  const ch = S.chair ?? 0, cx0 = o.x0 + 1.05, cz = lz + .6, cw = .64 * Math.abs(Math.cos(ch)) + .16, side = Math.sin(ch);
  const cb = rect3(cam, cx0 - cw / 2, deskY - 1.0, cz, cw, 1.2);
  if (cb) {
    ctx.fillStyle = '#3a1f1c'; const rr = Math.min(cb[2], cb[3]) * .18; ctx.beginPath(); ctx.roundRect(cb[0], cb[1], cb[2], cb[3], [rr, rr, 4, 4]); ctx.fill();
    ctx.fillStyle = rgba('#120808', .6); for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) { ctx.beginPath(); ctx.arc(cb[0] + cb[2] * (.25 + i * .25), cb[1] + cb[3] * (.18 + j * .18), Math.max(1, cb[4] * .012), 0, TAU); ctx.fill(); }
    const lg = ctx.createLinearGradient(cb[0], 0, cb[0] + cb[2], 0); lg.addColorStop(0, rgba('#ffb35c', (.35 + .25 * side) * lampOn)); lg.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = lg; ctx.beginPath(); ctx.roundRect(cb[0], cb[1], cb[2], cb[3], [rr, rr, 4, 4]); ctx.fill();
    // the chair's arm on the turning side and its stem
    const st = rect3(cam, cx0 - .03, deskY + .2, cz, .06, .45); if (st) { ctx.fillStyle = '#1a1010'; ctx.fillRect(st[0], st[1], st[2], st[3]); }
  }
  // the desk: a big dark slab with a leather top, seen from the front
  const d0 = rect3(cam, o.x0 + .3, deskY, lz - .45, 2.0, .1), d1 = rect3(cam, o.x0 + .4, deskY + .1, lz - .45, 1.8, .66);
  if (d1) { ctx.fillStyle = '#2a1b18'; ctx.fillRect(d1[0], d1[1], d1[2], d1[3]); ctx.fillStyle = rgba('#000', .3); ctx.fillRect(d1[0] + d1[2] * .45, d1[1], d1[2] * .1, d1[3]); }
  if (d0) { ctx.fillStyle = '#3d2722'; ctx.fillRect(d0[0], d0[1], d0[2], d0[3]); ctx.fillStyle = rgba('#ffcf8a', .25 * lampOn); ctx.fillRect(d0[0], d0[1], d0[2], d0[3] * .35); }
  // the green banker's lamp: brass stem, green glass shade, bright under the shade
  const ls = rect3(cam, lx - .21, deskY - .4, lz - .3, .42, .15), stt = rect3(cam, lx - .02, deskY - .27, lz - .3, .04, .27), bs = rect3(cam, lx - .12, deskY - .04, lz - .3, .24, .04);
  if (stt) { ctx.fillStyle = '#b58b4a'; ctx.fillRect(stt[0], stt[1], stt[2], stt[3]); }
  if (bs) { ctx.fillStyle = '#9c7640'; ctx.fillRect(bs[0], bs[1], bs[2], bs[3]); }
  if (ls) {
    ctx.fillStyle = mixHex('#123d2a', '#2f8a5e', lampOn); ctx.beginPath(); ctx.moveTo(ls[0], ls[1] + ls[3]); ctx.quadraticCurveTo(ls[0] + ls[2] / 2, ls[1] - ls[3] * .7, ls[0] + ls[2], ls[1] + ls[3]); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba('#d8b060', .7); ctx.lineWidth = Math.max(1, ls[4] * .006); ctx.stroke();
    if (lampOn > 0) { ctx.fillStyle = rgba('#fff1d6', .9 * lampOn); ctx.fillRect(ls[0] + ls[2] * .1, ls[1] + ls[3] * .85, ls[2] * .8, Math.max(1.5, ls[3] * .22)); putGlow(ctx, ls[0] + ls[2] / 2, ls[1] + ls[3], ls[2] * 1.4, .85 * lampOn, '#ffb35c', '#fff1d6'); }
  }
  ctx.fillStyle = rgba('#0a0710', .42 * (1 - lampOn)); ctx.fillRect(r[0], r[1], r[2], r[3]);
  const gg = ctx.createLinearGradient(r[0], r[1], r[0] + r[2], r[1] + r[3]); gg.addColorStop(0, rgba('#ecc6b8', .18)); gg.addColorStop(.5, rgba('#e8c0b8', .03)); gg.addColorStop(1, rgba('#e8c0b8', .1)); ctx.fillStyle = gg; ctx.fillRect(r[0], r[1], r[2], r[3]);
  ctx.restore();
  // mullion and transom over the big window
  ctx.fillStyle = '#4a3f5e'; const m = rect3(cam, (o.x0 + o.x1) / 2 - .03, o.y0, CITY.opp, .06, o.y1 - o.y0); if (m) ctx.fillRect(m[0], m[1], m[2], m[3]);
  const tr = rect3(cam, o.x0, o.y0 + .75, CITY.opp, o.x1 - o.x0, .05); if (tr) ctx.fillRect(tr[0], tr[1], tr[2], tr[3]);
}
// the side wall of the left house along the side street (seen at an angle from your window)
function sideWall(ctx, t, cam) {
  const B = CITY.left, x = CITY.gap.x0, z0 = CITY.opp, z1 = CITY.opp + 14;
  if (cam.x <= x) return;
  const p = poly3(ctx, cam, [[x, B.eave, z0], [x, B.eave, z1], [x, CITY.street, z1], [x, CITY.street, z0]]); if (!p) return;
  const g = ctx.createLinearGradient(p[0][0], 0, p[1][0], 0); g.addColorStop(0, '#5a4868'); g.addColorStop(1, '#6e5a74'); ctx.fillStyle = g; ctx.fill();
  // windows along it (shuttered), the warm light grazing it
  for (let z = z0 + 1.5; z < z1 - 1; z += 3) for (const y of [-.2, 3.3]) { const q = poly3(ctx, cam, [[x, y, z], [x, y, z + 1.0], [x, y + 1.6, z + 1.0], [x, y + 1.6, z]], '#3a2c44'); void q; }
  const lg = ctx.createLinearGradient(0, p[0][1], 0, p[3][1]); lg.addColorStop(0, rgba('#ffcf9a', .28)); lg.addColorStop(1, rgba('#ffcf9a', 0)); ctx.fillStyle = lg; poly3(ctx, cam, [[x, B.eave, z0], [x, B.eave, z1], [x, CITY.street, z1], [x, CITY.street, z0]]); ctx.fill();
  // the side street itself, going down to the harbour
  poly3(ctx, cam, [[CITY.gap.x0, CITY.street, CITY.opp], [CITY.gap.x1, CITY.street, CITY.opp], [CITY.gap.x1, CITY.street + 2.5, z1 + 6], [CITY.gap.x0, CITY.street + 2.5, z1 + 6]], '#4a3c56');
}
export function drawOpposite(ctx, t, cam, S) {
  const z = CITY.opp; if (z <= cam.z + .1) return;
  const B = CITY.left, Tw = CITY.tower;
  sideWall(ctx, t, cam);
  bb(ctx, cam, towerTex(), Tw.x0, Tw.top - 3, z, Tw.x1 - Tw.x0, CITY.street - Tw.top + 3);
  officeInterior(ctx, t, cam, S.office || {});
  bb(ctx, cam, leftTex(), B.x0, B.ridge - .4, z, B.x1 - B.x0, CITY.street - B.ridge + .4);
  shopFront(ctx, t, cam, S);
}
// the corner shop on the tower's ground floor: green painted wood front with a gold-engraved emblem (no lettering), the display window
// (warm inside; its interior drawn by S.shopInterior when the camera is close), the door, a striped awning, wicker fruit baskets
function shopFront(ctx, t, cam, S) {
  const w = CITY.win, d = CITY.door, z = CITY.opp, k = cam.k(z);
  const fr = rect3(cam, w.x0 - .32, 2.62, z - .01, d.x1 - w.x0 + .52, CITY.street - 2.62); if (!fr) return;
  ctx.fillStyle = '#28443d'; ctx.fillRect(fr[0], fr[1], fr[2], fr[3]);
  const fa = rect3(cam, w.x0 - .32, 2.62, z - .015, d.x1 - w.x0 + .52, .36);
  if (fa) { ctx.fillStyle = '#1f3631'; ctx.fillRect(fa[0], fa[1], fa[2], fa[3]); ctx.strokeStyle = '#c99a52'; ctx.lineWidth = Math.max(1, .03 * k); ctx.strokeRect(fa[0] + .08 * k, fa[1] + .07 * k, fa[2] - .16 * k, fa[3] - .14 * k);
    const ex = fa[0] + fa[2] * .42, ey = fa[1] + fa[3] / 2, u = .01 * k; ctx.strokeStyle = '#d8ab60'; ctx.lineWidth = Math.max(1, 2 * u); ctx.beginPath(); ctx.ellipse(ex, ey, 34 * u, 11 * u, 0, 0, TAU); ctx.stroke();
    ctx.fillStyle = '#d8ab60'; ctx.beginPath(); ctx.arc(ex, ey + 3 * u, 6 * u, 0, TAU); ctx.arc(ex, ey - 3 * u, 4 * u, 0, TAU); ctx.fill(); ctx.fillRect(ex - .8 * u, ey - 10 * u, 1.6 * u, 4 * u);
    for (const sd of [-1, 1]) for (let q = 0; q < 4; q++) { ctx.beginPath(); ctx.ellipse(ex + sd * (14 + q * 4.5) * u, ey + (q - 1.5) * 1.2 * u, 3.2 * u, 1.4 * u, sd * .6, 0, TAU); ctx.fill(); } }
  shopWindow(ctx, t, cam, S);
  // the door: glazed upper half (warm), panels below, a brass knob
  const dr = rect3(cam, d.x0, d.y0, z - .02, d.x1 - d.x0, CITY.street - d.y0);
  if (dr) { ctx.fillStyle = '#1b2b27'; ctx.fillRect(dr[0], dr[1], dr[2], dr[3]); const gl = ctx.createLinearGradient(0, dr[1], 0, dr[1] + dr[3] * .5); gl.addColorStop(0, '#f2c88e'); gl.addColorStop(1, '#b8784e'); ctx.fillStyle = gl; ctx.fillRect(dr[0] + dr[2] * .12, dr[1] + dr[3] * .06, dr[2] * .76, dr[3] * .45);
    ctx.fillStyle = '#c99a52'; ctx.beginPath(); ctx.arc(dr[0] + dr[2] * .14, dr[1] + dr[3] * .55, Math.max(1.5, .035 * k), 0, TAU); ctx.fill(); }
  // stall boards under the window
  const sb = rect3(cam, w.x0, w.y1, z - .02, w.x1 - w.x0, CITY.street - w.y1);
  if (sb) { ctx.fillStyle = '#23403a'; ctx.fillRect(sb[0], sb[1], sb[2], sb[3]); ctx.strokeStyle = rgba('#0d1a17', .6); ctx.lineWidth = Math.max(1, .02 * k); for (let q = 0; q < 4; q++) ctx.strokeRect(sb[0] + sb[2] * (.02 + q * .245), sb[1] + sb[3] * .12, sb[2] * .21, sb[3] * .72); }
  awning(ctx, t, cam, S);
  fruitStand(ctx, t, cam, S);
}
function shopWindow(ctx, t, cam, S) {
  const w = CITY.win, r = rect3(cam, w.x0, w.y0, CITY.opp, w.x1 - w.x0, w.y1 - w.y0); if (!r) return;
  ctx.save(); ctx.beginPath(); ctx.rect(r[0], r[1], r[2], r[3]); ctx.clip();
  if (S.shopInterior) S.shopInterior(ctx, t, cam, r);
  else { const g = ctx.createLinearGradient(0, r[1], 0, r[1] + r[3]); g.addColorStop(0, '#f6c98e'); g.addColorStop(.6, '#d99a62'); g.addColorStop(1, '#7a4a3a'); ctx.fillStyle = g; ctx.fillRect(r[0], r[1], r[2], r[3]);
    ctx.fillStyle = rgba('#3a2420', .35); for (let q = 1; q < 4; q++) ctx.fillRect(r[0], r[1] + r[3] * q * .22, r[2], Math.max(1, r[3] * .03)); }
  const gg = ctx.createLinearGradient(0, r[1], 0, r[1] + r[3]); gg.addColorStop(0, rgba('#ffe9cf', .2)); gg.addColorStop(.35, rgba('#ffe9cf', .03)); gg.addColorStop(1, rgba('#ffe9cf', 0)); ctx.fillStyle = gg; ctx.fillRect(r[0], r[1], r[2], r[3]);
  // a diagonal sheen on the glass
  ctx.globalCompositeOperation = 'screen'; const sh = ctx.createLinearGradient(r[0], r[1], r[0] + r[2], r[1] + r[3]); sh.addColorStop(.18, rgba('#fff4e0', 0)); sh.addColorStop(.24, rgba('#fff4e0', .14)); sh.addColorStop(.3, rgba('#fff4e0', 0)); ctx.fillStyle = sh; ctx.fillRect(r[0], r[1], r[2], r[3]);
  ctx.restore();
  ctx.fillStyle = '#28443d'; for (const u of [1 / 3, 2 / 3]) { const m = rect3(cam, mix(w.x0, w.x1, u) - .035, w.y0, CITY.opp - .01, .07, w.y1 - w.y0); if (m) ctx.fillRect(m[0], m[1], m[2], m[3]); }
  const p0 = cam.P((w.x0 + w.x1) / 2, CITY.street, CITY.opp - .8); if (p0) putGlow(ctx, p0[0], p0[1], 2.2 * p0[2], .22, '#ffb35c', '#ffe2b8');
}
// a striped canvas awning over the shop front, sloping out over the pavement (a real 3D surface)
function awning(ctx, t, cam, S) {
  const w = CITY.win, d = CITY.door, x0 = w.x0 - .3, x1 = d.x1 + .2, yb = 2.55, yo = 3.2, zb = CITY.opp - .02, zo = CITY.opp - 1.4;
  const N = 14, flutter = .03 * Math.sin(t * 2.1);
  for (let i = 0; i < N; i++) {
    const a = mix(x0, x1, i / N), b = mix(x0, x1, (i + 1) / N), col = i % 2 ? '#efe2c8' : '#b8505a';
    poly3(ctx, cam, [[a, yb, zb], [b, yb, zb], [b, yo + flutter, zo], [a, yo + flutter, zo]], col);
  }
  const sh = poly3(ctx, cam, [[x0, yb, zb], [x1, yb, zb], [x1, yo + flutter, zo], [x0, yo + flutter, zo]]);
  if (sh) { ctx.fillStyle = rgba('#3a1a24', cam.y > yo ? .45 : .14); ctx.fill(); }
  for (let i = 0; i < N * 2; i++) {
    const a = mix(x0, x1, i / (N * 2)), b = mix(x0, x1, (i + 1) / (N * 2)), m = (a + b) / 2, P = cam.P(a, yo + flutter, zo), Q = cam.P(b, yo + flutter, zo), M = cam.P(m, yo + flutter + .22, zo);
    if (!P || !Q || !M) continue; ctx.fillStyle = Math.floor(i / 2) % 2 ? '#e2d4b8' : '#a8434e'; ctx.beginPath(); ctx.moveTo(P[0], P[1]); ctx.quadraticCurveTo(M[0], M[1] + (M[1] - P[1]) * .3, Q[0], Q[1]); ctx.closePath(); ctx.fill();
  }
}
// wicker baskets of fruit on a tiered stand in front of the window (a cached picture standing on the pavement)
function fruitTex() {
  return once('c5:fruit', () => {
    const ppm = 240, w = 2.6, h = 1.25, [c, g] = canvas(Math.ceil(w * ppm), Math.ceil(h * ppm)), r = prng(31);
    g.fillStyle = '#4a3226'; g.fillRect(.1 * ppm, .62 * ppm, (w - .2) * ppm, .06 * ppm); g.fillRect(.22 * ppm, .25 * ppm, (w - .44) * ppm, .05 * ppm);
    for (const lx of [.2, w - .27]) g.fillRect(lx * ppm, .25 * ppm, .07 * ppm, (h - .25) * ppm);
    g.fillStyle = rgba('#000', .25); g.fillRect(.1 * ppm, .68 * ppm, (w - .2) * ppm, .02 * ppm);
    const fruits = [['#d64a3a', '#8e2a22', .085], ['#f0a03a', '#b5651d', .085], ['#ecd25a', '#b49a2a', .075], ['#8fb04a', '#5a7428', .08], ['#c84a5a', '#7a2434', .08], ['#f2b24a', '#b8761d', .09]];
    const basket = (bx, by, bw, bh, f) => {
      g.save(); g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + bw, by); g.quadraticCurveTo(bx + bw * .96, by + bh, bx + bw * .5, by + bh); g.quadraticCurveTo(bx + bw * .04, by + bh, bx, by); g.closePath();
      g.fillStyle = '#a9773e'; g.fill(); g.clip();
      for (let yy = by; yy < by + bh; yy += 6) { g.strokeStyle = (Math.floor((yy - by) / 6) % 2) ? '#c8954f' : '#8a5e2c'; g.lineWidth = 3.4; g.beginPath(); for (let xx = bx; xx < bx + bw; xx += 10) { g.moveTo(xx, yy); g.quadraticCurveTo(xx + 5, yy + 3, xx + 10, yy); } g.stroke(); }
      g.strokeStyle = rgba('#5a3a18', .6); g.lineWidth = 2; for (let xx = bx + 8; xx < bx + bw; xx += 13) { g.beginPath(); g.moveTo(xx, by); g.lineTo(xx + (xx - bx - bw / 2) * .08, by + bh); g.stroke(); }
      g.restore();
      g.fillStyle = '#7a5228'; g.beginPath(); g.ellipse(bx + bw / 2, by, bw / 2, 7, 0, 0, TAU); g.fill();
      const [c0, c1, fr] = f, R = fr * ppm;
      for (let q = 0; q < 22; q++) {
        const a = r(), fx = bx + bw * (.1 + .8 * r()), fy = by - R * .3 - Math.sin(Math.PI * (fx - bx) / bw) * bh * .5 * r();
        const gr = g.createRadialGradient(fx - R * .35, fy - R * .4, R * .1, fx, fy, R); gr.addColorStop(0, shade(c0, .12)); gr.addColorStop(.6, c0); gr.addColorStop(1, c1);
        g.fillStyle = gr; g.beginPath(); g.arc(fx, fy, R * (.9 + a * .2), 0, TAU); g.fill();
        g.fillStyle = rgba('#fff', .35); g.beginPath(); g.arc(fx - R * .35, fy - R * .35, R * .18, 0, TAU); g.fill();
      }
    };
    for (let i = 0; i < 3; i++) basket((.22 + i * .76) * ppm, .44 * ppm, .66 * ppm, .2 * ppm, fruits[i]);
    for (let i = 0; i < 2; i++) basket((.62 + i * .74) * ppm, .08 * ppm, .62 * ppm, .18 * ppm, fruits[3 + i]);
    g.fillStyle = '#26262c'; g.fillRect(2.2 * ppm, .74 * ppm, .3 * ppm, .24 * ppm); g.strokeStyle = rgba('#efe9dc', .8); g.lineWidth = 2.2;
    for (let q = 0; q < 3; q++) { g.beginPath(); g.moveTo(2.24 * ppm, (.8 + q * .06) * ppm); for (let p = 0; p < 6; p++) g.lineTo((2.25 + p * .04) * ppm, (.8 + q * .06) * ppm + (p % 2 ? -4 : 3)); g.stroke(); }
    return c;
  });
}
function fruitStand(ctx, t, cam, S) { bb(ctx, cam, fruitTex(), CITY.win.x0 - .1, CITY.street - 1.25, CITY.opp - .6, 2.6, 1.25); }

// ---------------------------------------------------------------- the street below your window (cobbles, the pavement over there)
export function drawStreet(ctx, t, cam, S) {
  const y = CITY.street; if (cam.y >= y) return;
  const p = poly3(ctx, cam, [[-30, y, .4], [30, y, .4], [30, y, CITY.opp], [-30, y, CITY.opp]]); if (!p) return;
  const g = ctx.createLinearGradient(0, Math.min(...p.map((q) => q[1])), 0, Math.max(...p.map((q) => q[1]))); g.addColorStop(0, '#5e4a62'); g.addColorStop(1, '#3a2c44'); ctx.fillStyle = g; ctx.fill();
  ctx.save(); ctx.clip(); ctx.strokeStyle = rgba('#1e1626', .32); ctx.lineWidth = 1;
  for (let z = 1.6; z < CITY.opp - 1.4; z += .22) { const s = seg3(cam, [-30, y, z], [30, y, z]); if (s) { ctx.beginPath(); ctx.moveTo(s[0][0], s[0][1]); ctx.lineTo(s[1][0], s[1][1]); ctx.stroke(); } }
  ctx.restore();
  poly3(ctx, cam, [[-30, y - .15, CITY.opp - 1.5], [30, y - .15, CITY.opp - 1.5], [30, y - .15, CITY.opp], [-30, y - .15, CITY.opp]], '#544660');
  poly3(ctx, cam, [[-30, y - .15, CITY.opp - 1.5], [30, y - .15, CITY.opp - 1.5], [30, y, CITY.opp - 1.5], [-30, y, CITY.opp - 1.5]], '#3e3248');
}

// ---------------------------------------------------------------- everything outside, far → near
export function drawOutside(ctx, t, cam, S) {
  if (S.plate >= .9999) { plate(ctx, t, 'light', { tone: 'dawn' }); return; }
  drawSky(ctx, cam, S.tod);
  drawSun(ctx, t, cam, S);
  drawFar(ctx, t, cam, S);
  drawRows(ctx, t, cam, S);
  drawStreet(ctx, t, cam, S);
  drawOpposite(ctx, t, cam, S);
}
export { ROWS };
