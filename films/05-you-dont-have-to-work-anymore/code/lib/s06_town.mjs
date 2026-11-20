// s06_town.mjs · chapter 06, the town (6.10–6.11, 6.15–6.16).
// ST the street at dusk: council poster, then down the road to the shelter gate · SQ the square, lanterns on the
// empty plinth · CR the grey shop, the cash drawer slides shut
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, lin, sm, eio, eout, ein, sine, drift, lay, big, spr, bloomL, poolL, coneL, fogL, vgrad, radial, glowAt, fig, drawFig, figAnim, lerpPose, stage, camAt, paper, vignetteL, tintAll } from './s06_kit.mjs';
import { stipple, roughPath, roughPoly, roughRect, roughLine, hatch, vnoise, fbm, castShadow, maskLinear, house, stratus } from './art.mjs';
import { text } from '../engine.mjs';

const AMB = '#ffb35c', HOT = '#ffd59a';
// walk cycle pose (phase 0..1)
export const walkPose = (hair, extra = {}) => (q) => { const a = Math.sin(q * 6.283); return { lean: .05, head: .05, sh: [-.35 * a + .1, .35 * a + .1], el: [.35, .35], hip: [.38 * a, -.38 * a], kn: [.05 + Math.max(0, -a) * .6, .05 + Math.max(0, a) * .6], hair, ...extra }; };

// ================================================================ ST · the street at dusk
const GY = 770;                // ground line of the houses
const ST_W = 3840;
const POST = [760, GY + 40];   // lamp post foot (front of the sidewalk)
const GATE = [2860, GY + 6];   // shelter gate (hinge left)
function stSky() {
  return big('s06:stsky', () => {
    const [c, g] = lay(2900, H);
    vgrad(g, 0, 0, 2900, 700, [[0, '#1c1a44'], [.45, '#5a3a62'], [.8, '#d0786a'], [1, '#f2a870']]);
    radial(g, 1700, 690, 900, [[0, rgba('#ffd09a', .5)], [1, rgba('#ffd09a', 0)]], { sy: .5 });
    { const [hc, hx] = lay(2900, H); hx.save(); hx.beginPath(); for (const [y, x0, x1, th] of [[220, 300, 1500, 18], [300, 1100, 2600, 14], [160, 1800, 2900, 16]]) stratus(hx, y, x0, x1, th, y); hx.fillStyle = rgba('#e88a78', .45); hx.fill(); hx.clip(); hatch(hx, [0, 120, 2900, 220], { angle: -.015, gap: 4, col: '#ffcfa8', a: .5, seed: 3, broken: .3 }); hx.restore(); g.drawImage(hc, 0, 0); }
    // far hills + the river valley glimpsed between houses
    const n = vnoise(4); g.fillStyle = '#5a4a72'; g.beginPath(); g.moveTo(0, 720); for (let x = 0; x <= 2900; x += 10) g.lineTo(x, 600 - 60 * fbm(n, x * .002, 1, 4)); g.lineTo(2900, 720); g.fill();
    fogL(g, { x0: 0, x1: 2900, y0: 520, y1: 700, col: '#e8a88a', a: .45, seed: 5, cover: .7, soft: .5, k: .25, sx: .003, sy: .03 });
    return c;
  });
}
function stPlate() {
  return big('s06:st', () => {
    const [c, g] = lay(ST_W, H), r = prng(17);
    // houses: one continuous village row, gaps for gardens; warm dusk light on the right faces
    let x = -40;
    while (x < ST_W + 40) {
      const w = 150 + r() * 170, h = 190 + r() * 210;
      if (x > 2560 && x < 3160) { x = 3160; continue; }      // the shelter yard sits in a gap
      if (r() < .18) { x += 60 + r() * 80; continue; }
      house(g, r, x + w / 2, GY, w, h, { wall: mixHex('#4a3450', '#6a4858', r()), roofCol: mixHex('#2e2240', '#3a2438', r()), lit: (a, b, q) => q() < .38 ? .75 + q() * .25 : 0, winOff: '#2a1e34', amp: 1.2, floorH: 62, colW: 54, wscale: 1.4, chimney: .6, light: { x: x + w * 1.4, y: GY - h, col: '#ff9a6a', a: .25, r: 420 }, roofs: ['gable', 'gable', 'steep', 'hip', 'parapet', 'mansard'] });
      x += w + 6 + r() * 20;
    }
    // shelter yard: back fence, kennel, a little tree, the hand-painted sign
    { const [gx] = GATE; roughRect(g, 2580, GY - 120, 580, 120, '#3a2c3a', { amp: 1, seed: 3 });
      for (let k = 0; k < 30; k++) roughRect(g, 2584 + k * 19.2, GY - 126 + (k % 3) * 2, 14, 126, mixHex('#4a3846', '#5a4250', (k * 37 % 10) / 10), { amp: .5, seed: k });
      roughPoly(g, [[2990, GY - 10], [3110, GY - 10], [3110, GY - 70], [3050, GY - 110], [2990, GY - 70]], '#7a4a32', { amp: .8, seed: 4 }); roughPoly(g, [[3030, GY - 10], [3070, GY - 10], [3070, GY - 50], [3050, GY - 62], [3030, GY - 50]], '#1a1018', { amp: .5, seed: 5 });
      roughRect(g, 2620, GY - 210, 260, 74, '#e8dcc0', { amp: 1, seed: 6 }); roughLine(g, [[2640, GY - 136], [2640, GY - 90]], { w: 5, col: '#2a1a1a', seed: 7 }); roughLine(g, [[2860, GY - 136], [2860, GY - 90]], { w: 5, col: '#2a1a1a', seed: 8 });
      text(g, 'ANIMAL SHELTER', 2750, GY - 176, { size: 28, font: 'Instrument Serif', color: '#7a2a1a', align: 'center' });
      text(g, 'WELCOME, EVERYONE', 2750, GY - 148, { size: 13, weight: 600, color: '#3a2a2a', align: 'center', spacing: 4 });
      // paw prints painted on the sign corners
      for (const [px, py] of [[2640, GY - 196], [2860, GY - 158]]) { g.fillStyle = '#c4482a'; g.beginPath(); g.ellipse(px, py, 6, 5, 0, 0, 7); g.fill(); for (let k = 0; k < 3; k++) { g.beginPath(); g.arc(px - 6 + k * 6, py - 8, 2.4, 0, 7); g.fill(); } }
      void gx; }
    // sidewalk + kerb + road (perspective-free stage, hatched)
    roughRect(g, -20, GY, ST_W + 40, 70, '#3a2c3c', { amp: 1, seed: 9 });
    vgrad(g, 0, GY, ST_W, 70, [[0, rgba('#ffb08a', .18)], [1, 'rgba(0,0,0,.2)']]);
    for (let xx = 0; xx < ST_W; xx += 90) { g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(xx, GY, 2, 70); }
    roughRect(g, -20, GY + 68, ST_W + 40, 12, '#8a7078', { amp: .8, seed: 10 });
    roughRect(g, -20, GY + 80, ST_W + 40, 300, '#241c2c', { amp: 1, seed: 11 });
    g.save(); g.beginPath(); g.rect(0, GY + 80, ST_W, 300); g.clip(); hatch(g, [0, GY + 80, ST_W, 300], { angle: -.03, gap: 7, col: '#9a7a8a', a: .12, seed: 12, broken: .5 }); g.restore();
    // more lamp posts down the road
    for (const lx of [1900, 3500]) { roughLine(g, [[lx, GY + 40], [lx, GY - 300]], { w: 7, col: '#120c18', seed: lx }); roughLine(g, [[lx, GY - 300], [lx + 40, GY - 306]], { w: 5, col: '#120c18', seed: lx + 1 }); }
    return c;
  });
}
function stLights() {
  return big('s06:stlights', () => {
    const [c, g] = lay(ST_W, H);
    for (const [lx, a] of [[POST[0], .5], [1900, .38], [3500, .38]]) { coneL(g, lx + 34, GY - 300 + (lx === POST[0] ? -8 : 0), { spread: .42, len: 420, col: '#ffd59a', a: a * .6, k: .5, seed: lx, soft: .4 }); poolL(g, lx + 30, GY + 60, 280, 50, { col: '#ffc98a', a, k: .5, seed: lx + 3 }); glowAt(g, lx + 38, GY - 302, 60, .9, AMB, '#fff6e0'); }
    poolL(g, 2880, GY + 30, 320, 60, { col: '#ffc98a', a: .3, k: .5, seed: 41 });
    return c;
  });
}
// a three-legged dog (side view, facing +x), limping gait; s = scale (1 ≈ 90 px long)
function dog(ctx, x, y, s, ph, { lift = 0 } = {}) {
  const limp = Math.abs(Math.sin(ph * Math.PI)) * 5 * s, bob = -limp;
  ctx.save(); ctx.translate(x, y + bob); ctx.scale(s, s);
  const fur = '#c89a62', dark = '#8a6038';
  const leg = (lx, a, len = 30) => { ctx.strokeStyle = dark; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(lx, -30); ctx.lineTo(lx + Math.sin(a) * len * .5, -30 + len * .5); ctx.lineTo(lx + Math.sin(a) * len * .9, 0); ctx.stroke(); };
  if (!lift) { leg(-30, Math.sin(ph * 6.283) * .4); leg(-22, -Math.sin(ph * 6.283) * .4); leg(26, Math.sin(ph * 6.283 + 1) * .5); }
  else { leg(-30, .9, 26); leg(-22, .6, 26); leg(26, -.6, 24); }
  ctx.fillStyle = fur; ctx.beginPath(); ctx.ellipse(0, -40, 42, 18, -.05, 0, 7); ctx.fill();
  ctx.fillStyle = dark; ctx.beginPath(); ctx.ellipse(-4, -30, 36, 8, 0, 0, Math.PI); ctx.fill();
  // stump of the missing front leg
  ctx.fillStyle = fur; ctx.beginPath(); ctx.ellipse(32, -28, 6, 7, 0, 0, 7); ctx.fill();
  // head, ear, snout; tail wagging
  ctx.save(); ctx.translate(40, -54); ctx.rotate(-.15 + Math.sin(ph * 6.283) * .05);
  ctx.fillStyle = fur; ctx.beginPath(); ctx.ellipse(6, 0, 17, 14, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(22, 6, 11, 7, .2, 0, 7); ctx.fill();
  ctx.fillStyle = '#2a1a10'; ctx.beginPath(); ctx.arc(32, 5, 3, 0, 7); ctx.fill();
  ctx.fillStyle = dark; ctx.beginPath(); ctx.ellipse(-2, 2, 7, 15, .35, 0, 7); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = fur; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-40, -46); ctx.quadraticCurveTo(-58, -60 + Math.sin(ph * 25) * 6, -62, -78 + Math.sin(ph * 25) * 10); ctx.stroke();
  ctx.fillStyle = rgba('#ffe0b0', .35); ctx.beginPath(); ctx.ellipse(6, -52, 30, 5, -.05, 0, 7); ctx.fill();
  ctx.restore();
}
const stCam = (t, A) => { const u = eio(lin(A.someone - .75, A.shelter - .1, t)); return { x: mix(860, 2840, u) + drift(t, 6, 1), y: 640 + drift(t, 4, 2), z: 1.45 }; };
export function street(ctx, t, s, A) {
  const cam = stCam(t, A);
  stage(ctx, [
    { c: stSky(), p: .4 },
    { c: stPlate(), p: 1 },
    { p: 1, fn: (g) => {
      // lamp post with the poster
      const [px, py] = POST; roughLine(g, [[px, py], [px, GY - 300]], { w: 9, col: '#120c18', seed: 3 }); roughLine(g, [[px, GY - 300], [px + 44, GY - 308]], { w: 6, col: '#120c18', seed: 4 });
      roughRect(g, px + 30, GY - 312, 22, 12, '#2a2030', { amp: .5, seed: 5 });
      // the poster: hand-made, cream, a hand-drawn portrait and big letters; pinned on "council" (it flutters before)
      const pin = A.council, placed = eout(lin(pin - .55, pin, t));
      const pw = 92, ph2 = 124, pxp = px - pw / 2, pyp = GY - 190 + (1 - placed) * 30;
      g.save(); g.translate(pxp + pw / 2, pyp); g.rotate((1 - placed) * .25 + Math.sin(t * 3) * .02 * (1 - placed) + .03);
      roughRect(g, -pw / 2, 0, pw, ph2, '#efe2c4', { amp: .8, seed: 6 });
      g.fillStyle = '#c4482a'; g.fillRect(-pw / 2 + 10, 10, pw - 20, 6);
      g.fillStyle = '#3a2a40'; g.beginPath(); g.arc(0, 42, 17, 0, 7); g.fill(); g.beginPath(); g.ellipse(0, 74, 25, 14, 0, Math.PI, 0); g.fill();
      text(g, 'Vote Ana', 0, 100, { size: 24, font: 'Instrument Serif', color: '#3a2a40', align: 'center' });
      text(g, 'TOWN COUNCIL', 0, 115, { size: 9, weight: 600, color: '#7a3a2a', align: 'center', spacing: 3 });
      if (placed >= 1) { g.fillStyle = '#c4482a'; g.beginPath(); g.arc(0, 6, 4, 0, 7); g.fill(); }
      g.restore();
      // her: pinning the poster (arms up), then stepping back to look
      const step = eio(lin(pin + .3, pin + 1.2, t));
      const PA = { lean: .08, head: -.25, sh: [2.5, 2.2], el: [.35, .5], hip: [.12, -.12], kn: [.05, .12], hair: 'bun', coat: .8 }, PB = { lean: .02, head: -.1, sh: [.3, .05], el: [.5, .4], hip: [.1, -.08], kn: [.05, .1], hair: 'bun', coat: .8 };
      const push = Math.exp(-Math.pow((t - pin) / .12, 2));
      const F = figAnim('st-ana', 8, step, 1.02, (q) => lerpPose(PA, PB, q), { dress: { coat: '#c4482a', pants: '#2a2030', shoes: '#140c10', skin: '#d9a77e', hair: '#2a1a14' }, light: { dx: 100, dy: -400, col: '#ffd9a0', a: .5 }, rim: '#ffe0b0', rimSide: 1, shadeA: .12 });
      const ax = px - 95 - step * 70 + push * 6;
      castShadow(g, ax, GY + 56, 1.02, px + 40, GY - 300, { a: .35, len: 1.4 });
      drawFig(g, F, ax, GY + 56 - 88 * 1.02, t, { breath: 1.3 });
      // the neighbour walks up and stops to read
      const arrive = A.council + .95, wq = lin(arrive - 2.2, arrive, t);
      const nx = mix(1420, px + 120, eout(wq)), walking = wq < 1;
      const NB = walking ? figAnim('st-nbw', 12, ((t * 1.1) % 1), .98, walkPose('cap', { coat: .6 }), { flip: true, dress: { coat: '#3e6a74', pants: '#222030', shoes: '#100c10', skin: '#c9906a', hair: '#2a2420', hairBack: '#3a3028' }, light: { dx: -100, dy: -400, col: '#ffd9a0', a: .45 }, rim: '#ffe0b0', rimSide: -1 })
        : fig('st-nbs', .98, { lean: -.04, head: -.22, sh: [.2, .1], el: [.9, .5], hip: [.08, -.08], kn: [.05, .1], hair: 'cap', coat: .6 }, { flip: true, dress: { coat: '#3e6a74', pants: '#222030', shoes: '#100c10', skin: '#c9906a', hair: '#2a2420', hairBack: '#3a3028' }, light: { dx: -100, dy: -400, col: '#ffd9a0', a: .45 }, rim: '#ffe0b0', rimSide: -1 });
      drawFig(g, NB, nx, GY + 58 - 88 * .98, t, { breath: 1.2, ph: 2 });
      // --- down the road: the shelter gate, the dog, the one who opens
      const [gx, gy] = GATE, open = eio(lin(A.shelter - .25, A.shelter + .55, t));
      // gate: a wooden panel swinging inward (hinge on the left)
      const gw = 150 * Math.cos(open * 1.25), gh = 110;
      for (let k = 0; k < 7; k++) roughRect(g, gx + k * gw / 7, gy - gh + (k % 2) * 3, gw / 7 - 4 * Math.cos(open), gh, mixHex('#7a5a40', '#8a6a4a', k % 2), { amp: .4, seed: k + 50 });
      roughRect(g, gx, gy - gh + 18, gw, 9, '#5a3e2a', { amp: .3, seed: 60 }); roughRect(g, gx, gy - 30, gw, 9, '#5a3e2a', { amp: .3, seed: 61 });
      roughRect(g, gx - 14, gy - gh - 20, 14, gh + 26, '#3a2a22', { amp: .3, seed: 62 }); roughRect(g, gx + 150, gy - gh - 20, 14, gh + 26, '#3a2a22', { amp: .3, seed: 63 });
      // the dog limps in from the left along the sidewalk
      const dIn = lin(A.shelter - 1.2, A.wanted - .25, t), dx = mix(2380, gx + 70, eout(dIn)), scoop = eio(lin(A.wanted - .35, A.wanted + .3, t));
      const kx = gx + 110, kneel = eio(lin(A.wanted - .9, A.wanted - .35, t)) * (1 - eio(lin(A.wanted + .25, A.wanted + .6, t)));
      // the one who opens: stands in the gateway, then kneels and lifts the dog up into her arms
      const PS = { lean: -.05, head: -.1, sh: [.9, .2], el: [.6, .4], hip: [.08, -.08], kn: [.05, .1], hair: 'curly' }, PK = { lean: .5, head: .3, sh: [1.3, 1.1], el: [.4, .5], hip: [1.2, .5], kn: [2.2, 1.0], hair: 'curly' }, PH = { lean: -.08, head: .2, sh: [1.3, 1.1], el: [1.4, 1.5], hip: [.08, -.08], kn: [.05, .1], hair: 'curly' };
      const hold = eio(lin(A.wanted + .25, A.wanted + .6, t));
      const Fk = figAnim('st-sh', 10, kneel > 0 && hold < .5 ? kneel * .5 : .5 + hold * .5, .98, (q) => q <= .5 ? lerpPose(PS, PK, q * 2) : lerpPose(PK, PH, (q - .5) * 2), { flip: true, dress: { coat: '#e0b040', pants: '#2a3a44', shoes: '#14100c', skin: '#8a5a3a', hair: '#1a1010' }, light: { dx: -200, dy: -300, col: '#ffd9a0', a: .5 }, rim: '#ffe0b0', rimSide: -1 });
      const kneelDrop = kneel * 34;
      drawFig(g, Fk, kx + 20, GY + 50 - 88 * .98 + kneelDrop, t, { breath: 1.3 });
      const [hx, hy] = Fk.hand(0), HX = kx + 20 + hx, HY = GY + 50 - 88 * .98 + kneelDrop + hy;
      if (scoop < 1) dog(g, mix(dx, HX + 10, scoop), mix(GY + 52, HY + 34, scoop) - Math.sin(Math.PI * scoop) * 30, .9, dIn < 1 ? t * 1.6 : t * .3, { lift: scoop > .05 });
      else dog(g, HX + 12, HY + 30 - 6 * Math.sin(t * 3), .9, t * .2, { lift: 1 });
    } },
    { c: stLights(), p: 1, op: 'lighter' },
  ], cam);
  tintAll(ctx, '#ff9a6a', .06, 'soft-light'); vignetteL(ctx, .35, '#0a0614'); paper(ctx, .08, t);
}

// ================================================================ SQ · the square at night: lanterns on the empty plinth
const PL = [960, 760];          // plinth base centre (front step)
const SHOP = [1640, 470, 230, 210];   // dark shop window (x,y,w,h)
const sqCam = (t, a) => ({ x: 960 + drift(t, 6, 1), y: 560 + drift(t, 4, 2), z: mix(1.12, 1.2, sine(lin(a, a + 4, t))) });
export function shopInSq(A) { const t = A.earn - .75, m = camAt(sqCam(t, A.slowly - .4), 1); return [m.X(SHOP[0] + SHOP[2] / 2), m.Y(SHOP[1] + SHOP[3] / 2)]; }
export const SHOP_IN_SQ = [0, 0];
function sqPlate() {
  return big('s06:sq', () => {
    const [c, g] = lay(), r = prng(23);
    vgrad(g, 0, 0, W, 600, [[0, '#060818'], [1, '#18183a']]);
    { const rr = prng(3); for (let i = 0; i < 160; i++) { g.fillStyle = rgba('#d8e4ff', .15 + .5 * rr() * rr()); g.fillRect(rr() * W, rr() * 330, 1.4, 1.4); } }
    // facades around the square (back row), a church gable in the middle
    let x = -40; while (x < W + 40) { const w = 160 + r() * 140, h = 300 + r() * 160; house(g, r, x + w / 2, 640, w, h, { wall: mixHex('#1c1a3a', '#262248', r()), lit: (a, b, q) => q() < .3 ? .85 : 0, amp: 1.2, floorH: 70, colW: 56, wscale: 1.4, chimney: .5, roofs: ['gable', 'parapet', 'mansard', 'hip', 'steep'] }); x += w + 4; }
    house(g, prng(5), 960, 640, 240, 360, { wall: '#22204a', roof: 'tower', lit: () => 0, amp: 1, trim: true, door: false });
    // the dark shop on the right: a cold grey window, nobody inside
    const [sx, sy, sw, sh] = SHOP; roughRect(g, sx - 30, sy - 70, sw + 60, sh + 170, '#1e1e30', { amp: 1, seed: 7 });
    roughRect(g, sx - 20, sy - 56, sw + 40, 34, '#34344a', { amp: .6, seed: 8 }); text(g, 'GOLD & SAVINGS', sx + sw / 2, sy - 33, { size: 15, weight: 600, color: '#8a8aa0', align: 'center', spacing: 4 });
    vgrad(g, sx, sy, sw, sh, [[0, '#3a4050'], [1, '#22252e']]);
    roughRect(g, sx + 60, sy + 120, 110, 60, '#4a4e5a', { amp: .5, seed: 9 }); roughRect(g, sx + 70, sy + 100, 90, 22, '#5a5e6a', { amp: .4, seed: 10 });
    g.strokeStyle = '#141420'; g.lineWidth = 6; g.strokeRect(sx, sy, sw, sh); g.beginPath(); g.moveTo(sx + sw / 2, sy); g.lineTo(sx + sw / 2, sy + sh); g.stroke();
    // cobbles: the square floor with converging joints
    vgrad(g, 0, 640, W, 440, [[0, '#1c1a32'], [1, '#0c0a1c']]);
    const vp = [960, 520];
    g.strokeStyle = '#4a4870'; for (let k = -40; k <= 40; k++) { g.globalAlpha = .12; g.lineWidth = 1; g.beginPath(); g.moveTo(vp[0] + k * 12, 640); g.lineTo(vp[0] + k * 120, H); g.stroke(); }
    for (let k = 0; k < 30; k++) { const y = 640 + Math.pow(k / 30, 1.6) * 440; g.globalAlpha = .12; g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    g.globalAlpha = 1;
    // the plinth: stepped stone block, empty top with bolt holes where a statue stood
    const [px, py] = PL;
    roughRect(g, px - 230, py - 40, 460, 40, '#4a4660', { amp: 1, seed: 11 }); roughRect(g, px - 190, py - 80, 380, 40, '#524e6a', { amp: 1, seed: 12 }); roughRect(g, px - 120, py - 300, 240, 220, '#5a5674', { amp: 1, seed: 13 });
    roughRect(g, px - 140, py - 320, 280, 24, '#625e7c', { amp: .8, seed: 14 });
    g.save(); g.beginPath(); g.rect(px - 230, py - 320, 460, 320); g.clip(); hatch(g, [px - 230, py - 320, 460, 320], { angle: .8, gap: 6, col: '#0a0818', a: .35, seed: 15, broken: .4 }); g.restore();
    roughRect(g, px - 80, py - 230, 160, 60, '#4a4664', { amp: .5, seed: 16 }); g.fillStyle = '#2a2840'; g.fillRect(px - 60, py - 210, 120, 4); g.fillRect(px - 50, py - 196, 100, 4);
    for (const bx of [-40, 40]) { g.fillStyle = '#1a1830'; g.beginPath(); g.arc(px + bx, py - 314, 4, 0, 7); g.fill(); }
    return c;
  });
}
// lantern slots on the plinth (x, y) and the bearers who bring them: [slot, from-x, arrive-time offset, dress]
const SLOTS = [[-40, -330], [40, -330], [-150, -88], [150, -88], [-60, -88], [60, -88], [-200, -48], [200, -48], [-110, -48], [110, -48], [0, -48], [-250, 0], [250, 0]];
const DRESS = [{ coat: '#3e6a74', pants: '#222030', skin: '#c9906a', hair: '#2a1a14' }, { coat: '#7a3a3a', pants: '#2a2a34', skin: '#e9c3a0', hair: '#5a3a20' }, { coat: '#4a5a8a', pants: '#222030', skin: '#8a5a3a', hair: '#1a1010' }, { coat: '#e59a3a', pants: '#2a2c3a', skin: '#e9c3a0', hair: '#3a2214' }, { coat: '#5a6a4a', pants: '#2a2a2a', skin: '#d9a77e', hair: '#d0ccc0' }];
function lantern(g, x, y, s, t, ph = 0) {
  glowAt(g, x, y - 12 * s, 70 * s, .6 + .1 * Math.sin(t * 7 + ph), AMB, '#fff4d8');
  g.fillStyle = '#2a1e1a'; g.fillRect(x - 9 * s, y - 26 * s, 18 * s, 4 * s); g.fillRect(x - 9 * s, y - 2 * s, 18 * s, 3 * s);
  g.fillStyle = rgba('#ffd59a', .95); g.fillRect(x - 7 * s, y - 22 * s, 14 * s, 20 * s);
  g.fillStyle = '#fff6e0'; g.beginPath(); g.ellipse(x, y - 11 * s, 2.5 * s, 4.5 * s + Math.sin(t * 9 + ph) * s, 0, 0, 7); g.fill();
  g.strokeStyle = '#2a1e1a'; g.lineWidth = 1.5 * s; g.beginPath(); g.arc(x, y - 28 * s, 6 * s, Math.PI, 0); g.stroke();
}
export function square(ctx, t, s, A) {
  const cam = sqCam(t, s.a);
  const tR = A.respect;
  // arrival times: a slow trickle that becomes many around "respect"
  const arr = SLOTS.map((_, i) => tR - 1.7 + i * .26 + (i % 3) * .05);
  stage(ctx, [
    { c: sqPlate(), p: 1 },
    { p: 1, fn: (g) => {
      const [px, py] = PL;
      // warm light grows on the plinth as lanterns gather
      const n = arr.reduce((k, a) => k + clamp((t - a) / .3), 0);
      glowAt(g, px, py - 120, 360 + n * 30, .08 + n * .04, AMB, '#ffe8c0');
      for (const [i, [ox, oy]] of SLOTS.entries()) {
        const a = arr[i], d = DRESS[i % DRESS.length], side = ox < 0 || (ox === 0 && i % 2) ? -1 : 1;
        const walkIn = lin(a - 2.2, a - .25, t), place = lin(a - .25, a + .2, t), walkOut = lin(a + .3, a + 2.6, t);
        const sx0 = px + side * 1100, stand = px + ox + side * 70;
        let fx = mix(sx0, stand, eout(walkIn)); if (walkOut > 0) fx = mix(stand, sx0, ein(walkOut));
        const fy = 900 + (i % 4) * 26, sc = .9 + (i % 4) * .05;
        if (t > a - .25) lantern(g, px + ox, py + oy, 1.05, t, i);
        if (walkIn > 0 && walkOut < 1) {
          const moving = walkIn < 1 || walkOut > 0;
          const F = moving ? figAnim(`sq-w${i % DRESS.length}${walkOut > 0 ? 'o' : 'i'}`, 12, ((t * 1.05 + i * .17) % 1), sc, walkPose(['short', 'bun', 'curly', 'long', 'grey'][i % 5]), { flip: (side > 0) !== (walkOut > 0), dress: d, rim: '#ffd59a', rimSide: side > 0 ? -1 : 1, light: { dx: -side * 300, dy: -200, col: '#ffd59a', a: .45 }, shadeA: .25 })
            : fig(`sq-p${i % DRESS.length}`, sc, { lean: .45, head: .4, sh: [1.5, .4], el: [.4, .4], hip: [.3, -.2], kn: [.1, .3], hair: ['short', 'bun', 'curly', 'long', 'grey'][i % 5] }, { flip: side > 0, dress: d, rim: '#ffd59a', rimSide: side > 0 ? -1 : 1, light: { dx: -side * 300, dy: -200, col: '#ffd59a', a: .5 }, shadeA: .25 });
          drawFig(g, F, fx, fy - 88 * sc, t, { ph: i });
          // carried lantern swinging in the hand until it is set down
          if (t < a - .25) { const [hx, hy] = F.hand(0); lantern(g, fx + hx, fy - 88 * sc + hy + 26 + Math.sin(t * 6 + i) * 2, .9, t, i); }
          else if (place < 1) { const [hx, hy] = F.hand(0); const q = eio(place); lantern(g, mix(fx + hx, px + ox, q), mix(fy - 88 * sc + hy + 26, py + oy, q), .95, t, i); }
        }
      }
    } },
  ], cam);
  vignetteL(ctx, .4); paper(ctx, .08, t);
}

// ================================================================ CR · the cash drawer slides shut, unnoticed
function crPlate() {
  return big('s06:cr', () => {
    const [c, g] = lay();
    vgrad(g, 0, 0, W, H, [[0, '#2a2c36'], [.7, '#20222a'], [1, '#14151c']]);
    // window light, cold, from the left (the square's warmth is outside, far)
    { const [lc, lx] = lay(); lx.fillStyle = 'rgba(180,190,210,.16)'; lx.beginPath(); lx.moveTo(0, 120); lx.lineTo(460, 80); lx.lineTo(1500, 760); lx.lineTo(0, 980); lx.fill(); stipple(lc, { k: .5, seed: 3 }); g.drawImage(soft(lc), 0, 0); }
    radial(g, 140, 300, 500, [[0, rgba(AMB, .12)], [1, rgba(AMB, 0)]]);
    // shelves with price tags behind, counter in front
    for (let k = 0; k < 3; k++) { roughRect(g, 1100, 180 + k * 150, 760, 10, '#3a3c48', { amp: .5, seed: k }); const rr = prng(k + 5); let x = 1120; while (x < 1840) { const w = 40 + rr() * 50, h = 50 + rr() * 70; roughRect(g, x, 180 + k * 150 - h, w, h, mixHex('#3a3e4a', '#4a4e5a', rr()), { amp: .5, seed: x }); x += w + 8; } }
    roughRect(g, -20, 760, W + 40, 340, '#1a1b22', { amp: 1, seed: 20 }); roughRect(g, -20, 744, W + 40, 22, '#3a3c46', { amp: .8, seed: 21 });
    g.fillStyle = 'rgba(200,210,230,.14)'; g.fillRect(0, 744, W, 3);
    g.save(); g.beginPath(); g.rect(0, 766, W, 330); g.clip(); hatch(g, [0, 766, W, 330], { angle: .7, gap: 6, col: '#05060a', a: .35, seed: 22, broken: .4 }); g.restore();
    // the register body (side-ish view): keys, a dark display
    const rx = 760, ry = 744;
    roughPoly(g, [[rx, ry - 30], [rx + 420, ry - 30], [rx + 420, ry - 250], [rx + 300, ry - 330], [rx + 40, ry - 330], [rx, ry - 260]], '#4a4c58', { amp: 1, seed: 23 });
    roughRect(g, rx + 60, ry - 400, 160, 72, '#2a2c34', { amp: .6, seed: 24 }); roughRect(g, rx + 74, ry - 388, 132, 46, '#1a2420', { amp: .4, seed: 25 });
    for (let k = 0; k < 4; k++) for (let j = 0; j < 6; j++) { roughRect(g, rx + 70 + j * 46, ry - 300 + k * 44, 34, 30, '#6a6c78', { amp: .3, seed: k * 10 + j }); g.fillStyle = 'rgba(255,255,255,.1)'; g.fillRect(rx + 70 + j * 46, ry - 300 + k * 44, 34, 5); }
    g.fillStyle = 'rgba(200,210,230,.18)'; g.fillRect(rx, ry - 330, 420, 3);
    return c;
  });
}
function soft(c) { const [o, g] = lay(c.width, c.height); g.filter = 'blur(6px)'; g.drawImage(c, 0, 0); return o; }
export function register(ctx, t, s, A) {
  const cam = { x: 900 + drift(t, 5, 1), y: 560 + drift(t, 3, 2), z: 1.7 + .05 * lin(s.a, s.b, t) };
  const shut = ein(lin(A.earn - .35, A.earn + .12, t));
  stage(ctx, [
    { c: crPlate(), p: 1 },
    { p: 1, fn: (g) => {
      const rx = 760, ry = 744, out = 300 * (1 - shut);
      // the open drawer: coins and notes in their trays, sliding right into the body
      const dx = rx - out + 10;
      roughRect(g, dx, ry - 120, 400, 90, '#3a3c46', { amp: .6, seed: 30 });
      g.save(); g.beginPath(); g.rect(dx + 10, ry - 116, 380, 40); g.clip();
      for (let k = 0; k < 5; k++) { roughRect(g, dx + 14 + k * 76, ry - 114, 68, 36, '#22242c', { amp: .3, seed: 31 + k }); }
      for (let k = 0; k < 3; k++) roughRect(g, dx + 20 + k * 76, ry - 112, 56, 30, mixHex('#6a8a6a', '#8a9a7a', k / 3), { amp: .4, seed: 40 + k });
      const rr = prng(7); for (let k = 0; k < 18; k++) { g.fillStyle = mixHex('#a89a6a', '#c8b88a', rr()); g.beginPath(); g.ellipse(dx + 250 + rr() * 130, ry - 100 + rr() * 16, 9, 4, 0, 0, 7); g.fill(); }
      g.restore();
      roughRect(g, dx - 6, ry - 82, 22, 46, '#5a5c68', { amp: .4, seed: 50 });
      // the body's lower front covers the drawer's right part (it slides in under)
      roughRect(g, rx + 410, ry - 132, 20, 104, '#3e404c', { amp: .4, seed: 51 });
      // a little bell wobble when it snaps shut (nobody turns)
      const k = Math.exp(-Math.max(0, t - (A.earn + .12)) * 6) * (t > A.earn + .12 ? 1 : 0);
      g.save(); g.translate(rx + 380, ry - 340); g.rotate(Math.sin(t * 40) * .15 * k); g.fillStyle = '#8a8a70'; g.beginPath(); g.arc(0, 0, 14, Math.PI, 0); g.fill(); g.restore();
      // motion streak on the slide
      if (shut > 0 && shut < 1) { g.fillStyle = rgba('#c8d0e0', .15); g.fillRect(dx - 80, ry - 116, 80, 70); }
    } },
  ], cam);
  tintAll(ctx, '#6a6a70', .3, 'saturation'); vignetteL(ctx, .45); paper(ctx, .08, t);
}
