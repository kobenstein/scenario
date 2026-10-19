// s02_c.mjs · chapter 02, shots 2.09–2.11 (train window to the town, grandmother's door, the two cups)
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, vnoise, fbm, stipple, roughPath, roughPoly, PAL, L, put, cached, sprite, fogL, coneL, poolL, bloomL, glowLive, vgrad, drawLayer, layerXf, ell, lin, sm, eout, ein, eio, eoutq, drift, back , figure } from './s02_kit.mjs';
import { hatch, roughLine, roughRect, sagLine, person, castShadow, quadMap, quadIn, stratus, limb, qpts, house } from './art.mjs';
import { YOU } from './s02_a.mjs';

function soft(c, px) { const [o, g] = L(c.width, c.height); g.filter = `blur(${px}px)`; g.drawImage(c, 0, 0); return o; }
const sine = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
const GRAN = { coat: '#c97a8a', pants: '#4a3040', shoes: '#2a1a20', skin: '#e2b08e', hair: '#e6e0d6', skirt: '#6a4a5a' };

// ============================================================ 2.09 the coast unspools in a train window; the town you love arrives
const WIN = { x: 250, y: 170, w: 1180, h: 600 };   // window in layer coords (layer 2100x1240, centre 1050,620)
function buildS9() {
  const SW = 3600;
  // far strip: sea + headlands (tileable-ish, wraps), mid strip: green coast & cliffs, both taller than the window
  const [fc, fx] = L(SW, 700);
  fx.fillStyle = vgrad(fx, 0, 0, 0, 700, [[0, '#9ab8d0'], [.35, '#f3d2b0'], [.5, '#ffd9a8'], [.52, '#5d8fa8'], [1, '#2f5f7a']]); fx.fillRect(0, 0, SW, 700);
  { const r = prng(91); for (let i = 0; i < 900; i++) { const y = 370 + Math.pow(r(), 1.4) * 320, x = r() * SW; fx.fillStyle = rgba('#fff1cf', .2 + r() * .5 * (1 - (y - 360) / 340)); fx.fillRect(x, y, 6 + r() * 30, 1.5); } }
  for (const [x0, w, h] of [[200, 700, 70], [1300, 900, 50], [2500, 800, 80]]) { fx.fillStyle = '#b8a0a8'; fx.beginPath(); fx.moveTo(x0, 362); for (let k = 0; k <= 20; k++) fx.lineTo(x0 + w * k / 20, 362 - h * Math.sin(Math.PI * k / 20) * (.7 + .3 * Math.sin(k * 1.3))); fx.closePath(); fx.fill(); }
  bloomL(fx, 2400, 200, 420, { col: '#ffc477', core: '#fff8e6', a: .55, k: .3, seed: 92, op: 'screen' });
  const [mc, mx] = L(SW, 700);
  { const n = vnoise(93); mx.fillStyle = '#4f7a4a'; mx.beginPath(); mx.moveTo(0, 700); for (let x = 0; x <= SW; x += 10) mx.lineTo(x, 470 + 90 * fbm(n, x * .003, 1, 3) - 40 * Math.sin(x * .002)); mx.lineTo(SW, 700); mx.closePath(); mx.fill();
    mx.save(); mx.clip(); mx.fillStyle = vgrad(mx, 0, 420, 0, 700, [[0, rgba('#ffe2a8', .45)], [1, rgba('#1a2a14', .4)]]); mx.fillRect(0, 0, SW, 700);
    const r = prng(94); mx.strokeStyle = '#e8d27a'; for (let i = 0; i < 3000; i++) { const x = r() * SW, y = 470 + r() * 230; mx.globalAlpha = .2 + .3 * r(); mx.beginPath(); mx.moveTo(x, y); mx.lineTo(x + 2, y - 4 - r() * 8); mx.stroke(); } mx.globalAlpha = 1;
    for (let i = 0; i < 40; i++) { const x = r() * SW, y = 470 + r() * 120; mx.fillStyle = '#2f4a2a'; mx.beginPath(); roughPath(mx, ell(x, y, 30 + r() * 40, 18 + r() * 20, 14), { amp: 2, seed: i }); mx.fill(); }
    mx.restore(); }
  // the town: houses tumbling down a slope to a little cove (built once)
  const [tc, tx] = L(1300, 520);
  { const r = prng(95), cols = ['#e2b48e', '#d98e86', '#e9c48a', '#f0dcc0', '#cf7f6c', '#e8a3a0', '#d9a35a'];
    tx.fillStyle = '#6a8a4a'; tx.beginPath(); tx.moveTo(0, 520); tx.lineTo(0, 120); tx.quadraticCurveTo(500, 140, 1100, 420); tx.lineTo(1300, 470); tx.lineTo(1300, 520); tx.closePath(); tx.fill();
    for (let row = 0; row < 6; row++) for (let k = 0; k < 9; k++) {
      const x = 60 + k * 120 + row * 30 + r() * 40, base = 180 + row * 46 + x * .22 + r() * 10; if (base > 470 || x > 1200) continue;
      house(tx, r, x, base, 70 + r() * 40, 60 + r() * 50, { wall: cols[Math.floor(r() * cols.length)], roofs: ['gable', 'hip', 'gable', 'flat'], roofCol: '#a8483a', lit: (wx, wy, q) => q() < .2 ? .7 : 0, winOff: '#5a3a48', amp: .6, floorH: 20, colW: 22, side: .12, chimney: .3, light: { x: 1300, y: 0, col: '#ffe2a8', a: .45, r: 300 } });
    }
    // church tower
    roughRect(tx, 380, 60, 50, 170, '#f0dcc0', { amp: .6, seed: 5 }); roughPoly(tx, [[374, 62], [405, -10], [436, 62]], '#a8483a', { amp: .5, seed: 6 }); tx.fillStyle = '#5a3a48'; tx.fillRect(396, 90, 18, 26);
    tx.fillStyle = '#4a8aa8'; tx.beginPath(); tx.moveTo(900, 520); tx.quadraticCurveTo(1100, 440, 1300, 470); tx.lineTo(1300, 520); tx.fill();
    for (let i = 0; i < 3; i++) { roughPoly(tx, [[1000 + i * 70, 488], [1046 + i * 70, 488], [1040 + i * 70, 498], [1006 + i * 70, 498]], ['#c4482a', '#f3efe2', '#2f5560'][i], { amp: .3, seed: i }); }
  }
  // interior: carriage wall with the window cut out, seat, little table
  const [ic, ix] = L(2100, 1240);
  ix.fillStyle = vgrad(ix, 0, 0, 2100, 0, [[0, '#3a2030'], [.6, '#4a2a38'], [1, '#2a1622']]); ix.fillRect(0, 0, 2100, 1240);
  hatch(ix, [0, 0, 2100, 1240], { angle: .7, gap: 7, col: '#140810', a: .2, seed: 96 });
  ix.globalCompositeOperation = 'destination-out'; ix.beginPath(); ix.roundRect(WIN.x, WIN.y, WIN.w, WIN.h, 60); ix.fill(); ix.globalCompositeOperation = 'source-over';
  ix.strokeStyle = '#6a4030'; ix.lineWidth = 26; ix.beginPath(); ix.roundRect(WIN.x - 13, WIN.y - 13, WIN.w + 26, WIN.h + 26, 70); ix.stroke();
  ix.strokeStyle = rgba('#ffe2a8', .55); ix.lineWidth = 3; ix.beginPath(); ix.roundRect(WIN.x - 2, WIN.y - 2, WIN.w + 4, WIN.h + 4, 62); ix.stroke();
  // light falling in: a warm patch on the wall below the window and on the table
  poolL(ix, 840, 900, 700, 140, { col: '#ffc477', a: .35, k: .7, seed: 97, op: 'screen' });
  roughPoly(ix, [[180, 800], [1500, 800], [1460, 850], [220, 850]], '#7a4a34', { amp: 1, seed: 98 }); ix.fillStyle = rgba('#ffe2a8', .5); ix.fillRect(180, 800, 1320, 4);
  roughRect(ix, 820, 850, 40, 390, '#3a2024', { amp: .6, seed: 99 });
  // seat back (right)
  roughPoly(ix, [[1520, 1240], [1540, 420], [1600, 380], [1960, 380], [2000, 420], [2020, 1240]], '#7a2e44', { amp: 2, seed: 100 });
  ix.save(); ix.beginPath(); roughPath(ix, [[1520, 1240], [1540, 420], [1600, 380], [1960, 380], [2000, 420], [2020, 1240]], { amp: 2, seed: 100 }); ix.clip(); hatch(ix, [1500, 380, 540, 860], { angle: 1.2, gap: 6, col: '#2a0e18', a: .35, seed: 101 }); ix.fillStyle = vgrad(ix, 1520, 0, 2020, 0, [[0, rgba('#ffc477', .35)], [.3, rgba('#ffc477', 0)]]); ix.fillRect(1500, 380, 540, 860); ix.restore();
  return { far: fc, mid: mc, town: tc, inside: ic, SW };
}
// distance travelled (px of mid strip); the train slows down as the town arrives
function s9dist(R, t) { let d = 0; const N = 60, a = R.t0 - .6; for (let i = 0; i < N; i++) { const tt = a + (t - a) * (i + .5) / N; d += (900 * (1 - .95 * sm(lin(R.tLove - 1.1, R.tLove + .25, tt)))) * (t - a) / N; } return d; }
function townX(R, t) { return WIN.x + WIN.w * .5 - 650 + (s9dist(R, R.tLove + .3) - s9dist(R, t)); }
export function s9TownScreen(R, t) { const cam = s9cam(R, t), m = layerXf({ c: { width: 2100, height: 1240 }, p: 1 }, cam); return { x: m.X(townX(R, t) + 560), y: m.Y(WIN.y + 330) }; }
function s9cam(R, t) { const push = eio(lin(R.tLove - .4, R.t1 + .4, t)); return { x: -60 * push + drift(t, 6, 17) - 120 * push, y: drift(t, 4, 18) - 40 * push, z: 1.03 + .2 * push }; }
export const trainWindow = (R) => (ctx, t, s) => {
  const P = cached('s209', buildS9);
  const cam = s9cam(R, t), d = s9dist(R, t), rock = Math.sin(t * 7) * 1.5 * (1 - sm(lin(R.tLove - 1, R.tLove, t)) * .7);
  drawLayer(ctx, { c: null, p: 1, cx: 1050, cy: 620 }, { ...cam, y: cam.y + rock }, (c) => {
    c.save(); c.beginPath(); c.roundRect(WIN.x, WIN.y, WIN.w, WIN.h, 60); c.clip();
    const wrap = (img, off, y) => { const sw = img.width, x0 = -(((off % sw) + sw) % sw); c.drawImage(img, WIN.x + x0, y); c.drawImage(img, WIN.x + x0 + sw, y); };
    wrap(P.far, d * .08, WIN.y - 60);
    // the town sits on the mid plane
    const tx = townX(R, t); c.drawImage(P.town, tx, WIN.y + 110);
    wrap(P.mid, d * 1.0 + 600, WIN.y + 180 + 40);
    // near poles + bushes whip past (blurred streaks)
    const r = prng(5); for (let i = 0; i < 14; i++) { const base = r() * 4000, x = WIN.x + ((base - d * 2.6) % 4000 + 4000) % 4000 - 400, slow = 1 - .85 * sm(lin(R.tLove - 1.4, R.tLove + .2, t));
      if (i % 3 === 0) { c.fillStyle = rgba('#2a1a1a', .8); c.fillRect(x, WIN.y, 14 + 60 * slow, WIN.h); }
      else { c.fillStyle = rgba('#2f4a2a', .9); c.beginPath(); c.ellipse(x, WIN.y + WIN.h - 20, 90 + 160 * slow, 70, 0, 0, 7); c.fill(); } }
    // glass: a faint warm reflection + a soft sheen
    c.fillStyle = vgrad(c, WIN.x, WIN.y, WIN.x + WIN.w, WIN.y + WIN.h, [[0, rgba('#fff1cf', .12)], [.4, rgba('#fff1cf', 0)], [.7, rgba('#fff1cf', .05)], [1, rgba('#fff1cf', 0)]]); c.fillRect(WIN.x, WIN.y, WIN.w, WIN.h);
    c.restore();
    c.drawImage(P.inside, 0, 0);
    // you, seated at the window, head turned to it; on "love" you lean toward the glass
    const tq = Math.round(t * 15) / 15, lean = sm(lin(R.tLove - .5, R.tLove + .3, tq)), br = Math.sin(tq * 1.4) * .012;
    figure(c, 1720, 880, 3.6, { lean: -.05 - .14 * lean + br, head: -.2 - .15 * lean, sh: [-.5 - .2 * lean, .4], el: [1.4, .9], hip: [1.35, 1.3], kn: [1.3, 1.25], hair: 'short' },
      { flip: true, dress: YOU, light: { x: 700, y: 300, col: '#ffe2a8', a: .6 }, shadeA: .2, shadeCol: '#2a1020', rim: '#ffe2a8', rimSide: 1, rimW: 3 });
    // a paper cup on the table catching the light
    roughPoly(c, [[1300, 800], [1306, 740], [1350, 740], [1356, 800]], '#efe2c8', { amp: .4, seed: 3 }); c.fillStyle = '#c4482a'; c.fillRect(1306, 760, 46, 12);
  });
  glowLive(ctx, 700 - cam.x, 400, 900, .12, '#ffc477', '#fff1cf', 'screen');
};

// ============================================================ 2.10 grandmother opens the door before you knock
// Her kitchen from inside: the door opens onto bright afternoon, you on the threshold; her arms open on "Tuesday".
// The kettle on the stove (right foreground) is already steaming -> its steam carries us to the table (b).
function buildKitchen() {
  const LW = 2100, LH = 1240;
  const [c, g] = L(LW, LH);
  g.fillStyle = vgrad(g, 0, 0, LW, 0, [[0, '#7a4a46'], [.5, '#9a5e52'], [1, '#6a3a40']]); g.fillRect(0, 0, LW, LH);
  { const [c2, g2] = L(LW, LH); const n = vnoise(27), d = g2.createImageData(LW / 4, LH / 4);
    for (let y = 0; y < LH / 4; y++) for (let x = 0; x < LW / 4; x++) { const v = fbm(n, x * .02, y * .02, 4), i = (y * LW / 4 + x) * 4; d.data[i] = 255; d.data[i + 1] = 214; d.data[i + 2] = 170; d.data[i + 3] = 255 * clamp((v - .42) * .5); }
    g2.putImageData(d, 0, 0); const [c3, g3] = L(LW, LH); g3.drawImage(c2, 0, 0, LW, LH); stipple(c3, { k: .5, seed: 28 }); put(g, c3, 'soft-light'); }
  // tiles behind the stove (right), shelf with jars and cups (left), a clock-free wall: a framed photo
  for (let y = 560; y < 900; y += 34) for (let x = 1440; x < 2100; x += 34) { roughRect(g, x, y, 32, 32, (x + y) % 68 ? '#e6d2b8' : '#d9c0a4', { amp: .3, seed: x * y }); }
  roughRect(g, 120, 380, 420, 14, '#4a2a22', { amp: .6, seed: 29 });
  { const r = prng(30); for (let k = 0; k < 7; k++) { const x = 140 + k * 56, h = 40 + r() * 40; roughRect(g, x, 380 - h, 40, h, ['#e8a3a0', '#e9c28c', '#7a8a5a', '#c4482a', '#f3efe2', '#5d7fa0', '#d9a35a'][k], { amp: .5, seed: k }); } }
  roughRect(g, 200, 160, 140, 170, '#3a2018', { amp: .6, seed: 31 }); roughRect(g, 214, 174, 112, 142, '#d9b88a', { amp: .4, seed: 32 }); g.fillStyle = '#8a6a5a'; g.beginPath(); g.arc(270, 230, 26, 0, 7); g.fill(); g.fillRect(244, 258, 52, 58);
  // floor
  roughPoly(g, [[-20, 960], [LW + 20, 940], [LW + 20, LH], [-20, LH]], '#5a3430', { amp: 1, seed: 33 });
  g.strokeStyle = rgba('#2a1418', .45); for (let k = 0; k < 14; k++) { g.beginPath(); g.moveTo(-20 + k * 170, LH); g.lineTo(600 + k * 70, 950); g.stroke(); }
  return c;
}
function buildS10() {
  const LW = 2100, LH = 1240, back = buildKitchen();
  const [c, g] = L(LW, LH); g.drawImage(back, 0, 0);
  // the doorway (centre-left): outside is bright afternoon street
  const D = { x: 700, y: 260, w: 330, h: 700 };
  g.fillStyle = vgrad(g, 0, D.y, 0, D.y + D.h, [[0, '#ffe8bc'], [.7, '#ffd59a'], [1, '#e9b07a']]); g.fillRect(D.x, D.y, D.w, D.h);
  { const r = prng(41); for (let k = 0; k < 4; k++) { const x = D.x - 40 + k * 110, h = 360 + r() * 160; g.fillStyle = rgba('#e0a888', .7); g.fillRect(x, D.y + D.h - 160 - h, 100, h); } g.fillStyle = rgba('#e9b07a', .9); g.fillRect(D.x, D.y + D.h - 160, D.w, 160); }
  bloomL(g, D.x + D.w / 2, D.y + D.h * .45, 520, { col: '#ffc477', core: '#fff8e6', a: .55, k: .4, seed: 42, op: 'screen' });
  roughRect(g, D.x - 30, D.y - 30, 30, D.h + 30, '#4a2a22', { amp: .6, seed: 43 }); roughRect(g, D.x + D.w, D.y - 30, 30, D.h + 30, '#4a2a22', { amp: .6, seed: 44 }); roughRect(g, D.x - 30, D.y - 40, D.w + 60, 30, '#4a2a22', { amp: .6, seed: 45 });
  // the light pouring in across the floor from the door
  { const [lc, lx] = L(LW, LH); lx.fillStyle = vgrad(lx, 0, 960, 0, 1240, [[0, rgba('#ffd59a', .8)], [1, rgba('#ffd59a', .25)]]); lx.beginPath(); lx.moveTo(D.x, 960); lx.lineTo(D.x + D.w, 955); lx.lineTo(D.x + D.w + 420, 1260); lx.lineTo(D.x - 260, 1260); lx.closePath(); lx.fill(); const sl = soft(lc, 8); stipple(sl, { k: .7, seed: 46 }); put(g, sl, 'screen'); }
  coneL(g, D.x + D.w / 2, D.y + 200, { dir: .25, spread: .35, len: 1100, col: '#ffd59a', a: .2, k: .6, seed: 47, op: 'screen', soft: .5 });
  // stove (right foreground layer)
  const [sc, sx] = L(LW, LH);
  roughPoly(sx, [[1420, 1240], [1440, 860], [2120, 840], [2120, 1240]], '#e6dccc', { amp: 1.5, seed: 48 });
  sx.save(); sx.beginPath(); roughPath(sx, [[1420, 1240], [1440, 860], [2120, 840], [2120, 1240]], { amp: 1.5, seed: 48 }); sx.clip(); sx.fillStyle = vgrad(sx, 1420, 0, 2120, 0, [[0, rgba('#ffe2a8', .3)], [1, rgba('#3a2028', .45)]]); sx.fillRect(1400, 820, 760, 440); roughRect(sx, 1520, 960, 460, 220, '#2a1a1e', { amp: 1, seed: 49 }); sx.fillStyle = rgba('#ffc477', .25); sx.fillRect(1530, 970, 440, 6); sx.restore();
  roughPoly(sx, [[1430, 870], [2120, 850], [2120, 830], [1440, 850]], '#3a2a2a', { amp: .6, seed: 50 });
  // kettle
  roughPoly(sx, [[1640, 846], [1600, 760], [1630, 690], [1760, 690], [1790, 760], [1750, 846]], '#c4482a', { amp: 1, seed: 51 });
  sx.fillStyle = rgba('#ffe2a8', .55); sx.beginPath(); sx.ellipse(1640, 740, 14, 40, .2, 0, 7); sx.fill();
  roughPoly(sx, [[1600, 760], [1520, 700], [1510, 690], [1528, 690], [1610, 735]], '#c4482a', { amp: .6, seed: 52 });
  sx.strokeStyle = '#2a1a1a'; sx.lineWidth = 9; sx.beginPath(); sx.moveTo(1640, 690); sx.quadraticCurveTo(1695, 600, 1750, 690); sx.stroke();
  return { room: c, stove: sc, D };
}
function steam(c, x, y, t, n, h, a, seed, drift2 = 0) {
  const r = prng(seed); c.save(); c.globalCompositeOperation = 'screen';
  for (let i = 0; i < n; i++) { const ph = r(), age = ((t * .5 + ph) % 1), sz = 16 + age * 60 * (h / 400), px = x + Math.sin(age * 6 + i) * 24 * age + drift2 * age * age, py = y - age * h;
    const g = c.createRadialGradient(px, py, 0, px, py, sz); g.addColorStop(0, rgba('#fff8ec', a * Math.sin(age * Math.PI) * .6)); g.addColorStop(1, rgba('#fff8ec', 0)); c.fillStyle = g; c.beginPath(); c.arc(px, py, sz, 0, 7); c.fill(); }
  c.restore();
}
export function s10SteamScreen(R, t) { const cam = s10cam(R, t), m = layerXf({ c: { width: 2100, height: 1240 }, p: 1.15 }, cam); return { x: m.X(1520), y: m.Y(560) }; }
function s10cam(R, t) { const push = lin(R.t0, R.t1, t), fin = eio(lin(R.t1 - .6, R.t1 + .3, t)); return { x: -40 + 30 * push + 180 * fin + drift(t, 6, 19), y: -20 * push - 60 * fin + drift(t, 4, 20), z: 1.05 + .05 * push + .1 * fin }; }
export const grandmaDoor = (R) => (ctx, t, s) => {
  const P = cached('s210', buildS10);
  const cam = s10cam(R, t), D = P.D;
  drawLayer(ctx, { c: P.room, p: .85 }, cam, (c) => {
    // door leaf swings open toward the room (hinge on the left jamb); you on the threshold, backlit
    const op = eoutq(lin(R.tOpen, R.tOpen + .7, t)), ang = op * 1.35;
    const youA = sm(lin(R.tOpen + .05, R.tOpen + .5, t)), tq0 = 0;
    if (youA > 0) { c.save(); c.globalAlpha = youA; figure(c, D.x + D.w * .5, D.y + D.h - 88 * 3.1 - 20, 3.1, { lean: .02, head: -.05, sh: [.3, -.1], el: [.4, .3], hair: 'short' }, { dress: { ...YOU, coat: '#b06a2a', pants: '#1a1422' }, shadeA: .45, shadeCol: '#3a1a10', rim: '#fff1cf', rimSide: 1, rimW: 4 }); c.restore(); }
    // the leaf: a quad narrowing as it turns toward us
    const w = D.w * Math.cos(ang), bulge = D.w * Math.sin(ang) * .18;
    const q = [[D.x, D.y], [D.x + w, D.y - bulge], [D.x + w, D.y + D.h + bulge], [D.x, D.y + D.h]];
    roughPoly(c, q, mixHex('#2f5560', '#1a2a30', op * .6), { amp: .8, seed: 61 });
    const m = quadMap(q); roughPoly(c, quadIn(m, .12, .08, .88, .45), rgba('#000', .15), { amp: .4, seed: 62 }); roughPoly(c, quadIn(m, .12, .55, .88, .92), rgba('#000', .15), { amp: .4, seed: 63 });
    c.fillStyle = '#d9a35a'; const kn = m(.85, .52); c.beginPath(); c.arc(kn[0], kn[1], 8, 0, 7); c.fill();
    // grandmother beside the door: she pulls it, then turns and opens her arms on "Tuesday"
    const tq = Math.round(t * 15) / 15, arms = back(lin(R.tTue - .35, R.tTue + .3, tq), 1.3), br = Math.sin(tq * 1.6) * .015;
    figure(c, D.x - 150, 960 - 88 * 3.0, 3.0, { lean: .05 + br, head: .1 - .12 * clamp(arms), sh: [mix(1.25, 1.9, clamp(arms)) + (arms > 1 ? (arms - 1) * .3 : 0), mix(.4, 1.6, clamp(arms))], el: [mix(.3, -.3, clamp(arms)), mix(.4, -.2, clamp(arms))], hair: 'bun', skirt: true, coat: .3, bulk: 1.12 },
      { dress: GRAN, light: { x: D.x + D.w / 2, y: D.y + 300, col: '#ffe2a8', a: .65 }, shadeA: .15, shadeCol: '#2a1020', rim: '#ffe8c0', rimSide: 1, rimW: 3 });
  });
  drawLayer(ctx, { c: P.stove, p: 1.15 }, cam, (c) => steam(c, 1515, 690, t, 22, 300 + 300 * lin(R.t1 - 1, R.t1, t), .5 + .4 * lin(R.t1 - 1, R.t1, t), 7, -40));
  glowLive(ctx, 860 - cam.x * .85, 560, 700, .15 + .04 * Math.sin(t * .9), '#ffc477', '#fff1cf', 'screen');
};

// ============================================================ 2.11 "Just because." — two cups in the afternoon light, she pours
// The open window is centred above the table; the steam curls out of it; at the end the camera begins to rise toward
// the window (continuous), handing over to the hill builder's crane out onto the street.
const KW = { x: 780, y: 120, w: 540, h: 470 };
function buildS11() {
  const LW = 2100, LH = 1300, back = buildKitchen();
  const [c, g] = L(LW, LH); g.drawImage(back, 0, 0);
  // the window: open casements, the street outside in afternoon sun
  g.fillStyle = vgrad(g, 0, KW.y, 0, KW.y + KW.h, [[0, '#f7d8b0'], [.5, '#ffe2a8'], [1, '#e9b07a']]); g.fillRect(KW.x, KW.y, KW.w, KW.h);
  { const r = prng(71); for (let k = 0; k < 5; k++) { const x = KW.x - 30 + k * 120, h = 220 + r() * 160, col = ['#e2b48e', '#d98e86', '#e9c48a', '#cf9f7a', '#e6cfa4'][k]; g.fillStyle = col; g.fillRect(x, KW.y + KW.h - h + 40, 110, h); for (let j = 0; j < 3; j++) { g.fillStyle = shade(col, -.25); g.fillRect(x + 20, KW.y + KW.h - h + 70 + j * 60, 22, 34); g.fillRect(x + 64, KW.y + KW.h - h + 70 + j * 60, 22, 34); } } }
  bloomL(g, KW.x + KW.w * .65, KW.y + 120, 380, { col: '#ffc477', core: '#fff8e6', a: .5, k: .4, seed: 72, op: 'screen' });
  roughRect(g, KW.x - 24, KW.y - 24, KW.w + 48, 24, '#f0e2cc', { amp: .6, seed: 73 }); roughRect(g, KW.x - 24, KW.y, 24, KW.h, '#f0e2cc', { amp: .6, seed: 74 }); roughRect(g, KW.x + KW.w, KW.y, 24, KW.h, '#f0e2cc', { amp: .6, seed: 75 }); roughRect(g, KW.x - 40, KW.y + KW.h, KW.w + 80, 26, '#f0e2cc', { amp: .6, seed: 76 });
  // casements opened inward at an angle
  for (const sd of [-1, 1]) { const hx = sd < 0 ? KW.x : KW.x + KW.w, q = [[hx, KW.y], [hx - sd * 150, KW.y + 30], [hx - sd * 150, KW.y + KW.h + 30], [hx, KW.y + KW.h]]; roughPoly(g, q, '#e8dcc8', { amp: .5, seed: 77 + sd }); const m = quadMap(q); roughPoly(g, quadIn(m, .15, .06, .85, .48), rgba('#b8c8d0', .7), { amp: .3, seed: 79 + sd }); roughPoly(g, quadIn(m, .15, .54, .85, .94), rgba('#b8c8d0', .7), { amp: .3, seed: 81 + sd }); }
  // geranium pot on the sill
  roughPoly(g, [[KW.x + 400, KW.y + KW.h], [KW.x + 408, KW.y + KW.h - 50], [KW.x + 470, KW.y + KW.h - 50], [KW.x + 478, KW.y + KW.h]], '#b8603a', { amp: .5, seed: 83 });
  for (let k = 0; k < 7; k++) { g.fillStyle = k % 2 ? '#4f7a3a' : '#e85a6a'; g.beginPath(); g.arc(KW.x + 410 + (k * 17) % 70, KW.y + KW.h - 70 - (k * 13) % 40, 14, 0, 7); g.fill(); }
  // the beam from the window across the room, onto the table
  coneL(g, KW.x + KW.w * .5, KW.y + KW.h * .3, { dir: -.05, spread: .3, len: 1000, col: '#ffd59a', a: .22, k: .6, seed: 84, op: 'screen', soft: .6 });
  // table (foreground band): cloth with the stripe of afternoon light across it
  const [tc, tx] = L(LW, LH);
  roughPoly(tx, [[260, 860], [1840, 860], [1940, 1000], [160, 1000]], '#d98e86', { amp: 1.5, seed: 85 });
  roughPoly(tx, [[160, 1000], [1940, 1000], [1950, 1150], [150, 1150]], '#b8606a', { amp: 1.5, seed: 86 });
  tx.save(); tx.beginPath(); roughPath(tx, [[160, 1000], [1940, 1000], [1950, 1150], [150, 1150]], { amp: 1.5, seed: 86 }); tx.clip(); for (let k = 0; k < 30; k++) { tx.strokeStyle = rgba('#7a3040', .4); tx.lineWidth = 2; tx.beginPath(); tx.moveTo(170 + k * 62, 1000); tx.quadraticCurveTo(170 + k * 62 + 10, 1080, 160 + k * 62, 1150); tx.stroke(); } tx.restore();
  tx.save(); tx.beginPath(); roughPath(tx, [[260, 860], [1840, 860], [1940, 1000], [160, 1000]], { amp: 1.5, seed: 85 }); tx.clip(); hatch(tx, [160, 860, 1800, 140], { angle: 0, gap: 12, col: '#fff1cf', a: .2, seed: 87 }); hatch(tx, [160, 860, 1800, 140], { angle: 1.5, gap: 12, col: '#fff1cf', a: .15, seed: 88 }); tx.restore();
  // the afternoon light lying across the table: a stippled band (the morning stripe, now afternoon)
  { const [lc, lx] = L(LW, LH); lx.fillStyle = rgba('#ffe2a8', .6); lx.beginPath(); lx.moveTo(760, 860); lx.lineTo(1340, 860); lx.lineTo(1420, 1000); lx.lineTo(700, 1000); lx.closePath(); lx.fill(); lx.fillRect(700, 1000, 720, 150); const sl = soft(lc, 14); stipple(sl, { k: .45, seed: 89 }); put(tx, sl, 'screen'); }
  roughPoly(tx, [[150, 1150], [1950, 1150], [1950, 1300], [150, 1300]], '#2a1418', { amp: 1, seed: 90 });
  return { room: c, table: tc };
}
function cup(c, x, y, k = 1, t = 0) {
  c.save(); c.translate(x, y); c.scale(k, k);
  c.fillStyle = rgba('#3a1a20', .35); c.beginPath(); c.ellipse(6, 4, 70, 12, 0, 0, 7); c.fill();
  c.fillStyle = '#f3efe2'; c.beginPath(); c.ellipse(0, 0, 66, 12, 0, 0, 7); c.fill();   // saucer
  c.beginPath(); c.moveTo(-42, -62); c.quadraticCurveTo(-40, -6, 0, -4); c.quadraticCurveTo(40, -6, 42, -62); c.closePath(); c.fill();
  c.strokeStyle = '#f3efe2'; c.lineWidth = 7; c.beginPath(); c.ellipse(50, -40, 14, 16, 0, -1.6, 1.6); c.stroke();
  c.fillStyle = '#8a4a2a'; c.beginPath(); c.ellipse(0, -60, 40, 8, 0, 0, 7); c.fill();
  c.fillStyle = rgba('#ffc477', .5); c.beginPath(); c.ellipse(-8, -61, 18, 3, 0, 0, 7); c.fill();
  c.fillStyle = '#c97a8a'; c.fillRect(-40, -44, 80, 6);
  c.fillStyle = vgrad(c, -42, 0, 42, 0, [[0, rgba('#5a2a30', .3)], [.5, rgba('#fff', 0)], [1, rgba('#ffe2a8', .3)]]); c.fillRect(-42, -62, 84, 58);
  c.restore();
}
function teapot(c, x, y, ang) {
  c.save(); c.translate(x, y); c.rotate(ang);
  roughPoly(c, ell(0, 0, 70, 54, 28), '#f3efe2', { amp: 1, seed: 3 });
  c.fillStyle = '#5d7fa0'; c.fillRect(-60, -8, 120, 10);
  roughPoly(c, [[56, -10], [120, -46], [128, -42], [66, 10]], '#f3efe2', { amp: .5, seed: 4 });
  c.strokeStyle = '#f3efe2'; c.lineWidth = 10; c.beginPath(); c.ellipse(-70, 0, 26, 30, 0, 1.6, 4.7); c.stroke();
  c.fillStyle = '#f3efe2'; c.beginPath(); c.ellipse(0, -52, 30, 9, 0, 0, 7); c.fill(); c.beginPath(); c.arc(0, -62, 8, 0, 7); c.fill();
  c.fillStyle = vgrad(c, -70, 0, 70, 0, [[0, rgba('#4a2030', .35)], [1, rgba('#ffe2a8', .35)]]); c.beginPath(); c.ellipse(0, 0, 70, 54, 0, 0, 7); c.fill();
  c.restore();
  return [x + Math.cos(ang) * 124 - Math.sin(ang) * -44, y + Math.sin(ang) * 124 + Math.cos(ang) * -44];
}
export function s11cam(R, t) {
  const rise = ein(lin(R.tRise, R.tRise + 1.4, t)) * 1.4 + Math.max(0, t - R.tRise - 1.4) * 1.6;   // keeps accelerating gently past the cut
  return { x: drift(t, 5, 21) * (1 - clamp(rise)), y: -10 - 430 * rise + drift(t, 4, 22), z: 1.04 + .03 * lin(R.t0, R.tRise, t) + .55 * rise };
}
export const twoCups = (R) => (ctx, t, s) => {
  const P = cached('s211', buildS11);
  const cam = s11cam(R, t);
  drawLayer(ctx, { c: P.room, p: .85, cx: 1050, cy: 620 }, cam, (c) => {
    // the street beyond the window lives: a swallow crosses, light breathes
    const sx = KW.x + ((t * 160) % 900) - 150; c.save(); c.beginPath(); c.rect(KW.x, KW.y, KW.w, KW.h); c.clip(); c.strokeStyle = '#3a2a3a'; c.lineWidth = 3; const f = Math.sin(t * 14); c.beginPath(); c.moveTo(sx - 14, KW.y + 160 - 5 * f); c.quadraticCurveTo(sx - 5, KW.y + 152 - 6 * f, sx, KW.y + 160); c.quadraticCurveTo(sx + 5, KW.y + 152 - 6 * f, sx + 14, KW.y + 160 - 5 * f); c.stroke(); c.restore();
    glowLive(c, KW.x + KW.w * .6, KW.y + 160, 420, .14 + .04 * Math.sin(t * 1.1), '#ffc477', '#fff8e6', 'screen');
    // grandmother (left) pouring, you (right) seated, both at the table
    const tq = Math.round(t * 15) / 15, br = Math.sin(tq * 1.5) * .012;
    const g = figure(c, 560, 830, 3.4, { lean: .22 + br, head: .3, sh: [1.45, 1.25], el: [.35, .55], hair: 'bun', skirt: true, bulk: 1.12 },
      { dress: GRAN, light: { x: 1050, y: 300, col: '#ffe2a8', a: .6 }, shadeA: .12, shadeCol: '#2a1020', rim: '#ffe8c0', rimSide: 1, rimW: 3 });
    const tilt = mix(.25, .62, sm(lin(R.t0 - .2, R.t0 + .5, t))) + .03 * Math.sin(t * 2);
    const [hx, hy] = g.hand(0);
    const sp = teapot(c, hx + 40, hy + 10, tilt);
    // the stream into her cup (left cup), a thin amber arc
    const cupL = [880, 930], cupR = [1240, 930];
    c.strokeStyle = rgba('#b8682a', .9); c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(sp[0], sp[1]); c.quadraticCurveTo(sp[0] + 40, sp[1] + 30, cupL[0] + 4, cupL[1] - 62); c.stroke();
    c.strokeStyle = rgba('#ffe2a8', .7); c.lineWidth = 2; c.beginPath(); c.moveTo(sp[0] + 2, sp[1]); c.quadraticCurveTo(sp[0] + 42, sp[1] + 28, cupL[0] + 6, cupL[1] - 62); c.stroke();
    figure(c, 1560, 860, 3.3, { lean: -.06 + br, head: -.12 + .06 * Math.sin(tq * .8), sh: [.75, .55], el: [.95, 1.0], hip: [1.45, 1.4], kn: [1.4, 1.4], hair: 'short' },
      { flip: true, dress: YOU, light: { x: 1050, y: 300, col: '#ffe2a8', a: .6 }, shadeA: .14, shadeCol: '#2a1020', rim: '#fff1cf', rimSide: 1, rimW: 3 });
  });
  drawLayer(ctx, { c: P.table, p: 1.0, cx: 1050, cy: 620 }, cam, (c) => {
    cup(c, 880, 930, 1.05, t); cup(c, 1240, 930, 1.05, t);
    // the spoon in your cup turns on "because"
    const sp = sm(lin(R.tBecause - .1, R.tBecause + .7, t)), a = sp * Math.PI * 4 + .4;
    c.save(); c.translate(1240, 868); c.strokeStyle = '#c9c4bc'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(Math.cos(a) * 18, Math.sin(a) * 4); c.lineTo(Math.cos(a) * 18 + 30, -70 + Math.sin(a) * 6); c.stroke(); c.strokeStyle = rgba('#fff', .7); c.lineWidth = 2; c.beginPath(); c.moveTo(Math.cos(a) * 18 + 2, Math.sin(a) * 4 - 2); c.lineTo(Math.cos(a) * 18 + 31, -71 + Math.sin(a) * 6); c.stroke(); c.restore();
    // a plate of biscuits
    c.fillStyle = '#f3efe2'; c.beginPath(); c.ellipse(1060, 960, 70, 14, 0, 0, 7); c.fill(); for (let k = 0; k < 4; k++) { c.fillStyle = '#d9a35a'; c.beginPath(); c.ellipse(1030 + k * 20, 950 - (k % 2) * 6, 16, 7, 0, 0, 7); c.fill(); }
    // steam from both cups curling up and out of the window
    const out = (cx) => { const r = prng(cx); c.save(); c.globalCompositeOperation = 'screen';
      for (let i = 0; i < 18; i++) { const ph = r(), age = (t * .32 + ph) % 1, q = age;
        const px = mix(cx, 1050, sm(q)) + Math.sin(q * 9 + i) * 26 * q, py = mix(860, KW.y + 140, q) - Math.max(0, q - .85) * 300, sz = 10 + q * 46;
        const a = .55 * Math.sin(Math.PI * Math.min(1, q * 1.15)); const gg = c.createRadialGradient(px, py, 0, px, py, sz); gg.addColorStop(0, rgba('#fff8ec', a)); gg.addColorStop(1, rgba('#fff8ec', 0)); c.fillStyle = gg; c.beginPath(); c.arc(px, py, sz, 0, 7); c.fill(); }
      c.restore(); };
    out(880); out(1240);
  });
  glowLive(ctx, W / 2, 200 - cam.y * .3, 900, .1, '#ffc477', '#fff1cf', 'screen');
};
