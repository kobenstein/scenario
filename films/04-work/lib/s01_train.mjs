// s01_train · shot 1.01 (night train on a viaduct, arches count the years) and 1.02 (the tail lantern hangs).
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, layer, put, stipple, maskLinear, roughPath, roughPoly, roughRect, hatch, fog, bloom, vnoise, fbm, printFinish } from './art.mjs';
import { lin, sm, eio, eout, ein, drift, text } from '../engine.mjs';
import { clipScreen } from './kit.mjs';
import { memo, spot, keys } from './s01_kit.mjs';

const HZ = 430, HOT = '#ffd9a0', AMB = '#ffb35c';
// viaduct in perspective: depth z (1 = near). Screen x, deck top, ground.
const X = (z) => 2000 - 2700 / z, DECK = (z) => HZ + 110 / z, BASE = (z) => HZ + 640 / z;
const Z = (i) => 1 + i * .2;                 // pier i
const ARCH0 = 3;                              // arch k (1..20) sits between piers ARCH0+k-1 and ARCH0+k
const PW = .03;                              // pier half width in z
const DECKH = 44;                             // deck/parapet band height (at z=1)
function archPoly(k) {
  const za = Z(ARCH0 + k - 1) + PW, zb = Z(ARCH0 + k) - PW, pts = [];
  const top = (z) => DECK(z) + DECKH / z + 26 / z;
  pts.push([X(za), BASE(za) + 40]);
  pts.push([X(za), top(za) + (BASE(za) - top(za)) * .38]);
  for (let j = 0; j <= 16; j++) { const u = j / 16, z = mix(za, zb, u), a = Math.sin(Math.PI * u); pts.push([X(z), mix(top(z) + (BASE(z) - top(z)) * .38, top(z), Math.pow(a, .55))]); }
  pts.push([X(zb), BASE(zb) + 40]);
  return pts;
}
const ARCHES = Array.from({ length: 20 }, (_, k) => archPoly(k + 1));
const crown = (k) => { const za = Z(ARCH0 + k - 1) + PW, zb = Z(ARCH0 + k) - PW, z = (za + zb) / 2; return [X(z), DECK(z) + DECKH / z + 30 / z, z]; };

// ---------------------------------------------------------------- static layers
const sky = () => memo('t.sky', () => {
  const [c, g] = layer(W + 200, H);
  const gr = g.createLinearGradient(0, 0, 0, HZ + 40); gr.addColorStop(0, '#05071a'); gr.addColorStop(.55, '#111640'); gr.addColorStop(.9, '#2a2a66'); gr.addColorStop(1, '#45407a'); g.fillStyle = gr; g.fillRect(0, 0, W + 200, H);
  const r = prng(3); for (let i = 0; i < 520; i++) { const x = r() * (W + 200), y = Math.pow(r(), 1.5) * (HZ - 40), m = r(); g.fillStyle = rgba('#e4ecff', .1 + .55 * m * m); const s = m > .96 ? 2 : 1; g.fillRect(x, y, s, s); }
  // high hatched cloud bars catching nothing but starlight
  g.save(); g.beginPath(); for (const [y, x0, x1, th] of [[150, 200, 1100, 14], [210, 900, 2000, 10], [95, 1300, 2100, 8]]) { g.moveTo(x0, y); for (let x = x0; x <= x1; x += 12) { const qq = (x - x0) / (x1 - x0); g.lineTo(x, y - th * Math.pow(Math.sin(Math.PI * qq), .6)); } for (let x = x1; x >= x0; x -= 12) { const qq = (x - x0) / (x1 - x0); g.lineTo(x, y + th * .4 * Math.pow(Math.sin(Math.PI * qq), .8)); } g.closePath(); }
  g.fillStyle = rgba('#3a3f80', .35); g.fill(); g.clip(); hatch(g, [0, 60, W + 200, 200], { angle: -.01, gap: 4, w: 1, col: '#8d93d0', a: .25, seed: 4, broken: .3 }); g.restore();
  return c;
});
const hills = () => memo('t.hills', () => {
  const [c, g] = layer(W + 400, H);
  const n = vnoise(7);
  const ridge = (base, amp, f, sd, col, hc) => {
    const pts = [[-10, H]]; for (let x = -10; x <= W + 410; x += 8) pts.push([x, base - amp * fbm(n, x * f, sd, 4)]); pts.push([W + 410, H]);
    roughPoly(g, pts, col, { amp: 1, seed: sd });
    g.save(); g.beginPath(); roughPath(g, pts, { amp: 1, seed: sd }); g.clip();
    const r = prng(sd + 3); g.strokeStyle = hc; g.lineCap = 'round';
    for (let k = 1; k < 18; k++) { let x = r() * 40; while (x < W + 400) { const len = 30 + r() * 140; g.globalAlpha = .18 * (.4 + .6 * r()); g.lineWidth = 1; g.beginPath(); for (let xx = x; xx < x + len; xx += 6) g.lineTo(xx, base - amp * fbm(n, xx * f, sd, 4) + k * 7 + (n(xx * .02, k) - .5) * 3); g.stroke(); x += len + 20 + r() * 80; } }
    g.globalAlpha = 1; g.restore();
  };
  ridge(HZ + 10, 160, .0022, 3, '#1d1d52', '#7d82c8');
  fog(g, { y0: HZ - 70, y1: HZ + 60, col: '#5a5aa0', a: .35, seed: 21, cover: .6, soft: .5, k: .35, sx: .003, sy: .03, x1: W + 400 });
  ridge(HZ + 70, 120, .003, 8, '#141441', '#6066b0');
  // valley floor: river glint and a village far right
  { const gr = g.createLinearGradient(0, HZ + 40, 0, H); gr.addColorStop(0, '#12123a'); gr.addColorStop(1, '#08081e'); g.fillStyle = gr; g.fillRect(0, HZ + 120, W + 400, H); }
  const r = prng(9);
  for (let i = 0; i < 90; i++) { const x = 900 + r() * 1300, y = HZ + 110 + Math.pow(r(), 2) * 120; g.fillStyle = rgba(r() < .7 ? HOT : '#ffe9c0', .55 + .4 * r()); g.fillRect(x, y, r() < .2 ? 2 : 1.4, r() < .2 ? 2 : 1.4); }
  bloom(g, 1500, HZ + 150, 260, { col: AMB, core: HOT, a: .18, k: .5, seed: 5, sy: .35 });
  for (let i = 0; i < 60; i++) { const y = HZ + 230 + r() * 40, x = 200 + r() * 1800; g.fillStyle = rgba('#9aa0e0', .08 + .12 * r()); g.fillRect(x, y, 30 + r() * 90, 1.2); }
  fog(g, { y0: HZ + 120, y1: HZ + 330, col: '#4b4b92', a: .4, seed: 23, cover: .65, soft: .55, k: .4, sx: .0025, sy: .025, x1: W + 400 });
  return c;
});
const viaduct = () => memo('t.via', () => {
  const [c, g] = layer(W + 400, H); g.translate(200, 0);
  // body: deck from z=1.05 to far, piers down to the valley
  const zs = []; for (let z = 1.05; z < 40; z *= 1.02) zs.push(z);
  const top = zs.map((z) => [X(z), DECK(z)]), bot = zs.map((z) => [X(z), BASE(z) + 60]).reverse();
  roughPoly(g, [...top, ...bot], '#1a1a44', { amp: .8, seed: 2 });
  g.save(); g.beginPath(); roughPath(g, [...top, ...bot], { amp: .8, seed: 2 }); g.clip();
  // stone courses (perspective lines toward the VP), side light from the valley below (cool), darker near
  { const gr = g.createLinearGradient(0, 200, 0, 1000); gr.addColorStop(0, rgba('#5a5a9a', .25)); gr.addColorStop(1, rgba('#05061a', .5)); g.fillStyle = gr; g.fillRect(-200, 0, W + 400, H); }
  g.strokeStyle = rgba('#8a8ed0', .16); g.lineWidth = 1;
  for (let f = 0; f < 1; f += .045) { g.beginPath(); for (let k = 0; k < zs.length; k += 2) { const z = zs[k], y = mix(DECK(z) + DECKH / z, BASE(z), f); k ? g.lineTo(X(z), y) : g.moveTo(X(z), y); } g.stroke(); }
  hatch(g, [-200, 300, 1100, 800], { angle: .9, gap: 6, w: 1, col: '#04040f', a: .35, seed: 6, broken: .45 });
  g.restore();
  // parapet band + lit top edge
  { const pts = [...zs.map((z) => [X(z), DECK(z)]), ...zs.map((z) => [X(z), DECK(z) + DECKH / z]).reverse()]; roughPoly(g, pts, '#24244f', { amp: .5, seed: 3 });
    g.strokeStyle = rgba('#b9bdf0', .35); g.lineWidth = 1.4; g.beginPath(); zs.forEach((z, k) => k ? g.lineTo(X(z), DECK(z)) : g.moveTo(X(z), DECK(z))); g.stroke();
    g.strokeStyle = rgba('#04040f', .5); g.lineWidth = 1.2; g.beginPath(); zs.forEach((z, k) => k ? g.lineTo(X(z), DECK(z) + DECKH / z) : g.moveTo(X(z), DECK(z) + DECKH / z)); g.stroke(); }
  // cut the arches (valley shows through)
  g.save(); g.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 160; i++) { const za = Z(i) + PW, zb = Z(i + 1) - PW; if (za < 1.05) continue; const pts = []; const tp = (z) => DECK(z) + DECKH / z + 26 / z;
    pts.push([X(za), BASE(za) + 60]); pts.push([X(za), tp(za) + (BASE(za) - tp(za)) * .38]);
    for (let j = 0; j <= 16; j++) { const u = j / 16, z = mix(za, zb, u), a = Math.sin(Math.PI * u); pts.push([X(z), mix(tp(z) + (BASE(z) - tp(z)) * .38, tp(z), Math.pow(a, .55))]); }
    pts.push([X(zb), BASE(zb) + 60]); g.beginPath(); roughPath(g, pts, { amp: .6, seed: i }); g.fill(); }
  g.restore();
  // aerial fog toward the far end
  maskLinear(c, 1100, 0, 2400, 0, [[0, 1], [.6, .75], [1, .25]]);
  return c;
});
const fore = () => memo('t.fore', () => {
  const [c, g] = layer(W + 800, H); const r = prng(12), n = vnoise(13);
  // dark pines and scrub in the lower left foreground (fast parallax)
  const pine = (x, y, h, w) => { const pts = [[x, y - h]]; for (let k = 1; k <= 9; k++) { const yy = y - h + h * k / 9, ww = w * k / 9 * (1 + (n(x, k) - .5) * .5); pts.push([x + ww, yy]); pts.push([x + ww * .45, yy + 4]); } pts.push([x + 6, y], [x - 6, y]); for (let k = 9; k >= 1; k--) { const yy = y - h + h * k / 9, ww = w * k / 9 * (1 + (n(x + 9, k) - .5) * .5); pts.push([x - ww * .45, yy + 4]); pts.push([x - ww, yy]); } roughPoly(g, pts, '#05061a', { amp: 1.5, seed: x | 0 }); };
  for (const [x, y, h, w] of [[60, 1120, 520, 120], [190, 1150, 400, 95], [-40, 1100, 620, 140], [1880, 1180, 420, 110], [2050, 1150, 520, 120]]) pine(x, y, h, w);
  const pts = [[-10, H + 10]]; for (let x = -10; x <= W + 810; x += 10) pts.push([x, 1010 + 50 * fbm(n, x * .004, 3) - (x < 500 ? 60 * (1 - x / 500) : 0)]); pts.push([W + 810, H + 10]); roughPoly(g, pts, '#05061a', { amp: 2, seed: 4 });
  return c;
});

// ---------------------------------------------------------------- the train
function train(ctx, zf, t, { litA = 1 } = {}) {
  const CAR = .3, GAP = .012, hT = 92, cars = 5, out = {};
  for (let ci = cars - 1; ci >= 0; ci--) {
    const z1 = zf - ci * CAR, z0 = z1 - CAR + GAP; if (z1 < .9) continue;
    const za = Math.max(.9, z0);
    const P = (z, v) => [X(z), DECK(z) - (hT * v) / z - 2 / z];
    const body = [P(za, 1), P(z1, 1), P(z1, 0), P(za, 0)];
    roughPoly(ctx, body, ci === 0 ? '#2a2546' : '#221f3e', { amp: .4, seed: ci });
    // roof highlight + underframe
    ctx.strokeStyle = rgba('#a9a7e0', .4); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(...P(za, 1)); ctx.lineTo(...P(z1, 1)); ctx.stroke();
    ctx.fillStyle = '#0d0c22'; ctx.beginPath(); ctx.moveTo(...P(za, .12)); ctx.lineTo(...P(z1, .12)); ctx.lineTo(...P(z1, 0)); ctx.lineTo(...P(za, 0)); ctx.fill();
    // windows: warm, passengers as silhouettes
    const nw = ci === 0 ? 3 : 7;
    for (let w = 0; w < nw; w++) {
      const u0 = (w + .2) / nw, u1 = (w + .8) / nw, zA = mix(z0, z1, u0), zB = mix(z0, z1, u1); if (zA < .95) continue;
      const q = [P(zA, .78), P(zB, .78), P(zB, .4), P(zA, .4)];
      const fl = .85 + .15 * Math.sin(t * 7 + w * 2 + ci);
      ctx.fillStyle = mixHex('#7a4a2a', HOT, fl * litA); ctx.beginPath(); ctx.moveTo(...q[0]); for (const p of q) ctx.lineTo(...p); ctx.fill();
      if ((w + ci) % 3 !== 1) { const [hx, hy] = P(mix(zA, zB, .5), .52), s = 1 / mix(zA, zB, .5); ctx.fillStyle = rgba('#2a1a22', .75); ctx.beginPath(); ctx.ellipse(hx, hy - 6 * s, 5.5 * s, 7 * s, 0, 0, 7); ctx.fill(); ctx.fillRect(hx - 9 * s, hy, 18 * s, 14 * s); }
    }
    if (ci === 0) { // the cab: front window (the clip frame lands here) + headlight
      const zA = z1 - .07, zB = z1 - .012; out.win = [P(zA, .8), P(zB, .8), P(zB, .46), P(zA, .46)];
      out.head = P(z1, .3); out.zf = z1;
    }
    // light spill under the windows onto the parapet
  }
  return out;
}

// ================================================================ SHOT 1.01
export function drawTrain(T) {
  const tTen = T.S('01a', 'ten'), tTwenty = T.S('01a', 'twenty'), tEnd = T.E('01a', 'years'), c = T.clip('M');
  const lit = (k) => k <= 10 ? mix(T.S('01a', 'He') + .05, tTen + .2, (k - 1) / 9) : mix(tTwenty - .3, tTwenty + .25, (k - 11) / 9);
  const zfT = (t) => 1.85 + .75 * (t - 39.2) + .09 * Math.pow(Math.max(0, t - 39.2), 2.1);
  return (ctx, t) => {
    const pan = mix(0, 260, sm(lin(39.2, 44, t))) + drift(t, 8, 1), tilt = drift(t, 5, 2);
    ctx.drawImage(sky(), -100 - pan * .1, 0);
    ctx.drawImage(hills(), -200 - pan * .35, tilt * .3);
    // arch light pools on the valley floor behind the viaduct
    ctx.save(); ctx.translate(-pan, tilt);
    for (let k = 1; k <= 20; k++) { const a = sm(lin(lit(k), lit(k) + .35, t)); if (a <= 0) continue; const [x, y, z] = crown(k), by = BASE(z); spot(ctx, x, by - 60 / z, 260 / z, .32 * a, AMB, HOT, { sy: .35 }); }
    ctx.restore();
    // the river in the valley mirrors the lit arches (wobbling streaks)
    { const ry = 930 + tilt; const g = ctx.createLinearGradient(0, ry - 40, 0, H); g.addColorStop(0, rgba('#2a2a66', 0)); g.addColorStop(.25, rgba('#2a2a66', .7)); g.addColorStop(1, rgba('#14143a', .9)); ctx.fillStyle = g; ctx.fillRect(0, ry - 40, W, H - ry + 40);
      ctx.save(); ctx.translate(-pan, 0); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
      for (let k = 1; k <= 20; k++) { const a = sm(lin(lit(k), lit(k) + .4, t)); if (a <= 0) continue; const [x, , z] = crown(k); for (let j = 0; j < 9; j++) { const yy = ry - 10 + j * (14 + j * 3), w = (22 + j * 8) / Math.sqrt(z) * (.7 + .3 * Math.sin(t * 3 + j + k)), xo = Math.sin(t * 2 + j * 1.7 + k) * 4; ctx.strokeStyle = rgba('#ffd9a0', .5 * a * (1 - j / 10)); ctx.lineWidth = 2 + j * .4; ctx.beginPath(); ctx.moveTo(x + xo - w, yy); ctx.lineTo(x + xo + w, yy); ctx.stroke(); } }
      ctx.restore(); }
    ctx.save(); ctx.translate(-pan - 200, tilt); ctx.drawImage(viaduct(), 0, 0); ctx.restore();
    ctx.save(); ctx.translate(-pan, tilt);
    // lit arches: warm fill + lamp at the crown + labels at 10 and 20
    for (let k = 1; k <= 20; k++) {
      const a0 = lin(lit(k), lit(k) + .35, t); if (a0 <= 0) continue; const a = eout(a0), [x, y, z] = crown(k);
      ctx.save(); ctx.beginPath(); roughPath(ctx, ARCHES[k - 1], { amp: .6, seed: k + ARCH0 - 1 }); ctx.clip();
      const gr = ctx.createRadialGradient(x, y, 0, x, y, 520 / z); gr.addColorStop(0, rgba(HOT, .55 * a)); gr.addColorStop(.35, rgba(AMB, .22 * a)); gr.addColorStop(1, rgba(AMB, 0)); ctx.fillStyle = gr; ctx.fillRect(x - 600 / z, y - 50, 1200 / z, 1200 / z); ctx.restore();
      const br = 1 + .25 * Math.exp(-(t - lit(k)) * 4) * (t > lit(k) ? 1 : 0);
      spot(ctx, x, y + 6 / z, 90 / z * br, .8 * a, AMB, HOT, { grain: true });
      ctx.fillStyle = rgba('#fff3dc', a); ctx.beginPath(); ctx.arc(x, y + 6 / z, Math.max(1.4, 5 / z), 0, 7); ctx.fill();
    }
    for (const [k, tt, lab] of [[10, tTen, '10'], [20, tTwenty, '20']]) {
      const a = eout(lin(tt, tt + .5, t)) * (1 - lin(tEnd + .5, tEnd + .9, t)); if (a <= 0) continue;
      const [x, , z] = crown(k), y0 = DECK(z) - 110 / z - 10, y1 = y0 - 120 + (1 - a) * 20;
      ctx.strokeStyle = rgba('#f3efe2', .5 * a); ctx.setLineDash([2, 5]); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1 + 12); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = rgba(AMB, a); ctx.beginPath(); ctx.arc(x, y0, 3, 0, 7); ctx.fill();
      text(ctx, lab, x, y1, { size: 84, font: 'Instrument Serif', align: 'center', alpha: a });
      text(ctx, 'YEARS', x, y1 + 30, { size: 17, weight: 600, color: C.muted, align: 'center', alpha: a, spacing: 5 });
    }
    // the train, running away into the years
    const tr = train(ctx, zfT(t), t);
    // headlight beam along the deck
    if (tr.head) { const [hx, hy] = tr.head; spot(ctx, hx + 6, hy, 120 / tr.zf, .8, AMB, HOT); const g = ctx.createLinearGradient(hx, hy, hx + 500 / tr.zf, hy); g.addColorStop(0, rgba(HOT, .35)); g.addColorStop(1, rgba(HOT, 0)); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(hx, hy - 4 / tr.zf); ctx.lineTo(hx + 520 / tr.zf, hy - 40 / tr.zf); ctx.lineTo(hx + 520 / tr.zf, hy + 26 / tr.zf); ctx.closePath(); ctx.fill(); ctx.restore(); }
    // window glow spill on the parapet under the train
    if (tr.win) {
      const q = tr.win, cx = (q[0][0] + q[1][0]) / 2, cy = (q[0][1] + q[2][1]) / 2, ww = q[1][0] - q[0][0], wh = q[2][1] - q[0][1];
      // the clip frame flies in from the left and lands as this window
      const u = lin(39.2, 39.95, t);
      if (u < 1) {
        const e = eio(u), fw = mix(250, ww, e), fh = mix(444, wh, Math.pow(e, .8)), fx = mix(-260, cx, eout(u)) , fy = mix(470, cy, e) - Math.sin(Math.PI * u) * 60;
        ctx.save(); ctx.translate(-0, 0);
        ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30; ctx.fillStyle = '#05060f'; ctx.fillRect(fx - fw / 2, fy - fh / 2, fw, fh); ctx.shadowBlur = 0;
        ctx.restore();
        clipScreen(ctx, Math.min(t, c.end - .05), T, 'M', fx - fw / 2, fy - fh / 2, fw, fh, { radius: mix(12, 2, e), glow: false, bezel: false });
        ctx.fillStyle = rgba(HOT, sm(lin(.55, 1, u))); ctx.fillRect(fx - fw / 2, fy - fh / 2, fw, fh);
        ctx.strokeStyle = rgba('#f3efe2', .35 * (1 - u)); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(fx - fw / 2, fy - fh / 2, fw, fh, mix(12, 2, e)); ctx.stroke();
        // smear trail behind the frame
        for (let k = 1; k < 5; k++) { const uk = lin(39.2, 39.95, t - k * .025), ek = eio(uk); ctx.fillStyle = rgba(HOT, .07 * (1 - u)); ctx.fillRect(mix(-260, cx, eout(uk)) - fw / 2, mix(470, cy, ek) - fh / 2, fw, fh); }
      } else {
        const fl = .9 + .1 * Math.sin(t * 5);
        ctx.fillStyle = mixHex('#ffcf85', '#fff1d0', fl); ctx.beginPath(); ctx.moveTo(...q[0]); for (const p of q) ctx.lineTo(...p); ctx.fill();
      }
      spot(ctx, cx, cy, 70 / tr.zf + 20 * Math.exp(-Math.max(0, t - 39.95) * 3), .7, AMB, HOT);
    }
    ctx.restore();
    // foreground pines (fast parallax)
    ctx.drawImage(fore(), -300 - pan * 1.6, tilt * 1.4 + 20);
    printFinish(ctx, { grain: .07, vig: .4 });
  };
}

// ================================================================ SHOT 1.02 · the tail lantern
// Close at deck level: the last carriage rushes out right, its lantern slides off the light trail and hangs.
const far2 = () => memo('t.far2', () => {
  const [c, g] = layer(W * 2, H); const r = prng(31), n = vnoise(32);
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#05071a'); gr.addColorStop(.6, '#15174a'); gr.addColorStop(1, '#2a2865'); g.fillStyle = gr; g.fillRect(0, 0, W * 2, H);
  for (let i = 0; i < 700; i++) { const x = r() * W * 2, y = Math.pow(r(), 1.4) * 700, m = r(); g.fillStyle = rgba('#e4ecff', .08 + .5 * m * m); g.fillRect(x, y, m > .95 ? 2 : 1, m > .95 ? 2 : 1); }
  // far valley lights as soft bokeh (out of focus)
  for (let i = 0; i < 70; i++) { const x = r() * W * 2, y = 640 + r() * 200, rr = 6 + r() * 18; const rg = g.createRadialGradient(x, y, 0, x, y, rr); rg.addColorStop(0, rgba(r() < .8 ? AMB : '#ffe6c0', .35 * r() + .1)); rg.addColorStop(.7, rgba(AMB, .08)); rg.addColorStop(1, rgba(AMB, 0)); g.fillStyle = rg; g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill(); }
  const pts = [[0, H]]; for (let x = 0; x <= W * 2; x += 10) pts.push([x, 640 - 120 * fbm(n, x * .002, 1, 4)]); pts.push([W * 2, H]);
  roughPoly(g, pts, rgba('#141440', .85), { amp: 1, seed: 5 });
  fog(g, { y0: 560, y1: 780, col: '#5656a0', a: .4, seed: 33, cover: .6, soft: .5, k: .35, sx: .002, sy: .03, x1: W * 2 });
  return c;
});
const parapet = () => memo('t.par', () => {
  const [c, g] = layer(W * 2, 300); const r = prng(41);
  g.fillStyle = '#1a1a40'; g.fillRect(0, 30, W * 2, 270);
  for (let row = 0; row < 5; row++) { let x = -r() * 120; const y = 30 + row * 56; while (x < W * 2) { const w = 90 + r() * 120; roughRect(g, x + 2, y + 2, w - 4, 52, mixHex('#1e1e4a', '#2a2a5c', r()), { amp: 1.2, seed: (x | 0) + row }); x += w; } }
  g.fillStyle = rgba('#b9bdf0', .3); g.fillRect(0, 30, W * 2, 2.5);
  hatch(g, [0, 60, W * 2, 240], { angle: .8, gap: 6, w: 1, col: '#04040f', a: .3, seed: 7, broken: .5 });
  return c;
});
const carriage = () => memo('t.car', () => {
  const [c, g] = layer(1520, 420), r = prng(51);
  // body: rounded tail end on the left, roof curve, panel seams, warm windows with passengers
  g.save(); g.beginPath(); g.moveTo(40, 40); g.quadraticCurveTo(4, 44, 6, 120); g.lineTo(6, 330); g.quadraticCurveTo(8, 360, 40, 362); g.lineTo(1520, 362); g.lineTo(1520, 30); g.quadraticCurveTo(800, 14, 40, 40); g.closePath();
  const gr = g.createLinearGradient(0, 20, 0, 362); gr.addColorStop(0, '#3a3466'); gr.addColorStop(.25, '#26224a'); gr.addColorStop(1, '#141230'); g.fillStyle = gr; g.fill(); g.clip();
  g.strokeStyle = rgba('#05040f', .5); g.lineWidth = 1.5; for (let x = 60; x < 1520; x += 170) { g.beginPath(); g.moveTo(x, 40); g.lineTo(x, 362); g.stroke(); }
  g.fillStyle = rgba('#a9a7e0', .35); g.fillRect(0, 252, 1520, 2.5); g.fillRect(0, 34, 1520, 2);
  for (let w = 0; w < 4; w++) { const x0 = 120 + w * 340; g.fillStyle = '#7a4a2a'; g.beginPath(); g.roundRect(x0, 92, 240, 130, 16); g.fill();
    const wg = g.createLinearGradient(x0, 92, x0, 222); wg.addColorStop(0, '#ffe2b0'); wg.addColorStop(1, '#f0a050'); g.fillStyle = wg; g.beginPath(); g.roundRect(x0 + 6, 98, 228, 118, 12); g.fill();
    for (let p = 0; p < 2; p++) { if (r() < .3) continue; const px = x0 + 50 + p * 120 + r() * 20; g.fillStyle = rgba('#3a2028', .8); g.beginPath(); g.ellipse(px, 150, 17, 21, 0, 0, 7); g.fill(); g.beginPath(); g.roundRect(px - 32, 170, 64, 60, 18); g.fill(); }
    g.fillStyle = rgba('#05040f', .55); g.fillRect(x0 + 118, 96, 4, 122); }
  hatch(g, [0, 230, 1520, 140], { angle: .9, gap: 6, w: 1, col: '#05040f', a: .35, seed: 52 });
  g.restore();
  g.fillStyle = '#0a0918'; g.fillRect(30, 362, 1490, 30); for (const x of [180, 330, 1100, 1250]) { g.beginPath(); g.arc(x, 392, 26, 0, 7); g.fill(); g.strokeStyle = rgba('#8a8ab0', .4); g.lineWidth = 2; g.beginPath(); g.arc(x, 392, 18, 0, 7); g.stroke(); }
  g.fillStyle = '#0a0918'; g.fillRect(0, 300, 14, 30);   // buffer
  return c;
});
export function drawLantern(T) {
  const t0 = 43.25, tCond = T.S('01a', 'condition'), tIf = T.S('01a', 'If');
  // background scroll: fast at the hand-over (matching the train's speed), ramps down into slow motion
  const pos = (t) => { const u = Math.max(0, t - t0); return 2400 * .28 * (1 - Math.exp(-u / .28)) + 40 * u; };
  // lantern x: rides on the carriage, then detaches and decelerates to hang at LX
  const LX = 1010, LY = 470;
  const rear = (t) => -150 + 2600 * Math.max(0, t - t0);
  const lanX = (t) => { const u = Math.max(0, t - t0); return u < .25 ? rear(t) - 18 : 482 + 528 * (1 - Math.exp(-(u - .25) / .2)); };
  return (ctx, t) => {
    const p = pos(t), push = ein(lin(tIf - .45, tIf + .05, t)), zoom = Math.pow(7, push);
    const lx = lanX(t) + drift(t, 4, 3), ly = LY + Math.sin((t - t0) * 2.6) * 18 * Math.exp(-Math.max(0, t - tCond) * .8) + drift(t, 3, 5);
    ctx.save(); ctx.translate(lx, ly); ctx.scale(zoom, zoom); ctx.translate(-lx, -ly);
    const fx = -((p * .18) % W);
    ctx.drawImage(far2(), fx, 0); ctx.drawImage(far2(), fx + W * 2 - 1, 0);
    // the carriage tail rushing out to the right (smeared), then gone
    const rx = rear(t);
    if (rx < W + 100) {
      const cs = carriage();
      for (let k = 6; k >= 1; k--) { ctx.globalAlpha = .09; ctx.drawImage(cs, rx - k * 42, 280); }
      ctx.globalAlpha = 1; ctx.drawImage(cs, rx, 280);
      // speed streaks off the windows
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let w = 0; w < 4; w++) { const g = ctx.createLinearGradient(rx + 120 + w * 340 - 260, 0, rx + 120 + w * 340, 0); g.addColorStop(0, rgba(AMB, 0)); g.addColorStop(1, rgba(AMB, .22)); ctx.fillStyle = g; ctx.fillRect(rx + 120 + w * 340 - 260, 372, 260, 100); } ctx.restore();
    }
    // the light trail: a long amber streak from the lantern back to where it came from
    { const tail = Math.max(0, lx - (300 + 2000 * Math.exp(-Math.max(0, t - t0) * 2.2))), a = .8 * (1 - sm(lin(t0 + .3, tCond + .3, t)));
      if (a > 0) { const g = ctx.createLinearGradient(tail, 0, lx, 0); g.addColorStop(0, rgba(AMB, 0)); g.addColorStop(1, rgba(HOT, a)); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(tail, ly - 3, lx - tail, 6); ctx.globalAlpha = .3; ctx.fillRect(tail, ly - 14, lx - tail, 28); ctx.restore(); } }
    // the light thread the lantern hangs from (appears as it settles; it will write the "if")
    { const a = sm(lin(tCond - .2, tCond + .5, t)); if (a > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(HOT, .55 * a); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(lx, ly - 34); ctx.quadraticCurveTo(lx + 6, ly - 300, lx - 10 + drift(t, 6), -20); ctx.stroke(); ctx.restore(); } }
    // the lantern: dark iron housing, amber glass, handle
    spot(ctx, lx, ly, 260, .55 + .08 * Math.sin(t * 3.1), AMB, HOT, { grain: true });
    ctx.save(); ctx.translate(lx, ly); ctx.rotate(Math.sin((t - t0) * 2.6) * .12 * Math.exp(-Math.max(0, t - tCond) * .8));
    ctx.strokeStyle = '#120f22'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, -30, 12, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
    roughRect(ctx, -20, -26, 40, 8, '#120f22', { amp: .5, seed: 2 }); roughRect(ctx, -16, -18, 32, 38, '#ffcf7a', { amp: .5, seed: 3 });
    ctx.fillStyle = rgba('#fff4dc', .9); ctx.beginPath(); ctx.ellipse(0, 2, 6, 10, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#120f22'; ctx.fillRect(-18, -18, 3, 38); ctx.fillRect(15, -18, 3, 38); ctx.fillRect(-1.5, -18, 3, 38); roughRect(ctx, -22, 20, 44, 7, '#120f22', { amp: .5, seed: 4 });
    ctx.restore();
    spot(ctx, lx, ly, 70, .9, AMB, '#fff6e2');
    // the parapet in front (fast at first, then slow motion)
    const pp = -((p * 1.0) % W);
    ctx.drawImage(parapet(), pp, 800); ctx.drawImage(parapet(), pp + W * 2 - 1, 800);
    { const g = ctx.createRadialGradient(lx, 830, 0, lx, 830, 500); g.addColorStop(0, rgba(AMB, .25)); g.addColorStop(1, rgba(AMB, 0)); ctx.fillStyle = g; ctx.fillRect(0, 800, W, 300); }
    ctx.restore();
    // the push-in: lantern light swallows the frame
    if (push > 0) spot(ctx, lx, ly, mix(120, 900, push), push * .9, AMB, '#fff6e2');
    printFinish(ctx, { grain: .07, vig: .45 });
  };
}
export const LANTERN_END = [1010, 470];
