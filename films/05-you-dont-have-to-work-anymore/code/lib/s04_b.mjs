// Chapter 04, window 2 (part 1): 4.09 kitchen (mother pours tea) · 4.10 garden (father, the apple).
import { roughPath, roughPoly, roughRect, roughLine, sagLine, hatch, bloom, cone, fog, vnoise, fbm, stratus, limb, qpts } from './art.mjs';
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, sm, lin, eio, eout, ein, qio, drift, HOT, once, lay, T, camTo, fig, handAt, glowA, finish, lightSprite, spr, stip, putL, mkL, vgr, softLight, smear, footShadow } from './s04_util.mjs';

// =====================================================================================================================
// 4.09 · the kitchen (H2 look): afternoon light through the window, mother pours, you sit with your forearms on the table
// =====================================================================================================================
const KW = { x0: 826, x1: 1440, y0: 73, y1: 553 }, TT = 802, FLY = 693;
const MOM = { x: 560, y: 782, s: 3.9 }, YOU = { x: 1430, y: 958, s: 3.9 };
const POUR_POSE = (k) => ({ lean: .16 + .06 * k, head: .2 + .08 * k, sh: [1.12 + .32 * k, .5], el: [.5 - .2 * k, .75], hip: [.03, -.05], kn: [0, .04], hair: 'bun', skirt: true, bulk: 1.12 });
function kitchenLayers() {
  return once('kitchen', () => {
    const r = prng(5), PAD = 160;
    const [bc, bx] = mkL(PAD);
    // wall + floor
    vgr(bx, -PAD, -PAD, W + 2 * PAD, FLY + PAD, [[0, '#3e2440'], [.55, '#5e3648'], [1, '#6a3c4a']]);
    vgr(bx, -PAD, FLY, W + 2 * PAD, H - FLY + PAD, [[0, '#2c1a2c'], [1, '#170e1c']]);
    roughRect(bx, -PAD, FLY - 14, W + 2 * PAD, 14, '#2a1830', { amp: .8, seed: 2 });
    // faint wallpaper stripes
    bx.save(); bx.globalAlpha = .07; for (let x = -PAD; x < W + PAD; x += 46) { bx.fillStyle = '#e8a3a0'; bx.fillRect(x + (r() - .5) * 2, -PAD, 2, FLY + PAD); } bx.restore();
    // outside the window: afternoon sky, soft hills, a poplar row
    bx.save(); bx.beginPath(); bx.rect(KW.x0, KW.y0, KW.x1 - KW.x0, KW.y1 - KW.y0); bx.clip();
    vgr(bx, KW.x0, KW.y0, KW.x1 - KW.x0, KW.y1 - KW.y0, [[0, '#e9906c'], [.6, '#ffc893'], [1, '#ffe2b2']]);
    softLight(bx, 1250, 380, 260, '#fff2d6', .9);
    const hill = (base, amp, f, seed, col) => { const n = vnoise(seed), pts = [[KW.x0, KW.y1]]; for (let x = KW.x0; x <= KW.x1; x += 8) pts.push([x, base - amp * fbm(n, x * f, seed, 3)]); pts.push([KW.x1, KW.y1]); roughPoly(bx, pts, col, { amp: 1, seed }); };
    hill(470, 90, .004, 3, '#c98a7a'); hill(510, 70, .006, 5, '#9a6274');
    for (let i = 0; i < 9; i++) { const x = KW.x0 + 40 + i * 62 + r() * 20, y = 520 - r() * 10, h = 60 + r() * 50; bx.fillStyle = '#6e4258'; bx.beginPath(); bx.ellipse(x, y - h / 2, 10 + r() * 6, h / 2, 0, 0, 7); bx.fill(); }
    hill(560, 40, .008, 7, '#5a3448');
    bx.restore();
    // window frame, mullions, sill + a plant
    bx.strokeStyle = '#5a3248'; bx.lineWidth = 16; bx.beginPath(); roughPath(bx, [[KW.x0, KW.y0], [KW.x1, KW.y0], [KW.x1, KW.y1], [KW.x0, KW.y1]], { amp: .8, seed: 3 }); bx.stroke();
    roughRect(bx, (KW.x0 + KW.x1) / 2 - 6, KW.y0, 12, KW.y1 - KW.y0, '#5a3248', { amp: .5, seed: 4 }); roughRect(bx, KW.x0, 300, KW.x1 - KW.x0, 11, '#5a3248', { amp: .5, seed: 5 });
    roughRect(bx, KW.x0 - 26, KW.y1 + 2, KW.x1 - KW.x0 + 52, 20, '#7a4a5a', { amp: .6, seed: 6 }); roughRect(bx, KW.x0 - 26, KW.y1 + 20, KW.x1 - KW.x0 + 52, 8, '#3a2034', { amp: .4, seed: 7 });
    { const x = 1330, y = KW.y1 + 2; roughPoly(bx, [[x - 26, y - 44], [x + 26, y - 44], [x + 20, y], [x - 20, y]], '#8a4a3a', { amp: .5, seed: 8 }); for (let k = 0; k < 7; k++) { bx.fillStyle = k % 2 ? '#3a5a4a' : '#4a6a52'; bx.beginPath(); bx.ellipse(x + (k - 3) * 9, y - 70 + Math.abs(k - 3) * 6, 7, 26, (k - 3) * .3, 0, 7); bx.fill(); } }
    // shelf with jars (left), framed photo (right)
    roughRect(bx, 110, 330, 540, 14, '#2e1a30', { amp: .6, seed: 9 }); roughRect(bx, 130, 344, 10, 30, '#2e1a30', { amp: .3, seed: 10 }); roughRect(bx, 620, 344, 10, 30, '#2e1a30', { amp: .3, seed: 11 });
    for (let i = 0; i < 6; i++) { const x = 140 + i * 82, h = 70 + (i % 3) * 12, col = ['#c98f6a', '#e8a3a0', '#7a5a8c', '#d9b070', '#a0603a', '#e8c0a0'][i]; roughRect(bx, x, 330 - h, 56, h, col, { amp: .6, seed: 20 + i }); roughRect(bx, x - 3, 330 - h - 10, 62, 12, shade(col, -.15), { amp: .4, seed: 30 + i }); bx.fillStyle = 'rgba(255,235,210,.18)'; bx.fillRect(x + 8, 330 - h + 6, 9, h - 12); }
    roughRect(bx, 1560, 180, 200, 240, '#2e1a30', { amp: .8, seed: 12 }); roughRect(bx, 1578, 198, 164, 204, '#b98a7a', { amp: .6, seed: 13 });
    { bx.fillStyle = '#6a4252'; bx.beginPath(); bx.arc(1660, 270, 30, 0, 7); bx.fill(); bx.beginPath(); bx.ellipse(1660, 372, 56, 50, 0, Math.PI, 0); bx.fill(); bx.beginPath(); bx.arc(1712, 296, 20, 0, 7); bx.fill(); bx.beginPath(); bx.ellipse(1712, 372, 36, 40, 0, Math.PI, 0); bx.fill(); }
    // light: window bloom on the wall, the beam across the room onto the table + floor (stippled)
    { const [lc, lx] = mkL(PAD);
      softLight(lx, 1133, 320, 640, '#ffcf96', .5);
      lx.fillStyle = (() => { const g = lx.createLinearGradient(0, KW.y1, 0, H); g.addColorStop(0, rgba('#ffd59a', .2)); g.addColorStop(1, rgba('#ffd59a', 0)); return g; })();
      lx.beginPath(); lx.moveTo(KW.x0, KW.y1); lx.lineTo(KW.x1, KW.y1); lx.lineTo(1700, H + 60); lx.lineTo(620, H + 60); lx.fill();
      stip(lc, { k: .45, seed: 3 }); putL(bx, lc, { op: 'screen' }); }
    // shadow hatching on the far-from-window walls
    { bx.save(); bx.beginPath(); bx.rect(-PAD, -PAD, 700 + PAD, FLY + PAD); bx.clip(); hatch(bx, [-PAD, -PAD, 860, FLY + PAD], { angle: .9, gap: 7, w: 1.1, col: '#1a0c1e', a: .3, seed: 3, broken: .4 }); bx.restore();
      const g = bx.createLinearGradient(-PAD, 0, 800, 0); g.addColorStop(0, rgba('#12081a', .5)); g.addColorStop(1, rgba('#12081a', 0)); bx.fillStyle = g; bx.fillRect(-PAD, -PAD, 960, H + 2 * PAD); }
    // your chair back (behind you)
    roughRect(bx, 1520, 600, 22, 480, '#24142a', { amp: .6, seed: 14 }); roughRect(bx, 1500, 610, 60, 16, '#2e1a34', { amp: .4, seed: 15 }); roughRect(bx, 1520, 720, 22, 10, '#3a2238', { amp: .3, seed: 16 });
    // ---- front: the table with a striped cloth, its edge catching the window light
    const [fc, fx] = mkL(PAD);
    roughRect(fx, 330, TT - 6, 1150, 22, '#3d2840', { amp: .6, seed: 40 });
    roughPoly(fx, [[330, TT + 14], [1480, TT + 14], [1470, TT + 60], [340, TT + 60]], '#2e1c30', { amp: .6, seed: 41 });
    roughRect(fx, 380, TT + 58, 30, H - TT, '#24142a', { amp: .5, seed: 42 }); roughRect(fx, 1400, TT + 58, 30, H - TT, '#24142a', { amp: .5, seed: 43 });
    // cloth runner
    roughPoly(fx, [[560, TT - 7], [1260, TT - 7], [1270, TT + 120], [550, TT + 120]], '#e9ddc8', { amp: .8, seed: 44 });
    fx.save(); fx.beginPath(); roughPath(fx, [[560, TT - 7], [1260, TT - 7], [1270, TT + 120], [550, TT + 120]], { amp: .8, seed: 44 }); fx.clip();
    for (let x = 560; x < 1280; x += 36) { fx.fillStyle = rgba('#c46a6a', .55); fx.fillRect(x, TT - 10, 8, 140); }
    { const g = fx.createLinearGradient(0, TT, 0, TT + 120); g.addColorStop(0, rgba('#fff2d6', .25)); g.addColorStop(.3, rgba('#000', 0)); g.addColorStop(1, rgba('#1a0c1e', .55)); fx.fillStyle = g; fx.fillRect(540, TT - 10, 760, 140); }
    fx.restore();
    roughRect(fx, 540, TT - 9, 600, 3, rgba('#ffe2b2', .7), { amp: .3, seed: 45 });
    // floor shadow under the table, hatched
    vgr(fx, 300, TT + 58, 1260, H - TT, [[0, rgba('#0a0410', .75)], [1, rgba('#0a0410', .55)]]);
    fx.save(); fx.beginPath(); fx.rect(330, TT + 60, 1150, H - TT); fx.clip(); hatch(fx, [330, TT + 60, 1150, 400], { angle: -.3, gap: 6, w: 1, col: '#0a0410', a: .4, seed: 5 }); fx.restore();
    return { back: bc, front: fc };
  });
}
function teapot(ctx, x, y, s, ang) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  ctx.fillStyle = '#ece3d2'; ctx.beginPath(); ctx.ellipse(0, 0, 30, 22, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(24, -4); ctx.lineTo(50, -18); ctx.lineTo(53, -12); ctx.lineTo(28, 7); ctx.fill();
  ctx.fillRect(-7, -27, 14, 7); ctx.beginPath(); ctx.arc(0, -28, 4, 0, 7); ctx.fill();
  ctx.strokeStyle = '#ece3d2'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(-32, 0, 12, 1.9, 4.4); ctx.stroke();
  const g = ctx.createLinearGradient(-30, -22, 30, 22); g.addColorStop(0, 'rgba(120,80,110,.45)'); g.addColorStop(.6, 'rgba(255,240,215,0)'); g.addColorStop(1, 'rgba(255,240,215,.5)'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, 30, 22, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = rgba('#c46a6a', .7); ctx.lineWidth = 2.2; ctx.beginPath(); ctx.ellipse(0, 2, 26, 6, 0, 0, Math.PI); ctx.stroke();
  ctx.restore();
  return [x + Math.cos(ang) * 51.5 * s - Math.sin(ang) * -15 * s, y + Math.sin(ang) * 51.5 * s + Math.cos(ang) * -15 * s];   // spout tip
}
function cup(ctx, cx, y, s) {
  ctx.fillStyle = '#ece3d2'; ctx.beginPath(); ctx.moveTo(cx - 18 * s, y - 38 * s); ctx.lineTo(cx + 18 * s, y - 38 * s); ctx.lineTo(cx + 14 * s, y - 6 * s); ctx.lineTo(cx - 14 * s, y - 6 * s); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#ece3d2'; ctx.lineWidth = 4 * s; ctx.beginPath(); ctx.arc(cx + 20 * s, y - 23 * s, 8 * s, -1.4, 1.4); ctx.stroke();
  ctx.fillStyle = 'rgba(90,50,80,.35)'; ctx.fillRect(cx - 18 * s, y - 38 * s, 10 * s, 32 * s);
  ctx.fillStyle = '#d9cbb4'; ctx.beginPath(); ctx.ellipse(cx, y - 4 * s, 28 * s, 5 * s, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#7a3a1a'; ctx.beginPath(); ctx.ellipse(cx, y - 36 * s, 15 * s, 3 * s, 0, 0, 7); ctx.fill();
}
export function drawKitchen(ctx, t, s, K) {
  const L = kitchenLayers();
  const whip = ein(lin(K.end - .55, K.end + .3, t));
  const cam = { x: drift(t, 10, 1) + whip * 900 + 30 * lin(K.start, K.end, t), y: drift(t, 6, 2), z: 1.04 + .03 * lin(K.start, K.end, t) };
  lay(ctx, L.back, cam, .92);
  // dust motes in the beam
  { const tr = camTo(ctx, cam, .95), rr = prng(9); ctx.fillStyle = '#ffe9c4'; for (let i = 0; i < 70; i++) { const x0 = 900 + rr() * 600, y0 = 560 + rr() * 300, x = x0 + Math.sin(t * .3 + i) * 20 + (t * 6 % 40), y = y0 - ((t * (4 + rr() * 6) + i * 13) % 120); ctx.globalAlpha = .25 * rr() * (1 - Math.abs(y - 700) / 300); ctx.fillRect(x, y, 2, 2); } ctx.globalAlpha = 1; ctx.setTransform(1, 0, 0, 1, 0, 0); void tr; }
  ctx.save(); camTo(ctx, cam, 1);
  // pour timing: tilt in before "love", stream through it, set back
  const tilt = sm(lin(K.love - .45, K.love - .05, t)) * (1 - sm(lin(K.love + 1.0, K.love + 1.5, t)));
  const turn = sm(lin(K.end - .8, K.end - .2, t));   // she turns the pot's handle toward you (the gesture the camera follows)
  const pose = POUR_POSE(tilt);
  const by = Math.sin(t * 1.5) * 2.5;
  const mom = fig(ctx, MOM.x, MOM.y + by, MOM.s, pose, { dress: { coat: '#b0607a', pants: '#3a2238', shoes: '#1a0e18', skin: '#e2b296', hair: '#d8d0c8', skirt: '#5a3448' }, light: { x: 1133, y: 300, col: '#ffcf96', a: .5 }, rim: '#ffd9a8', rimSide: 1, rimW: 4.5, shadeA: .12, shadeCol: '#2a1020' });
  // you: seated, forearms on the table, head tilted toward her
  const yb = Math.sin(t * 1.3 + 1) * 2;
  fig(ctx, YOU.x, YOU.y + yb, YOU.s, { lean: .1, head: .18 + .06 * Math.sin(t * .7), sh: [1.3, 1.0], el: [.45, .7], hip: [1.52, 1.45], kn: [1.48, 1.4], hair: 'curly', bulk: 1.05 }, { flip: true, dress: { coat: '#d9893a', pants: '#2a2034', shoes: '#140c14', skin: '#e9c3a0', hair: '#2a1a14' }, light: { x: 1133, y: 300, col: '#ffd9a8', a: .55 }, rim: '#ffe2b8', rimSide: -1, rimW: 4.5, shadeA: .1, shadeCol: '#2a1020' });
  ctx.restore();
  lay(ctx, L.front, cam, 1.0);
  ctx.save(); camTo(ctx, cam, 1);
  // teapot in her hand, the stream, the cups, steam
  const [hx, hy] = mom.hand(0);
  const ang = .25 + .7 * tilt - .25 * turn;
  const [sx, sy] = teapot(ctx, hx + 26, hy + 6, 1.95, ang);
  const cupX = 1010, cupY = TT - 2;
  cup(ctx, cupX, cupY, 1.9); cup(ctx, 1230, cupY, 1.9);
  if (tilt > .6) { const a = sm(lin(.6, .85, tilt)); ctx.strokeStyle = rgba('#e8b070', .85 * a); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.bezierCurveTo(sx + 14, sy + 10, cupX - 4, cupY - 140, cupX + Math.sin(t * 11) * 1.5, cupY - 70); ctx.stroke(); glowA(ctx, cupX, cupY - 72, 26, .3 * a, C.amber, HOT); }
  // biscuits on a plate
  ctx.fillStyle = '#d9cbb4'; ctx.beginPath(); ctx.ellipse(780, TT - 6, 60, 10, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#c98f6a'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(752 + i * 20, TT - 14, 13, 8, 0, 0, 7); ctx.fill(); }
  // steam from both cups (drifting, never still)
  for (const [cx0, k0] of [[1230, 0], [cupX, 1]]) for (let k = 0; k < 3; k++) { const a = (.3 - k * .07) * (k0 ? sm(lin(K.love + .3, K.love + 1.2, t)) : 1); ctx.strokeStyle = rgba('#f3efe2', a); ctx.lineWidth = 5; ctx.beginPath(); const y0 = cupY - 76; ctx.moveTo(cx0 + k * 10 - 10, y0); ctx.bezierCurveTo(cx0 - 16 + k * 14 + Math.sin(t * 1.1 + k) * 10, y0 - 70, cx0 + 26 + Math.sin(t * .9 + k * 2) * 14, y0 - 130 - k * 14, cx0 + Math.sin(t * 1.4 + k) * 22, y0 - 230 - k * 30); ctx.stroke(); }
  ctx.restore();
  glowA(ctx, T(cam, .92).X(1133), T(cam, .92).Y(320), 700, .08, C.amber, HOT);
  finish(ctx, { vig: .38, vigCol: '#12081a' });
  if (whip > .02) smear(ctx, ctx.canvas, -whip * 260, 0, .9);
}

// =====================================================================================================================
// 4.10 · the garden at late gold (A3 palette): father in a garden chair, you on the grass peeling an apple,
// you pass him a slice on "lived"; the low sun is the next carrier
// =====================================================================================================================
export const SUN_G = [1480, 430];
const GOLD = '#ffc477', CREAM = '#fff1cf', ORANGE = '#ff6a3a';
const gr = (x) => 742 + 18 * Math.sin(x * .002 + 1) + (x - 960) * .012;   // lawn horizon (hedge foot)
function gardenLayers() {
  return once('garden', () => {
    const PAD = 220, n = vnoise(12);
    // sky + sun + clouds + far hills (p .5)
    const [sc, sx] = mkL(PAD);
    vgr(sx, -PAD, -PAD, W + 2 * PAD, 900 + PAD, [[0, '#0f3236'], [.3, '#1f5552'], [.58, '#9a8a5c'], [.78, '#f0a160'], [1, '#f7cf8e']]);
    softLight(sx, SUN_G[0], SUN_G[1], 900, GOLD, .6);
    { const [hc, hx] = mkL(PAD); hx.save(); hx.beginPath(); for (const [y, x0, x1, th] of [[330, 900, 2200, 26], [380, 1150, 1800, 12], [260, 1200, 2200, 20], [210, -300, 600, 20]]) stratus(hx, y, x0, x1, th, y); hx.fillStyle = rgba('#e88a58', .55); hx.fill(); hx.clip(); hatch(hx, [-PAD, 150, W + 2 * PAD, 280], { angle: -.015, gap: 4, w: 1.1, col: '#ffd9a4', a: .6, seed: 5, broken: .3 }); hx.restore(); putL(sx, hc); }
    sx.fillStyle = CREAM; sx.beginPath(); roughPath(sx, Array.from({ length: 48 }, (_, i) => [SUN_G[0] + Math.cos(i / 48 * 6.283) * 62, SUN_G[1] + Math.sin(i / 48 * 6.283) * 62]), { amp: .8, seed: 2 }); sx.fill();
    { const [bc2, bx2] = mkL(PAD); softLight(bx2, SUN_G[0], SUN_G[1], 300, GOLD, .7); stip(bc2, { k: .35, seed: 4 }); putL(sx, bc2, { op: 'screen' }); }
    const ridge = (base, amp, f, seed) => (x) => base - amp * fbm(vnoise(seed), x * f, seed * .37, 4);
    for (const [i, L] of [{ f: ridge(600, 60, .0022, 3), col: '#b39a73', mist: '#f5c58e' }, { f: ridge(650, 90, .0018, 5), col: '#7a8a5a', mist: '#e9b884' }].entries()) {
      const pts = [[-PAD, H + PAD]]; for (let x = -PAD; x <= W + PAD; x += 8) pts.push([x, L.f(x)]); pts.push([W + PAD, H + PAD]);
      roughPoly(sx, pts, L.col, { amp: 1.2, seed: i });
      sx.save(); sx.beginPath(); roughPath(sx, pts, { amp: 1.2, seed: i }); sx.clip(); softLight(sx, SUN_G[0], SUN_G[1], 1100, GOLD, .4 - i * .1);
      sx.strokeStyle = '#fbe0b0'; sx.lineCap = 'round'; const rr = prng(40 + i); for (let k = 1; k < 16; k++) { const off = k * (6 + i * 3); let x = -PAD + rr() * 60; while (x < W + PAD) { const len = 30 + rr() * 160; sx.globalAlpha = .35 * rr(); sx.lineWidth = 1; sx.beginPath(); for (let xx = x; xx < x + len; xx += 6) sx.lineTo(xx, L.f(xx) + off + (n(xx * .02, k) - .5) * 3); sx.stroke(); x += len + 20 + rr() * 70; } } sx.globalAlpha = 1;
      sx.restore();
      fog(sx, { y0: L.f(SUN_G[0]) - 20, y1: L.f(SUN_G[0]) + 90, col: L.mist, a: .5 - i * .1, seed: 20 + i, cover: .75, soft: .45, k: .3, sx: .003, sy: .03 });
    }
    // garden (p .85): hedge + a low stone wall, lawn with grass strokes and flowers
    const [gc, gx] = mkL(PAD);
    { const pts = [[-PAD, H + PAD]]; for (let x = -PAD; x <= W + PAD; x += 10) pts.push([x, gr(x) - 70 - 22 * fbm(n, x * .01, 3, 3)]); pts.push([W + PAD, H + PAD]);
      roughPoly(gx, pts, '#1e3a26', { amp: 2, seed: 30 });
      gx.save(); gx.beginPath(); roughPath(gx, pts, { amp: 2, seed: 30 }); gx.clip(); softLight(gx, SUN_G[0], SUN_G[1] + 200, 1000, '#d9a85a', .35);
      const rr = prng(31); for (let i = 0; i < 900; i++) { const x = rr() * (W + 2 * PAD) - PAD, y = gr(x) - 80 + rr() * 60; gx.strokeStyle = x > 900 && rr() < .6 ? '#e8b46a' : '#3e6a44'; gx.globalAlpha = .3 + .4 * rr(); gx.lineWidth = 1.2; gx.beginPath(); gx.arc(x, y, 5 + rr() * 8, Math.PI * 1.1, Math.PI * 1.85); gx.stroke(); } gx.globalAlpha = 1; gx.restore(); }
    { const pts = [[-PAD, gr(-PAD)], ...Array.from({ length: 60 }, (_, i) => { const x = -PAD + i / 59 * (W + 2 * PAD); return [x, gr(x)]; }), [W + PAD, H + PAD], [-PAD, H + PAD]];
      roughPoly(gx, pts, '#2c5232', { amp: 1.5, seed: 32 });
      gx.save(); gx.beginPath(); roughPath(gx, pts, { amp: 1.5, seed: 32 }); gx.clip();
      vgr(gx, -PAD, 700, W + 2 * PAD, H - 700 + PAD, [[0, rgba('#d9a85a', .35)], [.3, rgba('#d9a85a', .08)], [1, rgba('#06120b', .5)]]);
      const rr = prng(8); for (let i = 0; i < 9000; i++) { const x = rr() * (W + 2 * PAD) - PAD, y0 = gr(x), y = y0 + Math.pow(rr(), 1.6) * (H + PAD - y0), d = (y - y0) / (H - y0 + 1), l = 3 + rr() * 9 * (1 + d * 2); gx.strokeStyle = rr() < .5 - d * .35 ? '#e8c27a' : '#4f7a4a'; gx.globalAlpha = (.18 + .5 * rr()) * (1 - d * .4); gx.lineWidth = 1; gx.beginPath(); gx.moveTo(x, y); gx.lineTo(x + (rr() - .3) * 4, y - l); gx.stroke(); }
      gx.globalAlpha = 1; for (let i = 0; i < 140; i++) { const x = rr() * (W + 2 * PAD) - PAD, y = gr(x) + 20 + Math.pow(rr(), 1.4) * 320; gx.fillStyle = rr() < .6 ? '#ffb35c' : '#e8553a'; gx.globalAlpha = .5 + .4 * rr(); gx.beginPath(); gx.arc(x, y, 1.2 + rr() * 2.4 * (y - 700) / 300, 0, 7); gx.fill(); } gx.globalAlpha = 1;
      gx.restore(); }
    // the apple tree (p 1.15), framing the left: trunk, lobes, red apples, orange rim toward the sun
    const [tc, tx] = mkL(PAD);
    { const bx = 230, by = 900; const rr = prng(41);
      roughPoly(tx, [[bx - 46, by + 200], [bx - 26, by - 140], [bx - 40, by - 300], [bx - 90, by - 380], [bx - 70, by - 390], [bx - 14, by - 330], [bx + 8, by - 420], [bx + 30, by - 414], [bx + 26, by - 310], [bx + 100, by - 380], [bx + 116, by - 368], [bx + 38, by - 260], [bx + 34, by - 120], [bx + 56, by + 200]], '#1a140e', { amp: 2.5, seed: 40 });
      const lobes = [[bx - 160, by - 520, 170], [bx + 60, by - 620, 190], [bx + 270, by - 520, 140], [bx - 300, by - 420, 140], [bx + 150, by - 420, 110], [bx - 60, by - 760, 140]];
      const [cc, cx2] = mkL(PAD);
      const blob = (g, x, y, r0, seed) => { g.beginPath(); roughPath(g, Array.from({ length: 30 }, (_, i) => { const a = i / 30 * 6.283; return [x + Math.cos(a) * r0 * (1 + .14 * Math.sin(a * 3 + seed)), y + Math.sin(a) * r0 * .72 * (1 + .1 * Math.cos(a * 4 + seed))]; }), { amp: 4, step: 9, seed }); g.fill(); };
      const parts = []; for (const [lx, ly, lr] of lobes) for (let k = 0; k < 7; k++) { const a = rr() * 6.283, d = Math.sqrt(rr()) * lr * .6; parts.push([lx + Math.cos(a) * d, ly + Math.sin(a) * d * .7, lr * (.35 + rr() * .3)]); }
      cx2.fillStyle = '#163020'; for (const [i, [x, y, r0]] of parts.entries()) blob(cx2, x, y, r0, i);
      for (const [lx, ly] of lobes) limb(cx2, qpts([bx + 6, by - 260], [mix(bx, lx, .25), mix(by - 300, ly, .75) + 30], [lx, ly + 30]), 24, 6, '#1a140e', Math.round(lx));
      const [rc, rx] = mkL(PAD); rx.drawImage(cc, -PAD, -PAD); rx.globalCompositeOperation = 'source-in'; rx.fillStyle = '#ff9a55'; rx.fillRect(-PAD, -PAD, W + 2 * PAD, H + 2 * PAD);
      tx.save(); tx.globalAlpha = .85; tx.drawImage(rc, -PAD + 3, -PAD - 2); tx.restore();
      cx2.globalCompositeOperation = 'source-atop';
      for (const [i, [x, y, r0]] of parts.entries()) { const g = cx2.createLinearGradient(x + r0 * .7, y - r0 * .6, x - r0 * .6, y + r0 * .6); g.addColorStop(0, rgba('#9a7a3a', .45)); g.addColorStop(.4, rgba('#1c3622', .1)); g.addColorStop(1, rgba('#020805', .5)); cx2.fillStyle = g; blob(cx2, x, y, r0 * .98, i); }
      hatch(cx2, [bx - 600, by - 1000, 1000, 800], { angle: .9, gap: 5, w: 1, col: '#020a06', a: .45, seed: 7, broken: .4 });
      for (let i = 0; i < 160; i++) { const [x0, y0, r0] = parts[Math.floor(rr() * parts.length)], a = -1.2 + rr() * 1.4, x = x0 + Math.cos(a) * r0 * .7 * rr(), y = y0 + Math.sin(a) * r0 * .5 * rr(); cx2.strokeStyle = '#f2b06a'; cx2.globalAlpha = .2 + .35 * rr(); cx2.lineWidth = 1.2; cx2.beginPath(); cx2.arc(x, y, 7 + rr() * 12, Math.PI * 1.1, Math.PI * 1.8); cx2.stroke(); }
      cx2.globalAlpha = 1; cx2.globalCompositeOperation = 'source-over';
      for (let i = 0; i < 26; i++) { const [x0, y0, r0] = parts[Math.floor(rr() * parts.length)], x = x0 + (rr() - .5) * r0, y = y0 + (rr() - .2) * r0 * .6; cx2.fillStyle = '#c4382a'; cx2.beginPath(); cx2.arc(x, y, 7 + rr() * 3, 0, 7); cx2.fill(); cx2.fillStyle = rgba('#ffb070', .7); cx2.beginPath(); cx2.arc(x + 2.5, y - 2.5, 2.5, 0, 7); cx2.fill(); }
      putL(tx, cc); }
    // warm haze + sun shafts over everything (static, additive)
    const [hz, hzx] = mkL(PAD);
    for (const [d, sp, a] of [[-1.47, .03, .12], [-1.53, .02, .09], [-1.4, .025, .09], [-1.62, .015, .07]]) cone(hzx, SUN_G[0], SUN_G[1], { dir: d, spread: sp, len: 1500, col: GOLD, a, k: .45, seed: Math.round(d * 100), soft: .6, op: 'screen' });
    return { sky: sc, garden: gc, tree: tc, haze: hz };
  });
}
function gardenChair(ctx, x, y, s) {   // simple wooden garden chair, side view, facing left; x,y = seat front
  const c = '#3a2414', L = (pts, w) => roughLine(ctx, pts, { w: w * s, col: c, seed: Math.round(pts[0][0]) });
  L([[x, y], [x + 70 * s, y + 4 * s]], 9); L([[x + 4 * s, y], [x + 4 * s, y + 90 * s]], 7); L([[x + 66 * s, y + 4 * s], [x + 70 * s, y + 92 * s]], 7);
  L([[x + 64 * s, y], [x + 84 * s, y - 95 * s]], 8); L([[x + 30 * s, y - 50 * s], [x + 80 * s, y - 52 * s]], 6);
  ctx.strokeStyle = rgba('#ffb070', .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 66 * s, y - 2 * s); ctx.lineTo(x + 84 * s, y - 95 * s); ctx.stroke();
}
export function drawGarden(ctx, t, s, K) {
  const L = gardenLayers();
  // lands from the kitchen whip (decelerating), slow push, then glides toward the sun for the push-in
  const land = 1 - eout(lin(K.start - .15, K.start + .5, t)), lean = qio(lin(K.end - 1.2, K.end + .35, t));
  const cam = { x: -land * 700 + drift(t, 8, 3) + mix(30, (SUN_G[0] - 960) * 2, lean), y: drift(t, 5, 4) + mix(150, -112, lean), z: mix(1.32 + .05 * lin(K.start, K.end, t), 1.6, lean) };
  // the sun sinks a little through the shot (the light moves)
  const sink = lin(K.start, K.end, t) * 14;
  lay(ctx, L.sky, cam, .5, { dy: sink * 0 });
  lay(ctx, L.garden, cam, .85);
  ctx.save(); camTo(ctx, cam, .95);
  const sun = [SUN_G[0], SUN_G[1] + sink];
  // father in the chair (right), facing left toward you; you on the grass (left), knees up, peeling the apple
  const FX = 1190, FY = 830, YX = 770, YY = 935, S = 2.3;
  const give = sm(lin(K.lived - .45, K.lived + .1, t)) * (1 - sm(lin(K.lived + 1.4, K.lived + 2.0, t)));
  const take = sm(lin(K.lived - .2, K.lived + .25, t)) * (1 - sm(lin(K.lived + 1.3, K.lived + 1.9, t)));
  // long shadows away from the sun
  ctx.save(); ctx.globalAlpha = .5; for (const [x, y, l] of [[FX + 30, FY + 88 * S * .7, 1], [YX, YY + 40, .8]]) { const g = ctx.createLinearGradient(x, y, x - 420 * l, y + 40); g.addColorStop(0, 'rgba(10,26,16,.8)'); g.addColorStop(1, 'rgba(10,26,16,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x - 200 * l, y + 16, 230 * l, 22, -.05, 0, 7); ctx.fill(); } ctx.restore();
  gardenChair(ctx, FX - 60, FY + 4, S * .9);
  const fp = { lean: -.1 + .08 * take, head: -.05 + .12 * take + .03 * Math.sin(t * .6), sh: [.9 + .55 * take, .6], el: [.9 - .5 * take, 1.0], hip: [1.5, 1.4], kn: [1.4, 1.5], hair: 'cap', bulk: 1.08, coat: .4 };
  const father = fig(ctx, FX, FY + Math.sin(t * 1.2) * 1.5, S, fp, { flip: true, dress: { coat: '#4a5a46', pants: '#2a2a24', shoes: '#14100c', skin: '#d9a77e', hair: '#40382f', hairBack: '#c9c2b6' }, light: { x: sun[0], y: sun[1], col: '#ffb070', a: .6 }, shadeA: .22, shadeCol: '#0a140e', rim: '#ffcf8a', rimSide: 1, rimW: 3 });
  // a blanket over his knees
  roughPoly(ctx, [[FX - 70 * S * .5, FY - 4], [FX + 10, FY - 12], [FX - 10, FY + 70], [FX - 90 * S * .5, FY + 60]], '#c4482a', { amp: 1, seed: 3 });
  ctx.strokeStyle = rgba('#ffcf8a', .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(FX - 80, FY - 6); ctx.lineTo(FX + 8, FY - 12); ctx.stroke();
  // a cane leaning on the chair
  roughLine(ctx, [[FX + 70, FY - 70], [FX + 110, FY + 170]], { w: 5, col: '#2a1a10', seed: 4 });
  // you
  const peel = (t - K.start) * 2.2;
  const yp = { lean: -.05 + .08 * give, head: .25 - .1 * give + .03 * Math.sin(t * .9), sh: [1.0 + .6 * give, .85], el: [1.0 - .8 * give, 1.2 + .05 * Math.sin(peel * 3)], hip: [1.45, 1.3], kn: [.35, .9], hair: 'long' };
  const you = fig(ctx, YX, YY + Math.sin(t * 1.4) * 1.2, S, yp, { dress: { coat: '#e59a3a', pants: '#2a2c3a', shoes: '#14100c', skin: '#e9c3a0', hair: '#3a2214' }, light: { x: sun[0], y: sun[1], col: '#ffd9a0', a: .6 }, shadeA: .18, shadeCol: '#1a120a', rim: '#ffe0a8', rimSide: 1, rimW: 3 });
  // the apple + peel spiral in your hands (back hand holds the apple, the knife hand turns); then a slice passed over
  const [ax, ay] = you.hand(1), [kx, ky] = you.hand(0);
  ctx.fillStyle = '#c4382a'; ctx.beginPath(); ctx.arc(ax + 6, ay - 4, 15, 0, 7); ctx.fill(); ctx.fillStyle = '#f3e2b0'; ctx.beginPath(); ctx.arc(ax + 6, ay - 4, 15, -1.2 + peel, .6 + peel); ctx.lineTo(ax + 6, ay - 4); ctx.fill();
  { ctx.strokeStyle = '#c4382a'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); for (let i = 0; i <= 30; i++) { const q = i / 30, yy = ay + 8 + q * 70, xx = ax + 6 + Math.sin(q * 14 + peel * 2) * (6 + q * 8); i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
  if (give > .05) { const [sx2, sy2] = give > .95 && take > .5 ? father.hand(0) : [kx, ky]; ctx.fillStyle = '#f3e2b0'; ctx.beginPath(); ctx.ellipse(sx2 + 4, sy2 - 2, 10, 5, -.4, 0, 7); ctx.fill(); ctx.strokeStyle = '#c4382a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(sx2 + 4, sy2 - 2, 10, 5, -.4, Math.PI, 2 * Math.PI); ctx.stroke(); }
  else { ctx.strokeStyle = '#d9d0c0'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(kx, ky); ctx.lineTo(kx + 14, ky - 10); ctx.stroke(); }
  ctx.restore();
  lay(ctx, L.tree, cam, 1.15, { dx: Math.sin(t * .5) * 3 });
  lay(ctx, L.haze, cam, .6, { a: .9 });
  glowA(ctx, T(cam, .5).X(SUN_G[0]), T(cam, .5).Y(SUN_G[1]), 520 * T(cam, .5).z, .22 + .3 * lean, ORANGE, GOLD);
  finish(ctx, { vig: .38, vigCol: '#06110c' });
  if (land > .02) smear(ctx, ctx.canvas, -land * 200, 0, .9);
}
