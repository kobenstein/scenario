// Film 02 v2 "AI Is Moving Faster Than You Think": shot list anchored to the v2 VO (v2/audio/timing.json word times).
import fs from 'node:fs';
import {
  W, H, C, rgba, clamp, lin, mix, sm, eio, eout, sine, drift, prng, img, canvas, glow, addGlow, sky, fog,
  drawPlate, mapper, camPath, standFigure, walkFigure, text, label, stamp, glowLine, samples, Film,
} from './engine.mjs';
import * as M from './scenes/md.mjs';
import * as M2 from './scenes/md2.mjs';
import * as X from './scenes/explain.mjs';
import * as K from './scenes/hook_code.mjs';
import * as PLC from './scenes/places.mjs';
import { pict } from './scenes/picts.mjs';

const ROOT = '/mnt/project-files/scenario/film-02-exponential/';
const PLATES = ROOT + 'plates/';
const IW = 2752, IH = 1536;

// ---------- VO timing ----------
const TM = JSON.parse(fs.readFileSync(ROOT + 'v2/audio/timing.json', 'utf8'));
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
function find(sec, phrase, nth = 0) {
  const ws = TM.words.filter((w) => w.sec === sec), q = phrase.split(/\s+/).map(norm).filter(Boolean);
  let hit = 0;
  for (let i = 0; i + q.length <= ws.length; i++) {
    if (q.every((p, j) => (j === q.length - 1 ? norm(ws[i + j].w).startsWith(p) : norm(ws[i + j].w) === p))) { if (hit++ === nth) return { s: ws[i].s, e: ws[i + q.length - 1].e }; }
  }
  throw new Error(`phrase not found in ${sec}: "${phrase}"`);
}
const S = (sec, phrase, nth) => find(sec, phrase, nth).s;   // start of phrase
const E = (sec, phrase, nth) => find(sec, phrase, nth).e;   // end of phrase
const SEC = TM.sections;

// ---------- assets ----------
const PL = {};
async function loadPlate(id) {
  const d = PLATES + id + '/';
  if (!fs.existsSync(d + 'far.png')) return null;
  const p = { far: await img(d + 'far.png'), near: fs.existsSync(d + 'near.png') ? await img(d + 'near.png') : null, sp: {} };
  for (const f of fs.readdirSync(d)) if (/^sprite_.*\.png$/.test(f)) p.sp[f.slice(7, -4)] = await img(d + f);
  return p;
}
let UPPER; // walking "you": amber hooded coat upper body (flagship sprite, read only)

// ---------- plate shot ----------
// o: { cam: [{x,y,z},{x,y,z}], pf (far parallax), dolly, mid(ctx,t,m) figures behind near, front(ctx,t,m) on near ground,
//      fx(ctx,t,cam,s) screen overlays, fogAmt, ease }
function clampCam(c, pf, dolly) {
  const z = Math.max(c.z, 1.04), kN = (H / IH) * z * (1 + dolly * .5), kF = (H / IH) * z * (1 + dolly * (pf - .5));
  const lim = (k, axis) => (axis === 'x' ? IW - W / k : IH - H / k) / 2;
  const lx = Math.min(lim(kN, 'x'), lim(kF, 'x') / pf), ly = Math.min(lim(kN, 'y'), lim(kF, 'y') / pf);
  return { x: clamp(c.x, IW / 2 - lx, IW / 2 + lx), y: clamp(c.y, IH / 2 - ly, IH / 2 + ly), z };
}
// All pictures are drawn in code now (Jakob 2026-10-18: no AI images). plate(id, o) keeps the old shot list working:
// it draws the code scene that stands in for that location, then the shot's screen-space overlays (o.fx).
const CODE = {};
const CAM0 = { x: 1376, y: 768, z: 1 };
const plate = (id, o = {}) => Object.assign((ctx, t, s) => { const f = CODE[id]; if (!f) return drawPlateShot(id, o, ctx, t, s); f(ctx, t, s); if (o.fx) o.fx(ctx, t, CAM0, s, { sp: {} }); }, { pid: id, walk: !!o.walk });
function drawPlateShot(id, o, ctx, t, s) {
  const P = PL[id];
  if (!P) { sky(ctx, t, {}); text(ctx, id, W / 2, H / 2, { size: 40, align: 'center', color: C.muted }); return; }
  const pf = o.pf ?? .4, dolly = o.dolly ?? .1;
  const cam = clampCam(camPath(t, s.a, s.b, o.cam || [{ x: IW / 2, y: IH / 2, z: 1.1 }, { x: IW / 2, y: IH / 2, z: 1.18 }], o.ease), pf, dolly);
  const L = [{ im: P.far, p: pf, after: o.mid ? (c) => o.mid(c, t, mapper(cam, pf, { dolly }), P, s) : null }];
  if (P.near) L.push({ im: P.near, p: 1, after: o.front ? (c) => o.front(c, t, mapper(cam, 1, { dolly }), P, s) : null });
  drawPlate(ctx, L, cam, { dolly });
  if (o.fogAmt) fog(ctx, t, { amt: o.fogAmt, y0: o.fogY0 ?? .5, hex: o.fogHex });
  if (o.fx) o.fx(ctx, t, cam, s, P);
}
// figure helpers in image coordinates (m = mapper of the layer the figure stands on)
const stand = (name, x, y, h, o = {}) => (ctx, t, m, P) => { const sp = P.sp[name] || (name === 'you_back' && PL.p03_hill_night?.sp.you_back); if (sp) standFigure(ctx, sp, m.X(x), m.Y(y), h * m.k, t, o); };
const walker = (x0, x1, y0, y1, h, a, b, o = {}) => (ctx, t, m) => {
  const u = lin(a, b, t), x = mix(x0, x1, u), y = mix(y0, y1, u), hh = h * (o.h1 ? mix(1, o.h1, u) : 1);
  walkFigure(ctx, UPPER, m.X(x), m.Y(y), hh * m.k, Math.abs(x - x0) * 240 / hh + (t - a) * (o.inPlace || 0), t, { flip: x1 < x0, phoneGlow: o.phone ?? true });
};
const both = (...fs) => (...a) => fs.forEach((f) => f && f(...a));
const lampFlicker = (x, y, r, col = C.amber, core = '#fff3dd', p = 1) => (ctx, t, cam) => { return;
  const m = mapper(cam, p, { dolly: .1 }); addGlow(ctx, m.X(x), m.Y(y), r * m.k, .22 + .05 * Math.sin(t * 2.3) + .03 * Math.sin(t * 7.1), col, core);
};

// ---------- extra motion-design scenes ----------
// the line in the night sky above the valley (hook: "the moment the curve bends upward")
const skyCurve = (t0, dur, col = C.cyan) => (ctx, t, cam) => {
  const m = mapper(cam, .4, { dolly: .1 });
  const pts = samples((v) => [m.X(mix(1150, 2550, v)), m.Y(1000 - (Math.pow(2, v * 6) - 1) / 63 * 820)], 0, 1, 140);
  glowLine(ctx, pts, eio(lin(t0, t0 + dur, t)), { color: col, width: 3, glowW: 20, alpha: .9 });
};
// "Stand in 1990 ... 2010 ... here": a figure on the curve; the view always renormalises to a wall ahead
const standOnCurve = (stops) => (ctx, t, s) => {
  sky(ctx, t, { stars: .45 });
  let k = 0; while (k < stops.length - 1 && t > stops[k + 1].t) k++;
  const nx = stops[k + 1], u = nx ? eio(lin(nx.t - .2, nx.t + 1.4, t)) : 0;
  const yr = mix(stops[k].yr, nx ? nx.yr : stops[k].yr, u), L = 24, end = yr + 4, T = 2.2;
  const x0 = 200, x1 = 1720, y0 = 900, y1 = 150, X = (y) => mix(x0, x1, (y - (end - L)) / L);
  const f = (y) => Math.pow(2, (y - end) / T), Y = (y) => y0 - f(y) * (y0 - y1);
  const pts = samples((y) => [X(y), Y(y)], end - L, end, 200);
  glowLine(ctx, pts, eio(lin(s.a, s.a + 1.6, t)), { width: 5, glowW: 26, head: false });
  for (let y = Math.ceil((end - L) / 10) * 10; y <= end; y += 10) text(ctx, String(y), X(y), y0 + 50, { size: 30, font: 'Instrument Serif', color: C.muted, align: 'center', alpha: .8 });
  const a = lin(s.a + .8, s.a + 1.6, t), fx = X(yr), fy = Y(yr);
  addGlow(ctx, fx, fy, 70, .5 * a, C.amber, '#fff3dd');
  if (PL.p03_hill_night?.sp.you_back) standFigure(ctx, PL.p03_hill_night.sp.you_back, fx, fy + 4, 120 * a + .01, t, { flip: true });
  text(ctx, stops[k].label ?? String(Math.round(yr)), fx, fy - 150, { size: 54, font: 'Instrument Serif', align: 'center', alpha: a * (1 - u) + (nx ? 0 : 0) });
  if (nx) text(ctx, nx.label ?? String(nx.yr), fx, fy - 150, { size: 54, font: 'Instrument Serif', align: 'center', alpha: a * u });
  label(ctx, t, s.a + 2, 240, 250, 'behind you', 'flat', { color: C.cream });
  label(ctx, t, s.a + 2.8, x1 - 40, 250, 'ahead', 'a wall', { align: 'right', color: C.cream });
};
// "run it backwards": the share that is lit halves every 7 months back in time (overlay on the top-down city)
const backwards = (beats) => (ctx, t) => {
  let i = 0; while (i < beats.length - 1 && t > beats[i + 1].t) i++;
  const b = beats[i], nb = beats[i + 1], frac = nb ? Math.exp(mix(Math.log(b.f), Math.log(nb.f), eio(lin(nb.t - .3, nb.t + .9, t)))) : b.f;
  const r = prng(17), N = 1400;
  ctx.fillStyle = 'rgba(7,9,24,.35)'; ctx.fillRect(0, 0, W, H);
  for (let j = 0; j < N; j++) {
    const x = r() * W, y = r() * H, q = r(); if (q > frac) continue;
    addGlow(ctx, x, y, 14, .7, C.amber, '#fff3dd');
  }
  const cur = nb && t > nb.t - .3 ? nb : b, a = lin(beats[0].t, beats[0].t + .6, t);
  ctx.fillStyle = 'rgba(7,9,24,.6)'; ctx.fillRect(70, 60, 560, 190);
  text(ctx, cur.top.toUpperCase(), 100, 120, { size: 20, weight: 600, color: C.muted, spacing: 6, alpha: a });
  text(ctx, cur.big, 100, 210, { size: 84, font: 'Instrument Serif', color: C.amber, alpha: a });
};
// "walked them through how doubling works, step by step": doubling bars vs. the straight-line guess
const doublingSteps = (tGuess) => (ctx, t, s) => {
  sky(ctx, t, { stars: .35 });
  const n = 10, x0 = 300, x1 = 1620, y0 = 900, top = 180, bw = (x1 - x0) / n * .6;
  for (let i = 0; i < n; i++) {
    const born = s.a + .6 + i * .55, a = eout(lin(born, born + .45, t)); if (a <= 0) continue;
    const h = Math.pow(2, i) / Math.pow(2, n - 1) * (y0 - top), x = mix(x0, x1, (i + .5) / n);
    ctx.fillStyle = rgba(i === n - 1 ? C.cyanWhite : C.cyan, .75 * a); ctx.fillRect(x - bw / 2, y0 - Math.max(2, h * a), bw, Math.max(2, h * a));
    text(ctx, String(Math.pow(2, i)), x, y0 - h * a - 18, { size: 30, font: 'Instrument Serif', align: 'center', alpha: a * .9 });
  }
  const g = eio(lin(tGuess, tGuess + 1.6, t));
  if (g > 0) {
    ctx.save(); ctx.setLineDash([14, 12]); ctx.strokeStyle = rgba(C.amber, .9); ctx.lineWidth = 3; ctx.beginPath();
    ctx.moveTo(x0, y0 - 4); ctx.lineTo(mix(x0, x1, g), y0 - 4 - g * 120); ctx.stroke(); ctx.restore();
    label(ctx, t, tGuess + 1.2, x0 + 20, y0 - 190, 'the straight-line guess', '', { color: C.amber });
  }
  text(ctx, 'Lammers, Crusius & Gast, 2020', W - 80, H - 50, { size: 18, color: C.muted, align: 'right', alpha: .7 });
};
// a single question, set big
const card = (line1, line2, o = {}) => (ctx, t, s) => {
  sky(ctx, t, { stars: .55, warm: o.warm || 0 });
  if (o.curve) glowLine(ctx, samples((v) => [mix(300, 1620, v), 900 - (Math.pow(2, v * 7) - 1) / 127 * 700], 0, 1, 120), eio(lin(s.a, s.a + 2.5, t)), { width: 3, glowW: 16, alpha: .45 });
  const a = eout(lin(s.a + .3, s.a + 1.2, t)) * (1 - lin(s.b - .6, s.b, t)), dy = (1 - a) * 20;
  text(ctx, line1, W / 2, H / 2 + (line2 ? -10 : 30) + dy, { size: o.size || 96, font: 'Instrument Serif', align: 'center', alpha: a });
  if (line2) text(ctx, line2, W / 2, H / 2 + 80 + dy, { size: o.size2 || 56, font: 'Instrument Serif Italic', color: o.col2 || C.cyan, align: 'center', alpha: eout(lin(o.t2 ?? s.a + 1.2, (o.t2 ?? s.a + 1.2) + .8, t)) * (1 - lin(s.b - .6, s.b, t)) });
};
// the same desk, both versions side by side
const split = (A, B, la, lb) => {
  const [ca, xa] = canvas(), [cb, xb] = canvas();
  return (ctx, t, s) => {
    xa.fillStyle = C.indigo; xa.fillRect(0, 0, W, H); A(xa, t, s); xb.fillStyle = C.indigo; xb.fillRect(0, 0, W, H); B(xb, t, s);
    const u = eio(lin(s.a, s.a + 1.4, t)), cx = mix(W, W / 2, u);
    ctx.drawImage(ca, 0, 0); ctx.save(); ctx.beginPath(); ctx.rect(cx, 0, W - cx, H); ctx.clip(); ctx.drawImage(cb, 0, 0); ctx.restore();
    ctx.fillStyle = rgba(C.cream, .5); ctx.fillRect(cx - 1, 0, 2, H);
    label(ctx, t, s.a + 1.2, W * .25, 140, 'we waited', '', { align: 'center' });
    label(ctx, t, s.a + 1.6, W * .75, 140, 'we read the curve', '', { align: 'center', color: C.amber });
  };
};

// ---------- shot sequencing ----------
// seq([[t, draw, kind, d], ...], end): shot i runs from its t to the next one's t (overlap d for the transition)
function seq(list, end) {
  return list.map(([t0, draw, kind = 'dissolve', d = 1, k], i) => {
    const nx = list[i + 1], b = nx ? nx[0] + (nx[3] ?? 1) / 2 : end, a = t0 - (i ? (d ?? 1) / 2 : 0);
    return { a, b, draw, k, out: { kind: nx ? (nx[2] ?? 'dissolve') : 'dissolve' }, _start: t0 };
  }).map((s, i, arr) => { const nx = arr[i + 1]; if (nx) s.b = Math.max(s.b, nx.a + .01); return s; });
}

// words of a spoken passage (for quote pages that light up word by word)
function WD(sec, from, to, nth = 0) {
  const a = find(sec, from), b = find(sec, to, nth);
  return TM.words.filter((w) => w.sec === sec && w.s >= a.s - .01 && w.e <= b.e + .01).map((w) => ({ w: w.w.replace(/["“”]/g, ''), s: w.s }));
}
const keyImg = {}; // plate key images, used as card pictures
const INFO = (id) => { try { return JSON.parse(fs.readFileSync(PLATES + id + '/info.json', 'utf8')); } catch { return {}; } };

// the same room, both versions side by side
const split2 = (A, B, la, lb) => {
  const [ca, xa] = canvas(), [cb, xb] = canvas();
  return (ctx, t, s) => {
    xa.fillStyle = C.indigo; xa.fillRect(0, 0, W, H); A(xa, t, s); xb.fillStyle = C.indigo; xb.fillRect(0, 0, W, H); B(xb, t, s);
    const u = eio(lin(s.a, s.a + 1.4, t)), cx = mix(W, W / 2, u);
    ctx.drawImage(ca, 0, 0); ctx.save(); ctx.beginPath(); ctx.rect(cx, 0, W - cx, H); ctx.clip(); ctx.drawImage(cb, 0, 0); ctx.restore();
    ctx.fillStyle = rgba(C.cream, .5); ctx.fillRect(cx - 1, 0, 2, H);
    label(ctx, t, s.a + 1.2, W * .25, 140, la, '', { align: 'center' });
    label(ctx, t, s.a + 1.6, W * .75, 140, lb, '', { align: 'center', color: C.amber });
  };
};
// lamps switching on one by one (positions in image px on the given layer)
const lampsOn = (pts, t0, step, p = .4, col = C.amber) => (ctx, t, cam) => { return;
  const m = mapper(cam, p, { dolly: .1 });
  pts.forEach(([x, y], i) => { const a = eout(lin(t0 + i * step, t0 + i * step + .4, t)); if (a > 0) addGlow(ctx, m.X(x), m.Y(y), 120 * m.k, .5 * a + .05 * Math.sin(t * 3 + i), col, '#fff3dd'); });
};
// a big caption with a small caps line, for numbers that belong in the picture
const caption = (t0, top, big, o = {}) => (ctx, t) => {
  const a = eout(lin(t0, t0 + .6, t)) * (1 - lin(t0 + (o.dur ?? 4), t0 + (o.dur ?? 4) + .6, t)); if (a <= 0) return;
  const x = o.x ?? 100, y = o.y ?? H - 170, al = o.align ?? 'left';
  ctx.fillStyle = `rgba(7,9,24,${.55 * a})`; ctx.fillRect(al === 'left' ? x - 30 : x - 640, y - 70, 670, 170);
  text(ctx, top.toUpperCase(), x, y - 22, { size: 20, weight: 600, color: C.muted, alpha: a, spacing: 6, align: al });
  text(ctx, big, x, y + 54, { size: o.size ?? 76, font: 'Instrument Serif', color: o.color ?? C.amber, alpha: a, align: al });
};
// 950 lights fan out over the DNA sea and converge on one pattern
const swarm = (t0, t1, tx, ty, p = .4) => (ctx, t, cam) => { return;
  const m = mapper(cam, p, { dolly: .1 }), r = prng(23), u = lin(t0, t1, t);
  if (t < t0) return;
  for (let i = 0; i < 950; i++) {
    const ang = r() * 6.283, dist = 300 + r() * 1600, ph = r();
    const spread = Math.sin(Math.PI * clamp(u * 1.25)), conv = eio(lin(.55 + ph * .2, 1, u));
    const x = tx + Math.cos(ang) * dist * spread * (1 - conv), y = ty + Math.sin(ang) * dist * .35 * spread * (1 - conv) - 60 * (1 - conv);
    const a = clamp(u * 6) * (.35 + .4 * r());
    ctx.fillStyle = rgba(C.cyanWhite, a); ctx.fillRect(m.X(x), m.Y(y), 2.2, 2.2);
  }
  addGlow(ctx, m.X(tx), m.Y(ty), 160 * m.k, .7 * eio(lin(t1 - 1.5, t1, t)), C.amber, '#fff3dd');
};
// a line across a night globe between two cities (the incident channel)
const hotline = (t0) => (ctx, t, s) => {
  sky(ctx, t, { stars: .6 });
  const cx = W / 2, cy = H + 520, R = 1180;
  const g = ctx.createRadialGradient(cx, cy, R * .6, cx, cy, R); g.addColorStop(0, '#141a44'); g.addColorStop(1, '#0d1236'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
  addGlow(ctx, cx, cy - R, 900, .18, C.cyan);
  const A = [520, 640], B = [1420, 610];
  [A, B].forEach(([x, y], i) => { addGlow(ctx, x, y, 60, .7, C.amber, '#fff3dd'); text(ctx, i ? 'BEIJING' : 'WASHINGTON', x, y + 60, { size: 22, weight: 600, color: C.cream, spacing: 6, align: 'center', alpha: lin(s.a + .4, s.a + 1, t) }); });
  const arc = samples((v) => [mix(A[0], B[0], v), mix(A[1], B[1], v) - Math.sin(Math.PI * v) * 330], 0, 1, 80);
  glowLine(ctx, arc, eio(lin(t0, t0 + 2, t)), { color: C.amber, width: 4, glowW: 22 });
  const p = (t - t0 - 2) * .5 % 1; if (t > t0 + 2) { const q = arc[Math.floor(p * 80)]; addGlow(ctx, q[0], q[1], 40, .8, C.cyan); }
};
// a wall of names filling the frame (the open letter)
const names = (t0) => (ctx, t, s) => {
  sky(ctx, t, { stars: .2 });
  const r = prng(41), N = 1100, cols = 22, cw = W / cols;
  for (let i = 0; i < N; i++) {
    const a = eout(lin(t0 + i * .0045, t0 + i * .0045 + .3, t)); if (a <= 0) break;
    const x = (i % cols) * cw + 14, y = 70 + Math.floor(i / cols) * 20 + drift(t, 2, i);
    ctx.fillStyle = rgba(r() > .985 ? C.amber : C.cream, .55 * a); ctx.fillRect(x, y, cw * (.35 + .5 * r()), 5);
  }
  const k = Math.min(1100, Math.floor(Math.max(0, t - t0) / .0045));
  ctx.fillStyle = 'rgba(7,9,24,.7)'; ctx.fillRect(W / 2 - 330, H / 2 - 90, 660, 180);
  text(ctx, (k >= 1100 ? '1,100+' : k.toLocaleString('en-US')), W / 2, H / 2 + 30, { size: 110, font: 'Instrument Serif', align: 'center', alpha: lin(t0, t0 + .5, t) });
  text(ctx, 'PEOPLE AT FOUR FRONTIER LABS', W / 2, H / 2 + 72, { size: 20, weight: 600, color: C.muted, spacing: 6, align: 'center', alpha: lin(t0, t0 + .5, t) });
};

// "Most of us picture AI progress as a few big moments, with long quiet stretches in between."
const pictured = (t0) => (ctx, t, s) => {
  sky(ctx, t, { stars: .5 });
  const steps = [[150, 0], [620, 0], [620, 1], [1080, 1], [1080, 2], [1520, 2], [1520, 3], [1780, 3]];
  const u = lin(t0, t0 + 4, t), Y = (k) => 820 - k * 170;
  ctx.save(); ctx.setLineDash([16, 14]); ctx.lineDashOffset = -t * 20; ctx.strokeStyle = rgba(C.cream, .55); ctx.lineWidth = 5; ctx.beginPath();
  const n = steps.length * u; steps.forEach(([x, k], i) => { if (i > n) return; i ? ctx.lineTo(x, Y(k)) : ctx.moveTo(x, Y(k)); }); ctx.stroke(); ctx.restore();
  [[620, 1], [1080, 2], [1520, 3]].forEach(([x, k], i) => { const a = eout(lin(t0 + .9 + i * 1.1, t0 + 1.5 + i * 1.1, t)); if (a <= 0) return; addGlow(ctx, x, Y(k - .5), 70, .5 * a, C.amber, '#fff3dd'); text(ctx, 'big moment', x, Y(k) - 40, { size: 30, font: 'Instrument Serif Italic', color: C.amber, align: 'center', alpha: a }); });
  [[385, 0], [850, 1], [1300, 2]].forEach(([x, k], i) => { const a = eout(lin(t0 + 1.4 + i * 1.1, t0 + 2 + i * 1.1, t)); text(ctx, 'quiet', x, Y(k) + 56, { size: 26, color: C.muted, align: 'center', alpha: a * .8, spacing: 4 }); });
  text(ctx, 'HOW MOST OF US PICTURE AI PROGRESS', 150, 160, { size: 22, weight: 600, color: C.muted, spacing: 6, alpha: lin(t0, t0 + .6, t) });
};

export async function build() {
  const ids = fs.readdirSync(PLATES).filter((d) => /^p\d\d_/.test(d));
  void ids;
  Object.assign(keyImg, { p28_problem_library: pict('math'), p02_dc_ext: pict('chip'), p23_lab_night: pict('essay'), p29_office_overnight: pict('overnight'), p27_dna_sea: pict('dna'), p34_hotline_1963: pict('phone'), p24_parliament: pict('capitol'), p17_core_hall: pict('core'), p08_dc_int: pict('core2') });
  Object.assign(CODE, {
    p28_problem_library: K.problems({ tFall: .8, step: .35 }), p02_dc_ext: PLC.dcOutside(), p08_dc_int: PLC.datacenter(), p23_lab_night: K.lab({}),
    p29_office_overnight: PLC.office({ morning: S('06', 'In the morning') }), p27_dna_sea: K.dnaSea({ tFindAbs: S('07', 'One of them stops') }),
    p03_hill_night: K.hillView({ tLine: .3 }), p24_parliament: PLC.chamber(), p09_mountain: K.hillView({ tLine: 0, dur: 6, hex: C.muted }),
    p20_hill_dawn: K.hillView({ warm: 1, hex: C.amber, tLine: .4 }), p31_kinshasa_night: PLC.kinRoom({}), p32_kinshasa_dawn: PLC.kinRoom({ dawn: true }),
    p30_field_office: K.healthMap({ tPins: .3 }), p33_glass_lab: PLC.glassLab({ tWalk0: .5, tWalk1: 9 }), p34_hotline_1963: PLC.desk1963({ tRing: 1.2 }),
    p14_clinic: PLC.clinic(), p26_classroom: PLC.classroom(),
  });
  const CARD = {};
  Object.assign(CARD, { c01: pict('dartmouth'), c02: pict('chess'), c03: pict('seeing'), c04: pict('go'), c05: pict('protein'), c06: pict('chat'), c07: pict('exam'), c08: pict('medal'), c09: pict('proof') });
  UPPER = await img('/mnt/project-files/scenario/folge-01-flagship/motion-test/upper.png');
  const cam = (x0, y0, z0, x1, y1, z1) => [{ x: x0, y: y0, z: z0 }, { x: x1, y: y1, z: z1 }];
  const you = stand('you_back', 900, 1150, 330, { flip: true });
  const L = [];

  // ===== 1 Hook =====
  const tTitle = SEC['01'].end + .5;
  const amodei = { words: WD('01', 'We must slow', 'AI models'), who: 'Dario Amodei', role: 'CEO, Anthropic', date: '12 Sep 2026', source: 'Essay · “We Must Pace the Frontier”', hi: ['slow'] };
  L.push(
    [0, K.street({ tLine: 2.5 })],
    [S('01', 'The people building'), K.lab({}), 'dissolve', 1],
    [S('01', 'Last month') - .2, M2.quotePage({ ...amodei, bg: K.lab({ cam0: [-40, -10, 1.08], cam1: [-60, -20, 1.14] }) }), 'push', 1],
    [S('01', "He's asking"), K.hillView({ tLine: .3, dur: 4.5 }), 'fog', 1.2],
    [S('01', 'In mathematics') - .2, K.problems({ tFall: .9, step: .3 }), 'left', 1],
    [S('01', 'In biology') - .2, K.dnaSea({ tFind: 2.2 }), 'left', 1],
    [S('01', 'In public health') - .2, K.healthMap({ tPins: .3, report: X.shrinkBar({ t0: S('01', 'In public health'), t1: S('01', 'And the month') - .7, tShrink: S('01', 'now takes'), title: 'one daily report', fromLabel: 'all day', toLabel: 'under an hour', x: 1180, y: 520, w: 600 }) }), 'left', 1],
    [S('01', 'And the month') - .3, K.hillView({ tLine: 0, dur: 2.5, hex: C.amber, from: [500, 620], to: [1840, 40] }), 'fog', 1.4],
    [tTitle, M.title('AI is moving faster', 'than you think'), 'up', 1.4],
  );

  // ===== 2 The long curve =====
  const LC = {
    cards: [
      { t: S('02', 'Nineteen fifty-six'), x: 1956, img: CARD.c01, year: '1956', title: 'the field gets a name', hold: 6 },
      { t: S('02', 'Forty-one years'), x: 1997, img: CARD.c02, year: '1997', title: 'chess', gap: '41 years' },
      { t: S('02', 'Fifteen years'), x: 2012, img: CARD.c03, year: '2012', title: 'seeing', gap: '15 years' },
      { t: S('02', 'AlphaGo') - .3, x: 2016, img: CARD.c04, year: '2016', title: 'Go', gap: '4 years' },
      { t: S('02', 'AlphaFold') - .3, x: 2020, img: CARD.c05, year: '2020', title: 'proteins', gap: '4 years' },
      { t: S('02', 'ChatGPT') - .2, x: 2022.9, img: CARD.c06, year: '2022', title: 'ChatGPT', gap: '2 years' },
      { t: S('02', 'GPT-4') - .2, x: 2023.2, img: CARD.c07, year: '2023', title: 'the bar exam', gap: '4 months' },
      { t: S('02', 'In July twenty') + .4, x: 2025.55, img: CARD.c08, year: '2025', title: 'Math Olympiad gold' },
      { t: S('02', 'Ten months later') + .2, x: 2026.38, img: CARD.c09, year: '2026', title: 'an 80-year-old conjecture falls', gap: '10 months' },
    ],
    view: [
      { t: SEC['02'].start, x0: 1950, x1: 2005, y: 4 },
      { t: S('02', 'Fifteen years') + .5, x0: 1950, x1: 2028, y: 8, d: 2.5 },
      { t: S('02', 'In July twenty') - .2, x0: 2008, x1: 2027.2, y: 9, d: 2.2 },
      { t: S('02', 'Over the last three') + .6, x0: 2024.6, x1: 2026.9, y: 10, d: 3 },
    ],
    ticks: [1960, 1970, 1980, 1990, 2000, 2010, 2020, 2025, 2026].map((x) => ({ x, label: String(x) })),
    x0: 1950, shrinkOld: true,
  };
  const longCurve = M2.cardLine(LC);
  const gowers = { words: WD('02', 'No previous', 'to that'), who: 'Tim Gowers', role: 'Fields Medal winner', date: 'May 2026', source: 'On the AI disproof of Erdős’s unit-distance conjecture', hi: ['no'] };
  const institute = { words: WD('02', 'The rate at which', 'accelerating'), who: 'Anthropic Institute', role: '“When AI builds itself”', date: '2026', source: 'Research report', hi: ['accelerating'] };
  L.push(
    [SEC['02'].start - .4, pictured(SEC['02'].start + .3), 'up', 1.2],
    [S('02', 'So let') - .3, longCurve, 'dissolve', 1],
    [S('02', 'The Fields Medal') - .2, M2.quotePage({ ...gowers, bg: plate('p28_problem_library', { cam: cam(1376, 820, 1.3, 1376, 800, 1.4) }) }), 'push', 1],
    [S('02', 'The gaps between') - .2, longCurve, 'dissolve', 1],
    [S('02', 'The rate at which') - .5, M2.quotePage({ ...institute }), 'push', 1],
    [S('02', 'Over the last three') - .2, longCurve, 'dissolve', 1],
  );

  // ===== 3-8 Ninety days =====
  const D = (m, d) => (m === 8 ? d - 1 : m === 9 ? 30 + d : 60 + d); // days since 1 Aug
  const dayCards = [
    { t: S('03', 'August first'), x: D(8, 1), img: keyImg.p28_problem_library, year: 'Aug 1', title: 'ten old math problems move', date: 'August 1', hold: 3 },
    { t: S('04', 'August twenty-sixth'), x: D(8, 26), img: keyImg.p02_dc_ext, year: 'Aug 26', title: '$1.3 trillion of fuel', gap: '25 days', date: 'August 26', hold: 3 },
    { t: S('05', 'September twelfth'), x: D(9, 12), img: keyImg.p23_lab_night, year: 'Sep 12', title: '“slow the pace”', gap: '17 days', date: 'September 12', hold: 3 },
    { t: S('06', 'September twenty-second'), x: D(9, 22), img: keyImg.p29_office_overnight, year: 'Sep 22', title: '18 hours on one task', gap: '10 days', date: 'September 22', hold: 3 },
    { t: S('07', 'September twenty-third'), x: D(9, 23), img: keyImg.p27_dna_sea, year: 'Sep 23', title: 'a new biological system', gap: '1 day', date: 'September 23', hold: 3 },
  ];
  const days = M2.cardLine({
    cards: dayCards, x0: -6, cardW: 210, cardH: 150,
    view: [
      { t: SEC['03'].start, x0: -8, x1: 40, y: 3 },
      { t: S('05', 'September twelfth'), x0: -8, x1: 60, y: 5, d: 2.5 },
      { t: SEC['08'].start, x0: -8, x1: 62, y: 6, d: 2.5 },
    ],
    ticks: [[8, 1, 'Aug 1'], [9, 1, 'Sep 1'], [10, 1, 'Oct 1'], [10, 15, 'Oct 15']].map(([m, d, l]) => ({ x: D(m, d), label: l })),
    counter: { t0: SEC['03'].start, top: 'the last 90 days', from: 'August 1' },
    tail: { t: S('08', 'But the quiet'), dx: 3, dy: 4 },
  });
  const huang = { words: WD('04', 'AI has reached', 'inflection point'), who: 'Jensen Huang', role: 'CEO, Nvidia', date: '26 Aug 2026', source: 'Earnings call, Q2 FY2027', hi: ['inflection'] };
  const agent = { words: WD('07', 'I can see', 'array', 1), who: 'A Claude agent', role: 'note in its own log', date: '23 Sep 2026', source: 'Anthropic · “Claude discovers a novel enzyme system”', hi: ['CRISPR-like'], size: 58 };
  const zhang = { words: WD('07', 'This is an exciting', 'discovery'), who: 'Feng Zhang', role: 'CRISPR pioneer, Broad Institute', date: 'Sep 2026', source: 'On the agents’ discovery', hi: ['discovery'] };
  const lampsP28 = INFO('p28_problem_library').lamps || [];
  const MAPPTS = [[300, 420], [520, 360], [760, 470], [430, 640], [880, 330], [640, 760], [990, 620], [260, 880], [820, 900], [1080, 820], [520, 1000], [700, 560], [380, 300], [1000, 1020]];
  L.push(
    // Aug 1
    [SEC['03'].start - .4, days, 'push', 1.2],
    [S('03', 'Ten problems') - .2, plate('p28_problem_library', { cam: cam(1376, 820, 1.15, 1376, 760, 1.4), fx: both(lampsOn(lampsP28, S('03', 'Ten problems'), .3), caption(S('03', 'One bound'), 'sphere packing', 'stuck since 1978', { dur: 3.5 }), X.proof({ t0: S('03', 'then checked') - .3, t1: S('03', 'The computing bill') - .5, rate: 3 })) }), 'dissolve', 1],
    [S('03', 'The computing bill') - .2, plate('p28_problem_library', { cam: cam(1250, 900, 1.45, 1450, 860, 1.3), fx: both(lampsOn(lampsP28, 0, 0), caption(S('03', 'The computing bill'), 'compute bill, OpenAI estimate', 'about $2,000', { dur: 3.2 }), caption(S('03', 'None of it'), 'status', 'not yet peer-reviewed', { dur: 3, color: C.cream })) }), 'dissolve', 1],
    [S('03', 'Keep that in mind') - .2, plate('p28_problem_library', { cam: cam(1376, 760, 1.38, 1376, 700, 1.5), fx: both(lampsOn(lampsP28, 0, 0), X.icons({ items: [{ t: S('03', 'Checking'), kind: 'check', label: 'checking' }], t1: 1e9, y: 300 })) }), 'dissolve', 1],
    // Aug 26
    [SEC['04'].start - .3, days, 'dissolve', 1],
    [S('04', 'Nvidia reports') + .3, plate('p02_dc_ext', { cam: cam(1100, 900, 1.25, 1500, 860, 1.4), fx: both(lampFlicker(580, 990, 160), X.bars({ t0: S('04', 'reports') - .2, t1: S('04', 'Its finance chief') - .6, title: 'Nvidia data-center sales, 3 months', x: 1060, y: 330, rows: [{ label: 'Aug 2026', v: 89, t: S('04', 'eighty-nine billion'), fmt: (v) => '$' + Math.round(v) + ' bn', col: C.amber }, { label: 'a year before', v: 42, t: S('04', 'More than double'), fmt: () => 'less than half', col: C.muted }] })) }), 'dissolve', 1],
    [S('04', 'Its finance chief') - .2, plate('p08_dc_int', { cam: cam(1380, 1000, 1.12, 1380, 960, 1.45), dolly: .25, fx: both(X.flow({ t0: S('04', 'Its finance chief'), t1: S('04', 'On the same call') - .5, tx: 1380, ty: 900, col: C.amber }), caption(S('04', 'one point three'), 'big-cloud spending next year (forecast)', '$1.3 trillion', { dur: 4 })) }), 'push', 1],
    [S('04', 'On the same call') - .2, M2.quotePage({ ...huang, bg: plate('p08_dc_int', { cam: cam(1380, 960, 1.45, 1380, 940, 1.55), dolly: .25 }) }), 'push', 1],
    [S('04', "That's the fuel") - .2, days, 'dissolve', 1],
    // Sep 12
    [SEC['05'].start - .3, days, 'dissolve', 1],
    [S('05', "That's the essay") - .3, M2.quotePage({ ...amodei, bg: plate('p23_lab_night', { cam: cam(1250, 740, 1.4, 1200, 740, 1.5) }) }), 'push', 1],
    // Sep 22
    [SEC['06'].start - .3, days, 'dissolve', 1],
    [S('06', 'An engineer') - .2, ((clk) => plate('p29_office_overnight', { cam: cam(1376, 820, 1.15, 1376, 780, 1.4), fx: (c, t) => { const u = lin(S('06', 'In the morning') - 1, S('06', 'In the morning') + 1.5, t); if (u > 0) { c.fillStyle = `rgba(255,179,92,${.18 * u})`; c.globalCompositeOperation = 'soft-light'; c.fillRect(0, 0, W, H); c.globalCompositeOperation = 'source-over'; } clk(c, t); } }))(X.clock({ t0: S('06', 'An engineer') + .3, t1: S('06', 'That model costs') - .6, tRun0: S('06', 'working overnight'), tRun1: S('06', 'More than eighteen') + 1.2, hours: 18, label: 'one task, one run' })), 'dissolve', 1],
    [S('06', 'That model costs') - .2, plate('p29_office_overnight', { cam: cam(1250, 860, 1.4, 1450, 820, 1.25), fx: X.bars({ t0: S('06', 'That model costs'), t1: 1e9, title: 'price for the same work', x: 1060, y: 380, rows: [{ label: 'July model', v: 100, t: S('06', 'That model costs') + .2, fmt: () => '100 %', col: C.muted }, { label: 'September model', v: 60, t: S('06', 'forty percent'), fmt: (v) => Math.round(v) + ' %', col: C.cyan }], note: '40 % cheaper, two months later' }) }), 'dissolve', 1],
    // Sep 23
    [SEC['07'].start - .3, days, 'dissolve', 1],
    [S('07', 'Nine hundred and fifty') - .2, plate('p27_dna_sea', { cam: cam(1376, 820, 1.12, 1376, 760, 1.4), fx: swarm(S('07', 'Nine hundred and fifty'), S('07', 'One of them stops') + .5, 1800, 820) }), 'dissolve', 1],
    [S('07', 'I can see') - .3, M2.quotePage({ ...agent, bg: plate('p27_dna_sea', { cam: cam(1376, 760, 1.4, 1376, 740, 1.5) }) }), 'push', 1],
    [S('07', "It's a system") - .2, plate('p27_dna_sea', { cam: cam(1650, 800, 1.5, 1500, 800, 1.2), fx: (c, t, cm) => { const m = mapper(cm, .4, { dolly: .1 }); addGlow(c, m.X(1800), m.Y(820), 200 * m.k, .5 + .1 * Math.sin(t * 2), C.amber, '#fff3dd'); } }), 'dissolve', 1],
    [S('07', 'Feng Zhang') - .2, M2.quotePage({ ...zhang, bg: plate('p27_dna_sea', { cam: cam(1376, 800, 1.2, 1376, 820, 1.3) }) }), 'push', 1],
    // the gaps, and why it surprises
    [SEC['08'].start - .3, both(days, X.chips({ items: [{ t: S('08', 'Twenty-five days'), text: '25 days' }, { t: S('08', 'Seventeen'), text: '17' }, { t: S('08', 'Ten.'), text: '10' }, { t: S('08', 'One.'), text: '1', col: C.amber }], t1: S('08', 'These are the') - .2, x: 160, y: 330, size: 64 }), X.chips({ items: [{ t: S('08', 'These are the'), text: 'our picks: not every week brings one' }, { t: S('08', 'But the quiet'), text: 'but the quiet stretches shrink', col: C.amber }], t1: S('08', 'Most of us') - .6, x: 140, y: 820, size: 46 })), 'dissolve', 1],
    [S('08', 'Most of us') - .2, K.street({ tLine: 1.2 }), 'fog', 1.2],
    [S('08', 'Take two months') - .2, both(days, X.chips({ items: [{ t: S('08', 'Take two months'), text: '2 months away from the news' }, { t: S('08', 'missed all five'), text: '5 firsts missed', col: C.amber }], t1: 1e9, x: 140, y: 820, size: 52 })), 'dissolve', 1],
    [S('08', "That's why this") - .2, both(K.hillView({ tLine: 0, dur: 3, hex: C.amber, from: [500, 620], to: [1840, 40] }), X.chips({ items: [{ t: S('08', 'almost everyone'), text: 'surprises almost everyone', col: C.amber }], t1: 1e9, x: 140, y: 900, size: 58 })), 'fog', 1.2],
  );

  // ===== 9 Why faster =====
  const princeton = { words: WD('09', 'on the timescale', 'decades'), who: 'Arvind Narayanan & Sayash Kapoor', role: 'Princeton', date: 'Apr 2025', source: 'Essay · “AI as Normal Technology”', hi: ['decades'], size: 70 };
  const korinek = { words: WD('09', 'Steam, electricity', 'few years'), who: 'Anton Korinek', role: 'economist, University of Virginia', date: 'Jul 2026', source: 'On the “We Must Act Now” statement', hi: ['few', 'years'], size: 56 };
  L.push(
    [SEC['09'].start - .4, days, 'dissolve', 1.2],
    [S('09', 'Because each one') - .6, M2.loop({ n: [S('09', 'Because each one'), S('09', 'You run nine'), S('09', 'More attempts'), S('09', 'More finds bring'), S('09', 'More money buys')], close: S('09', "It's a loop"), gap: S('09', "It isn't closed") - 3.2 }), 'push', 1.2],
    [S('09', 'Google checked') - .3, plate('p23_lab_night', { cam: cam(1300, 780, 1.2, 1376, 800, 1.35), front: stand('researcher', 1620, 1140, 740, { flip: true }), fx: both(caption(S('09', 'AI already writes'), 'new code at Google written by AI', 'over 75 %', { dur: 3.5 }), caption(S('09', 'Yet it found'), 'measured speed-up of research itself', 'none yet', { dur: 3.5, color: C.cream })) }), 'dissolve', 1],
    [S('09', 'The loop is turning') - .3, M2.loop({ n: [0, 0, 0, 0, 0], close: 0, gap: S('09', "It isn't closed") - .3 }), 'dissolve', 1],
    [S('09', 'Two Princeton') - .2, M2.quotePage({ ...princeton, x: W / 2, w: 1100 }), 'push', 1],
    [S('09', 'An economist') - .2, M2.quotePage({ ...korinek, w: 1300 }), 'left', 1],
    [S('09', 'Both could be right') - .2, M.twoRates(), 'dissolve', 1, { us: S('09', 'How fast it changes') }],
  );

  // ===== 10 Fork =====
  const altman = { words: WD('10', 'a new Renaissance', 'disarray'), who: 'Sam Altman', role: 'CEO, OpenAI', date: '23 Sep 2026', source: 'UN Security Council briefing', hi: ['renaissance', 'disarray'], size: 56 };
  L.push(
    [SEC['10'].start - .4, plate('p03_hill_night', { cam: cam(1376, 900, 1.15, 1300, 820, 1.3), front: you, fx: skyCurve(SEC['10'].start, 3) }), 'fog', 1.4],
    [S('10', 'In September') - .2, M2.quotePage({ ...altman, bg: plate('p24_parliament', { cam: cam(1376, 800, 1.2, 1376, 760, 1.35) }) }), 'push', 1],
    [S('10', 'When firsts arrive') - .2, plate('p09_mountain', { cam: cam(1700, 1100, 1.4, 1376, 800, 1.15), front: walker(2200, 1950, 1490, 1380, 260, S('10', 'When firsts arrive'), S('10', 'Or we can build')) }), 'dissolve', 1],
    [S('10', 'Or we can build') - .2, plate('p20_hill_dawn', { cam: cam(1250, 900, 1.2, 1500, 800, 1.32), front: you, fx: X.icons({ items: [{ t: S('10', 'the checking'), kind: 'check', label: 'checking' }, { t: S('10', 'the referees'), kind: 'eye', label: 'referees' }, { t: S('10', 'the phone lines'), kind: 'phone', label: 'phone lines' }, { t: S('10', 'point the pace'), kind: 'target', label: 'aim' }], t1: 1e9, y: 250, x0: 760, gap: 300 }) }), 'flash', 1],
    [S('10', 'Pause here') - .3, card('Pause here.', 'Which would you choose?', { size: 110, size2: 60, t2: S('10', 'Which would') - .2 }), 'dissolve', 1],
  );

  // ===== 11 Two endings =====
  const amaniN = stand('amani', 560, 1420, 880, { sway: .25, shadow: false });
  const amaniD = (ctx, t, m, P) => amaniN(ctx, t, m, PL.p31_kinshasa_night);
  const reports = (t0) => (ctx, t) => { const r = prng(9); for (let i = 0; i < 26; i++) { const born = t0 + i * .18; const a = eout(lin(born, born + .3, t)); if (a <= 0) break; const x = 160 + r() * 1600, y = 120 + r() * 520, w = 150 + r() * 120; ctx.fillStyle = rgba(r() > .5 ? C.cyan : C.rose, .16 * a); ctx.fillRect(x, y, w, 90); ctx.strokeStyle = rgba(C.cream, .35 * a); ctx.strokeRect(x, y, w, 90); for (let l = 0; l < 4; l++) { ctx.fillStyle = rgba(C.cream, .3 * a); ctx.fillRect(x + 14, y + 18 + l * 17, w * (.4 + .5 * r()), 4); } } };
  L.push(
    [SEC['11'].start - .4, plate('p31_kinshasa_night', { cam: cam(1600, 700, 1.35, 1376, 800, 1.12), fx: (c, t) => stamp(c, t, SEC['11'].start + .3, '2029', 'Kinshasa · a scenario', { dur: 6 }) }), 'fog', 1.6],
    [S('11', 'An epidemiologist') - .2, plate('p31_kinshasa_night', { cam: cam(1376, 820, 1.15, 1300, 860, 1.4), front: amaniN, fx: lampFlicker(1100, 900, 200, C.cyan, C.cyanWhite) }), 'dissolve', 1],
    [S('11', 'Her inbox') - .2, plate('p31_kinshasa_night', { cam: cam(1300, 860, 1.4, 1250, 860, 1.55), front: amaniN, fx: reports(S('11', 'Her inbox')) }), 'dissolve', 1],
    [S('11', 'So she trusts') - .2, plate('p31_kinshasa_night', { cam: cam(1250, 860, 1.55, 1376, 800, 1.2), front: amaniN }), 'dissolve', 1.2],
    [S('11', 'Same morning') - .2, plate('p32_kinshasa_dawn', { cam: cam(1376, 800, 1.12, 1300, 840, 1.3), front: amaniD }), 'flash', 1],
    [S('11', 'The virus genome') - .2, plate('p30_field_office', { cam: cam(1376, 800, 1.15, 1450, 760, 1.38), fx: both(X.pins({ t0: S('11', 'The case map'), t1: 1e9, pts: MAPPTS, step: .25, hourly: { from: 9, every: .9, x: 1300, y: 96 } }), caption(S('11', 'The virus genome'), 'virus genome', 'assembled before lunch', { dur: 3, x: 1250 })) }), 'dissolve', 1],
    [S('11', "She isn't working") - .2, plate('p32_kinshasa_dawn', { cam: cam(1300, 840, 1.35, 1376, 800, 1.2), front: amaniD, fx: lampFlicker(1990, 560, 260, C.amber, '#fff3dd', .4) }), 'dissolve', 1],
    [S('11', 'Same curve in both') - .2, split2(plate('p31_kinshasa_night', { cam: cam(1376, 820, 1.2, 1300, 820, 1.3), front: amaniN }), plate('p32_kinshasa_dawn', { cam: cam(1376, 820, 1.2, 1300, 820, 1.3), front: amaniD }), 'we waited', 'we built the checks'), 'dissolve', 1],
  );

  // ===== 12 How we get there =====
  const veto = { words: WD('12a', 'Anthropic can\'t', 'publication'), who: 'Anthropic', role: 'on embedding METR evaluators', date: '15 Oct 2026', source: 'Anthropic · “An update on independent evaluators”', hi: ['veto'], size: 72 };
  const every = { words: WD('12a', 'we believe', 'the same'), who: 'Anthropic', role: 'same post', date: '15 Oct 2026', source: 'Anthropic · “An update on independent evaluators”', hi: ['every'], size: 64 };
  const muyembe = { words: WD('12d', 'You beat Ebola', 'last week'), who: 'Dr. Jean-Jacques Muyembe', role: 'virologist, INRB Kinshasa', date: 'Sep 2026', source: 'Ebola response, DR Congo', hi: ['today'], size: 62 };
  const ev = [1075, 1960, 1300, 1485, 250, 435];
  L.push(
    [SEC['12a'].start - .4, card('How we get there', '', { size: 110 }), 'up', 1.4],
    [S('12a', 'On October fifteenth') - .3, plate('p33_glass_lab', { cam: cam(1376, 820, 1.15, 1376, 760, 1.38), front: (ctx, t, m, P) => { const u = lin(S('12a', 'On October fifteenth'), S('12a', 'In the company') + 1, t); const sp = P.sp.evaluators; if (sp) standFigure(ctx, sp, m.X(mix(ev[0], ev[1], u)), m.Y(mix(ev[2], ev[3], u)), mix(ev[4], ev[5], u) * m.k, t, {}); }, fx: (c, t) => stamp(c, t, S('12a', 'On October fifteenth'), '15 Oct', 'METR inside Anthropic') }), 'dissolve', 1],
    [S('12a', "In the company's") - .2, M2.quotePage({ ...veto, bg: plate('p33_glass_lab', { cam: cam(1376, 760, 1.38, 1376, 740, 1.48) }) }), 'push', 1],
    [S('12a', "It's voluntary") - .2, plate('p33_glass_lab', { cam: cam(1250, 800, 1.4, 1500, 820, 1.2), fx: X.chips({ items: [{ t: S('12a', "It's voluntary"), text: 'voluntary' }, { t: S('12a', "It's one company"), text: 'one company' }, { t: S('12a', 'Six people'), text: 'six people' }], t1: 1e9, y: 700 }) }), 'dissolve', 1],
    [S('12a', 'But the company') - .2, M2.quotePage({ ...every, bg: plate('p33_glass_lab', { cam: cam(1500, 820, 1.2, 1450, 800, 1.3) }) }), 'push', 1],
    [SEC['12b'].start - .3, plate('p34_hotline_1963', { cam: cam(1376, 820, 1.15, 1300, 860, 1.4), fx: both(lampFlicker(1030, 620, 220, C.amber, '#fff3dd', 1), (c, t) => stamp(c, t, S('12b', 'In nineteen sixty-three'), '1963', 'Washington · Moscow')) }), 'left', 1.2],
    [S('12b', 'On September twenty-sixth') - .2, hotline(S('12b', 'On September twenty-sixth') + .5), 'dissolve', 1],
    [S('12b', 'Coverage called') - .2, plate('p34_hotline_1963', { cam: cam(1300, 860, 1.4, 1376, 820, 1.2), fx: X.chips({ items: [{ t: S('12b', 'Coverage called'), text: '“short on breakthroughs”' }, { t: S('12b', 'The real talks'), text: 'real talks start in November' }, { t: S('12b', "A channel isn't"), text: 'a channel, not a treaty', col: C.amber }], t1: 1e9, y: 700 }) }), 'dissolve', 1],
    [S('12b', 'But when things') - .2, hotline(S('12b', 'But when things') - 2.5), 'dissolve', 1],
    [SEC['12c'].start - .3, plate('p28_problem_library', { cam: cam(1376, 820, 1.2, 1376, 760, 1.38), fx: both(lampsOn(lampsP28, 0, 0), X.proof({ t0: S('12c', 'Those ten') - .3, t1: 1e9, rate: 3.2, label: 'lines checked by a computer' })) }), 'left', 1.2],
    [S('12c', 'And the Navier') - .2, plate('p23_lab_night', { cam: cam(1300, 780, 1.2, 1376, 800, 1.35), fx: both(caption(S('12c', 'And the Navier'), 'Navier–Stokes claim, Sep 2026', 'disputed in public', { color: C.cream, dur: 4 }), X.proof({ t0: S('12c', 'And the Navier'), t1: 1e9, rate: 2.4, fail: 11, label: 'checked by mathematicians' })) }), 'dissolve', 1],
    [S('12c', 'In July') - .3, names(S('12c', 'more than eleven')), 'push', 1],
    [S('12c', 'Checking costs') - .2, plate('p28_problem_library', { cam: cam(1376, 760, 1.38, 1376, 820, 1.18), fx: both(lampsOn(lampsP28, 0, 0), X.chips({ items: [{ t: S('12c', 'Checking costs') + .4, text: 'costs time' }, { t: S('12c', 'and money'), text: 'costs money' }, { t: S('12c', 'won\'t hand us'), text: 'never free', col: C.amber }], t1: 1e9, y: 700 })) }), 'dissolve', 1],
    [SEC['12d'].start - .3, plate('p30_field_office', { cam: cam(1376, 800, 1.15, 1450, 760, 1.38), fx: both((c, t) => stamp(c, t, S('12d', 'This September'), 'Sep 2026', 'Ebola response · DR Congo'), X.pins({ t0: S('12d', 'health workers'), t1: 1e9, pts: MAPPTS, step: .3 }), X.shrinkBar({ t0: S('12d', 'A report that') - .2, t1: 1e9, tShrink: S('12d', 'can now take'), title: 'daily situation report', fromLabel: 'all day', toLabel: 'under an hour', x: 1100, y: 820 })) }), 'left', 1.2],
    [S('12d', 'The virologist') - .2, M2.quotePage({ ...muyembe, bg: plate('p30_field_office', { cam: cam(1450, 760, 1.38, 1450, 740, 1.48) }) }), 'push', 1],
    [S('12d', "That didn't happen") - .2, plate('p14_clinic', { cam: cam(1500, 900, 1.3, 1600, 860, 1.45), front: stand('doctor', 1650, 1430, 640), fx: X.icons({ items: [{ t: S('12d', 'Someone chose'), kind: 'target', label: 'someone chose the problem' }], t1: 1e9, y: 300, x0: 520 }) }), 'dissolve', 1],
    [S('12d', 'Cheap intelligence') - .2, plate('p26_classroom', { cam: cam(1250, 1000, 1.4, 1400, 900, 1.2), front: stand('student', 1380, 1440, 700, { sway: .5 }), fx: both(X.flow({ t0: S('12d', 'Cheap intelligence'), t1: 1e9, tx: 1420, ty: 1180 }), X.chips({ items: [{ t: S('12d', 'Unless public health'), text: 'public health' }, { t: S('12d', 'schools'), text: 'schools' }, { t: S('12d', 'and science'), text: 'science' }, { t: S('12d', 'with the money'), text: '… with the money to match', col: C.amber }], t1: 1e9, y: 180, size: 46 })) }), 'dissolve', 1],
  );

  // ===== 13 Your part =====
  const tEnd = TM.duration;
  L.push(
    [SEC['13'].start - .4, longCurve, 'fog', 1.4],
    [S('13', 'So next time') - .2, card('Who checked it?', 'When was the last one like it?', { size: 104, size2: 58, t2: S('13', 'And when was') - .2 }), 'dissolve', 1],
    [S('13', 'This will surprise') - .2, card('It will surprise almost everyone.', 'It doesn’t have to surprise you.', { size: 78, size2: 58, t2: S('13', "It doesn't") - .2 }), 'dissolve', 1],
    [S('13', 'And if you want') - .2, plate('p24_parliament', { cam: cam(1376, 900, 1.15, 1376, 700, 1.4), fx: X.chips({ items: [{ t: S('13', 'outside testing'), text: 'outside testing:' }, { t: S('13', 'a rule'), text: 'a rule, not a favour', col: C.amber }], t1: 1e9, y: 760, size: 62 }) }), 'up', 1.4],
    [S('13', 'Somewhere on this') - .2, plate('p20_hill_dawn', { cam: cam(1250, 900, 1.25, 1600, 600, 1.3), front: you, fx: skyCurve(S('13', 'Somewhere on this'), 3.5, C.amber) }), 'fog', 1.6],
    [S('13', "What's the last") - .2, card('What’s the last AI headline', 'that made you stop?', { size: 88, size2: 60, col2: C.cream }), 'dissolve', 1.4],
    [E('13', 'in the comments') + 1.2, M.title('AI is moving faster', 'than you think'), 'dissolve', 1.6],
  );

  if (process.env.SHOTS) { const T = TM.words; const out = L.map((x, i) => { const a = x[0], b = (L[i + 1] || [tEnd])[0]; return { i, a: +a.toFixed(1), b: +b.toFixed(1), txt: T.filter((w) => w.s >= a && w.s < b).map((w) => w.w).join(" ") }; }); fs.writeFileSync(process.env.SHOTS, JSON.stringify(out, null, 1)); }
  const film = new Film(seq(L, tEnd), { grainAmt: .05 });
  const drops = [...LC.cards, ...dayCards].map((c) => ({ f: 'card', t: c.t + .35, v: .7 }));
  film.sound = soundPlan(film.shots, [
    ...drops,
    { f: 'chime', t: tTitle + .3, v: .7 },
    { f: 'tick', t: SEC['03'].start, d: SEC['08'].end - SEC['03'].start, v: .22, loop: 1 },
    { f: 'bloom', t: S('08', 'almost everyone'), v: .6 },
    { f: 'tone', t: S('09', "It isn't closed"), v: .5 },
    { f: 'teletype', t: S('12b', 'In nineteen sixty-three'), d: 6, v: .5 },
    { f: 'chime', t: S('13', "Let's make sure"), v: .5 },
    { f: 'chime', t: E('13', 'in the comments') + 1.4, v: .7 },
  ]);
  return film;
}

// ---------- sound plan: ambience per plate, a whoosh per motion transition, plus hand-placed accents ----------
const AMB = {
  p01_desk1965: ['amb_hill', .25], p02_dc_ext: ['amb_hill', .4], p03_hill_night: ['amb_hill', .5], p20_hill_dawn: ['amb_dawn', .45],
  p04_gen1890: ['amb_1890', .55], p05_gen1969: ['amb_1969', .55], p06_gen2026: ['amb_2026', .5], p07_paris: ['amb_2026', .22],
  p08_dc_int: ['amb_dc', .5], p09_mountain: ['amb_mountain', .5], p11_desk2035_night: ['amb_rain', .5], p12_desk2035_dawn: ['amb_dawn', .45],
  p13_lahore_roof: ['amb_roof', .45], p14_clinic: ['amb_dawn', .25], p15_balcony2020: ['amb_hill', .3], p16_seoul: ['amb_2026', .3],
  p17_core_hall: ['amb_hall', .55], p18_bazaar: ['amb_bazaar', .5], p19_pylons: ['amb_pylons', .45], p21_school_gate: ['amb_dawn', .35],
  p22_stairs_phone: ['amb_2026', .3], p23_lab_night: ['amb_dc', .25], p24_parliament: ['amb_parl', .5], p25_roof_panel: ['amb_roof', .45],
  p26_classroom: ['amb_class', .45],
  p27_dna_sea: ['amb_hall', .45], p28_problem_library: ['amb_hall', .4], p29_office_overnight: ['amb_dc', .25], p30_field_office: ['amb_dawn', .35],
  p31_kinshasa_night: ['amb_rain', .5], p32_kinshasa_dawn: ['amb_dawn', .45], p33_glass_lab: ['amb_hill', .4], p34_hotline_1963: ['amb_1969', .3],
};
const TR = { push: ['whoosh', .45], left: ['whoosh', .4], right: ['whoosh', .4], up: ['whoosh_up', .5], down: ['whoosh_up', .45], fog: ['gust', .5], flash: ['bloom', .6] };
function soundPlan(shots, accents) {
  const out = [];
  for (const s of shots) {
    const a = AMB[s.draw.pid]; if (a) out.push({ f: a[0], t: s.a, d: s.b - s.a, v: a[1], loop: 1, fade: .8 });
    if (s.draw.pid === 'p02_dc_ext' || s.draw.pid === 'p08_dc_int') out.push({ f: 'steps', t: s.a + .3, d: Math.min(8, s.b - s.a - .5), v: .35, fade: .6 });
  }
  for (let i = 1; i < shots.length; i++) { const k = shots[i - 1].out?.kind, tr = TR[k]; if (tr) out.push({ f: tr[0], t: shots[i].a - .3, v: tr[1] }); }
  return out.concat(accents);
}
