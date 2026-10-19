// 02 · Why believe this? (0:35–1:36): the lab boss on a shop-window TV, chatbot vs. country of geniuses, the essay, the timeline debate.
// Carrier chain: door light → TV in a shop window → lit lab window → phone → chat bubble → envelope → blueprint → screen on the blueprint
//   → glowing words → book page → medal → copies → desk split → calendar → fog (s03 rises out of it).
import { W, H, C, rgba, clamp, lin, mix, sm, eio, eout, ein, sine, back, prng, canvas, addGlow, glow, text } from '../engine.mjs';
import { P, skyGrad, fogBand, cone, lampPost, person, finish, shade, mixHex } from '../lib/world.mjs';
import { clipScreen, clipLabel, clipQuote, source } from '../lib/kit.mjs';

const cache = new Map(); const once = (k, f) => { if (!cache.has(k)) cache.set(k, f()); return cache.get(k); };

// a standing head-and-shoulders silhouette (copies, researchers); x,y = feet
export function figure(ctx, x, y, h, col, { glowCol = null, a = 1, medal = 0 } = {}) {
  if (a <= 0) return;
  const s = h / 100; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col;
  ctx.beginPath(); ctx.ellipse(x, y - 86 * s, 9 * s, 11 * s, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - 19 * s, y); ctx.lineTo(x - 18 * s, y - 52 * s); ctx.quadraticCurveTo(x - 17 * s, y - 72 * s, x, y - 72 * s); ctx.quadraticCurveTo(x + 17 * s, y - 72 * s, x + 18 * s, y - 52 * s); ctx.lineTo(x + 19 * s, y); ctx.fill();
  ctx.restore();
  if (medal > 0) { ctx.fillStyle = rgba('#ffd27a', a * medal); ctx.beginPath(); ctx.arc(x, y - 58 * s, Math.max(1.2, 4 * s), 0, 7); ctx.fill(); if (h > 30) addGlow(ctx, x, y - 58 * s, 14 * s, .6 * a * medal, P.amber, '#fff3dd'); }
  if (glowCol) addGlow(ctx, x, y - 70 * s, 40 * s, .35 * a, glowCol, '#ffffff');
}

// ================= C1: the clip on an old TV in a shop window; people walk past, nobody stops =================
const TV = { x: 960, y: 560, w: 500, h: 370 }; // scene is drawn shifted down by OFF; TV.y is the on-screen centre
const OFF = 90;
const shopTV = (T) => {
  const c = T.clip('K1');
  const walkers = [ // start time, direction, speed, height, coat
    { t0: c.start - 3, d: 1, v: 190, h: 560, coat: '#2a2f6e' }, { t0: c.start + 1.5, d: -1, v: 210, h: 600, coat: '#3a2f5e' },
    { t0: c.start + 4.2, d: 1, v: 170, h: 520, coat: '#24305e' }, { t0: c.start + 7.4, d: -1, v: 230, h: 580, coat: '#2e2a58', phone: true },
    { t0: c.start + 9.8, d: 1, v: 200, h: 570, coat: '#33356e' },
  ];
  return (ctx, t, s) => {
    const tPush = c.end - .7, uPush = ein(lin(tPush, s.b, t));
    // slow push toward the TV, then the camera dives until the screen fills the frame
    const zFull = Math.min(W / TV.w, H / TV.h) * 1.04, z = mix(1, 1.1, sine(lin(s.a, tPush, t))) * Math.pow(zFull / 1.1, uPush);
    const fx = mix(W / 2, TV.x, uPush), fy = mix(H / 2 + 20, TV.y, uPush);
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-fx, -fy); ctx.translate(0, OFF);
    const TVy = TV.y - OFF;
    // night street: façade, shop window with warm interior, sign, wet pavement
    ctx.fillStyle = '#0c0f30'; ctx.fillRect(-400, -400, W + 800, H + 800);
    const fa = ctx.createLinearGradient(0, 0, 0, 860); fa.addColorStop(0, '#141a4a'); fa.addColorStop(1, '#1b2058'); ctx.fillStyle = fa; ctx.fillRect(-400, -200, W + 800, 1060);
    // upper-floor windows
    for (const wx of [180, 520, 1320, 1660]) { ctx.fillStyle = '#0d1036'; ctx.fillRect(wx, 40, 120, 150); }
    ctx.fillStyle = rgba(P.amber, .85); ctx.fillRect(1336, 56, 88, 118); addGlow(ctx, 1380, 115, 90, .25, P.amber, '#fff3dd');
    // shop window frame
    ctx.fillStyle = '#0a0c28'; ctx.fillRect(330, 220, 1260, 640);
    const inside = ctx.createRadialGradient(TV.x, TVy, 40, TV.x, TVy, 800); inside.addColorStop(0, '#3a2c48'); inside.addColorStop(1, '#16142e'); ctx.fillStyle = inside; ctx.fillRect(350, 240, 1220, 600);
    // shelves with other old sets (dark) and the one that is on
    ctx.fillStyle = '#100f26'; ctx.fillRect(350, 700, 1220, 22); ctx.fillRect(350, 660, 1220, 6);
    for (const [ox, w, h] of [[440, 230, 190], [1360, 190, 160]]) { ctx.fillStyle = '#1d1a33'; ctx.beginPath(); ctx.roundRect(ox - w / 2, 700 - h, w, h, 14); ctx.fill(); ctx.fillStyle = '#0c0b1c'; ctx.beginPath(); ctx.roundRect(ox - w / 2 + 18, 700 - h + 18, w - 70, h - 36, 18); ctx.fill(); ctx.fillStyle = 'rgba(143,230,255,.06)'; ctx.fillRect(ox - w / 2 + 22, 700 - h + 22, w - 78, 20); }
    // the TV cabinet
    ctx.fillStyle = '#2a2236'; ctx.beginPath(); ctx.roundRect(TV.x - TV.w / 2 - 50, TVy - TV.h / 2 - 40, TV.w + 160, TV.h + 80, 26); ctx.fill();
    ctx.fillStyle = '#1a1526'; for (let i = 0; i < 6; i++) ctx.fillRect(TV.x + TV.w / 2 + 24, TVy - 120 + i * 22, 70, 8);
    ctx.fillStyle = '#3a3044'; ctx.beginPath(); ctx.arc(TV.x + TV.w / 2 + 58, TVy + 70, 16, 0, 7); ctx.arc(TV.x + TV.w / 2 + 58, TVy + 120, 16, 0, 7); ctx.fill();
    ctx.strokeStyle = '#2a2236'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(TV.x - 40, TVy - TV.h / 2 - 40); ctx.lineTo(TV.x - 140, TVy - TV.h / 2 - 150); ctx.moveTo(TV.x + 40, TVy - TV.h / 2 - 40); ctx.lineTo(TV.x + 150, TVy - TV.h / 2 - 160); ctx.stroke();
    clipScreen(ctx, t, T, 'K1', TV.x - TV.w / 2, TVy - TV.h / 2, TV.w, TV.h, { radius: 28 });
    clipQuote(ctx, t, T, 'K1', TV.x - TV.w / 2 + 30, TVy + TV.h / 2 - 30, TV.w - 60, 24);
    // the screen light spills into the shop and onto the street
    addGlow(ctx, TV.x, TVy, 700, .13, '#5f8fc4', '#d8f7ff');
    // glass reflections, a diagonal sheen that drifts
    ctx.save(); ctx.beginPath(); ctx.rect(350, 240, 1220, 600); ctx.clip();
    const sx = 300 + ((t * 40) % 1600); const gl = ctx.createLinearGradient(sx, 0, sx + 260, 0); gl.addColorStop(0, 'rgba(216,247,255,0)'); gl.addColorStop(.5, 'rgba(216,247,255,.06)'); gl.addColorStop(1, 'rgba(216,247,255,0)');
    ctx.fillStyle = gl; ctx.translate(0, 0); ctx.transform(1, 0, -.4, 1, 0, 0); ctx.fillRect(sx - 200, 200, 300, 700); ctx.restore();
    // sign above the window
    ctx.fillStyle = '#0a0c28'; ctx.fillRect(560, 150, 800, 60); text(ctx, 'RADIO · TV · REPAIRS', 960, 192, { size: 30, weight: 600, align: 'center', color: '#e8d9b8', alpha: .55, spacing: 10 });
    // pavement: wet, with reflected window glow
    ctx.fillStyle = '#0a0c26'; ctx.fillRect(-400, 860, W + 800, 600);
    const rf = ctx.createLinearGradient(0, 860, 0, 1080); rf.addColorStop(0, rgba('#8fb8e8', .18)); rf.addColorStop(1, rgba('#8fb8e8', 0)); ctx.fillStyle = rf; ctx.fillRect(330, 860, 1260, 240);
    ctx.fillStyle = 'rgba(143,230,255,.10)'; ctx.fillRect(TV.x - 200, 900 + Math.sin(t * 2) * 3, 400, 6); ctx.fillRect(TV.x - 120, 940, 240, 4);
    lampPost(ctx, 120, 1000, 640, t, { on: 1 }); lampPost(ctx, 1820, 1000, 640, t, { on: 1 });
    // passers-by, nobody stops
    for (const p of walkers) {
      const x = p.d > 0 ? -200 + (t - p.t0) * p.v : W + 200 - (t - p.t0) * p.v; if (x < -260 || x > W + 260) continue;
      person(ctx, x, 1060, p.h, t, { phase: (t - p.t0) * p.v / 30, coat: p.coat, flip: p.d < 0, phone: !!p.phone, hood: false, skin: '#8a6a58' });
    }
    // light drizzle
    const r = prng(12); ctx.strokeStyle = 'rgba(200,225,255,.18)'; ctx.lineWidth = 1.2;
    for (let i = 0; i < 160; i++) { const x0 = r() * (W + 400) - 200, sp = 900 + r() * 400, y0 = ((r() * H + t * sp) % (H + 100)) - 50; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 - 6, y0 + 22); ctx.stroke(); }
    ctx.restore();
    if (uPush < .2) clipLabel(ctx, t, T, 'K1', 110, 870);
    finish(ctx, t, { vig: .55 * (1 - uPush) });
  };
};

// ================= 13: skyline of lab buildings; one rises, a name plate flips open =================
const LAB = { x: 980, wy: 470 }; // the lit window on the central tower that receives the TV image
const skyline = (T) => {
  const t0 = T.S('02a', "That's the head"), tBig = T.S('02a', 'biggest'), tEnd = T.S('02a', 'Most of us');
  const towers = (() => { const r = prng(41), a = []; for (let i = 0; i < 14; i++) { const x = -60 + i * 150 + r() * 40, w = 90 + r() * 80, h = 220 + r() * 260; if (Math.abs(x + w / 2 - LAB.x) < 160) continue; a.push({ x, w, h, z: r() < .5 ? 1 : 2, ph: r() * 6, lit: r() }); } return a; })();
  return (ctx, t, s) => {
    const uRise = eio(lin(tBig - .4, tBig + .9, t)), uZoom = ein(lin(tEnd - 1.0, s.b, t));
    skyGrad(ctx, { t, stars: .6, bottom: '#3c4f9a' });
    addGlow(ctx, 1500, 200, 140, .3, '#d8f7ff', '#ffffff');
    const ground = 900;
    ctx.save();
    const z = mix(1, 1.06, sine(lin(s.a, s.b, t)));
    ctx.translate(LAB.x, LAB.wy); ctx.scale(z, z); ctx.translate(-LAB.x, -LAB.wy);
    fogBand(ctx, t, 760, 220, { a: .25, hex: '#8ab8e8', seed: 7 });
    // back + front rows of glass towers with grids of windows
    for (const zz of [2, 1]) for (const b of towers.filter((q) => q.z === zz)) {
      const col = zz === 2 ? '#202a6a' : '#141a4c', top = ground - b.h * (zz === 2 ? 1.15 : .9);
      ctx.fillStyle = col; ctx.fillRect(b.x, top, b.w, ground - top);
      ctx.fillStyle = rgba('#8fe6ff', .05); ctx.fillRect(b.x, top, 6, ground - top);
      for (let wy = top + 20; wy < ground - 20; wy += 26) for (let wx = b.x + 10; wx < b.x + b.w - 14; wx += 20) {
        const k = Math.sin(wx * 12.9 + wy * 7.1 + b.ph); if (k < .55 - b.lit * .3) continue;
        ctx.fillStyle = rgba(k > .93 ? P.amber : C.cyan, zz === 2 ? .35 : .55); ctx.fillRect(wx, wy, 10, 12);
      }
    }
    // the central lab: rises above the others
    const bw = 300, bh = mix(500, 720, uRise), top = ground - bh;
    const g = ctx.createLinearGradient(LAB.x - bw / 2, 0, LAB.x + bw / 2, 0); g.addColorStop(0, '#1c2668'); g.addColorStop(1, '#10164a'); ctx.fillStyle = g; ctx.fillRect(LAB.x - bw / 2, top, bw, bh);
    ctx.fillStyle = '#0a0e34'; ctx.fillRect(LAB.x - bw / 2 - 12, top - 14, bw + 24, 16);
    for (let wy = top + 30; wy < ground - 30; wy += 34) for (let wx = LAB.x - bw / 2 + 22; wx < LAB.x + bw / 2 - 30; wx += 34) { const k = Math.sin(wx * 3.1 + wy * 5.7); ctx.fillStyle = rgba(k > .2 ? '#bfefff' : P.amber, .3 + .25 * Math.max(0, k)); ctx.fillRect(wx, wy, 18, 20); }
    // the one big window, warm, where the TV image landed (stays put while the building rises around it)
    ctx.fillStyle = '#fff1d6'; ctx.fillRect(LAB.x - 46, LAB.wy - 34, 92, 68); addGlow(ctx, LAB.x, LAB.wy, 160, .55, P.amber, '#fff3dd');
    // beacon on the roof
    addGlow(ctx, LAB.x, top - 24, 26, .9 * (Math.sin(t * 3) > 0 ? 1 : .3), '#ff5a4a', '#ffd0c8');
    // street + reflections
    ctx.fillStyle = '#0a0c26'; ctx.fillRect(-100, ground, W + 200, 400);
    const rf = ctx.createLinearGradient(0, ground, 0, H); rf.addColorStop(0, rgba('#8fe6ff', .12)); rf.addColorStop(1, rgba('#8fe6ff', 0)); ctx.fillStyle = rf; ctx.fillRect(LAB.x - 160, ground, 320, 200);
    ctx.restore();
    // name plate: flips open like a hotel key card
    const uPlate = back(clamp((t - (t0 + .3)) / .7)) * (1 - sm(lin(tEnd - .6, tEnd, t)));
    if (uPlate > 0) {
      const px = 1260, py = 330; ctx.save(); ctx.translate(px, py); ctx.scale(1, Math.max(.02, uPlate));
      ctx.fillStyle = 'rgba(7,9,24,.82)'; ctx.beginPath(); ctx.roundRect(0, -60, 520, 120, 6); ctx.fill(); ctx.fillStyle = C.amber; ctx.fillRect(0, -60, 6, 120);
      text(ctx, 'Dario Amodei', 34, -4, { size: 48, font: 'Instrument Serif' }); text(ctx, 'CEO · ANTHROPIC', 36, 36, { size: 18, weight: 600, color: C.muted, spacing: 5 });
      ctx.restore();
      ctx.strokeStyle = rgba(C.amber, .5 * clamp(uPlate)); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(LAB.x + 60, LAB.wy - 60); ctx.lineTo(1260, 330); ctx.stroke();
    }
    finish(ctx, t, { vig: .55 });
  };
};

// ================= 14 / 15: the phone. A better chatbot; something that writes your emails =================
const PH = { x: 960, y: 560, w: 420, h: 820 };
function phoneBody(ctx, t, inner) {
  const { x, y, w, h } = PH;
  ctx.save(); ctx.translate(x, y); ctx.rotate(-.04 + Math.sin(t * .7) * .01); ctx.translate(-x, -y);
  // hand
  ctx.fillStyle = '#b07a5c'; ctx.beginPath(); ctx.ellipse(x - w / 2 + 10, y + h * .18, 60, 170, .25, 0, 7); ctx.fill();
  ctx.fillStyle = '#9c6a4e'; ctx.beginPath(); ctx.ellipse(x + 30, y + h / 2 + 40, 260, 120, -.1, 0, 7); ctx.fill();
  ctx.fillStyle = '#05060f'; ctx.beginPath(); ctx.roundRect(x - w / 2 - 14, y - h / 2 - 14, w + 28, h + 28, 56); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 44); ctx.clip();
  const sg = ctx.createLinearGradient(0, y - h / 2, 0, y + h / 2); sg.addColorStop(0, '#141a44'); sg.addColorStop(1, '#0b0f2e'); ctx.fillStyle = sg; ctx.fillRect(x - w / 2, y - h / 2, w, h);
  inner(ctx);
  ctx.restore();
  ctx.fillStyle = '#05060f'; ctx.beginPath(); ctx.roundRect(x - 60, y - h / 2 + 14, 120, 30, 15); ctx.fill();
  // thumb over the edge
  ctx.fillStyle = '#b98466'; ctx.beginPath(); ctx.ellipse(x + w / 2 + 6, y + 120, 44, 90, -.5, 0, 7); ctx.fill();
  ctx.restore();
  addGlow(ctx, x, y, 700, .16, C.cyan, C.cyanWhite);
}
function bubble(ctx, x, y, w, h, mine, a, lines = 2) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(a); ctx.fillStyle = mine ? '#2c66c9' : '#262c5e'; ctx.beginPath(); ctx.roundRect(x, y, w, h, 22); ctx.fill();
  ctx.fillStyle = mine ? 'rgba(255,255,255,.55)' : 'rgba(243,239,226,.45)'; for (let i = 0; i < lines; i++) ctx.fillRect(x + 22, y + 22 + i * 24, (w - 44) * (i === lines - 1 ? .6 : 1), 9);
  ctx.restore();
}
function roomBokeh(ctx, t, seed = 51) {
  const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * .75); bg.addColorStop(0, '#1d1f55'); bg.addColorStop(1, '#080a20'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const r = prng(seed); for (let i = 0; i < 34; i++) addGlow(ctx, (r() * W + Math.sin(t * .2 + i) * 20), r() * H, 30 + r() * 70, .1, r() < .4 ? P.amber : C.cyan, '#ffffff');
}
const chat = (T) => {
  const t0 = T.S('02a', 'Most of us'), tBetter = T.S('02a', 'better chatbot');
  return (ctx, t, s) => {
    roomBokeh(ctx, t);
    const z = mix(1.06, 1, eout(lin(s.a, s.a + 1.5, t)));
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
    phoneBody(ctx, t, (x) => {
      const L = PH.x - PH.w / 2, Tp = PH.y - PH.h / 2;
      text(x, 'Assistant', PH.x, Tp + 92, { size: 26, weight: 600, align: 'center', alpha: .85 });
      x.fillStyle = 'rgba(143,230,255,.15)'; x.fillRect(L, Tp + 112, PH.w, 2);
      const pop = (t1) => back(clamp((t - t1) / .35));
      bubble(x, L + 150, Tp + 150, 240, 74, true, pop(t0 - .2), 2);
      // typing dots → answer bubble that grows ("better")
      const tAns = tBetter - .1;
      if (t < tAns) { const a = pop(t0 + .5); x.save(); x.globalAlpha = clamp(a); x.fillStyle = '#262c5e'; x.beginPath(); x.roundRect(L + 24, Tp + 250, 110, 56, 26); x.fill(); for (let i = 0; i < 3; i++) { x.fillStyle = rgba(C.cream, .4 + .5 * Math.max(0, Math.sin(t * 8 - i * .8))); x.beginPath(); x.arc(L + 52 + i * 27, Tp + 278 - 4 * Math.max(0, Math.sin(t * 8 - i * .8)), 7, 0, 7); x.fill(); } x.restore(); }
      else { const a = pop(tAns); bubble(x, L + 24, Tp + 250, mix(110, 300, clamp(a)), mix(56, 130, clamp(a)), false, a, 4); }
      bubble(x, L + 190, Tp + 410, 200, 52, true, pop(tBetter + .7), 1);
      // sparkle on "better"
      const sp = Math.exp(-Math.pow((t - tBetter - .3) / .3, 2)); if (sp > .02) addGlow(x, L + 200, Tp + 300, 120, .5 * sp, C.cyan, '#ffffff');
      // input field
      x.fillStyle = '#1b2150'; x.beginPath(); x.roundRect(L + 24, PH.y + PH.h / 2 - 96, PH.w - 48, 56, 28); x.fill();
      x.fillStyle = rgba(C.cream, .5 * (Math.sin(t * 6) > 0 ? 1 : 0)); x.fillRect(L + 52, PH.y + PH.h / 2 - 82, 2.5, 28);
    });
    ctx.restore();
    finish(ctx, t, { vig: .55 });
  };
};
// the envelope: (x,y) centre, w, open flap 0..1
function envelope(ctx, x, y, w, rot = 0, flap = 0, a = 1, paper = 0) {
  if (a <= 0) return;
  const h = w * .64; ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y); ctx.rotate(rot);
  if (paper > 0) { ctx.fillStyle = '#f3efe2'; ctx.fillRect(-w * .42, -h / 2 - paper * h * .7, w * .84, h * .9); }
  ctx.fillStyle = '#e8dcc0'; ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.fillStyle = '#d6c7a6'; ctx.beginPath(); ctx.moveTo(-w / 2, h / 2); ctx.lineTo(0, 0); ctx.lineTo(w / 2, h / 2); ctx.fill();
  ctx.fillStyle = '#cdbd9a'; ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(0, -h / 2 + mix(h * .55, -h * .55, flap)); ctx.lineTo(w / 2, -h / 2); ctx.fill();
  ctx.restore();
}
const emails = (T) => {
  const t0 = T.S('02a', 'Something that'), tWr = T.S('02a', 'writes'), tPeople = T.S('02a', 'The people');
  return (ctx, t, s) => {
    roomBokeh(ctx, t);
    const L = PH.x - PH.w / 2, Tp = PH.y - PH.h / 2;
    const uFold = eio(lin(t0, t0 + .7, t));
    phoneBody(ctx, t, (x) => {
      text(x, 'Assistant', PH.x, Tp + 92, { size: 26, weight: 600, align: 'center', alpha: .85 });
      x.fillStyle = 'rgba(143,230,255,.15)'; x.fillRect(L, Tp + 112, PH.w, 2);
      bubble(x, L + 150, Tp + 150, 240, 74, true, 1, 2);
      // the answer bubble is an email draft; it folds into an envelope
      bubble(x, L + 24, Tp + 250, mix(300, 160, uFold), mix(130, 100, uFold), false, 1 - uFold, 4);
      bubble(x, L + 190, Tp + 410, 200, 52, true, 1, 1);
    });
    // envelopes leave the phone, one after another, and stack in a "Sent" tray at the right
    const tray = { x: 1500, y: 760 };
    ctx.fillStyle = '#1a1f4e'; ctx.beginPath(); ctx.moveTo(tray.x - 170, tray.y); ctx.lineTo(tray.x + 170, tray.y); ctx.lineTo(tray.x + 150, tray.y + 70); ctx.lineTo(tray.x - 150, tray.y + 70); ctx.fill();
    text(ctx, 'SENT', tray.x, tray.y + 48, { size: 20, weight: 600, align: 'center', color: C.muted, spacing: 6 });
    const n = 9, launched = [];
    for (let i = 0; i < n; i++) {
      const ti = tWr - .2 + i * .22, u = eio(clamp((t - ti) / .6)); if (t < ti) continue;
      const sx = L + 110, sy = Tp + 310, ex = tray.x + (i % 2 ? 8 : -8), ey = tray.y - 22 - i * 9;
      const x = mix(sx, ex, u), y = mix(sy, ey, u) - Math.sin(u * Math.PI) * 260;
      envelope(ctx, x, y, mix(120, 220, u), (1 - u) * -.6 + (i % 3 - 1) * .03, 0, 1);
      if (u < 1) addGlow(ctx, x, y, 60, .25, C.cyan, '#ffffff');
    }
    // one envelope lifts out of the stack and flies to the centre (carrier → blueprint)
    const uC = eio(lin(tPeople - 1.0, tPeople + .1, t));
    if (uC > 0) { const x = mix(tray.x, W / 2, uC), y = mix(tray.y - 120, H / 2, uC); ctx.fillStyle = `rgba(8,10,32,${.6 * uC})`; ctx.fillRect(0, 0, W, H); envelope(ctx, x, y, mix(220, 520, uC), mix(.1, 0, uC), 0, 1); addGlow(ctx, x, y, 300, .3 * uC, '#8ab8e8', '#ffffff'); }
    finish(ctx, t, { vig: .55 });
  };
};

// ================= 16: the envelope unfolds into a blueprint of a giant hall; a screen on it lights up =================
const BP = '#123a7a', BPL = '#bfe4ff';
function blueprintPaper(ctx, t, a = 1) {
  const g = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, W * .8); g.addColorStop(0, '#174a92'); g.addColorStop(1, '#0b2456'); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(191,228,255,.08)'; ctx.lineWidth = 1; for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.restore();
}
// plan of the hall: walls, rows of racks, a screen on the far wall. u = how much of it has drawn itself.
const SCR = { x: 960, y: 250, w: 420, h: 236 };
function hallPlan(ctx, t, u, { a = 1, flicker = 0 } = {}) {
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = BPL; ctx.lineCap = 'round';
  const seg = (k, n) => clamp(u * n - k);
  // outer walls drawn in perspective (one-point), self-drawing
  const vx = 960, vy = 380, L0 = [[160, 1000], [700, 470], [1220, 470], [1760, 1000]];
  ctx.lineWidth = 3;
  for (let i = 0; i < 3; i++) { const p = L0[i], q = L0[i + 1], v = seg(i, 3); if (v <= 0) continue; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(mix(p[0], q[0], v), mix(p[1], q[1], v)); ctx.stroke(); }
  // far wall
  const fw = seg(1, 3); if (fw > 0) { ctx.beginPath(); ctx.moveTo(700, 470); ctx.lineTo(700, mix(470, 130, fw)); ctx.lineTo(mix(700, 1220, fw), 130); ctx.moveTo(1220, 470); ctx.lineTo(1220, mix(470, 130, fw)); ctx.stroke(); ctx.beginPath(); ctx.moveTo(700, 130); ctx.lineTo(mix(700, 160, fw), mix(130, -200, fw)); ctx.moveTo(1220, 130); ctx.lineTo(mix(1220, 1760, fw), mix(130, -200, fw)); ctx.stroke(); }
  // rows of racks receding to the vanishing point
  ctx.lineWidth = 1.6;
  for (let r = 0; r < 8; r++) {
    const v = seg(r, 8) * 1.0; if (v <= 0) continue;
    const xn = mix(300, 1620, r / 7), xf = mix(760, 1160, r / 7);
    for (let k = 0; k < 10; k++) { const q = k / 10, q2 = (k + .7) / 10; if (q > v) break; const x1 = mix(xn, xf, Math.sqrt(q)), y1 = mix(980, 490, Math.sqrt(q)), x2 = mix(xn, xf, Math.sqrt(q2)), y2 = mix(980, 490, Math.sqrt(q2)), hh = mix(90, 18, Math.sqrt(q)), ww = mix(40, 10, Math.sqrt(q));
      ctx.globalAlpha = a * (.5 + .5 * (flicker ? (Math.sin(t * 20 + r * 3 + k) > -.6 ? 1 : .2) : 1));
      ctx.strokeRect(x1 - ww / 2, y1 - hh, ww, hh); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
  }
  ctx.globalAlpha = a;
  // dimension lines + labels
  if (u > .6) { const la = clamp((u - .6) / .3); ctx.globalAlpha = a * la; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(160, 930); ctx.lineTo(1760, 930); ctx.stroke(); ctx.setLineDash([]); text(ctx, 'HALL A  ·  MANY THOUSANDS OF RACKS', 960, 920, { size: 18, weight: 600, align: 'center', color: BPL, alpha: a * la, spacing: 6 }); }
  ctx.restore();
}
const blueprint = (T) => {
  const t0 = T.S('02a', 'The people'), tElse = T.S('02a', 'something else'), tK = T.clip('K0').start;
  return (ctx, t, s) => {
    const uOpen = eio(lin(t0 - .1, t0 + .9, t));
    ctx.fillStyle = '#080a20'; ctx.fillRect(0, 0, W, H);
    // the envelope opens; a folded sheet slides out and unfolds to fill the frame
    if (uOpen < 1) { envelope(ctx, W / 2, H / 2 + uOpen * 300, 520, 0, clamp(uOpen * 2), 1 - sm(lin(.5, 1, uOpen)), clamp(uOpen * 1.6)); }
    const uSheet = eio(lin(t0 + .4, t0 + 1.4, t));
    if (uSheet > 0) {
      const sw = mix(380, W, uSheet), sh = mix(240, H, uSheet);
      ctx.save(); ctx.beginPath(); ctx.rect(W / 2 - sw / 2, H / 2 - sh / 2, sw, sh); ctx.clip();
      blueprintPaper(ctx, t);
      const uDraw = clamp((t - (t0 + .9)) / (tK - t0 - 1.6));
      hallPlan(ctx, t, uDraw);
      // fold creases while unfolding
      ctx.fillStyle = `rgba(255,255,255,${.06 * (1 - uSheet)})`; ctx.fillRect(W / 2 - 2, 0, 4, H); ctx.fillRect(0, H / 2 - 2, W, 4);
      // the screen on the far wall lights up (carrier into the clip)
      const uS = sm(lin(tElse + .2, tK - .2, t));
      ctx.strokeStyle = BPL; ctx.lineWidth = 2; ctx.strokeRect(SCR.x - SCR.w / 2, SCR.y - SCR.h / 2, SCR.w, SCR.h * clamp(uDraw * 3 - 1.5));
      if (uS > 0) { ctx.fillStyle = rgba('#d8f7ff', .55 * uS); ctx.fillRect(SCR.x - SCR.w / 2, SCR.y - SCR.h / 2, SCR.w, SCR.h); addGlow(ctx, SCR.x, SCR.y, 420, .5 * uS, C.cyan, '#ffffff'); }
      ctx.restore();
      text(ctx, 'PLAN', 120, 120, { size: 22, weight: 600, color: BPL, alpha: .7 * uSheet, spacing: 10 });
    }
    finish(ctx, t, { vig: .5 });
  };
};

// ================= C2: the clip plays on the screen inside the blueprint hall; its key words float free =================
const PHRASE = 'country of geniuses in a data center';
const clipHall = (T) => {
  const c = T.clip('K0'), q = T.clip('K0'); const words = 'We\'re increasingly close to what I\'ve called a country of geniuses in a data center:'.split(' ').length;
  const total = 34, tPh = c.start + (8 / total) * (c.end - c.start - .4), tPh1 = c.start + (words / total) * (c.end - c.start - .4);
  const S2 = { x: 960, y: 330, w: 760, h: 428 };
  return (ctx, t, s) => {
    blueprintPaper(ctx, t);
    // camera: slow push into the hall
    const z = mix(1.0, 1.08, sine(lin(s.a, s.b, t)));
    ctx.save(); ctx.translate(W / 2, 380); ctx.scale(z, z); ctx.translate(-W / 2, -380);
    // the hall, now fully drawn, scaled so the screen we zoomed into sits big on the far wall
    ctx.save(); ctx.translate(960, 380); ctx.scale(1.8, 1.8); ctx.translate(-960, -330); hallPlan(ctx, t, 1, { a: .55, flicker: 1 }); ctx.restore();
    // racks blink like servers (cyan dots in the lines)
    const r = prng(77); for (let i = 0; i < 120; i++) { const x = r() * W, y = 640 + r() * 420, on = Math.sin(t * (3 + r() * 5) + i) > .3; if (on) { ctx.fillStyle = rgba(C.cyanWhite, .7); ctx.fillRect(x, y, 3, 3); } }
    // the screen (bezel lines in blueprint style)
    ctx.strokeStyle = BPL; ctx.lineWidth = 2; ctx.strokeRect(S2.x - S2.w / 2 - 14, S2.y - S2.h / 2 - 14, S2.w + 28, S2.h + 28);
    ctx.beginPath(); ctx.moveTo(S2.x - 200, S2.y - S2.h / 2 - 14); ctx.lineTo(S2.x - 200, -10); ctx.moveTo(S2.x + 200, S2.y - S2.h / 2 - 14); ctx.lineTo(S2.x + 200, -10); ctx.stroke();
    clipScreen(ctx, t, T, 'K0', S2.x - S2.w / 2, S2.y - S2.h / 2, S2.w, S2.h, { radius: 4 });
    clipQuote(ctx, t, T, 'K0', S2.x - S2.w / 2 + 40, S2.y + S2.h / 2 - 34, S2.w - 80, 28);
    ctx.restore();
    // "country of geniuses in a data center" lifts out of the clip as glowing writing and floats into the hall
    const uW = eout(lin(tPh1, tPh1 + 1.4, t));
    if (t > tPh) {
      const ws = PHRASE.split(' '); ctx.font = '64px "Instrument Serif"';
      const full = ctx.measureText(PHRASE).width; let x = W / 2 - full / 2;
      ws.forEach((w, i) => {
        const ti = tPh + i * .28, a = sm(lin(ti, ti + .4, t)), ww = ctx.measureText(w + ' ').width;
        const y = mix(S2.y + S2.h / 2 + 110, 790, uW) + Math.sin(t * 1.3 + i) * 6 * uW;
        text(ctx, w, x, y, { size: 64, font: 'Instrument Serif', color: '#e9fbff', alpha: a });
        if (a > 0) addGlow(ctx, x + ww / 2, y - 20, 90, .18 * a, C.cyan, '#ffffff');
        x += ww;
      });
    }
    clipLabel(ctx, t, T, 'K0', 110, 870);
    finish(ctx, t, { vig: .5 });
  };
};

// ================= 17: the words fall onto a book page; pages turn; a paragraph gets an amber marker stroke =================
function bookSpread(ctx, t, { flip = 0, mark = 0, line = 0 } = {}) {
  const cx = W / 2, top = 120, bw = 760, bh = 860;
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(cx, top + bh + 20, bw * 1.05, 50, 0, 0, 7); ctx.fill();
  for (const sd of [-1, 1]) {
    const g = ctx.createLinearGradient(cx, 0, cx + sd * bw, 0); g.addColorStop(0, '#cbbf9f'); g.addColorStop(.08, '#efe6cf'); g.addColorStop(1, '#f3ecd8');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(cx, top + 20); ctx.quadraticCurveTo(cx + sd * bw * .5, top - 10, cx + sd * bw, top + 10); ctx.lineTo(cx + sd * bw, top + bh); ctx.quadraticCurveTo(cx + sd * bw * .5, top + bh - 20, cx, top + bh + 10); ctx.fill();
  }
  // text lines (grey bars), right page has the headline + marked paragraph
  const r = prng(5);
  for (const sd of [-1, 1]) for (let i = 0; i < 22; i++) {
    const y = top + 140 + i * 30; if (sd > 0 && i >= 6 && i <= 8) continue;
    const x0 = sd < 0 ? cx - bw + 90 : cx + 80, len = (bw - 170) * (i % 7 === 6 ? .55 : .9 + r() * .1);
    ctx.fillStyle = 'rgba(60,50,40,.30)'; ctx.fillRect(x0, y, len, 8);
  }
  text(ctx, 'Machines of Loving Grace', cx - bw / 2, top + 90, { size: 40, font: 'Instrument Serif', color: '#3a3026', align: 'center' });
  text(ctx, 'DARIO AMODEI · ESSAY · 2024', cx + bw / 2, top + 84, { size: 16, weight: 600, color: '#6a5a48', align: 'center', spacing: 4 });
  // the marked paragraph: amber stroke sweeps across three lines
  for (let k = 0; k < 3; k++) { const u = clamp(mark * 3 - k); if (u <= 0) continue; ctx.fillStyle = rgba(P.amber, .55); ctx.fillRect(cx + 74, top + 140 + (6 + k) * 30 - 10, (bw - 170) * u, 26); }
  // the landed line of writing in the paragraph
  if (line > 0) { ctx.fillStyle = `rgba(40,34,28,${.75 * line})`; for (let k = 0; k < 3; k++) ctx.fillRect(cx + 80, top + 140 + (6 + k) * 30, (bw - 170) * (k === 2 ? .5 : .95), 9); }
  // a page turning over the spread
  if (flip > 0 && flip < 1) {
    const a = flip * Math.PI, px = cx + Math.cos(a) * bw;
    const g = ctx.createLinearGradient(cx, 0, px, 0); g.addColorStop(0, '#d8ccad'); g.addColorStop(1, '#fbf6e8');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(cx, top + 20); ctx.quadraticCurveTo((cx + px) / 2, top - 40 - Math.sin(a) * 60, px, top + 10 - Math.sin(a) * 40); ctx.lineTo(px, top + bh - Math.sin(a) * 40); ctx.quadraticCurveTo((cx + px) / 2, top + bh - 30, cx, top + bh + 10); ctx.fill();
    ctx.fillStyle = `rgba(0,0,0,${.18 * Math.sin(a)})`; ctx.fillRect(Math.min(cx, px), top, Math.abs(px - cx), bh);
  }
}
const essay = (T) => {
  const t0 = T.S('02b', 'In his essay'), tSp = T.S('02b', 'spells'), tMil = T.S('02b', 'Millions');
  return (ctx, t, s) => {
    const bg = ctx.createRadialGradient(W / 2, H * .45, 100, W / 2, H / 2, W * .8); bg.addColorStop(0, '#2a2a5a'); bg.addColorStop(1, '#0a0c24'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    // desk lamp light from the top left
    const z = mix(1.12, 1.0, eout(lin(s.a, s.a + 2.2, t)));
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
    const flip = eio(lin(t0 + .3, t0 + 1.1, t)) * .999 + eio(lin(t0 + 1.0, t0 + 1.8, t)) * 0;
    const uFall = eio(lin(s.a, tSp + .2, t)), uMark = eio(lin(tSp + .1, tMil - .3, t));
    bookSpread(ctx, t, { flip: flip < .999 ? flip : 0, mark: uMark, line: sm(lin(tSp - .1, tSp + .4, t)) });
    ctx.restore();
    // the floating words drift down onto the paragraph
    if (uFall < 1) { const y = mix(760, 120 + 140 + 7 * 30 + 6, uFall), x = mix(W / 2, W / 2 + 380, uFall), sz = mix(64, 22, uFall); text(ctx, PHRASE, x, y, { size: sz, font: 'Instrument Serif', color: '#e9fbff', align: 'center', alpha: 1 - sm(lin(.8, 1, uFall)) }); addGlow(ctx, x, y - 10, 300 * (1 - uFall) + 40, .2 * (1 - uFall), C.cyan, '#ffffff'); }
    // the medal arrives as a bookmark on the page (carrier)
    const uMed = back(clamp((t - (tMil - .8)) / .6));
    if (uMed > 0) medal(ctx, mix(W / 2 + 380, W / 2 + 330, uMed), mix(-120, 540, clamp(uMed)), 70, t, 1);
    addGlow(ctx, 360, 120, 600, .14, P.amber, '#fff3dd');
    finish(ctx, t, { vig: .55 });
  };
};
function medal(ctx, x, y, r, t, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = '#7a3b17'; ctx.beginPath(); ctx.moveTo(x - r * .5, y - r * 2.4); ctx.lineTo(x - r * .1, y - r * .8); ctx.lineTo(x + r * .1, y - r * .8); ctx.lineTo(x + r * .5, y - r * 2.4); ctx.fill();
  const g = ctx.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r); g.addColorStop(0, '#fff0c0'); g.addColorStop(.5, '#e6b04a'); g.addColorStop(1, '#a8701e');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(122,59,23,.6)'; ctx.lineWidth = r * .06; ctx.beginPath(); ctx.arc(x, y, r * .75, 0, 7); ctx.stroke();
  const sh = (t * .6) % 2; ctx.fillStyle = `rgba(255,255,255,${.35 * Math.max(0, 1 - Math.abs(sh - .5) * 3)})`; ctx.beginPath(); ctx.arc(x, y, r, -2.2, -1.2); ctx.lineTo(x, y); ctx.fill();
  ctx.restore();
  addGlow(ctx, x, y, r * 2.6, .35 * a, P.amber, '#fff3dd');
}

// ================= 18: the medal, a figure rises wearing it, and splits 2 → 4 → 16 → 256 → millions =================
const copies = (T) => {
  const t0 = T.S('02b', 'Millions'), tEach = T.S('02b', 'each smarter'), tNob = T.S('02b', 'Nobel'), tMost = T.S('02b', 'most fields');
  const steps = [0, 1, 2, 4, 8, 12, 20]; // log2 of the count per stage: 1, 2, 4, 16, 256, 65536
  return (ctx, t, s) => {
    const bg = ctx.createRadialGradient(W / 2, H * .55, 50, W / 2, H / 2, W * .8); bg.addColorStop(0, '#22265e'); bg.addColorStop(1, '#080a20'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    // the page dims away under the medal
    const uRise = eout(lin(s.a + .1, t0 + .3, t));
    const stage = clamp((t - (t0 + .3)) / (tMost - t0 - .2)) * (steps.length - 1);
    const si = Math.floor(stage), sf = eio(stage - si), lgN = mix(steps[si], steps[Math.min(si + 1, steps.length - 1)], sf);
    const n = Math.pow(2, lgN);
    // layout: a square-ish grid that shrinks the figure size as copies multiply
    const nL = Math.min(n, 3000), cols = Math.ceil(Math.sqrt(nL * 1.8)), rows = Math.ceil(nL / cols), cell = Math.min(1600 / cols, 820 / rows), h = Math.min(520, cell * .82);
    const shown = nL;
    if (uRise < 1) medal(ctx, W / 2, mix(540, 540, uRise), 70 * (1 - uRise) + 6, t, 1 - uRise);
    const r = prng(4);
    for (let i = 0; i < shown; i++) {
      const cx = W / 2 + ((i % cols) - (cols - 1) / 2) * cell, cy = H / 2 + 60 + (Math.floor(i / cols) - (rows - 1) / 2) * cell * 1.0 + h * .45;
      const born = i < Math.pow(2, Math.floor(lgN)) ? 1 : clamp(n - i);
      const jitter = Math.sin(t * 1.4 + i) * h * .01;
      const x = i === 0 ? W / 2 + (cx - W / 2) : cx;
      const hh = i === 0 && n < 1.5 ? h * uRise : h;
      figure(ctx, x + jitter, cy + (i === 0 && n < 1.5 ? 0 : 0), hh, i % 7 === 3 ? '#2e3f86' : '#253577', { a: born, medal: 1 });
      if (h > 60) addGlow(ctx, x, cy - hh * .7, hh * .45, .12 * born, C.cyan, C.cyanWhite);
    }
    // beyond 4000 copies, the crowd becomes a field of glints
    if (n > 3000) { const k = clamp((lgN - 11.5) / 4); for (let i = 0; i < 3000 * k; i++) { const x = r() * W, y = 160 + r() * 860; ctx.fillStyle = rgba(r() < .2 ? '#ffd27a' : C.cyanWhite, .5 * k); ctx.fillRect(x, y, 2, 2); } }
    // a soft wave of light runs through the crowd once it is too big to count
    if (n > 200) { const k = clamp((lgN - 7.6) / 2); for (let i = 0; i < 18; i++) { const q = ((t * .35 + i / 18) % 1); addGlow(ctx, mix(150, W - 150, q), H / 2 + 60 + Math.sin(i * 2.3 + t) * 300, 220, .12 * k * Math.sin(q * Math.PI), i % 4 ? C.cyan : P.amber, '#ffffff'); }
      const rg = prng(Math.floor(t * 8)); for (let i = 0; i < 40 * k; i++) addGlow(ctx, 150 + rg() * (W - 300), 240 + rg() * 760, 10, .7, P.amber, '#fff3dd'); }
    // count in the corner
    const count = Math.round(n), lbl = count >= 1e6 ? 'millions' : count.toLocaleString('en-US');
    text(ctx, lbl, 110, 150, { size: 84, font: 'Instrument Serif', alpha: sm(lin(t0, t0 + .4, t)) });
    text(ctx, 'COPIES', 114, 192, { size: 18, weight: 600, color: C.muted, spacing: 6, alpha: sm(lin(t0, t0 + .4, t)) });
    const aN = sm(lin(tNob - .2, tNob + .3, t)); text(ctx, 'EACH: NOBEL-PRIZE LEVEL, IN MOST FIELDS', W - 110, 150, { size: 20, weight: 600, align: 'right', color: '#ffd27a', alpha: aN, spacing: 5 });
    finish(ctx, t, { vig: .55 });
  };
};

// ================= 19: split desk. You read one page a second; the copy flips through like a flip book, a candle burns down =================
const split = (T) => {
  const t0 = T.S('02b', 'Each working'), tTen = T.S('02b', 'ten to'), tYou = T.S('02b', 'than you');
  return (ctx, t, s) => {
    const half = W / 2;
    for (const side of [0, 1]) {
      ctx.save(); ctx.beginPath(); ctx.rect(side * half, 0, half, H); ctx.clip();
      const ox = side * half;
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, side ? '#0f2350' : '#2b2140'); g.addColorStop(1, side ? '#081530' : '#140f22'); ctx.fillStyle = g; ctx.fillRect(ox, 0, half, H);
      // desk
      ctx.fillStyle = side ? '#152a5a' : '#3a2a26'; ctx.fillRect(ox, 700, half, 380);
      ctx.fillStyle = side ? '#1b3570' : '#4a3426'; ctx.fillRect(ox, 700, half, 14);
      // lamp
      const lx = ox + 160; ctx.strokeStyle = '#0a0b20'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(lx, 700); ctx.lineTo(lx + 30, 480); ctx.lineTo(lx + 150, 430); ctx.stroke();
      cone(ctx, lx + 160, 445, 330, -.25, .5, side ? C.cyan : P.amber, .3);
      // the reader
      person(ctx, ox + 620, 860, 380, t, { sit: true, coat: side ? '#3a6bd0' : P.amber, typing: false, hood: !side, flip: true });
      // the book on the desk + its pages
      const bx = ox + 470, by = 690;
      ctx.fillStyle = '#efe6cf'; ctx.beginPath(); ctx.moveTo(bx - 120, by); ctx.lineTo(bx, by - 18); ctx.lineTo(bx + 120, by); ctx.lineTo(bx, by + 10); ctx.fill();
      const rate = side ? 26 : 1, ph = ((t - s.a) * rate) % 1;
      if (side) { for (let k = 0; k < 5; k++) { const p = (ph + k / 5) % 1; ctx.fillStyle = `rgba(255,255,255,${.5 * (1 - p)})`; ctx.beginPath(); ctx.moveTo(bx, by - 18); ctx.lineTo(bx + Math.cos(p * Math.PI) * 120, by - Math.sin(p * Math.PI) * 70); ctx.lineTo(bx + Math.cos(p * Math.PI) * 120, by - Math.sin(p * Math.PI) * 70 + 18); ctx.lineTo(bx, by); ctx.fill(); } addGlow(ctx, bx, by - 40, 160, .35, C.cyan, '#ffffff'); }
      else { const p = eio(ph); ctx.fillStyle = '#fbf6e8'; ctx.beginPath(); ctx.moveTo(bx, by - 18); ctx.lineTo(bx + Math.cos(p * Math.PI) * 120, by - Math.sin(p * Math.PI) * 60); ctx.lineTo(bx + Math.cos(p * Math.PI) * 120, by - Math.sin(p * Math.PI) * 60 + 18); ctx.lineTo(bx, by); ctx.fill(); }
      // candle: burns at the speed of that side
      const burn = side ? clamp((t - tTen) / 2.6) : clamp((t - s.a) / 300), ch = mix(140, 18, burn), cxx = ox + 820;
      ctx.fillStyle = '#e9dcc0'; ctx.fillRect(cxx - 16, 700 - ch, 32, ch); ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.fillRect(cxx + 4, 700 - ch, 12, ch);
      const fl = 1 + .15 * Math.sin(t * (side ? 40 : 9));
      ctx.fillStyle = '#ffd27a'; ctx.beginPath(); ctx.ellipse(cxx, 700 - ch - 18 * fl, 8, 18 * fl, 0, 0, 7); ctx.fill(); addGlow(ctx, cxx, 700 - ch - 18, 90, .55, P.amber, '#fff3dd');
      // wall clock: hands at that side's speed
      const ccx = ox + 760, ccy = 220, R = 70, sp = (t - s.a) * (side ? 60 : 1) * .1;
      ctx.strokeStyle = rgba(C.cream, .55); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(ccx, ccy, R, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ccx, ccy); ctx.lineTo(ccx + Math.cos(sp - 1.57) * R * .8, ccy + Math.sin(sp - 1.57) * R * .8); ctx.moveTo(ccx, ccy); ctx.lineTo(ccx + Math.cos(sp / 12 - 1.57) * R * .5, ccy + Math.sin(sp / 12 - 1.57) * R * .5); ctx.stroke();
      ctx.restore();
    }
    // divider and labels
    ctx.fillStyle = rgba(C.cream, .25); ctx.fillRect(half - 1, 0, 2, H);
    const a = sm(lin(t0, t0 + .5, t));
    text(ctx, 'YOU', 110, 130, { size: 20, weight: 600, color: C.muted, spacing: 7, alpha: a }); text(ctx, '1 page', 110, 196, { size: 64, font: 'Instrument Serif', alpha: a });
    const b = sm(lin(tTen, tTen + .5, t));
    text(ctx, 'A COPY', half + 110, 130, { size: 20, weight: 600, color: C.muted, spacing: 7, alpha: b }); text(ctx, '10–100 pages', half + 110, 196, { size: 64, font: 'Instrument Serif', color: '#e9fbff', alpha: b });
    // medal rolls in at the start along the desk (carrier from the copies)
    const uRoll = eout(lin(s.a, s.a + 1.0, t)); if (uRoll < 1) medal(ctx, mix(W / 2, W / 2 - 60, uRoll), mix(540, 680, uRoll), mix(40, 14, uRoll), t, 1 - sm(lin(.6, 1, uRoll)));
    finish(ctx, t, { vig: .5 });
  };
};

// ================= 20: the camera tilts up to the wall calendar; years tear off; it stops on a question mark =================
const calendar = (T) => {
  const t0 = T.S('02b', 'He thinks'), tFew = T.S('02b', 'few years');
  const years = ['2026', '2027', '2028', '2029', '20??'];
  return (ctx, t, s) => {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1b1a40'); g.addColorStop(1, '#262448'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // wallpaper stripes + lamp light from below
    for (let x = 0; x < W; x += 60) { ctx.fillStyle = 'rgba(255,255,255,.015)'; ctx.fillRect(x, 0, 30, H); }
    const lg = ctx.createRadialGradient(W / 2, H + 100, 50, W / 2, H + 100, 1000); lg.addColorStop(0, rgba(P.amber, .25)); lg.addColorStop(1, rgba(P.amber, 0)); ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H);
    const z = mix(1, 1.08, sine(lin(s.a, s.b, t))); ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
    // nail + calendar block
    const cx = W / 2, cy = 520, cw = 520, chh = 600;
    ctx.fillStyle = '#0a0b20'; ctx.beginPath(); ctx.arc(cx, cy - chh / 2 - 40, 8, 0, 7); ctx.fill();
    ctx.strokeStyle = '#0a0b20'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - 120, cy - chh / 2); ctx.lineTo(cx, cy - chh / 2 - 40); ctx.lineTo(cx + 120, cy - chh / 2); ctx.stroke();
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(cx - cw / 2 + 16, cy - chh / 2 + 20, cw, chh);
    ctx.fillStyle = '#7a2a22'; ctx.fillRect(cx - cw / 2, cy - chh / 2, cw, 60);
    for (let i = 0; i < 9; i++) { ctx.fillStyle = '#0a0b20'; ctx.beginPath(); ctx.arc(cx - cw / 2 + 60 + i * 50, cy - chh / 2 + 6, 6, 0, 7); ctx.fill(); }
    // which sheet is on top: tears every .45 s from "He thinks" until "few years"
    const k = clamp(Math.floor((t - (t0 + .3)) / ((tFew - t0) / 4)), 0, 4);
    const draw = (j, alpha = 1) => { ctx.fillStyle = `rgba(245,240,226,${alpha})`; ctx.fillRect(cx - cw / 2, cy - chh / 2 + 60, cw, chh - 60); const y = years[j];
      text(ctx, y, cx, cy + 90, { size: 200, font: 'Instrument Serif', align: 'center', color: j === 4 ? '#b0562a' : '#2a2430', alpha });
      ctx.fillStyle = `rgba(42,36,48,${.25 * alpha})`; for (let r = 0; r < 4; r++) for (let c2 = 0; c2 < 7; c2++) ctx.fillRect(cx - cw / 2 + 60 + c2 * 60, cy + 150 + r * 34, 30, 14); };
    draw(Math.min(k + 1, 4)); draw(k);
    // torn sheets flutter down
    for (let j = 0; j < k; j++) { const tt = t0 + .3 + (j + 1) * ((tFew - t0) / 4), u = clamp((t - tt) / 1.6); if (u <= 0 || u >= 1) continue;
      ctx.save(); ctx.translate(cx + u * 300 * (j % 2 ? -1 : 1) + Math.sin(u * 9) * 40, cy + u * u * 900); ctx.rotate(u * 2 * (j % 2 ? -1 : 1)); ctx.globalAlpha = 1 - u;
      ctx.fillStyle = '#f5f0e2'; ctx.fillRect(-cw / 2, -chh / 2 + 60, cw, chh - 60); text(ctx, years[j], 0, 90, { size: 200, font: 'Instrument Serif', align: 'center', color: '#2a2430' }); ctx.restore(); }
    // question mark pulses once it stops
    if (k === 4) { const p = .5 + .5 * Math.sin((t - tFew) * 4); addGlow(ctx, cx + 120, cy + 20, 120, .25 * p, P.amber, '#fff3dd'); }
    ctx.restore();
    finish(ctx, t, { vig: .55 });
  };
};

// ================= 21: others think much longer, or not like this: the blueprint frays into fog; other buildings flicker =================
const doubt = (T) => {
  const t0 = T.S('02b', 'Others'), tOr = T.S('02b', "or won't");
  const shapes = [ // alternative building outlines (polylines in plan space)
    [[560, 760], [560, 420], [960, 260], [1360, 420], [1360, 760]],
    [[480, 760], [480, 520], [760, 520], [760, 360], [1160, 360], [1160, 520], [1440, 520], [1440, 760]],
    [[620, 760], [700, 300], [900, 300], [960, 200], [1020, 300], [1220, 300], [1300, 760]],
    [[520, 760], [520, 460], [1400, 460], [1400, 760]],
  ];
  return (ctx, t, s) => {
    blueprintPaper(ctx, t, 1);
    const uFray = sm(lin(t0, s.b, t));
    ctx.save(); ctx.globalAlpha = 1 - .7 * uFray; hallPlan(ctx, t, 1, { a: 1, flicker: 1 }); ctx.restore();
    // the plan is eaten by fog from the edges
    fogBand(ctx, t * 2, 300, 600, { a: .25 + .5 * uFray, hex: '#a9c6e8', speed: 30, seed: 3 });
    fogBand(ctx, t * 2, 800, 500, { a: .2 + .5 * uFray, hex: '#a9c6e8', speed: 24, seed: 8 });
    // other possible buildings flicker in and out, dashed
    const uAlt = sm(lin(tOr - .6, tOr + .2, t));
    ctx.save(); ctx.setLineDash([14, 10]); ctx.lineWidth = 3;
    shapes.forEach((sh, i) => { const a = uAlt * Math.max(0, Math.sin((t - tOr) * 3 + i * 1.6)); if (a <= .02) return; ctx.strokeStyle = rgba('#e9fbff', .8 * a); ctx.beginPath(); sh.forEach(([x, y], j) => (j ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); });
    ctx.restore();
    // the last calendar sheet drifts across and dissolves
    const uS = lin(s.a, s.a + 2.4, t); if (uS < 1) { ctx.save(); ctx.globalAlpha = (1 - uS) * .8; ctx.translate(mix(W / 2, W + 200, eio(uS)), mix(500, 120, uS)); ctx.rotate(uS * 1.4); ctx.fillStyle = '#f5f0e2'; ctx.fillRect(-160, -120, 320, 240); text(ctx, '20??', 0, 40, { size: 110, font: 'Instrument Serif', align: 'center', color: '#b0562a' }); ctx.restore(); }
    // fog rises at the end: the camera starts going up through it
    const uUp = sm(lin(s.b - 1.6, s.b, t)); if (uUp > 0) { ctx.fillStyle = rgba('#b8cfe8', .5 * uUp); ctx.fillRect(0, 0, W, H); }
    finish(ctx, t, { vig: .5 });
  };
};

export default function (T) {
  const S = (seg, p) => T.S(seg, p);
  const k1 = T.clip('K1'), k0 = T.clip('K0');
  return [
    { t: k1.start - 1.0, draw: shopTV(T), tr: 'zoom', d: 1.2, x: 1240, y: 640, depth: 6 },
    { t: S('02a', "That's the head") - .2, draw: skyline(T), tr: 'out', d: 1.2, x: LAB.x, y: LAB.wy, depth: 6 },
    { t: S('02a', 'Most of us') - .25, draw: chat(T), tr: 'zoom', d: 1.0, x: LAB.x, y: LAB.wy, depth: 6 },
    { t: S('02a', 'Something that') - .1, draw: emails(T), tr: 'match', d: .4 },
    { t: S('02a', 'The people') - .05, draw: blueprint(T), tr: 'match', d: .35 },
    { t: k0.start - .2, draw: clipHall(T), tr: 'zoom', d: 1.0, x: SCR.x, y: SCR.y, depth: 1.8 },
    { t: S('02b', 'In his essay') - .3, draw: essay(T), tr: 'match', d: .7 },
    { t: S('02b', 'Millions') - .5, draw: copies(T), tr: 'match', d: .5 },
    { t: S('02b', 'Each working') - .15, draw: split(T), tr: 'push', d: .8 },
    { t: S('02b', 'He thinks') - .2, draw: calendar(T), tr: 'up', d: 1.0 },
    { t: S('02b', 'Others') - .2, draw: doubt(T), tr: 'fog', d: 1.0 },
  ];
}
