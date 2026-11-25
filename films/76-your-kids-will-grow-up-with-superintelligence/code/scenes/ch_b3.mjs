// Film 76 · package B3 (builder). Draws keyed by shot id (scenes/plan.mjs, pk 'B3'); see docs/BRIEF-builders.md. Skills first: scenario-motion,
// world-class-motion-design, fluid-motion-design, motion-director-gates, dataviz. Quality reference: scenes/ch_hook.mjs.
// Every shot: draw(ctx, t, S, T) with S = { id, a, b, in, out, tr, seed, pk }; anchor on phrases only (K.phr(T, S, t) → G/U/IN).
//
// B3 = AGE 30 (a30a–a30h + C4) · the four tips (t0–t11 + C5) · the close (s1–s6, Leitbild 3 + 4) · e1 (mission, subscribe, end picture).
// Through-lines of this package:
//   THE LIST SHEET: the paper plane lands on the kitchen table in t0 and opens into the sheet STARTING TONIGHT (four empty lines). In
//     t1–t11 it sits small on the left (screen space, identical in every shot, so the plane's disc reveal is invisible there) and fills
//     line by line on the spoken tip; in s1 it comes back big, lights ONE WHO ASKS · SHOWS UP · SOLVES and folds into a child.
//   THE MINI CLOCK under the sheet: the five steps small, the child hops AGE 6 → 12 → 18 on the spoken age.
//   Matches with shared state helpers (the seam is the same function on both sides): t1/t2 tableScene · t7/t8/t9 reachScene + seesaw ·
//   s2/s3 kitchen push · s6/e1 closeWorld (the gate; e1 opens the gate as a mask onto the end picture: the five steps, AGE 0 · 2056).
import { Path2D } from '@napi-rs/canvas';
import * as K from '../lib/f76_kit.mjs';
const { W, H, P, E, clamp, lerp, span, sineIO, expoOut, expoIn, rise, halo, rgba, mixHex, GOLD, CREAM, MUTED, MACH, PAPER76, PAPER } = K;
const TAU = Math.PI * 2;
const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));
const INK = PAPER76.ink, FAINT = '#6e6a58';
const AIC = { body: MACH.heart, line: MACH.heartCore, deep: MACH.heartDeep };
const CREAMC = { body: CREAM, line: '#ffffff', deep: P.blue1 };

// ================================================================================================================ shared: phrase memo
const MEMO = new WeakMap();
function TT(T) {
  let m = MEMO.get(T); if (m) return m;
  const f = T.G('So what does a parent do');
  m = {
    f,
    line: [T.G('Use these machines together', 0, f), T.G('Ask back', 0, f), T.G('protect the slow', 0, f), T.G('Problems, not job titles', 0, f)],
    age6: T.G('Start with the six-year-old', 0, f), age12: T.G('For the twelve-year-old', 0, f), age18: T.G('And for the eighteen-year-old', 0, f),
    close: T.G("Your parents didn't raise", 0, f),
  };
  m.s6 = T.G("Your kids won't compete", 0, m.close); m.matters = T.G('What matters is', 0, m.close);
  m.mission = T.G("That's what this channel", 0, m.close); m.making = T.G('making sure', 0, m.mission); m.everybody = T.G('everybody', 0, m.mission);
  m.children = T.G('children born', 0, m.mission); m.want = T.G('Want that too', 0, m.mission); m.sub = T.G('subscribe', 0, m.want); m.vEnd = T.GE('subscribe', 0, m.want);
  m.open0 = m.vEnd + .75; m.open1 = m.open0 + 3.3;                  // e1: the gate opens onto the end picture
  m.turn = m.vEnd + 5.6; m.baby = m.vEnd + 7.2; m.roll = m.vEnd + 8.4; // end picture: the grown-up turns, a new baby, AGE 0 · 2056
  MEMO.set(T, m); return m;
}

// ================================================================================================================ shared: paper + type
// a paper sheet with the title STARTING TONIGHT and four numbered lines. o: { fs (line text size), u (unfold 0..1), title 0..1,
//   lines [{ s, u (written), hi (gold highlight), num (numeral + rule shown) , ph (placeholder ? pulsing) }], a, rot, glow }
// returns the numeral anchor of each line [[x, y]] (screen space of the caller) and the line baselines.
function sheet(ctx, t, x, y, w, h, o = {}) {
  const fs = o.fs ?? 24, pad = fs * 1.35, ts = Math.max(22, Math.round(fs * .78)), a = o.a ?? 1, u = clamp(o.u ?? 1);
  const ty = y + pad + ts, top = ty + fs * .9, row = (y + h - pad * .6 - top) / 4, out = [];
  for (let i = 0; i < 4; i++) out.push([x + pad + fs * .35, top + row * (i + .62) - fs * .4]);
  if (u <= 0 || a <= 0) return { pts: out, row, top };
  ctx.save(); ctx.globalAlpha *= a;
  const cx = x + w / 2, cy = y + h / 2, k = expoOut(u);
  ctx.translate(cx, cy); ctx.rotate(o.rot ?? 0); ctx.scale(lerp(.1, 1, k), lerp(.1, 1, k)); ctx.translate(-cx, -cy);
  if (o.glow) halo(ctx, cx, cy, Math.max(w, h) * .8, .16 * o.glow, GOLD.halo, GOLD.core);
  ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.roundRect(x + 8, y + 12, w, h, 8); ctx.fill();
  ctx.fillStyle = K.lin(ctx, x, y, x + w, y + h, [[0, PAPER76.lit], [1, PAPER76.body]]); ctx.beginPath(); ctx.roundRect(x, y, w, h, 8); ctx.fill();
  ctx.fillStyle = rgba(PAPER76.shade, .35); ctx.fillRect(x, y + h - 6, w, 6);
  if (u > .6) {
    const ku = span(u, .6, 1);
    K.cap(ctx, 'STARTING TONIGHT', x + pad, ty, (o.title ?? 1) * ku, { size: ts, col: FAINT });
    (o.lines ?? []).forEach((L, i) => {
      const ly = top + row * (i + .62), nu = clamp(L.num ?? 1) * ku; if (nu <= 0) return;
      const hi = clamp(L.hi ?? 0), tx = x + pad + fs * 1.5;
      if (hi > 0) { ctx.fillStyle = rgba(GOLD.body, .55 * hi); ctx.beginPath(); ctx.roundRect(x + pad * .35, ly - fs * 1.05, 5, fs * 1.4, 2); ctx.fill(); }
      E.glowText(ctx, String(i + 1), x + pad, ly, { size: fs * 1.3, serif: true, col: mixHex(FAINT, GOLD.deep, hi), glow: false, a: nu });
      ctx.fillStyle = rgba(INK, .18 * nu); ctx.fillRect(tx, ly + fs * .32, (x + w - pad) - tx, Math.max(1.5, fs * .06));
      if (L.ph) { const pu = .55 + .45 * Math.sin(t * 3.1); E.glowText(ctx, '?', tx + 4, ly, { size: fs * 1.2, serif: true, col: mixHex(FAINT, GOLD.deep, .5), glow: false, a: clamp(L.ph) * pu }); }
      if ((L.u ?? 0) > 0) K.cap(ctx, L.s, tx, ly, L.u, { size: fs, col: mixHex(INK, GOLD.deep, hi * .8) });
    });
  }
  ctx.restore();
  return { pts: out, row, top };
}
// open-outline serif text (a question that stays open). u = left → right wipe; returns the width
function outlineText(ctx, s, x, y, size, u, o = {}) {
  ctx.save(); ctx.font = `${size}px "Instrument Serif"`; ctx.textAlign = 'left';
  const w = ctx.measureText(s).width, x0 = o.align === 'center' ? x - w / 2 : x;
  if (u > 0) {
    ctx.beginPath(); ctx.rect(x0 - 20, y - size * 1.1, (w + 40) * clamp(u), size * 1.5); ctx.clip();
    ctx.shadowColor = rgba(P.halo0, .5); ctx.shadowBlur = size * .25;
    ctx.strokeStyle = rgba(CREAM, o.a ?? .95); ctx.lineWidth = o.lw ?? 2; ctx.lineJoin = 'round'; ctx.strokeText(s, x0, y);
    if (o.fill) { ctx.shadowBlur = 0; ctx.fillStyle = rgba(GOLD.body, o.fill); ctx.fillText(s, x0, y); }
  }
  ctx.restore();
  return { w, x0 };
}

// ================================================================================================================ the tips panel (t1–t11)
const PANEL = { x: 96, y: 150, w: 500, h: 330 };
const TIPS = ['USE IT TOGETHER', 'ASK BACK', 'PROTECT THE HUMAN THINGS', 'PROBLEMS, NOT JOB TITLES'];
function tipLines(t, T) {
  const m = TT(T);
  return TIPS.map((s, i) => {
    const t0 = m.line[i], nx = i < 3 ? m.line[i + 1] : 1e9;
    return { s, u: span(t, t0 - .05, t0 + .55), hi: span(t, t0 - .1, t0 + .4) * (1 - span(t, nx - .2, nx + .3)), num: 1,
      ph: i === 3 ? span(t, m.age18 + .3, m.age18 + .9) * (1 - span(t, t0 - .3, t0)) : 0 };
  });
}
const MC = { x: 110, base: 820, bw: 94, top0: 752, rise: 22 };
const mcTop = (j) => [MC.x + j * MC.bw, MC.top0 - j * MC.rise];
function miniClock(ctx, t, T, a = 1) {
  const m = TT(T), st = [[6, m.age6], [12, m.age12], [18, m.age18]];
  let cur = 0; for (let k = 0; k < 3; k++) if (t >= st[k][1] - .3) cur = k;
  const i = cur + 1, mv = cur === 0 ? 1 : sineIO(span(t, st[cur][1] - .3, st[cur][1] + .6)), lit = sineIO(span(t, st[cur][1] - .3, st[cur][1] + .5));
  ctx.save(); ctx.globalAlpha *= a;
  for (let j = 0; j < 5; j++) {
    const [x, y] = mcTop(j), L = j === i ? lit : j < i ? .25 : 0;
    ctx.fillStyle = K.lin(ctx, 0, y, 0, MC.base + 40, [[0, '#1a2560'], [1, '#0c1238']]); ctx.fillRect(x, y, MC.bw - 4, MC.base + 40 - y);
    ctx.fillStyle = rgba(mixHex('#3a4a8c', '#ffe2a0', L), .9); ctx.fillRect(x, y, MC.bw - 4, 4);
    if (L > .3) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = K.lin(ctx, 0, y - 70, 0, y + 2, [[0, rgba('#ffd98a', 0)], [1, rgba('#ffd98a', .2 * L)]]); ctx.fillRect(x, y - 70, MC.bw - 4, 72); ctx.restore(); }
  }
  const age = st[cur][0], [px, py] = mcTop(Math.max(0, i - 1)), [qx, qy] = mcTop(i);
  const x = lerp(px, qx, mv) + MC.bw / 2 - 2, y = lerp(py, qy, mv) - Math.sin(Math.PI * mv) * 18, h = { 6: 50, 12: 62, 18: 72 }[age];
  K.kid(ctx, x, y, h, { age, dir: 1, look: .4, light: 1 });
  K.cap(ctx, `AGE ${age}`, qx + MC.bw / 2 - 2, qy - h - 26, lit, { size: 24, align: 'center', col: GOLD.text, glow: true });
  ctx.restore();
}
function tipPanel(ctx, t, T, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  sheet(ctx, t, PANEL.x, PANEL.y, PANEL.w, PANEL.h, { fs: 22, lines: tipLines(t, T), u: o.u ?? 1, a: o.a ?? 1 });
  if (o.clock !== false) miniClock(ctx, t, T, o.a ?? 1);
  ctx.restore();
}

// ================================================================================================================ AGE 30
// AGE n · YEAR with age and year rolling separately
function counter2(ctx, x, y, size, ageA, ageB, ageU, yearA, yearB, yearU, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  K.cap(ctx, 'AGE', x, y - size * 1.02, 1, { size: Math.max(22, Math.round(size * .26)), col: CREAM });
  K.rollText(ctx, ageA, ageB, ageU, x, y, size, { col: '#fff6d8' });
  const dw = K.measure('0', size, true) * 1.02, w1 = lerp(dw * ageA.trim().length, dw * ageB.trim().length, sineIO(span(ageU, .1, .8)));   // the year slides along as the age changes width
  E.glowText(ctx, '·', x + w1 + size * .2, y - size * .06, { size: size * .7, serif: true, col: GOLD.text, glow: false });
  K.rollText(ctx, yearA, yearB, yearU, x + w1 + size * .5, y, size, { col: GOLD.text });
  ctx.restore();
}
const counterW = (size, nA = 2) => K.measure('0', size, true) * 1.02 * (nA + 4) + size * .5;

// the day strip (a30c) and its miniature on the Tuesday card (a30d)
function dayStrip(ctx, t, x0, x1, y, h, room, o = {}) {
  const w = x1 - x0, we = lerp(x0 + w * .84, x0 + w * .24, room);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  // WORK (cool: carried by machines) and ROOM (gold field)
  ctx.fillStyle = K.lin(ctx, 0, y - h, 0, y, [[0, '#5a6aa8'], [1, '#2c3a78']]); ctx.beginPath(); ctx.roundRect(x0, y - h * (o.grow ?? 1), we - x0, h * (o.grow ?? 1), [6, 6, 2, 2]); ctx.fill();
  if (room > 0) {
    ctx.fillStyle = rgba(GOLD.body, .12 * room); ctx.fillRect(we + 6, y - h, x1 - we - 6, h);
    ctx.fillStyle = rgba(GOLD.line, .8 * room); ctx.fillRect(we + 6, y - h, (x1 - we - 6) * expoOut(room), 2);
  }
  ctx.restore();
  return we;
}
function familyIcon(ctx, x, y, s) { E.du(ctx, x - s * .18, y, s, { dir: 1, look: .2, light: 1 }); K.kid(ctx, x + s * .22, y, s * .55, { age: 4, dir: -1, look: .6, light: 1 }); }
function frameIcon(ctx, x, y, s, u = 1) {   // a little timber frame being built (flat bars)
  ctx.save(); ctx.fillStyle = mixHex('#e8d29a', '#b89a5a', .3);
  const b = (x0, y0, x1, y1) => { const L = Math.hypot(x1 - x0, y1 - y0), a = Math.atan2(y1 - y0, x1 - x0); ctx.save(); ctx.translate(x0, y0); ctx.rotate(a); ctx.fillRect(0, -s * .03, L, s * .06); ctx.restore(); };
  const l = x - s * .4, r = x + s * .4, g = y, tp = y - s * .55;
  b(l, g, l, tp); b(r, g, r, tp); b(l - s * .06, tp, r + s * .06, tp); b(l, g, r, g);
  if (u > .3) { b(l - s * .1, tp, x, y - s * .95 * clamp((u - .3) / .4 + .5, 0, 1)); }
  if (u > .6) b(x, y - s * .95, r + s * .1, tp);
  b(l, g - s * .02, r, tp + s * .02);
  ctx.restore();
}

// ================================================================================================================ t1/t2: the tablet at the table
function tableCam(t, T) {
  const m = TT(T), a = m.age6 - .35, b = T.G("Most schools aren't there", 0, m.f) - .35;
  return { a, b, seed: 41 };
}
function tableScene(ctx, t, T) {
  const m = TT(T), g = (p) => T.G(p, 0, m.f);
  const kidIn = rise(span(t, m.age6 - .2, m.age6 + .7)), lit = sineIO(span(t, m.line[0] - .3, m.line[0] + .6));
  const wrong = g('could be wrong'), circ = span(t, wrong - .1, wrong + .8);
  const sus = g('Susskind borrows'), calc = sineIO(span(t, g('old fight') - .3, g('calculators') + .5));
  const out = expoIn(span(t, sus - .1, sus + .9)), split = sineIO(span(t, g('With the machine') - .2, g('With the machine') + .8));
  const without = span(t, g('without it') - .1, g('without it') + .7);
  // the floor and a low table
  ctx.fillStyle = K.lin(ctx, 0, 820, 0, H, [[0, '#18225a'], [1, P.night0]]); ctx.fillRect(-100, 820, W + 200, 400);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = K.rad(ctx, 1290, 700, 560, [[0, rgba(MACH.heart, .1 * lit * (1 - calc))], [1, rgba(MACH.heart, 0)]]); ctx.beginPath(); ctx.arc(1290, 700, 560, 0, 6.29); ctx.fill(); ctx.restore();
  const tblA = 1 - out;
  if (tblA > 0) { ctx.save(); ctx.globalAlpha *= tblA; ctx.fillStyle = K.lin(ctx, 0, 690, 0, 716, [[0, '#3a3a62'], [1, '#22284e']]); ctx.beginPath(); ctx.roundRect(1110, 690, 360, 24, 4); ctx.fill(); ctx.fillStyle = '#121838'; ctx.fillRect(1150, 714, 18, 110); ctx.fillRect(1412, 714, 18, 110); ctx.restore(); }
  // the people: you (left) and the six-year-old (right), both turned to the tablet; they sink away when the rule comes in (t2)
  if (out < 1) {
    ctx.save(); ctx.globalAlpha *= 1 - out;
    const look = .25 + .5 * lit;
    E.du(ctx, 940, 830 + out * 40, 380, { view: 'side', dir: 1, look: look * .7, lean: .05 * lit, light: 1, armR: [lerp(.3, 1.2, lit), lerp(.4, 1.5, lit)] });
    ctx.save(); ctx.globalAlpha *= kidIn; K.kid(ctx, 1640, 830 + (1 - kidIn) * 20 + out * 40, 230, { age: 6, dir: -1, look, lean: .04 * lit, light: 1, armR: [lerp(.3, 1.1, lit), lerp(.4, 1.3, lit)] }); ctx.restore();
    ctx.restore();
  }
  // the tablet → the old pocket calculator → left column; a sheet with pencil sums on the right
  const cx = lerp(1290, 1070, split), cy = lerp(560, 540, split) + Math.sin(t * .9) * 2;
  const tw = lerp(380, 200, calc), th = lerp(260, 300, calc), ta = clamp(span(t, m.f - 1, m.age6 + .4) * 3);
  if (calc < .5) K.tablet(ctx, t, cx, cy, tw, th, { lit: lit * (1 - calc * 2), a: ta * (1 - calc * 2) + (calc > 0 ? calc * 2 : 0) * 0, content: (c, sx, sy, sw, sh) => {
    if (lit <= 0) return;
    c.save(); c.globalAlpha *= lit;
    c.fillStyle = rgba('#ffffff', .85); c.beginPath(); c.roundRect(sx + 24, sy + 22, sw * .42, 14, 6); c.fill();
    [.78, .66, .72, .5].forEach((f, i) => { c.fillStyle = rgba(i === 2 ? '#ffffff' : '#e9fbff', i === 2 ? .9 : .65); c.beginPath(); c.roundRect(sx + 24, sy + 62 + i * 36, (sw - 48) * f, 10, 5); c.fill(); });
    c.restore();
  } });
  if (calc > 0) calculator(ctx, cx, cy, tw, th, calc);
  // the circled line (t1 'wrong'): a pencil ellipse drawn around line 3 of the answer
  if (circ > 0 && calc < .6) {
    const ex = 1290 - 380 / 2 + 24 + (380 - 48) * .36 + 6, ey = 560 - 260 / 2 + 18 + 62 + 2 * 36 + 5;
    ctx.save(); ctx.globalAlpha *= 1 - span(calc, .2, .6); ctx.strokeStyle = GOLD.line; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.shadowColor = rgba(GOLD.halo, .8); ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.ellipse(ex, ey, 150, 26, -.04, -2.6, -2.6 + TAU * 1.05 * sineIO(circ)); ctx.stroke(); ctx.restore();
  }
  K.cap(ctx, 'WHERE COULD IT BE WRONG?', 1290, 330, span(t, wrong - .5, wrong + .3) * (1 - span(t, sus - .2, sus + .3)), { size: 30, align: 'center', col: CREAM });
  // t2: the rule
  const capU = span(t, sus - .1, sus + .5) * (1 - span(t, g('Teach both') - .4, g('Teach both') + .1));
  K.cap(ctx, 'DANIEL SUSSKIND', 1290, 262, capU, { size: 22, align: 'center', col: MUTED });
  K.cap(ctx, 'THE OLD FIGHT OVER CALCULATORS', 1290, 312, span(t, g('old fight') - .2, g('old fight') + .5) * (1 - span(t, g('Teach both') - .4, g('Teach both') + .1)), { size: 30, align: 'center', col: CREAM });
  const tb = span(t, g('Teach both') - .1, g('Teach both') + .5), tsb = span(t, g('Test both') - .1, g('Test both') + .5);
  K.cap(ctx, 'TEACH BOTH', 1270, 262, tb, { size: 36, align: 'right', col: GOLD.text, glow: true });
  K.cap(ctx, '· TEST BOTH', 1290, 262, tsb, { size: 36, col: GOLD.text, glow: true });
  if (split > 0) {
    ctx.fillStyle = rgba(CREAM, .28 * split); ctx.fillRect(1288, 380, 3, 360 * expoOut(split));
    K.cap(ctx, 'WITH THE MACHINE', 1070, 760, split, { size: 26, align: 'center', col: CREAM });
  }
  if (without > 0) {
    const k = expoOut(without), px = 1520, py = 540 + (1 - k) * 40;
    ctx.save(); ctx.globalAlpha *= clamp(without * 3); ctx.translate(px, py); ctx.rotate(.04);
    ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-100 + 8, -140 + 10, 200, 280);
    ctx.fillStyle = K.lin(ctx, -100, -140, 100, 140, [[0, PAPER76.lit], [1, PAPER76.body]]); ctx.fillRect(-100, -140, 200, 280);
    const hand = [[.62, 0], [.48, 0], [.7, 1], [.4, 0], [.55, 1]];
    hand.forEach(([f, dbl], i) => { const wu = span(without, .2 + i * .1, .5 + i * .1); ctx.fillStyle = rgba(INK, .55); ctx.fillRect(-72, -96 + i * 44, 144 * f * wu, 5); if (dbl && wu >= 1) ctx.fillRect(-72, -96 + i * 44 + 9, 144 * f, 3); });
    ctx.restore();
    // the pencil
    ctx.save(); ctx.globalAlpha *= clamp(without * 3); ctx.translate(px + 96, py + 92 - k * 20); ctx.rotate(-.75);
    ctx.fillStyle = '#e6dcbc'; ctx.fillRect(-90, -9, 150, 18); ctx.fillStyle = '#b4a984'; ctx.fillRect(-90, 2, 150, 7);
    ctx.fillStyle = '#d9b98a'; ctx.beginPath(); ctx.moveTo(60, -9); ctx.lineTo(92, 0); ctx.lineTo(60, 9); ctx.closePath(); ctx.fill(); ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(84, -2.5); ctx.lineTo(92, 0); ctx.lineTo(84, 2.5); ctx.closePath(); ctx.fill();
    ctx.restore();
    K.cap(ctx, 'WITHOUT IT', 1520, 760, without, { size: 26, align: 'center', col: CREAM });
  }
}
function calculator(ctx, x, y, w, h, u) {   // an old pocket calculator (flat): body, grey LCD with digits, a 4×4 key grid
  const k = span(u, .35, 1); if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= clamp(k * 2.5); ctx.translate(x, y);
  ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(-w / 2 + 8, -h / 2 + 12, w, h, 16); ctx.fill();
  ctx.fillStyle = K.lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, '#4a4668'], [1, '#2a2846']]); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 16); ctx.fill();
  ctx.fillStyle = '#c9c4a2'; ctx.beginPath(); ctx.roundRect(-w / 2 + 18, -h / 2 + 20, w - 36, h * .2, 6); ctx.fill();
  E.glowText(ctx, '1,000', w / 2 - 28, -h / 2 + 20 + h * .15, { size: h * .12, serif: true, align: 'right', col: '#3a3a42', glow: false, a: span(k, .4, 1) });
  const g = (w - 36) / 4;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { ctx.fillStyle = c === 3 ? '#8a7a5a' : '#6a6890'; ctx.beginPath(); ctx.roundRect(-w / 2 + 18 + c * g + 4, -h / 2 + h * .3 + r * g * .92 + 4, g - 8, g * .92 - 8, 5); ctx.fill(); }
  ctx.restore();
}

// ================================================================================================================ t7/t8/t9: answers in reach → seesaw
const SEE = { x: 1300, y: 660, L: 360 };
function reachScene(ctx, t, T, o = {}) {
  // t7: a six-year-old sits among tablets that light up one by one (every answer in reach); the question slot above stays empty.
  // t8: the tablets fly together into one soft glow: the companion (always there); it waits up right (t9 lands it on the seesaw).
  const m = TT(T), g7 = (p) => T.G(p, 0, m.line[1]);
  const quiet = g7('quiet kind'), every = g7('Every answer'), noq = g7('no questions');
  const merge = sineIO(span(t, m.age12 - .3, m.age12 + 1.0)), land = sineIO(span(t, T.G('companion', 0, m.age12) - .1, T.G('companion', 0, m.age12) + .9));
  const kidA = 1 - span(t, m.age12 - .2, m.age12 + .6);
  const cx = 1300, fy = 790;
  ctx.fillStyle = K.lin(ctx, 0, fy, 0, H, [[0, '#18225a'], [1, P.night0]]); ctx.fillRect(-100, fy, W + 200, 400);
  // the child's own small light of a question: flickers out on 'quiet kind of failure'
  const spark = 1 - span(t, quiet + .1, quiet + .9), fl = .7 + .3 * Math.sin(t * 17) * span(t, quiet - .2, quiet + .6);
  if (kidA > 0) {
    ctx.save(); ctx.globalAlpha *= kidA;
    K.kid(ctx, cx, fy, 190, { age: 6, pose: 'sit', light: 1 });
    if (spark > 0) { halo(ctx, cx + 10, fy - 150, 60, .5 * spark * fl, GOLD.halo, GOLD.core); ctx.fillStyle = rgba(GOLD.hot, spark * fl); ctx.beginPath(); ctx.arc(cx + 10, fy - 150, 6, 0, TAU); ctx.fill(); }
    // the empty slot where a question would rise
    const sl = span(t, noq - .3, noq + .4);
    if (sl > 0) { ctx.save(); ctx.globalAlpha *= sl * (.55 + .25 * Math.sin(t * 2.3)); ctx.setLineDash([7, 7]); ctx.strokeStyle = CREAM; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx + 10, fy - 232, 36, 0, TAU); ctx.stroke(); ctx.restore(); }
    ctx.restore();
  }
  // the tablets: an arc in reach of the child; dark (as at age 6), lighting one by one on 'Every answer in reach'
  const N = 7, comp = [1650, 330];
  for (let i = 0; i < N; i++) {
    const an = lerp(-2.75, -.39, i / (N - 1)), r = 330, bx = cx + Math.cos(an) * r * 1.15, by = 650 + Math.sin(an) * r;
    const li = sineIO(span(t, every - .2 + i * .1, every + .3 + i * .1)), q = sineIO(span(merge, i * .05, .6 + i * .05));
    const x = lerp(bx, comp[0], q), y = lerp(by, comp[1], q) - Math.sin(Math.PI * q) * 60, s = lerp(1, .3, q), a = span(t, m.line[1] - 1, m.line[1] - .2) * (1 - span(q, .7, 1));
    if (a > 0) K.tablet(ctx, t, x, y + Math.sin(t * 1.1 + i) * 3, 100 * s, 72 * s, { lit: li, a, rot: (an + Math.PI / 2) * .15, content: (c, sx, sy, sw, sh) => { if (li <= 0) return; c.fillStyle = rgba('#ffffff', .75 * li); for (let k = 0; k < 3; k++) { c.beginPath(); c.roundRect(sx + 8, sy + 10 + k * 15, (sw - 16) * [.8, .6, .7][k], 5, 2); c.fill(); } } });
  }
  K.cap(ctx, 'EVERY ANSWER IN REACH', cx, 200, span(t, every - .1, every + .5) * (1 - span(t, m.age12 - .4, m.age12)), { size: 30, align: 'center', col: MACH.heartCore });
  K.cap(ctx, 'NO QUESTIONS', cx + 10, fy - 300, span(t, noq - .1, noq + .5) * kidA, { size: 26, align: 'center', col: CREAM });
  // the companion: one soft glow (no face), waits up right, then lands on the seesaw's right end (t9)
  const ca = span(merge, .55, 1);
  if (ca > 0) {
    const R = seesawEnds(t, T), ex = lerp(comp[0], R.r[0], land), ey = lerp(comp[1], R.r[1] - 44, land) - Math.sin(Math.PI * land) * 40;
    halo(ctx, ex, ey, 150, .45 * ca, MACH.heart, MACH.heartCore); halo(ctx, ex, ey, 60, .6 * ca, MACH.heart, '#ffffff');
    ctx.fillStyle = rgba(MACH.heartCore, ca); ctx.beginPath(); ctx.arc(ex, ey, 26 + 2 * Math.sin(t * 1.7), 0, TAU); ctx.fill();
    K.cap(ctx, 'A COMPANION', ex, ey - 64, span(t, T.G('companion', 0, m.age12) - .2, T.G('companion', 0, m.age12) + .4), { size: 22, align: 'center', col: MACH.heartCore });
    K.cap(ctx, 'ALWAYS THERE', ex, ey + 80, span(t, T.G('always there', 0, m.age12) - .1, T.G('always there', 0, m.age12) + .5), { size: 22, align: 'center', col: MACH.heartCore });
    K.cap(ctx, 'NEEDS NOTHING BACK', ex, ey + 112, span(t, T.G('never needs', 0, m.age12) - .1, T.G('never needs', 0, m.age12) + .5), { size: 22, align: 'center', col: MACH.heartCore });
  }
}
const THINGS = [['REAL FRIENDS', 'Real friends'], ['REAL ARGUMENTS', 'Real arguments'], ['A CHORE', 'A chore']];
function seesawState(t, T) {
  const m = TT(T), land = (i) => T.G(THINGS[i][1], 0, m.age12);
  let tilt = 0; for (let i = 0; i < 3; i++) { const k = span(t, land(i) + .25, land(i) + .55); tilt -= .055 * expoOut(k) + .012 * bump(t, land(i) + .3, .5); }
  const lev = sineIO(span(t, T.G('companion', 0, m.age12) + .55, T.G('companion', 0, m.age12) + 1.6));
  return { tilt: tilt * (1 - lev) + .004 * lev * Math.sin(t * 1.3), land, grow: sineIO(span(t, m.age12 + .1, m.age12 + 1.1)) };
}
function seesawEnds(t, T) { const s = seesawState(t, T), c = Math.cos(s.tilt), sn = Math.sin(s.tilt), y = lerp(780, SEE.y, s.grow); return { l: [SEE.x - c * SEE.L, y - sn * SEE.L], r: [SEE.x + c * SEE.L, y + sn * SEE.L] }; }
function token(ctx, kind, x, y, ang, a) {
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(ang);
  ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.roundRect(-62, -34, 128, 74, 10); ctx.fill();
  ctx.fillStyle = K.lin(ctx, 0, -36, 0, 36, [[0, '#2a3266'], [1, '#161c46']]); ctx.beginPath(); ctx.roundRect(-64, -38, 128, 74, 10); ctx.fill();
  ctx.strokeStyle = rgba(GOLD.line, .9); ctx.lineWidth = 2; ctx.stroke();
  halo(ctx, 0, 0, 70, .18, GOLD.halo, GOLD.core);
  if (kind === 0) { E.person(ctx, -18, 30, 58, { dir: 1, look: .3, light: 1, rim: GOLD.line }); E.person(ctx, 20, 30, 54, { dir: -1, look: .3, light: 1, rim: GOLD.line }); }
  else if (kind === 1) { const bub = (bx, by, d) => { ctx.fillStyle = CREAM; ctx.beginPath(); ctx.roundRect(bx - 22, by - 14, 44, 28, 10); ctx.fill(); ctx.beginPath(); ctx.moveTo(bx + d * 6, by + 12); ctx.lineTo(bx + d * 18, by + 24); ctx.lineTo(bx + d * 16, by + 10); ctx.closePath(); ctx.fill(); ctx.fillStyle = rgba(INK, .5); ctx.fillRect(bx - 12, by - 3, 24, 3); ctx.fillRect(bx - 12, by + 3, 16, 3); }; bub(-22, -6, -1); bub(22, 4, 1); }
  else { ctx.fillStyle = '#e8d29a'; ctx.beginPath(); ctx.roundRect(-24, -12, 40, 34, 5); ctx.fill(); ctx.beginPath(); ctx.moveTo(14, -4); ctx.lineTo(42, -20); ctx.lineTo(44, -14); ctx.lineTo(16, 6); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#e8d29a'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(-4, -12, 14, Math.PI, 0); ctx.stroke(); ctx.fillStyle = rgba(MACH.heart, .0); }
  ctx.restore();
}
function seesawScene(ctx, t, T) {
  const m = TT(T), s = seesawState(t, T); if (s.grow <= 0) return;
  const y = lerp(780, SEE.y, s.grow);
  K.seesaw(ctx, t, SEE.x, y, SEE.L * expoOut(s.grow), s.tilt, { a: clamp(s.grow * 3), left: (c, ex, ey, ang) => {
    for (let i = 0; i < 3; i++) {
      const tl = s.land(i), k = expoOut(span(t, tl - .15, tl + .4)); if (k <= 0) continue;
      const dx = Math.sin(ang) * (40 + i * 76), dy = -Math.cos(ang) * (40 + i * 76);
      const yy = ey + dy - (1 - k) * 240;
      token(c, i, ex + dx + 40 * Math.cos(ang), yy + 40 * Math.sin(ang), ang, clamp(k * 3));
      K.cap(c, THINGS[i][0], ex + dx - 92, yy + 48 * Math.sin(ang) + 8, span(t, tl - .05, tl + .5), { size: 22, align: 'right', col: GOLD.text });
    }
  } });
  K.cap(ctx, 'COUNTERWEIGHT', SEE.x, 330, span(t, T.G('counterweight', 0, m.age12) - .1, T.G('counterweight', 0, m.age12) + .6), { size: 38, align: 'center', col: GOLD.text, glow: true });
}

// ================================================================================================================ s6 / e1: the gate and the end picture
// the end picture (last 15 s = YouTube end screen): small, calm, top centre. Free and dark (lead 25.11., as #68): the video tile left
// (x 150–850), the "latest upload" tile right (x 1070–1770), y 380–780, and the subscribe circle — nothing is drawn below y ~372.
const END = { x0: 700, w: 104, y0: 330, rise: 34, cx: 960, base: 372 };
const endTop = (i) => [END.x0 + i * END.w, END.y0 - i * END.rise];
function endPicture(ctx, t, T) {
  const m = TT(T);
  K.bg(ctx, t, { gx: END.cx, gy: 250, ga: .12, gcol: '#3a3a6a', stars: 50, seed: 11 });
  ctx.save();
  const pu = sineIO(span(t, m.open0, T.duration)), z = lerp(1.04, 1.0, pu);
  ctx.translate(END.cx + E.drift(t, 2, 7), 260 + E.drift(t, 1.5, 9)); ctx.scale(z, z); ctx.translate(-END.cx, -260);
  // a low warm glow behind the steps only (the tile areas stay dark)
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = K.rad(ctx, END.cx, 300, 300, [[0, rgba('#ffd98a', .08)], [1, rgba('#ffd98a', 0)]]); ctx.beginPath(); ctx.arc(END.cx, 300, 300, 0, 6.29); ctx.fill(); ctx.restore();
  for (let i = 0; i < 5; i++) {
    const [x, y] = endTop(i), L = .5 + .1 * Math.sin(t * .7 + i);
    // the block fades out into the night before END.base (no hard bottom edge, nothing in the tile band)
    ctx.fillStyle = K.lin(ctx, 0, y, 0, END.base, [[0, '#1a2560'], [.55, rgba('#121a4a', .8)], [1, rgba('#0a0f30', 0)]]); ctx.fillRect(x, y, END.w + 1, END.base - y);
    ctx.fillStyle = rgba(mixHex('#3a4a8c', '#ffe2a0', L), .9); ctx.fillRect(x, y, END.w + 1, 3);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = K.lin(ctx, 0, y - 60, 0, y + 2, [[0, rgba('#ffd98a', 0)], [1, rgba('#ffd98a', .16 * L)]]); ctx.fillRect(x, y - 60, END.w, 62); ctx.restore();
    ctx.save(); ctx.globalAlpha *= .5; E.glowText(ctx, String(K.AGES[i][0]), x + END.w - 10, y + 26, { size: 22, serif: true, align: 'right', col: '#9aa2d8', glow: false }); ctx.restore();
  }
  // the grown-up on the top step turns round (back view → facing the first step), then looks down at the new baby
  const [tx, ty] = endTop(4), turn = span(t, m.turn, m.turn + .9), sq = Math.abs(Math.cos(Math.PI * turn)), look = lerp(.5, -.25, sineIO(span(t, m.baby, m.baby + 1.2)));
  ctx.save(); ctx.translate(tx + END.w * .55, ty); ctx.scale(lerp(.82, 1, sq), 1);
  if (turn < .5) K.kid(ctx, 0, 0, 84, { age: 30, view: 'back', look: .6, light: -1, back: .3 });
  else K.kid(ctx, 0, 0, 84, { age: 30, view: 'side', dir: -1, look, light: -1 });
  ctx.restore();
  // a new baby on the lowest step (born out of a small warm light)
  const [bx, by] = endTop(0), bu = span(t, m.baby, m.baby + 1.1);
  if (bu > 0) { halo(ctx, bx + END.w * .5, by - 20, 80, .5 * sineIO(bu) * (.9 + .1 * Math.sin(t * 1.3)), GOLD.halo, GOLD.core); ctx.save(); ctx.globalAlpha *= rise(bu); K.kid(ctx, bx + END.w * .5, by + (1 - rise(bu)) * 8, 40, { age: 0, light: 1 }); ctx.restore(); }
  ctx.restore();
  // AGE 30 · 2056 → AGE 0 · 2056, small, above the low steps (left of the grown-up)
  const ru = span(t, m.roll, m.roll + 1.2), size = 54;
  counter2(ctx, END.x0, 178, size, '30', '0 ', ru, '2056', '2056', 1, clamp(span(t, m.open0 + 1.4, m.open0 + 2.4) * 1));
}
function archPath(cx, base, w, h) { const p = new Path2D(); p.moveTo(cx - w / 2, base); p.lineTo(cx - w / 2, base - h + w / 2); p.arc(cx, base - h + w / 2, w / 2, Math.PI, 0); p.lineTo(cx + w / 2, base); p.closePath(); return p; }
function closeWorld(ctx, t, T) {
  const m = TT(T), a6 = m.s6 - .35;
  const op = sineIO(span(t, m.open0, m.open1));
  if (op >= 1) { endPicture(ctx, t, T); return; }
  const u = span(t, a6, m.open0), walk = lerp(.42, .93, sineIO(span(t, a6, m.matters + 2.4))), inside = sineIO(span(t, m.matters + .8, m.matters + 3.2));
  const z = lerp(1.0, 1.1, sineIO(u)) + .5 * sineIO(span(t, m.open0, m.open1)), fx = 1480, fy = 520;
  const W0 = K.gateWorld(ctx, t, { cam: { z, fx, fy }, walk, inside, windows: 1, gateU: 1, over(c, G) {
    // the paper plane leaves the child's hand and flies into the gate's light (the question goes where they go)
    const p0 = m.matters + 1.6, p1 = p0 + 1.7, k = span(t, p0, p1);
    if (k > 0 && k < 1) { const [hx, hy] = [G.pair.kx + 6, G.pair.ky - G.pair.h * .3], ox = G.gate.x + G.gate.w * .5, oy = G.gate.y + G.gate.h * .45, q = sineIO(k);
      K.paperPlane(c, lerp(hx, ox, q), lerp(hy, oy, q) - Math.sin(Math.PI * q) * 90, lerp(16, 5, q), lerp(-.7, -.1, q), { t, bank: .3, a: 1 - span(k, .75, 1) }); }
  } });
  // the core sentence, then the mission, then subscribe (left sky, over the city)
  const tx = 620, ex = span(t, m.making - .5, m.making - .1), ex2 = span(t, m.open0 - .3, m.open0 + .2);
  K.serif(ctx, 'What matters is', tx, 330, 66, span(t, m.matters - .1, m.matters + .5) * (1 - ex), { align: 'center', col: CREAM });
  K.big(ctx, 'who they grow up to be.', tx, 420, 80, span(t, T.G('who they grow', 0, m.close) - .1, T.G('who they grow', 0, m.close) + .55) * (1 - ex), { align: 'center' });
  K.cap(ctx, 'MAKING SURE SUPERINTELLIGENCE', tx, 300, span(t, m.making - .05, m.making + .55) * (1 - ex2), { size: 30, align: 'center', col: CREAM });
  K.cap(ctx, 'GOES WELL FOR EVERYBODY', tx, 346, span(t, T.G('goes well', 0, m.mission) - .05, T.G('goes well', 0, m.mission) + .55) * (1 - ex2), { size: 30, align: 'center', col: CREAM });
  K.big(ctx, 'For the children born into it.', tx, 452, 64, span(t, m.children - .5, m.children + .3) * (1 - ex2), { align: 'center' });
  const pa = span(t, m.want - .1, m.want + .5) * (1 - ex2), press = sineIO(span(t, m.sub - .05, m.sub + .35));
  if (pa > 0) {
    const pw = 300, ph = 66, py = 560; ctx.save(); ctx.globalAlpha *= clamp(pa * 2.5);
    const k = expoOut(pa), s = 1 - .05 * bump(t, m.sub - .05, .4);
    ctx.translate(tx, py); ctx.scale(s * lerp(.6, 1, k), s * lerp(.6, 1, k));
    if (press > 0) halo(ctx, 0, 0, 260, .35 * press, GOLD.halo, GOLD.core);
    ctx.fillStyle = rgba(GOLD.body, .9 * press); ctx.strokeStyle = rgba(mixHex(CREAM, GOLD.line, press), .9); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.roundRect(-pw / 2, -ph / 2, pw, ph, ph / 2); ctx.fill(); ctx.stroke(); ctx.restore();
    K.cap(ctx, 'SUBSCRIBE', tx, py + 10, pa, { size: 26, align: 'center', col: mixHex(CREAM, INK, press) });
  }
  // e1: the gate's arch opens as a mask onto the end picture (the light thins out into the five steps)
  if (op > 0) {
    const G = W0.gate, sc = (x, y) => [(x - fx) * z + fx, (y - fy) * z + fy];
    const [gx, gb] = sc(G.x + G.w / 2, G.y + G.h), gw = G.w * z, gh = G.h * z;
    const cx = lerp(gx, 960, op), base = lerp(gb, H + 1400, op), w = lerp(gw, W * 2.6, op), h = lerp(gh, H + 2600, op);
    const arch = archPath(cx, base, w, h);
    // no jump at the start: at op 0 the arch IS the gate, so the end picture and the light veil both fade in from 0 while it grows
    ctx.save(); ctx.clip(arch); ctx.save(); ctx.globalAlpha *= sineIO(span(op, .03, .4)); endPicture(ctx, t, T); ctx.restore();
    ctx.fillStyle = rgba('#ffe6a2', .85 * sineIO(span(op, 0, .22)) * (1 - sineIO(span(op, .24, .7)))); ctx.fillRect(0, 0, W, H); ctx.restore();   // lead 25.11.: softer swell (smooth.py LURCH 19)
    ctx.save(); const ga = .5 * Math.sin(Math.PI * clamp(op / .3)); if (ga > .005) E.glowFill(ctx, arch, 50, ga, '#f2c46a'); ctx.restore();   // the gate's rim glow, gone before the arch fills the frame
  }
}

// ================================================================================================================ the shots
export default {
  // ---------------------------------------------------------------- a30a the age clock: AGE 30 · 2056, the grown-up on the top step
  a30a(ctx, t, S, T) {
    const { G, IN } = K.phr(T, S, t);
    const th = G('Thirty'), yr = G('Twenty fifty-six'), gu = G('grown-up'), mv = sineIO(span(t, G('Your child') - .35, G('Your child') + .55));
    K.bg(ctx, t, { gx: 1500, gy: 420, ga: .2, gcol: '#5a4a2a', stars: 60 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.04, fx: 1450, fy: 520 });
    const ghost = .22;
    K.ageClock(ctx, t, { u: 1, city: .8, lit: [.2, .2, .2, .3, sineIO(span(t, yr - .2, yr + .7))],
      figs: [{ i: 0, age: 0, a: ghost }, { i: 1, age: 6, a: ghost }, { i: 2, age: 12, a: ghost }, { i: 3, age: 18, a: ghost + .2 * (1 - span(t, gu - .5, gu + .3)) },
        { i: 4, age: 30, x: .14, a: span(t, gu - .45, gu + .35), look: .45 }] });
    K.cap(ctx, 'A GROWN-UP', stepX(4, .14), K.stepTop(4)[1] - 236, span(t, gu - .1, gu + .5), { size: 24, align: 'center', col: GOLD.text });
    ctx.restore();
    // the counter is born at the landing point, rolls 18 → 30 and 2044 → 2056 on the words, then settles top left
    const size = lerp(150, 92, mv), cw = counterW(size, 2), cx = lerp(960 - cw / 2, 120, mv), cy = lerp(480, 170, mv);
    counter2(ctx, cx, cy, size, '18', '30', span(t, th - .1, th + .7), '2044', '2056', span(t, yr - .1, yr + .8), clamp(IN(.5) * 1.4));
    K.tag(ctx, 'SCENARIO · 2056', 330, 250, span(t, G('Your child') + .55, G('Your child') + 1.1), { size: 22, col: GOLD.text });
  },
  // ---------------------------------------------------------------- a30b an ordinary Tuesday on their street; machines carry the work
  a30b(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    ctx.fillStyle = K.lin(ctx, 0, 0, 0, H, [[0, '#141f5a'], [.3, '#34428a'], [.48, '#8a6f9a'], [.62, '#e2a46c'], [.75, '#7a5a7a'], [1, '#2a2a52']]); ctx.fillRect(0, 0, W, H);
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.05, fx: 1100, fy: 620 });
    E.stars(ctx, 31, 30, t, [0, 0, W, 300], .35);
    // the morning sun (born where the plane landed)
    const su = expoOut(IN(1.0)), sy = 300 - 26 * sineIO(span(t, S.a, S.b + 2));
    halo(ctx, 1500, sy, 520 * su, .32, GOLD.halo, GOLD.core);
    ctx.fillStyle = K.rad(ctx, 1490, sy - 10, 70 * su + 1, [[0, '#fffaf0'], [.6, GOLD.hot], [1, GOLD.body]]); ctx.beginPath(); ctx.arc(1500, sy, 58 * su, 0, TAU); ctx.fill();
    // the machines: small cyan lights on a far lane, carrying crates (background only)
    const mu = span(t, G('The machines carry') - .4, G('The machines carry') + .6);
    if (mu > 0) for (let i = 0; i < 7; i++) {
      const x = ((i * 320 - (t - S.a) * 70) % 2240 + 2240) % 2240 - 160, y = 430 + Math.sin(t * 1.4 + i) * 4, a = mu * clamp((i + 1) * .3);
      ctx.save(); ctx.globalAlpha *= a; halo(ctx, x, y, 34, .55, MACH.heart, MACH.heartCore); ctx.fillStyle = MACH.heartCore; ctx.beginPath(); ctx.arc(x, y, 5, 0, TAU); ctx.fill();
      ctx.fillStyle = rgba(MACH.heartCore, .5); ctx.fillRect(x - .75, y + 5, 1.5, 12); ctx.fillStyle = '#2c3670'; ctx.fillRect(x - 15, y + 17, 30, 22); ctx.fillStyle = rgba(CREAM, .5); ctx.fillRect(x - 15, y + 17, 30, 2); ctx.restore();
    }
    // the houses of their street
    const r = K.prng(7630);
    for (let x = -80; x < W + 120;) {
      const w = 160 + r() * 120, h = 210 + r() * 190, top = 760 - h, gable = r() < .45, q = r();
      ctx.fillStyle = mixHex('#1a2462', '#2e3a80', q * .7); ctx.fillRect(x, top, w - 6, h + 2);
      if (gable) { ctx.beginPath(); ctx.moveTo(x - 6, top); ctx.lineTo(x + w / 2 - 3, top - 70); ctx.lineTo(x + w, top); ctx.closePath(); ctx.fill(); }
      ctx.fillStyle = rgba('#000010', .18); ctx.fillRect(x + w * .72, top, w * .28 - 6, h);
      for (let fy = top + 26; fy < 700; fy += 64) for (let fx = x + 22; fx < x + w - 40; fx += 48) { const lit = r() < .3; ctx.fillStyle = lit ? rgba(K.WIN.lit, .55 + .1 * Math.sin(t * .5 + fx)) : rgba('#0b1240', .8); ctx.fillRect(fx, fy, 22, 30); }
      ctx.fillStyle = '#0d1236'; ctx.fillRect(x + w * .4, 690, 30, 70);
      x += w;
    }
    // the sidewalk and the street
    ctx.fillStyle = K.lin(ctx, 0, 760, 0, 830, [[0, '#4a5288'], [1, '#2a3266']]); ctx.fillRect(-100, 760, W + 200, 70);
    ctx.fillStyle = K.lin(ctx, 0, 830, 0, H, [[0, '#1a1f4a'], [1, P.night0]]); ctx.fillRect(-100, 830, W + 200, 400);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = K.rad(ctx, 1500, 760, 900, [[0, rgba('#ffd98a', .16)], [1, rgba('#ffd98a', 0)]]); ctx.beginPath(); ctx.arc(1500, 760, 900, 0, 6.29); ctx.fill(); ctx.restore();
    // people in the middle of it (indigo), and your grown-up child (the yellow coat)
    const dt = t - S.a;
    [[300, 1, 172, 0], [610, -1, 160, 1], [1260, 1, 168, 2], [1420, -1, 150, 3], [1700, -1, 176, 4]].forEach(([x0, d, h, i]) => {
      E.person(ctx, x0 + d * dt * 42, 812, h, { view: 'side', dir: d, walk: dt * 4.2 + i, light: .7, long: i % 2 === 0 });
    });
    E.du(ctx, lerp(880, 1000, span(t, S.a, S.b + 1)), 812, 190, { view: 'side', dir: 1, walk: dt * 4.0, light: 1, look: .3 });
    ctx.restore();
    K.cap(ctx, 'TUESDAY · 2056 · SCENARIO', 120, 150, U('Tuesday', .7, -.15), { size: 26, col: GOLD.text });
    K.cap(ctx, 'MACHINES CARRY MOST OF THE WORK', 120, 196, U('The machines carry', .7, 0), { size: 22, col: MACH.heartCore });
  },
  // ---------------------------------------------------------------- a30c the day has room: WORK shrinks, ROOM opens; two blocks drop in
  a30c(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 1100, gy: 600, ga: .22, gcol: '#4a4a6a', stars: 50 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.02, z1: 1.0, fx: 960, fy: 560 });
    const ax = 640, x0 = 360, x1 = 1560, au = expoOut(IN(.9)), room = sineIO(span(t, G('room') - .25, G('room') + 1.3));
    ctx.fillStyle = rgba(CREAM, .5); ctx.fillRect(lerp(960, x0, au), ax, lerp(0, x1 - x0, au), 2);
    K.cap(ctx, 'MORNING', x0, ax + 44, IN(.8, .4), { size: 22, col: MUTED });
    K.cap(ctx, 'NIGHT', x1, ax + 44, IN(.8, .5), { size: 22, align: 'right', col: MUTED });
    halo(ctx, x0 - 34, ax - 6, 40, .5 * IN(.8, .4), GOLD.halo, GOLD.core); ctx.fillStyle = rgba(GOLD.hot, IN(.8, .4)); ctx.beginPath(); ctx.arc(x0 - 34, ax - 6, 9, 0, TAU); ctx.fill();
    ctx.fillStyle = rgba(CREAM, .8 * IN(.8, .5)); ctx.beginPath(); ctx.arc(x1 + 34, ax - 6, 10, 0, TAU); ctx.fill(); ctx.fillStyle = K.P.night1; ctx.beginPath(); ctx.arc(x1 + 39, ax - 10, 9, 0, TAU); ctx.fill();
    K.cap(ctx, 'A TUESDAY · 2056', 960, 200, IN(.8, .2), { size: 26, align: 'center', col: MUTED });
    const grow = expoOut(span(t, S.a + .35, S.a + 1.1)), we = dayStrip(ctx, t, x0, x1, ax, 120, room, { grow });
    K.cap(ctx, 'WORK', (x0 + we) / 2, ax - 48, grow * clamp(1.4 - room * .4), { size: 26, align: 'center', col: CREAM });
    // the machines lift slabs of work off and carry them away (cyan lights)
    for (let i = 0; i < 3; i++) {
      const t0 = G('room') - .15 + i * .28, k = sineIO(span(t, t0, t0 + 1.4)); if (k <= 0 || k >= 1) continue;
      const sx = lerp(x0 + 1200 * .84 - 60 - i * 210, 1400 + i * 140, k), sy = lerp(ax - 60, -80, k) - Math.sin(Math.PI * k) * 40;
      ctx.fillStyle = K.lin(ctx, 0, sy - 30, 0, sy + 30, [[0, '#5a6aa8'], [1, '#2c3a78']]); ctx.beginPath(); ctx.roundRect(sx - 50, sy - 30, 100, 60, 5); ctx.fill();
      halo(ctx, sx, sy - 52, 40, .6, MACH.heart, MACH.heartCore); ctx.fillStyle = MACH.heartCore; ctx.beginPath(); ctx.arc(sx, sy - 52, 6, 0, TAU); ctx.fill();
    }
    K.cap(ctx, 'ROOM', x1, ax - 168, span(t, G('room') + .1, G('room') + .7), { size: 30, align: 'right', col: GOLD.text, glow: true });
    // two blocks drop into the room on their words
    [[G('For their kids'), 760, 1080, 'FOR THEIR KIDS', 0], [G('For something'), 1140, 1500, 'FOR SOMETHING TO BUILD', 1]].forEach(([t0, bx0, bx1, lab, kind]) => {
      const k = expoOut(span(t, t0 - .1, t0 + .55)); if (k <= 0) return;
      const by = lerp(ax - 360, ax - 112, k) + 10 * bump(t, t0 + .4, .4), cx = (bx0 + bx1) / 2;
      ctx.save(); ctx.globalAlpha *= clamp(k * 3);
      halo(ctx, cx, by + 50, 200, .25, GOLD.halo, GOLD.core);
      ctx.fillStyle = K.lin(ctx, 0, by, 0, by + 108, [[0, '#2a3266'], [1, '#161c46']]); ctx.beginPath(); ctx.roundRect(bx0, by, bx1 - bx0, 108, 10); ctx.fill();
      ctx.strokeStyle = rgba(GOLD.line, .9); ctx.lineWidth = 2; ctx.stroke();
      if (kind === 0) familyIcon(ctx, cx, by + 96, 82); else frameIcon(ctx, cx, by + 94, 100, span(t, t0, t0 + 1.4));
      ctx.restore();
      K.cap(ctx, lab, cx, by - 22, span(t, t0, t0 + .5), { size: 24, align: 'center', col: GOLD.text });
    });
    ctx.restore();
  },
  // ---------------------------------------------------------------- a30d not guaranteed: works for whom? under what rules? (blank)
  a30d(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 1100, gy: 480, ga: .22, stars: 50 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.04, fx: 1100, fy: 480 });
    // the Tuesday as a card (born at the landing point)
    const cu = IN(.9), ng = span(t, G("isn't guaranteed") - .1, G("isn't guaranteed") + .6), cx = 560, cy = 440, cw = 420, ch = 250;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(.035 * sineIO(ng) - .01);
    K.paperCard(ctx, t, -cw / 2, -ch / 2, cw, ch, { u: cu, head: 'TUESDAY · 2056' });
    if (cu > .5) { const k = span(cu, .5, 1); ctx.save(); ctx.globalAlpha *= k; dayStrip(ctx, t, -cw / 2 + 34, cw / 2 - 34, 60, 64, 1, {}); ctx.fillStyle = rgba(GOLD.body, .85 - .35 * sineIO(ng) + .1 * Math.sin(t * 5) * ng); ctx.beginPath(); ctx.roundRect(-40, 4, 70, 50, 6); ctx.roundRect(46, 4, 90, 50, 6); ctx.fill(); ctx.restore(); }
    ctx.restore();
    K.tag(ctx, 'NOT GUARANTEED', cx, 640, ng, { size: 26, col: CREAM, dash: true });
    // a line from the card to the machine; the chip grows at its end
    const wu = G('Who the machines'), lu = span(t, wu - .3, wu + .4), chU = expoOut(span(t, wu, wu + .7));
    if (lu > 0) K.lightLine(ctx, [[cx + cw / 2 + 10, cy], [1110, cy]], 0, expoOut(lu), CREAMC, { w: 1.5, a: .6 });
    if (chU > 0) K.chip(ctx, t, 1180, cy, 58 * chU + 1, { lit: 1, think: .45, pins: chU, rays: .3 });
    const field = (y, s, t0) => { const k = span(t, t0 - .1, t0 + .5); if (k <= 0) return;
      K.lightLine(ctx, [[1250, cy], [1290, y]], 0, expoOut(k), CREAMC, { w: 1.2, a: .5 });
      ctx.save(); ctx.globalAlpha *= clamp(k * 3); ctx.setLineDash([9, 7]); ctx.strokeStyle = rgba(CREAM, .75); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(1300, y - 40, 480 * expoOut(k), 80, 12); ctx.stroke(); ctx.restore();
      K.cap(ctx, s, 1330, y + 11, span(t, t0, t0 + .6), { size: 28, col: CREAM }); };
    field(330, 'WORKS FOR WHOM?', G('work for'));
    field(550, 'UNDER WHAT RULES?', G('what rules'));
    // the chip's own label stays empty: a dashed plate with a blinking cursor
    const nw = G('not written'), pu = span(t, nw - .2, nw + .4);
    if (pu > 0) { ctx.save(); ctx.globalAlpha *= clamp(pu * 3); ctx.setLineDash([8, 7]); ctx.strokeStyle = rgba(CREAM, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(1080, cy + 110, 200 * expoOut(pu), 52, 8); ctx.stroke();
      ctx.fillStyle = rgba(CREAM, .8 * (Math.sin(t * 6) > 0 ? 1 : .15)); ctx.fillRect(1100, cy + 122, 3, 28); ctx.restore(); }
    K.cap(ctx, 'NOT WRITTEN INTO THE TECHNOLOGY', 1180, cy + 230, span(t, G('written into') - .1, G('written into') + .5), { size: 28, align: 'center', col: GOLD.text, glow: true });
    ctx.restore();
  },
  // ---------------------------------------------------------------- a30e Daron Acemoglu: name card, Nobel medal, CRITIC
  a30e(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 520, ga: .24, stars: 40 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.03, fx: 960, fy: 540 });
    const k = sineIO(IN(1.0)), cx = lerp(S.in[0], 960, k), cy = lerp(S.in[1], 520, k), sc = lerp(.25, 1, expoOut(IN(.9))), w = 860, h = 290;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc);
    ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(-w / 2 + 10, -h / 2 + 14, w, h, 10); ctx.fill();
    ctx.fillStyle = K.lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, PAPER76.lit], [1, PAPER76.body]]); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 10); ctx.fill();
    // portrait: a silhouette in a round frame (no face, no photo)
    const px = -w / 2 + 150, r = 98;
    ctx.save(); ctx.beginPath(); ctx.arc(px, 0, r, 0, TAU); ctx.clip(); ctx.fillStyle = K.lin(ctx, 0, -r, 0, r, [[0, '#3a4a8c'], [1, '#1a2460']]); ctx.fillRect(px - r, -r, r * 2, r * 2);
    E.person(ctx, px, r * 2.55, 330, { look: .1, light: .8 }); ctx.restore();
    ctx.strokeStyle = rgba(PAPER76.shade, 1); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(px, 0, r, 0, TAU); ctx.stroke();
    const nu = span(t, G('Daron') - .2, G('Daron') + .5);
    K.serif(ctx, 'Daron Acemoglu', -w / 2 + 290, -18, 70, nu, { col: INK, glow: false });
    K.cap(ctx, 'MIT · NOBEL PRIZE IN ECONOMICS 2024', -w / 2 + 294, 40, span(t, G('Nobel Prize') - .2, G('Nobel Prize') + .5), { size: 24, col: FAINT });
    // the medal lands on the card's corner on 'Nobel Prize'
    const mu = expoOut(span(t, G('Nobel Prize') - .1, G('Nobel Prize') + .5));
    if (mu > 0) { const mx = w / 2 - 78, my = -h / 2 + 76 - (1 - mu) * 120; ctx.save(); ctx.globalAlpha *= clamp(mu * 3);
      // the ribbon: one indigo band hanging from above the card, folded into a V behind the medal
      ctx.fillStyle = K.lin(ctx, mx - 30, 0, mx + 30, 0, [[0, '#2a3a86'], [.5, '#3e52a8'], [1, '#22306e']]);
      ctx.beginPath(); ctx.moveTo(mx - 34, my - 150); ctx.lineTo(mx + 34, my - 150); ctx.lineTo(mx + 30, my - 30); ctx.lineTo(mx, my - 6); ctx.lineTo(mx - 30, my - 30); ctx.closePath(); ctx.fill();
      ctx.fillStyle = rgba(CREAM, .35); ctx.fillRect(mx - 3, my - 150, 6, 126);
      halo(ctx, mx, my, 110, .35, GOLD.halo, GOLD.core);
      ctx.fillStyle = K.rad(ctx, mx - 12, my - 14, 60, [[0, GOLD.core], [.5, GOLD.body], [1, GOLD.shade]]); ctx.beginPath(); ctx.arc(mx, my, 44, 0, TAU); ctx.fill();
      ctx.strokeStyle = rgba(GOLD.deep, .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(mx, my, 34, 0, TAU); ctx.stroke(); ctx.restore(); }
    ctx.restore();
    const cr = G('sharpest critics');
    K.cap(ctx, 'CRITIC', 960, 736, span(t, cr - .1, cr + .5), { size: 32, align: 'center', col: GOLD.text, glow: true });
    K.cap(ctx, 'HOW THESE MACHINES ARE BUILT TODAY', 960, 786, span(t, G('how these machines') - .1, G('how these machines') + .5), { size: 26, align: 'center', col: CREAM });
    ctx.restore();
  },
  C4: K.clipShot('C4'),   // ORIGINAL FOOTAGE plate grows out of S.in and back (lower third from K.CLIPS)
  // ---------------------------------------------------------------- a30f ★ DECIDED NOW: a lab, a parliament, a ballot box … BY US
  a30f(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    const us = G('By us'), usU = span(t, us - .15, us + 1.2);
    K.bg(ctx, t, { gx: 960, gy: 560, ga: .2 + .14 * usU, gcol: mixHex(P.blue0, '#6a5a2a', usU), stars: 60 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.07, z1: 1.0, fx: 960, fy: 560 });
    const gy = 560, gu = expoOut(IN(1.0));
    ctx.fillStyle = K.lin(ctx, 0, gy, 0, H, [[0, '#18225a'], [1, P.night0]]); ctx.fillRect(-100, gy, W + 200, 600);
    ctx.fillStyle = rgba(CREAM, .45); ctx.fillRect(lerp(960, 200, gu), gy - 1, lerp(0, 1520, gu), 2);
    const place = (x, t0, label, draw) => { const k = expoOut(span(t, t0 - .2, t0 + .6)); if (k <= 0) return; const lit = span(t, t0, t0 + .5) * (.8 + .2 * usU);
      ctx.save(); ctx.beginPath(); ctx.rect(x - 260, 0, 520, gy); ctx.clip(); ctx.translate(x, gy + (1 - k) * 260); draw(lit); ctx.restore();
      K.cap(ctx, label, x, gy + 52, span(t, t0, t0 + .5), { size: 24, align: 'center', col: CREAM }); };
    place(480, G('labs'), 'A LAB', (lit) => {
      ctx.fillStyle = K.lin(ctx, 0, -190, 0, 0, [[0, '#2e3a7a'], [1, '#1a2258']]); ctx.fillRect(-150, -180, 300, 180); ctx.fillRect(-60, -230, 120, 52);
      for (let i = 0; i < 6; i++) { ctx.fillStyle = mixHex('#0b1240', MACH.heart, lit * .85); ctx.fillRect(-128 + i * 44, -140, 30, 46); }
      ctx.fillStyle = mixHex('#0b1240', MACH.heartCore, lit * .6); ctx.fillRect(-128, -70, 256, 14);
      if (lit > 0) halo(ctx, 0, -110, 220, .2 * lit, MACH.heart, MACH.heartCore);
      K.chip(ctx, t, 0, -204, 14, { lit, pins: 1 });
    });
    place(960, G('governments'), 'A PARLIAMENT', (lit) => {
      const c = mixHex('#2e3a7a', '#e8c27a', lit * .55);
      ctx.fillStyle = c; ctx.fillRect(-190, -30, 380, 30); ctx.fillRect(-170, -150, 340, 22);
      ctx.beginPath(); ctx.moveTo(-180, -150); ctx.lineTo(0, -205); ctx.lineTo(180, -150); ctx.closePath(); ctx.fill();
      for (let i = 0; i < 7; i++) ctx.fillRect(-160 + i * 52, -128, 22, 98);
      ctx.fillStyle = mixHex('#0b1240', GOLD.hot, lit * .7); for (let i = 0; i < 6; i++) ctx.fillRect(-134 + i * 52, -124, 26, 90);
      ctx.fillStyle = c; ctx.fillRect(-70, -260, 140, 56); ctx.beginPath(); ctx.arc(0, -260, 70, Math.PI, 0); ctx.fill(); ctx.fillRect(-4, -360, 8, 34);
      if (lit > 0) halo(ctx, 0, -150, 260, .22 * lit, GOLD.halo, GOLD.core);
    });
    place(1440, G('ballot box'), 'A BALLOT BOX', (lit) => {
      ctx.fillStyle = K.lin(ctx, 0, -170, 0, 0, [[0, mixHex('#3a4a8c', '#e8c27a', lit * .5)], [1, '#1a2258']]); ctx.beginPath(); ctx.roundRect(-115, -160, 230, 160, 6); ctx.fill();
      ctx.fillStyle = mixHex('#2a3266', '#f6d690', lit * .7); ctx.beginPath(); ctx.roundRect(-125, -176, 250, 22, 4); ctx.fill();
      ctx.fillStyle = P.night0; ctx.fillRect(-50, -170, 100, 8);
      const bu = sineIO(span(t, G('ballot box') + .1, G('ballot box') + .8));
      ctx.save(); ctx.beginPath(); ctx.rect(-200, -400, 400, 232); ctx.clip(); ctx.fillStyle = PAPER76.lit; ctx.fillRect(-36, lerp(-300, -170, bu), 72, 96); ctx.fillStyle = rgba(INK, .5); ctx.fillRect(-20, lerp(-280, -150, bu), 40, 4); ctx.restore();
      if (lit > 0) halo(ctx, 0, -90, 200, .18 * lit, GOLD.halo, GOLD.core);
    });
    // BY US: many small people rise in front, each raises a hand with a small light; lines of light run from them up to the three places
    if (usU > 0) {
      const rows = [[800, 74, 21, 0], [870, 84, 19, 1]];
      for (const [fy, h, n, ri] of rows) for (let i = 0; i < n; i++) {
        const x = 960 + (i - (n - 1) / 2) * 74 + ri * 18, d = Math.abs(i - (n - 1) / 2) / n, e = rise(span(usU, d * .5, d * .5 + .4)); if (e <= 0) continue;
        const hand = sineIO(span(usU, d * .5 + .25, d * .5 + .6)), you = ri === 1 && i === Math.floor(n / 2);
        ctx.save(); ctx.globalAlpha *= e;
        if (you) E.du(ctx, x, fy + (1 - e) * 30, h * 1.06, { look: .6, light: 1, armR: [lerp(.2, 2.9, hand), lerp(.1, 3.0, hand)] });
        else E.person(ctx, x, fy + (1 - e) * 30, h, { look: .6, light: .8, dir: i % 2 ? 1 : -1, rim: mixHex(P.blue0, GOLD.line, hand * .6), armR: [lerp(.2, 2.9, hand), lerp(.1, 3.0, hand)] });
        ctx.restore();
        if (hand > .5) { const hx = x + (i % 2 ? 1 : -1) * h * .11, hy = fy - h * 1.07; halo(ctx, hx, hy, 22, .6 * hand, GOLD.halo, GOLD.core); }
      }
      [[480, 670], [960, 670], [1440, 670]].forEach(([x], i) => { const k = span(usU, .35 + i * .08, .8 + i * .08); if (k > 0) K.lightLine(ctx, [[x + (i - 1) * 40, 720], [x, gy + 10]], 0, expoOut(k), GOLD, { w: 3, head: true, a: .9 }); });
    }
    ctx.restore();
    const dn = G('decided now');
    K.cap(ctx, 'THAT TUESDAY IS', 960, 112, span(t, S.a + .2, S.a + .9) * (1 - span(t, us - .5, us - .1)), { size: 24, align: 'center', col: MUTED });
    K.big(ctx, 'Decided now.', 960, 210, 92, span(t, dn - .15, dn + .45) * (1 - span(t, us - .45, us - .05)), {});
    K.big(ctx, 'By us.', 960, 210, 120, span(t, us - .1, us + .5), {});
  },
  // ---------------------------------------------------------------- a30g what is your child for? (an open outline: STAYS OPEN)
  a30g(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 300, ga: .2, stars: 150, seed: 5 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.04, fx: 1250, fy: 760 });
    ctx.save(); ctx.translate(-330, 300);
    // far machine lights pass low behind the steps on 'a world that doesn't need their labor'
    const wl = span(t, G('a world') - .3, G('a world') + .6);
    if (wl > 0) for (let i = 0; i < 6; i++) { const x = ((i * 380 + (t - S.a) * 60) % 2400) + 100, y = 620 + Math.sin(i * 2.1) * 30; halo(ctx, x, y, 26, .45 * wl, MACH.heart, MACH.heartCore); ctx.fillStyle = rgba(MACH.heartCore, wl); ctx.beginPath(); ctx.arc(x, y, 4, 0, TAU); ctx.fill(); }
    K.ageClock(ctx, t, { u: 1, city: 0, lit: [.15, .15, .15, .25, 1], figs: [{ i: 4, age: 30, x: .5, view: 'back', look: lerp(.4, 1, sineIO(span(t, G('your child') - .2, G('your child') + 1))) }] });
    ctx.restore(); ctx.restore();
    const q = 'What is your child for?', size = 96, wu = sineIO(span(t, G('And what is') - .1, G('for,') + .3)), op = span(t, G('stays open') - .1, G('stays open') + .6);
    const R = outlineText(ctx, q, 960, 330, size, wu, { align: 'center', a: .85 + .15 * Math.sin(t * 1.6) });
    K.tag(ctx, 'STAYS OPEN', 960, 450, op, { size: 26, col: CREAM, dash: true });
  },
  // ---------------------------------------------------------------- a30h back at today's kitchen table: NOT IN A LAB · AT YOUR KITCHEN TABLE
  a30h(ctx, t, S, T) {
    const { G, U } = K.phr(T, S, t);
    const u = sineIO(span(t, S.a, S.b)), cam = { z: lerp(1.0, 1.07, u), fx: 1100, fy: 560 };
    const lab = 1 - span(t, G('in a lab') - .1, G('in a lab') + .5), kt = sineIO(span(t, G('kitchen table') - .3, G('kitchen table') + .9));
    K.kitchen(ctx, t, { cam, childAge: 6, lamp: .72 + .28 * kt, look: sineIO(span(t, G('being raised') - .2, G('being raised') + 1.0)),
      items(c) {   // in the window: a lab far away in the night city, its cyan window band goes dark on 'not in a lab'
        c.save(); c.beginPath(); c.rect(1262, 182, 446, 356); c.clip();
        c.fillStyle = '#1a2156'; c.fillRect(1520, 400, 170, 140); c.fillRect(1570, 370, 70, 32);
        c.fillStyle = mixHex('#0b1240', MACH.heart, .85 * lab); c.fillRect(1534, 430, 142, 16);
        if (lab > 0) halo(c, 1605, 438, 90, .25 * lab, MACH.heart, MACH.heartCore);
        c.restore();
      } });
    K.cap(ctx, 'NOT IN A LAB', 120, 170, span(t, G("isn't decided") - .1, G("isn't decided") + .5), { size: 30, col: CREAM });
    K.cap(ctx, 'AT YOUR KITCHEN TABLE', 120, 226, span(t, G('at your kitchen') - .1, G('at your kitchen') + .5), { size: 36, col: GOLD.text, glow: true });
  },
  // ---------------------------------------------------------------- t0 starting tonight: the plane opens into a sheet on the table
  t0(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    // the table top seen from above, the lamp's pool on it
    ctx.fillStyle = K.lin(ctx, 0, 0, 0, H, [[0, '#2c2342'], [1, '#18122c']]); ctx.fillRect(0, 0, W, H);
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.03, fx: 960, fy: 480 });
    const r = K.prng(7640); ctx.fillStyle = rgba(P.night0, .16); for (let i = 0; i < 26; i++) { const y = r() * H; ctx.fillRect(-100, y, W + 200, 1 + r() * 2); }
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = K.rad(ctx, 960, 470, 820, [[0, rgba('#ffd98a', .3)], [.6, rgba('#ffd98a', .08)], [1, rgba('#ffd98a', 0)]]); ctx.fillRect(0, 0, W, H); ctx.restore();
    // the child's notebook and a cup at the edges of the pool
    ctx.save(); ctx.translate(1560, 190); ctx.rotate(.12); ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(-120, -78, 250, 170); ctx.fillStyle = PAPER76.body; ctx.fillRect(-126, -86, 250, 170); ctx.fillStyle = rgba(PAPER76.fold, .7); ctx.fillRect(-2, -86, 4, 170); ctx.restore();
    ctx.fillStyle = rgba(P.night0, .35); ctx.beginPath(); ctx.arc(330, 790, 74, 0, TAU); ctx.fill(); ctx.fillStyle = '#c9b98a'; ctx.beginPath(); ctx.arc(322, 780, 70, 0, TAU); ctx.fill(); ctx.fillStyle = '#3a2a2a'; ctx.beginPath(); ctx.arc(322, 780, 54, 0, TAU); ctx.fill();
    // the sheet: the paper plane's paper, opened, slides into place under your hands
    const k = sineIO(span(t, S.a + .1, S.a + 1.1)), X = lerp(S.in[0] - 40, 620, k), Y = lerp(S.in[1] - 40, 150, k), Wd = lerp(80, 680, k), Ht = lerp(80, 660, k);
    const lines = [0, 1, 2, 3].map((i) => ({ s: '', num: span(t, G('do there') - .2 + i * .12, G('do there') + .3 + i * .12) }));
    sheet(ctx, t, X, Y, Wd, Ht, { fs: 36, u: 1, title: span(t, G('starting tonight') - .1, G('starting tonight') + .5) * clamp(k * 1.5 - .5), lines: k > .9 ? lines : [] });
    // your hands at the sheet's lower corners (yellow cuffs)
    const hu = sineIO(span(t, S.a + .6, S.a + 1.5));
    for (const [hx, d] of [[700, -1], [1220, 1]]) {
      // the hand: the warm light hand (Film 13 family), palm down, fingers resting on the sheet's lower edge; then the yellow sleeve over the wrist
      const ox = hx + d * 30 * (1 - hu), oy = 140 * (1 - hu);
      E.lightHand(ctx, E.handMatrix(ox - d * 6, 985 + oy, -Math.PI / 2 - d * .3, 118, d), t, { pose: 'open', curl: .45, spread: .35, a: .92 * hu, dust: 0 });
      ctx.save(); ctx.translate(ox, 900 + oy); ctx.rotate(d * .18);
      ctx.fillStyle = K.lin(ctx, -60, 0, 60, 0, [[0, E.COAT.shade], [1, E.COAT.lit]]); ctx.beginPath(); ctx.roundRect(-64, 70, 128, 220, 30); ctx.fill(); ctx.restore(); }
    ctx.restore();
    // the lamp's pool narrows while the plane takes off: t1's night is reached without a bright-to-dark jump
    const dk = sineIO(span(t, S.b - 1.3, S.b + .2)); if (dk > 0) { ctx.fillStyle = rgba('#0b1238', .62 * dk); ctx.fillRect(0, 0, W, H); }
  },
  // ---------------------------------------------------------------- t1 the six-year-old: use it together, ask where it could be wrong
  t1(ctx, t, S, T) {
    const C = tableCam(t, T);
    K.bg(ctx, t, { gx: 1290, gy: 520, ga: .24, stars: 40 });
    ctx.save(); K.shotCam(ctx, t, C, { z0: 1.0, z1: 1.04, fx: 1290, fy: 560 }); tableScene(ctx, t, T); ctx.restore();
    tipPanel(ctx, t, T);
  },
  // ---------------------------------------------------------------- t2 teach both, test both (match: the tablet becomes the calculator)
  t2(ctx, t, S, T) {
    const C = tableCam(t, T);
    K.bg(ctx, t, { gx: 1290, gy: 520, ga: .24, stars: 40 });
    ctx.save(); K.shotCam(ctx, t, C, { z0: 1.0, z1: 1.04, fx: 1290, fy: 560 }); tableScene(ctx, t, T); ctx.restore();
    tipPanel(ctx, t, T);
  },
  // ---------------------------------------------------------------- t3 most schools: not yet · your kitchen table can be
  t3(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    const kt = G('Your kitchen table'), on = sineIO(span(t, kt - .2, kt + .8));
    K.bg(ctx, t, { gx: lerp(640, 1450, on), gy: 400, ga: .2, stars: 40 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.04, fx: lerp(700, 1350, sineIO(span(t, S.a, S.b))), fy: 520 });
    // far behind: a classroom through its big window, dim (born where the plane landed)
    const cu = expoOut(IN(.9)), cx = 640, cy = 330, cw = 520, chh = 260;
    ctx.save(); ctx.globalAlpha *= cu * lerp(.85, .55, on); ctx.translate(cx, cy); ctx.scale(lerp(.6, 1, cu), lerp(.6, 1, cu));
    ctx.fillStyle = '#121a48'; ctx.fillRect(-cw / 2 - 40, -chh / 2 - 60, cw + 80, chh + 120);
    ctx.fillStyle = K.lin(ctx, 0, -chh / 2, 0, chh / 2, [[0, '#2a356e'], [1, '#1c2558']]); ctx.fillRect(-cw / 2, -chh / 2, cw, chh);
    ctx.fillStyle = '#3a4a80'; ctx.fillRect(-cw / 2 + 30, -chh / 2 + 22, 150, 70);   // a wall screen (no chalkboard)
    for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) { const x = -cw / 2 + 70 + c * 92 + r * 10, y = -chh / 2 + 120 + r * 46; ctx.fillStyle = '#0e1440'; ctx.fillRect(x - 26, y + 10, 52, 10); ctx.fillStyle = '#3a4580'; ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.fill(); ctx.fillRect(x - 10, y + 6, 20, 8); }
    ctx.fillStyle = '#0a1036'; ctx.fillRect(-4, -chh / 2, 8, chh); ctx.fillRect(-cw / 2, -4, cw, 8);
    ctx.restore();
    K.cap(ctx, 'MOST SCHOOLS: NOT YET', cx, cy + chh / 2 + 70, U('Most schools', .7, -.05), { size: 28, align: 'center', col: MUTED });
    // in front: the kitchen table, the lamp goes on on 'your kitchen table'
    const lx = 1520, ly = 500, top = 790;
    ctx.fillStyle = '#050818'; ctx.fillRect(lx - 2, -100, 4, ly - 30 + 100);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = K.lin(ctx, 0, ly, 0, top, [[0, rgba('#ffd98a', .34 * on)], [1, rgba('#ffd98a', .05 * on)]]); ctx.beginPath(); ctx.moveTo(lx - 60, ly + 10); ctx.lineTo(lx + 60, ly + 10); ctx.lineTo(lx + 460, top); ctx.lineTo(lx - 460, top); ctx.closePath(); ctx.fill(); ctx.restore();
    halo(ctx, lx, ly + 12, 260, .15 + .4 * on, '#f2c46a', '#fff4cf');
    ctx.fillStyle = K.lin(ctx, lx - 80, 0, lx + 80, 0, [[0, '#2a2140'], [.5, '#4a3a52'], [1, '#2a2140']]); ctx.beginPath(); ctx.moveTo(lx - 24, ly - 40); ctx.lineTo(lx + 24, ly - 40); ctx.lineTo(lx + 80, ly + 12); ctx.lineTo(lx - 80, ly + 12); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba('#fff2c4', .25 + .75 * on); ctx.beginPath(); ctx.ellipse(lx, ly + 12, 80, 8, 0, 0, TAU); ctx.fill();
    K.kid(ctx, 1700, top + 130, 300, { age: 6, dir: -1, look: lerp(.1, .5, on), light: -1 });
    ctx.fillStyle = K.lin(ctx, 0, top - 26, 0, top + 24, [[0, mixHex('#3a2e48', '#5a4652', on)], [1, '#2c2440']]); ctx.beginPath(); ctx.moveTo(980, top - 26); ctx.lineTo(1900, top - 26); ctx.lineTo(1960, top + 24); ctx.lineTo(940, top + 24); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#1a1533'; ctx.fillRect(940, top + 24, 1020, 22);
    E.du(ctx, 1180, top + 470, 760, { view: 'back', back: .55 * on, light: 1, look: .05, armR: [.14, .32], armL: [-.12, -.28] });
    ctx.restore();
    K.cap(ctx, 'YOUR KITCHEN TABLE CAN BE', 1240, 300, span(t, kt - .1, kt + .5), { size: 34, align: 'center', col: GOLD.text, glow: true });
  },
  // ---------------------------------------------------------------- t4 BOTH as a shield between two risks
  t4(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 420, ga: .24, gcol: '#4a4a6a', stars: 40 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.03, z1: 1.0, fx: 960, fy: 520 });
    ctx.fillStyle = K.lin(ctx, 0, 780, 0, H, [[0, '#18225a'], [1, P.night0]]); ctx.fillRect(-100, 780, W + 200, 400);
    const su = expoOut(IN(.8)), gd = span(t, G('guards') - .1, G('guards') + .8), r1 = span(t, G("can't think") - .2, G("can't think") + .6), r2 = span(t, G('uses it alone') - .2, G('uses it alone') + .6);
    const keep = span(t, G('in secret') + .2, G('in secret') + 1.2);
    // left risk: a child leaning on the tablet, head down
    if (r1 > 0) { ctx.save(); ctx.globalAlpha *= rise(r1) * (1 - .3 * keep);
      K.tablet(ctx, t, 560, 690, 120, 86, { lit: 1, rot: -.25 }); ctx.fillStyle = '#1a2258'; ctx.fillRect(520, 730, 90, 52);
      K.kid(ctx, 430, 782, 210, { age: 10, dir: 1, look: -.5, lean: .32, light: 1, armR: [1.3, 1.9], armL: [.9, 1.5] }); ctx.restore();
      K.cap(ctx, "CAN'T THINK WITHOUT IT", 480, 850, r1, { size: 24, align: 'center', col: CREAM }); }
    // right risk: a child under a blanket with a screen (a mound of blanket, cyan light leaking out)
    if (r2 > 0) { ctx.save(); ctx.globalAlpha *= rise(r2) * (1 - .3 * keep);
      halo(ctx, 1470, 760, 160, .35 + .1 * Math.sin(t * 2.3), MACH.heart, MACH.heartCore);
      ctx.fillStyle = K.lin(ctx, 0, 600, 0, 782, [[0, '#3a3f7a'], [1, '#1e2458']]); ctx.beginPath(); ctx.moveTo(1290, 782); ctx.bezierCurveTo(1300, 640, 1380, 590, 1460, 600); ctx.bezierCurveTo(1560, 610, 1640, 650, 1660, 782); ctx.closePath(); ctx.fill();
      ctx.fillStyle = rgba(P.night0, .3); ctx.beginPath(); ctx.moveTo(1420, 620); ctx.quadraticCurveTo(1450, 700, 1430, 782); ctx.lineTo(1442, 782); ctx.quadraticCurveTo(1462, 700, 1432, 618); ctx.fill();
      ctx.fillStyle = rgba(MACH.heartCore, .8); ctx.fillRect(1500, 772, 60, 8); ctx.restore();
      K.cap(ctx, 'USES IT ALONE, IN SECRET', 1470, 850, r2, { size: 24, align: 'center', col: CREAM }); }
    // the shield BOTH and its guard lines outward
    if (gd > 0) { K.lightLine(ctx, [[850, 440], [640, 520]], 0, expoOut(gd) * (r1 > 0 ? 1 : .6), GOLD, { w: 3, arrow: true, a: .9 }); K.lightLine(ctx, [[1070, 440], [1290, 520]], 0, expoOut(gd) * (r2 > 0 ? 1 : .6), GOLD, { w: 3, arrow: true, a: .9 }); }
    ctx.save(); ctx.translate(960, 430); ctx.scale(su, su);
    halo(ctx, 0, 0, 320, .4, GOLD.halo, GOLD.core);
    const sh = new Path2D(); sh.moveTo(0, -140); sh.lineTo(118, -100); sh.quadraticCurveTo(116, 50, 0, 140); sh.quadraticCurveTo(-116, 50, -118, -100); sh.closePath();
    E.glowFill(ctx, sh, 30, .5, '#f2c46a'); ctx.fillStyle = K.lin(ctx, 0, -140, 0, 140, [[0, '#fff4cf'], [.6, GOLD.hot], [1, GOLD.body]]); ctx.fill(sh);
    ctx.restore();
    K.serif(ctx, 'BOTH', 960, 452, 70, IN(.7, .3), { align: 'center', col: INK, glow: false });
    K.cap(ctx, 'DOING BOTH GUARDS AGAINST', 960, 220, span(t, G('guards') - .2, G('guards') + .4), { size: 28, align: 'center', col: GOLD.text });
    ctx.restore();
  },
  // ---------------------------------------------------------------- t5 Pew: 64 % of teens use chatbots · ~1 in 2 parents think theirs does
  t5(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 520, ga: .22, stars: 30 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.02, z1: 1.0, fx: 960, fy: 520 });
    const x0 = 330, gap = 52, n = 25;
    const tu = span(t, S.a + .1, G('teenagers') + .6), cu = span(t, G('use chatbots') - .2, G('use chatbots') + .7);
    K.figRow(ctx, t, x0, 432, n, gap, 116, tu, (i) => (i < 16 ? { look: .1, rim: cu > .3 ? MACH.heart : undefined } : { dim: cu * .9, look: .1 }));
    for (let i = 0; i < 16; i++) { const k = span(cu, i / 16 * .6, i / 16 * .6 + .4); if (k <= 0) continue; const hx = x0 + i * gap + 10, hy = 432 - 116 * .5; halo(ctx, hx, hy, 22, .55 * k, MACH.heart, MACH.heartCore); ctx.fillStyle = rgba(MACH.heartCore, k); ctx.beginPath(); ctx.roundRect(hx - 5, hy - 8, 10, 16, 2); ctx.fill(); }
    const pu = span(t, G('parents') - .4, G('parents') + .6), lu = span(t, G('think their') - .2, G('think their') + .9);
    K.figRow(ctx, t, x0, 790, n, gap, 138, pu, (i) => (i < 13 ? { look: lerp(-.25, .9, span(lu, i / 13 * .6, i / 13 * .6 + .4)), lit: .5 * lu, halo: CREAM, core: '#ffffff', rim: lu > .3 ? CREAM : undefined, long: i % 3 === 0 } : { dim: lu * .85, look: -.25, long: i % 3 === 0 }));
    const nu = span(t, G('Most American') - .1, G('Most American') + .6);
    K.big(ctx, '64 %', x0 - 10, 236, 96, span(t, G('use chatbots') - .15, G('use chatbots') + .45), { align: 'left' });
    K.cap(ctx, 'OF AMERICAN TEENS USE CHATBOTS', x0 + 220, 226, nu, { size: 26, col: CREAM });
    K.big(ctx, '~1 IN 2', x0 - 10, 586, 84, span(t, G('about half') - .15, G('about half') + .45), { align: 'left' });
    K.cap(ctx, 'OF PARENTS THINK THEIR TEEN DOES', x0 + 290, 576, span(t, G('think their') - .1, G('think their') + .5), { size: 26, col: CREAM });
    K.src(ctx, t, G('Most American') - .2, S.b + 2, 'PEW RESEARCH CENTER · U.S. TEENS AND THEIR PARENTS · FEB 2026');
    ctx.restore();
  },
  // ---------------------------------------------------------------- t6 ask back: the answer card turns in mid-air into a question
  t6(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 1180, gy: 520, ga: .24, gcol: '#4a4a6a', stars: 40 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.04, fx: 1150, fy: 560 });
    ctx.fillStyle = K.lin(ctx, 0, 860, 0, H, [[0, '#18225a'], [1, P.night0]]); ctx.fillRect(-100, 860, W + 200, 400);
    const ask = G('asks you'), hand = G('hand over'), back = G('Ask back');
    const lit = span(t, back + .2, back + .8);
    E.du(ctx, 880, 862, 390, { view: 'side', dir: 1, look: .35, light: 1, armR: [lerp(.3, 1.35, sineIO(span(t, hand - .6, hand))), lerp(.4, 1.6, sineIO(span(t, hand - .6, hand)))] });
    if (lit > 0) halo(ctx, 1420, 620, 170, .45 * lit, GOLD.halo, GOLD.core);
    K.kid(ctx, 1420, 862, 230, { age: 6, dir: -1, look: lerp(.5, .2, lit), light: 1 });
    // the child's question rises and drifts to you
    const q1 = sineIO(span(t, ask - .3, ask + 1.0));
    if (q1 > 0 && t < hand) { const x = lerp(1420, 940, q1), y = lerp(600, 430, q1) - Math.sin(Math.PI * q1) * 80; E.glowText(ctx, '?', x, y, { size: 64, serif: true, align: 'center', col: CREAM, a: clamp(q1 * 4) * (1 - span(t, hand - .4, hand)) }); }
    // the answer card: handed over, turns in mid-air (on 'the answer'), comes back as a question to the child
    const ft = G('the answer'), k = sineIO(span(t, hand - .1, back + .2)), flip = span(t, ft - .1, ft + .5);
    if (k > 0) {
      const x = lerp(990, 1400, k), y = lerp(640, 600, k) - Math.sin(Math.PI * k) * 150, sx = Math.cos(Math.PI * flip);
      ctx.save(); ctx.translate(x, y); ctx.scale(Math.abs(sx) * .9 + .1, 1);
      if (flip < .5) { ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-56, -34, 116, 76); ctx.fillStyle = PAPER76.lit; ctx.fillRect(-60, -40, 120, 76); ctx.fillStyle = rgba(INK, .5); for (let i = 0; i < 3; i++) ctx.fillRect(-42, -22 + i * 18, [84, 66, 74][i], 6); K.cap(ctx, 'ANSWER', 0, -48, 1, { size: 18, align: 'center', col: CREAM }); }
      else { halo(ctx, 0, -10, 90, .5, GOLD.halo, GOLD.core); E.glowText(ctx, '?', 0, 26, { size: 92, serif: true, align: 'center', col: GOLD.text }); }
      ctx.restore();
    }
    ctx.restore();
    K.big(ctx, 'Ask back.', 1150, 240, 88, span(t, back - .1, back + .45), {});
    tipPanel(ctx, t, T);
  },
  // ---------------------------------------------------------------- t7 every answer in reach, and no questions
  t7(ctx, t, S, T) {
    K.bg(ctx, t, { gx: 1300, gy: 560, ga: .2, stars: 40 });
    ctx.save(); K.shotCam(ctx, t, { a: S.a, b: S.b + 6, seed: 77 }, { z0: 1.03, z1: 1.0, fx: 1300, fy: 620 }); reachScene(ctx, t, T); ctx.restore();
    // 'Ask back.' rides over the plane's reveal (same screen place as in t6) and gives way when the answers arrive
    const ev = T.G('Every answer', 0, S.a - .5); K.big(ctx, 'Ask back.', 1150, 240, 88, 1 - span(t, ev - .7, ev - .2), {});
    tipPanel(ctx, t, T);
  },
  // ---------------------------------------------------------------- t8 the twelve-year-old: protect the human things (seesaw)
  t8(ctx, t, S, T) {
    const a7 = T.G('It protects against', 0, TT(T).line[1]) - .35;
    K.bg(ctx, t, { gx: 1300, gy: 560, ga: .2, stars: 40 });
    ctx.save(); K.shotCam(ctx, t, { a: a7, b: a7 + 6 + (S.a - a7), seed: 77 }, { z0: 1.03, z1: 1.0, fx: 1300, fy: 620 });
    reachScene(ctx, t, T); seesawScene(ctx, t, T); ctx.restore();
    tipPanel(ctx, t, T);
  },
  // ---------------------------------------------------------------- t9 the counterweight to a companion that is always there
  t9(ctx, t, S, T) {
    const a7 = T.G('It protects against', 0, TT(T).line[1]) - .35;
    K.bg(ctx, t, { gx: 1300, gy: 560, ga: .2, stars: 40 });
    ctx.save(); K.shotCam(ctx, t, { a: a7, b: S.b, seed: 77 }, { z0: 1.03, z1: 1.0, fx: 1300, fy: 620 });
    seesawScene(ctx, t, T); reachScene(ctx, t, T); ctx.restore();
    tipPanel(ctx, t, T);
  },
  // ---------------------------------------------------------------- t10 the eighteen-year-old: stop steering toward one job
  t10(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 1300, gy: 520, ga: .22, stars: 50 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.04, fx: 1250, fy: 600 });
    const gy = 800, st = G('stop steering'), dq = G('different question');
    ctx.fillStyle = K.lin(ctx, 0, gy, 0, H, [[0, '#18225a'], [1, P.night0]]); ctx.fillRect(-100, gy, W + 200, 400);
    ctx.fillStyle = rgba(CREAM, .3); ctx.fillRect(660, gy - 1, 1200, 2);
    // the signpost with one job sign (born where the plane landed), lifted out of the ground on 'stop steering'
    const ant = bump(t, st - .3, .5), lift = expoIn(span(t, st + .1, st + 1.6)), su = expoOut(IN(.7));
    ctx.fillStyle = rgba(P.night0, .7 * span(t, st + .1, st + .4)); ctx.beginPath(); ctx.ellipse(1200, gy + 4, 34, 9, 0, 0, TAU); ctx.fill();
    if (lift < 1) { ctx.save(); ctx.translate(1200, gy - lift * 900); ctx.rotate(.05 * Math.sin(t * 13) * ant + lift * .4); ctx.scale(su, su);
      ctx.fillStyle = '#8a7650'; ctx.fillRect(-7, -330, 14, 330 + 40 * span(t, st + .1, st + .3));
      ctx.fillStyle = K.lin(ctx, 0, -320, 0, -240, [[0, PAPER76.lit], [1, PAPER76.body]]); ctx.beginPath(); ctx.moveTo(-30, -310); ctx.lineTo(170, -310); ctx.lineTo(210, -275); ctx.lineTo(170, -240); ctx.lineTo(-30, -240); ctx.closePath(); ctx.fill();
      K.cap(ctx, 'ONE JOB', 76, -264, 1, { size: 28, align: 'center', col: INK }); ctx.restore(); }
    K.kid(ctx, 1600, gy + 2, 280, { age: 18, dir: -1, look: lerp(.2, .7, span(t, dq, dq + 1)), light: 1 });
    // a different question rises from the hole and drifts to the middle (the clip grows from it)
    const qk = sineIO(span(t, dq - .3, dq + 1.0));
    if (qk > 0) { const x = lerp(1200, S.out[0], qk), y = lerp(gy - 20, S.out[1], qk) - Math.sin(Math.PI * qk) * 60; halo(ctx, x, y, 120, .4 * qk, GOLD.halo, GOLD.core); E.glowText(ctx, '?', x, y + 34, { size: 100, serif: true, align: 'center', col: CREAM, a: clamp(qk * 3) }); }
    ctx.restore();
    K.cap(ctx, 'STOP STEERING TOWARD ONE JOB', 1240, 220, span(t, st - .1, st + .5), { size: 32, align: 'center', col: GOLD.text, glow: true });
    K.tag(ctx, 'DANIEL SUSSKIND · RSA', 1240, 300, span(t, G('Susskind has') - .1, G('Susskind has') + .5), { size: 22, col: CREAM });
    tipPanel(ctx, t, T);
  },
  C5: K.clipShot('C5'),   // ORIGINAL FOOTAGE plate grows out of S.in and back (lower third from K.CLIPS)
  // ---------------------------------------------------------------- t11 problems, not job titles: a job that's gone by graduation
  t11(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 1300, gy: 520, ga: .22, stars: 50 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.03, fx: 1250, fy: 600 });
    const gy = 790, ch = Math.min(G('chasing'), G('That saves') + .8), gone = G("gone by"), gr = G('graduation');
    ctx.fillStyle = K.lin(ctx, 0, gy, 0, H, [[0, '#18225a'], [1, P.night0]]); ctx.fillRect(-100, gy, W + 200, 400);
    ctx.fillStyle = rgba(CREAM, .3); ctx.fillRect(680, gy - 1, 1180, 2);
    // the graduation cap on a short post at the end of the road
    const cx = 1730, cy = 650, cu = span(t, S.a + .4, S.a + 1.1);
    ctx.save(); ctx.globalAlpha *= rise(cu); ctx.fillStyle = '#8a7650'; ctx.fillRect(cx - 4, cy + 20, 8, gy - cy - 20);
    ctx.fillStyle = '#1c2254'; ctx.beginPath(); ctx.roundRect(cx - 34, cy - 8, 68, 30, 6); ctx.fill();
    ctx.fillStyle = '#2c3474'; ctx.beginPath(); ctx.moveTo(cx - 80, cy - 10); ctx.lineTo(cx, cy - 36); ctx.lineTo(cx + 80, cy - 10); ctx.lineTo(cx, cy + 14); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = GOLD.body; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, cy - 12); ctx.quadraticCurveTo(cx + 56, cy - 8, cx + 58, cy + 30); ctx.stroke(); ctx.fillStyle = GOLD.body; ctx.fillRect(cx + 52, cy + 28, 12, 22);
    ctx.restore();
    // the runner chases a job card that keeps ahead and dissolves before the cap
    const rk = sineIO(span(t, ch - .9, gr + .4)), rx = lerp(780, 1440, rk), run = span(t, ch - .9, gr + .2) > 0 && span(t, ch - .9, gr + .2) < 1;
    const dis = span(t, gone - .1, gone + .9), kx = lerp(1010, 1600, sineIO(span(t, ch - .9, gone + .1)));
    if (dis < 1) { ctx.save(); ctx.globalAlpha *= (1 - dis) * clamp(IN(.6, .3) * 2); ctx.translate(kx, 600 + Math.sin(t * 5) * 6 - dis * 40); ctx.rotate(.06 * Math.sin(t * 3));
      ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-56, -32, 120, 76); ctx.fillStyle = PAPER76.lit; ctx.fillRect(-60, -38, 120, 76); K.cap(ctx, 'A JOB', 0, 10, 1, { size: 24, align: 'center', col: INK }); ctx.restore(); }
    if (dis > 0) E.dust(ctx, 3, 60, kx, 600 - dis * 60, 70 + dis * 60, 40 + dis * 50, t, .8 * (1 - dis) * clamp(dis * 4), PAPER76.lit);
    K.kid(ctx, rx, gy, 230, { age: 12, view: 'side', dir: 1, walk: run ? t * 8.5 : null, look: lerp(.2, .6, dis), light: 1, lean: run ? .08 : 0 });
    ctx.restore();
    K.big(ctx, 'Problems, not job titles.', 1250, 230, 76, span(t, G('Problems') - .1, G('Problems') + .5), {});
    K.cap(ctx, 'GONE BY GRADUATION', 1690, 540, span(t, gone - .1, gone + .5), { size: 26, align: 'center', col: CREAM });
    tipPanel(ctx, t, T);
  },
  // ---------------------------------------------------------------- s1 ★ the list: no job on it; a kind of person; it folds into a child
  s1(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    const look = G('look at that list'), nojob = G("isn't a job"), kind = G('kind of person'), A = [G('One who asks'), G('One who shows'), G('One with a problem')];
    const morph = sineIO(span(t, A[2] + .55, A[2] + 1.55)), land = span(t, A[2] + 1.0, A[2] + 1.8);
    K.bg(ctx, t, { gx: 800, gy: 450, ga: .22 + .1 * morph, gcol: mixHex(P.blue0, '#6a5a2a', morph), stars: 50 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.09, fx: 800, fy: 440 });
    const X = 420, Y = 150, Wd = 760, Ht = 600, su = IN(.9), dim = 1;
    const lines = TIPS.map((s, i) => ({ s, u: 1, num: 1, hi: i > 0 ? span(t, A[i - 1] - .1, A[i - 1] + .4) : 0 }));
    // the sheet folds flat toward the centre while its four lines pull into the child
    ctx.save(); ctx.translate(800, 450); ctx.scale(1, 1 - sineIO(span(morph, 0, .45)) * .97); ctx.translate(-800, -450);
    const R = sheet(ctx, t, X, Y, Wd, Ht, { fs: 34, u: su, lines, a: dim * (1 - sineIO(span(morph, .42, .62))), glow: span(t, kind - .2, kind + .6) * (1 - morph) });
    ctx.restore();
    // a scan line finds no job on it
    const sc = span(t, nojob - .2, nojob + 1.0);
    if (sc > 0 && sc < 1) { ctx.fillStyle = rgba(GOLD.line, .5 * Math.sin(Math.PI * sc)); ctx.fillRect(X + 10, lerp(Y + 80, Y + Ht - 20, sc), Wd - 20, 3); }
    // the four lines as strokes of light, pulled together into the child's silhouette
    const ky = 742, kh = 330;
    if (morph > 0) for (let i = 0; i < 4; i++) {
      const [nx, ny] = R.pts[i], q = sineIO(span(morph, i * .06, .7 + i * .06)), x0 = lerp(nx + 60, 800 - 30, q), y0 = lerp(ny + 10, ky - kh * (.85 - i * .2), q), w = lerp(480, 60, q);
      ctx.fillStyle = rgba(GOLD.line, .85 * (1 - span(morph, .7, 1))); ctx.beginPath(); ctx.roundRect(x0, y0, w, 5, 2); ctx.fill();
    }
    const kidU = span(morph, .45, 1);
    if (kidU > 0) { halo(ctx, 800, ky - kh * .5, 330, .45 * kidU, GOLD.halo, GOLD.core); ctx.save(); ctx.globalAlpha *= rise(kidU); K.kid(ctx, 800, ky + (1 - kidU) * 20, kh, { age: 6, look: .5, light: 1, back: .4 * kidU }); ctx.restore(); }
    ctx.restore();
    K.cap(ctx, 'A KIND OF PERSON', 800, 112, span(t, kind - .1, kind + .5) * (1 - morph), { size: 28, align: 'center', col: CREAM });
    K.cap(ctx, 'NO JOB ON IT', 800, 820, span(t, nojob - .1, nojob + .5) * (1 - morph), { size: 32, align: 'center', col: GOLD.text, glow: true });
    // ONE WHO ASKS · ONE WHO SHOWS UP · ONE WITH A PROBLEM TO SOLVE: each label becomes a gold light that lands in the child
    const labs = ['ONE WHO ASKS', 'ONE WHO SHOWS UP', 'ONE WITH A PROBLEM TO SOLVE'], dest = [[800, ky - kh * .9], [800, ky - kh * .58], [846, ky - kh * .42]];
    labs.forEach((s, i) => {
      const [nx, ny] = R.pts[i + 1], lx = 1230, ly = ny + 14, lu = span(t, A[i] - .1, A[i] + .5), fly = sineIO(span(land, i * .12, .6 + i * .12));
      K.cap(ctx, s, lx, ly, lu * (1 - span(morph, 0, .5)), { size: 26, col: GOLD.text, glow: true });
      if (morph > .15 && fly < 1) { const x = lerp(lx + 60, dest[i][0], fly), y = lerp(ly - 10, dest[i][1], fly) - Math.sin(Math.PI * fly) * 80; halo(ctx, x, y, 50, .6, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.fill(); }
      if (fly >= 1) { const p = .85 + .15 * Math.sin(t * 2 + i); halo(ctx, dest[i][0], dest[i][1], 44, .55 * p, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.core; ctx.beginPath(); ctx.arc(dest[i][0], dest[i][1], 6, 0, TAU); ctx.fill(); }
    });
  },
  // ---------------------------------------------------------------- s2 today's kitchen table again: your child is still waiting
  s2(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    K.kitchen(ctx, t, { cam: s2cam(t, T), childAge: 6, lamp: 1, look: sineIO(span(t, G('still waiting') - .3, G('still waiting') + .9)) });
  },
  // ---------------------------------------------------------------- s3 the question again; WHAT gets a thin underline; the page folds into the plane
  s3(ctx, t, S, T) {
    const cam = s2cam(t, T), R = K.kitchen(ctx, t, { cam, childAge: 6, lamp: 1, look: 1 });
    const words = T.GW('What should I be when', 'up?', S.a - .5), size = 76;
    const line = words.map((w) => w.w.replace(/["“”]/g, '')).join(' '), tw = K.measure(line, size, true);
    let xx = 960 - tw / 2; const x0 = xx;
    for (const w of words) { const s = w.w.replace(/["“”]/g, ''), u = span(t, w.s - .12, w.s + .38); if (u > 0) K.serif(ctx, s, xx, 200, size, u, { col: CREAM }); xx += K.measure(s + ' ', size, true); }
    const uw = K.measure('What', size, true), ul = sineIO(span(t, words[0].s + 1.0, words[0].s + 1.6));
    if (ul > 0) { ctx.save(); ctx.shadowColor = rgba(GOLD.halo, .9); ctx.shadowBlur = 8; ctx.fillStyle = GOLD.line; ctx.fillRect(x0, 214, uw * ul, 3); ctx.restore(); }
    const tf = T.G("You don't have to know", 0, S.a) - .35 - .55, f0 = tf - 1.2, k = span(t, f0, tf);
    if (k > 0 && t < tf + .02) {
      const toScr = (x, y) => [(x - cam.fx) * cam.z + cam.fx, (y - cam.fy) * cam.z + cam.fy];
      const [nx, ny] = toScr(R.nb[0], R.nb[1] - 8), q = sineIO(k), [ox, oy] = S.out;
      K.paperPlane(ctx, lerp(nx, ox, q), lerp(ny, oy, q) - Math.sin(Math.PI * q) * 70, lerp(70, 30, q), lerp(0, -.3, q), { open: 1 - sineIO(span(k, .15, .8)), t, bank: .2 });
    }
  },
  // ---------------------------------------------------------------- s4 LEITBILD 3 (the punchline): NOT WHAT. WHO. on the gate's light
  s4(ctx, t, S, T) {
    const { G, U } = K.phr(T, S, t);
    const u = span(t, S.a, S.b + 1);
    K.gateWorld(ctx, t, { cam: { z: lerp(1.04, 1.14, sineIO(u)), fx: 1480, fy: 440 }, walk: .44, stop: true, windows: 1, gateU: 1, over(c, Gw) {
      const gx = Gw.gate.x + Gw.gate.w / 2;
      K.serif(c, 'NOT WHAT.', gx, 360, 62, span(t, G('know what') - .1, G('know what') + .5), { align: 'center', col: INK, glow: false });
      const wu = span(t, G('You can help') - .35, G('You can help') + .4), gold = span(t, G('who.') - .1, G('who.') + .3);
      K.serif(c, 'WHO.', gx, 500, 124, wu, { align: 'center', col: mixHex('#6a5a7a', '#7a4a10', gold), glow: false });
    } });
  },
  // ---------------------------------------------------------------- s5 your parents and the light switch: a plain bulb, A GOOD PERSON
  s5(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    const el = G('electricity'), on = span(t, el - .05, el + .25), flood = sineIO(span(t, el, el + 1.2)), gp = G('good person');
    ctx.fillStyle = K.lin(ctx, 0, 0, 0, H, [[0, mixHex('#0b1238', '#2e2a4e', flood)], [1, mixHex('#070a22', '#1c1a38', flood)]]); ctx.fillRect(0, 0, W, H);
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.02, z1: 1.06, fx: 1000, fy: 520 });
    ctx.fillStyle = mixHex('#0a0f30', '#241e3e', flood); ctx.fillRect(-100, 900, W + 200, 300);
    ctx.fillStyle = rgba('#000', .25); ctx.fillRect(-100, 896, W + 200, 6);
    // a door frame next to the switch (an older room: plain wood)
    ctx.fillStyle = mixHex('#141a46', '#3a3050', flood); ctx.fillRect(330, 300, 220, 600); ctx.fillStyle = mixHex('#0c1238', '#221c38', flood); ctx.fillRect(350, 320, 180, 580);
    // the plain bulb on its cord: dark glass until the switch
    const bx = 1200, by = 270 + Math.sin(t * 1.1) * 3;
    ctx.fillStyle = '#050818'; ctx.fillRect(bx - 2, -100, 4, by - 30 + 100);
    ctx.fillStyle = '#4a4258'; ctx.fillRect(bx - 12, by - 40, 24, 22);
    if (flood > 0) halo(ctx, bx, by, 520, .42 * flood, '#f2c46a', '#fff4cf');
    ctx.fillStyle = K.rad(ctx, bx - 8, by - 6, 40, [[0, mixHex('#3a3a5a', '#fffaf0', on)], [1, mixHex('#22223a', GOLD.body, on)]]); ctx.beginPath(); ctx.ellipse(bx, by, 26, 30, 0, 0, TAU); ctx.fill();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = K.lin(ctx, 0, by, 0, 900, [[0, rgba('#ffe7b0', .18 * flood)], [1, rgba('#ffe7b0', 0)]]); ctx.beginPath(); ctx.moveTo(bx - 40, by); ctx.lineTo(bx + 40, by); ctx.lineTo(bx + 520, 900); ctx.lineTo(bx - 520, 900); ctx.closePath(); ctx.fill(); ctx.restore();
    // the switch (born where the plane landed); your parent reaches it on 'electricity'
    K.lightSwitch(ctx, S.in[0], S.in[1], 34, on);
    const reach = sineIO(span(t, G('compete with') - .5, el - .05));
    E.person(ctx, 585, 902, 400, { dir: 1, look: lerp(.2, .7, reach), light: 1, rim: mixHex(P.blue0, GOLD.line, flood * .6), armR: [lerp(.3, 2.2, reach), lerp(.3, 2.45, reach)] });
    // your other parent and you as a child under the bulb
    E.person(ctx, 1080, 902, 380, { dir: 1, look: lerp(.1, .5, flood), light: 1, long: true, rim: mixHex(P.blue0, GOLD.line, flood * .6), armR: [.6, .9] });
    if (flood > 0) halo(ctx, 1250, 760, 160, .3 * flood, GOLD.halo, GOLD.core);
    K.kid(ctx, 1250, 902, 210, { age: 6, dir: -1, look: lerp(.3, .8, flood), light: 1 });
    ctx.restore();
    K.cap(ctx, 'YOUR PARENTS', 1150, 150, IN(.8, .2) * (1 - span(t, gp - .6, gp - .2)), { size: 24, align: 'center', col: MUTED });
    K.cap(ctx, 'A GOOD PERSON', 1250, 470, span(t, gp - .1, gp + .5), { size: 36, align: 'center', col: GOLD.text, glow: true });
  },
  // ---------------------------------------------------------------- s6 LEITBILD 4 (the end): they walk into the gate's light
  s6(ctx, t, S, T) { closeWorld(ctx, t, T); },
  // ---------------------------------------------------------------- e1 mission + subscribe; the gate opens onto the end picture (15 s calm)
  e1(ctx, t, S, T) { closeWorld(ctx, t, T); },
};
function stepX(i, f) { return K.stepTop(i)[0] + K.STEP.w * f; }
function s2cam(t, T) {
  const m = TT(T), a = T.G('And at your kitchen table', 0, m.f) - .35, b = T.G("You don't have to know", 0, m.f) - .35;
  const u = sineIO(span(t, a, b)); return { z: lerp(1.0, 1.09, u), fx: lerp(1120, 1180, u), fy: lerp(560, 470, u) };
}
