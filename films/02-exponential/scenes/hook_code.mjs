// Code-drawn shots for the hook (section 01) of film 02 v2, in the style-A look. Each export returns draw(ctx, t, s).
import { W, H, C, rgba, clamp, lin, mix, eio, eout, sine, prng, addGlow, text, canvas } from '../engine.mjs';
import { P, skyGrad, cityLayer, canyon, houseRow, fogBand, cone, lampPost, wires, hill, grass, person, car, skyLine, finish, shade } from './world.mjs';

const cache = new Map(); const once = (k, f) => { if (!cache.has(k)) cache.set(k, f()); return cache.get(k); };

// 1 · street at night: people walk past, heads down on their phones; above the roofs a line starts to bend upward
export const street = ({ tLine = 2.5 } = {}) => {
  const far = once('st_far', () => cityLayer({ seed: 11, z: 6, base: H * .55, hMin: 80, hMax: 300, wMin: 50, wMax: 120, col: '#34438c', fogTo: '#6a8fcf', fogAmt: .85, lit: .006, tower: .12, span: 2600 }));
  const mid = once('st_mid', () => cityLayer({ seed: 12, z: 3, base: H * .64, hMin: 80, hMax: 260, wMin: 70, wMax: 160, col: '#222b6c', fogTo: '#4566ae', fogAmt: .7, lit: .02, warmLit: .3, span: 2600 }));
  const mid2 = once('st_mid2', () => cityLayer({ seed: 14, z: 1.9, base: H * .74, hMin: 120, hMax: 300, wMin: 100, wMax: 220, col: '#181d55', fogTo: '#2d3f86', fogAmt: .55, lit: .03, warmLit: .5, span: 2700 }));
  const row = once('st_row', () => houseRow({ seed: 31, base: H * .9, z: 1.15 }));
  const walkers = [{ x0: 200, v: 46, h: 150, coat: P.amber, ph: 0, dy: 40 }, { x0: 1500, v: -38, h: 138, coat: '#3a4c9a', ph: 1, dy: 18 }, { x0: 900, v: 30, h: 128, coat: '#2c3a7d', ph: 2, dy: 6 }, { x0: 2000, v: -50, h: 144, coat: '#6a4b8e', ph: 3, dy: 30 }];
  return (ctx, t, s) => {
    const u = lin(s.a, s.b, t), cx = mix(-90, 90, sine(u)), cy = mix(30, -10, sine(u)), zm = mix(1.02, 1.12, sine(u));
    skyGrad(ctx, { t, stars: .6, top: '#0a0c2c', mid: '#18205a', bottom: '#4a6cb8' });
    const hg = ctx.createRadialGradient(W * .55, H * .62, 0, W * .55, H * .62, 1100); hg.addColorStop(0, 'rgba(110,170,235,.45)'); hg.addColorStop(1, 'rgba(110,170,235,0)'); ctx.fillStyle = hg; ctx.fillRect(0, 0, W, H);
    skyLine(ctx, t, s.a + tLine, { x0: 560, y0: 430, x1: 1820, y1: 70, dur: 5.5 });
    far.draw(ctx, t, cx, cy, zm); fogBand(ctx, t, H * .53, 240, { a: .45, seed: 2, hex: '#8ab8e8' });
    mid.draw(ctx, t, cx, cy, zm); fogBand(ctx, t, H * .63, 170, { a: .32, seed: 6, hex: '#6c9ad6' });
    mid2.draw(ctx, t, cx, cy, zm); fogBand(ctx, t, H * .74, 120, { a: .22, seed: 8, hex: '#5d86c8' });
    row.draw(ctx, t, cx, cy, zm);
    // pavement + street
    const [, gy, k] = row.at(0, H * .9, cx, cy, zm);
    ctx.fillStyle = '#121540'; ctx.fillRect(0, gy, W, 26 * k); ctx.fillStyle = '#0b0d2a'; ctx.fillRect(0, gy + 26 * k, W, H);
    const [l1x] = row.at(620, 0, cx, cy, zm), [l2x] = row.at(1820, 0, cx, cy, zm);
    lampPost(ctx, l1x, gy + 20 * k, 430 * k, t); lampPost(ctx, l2x, gy + 20 * k, 430 * k, t, { hex: P.cyanSoft, on: .8 });
    car(ctx, ((t - s.a) * 300) % (W + 700) - 350, gy + 150 * k, 1.6 * k, 1);
    for (const w of walkers) {
      const x = ((w.x0 + (t - s.a) * w.v) % (W + 400) + W + 400) % (W + 400) - 200;
      person(ctx, x, gy + w.dy * k, w.h * k, t, { phase: (t - s.a) * Math.abs(w.v) / (w.h * .085) + w.ph, coat: w.coat, phone: true, flip: w.v < 0 });
    }
    wires(ctx, [{ x: -200, y: 80 }, { x: 900, y: 150 }, { x: 2100, y: 60 }], -cx * 1.1, { sag: 70 });
    finish(ctx, t);
  };
};

// ---------- interior: a lab at night (window onto the city, monitors with live graphs, a researcher) ----------
export function monitor(ctx, x, y, w, h, t, { seed = 1, hex = P.cyan, kind = 'graph', on = 1 } = {}) {
  ctx.fillStyle = '#0a0b22'; ctx.fillRect(x - 6, y - 6, w + 12, h + 12); ctx.fillRect(x + w / 2 - 5, y + h, 10, 34); ctx.fillRect(x + w / 2 - 34, y + h + 30, 68, 6);
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, rgba(hex, .9 * on)); g.addColorStop(1, rgba(shade(hex, -.25), .9 * on)); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.strokeStyle = 'rgba(8,30,60,.75)'; ctx.fillStyle = 'rgba(8,30,60,.6)'; ctx.lineWidth = 2.5;
  const r = prng(seed);
  if (kind === 'graph') { for (let k = 0; k < 2; k++) { ctx.beginPath(); for (let i = 0; i <= 40; i++) { const xx = x + i / 40 * w, v = Math.sin(i * .5 + t * (1.2 + k) + seed) * .5 + Math.sin(i * .17 + t * .6 + k) * .5; i ? ctx.lineTo(xx, y + h * (.35 + .25 * k) + v * h * .12) : ctx.moveTo(xx, y + h * .4); } ctx.stroke(); } }
  else { const off = (t * 26) % 14; for (let i = -1; i < h / 14 + 1; i++) { const r2 = prng(seed * 97 + Math.floor(t * 26 / 14) + i); ctx.fillRect(x + 10 + (r2() < .3 ? 14 : 0), y + i * 14 - off + 6, (w - 30) * (.25 + .6 * r2()), 5); } }
  ctx.restore(); addGlow(ctx, x + w / 2, y + h / 2, w * .9, .25 * on, hex, '#e8fbff');
}
export const lab = ({ dim = 0, cam0 = [0, 0, 1.0], cam1 = [-40, -10, 1.08] } = {}) => {
  const far = once('lab_far', () => cityLayer({ seed: 41, z: 5, base: H * .62, hMin: 120, hMax: 380, wMin: 60, wMax: 140, col: '#2a3780', fogTo: '#5b7ec4', fogAmt: .8, lit: .03, tower: .15, span: 2400 }));
  const mid = once('lab_mid', () => cityLayer({ seed: 42, z: 3, base: H * .7, hMin: 100, hMax: 260, wMin: 80, wMax: 170, col: '#1c2462', fogTo: '#38529e', fogAmt: .6, lit: .05, warmLit: .4, span: 2400 }));
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t)), cx = mix(cam0[0], cam1[0], u), cy = mix(cam0[1], cam1[1], u), zm = mix(cam0[2], cam1[2], u);
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(zm, zm); ctx.translate(-W / 2 - cx, -H / 2 - cy);
    // the window: city outside
    ctx.save(); ctx.beginPath(); ctx.rect(560, 90, 1300, 640); ctx.clip();
    skyGrad(ctx, { t, stars: .5, bottom: '#4a6cb8' }); far.draw(ctx, t, cx * 3, cy, 1); fogBand(ctx, t, H * .6, 200, { a: .35, hex: '#8ab8e8' }); mid.draw(ctx, t, cx * 2, cy, 1);
    ctx.fillStyle = 'rgba(120,180,240,.06)'; ctx.fillRect(560, 90, 1300, 640); ctx.restore();
    // room walls around the window, mullions
    ctx.fillStyle = '#151848'; ctx.fillRect(-100, -100, 660, H + 200); ctx.fillRect(1860, -100, 300, H + 200); ctx.fillRect(-100, -100, W + 300, 190); ctx.fillRect(-100, 730, W + 300, 500);
    ctx.fillStyle = '#0f1238'; for (const mx of [560, 993, 1426, 1855]) ctx.fillRect(mx - 6, 90, 12, 640); ctx.fillRect(560, 400, 1300, 10);
    // shelves + server rack with blinking lights on the left
    ctx.fillStyle = '#10133a'; ctx.fillRect(90, 220, 300, 610); for (let i = 0; i < 10; i++) { ctx.fillStyle = '#0b0d2c'; ctx.fillRect(105, 240 + i * 58, 270, 44); for (let k = 0; k < 6; k++) { const on = Math.sin(t * (2 + k) + i * 3.1 + k) > .2; ctx.fillStyle = on ? (k % 3 ? P.cyan : P.amber) : '#1e2350'; ctx.fillRect(125 + k * 14, 258 + i * 58, 6, 6); } }
    addGlow(ctx, 470, 160, 70, .6 + .2 * Math.sin(t * 3), '#ff7b45', '#ffd8b8');
    // desk + monitors
    ctx.fillStyle = '#0d1031'; ctx.fillRect(520, 820, 1380, 26); ctx.fillRect(560, 846, 18, 240); ctx.fillRect(1840, 846, 18, 240);
    monitor(ctx, 640, 600, 300, 180, t, { seed: 3 }); monitor(ctx, 990, 590, 330, 196, t, { seed: 5, kind: 'code' }); monitor(ctx, 1370, 610, 280, 170, t, { seed: 7 });
    // floor
    const fl = ctx.createLinearGradient(0, 850, 0, H); fl.addColorStop(0, '#12153f'); fl.addColorStop(1, '#0a0c28'); ctx.fillStyle = fl; ctx.fillRect(-100, 846, W + 300, 400);
    // cyan light pooling on the floor from the monitors
    const pool = ctx.createRadialGradient(1100, 900, 0, 1100, 900, 600); pool.addColorStop(0, 'rgba(56,214,255,.16)'); pool.addColorStop(1, 'rgba(56,214,255,0)'); ctx.fillStyle = pool; ctx.fillRect(400, 820, 1400, 300);
    // the researcher, standing, reading a tablet
    person(ctx, 1560, 1030, 480, t, { coat: '#d9a35f', hood: false, phone: true, skin: '#b07a58', hair: '#2a1d2c', flip: true });
    ctx.restore();
    if (dim) { ctx.fillStyle = `rgba(7,9,24,${dim})`; ctx.fillRect(0, 0, W, H); }
    finish(ctx, t);
  };
};

// ---------- the hill above the city: a person in an amber coat watches a line climb the sky ----------
export const hillView = ({ tLine = .5, warm = 0, hex = P.cyan, dur = 4, from = [700, 560], to = [1830, 70] } = {}) => {
  const far = once('hv_far', () => cityLayer({ seed: 51, z: 6, base: H * .74, hMin: 40, hMax: 220, wMin: 40, wMax: 110, col: '#2f3c86', fogTo: '#6a8fcf', fogAmt: .85, lit: .04, warmLit: .4, tower: .1, span: 2400 }));
  const mid = once('hv_mid', () => cityLayer({ seed: 52, z: 3.5, base: H * .82, hMin: 40, hMax: 160, wMin: 50, wMax: 130, col: '#1e2668', fogTo: '#3e5aa4', fogAmt: .6, lit: .06, warmLit: .5, span: 2400 }));
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t)), cx = mix(-40, 60, u), cy = mix(30, -30, u), zm = mix(1.0, 1.1, u);
    skyGrad(ctx, { t, stars: .8 * (1 - warm), top: warm ? '#2a2558' : '#090b2a', mid: warm ? '#6a4f8a' : '#171e58', bottom: warm ? '#e9a07f' : '#3e5fae', warm: 0 });
    skyLine(ctx, t, s.a + tLine, { x0: from[0], y0: from[1], x1: to[0], y1: to[1], dur, hex });
    far.draw(ctx, t, cx, cy, zm); fogBand(ctx, t, H * .72, 200, { a: .4, hex: warm ? '#e7b0a0' : '#8ab8e8' });
    mid.draw(ctx, t, cx, cy, zm); fogBand(ctx, t, H * .82, 140, { a: .3, hex: warm ? '#c9909a' : '#5d86c8' });
    // the hill in the foreground (moves most)
    const hx = -cx * 1.3, hy = -cy * 1.3, hf = (x) => 840 + hy - 140 * Math.exp(-Math.pow((x - hx - 420) / 520, 2)) + (x - hx) * .06;
    const pts = []; for (let x = -20; x <= W + 20; x += 20) pts.push([x, hf(x)]);
    hill(ctx, pts, { col: warm ? '#3a2c5c' : '#141846', rim: warm ? P.dusk : '#4d6fc0' });
    grass(ctx, t, 0, 900, hf, { n: 140, col: warm ? '#2c2148' : '#0f1236' });
    // a small house with a lit window on the left of the hill
    { const bx = 120 + hx, by = hf(160); ctx.fillStyle = warm ? '#2c2148' : '#0e1134'; ctx.fillRect(bx, by - 70, 90, 70); ctx.beginPath(); ctx.moveTo(bx - 8, by - 70); ctx.lineTo(bx + 45, by - 108); ctx.lineTo(bx + 98, by - 70); ctx.fill(); ctx.fillStyle = P.amber; ctx.fillRect(bx + 30, by - 48, 18, 18); addGlow(ctx, bx + 39, by - 39, 40, .6, P.amber, '#fff3dd'); }
    const px = 470 + hx; person(ctx, px, hf(px) + 4, 230 * zm, t, { coat: P.amber, look: -1, hood: true });
    finish(ctx, t);
  };
};

// ---------- mathematics: a wall of open problems; one after another they fall, solved ----------
const PROBLEMS = [['sphere packing', '1978'], ['Erdős unit distance', '1946'], ['cap sets', '1970'], ['kissing numbers', '1967'], ['Ramsey bound', '1935'], ['sum-free sets', '1965'], ['Sidon sets', '1932'], ['Hadwiger–Nelson', '1950'], ['matrix mult.', '1969'], ['no-three-in-line', '1917'], ['Heilbronn triangle', '1951'], ['happy ending', '1935']];
export const problems = ({ tFall = 1, step = .42 } = {}) => (ctx, t, s) => {
  const u = sine(lin(s.a, s.b, t));
  skyGrad(ctx, { t, stars: .3, top: '#0b0d2c', mid: '#141a4e', bottom: '#1f2a66' });
  // blackboard
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(mix(1, 1.07, u), mix(1, 1.07, u)); ctx.translate(-W / 2, -H / 2);
  ctx.fillStyle = '#182a3a'; ctx.fillRect(140, 120, 1640, 760); ctx.strokeStyle = '#0c1424'; ctx.lineWidth = 18; ctx.strokeRect(140, 120, 1640, 760);
  ctx.save(); ctx.globalAlpha = .1; ctx.fillStyle = ctx.createPattern(DOTS_, 'repeat'); ctx.fillRect(140, 120, 1640, 760); ctx.restore();
  // chalk scribbles
  const r = prng(77); ctx.strokeStyle = 'rgba(220,235,245,.12)'; ctx.lineWidth = 2; for (let i = 0; i < 26; i++) { const x = 180 + r() * 1540, y = 160 + r() * 680; ctx.beginPath(); ctx.moveTo(x, y); for (let k = 0; k < 5; k++) ctx.lineTo(x + k * 18 + r() * 10, y + Math.sin(k + i) * 8); ctx.stroke(); }
  PROBLEMS.forEach(([name, yr], i) => {
    const cx0 = 300 + (i % 4) * 440, cy0 = 230 + Math.floor(i / 4) * 230, tf = s.a + tFall + i * step, f = lin(tf, tf + 1.1, t);
    const fall = f * f, y = cy0 + fall * 900, rot = fall * (i % 2 ? .6 : -.5), a = 1 - lin(tf + .7, tf + 1.1, t);
    if (a <= 0) { // where it was: a small check mark stays on the board
      text(ctx, '✓', cx0, cy0 + 20, { size: 56, color: '#9be8a8', align: 'center', alpha: eout(lin(tf + .9, tf + 1.3, t)) * .9 }); return; }
    ctx.save(); ctx.translate(cx0, y); ctx.rotate(rot); ctx.globalAlpha = a;
    ctx.fillStyle = '#efe6cf'; ctx.fillRect(-170, -70, 340, 140); ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(-170, 60, 340, 10);
    ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.arc(0, -58, 8, 0, 7); ctx.fill();
    text(ctx, name, 0, -6, { size: 36, font: 'Instrument Serif', color: '#2a2230', align: 'center' });
    text(ctx, 'open since ' + yr, 0, 40, { size: 22, color: '#6b5d6e', align: 'center', weight: 600, spacing: 2 });
    ctx.restore();
  });
  ctx.restore();
  finish(ctx, t);
};
const DOTS_ = (() => { const [c, x] = canvas(8, 8); x.fillStyle = '#fff'; x.beginPath(); x.arc(4, 4, 1.25, 0, 7); x.fill(); return c; })();

// ---------- biology: strands of DNA drift in the dark; a swarm of searchers lights one pattern no one has seen ----------
export const dnaSea = ({ tFind = 2.2, tFindAbs = null, label = true } = {}) => (ctx, t, s) => {
  // with an absolute find time the camera runs on one continuous clock, so cuts between dnaSea shots don't jump
  const u = tFindAbs !== null ? sine(lin(tFindAbs - 10, tFindAbs + 30, t)) : sine(lin(s.a, s.b, t)); if (tFindAbs !== null) tFind = tFindAbs - s.a;
  skyGrad(ctx, { t, stars: .2, top: '#06081f', mid: '#0d1440', bottom: '#14306a' });
  const strands = [[180, .9, 0], [420, .6, 1], [640, 1.15, 2], [860, .75, 3]];
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(mix(1, 1.15, u), mix(1, 1.15, u)); ctx.translate(-W / 2 - u * 120, -H / 2);
  for (const [y0, sc, k] of strands) {
    const sp = 30 * sc, amp = 46 * sc, off = t * 40 * (k % 2 ? 1 : -1) * sc;
    for (let i = -4; i < 90; i++) {
      const x = i * sp + (off % (sp * 2)), ph = i * .42 + t * .8 + k, y1 = y0 + Math.sin(ph) * amp, y2 = y0 - Math.sin(ph) * amp, front = Math.cos(ph) > 0;
      const hot = k === 2 && x > 1150 && x < 1500 && t > s.a + tFind;
      const col = hot ? P.amber : (front ? '#59c8f0' : '#2a5b9a'), a = .35 + .5 * sc * (hot ? 1.4 : 1);
      ctx.strokeStyle = rgba(col, a * .55); ctx.lineWidth = 3 * sc; ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, y2); ctx.stroke();
      ctx.fillStyle = rgba(col, Math.min(1, a)); ctx.beginPath(); ctx.arc(x, y1, 5 * sc, 0, 7); ctx.arc(x, y2, 5 * sc, 0, 7); ctx.fill();
    }
  }
  // searchers: small lights sweeping, converging on the find
  const r = prng(9), fx = 1330, fy = 640;
  for (let i = 0; i < 260; i++) {
    const bx = r() * 2400 - 200, by = 80 + r() * 900, ph = r() * 6.28, conv = eio(lin(s.a + tFind - 1.2 + r() * .6, s.a + tFind + .4, t));
    const x = mix(bx + Math.sin(t * .7 + ph) * 60, fx + Math.cos(ph) * 30, conv), y = mix(by + Math.cos(t * .5 + ph) * 40, fy + Math.sin(ph) * 30, conv);
    ctx.fillStyle = rgba('#e8fbff', .5 * (1 - conv * .6)); ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
  }
  const g = lin(s.a + tFind, s.a + tFind + 1, t); if (g > 0) addGlow(ctx, fx, fy, 260, .55 * g, P.amber, '#fff3dd');
  ctx.restore();
  if (label && g > 0) { text(ctx, 'FOUND BY AI AGENTS', 1180, 300, { size: 20, weight: 600, color: P.cream, spacing: 6, alpha: g * .8 }); text(ctx, 'never seen before', 1180, 356, { size: 60, font: 'Instrument Serif', color: P.amber, alpha: g }); }
  finish(ctx, t);
};

// ---------- public health: a hand-drawn region map; case pins appear as the report assembles itself ----------
export const healthMap = ({ tPins = .6, report = null } = {}) => (ctx, t, s) => {
  const u = sine(lin(s.a, s.b, t));
  ctx.fillStyle = '#2b2350'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(mix(1.02, 1.12, u), mix(1.02, 1.12, u)); ctx.translate(-W / 2 + u * 60, -H / 2);
  // paper
  ctx.fillStyle = '#e9d9be'; ctx.fillRect(120, 90, 1100, 900); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(130, 985, 1100, 14);
  // land + river + roads
  const r = prng(5); ctx.fillStyle = '#d8c39e'; ctx.beginPath(); ctx.moveTo(200, 300); for (let i = 0; i <= 24; i++) { const a = i / 24 * 6.28; ctx.lineTo(660 + Math.cos(a) * (380 + r() * 70), 540 + Math.sin(a) * (330 + r() * 60)); } ctx.fill();
  ctx.strokeStyle = '#6aa6c8'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(170, 700); ctx.bezierCurveTo(420, 600, 520, 820, 760, 700); ctx.bezierCurveTo(960, 600, 1050, 520, 1200, 400); ctx.stroke();
  ctx.strokeStyle = 'rgba(120,90,70,.45)'; ctx.lineWidth = 3; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(200 + r() * 900, 150 + r() * 750); ctx.quadraticCurveTo(200 + r() * 900, 150 + r() * 750, 200 + r() * 900, 150 + r() * 750); ctx.stroke(); }
  // pins appear
  const pr = prng(12);
  for (let i = 0; i < 22; i++) {
    const x = 330 + pr() * 680, y = 260 + pr() * 560, tp = s.a + tPins + i * .18, a = eout(lin(tp, tp + .35, t)); if (a <= 0) continue;
    const rip = lin(tp, tp + 1, t); ctx.strokeStyle = rgba('#c0392b', (1 - rip) * .7); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 8 + 40 * rip, 0, 7); ctx.stroke();
    ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.arc(x, y - 14 * a, 9, 0, 7); ctx.fill(); ctx.strokeStyle = '#7a1f16'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y - 14 * a); ctx.lineTo(x, y); ctx.stroke();
  }
  ctx.save(); ctx.globalAlpha = .12; ctx.fillStyle = ctx.createPattern(DOTS_, 'repeat'); ctx.fillRect(120, 90, 1100, 900); ctx.restore();
  ctx.restore();
  if (report) report(ctx, t);
  finish(ctx, t, { vig: .4 });
};
