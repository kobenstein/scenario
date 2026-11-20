// C4 helper "tap" (bild/shots.md: 2.14, 2.15, 2.16a, 2.16b, 2.19): the big engraved brass tap over the paper map, its wheel,
// a stream of new banknotes (note particles, deterministic), arcs that branch to buckets, engraved buckets with a fill level,
// and the growing heap of notes under the tap. Owner c04. Everything drawn in code, cached where static.
//   drawTap(ctx, x, y, s, { ang, turn, res, a }) → { mouth:[x,y], wheel:[x,y], wheelR, toS(lx,ly) }   x,y = mouth (outlet) on screen
//   stream(ctx, t, { src(tb)→{x,y,vx,vy}, open(tb)→0..1, rate, g, floor(x)→y, s, seed, a, glow })   notes falling from the mouth
//   arcs(ctx, t, { src{x,y}, targets:[{x,y,w}], open(tb), rate, s, seed, a, hgt })   notes flying on parabolas into buckets (by share w)
//   bucket(ctx, x, y, s, fill, { t, a, seed, glow })   engraved pail standing at x,y (bottom centre), R = 92 px * s; fill 0..1.15
//   heap(ctx, x, y, w, h, { t, a })   a mound of notes (base centre x,y), w = base width, h = height
import { Path2D } from '@napi-rs/canvas';
import { rgba, clamp, mix, prng, canvas, addGlow } from '../engine.mjs';
import { stipple } from './art.mjs';
import { noteSprite, NW, NH, VERD, VERD_D, VERD_L, CREAM, TAU, mixHex } from './sc04_art.mjs';

const CACHE = new Map(); const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const hash = (i, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const BRASS = ['#2a1a0c', '#6b4a22', '#b98a46', '#f0cf8a', '#fff1d0'];

// ---------- tube shading: offset strokes give a cylinder lit from the upper left ----------
function tube(g, pts, r, { lx = -.55, ly = -.83, cols = BRASS, hatchA = .5 } = {}) {
  const path = () => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); };
  g.lineCap = 'butt'; g.lineJoin = 'round';
  const steps = 16;
  for (let k = 0; k <= steps; k++) {
    const q = k / steps, w = 2 * r * (1 - q * .92), off = r * q * .5;
    const col = q < .25 ? mixHex(cols[0], cols[1], q / .25) : q < .6 ? mixHex(cols[1], cols[2], (q - .25) / .35) : q < .9 ? mixHex(cols[2], cols[3], (q - .6) / .3) : mixHex(cols[3], cols[4], (q - .9) / .1);
    g.save(); g.translate(lx * off, ly * off); g.strokeStyle = col; g.lineWidth = w; path(); g.stroke(); g.restore();
  }
  // engraved hatching across the tube on the shadow side
  g.save(); g.strokeStyle = rgba('#1a0f06', hatchA); g.lineWidth = 1;
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], L = Math.hypot(x1 - x0, y1 - y0), nx = -(y1 - y0) / (L || 1), ny = (x1 - x0) / (L || 1);
    const side = (nx * lx + ny * ly) > 0 ? -1 : 1;
    for (let s = (6 - acc % 6); s < L; s += 6) { const q = s / L, cx = mix(x0, x1, q), cy = mix(y0, y1, q); g.beginPath(); g.moveTo(cx + nx * side * r * .2, cy + ny * side * r * .2); g.lineTo(cx + nx * side * r * .96, cy + ny * side * r * .96); g.stroke(); }
    acc += L;
  }
  g.restore();
}
function band(g, x, y, ang, r, wid) { // a flange ring across a tube at x,y (tube direction ang)
  g.save(); g.translate(x, y); g.rotate(ang);
  const gr = g.createLinearGradient(0, -r, 0, r); gr.addColorStop(0, BRASS[4]); gr.addColorStop(.25, BRASS[3]); gr.addColorStop(.6, BRASS[1]); gr.addColorStop(1, BRASS[0]);
  g.fillStyle = gr; g.beginPath(); g.roundRect(-wid / 2, -r, wid, 2 * r, 4); g.fill();
  g.strokeStyle = 'rgba(30,18,6,.7)'; g.lineWidth = 1.2; g.stroke();
  g.fillStyle = 'rgba(30,18,6,.55)'; for (let i = -1; i <= 1; i += 2) { g.beginPath(); g.arc(i * wid * .28, -r * .55, 3, 0, TAU); g.fill(); }
  g.restore();
}
// the tap without its wheel, in local units (mouth at 0,0, pipe runs off to the upper right)
const OX = 120, OY = 560, TW = 3000, TH = 640;
function tapSprite(res = 1) {
  return once('tap' + res, () => {
    const [c, g] = canvas(Math.ceil(TW * res), Math.ceil(TH * res)); g.scale(res, res); g.translate(OX, OY);
    // main pipe from far right into the valve body
    tube(g, [[2860, -330], [330, -330]], 44);
    band(g, 1200, -330, 0, 52, 26); band(g, 2100, -330, 0, 52, 26); band(g, 360, -330, 0, 54, 30);
    // the spout: out of the body, a bend down to the mouth
    const sp = []; for (let i = 0; i <= 40; i++) { const q = i / 40, a = (1 - q) * Math.PI / 2; sp.push([150 - 150 * Math.cos(a) + 0, -330 + 150 * (1 - Math.sin(a))]); }
    const spout = [[170, -330], ...sp.map(([x, y]) => [x, y]), [0, -60]];
    tube(g, spout, 36);
    // mouth ring
    band(g, 0, -40, Math.PI / 2, 44, 34);
    g.fillStyle = '#0b0703'; g.beginPath(); g.ellipse(0, -22, 30, 7, 0, 0, TAU); g.fill();
    // valve body (a bulbous casting) + stem
    const bx = 250, by = -330;
    const bg = g.createRadialGradient(bx - 40, by - 50, 6, bx, by, 110); bg.addColorStop(0, BRASS[4]); bg.addColorStop(.25, BRASS[3]); bg.addColorStop(.6, BRASS[2]); bg.addColorStop(1, BRASS[0]);
    g.fillStyle = bg; g.beginPath(); g.ellipse(bx, by, 92, 76, 0, 0, TAU); g.fill();
    g.save(); g.beginPath(); g.ellipse(bx, by, 92, 76, 0, 0, TAU); g.clip(); g.strokeStyle = 'rgba(26,15,5,.42)'; g.lineWidth = 1;
    for (let i = 0; i < 40; i++) { const a = .1 + i / 40 * 2.4; g.beginPath(); g.ellipse(bx, by, 92 - i * .6, 76 - i * .5, 0, a, a + .02); g.stroke(); }
    for (let k = 0; k < 26; k++) { const a = .2 + k * .09; g.beginPath(); g.moveTo(bx + Math.cos(a) * 30, by + Math.sin(a) * 26); g.lineTo(bx + Math.cos(a) * 92, by + Math.sin(a) * 76); g.stroke(); }
    g.restore();
    g.strokeStyle = 'rgba(30,18,6,.75)'; g.lineWidth = 1.6; g.beginPath(); g.ellipse(bx, by, 92, 76, 0, 0, TAU); g.stroke();
    // engraved band of guilloche on the body
    g.save(); g.strokeStyle = rgba('#2a1606', .55); g.lineWidth = .8; for (let l = 0; l < 4; l++) { g.beginPath(); for (let i = 0; i <= 80; i++) { const a = Math.PI * .1 + i / 80 * Math.PI * .8, rr = 64 + l * 3 + 3 * Math.sin(i * .9 + l); const x = bx + Math.cos(a) * rr * 1.2, y = by + Math.sin(a) * rr * .55 + 8; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); } g.restore();
    tube(g, [[bx, by - 70], [bx, by - 150]], 15);
    band(g, bx, by - 88, Math.PI / 2, 26, 14);
    // verdigris patina in the creases (ties the tap to PRINT)
    g.save(); g.globalCompositeOperation = 'source-atop'; const pr = prng(31);
    for (let i = 0; i < 260; i++) { const x = -40 + pr() * 2900, y = -380 + pr() * 360; const rr = 2 + pr() * 9; g.fillStyle = rgba(VERD, .06 + pr() * .1); g.beginPath(); g.arc(x, y, rr, 0, TAU); g.fill(); }
    g.restore();
    stipple(c, { k: .35, g: 1, seed: 12, mid: false, boost: 1 });
    return c;
  });
}
// the wheel handle lies flat on the stem (seen from a little above): an ellipse with five spokes that turn
function drawWheel(ctx, x, y, R, turn, s = 1) {
  const ry = .34;
  ctx.save(); ctx.translate(x, y);
  // back rim, spokes, hub, front rim
  const rim = (a0, a1, w, col) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const a = mix(a0, a1, i / 40); const px = Math.cos(a) * R, py = Math.sin(a) * R * ry; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); };
  ctx.lineCap = 'round';
  rim(Math.PI, TAU, 13 * s, BRASS[1]); rim(Math.PI, TAU, 6 * s, BRASS[2]);
  for (let k = 0; k < 5; k++) {
    const a = turn + k * TAU / 5, ex = Math.cos(a) * R, ey = Math.sin(a) * R * ry, front = Math.sin(a) > 0;
    ctx.strokeStyle = front ? BRASS[2] : BRASS[1]; ctx.lineWidth = 9 * s; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.strokeStyle = rgba(BRASS[4], front ? .55 : .25); ctx.lineWidth = 2 * s; ctx.beginPath(); ctx.moveTo(0, -2 * s); ctx.lineTo(ex, ey - 2 * s); ctx.stroke();
  }
  const hg = ctx.createRadialGradient(-6 * s, -6 * s, 1, 0, 0, 22 * s); hg.addColorStop(0, BRASS[4]); hg.addColorStop(.5, BRASS[2]); hg.addColorStop(1, BRASS[0]);
  ctx.fillStyle = hg; ctx.beginPath(); ctx.ellipse(0, 0, 22 * s, 13 * s, 0, 0, TAU); ctx.fill();
  rim(0, Math.PI, 14 * s, BRASS[1]); rim(0, Math.PI, 7 * s, BRASS[2]); rim(.25, 1.6, 2.4 * s, rgba(BRASS[4], .8));
  // knurling marks travel with the turn so the rotation reads even on the rim
  ctx.strokeStyle = 'rgba(30,18,6,.6)'; ctx.lineWidth = 1.4 * s;
  for (let k = 0; k < 36; k++) { const a = turn + k * TAU / 36, sn = Math.sin(a); if (sn < .05) continue; const px = Math.cos(a) * R, py = sn * R * ry; ctx.beginPath(); ctx.moveTo(px, py - 5 * s); ctx.lineTo(px, py + 5 * s); ctx.stroke(); }
  ctx.restore();
}
export const WHEEL = { x: 250, y: -500, R: 92 };
export function drawTap(ctx, x, y, s, o = {}) {
  const ang = o.ang ?? 0, res = o.res ?? 1, S = tapSprite(res), a = o.a ?? 1;
  const c = Math.cos(ang), sn = Math.sin(ang), toS = (lx, ly) => [x + (lx * c - ly * sn) * s, y + (lx * sn + ly * c) * s];
  ctx.save(); ctx.globalAlpha *= a;
  // soft shadow of the tap on whatever lies below (offset down-left, the light comes from the upper left)
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  ctx.drawImage(S, -OX, -OY, TW, TH);
  drawWheel(ctx, WHEEL.x, WHEEL.y, WHEEL.R, o.turn ?? 0, 1);
  ctx.restore(); ctx.restore();
  return { mouth: [x, y], wheel: toS(WHEEL.x, WHEEL.y), wheelR: WHEEL.R * s, toS };
}

// ---------- note particles ----------
const NS = 64, NSH = 29;   // particle note size at s = 1
function mini() { return once('mini', () => { const [c, g] = canvas(NS * 2, NSH * 2); g.drawImage(noteSprite(), 0, 0, NS * 2, NSH * 2); return c; }); }
function miniBack() { return once('miniB', () => { const [c, g] = canvas(NS * 2, NSH * 2); g.fillStyle = '#d9d0b6'; g.fillRect(0, 0, NS * 2, NSH * 2); g.strokeStyle = rgba(VERD_D, .7); g.lineWidth = 3; g.strokeRect(5, 5, NS * 2 - 10, NSH * 2 - 10); g.fillStyle = rgba(VERD_D, .35); g.beginPath(); g.ellipse(NS, NSH, 22, 14, 0, 0, TAU); g.fill(); return c; }); }
function note(ctx, x, y, rot, flip, sc, a = 1, B = null) {   // B = the caller's base transform (camera), composed by hand (fast)
  const M = flip >= 0 ? mini() : miniBack(), f = Math.max(.12, Math.abs(flip));
  const la = Math.cos(rot) * sc, lb = Math.sin(rot) * sc, lc = -Math.sin(rot) * sc * f, ld = Math.cos(rot) * sc * f;
  if (B) ctx.setTransform(B.a * la + B.c * lb, B.b * la + B.d * lb, B.a * lc + B.c * ld, B.b * lc + B.d * ld, B.a * x + B.c * y + B.e, B.b * x + B.d * y + B.f);
  else ctx.setTransform(la, lb, lc, ld, x, y);
  ctx.globalAlpha = a; ctx.drawImage(M, -NS / 2, -NSH / 2, NS, NSH);
}
// a stream of notes from a moving mouth: particle i is born at i / rate, exists if its hash is under the opening at birth
export function stream(ctx, t, o) {
  const rate = o.rate ?? 70, g = o.g ?? 2300, life = o.life ?? 1.6, s = o.s ?? 1, seed = o.seed ?? 1, a = o.a ?? 1;
  const base = ctx.getTransform();
  const i0 = Math.floor((t - life) * rate), i1 = Math.floor(t * rate);
  const pts = [];
  for (let i = i0; i <= i1; i++) {
    const tb = i / rate, op = o.open(tb); if (op <= 0) continue; const h0 = hash(i, seed); if (h0 > op * (o.density ?? 1)) continue;
    const S0 = o.src(tb), age = t - tb; if (age < 0) continue;
    const spread = (o.spread ?? 26) * Math.sqrt(op) * s, h1 = hash(i, seed + 1), h2 = hash(i, seed + 2), h3 = hash(i, seed + 3);
    const vx = (S0.vx ?? 0) + (h1 - .5) * 120 * s, vy = (S0.vy ?? 260) * s;
    let x = S0.x + (h2 - .5) * spread + vx * age + Math.sin(age * 7 + i) * 6 * s * age, y = S0.y + vy * age + .5 * g * s * age * age;
    const fl = o.floor ? o.floor(x) : 1e9; if (y > fl) { if (o.land) o.land(i, x, fl, tb + 0); continue; }
    pts.push([x, y, h3, age, i]);
  }
  // a faint verdigris light inside the stream (reads as a gush, not water)
  if (o.glow !== false && pts.length > 2) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const [x, y] of pts) { ctx.fillStyle = rgba(VERD, .045 * a); ctx.beginPath(); ctx.arc(x, y, 22 * s, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
  ctx.save();
  for (const [x, y, h3, age, i] of pts) {
    const rot = h3 * TAU + age * (2 + h3 * 4) * (h3 > .5 ? 1 : -1), flip = Math.cos(age * (6 + h3 * 8) + i);
    note(ctx, x, y, rot, flip, s * (o.size ?? 1) * (.75 + h3 * .5), a, base);
  }
  ctx.setTransform(base); ctx.restore();
  return pts.length;
}
// notes flying on parabolas from src to targets, picked by share
export function arcs(ctx, t, o) {
  const rate = o.rate ?? 90, s = o.s ?? 1, seed = o.seed ?? 5, a = o.a ?? 1, T = o.targets, tot = T.reduce((q, b) => q + b.w, 0);
  const base = ctx.getTransform(); const fl = o.flight ?? 1.1;
  const i0 = Math.floor((t - fl * 1.4) * rate), i1 = Math.floor(t * rate);
  ctx.save();
  const glow = [];
  for (let i = i0; i <= i1; i++) {
    const tb = i / rate, op = o.open(tb); if (op <= 0) continue; if (hash(i, seed) > op) continue;
    let pick = hash(i, seed + 1) * tot, k = 0; while (k < T.length - 1 && pick > T[k].w) { pick -= T[k].w; k++; }
    const B = T[k], d = Math.hypot(B.x - o.src.x, B.y - o.src.y), Tf = fl * (.55 + d / 1600), q = (t - tb) / Tf; if (q < 0 || q > 1) continue;
    const h = (o.hgt ?? 260) * s * (.6 + d / 1400), j = (hash(i, seed + 2) - .5) * 24 * s;
    const x = mix(o.src.x, B.x + j, q), y = mix(o.src.y, B.y - 10 * s, q) - h * 4 * q * (1 - q);
    const h3 = hash(i, seed + 3), rot = h3 * TAU + q * 5 * (h3 > .5 ? 1 : -1), flip = Math.cos(q * 9 + i);
    note(ctx, x, y, rot, flip, s * (o.size ?? .8) * (.75 + h3 * .5), a * Math.min(1, (1 - q) * 6), base);
    glow.push([x, y]);
  }
  ctx.setTransform(base); ctx.restore();
  if (glow.length) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (const [x, y] of glow) { ctx.fillStyle = rgba(VERD, .04 * a); ctx.beginPath(); ctx.arc(x, y, 16 * s, 0, TAU); ctx.fill(); } ctx.restore(); }
}

// ---------- the heap of notes ----------
function heapTex() {
  return once('heapTex', () => {
    const w = 900, h = 420, [c, g] = canvas(w, h), r = prng(77), M = mini(), Mb = miniBack();
    g.fillStyle = '#cfc6a8'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 1500; i++) { const y = r() * h, x = r() * w, rot = (r() - .5) * 2.6, sc = .55 + r() * .5; g.setTransform(Math.cos(rot) * sc, Math.sin(rot) * sc, -Math.sin(rot) * sc * (.4 + r() * .6), Math.cos(rot) * sc * (.4 + r() * .6), x, y); g.globalAlpha = .95; g.drawImage(r() < .7 ? M : Mb, -NS / 2, -NSH / 2, NS, NSH); }
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; stipple(c, { k: .3, g: 1, seed: 8, mid: false, boost: 1 });
    return c;
  });
}
export function heap(ctx, x, y, w, h, o = {}) {
  if (h < 1) return; const a = o.a ?? 1, t = o.t ?? 0;
  const prof = (q) => Math.exp(-Math.pow(q * 3.6, 2)) * (1 + .03 * Math.sin(q * 30 + t * .5));
  const p = new Path2D(); p.moveTo(x - w / 2, y);
  for (let i = 0; i <= 60; i++) { const q = i / 60 - .5; p.lineTo(x + q * w, y - h * prof(q) + (Math.abs(q) > .46 ? 0 : 0)); }
  p.lineTo(x + w / 2, y); p.closePath();
  ctx.save(); ctx.globalAlpha = a;
  // contact shadow
  ctx.fillStyle = 'rgba(20,14,8,.35)'; ctx.beginPath(); ctx.ellipse(x + w * .04, y + 4, w * .56, Math.max(8, w * .07), 0, 0, TAU); ctx.fill();
  ctx.save(); ctx.clip(p); const T = heapTex(); ctx.drawImage(T, x - w / 2, y - h - 10, w, h + 14);
  const sh = ctx.createLinearGradient(x - w / 2, y - h, x + w / 2, y); sh.addColorStop(0, 'rgba(255,248,226,.18)'); sh.addColorStop(.5, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(20,24,40,.45)');
  ctx.fillStyle = sh; ctx.fillRect(x - w / 2, y - h - 10, w, h + 14);
  const bt = ctx.createLinearGradient(0, y - h * .3, 0, y); bt.addColorStop(0, 'rgba(0,0,0,0)'); bt.addColorStop(1, 'rgba(20,24,40,.35)'); ctx.fillStyle = bt; ctx.fillRect(x - w / 2, y - h, w, h);
  ctx.restore();
  ctx.strokeStyle = 'rgba(40,40,40,.25)'; ctx.lineWidth = 1; ctx.stroke(p);
  ctx.restore();
}

// ---------- buckets ----------
export function bucket(ctx, x, y, s, fill, o = {}) {
  const R = 92 * s, Hh = 150 * s, ry = .3, rb = R * .8, a = o.a ?? 1, t = o.t ?? 0;
  const top = y - Hh; ctx.save(); ctx.globalAlpha = a;
  // shadow on the map
  ctx.fillStyle = 'rgba(25,16,8,.38)'; ctx.beginPath(); ctx.ellipse(x + R * .25, y + 4 * s, rb * 1.3, rb * ry * 1.25, 0, 0, TAU); ctx.fill();
  // body (tin, engraved): trapezoid with elliptic ends
  const body = new Path2D(); body.moveTo(x - R, top); body.lineTo(x - rb, y); body.ellipse(x, y, rb, rb * ry, 0, Math.PI, 0, true); body.lineTo(x + R, top); body.ellipse(x, top, R, R * ry, 0, 0, Math.PI, false); body.closePath();
  const bg = ctx.createLinearGradient(x - R, 0, x + R, 0); bg.addColorStop(0, '#d8d2c2'); bg.addColorStop(.22, '#a9a596'); bg.addColorStop(.55, '#5c5a58'); bg.addColorStop(1, '#2a2a30');
  ctx.fillStyle = bg; ctx.fill(body);
  ctx.save(); ctx.clip(body); ctx.strokeStyle = 'rgba(20,20,26,.35)'; ctx.lineWidth = Math.max(.6, .9 * s);
  for (let i = 0; i < 26; i++) { const q = i / 25, xx = mix(x - R, x + R, q), xb = mix(x - rb, x + rb, q); if (q < .45) continue; ctx.beginPath(); ctx.moveTo(xx, top); ctx.lineTo(xb, y + rb * ry); ctx.stroke(); }
  for (const hq of [.18, .82]) { const yy = mix(top, y, hq), rr = mix(R, rb, hq); ctx.strokeStyle = 'rgba(25,25,30,.75)'; ctx.lineWidth = 3.2 * s; ctx.beginPath(); ctx.ellipse(x, yy, rr, rr * ry, 0, 0, Math.PI); ctx.stroke(); ctx.strokeStyle = 'rgba(255,250,235,.35)'; ctx.lineWidth = 1.2 * s; ctx.beginPath(); ctx.ellipse(x, yy - 2 * s, rr, rr * ry, 0, .2, 1.4); ctx.stroke(); }
  ctx.restore();
  // inside: back wall, then the content level
  ctx.save(); ctx.beginPath(); ctx.ellipse(x, top, R * .97, R * ry * .97, 0, 0, TAU); ctx.clip();
  const ig = ctx.createLinearGradient(0, top - R * ry, 0, top + R * ry); ig.addColorStop(0, '#1a1a20'); ig.addColorStop(1, '#4a4844'); ctx.fillStyle = ig; ctx.fillRect(x - R, top - R * ry, 2 * R, 2 * R * ry);
  const f = clamp(fill, 0, 1), lvY = mix(top + Hh * .55, top, f);
  if (f > .01) {
    // the content surface: an ellipse of notes, lit verdigris from inside
    const rr = mix(rb, R, f) * .96; const T = heapTex();
    ctx.save(); ctx.beginPath(); ctx.ellipse(x, lvY, rr, rr * ry, 0, 0, TAU); ctx.clip(); ctx.drawImage(T, x - rr, lvY - rr * ry, 2 * rr, 2 * rr * ry); ctx.restore();
    ctx.globalCompositeOperation = 'lighter'; const gl = ctx.createRadialGradient(x, lvY, 0, x, lvY, rr); gl.addColorStop(0, rgba(VERD, .28 * (o.glow ?? 1))); gl.addColorStop(1, rgba(VERD, 0)); ctx.fillStyle = gl; ctx.fillRect(x - rr, lvY - rr, 2 * rr, 2 * rr);
  }
  ctx.restore();
  // heaped above the rim when over-full
  if (fill > 1) heap(ctx, x, top + 2 * s, R * 1.6, (fill - 1) * 300 * s, { t, a: 1 });
  // rim
  ctx.strokeStyle = '#2a2a30'; ctx.lineWidth = 5 * s; ctx.beginPath(); ctx.ellipse(x, top, R, R * ry, 0, 0, TAU); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,250,235,.75)'; ctx.lineWidth = 1.6 * s; ctx.beginPath(); ctx.ellipse(x, top - 1.5 * s, R, R * ry, 0, Math.PI * 1.05, Math.PI * 1.7); ctx.stroke();
  // the bail handle
  ctx.strokeStyle = '#3a3a40'; ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.moveTo(x - R * .98, top + 4 * s); ctx.bezierCurveTo(x - R * .9, top - R * 1.05, x + R * .9, top - R * 1.05, x + R * .98, top + 4 * s); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,250,235,.4)'; ctx.lineWidth = 1 * s; ctx.beginPath(); ctx.moveTo(x - R * .9, top - R * .2); ctx.bezierCurveTo(x - R * .7, top - R * .78, x, top - R * .8, x + R * .2, top - R * .78); ctx.stroke();
  ctx.restore();
  return { top, R, lvY };
}
