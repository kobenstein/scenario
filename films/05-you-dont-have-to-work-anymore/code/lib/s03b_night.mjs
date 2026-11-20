// s03b_night · plates for 3.36 (the bridge at dawn), 3.37 (dark kitchen, the reflection in the pane) and the
// courtyard behind clip S (its centre window lights at the hand-over to chapter 04).
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, layer, put, stipple, maskLinear, maskRadial, roughPath, roughPoly, roughRect, roughLine, hatch, fog, cone, vnoise, facade, quadMap, quadIn, limb, qpts, soften } from './art.mjs';
import { once, pool2, bloom2 } from './s03b_kit.mjs';

// ===================================================================================== 3.36 · bridge at dawn
export const BR = { deck: 880, rail: 790, sun: [1480, 600] };
export function bridgePlates() {
  return once('bridge', () => {
    const [sky, s] = layer();
    { const g = s.createLinearGradient(0, 0, 0, 650); g.addColorStop(0, '#2e2c62'); g.addColorStop(.45, '#7a5a86'); g.addColorStop(.8, '#d98e92'); g.addColorStop(1, '#f6c09a'); s.fillStyle = g; s.fillRect(0, 0, W, H); }
    bloom2(s, BR.sun[0], BR.sun[1], 700, { col: '#ffb38a', core: '#fff0d8', a: .7, k: .35, seed: 2 });
    { const r = prng(3); for (let k = 0; k < 6; k++) { const y = 140 + k * 70 + r() * 30, x0 = r() * 900 - 200, x1 = x0 + 700 + r() * 800; s.save(); s.beginPath(); s.moveTo(x0, y); for (let x = x0; x <= x1; x += 20) { const q = (x - x0) / (x1 - x0); s.lineTo(x, y - 9 * Math.sin(Math.PI * q) ** .6); } for (let x = x1; x >= x0; x -= 20) { const q = (x - x0) / (x1 - x0); s.lineTo(x, y + 4 * Math.sin(Math.PI * q)); } s.closePath(); s.fillStyle = rgba('#f7c2a8', .35); s.fill(); s.clip(); hatch(s, [x0, y - 12, x1 - x0, 20], { angle: 0, gap: 3, col: '#ffe0c8', a: .4, seed: k }); s.restore(); } }
    // far city on the river bank, aerial pink-violet
    { const r = prng(4); let x = -20; while (x < W + 20) { const w = 30 + r() * 70, h = 30 + r() * 110; roughRect(s, x, 640 - h, w, h + 10, mixHex('#8a6684', '#9a7290', r()), { amp: .6, seed: x | 0 }); if (r() < .3) { s.fillStyle = rgba('#ffd9a8', .7); s.fillRect(x + w * .4, 640 - h * .6, 3, 4); } x += w + r() * 10; } }
    fog(s, { y0: 520, y1: 660, col: '#f2b8a4', a: .55, seed: 5, cover: .75, soft: .45, k: .25, sx: .004, sy: .03 });
    // the river
    { const g = s.createLinearGradient(0, 640, 0, H); g.addColorStop(0, '#e0a19a'); g.addColorStop(.3, '#8a5f84'); g.addColorStop(1, '#2a2650'); s.fillStyle = g; s.fillRect(0, 640, W, H - 640); }
    { const r = prng(6); for (let i = 0; i < 260; i++) { const y = 650 + Math.pow(r(), 1.4) * 430, x = r() * W, l = 20 + r() * 120 * (y - 600) / 400, near = Math.abs(x - BR.sun[0]) < 160 + (y - 640) * .4; s.fillStyle = rgba(near ? '#ffe0b8' : '#f2c0b0', near ? .6 : .18); s.fillRect(x, y, l, 1.4); } }
    // the bridge: deck, arches, piers (in front of the river, behind the walkers)
    const [deck, d] = layer();
    roughPoly(d, [[-20, BR.deck - 6], [W + 20, BR.deck - 14], [W + 20, BR.deck + 40], [-20, BR.deck + 48]], '#3a2a46', { amp: 1, seed: 7 });
    for (let x = 140; x < W; x += 520) { roughPoly(d, [[x - 40, BR.deck + 40], [x + 40, BR.deck + 40], [x + 54, H + 20], [x - 54, H + 20]], '#2c2038', { amp: 1, seed: x }); }
    d.save(); d.globalCompositeOperation = 'destination-out'; for (let x = 140; x < W + 520; x += 520) { d.beginPath(); d.ellipse(x + 260, H + 40, 205, 230, 0, Math.PI, 0); d.fill(); } d.restore();
    { d.save(); d.beginPath(); d.rect(0, BR.deck + 30, W, 400); d.clip(); hatch(d, [0, BR.deck + 30, W, 400], { angle: -.7, gap: 6, col: '#120c1c', a: .4, seed: 9 }); d.restore(); }
    d.fillStyle = '#f2b49a'; d.fillRect(0, BR.deck - 8, W, 3);   // lit deck edge
    // back railing (behind the walkers)
    const rail = (ctx, y, a, seed) => { ctx.fillStyle = rgba('#2a1e36', a); ctx.fillRect(0, y, W, 8); ctx.fillRect(0, y + (BR.deck - y) * .55, W, 4); for (let x = 6; x < W; x += 30) ctx.fillRect(x, y + 8, 5, BR.deck - y - 10); ctx.fillStyle = rgba('#ffc6a8', .5 * a); ctx.fillRect(0, y, W, 1.5); };
    rail(d, BR.rail - 22, .55, 1);
    // lamp posts
    for (let x = 300; x < W; x += 560) { roughLine(d, [[x, BR.deck - 6], [x, BR.deck - 330]], { w: 6, col: '#24182e', seed: x }); d.fillStyle = '#24182e'; d.beginPath(); d.ellipse(x, BR.deck - 336, 14, 9, 0, 0, 7); d.fill(); d.fillStyle = rgba('#ffd9b0', .9); d.fillRect(x - 6, BR.deck - 336, 12, 7); }
    const [front, fr] = layer(); rail(fr, BR.rail, 1, 2);
    return { sky, deck, front };
  });
}

// ===================================================================================== the courtyard (behind the pane / behind clip S)
// A night facade across the courtyard. The centre window (screen centre in the final frames) is dark until the hand-over.
export const CY = { win: [960, 540], ww: 118, wh: 168 };
export function courtyardPlate() {
  return once('court', () => {
    const [c, g] = layer();
    { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0a0c26'); gr.addColorStop(1, '#141638'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
    { const r = prng(2); for (let i = 0; i < 60; i++) { g.fillStyle = rgba('#dfe4ff', .2 + .4 * r()); g.fillRect(r() * W, r() * 70, 1, 1); } }
    roughPoly(g, [[-40, 90], [W + 40, 70], [W + 40, H + 40], [-40, H + 40]], '#1a1c44', { amp: 2, seed: 3 });
    { g.save(); g.beginPath(); g.rect(-40, 70, W + 80, H); g.clip(); hatch(g, [0, 60, W, H], { angle: Math.PI / 2, gap: 7, col: '#0a0b22', a: .25, seed: 4, broken: .4 }); const gr = g.createRadialGradient(960, 600, 100, 960, 600, 1100); gr.addColorStop(0, rgba('#3a3c78', .35)); gr.addColorStop(1, rgba('#05061a', .5)); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.restore(); }
    // cornice + roof edge
    roughRect(g, -40, 70, W + 80, 18, '#24265a', { amp: 1, seed: 5 });
    const r = prng(6), { ww, wh } = CY;
    for (let j = -2; j <= 2; j++) for (let i = -3; i <= 3; i++) {
      const x = CY.win[0] + i * 300, y = CY.win[1] + j * 240;
      roughRect(g, x - ww / 2 - 8, y - wh / 2 - 8, ww + 16, wh + 18, '#25285e', { amp: .6, seed: i * 10 + j });
      const lit = !(i === 0 && j === 0) && r() < .22, warm = r() < .5;
      roughRect(g, x - ww / 2, y - wh / 2, ww, wh, lit ? (warm ? '#6a4a3a' : '#2e3e6a') : '#0c0d26', { amp: .5, seed: i * 7 + j * 3 });
      if (lit) { g.fillStyle = rgba(warm ? '#ffb35c' : '#9fb4e6', .35); g.fillRect(x - ww / 2 + 6, y - wh / 2 + 6, ww - 12, wh * .5); }
      g.fillStyle = '#1e2050'; g.fillRect(x - 2, y - wh / 2, 4, wh); g.fillRect(x - ww / 2, y - wh * .1, ww, 4);
      roughRect(g, x - ww / 2 - 12, y + wh / 2 + 4, ww + 24, 8, '#2c2f6a', { amp: .4, seed: i + j * 9 });
    }
    roughLine(g, [[1420, 60], [1424, H + 20]], { w: 10, col: '#101130', seed: 7 });
    // bare courtyard tree, low left; mist at the bottom
    limb(g, qpts([260, H + 20], [280, 820], [230, 640]), 40, 14, '#080920', 8);
    for (const [a, b, c2] of [[[250, 700], [140, 600], [60, 560]], [[240, 660], [330, 560], [420, 520]], [[262, 780], [380, 720], [470, 700]]]) limb(g, qpts(a, b, c2), 14, 3, '#080920', a[0]);
    fog(g, { y0: 820, y1: H, col: '#3a3e7a', a: .5, seed: 9, cover: .7, soft: .4, k: .3, sx: .004, sy: .03 });
    return c;
  });
}
// the centre window light (cached small bloom) — drawn per frame with alpha
export function centreWindowLight() {
  return once('cwl', () => {
    const [c, g] = layer(900, 900); const { ww, wh } = CY;
    const gr = g.createRadialGradient(450, 450, 0, 450, 450, 440); gr.addColorStop(0, rgba('#ffd59a', .7)); gr.addColorStop(.18, rgba('#ffb35c', .35)); gr.addColorStop(.55, rgba('#ffb35c', .08)); gr.addColorStop(1, rgba('#ffb35c', 0)); g.fillStyle = gr; g.fillRect(0, 0, 900, 900);
    stipple(c, { k: .5, seed: 3 });
    const [w, wg] = layer(ww + 2, wh + 2); const lg = wg.createLinearGradient(0, 0, 0, wh); lg.addColorStop(0, '#ffd99a'); lg.addColorStop(1, '#f2953e'); wg.fillStyle = lg; wg.fillRect(1, 1, ww, wh);
    wg.fillStyle = '#6a3414'; wg.fillRect(ww / 2 - 1, 0, 4, wh + 2); wg.fillRect(0, wh * .4, ww + 2, 4);
    wg.fillStyle = rgba('#5a2a10', .55); wg.beginPath(); wg.ellipse(ww * .3, wh * .9, 14, 26, 0, 0, 7); wg.fill();   // someone at the table inside
    return { glow: c, pane: w };
  });
}

// ===================================================================================== 3.37 · dark kitchen
export const KT = { win: [760, 150, 820, 640], lamp: [300, 560] };
export function kitchenPlates() {
  return once('kitchen', () => {
    const [x0, y0, ww, wh] = KT.win;
    const [room, g] = layer();
    { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0c0e26'); gr.addColorStop(1, '#121434'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
    hatch(g, [0, 0, W, H], { angle: -.7, gap: 7, col: '#04051a', a: .3, seed: 2 });
    // cut out the window (the courtyard is drawn behind with its own parallax)
    g.save(); g.globalCompositeOperation = 'destination-out'; g.fillRect(x0, y0, ww, wh); g.restore();
    // window frame + mullions + sill
    roughRect(g, x0 - 26, y0 - 26, ww + 52, 26, '#1c1a30', { amp: .6, seed: 3 }); roughRect(g, x0 - 26, y0, 26, wh, '#1c1a30', { amp: .6, seed: 4 }); roughRect(g, x0 + ww, y0, 26, wh, '#1c1a30', { amp: .6, seed: 5 });
    g.fillStyle = '#1c1a30'; g.fillRect(x0 + ww / 2 - 7, y0, 14, wh); g.fillRect(x0, y0 + wh * .36 - 6, ww, 12);
    roughRect(g, x0 - 50, y0 + wh, ww + 100, 22, '#2a2440', { amp: .6, seed: 6 });
    // sill: a plant and a cup
    roughRect(g, x0 + 600, y0 + wh - 40, 46, 40, '#3a2a30', { amp: .4, seed: 7 }); g.fillStyle = '#20302a'; for (let i = 0; i < 6; i++) { g.beginPath(); g.ellipse(x0 + 623 + (i - 2.5) * 10, y0 + wh - 62 - Math.abs(i - 2.5) * 5, 7, 24, (i - 2.5) * .35, 0, 7); g.fill(); }
    // counter (left) with the lamp, kettle, board; fridge edge right
    roughPoly(g, [[-20, 700], [620, 700], [620, 724], [-20, 724]], '#3a3042', { amp: .6, seed: 8 });
    roughPoly(g, [[-20, 724], [610, 724], [610, H + 10], [-20, H + 10]], '#181628', { amp: .8, seed: 9 });
    for (let k = 0; k < 3; k++) roughRect(g, 20 + k * 200, 760, 180, 300, '#1e1c30', { amp: .6, seed: 10 + k });
    roughPoly(g, [[120, 700], [130, 640], [200, 636], [214, 700]], '#2a2838', { amp: .5, seed: 13 }); roughRect(g, 150, 624, 40, 14, '#2a2838', { amp: .3, seed: 14 });
    // the hero light: a small lamp on the counter
    roughPoly(g, [[KT.lamp[0] - 46, KT.lamp[1] + 20], [KT.lamp[0] + 46, KT.lamp[1] + 20], [KT.lamp[0] + 26, KT.lamp[1] - 34], [KT.lamp[0] - 26, KT.lamp[1] - 34]], '#d8a066', { amp: .4, seed: 15 });
    roughRect(g, KT.lamp[0] - 6, KT.lamp[1] + 20, 12, 120, '#2a2030', { amp: .3, seed: 16 }); roughRect(g, KT.lamp[0] - 30, KT.lamp[1] + 134, 60, 8, '#2a2030', { amp: .3, seed: 17 });
    bloom2(g, KT.lamp[0], KT.lamp[1], 520, { col: '#ffb35c', core: '#ffe3b0', a: .55, k: .5, seed: 18 });
    pool2(g, KT.lamp[0] + 40, 712, 360, 40, { col: '#ffb35c', a: .5, k: .5, seed: 19 });
    roughRect(g, 1760, 120, 200, 980, '#16152a', { amp: .8, seed: 20 }); g.fillStyle = rgba('#ffb35c', .18); g.fillRect(1760, 120, 3, 980);
    // floor
    roughPoly(g, [[600, 960], [1760, 940], [1760, H + 10], [600, H + 10]], '#0e0e22', { amp: .8, seed: 21 });
    const [fg, f] = layer();
    roughPoly(f, [[-40, 930], [760, 900], [800, 960], [-40, 1010]], '#1e1a2c', { amp: .8, seed: 30 }); roughPoly(f, [[-40, 1010], [800, 960], [800, H + 10], [-40, H + 10]], '#0c0b1c', { amp: .8, seed: 31 });
    f.fillStyle = rgba('#ffb35c', .22); f.fillRect(-40, 928, 800, 3);
    roughRect(f, 520, 880, 46, 40, '#c9b8a8', { amp: .4, seed: 32 }); f.strokeStyle = '#c9b8a8'; f.lineWidth = 5; f.beginPath(); f.arc(570, 898, 12, -1.2, 1.2); f.stroke(); f.fillStyle = rgba('#ffb35c', .35); f.fillRect(520, 880, 6, 40);
    roughRect(f, 1500, 640, 22, 460, '#0a0918', { amp: .6, seed: 33 }); roughRect(f, 1660, 640, 22, 460, '#0a0918', { amp: .6, seed: 34 }); roughRect(f, 1490, 630, 204, 26, '#0a0918', { amp: .6, seed: 35 }); roughRect(f, 1490, 720, 204, 16, '#0a0918', { amp: .6, seed: 36 });
    return { room, fg };
  });
}
// the reflection: a faceless head-and-shoulders, dark, rimmed warm on the lamp side (sharp + soft versions)
export function reflection() {
  return once('refl', () => {
    const [c, g] = layer(900, 900); const cx = 450, cy = 420;
    const body = () => { g.beginPath(); g.ellipse(cx, cy - 120, 92, 112, 0, 0, 7); g.moveTo(cx - 300, 900); g.bezierCurveTo(cx - 290, cy + 70, cx - 120, cy + 40, cx - 36, cy + 10); g.lineTo(cx - 34, cy - 20); g.lineTo(cx + 34, cy - 20); g.lineTo(cx + 36, cy + 10); g.bezierCurveTo(cx + 120, cy + 40, cx + 290, cy + 70, cx + 300, 900); g.closePath(); };
    g.save(); g.translate(-14, -6); body(); g.fillStyle = rgba('#ffc27a', .9); g.fill(); g.restore();   // rim (offset toward the lamp)
    body(); g.fillStyle = '#0a0a1c'; g.fill();
    g.save(); body(); g.clip(); const gr = g.createLinearGradient(cx - 300, 0, cx + 300, 0); gr.addColorStop(0, rgba('#ffb35c', .28)); gr.addColorStop(.4, rgba('#ffb35c', 0)); g.fillStyle = gr; g.fillRect(0, 0, 900, 900); hatch(g, [0, 300, 900, 600], { angle: -.7, gap: 6, col: '#000000', a: .35, seed: 3 }); g.restore();
    return { sharp: c, soft: soften(c, 14) };
  });
}
