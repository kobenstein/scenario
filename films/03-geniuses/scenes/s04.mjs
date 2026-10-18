// 04 · It has already started, quietly (2:27–3:39): London superbug lab, Robin's eye drop, a thousand PhDs in your pocket.
// Carrier chain: shooting star → London → raindrop on the lab window → microscope eyepiece → microbes → gene lock →
// notebook sketch → drawer → server slot → printed card → flash → eye → retina → drop → petri dish → glowing cells →
// footprints → pocket → phone display → mini PhDs on the bus → camera rises out of the window (s05).
import { W, H, C, rgba, clamp, lin, mix, sm, eio, eout, ein, sine, back, prng, canvas, addGlow, glow, text } from '../engine.mjs';
import { P, skyGrad, cityLayer, fogBand, cone, hill, grass, person, finish, shade, mixHex } from '../lib/world.mjs';
import { quoteCard, source } from '../lib/kit.mjs';

const cache = new Map(); const once = (k, f) => { if (!cache.has(k)) cache.set(k, f()); return cache.get(k); };
const zoomAt = (ctx, x, y, z) => { ctx.translate(x, y); ctx.scale(z, z); ctx.translate(-x, -y); };
const LAB = '#e9e1cc';

// ---------- small shared props ----------
export function padlock(ctx, x, y, s, { col = P.amber, a = 1, ink = null, glowA = .6 } = {}) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = ink || col; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, -8, 11, Math.PI, 0); ctx.lineTo(11, 2); ctx.moveTo(-11, -8); ctx.lineTo(-11, 2); ctx.stroke();
  ctx.fillStyle = ink || col; ctx.beginPath(); ctx.roundRect(-16, 0, 32, 24, 4); ctx.fill();
  ctx.fillStyle = ink ? '#efe4c8' : '#2a1606'; ctx.beginPath(); ctx.arc(0, 10, 3.5, 0, 7); ctx.fill(); ctx.fillRect(-1.5, 10, 3, 8);
  ctx.restore();
  if (!ink && glowA > 0) addGlow(ctx, x, y + 6 * s, 40 * s, glowA * a, col, '#fff3dd');
}
function mortarboard(ctx, x, y, s, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#0d0f2e'; ctx.fillRect(-7, -1, 14, 6);
  ctx.fillStyle = '#161a44'; ctx.beginPath(); ctx.moveTo(-15, -2); ctx.lineTo(0, -8); ctx.lineTo(15, -2); ctx.lineTo(0, 4); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = P.amber; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(0, -2); ctx.lineTo(10, 1); ctx.lineTo(11, 9); ctx.stroke();
  ctx.restore();
}
// a mini PhD in a lab coat with a mortarboard; sigh 0..1 slumps it
function mini(ctx, x, y, h, t, { sit = false, flip = false, sigh = 0, phase = null, skin = '#c98f6a', hat = 1, a = 1 } = {}) {
  if (a <= 0) return;
  const s = h / 100;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(1, 1 - .07 * sigh);
  person(ctx, 0, 0, h, t, { coat: LAB, dark: '#2a3050', hood: false, skin, hair: '#1a1530', sit, flip, phase });
  const hx = (flip ? -1 : 1) * 1.5 * s, hy = (sit ? -85 : -92) * s + sigh * 3 * s;
  mortarboard(ctx, hx, hy - 7 * s, s * .85, hat);
  ctx.restore();
}

// ---------- shot 34: three lights fall out of the sky onto a map of Europe; one lands on London ----------
const EU = {
  main: [[-9, 37], [-9, 43], [-2, 43.5], [-1.5, 46], [-4.5, 48.5], [-1.5, 49.5], [2, 51], [4, 52], [5, 53.3], [8, 53.8], [8.5, 55.5], [8, 57], [10.5, 57.7], [10.5, 56], [12.5, 54.5], [14, 54], [19, 54.5], [21, 56], [21.5, 57.5], [24, 57.5], [24, 59.4], [28, 59.6], [30, 60], [36, 62], [42, 63], [42, 44], [37, 45], [33, 44.5], [30, 45.5], [28, 44], [28, 41], [26, 40.5], [23, 40], [23.5, 38], [22, 37], [21, 38.5], [19.5, 40], [19.5, 42], [15.5, 44], [13.5, 45.5], [12.5, 44.5], [14, 42], [16, 41], [18.5, 40], [16, 38], [15.5, 40], [12, 42], [10, 44], [7.5, 43.8], [4, 43.5], [3, 42], [0.5, 40.5], [-0.5, 38], [-2, 36.8], [-5.5, 36], [-7, 37]],
  scan: [[5, 58], [5, 62], [10, 64], [14, 67], [17, 69], [21, 70], [28, 71], [30, 70], [28, 68], [24, 65.5], [21, 63], [19, 60.5], [18, 59.5], [16.5, 57], [14, 55.5], [12.5, 56], [11, 58.5], [8, 58]],
  fin: [[21.5, 60.5], [21.5, 63], [25, 65], [29, 69], [30, 62], [27, 60.5]],
  uk: [[-5.5, 50], [1.5, 51], [1.5, 53], [0, 53.5], [-2, 55.5], [-2, 57.5], [-3.5, 58.6], [-5, 58.5], [-6, 56.5], [-5, 55], [-3, 54.5], [-3, 53.3], [-4.5, 52.8], [-5, 51.5]],
  ie: [[-10, 51.5], [-6, 52], [-6, 54], [-8, 55.2], [-10, 54]],
  sar: [[8.2, 39], [9.7, 39], [9.7, 41], [8.2, 41]], sic: [[12.4, 38], [15.6, 38.2], [15.2, 36.7]],
};
const proj = ([lon, lat]) => [300 + (lon + 12) * 25 * Math.cos(lat * Math.PI / 180) * 1.45, 1050 - (lat - 35) * 25];
const LONDON = proj([-0.1, 51.5]);
const CITIES = [[2.35, 48.85], [13.4, 52.5], [-3.7, 40.4], [12.5, 41.9], [16.4, 48.2], [18, 59.3], [21, 52.2], [-9.1, 38.7], [23.7, 38], [4.9, 52.4], [12.6, 55.7], [-6.3, 53.3], [9.2, 45.5], [14.4, 50.1], [19, 47.5], [26, 44.4], [24.9, 60.2], [10.7, 59.9], [-3.2, 55.9], [-2.2, 53.5]].map(proj);
function mapDots() {
  return once('eu_dots', () => {
    const [c, x] = canvas(W, H); x.fillStyle = '#fff';
    for (const k of Object.keys(EU)) { x.beginPath(); EU[k].map(proj).forEach(([px, py], i) => i ? x.lineTo(px, py) : x.moveTo(px, py)); x.closePath(); x.fill(); }
    const d = x.getImageData(0, 0, W, H).data, pts = [], r = prng(11);
    for (let y = 0; y < H; y += 9) for (let xx = (y / 9) % 2 ? 4 : 0; xx < W; xx += 9) if (d[(y * W + xx) * 4 + 3] > 100) pts.push([xx, y, r()]);
    return pts;
  });
}
const mapShot = (T) => {
  const tA = T.S('04a', 'And small'), stars = [
    { t0: tA - .2, t1: T.S('04a', 'pieces'), from: [1700, -180], to: [-160, 700] },
    { t0: tA + .15, t1: T.S('04a', 'already'), from: [1900, -100], to: [-200, 420] },
    { t0: tA + .4, t1: T.S('04a', 'work') + .1, from: [1450, -220], to: LONDON },
  ];
  const tZoom = T.S('04a', 'work') + .15;
  return (ctx, t, s) => {
    ctx.fillStyle = '#060818'; ctx.fillRect(0, 0, W, H);
    const e = eio(lin(tZoom, s.b, t)), z = mix(1.02, 3.4, e) + .03 * lin(s.a, tZoom, t), vx = mix(960, LONDON[0], e), vy = mix(560, LONDON[1], e);
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-vx, -vy);
    // sea haze + graticule
    const g = ctx.createRadialGradient(900, 560, 0, 900, 560, 1100); g.addColorStop(0, '#121a4a'); g.addColorStop(1, '#070918'); ctx.fillStyle = g; ctx.fillRect(-400, -400, W + 800, H + 800);
    ctx.strokeStyle = 'rgba(95,143,196,.08)'; ctx.lineWidth = 1; for (let i = -2; i < 14; i++) { ctx.beginPath(); ctx.moveTo(i * 160, -200); ctx.lineTo(i * 160 + 120, H + 200); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-200, i * 110); ctx.lineTo(W + 200, i * 110 - 30); ctx.stroke(); }
    for (const [x, y, m] of mapDots()) { ctx.fillStyle = rgba(m > .93 ? '#ffd29a' : '#8fb8f0', m > .93 ? .75 : .42 + .16 * Math.sin(t * 1.3 + m * 9)); ctx.fillRect(x - 2.2, y - 2.2, 4.4, 4.4); }
    CITIES.forEach(([x, y], i) => addGlow(ctx, x, y, 22, .35 + .15 * Math.sin(t * 2 + i), P.amber, '#fff3dd'));
    // the three falling lights
    for (const st of stars) {
      const u = lin(st.t0, st.t1, t); if (u <= 0) continue;
      const eu = ein(u) * .6 + u * .4, px = mix(st.from[0], st.to[0], eu), py = mix(st.from[1], st.to[1], eu);
      const dx = st.to[0] - st.from[0], dy = st.to[1] - st.from[1], L = Math.hypot(dx, dy), tl = 260 * (u < 1 ? 1 : 0);
      if (u < 1) {
        const tg = ctx.createLinearGradient(px - dx / L * tl, py - dy / L * tl, px, py); tg.addColorStop(0, 'rgba(216,247,255,0)'); tg.addColorStop(1, 'rgba(255,240,210,.9)');
        ctx.strokeStyle = tg; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(px - dx / L * tl, py - dy / L * tl); ctx.lineTo(px, py); ctx.stroke();
        addGlow(ctx, px, py, 40, .9, '#ffd29a', '#ffffff');
      } else if (st.to === LONDON) {
        const k = t - st.t1; for (let i = 0; i < 3; i++) { const q = ((k * .8 + i / 3) % 1); ctx.strokeStyle = rgba(C.cyan, (1 - q) * .6); ctx.lineWidth = 2 / z * 2; ctx.beginPath(); ctx.ellipse(px, py, 8 + q * 60, (8 + q * 60) * .7, 0, 0, 7); ctx.stroke(); }
        addGlow(ctx, px, py, 26, .95, '#ffd29a', '#ffffff');
      }
    }
    ctx.restore();
    const la = lin(T.S('04a', 'work'), T.S('04a', 'work') + .4, t) * (1 - lin(s.b - .5, s.b, t));
    text(ctx, 'LONDON', W / 2 + 34, H / 2 - 24, { size: 22, weight: 600, spacing: 6, alpha: la * e, color: C.cream });
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- shot 35a: a rainy London lab; scientists at microscopes; the wall calendar sheds ten years ----------
function rainOnGlass(ctx, t, x0, y0, w, h, seed = 5, a = 1) {
  const r = prng(seed);
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, h); ctx.clip();
  ctx.strokeStyle = rgba('#a8c8f0', .18 * a); ctx.lineWidth = 1.2;
  for (let i = 0; i < 160; i++) { const x = x0 + r() * w, sp = 900 + r() * 500, y = y0 + ((r() * h + t * sp) % (h + 60)) - 60; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 6, y + 34); ctx.stroke(); }
  for (let i = 0; i < 70; i++) { const x = x0 + r() * w, sp = 10 + r() * 40, y = y0 + ((r() * h + t * sp) % h), rr = 2 + r() * 4; ctx.fillStyle = rgba('#d8f7ff', .22 * a); ctx.beginPath(); ctx.ellipse(x, y, rr * .8, rr, 0, 0, 7); ctx.fill(); ctx.fillStyle = rgba('#d8f7ff', .08 * a); ctx.fillRect(x - .7, y - 30 * (sp / 50), 1.4, 30 * (sp / 50)); }
  ctx.restore();
}
function microscope(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#1a1f4a'; ctx.beginPath(); ctx.roundRect(-60, -14, 120, 14, 4); ctx.fill();          // foot
  ctx.fillStyle = '#232a62'; ctx.beginPath(); ctx.moveTo(20, -14); ctx.quadraticCurveTo(60, -90, 20, -150); ctx.lineTo(4, -142); ctx.quadraticCurveTo(38, -88, 2, -14); ctx.fill(); // arm
  ctx.fillStyle = '#2c3474'; ctx.fillRect(-46, -66, 70, 8);                                                   // stage
  ctx.save(); ctx.translate(-4, -150); ctx.rotate(-.42); ctx.fillStyle = '#d8dcef'; ctx.fillRect(-10, -70, 20, 96); ctx.fillStyle = '#9aa2c8'; ctx.fillRect(-13, -84, 26, 18); ctx.restore(); // tube + eyepiece
  ctx.fillStyle = '#9aa2c8'; ctx.fillRect(-14, -110, 14, 34);
  addGlow(ctx, -10, -60, 40, .5 + .1 * Math.sin(t * 3), C.cyan, C.cyanWhite); // stage light
  ctx.restore();
}
// eyepiece position for microscope(x, y, s): tube rotated -.42 at (-4,-150), top at (0,-84)
const eyepiece = (x, y, s) => [x + (-4 + Math.sin(.42) * 77) * s * 1, y + (-150 - Math.cos(.42) * 77) * s];
const LAB_SCOPE = { x: 1010, y: 712, s: 1.25 };
const londonLab = (T) => {
  const tRain = T.S('04a', 'In London'), tCal0 = T.S('04a', 'team'), tCal1 = T.S('04a', 'one question'), tPush = T.S('04a', 'one question') + .2;
  const towerCity = () => once('lab_city', () => cityLayer({ seed: 404, z: 5, base: 600, hMin: 60, hMax: 210, col: '#26306e', fogTo: '#4a5fa8', fogAmt: .7, lit: .06, litCol: P.amber, span: 2600 }));
  const [ex, ey] = eyepiece(LAB_SCOPE.x, LAB_SCOPE.y, LAB_SCOPE.s);
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t)), push = eio(lin(tPush, s.b + .2, t));
    ctx.save(); zoomAt(ctx, ex, ey, 1 + .05 * u + 1.1 * push); ctx.translate(-30 * u, 0);
    // room
    ctx.fillStyle = '#121638'; ctx.fillRect(-200, -200, W + 400, H + 400);
    // big window: rainy London night
    const wx = 300, wy = 70, ww = 1420, wh = 560;
    ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip();
    const sg = ctx.createLinearGradient(0, wy, 0, wy + wh); sg.addColorStop(0, '#141a48'); sg.addColorStop(1, '#3a4c92'); ctx.fillStyle = sg; ctx.fillRect(wx, wy, ww, wh);
    towerCity().draw(ctx, t, 300 + u * 40, 0, 1);
    // Elizabeth Tower silhouette with a lit clock
    ctx.fillStyle = '#1c2460'; ctx.fillRect(1380, 250, 56, 360); ctx.beginPath(); ctx.moveTo(1374, 252); ctx.lineTo(1408, 160); ctx.lineTo(1442, 252); ctx.fill(); ctx.fillRect(1404, 120, 8, 44);
    ctx.fillStyle = '#ffe2b0'; ctx.beginPath(); ctx.arc(1408, 290, 18, 0, 7); ctx.fill(); addGlow(ctx, 1408, 290, 60, .5, P.amber, '#fff3dd');
    fogBand(ctx, t, 560, 160, { a: .25, hex: '#8ab8e8' });
    rainOnGlass(ctx, t, wx, wy, ww, wh, 7);
    // the raindrop that came in with the star: lands on the glass in the centre
    const dl = lin(tRain - .7, tRain - .2, t); if (dl > 0) { const dy = 540 + 30 * eout(lin(tRain, tRain + 2.5, t)); ctx.fillStyle = rgba('#e8fbff', .55); ctx.beginPath(); ctx.ellipse(960, dy, 8, 10, 0, 0, 7); ctx.fill(); addGlow(ctx, 960, dy, 40, .5 * (1 - lin(tRain, tRain + 2, t)) + .15, P.amber, '#fff3dd'); }
    ctx.restore();
    ctx.fillStyle = '#0b0e2c'; ctx.fillRect(wx - 16, wy - 16, ww + 32, 16); ctx.fillRect(wx - 16, wy + wh, ww + 32, 18); for (let i = 0; i <= 4; i++) ctx.fillRect(wx - 8 + i * ww / 4, wy, 16, wh);
    // shelves with flasks along the right wall
    for (let i = 0; i < 5; i++) { const fx = 1770 + (i % 2) * 40, fy = 220 + i * 90; ctx.fillStyle = rgba(i % 2 ? C.cyan : P.amber, .55); ctx.beginPath(); ctx.moveTo(fx - 12, fy); ctx.lineTo(fx + 12, fy); ctx.lineTo(fx + 22, fy + 40); ctx.lineTo(fx - 22, fy + 40); ctx.fill(); }
    // wall calendar on the left wall: ten years tear off
    const cx = 160, cy = 330, n = Math.floor(10 * lin(tCal0, tCal1, t)), year = 2015 + n;
    ctx.fillStyle = '#0b0e2c'; ctx.fillRect(cx - 98, cy - 128, 196, 262);
    ctx.fillStyle = '#e8dcc0'; ctx.fillRect(cx - 90, cy - 110, 180, 236); ctx.fillStyle = '#b4472e'; ctx.fillRect(cx - 90, cy - 110, 180, 40);
    text(ctx, String(Math.min(year, 2025)), cx, cy + 40, { size: 64, font: 'Instrument Serif', color: '#20183a', align: 'center' });
    text(ctx, 'YEAR', cx, cy - 82, { size: 14, weight: 600, spacing: 5, color: '#f3efe2', align: 'center' });
    // sheets flying off
    for (let k = 0; k < 10; k++) {
      const tk = mix(tCal0, tCal1, k / 10), q = (t - tk) / 1.4; if (q < 0 || q > 1) continue;
      ctx.save(); ctx.translate(cx + q * 380 + Math.sin(q * 6 + k) * 40, cy + q * q * 600 - 40 * Math.sin(q * 3)); ctx.rotate(q * (2 + k % 3)); ctx.globalAlpha = 1 - q;
      ctx.fillStyle = '#e8dcc0'; ctx.fillRect(-60, -80, 120, 160); text(ctx, String(2015 + k), 0, 20, { size: 40, font: 'Instrument Serif', color: '#20183a', align: 'center' }); ctx.restore();
    }
    // scientists: two seated at microscopes, one standing with a clipboard (all breathing, one turning a knob)
    person(ctx, 1150, 760, 360, t, { sit: true, flip: true, coat: LAB, dark: '#283055', hood: false, typing: true, skin: '#a8714f' });
    person(ctx, 520, 750, 350, t, { sit: true, coat: LAB, dark: '#283055', hood: false, typing: true, skin: '#d9a77f', hair: '#6b4a2a' });
    person(ctx, 800, 930, 470, t, { coat: LAB, dark: '#283055', hood: false, skin: '#8a5a3c', look: Math.sin(t * .6) });
    // bench
    ctx.fillStyle = '#1a1f4a'; ctx.fillRect(-100, 712, W + 200, 22); ctx.fillStyle = '#0d1030'; ctx.fillRect(-100, 734, W + 200, 400);
    microscope(ctx, LAB_SCOPE.x, LAB_SCOPE.y, LAB_SCOPE.s, t); microscope(ctx, 660, 712, 1.2, t + 1);
    // bench lamp
    cone(ctx, 1500, 420, 330, 0, .45, '#ffd29a', .25); ctx.fillStyle = '#0b0e2c'; ctx.fillRect(1470, 400, 60, 20);
    ctx.fillStyle = 'rgba(232,220,192,.8)'; ctx.fillRect(1380, 700, 120, 12); ctx.fillStyle = rgba(C.cyan, .7); ctx.fillRect(1560, 690, 16, 22);
    // window light on the floor
    ctx.fillStyle = 'rgba(95,143,196,.06)'; ctx.beginPath(); ctx.moveTo(300, 734); ctx.lineTo(1720, 734); ctx.lineTo(1900, 1080); ctx.lineTo(120, 1080); ctx.fill();
    ctx.restore();
    // the eyepiece glows as the camera closes in
    if (push > 0) addGlow(ctx, ex, ey, 60 + 200 * push, .7 * push, C.cyan, C.cyanWhite);
    finish(ctx, t, { vig: .55 });
  };
};
const LAB_EYE = eyepiece(LAB_SCOPE.x, LAB_SCOPE.y, LAB_SCOPE.s);

// ---------- shot 35b: microbes; a virus carries a glowing lock (the resistance gene) from one species to another ----------
function rod(ctx, x, y, L, w, ang, col, t, ph = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang + Math.sin(t * .7 + ph) * .04);
  const g = ctx.createLinearGradient(0, -w / 2, 0, w / 2); g.addColorStop(0, rgba(col, .55)); g.addColorStop(1, rgba(shade(col, -.25), .45));
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-L / 2, -w / 2, L, w, w / 2); ctx.fill();
  ctx.strokeStyle = rgba(col, .9); ctx.lineWidth = 4; ctx.stroke();
  // flagella
  ctx.strokeStyle = rgba(col, .4); ctx.lineWidth = 2; for (let k = 0; k < 3; k++) { ctx.beginPath(); for (let i = 0; i <= 30; i++) { const q = i / 30, px = -L / 2 - q * 140, py = (k - 1) * 20 + Math.sin(q * 10 - t * 6 + k) * 10 * q; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
  ctx.restore();
}
function cocci(ctx, x, y, r, col, t) {
  const pts = [[0, 0], [1.7, .2], [-.8, 1.5], [.9, 1.6], [-1.6, -.4], [.4, -1.7]];
  for (const [i, [dx, dy]] of pts.entries()) {
    const px = x + dx * r * 1.05 + Math.sin(t * .8 + i) * 4, py = y + dy * r * 1.05 + Math.cos(t * .7 + i) * 4;
    const g = ctx.createRadialGradient(px - r * .3, py - r * .3, 0, px, py, r); g.addColorStop(0, rgba(C.cyanWhite, .4)); g.addColorStop(1, rgba(col, .35));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, r, 0, 7); ctx.fill(); ctx.strokeStyle = rgba(col, .85); ctx.lineWidth = 3.5; ctx.stroke();
  }
}
function phage(ctx, x, y, s, ang, t, legs = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  ctx.strokeStyle = '#d8f7ff'; ctx.lineWidth = 2.5;
  for (let k = -2; k <= 2; k++) { const sp = Math.sin(t * 5 + k) * 4 * legs; ctx.beginPath(); ctx.moveTo(0, 46); ctx.lineTo(k * 12 + sp, 60); ctx.lineTo(k * 16, 74); ctx.stroke(); }
  ctx.fillStyle = '#b8c4ef'; ctx.fillRect(-5, 0, 10, 48); ctx.strokeStyle = 'rgba(10,12,40,.5)'; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-5, 6 + i * 7); ctx.lineTo(5, 6 + i * 7); ctx.stroke(); }
  ctx.fillStyle = '#e6ecff'; ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + Math.PI / 6; ctx[i ? 'lineTo' : 'moveTo'](Math.cos(a) * 26, -18 + Math.sin(a) * 26); } ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#9aa6d8'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-22, -18); ctx.lineTo(22, -18); ctx.moveTo(-11, -40); ctx.lineTo(11, 4); ctx.moveTo(11, -40); ctx.lineTo(-11, 4); ctx.stroke();
  ctx.restore();
}
const microbes = (T) => {
  const tIn = T.S('04a', 'how do'), tPick = T.S('04a', 'pass'), tArrive = T.S('04a', 'drug resistance'), tSpec = T.S('04a', 'other species'), tEnd = T.S('04a', 'They had found');
  const A = { x: 560, y: 600 }, B = { x: 1390, y: 470 };
  return (ctx, t, s) => {
    const zc = eio(lin(tSpec + .5, tEnd + .5, t)), lockB = [B.x + 10, B.y + 6];
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(mix(1.04, 5.2, zc), mix(1.04, 5.2, zc)); ctx.translate(-mix(W / 2 + 10 * Math.sin(t * .3), lockB[0], zc), -mix(H / 2, lockB[1], zc));
    const g = ctx.createRadialGradient(900, 520, 0, 900, 520, 1200); g.addColorStop(0, '#0b3550'); g.addColorStop(.6, '#081a36'); g.addColorStop(1, '#050817'); ctx.fillStyle = g; ctx.fillRect(-500, -500, W + 1000, H + 1000);
    // caustic light ribbons and drifting particles
    ctx.save(); ctx.globalCompositeOperation = 'screen'; for (let k = 0; k < 5; k++) { ctx.strokeStyle = rgba(C.cyan, .05); ctx.lineWidth = 40; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const x = -100 + i * 55, y = 120 + k * 210 + Math.sin(i * .3 + t * .5 + k) * 40; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); } ctx.restore();
    const r = prng(9); for (let i = 0; i < 120; i++) { const x = (r() * W + t * 8 * (r() - .5) * 4) % W, y = (r() * H + t * 5 * r()) % H, rr = 1 + r() * 3; ctx.fillStyle = rgba(C.cyanWhite, .1 + .2 * r()); ctx.beginPath(); ctx.arc(x, y, rr, 0, 7); ctx.fill(); }
    // species A (rod, warm) with its plasmid ring and the lock
    rod(ctx, A.x, A.y, 420, 170, -.2, '#e58f8a', t);
    ctx.save(); ctx.translate(A.x + 40, A.y - 10); ctx.rotate(-.2); ctx.strokeStyle = rgba(P.amber, .7); ctx.lineWidth = 3; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.ellipse(0, 0, 70, 44, t * .3, 0, 7); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
    // species B (round cluster, cool)
    cocci(ctx, B.x, B.y, 62, C.cyan, t);
    // the phage: arrives at A, takes the lock, flies to B, injects it
    const uIn = eout(lin(tIn - .6, tPick - .1, t)), uFly = eio(lin(tPick + .2, tArrive - .1, t));
    const p0 = [A.x + 150, A.y - 300], p1 = [A.x + 60, A.y - 110], p2 = [B.x - 40, B.y - 110];
    let px, py, pa;
    if (uFly <= 0) { px = mix(p0[0], p1[0], uIn); py = mix(p0[1], p1[1], uIn); pa = Math.PI; }
    else { px = mix(p1[0], p2[0], uFly); py = mix(p1[1], p2[1], uFly) - Math.sin(uFly * Math.PI) * 180; pa = Math.PI + Math.sin(uFly * Math.PI) * .25; }
    const lockOnPhage = t >= tPick && t < tArrive - .1, lockInB = t >= tArrive - .1;
    phage(ctx, px, py, 1.5, pa, t);
    if (!lockOnPhage && !lockInB) padlock(ctx, A.x + 40, A.y - 14, 1.3, { col: P.amber, a: 1 });
    if (lockOnPhage) { const uu = eio(lin(tPick, tPick + .35, t)); padlock(ctx, mix(A.x + 40, px, uu), mix(A.y - 14, py + 30, uu), 1.3, { col: P.amber, glowA: .8 }); }
    if (lockInB) {
      const uu = eio(lin(tArrive - .1, tArrive + .4, t)); padlock(ctx, mix(px, lockB[0], uu), mix(py + 30, lockB[1], uu), 1.3, { col: P.amber, glowA: .9 });
      const ring = (t - tArrive) % 1.2; if (t > tArrive) { ctx.strokeStyle = rgba(P.amber, .5 * (1 - ring / 1.2)); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(lockB[0], lockB[1], 30 + ring * 120, 0, 7); ctx.stroke(); }
    }
    ctx.restore();
    // labels (screen space): what the lock is, and that it jumped species
    const la = lin(tArrive, tArrive + .5, t) * (1 - zc);
    text(ctx, 'DRUG RESISTANCE', 1390, 300, { size: 22, weight: 600, spacing: 6, align: 'center', alpha: la, color: P.amber });
    const lb = lin(tSpec, tSpec + .4, t) * (1 - zc);
    text(ctx, 'species A', A.x, A.y + 170, { size: 30, font: 'Instrument Serif Italic', align: 'center', alpha: lb, color: C.rose });
    text(ctx, 'species B', B.x, B.y + 200, { size: 30, font: 'Instrument Serif Italic', align: 'center', alpha: lb, color: C.cyan });
    finish(ctx, t, { vig: .6 });
  };
};

// ---------- shot 36: the answer in a notebook; it closes, goes into a drawer, the key turns ----------
const notebook = (T) => {
  const t0 = T.S('04a', 'They had found'), tAns = T.S('04a', 'answer'), tClose = T.S('04a', "They hadn't") + .1, tDrawer = T.S('04a', 'published'), tKey = T.S('04a', 'yet');
  const L = { x: 960, y: 540 }; // the lock sketch (world) sits exactly where the lock in the previous shot ended
  return (ctx, t, s) => {
    const uBack = eio(lin(tAns + .1, tClose, t)), z = mix(3.2, 1, uBack) * (1 + .5 * eio(lin(tKey + .3, s.b + .3, t)));
    const fz = eio(lin(tKey + .3, s.b + .3, t)), fx = mix(L.x, 960, fz), fy = mix(L.y, 830, fz);
    ctx.save(); ctx.translate(W / 2, H / 2 + 0); ctx.scale(z, z); ctx.translate(-mix(L.x, fx, fz), -mix(L.y, fy, fz));
    // desk from above, warm lamp pool
    ctx.fillStyle = '#2a1b18'; ctx.fillRect(-1000, -1000, W + 2000, H + 2000);
    for (let i = 0; i < 26; i++) { ctx.fillStyle = `rgba(${i % 2 ? '60,38,30' : '40,26,22'},.35)`; ctx.fillRect(-200, -200 + i * 60, W + 400, 30); }
    const pool = ctx.createRadialGradient(900, 480, 0, 900, 480, 900); pool.addColorStop(0, 'rgba(255,210,154,.32)'); pool.addColorStop(1, 'rgba(255,210,154,0)'); ctx.fillStyle = pool; ctx.fillRect(-200, -200, W + 400, H + 400);
    // drawer (below the front edge of the desk), open while the notebook drops in, then slides shut under the desk top
    const dOpen = 1 - eio(lin(tDrawer + .35, tKey, t)), edge = 810;
    // notebook: open → right page folds over → slides down into the drawer
    const uClose = eio(lin(tClose, tClose + .5, t)), uDrop = eio(lin(tDrawer - .05, tDrawer + .4, t));
    const nbY = mix(0, 560, uDrop), nbS = mix(1, .72, uDrop);
    if (dOpen > 0) { ctx.save(); ctx.beginPath(); ctx.rect(-300, edge, W + 600, 600); ctx.clip(); const dy = edge + 270 * dOpen - 270; ctx.fillStyle = '#1a100e'; ctx.fillRect(560, dy, 800, 280); ctx.fillStyle = '#0c0706'; ctx.fillRect(590, dy + 10, 740, 250); ctx.restore(); }
    ctx.save(); ctx.translate(960, 520 + nbY); ctx.scale(nbS, nbS);
    if (uDrop > .6) { ctx.beginPath(); ctx.rect(-600, edge - 520 - nbY / nbS, 1200, 900); ctx.clip(); }
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-370 + 14, -250 + 16, 740, 500);
    ctx.fillStyle = '#efe4c8'; ctx.fillRect(-370, -250, 370, 500); // left page
    ctx.strokeStyle = 'rgba(80,110,160,.25)'; ctx.lineWidth = 1.5; for (let i = 0; i < 14; i++) { ctx.beginPath(); ctx.moveTo(-350, -200 + i * 32); ctx.lineTo(-20, -200 + i * 32); ctx.stroke(); }
    text(ctx, 'how do resistance genes', -340, -150, { size: 26, font: 'Instrument Serif Italic', color: '#2a2440' }); text(ctx, 'jump between species?', -340, -118, { size: 26, font: 'Instrument Serif Italic', color: '#2a2440' });
    // right page with the sketch (the lock sits at world 960,540 → page-local 0,20 when the book is open and unscaled)
    const fold = uClose; // 0 open, 1 closed (right page lies on the left)
    ctx.save(); ctx.scale(1 - 2 * fold, 1); ctx.fillStyle = fold > .5 ? '#5a2f22' : '#efe4c8'; ctx.fillRect(0, -250, 370, 500);
    if (fold <= .5) {
      for (let i = 0; i < 14; i++) { ctx.strokeStyle = 'rgba(80,110,160,.25)'; ctx.beginPath(); ctx.moveTo(20, -200 + i * 32); ctx.lineTo(350, -200 + i * 32); ctx.stroke(); }
      ctx.strokeStyle = '#2a2440'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(40, -150, 120, 54, 27); ctx.stroke(); ctx.beginPath(); ctx.arc(290, -120, 28, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(318, -96, 24, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(160, -124); ctx.quadraticCurveTo(220, -190, 258, -132); ctx.stroke(); ctx.beginPath(); ctx.moveTo(250, -146); ctx.lineTo(258, -132); ctx.lineTo(242, -128); ctx.stroke();
      padlock(ctx, 0 + 0, 20, 1, { ink: '#2a2440' });
      const wu = lin(tAns, tAns + .8, t); ctx.save(); ctx.beginPath(); ctx.rect(30, 80, 320 * wu, 70); ctx.clip(); text(ctx, 'the answer', 60, 130, { size: 46, font: 'Instrument Serif Italic', color: '#8a3b17' }); ctx.restore();
      if (wu > .9) { ctx.strokeStyle = '#8a3b17'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(60, 146); ctx.lineTo(60 + 230 * lin(tAns + .7, tAns + 1, t), 146); ctx.stroke(); }
    }
    ctx.restore();
    ctx.fillStyle = 'rgba(40,20,10,.25)'; ctx.fillRect(-4, -250, 8, 500);
    ctx.restore();
    // the lock glow that carried over fades into the ink
    if (t < t0 + 1.2) { const a = 1 - lin(t0, t0 + 1.2, t); addGlow(ctx, 960 + 0, 540 + 30, 60, .8 * a, P.amber, '#fff3dd'); }
    // desk front edge + drawer front + keyhole with key (shown as a slim strip in perspective)
    ctx.fillStyle = '#1c1210'; ctx.fillRect(-300, edge, W + 600, 34); ctx.fillStyle = '#3a2620'; ctx.fillRect(-300, edge, W + 600, 4);
    ctx.fillStyle = '#c99a4a'; ctx.beginPath(); ctx.arc(960, edge + 17, 9, 0, 7); ctx.fill();
    const key = eio(lin(tKey - .1, tKey + .35, t)), keyIn = sm(lin(tKey - .6, tKey - .2, t));
    if (keyIn > 0) { ctx.save(); ctx.translate(960, edge + 17); ctx.scale(Math.cos(key * Math.PI / 2) * .9 + .1, 1); ctx.globalAlpha = keyIn; ctx.fillStyle = '#e0b060'; ctx.fillRect(-4, 0, 8, 70); ctx.beginPath(); ctx.arc(0, 86, 18, 0, 7); ctx.fill(); ctx.fillStyle = '#1c1210'; ctx.beginPath(); ctx.arc(0, 86, 7, 0, 7); ctx.fill(); ctx.restore(); }
    if (t > tKey + .3) addGlow(ctx, 960, edge + 17, 60, .6 * (1 - lin(tKey + .3, tKey + 1.2, t)), P.amber, '#fff3dd');
    ctx.fillStyle = '#120b0a'; ctx.fillRect(-300, edge + 34, W + 600, 600);
    ctx.restore();
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- server rack (shared by shots 37 and 38) ----------
function rack(ctx, x, y, w, h, t, { busy = 0, slotY = null } = {}) {
  ctx.fillStyle = '#0b0e2c'; ctx.fillRect(x - 10, y - 10, w + 20, h + 20);
  const g = ctx.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, '#161b4a'); g.addColorStop(1, '#10143a'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  const r = prng(17);
  for (let row = 0; row < Math.floor(h / 46); row++) {
    const ry = y + 14 + row * 46; if (slotY && Math.abs(ry + 14 - slotY) < 30) continue;
    ctx.fillStyle = '#0d1032'; ctx.fillRect(x + 14, ry, w - 28, 32);
    for (let k = 0; k < 10; k++) { const on = Math.sin(t * (2 + r() * 6) * (1 + busy * 3) + r() * 9) > .2 - busy * .4; ctx.fillStyle = rgba(r() < .2 ? P.amber : C.cyan, on ? .95 : .2); ctx.fillRect(x + 30 + k * 16, ry + 12, 7, 7); }
  }
  addGlow(ctx, x + w / 2, y + h / 2, w * 1.2, .14 + .14 * busy, C.cyan, C.cyanWhite);
  if (slotY) { ctx.fillStyle = '#05060f'; ctx.fillRect(x + 50, slotY - 8, w - 100, 16); addGlow(ctx, x + w / 2, slotY, 120, .5 + .3 * busy, C.cyan, C.cyanWhite); ctx.fillStyle = rgba(C.cyanWhite, .8); ctx.fillRect(x + 50, slotY + 5, w - 100, 2); }
}
function card(ctx, x, y, w, h, ang, { q = true, a = 1, lines = 0, hi = 0 } = {}) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(ang);
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-w / 2 + 8, -h / 2 + 10, w, h);
  ctx.fillStyle = '#efe4c8'; ctx.fillRect(-w / 2, -h / 2, w, h);
  if (q) { text(ctx, '?', 0, h * .12, { size: h * .55, font: 'Instrument Serif', color: '#2a2440', align: 'center' }); }
  if (lines) { // the printed idea: the same sketch as in the notebook
    ctx.strokeStyle = hi ? mixHex('#2a2440', P.amberDeep, hi) : '#2a2440'; ctx.lineWidth = 3;
    const k = w / 370; ctx.save(); ctx.scale(k, k); ctx.translate(-185, 40);
    ctx.beginPath(); ctx.roundRect(40, -150, 120, 54, 27); ctx.stroke(); ctx.beginPath(); ctx.arc(290, -120, 28, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(318, -96, 24, 0, 7); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(160, -124); ctx.quadraticCurveTo(220, -190, 258, -132); ctx.stroke(); padlock(ctx, 185, 20, 1, { ink: '#2a2440' }); ctx.restore();
  }
  ctx.restore();
}
// ---------- shot 37: the same question goes into an AI system ----------
const RACK = { x: 1060, y: 110, w: 380, h: 860, slot: 540 };
const question = (T) => {
  const tGive = T.S('04a', 'Then they gave'), tIn = T.S('04a', 'AI system', 0), tG = T.S('04a', 'Google');
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t));
    ctx.save(); zoomAt(ctx, 960, 540, mix(1.18, 1.04, u)); ctx.translate(mix(40, -20, u), 0);
    ctx.fillStyle = '#10143a'; ctx.fillRect(-200, -200, W + 400, H + 400);
    // tiled lab wall with the wall slot the card comes out of
    ctx.strokeStyle = 'rgba(95,143,196,.07)'; ctx.lineWidth = 2; for (let x = -200; x < W + 200; x += 80) { ctx.beginPath(); ctx.moveTo(x, -200); ctx.lineTo(x, H + 200); ctx.stroke(); } for (let y = -200; y < H + 200; y += 80) { ctx.beginPath(); ctx.moveTo(-200, y); ctx.lineTo(W + 200, y); ctx.stroke(); }
    ctx.fillStyle = '#0a0d2a'; ctx.fillRect(250, 300, 260, 480); ctx.fillStyle = '#05060f'; ctx.fillRect(280, 532, 200, 16); addGlow(ctx, 380, 540, 120, .3, P.amber, '#fff3dd');
    text(ctx, 'LAB', 380, 340, { size: 16, weight: 600, spacing: 6, color: C.muted, align: 'center' });
    rack(ctx, RACK.x, RACK.y, RACK.w, RACK.h, t, { busy: lin(tIn + .4, tIn + 1.2, t), slotY: RACK.slot });
    // floor reflection
    ctx.fillStyle = 'rgba(56,214,255,.04)'; ctx.fillRect(RACK.x - 40, RACK.y + RACK.h + 10, RACK.w + 80, 120);
    // the question card: out of the wall, across, into the rack's slot (clipped by the slot)
    const uOut = eout(lin(tGive, tGive + .7, t)), uGo = eio(lin(tGive + .8, tIn + .2, t)), uIn = eio(lin(tIn + .2, tIn + .8, t));
    const cx = mix(mix(380, 640, uOut), RACK.x + RACK.w / 2 - 20, uGo) + uIn * 160, cy = mix(540, RACK.slot, uGo);
    if (uIn < 1) { ctx.save(); ctx.beginPath(); ctx.rect(-200, -200, RACK.x + 50 + 200 + (uIn > 0 ? 0 : 2000), H + 400); ctx.clip(); card(ctx, cx, cy, 220, 150, (1 - uGo) * -.08 + Math.sin(t * 2) * .01 * (1 - uIn), { q: true, a: uOut }); ctx.restore(); }
    if (uIn > 0) addGlow(ctx, RACK.x + RACK.w / 2, RACK.slot, 260, .5 * sm(uIn) * (1 - lin(tIn + .8, tIn + 2, t)) + .1, C.cyan, C.cyanWhite);
    ctx.restore();
    text(ctx, 'SAME QUESTION', 380, 900, { size: 18, weight: 600, spacing: 6, color: C.muted, align: 'center', alpha: lin(tGive + .3, tGive + .8, t) * (1 - lin(s.b - .6, s.b, t)) });
    text(ctx, 'AI SYSTEM · GOOGLE', RACK.x + RACK.w / 2, 70, { size: 20, weight: 600, spacing: 6, color: C.cyan, align: 'center', alpha: lin(tG - .3, tG + .3, t) * (1 - lin(s.b - .6, s.b, t)) });
    finish(ctx, t, { vig: .55 });
  };
};
// ---------- shot 38: two days on the wall clock; the printed idea lands on the notebook page: same lines, a flash ----------
const twoDays = (T) => {
  const t0 = T.S('04a', 'Within two days'), tDays = T.S('04a', 'days'), tMatch = T.S('04a', 'matched'), tTheirs = T.E('04a', 'theirs'), tNext = T.S('04a', 'In another lab');
  return (ctx, t, s) => {
    const spin = eio(lin(t0 - .3, tDays + 1.2, t)), day = (spin * 2) % 1, dayAmt = Math.max(0, Math.sin(day * Math.PI * 2 - Math.PI / 2) * .5 + .5);
    const uM = eio(lin(tMatch - .7, tMatch + .2, t)), flash = Math.exp(-Math.pow((t - tTheirs + .05) / .18, 2));
    ctx.fillStyle = mixHex('#10143a', '#24305e', dayAmt * (1 - uM)); ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.globalAlpha = 1 - uM * .97;
    // window showing day → night → day → night
    ctx.fillStyle = mixHex('#0f1a4a', '#8fb6e0', dayAmt); ctx.fillRect(140, 140, 300, 380); ctx.fillStyle = '#0b0e2c'; ctx.fillRect(282, 140, 16, 380); ctx.fillRect(140, 322, 300, 16);
    const sunA = day * Math.PI * 2 - Math.PI / 2; addGlow(ctx, 290 + Math.cos(sunA + Math.PI) * 120, 420 + Math.sin(sunA + Math.PI) * 220, 50, .7, dayAmt > .3 ? '#ffd29a' : '#d8f7ff', '#ffffff');
    // wall clock (hour hand: four turns = two days)
    const cx = 700, cy = 360, R = 170; ctx.fillStyle = '#e8dcc0'; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill(); ctx.strokeStyle = '#0b0e2c'; ctx.lineWidth = 12; ctx.stroke();
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ctx.strokeStyle = '#20183a'; ctx.lineWidth = i % 3 ? 3 : 6; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * R * .8, cy + Math.sin(a) * R * .8); ctx.lineTo(cx + Math.cos(a) * R * .92, cy + Math.sin(a) * R * .92); ctx.stroke(); }
    const ha = spin * 4 * Math.PI * 2 - Math.PI / 2, ma = spin * 48 * Math.PI * 2 - Math.PI / 2;
    ctx.strokeStyle = '#20183a'; ctx.lineCap = 'round'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(ha) * R * .5, cy + Math.sin(ha) * R * .5); ctx.stroke();
    ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(ma) * R * .78, cy + Math.sin(ma) * R * .78); ctx.stroke();
    // motion blur trail of the minute hand
    ctx.strokeStyle = rgba('#20183a', .15); ctx.lineWidth = 24; ctx.beginPath(); ctx.arc(cx, cy, R * .6, ma - .9 * (spin > 0 && spin < 1 ? 1 : 0), ma); ctx.stroke();
    text(ctx, `${Math.round(spin * 48)} h`, cx, cy + R + 70, { size: 54, font: 'Instrument Serif', align: 'center', color: C.cream });
    rack(ctx, 1300, 110, 360, 860, t, { busy: 1 - uM, slotY: 540 });
    ctx.restore();
    // the printed card slides out of the rack slot during the two days, then flies to the centre; the notebook page comes from the left
    const pr = eout(lin(t0 + .2, tMatch - .8, t));
    const cxp = mix(1480 + 0 * pr, 960, uM), cyp = mix(540 + 90 * pr, 540, uM);
    ctx.save(); if (uM <= 0) { ctx.beginPath(); ctx.rect(0, 548, W, H); ctx.clip(); }
    card(ctx, cxp, cyp + (uM > 0 ? 0 : -90 + 180 * pr * .5), mix(240, 520, uM), mix(170, 360, uM), 0, { q: false, lines: 1, hi: flash }); ctx.restore();
    if (uM > 0) {
      const nx = mix(-300, 960, uM), op = 1 - lin(tMatch + .2, tMatch + .6, t) * .55;
      ctx.save(); ctx.globalAlpha = op; ctx.translate(nx, 540); ctx.rotate((1 - uM) * -.3);
      ctx.fillStyle = `rgba(239,228,200,${.9 * (1 - uM * .8)})`; ctx.fillRect(-260, -180, 520, 360); ctx.strokeStyle = '#8a3b17'; ctx.lineWidth = 3;
      const k = 520 / 370; ctx.scale(k, k); ctx.translate(-185, 40); ctx.beginPath(); ctx.roundRect(40, -150, 120, 54, 27); ctx.stroke(); ctx.beginPath(); ctx.arc(290, -120, 28, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(318, -96, 24, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(160, -124); ctx.quadraticCurveTo(220, -190, 258, -132); ctx.stroke(); padlock(ctx, 185, 20, 1, { ink: '#8a3b17' });
      ctx.restore();
      text(ctx, 'AI', 960 + 280, 540 - 200, { size: 20, weight: 600, spacing: 6, color: C.cyan, alpha: lin(tMatch, tMatch + .4, t) * (1 - lin(tNext - 1, tNext - .4, t)) });
      text(ctx, 'TEAM', 960 - 280, 540 - 200, { size: 20, weight: 600, spacing: 6, color: P.amber, alpha: lin(tMatch, tMatch + .4, t) * (1 - lin(tNext - 1, tNext - .4, t)), align: 'right' });
    }
    // after the match: the two times side by side, then everything collapses into one point (carrier → pupil)
    const sum = lin(tTheirs + .3, tTheirs + .8, t) * (1 - lin(tNext - .9, tNext - .4, t));
    text(ctx, 'about ten years', 960 - 300, 860, { size: 58, font: 'Instrument Serif Italic', align: 'center', color: P.amber, alpha: sum });
    text(ctx, 'two days', 960 + 300, 860, { size: 58, font: 'Instrument Serif Italic', align: 'center', color: C.cyan, alpha: sum });
    if (flash > .01) { ctx.fillStyle = rgba('#fff6e6', .55 * flash); ctx.fillRect(0, 0, W, H); addGlow(ctx, 960, 540, 500, flash, P.amber, '#ffffff'); }
    const col = eio(lin(tNext - .7, tNext + .2, t)); if (col > 0) { ctx.fillStyle = rgba('#070918', col); ctx.fillRect(0, 0, W, H); addGlow(ctx, 960, 540, mix(300, 40, col), col, '#ffd29a', '#ffffff'); }
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- shot 40: an eye; Robin scans it; dive through the pupil to the retina, a dark spot spreads ----------
const eye = (T) => {
  const t0 = T.S('04a', 'In another lab'), tRobin = T.S('04a', 'Robin'), tDive = T.S('04a', 'looked'), tBlind = T.S('04a', 'blindness'), tEnd = T.S('04a', 'It suggested');
  return (ctx, t, s) => {
    const dive = ein(lin(tDive, tDive + 1.1, t)), z = Math.pow(26, dive) * (1 + .04 * lin(s.a, tDive, t));
    const ret = sm(lin(tDive + .7, tDive + 1.2, t));
    if (ret < 1) {
      ctx.save(); zoomAt(ctx, 960, 540, z);
      const bg = ctx.createRadialGradient(960, 540, 0, 960, 540, 1100); bg.addColorStop(0, '#5a3a3c'); bg.addColorStop(1, '#1a1230'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      // almond eye with lids (blinks once, slowly)
      const bl = Math.exp(-Math.pow((t - (t0 + 1.0)) / .09, 2)), ow = 560, oh = 230 * (1 - bl * .95);
      ctx.save(); ctx.beginPath(); ctx.moveTo(960 - ow, 540); ctx.quadraticCurveTo(960, 540 - oh * 2, 960 + ow, 540); ctx.quadraticCurveTo(960, 540 + oh * 2, 960 - ow, 540); ctx.closePath();
      ctx.fillStyle = '#efe6dc'; ctx.fill(); ctx.clip();
      const look = Math.sin(t * .6) * 18;
      const ig = ctx.createRadialGradient(960 + look, 540, 20, 960 + look, 540, 200); ig.addColorStop(0, '#2f9fb8'); ig.addColorStop(.6, '#1d5f86'); ig.addColorStop(1, '#0d2440'); ctx.fillStyle = ig; ctx.beginPath(); ctx.arc(960 + look, 540, 200, 0, 7); ctx.fill();
      const r = prng(3); ctx.strokeStyle = 'rgba(216,247,255,.25)'; ctx.lineWidth = 2; for (let i = 0; i < 90; i++) { const a = r() * 7; ctx.beginPath(); ctx.moveTo(960 + look + Math.cos(a) * 80, 540 + Math.sin(a) * 80); ctx.lineTo(960 + look + Math.cos(a) * (150 + r() * 45), 540 + Math.sin(a) * (150 + r() * 45)); ctx.stroke(); }
      const pr = 76 + 6 * Math.sin(t * 1.3); ctx.fillStyle = '#05060f'; ctx.beginPath(); ctx.arc(960 + look * (1 - dive), 540, pr, 0, 7); ctx.fill();
      // the flash from the last shot still in the pupil
      addGlow(ctx, 960 + look * (1 - dive), 540, 60, .6 * (1 - lin(t0, t0 + 1.2, t)) + .25 * dive, '#ffd29a', '#ffffff');
      ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.beginPath(); ctx.ellipse(1010 + look, 490, 22, 14, -.5, 0, 7); ctx.fill();
      const sh = ctx.createLinearGradient(0, 540 - oh, 0, 540); sh.addColorStop(0, 'rgba(40,20,30,.5)'); sh.addColorStop(1, 'rgba(40,20,30,0)'); ctx.fillStyle = sh; ctx.fillRect(0, 0, W, 540);
      ctx.restore();
      ctx.strokeStyle = '#2a1626'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(960 - ow, 540); ctx.quadraticCurveTo(960, 540 - oh * 2, 960 + ow, 540); ctx.stroke();
      for (let i = 0; i < 14; i++) { const q = i / 13, x = mix(960 - ow * .8, 960 + ow * .8, q), y = 540 - oh * 2 * (2 * q * (1 - q)) * 1.0; ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x + (q - .5) * 40, y - 36 - Math.sin(q * Math.PI) * 10); ctx.stroke(); }
      // Robin: a cyan scanning ring that circles the iris
      const ra = lin(tRobin - .3, tRobin + .2, t) * (1 - dive);
      if (ra > 0) { ctx.save(); ctx.translate(960, 540); ctx.rotate(t * .8); ctx.strokeStyle = rgba(C.cyan, .8 * ra); ctx.lineWidth = 3; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.arc(0, 0, 250, k * Math.PI / 2 + .15, k * Math.PI / 2 + 1.2); ctx.stroke(); } ctx.setLineDash([3, 9]); ctx.beginPath(); ctx.arc(0, 0, 280, 0, 7); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
        const sy = 540 + Math.sin(t * 2.2) * 200; ctx.fillStyle = rgba(C.cyan, .25 * ra); ctx.fillRect(700, sy - 1, 520, 2); }
      ctx.restore();
      if (ra > 0) { text(ctx, 'ROBIN', 960 + 330, 300, { size: 24, weight: 600, spacing: 8, color: C.cyan, alpha: ra }); text(ctx, 'AI system', 960 + 330, 336, { size: 26, font: 'Instrument Serif Italic', color: C.cream, alpha: ra }); }
    }
    if (ret > 0) {
      ctx.save(); ctx.globalAlpha = ret; zoomAt(ctx, 960, 540, 1.25 - .2 * eio(lin(tDive + .7, tEnd, t)));
      // retina as a landscape: warm dome, vessels as glowing rivers branching from the optic disc, the macula in the centre
      const g = ctx.createRadialGradient(960, 620, 0, 960, 620, 1200); g.addColorStop(0, '#d0703c'); g.addColorStop(.5, '#8a3426'); g.addColorStop(1, '#2a0f1c'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const r = prng(41); const disc = [1420, 520];
      addGlow(ctx, disc[0], disc[1], 110, .8, '#ffd29a', '#fff3dd');
      const branch = (x, y, a, len, w, d) => { if (d > 5 || w < 1) return; const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len; ctx.strokeStyle = 'rgba(110,20,30,.85)'; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo((x + x2) / 2 + (r() - .5) * 60, (y + y2) / 2 + (r() - .5) * 60, x2, y2); ctx.stroke(); branch(x2, y2, a + (r() - .5) * 1.2 + .3, len * .75, w * .7, d + 1); branch(x2, y2, a + (r() - .5) * 1.2 - .3, len * .7, w * .65, d + 1); };
      for (let k = 0; k < 4; k++) branch(disc[0], disc[1], Math.PI + (k - 1.5) * .8, 260, 12, 0);
      // the macula, then the dark spot that spreads
      addGlow(ctx, 900, 560, 140, .35, '#ffd29a', '#fff3dd');
      const sp = eout(lin(tBlind - .2, tEnd - .3, t));
      if (sp > 0) { const dg = ctx.createRadialGradient(900, 560, 0, 900, 560, 70 + 300 * sp); dg.addColorStop(0, 'rgba(20,8,16,.92)'); dg.addColorStop(.7, 'rgba(20,8,16,.6)'); dg.addColorStop(1, 'rgba(20,8,16,0)'); ctx.fillStyle = dg; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const a = i / 40 * Math.PI * 2, rr = (70 + 300 * sp) * (1 + .12 * Math.sin(a * 5 + t)); ctx[i ? 'lineTo' : 'moveTo'](900 + Math.cos(a) * rr, 560 + Math.sin(a) * rr); } ctx.fill(); }
      ctx.restore();
      text(ctx, 'a common cause of blindness', 960, 960, { size: 40, font: 'Instrument Serif Italic', align: 'center', color: C.cream, alpha: lin(tBlind, tBlind + .5, t) * ret });
      // a drop falls in from above (carrier → eye-drop shot)
      const df = lin(tEnd - .9, tEnd, t); if (df > 0) { const dy = mix(-80, 300, ein(df)); ctx.fillStyle = rgba('#e8fbff', .9); ctx.beginPath(); ctx.moveTo(960, dy - 50); ctx.quadraticCurveTo(990, dy, 960, dy + 22); ctx.quadraticCurveTo(930, dy, 960, dy - 50); ctx.fill(); addGlow(ctx, 960, dy, 60, .7, C.cyan, '#ffffff'); }
    }
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- shot 41: the eye drop falls in slow motion; inside it, the reflection of a small packet from Japan ----------
function packet(ctx, x, y, w, h, t) {
  ctx.fillStyle = '#f3efe2'; ctx.fillRect(x - w / 2, y - h / 2, w, h);
  ctx.fillStyle = '#2a4a8a'; ctx.fillRect(x - w / 2, y + h * .18, w, h * .32);
  ctx.strokeStyle = '#f3efe2'; ctx.lineWidth = Math.max(1, w * .015); for (let k = 0; k < 3; k++) { ctx.beginPath(); for (let i = 0; i <= 20; i++) { const px = x - w / 2 + i * w / 20, py = y + h * .26 + k * h * .08 + Math.sin(i * .9 + k) * h * .025; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
  ctx.fillStyle = '#c8352e'; ctx.beginPath(); ctx.arc(x, y - h * .14, w * .16, 0, 7); ctx.fill();
}
const dropShot = (T) => {
  const t0 = T.S('04a', 'It suggested'), tJ = T.S('04a', 'Japan'), tG = T.S('04a', 'glaucoma'), tEnd = T.S('04a', 'So far');
  return (ctx, t, s) => {
    const bg = ctx.createRadialGradient(960, 520, 0, 960, 520, 1100); bg.addColorStop(0, '#1d2458'); bg.addColorStop(1, '#070918'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const r = prng(51); for (let i = 0; i < 26; i++) addGlow(ctx, (r() * W + t * 6) % W, r() * H, 30 + r() * 70, .12, r() < .4 ? P.amber : C.cyan, '#ffffff');
    // the dropper bottle at the top, tilted, with the packet's red circle on its label
    const bt = sm(lin(s.a, t0 + .3, t));
    ctx.save(); ctx.translate(960, mix(-220, 60, bt));
    ctx.fillStyle = '#e8ecf5'; ctx.beginPath(); ctx.roundRect(-70, -220, 140, 220, 18); ctx.fill();
    ctx.fillStyle = '#2a4a8a'; ctx.fillRect(-70, -150, 140, 70); ctx.fillStyle = '#c8352e'; ctx.beginPath(); ctx.arc(0, -115, 18, 0, 7); ctx.fill();
    ctx.fillStyle = '#d8dcef'; ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(30, 0); ctx.lineTo(10, 70); ctx.lineTo(-10, 70); ctx.fill();
    ctx.restore();
    // the drop: forms at the tip, then falls slowly through the frame, wobbling
    const form = eout(lin(t0 - .2, t0 + .6, t)), fall = lin(t0 + .6, tEnd + .5, t), y = 140 + form * 40 + 420 * Math.pow(fall, 1.6), R = 40 + 120 * form;
    const wob = 1 + .05 * Math.sin(t * 7), sx = R * wob, sy = R / wob;
    ctx.save(); ctx.translate(960, y + R * .6); ctx.beginPath(); ctx.moveTo(0, -sy * 1.7); ctx.bezierCurveTo(sx * .6, -sy * .9, sx, -sy * .1, sx, sy * .35); ctx.arc(0, sy * .35, sx, 0, Math.PI); ctx.bezierCurveTo(-sx, -sy * .1, -sx * .6, -sy * .9, 0, -sy * 1.7); ctx.closePath();
    const dg = ctx.createRadialGradient(-sx * .3, -sy * .2, 0, 0, sy * .3, sx * 1.3); dg.addColorStop(0, 'rgba(232,251,255,.55)'); dg.addColorStop(1, 'rgba(120,200,240,.18)'); ctx.fillStyle = dg; ctx.fill();
    ctx.save(); ctx.clip();
    // refraction: the packet upside down and squeezed inside the drop
    ctx.save(); ctx.translate(0, sy * .3); ctx.scale(1, -1); ctx.globalAlpha = .8 * lin(t0 + .4, tJ, t) + .2; packet(ctx, 0, 0, sx * 1.1, sy * .9, t); ctx.restore();
    ctx.restore();
    ctx.strokeStyle = 'rgba(232,251,255,.7)'; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.beginPath(); ctx.ellipse(-sx * .45, -sy * .1, sx * .12, sy * .22, -.4, 0, 7); ctx.fill();
    ctx.restore();
    addGlow(ctx, 960, y + R * .6, R * 2.2, .25, C.cyan, C.cyanWhite);
    const la = lin(tJ - .2, tJ + .4, t) * (1 - lin(s.b - .6, s.b, t));
    text(ctx, 'already sold in Japan', 960 - 520, 640, { size: 46, font: 'Instrument Serif Italic', align: 'center', color: C.cream, alpha: la });
    text(ctx, 'FOR GLAUCOMA', 960 - 520, 690, { size: 20, weight: 600, spacing: 6, align: 'center', color: C.muted, alpha: lin(tG, tG + .4, t) * (1 - lin(s.b - .6, s.b, t)) });
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- shot 42: a petri dish under a lamp; the drop lands, some cells light up. Only cells, a lead not a cure. ----------
const CELLS = (() => { const r = prng(61), c = []; for (let j = -9; j <= 9; j++) for (let i = -14; i <= 14; i++) { const x = i * 34 + (j % 2) * 17, y = j * 29; if ((x / 480) ** 2 + (y / 260) ** 2 < 1) c.push({ x, y, d: Math.hypot(x, y * 1.6), lit: r() < .32, ph: r() * 7 }); } return c; })();
const DISH = { x: 960, y: 640, k: .42 };
const petri = (T) => {
  const t0 = T.S('04a', 'So far'), tCells = T.S('04a', 'cells in'), tLead = T.S('04a', "It's a lead"), tCure = T.S('04a', 'not a cure'), tEnd = T.S('04a', 'But it was');
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t));
    ctx.save(); zoomAt(ctx, 960, 600, mix(1.08, 1.0, u) + .25 * eio(lin(tEnd - .6, s.b, t)));
    ctx.fillStyle = '#0d1030'; ctx.fillRect(-200, -200, W + 400, H + 400);
    const tb = ctx.createLinearGradient(0, 420, 0, H); tb.addColorStop(0, '#161a46'); tb.addColorStop(1, '#0a0c26'); ctx.fillStyle = tb; ctx.fillRect(-200, 420, W + 400, H);
    cone(ctx, 960, -20, 900, 0, .42, '#ffe7c4', .28); ctx.fillStyle = '#0b0e2c'; ctx.beginPath(); ctx.moveTo(880, -40); ctx.lineTo(1040, -40); ctx.lineTo(1000, 0); ctx.lineTo(920, 0); ctx.fill();
    // dish: glass rim, medium, cell honeycomb in perspective
    ctx.save(); ctx.translate(DISH.x, DISH.y);
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(10, 40, 560, 560 * DISH.k, 0, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(232,180,160,.22)'; ctx.beginPath(); ctx.ellipse(0, 0, 520, 520 * DISH.k, 0, 0, 7); ctx.fill();
    const tLand = t0 + .7, wave = (t - tLand) * 520;
    ctx.save(); ctx.scale(1, DISH.k / .54);
    for (const c of CELLS) {
      const hit = t > tLand && c.d < wave, glowC = c.lit && hit ? sm(lin(0, .5, (wave - c.d) / 520)) : 0;
      ctx.fillStyle = glowC ? mixHex('#e2a39a', '#ffe2b0', glowC) : '#c98a86'; ctx.globalAlpha = .55 + .35 * glowC;
      ctx.beginPath(); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3 + Math.PI / 6; ctx[k ? 'lineTo' : 'moveTo'](c.x + Math.cos(a) * 15, c.y + Math.sin(a) * 15 + Math.sin(t * 1.5 + c.ph) * 1.2); } ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1; if (glowC > 0) addGlow(ctx, c.x, c.y, 30, .5 * glowC * (.8 + .2 * Math.sin(t * 3 + c.ph)), P.amber, '#fff3dd');
    }
    ctx.restore();
    // ripple where the drop landed
    if (t > tLand) for (let i = 0; i < 3; i++) { const q = ((t - tLand) * .6 + i / 3) % 1, rr = 20 + q * 480; ctx.strokeStyle = rgba(C.cyanWhite, .35 * (1 - q) * (1 - lin(tLand + 3, tLand + 4, t))); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, 0, rr, rr * DISH.k, 0, 0, 7); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(216,247,255,.55)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(0, 0, 540, 540 * DISH.k, 0, 0, 7); ctx.stroke();
    ctx.strokeStyle = 'rgba(216,247,255,.25)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, -26, 548, 548 * DISH.k, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
    ctx.restore();
    // the falling drop
    const df = lin(t0 - .3, tLand, t); if (df < 1) { const dy = mix(-100, DISH.y, ein(df)); ctx.fillStyle = rgba('#e8fbff', .9); ctx.beginPath(); ctx.moveTo(960, dy - 50); ctx.quadraticCurveTo(992, dy, 960, dy + 22); ctx.quadraticCurveTo(928, dy, 960, dy - 50); ctx.fill(); addGlow(ctx, 960, dy, 70, .7, C.cyan, '#ffffff'); }
    ctx.restore();
    const a1 = lin(tCells - .2, tCells + .3, t) * (1 - lin(tEnd - .5, tEnd, t));
    text(ctx, 'TESTED ON', 160, 180, { size: 18, weight: 600, spacing: 6, color: C.muted, alpha: a1 }); text(ctx, 'cells in a dish', 160, 236, { size: 52, font: 'Instrument Serif Italic', color: C.cream, alpha: a1 });
    const a2 = lin(tLead, tLead + .4, t) * (1 - lin(tEnd - .5, tEnd, t)), a3 = lin(tCure, tCure + .4, t) * (1 - lin(tEnd - .5, tEnd, t));
    text(ctx, 'a lead', 1760, 180, { size: 52, font: 'Instrument Serif Italic', color: P.amber, alpha: a2, align: 'right' }); text(ctx, 'not a cure', 1760, 236, { size: 52, font: 'Instrument Serif Italic', color: C.muted, alpha: a3, align: 'right' });
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- shot 43: glowing footprints lead into a misty forest (nobody there); the eye drop hangs like a lantern ----------
const forest = (T) => {
  const t0 = T.S('04a', 'But it was'), tMach = T.S('04a', 'machine'), tKeep = T.S('04a', 'Keep that'), tMeet = T.S('04a', "We'll meet");
  const trees = (() => { const r = prng(71), a = []; for (let i = 0; i < 46; i++) { const side = i % 2 ? 1 : -1, d = r(); a.push({ side, d, off: 120 + r() * 900, w: 20 + r() * 50, lean: (r() - .5) * .05 }); } return a.sort((p, q) => q.d - p.d); })();
  return (ctx, t, s) => {
    const dolly = lin(s.a, s.b, t), VP = [960, 500];
    skyGrad(ctx, { t, top: '#0a0c26', mid: '#18215a', bottom: '#4a5fa8', stars: .25 });
    fogBand(ctx, t, VP[1], 260, { a: .45, hex: '#8ab8e8' });
    // ground + path in perspective
    ctx.fillStyle = '#0f1338'; ctx.fillRect(0, VP[1], W, H);
    ctx.fillStyle = '#1b2257'; ctx.beginPath(); ctx.moveTo(VP[0] - 20, VP[1]); ctx.lineTo(VP[0] + 20, VP[1]); ctx.lineTo(VP[0] + 520, H); ctx.lineTo(VP[0] - 520, H); ctx.fill();
    // trees at depth d (0 = far, 1 = near); camera dollies forward
    for (const tr of trees) {
      const dd = clamp(tr.d + dolly * .25), f = 1 / (1.08 - dd), x = VP[0] + tr.side * tr.off * f * .25, base = VP[1] + 40 * f, w = tr.w * f * .25, h = 900 * f * .3;
      if (x < -200 || x > W + 200) continue;
      ctx.fillStyle = mixHex('#3a4c92', '#080a20', clamp(dd * 1.3)); ctx.save(); ctx.translate(x, base); ctx.rotate(tr.lean); ctx.fillRect(-w / 2, -h - 400, w, h + 400); ctx.restore();
      if (dd > .7) { ctx.fillStyle = mixHex('#1a2050', '#080a20', dd); ctx.beginPath(); ctx.ellipse(x, base - h * .9, w * 3, w * 1.4, 0, 0, 7); ctx.fill(); }
    }
    fogBand(ctx, t, VP[1] + 160, 260, { a: .25, hex: '#8ab8e8', seed: 8 });
    // footprints: appear one by one, walking away into the fog; square-cut, cyan (they belong to a machine)
    const n = 18, prog = lin(t0 - .2, tMach + .6, t) * n;
    for (let i = 0; i < n; i++) {
      const a = clamp(prog - i); if (a <= 0) continue;
      const q = i / n, d = Math.pow(1 - q, 1.6) - dolly * .12, py = VP[1] + 560 * d + 20, side = i % 2 ? 1 : -1, px = VP[0] + side * 34 * (d + .05), sc = .2 + d * 1.4;
      if (py > H + 40 || py < VP[1]) continue;
      ctx.save(); ctx.translate(px, py); ctx.scale(sc, sc * .5); ctx.fillStyle = rgba(C.cyanWhite, .85 * a); ctx.beginPath(); ctx.roundRect(-14, -36, 28, 50, 8); ctx.fill(); ctx.beginPath(); ctx.roundRect(-12, 20, 24, 20, 6); ctx.fill(); ctx.restore();
      addGlow(ctx, px, py, 40 * sc + 10, .45 * a, C.cyan, C.cyanWhite);
    }
    // the eye drop, hanging from a branch on the right like a little lantern; it pulses when the voice asks us to keep it in mind
    const ka = sm(lin(tKeep - .5, tKeep + .3, t)), dx = 1360, dy = 360 + Math.sin(t * 1.1) * 8;
    if (ka > 0) {
      ctx.strokeStyle = rgba('#0a0c26', ka); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(W + 40, 240); ctx.quadraticCurveTo(1500, 270, dx - 60, 290); ctx.stroke();
      ctx.strokeStyle = rgba('#e8fbff', .5 * ka); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(dx, 290); ctx.lineTo(dx, dy - 36); ctx.stroke();
      ctx.fillStyle = rgba('#ffe2b0', ka); ctx.beginPath(); ctx.moveTo(dx, dy - 36); ctx.quadraticCurveTo(dx + 26, dy + 4, dx, dy + 20); ctx.quadraticCurveTo(dx - 26, dy + 4, dx, dy - 36); ctx.fill();
      const pulse = .6 + .4 * Math.sin((t - tKeep) * 3);
      addGlow(ctx, dx, dy, 90 + 40 * pulse, .7 * ka, P.amber, '#fff3dd');
      for (let i = 0; i < 2; i++) { const q = ((t - tMeet) * .5 + i / 2) % 1; if (t > tMeet) { ctx.strokeStyle = rgba(P.amber, .4 * (1 - q) * ka); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(dx, dy, 30 + q * 90, 0, 7); ctx.stroke(); } }
    }
    const ma = lin(tMach - .4, tMach + .2, t) * (1 - lin(tKeep - .3, tKeep + .1, t));
    text(ctx, 'the idea came from a machine', 960, 980, { size: 44, font: 'Instrument Serif Italic', align: 'center', color: C.cream, alpha: ma });
    finish(ctx, t, { vig: .6 });
  };
};

// ---------- the bus (shots 44–48): you on a bus seat, phone in hand; the window shows the city sliding by ----------
const YOU = { x: 1010, y: 860, h: 470 };        // feet of the seated figure
const PHONE = { x: YOU.x + 19 * YOU.h / 100, y: YOU.y + (-76 + 10) * YOU.h / 100 }; // phone glow point in the person() rig
function bus(ctx, t, { night = 0, seatsFrom = 0 } = {}) {
  // window band with the city sliding past
  const sky = ctx.createLinearGradient(0, 120, 0, 560); sky.addColorStop(0, mixHex('#7fa8d8', '#0d1240', night)); sky.addColorStop(1, mixHex('#e6c7a8', '#2a3a80', night)); ctx.fillStyle = sky; ctx.fillRect(-200, 120, W + 400, 440);
  const city = once('bus_city', () => cityLayer({ seed: 505, z: 1.5, base: 560, hMin: 90, hMax: 330, col: '#26306e', lit: .25, litCol: P.amber, span: 3600, fogAmt: .3 }));
  ctx.save(); ctx.globalAlpha = 1; city.draw(ctx, t, t * 260 % 3600, 0, 1); ctx.restore();
  if (night < 1) { ctx.fillStyle = rgba('#e6c7a8', .25 * (1 - night)); ctx.fillRect(-200, 120, W + 400, 440); }
  // streetlights flicking past
  for (let i = 0; i < 4; i++) { const x = W + 200 - ((t * 900 + i * 600) % (W + 600)); addGlow(ctx, x, 200, 60, .5 * night, P.amber, '#fff3dd'); }
  // bus body: roof, window pillars, rails, seats
  ctx.fillStyle = '#141846'; ctx.fillRect(-200, -200, W + 400, 320); ctx.fillRect(-200, 560, W + 400, 700);
  for (let x = -40; x < W + 200; x += 420) ctx.fillRect(x, 120, 34, 440);
  ctx.fillStyle = '#c9a77a'; ctx.fillRect(-200, 150, W + 400, 6); for (let x = 200; x < W; x += 420) { ctx.fillRect(x, 150, 5, 40); ctx.beginPath(); ctx.arc(x + 2, 200, 14, 0, 7); ctx.strokeStyle = '#c9a77a'; ctx.lineWidth = 4; ctx.stroke(); }
  // luggage rack
  ctx.fillStyle = '#0f1338'; ctx.fillRect(-200, 110, W + 400, 22);
  // interior light
  const il = ctx.createLinearGradient(0, 560, 0, H); il.addColorStop(0, rgba('#ffd29a', .12)); il.addColorStop(1, 'rgba(255,210,154,0)'); ctx.fillStyle = il; ctx.fillRect(-200, 560, W + 400, 520);
}
function seat(ctx, x, y) { ctx.fillStyle = '#2a2f6e'; ctx.beginPath(); ctx.roundRect(x - 70, y - 260, 40, 250, 12); ctx.fill(); ctx.beginPath(); ctx.roundRect(x - 70, y - 150, 170, 40, 12); ctx.fill(); ctx.fillStyle = '#c8661e'; ctx.fillRect(x - 70, y - 250, 40, 8); ctx.fillStyle = '#0b0e2c'; ctx.fillRect(x - 10, y - 110, 12, 110); }
const SEATS = [-120, 230, 580, 930, 1280, 1630, 1980];
// the minis: where they sit or stand once they've climbed out of the phone
const MINIS = (() => {
  const r = prng(88), m = [];
  for (const sx of SEATS) for (let k = 0; k < 3; k++) if (!(Math.abs(sx - 930) < 10)) m.push({ x: sx - 20 + k * 40, y: 724 - (k % 2) * 6, sit: true, h: 118 + r() * 14 });
  for (let i = 0; i < 26; i++) m.push({ x: -100 + r() * 2100, y: 1000 + r() * 70, sit: false, h: 130 + r() * 24, flip: r() < .5 });
  for (let i = 0; i < 22; i++) m.push({ x: -100 + r() * 2100, y: 108, sit: true, h: 52 + r() * 8 });
  return m.map((p, i) => ({ ...p, d: r() * .9 + (Math.abs(p.x - PHONE.x) / 2200) * 1.4, skin: mixHex('#7a4a30', '#e2b994', r()), ph: r() * 7, i }));
})();
const busShot = (T, { phase }) => {
  const tPocket = T.S('04a', 'And a piece'), tPk = T.S('04a', 'pocket'), tK = T.S('04a', 'A thousand'), tCall = T.S('04a', 'on call'), tDN = T.S('04a', 'day and night'), tMost = T.S('04a', 'Most of us'), tFix = T.S('04a', 'fix'), tEm = T.S('04a', 'emails'), tEnd = T.S('05a', 'So what');
  return (ctx, t, s) => {
    const night = phase === 'thousand' ? eio(lin(tCall, tDN + .8, t)) : 1;
    // camera: pocket close-up / wide for the thousand / closer on you for the email
    let z, cx, cy;
    if (phase === 'pocket') { z = mix(2.6, 3.4, eio(lin(tPocket, s.b, t))); cx = PHONE.x - 20; cy = PHONE.y + 80 - 80 * eio(lin(tPk, s.b, t)); }
    else if (phase === 'thousand') { z = mix(1.0, 1.04, lin(s.a, s.b, t)); cx = 960; cy = 560; }
    else { z = mix(1.06, 1.45, eio(lin(tMost, tEm + .6, t))) - .2 * eio(lin(tEm + 1.2, s.b, t)); cx = mix(960, YOU.x, eio(lin(tMost, tEm, t))); cy = mix(560, 600, eio(lin(tMost, tEm, t))) - 260 * eio(lin(tEm + 1.2, s.b, t)); }
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-cx, -cy);
    bus(ctx, t, { night });
    for (const sx of SEATS) seat(ctx, sx, 870);
    // you: amber coat, phone in hand
    person(ctx, YOU.x, YOU.y, YOU.h, t, { sit: true, phone: true, coat: P.amber, typing: phase === 'email' && t > tFix - .6 && t < tEm + .8 });
    // glowing footprints climbing up into the pocket (only in the pocket shot)
    if (phase === 'pocket') {
      for (let i = 0; i < 12; i++) { const q = i / 11, a = clamp(lin(s.a, tPk, t) * 12 - i); if (a <= 0) continue; const px = mix(PHONE.x - 260, PHONE.x - 30, q), py = mix(YOU.y - 20, PHONE.y + 110, q) + (i % 2) * 10; ctx.fillStyle = rgba(C.cyanWhite, .8 * a); ctx.beginPath(); ctx.roundRect(px - 4, py - 7, 8, 12, 3); ctx.fill(); addGlow(ctx, px, py, 14, .4 * a, C.cyan, C.cyanWhite); }
      addGlow(ctx, PHONE.x - 10, PHONE.y + 40, 60, .6 * sm(lin(tPk - .6, tPk + .2, t)), C.cyan, C.cyanWhite);
    }
    // minis climb out of the phone and take every seat, the rack, the aisle
    if (phase !== 'pocket') {
      const tOut = phase === 'thousand' ? tK - .2 : -1e9, sigh = phase === 'email' ? sm(lin(tEm - .1, tEm + .5, t)) * (1 - .4 * sm(lin(tEm + 1.5, tEm + 2.3, t))) : 0;
      for (const m of MINIS) {
        const u = clamp((t - tOut - m.d * 1.6) / .7); if (u <= 0) continue;
        const x = mix(PHONE.x, m.x, eio(u)), y = mix(PHONE.y, m.y, eio(u)) - Math.sin(u * Math.PI) * 160;
        mini(ctx, x, y, m.h * mix(.3, 1, eout(u)), t + m.ph, { sit: m.sit && u >= 1, flip: m.flip, skin: m.skin, sigh: u >= 1 ? sigh : 0, phase: !m.sit && u >= 1 ? null : null });
        if (u < 1) addGlow(ctx, x, y - 30, 26, .5, C.cyan, C.cyanWhite);
        if (sigh > .4 && m.i % 5 === 0) { const q = (t - tEm) * .8 % 1; ctx.strokeStyle = rgba(C.cream, .5 * (1 - q) * sigh); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(m.x + 12, m.y - m.h * 1.05 - q * 18, 4 + q * 5, Math.PI, 0); ctx.stroke(); }
      }
      addGlow(ctx, PHONE.x, PHONE.y, 80, .7, C.cyan, C.cyanWhite);
    }
    ctx.restore();
    if (phase === 'thousand') {
      const n = Math.round(1000 * eout(lin(tK, tCall + .3, t))), a = lin(tK, tK + .3, t) * (1 - lin(s.b - .5, s.b, t));
      text(ctx, n.toLocaleString('en-US'), 160, 300, { size: 120, font: 'Instrument Serif', color: C.cream, alpha: a });
      text(ctx, 'PhDs, on call', 166, 360, { size: 40, font: 'Instrument Serif Italic', color: C.cyan, alpha: a });
      text(ctx, 'DAY AND NIGHT', 168, 410, { size: 18, weight: 600, spacing: 6, color: C.muted, alpha: lin(tDN, tDN + .4, t) * a });
    }
    if (phase === 'email') {
      // the request, typed into a chat bubble above the phone
      const msg = 'make this email more polite', k = Math.floor(msg.length * lin(tFix - .6, tEm + .2, t)), a = lin(tFix - .8, tFix - .5, t) * (1 - lin(tEm + 2.2, tEm + 2.7, t));
      if (a > 0) { const bx = 1180, by = 300; ctx.globalAlpha = a; ctx.fillStyle = '#e8f6ff'; ctx.beginPath(); ctx.roundRect(bx, by, 600, 90, 30); ctx.fill(); ctx.beginPath(); ctx.moveTo(bx + 40, by + 86); ctx.lineTo(bx + 10, by + 130); ctx.lineTo(bx + 90, by + 86); ctx.fill(); ctx.globalAlpha = 1;
        text(ctx, msg.slice(0, k) + (Math.sin(t * 12) > 0 ? '|' : ''), bx + 34, by + 58, { size: 34, weight: 500, color: '#141846', alpha: a }); }
    }
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- shot 45: inside the phone: a chat, a tiny figure, a doctoral hat floats down onto it ----------
const display = (T) => {
  const t0 = T.S('04a', 'When OpenAI'), tSam = T.S('04a', 'Sam Altman'), tPhd = T.S('04a', 'PhD-level'), tAny = T.S('04a', 'any area'), tK = T.S('04a', 'A thousand');
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t));
    const bg = ctx.createRadialGradient(1300, 540, 0, 1300, 540, 1300); bg.addColorStop(0, '#1d2458'); bg.addColorStop(1, '#070918'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const r = prng(5); for (let i = 0; i < 20; i++) addGlow(ctx, r() * W, r() * H, 30 + r() * 60, .08, P.amber, '#ffffff');
    // phone: large, right of centre, slight float
    const px = 1280, py = 560 + Math.sin(t * .8) * 6, pw = 560, ph = 1060;
    ctx.save(); ctx.translate(px, py); ctx.rotate(-.03 + u * .02);
    ctx.fillStyle = '#05060f'; ctx.beginPath(); ctx.roundRect(-pw / 2 - 18, -ph / 2 - 18, pw + 36, ph + 36, 70); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.roundRect(-pw / 2, -ph / 2, pw, ph, 56); ctx.clip();
    const sg = ctx.createLinearGradient(0, -ph / 2, 0, ph / 2); sg.addColorStop(0, '#132a52'); sg.addColorStop(1, '#0b1636'); ctx.fillStyle = sg; ctx.fillRect(-pw / 2, -ph / 2, pw, ph);
    // chat: your question, then the answer streaming in lines
    const q1 = lin(t0 + .3, t0 + .9, t); ctx.globalAlpha = q1; ctx.fillStyle = '#ffae4a'; ctx.beginPath(); ctx.roundRect(-40, -380, 250, 64, 26); ctx.fill(); ctx.globalAlpha = 1;
    text(ctx, 'explain superbugs?', -20, -338, { size: 24, weight: 500, color: '#1a1030', alpha: q1 });
    const ans = lin(t0 + 1.2, tAny, t); for (let i = 0; i < 8; i++) { const w = [380, 420, 340, 400, 300, 410, 360, 220][i], a = clamp(ans * 8 - i); if (a <= 0) continue; ctx.fillStyle = rgba('#d8f7ff', .45 * a); ctx.beginPath(); ctx.roundRect(-230, -280 + i * 34, w * a, 14, 7); ctx.fill(); }
    // the tiny figure at the bottom of the screen; the hat floats down and lands on it
    const fy = 470, fs = 3.4; mini(ctx, 0, fy, fs * 100, t, { hat: 0 });
    const hu = eio(lin(tSam, tPhd + .2, t)), hx = Math.sin(t * 1.8) * 50 * (1 - hu), hy = mix(-560, fy - 99 * fs, hu);
    mortarboard(ctx, 1.5 * fs + hx, hy, fs * .85, 1);
    if (t > tPhd + .2) { const k = (t - tPhd - .2); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, rr = 30 + k * 160; ctx.fillStyle = rgba(P.amber, Math.max(0, .9 - k)); ctx.fillRect(Math.cos(a) * rr - 2, fy - 99 * fs + Math.sin(a) * rr - 2, 4, 4); } addGlow(ctx, 0, fy - 95 * fs, 120, .5 * Math.max(0, 1 - k * .6), P.amber, '#fff3dd'); }
    ctx.restore();
    addGlow(ctx, 0, 0, 600, .2, C.cyan, C.cyanWhite);
    ctx.restore();
    // the quote, left of the phone
    quoteCard(ctx, t, tSam - .2, s.b, { quote: '"like talking to a PhD-level expert in any area"', who: 'Sam Altman · GPT-5 launch · Aug 2025', x: 520, y: 520, size: 60, w: 680, hi: ['PhD-level'] });
    finish(ctx, t, { vig: .5 });
  };
};

export default function (T) {
  const S = (p, n) => T.S('04a', p, n);
  return [
    { t: S('And small') - .1, draw: mapShot(T), tr: 'zoom', d: 1.0, x: W / 2, y: H / 2, depth: 5 },
    { t: S('In London') - .3, draw: londonLab(T), tr: 'zoom', d: .9, x: W / 2, y: H / 2, depth: 5 },
    { t: S('how do') - .1, draw: microbes(T), tr: 'zoom', d: .9, x: LAB_EYE[0], y: LAB_EYE[1], depth: 8 },
    { t: S('They had found') + .25, draw: notebook(T), tr: 'match', d: .5 },
    { t: S('Then they gave') - .2, draw: question(T), tr: 'zoom', d: .8, x: 960, y: 830, depth: 4 },
    { t: S('Within two days') - .25, draw: twoDays(T), tr: 'push', d: .8 },
    { t: S('In another lab') - .1, draw: eye(T), tr: 'iris', d: .7, x: 960, y: 540, r: 40 },
    { t: S('It suggested') - .1, draw: dropShot(T), tr: 'zoom', d: .7, x: 960, y: 300, depth: 3 },
    { t: S('So far') - .25, draw: petri(T), tr: 'down', d: .9 },
    { t: S('But it was') - .2, draw: forest(T), tr: 'match', d: 1.0 },
    { t: S('And a piece') - .3, draw: busShot(T, { phase: 'pocket' }), tr: 'up', d: 1.1 },
    { t: S('When OpenAI') - .2, draw: display(T), tr: 'zoom', d: .9, x: W / 2, y: H / 2 - 40, depth: 6 },
    { t: S('A thousand') - .15, draw: busShot(T, { phase: 'thousand' }), tr: 'out', d: 1.0, x: PHONE.x, y: PHONE.y, depth: 10 },
    { t: S('Most of us') - .1, draw: busShot(T, { phase: 'email' }), tr: 'match', d: .4 },
  ];
}
