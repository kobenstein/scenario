// C10 · the two places: Manila at dawn (6.20), Ohio at dusk (6.21), and both side by side (6.24).
// Every static layer is cached once (prng, deterministic); per frame only parallax offsets, the figures, the vehicle,
// the light that changes (sun, sodium lamps), exhaust and motes are drawn.
//   manila(ctx, t, o)  o: { t0 (shot start), walk: [x0, x1, tA, tB] (her path), dawn (accent time), cam }
//   ohio(ctx, t, o)    o: { t0, lampOn (time the sodium lamps come on), push: [tA, tB] (camera drifts to the dusk band) }
//   split(ctx, t, o)   o: { t0, down (heads to the phones), up (look up), swirl: [tA, tB] (paper fragments), lift (fragment rises) }
//   MANILA_SUN, OHIO_GLOW   the screen points of the two key lights (for carriers and push-ins)
import { W, H, rgba, clamp, lin, mix, sm, eout, eio, prng, drift, canvas } from '../engine.mjs';
import { stipple, vnoise, fbm, fog, cone, hatch as artHatch, roughPath, castShadow } from './art.mjs';
import { figure, walk, POSES } from './figure.mjs';
import { cityLayer } from './city.mjs';
import { ring } from './certificate.mjs';
import { paperSwarm } from './paperswarm.mjs';

const CACHE = new Map(); const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
export const expoOut = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(x)));
export const expoIn = (x) => (x <= 0 ? 0 : Math.pow(2, 10 * clamp(x) - 10));
export const quart = (x) => { x = clamp(x); return x < .5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2; };
const TAU = Math.PI * 2;
export const MANILA_SUN = { x: 1560, y: 650 }, OHIO_GLOW = { x: 330, y: 640 };
const PADW = W + 360;

// ---------------------------------------------------------------- shared bits
function sagWire(g, x0, y0, x1, y1, sag) { g.beginPath(); for (let i = 0; i <= 40; i++) { const q = i / 40; const x = mix(x0, x1, q), y = mix(y0, y1, q) + Math.sin(Math.PI * q) * sag; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
function vgrad(g, w, h, stops) { const lg = g.createLinearGradient(0, 0, 0, h); for (const [p, c] of stops) lg.addColorStop(p, c); g.fillStyle = lg; g.fillRect(0, 0, w, h); }
function cloudBand(g, y, x0, x1, th, seed, top, under, a) {
  const n = vnoise(seed); g.save(); g.globalAlpha = a; g.beginPath(); g.moveTo(x0, y);
  for (let x = x0; x <= x1; x += 14) g.lineTo(x, y - th * (.35 + .65 * fbm(n, x * .004, seed, 3)) * Math.sin(Math.PI * (x - x0) / (x1 - x0)));
  for (let x = x1; x >= x0; x -= 14) g.lineTo(x, y + th * .25 * fbm(n, x * .006, seed + 3, 2));
  g.closePath(); const lg = g.createLinearGradient(0, y - th, 0, y + th * .3); lg.addColorStop(0, top); lg.addColorStop(1, under); g.fillStyle = lg; g.fill();
  g.clip(); artHatch(g, [x0, y - th, x1 - x0, th * 1.5], { angle: -.04, gap: 4, w: .8, col: under, a: .35, seed, broken: .3 }); g.restore();
}
function motes(ctx, t, x0, y0, w, h, n, seed, col, a, drift0 = [12, -4]) {
  const r = prng(seed); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) { const sp = .4 + r(), x = x0 + ((r() * w + t * drift0[0] * sp) % w + w) % w, y = y0 + ((r() * h + t * drift0[1] * sp + Math.sin(t * .7 + i) * 8) % h + h) % h, s = r() < .85 ? 1.3 : 2.4;
    ctx.fillStyle = rgba(col, a * (.25 + .75 * r()) * (.6 + .4 * Math.sin(t * 1.3 + i * 2.1))); ctx.fillRect(x, y, s, s); }
  ctx.restore();
}
function lightSprite(key, r, stops) { return once(key, () => { const [c, g] = canvas(r * 2, r * 2), rg = g.createRadialGradient(r, r, 0, r, r, r); for (const [p, col] of stops) rg.addColorStop(p, col); g.fillStyle = rg; g.fillRect(0, 0, r * 2, r * 2); stipple(c, { k: .7, g: 1.2, seed: r }); return c; }); }

// ---------------------------------------------------------------- 6.20 Manila at dawn
function mnlRays() {
  return once('mnl-rays', () => { const [c, g] = canvas(W, H), r = prng(21), sx = MANILA_SUN.x, sy = MANILA_SUN.y;
    g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 26; i++) { const a = -Math.PI + .15 + r() * (Math.PI - .3), w = .02 + r() * .05, L = 900 + r() * 900, lg = g.createRadialGradient(sx, sy, 40, sx, sy, L);
      lg.addColorStop(0, `rgba(255,226,186,${.10 + r() * .12})`); lg.addColorStop(1, 'rgba(255,200,150,0)'); g.fillStyle = lg; g.beginPath(); g.moveTo(sx, sy); g.arc(sx, sy, L, a - w, a + w); g.closePath(); g.fill(); }
    g.filter = 'blur(6px)'; g.drawImage(c, 0, 0); g.filter = 'none'; return c; });
}
function mnlSky() {
  return once('mnl-sky', () => {
    const [c, g] = canvas(PADW, H);
    vgrad(g, PADW, H, [[0, '#2a2858'], [.2, '#58507e'], [.36, '#b07f98'], [.47, '#eea58c'], [.57, '#f8c69e'], [1, '#f4b48e']]);
    const sx = MANILA_SUN.x + 180, sy = MANILA_SUN.y;
    const sg = g.createRadialGradient(sx, sy, 0, sx, sy, 900); sg.addColorStop(0, 'rgba(255,236,200,.95)'); sg.addColorStop(.08, 'rgba(255,214,170,.7)'); sg.addColorStop(.35, 'rgba(250,170,130,.25)'); sg.addColorStop(1, 'rgba(250,160,130,0)'); g.fillStyle = sg; g.fillRect(0, 0, PADW, H);
    cloudBand(g, 300, 120, 1300, 34, 3, 'rgba(190,140,170,.9)', 'rgba(250,190,160,.9)', .55);
    cloudBand(g, 380, 900, 2200, 26, 5, 'rgba(210,150,160,.9)', 'rgba(255,205,170,.95)', .6);
    cloudBand(g, 210, 1300, 2240, 22, 8, 'rgba(120,100,150,.9)', 'rgba(230,160,160,.8)', .45);
    stipple(c, { k: .35, g: 1, seed: 12, mid: false, boost: 1 });
    return c;
  });
}
function mnlFar() { return cityLayer({ key: 'mnl-far', seed: 41, w: PADW, ground: 690, hMin: 50, hMax: 300, wMin: 26, wMax: 80, col: '#8f7593', col2: '#9c7f98', haze: '#f0b49a', hazeH: 180, hazeA: .95, win: { p: .02, size: [1.6, 2.2], gap: [5, 7], a: .5 }, rim: { x: MANILA_SUN.x + 180, y: MANILA_SUN.y, col: '#ffe0c0', a: .45, reach: 700 }, antennas: .2, tanks: .05 }); }
function mnlHaze() { return once('mnl-haze', () => { const [c, g] = canvas(PADW, H); fog(g, { y0: 520, y1: 820, col: '#ffcfb0', a: .42, seed: 7, sx: .0018, sy: .012, cover: .62, soft: .4, k: .5, x1: PADW }); return c; }); }
// low-rise street: 2–4 storeys, balconies, corrugated roofs, blue water tanks, shutters, blank sign boards, grilles
function mnlStreet() {
  return once('mnl-street', () => {
    const [c, g] = canvas(PADW, H), r = prng(17), ground = 842, walls = ['#6e5c6c', '#5f5568', '#77606c', '#665a72', '#5a5064', '#705c64'];
    let x = -40;
    while (x < PADW + 40) {
      const w = 150 + r() * 210, fl = 2 + Math.floor(r() * 3), fh = 70 + r() * 16, h = fl * fh + 30, top = ground - h, wall = walls[Math.floor(r() * walls.length)];
      g.fillStyle = wall; g.fillRect(x, top, w, h);
      // light from the low sun on the right: the right edge and the top lit, the left in shade
      const lg = g.createLinearGradient(x, 0, x + w, 0); lg.addColorStop(0, 'rgba(20,14,34,.35)'); lg.addColorStop(.7, 'rgba(20,14,34,0)'); lg.addColorStop(1, 'rgba(255,200,160,.18)'); g.fillStyle = lg; g.fillRect(x, top, w, h);
      g.fillStyle = 'rgba(255,214,176,.55)'; g.fillRect(x + w - 2.5, top, 2.5, h); g.fillRect(x, top, w, 2);
      // roof: corrugated sheet (slant) or a parapet with a water tank
      if (r() < .5) { g.fillStyle = '#4a4252'; g.beginPath(); g.moveTo(x - 8, top + 4); g.lineTo(x + w + 8, top - 18); g.lineTo(x + w + 8, top - 10); g.lineTo(x - 8, top + 12); g.closePath(); g.fill(); g.strokeStyle = 'rgba(255,220,190,.25)'; g.lineWidth = 1; for (let k = 0; k < w; k += 7) { g.beginPath(); g.moveTo(x + k, top + 4 - k / w * 22); g.lineTo(x + k, top + 11 - k / w * 22); g.stroke(); } }
      else { g.fillStyle = '#4e4658'; g.fillRect(x - 3, top - 10, w + 6, 12); if (r() < .7) { const tx = x + 20 + r() * (w - 70); g.fillStyle = '#3f5a86'; g.beginPath(); g.ellipse(tx + 20, top - 32, 20, 24, 0, 0, TAU); g.fill(); g.fillRect(tx, top - 32, 40, 22); g.fillStyle = 'rgba(255,220,190,.4)'; g.fillRect(tx + 37, top - 50, 2.5, 40); g.fillStyle = '#2c2a3a'; g.fillRect(tx + 6, top - 12, 4, 6); g.fillRect(tx + 30, top - 12, 4, 6); } }
      // floors: windows with grilles, a balcony rail now and then; ground floor: a rolled shutter or an open shop with a warm light
      for (let f = 0; f < fl; f++) {
        const fy = top + 22 + f * fh, nw = Math.max(1, Math.floor(w / 70));
        for (let k = 0; k < nw; k++) {
          const wx = x + 14 + k * (w - 20) / nw, ww = (w - 20) / nw - 18, lit = r() < .18;
          g.fillStyle = lit ? `rgba(255,${190 + r() * 40 | 0},130,.85)` : 'rgba(26,20,38,.75)'; g.fillRect(wx, fy, ww, fh * .5);
          g.strokeStyle = 'rgba(30,24,40,.8)'; g.lineWidth = 1.2; for (let gx = wx + 6; gx < wx + ww; gx += 7) { g.beginPath(); g.moveTo(gx, fy); g.lineTo(gx, fy + fh * .5); g.stroke(); }
        }
        if (r() < .45) { g.fillStyle = 'rgba(30,24,40,.85)'; g.fillRect(x + 4, fy + fh * .62, w - 8, 3); for (let bx = x + 8; bx < x + w - 6; bx += 9) g.fillRect(bx, fy + fh * .62, 1.6, fh * .3); g.fillRect(x + 4, fy + fh * .9, w - 8, 2); }
      }
      const gy = ground - 64;
      if (r() < .5) { g.fillStyle = '#3d3846'; g.fillRect(x + 10, gy, w - 20, 64); g.strokeStyle = 'rgba(255,230,200,.12)'; g.lineWidth = 1; for (let sy2 = gy + 4; sy2 < ground; sy2 += 5) { g.beginPath(); g.moveTo(x + 10, sy2); g.lineTo(x + w - 10, sy2); g.stroke(); } }
      else { g.fillStyle = 'rgba(255,190,120,.75)'; g.fillRect(x + 12, gy + 6, w - 24, 58); g.fillStyle = 'rgba(40,24,30,.55)'; for (let k = 0; k < 4; k++) g.fillRect(x + 20 + k * (w - 40) / 4, gy + 20 + (k % 2) * 8, 10, 40); }
      // a blank sign board above the ground floor (no readable text)
      if (r() < .55) { const bw = w * (.5 + r() * .35), bx = x + (w - bw) / 2; g.fillStyle = ['#c9a86a', '#b56a52', '#d8c9a8', '#7a8fa8'][Math.floor(r() * 4)]; g.fillRect(bx, gy - 30, bw, 24); g.fillStyle = 'rgba(30,20,30,.35)'; for (let k = 0; k < 5; k++) g.fillRect(bx + 10 + k * bw / 5.5, gy - 23, bw / 9, 9); }
      // engraved shade on the left half of the facade
      g.save(); g.beginPath(); g.rect(x, top, w * .55, h); g.clip(); artHatch(g, [x, top, w, h], { angle: -1.05, gap: 4.2, w: .8, col: '#120c1e', a: .22, seed: x | 0, broken: .3 }); g.restore();
      x += w + (r() < .3 ? 6 + r() * 18 : 0);
    }
    // street and the near sidewalk, wet from the night: the sky glints in it
    const sg = g.createLinearGradient(0, ground, 0, H); sg.addColorStop(0, '#3c3348'); sg.addColorStop(.3, '#2a2336'); sg.addColorStop(1, '#17121f'); g.fillStyle = sg; g.fillRect(0, ground, PADW, H - ground);
    const gl = g.createRadialGradient(MANILA_SUN.x + 180, ground + 30, 0, MANILA_SUN.x + 180, ground + 30, 900); gl.addColorStop(0, 'rgba(255,200,160,.42)'); gl.addColorStop(1, 'rgba(255,200,160,0)'); g.save(); g.translate(0, ground); g.scale(1, .18); g.translate(0, -ground); g.fillStyle = gl; g.fillRect(0, ground - 400, PADW, 1800); g.restore();
    g.fillStyle = '#4a3f52'; g.fillRect(0, 916, PADW, 8); g.fillStyle = 'rgba(255,214,180,.45)'; g.fillRect(0, 916, PADW, 1.6);   // curb
    const pg = g.createLinearGradient(0, 924, 0, H); pg.addColorStop(0, '#3a3140'); pg.addColorStop(1, '#1a141f'); g.fillStyle = pg; g.fillRect(0, 924, PADW, H - 924);
    g.strokeStyle = 'rgba(0,0,0,.3)'; g.lineWidth = 1; for (let k = -20; k < 40; k++) { g.beginPath(); g.moveTo(k * 90, 924); g.lineTo(k * 90 - 120, H); g.stroke(); }
    const rr = prng(4); for (let i = 0; i < 2200; i++) { const px = rr() * PADW, py = ground + Math.pow(rr(), .8) * (H - ground); g.fillStyle = rr() < .5 ? 'rgba(255,220,190,.06)' : 'rgba(0,0,0,.18)'; g.fillRect(px, py, 1.4, 1.4); }
    stipple(c, { k: .25, g: 1, seed: 21, mid: false, boost: 1 });
    return c;
  });
}
// poles and the tangle of wires (Manila's sky is crossed by them); returns the wire curves for the dawn glint
function mnlWires() {
  return once('mnl-wires', () => {
    const [c, g] = canvas(PADW, H), r = prng(29), poles = [180, 980, 1780], wires = [];
    for (const px of poles) {
      g.fillStyle = '#1b1624'; g.fillRect(px - 7, 250, 14, 700); g.fillStyle = 'rgba(255,214,176,.4)'; g.fillRect(px + 5, 250, 2, 700);
      for (const cy of [290, 330]) { g.fillStyle = '#1b1624'; g.fillRect(px - 90, cy, 180, 8); }
      g.fillStyle = '#262131'; g.beginPath(); g.roundRect(px + 14, 360, 34, 58, 6); g.fill(); g.fillStyle = 'rgba(255,214,176,.35)'; g.fillRect(px + 45, 362, 2, 54);
    }
    g.lineCap = 'round';
    for (let i = 0; i < 9; i++) {
      const y0 = 292 + (i % 5) * 9 + r() * 30, y1 = y0 + (r() - .5) * 40, sag = 40 + r() * 60, w = .9 + r() * 1.6;
      g.strokeStyle = `rgba(22,17,30,${.75 + r() * .25})`; g.lineWidth = w;
      for (let k = 0; k < poles.length + 1; k++) { const xa = k ? poles[k - 1] : -200, xb = k < poles.length ? poles[k] : PADW + 200; sagWire(g, xa, k ? y0 : y0 - 20, xb, y1, sag); }
      if (i === 2) for (let k = 0; k < poles.length + 1; k++) { const xa = k ? poles[k - 1] : -200, xb = k < poles.length ? poles[k] : PADW + 200; const pts = []; for (let j = 0; j <= 40; j++) { const q = j / 40; pts.push([mix(xa, xb, q), mix(k ? y0 : y0 - 20, y1, q) + Math.sin(Math.PI * q) * sag]); } wires.push(...pts); }
    }
    // a bundle of cables looping down from a pole
    g.strokeStyle = 'rgba(20,16,28,.85)'; g.lineWidth = 2.2; for (let k = 0; k < 5; k++) { g.beginPath(); g.moveTo(980, 340 + k * 3); g.bezierCurveTo(1040, 470 + k * 8, 1120, 470 + k * 6, 1200, 380 + k * 4); g.stroke(); }
    wires.sort((p, q) => p[0] - q[0]);
    return { c, wires };
  });
}
function jeepney() {
  return once('jeepney', () => {
    const w = 600, h = 250, [c, g] = canvas(w, h);
    // body: long, boxy, a rounded bonnet at the front (right), chrome flanks with painted stripes, a roof rack
    g.fillStyle = '#8f8a92'; g.beginPath(); g.moveTo(20, 196); g.lineTo(20, 70); g.quadraticCurveTo(22, 54, 40, 52); g.lineTo(470, 52); g.quadraticCurveTo(488, 54, 490, 74); g.lineTo(492, 112); g.lineTo(560, 120); g.quadraticCurveTo(586, 126, 588, 150); g.lineTo(588, 196); g.closePath(); g.fill();
    const bg = g.createLinearGradient(0, 52, 0, 196); bg.addColorStop(0, 'rgba(255,230,210,.35)'); bg.addColorStop(.45, 'rgba(255,255,255,0)'); bg.addColorStop(1, 'rgba(20,10,30,.45)'); g.fillStyle = bg; g.fill();
    for (const [y, col] of [[128, '#b5523f'], [138, '#d9a24a'], [148, '#3f6f8f']]) { g.fillStyle = col; g.fillRect(24, y, 462, 6); }
    // windows (open sides) with passenger silhouettes
    g.fillStyle = '#231b2c'; g.fillRect(40, 66, 430, 52); for (let k = 0; k < 7; k++) { g.fillStyle = '#3a2e3c'; g.beginPath(); g.ellipse(70 + k * 58, 92, 11, 13, 0, 0, TAU); g.fill(); g.fillRect(58 + k * 58, 102, 24, 16); }
    g.fillStyle = '#8f8a92'; for (let k = 0; k <= 7; k++) g.fillRect(36 + k * 62, 64, 6, 56);
    g.fillStyle = 'rgba(255,214,176,.6)'; g.fillRect(40, 52, 430, 2);
    g.fillStyle = '#5a5560'; g.fillRect(30, 40, 450, 10); for (let k = 0; k < 9; k++) g.fillRect(40 + k * 52, 30, 4, 12);
    g.fillStyle = '#c9c4cc'; g.fillRect(548, 150, 40, 22); g.fillStyle = '#ffe8c0'; g.beginPath(); g.ellipse(578, 140, 8, 6, 0, 0, TAU); g.fill();   // grille, lamp
    g.fillStyle = '#6a5f6e'; g.beginPath(); g.moveTo(492, 112); g.lineTo(512, 74); g.lineTo(560, 120); g.closePath(); g.fill();                         // windscreen
    g.fillStyle = '#d9a24a'; g.beginPath(); g.moveTo(540, 112); g.lineTo(552, 80); g.lineTo(560, 112); g.closePath(); g.fill();                         // a small bonnet ornament
    g.fillStyle = '#17121c'; for (const wx of [110, 470]) { g.beginPath(); g.arc(wx, 196, 30, 0, TAU); g.fill(); }
    // what makes it a jeepney: chrome, a painted skirt, the long jeep bonnet with a tall grille and twin lamps, silver horses on the
    // bonnet, an open rear entrance with a step and a grab bar, amber lights along the roof lip
    { const hg = g.createLinearGradient(0, 56, 0, 70); hg.addColorStop(0, 'rgba(255,246,236,.75)'); hg.addColorStop(1, 'rgba(255,246,236,0)'); g.fillStyle = hg; g.fillRect(24, 54, 462, 16); }
    { const sk = g.createLinearGradient(24, 0, 488, 0); ['#c8442f', '#e0a23a', '#2f7c80', '#c8442f', '#e0a23a'].forEach((col, i) => sk.addColorStop(i / 4, col)); g.fillStyle = sk; g.fillRect(24, 158, 462, 30);
      g.fillStyle = 'rgba(255,240,220,.85)'; for (let x = 34; x < 480; x += 26) { g.beginPath(); g.moveTo(x, 173); g.lineTo(x + 7, 166); g.lineTo(x + 14, 173); g.lineTo(x + 7, 180); g.closePath(); g.fill(); }
      g.fillStyle = 'rgba(255,250,240,.7)'; g.fillRect(24, 156, 462, 2.5); g.fillRect(24, 188, 462, 2.5); }
    g.fillStyle = '#a9a4ae'; g.beginPath(); g.moveTo(492, 118); g.lineTo(574, 124); g.quadraticCurveTo(592, 128, 594, 146); g.lineTo(594, 190); g.lineTo(492, 190); g.closePath(); g.fill();
    { const bg2 = g.createLinearGradient(0, 118, 0, 190); bg2.addColorStop(0, 'rgba(255,246,236,.6)'); bg2.addColorStop(.3, 'rgba(255,255,255,0)'); bg2.addColorStop(1, 'rgba(20,10,30,.4)'); g.fillStyle = bg2; g.fill(); }
    g.fillStyle = '#d8d3dc'; g.fillRect(578, 134, 18, 50); g.fillStyle = '#6a6470'; for (let y = 138; y < 182; y += 6) g.fillRect(580, y, 14, 2.5);
    g.fillStyle = '#fff0d0'; for (const ly of [140, 168]) { g.beginPath(); g.arc(592, ly, 7, 0, TAU); g.fill(); }
    g.fillStyle = '#e6e2ea'; g.fillRect(486, 190, 112, 9); g.fillStyle = 'rgba(255,255,255,.8)'; g.fillRect(486, 190, 112, 2);   // chrome bumper
    for (const hx of [530, 556]) { g.fillStyle = '#e9e5ee'; g.beginPath(); g.moveTo(hx, 122); g.lineTo(hx + 2, 104); g.lineTo(hx + 8, 96); g.lineTo(hx + 12, 99); g.lineTo(hx + 8, 104); g.lineTo(hx + 14, 108); g.lineTo(hx + 12, 122); g.closePath(); g.fill(); }   // silver horses
    g.fillStyle = '#120e18'; g.fillRect(8, 70, 16, 126); g.fillStyle = '#d8d3dc'; g.fillRect(14, 76, 3, 110); g.fillStyle = '#4a4450'; g.fillRect(2, 190, 30, 8);   // open rear, grab bar, step
    for (let x = 44; x < 478; x += 36) { g.fillStyle = '#ffb35c'; g.beginPath(); g.arc(x, 51, 2.6, 0, TAU); g.fill(); }
    g.fillStyle = '#c9c4cc'; for (const wx of [110, 470]) { g.beginPath(); g.arc(wx, 196, 12, 0, TAU); g.fill(); }
    stipple(c, { k: .3, g: 1, seed: 5, mid: false, boost: 1 });
    return c;
  });
}
function wheel(ctx, x, y, r, rot) { ctx.fillStyle = '#17121c'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.fillStyle = '#6d6672'; ctx.beginPath(); ctx.arc(x, y, r * .42, 0, TAU); ctx.fill(); ctx.strokeStyle = '#2a2430'; ctx.lineWidth = 2.4; for (let k = 0; k < 5; k++) { const a = rot + k * TAU / 5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * r * .4, y + Math.sin(a) * r * .4); ctx.stroke(); } }
export function manila(ctx, t, o = {}) {
  const t0 = o.t0 ?? 0, lt = t - t0, dawn = o.dawn ?? t0 + 2, lift = sm(lin(dawn - .4, dawn + 1.2, t)), cam = { x: drift(t, 5, 1) + lt * 6, y: drift(t, 3, 2) };
  const sun = .75 + .25 * lift;
  const P = (k) => cam.x * k;
  ctx.drawImage(mnlSky(), -180 - P(.08), cam.y * .1);
  // the sun pushes through the haze (the hero light); on "dawn" it breaks clear
  { const B = lightSprite('mnl-sun', 520, [[0, 'rgba(255,246,226,1)'], [.05, 'rgba(255,226,186,.85)'], [.22, 'rgba(255,190,140,.3)'], [1, 'rgba(255,170,130,0)']]); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .45 + .5 * lift; ctx.drawImage(B, MANILA_SUN.x - P(.1) - 520, MANILA_SUN.y - 520 + cam.y * .1); ctx.restore(); }
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .25 + .55 * lift; ctx.translate(MANILA_SUN.x - P(.1), MANILA_SUN.y); ctx.rotate(.02 * Math.sin(t * .3)); ctx.drawImage(mnlRays(), -MANILA_SUN.x, -MANILA_SUN.y); ctx.restore();
  ctx.drawImage(mnlFar(), -180 - P(.2), cam.y * .2);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .9; ctx.drawImage(mnlHaze(), -180 - P(.3) - lt * 4, cam.y * .3); ctx.restore();
  // on "dawn" the peach light floods the street: a warm wash from the sun side
  { const wg = ctx.createRadialGradient(MANILA_SUN.x, MANILA_SUN.y, 0, MANILA_SUN.x, MANILA_SUN.y, 1500); wg.addColorStop(0, `rgba(255,200,150,${.22 + .2 * lift})`); wg.addColorStop(.5, `rgba(255,170,130,${.06 + .08 * lift})`); wg.addColorStop(1, 'rgba(255,160,120,0)'); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = wg; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  // the jeepney passes on the street behind her (moving right, faster than her)
  const jx = mix(-700, 2100, eio(lin(t0 + .2, t0 + 3.6, t))), jy = 846 - 250 + 4 + Math.sin(t * 19) * .8;
  ctx.drawImage(mnlStreet(), -180 - P(.55), cam.y * .55);
  if (jx > -620 && jx < W + 20) { const J = jeepney(); ctx.save(); ctx.globalAlpha = .96; ctx.drawImage(J, jx - P(.55), jy); const rot = jx * .03; wheel(ctx, jx - P(.55) + 110, jy + 196, 28, rot); wheel(ctx, jx - P(.55) + 470, jy + 196, 28, rot); ctx.restore();
    // its headlamp and a warm reflection in the wet street
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const hx = jx - P(.55) + 586, hy = jy + 140, hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, 140); hg.addColorStop(0, 'rgba(255,236,200,.55)'); hg.addColorStop(1, 'rgba(255,220,180,0)'); ctx.fillStyle = hg; ctx.fillRect(hx - 140, hy - 140, 280, 280); ctx.restore(); }
  const Wr = mnlWires(); ctx.drawImage(Wr.c, -180 - P(.7), cam.y * .7);
  // the light thread (c09>c10) lands on the wire and runs right: the dawn catches the wire
  { const g0 = o.glint ?? t0, u = (t - g0) / 2.2; if (u > 0 && u < 1.2) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
      const pts = Wr.wires[0][0] > Wr.wires[Wr.wires.length - 1][0] ? [...Wr.wires].reverse() : Wr.wires, n = pts.length, head = Math.floor(clamp(u) * (n - 1)), tail = Math.max(0, head - 90), fade = 1 - clamp((u - .9) / .3);
      for (const [lw, a] of [[10, .08], [4, .22], [1.6, .9]]) { ctx.strokeStyle = rgba(lw > 2 ? '#ffb35c' : '#fff1d6', a * fade); ctx.lineWidth = lw; ctx.beginPath(); for (let i = tail; i <= head; i++) { const [x, y] = pts[i]; i === tail ? ctx.moveTo(x - 180 - P(.7), y + cam.y * .7) : ctx.lineTo(x - 180 - P(.7), y + cam.y * .7); } ctx.stroke(); }
      const [hx, hy] = pts[head]; const hg = ctx.createRadialGradient(hx - 180 - P(.7), hy, 0, hx - 180 - P(.7), hy, 60); hg.addColorStop(0, `rgba(255,241,214,${.8 * fade})`); hg.addColorStop(1, 'rgba(255,179,92,0)'); ctx.fillStyle = hg; ctx.fillRect(hx - 240 - P(.7), hy - 60, 120, 120); ctx.restore(); } }
  // her: walking home after the night shift, petrol scrubs, tired round shoulders, head a little down; toward the sun
  const [x0, x1, tA, tB] = o.walk || [600, 1010, t0, t0 + 3.4], q = clamp((t - tA) / (tB - tA)), fx = mix(x0, x1, q) - P(1) * .2, fy = 820, s = 2.15;
  const ph = (mix(x0, x1, q) - x0) / 262 * TAU + 1.1, pose = walk(ph); pose.lean = .07; pose.head = .2 - .12 * lift; pose.sh = [pose.sh[0] * .7 + .04, pose.sh[1] * .7 + .04];
  castShadow(ctx, fx, fy + 88 * s, s, MANILA_SUN.x + 300, MANILA_SUN.y - 60, { a: .4, len: 2.2 });
  figure(ctx, fx, fy, s, pose, { t, seed: 3, dress: { coat: '#2f7c80', pants: '#245d63', shoes: '#151219', skin: '#a8734f', hair: '#1a1114' }, accentPart: 'coat', light: { x: MANILA_SUN.x, y: MANILA_SUN.y, col: '#ffd2a8', a: .45 + .2 * lift }, rim: '#ffd9b4', rimSide: 1, rimW: 2.6, prop: (g, front) => { g.fillStyle = '#4a3a30'; g.beginPath(); g.roundRect(front.hx - 6, front.hy - 2, 15, 22, 3); g.fill(); } });
  // humid air: motes in the sun, a warm bloom over everything near the sun
  motes(ctx, t, 0, 300, W, 700, 90, 7, '#ffe2c4', .5 * sun);
  { const vg = ctx.createRadialGradient(MANILA_SUN.x, MANILA_SUN.y, 200, MANILA_SUN.x, MANILA_SUN.y, 1500); vg.addColorStop(0, 'rgba(20,12,30,0)'); vg.addColorStop(1, 'rgba(20,12,30,.5)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H); }
  return { her: [fx, fy - 120 * s * .5] };
}

// ---------------------------------------------------------------- 6.21 Ohio at dusk
function ohSky() {
  return once('oh-sky', () => {
    const [c, g] = canvas(PADW, H);
    vgrad(g, PADW, H, [[0, '#171331'], [.28, '#2f2148'], [.47, '#6e3456'], [.58, '#c45a4e'], [.64, '#f08a4b'], [.68, '#ffb36b'], [1, '#e07a42']]);
    const sx = OHIO_GLOW.x + 180, sy = OHIO_GLOW.y + 40, sg = g.createRadialGradient(sx, sy, 0, sx, sy, 1100); sg.addColorStop(0, 'rgba(255,214,150,.9)'); sg.addColorStop(.12, 'rgba(255,170,100,.45)'); sg.addColorStop(.5, 'rgba(240,120,80,.12)'); sg.addColorStop(1, 'rgba(240,120,80,0)'); g.fillStyle = sg; g.fillRect(0, 0, PADW, H);
    cloudBand(g, 420, 0, 1500, 30, 13, 'rgba(110,50,80,.95)', 'rgba(255,150,90,.9)', .7);
    cloudBand(g, 330, 700, 2240, 40, 15, 'rgba(70,36,80,.95)', 'rgba(230,110,90,.85)', .6);
    cloudBand(g, 520, 1200, 2240, 16, 19, 'rgba(120,56,80,.9)', 'rgba(255,170,110,.9)', .5);
    const r = prng(3); for (let i = 0; i < 60; i++) { const x = r() * PADW, y = Math.pow(r(), 1.8) * 300; g.fillStyle = `rgba(230,220,255,${.2 + .5 * r() * (1 - y / 320)})`; g.fillRect(x, y, 1.3, 1.3); }
    stipple(c, { k: .35, g: 1, seed: 14, mid: false, boost: 1 });
    return c;
  });
}
function ohFar() {
  return once('oh-far', () => {
    const [c, g] = canvas(PADW, H), r = prng(23), n = vnoise(4), hz = 712;
    // tree line, a water tower, a long low overpass with the highway, poles marching away
    g.fillStyle = '#2a1a33'; g.beginPath(); g.moveTo(0, hz); for (let x = 0; x <= PADW; x += 10) g.lineTo(x, hz - 18 - 26 * fbm(n, x * .006, 1, 4)); g.lineTo(PADW, hz + 40); g.lineTo(0, hz + 40); g.closePath(); g.fill();
    g.fillStyle = '#24172e'; const wx = 1500; g.fillRect(wx - 3, hz - 150, 6, 120); g.fillRect(wx - 40, hz - 150, 4, 120); g.fillRect(wx + 36, hz - 150, 4, 120); g.beginPath(); g.ellipse(wx, hz - 175, 52, 34, 0, 0, TAU); g.fill(); g.fillRect(wx - 52, hz - 178, 104, 10);
    g.fillStyle = 'rgba(255,170,110,.5)'; g.beginPath(); g.ellipse(wx - 20, hz - 182, 30, 6, 0, Math.PI, TAU); g.fill();
    g.fillStyle = '#1f1528'; g.fillRect(0, hz - 34, PADW, 10); for (let x = 60; x < PADW; x += 240) g.fillRect(x, hz - 26, 12, 40);
    g.fillStyle = 'rgba(255,170,110,.35)'; g.fillRect(0, hz - 34, PADW, 1.5);
    for (let k = 0; k < 9; k++) { const px = 1900 - k * 150, ph = 120 - k * 10; g.fillStyle = '#1d1426'; g.fillRect(px, hz - ph, 3, ph); g.fillRect(px - 14, hz - ph, 31, 3); }
    g.strokeStyle = 'rgba(20,14,26,.8)'; g.lineWidth = 1; for (let k = 0; k < 8; k++) sagWire(g, 1900 - k * 150, hz - 120 + k * 10, 1900 - (k + 1) * 150, hz - 120 + (k + 1) * 10, 6);
    // a blank billboard frame on two legs (no text)
    g.fillStyle = '#1f1528'; g.fillRect(520, hz - 210, 6, 190); g.fillRect(640, hz - 210, 6, 190); g.fillStyle = '#2b1e36'; g.fillRect(470, hz - 290, 230, 96); g.strokeStyle = 'rgba(255,170,110,.4)'; g.strokeRect(470, hz - 290, 230, 96);
    stipple(c, { k: .3, g: 1, seed: 25, mid: false, boost: 1 });
    return c;
  });
}
function ohLot() {
  return once('oh-lot', () => {
    const [c, g] = canvas(PADW, H), hz = 712;
    const lg = g.createLinearGradient(0, hz, 0, H); lg.addColorStop(0, '#3b2a40'); lg.addColorStop(.25, '#2a1f33'); lg.addColorStop(1, '#130e1a'); g.fillStyle = lg; g.fillRect(0, hz, PADW, H - hz);
    const sh = g.createRadialGradient(OHIO_GLOW.x + 180, hz + 10, 0, OHIO_GLOW.x + 180, hz + 10, 1000); sh.addColorStop(0, 'rgba(255,170,100,.4)'); sh.addColorStop(1, 'rgba(255,170,100,0)'); g.save(); g.translate(0, hz); g.scale(1, .22); g.translate(0, -hz); g.fillStyle = sh; g.fillRect(0, hz - 600, PADW, 2400); g.restore();
    // painted parking bays in perspective
    g.strokeStyle = 'rgba(240,220,190,.28)'; g.lineWidth = 3; for (let k = -6; k < 16; k++) { g.beginPath(); g.moveTo(980 + k * 120, 760); g.lineTo(980 + k * 330, H + 40); g.stroke(); }
    const r = prng(9); for (let i = 0; i < 2600; i++) { const px = r() * PADW, py = hz + Math.pow(r(), .7) * (H - hz); g.fillStyle = r() < .5 ? 'rgba(255,200,160,.05)' : 'rgba(0,0,0,.2)'; g.fillRect(px, py, 1.4, 1.4); }
    stipple(c, { k: .25, g: 1, seed: 27, mid: false, boost: 1 });
    return c;
  });
}
function truck() {
  return once('truck', () => {
    const w = 1500, h = 560, [c, g] = canvas(w, h), base = 470;
    // trailer (long box to the right), then the conventional cab facing left: long hood, sleeper, chrome stack
    // a 53-ft dry van: taller than the cab, a gap at the fifth wheel, the dusk sky reflected along its side, amber marker lights
    g.fillStyle = '#454a60'; g.fillRect(600, 52, 900, 368);
    { const tg = g.createLinearGradient(0, 52, 0, 420); tg.addColorStop(0, 'rgba(255,176,116,.34)'); tg.addColorStop(.18, 'rgba(0,0,0,0)'); tg.addColorStop(1, 'rgba(10,6,20,.55)'); g.fillStyle = tg; g.fillRect(600, 52, 900, 368);
      const rg = g.createLinearGradient(600, 0, 1500, 0); rg.addColorStop(0, 'rgba(255,150,96,.32)'); rg.addColorStop(.35, 'rgba(255,150,96,.08)'); rg.addColorStop(1, 'rgba(255,150,96,0)'); g.fillStyle = rg; g.fillRect(600, 150, 900, 120); }
    g.strokeStyle = 'rgba(10,8,16,.42)'; g.lineWidth = 1.4; for (let x = 640; x < 1500; x += 44) { g.beginPath(); g.moveTo(x, 56); g.lineTo(x, 416); g.stroke(); }
    g.strokeStyle = 'rgba(255,214,170,.18)'; g.lineWidth = 1; for (let x = 642; x < 1500; x += 44) { g.beginPath(); g.moveTo(x, 56); g.lineTo(x, 416); g.stroke(); }
    g.fillStyle = 'rgba(255,196,140,.75)'; g.fillRect(600, 52, 900, 2.5); g.fillRect(600, 52, 3, 368);
    g.fillStyle = '#1b1722'; g.fillRect(600, 420, 900, 20); g.fillRect(560, 410, 50, 16);
    g.fillStyle = '#2a2531'; g.fillRect(720, 438, 10, 70); g.fillRect(704, 500, 42, 8);   // landing gear
    for (let x = 640; x < 1500; x += 128) { g.fillStyle = '#ff9a3c'; g.beginPath(); g.arc(x, 431, 4, 0, TAU); g.fill(); g.fillStyle = 'rgba(255,170,90,.25)'; g.beginPath(); g.arc(x, 431, 10, 0, TAU); g.fill(); }
    g.fillStyle = '#ff9a3c'; g.beginPath(); g.arc(610, 64, 4, 0, TAU); g.fill();
    for (const wx of [1180, 1300]) { g.fillStyle = '#16121c'; g.beginPath(); g.arc(wx, base, 48, 0, TAU); g.fill(); g.fillStyle = '#5f5965'; g.beginPath(); g.arc(wx, base, 19, 0, TAU); g.fill(); g.fillStyle = 'rgba(255,214,170,.35)'; g.beginPath(); g.arc(wx - 5, base - 5, 7, 0, TAU); g.fill(); }
    // cab
    g.fillStyle = '#2c3552'; g.beginPath(); g.moveTo(30, 400); g.lineTo(34, 300); g.quadraticCurveTo(40, 262, 90, 254); g.lineTo(260, 246); g.lineTo(300, 120); g.quadraticCurveTo(306, 100, 330, 98); g.lineTo(520, 92); g.quadraticCurveTo(548, 92, 552, 120); g.lineTo(556, 430); g.lineTo(30, 430); g.closePath(); g.fill();
    const cg = g.createLinearGradient(0, 92, 0, 430); cg.addColorStop(0, 'rgba(255,170,110,.35)'); cg.addColorStop(.35, 'rgba(255,170,110,0)'); cg.addColorStop(1, 'rgba(8,6,16,.55)'); g.fillStyle = cg; g.fill();
    g.fillStyle = 'rgba(255,190,130,.6)'; g.beginPath(); g.moveTo(90, 254); g.lineTo(260, 246); g.lineTo(262, 250); g.lineTo(92, 258); g.closePath(); g.fill();   // rim on the hood
    g.fillStyle = '#3a2a3c'; g.beginPath(); g.moveTo(310, 130); g.lineTo(400, 124); g.lineTo(400, 230); g.lineTo(284, 238); g.closePath(); g.fill();                  // windscreen side glass
    const wg = g.createLinearGradient(284, 124, 400, 238); wg.addColorStop(0, 'rgba(255,170,110,.55)'); wg.addColorStop(1, 'rgba(120,60,90,.2)'); g.fillStyle = wg; g.fill();
    g.strokeStyle = 'rgba(10,8,16,.6)'; g.lineWidth = 2; g.strokeRect(410, 130, 120, 270);                                                                        // door
    g.fillStyle = '#c9c2c8'; g.fillRect(500, 260, 16, 6);                                                                                                           // handle
    g.fillStyle = '#9a9aa6'; g.fillRect(30, 300, 26, 130); g.fillStyle = '#d9d0d6'; for (let y = 306; y < 426; y += 10) g.fillRect(32, y, 22, 3);                    // grille
    g.fillStyle = '#ffe2b0'; g.beginPath(); g.ellipse(70, 360, 14, 10, 0, 0, TAU); g.fill();                                                                         // headlamp
    g.fillStyle = '#b8b2bc'; g.fillRect(530, 20, 18, 160); g.fillStyle = 'rgba(255,220,180,.7)'; g.fillRect(531, 20, 4, 160); g.fillStyle = '#7d7882'; g.fillRect(526, 16, 26, 8);   // chrome stack
    g.fillStyle = '#b8b2bc'; g.beginPath(); g.roundRect(330, 400, 150, 40, 18); g.fill(); g.fillStyle = 'rgba(255,220,180,.45)'; g.fillRect(334, 404, 140, 4);              // fuel tank
    g.fillStyle = '#16121c'; for (const wx of [150, 470]) { g.beginPath(); g.arc(wx, base, 50, 0, TAU); g.fill(); g.fillStyle = '#6a6470'; g.beginPath(); g.arc(wx, base, 20, 0, TAU); g.fill(); g.fillStyle = '#16121c'; }
    g.save(); g.beginPath(); g.rect(30, 92, 530, 340); g.clip(); artHatch(g, [30, 92, 530, 340], { angle: -1.1, gap: 4, w: .8, col: '#05040a', a: .25, seed: 3, broken: .3 }); g.restore();
    stipple(c, { k: .3, g: 1, seed: 31, mid: false, boost: 1 });
    return c;
  });
}
const LAMPS = [[300, 300], [1240, 270], [1880, 300]];
function sodiumCones() { return once('oh-cones', () => { const [c, g] = canvas(PADW, H); for (const [lx, ly] of LAMPS) cone(g, lx + 180, ly + 10, { dir: 0, spread: .42, len: 760, col: '#ff9a3c', a: .5, k: .6, seed: lx | 0, soft: .4 }); return c; }); }
export function ohio(ctx, t, o = {}) {
  const t0 = o.t0 ?? 0, lt = t - t0, on = o.lampOn ?? t0 + 2.2, push = o.push || [t0 + 2.6, t0 + 3.3];
  const land = 1 - expoOut(lt / 1.1), pu = quart(lin(push[0], push[1], t));
  const cam = { x: -90 * land + drift(t, 5, 1) + lt * 4, y: drift(t, 3, 2) - 60 * pu, z: 1 + .05 * pu };
  ctx.save(); ctx.translate(OHIO_GLOW.x, OHIO_GLOW.y); ctx.scale(cam.z, cam.z); ctx.translate(-OHIO_GLOW.x, -OHIO_GLOW.y);
  const P = (k) => cam.x * k;
  ctx.drawImage(ohSky(), -180 - P(.08), -cam.y * .1);
  { const B = lightSprite('oh-glow', 560, [[0, 'rgba(255,226,170,.9)'], [.08, 'rgba(255,190,120,.6)'], [.3, 'rgba(255,150,90,.18)'], [1, 'rgba(255,140,80,0)']]); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .7 + .1 * Math.sin(t * .7); ctx.drawImage(B, OHIO_GLOW.x - P(.1) - 560, OHIO_GLOW.y + 40 - 560 - cam.y * .1); ctx.restore(); }
  ctx.drawImage(ohFar(), -180 - P(.2), -cam.y * .2);
  // highway lights on the overpass, streaming right (the motion continues from the whip)
  { const r = prng(61); ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 14; i++) { const sp = 140 + r() * 120, x = ((r() * 2400 + t * sp) % 2400) - 240 - P(.2), y = 712 - 38 + (r() < .5 ? 0 : 4); const red = r() < .5; ctx.fillStyle = red ? 'rgba(255,90,70,.8)' : 'rgba(255,236,200,.9)'; ctx.fillRect(x, y, 5, 2.2); ctx.fillStyle = red ? 'rgba(255,90,70,.15)' : 'rgba(255,236,200,.15)'; ctx.fillRect(x - 16, y - 1, 26, 4); } ctx.restore(); }
  ctx.drawImage(ohLot(), -180 - P(.6), -cam.y * .6);
  // lamp posts; on "dusk" the sodium lamps flicker on
  const flick = (k) => { const u = t - on - k * .09; if (u < 0) return 0; if (u > .5) return 1; return [1, 0, .7, 0, 1, .4, 1][Math.floor(u * 14) % 7] * u * 2; };
  for (let k = 0; k < LAMPS.length; k++) { const [lx, ly] = LAMPS[k], x = lx - P(.6), y = ly - cam.y * .6; ctx.fillStyle = '#1b1522'; ctx.fillRect(x - 4, y, 8, 712 + 80 - y + 100); ctx.fillRect(x - 4, y - 4, 60, 8); ctx.fillStyle = '#2a2230'; ctx.beginPath(); ctx.roundRect(x + 30, y - 8, 46, 14, 6); ctx.fill();
    const f = flick(k); if (f > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createRadialGradient(x + 53, y + 4, 0, x + 53, y + 4, 90); lg.addColorStop(0, `rgba(255,214,150,${.95 * f})`); lg.addColorStop(.2, `rgba(255,154,60,${.45 * f})`); lg.addColorStop(1, 'rgba(255,154,60,0)'); ctx.fillStyle = lg; ctx.fillRect(x - 40, y - 90, 190, 190); ctx.restore(); } }
  { const fon = Math.min(...[0, 1, 2].map((k) => flick(k))) * .5 + flick(1) * .5; if (fon > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = fon * .9; ctx.drawImage(sodiumCones(), -180 - P(.6) + 53 - 180 + 180, -cam.y * .6); ctx.restore(); } }
  // the truck idles (a fine engine shiver), exhaust drifts off the stack
  const shiver = Math.sin(t * 61) * .6, Tk = truck(), tx = 380 - P(.75), ty = 712 + 330 - 470 - 120 - cam.y * .75;
  ctx.drawImage(Tk, tx, ty + shiver);
  { const r = prng(77); ctx.save(); for (let i = 0; i < 16; i++) { const life = ((t * .45 + r()) % 1), px = tx + 539 + life * 160 + Math.sin(t + i) * 10 * life, py = ty + 20 - life * 220, rr = 14 + life * 70; const g = ctx.createRadialGradient(px, py, 0, px, py, rr); const a = .16 * Math.sin(Math.PI * life); g.addColorStop(0, `rgba(200,170,190,${a})`); g.addColorStop(1, 'rgba(200,170,190,0)'); ctx.fillStyle = g; ctx.fillRect(px - rr, py - rr, rr * 2, rr * 2); } ctx.restore(); }
  // the driver leans against the cab, rust jacket, cap, phone loose in the front hand
  const dx = tx + 600, dy = ty + 470 + 50 - 88 * 2.25, s = 2.25;
  castShadow(ctx, dx, dy + 88 * s, s, OHIO_GLOW.x - 200, OHIO_GLOW.y, { a: .35, len: 2 });
  const glance = sm(lin(on + .05, on + .55, t)) * .14;   // the lamps flicker on: he looks up at them
  figure(ctx, dx, dy, s, { lean: -.07, head: -.05 + .04 * Math.sin(t * .5) - glance, sh: [.38, .12], el: [.95, .25], hip: [.06, -.12], kn: [.02, .14], hair: 'cap', coat: .4 }, { t, seed: 5, flip: true, dress: { coat: '#a8492c', pants: '#22263a', shoes: '#120f16', skin: '#d9a888', hair: '#3a2f2a' }, light: { x: OHIO_GLOW.x, y: OHIO_GLOW.y, col: '#ffb070', a: .5 }, rim: '#ffbf80', rimSide: -1, rimW: 2.4,
    prop: (g, front) => { g.fillStyle = '#121018'; g.beginPath(); g.roundRect(front.hx - 5, front.hy - 9, 11, 19, 2.5); g.fill(); } });
  { const f = flick(1); if (f > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(dx, dy - 120, 0, dx, dy - 120, 260); g.addColorStop(0, `rgba(255,154,60,${.16 * f})`); g.addColorStop(1, 'rgba(255,154,60,0)'); ctx.fillStyle = g; ctx.fillRect(dx - 260, dy - 380, 520, 520); ctx.restore(); } }
  motes(ctx, t, 0, 200, W, 700, 70, 9, '#ffcf96', .35 + .3 * flick(1), [-10, -3]);
  ctx.restore();
  const vg = ctx.createRadialGradient(W * .4, H * .55, 300, W * .4, H * .55, 1300); vg.addColorStop(0, 'rgba(12,8,22,0)'); vg.addColorStop(1, 'rgba(12,8,22,.55)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  return { glow: [OHIO_GLOW.x, OHIO_GLOW.y - 60 * pu] };
}

// ---------------------------------------------------------------- 6.24 both of them, split by the day–night line
function blurredBg(key, f) { return once(key, () => { const [c, g] = canvas(W, H); f(g); const [b, bg] = canvas(W, H); bg.filter = 'blur(6px)'; bg.drawImage(c, 0, 0); bg.filter = 'none'; return b; }); }
export function split(ctx, t, o = {}) {
  const t0 = o.t0 ?? 0, down = o.down ?? t0 + .1, up = o.up ?? t0 + 1.4, sw = o.swirl || [t0 + 1.3, t0 + 2.8], lift = o.lift ?? t0 + 2.7;
  const dl = drift(t, 6, 1), look = sm(lin(up - .2, up + .5, t)), bow = sm(lin(down, down + .5, t)) * (1 - look);
  const cut = (y) => mix(1010, 900, y / H) + Math.sin(t * .6) * 6;   // the split: a soft diagonal like the terminator
  const Lbg = blurredBg('split-L', (g) => { g.save(); g.translate(-260, -200); g.scale(1.25, 1.25); g.drawImage(mnlSky(), -180, 0); g.drawImage(mnlFar(), -180, 0); g.globalCompositeOperation = 'lighter'; g.drawImage(mnlHaze(), -180, 0); g.globalCompositeOperation = 'source-over'; g.drawImage(mnlStreet(), -180, 0); g.drawImage(mnlWires().c, -180, 0); g.restore(); });
  const Rbg = blurredBg('split-R', (g) => { g.save(); g.translate(-200, -230); g.scale(1.25, 1.25); g.drawImage(ohSky(), -180, 0); g.drawImage(ohFar(), -180, 0); g.drawImage(ohLot(), -180, 0); g.globalAlpha = .9; g.globalCompositeOperation = 'lighter'; g.drawImage(sodiumCones(), -180, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.drawImage(truck(), 420, 300); g.restore(); });
  const side = (left, draw) => { ctx.save(); ctx.beginPath(); if (left) { ctx.moveTo(0, 0); ctx.lineTo(cut(0), 0); ctx.lineTo(cut(H), H); ctx.lineTo(0, H); } else { ctx.moveTo(cut(0), 0); ctx.lineTo(W, 0); ctx.lineTo(W, H); ctx.lineTo(cut(H), H); } ctx.closePath(); ctx.clip(); draw(); ctx.restore(); };
  const s = 3.3, swirlU = sm(lin(sw[0], sw[1], t));
  const phoneProp = (g, front) => { g.fillStyle = '#121018'; g.beginPath(); g.roundRect(front.hx - 4, front.hy - 14, 10, 18, 2.5); g.fill(); g.fillStyle = `rgba(255,214,160,${.5 + .4 * (1 - look)})`; g.fillRect(front.hx - 3, front.hy - 13, 8, 15); };
  // left: Ohio (as on the map), the driver in rust facing right; the dusk glow behind him
  side(true, () => {
    ctx.drawImage(Rbg, -30 + dl * .5, 0);
    { const g = ctx.createRadialGradient(200, 470, 0, 200, 470, 700); g.addColorStop(0, 'rgba(255,214,150,.5)'); g.addColorStop(.25, 'rgba(255,160,100,.18)'); g.addColorStop(1, 'rgba(255,140,80,0)'); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    const fx = 520 + dl, fy = 790;
    const pose = { ...POSES.hold, head: mix(.12, .42, bow) - .5 * look, sh: [.6, .48], el: [1.15, 1.2], lean: .02, hair: 'cap' };
    figure(ctx, fx, fy, s, pose, { t, seed: 5, dress: { coat: '#a8492c', pants: '#22263a', skin: '#d9a888', hair: '#3a2f2a' }, light: { x: 200, y: 470, col: '#ffb070', a: .55 }, rim: '#ffbf80', rimSide: -1, rimW: 3.4, shadow: false, prop: phoneProp });
    paperSwarm(ctx, t, { x: fx + 60, y: fy + 40, R: 130 + 90 * swirlU, height: 2.1, n: 150, seed: 5, size: 1.15, a: Math.sin(Math.PI * swirlU), kinds: ['letter', 'recipe', 'hand', 'print'], t0 });
  });
  // right: Manila, the care worker in petrol facing left; the dawn sun behind her
  side(false, () => {
    ctx.drawImage(Lbg, 40 - dl * .5, 0);
    { const g = ctx.createRadialGradient(1720, 560, 0, 1720, 560, 760); g.addColorStop(0, 'rgba(255,236,206,.6)'); g.addColorStop(.2, 'rgba(255,196,150,.22)'); g.addColorStop(1, 'rgba(255,170,130,0)'); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    const fx = 1420 - dl, fy = 790;
    const pose = { ...POSES.hold, head: mix(.12, .42, bow) - .5 * look, sh: [.6, .48], el: [1.15, 1.2], lean: .03 };
    figure(ctx, fx, fy, s, pose, { t, seed: 3, flip: true, dress: { coat: '#2f7c80', pants: '#245d63', skin: '#a8734f', hair: '#1a1114' }, light: { x: 1700, y: 600, col: '#ffd2a8', a: .55 }, rim: '#ffd9b4', rimSide: 1, rimW: 3.4, shadow: false, prop: phoneProp });
    paperSwarm(ctx, t, { x: fx - 60, y: fy + 40, R: 130 + 90 * swirlU, height: 2.1, n: 150, seed: 3, size: 1.15, a: Math.sin(Math.PI * swirlU), kinds: ['recipe', 'letter', 'notes', 'hand'], t0 });
  });
  // the split line: an engraved guilloche band in foil, like the day–night line on the map
  { const pts = []; for (let i = 0; i <= 40; i++) { const y = i / 40 * H; pts.push([cut(y), y]); }
    ctx.save(); ctx.lineCap = 'round'; ctx.globalCompositeOperation = 'lighter';
    for (const [lw, a] of [[18, .06], [6, .18], [1.6, .9]]) { ctx.strokeStyle = rgba(lw > 2 ? '#ffb35c' : '#fff1d6', a); ctx.lineWidth = lw; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); }
    ctx.strokeStyle = rgba('#fff1d6', .5); ctx.lineWidth = .8; for (let k = 0; k < 4; k++) { ctx.beginPath(); for (let i = 0; i <= 160; i++) { const y = i / 160 * H, d = 9 * Math.sin(y * .045 + k * 1.6 + t * .8); i ? ctx.lineTo(cut(y) + d, y) : ctx.moveTo(cut(y) + d, y); } ctx.stroke(); }
    ctx.restore(); }
  // one fragment rises out of the swirl and leaves the frame upward (it lands on the roof in 7.02a)
  { const u = clamp((t - lift) / .7); if (u > 0) { const x = mix(1020, 1000, u), y = mix(560, -120, expoIn(u) * .6 + u * .4), r = .3 * Math.sin(t * 5); ctx.save(); ctx.translate(x, y); ctx.rotate(r); ctx.fillStyle = '#efe4cc'; ctx.fillRect(-46, -32, 92, 64); ctx.strokeStyle = 'rgba(60,50,40,.4)'; ctx.lineWidth = 1; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(-36, -18 + k * 9); ctx.lineTo(30 - (k % 2) * 14, -18 + k * 9); ctx.stroke(); } ctx.restore(); } }
  const vg = ctx.createRadialGradient(W / 2, H / 2, 400, W / 2, H / 2, 1250); vg.addColorStop(0, 'rgba(12,8,22,0)'); vg.addColorStop(1, 'rgba(12,8,22,.5)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
}
