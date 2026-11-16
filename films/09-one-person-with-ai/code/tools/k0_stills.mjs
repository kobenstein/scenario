#!/usr/bin/env node
// Render the six K0 reference stills of Film 6 (the kit in use: lib/f6_kit.mjs) through the film finish, and time each frame.
//   node tools/k0_stills.mjs [outDir] [--png] [names…]     default outDir: /mnt/project-files/scenario/film-06-mind/stills/k0 (jpg unless --png)
// Each scene below is a pure draw(ctx, t): read them as usage examples for the kit (the night room, the ember in a chest with the witness,
// the pane turn with the split, the mirror of mind, a clip pane with its lower third, the cool line writing on paper).
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { W, H, rgba, clamp, lin, sm, eout, prng, drift, canvas, text, addGlow } from '../engine.mjs';
import { filmFinish, fibreFill } from '../lib/print.mjs';
import { stipple, vnoise } from '../lib/art.mjs';
import { figure, POSES } from '../lib/figure.mjs';
import { paperSheet, inkStroke, pen } from '../lib/paper.mjs';
import { prepareClips } from '../lib/kit.mjs';
import { F6, layer, ready, once, pane, coolText, coolLine, splitLight, ember, witness, clouds, nightRoom, clipPane, lowerThird, mirrorOfMind, letterpress, view } from '../lib/f6_kit.mjs';

const args = process.argv.slice(2), png = args.includes('--png'), rest = args.filter((a) => a !== '--png');
const out = rest[0] || '/mnt/project-files/scenario/film-06-mind/stills/k0', only = rest.slice(1);
fs.mkdirSync(out, { recursive: true });
const TAU = Math.PI * 2;
// a stand-in timing for the clip still (the film's T comes from audio/timing.json): clip C6 plays from 0 to 6.73 s
const T6 = { clip: (id) => (id === 'C6' ? { id, start: 0, end: 6.73 } : null), clips: { C6: { id: 'C6', start: 0, end: 6.73 } } };

// ---------- 1 · the night room: you at the desk, the answer builds on the laptop's pane (1.03) ----------
export function stillRoom(ctx, t) {
  nightRoom(ctx, t, { cam: { x: 985, y: 560, z: 1.12 }, answer: { t0: -2.6, lines: 7, accent: [{ i: 1, at: t - .1, d: .4 }] }, typing: true });
}

// ---------- 2 · the ember breathing in a chest, the witness point above (6.02 / 5.03) ----------
function bodyGround() {
  return layer('still-body', W, H, (g, c) => {
    const bg = g.createRadialGradient(900, 520, 0, 900, 520, 1300); bg.addColorStop(0, '#2a1a1e'); bg.addColorStop(.5, '#160f14'); bg.addColorStop(1, '#0a0709'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.fillStyle = '#0c080a'; g.fillRect(0, 880, W, 200); g.fillStyle = 'rgba(255,180,130,.08)'; g.fillRect(0, 878, W, 2);
    g.beginPath(); g.rect(0, 0, W, H); fibreFill(g, .06); stipple(c, { k: .25, g: 1, seed: 3, mid: false, boost: 1 });
  });
}
export function stillEmber(ctx, t) {
  ctx.drawImage(bodyGround(), 0, 0);
  const S = 3.1, hx = 980 + drift(t, 3, 1), hy = 600, chest = [hx + 10 * S, hy - 44 * S];
  // the pulse line runs into the body (6.02): a flat cool line from the left, ending at the chest
  const r = prng(4), pts = []; for (let x = -40; x <= chest[0] - 40; x += 6) { const d = chest[0] - 40 - x, beat = d > 380 && d < 470 ? Math.sin((d - 380) / 90 * Math.PI) * (d < 425 ? -70 : 30) : 0; pts.push([x, chest[1] + beat]); }
  coolLine(ctx, t, { pts, u: 1, head: false, w: 1.6, glow: .9 });
  const E = ember(ctx, t, { x: chest[0], y: chest[1], kind: 'heart', r: 150, a: 1 });
  figure(ctx, hx, hy, S, { ...POSES.stand, head: .05, sh: [.3, .2], el: [.5, .45] }, { t, seed: 7, accent: '#4a3a58', dress: { pants: '#1a1420' }, light: { x: chest[0], y: chest[1], col: F6.amberCore, a: .75 }, rim: rgba(F6.amber, .85), rimSide: 1, cast: { x: chest[0] + 300, y: 100, a: .3 } });
  // the ember shows through the coat: warmth over the chest, goose-bump stipple on the arms (6.03)
  ember(ctx, t, { x: chest[0], y: chest[1], kind: 'heart', r: 95, a: .9 });
  ctx.save(); ctx.translate(hx, 884); ctx.scale(1, .2); const fl = ctx.createRadialGradient(0, 0, 0, 0, 0, 420); fl.addColorStop(0, rgba(F6.amber, .16)); fl.addColorStop(1, rgba(F6.amber, 0)); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = fl; ctx.beginPath(); ctx.arc(0, 0, 420, 0, TAU); ctx.fill(); ctx.restore();
  witness(ctx, t, { x: hx + 2 * S, y: hy - 138 * S, r: 5, halo: 120, a: 1 });
  const vg = ctx.createRadialGradient(hx, 560, 320, hx, 560, 1200); vg.addColorStop(0, 'rgba(8,5,7,0)'); vg.addColorStop(1, 'rgba(8,5,7,.6)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
}

// ---------- 3 · the pane turn (reflection → view through) with the split: cool line and ember (12.06 + 3.01) ----------
function slateGround() {
  return layer('still-slate', W, H, (g, c) => {
    const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0d1222'); bg.addColorStop(.6, F6.slate); bg.addColorStop(1, '#0b0e1a'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.fillStyle = '#0a0d18'; g.fillRect(0, 900, W, 180); g.fillStyle = 'rgba(190,210,240,.12)'; g.fillRect(0, 898, W, 2);
    g.beginPath(); g.rect(0, 0, W, H); fibreFill(g, .05); stipple(c, { k: .25, g: 1, seed: 5, mid: false, boost: 1 });
  });
}
export function stillTurn(ctx, t, o = {}) {
  ctx.drawImage(slateGround(), 0, 0);
  // the pane turn (12.06): as it tilts, the reflection goes dark first, then the glass opens on the view through; never both at once
  const u = o.u ?? .74, yaw = -.42 + .5 * u, PX = 700, PY = 440, PW = 640, PH = 470;
  const P = pane(ctx, t, { x: PX, y: PY, w: PW, h: PH, yaw, frame: 'mirror', edge: .9, reflectA: 1 - sm(lin(.25, .5, u)), throughA: sm(lin(.5, .8, u)), reflectDim: .2,
    through: (g) => { const bg = g.createRadialGradient(60, -40, 0, 60, -40, 520); bg.addColorStop(0, '#5a4030'); bg.addColorStop(1, '#1a1216'); g.fillStyle = bg; g.fillRect(-PW / 2, -PH / 2, PW, PH); ember(g, t, { x: 150, y: -120, kind: 'bulb', s: .9, r: 170 }); figure(g, 40, 120, 1.5, { ...POSES.look, head: -.1 }, { t, seed: 2, accent: '#b06a3c', light: { x: 150, y: -120, col: F6.amberCore, a: .7 }, rim: rgba(F6.amberCore, .8), rimSide: 1, flip: true }); },
    reflect: (g) => { const bg = g.createLinearGradient(0, -PH / 2, 0, PH / 2); bg.addColorStop(0, '#202840'); bg.addColorStop(1, '#0d1020'); g.fillStyle = bg; g.fillRect(-PW / 2, -PH / 2, PW, PH); figure(g, -70, 130, 1.5, { ...POSES.stand, head: .06 }, { t, seed: 1, accent: '#3c5a8a', light: { x: 300, y: -200, col: F6.cool, a: .5 }, rim: rgba(F6.cool, .75), rimSide: 1 }); } });
  // you, before the pane (dark, from behind at figure scale)
  figure(ctx, 300, 700, 2.1, { ...POSES.stand, head: .06 }, { t, seed: 1, accent: '#3c5a8a', light: { x: PX, y: PY, col: F6.cool, a: .5 }, rim: rgba(F6.cool, .8), rimSide: 1, flip: false });
  // the split, right of the pane: the ember has risen from the cool line
  splitLight(ctx, t, { x: 1430, y: 760, len: 760, u: o.split ?? 1, rise: 200, emberR: 130 });
  const vg = ctx.createRadialGradient(900, 500, 380, 900, 500, 1250); vg.addColorStop(0, 'rgba(6,8,18,0)'); vg.addColorStop(1, 'rgba(6,8,18,.55)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
}

// ---------- 4 · the mirror of the mind, thoughts drifting across it, awareness looking in (5.01–5.03) ----------
function dawnGround() {
  return layer('still-dawn', W, H, (g, c) => {
    const bg = g.createLinearGradient(0, 0, W, H * .6); bg.addColorStop(0, '#3a3230'); bg.addColorStop(.5, '#1f1b22'); bg.addColorStop(1, '#141218'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    const wl = g.createRadialGradient(120, 200, 0, 120, 200, 1500); wl.addColorStop(0, 'rgba(241,217,168,.42)'); wl.addColorStop(.4, 'rgba(241,217,168,.1)'); wl.addColorStop(1, 'rgba(241,217,168,0)'); g.fillStyle = wl; g.fillRect(0, 0, W, H);
    g.fillStyle = '#17141a'; g.fillRect(0, 900, W, 180); g.fillStyle = 'rgba(241,217,168,.16)'; g.fillRect(0, 898, W, 2);
    g.beginPath(); g.rect(0, 0, W, H); fibreFill(g, .06); stipple(c, { k: .3, g: 1, seed: 6, mid: false, boost: 1 });
  });
}
export function stillMirror(ctx, t) {
  ctx.drawImage(dawnGround(), 0, 0);
  const MX = 1180, MY = 500, MW = 470, MH = 720, FX = 520, FY = 760;
  // the low wooden bench the figure sits on (hip height), then the seated figure (POSES.sit), lit by the morning window on the left
  const bench = (g, x, y, s) => { g.fillStyle = 'rgba(4,4,10,.45)'; g.beginPath(); g.ellipse(x - 8 * s, y + 92 * s, 60 * s, 10 * s, 0, 0, TAU); g.fill(); g.fillStyle = '#3a2c22'; g.fillRect(x - 46 * s, y + 4 * s, 70 * s, 9 * s); g.fillStyle = '#241a14'; g.fillRect(x - 40 * s, y + 13 * s, 8 * s, 78 * s); g.fillRect(x + 14 * s, y + 13 * s, 8 * s, 78 * s); g.fillStyle = 'rgba(241,217,168,.35)'; g.fillRect(x - 46 * s, y + 4 * s, 70 * s, 1.5 * s); };
  // the light is the morning window far left of the room: in the mirror's local coords (pre-mirror) that is far to the left too
  const seated = (g, x, y, s, flip, lx = 120, ly = 200) => { bench(g, x, y, s); figure(g, x, y, s, { ...POSES.sit, head: .08, sh: [.5, .42], el: [.95, 1] }, { t, seed: 4, accent: '#8a5a3a', dress: { pants: '#2a2128' }, light: { x: lx, y: ly, col: '#f1d9a8', a: .55 }, rim: rgba('#f1d9a8', .8), rimSide: -1, flip, shadow: false }); };
  // thoughts above the seated figure, drifting toward the mirror
  clouds(ctx, t, { x: 260, y: 110, w: 720, h: 200, n: 4, a: .55, seed: 2, speed: 12, s: .85 });
  ember(ctx, t, { x: 760, y: 905, kind: 'candle', s: .75, r: 190 });
  mirrorOfMind(ctx, t, { x: MX, y: MY, w: MW, h: MH, clouds: { n: 3, a: .5, speed: 12, seed: 5, s: .75 },
    reflect: (g) => { const bg = g.createLinearGradient(0, -MH / 2, 0, MH / 2); bg.addColorStop(0, '#2a2622'); bg.addColorStop(.75, '#1c181d'); bg.addColorStop(1, '#0f0d12'); g.fillStyle = bg; g.fillRect(-MW / 2, -MH / 2, MW, MH); const wl = g.createRadialGradient(-220, -300, 0, -220, -300, 700); wl.addColorStop(0, 'rgba(241,217,168,.35)'); wl.addColorStop(1, 'rgba(241,217,168,0)'); g.fillStyle = wl; g.fillRect(-MW / 2, -MH / 2, MW, MH); g.fillStyle = '#17141a'; g.fillRect(-MW / 2, 318, MW, 100); seated(g, 40, 200, 1.35, false, -1000, -300); witness(g, t, { x: 40, y: 200 - 118 * 1.35, r: 4, halo: 80 }); } });
  seated(ctx, FX, FY, 2.3, false);
  witness(ctx, t, { x: FX + 4, y: FY - 118 * 2.3, r: 5, halo: 120 });
  const vg = ctx.createRadialGradient(900, 500, 380, 900, 500, 1250); vg.addColorStop(0, 'rgba(10,8,10,0)'); vg.addColorStop(1, 'rgba(10,8,10,.5)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
}

// ---------- 5 · a clip plays on a pane (7.03 Hinton, C6) with its lower third ----------
function labGround() {
  return layer('still-lab', W, H, (g, c) => {
    const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0a0d1a'); bg.addColorStop(.7, '#111624'); bg.addColorStop(1, '#0a0c16'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.fillStyle = '#141020'; g.beginPath(); g.moveTo(0, 840); g.lineTo(W, 840); g.lineTo(W, H); g.lineTo(0, H); g.fill(); g.fillStyle = 'rgba(200,210,240,.1)'; g.fillRect(0, 838, W, 2);
    g.beginPath(); g.rect(0, 0, W, H); fibreFill(g, .05); stipple(c, { k: .25, g: 1, seed: 8, mid: false, boost: 1 });
  });
}
export function stillClip(ctx, t) {
  ctx.drawImage(labGround(), 0, 0);
  const x = 300, y = 120, w = 1180, h = 664;
  ember(ctx, t, { x: 1690, y: 835, kind: 'lamp', s: .9, dir: -.7, a: .85 });
  ctx.save(); ctx.translate(x + w / 2, y + h + 30); ctx.scale(1, .22); const fg = ctx.createRadialGradient(0, 0, 0, 0, 0, 700); fg.addColorStop(0, 'rgba(200,220,245,.18)'); fg.addColorStop(1, 'rgba(200,220,245,0)'); ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(0, 0, 700, 0, TAU); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#0c0f1c'; ctx.beginPath(); ctx.roundRect(x + w / 2 - 70, y + h + 14, 140, 20, 6); ctx.fill(); ctx.fillStyle = '#141a2c'; ctx.fillRect(x + w / 2 - 160, y + h + 30, 320, 8);   // the stand
  clipPane(ctx, t, T6, 'C6', x, y, w, h, { frame: 'thin' });
  lowerThird(ctx, t, T6, 'C6', { y: 850 });
}

// ---------- 6 · the cool line writes a sentence on paper (11.13: "Help them, honestly.") ----------
export function stillPaper(ctx, t, o = {}) {
  const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0d0b12'); bg.addColorStop(1, '#1a1512'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const lamp = ember(ctx, t, { x: 1560, y: 60, kind: 'glow', r: 520, a: .9 });
  const Sx = 330, Sy = 150, Sw = 1280, Sh = 760, rot = -.018;
  const sheet = paperSheet(ctx, Sx, Sy, Sw, Sh, { rot, seed: 9, light: [1500, 60], lift: 6, lines: 0, content: (g, w, h) => {
    // what was written in ink before: 'feel what they feel', struck through (11.13)
    text(g, 'care =', 120, 160, { size: 30, weight: 600, color: rgba(F6.ink, .55), spacing: 8 });
    text(g, 'feel what they feel', 120, 290, { size: 86, font: 'Instrument Serif', color: rgba(F6.ink, .9) });
    g.font = '86px "Instrument Serif"'; const tw = g.measureText('feel what they feel').width;
    inkStroke(g, Array.from({ length: 40 }, (_, i) => [112 + (tw + 16) * i / 39, 262 + Math.sin(i * .9) * 2.5 - i * .15]), 1, { w: 6, ink: '#8e2f2a', seed: 4 });
    // a margin note in ink (the "because" notes of §7)
    text(g, 'because', 120, 560, { size: 22, weight: 500, color: rgba('#8e2f2a', .8), spacing: 3 });
    g.strokeStyle = rgba(F6.ink, .18); g.lineWidth = 1; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(120, 600 + i * 34); g.lineTo(120 + (i === 3 ? 320 : 520), 600 + i * 34); g.stroke(); }
    // the paper darkens under the lamp's falloff, so the cool line reads as light on it
    const sh = g.createLinearGradient(0, 0, w, h); sh.addColorStop(0, 'rgba(40,30,20,.5)'); sh.addColorStop(.5, 'rgba(40,30,20,.18)'); sh.addColorStop(1, 'rgba(40,30,20,0)'); g.fillStyle = sh; g.fillRect(0, 0, w, h);
  } });
  // the cool line comes in from the left and writes the honest sentence under the struck one
  ctx.save(); ctx.translate(Sx, Sy); ctx.rotate(rot);
  coolLine(ctx, t, { write: { text: 'Help them, honestly.', x: 120, y: 450, size: 96, lead: 400, lag: 70, fill: 1, outline: 1 }, u: o.u ?? .64, w: 1.8, glow: 1.2, col: '#7fb8e8', core: '#f4fbff' });
  ctx.restore();
  pen(ctx, 1330, 800, 1.05, { ang: -2.3, lift: .3, t });
  const vg = ctx.createRadialGradient(960, 520, 400, 960, 520, 1300); vg.addColorStop(0, 'rgba(8,6,8,0)'); vg.addColorStop(1, 'rgba(8,6,8,.55)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
}

const JOBS = [
  ['k0-1-night-room', stillRoom, 4.2, { riso: .3 }],
  ['k0-2-ember-witness', stillEmber, 2.0, { riso: .25 }],
  ['k0-3-pane-turn-split', stillTurn, 2.0, { riso: .3 }],
  ['k0-4-mirror-of-mind', stillMirror, 3.0, { riso: .25 }],
  ['k0-5-clip-pane', stillClip, 3.0, { riso: .25 }],
  ['k0-6-cool-line-paper', stillPaper, 2.0, { riso: .25 }],
];
const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;   // importing this module (for its scene fns) renders nothing
const [cv, ctx] = canvas();
if (isMain) for (const [name, draw, t, fin = {}] of JOBS) {
  if (only.length && !only.some((o) => name.includes(o))) continue;
  const run = (tt) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#070918'; ctx.fillRect(0, 0, W, H); draw(ctx, tt); ctx.restore(); filmFinish(ctx, tt, fin); cv.data(); };
  await prepareClips(T6, t);
  let t0 = performance.now(); run(t - .5); const first = performance.now() - t0; await ready();
  t0 = performance.now(); for (let i = 0; i < 3; i++) run(t - .1 * (3 - i)); const ms = (performance.now() - t0) / 3;
  run(t);
  const f = path.join(out, name + (png ? '.png' : '.jpg')); fs.writeFileSync(f, png ? await cv.encode('png') : await cv.encode('jpeg', 92));
  console.log(`${f}  first ${first.toFixed(0)} ms, then ${ms.toFixed(0)} ms/frame`);
}
