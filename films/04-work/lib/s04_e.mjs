// Chapter 04, window 3: 4.16 a strolling street at night (music from a doorway, a child on shoulders reaches for the
// lights) · the long table from above, one person drifts to the edge (→ ch. 05 "But people aren't enough").
import { roughPath, roughPoly, roughRect, roughLine, hatch, facade, vnoise, fbm } from './art.mjs';
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, sm, lin, eio, eout, ein, qio, drift, HOT, once, lay, T, camTo, fig, walk, bob, glowA, finish, lightSprite, spr, stip, putL, mkL, vgr, softLight, smear, footShadow } from './s04_util.mjs';

// =====================================================================================================================
// 4.16 · the strolling street: one-point, vanishing to the right of centre, warm shopfronts, string lights
// =====================================================================================================================
const VX = 1180, VY = 560, F = 950, HC = 1.65;
const P = (X, Y, Z) => [VX + F * X / Z, VY + F * (HC - Y) / Z];
const XL = -5.2, XR = 3.6;
const BL = [[1.0, 4.5, 11], [4.5, 8, 13.5], [8, 13, 10], [13, 19, 12.5], [19, 27, 11], [27, 40, 13], [40, 70, 11.5]];
const BR = [[1.0, 3.8, 10], [3.8, 9, 12.5], [9, 14, 11], [14, 21, 13.5], [21, 31, 10.5], [31, 70, 12]];
const WALLS = ['#2a2250', '#33285a', '#241e4a', '#3a2c5e', '#2c2450'];
const DOOR = { X: XL, Z: 6.2, w: 1.3, h: 2.5 };   // the music doorway on the left
function strollLayer() {
  return once('st:bg', () => {
    const PAD = 220, [c, g] = mkL(PAD), r = prng(91), rl = prng(92);
    vgr(g, -PAD, -PAD, W + 2 * PAD, VY + PAD + 20, [[0, '#06071c'], [.7, '#16163e'], [1, '#2e2452']]);
    { const rr = prng(3); for (let i = 0; i < 160; i++) { const a = rr(); g.fillStyle = rgba('#e8e4ff', .15 + .5 * a * a); g.fillRect(rr() * (W + 2 * PAD) - PAD, rr() * (VY + PAD) - PAD, 1.4, 1.4); } }
    vgr(g, -PAD, VY, W + 2 * PAD, H - VY + PAD, [[0, '#2a2040'], [1, '#100c1e']]);
    // cobbles + kerbs
    g.save(); g.beginPath(); g.rect(-PAD, VY + 10, W + 2 * PAD, H); g.clip(); g.strokeStyle = '#08061a';
    for (let Z = 1.1; Z < 70; Z *= 1.055) { const [, y] = P(0, 0, Z); g.globalAlpha = .3 * (1 - Z / 70); g.lineWidth = Math.max(.5, 6 / Z); g.beginPath(); roughPath(g, [[-PAD, y], [W + PAD, y]], { amp: .7, seed: Math.round(Z * 10), closed: false }); g.stroke(); }
    for (const X of [-3.8, 2.4]) { const a = P(X, 0, 1.0), b = P(X, 0, 70); g.globalAlpha = .6; g.lineWidth = 3; g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); }
    g.globalAlpha = 1; g.restore();
    const side = (B, X, left) => B.slice().reverse().forEach(([z0, z1, h], i) => {
      const q = left ? [P(X, h, z0), P(X, h, z1), P(X, 0, z1), P(X, 0, z0)] : [P(X, h, z1), P(X, h, z0), P(X, 0, z0), P(X, 0, z1)];
      const k = (i + (left ? 1 : 3)) % 5, far = clamp((z0 - 4) / 50);
      facade(g, r, q, { wall: WALLS[k], floors: Math.max(3, Math.round(h / 3.1)), cols: Math.max(1, Math.round((z1 - z0) / 2.3)), top: .08, bottom: .74, ww: .42, wh: .5,
        lit: () => rl() < .5 ? .5 + .5 * rl() : 0, winOn: '#ffc477', winOff: '#0e0c22', amp: 1, style: k % 4, skip: .1,
        shade: left ? [[0, rgba('#000000', .25)], [1, rgba('#000000', 0)]] : [[0, rgba('#000000', 0)], [1, rgba('#000000', .25)]], edgeLight: rgba('#ffb35c', .2), fogA: .3 * far, fogCol: '#2a2450' });
      // ground floor: warm shopfronts (big lit windows) on most houses
      if (k !== 2) { const za = mix(z0, z1, .15), zb = mix(z0, z1, .7), poly = [P(X, 2.6, za), P(X, 2.6, zb), P(X, .3, zb), P(X, .3, za)];
        roughPoly(g, left ? poly : [poly[1], poly[0], poly[3], poly[2]], mixHex('#ffb35c', '#ffd59a', rl()), { amp: .6, seed: i });
        g.strokeStyle = rgba('#1a1028', .7); g.lineWidth = Math.max(1, 30 / za); g.beginPath(); g.moveTo(...P(X, 2.6, mix(za, zb, .5))); g.lineTo(...P(X, .3, mix(za, zb, .5))); g.stroke();
        const [ax, ay] = P(X, 3.0, za), [bx, by] = P(X, 3.0, zb); roughPoly(g, [[ax, ay], [bx, by], P(X + (left ? .9 : -.9), 2.7, zb), P(X + (left ? .9 : -.9), 2.7, za)], k % 2 ? '#7a2a3a' : '#2a4a4a', { amp: .5, seed: i + 50 }); }
    });
    side(BL, XL, true); side(BR, XR, false);
    // the music doorway: a deep warm opening (the hero light) with a pool on the cobbles (drawn live on top too)
    { const q = [P(DOOR.X, DOOR.h, DOOR.Z), P(DOOR.X, DOOR.h, DOOR.Z + DOOR.w), P(DOOR.X, 0, DOOR.Z + DOOR.w), P(DOOR.X, 0, DOOR.Z)]; roughPoly(g, q, '#ffcf8a', { amp: .6, seed: 7 });
      const [lc, lx] = mkL(PAD); const [px, py] = P(DOOR.X + 1.4, 0, DOOR.Z + .7); softLight(lx, px, py, 520, '#ffb35c', .55, .35); const [dx, dy] = P(DOOR.X, 1.2, DOOR.Z + .6); softLight(lx, dx, dy, 380, '#ffb35c', .4); stip(lc, { k: .45, seed: 9 }); putL(g, lc, { op: 'screen' }); }
    // shopfront light spilling onto the cobbles (stippled)
    { const [lc, lx] = mkL(PAD); for (let Z = 3; Z < 40; Z *= 1.35) for (const X of [XL + .8, XR - .8]) { const [x, y] = P(X, 0, Z); softLight(lx, x, y, 900 / Z, '#ffb35c', .3, .35); } stip(lc, { k: .4, seed: 10 }); putL(g, lc, { op: 'screen' }); }
    hatch(g, [-PAD, VY + 40, W + 2 * PAD, H], { angle: -.05, gap: 9, col: '#05040f', a: .12, seed: 4, broken: .5 });
    return c;
  });
}
const WALKERS = [   // X, Z, dir, speed (m/s), phase, dress index, hair, scale tweak
  [-2.6, 9, 1, .45, .1, 0, 'long'], [-1.8, 9.4, 1, .45, .6, 1, 'short'], [1.2, 14, -1, .4, .3, 2, 'bun'], [.3, 22, 1, .35, .8, 3, 'curly'],
  [-3.0, 18, -1, .38, .2, 4, 'grey'], [1.6, 30, 1, .4, .5, 5, 'short'], [-.8, 40, -1, .35, .9, 6, 'long'], [2.0, 6.8, -1, .42, .4, 7, 'cap'],
  [-2.2, 12, 1, .3, .7, 3, 'bun'], [-1.6, 12.3, 1, .3, .2, 6, 'short'], [.9, 17, -1, .36, .5, 0, 'long'], [-1.2, 26, -1, .3, .1, 1, 'curly'], [2.2, 21, 1, .33, .3, 7, 'grey'], [-2.6, 34, 1, .3, .6, 2, 'short'], [.6, 50, -1, .3, .4, 4, 'long'], [-2.0, 58, 1, .3, .8, 5, 'bun'],
];
const DR = [['#c46a4a', '#2a1c2a'], ['#3a5a6a', '#1a1a28'], ['#d9a04a', '#2a2234'], ['#7a4a7a', '#1c1426'], ['#e3c9a0', '#3a2a2a'], ['#4a6a4a', '#1a1c18'], ['#b05a6a', '#24182a'], ['#e59a3a', '#2a2c3a']];
export function drawStroll(ctx, t, s, K) {
  const L = strollLayer(), rise = ein(lin(K.end - .6, K.end + .3, t));
  const cam = { x: drift(t, 8, 21) + 30 * lin(K.start, K.end, t), y: drift(t, 5, 22) - rise * 700, z: 1.04 + .05 * eout(lin(K.start, K.end, t)) };
  lay(ctx, L, cam, 1);
  ctx.save(); camTo(ctx, cam, 1);
  const bulbs = lightSprite('st:bulb', '#ffb35c', '#fff1cf', { k: .5, seed: 6, size: 128 });
  // string lights zig-zag (wires first; bulbs after the figures)
  const ZS = [2.6, 4.6, 7, 10, 13.5, 18, 24, 32, 44];
  const lines = ZS.map((Z, i) => { const a = i % 2 ? [XL, 5, Z] : [XR, 5, Z], b = i % 2 ? [XR, 5.2, ZS[i + 1] || Z + 10] : [XL, 5.2, ZS[i + 1] || Z + 10], pts = []; for (let k = 0; k <= 22; k++) { const u = k / 22; pts.push([mix(a[0], b[0], u), mix(a[1], b[1], u) - Math.sin(Math.PI * u) * .8 + Math.sin(t * 1.1 + i) * .03 * Math.sin(Math.PI * u), mix(a[2], b[2], u)]); } return pts; });
  ctx.strokeStyle = '#06050f'; ctx.lineWidth = 1.4; for (const Ln of lines) { ctx.beginPath(); Ln.forEach(([X, Y, Z], k) => { const [x, y] = P(X, Y, Z); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); }
  // the musician in the doorway (guitar), swaying; warm light breathes with the music
  { const [x, y] = P(DOOR.X + .25, .95, DOOR.Z + .55), sc = F / (DOOR.Z + .55) / 108, sw = Math.sin(t * 4.2) * .05;
    glowA(ctx, ...P(DOOR.X, 1.3, DOOR.Z + .6), 300, .25 + .06 * Math.sin(t * 4.2), C.amber, HOT);
    fig(ctx, x, y, sc, { lean: .05 + sw, head: .25 + sw, sh: [1.2, .9 + Math.sin(t * 8.4) * .15], el: [.9, 1.3], hip: [.04, -.1], kn: [.02, .1], hair: 'curly' }, { dress: { coat: '#2a1a2a', pants: '#140c14', skin: '#8a5a3a', hair: '#140c10' }, shadeA: .55, shadeCol: '#140810', rim: '#ffd59a', rimSide: -1, rimW: 3,
      prop: (g, a0, a1) => { g.save(); g.translate(a1.hx - 4, a1.hy - 4); g.rotate(-.5); g.fillStyle = '#7a4a2a'; g.beginPath(); g.ellipse(0, 0, 18, 13, 0, 0, 7); g.fill(); g.fillRect(14, -3, 46, 6); g.restore(); } }); }
  // strollers (far → near), slow; then the father with the child on his shoulders
  const tt = t - K.start;
  const items = WALKERS.map((w, i) => ({ w, i, Z: w[1] })).sort((a, b) => b.Z - a.Z);
  for (const { w, i } of items) {
    const [X0, Z, dir, sp, ph, di, hair] = w, X = X0 + dir * sp * tt, sc = F / Z / 108, wp = ph + tt * sp * 1.35;
    const [x, y] = P(X, .95, Z);
    footShadow(ctx, x, P(X, 0, Z)[1], 40 * sc, .35);
    fig(ctx, x, y + bob(wp, sc, .6), sc, walk(wp, .55, { hair, lean: .03 }), { flip: dir < 0, dress: { coat: DR[di][0], pants: DR[di][1], shoes: '#0b0a18', skin: ['#e9c3a0', '#c98f6a', '#8a5a3a', '#e2b296'][i % 4], hair: ['#2a1a14', '#c9c2b6', '#3a2214', '#1c1420'][i % 4] }, light: { x: P(XL, 2, Z)[0], y: P(0, 4, Z)[1], col: '#ffb35c', a: .45 }, rim: '#ffd59a', rimSide: dir < 0 ? 1 : -1, rimW: 2.5, shadeA: .15 + .25 * clamp((Z - 8) / 30), shadeCol: '#1a1430' });
  }
  // father + child (midground, walking right, slowly); the child reaches up for the lights
  { const Z = 5.0, X = -1.6 + .4 * tt, sc = F / Z / 108, wp = .2 + tt * .55, [x, y] = P(X, .95, Z), by = bob(wp, sc, .6);
    const reach = sm(lin(K.reach - .5, K.reach + .2, t));
    footShadow(ctx, x, P(X, 0, Z)[1], 50 * sc, .4);
    const dad = fig(ctx, x, y + by, sc, walk(wp, .45, { hair: 'short', sh: [2.5, 2.3], el: [.9, 1.0], lean: .02 }), { dress: { coat: '#3a4a6a', pants: '#1a1a28', shoes: '#0b0a18', skin: '#c98f6a', hair: '#1c1420' }, light: { x: x + 300, y: y - 600, col: '#ffb35c', a: .45 }, rim: '#ffd59a', rimSide: 1, rimW: 3, shadeA: .12, shadeCol: '#1a1430' });
    const [hx, hy] = dad.head(), cs = sc * .55;
    fig(ctx, hx - 3 * sc, hy + 10 * sc + Math.sin(wp * 6.283) * 1.5, cs, { lean: -.05 - .1 * reach, head: -.2 - .3 * reach, sh: [2.9 * reach + .9 * (1 - reach), .7 + 2.2 * reach], el: [.2 * (1 - reach), .3], hip: [1.45, 1.3], kn: [1.4, 1.5], hair: 'curly' }, { dress: { coat: '#e59a3a', pants: '#3a2a4a', shoes: '#0b0a18', skin: '#c98f6a', hair: '#2a1a14' }, light: { x: x + 300, y: y - 600, col: '#ffb35c', a: .5 }, rim: '#ffe2b8', rimSide: 1, rimW: 2.5 });
  }
  // bulbs
  for (const Ln of lines) for (let k = 1; k < 22; k += 2) { const [X, Y, Z] = Ln[k], [x, y] = P(X, Y - .08, Z), r0 = Math.max(1.4, 28 / Z), fl = .85 + .15 * Math.sin(t * 2.3 + k * 1.7 + Z); ctx.fillStyle = '#fff1cf'; ctx.beginPath(); ctx.arc(x, y, r0 * .5, 0, 7); ctx.fill(); spr(ctx, bulbs, x, y, r0 * 7, .85 * fl); }
  ctx.restore();
  finish(ctx, { vig: .38, vigCol: '#06051a' });
  if (rise > .02) smear(ctx, ctx.canvas, 0, rise * 240, .9);
}

// =====================================================================================================================
// the long table from above: lights strung across, plates, many hands; one person pushes back and drifts to the edge
// =====================================================================================================================
const TA = -.36, TL = 3000, TWd = 300, SP2 = 190;   // table axis angle, length, width (px, world = frame centred)
const tpt = (u, v) => [960 + Math.cos(TA) * u - Math.sin(TA) * v, 540 + Math.sin(TA) * u + Math.cos(TA) * v];
function topLayer() {
  return once('st:top', () => {
    const PAD = 300, [c, g] = mkL(PAD), r = prng(71), n = vnoise(7);
    // cobbles from above (warm-lit in the middle, dark to the edges)
    g.fillStyle = '#1a1428'; g.fillRect(-PAD, -PAD, W + 2 * PAD, H + 2 * PAD);
    for (let i = 0; i < 5200; i++) { const x = r() * (W + 2 * PAD) - PAD, y = r() * (H + 2 * PAD) - PAD; g.fillStyle = mixHex('#241c34', '#3a2c40', r()); g.beginPath(); g.ellipse(x, y, 7 + r() * 5, 5 + r() * 4, r() * 3, 0, 7); g.fill(); }
    softLight(g, 960, 540, 1100, '#ffb35c', .3, .55);
    // the table: cloth runner, plates, glasses, bowls, bread, a jug
    g.save(); g.translate(960, 540); g.rotate(TA);
    g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(-TL / 2 + 14, -TWd / 2 + 16, TL, TWd);
    roughRect(g, -TL / 2, -TWd / 2, TL, TWd, '#d9c8b0', { amp: 1, seed: 3 });
    for (let k = -TL / 2; k < TL / 2; k += 60) { g.fillStyle = rgba('#c46a6a', .25); g.fillRect(k, -TWd / 2, 14, TWd); }
    for (let u = -TL / 2 + 80; u < TL / 2 - 40; u += SP2) for (const sd of [-1, 1]) {
      const v = sd * TWd * .3, x = u + (r() - .5) * 16;
      g.fillStyle = '#f3efe2'; g.beginPath(); g.arc(x, v, 40, 0, 7); g.fill(); g.fillStyle = rgba('#c4b8a0', .7); g.beginPath(); g.arc(x, v, 30, 0, 7); g.fill();
      g.fillStyle = ['#c4382a', '#e8a24a', '#6a8a4a', '#d9a04a'][Math.floor(r() * 4)]; for (let k2 = 0; k2 < 4; k2++) { g.beginPath(); g.arc(x + (r() - .5) * 22, v + (r() - .5) * 22, 4 + r() * 3, 0, 7); g.fill(); }
      g.fillStyle = rgba('#ffe2b8', .55); g.beginPath(); g.arc(x + 40, v - sd * 26, 9, 0, 7); g.fill(); g.strokeStyle = rgba('#fff1cf', .7); g.lineWidth = 1.5; g.stroke();
    }
    for (let u = -TL / 2 + 175; u < TL / 2; u += SP2 * 2) { g.fillStyle = '#a0603a'; g.beginPath(); g.arc(u, 0, 26, 0, 7); g.fill(); g.fillStyle = '#e8a24a'; g.beginPath(); g.arc(u, 0, 18, 0, 7); g.fill(); g.fillStyle = '#c98f6a'; g.beginPath(); g.ellipse(u + 100, 4, 34, 14, .2, 0, 7); g.fill(); }
    g.restore();
    stip(c, { k: .3, seed: 72 });
    return c;
  });
}
// a person seen from above: shoulders, arms toward the table, head (hair), chair edge behind
function topPerson(ctx, x, y, ang, s, coat, hair, reach = .5, t = 0, ph = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(6, 8, 30, 36, 0, 0, 7); ctx.fill();
  roughRect(ctx, -44, -30, 12, 60, '#2a1a24', { amp: .3, seed: Math.round(ph * 10) });   // chair back
  ctx.fillStyle = coat; ctx.lineCap = 'round'; ctx.strokeStyle = coat; ctx.lineWidth = 11;
  for (const sd of [-1, 1]) { const r2 = reach + .15 * Math.sin(t * 1.3 + ph + sd); ctx.beginPath(); ctx.moveTo(-2, sd * 20); ctx.quadraticCurveTo(18, sd * 26, 22 + 22 * r2, sd * (14 - 6 * r2)); ctx.stroke(); }
  ctx.fillStyle = '#d9a77e'; for (const sd of [-1, 1]) { const r2 = reach + .15 * Math.sin(t * 1.3 + ph + sd); ctx.beginPath(); ctx.arc(26 + 22 * r2, sd * (14 - 6 * r2), 5.5, 0, 7); ctx.fill(); }
  ctx.fillStyle = coat; ctx.beginPath(); ctx.ellipse(-6, 0, 18, 27, 0, 0, 7); ctx.fill();
  ctx.fillStyle = hair; ctx.beginPath(); ctx.arc(-4 + 2 * Math.sin(t * .9 + ph), 0, 12.5, 0, 7); ctx.fill();
  ctx.fillStyle = rgba('#ffcf96', .35); ctx.beginPath(); ctx.arc(-1, -4, 6, 0, 7); ctx.fill();
  ctx.restore();
}
const COATS = ['#c46a4a', '#3a5a6a', '#d9a04a', '#7a4a7a', '#e3c9a0', '#4a6a4a', '#b05a6a', '#e59a3a', '#5a4a8a', '#a04a3a'];
const HAIRS = ['#2a1a14', '#c9c2b6', '#3a2214', '#1c1420', '#6a4a2a', '#d8d0c8'];
export function drawTableTop(ctx, t, s, K) {
  const L = topLayer(), land = 1 - eout(lin(K.start - .3, K.start + .5, t));
  const z = mix(1.25, 1.4, eio(lin(K.start, K.end + .5, t))), roll = .03 * Math.sin(t * .2), dy = -land * 500;
  ctx.save(); ctx.translate(W / 2, H / 2 + dy); ctx.rotate(roll); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
  ctx.drawImage(L, -300, -300);
  // the people along both sides; the one at the near-right end pushes back and drifts to the edge
  const drift2 = eio(lin(K.start + .5, K.end + .6, t));
  let idx = 0;
  for (let u = -TL / 2 + 80; u < TL / 2 - 40; u += SP2) for (const sd of [-1, 1]) {
    const i = idx++, lone = sd === -1 && Math.abs(u + 300) < SP2 / 2;
    let [x, y] = tpt(u + 18 * Math.sin(i * 2.1), sd * (TWd / 2 + 34)); const ang = TA + (sd < 0 ? Math.PI / 2 : -Math.PI / 2) + .25 * Math.sin(i * 1.7 + t * .3);
    let reach = .45 + .3 * Math.sin(t * .7 + i * 1.3);
    let a2 = ang; if (lone) { const away = drift2 * 280; x += Math.cos(ang + Math.PI) * away - drift2 * 60; y += Math.sin(ang + Math.PI) * away; reach = .1 + .3 * (1 - drift2); a2 = ang + 2.6 * sm(lin(.15, .7, drift2)); }
    topPerson(ctx, x, y, a2, 1.5, COATS[i % COATS.length], HAIRS[i % HAIRS.length], reach, t, i);
  }
  // the lights strung over the table, closer to the lens (bigger parallax), swaying
  ctx.restore();
  const bulbs = lightSprite('st:bulb2', '#ffb35c', '#fff1cf', { k: .5, seed: 8, size: 128 });
  ctx.save(); ctx.translate(W / 2, H / 2 + dy * 1.4); ctx.rotate(roll * 1.3); ctx.scale(z * 1.15, z * 1.15); ctx.translate(-W / 2, -H / 2);
  for (const [a, b, ph] of [[[-200, 100], [2100, 520], 0], [[-150, 760], [2150, 1050], 1.3], [[300, -150], [1700, 1250], 2.1]]) {
    const pts = []; for (let k = 0; k <= 30; k++) { const u = k / 30, sw = Math.sin(t * .9 + ph) * 12 * Math.sin(Math.PI * u); pts.push([mix(a[0], b[0], u) + sw, mix(a[1], b[1], u) + Math.sin(Math.PI * u) * 40 + sw * .5]); }
    ctx.strokeStyle = rgba('#05040c', .8); ctx.lineWidth = 2.5; ctx.beginPath(); pts.forEach(([x, y], k) => k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
    for (let k = 1; k < 30; k += 2) { const [x, y] = pts[k], fl = .85 + .15 * Math.sin(t * 2.1 + k + ph); ctx.fillStyle = '#fff1cf'; ctx.beginPath(); ctx.arc(x, y, 6, 0, 7); ctx.fill(); spr(ctx, bulbs, x, y, 60, .8 * fl); }
  }
  ctx.restore();
  finish(ctx, { vig: .5, vigCol: '#05040f' });
  if (land > .02) smear(ctx, ctx.canvas, 0, land * 200, .8);
}
