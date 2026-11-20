// s01_end · 1.07 two paper strips in the wind ("Those sound alike. / They're not."), 1.08 the cold office
// ("One of them scares almost everyone."), 1.09 the bay at first light ("The other could change what a human life is for.")
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, layer, roughPath, roughPoly, roughRect, roughLine, sagLine, hatch, fog, bloom, pool, vnoise, fbm, printFinish, stratus, person } from './art.mjs';
import { lin, sm, eio, eout, ein, drift, text } from '../engine.mjs';
import { memo, spot, fig, ribbon, bird, keys } from './s01_kit.mjs';

const HOT = '#fff1d6', AMB = '#ffb35c', GOLD = '#ffc477', ROSE = '#e8a3a0';

// ================================================================ 1.07 strips
const stripBg = () => memo('e.strip.bg', () => {
  const [c, g] = layer(W + 200, H + 120), r = prng(5), n = vnoise(6);
  { const gr = g.createLinearGradient(0, 0, 0, 760); gr.addColorStop(0, '#2c2c6a'); gr.addColorStop(.45, '#8a6a9a'); gr.addColorStop(.75, '#e9a08a'); gr.addColorStop(1, '#ffd2a0'); g.fillStyle = gr; g.fillRect(0, 0, W + 200, 780); }
  bloom(g, 1500, 740, 640, { col: '#ffb070', core: '#fff1cf', a: .6, k: .35, seed: 3, sy: .6, op: 'screen' });
  g.save(); g.beginPath(); for (const [y, x0, x1, th] of [[300, 600, 2100, 22], [380, 1000, 2100, 12], [220, -100, 700, 16], [470, 200, 1100, 8]]) stratus(g, y, x0, x1, th, y);
  g.fillStyle = rgba('#e88a78', .45); g.fill(); g.clip(); hatch(g, [0, 180, W + 200, 320], { angle: -.015, gap: 4, w: 1.1, col: '#ffd9a4', a: .5, seed: 5, broken: .3 }); g.restore();
  // far hills, then the wheat field rising to the bottom
  { const pts = [[0, 800]]; for (let x = 0; x <= W + 200; x += 8) pts.push([x, 735 - 50 * fbm(n, x * .003, 2, 4)]); pts.push([W + 200, 800]); roughPoly(g, pts, '#a07890', { amp: 1, seed: 2 }); }
  fog(g, { y0: 660, y1: 800, col: '#ffd0b0', a: .45, seed: 7, cover: .7, soft: .5, k: .3, sx: .002, sy: .03, x1: W + 200 });
  const field = (x) => 770 + 30 * fbm(n, x * .002, 5, 3);
  { const pts = [[0, H + 120]]; for (let x = 0; x <= W + 200; x += 8) pts.push([x, field(x)]); pts.push([W + 200, H + 120]); roughPoly(g, pts, '#b8823e', { amp: 1.5, seed: 4 });
    g.save(); g.beginPath(); roughPath(g, pts, { amp: 1.5, seed: 4 }); g.clip();
    const gr = g.createLinearGradient(0, 760, 0, H + 120); gr.addColorStop(0, rgba('#ffd9a0', .35)); gr.addColorStop(.3, rgba('#c08040', 0)); gr.addColorStop(1, rgba('#3a2030', .7)); g.fillStyle = gr; g.fillRect(0, 700, W + 200, 500);
    for (let i = 0; i < 9000; i++) { const x = r() * (W + 200), y0 = field(x), y = y0 + Math.pow(r(), 1.6) * (H + 120 - y0), d = (y - y0) / (H + 120 - y0), l = 4 + r() * 14 * (1 + d * 3);
      g.strokeStyle = r() < .55 - d * .4 ? '#ffe0a0' : '#8a5a2a'; g.globalAlpha = (.2 + .5 * r()) * (1 - d * .4); g.lineWidth = 1 + d; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - .2) * 6, y - l); g.stroke(); }
    g.globalAlpha = 1; g.restore(); }
  return c;
});
function stripCanvas(label, grey) {
  return memo('e.strip.' + label + (grey ? 'g' : ''), () => {
    const [c, g] = layer(1240, 132), r = prng(label.length);
    g.fillStyle = grey ? '#8e8c9c' : '#f6ecd8'; g.beginPath(); roughPath(g, [[0, 0], [1240, 0], [1240, 132], [0, 132]], { amp: 2, seed: label.length }); g.fill();
    g.save(); g.clip(); for (let i = 0; i < 500; i++) { g.strokeStyle = rgba('#b8a080', .15); g.lineWidth = 1; const x = r() * 1240, y = r() * 132; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 6 + r() * 20, y + (r() - .5) * 3); g.stroke(); }
    g.fillStyle = rgba('#c9b28a', .3); g.fillRect(0, 0, 18, 132); g.restore();
    g.fillStyle = '#2a1e2e'; g.font = '62px "Instrument Serif Italic"'; g.textBaseline = 'middle'; g.fillText(label, 60, 70);
    return c;
  });
}
export function drawStrips(T) {
  const S = (p, n) => T.S('01b', p, n);
  const t0 = S('Those') - .14, tAlike = S('alike'), tNot = S('not'), tOne = S('One');
  const A = (q) => sagLine([250, 330], [1690, 450], 46, 60)[Math.round(q * 60)];
  const s1 = () => stripCanvas('the end of work'), s1g = () => stripCanvas('the end of work', true), s2 = () => stripCanvas('the end of having to work');
  return (ctx, t) => {
    const push = 1 + .1 * sm(lin(t0, tNot, t)) + .05 * sm(lin(tNot, tOne, t)), shake = t > tNot ? Math.exp(-(t - tNot) * 18) * 10 : 0;
    ctx.save(); ctx.translate(960 + shake * Math.sin(t * 90), 470 + shake * Math.cos(t * 77)); ctx.scale(push, push); ctx.translate(-960 - drift(t, 8, 1), -470 - drift(t, 4, 2));
    ctx.drawImage(stripBg(), -100, -60);
    // wind lines (the gust carried over from the wheat)
    ctx.save(); ctx.globalCompositeOperation = 'screen'; for (let k = 0; k < 9; k++) { const x = ((t - t0) * 900 + k * 260) % 2400 - 300, y = 160 + k * 70; const g = ctx.createLinearGradient(x - 260, 0, x, 0); g.addColorStop(0, rgba('#fff3dc', 0)); g.addColorStop(1, rgba('#fff3dc', .22)); ctx.strokeStyle = g; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x - 260, y); ctx.quadraticCurveTo(x - 130, y - 8, x, y + 2); ctx.stroke(); } ctx.restore();
    // posts + line
    roughLine(ctx, [[250, 1150], [252, 316]], { w: 22, col: '#2a1a28', seed: 1 }); roughLine(ctx, [[1690, 960], [1690, 440]], { w: 11, col: '#3a2434', seed: 2 });
    const lineY = (q) => A(q)[1] + Math.sin(t * 5 + q * 7) * 3 * Math.sin(Math.PI * q);
    ctx.strokeStyle = '#2a1a28'; ctx.lineWidth = 2; ctx.beginPath(); for (let k = 0; k <= 60; k++) { const q = k / 60, p = A(q); k ? ctx.lineTo(p[0], lineY(q)) : ctx.moveTo(p[0], lineY(q)); } ctx.stroke();
    // the two strips: same wind, same flutter (in sync); on "not" they tear loose and go opposite ways
    const flut = (ph) => (q) => { const w = 6.5 * q - 8 * t + ph; return [44 * q * Math.sin(w) + 10 * q * Math.sin(2.3 * w), .95 * q * Math.cos(w)]; };
    const sync = 1 + .3 * Math.exp(-Math.abs(t - tAlike) * 4);
    const rel = Math.max(0, t - tNot);
    for (const [k, q0, len, hgt] of [[0, .28, 640, 66], [1, .5, 600, 60]]) {
      const P = A(q0), up = k === 1;
      const ax = P[0] + (up ? 420 * rel + 300 * rel * rel : -260 * rel), ay = lineY(q0) + (up ? -260 * rel - 220 * rel * rel : 420 * rel * rel + 80 * rel);
      const fold = sm(lin(tNot + .32, tNot + .62, t)), L = len * (1 - .85 * fold), Hh = hgt * (1 - .5 * fold);
      if (fold < 1) {
        ctx.fillStyle = '#2a1a28'; ctx.fillRect(ax - 4, ay - hgt * .5 - 6, 8, 16);   // the peg
        const wv = (q) => { const [dy, tw] = flut(0)(q); return [dy * sync * (1 + rel * 2), tw + rel * (up ? -2 : 3) * q]; };
        ribbon(ctx, k ? s2() : s1(), ax, ay + Hh * .5 + 4, L, Hh, wv, { alpha: 1 - fold, droop: up ? -40 * rel : 160 * rel });
        if (!up && rel > 0) ribbon(ctx, s1g(), ax, ay + Hh * .5 + 4, L, Hh, wv, { alpha: (1 - fold) * sm(lin(0, .3, rel)), droop: 160 * rel });
      }
      if (fold > 0) { const bx = ax + L * .4, by = ay + 30; if (up) { spot(ctx, bx, by, 120, .5 * fold, AMB, HOT); bird(ctx, bx, by, 1.4 * fold + .3, t, { dir: 1, a: fold, rot: -.3 }); } else bird(ctx, bx, by, 1.3 * fold + .3, t, { dir: -1, col: '#9a98aa', dark: '#5a5870', a: fold, rot: .3 }); }
    }
    // front wheat sways in the wind
    const r = prng(9); ctx.lineCap = 'round';
    for (let i = 0; i < 160; i++) { const x = r() * (W + 100) - 50, y = 1000 + r() * 120, l = 60 + r() * 70, b = .25 + .12 * Math.sin(t * 2.4 + x * .01); ctx.strokeStyle = r() < .5 ? '#ffd890' : '#a06a30'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x, y - l * .5, x + Math.sin(b) * l, y - Math.cos(b) * l); ctx.stroke(); ctx.fillStyle = '#ffe0a0'; ctx.beginPath(); ctx.ellipse(x + Math.sin(b) * l, y - Math.cos(b) * l, 3, 9, b, 0, 7); ctx.fill(); }
    ctx.restore();
    printFinish(ctx, { grain: .08, vig: .38, vigCol: '#2a1020' });
  };
}

// ================================================================ 1.08 the cold office
const OVP = [760, 500], OF = 760;
const PR = (X, Y, Z) => [OVP[0] + X * OF / Z, OVP[1] - Y * OF / Z];
const OW = W + 520;
const office = () => memo('e.office', () => {
  const [c, g] = layer(OW, H), r = prng(21);
  const quad = (pts, col) => { g.fillStyle = col; g.beginPath(); roughPath(g, pts, { amp: .6, seed: (pts[0][0] | 0) + 3 }); g.fill(); };
  const Z0 = .9, Z1 = 30, FL = -1.5, CE = 1.6, XL = -5.2, XR = 4.2;
  // room shell
  quad([PR(XL, CE, Z0), PR(XR, CE, Z0), PR(XR, CE, Z1), PR(XL, CE, Z1)], '#121828');
  quad([PR(XL, FL, Z0), PR(XR, FL, Z0), PR(XR, FL, Z1), PR(XL, FL, Z1)], '#0d1220');
  quad([PR(XL, CE, Z0), PR(XL, CE, Z1), PR(XL, FL, Z1), PR(XL, FL, Z0)], '#101625');
  quad([PR(XR, CE, Z0), PR(XR, CE, Z1), PR(XR, FL, Z1), PR(XR, FL, Z0)], '#161d30');
  quad([PR(XL, CE, Z1), PR(XR, CE, Z1), PR(XR, FL, Z1), PR(XL, FL, Z1)], '#1a2236');
  // ceiling panels (off), floor seams
  for (let z = 2; z < 28; z += 2.4) for (let x = -4.4; x < 3.6; x += 2) quad([PR(x, CE, z), PR(x + 1.2, CE, z), PR(x + 1.2, CE, z + 1.2), PR(x, CE, z + 1.2)], '#1c2438');
  g.strokeStyle = rgba('#2a3450', .5); g.lineWidth = 1; for (let x = -5; x < 4.2; x += .8) { g.beginPath(); g.moveTo(...PR(x, FL, Z0)); g.lineTo(...PR(x, FL, Z1)); g.stroke(); }
  // right wall windows: the night city in rain, cold
  for (let z = 1.6; z < 26; z += 2.6) {
    const q = [PR(XR, 1.2, z), PR(XR, 1.2, z + 2), PR(XR, -.7, z + 2), PR(XR, -.7, z)];
    const gr = g.createLinearGradient(0, q[0][1], 0, q[3][1]); gr.addColorStop(0, '#24304e'); gr.addColorStop(1, '#3a4a66'); g.fillStyle = gr; g.beginPath(); roughPath(g, q, { amp: .4, seed: z * 10 | 0 }); g.fill();
    g.save(); g.clip(); for (let k = 0; k < 40; k++) { const u = r(), v = r(), x = mix(q[0][0], q[1][0], u), y = mix(mix(q[0][1], q[1][1], u), mix(q[3][1], q[2][1], u), .3 + v * .7); g.fillStyle = rgba(r() < .85 ? '#c8d8f0' : '#8fe6ff', .2 + .4 * r()); g.fillRect(x, y, 2 * OF / z / 60 + .5, 2 * OF / z / 60 + .5); } g.restore();
    // cold window light on the floor
    g.save(); g.globalCompositeOperation = 'screen'; quad([PR(XR, FL, z), PR(XR, FL, z + 2), PR(XR - 2.6, FL, z + 2.6), PR(XR - 2.6, FL, z + .3)], rgba('#3a4a70', .35)); g.restore();
  }
  // desks, far to near: top, front panel, dark monitor, chair
  const desks = []; for (let z = 22; z >= 2.4; z -= 2.2) for (const x of [-4, -2.3, -.6, 1.1]) desks.push([x, z]);
  for (const [x, z] of desks) {
    const top = -.72, d = .8, w = 1.4;
    quad([PR(x, top, z + d), PR(x + w, top, z + d), PR(x + w, top, z), PR(x, top, z)], '#2a3348');
    quad([PR(x, top, z), PR(x + w, top, z), PR(x + w, FL, z), PR(x, FL, z)], '#151b2c');
    quad([PR(x + .4, top + .55, z + .65), PR(x + 1.0, top + .55, z + .65), PR(x + 1.0, top, z + .65), PR(x + .4, top, z + .65)], '#0a0e1a');
    const [cx, cy] = PR(x + .7, -.9, z - .45), s = OF / z; g.fillStyle = '#080b16'; g.beginPath(); g.ellipse(cx, cy, .28 * s, .34 * s, 0, 0, 7); g.fill(); g.fillRect(cx - .05 * s, cy, .1 * s, .5 * s);
    g.strokeStyle = rgba('#5a6a90', .35); g.lineWidth = Math.max(.6, s / 300); g.beginPath(); g.moveTo(...PR(x, top, z)); g.lineTo(...PR(x + w, top, z)); g.stroke();
  }
  hatch(g, [0, 0, 700, H], { angle: .8, gap: 7, w: 1, col: '#03050c', a: .35, seed: 4, broken: .4 });
  return c;
});
export function drawOffice(T) {
  const S = (p, n) => T.S('01b', p, n);
  const t0 = S('One') - .1, tScares = S('scares'), tEv = S('everyone'), tOther = S('The other');
  return (ctx, t) => {
    const pan = mix(0, 470, eio(lin(tEv - .3, tOther + .1, t))) + drift(t, 6, 1), zoom = 1 + .04 * lin(t0, tOther, t);
    ctx.save(); ctx.translate(960, 540); ctx.scale(zoom, zoom); ctx.translate(-960 - pan, -540 + drift(t, 3, 2));
    ctx.drawImage(office(), 0, 0);
    // one ceiling panel flickers cold; one far monitor still glows
    { const [x0, y0] = PR(-.4, 1.6, 7.2), [x1, y1] = PR(.8, 1.6, 8.4), f = (Math.sin(t * 23) > .6 || Math.sin(t * 7.3) > .9) ? .9 : .25; ctx.fillStyle = rgba('#c8e0f0', f * .6); ctx.fillRect(x0, y0, x1 - x0, y1 - y0); spot(ctx, (x0 + x1) / 2, y1 + 10, 180, f * .25, '#8fb8e0', '#e0f0ff'); }
    { const [mx, my] = PR(-2.3 + .7, -.45, 13.2 + .65); spot(ctx, mx, my, 60, .5, '#8fe6ff', '#d8f7ff'); ctx.fillStyle = rgba('#8fe6ff', .8); ctx.fillRect(mx - 16, my - 10, 32, 20); }
    // rain on the window glass
    { const r = prng(Math.floor(t * 12)); ctx.strokeStyle = rgba('#c8d8f0', .18); ctx.lineWidth = 1; for (let k = 0; k < 70; k++) { const z = 1.6 + r() * 24, [x, y] = PR(4.2, -.7 + r() * 1.9, z), l = 14 * 760 / z / 100; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - l * .1, y + l); ctx.stroke(); } }
    // the lone figure at the window, holding a box: shoulders down
    { const z = 5.2, s = (OF / z) * 1.7 / 185, [fx, fy] = PR(3.3, -1.5, z), hip = fy - 88 * s, b = Math.sin(t * 1.1) * .015;
      ctx.fillStyle = rgba('#05070f', .5); ctx.beginPath(); ctx.ellipse(fx - 30 * s, fy, 60 * s, 8 * s, 0, 0, 7); ctx.fill();
      const f = fig(ctx, fx, hip, s, { lean: .1 + b, head: .42, sh: [.75, .7], el: [.85, .8], hip: [.03, -.03], kn: [0, 0], hair: 'short' }, { key: 'officeMan', dress: { coat: '#4a5068', pants: '#1a1e2a', skin: '#c9a888', hair: '#2a2a30' }, light: { x: fx + 400, y: hip - 200 }, rim: '#a8c8e8', rimW: 2, shadeA: .35, shadeCol: '#0a0e1c' });
      const [hx, hy] = f.hand(0); roughRect(ctx, hx - 34 * s, hy - 30 * s, 52 * s, 36 * s, '#8a7a62', { amp: .5, seed: 3 }); ctx.fillStyle = rgba('#000', .25); ctx.fillRect(hx - 34 * s, hy - 30 * s, 52 * s, 6 * s);
      // a plant and a mug stick out of the box
      ctx.fillStyle = '#3a5a4a'; ctx.beginPath(); ctx.ellipse(hx - 14 * s, hy - 36 * s, 8 * s, 10 * s, 0, 0, 7); ctx.fill(); }
    // the grey paper bird flies in and lands on an empty desk
    { const u = lin(t0 - .3, tEv + .2, t), e = eio(u), [lx, ly] = PR(-.1, -.72, 6.5);
      const x = mix(2100, lx, e) + Math.sin(u * 6) * 80 * (1 - e), y = mix(260, ly - 6, e) - Math.sin(u * Math.PI) * 60, s = mix(2.2, .55, e);
      spot(ctx, x, y, 50 * s, .25, '#8fb8e0', '#e0f0ff'); bird(ctx, x, y, s, t, { dir: -1, col: '#c4c2d4', dark: '#7a7890', flap: u < .95 ? 1 : 0.02, rot: .1 }); }
    // through the far window: the warm bird passes the other way
    { const u = lin(tEv - .1, tOther + .4, t); if (u > 0 && u < 1) { const x = mix(1500, 2350, u), y = 420 - Math.sin(u * 3) * 30; spot(ctx, x, y, 90, .6, AMB, HOT); bird(ctx, x, y, .9, t, { dir: 1, rot: -.2 }); } }
    ctx.restore();
    printFinish(ctx, { grain: .08, vig: .5, vigCol: '#03050c' });
  };
}
export const OFFICE_WIN = [1500, 420];

// ================================================================ 1.09 the bay at first light
const HZB = 600;
const bay = () => memo('e.bay', () => {
  const [c, g] = layer(W + 240, H + 160), r = prng(31), n = vnoise(32);
  { const gr = g.createLinearGradient(0, 0, 0, HZB + 80); gr.addColorStop(0, '#24275e'); gr.addColorStop(.42, '#6a5288'); gr.addColorStop(.75, '#e2928a'); gr.addColorStop(1, '#ffd0a0'); g.fillStyle = gr; g.fillRect(0, 0, W + 240, HZB + 80); }
  for (let i = 0; i < 200; i++) { const m = r(); g.fillStyle = rgba('#e4ecff', (.05 + .4 * m * m)); g.fillRect(r() * (W + 240), Math.pow(r(), 2) * 260, 1, 1); }
  bloom(g, 1080, HZB, 700, { col: '#ffb070', core: '#fff1cf', a: .55, k: .35, seed: 3, sy: .45, op: 'screen' });
  g.save(); g.beginPath(); for (const [y, x0, x1, th] of [[420, 300, 1700, 16], [490, 800, 2100, 9], [330, -100, 900, 14], [540, 100, 900, 6]]) stratus(g, y, x0, x1, th, y);
  g.fillStyle = rgba('#e8907a', .5); g.fill(); g.clip(); hatch(g, [0, 280, W + 240, 300], { angle: -.012, gap: 4, w: 1.1, col: '#ffe0b0', a: .55, seed: 5, broken: .3 }); g.restore();
  // far coast: a low headland with the harbour town (left), hills (right)
  { const pts = [[-10, HZB + 2]]; for (let x = -10; x <= 760; x += 8) pts.push([x, HZB - 26 - 30 * fbm(n, x * .006, 1, 3) * (1 - x / 800)]); pts.push([770, HZB + 2]); roughPoly(g, pts, '#5a4a74', { amp: .8, seed: 2 });
    for (let i = 0; i < 40; i++) { const x = 40 + r() * 520, h = 6 + r() * 16, w = 6 + r() * 10; roughRect(g, x, HZB - 26 - h, w, h + 4, '#4a3c66', { amp: .3, seed: i }); if (r() < .5) { g.fillStyle = rgba('#ffe0a8', .8); g.fillRect(x + w * .3, HZB - 22 - h * .6, 1.5, 1.5); } } }
  { const pts = [[1500, HZB + 2]]; for (let x = 1500; x <= W + 250; x += 8) pts.push([x, HZB - 50 * fbm(n, x * .004, 4, 3) * Math.min(1, (x - 1500) / 300)]); pts.push([W + 250, HZB + 2]); roughPoly(g, pts, '#6a5480', { amp: .8, seed: 3 }); }
  fog(g, { y0: HZB - 50, y1: HZB + 30, col: '#ffc8b0', a: .4, seed: 33, cover: .6, soft: .5, k: .3, sx: .002, sy: .04, x1: W + 240 });
  // the sea: dark violet with hatched swell lines that catch the rose sky
  { const gr = g.createLinearGradient(0, HZB, 0, H + 160); gr.addColorStop(0, '#7a5a86'); gr.addColorStop(.15, '#3e3468'); gr.addColorStop(1, '#120f30'); g.fillStyle = gr; g.fillRect(0, HZB, W + 240, H + 160 - HZB);
    for (let i = 0; i < 2600; i++) { const v = Math.pow(r(), 1.8), y = HZB + 4 + v * (H + 150 - HZB), x = r() * (W + 240), l = 10 + v * 120 * r(); g.strokeStyle = r() < .4 ? rgba('#f0a8a0', .35 * (1 - v)) : rgba('#08071c', .4); g.lineWidth = .8 + v * 1.6; g.beginPath(); g.moveTo(x, y); g.lineTo(x + l, y + (r() - .5) * 1.5); g.stroke(); } }
  return c;
});
export function drawBay(T) {
  const S = (p, n) => T.S('01b', p, n);
  const t0 = S('The other') - .15, tFor = S('for'), tChange = S('change');
  return (ctx, t) => {
    const z = 1 + .07 * lin(t0, t0 + 4.5, t), ox = drift(t, 8, 1), oy = drift(t, 4, 2);
    ctx.save(); ctx.translate(960, HZB + 40); ctx.scale(z, z); ctx.translate(-960 + ox, -HZB - 40 + oy);
    ctx.drawImage(bay(), -120, -80);
    // the first rim of the sun on the horizon, centred
    const wide = eout(lin(tFor - .15, tFor + 1.2, t)), pre = sm(lin(t0, tFor, t));
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, HZB); ctx.clip(); ctx.fillStyle = '#fff3dc'; ctx.beginPath(); ctx.arc(960, HZB + 30 - 14 * pre - 14 * wide, 52, 0, 7); ctx.fill(); ctx.restore();
    spot(ctx, 960, HZB, 260 + 200 * wide, .55 + .3 * wide, GOLD, HOT, { sy: .5 });
    // the morning stripe on the water: a band of light along the horizon that widens on "for"
    const hgt = mix(5, 16, pre) + 150 * wide, half = mix(380, 560, pre) + 520 * wide;
    { const g = ctx.createRadialGradient(960, HZB + 8, 0, 960, HZB + 8, half); g.addColorStop(0, rgba('#ffe2b0', .85)); g.addColorStop(.5, rgba(GOLD, .35)); g.addColorStop(1, rgba(GOLD, 0)); ctx.save(); ctx.translate(0, HZB + 6); ctx.scale(1, hgt / half); ctx.translate(0, -(HZB + 6)); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g; ctx.fillRect(960 - half, HZB + 6 - half, half * 2, half * 2); ctx.restore(); }
    // glints in the stripe (shimmering hatch strokes)
    { const r = prng(7); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
      for (let i = 0; i < 360; i++) { const v = r(), u = (r() - .5) * 2, y = HZB + 4 + v * v * hgt * 1.2, x = 960 + u * half * (1 - v * .3), sh = .5 + .5 * Math.sin(t * (3 + r() * 4) + i), a = (1 - Math.abs(u)) * (1 - v) * sh; if (a < .05) continue; const l = 6 + (1 - Math.abs(u)) * 30 * (.4 + v); ctx.strokeStyle = rgba('#fff0c8', .8 * a); ctx.lineWidth = 1 + v * 1.5; ctx.beginPath(); ctx.moveTo(x - l / 2, y); ctx.lineTo(x + l / 2, y); ctx.stroke(); }
      ctx.restore(); }
    // near swell: slow moving lines (water never stands still)
    { const r = prng(8); ctx.lineCap = 'round'; for (let i = 0; i < 90; i++) { const y = 760 + Math.pow(r(), 1.3) * 380, x = ((r() * (W + 400) + t * (10 + r() * 14)) % (W + 400)) - 200, l = 40 + r() * 160; ctx.strokeStyle = r() < .45 ? rgba('#f0a8a0', .3) : rgba('#08071c', .5); ctx.lineWidth = 1.5 + (y - 760) / 200; ctx.beginPath(); ctx.moveTo(x, y + Math.sin(t + i) * 2); ctx.lineTo(x + l, y + Math.sin(t + i + 1) * 2); ctx.stroke(); } }
    // the bird flies out over the bay into the light
    { const u = lin(t0 - .3, tFor + .3, t), e = eio(u), x = mix(260, 960, e) + Math.sin(u * 4) * 40 * (1 - e), y = mix(760, HZB - 40, e) - Math.sin(u * Math.PI) * 110, s = mix(2.0, .22, Math.pow(e, .7)), a = 1 - sm(lin(.88, 1, u));
      spot(ctx, x, y, 80 * s, .35 * a, AMB, HOT); bird(ctx, x, y, s, t, { dir: 1, a, rot: -.15 }); }
    ctx.restore();
    printFinish(ctx, { grain: .08, vig: .4, vigCol: '#1a0f28' });
  };
}
