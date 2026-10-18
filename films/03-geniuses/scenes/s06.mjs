// 06 · The narrow door (4:26–5:52): the slow steps after the idea, the drug pipeline, the waiting room, the reveal of the door,
// Amodei's question, the cell that can't be rushed, the door taken apart and rebuilt wider.
// Carrier chain: idea swarm + snail's pill → kettle → drop → test tube → drinking bottle → cage door → phase doors → corridor board (K7)
// → fallen pill → molecule → lungs → waiting room ticket → idea queue in the field → TV in the grass (K2) → keyhole → cell → door planks → gate.
import { W, H, C, rgba, clamp, lin, mix, sm, eio, eout, ein, sine, prng, canvas, addGlow, glow, text } from '../engine.mjs';
import { P, skyGrad, fogBand, cone, hill, grass, person, finish, shade, mixHex, cityLayer } from '../lib/world.mjs';
import { clipScreen, clipLabel, clipQuote, source } from '../lib/kit.mjs';
import { ideaCard, capsule, snail, molecule, woodDoor, workHand } from '../lib/s06_helpers.mjs';

const cache = new Map(); const once = (k, f) => { if (!cache.has(k)) cache.set(k, f()); return cache.get(k); };

// ---------- 54: ideas race down the corridor in seconds; below, a snail carries a pill ----------
const snailX = (t) => 640 + (t - 266) * 22, SNAIL_Y = 880;
export const pillOnSnail = (t) => ({ x: snailX(t) - 62 * 1.5, y: SNAIL_Y - 140 * 1.5 });
const swarm = (T) => {
  const tSlow = T.S('06a', 'slow');
  const cards = (() => { const r = prng(54), a = []; for (let i = 0; i < 90; i++) a.push({ y: 80 + r() * 700, sp: 900 + r() * 900, ph: r() * 4000, s: .5 + r() * .8, warm: r() < .15, rot: (r() - .5) * .3 }); return a; })();
  return (ctx, t, s) => {
    const z = 1 + .12 * eio(lin(tSlow - .3, tSlow + 1.2, t)), fx = pillOnSnail(t);
    ctx.save(); ctx.translate(fx.x, fx.y); ctx.scale(z, z); ctx.translate(-fx.x, -fx.y);
    // corridor in perspective
    ctx.fillStyle = '#0a0c26'; ctx.fillRect(-200, -200, W + 400, H + 400);
    const vx = 1500, vy = 430;
    const fl = ctx.createLinearGradient(0, vy, 0, H); fl.addColorStop(0, '#151a48'); fl.addColorStop(1, '#0b0d2a');
    ctx.fillStyle = fl; ctx.beginPath(); ctx.moveTo(-200, H + 200); ctx.lineTo(vx - 90, vy + 60); ctx.lineTo(vx + 90, vy + 60); ctx.lineTo(W + 600, H + 200); ctx.fill();
    ctx.strokeStyle = 'rgba(95,143,196,.18)'; ctx.lineWidth = 2; for (let i = -8; i <= 8; i++) { ctx.beginPath(); ctx.moveTo(vx + i * 10, vy + 60); ctx.lineTo(vx + i * 260, H + 200); ctx.stroke(); }
    for (let k = 0; k < 9; k++) { const q = Math.pow(k / 9, 1.8), y = mix(vy + 60, H + 200, q); ctx.beginPath(); ctx.moveTo(-200, y); ctx.lineTo(W + 600, y); ctx.stroke(); }
    // ceiling lights
    for (let k = 0; k < 7; k++) { const q = Math.pow(k / 7, 1.6), x = mix(vx, -300, q), y = mix(vy - 40, -40, q); addGlow(ctx, x, y, 40 + 140 * q, .4, '#5f8fc4', '#d8f7ff'); }
    addGlow(ctx, vx, vy, 260, .45, C.cyan, C.cyanWhite);
    // the swarm: cards streak from left to the vanishing point, motion trails
    for (const c of cards) {
      const p = ((t * c.sp + c.ph) % 4200) / 4200, x = mix(-300, vx, ein(p) * .25 + p * .75), sc = c.s * mix(1.3, .2, p), y = mix(c.y, vy, p * .9);
      const hex = c.warm ? P.amber : C.cyan;
      ctx.strokeStyle = rgba(hex, .25 * sc); ctx.lineWidth = 10 * sc; ctx.beginPath(); ctx.moveTo(x - 260 * sc, y + (c.y - vy) * .02); ctx.lineTo(x, y); ctx.stroke();
      ideaCard(ctx, x, y, sc, { hex, rot: c.rot, glowA: .35 });
    }
    // the snail, crawling at its own pace with the pill strapped on its shell
    snail(ctx, snailX(t), SNAIL_Y, 1.5, t);
    const pp = pillOnSnail(t);
    addGlow(ctx, pp.x, pp.y, 90, .5, P.amber, '#fff3dd');
    capsule(ctx, pp.x, pp.y - 20, 100, -.2 + Math.sin(t * 2.2) * .03);
    ctx.restore();
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- 55: the pill drops into a factory kettle; a drop of drug condenses slowly ----------
const DROP_X = 960;
const kettle = (T) => {
  const t0 = T.S('06a', 'A new medicine'), tMade = T.S('06a', 'made'), tFall = T.S('06a', 'Then tested') - .35;
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t));
    ctx.fillStyle = '#0b0d28'; ctx.fillRect(0, 0, W, H);
    const bg = ctx.createRadialGradient(960, 420, 0, 960, 420, 1100); bg.addColorStop(0, '#24275e'); bg.addColorStop(1, '#0a0b22'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(0, mix(0, -30, u));
    // pipes in the background with pulsing flow
    ctx.lineCap = 'round';
    for (const [y, a] of [[180, .6], [260, .4], [880, .5]]) { ctx.strokeStyle = '#1a1f52'; ctx.lineWidth = 34; ctx.beginPath(); ctx.moveTo(-40, y); ctx.lineTo(W + 40, y); ctx.stroke(); ctx.strokeStyle = rgba(C.cyan, .25 * a); ctx.lineWidth = 4; ctx.setLineDash([30, 60]); ctx.lineDashOffset = -t * 120; ctx.beginPath(); ctx.moveTo(-40, y); ctx.lineTo(W + 40, y); ctx.stroke(); ctx.setLineDash([]); }
    for (const x of [330, 1590]) { ctx.strokeStyle = '#161a48'; ctx.lineWidth = 40; ctx.beginPath(); ctx.moveTo(x, 180); ctx.lineTo(x, 880); ctx.stroke(); }
    // gauges with wobbling needles
    for (const [gx, gy, ph] of [[330, 470, 0], [1590, 560, 2]]) { ctx.fillStyle = '#0d1030'; ctx.beginPath(); ctx.arc(gx, gy, 56, 0, 7); ctx.fill(); ctx.strokeStyle = rgba(C.cream, .5); ctx.lineWidth = 3; ctx.stroke(); const q = -2.2 + 1.6 * (.5 + .5 * Math.sin(t * 1.3 + ph)); ctx.strokeStyle = P.amber; ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + Math.cos(q) * 44, gy + Math.sin(q) * 44); ctx.stroke(); }
    // the kettle: a big round vessel with rivets and a funnel on top, a spout below at DROP_X
    const kx = 960, ky = 420, kr = 300;
    const kg = ctx.createRadialGradient(kx - 120, ky - 120, 20, kx, ky, kr); kg.addColorStop(0, '#5a5f9e'); kg.addColorStop(.6, '#262b66'); kg.addColorStop(1, '#141638');
    ctx.fillStyle = kg; ctx.beginPath(); ctx.ellipse(kx, ky, kr, kr * .85, 0, 0, 7); ctx.fill();
    ctx.fillStyle = rgba(C.cream, .2); for (let i = 0; i < 16; i++) { const q = i / 16 * 6.283; ctx.beginPath(); ctx.arc(kx + Math.cos(q) * kr * .92, ky + Math.sin(q) * kr * .78, 5, 0, 7); ctx.fill(); }
    // window into the kettle: liquid swirling
    ctx.save(); ctx.beginPath(); ctx.arc(kx, ky + 20, 120, 0, 7); ctx.clip(); ctx.fillStyle = '#120f2a'; ctx.fillRect(kx - 130, ky - 110, 260, 260);
    for (let i = 0; i < 5; i++) { ctx.strokeStyle = rgba(P.amber, .35); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(kx, ky + 20, 30 + i * 22, t * (1 + i * .2), t * (1 + i * .2) + 2.2); ctx.stroke(); }
    addGlow(ctx, kx, ky + 20, 140, .45 + .15 * Math.sin(t * 3), P.amber, '#fff3dd'); ctx.restore();
    ctx.strokeStyle = '#0b0d26'; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(kx, ky + 20, 124, 0, 7); ctx.stroke();
    // funnel on top
    ctx.fillStyle = '#20245a'; ctx.beginPath(); ctx.moveTo(kx - 90, ky - kr * .85 - 90); ctx.lineTo(kx + 90, ky - kr * .85 - 90); ctx.lineTo(kx + 26, ky - kr * .85 + 8); ctx.lineTo(kx - 26, ky - kr * .85 + 8); ctx.fill();
    // spout
    ctx.fillStyle = '#1b1f52'; ctx.fillRect(kx - 22, ky + kr * .8, 44, 90); ctx.fillRect(kx - 34, ky + kr * .8 + 80, 68, 20);
    // steam puffs
    for (let k = 0; k < 6; k++) { const q = ((t * .3 + k / 6) % 1), x = kx + 200 + Math.sin(q * 5 + k) * 30, y = ky - 260 - q * 260; ctx.fillStyle = rgba('#c9d8ff', (1 - q) * .12); ctx.beginPath(); ctx.arc(x, y, 30 + q * 60, 0, 7); ctx.fill(); }
    ctx.restore();
    // the pill arrives (from the zoom point) and falls into the funnel
    const uP = lin(t0 - .5, t0 + .55, t);
    if (uP < 1) { const p0 = pillOnSnail(t0 - .6), x = mix(p0.x, 960, eio(uP)), y = mix(p0.y, 140, eio(uP)) - Math.sin(uP * Math.PI) * 140; capsule(ctx, x, y + mix(0, -30, u), 70, uP * 6); addGlow(ctx, x, y, 80, .5, P.amber, '#fff3dd'); }
    else if (uP < 1.01) { /* splash flash */ }
    const splash = Math.exp(-Math.pow((t - t0 - .6) / .2, 2)); if (splash > .02) addGlow(ctx, 960, 150 + mix(0, -30, u), 200, .6 * splash, P.amber, '#fff3dd');
    // the drop forms slowly at the spout, swelling, then falls
    const sy = 420 + 300 * .8 + 100 + mix(0, -30, u);
    const grow = eout(lin(tMade - .8, tFall, t)), fall = lin(tFall, tFall + .9, t);
    if (grow > 0) {
      const r = 6 + 22 * grow, y = sy + r + ein(fall) * 700;
      ctx.fillStyle = '#ffcf8a'; ctx.beginPath(); ctx.moveTo(DROP_X, y - r * 2.1); ctx.bezierCurveTo(DROP_X + r * .3, y - r, DROP_X + r, y - r * .6, DROP_X + r, y); ctx.arc(DROP_X, y, r, 0, Math.PI); ctx.bezierCurveTo(DROP_X - r, y - r * .6, DROP_X - r * .3, y - r, DROP_X, y - r * 2.1); ctx.fill();
      addGlow(ctx, DROP_X, y, 90 + 40 * grow, .7, P.amber, '#fff3dd');
    }
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- 56: the drop falls into a rack of test tubes; cells tumble in the liquid; a day counter runs ----------
const TUBE = { x: 960, y0: 330, y1: 830 };
const tubes = (T) => {
  const tIn = T.S('06a', 'Then tested'), tCells = T.S('06a', 'cells');
  const cells = (() => { const r = prng(56), a = []; for (let i = 0; i < 70; i++) a.push({ k: Math.floor(r() * 5), x: r(), y: r(), ph: r() * 6, s: .6 + r() * .6 }); return a; })();
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t)), z = mix(1, 1.18, u);
    ctx.fillStyle = '#0a0c26'; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(TUBE.x, 560); ctx.scale(z, z); ctx.translate(-TUBE.x, -560);
    const bg = ctx.createRadialGradient(960, 500, 0, 960, 500, 1000); bg.addColorStop(0, '#22285e'); bg.addColorStop(1, '#0a0b22'); ctx.fillStyle = bg; ctx.fillRect(-200, -200, W + 400, H + 400);
    // lab bench
    ctx.fillStyle = '#141838'; ctx.fillRect(-200, 860, W + 400, 400); ctx.fillStyle = '#1e2350'; ctx.fillRect(-200, 850, W + 400, 14);
    // rack
    ctx.fillStyle = '#2a2f6e'; ctx.fillRect(600, 640, 720, 30); ctx.fillRect(600, 820, 720, 24); ctx.fillRect(610, 640, 20, 200); ctx.fillRect(1290, 640, 20, 200);
    for (let i = 0; i < 5; i++) {
      const x = 680 + i * 140, mid = i === 2, fill = mid ? .55 + .2 * eout(lin(tIn + .3, tIn + .8, t)) : .5;
      const y0 = TUBE.y0 + (mid ? 0 : 90), y1 = TUBE.y1, w = 64;
      // liquid
      ctx.save(); ctx.beginPath(); ctx.roundRect(x - w / 2, y0, w, y1 - y0, [4, 4, 32, 32]); ctx.clip();
      const ly = mix(y1, y0, fill);
      const lg = ctx.createLinearGradient(0, ly, 0, y1); lg.addColorStop(0, rgba(mid ? P.amber : C.cyan, .55)); lg.addColorStop(1, rgba(mid ? P.amberDeep : C.cyanDeep, .7));
      ctx.fillStyle = lg; ctx.fillRect(x - w / 2, ly + Math.sin(t * 3 + i) * 2, w, y1 - ly);
      // cells drifting inside, dividing slowly
      for (const c of cells) { if (c.k !== i) continue; const cx = x - w / 2 + 10 + c.x * (w - 20), cy = ly + 20 + c.y * (y1 - ly - 40) + Math.sin(t * .8 + c.ph) * 8, r = 7 * c.s; const split = (Math.sin(t * .5 + c.ph) + 1) / 2; ctx.fillStyle = 'rgba(255,240,220,.7)'; ctx.beginPath(); ctx.arc(cx - split * 3, cy, r, 0, 7); ctx.arc(cx + split * 3, cy, r, 0, 7); ctx.fill(); }
      ctx.restore();
      ctx.strokeStyle = rgba(C.cyanWhite, .5); ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x - w / 2, y0, w, y1 - y0, [4, 4, 32, 32]); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(x - w / 2 + 8, y0 + 10, 6, y1 - y0 - 40);
      if (mid) addGlow(ctx, x, ly + 40, 140, .35 + .4 * Math.exp(-Math.pow((t - tIn - .35) / .3, 2)), P.amber, '#fff3dd');
    }
    // the drop arrives from above (camera tilted down with it) and falls into the middle tube
    const fall = lin(tIn - .7, tIn + .35, t);
    if (fall < 1) { const y = mix(-80, TUBE.y0 + 220, ein(fall)); ctx.fillStyle = '#ffcf8a'; ctx.beginPath(); ctx.arc(TUBE.x, y, 26, 0, 7); ctx.fill(); addGlow(ctx, TUBE.x, y, 120, .7, P.amber, '#fff3dd'); }
    ctx.restore();
    // day counter (running, clicks faster and faster)
    const days = Math.floor(Math.pow(clamp((t - tIn) / (s.b - tIn)), 1.6) * 214);
    text(ctx, 'DAY', 1560, 300, { size: 20, weight: 600, color: C.muted, spacing: 6, alpha: sm(lin(tIn, tIn + .4, t)) });
    text(ctx, String(Math.max(1, days)).padStart(3, '0'), 1560, 380, { size: 84, font: 'Instrument Serif', color: C.cream, alpha: sm(lin(tIn, tIn + .4, t)) });
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- 57: a small mouse in a lab cage drinks from the bottle (the tube); a calendar on the wall flips ----------
const CAGE_DOOR = { x: 1430, y: 640 };
const mouse = (ctx, x, y, s, t, { walk = 0, drink = 0, flip = false } = {}) => {
  ctx.save(); ctx.translate(x, y); ctx.scale(flip ? -s : s, s);
  const sn = Math.sin(t * 14) * 2 * (1 - walk), bob = walk ? Math.abs(Math.sin(t * 10)) * 3 : 0;
  // tail
  ctx.strokeStyle = '#d8a6a0'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-60, -10); ctx.bezierCurveTo(-110, -10 + Math.sin(t * 2) * 10, -130, 20, -170, 10 + Math.sin(t * 2.6) * 14); ctx.stroke();
  // body
  const g = ctx.createRadialGradient(-10, -40, 5, -10, -30, 80); g.addColorStop(0, '#f0ece6'); g.addColorStop(1, '#a9a4b8');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(-10, -30 - bob, 70, 40, -.08 - drink * .2, 0, 7); ctx.fill();
  // head
  ctx.save(); ctx.translate(55, -42 - bob - drink * 30); ctx.rotate(-drink * .6);
  ctx.fillStyle = '#ebe6e0'; ctx.beginPath(); ctx.ellipse(0, 0, 36, 24, .2, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(20, -14); ctx.lineTo(48 + sn, 4); ctx.lineTo(18, 16); ctx.fill();
  ctx.fillStyle = '#e8a3a0'; ctx.beginPath(); ctx.arc(48 + sn, 4, 5, 0, 7); ctx.fill();
  ctx.fillStyle = '#dcd4d8'; ctx.beginPath(); ctx.arc(-10, -24, 18, 0, 7); ctx.fill(); ctx.fillStyle = '#e8a3a0'; ctx.beginPath(); ctx.arc(-10, -24, 10, 0, 7); ctx.fill();
  ctx.fillStyle = '#1b1530'; ctx.beginPath(); ctx.arc(18, -4, 4.5, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 1.2; for (const a of [-.2, 0, .2]) { ctx.beginPath(); ctx.moveTo(44 + sn, 4); ctx.lineTo(80 + sn, 4 + a * 60 + Math.sin(t * 9) * 3); ctx.stroke(); }
  ctx.restore();
  // feet
  ctx.fillStyle = '#e8a3a0'; for (const fx of [-50, -20, 20, 40]) ctx.fillRect(fx + Math.sin(t * 10 + fx) * 5 * walk, -6, 12, 6);
  ctx.restore();
};
const cage = (T) => {
  const t0 = T.S('06a', 'Then on animals'), tOpen = T.S('06a', 'Then on people') - .9;
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t));
    ctx.fillStyle = '#0c0e2a'; ctx.fillRect(0, 0, W, H);
    // wall + calendar flipping (months)
    const wg = ctx.createLinearGradient(0, 0, 0, H); wg.addColorStop(0, '#1d2154'); wg.addColorStop(1, '#10133a'); ctx.fillStyle = wg; ctx.fillRect(0, 0, W, H);
    const MON = ['MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB'];
    const fl = (t - t0 + .6) * 4.2, k = Math.floor(Math.max(0, fl)), fr = fl - Math.floor(fl);
    const cx = 250, cy = 200;
    ctx.fillStyle = '#d9d2c0'; ctx.fillRect(cx, cy, 200, 220); ctx.fillStyle = '#c0533e'; ctx.fillRect(cx, cy, 200, 50);
    text(ctx, MON[k % 12], cx + 100, cy + 150, { size: 64, font: 'Instrument Serif', color: '#1b1530', align: 'center' });
    for (let i = 0; i < 4; i++) for (let j = 0; j < 5; j++) { ctx.fillStyle = 'rgba(27,21,48,.25)'; ctx.fillRect(cx + 22 + j * 34, cy + 168 + i * 10, 22, 4); }
    if (fl > 0) { // flying page
      ctx.save(); ctx.translate(cx + 100, cy); ctx.scale(1, Math.cos(fr * Math.PI)); ctx.fillStyle = fr < .5 ? '#e8e2d2' : '#bfb7a2'; ctx.fillRect(-100, 0, 200, 220 * (1 - fr * .3)); ctx.restore();
    }
    ctx.fillStyle = '#121434'; ctx.fillRect(cx + 96, cy - 20, 8, 22);
    // cage (camera very slowly pushes in)
    const z = mix(1, 1.08, u); ctx.save(); ctx.translate(960, 600); ctx.scale(z, z); ctx.translate(-960, -600);
    const x0 = 520, x1 = 1520, y0 = 380, y1 = 900;
    ctx.fillStyle = 'rgba(20,24,64,.9)'; ctx.fillRect(x0, y1 - 120, x1 - x0, 120);
    // bedding
    const r = prng(57); for (let i = 0; i < 220; i++) { ctx.fillStyle = rgba('#d8c8a0', .2 + r() * .3); ctx.fillRect(x0 + r() * (x1 - x0), y1 - 110 + r() * 100, 10 + r() * 14, 3); }
    // food bowl
    ctx.fillStyle = '#5b6aa8'; ctx.beginPath(); ctx.ellipse(700, y1 - 70, 70, 20, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#c99a5a'; ctx.beginPath(); ctx.ellipse(700, y1 - 76, 56, 12, 0, 0, 7); ctx.fill();
    // the bottle hanging down from the lid at TUBE.x — first frame matches the tube
    const bx = TUBE.x; ctx.fillStyle = rgba(C.cyanWhite, .2); ctx.beginPath(); ctx.roundRect(bx - 32, TUBE.y0, 64, 380, [4, 4, 32, 32]); ctx.fill();
    ctx.fillStyle = rgba(P.amber, .5); ctx.fillRect(bx - 28, TUBE.y0 + 120, 56, 240); ctx.strokeStyle = rgba(C.cyanWhite, .6); ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(bx - 32, TUBE.y0, 64, 380, [4, 4, 32, 32]); ctx.stroke();
    ctx.fillStyle = '#8f96c0'; ctx.fillRect(bx - 5, TUBE.y0 + 380, 10, 90);
    addGlow(ctx, bx, TUBE.y0 + 250, 120, .3, P.amber, '#fff3dd');
    // mouse: sniffs the bowl, then scurries to the bottle and drinks
    const go = eio(lin(t0 + .5, t0 + 1.4, t)), mx = mix(800, bx - 100, go), dr = sm(lin(t0 + 1.4, t0 + 1.8, t));
    mouse(ctx, mx, y1 - 40, 1.25, t, { walk: go > 0 && go < 1 ? 1 : 0, drink: dr });
    // wire bars (front)
    ctx.strokeStyle = 'rgba(160,170,220,.35)'; ctx.lineWidth = 3;
    for (let x = x0; x <= x1; x += 34) { ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); }
    ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(160,170,220,.55)'; ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
    // cage door on the right, swings open at the end, warm light behind
    const op = eio(lin(tOpen - .4, tOpen + .5, t));
    const dw = 170, dh = 260, dx = CAGE_DOOR.x - dw / 2, dy = CAGE_DOOR.y - dh / 2;
    if (op > 0) { ctx.fillStyle = rgba('#ffe2b0', .85 * op); ctx.fillRect(dx, dy, dw, dh); addGlow(ctx, CAGE_DOOR.x, CAGE_DOOR.y, 260, .6 * op, P.amber, '#fff3dd'); }
    ctx.save(); ctx.translate(dx, dy); ctx.scale(Math.cos(op * 1.3), 1); ctx.strokeStyle = 'rgba(190,200,240,.8)'; ctx.lineWidth = 5; ctx.strokeRect(0, 0, dw, dh); ctx.lineWidth = 3; for (let x = 0; x <= dw; x += 28) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, dh); ctx.stroke(); } ctx.restore();
    ctx.restore();
    fogBand(ctx, t, 980, 160, { a: .14, hex: '#8ab8e8' });
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- 58: three doors, Phase I, II, III; people walk through, more after each door; seasons pass in the windows ----------
const phases = (T) => {
  const t0 = T.S('06a', 'Then on people'), tY = T.S('06a', 'for years');
  const DOORS = [500, 1300, 2100], GROUND = 860;
  const crowd = (() => { const r = prng(58), a = []; const zones = [[-200, 470, 3], [540, 1270, 9], [1340, 2070, 22], [2140, 2700, 40]]; zones.forEach(([a0, a1, n], zi) => { for (let i = 0; i < n; i++) a.push({ zi, a0, a1, off: r(), sp: 40 + r() * 30, h: 150 - zi * 14 + r() * 20, coat: r() < .15 ? P.amber : mixHex('#2a3270', '#4a5aa0', r()), ph: r() * 6, y: r() * 40 }); }); return a; })();
  return (ctx, t, s) => {
    const u = eio(lin(s.a + .3, s.b - .2, t)), off = mix(0, DOORS[2] - 960, u);
    // window strip at the top: seasons cycle (spring green → summer → autumn → snow)
    const yrs = (t - t0) / 1.2, season = ((yrs % 4) + 4) % 4, si = Math.floor(season), sf = season - si;
    const SKY = ['#5d7fb8', '#7aa6d8', '#c58a5e', '#8ea0bf'], LEAF = ['#6fbf73', '#3f9a52', '#d97b2e', '#e8ecf5'];
    const sky = mixHex(SKY[si], SKY[(si + 1) % 4], sf), leaf = mixHex(LEAF[si], LEAF[(si + 1) % 4], sf);
    ctx.fillStyle = '#121540'; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(-off, 0);
    for (let wx = -200; wx < 2900; wx += 360) {
      ctx.fillStyle = sky; ctx.fillRect(wx, 110, 300, 230);
      // tree outside
      ctx.fillStyle = '#2a2236'; ctx.fillRect(wx + 140, 230, 16, 110);
      ctx.fillStyle = leaf; ctx.beginPath(); ctx.arc(wx + 148, 210, 70, 0, 7); ctx.arc(wx + 100, 240, 46, 0, 7); ctx.arc(wx + 196, 240, 46, 0, 7); ctx.fill();
      if (si === 3 || (si === 2 && sf > .6)) { const r = prng(wx + 9); for (let i = 0; i < 18; i++) { ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.fillRect(wx + r() * 300, 110 + ((r() * 230 + t * 40) % 230), 3, 3); } }
      ctx.strokeStyle = '#0d1030'; ctx.lineWidth = 12; ctx.strokeRect(wx, 110, 300, 230); ctx.beginPath(); ctx.moveTo(wx + 150, 110); ctx.lineTo(wx + 150, 340); ctx.stroke();
      // daylight beam
      const bm = ctx.createLinearGradient(wx, 340, wx + 200, GROUND); bm.addColorStop(0, rgba(sky, .2)); bm.addColorStop(1, rgba(sky, 0)); ctx.fillStyle = bm; ctx.beginPath(); ctx.moveTo(wx, 340); ctx.lineTo(wx + 300, 340); ctx.lineTo(wx + 500, GROUND); ctx.lineTo(wx + 200, GROUND); ctx.fill();
    }
    // floor
    ctx.fillStyle = '#0c0f30'; ctx.fillRect(-200, GROUND, 3200, 300); ctx.fillStyle = 'rgba(95,143,196,.15)'; ctx.fillRect(-200, GROUND, 3200, 3);
    // walls with doors (people pass through)
    DOORS.forEach((dx, i) => {
      ctx.fillStyle = '#181c4c'; ctx.fillRect(dx - 40, 0, 80, GROUND);
      ctx.fillStyle = '#ffe2b0'; ctx.fillRect(dx - 34, GROUND - 260, 68, 260); addGlow(ctx, dx, GROUND - 130, 200, .45, P.amber, '#fff3dd');
      ctx.fillStyle = '#3a2618'; ctx.save(); ctx.translate(dx + 34, GROUND - 260); ctx.scale(.25, 1); ctx.fillRect(0, 0, 68, 260); ctx.restore();
      text(ctx, ['PHASE I', 'PHASE II', 'PHASE III'][i], dx, GROUND - 300, { size: 30, weight: 600, color: P.amber, align: 'center', spacing: 6 });
    });
    // people: each group walks right within its zone; groups grow after each door
    for (const p of crowd) {
      const span = p.a1 - p.a0, x = p.a0 + ((p.off * span + (t - t0) * p.sp) % span);
      const fade = sm(clamp((x - p.a0) / 40)) * sm(clamp((p.a1 - x) / 40));
      ctx.globalAlpha = fade; person(ctx, x, GROUND + 10 + p.y * .4, p.h, t, { phase: t * 5 + p.ph, coat: p.coat }); ctx.globalAlpha = 1;
    }
    ctx.restore();
    // "for years" stamp
    const ya = sm(lin(tY - .1, tY + .4, t)); if (ya > 0) text(ctx, `YEAR ${1 + Math.floor(clamp((t - t0) / 1.2, 0, 9))}`, 1780, 1000, { size: 26, weight: 600, color: C.cream, align: 'right', spacing: 6, alpha: ya });
    finish(ctx, t, { vig: .5 });
  };
};
export const PHASE3 = { x: 960, y: 860 - 130 };

// ---------- C4 (K7): a long corridor; the clip plays on a board; pills roll down a long chute, nine of ten fall out ----------
const BOARD = { x: 150, y: 170, w: 960, h: 540 };
export const FALLEN = { x: 1420, y: 930 };
const chute = (T) => {
  const c = T.clip('K7');
  // chute path: 3 slanted runs, switching direction, with stage marks
  const RUNS = [[1220, 210, 1830, 360], [1830, 460, 1220, 610], [1220, 710, 1830, 860]];
  const STAGES = ['target', 'lab', 'animals', 'phase I', 'phase II', 'phase III'];
  const len = RUNS.reduce((a, [x0, y0, x1, y1]) => a + Math.hypot(x1 - x0, y1 - y0), 0);
  const at = (d) => { for (const [x0, y0, x1, y1] of RUNS) { const L = Math.hypot(x1 - x0, y1 - y0); if (d <= L) return [mix(x0, x1, d / L), mix(y0, y1, d / L), Math.atan2(y1 - y0, x1 - x0)]; d -= L; } const r = RUNS[2]; return [r[2], r[3], 0]; };
  // pill i enters at e_i, falls out at stage (or survives if i % 10 === 7)
  const PILLS = (() => { const r = prng(70), a = []; for (let i = 0; i < 60; i++) { const surv = i % 10 === 7; a.push({ e: c.start - 3 + i * .62, fail: surv ? 2 : .12 + r() * .8, surv }); } return a; })();
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t)), camX = mix(30, -30, u), z = mix(1.04, 1, u);
    ctx.fillStyle = '#0b0d28'; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(960 + camX, 540); ctx.scale(z, z); ctx.translate(-960, -540);
    // corridor: wall, floor, ceiling strip lights
    const wg = ctx.createLinearGradient(0, 0, 0, H); wg.addColorStop(0, '#1a1e50'); wg.addColorStop(.8, '#131640'); ctx.fillStyle = wg; ctx.fillRect(-100, -100, W + 200, H);
    ctx.fillStyle = '#0c0f2c'; ctx.fillRect(-100, 900, W + 200, 300); ctx.fillStyle = 'rgba(95,143,196,.15)'; ctx.fillRect(-100, 900, W + 200, 3);
    for (let i = 0; i < 4; i++) { ctx.fillStyle = 'rgba(216,247,255,.5)'; ctx.fillRect(100 + i * 520, 40, 260, 10); cone(ctx, 230 + i * 520, 50, 860, 0, .5, '#9fc4ff', .12); }
    // the board with the clip
    ctx.fillStyle = '#2a1e18'; ctx.fillRect(BOARD.x - 22, BOARD.y - 22, BOARD.w + 44, BOARD.h + 44);
    ctx.fillStyle = '#3a2a1e'; ctx.fillRect(BOARD.x - 40, BOARD.y + BOARD.h + 22, BOARD.w + 80, 16);
    clipScreen(ctx, t, T, 'K7', BOARD.x, BOARD.y, BOARD.w, BOARD.h, { radius: 2 });
    clipQuote(ctx, t, T, 'K7', BOARD.x + 60, BOARD.y + BOARD.h - 40, BOARD.w - 120, 30);
    // the chute
    ctx.lineCap = 'round';
    RUNS.forEach(([x0, y0, x1, y1], i) => {
      ctx.strokeStyle = '#2b3170'; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(x0, y0 + 14); ctx.lineTo(x1, y1 + 14); ctx.stroke();
      ctx.strokeStyle = rgba(C.cyan, .35); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y0 + 2); ctx.lineTo(x1, y1 + 2); ctx.stroke();
      if (i < 2) { const xe = x1, ye = y1; ctx.strokeStyle = '#2b3170'; ctx.lineWidth = 26; ctx.beginPath(); ctx.arc(xe + (i ? -30 : 30) * 0, (ye + RUNS[i + 1][1]) / 2 + 14, 50, i ? Math.PI * .5 : -Math.PI * .5, i ? Math.PI * 1.5 : Math.PI * .5, !!i); ctx.stroke(); }
    });
    // stage marks along the chute
    STAGES.forEach((lb, i) => { const [x, y] = at(len * (i + .5) / STAGES.length); ctx.fillStyle = rgba(C.cream, .5); ctx.fillRect(x - 1, y - 40, 2, 26); text(ctx, lb.toUpperCase(), x, y - 48, { size: 14, weight: 600, color: C.muted, align: 'center', spacing: 3 }); });
    // the tray at the end: market
    ctx.fillStyle = '#3a2618'; ctx.fillRect(1760, 900, 160, 24); addGlow(ctx, 1840, 900, 120, .4, P.amber, '#fff3dd');
    text(ctx, 'MARKET', 1840, 960, { size: 16, weight: 600, color: P.amber, align: 'center', spacing: 4 });
    // pills
    let surv = 0;
    for (const p of PILLS) {
      const age = t - p.e; if (age < 0) continue;
      const d = age * 210, df = p.fail * len;
      if (!p.surv && d > df) { // falls out sideways, greys, tumbles to the floor
        const [x, y] = at(df), f = age - df / 210, gy = Math.min(y + 300 * f * f + 80 * f, 900 - 8), gx = x + 60 * f;
        if (f > 3) continue;
        capsule(ctx, gx, gy, 38, f * 6, { grey: clamp(f * 2), a: 1 - lin(2, 3, f) });
        continue;
      }
      if (p.surv && d > len) { surv++; const [x, y] = at(len); capsule(ctx, Math.min(1760 + surv * 30, 1900), 890, 38, 0); addGlow(ctx, 1780 + surv * 30, 890, 50, .6, P.amber, '#fff3dd'); continue; }
      const [x, y, a] = at(Math.min(d, len)); capsule(ctx, x, y - 6, 38, a + age * 7); addGlow(ctx, x, y, 34, .3, P.amber, '#fff3dd');
    }
    // one pill, at the very end, falls out and lands glowing on the floor: the carrier into the AI molecule
    const tL = c.end - 2.4, lf = lin(tL, tL + 1, t);
    if (lf > 0) { const x = mix(1500, FALLEN.x, lf), y = Math.min(mix(620, FALLEN.y, ein(lf)), FALLEN.y); capsule(ctx, x, y, 44, lf * 5); addGlow(ctx, x, y, 80 + 60 * sm(lin(tL + 1, c.end, t)), .7, C.cyan, C.cyanWhite); }
    ctx.restore();
    clipLabel(ctx, t, T, 'K7', 110, 900);
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- 59: on a screen a molecule is drawn line by line, atoms snap in ----------
const MOL0 = { x: 960, y: 520, s: 1.15 };
const design = (T) => {
  const t0 = T.S('06b', 'Look at'), tAI = T.S('06b', 'AI');
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t));
    ctx.fillStyle = '#080a20'; ctx.fillRect(0, 0, W, H);
    // monitor UI: grid, side panel with scrolling lines
    ctx.save(); ctx.translate(960, 540); ctx.scale(mix(1.04, 1, u), mix(1.04, 1, u)); ctx.translate(-960, -540);
    ctx.fillStyle = '#0d1236'; ctx.fillRect(60, 60, W - 120, H - 120); ctx.strokeStyle = rgba(C.cyan, .25); ctx.lineWidth = 2; ctx.strokeRect(60, 60, W - 120, H - 120);
    ctx.strokeStyle = 'rgba(143,230,255,.06)'; ctx.lineWidth = 1; for (let x = 60; x < W - 60; x += 48) { ctx.beginPath(); ctx.moveTo(x, 60); ctx.lineTo(x, H - 60); ctx.stroke(); } for (let y = 60; y < H - 60; y += 48) { ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(W - 60, y); ctx.stroke(); }
    const r = prng(59); for (let i = 0; i < 22; i++) { const y = 120 + ((i * 38 - (t - t0) * 60) % 860 + 860) % 860; ctx.fillStyle = rgba(C.cyan, .25); ctx.fillRect(1560, y, 60 + r() * 180, 6); }
    text(ctx, 'DESIGNED WITH AI', 120, 130, { size: 20, weight: 600, color: C.cyan, spacing: 6, alpha: sm(lin(tAI - .4, tAI, t)) });
    // a scan line sweeps where atoms are placed
    const dU = eio(lin(t0 - .2, tAI + .6, t));
    const sx = mix(560, 1360, dU); ctx.fillStyle = rgba(C.cyan, .12); ctx.fillRect(sx - 2, 80, 4, H - 160); addGlow(ctx, sx, MOL0.y, 120, .25 * (1 - dU), C.cyan, C.cyanWhite);
    ctx.restore();
    molecule(ctx, MOL0.x, MOL0.y, MOL0.s, t, { u: dU, glowA: .4 });
    // the pill from the corridor arrives and dissolves into the first atom
    const pa = 1 - sm(lin(t0 - .3, t0 + .4, t)); if (pa > 0) { capsule(ctx, mix(FALLEN.x, MOL0.x, 1 - pa), mix(FALLEN.y, MOL0.y, 1 - pa), 44, 0, { a: pa }); }
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- 60: lungs as two trees with frost-scars; the molecule travels in; the frost thaws where it arrives ----------
const lungs = (T) => {
  const t0 = T.S('06b', 'One for a'), tScar = T.S('06b', 'scars'), tFinal = T.S('06b', 'final stage');
  // branching tree (deterministic)
  const tree = (() => { const segs = []; const grow = (x, y, a, l, d) => { if (d > 6) return; const x1 = x + Math.cos(a) * l, y1 = y + Math.sin(a) * l; segs.push([x, y, x1, y1, d]); grow(x1, y1, a - .42, l * .74, d + 1); grow(x1, y1, a + .38, l * .72, d + 1); }; grow(0, 0, Math.PI / 2, 120, 0); return segs; })();
  const frost = (() => { const r = prng(60), a = []; for (const sg of tree) if (sg[4] >= 3 && r() < .55) a.push({ x: sg[2], y: sg[3], s: .5 + r(), side: r() < .5 ? -1 : 1 }); return a; })();
  const target = (() => { const sg = tree.filter((q) => q[4] === 4)[3]; return { x: sg[2], y: sg[3] }; })();
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t));
    ctx.fillStyle = '#0a0b24'; ctx.fillRect(0, 0, W, H);
    const bg = ctx.createRadialGradient(960, 540, 0, 960, 540, 900); bg.addColorStop(0, '#1d1f55'); bg.addColorStop(1, '#090a20'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const z = mix(1, 1.1, u), cx = 960, cy = 230;
    ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
    // trachea
    ctx.strokeStyle = rgba(C.cyan, .7); ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx, 60); ctx.lineTo(cx, cy); ctx.stroke();
    const grow = eout(lin(t0 - .6, t0 + .8, t)), thaw = eio(lin(tFinal - 1.6, tFinal + .2, t));
    for (const side of [-1, 1]) {
      ctx.save(); ctx.translate(cx + side * 40, cy); ctx.rotate(side * -.62); ctx.scale(side * 1.25, 1.25);
      for (const [x0, y0, x1, y1, d] of tree) { if (d / 7 > grow) continue; ctx.strokeStyle = rgba(C.cyan, .85 - d * .08); ctx.lineWidth = 16 - d * 2.2; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); }
      // frost at branch tips (scars)
      const fa = sm(lin(tScar - .3, tScar + .5, t));
      for (const f of frost) {
        const isT = side === 1 && Math.hypot(f.x - target.x, f.y - target.y) < 140, a = fa * (isT ? 1 - thaw : 1);
        if (a <= 0) continue;
        ctx.strokeStyle = rgba('#eef6ff', .75 * a); ctx.lineWidth = 2;
        for (let k = 0; k < 6; k++) { const q = k / 6 * 6.283 + f.s; ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(f.x + Math.cos(q) * 16 * f.s, f.y + Math.sin(q) * 16 * f.s); ctx.stroke(); }
        ctx.fillStyle = rgba('#ffffff', .12 * a); ctx.beginPath(); ctx.arc(f.x, f.y, 20 * f.s, 0, 7); ctx.fill();
      }
      if (side === 1 && thaw > 0) { ctx.restore(); ctx.save(); ctx.translate(cx + 40, cy); ctx.rotate(-.62); ctx.scale(1.25, 1.25); addGlow(ctx, target.x, target.y, 180 * thaw, .8 * thaw, P.amber, '#fff3dd'); }
      ctx.restore();
    }
    ctx.restore();
    // the molecule: starts at the centre (matched from the screen), shrinks and travels down the right lung to the target
    const tx = (() => { const q = -.62, sc = 1.25; const x = target.x * sc, y = target.y * sc; return { x: cx + 40 + x * Math.cos(q) - y * Math.sin(q), y: cy + x * Math.sin(q) + y * Math.cos(q) }; })();
    const tz = { x: 960 + (tx.x - 960) * z, y: 540 + (tx.y - 540) * z };
    const m = eio(lin(t0 - .1, tFinal - .8, t));
    const mpath = m < .4 ? { x: mix(MOL0.x, cx * 1, m / .4), y: mix(MOL0.y, 80, m / .4) } : { x: mix(cx, tz.x, (m - .4) / .6), y: mix(80, tz.y, (m - .4) / .6) };
    molecule(ctx, mpath.x, mpath.y, mix(MOL0.s, .16, eout(clamp(m * 2))), t, { glowA: .5 });
    // on-screen fact
    const la = sm(lin(tFinal - .2, tFinal + .4, t)) * (1 - sm(lin(s.b - .5, s.b, t)));
    if (la > 0) { text(ctx, 'Rentosertib (Insilico Medicine)', 110, 920, { size: 40, font: 'Instrument Serif', alpha: la }); text(ctx, 'PHASE III SINCE SEPT 2026', 110, 960, { size: 18, weight: 600, color: P.amber, alpha: la, spacing: 5 }); }
    finish(ctx, t, { vig: .55 });
  };
};
export const LUNG_SPOT = { x: 960, y: 540 };

// ---------- 61: a waiting room full of molecules on chairs with ticket numbers; the approval counter's shutter stays down ----------
export const TICKET = { x: 860, y: 470 };
const waiting = (T) => {
  const t0 = T.S('06b', 'More than'), tNot = T.S('06b', 'not one'), tAppr = T.S('06b', 'approved');
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t));
    ctx.fillStyle = '#121540'; ctx.fillRect(0, 0, W, H);
    const wg = ctx.createLinearGradient(0, 0, 0, H); wg.addColorStop(0, '#202460'); wg.addColorStop(1, '#141842'); ctx.fillStyle = wg; ctx.fillRect(0, 0, W, 700);
    ctx.fillStyle = '#0d1030'; ctx.fillRect(0, 700, W, 380);
    ctx.save(); const z = mix(1.06, 1, u); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
    // the counter window on the right, shutter down, red light
    ctx.fillStyle = '#0c0f2c'; ctx.fillRect(1440, 200, 380, 420); ctx.fillStyle = '#2b3170'; ctx.fillRect(1460, 260, 340, 260);
    ctx.fillStyle = '#3a4080'; for (let y = 262; y < 520; y += 18) ctx.fillRect(1462, y, 336, 12);
    const shk = tAppr < t && t < tAppr + .6 ? Math.sin(t * 60) * 3 * (1 - (t - tAppr) / .6) : 0;
    ctx.fillStyle = '#d9d2c0'; ctx.fillRect(1520 + shk, 160, 220, 54); text(ctx, 'APPROVAL', 1630 + shk, 198, { size: 28, weight: 600, color: '#1b1530', align: 'center', spacing: 5 });
    addGlow(ctx, 1630, 560, 40, .8 * (.6 + .4 * Math.sin(t * 2)), '#ff5a4a', '#ffd0c8');
    // "now serving" display: dashes
    ctx.fillStyle = '#0b0d22'; ctx.fillRect(820, 110, 280, 90); text(ctx, 'NOW SERVING', 960, 140, { size: 14, weight: 600, color: C.muted, align: 'center', spacing: 4 });
    text(ctx, Math.sin(t * 3) > 0 ? '– – –' : '', 960, 185, { size: 40, weight: 600, color: '#ff8a7a', align: 'center' });
    // rows of chairs with molecules
    const ROWS = [{ y: 480, n: 7, s: .2, x0: 260 }, { y: 640, n: 8, s: .23, x0: 200 }, { y: 830, n: 8, s: .27, x0: 140 }];
    let k = 0;
    ROWS.forEach((row, ri) => {
      for (let i = 0; i < row.n; i++) {
        const x = row.x0 + i * (ri === 2 ? 160 : 150), y = row.y, sc = row.s;
        ctx.fillStyle = '#2a3270'; ctx.fillRect(x - 55, y, 110, 16); ctx.fillRect(x - 55, y - 80, 14, 96); ctx.fillRect(x - 50, y + 16, 8, 60); ctx.fillRect(x + 42, y + 16, 8, 60);
        const bob = Math.sin(t * (1.5 + (k % 3) * .4) + k) * 5, mol = k === 2 ? 1 : .8;
        molecule(ctx, x, y - 50 + bob, sc, t + k, { glowA: .12, a: mol });
        // ticket number
        const tn = 117 - k * 3;
        ctx.fillStyle = '#e8e2d2'; ctx.save(); ctx.translate(x + 30, y - 18 + bob); ctx.rotate(.15); ctx.fillRect(-18, -12, 36, 24); ctx.restore();
        text(ctx, String(tn), x + 30, y - 11 + bob, { size: 14, weight: 600, color: '#1b1530', align: 'center' });
        k++;
      }
    });
    // the wall clock ticking
    ctx.strokeStyle = C.cream; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(300, 200, 50, 0, 7); ctx.stroke(); const q = t * 2; ctx.beginPath(); ctx.moveTo(300, 200); ctx.lineTo(300 + Math.cos(q) * 40, 200 + Math.sin(q) * 40); ctx.stroke(); ctx.beginPath(); ctx.moveTo(300, 200); ctx.lineTo(300 + Math.cos(q / 12) * 26, 200 + Math.sin(q / 12) * 26); ctx.stroke();
    ctx.restore();
    // on-screen numbers
    const a1 = sm(lin(t0 + .3, t0 + .9, t)) * (1 - sm(lin(s.b - .6, s.b - .1, t)));
    if (a1 > 0) { text(ctx, '100+', 110, 930, { size: 72, font: 'Instrument Serif', color: C.cream, alpha: a1 }); text(ctx, 'AI-DISCOVERED DRUGS IN HUMAN TRIALS', 260, 922, { size: 18, weight: 600, color: C.muted, spacing: 4, alpha: a1 }); }
    const a2 = sm(lin(tNot, tNot + .5, t)) * (1 - sm(lin(s.b - .6, s.b - .1, t)));
    if (a2 > 0) { text(ctx, '0', 110, 1010, { size: 72, font: 'Instrument Serif', color: P.amber, alpha: a2 }); text(ctx, 'APPROVED · OCT 2026', 170, 1002, { size: 18, weight: 600, color: P.amber, spacing: 4, alpha: a2 }); }
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- 62 + 63: the field. Left the huge glowing room of minds, right the tiny old door; a queue of ideas jams between them.
// Then the camera tracks along the queue to an old TV standing in the grass. ----------
const FIELD = { door: { x: 1640, y: 760 }, room: { x: 300, y: 720 }, tv: { x: 1460, y: 1090 } };
const queue = (() => { const pts = []; for (let i = 0; i < 170; i++) { const q = i / 169; const x = mix(640, 1610, Math.pow(q, .8)), y = 700 + Math.sin(q * 9) * 55 * (1 - q) + q * 50; pts.push({ x, y, q }); } return pts; })();
const fieldWorld = (ctx, t, cam, { tDoor = 1e9 } = {}) => {
  // cam = {x, y, z}: world point at screen centre
  skyGrad(ctx, { t, stars: .6, bottom: '#334a8e' });
  ctx.save(); ctx.translate(960, 540); ctx.scale(cam.z, cam.z); ctx.translate(-cam.x, -cam.y);
  hill(ctx, [[-600, 640], [200, 610], [900, 640], [1500, 620], [2600, 640]], { col: '#151a4a' });
  ctx.fillStyle = '#121640'; ctx.fillRect(-800, 1000, 3800, 900);
  fogBand(ctx, t, 640, 160, { a: .25, hex: '#8ab8e8' });
  // room of minds: a big glass hall full of glowing heads
  const R = FIELD.room, rw = 640, rh = 600;
  addGlow(ctx, R.x, R.y - 120, 700, .55, C.cyan, C.cyanWhite);
  ctx.fillStyle = rgba('#0f2a5a', .9); ctx.fillRect(R.x - rw / 2, R.y - rh, rw, rh);
  const r = prng(62);
  for (let j = 0; j < 13; j++) for (let i = 0; i < 15; i++) { const x = R.x - rw / 2 + 24 + i * 42, y = R.y - rh + 40 + j * 44, a = .5 + .5 * Math.sin(t * 2 + i * .7 + j); ctx.fillStyle = rgba(C.cyanWhite, .5 + .4 * a); ctx.beginPath(); ctx.arc(x, y, 8, 0, 7); ctx.fill(); ctx.fillRect(x - 11, y + 9, 22, 14); }
  ctx.strokeStyle = rgba(C.cyanWhite, .6); ctx.lineWidth = 4; ctx.strokeRect(R.x - rw / 2, R.y - rh, rw, rh);
  for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.moveTo(R.x - rw / 2 + i * rw / 6, R.y - rh); ctx.lineTo(R.x - rw / 2 + i * rw / 6, R.y); ctx.stroke(); }
  // the queue of idea cards (jammed: dense near the door, barely moving)
  for (let i = queue.length - 1; i >= 0; i--) { const p = queue[i]; const jam = Math.pow(p.q, 2); const x = p.x + Math.sin(t * 1.5 + i) * 3 * (1 - jam), y = p.y + Math.cos(t * 1.2 + i * .7) * 2; ideaCard(ctx, x, y - 18, .5, { hex: i % 9 === 0 ? P.amber : C.cyan, rot: Math.sin(i) * .3, glowA: .05 }); }
  // the tiny door
  woodDoor(ctx, FIELD.door.x, FIELD.door.y, 44, 88, t, { light: .9, planks: 3 });
  // the TV in the grass near the queue
  const tv = FIELD.tv; tvSet(ctx, tv.x, tv.y, .22, t, null);
  grass(ctx, t, -400, 2400, (x) => 800 + Math.sin(x * .01) * 6, { n: 260, col: '#1b2058', h: 22 });
  grass(ctx, t, 1250, 1700, () => 1095, { n: 90, col: '#1b2058', h: 30, seed: 12 });
  ctx.restore();
};
// old CRT TV: body centred at x, bottom at y, scale s. screen rect returned; fill(screen) draws the content
function tvSet(ctx, x, y, s, t, fill) {
  const w = 1000 * s, h = 720 * s, x0 = x - w / 2, y0 = y - h - 60 * s;
  ctx.fillStyle = '#2a1e18'; ctx.fillRect(x - w * .35, y - 60 * s, 30 * s, 60 * s); ctx.fillRect(x + w * .35 - 30 * s, y - 60 * s, 30 * s, 60 * s);
  const g = ctx.createLinearGradient(x0, y0, x0, y0 + h); g.addColorStop(0, '#6b4630'); g.addColorStop(1, '#3a2618'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x0, y0, w, h, 40 * s); ctx.fill();
  const scr = { x: x0 + 60 * s, y: y0 + 60 * s, w: w * .74, h: h - 120 * s };
  ctx.fillStyle = '#1a1210'; ctx.beginPath(); ctx.roundRect(scr.x - 14 * s, scr.y - 14 * s, scr.w + 28 * s, scr.h + 28 * s, 30 * s); ctx.fill();
  if (fill) fill(scr); else { ctx.fillStyle = '#1c2b5a'; ctx.beginPath(); ctx.roundRect(scr.x, scr.y, scr.w, scr.h, 24 * s); ctx.fill(); addGlow(ctx, scr.x + scr.w / 2, scr.y + scr.h / 2, scr.w * .7, .35, C.cyan, C.cyanWhite); }
  // knobs
  for (const k of [0, 1]) { ctx.fillStyle = '#c9a77a'; ctx.beginPath(); ctx.arc(x0 + w * .88, y0 + h * (.3 + k * .25), 26 * s, 0, 7); ctx.fill(); }
  ctx.fillStyle = 'rgba(0,0,0,.35)'; for (let i = 0; i < 5; i++) ctx.fillRect(x0 + w * .83, y0 + h * .68 + i * 14 * s, w * .1, 5 * s);
  // antenna
  ctx.strokeStyle = '#9aa0c8'; ctx.lineWidth = 6 * s; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x - 220 * s, y0 - 300 * s); ctx.moveTo(x, y0); ctx.lineTo(x + 180 * s, y0 - 320 * s); ctx.stroke();
  return scr;
}
// camera keys: 62 starts tight on the queue spot where the ticket lands, pulls back wide; 63 tracks along the queue to the TV
const TS = .22, tvScreenCentre = { x: FIELD.tv.x - 1000 * TS / 2 + 60 * TS + 1000 * TS * .74 / 2, y: FIELD.tv.y - 720 * TS - 60 * TS + 60 * TS + (720 * TS - 120 * TS) / 2 };
const fieldCam = (T) => {
  const t0 = T.S('06b', 'The geniuses'), tDoor = T.S('06b', 'The door is'), tA = T.S('06b', 'Amodei'), tK = T.clip('K2').start;
  const qs = queue[120];
  return (t) => {
    if (t < tA - .3) { const u = eio(lin(t0 - .4, tDoor + .2, t)); return { x: mix(qs.x, 980, u), y: mix(qs.y, 560, u), z: mix(3.2, .95, u) }; }
    const u = eio(lin(tA - .3, tK - .45, t)); return { x: mix(980, tvScreenCentre.x, u), y: mix(560, tvScreenCentre.y, u), z: mix(.95, 4.2, u) };
  };
};
const field = (T) => {
  const cam = fieldCam(T), tDoor = T.S('06b', 'The door is');
  return (ctx, t, s) => {
    fieldWorld(ctx, t, cam(t));
    // the door gets a soft ring of attention on "The door is."
    const c = cam(t), dx = 960 + (FIELD.door.x - c.x) * c.z, dy = 540 + (FIELD.door.y - 44 - c.y) * c.z, p = Math.exp(-Math.pow((t - tDoor - .4) / .5, 2));
    if (p > .02) { ctx.strokeStyle = rgba(P.amber, .7 * p); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(dx, dy, 70 + 40 * (1 - p), 0, 7); ctx.stroke(); }
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- C5 (K2): the TV in the grass, the clip on it; behind it the endless queue to the horizon ----------
const tvClip = (T) => {
  const c = T.clip('K2');
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t));
    skyGrad(ctx, { t, stars: .7, bottom: '#3a4f96' });
    addGlow(ctx, 1500, 380, 300, .25, P.amber, '#fff3dd');
    // queue to the horizon (perspective)
    hill(ctx, [[-10, 600], [600, 590], [1300, 600], [1930, 592]], { col: '#151a4a' });
    for (let i = 119; i >= 0; i--) { const q = Math.pow(i / 120, .6), x = mix(1900, 1330, q) + Math.sin(q * 9 + 1) * 90 * (1 - q), y = mix(1080, 604, Math.pow(q, .7)), sc = mix(1.5, .12, Math.pow(q, .5)); ideaCard(ctx, x + Math.sin(t * 1.5 + i) * 3 * sc, y, sc, { hex: i % 7 === 0 ? P.amber : C.cyan, rot: Math.sin(i) * .3, glowA: .12 }); }
    fogBand(ctx, t, 610, 120, { a: .3, hex: '#8ab8e8' });
    // the TV, big, slight push
    const z = mix(1, 1.05, u); ctx.save(); ctx.translate(760, 560); ctx.scale(z, z); ctx.translate(-760, -560);
    tvSet(ctx, 760, 1040, .95, t, (scr) => { clipScreen(ctx, t, T, 'K2', scr.x, scr.y, scr.w, scr.h, { radius: 24, bezel: false }); clipQuote(ctx, t, T, 'K2', scr.x + 40, scr.y + scr.h - 40, scr.w - 80, 28); });
    grass(ctx, t, 150, 1450, () => 1045, { n: 160, col: '#1b2058', h: 60, seed: 9 });
    ctx.restore();
    clipLabel(ctx, t, T, 'K2', 110, 900);
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- 64: close on the keyhole of the door; light pours through, dust in the beam ----------
const KEY = { x: 960, y: 500 };
const keyhole = (T) => {
  const t0 = T.S('06c', 'Heres');
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t)), z = mix(1, 1.25, u);
    ctx.save(); ctx.translate(KEY.x, KEY.y); ctx.scale(z, z); ctx.translate(-KEY.x, -KEY.y);
    // planks filling the frame
    for (let i = 0; i < 5; i++) { const x0 = -200 + i * 480, g = ctx.createLinearGradient(x0, 0, x0 + 480, 0); g.addColorStop(0, '#4a2f1f'); g.addColorStop(.5, '#6b4630'); g.addColorStop(1, '#3a2418'); ctx.fillStyle = g; ctx.fillRect(x0, -200, 476, H + 400); ctx.strokeStyle = 'rgba(30,16,8,.35)'; ctx.lineWidth = 3; for (let k = 0; k < 7; k++) { const gx = x0 + 40 + k * 64; ctx.beginPath(); ctx.moveTo(gx, -200); ctx.bezierCurveTo(gx + 14, 300, gx - 14, 700, gx + 8, H + 200); ctx.stroke(); } }
    // escutcheon plate
    ctx.fillStyle = '#7a6440'; ctx.beginPath(); ctx.roundRect(KEY.x - 70, KEY.y - 120, 140, 290, 30); ctx.fill(); ctx.fillStyle = 'rgba(255,240,200,.15)'; ctx.fillRect(KEY.x - 60, KEY.y - 110, 20, 270);
    // the keyhole, warm light behind it
    ctx.fillStyle = '#fff1d0'; ctx.beginPath(); ctx.arc(KEY.x, KEY.y, 32, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(KEY.x - 18, KEY.y + 10); ctx.lineTo(KEY.x - 30, KEY.y + 110); ctx.lineTo(KEY.x + 30, KEY.y + 110); ctx.lineTo(KEY.x + 18, KEY.y + 10); ctx.fill();
    addGlow(ctx, KEY.x, KEY.y + 30, 260, .9, P.amber, '#fff3dd');
    ctx.restore();
    // the beam toward the camera, with dust
    ctx.save(); ctx.globalCompositeOperation = 'screen';
    const bg = ctx.createRadialGradient(KEY.x, KEY.y + 30, 10, KEY.x, KEY.y + 30, 900); bg.addColorStop(0, 'rgba(255,214,160,.35)'); bg.addColorStop(1, 'rgba(255,214,160,0)'); ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(KEY.x - 20, KEY.y); ctx.lineTo(-200, H + 200); ctx.lineTo(W + 200, H + 200); ctx.lineTo(KEY.x + 20, KEY.y); ctx.fill();
    const r = prng(64); for (let i = 0; i < 140; i++) { const ang = mix(-1.1, 1.1, r()), d = ((r() * 900 + t * (20 + r() * 40)) % 900), x = KEY.x + Math.sin(ang) * d * .9 + Math.sin(t + i) * 10, y = KEY.y + 30 + Math.cos(ang) * d * .7; ctx.fillStyle = rgba('#fff3dd', (.2 + .5 * r()) * (d / 900)); ctx.fillRect(x, y, 2 + r() * 2, 2 + r() * 2); }
    ctx.restore();
    finish(ctx, t, { vig: .6 });
  };
};

// ---------- 65: through the keyhole: a cell divides at its own calm pace; a hand tries to push and bounces off a glass wall ----------
const cellShot = (T) => {
  const t0 = T.S('06c', 'You cant'), tFast = T.S('06c', 'faster');
  return (ctx, t, s) => {
    const bg = ctx.createRadialGradient(960, 540, 0, 960, 540, 900); bg.addColorStop(0, '#3a2a40'); bg.addColorStop(.6, '#1d1638'); bg.addColorStop(1, '#0a0a20'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    // floating particles
    const r = prng(65); for (let i = 0; i < 60; i++) { const x = (r() * W + t * 8) % W, y = (r() * H + Math.sin(t * .5 + i) * 20); addGlow(ctx, x, y, 6 + r() * 10, .15, P.amber, '#fff3dd'); }
    // the cell: elongates, pinches, two daughters drift apart (slow, its own tempo)
    const d = sine(clamp((t - (t0 - .8)) / 4.2));
    const cx = 900, cy = 540, R = 170, sep = d * 150, pinch = clamp(d * 1.5);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const sgn of [-1, 1]) { const x = cx + sgn * sep * .5; const g = ctx.createRadialGradient(x, cy, 10, x, cy, R * mix(1, .8, pinch)); g.addColorStop(0, 'rgba(255,200,150,.35)'); g.addColorStop(.85, 'rgba(255,170,110,.25)'); g.addColorStop(1, 'rgba(255,170,110,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, cy, R * mix(1, .8, pinch) * (1 + .03 * Math.sin(t * 1.4)), R * mix(1, .85, pinch), 0, 0, 7); ctx.fill(); }
    ctx.restore();
    ctx.strokeStyle = rgba('#ffd9b0', .8); ctx.lineWidth = 4;
    for (const sgn of [-1, 1]) { const x = cx + sgn * sep * .5; ctx.beginPath(); ctx.ellipse(x, cy, R * mix(1, .8, pinch) * (1 + .03 * Math.sin(t * 1.4)), R * mix(1, .85, pinch), 0, 0, 7); ctx.stroke();
      // nucleus / chromosomes splitting
      ctx.fillStyle = rgba('#ff9f7a', .8); for (let k = 0; k < 5; k++) { const ky = cy - 50 + k * 25; ctx.save(); ctx.translate(x + sgn * mix(0, 30, d) - sgn * sep * .5 * (1 - pinch), ky); ctx.rotate(.4 * Math.sin(k + t * .3)); ctx.fillRect(-14, -4, 28, 8); ctx.restore(); } }
    // glass wall at x 1240: faint reflections
    const gx = 1240;
    ctx.fillStyle = 'rgba(180,220,255,.06)'; ctx.fillRect(gx, 0, 22, H); ctx.strokeStyle = 'rgba(200,235,255,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
    ctx.fillStyle = 'rgba(200,235,255,.08)'; ctx.beginPath(); ctx.moveTo(gx + 4, 0); ctx.lineTo(gx + 18, 0); ctx.lineTo(gx + 18, H * .4); ctx.lineTo(gx + 4, H * .5); ctx.fill();
    // the hand reaches in from the right, pushes, hits the glass and bounces back
    const reach = t0 + .6, hit = tFast - .1;
    const hp = t < hit ? eio(lin(reach, hit, t)) : 1 - .35 * eout(lin(hit, hit + .5, t)) + .1 * Math.sin((t - hit) * 18) * Math.exp(-(t - hit) * 5);
    const hx = mix(W + 600, gx + 200, hp);
    workHand(ctx, hx, 560, 2.2, Math.PI, {});
    const ring = Math.exp(-Math.pow((t - hit - .1) / .25, 2)); if (ring > .02) { ctx.strokeStyle = rgba(C.cyanWhite, .7 * ring); ctx.lineWidth = 3; for (let k = 1; k <= 3; k++) { ctx.beginPath(); ctx.ellipse(gx + 10, 560, 14 * k * (1.5 - ring), 70 * k * (1.5 - ring), 0, 0, 7); ctx.stroke(); } }
    // keyhole-shaped vignette at the start (we're looking through it), opening up
    const kv = 1 - eio(lin(s.a, s.a + 1.4, t));
    if (kv > 0) { ctx.save(); ctx.fillStyle = rgba('#2a1a14', kv); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.arc(960, 540, mix(1400, 300, kv), 0, 7, true); ctx.fill('evenodd'); ctx.restore(); }
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- 66 + 67: the door taken apart into an exploded diagram (rules, labs, money, priorities); hands rebuild it wider: a gate, light floods ----------
const doorParts = (T) => {
  const t0 = T.S('06c', 'But almost'), tPeople = T.S('06c', 'built by'), tR = T.S('06c', 'Rules'), tL = T.S('06c', 'labs'), tM = T.S('06c', 'money'), tP = T.S('06c', 'priorities'), tCh = T.S('06c', 'And what people'), tChange = T.S('06c', 'change');
  const LABELS = [['RULES', tR], ['LABS', tL], ['MONEY', tM], ['PRIORITIES', tP]];
  return (ctx, t, s) => {
    const ex = eio(lin(tPeople - .5, tPeople + .9, t)), wide = eio(lin(tCh, tChange + .5, t)), flood = sm(lin(tCh + .9, tChange + .8, t));
    skyGrad(ctx, { t, stars: .5, bottom: mixHex('#2a3780', '#7a5a6e', flood) });
    hill(ctx, [[-10, 860], [700, 850], [1300, 856], [1930, 848]], { col: '#151a4a' });
    // light behind the doorway
    const gw = mix(240, 980, wide), gh = mix(520, 640, wide), cx = 960, by = 880;
    addGlow(ctx, cx, by - gh / 2, mix(500, 1100, flood), mix(.35, .9, flood), P.amber, '#fff3dd');
    ctx.fillStyle = rgba('#ffe2b0', .7 + .3 * flood); ctx.fillRect(cx - gw / 2, by - gh, gw, gh);
    if (flood > 0) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const fl = ctx.createLinearGradient(0, by - gh, 0, H); fl.addColorStop(0, rgba('#ffd29a', .0)); fl.addColorStop(1, rgba('#ffd29a', .45 * flood)); ctx.fillStyle = fl; ctx.beginPath(); ctx.moveTo(cx - gw / 2, by); ctx.lineTo(cx + gw / 2, by); ctx.lineTo(cx + gw * 1.6, H); ctx.lineTo(cx - gw * 1.6, H); ctx.fill(); ctx.restore(); }
    // frame
    ctx.fillStyle = '#2a1a14'; ctx.fillRect(cx - gw / 2 - 30, by - gh - 30, 30, gh + 30); ctx.fillRect(cx + gw / 2, by - gh - 30, 30, gh + 30); ctx.fillRect(cx - gw / 2 - 30, by - gh - 30, gw + 60, 30);
    // planks: 4 when narrow, then 7 (new ones slide in) as the gate gets wider; they explode outward in between
    const N = 4, extra = 3, all = N + extra;
    for (let i = 0; i < all; i++) {
      const isNew = i >= N; const born = isNew ? eio(lin(tCh + .2 + (i - N) * .25, tCh + 1 + (i - N) * .25, t)) : 1; if (born <= 0) continue;
      // narrow layout (only first 4), wide layout (all 7, ordered)
      const order = [0, 4, 1, 5, 2, 6, 3].indexOf(i);
      const pwN = 240 / N, pwW = gw / all * .98;
      const xN = cx - 120 + (i + .5) * pwN, xW = cx - gw / 2 + (order + .5) * (gw / all);
      // exploded offsets (only the 4 originals): fan out with gaps and a tilt
      const eox = [-420, -150, 150, 420][i] ?? 0, eoy = [-60, 40, -40, 60][i] ?? 0, rot = [-.18, -.06, .06, .18][i] ?? 0;
      const e = isNew ? 0 : ex * (1 - wide);
      const x = mix(isNew ? xW + (i % 2 ? 900 : -900) * (1 - born) : mix(xN, xW, wide), (isNew ? xW : xN) + eox, e), y = by - gh / 2 + eoy * e, w = mix(pwN, pwW, wide), h = gh * mix(1, .92, e);
      // swinging half shut at the very end is handled in s07; here gate open = planks form the two swung wings
      const open = sm(lin(tChange - .2, tChange + .9, t));
      const side = order < all / 2 ? -1 : 1, wingX = cx + side * (gw / 2 - 30 - (side < 0 ? order : all - 1 - order) * 18);
      ctx.save(); ctx.translate(mix(x, wingX, open), y); ctx.rotate(rot * e);
      ctx.scale(1 - open * .82, 1);
      const g = ctx.createLinearGradient(-w / 2, 0, w / 2, 0); g.addColorStop(0, '#5a3a26'); g.addColorStop(.5, '#6b4630'); g.addColorStop(1, '#4a2f1f');
      ctx.fillStyle = g; ctx.fillRect(-w / 2 + 2, -h / 2, w - 4, h);
      ctx.strokeStyle = 'rgba(30,16,8,.35)'; ctx.lineWidth = 2; for (let k = 0; k < 3; k++) { const gx = -w / 2 + w * (.25 + k * .25); ctx.beginPath(); ctx.moveTo(gx, -h / 2); ctx.bezierCurveTo(gx + 4, -h * .2, gx - 4, h * .2, gx, h / 2); ctx.stroke(); }
      ctx.restore();
      // label tags on the four exploded planks
      if (!isNew && i < LABELS.length) { const [lb, tl] = LABELS[i], la = eout(lin(tl - .1, tl + .35, t)) * (1 - sm(lin(tCh, tCh + .6, t))); if (la > 0) { const lx = x + Math.sin(rot) * 0, ly = y - h / 2 - 50; ctx.fillStyle = rgba(P.amber, la); ctx.beginPath(); ctx.roundRect(lx - 92, ly - 26, 184, 46, 8); ctx.fill(); text(ctx, lb, lx, ly + 7, { size: 22, weight: 600, color: '#1b1530', align: 'center', spacing: 4, alpha: la }); ctx.strokeStyle = rgba(P.amber, .6 * la); ctx.setLineDash([6, 6]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx, ly + 20); ctx.lineTo(lx, y - h / 2 + 10); ctx.stroke(); ctx.setLineDash([]); } }
    }
    // dotted guide lines of the diagram
    if (ex * (1 - wide) > .1) { ctx.strokeStyle = rgba(C.cyan, .35 * ex * (1 - wide)); ctx.setLineDash([8, 10]); ctx.lineWidth = 2; for (const dy of [-gh / 2, gh / 2]) { ctx.beginPath(); ctx.moveTo(cx - 620, by - gh / 2 + dy); ctx.lineTo(cx + 620, by - gh / 2 + dy); ctx.stroke(); } ctx.setLineDash([]); }
    // hands with tools working (appear with "built by people"), push the planks back together wider
    const ha = sm(lin(tPeople - .2, tPeople + .6, t)) * (1 - sm(lin(tChange + .3, tChange + 1.2, t)));
    if (ha > 0) {
      ctx.globalAlpha = ha;
      const k1 = Math.sin(t * 6) * 14, k2 = Math.sin(t * 5 + 1) * 12;
      workHand(ctx, mix(-200, 330, ha) + k1, 420, .9, .25, { tool: 'hammer' });
      workHand(ctx, mix(W + 200, 1590, ha) - k2, 520, .9, Math.PI - .2, { tool: 'wrench' });
      workHand(ctx, mix(-200, 260, ha), 820 + k2 * .5, .8, -.15, {});
      workHand(ctx, mix(W + 200, 1660, ha), 760 - k1 * .5, .8, Math.PI + .15, {});
      ctx.globalAlpha = 1;
    }
    // people silhouettes in the flood of light, walking through the new gate
    if (flood > .2) for (let i = 0; i < 9; i++) { const q = ((t * .12 + i / 9) % 1), x = cx + mix(-gw * .4, gw * .4, (i * .37) % 1), y = mix(by, by + 160, q), h = mix(120, 200, q); ctx.globalAlpha = sm(flood) * sm(clamp(q * 4)) * (1 - q); person(ctx, x, y, h, t, { phase: t * 4 + i, coat: i === 4 ? P.amber : '#2a3270' }); ctx.globalAlpha = 1; }
    finish(ctx, t, { vig: .55, warm: flood * .3 });
  };
};

export default function (T) {
  const A = (p, n) => T.S('06a', p, n), B = (p, n) => T.S('06b', p, n), Cc = (p, n) => T.S('06c', p, n);
  const tKettle = A('A new medicine') - .2, p54 = pillOnSnail(tKettle);
  const k7 = T.clip('K7'), k2 = T.clip('K2');
  return [
    { t: A('Thinking') - .25, draw: swarm(T), tr: 'zoom', d: 1.0, x: W / 2, y: H / 2, depth: 5 },
    { t: tKettle, draw: kettle(T), tr: 'zoom', d: .8, x: p54.x, y: p54.y - 30, depth: 4 },
    { t: A('Then tested') - .2, draw: tubes(T), tr: 'down', d: .8 },
    { t: A('Then on animals') - .2, draw: cage(T), tr: 'match', d: .6, x: TUBE.x, y: 560 },
    { t: A('Then on people') - .25, draw: phases(T), tr: 'zoom', d: .9, x: CAGE_DOOR.x, y: CAGE_DOOR.y, depth: 4 },
    { t: k7.start - .55, draw: chute(T), tr: 'zoom', d: 1.0, x: PHASE3.x, y: PHASE3.y, depth: 5 },
    { t: B('Look at') - .25, draw: design(T), tr: 'zoom', d: .9, x: FALLEN.x, y: FALLEN.y, depth: 5 },
    { t: B('One for a') - .3, draw: lungs(T), tr: 'match', d: .5, x: MOL0.x, y: MOL0.y },
    { t: B('More than') - .25, draw: waiting(T), tr: 'iris', d: .9, x: LUNG_SPOT.x, y: LUNG_SPOT.y },
    { t: B('The geniuses') - .4, draw: field(T), tr: 'out', d: 1.0, x: W / 2, y: H / 2, depth: 4 },
    { t: B('Amodei') - .3, draw: field(T), tr: 'match', d: .3 },
    { t: k2.start - .45, draw: tvClip(T), tr: 'zoom', d: .9, x: W / 2, y: H / 2, depth: 3 },
    { t: Cc('Heres') - .35, draw: keyhole(T), tr: 'left', d: 1.0 },
    { t: Cc('You cant') - .3, draw: cellShot(T), tr: 'iris', d: 1.0, x: KEY.x, y: KEY.y, r: 30 },
    { t: Cc('But almost') - .3, draw: doorParts(T), tr: 'out', d: .9, x: W / 2, y: 620, depth: 3 },
  ];
}
