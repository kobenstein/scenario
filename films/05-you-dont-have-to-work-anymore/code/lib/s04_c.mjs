// Chapter 04, window 2 (part 2): 4.11 the long dinner in a narrow street · 4.12 neighbours on the balconies ·
// 4.13 two old friends on the harbour wall.
import { roughPath, roughPoly, roughRect, roughLine, sagLine, hatch, facade, vnoise, fbm } from './art.mjs';
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, sm, lin, eio, eout, ein, qio, drift, HOT, once, lay, T, camTo, fig, glowA, finish, lightSprite, spr, stip, putL, mkL, vgr, softLight, smear, footShadow } from './s04_util.mjs';

// =====================================================================================================================
// 4.11 · the long dinner: one-point street, the garden's sun sets at its far end, dusk → night time-lapse,
// a bracket clock passes nine on "nine", nobody gets up, a refill. Ends tilting up the facade.
// =====================================================================================================================
const VX = 990, VY = 575, F = 900, HC = 1.6;
const P = (X, Y, Z) => [VX + F * X / Z, VY + F * (HC - Y) / Z];
const XL = -4.2, XR = 4.6, TX0 = -.1, TX1 = .9, TY = .75, TZ0 = 2.6, TZ1 = 44;
export const SUN_D = [960, 470];
const BL = [[1.0, 3.4, 10.5], [3.4, 7, 13], [7, 11, 9.5], [11, 16, 12.5], [16, 23, 10], [23, 32, 13.5], [32, 45, 11], [45, 64, 12]];
const BR = [[1.0, 4.2, 12], [4.2, 8.5, 10], [8.5, 13, 13.5], [13, 19, 11], [19, 27, 12.5], [27, 38, 10.5], [38, 64, 12.8]];
const DUSK_W = ['#5a3a50', '#6a4256', '#4e3450', '#704a58', '#5e3c52'], NIGHT_W = ['#1d1a40', '#241e48', '#191838', '#2a2250', '#201c44'];
const DSEAT = [];   // diners: [X, Z, side]
for (let Z = 2.9; Z < 40; Z += Z < 8 ? 1.0 : 1.15) { DSEAT.push([TX0 - .38, Z, 0]); DSEAT.push([TX1 + .38, Z + .45, 1]); }
const DRESS = [['#c46a4a', '#2a1c2a'], ['#3a5a6a', '#1a1a28'], ['#d9a04a', '#2a2234'], ['#7a4a7a', '#1c1426'], ['#e3c9a0', '#3a2a2a'], ['#4a6a4a', '#1a1c18'], ['#b05a6a', '#24182a'], ['#e59a3a', '#2a2c3a']];
const HAIR = ['short', 'long', 'bun', 'curly', 'grey', 'short', 'long', 'cap'];
const HAIRC = ['#2a1a14', '#3a2214', '#5a4030', '#1c1420', '#c9c2b6', '#6a4a2a', '#2a1a10', '#40382f'];
function streetLayer(night) {
  const PAD = 200, [c, g] = mkL(PAD), r = prng(77), rl = prng(78);
  // ground: cobbles in perspective
  vgr(g, -PAD, VY, W + 2 * PAD, H - VY + PAD, night ? [[0, '#2a2140'], [1, '#120e22']] : [[0, '#8a5a52'], [.3, '#5a3a48'], [1, '#2a1c2c']]);
  g.save(); g.beginPath(); g.rect(-PAD, VY + 18, W + 2 * PAD, H); g.clip();
  g.strokeStyle = night ? '#0a0818' : '#2a1626'; for (let Z = 1.2; Z < 64; Z *= 1.06) { const [, y] = P(0, 0, Z); g.globalAlpha = .25 * (1 - Z / 64); g.lineWidth = Math.max(.5, 2.2 / Z * 3); g.beginPath(); roughPath(g, [[-PAD, y], [W + PAD, y]], { amp: .6, seed: Math.round(Z * 10), closed: false }); g.stroke(); }
  for (const X of [-3.0, 3.4]) { const a = P(X, 0, 1.0), b = P(X, 0, 64); g.globalAlpha = .7; g.lineWidth = 3; g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); g.strokeStyle = night ? rgba('#ffb35c', .18) : rgba('#ffc89a', .3); g.lineWidth = 1.5; g.beginPath(); g.moveTo(a[0] + 3, a[1]); g.lineTo(...b); g.stroke(); g.strokeStyle = night ? '#0a0818' : '#2a1626'; }
  g.globalAlpha = 1; g.restore();
  // far end: low hills on the horizon (the sun sets behind them)
  { const n = vnoise(5), pts = [[700, VY + 40]]; for (let x = 700; x <= 1300; x += 6) pts.push([x, VY - 6 - 18 * fbm(n, x * .01, 2, 3)]); pts.push([1300, VY + 40]); roughPoly(g, pts, night ? '#15132e' : '#9a5a5a', { amp: .6, seed: 4 }); }
  // facades on both sides (same rng sequence for dusk and night so the geometry matches)
  const side = (B, X, left) => B.slice().reverse().forEach(([z0, z1, h], i) => {
    const q = left ? [P(X, h, z0), P(X, h, z1), P(X, 0, z1), P(X, 0, z0)] : [P(X, h, z1), P(X, h, z0), P(X, 0, z0), P(X, 0, z1)];
    const k = (i + (left ? 0 : 2)) % 5, far = clamp((z0 - 4) / 50);
    facade(g, r, q, {
      wall: night ? NIGHT_W[k] : DUSK_W[k], floors: Math.max(3, Math.round(h / 3.1)), cols: Math.max(1, Math.round((z1 - z0) / 2.3)), top: .08, bottom: .9, ww: .42, wh: .5,
      lit: () => night ? (rl() < .62 ? .55 + .45 * rl() : 0) : (rl(), 0), winOn: '#ffc477', winOff: night ? '#0e0c22' : '#3a2436', amp: 1,
      shade: left ? [[0, rgba('#000000', .25)], [1, rgba('#000000', 0)]] : [[0, rgba('#000000', 0)], [1, rgba('#000000', .25)]],
      edgeLight: night ? rgba('#ffb35c', .25) : rgba('#ffc89a', .5), fogA: (night ? .25 : .35) * far, fogCol: night ? '#2a2450' : '#e0907a', style: k % 4, skip: .08,
    });
    // a ground-floor shop band + awning on some
    if (k % 2 === 0) { const a = P(X, 3, z0), b = P(X, 3, z1), cc = P(X, 2.6, z1), d = P(X, 2.6, z0); roughPoly(g, left ? [a, b, cc, d] : [b, a, d, cc], night ? '#3a1e2a' : '#a04a3a', { amp: .5, seed: i }); }
  });
  side(BL, XL, true); side(BR, XR, false);
  // dusk: the low sun rakes along the street (warm wash toward the far end); night: dark top
  if (!night) { const gr = g.createRadialGradient(SUN_D[0], SUN_D[1], 0, SUN_D[0], SUN_D[1], 1300); gr.addColorStop(0, rgba('#ffb070', .35)); gr.addColorStop(.5, rgba('#ff8a5a', .1)); gr.addColorStop(1, rgba('#ff8a5a', 0)); g.fillStyle = gr; g.globalCompositeOperation = 'source-atop'; g.fillRect(-PAD, -PAD, W + 2 * PAD, H + 2 * PAD); g.globalCompositeOperation = 'source-over'; }
  else { vgr(g, -PAD, -PAD, W + 2 * PAD, 500, [[0, rgba('#05040f', .5)], [1, rgba('#05040f', 0)]]); g.globalCompositeOperation = 'source-atop'; g.fillStyle = 'rgba(0,0,0,0)'; g.globalCompositeOperation = 'source-over'; }
  // hatching in the shaded lower facades
  g.save(); g.beginPath(); g.moveTo(...P(XL, 6, 1)); g.lineTo(...P(XL, 6, 30)); g.lineTo(...P(XL, 0, 30)); g.lineTo(...P(XL, 0, 1)); g.closePath(); g.clip(); hatch(g, [-PAD, 0, 900, H], { angle: .8, gap: 7, col: '#0a0614', a: night ? .22 : .18, seed: 3, broken: .4 }); g.restore();
  return c;
}
function skyLayer(night) {
  const PAD = 200, [c, g] = mkL(PAD);
  if (!night) {
    vgr(g, -PAD, -PAD, W + 2 * PAD, VY + PAD + 40, [[0, '#3a2a5a'], [.45, '#9a5070'], [.75, '#f08a5a'], [1, '#ffc477']]);
    softLight(g, SUN_D[0], SUN_D[1], 520, '#ffd59a', .55);
    g.beginPath(); for (const [y, x0, x1, th] of [[300, 700, 1300, 10], [380, 820, 1200, 6], [220, 600, 1400, 14]]) { g.moveTo(x0, y); g.bezierCurveTo(x0 + 200, y - th, x1 - 200, y - th, x1, y); g.bezierCurveTo(x1 - 200, y + th * .6, x0 + 200, y + th * .6, x0, y); } g.fillStyle = rgba('#ff9a6a', .55); g.fill();
  } else {
    vgr(g, -PAD, -PAD, W + 2 * PAD, VY + PAD + 40, [[0, '#070820'], [.6, '#151640'], [1, '#3a2a58']]);
    const r = prng(3); for (let i = 0; i < 220; i++) { const x = r() * (W + 2 * PAD) - PAD, y = r() * (VY + PAD) - PAD, a = r(); g.fillStyle = rgba('#e8e4ff', .2 + .6 * a * a); g.fillRect(x, y, a > .9 ? 2 : 1.2, a > .9 ? 2 : 1.2); }
  }
  stip(c, { k: .25, seed: night ? 5 : 6 });
  return c;
}
function seatedPose(i, extra = {}) {
  const r = prng(i * 13 + 5);
  return Object.assign({ lean: .06 + r() * .1, head: .1 + r() * .2, sh: [1.25 + r() * .3, .9 + r() * .3], el: [.45 + r() * .3, .6 + r() * .3], hip: [1.5, 1.4], kn: [1.45, 1.4], hair: HAIR[i % 8], bulk: .95 + r() * .2, skirt: i % 5 === 2 }, extra);
}
function dinerDress(i) { const d = DRESS[i % 8]; return { coat: d[0], pants: d[1], shoes: '#140c14', skin: ['#e9c3a0', '#c98f6a', '#8a5a3a', '#e2b296', '#d9a77e'][i % 5], hair: HAIRC[i % 8], skirt: '#5a3448' }; }
function tableLayer() {
  return once('din:table', () => {
    const PAD = 200, [c, g] = mkL(PAD);
    // the long table top (cloth), far → near; plates + glasses; a warm pool of light at night is added live
    const q = [P(TX0, TY, TZ1), P(TX1, TY, TZ1), P(TX1, TY, TZ0), P(TX0, TY, TZ0)];
    roughPoly(g, q, '#dccbb2', { amp: .6, seed: 3 });
    g.save(); g.beginPath(); roughPath(g, q, { amp: .6, seed: 3 }); g.clip();
    vgr(g, -PAD, VY, W + 2 * PAD, H - VY, [[0, rgba('#b07a7a', .5)], [.4, rgba('#000', 0)], [1, rgba('#3a2034', .25)]]);
    for (let u = .12; u < 1; u += .25) { g.strokeStyle = rgba('#c46a6a', .45); g.lineWidth = 2; g.beginPath(); g.moveTo(...P(mix(TX0, TX1, u), TY, TZ1)); g.lineTo(...P(mix(TX0, TX1, u), TY, TZ0)); g.stroke(); }
    g.restore();
    // near edge (cloth drop) + legs
    { const a = P(TX0, TY, TZ0), b = P(TX1, TY, TZ0), cc = P(TX1, TY - .3, TZ0), d = P(TX0, TY - .3, TZ0); roughPoly(g, [a, b, cc, d], '#c9b8a0', { amp: .6, seed: 4 }); for (const X of [TX0 + .05, TX1 - .05]) { const [x, y] = P(X, TY - .3, TZ0); roughRect(g, x - 6, y, 12, H - y + 40, '#2a1a24', { amp: .4, seed: Math.round(x) }); } }
    for (let i = DSEAT.length - 1; i >= 0; i--) { const [X, Z, sd] = DSEAT[i]; const [px, py] = P(sd ? TX1 - .2 : TX0 + .2, TY, Z + .1), k = F / Z / 110;
      g.fillStyle = '#f3efe2'; g.beginPath(); g.ellipse(px, py, 16 * k, 4.5 * k, 0, 0, 7); g.fill(); g.fillStyle = rgba('#c4382a', .7); g.beginPath(); g.ellipse(px, py - 1 * k, 7 * k, 2 * k, 0, 0, 7); g.fill();
      const [gx, gy] = P(sd ? TX1 - .42 : TX0 + .42, TY, Z + .35); g.fillStyle = rgba('#ffe2b8', .7); g.fillRect(gx - 2 * k, gy - 14 * k, 4 * k, 14 * k); }
    // far diners (live ones are drawn per frame)
    const sorted = DSEAT.map((d, i) => [...d, i]).filter((d) => d[1] > 5.6).sort((a, b) => b[1] - a[1]);
    for (const [X, Z, sd, i] of sorted) {
      const [x, y] = P(X, .5, Z), s = F / Z / 108;
      // chair back
      const [cx2, cy2] = P(X + (sd ? .22 : -.22), .95, Z); roughRect(g, cx2 - 3 * s, cy2, 6 * s, 50 * s, '#1c1224', { amp: .3, seed: i });
      fig(g, x, y, s, seatedPose(i), { flip: !!sd, noLegs: true, dress: dinerDress(i), light: { x: VX, y: 200, col: '#ffcf96', a: .5 }, rim: '#ffd9a8', rimSide: sd ? 1 : -1, shadeA: .12 + .3 * clamp((Z - 8) / 30), shadeCol: '#2a1a3a' });
    }
    return c;
  });
}
function clock(ctx, x, y, R, mins, glow) {
  ctx.save();
  ctx.fillStyle = '#1a1424'; ctx.beginPath(); ctx.arc(x, y, R * 1.12, 0, 7); ctx.fill();
  ctx.fillStyle = mixHex('#e9ddc8', '#ffe2b0', glow); ctx.beginPath(); ctx.arc(x, y, R, 0, 7); ctx.fill();
  ctx.strokeStyle = '#2a1a24'; for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283, l = i % 3 ? .1 : .18; ctx.lineWidth = i % 3 ? 2 : 3.5; ctx.beginPath(); ctx.moveTo(x + Math.sin(a) * R * (1 - l), y - Math.cos(a) * R * (1 - l)); ctx.lineTo(x + Math.sin(a) * R * .94, y - Math.cos(a) * R * .94); ctx.stroke(); }
  const hand = (a, l, w) => { ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - Math.sin(a) * R * .1, y + Math.cos(a) * R * .1); ctx.lineTo(x + Math.sin(a) * R * l, y - Math.cos(a) * R * l); ctx.stroke(); };
  ctx.strokeStyle = '#1a1020'; hand((mins / 60 % 12) / 12 * 6.283, .52, 5); hand((mins % 60) / 60 * 6.283, .8, 3.2);
  ctx.fillStyle = '#1a1020'; ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.fill();
  ctx.restore();
  if (glow > 0) glowA(ctx, x, y, R * 2.4, .25 * glow, C.amber, HOT);
}
function bottle(g, a0, a1, D, k) {   // prop: a wine bottle in the front hand, tilting with k
  const h = a0; g.save(); g.translate(h.hx, h.hy); g.rotate(-.4 + 1.6 * k); g.fillStyle = '#2a3a2a'; g.fillRect(-5, -30, 10, 34); g.fillRect(-2.5, -42, 5, 13); g.fillStyle = rgba('#ffe2b8', .5); g.fillRect(-4, -26, 2, 24); g.restore();
}
export function drawDinner(ctx, t, s, K) {
  const night = sm(lin(K.start + .2, K.nine - .1, t)), tilt = ein(lin(K.end - .55, K.end + .25, t));
  const cam = { x: drift(t, 10, 5) - 20 * lin(K.start, K.end, t), y: drift(t, 6, 6) - tilt * 620, z: 1.0 + .06 * eout(lin(K.start, K.end, t)) };
  // sky + the sun sinking behind the far hills
  const skyD = once('din:skyD', () => skyLayer(false)), skyN = once('din:skyN', () => skyLayer(true));
  lay(ctx, skyD, cam, .5); if (night > 0) lay(ctx, skyN, cam, .5, { a: night });
  { const tr = T(cam, .5), sy = mix(SUN_D[1], SUN_D[1] + 150, eio(lin(K.start - .2, K.nine - .5, t))), R = 46 * tr.z;
    ctx.save(); ctx.fillStyle = mixHex('#fff1cf', '#ff8a5a', lin(K.start, K.nine - .5, t)); ctx.globalAlpha = 1 - sm(lin(K.nine - .9, K.nine - .4, t)); ctx.beginPath(); ctx.arc(tr.X(SUN_D[0]), tr.Y(sy), R, 0, 7); ctx.fill(); ctx.restore();
    glowA(ctx, tr.X(SUN_D[0]), tr.Y(sy), 380 * tr.z, .45 * (1 - night), '#ff8a5a', '#ffd59a'); }
  const stD = once('din:stD', () => streetLayer(false)), stN = once('din:stN', () => streetLayer(true));
  lay(ctx, stD, cam, 1); if (night > 0) lay(ctx, stN, cam, 1, { a: night });
  // string lights zig-zag across the street, on as night falls
  const bulbs = lightSprite('din:bulb', '#ffb35c', '#fff1cf', { k: .5, seed: 4, size: 128 });
  const on = .25 + .75 * night;
  ctx.save(); camTo(ctx, cam, 1);
  const ZS = [3.2, 5.4, 8, 11, 14.5, 19, 25, 33, 43];
  const lines = ZS.map((Z, i) => { const a = i % 2 ? [XL, 5.4, Z] : [XR, 5.4, Z], b = i % 2 ? [XR, 5.6, ZS[i + 1] || Z + 8] : [XL, 5.6, ZS[i + 1] || Z + 8]; const pts = []; for (let k = 0; k <= 20; k++) { const u = k / 20; pts.push([mix(a[0], b[0], u), mix(a[1], b[1], u) - Math.sin(Math.PI * u) * .7, mix(a[2], b[2], u)]); } return pts; });
  ctx.strokeStyle = '#0c0a18'; ctx.lineWidth = 1.4;
  for (const L of lines) { ctx.beginPath(); L.forEach(([X, Y, Z], k) => { const [x, y] = P(X, Y, Z); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); }
  const tl = camTo(ctx, cam, 1);
  ctx.restore();
  // the table + far diners, then a warm pool on the cloth at night
  lay(ctx, tableLayer(), cam, 1);
  ctx.save(); camTo(ctx, cam, 1);
  { ctx.fillStyle = rgba('#1a1440', .32 * night); for (const Q of [[P(TX0, TY, TZ1), P(TX1, TY, TZ1), P(TX1, TY, TZ0), P(TX0, TY, TZ0)], [P(TX0, TY, TZ0), P(TX1, TY, TZ0), P(TX1, TY - .3, TZ0), P(TX0, TY - .3, TZ0)]]) { ctx.beginPath(); for (const p of Q) ctx.lineTo(...p); ctx.fill(); } }
  { const [x, y] = P(.4, TY, 9); ctx.globalCompositeOperation = 'lighter'; const gr = ctx.createRadialGradient(x, y, 0, x, y, 420); gr.addColorStop(0, rgba('#ffb35c', .22 * night)); gr.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = gr; ctx.save(); ctx.translate(x, y); ctx.scale(1, .45); ctx.translate(-x, -y); ctx.beginPath(); ctx.arc(x, y, 420, 0, 7); ctx.fill(); ctx.restore(); ctx.globalCompositeOperation = 'source-over'; }
  // near diners, live (far → near): talk, lean, laugh; the near right one pours a refill after nine
  const pour = sm(lin(K.nine + .55, K.nine + 1.0, t)) * (1 - sm(lin(K.nine + 1.9, K.nine + 2.4, t)));
  const near = DSEAT.map((d, i) => [...d, i]).filter((d) => d[1] <= 5.6).sort((a, b) => b[1] - a[1]);
  for (const [X, Z, sd, i] of near) {
    const [x, y] = P(X, .5, Z), sc = F / Z / 108, ph = t * (1.1 + i * .13) + i;
    const isPour = i === 3, laugh = i === 0 ? Math.max(0, Math.sin((t - K.start) * 2.2)) * sm(lin(K.start + .4, K.start + 1, t)) : 0;
    const pose = seatedPose(i, { lean: seatedPose(i).lean - .14 * laugh + .03 * Math.sin(ph), head: seatedPose(i).head - .3 * laugh + .05 * Math.sin(ph * 1.3) });
    if (isPour) Object.assign(pose, { lean: .2 + .1 * pour, sh: [1.4 + .5 * pour, .9], el: [.3 - .2 * pour, .7] });
    else if (i % 2 === 0) pose.sh = [pose.sh[0] + .25 * Math.sin(ph * .8), pose.sh[1]];
    const [cx2, cy2] = P(X + (sd ? .22 : -.22), .95, Z); roughRect(ctx, cx2 - 3 * sc, cy2, 6 * sc, 60 * sc, '#1c1224', { amp: .3, seed: i });
    const f = fig(ctx, x, y + Math.sin(ph) * 1.2 * sc, sc, pose, { flip: !!sd, noLegs: true, dress: dinerDress(i), light: { x: VX, y: 150, col: '#ffcf96', a: .4 + .25 * night }, rim: '#ffd9a8', rimSide: sd ? 1 : -1, rimW: 3, shadeA: .1, shadeCol: '#2a1a3a', prop: isPour ? (g2, a0, a1, D) => bottle(g2, a0, a1, D, pour) : null });
    if (isPour && pour > .7) { const [hx, hy] = f.hand(0); ctx.strokeStyle = rgba('#8a1a2a', .8 * sm(lin(.7, .9, pour))); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(hx - 20, hy + 10); ctx.quadraticCurveTo(hx - 30, hy + 30, hx - 34, hy + 52); ctx.stroke(); }
  }
  // bulbs over everything near
  for (const L of lines) for (let k = 1; k < 20; k += 2) { const [X, Y, Z] = L[k], [x, y] = P(X, Y - .08, Z), r0 = Math.max(1.4, 9 / Z * 3), fl = .85 + .15 * Math.sin(t * 2.7 + k * 1.9 + Z); ctx.fillStyle = mixHex('#6a5040', '#fff1cf', on); ctx.beginPath(); ctx.arc(x, y, r0 * .55, 0, 7); ctx.fill(); spr(ctx, bulbs, x, y, r0 * 7, on * fl * .9); }
  // the bracket clock on the right facade
  { const [bx, by] = P(XR, 4.5, 7), [x, y] = P(XR - .62, 4.3, 7), R = .42 * F / 7; roughLine(ctx, [[bx, by], [x + R, y - 6]], { w: 5, col: '#1a1424', seed: 2 });
    const mins = 540 + (t - K.nine) * 22; clock(ctx, x, y, R, mins, night); }
  ctx.restore();
  finish(ctx, { vig: .36, vigCol: '#0a0818' });
  void tl; if (tilt > .02) smear(ctx, ctx.canvas, 0, tilt * 240, .9);
}

// =====================================================================================================================
// a bird (pigeon / gull): the carrier from the balcony to the harbour wall
// =====================================================================================================================
export function bird(ctx, x, y, s, flap, dir = 1, col = '#e9e4da') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s);
  const w = Math.sin(flap) * .9;
  ctx.fillStyle = shade(col, -.25);
  ctx.beginPath(); ctx.moveTo(-4, -2); ctx.quadraticCurveTo(-14, -18 - 22 * w, -34, -10 - 40 * w); ctx.quadraticCurveTo(-16, -4 - 8 * w, 4, 2); ctx.fill();   // far wing
  ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(0, 0, 16, 6.5, -.12, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(14, -4, 5.2, 0, 7); ctx.fill();
  ctx.fillStyle = '#e8a24a'; ctx.beginPath(); ctx.moveTo(18, -5); ctx.lineTo(25, -3); ctx.lineTo(18, -1.5); ctx.fill();
  ctx.fillStyle = shade(col, -.12); ctx.beginPath(); ctx.moveTo(-14, -1); ctx.lineTo(-26, -4); ctx.lineTo(-25, 4); ctx.closePath(); ctx.fill();   // tail
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-2, -3); ctx.quadraticCurveTo(-6, -20 - 30 * w, -30, -14 - 46 * w); ctx.quadraticCurveTo(-12, -6 - 10 * w, 8, -1); ctx.fill();   // near wing
  ctx.restore();
}
function birdSit(ctx, x, y, s, t, col = '#cfd2da') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(0, -9, 13, 9, -.25, 0, 7); ctx.fill();
  const bob = Math.sin(t * 5) > .7 ? 2 : 0; ctx.beginPath(); ctx.arc(10, -19 + bob, 5.5, 0, 7); ctx.fill();
  ctx.fillStyle = '#e8a24a'; ctx.fillRect(15, -19 + bob, 5, 2);
  ctx.fillStyle = shade(col, -.25); ctx.beginPath(); ctx.ellipse(-3, -8, 10, 5, -.3, 0, 7); ctx.fill(); ctx.fillRect(-16, -8, 8, 3);
  ctx.strokeStyle = '#c47a4a'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-1, 0); ctx.lineTo(-1, 3); ctx.moveTo(3, 0); ctx.lineTo(3, 3); ctx.stroke();
  ctx.restore();
}

// =====================================================================================================================
// 4.12 · neighbours: a courtyard corner seen from below (true 3D projection, worm's-eye), morning light on the upper
// floors; a neighbour leans over her balcony and waves on "name"; you wave back from the foreground; her pigeon flies.
// =====================================================================================================================
const NB = { yaw: .64, pitch: .66, f: 980, C: [-3.5, 1.7, -3.5] };
function PN(x, y, z) {
  const dx = x - NB.C[0], dy = y - NB.C[1], dz = z - NB.C[2], cy = Math.cos(NB.yaw), sy = Math.sin(NB.yaw), cp = Math.cos(NB.pitch), sp = Math.sin(NB.pitch);
  const x1 = dx * cy - dz * sy, z1 = dx * sy + dz * cy, y2 = dy * cp - z1 * sp, z2 = dy * sp + z1 * cp;
  return [W / 2 + NB.f * x1 / z2, H / 2 - NB.f * y2 / z2, z2];
}
const WA = 8, WB = 5, ROOF = 19.5;   // wall A: z = 8 (x ≤ 5), wall B: x = 5 (z ≤ 8)
const onA = (u, y, out = 0) => [WB - u, y, WA - out], onB = (u, y, out = 0) => [WB - out, y, WA - u];
const NEIGH = { u: 4.2, y: 6 };   // her balcony on wall A (u = metres from the corner)
function courtLayers() {
  return once('nb', () => {
    const PAD = 200, [c, g] = mkL(PAD), r = prng(21);
    const poly = (pts, col, o = {}) => roughPoly(g, pts.map((p) => PN(...p).slice(0, 2)), col, Object.assign({ amp: .8, seed: Math.round(r() * 1e5) }, o));
    // sky (morning)
    vgr(g, -PAD, -PAD, W + 2 * PAD, H + 2 * PAD, [[0, '#9a86b0'], [.5, '#f0b892'], [1, '#ffe2b8']]);
    softLight(g, 1500, -100, 900, '#fff1cf', .6);
    const wall = (on, Lu, col, lit) => {
      poly([on(0, 0), on(Lu, 0), on(Lu, ROOF), on(0, ROOF)], col, { amp: 1.2 });
      // eave + cornice
      poly([on(0, ROOF), on(Lu, ROOF), on(Lu, ROOF + .5, .5), on(0, ROOF + .5, .5)], shade(col, -.2));
      // windows (true perspective), every 2.6 m, floors every 3 m
      for (let fl = 1; fl < 6; fl++) for (let k = 0; k * 2.6 + 1.3 < Lu; k++) {
        const u0 = k * 2.6 + .8, y0 = fl * 3 + .9;
        if (r() < .08) continue;
        poly([on(u0 - .08, y0 - .08), on(u0 + 1.18, y0 - .08), on(u0 + 1.18, y0 + 1.58), on(u0 - .08, y0 + 1.58)], shade(col, .08), { amp: .3 });
        const lw = r() < .25 ? '#ffc477' : (lit ? '#5a3a4a' : '#2e2240');
        poly([on(u0, y0), on(u0 + 1.1, y0), on(u0 + 1.1, y0 + 1.5), on(u0, y0 + 1.5)], lw, { amp: .3 });
        if (r() < .4) poly([on(u0, y0 + .9), on(u0 + 1.1, y0 + .9), on(u0 + 1.1, y0 + 1.5), on(u0, y0 + 1.5)], rgba('#e8c8b0', .45), { amp: .2 });   // curtain
        poly([on(u0 - .1, y0 - .16), on(u0 + 1.2, y0 - .16), on(u0 + 1.2, y0 - .02, .1), on(u0 - .1, y0 - .02, .1)], shade(col, .15), { amp: .2 });   // sill
      }
    };
    wall(onA, 13, '#7a5068', false);
    wall(onB, 10, '#d08a64', true);
    // morning sun on wall B's upper floors (stippled), cool shade at the bottom of both
    { const [lc, lx] = mkL(PAD); lx.save(); lx.beginPath(); for (const p of [onB(0, 8), onB(10, 8), onB(10, ROOF), onB(0, ROOF)]) lx.lineTo(...PN(...p).slice(0, 2)); lx.clip(); softLight(lx, 1500, 0, 1300, '#ffd59a', .7); lx.restore(); stip(lc, { k: .4, seed: 4 }); putL(g, lc, { op: 'screen' }); }
    { const gg = g.createLinearGradient(0, H + 100, 0, 300); gg.addColorStop(0, rgba('#1a1030', .6)); gg.addColorStop(1, rgba('#1a1030', 0)); g.fillStyle = gg; g.save(); g.beginPath(); for (const p of [onA(13, 0), onA(0, 0), onB(10, 0), onB(10, 9), onA(0, 9), onA(13, 9)]) g.lineTo(...PN(...p).slice(0, 2)); g.clip(); g.fillRect(-PAD, -PAD, W + 2 * PAD, H + 2 * PAD); hatch(g, [-PAD, 500, W + 2 * PAD, 800], { angle: -.9, gap: 7, col: '#1a0c24', a: .25, seed: 5, broken: .4 }); g.restore(); }
    // corner shadow line
    { const a = PN(...onA(0, 0)), b = PN(...onA(0, ROOF)); g.strokeStyle = rgba('#1a0c24', .5); g.lineWidth = 6; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
    // balconies (far → near): slab seen from below, railing bars, plants
    const balc = (on, u, y, w2, plants) => {
      const d = 1.2;
      poly([on(u - w2, y, 0), on(u + w2, y, 0), on(u + w2, y, d), on(u - w2, y, d)], '#3a2438', { amp: .5 });   // underside
      poly([on(u - w2, y, d), on(u + w2, y, d), on(u + w2, y + .22, d), on(u - w2, y + .22, d)], '#e9d8c4', { amp: .4 });   // slab edge
      for (let k = 0; k <= 12; k++) { const uu = mix(u - w2, u + w2, k / 12), a = PN(...on(uu, y + .22, d)), b = PN(...on(uu, y + 1.05, d)); g.strokeStyle = '#2a1830'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
      const ra = PN(...on(u - w2, y + 1.05, d)), rb = PN(...on(u + w2, y + 1.05, d)); g.strokeStyle = '#2a1830'; g.lineWidth = 5; g.beginPath(); g.moveTo(ra[0], ra[1]); g.lineTo(rb[0], rb[1]); g.stroke();
      if (plants) for (let k = 0; k < 4; k++) { const [px, py, pz] = PN(...on(u - w2 + .3 + k * w2 * .5, y + 1.1, d - .1)), s2 = NB.f / pz / 60; g.fillStyle = k % 2 ? '#3e6a44' : '#4f7a4a'; g.beginPath(); g.ellipse(px, py - 10 * s2, 14 * s2, 11 * s2, 0, 0, 7); g.fill(); if (k % 2 === 0) { g.fillStyle = '#e8553a'; g.beginPath(); g.arc(px + 4 * s2, py - 16 * s2, 3.5 * s2, 0, 7); g.fill(); } }
    };
    balc(onB, 7.5, 12, 1.3, true); balc(onB, 3.5, 6, 1.3, true); balc(onB, 5.5, 15, 1.3, false);
    balc(onA, 9.5, 12, 1.3, true); balc(onA, 8, 15, 1.2, false); balc(onA, 3.6, 12, 1.2, true); balc(onA, 10, 6, 1.3, false);
    // laundry line across the corner
    { const a = PN(...onA(4, 7.6)), b = PN(...onB(5, 7.2)); const pts = sagLine([a[0], a[1]], [b[0], b[1]], 40, 30); g.strokeStyle = '#2a1830'; g.lineWidth = 1.5; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke();
      for (const [q, col, w2, h2] of [[.22, '#e8a3a0', 40, 52], [.4, '#f3efe2', 34, 60], [.6, '#7aa5a8', 46, 40], [.78, '#ffb35c', 30, 46]]) { const [x, y] = pts[Math.round(q * 30)]; roughPoly(g, [[x - w2 / 2, y], [x + w2 / 2, y + 2], [x + w2 / 2 + 3, y + h2], [x - w2 / 2 + 2, y + h2 - 3]], col, { amp: 1, seed: Math.round(x) }); g.fillStyle = rgba('#1a0c24', .25); g.fillRect(x - w2 / 2, y + h2 * .6, w2, h2 * .4); } }
    return c;
  });
}
export function drawNeighbours(ctx, t, s, K) {
  const L = courtLayers();
  const land = 1 - eout(lin(K.start - .3, K.start + .45, t));   // arriving from the dinner tilt (camera still rising)
  const hp = PN(...onA(NEIGH.u, NEIGH.y + 1, .8)), push = eio(lin(K.start, K.name + .3, t));
  const cam = { x: drift(t, 8, 7) + (hp[0] - 960) * .55 * push, y: drift(t, 6, 8) + land * 320 + (hp[1] - 540) * .45 * push, z: 1.04 + .3 * push };
  lay(ctx, L, cam, 1);
  ctx.save(); camTo(ctx, cam, 1);
  // her balcony on wall A: she leans over the railing and waves on "name"
  const u = NEIGH.u, y = NEIGH.y, d = 1.2, on = onA;
  const wave = sm(lin(K.name - .9, K.name - .4, t)) * (1 - sm(lin(K.name + 1.1, K.name + 1.6, t)));
  const [hx, hy, hz] = PN(...on(u, y + .95, d - .45)), up = PN(...on(u, y + 1.95, d - .45)), sN = NB.f / hz / 105 * 1.45, rot = Math.atan2(up[0] - hx, hy - up[1]);
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(rot);
  const wv = Math.sin(t * 9) * .35 * wave;
  fig(ctx, 0, 0, sN, { lean: .25 + .1 * wave, head: .3 - .15 * wave, sh: [.9 + 2.0 * wave + wv, 1.4], el: [.6 - .3 * wave, .5], hip: [.05, -.05], kn: [0, .04], hair: 'grey', skirt: true, bulk: 1.1 }, { flip: true, noLegs: true, dress: { coat: '#b0607a', pants: '#3a2238', skin: '#e2b296', hair: '#d8d0c8', hairBack: '#c9c2b6', skirt: '#5a3448' }, light: { x: 1500, y: -300, col: '#ffd59a', a: .45 }, rim: '#ffe2b8', rimSide: -1, rimW: 2 });
  ctx.restore();
  // her railing + slab in front of her
  { const poly = (pts, col) => roughPoly(ctx, pts.map((p) => PN(...p).slice(0, 2)), col, { amp: .5, seed: 9 });
    poly([on(u - 1.4, y, 0), on(u + 1.4, y, 0), on(u + 1.4, y, d), on(u - 1.4, y, d)], '#3a2438');
    poly([on(u - 1.4, y, d), on(u + 1.4, y, d), on(u + 1.4, y + .22, d), on(u - 1.4, y + .22, d)], '#e9d8c4');
    ctx.strokeStyle = '#2a1830'; for (let k = 0; k <= 12; k++) { const uu = mix(u - 1.4, u + 1.4, k / 12), a = PN(...on(uu, y + .22, d)), b = PN(...on(uu, y + 1.05, d)); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
    const ra = PN(...on(u - 1.4, y + 1.05, d)), rb = PN(...on(u + 1.4, y + 1.05, d)); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(ra[0], ra[1]); ctx.lineTo(rb[0], rb[1]); ctx.stroke();
    // a geranium box on the rail
    const [px, py, pz] = PN(...on(u + .8, y + 1.1, d)), k2 = NB.f / pz / 60; roughRect(ctx, px - 20 * k2, py - 8 * k2, 40 * k2, 9 * k2, '#a04a3a', { amp: .3, seed: 3 }); for (let i = 0; i < 5; i++) { ctx.fillStyle = i % 2 ? '#3e6a44' : '#e8553a'; ctx.beginPath(); ctx.arc(px - 16 * k2 + i * 8 * k2, py - 12 * k2 - (i % 2) * 3 * k2 + Math.sin(t * 2 + i) * .8, (i % 2 ? 6 : 4) * k2, 0, 7); ctx.fill(); } }
  // her pigeon: sits on the rail, takes off before the cut and flies up-right (lands on the harbour wall next)
  const [bx0, by0] = PN(...on(u - .7, y + 1.12, d));
  const fly = lin(K.end - .9, K.end + .3, t);
  if (fly <= 0) birdSit(ctx, bx0, by0, 1.2, t);
  else { const e = ein(lin(0, 1, fly)) * .55 + fly * .45, x = mix(bx0, 1610 + 120, e), yy = mix(by0, 170 - 70, e) - Math.sin(Math.PI * Math.min(1, fly * 1.2)) * 60; bird(ctx, x, yy, 1.3 + fly * .5, t * 22, 1); }
  ctx.restore();
  // you, in the foreground: back to us, head up, waving back just after her
  const yw = sm(lin(K.name - .5, K.name, t)) * (1 - sm(lin(K.name + 1.3, K.name + 1.8, t))), yv = Math.sin(t * 8 + 1) * .3 * yw;
  const tr = T({ x: cam.x * .4, y: cam.y * .4, z: 1 + (cam.z - 1) * .3 }, 1);
  fig(ctx, tr.X(1530), tr.Y(1150), 4.0 * tr.z, { lean: -.1, head: -.4 + .04 * Math.sin(t * .8), sh: [.25 + 2.3 * yw + yv, -.25], el: [.35 + .5 * yw, .5], hip: [0, 0], kn: [0, 0], hair: 'long' }, { flip: true, dress: { coat: '#e59a3a', pants: '#2a2c3a', skin: '#e9c3a0', hair: '#3a2214' }, light: { x: 1500, y: -200, col: '#ffd9a0', a: .5 }, shadeA: .25, shadeCol: '#2a1430', rim: '#ffe0a8', rimSide: -1, rimW: 4 });
  finish(ctx, { vig: .34, vigCol: '#1a0c24' });
  if (land > .02) smear(ctx, ctx.canvas, 0, land * 160, .8);
}

// =====================================================================================================================
// 4.13 · the harbour wall: two old friends sit at the edge, legs dangling, cherries between them; the sun arcs across
// the afternoon ("afternoon"); the gull from the balcony lands on the bollard; a cherry stone is flicked down.
// =====================================================================================================================
const HZ = 470, EDGE = (u) => [mix(300, 1450, u), mix(1080, 540, u)], BACK = (u) => [mix(-160, 1400, u), mix(760, 528, u)];
const BOL = [330, 985];
function harbourLayers(late) {
  const PAD = 160, [c, g] = mkL(PAD), r = prng(late ? 61 : 60);
  vgr(g, -PAD, -PAD, W + 2 * PAD, HZ + PAD + 4, late ? [[0, '#26305a'], [.55, '#c47a72'], [1, '#ffc477']] : [[0, '#245a66'], [.6, '#8fb0a4'], [1, '#f3dcae']]);
  g.beginPath(); for (const [y, x0, x1, th] of [[160, 1000, 1900, 12], [230, 300, 1100, 9], [330, 1200, 2000, 7]]) { g.moveTo(x0, y); g.bezierCurveTo(x0 + 250, y - th, x1 - 250, y - th, x1, y); g.bezierCurveTo(x1 - 250, y + th * .6, x0 + 250, y + th * .6, x0, y); } g.fillStyle = late ? rgba('#ff9a6a', .5) : rgba('#fff1cf', .45); g.fill();
  // sea
  vgr(g, -PAD, HZ, W + 2 * PAD, H - HZ + PAD, late ? [[0, '#c48a7a'], [.25, '#5a4a6a'], [1, '#1c1a38']] : [[0, '#a8c0b0'], [.25, '#3a7080'], [1, '#14304a']]);
  g.strokeStyle = late ? '#ffd9a8' : '#e8f0e0'; for (let i = 0; i < 260; i++) { const y = HZ + 4 + Math.pow(r(), 1.8) * (H - HZ), x = r() * (W + 2 * PAD) - PAD, l = 6 + (y - HZ) * .12 * r(); g.globalAlpha = .12 + .2 * r(); g.lineWidth = 1 + (y - HZ) / 400; g.beginPath(); g.moveTo(x, y); g.lineTo(x + l, y); g.stroke(); } g.globalAlpha = 1;
  // far headland with a small town (left horizon)
  { const n = vnoise(3), pts = [[-PAD, HZ + 6]]; for (let x = -PAD; x <= 760; x += 6) pts.push([x, HZ - 8 - 46 * fbm(n, x * .006, 1, 3) * clamp((760 - x) / 300)]); pts.push([760, HZ + 6]); roughPoly(g, pts, late ? '#5a3a58' : '#5a7a7a', { amp: .6, seed: 2 });
    for (let i = 0; i < 16; i++) { const x = 20 + i * 38 + r() * 10, h = 14 + r() * 16; roughRect(g, x, HZ - 20 - h - 20 * clamp((600 - x) / 600), 22, h + 12, late ? '#6a4462' : '#7a9494', { amp: .3, seed: i }); if (late && r() < .5) { g.fillStyle = '#ffc477'; g.fillRect(x + 8, HZ - 14 - h - 20 * clamp((600 - x) / 600), 3, 3); } } }
  // the pier: top surface with paving joints, the sea-side wall face
  const top = [BACK(0), BACK(1), EDGE(1), EDGE(0), [300, H + PAD], [-PAD, H + PAD], [-PAD, 760]];
  roughPoly(g, top, late ? '#b77e6a' : '#a89a88', { amp: 1, seed: 5 });
  g.save(); g.beginPath(); roughPath(g, top, { amp: 1, seed: 5 }); g.clip();
  vgr(g, -PAD, 520, W, H, [[0, rgba(late ? '#ffcf96' : '#f3efe2', .35)], [1, rgba('#1a1424', .3)]]);
  g.strokeStyle = rgba('#3a2a30', .35); g.lineWidth = 1.2;
  for (let k = 1; k < 6; k++) { const q = k / 6; g.beginPath(); for (let i = 0; i <= 20; i++) { const u = i / 20, a = BACK(u), b = EDGE(u); i ? g.lineTo(mix(a[0], b[0], q), mix(a[1], b[1], q)) : g.moveTo(mix(a[0], b[0], q), mix(a[1], b[1], q)); } g.stroke(); }
  for (let i = 0; i < 40; i++) { const u = Math.pow(i / 40, .8), a = BACK(u), b = EDGE(u); g.globalAlpha = .5; g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); }
  g.globalAlpha = 1; hatch(g, [-PAD, 600, 900, 600], { angle: .5, gap: 8, col: '#2a1a24', a: .15, seed: 7, broken: .5 });
  g.restore();
  // wall face below the edge
  const face = [EDGE(0), EDGE(1), [EDGE(1)[0] + 6, EDGE(1)[1] + 14], [EDGE(0)[0] + 60, H + PAD]];
  roughPoly(g, face, late ? '#4a2a3a' : '#3a4048', { amp: .8, seed: 6 });
  g.strokeStyle = rgba(late ? '#ffcf96' : '#f3efe2', .55); g.lineWidth = 2; g.beginPath(); g.moveTo(...EDGE(0)); g.lineTo(...EDGE(1)); g.stroke();
  stip(c, { k: .3, seed: late ? 8 : 9 });
  return c;
}
export function drawHarbour(ctx, t, s, K) {
  const late = sm(lin(K.aft - .4, K.end - .4, t)), dropT = lin(K.end - .9, K.end + .3, t);
  const cam = { x: drift(t, 8, 9) + 40 * eio(lin(K.start, K.end, t)), y: drift(t, 5, 10) + 120 * ein(lin(K.end - .55, K.end + .3, t)), z: 1.03 + .07 * eio(lin(K.start, K.end, t)) };
  const LE = once('hb:e', () => harbourLayers(false)), LL = once('hb:l', () => harbourLayers(true));
  lay(ctx, LE, cam, 1); if (late > 0) lay(ctx, LL, cam, 1, { a: late });
  ctx.save(); camTo(ctx, cam, 1);
  // the sun arcs across the afternoon
  const q = eio(lin(K.aft - .5, K.end - .2, t)), sx = mix(520, 1560, q), sy = 430 - Math.sin(Math.PI * mix(.38, 1, q)) * 300 + 60 * q;
  ctx.save(); ctx.beginPath(); ctx.rect(-200, -200, W + 400, HZ + 200); ctx.clip(); ctx.fillStyle = mixHex('#fff6e0', '#ffd08a', late); ctx.beginPath(); ctx.arc(sx, sy, 34, 0, 7); ctx.fill(); ctx.restore();
  glowA(ctx, sx, sy, 300, .35 + .2 * late, late > .5 ? '#ff9a5a' : '#ffe2b0', '#fff1cf');
  // glitter under the sun
  { const rr = prng(4); ctx.strokeStyle = '#fff1cf'; for (let i = 0; i < 70; i++) { const y = HZ + 6 + Math.pow(rr(), 1.4) * 420, spread = 30 + (y - HZ) * .5, x = sx + (rr() - .5) * spread * 2 + Math.sin(t * 1.3 + i) * 6; if (x > EDGE(clamp((1080 - y) / 540))[0] - 20 && y > 540) continue; ctx.globalAlpha = (.25 + .5 * rr()) * (.5 + .5 * Math.sin(t * 3 + i * 2.3)); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 6 + (y - HZ) * .04, y); ctx.stroke(); } ctx.globalAlpha = 1; }
  // a small sail far out drifting
  { const x = 1180 + (t - K.start) * 9, y = HZ - 2; ctx.fillStyle = mixHex('#f3efe2', '#ffd9b0', late); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 6, y - 26); ctx.lineTo(x + 14, y); ctx.fill(); ctx.fillStyle = '#3a2a3a'; ctx.fillRect(x - 3, y, 20, 3); }
  // the bollard (foreground) and the gull: comes in from the balcony cut and lands on it
  const BX = BOL[0], BY = BOL[1];
  roughPoly(ctx, [[BX - 40, BY], [BX - 34, BY - 70], [BX - 46, BY - 84], [BX + 46, BY - 84], [BX + 34, BY - 70], [BX + 40, BY]], '#2a2430', { amp: .8, seed: 3 });
  ctx.fillStyle = rgba(late ? '#ffcf96' : '#f3efe2', .45); ctx.fillRect(BX + 22, BY - 70, 8, 68); ctx.fillStyle = '#1a1420'; ctx.beginPath(); ctx.ellipse(BX, BY - 84, 46, 9, 0, 0, 7); ctx.fill();
  { const u = lin(K.start - .25, K.start + 1.25, t), e = 1 - Math.pow(1 - u, 2), P0 = [1610, 170], P1 = [1880, 40], P2 = [1000, 260], P3 = [BX - 4, BY - 92];
    const bz = (k) => (1 - e) ** 3 * P0[k] + 3 * (1 - e) ** 2 * e * P1[k] + 3 * (1 - e) * e * e * P2[k] + e ** 3 * P3[k];
    if (u < 1) { const dx = 3 * (1 - e) ** 2 * (P1[0] - P0[0]) + 6 * (1 - e) * e * (P2[0] - P1[0]) + 3 * e * e * (P3[0] - P2[0]); bird(ctx, bz(0), bz(1), 1.8 + 1.2 * e, t * (u > .8 ? 30 : 12) + (u < .5 ? 0 : 1), dx >= 0 ? 1 : -1, '#eeeae2'); }
    else birdSit(ctx, BX - 4, BY - 88, 2.4, t, '#eeeae2'); }
  // the two friends at the edge, legs over the water; cherries between them
  const F1 = EDGE(.37), F2 = EDGE(.58), s1 = 2.35, s2 = 2.0;
  const light = { x: sx, y: sy, col: '#ffd59a', a: .5 + .2 * late };
  const talk = Math.sin(t * 2.1) * .5 + .5, eat = Math.max(0, Math.sin((t - K.start) * 1.6 - 1));
  const flick = sm(lin(K.end - 1.05, K.end - .8, t)) * (1 - sm(lin(K.end - .75, K.end - .45, t)));
  const sit = (x, y, sc, P, D, rimSide) => fig(ctx, x, y, sc, P, { dress: D, light, rim: '#ffe2b8', rimSide, rimW: 3, shadeA: .14, shadeCol: late > .5 ? '#2a1430' : '#14202a' });
  footShadow(ctx, F1[0] - 20, F1[1] + 6, 90, .3); footShadow(ctx, F2[0] - 20, F2[1] + 6, 80, .3);
  sit(F1[0], F1[1] - 4, s1, { lean: -.06 + .05 * talk, head: -.1 + .12 * Math.sin(t * 1.4), sh: [.6 + .5 * talk, .2], el: [1.1, .8], hip: [1.45, 1.35], kn: [1.55 + .15 * Math.sin(t * 2), 1.45 + .15 * Math.sin(t * 2 + 1.5)], hair: 'cap', bulk: 1.1 }, { coat: '#3a5a6a', pants: '#2a2a34', skin: '#d9a77e', hair: '#40382f', hairBack: '#c9c2b6' }, -1);
  { const [bx, by] = EDGE(.475); ctx.fillStyle = '#e9ddc8'; ctx.beginPath(); ctx.moveTo(bx - 14, by - 26); ctx.lineTo(bx + 18, by - 30); ctx.lineTo(bx + 12, by - 2); ctx.lineTo(bx - 10, by); ctx.fill(); const rr = prng(9); for (let i = 0; i < 9; i++) { ctx.fillStyle = i % 3 ? '#b0202a' : '#7a1020'; ctx.beginPath(); ctx.arc(bx - 8 + rr() * 22, by - 30 + rr() * 8, 5, 0, 7); ctx.fill(); } }
  const f2 = sit(F2[0], F2[1] - 4, s2, { lean: .02 - .06 * flick, head: -.05 + .1 * Math.sin(t * 1.1 + 1), sh: [.4 + 1.6 * eat * (1 - flick) + 1.4 * flick, .1], el: [1.6 * eat * (1 - flick) + .2, .9], hip: [1.4, 1.5], kn: [1.4 + .2 * Math.sin(t * 1.7 + 2), 1.5 + .2 * Math.sin(t * 1.7)], hair: 'grey', bulk: 1.05, skirt: true }, { coat: '#c4482a', pants: '#2a2034', skin: '#e2b296', hair: '#d8d0c8', hairBack: '#c9c2b6', skirt: '#5a3448' }, -1);
  // the cherry stone: flicked out over the water, falls toward the bottom of the frame (the camera follows it down)
  if (dropT > 0) { const [hx, hy] = f2.hand(0), u = dropT, x = hx + 260 * u, y = hy - 220 * u + 1300 * u * u; ctx.fillStyle = '#5a1a1a'; ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.fill(); ctx.strokeStyle = rgba('#fff1cf', .35); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 6, y - 14); ctx.lineTo(x, y); ctx.stroke(); }
  ctx.restore();
  finish(ctx, { vig: .34, vigCol: late > .5 ? '#1a0c24' : '#0a1a24' });
}
