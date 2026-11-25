// Film 70 · THE TRUST BOARD: the explainer stage of the film (owned by the lead; builders import, never edit — wishes go in the report).
// Jakob 24.11. (REGELN §13): "nicht nur eine große szene mit zooms, sondern wie ein richtig schöner motion design film". So the film is NOT
// one world: 60–70 % of it are explainer sequences that show exactly what the sentence says (numbers, comparisons, processes, timelines),
// drawn as LIGHT ON NIGHT BLUE on one recurring ground: THE TRUST BOARD (night blue, a faint cream DOT grid: not #69's line grid). The
// Leitbild (the chain over the night, lib/f70_world.mjs) appears only at 4 anchors: hook, turn, point, end.
//
// Stage: view = { x, y, s } (the board point at the screen centre, scale). board(ctx, t, view) draws the ground; inView(ctx, view, fn)
// draws in board coordinates (1 unit = 1 px at s = 1). viewPath(t, K) glides through keys [[t, view], …] (monotone cubic, log scale).
// Every object grows out of something, is carried in, or morphs; nothing pops. Text ≥ 22 px, ≤ 6 words + one number.
import * as E from './f10_editorial.mjs';
import * as F from './f70_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, rad, prng } = E;
const { GOLD, COOL, LAMP, PAPER, CREAM, CREAM2 } = F;
const TAU = Math.PI * 2;

// ------------------------------------------------------------------------------------------------ the stage
export const V0 = { x: W / 2, y: H / 2, s: 1 };
export function viewPath(t, K) {
  const n = K.length; if (n === 1) return { ...K[0][1] };
  const V = K.map(([, v]) => [v.x, v.y, Math.log(v.s)]), T = K.map((k) => k[0]);
  if (t <= T[0]) t = T[0]; if (t >= T[n - 1]) t = T[n - 1];
  let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
  const h = T[i + 1] - T[i], u = (t - T[i]) / h, out = [];
  for (let d = 0; d < 3; d++) {
    const sec = (j) => (V[j + 1][d] - V[j][d]) / (T[j + 1] - T[j]);
    const tan = (j) => { if (j === 0 || j === n - 1) return 0; const a = sec(j - 1), b = sec(j); if (a * b <= 0) return 0; const m = (a + b) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(a), 3 * Math.abs(b)); };
    const p0 = V[i][d], p1 = V[i + 1][d], m0 = tan(i) * h, m1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
    out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
  }
  return { x: out[0], y: out[1], s: Math.exp(out[2]) };
}
export function inView(ctx, v, fn) { ctx.save(); ctx.setTransform(v.s, 0, 0, v.s, W / 2 - v.x * v.s, H / 2 - v.y * v.s); fn(v.s); ctx.restore(); }
export const toScreen = (v, x, y) => [W / 2 + (x - v.x) * v.s, H / 2 + (y - v.y) * v.s];
// THE TRUST BOARD ground: night blue, a soft light pool where the eye should be (o.lx, o.ly board coords), a faint cream DOT grid that
// moves with the view (so every camera move reads as a move over the board), o.grid 0..1. o.warm 0..1 tints the pool warm (the end).
export function board(ctx, t, v, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.6, P.night1], [1, mixHex(P.night1, P.ind0, .5)]]); ctx.fillRect(0, 0, W, H);
  const [lx, ly] = toScreen(v, o.lx ?? v.x, o.ly ?? v.y - 60);
  ctx.fillStyle = rad(ctx, lx, ly, 900, [[0, rgba(mixHex(P.ind1, LAMP.deep, o.warm ?? 0), .55 * (o.pool ?? 1))], [1, rgba(P.ind1, 0)]]); ctx.fillRect(0, 0, W, H);
  ctx.restore();
  const g = o.grid ?? 1; if (g <= 0) return;
  inView(ctx, v, (s) => {
    const x0 = v.x - W / 2 / s, x1 = v.x + W / 2 / s, y0 = v.y - H / 2 / s, y1 = v.y + H / 2 / s; let step = 60; while (step * s < 34) step *= 4;
    const r = 1.6 / s;
    for (let x = Math.floor(x0 / step) * step; x <= x1; x += step) for (let y = Math.floor(y0 / step) * step; y <= y1; y += step) {
      const major = x % (step * 4) === 0 && y % (step * 4) === 0;
      ctx.fillStyle = rgba(CREAM, (major ? .16 : .075) * g); ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
  });
}
// alias, so #69-style code reads naturally
export const sheet = board;
// a light line (cream with a warm glow) drawn on from a to b over u; o.col, o.w, o.dash
export function lightLine(ctx, pts, u, o = {}) {
  if (u <= 0 || pts.length < 2) return;
  const L = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); tot += d; }
  let rem = tot * clamp(u);
  ctx.save(); ctx.strokeStyle = o.col ?? rgba(CREAM, o.a ?? .85); ctx.lineWidth = o.w ?? 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (o.dash) ctx.setLineDash(o.dash);
  if (o.glow !== false) { ctx.shadowColor = rgba(o.glowCol ?? GOLD.halo, .6); ctx.shadowBlur = o.blur ?? 10; }
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length && rem > 0; i++) { const f = Math.min(1, rem / L[i - 1]); ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)); rem -= L[i - 1]; }
  ctx.stroke(); ctx.restore();
}
// label (Inter caps, ≥ 22 px) that wipes up from a mask
export function label(ctx, txt, x, y, u, o = {}) {
  F.goldText(ctx, [[txt, o.gold ?? 0]], x, y, o.size ?? 24, F.rise(clamp(u)), { serif: false, weight: o.weight ?? 700, spacing: o.spacing ?? .1, align: o.align ?? 'center', col: o.col ?? CREAM });
}
// a big number / statement (Instrument Serif, warm glow)
export function big(ctx, txt, x, y, size, u, o = {}) {
  F.goldText(ctx, [[txt, o.gold ?? .8]], x, y, size, F.rise(clamp(u)), { serif: true, align: o.align ?? 'center', glow: o.glow ?? true, col: o.col });
}
// a small date tag: a cream hairline pill, text 22 px
export function dateTag(ctx, txt, x, y, u, o = {}) {
  if (u <= 0) return;
  ctx.save(); ctx.font = '600 22px Inter'; const w = ctx.measureText(txt).width * 1.08 + 44, k = expoOut(clamp(u)), h = 40;
  ctx.globalAlpha *= clamp(u * 2); ctx.translate(x, y + (1 - k) * 16);
  ctx.fillStyle = rgba(P.night0, .72); ctx.strokeStyle = rgba(CREAM, .55); ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w * k, h, h / 2); ctx.fill(); ctx.stroke();
  ctx.restore();
  label(ctx, txt, x - w / 2 + 22, y + 8, span(u, .3, 1), { align: 'left', size: 22, weight: 600, spacing: .06, col: o.col ?? CREAM });
}

// ------------------------------------------------------------------------------------------------ general explainer objects
// ------------------------------------------------------------------------------------------------ explainer objects
// THE WORLD'S AI COMPUTE as a field of cells (cols × rows), one cell = 1 %. o.on 0..1 (cells light, from the centre outward),
// o.keep [indices] (the EU cells: they stay lit when the rest dims, gold = the hero), o.dim 0..1 (the others fall dark),
// o.pulse 0..1 (a slow pulse over the whole field: "guess"), o.merge 0..1 (the kept cells slide together into one block),
// o.drop 0..1 (the other cells fall away downwards, outer ones first)
export function cells(ctx, t, x, y, cell, cols, rows, o = {}) {
  const gap = cell * .22, n = cols * rows, keep = new Set(o.keep ?? []), cx = x + (cols * (cell + gap) - gap) / 2, cy = y + (rows * (cell + gap) - gap) / 2;
  const on = clamp(o.on ?? 1), dim = clamp(o.dim ?? 0), mg = sineIO(clamp(o.merge ?? 0)), ks = [...keep];
  for (let i = 0; i < n; i++) {
    const c = i % cols, r = Math.floor(i / cols); let px = x + c * (cell + gap), py = y + r * (cell + gap);
    const d = Math.hypot(px - cx, py - cy) / (cols * cell), a = clamp(on * 1.8 - d * 1.2); if (a <= 0) continue;
    const kept = keep.has(i); if (kept && o.hideKeep) continue;
    if (kept && mg > 0) { const j = ks.indexOf(i); px = lerp(px, cx - (ks.length * (cell + gap) - gap) / 2 + j * (cell + gap), mg); py = lerp(py, cy - cell / 2, mg); }
    const pul = 1 - .3 * (.5 - .5 * Math.sin(t * 2.2 - d * 9)) * clamp(o.pulse ?? 0);
    const dr = kept ? 0 : clamp((o.drop ?? 0) * 1.5 - (1 - d) * .5); if (dr >= 1) continue; py += expoIn(dr) * 700;
    const al = (kept ? 1 : 1 - dim * .86) * (1 - dr);
    ctx.fillStyle = kept && dim > 0 ? mixHex(COOL.body, GOLD.hot, dim) : COOL.body;
    ctx.globalAlpha = a * al * (kept ? 1 : pul) * .9;
    ctx.beginPath(); ctx.roundRect(px, py, cell, cell, cell * .18); ctx.fill();
    ctx.globalAlpha = 1;
  }
  if (dim > 0 && keep.size && !o.hideKeep) { const k0 = ks[0], c0 = k0 % cols, r0 = Math.floor(k0 / cols); halo(ctx, lerp(x + c0 * (cell + gap), cx, mg) + cell * 2, lerp(y + r0 * (cell + gap), cy, mg), cell * 6, .35 * dim, GOLD.halo, GOLD.core); }
  return { cx, cy, w: cols * (cell + gap) - gap, h: rows * (cell + gap) - gap };
}
// THE AI (machine as a circle): a cool screen on a small stand with an iris ring that "reads" (o.scan 0..1), o.read (a scan line)
export function aiScreen(ctx, t, x, y, w, o = {}) {
  const h = w * .66, a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = mixHex(P.night0, P.blue1, .3); ctx.fillRect(x - w * .05, y, w * .1, w * .28); ctx.fillRect(x - w * .22, y + w * .26, w * .44, w * .04);
  ctx.fillStyle = mixHex(P.night0, P.blue2, .5); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h, w, h, w * .04); ctx.fill();
  ctx.fillStyle = lin(ctx, x, y - h, x, y, [[0, mixHex(COOL.deep, COOL.body, .35)], [1, COOL.deep]]); ctx.beginPath(); ctx.roundRect(x - w * .45, y - h * .93, w * .9, h * .86, w * .03); ctx.fill();
  const ex = x, ey = y - h * .5, er = h * .26;
  for (let k = 0; k < 3; k++) { ctx.strokeStyle = rgba(COOL.core, .35 + .2 * k); ctx.lineWidth = Math.max(1, w * .012); ctx.beginPath(); ctx.arc(ex, ey, er * (1 - k * .28) * (1 + .04 * Math.sin(t * 1.6 - k)), 0, TAU * .999); ctx.stroke(); }
  ctx.fillStyle = COOL.core; ctx.beginPath(); ctx.arc(ex, ey, er * .18, 0, TAU * .999); ctx.fill();
  halo(ctx, ex, ey, w * .9, .3, COOL.halo, COOL.core);
  const sc = o.scan; if (sc != null && sc > 0 && sc < 1) { ctx.fillStyle = rgba(COOL.core, .7); ctx.fillRect(x - w * .45, y - h * .93 + h * .86 * sc, w * .9, 3); }
  ctx.restore();
  return { ex, ey, er };
}
// a sheet of paper (contract / CV / form): x, y centre, w; o.kind 'contract' | 'cv' | 'form'; o.scan 0..1 (a cool line reads it)
export function doc(ctx, t, x, y, w, o = {}) {
  const h = w * 1.32, u = clamp(o.u ?? 1); if (u <= 0) return;
  ctx.save(); ctx.globalAlpha *= clamp(u * 3) * (o.a ?? 1); ctx.translate(x, y); ctx.rotate(o.rot ?? 0);
  ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-w / 2 + 6, -h / 2 + 8, w, h);
  ctx.fillStyle = lin(ctx, 0, -h / 2, 0, h / 2, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.fillStyle = rgba(PAPER.faint, .55);
  if (o.kind === 'cv') { ctx.beginPath(); ctx.arc(-w * .26, -h * .3, w * .1, 0, TAU * .999); ctx.fill(); for (let j = 0; j < 9; j++) ctx.fillRect(j < 2 ? -w * .1 : -w * .38, -h * .34 + j * h * .075 + (j >= 2 ? h * .08 : 0), w * (j < 2 ? .46 : .72 - (j % 3) * .1), Math.max(1, h * .014)); }
  else if (o.kind === 'form') { for (let j = 0; j < 5; j++) { ctx.fillRect(-w * .38, -h * .34 + j * h * .1, w * .3, Math.max(1, h * .014)); ctx.strokeStyle = rgba(PAPER.faint, .6); ctx.lineWidth = Math.max(1, w * .008); ctx.strokeRect(-w * .02, -h * .36 + j * h * .1, w * .4, h * .045); } }
  else { ctx.fillRect(-w * .38, -h * .38, w * .5, Math.max(2, h * .022)); for (let j = 0; j < 12; j++) ctx.fillRect(-w * .38, -h * .28 + j * h * .055, w * (j % 4 === 3 ? .42 : .76), Math.max(1, h * .012)); ctx.fillRect(w * .05, h * .38, w * .32, Math.max(1, h * .01)); }
  const sc = o.scan ?? -1; if (sc > 0 && sc < 1) { ctx.fillStyle = rgba(COOL.body, .8); ctx.fillRect(-w / 2, -h / 2 + h * sc, w, 3); halo(ctx, 0, -h / 2 + h * sc, w * .6, .25, COOL.halo, COOL.core); }
  ctx.restore();
}


// a crowd that RISES out of its ground line (row by row, front row first): n figures, cols per row, h figure height; o.u 0..1,
// o.leave 0..1 (a share of the figures walks off right: o.leaveN), o.gather [x, y] + o.g 0..1 (they stream together into one point),
// o.dim; seeded. Returns the bounding box.
export function crowdRise(ctx, t, x, y, n, cols, h, o = {}) {
  const r = prng(o.seed ?? 7), gap = h * .44, rows = Math.ceil(n / cols), g = sineIO(clamp(o.g ?? 0));
  const jit = Array.from({ length: n }, () => [r() - .5, r(), r() > .5 ? 1 : -1, r()]);
  for (let row = rows - 1; row >= 0; row--) for (let c = 0; c < cols; c++) {
    const i = row * cols + c; if (i >= n) continue;
    const [jx, jh, dir, q] = jit[i], u = clamp((o.u ?? 1) * 1.7 - (row / rows) * .5 - q * .2); if (u <= 0) continue;
    let px = x + (c - (cols - 1) / 2) * gap + jx * gap * .3 + (row % 2) * gap * .5, py = y - row * h * .3;
    const lv = o.leaveN && i % Math.round(1 / o.leaveN) === 0 ? clamp(o.leave ?? 0) : 0;
    if (lv > 0) px += expoIn(lv) * 1400;
    if (g > 0 && o.gather) { const d = clamp(g * 1.6 - q * .6); px = lerp(px, o.gather[0], sineIO(d)); py = lerp(py, o.gather[1], sineIO(d)); if (d >= 1) continue; }
    const k = expoOut(u), hh = h * (.88 + jh * .22) * (g > 0 ? 1 - .6 * g : 1);
    ctx.save(); ctx.beginPath(); ctx.rect(px - h, py - h * 1.4, h * 2, h * 1.4 + 2); ctx.clip();
    E.person(ctx, px, py + (1 - k) * hh * 1.05, hh, { dir: lv > 0 ? 1 : dir, light: .7, look: .25 * Math.sin(t * .6 + i), armR: [.15, .1], armL: [-.15, -.1], walk: lv > 0 ? t * 9 + i : undefined, rim: o.rim });
    ctx.restore();
  }
  return { x0: x - cols * gap / 2, x1: x + cols * gap / 2, top: y - rows * h * .3 - h };
}

// ------------------------------------------------------------------------------------------------ film-70 objects
// THE KNOT: what happens between the reader and your bread (card network, bank, clearing: unlabelled). Grey boxes joined by arrows; the
// light line comes in at the left (entry) and leaves at the right (exit). o: { u 0..1 (boxes appear along the flow), q 0..1 (a ? on each
// box), pulse 0..1 (light pulses travel the arrows), a, close 0..1 (the boxes close in around the centre: "the knot closes around you") }.
// Board units, (x, y) = the knot centre. Returns { entry: [x, y], exit: [x, y], boxes: [[x, y], …] }.
const KNOT = [[-330, 40], [-160, -90], [-130, 120], [40, -10], [200, -120], [220, 110], [360, 0]];
const KNOT_E = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6], [1, 4]];
export function knot(ctx, t, x, y, o = {}) {
  const a = o.a ?? 1, u = clamp(o.u ?? 1), cl = sineIO(clamp(o.close ?? 0)), bw = 104, bh = 64;
  const P_ = KNOT.map(([bx, by]) => [x + bx * (1 - .55 * cl), y + by * (1 - .55 * cl)]);
  const out = { entry: [x - 330 * (1 - .55 * cl) - bw / 2 - 30, y + 40 * (1 - .55 * cl)], exit: [x + 360 * (1 - .55 * cl) + bw / 2 + 30, y], boxes: P_ };
  if (a <= 0) return out;
  ctx.save(); ctx.globalAlpha *= a;
  const on = (i) => clamp(u * 1.6 - (KNOT[i][0] + 330) / 690 * .6);
  KNOT_E.forEach(([i, j], k) => {
    const e = Math.min(on(i), on(j)); if (e <= 0) return;
    const [ax, ay] = P_[i], [bx, by] = P_[j];
    lightLine(ctx, [[ax + bw / 2, ay], [bx - bw / 2, by]], e, { a: .45, w: 2, glow: false, col: rgba(CREAM2, .7) });
    const pu = clamp(o.pulse ?? 0); if (pu > 0 && e >= 1) { const f = ((t * .7 + k * .37) % 1); const px = lerp(ax + bw / 2, bx - bw / 2, f), py = lerp(ay, by, f); halo(ctx, px, py, 16, .55 * pu, GOLD.halo, GOLD.core); }
  });
  P_.forEach(([bx, by], i) => {
    const b = expoOut(on(i)); if (b <= 0) return;
    ctx.save(); ctx.translate(bx, by); ctx.scale(lerp(.6, 1, b), lerp(.6, 1, b)); ctx.globalAlpha *= clamp(b * 3);
    ctx.fillStyle = mixHex(P.night1, P.blue1, .28); ctx.strokeStyle = rgba(CREAM2, .75); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 10); ctx.fill(); ctx.stroke();
    ctx.fillStyle = rgba(CREAM2, .35); ctx.fillRect(-bw / 2 + 14, -bh / 2 + 14, bw * .45, 4); ctx.fillRect(-bw / 2 + 14, -bh / 2 + 24, bw * .3, 4);
    const q = clamp((o.q ?? 0) * 1.5 - i * .07);
    if (q > 0) F.goldText(ctx, [['?', 0]], 0, 22, 44, F.rise(q), { serif: true, align: 'center', col: CREAM });
    ctx.restore();
  });
  ctx.restore();
  return out;
}
// SOMEBODY AT A DESK under a lamp (the far end of the line): a person behind a small desk, a warm lamp cone. (x, y) = the floor under
// the desk; h = person height. o: { lamp 0..1 (the lamp lights: LAMP, warm), a, machine 0..1 (the person walks out right and a cool
// machine screen rises in their place: H.11), look }. Returns { screen: [x, y, w] (the machine screen box when machine > 0), top: [x, y] }.
export function deskPerson(ctx, t, x, y, h, o = {}) {
  const a = o.a ?? 1, lamp = clamp(o.lamp ?? 1), mc = clamp(o.machine ?? 0), dw = h * 1.05, dy = y - h * .42;
  const out = { screen: [x, dy - h * .02, h * .7], top: [x, y - h] };
  if (a <= 0) return out;
  ctx.save(); ctx.globalAlpha *= a;
  if (lamp > 0) {   // the lamp cone, warm
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(ctx, x - dw * .3, y - h * 1.15, x - dw * .3, dy, [[0, rgba(LAMP.body, .32 * lamp * (1 - mc))], [1, rgba(LAMP.body, .04 * lamp * (1 - mc))]]);
    ctx.beginPath(); ctx.moveTo(x - dw * .36, y - h * 1.12); ctx.lineTo(x - dw * .8, dy); ctx.lineTo(x + dw * .35, dy); ctx.lineTo(x - dw * .26, y - h * 1.12); ctx.fill(); ctx.restore();
    halo(ctx, x - dw * .31, y - h * 1.1, h * .5, .5 * lamp * (1 - mc), LAMP.body, LAMP.core);
  }
  ctx.strokeStyle = mixHex(P.night1, P.blue1, .5); ctx.lineWidth = h * .025; ctx.beginPath(); ctx.moveTo(x - dw * .45, dy); ctx.lineTo(x - dw * .45, y - h * 1.08); ctx.lineTo(x - dw * .3, y - h * 1.12); ctx.stroke();
  // the person (behind the desk): walks out right when the machine comes
  const pw = expoIn(clamp(mc * 1.4));
  if (pw < 1) { ctx.save(); ctx.beginPath(); ctx.rect(x - dw, y - h * 1.4, dw * 3, h * 1.4 - h * .42 + 2); ctx.clip();
    E.person(ctx, x + dw * .08 + pw * dw * 2.2, y, h, { dir: -1, light: .6 + .4 * lamp, look: o.look ?? -.2 + .1 * Math.sin(t * .7), armR: [1.2, 2.1], armL: [-.9, -1.6], walk: pw > 0 ? t * 9 : undefined, rim: LAMP.body });
    ctx.restore(); }
  const ms = expoOut(clamp(mc * 1.6 - .5));
  if (ms > 0) { ctx.save(); ctx.beginPath(); ctx.rect(x - dw, y - h * 1.6, dw * 2, h * 1.6 - h * .42 + 2); ctx.clip(); aiScreen(ctx, t, x + dw * .08, dy + (1 - ms) * h * .9, h * .7, { a: 1 }); ctx.restore(); }
  // the desk
  ctx.fillStyle = mixHex(P.night1, P.blue1, .35); ctx.fillRect(x - dw / 2, dy, dw, h * .05); ctx.fillRect(x - dw / 2 + h * .06, dy + h * .05, h * .05, h * .37); ctx.fillRect(x + dw / 2 - h * .11, dy + h * .05, h * .05, h * .37);
  ctx.fillStyle = rgba(mixHex(LAMP.body, P.blue1, .4), .5 * lamp); ctx.fillRect(x - dw / 2, dy, dw, 2);
  if (lamp > 0 && mc < 1) { ctx.fillStyle = rgba(PAPER.body, .8 * (1 - mc)); ctx.save(); ctx.translate(x - dw * .12, dy - 3); ctx.rotate(-.06); ctx.fillRect(-h * .12, -h * .012, h * .24, h * .012); ctx.restore(); }
  ctx.restore();
  return out;
}
// the bakery counter (side view): a long top line at y from x0 to x1, a dark front below, a warm lamp above (o.lamp). o.u draws it on
// from the left (it grows out of the card's shadow, H.02). Board units.
export function counterTop(ctx, t, x0, x1, y, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const xe = lerp(x0, x1, expoOut(u));
  const body = mixHex(P.night1, P.ind1, .55), fe = Math.min(700, (xe - x0) * .3), g = ctx.createLinearGradient(xe - fe, 0, xe, 0);   // the body fades out at the far end (no hard edge when the board pans on)
  g.addColorStop(0, rgba(body, 1)); g.addColorStop(1, rgba(body, 0)); ctx.fillStyle = body; ctx.fillRect(x0, y, xe - x0 - fe, 900); ctx.fillStyle = g; ctx.fillRect(xe - fe, y, fe, 900);
  ctx.fillStyle = mixHex(P.ind2, P.blue1, .4); ctx.fillRect(x0, y - 14, xe - x0, 16);
  ctx.fillStyle = rgba(LAMP.body, .55 * (o.lamp ?? 1)); ctx.fillRect(x0, y - 14, xe - x0, 2.5);
  const lp = clamp(o.lamp ?? 0); if (lp > 0) { const lx = o.lampX ?? (x0 + x1) / 2; halo(ctx, lx, y - 420, 520, .35 * lp, LAMP.body, LAMP.core); ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.beginPath(); ctx.moveTo(lx - 60, y - 430); ctx.lineTo(lx + 60, y - 430); ctx.lineTo(lx + 30, y - 470); ctx.lineTo(lx - 30, y - 470); ctx.fill(); ctx.fillRect(lx - 2, y - 900, 4, 430); }
}
