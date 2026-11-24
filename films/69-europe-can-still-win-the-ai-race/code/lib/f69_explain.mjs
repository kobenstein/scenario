// Film 69 · THE PLAN SHEET: the explainer stage of the film (owned by the lead; builders import, never edit — wishes go in the report).
// Jakob 24.11.: "nicht nur eine große szene mit zooms, sondern wie ein richtig schöner motion design film". So the film is NOT one world:
// 60–70 % of it are explainer sequences that show exactly what the sentence says (numbers, comparisons, processes, timelines, simple maps),
// drawn as LIGHT ON NIGHT BLUE on one recurring ground: THE PLAN SHEET (a dark blueprint, a faint cream grid). The Leitbild (the puzzle
// moon over the rooftop, lib/f69_world.mjs) appears only at 4 anchors: hook, turn (the five parts), verdict, end.
//
// Stage: view = { x, y, s } (the sheet point at the screen centre, scale). sheet(ctx, t, view) draws the ground; inView(ctx, view, fn)
// draws in sheet coordinates (1 unit = 1 px at s = 1). viewPath(t, K) glides through keys [[t, view], …] (monotone cubic, log scale).
// Every object here grows out of something, is carried in, or morphs; nothing pops. Text ≥ 22 px, ≤ 6 words + one number.
import * as E from './f10_editorial.mjs';
import * as F from './f69_kit.mjs';
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
// THE PLAN SHEET ground: night blue, a soft light pool where the eye should be (o.lx, o.ly sheet coords), a faint cream blueprint grid
// that moves with the view (so every camera move reads as a move over the plan), o.grid 0..1
export function sheet(ctx, t, v, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.6, P.night1], [1, mixHex(P.night1, P.ind0, .5)]]); ctx.fillRect(0, 0, W, H);
  const [lx, ly] = toScreen(v, o.lx ?? v.x, o.ly ?? v.y - 60);
  ctx.fillStyle = rad(ctx, lx, ly, 900, [[0, rgba(P.ind1, .55 * (o.pool ?? 1))], [1, rgba(P.ind1, 0)]]); ctx.fillRect(0, 0, W, H);
  ctx.restore();
  const g = o.grid ?? 1; if (g <= 0) return;
  inView(ctx, v, (s) => {
    const x0 = v.x - W / 2 / s, x1 = v.x + W / 2 / s, y0 = v.y - H / 2 / s, y1 = v.y + H / 2 / s; let step = 120; while (step * s < 60) step *= 5;
    ctx.lineWidth = 1.2 / s;
    for (let x = Math.floor(x0 / step) * step; x <= x1; x += step) { ctx.strokeStyle = rgba(CREAM, (x % (step * 5) === 0 ? .07 : .035) * g); ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); }
    for (let y = Math.floor(y0 / step) * step; y <= y1; y += step) { ctx.strokeStyle = rgba(CREAM, (y % (step * 5) === 0 ? .07 : .035) * g); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); }
  });
}
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
// the desk scene (side view, flat): a long desk, YOU left, the other person right, THE AI screen between you on the desk.
// o: { you: {…du}, other: {…person, a}, screen: { a, scan }, docKind, docU, docX (0 = at you, 1 = under the screen), yes 0..1 (loan: the
// YES/NO switch flips to NO… then back: o.yes in [-1, 1] → -1 NO, 1 YES) }
export const DESK = { y: 700, w: 980, h: 26 };
export function deskScene(ctx, t, x, o = {}) {
  const D = DESK, y = D.y;
  ctx.fillStyle = mixHex(P.night1, P.blue1, .32); ctx.fillRect(x - D.w / 2, y, D.w, D.h); ctx.fillRect(x - D.w / 2 + 40, y + D.h, 14, 150); ctx.fillRect(x + D.w / 2 - 54, y + D.h, 14, 150);
  ctx.fillStyle = rgba(mixHex(GOLD.line, P.blue1, .5), .35); ctx.fillRect(x - D.w / 2, y, D.w, 2);
  const ou = o.other?.a ?? 1;
  if (ou > 0) { ctx.save(); ctx.globalAlpha *= ou; E.person(ctx, x + D.w / 2 + 70, y + 176, 300, { dir: -1, light: .5, look: .1, armR: [.9, 1.7], armL: [-.2, -.1], ...(o.other ?? {}) }); ctx.restore(); }
  E.du(ctx, x - D.w / 2 - 70, y + 176, 290, { dir: 1, light: 1, look: .15, armR: [.9, 1.75], ...(o.you ?? {}) });
  const s = o.screen ?? {}; aiScreen(ctx, t, x, y, 230, { a: s.a ?? 1, scan: s.scan });
  if (o.docKind) doc(ctx, t, lerp(x - D.w / 2 + 120, x - 10, sineIO(clamp(o.docX ?? 0))), y - 8 - 60 * .66, 120, { kind: o.docKind, u: o.docU ?? 1, scan: o.docScan, rot: -Math.PI / 2 * .0 });
}
// the loan switch: a small cream pill with a knob that flips between NO (left) and YES (right): v in [-1, 1]
export function yesNo(ctx, t, x, y, v, u, o = {}) {
  if (u <= 0) return;
  const w = 150, h = 56, k = (clamp(v, -1, 1) + 1) / 2;
  ctx.save(); ctx.globalAlpha *= clamp(u * 2);
  ctx.fillStyle = rgba(P.night0, .8); ctx.strokeStyle = rgba(COOL.body, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = COOL.body; ctx.beginPath(); ctx.arc(x - w / 2 + h / 2 + k * (w - h), y, h * .38, 0, TAU * .999); ctx.fill();
  ctx.restore();
  label(ctx, 'NO', x - w / 2 - 20, y + 9, u, { align: 'right', size: 24, col: k < .5 ? CREAM : CREAM2 });
  label(ctx, 'YES', x + w / 2 + 20, y + 9, u, { align: 'left', size: 24, col: k > .5 ? CREAM : CREAM2 });
}
// a crate (one of the 27 pieces): flat front + lid, cream edge, warm light inside (o.glow), o.lid 0..1 opens
export function crate(ctx, t, x, y, w, o = {}) {
  const h = w * .72, a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = mixHex(P.ind1, P.night1, .35); ctx.fillRect(x - w / 2, y - h, w, h);
  ctx.fillStyle = mixHex(P.ind2, P.blue1, .35); ctx.beginPath(); ctx.moveTo(x - w / 2, y - h); ctx.lineTo(x - w / 2 + w * .14, y - h - w * .12); ctx.lineTo(x + w / 2 + w * .14, y - h - w * .12); ctx.lineTo(x + w / 2, y - h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.beginPath(); ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y - h); ctx.lineTo(x + w / 2 + w * .14, y - h - w * .12); ctx.lineTo(x + w / 2 + w * .14, y - w * .12); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = Math.max(1, w * .02); ctx.strokeRect(x - w / 2, y - h, w, h);
  ctx.beginPath(); ctx.moveTo(x - w / 2, y - h * .5); ctx.lineTo(x + w / 2, y - h * .5); ctx.stroke();
  const g = o.glow ?? 0; if (g > 0) halo(ctx, x, y - h * .5, w * 1.1, .3 * g, LAMP.body, LAMP.core);
  ctx.restore();
}
// 27 crates in rows: returns their centres; o.u (they land one by one, left → right), o.books 0..1 (a rule booklet lands on each)
export function crates27(ctx, t, x, y, w, o = {}) {
  const out = [], cols = o.cols ?? 9, gx = w * 1.55, gy = w * 1.25;
  for (let i = 0; i < 27; i++) {
    const c = i % cols, r = Math.floor(i / cols), px = x + (c - (cols - 1) / 2) * gx + (r % 2) * gx * .25, py = y + r * gy;
    const u = clamp((o.u ?? 1) * 1.6 - (i / 27) * .6), k = expoOut(u); out.push([px, py]); if (u <= 0) continue;
    const fx = o.from ? lerp(o.from[0], px, k) : px, fy = o.from ? lerp(o.from[1], py, k) - Math.sin(Math.PI * k) * 60 : py - (1 - k) * 40;
    crate(ctx, t, fx, fy, w * (o.from ? lerp(.4, 1, k) : 1), { a: o.from ? 1 : clamp(u * 3), glow: o.glow ?? .5 });
    const b = clamp((o.books ?? 0) * 1.6 - (i / 27) * .6); if (b > 0) F.ruleBook(ctx, t, px + w * .07, py - w * .72 - w * .12 + 2, w * .62, { u: b, seed: i, rot: ((i * 7) % 5 - 2) * .04 });
  }
  return out;
}
// THE PLAN on the table: a blueprint sheet (lighter blue, cream lines) with the five outlines of the disc drawn on it; o.u slides in,
// o.write 0..1 (the outlines draw on), o.machine 0..1 (a small cool line drawing of the chip machine in its corner)
export function planSheet(ctx, t, x, y, w, o = {}) {
  const h = w * .66, u = clamp(o.u ?? 1); if (u <= 0) return null;
  const k = expoOut(u);
  ctx.save(); ctx.translate(x + (1 - k) * w * .8, y); ctx.rotate((o.rot ?? -.03) + (1 - k) * .12);
  ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(-w / 2 + 10, -h / 2 + 14, w, h);
  ctx.fillStyle = lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, mixHex(P.blue0, P.ind1, .35)], [1, mixHex(P.ind1, P.night1, .4)]]); ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.strokeStyle = rgba(CREAM, .12); ctx.lineWidth = 1; for (let i = 1; i < 12; i++) { ctx.beginPath(); ctx.moveTo(-w / 2 + i * w / 12, -h / 2); ctx.lineTo(-w / 2 + i * w / 12, h / 2); ctx.stroke(); } for (let j = 1; j < 8; j++) { ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2 + j * h / 8); ctx.lineTo(w / 2, -h / 2 + j * h / 8); ctx.stroke(); }
  ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 2; ctx.strokeRect(-w / 2 + 14, -h / 2 + 14, w - 28, h - 28);
  const r = h * .32; F.kitDisc(ctx, t, -w * .12, 0, r, F.BLANK, { write: o.write ?? 1, glow: .2 * (o.write ?? 1), stars: 0, loose: false });
  const m = clamp(o.machine ?? 0); if (m > 0) { ctx.save(); ctx.globalAlpha *= m; F.chipMachine(ctx, t, w * .3, h * .12, w * .24, { glow: .6, beam: .6 }); ctx.restore(); }
  ctx.restore();
  return { x: x + (1 - k) * w * .8, y, w, h };
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
