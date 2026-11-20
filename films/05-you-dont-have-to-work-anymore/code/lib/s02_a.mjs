// s02_a.mjs · chapter 02, shots 2.01–2.04 (harbour morning, bedroom, checkout, the knot)
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, vnoise, fbm, stipple, roughPath, roughPoly, PAL, L, put, cached, sprite, fogL, coneL, poolL, bloomL, glowLive, vgrad, drawLayer, layerXf, figSprite, drawFig, ell, lin, sm, eout, ein, eio, eoutq, drift, back , figure } from './s02_kit.mjs';
import { hatch, strokes, roughLine, roughRect, sagLine, person, castShadow, quadMap, quadIn, stratus, limb, qpts, printFinish } from './art.mjs';
import { text } from '../engine.mjs';

// ============================================================ 2.01 harbour street, morning
// Houses along the quay recede to a vanishing point right; morning sun upper right rakes their fronts gold.
// Live: shutters stagger open on "everything", a woman shakes a rug (dust = carrier), a cat stretches, boats bob,
// gulls, the gold stripe on the water shimmers. Camera: tilts up from the stripe on the water to the street.
const S1 = { LW: 2160, LH: 1640 };
const VP = [2120, 700];
const rowPt = (t, P0) => [VP[0] + (P0[0] - VP[0]) * t, VP[1] + (P0[1] - VP[1]) * t];
const BASE0 = [-420, 1110], QEDGE0 = [-420, 1260];
const HOUSES = (() => {
  const r = prng(201), out = []; let t = 1.08;
  const walls = ['#d98e86', '#e9a77a', '#d9a35a', '#e6cfa4', '#c46a4e', '#9fb0b8', '#e2b48e', '#cf7f6c', '#e8c48a', '#b58a9c'];
  for (let i = 0; i < 9; i++) {
    const w = .26 + r() * .1, tb = t - w * t * 1.0; const h = 900 + r() * 330;
    out.push({ i, ta: t, tb: Math.max(.04, tb), h, wall: walls[i % walls.length], floors: 3 + Math.floor(r() * 2), cols: 2 + Math.floor(r() * 2), roof: r() < .4 ? 'gable' : 'flat', seed: 300 + i, bal: r() < .5 });
    t = Math.max(.04, tb) - .004;
  }
  return out;
})();
function houseQuad(hs) {
  const A = rowPt(hs.ta, BASE0), B = rowPt(hs.tb, BASE0);
  const topA = [A[0], A[1] - hs.h * hs.ta], topB = [B[0], B[1] - hs.h * hs.tb];
  return [topB, topA, A, B];   // u = 0 far, u = 1 near
}
// window layout per house in facade space (u: 0 far .. 1 near, v: 0 top .. 1 bottom)
function windows(hs) {
  const out = []; const r = prng(hs.seed);
  for (let f = 0; f < hs.floors; f++) for (let c = 0; c < hs.cols; c++) {
    const u0 = (c + .5) / hs.cols - .2 / hs.cols, u1 = (c + .5) / hs.cols + .2 / hs.cols;
    const v0 = .13 + f * (.64 / hs.floors), v1 = v0 + .64 / hs.floors * .72;
    out.push({ f, c, u0, u1, v0, v1, ground: false, k: r() });
  }
  return out;
}
export function buildS1() {
  const { LW, LH } = S1;
  // ---------- sky layer
  const [sk, sx] = L(LW, LH);
  sx.fillStyle = vgrad(sx, 0, 0, 0, 900, [[0, '#5e5a8e'], [.35, '#9a7ea6'], [.62, '#e3a39a'], [.82, '#f7c48e'], [1, '#ffe0a6']]); sx.fillRect(0, 0, LW, LH);
  { const [c, g] = L(LW, LH); const rg = g.createRadialGradient(1900, 470, 0, 1900, 470, 1100); rg.addColorStop(0, rgba(PAL.cream, .95)); rg.addColorStop(.1, rgba(PAL.gold, .7)); rg.addColorStop(.4, rgba(PAL.coral, .25)); rg.addColorStop(1, rgba(PAL.coral, 0)); g.fillStyle = rg; g.fillRect(0, 0, LW, LH); stipple(c, { k: .18, g: 1.1, seed: 3 }); put(sx, c, 'screen'); }
  { const [hc, hx] = L(LW, LH); hx.save(); hx.beginPath();
    for (const [y, x0, x1, th] of [[260, 700, 2300, 26], [330, 1100, 2000, 14], [180, -200, 900, 20], [400, 1300, 2300, 18], [120, 600, 1500, 12]]) stratus(hx, y, x0, x1, th, y);
    hx.fillStyle = rgba('#f1a68a', .5); hx.fill(); hx.clip(); hatch(hx, [0, 60, LW, 400], { angle: -0.02, gap: 4, w: 1.1, col: '#ffe0b4', a: .55, seed: 5, broken: .3 }); hx.restore(); put(sx, hc); }
  // far headland + sea horizon right
  sx.fillStyle = '#c99a8e'; sx.beginPath(); roughPath(sx, [[900, 652], [1200, 628], [1420, 640], [1600, 618], [1800, 636], [2200, 640], [2200, 700], [900, 700]], { amp: 1.4, seed: 4 }); sx.fill();
  { const r = prng(8); for (let i = 0; i < 26; i++) { const x = 1450 + r() * 300, y = 630 + r() * 8; sx.fillStyle = rgba('#b07c7c', .9); sx.fillRect(x, y - 6 - r() * 6, 5 + r() * 6, 8 + r() * 6); } }
  sx.fillStyle = vgrad(sx, 0, 645, 0, 760, [[0, '#f3c08e'], [1, '#c98a7e']]); sx.fillRect(0, 648, LW, 140);
  bloomL(sx, 1900, 470, 260, { col: PAL.gold, core: PAL.cream, a: .7, k: .3, seed: 6 });
  sx.fillStyle = PAL.cream; sx.beginPath(); roughPath(sx, ell(1900, 470, 58, 58, 40), { amp: .8, seed: 2 }); sx.fill();
  fogL(sx, { y0: 560, y1: 720, col: '#ffd2a2', a: .55, seed: 11, cover: .7, soft: .45, k: .3, sx: .003, sy: .03 });

  // ---------- houses + quay layer (p .75)
  const [hc, hx] = L(LW, LH);
  // quay surface (from house base line down to quay edge) and quay wall below it
  const qa = rowPt(1.3, BASE0), qb = rowPt(.02, BASE0), ea = rowPt(1.3, QEDGE0), eb = rowPt(.02, QEDGE0);
  roughPoly(hx, [qb, qa, ea, eb], '#b98a72', { amp: 1, seed: 12 });
  { hx.save(); hx.beginPath(); roughPath(hx, [qb, qa, ea, eb], { amp: 1, seed: 12 }); hx.clip();
    hx.fillStyle = vgrad(hx, 0, 700, 0, 1200, [[0, rgba('#ffd9a0', .4)], [1, rgba('#3a2440', .35)]]); hx.fillRect(0, 0, LW, LH);
    // cobbles: converging lines + broken cross lines
    hx.strokeStyle = rgba('#5a3a3a', .22); hx.lineWidth = 1;
    for (let k = 0; k < 40; k++) { const t = .03 + Math.pow(k / 40, 1.4) * 1.3, a = rowPt(t, BASE0), b = rowPt(t, QEDGE0); hx.beginPath(); hx.moveTo(a[0], a[1]); hx.lineTo(b[0], b[1]); hx.stroke(); }
    for (let k = 1; k < 6; k++) { hx.beginPath(); for (let t = .02; t < 1.3; t += .01) { const a = rowPt(t, BASE0), b = rowPt(t, QEDGE0), p = [mix(a[0], b[0], k / 6), mix(a[1], b[1], k / 6)]; t === .02 ? hx.moveTo(...p) : hx.lineTo(...p); } hx.stroke(); }
    hx.restore(); }
  roughPoly(hx, [eb, ea, [ea[0], LH + 20], [eb[0], LH + 20]], '#5b3a48', { amp: 1, seed: 13 });
  { hx.save(); hx.beginPath(); roughPath(hx, [eb, ea, [ea[0], LH + 20], [eb[0], LH + 20]], { amp: 1, seed: 13 }); hx.clip();
    hatch(hx, [-300, 700, LW + 400, 800], { angle: .2, gap: 6, col: '#2a1828', a: .35, seed: 14, broken: .3 });
    // stone courses following the edge
    hx.strokeStyle = rgba('#2a1828', .4); for (let k = 1; k < 8; k++) { hx.beginPath(); const e0 = [eb[0], eb[1] + k * 22 * .2], e1 = [ea[0], ea[1] + k * 22 * 1.3]; hx.moveTo(...e0); hx.lineTo(...e1); hx.stroke(); }
    hx.restore(); }
  hx.strokeStyle = rgba('#ffe2b0', .55); hx.lineWidth = 2; hx.beginPath(); hx.moveTo(...eb); hx.lineTo(...ea); hx.stroke();
  const quads = [];
  for (let hi = HOUSES.length - 1; hi >= 0; hi--) {
    const hs = HOUSES[hi], q = houseQuad(hs), m = quadMap(q), wall = mixHex(hs.wall, '#5a3050', .22 + .32 * clamp(1 - hs.i / 5));
    // roof: a gable/flat band leaning to the VP
    const [tf, tn] = [q[0], q[1]];
    if (hs.roof === 'gable') { const mid = m(.5, 0), rh = 90 * hs.ta; roughPoly(hx, [tf, [mid[0], mid[1] - rh], tn], shade(wall, -.22), { amp: 1, seed: hs.seed }); }
    else { roughPoly(hx, [[tf[0], tf[1] - 16 * hs.tb], [tn[0], tn[1] - 18 * hs.ta], tn, tf], shade(wall, -.12), { amp: .8, seed: hs.seed }); }
    // chimney pots
    { const r = prng(hs.seed + 9); for (let k = 0; k < 2; k++) { const p = m(.2 + r() * .6, 0), cw = 22 * hs.ta, ch = 40 * hs.ta + r() * 30 * hs.ta; roughRect(hx, p[0] - cw / 2, p[1] - ch - 10 * hs.ta, cw, ch, shade(wall, -.3), { amp: .6, seed: k + hs.seed }); } }
    roughPoly(hx, q, wall, { amp: 1.4, seed: hs.seed });
    hx.save(); hx.beginPath(); roughPath(hx, q, { amp: 1.4, seed: hs.seed }); hx.clip();
    // sun wash from the upper right, shade toward the far side / bottom
    hx.fillStyle = vgrad(hx, q[0][0], 0, q[1][0], 0, [[0, rgba('#ffd59a', .5)], [.35, rgba('#ffd59a', .14)], [1, rgba('#2a1836', .22)]]); hx.fillRect(0, 0, LW, LH);
    hx.fillStyle = vgrad(hx, 0, q[1][1], 0, q[2][1], [[0, rgba('#ffd59a', .12)], [.5, rgba('#3a2440', .0)], [1, rgba('#2a1836', .38)]]); hx.fillRect(0, 0, LW, LH);
    // the sun-side edge of each house catches a gold sliver (back light)
    roughPoly(hx, quadIn(m, 0, 0, .025, 1), rgba('#ffe2a8', .7), { amp: .3, seed: hs.seed + 11 });
    // plaster texture: sparse broken hatching in the lower part
    hatch(hx, [Math.min(q[0][0], q[3][0]) - 20, q[1][1], Math.abs(q[2][0] - q[3][0]) + 40, q[2][1] - q[1][1]], { angle: -.9, gap: 9, w: 1, col: shade(wall, -.3), a: .14, seed: hs.seed, broken: .55 });
    // cornice + floor bands
    roughPoly(hx, quadIn(m, -.02, .02, 1.02, .05), shade(wall, .1), { amp: .4, seed: hs.seed + 1 });
    roughPoly(hx, quadIn(m, -.02, .05, 1.02, .062), rgba('#3a2440', .3), { amp: .3, seed: hs.seed + 2 });
    roughPoly(hx, quadIn(m, -.02, .8, 1.02, .812), shade(wall, .08), { amp: .3, seed: hs.seed + 3 });
    // windows (glass, frames, sills) – shutters are live
    const ws = windows(hs);
    for (const w of ws) {
      roughPoly(hx, quadIn(m, w.u0 - .012, w.v0 - .012, w.u1 + .012, w.v1 + .01), shade(wall, .12), { amp: .2, seed: hs.seed + w.f * 7 + w.c });
      roughPoly(hx, [m(w.u1 + .012, w.v0 - .012), m(w.u1 + .07, w.v0 + .02), m(w.u1 + .07, w.v1 + .04), m(w.u1 + .012, w.v1 + .01)], rgba('#2a1836', .28), { amp: .3, seed: w.c + 40 });
      const glass = quadIn(m, w.u0, w.v0, w.u1, w.v1);
      roughPoly(hx, glass, '#3b2a44', { amp: .2, seed: w.f + w.c });
      // sky reflection in the upper half of the pane
      hx.save(); hx.beginPath(); roughPath(hx, glass, { amp: .2, seed: w.f + w.c }); hx.clip(); hx.fillStyle = vgrad(hx, 0, glass[0][1], 0, glass[3][1], [[0, rgba('#f7c9a0', .55)], [.5, rgba('#c98a8a', .2)], [1, rgba('#2a1d36', 0)]]); hx.fillRect(0, 0, LW, LH); hx.restore();
      const a = m((w.u0 + w.u1) / 2, w.v0), b = m((w.u0 + w.u1) / 2, w.v1); hx.strokeStyle = rgba('#2a1d36', .8); hx.lineWidth = 1.6 * hs.ta; hx.beginPath(); hx.moveTo(...a); hx.lineTo(...b); hx.stroke();
      roughPoly(hx, quadIn(m, w.u0 - .02, w.v1 + .004, w.u1 + .02, w.v1 + .02), shade(wall, .16), { amp: .2, seed: w.c });
      if (hs.bal && w.f === 1) { // a little iron balcony
        const p0 = m(w.u0 - .05, w.v1 + .02), p1 = m(w.u1 + .05, w.v1 + .02), bh = 40 * hs.ta;
        hx.strokeStyle = rgba('#2a1d2e', .85); hx.lineWidth = 1.4 * hs.ta; hx.beginPath(); hx.moveTo(p0[0], p0[1] - bh); hx.lineTo(p1[0], p1[1] - bh); hx.stroke();
        for (let k = 0; k <= 8; k++) { const x = mix(p0[0], p1[0], k / 8), y = mix(p0[1], p1[1], k / 8); hx.beginPath(); hx.moveTo(x, y); hx.lineTo(x, y - bh); hx.stroke(); }
        roughPoly(hx, [p0, p1, [p1[0], p1[1] + 5 * hs.ta], [p0[0], p0[1] + 5 * hs.ta]], '#2a1d2e', { amp: .2, seed: 3 });
        // flower pots
        for (let k = 0; k < 3; k++) { const x = mix(p0[0], p1[0], .2 + k * .3), y = mix(p0[1], p1[1], .2 + k * .3); hx.fillStyle = '#a5523a'; hx.fillRect(x - 6 * hs.ta, y - 14 * hs.ta, 12 * hs.ta, 12 * hs.ta); hx.fillStyle = ['#e85a6a', '#ffb35c', '#f3efe2'][k]; hx.beginPath(); hx.arc(x, y - 20 * hs.ta, 7 * hs.ta, 0, 7); hx.fill(); hx.fillStyle = '#4f7a4a'; hx.beginPath(); hx.arc(x - 6 * hs.ta, y - 16 * hs.ta, 5 * hs.ta, 0, 7); hx.fill(); }
      }
    }
    // ground floor: a door + a shop window with an awning on some
    { const du0 = .14, du1 = .3, door = quadIn(m, du0, .84, du1, 1); roughPoly(hx, door, shade(wall, -.45), { amp: .3, seed: hs.seed + 5 });
      const sw = quadIn(m, .45, .84, .85, .97); roughPoly(hx, sw, '#3b2a44', { amp: .3, seed: hs.seed + 6 });
      hx.save(); hx.beginPath(); roughPath(hx, sw, { amp: .3 }); hx.clip(); hx.fillStyle = rgba('#ffb35c', .25); hx.fillRect(0, 0, LW, LH); hx.restore();
      if (hs.i % 2 === 0) { const a1 = m(.42, .82), a2 = m(.88, .82); const dd = 50 * hs.ta; const aw = [a1, a2, [a2[0] - 10 * hs.ta, a2[1] + dd], [a1[0] - 10 * hs.ta, a1[1] + dd]];
        roughPoly(hx, aw, ['#c4482a', '#e8a3a0', '#2f5560'][hs.i % 3], { amp: .4, seed: hs.seed + 8 });
        hx.save(); hx.beginPath(); roughPath(hx, aw, { amp: .4, seed: hs.seed + 8 }); hx.clip(); const mm = quadMap(aw); for (let k = 0; k < 10; k += 2) roughPoly(hx, quadIn(mm, k / 10, 0, (k + 1) / 10, 1), rgba('#fff1cf', .8), { amp: .2, seed: k }); hx.restore(); } }
    hx.fillStyle = rgba('#ffd7a8', .38 * clamp((hs.i - 1.5) / 6)); hx.fillRect(0, 0, LW, LH);
    hx.restore();
    // shadow cast by this house onto the quay (sun upper right -> shadow falls left/forward)
    hx.save(); hx.globalAlpha = .18; hx.fillStyle = '#3a2440'; hx.beginPath(); const b0 = q[3], b1 = q[2]; hx.moveTo(...b0); hx.lineTo(...b1); hx.lineTo(b1[0] - 40 * hs.ta, b1[1] + 70 * hs.ta); hx.lineTo(b0[0] - 40 * hs.tb, b0[1] + 70 * hs.tb); hx.closePath(); hx.fill(); hx.restore();
    quads.push({ hs, q, ws: windows(hs) });
  }
  // bollards + a lamp post on the quay
  for (const t of [1.0, .7, .48, .32, .2]) { const a = rowPt(t, QEDGE0), b = [a[0] + 30 * t, a[1] - 30 * t]; roughRect(hx, b[0] - 9 * t, b[1] - 44 * t, 18 * t, 44 * t, '#2a1d2e', { amp: .5, seed: t * 10 }); hx.fillStyle = rgba('#ffe2b0', .5); hx.fillRect(b[0] + 3 * t, b[1] - 44 * t, 4 * t, 40 * t); }
  { const [c, g] = L(LW, LH); const rg = g.createRadialGradient(2050, 420, 0, 2050, 420, 1500); rg.addColorStop(0, rgba('#ffe2a8', .75)); rg.addColorStop(.35, rgba('#ffc477', .3)); rg.addColorStop(1, rgba('#ffc477', 0)); g.fillStyle = rg; g.fillRect(0, 0, LW, LH);
    g.globalCompositeOperation = 'destination-in'; g.drawImage(hc, 0, 0); stipple(c, { k: .35, g: 1.2, seed: 23 }); put(hx, c, 'screen'); }
  fogL(hx, { y0: 480, y1: 860, col: '#ffd7a8', a: .45, seed: 21, cover: .6, soft: .5, k: .25, sx: .004, sy: .03 });

  // ---------- water layer (p 1.0) + reflection
  const [wc, wx] = L(LW, LH);
  const WT = 1200;   // water top in this layer (just under the quay edge at the left)
  wx.fillStyle = vgrad(wx, 0, WT - 120, 0, LH, [[0, '#c98a7e'], [.2, '#8a5068'], [.5, '#3e2646'], [1, '#160d1e']]);
  wx.beginPath(); wx.moveTo(-50, WT + 60); for (let x = -50; x <= LW + 50; x += 30) { const t = (x - VP[0]) / (QEDGE0[0] - VP[0]), y = VP[1] + (QEDGE0[1] - VP[1]) * t + 2; wx.lineTo(x, y); } wx.lineTo(LW + 50, LH + 20); wx.lineTo(-50, LH + 20); wx.closePath(); wx.fill();
  // reflection of the houses (mirror about the quay edge line), squashed + darkened + broken by ripples
  { const slope = (QEDGE0[1] - VP[1]) / (QEDGE0[0] - VP[0]), a0 = VP[1] - slope * VP[0];
    const [rc, rx] = L(LW, LH); rx.setTransform(1, 2 * slope, 0, -1, 0, 2 * a0 + 6); rx.drawImage(hc, 0, 0); rx.setTransform(1, 0, 0, 1, 0, 0);
    { const [sc, sxx] = L(LW, LH); sxx.filter = 'blur(5px)'; sxx.drawImage(rc, 0, 0); rx.clearRect(0, 0, LW, LH); rx.drawImage(sc, 0, 0); }
    rx.globalCompositeOperation = 'source-atop'; rx.fillStyle = rgba('#3a2440', .35); rx.fillRect(0, 0, LW, LH);
    // ripple cut: erase thin horizontal slivers
    rx.globalCompositeOperation = 'destination-out'; const r = prng(31); for (let i = 0; i < 2600; i++) { const y = 1150 + Math.pow(r(), .8) * 480, x = r() * LW; rx.fillStyle = rgba('#000', .5 + r() * .5); rx.fillRect(x, y, 30 + r() * 140, 1 + r() * 2.5); }
    rx.globalCompositeOperation = 'destination-in'; rx.fillStyle = vgrad(rx, 0, 1150, 0, LH, [[0, 'rgba(0,0,0,.26)'], [.35, 'rgba(0,0,0,.08)'], [1, 'rgba(0,0,0,0)']]); rx.fillRect(0, 0, LW, LH);
    wx.save(); wx.beginPath(); wx.moveTo(-50, WT + 60); for (let x = -50; x <= LW + 50; x += 30) { const t = (x - VP[0]) / (QEDGE0[0] - VP[0]), y = VP[1] + (QEDGE0[1] - VP[1]) * t + 2; wx.lineTo(x, y); } wx.lineTo(LW + 50, LH + 20); wx.lineTo(-50, LH + 20); wx.closePath(); wx.clip(); wx.drawImage(rc, 0, 0); wx.restore(); }
  // the gold stripe band (static base, live glitter on top)
  { const [gc, gx] = L(LW, LH); gx.fillStyle = vgrad(gx, 0, 1270, 0, 1420, [[0, rgba(PAL.gold, 0)], [.45, rgba(PAL.goldHot, .6)], [.55, rgba(PAL.goldHot, .65)], [1, rgba(PAL.gold, 0)]]); gx.fillRect(0, 1270, LW, 150);
    gx.globalCompositeOperation = 'destination-in'; gx.fillStyle = vgrad(gx, 0, 0, LW, 0, [[0, 'rgba(0,0,0,.25)'], [.4, 'rgba(0,0,0,1)'], [1, 'rgba(0,0,0,.7)']]); gx.fillRect(0, 0, LW, LH);
    stipple(gc, { k: .6, g: 1.1, seed: 33 }); put(wx, gc, 'lighter'); }
  // ripple lines (hatched water)
  { const r = prng(41); wx.lineCap = 'round'; for (let i = 0; i < 700; i++) { const y = 1230 + Math.pow(r(), .9) * 410, x = r() * LW, l = 10 + r() * 70 * (y - 1150) / 300; wx.strokeStyle = r() < .5 ? rgba('#ffd9a8', .18 + r() * .2) : rgba('#2a1c36', .25); wx.lineWidth = .8 + (y - 1150) / 300; wx.beginPath(); wx.moveTo(x, y); wx.lineTo(x + l, y + (r() - .5)); wx.stroke(); } }

  // ---------- foreground (p 1.35): mooring post + coiled rope at lower left, a boat bow lower right
  const [fc, fx] = L(LW, LH);
  roughPoly(fx, [[60, 1640], [70, 1300], [96, 1286], [150, 1290], [170, 1306], [176, 1640]], '#2a1828', { amp: 2, seed: 50 });
  fx.fillStyle = rgba('#ffd9a0', .55); fx.beginPath(); roughPath(fx, [[150, 1292], [170, 1306], [176, 1640], [160, 1640], [156, 1310]], { amp: 1, seed: 51 }); fx.fill();
  hatch(fx, [60, 1290, 90, 350], { angle: .1, gap: 5, col: '#120a14', a: .5, seed: 52 });
  for (let k = 0; k < 5; k++) { fx.strokeStyle = k % 2 ? '#c9a46a' : '#a8844e'; fx.lineWidth = 9; fx.beginPath(); fx.ellipse(118, 1350 + k * 12, 64, 16, 0, 0, 7); fx.stroke(); }
  // a moored sailboat's mast + rigging in silhouette at the right edge (dark frame, strong parallax)
  fx.save(); fx.translate(-230, 0);
  roughLine(fx, [[1990, 1640], [1960, -40]], { w: 16, col: '#1a0f1e', seed: 61 });
  fx.fillStyle = rgba('#ffe2a8', .5); fx.fillRect(1979, -40, 3, 1680);
  for (const [a2, b2, sg] of [[[1966, 120], [2200, 900], 20], [[1966, 160], [1500, 1640], 30], [[1970, 520], [2200, 700], 6]]) roughLine(fx, sagLine(a2, b2, sg), { w: 2.2, col: '#1a0f1e', seed: 62 });
  roughLine(fx, [[1975, 760], [1640, 840]], { w: 12, col: '#1a0f1e', seed: 63 });
  roughPoly(fx, [[1600, 1640], [1660, 1480], [2200, 1440], [2200, 1640]], '#1a0f1e', { amp: 3, seed: 64 });
  fx.strokeStyle = rgba('#ffd59a', .6); fx.lineWidth = 3; fx.beginPath(); fx.moveTo(1660, 1482); fx.lineTo(2200, 1442); fx.stroke();
  fx.restore();
  return { sky: sk, houses: hc, water: wc, fg: fc, quads };
}
// live elements -------------------------------------------------------------
function shutters(ctx, quads, t, tOpen) {
  for (const { hs, q, ws } of quads) {
    if (hs.i > 5) continue;
    const m = quadMap(q);
    for (const w of ws) {
      const delay = (hs.i * .06 + w.f * .05 + w.c * .03 + w.k * .05), u = eout(lin(tOpen - .18 + delay, tOpen + .55 + delay, t));
      const th = u * Math.PI * .92, half = (w.u1 - w.u0) / 2;
      for (const side of [0, 1]) {
        const hinge = side ? w.u1 : w.u0, dir = side ? -1 : 1, edge = hinge + dir * half * Math.cos(th) * (side ? 1 : 1);
        const ua = Math.min(hinge, edge), ub = Math.max(hinge, edge); if (ub - ua < .002) continue;
        const pts = quadIn(m, ua, w.v0 - .01, ub, w.v1 + .005);
        const facing = Math.cos(th), lit = side ? .55 + .45 * facing : .35 + .3 * Math.abs(facing);
        const col = mixHex(shade(['#3f7a6a', '#5d7fa0', '#7a4a3a', '#4f6a52'][hs.i % 4], -.15), ['#7fb8a0', '#9cc0d8', '#c98a6a', '#8fb08a'][hs.i % 4], lit);
        ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(...pts[0]); for (const p of pts.slice(1)) ctx.lineTo(...p); ctx.closePath(); ctx.fill();
        // louvres
        ctx.strokeStyle = rgba('#1a1222', .35); ctx.lineWidth = .9 * hs.ta; ctx.beginPath();
        for (let k = 1; k < 8; k++) { const v = mix(w.v0, w.v1, k / 8), a = m(ua, v), b = m(ub, v); ctx.moveTo(...a); ctx.lineTo(...b); } ctx.stroke();
      }
    }
  }
}
function cat(ctx, x, y, s, t, tS) {
  // a cat on the quay: sits, then a long front stretch (bum up) and back
  const u = sm(lin(tS, tS + .8, t)) * (1 - sm(lin(tS + 1.8, tS + 2.6, t))), br = Math.sin(t * 3) * .02;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#2a1828';
  const bodyA = mix(-.5, .28, u), len = mix(34, 52, u);
  ctx.save(); ctx.translate(0, -18); ctx.rotate(bodyA); ctx.beginPath(); ctx.ellipse(len / 2, 0, len / 2 + 4, 12 * (1 + br), 0, 0, 7); ctx.fill(); ctx.restore();
  // head
  const hx = Math.cos(bodyA) * (len + 2), hy = -18 + Math.sin(bodyA) * (len + 2) - mix(6, -2, u);
  ctx.beginPath(); ctx.ellipse(hx + 6, hy, 11, 9, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(hx + 1, hy - 6); ctx.lineTo(hx + 3, hy - 17); ctx.lineTo(hx + 8, hy - 8); ctx.fill(); ctx.beginPath(); ctx.moveTo(hx + 8, hy - 7); ctx.lineTo(hx + 13, hy - 16); ctx.lineTo(hx + 15, hy - 5); ctx.fill();
  // front legs reach forward on the stretch
  ctx.fillRect(hx - 6 + u * 14, hy + 4, 5, mix(18, 10, u) + 4); ctx.fillRect(hx - 12 + u * 10, hy + 4, 5, mix(18, 10, u) + 4);
  ctx.fillRect(-2, -10, 6, 10); ctx.fillRect(6, -10, 6, 10);
  // tail curls up
  ctx.strokeStyle = '#2a1828'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-2, -22); ctx.quadraticCurveTo(-24, -26 - u * 16 + Math.sin(t * 2) * 4, -18, -50 - u * 10); ctx.stroke();
  // sun rim along the back
  ctx.strokeStyle = rgba('#ffd9a0', .7); ctx.lineWidth = 1.6; ctx.save(); ctx.translate(0, -18); ctx.rotate(bodyA); ctx.beginPath(); ctx.ellipse(len / 2, 0, len / 2 + 4, 12, 0, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); ctx.restore();
  ctx.restore();
}
function rugWoman(ctx, m, t, R, quads) {
  // house 1, floor 1, window c=0: a woman leans out; a rose rug hangs from her hands and is shaken
  const { q, ws, hs } = quads.find((d) => d.hs.i === 1), mm = quadMap(q), w = ws.find((k) => k.f === 1 && k.c === 0);
  const sill = mm((w.u0 + w.u1) / 2, w.v1), top = mm((w.u0 + w.u1) / 2, w.v0), ww = Math.abs(mm(w.u1, w.v1)[0] - mm(w.u0, w.v1)[0]);
  const s = hs.ta * .95;
  // shake pulses
  let shake = 0; for (const tp of R.shakes) shake += Math.exp(-Math.pow((t - tp) / .12, 2)) * Math.sin((t - tp) * 30);
  const lean = .55 + .05 * Math.sin(t * 1.3);
  ctx.save();
  ctx.beginPath(); ctx.rect(sill[0] - 300, sill[1] - 260 * s, 600, 260 * s); ctx.clip();
  figure(ctx, sill[0] + ww * .05, sill[1] + 20 * s, s * .95, { lean, head: .3, sh: [1.6 + shake * .15, 1.5 + shake * .15], el: [.2, .25], hair: 'bun' },
    { dress: { coat: '#f3efe2', pants: '#3a2440', skin: '#e9c3a0', hair: '#3a2214' }, light: { x: sill[0] + 600, y: sill[1] - 400, col: '#ffe2a8', a: .5 }, rim: '#ffe2a8', rimW: 1.5 });
  ctx.restore();
  // the rug: hangs from the hands below the sill, waves with the shakes
  const hx = sill[0] + 46 * s, hy = sill[1] + 4 * s, rw = 80 * s, rh = 150 * s;
  const col = (yy, k) => { const ph = yy / rh; return Math.sin(ph * 4 - t * 9) * 4 * s * ph + shake * 26 * s * ph * ph + k; };
  ctx.save(); ctx.beginPath();
  const N = 14; for (let i = 0; i <= N; i++) { const yy = rh * i / N; ctx.lineTo(hx - rw / 2 + col(yy, 0) - shake * 6 * s * (i / N), hy + yy * (1 - Math.abs(shake) * .1)); }
  for (let i = N; i >= 0; i--) { const yy = rh * i / N; ctx.lineTo(hx + rw / 2 + col(yy, 0) - shake * 6 * s * (i / N), hy + yy * (1 - Math.abs(shake) * .1)); }
  ctx.closePath(); ctx.fillStyle = '#b8485a'; ctx.fill(); ctx.clip();
  ctx.strokeStyle = rgba('#f3c27a', .8); ctx.lineWidth = 3 * s; ctx.strokeRect(hx - rw / 2 + 6 * s + shake * 10 * s, hy + 8 * s, rw - 12 * s, rh - 16 * s);
  for (let k = 1; k < 5; k++) { ctx.strokeStyle = rgba(k % 2 ? '#2f5560' : '#f3c27a', .7); ctx.lineWidth = 2 * s; ctx.beginPath(); ctx.moveTo(hx - rw, hy + rh * k / 5); ctx.lineTo(hx + rw, hy + rh * k / 5 + shake * 10 * s); ctx.stroke(); }
  ctx.fillStyle = vgrad(ctx, hx - rw / 2, 0, hx + rw / 2, 0, [[0, rgba('#3a2440', .35)], [.6, rgba('#3a2440', 0)], [1, rgba('#ffe2a8', .3)]]); ctx.fillRect(hx - rw, hy, rw * 2, rh * 1.2);
  ctx.restore();
  return { x: hx, y: hy + rh * .7, s };
}
function dust(ctx, x, y, s, t, shakes, extra = 0) {
  // golden dust puffs released at each shake, drifting out and up into the light
  const r = prng(77);
  for (let i = 0; i < 160; i++) {
    const tp = shakes[i % shakes.length], age = t - tp - r() * .15; const vx = (r() - .2) * 120, vy = (r() - .7) * 70, sz = (1 + r() * 2.6) * s, ph = r() * 6;
    if (age < 0 || age > 3.5) continue;
    const k = 1 - Math.exp(-age * 1.4), px = x + vx * k * s * 1.6 + Math.sin(age * 2 + ph) * 6 * s, py = y + vy * k * s + age * -10 * s;
    const a = Math.min(1, age * 6) * (1 - age / 3.5) * (.35 + extra);
    ctx.fillStyle = rgba(r() < .5 ? '#ffe2a8' : '#ffc477', a); ctx.beginPath(); ctx.arc(px, py, sz, 0, 7); ctx.fill();
  }
}
function boats(ctx, t) {
  for (const [x, y, s, c, ph] of [[560, 1500, 1.25, '#2f5560', 0], [1260, 1330, .75, '#c4482a', 2]]) {
    const bob = Math.sin(t * 1.3 + ph) * 4 * s, rk = Math.sin(t * 1.1 + ph) * .03;
    ctx.save(); ctx.translate(x, y + bob); ctx.rotate(rk); ctx.scale(s, s);
    roughPoly(ctx, [[-120, -18], [130, -22], [100, 22], [-96, 22]], c, { amp: 1, seed: ph + 1 });
    ctx.fillStyle = rgba('#fff1cf', .85); ctx.fillRect(-116, -20, 244, 5);
    ctx.fillStyle = rgba('#1a1222', .35); ctx.fillRect(-96, 8, 196, 14);
    roughPoly(ctx, [[-30, -22], [40, -22], [34, -50], [-24, -50]], '#e6cfa4', { amp: .6, seed: ph + 2 });
    ctx.fillStyle = rgba('#3a2440', .4); ctx.fillRect(-24, -50, 12, 28);
    ctx.restore();
    // its reflection: a few broken dark strokes
    ctx.fillStyle = rgba('#1a1222', .25); for (let k = 0; k < 5; k++) ctx.fillRect(x - 100 * s + Math.sin(t * 2 + k) * 6, y + 30 * s + k * 7 * s, 200 * s * (1 - k * .15), 2);
  }
}
function gulls(ctx, t, x0, y0, n = 3) {
  for (let i = 0; i < n; i++) {
    const ph = i * 1.7, x = x0 + i * 90 + t * (22 + i * 6) % 600, y = y0 + i * 30 + Math.sin(t * .8 + ph) * 12, f = Math.sin(t * 6 + ph), s = 1.1 - i * .2;
    ctx.strokeStyle = '#4a3050'; ctx.lineWidth = 2.2 * s; ctx.lineCap = 'round'; ctx.beginPath();
    ctx.moveTo(x - 16 * s, y - 4 * s * f); ctx.quadraticCurveTo(x - 6 * s, y - 9 * s * f - 2, x, y); ctx.quadraticCurveTo(x + 6 * s, y - 9 * s * f - 2, x + 16 * s, y - 4 * s * f); ctx.stroke();
  }
}
function waterGlitter(ctx, t) {
  const r = prng(55);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 260; i++) {
    const x = r() * 2160, y = 1345 + (r() - .5) * 70 * (1 + r()), sp = .6 + r() * 2, ph = r() * 7, l = 6 + r() * 26;
    const a = Math.max(0, Math.sin(t * sp * 3 + ph)) ** 3 * (.25 + .5 * r()) * (0.4 + .6 * clamp(x / 900));
    if (a < .02) continue;
    ctx.fillStyle = rgba('#fff1cf', a); ctx.fillRect(x + Math.sin(t + ph) * 8, y, l, 1.5);
  }
  ctx.restore();
}
export const harbour = (R) => (ctx, t, s) => {
  const P = cached('s201', buildS1);
  // camera: tilt up from the stripe (start) to the street; slow dolly right; drift
  const u = eio(lin(R.t0 - .4, R.t0 + 2.4, t)), push = lin(R.t0, R.t1, t);
  const pe = eio(lin(R.t1 - 1.6, R.t1 + .4, t));
  const cam = { x: -40 + 60 * push - 160 * pe + drift(t, 8, 1), y: mix(300, -20, u) - 60 * pe + drift(t, 5, 2), z: 1.0 + .04 * push + .12 * pe };
  drawLayer(ctx, { c: P.sky, p: .25, base: 1.02 }, cam, (c) => gulls(c, t, 1200, 300));
  drawLayer(ctx, { c: P.houses, p: .75, base: 1.0 }, cam, (c, m) => {
    shutters(c, P.quads, t, R.tOpen);
    // cat on the quay in front of house 2's door
    const b = rowPt(.62, BASE0), e = rowPt(.62, QEDGE0); cat(c, mix(b[0], e[0], .35), mix(b[1], e[1], .35), .9, t, R.tOpen + .2);
    const rp = rugWoman(c, m, t, R, P.quads);
    dust(c, rp.x, rp.y, rp.s * 1.2, t, R.shakes);
    R._dust = { x: m.X(rp.x + 30), y: m.Y(rp.y - 10) };
  });
  drawLayer(ctx, { c: P.water, p: 1.0, base: 1.0 }, cam, (c) => { waterGlitter(c, t); boats(c, t); });
  drawLayer(ctx, { c: P.fg, p: 1.35, base: 1.0 }, cam);
  // light breathing over the whole street
  glowLive(ctx, 1700 - cam.x * .3, 120 - cam.y * .3, 700, .12 + .03 * Math.sin(t * .9), PAL.gold, PAL.cream, 'screen');
};
export const harbourDust = (R) => R._dust || { x: 960, y: 540 };

// ============================================================ 2.02 bedroom, late morning: you sleep until your body wakes you
// Hero light: a window off the left; the morning stripe sits high on the rose wall, a dust-filled beam crosses the room.
// Live: dust motes (carrier from the rug dust), curtain edge, the sleeper breathes, sits up, stretches on "wakes";
// the raised hand leads the camera up (a, exit up) into the checkout.
const PATCH = [[1150, 170], [1720, 110], [1790, 470], [1220, 530]];
export function buildS2() {
  const LW = 2100, LH = 1240;
  const [wc, wx] = L(LW, LH);
  wx.fillStyle = vgrad(wx, 0, 0, LW, 0, [[0, '#6e3a52'], [.5, '#9a5a66'], [1, '#b7746e']]); wx.fillRect(0, 0, LW, LH);
  // plaster: soft fbm mottling + sparse hatching in the shadowed lower wall
  { const [c, g] = L(LW, LH); const n = vnoise(7), d = g.createImageData(LW / 4, LH / 4);
    for (let y = 0; y < LH / 4; y++) for (let x = 0; x < LW / 4; x++) { const v = fbm(n, x * .02, y * .02, 4), i = (y * LW / 4 + x) * 4; d.data[i] = 255; d.data[i + 1] = 220; d.data[i + 2] = 200; d.data[i + 3] = 255 * clamp((v - .45) * .5); }
    g.putImageData(d, 0, 0); const [c2, g2] = L(LW, LH); g2.drawImage(c, 0, 0, LW, LH); stipple(c2, { k: .5, seed: 9 }); put(wx, c2, 'soft-light'); }
  hatch(wx, [0, 600, LW, 640], { angle: -.75, gap: 8, col: '#3a1e34', a: .16, seed: 3, broken: .5 });
  { const g = wx.createRadialGradient(1300, 380, 200, 1300, 380, 1500); g.addColorStop(0, 'rgba(40,16,34,0)'); g.addColorStop(1, 'rgba(40,16,34,.6)'); wx.fillStyle = g; wx.fillRect(0, 0, LW, LH); }
  // skirting + floorboards
  roughRect(wx, -20, 1000, LW + 40, 26, '#5a2c40', { amp: .8, seed: 4 });
  roughPoly(wx, [[-20, 1026], [LW + 20, 1026], [LW + 20, LH], [-20, LH]], '#4a2436', { amp: .6, seed: 5 });
  wx.strokeStyle = rgba('#2a1424', .5); for (let k = 0; k < 9; k++) { wx.beginPath(); wx.moveTo(-20, 1040 + k * k * 3); wx.lineTo(LW + 20, 1040 + k * k * 3); wx.stroke(); }
  // a framed print and a shelf with a plant
  roughRect(wx, 300, 250, 210, 270, '#3a1e2c', { amp: .8, seed: 6 }); roughRect(wx, 318, 268, 174, 234, '#e7c6a6', { amp: .6, seed: 7 });
  wx.fillStyle = '#d98e86'; wx.beginPath(); wx.arc(405, 360, 46, 0, 7); wx.fill(); roughPoly(wx, [[330, 490], [400, 400], [440, 450], [480, 420], [480, 490]], '#7a8a5a', { amp: 1, seed: 8 });
  // the morning stripe (sun patch with window-cross shadows), stippled edge
  { const [c, g] = L(LW, LH); g.fillStyle = rgba('#ffe2a8', .95); g.beginPath(); roughPath(g, PATCH, { amp: 2, seed: 11 }); g.fill();
    const m = quadMap(PATCH); g.globalCompositeOperation = 'destination-out'; g.fillStyle = '#000';
    roughPoly(g, quadIn(m, .47, 0, .53, 1), '#000', { amp: .6, seed: 12 }); roughPoly(g, quadIn(m, 0, .44, 1, .5), '#000', { amp: .6, seed: 13 });
    g.globalCompositeOperation = 'source-over';
    const s2 = soft(c, 6); stipple(s2, { k: .8, g: 1.1, seed: 14 }); put(wx, s2, 'screen'); put(wx, c, 'soft-light', .6); }
  bloomL(wx, 1460, 330, 700, { col: '#ffb877', core: '#ffd59a', a: .28, k: .4, seed: 15, op: 'screen' });
  // the beam through the room (from the unseen window upper left to the patch)
  coneL(wx, -260, -120, { dir: Math.atan2(1720, 450), spread: .16, len: 2200, col: '#ffd59a', a: .3, k: .6, seed: 16, op: 'screen', soft: .5 });
  // ---------- bed layer
  const [bc, bx] = L(LW, LH);
  // headboard
  roughPoly(bx, [[250, 1010], [250, 470], [300, 430], [380, 430], [420, 470], [420, 1010]], '#5a2a22', { amp: 1.4, seed: 21 });
  bx.save(); bx.beginPath(); roughPath(bx, [[250, 1010], [250, 470], [300, 430], [380, 430], [420, 470], [420, 1010]], { amp: 1.4, seed: 21 }); bx.clip(); hatch(bx, [250, 430, 170, 600], { angle: 1.4, gap: 6, col: '#2a120e', a: .4, seed: 22 }); bx.fillStyle = rgba('#ffd59a', .45); bx.fillRect(400, 430, 20, 600); bx.restore();
  // mattress side + sheet
  roughPoly(bx, [[400, 780], [1880, 790], [1900, 960], [400, 960]], '#e7d2c0', { amp: 1.4, seed: 23 });
  bx.fillStyle = vgrad(bx, 0, 780, 0, 960, [[0, rgba('#fff1cf', .2)], [1, rgba('#5a2c40', .45)]]); bx.fillRect(400, 780, 1500, 180);
  roughPoly(bx, [[420, 960], [1880, 960], [1880, 1010], [420, 1010]], '#3a1a22', { amp: 1, seed: 24 });
  roughRect(bx, 1840, 900, 34, 120, '#3a1a22', { amp: .6, seed: 25 }); roughRect(bx, 430, 900, 34, 120, '#3a1a22', { amp: .6, seed: 26 });
  // pillow
  roughPoly(bx, ell(560, 735, 150, 52, 40, -.04), '#f6ead8', { amp: 2, seed: 27 });
  bx.save(); bx.beginPath(); roughPath(bx, ell(560, 735, 150, 52, 40, -.04), { amp: 2, seed: 27 }); bx.clip(); bx.fillStyle = vgrad(bx, 0, 690, 0, 790, [[0, rgba('#fff1cf', .3)], [1, rgba('#8a5068', .4)]]); bx.fillRect(400, 680, 330, 120); hatch(bx, [400, 740, 330, 60], { angle: -.2, gap: 5, col: '#8a5068', a: .3, seed: 28 }); bx.restore();
  // bedside table + glass + small lamp (off) in the left foreground
  const [fc, fx] = L(LW, LH);
  roughPoly(fx, [[-40, 1240], [-40, 760], [230, 760], [250, 1240]], '#2a1420', { amp: 1.5, seed: 31 });
  roughRect(fx, -40, 742, 290, 24, '#3a1c28', { amp: 1, seed: 32 }); fx.fillStyle = rgba('#ffd59a', .5); fx.fillRect(-40, 742, 290, 3);
  roughPoly(fx, [[120, 742], [126, 664], [168, 664], [172, 742]], rgba('#d8c8e8', .35), { amp: .5, seed: 33 }); fx.fillStyle = rgba('#fff1cf', .7); fx.fillRect(162, 670, 3, 66);
  roughPoly(fx, [[20, 742], [40, 600], [70, 600], [86, 742]], '#5a3a48', { amp: .8, seed: 34 }); roughPoly(fx, [[0, 610], [110, 610], [90, 540], [20, 540]], '#d9a37a', { amp: .8, seed: 35 });
  return { wall: wc, bed: bc, fg: fc };
}
function soft(c, px) { const [o, g] = L(c.width, c.height); g.filter = `blur(${px}px)`; g.drawImage(c, 0, 0); return o; }
const YOU = { coat: '#e59a3a', pants: '#2a2c3a', shoes: '#14100c', skin: '#e9c3a0', hair: '#3a2214' };
export { YOU };
function motes(ctx, t, n, box, seed, a = .7, burst = 0) {
  const r = prng(seed), [x0, y0, w, h] = box;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const bx = x0 + r() * w, by = y0 + r() * h, sp = .3 + r(), ph = r() * 7, sz = .8 + r() * 2.2;
    const x = bx + Math.sin(t * .3 * sp + ph) * 30 + t * 6 * sp, y = by + Math.cos(t * .23 * sp + ph * 1.3) * 22 - t * 3;
    const tw = .5 + .5 * Math.sin(t * 2 * sp + ph);
    ctx.fillStyle = rgba('#fff1cf', a * tw * (.3 + .7 * r())); ctx.beginPath(); ctx.arc(((x - x0) % w + w) % w + x0, ((y - y0) % h + h) % h + y0, sz * (1 + burst), 0, 7); ctx.fill();
  }
  ctx.restore();
}
export const bedroom = (R) => (ctx, t, s) => {
  const P = cached('s202', buildS2);
  const push = lin(R.t0, R.t1, t), up = ein(lin(R.t1 - .5, R.t1 + .4, t));
  const cam = { x: 60 - 90 * push + drift(t, 7, 3), y: -10 * push - 120 * up + drift(t, 5, 4), z: 1.03 + .06 * sine(push) };
  const beamBox = [500, 0, 1300, 900];
  drawLayer(ctx, { c: P.wall, p: .6 }, cam, (c) => {
    // the patch breathes (a cloud passing far away)
    glowLive(c, 1460, 330, 500, .1 + .05 * Math.sin(t * .7), '#ffc477', '#ffe2a8', 'screen');
    motes(c, t, 140, beamBox, 3, .6);
  });
  drawLayer(ctx, { c: P.bed, p: .85 }, cam, (c) => {
    // pose: lying -> sitting up -> arms up on "wakes"
    const tq = Math.round(t * 15) / 15, sit = eio(lin(R.tWake - .75, R.tWake + .05, tq)), arms = back(lin(R.tWake - .15, R.tWake + .5, tq), 1.2), br = Math.sin(tq * 1.6) * .02;
    const lean = mix(-1.5, -.08, sit) + br * (1 - sit) * .5, reach = clamp(arms) + (arms > 1 ? (arms - 1) : 0);
    const hipX = 800, hipY = 800;
    const pose = { lean, head: mix(.05, -.25, sit) + .05 * Math.sin(tq * .9), sh: [mix(.05, 2.7, reach) + .03 * Math.sin(tq * 3), mix(-.1, 3.55, reach)], el: [mix(.15, .25, reach), mix(.1, -.2, reach)], hip: [1.5, 1.45], kn: [0, 0], hair: 'short' };
    const f = figure(c, hipX, hipY, 4.1, pose, { dress: { ...YOU, coat: '#f0b468' }, light: { x: 200, y: 0, col: '#ffe2a8', a: .55 }, shadeA: .12, shadeCol: '#3a1a30', rim: '#ffe2a8', rimSide: -1, rimW: 3 });
    R._hand = f.hand(0);
    // duvet over the legs and hips: a soft hump with folds, lit on the window side
    const dTop = (x) => 752 + Math.sin((x - 700) / 160) * 14 + (x < 980 ? sit * 26 * (1 - (x - 700) / 280) : 0) - (1 - sit) * 10 * Math.exp(-Math.pow((x - 820) / 120, 2)) + br * 40 * Math.exp(-Math.pow((x - 760) / 90, 2));
    const pts = []; for (let x = 690; x <= 1900; x += 20) pts.push([x, dTop(x) + Math.sin(x * .03) * 3]); pts.push([1915, 900], [1930, 1000], [1860, 1040], [1300, 1030], [720, 1050], [640, 960], [660, 860]);
    c.fillStyle = '#e9b9a6'; c.beginPath(); roughPath(c, pts, { amp: 1.6, seed: 41 }); c.fill();
    c.save(); c.clip();
    c.fillStyle = vgrad(c, 0, 720, 0, 1060, [[0, rgba('#fff1cf', .3)], [.3, rgba('#d9a0a0', .05)], [1, rgba('#4a2036', .6)]]); c.fillRect(600, 700, 1400, 380);
    // the stripe of sun lying across the duvet (it travels slowly)
    { const sx0 = 1080 + (t - R.t0) * 14; const g = c.createLinearGradient(sx0, 0, sx0 + 380, 0); g.addColorStop(0, rgba('#ffe2a8', 0)); g.addColorStop(.2, rgba('#ffe2a8', .55)); g.addColorStop(.8, rgba('#ffd59a', .5)); g.addColorStop(1, rgba('#ffd59a', 0)); c.fillStyle = g; c.beginPath(); c.moveTo(sx0, 700); c.lineTo(sx0 + 380, 700); c.lineTo(sx0 + 300, 1060); c.lineTo(sx0 - 80, 1060); c.closePath(); c.fill(); }
    c.strokeStyle = rgba('#8a5068', .45); c.lineWidth = 2;
    for (let k = 0; k < 9; k++) { const x0 = 740 + k * 130 + Math.sin(k * 2.3) * 50; c.beginPath(); c.moveTo(x0, dTop(x0) + 6); c.bezierCurveTo(x0 + 60 * Math.sin(k), 870, x0 - 40, 950, x0 + 20 + Math.cos(k) * 60, 1050); c.stroke(); }
    c.drawImage(sprite('duvetHatch', () => { const [hc, hx] = L(1400, 220); hatch(hx, [0, 0, 1400, 220], { angle: -.5, gap: 7, col: '#5a2c40', a: .22, seed: 42 }); return hc; }), 600, 860);
    c.restore();
  });
  drawLayer(ctx, { c: P.fg, p: 1.25 }, cam, (c) => {
    // curtain edge at the far left, stirring in the window draught
    const sw = Math.sin(t * .8) * 16 + Math.sin(t * 1.9) * 6;
    c.fillStyle = '#7a2e44'; c.beginPath(); c.moveTo(-60, -40); c.lineTo(150 + sw * .3, -40);
    for (let y = -40; y <= 1240; y += 40) c.lineTo(120 + sw * (y / 1240) + Math.sin(y * .012 + t) * 10, y);
    c.lineTo(-60, 1240); c.closePath(); c.fill();
    c.strokeStyle = rgba('#ffc477', .55); c.lineWidth = 3; c.beginPath(); for (let y = -40; y <= 1240; y += 40) c.lineTo(122 + sw * (y / 1240) + Math.sin(y * .012 + t) * 10, y); c.stroke();
  });
  // the rug-dust arriving: a dense swirl that settles into the beam's motes
  const arr = 1 - lin(R.t0 - .4, R.t0 + 1.2, t);
  if (arr > 0) motes(ctx, t, 220, [300, 100, 1300, 800], 9, .9 * arr, arr * 1.5);
};
const sine = (x) => -(Math.cos(Math.PI * x) - 1) / 2;

// ============================================================ 2.03 the checkout: you stop doing the maths
// Small corner grocer, morning sun through the big shop window (right) = hero light. You behind the belt (left),
// the grocer at the till (right). A lemon drops in from above (carrier from the raised hand), the ghost sum over
// your head breaks apart into gold specks on "stop", your shoulders drop. One lemon rolls ahead -> (b) into the knot.
export function buildS3() {
  const LW = 2100, LH = 1240;
  const [bc, bx] = L(LW, LH);
  bx.fillStyle = vgrad(bx, 0, 0, LW, 0, [[0, '#4a2a3e'], [.55, '#7a4a52'], [1, '#a8685e']]); bx.fillRect(0, 0, LW, LH);
  hatch(bx, [0, 0, 1400, 1240], { angle: -.8, gap: 8, col: '#24121e', a: .18, seed: 2, broken: .5 });
  // shelves with jars, tins, boxes
  const r = prng(303);
  for (const y of [250, 420, 590]) {
    roughRect(bx, -20, y, 1320, 16, '#3a1e22', { amp: .8, seed: y }); bx.fillStyle = rgba('#ffd59a', .25); bx.fillRect(-20, y, 1320, 2);
    let x = 10; while (x < 1270) { const w = 30 + r() * 40, h = 34 + r() * 56, col = ['#c4482a', '#e8a3a0', '#2f5560', '#e9c28c', '#7a8a5a', '#d98e86', '#f3efe2', '#b8606a', '#5d7fa0'][Math.floor(r() * 9)];
      if (r() < .3) { roughPoly(bx, [[x, y], [x + 2, y - h + 10], [x + w * .2, y - h], [x + w * .8, y - h], [x + w - 2, y - h + 10], [x + w, y]], mixHex(col, '#4a2a3e', .35), { amp: .6, seed: x }); }
      else roughRect(bx, x, y - h, w, h, mixHex(col, '#4a2a3e', .3), { amp: .6, seed: x });
      roughRect(bx, x - 2, y - h - 8, w + 4, 9, mixHex('#c9a46a', '#4a2a3e', .3), { amp: .4, seed: x + 1 }); bx.fillStyle = rgba('#fff1cf', .35); bx.fillRect(x + 3, y - h * .62, w - 6, h * .3);
      bx.fillStyle = rgba('#ffe2a8', .14 + .2 * (x / 1300)); bx.fillRect(x + w - 5, y - h, 4, h); x += w + 6 + r() * 14; } }
  // produce crates at the bottom
  for (let k = 0; k < 4; k++) { const x = 40 + k * 300; roughRect(bx, x, 700, 260, 110, '#6a3a22', { amp: .8, seed: k + 50 }); hatch(bx, [x, 700, 260, 110], { angle: 0, gap: 12, col: '#2a140c', a: .3, seed: k });
    const col = ['#ffd84a', '#f08a2a', '#c4302a', '#8ab04a'][k]; for (let i = 0; i < 26; i++) { const px = x + 20 + (i % 9) * 27 + r() * 6, py = 696 - Math.floor(i / 9) * 16 + r() * 4; bx.fillStyle = mixHex(col, '#4a2a3e', .2); bx.beginPath(); bx.arc(px, py, 14, 0, 7); bx.fill(); bx.fillStyle = rgba('#fff1cf', .35); bx.beginPath(); bx.arc(px + 4, py - 5, 4, 0, 7); bx.fill(); } }
  // the shop window (right): bright street beyond, mullions, lettering-free awning edge
  roughRect(bx, 1380, 60, 760, 820, '#2a1420', { amp: 1, seed: 60 });
  bx.fillStyle = vgrad(bx, 0, 80, 0, 860, [[0, '#ffe8bc'], [.6, '#ffd59a'], [1, '#e9a77a']]); bx.fillRect(1410, 90, 720, 760);
  { const rr = prng(61); for (let k = 0; k < 6; k++) { const x = 1430 + k * 120 + rr() * 30, h = 260 + rr() * 220; bx.fillStyle = rgba('#d99a7a', .55); bx.fillRect(x, 850 - h, 100, h); for (let j = 0; j < 4; j++) { bx.fillStyle = rgba('#b97a6a', .5); bx.fillRect(x + 20, 850 - h + 30 + j * 55, 18, 30); bx.fillRect(x + 60, 850 - h + 30 + j * 55, 18, 30); } } }
  for (const x of [1640, 1880]) roughRect(bx, x, 80, 14, 790, '#2a1420', { amp: .5, seed: x });
  roughRect(bx, 1400, 440, 740, 12, '#2a1420', { amp: .5, seed: 64 });
  bloomL(bx, 1760, 380, 640, { col: '#ffc477', core: '#fff1cf', a: .45, k: .4, seed: 65, op: 'screen' });
  coneL(bx, 1500, 260, { dir: Math.atan2(-900, 700), spread: .28, len: 1500, col: '#ffd59a', a: .22, k: .6, seed: 66, op: 'screen', soft: .5 });
  // floor
  roughPoly(bx, [[-20, 900], [LW + 20, 880], [LW + 20, LH], [-20, LH]], '#3a2030', { amp: 1, seed: 67 });
  poolL(bx, 1100, 1000, 700, 120, { col: '#ffc477', a: .3, k: .7, seed: 68, op: 'screen' });
  // ---------- counter layer (p .9): counter body, belt bed, till
  const [cc, cx] = L(LW, LH);
  roughPoly(cx, [[80, 760], [1840, 742], [1860, 1240], [60, 1240]], '#5a2e2a', { amp: 1.2, seed: 70 });
  cx.save(); cx.beginPath(); roughPath(cx, [[80, 760], [1840, 742], [1860, 1240], [60, 1240]], { amp: 1.2, seed: 70 }); cx.clip();
  cx.fillStyle = vgrad(cx, 60, 0, 1860, 0, [[0, rgba('#1a0c14', .5)], [.7, rgba('#1a0c14', 0)], [1, rgba('#ffc477', .25)]]); cx.fillRect(0, 700, LW, 600);
  for (let k = 0; k < 12; k++) roughLine(cx, [[90 + k * 150, 840], [80 + k * 150, 1240]], { w: 2, col: rgba('#1a0c14', .5), seed: k });
  hatch(cx, [60, 840, 1000, 400], { angle: .9, gap: 6, col: '#1a0c14', a: .3, seed: 71 });
  cx.restore();
  roughPoly(cx, [[60, 700], [1850, 684], [1880, 770], [40, 790]], '#8a5a48', { amp: 1, seed: 72 });   // counter top
  cx.fillStyle = rgba('#ffe2a8', .6); cx.beginPath(); cx.moveTo(40, 790); cx.lineTo(1880, 770); cx.lineTo(1880, 776); cx.lineTo(40, 796); cx.fill();
  roughPoly(cx, [[150, 706], [1450, 694], [1462, 752], [140, 766]], '#2a1c2a', { amp: .6, seed: 73 });   // belt bed
  // till
  roughPoly(cx, [[1540, 690], [1760, 684], [1750, 600], [1560, 606]], '#3a2a34', { amp: .8, seed: 74 });
  roughPoly(cx, [[1580, 604], [1720, 600], [1700, 520], [1600, 524]], '#2a1c26', { amp: .6, seed: 75 });
  cx.fillStyle = rgba('#ffd59a', .35); cx.fillRect(1600, 530, 90, 50);
  return { back: bc, counter: cc };
}
const ITEMS = [
  ['tulips', 230], ['bread', 420], ['bottle', 600], ['lemon', 760], ['orange', 820], ['milk', 960], ['lemon', 1080],
];
function item(c, kind, x, y, t, k = 1) {
  const sp = sprite('item:' + kind, () => { const [ic, ix] = L(420, 300); itemRaw(ix, kind, 160, 230, 0); return ic; });
  c.save(); c.translate(x, y); c.scale(k, k); c.drawImage(sp, -160, -230); c.restore();
}
function itemRaw(c, kind, x, y, t, k = 1) {
  c.save(); c.translate(x, y); c.scale(k, k);
  c.fillStyle = rgba('#120810', .4); c.beginPath(); c.ellipse(4, 2, 46, 8, 0, 0, 7); c.fill();
  if (kind === 'lemon' || kind === 'orange') {
    const col = kind === 'lemon' ? '#ffd84a' : '#f08a2a';
    c.fillStyle = col; c.beginPath(); c.ellipse(0, -22, kind === 'lemon' ? 32 : 26, 23, 0, 0, 7); c.fill();
    if (kind === 'lemon') { c.beginPath(); c.ellipse(-33, -22, 6, 5, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(33, -22, 6, 5, 0, 0, 7); c.fill(); }
    c.fillStyle = rgba('#7a3b17', .35); c.beginPath(); c.ellipse(-8, -14, 22, 14, 0, 0, 7); c.fill();
    c.fillStyle = rgba('#fff8e0', .75); c.beginPath(); c.ellipse(12, -32, 9, 5, -.4, 0, 7); c.fill();
  } else if (kind === 'bread') {
    roughPoly(c, ell(0, -26, 70, 28, 30), '#c98a4a', { amp: 1.4, seed: 3 }); c.strokeStyle = rgba('#7a3b17', .7); c.lineWidth = 3;
    for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(i * 24 - 8, -38); c.lineTo(i * 24 + 8, -20); c.stroke(); }
    c.fillStyle = rgba('#ffe2a8', .5); c.beginPath(); c.ellipse(20, -44, 40, 7, 0, 0, 7); c.fill();
  } else if (kind === 'bottle') {
    roughRect(c, -18, -110, 36, 110, '#2f5a4a', { amp: .5, seed: 4 }); roughRect(c, -8, -150, 16, 42, '#2f5a4a', { amp: .4, seed: 5 }); c.fillStyle = '#e9c28c'; c.fillRect(-18, -80, 36, 40); c.fillStyle = rgba('#fff1cf', .6); c.fillRect(10, -108, 4, 100);
  } else if (kind === 'milk') {
    roughRect(c, -26, -100, 52, 100, '#f3efe2', { amp: .5, seed: 6 }); roughPoly(c, [[-26, -100], [0, -124], [26, -100]], '#e6d8c4', { amp: .4, seed: 7 }); c.fillStyle = '#5d7fa0'; c.fillRect(-26, -60, 52, 22); c.fillStyle = rgba('#3a2440', .3); c.fillRect(-26, -100, 16, 100);
  } else if (kind === 'tulips') {
    c.rotate(-1.35); c.translate(40, 0);
    roughPoly(c, [[-10, -20], [140, -60], [140, 20], [-10, 0]], '#efe2c8', { amp: .8, seed: 8 });
    for (let i = 0; i < 5; i++) { const yy = -40 + i * 12, sw = Math.sin(t * 2 + i) * 2; c.strokeStyle = '#5a8a4a'; c.lineWidth = 4; c.beginPath(); c.moveTo(60, yy * .3); c.lineTo(170, yy + sw); c.stroke(); c.fillStyle = ['#e85a6a', '#ffb35c', '#e8a3a0', '#e85a6a', '#f3efe2'][i]; c.beginPath(); c.ellipse(180, yy + sw, 16, 11, 0, 0, 7); c.fill(); }
  }
  c.restore();
}
// ghost sum: a sprite of four hand-set lines, built once
function sumSprite() {
  return sprite('sum', () => { const [c, g] = L(420, 330);
    const lines = ['4.20', '+ 2.95', '+ 11.40', '= ?']; lines.forEach((l, i) => text(g, l, 400, 60 + i * 78, { size: 64, font: 'Instrument Serif', color: '#fff1cf', align: 'right' }));
    g.fillStyle = '#fff1cf'; g.fillRect(170, 200, 230, 2); return c; });
}
function ghostSum(c, x, y, t, tStop) {
  const spr = sumSprite(), N = 28, sw = spr.width / N, jit = Math.sin(t * 13) * 1.5;
  const a0 = .8 * sm(lin(tStop - 1.4, tStop - .9, t));
  for (let i = 0; i < N; i++) {
    const d = lin(tStop + i * .018, tStop + .7 + i * .018, t), e = eout(d);
    const a = a0 * (1 - sm(d)); if (a <= .005) continue;
    c.globalAlpha = a; c.drawImage(spr, i * sw, 0, sw, spr.height, x + i * sw + jit * (1 - d) + e * 30, y - e * (60 + (i % 5) * 18), sw, spr.height);
  }
  c.globalAlpha = 1;
  // the specks it breaks into
  const r = prng(88); c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 140; i++) { const px = x + r() * spr.width, py = y + 30 + r() * 260, dl = (px - x) / spr.width * .5, age = t - tStop - dl; if (age < 0 || age > 2) continue;
    const vx = 20 + r() * 50, vy = -40 - r() * 90; c.fillStyle = rgba(r() < .5 ? '#ffe2a8' : '#ffc477', .7 * (1 - age / 2)); c.beginPath(); c.arc(px + vx * age, py + vy * age + 12 * age * age, 1 + r() * 2.2, 0, 7); c.fill(); }
  c.restore();
}
function s3cam(R, t) {
  const push = lin(R.t0, R.t1, t), fin = eio(lin(R.tRoll, R.t1 + .3, t));
  return { x: -60 + 40 * push + 300 * fin + drift(t, 7, 5), y: -90 - 20 * push + 130 * fin + drift(t, 4, 6), z: 1.14 + .04 * push + .2 * fin };
}
// the runaway lemon: rolls ahead of the belt from tRoll, stops at the till side
function s3lemon(R, t) { const u = lin(R.tRoll, R.tRoll + 1.0, t), e = eout(u); return { x: 1080 + e * 300, y: 744 - 2 + (u > 0 && u < 1 ? -Math.abs(Math.sin(u * 9)) * 6 * (1 - u) : 0), rot: e * 9 }; }
export function s3LemonScreen(R, t) { const cam = s3cam(R, t), m = layerXf({ c: { width: 2100, height: 1240 }, p: .9 }, cam), l = s3lemon(R, t); return { x: m.X(l.x), y: m.Y(l.y - 22) }; }
export const checkout = (R) => (ctx, t, s) => {
  const P = cached('s203', buildS3);
  const cam = s3cam(R, t), belt = (t - R.t0) * 38;
  drawLayer(ctx, { c: P.back, p: .55 }, cam, (c) => glowLive(c, 1760, 380, 520, .12 + .04 * Math.sin(t * .8), '#ffc477', '#fff1cf', 'screen'));
  drawLayer(ctx, { c: P.counter, p: .9 }, cam, (c) => {
    // you, behind the counter: hunched over the sum, then the shoulders drop and the head comes up
    const tq = Math.round(t * 15) / 15, rel = sm(lin(R.tStop + .1, R.tStop + .9, tq)), br = Math.sin(tq * 1.7) * .015;
    figure(c, 520, 735, 3.4, { lean: mix(.16, -.04, rel) + br, head: mix(.38, -.12, rel), sh: [mix(.55, .25, rel), mix(.45, .1, rel)], el: [mix(1.3, .5, rel), mix(1.2, .4, rel)], hair: 'short', bulk: mix(.96, 1.03, rel) },
      { dress: YOU, light: { x: 1800, y: 300, col: '#ffe2a8', a: .55 }, shadeA: .14, shadeCol: '#2a1020', rim: '#ffe2a8', rimW: 3 });
    // the grocer at the till, facing you
    const nod = Math.sin(tq * 1.3) * .05;
    figure(c, 1700, 730, 3.1, { lean: .06, head: .12 + nod, sh: [.7, .5], el: [.9, 1.0], hair: 'bun', bulk: 1.1 },
      { flip: true, dress: { coat: '#c97a8a', pants: '#2a1c2a', skin: '#e2b08e', hair: '#d9d2c6' }, light: { x: 1800, y: 300, col: '#ffe2a8', a: .5 }, shadeA: .12, rim: '#ffe2a8', rimSide: 1, rimW: 3 });
    // counter front edge redrawn over the hips (they stand behind it)
    c.drawImage(P.counter, 0, 684, 2100, 556, 0, 684, 2100, 556);
    // belt seams sliding right
    c.save(); c.beginPath(); c.moveTo(150, 706); c.lineTo(1450, 694); c.lineTo(1462, 752); c.lineTo(140, 766); c.closePath(); c.clip();
    c.strokeStyle = rgba('#fff1cf', .12); c.lineWidth = 2; for (let x = (belt % 70) + 100; x < 1500; x += 70) { c.beginPath(); c.moveTo(x, 700); c.lineTo(x - 6, 766); c.stroke(); }
    c.fillStyle = vgrad(c, 140, 0, 1460, 0, [[0, rgba('#000', .3)], [1, rgba('#ffc477', .2)]]); c.fillRect(140, 690, 1330, 80); c.restore();
    // items riding the belt (they bunch up at the end)
    for (const [k, x0] of ITEMS) { const x = Math.min(1400, x0 + belt); item(c, k, x, 744 - (x - 140) * .01, t); }
    // the lemon from above: drops in during the tilt, bounces, settles on the belt
    { const tl = t - (R.t0 - .25), y = tl < .45 ? -200 + 900 * tl * tl / (.45 * .45) * 1.05 : 744 - 30 * Math.abs(Math.sin((tl - .45) * 9)) * Math.exp(-(tl - .45) * 5);
      const yy = Math.min(744, y); if (tl > 0) item(c, 'lemon', 980 + belt * .3 + tl * 20, yy, t); }
    // the runaway lemon
    const l = s3lemon(R, t); if (t > R.tRoll - .01) { c.save(); c.translate(l.x, l.y); c.rotate(l.rot); item(c, 'lemon', 0, 22, t); c.restore(); } else item(c, 'lemon', 1080, 744, t);
    ghostSum(c, 330, 90, t, R.tStop);
  });
  glowLive(ctx, 1500 - cam.x * .5, 300, 900, .1, '#ffc477', '#fff1cf', 'screen');
};

// ============================================================ 2.04 the knot: Sunday-evening knot in your stomach is gone
// Close on a rope knotted tight on a brass hook against a violet evening wall. On "gone" the knot loosens and
// opens, warm light floods in from the right, the rope slips off the hook and drops (a, exit down) into the square.
export function buildS4() {
  const LW = 2100, LH = 1240;
  const [c, g] = L(LW, LH);
  g.fillStyle = vgrad(g, 0, 0, LW, 0, [[0, '#2e2448'], [.6, '#4a3768'], [1, '#5e4270']]); g.fillRect(0, 0, LW, LH);
  { const [c2, g2] = L(LW, LH); const n = vnoise(17), d = g2.createImageData(LW / 4, LH / 4);
    for (let y = 0; y < LH / 4; y++) for (let x = 0; x < LW / 4; x++) { const v = fbm(n, x * .025, y * .025, 4), i = (y * LW / 4 + x) * 4; d.data[i] = 220; d.data[i + 1] = 200; d.data[i + 2] = 255; d.data[i + 3] = 255 * clamp((v - .42) * .45); }
    g2.putImageData(d, 0, 0); const [c3, g3] = L(LW, LH); g3.drawImage(c2, 0, 0, LW, LH); stipple(c3, { k: .5, seed: 19 }); put(g, c3, 'soft-light'); }
  hatch(g, [0, 0, LW, LH], { angle: -.7, gap: 9, col: '#160f2a', a: .14, seed: 21, broken: .55 });
  // a wooden peg rail across the wall, the hook on it
  roughRect(g, -20, 230, LW + 40, 54, '#3a2440', { amp: 1, seed: 22 }); g.fillStyle = rgba('#b8a0d8', .25); g.fillRect(-20, 230, LW + 40, 3);
  hatch(g, [-20, 230, LW + 40, 54], { angle: 0, gap: 5, col: '#1a1028', a: .35, seed: 23 });
  for (const x of [380, 1700]) { roughPoly(g, [[x - 12, 262], [x + 12, 262], [x + 8, 330], [x - 8, 330]], '#2a1830', { amp: .5, seed: x }); }
  // Monday's work shirt waits on the left peg (Sunday evening), a bag on the right
  { const x = 380; g.strokeStyle = '#1a1028'; g.lineWidth = 6; g.beginPath(); g.moveTo(x, 300); g.quadraticCurveTo(x + 4, 330, x - 4, 340); g.stroke();
    roughPoly(g, [[x - 130, 380], [x, 340], [x + 130, 380]], '#1a1028', { amp: .6, seed: 40 });
    roughPoly(g, [[x - 130, 376], [x - 60, 350], [x, 362], [x + 60, 350], [x + 130, 376], [x + 170, 560], [x + 120, 570], [x + 110, 820], [x - 110, 820], [x - 120, 570], [x - 170, 560]], '#5e5a7e', { amp: 1.4, seed: 41 });
    g.save(); g.beginPath(); roughPath(g, [[x - 130, 376], [x - 60, 350], [x, 362], [x + 60, 350], [x + 130, 376], [x + 170, 560], [x + 120, 570], [x + 110, 820], [x - 110, 820], [x - 120, 570], [x - 170, 560]], { amp: 1.4, seed: 41 }); g.clip();
    hatch(g, [x - 200, 340, 400, 500], { angle: .8, gap: 6, col: '#1a1028', a: .35, seed: 42 }); g.fillStyle = rgba('#1a1028', .5); g.fillRect(x - 3, 362, 6, 460);
    for (let k = 0; k < 6; k++) { g.fillStyle = '#cfc8e0'; g.beginPath(); g.arc(x + 12, 410 + k * 66, 5, 0, 7); g.fill(); }
    g.restore(); roughPoly(g, [[x - 40, 350], [x, 400], [x + 40, 350]], '#cfc8e0', { amp: .4, seed: 43 });
    roughPoly(g, [[x - 14, 372], [x + 14, 372], [x + 22, 560], [x, 590], [x - 22, 560]], '#3a2a5a', { amp: .5, seed: 44 }); }
  { const x = 1700; g.strokeStyle = '#1a1028'; g.lineWidth = 8; g.beginPath(); g.moveTo(x - 70, 470); g.quadraticCurveTo(x, 280, x + 70, 470); g.stroke(); roughPoly(g, [[x - 110, 460], [x + 110, 460], [x + 120, 720], [x - 120, 720]], '#2e2440', { amp: 1.2, seed: 45 }); hatch(g, [x - 120, 460, 240, 260], { angle: -.8, gap: 6, col: '#120a1e', a: .4, seed: 46 }); }
  // warm light layer (separately, faded in on "gone"): a window patch from the right
  const [wc, wx] = L(LW, LH);
  const patch = [[1180, 120], [1960, 60], [2040, 1100], [1260, 1180]];
  wx.fillStyle = rgba('#ffc477', .7); wx.beginPath(); roughPath(wx, patch, { amp: 2, seed: 30 }); wx.fill();
  const m = quadMap(patch); wx.globalCompositeOperation = 'destination-out'; roughPoly(wx, quadIn(m, .48, 0, .54, 1), '#000', { amp: .6, seed: 31 }); roughPoly(wx, quadIn(m, 0, .46, 1, .51), '#000', { amp: .6, seed: 32 }); wx.globalCompositeOperation = 'source-over';
  const ws = soft(wc, 10); stipple(ws, { k: .8, seed: 33 });
  const [gl, gx] = L(LW, LH); { const rg = gx.createRadialGradient(1500, 500, 0, 1500, 500, 1300); rg.addColorStop(0, rgba('#ffb35c', .5)); rg.addColorStop(1, rgba('#ff8a5a', 0)); gx.fillStyle = rg; gx.fillRect(0, 0, LW, LH); stipple(gl, { k: .4, seed: 34 }); }
  return { wall: c, warm: ws, warmGlow: gl };
}
// rope path: hook -> overhand knot (trefoil-ish, scale k, openness f) -> hanging end
function ropePts(t, R) {
  const open = sm(lin(R.tGone - .05, R.tGone + .55, t)), tight = 1 - .12 * Math.exp(-Math.pow((t - (R.tGone - .25)) / .12, 2));
  const k = mix(46, 150, eout(open)) * tight, f = sm(lin(R.tGone + .2, R.tGone + .75, t));
  const sway = Math.sin(t * 1.1) * .03 + Math.sin(t * 2.3) * .01 + open * Math.sin((t - R.tGone) * 5) * .05 * (1 - f * .5);
  const H0 = [1050, 300], KC = [1050 + Math.sin(sway) * 330, 300 + Math.cos(sway) * 330], END = [1050 + Math.sin(sway * 1.2) * 820, 300 + Math.cos(sway * 1.2) * 820];
  const pts = [];
  const tre = (s) => [Math.sin(s) + 2 * Math.sin(2 * s), -(Math.cos(s) - 2 * Math.cos(2 * s))];
  const s0 = .5, s1 = Math.PI * 2 - .5, e0 = tre(s0), e1 = tre(s1);
  // upper strand
  for (let i = 0; i <= 12; i++) { const q = i / 12; pts.push([mix(H0[0], KC[0] + e0[0] * k / 3, q), mix(H0[1], KC[1] + e0[1] * k / 3 - k * .3, q)]); }
  const N = 70; for (let i = 0; i <= N; i++) { const s = mix(s0, s1, i / N), p = tre(s), q = i / N;
    const kx = KC[0] + p[0] * k / 3, ky = KC[1] + p[1] * k / 3 - k * .3 + q * k * .6;
    const lx = mix(H0[0], END[0], .4 + q * .1), ly = mix(KC[1] - 40, KC[1] + 140, q);
    pts.push([mix(kx, lx, f), mix(ky, ly, f)]); }
  const last = pts[pts.length - 1]; for (let i = 1; i <= 16; i++) { const q = i / 16; pts.push([mix(last[0], END[0], q) + Math.sin(q * 3 + t) * 6 * (1 - f), mix(last[1], END[1], q)]); }
  // the drop: after it is loose, the loop slips off the hook and everything falls
  const td = t - (R.tGone + .62); if (td > 0) { const dy = 1400 * td * td + 120 * td; for (const p of pts) p[1] += dy; }
  return pts;
}
function rope(c, pts, w, t) {
  c.lineCap = 'butt'; c.lineJoin = 'round';
  // draw in short runs so later runs pass over earlier ones (crossings read)
  const run = 6;
  for (let i = 0; i < pts.length - 1; i += run) {
    const seg = pts.slice(i, Math.min(pts.length, i + run + 1));
    const path = () => { c.beginPath(); c.moveTo(...seg[0]); for (const p of seg.slice(1)) c.lineTo(...p); };
    c.strokeStyle = '#3a2418'; c.lineWidth = w + 6; path(); c.stroke();
    c.strokeStyle = '#b98e58'; c.lineWidth = w; path(); c.stroke();
    c.save(); c.translate(-w * .18, -w * .12); c.strokeStyle = rgba('#f3d8a0', .6); c.lineWidth = w * .3; path(); c.stroke(); c.restore();
  }
  // twist marks: short diagonals every 11 px along the rope, drawn per run so crossings stay right
  c.strokeStyle = rgba('#5a3a20', .55); c.lineWidth = 2;
  let acc = 0;
  for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l, ux = dx / l, uy = dy / l;
    for (let d = (11 - acc % 11) % 11; d < l; d += 11) { const mx = x0 + ux * d, my = y0 + uy * d; c.beginPath(); c.moveTo(mx + nx * w * .42 - ux * 7, my + ny * w * .42 - uy * 7); c.lineTo(mx - nx * w * .42 + ux * 7, my - ny * w * .42 + uy * 7); c.stroke(); }
    acc += l; }
}
export const knot = (R) => (ctx, t, s) => {
  const P = cached('s204', buildS4);
  const warm = sm(lin(R.tGone - .1, R.tGone + 1.0, t)), push = lin(R.t0, R.t1, t);
  const cam = { x: drift(t, 10, 7), y: -40 + 40 * push + drift(t, 6, 8), z: 1.06 + .05 * push };
  drawLayer(ctx, { c: P.wall, p: .8 }, cam, (c) => {
    c.globalAlpha = .25 + .75 * warm; c.drawImage(P.warmGlow, 0, 0); c.globalAlpha = .15 + .85 * warm; c.globalCompositeOperation = 'screen'; c.drawImage(P.warm, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
  });
  drawLayer(ctx, { c: null, p: 1, cx: 1050, cy: 620 }, cam, (c) => {
    const pts = ropePts(t, R);
    // the shadow on the wall (light from upper right once it is warm, a soft violet shadow before)
    c.save(); c.globalAlpha = .35; c.translate(-26 - 30 * warm, 24); c.filter = 'blur(6px)'; c.strokeStyle = '#120a1e'; c.lineWidth = 40; c.lineCap = 'round'; c.beginPath(); c.moveTo(...pts[0]); for (const p of pts) c.lineTo(...p); c.stroke(); c.restore();
    rope(c, pts, 36, t);
    // brass hook (drawn over the rope's top so the loop sits on it)
    c.strokeStyle = '#7a5a2a'; c.lineWidth = 16; c.lineCap = 'round'; c.beginPath(); c.moveTo(1050, 250); c.lineTo(1050, 300); c.quadraticCurveTo(1052, 332, 1084, 320); c.stroke();
    c.strokeStyle = rgba('#ffe2a8', .7); c.lineWidth = 4; c.beginPath(); c.moveTo(1056, 252); c.lineTo(1056, 298); c.stroke();
    roughRect(c, 1020, 236, 60, 26, '#6a4a22', { amp: .5, seed: 5 });
  });
  // violet evening veil lifts as the knot opens
  ctx.fillStyle = rgba('#2a1e48', .28 * (1 - warm)); ctx.fillRect(0, 0, W, H);
};
