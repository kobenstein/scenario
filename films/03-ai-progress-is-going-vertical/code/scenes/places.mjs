// Code-drawn locations for film 02 v2 (style A). Each export returns draw(ctx, t, s). No generated images.
import { W, H, C, rgba, clamp, lin, mix, eio, eout, sine, prng, addGlow, text, canvas } from '../engine.mjs';
import { P, skyGrad, cityLayer, houseRow, fogBand, cone, lampPost, hill, grass, person, personBack, skyLine, finish, shade } from './world.mjs';
import { monitor } from './hook_code.mjs';

const cache = new Map(); const once = (k, f) => { if (!cache.has(k)) cache.set(k, f()); return cache.get(k); };
const DOTS = (() => { const [c, x] = canvas(8, 8); x.fillStyle = '#fff'; x.beginPath(); x.arc(4, 4, 1.25, 0, 7); x.fill(); return c; })();
const dots = (ctx, x, y, w, h, a = .12) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = ctx.createPattern(DOTS, 'repeat'); ctx.fillRect(x, y, w, h); ctx.restore(); };
const camT = (ctx, t, s, a, b) => { const u = sine(lin(s.a, s.b, t)); const cx = mix(a[0], b[0], u), cy = mix(a[1], b[1], u), z = mix(a[2], b[2], u); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 - cx, -H / 2 - cy); return { cx, cy, z, u }; };
const cityWindow = (ctx, t, x, y, w, h, { cx = 0, warm = 0, rain = 0, snow = 0, seed = 61 } = {}) => {
  const far = once('cw_far' + seed, () => cityLayer({ seed, z: 5, base: H * .62, hMin: 120, hMax: 380, wMin: 60, wMax: 140, col: '#2a3780', fogTo: '#5b7ec4', fogAmt: .8, lit: .03, tower: .15, span: 2400 }));
  const mid = once('cw_mid' + seed, () => cityLayer({ seed: seed + 1, z: 3, base: H * .74, hMin: 100, hMax: 260, wMin: 80, wMax: 170, col: '#1c2462', fogTo: '#38529e', fogAmt: .6, lit: .05, warmLit: .4, span: 2400 }));
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  skyGrad(ctx, { t, stars: .5 * (1 - warm), top: warm ? '#3a2d66' : P.ink, mid: warm ? '#8a5a8a' : P.night, bottom: warm ? '#f0a77f' : '#4a6cb8' });
  if (warm) addGlow(ctx, x + w * .7, y + h * .75, 300, .6 * warm, P.amber, '#fff3dd');
  far.draw(ctx, t, cx * 3, 0, 1); fogBand(ctx, t, H * .6, 200, { a: .35, hex: warm ? '#f2b49a' : '#8ab8e8' }); mid.draw(ctx, t, cx * 2, 0, 1);
  if (warm) { ctx.fillStyle = rgba(P.dusk, .18 * warm); ctx.fillRect(x, y, w, h); }
  if (rain) { const r = prng(3); ctx.strokeStyle = 'rgba(180,210,255,.35)'; ctx.lineWidth = 1.5; for (let i = 0; i < 160 * rain; i++) { const rx = x + r() * w, ry = y + ((r() * h + t * 900 * (.8 + r() * .4)) % h); ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 4, ry + 22); ctx.stroke(); } }
  if (snow) { const r = prng(4); ctx.fillStyle = 'rgba(240,245,255,.8)'; for (let i = 0; i < 180; i++) { const sx = x + ((r() * w + Math.sin(t + i) * 20) % w), sy = y + ((r() * h + t * 40 * (.5 + r())) % h); ctx.fillRect(sx, sy, 3, 3); } }
  ctx.restore();
};

// ---------- data centre: a corridor of racks with running lights; cool air, a technician walking ----------
export const datacenter = ({ walker = true, flowT = null } = {}) => (ctx, t, s) => {
  ctx.save(); camT(ctx, t, s, [0, 0, 1.02], [0, -20, 1.16]);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0a1a2c'); g.addColorStop(1, '#0c2236'); ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, H + 400);
  const vx = W / 2, vy = H * .45;
  addGlow(ctx, vx, vy, 520, .55, '#57c9e8', '#e8fbff');
  for (const side of [-1, 1]) for (let i = 9; i >= 0; i--) {
    const d0 = i / 10, d1 = (i + 1) / 10, f = (d) => 1 / (1 + d * 4.5);
    const xa = vx + side * 900 * f(d0), xb = vx + side * 900 * f(d1), ta = vy - 700 * f(d0), tb = vy - 700 * f(d1), ba = vy + 600 * f(d0), bb = vy + 600 * f(d1);
    const c = shade('#0d1a33', -.02 + d0 * .1);
    ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(xa, ta); ctx.lineTo(xb, tb); ctx.lineTo(xb, bb); ctx.lineTo(xa, ba); ctx.fill();
    // blinking lights on the rack face
    const r = prng(i * 13 + (side > 0 ? 7 : 0));
    for (let k = 0; k < 26; k++) { const u = r(), v = r(), x = mix(xa, xb, u), y = mix(mix(ta, tb, u), mix(ba, bb, u), .08 + v * .84), on = Math.sin(t * (2 + r() * 6) + k) > .1; if (!on) continue; ctx.fillStyle = r() < .2 ? P.amber : P.cyan; const sz = 5 * f(d0) + 1; ctx.fillRect(x, y, sz, sz); }
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xb, tb); ctx.lineTo(xb, bb); ctx.stroke();
  }
  // floor grid
  ctx.strokeStyle = 'rgba(120,200,240,.12)'; ctx.lineWidth = 2; for (let i = 1; i < 14; i++) { const d = i / 14, y = vy + 600 / (1 + d * 4.5) * 1; } for (let k = -6; k <= 6; k++) { ctx.beginPath(); ctx.moveTo(vx + k * 18, vy + 140); ctx.lineTo(vx + k * 260, H + 200); ctx.stroke(); }
  // overhead cable trays with pulses travelling into the distance
  for (const side of [-1, 1]) { const x0 = vx + side * 520, y0 = 30; ctx.strokeStyle = 'rgba(10,20,40,.9)'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(vx + side * 60, vy - 150); ctx.stroke();
    for (let k = 0; k < 6; k++) { const u = ((t * .35 + k / 6) % 1), x = mix(x0, vx + side * 60, eio(u)), y = mix(y0, vy - 150, eio(u)); addGlow(ctx, x, y, 26 * (1 - u) + 6, .8, P.cyan, '#ffffff'); } }
  fogBand(ctx, t, vy + 200, 260, { a: .18, hex: '#6fc8e8' });
  if (walker) { const u = lin(s.a, s.b + 2, t), k = 1 / (1 + u * 1.6); personBack(ctx, vx - 30 + u * 20, vy + 140 + 360 * k, 330 * k, t, { phase: t * 4.2, coat: '#d9a35f', skin: '#b07a58' }); }
  ctx.restore(); finish(ctx, t);
};

// ---------- data centre from outside: a long low hall, pylons, steam; power flows in ----------
export const dcOutside = () => (ctx, t, s) => {
  ctx.save(); camT(ctx, t, s, [-60, 0, 1.0], [60, -10, 1.08]);
  skyGrad(ctx, { t, stars: .6, bottom: '#3c5aa6' });
  fogBand(ctx, t, H * .55, 260, { a: .3, hex: '#8ab8e8' });
  // pylons + lines
  const py = [[160, 300], [700, 340], [1250, 360], [1800, 330]];
  ctx.strokeStyle = '#0c0f30'; ctx.lineWidth = 5; for (const [x, y] of py) { ctx.beginPath(); ctx.moveTo(x - 40, 760); ctx.lineTo(x, y); ctx.lineTo(x + 40, 760); ctx.moveTo(x - 60, y + 50); ctx.lineTo(x + 60, y + 50); ctx.moveTo(x - 45, y + 110); ctx.lineTo(x + 45, y + 110); ctx.stroke(); }
  ctx.lineWidth = 2; for (let i = 0; i < py.length - 1; i++) for (const dx of [-60, 60]) { const [ax, ay] = py[i], [bx, by] = py[i + 1]; ctx.beginPath(); ctx.moveTo(ax + dx, ay + 50); ctx.quadraticCurveTo((ax + bx) / 2, (ay + by) / 2 + 110, bx + dx, by + 50); ctx.stroke();
    for (let k = 0; k < 3; k++) { const u = (t * .3 + k / 3 + i * .2) % 1, x = mix(ax + dx, bx + dx, u), y = mix(ay, by, u) + 50 + 4 * 110 * u * (1 - u) * .5 * 2; addGlow(ctx, x, y, 14, .9, P.cyan, '#ffffff'); } }
  // the hall
  ctx.fillStyle = '#141a4a'; ctx.fillRect(200, 600, 1520, 220); ctx.fillStyle = '#0f143c'; ctx.fillRect(200, 600, 1520, 18);
  for (let i = 0; i < 16; i++) { const x = 250 + i * 92; ctx.fillStyle = '#0c1034'; ctx.fillRect(x, 560, 60, 40); const r = prng(i); // steam
    for (let k = 0; k < 4; k++) { const u = ((t * .25 + r() + k * .25) % 1), sy = 560 - u * 220, sx = x + 30 + Math.sin(u * 5 + i) * 14; const gg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 40 + u * 60); gg.addColorStop(0, `rgba(160,200,240,${.18 * (1 - u)})`); gg.addColorStop(1, 'rgba(160,200,240,0)'); ctx.fillStyle = gg; ctx.fillRect(sx - 120, sy - 120, 240, 240); } }
  for (let i = 0; i < 30; i++) { const on = Math.sin(t * 1.3 + i * 2.1) > -.3; ctx.fillStyle = on ? rgba(P.cyan, .9) : '#1d2558'; ctx.fillRect(240 + i * 49, 680, 26, 8); }
  const gr = []; for (let x = -20; x <= W + 20; x += 40) gr.push([x, 820 + Math.sin(x * .004) * 10]); hill(ctx, gr, { col: '#10133a' });
  lampPost(ctx, 1840, 900, 300, t);
  ctx.restore(); finish(ctx, t);
};

// ---------- an office at night (or by morning): one screen still working; a clock on the wall ----------
export const office = ({ morning = null } = {}) => (ctx, t, s) => {
  const m = morning === null ? 0 : eio(lin(morning - 1, morning + 2, t));
  ctx.save(); camT(ctx, t, s, [0, 0, 1.0], [-30, -10, 1.1]);
  cityWindow(ctx, t, 300, 80, 1500, 700, { warm: m, seed: 71 });
  ctx.fillStyle = mixC('#151848', '#3a2c55', m); ctx.fillRect(-100, -100, 400, H + 200); ctx.fillRect(1800, -100, 300, H + 200); ctx.fillRect(-100, -100, W + 300, 180); ctx.fillRect(-100, 780, W + 300, 500);
  ctx.fillStyle = '#0f1238'; for (const mx of [300, 800, 1300, 1800]) ctx.fillRect(mx - 7, 80, 14, 700);
  // desks with dark monitors, one alive
  ctx.fillStyle = '#0d1031'; ctx.fillRect(360, 860, 1400, 22);
  monitor(ctx, 420, 690, 230, 140, t, { seed: 2, on: .15 }); monitor(ctx, 1380, 690, 230, 140, t, { seed: 4, on: .15 });
  monitor(ctx, 860, 640, 330, 200, t, { seed: 9, kind: 'code' });
  // office chair (side view); at night empty with the engineer's coat over the backrest, in the morning the engineer is back
  const chair = '#0c0e2c';
  ctx.strokeStyle = chair; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(1140, 925); ctx.lineTo(1140, 1015); ctx.moveTo(1080, 1025); ctx.lineTo(1200, 1025); ctx.stroke();
  ctx.fillStyle = '#1a1d48'; for (const wx of [1080, 1200]) { ctx.beginPath(); ctx.arc(wx, 1032, 9, 0, 7); ctx.fill(); }
  ctx.fillStyle = chair; ctx.beginPath(); ctx.roundRect(1070, 900, 150, 24, 10); ctx.fill();
  ctx.beginPath(); ctx.roundRect(1196, 740, 26, 170, 12); ctx.fill();
  const back = m < .5;
  if (back) {
    // coat folded over the backrest: collar on top, front panel hanging, one sleeve
    ctx.fillStyle = shade(P.amber, -.12); ctx.beginPath(); ctx.moveTo(1190, 752); ctx.quadraticCurveTo(1209, 728, 1230, 752); ctx.lineTo(1236, 880); ctx.lineTo(1214, 884); ctx.closePath(); ctx.fill();
    ctx.fillStyle = P.amber; ctx.beginPath(); ctx.moveTo(1192, 750); ctx.quadraticCurveTo(1176, 760, 1172, 800); ctx.lineTo(1168, 890); ctx.lineTo(1206, 892); ctx.lineTo(1206, 752); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = shade(P.amber, -.25); ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(1186, 770); ctx.quadraticCurveTo(1170, 830, 1180, 880); ctx.stroke();
    ctx.fillStyle = shade(P.amber, -.3); ctx.beginPath(); ctx.ellipse(1209, 750, 18, 7, 0, Math.PI, 0); ctx.fill();
  } else {
    ctx.save(); ctx.globalAlpha = clamp((m - .5) * 2, 0, 1); person(ctx, 1150, 1012, 300, t, { sit: true, typing: true, flip: true, coat: P.amber, hood: false }); ctx.restore();
  }
  // coffee cup with steam
  ctx.fillStyle = '#e9d9be'; ctx.fillRect(1240, 838, 30, 26);
  ctx.restore();
  finish(ctx, t);
};
function mixC(a, b, u) { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const f = (s) => Math.round(mix((A >> s) & 255, (B >> s) & 255, u)); return `rgb(${f(16)},${f(8)},${f(0)})`; }

// ---------- a parliament chamber: rows of seats in arcs, small screens lighting one by one ----------
export const chamber = ({ tLight = .5, people = true } = {}) => (ctx, t, s) => {
  ctx.save(); camT(ctx, t, s, [0, 40, 1.0], [0, -20, 1.12]);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1a1840'); g.addColorStop(1, '#2a2050'); ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, H + 400);
  // dome + windows with light beams
  ctx.fillStyle = '#211d4c'; ctx.beginPath(); ctx.arc(W / 2, 360, 900, Math.PI, 0); ctx.fill();
  for (let i = 0; i < 7; i++) { const x = 300 + i * 220, wy = 120; ctx.fillStyle = '#e8b27a'; ctx.beginPath(); ctx.moveTo(x, wy + 160); ctx.lineTo(x, wy + 40); ctx.arc(x + 40, wy + 40, 40, Math.PI, 0); ctx.lineTo(x + 80, wy + 160); ctx.fill(); }
  ctx.save(); ctx.globalCompositeOperation = 'screen'; for (let i = 0; i < 3; i++) { const x = 520 + i * 440; const gg = ctx.createLinearGradient(x, 280, x + 200, 900); gg.addColorStop(0, 'rgba(240,180,120,.22)'); gg.addColorStop(1, 'rgba(240,180,120,0)'); ctx.fillStyle = gg; ctx.beginPath(); ctx.moveTo(x, 280); ctx.lineTo(x + 80, 280); ctx.lineTo(x + 420, 1000); ctx.lineTo(x + 160, 1000); ctx.fill(); } ctx.restore();
  // seat arcs
  const cx = W / 2, cy = 1250;
  for (let row = 6; row >= 0; row--) {
    const r0 = 380 + row * 95; ctx.strokeStyle = shade('#3a2a3c', -row * .015); ctx.lineWidth = 46; ctx.beginPath(); ctx.arc(cx, cy, r0, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
    ctx.strokeStyle = '#2a1e2e'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, r0 + 23, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
    const n = 10 + row * 3, r = prng(row + 3);
    for (let k = 0; k < n; k++) { const a = Math.PI * (1.1 + .8 * (k + .5) / n), x = cx + Math.cos(a) * r0, y = cy + Math.sin(a) * r0, tl = s.a + tLight + r() * 3;
      const on = eout(lin(tl, tl + .4, t)); if (on > 0) { ctx.fillStyle = rgba(P.cyan, .9 * on); ctx.fillRect(x - 9, y - 30, 18, 10); addGlow(ctx, x, y - 25, 22, .5 * on, P.cyan, '#e8fbff'); }
      if (people && r() < .55) person(ctx, x, y - 6, 62 - row * 4, t, { coat: ['#3a4c9a', '#6a4b8e', '#2c3a7d', '#8a5a4a'][k % 4], hood: false, skin: ['#c98f6a', '#8a5a3c', '#e0b090', '#5a3a2a'][k % 4], sit: true }); }
  }
  dots(ctx, -200, 500, W + 400, 800, .1);
  ctx.restore(); finish(ctx, t);
};

// ---------- a room in Kinshasa: rain or dawn outside, a desk, a laptop, Amani working ----------
export const kinRoom = ({ dawn = false, amani = true, inbox = null, calm = false } = {}) => (ctx, t, s) => {
  ctx.save(); camT(ctx, t, s, [40, 0, 1.0], [-20, 10, 1.1]);
  const w = dawn ? 1 : 0;
  cityWindow(ctx, t, 640, 90, 1200, 640, { warm: w, rain: dawn ? 0 : 1, seed: 81 });
  ctx.fillStyle = dawn ? '#3b2d58' : '#151845'; ctx.fillRect(-100, -100, 740, H + 200); ctx.fillRect(1840, -100, 300, H + 200); ctx.fillRect(-100, -100, W + 300, 190); ctx.fillRect(-100, 730, W + 300, 500);
  ctx.fillStyle = dawn ? '#2c2148' : '#0f1238'; for (const mx of [640, 1040, 1440, 1840]) ctx.fillRect(mx - 8, 90, 16, 640);
  if (dawn) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const gg = ctx.createLinearGradient(900, 300, 500, 1000); gg.addColorStop(0, 'rgba(255,174,74,.25)'); gg.addColorStop(1, 'rgba(255,174,74,0)'); ctx.fillStyle = gg; ctx.beginPath(); ctx.moveTo(700, 200); ctx.lineTo(1400, 200); ctx.lineTo(1100, 1080); ctx.lineTo(200, 1080); ctx.fill(); ctx.restore(); }
  // desk, papers, lamp, laptop
  ctx.fillStyle = dawn ? '#3a2a40' : '#0e1132'; ctx.fillRect(420, 800, 1400, 28); ctx.fillRect(460, 828, 20, 260); ctx.fillRect(1780, 828, 20, 260);
  const r = prng(dawn ? 2 : 1); const papers = dawn ? 3 : 14;
  for (let i = 0; i < papers; i++) { ctx.save(); ctx.translate(900 + r() * 700, 790 - r() * 20); ctx.rotate((r() - .5) * .3); ctx.fillStyle = '#d9cfbb'; ctx.fillRect(-60, -6, 120, 10); ctx.restore(); }
  if (dawn) { // a plant
    ctx.fillStyle = '#7a4a2a'; ctx.fillRect(1620, 740, 60, 60); ctx.fillStyle = '#3f8a6a'; for (let k = 0; k < 7; k++) { ctx.save(); ctx.translate(1650, 745); ctx.rotate(-1.2 + k * .4 + Math.sin(t + k) * .03); ctx.beginPath(); ctx.ellipse(0, -50, 14, 46, 0, 0, 7); ctx.fill(); ctx.restore(); } }
  // laptop
  ctx.fillStyle = '#0b0d22'; ctx.beginPath(); ctx.moveTo(720, 800); ctx.lineTo(980, 800); ctx.lineTo(960, 784); ctx.lineTo(740, 784); ctx.fill();
  ctx.save(); ctx.translate(750, 784); ctx.transform(1, 0, -.18, 1, 0, 0); ctx.fillStyle = '#0b0d22'; ctx.fillRect(0, -170, 220, 170); ctx.fillStyle = rgba(P.cyan, .95); ctx.fillRect(8, -162, 204, 154);
  if (inbox !== null) { const n = Math.floor(clamp((t - inbox) * 6, 0, 18)); for (let i = 0; i < n; i++) { ctx.fillStyle = i % 3 === 1 ? 'rgba(200,60,60,.7)' : 'rgba(8,30,60,.55)'; ctx.fillRect(14, -156 + i * 8, 120 + (i * 37) % 70, 5); } }
  else { const off = (t * 20) % 10; ctx.fillStyle = 'rgba(8,30,60,.5)'; for (let i = 0; i < 15; i++) ctx.fillRect(14, -156 + i * 10 - off + 8, 60 + (i * 53) % 120, 4); }
  ctx.restore(); addGlow(ctx, 860, 700, 240, .3, P.cyan, '#e8fbff');
  // lamp
  ctx.strokeStyle = '#0b0d22'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(1500, 800); ctx.lineTo(1450, 640); ctx.lineTo(1530, 560); ctx.stroke(); cone(ctx, 1540, 575, 260, -.5, .4, P.amber, dawn ? .15 : .4);
  // chair + Amani
  ctx.fillStyle = dawn ? '#2c2148' : '#0c0e2c'; ctx.fillRect(470, 600, 14, 240); ctx.fillRect(470, 840, 140, 16); ctx.fillRect(480, 856, 12, 220); ctx.fillRect(590, 856, 12, 220);
  if (amani) person(ctx, 560, 1070, 560, t, { sit: true, typing: !calm || true, coat: '#2f7c78', dark: '#1b2a3a', hood: true, skin: '#6a3f2c', breathe: 1.2 });
  // Amani's head wrap colour (the hood) sits on top: recolour by drawing a wrap band
  ctx.restore(); finish(ctx, t);
};

// ---------- evaluators walk into a glass building (code version) ----------
export const glassLab = ({ tWalk0 = 0, tWalk1 = 8, n = 6 } = {}) => (ctx, t, s) => {
  ctx.save(); const { cx } = camT(ctx, t, s, [0, 0, 1.0], [40, -20, 1.12]);
  skyGrad(ctx, { t, stars: .4, bottom: '#4a6cb8' });
  const far = once('gl_far', () => cityLayer({ seed: 91, z: 5, base: H * .66, hMin: 100, hMax: 300, col: '#2a3780', fogTo: '#6a8fcf', fogAmt: .85, lit: .02, span: 2400 }));
  far.draw(ctx, t, cx * 2, 0, 1); fogBand(ctx, t, H * .64, 200, { a: .35, hex: '#8ab8e8' });
  // building: stacked glass floors, cyan lit, cantilevered
  const floors = [[520, 160, 1260, 170], [620, 340, 1220, 170], [470, 520, 1300, 170]];
  for (const [x, y, w, h] of floors) { ctx.fillStyle = '#0d1236'; ctx.fillRect(x - 10, y + h - 10, w + 20, 22); const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, 'rgba(70,200,240,.75)'); g.addColorStop(1, 'rgba(40,120,200,.55)'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h - 10); ctx.fillStyle = 'rgba(8,20,50,.55)'; for (let k = 0; k <= 12; k++) ctx.fillRect(x + k * w / 12 - 3, y, 6, h - 10); dots(ctx, x, y, w, h - 10, .1); }
  // ground floor with warm entrance
  ctx.fillStyle = '#10143c'; ctx.fillRect(560, 690, 1180, 200); ctx.fillStyle = P.amber; ctx.fillRect(1180, 720, 300, 170); ctx.fillStyle = shade(P.amber, -.3); ctx.fillRect(1325, 720, 8, 170);
  addGlow(ctx, 1330, 800, 260, .45, P.amber, '#fff3dd');
  // steps + plaza
  ctx.fillStyle = '#151a48'; ctx.fillRect(-200, 890, W + 400, 400); for (let i = 0; i < 4; i++) { ctx.fillStyle = shade('#1a1f52', i * .01); ctx.fillRect(1100 - i * 30, 890 + i * 18, 460 + i * 60, 18); }
  // the evaluators walking towards the door
  for (let i = 0; i < n; i++) { const u = clamp(lin(s.a + tWalk0 + i * .25, s.a + tWalk1 + i * .25, t)), x = mix(260 + i * 55, 1260 + i * 30, u), y = mix(1000 + (i % 2) * 20, 900, u), h = mix(190, 140, u);
    const a = 1 - lin(.92, 1, u); if (a <= 0) continue; ctx.save(); ctx.globalAlpha = a; person(ctx, x, y, h, t, { phase: (t - s.a) * 6 + i, coat: ['#3a4c9a', '#6a4b8e', '#2c3a7d', '#2f7c78', '#7a5a8e', '#3a5c8a'][i % 6], hood: false, skin: ['#c98f6a', '#8a5a3c', '#e0b090', '#5a3a2a', '#b07a58', '#d0a080'][i % 6], phone: i === 2 }); ctx.restore(); }
  ctx.restore(); finish(ctx, t);
};

// ---------- 1963: a desk with a red telephone that rings; snow behind the window ----------
export const desk1963 = ({ tRing = 1 } = {}) => (ctx, t, s) => {
  ctx.save(); camT(ctx, t, s, [0, 0, 1.0], [-40, 20, 1.14]);
  cityWindow(ctx, t, 1100, 80, 700, 680, { snow: 1, seed: 101 });
  ctx.fillStyle = '#1e2148'; ctx.fillRect(-100, -100, 1200, H + 200); ctx.fillRect(1800, -100, 300, H + 200); ctx.fillRect(-100, 760, W + 300, 500); ctx.fillRect(-100, -100, W + 300, 180);
  ctx.fillStyle = '#141738'; ctx.fillRect(1440, 80, 14, 680); ctx.fillRect(1100, 400, 700, 12);
  // wall clock
  ctx.fillStyle = '#e9d9be'; ctx.beginPath(); ctx.arc(820, 230, 70, 0, 7); ctx.fill(); ctx.strokeStyle = '#2a2230'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(820, 230); ctx.lineTo(820 + Math.sin(t * .2) * 50, 230 - Math.cos(t * .2) * 50); ctx.moveTo(820, 230); ctx.lineTo(850, 250); ctx.stroke();
  // desk
  ctx.fillStyle = '#3a2a2c'; ctx.fillRect(200, 760, 1300, 34); ctx.fillStyle = '#2c1f22'; ctx.fillRect(240, 794, 380, 290); ctx.fillRect(1180, 794, 300, 290);
  // typewriter with paper
  ctx.fillStyle = '#2a2d3a'; ctx.fillRect(330, 660, 330, 100); ctx.fillStyle = '#e9e1cc'; ctx.fillRect(400, 560, 190, 110); ctx.fillStyle = 'rgba(40,30,40,.6)'; for (let i = 0; i < 6; i++) ctx.fillRect(415, 580 + i * 12, 150 - (i % 3) * 30, 4);
  // lamp + cone
  ctx.strokeStyle = '#141420'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(1050, 760); ctx.lineTo(1000, 560); ctx.lineTo(900, 500); ctx.stroke(); cone(ctx, 890, 510, 300, .35, .45, P.amber, .5);
  // red phone, shakes when ringing
  const ring = t > s.a + tRing ? Math.sin((t - s.a - tRing) * 40) * (Math.sin((t - s.a - tRing) * 3) > 0 ? 1 : 0) : 0;
  ctx.save(); ctx.translate(820 + ring * 3, 750); ctx.fillStyle = '#b8322a'; ctx.beginPath(); ctx.moveTo(-90, 0); ctx.lineTo(-70, -60); ctx.lineTo(70, -60); ctx.lineTo(90, 0); ctx.fill();
  ctx.fillStyle = '#d24438'; ctx.beginPath(); ctx.ellipse(0, -76 - Math.abs(ring) * 4, 100, 22, ring * .03, 0, 7); ctx.fill(); ctx.fillStyle = '#e9e1cc'; ctx.beginPath(); ctx.arc(0, -30, 22, 0, 7); ctx.fill(); ctx.restore();
  if (ring) { for (let k = 0; k < 3; k++) { const u = ((t * 1.5 + k / 3) % 1); ctx.strokeStyle = rgba(P.amber, .6 * (1 - u)); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(820, 690, 110 + u * 120, -2.6, -.5); ctx.stroke(); } }
  ctx.strokeStyle = '#7a221c'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(910, 745); ctx.bezierCurveTo(980, 800, 960, 900, 1100, 1080); ctx.stroke();
  dots(ctx, 200, 600, 1300, 480, .1);
  ctx.restore(); finish(ctx, t);
};

// ---------- clinic: a doctor checks a patient's monitor; the heartbeat line runs ----------
export const clinic = () => (ctx, t, s) => {
  ctx.save(); camT(ctx, t, s, [0, 0, 1.0], [40, -10, 1.1]);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2a3a6a'); g.addColorStop(1, '#3a3a6a'); ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, H + 400);
  cityWindow(ctx, t, 220, 140, 520, 460, { warm: .7, seed: 111 });
  ctx.fillStyle = '#2a3460'; ctx.fillRect(470, 140, 12, 460);
  // bed
  ctx.fillStyle = '#e9e1cc'; ctx.fillRect(560, 700, 760, 70); ctx.fillStyle = '#8fb0d0'; ctx.fillRect(560, 690, 520, 40); ctx.fillStyle = '#e9e1cc'; ctx.beginPath(); ctx.ellipse(1240, 690, 70, 26, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#1e2448'; ctx.fillRect(570, 770, 14, 200); ctx.fillRect(1300, 770, 14, 200);
  // monitor with heartbeat
  ctx.fillStyle = '#0b0d22'; ctx.fillRect(1380, 380, 300, 200); ctx.fillRect(1520, 580, 12, 380);
  ctx.save(); ctx.beginPath(); ctx.rect(1390, 390, 280, 180); ctx.clip(); ctx.fillStyle = '#06261e'; ctx.fillRect(1390, 390, 280, 180); ctx.strokeStyle = '#7ff0b0'; ctx.lineWidth = 3; ctx.beginPath();
  for (let i = 0; i <= 140; i++) { const x = 1390 + i * 2, ph = ((i / 140) * 2 - t * .9) % 1, p = ph < 0 ? ph + 1 : ph, y = 480 - (p > .45 && p < .5 ? -60 * Math.sin((p - .45) * 62.8) : 0) - (p > .55 && p < .6 ? 14 : 0); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore();
  addGlow(ctx, 1530, 480, 180, .25, '#7ff0b0', '#e8fff0');
  person(ctx, 1620, 1030, 520, t, { coat: '#e9e1cc', dark: '#2a3050', hood: false, skin: '#8a5a3c', hair: '#1a1530', phone: true, flip: true });
  dots(ctx, -200, 700, W + 400, 500, .08);
  ctx.restore(); finish(ctx, t, { vig: .4 });
};

// ---------- a classroom: rows of desks, a student with a tablet, a curve on the board ----------
export const classroom = () => (ctx, t, s) => {
  ctx.save(); camT(ctx, t, s, [-40, 20, 1.0], [40, -10, 1.1]);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#4a3a6a'); g.addColorStop(1, '#6a4a6a'); ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, H + 400);
  // arched windows with warm light beams
  for (let i = 0; i < 2; i++) { const x = 1240 + i * 300; ctx.fillStyle = '#f2c79a'; ctx.beginPath(); ctx.moveTo(x, 520); ctx.lineTo(x, 200); ctx.arc(x + 90, 200, 90, Math.PI, 0); ctx.lineTo(x + 180, 520); ctx.fill();
    ctx.save(); ctx.globalCompositeOperation = 'screen'; const gg = ctx.createLinearGradient(x, 300, x - 500, 1000); gg.addColorStop(0, 'rgba(255,190,130,.28)'); gg.addColorStop(1, 'rgba(255,190,130,0)'); ctx.fillStyle = gg; ctx.beginPath(); ctx.moveTo(x, 200); ctx.lineTo(x + 180, 200); ctx.lineTo(x - 200, 1080); ctx.lineTo(x - 600, 1080); ctx.fill(); ctx.restore(); }
  // board with a curve being drawn
  ctx.fillStyle = '#1f3a34'; ctx.fillRect(180, 220, 820, 400); ctx.strokeStyle = '#3a2a2a'; ctx.lineWidth = 14; ctx.strokeRect(180, 220, 820, 400);
  const u = lin(s.a + .4, s.a + 3.5, t); ctx.strokeStyle = 'rgba(240,240,220,.85)'; ctx.lineWidth = 4; ctx.beginPath(); for (let i = 0; i <= 100 * u; i++) { const v = i / 100, x = 240 + v * 700, y = 580 - (Math.exp(3 * v) - 1) / (Math.exp(3) - 1) * 300; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
  ctx.strokeStyle = 'rgba(240,240,220,.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(240, 260); ctx.lineTo(240, 585); ctx.lineTo(950, 585); ctx.stroke();
  // desks in rows
  for (let row = 0; row < 3; row++) for (let k = 0; k < 4; k++) { const sc = 1 - row * .18, x = 260 + k * 380 * sc + row * 80, y = 760 + row * -70; ctx.fillStyle = shade('#5a3a2a', -row * .03); ctx.fillRect(x, y, 260 * sc, 20 * sc); ctx.fillRect(x + 10, y + 20 * sc, 10, 120 * sc); ctx.fillRect(x + 240 * sc, y + 20 * sc, 10, 120 * sc);
    if ((row + k) % 3 === 1) { ctx.fillStyle = rgba(P.cyan, .9); ctx.fillRect(x + 80 * sc, y - 8, 70 * sc, 10); addGlow(ctx, x + 115 * sc, y - 6, 40, .4, P.cyan, '#e8fbff'); } }
  person(ctx, 1000, 1000, 470, t, { sit: true, typing: true, coat: '#c7a0b0', dark: '#3a2a4a', hood: false, skin: '#a06a4a', hair: '#1a1020' });
  ctx.fillStyle = rgba(P.cyan, .95); ctx.fillRect(1060, 805, 60, 40); addGlow(ctx, 1090, 825, 70, .6, P.cyan, '#e8fbff');
  dots(ctx, -200, 700, W + 400, 500, .08);
  ctx.restore(); finish(ctx, t, { vig: .35 });
};
