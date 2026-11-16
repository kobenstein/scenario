// s06_lake.mjs · 6.17–6.18: "What you give." / "But give long enough, and you run into a question no project can answer."
// You row your old father across the lake in low warm light; the oars dip on "give"; he points, a heron lifts off the
// reeds. The heron climbs; the camera follows it up the mountainside, through the cloud band, while the sky darkens to
// night, and settles on "answer" below the high meadow ridge (chapter 07 opens on that meadow).
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, lin, sm, eio, eout, ein, sine, drift, lay, big, spr, bloomL, poolL, fogL, vgrad, radial, glowAt, fig, drawFig, figAnim, lerpPose, camAt, paper, vignetteL, tintAll } from './s06_kit.mjs';
import { stipple, roughPath, roughPoly, roughRect, roughLine, hatch, vnoise, fbm, stratus, maskLinear, maskRadial } from './art.mjs';

const PH = 2160;                 // tall plate: sky + mountain (0 … ~1660), lake (1680 … 2160)
const HZ = 1680, SUN = [430, 1430], GOLD = '#ffc477', CREAM = '#fff1cf';
const n1 = vnoise(17);
const ridge = (x) => 640 - 120 * Math.exp(-Math.pow((x - 980) / 520, 2)) + 40 * fbm(n1, x * .003, 2, 4) - 20;   // the high meadow
const slope = (x, base, amp, f, seed) => base - amp * fbm(vnoise(seed), x * f, seed * .3, 4);
function mountain(night) {
  return big('s06:lkm' + (night ? 'n' : 'd'), () => {
    const [c, g] = lay(W, PH), r = prng(night ? 2 : 1);
    const base = night ? ['#0d1030', '#121640', '#161b4a', '#1a1f52'] : ['#4a4a6a', '#5a5470', '#6a5a6a', '#7a6262'];
    // the massif: the meadow ridge on top, rock bands below, then the forested lower slopes
    const layers = [
      { f: ridge, col: base[0], hc: night ? '#6a74b0' : '#f0c8a0', bot: 1180 },
      { f: (x) => slope(x, 930, 150, .0018, 31) + 120 * Math.exp(-Math.pow((x - 980) / 300, 2)), col: base[1], hc: night ? '#5a64a0' : '#f3c89a', bot: 1180 },
      { f: (x) => slope(x, 1615, 50, .003, 33), col: base[3], hc: night ? '#3a4480' : '#e8b088', bot: PH },
    ];
    for (const [i, L] of layers.entries()) {
      if (i === 2) { // cloud sea hiding the mountain's foot, lit from below by the low sun; haze under it
        const [cc, cx] = lay(W, PH); const rr = prng(5);
        for (let k = 0; k < 26; k++) { const y = 1000 + rr() * 170, x0 = -300 + rr() * 1900, w = 500 + rr() * 900; cx.beginPath(); stratus(cx, y, x0, x0 + w, 30 + rr() * 40, k + 3); cx.fillStyle = night ? mixHex('#2a3070', '#4a5294', rr()) : mixHex('#e8a890', '#ffd8b0', rr()); cx.fill(); }
        cx.save(); cx.globalCompositeOperation = 'source-atop'; hatch(cx, [0, 940, W, 280], { angle: -.02, gap: 4, col: night ? '#c8ccff' : '#fff2dc', a: .45, seed: 7, broken: .3 }); const gr = cx.createLinearGradient(0, 960, 0, 1200); gr.addColorStop(0, night ? 'rgba(200,200,255,.25)' : 'rgba(255,240,210,.45)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = gr; cx.fillRect(0, 900, W, 320); cx.restore();
        g.drawImage(cc, 0, 0);
        const hz = g.createLinearGradient(0, 1100, 0, 1300); hz.addColorStop(0, night ? 'rgba(40,46,110,.9)' : 'rgba(240,190,160,.9)'); hz.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = hz; g.fillRect(0, 1100, W, 200);
      }
      const pts = [[-20, L.bot]]; for (let x = -20; x <= W + 20; x += 8) pts.push([x, L.f(x)]); pts.push([W + 20, L.bot]);
      roughPoly(g, pts, L.col, { amp: 1.4, seed: i + 3 });
      g.save(); g.beginPath(); roughPath(g, pts, { amp: 1.4, seed: i + 3 }); g.clip();
      if (!night) radial(g, SUN[0], SUN[1], 1400, [[0, rgba(GOLD, .45 - i * .06)], [1, rgba(GOLD, 0)]]);
      else { const gr = g.createLinearGradient(0, L.f(980) - 10, 0, L.f(980) + 160); gr.addColorStop(0, rgba('#c9b0ff', .14)); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, PH); }
      if (i < 2) { const gr = g.createLinearGradient(0, 800, 0, 1150); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, night ? 'rgba(40,46,110,.8)' : 'rgba(230,170,150,.8)'); g.fillStyle = gr; g.fillRect(0, 800, W, 400); }
      const [hc, hx] = lay(W, PH), rr = prng(40 + i); hx.strokeStyle = L.hc; hx.lineCap = 'round';
      for (let k = 1; k < 30; k++) { const off = k * (6 + i * 2) * (1 + k * .05); let x = -20 + rr() * 60; while (x < W) { const len = 30 + rr() * 170; hx.globalAlpha = (night ? .25 : .4) * (.4 + .6 * rr()); hx.lineWidth = 1; hx.beginPath(); for (let xx = x; xx < Math.min(W + 20, x + len); xx += 6) hx.lineTo(xx, L.f(xx) + off + (n1(xx * .02, k + i * 30) - .5) * 3); hx.stroke(); x += len + 10 + rr() * 70; } }
      g.drawImage(hc, 0, 0); g.restore();
    }
    // the meadow on top: pale grass strokes along the crest + the path that zig-zags up to it
    { const rr = prng(9); g.strokeStyle = night ? '#8a90c8' : '#f8dca8'; for (let k = 0; k < 2600; k++) { const x = rr() * W, y = ridge(x) + Math.pow(rr(), 2) * 160; g.globalAlpha = (night ? .25 : .35) * rr(); g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rr() - .4) * 3, y - 3 - rr() * 6); g.stroke(); } g.globalAlpha = 1; }
    { const P = [[1040, 860], [1000, 790], [1035, 720], [990, 670], [980, ridge(980) + 4]]; g.strokeStyle = night ? 'rgba(210,200,255,.3)' : 'rgba(255,230,190,.35)'; g.lineWidth = 2.5; g.setLineDash([8, 7]); g.beginPath(); P.forEach((p, i) => i ? g.lineTo(...p) : g.moveTo(...p)); g.stroke(); g.setLineDash([]); }
    fogL(g, { y0: 1540, y1: 1700, col: night ? '#3a3a7a' : '#f0b898', a: .5, seed: 11, cover: .7, soft: .5, k: .3, sx: .003, sy: .03 });
    // far shore tree line
    { const rr = prng(12); g.fillStyle = night ? '#0a0c26' : '#5a4a6a'; g.beginPath(); g.moveTo(0, HZ + 2); for (let x = 0; x <= W + 40;) { const w = 18 + rr() * 34, h = 14 + rr() * 26; g.quadraticCurveTo(x + w / 2, HZ - h * 2, x + w, HZ - rr() * 6); x += w; } g.lineTo(W, HZ + 2); g.fill(); }
    // the lake
    vgrad(g, 0, HZ, W, PH - HZ, night ? [[0, '#2a2a5a'], [.3, '#14183e'], [1, '#070818']] : [[0, '#f0c0a0'], [.25, '#a88aa8'], [1, '#2e2a5a']]);
    { const rr = prng(13); for (let i = 0; i < 1100; i++) { const y = HZ + Math.pow(rr(), 1.5) * (PH - HZ), d = (y - HZ) / (PH - HZ), x = rr() * W, near = Math.max(0, 1 - Math.abs(x - SUN[0]) / (220 + d * 500)); g.fillStyle = rgba(near > .1 && !night ? '#fff0d4' : (night ? '#8a90d0' : '#e8c8d8'), (night ? .1 : (.12 + .55 * near)) * (.4 + rr() * .6)); g.fillRect(x, y, 6 + d * 40 * rr(), 1.4 + d * 1.5); } }
    // reeds on the right shore (the heron's)
    { const rr = prng(14); for (let i = 0; i < 90; i++) { const x = 1480 + rr() * 460, h = 60 + rr() * 170, y = HZ + 120 + rr() * 40; g.strokeStyle = night ? '#060818' : '#2a2042'; g.lineWidth = 2 + rr() * 2.5; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 2, y - h * .5, x + (rr() - .3) * 14, y - h); g.stroke(); if (!night && rr() < .4) { g.strokeStyle = rgba('#ffd0a0', .6); g.lineWidth = 1.5; g.beginPath(); g.moveTo(x + 1, y - h * .9); g.lineTo(x + 2, y - h); g.stroke(); } } }
    return c;
  });
}
// ----------------------------------------------------------- the heron (side view, flying left→up, facing -x)
function heron(ctx, x, y, s, flap, { standing = 0, col = '#1c1636', rim = '#ffcf9a', rimA = .8 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(-s, s);   // facing +x in local, flipped to fly left
  const draw = (c) => {
    ctx.fillStyle = c; ctx.strokeStyle = c;
    // body
    ctx.beginPath(); ctx.ellipse(0, 0, 40, 12, -.1 - standing * .6, 0, 7); ctx.fill();
    // neck (tucked S in flight, up when standing) + head + bill
    ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath();
    if (standing > .5) { ctx.moveTo(30, -12); ctx.quadraticCurveTo(46, -40, 36, -64); ctx.stroke(); ctx.beginPath(); ctx.ellipse(40, -68, 9, 6, .1, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(46, -70); ctx.lineTo(74, -64); ctx.lineTo(46, -64); ctx.fill(); }
    else { ctx.moveTo(32, -4); ctx.quadraticCurveTo(48, -2, 44, -14); ctx.stroke(); ctx.beginPath(); ctx.ellipse(50, -16, 9, 6, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(56, -18); ctx.lineTo(86, -14); ctx.lineTo(56, -12); ctx.fill(); }
    // legs: trailing in flight, down when standing
    ctx.lineWidth = 2.6; ctx.beginPath(); if (standing > .5) { ctx.moveTo(-4, 8); ctx.lineTo(-8, 60); ctx.moveTo(6, 8); ctx.lineTo(10, 60); } else { ctx.moveTo(-34, 4); ctx.lineTo(-92, 12); } ctx.stroke();
    // wings: broad, fingered tips; flap angle
    const a = flap;
    for (const side of [-1, 1]) { const k = side < 0 ? .7 : 1; ctx.globalAlpha = side < 0 ? .75 : 1; ctx.beginPath(); ctx.moveTo(-14, -6); ctx.quadraticCurveTo(-30, -6 - 70 * a * k, 2 - 20 * a, -10 - 110 * a * k); ctx.lineTo(16 - 14 * a, -8 - 104 * a * k); ctx.quadraticCurveTo(8, -40 * a * k, 18, -6); ctx.closePath(); ctx.fill(); }
    ctx.globalAlpha = 1;
  };
  ctx.save(); ctx.translate(-1.5, -1.5); ctx.globalAlpha = rimA; draw(rim); ctx.restore(); ctx.globalAlpha = 1; draw(col);
  ctx.restore();
}
// ----------------------------------------------------------- figures in the boat
const BOAT = { x: 820, y: 1840 };
const ROW_A = { lean: -.35, head: .05, sh: [1.6, 1.4], el: [.2, .25], hip: [1.5, 1.5], kn: [1.3, 1.3], hair: 'long' };   // catch (arms forward)
const ROW_B = { lean: .18, head: .12, sh: [.55, .4], el: [1.5, 1.55], hip: [1.5, 1.5], kn: [1.45, 1.45], hair: 'long' }; // finish (pulled back)
const FA_R = { lean: .05, head: .1, sh: [.9, .6], el: [.9, .9], hip: [1.5, 1.5], kn: [1.4, 1.4], hair: 'grey', bulk: 1.12, coat: 1 };
const FA_P = { lean: -.05, head: -.45, sh: [2.45, .7], el: [.05, .9], hip: [1.5, 1.5], kn: [1.4, 1.4], hair: 'grey', bulk: 1.12, coat: 1 };
export function lake(ctx, t, s, A) {
  const tg = A.give, tA = A.answer;
  const rise = eio(lin(tg + .55, tA + .25, t));
  const night = sm(lin(tg + .9, tA + .6, t));
  const camY = mix(1690, 560, rise), camX = mix(1010, 965, rise) + drift(t, 6, 1) * (1 - rise * .6);
  const z = mix(1.28, 1.06, rise) + .02 * Math.sin(t * .3);
  const M = { k: z, X: (x) => W / 2 + (x - camX) * z, Y: (y) => H / 2 + (y - camY) * z };
  ctx.save(); ctx.setTransform(z, 0, 0, z, W / 2 - camX * z, H / 2 - camY * z);
  // sky: warm low sun → night
  { const top = mixHex('#2a3a6a', '#03051a', night), mid = mixHex('#d88a8a', '#0c1240', night), low = mixHex('#ffc888', '#3a2a50', night);
    const g = ctx.createLinearGradient(0, 0, 0, HZ); g.addColorStop(0, top); g.addColorStop(.55, mid); g.addColorStop(.9, low); g.addColorStop(1, low); ctx.fillStyle = g; ctx.fillRect(-200, -300, W + 400, HZ + 300);
    // gold left behind over the ridge
    radial(ctx, 980, 640, 900, [[0, rgba('#ffb070', .35 * night)], [1, rgba('#ffb070', 0)]], { sy: .35 });
    // sun (sinks as it gets late) and stars
    const sy = SUN[1] + 140 * night; glowAt(ctx, SUN[0], sy, 520, .5 * (1 - night), '#ff9a50', '#fff4dc'); ctx.fillStyle = rgba('#fff6e0', 1 - night); ctx.beginPath(); ctx.arc(SUN[0], sy, 40, 0, 7); ctx.fill();
    const rr = prng(4); for (let i = 0; i < 380; i++) { const x = rr() * W, y = rr() * 900 - 100, m = rr(), a = night * (.2 + .7 * m * m) * (.7 + .3 * Math.sin(t * (1 + m) + i)); ctx.fillStyle = rgba('#e8ecff', a); const sz = m > .95 ? 2.4 : 1.4; ctx.fillRect(x, y, sz, sz); } }
  // mountain + lake, day → night
  ctx.drawImage(mountain(false), 0, 0); if (night > 0) { ctx.globalAlpha = night; ctx.drawImage(mountain(true), 0, 0); ctx.globalAlpha = 1; }
  // ---- the boat
  const glide = (t - s.a) * 22, bx = BOAT.x + glide, by = BOAT.y + Math.sin(t * 1.3) * 2;
  // rowing phase: the blades enter the water exactly on "give"
  const per = 1.9, ph = (((t - tg) / per) % 1 + 1.25) % 1;           // ph .25 = catch on "give"
  const pull = ph < .25 ? sine(ph / .25) : ph < .75 ? 1 - sine((ph - .25) / .5) : 0;   // 0 = catch (forward) … 1 = finish
  const bladeIn = ph >= .25 && ph < .75;
  const sc = 1.25, rx = bx + 90, ry = by - 52, fx = bx - 230, fy = by - 50;
  const R = figAnim('lk-row', 12, pull, sc, (q) => lerpPose(ROW_A, ROW_B, q), { flip: true, dress: { coat: '#e59a3a', pants: '#2a2c3a', shoes: '#14100c', skin: '#e9c3a0', hair: '#3a2214' }, light: { dx: -500, dy: -100, col: '#ffd9a0', a: .55 }, rim: '#ffe0a8', rimSide: -1, rimW: 2.4, shadeA: .15 });
  const point = eio(lin(tg + .2, tg + .75, t));
  const F = figAnim('lk-fa', 8, point, sc * .98, (q) => lerpPose(FA_R, FA_P, q), { dress: { coat: '#2f4a3a', pants: '#1c2a24', shoes: '#0e1410', skin: '#d9a77e', hair: '#40382f', hairBack: '#c9c2b6' }, light: { dx: -500, dy: -100, col: '#ffb070', a: .55 }, rim: '#ffcf8a', rimSide: -1, rimW: 2.4, shadeA: .25 });
  // far oar
  const [h2x, h2y] = R.hand(1), lockX = rx + 70, lockY = by - 44;
  const bladeF = [lockX + mix(220, 80, pull) * .8, by + (bladeIn ? 16 : -6)];
  roughLine(ctx, [[rx + h2x, ry + h2y], [lockX, lockY], bladeF], { w: 5, col: '#3a2a40', seed: 3 });
  drawFig(ctx, F, fx, fy, t, { breath: 1.2, feet: false });
  drawFig(ctx, R, rx, ry, t, { breath: 1, feet: false, sway: .5 });
  // hull in front (wood, a lit gunwale)
  ctx.fillStyle = '#3a2a3a'; ctx.beginPath(); ctx.moveTo(bx - 360, by - 50); ctx.lineTo(bx + 320, by - 48); ctx.quadraticCurveTo(bx + 400, by - 56, bx + 430, by - 76); ctx.quadraticCurveTo(bx + 370, by + 10, bx + 250, by + 14); ctx.lineTo(bx - 300, by + 14); ctx.quadraticCurveTo(bx - 360, by + 4, bx - 360, by - 50); ctx.fill();
  ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(0,0,0,.25)'; for (let k = 0; k < 4; k++) ctx.fillRect(bx - 360, by - 34 + k * 12, 800, 2); hatch(ctx, [bx - 360, by - 60, 800, 80], { angle: .8, gap: 6, col: '#0a0610', a: .3, seed: 5, broken: .4 }); ctx.restore();
  ctx.fillStyle = rgba(mixHex('#ffdcae', '#a8a0e0', night), .85); ctx.fillRect(bx - 360, by - 52, 680, 3);
  // near oar + blade, rings when it dips
  const [h1x, h1y] = R.hand(0), blade = [lockX + mix(260, 100, pull), by + (bladeIn ? 26 : 2)];
  roughLine(ctx, [[rx + h1x, ry + h1y], [lockX + 4, lockY + 2], blade], { w: 6, col: '#4a3448', seed: 4 });
  ctx.save(); ctx.translate(blade[0], blade[1]); ctx.rotate(.25); ctx.fillStyle = '#4a3448'; ctx.beginPath(); ctx.ellipse(16, 0, 30, 8, 0, 0, 7); ctx.fill(); ctx.restore();
  for (let k = 0; k < 4; k++) { const dipT = tg + (k - 2) * per, v = (t - dipT) / 2.2; if (v <= 0 || v >= 1) continue; const cx = blade[0] - (t - dipT) * 22 + 10; ctx.strokeStyle = rgba('#fff0d4', .45 * (1 - v)); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(cx, by + 24, 20 + v * 130, 4 + v * 16, 0, 0, 7); ctx.stroke(); }
  // boat reflection + wake
  ctx.save(); ctx.globalAlpha = .3; for (let y = 0; y < 90; y += 3) { ctx.fillStyle = rgba('#1b1438', .9 * (1 - y / 90)); ctx.fillRect(bx - 330 + Math.sin(y * .3 + t) * 8, by + 16 + y, 700 - y * 2, 2); } ctx.restore();
  for (let k = 0; k < 6; k++) { ctx.strokeStyle = rgba('#fff0d4', (.25 - k * .035) * (1 - night * .6)); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(bx - 370 - k * 40, by + 14 + k * 4); ctx.lineTo(bx - 450 - k * 60, by + 10 + k * 9); ctx.stroke(); }
  // ---- the heron: standing in the reeds, lifts off as he points, climbs toward the ridge
  const tL = tg + .35, fl = lin(tL, tA + .45, t);
  const P0 = [1640, 1790], P1 = [1400, 1380], P2 = [1080, 900], P3 = [962, 470];
  const bez = (u) => { const a = 1 - u; return [a * a * a * P0[0] + 3 * a * a * u * P1[0] + 3 * a * u * u * P2[0] + u * u * u * P3[0], a * a * a * P0[1] + 3 * a * a * u * P1[1] + 3 * a * u * u * P2[1] + u * u * u * P3[1]]; };
  const fu = fl <= 0 ? 0 : Math.min(1, sine(fl) * .85 + fl * .15);
  const [hx, hy] = bez(fu), hs = mix(1.15, .6, Math.pow(fu, .8));
  const flap = fl <= 0 ? .1 : .55 + .45 * Math.sin((t - tL) * mix(9, 6, fu)), stand = 1 - sm(lin(tL - .05, tL + .25, t));
  const hc = mixHex('#1c1636', '#0a0c22', night), hr = mixHex('#ffcf9a', '#f3efe2', night);
  if (stand > .5) { for (let k = 0; k < 2; k++) { const v = ((t * .4 + k / 2) % 1); ctx.strokeStyle = rgba('#fff0d4', .35 * (1 - v)); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.ellipse(P0[0], P0[1] + 60, 16 + v * 60, 3 + v * 9, 0, 0, 7); ctx.stroke(); } }
  heron(ctx, hx, hy - (stand > .5 ? 0 : 0), hs, stand > .5 ? 0 : flap, { standing: stand, col: hc, rim: hr, rimA: .8 });
  // a few water drops falling from its legs at take-off
  if (fl > 0 && fl < .15) for (let k = 0; k < 6; k++) { const v = (t - tL) * 3; ctx.fillStyle = rgba('#fff0d4', .6 * (1 - v)); ctx.beginPath(); ctx.arc(P0[0] + 20 + k * 6, P0[1] + 40 + v * 80 + k * 6, 2, 0, 7); ctx.fill(); }
  ctx.restore();
  vignetteL(ctx, .35 + .15 * night, '#03040e'); paper(ctx, .08, t);
  void M; void C;
}
