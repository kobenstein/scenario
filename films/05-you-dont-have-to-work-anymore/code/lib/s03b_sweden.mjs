// s03b_sweden · plates for 3.26 (snowy Swedish street, blue hour), 3.27 (the workshop) and 3.28 [G2] (lottery chart
// landscape seen through the frosted workshop window; look = approved art test ref/kunst/g1.mjs).
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, layer, put, stipple, maskLinear, maskRadial, roughPath, roughPoly, roughRect, roughLine, hatch, fog, cone, pool, bloom, house, person, castShadow, printFinish, vnoise, facade, quadMap, quadIn, limb, qpts, soften, DRESS } from './art.mjs';
import { once, pool2, bloom2 } from './s03b_kit.mjs';
import { text } from '../engine.mjs';

// =====================================================================================================
// 3.26 · Snowy street. VP at the end of the street; houses with snow roofs; ONE hero light = the workshop
// window on the right ("VERKSTAD"); street lamps small. Layers: sky (far), town (mid), ground, foreground.
export const ST = { VP: [900, 585], win: [1394, 640] };
const Lp = (t) => [mix(ST.VP[0], -260, t), mix(ST.VP[1], 1180, t)];
const Rp = (t) => [mix(ST.VP[0], 2200, t), mix(ST.VP[1], 1180, t)];
export function streetPlates() {
  return once('st', () => {
    const VP = ST.VP;
    // ---- far: sky + hills + church at the end of the street
    const [sky, sx] = layer();
    { const g = sx.createLinearGradient(0, 0, 0, VP[1] + 40); g.addColorStop(0, '#060b22'); g.addColorStop(.45, '#142a4c'); g.addColorStop(.85, '#3f6584'); g.addColorStop(1, '#7d9db3'); sx.fillStyle = g; sx.fillRect(0, 0, W, H); }
    { const r = prng(4); for (let i = 0; i < 180; i++) { const x = r() * W, y = Math.pow(r(), 1.8) * 360, m = r(); sx.fillStyle = rgba('#dfe8ff', .1 + .5 * m * m); sx.fillRect(x, y, m > .95 ? 2 : 1, m > .95 ? 2 : 1); } }
    for (let k = 0; k < 4; k++) { sx.save(); sx.beginPath(); stratusPath(sx, 160 + k * 46, -100 + k * 300, 900 + k * 330, 10 + k * 3, 30 + k); sx.fillStyle = rgba('#5d7f9c', .18); sx.fill(); sx.restore(); }
    roughPoly(sx, [[-10, VP[1] - 10], [240, VP[1] - 62], [520, VP[1] - 40], [760, VP[1] - 86], [1080, VP[1] - 52], [1400, VP[1] - 90], [1700, VP[1] - 46], [1930, VP[1] - 70], [1930, VP[1] + 30], [-10, VP[1] + 30]], '#2c4864', { amp: 3, step: 14, seed: 2 });
    // snow on the far hills: pale stippled top edge
    { const [c, g] = layer(); g.fillStyle = '#c3d3e2'; g.beginPath(); roughPath(g, [[-10, VP[1] - 10], [240, VP[1] - 62], [520, VP[1] - 40], [760, VP[1] - 86], [1080, VP[1] - 52], [1400, VP[1] - 90], [1700, VP[1] - 46], [1930, VP[1] - 70], [1930, VP[1] - 40], [-10, VP[1] - 10]], { amp: 3, step: 14, seed: 2, closed: false }); g.lineTo(1930, VP[1] + 30); g.lineTo(-10, VP[1] + 30); g.closePath(); g.fill(); maskLinear(c, 0, VP[1] - 90, 0, VP[1] + 10, [[0, .55], [.5, .15], [1, 0]]); stipple(c, { k: .8, seed: 3 }); put(sx, c); }
    // church: wooden, steep roof, small spire, two lit windows
    { const x = 925, y = VP[1] + 6; roughPoly(sx, [[x - 34, y], [x - 34, y - 44], [x, y - 80], [x + 34, y - 44], [x + 34, y]], '#20344c', { amp: .6, seed: 5 }); roughPoly(sx, [[x - 8, y - 70], [x - 8, y - 120], [x, y - 150], [x + 8, y - 120], [x + 8, y - 70]], '#1c2f46', { amp: .4, seed: 6 });
      roughPoly(sx, [[x - 34, y - 44], [x, y - 80], [x + 34, y - 44], [x + 30, y - 40], [x, y - 72], [x - 30, y - 40]], '#b9c9d8', { amp: .4, seed: 7 });
      sx.fillStyle = rgba(C.amberHot, .85); sx.fillRect(x - 16, y - 30, 6, 10); sx.fillRect(x + 10, y - 30, 6, 10); }
    fog(sx, { y0: VP[1] - 120, y1: VP[1] + 60, col: '#8fb0c6', a: .55, seed: 8, cover: .75, soft: .45, k: .25, sx: .004, sy: .03, edgeTop: .6, edgeBot: .3 });

    // ---- town: the two house rows in perspective, snow roofs, a few warm windows
    const [town, tx] = layer();
    const walls = ['#3a2430', '#2a3a52', '#3c3a46', '#4a3a34', '#28364c', '#3e2a34'];
    const r = prng(23);
    const row = (side, ts, hs) => {
      const P = side < 0 ? Lp : Rp, out = [];
      for (let i = ts.length - 2; i >= 0; i--) {
        const ta = ts[i], tb = ts[i + 1], A = P(ta), B = P(tb), h = hs[i], topA = [A[0], A[1] - h * ta], topB = [B[0], B[1] - h * tb];
        const q = side < 0 ? [topB, topA, A, B] : [topA, topB, B, A];
        const wall = walls[(i + (side > 0 ? 3 : 0)) % walls.length], fogA = Math.pow(clamp(1 - ta / .75), 2) * .55;
        // pitched snow roof receding away from the street (a lean-to plane above the facade)
        const rh = h * .2, out2 = side < 0 ? -1 : 1, rA = [topA[0] + out2 * rh * .55 * ta, topA[1] - rh * ta], rB = [topB[0] + out2 * rh * .55 * tb, topB[1] - rh * tb];
        roughPoly(tx, [topA, topB, rB, rA], '#a9bccd', { amp: .8, seed: i * 3 + side });
        { tx.save(); tx.beginPath(); roughPath(tx, [topA, topB, rB, rA], { amp: .8, seed: i * 3 + side }); tx.clip(); const g = tx.createLinearGradient(0, rA[1], 0, topA[1]); g.addColorStop(0, 'rgba(230,240,250,.5)'); g.addColorStop(1, 'rgba(40,60,90,.25)'); tx.fillStyle = g; tx.fillRect(0, 0, W, H);
          hatch(tx, [Math.min(topA[0], rB[0]) - 10, Math.min(rA[1], rB[1]) - 10, Math.abs(topB[0] - topA[0]) + 200, Math.abs(topB[1] - rB[1]) + 40], { angle: side < 0 ? .5 : -.5, gap: 6, w: 1, col: '#5c7894', a: .25, seed: i + 40 }); tx.restore(); }
        const m = facade(tx, r, q, { wall, floors: 2 + (r() < .4 ? 1 : 0), cols: Math.max(2, Math.round((Math.abs(B[0] - A[0])) / (150 * tb + 20))), top: .14, bottom: .92, ww: .34, wh: .5, style: [0, 3, 2][i % 3],
          lit: (f, c, rr) => (rr() < .34 ? .7 + rr() * .3 : 0), winOn: '#ffc679', winOff: shade(wall, -.05), trimCol: '#c9d7e4', skip: .05, amp: 1.2,
          shade: [[0, rgba('#9fbcd4', .06)], [1, rgba('#000000', .12)]], fogA, fogCol: '#7f9fb8', edgeLight: rgba('#cfe0f0', .14) });
        // vertical boards (wooden houses): faint hatch inside the facade
        { tx.save(); tx.beginPath(); roughPath(tx, q, { amp: 1.2, seed: i }); tx.clip(); const xs = q.map((p) => p[0]), ys = q.map((p) => p[1]); hatch(tx, [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)], { angle: Math.PI / 2, gap: 5 + 6 * ta, w: 1, col: '#000000', a: .16, seed: i + 90, broken: .3 }); tx.restore(); }
        // snow on the cornice
        roughPoly(tx, [topA, topB, [topB[0], topB[1] + 7 * tb], [topA[0], topA[1] + 7 * ta]], '#dbe6f0', { amp: .6, seed: i + 7 });
        out.push({ m, q, ta, tb, A, B });
      }
      return out;
    };
    const left = row(-1, [.06, .14, .24, .36, .5, .68, .9, 1.2], [520, 600, 470, 640, 560, 600, 700]);
    const right = row(1, [.06, .12, .2, .3, .42, .56, .78, 1.1], [560, 480, 620, 520, 600, 640, 620]);
    // the workshop: right row segment 5 (t .56–.78), a big shop window with the warm interior, a hanging sign
    const shop = right.find((s) => Math.abs(s.ta - .56) < 1e-6);
    const sm2 = shop.m, wq = quadIn(sm2, .18, .36, .78, .86);
    roughPoly(tx, quadIn(sm2, .15, .32, .81, .89), '#20160f', { amp: .5, seed: 71 });
    { tx.save(); tx.beginPath(); roughPath(tx, wq, { amp: .5, seed: 72 }); tx.clip();
      const [x0, y0] = wq[0], [x1, y1] = wq[2], g = tx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#ffcf8a'); g.addColorStop(.6, '#f2a04e'); g.addColorStop(1, '#a8582a'); tx.fillStyle = g; tx.fillRect(x0 - 10, Math.min(y0, wq[1][1]) - 10, x1 - x0 + 20, y1 - y0 + 60);
      const mw = quadMap(wq);
      // inside: tool board, a hanging lamp, the bench and a figure planing (silhouettes)
      for (let k = 0; k < 7; k++) { const [px, py] = mw(.1 + k * .11, .18); tx.fillStyle = rgba('#5a2a12', .55); tx.fillRect(px - 2, py, 4, 26 + (k % 3) * 10); }
      const [lx, ly] = mw(.55, .02); tx.strokeStyle = '#3a1a0a'; tx.lineWidth = 2; tx.beginPath(); tx.moveTo(lx, ly - 20); tx.lineTo(lx, ly + 16); tx.stroke(); tx.fillStyle = '#3a1a0a'; tx.beginPath(); tx.ellipse(lx, ly + 22, 16, 9, 0, Math.PI, 0); tx.fill();
      roughPoly(tx, [mw(-.05, .66), mw(1.05, .62), mw(1.05, .74), mw(-.05, .78)], '#4a2210', { amp: .5, seed: 73 });
      roughPoly(tx, [mw(.1, .74), mw(.14, .74), mw(.14, 1.1), mw(.1, 1.1)], '#4a2210', { amp: .3, seed: 74 }); roughPoly(tx, [mw(.86, .72), mw(.9, .72), mw(.9, 1.1), mw(.86, 1.1)], '#4a2210', { amp: .3, seed: 75 });
      const [fx, fy] = mw(.36, .64); person(tx, fx, fy, .62, { lean: .3, sh: [1.25, 1.15], el: [.45, .55], hip: [.2, -.1], kn: [.1, .1], hair: 'short' }, { dress: { coat: '#5a2a14', pants: '#3a1a0c', skin: '#7a3a1c', hair: '#2a1208', shoes: '#2a1208' } });
      tx.restore(); }
    // mullions + snow on the sill
    { tx.strokeStyle = '#20160f'; tx.lineWidth = 4; const [a, b] = [sm2(.48, .36), sm2(.48, .86)]; tx.beginPath(); tx.moveTo(...a); tx.lineTo(...b); tx.stroke(); }
    roughPoly(tx, quadIn(sm2, .13, .885, .83, .92), '#e2ecf4', { amp: .5, seed: 76 });
    // hanging sign
    { const [sx0, sy0] = sm2(.9, .22); tx.strokeStyle = '#14100c'; tx.lineWidth = 3; tx.beginPath(); tx.moveTo(sx0, sy0); tx.lineTo(sx0 + 80, sy0 - 6); tx.stroke();
      roughRect(tx, sx0 + 30, sy0 + 2, 120, 40, '#2a1a10', { amp: .6, seed: 77 }); roughRect(tx, sx0 + 30, sy0 - 4, 120, 6, '#dfe9f2', { amp: .5, seed: 78 });
      text(tx, 'VERKSTAD', sx0 + 90, sy0 + 28, { size: 15, weight: 600, color: '#e9c48a', align: 'center', spacing: 2 }); }
    ST.shopWin = (() => { const c0 = sm2(.48, .6); return c0; })();

    // ---- ground: snow-covered street, tyre tracks to the VP, kerbs
    const [gnd, gx] = layer();
    { const pts = [Lp(0), Lp(1.25), Rp(1.25), Rp(0)]; gx.save(); gx.beginPath(); gx.moveTo(VP[0], VP[1] - 1); gx.lineTo(...Lp(1.3)); gx.lineTo(...Rp(1.3)); gx.closePath(); gx.clip();
      const g = gx.createLinearGradient(0, VP[1], 0, H); g.addColorStop(0, '#7b93ae'); g.addColorStop(.35, '#7088a6'); g.addColorStop(1, '#9cb0c6'); gx.fillStyle = g; gx.fillRect(0, VP[1] - 2, W, H);
      // blue shadow cast by the left row
      gx.fillStyle = rgba('#2c4466', .45); gx.beginPath(); gx.moveTo(...VP); gx.lineTo(...Lp(1.3)); gx.lineTo(Lp(1.3)[0] + 700, H + 50); gx.closePath(); gx.fill();
      hatch(gx, [0, VP[1], W, H - VP[1]], { angle: -.03, gap: 7, w: 1, col: '#4d6788', a: .28, seed: 31, broken: .5 });
      // sparkle: the snow catches light as fine stipple
      { const r2 = prng(33); for (let i = 0; i < 1200; i++) { const y = VP[1] + Math.pow(r2(), .7) * (H - VP[1]), x = r2() * W; gx.fillStyle = rgba('#eef4fb', .25 + .5 * r2()); gx.fillRect(x, y, 1, 1); } }
      // tyre tracks
      for (const off of [-150, -60, 70, 160]) { const pts2 = []; for (let k = 0; k <= 30; k++) { const q = k / 30, tt = .02 + q * 1.2; pts2.push([mix(VP[0], VP[0] + off * 8, tt), mix(VP[1], 1180, tt)]); } roughLine(gx, pts2, { w: 3, col: rgba('#55708e', .45), seed: off + 300, amp: .5 }); }
      gx.restore(); }
    // workshop light falling onto the snow (smooth core + stipple)
    pool2(gx, 1300, 860, 520, 130, { col: '#ffb860', a: .5, k: .4, seed: 41, rot: -.12 });
    // street lamps (left), small warm pools
    const lamps = [];
    for (const tt of [.3, .55, .85]) { const [x, y] = Lp(tt), lx = x + 60 * tt, ly = y - 520 * tt; lamps.push([lx, ly, tt]); pool2(gx, lx + 40 * tt, y + 10 * tt, 220 * tt, 50 * tt, { col: '#ffc679', a: .45, k: .7, seed: Math.round(tt * 100) }); }

    // ---- lamps, cones and the shop light on the town layer
    for (const [lx, ly, tt] of lamps) { roughLine(tx, [[lx, ly], [lx, ly + 520 * tt]], { w: 6 * tt + 1, col: '#0d1424', seed: Math.round(tt * 50) }); roughLine(tx, [[lx, ly], [lx + 26 * tt, ly + 4 * tt]], { w: 4 * tt + 1, col: '#0d1424', seed: 3 });
      tx.fillStyle = '#ffe7b8'; tx.beginPath(); tx.ellipse(lx + 26 * tt, ly + 12 * tt, 9 * tt + 1, 6 * tt + 1, 0, 0, 7); tx.fill(); }
    for (const [lx, ly, tt] of lamps) { cone(tx, lx + 26 * tt, ly + 12 * tt, { spread: .38, len: 520 * tt, col: '#ffc679', a: .28, k: .7, seed: Math.round(tt * 70), soft: .5 }); bloom2(tx, lx + 26 * tt, ly + 12 * tt, 90 * tt + 10, { a: .5, k: .3, seed: 9 }); }
    { const [cx, cy] = ST.shopWin; cone(tx, cx, cy, { dir: -.95, spread: .5, len: 600, col: '#ffb860', a: .3, k: .7, seed: 51, soft: .6 }); bloom2(tx, cx, cy, 380, { col: '#ffb35c', core: '#ffe3b0', a: .45, k: .45, seed: 52 }); }

    // ---- foreground: snowbank right, birch left (near the lens)
    const [fg, fx] = layer();
    roughPoly(fx, [[-20, 1000], [180, 960], [420, 1000], [520, 1100], [-20, 1100]], '#d7e2ec', { amp: 4, step: 10, seed: 61 });
    roughPoly(fx, [[1500, 1100], [1640, 1010], [1820, 985], [1940, 1000], [1940, 1100]], '#cbd8e5', { amp: 4, step: 10, seed: 62 });
    { fx.save(); fx.beginPath(); roughPath(fx, [[-20, 1000], [180, 960], [420, 1000], [520, 1100], [-20, 1100]], { amp: 4, step: 10, seed: 61 }); fx.clip(); hatch(fx, [-20, 950, 560, 160], { angle: -.25, gap: 6, col: '#7d97b2', a: .35, seed: 63 }); fx.restore(); }
    return { sky, town, gnd, fg };
  });
}
function stratusPath(ctx, y, x0, x1, th, seed) { const n = vnoise(seed); ctx.moveTo(x0, y);
  for (let x = x0; x <= x1; x += 12) { const q = (x - x0) / (x1 - x0), taper = Math.pow(Math.sin(Math.PI * q), .6); ctx.lineTo(x, y - th * taper * (.55 + .45 * n(x * .01, 1))); }
  for (let x = x1; x >= x0; x -= 12) { const q = (x - x0) / (x1 - x0), taper = Math.pow(Math.sin(Math.PI * q), .8); ctx.lineTo(x, y + th * .4 * taper * (.6 + .4 * n(x * .013, 2))); }
  ctx.closePath(); }

// =====================================================================================================
// 3.27 · The workshop: back wall with a tool board, the frosted window (upper right) with snow outside,
// ONE hanging lamp over the bench. The figure planes behind the bench (bench in front hides the legs).
export const WS = { win: [1450, 300], lamp: [800, 150] };
export function workshopPlates() {
  return once('ws', () => {
    const [back, bx] = layer();
    // back wall: planks, warm near the lamp, indigo in the corners
    { const g = bx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#24151a'); g.addColorStop(.6, '#3a2216'); g.addColorStop(1, '#1c1218'); bx.fillStyle = g; bx.fillRect(0, 0, W, H); }
    { const r = prng(3); for (let x = -20; x < W; x += 70 + r() * 30) { roughRect(bx, x, -10, 3, 800, rgba('#120a0c', .6), { amp: .6, seed: x | 0 }); } }
    hatch(bx, [0, 0, W, 800], { angle: 1.52, gap: 9, w: 1, col: '#0e0808', a: .22, seed: 4, broken: .4 });
    // floor
    { const g = bx.createLinearGradient(0, 760, 0, H); g.addColorStop(0, '#2c1a12'); g.addColorStop(1, '#120c10'); roughPoly(bx, [[-10, 770], [W + 10, 740], [W + 10, H + 10], [-10, H + 10]], null, { amp: 1, seed: 5 }); bx.fillStyle = g; bx.fill(); }
    hatch(bx, [0, 760, W, 320], { angle: -.05, gap: 9, w: 1, col: '#5a3a24', a: .18, seed: 6, broken: .5 });
    // window: night blue, snowy roofs, a lamp; frost on the panes
    const [wx0, wy0, ww, wh] = [1290, 150, 330, 300];
    { bx.save(); roughRect(bx, wx0 - 18, wy0 - 18, ww + 36, wh + 44, '#1a0f0a', { amp: .8, seed: 7 }); bx.beginPath(); roughPath(bx, [[wx0, wy0], [wx0 + ww, wy0], [wx0 + ww, wy0 + wh], [wx0, wy0 + wh]], { amp: .6, seed: 8 }); bx.clip();
      const g = bx.createLinearGradient(0, wy0, 0, wy0 + wh); g.addColorStop(0, '#0e1c3c'); g.addColorStop(1, '#4a6a8a'); bx.fillStyle = g; bx.fillRect(wx0, wy0, ww, wh);
      const r = prng(9); let x = wx0 - 10; while (x < wx0 + ww) { const w = 40 + r() * 50, h = 50 + r() * 60; roughPoly(bx, [[x, wy0 + wh], [x, wy0 + wh - h], [x + w / 2, wy0 + wh - h - 26], [x + w, wy0 + wh - h], [x + w, wy0 + wh]], mixHex('#1c2c48', '#2a3a58', r()), { amp: .5, seed: x | 0 });
        roughPoly(bx, [[x - 2, wy0 + wh - h + 2], [x + w / 2, wy0 + wh - h - 28], [x + w + 2, wy0 + wh - h + 2], [x + w / 2, wy0 + wh - h - 20]], '#c9d8e6', { amp: .4, seed: x | 1 });
        if (r() < .5) { bx.fillStyle = '#ffc679'; bx.fillRect(x + w * .3, wy0 + wh - h * .6, 6, 8); } x += w + 4; }
      roughPoly(bx, [[wx0, wy0 + wh - 24], [wx0 + ww, wy0 + wh - 30], [wx0 + ww, wy0 + wh], [wx0, wy0 + wh]], '#c9d8e6', { amp: 1, seed: 10 });
      // frost: stippled white creeping in from the edges
      const [fc, fg] = layer(); fg.fillStyle = '#e8f2fb'; fg.fillRect(wx0, wy0, ww, wh); maskRadial(fc, wx0 + ww / 2, wy0 + wh / 2, ww * .2, ww * .75, [[0, 0], [.55, .1], [1, .95]], wh / ww); stipple(fc, { k: .9, seed: 11, boost: 1.8 }); put(bx, fc, { a: .85 });
      bx.restore();
      bx.fillStyle = '#1a0f0a'; bx.fillRect(wx0 + ww / 2 - 4, wy0, 8, wh); bx.fillRect(wx0, wy0 + wh / 2 - 4, ww, 8);
      roughRect(bx, wx0 - 30, wy0 + wh + 16, ww + 60, 14, '#4a2a18', { amp: .6, seed: 12 }); }
    // tool board on the back wall (left of the window): saws, chisels, a square, clamps, hand planes
    { const r = prng(13); roughRect(bx, 230, 170, 820, 330, '#2e1c14', { amp: 1, seed: 14 }); for (let i = 0; i < 9; i++) for (let j = 0; j < 30; j++) { bx.fillStyle = rgba('#120a08', .5); bx.fillRect(250 + j * 27, 190 + i * 35, 3, 3); }
      const tool = (x, y, kind) => { bx.fillStyle = '#140c0a';
        if (kind === 0) { roughPoly(bx, [[x, y], [x + 30, y], [x + 26, y + 150], [x + 4, y + 150]], '#5a5a62', { amp: .4, seed: x }); roughRect(bx, x - 2, y - 30, 34, 34, '#5a2a14', { amp: .4, seed: x + 1 }); }
        else if (kind === 1) { roughRect(bx, x, y, 8, 70, '#6a3a1c', { amp: .3, seed: x }); roughRect(bx, x + 1, y + 70, 6, 50, '#8a8a90', { amp: .2, seed: x + 2 }); }
        else if (kind === 2) { roughRect(bx, x, y, 12, 120, '#3a3a40', { amp: .3, seed: x }); roughRect(bx, x, y, 80, 12, '#3a3a40', { amp: .3, seed: x + 3 }); }
        else { roughPoly(bx, [[x, y + 30], [x + 70, y + 26], [x + 74, y + 50], [x - 2, y + 54]], '#5a2a14', { amp: .4, seed: x }); roughPoly(bx, [[x + 40, y + 6], [x + 56, y + 6], [x + 56, y + 28], [x + 40, y + 28]], '#3a2010', { amp: .3, seed: x + 4 }); } };
      [[280, 230, 0], [350, 220, 1], [380, 220, 1], [410, 220, 1], [440, 220, 1], [500, 230, 2], [640, 240, 3], [640, 330, 3], [780, 230, 0], [860, 220, 1], [890, 220, 1], [940, 260, 2]].forEach(([x, y, k]) => tool(x, y, k)); }
    // shelf with jars of screws, a radio, rolled plans
    roughRect(bx, 1080, 520, 420, 10, '#4a2a18', { amp: .6, seed: 15 });
    { const r = prng(16); for (let i = 0; i < 7; i++) roughRect(bx, 1100 + i * 52, 470 + r() * 10, 30, 50 - r() * 10, mixHex('#3a2a20', '#6a4a30', r()), { amp: .4, seed: i + 20 }); }
    // the lamp cone onto the bench: the hero light (amber), soft stipple falloff
    cone(bx, WS.lamp[0], WS.lamp[1] + 30, { spread: .55, len: 760, col: '#ffbe6e', a: .38, k: .7, seed: 17, soft: .5 });
    bloom2(bx, WS.lamp[0], WS.lamp[1] + 30, 520, { col: '#ffb35c', core: '#ffe3b0', a: .4, k: .45, seed: 18 });
    // shadows in the corners: hatched
    { bx.save(); bx.beginPath(); bx.rect(0, 0, 260, H); bx.clip(); hatch(bx, [0, 0, 260, H], { angle: -.7, gap: 6, col: '#05040a', a: .35, seed: 19 }); bx.restore(); }

    // the bench (front layer): top in perspective, front apron, legs; a long board on top; shavings pile
    const [bench, bc] = layer();
    // bench top: back edge just below the planer's hip, front edge toward the lens; board along the middle
    const top = [[380, 690], [1460, 668], [1500, 712], [350, 736]], front = [[350, 736], [1500, 712], [1500, 950], [350, 968]];
    roughPoly(bc, top, '#b9824a', { amp: 1, seed: 21 });
    { bc.save(); bc.beginPath(); roughPath(bc, top, { amp: 1, seed: 21 }); bc.clip(); const g = bc.createRadialGradient(WS.lamp[0], 680, 0, WS.lamp[0], 680, 800); g.addColorStop(0, rgba('#ffd59a', .6)); g.addColorStop(1, rgba('#3a1a0a', .55)); bc.fillStyle = g; bc.fillRect(0, 600, W, 300);
      strokes(bc, 24, (i, q) => [mix(350, 1500, q), mix(692 + i * 1.8, 670 + i * 1.7, q)], { col: '#7a4a24', a: .35, seed: 22 }); bc.restore(); }
    roughPoly(bc, front, '#5a3218', { amp: 1, seed: 23 });
    { bc.save(); bc.beginPath(); roughPath(bc, front, { amp: 1, seed: 23 }); bc.clip(); hatch(bc, [350, 700, 1160, 230], { angle: -.6, gap: 6, col: '#1a0c06', a: .45, seed: 24 }); bc.fillStyle = rgba('#000000', .25); bc.fillRect(350, 790, 1160, 8); bc.restore(); }
    for (const [x, y] of [[372, 964], [1480, 948]]) { roughRect(bc, x - 22, y - 6, 44, 1030 - y, '#3a2010', { amp: .5, seed: x }); }
    // the board being planed (light wood, its edge darker)
    roughPoly(bc, [[440, 700], [1400, 682], [1402, 694], [442, 712]], '#e8b878', { amp: .5, seed: 25 });
    roughPoly(bc, [[442, 712], [1402, 694], [1402, 703], [442, 722]], '#9a6230', { amp: .4, seed: 26 });
    // shavings pile on the floor
    { const r = prng(27); for (let i = 0; i < 70; i++) { const x = 1100 + r() * 500, y = 960 + r() * 90; bc.strokeStyle = rgba(mixHex('#e8b878', '#c98a4a', r()), .9); bc.lineWidth = 2; bc.beginPath(); bc.arc(x, y, 5 + r() * 9, r() * 6, r() * 6 + 3.5); bc.stroke(); } }
    // the lamp itself (dark shade, hot rim)
    const [lampL, lx] = layer();
    lx.strokeStyle = '#120a08'; lx.lineWidth = 3; lx.beginPath(); lx.moveTo(WS.lamp[0], -10); lx.lineTo(WS.lamp[0], WS.lamp[1]); lx.stroke();
    lx.fillStyle = '#1c120c'; lx.beginPath(); lx.moveTo(WS.lamp[0] - 70, WS.lamp[1] + 40); lx.quadraticCurveTo(WS.lamp[0], WS.lamp[1] - 30, WS.lamp[0] + 70, WS.lamp[1] + 40); lx.closePath(); lx.fill();
    lx.fillStyle = '#ffe9c0'; lx.beginPath(); lx.ellipse(WS.lamp[0], WS.lamp[1] + 40, 66, 9, 0, 0, 7); lx.fill();
    return { back, bench, lampL };
  });
}
function strokes(ctx, n, f, { w = 1, col = '#000', a = .3, seed = 1, steps = 40 } = {}) {
  const r = prng(seed); ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w;
  for (let i = 0; i < n; i++) { ctx.globalAlpha = a * (.5 + .5 * r()); ctx.beginPath(); for (let k = 0; k <= steps; k++) { const [x, y] = f(i, k / steps); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
  ctx.restore();
}

// =====================================================================================================
// 3.28 [G2] · The lottery graphic (look of ref/kunst/g1.mjs): the golden ticket hangs over a dawn road like
// a sun; winners walk to work. Seen through the frosted workshop pane (frost layer is closest to the lens).
export const LT = { T: { x: 470, y: 250, w: 560, h: 270, rot: -.12 }, GOLD: '#ffc15e', HOT: '#ffe2a8' };
export const road = (q, side) => { const a = [140 + side * 420, H + 20], c = [760 + side * 120, 820], b = [900 + side * 14, 702]; return [(1 - q) ** 2 * a[0] + 2 * (1 - q) * q * c[0] + q * q * b[0], (1 - q) ** 2 * a[1] + 2 * (1 - q) * q * c[1] + q * q * b[1]]; };
export function lotteryPlates() {
  return once('lt', () => {
    const { T, GOLD, HOT } = LT;
    const [far, ctx] = layer();
    { const g = ctx.createLinearGradient(0, 0, 0, 700); g.addColorStop(0, '#070b22'); g.addColorStop(.5, '#16204a'); g.addColorStop(.85, '#2f4f6e'); g.addColorStop(1, '#5d7d86'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    { const rr = prng(2); for (let i = 0; i < 200; i++) { const x = rr() * W, y = Math.pow(rr(), 1.6) * 420, m = rr(); ctx.fillStyle = rgba('#dfe8ff', (.12 + .5 * m * m)); ctx.fillRect(x, y, m > .95 ? 2 : 1, m > .95 ? 2 : 1); } }
    const hz = 640;
    roughPoly(ctx, [[-10, hz], [180, 600], [420, 625], [640, 585], [900, 615], [1150, 595], [1400, 620], [1650, 598], [1930, 615], [1930, hz], [-10, hz]], '#22374f', { amp: 3, step: 12, seed: 1 });
    { const g = ctx.createLinearGradient(0, hz, 0, 760); g.addColorStop(0, '#5f8088'); g.addColorStop(1, '#2a3f55'); ctx.fillStyle = g; ctx.fillRect(0, hz, W, 120); }
    { const r = prng(9); let x = 640; while (x < 1180) { const w = 34 + r() * 46, h = 40 + r() * 70; house(ctx, r, x + w / 2, 700, w, h, { wall: mixHex('#1a2340', '#24304e', r()), lit: (a, b, q) => q() < .55 ? .85 : 0, amp: .6, floorH: 20, colW: 18, trim: false, chimney: .6 }); x += w + r() * 6; } }
    fog(ctx, { y0: 590, y1: 740, col: '#8fa9b5', a: .45, seed: 3, cover: .7, soft: .4, k: .25, sx: .004, sy: .03 });
    cone(ctx, T.x + 40, T.y + 120, { dir: .18, spread: .42, len: 900, col: GOLD, a: .3, k: .55, seed: 4, soft: .5 });
    bloom2(ctx, T.x, T.y, 760, { col: GOLD, core: HOT, a: .5, k: .35, seed: 5 });
    for (const [d, sp] of [[.05, .05], [.32, .04], [-.2, .03], [.6, .03]]) cone(ctx, T.x, T.y + 60, { dir: d, spread: sp, len: 1000, col: GOLD, a: .12, k: .4, seed: Math.round(d * 100) + 50, soft: .7 });
    // the ticket on its own layer (it floats a little)
    const [tk, kx] = layer(760, 520);
    kx.translate(380, 260); kx.rotate(T.rot);
    { const pts = []; const hw = T.w / 2, hh = T.h / 2;
      pts.push([-hw, -hh]); for (let x = -hw; x <= hw; x += 20) pts.push([x, -hh], [x + 10, -hh + 6]); pts.push([hw, -hh], [hw, hh]);
      for (let x = hw; x >= -hw; x -= 20) pts.push([x, hh], [x - 10, hh - 6]); pts.push([-hw, hh]);
      kx.save(); kx.filter = 'blur(14px)'; roughPoly(kx, pts, rgba(HOT, .8), { amp: 1, seed: 6 }); kx.restore();
      roughPoly(kx, pts, '#f6b850', { amp: 1, seed: 6 });
      kx.save(); kx.beginPath(); roughPath(kx, pts, { amp: 1, seed: 6 }); kx.clip();
      const g = kx.createLinearGradient(-hw, -hh, hw, hh); g.addColorStop(0, rgba('#fff3cf', .55)); g.addColorStop(.6, rgba('#ffc15e', 0)); g.addColorStop(1, rgba('#b8641e', .45)); kx.fillStyle = g; kx.fillRect(-hw, -hh, T.w, T.h);
      hatch(kx, [-hw, -hh, T.w, T.h], { angle: .7, gap: 6, w: 1, col: '#a0581c', a: .22, seed: 7, broken: .4 });
      kx.restore();
      kx.setLineDash([3, 6]); kx.strokeStyle = rgba('#7a3a12', .7); kx.lineWidth = 2; kx.beginPath(); kx.moveTo(-hw + 120, -hh + 16); kx.lineTo(-hw + 120, hh - 16); kx.stroke(); kx.setLineDash([]);
      text(kx, 'LOTTERI', -hw + 22, -hh + 56, { size: 20, weight: 600, color: '#6a2e0e', spacing: 2 });
      for (let k = 0; k < 4; k++) roughRect(kx, -hw + 26, -hh + 82 + k * 22, 70 - k * 12, 5, rgba('#6a2e0e', .55), { amp: .4, seed: k });
      const r = prng(11), picked = new Set([3, 9, 14, 20, 26, 31]);
      for (let i = 0; i < 35; i++) { const cx = -hw + 180 + (i % 7) * 50, cy = -hh + 50 + Math.floor(i / 7) * 42; kx.strokeStyle = rgba('#6a2e0e', .5); kx.lineWidth = 1.5; kx.beginPath(); kx.arc(cx, cy, 15, 0, 7); kx.stroke(); text(kx, String(i + 1), cx, cy + 6, { size: 15, weight: 600, color: '#6a2e0e', align: 'center', alpha: .7 });
        if (picked.has(i)) { kx.strokeStyle = '#2a1a5a'; kx.lineWidth = 3; kx.beginPath(); kx.ellipse(cx + 1, cy, 19 + r() * 2, 17, r() * .4, 0, 6.5); kx.stroke(); } } }
    // road + lake shore + jetty with the one who stopped (fishing)
    const [near, nx] = layer();
    roughPoly(nx, [[-10, 742], [W + 10, 736], [W + 10, H + 10], [-10, H + 10]], '#121a33', { amp: 2, seed: 12 });
    { const g = nx.createLinearGradient(0, 720, 0, H); g.addColorStop(0, '#2a3a52'); g.addColorStop(1, '#0c1226'); nx.save(); nx.beginPath(); roughPath(nx, [[-10, 740], [W + 10, 720], [W + 10, H + 10], [-10, H + 10]], { amp: 2, seed: 12 }); nx.clip(); nx.fillStyle = g; nx.fillRect(0, 700, W, 400);
      hatch(nx, [0, 720, 1300, 360], { angle: -.04, gap: 7, w: 1, col: '#6f86a8', a: .18, seed: 13, broken: .5 }); nx.restore(); }
    const L = [], R = []; for (let i = 0; i <= 30; i++) { L.push(road(i / 30, -1)); R.push(road(i / 30, 1)); }
    roughPoly(nx, [...L, ...R.reverse()], '#8a7a62', { amp: 2, seed: 14 });
    { nx.save(); nx.beginPath(); roughPath(nx, [...L, ...[...R].reverse()], { amp: 2, seed: 14 }); nx.clip(); const g = nx.createLinearGradient(0, 1080, 0, 700); g.addColorStop(0, rgba('#0c1226', .55)); g.addColorStop(1, rgba('#0c1226', 0)); nx.fillStyle = g; nx.fillRect(0, 680, W, 400); nx.restore(); }
    pool2(nx, 760, 860, 520, 120, { col: GOLD, a: .38, k: .55, seed: 15, rot: -.15 });
    { const jx = 150, jy = 706; roughRect(nx, jx - 70, jy, 170, 8, '#0b1026', { amp: .6, seed: 1 }); for (const px of [-60, 0, 60]) roughRect(nx, jx + px, jy + 6, 5, 22, '#0b1026', { amp: .4, seed: px + 9 });
      const sx = jx + 70, s2 = .42, P = { lean: .12, head: .15, sh: [1.1, .9], el: [.6, .7], hip: [1.5, 1.5], kn: [1.45, 1.4], hair: 'cap' };
      const f = person(nx, sx, jy - 4, s2, P, { dress: { coat: '#3a5070', pants: '#20283a', skin: '#e0b48e', hair: '#2a1a14', hairBack: '#3a2a20' }, light: { x: T.x, y: T.y, col: HOT, a: .45 }, rim: HOT, rimSide: 1, rimW: 1.2 });
      const [hx, hy] = f.hand(0); roughLine(nx, [[hx - 4, hy + 4], [hx + 90, hy - 50]], { w: 2, col: '#0b1026', seed: 4 }); nx.strokeStyle = rgba('#d6d1ea', .5); nx.lineWidth = 1; nx.beginPath(); nx.moveTo(hx + 90, hy - 50); nx.quadraticCurveTo(hx + 110, hy - 10, hx + 112, jy + 18); nx.stroke(); }
    // frost on the pane: white stipple creeping in from the frame edges + a few fern strokes in the corners
    const [frost, fx] = layer();
    { fx.fillStyle = '#eaf2fb'; fx.fillRect(0, 0, W, H); maskRadial(frost, W / 2, H / 2, H * .35, W * .62, [[0, 0], [.5, .05], [.8, .4], [1, .95]], H / W * 1.15); stipple(frost, { k: .95, seed: 31, boost: 1.6 }); }
    { const r = prng(32); fx.strokeStyle = rgba('#f2f7fc', .5); fx.lineWidth = 1.2;
      for (let i = 0; i < 60; i++) { const corner = i % 4, cx = corner % 2 ? W : 0, cy = corner > 1 ? H : 0, ang = Math.atan2(H / 2 - cy, W / 2 - cx) + (r() - .5) * 1.2, L0 = 60 + r() * 220; let x = cx + (r() - .5) * 300, y = cy + (r() - .5) * 200;
        fx.beginPath(); fx.moveTo(x, y); for (let k = 0; k < 8; k++) { const a = ang + (r() - .5) * .6; x += Math.cos(a) * L0 / 8; y += Math.sin(a) * L0 / 8; fx.lineTo(x, y); const s = (r() < .5 ? 1 : -1) * .9; fx.moveTo(x, y); fx.lineTo(x + Math.cos(a + s) * 12, y + Math.sin(a + s) * 12); fx.moveTo(x, y); } fx.stroke(); } }
    return { far, tk, near, frost };
  });
}
