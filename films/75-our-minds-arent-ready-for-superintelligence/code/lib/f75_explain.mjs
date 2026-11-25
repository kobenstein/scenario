// Film 75 · THE WALL: the explainer stage of the film (owned by the lead; builders import, never edit — wishes go in the report).
// Jakob 24.11.: "nicht nur eine große szene mit zooms, sondern wie ein richtig schöner motion design film". So the film is NOT one world:
// 60–70 % of it are explainer sequences that show exactly what the sentence says (numbers, comparisons, mechanisms, timelines), drawn as
// LIGHT ON A NIGHT-BLUE STONE WALL: large, flat, faceted stones (a cave wall at night, the place where Stone Age brains first drew),
// and on it marks of light — ochre for the old reflexes, cream for rules, gold for the machine, cool for screens, the coat yellow for you.
// Distinct from #69 (blueprint grid), #70 (dot grid board), #73 (the lifeline), #76 (steps). The Leitbild (THE SUNRISE, lib/f75_world.mjs)
// appears only at 4 anchors. Scenes (the sofa, the office, the cushion, the hall) are drawn ON the same wall ground (the wall of your room
// at night), so a camera glide over the wall carries from a scene into a graphic without a cut.
//
// Stage: view = { x, y, s } (the wall point at the screen centre, scale). wall(ctx, t, view) draws the ground; inView(ctx, view, fn)
// draws in wall coordinates (1 unit = 1 px at s = 1). viewPath(t, K) glides through keys [[t, view], …] (monotone cubic, log scale).
// Every object here grows out of something, is carried in, or morphs; nothing pops. Text ≥ 22 px, ≤ 6 words + one number.
import * as E from './f10_editorial.mjs';
import * as F from './f75_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, rad, prng, smooth } = E;
const { GOLD, COOL, CREAM, CREAM2, PAPER, OCHRE, FLINT, COAT, WALLC } = F;
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
// THE WALL ground: night blue, a soft light pool where the eye should be (o.lx, o.ly wall coords; o.pool 0..1), and large flat stone
// facets that belong to the wall (they move with the view, so every camera move reads as a move over the wall). o.facets 0..1 (contrast),
// o.warm 0..1 (the evening of the scenario: a warmer pool). Facets: a jittered grid of 520 units, shared corners (seamless), shade by cell.
const FCELL = 520, FJIT = .34;
const fjit = (i, j, k) => { const h = Math.sin(i * 127.1 + j * 311.7 + k * 74.7) * 43758.5453; return h - Math.floor(h); };
const fcorner = (i, j) => [(i + (fjit(i, j, 1) - .5) * FJIT) * FCELL, (j + (fjit(i, j, 2) - .5) * FJIT) * FCELL];
export function wall(ctx, t, v, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.6, P.night1], [1, mixHex(P.night1, P.ind0, .5)]]); ctx.fillRect(0, 0, W, H);
  ctx.restore();
  const fa = o.facets ?? 1;
  if (fa > 0) inView(ctx, v, (s) => {
    const x0 = v.x - W / 2 / s - FCELL, x1 = v.x + W / 2 / s + FCELL, y0 = v.y - H / 2 / s - FCELL, y1 = v.y + H / 2 / s + FCELL;
    const i0 = Math.floor(x0 / FCELL), i1 = Math.ceil(x1 / FCELL), j0 = Math.floor(y0 / FCELL), j1 = Math.ceil(y1 / FCELL);
    if ((i1 - i0) * (j1 - j0) > 900) return;   // far out: the facets would be smaller than the grain; the gradient alone reads as the wall
    ctx.lineWidth = 1.4 / s; ctx.lineJoin = 'round';
    for (let i = i0; i < i1; i++) for (let j = j0; j < j1; j++) {
      const a = fcorner(i, j), b = fcorner(i + 1, j), c = fcorner(i + 1, j + 1), d = fcorner(i, j + 1), sh = fjit(i, j, 3), diag = fjit(i, j, 4) > .5;
      const tri = diag ? [[a, b, c], [a, c, d]] : [[a, b, d], [b, c, d]];
      tri.forEach((tr, k) => {
        const lv = (sh - .5) * .5 + (k ? -.12 : .1);
        ctx.fillStyle = rgba(lv > 0 ? WALLC.hi : WALLC.lo, Math.abs(lv) * .9 * fa);
        ctx.beginPath(); ctx.moveTo(...tr[0]); ctx.lineTo(...tr[1]); ctx.lineTo(...tr[2]); ctx.closePath(); ctx.fill();
      });
      ctx.strokeStyle = rgba(WALLC.seam, .16 * fa); ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.lineTo(...c); ctx.stroke();
    }
  });
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const [lx, ly] = toScreen(v, o.lx ?? v.x, o.ly ?? v.y - 60), warm = clamp(o.warm ?? 0);
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = rad(ctx, lx, ly, 950, [[0, rgba(mixHex(P.ind1, P.shade0, warm * .5), .5 * (o.pool ?? 1))], [1, rgba(P.ind1, 0)]]); ctx.fillRect(0, 0, W, H);
  ctx.restore();
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

// a mark painted on the wall (ochre by default, like a cave mark that glows): a thick soft stroke along pts, drawn on with u
export function mark(ctx, pts, u, o = {}) { lightLine(ctx, pts, u, { col: rgba(o.col ?? OCHRE.body, o.a ?? .9), w: o.w ?? 7, glowCol: o.glowCol ?? OCHRE.mid, blur: o.blur ?? 14, dash: o.dash }); }
// a time axis on the wall: x0 → x1 at y, ticks at [[x, label, u]], drawn on with u (cream hairline); returns nothing
export function timeAxis(ctx, t, x0, x1, y, u, ticks = [], o = {}) {
  lightLine(ctx, [[x0, y], [x1, y]], u, { a: o.a ?? .6, w: o.w ?? 2.5 });
  for (const [x, txt, tu = 1] of ticks) { const k = clamp(Math.min(tu, (u * (x1 - x0) - (x - x0)) / 60 + 1)); if (k <= 0) continue;
    lightLine(ctx, [[x, y - 12], [x, y + 12]], k, { a: .8, w: 2.5 }); if (txt) label(ctx, txt, x, y + 52, k, { size: o.size ?? 24, weight: 600 }); }
}

// ------------------------------------------------------------------------------------------------ THE EVENING (your room at night)
// The sofa, seen from the front, low: you sit on it (the yellow coat, hood up), the phone in your right hand at chest height; the sofa's
// seat and a low table in front hide your legs. x = centre of the sofa, y = the floor line, s = scale (1: the sofa is 900 wide).
// o: { phone: {on, draw, glow}, look 0..1 (your head bows to the phone), thumb 0..1 (the thumb swipes: the hand lifts a little),
//      ring {dashed, fill, a} (the empty ring over your chest), lamp 0..1 (a warm side lamp: the scenario evening), table true,
//      you: {...du options} }.  Returns { phone: rect (screen of the phone, wall coords), chest: [x, y], head: [x, y], hand: [x, y] }.
export const SOFA = { w: 900, seat: 330, back: 560, ring: 82 };
export function sofa(ctx, t, x, y, s = 1, o = {}) {
  const S = SOFA, w = S.w * s, out = {};
  ctx.save();
  const lamp = clamp(o.lamp ?? 0);
  if (lamp > 0) { const lx = x - w * .78, ly = y - S.back * s * 1.15; halo(ctx, lx, ly, w * 1.1, .4 * lamp, P.halo2, P.core1);
    ctx.fillStyle = mixHex(P.night0, P.blue1, .3); ctx.fillRect(lx - 4 * s, ly, 8 * s, y - ly);
    ctx.fillStyle = mixHex(P.halo2, P.night1, .2); ctx.beginPath(); ctx.moveTo(lx - 60 * s, ly); ctx.lineTo(lx + 60 * s, ly); ctx.lineTo(lx + 40 * s, ly - 70 * s); ctx.lineTo(lx - 40 * s, ly - 70 * s); ctx.closePath(); ctx.fill(); }
  // backrest + armrests (behind you)
  ctx.fillStyle = lin(ctx, x, y - S.back * s, x, y, [[0, mixHex(P.ind2, P.blue1, .35)], [1, mixHex(P.night1, P.ind2, .5)]]);
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - S.back * s, w, S.back * s - 40 * s, 60 * s); ctx.fill();
  ctx.fillStyle = rgba(P.blue1, .35); ctx.fillRect(x - w / 2 + 40 * s, y - S.back * s + 6 * s, w - 80 * s, 4 * s);
  // you
  const fh = 520 * s, fx = x + w * .08, fy = y - 20 * s + fh * .2;   // feet below the seat (hidden), so the figure reads as sitting
  const th = clamp(o.thumb ?? 0), lk = clamp(o.look ?? .7);
  ctx.save(); ctx.beginPath(); ctx.rect(x - w, y - S.back * s * 2.2, w * 2, S.back * s * 2.2 - S.seat * s * .62); ctx.clip();
  const hands = E.du(ctx, fx, fy, fh, { dir: -1, look: -.25 * lk, lean: .06 * lk, armR: [1.25 + .1 * th, 2.45 + .25 * th], armL: [-.35, .9], light: -.6, ...(o.you ?? {}) });
  ctx.restore();
  out.head = [fx + .0 * fh, fy - .88 * fh]; out.chest = [fx - .01 * fh, fy - .735 * fh]; out.hand = hands.R;
  // seat cushion + arms (in front of your hips)
  ctx.fillStyle = lin(ctx, x, y - S.seat * s, x, y, [[0, mixHex(P.ind2, P.blue1, .5)], [1, mixHex(P.night1, P.ind2, .4)]]);
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - S.seat * s * .62, w, S.seat * s * .62, 30 * s); ctx.fill();
  ctx.fillStyle = rgba(P.blue0, .35); ctx.fillRect(x - w / 2 + 30 * s, y - S.seat * s * .62 + 4 * s, w - 60 * s, 3 * s);
  for (const sd of [-1, 1]) { ctx.fillStyle = mixHex(P.ind2, P.blue1, .28); ctx.beginPath(); ctx.roundRect(x + sd * w / 2 - (sd > 0 ? 110 * s : 0), y - S.seat * s * 1.05, 110 * s, S.seat * s * 1.05, 40 * s); ctx.fill(); }
  if (o.table !== false) { ctx.fillStyle = mixHex(P.night0, P.night1, .5); ctx.beginPath(); ctx.roundRect(x - w * .42, y + 30 * s, w * .84, 46 * s, 12 * s); ctx.fill();
    ctx.fillRect(x - w * .38, y + 70 * s, 16 * s, 120 * s); ctx.fillRect(x + w * .38 - 16 * s, y + 70 * s, 16 * s, 120 * s); }
  // the phone in your right hand, the screen towards you (we see its glow and a tilted face of the screen)
  const ph = 120 * s, [hx, hy] = hands.R;
  out.phone = F.phone(ctx, t, hx - 6 * s, hy - ph * .36, ph, { rot: -.12, ...(o.phone ?? {}) });
  if (o.ring) { const rg = o.ring; F.ringClock(ctx, t, out.chest[0], out.chest[1], S.ring * s, { dashed: rg.dashed ?? 1, fill: rg.fill ?? 0, a: rg.a ?? 1, glow: rg.glow ?? 0, spin: rg.spin, ink: rg.ink ?? 1 }); out.ring = [out.chest[0], out.chest[1], S.ring * s]; }
  ctx.restore();
  return out;
}

// ------------------------------------------------------------------------------------------------ paper, grades, chats, coins
// a sheet of paper (a law, a treaty, a rule): x, y centre, w; o.title (≤ 3 words, 22+ px on the sheet), o.cog 0..1 (a small update cog
// sits on its corner: the treaty's "update built in"), o.notch (the cog's notches), o.dashed (a sheet that is not binding: dashed edge),
// o.u (lands), o.rot, o.a. Returns { cog: [x, y] }.
export function doc(ctx, t, x, y, w, o = {}) {
  const h = w * 1.3, u = clamp(o.u ?? 1); if (u <= 0) return null;
  const k = expoOut(u);
  ctx.save(); ctx.globalAlpha *= clamp(u * 3) * (o.a ?? 1); ctx.translate(x, y + (1 - k) * 30); ctx.rotate(o.rot ?? 0);
  ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-w / 2 + 6, -h / 2 + 8, w, h);
  if (o.dashed) { ctx.fillStyle = rgba(PAPER.body, .12); ctx.fillRect(-w / 2, -h / 2, w, h); ctx.setLineDash([12, 9]); ctx.strokeStyle = rgba(PAPER.body, .8); ctx.lineWidth = 2.5; ctx.strokeRect(-w / 2, -h / 2, w, h); ctx.setLineDash([]); }
  else { ctx.fillStyle = lin(ctx, 0, -h / 2, 0, h / 2, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(-w / 2, -h / 2, w, h); }
  ctx.fillStyle = rgba(o.dashed ? PAPER.body : PAPER.faint, .55);
  for (let j = 0; j < 11; j++) ctx.fillRect(-w * .38, -h * .2 + j * h * .055, w * (j % 4 === 3 ? .42 : .76), Math.max(1, h * .012));
  if (o.title) F.goldText(ctx, [[o.title, 0]], 0, -h * .3, Math.max(22, w * .1), F.rise(span(u, .3, 1)), { serif: false, weight: 700, align: 'center', col: o.dashed ? CREAM : PAPER.ink, glow: false, spacing: .06 });
  ctx.restore();
  const cu = clamp(o.cog ?? 0); let cog = null;
  if (cu > 0) { cog = [x + w * .38, y - h * .4 + (1 - k) * 30]; F.cogClock(ctx, t, cog[0], cog[1], w * .16 * expoOut(cu), { notch: o.notch ?? 0, glow: o.cogGlow ?? .4 }); }
  return { cog, w, h };
}
// a report card for an AI: the sphere icon on top, rows of grades (label + a filled bar); o.rows [[label, fill 0..1, u]], o.empty (a last
// row that stays EMPTY with its label, gold-outlined: "what it does to you"), o.emptyFill 0..1 (the scenario fills it), o.u, o.a.
export function reportCard(ctx, t, x, y, w, o = {}) {
  const rows = o.rows ?? [['MATH', 1], ['CODE', .95], ['SCIENCE', .9], ['LANGUAGE', .97]], rh = w * .13, h = w * .38 + (rows.length + (o.empty ? 1 : 0)) * rh, u = clamp(o.u ?? 1); if (u <= 0) return null;
  const k = expoOut(u);
  ctx.save(); ctx.globalAlpha *= clamp(u * 3) * (o.a ?? 1); ctx.translate(x - w / 2, y - h / 2 + (1 - k) * 30);
  ctx.fillStyle = mixHex(P.night1, P.ind2, .6); ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(0, 0, w, h, 16); ctx.fill(); ctx.stroke();
  F.sphere(ctx, t, w / 2, w * .16, w * .07, { dust: 60 });
  rows.forEach(([lab, f, ru = 1], i) => { const yy = w * .38 + i * rh, rr = clamp(ru);
    F.goldText(ctx, [[lab, 0]], w * .08, yy + rh * .55, Math.max(22, w * .055), F.rise(rr), { serif: false, weight: 600, spacing: .08, col: CREAM2 });
    ctx.fillStyle = rgba(CREAM, .15); ctx.fillRect(w * .5, yy + rh * .25, w * .42, rh * .36);
    ctx.fillStyle = GOLD.body; ctx.fillRect(w * .5, yy + rh * .25, w * .42 * f * smooth(rr), rh * .36); });
  if (o.empty) { const yy = w * .38 + rows.length * rh, ef = clamp(o.emptyFill ?? 0);
    ctx.setLineDash([8, 7]); ctx.strokeStyle = rgba(COAT.ring, .9); ctx.lineWidth = 2; ctx.strokeRect(w * .05, yy + rh * .08, w * .9, rh * .8); ctx.setLineDash([]);
    F.goldText(ctx, [[o.empty, 0]], w * .08, yy + rh * .6, Math.max(22, w * .055), F.rise(clamp(o.emptyU ?? 1)), { serif: false, weight: 700, spacing: .08, col: COAT.lit });
    if (ef > 0) { ctx.fillStyle = COAT.base; ctx.fillRect(w * .62, yy + rh * .28, w * .3 * smooth(ef), rh * .36); } }
  ctx.restore();
  return { x: x - w / 2, y: y - h / 2, w, h };
}
// a row of n chat windows (cool screens): o.u (they open left → right), o.pull [0..1 per window or one number] (a thread pulls from the
// window to the target o.to [x, y]), o.tip [indices] + o.tipU (those windows tip to ochre: harmful), o.q (questions flowing in: a small
// cream line per window). x0 = left edge, y = centre, ww = width of one window.
export function chatRow(ctx, t, x0, y, n, ww, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return [];
  const gap = ww * .25, hh = ww * 1.3, tip = new Set(o.tip ?? []), tipU = smooth(clamp(o.tipU ?? 0)), out = [];
  for (let i = 0; i < n; i++) {
    const k = expoOut(clamp(u * 1.6 - i / n * .6)); if (k <= 0) continue;
    const cx = x0 + i * (ww + gap) + ww / 2, isT = tip.has(i), col = isT ? mixHex(COOL.body, OCHRE.body, tipU) : COOL.body;
    out.push([cx, y]);
    ctx.save(); ctx.globalAlpha *= k; ctx.translate(cx, y + (1 - k) * 30);
    ctx.fillStyle = mixHex(P.night1, mixHex(COOL.deep, col, .45), 1); ctx.strokeStyle = rgba(col, .85); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(-ww / 2, -hh / 2, ww, hh, ww * .12); ctx.fill(); ctx.stroke();
    ctx.fillStyle = rgba(col, .8); for (let j = 0; j < 3; j++) ctx.fillRect(-ww * .32 + (j % 2) * ww * .18, -hh * .3 + j * hh * .2, ww * (j % 2 ? .46 : .5), hh * .07);
    ctx.restore();
    const pv = Array.isArray(o.pull) ? (o.pull[i] ?? 0) : (o.pull ?? 0);
    if (pv > 0 && o.to) { const p = smooth(clamp(pv)); lightLine(ctx, [[cx, y + hh / 2], [lerp(cx, o.to[0], .5), lerp(y + hh / 2, o.to[1], .5) + 40], [o.to[0], o.to[1]]], p, { col: rgba(isT && tipU > .5 ? OCHRE.body : COOL.line, .55), w: 1.6, glow: false }); }
  }
  return out;
}
// a coin of light (Harari's dollar): x, y, r; o.flip 0..1 (turns on its axis), o.label (on the coin), o.a, o.u (rolls in)
export function coin(ctx, t, x, y, r, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0 || r <= 0) return;
  const fl = Math.abs(Math.cos(Math.PI * clamp(o.flip ?? 0))), sx = Math.max(.06, fl);
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1) * clamp(u * 3); ctx.translate(x, y); ctx.scale(sx, 1);
  halo(ctx, 0, 0, r * 2.2, .3, GOLD.halo, GOLD.hot);
  ctx.fillStyle = E.rad(ctx, -r * .2, -r * .25, r * 1.2, [[0, GOLD.core], [.5, GOLD.body], [1, GOLD.mid]]); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba(GOLD.deep, .6); ctx.lineWidth = r * .08; ctx.beginPath(); ctx.arc(0, 0, r * .8, 0, TAU); ctx.stroke();
  ctx.fillStyle = GOLD.deep; ctx.font = `${Math.round(r * 1.05)}px "Instrument Serif"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.label ?? '$', 0, r * .06);
  ctx.restore();
}
