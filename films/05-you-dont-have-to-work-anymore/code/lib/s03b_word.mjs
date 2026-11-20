// s03b_word · plates for 3.29 (park bench at noon), 3.30–3.33 [G3] (the form, the bench diptych; look = approved
// art test ref/kunst/g2.mjs) and helpers: the rubber stamp, the handwritten "retired", the figure on the bench.
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, layer, put, stipple, maskLinear, maskRadial, roughPath, roughPoly, roughRect, roughLine, hatch, fog, person, castShadow, vnoise, limb, qpts, soften } from './art.mjs';
import { once, pool2, bloom2 } from './s03b_kit.mjs';
import { text } from '../engine.mjs';

export const GOLD = '#ffb35c', HOT = '#ffdca6', RED = '#d23a2a';

// ===================================================================================== 3.29 · bench at noon
// Pale gold weekday noon: an empty bench under a big tree, lawn, a path; far off the city where everyone is at work.
export const BN = { bench: [980, 760], slatY: 662 };
export function noonPlates() {
  return once('noon', () => {
    const [far, f] = layer();
    { const g = f.createLinearGradient(0, 0, 0, 620); g.addColorStop(0, '#b9c4c4'); g.addColorStop(.6, '#e6dcb8'); g.addColorStop(1, '#f2e6c2'); f.fillStyle = g; f.fillRect(0, 0, W, H); }
    bloom2(f, 1650, -60, 900, { col: '#fff1cc', core: '#ffffff', a: .55, k: .3, seed: 3 });
    // the city at work, pale in the haze: office blocks, a crane
    { const r = prng(4); let x = -20; while (x < W + 40) { const w = 50 + r() * 90, h = 60 + r() * 170; roughRect(f, x, 600 - h, w, h + 20, mixHex('#b7b9b4', '#a6aaa8', r()), { amp: .8, seed: x | 0 }); for (let j = 0; j < h / 18 - 1; j++) for (let i = 0; i < w / 16 - 1; i++) if (r() < .5) { f.fillStyle = rgba('#8f9796', .5); f.fillRect(x + 6 + i * 16, 600 - h + 10 + j * 18, 8, 9); } x += w + 6 + r() * 20; } }
    roughLine(f, [[1320, 600], [1330, 330]], { w: 6, col: '#a1a5a2', seed: 5 }); roughLine(f, [[1220, 340], [1520, 330]], { w: 5, col: '#a1a5a2', seed: 6 });
    fog(f, { y0: 420, y1: 640, col: '#f2e8cc', a: .6, seed: 7, cover: .75, soft: .45, k: .2, sx: .004, sy: .03 });
    // tree line + lawn + path
    { const r = prng(8); for (let x = -40; x < W + 60;) { const bw = 60 + r() * 90, bh = 50 + r() * 70; f.fillStyle = mixHex('#8d8f5c', '#a09c62', r()); f.beginPath(); f.ellipse(x, 640 - bh * .3, bw * .7, bh * .55, 0, 0, 7); f.fill(); x += bw * .8; } }
    { const g = f.createLinearGradient(0, 620, 0, H); g.addColorStop(0, '#b3a764'); g.addColorStop(1, '#7a7238'); roughPoly(f, [[-10, 640], [W + 10, 630], [W + 10, H + 10], [-10, H + 10]], null, { amp: 2, seed: 9 }); f.fillStyle = g; f.fill(); }
    { f.save(); f.beginPath(); f.rect(0, 630, W, 450); f.clip(); const r = prng(10); f.strokeStyle = rgba('#5e5a2a', .35); f.lineWidth = 1.2; for (let i = 0; i < 2600; i++) { const x = r() * W, y = 640 + Math.pow(r(), .8) * 450, l = 3 + (y - 640) / 30; f.beginPath(); f.moveTo(x, y); f.lineTo(x + (r() - .5) * 3, y - l); f.stroke(); } f.restore(); }
    roughPoly(f, [[-10, 900], [500, 840], [1000, 812], [1500, 820], [1930, 860], [1930, 930], [1500, 880], [1000, 868], [500, 900], [-10, 980]], '#e3d6a6', { amp: 2, step: 12, seed: 11 });
    // tiny people far on the path, hurrying to work (static silhouettes, they are far)
    { const r = prng(12); for (let i = 0; i < 6; i++) { const x = 300 + i * 260 + r() * 80, y = 632; f.fillStyle = '#5a5848'; f.fillRect(x, y - 16, 4, 12); f.beginPath(); f.arc(x + 2, y - 19, 2.4, 0, 7); f.fill(); f.fillRect(x - 1, y - 5, 2, 6); f.fillRect(x + 3, y - 5, 2, 6); } }
    // the bench: front-on, slightly turned; noon shadow straight beneath
    const [bench, b] = layer();
    const [cx, gy] = BN.bench, bc = '#3a2a1c', slat = '#8a6038';
    b.fillStyle = rgba('#3c3a18', .55); b.beginPath(); b.ellipse(cx, gy + 4, 280, 26, 0, 0, 7); b.fill();
    for (const lx of [-230, 210]) { roughRect(b, cx + lx, gy - 120, 18, 124, bc, { amp: .5, seed: lx + 1 }); roughRect(b, cx + lx + 6, gy - 228, 12, 110, bc, { amp: .4, seed: lx + 2 }); }
    for (let k = 0; k < 3; k++) roughRect(b, cx - 262, BN.slatY - 72 + k * 30, 524, 18, k === 0 ? '#a77a48' : slat, { amp: .6, seed: 20 + k });   // backrest slats
    for (let k = 0; k < 3; k++) roughRect(b, cx - 270 + k * 4, gy - 128 + k * 13, 540 - k * 8, 12, k === 0 ? '#b88a52' : slat, { amp: .6, seed: 30 + k });   // seat
    { b.save(); b.beginPath(); b.rect(cx - 280, BN.slatY - 80, 560, 220); b.clip(); hatch(b, [cx - 280, BN.slatY - 80, 560, 220], { angle: .9, gap: 7, col: '#2a1a0c', a: .25, seed: 33 }); b.restore(); }
    // the big tree on the left: dark trunk, foliage clumps with hatched texture (A3 look)
    const [tree, tr] = layer();
    limb(tr, qpts([300, 1100], [330, 600], [250, 260]), 90, 44, '#2e2a18', 40);
    limb(tr, qpts([280, 420], [420, 300], [640, 230]), 34, 10, '#2e2a18', 41); limb(tr, qpts([260, 360], [150, 240], [40, 200]), 30, 8, '#2e2a18', 42);
    { const r = prng(43); for (let i = 0; i < 16; i++) { const x = -40 + r() * 760, y = -40 + r() * 330, rx = 90 + r() * 90, ry = 60 + r() * 50; tr.fillStyle = mixHex('#4e5a2a', '#6a7034', r()); tr.beginPath(); tr.ellipse(x, y, rx, ry, 0, 0, 7); tr.fill();
        tr.save(); tr.beginPath(); tr.ellipse(x, y, rx, ry, 0, 0, 7); tr.clip(); tr.fillStyle = rgba('#e8d58a', .25); tr.beginPath(); tr.ellipse(x + rx * .3, y - ry * .4, rx * .7, ry * .5, 0, 0, 7); tr.fill(); hatch(tr, [x - rx, y - ry, rx * 2, ry * 2], { angle: -.5, gap: 6, col: '#2a3012', a: .3, seed: i + 50 }); tr.restore(); } }
    // dappled shade on the lawn under the tree
    { const [c2, g2] = layer(); const r = prng(44); g2.fillStyle = '#2a2a10'; for (let i = 0; i < 40; i++) { g2.beginPath(); g2.ellipse(r() * 900, 700 + r() * 380, 40 + r() * 70, 8 + r() * 14, 0, 0, 7); g2.fill(); } maskLinear(c2, 0, 0, 1100, 0, [[0, .45], [.7, .25], [1, 0]]); put(tr, c2); }
    return { far, bench, tree };
  });
}

// ===================================================================================== the bench diptych (G2)
// One scene drawn twice by the same function; only light and the man's head change. k scales the bench group.
export function panelScene(w, h, warm, k) {
  return once(`pan:${w}:${warm}`, () => {
    const [c, ctx] = layer(w, h);
    const sky = warm ? ['#2a3a5c', '#c98a5a', '#f2c08a'] : ['#1b2238', '#3a4660', '#59657c'];
    { const g = ctx.createLinearGradient(0, 0, 0, h * .7); g.addColorStop(0, sky[0]); g.addColorStop(.7, sky[1]); g.addColorStop(1, sky[2]); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); }
    if (warm) bloom2(ctx, w * .86, h * .5, w * .52, { col: GOLD, core: HOT, a: .6, k: .4, seed: 4 });
    const rr = prng(5);
    for (let x = -20; x < w + 40;) { const bw = (30 + rr() * 50) * w / 800, bh = (40 + rr() * 60) * w / 800; ctx.fillStyle = warm ? mixHex('#4a4a4e', '#7a5a46', rr()) : mixHex('#273049', '#323b55', rr()); ctx.beginPath(); ctx.ellipse(x, h * .66 - bh * .3, bw * .7, bh * .5, 0, 0, 7); ctx.fill(); x += bw * .9; }
    { const [fc] = (() => { const [a, g] = layer(w, h); return [a, g]; })(); const g = fc.getContext('2d'); const n = vnoise(6); const d = g.createImageData(w, h); for (let y = Math.floor(h * .45); y < h * .75; y += 1) for (let x = 0; x < w; x += 1) { const v = (y - h * .45) / (h * .3), band = clamp(v / .5) * clamp((1 - v) / .5), f2 = n(x * .006 * 800 / w, y * .03 * 800 / w * .3); const i = (y * w + x) * 4; d.data[i] = warm ? 242 : 106; d.data[i + 1] = warm ? 192 : 117; d.data[i + 2] = warm ? 138 : 144; d.data[i + 3] = 255 * .4 * band * clamp((f2 - .3) / .4); } g.putImageData(d, 0, 0); stipple(fc, { k: .2, seed: 7 }); ctx.drawImage(fc, 0, 0); }
    { const g = ctx.createLinearGradient(0, h * .66, 0, h); g.addColorStop(0, warm ? '#5c5a3a' : '#2a3245'); g.addColorStop(1, warm ? '#2a2a20' : '#151a28'); roughRect(ctx, -10, h * .66, w + 20, h * .4, null, { amp: 1, seed: 7 }); ctx.fillStyle = g; ctx.fill(); }
    const s = w / 800;
    limb(ctx, qpts([w * .14, h + 10], [w * .1, h * .4], [w * .18, -20]), 46 * s, 30 * s, warm ? '#2a2018' : '#141a28', 8);
    limb(ctx, qpts([w * .15, h * .3], [w * .3, h * .2], [w * .44, -20]), 18 * s, 6 * s, warm ? '#2a2018' : '#141a28', 9);
    const lr = prng(10); for (let i = 0; i < 60; i++) { const x = w * (.05 + lr() * .5), y = lr() * h * .35; ctx.fillStyle = warm ? ['#e58a3a', '#ffb35c', '#c4482a'][i % 3] : ['#4a5068', '#565a70', '#3e4560'][i % 3]; ctx.beginPath(); ctx.ellipse(x, y, 7 * s, 4 * s, lr() * 3, 0, 7); ctx.fill(); }
    for (let i = 0; i < 40; i++) { const x = lr() * w, y = h * .7 + lr() * h * .3; ctx.fillStyle = warm ? rgba(['#e58a3a', '#ffb35c', '#c4482a'][i % 3], .8) : rgba('#4a5470', .6); ctx.beginPath(); ctx.ellipse(x, y, 4 * s, 2 * s, lr() * 3, 0, 7); ctx.fill(); }
    // bench (no man; he is a separate sprite so he can breathe and lift his head)
    const bx = w * .4, by = h * .9; ctx.save(); ctx.translate(bx, by); ctx.scale(k, k); ctx.translate(-bx, -by);
    if (warm) castShadow(ctx, bx + 80, by + 8, .9, w * 1.2, h * .45, { a: .5, len: 2.6, col: '#1a140c' });
    const bc = warm ? '#2a1a12' : '#0e1220';
    for (const lx of [0, 180]) { roughRect(ctx, bx + lx, by - 70, 8, 70, bc, { amp: .4, seed: lx }); roughRect(ctx, bx + lx - 4, by - 120, 6, 54, bc, { amp: .4, seed: lx + 1 }); }
    roughRect(ctx, bx - 20, by - 96, 230, 8, bc, { amp: .6, seed: 12 }); roughRect(ctx, bx - 20, by - 118, 230, 8, bc, { amp: .6, seed: 13 });
    ctx.restore();
    return c;
  });
}
// the man on the bench (+ newspaper, + paper cup), cached per state; returns {c, x, y} where (x, y) = hip in panel space
export function benchMan(w, h, warm, k) {
  return once(`man:${w}:${warm}`, () => {
    const bx = w * .4, by = h * .9, s = 1.22 * k, pad = Math.ceil(260 * s), [c, g] = layer(pad * 2, pad * 2);
    const P = { lean: .12, head: warm ? -.28 : .42, sh: warm ? [.7, .55] : [.95, .8], el: warm ? [1.2, 1.25] : [.85, .9], hip: [1.5, 1.45], kn: [1.5, 1.42], hair: 'grey', bulk: 1.12, coat: 0 };
    // front seat slat drawn with him so it covers his thighs correctly
    const f = person(g, pad, pad, s, P, { dress: { coat: warm ? '#3a5a4a' : '#2c3448', pants: warm ? '#2a2a34' : '#1c2030', shoes: '#0e0e14', skin: warm ? '#e2b28a' : '#9a8a84', hair: warm ? '#e8e0d2' : '#9a9aa8', hairBack: warm ? '#e8e0d2' : '#9a9aa8' },
      light: warm ? { x: pad + w, y: pad - h * .3, col: HOT, a: .6 } : null, rim: warm ? HOT : null, rimSide: 1, rimW: 2.2 * k, shadeA: warm ? 0 : .15 });
    const [hx, hy] = f.hand(0), q = k;
    if (!warm) roughPoly(g, [[hx - 22 * q, hy - 18 * q], [hx + 14 * q, hy - 26 * q], [hx + 18 * q, hy + 4 * q], [hx - 18 * q, hy + 10 * q]], '#9a9890', { amp: .4, seed: 14 });
    else roughPoly(g, [[hx - 30 * q, hy - 2 * q], [hx + 18 * q, hy - 6 * q], [hx + 20 * q, hy + 8 * q], [hx - 28 * q, hy + 10 * q]], '#e8dcc4', { amp: .5, seed: 14 });
    const seatC = warm ? '#2a1a12' : '#0e1220', ox = pad - (bx + 100 * k), oy = pad - (by - 70 * k);
    roughRect(g, ox + bx - 20 * k, oy + by - 70 * k, 230 * k, 9 * k, seatC, { amp: .6, seed: 11 });
    roughPoly(g, [[ox + bx + 170 * k, oy + by - 82 * k], [ox + bx + 186 * k, oy + by - 82 * k], [ox + bx + 183 * k, oy + by - 100 * k], [ox + bx + 173 * k, oy + by - 100 * k]], warm ? '#e8dcc4' : '#8a8ea0', { amp: .3, seed: 15 });
    return { c, x: bx + 100 * k, y: by - 70 * k, pad };
  });
}
// pigeons + birds + falling leaves of a panel (per frame, cheap)
export function panelLife(ctx, w, h, warm, t, k) {
  const s = w / 800;
  for (const [px, py, sc, ph] of [[w * .3, h * .9, 1, 0], [w * .34, h * .93, .9, 2], [w * .8, h * .92, 1.1, 4]]) {
    const pk = Math.max(0, Math.sin(t * 3 + ph)) ** 6 * 5 * s * sc;
    ctx.fillStyle = warm ? '#4a4040' : '#3a4256'; ctx.beginPath(); ctx.ellipse(px, py, 12 * s * sc, 7 * s * sc, -.2, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(px + 11 * s * sc, py - 6 * s * sc + pk, 4.5 * s * sc, 0, 7); ctx.fill();
    ctx.fillStyle = warm ? '#e58a3a' : '#5a6070'; ctx.fillRect(px + 15 * s * sc, py - 6 * s * sc + pk, 4 * s * sc, 2 * s * sc);
  }
  if (warm) for (const [x, y, sc, ph] of [[.62, .22, 1, 0], [.68, .18, .8, 1.3], [.72, .26, .9, 2.1]]) {
    const xx = w * x + Math.sin(t * .5 + ph) * 20 * s + t * 6 * s % (w * .05), yy = h * y + Math.sin(t * .7 + ph) * 8 * s, f = Math.sin(t * 7 + ph) * 5 * s * sc;
    ctx.strokeStyle = '#2a2020'; ctx.lineWidth = 2 * s * sc; ctx.beginPath(); ctx.moveTo(xx - 12 * s * sc, yy - 3 * s * sc - f); ctx.quadraticCurveTo(xx - 5 * s * sc, yy - 8 * s * sc, xx, yy); ctx.quadraticCurveTo(xx + 5 * s * sc, yy - 8 * s * sc, xx + 12 * s * sc, yy - 4 * s * sc - f); ctx.stroke();
  }
  const r = prng(77), cols = warm ? ['#e58a3a', '#ffb35c', '#c4482a'] : ['#4a5068', '#565a70', '#3e4560'];
  for (let i = 0; i < 14; i++) { const x0 = r() * w * .7, sp = .5 + r(), ph = r() * 7, y = ((r() * h + t * 40 * s * sp) % (h * 1.1)) - h * .05, x = x0 + Math.sin(t * 1.3 + ph) * 30 * s + t * 12 * s % w;
    ctx.fillStyle = rgba(cols[i % 3], .85); ctx.beginPath(); ctx.ellipse(x % w, y, 6 * s, Math.max(.8, Math.abs(Math.sin(t * 2.5 + ph)) * 3.5 * s), t + ph, 0, 7); ctx.fill(); }
}
export function drawPanel(ctx, X, Y, w, h, warm, k, t, a = 1) {
  ctx.save(); if (a < 1) ctx.globalAlpha = a; ctx.translate(X, Y);
  ctx.drawImage(panelScene(w, h, warm, k), 0, 0);
  const m = benchMan(w, h, warm, k), br = 1 + Math.sin(t * 1.9) * .006;
  ctx.save(); ctx.translate(m.x, m.y + 88 * 1.22 * k * .5); ctx.scale(1, br); ctx.drawImage(m.c, -m.pad, -m.pad - 88 * 1.22 * k * .5); ctx.restore();
  panelLife(ctx, w, h, warm, t, k);
  if (!warm) { ctx.fillStyle = rgba('#0a0e1c', .25); ctx.fillRect(0, 0, w, h); }
  ctx.restore();
}

// ===================================================================================== the stamp and the word
// UNEMPLOYED as a rubber stamp in its own canvas: heavy letters, rough frame, ink skips. Returns letter x-ranges
// so the word can fade letter by letter.
export function stampCanvas(s = 'UNEMPLOYED', size = 84, seed = 4) {
  return once(`stamp:${s}:${size}`, () => {
    const [m] = layer(10, 10), mx = m.getContext('2d'); mx.font = `600 ${size}px "Inter"`;
    const sp = size * .08, widths = [...s].map((ch) => mx.measureText(ch).width + sp), tw = widths.reduce((a, b) => a + b, 0);
    const cw = Math.ceil(tw + size * 1.2), ch = Math.ceil(size * 1.9), [c, g] = layer(cw, ch), x0 = size * .6, y0 = ch / 2;
    g.font = `600 ${size}px "Inter"`; g.fillStyle = RED; let x = x0; const ranges = [];
    for (let i = 0; i < s.length; i++) { g.fillText(s[i], x, y0 + size * .36); ranges.push([x - 2, x + widths[i]]); x += widths[i]; }
    g.strokeStyle = RED; g.lineWidth = size * .07; g.beginPath(); roughPath(g, [[x0 - size * .3, y0 - size * .72], [x0 + tw + size * .2, y0 - size * .72], [x0 + tw + size * .2, y0 + size * .62], [x0 - size * .3, y0 + size * .62]], { amp: 2, seed }); g.stroke();
    const d = g.getImageData(0, 0, cw, ch), p = d.data, n = vnoise(seed + 3), r = prng(seed);
    for (let yy = 0; yy < ch; yy++) for (let xx = 0; xx < cw; xx++) { const i = (yy * cw + xx) * 4 + 3; if (!p[i]) continue; const v = n(xx * .05, yy * .05) * .7 + n(xx * .3, yy * .3) * .3; p[i] *= clamp((v - .28) * 3.2) * (r() < .08 ? .3 : 1) * .92; }
    g.putImageData(d, 0, 0);
    return { c, ranges, cw, ch };
  });
}
// draw the stamp centred at x,y, rotated; letters fade by fade(i) (1 = full)
export function drawStamp(ctx, st, x, y, rot, sc, fade = () => 1, a = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc); ctx.translate(-st.cw / 2, -st.ch / 2);
  const f0 = fade(0);
  // the frame goes with the first letter; each letter is a clipped strip of the stamp
  ctx.globalAlpha = a * f0; ctx.save(); ctx.beginPath(); ctx.rect(0, 0, st.ranges[0][0], st.ch); ctx.rect(st.ranges[st.ranges.length - 1][1], 0, st.cw, st.ch); ctx.rect(0, 0, st.cw, st.ch * .2); ctx.rect(0, st.ch * .8, st.cw, st.ch); ctx.clip(); ctx.drawImage(st.c, 0, 0); ctx.restore();
  st.ranges.forEach(([x0, x1], i) => { const f = fade(i); if (f <= 0) return; ctx.globalAlpha = a * f; ctx.save(); ctx.beginPath(); ctx.rect(x0, st.ch * .2, x1 - x0, st.ch * .6); ctx.clip(); ctx.drawImage(st.c, 0, 0); ctx.restore(); });
  ctx.restore();
}
// "retired" in Instrument Serif Italic with glow, cached; reveal(u) draws the left u of it with a pen point
export function retiredCanvas(size = 150) {
  return once('ret:' + size, () => {
    const [m] = layer(10, 10), mx = m.getContext('2d'); mx.font = `${size}px "Instrument Serif Italic"`; const tw = mx.measureText('retired').width;
    const cw = Math.ceil(tw + size), ch = Math.ceil(size * 1.6), [c, g] = layer(cw, ch);
    g.font = `${size}px "Instrument Serif Italic"`; g.fillStyle = HOT; g.fillText('retired', size * .5, ch * .68);
    const [b, bg] = layer(cw, ch); bg.filter = `blur(${size * .12}px)`; bg.drawImage(c, 0, 0);
    const [o, og] = layer(cw, ch); og.globalCompositeOperation = 'lighter'; og.globalAlpha = .8; og.drawImage(b, 0, 0); og.globalAlpha = 1; og.globalCompositeOperation = 'source-over'; og.drawImage(c, 0, 0);
    return { c: o, cw, ch, x0: size * .5, x1: size * .5 + tw };
  });
}
export function drawRetired(ctx, rc, x, y, u, a = 1, sc = 1) {
  if (u <= 0) return; const xr = mix(rc.x0, rc.x1, u);
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.translate(-rc.cw / 2, -rc.ch / 2); ctx.globalAlpha = a;
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, xr, rc.ch); ctx.clip(); ctx.drawImage(rc.c, 0, 0); ctx.restore();
  if (u < 1) { const g = ctx.createRadialGradient(xr, rc.ch * .55, 0, xr, rc.ch * .55, 40); g.addColorStop(0, 'rgba(255,243,221,.9)'); g.addColorStop(1, 'rgba(255,179,92,0)'); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(xr - 40, rc.ch * .55 - 40, 80, 80); }
  ctx.restore();
}

// ===================================================================================== 3.30 · the form
// A cream form on an indigo desk under one lamp. Ruled lines (the bench slats became these), fields, a snapshot clipped on.
export const FM = { x: 380, y: 70, w: 1160, h: 940, snap: [1120, 150, 340, 238] };
export function formPlates() {
  return once('form', () => {
    const [desk, d] = layer();
    { const g = d.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0d1030'); g.addColorStop(1, '#171a44'); d.fillStyle = g; d.fillRect(0, 0, W, H); }
    hatch(d, [0, 0, W, H], { angle: .05, gap: 9, col: '#05061a', a: .25, seed: 3, broken: .5 });
    pool2(d, 960, 520, 1100, 700, { col: '#ffcf8a', a: .3, k: .5, seed: 4 });
    const [paper, p] = layer();
    const { x, y, w, h } = FM;
    p.fillStyle = rgba('#05061a', .5); p.save(); p.filter = 'blur(18px)'; p.fillRect(x + 14, y + 22, w, h); p.restore();
    roughRect(p, x, y, w, h, '#ece4cf', { amp: 1.5, seed: 5 });
    { p.save(); p.beginPath(); p.rect(x, y, w, h); p.clip(); const g = p.createRadialGradient(960, 480, 100, 960, 480, 900); g.addColorStop(0, rgba('#fff6e0', .5)); g.addColorStop(1, rgba('#8a7a60', .35)); p.fillStyle = g; p.fillRect(x, y, w, h);
      hatch(p, [x, y, w, h], { angle: .8, gap: 11, col: '#a89878', a: .08, seed: 6, broken: .6 }); p.restore(); }
    const ink = '#3a3450', faint = '#8f8aa8';
    text(p, 'PERSONAL RECORD', x + 70, y + 92, { size: 22, weight: 600, color: ink, spacing: 6 });
    p.fillStyle = rgba(ink, .8); p.fillRect(x + 70, y + 112, w - 140, 3);
    const field = (lab, yy, x0 = x + 70, x1 = x + w - 70) => { text(p, lab, x0, yy - 12, { size: 15, weight: 600, color: faint, spacing: 4 }); roughLine(p, [[x0, yy], [x1, yy]], { w: 1.6, col: rgba(ink, .55), seed: yy | 0, amp: .3 }); };
    field('NAME', y + 210, x + 70, x + 680); field('DATE OF BIRTH', y + 290, x + 70, x + 680); field('ADDRESS', y + 370, x + 70, x + 680);
    text(p, 'EMPLOYMENT STATUS', x + 70, y + 470, { size: 15, weight: 600, color: faint, spacing: 4 });
    roughRect(p, x + 70, y + 486, w - 140, 190, null, { amp: 1, seed: 7 }); p.strokeStyle = rgba(ink, .5); p.lineWidth = 1.6; p.stroke();
    // ruled lines in the lower half (the slats)
    for (let k = 0; k < 4; k++) roughLine(p, [[x + 70, y + 740 + k * 44], [x + w - 70, y + 740 + k * 44]], { w: 1.2, col: rgba(faint, .7), seed: 40 + k, amp: .3 });
    // handwriting scribbles in the fields
    p.strokeStyle = rgba('#2a3060', .75); p.lineWidth = 2.2; p.lineCap = 'round';
    for (const [yy, len, sd] of [[y + 200, 330, 1], [y + 280, 210, 2]]) { const n = vnoise(sd); p.beginPath(); for (let i = 0; i <= 60; i++) { const q = i / 60, xx = x + 90 + q * len; const yv = yy - 8 + Math.sin(q * 38 + sd) * 7 * n(q * 9, sd) - 6 * Math.abs(Math.sin(q * 13)); i ? p.lineTo(xx, yv) : p.moveTo(xx, yv); } p.stroke(); }
    return { desk, paper };
  });
}
