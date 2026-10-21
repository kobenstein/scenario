// Film 6 · c12 · the lab at night (12.01–12.11): a long bench with dark screens, a whiteboard, pinned sheets; the big pane on its stand is the
// one hero light (the clip, the flattering mirror, the clear glass, the honest answer); a researcher stands beside it. One world, three
// parallax planes (far wall .85 · bench 1 · you 1.05 · motes 1.2) under one camera path.
// Copied (named in the report): clipPane → clipPane12 (from lib/f6_c08_hall.mjs clipPane8: ramped haze and band lines, first/last frame
// fallback, plus dark:false so the pane's ground is the scaled glass plate), closingLight → closingLight12 (lib/f6_c08_hall.mjs, wider ring),
// commentCard/cardLayer → commentCard12 (lib/f6_c02_world.mjs, static count), camPath/quart/expo (lib/f6_c02_world.mjs).
import { W, H, rgba, clamp, lin, mix, sm, eout, prng, canvas, text, addGlow, hatch } from '../engine.mjs';
import { F6, once, layer, pane, coolLine, pending } from './f6_kit.mjs';
import { clipFrame, ROOT } from './kit.mjs';
import { fibreFill } from './print.mjs';
import { stipple } from './art.mjs';
import { paperSheet, scribble } from './paper.mjs';
import { figure, POSES } from './figure.mjs';
import { loadImage } from '@napi-rs/canvas';

const TAU = Math.PI * 2;
export const quartIO = (u) => { u = clamp(u); return u < .5 ? 8 * u * u * u * u : 1 - 8 * Math.pow(1 - u, 4); };
export const expoOut = (u) => { u = clamp(u); return u >= 1 ? 1 : 1 - Math.pow(2, -10 * u); };
export const expoIn = (u) => { u = clamp(u); return u <= 0 ? 0 : Math.pow(2, 10 * (u - 1)); };
// a camera path over keys [{ t, x, y, z }]: quart in-out between consecutive keys (repeat a key to hold)
export function camPath(keys, t) {
  if (t <= keys[0].t) return { x: keys[0].x, y: keys[0].y, z: keys[0].z };
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (t <= b.t) { const q = (t - a.t) / Math.max(1e-6, b.t - a.t), u = b.ease === 'sine' ? -(Math.cos(Math.PI * clamp(q)) - 1) / 2 : quartIO(q); return { x: mix(a.x, b.x, u), y: mix(a.y, b.y, u), z: mix(a.z, b.z, u) }; }
  }
  const L = keys[keys.length - 1]; return { x: L.x, y: L.y, z: L.z };
}

// ---------------------------------------------------------------- the world (coordinates at camera z 1)
export const PANE = { x: 820, y: 440, w: 1180, h: 1180 * H / W, radius: 0 };     // the big pane on its stand; fills the frame exactly at z = ZFILL
export const ZFILL = W / PANE.w;
export const FIG = { x: 1480, feet: 905, s: 1.9, seed: 12 };                        // the researcher, standing in front of the bench, facing the pane
export const BENCH = { far: 740, top: 800, front: 830, bottom: 905 };   // far edge of the top face, its near edge, the front face
export const CARDP = { x: 290, y: 140 };                                           // where the comment card hangs (figure plane)
// the other screens (the companies): on the bench (plane 1) and on the far wall (plane .85); each switches on with the honest line at the end
export const SMALL = [
  { x: -80, y: 640, w: 440, h: 247.5, plane: 1, seed: 41, stand: true },
  { x: 2020, y: 640, w: 440, h: 247.5, plane: 1, seed: 42, stand: true },
  { x: 1600, y: 330, w: 380, h: 213.75, plane: .85, seed: 44 },
  { x: 2080, y: 330, w: 380, h: 213.75, plane: .85, seed: 45 },
];

// ---------------------------------------------------------------- the far wall (plane .85): indigo plaster, the whiteboard, pinned sheets, a shelf line
export const WALL_BOX = [-1000, -200, 4000, 1500];
export function farWall() {
  return layer('c12-wall', WALL_BOX[2], WALL_BOX[3], (g, c) => {
    const [ox, oy, w, h] = WALL_BOX; g.translate(-ox, -oy);
    const bg = g.createLinearGradient(0, -200, 0, 1300); bg.addColorStop(0, '#070b1c'); bg.addColorStop(.5, F6.night); bg.addColorStop(1, '#070a18'); g.fillStyle = bg; g.fillRect(ox, oy, w, h);
    g.beginPath(); g.rect(ox, oy, w, h); fibreFill(g, .05);
    hatch(g, null, -.85, 7, .035, { box: [ox, oy, w, h], col: '#000000', w: .8, wobble: .6 });
    // a faint pool of the big screen's light on the wall behind it (static; the living part is added per frame)
    const pg = g.createRadialGradient(PANE.x, PANE.y, 0, PANE.x, PANE.y, 900); pg.addColorStop(0, 'rgba(60,80,130,.16)'); pg.addColorStop(1, 'rgba(60,80,130,0)'); g.fillStyle = pg; g.fillRect(ox, oy, w, h);
    // the whiteboard (left): a pale slate board in an aluminium frame, a tray, unreadable notes and two boxes with an arrow
    g.save(); g.translate(-440, 150);
    g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(8, 10, 560, 400);
    g.fillStyle = '#5c6478'; g.fillRect(-6, -6, 572, 412);
    const wb = g.createLinearGradient(0, 0, 560, 400); wb.addColorStop(0, '#3f475c'); wb.addColorStop(1, '#2c3346'); g.fillStyle = wb; g.fillRect(0, 0, 560, 400);
    g.beginPath(); g.rect(0, 0, 560, 400); fibreFill(g, .12);
    g.fillStyle = '#4a5266'; g.fillRect(40, 404, 480, 10);
    for (let i = 0; i < 5; i++) scribble(g, 40, 70 + i * 34, 240 + (i % 2) * 60, 16, { seed: 60 + i, ink: '#141a2c', lw: 2 });
    g.strokeStyle = '#161c30'; g.lineWidth = 2.4; g.lineJoin = 'round';
    g.strokeRect(340, 90, 150, 70); g.strokeRect(340, 250, 150, 70);
    g.beginPath(); g.moveTo(415, 160); g.lineTo(415, 244); g.moveTo(405, 230); g.lineTo(415, 246); g.lineTo(425, 230); g.stroke();
    scribble(g, 350, 130, 120, 14, { seed: 71, ink: '#161c30', lw: 2 }); scribble(g, 350, 290, 110, 14, { seed: 72, ink: '#161c30', lw: 2 });
    g.beginPath(); g.arc(300, 330, 26, 0, TAU); g.stroke();
    g.restore();
    // a shelf line and pinned sheets behind the big pane (seen only through the clear glass)
    g.fillStyle = '#1a2036'; g.fillRect(300, 150, 1000, 8); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(300, 158, 1000, 16);
    for (const [px, py, rot, sd] of [[460, 200, -.04, 81], [590, 215, .05, 82], [1000, 190, -.06, 83], [1120, 220, .03, 84]]) {
      g.save(); g.translate(px, py); g.rotate(rot); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(5, 6, 92, 120); g.fillStyle = '#a69d88'; g.fillRect(0, 0, 92, 120);
      g.beginPath(); g.rect(0, 0, 92, 120); fibreFill(g, .3);
      for (let i = 0; i < 6; i++) scribble(g, 10, 22 + i * 16, 64 - (i % 3) * 10, 7, { seed: sd * 3 + i, ink: '#3a3426', lw: 1.1 });
      g.fillStyle = '#6a3a3a'; g.beginPath(); g.arc(46, 6, 3, 0, TAU); g.fill(); g.restore();
    }
    // a skirting line and the floor
    g.fillStyle = '#05060f'; g.fillRect(ox, 880, w, h); g.fillStyle = 'rgba(120,130,170,.1)'; g.fillRect(ox, 878, w, 2);
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .2, g: 1, seed: 12, mid: false, boost: 1 });   // stipple honours the transform: reset first
  });
}

// ---------------------------------------------------------------- the bench (plane 1): a long dark slab, papers, a notebook, a pen, the stands
export const BENCH_BOX = [-1000, 700, 4000, 380];
export function bench() {
  return layer('c12-bench', BENCH_BOX[2], BENCH_BOX[3], (g, c) => {
    const [ox, oy, w] = BENCH_BOX; g.translate(-ox, -oy);
    // top face (lit faintly by the screens), the front face in shadow with intaglio hatching
    const tg = g.createLinearGradient(0, BENCH.far, 0, BENCH.front); tg.addColorStop(0, '#1a2036'); tg.addColorStop(.7, '#232a44'); tg.addColorStop(1, '#1c2238'); g.fillStyle = tg; g.fillRect(ox, BENCH.far, w, BENCH.front - BENCH.far);
    g.fillStyle = 'rgba(190,220,255,.1)'; g.fillRect(ox, BENCH.far, w, 2); g.fillStyle = 'rgba(190,220,255,.18)'; g.fillRect(ox, BENCH.front - 2, w, 2);
    const fg = g.createLinearGradient(0, BENCH.front, 0, BENCH.bottom); fg.addColorStop(0, '#111628'); fg.addColorStop(1, '#090c18'); g.fillStyle = fg; g.fillRect(ox, BENCH.front, w, BENCH.bottom - BENCH.front);
    hatch(g, null, -.7, 6, .25, { box: [ox, BENCH.front, w, BENCH.bottom - BENCH.front], col: '#000000', w: .9, wobble: .8 });
    g.fillStyle = '#05060f'; g.fillRect(ox, BENCH.bottom, w, 400);
    g.beginPath(); g.rect(ox, BENCH.far, w, BENCH.bottom - BENCH.far); fibreFill(g, .08);
    // papers, a notebook, a pen
    // papers lying on the top face (seen from slightly above: squashed), a closed notebook, a pen
    const SQ = .42;
    for (const [px, py, rot, sw, sh, sd] of [[300, 780, -.1, 170, 110, 5], [540, 790, .07, 150, 96, 6], [1230, 782, -.05, 160, 104, 7], [1680, 786, .12, 140, 92, 8], [2400, 780, -.08, 170, 110, 9], [-420, 786, .05, 150, 96, 10]]) {
      g.save(); g.translate(px, py); g.scale(1, SQ); g.rotate(rot); g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(-sw / 2 + 4, -sh / 2 + 8, sw, sh); g.fillStyle = '#cfc4a8'; g.fillRect(-sw / 2, -sh / 2, sw, sh);
      g.beginPath(); g.rect(-sw / 2, -sh / 2, sw, sh); fibreFill(g, .3);
      for (let i = 0; i < 4; i++) scribble(g, -sw / 2 + 14, -sh / 2 + 26 + i * 18, sw - 44 - (i % 2) * 20, 8, { seed: sd * 5 + i, ink: '#3a3426', lw: 1.3 });
      g.restore();
    }
    g.save(); g.translate(1000, 782); g.scale(1, SQ); g.rotate(.04); g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(-106, -66, 220, 150); g.fillStyle = '#1e2438'; g.fillRect(-110, -70, 220, 140); g.fillStyle = '#2a3150'; g.fillRect(-110, -70, 14, 140); g.restore();
    g.save(); g.translate(1000, 775); g.scale(1, SQ); g.fillStyle = '#242b44'; g.fillRect(-110, -70, 220, 8); g.restore();   // the notebook's thickness
    g.save(); g.translate(1160, 792); g.scale(1, SQ); g.rotate(-.5); g.fillStyle = '#1d1a24'; g.fillRect(-60, -4, 120, 8); g.fillStyle = '#c9a45a'; g.fillRect(44, -3, 14, 6); g.restore();
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .25, g: 1, seed: 13, mid: false, boost: 1 });
  });
}
// the stand of a screen on the bench: a short neck and a heavy base (drawn before the pane)
export function stand(g, x, yBottom, s = 1) {
  g.fillStyle = 'rgba(3,3,10,.5)'; g.beginPath(); g.ellipse(x + 6 * s, BENCH.top - 2, 150 * s, 16 * s, 0, 0, TAU); g.fill();
  const bg = g.createLinearGradient(x - 140 * s, 0, x + 140 * s, 0); bg.addColorStop(0, '#2a3148'); bg.addColorStop(.5, '#151a2c'); bg.addColorStop(1, '#0d1020');
  g.fillStyle = bg; g.beginPath(); g.ellipse(x, BENCH.top - 8, 150 * s, 14 * s, 0, 0, TAU); g.fill();
  g.fillStyle = '#1b2033'; g.fillRect(x - 26 * s, yBottom - 2, 52 * s, BENCH.top - 8 - yBottom + 2);
  g.fillStyle = 'rgba(190,220,255,.1)'; g.fillRect(x - 26 * s, yBottom - 2, 2, BENCH.top - 8 - yBottom + 2);
}

// ---------------------------------------------------------------- a strip of cool haze over the bench and floor (cached; drawn twice per frame with slow drifts)
export const FOG_W = 2600, FOG_H = 360;
export function fogStrip() {
  return layer('c12-fog', FOG_W, FOG_H, (g, c) => {
    const r = prng(91);
    for (let i = 0; i < 26; i++) { const x = r() * FOG_W, y = FOG_H * (.35 + r() * .5), rx = 220 + r() * 360, ry = 40 + r() * 70; const fg = g.createRadialGradient(x, y, 0, x, y, rx); fg.addColorStop(0, `rgba(150,180,230,${.12 + r() * .1})`); fg.addColorStop(1, 'rgba(150,180,230,0)'); g.fillStyle = fg; g.save(); g.translate(x, y); g.scale(1, ry / rx); g.beginPath(); g.arc(0, 0, rx, 0, TAU); g.fill(); g.restore(); }
    const fade = g.createLinearGradient(0, 0, 0, FOG_H); fade.addColorStop(0, 'rgba(0,0,0,1)'); fade.addColorStop(.3, 'rgba(0,0,0,0)'); fade.addColorStop(.9, 'rgba(0,0,0,0)'); fade.addColorStop(1, 'rgba(0,0,0,1)'); g.globalCompositeOperation = 'destination-out'; g.fillStyle = fade; g.fillRect(0, 0, FOG_W, FOG_H); g.globalCompositeOperation = 'source-over';
    stipple(c, { k: .5, g: 1.2, seed: 92, boost: 2 });
  });
}
export function fog(g, t, o = {}) {
  const F = fogStrip(), a = o.a ?? .5, y = o.y ?? 760;
  g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = a * .5; g.drawImage(F, -1200 + ((t * 7) % 400), y, FOG_W, FOG_H); g.globalAlpha = a * .4; g.drawImage(F, -1500 + ((t * 11) % 600), y + 40 + 6 * Math.sin(t * .3), FOG_W * 1.15, FOG_H * .9); g.restore();
}

// ---------------------------------------------------------------- the researcher (plane 1.05): standing, turned to the pane, alive
export function researcher(g, t, o = {}) {
  const pose = { ...POSES.stand, sh: [.22, .14], el: [.42, .36], head: .04 + (o.head || 0), lean: .015, turn: o.turn ?? 0, smile: o.smile ?? 0, gaze: o.gaze ?? .05 };
  return figure(g, o.x ?? FIG.x, o.y ?? FIG.feet - 88 * FIG.s, o.s ?? FIG.s, pose, { t, seed: FIG.seed, shadow: o.shadow, accent: '#2c4470', dress: { pants: '#13122a', coat: '#263050' }, flip: true,
    light: { x: o.lx ?? PANE.x, y: o.ly ?? PANE.y, col: o.col || F6.cool, a: o.la ?? .3 }, rim: o.rim || rgba(F6.cool, .55), rimSide: o.rimSide ?? -1, cast: o.cast === false ? undefined : { x: PANE.x, y: PANE.y - 100, a: .18 * (o.la ?? .3) } });
}

// ---------------------------------------------------------------- the painted-on heart (10.03 returns): flat rose paint on the glass, brushed in one stroke, wiped by the cool line
//   paintedHeart(g, x, y, s, { u (stroke progress 0..1), wipeX (pane-local x of the wiper: paint left of it is gone), a })
export function paintedHeart(g, x, y, s, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  g.save(); g.translate(x, y); g.scale(s, s);
  if (o.wipeX != null) { g.beginPath(); g.rect((o.wipeX - x) / s, -200, 800, 400); g.clip(); }
  if (u < 1) { const a0 = -Math.PI / 2 - .35, a1 = a0 + TAU * u; g.beginPath(); g.moveTo(0, 4); g.arc(0, 4, 160, a0, a1); g.closePath(); g.clip(); }
  const heart = (q, k) => { q.beginPath(); q.moveTo(0, 70 * k); q.bezierCurveTo(-96 * k, 8 * k, -70 * k, -70 * k, -4 * k, -36 * k); q.bezierCurveTo(70 * k, -70 * k, 96 * k, 8 * k, 0, 70 * k); q.closePath(); };
  g.globalAlpha = o.a ?? 1;
  g.fillStyle = '#c9565a'; heart(g, 1.04); g.fill();                       // a darker first coat, a touch wider
  g.fillStyle = '#e86a6a'; heart(g, 1); g.fill();
  // the brush: streaks in the paint, a lighter wet highlight, one drip
  g.save(); heart(g, 1); g.clip(); g.strokeStyle = 'rgba(255,170,160,.28)'; g.lineWidth = 3; g.lineCap = 'round';
  for (let i = 0; i < 7; i++) { g.beginPath(); g.moveTo(-70 + i * 18, -40 + (i % 2) * 8); g.quadraticCurveTo(-40 + i * 18, 10, -62 + i * 20, 60); g.stroke(); }
  g.strokeStyle = 'rgba(110,30,40,.3)'; for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(-50 + i * 24, -30); g.quadraticCurveTo(-30 + i * 24, 20, -48 + i * 26, 64); g.stroke(); }
  g.restore();
  g.fillStyle = '#e86a6a'; g.beginPath(); g.moveTo(18, 54); g.quadraticCurveTo(24, 80, 20, 104); g.arc(19, 106, 5, 0, TAU); g.quadraticCurveTo(14, 80, 18, 54); g.fill();
  g.restore();
}

// ---------------------------------------------------------------- the comment card (2.02 returns briefly): cream paper with the real wording and its likes
export const CARD = { w: 600, h: 360, text: 'I tried to convince chatgpt to stop praising me. It told me how special I was for not needing external validation.' };
function cardLayer12() {
  const PAD = 30;
  return layer('c12-card', CARD.w + 2 * PAD, CARD.h + 2 * PAD, (g) => {
    paperSheet(g, PAD, PAD, CARD.w, CARD.h, { seed: 11, tone: '#efe6d2', light: [-200, -100], lift: 4, lines: 0, content: (q, w, h) => {
      const size = 34, lh = 42, x = 44, maxW = w - 88; q.font = `${size}px "Instrument Serif"`;
      const words = CARD.text.split(' '), lines = []; let cur = '';
      for (const wd of words) { const nx = cur ? cur + ' ' + wd : wd; if (cur && q.measureText(nx).width > maxW) { lines.push(cur); cur = wd; } else cur = nx; }
      if (cur) lines.push(cur);
      text(q, '“', x - 14, 62, { size: 70, font: 'Instrument Serif', color: rgba('#8e6a3a', .55) });
      lines.forEach((ln, i) => text(q, ln, x, 92 + i * lh, { size, font: 'Instrument Serif', color: rgba(F6.ink, .92) }));
      q.strokeStyle = rgba(F6.ink, .22); q.lineWidth = 1; q.beginPath(); q.moveTo(x, h - 84); q.lineTo(w - 44, h - 84); q.stroke();
      text(q, 'YOUTUBE COMMENT · MORE PERFECT UNION · 2025', x, h - 26, { size: 13, weight: 600, color: rgba(F6.ink, .55), spacing: 3 });
      const hx = 44, hy = h - 50;
      q.save(); q.translate(hx + 12, hy - 10); q.fillStyle = '#c0453a'; q.beginPath(); q.moveTo(0, 9); q.bezierCurveTo(-14, -2, -10, -14, -1, -9); q.bezierCurveTo(1, -14, 14, -2, 0, 9); q.fill(); q.restore();
      q.font = '42px "Instrument Serif"'; const str = '32,692', nw = q.measureText(str).width;
      text(q, str, hx + 36, hy, { size: 42, font: 'Instrument Serif', color: rgba(F6.ink, .95) });
      text(q, 'LIKES', hx + 36 + nw + 14, hy, { size: 13, weight: 600, color: rgba(F6.ink, .6), spacing: 3 });
      const sh = q.createLinearGradient(0, 0, w, 0); sh.addColorStop(0, 'rgba(60,45,30,0)'); sh.addColorStop(1, 'rgba(60,45,30,.22)'); q.fillStyle = sh; q.fillRect(0, 0, w, h);
    } });
  });
}
export function commentCard12(ctx, x, y) { const PAD = 30; ctx.drawImage(cardLayer12(), x - PAD, y - PAD); }

// ---------------------------------------------------------------- clip frames before the first / after the last loaded frame
const EDGE = {};
export function preloadEdgeFrames(id, kLast) {
  EDGE[id] = { first: null, last: null, kLast };
  pending(loadImage(`${ROOT}clips/${id}/f00001.jpg`).then((im) => { EDGE[id].first = im; }).catch(() => {}));
  pending(loadImage(`${ROOT}clips/${id}/f${String(kLast).padStart(5, '0')}.jpg`).then((im) => { EDGE[id].last = im; }).catch(() => {}));
}
// the clip pane (copy of clipPane8 with dark:false: the caller draws the pane's ground, here the scaled glass plate)
export function clipPane12(ctx, t, T, id, x, y, w, h, o = {}) {
  const c = T && T.clip ? T.clip(id) : null, ramp = o.ramp ?? .5;
  const on = o.on ?? (c ? sm(lin(c.start - ramp, c.start, t)) * (1 - sm(lin(c.end, c.end + ramp, t))) : 1);
  const u = c ? clamp((t - c.start) / Math.max(.01, c.end - c.start)) : 0, cx = x + w / 2, cy = y + h / 2, open = eout(on), hv = Math.max(2, h * open);
  const k = c ? Math.floor(clamp(t - c.start, 0, c.end - c.start) * 30) + 1 : 1, E = EDGE[id];
  const fr = clipFrame(id, k) || (E && c ? (t < c.start + .3 ? E.first : t > c.end - .3 ? E.last : null) : null);
  const ramp0 = clamp(on / .12);    // the haze, the band lines and the spill come up over the first .12 of the switch-on (no pop)
  pane(ctx, t, { x: cx, y: cy, w, h, rot: o.rot ?? 0, yaw: o.yaw ?? 0, radius: o.radius ?? 0, frame: o.frame || 'thin', edge: (o.edge ?? .8) * (1 - .6 * on), spill: false, seed: o.seed, dark: false, sheen: 0,
    screenA: on > 0 ? Math.max(.02, ramp0) : 0, screen: (g, pw, ph) => {
      g.save(); g.beginPath(); g.rect(0, ph / 2 - hv / 2, pw, hv); g.clip();
      if (fr) { const s = Math.max(pw / fr.width, ph / fr.height), dw = fr.width * s, dh = fr.height * s; g.drawImage(fr, (pw - dw) / 2, (ph - dh) / 2, dw, dh); }
      else { const sg = g.createRadialGradient(pw * .5, ph * .35, 0, pw * .5, ph * .35, pw * .7); sg.addColorStop(0, '#2a3a6a'); sg.addColorStop(1, '#070918'); g.fillStyle = sg; g.fillRect(0, 0, pw, ph); }
      g.globalAlpha = .05; g.fillStyle = '#000'; for (let yy = 0; yy < ph; yy += 4) g.fillRect(0, yy, pw, 1.5); g.globalAlpha = 1;
      const vg = g.createRadialGradient(pw / 2, ph / 2, Math.min(pw, ph) * .35, pw / 2, ph / 2, Math.max(pw, ph) * .72); vg.addColorStop(0, 'rgba(5,6,15,0)'); vg.addColorStop(1, rgba(F6.glassBot, o.vignette ?? .4)); g.fillStyle = vg; g.fillRect(0, 0, pw, ph);
      g.restore();
      if (on > 0 && on < .999) { const k2 = 1 - on; g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; for (const yy of [ph / 2 - hv / 2, ph / 2 + hv / 2]) { for (const [lw2, al] of [[18, .08], [6, .25], [1.6, .95]]) { g.strokeStyle = rgba(lw2 < 2 ? F6.coolCore : F6.cool, al * (.4 + .6 * k2) * ramp0); g.lineWidth = lw2; g.beginPath(); g.moveTo(-pw, yy); g.lineTo(pw * 2, yy); g.stroke(); } } g.restore(); }
    } });
  if (on <= 0) { const pre = c ? sm(lin(c.start - ramp - .4, c.start - ramp, t)) * (1 - sm(lin(c.end + ramp, c.end + ramp + .4, t))) : 0; if (pre > 0) coolLine(ctx, t, { from: [x + 8, cy], to: [x + w - 8, cy], a: pre, head: false, w: 1.4 }); }
  if (o.spill !== false && on > 0) addGlow(ctx, cx, cy, Math.max(w, h) * .9, .14 * on * ramp0, '#cfe0f0', '#eef4ff');
  return { on, u, line: [cy - hv / 2, cy + hv / 2] };
}

// ---------------------------------------------------------------- a small screen (a company): dark glass; at the end it switches on with the honest line and warms into dawn
//   smallPane(g, t, P, { on 0..1, t0 (the line starts writing), warm 0..1 })
export function smallPane(g, t, P, o = {}) {
  const on = clamp(o.on ?? 0), warm = clamp(o.warm ?? 0), ramp0 = clamp(on / .12), open = eout(on), hv = Math.max(2, P.h * open);
  pane(g, t, { x: P.x, y: P.y, w: P.w, h: P.h, radius: 3, frame: 'thin', edge: .5 * (1 - .5 * on), spill: false, seed: P.seed,
    screenA: on > 0 ? Math.max(.02, ramp0) : 0, screen: (q, pw, ph) => {
      q.save(); q.beginPath(); q.rect(0, ph / 2 - hv / 2, pw, hv); q.clip();
      if (warm > 0) { const wg = q.createRadialGradient(pw / 2, ph / 2, 0, pw / 2, ph / 2, pw * .7); wg.addColorStop(0, rgba('#fff6e2', .95 * warm)); wg.addColorStop(.5, rgba('#ffd9a0', .8 * warm)); wg.addColorStop(1, rgba('#f4a77a', .55 * warm)); q.fillStyle = wg; q.fillRect(0, 0, pw, ph); }
      const size = Math.round(P.w * .062);
      coolLine(q, t, { write: { text: 'Very probably not.', x: pw * .1, y: ph * .5 + size * .35, size, lead: pw * .3, lag: 40 }, u: lin(o.t0 ?? 0, (o.t0 ?? 0) + .55, t), glow: .6, w: 1.1, a: 1 - .7 * warm });
      q.restore();
      if (on > 0 && on < .999) { const k2 = 1 - on; q.save(); q.globalCompositeOperation = 'lighter'; q.lineCap = 'round'; for (const yy of [ph / 2 - hv / 2, ph / 2 + hv / 2]) { for (const [lw2, al] of [[14, .08], [5, .25], [1.4, .95]]) { q.strokeStyle = rgba(lw2 < 2 ? F6.coolCore : F6.cool, al * (.4 + .6 * k2) * ramp0); q.lineWidth = lw2; q.beginPath(); q.moveTo(-pw, yy); q.lineTo(pw * 2, yy); q.stroke(); } } q.restore(); }
    } });
  if (on > 0) addGlow(g, P.x, P.y, Math.max(P.w, P.h) * (1 + .6 * warm), (.14 + .22 * warm) * on * ramp0, warm > .5 ? '#ffd9a0' : '#cfe0f0', warm > .5 ? '#fff6e2' : '#eef4ff');
}

// ---------------------------------------------------------------- the dawn: the plate grows out from the big screen's edge (screen space; copy of c08 closingLight, wider ring)
//   closingLight12(ctx, t, { rect: [x, y, w, h] (the screen in screen space), u (0..1), inner (the screen itself whites out), plate })
export function closingLight12(ctx, t, o) {
  const u = clamp(o.u); if (u <= 0) return;
  const [x, y, w, h] = o.rect, cx = x + w / 2, cy = y + h / 2;
  const [pc, pg] = once('c12plate', () => canvas(W, H)), [mc, mg] = once('c12mask', () => canvas(W, H));
  const ri = mix(1.0, 4.2, u), soft = .5, inner = clamp(o.inner ?? ((u - .78) / .22));
  mg.setTransform(1, 0, 0, 1, 0, 0); mg.globalCompositeOperation = 'source-over'; mg.globalAlpha = 1; mg.clearRect(0, 0, W, H);
  mg.save(); mg.translate(cx, cy); mg.scale(w / 2 * 1.02, h / 2 * 1.02);
  const rg = mg.createRadialGradient(0, 0, 0, 0, 0, ri + soft); rg.addColorStop(0, 'rgba(0,0,0,1)'); rg.addColorStop(ri / (ri + soft), 'rgba(0,0,0,1)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
  mg.fillStyle = rg; mg.fillRect(-6, -6, 12, 12); mg.restore();
  mg.globalCompositeOperation = 'destination-out'; mg.fillStyle = '#000'; mg.beginPath(); mg.rect(x, y, w, h); mg.fill();
  mg.globalCompositeOperation = 'source-over'; mg.fillStyle = `rgba(0,0,0,${inner})`; mg.beginPath(); mg.rect(x, y, w, h); mg.fill();
  pg.setTransform(1, 0, 0, 1, 0, 0); pg.globalCompositeOperation = 'source-over'; pg.globalAlpha = 1; pg.clearRect(0, 0, W, H);
  const ko = Math.pow(1 - u, 1.5); pg.save(); pg.translate((cx - W / 2) * ko, (cy - H / 2) * ko); o.plate(pg, t); pg.restore();
  pg.globalCompositeOperation = 'destination-in'; pg.drawImage(mc, 0, 0);
  ctx.drawImage(pc, 0, 0);
}
