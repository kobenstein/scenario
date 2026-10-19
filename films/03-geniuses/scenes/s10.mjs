// 10 · Your part (10:00–10:51): the thousand PhDs in your pocket, better questions, the door held open, the photo grows, the last question.
// Carrier chain: bus at morning → phone → typed questions → book → narrow door → pull back to room + door → zoom into the room
// → the old group photo → it widens with faces from everywhere → the door behind them opens → morning light → bus, the last question, black.
import { W, H, C, rgba, clamp, lin, mix, sm, eio, eout, ein, sine, back, prng, canvas, addGlow, glow, text } from '../engine.mjs';
import { P, person, finish, shade, mixHex, fogBand } from '../lib/world.mjs';
import { once, cam, mini, narrowDoor, roomOfHeads, busInterior, busSeat } from '../lib/s08_helpers.mjs';
import { groupPhoto, PHOTO_W, PHOTO_H } from './s01.mjs';

const MINI_COLS = [C.cyan, '#ffd29a', '#8ff0b0', '#e8a3a0', '#b8a8ff', C.cyan, '#ffd29a'];

// ---------- the phone (portrait), screen drawn by callback in screen-local coords ----------
function phone(ctx, x, y, w, h, rot, inner) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.roundRect(-w / 2 + 18, -h / 2 + 24, w, h, 60); ctx.fill();
  ctx.fillStyle = '#0c0e22'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 60); ctx.fill();
  ctx.strokeStyle = '#3a3f6a'; ctx.lineWidth = 4; ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.roundRect(-w / 2 + 18, -h / 2 + 18, w - 36, h - 36, 46); ctx.clip();
  ctx.translate(-w / 2 + 18, -h / 2 + 18); inner(ctx, w - 36, h - 36); ctx.restore();
  ctx.restore();
}
function screenBg(ctx, w, h, warm = .3) {
  const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, mixHex('#141a44', '#2a2040', warm)); g.addColorStop(1, mixHex('#0a0d26', '#1a1430', warm));
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
}
// a chat bubble with typing reveal
function bubble(ctx, x, y, w, str, u, { mine = true, size = 30, alpha = 1, blur = 0 } = {}) {
  if (alpha <= 0) return 0;
  ctx.save(); ctx.globalAlpha = alpha; ctx.font = `500 ${size}px "Inter"`;
  const words = str.split(' '), lines = []; let cur = '';
  for (const wd of words) { const nx = cur ? cur + ' ' + wd : wd; if (ctx.measureText(nx).width > w - 60) { lines.push(cur); cur = wd; } else cur = nx; }
  if (cur) lines.push(cur);
  const bh = lines.length * size * 1.3 + 36;
  ctx.fillStyle = mine ? '#2b5bd7' : '#262a52'; ctx.beginPath(); ctx.roundRect(x, y, w, bh, 26); ctx.fill();
  if (blur) ctx.filter = `blur(${blur}px)`;
  let n = Math.floor(clamp(u) * str.length); ctx.fillStyle = '#f3efe2';
  lines.forEach((ln, i) => { const show = ln.slice(0, Math.max(0, n)); n -= ln.length + 1; ctx.fillText(show, x + 30, y + 22 + size + i * size * 1.3 - 6); });
  ctx.restore();
  return bh;
}

// ---------- 116 · "You already carry a thousand PhDs in your pocket." Bus at morning, mini experts awake on the seat backs ----------
const SEATS = [180, 600, 1020, 1440, 1860];
const SPOTS = (() => { const r = prng(116), a = []; SEATS.forEach((sx, i) => { for (let k = 0; k < 3; k++) a.push({ x: sx - 30 + k * 34 + (r() - .5) * 10, y: 610, d: r() * 1.4, col: MINI_COLS[(i * 3 + k) % MINI_COLS.length], seed: i * 3 + k }); }); for (let k = 0; k < 16; k++) a.push({ x: 80 + k * 115 + (r() - .5) * 30, y: 520, d: .6 + r() * 1.6, col: MINI_COLS[k % MINI_COLS.length], seed: 20 + k, sill: 1 }); return a; })();
const YOU = { x: 1090, y: 905 };
function busScene(ctx, t, tPop, { z = 1, fx = 960, fy = 540, warm = .55, minis = 1 } = {}) {
  busInterior(ctx, t, { warm, z, fx, fy });
  ctx.save(); cam(ctx, fx, fy, z);
  // window sill
  ctx.fillStyle = mixHex('#1a1f4a', '#4a2c40', warm); ctx.fillRect(-200, 530, W + 400, 26);
  // seat backs (side view) with you sitting in one
  SEATS.forEach((sx) => busSeat(ctx, sx, 600, { warm }));
  person(ctx, YOU.x, YOU.y, 300, t, { sit: true, phone: true, coat: P.amber });
  // minis: sit on the seat backs and the sill; they "wake": stand up, stretch, look toward you
  for (const m of SPOTS) {
    const k = clamp((t - tPop - m.d) / .5); if (k <= 0) continue;
    const awake = clamp((t - tPop - m.d - .5) / .6);
    mini(ctx, m.x, m.sill ? 528 : 604, 62, t, { col: m.col, pose: awake > 0 && awake < 1 ? 'jump' : (m.sill ? 'stand' : 'sit'), jump: awake, look: m.x < YOU.x ? 1 : -1, a: sm(k) * minis, seed: m.seed });
  }
  ctx.restore();
}
const busMorning = (T) => {
  const t0 = T.S('10a', 'You already'), tTh = T.S('10a', 'thousand');
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t));
    busScene(ctx, t, tTh - 1.2, { z: mix(1.05, 1.2, u), fx: mix(900, 1060, u), fy: mix(520, 600, u) });
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- 117 · "Ask them better questions." The old prompt gets deleted, the cursor blinks ----------
const OLD = 'make this email more polite';
const PH = { x: 960, y: 450, w: 540, h: 940 };
function minisOnPhone(ctx, t, list) {
  for (const m of list) mini(ctx, m.x, m.y, m.h || 70, t, m);
}
const deletePrompt = (T) => {
  const t0 = T.S('10a', 'Ask them'), tB = T.S('10a', 'better'), tQ = T.S('10a', 'questions');
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t));
    ctx.save(); cam(ctx, 960, mix(600, 560, u), mix(1.02, 1.08, u));
    ctx.fillStyle = '#1a1430'; ctx.fillRect(-200, -200, W + 400, H + 400);
    addGlow(ctx, 960, 560, 900, .25, '#6a8aff', '#d8e4ff');
    phone(ctx, PH.x, PH.y + 120, PH.w, PH.h, -.03, (x, w, h) => {
      screenBg(x, w, h);
      // input field near the bottom, the old prompt deletes letter by letter
      const k = lin(t0 + .1, tQ + .2, t), n = Math.round(OLD.length * (1 - k));
      x.fillStyle = '#1e2350'; x.beginPath(); x.roundRect(30, h - 330, w - 60, 90, 30); x.fill();
      x.font = '500 30px "Inter"'; x.fillStyle = '#f3efe2'; const str = OLD.slice(0, n); x.fillText(str, 60, h - 274);
      const cw = x.measureText(str).width;
      if (Math.floor(t * 2.2) % 2 === 0 || (k > 0 && k < 1)) { x.fillStyle = '#7fe3ff'; x.fillRect(64 + cw, h - 304, 3, 40); }
      // a faint old email draft above, fading
      x.globalAlpha = 1 - k; x.fillStyle = '#262a52'; x.beginPath(); x.roundRect(30, 120, w - 60, 340, 26); x.fill();
      x.fillStyle = 'rgba(243,239,226,.25)'; for (let i = 0; i < 7; i++) x.fillRect(60, 160 + i * 40, (w - 140) * (.6 + .4 * Math.sin(i * 2.3) ** 2), 14);
      x.globalAlpha = 1;
    });
    // minis lean over the phone's top edge, waiting
    const by = PH.y + 120 - PH.h / 2;
    minisOnPhone(ctx, t, [{ x: 780, y: by + 4, col: C.cyan, look: 1 }, { x: 880, y: by + 2, col: '#ffd29a', look: 1 }, { x: 1050, y: by + 2, col: '#8ff0b0', look: -1 }, { x: 1150, y: by + 4, col: '#e8a3a0', look: -1 }].map((m) => ({ ...m, h: 64, pose: 'stand' })));
    ctx.restore();
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- 118 · "What's known about the illness in your family. What's being tested. What it would take." ----------
export const BOOK = { x: 1290, y: 300 };
const threeQuestions = (T) => {
  const Q = [['What’s known about the illness in my family?', T.S('10a', "What's known"), T.E('10a', 'family')],
    ['What’s being tested right now?', T.S('10a', "What's being"), T.E('10a', 'tested')],
    ['What would it take?', T.S('10a', 'What it would'), T.E('10a', 'take')]];
  const props = ['book', 'dish', 'map'];
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t));
    ctx.save(); cam(ctx, 960, mix(560, 520, u), mix(1.08, 1.0, u));
    ctx.fillStyle = '#1a1430'; ctx.fillRect(-200, -200, W + 400, H + 400);
    addGlow(ctx, 960, 560, 900, .25, '#6a8aff', '#d8e4ff');
    phone(ctx, PH.x, PH.y + 120, PH.w, PH.h, -.03, (x, w, h) => {
      screenBg(x, w, h);
      let y = 140;
      Q.forEach(([q, a, b], i) => {
        const al = sm(lin(a - .25, a, t)); if (al <= 0) return;
        y += bubble(x, 90, y + (1 - al) * 20, w - 120, q, lin(a, b, t), { alpha: al, size: 30 }) + 26;
      });
      x.fillStyle = '#1e2350'; x.beginPath(); x.roundRect(30, h - 330, w - 60, 90, 30); x.fill();
      if (Math.floor(t * 2.2) % 2 === 0) { x.fillStyle = '#7fe3ff'; x.fillRect(64, h - 304, 3, 40); }
    });
    // after each question, minis jump up and run off to fetch: a book, a dish, a map — they come back carrying it
    const by = PH.y + 120 - PH.h / 2;
    Q.forEach(([, a, b], i) => {
      for (let k = 0; k < 3; k++) {
        const ph = clamp((t - b - k * .12) / 1.1), x0 = 760 + i * 200 + k * 34;
        const jump = clamp(ph * 2.2), carry = ph > .45;
        const tx = i === 0 && k === 0 ? BOOK.x : mix(x0, x0 + (i - 1) * 260 + (k - 1) * 60, eio(clamp((ph - .4) / .6)));
        const ty = i === 0 && k === 0 ? mix(by, BOOK.y, eio(clamp((ph - .4) / .6))) : by - 40 * eio(clamp((ph - .4) / .6));
        const xx = i === 0 && k === 0 ? mix(x0, tx, eio(clamp((ph - .4) / .6))) : tx;
        mini(ctx, xx, ty, 64, t, { col: MINI_COLS[(i * 3 + k) % 7], pose: jump < 1 ? 'jump' : 'stand', jump, prop: carry ? props[i] : null, seed: i * 3 + k, look: k - 1 });
      }
    });
    ctx.restore();
    // the book carrier glows a little (the next shot dives into it)
    const ph0 = clamp((t - Q[0][2]) / 1.1);
    if (ph0 > .5) addGlow(ctx, BOOK.x + 20, BOOK.y - 30, 90, .35 * sm(lin(s.b - 1.5, s.b, t)), P.amber, '#fff3dd');
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- 119 · "If you work in science, health, or government, you're standing at that door. Hold it open." ----------
const ROLES = [{ key: 'science', label: 'SCIENCE', coat: '#9fe0f0', dx: -250 }, { key: 'health,', label: 'HEALTH', coat: '#f3efe2', dx: -110 }, { key: 'government', label: 'GOVERNMENT', coat: '#5a6aa8', dx: 190 }];
const holdDoor = (T) => {
  const t0 = T.S('10a', 'If you work'), tDoor = T.S('10a', 'that door'), tHold = T.S('10a', 'Hold it'), tR = ROLES.map((r) => T.S('10a', r.key));
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t)), o = mix(.08, .92, eio(lin(tHold - .5, tHold + 1.4, t))), shake = Math.sin(t * 20) * 2 * lin(tHold - .5, tHold, t) * (1 - lin(tHold + .8, tHold + 1.2, t));
    ctx.save(); cam(ctx, 960, mix(560, 520, u), mix(1.1, 1.0, u));
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0f1238'); g.addColorStop(1, '#222a66'); ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, H + 400);
    // wall
    ctx.fillStyle = '#141a48'; ctx.fillRect(-200, 120, W + 400, 760);
    ctx.strokeStyle = 'rgba(255,255,255,.03)'; ctx.lineWidth = 2; for (let y = 160; y < 880; y += 60) { ctx.beginPath(); ctx.moveTo(-200, y); ctx.lineTo(W + 200, y); ctx.stroke(); }
    ctx.fillStyle = '#0b0e30'; ctx.fillRect(-200, 880, W + 400, 400);
    narrowDoor(ctx, 960 + shake, 880, 200, 520, o, t, { lightA: 1 });
    // three people push the door open together (silhouettes, rim-lit by the light from the gap)
    ROLES.forEach((r, i) => {
      const a = sm(lin(tR[i] - .4, tR[i] + .2, t)), lean = lin(tHold - .6, tHold, t);
      const px = 960 + r.dx + (1 - a) * (i === 2 ? 200 : -200) + o * (i === 2 ? 60 : 0);
      ctx.save(); ctx.globalAlpha = a;
      person(ctx, px, 900, 360, t, { coat: r.coat, hood: false, flip: i === 2, hair: ['#2a2030', '#4a3020', '#1a1a1a'][i], skin: ['#c98f6a', '#8a5a40', '#e0b090'][i], look: lean, arm: (c, sh) => { c.beginPath(); c.moveTo(3, sh + 5); c.lineTo(20, sh + 2 - lean * 10); c.lineTo(34, sh - 6 - lean * 16); c.stroke(); } });
      addGlow(ctx, px + (i === 2 ? -20 : 20), 700, 120, .25 * o, P.amber, '#fff3dd');
      ctx.restore();
      text(ctx, r.label, px, 505, { size: 18, weight: 600, color: C.cream, align: 'center', alpha: a * .85, spacing: 6 });
    });
    ctx.restore();
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- 120 · "...are we building the door, or just the room?" Wide: the giant room of heads, the narrow door being widened ----------
export const DOOR120 = { x: 1500, y: 640 };
const roomAndDoor = (T) => {
  const t0 = T.S('10a', 'And the next'), tDoor = T.S('10a', 'the door'), tRoom = T.S('10a', 'just the room');
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t));
    ctx.save(); cam(ctx, mix(1060, 1180, u), 540, mix(1.0, 1.06, u));
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0a0c26'); g.addColorStop(1, '#2a3270'); ctx.fillStyle = g; ctx.fillRect(-400, -200, W + 800, H + 400);
    fogBand(ctx, t, 820, 260, { a: .25, hex: '#8ab8e8', seed: 12 });
    // the room: a huge building, cut open, full of minds
    ctx.fillStyle = '#10143c'; ctx.fillRect(40, 120, 1160, 780);
    roomOfHeads(ctx, t, 80, 160, 1080, 700, { rows: 13 });
    ctx.strokeStyle = '#2a3270'; ctx.lineWidth = 10; ctx.strokeRect(80, 160, 1080, 700);
    // pulse on "room"
    const pr = Math.exp(-Math.pow((t - tRoom - .2) / .35, 2)); addGlow(ctx, 620, 500, 700, .25 * pr, C.cyan, C.cyanWhite);
    // the door: alone in a wall, slowly being built wider (scaffold, workers lift a new beam)
    const wide = eio(lin(t0, s.b, t)), dw = mix(70, 240, wide);
    ctx.fillStyle = '#121640'; ctx.fillRect(1290, 380, 460, 520);
    narrowDoor(ctx, DOOR120.x, 900, dw, 300, .85, t, { lightA: .9 + .4 * Math.exp(-Math.pow((t - tDoor - .2) / .35, 2)) });
    // scaffold + workers
    ctx.strokeStyle = '#3a4280'; ctx.lineWidth = 5;
    for (const sx of [DOOR120.x - dw / 2 - 70, DOOR120.x + dw / 2 + 70]) { ctx.beginPath(); ctx.moveTo(sx, 900); ctx.lineTo(sx, 520); ctx.moveTo(sx - 30, 700); ctx.lineTo(sx + 30, 700); ctx.stroke(); }
    const by = mix(560, 590, Math.sin(t * 1.2) * .5 + .5);
    ctx.fillStyle = '#c9a36a'; ctx.fillRect(DOOR120.x - dw / 2 - 40, by, dw + 80, 16);
    person(ctx, DOOR120.x - dw / 2 - 70, 700, 120, t, { coat: '#ffae4a', hood: false, arm: (c, sh) => { c.beginPath(); c.moveTo(3, sh + 5); c.lineTo(14, sh - 14); c.lineTo(20, sh - 30); c.stroke(); } });
    person(ctx, DOOR120.x + dw / 2 + 70, 700, 120, t, { coat: '#7fe3ff', hood: false, flip: true, arm: (c, sh) => { c.beginPath(); c.moveTo(3, sh + 5); c.lineTo(14, sh - 14); c.lineTo(20, sh - 30); c.stroke(); } });
    ctx.fillStyle = '#0b0e30'; ctx.fillRect(-400, 900, W + 800, 400);
    ctx.restore();
    const qa = sm(lin(T.S('10a', 'are we') - .2, T.S('10a', 'are we') + .3, t));
    text(ctx, 'the door', 1480, 230, { size: 64, font: 'Instrument Serif Italic', align: 'center', alpha: qa * sm(lin(tDoor - .2, tDoor + .2, t)), color: '#ffd29a' });
    text(ctx, 'or just the room?', 640, 230, { size: 64, font: 'Instrument Serif Italic', align: 'center', alpha: qa * sm(lin(tRoom - .4, tRoom, t)), color: C.cyanWhite });
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- 121–123 · the group photo returns, widens with people from everywhere, the door behind them opens ----------
const PEOPLE = (() => {
  const r = prng(1210), list = [];
  // rows around the photo: x, y in world coords around the centre (960,540); photo occupies ~±300 × ±185
  const kinds = ['nurse', 'farmer', 'student', 'grandma', 'worker', 'kid', 'doctor', 'elder'];
  for (let row = 0; row < 5; row++) {
    const y = 380 + row * 140, n = 16 + row * 2, span = 2200 + row * 500;
    for (let i = 0; i < n; i++) {
      const x = 960 - span / 2 + (i + .5) * span / n + (r() - .5) * 40;
      if (Math.abs(x - 960) < 340 && y < 760) continue; // keep the photo area clear
      list.push({ x, y: y + (r() - .5) * 20, h: 160 + row * 40, kind: kinds[Math.floor(r() * kinds.length)], d: Math.hypot(x - 960, (y - 540) * 1.6), coat: ['#e58f8a', '#7fe3ff', '#ffae4a', '#8ff0b0', '#b8a8ff', '#f3efe2', '#5a7ab8', '#c8661e'][Math.floor(r() * 8)], skin: ['#5a3a2a', '#8a5a40', '#c98f6a', '#e0b090', '#a06a4a'][Math.floor(r() * 5)], hair: ['#1a1530', '#2a2030', '#cfcbd6', '#4a3020'][Math.floor(r() * 4)], ph: r() * 6 });
    }
  }
  list.push({ x: 1420, y: 660, h: 200, kind: 'grandma', d: 600, coat: '#a0727a', skin: '#d7a383', hair: '#cfcbd6', ph: 1, mom: 1 });
  return list.sort((a, b) => a.y - b.y);
})();
function figure(ctx, p, t, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  person(ctx, p.x, p.y, p.h * mix(.8, 1, a), t, { coat: p.coat, hood: false, skin: p.skin, hair: p.kind === 'grandma' || p.kind === 'elder' ? '#cfcbd6' : p.hair, breathe: 1.5 });
  const s = p.h / 100, hx = p.x + 1.5 * s, hy = p.y - 92 * s;
  ctx.lineWidth = 2;
  if (p.kind === 'nurse') { ctx.fillStyle = '#f3efe2'; ctx.fillRect(hx - 7 * s, hy - 10 * s, 14 * s, 5 * s); }
  if (p.kind === 'farmer') { ctx.fillStyle = '#c9a36a'; ctx.beginPath(); ctx.ellipse(hx, hy - 6 * s, 14 * s, 3.5 * s, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(hx, hy - 7 * s, 7 * s, Math.PI, 0); ctx.fill(); }
  if (p.kind === 'student') { ctx.fillStyle = '#3a4280'; ctx.beginPath(); ctx.roundRect(p.x - 18 * s, p.y - 80 * s, 10 * s, 26 * s, 3 * s); ctx.fill(); }
  if (p.kind === 'grandma') { ctx.strokeStyle = '#1a1a2a'; ctx.lineWidth = 1.2 * s; ctx.beginPath(); ctx.arc(hx + 3 * s, hy + 1 * s, 2.6 * s, 0, 7); ctx.stroke(); }
  if (p.kind === 'doctor') { ctx.strokeStyle = '#c9cfe8'; ctx.lineWidth = 1.4 * s; ctx.beginPath(); ctx.arc(p.x + 2 * s, p.y - 70 * s, 6 * s, 0, Math.PI); ctx.stroke(); }
  if (p.mom) addGlow(ctx, hx, hy, 60 * s, .25, P.amber, '#fff3dd');
  ctx.restore();
}
const PH_SCALE = .5;
function crowd(ctx, t, { grow = 0, zoom = 1, door = 0, sepia = 1, fy = 540 } = {}) {
  ctx.save(); cam(ctx, 960, fy, zoom);
  // backdrop: paper-dark at first, then a wide warm wall with a door that opens
  const g = ctx.createLinearGradient(0, -800, 0, 1800); g.addColorStop(0, mixHex('#120f24', '#3a2a48', door)); g.addColorStop(1, mixHex('#1a1430', '#8a5a56', door)); ctx.fillStyle = g; ctx.fillRect(-2000, -1200, W + 4000, H + 2400);
  if (door > 0) {
    // the door, wide open, behind everyone
    const dw = 420, dh = 640, dx = 960, dy = 300;
    ctx.fillStyle = '#05061a'; ctx.fillRect(dx - dw / 2, dy - dh, dw, dh);
    const gg = ctx.createLinearGradient(0, dy - dh, 0, dy); gg.addColorStop(0, '#ffe6b8'); gg.addColorStop(1, '#fff6e0');
    ctx.save(); ctx.globalAlpha = door; ctx.fillStyle = gg; ctx.fillRect(dx - dw / 2, dy - dh, dw * eout(door), dh); ctx.restore();
    ctx.strokeStyle = '#2a2040'; ctx.lineWidth = 20; ctx.strokeRect(dx - dw / 2 - 10, dy - dh - 10, dw + 20, dh + 10);
    addGlow(ctx, dx, dy - dh / 2, 1400 * door, .55 * door, P.amber, '#fff6e0');
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lb = ctx.createLinearGradient(0, dy, 0, 1800); lb.addColorStop(0, rgba('#ffd29a', .4 * door)); lb.addColorStop(1, rgba('#ffd29a', 0)); ctx.fillStyle = lb; ctx.beginPath(); ctx.moveTo(dx - dw / 2, dy); ctx.lineTo(dx + dw / 2, dy); ctx.lineTo(dx + 1600, 1800); ctx.lineTo(dx - 1600, 1800); ctx.fill(); ctx.restore();
  }
  // people from everywhere join, rings outward from the photo
  const rmax = mix(0, 2600, grow);
  for (const p of PEOPLE) { const a = sm(clamp((rmax - p.d) / 260)); if (p.y < 520) figure(ctx, p, t, a); }
  // the photo itself (sepia), it stays in the middle of the crowd
  const pw = PHOTO_W * PH_SCALE, ph = PHOTO_H * PH_SCALE;
  ctx.save(); ctx.translate(960, 540); ctx.rotate(-.015 + Math.sin(t * .4) * .004);
  ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(-pw / 2 + 12, -ph / 2 + 16, pw, ph);
  ctx.drawImage(groupPhoto(), -pw / 2, -ph / 2, pw, ph);
  if (door > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(P.amber, .18 * door); ctx.fillRect(-pw / 2, -ph / 2, pw, ph); }
  ctx.restore();
  for (const p of PEOPLE) { const a = sm(clamp((rmax - p.d) / 260)); if (p.y >= 520) figure(ctx, p, t, a); }
  ctx.restore();
}
const photoReturn = (T) => {
  const t0 = T.S('10a', 'For all'), tF = T.S('10a', 'brilliant minds');
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t));
    crowd(ctx, t, { zoom: mix(2.1, 1.75, u) });
    // dust in the lamp light
    const r = prng(5); for (let i = 0; i < 40; i++) { const x = (r() * W + t * 8 * (r() - .3)) % W, y = (r() * H + t * 6) % H; ctx.fillStyle = rgba('#ffe6c0', .25 * r()); ctx.fillRect(x, y, 2, 2); }
    finish(ctx, t, { vig: .6 });
  };
};
const photoWidens = (T) => {
  const t0 = T.S('10a', 'That limit'), tE = T.S('10a', 'ending');
  return (ctx, t, s) => {
    const k = eio(lin(t0, s.b + .3, t));
    crowd(ctx, t, { grow: eout(lin(t0 + .1, s.b + .5, t)), zoom: mix(1.75, .62, k), fy: mix(540, 480, k) });
    finish(ctx, t, { vig: .5 });
  };
};
const doorBehind = (T) => {
  const t0 = T.S('10a', 'What matters'), tA = T.S('10a', 'ask them', 1);
  return (ctx, t, s) => {
    const u = lin(s.a, s.b, t);
    crowd(ctx, t, { grow: 1, zoom: mix(.6, .66, sine(u)), fy: mix(470, 430, sine(u)), door: eio(lin(t0 + .2, tA + .6, t)) });
    finish(ctx, t, { vig: .45 });
  };
};

// ---------- 124 · "So here's my question for you. If a million geniuses worked for you tomorrow, what would you ask them first?" ----------
const lastQuestion = (T) => {
  const t0 = T.S('10a', "So here's"), tM = T.S('10a', 'million'), tW = T.S('10a', 'what would you'), tF = T.E('10a', 'first'), end = T.duration;
  return (ctx, t, s) => {
    const u = sine(lin(s.a, tF, t));
    busScene(ctx, t, -100, { z: mix(1.35, 1.6, u), fx: mix(1000, 1080, u), fy: mix(700, 760, u), warm: .9 });
    // the phone, over her shoulder: a question being typed (unreadable), a mini looks up and nods
    const pa = sm(lin(s.a + .4, s.a + 1.4, t)), dark = sm(lin(tF + .5, tF + 1.6, t));
    ctx.save(); ctx.globalAlpha = pa;
    phone(ctx, 1380, 640 + (1 - pa) * 60, 520, 900, .05, (x, w, h) => {
      screenBg(x, w, h, .5);
      bubble(x, 60, h - 520, w - 120, 'If a million minds could help my mother see again, where would they start?', lin(t0 + .5, tF, t), { size: 28, blur: 5 });
      x.fillStyle = '#1e2350'; x.beginPath(); x.roundRect(24, h - 200, w - 48, 80, 28); x.fill();
      if (Math.floor(t * 2.2) % 2 === 0) { x.fillStyle = '#7fe3ff'; x.fillRect(54, h - 176, 3, 34); }
      const nod = Math.max(0, Math.sin((t - tF) * 6)) * (t > tF - .2 && t < tF + 1 ? 1 : 0);
      mini(x, w / 2, h - 230, 110, t, { col: '#ffd29a', pose: 'stand', look: .5, nod: t > tW ? nod : 0 });
      addGlow(x, w / 2, h - 300, 160, .25, P.amber, '#fff3dd');
      if (dark > 0) { x.fillStyle = `rgba(4,5,14,${dark})`; x.fillRect(0, 0, w, h); }
    });
    ctx.restore();
    // everything fades to black, the last line stays as text
    const black = sm(lin(tF + 1.0, tF + 2.2, t)); ctx.fillStyle = `rgba(7,9,24,${black})`; ctx.fillRect(0, 0, W, H);
    const la = sm(lin(tF + 1.8, tF + 2.6, t)) * (1 - sm(lin(end - 1.6, end - .3, t)));
    text(ctx, 'What would you ask them first?', W / 2, H / 2 + 20, { size: 76, font: 'Instrument Serif', align: 'center', alpha: la });
    if (t > end - .3) { ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, H); }
  };
};

export default function (T) {
  const S = (p, n) => T.S('10a', p, n);
  return [
    { t: T.seg('10a').start - .4, draw: busMorning(T), tr: 'zoom', d: 1.0, x: W / 2, y: H / 2, depth: 5 },
    { t: S('Ask them') - .25, draw: deletePrompt(T), tr: 'zoom', d: .9, x: 1080, y: 660, depth: 4 },
    { t: S("What's known") - .2, draw: threeQuestions(T), tr: 'match', d: .6 },
    { t: S('If you work') - .2, draw: holdDoor(T), tr: 'zoom', d: 1.0, x: BOOK.x + 20, y: BOOK.y - 30, depth: 5 },
    { t: S('And the next') - .3, draw: roomAndDoor(T), tr: 'out', d: 1.3, x: DOOR120.x, y: 750, depth: 3.5 },
    { t: S('For all') - .4, draw: photoReturn(T), tr: 'zoom', d: 1.2, x: 560, y: 470, depth: 5 },
    { t: S('That limit') - .15, draw: photoWidens(T), tr: 'match', d: .4 },
    { t: S('What matters') - .15, draw: doorBehind(T), tr: 'match', d: .4 },
    { t: S("So here's") - .4, draw: lastQuestion(T), tr: 'fog', d: 1.4 },
  ];
}
