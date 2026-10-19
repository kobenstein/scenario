// A3 · "Your parents' last years, lived with them" — art upgrade test, bold non-purple palette.
// Late summer, low sun. An old father with a cane and his grown daughter walk arm in arm along a ridge path,
// toward the light. A huge old oak frames the left, the bench under it waits. Layered green hills with line
// hatching, warm mist in the valleys, sun shafts. ONE hero light: the sun.
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, layer, put, stipple, maskLinear, maskRadial, roughPath, roughPoly, roughRect, roughLine, hatch, strokes, fog, cone, pool, bloom, person, castShadow, printFinish, vnoise, fbm, soften } from './art.mjs';
import { save } from './lib.mjs';
import { stratus, limb, qpts } from './art.mjs';

const SUN = [1450, 545], SUNR = 74;
const ORANGE = '#ff6a3a', GOLD = '#ffc477', CREAM = '#fff1cf';
const n = vnoise(12);
const ridge = (base, amp, f, seed) => (x) => base - amp * fbm(vnoise(seed), x * f, seed * .37, 4);

export function frame(out) {
  const [cv, ctx] = layer();
  // ---- sky: deep teal-green above, coral to cream toward the sun (one source)
  { const g = ctx.createLinearGradient(0, 0, 0, 700); g.addColorStop(0, '#0e2f33'); g.addColorStop(.35, '#1f5552'); g.addColorStop(.62, '#9a8a5c'); g.addColorStop(.8, '#f0a160'); g.addColorStop(1, '#f7cf8e'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 720); }
  { const [c, g] = layer(); const rg = g.createRadialGradient(SUN[0], SUN[1], 0, SUN[0], SUN[1], 900); rg.addColorStop(0, rgba(CREAM, .9)); rg.addColorStop(.12, rgba(GOLD, .7)); rg.addColorStop(.4, rgba(ORANGE, .28)); rg.addColorStop(1, rgba(ORANGE, 0)); g.fillStyle = rg; g.fillRect(0, 0, W, H); stipple(c, { k: .16, g: 1.1, seed: 3 }); put(ctx, c, { op: 'screen' }); }
  // hatched cloud bands across the sun (Stauffer clouds): soft-edged strata, pen lines inside
  { const [hc, hx] = layer(); hx.save(); hx.beginPath();
    for (const [y, x0, x1, th] of [[430, 880, 2100, 30], [480, 1150, 1820, 14], [356, 1250, 2200, 22], [300, -300, 520, 22]]) stratus(hx, y, x0, x1, th, y);
    hx.fillStyle = rgba('#e88a58', .55); hx.fill(); hx.clip(); hatch(hx, [0, 250, W, 260], { angle: -0.015, gap: 4, w: 1.1, col: '#ffd9a4', a: .6, seed: 5, broken: .3 }); hx.restore();
    maskLinear(hc, 0, 0, W, 0, [[0, .6], [.2, .0], [.42, 0], [.58, .9], [1, .8]]); put(ctx, hc); }
  // sun disc
  ctx.fillStyle = CREAM; ctx.beginPath(); roughPath(ctx, Array.from({ length: 48 }, (_, i) => [SUN[0] + Math.cos(i / 48 * 6.283) * SUNR, SUN[1] + Math.sin(i / 48 * 6.283) * SUNR]), { amp: .8, seed: 2 }); ctx.fill();
  bloom(ctx, SUN[0], SUN[1], 260, { col: GOLD, core: CREAM, a: .55, k: .35, seed: 4 });
  // birds
  for (const [x, y, s] of [[1160, 300, 1], [1205, 322, .8], [1250, 290, .9], [1010, 250, .6]]) { ctx.strokeStyle = '#1a2a24'; ctx.lineWidth = 2 * s; ctx.beginPath(); ctx.moveTo(x - 12 * s, y - 3 * s); ctx.quadraticCurveTo(x - 5 * s, y - 8 * s, x, y); ctx.quadraticCurveTo(x + 5 * s, y - 8 * s, x + 12 * s, y - 4 * s); ctx.stroke(); }

  // ---- hills, far to near; each layer: silhouette, contour hatching, then mist in the valley in front of it
  const layers = [
    { f: ridge(612, 70, .0022, 3), col: '#b39a73', hc: '#fbe0b0', ha: .5, mist: ['#f5c58e', .55] },
    { f: ridge(660, 110, .0018, 5), col: '#7a8a5a', hc: '#f3cf96', ha: .5, mist: ['#e9b884', .45] },
    { f: ridge(735, 150, .0016, 7), col: '#46684a', hc: '#e0c88a', ha: .45, mist: ['#c9a774', .35] },
    { f: ridge(820, 120, .002, 9), col: '#284a33', hc: '#b8cc8a', ha: .42, mist: null },
  ];
  for (const [i, L] of layers.entries()) {
    const pts = [[-20, H + 20]]; for (let x = -20; x <= W + 20; x += 8) pts.push([x, L.f(x)]); pts.push([W + 20, H + 20]);
    roughPoly(ctx, pts, L.col, { amp: 1.2, seed: i });
    ctx.save(); ctx.beginPath(); roughPath(ctx, pts, { amp: 1.2, seed: i }); ctx.clip();
    // sun-side light on the slopes: a horizontal gradient toward the sun
    { const g = ctx.createRadialGradient(SUN[0], SUN[1], 0, SUN[0], SUN[1], 1100); g.addColorStop(0, rgba(GOLD, .45 - i * .08)); g.addColorStop(1, rgba(GOLD, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    // contour hatching: strokes that follow this ridge line, offset downward, broken, denser away from the sun
    const [hc2, hx2] = layer(); hx2.strokeStyle = L.hc; hx2.lineCap = 'round';
    const rr = prng(40 + i);
    for (let k = 1; k < 26; k++) { const off = k * (5 + i * 2.2) * (1 + k * .04); let x = -20 + rr() * 60;
      while (x < W) { const len = 30 + rr() * 160; hx2.globalAlpha = L.ha * (.4 + .6 * rr()); hx2.lineWidth = .9 + i * .25; hx2.beginPath();
        for (let xx = x; xx < Math.min(W + 20, x + len); xx += 6) hx2.lineTo(xx, L.f(xx) + off + (n(xx * .02, k + i * 30) - .5) * 3); hx2.stroke(); x += len + 10 + rr() * 70; } }
    maskRadial(hc2, SUN[0], SUN[1], 0, 1500, [[0, 1], [.5, .7], [1, .25]]); put(ctx, hc2);
    ctx.restore();
    if (L.mist) fog(ctx, { y0: L.f(SUN[0]) - 30, y1: L.f(SUN[0]) + 110 + i * 20, col: L.mist[0], a: L.mist[1], seed: 20 + i, cover: .75, soft: .45, k: .3, sx: .003, sy: .03, edgeTop: .5, edgeBot: .5 });
  }
  // sun shafts raking left across the valley (volumetric, stippled)
  for (const [d, sp, a] of [[-1.47, .03, .14], [-1.53, .02, .1], [-1.4, .025, .1], [-1.6, .015, .08]]) cone(ctx, SUN[0], SUN[1], { dir: d, spread: sp, len: 1500, col: GOLD, a, k: .45, seed: Math.round(d * 100), soft: .6, op: 'screen' });

  // ---- foreground ridge with the path; the oak on the left
  const near = (x) => 862 - 120 * Math.exp(-Math.pow((x - 260) / 520, 2)) + (n(x * .004, 3) - .5) * 26;
  const nearPts = [[-20, H + 20]]; for (let x = -20; x <= W + 20; x += 8) nearPts.push([x, near(x)]); nearPts.push([W + 20, H + 20]);
  roughPoly(ctx, nearPts, '#183522', { amp: 1.5, seed: 30 });
  ctx.save(); ctx.beginPath(); roughPath(ctx, nearPts, { amp: 1.5, seed: 30 }); ctx.clip();
  { const g = ctx.createLinearGradient(0, 760, 0, H); g.addColorStop(0, rgba('#d9a85a', .35)); g.addColorStop(.25, rgba('#d9a85a', .08)); g.addColorStop(1, rgba('#06120b', .55)); ctx.fillStyle = g; ctx.fillRect(0, 700, W, 400); }
  // grass: short upward strokes, catching the light along the crest (stipple highlights)
  { const [gc, gx] = layer(); const rr = prng(8);
    for (let i = 0; i < 9000; i++) { const x = rr() * W, y0 = near(x), y = y0 + Math.pow(rr(), 1.8) * (H - y0 + 20), d = (y - y0) / (H - y0 + 1), l = 3 + rr() * 9 * (1 + d * 2);
      gx.strokeStyle = rr() < .5 - d * .4 ? '#e8c27a' : '#4f7a4a'; gx.globalAlpha = (.18 + .5 * rr()) * (1 - d * .5); gx.lineWidth = 1; gx.beginPath(); gx.moveTo(x, y); gx.lineTo(x + (rr() - .4) * 4, y - l); gx.stroke(); }
    put(ctx, gc); }
  // the path: a lighter worn band along the crest, two ruts
  { const path = (dy) => { const p = []; for (let x = 260; x <= W + 20; x += 10) p.push([x, near(x) + 18 + dy + (x - 260) * .012]); return p; };
    const top = path(0), bot = path(20).reverse(); roughPoly(ctx, [...top, ...bot], '#b99a62', { amp: 1.5, seed: 31 });
    const g = ctx.createLinearGradient(260, 0, W, 0); g.addColorStop(0, rgba('#183522', .7)); g.addColorStop(.6, rgba('#183522', 0)); ctx.beginPath(); roughPath(ctx, [...top, ...bot], { amp: 1.5, seed: 31 }); ctx.fillStyle = g; ctx.fill(); }
  // wildflowers: amber and red dots in the grass
  { const rr = prng(15); for (let i = 0; i < 160; i++) { const x = rr() * W, y = near(x) + 30 + Math.pow(rr(), 1.5) * 200; ctx.fillStyle = rr() < .6 ? '#ffb35c' : '#e8553a'; ctx.globalAlpha = .55 + .4 * rr(); ctx.beginPath(); ctx.arc(x, y, 1.3 + rr() * 2.2 * (y - 800) / 280, 0, 7); ctx.fill(); } ctx.globalAlpha = 1; }
  ctx.restore();

  // the oak: trunk + great canopy (rough blobs), hatched shadow side, orange rim toward the sun
  { const tx = 330, ty = near(330) + 8;
    roughPoly(ctx, [[tx - 40, ty + 6], [tx - 22, ty - 120], [tx - 30, ty - 260], [tx - 80, ty - 330], [tx - 60, ty - 338], [tx - 12, ty - 290], [tx + 6, ty - 360], [tx + 26, ty - 356], [tx + 22, ty - 270], [tx + 90, ty - 330], [tx + 104, ty - 320], [tx + 34, ty - 230], [tx + 30, ty - 110], [tx + 50, ty + 6]], '#0d1a12', { amp: 2.5, seed: 40 });
    const rr = prng(41), [cc, cx2] = layer();
    // canopy = a handful of lobes (each a cluster of rough blobs), sky shows between them
    const lobes = [[tx - 250, ty - 420, 170], [tx - 20, ty - 540, 200], [tx + 230, ty - 440, 150], [tx - 380, ty - 380, 120], [tx + 110, ty - 330, 120], [tx - 160, ty - 640, 130], [tx + 300, ty - 600, 110]];
    const blob = (g, bx, by, br, seed) => { g.beginPath(); roughPath(g, Array.from({ length: 30 }, (_, i) => { const a = i / 30 * 6.283; return [bx + Math.cos(a) * br * (1 + .14 * Math.sin(a * 3 + seed)), by + Math.sin(a) * br * .72 * (1 + .1 * Math.cos(a * 4 + seed))]; }), { amp: 4, step: 9, seed }); g.fill(); };
    const parts = []; for (const [lx, ly, lr] of lobes) for (let k = 0; k < 7; k++) { const a = rr() * 6.283, d = Math.sqrt(rr()) * lr * .6; parts.push([lx + Math.cos(a) * d, ly + Math.sin(a) * d * .7, lr * (.35 + rr() * .3)]); }
    cx2.fillStyle = '#10261a'; for (const [i, [bx, by, br]] of parts.entries()) blob(cx2, bx, by, br, i);
    // branches reaching into the lobes
    for (const [lx, ly] of lobes) limb(cx2, qpts([tx + 6, ty - 230], [mix(tx, lx, .25), mix(ty - 260, ly, .75) + 30], [lx, ly + 30]), 26, 6, '#0d1a12', Math.round(lx));
    // thin orange rim on the sun side only
    const [rc, rx] = layer(); rx.drawImage(cc, 0, 0); rx.globalCompositeOperation = 'source-in'; rx.fillStyle = '#ff9a55'; rx.fillRect(0, 0, W, H);
    ctx.save(); ctx.globalAlpha = .85; ctx.drawImage(rc, 3, -2); ctx.restore();
    cx2.globalCompositeOperation = 'source-atop';
    // each blob: lighter top-right (sun), darker bottom-left
    for (const [i, [bx, by, br]] of parts.entries()) { const g = cx2.createLinearGradient(bx + br * .7, by - br * .6, bx - br * .6, by + br * .6); g.addColorStop(0, rgba('#9a7a3a', .45)); g.addColorStop(.4, rgba('#1c3622', .1)); g.addColorStop(1, rgba('#020805', .5)); cx2.fillStyle = g; blob(cx2, bx, by, br * .98, i); }
    // shadow hatching (diagonal pen lines) over the left/lower canopy
    { cx2.save(); hatch(cx2, [tx - 600, ty - 800, 1000, 700], { angle: .9, gap: 5, w: 1, col: '#020a06', a: .45, seed: 7, broken: .4 }); cx2.restore(); }
    { const g = cx2.createLinearGradient(tx - 500, 0, tx + 420, 0); g.addColorStop(0, rgba('#10261a', 0)); g.addColorStop(.55, rgba('#10261a', 0)); g.addColorStop(1, rgba('#c98a48', .35)); cx2.fillStyle = g; cx2.fillRect(0, 0, W, H); }
    // leaf-clump arcs only on the sun-lit side
    for (let i = 0; i < 160; i++) { const [bx, by, br] = parts[Math.floor(rr() * parts.length)], a = -1.2 + rr() * 1.4, x = bx + Math.cos(a) * br * .7 * rr(), y = by + Math.sin(a) * br * .5 * rr(); if (x < tx - 150) continue; cx2.strokeStyle = '#f2b06a'; cx2.globalAlpha = .2 + .35 * rr(); cx2.lineWidth = 1.2; cx2.beginPath(); cx2.arc(x, y, 7 + rr() * 12, Math.PI * 1.1, Math.PI * 1.8); cx2.stroke(); }
    cx2.globalAlpha = 1; cx2.globalCompositeOperation = 'source-over';
    put(ctx, cc);
    // the bench under the tree, waiting
    const bx = 470, by = near(470) + 22; roughRect(ctx, bx, by - 30, 120, 7, '#0d1a12', { amp: .6, seed: 50 }); roughRect(ctx, bx, by - 50, 120, 6, '#0d1a12', { amp: .6, seed: 51 }); roughRect(ctx, bx + 8, by - 30, 6, 32, '#0d1a12', { amp: .4, seed: 52 }); roughRect(ctx, bx + 106, by - 30, 6, 32, '#0d1a12', { amp: .4, seed: 53 }); roughRect(ctx, bx + 6, by - 50, 5, 22, '#0d1a12', { amp: .3, seed: 54 }); roughRect(ctx, bx + 108, by - 50, 5, 22, '#0d1a12', { amp: .3, seed: 55 });
    ctx.strokeStyle = rgba('#ff8a4a', .6); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(bx + 2, by - 50); ctx.lineTo(bx + 120, by - 50); ctx.stroke();
    // a blanket left on it, and a thermos — someone comes here every day
    roughRect(ctx, bx + 62, by - 40, 40, 11, '#c4482a', { amp: .5, seed: 56 });
  }

  // ---- the two of them, arm in arm, walking into the light; long shadows fall back toward us
  { const fy = (x) => near(x) + 30 + (x - 260) * .012;
    const dx = 1060, ox = 1128, sD = 1.02, sF = .98;
    const yD = fy(dx) - 88 * sD + 4, yF = fy(ox) - 88 * sF + 4;
    castShadow(ctx, dx, yD + 88 * sD, sD, SUN[0], SUN[1] - 140, { a: .5, len: 3.2, col: '#0b1a10' });
    castShadow(ctx, ox, yF + 88 * sF, sF, SUN[0], SUN[1] - 140, { a: .5, len: 3.2, col: '#0b1a10' });
    // father (far side, a little ahead): cap, long coat, cane in his front hand
    const father = person(ctx, ox, yF, sF, { lean: .1, head: .12, sh: [.12, -.25], el: [.5, .55], hip: [.18, -.14], kn: [.06, .22], hair: 'cap', bulk: 1.08, coat: 1 },
      { dress: { coat: '#2f4a3a', pants: '#1c2a24', shoes: '#0e1410', skin: '#d9a77e', hair: '#40382f', hairBack: '#c9c2b6' }, light: { x: SUN[0], y: SUN[1], col: '#ffb070', a: .6 }, shadeA: .3, shadeCol: '#0a140e', rim: '#ffcf8a', rimSide: 1, rimW: 2.2 });
    const [cx3, cy3] = father.hand(0); roughLine(ctx, [[cx3, cy3 - 4], [cx3 + 22, fy(cx3 + 22) - 2]], { w: 3, col: '#1a120c', seed: 3 });
    // daughter (near side): amber jacket; her front arm reaches across to hold his arm at the elbow
    person(ctx, dx, yD, sD, { lean: .04, head: .28, sh: [.62, -.18], el: [.75, .5], hip: [.14, -.2], kn: [.18, .1], hair: 'long' },
      { dress: { coat: '#e59a3a', pants: '#2a2c3a', shoes: '#14100c', skin: '#e9c3a0', hair: '#3a2214' }, light: { x: SUN[0], y: SUN[1], col: '#ffd9a0', a: .6 }, shadeA: .22, shadeCol: '#1a120a', rim: '#ffe0a8', rimSide: 1, rimW: 2.2 });
  }
  // warm haze over everything near the sun, and a soft light wrap on the crest
  bloom(ctx, SUN[0], SUN[1] + 60, 700, { col: ORANGE, core: GOLD, a: .18, k: .35, seed: 9, sy: .5, op: 'screen' });
  printFinish(ctx, { grain: .09, vig: .42, vigCol: '#06110c' });
  save(cv, out);
}
frame(process.argv[2] || 'a3.png');
