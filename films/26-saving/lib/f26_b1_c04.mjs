// Film 26 · B1 · c04 content (line 2, everything gets cheap → ½): one tag from the conveyor fills the frame and tears on "half" (★): the
// bright half lands on a TV in the shop window ($1 IN 2000 → ≈ 2¢ TODAY), the dark half at the hospital at the end of the street ($1 → ≈ $4)
// · coin columns over ALL PRICES +92 % · the sky splits: COPY | TIME · PLACE · the house is hers · three windows under hers (a home, a bed,
// someone) · into the care window (a person's hands and time, no machine) · two stacks of the same height over her roof · ½ (F.testCard) ·
// subscribe 1 wide over the city · down to the mailbox = plateMailbox.
import * as E from './f10_editorial.mjs';
import * as F from './f26_kit.mjs';
import * as S from './f26_seams.mjs';
import { Path2D } from '@napi-rs/canvas';
import { F0, TAU, bump, qb, cap, serif, hospital, careWindows, HOSP, BELT, BELT_K, beltX } from './f26_b1_core.mjs';
const { P, W, H, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, smooth, halo, lin } = E;

const SH = S.SHOP;
const TUBE = [SH.x + 210, S.SHELF_Y[2]], FLAT = [SH.x + 520, S.SHELF_Y[2]];
const BRIGHT_AT = [FLAT[0] + 112, SH.y + 22], DARK_AT = [SH.x + SH.w - 40, SH.y + 22];   // where the two halves end up hanging (string tops)
const HOSP_TAG = [HOSP.win.x - 34, HOSP.win.y - 10];
const CH = { base: 60, k: 1.45, x0: 1720, x1: 2900, cols: [['NURSING HOMES', '+166 %', 266, 1960], ['RENT', '+143 %', 243, 2200], ['COLLEGE', '+196 %', 296, 2440]], tv: 2700 };
const SPLIT = 2300;
const STK = { base: 70, r: 50, L: 380, R: 830, n: 22 };

// ---------------------------------------------------------------- the big tag (screen): w = width, tear 0..1, glow 0..1 (bright half), dark 0..1
const ZIG = [[0, -.02], [.03, .08], [-.025, .17], [.02, .27], [-.03, .36], [.025, .46], [-.02, .55], [.015, .68]];
function tagPath(w) { const p = new Path2D(); p.moveTo(-w * .1, 0); p.lineTo(w * .1, 0); p.lineTo(w * .5, w * .15); p.lineTo(w * .5, w * .65); p.lineTo(-w * .5, w * .65); p.lineTo(-w * .5, w * .15); p.closePath(); return p; }
function halfClip(w, side) { const p = new Path2D(); p.moveTo(side * w, -w); ZIG.forEach(([u, v]) => p.lineTo(u * w, v * w)); p.lineTo(side * w, w); p.closePath(); return p; }
// draw one half (side −1 left / +1 right) or the whole tag (side 0) at (x, y) = the hole, scale by w; col 0..1 → gold (bright) or −1 → dark
function tagHalf(ctx, x, y, w, side, rot, tone) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  if (side) ctx.clip(halfClip(w, side));
  const top = tone > 0 ? mixHex(P.cream, P.core1, tone) : mixHex(P.cream, mixHex(P.ind1, P.blue1, .4), -tone), bot = tone > 0 ? mixHex(mixHex(P.cream, P.halo1, .45), mixHex(P.halo0, P.shade0, .2), tone) : mixHex(mixHex(P.cream, P.halo1, .45), P.night1, -tone);
  ctx.fillStyle = rgba(P.night0, .4); ctx.save(); ctx.translate(w * .03, w * .04); ctx.fill(tagPath(w)); ctx.restore();
  ctx.fillStyle = lin(ctx, 0, 0, 0, w * .65, [[0, top], [1, bot]]); ctx.fill(tagPath(w));
  ctx.fillStyle = mixHex(P.night1, P.ind0, .5); ctx.beginPath(); ctx.arc(0, w * .1, w * .035, 0, TAU); ctx.fill();
  ctx.restore();
}
// the tag state at t: its hole position + size in screen px for the whole, then both halves
function bigTag(ctx, t, a, c) {
  if (t < a.tagUp || t > a.nursing + 2) return;
  const up = sineIO(span(t, a.tagUp, a.tagUp + 1.5)), BIG = [960, 330, 600];
  // start: the tag on the conveyor (world → screen)
  const bx = beltX(a, a.tagUp) + 26, by = BELT.y - 52 + 14, p0 = E.project(c, F0, bx, by) || [BIG[0], BIG[1], 1];
  const drift = 6 * Math.sin(t * .7);
  const hx = lerp(p0[0], BIG[0], up) + drift, hy = lerp(p0[1], BIG[1], up), w = lerp(34 * p0[2], BIG[2], up);
  const tr = expoOut(span(t, a.tear, a.tear + .55)), tone = smooth(span(t, a.tear + .05, a.tear + 1.2));
  // after "For every dollar a TV": the halves go to their places in the street (world anchors, projected each frame)
  const go = sineIO(span(t, a.sw2 + .2, a.tvAt)), goD = sineIO(span(t, a.soft + .6, a.hosp + 1.6));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (tr <= 0) {
    ctx.strokeStyle = rgba(P.cream, .7); ctx.lineWidth = Math.max(1, w * .006); ctx.beginPath(); ctx.moveTo(hx, hy + w * .1); ctx.lineTo(hx - w * .02, hy - 700); ctx.stroke();
    tagHalf(ctx, hx, hy, w, 0, .03 * Math.sin(t * 1.1), 0);
    if (up > .2) halo(ctx, hx, hy + w * .35, w * .9, .18 * up);
  } else {
    // left: bright (the part that is already true), right: dark
    const lT = E.project(c, F0, BRIGHT_AT[0], BRIGHT_AT[1] + 30), lw = lerp(w, 64 * (lT ? lT[2] : 1), go);
    // after the tear the halves keep drifting apart (≈ 40 px/s each) until they ride to their places: the sky door 4.03 is never still
    const sep = Math.max(0, t - a.tear - .3);
    const lx = lerp(hx - 70 * tr - 40 * sep, lT ? lT[0] : hx, go), ly = lerp(hy + 6 * tr - 12 * sep, lT ? lT[1] : hy, go), lr = lerp(-.07 * tr + .02 * Math.sin(t * 1.1), .04 * Math.sin(t * 1.3), go);
    const rAt = goD > 0 ? lerpP(DARK_AT, HOSP_TAG, goD) : DARK_AT, rT = E.project(c, F0, rAt[0] + (goD > 0 && goD < 1 ? 0 : 0), rAt[1] + 30);
    const rw = lerp(w, 64 * (rT ? rT[2] : 1), go), rx = lerp(hx + 80 * tr + 40 * sep, rT ? rT[0] : hx, go), ry = lerp(hy + 90 * tr + 20 * sep, rT ? rT[1] : hy, go), rr = lerp(.14 * tr, .06 * Math.sin(t * 1.2 + 1), go);
    if (tone > 0) halo(ctx, lx - lw * .2, ly + lw * .35, lw * 1.1, .55 * tone, P.halo1, P.core0);
    tagHalf(ctx, lx, ly, lw, -1, lr, tone); tagHalf(ctx, rx, ry, rw, 1, rr, -tone);
    if (tr < 1) halo(ctx, hx, hy + w * .3, w * .5, .7 * (1 - tr), P.halo1, P.core0);
  }
  ctx.restore();
}
const lerpP = (p, q, k) => [lerp(p[0], q[0], k), lerp(p[1], q[1], k) - 160 * Math.sin(Math.PI * k)];

// ---------------------------------------------------------------- the TV window (F0, in `mid`)
function tvWindow(ctx, t, a) {
  if (t > a.nursing + .5) return;
  const em = sineIO(span(t, a.cents - .9, a.cents + .5));
  // the flat screen slides out from behind the tube TV (a copy, flatter, cheaper)
  if (em > 0) F.goods(ctx, 'flat', lerp(TUBE[0], FLAT[0], em), FLAT[1], lerp(110, 150, em));
  F.goods(ctx, 'tv', TUBE[0], TUBE[1], 150);
  // the dollar bill in front of the tube TV
  { const bx = TUBE[0] - 10, by = TUBE[1] - 4; ctx.save(); ctx.translate(bx, by); ctx.rotate(-.06);
    ctx.fillStyle = lin(ctx, -60, -32, 60, 0, [[0, mixHex(P.cream, P.halo1, .2)], [1, mixHex(P.cream, P.halo1, .5)]]); ctx.fillRect(-60, -34, 120, 34);
    ctx.strokeStyle = rgba(P.shade0, .6); ctx.lineWidth = 2; ctx.strokeRect(-55, -30, 110, 26); E.glowText(ctx, '$1', 0, -8, { size: 24, serif: true, col: P.night1, align: 'center', glow: false }); ctx.restore(); }
  // two cent coins drop in front of the flat screen
  for (let i = 0; i < 2; i++) { const u = expoOut(span(t, a.cents + .1 + i * .18, a.cents + .6 + i * .18)); if (u <= 0) continue;
    F.coin(ctx, FLAT[0] - 14 + i * 26, FLAT[1] - 13 - (1 - u) * 90, 12, { flip: (1 - u) * 8 + .2, glint: bump(t, a.cents + .5, 1) }); }
  cap(ctx, 'TV', SH.x + SH.w / 2 - 70, SH.y + 54, 30, span(t, a.tvAt - 1.5, a.tvAt - .7), { col: P.cream });
  cap(ctx, '$1 IN 2000', TUBE[0], SH.y + SH.h - 6, 24, span(t, a.tvAt - 1.1, a.tvAt - .3), { col: P.night1 });
  cap(ctx, '≈ 2¢ TODAY', FLAT[0], SH.y + SH.h - 6, 24, span(t, a.cents + .3, a.cents + 1.1), { col: P.night1 });
  // 4.04 two small tags drop in the window
  [['SOFTWARE −73 %', SH.x + 110], ['PHONE PLANS −44 %', SH.x + SH.w - 170]].forEach(([s, x], i) => {
    const u = expoOut(span(t, (i ? a.phone : a.soft) - .1, (i ? a.phone : a.soft) + .7)); if (u <= 0) return;
    F.priceTag(ctx, t, x, SH.y + 8, 200, s, { len: 8 + 40 * u, size: 17, ang: .25 * (1 - u) * Math.sin(t * 6) + .03 * Math.sin(t * 1.4 + i) });
  });
}
// the hospital: $1 → a stack of four coins, HOSPITAL CARE
function hospitalCard(ctx, t, a) {
  const x = HOSP.win.x + HOSP.win.w + 70, y = HOSP.win.y + HOSP.win.h + 4;
  const ap = expoOut(span(t, a.hospW - .3, a.hospW + .4)); if (ap <= 0) return;
  const n = 1 + 3 * expoOut(span(t, a.four - .15, a.four + .5));
  F.coinStack(ctx, t, x, y, n, 30, { u: 1, a: clamp(ap * 2) });
  if (n > 1.05) halo(ctx, x, y - 40, 120, .4 * bump(t, a.four, 1.4));
  cap(ctx, 'HOSPITAL CARE', HOSP.win.x + HOSP.win.w / 2, HOSP.win.y - 26, 30, span(t, a.hospW, a.hospW + .8), { col: P.cream });
  cap(ctx, '$1 → ≈ $4', HOSP.win.x + HOSP.win.w / 2 + 40, HOSP.win.y + HOSP.win.h + 70, 44, span(t, a.four - .1, a.four + .7));
}
// ---------------------------------------------------------------- the sky field: coin columns, the line, the split
function columns(ctx, t, a) {
  const sink = expoIn(span(t, a.rule - .1, a.rule + .9)); if (t < a.nursing || sink >= 1) return;
  const base = CH.base, k = CH.k;
  CH.cols.forEach(([name, val, idx, x], i) => {
    const t0 = Math.max(a.nursing + 1.0 + i * .4, [a.nursing, a.rent, a.college][i] + .2), u = expoOut(span(t, t0, t0 + 1.2)) * (1 - sink); if (u <= 0) return;
    const n = Math.round(idx * k / 13), top = F.coinStack(ctx, t, x, base, n, 46, { u });
    cap(ctx, name, x, top - 64, 20, span(t, t0 + .5, t0 + 1.2) * (1 - sink), { col: P.cream });
    serif(ctx, val, x, top - 18, 40, span(t, t0 + .6, t0 + 1.3) * (1 - sink), { warm: .5 });
  });
  // TVs −98 %: one thin coin on the base, far below the line
  const tu = expoOut(span(t, a.overall - .2, a.overall + .6)) * (1 - sink);
  if (tu > 0) { F.coinStack(ctx, t, CH.tv, base, 1, 46, { u: tu }); cap(ctx, 'TVs −98 %', CH.tv, base - 40, 20, tu, { col: F.COOL.text }); }
  // ALL PRICES +92 %: a line of gold dust across at the 2000 → 2025 level
  const lu = span(t, a.overall - .5, a.overall + .7); if (lu > 0) {
    const y = base - 192 * k, x1 = lerp(CH.x0, CH.x1, expoOut(lu));
    F.goldDust(ctx, t, [[CH.x0, y], [x1, y]], { n: 160, seed: 261, spread: 6, a: 1 - sink * .2, size: 2.4, speed: .2 });
    ctx.fillStyle = rgba(P.halo0, .8); ctx.fillRect(CH.x0, y - 1.5, x1 - CH.x0, 3);
    cap(ctx, 'ALL PRICES +92 %', CH.x0, y - 18, 22, span(lu, .3, 1), { align: 'left' });
  }
}
function split(ctx, t, a) {
  const u = span(t, a.rule - .2, a.rule + 1.2), out = span(t, a.look + .2, a.look + 1.6); if (u <= 0 || out >= 1) return;
  const y0 = -820, y1 = 90, k = expoOut(u), base = CH.base - 192 * CH.k;
  // the dust line swings up into a vertical line that splits the sky in two
  const ang = (Math.PI / 2) * sineIO(span(u, 0, .8)), len = lerp((CH.x1 - CH.x0) / 2, (y1 - y0) / 2, k), cy = lerp(base, (y0 + y1) / 2, k);
  const dx = Math.cos(ang) * len, dy = Math.sin(ang) * len;
  ctx.fillStyle = rgba(P.halo0, .85 * (1 - out)); ctx.save(); ctx.translate(SPLIT, cy); ctx.rotate(ang); ctx.fillRect(-len, -1.5, len * 2, 3); ctx.restore();
  F.goldDust(ctx, t, [[SPLIT - dx, cy - dy], [SPLIT + dx, cy + dy]], { n: 120, seed: 262, spread: 8, a: 1 - out, size: 2.2, speed: .15 });
  // the two halves of the sky: cool on the left, warm on the right
  const wash = smooth(span(u, .5, 1)) * (1 - out);
  if (wash > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(ctx, SPLIT - 900, 0, SPLIT, 0, [[0, rgba(F.COOL.halo, 0)], [1, rgba(F.COOL.halo, .1 * wash)]]); ctx.fillRect(SPLIT - 900, y0, 900, y1 - y0);
    ctx.fillStyle = lin(ctx, SPLIT, 0, SPLIT + 900, 0, [[0, rgba(P.halo1, .1 * wash)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(SPLIT, y0, 900, y1 - y0); ctx.restore(); }
  cap(ctx, 'COPY', SPLIT - 420, -560, 40, span(t, a.rule + .6, a.rule + 1.3) * (1 - out), { col: F.COOL.text });
  cap(ctx, 'TIME · PLACE', SPLIT + 380, -560, 40, span(t, a.rule + .8, a.rule + 1.5) * (1 - out), { col: F.GOLD.text });
  // left: one thing, copied over and over; its tag falls
  const cu = span(t, a.copy - .2, a.copy + 1.8);
  for (let i = 0; i < 7; i++) { const ku = expoOut(span(cu, i * .1, i * .1 + .3)); if (ku <= 0) continue;
    const x = SPLIT - 700 + (i % 4) * 150 + (i >= 4 ? 75 : 0), y = -330 + (i >= 4 ? 130 : 0);
    ctx.save(); ctx.globalAlpha *= (1 - out) * clamp(ku * 2); F.goods(ctx, 'flat', lerp(SPLIT - 700, x, ku), lerp(-330, y, ku), 92); ctx.restore(); }
  if (cu > 0) { const d = sineIO(span(t, a.cheap4 - .5, a.cheap4 + .7)); F.priceTag(ctx, t, SPLIT - 120, -500, 120, d > .9 ? '$0' : '$', { len: lerp(20, 330, d), size: 30, serif: true, col: d > .9 ? 'gold' : 'cream', a: (1 - out) * expoOut(cu * 3) }); }
  // right: two hands at work (a person's time) and a house (a place); their tags rise
  const hu = span(t, a.time - .1, a.time + .9);
  if (hu > 0) { hands(ctx, t, SPLIT + 300, -280, 1.2, expoOut(hu) * (1 - out));
    cap(ctx, 'ECONOMISTS CALL IT THE BAUMOL EFFECT', SPLIT + 300, -110, 18, span(t, a.time + .9, a.time + 1.7) * (1 - out), { col: P.halo2 });
    const r = sineIO(span(t, a.time + .5, a.doesnot + .6)); F.priceTag(ctx, t, SPLIT + 300, -560, 110, '$', { len: lerp(140, 30, r), size: 30, serif: true, a: (1 - out) * expoOut(hu) }); }
  const pu = span(t, a.place - .2, a.place + .8);
  if (pu > 0 && t < a.look + .3) { houseIcon(ctx, t, SPLIT + 640, -200, expoOut(pu));
    const r = sineIO(span(t, a.place + .3, a.look)); F.priceTag(ctx, t, SPLIT + 640, -560, 110, '$', { len: lerp(140, 30, r), size: 30, serif: true, a: expoOut(pu) }); }
}
// two working hands (indigo, warm rim), shaping a small glowing thing between them
function hands(ctx, t, x, y, s, u) {
  if (u <= 0) return;
  ctx.save(); ctx.globalAlpha *= clamp(u * 2); ctx.translate(x, y); ctx.scale(s, s);
  halo(ctx, 0, 6, 90, .5 * u, P.halo1, P.core0); ctx.fillStyle = P.core1; ctx.beginPath(); ctx.ellipse(0, 6, 22, 16, 0, 0, TAU); ctx.fill();
  for (const sd of [-1, 1]) {
    const m = .06 * Math.sin(t * 2.2 + sd);
    ctx.save(); ctx.translate(sd * 52, 18); ctx.rotate(sd * (.35 + m)); ctx.scale(sd, 1);
    ctx.fillStyle = mixHex(P.ind2, P.blue0, .3); ctx.fillRect(10, 10, 46, 70);   // sleeve
    ctx.fillStyle = lin(ctx, -40, -30, 30, 30, [[0, mixHex(P.shade0, P.halo1, .5)], [1, mixHex(P.shade0, P.night1, .4)]]);
    ctx.beginPath(); ctx.roundRect(-34, -34, 62, 52, 22); ctx.fill();               // palm + fingers
    ctx.beginPath(); ctx.ellipse(-30, 6, 12, 22, -.7, 0, TAU); ctx.fill();          // thumb
    ctx.restore();
  }
  ctx.restore();
}
function houseIcon(ctx, t, x, y, u) {
  ctx.save(); ctx.translate(x, y + (1 - u) * 40); ctx.globalAlpha *= clamp(u * 2);
  ctx.fillStyle = mixHex(F.NIGHT.wall, P.blue1, .35); ctx.fillRect(-80, -90, 160, 120);
  ctx.beginPath(); ctx.moveTo(-100, -90); ctx.lineTo(0, -170); ctx.lineTo(100, -90); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mixHex(P.core1, P.halo0, .4); ctx.fillRect(-56, -60, 50, 40); halo(ctx, -31, -40, 80, .4);
  ctx.fillStyle = mixHex(P.night0, P.night1, .5); ctx.fillRect(20, -40, 36, 70);
  ctx.restore();
}
// ---------------------------------------------------------------- two stacks of the same height over her roof
function stacks(ctx, t, a) {
  const sink = expoIn(span(t, a.needold + 1.2, a.channel + .8)); if (t < a.year || sink >= 1) return;
  const lu = expoOut(span(t, a.year + 1.3, a.year + 2.8)) * (1 - sink), { base, r, L, R, n } = STK;
  const topL = F.coinStack(ctx, t, L, base, n, r, { u: lu });
  cap(ctx, '1 YEAR NURSING HOME', L, base + 48, 22, span(t, a.year + 2.0, a.year + 2.8) * (1 - sink), { col: P.cream });
  cap(ctx, '≈ $130,000', L, base + 90, 34, span(t, a.year + 2.3, a.year + 3.1) * (1 - sink));
  // five segments of $25,000, one per year
  let top = base;
  for (let i = 0; i < 5; i++) { const t0 = a.five - .1 + i * .28, u = expoOut(span(t, t0, t0 + .6)) * (1 - sink); if (u <= 0) break;
    top = F.coinStack(ctx, t, R, base - i * (n / 5) * r * .26, n / 5, r, { u }) + r * .3;
    ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(R - r, base - (i + 1) * (n / 5) * r * .26 - 1, r * 2, 2); }
  cap(ctx, '5 YEARS SOCIAL SECURITY', R, base + 48, 22, span(t, a.five + .8, a.five + 1.6) * (1 - sink), { col: P.cream });
  cap(ctx, '≈ $25,000 / YEAR', R, base + 90, 34, span(t, a.five + 1.1, a.five + 1.9) * (1 - sink));
  // the same height: a thin gold line across both tops
  const eq = span(t, a.check - .3, a.check + .6) * (1 - sink); if (eq > 0) { const y = base - n * r * .26 - r * .3; ctx.fillStyle = rgba(P.halo0, .8); ctx.fillRect(L - r - 20, y - 1, (R - L + 2 * r + 40) * expoOut(eq), 2); }
}

// ---------------------------------------------------------------- hooks
export function c04(a, t, st, w, L, cam, world) {
  if (t < a.c04 - 1) return;
  if (world === 'ware') {
    w.conveyor = { ...(w.conveyor || {}), skip: t > a.tagUp ? BELT_K : undefined };
  } else {
    // the street: the shop is a TV window now; the hospital at the end; the three windows under hers; her stacks
    st.shop = { fill: 0, light: .55 };
    const off = (i) => 1 - span(t, a.want + i * .35, a.want + .5 + i * .35);   // lights out one after the other (wide shot), before the mailbox plate
    const lit = [span(t, a.home - .15, a.home + .35) * off(0), span(t, a.bed - .15, a.bed + .35) * off(1), span(t, a.someone - .15, a.someone + .35) * off(2)];
    L.mid.push((ctx, c) => {
      E.card(ctx, c, F0, () => { hospital(ctx, t, { lit: 1 }); tvWindow(ctx, t, a); hospitalCard(ctx, t, a); });
      if (t > a.look && t < a.want + 1.4) careWindows(ctx, c, t, { lit, hold: smooth(span(t, a.hands - .5, a.hands + .8)) });
    });
    L.front.push((ctx, c) => E.card(ctx, c, F0, () => { columns(ctx, t, a); split(ctx, t, a); stacks(ctx, t, a);
      // the warm light of the house icon falls into her window (the house is hers)
      const u = sineIO(span(t, a.look + .2, a.look + 2.6)); if (u > 0 && u < 1) { const p = qb([SPLIT + 615, -240], [1400, -500], [S.MYWIN.x + 120, S.MYWIN.y + 120], u);
        halo(ctx, p[0], p[1], 120, .8, P.halo1, P.core0); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(p[0], p[1], 10, 0, TAU); ctx.fill(); }
      if (t > a.look + 2.4) halo(ctx, S.MYWIN.x + S.MYWIN.w / 2, S.MYWIN.y + S.MYWIN.h / 2, 300, .4 * (1 - span(t, a.look + 2.6, a.look + 3.8)));
      // the older you walks out of the house door to the mailbox (4.15 → 4.16)
    }));
    // her window: she stands there until "Including you", then steps away; then she comes out of the door and goes to the mailbox
    const ROOMFIG = { light: 1, back: .4, dir: 1 };
    const leave = span(t, a.including + .3, a.including + 1.9);
    st.room = { ...st.room, who: false, lit: lerp(1, .8, span(t, a.channel, a.want)),
      extra: (ctx, c, hands) => { if (leave >= 1) return; const [fx, fy, fh] = S.ROOM.fig;
        if (leave <= 0) F.older(ctx, fx, fy, fh, { ...ROOMFIG, ...(st.room.fig || {}) });
        else F.older(ctx, lerp(fx, fx - 340, leave), fy, fh, { ...ROOMFIG, dir: -1, walk: t * 4.5 }); } };
    const out = span(t, a.including + 2.2, a.stop + .2);
    if (out > 0) {
      const ox = lerp(200, 790, sineIO(out)), reach = sineIO(span(t, a.whopays - .9, a.whopays + .1)), open = expoOut(span(t, a.whopays - .2, a.whopays + .6));
      st.older = out < 1 ? { x: ox, dir: 1, walk: t * 4.6, h: 210 } : { x: 790, look: lerp(0, -.25, reach), armR: [lerp(.2, 1.05, reach), lerp(.1, .5, reach)], pose: 'stand' };
      st.mailbox = { open, flag: 0 };
    }
  }
  L.screen.push((ctx, c) => {
    bigTag(ctx, t, a, c);
    F.source(ctx, t, a.tvAt - .8, a.hosp + 3.5, F.SOURCES.bls);
    F.source(ctx, t, a.nursing + 1.5, a.rule + .5, F.SOURCES.bls);
    F.source(ctx, t, a.year + 2.2, a.second + .5, F.SOURCES.care);
    const su = span(t, a.everybody - .3, a.everybody + .6) * (1 - span(t, a.stop - .4, a.stop + .3));
    if (su > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); cap(ctx, 'SO SUPERINTELLIGENCE GOES WELL FOR EVERYBODY', 960, 858, 24, su, { col: P.cream }); ctx.restore(); }
  });
}
