// Chapter 04, window 2 (part 3): the "drifted apart" montage. 4.14a top-down water, two boats drift apart ·
// 4.14b small flats · 4.14c long commutes (a lit lift in a tower) · 4.14d strangers in the lift, the doors open.
import { roughPath, roughPoly, roughRect, roughLine, sagLine, hatch, facade, quadMap, quadIn, vnoise, fbm } from './art.mjs';
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, sm, lin, eio, eout, ein, qio, drift, HOT, once, lay, lay2, T, camTo, fig, glowA, finish, lightSprite, spr, stip, putL, mkL, vgr, softLight, smear, footShadow } from './s04_util.mjs';

// =====================================================================================================================
// 4.14a · top-down water at dusk: the cherry stone lands, its ripple runs out, two boats that were tied drift apart
// =====================================================================================================================
const IMP = [960, 520];
function waterLayer() {
  return once('m1:water', () => {
    const PAD = 300, [c, g] = mkL(PAD, PAD), n = vnoise(14), r = prng(15);
    const rg = g.createRadialGradient(560, 300, 0, 960, 540, 1500); rg.addColorStop(0, '#5a6a7a'); rg.addColorStop(.35, '#2a4458'); rg.addColorStop(1, '#0c1428');
    g.fillStyle = rg; g.fillRect(-PAD, -PAD, W + 2 * PAD, H + 2 * PAD);
    // the sky's warm reflection in one corner (the hero light)
    softLight(g, 420, 200, 900, '#e9a07f', .35);
    // long soft swell lines
    g.lineCap = 'round';
    for (let i = 0; i < 520; i++) { const x = r() * (W + 2 * PAD) - PAD, y = r() * (H + 2 * PAD) - PAD, l = 20 + r() * 90, a = fbm(n, x * .003, y * .003, 3); g.strokeStyle = a > .5 ? '#9ab8c0' : '#06101e'; g.globalAlpha = .08 + .18 * r(); g.lineWidth = 1 + r() * 1.5; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + l / 2, y - 4 + 8 * a, x + l, y + 2); g.stroke(); }
    g.globalAlpha = 1;
    stip(c, { k: .35, seed: 16 });
    return c;
  });
}
function boat(ctx, x, y, ang, s, coat, hair, t, ph) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  // shadow + wake
  ctx.fillStyle = 'rgba(4,8,20,.45)'; ctx.beginPath(); ctx.ellipse(10, 12, 118, 40, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#7a4a30'; ctx.beginPath(); ctx.moveTo(-110, 0); ctx.bezierCurveTo(-90, -40, 60, -42, 112, 0); ctx.bezierCurveTo(60, 42, -90, 40, -110, 0); ctx.fill();
  ctx.fillStyle = '#4a2a1c'; ctx.beginPath(); ctx.moveTo(-96, 0); ctx.bezierCurveTo(-78, -30, 52, -32, 98, 0); ctx.bezierCurveTo(52, 32, -78, 30, -96, 0); ctx.fill();
  ctx.strokeStyle = rgba('#ffcf96', .45); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-104, -6); ctx.bezierCurveTo(-84, -38, 56, -40, 106, -4); ctx.stroke();
  for (const sx of [-50, 34]) roughRect(ctx, sx - 7, -30, 14, 60, '#9a6a44', { amp: .3, seed: sx + 100 });
  // oars resting (slow sway)
  const sw = Math.sin(t * 1.2 + ph) * .06;
  ctx.strokeStyle = '#c49a6a'; ctx.lineWidth = 4; for (const sd of [-1, 1]) { ctx.save(); ctx.translate(-6, sd * 26); ctx.rotate(sd * (.5 + sw)); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-10, sd * 92); ctx.stroke(); ctx.fillStyle = '#c49a6a'; ctx.beginPath(); ctx.ellipse(-12, sd * 100, 6, 14, 0, 0, 7); ctx.fill(); ctx.restore(); }
  // the rower from above: shoulders, arms, head (hair)
  ctx.fillStyle = coat; ctx.beginPath(); ctx.ellipse(-8, 0, 17, 27, 0, 0, 7); ctx.fill();
  ctx.lineWidth = 8; ctx.strokeStyle = coat; ctx.lineCap = 'round'; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(-6, sd * 22); ctx.lineTo(8, sd * 24); ctx.stroke(); }
  ctx.fillStyle = '#e2b296'; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(11, sd * 24, 4.5, 0, 7); ctx.fill(); }
  ctx.fillStyle = hair; ctx.beginPath(); ctx.arc(-6, 0, 12, 0, 7); ctx.fill();
  ctx.fillStyle = rgba('#ffcf96', .3); ctx.beginPath(); ctx.arc(-9, -4, 6, 0, 7); ctx.fill();
  ctx.restore();
}
export function drawBoats(ctx, t, s, K) {
  const Wt = waterLayer();
  const z = mix(1.12, .98, eout(lin(K.start - .3, K.end, t))), roll = -.05 + .06 * lin(K.start, K.end, t), lift = ein(lin(K.end - .4, K.end + .3, t));
  ctx.save(); ctx.translate(W / 2, H / 2 + lift * 300); ctx.rotate(roll); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
  ctx.drawImage(Wt, -300, -300);
  // ripples from the stone (lands just after the cut)
  const ti = K.start + .15;
  if (t > ti) { ctx.lineCap = 'round'; for (let k = 0; k < 5; k++) { const u = (t - ti - k * .22) / 2.6; if (u <= 0 || u > 1) continue; const R = 10 + 1000 * eout(u); ctx.strokeStyle = rgba('#d8e4e0', .55 * (1 - u)); ctx.lineWidth = 3 * (1 - u) + 1; ctx.beginPath(); roughPath(ctx, Array.from({ length: 64 }, (_, i) => [IMP[0] + Math.cos(i / 64 * 6.283) * R, IMP[1] + Math.sin(i / 64 * 6.283) * R * .97]), { amp: 1.5, seed: k + 1 }); ctx.stroke(); }
    const sp = 1 - lin(ti, ti + .5, t); if (sp > 0) { ctx.fillStyle = rgba('#f3efe2', .7 * sp); for (let i = 0; i < 10; i++) { const a = i * .63, d = 20 + 40 * (1 - sp); ctx.beginPath(); ctx.arc(IMP[0] + Math.cos(a) * d, IMP[1] + Math.sin(a) * d, 3 * sp + 1, 0, 7); ctx.fill(); } } }
  // the boats: tied side by side, then the rope slips and they drift apart on "drifted apart"
  const ap = eio(lin(K.apart - .7, K.end + .4, t)), bob = (p) => Math.sin(t * 1.4 + p) * 3;
  const A = [mix(IMP[0] - 150, IMP[0] - 560, ap), mix(IMP[1] + 150, IMP[1] + 330, ap) + bob(0)], B = [mix(IMP[0] + 120, IMP[0] + 520, ap), mix(IMP[1] - 170, IMP[1] - 360, ap) + bob(2)];
  const aA = .55 + .35 * ap + Math.sin(t * .8) * .02, aB = .5 - .25 * ap + Math.sin(t * .7 + 1) * .02;
  // the rope: taut, then slack in the water, then gone
  { const pa = [A[0] + Math.cos(aA) * 100, A[1] + Math.sin(aA) * 100], pb = [B[0] - Math.cos(aB) * 100, B[1] - Math.sin(aB) * 100], slip = sm(lin(K.apart - .2, K.apart + .6, t));
    if (slip < 1) { ctx.strokeStyle = rgba('#d9c8a0', .9 * (1 - slip)); ctx.lineWidth = 3; ctx.beginPath(); const m = [(pa[0] + pb[0]) / 2 + 40 * slip, (pa[1] + pb[1]) / 2 + 50 * slip]; ctx.moveTo(...pa); ctx.quadraticCurveTo(m[0], m[1], pb[0] * (1 - slip) + m[0] * slip, pb[1] * (1 - slip) + m[1] * slip); ctx.stroke(); } }
  // wakes behind the drifting boats
  for (const [P, a, d] of [[A, aA, -1], [B, aB, 1]]) if (ap > .02) { ctx.strokeStyle = rgba('#c8dcd8', .25 * Math.min(1, ap * 3)); ctx.lineWidth = 2; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.arc(P[0] - d * Math.cos(a) * 30 * k, P[1] - d * Math.sin(a) * 30 * k, 110 + 26 * k, a + (d > 0 ? 2.4 : -.7), a + (d > 0 ? 3.9 : .8)); ctx.stroke(); } }
  boat(ctx, A[0], A[1], aA, 1.15, '#e59a3a', '#3a2214', t, 0);
  boat(ctx, B[0], B[1], aB + Math.PI, 1.15, '#3a5a6a', '#c9c2b6', t, 2);
  ctx.restore();
  finish(ctx, { vig: .42, vigCol: '#050a18' });
  if (lift > .02) smear(ctx, ctx.canvas, 0, lift * 200, .8);
}

// =====================================================================================================================
// 4.14b · "Small flats.": a tower of identical tiny boxes at dusk, one lit window, one person in it
// =====================================================================================================================
const TW = { L: [[-420, -330], [1060, 40], [1060, 1300], [-420, 1260]], R: [[1060, 40], [1640, 160], [1640, 1200], [1060, 1300]], fl: 22, cl: 14, cr: 7 };
function flatsLayer() {
  return once('m2', () => {
    const PAD = 260, [c, g] = mkL(PAD, 60), r = prng(31);
    vgr(g, -PAD, -60, W + 2 * PAD, H + 120, [[0, '#0e1030'], [.6, '#2a2450'], [1, '#5a3a58']]);
    // other towers behind (silhouettes with a few dim windows)
    for (let i = 0; i < 9; i++) { const x = -200 + i * 270 + r() * 60, w = 160 + r() * 90, h = 500 + r() * 400; roughRect(g, x, H - h, w, h + 60, mixHex('#141634', '#1e1e44', r()), { amp: 1, seed: i }); for (let k = 0; k < 30; k++) { if (r() < .8) continue; g.fillStyle = rgba('#ffc477', .25 + .3 * r()); g.fillRect(x + 10 + Math.floor(r() * (w - 20) / 14) * 14, H - h + 20 + Math.floor(r() * (h - 40) / 22) * 22, 6, 9); } }
    const lit = (f, cc) => 0;
    facade(g, r, TW.L, { wall: '#3a3458', floors: TW.fl, cols: TW.cl, top: .03, bottom: 1, ww: .5, wh: .52, style: 0, skip: 0, lit, winOff: '#1a1838', cornice: true, bands: true, shade: [[0, rgba('#000', .3)], [1, rgba('#000', 0)]], edgeLight: rgba('#e9a07f', .4), frames: false });
    facade(g, r, TW.R, { wall: '#4a3a5a', floors: TW.fl, cols: TW.cr, top: .03, bottom: 1, ww: .5, wh: .52, style: 0, skip: 0, lit, winOff: '#221c40', cornice: true, bands: true, shade: [[0, rgba('#e9a07f', .15)], [1, rgba('#000', .3)]], frames: false });
    hatch(g, [-PAD, 0, 1340 + PAD, H], { angle: -1.1, gap: 8, col: '#0a0818', a: .12, seed: 4, broken: .5 });
    stip(c, { k: .3, seed: 32 });
    return c;
  });
}
const LIT = { f: 10, c: 10 };
function winQuad(q, floors, cols, f, cc, ww = .5, wh = .52, top = .03, bot = 1) {
  const m = quadMap(q), v0 = mix(top, bot, f / floors), v1 = mix(top, bot, (f + 1) / floors), u0 = (cc + .5 - ww / 2) / cols, u1 = (cc + .5 + ww / 2) / cols;
  return quadIn(m, u0, mix(v0, v1, (1 - wh) / 2), u1, mix(v0, v1, (1 + wh) / 2));
}
export function drawFlats(ctx, t, s, K) {
  const L = flatsLayer(), q = winQuad(TW.L, TW.fl, TW.cl, LIT.f, LIT.c), cx = (q[0][0] + q[2][0]) / 2, cy = (q[0][1] + q[2][1]) / 2;
  const land = 1 - eout(lin(K.start - .25, K.start + .4, t)), pan = ein(lin(K.end - .45, K.end + .3, t));
  const cam = { x: (cx - 960) * .6 + drift(t, 6, 11) + pan * 700, y: (cy - 540) * .6 - land * 380 + drift(t, 4, 12), z: 1.12 - .1 * eout(lin(K.start, K.end, t)) };
  lay(ctx, L, cam, 1);
  ctx.save(); camTo(ctx, cam, 1);
  // the one lit window: warm, a person sitting alone at a small table (head + shoulders against the lamp)
  roughPoly(ctx, q, '#ffc477', { amp: .2, seed: 3 });
  ctx.save(); ctx.beginPath(); for (const p of q) ctx.lineTo(...p); ctx.clip();
  const w = q[1][0] - q[0][0], h = q[3][1] - q[0][1];
  softLight(ctx, q[0][0] + w * .75, q[0][1] + h * .3, w * .9, '#fff1cf', .9);
  ctx.fillStyle = '#2a1830'; const hx = q[0][0] + w * .38 + Math.sin(t * .9) * w * .02, hy = q[0][1] + h * .52;
  ctx.beginPath(); ctx.arc(hx, hy, w * .13, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(hx + w * .02, hy + h * .42, w * .26, h * .28, 0, Math.PI, 0); ctx.fill();
  ctx.fillRect(q[0][0], q[0][1] + h * .8, w, h * .2);
  ctx.restore();
  glowA(ctx, cx, cy, w * 4, .35, C.amber, HOT);
  ctx.restore();
  finish(ctx, { vig: .42, vigCol: '#06061a' });
  if (land > .02) smear(ctx, ctx.canvas, 0, -land * 160, .8);
  if (pan > .02) smear(ctx, ctx.canvas, -pan * 260, 0, .9);
}

// =====================================================================================================================
// 4.14c · "Long commutes.": a crawl of lights on an elevated road at dusk; a glass lift climbs a tower → zoom into it
// =====================================================================================================================
const RVP = [1560, 430];
const LIFT = { x: 1240, y0: 640, y1: 470 };
function roadLayer() {
  return once('m3', () => {
    const PAD = 260, [c, g] = mkL(PAD, 200), r = prng(41);
    vgr(g, -PAD, -200, W + 2 * PAD, RVP[1] + 220, [[0, '#121436'], [.65, '#5a3a62'], [1, '#e08a6a']]);
    softLight(g, 1700, RVP[1], 700, '#ff9a6a', .4);
    // skyline (left of the tower) + the tower with the glass lift shaft
    for (let i = 0; i < 22; i++) { const x = -200 + i * 110 + r() * 40, w = 60 + r() * 80, h = 80 + r() * 260; if (Math.abs(x - LIFT.x) < 160) continue; roughRect(g, x, RVP[1] - h, w, h + 30, mixHex('#1a1a40', '#2a2450', r()), { amp: .6, seed: i }); for (let k = 0; k < 14; k++) { if (r() < .7) continue; g.fillStyle = rgba('#ffc477', .3 + .3 * r()); g.fillRect(x + 6 + Math.floor(r() * (w - 12) / 10) * 10, RVP[1] - h + 10 + Math.floor(r() * (h - 20) / 14) * 14, 4, 6); } }
    roughPoly(g, [[LIFT.x - 120, 200], [LIFT.x + 60, 180], [LIFT.x + 70, RVP[1] + 40], [LIFT.x - 120, RVP[1] + 40]], '#262650', { amp: .8, seed: 5 });
    roughPoly(g, [[LIFT.x + 60, 180], [LIFT.x + 130, 210], [LIFT.x + 130, RVP[1] + 40], [LIFT.x + 70, RVP[1] + 40]], '#1a1a3e', { amp: .6, seed: 6 });
    for (let y = 230; y < RVP[1]; y += 18) for (let x = LIFT.x - 110; x < LIFT.x + 50; x += 16) { if (Math.abs(x - LIFT.x) < 22) continue; g.fillStyle = r() < .15 ? rgba('#ffc477', .5) : '#1a1838'; g.fillRect(x, y, 8, 10); }
    g.fillStyle = rgba('#8a90b0', .18); g.fillRect(LIFT.x - 16, 200, 32, RVP[1] - 160);   // the glass shaft (dim)
    g.strokeStyle = rgba('#c8c8e0', .25); g.lineWidth = 1; for (let y = 210; y < RVP[1] + 40; y += 24) { g.beginPath(); g.moveTo(LIFT.x - 16, y); g.lineTo(LIFT.x + 16, y); g.stroke(); }
    // ground plane beyond the road
    vgr(g, -PAD, RVP[1], W + 2 * PAD, H - RVP[1] + 200, [[0, '#2a2040'], [1, '#0c0a1c']]);
    // the elevated road: deck, lane lines, barrier
    const E = (x, y) => [x, y];
    const deck = [[-PAD, 760], [RVP[0] - 30, RVP[1] + 4], [RVP[0] + 30, RVP[1] + 8], [700, H + 200], [-PAD, H + 200]];
    roughPoly(g, deck, '#1c1830', { amp: .8, seed: 7 });
    g.strokeStyle = rgba('#e9ddc8', .3); g.lineWidth = 2; g.setLineDash([26, 30]);
    for (const k of [.25, .5, .75]) { g.beginPath(); g.moveTo(mix(-PAD, 700, k), mix(760, H + 200, k)); g.lineTo(RVP[0] - 30 + 60 * k, RVP[1] + 4 + 4 * k); g.stroke(); }
    g.setLineDash([]);
    roughPoly(g, [[700, H + 200], [RVP[0] + 30, RVP[1] + 8], [RVP[0] + 34, RVP[1] - 2], [760, H + 120]], '#3a3050', { amp: .6, seed: 8 });   // barrier
    g.strokeStyle = rgba('#ffb35c', .3); g.beginPath(); g.moveTo(760, H + 120); g.lineTo(RVP[0] + 34, RVP[1] - 2); g.stroke();
    // street lamps along the barrier (warm)
    for (let i = 0; i < 9; i++) { const u = Math.pow(i / 9, 1.6), x = mix(760, RVP[0] + 30, u), y = mix(H + 120, RVP[1] - 2, u), hh = mix(220, 12, u); roughLine(g, [[x, y], [x, y - hh], [x - hh * .2, y - hh]], { w: Math.max(1, 5 * (1 - u)), col: '#141028', seed: i }); softLight(g, x - hh * .2, y - hh, 60 * (1 - u) + 8, '#ffc477', .5); }
    stip(c, { k: .3, seed: 42 });
    return c;
  });
}
const lane = (k, u) => { const a = [mix(-260, 700, k), mix(760, H + 200, k)], b = [RVP[0] - 30 + 60 * k, RVP[1] + 4 + 4 * k], e = Math.pow(u, .45); return [mix(a[0], b[0], e), mix(a[1], b[1], e), 1 - e]; };
export function drawCommute(ctx, t, s, K) {
  const L = roadLayer(), push = eio(lin(K.start, K.end + .3, t));
  const ly = mix(LIFT.y0, LIFT.y1, eio(lin(K.start - .3, K.end + .3, t)));
  const land = 1 - eout(lin(K.start - .25, K.start + .4, t));
  const cam = { x: (LIFT.x - 960) * push + drift(t, 6, 13) + land * 600, y: (ly - 540) * push + drift(t, 4, 14), z: 1.0 + .9 * push * push };
  lay(ctx, L, cam, 1);
  ctx.save(); camTo(ctx, cam, 1);
  // the lit lift cabin climbing the tower
  roughRect(ctx, LIFT.x - 14, ly - 20, 28, 34, '#ffc477', { amp: .3, seed: 2 }); ctx.fillStyle = '#3a2440'; ctx.fillRect(LIFT.x - 8, ly - 10, 5, 18); ctx.fillRect(LIFT.x + 4, ly - 9, 5, 17);
  glowA(ctx, LIFT.x, ly, 80, .5, C.amber, HOT);
  // the jam: tail lights crawling away (red), headlights crawling toward (white-warm); stop-and-go
  const tail = lightSprite('m3:red', '#e8553a', '#ffd0b0', { k: .5, seed: 2, size: 64 }), head = lightSprite('m3:white', '#ffe2b8', '#ffffff', { k: .5, seed: 3, size: 64 });
  for (let k = 0; k < 4; k++) { const away = k < 2, sp = (away ? .004 : -.003) * (1 + .5 * Math.sin(t * 1.3 + k));
    for (let i = 0; i < 26; i++) { const u0 = ((i / 26 + k * .13 + t * sp * (away ? 1 : 1)) % 1 + 1) % 1, [x, y, d] = lane((k + .5) / 4, u0), sz = 34 * d + 2;
      ctx.fillStyle = '#0c0a18'; ctx.fillRect(x - sz * .9, y - sz * .55, sz * 1.8, sz * .7);
      spr(ctx, away ? tail : head, x - sz * .6, y - sz * .2, sz * .7, .9); spr(ctx, away ? tail : head, x + sz * .6, y - sz * .2, sz * .7, .9); } }
  ctx.restore();
  finish(ctx, { vig: .4, vigCol: '#06061a' });
  if (land > .02) smear(ctx, ctx.canvas, -land * 220, 0, .9);
}

// =====================================================================================================================
// 4.14d · "Strangers on the same staircase.": inside the lift, two people stand apart, one lit by a phone (cyan, the
// one machine light); floor numbers count down; the doors begin to open on warm light → hill builder zooms into the gap
// =====================================================================================================================
const LV = [1060, 500], DW = { x0: 610, x1: 1310, y0: 150, y1: 880 };
function liftLayer() {
  return once('m4', () => {
    const PAD = 160, [c, g] = mkL(PAD), r = prng(51);
    // side walls, ceiling, floor in one-point perspective toward LV (the camera stands in the back left)
    const fr = [[-PAD, -PAD], [W + PAD, -PAD], [W + PAD, H + PAD], [-PAD, H + PAD]];
    roughPoly(g, [fr[0], [DW.x0, DW.y0], [DW.x0, DW.y1], fr[3]], '#5a5a6a', { amp: .6, seed: 1 });           // left wall
    roughPoly(g, [fr[1], [DW.x1, DW.y0], [DW.x1, DW.y1], fr[2]], '#4a4a5c', { amp: .6, seed: 2 });           // right wall
    roughPoly(g, [fr[0], fr[1], [DW.x1, DW.y0], [DW.x0, DW.y0]], '#6a6a78', { amp: .6, seed: 3 });           // ceiling
    roughPoly(g, [fr[3], fr[2], [DW.x1, DW.y1], [DW.x0, DW.y1]], '#2a2834', { amp: .6, seed: 4 });           // floor
    // brushed panels (vertical seams in perspective) + handrails
    g.strokeStyle = rgba('#1a1a24', .45); g.lineWidth = 2;
    for (const k of [.35, .62, .82]) { const xl = mix(-PAD, DW.x0, k); g.beginPath(); g.moveTo(xl, mix(-PAD, DW.y0, k)); g.lineTo(xl, mix(H + PAD, DW.y1, k)); g.stroke(); const xr = mix(W + PAD, DW.x1, k); g.beginPath(); g.moveTo(xr, mix(-PAD, DW.y0, k)); g.lineTo(xr, mix(H + PAD, DW.y1, k)); g.stroke(); }
    for (const [a, b] of [[[-PAD, 640], [DW.x0, 620]], [[W + PAD, 640], [DW.x1, 620]]]) roughLine(g, [a, b], { w: 7, col: '#8a8a98', seed: a[0] });
    g.save(); g.beginPath(); g.rect(-PAD, -PAD, DW.x0 + PAD, H + 2 * PAD); g.clip(); hatch(g, [-PAD, -PAD, DW.x0 + PAD, H + 2 * PAD], { angle: 1.2, gap: 5, col: '#c8c8d8', a: .06, seed: 5 }); g.restore();
    // ceiling light panel (cool, flat)
    roughPoly(g, [[700, 30], [1240, 30], [1180, 110], [770, 110]], '#e8ece8', { amp: .5, seed: 6 });
    softLight(g, 960, 70, 700, '#dfe8e4', .3);
    // the door wall: frame, two leaves are drawn live; the floor indicator panel above
    roughRect(g, DW.x0, DW.y0, DW.x1 - DW.x0, DW.y1 - DW.y0, '#3a3a48', { amp: .5, seed: 7 });
    roughRect(g, 900, 100, 120, 44, '#141420', { amp: .4, seed: 8 });
    // button panel on the right wall
    roughPoly(g, [[1420, 470], [1480, 455], [1480, 690], [1420, 680]], '#8a8a98', { amp: .3, seed: 9 }); for (let i = 0; i < 8; i++) { g.fillStyle = i === 7 ? '#ffc477' : '#2a2a34'; g.beginPath(); g.arc(1450, 485 + i * 25, 6, 0, 7); g.fill(); }
    // floor: scuffs, a cool sheen
    vgr(g, -PAD, DW.y1, W + 2 * PAD, H - DW.y1 + PAD, [[0, rgba('#000', .3)], [1, rgba('#9aa0b0', .12)]]);
    stip(c, { k: .3, seed: 52 });
    return c;
  });
}
export function drawLift(ctx, t, s, K) {
  const L = liftLayer(), open = eio(lin(K.open, K.end + .5, t)), gap = 330 * open;
  const cam = { x: drift(t, 5, 15), y: drift(t, 3, 16), z: 1.02 + .05 * lin(K.start, K.end + .5, t) + .08 * open };
  lay(ctx, L, cam, 1);
  ctx.save(); camTo(ctx, cam, 1);
  const mid = (DW.x0 + DW.x1) / 2;
  // beyond the doors: a warm night street with string lights (seen through the gap)
  if (gap > .5) {
    ctx.save(); ctx.beginPath(); ctx.rect(mid - gap / 2, DW.y0, gap, DW.y1 - DW.y0); ctx.clip();
    vgr(ctx, mid - 200, DW.y0, 400, DW.y1 - DW.y0, [[0, '#2a1e44'], [.55, '#8a4a50'], [.7, '#e9a070'], [1, '#5a3438']]);
    const rr = prng(7); for (let i = 0; i < 26; i++) { const x = mid - 180 + rr() * 360, y = DW.y0 + 90 + rr() * 200 + Math.sin(x * .02) * 20; glowA(ctx, x, y, 16 + rr() * 16, .5, C.amber, HOT); }
    for (let i = 0; i < 6; i++) { const x = mid - 150 + i * 60 + Math.sin(t + i) * 4, y = DW.y1 - 120 - (i % 2) * 14; ctx.fillStyle = '#2a1424'; ctx.beginPath(); ctx.arc(x, y - 60, 12, 0, 7); ctx.fill(); ctx.fillRect(x - 15, y - 48, 30, 60); }
    ctx.restore();
    // warm spill on the floor + the inner wall
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const gr = ctx.createLinearGradient(0, DW.y1, 0, H + 100); gr.addColorStop(0, rgba('#ffb35c', .45 * open)); gr.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = gr;
    ctx.beginPath(); ctx.moveTo(mid - gap / 2, DW.y1); ctx.lineTo(mid + gap / 2, DW.y1); ctx.lineTo(mid + gap * 1.6, H + 100); ctx.lineTo(mid - gap * 1.6, H + 100); ctx.fill();
    glowA(ctx, mid, (DW.y0 + DW.y1) / 2, 700, .25 * open, C.amber, HOT, 1.1);
    ctx.restore();
  }
  // the door leaves
  for (const sd of [-1, 1]) { const x0 = sd < 0 ? DW.x0 + 12 : mid + gap / 2, x1 = sd < 0 ? mid - gap / 2 : DW.x1 - 12; if (x1 - x0 < 2) continue; roughRect(ctx, x0, DW.y0 + 12, x1 - x0, DW.y1 - DW.y0 - 12, '#8a8c98', { amp: .3, seed: 20 + sd }); ctx.fillStyle = rgba('#e8ece8', .12); ctx.fillRect(x0 + (x1 - x0) * .2, DW.y0 + 20, (x1 - x0) * .08, DW.y1 - DW.y0 - 30); if (gap > .5) { ctx.fillStyle = rgba('#ffcf96', .5 * open); ctx.fillRect(sd < 0 ? x1 - 3 : x0, DW.y0 + 12, 3, DW.y1 - DW.y0 - 12); } }
  // the floor indicator counting down
  { const n = Math.max(1, 7 - Math.floor((t - K.start) / ((K.open - K.start) / 6))); ctx.fillStyle = '#ffc477'; ctx.font = '500 30px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(open > 0 ? 'G' : String(n), 960, 123); ctx.fillText(open > 0 ? '' : '▾', 1000, 123); }
  ctx.restore();
  // the two strangers, near the camera, apart: left one on a phone (cyan glow), right one with a bag; both lift
  // their heads toward the light as the doors open
  ctx.save(); camTo(ctx, { x: cam.x * 1.3, y: cam.y * 1.3, z: 1 + (cam.z - 1) * 1.4 }, 1);
  const lk = sm(lin(K.open + .1, K.end + .4, t));
  const lightO = { x: mid, y: 520, col: '#ffcf96', a: .55 * open };
  const L1 = fig(ctx, 470, 760 + Math.sin(t * 1.1) * 2, 3.9, { lean: .08 - .1 * lk, head: .38 - .45 * lk, sh: [1.5 - .3 * lk, .9], el: [1.5 - .4 * lk, 1.2], hip: [.04, -.06], kn: [.02, .06], hair: 'short', coat: .6 }, { flip: true, dress: { coat: '#3a3a5a', pants: '#1a1a28', skin: '#d9b08e', hair: '#1c1420' }, light: open > 0 ? lightO : { x: 960, y: 0, col: '#dfe8e4', a: .35 }, rim: open > .1 ? '#ffd9a8' : '#cfd8d4', rimSide: 1, rimW: 3, shadeA: .2, shadeCol: '#14141e' });
  { const [px, py] = L1.hand(0); ctx.fillStyle = '#14141e'; ctx.fillRect(px - 10, py - 18, 18, 28); glowA(ctx, px, py - 10, 60, .45 * (1 - lk * .7), C.cyan, C.cyanWhite); }
  fig(ctx, 1460, 770 + Math.sin(t * 1.0 + 2) * 2, 3.8, { lean: .02 - .06 * lk, head: .1 - .25 * lk + .05 * Math.sin(t * .6), sh: [.25, -.2], el: [.25, .4], hip: [.02, -.04], kn: [.03, .02], hair: 'bun', coat: .8 }, { dress: { coat: '#7a4a5a', pants: '#24182a', skin: '#e2b296', hair: '#3a2214' }, light: open > 0 ? lightO : { x: 960, y: 0, col: '#dfe8e4', a: .35 }, rim: open > .1 ? '#ffd9a8' : '#cfd8d4', rimSide: -1, rimW: 3, shadeA: .2, shadeCol: '#14141e', prop: (g, a0) => { g.fillStyle = '#5a3a2a'; g.fillRect(a0.hx - 14, a0.hy, 30, 34); } });
  ctx.restore();
  finish(ctx, { vig: .44, vigCol: '#0a0a14' });
}
