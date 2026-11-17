// Film 54 · B2 (c06–c09) · props for the MIND / ALZHEIMER'S / WHY A DATE / THE PIPELINE beats. Owned by B2 (builders' own module).
// All drawing helpers are pure functions of (t, u…); seeded randomness only; nothing appears from nowhere (callers drive u from carriers).
//   waitingRoom(ctx, t, w, h, o)      the waiting room inside vitrine 3 (local glass px 660 × 690): two groups on benches, capsule vs sugar pill
//   noiseField(ctx, t, cx, cy, r, a)  flickering dots round the mind rings ("the problem is hearing the answer")
//   trialCards(ctx, t, o)             74 small index cards (FDA reviews), 38 flip to mint
//   questionnaire / essayPage          one sheet of paper that turns over (page flip) · tube outline in F.bloodTube
//   dashedFrame                        the empty scan frame the mind waits for
//   streetToday(ctx, t, w, h, o)      a street of today inside vitrine 4: passers-by, some carry a faint mint trace
//   cohort(ctx, t, o) · tally(ctx, t, o) · vial(ctx, t, x, y, s, o)   healthy people counted for years · A4 failed
//   stage(ctx, t, w, h, o)            the drawn stage behind the roadshow frame: a spotlight on a date (no person)
//   audioPlate(ctx, t, T, id, o)      C5 audio-only plate with a rect clear of the board (kit audioPlate is fixed at x 260: kit wish)
//   wallCard(ctx, t, x, y, w, o)      a dark museum wall card: serif quote + credit · mouse · trialDoor · arrow
import fs from 'node:fs';
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f54_kit.mjs';
import { ROOT } from './kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, halo, lin, rad, prng } = E;
const { MINT, COOL, LAMP, RELIC, INK, rise, maskLine, measure, mintText } = F;
const TAU = Math.PI * 2;

// ===================================================================================================== THE WAITING ROOM (inside vitrine 3)
// local px of the glass (w 660 × h 690). The camera looks at local y ≈ 290–650 when inside. The top right stays dark wall (QR corner).
// o { a, lift: [u0, u1] (group 0 = medicine, group 1 = sugar pill: 0 slumped → 1 head up, warm light on them), sweep 0..1 (the light of
//     the weeks crossing the floor), pills 0..1 }
export const ROOM = { seat: 600, h: [150, 138, 156], benches: [[40, 300], [365, 625]], people: [[85, 168, 251], [410, 493, 576]], win: { x: 205, y: 330, w: 150, h: 120 } };
export function waitingRoom(ctx, t, w, h, o = {}) {
  const lift = o.lift || [0, 0], sw = clamp(o.sweep ?? 0), R = ROOM;
  ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, P.night0], [.45, mixHex(P.night1, P.ind1, .5)], [.82, mixHex(P.ind1, LAMP.deep, .18)], [1, P.night1]]); ctx.fillRect(0, 0, w, h);
  // the window (moonlight, blinds) and its light that crosses the floor as the weeks pass
  const wn = R.win, wl = .5 + .5 * Math.sin(Math.PI * sw);
  ctx.fillStyle = mixHex(P.ind0, COOL.deep, .5 + .3 * wl); ctx.fillRect(wn.x, wn.y, wn.w, wn.h);
  for (let k = 0; k < 6; k++) { ctx.fillStyle = rgba(P.night1, .7); ctx.fillRect(wn.x, wn.y + 6 + k * 20, wn.w, 7); }
  ctx.strokeStyle = rgba(P.night0, .9); ctx.lineWidth = 6; ctx.strokeRect(wn.x, wn.y, wn.w, wn.h);
  ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(0, R.seat + 40, w, 4);   // skirting
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const px = lerp(-80, w + 80, sw);
  ctx.fillStyle = rad(ctx, px, R.seat + 70, 230, [[0, rgba(LAMP.body, .22 * Math.sin(Math.PI * clamp(sw * 1.05)))], [1, rgba(LAMP.body, 0)]]); ctx.fillRect(0, R.seat - 200, w, 400);
  ctx.fillStyle = lin(ctx, wn.x, wn.y + wn.h, wn.x + 60, R.seat + 60, [[0, rgba(COOL.halo, .1)], [1, rgba(COOL.halo, 0)]]);
  ctx.beginPath(); ctx.moveTo(wn.x, wn.y + wn.h); ctx.lineTo(wn.x + wn.w, wn.y + wn.h); ctx.lineTo(wn.x + wn.w + 120, R.seat + 60); ctx.lineTo(wn.x - 40, R.seat + 60); ctx.closePath(); ctx.fill();
  ctx.restore();
  // things on the wall: two small framed prints, a plant, a pendant lamp (cream) — a waiting room, not a void
  ctx.fillStyle = rgba(LAMP.body, .08); ctx.fillRect(420, 380, 70, 52); ctx.fillRect(520, 392, 52, 40); ctx.strokeStyle = rgba(P.night0, .8); ctx.lineWidth = 4; ctx.strokeRect(420, 380, 70, 52); ctx.strokeRect(520, 392, 52, 40);
  ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.fillRect(612, R.seat - 40, 30, 46); for (let k = 0; k < 7; k++) { ctx.save(); ctx.translate(627, R.seat - 40); ctx.rotate(-1.1 + k * .37); ctx.beginPath(); ctx.ellipse(0, -34, 9, 34, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  ctx.strokeStyle = rgba(P.night0, .9); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(110, 0); ctx.lineTo(110, 300); ctx.stroke();
  halo(ctx, 110, 312, 120, .22, LAMP.body, LAMP.core); ctx.fillStyle = mixHex(P.night0, P.ind2, .5); ctx.beginPath(); ctx.moveTo(92, 312); ctx.lineTo(128, 312); ctx.lineTo(118, 298); ctx.lineTo(102, 298); ctx.closePath(); ctx.fill(); ctx.fillStyle = LAMP.core; ctx.fillRect(98, 312, 24, 2);
  for (let g = 0; g < 2; g++) {
    const [b0, b1] = R.benches[g], L = lift[g];
    // the people: seated, facing us; the bench hides the legs. They lift their heads (and the light finds them) as they improve.
    R.people[g].forEach((x, i) => {
      const e = sineIO(clamp(L * 1.25 - i * .12)), br = Math.sin(t * 1.1 + x * .03), hh = R.h[i];
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, R.seat + 2); ctx.clip();
      halo(ctx, x, R.seat - hh * .5, hh * .62, .05 + .3 * e, LAMP.body, LAMP.core);
      E.person(ctx, x, R.seat + hh * .44, hh, { look: lerp(-.3, .55, e) + .03 * br, lean: lerp(.2, -.02, e) + .01 * br, dir: (i + g) % 2 ? -1 : 1, light: g ? -1 : 1, back: .06 + .3 * e,
        rim: mixHex(P.blue1, LAMP.body, .15 + .7 * e), long: i === 1, armR: [.12, .05], armL: [-.12, -.05] });
      ctx.restore();
    });
    ctx.fillStyle = lin(ctx, 0, R.seat, 0, R.seat + 40, [[0, mixHex(P.ind2, LAMP.deep, .3)], [1, P.night1]]); ctx.fillRect(b0, R.seat, b1 - b0, 18);
    ctx.fillStyle = mixHex(P.night0, P.ind1, .3); for (const lx of [b0 + 10, b1 - 18]) ctx.fillRect(lx, R.seat + 18, 8, 50);
    ctx.fillStyle = rgba(LAMP.body, .25); ctx.fillRect(b0, R.seat, b1 - b0, 2);
    // the pills on the bench between the first two people (capsule = the medicine · plain round tablet = the sugar pill)
    const pu = clamp(o.pills ?? 1), px = (R.people[g][0] + R.people[g][1]) / 2;
    if (pu > 0) { ctx.save(); ctx.globalAlpha *= pu; ctx.fillStyle = mixHex(P.night0, P.ind2, .6); ctx.beginPath(); ctx.ellipse(px, R.seat - 3, 24, 5, 0, 0, TAU); ctx.fill(); if (g === 0) capsule(ctx, px, R.seat - 10, 30, .25); else tablet(ctx, px, R.seat - 9, 12); ctx.restore(); }
  }
}
export function capsule(ctx, x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const r = s * .26;
  halo(ctx, 0, 0, s * 1.4, .25, MINT.halo, MINT.body);
  ctx.fillStyle = MINT.body; ctx.beginPath(); ctx.roundRect(-s / 2, -r, s / 2, r * 2, [r, 0, 0, r]); ctx.fill();
  ctx.fillStyle = P.cream; ctx.beginPath(); ctx.roundRect(0, -r, s / 2, r * 2, [0, r, r, 0]); ctx.fill();
  ctx.fillStyle = rgba('#ffffff', .5); ctx.fillRect(-s * .4, -r * .6, s * .8, r * .25);
  ctx.restore();
}
export function tablet(ctx, x, y, r) {
  halo(ctx, x, y, r * 2.6, .14, LAMP.body, LAMP.core);
  ctx.fillStyle = mixHex(P.cream, '#ffffff', .4); ctx.beginPath(); ctx.ellipse(x, y, r, r * .55, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba(P.night1, .35); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x - r * .6, y); ctx.lineTo(x + r * .6, y); ctx.stroke();
}

// flickering noise dots round a centre (the signal is faint): a 0..1
const NOISE = (() => { const r = prng(4401), out = []; for (let k = 0; k < 260; k++) out.push([r(), r(), r() * TAU, .5 + r() * 2.5]); return out; })();
export function noiseField(ctx, t, cx, cy, rr, a) {
  if (a <= 0) return;
  for (const [u, v, ph, f] of NOISE) {
    const ang = u * TAU, d = Math.sqrt(v) * rr, x = cx + Math.cos(ang) * d * 1.05, y = cy + Math.sin(ang) * d * .9;
    const fl = .5 + .5 * Math.sin(t * f * 3.1 + ph), al = a * (.15 + .5 * fl * fl);
    ctx.fillStyle = rgba(fl > .6 ? P.cream : P.halo2, al); ctx.fillRect(x, y, 2.4, 2.4);
  }
}

// ===================================================================================================== 74 TRIALS
// o { x, y, cols, cw, ch, gap, n, from: [x, y] (where they fly out of), fly 0..1, flip 0..1, gather 0..1 (to o.to [x, y]), a }
const TRIALS = (() => { const r = prng(7438), idx = [...Array(74).keys()]; for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  const pos = new Set(idx.slice(0, 38)), ord = idx.map((k, i) => [k, i]); const rank = new Map(ord); return { pos, rank }; })();
export function trialCards(ctx, t, o) {
  const n = 74, cols = o.cols ?? 10, cw = o.cw ?? 56, ch = o.ch ?? 38, gap = o.gap ?? 12, a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  for (let k = 0; k < n; k++) {
    const c = k % cols, r = Math.floor(k / cols), gx = o.x + c * (cw + gap), gy = o.y + r * (ch + gap);
    const fu = expoOut(span(o.fly ?? 1, k / n * .55, k / n * .55 + .45)); if (fu <= 0) continue;
    const [fx, fy] = o.from ?? [gx, gy];
    let x = lerp(fx, gx, fu), y = lerp(fy, gy, fu) - 60 * Math.sin(Math.PI * fu) * (c / cols - .5), s = lerp(.25, 1, fu);
    const gu = sineIO(span(o.gather ?? 0, (n - k) / n * .4, (n - k) / n * .4 + .6));
    if (gu > 0 && o.to) { x = lerp(x, o.to[0] - cw / 2, gu); y = lerp(y, o.to[1] - ch / 2, gu); s = lerp(s, .9, gu); }
    const pos = TRIALS.pos.has(k), fl = pos ? span(o.flip ?? 0, TRIALS.rank.get(k) / n * .6, TRIALS.rank.get(k) / n * .6 + .4) : 0;
    const sx = Math.abs(Math.cos(Math.PI * fl)), face = fl > .5;
    ctx.save(); ctx.translate(x + cw / 2, y + ch / 2); ctx.scale(s * Math.max(.04, sx), s);
    ctx.fillStyle = face ? mixHex(MINT.body, P.cream, .25) : mixHex(P.ind2, P.blue1, .45); ctx.beginPath(); ctx.roundRect(-cw / 2, -ch / 2, cw, ch, 4); ctx.fill();
    ctx.strokeStyle = face ? rgba(MINT.core, .9) : rgba(P.cream, .35); ctx.lineWidth = 1.4; ctx.stroke();
    ctx.fillStyle = face ? rgba(MINT.deep, .6) : rgba(P.cream, .22); ctx.fillRect(-cw * .34, -ch * .12, cw * .68, 3); ctx.fillRect(-cw * .34, ch * .12, cw * .44, 3);
    ctx.restore();
    if (face && fl < 1) halo(ctx, x + cw / 2, y + ch / 2, cw * 1.1, .3 * Math.sin(Math.PI * fl), MINT.halo, MINT.core);
  }
  ctx.restore();
}

// ===================================================================================================== ONE SHEET: QUESTIONNAIRE ⟷ ESSAY PAGE
// (cx, cy) = centre, w × h. o { flip 0..1 (0 = questionnaire, 1 = essay page; turns about the vertical axis), ticks 0..1, quote 0..1, a }
const PAPER = mixHex(P.cream, '#e3dcc0', .5);
export function sheet(ctx, t, cx, cy, w, h, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || w < 2) return;
  const fl = clamp(o.flip ?? 0), sx = Math.abs(Math.cos(Math.PI * fl)), back = fl > .5;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(cx, cy); ctx.rotate(o.rot ?? 0);
  ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(-w / 2 * sx + 10, -h / 2 + 12, w * sx, h, 6); ctx.fill();
  ctx.scale(Math.max(.02, sx), 1);
  ctx.fillStyle = lin(ctx, -w / 2, 0, w / 2, 0, [[0, mixHex(PAPER, P.night1, .12 * (1 - sx))], [1, PAPER]]); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 6); ctx.fill();
  if (!back) {   // the questionnaire: a heading bar, rows of grey lines with four boxes; ticks drawn one row after another
    ctx.fillStyle = rgba(P.night1, .55); ctx.fillRect(-w * .4, -h * .42, w * .5, 10); ctx.fillStyle = rgba(P.night1, .25); ctx.fillRect(-w * .4, -h * .42 + 20, w * .32, 6);
    const rows = 7, tu = clamp(o.ticks ?? 0), r = prng(31);
    for (let k = 0; k < rows; k++) {
      const y = -h * .26 + k * h * .1;
      ctx.fillStyle = rgba(P.night1, .3); ctx.fillRect(-w * .4, y - 4, w * (.22 + .12 * r()), 5);
      const pick = Math.floor(r() * 4);
      for (let b = 0; b < 4; b++) {
        const bx = w * .02 + b * w * .095, by = y - 13;
        ctx.strokeStyle = rgba(P.night1, .55); ctx.lineWidth = 2; ctx.strokeRect(bx, by, 18, 18);
        if (b === pick) { const tk = span(tu, k / rows, k / rows + 1.6 / rows); if (tk > 0) { ctx.strokeStyle = rgba(P.night1, .85); ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath();
          const p1 = [bx + 3, by + 9], p2 = [bx + 8, by + 15], p3 = [bx + 20, by - 2], u1 = clamp(tk * 2), u2 = clamp(tk * 2 - 1);
          ctx.moveTo(...p1); ctx.lineTo(lerp(p1[0], p2[0], u1), lerp(p1[1], p2[1], u1)); if (u2 > 0) ctx.lineTo(lerp(p2[0], p3[0], u2), lerp(p2[1], p3[1], u2)); ctx.stroke(); } }
      }
    }
  } else {       // the essay page (mirrored back to front): title, small print, the quote big
    ctx.scale(-1, 1); ctx.scale(-1, 1);
    E.glowText(ctx, F.ESSAY.title, 0, -h * .4, { size: w * .036, align: 'center', glow: false, spacing: .14, col: P.night1 });
    const r = prng(77); ctx.fillStyle = rgba(P.night1, .16);
    for (let k = 0; k < 4; k++) ctx.fillRect(-w * .4, -h * .32 + k * 16, w * (.6 + .2 * r()), 5);
    for (let k = 0; k < 4; k++) ctx.fillRect(-w * .4, h * .24 + k * 16, w * (.6 + .2 * r()), 5);
    const q = clamp(o.quote ?? 0), fs = w * .085, segs = [['“Most mental illness', 0], ['can probably', 0], ['be cured.”', 1]];
    segs.forEach(([s, m], i) => { const u = rise(span(q, i * .22, i * .22 + .5)); if (u > 0) mintText(ctx, [[s, 0]], -w * .4, -h * .1 + i * fs * 1.1, fs, u, { col: m ? MINT.deep : P.night1 }); });
    const cu = rise(span(q, .7, 1)); if (cu > 0) maskLine(ctx, [['AMODEI, OCT 2024', 0]], -w * .4, h * .17, w * .036, cu, { serif: false, weight: 600, col: mixHex(P.night1, PAPER, .35), glow: false });
  }
  ctx.restore();
}
// an empty frame waiting for its scan (dashed, the outline creeps); inside, the mind rings faint. (x, y) = centre, s = width
export function dashedFrame(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return; const h = s * .8, bl = .5 + .5 * Math.sin(t * 3.2);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  ctx.fillStyle = rgba(P.night0, .55); ctx.beginPath(); ctx.roundRect(-s / 2, -h / 2, s, h, s * .03); ctx.fill();
  ctx.save(); ctx.setLineDash([12, 10]); ctx.lineDashOffset = -t * 10; ctx.strokeStyle = rgba(mixHex(P.cream, MINT.line, bl), .45 + .35 * bl); ctx.lineWidth = 2.5; ctx.stroke(); ctx.restore();
  ctx.restore();
  F.specimen(ctx, t, 'mind', x, y, s * .26, { a: .35 * a, ghost: .6 });
}

// ===================================================================================================== A STREET OF TODAY (inside vitrine 4)
// local px (660 × 690). o { a (reveal: rises from the dark), traces 0..1 (some passers-by carry the faint mint point), walk (time offset) }
const WALKERS = [[-.05, 1, 0, 140], [.18, 1, 1, 128], [.33, 1, 0, 150], [.55, 1, 1, 134], [.7, 1, 0, 146], [.86, 1, 1, 126], [1.02, 1, 0, 138]];
export const TRACED = [1, 3, 5];
export function streetToday(ctx, t, w, h, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return; const gy = 640;
  ctx.save(); ctx.globalAlpha *= a;
  // buildings with a few lit windows, a street lamp (cream), the pavement
  const r = prng(901);
  for (let k = 0; k < 6; k++) { const bx = k * 120 - 20 + r() * 20, bh = 150 + r() * 120, bw = 100 + r() * 30;
    ctx.fillStyle = mixHex(P.night0, P.ind1, .35 + .2 * r()); ctx.fillRect(bx, gy - 60 - bh, bw, bh + 60);
    for (let i = 0; i < 5; i++) if (r() > .55) { ctx.fillStyle = rgba(LAMP.body, .35 + .3 * r()); ctx.fillRect(bx + 14 + (i % 3) * 28, gy - 40 - bh + 20 + Math.floor(i / 3) * 34, 12, 16); } }
  ctx.fillStyle = mixHex(P.night1, P.ind1, .3); ctx.fillRect(0, gy - 10, w, h - gy + 10);
  ctx.fillStyle = rgba(INK.rim, .25); ctx.fillRect(0, gy - 10, w, 2);
  const lx = 560; ctx.fillStyle = mixHex(P.night0, P.ind2, .5); ctx.fillRect(lx - 3, gy - 250, 6, 250); ctx.fillRect(lx - 3, gy - 250, -34, 5);
  halo(ctx, lx - 34, gy - 238, 160, .3, LAMP.body, LAMP.core); ctx.fillStyle = LAMP.core; ctx.beginPath(); ctx.ellipse(lx - 34, gy - 240, 12, 5, 0, 0, TAU); ctx.fill();
  // the passers-by: a steady walk left → right, wrapping
  const tw = (o.walk ?? t);
  WALKERS.forEach(([u0, , , hh], i) => {
    const sp = .028 + (i % 3) * .006, u = ((u0 + tw * sp) % 1.2 + 1.2) % 1.2 - .1, x = u * w;
    E.person(ctx, x, gy + 6, hh, { walk: (u * w / 38 + i) * Math.PI, dir: 1, look: .1, light: -1, back: .4, rim: mixHex(P.blue1, LAMP.body, .4), long: i % 2 === 0 });
    if (TRACED.includes(i) && (o.traces ?? 0) > 0) { const tu = clamp(o.traces * 1.4 - TRACED.indexOf(i) * .2), hy = gy + 6 - hh * .87; if (tu > 0) { halo(ctx, x + 2, hy, 16, .5 * tu, MINT.halo, MINT.core); ctx.fillStyle = rgba(MINT.core, .9 * tu); ctx.beginPath(); ctx.arc(x + 2, hy, 2.6, 0, TAU); ctx.fill(); } }
  });
  ctx.restore();
}
export const walkerHead = (t, i, w = 660, walk = t) => { const [u0, , , hh] = WALKERS[i], sp = .028 + (i % 3) * .006, u = ((u0 + walk * sp) % 1.2 + 1.2) % 1.2 - .1; return [u * w + 2, 646 - hh * .87]; };

// ===================================================================================================== THE COHORT, THE TALLY, THE VIAL
// healthy people in rows (screen px). o { x, y (feet of row 0), cols, rows, dx, dy, h, rise 0..1, sick 0..1, a }
const SICK = new Set([3, 9, 12]);
export function cohort(ctx, t, o) {
  const a = o.a ?? 1; if (a <= 0) return; const n = o.cols * o.rows;
  ctx.save(); ctx.globalAlpha *= a;
  for (let k = n - 1; k >= 0; k--) {
    const c = k % o.cols, r = Math.floor(k / o.cols), x = o.x + c * o.dx + (r % 2) * o.dx * .5, y = o.y - r * o.dy;
    const ru = rise(span(o.rise ?? 1, k / n * .6, k / n * .6 + .4)); if (ru <= 0) continue;
    const sk = SICK.has(k) ? sineIO(span(o.sick ?? 0, [...SICK].indexOf(k) * .25, [...SICK].indexOf(k) * .25 + .5)) : 0;
    ctx.save(); ctx.globalAlpha *= ru * (1 - .55 * sk); ctx.translate(0, (1 - ru) * 30);
    halo(ctx, x, y - o.h * .5, o.h * .7, .07 * (1 - sk), LAMP.body, LAMP.core);
    E.person(ctx, x, y, o.h * (1 - .05 * sk), { look: lerp(.15 + .05 * Math.sin(t * .8 + k), -.35, sk), lean: .14 * sk, dir: k % 3 ? 1 : -1, light: 1, back: .5 * (1 - sk), rim: mixHex(mixHex(P.blue1, LAMP.body, .5), RELIC.body, sk), long: k % 2 === 0 });
    ctx.restore();
  }
  ctx.restore();
}
// tally marks (one per year, the 5th crosses the four): (x, y) = left end on the base line, n = marks drawn so far (fractional), pitch, h
export function tally(ctx, t, o) {
  const a = o.a ?? 1; if (a <= 0) return; const n = Math.max(0, o.n);
  ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round';
  const L = o.len ?? (Math.ceil(n) * o.pitch + 40), lu = clamp(o.line ?? 1);
  ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(o.x - 20, o.y + 14); ctx.lineTo(o.x - 20 + L * lu, o.y + 14); ctx.stroke();
  for (let k = 0; k < Math.ceil(n); k++) {
    const u = clamp(n - k), x = o.x + k * o.pitch, hh = o.h * (k === Math.ceil(n) - 1 && o.last != null ? o.last : 1);
    ctx.strokeStyle = rgba(P.cream, .9); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, o.y); ctx.lineTo(x + 6 * u, o.y - hh * expoOut(u)); ctx.stroke();
  }
  ctx.restore();
}
// a drug vial (glass, cream cap, a label band) with a cream cross over it (no red, ever). (x, y) = bottom centre, s = height
export function vial(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return; const w = s * .42, cr = clamp(o.cross ?? 0);
  ctx.save(); ctx.globalAlpha *= a;
  halo(ctx, x, y - s * .45, s * .8, .18 * (1 - .6 * cr), COOL.halo, COOL.body);
  ctx.fillStyle = rgba(INK.glass, .35); ctx.beginPath(); ctx.roundRect(x - w / 2, y - s * .78, w, s * .78, [8, 8, 14, 14]); ctx.fill();
  ctx.fillStyle = rgba(COOL.body, .45 * (1 - .5 * cr)); ctx.beginPath(); ctx.roundRect(x - w / 2 + 4, y - s * .42, w - 8, s * .42 - 4, [4, 4, 12, 12]); ctx.fill();
  ctx.strokeStyle = rgba(COOL.line, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x - w / 2, y - s * .78, w, s * .78, [8, 8, 14, 14]); ctx.stroke();
  ctx.fillStyle = mixHex(P.cream, P.halo2, .4); ctx.fillRect(x - w * .32, y - s * .95, w * .64, s * .17);
  ctx.fillStyle = rgba(P.cream, .85); ctx.fillRect(x - w / 2 + 3, y - s * .66, w - 6, s * .16);
  if (cr > 0) { ctx.strokeStyle = P.cream; ctx.lineWidth = s * .05; ctx.lineCap = 'round'; const d = s * .55, u1 = clamp(cr * 2), u2 = clamp(cr * 2 - 1);
    ctx.beginPath(); ctx.moveTo(x - d * .6, y - s * .5 - d * .6); ctx.lineTo(x - d * .6 + d * 1.2 * u1, y - s * .5 - d * .6 + d * 1.2 * u1); if (u2 > 0) { ctx.moveTo(x + d * .6, y - s * .5 - d * .6); ctx.lineTo(x + d * .6 - d * 1.2 * u2, y - s * .5 - d * .6 + d * 1.2 * u2); } ctx.stroke(); }
  ctx.restore();
}

// ===================================================================================================== THE STAGE (behind the roadshow frame)
// local px of the frame (w × h ≈ 640 × 360). A dark stage, curtains, a spotlight cone onto a small stand with a date. No person.
// o { a, spot 0..1 (the cone falls), date ('2036'), sway }
export function stage(ctx, t, w, h, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return; const sp = clamp(o.spot ?? 1);
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, P.night0], [.7, mixHex(P.night1, P.ind1, .4)], [1, P.night0]]); ctx.fillRect(0, 0, w, h);
  // curtains (dark folds), the stage floor
  for (const s of [-1, 1]) { const x0 = s < 0 ? 0 : w; for (let k = 0; k < 5; k++) { const xx = x0 - s * (k * 22 + 6 * Math.sin(t * .4 + k)); ctx.fillStyle = mixHex(P.night0, P.ind2, .25 + .1 * (k % 2)); ctx.beginPath(); ctx.moveTo(xx, 0); ctx.quadraticCurveTo(xx - s * 14, h * .5, xx - s * 4, h * .78); ctx.lineTo(xx - s * 30, h * .78); ctx.quadraticCurveTo(xx - s * 30, h * .4, xx - s * 26, 0); ctx.closePath(); ctx.fill(); } }
  ctx.fillStyle = lin(ctx, 0, h * .74, 0, h, [[0, mixHex(P.ind1, LAMP.deep, .25)], [1, P.night0]]); ctx.fillRect(0, h * .74, w, h * .26);
  ctx.fillStyle = rgba(LAMP.body, .2); ctx.fillRect(0, h * .74, w, 2);
  // the spotlight: a cone from above, a pool on the floor, the date on a small stand
  const cx = w / 2 + 4 * Math.sin(t * .5), top = -20, by = h * .8;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = lin(ctx, 0, top, 0, by, [[0, rgba(LAMP.core, .32 * sp)], [1, rgba(LAMP.body, .1 * sp)]]);
  ctx.beginPath(); ctx.moveTo(cx - 18, top); ctx.lineTo(cx + 18, top); ctx.lineTo(cx + 130 * sp, by); ctx.lineTo(cx - 130 * sp, by); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rad(ctx, cx, by, 150, [[0, rgba(LAMP.core, .35 * sp)], [1, rgba(LAMP.body, 0)]]); ctx.save(); ctx.translate(cx, by); ctx.scale(1, .22); ctx.translate(-cx, -by); ctx.fillRect(cx - 160, by - 160, 320, 320); ctx.restore();
  ctx.restore();
  ctx.fillStyle = mixHex(P.night0, P.ind2, .6); ctx.fillRect(cx - 48, by - 52, 96, 52); ctx.fillStyle = rgba(LAMP.body, .3 * sp); ctx.fillRect(cx - 48, by - 52, 96, 3);
  E.glowText(ctx, o.date ?? '2036', cx, by - 66, { size: 74, serif: true, align: 'center', col: mixHex(P.halo2, P.cream, sp), glow: sp > .5 });
  ctx.restore();
}

// ===================================================================================================== C5 · AUDIO ONLY (own rect, clear of the board)
const SP_CLIPS = '/tmp/claude-0/-home-user/0669cef4-5ff5-539f-b7bb-2600687207c6/scratchpad/f54/clips/';
const CLIPDIR = (process.env.F54CLIPS || (fs.existsSync(SP_CLIPS) ? SP_CLIPS : ROOT + 'clips/')).replace(/\/?$/, '/');
let ENV5 = null; const env5 = () => { if (ENV5 === null) { try { ENV5 = JSON.parse(fs.readFileSync(CLIPDIR + 'C5/env.json', 'utf8')); } catch { ENV5 = false; } } return ENV5 || null; };
export const C5_RECT = { x: 600, y: 230, w: 1180, h: 520 };
// o { from ([cx, cy, r] circle or { x, y, w, h } rect), morph 0..1, label 0..1 } · faktencheck K8: the date reads PUBLISHED NOV 2026
export function audioPlate(ctx, t, T, o = {}) {
  const R = C5_RECT, c = T.clip('C5'), win = c ? { start: c.start, end: c.end } : { start: t, end: t + 1 }, info = F.CLIPS.C5;
  const m = sineIO(clamp(o.morph ?? 1)), f = o.from ?? [R.x + R.w / 2, R.y + R.h / 2, 20];
  const fr = Array.isArray(f) ? { cx: f[0], cy: f[1], w: f[2] * 2, h: f[2] * 2, r: f[2] } : { cx: f.x + f.w / 2, cy: f.y + f.h / 2, w: f.w, h: f.h, r: Math.min(f.h / 2, 30) };
  const cx = lerp(fr.cx, R.x + R.w / 2, m), cy = lerp(fr.cy, R.y + R.h / 2, m), w = lerp(fr.w, R.w, m), h = lerp(fr.h, R.h, m), rr = Math.min(lerp(fr.r, 14, m), w / 2, h / 2);
  const u = clamp((t - win.start) / (win.end - win.start)), env = env5();
  ctx.save(); // transform: the caller's (c5 sets it with float())
  ctx.save(); ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, rr); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, cy - h / 2, 0, cy + h / 2, [[0, mixHex(P.night1, P.ind1, .5)], [1, P.night0]]); ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
  const wy = cy + h * (o.wy ?? .12) * m, ww = w * .86, x0 = cx - ww / 2, n = 120;
  ctx.globalAlpha = span(m, .3, 1) * (o.wave ?? 1);
  for (let i = 0; i < n; i++) {
    const v = i / n, fi = Math.floor(v * (env ? env.length : 1)), amp = env ? clamp(env[Math.min(env.length - 1, fi)]) : .25 + .5 * Math.abs(Math.sin(i * 1.7) * Math.sin(i * .37 + 1));
    const live = v < u ? 1 : .32, bh = Math.max(2, amp * Math.min(h, R.h) * .42);
    ctx.fillStyle = rgba(v < u ? MINT.body : P.blue1, live); ctx.fillRect(x0 + v * ww, wy - bh / 2, ww / n * .55, bh);
  }
  if (u > 0 && u < 1) { ctx.fillStyle = MINT.core; ctx.fillRect(x0 + u * ww - 1, wy - h * .22, 2, h * .44); }
  ctx.globalAlpha = 1; ctx.restore();
  ctx.strokeStyle = rgba(P.cream, .7 * (o.edge ?? 1)); ctx.lineWidth = lerp(2, 3, m); ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, rr); ctx.stroke();
  const lu = (o.label ?? (span(t, win.start - .4, win.start + .6) * (1 - span(t, win.end - .3, win.end + .3)))) * span(m, .85, 1);
  if (lu > 0) {
    const k = w / R.w;
    maskLine(ctx, [[info.name, 0]], cx - w / 2 + 60 * k, cy - h / 2 + 118 * k, 70 * k, rise(lu), { glow: true });
    mintText(ctx, [[info.role.toUpperCase(), .5]], cx - w / 2 + 64 * k, cy - h / 2 + 168 * k, 24 * k, rise(span(lu, .2, 1)), { serif: false, weight: 600, spacing: .14 });
    mintText(ctx, [[`${F.CLIP_LABEL.audio} · ${info.src.toUpperCase()} · PUBLISHED NOV 2026`, .3]], cx + w / 2 - 50 * k, cy - h / 2 + 58 * k, 17 * k, rise(lu), { serif: false, weight: 600, spacing: .12, align: 'right' });
  }
  ctx.restore();
  return { cx, cy, w, h, wy };
}

// ===================================================================================================== WALL CARDS, THE MOUSE, THE DOOR, AN ARROW
// a dark museum wall card: (x, y) = top-left, w = width. o { lines: [[text, mint]…] per line, size, credit, u (rises), dim 0..1, hi 0..1 (mint words) }
export function wallCard(ctx, t, x, y, w, o = {}) {
  const u = clamp(o.u ?? 1), a = (o.a ?? 1) * rise(u); if (a <= 0) return null;
  const size = o.size ?? 44, lines = o.lines, lead = size * 1.18, h = 70 + lines.length * lead + 64;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(0, (1 - expoOut(u)) * 26);
  ctx.fillStyle = lin(ctx, x, y, x, y + h, [[0, mixHex(P.night1, P.ind2, .6)], [1, mixHex(P.night0, P.night1, .5)]]); ctx.beginPath(); ctx.roundRect(x, y, w, h, 8); ctx.fill();
  ctx.strokeStyle = rgba(P.cream, .5); ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = rgba(LAMP.body, .5); ctx.fillRect(x + 40, y + 26, 40, 2);
  const dim = clamp(o.dim ?? 0);
  lines.forEach((segs, i) => { ctx.save(); ctx.globalAlpha *= 1 - .45 * dim; mintText(ctx, segs.map(([s, m]) => [s, m * clamp(o.hi ?? 0)]), x + 40, y + 60 + size * .8 + i * lead, size, rise(span(u, .1 + i * .1, .7 + i * .1))); ctx.restore(); });
  if (o.credit) maskLine(ctx, [[o.credit, 0]], x + 40, y + h - 32, 19, rise(span(u, .4, 1)), { serif: false, weight: 600, col: P.halo2, glow: false });
  ctx.restore();
  return { x, y, w, h };
}
// a lab mouse in profile (indigo, mint rim): (x, y) = feet centre, s = body length. o { a, sniff }
export function mouse(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return; const sn = Math.sin(t * 7) * .5 + .5, br = 1 + .03 * Math.sin(t * 2.2);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  halo(ctx, 0, -s * .25, s * 1.1, .22 * (o.glow ?? 1), MINT.halo, MINT.body);
  ctx.strokeStyle = mixHex(P.ind2, MINT.line, .35); ctx.lineWidth = s * .035; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-s * .45, -s * .12); ctx.bezierCurveTo(-s * .8, -s * .05, -s * .85, -s * .3, -s * 1.05, -s * .22 + .03 * s * Math.sin(t * 1.3)); ctx.stroke();
  const body = new Path2D(); body.ellipse(0, -s * .2 * br, s * .48, s * .2 * br, 0, 0, TAU);
  ctx.fillStyle = lin(ctx, -s * .5, 0, s * .5, 0, [[0, P.ind1], [1, mixHex(P.ind2, P.blue1, .5)]]); ctx.fill(body);
  ctx.save(); ctx.translate(s * .42, -s * .26 + s * .01 * sn); ctx.rotate(.15);
  ctx.beginPath(); ctx.ellipse(0, 0, s * .2, s * .12, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-s * .05, -s * .13, s * .07, s * .08, -.3, 0, TAU); ctx.fill();
  ctx.fillStyle = rgba(MINT.line, .5); ctx.beginPath(); ctx.ellipse(-s * .05, -s * .13, s * .04, s * .05, -.3, 0, TAU); ctx.fill();
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(s * .06, -s * .02, s * .022, 0, TAU); ctx.fill();
  ctx.fillStyle = MINT.core; ctx.beginPath(); ctx.arc(s * .2, s * .01, s * .025, 0, TAU); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = rgba(MINT.line, .6); ctx.lineWidth = Math.max(1, s * .015); ctx.beginPath(); ctx.ellipse(0, -s * .2 * br, s * .48, s * .2 * br, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  ctx.fillStyle = P.night0; for (const fx of [-s * .25, s * .2]) { ctx.beginPath(); ctx.ellipse(fx, -s * .01, s * .06, s * .025, 0, 0, TAU); ctx.fill(); }
  ctx.restore();
}
// the door to HUMAN TRIALS: a tall arch outline with cream lamp light behind a narrow gap. (x, y) = bottom centre, s = height. o { u (draws), a, open }
export function trialDoor(ctx, t, x, y, s, o = {}) {
  const u = clamp(o.u ?? 1), a = o.a ?? 1; if (u <= 0 || a <= 0) return; const w = s * .5;
  ctx.save(); ctx.globalAlpha *= a * rise(u);
  const p = new Path2D(); p.moveTo(x - w / 2, y); p.lineTo(x - w / 2, y - s + w / 2); p.arc(x, y - s + w / 2, w / 2, Math.PI, 0); p.lineTo(x + w / 2, y); p.closePath();
  ctx.fillStyle = lin(ctx, 0, y - s, 0, y, [[0, mixHex(P.night1, P.ind2, .5)], [1, P.night0]]); ctx.fill(p);
  const gap = w * (.06 + .02 * Math.sin(t * .7));
  ctx.save(); ctx.clip(p); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, x - gap, 0, x + gap, 0, [[0, rgba(LAMP.body, 0)], [.5, rgba(LAMP.core, .5)], [1, rgba(LAMP.body, 0)]]); ctx.fillRect(x - gap, y - s, gap * 2, s); ctx.restore();
  ctx.strokeStyle = rgba(P.cream, .7); ctx.lineWidth = 2.5; ctx.stroke(p);
  halo(ctx, x, y, w * 1.2, .14, LAMP.body, LAMP.core);
  ctx.restore();
}
// a mint arrow along a short arc from (x0, y0) to (x1, y1), drawn by u
export function arrow(ctx, x0, y0, x1, y1, u, o = {}) {
  u = clamp(u); if (u <= 0) return; const mx = (x0 + x1) / 2 + (o.bend ?? 0), my = (y0 + y1) / 2 - (o.lift ?? 40);
  const pts = []; for (let i = 0; i <= 24; i++) { const v = i / 24; pts.push([(1 - v) ** 2 * x0 + 2 * v * (1 - v) * mx + v * v * x1, (1 - v) ** 2 * y0 + 2 * v * (1 - v) * my + v * v * y1]); }
  const end = F.mintTrail(ctx, pts, u, { w: o.w ?? 3, spark: u < 1 });
  if (u > .9 && end) { const [ex, ey] = pts[24], [px, py] = pts[21], ang = Math.atan2(ey - py, ex - px), k = (o.head ?? 16) * span(u, .9, 1);
    ctx.save(); ctx.strokeStyle = MINT.core; ctx.lineWidth = (o.w ?? 3) * 1.2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(ex - Math.cos(ang - .5) * k, ey - Math.sin(ang - .5) * k); ctx.lineTo(ex, ey); ctx.lineTo(ex - Math.cos(ang + .5) * k, ey - Math.sin(ang + .5) * k); ctx.stroke(); ctx.restore(); }
}
