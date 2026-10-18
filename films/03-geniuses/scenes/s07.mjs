// 07 · The fork (5:54–6:17 + 4 s of silence): the gate swings half shut, you stand in front of it; three dials on its lintel.
// Testing (snail → bird), access (one villa → many homes), questions (ad click, stock, heart, world). Then the wide shot:
// behind the gate the road splits in two, one path into grey fog, one toward a warm dawn. Your hand rises and stops.
// Carrier chain: gate → lintel with the dials → dial 1 → dial 2 → dial 3 → back to the wide fork (fork point ends at screen centre for s08).
import { W, H, C, rgba, clamp, lin, mix, sm, eio, eout, ein, sine, prng, addGlow, text } from '../engine.mjs';
import { P, skyGrad, fogBand, hill, grass, person, finish, mixHex } from '../lib/world.mjs';
import { dial, ICON, woodDoor } from '../lib/s06_helpers.mjs';

// world layout of the gate scene (screen coords when the camera is at rest)
const G = { cx: 960, by: 820, w: 560, h: 500 };     // gate opening: centre x, bottom y, width, height
const LINTEL_Y = G.by - G.h - 50;
const DIALS = [-160, 0, 160].map((dx) => ({ x: G.cx + dx, y: LINTEL_Y }));
const FORK = { x: 960, y: 690 };                   // where the road splits, just behind the gate

const VAL = (t, t0, from, to) => mix(from, to, eio(lin(t0, t0 + 1.4, t)));

// the scene behind the gate: two paths, fog left, dawn right
function forkWorld(ctx, t, { glowL = 1, dawn = 1 } = {}) {
  skyGrad(ctx, { t, stars: .55, bottom: '#2c3c80' });
  // dawn on the right horizon
  const dg = ctx.createRadialGradient(1500, 520, 0, 1500, 520, 900); dg.addColorStop(0, rgba('#ffb36b', .55 * dawn)); dg.addColorStop(.4, rgba('#e9a07f', .25 * dawn)); dg.addColorStop(1, 'rgba(233,160,127,0)'); ctx.fillStyle = dg; ctx.fillRect(0, 0, W, H);
  addGlow(ctx, 1520, 540, 140, .7 * dawn, P.amber, '#fff3dd');
  // grey fog bank on the left
  const fg = ctx.createRadialGradient(420, 520, 0, 420, 520, 800); fg.addColorStop(0, 'rgba(150,160,190,.35)'); fg.addColorStop(1, 'rgba(150,160,190,0)'); ctx.fillStyle = fg; ctx.fillRect(0, 0, W, H);
  hill(ctx, [[-10, 560], [500, 552], [1000, 560], [1500, 548], [1930, 556]], { col: '#151a4a' });
  // the two roads from the fork point
  ctx.fillStyle = '#151a4a'; ctx.fillRect(-300, 556, W + 600, 800);
  const road = (x1, y1, hex, a, glowHex) => {
    const cx = mix(FORK.x, x1, .75), cy = FORK.y + 10;
    ctx.fillStyle = rgba(hex, a); ctx.beginPath(); ctx.moveTo(FORK.x - 40, FORK.y); ctx.quadraticCurveTo(cx, cy + 30, x1 - 5, y1); ctx.lineTo(x1 + 5, y1); ctx.quadraticCurveTo(cx, cy - 20, FORK.x + 40, FORK.y); ctx.fill();
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.strokeStyle = rgba(glowHex, .5 * a); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(FORK.x, FORK.y); ctx.quadraticCurveTo(cx, cy + 5, x1, y1); ctx.stroke(); ctx.restore();
  };
  road(260, 556, '#6c7298', .7, '#c0c6e0'); road(1600, 552, '#d99a5a', .85, '#ffd29a');
  addGlow(ctx, FORK.x, FORK.y, 90, .5, P.amber, '#fff3dd');
  // the main road from the camera to the fork
  ctx.fillStyle = '#20265e'; ctx.beginPath(); ctx.moveTo(FORK.x - 30, FORK.y); ctx.lineTo(FORK.x + 30, FORK.y); ctx.lineTo(1260, H + 10); ctx.lineTo(660, H + 10); ctx.fill();
  ctx.strokeStyle = 'rgba(243,239,226,.25)'; ctx.lineWidth = 4; ctx.setLineDash([30, 40]); ctx.beginPath(); ctx.moveTo(FORK.x, FORK.y); ctx.lineTo(960, H); ctx.stroke(); ctx.setLineDash([]);
  // left destination: a grey waiting room silhouette in the fog; right: a warm town with lit windows
  ctx.fillStyle = 'rgba(120,128,160,.55)'; ctx.fillRect(170, 470, 200, 86); for (let i = 0; i < 5; i++) { ctx.fillStyle = 'rgba(200,205,225,.35)'; ctx.fillRect(186 + i * 38, 494, 22, 14); }
  const r = prng(77); for (let i = 0; i < 9; i++) { const x = 1480 + i * 50, h = 40 + r() * 70; ctx.fillStyle = '#2a2140'; ctx.fillRect(x, 552 - h, 42, h); for (let k = 0; k < 3; k++) if (r() < .7) { ctx.fillStyle = rgba(P.amber, .9); ctx.fillRect(x + 8 + (k % 2) * 16, 552 - h + 10 + k * 14, 8, 8); } }
  fogBand(ctx, t, 520, 120, { a: .35 * glowL, hex: '#a0a8c8', speed: 4 });
  // little lights walking on both roads, more on the warm one
  for (let i = 0; i < 14; i++) { const q = ((t * .05 + i / 14) % 1), warm = i % 3 !== 0, x1 = warm ? 1600 : 260, y1 = warm ? 552 : 556, cx = mix(FORK.x, x1, .75), cy = FORK.y + 10; const x = (1 - q) * (1 - q) * FORK.x + 2 * q * (1 - q) * cx + q * q * x1, y = (1 - q) * (1 - q) * FORK.y + 2 * q * (1 - q) * cy + q * q * y1 - 4; addGlow(ctx, x, y, 10 + 6 * (1 - q), .7 * (1 - q * .5), warm ? P.amber : '#c0c6e0', '#ffffff'); }
}
// the gate (posts, lintel, two wings half shut), the dials on the lintel
function gate(ctx, t, { shut = .5, dialA = 1, vals = [.3, .3, .3], lit = [1, 1, 1] } = {}) {
  const x0 = G.cx - G.w / 2, x1 = G.cx + G.w / 2, y0 = G.by - G.h;
  // wall either side
  // free-standing in the open field: a low hedge either side, so both roads stay visible
  ctx.fillStyle = '#10143c'; for (const [a, b] of [[-40, x0 - 40], [x1 + 40, W + 40]]) { ctx.beginPath(); ctx.moveTo(a, G.by); for (let x = a; x <= b; x += 30) ctx.lineTo(x, G.by - 70 - 10 * Math.sin(x * .05)); ctx.lineTo(b, G.by); ctx.fill(); }
  // posts + lintel
  ctx.fillStyle = '#2a1a14'; ctx.fillRect(x0 - 40, y0 - 100, 40, G.h + 100); ctx.fillRect(x1, y0 - 100, 40, G.h + 100); ctx.fillRect(x0 - 60, y0 - 110, G.w + 120, 110);
  ctx.fillStyle = 'rgba(255,220,170,.08)'; ctx.fillRect(x0 - 60, y0 - 110, G.w + 120, 6);
  // light through the gap between the wings
  const gap = G.w * (1 - shut);
  ctx.save(); ctx.globalCompositeOperation = 'screen'; const fl = ctx.createLinearGradient(0, G.by, 0, H); fl.addColorStop(0, rgba('#ffd29a', .35)); fl.addColorStop(1, rgba('#ffd29a', 0)); ctx.fillStyle = fl; ctx.beginPath(); ctx.moveTo(G.cx - gap / 2, G.by); ctx.lineTo(G.cx + gap / 2, G.by); ctx.lineTo(G.cx + gap * 1.8, H + 20); ctx.lineTo(G.cx - gap * 1.8, H + 20); ctx.fill(); ctx.restore();
  // wings: planks, swung partly closed (drawn foreshortened)
  for (const side of [-1, 1]) {
    const hinge = side < 0 ? x0 : x1, ww = G.w / 2 * shut; const n = 4;
    for (let i = 0; i < n; i++) { const a0 = hinge - side * i * ww / n, a1 = hinge - side * (i + 1) * ww / n; const g = ctx.createLinearGradient(Math.min(a0, a1), 0, Math.max(a0, a1), 0); g.addColorStop(0, '#5a3a26'); g.addColorStop(1, '#4a2f1f'); ctx.fillStyle = g; ctx.fillRect(Math.min(a0, a1) + 1, y0 + 6, Math.abs(a1 - a0) - 2, G.h - 6); }
    ctx.fillStyle = 'rgba(255,226,176,.8)'; ctx.fillRect(hinge - side * ww - (side > 0 ? 3 : 0), y0 + 6, 3, G.h - 6);
  }
  // dials
  DIALS.forEach((d, i) => dial(ctx, d.x, d.y, 34, vals[i], t, { a: dialA * lit[i], glowA: lit[i] }));
}

// ---------- 68: you, from behind, in front of the half-shut gate ----------
const yourCall = (T) => {
  const t0 = T.S('07a', 'So pause'), tCall = T.S('07a', 'your call'), tGen = T.S('07a', 'The geniuses');
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t));
    const shut = mix(.25, .62, eio(lin(t0 - 1.5, t0 + .6, t)));
    ctx.save(); const z = mix(1, 1.1, u); ctx.translate(G.cx, LINTEL_Y + 200); ctx.scale(z, z); ctx.translate(-G.cx, -(LINTEL_Y + 200));
    forkWorld(ctx, t);
    gate(ctx, t, { shut, dialA: sm(lin(tCall - .3, tGen, t)), vals: [.25, .2, .3] });
    ctx.fillStyle = '#0d1033'; ctx.fillRect(-100, G.by, W + 200, 400);
    ctx.restore();
    // you, over-the-shoulder: a big figure from behind, bottom left
    person(ctx, 560, H + 300, 640, t, { coat: P.amber, hood: true, breathe: 1.2 });
    fogBand(ctx, t, 1000, 140, { a: .18, hex: '#8ab8e8' });
    finish(ctx, t, { vig: .6 });
  };
};

// ---------- 69: closer on the lintel; the three dials light up one after another; through the gap the geniuses' light comes nearer ----------
const L2 = { s: 2.6 };       // zoom of the lintel close-up around (G.cx, LINTEL_Y)
const toL2 = (p) => ({ x: 960 + (p.x - G.cx) * L2.s, y: 470 + (p.y - LINTEL_Y) * L2.s });
const threeDials = (T) => {
  const tGen = T.S('07a', 'The geniuses'), tWay = T.S('07a', 'either way'), tThree = T.S('07a', 'Three choices'), tOpen = T.S('07a', 'open');
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t)), z = L2.s * mix(1, 1.04, u);
    ctx.save(); ctx.translate(960, 470); ctx.scale(z, z); ctx.translate(-G.cx, -LINTEL_Y);
    forkWorld(ctx, t, { dawn: .8 });
    // ideas approaching through the gap (the geniuses are coming either way)
    const ap = lin(tGen - .5, tWay + 1.5, t);
    for (let i = 0; i < 16; i++) { const q = ((ap * .6 + i / 16) % 1), x = G.cx + Math.sin(i * 2.3) * 60 * q, y = FORK.y + 20 + q * 180; addGlow(ctx, x, y, 6 + 18 * q, .6 * q, C.cyan, C.cyanWhite); }
    const lit = [0, 1, 2].map((i) => sm(lin(tThree + i * .3, tThree + i * .3 + .4, t)));
    gate(ctx, t, { shut: .62, vals: [.25, .2, .3], lit: lit.map((l) => .25 + .75 * l) });
    ctx.restore();
    // a small label after "still open"
    const la = sm(lin(tOpen - .2, tOpen + .4, t)) * (1 - sm(lin(s.b - .5, s.b, t)));
    if (la > 0) text(ctx, 'THREE CHOICES · STILL OPEN', 960, 980, { size: 22, weight: 600, color: P.amber, align: 'center', spacing: 8, alpha: la });
    finish(ctx, t, { vig: .6 });
  };
};

// a big dial close-up on the lintel wood
function dialClose(ctx, t, s, { label, sub, icons, v, extra }) {
  const u = sine(lin(s.a, s.b, t));
  const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#3a2418'); bg.addColorStop(1, '#24160f'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(20,10,5,.4)'; ctx.lineWidth = 3; for (let k = 0; k < 14; k++) { const y = 40 + k * 80; ctx.beginPath(); ctx.moveTo(0, y); ctx.bezierCurveTo(600, y + 20, 1300, y - 20, W, y + 10); ctx.stroke(); }
  addGlow(ctx, 960, 500, 900, .25, P.amber, '#fff3dd');
  const z = mix(1, 1.05, u); ctx.save(); ctx.translate(960, 500); ctx.scale(z, z); ctx.translate(-960, -500);
  dial(ctx, 960, 480, 270, v, t, { label, sub, icons });
  if (extra) extra(ctx, t);
  ctx.restore();
  finish(ctx, t, { vig: .6 });
}

// ---------- 70: dial 1, testing: snail → bird; a safety latch clicks beside it ----------
const dialTest = (T) => {
  const t0 = T.S('07a', 'How fast'), tSafe = T.S('07a', 'safely');
  return (ctx, t, s) => dialClose(ctx, t, s, {
    label: 'testing', sub: 'how fast, safely', icons: [ICON.snail, ICON.bird], v: VAL(t, t0 - .2, .12, .78),
    extra: (ctx, t) => { // the safety latch: a bolt slides into its keeper on "safely"
      const k = eio(lin(tSafe - .2, tSafe + .3, t)), x = 1390, y = 480;
      ctx.fillStyle = '#7a6440'; ctx.fillRect(x, y - 50, 120, 100); ctx.fillStyle = '#9aa0c8'; ctx.fillRect(x + 20 - 80 * k, y - 14, 150, 28); ctx.fillStyle = '#c9a77a'; ctx.fillRect(x + 60 - 80 * k, y - 50, 20, 36);
      ctx.fillStyle = '#5a4630'; ctx.fillRect(x - 110, y - 40, 40, 80);
      const fl = Math.exp(-Math.pow((t - tSafe - .3) / .2, 2)); if (fl > .02) addGlow(ctx, x - 70, y, 90, .7 * fl, C.cyan, C.cyanWhite);
      text(ctx, 'SAFETY', x + 60, y + 90, { size: 18, weight: 600, color: C.muted, align: 'center', spacing: 5 });
    },
  });
};
// ---------- 71: dial 2, access: one villa → many small homes ----------
const dialAccess = (T) => {
  const t0 = T.S('07a', 'Who gets');
  return (ctx, t, s) => dialClose(ctx, t, s, {
    label: 'access', sub: 'who gets the results', icons: [ICON.villa, ICON.houses], v: VAL(t, t0 - .1, .1, .82),
    extra: (ctx, t) => { // lights going on in a row of little houses as the needle sweeps
      const v = lin(t0 + .1, t0 + 1.5, t);
      for (let i = 0; i < 12; i++) { const x = 300 + i * 120, on = sm(clamp(v * 13 - i)); ICON.houses(ctx, x, 110, 16); if (on > 0) addGlow(ctx, x, 105, 50, .7 * on, P.amber, '#fff3dd'); }
    },
  });
};
// ---------- 72: dial 3, questions: ad click, stock chart, heart, world ----------
const dialQuest = (T) => {
  const t0 = T.S('07a', 'And what we'), tFirst = T.S('07a', 'first place');
  return (ctx, t, s) => dialClose(ctx, t, s, {
    label: 'questions', sub: 'what we ask them to work on', icons: [ICON.click, ICON.stock, ICON.heart, ICON.globe],
    // needle hovers, then settles in between: the choice is not made for you
    v: mix(.15, .55 + .25 * Math.sin((t - t0) * 1.3), eio(lin(t0 - .1, t0 + 1.2, t))) * (1 - .0 * lin(tFirst, tFirst + 1, t)),
  });
};

// ---------- 73: wide; you in front of the gate, the road behind splits in two; your hand rises and pauses. Silence. ----------
const wide = (T) => {
  const t0 = T.S('07a', 'What would'), tEnd = T.seg('07a').end;
  return (ctx, t, s) => {
    // slow push toward the fork point; at the very end the fork sits exactly at screen centre
    const u = eio(lin(s.a, T.seg('08a').start, t)), z = mix(1, 1.35, u), fx = FORK.x, fy = FORK.y;
    const sy = mix(FORK.y, 540, u);
    ctx.save(); ctx.translate(960, sy); ctx.scale(z, z); ctx.translate(-fx, -fy);
    forkWorld(ctx, t);
    // the gate opens wider again as the camera looks through it
    gate(ctx, t, { shut: mix(.62, .3, eio(lin(t0 - .8, tEnd + 1.5, t))), vals: [.7, .8, .45 + .05 * Math.sin(t)] });
    ctx.fillStyle = '#0d1033'; ctx.fillRect(-300, G.by, W + 600, 600);
    grass(ctx, t, -200, W + 200, () => G.by + 4, { n: 160, col: '#1b2058', h: 24, seed: 21 });
    // you, standing on the road before the gate; the hand rises toward the dials, then stops
    const raise = eio(lin(t0, t0 + 1.4, t)), hold = 1 + .03 * Math.sin(t * 2);
    const armFn = (c, sh) => { const a = mix(.1, -2.25, raise) * hold; c.strokeStyle = '#c8661e'; c.lineWidth = 5.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(3, sh + 5); c.lineTo(3 + Math.sin(-a) * 28, sh + 5 + Math.cos(a) * 28); c.stroke(); };
    person(ctx, G.cx - 260, G.by + 120, 240, t, { coat: P.amber, arm: armFn });   // off to the left so the fork stays visible
    ctx.restore();
    finish(ctx, t, { vig: .55 });
  };
};

export default function (T) {
  const S = (p) => T.S('07a', p);
  const p1 = toL2(DIALS[0]);
  return [
    { t: S('So pause') - .7, draw: yourCall(T), tr: 'black', d: 1.6 },
    { t: S('The geniuses') - .25, draw: threeDials(T), tr: 'zoom', d: 1.0, x: G.cx, y: LINTEL_Y + 40, depth: 2.6 },
    { t: S('How fast') - .25, draw: dialTest(T), tr: 'zoom', d: .9, x: p1.x, y: p1.y, depth: 3 },
    { t: S('Who gets') - .2, draw: dialAccess(T), tr: 'left', d: .8 },
    { t: S('And what we') - .2, draw: dialQuest(T), tr: 'left', d: .8 },
    { t: S('What would') - .55, draw: wide(T), tr: 'out', d: 1.1, x: DIALS[2].x, y: DIALS[2].y, depth: 6 },
  ];
}
