// A city at blue hour / night as cached parallax layers in the print look: towers with setbacks, water tanks, antennas,
// lit windows (warm and cool), haze at the base, a rim of light on the edges that face a light source, engraved hatch.
// No readable signs, no logos, no machines. Layers are built once (key) and drawn with drawImage; parallax = different offsets.
//
//   cityLayer(o) → canvas    o: { key, seed, w (W + 400), h (H), ground (y of the street line in the layer), hMin, hMax, wMin, wMax,
//                                  col (facade), col2 (second facade tone), haze (colour at the base), hazeH (px),
//                                  win: { p (.12 lit share), warm (.75), size [w, h], gap [x, y], a (1), floors (.25 whole lit floors) },
//                                  rim: { x, y, col, a, w } (light source in layer px: edges facing it light up), tanks (.12), antennas (.15),
//                                  hatch (0..1 engraved vertical lines on the facades), sky (true: tops may touch the light) }
//   skyGradient(o) → canvas  { key, top, mid, low, horizon (y), warm: { x, y, r, col, a } (glow near the horizon), stars (n) }
import { W, H, rgba, clamp, mix, prng, canvas } from '../engine.mjs';
import { stipple, vnoise, fbm } from './art.mjs';

const CACHE = new Map();
const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
function shade(hex, d) { const n = parseInt(hex.slice(1), 16), f = (v) => Math.round(clamp(v * (1 + d), 0, 255)); return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`; }

export function cityLayer(o = {}) {
  return once('city' + (o.key || JSON.stringify(o)), () => {
    const w = o.w ?? W + 400, h = o.h ?? H, r = prng(o.seed ?? 3), ground = o.ground ?? h, [c, g] = canvas(w, h);
    const col = o.col || '#1d2a4a', col2 = o.col2 || col, haze = o.haze || '#5a74a0', win = Object.assign({ p: .12, warm: .75, size: [3, 4], gap: [7, 10], a: 1, floors: .25 }, o.win || {});
    const hMin = o.hMin ?? 80, hMax = o.hMax ?? 380, wMin = o.wMin ?? 40, wMax = o.wMax ?? 140;
    const rim = o.rim, B = [];
    for (let x = -20; x < w + 20;) {
      const bw = wMin + r() * (wMax - wMin), tall = r() < .12 ? 1.5 : 1, bh = (hMin + (hMax - hMin) * Math.pow(r(), 1.6)) * tall;
      B.push({ x, w: bw, h: bh, top: ['flat', 'flat', 'setback', 'setback', 'slant', 'crown'][Math.floor(r() * 6)], tone: r(), tank: r() < (o.tanks ?? .12), ant: r() < (o.antennas ?? .15), seed: Math.floor(r() * 1e6) });
      x += bw * (.78 + r() * .3);
    }
    // back-to-front: taller ones first so the lower ones overlap them a little (depth inside the layer)
    B.sort((a, b) => b.h - a.h);
    for (const b of B) {
      const rr = prng(b.seed), x0 = b.x, x1 = b.x + b.w, y0 = ground - b.h, face = b.tone < .5 ? col : col2;
      const shapeTop = [];
      g.beginPath(); g.moveTo(x0, ground);
      if (b.top === 'setback') { const s1 = b.w * (.14 + rr() * .1), hh = b.h * (.12 + rr() * .1); g.lineTo(x0, y0 + hh); g.lineTo(x0 + s1, y0 + hh); g.lineTo(x0 + s1, y0); g.lineTo(x1 - s1, y0); g.lineTo(x1 - s1, y0 + hh); g.lineTo(x1, y0 + hh); }
      else if (b.top === 'slant') { const up = rr() < .5; g.lineTo(x0, y0 + (up ? b.w * .35 : 0)); g.lineTo(x1, y0 + (up ? 0 : b.w * .35)); }
      else if (b.top === 'crown') { const cw2 = b.w * .3; g.lineTo(x0, y0); g.lineTo(x0 + b.w / 2 - cw2 / 2, y0); g.lineTo(x0 + b.w / 2, y0 - b.w * .45); g.lineTo(x0 + b.w / 2 + cw2 / 2, y0); g.lineTo(x1, y0); }
      else { g.lineTo(x0, y0); g.lineTo(x1, y0); }
      g.lineTo(x1, ground); g.closePath();
      const fg = g.createLinearGradient(0, y0, 0, ground); fg.addColorStop(0, shade(face.startsWith('#') ? face : '#1d2a4a', (b.tone - .5) * .12)); fg.addColorStop(1, face); g.fillStyle = fg; g.fill();
      g.save(); g.clip();
      // windows: a grid, some floors fully lit, warm and cool, a few dim
      const [ww, wh] = win.size, [gx, gy] = win.gap;
      for (let yy = y0 + gy * 1.2; yy < ground - gy; yy += gy) {
        const floorLit = rr() < win.floors * win.p * 3, warmFloor = rr() < win.warm;
        for (let xx = x0 + gx * .6; xx < x1 - ww - 1; xx += gx) {
          const on = floorLit ? rr() < .7 : rr() < win.p; if (!on) continue;
          const warm = floorLit ? warmFloor : rr() < win.warm, a = win.a * (.45 + .55 * rr());
          g.fillStyle = warm ? `rgba(255,${190 + (rr() * 40 | 0)},${120 + (rr() * 40 | 0)},${a})` : `rgba(${200 + (rr() * 30 | 0)},${220 + (rr() * 20 | 0)},255,${a * .8})`;
          g.fillRect(xx, yy, ww, wh);
        }
      }
      if (o.hatch) { g.strokeStyle = `rgba(4,6,16,${.22 * o.hatch})`; g.lineWidth = .7; g.beginPath(); for (let xx = x0 + 1; xx < x1; xx += 3 + rr() * 2) { g.moveTo(xx, y0 - 60); g.lineTo(xx + (rr() - .5) * 2, ground); } g.stroke(); }
      g.restore();
      // rim on the edge that faces the light (strongest high up)
      if (rim) {
        const side = rim.x > (x0 + x1) / 2 ? x1 : x0, d = Math.abs(rim.x - side), k = clamp(1 - d / (rim.reach ?? 1400));
        if (k > 0) { const lg = g.createLinearGradient(0, y0, 0, y0 + b.h * .7); lg.addColorStop(0, rgba(rim.col || '#ffe2b8', (rim.a ?? .7) * k)); lg.addColorStop(1, rgba(rim.col || '#ffe2b8', 0)); g.fillStyle = lg; g.fillRect(side - (side === x1 ? (rim.w ?? 1.6) : 0), y0, rim.w ?? 1.6, b.h * .7); g.fillRect(x0, y0 - .5, b.w, 1.2 * k); }
      }
      if (b.tank) { const tx = x0 + b.w * (.25 + rr() * .4), tw = Math.max(8, b.w * .18), th = tw * 1.1; g.fillStyle = shade('#1a2440', -.2); g.fillRect(tx - tw * .4, y0 - th * .45, 1.5, th * .45); g.fillRect(tx + tw * .4 - 1.5, y0 - th * .45, 1.5, th * .45); g.fillRect(tx - tw / 2, y0 - th * 1.35, tw, th * .9); g.beginPath(); g.moveTo(tx - tw / 2 - 1, y0 - th * 1.35); g.lineTo(tx, y0 - th * 1.75); g.lineTo(tx + tw / 2 + 1, y0 - th * 1.35); g.closePath(); g.fill(); }
      if (b.ant) { g.strokeStyle = shade('#1a2440', -.1); g.lineWidth = 1.2; const ax = x0 + b.w * (.3 + rr() * .4), ah = 18 + rr() * 50; g.beginPath(); g.moveTo(ax, y0 - (b.top === 'crown' ? b.w * .45 : 0)); g.lineTo(ax, y0 - ah - (b.top === 'crown' ? b.w * .45 : 0)); g.stroke(); if (rr() < .6) { g.fillStyle = 'rgba(255,90,70,.8)'; g.fillRect(ax - 1.2, y0 - ah - 2 - (b.top === 'crown' ? b.w * .45 : 0), 2.4, 2.4); } }
    }
    // haze at the base: the street glow and the evening air
    const hz = o.hazeH ?? 160, hg = g.createLinearGradient(0, ground - hz, 0, ground); hg.addColorStop(0, rgba(haze, 0)); hg.addColorStop(1, rgba(haze, o.hazeA ?? .75));
    g.globalCompositeOperation = 'source-atop'; g.fillStyle = hg; g.fillRect(0, ground - hz, w, hz); g.globalCompositeOperation = 'source-over';
    stipple(c, { k: .25, g: 1, seed: (o.seed ?? 3) + 5, mid: false, boost: 1 });
    return c;
  });
}
export function skyGradient(o = {}) {
  return once('sky' + (o.key || JSON.stringify(o)), () => {
    const [c, g] = canvas(o.w ?? W + 200, o.h ?? H), hz = o.horizon ?? H * .62;
    const lg = g.createLinearGradient(0, 0, 0, hz); lg.addColorStop(0, o.top || '#0a1032'); lg.addColorStop(.55, o.mid || '#1b2a58'); lg.addColorStop(1, o.low || '#4b6694');
    g.fillStyle = lg; g.fillRect(0, 0, c.width, c.height);
    if (o.warm) { const { x, y, r, col = '#f2c9a0', a = .5 } = o.warm, rg = g.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, rgba(col, a)); rg.addColorStop(.5, rgba(col, a * .3)); rg.addColorStop(1, rgba(col, 0)); g.save(); g.translate(0, y); g.scale(1, .55); g.translate(0, -y); g.fillStyle = rg; g.fillRect(-10, -c.height * 4, c.width + 20, c.height * 9); g.restore(); }
    const r = prng(o.seed ?? 9); for (let i = 0; i < (o.stars ?? 80); i++) { const x = r() * c.width, y = r() * hz * .7, a = (.15 + .5 * r()) * (1 - y / (hz * .7)); g.fillStyle = `rgba(230,236,255,${a})`; g.fillRect(x, y, r() < .9 ? 1.2 : 2, r() < .9 ? 1.2 : 2); }
    // a few long stratus strands (soft)
    const n = vnoise((o.seed ?? 9) + 3); g.globalAlpha = .07; for (let k = 0; k < (o.strands ?? 3); k++) { const y = hz * (.25 + r() * .55), th = 6 + r() * 14; g.fillStyle = k % 2 ? '#8ea4cc' : '#6f86b4'; g.beginPath(); g.moveTo(0, y); for (let x = 0; x <= c.width; x += 30) g.lineTo(x, y + (fbm(n, x * .002, k, 3) - .5) * 40); for (let x = c.width; x >= 0; x -= 30) g.lineTo(x, y + th * (.5 + fbm(n, x * .004, k + 9, 3)) + (fbm(n, x * .002, k, 3) - .5) * 40); g.closePath(); g.fill(); }
    g.globalAlpha = 1;
    stipple(c, { k: .3, g: 1, seed: (o.seed ?? 9) + 1, mid: false, boost: 1 });
    return c;
  });
}
