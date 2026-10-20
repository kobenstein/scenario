// c05 · the city in the morning (Film 4 v2): everything outside your bedroom window, as ONE world seen by the translation-only camera of
// lib/v2_c05_kit.mjs (metres, y down, z east). The sun rises in the east behind the town: every facade that faces you is in its own shadow,
// edges catch a warm rim, the bay glitters below the sun, a golden haze lies over the water and hides the far shore.
//   CITY                       the layout (street level, facades, rows, viaduct, factory, quay)
//   sun(tod) → { az, el, col } the sun direction (tangents) and colour at a time of day (hours)
//   drawOutside(ctx, t, cam, S)  the whole outside, far → near. S = { tod, k (aureole scale), sunXY (forced screen centre of the glow),
//                              plate (1 → the glow is the exact plate light), shop {…}, office {…}, ghost {…} } (see the functions)
import { W, H, rgba, clamp, mix, prng, canvas, once, memo, camOf, poly3, path3, rect3, bb, seg3, plateGlow, mixHex, shade, ramp3, putGlow, stippleTex, eo, qio, smo, ramp, TAU } from './v2_c05_kit.mjs';
import { house, vnoise, fbm, stipple } from './art.mjs';
import { plate } from './handoff4.mjs';

export const CITY = {
  street: 6.2,                 // street level below your floor (y down: +6.2 m)
  opp: 8.4,                    // the facades across the street
  shop: { x0: -14, x1: -3.2, eave: -.6, ridge: -2.7 },
  win: { x0: -8.5, x1: -4.7, y0: 2.85, y1: 5.55 },     // the shop's display window (y = top, bottom)
  door: { x0: -4.45, x1: -3.45, y0: 2.9 },
  tower: { x0: 1.0, x1: 17, top: -24 },
  office: { x0: 1.45, x1: 3.95, y0: -2.95, y1: -.55 },  // the corner office window (3rd floor, level with your room)
  side: { x0: -3.2, x1: 1.0 },  // the side street running east, down to the harbour
};

// ---------------------------------------------------------------- sun and sky over one day (tod = hour of the day)
export function sun(tod) {
  const h = clamp(tod, 6, 20), el = Math.max(.02, h < 13 ? (7 + (h - 7) * 8.6) : (59 - (h - 13) * 8.2)) * Math.PI / 180, az = (-6 + (h - 7) * 9) * Math.PI / 180;
  return { az: Math.tan(az), el: Math.tan(el), col: ramp3([[7, '#ffd9a0'], [9, '#ffd8a8'], [11, '#fff0d6'], [14, '#ffe6c0'], [17, '#ffc88a'], [19, '#ff9f78']], h) };
}
// sky colour by elevation (tangent) at a time of day
const SKY = {
  7: [[-.1, '#e7b48e'], [0, '#f4c393'], [.05, '#efb596'], [.16, '#d9a1a0'], [.36, '#a594bd'], [.8, '#5e66a3']],
  10: [[-.1, '#ecd0ae'], [0, '#f2d6b2'], [.05, '#ead0b8'], [.16, '#cfc1c8'], [.36, '#9eaed6'], [.8, '#5f7fc6']],
  13: [[-.1, '#ecd8b8'], [0, '#f3ddb8'], [.05, '#e7d4c0'], [.16, '#c7c4d6'], [.36, '#93acd8'], [.8, '#587ac4']],
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

// ---------------------------------------------------------------- far: the haze over the bay, the glittering water, the far shore
const HAZE_Z = 1400;
function hazeTex() {
  return once('c5:haze', () => {
    const w = 3200, h = 260, [c, g] = canvas(w, h), n = vnoise(51);
    // a soft band, densest at the horizon (row 150), wisps on top, slow structure along x
    const id = g.createImageData(w, h), p = id.data;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const v = (y - 150) / 150, f = fbm(n, x * .004, y * .02, 4), top = clamp(1 - Math.abs(v) * 1.3 + (f - .5) * 1.1) ** 1.4, a = clamp(top * (y > 150 ? 1.25 : 1));
      const o = (y * w + x) * 4; p[o] = 255; p[o + 1] = 236; p[o + 2] = 205; p[o + 3] = 255 * a;
    }
    g.putImageData(id, 0, 0); stipple(c, { k: .35, g: 1.1, seed: 9 }); return c;
  });
}
function drawFar(ctx, t, cam, S) {
  const s = sun(S.tod), tod = S.tod;
  // the water: from the quay to the horizon, a gradient by depression angle, with the sun's glitter path below the sun
  const yh = cam.py - cam.f * .0, yq = cam.P(0, 18, 80);
  const y1 = yq ? Math.min(H + 50, yq[1]) : H + 50;
  if (y1 > yh) {
    const g = ctx.createLinearGradient(0, yh, 0, Math.max(yh + 1, y1));
    g.addColorStop(0, mixHex('#e9c39c', '#dccbb0', clamp((tod - 7) / 5))); g.addColorStop(.25, mixHex('#b88f8d', '#9aa2b8', clamp((tod - 7) / 5))); g.addColorStop(1, mixHex('#5b4e72', '#4c5f86', clamp((tod - 7) / 5)));
    ctx.fillStyle = g; ctx.fillRect(0, yh, W, Math.max(0, y1 - yh));
    // glitter path: short horizontal strokes under the sun, denser near the horizon, shimmering
    const [sx] = cam.dir(s.az, -s.el), r = prng(77 + Math.floor(t * 10));
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(s.col, .55);
    for (let i = 0; i < 520; i++) {
      const v = Math.pow(r(), 2.2), e = .002 + v * .16, yy = cam.py + cam.f * e; if (yy < yh || yy > y1) { r(); r(); continue; }
      const spread = (14 + 420 * v) * cam.f / 1300, xx = sx + (r() - .5) * 2 * spread * (.3 + r() * .7), w2 = (2 + r() * 9) * (1 - v * .5) * cam.f / 1300;
      ctx.globalAlpha = .25 + .55 * (1 - v); ctx.fillRect(xx - w2 / 2, yy, w2, Math.max(1, cam.f / 1300 * (1 + v * 1.5)));
    }
    ctx.restore();
  }
  // the haze bank over the far water (hides the far shore in the morning), a billboard at the horizon
  const hz = hazeTex(), hw = 3200 / 1300 * HAZE_Z * 1.15, hh = 260 / 1300 * HAZE_Z * 1.15, r0 = cam.P(cam.x - hw / 2, 0, HAZE_Z);
  if (r0) { const k = cam.f / (HAZE_Z - cam.z), sc = 1300 / cam.f; ctx.save(); ctx.globalAlpha = clamp(S.hazeA ?? 1); ctx.drawImage(hz, cam.px + (-hw / 2) * k + (t * 4 % 200) * 0 - 0, cam.py + (-.0 - 150 / 260 * hh) * k + (0 - cam.y) * k * 0, hw * k, hh * k); ctx.restore(); }
}

// ---------------------------------------------------------------- the sun: the plate light, shrunk to its aureole
export function drawSun(ctx, t, cam, S) {
  const s = sun(S.tod);
  let [x, y] = S.sunXY || cam.dir(s.az, -s.el);
  if (S.plate >= .9999) { plate(ctx, t, 'light', { tone: 'dawn' }); return [x, y]; }
  plateGlow(ctx, t, x, y, S.k ?? .1);
  return [x, y];
}

// ---------------------------------------------------------------- rows of houses (billboards), the town going down to the harbour
// each row: a cached texture of houses (art.house) in the shadow of the morning sun with a warm rim on the roofs
const ROWS = [
  { key: 'r1', z: 21, x0: -46, w: 82, ground: 8.6, hMin: 6, hMax: 11, seed: 11, wall: '#5a4a6e', haze: .18 },
  { key: 'r2', z: 46, x0: -80, w: 150, ground: 15.6, hMin: 5, hMax: 9, seed: 23, wall: '#6d5a7a', haze: .34 },
  { key: 'r3', z: 74, x0: -110, w: 210, ground: 17.2, hMin: 4, hMax: 8, seed: 37, wall: '#806a84', haze: .5 },
];
function rowTex(R) {
  return once('c5:row:' + R.key, () => {
    const ppm = R.z < 30 ? 34 : 26, top = R.hMax * 1.9, w = Math.ceil(R.w * ppm), h = Math.ceil(top * ppm), [c, g] = canvas(w, h), r = prng(R.seed);
    const wall = mixHex(R.wall, '#e9c0a0', R.haze * .55), rim = '#ffd9a8';
    let x = 4;
    while (x < w - 4) {
      const hw = (4.5 + r() * 6) * ppm, hh = (R.hMin + r() * (R.hMax - R.hMin)) * ppm;
      if (R.gap && x / ppm + R.x0 > R.gap[0] && x / ppm + R.x0 < R.gap[1]) { x += 1 * ppm; continue; }
      const res = house(g, r, x + hw / 2, h, hw, hh, { wall: shade(wall, (r() - .5) * .06), roofs: ['gable', 'gable', 'hip', 'steep', 'flat', 'parapet', 'mansard'], chimney: .5, bay: .1, floorH: 3.1 * ppm, colW: 2.6 * ppm, wscale: ppm / 22,
        lit: (wx, wy, rr) => (rr() < .06 ? .55 : 0), winOff: shade(wall, -.07), winOn: '#ffcf8a', door: true, amp: ppm * .04 });
      // the warm rim along the roof line (the sun is behind the town)
      g.save(); g.strokeStyle = rgba(rim, .75); g.lineWidth = Math.max(1.2, ppm * .07); g.lineJoin = 'round'; g.beginPath();
      res.outline.slice(1, -1).forEach(([px, py], i) => (i ? g.lineTo(px, py) : g.moveTo(px, py))); g.stroke(); g.restore();
      x += hw * (.82 + r() * .3);
    }
    // haze veil from the bottom (the morning mist in the streets)
    const vg = g.createLinearGradient(0, h * .3, 0, h); vg.addColorStop(0, rgba('#f2c8a4', 0)); vg.addColorStop(1, rgba('#f2c8a4', .35 + R.haze * .4));
    g.globalCompositeOperation = 'source-atop'; g.fillStyle = vg; g.fillRect(0, 0, w, h); g.globalCompositeOperation = 'source-over';
    return c;
  });
}
function drawRows(ctx, t, cam, S, zMin = 0) {
  for (let i = ROWS.length - 1; i >= 0; i--) {
    const R = ROWS[i]; if (R.z <= cam.z + .5 || R.z < zMin) continue;
    const top = R.hMax * 1.9; bb(ctx, cam, rowTex(R), R.x0, R.ground - top, R.z, R.w, top);
  }
}

// ---------------------------------------------------------------- across the street: the shop building (corner shop) and the office tower
const PPM_OPP = 70;
function shopBldgTex() {
  return once('c5:shopbldg', () => {
    const B = CITY.shop, ppm = PPM_OPP, x0 = B.x0, w = (B.x1 - B.x0), top = B.ridge - .4, h = CITY.street - top;
    const [c, g] = canvas(Math.ceil(w * ppm), Math.ceil(h * ppm)), r = prng(4), X = (x) => (x - x0) * ppm, Y = (y) => (y - top) * ppm;
    const wall = '#4b3d5c', wallLit = '#6a5470';
    // roof (seen from a little above): tiles in rows
    g.fillStyle = '#3a2b40'; g.beginPath(); g.moveTo(X(x0), Y(B.eave)); g.lineTo(X(x0 + .6), Y(B.ridge)); g.lineTo(X(B.x1 - .6), Y(B.ridge)); g.lineTo(X(B.x1), Y(B.eave)); g.closePath(); g.fill();
    g.strokeStyle = rgba('#1c1424', .55); g.lineWidth = 1.4;
    for (let y = B.ridge + .18; y < B.eave; y += .26) { g.beginPath(); g.moveTo(X(x0 + .3), Y(y)); for (let x = x0 + .3; x < B.x1 - .3; x += .3) g.lineTo(X(x), Y(y) + Math.sin(x * 10.5) * 1.6); g.stroke(); }
    g.strokeStyle = rgba('#ffd2a0', .7); g.lineWidth = 2.2; g.beginPath(); g.moveTo(X(x0 + .6), Y(B.ridge)); g.lineTo(X(B.x1 - .6), Y(B.ridge)); g.stroke();
    // chimney
    g.fillStyle = '#3d2e45'; g.fillRect(X(-11.2), Y(B.ridge - 1.4), .7 * ppm, 1.6 * ppm); g.fillStyle = rgba('#ffd2a0', .6); g.fillRect(X(-11.2), Y(B.ridge - 1.4), .7 * ppm, 3);
    // facade
    const fg = g.createLinearGradient(0, Y(B.eave), 0, Y(CITY.street)); fg.addColorStop(0, wallLit); fg.addColorStop(1, wall);
    g.fillStyle = fg; g.fillRect(X(x0), Y(B.eave), w * ppm, (CITY.street - B.eave) * ppm);
    // plaster texture + engraved courses
    const n = vnoise(5); for (let i = 0; i < 2600; i++) { const px = r() * w * ppm, py = Y(B.eave) + r() * (CITY.street - B.eave) * ppm; g.fillStyle = rgba(r() < .5 ? '#000' : '#fff', .04 + r() * .05); g.fillRect(px, py, 1 + r() * 2, 1 + r() * 2); }
    g.strokeStyle = rgba('#1a1222', .18); g.lineWidth = 1; for (let y = B.eave + .3; y < 2.4; y += .32) { g.beginPath(); g.moveTo(0, Y(y)); g.lineTo(w * ppm, Y(y) + (n(y, 1) - .5) * 2); g.stroke(); }
    // cornice + string course
    g.fillStyle = '#5d4b68'; g.fillRect(0, Y(B.eave) - 6, w * ppm, 14); g.fillStyle = rgba('#140c1c', .45); g.fillRect(0, Y(B.eave) + 8, w * ppm, 5);
    g.fillStyle = '#56455f'; g.fillRect(0, Y(2.45), w * ppm, 11); g.fillStyle = rgba('#140c1c', .4); g.fillRect(0, Y(2.45) + 11, w * ppm, 4);
    // first-floor windows with shutters (morning: closed shutters on two, one open with a flower box)
    for (const [cx, open] of [[-12.4, 0], [-9.6, 1], [-6.8, 0], [-4.4, 1]]) {
      const ww = 1.05, y0 = .2, y1 = 1.85;
      g.fillStyle = '#2a2034'; g.fillRect(X(cx - ww / 2), Y(y0), ww * ppm, (y1 - y0) * ppm);
      if (open) { g.fillStyle = rgba('#e8b48c', .35); g.fillRect(X(cx - ww / 2) + 6, Y(y0) + 6, ww * ppm - 12, (y1 - y0) * ppm * .45); }
      g.strokeStyle = '#5e4c66'; g.lineWidth = 4; g.strokeRect(X(cx - ww / 2), Y(y0), ww * ppm, (y1 - y0) * ppm);
      g.beginPath(); g.moveTo(X(cx), Y(y0)); g.lineTo(X(cx), Y(y1)); g.stroke();
      for (const sd of [-1, 1]) { // shutters: louvred
        const sx0 = open ? X(cx + sd * (ww / 2 + .02)) + (sd < 0 ? -ww * .5 * ppm : 0) : X(cx - ww / 2 + (sd > 0 ? ww / 2 : 0));
        const sw = ww * .5 * ppm; if (!open && sd > 0) { } g.fillStyle = open ? '#3f5b5e' : '#466568'; g.fillRect(sx0, Y(y0), sw, (y1 - y0) * ppm);
        g.strokeStyle = rgba('#14202a', .5); g.lineWidth = 1.5; for (let yy = Y(y0) + 6; yy < Y(y1) - 4; yy += 7) { g.beginPath(); g.moveTo(sx0 + 4, yy); g.lineTo(sx0 + sw - 4, yy + 2); g.stroke(); }
      }
      g.fillStyle = '#5a4762'; g.fillRect(X(cx - ww / 2 - .1), Y(y1), (ww + .2) * ppm, 9);
      if (open) { // flower box with geraniums
        g.fillStyle = '#3a2a30'; g.fillRect(X(cx - ww / 2), Y(y1) - 16, ww * ppm, 18);
        for (let k = 0; k < 9; k++) { const fx = X(cx - ww / 2) + 6 + k * (ww * ppm - 12) / 8, fy = Y(y1) - 18 - r() * 8; g.fillStyle = '#2f4a38'; g.beginPath(); g.arc(fx, fy + 4, 7, 0, TAU); g.fill(); g.fillStyle = r() < .5 ? '#d8525a' : '#e8a3a0'; g.beginPath(); g.arc(fx + (r() - .5) * 4, fy - 2, 4.5, 0, TAU); g.fill(); }
      }
    }
    // ground floor: plinth stone, the corner shop at the right: a dark frame, the display window (painted separately), the door
    g.fillStyle = '#3c3048'; g.fillRect(0, Y(2.6), w * ppm, (CITY.street - 2.6) * ppm);
    g.strokeStyle = rgba('#15101c', .35); g.lineWidth = 1.2; for (let y = 2.9; y < CITY.street; y += .45) { g.beginPath(); g.moveTo(0, Y(y)); g.lineTo(w * ppm, Y(y)); g.stroke(); for (let x = x0 + ((y * 7) % 1) * .9; x < B.x1; x += .9) { g.beginPath(); g.moveTo(X(x), Y(y)); g.lineTo(X(x), Y(y + .45)); g.stroke(); } }
    // the shop front: painted wood frame (deep green), fascia board above with an engraved emblem (no lettering)
    const S = CITY.win, D = CITY.door;
    g.fillStyle = '#28443d'; g.fillRect(X(S.x0 - .35), Y(2.5), (D.x1 - S.x0 + .55) * ppm, (CITY.street - 2.5) * ppm);
    g.fillStyle = '#1f3631'; g.fillRect(X(S.x0 - .35), Y(2.5), (D.x1 - S.x0 + .55) * ppm, .42 * ppm);
    g.strokeStyle = '#c99a52'; g.lineWidth = 2.4; g.strokeRect(X(S.x0 - .2), Y(2.5) + 7, (D.x1 - S.x0 + .25) * ppm, .42 * ppm - 14);
    // the emblem: an engraved pear in a laurel oval, gold
    const ex = X((S.x0 + D.x1) / 2), ey = Y(2.5) + .21 * ppm; g.strokeStyle = '#d8ab60'; g.lineWidth = 2; g.beginPath(); g.ellipse(ex, ey, 34, 11, 0, 0, TAU); g.stroke();
    g.fillStyle = '#d8ab60'; g.beginPath(); g.arc(ex, ey + 3, 6, 0, TAU); g.arc(ex, ey - 3, 4, 0, TAU); g.fill(); g.fillRect(ex - .8, ey - 10, 1.6, 4);
    for (const sd of [-1, 1]) for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(ex + sd * (14 + k * 4.5), ey + (k - 1.5) * 1.2, 3.2, 1.4, sd * .6, 0, TAU); g.fill(); }
    // display window recess (the glass itself is drawn live) and the door
    g.fillStyle = '#120d18'; g.fillRect(X(S.x0), Y(S.y0), (S.x1 - S.x0) * ppm, (S.y1 - S.y0) * ppm);
    g.fillStyle = '#1b2b27'; g.fillRect(X(D.x0), Y(D.y0), (D.x1 - D.x0) * ppm, (CITY.street - D.y0) * ppm);
    g.fillStyle = '#120d18'; g.fillRect(X(D.x0) + 8, Y(D.y0) + 8, (D.x1 - D.x0) * ppm - 16, 1.4 * ppm);
    g.fillStyle = '#c99a52'; g.beginPath(); g.arc(X(D.x0) + 10, Y(4.6), 3.5, 0, TAU); g.fill();
    // stall boards under the window (panelled)
    g.fillStyle = '#23403a'; g.fillRect(X(S.x0), Y(S.y1), (S.x1 - S.x0) * ppm, (CITY.street - S.y1) * ppm);
    g.strokeStyle = rgba('#0d1a17', .6); g.lineWidth = 2; for (let k = 0; k < 4; k++) g.strokeRect(X(S.x0) + 8 + k * ((S.x1 - S.x0) * ppm - 16) / 4, Y(S.y1) + 8, ((S.x1 - S.x0) * ppm - 16) / 4 - 6, (CITY.street - S.y1) * ppm - 16);
    // the left neighbour's door and a downpipe
    g.fillStyle = '#2a2236'; g.fillRect(X(-12.6), Y(3.3), 1.1 * ppm, (CITY.street - 3.3) * ppm); g.fillStyle = '#4a3c56'; g.fillRect(X(-10.4), Y(B.eave), 8, (CITY.street - B.eave) * ppm);
    // the corner (right edge) catches the sun: a warm edge
    const eg = g.createLinearGradient(X(B.x1) - 40, 0, X(B.x1), 0); eg.addColorStop(0, rgba('#ffcf9a', 0)); eg.addColorStop(1, rgba('#ffcf9a', .28)); g.fillStyle = eg; g.fillRect(X(B.x1) - 40, Y(B.eave), 40, (2.5 - B.eave) * ppm);
    return c;
  });
}
function towerTex() {
  return once('c5:tower', () => {
    const T = CITY.tower, ppm = 46, w = T.x1 - T.x0, h = CITY.street - T.top + 3, top = T.top - 3, X = (x) => (x - T.x0) * ppm, Y = (y) => (y - top) * ppm;
    const [c, g] = canvas(Math.ceil(w * ppm), Math.ceil(h * ppm)), r = prng(8);
    const fg = g.createLinearGradient(0, Y(T.top), 0, Y(CITY.street)); fg.addColorStop(0, '#6c5f80'); fg.addColorStop(.5, '#4e4466'); fg.addColorStop(1, '#3a3250');
    g.fillStyle = fg; g.fillRect(0, Y(T.top), w * ppm, (CITY.street - T.top) * ppm);
    // mansard crown with dormers
    g.fillStyle = '#3a3048'; g.beginPath(); g.moveTo(0, Y(T.top)); g.lineTo(X(T.x0 + .8), Y(T.top - 2.6)); g.lineTo(X(T.x1 - .8), Y(T.top - 2.6)); g.lineTo(w * ppm, Y(T.top)); g.closePath(); g.fill();
    g.strokeStyle = rgba('#ffd6a8', .65); g.lineWidth = 2; g.beginPath(); g.moveTo(X(T.x0 + .8), Y(T.top - 2.6)); g.lineTo(X(T.x1 - .8), Y(T.top - 2.6)); g.stroke();
    for (let x = T.x0 + 1.6; x < T.x1 - 1; x += 2.4) { g.fillStyle = '#4a3d58'; g.fillRect(X(x), Y(T.top - 1.9), .9 * ppm, 1.5 * ppm); g.fillStyle = '#251d30'; g.fillRect(X(x) + 6, Y(T.top - 1.6), .9 * ppm - 12, 1.1 * ppm); }
    // stone courses and pilasters
    g.strokeStyle = rgba('#1b1426', .22); g.lineWidth = 1; for (let y = T.top + .4; y < CITY.street; y += .42) { g.beginPath(); g.moveTo(0, Y(y)); g.lineTo(w * ppm, Y(y)); g.stroke(); }
    // floors: 3.3 m, window bays 2.5 m; the corner office is the bay at x 1.45..3.95 on the floor at y -0.2
    const fl = [], o = CITY.office;
    for (let fy = CITY.street - 3.6; fy > T.top + 1; fy -= 3.3) fl.push(fy);
    fl.forEach((fy, fi) => {
      g.fillStyle = '#5b4f72'; g.fillRect(0, Y(fy) - 5, w * ppm, 10); g.fillStyle = rgba('#120c1c', .4); g.fillRect(0, Y(fy) + 5, w * ppm, 4);
      if (fi === 0) return;   // the base: stone arcade
      for (let x = T.x0 + .45, bi = 0; x < T.x1 - 1.2; x += 2.5, bi++) {
        const corner = Math.abs(fy - (-.2)) < 1 && bi === 0, ww = corner ? o.x1 - o.x0 : 1.5, x0 = corner ? o.x0 : x + .5, y0 = fy - 2.75, y1 = fy - .55;
        g.fillStyle = '#5d5174'; g.fillRect(X(x0) - 7, Y(y0) - 7, ww * ppm + 14, (y1 - y0) * ppm + 14);
        g.fillStyle = corner ? '#000000' : (r() < .12 ? '#7a5a52' : '#2b2440'); g.fillRect(X(x0), Y(y0), ww * ppm, (y1 - y0) * ppm);
        if (!corner) { // sky reflected in the glass, mullions
          const rg = g.createLinearGradient(0, Y(y0), 0, Y(y1)); rg.addColorStop(0, rgba('#c6a6b4', .32)); rg.addColorStop(1, rgba('#c6a6b4', .04)); g.fillStyle = rg; g.fillRect(X(x0), Y(y0), ww * ppm, (y1 - y0) * ppm);
          g.fillStyle = '#4a3f5e'; g.fillRect(X(x0) + ww * ppm / 2 - 2, Y(y0), 4, (y1 - y0) * ppm); g.fillRect(X(x0), Y(y0 + .8), ww * ppm, 3);
        }
        g.fillStyle = '#665a7c'; g.fillRect(X(x0) - 10, Y(y1) + 6, ww * ppm + 20, 7);
      }
    });
    // base: rusticated stone with arched openings
    for (let x = T.x0 + .8; x < T.x1 - 1; x += 3.1) { g.fillStyle = '#251d32'; g.beginPath(); g.moveTo(X(x), Y(CITY.street)); g.lineTo(X(x), Y(CITY.street - 2.2)); g.arc(X(x + .9), Y(CITY.street - 2.2), .9 * ppm, Math.PI, 0); g.lineTo(X(x + 1.8), Y(CITY.street)); g.closePath(); g.fill(); }
    // the corner catches the sun
    const eg = g.createLinearGradient(0, 0, 60, 0); eg.addColorStop(0, rgba('#ffd3a0', .35)); eg.addColorStop(1, rgba('#ffd3a0', 0)); g.fillStyle = eg; g.fillRect(0, Y(T.top - 2.6), 60, h * ppm);
    return c;
  });
}
// the corner office seen through its window: the empty executive chair (turning slowly), the desk, the green banker's lamp
export function officeInterior(ctx, t, cam, S) {
  const o = CITY.office, Z0 = CITY.opp + .05, lampOn = S.lamp ?? 1;
  const r = rect3(cam, o.x0, o.y0, Z0, o.x1 - o.x0, o.y1 - o.y0); if (!r) return;
  ctx.save(); ctx.beginPath(); ctx.rect(r[0], r[1], r[2], r[3]); ctx.clip();
  // back wall (Z0 + 4.5) panelled wood, lit by the lamp
  const Zb = Z0 + 4.2, wb = rect3(cam, o.x0 - 2, o.y0 - .6, Zb, (o.x1 - o.x0) + 4, 3.6);
  if (wb) { const g = ctx.createLinearGradient(0, wb[1], 0, wb[1] + wb[3]); g.addColorStop(0, '#1f1824'); g.addColorStop(1, '#2c2026'); ctx.fillStyle = g; ctx.fillRect(r[0], r[1], r[2], r[3]);
    ctx.strokeStyle = rgba('#0c0810', .6); ctx.lineWidth = Math.max(1, wb[4] * .015); for (let x = o.x0 - 2; x < o.x1 + 2; x += .7) { const a = cam.P(x, o.y0 - .6, Zb), b = cam.P(x, o.y1 + 1, Zb); if (a && b) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } }
    // a framed certificate on the wall (no text) and a bookcase
    const cf = rect3(cam, o.x0 + .3, o.y0 + .45, Zb - .02, .6, .45); if (cf) { ctx.fillStyle = '#6a5340'; ctx.fillRect(cf[0], cf[1], cf[2], cf[3]); ctx.fillStyle = '#d8ccb0'; ctx.fillRect(cf[0] + cf[2] * .1, cf[1] + cf[3] * .12, cf[2] * .8, cf[3] * .76); }
  }
  // floor
  const fl = poly3(ctx, cam, [[o.x0 - 2, -.2, Z0], [o.x1 + 2, -.2, Z0], [o.x1 + 2, -.2, Zb], [o.x0 - 2, -.2, Zb]], '#1a1418');
  // lamp light pool on the desk + wall
  const lx = o.x0 + 1.55, lz = Z0 + 2.1, deskY = -.95;
  const lp = cam.P(lx, deskY - .35, lz);
  if (lp && lampOn > 0) putGlow(ctx, lp[0], lp[1], 3.2 * lp[2], .55 * lampOn, '#ffb35c', '#fff1d6');
  // the desk: a big dark slab with a leather top, seen from the front
  const d0 = rect3(cam, o.x0 + .35, deskY, lz - .45, 2.0, .12), d1 = rect3(cam, o.x0 + .45, deskY + .12, lz - .45, 1.8, .63);
  if (d1) { ctx.fillStyle = '#2a1b18'; ctx.fillRect(d1[0], d1[1], d1[2], d1[3]); ctx.fillStyle = rgba('#000', .3); ctx.fillRect(d1[0] + d1[2] * .45, d1[1], d1[2] * .1, d1[3]); }
  if (d0) { ctx.fillStyle = '#3d2722'; ctx.fillRect(d0[0], d0[1], d0[2], d0[3]); ctx.fillStyle = rgba('#ffcf8a', .25 * lampOn); ctx.fillRect(d0[0], d0[1], d0[2], d0[3] * .35); }
  // the executive chair behind the desk: high leather back, turning slowly (its back's width follows cos of the turn)
  const ch = S.chair ?? 0, cx0 = o.x0 + 1.1, cz = lz + .55, cw = .62 * Math.abs(Math.cos(ch)) + .14, side = Math.sin(ch);
  const cb = rect3(cam, cx0 - cw / 2, deskY - .95, cz, cw, 1.15), seat = rect3(cam, cx0 - .3, deskY + .05, cz, .6, .1);
  if (cb) {
    ctx.fillStyle = '#3a1f1c'; const rr = Math.min(cb[2], cb[3]) * .18; ctx.beginPath(); ctx.roundRect(cb[0], cb[1], cb[2], cb[3], [rr, rr, 4, 4]); ctx.fill();
    // tufted buttons
    ctx.fillStyle = rgba('#120808', .6); for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) { ctx.beginPath(); ctx.arc(cb[0] + cb[2] * (.25 + i * .25) , cb[1] + cb[3] * (.18 + j * .18), Math.max(1, cb[4] * .012), 0, TAU); ctx.fill(); }
    // the lamp's light on the leather (one side, following the turn)
    const lg = ctx.createLinearGradient(cb[0], 0, cb[0] + cb[2], 0); lg.addColorStop(0, rgba('#ffb35c', (.35 + .25 * side) * lampOn)); lg.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = lg; ctx.beginPath(); ctx.roundRect(cb[0], cb[1], cb[2], cb[3], [rr, rr, 4, 4]); ctx.fill();
  }
  // the green banker's lamp on the desk: brass stem, green glass shade, bright under the shade
  const ls = rect3(cam, lx - .2, deskY - .38, lz - .3, .4, .14), st = rect3(cam, lx - .02, deskY - .26, lz - .3, .04, .26), bs = rect3(cam, lx - .12, deskY - .04, lz - .3, .24, .04);
  if (st) { ctx.fillStyle = '#b58b4a'; ctx.fillRect(st[0], st[1], st[2], st[3]); }
  if (bs) { ctx.fillStyle = '#9c7640'; ctx.fillRect(bs[0], bs[1], bs[2], bs[3]); }
  if (ls) {
    ctx.fillStyle = mixHex('#123d2a', '#2f8a5e', lampOn); ctx.beginPath(); ctx.moveTo(ls[0], ls[1] + ls[3]); ctx.quadraticCurveTo(ls[0] + ls[2] / 2, ls[1] - ls[3] * .7, ls[0] + ls[2], ls[1] + ls[3]); ctx.closePath(); ctx.fill();
    if (lampOn > 0) { ctx.fillStyle = rgba('#fff1d6', .9 * lampOn); ctx.fillRect(ls[0] + ls[2] * .1, ls[1] + ls[3] * .85, ls[2] * .8, Math.max(1.5, ls[3] * .22)); putGlow(ctx, ls[0] + ls[2] / 2, ls[1] + ls[3], ls[2] * 1.3, .8 * lampOn, '#ffb35c', '#fff1d6'); }
  }
  // the room goes dark when the lamp clicks off (the morning light is behind the building: the office stays dim)
  ctx.fillStyle = rgba('#0a0710', .45 * (1 - lampOn)); ctx.fillRect(r[0], r[1], r[2], r[3]);
  // glass: a faint sky reflection on top
  const gg = ctx.createLinearGradient(r[0], r[1], r[0] + r[2], r[1] + r[3]); gg.addColorStop(0, rgba('#e8c0b8', .16)); gg.addColorStop(.5, rgba('#e8c0b8', .03)); gg.addColorStop(1, rgba('#e8c0b8', .1)); ctx.fillStyle = gg; ctx.fillRect(r[0], r[1], r[2], r[3]);
  ctx.restore();
  // mullion cross over the big window
  ctx.fillStyle = '#4a3f5e'; const m = rect3(cam, (o.x0 + o.x1) / 2 - .03, o.y0, CITY.opp, .06, o.y1 - o.y0); if (m) ctx.fillRect(m[0], m[1], m[2], m[3]);
}
function drawOpposite(ctx, t, cam, S) {
  const z = CITY.opp; if (z <= cam.z + .1) return;
  const B = CITY.shop, Tw = CITY.tower;
  // the tower first (it is taller; the shop building stands left of the side street)
  bb(ctx, cam, towerTex(), Tw.x0, Tw.top - 3, z, Tw.x1 - Tw.x0, CITY.street - Tw.top + 3);
  officeInterior(ctx, t, cam, S.office || {});
  bb(ctx, cam, shopBldgTex(), B.x0, B.ridge - .4, z, B.x1 - B.x0, CITY.street - B.ridge + .4);
  shopWindow(ctx, t, cam, S);
  awning(ctx, t, cam, S);
  fruitStand(ctx, t, cam, S);
}
// the display window from outside: warm interior light (the shop is open), the interior when the camera is close (S.shopIn)
function shopWindow(ctx, t, cam, S) {
  const w = CITY.win, r = rect3(cam, w.x0, w.y0, CITY.opp, w.x1 - w.x0, w.y1 - w.y0); if (!r) return;
  ctx.save(); ctx.beginPath(); ctx.rect(r[0], r[1], r[2], r[3]); ctx.clip();
  if (S.shopInterior) S.shopInterior(ctx, t, cam, r);
  else { const g = ctx.createLinearGradient(0, r[1], 0, r[1] + r[3]); g.addColorStop(0, '#f6c98e'); g.addColorStop(.6, '#d99a62'); g.addColorStop(1, '#7a4a3a'); ctx.fillStyle = g; ctx.fillRect(r[0], r[1], r[2], r[3]);
    // shelves as soft dark bands
    ctx.fillStyle = rgba('#3a2420', .35); for (let k = 1; k < 4; k++) ctx.fillRect(r[0], r[1] + r[3] * k * .22, r[2], Math.max(1, r[3] * .03)); }
  // the glass: reflection of the bright sky in the upper part
  const gg = ctx.createLinearGradient(0, r[1], 0, r[1] + r[3]); gg.addColorStop(0, rgba('#ffe9cf', .22)); gg.addColorStop(.35, rgba('#ffe9cf', .04)); gg.addColorStop(1, rgba('#ffe9cf', 0)); ctx.fillStyle = gg; ctx.fillRect(r[0], r[1], r[2], r[3]);
  ctx.restore();
  // window bars (three panes)
  ctx.fillStyle = '#28443d'; for (const u of [1 / 3, 2 / 3]) { const m = rect3(cam, mix(w.x0, w.x1, u) - .04, w.y0, CITY.opp, .08, w.y1 - w.y0); if (m) ctx.fillRect(m[0], m[1], m[2], m[3]); }
  // the light spilling onto the pavement in front
  const p0 = cam.P((w.x0 + w.x1) / 2, CITY.street, CITY.opp - .8); if (p0) putGlow(ctx, p0[0], p0[1], 2.2 * p0[2], .25, '#ffb35c', '#ffe2b8');
}
// a striped canvas awning over the shop front, sloping out over the pavement (a real 3D quad)
function awning(ctx, t, cam, S) {
  const w = CITY.win, d = CITY.door, x0 = w.x0 - .3, x1 = d.x1 + .2, yb = 2.35, yo = 3.05, zb = CITY.opp - .02, zo = CITY.opp - 1.35;
  const N = 14, flutter = .03 * Math.sin(t * 2.1);
  for (let i = 0; i < N; i++) {
    const a = mix(x0, x1, i / N), b = mix(x0, x1, (i + 1) / N), col = i % 2 ? '#efe2c8' : '#b8505a';
    poly3(ctx, cam, [[a, yb, zb], [b, yb, zb], [b, yo + flutter, zo], [a, yo + flutter, zo]], col);
  }
  // shade under the awning (we see it from above in the room; from below at the shop)
  const sh = poly3(ctx, cam, [[x0, yb, zb], [x1, yb, zb], [x1, yo + flutter, zo], [x0, yo + flutter, zo]]);
  if (sh) { ctx.fillStyle = rgba('#3a1a24', cam.y > yo ? .45 : .18); ctx.fill(); }
  // scalloped valance
  for (let i = 0; i < N * 2; i++) {
    const a = mix(x0, x1, i / (N * 2)), b = mix(x0, x1, (i + 1) / (N * 2)), m = (a + b) / 2, P = cam.P(a, yo + flutter, zo), Q = cam.P(b, yo + flutter, zo), M = cam.P(m, yo + flutter + .22, zo);
    if (!P || !Q || !M) continue; ctx.fillStyle = Math.floor(i / 2) % 2 ? '#e2d4b8' : '#a8434e'; ctx.beginPath(); ctx.moveTo(P[0], P[1]); ctx.quadraticCurveTo(M[0], M[1] + (M[1] - P[1]) * .3, Q[0], Q[1]); ctx.closePath(); ctx.fill();
  }
}
// wicker baskets of fruit on a tiered stand in front of the window (a cached picture, standing on the pavement)
function fruitTex() {
  return once('c5:fruit', () => {
    const ppm = 260, w = 3.4, h = 1.25, [c, g] = canvas(Math.ceil(w * ppm), Math.ceil(h * ppm)), r = prng(31);
    // the stand: two wooden tiers on trestle legs
    g.fillStyle = '#4a3226'; g.fillRect(.15 * ppm, .62 * ppm, (w - .3) * ppm, .06 * ppm); g.fillRect(.25 * ppm, .25 * ppm, (w - .5) * ppm, .05 * ppm);
    for (const lx of [.25, w - .32]) { g.fillRect(lx * ppm, .25 * ppm, .07 * ppm, (h - .25) * ppm); }
    g.fillStyle = rgba('#000', .25); g.fillRect(.15 * ppm, .68 * ppm, (w - .3) * ppm, .02 * ppm);
    const fruits = [['#d64a3a', '#8e2a22', .085], ['#f0a03a', '#b5651d', .085], ['#ecd25a', '#b49a2a', .075], ['#8fb04a', '#5a7428', .08], ['#c84a5a', '#7a2434', .08], ['#f2b24a', '#b8761d', .09]];
    const basket = (bx, by, bw, bh, f) => {
      // wicker: a woven bowl, slats + weave rows
      g.save(); g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + bw, by); g.quadraticCurveTo(bx + bw * .96, by + bh, bx + bw * .5, by + bh); g.quadraticCurveTo(bx + bw * .04, by + bh, bx, by); g.closePath();
      g.fillStyle = '#a9773e'; g.fill(); g.clip();
      for (let yy = by; yy < by + bh; yy += 6) { g.strokeStyle = (Math.floor((yy - by) / 6) % 2) ? '#c8954f' : '#8a5e2c'; g.lineWidth = 3.4; g.beginPath(); for (let xx = bx; xx < bx + bw; xx += 10) { g.moveTo(xx, yy); g.quadraticCurveTo(xx + 5, yy + 3, xx + 10, yy); } g.stroke(); }
      g.strokeStyle = rgba('#5a3a18', .6); g.lineWidth = 2; for (let xx = bx + 8; xx < bx + bw; xx += 13) { g.beginPath(); g.moveTo(xx, by); g.lineTo(xx + (xx - bx - bw / 2) * .08, by + bh); g.stroke(); }
      g.restore();
      g.fillStyle = '#7a5228'; g.beginPath(); g.ellipse(bx + bw / 2, by, bw / 2, 7, 0, 0, TAU); g.fill();
      // the fruit heap
      const [c0, c1, fr] = f, R = fr * ppm;
      for (let k = 0; k < 22; k++) {
        const a = r(), fx = bx + bw * (.1 + .8 * r()), fy = by - R * .3 - Math.sin(Math.PI * (fx - bx) / bw) * bh * .5 * r();
        const gr = g.createRadialGradient(fx - R * .35, fy - R * .4, R * .1, fx, fy, R); gr.addColorStop(0, shade(c0, .12)); gr.addColorStop(.6, c0); gr.addColorStop(1, c1);
        g.fillStyle = gr; g.beginPath(); g.arc(fx, fy, R * (.9 + a * .2), 0, TAU); g.fill();
        g.fillStyle = rgba('#fff', .35); g.beginPath(); g.arc(fx - R * .35, fy - R * .35, R * .18, 0, TAU); g.fill();
      }
    };
    for (let i = 0; i < 4; i++) basket((.25 + i * .78) * ppm, .44 * ppm, .66 * ppm, .2 * ppm, fruits[i]);
    for (let i = 0; i < 3; i++) basket((.6 + i * .8) * ppm, .08 * ppm, .62 * ppm, .18 * ppm, fruits[3 + (i % 3)]);
    // a little slate price board with chalk squiggles (no readable text)
    g.fillStyle = '#26262c'; g.fillRect(2.95 * ppm, .74 * ppm, .32 * ppm, .24 * ppm); g.strokeStyle = rgba('#efe9dc', .8); g.lineWidth = 2.2;
    for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(2.99 * ppm, (.8 + k * .06) * ppm); for (let q = 0; q < 6; q++) g.lineTo((3.0 + q * .04) * ppm, (.8 + k * .06) * ppm + (q % 2 ? -4 : 3)); g.stroke(); }
    return c;
  });
}
function fruitStand(ctx, t, cam, S) { bb(ctx, cam, fruitTex(), CITY.win.x0 + .2, CITY.street - 1.25, CITY.opp - .55, 3.4, 1.25); }

// ---------------------------------------------------------------- the street below your window (cobbles, the kerbs)
function drawStreet(ctx, t, cam, S) {
  const y = CITY.street; if (cam.y >= y) return;
  const p = poly3(ctx, cam, [[-30, y, .4], [30, y, .4], [30, y, CITY.opp], [-30, y, CITY.opp]]); if (!p) return;
  const g = ctx.createLinearGradient(0, Math.min(...p.map((q) => q[1])), 0, Math.max(...p.map((q) => q[1]))); g.addColorStop(0, '#5a4660'); g.addColorStop(1, '#3a2c44'); ctx.fillStyle = g; ctx.fill();
  // cobble courses
  ctx.save(); ctx.clip(); ctx.strokeStyle = rgba('#1e1626', .35); ctx.lineWidth = 1;
  for (let z = 1.6; z < CITY.opp - 1.2; z += .22) { const s = seg3(cam, [-30, y, z], [30, y, z]); if (s) { ctx.beginPath(); ctx.moveTo(s[0][0], s[0][1]); ctx.lineTo(s[1][0], s[1][1]); ctx.stroke(); } }
  ctx.restore();
  // kerbs / pavements
  poly3(ctx, cam, [[-30, y - .15, CITY.opp - 1.3], [30, y - .15, CITY.opp - 1.3], [30, y - .15, CITY.opp], [-30, y - .15, CITY.opp]], '#4e4058');
}

// ---------------------------------------------------------------- everything outside, far → near
export function drawOutside(ctx, t, cam, S) {
  drawSky(ctx, cam, S.tod);
  if (S.plate >= .9999) { plate(ctx, t, 'light', { tone: 'dawn' }); return; }
  drawSun(ctx, t, cam, S);
  drawFar(ctx, t, cam, S);
  drawRows(ctx, t, cam, S);
  drawStreet(ctx, t, cam, S);
  drawOpposite(ctx, t, cam, S);
}
export { drawRows, drawFar, drawOpposite, drawStreet, ROWS };
