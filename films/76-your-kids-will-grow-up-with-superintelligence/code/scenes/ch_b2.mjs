// Film 76 · package B2 (builder): AGE 12 (a12a–a12j) · subscribe 1 (m1) · AGE 18 (a18a–a18o incl. clip C2). Draws keyed by shot id
// (scenes/plan.mjs, pk 'B2'); see docs/BRIEF-builders.md. Skills: scenario-motion, world-class-motion-design, fluid-motion-design,
// motion-director-gates, dataviz. Quality reference: scenes/ch_hook.mjs. One motif per sentence; every shot grows from S.in (the paper
// plane's landing point) or continues the shot before ('match': a12d→e→f teens, a18f→g classroom, a18h→i→j job cards share one helper and
// one camera). Everything is anchored on PHRASES (K.phr / T.G with a fence), never on seconds.
// Facts (shots.md, faktencheck 25.11.): a12f MORE TIME WITH REAL FRIENDS (not "come first") · a18d NO SKILL IS FUTURE-PROOF is a paraphrase:
// shown without quotation marks · a18f CURRICULUM 2013 · TAUGHT FROM 2014 · AGE 5–16 (never "every schoolchild") · no map (Nicht wiederholen),
// so ENGLAND is a word, not a coastline · no ribbon (#67): the book wears a paper belly band · RENT is a little house, not a bill/receipt (#66).
import * as K from '../lib/f76_kit.mjs';
import { resolve } from './resolve.mjs';
const PREV = new WeakMap();
const prevShot = (T, id) => { let m = PREV.get(T); if (!m) { m = Object.fromEntries(resolve(T).map((s) => [s.id, s])); PREV.set(T, m); } return m[id]; };
const { W, H, P, E, clamp, lerp, span, sineIO, expoOut, expoIn, rise, halo, rgba, mixHex, GOLD, CREAM, MUTED, MACH, PAPER76 } = K;
// C2 = the Oxford Martin School book talk; its lower third lives in the kit (f67_kit CLIPS.C2).
const TAU = Math.PI * 2;
const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));
const CYAN = { body: MACH.heart, line: MACH.heartCore, deep: MACH.heartDeep, text: '#c9f4ff' };
const GOLDC = { body: GOLD.body, line: GOLD.line, deep: GOLD.deep, text: GOLD.text };
const SKIN = mixHex(P.shade0, P.night1, .35);
const INK = PAPER76.ink;

// ================================================================================================================ shared helpers
// a mirror turn about x (k 0..1): squash to a sliver at .5, the drawing switches side there. draw(sideAfter) does the figure.
function turnAbout(ctx, x, k, draw) {
  const s = k < .5 ? 1 - .72 * sineIO(k * 2) : .28 + .72 * sineIO(k * 2 - 1);
  ctx.save(); ctx.translate(x, 0); ctx.scale(s, 1); ctx.translate(-x, 0); const r = draw(k >= .5); ctx.restore(); return r;
}
// a small device held in both hands at (x, y); glow 0..1 = the machine's light (cyan); s = phone height
function phone(ctx, x, y, s, glow, o = {}) {
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(x, y); ctx.rotate(o.rot ?? -.12);
  if (glow > 0) halo(ctx, 0, -s * .3, s * (3 + 2 * glow), .5 * glow, MACH.heart, MACH.heartCore);
  ctx.fillStyle = '#1b2147'; ctx.beginPath(); ctx.roundRect(-s * .32, -s / 2, s * .64, s, s * .1); ctx.fill();
  ctx.fillStyle = mixHex('#0b1236', '#bff2ff', .85 * glow); ctx.beginPath(); ctx.roundRect(-s * .26, -s * .43, s * .52, s * .86, s * .07); ctx.fill();
  ctx.restore();
}
// your child as a teenager / any other teen (indigo). o: { kid (yellow coat), age, dir, side (view), look, lean, armR, armL, a, rim }
function teenFig(ctx, x, y, h, o = {}) {
  if (o.kid) return K.kid(ctx, x, y, h, { age: o.age ?? 12, dir: o.dir ?? 1, view: o.side ? 'side' : o.view, look: o.look, lean: o.lean, armR: o.armR, armL: o.armL, light: o.light ?? .6, walk: o.walk, back: o.back });
  return E.person(ctx, x, y, h, { head: o.head ?? 1.15, dir: o.dir ?? 1, view: o.side ? 'side' : o.view, look: o.look, lean: o.lean, armR: o.armR, armL: o.armL, light: o.light ?? .6, rim: o.rim, walk: o.walk, long: o.long });
}
// a pill tag that rises on its word (cap inside an outline), cyan for the machine's traits, cream otherwise
const tagAt = (ctx, s, x, y, u, col = CREAM, size = 24) => K.tag(ctx, s, x, y, u, { size, col });
// a soft ground line (a floor of night) with a warm pool at gx
function ground(ctx, y, gx, ga = .14, col = '#ffd98a') {
  ctx.fillStyle = K.lin(ctx, 0, y, 0, H, [[0, '#18225a'], [1, P.night0]]); ctx.fillRect(-200, y, W + 400, H - y + 200);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = K.rad(ctx, gx, y, 700, [[0, rgba(col, ga)], [1, rgba(col, 0)]]); ctx.fillRect(gx - 720, y - 720, 1440, 1440); ctx.restore();
}
// the gold light that the plane's open sheet becomes; it glides from S.in to (x1, y1) and lands (age clock shots)
function lightDrop(ctx, t, x0, y0, x1, y1, t0, t1) {
  const k = span(t, t0, t1); if (k <= 0 || k >= 1.0001) return;
  const q = sineIO(k), x = lerp(x0, x1, q), y = lerp(y0, y1, q) - Math.sin(Math.PI * q) * 60, a = 1 - span(k, .85, 1);
  halo(ctx, x, y, 70, .55 * a, GOLD.halo, GOLD.core); ctx.fillStyle = rgba(GOLD.hot, a); ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.fill();
}
// odometer roll without the glow (rollText's glow is cut by its mask into a visible box on big numbers)
function roll(ctx, a, b, u, x, y, size, col) {
  const n = Math.max(a.length, b.length); a = a.padStart(n, ' '); b = b.padStart(n, ' ');
  const dw = K.measure('0', size, true) * 1.02; let xx = x;
  ctx.save(); ctx.beginPath(); ctx.rect(x - 10, y - size * .95, dw * n + 20, size * 1.18); ctx.clip();
  for (let i = 0; i < n; i++) {
    const ca = a[i], cb = b[i], k = expoOut(span(u, i * .08, .55 + i * .08));
    if (ca === cb) { if (cb !== ' ') E.glowText(ctx, cb, xx, y, { size, serif: true, col, glow: false }); }
    else { if (ca !== ' ') E.glowText(ctx, ca, xx, y - k * size * 1.1, { size, serif: true, col, a: 1 - k, glow: false }); if (cb !== ' ') E.glowText(ctx, cb, xx, y + (1 - k) * size * 1.1, { size, serif: true, col, a: k, glow: false }); }
    xx += dw;
  }
  ctx.restore(); return dw * n;
}
// AGE n · YEAR with separate rolls for the age (on the age word) and the year (on the year words); same place as K.counterAge
function ageCounter(ctx, from, to, ua, uy, a = 1) {
  const x = 120, y = 170, size = 92;
  ctx.save(); ctx.globalAlpha *= a;
  K.cap(ctx, 'AGE', x, y - size * 1.02, 1, { size: 24, col: CREAM });
  const w1 = K.rollText(ctx, String(from[0]), String(to[0]), ua, x, y, size, { col: '#fff6d8' });
  E.glowText(ctx, '·', x + w1 + size * .22, y - size * .06, { size: size * .7, serif: true, col: GOLD.text, glow: false });
  K.rollText(ctx, String(from[1]), String(to[1]), uy, x + w1 + size * .55, y, size, { col: GOLD.text });
  ctx.restore();
}
// the age clock shot (a12a, a18b first part): a light drops from S.in onto step i, the step lights, the child rises there, the counter rolls
function ageStep(ctx, t, S, T, c) {
  const { G } = K.phr(T, S, t);
  const ta = G(c.pAge), ty = G(c.pYear), [sx, sy] = K.stepTop(c.i), fx = c.fx ?? .5, kx = sx + K.STEP.w * fx;
  const lit = sineIO(span(t, ta - .15, ta + .45)), kidU = span(t, ta - .05, ta + .8);
  K.ageClock(ctx, t, { u: 1, lit: [0, 1, 2, 3, 4].map((k) => (k < c.i ? .18 : k === c.i ? lit : 0)), figs: [{ i: c.i, age: c.age, x: fx, a: kidU, look: .65 }], city: 1 });
  K.tag(ctx, `SCENARIO · ${c.year}`, 330, 250, span(t, ty + .25, ty + .95), { size: 22, col: GOLD.text });   // same place as ageClock's own tag
  ageCounter(ctx, c.from, [c.age, c.year], span(t, ta - .05, ta + .6), span(t, ty - .05, ty + .7));
  lightDrop(ctx, t, S.in[0], S.in[1], kx, sy - 40, S.a + .05, ta - .05);
  return { kx, ky: sy, h: c.age >= 18 ? 185 : 155 };
}

// ================================================================================================================ AGE 12 · teens (a12d–f)
// five slots; the middle three stand from a12d, the outer two rise on "four in five". One camera from a12d to the end of a12f.
const TX = [500, 730, 960, 1190, 1420], TBASE = 840, TH = 360;
function teens(ctx, t, T) {
  const tD = T.G('Ask the teenagers'), tE = T.G('In a survey last year', 0, tD), tF = T.G('And still, four in five', 0, tE), tEnd = T.G('A real friend disagrees', 0, tF) - .35;
  const g = (p, after) => T.G(p, 0, after);
  const night = sineIO(span(t, g('third', tE) - .3, g('third', tE) + .6)) * (1 - sineIO(span(t, tF - .1, tF + .8)));
  const warm = sineIO(span(t, g('four in five', tF) + .3, g('real friends', tF) + .2));
  K.bg(ctx, t, { gx: 960, gy: 560, ga: lerp(.24, .1, night) + .08 * warm, gcol: mixHex(P.blue0, '#6a4a22', warm), stars: 50 });
  ctx.save(); K.shotCam(ctx, t, { a: tD - .35, b: tEnd, seed: 47 }, { z0: 1.0, z1: 1.06, fx: 960, fy: 620 });
  ground(ctx, TBASE + 2, 960, .08 + .14 * warm);
  // the title (born where the plane lands, 960/300) and the source
  K.cap(ctx, 'TEENS WHO USE AI COMPANIONS', 960, 160, span(t, tD - .2, tD + .5), { size: 30, align: 'center', col: MUTED });
  K.src(ctx, t, tD, tEnd + 1.5, 'COMMON SENSE MEDIA · JULY 2025 · U.S. TEENS 13–17 WHO USED AI COMPANIONS');
  const serious = g('something serious', tE), one = sineIO(span(t, g('third', tE) - .1, g('third', tE) + .7));
  const ff = g('four in five', tF), friends = g('real friends', tF);
  const outer = span(t, tF - .1, ff + .4);
  // which way each turns on "four in five" (pairs face each other); slot 4 keeps the device
  const TURN = [1, -1, 1, -1, null], TT = [0, .18, .36, .54];
  const posOf = (i) => { const k = TURN[i] == null ? 0 : sineIO(span(t, ff + .1 + TT[i] * 1.6, ff + .9 + TT[i] * 1.6)); return [TX[i] + (TURN[i] ?? 0) * 26 * k, k]; };
  // warm light between the friends (the wow): gold pools between pair (0,1) and pair (2,3)
  if (warm > 0) for (const [a, b] of [[0, 1], [2, 3]]) { const xa = posOf(a)[0], xb = posOf(b)[0]; halo(ctx, (xa + xb) / 2, TBASE - TH * .62, 260 * warm, .5 * warm, GOLD.halo, GOLD.core); }
  for (let i = 0; i < 5; i++) {
    const appear = i === 0 || i === 4 ? outer : span(t, tD - .25 + (i - 1) * .12, tD + .55 + (i - 1) * .12);
    const e = rise(appear); if (e <= 0) continue;
    const [x, k] = posOf(i), y = TBASE + (1 - e) * 18, hh = TH * (i === 2 ? 1.02 : i === 1 ? .97 : 1);
    // a12e: slot 1 is the one who talks with the machine; slot 2 (beside) turns toward it and is not answered
    const isOne = i === 1, beside = i === 2 ? sineIO(span(t, serious - .2, serious + .6)) * (1 - k) : 0;
    const glow = TURN[i] == null ? 1 : lerp(isOne ? lerp(.8, 1, one) : .8, 0, k) * (1 - beside * .6);
    const dim = (i !== 1 ? .45 * one : 0) * (1 - span(t, tF - .1, tF + .6));
    ctx.save(); ctx.globalAlpha *= e * (1 - dim);
    turnAbout(ctx, x, TURN[i] == null ? beside * .0 : k, (side) => {
      const facing = side ? TURN[i] : 1;
      const hands = teenFig(ctx, x, y + Math.sin(t * 1.3 + i * 1.7) * 1.2, hh, side ? { side: true, dir: facing, look: .35, armR: [.15, .1], armL: [-.15, -.1], light: 1, rim: k > .5 ? mixHex(P.blue0, GOLD.line, .3 + .7 * warm) : undefined }
        : { look: lerp(-.25, -.45, isOne ? one : 0), lean: .04, armR: [-.3, -2.4], armL: [.3, 2.4], rim: mixHex(P.blue0, MACH.heart, .45 * glow) });
      if (!side) phone(ctx, (hands.R[0] + hands.L[0]) / 2, (hands.R[1] + hands.L[1]) / 2 - hh * .03, hh * .11, glow);
      else phone(ctx, hands.R[0], hands.R[1] + hh * .02, hh * .07, 0, { rot: .1, a: .8 });
      if (!side) halo(ctx, x, y - hh * .8, hh * (.3 + .2 * (isOne ? one : 0)), (.12 + .2 * (isOne ? one : 0)) * glow, MACH.heart, MACH.heartCore);   // the screen's light on the face   // the machine's light on the face (at night)
      return hands;
    });
    // slot 2 leans toward slot 1 (the person beside), then gives up
    ctx.restore();
  }
  // the person beside: a small cream question to the one on the phone that goes unanswered (a12e)
  const bq = span(t, serious - .1, serious + .5) * (1 - span(t, tF - .2, tF + .3));
  if (bq > 0) { ctx.save(); ctx.globalAlpha *= clamp(bq * 2); for (let d = 0; d < 3; d++) { ctx.fillStyle = rgba(CREAM, .7 * clamp(bq * 3 - d)); ctx.beginPath(); ctx.arc(890 - d * 24, TBASE - TH * 1.0 - d * 7, 5 - d * .8, 0, TAU); ctx.fill(); } ctx.restore(); }
  // the numbers: 1 IN 3 (cream) rolls into 4 IN 5 (gold)
  const n1 = span(t, g('third', tE) - .1, g('third', tE) + .5), rl = span(t, ff - .1, ff + .7);
  if (n1 > 0) {
    const size = 112, col = mixHex('#fff6d8', GOLD.text, rl), tw = K.measure('0', size, true) * 1.02 * 6;
    ctx.save(); ctx.globalAlpha *= clamp(n1 * 3);
    if (rl > 0) halo(ctx, 960, 260, 260, .22 * rl, GOLD.halo, GOLD.core);
    roll(ctx, '1 IN 3', '4 IN 5', rl, 960 - tw / 2, 300, size, col);
    ctx.restore();
    K.cap(ctx, 'SOMETHING SERIOUS: TOLD THE MACHINE', 960, 366, span(t, serious - .15, serious + .5) * (1 - span(t, ff - .2, ff + .2)), { size: 26, align: 'center', col: MACH.heartCore });
    K.cap(ctx, 'MORE TIME WITH REAL FRIENDS', 960, 366, span(t, friends - .5, friends + .2), { size: 28, align: 'center', col: GOLD.text, glow: true });
  }
  ctx.restore();
}

// ================================================================================================================ the seesaw (a12j, a18a)
// two hands clasped (a handshake): two indigo sleeves, the clasp in warm gold light (what holds). Centre (x, y), s = scale (1 ≈ 150 px wide)
function handshake(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1, lit = clamp(o.lit ?? 1); if (a <= 0 || s <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  if (lit > 0) halo(ctx, 0, 0, 120 + 30 * (o.glow ?? 0), (.35 + .25 * (o.glow ?? 0)) * lit, GOLD.halo, GOLD.core);
  // sleeves
  ctx.fillStyle = K.lin(ctx, -90, 0, -20, 0, [[0, P.ind1], [1, mixHex(P.ind2, P.blue1, .6)]]);
  ctx.beginPath(); ctx.moveTo(-95, 36); ctx.lineTo(-40, -6); ctx.lineTo(-24, 14); ctx.lineTo(-78, 56); ctx.closePath(); ctx.fill();
  ctx.fillStyle = K.lin(ctx, 20, 0, 90, 0, [[0, mixHex(P.ind2, P.blue1, .5)], [1, P.ind1]]);
  ctx.beginPath(); ctx.moveTo(95, 36); ctx.lineTo(40, -6); ctx.lineTo(24, 14); ctx.lineTo(78, 56); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(CREAM, .5); ctx.fillRect(-44, -8, 6, 26); ctx.fillRect(38, -8, 6, 26);   // cuffs
  // the clasp (warm light): the right hand's palm behind, the left hand's four fingers wrapped over it, the right thumb across the top
  const hot = mixHex(GOLD.hot, '#ffffff', .2 * lit), body = mixHex(GOLD.body, P.shade0, 1 - lit), mid = mixHex(GOLD.mid, P.night1, .5 * (1 - lit));
  ctx.fillStyle = mixHex(mid, P.night1, .35); ctx.beginPath(); ctx.roundRect(-4, -22, 50, 42, 14); ctx.fill();
  for (let i = 0; i < 4; i++) { ctx.fillStyle = K.lin(ctx, -30, 0, 30, 0, [[0, body], [.6, hot], [1, body]]); ctx.beginPath(); ctx.roundRect(-34 + i * 1.5, -19 + i * 10.5, 62 - i * 3, 9, 4.5); ctx.fill(); }
  ctx.fillStyle = hot; ctx.beginPath(); ctx.ellipse(6, -24, 26, 7.5, -.18, 0, TAU); ctx.fill();
  ctx.restore();
}
// a little house block (RENT): a pentagon of night stone with a lit window; centre bottom (x, y), s = width
function rentHouse(ctx, x, y, s, a = 1, ang = 0) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(ang);
  ctx.fillStyle = K.lin(ctx, 0, -s * 1.1, 0, 0, [[0, '#cfc6a8'], [1, '#8f8566']]);
  ctx.beginPath(); ctx.moveTo(-s / 2, 0); ctx.lineTo(-s / 2, -s * .62); ctx.lineTo(0, -s * 1.02); ctx.lineTo(s / 2, -s * .62); ctx.lineTo(s / 2, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(P.night0, .55); ctx.fillRect(-s * .12, -s * .36, s * .24, s * .36);
  ctx.restore();
  E.glowText(ctx, 'RENT', x, y - s * .5, { size: 26, weight: 600, align: 'center', col: INK, glow: false, spacing: .1 });
}
// answer slips (cheap answers): small cyan-white cards with two lines
function answerSlip(ctx, x, y, ang, a = 1) {
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(ang);
  ctx.fillStyle = mixHex('#d8f7ff', '#8fe6ff', .35); ctx.beginPath(); ctx.roundRect(-22, -13, 44, 26, 4); ctx.fill();
  ctx.fillStyle = rgba(MACH.heartDeep, .7); ctx.fillRect(-15, -6, 28, 3); ctx.fillRect(-15, 2, 18, 3);
  ctx.restore();
}

// ================================================================================================================ AGE 18 · job cards (a18h–j)
const CW = 150, CH = 210;
function jobCard(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || s <= 0) return;
  const flip = clamp(o.flip ?? 0), sx = Math.abs(Math.cos(Math.PI * flip)) * .96 + .04, face = flip > .5;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.scale(s * sx, s);
  if (o.gold) halo(ctx, 0, 0, CW * 2.4, .55 * o.gold, GOLD.halo, GOLD.core);
  ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.roundRect(-CW / 2 + 8, -CH / 2 + 12, CW, CH, 12); ctx.fill();
  if (!face) {   // the back: dark indigo, a cream border, a fine pattern of dots (no text: face down)
    ctx.fillStyle = K.lin(ctx, 0, -CH / 2, 0, CH / 2, [[0, '#24306e'], [1, '#141c4c']]); ctx.beginPath(); ctx.roundRect(-CW / 2, -CH / 2, CW, CH, 12); ctx.fill();
    ctx.strokeStyle = rgba(PAPER76.body, .75); ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(-CW / 2 + 10, -CH / 2 + 10, CW - 20, CH - 20, 8); ctx.stroke();
    ctx.fillStyle = rgba(GOLD.line, .35 + .3 * (o.glint ?? 0)); for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) { ctx.beginPath(); ctx.arc(-36 + c * 24, -62 + r * 25, 3, 0, TAU); ctx.fill(); }
  } else {
    const g = clamp(o.gold ?? 0);
    ctx.fillStyle = K.lin(ctx, 0, -CH / 2, 0, CH / 2, [[0, mixHex(PAPER76.lit, GOLD.hot, g * .6)], [1, mixHex(PAPER76.body, GOLD.body, g * .5)]]); ctx.beginPath(); ctx.roundRect(-CW / 2, -CH / 2, CW, CH, 12); ctx.fill();
    if (o.draw) o.draw(ctx);
  }
  ctx.restore();
}
// steps for the bet (a18h): reuse the age clock's step geometry; the card hops from step 1 (age 6) to step 3 (age 18)
function jobCards(ctx, t, T) {
  const tH = T.G('So betting on one job'), tI = T.G('But there is a clue', 0, tH), tJ = T.G('Not programmer', 0, tI), tEnd = T.G('The person who helps your father', 0, tJ) - .35;
  const g = (p, after) => T.G(p, 0, after);
  K.bg(ctx, t, { gx: 960, gy: 520, ga: .24, stars: 50 });
  ctx.save(); K.shotCam(ctx, t, { a: tH - .35, b: tEnd, seed: 61 }, { z0: 1.0, z1: 1.05, fx: 960, fy: 520 });
  // a18h: the steps (no counter: this is the bet's road), they sink away when the guess begins
  const stepsU = 1 - sineIO(span(t, tI - .1, tI + 1.1));
  const [s1x, s1y] = K.stepTop(1), [s3x, s3y] = K.stepTop(3);
  if (stepsU > 0) { ctx.save(); ctx.translate(0, (1 - stepsU) * 420); ctx.globalAlpha *= stepsU; K.ageClock(ctx, t, { u: 1, lit: [0, .5 * span(t, tH, tH + .6), 0, .9 * span(t, g('childhood', tH) - .2, g('childhood', tH) + .5), 0], city: .6 }); ctx.restore(); }
  // the card: dealt from where the plane landed (1460/300) onto step 6, a gold token on it, then up the steps, turning at 18
  const deal = sineIO(span(t, tH - .3, g('betting', tH) + .25)), token = expoOut(span(t, g('one job', tH) - .1, g('one job', tH) + .35));
  const up1 = sineIO(span(t, g('find out', tH) - .1, g('find out', tH) + .55)), up2 = sineIO(span(t, g('if you won', tH) - .05, g('if you won', tH) + .55));
  const turn = span(t, g('childhood', tH) + .05, g('childhood', tH) + .6);
  const P1 = [s1x + K.STEP.w / 2, s1y - CH / 2 - 4], P2 = [K.stepTop(2)[0] + K.STEP.w / 2, K.stepTop(2)[1] - CH / 2 - 4], P3 = [s3x + K.STEP.w / 2, s3y - CH / 2 - 4];
  let cx = lerp(1460, P1[0], deal), cy = lerp(300, P1[1], deal) - Math.sin(Math.PI * deal) * 90;
  cx = lerp(cx, P2[0], up1); cy = lerp(cy, P2[1], up1) - Math.sin(Math.PI * up1) * 70;
  cx = lerp(cx, P3[0], up2); cy = lerp(cy, P3[1], up2) - Math.sin(Math.PI * up2) * 70;
  // a18i: to the centre, then clones into three face-down cards
  const toC = sineIO(span(t, tI - .2, tI + 1.0)), clone = expoOut(span(t, g('Take a guess', tI) - .15, g('Take a guess', tI) + .7));
  const C3 = [[640, 540], [960, 540], [1280, 540]];
  cx = lerp(cx, 960, toC); cy = lerp(cy, 540, toC);
  const sc = lerp(1, 1.35, toC), unturn = sineIO(span(t, tI - .2, tI + .5));
  // labels of the bet
  K.cap(ctx, 'BET ON ONE JOB', P1[0], P1[1] - CH / 2 - 40, span(t, g('betting', tH) - .1, g('betting', tH) + .5) * (1 - span(t, g('find out', tH) - .3, g('find out', tH))), { size: 34, align: 'center', col: GOLD.text });
  K.cap(ctx, 'YOU FIND OUT WHEN CHILDHOOD IS OVER', 960, 190, span(t, g('find out', tH) - .1, g('find out', tH) + .6) * (1 - span(t, tI, tI + .4)), { size: 40, align: 'center', col: CREAM });
  // a18j: card 0 PROGRAMMER (turns, slides away), card 1 HOME CARE AIDE (turns, lights gold), card 2 stays down
  const fP = span(t, g('programmer', tJ) - .25, g('programmer', tJ) + .2), away = sineIO(span(t, g('programmer', tJ) + .35, g('programmer', tJ) + 1.1));
  const fH = span(t, g('Home care', tJ) - .3, g('Home care', tJ) + .15), gold = expoOut(span(t, g('Home care', tJ) - .05, g('Home care', tJ) + .7));
  const glint = bump(t, g('clue', tI) - .1, .8);
  if (clone <= 0) {
    jobCard(ctx, t, cx, cy, sc, { flip: turn * (1 - unturn), draw: (c) => { E.glowText(c, '?', 0, 36, { size: 110, serif: true, align: 'center', col: INK, glow: false }); }, rot: Math.sin(t * .8) * .01 });
    if (token > 0 && unturn < 1) { const tx = cx + 22 * sc, ty = lerp(cy - 260, cy - 30 * sc, token); ctx.save(); ctx.globalAlpha *= 1 - unturn; halo(ctx, tx, ty, 50, .45, GOLD.halo, GOLD.core); ctx.fillStyle = K.rad(ctx, tx - 5, ty - 5, 26, [[0, GOLD.hot], [1, GOLD.mid]]); ctx.beginPath(); ctx.ellipse(tx, ty, 22, 22 * lerp(.5, .9, token), 0, 0, TAU); ctx.fill(); ctx.restore(); }
  } else {
    // the shell game: three swaps after the deal (face down, identical backs: the eye can't follow, nor should it)
    const tg = g('Take a guess', tI) + .75, SW = [[0, 2], [0, 1], [1, 2]];
    const off = [[0, 0], [0, 0], [0, 0]];
    SW.forEach(([a, b], k) => { const e = sineIO(span(t, tg + k * .75, tg + k * .75 + .7)); if (e <= 0 || e >= 1) return; const d = C3[b][0] - C3[a][0], arc = Math.sin(Math.PI * e) * 70; off[a] = [d * e, -arc]; off[b] = [-d * e, arc]; });
    C3.forEach(([x0, y0], i) => {
      const x = x0 + off[i][0], y = y0 + off[i][1];
      const e = i === 1 ? 1 : clone, xx = lerp(960, x, e), hover = bump(t, g('Take a guess', tI) + .5 + i * .18, .6) * 14;
      if (i === 0) {   // PROGRAMMER: turns, then slides away down-left and sinks
        jobCard(ctx, t, xx - away * 260, y - hover + away * 200, 1.35 * (1 - .25 * away), { flip: fP, a: 1 - away, rot: -away * .35, draw: (c) => { E.glowText(c, '</>', 0, -14, { size: 54, weight: 600, align: 'center', col: rgba(INK, .55), glow: false }); E.glowText(c, 'PROGRAMMER', 0, 62, { size: 18, weight: 600, align: 'center', col: INK, glow: false }); } });
      } else if (i === 1) {
        const lift = lerp(1.35, 1.6, gold);
        jobCard(ctx, t, xx, y - hover - 30 * gold, lift, { flip: fH, gold: fH > .5 ? gold : 0, glint, draw: (c) => {
          // two figures: a helper's arm under an older person's arm (flat icon in deep gold ink)
          c.fillStyle = rgba(GOLD.deep, .9); c.beginPath(); c.arc(-22, -50, 13, 0, TAU); c.fill(); c.beginPath(); c.arc(24, -42, 12, 0, TAU); c.fill();
          c.beginPath(); c.roundRect(-36, -34, 28, 54, 10); c.fill(); c.beginPath(); c.roundRect(12, -28, 26, 50, 10); c.fill();
          c.fillRect(-12, -14, 30, 7);
          E.glowText(c, 'HOME CARE', 0, 50, { size: 18, weight: 600, align: 'center', col: INK, glow: false }); E.glowText(c, 'AIDE', 0, 74, { size: 18, weight: 600, align: 'center', col: INK, glow: false }); } });
      } else jobCard(ctx, t, xx, y - hover, 1.35, { a: 1 - .45 * gold });
    });
  }
  K.cap(ctx, 'MOST NEW JOBS IN AMERICA BY 2035?', 960, 200, span(t, g('Which job', tI) - .1, g('Which job', tI) + .6), { size: 44, align: 'center', col: CREAM });
  const sx = 960, sy = 870;
  K.cap(ctx, 'HOME CARE AIDES', sx, 830, span(t, g('Home care', tJ) + .05, g('Home care', tJ) + .6), { size: 36, align: 'center', col: GOLD.text, glow: true });
  ctx.restore();
  return { cx, cy, sy };
}

// ================================================================================================================ AGE 18 · classroom (a18f, a18g)
// a classroom in England from the back: two rows of pupils (indigo children), each laptop shows lines of code (cream, typed by hand).
const ROWS = [{ y: 600, h: 150, xs: [660, 960, 1260] }, { y: 840, h: 210, xs: [480, 800, 1120, 1440] }];
const CODE = [[.7, 0], [.45, 1], [.8, 1], [.35, 2], [.6, 1], [.5, 0]];   // [length, indent] per code line
function codeLines(ctx, x, y, w, lh, n, u, col, o = {}) {   // n lines, typed with u (0..1 per whole block)
  for (let i = 0; i < n; i++) {
    const [len, ind] = CODE[i % CODE.length], k = clamp(u * n - i); if (k <= 0) break;
    ctx.fillStyle = typeof col === 'function' ? col(i) : col; ctx.fillRect(x + ind * w * .08, y + i * lh, (w * len - ind * w * .08) * k, lh * .45);
  }
}
function classroom(ctx, t, T) {
  const tF = T.G('His warning comes from'), tG = T.G('Today, writing code', 0, tF), tEnd = T.G('So betting on one job', 0, tG) - .35;
  const g = (p, after) => T.G(p, 0, after);
  const today = sineIO(span(t, tG - .2, tG + .8));
  K.bg(ctx, t, { gx: lerp(960, 1300, today), gy: 480, ga: .3, stars: 30 });
  ctx.save(); K.shotCam(ctx, t, { a: tF - .35, b: tEnd, seed: 59 }, { z0: 1.0, z1: 1.05, fx: lerp(960, 1100, today), fy: 560 });
  // the back wall: a long window band (night), the room floor
  ctx.fillStyle = K.lin(ctx, 0, 200, 0, 660, [[0, '#0d1440'], [1, '#141d52']]); ctx.fillRect(-200, 180, W + 400, 480);
  ctx.fillStyle = K.lin(ctx, 0, 318, 0, 430, [[0, K.SKY.mid], [1, K.SKY.low]]); ctx.fillRect(220, 318, 1480, 112);
  E.stars(ctx, 81, 30, t, [220, 318, 1480, 80], .5);
  ctx.fillStyle = '#0d1440'; for (let i = 1; i < 6; i++) ctx.fillRect(220 + i * 1480 / 6 - 5, 318, 10, 112);
  ground(ctx, 640, 960, .1);
  const pu = span(t, tF - .3, tF + 1.2), typeU = (r, i) => span(t, g('coding', tF) - .6 + i * .15 + r * .2, g('coding', tF) + 2.2 + i * .2 + r * .2);
  const dimRoom = .35 * today;
  ROWS.forEach((row, r) => row.xs.forEach((x, i) => {
    // reveal outward from the centre pupil of the far row (the plane's landing point)
    const d = Math.abs(x - 960) / 900 + r * .25, e = rise(span(pu, d * .6, d * .6 + .45)); if (e <= 0) return;
    ctx.save(); ctx.globalAlpha *= e * (1 - dimRoom);
    const y = row.y + (1 - e) * 14, h = row.h;
    // laptop (screen facing us, behind the pupil's head) and the desk
    const sw = h * .62, sh = h * .4, sx = x - sw / 2, sy = y - h * 1.05;
    ctx.fillStyle = '#1b2147'; ctx.beginPath(); ctx.roundRect(sx - 4, sy - 4, sw + 8, sh + 8, 5); ctx.fill();
    ctx.fillStyle = '#0b1236'; ctx.fillRect(sx, sy, sw, sh);
    codeLines(ctx, sx + sw * .08, sy + sh * .14, sw * .84, sh * .14, 6, typeU(r, i), (k) => (k % 3 === 1 ? rgba(GOLD.line, .85) : rgba(PAPER76.lit, .8)));
    ctx.fillStyle = K.lin(ctx, 0, y - h * .6, 0, y - h * .5, [[0, '#2c2440'], [1, '#1a1533']]); ctx.fillRect(x - h * .7, y - h * .62, h * 1.4, h * .12);
    halo(ctx, x, sy + sh / 2, sw * .9, .12 * e, '#5a6ab8', '#8a9ae0');
    E.person(ctx, x, y, h, { head: 1.3, view: 'back', look: .05, light: .6, rim: mixHex(P.blue0, CREAM, .35), armR: [.6, 1.4], armL: [-.6, -1.4] });
    ctx.restore();
  }));
  // tags: ENGLAND (on "own country"), CODING + THE SKILL OF THE FUTURE, the curriculum line (faktencheck 25.11.)
  const out = 1 - span(t, tG - .2, tG + .3);
  K.cap(ctx, 'ENGLAND', 960, 118, span(t, g('own country', tF) - .2, g('own country', tF) + .5) * out, { size: 34, align: 'center', col: GOLD.text, glow: true });
  K.big(ctx, 'Coding', 960, 206, 84, span(t, g('coding', tF) - .1, g('coding', tF) + .5) * out);
  K.cap(ctx, 'THE SKILL OF THE FUTURE', 960, 250, span(t, g('skill of the future', tF) - .1, g('skill of the future', tF) + .5) * out, { size: 28, align: 'center', col: CREAM });
  K.cap(ctx, 'CURRICULUM 2013 · TAUGHT FROM 2014 · AGE 5–16', 960, 292, span(t, g('required school', tF) - .1, g('required school', tF) + .6) * out, { size: 24, align: 'center', col: MUTED });
  K.src(ctx, t, g('More than ten', tF), tG + .4, 'GOV.UK · NATIONAL CURRICULUM IN ENGLAND: COMPUTING · PUBLISHED SEP 2013');
  // a18g: the chip comes down at the right and pours a whole page of the same code lines in a blink (cyan: the machine's own light)
  const chU = expoOut(span(t, tG - .3, tG + .5)), cxp = 1500, cyp = lerp(120, 300, chU);
  if (chU > 0) {
    const pg = span(t, g('writing code', tG) - .05, g('writing code', tG) + .45), pageH = 520 * expoOut(pg);
    if (pageH > 2) {
      ctx.save(); halo(ctx, cxp, cyp + 60 + pageH / 2, 340, .18, MACH.heart, MACH.heartCore);
      ctx.fillStyle = K.lin(ctx, 0, cyp + 60, 0, cyp + 60 + pageH, [[0, '#132a5a'], [1, '#0d1c48']]); ctx.beginPath(); ctx.roundRect(cxp - 170, cyp + 60, 340, pageH, 6); ctx.fill();
      ctx.beginPath(); ctx.rect(cxp - 170, cyp + 60, 340, pageH); ctx.clip();
      codeLines(ctx, cxp - 145, cyp + 84, 290, 22, 22, 1, (k) => (k % 3 === 1 ? rgba(MACH.heartCore, .95) : rgba(MACH.heart, .75)));
      ctx.restore();
    }
    K.chip(ctx, t, cxp, cyp, 40 * chU + 1, { lit: 1, think: .6, rays: .4 * chU });
  }
  K.cap(ctx, 'TODAY: WHAT MACHINES DO BEST', 960, 160, span(t, g('do best', tG) - .9, g('do best', tG) - .2), { size: 34, align: 'center', col: MACH.heartCore, glow: true });
  ctx.restore();
}

// ================================================================================================================ the shots
export default {
  // ---------------------------------------------------------------- a12a AGE 12 · 2038: step 3 lights, the twelve-year-old rises there
  a12a(ctx, t, S, T) {
    K.bg(ctx, t, { gx: 980, gy: 560, ga: .26, stars: 60 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.035, fx: 980, fy: 640 });
    const R = ageStep(ctx, t, S, T, { i: 2, age: 12, year: 2038, from: [6, 2032], pAge: 'Twelve', pYear: 'Twenty thirty' });
    // the companion light of a6m is still with the child: it lifts from the child's hands to where the plane leaves (S.out)
    const k = span(t, S.b - 1.25, S.b - .5), hx = R.kx + 18, hy = R.ky - R.h * .52;
    const x = lerp(hx, S.out[0], sineIO(k)), y = lerp(hy, S.out[1], sineIO(k)) - Math.sin(Math.PI * k) * 40, a = span(t, S.a + .6, S.a + 1.2);
    if (a > 0) { halo(ctx, x, y, 60, .4 * a, MACH.heart, MACH.heartCore); ctx.fillStyle = rgba(MACH.heartCore, .9 * a); ctx.beginPath(); ctx.arc(x, y, 6, 0, TAU); ctx.fill(); }
    ctx.restore();
  },
  // ---------------------------------------------------------------- a12b the friend in the device: always awake, never moody, needs nothing
  a12b(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    // the room at night: wall, a window with the city (its lights go out: the city sleeps, the friend stays awake), floor, a bed
    ctx.fillStyle = K.lin(ctx, 0, 0, 0, H, [[0, '#0a0f30'], [1, '#070a22']]); ctx.fillRect(0, 0, W, H);
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.03, z1: 1.08, fx: 1240, fy: 520 });
    const wx = 1440, wy = 150, ww = 360, wh = 330, sleep = span(t, G('always awake') - .2, G('always awake') + 1.6);
    ctx.fillStyle = K.lin(ctx, 0, wy, 0, wy + wh, [[0, K.SKY.top], [1, K.SKY.mid]]); ctx.fillRect(wx, wy, ww, wh);
    E.stars(ctx, 121, 22, t, [wx, wy, ww, wh * .5], .6);
    const r = K.prng(1212); for (let i = 0; i < 7; i++) { const bx = wx + i * 52, bh = 60 + r() * 130; ctx.fillStyle = mixHex(P.ind0, P.night1, .5); ctx.fillRect(bx, wy + wh - bh, 48, bh); for (let k = 0; k < 6; k++) { const q = r(); if (q < .55) { const off = clamp((sleep - q * 1.4) * 3); ctx.fillStyle = rgba(K.WIN.lit, .7 * (1 - off)); ctx.fillRect(bx + 8 + (k % 3) * 13, wy + wh - bh + 12 + Math.floor(k / 3) * 22, 5, 7); } } }
    ctx.fillStyle = '#0a0f30'; ctx.fillRect(wx + ww / 2 - 5, wy, 10, wh); ctx.strokeStyle = '#1c2766'; ctx.lineWidth = 14; ctx.strokeRect(wx - 7, wy - 7, ww + 14, wh + 14);
    ctx.fillStyle = '#0c1132'; ctx.fillRect(-200, 860, W + 400, 400);
    ctx.fillStyle = '#141a46'; ctx.beginPath(); ctx.roundRect(1480, 740, 520, 130, 16); ctx.fill(); ctx.fillStyle = '#1c2456'; ctx.beginPath(); ctx.roundRect(1500, 712, 180, 50, 22); ctx.fill();
    // the friend: a soft cyan glow over the device (no face), it breathes evenly ("never in a bad mood")
    const fx = 1300, fy = 500, born = expoOut(IN(.7)), even = .5 + .5 * Math.sin(t * 1.6);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = K.rad(ctx, fx, fy + 260, 520, [[0, rgba(MACH.heart, .16 * born)], [1, rgba(MACH.heart, 0)]]); ctx.fillRect(700, 300, 1200, 700); ctx.restore();
    // the twelve-year-old (your child), side view, holding the device up
    const hands = K.kid(ctx, 1150, 862, 390, { age: 12, dir: 1, view: 'side', look: .25, lean: .02, light: 1, armR: [1.25, 1.65], armL: [1.05, 1.75] });
    phone(ctx, hands.R[0] + 4, hands.R[1] - 30, 64, 1, { rot: -.25 });
    halo(ctx, fx, fy, 150 * born * (1 + .05 * even), .5 * born, MACH.heart, MACH.heartCore);
    ctx.fillStyle = K.rad(ctx, fx, fy, 34 * born, [[0, rgba('#ffffff', .95)], [.5, rgba(MACH.heartCore, .8)], [1, rgba(MACH.heart, 0)]]); ctx.beginPath(); ctx.arc(fx, fy, 34 * born + 1, 0, TAU); ctx.fill();
    // the three traits on their words (the machine's colour)
    tagAt(ctx, 'ALWAYS AWAKE', 700, 320, U('always awake', .6, -.15), MACH.heartCore);
    tagAt(ctx, 'NEVER IN A BAD MOOD', 700, 410, U('never in a bad', .6, -.15), MACH.heartCore);
    tagAt(ctx, 'NEVER NEEDS ANYTHING BACK', 700, 500, U('never needs', .6, -.15), MACH.heartCore);
    // a thin cyan thread from the glow to each tag as it lands (the traits belong to it)
    for (const [p, y] of [['always awake', 320], ['never in a bad', 410], ['never needs', 500]]) { const u = U(p, .5, -.1); if (u > 0) K.lightLine(ctx, [[fx - 40, fy], [lerp(fx - 40, 980, expoOut(u)), lerp(fy, y - 8, expoOut(u))]], 0, 1, CYAN, { w: 1.2, a: .45 * u }); }
    ctx.restore();
  },
  // ---------------------------------------------------------------- a12c the glow bright on one side, real people small and dim on the other
  a12c(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 640, gy: 420, ga: .3, gcol: '#1a4a7a', stars: 40 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.05, fx: 900, fy: 560 });
    ground(ctx, 862, 700, .0);
    const born = expoOut(IN(.8)), q = span(t, G('why would') - .3, G('people') + .4);
    // the companion glow (left), big and bright; its light falls on the child
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = K.rad(ctx, 700, 420, 900, [[0, rgba(MACH.heart, .22 * born)], [1, rgba(MACH.heart, 0)]]); ctx.fillRect(0, 0, W, H); ctx.restore();
    halo(ctx, 700, 400, 260 * born, .6 * born, MACH.heart, MACH.heartCore);
    ctx.fillStyle = K.rad(ctx, 700, 400, 60 * born + 1, [[0, rgba('#ffffff', .95)], [.5, rgba(MACH.heartCore, .8)], [1, rgba(MACH.heart, 0)]]); ctx.beginPath(); ctx.arc(700, 400, 60 * born + 1, 0, TAU); ctx.fill();
    // the child between, turned toward the glow, its back to the people
    K.kid(ctx, 1000, 862, 360, { age: 12, dir: -1, view: 'side', look: .35, light: -1, armR: [.15, .1], armL: [-.1, -.05] });
    // real people: small, dim, far on the right (indigo)
    const pu = span(t, S.a + .2, G('bother') + .2);
    K.figRow(ctx, t, 1380, 840, 4, 105, 180, pu, (i) => ({ dim: .55, look: .1, dir: -1 }));
    K.cap(ctx, 'PEOPLE', 1537, 900 - 50 + 20, span(pu, .4, 1) * .9, { size: 22, align: 'center', col: MUTED });
    K.cap(ctx, 'THE FRIEND IN THE DEVICE', 700, 640, span(t, S.a + .3, S.a + 1.0), { size: 22, align: 'center', col: MACH.heartCore });
    K.serif(ctx, 'Why bother with people?', 960, 300, 72, q, { align: 'center', col: CREAM });
    ctx.restore();
  },
  // ---------------------------------------------------------------- a12d · a12e · a12f the teens (one picture, three sentences)
  a12d(ctx, t, S, T) { teens(ctx, t, T); },
  a12e(ctx, t, S, T) { teens(ctx, t, T); },
  a12f(ctx, t, S, T) { teens(ctx, t, T); },
  // ---------------------------------------------------------------- a12g a real friend: disagrees, gets hurt, expects you to show up
  a12g(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 1400, gy: 560, ga: .2, stars: 60 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.05, fx: 1000, fy: 640 });
    // the schoolyard at dusk: a fence across the back, a lamp post (the hero light), the yard
    ctx.fillStyle = rgba('#1c2766', .9); for (let x = -40; x < W + 60; x += 46) ctx.fillRect(x, 612, 6, 160); ctx.fillRect(-40, 626, W + 80, 6); ctx.fillRect(-40, 700, W + 80, 5);
    ground(ctx, 770, 1060, .16);
    const lamp = expoOut(IN(.6));
    ctx.fillStyle = '#0b1030'; ctx.fillRect(1397, 640, 7, 230);
    halo(ctx, 1400, 640, 160 * lamp, .55 * lamp, GOLD.halo, GOLD.core); ctx.fillStyle = rgba(GOLD.hot, lamp); ctx.beginPath(); ctx.arc(1400, 640, 12, 0, TAU); ctx.fill();
    // the two: your child (yellow coat) and a friend (indigo)
    const dis = G('disagrees'), hurt = G('gets hurt'), show = G('expects you'), up = G('show up');
    const argue = bump(t, dis - .2, 1.2), away = sineIO(span(t, hurt - .15, hurt + .45)), back = sineIO(span(t, show + .1, show + .7)), walk = span(t, show - .1, up + .3);
    const kx = lerp(830, 880, sineIO(walk)), fxx = lerp(1080, 1150, away) - 110 * back;
    K.kid(ctx, kx, 870, 380, { age: 12, dir: 1, view: 'side', look: .3 + .1 * argue, lean: .06 * argue, light: 1, armR: [lerp(.2, 1.4, argue), lerp(.1, 1.7, argue)], armL: [-.15, -.1] });
    const turnK = away * (1 - back);
    turnAbout(ctx, fxx, turnK, (side) => E.person(ctx, fxx, 870, 370, { head: 1.18, view: 'side', dir: side ? 1 : -1, look: side ? -.35 : .3 + .1 * argue, lean: side ? .12 : .05 * argue, light: .7, armR: [lerp(.2, 1.2, argue * (1 - away)), lerp(.1, 1.6, argue * (1 - away))], armL: [-.15, -.1] }));
    // friction marks between the heads while they argue (short cream strokes), a warm light when you show up
    if (argue > 0) { ctx.save(); ctx.globalAlpha *= argue; ctx.strokeStyle = rgba(CREAM, .8); ctx.lineWidth = 3; ctx.lineCap = 'round'; for (let i = 0; i < 4; i++) { const a = -1.2 + i * .8 + Math.sin(t * 7 + i) * .15, r0 = 18, r1 = 36; ctx.beginPath(); ctx.moveTo(955 + Math.cos(a) * r0, 520 + Math.sin(a) * r0); ctx.lineTo(955 + Math.cos(a) * r1, 520 + Math.sin(a) * r1); ctx.stroke(); } ctx.restore(); }
    const warm = sineIO(span(t, up - .1, up + .7)); if (warm > 0) halo(ctx, 960, 560, 220 * warm, .4 * warm, GOLD.halo, GOLD.core);
    tagAt(ctx, 'DISAGREES', 520, 260, U('disagrees', .6, -.15), CREAM, 30);
    tagAt(ctx, 'GETS HURT', 960, 260, U('gets hurt', .6, -.15), CREAM, 30);
    tagAt(ctx, 'EXPECTS YOU TO SHOW UP', 1400, 260, U('expects you', .6, -.15), GOLD.text, 30);
    ctx.restore();
  },
  // ---------------------------------------------------------------- a12h friction → three gold words: to wait · to say sorry · to be counted on
  a12h(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 520, ga: .24, gcol: '#3a3a5a', stars: 50 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.02, z1: 1.0, fx: 960, fy: 560 });
    ground(ctx, 862, 960, .12);
    K.kid(ctx, 800, 880, 400, { age: 12, dir: 1, view: 'side', look: .25, light: 1, armR: [.2, .1] });
    E.person(ctx, 1120, 880, 390, { head: 1.18, view: 'side', dir: -1, look: .25, light: .7, armR: [.2, .1] });
    // the friction: small sparks flicker between them (born where the plane landed)
    const fr = G('friction'), core = [960, 570], cu = expoOut(IN(.5));
    halo(ctx, core[0], core[1], 70 * cu, .45 * cu, GOLD.halo, GOLD.core);
    const r = K.prng(S.seed);
    for (let i = 0; i < 12; i++) { const ph = (t * (1.6 + r()) + r()) % 1, a = r() * TAU, d = 14 + ph * (40 + r() * 30), f = span(t, fr - .3, fr + .3) * Math.sin(Math.PI * ph); if (f <= 0) continue; ctx.fillStyle = rgba(GOLD.hot, .9 * f); ctx.beginPath(); ctx.arc(core[0] + Math.cos(a) * d, core[1] + Math.sin(a) * d, 2.4, 0, TAU); ctx.fill(); }
    ctx.fillStyle = rgba(GOLD.hot, cu); ctx.beginPath(); ctx.arc(core[0], core[1], 7, 0, TAU); ctx.fill();
    // each spark flies up and becomes a word on its word
    const WORDS = [['To wait', 'to wait', 470, 400], ['To say sorry', 'say sorry', 960, 300], ['To be counted on', 'counted on', 1440, 400]];
    for (const [s, p, x, y] of WORDS) {
      const tp = G(p), fl = span(t, tp - .55, tp - .05);
      if (fl > 0 && fl < 1) { const q = sineIO(fl), px = lerp(core[0], x, q), py = lerp(core[1], y - 20, q) - Math.sin(Math.PI * q) * 60; halo(ctx, px, py, 40, .6, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(px, py, 5, 0, TAU); ctx.fill(); }
      K.big(ctx, s, x, y, 76, span(t, tp - .1, tp + .5));
    }
    K.cap(ctx, 'WHERE A CHILD LEARNS', 960, 170, U('That friction', .7, 0), { size: 26, align: 'center', col: MUTED });
    ctx.restore();
  },
  // ---------------------------------------------------------------- a12i what a superintelligence can do (homework) and can't do for them
  a12i(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 460, ga: .24, stars: 40 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.04, fx: 960, fy: 480 });
    // the line between the two columns grows from where the plane landed
    const lu = expoOut(IN(.9)), lx = 960, ly = 560;
    ctx.fillStyle = rgba(CREAM, .55); ctx.fillRect(lx - 1.5, lerp(ly, 170, lu), 3, lerp(0, 650, lu));
    K.cap(ctx, 'CAN', 560, 190, U('superintelligence can', .7, -.2), { size: 34, align: 'center', col: MACH.heartCore, glow: true });
    K.cap(ctx, "CAN'T DO FOR THEM", 1360, 190, U("can't do", .7, -.15), { size: 34, align: 'center', col: GOLD.text, glow: true });
    // the chip (left) and the homework: its light does the sheet in a blink
    const chipU = expoOut(U('superintelligence', .7, -.3)), cx = 380, cy = 330;
    K.chip(ctx, t, cx, cy, 44 * chipU + 1, { lit: 1, think: .5, rays: .3 });
    const hw = G('homework'), sheet = rise(U("child's homework", .9, -.5)), done = span(t, hw - .05, hw + .35);
    if (sheet > 0) {
      const se = expoOut(sheet), sx = lerp(cx + 60, 640, se), sy = lerp(cy + 40, 520, se);   // the sheet slides out of the chip's light
      ctx.save(); ctx.globalAlpha *= sineIO(sheet); ctx.translate(sx, sy); ctx.scale(lerp(.35, 1, se), lerp(.35, 1, se)); ctx.translate(-sx, -sy);
      K.paperCard(ctx, t, sx - 150, sy - 120, 300, 240, { u: 1, head: 'HOMEWORK' }); ctx.restore();
      ctx.save(); ctx.globalAlpha *= sheet; codeLines(ctx, sx - 116, sy - 40, 232, 26, 5, done, rgba(MACH.heartDeep, .85)); ctx.restore();
      if (done > 0) K.lightLine(ctx, [[cx + 40, cy + 20], [sx - 60, sy - 40]], 0, 1, CYAN, { w: 2, a: .6 * (1 - span(t, hw + .4, hw + 1)) });
      const tk = span(t, hw + .3, hw + .7);   // a small tick, drawn by the machine's light
      if (tk > 0) K.lightLine(ctx, [[sx + 90, sy + 70], [sx + 106, sy + 88], [sx + 138, sy + 48]], 0, sineIO(tk), CYAN, { w: 3.5 });
    }
    // the three things from the friction (gold), and the chip's light that stops at the line
    [['WAIT', 'any of that', 0], ['SAY SORRY', 'any of that', .25], ['BE COUNTED ON', 'any of that', .5]].forEach(([s, p, d], i) => K.big(ctx, s, 1360, 360 + i * 100, 50, U(p, .6, d - .2)));
    const fu = span(t, G('for them') - .35, G('for them') + .25), hit = [lx - 2, 450];
    if (fu > 0) {
      K.lightLine(ctx, [[cx + 44, cy + 14], hit], 0, expoOut(fu), CYAN, { w: 3, head: true });
      if (fu >= 1) { const sp = .5 + .5 * Math.sin(t * 9); halo(ctx, hit[0], hit[1], 60 + 10 * sp, .5, MACH.heart, MACH.heartCore); ctx.fillStyle = rgba(MACH.heartCore, .9); ctx.fillRect(hit[0] - 2, hit[1] - 40, 4, 80); }
    }
    ctx.restore();
  },
  // ---------------------------------------------------------------- a12j the seesaw: a heap of cheap answers vs one handshake
  a12j(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 480, ga: .26, gcol: '#3a3a5a', stars: 50 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.04, fx: 960, fy: 520 });
    const px = 960, py = 520, L = 430;
    // the ground under the seesaw (where the plane leaves: S.out 960/640)
    ground(ctx, 646, 960, .12);
    const heap = span(t, G('answers cheap') - .5, G('answers cheap') + 1.3), hand = expoOut(span(t, G('scarce') - .3, G('scarce') + .5)), tr = G('trust');
    const tilt = lerp(0, -.1, sineIO(heap)) + (.32) * expoOut(span(t, tr - .15, tr + .55)) - .02 * bump(t, tr - .4, .35);
    // the chip pours the answers (cheap: many, fast)
    const chU = expoOut(span(t, G('machines make') - .4, G('machines make') + .3)) * (1 - span(t, tr + .5, tr + 1.2) * .6);
    if (chU > 0) K.chip(ctx, t, 330, 230, 34 * chU + 1, { lit: 1, think: .6, a: chU });
    const N = 16, SL = [];
    for (let i = 0; i < N; i++) { const row = i < 6 ? 0 : i < 11 ? 1 : i < 14 ? 2 : 3, inRow = [0, 6, 11, 14][row], k = i - inRow, n = [6, 5, 3, 2][row]; SL.push([-L + 60 + (k - (n - 1) / 2) * 40 + (row % 2) * 4 + 90, -18 - row * 24, (i * 1.7 % 1 - .5) * .3]); }
    const R = K.seesaw(ctx, t, px, py, L, tilt, {
      left(c, ex, ey, ang) {
        SL.forEach(([lx, ly, rr], i) => {
          const tl = span(heap, i / N * .8, i / N * .8 + .2); if (tl <= 0) return;
          const cs = Math.cos(ang), sn = Math.sin(ang), tx = px + (lx * cs - ly * sn), ty = py - 12 + (lx * sn + ly * cs);
          const q = expoIn(tl), x = lerp(360, tx, q), y = lerp(270, ty, q);
          answerSlip(c, x, y, lerp(.6, ang + rr, q), 1);
        });
      },
      right(c, ex, ey, ang) { if (hand > 0) handshake(c, t, ex - 30, lerp(ey - 380, ey - 56, hand), 1.3, { a: clamp(hand * 3), glow: span(t, tr, tr + .8) }); },
    });
    K.cap(ctx, 'SOME ECONOMISTS EXPECT A SHIFT', 960, 160, U('Some economists', .7, -.1), { size: 30, align: 'center', col: CREAM });
    if (R) {
      K.cap(ctx, 'CHEAP ANSWERS', R.l[0] + 40, R.l[1] + 70, span(heap, .3, .8), { size: 24, align: 'center', col: MACH.heartCore });
      K.cap(ctx, 'A PERSON YOU CAN TRUST', R.r[0] - 30, Math.min(800, R.r[1] + 90), span(t, tr - .1, tr + .6), { size: 30, align: 'center', col: GOLD.text, glow: true });
    }
    K.src(ctx, t, G('Some economists'), S.b + 1, 'ALEX IMAS (CHICAGO BOOTH, NOW GOOGLE DEEPMIND) · DANIEL SUSSKIND · 2026');
    ctx.restore();
  },
  // ---------------------------------------------------------------- m1 every child lifted (not a lucky few) · the mission · subscribe
  m1(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    const few = sineIO(span(t, S.a + .1, G('shift like') + .5)), every = sineIO(span(t, G('every child') - .4, G('every child') + .9));
    K.bg(ctx, t, { gx: 960, gy: 640, ga: .2 + .12 * every, gcol: mixHex(P.blue0, '#5a4a2a', every), stars: 70 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.05, fx: 960, fy: 560 });
    ground(ctx, 790, 960, .06);
    // the floor of light: narrow under a lucky few first, then wide under every child; it lifts them
    const fw = lerp(lerp(0, 360, few), 1640, every), lift = lerp(46 * few, 92, every), fy = 790 - lift;
    if (fw > 2) {
      halo(ctx, 960, fy + 10, fw * .5, .26, GOLD.halo, GOLD.core);
      ctx.fillStyle = K.lin(ctx, 0, fy, 0, fy + 30, [[0, GOLD.hot], [.3, GOLD.body], [1, rgba(GOLD.mid, 0)]]); ctx.beginPath(); ctx.roundRect(960 - fw / 2, fy, fw, 26, 10); ctx.fill();
      ctx.fillStyle = rgba(GOLD.body, .12); ctx.fillRect(960 - fw / 2, fy + 24, fw, lift);
    }
    // the children: 13 across (indigo), yours in the middle (yellow coat); on the floor where it reaches them
    const N = 13;
    for (let i = 0; i < N; i++) {
      const x = 960 + (i - 6) * 118, onFloor = Math.abs(x - 960) < fw / 2 - 20 ? 1 : 0, base = onFloor ? fy + 2 : 790, e = rise(span(IN(1.4), Math.abs(i - 6) * .07, Math.abs(i - 6) * .07 + .4));
      if (e <= 0) continue;
      const hh = 170 + ((i * 37) % 5) * 10, bob = Math.sin(t * 1.4 + i) * 1.2;
      ctx.save(); ctx.globalAlpha *= e * (onFloor ? 1 : .6);
      if (i === 6) K.kid(ctx, x, base + bob, hh + 20, { age: 10, look: .6, light: 1, back: .3 });
      else E.person(ctx, x, base + bob, hh, { head: 1.3, look: .5, light: .7, dir: i < 6 ? 1 : -1, rim: onFloor ? mixHex(P.blue0, GOLD.line, .7) : undefined });
      ctx.restore();
    }
    K.cap(ctx, 'EVERY CHILD', 960, 380, U('every child', .7, -.1) * (1 - span(t, G('This channel') - .3, G('This channel') + .2)), { size: 44, align: 'center', col: GOLD.text, glow: true });
    K.cap(ctx, 'NOT JUST A LUCKY FEW', 960, 440, U('lucky few', .7, -.15) * (1 - span(t, G('This channel') - .3, G('This channel') + .2)), { size: 26, align: 'center', col: CREAM });
    // the mission: why this channel exists
    K.cap(ctx, 'WHY THIS CHANNEL EXISTS', 960, 150, U('This channel', .7, -.1), { size: 24, align: 'center', col: MUTED });
    K.cap(ctx, 'THE ARRIVAL OF SUPERINTELLIGENCE', 960, 220, U('arrival', .7, -.2), { size: 30, align: 'center', col: CREAM });
    K.cap(ctx, 'GOES WELL FOR EVERYBODY', 960, 295, U('goes well', .8, -.25), { size: 50, align: 'center', col: GOLD.text, glow: true });
    // the subscribe button of light: a light rises from the floor's centre and opens into the button; it fills on "subscribe"
    const bt = G('Want that'), rise1 = span(t, bt - .3, bt + .5), open = expoOut(span(t, bt + .2, bt + .8)), press = G('subscribe'), fill = span(t, press - .1, press + .35), squash = bump(t, press - .1, .3);
    if (rise1 > 0 && open < 1) { const q = sineIO(rise1), y = lerp(fy, 410, q); halo(ctx, 960, y, 50, .5 * (1 - open), GOLD.halo, GOLD.core); ctx.fillStyle = rgba(GOLD.hot, 1 - open); ctx.beginPath(); ctx.arc(960, y, 8, 0, TAU); ctx.fill(); }
    if (open > 0) {
      const bw = 340 * open * (1 - .04 * squash), bh = 84 * (1 - .06 * squash), bx = 960 - bw / 2, by = 410 - bh / 2;
      halo(ctx, 960, 410, 220, .25 + .25 * fill, GOLD.halo, GOLD.core);
      ctx.fillStyle = rgba(GOLD.body, .14 + .76 * fill); ctx.strokeStyle = rgba(GOLD.line, .95); ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, bh / 2); ctx.fill(); ctx.stroke();
      if (open > .6) E.glowText(ctx, 'SUBSCRIBE', 960, 422, { size: 32, weight: 600, align: 'center', col: mixHex(GOLD.text, INK, fill), glow: false, spacing: .12, a: span(open, .6, 1) });
    }
    ctx.restore();
  },
  // ---------------------------------------------------------------- a18a trust becomes more valuable · can trust pay the rent?
  a18a(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 440, ga: .26, gcol: '#3a3a5a', stars: 50 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.02, z1: 1.0, fx: 960, fy: 520 });
    const px = 960, py = 640, L = 400;
    ground(ctx, 766, 960, .1);
    const born = expoOut(IN(.7)), val = sineIO(span(t, G('more valuable') - .3, G('valuable') + .5));
    const tb = G('But can trust'), down = sineIO(span(t, tb - .2, tb + .7)), seeU = expoOut(span(t, tb - .5, tb + .3)), rent = G('rent'), hit = span(t, rent - .25, rent + .1);
    // the seesaw grows from its pivot; the handshake comes down onto the right end; RENT lands on the left; it wobbles, undecided
    // the house lands at rent − .05: the beam swings over in ~.2 s (impact), then a damped wobble, undecided
    const land = rent - .05, after = Math.max(0, t - land), wob = -.12 * Math.exp(-after * 1.6) * Math.cos(after * 5.5) - .03;
    const tilt = lerp(.18 * down, wob, expoOut(span(t, land, land + .22)));
    let ends = null;
    if (seeU > 0) { ctx.save(); ctx.globalAlpha *= clamp(seeU * 2); ends = K.seesaw(ctx, t, px, py, L * seeU + 1, tilt, {}); ctx.restore(); }
    const hx = ends ? lerp(960, ends.r[0], down) : 960, hy = ends ? lerp(lerp(400, 330, val), ends.r[1] - 46, down) : lerp(400, 330, val);
    handshake(ctx, t, hx, hy, lerp(1.0, 1.35, val) * born * lerp(1, .6, down), { glow: val * (1 - down) });
    if (val > 0) { const ru = val * (1 - down); if (ru > 0) K.lightLine(ctx, [[960, 560], [960, lerp(560, 420, ru)]], 0, 1, GOLDC, { w: 3, arrow: true, a: ru }); }
    K.cap(ctx, 'MORE VALUABLE', 960, 220, U('more valuable', .7, -.25) * (1 - span(t, tb + .2, tb + .6)), { size: 38, align: 'center', col: GOLD.text, glow: true });
    if (ends) { const hu = span(t, rent - .55, rent - .05), hx2 = ends.l[0] + 20, hy2 = lerp(-120, ends.l[1] - 8, expoIn(hu)); if (hu > 0) rentHouse(ctx, hx2, hy2, 120, 1, t >= land ? tilt : 0); }
    K.cap(ctx, 'CAN TRUST PAY THE RENT?', 960, 300, span(t, G('pay the rent') - .2, G('pay the rent') + .5), { size: 40, align: 'center', col: CREAM });
    ctx.restore();
  },
  // ---------------------------------------------------------------- a18b AGE 18 · 2044 → the kitchen table again, the child as tall as you
  a18b(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    const head = [1180, 457], push = sineIO(span(t, G('Twenty forty') + .4, G('kitchen table') - .1)), z = lerp(1, 2.1, push);
    const kq = G('question from'), rev = sineIO(span(t, kq - .45, kq + 1.05));   // lead 25.11.: expoOut over 1 s opened the disc in 3 frames (smooth.py LURCH 17)
    if (rev < 1) {
      K.bg(ctx, t, { gx: 1180, gy: 560, ga: .26, stars: 60 });
      ctx.save(); ctx.translate(head[0], head[1]); ctx.scale(z, z); ctx.translate(-head[0], -head[1]);
      ageStep(ctx, t, S, T, { i: 3, age: 18, year: 2044, from: [12, 2038], pAge: 'Eighteen', pYear: 'Twenty forty', fx: (1180 - K.stepTop(3)[0]) / K.STEP.w });
      ctx.restore();
    }
    if (rev > 0) {
      const R = 1460 * rev + 2;   // the farthest corner from the head is ~1340 px
      ctx.save(); ctx.beginPath(); ctx.arc(head[0], head[1], R, 0, TAU); ctx.clip();
      const zk = lerp(1.08, 1.14, sineIO(span(t, kq, S.b + 1))), fyk = (511 * zk - head[1]) / (zk - 1);
      K.kitchen(ctx, t, { cam: { z: zk, fx: head[0], fy: fyk }, childAge: 18, childH: 430, look: .85, lamp: lerp(1, .72, sineIO(span(t, G('isn') - .3, G('cute') + .6))), notebook: 1 });
      ctx.restore();
      if (rev < 1) { ctx.save(); ctx.strokeStyle = rgba(PAPER76.lit, .5 * Math.sin(Math.PI * rev)); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(head[0], head[1], R, 0, TAU); ctx.stroke(); ctx.restore(); }
    }
  },
  // ---------------------------------------------------------------- a18c "What should I be?" again: shorter, plainer, no handwriting
  a18c(ctx, t, S, T) {
    const { G } = K.phr(T, S, t);
    const zk = 1.14, fyk = (511 * zk - 457) / (zk - 1);
    K.kitchen(ctx, t, { cam: { z: lerp(zk, zk + .03, span(t, S.a, S.b + .7)), fx: 1180, fy: fyk }, childAge: 18, childH: 430, look: .85, lamp: .72, notebook: 1 });
    const q = G('What should'), u = span(t, q - .3, q + .45), k = expoOut(u);
    if (u > 0) {
      const x = lerp(S.in[0], 960, k), y = lerp(S.in[1], 220, k), s = lerp(.25, 1, k);
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= clamp(u * 3);
      E.glowText(ctx, 'WHAT SHOULD I BE?', 0, 0, { size: 72, weight: 600, align: 'center', col: CREAM, spacing: .04 });
      ctx.restore();
    }
  },
  // ---------------------------------------------------------------- a18d Daniel Susskind · the book · his verdict (a paraphrase: no quotes)
  a18d(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 420, ga: .24, stars: 50 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.05, fx: 960, fy: 500 });
    // the name card (born where the plane lands, top centre)
    const nu = span(t, S.a + .05, G('Daniel Susskind') + .5), card = K.paperCard(ctx, t, 560, 110, 800, 190, { u: nu, style: 'night' });
    if (card) {
      K.serif(ctx, 'Daniel Susskind', 960, 196, 64, span(t, G('Daniel') - .1, G('Daniel') + .6), { align: 'center', col: CREAM });
      K.cap(ctx, 'ECONOMIST', 960, 248, U('economist', .6, -.15), { size: 24, align: 'center', col: GOLD.text });
      K.cap(ctx, 'ADVISER TO THE UK GOVERNMENT ON AI AND WORK', 960, 282, U('advises', .6, -.1), { size: 22, align: 'center', col: MUTED });
    }
    // the man himself (indigo: another person), rising from the floor under the card; a thin label thread ties card to head
    const pu = expoOut(span(t, G('Daniel') - .2, G('Daniel') + .9)), bw0 = G('whole book'), bu = span(t, bw0 - .45, bw0 + .55), bk = sineIO(bu);
    ground(ctx, 900, 380, .12 * pu);
    if (pu > 0) {
      halo(ctx, 380, 640, 320, .2 * pu, '#4a5aa8', '#8090d0');
      ctx.save(); ctx.globalAlpha *= clamp(pu * 2);
      const hands = E.person(ctx, 380, 900 + (1 - pu) * 60, 470, { head: 1.15, look: .25 + .2 * bk, light: .5, rim: mixHex(P.blue0, CREAM, .5), armR: [lerp(.1, .8, bk), lerp(.05, 1.3, bk)], armL: [-.12, -.06] });
      ctx.restore();
      // the book leaves his hand on "whole book" and arcs to the right
      if (bu > 0) {
        const hx = hands?.R?.[0] ?? 450, hy = hands?.R?.[1] ?? 700, fk = expoOut(bu);
        const bx = (1 - fk) ** 2 * hx + 2 * (1 - fk) * fk * 900 + fk * fk * 1300, by = (1 - fk) ** 2 * hy + 2 * (1 - fk) * fk * 420 + fk * fk * 600;
        bookCover(ctx, t, bx, by, lerp(.18, 1, fk), 1, { still: true });
      }
    }
    // the verdict rises between them, no quotation marks (faktencheck: paraphrase)
    K.cap(ctx, 'HIS VERDICT', 820, 470, U('His verdict', .6, -.1), { size: 24, align: 'center', col: MUTED });
    K.big(ctx, 'No skill is', 820, 570, 76, U('No skill', .6, -.15));
    K.big(ctx, 'future-proof.', 820, 660, 76, U('future-proof', .6, -.25));
    ctx.restore();
  },
  // ---------------------------------------------------------------- a18e and yes, he has a book to sell: a paper belly band wraps the book
  a18e(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 1200, gy: 520, ga: .24, stars: 50 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.03, fx: 1100, fy: 540 });
    const go = sineIO(span(t, S.b - 1.3, S.b - .55)), x = lerp(1300, 960, go), y = lerp(600, 560, go), s = lerp(1.12, .9, go);
    bookCover(ctx, t, x, y, s, 1, { band: span(t, G('book to sell') - .35, G('book to sell') + .4) });
    K.cap(ctx, 'AND YES', 760, 420, U('And yes', .6, -.1) * (1 - go), { size: 26, align: 'center', col: MUTED });
    ctx.restore();
  },
  // ---------------------------------------------------------------- C2 ORIGINAL FOOTAGE Daniel Susskind (plate grows out of the book)
  // lead 25.11.: a match (no disc over the small book): the book holds where a18e left it, the plate grows out of the book's cover and back
  C2(ctx, t, S, T) {
    const pe = prevShot(T, 'a18e'), c = T.clip('C2');
    K.bg(ctx, t, { gx: 1200, gy: 520, ga: .24, stars: 50 });
    const m = sineIO(span(t, S.a + .1, S.a + .9)) * (1 - sineIO(span(t, c.end - .05, c.end + .55)));
    ctx.save(); K.shotCam(ctx, t, pe, { z0: 1.0, z1: 1.03, fx: 1100, fy: 540 });
    if (m < 1) { ctx.save(); ctx.globalAlpha *= 1 - span(m, .55, .95); bookCover(ctx, t, 960, 560, .9, 1, { band: 1 }); ctx.restore(); }
    ctx.restore();
    if (m > 0) { const bw = 270, bh = 378; K.clipPlate(ctx, t, T, 'C2', { from: { x: 960 - bw / 2, y: 560 - bh / 2, w: bw, h: bh }, morph: m }); }
  },
  // ---------------------------------------------------------------- a18f · a18g England made coding required · today machines do it best
  a18f(ctx, t, S, T) { classroom(ctx, t, T); },
  a18g(ctx, t, S, T) { classroom(ctx, t, T); },
  // ---------------------------------------------------------------- a18h · a18i · a18j the bet on one job · the guess · home care aide ★
  a18h(ctx, t, S, T) { jobCards(ctx, t, T); },
  a18i(ctx, t, S, T) { jobCards(ctx, t, T); },
  a18j(ctx, t, S, T) { jobCards(ctx, t, T); },
  // ---------------------------------------------------------------- a18k the aide helps your father out of his chair · +847,300 · older
  a18k(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 560, ga: .26, gcol: '#5a4a2a', stars: 40 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.03, z1: 1.0, fx: 900, fy: 600 });
    ground(ctx, 852, 900, .16);
    K.cap(ctx, 'HOME CARE AIDES', 960, 830, 1 - span(t, S.a + .1, S.a + .5), { size: 36, align: 'center', col: GOLD.text, glow: true });
    // a warm lamp, the armchair, your father in it; the aide helps him up on "out of his chair"
    const born = expoOut(IN(.8)), upU = sineIO(span(t, G('helps your father') - .1, G('chair') + .4));
    halo(ctx, 900, 520, 360 * born, .35 * born, GOLD.halo, GOLD.core);
    const ax = 820, ay = 852;
    ctx.fillStyle = K.lin(ctx, 0, ay - 330, 0, ay, [[0, '#4a3a52'], [1, '#2a2140']]);
    ctx.beginPath(); ctx.roundRect(ax - 150, ay - 330, 220, 330, 30); ctx.fill();   // chair back
    E.person(ctx, lerp(ax - 20, ax + 30, upU), lerp(ay + 60, ay, upU), 300, { dir: 1, look: lerp(-.1, .35, upU), lean: lerp(.38, .1, upU), light: .8, long: true, armR: [lerp(1.1, 1.5, upU), lerp(1.3, 1.6, upU)], armL: [lerp(.3, .9, upU), .9], rim: mixHex(P.blue0, P.cream, .5) });
    ctx.fillStyle = K.lin(ctx, 0, ay - 160, 0, ay, [[0, '#5a4862'], [1, '#2c2440']]); ctx.beginPath(); ctx.roundRect(ax - 170, ay - 150, 270, 150, 24); ctx.fill();   // seat + arm (in front)
    ctx.fillStyle = '#1a1533'; ctx.fillRect(ax - 160, ay - 14, 18, 18); ctx.fillRect(ax + 70, ay - 14, 18, 18);
    E.person(ctx, 1060, ay, 320, { dir: -1, view: 'side', look: .1, lean: lerp(.18, .06, upU), light: -1, rim: mixHex(P.blue0, GOLD.line, .8), armR: [lerp(1.3, 1.1, upU), lerp(1.5, 1.2, upU)], armL: [lerp(1.0, .7, upU), lerp(1.4, 1.0, upU)] });
    // the number: almost 850,000 new jobs (BLS: +847,300), counted on the spoken number
    const nu = span(t, G('eight hundred') - .1, G('new jobs') + .2);
    K.counter(ctx, t, 1460, 360, 104, 0, 847300, nu, (v) => '+' + (Math.round(v / 100) * 100).toLocaleString('en-US'), { col: GOLD.text });
    K.cap(ctx, 'NEW HOME CARE JOBS BY 2035', 1460, 424, span(nu, .3, 1), { size: 28, align: 'center', col: CREAM });
    // the country getting older: a row of people; some of them grow older (bend, slow) on "getting older" (no invented share)
    const ou = span(t, G('getting older') - .5, G('getting older') + 1.0), rowU = span(t, G('mostly because') - .2, G('mostly because') + .8);
    K.figRow(ctx, t, 1250, 690, 8, 60, 120, rowU, (i) => { const old = [1, 3, 4, 6].includes(i) ? sineIO(span(ou, i * .08, i * .08 + .5)) : 0; return { look: lerp(.1, -.3, old), dim: .2 * old, rim: old > .3 ? mixHex(P.blue0, P.cream, .6) : undefined }; });
    K.cap(ctx, 'THE COUNTRY IS GETTING OLDER', 1460, 750, span(ou, .1, .7), { size: 28, align: 'center', col: MUTED });
    K.src(ctx, t, G('eight hundred') - .2, S.b + 1, 'U.S. BUREAU OF LABOR STATISTICS · PROJECTIONS 2025–2035 · AUG 2026');
    ctx.restore();
  },
  // ---------------------------------------------------------------- a18l where we'll still want a person: at a bedside, in a classroom
  a18l(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 1110, gy: 320, ga: .26, stars: 60 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.04, fx: 1000, fy: 480 });
    ground(ctx, 872, 400, .08);
    // the machine over everything it can do: the chip high in the middle, its light washes the sky (stops at the two frames)
    const mu = sineIO(span(t, G('Whatever machines') - .3, G('can do') + .6));
    if (mu > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = K.rad(ctx, 1110, 110, 900, [[0, rgba(MACH.heart, .2 * mu)], [1, rgba(MACH.heart, 0)]]); ctx.fillRect(0, 0, W, 900); ctx.restore(); K.chip(ctx, t, 1110, 112, 32 * expoOut(mu) + 1, { lit: 1, think: .5, rays: .5 * mu }); }
    // two frames: BEDSIDE (right, born where the plane lands) and CLASSROOM (left); each lights warm on its words
    const fr = expoOut(IN(.9)), bed = sineIO(span(t, G('bedside') - .35, G('bedside') + .5)), cls = sineIO(span(t, G('classroom') - .35, G('classroom') + .5));
    scenePanel(ctx, t, 1400, 420, 480, 320, fr, bed, 'bedside');
    scenePanel(ctx, t, 820, 420, 480, 320, fr * span(t, S.a + .3, S.a + 1.1), cls, 'classroom');
    K.cap(ctx, 'AT A BEDSIDE', 1400, 630, U('bedside', .6, -.2), { size: 30, align: 'center', col: GOLD.text });
    K.cap(ctx, 'IN A CLASSROOM', 820, 630, U('classroom', .6, -.2), { size: 30, align: 'center', col: GOLD.text });
    // you and your child (18 now) look where Susskind points
    const lk = sineIO(span(t, G('tells parents') - .2, G('to look') + .6));
    E.du(ctx, 250, 872, 250, { look: lerp(.2, .75, lk), light: 1, back: .2, dir: 1 });
    K.kid(ctx, 340, 872, 236, { age: 18, look: lerp(.2, .7, lk), light: 1, dir: 1 });
    K.cap(ctx, 'WHERE WE STILL WANT A PERSON', 1110, 760, U('still want a person', .7, -.4), { size: 40, align: 'center', col: CREAM, glow: true });
    K.src(ctx, t, G("That's where Susskind"), S.b + 1, 'DANIEL SUSSKIND · WHAT SHOULD MY CHILDREN DO? · 2026');
    ctx.restore();
  },
  // ---------------------------------------------------------------- a18m home care pays about $36,000 (median $35,800); more is not guaranteed
  a18m(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 520, ga: .24, stars: 40 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.04, fx: 960, fy: 520 });
    payColumn(ctx, t, 960, 760, {
      base: expoOut(IN(.7)), grow: span(t, G('pays') - .2, G('thirty-six') + .5), value: U('thirty-six', .6, -.1),
      more: U('guarantees', .7, -.6), q: U('more', .6, -.1), label: U('Home care pays', .7, -.2),
    });
    const hq = G('Honestly');
    K.serif(ctx, 'Honestly, though?', 960, 300 - 40 * sineIO(span(t, G('pays') - .3, G('pays') + .6)), 72, span(t, hq - .25, hq + .45) * (1 - span(t, G('pays') + .2, G('pays') + .8)), { align: 'center', col: CREAM });
    K.cap(ctx, 'NOT GUARANTEED', 620, 300, U('nothing guarantees', .7, -.1), { size: 40, align: 'center', col: CREAM });
    K.src(ctx, t, G('Home care pays'), S.b + 1, 'U.S. BUREAU OF LABOR STATISTICS · OCCUPATIONAL EMPLOYMENT AND WAGES · MAY 2025');
    ctx.restore();
  },
  // ---------------------------------------------------------------- a18n care: nearly 1 in 3 new jobs · whether we pay it what it's worth: up to us
  a18n(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 420, ga: .24, stars: 40 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.04, fx: 960, fy: 480 });
    // the bar of all new U.S. jobs 2025–2035 (one bar, 100 %), the health-care share lights gold: nearly one in three (BLS, no other sectors invented)
    const x0 = 360, x1 = 1560, by = 330, th = 54, bu = expoOut(span(t, S.a + .05, S.a + 1.1)), hc = span(t, G('biggest job') - .2, G('in care') + .4);
    K.cap(ctx, 'ALL NEW U.S. JOBS · 2025–2035', x0, by - 56, span(t, S.a + .2, S.a + 1), { size: 24, col: MUTED });
    if (bu > 0) {
      ctx.fillStyle = rgba(P.blue1, .55); ctx.beginPath(); ctx.roundRect(x0, by - th / 2, (x1 - x0) * bu, th, 6); ctx.fill();
      ctx.fillStyle = rgba(CREAM, .35); for (const f of [1 / 3, 2 / 3]) if (bu > f) ctx.fillRect(x0 + (x1 - x0) * f - 1, by - th / 2 - 10, 2, th + 20);
    }
    if (hc > 0) {
      const w = (x1 - x0) * .32 * expoOut(hc);
      halo(ctx, x0 + w, by, 120, .3 * hc, GOLD.halo, GOLD.core);
      ctx.fillStyle = K.lin(ctx, 0, by - th / 2, 0, by + th / 2, [[0, GOLD.hot], [.5, GOLD.body], [1, GOLD.mid]]); ctx.beginPath(); ctx.roundRect(x0, by - th / 2, w, th, [6, 2, 2, 6]); ctx.fill();
      ctx.fillStyle = rgba(P.night1, .9); ctx.fillRect(x0 + w, by - th / 2, 2, th);
    }
    K.cap(ctx, 'HEALTH CARE: NEARLY 1 IN 3 NEW JOBS', x0, by + 84, span(t, G('in care') - .2, G('in care') + .5), { size: 38, col: GOLD.text, glow: true });
    K.cap(ctx, 'WHERE A HUMAN IS THE POINT', x0, by + 138, U('a human is', .7, -.1), { size: 30, col: CREAM });
    // the pay column returns, with the open field above it: UP TO US
    const pr = span(t, G('Whether we pay') - .5, G('Whether we pay') + .7);
    payColumn(ctx, t, 1300, 830, { base: pr, grow: pr, value: span(pr, .5, 1), more: span(t, G('worth') - .4, G('worth') + .3), q: 0, label: pr, scale: .7, up: U('up to us', .7, -.2) });
    K.src(ctx, t, G("So here's what"), S.b + 1, 'U.S. BUREAU OF LABOR STATISTICS · EMPLOYMENT PROJECTIONS 2025–2035 · AUG 2026');
    ctx.restore();
  },
  // ---------------------------------------------------------------- a18o a life as a ring; machines carry the work blocks away; the centre empties
  a18o(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 460, ga: .24, stars: 50 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.02, z1: 1.0, fx: 960, fy: 460 });
    const cx = 960, cy = 490, ring = ['FAMILY', 'FRIENDS', 'HOME', 'HEALTH', 'PLAY', 'LEARNING', 'CARE', 'NEIGHBOURS'];
    const ru = span(t, S.a, S.a + 1.6);
    ring.forEach((s, i) => {
      const a = -Math.PI / 2 + i * TAU / ring.length, x0 = cx + Math.cos(a) * 560, y0 = cy + Math.sin(a) * 300, d = Math.hypot(x0 - S.in[0], y0 - S.in[1]) / 1100;
      const e = rise(span(ru, d * .6, d * .6 + .4)); if (e <= 0) return;   // the ring builds outward from where the plane landed
      const x = cx + Math.cos(a) * 560 * lerp(.9, 1, e), y = cy + Math.sin(a) * 300 * lerp(.9, 1, e), w = K.measure(s, 30, false, 600) + 56;
      ctx.save(); ctx.globalAlpha *= e; ctx.fillStyle = mixHex(P.ind2, P.blue1, .4); ctx.beginPath(); ctx.roundRect(x - w / 2, y - 32, w, 64, 12); ctx.fill(); ctx.strokeStyle = rgba(PAPER76.body, .5); ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
      K.cap(ctx, s, x, y + 11, e, { size: 30, align: 'center', col: CREAM });
    });
    // the JOB in the centre: six work blocks (born where the plane lands); machine lights carry them away one by one
    const carry = span(t, G('carry more') - .3, G('of the work') + .9), empty = span(t, G('stops being') - .2, G('center of a life') + .4);
    const BL = [[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0]], bw = 116, bh = 68, born = expoOut(IN(.7));
    BL.forEach(([i, j], k) => {
      const order = [4, 1, 5, 0, 3, 2].indexOf(k), q = span(carry, order / 6 * .8, order / 6 * .8 + .25), qq = expoIn(q);
      const hx = cx + i * (bw + 8), hy = cy - 10 + j * (bh + 8) + bh / 2;
      const ex = cx + (i >= 0 ? 1 : -1) * 1100, ey = cy - 520 + j * 40, x = lerp(hx, ex, qq), y = lerp(hy, ey, qq) - Math.sin(Math.PI * qq) * 80;
      if (q >= 1) return;
      // the machine's light arrives first (from the top edge), then lifts the block
      const ar = span(carry, order / 6 * .8 - .12, order / 6 * .8);
      if (ar > 0) { const lx = lerp(cx + i * 300, x, sineIO(ar)), ly = lerp(-60, y - 40, sineIO(ar)); halo(ctx, lx, ly, 40, .5, MACH.heart, MACH.heartCore); ctx.fillStyle = rgba(MACH.heartCore, .95); ctx.beginPath(); ctx.arc(lx, ly, 6, 0, TAU); ctx.fill(); }
      ctx.save(); ctx.globalAlpha *= born * (1 - span(q, .7, 1)); ctx.translate(x, y); ctx.rotate(qq * .5 * (i || 1));
      ctx.fillStyle = K.lin(ctx, 0, -bh / 2, 0, bh / 2, [[0, PAPER76.lit], [1, PAPER76.body]]); ctx.beginPath(); ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 6); ctx.fill();
      ctx.fillStyle = rgba(INK, .35); ctx.fillRect(-bw / 2 + 12, -6, bw - 30, 4); ctx.fillRect(-bw / 2 + 12, 4, bw - 46, 4);
      ctx.restore();
    });
    K.cap(ctx, 'JOB', cx, cy - 10 - bh - 30, born * (1 - empty), { size: 40, align: 'center', col: GOLD.text, glow: true });
    // the empty centre: a dashed outline, then the question
    const du = span(t, G('stops being') - .1, G('stops being') + .7);
    if (du > 0) { ctx.save(); ctx.globalAlpha *= du; ctx.setLineDash([10, 9]); ctx.strokeStyle = rgba(CREAM, .6); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(cx - 1.5 * bw - 12, cy - 10 - bh - 12, 3 * bw + 40, 2 * bh + 32, 12); ctx.stroke(); ctx.restore(); }
    const qu = span(t, G('what takes') - .2, G('what takes') + .5);
    if (qu > 0) { halo(ctx, cx, cy - 10, 120, .3 * qu, P.halo0, CREAM); E.glowText(ctx, '?', cx, cy + 44 + (1 - expoOut(qu)) * 30, { size: 160, serif: true, align: 'center', col: CREAM, a: clamp(qu * 3) }); }
    K.cap(ctx, 'WHAT TAKES ITS PLACE?', 960, 110, U('what takes', .7, -.1), { size: 44, align: 'center', col: CREAM });
    K.cap(ctx, 'A LIFE', cx, cy + 300 + 70, span(ru, .5, 1) * (1 - span(t, G('what takes') - .3, G('what takes'))), { size: 22, align: 'center', col: MUTED });
    ctx.restore();
  },
};

// ================================================================================================================ more helpers (hoisted)
// the book: WHAT SHOULD MY CHILDREN DO? (Daniel Susskind, 2026): an indigo cover with cream type and a thin spine; u drops it in; o.band
// wraps a paper belly band (HE HAS A BOOK TO SELL) across the lower third (a book's own band, not a ribbon)
function bookCover(ctx, t, x, y, s, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const k = o.still ? 1 : expoOut(u), bw = 300, bh = 420;
  ctx.save(); ctx.globalAlpha *= clamp(u * 3); ctx.translate(x, y + (1 - k) * -120); ctx.rotate((1 - k) * .08 - .02 + Math.sin(t * .7) * .004); ctx.scale(s, s);
  halo(ctx, 0, 0, 360, .28, GOLD.halo, GOLD.core);
  ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(-bw / 2 + 12, -bh / 2 + 16, bw, bh, 6); ctx.fill();
  ctx.fillStyle = '#c9bf9c'; ctx.fillRect(bw / 2 - 2, -bh / 2 + 6, 14, bh - 8);   // pages
  ctx.fillStyle = K.lin(ctx, -bw / 2, -bh / 2, bw / 2, bh / 2, [[0, '#3a4eaa'], [1, '#1c2870']]); ctx.beginPath(); ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 6); ctx.fill();
  ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(-bw / 2, -bh / 2, 14, bh);   // spine shadow
  for (const [s1, yy] of [['What should', -96], ['my children', -40], ['do?', 16]]) E.glowText(ctx, s1, -bw / 2 + 34, yy, { size: 50, serif: true, col: PAPER76.lit, glow: false });
  E.glowText(ctx, 'DANIEL SUSSKIND', -bw / 2 + 34, bh / 2 - 74, { size: 20, weight: 600, col: GOLD.text, glow: false, spacing: .08 });
  E.glowText(ctx, '2026', -bw / 2 + 34, bh / 2 - 42, { size: 18, weight: 600, col: MUTED, glow: false });
  const band = clamp(o.band ?? 0);
  if (band > 0) {   // the band slides on from the right and wraps round the cover
    const bk = expoOut(band), w = (bw + 40) * bk, by0 = bh / 2 - 150;
    ctx.fillStyle = K.lin(ctx, 0, by0, 0, by0 + 70, [[0, PAPER76.lit], [1, PAPER76.body]]); ctx.fillRect(bw / 2 + 20 - w, by0, w, 70);
    ctx.fillStyle = rgba(PAPER76.fold, .5); ctx.fillRect(bw / 2 + 20 - w, by0, w, 3);
    ctx.save(); ctx.beginPath(); ctx.rect(bw / 2 + 20 - w, by0, w, 70); ctx.clip();
    E.glowText(ctx, 'HE HAS A BOOK TO SELL', 0, by0 + 44, { size: 22, weight: 600, align: 'center', col: INK, glow: false, spacing: .06 });
    ctx.restore();
  }
  ctx.restore();
}
// the pay column (a18m, a18n): base (x, baseY); scale 1 = 100 px per $10,000; o: { base, grow, value, more (dashed field above), q, label, up }
function payColumn(ctx, t, x, baseY, o) {
  const sc = o.scale ?? 1, hPay = 358 * sc, hMore = 210 * sc, w = 170 * sc, b = clamp(o.base ?? 1);
  if (b > 0) { ctx.fillStyle = rgba(CREAM, .5 * b); ctx.fillRect(x - 160 * b, baseY, 320 * b, 2); }
  K.column(ctx, x - w / 2, baseY, w, hPay, o.grow ?? 0, GOLDC, {});
  const top = baseY - hPay * expoOut(clamp(o.grow ?? 0));
  if ((o.value ?? 0) > 0) E.glowText(ctx, '$35,800', x, top - 22, { size: 64 * Math.max(.8, sc), serif: true, align: 'center', col: CREAM, glow: false, a: rise(o.value) });
  K.cap(ctx, 'HOME CARE · MEDIAN PAY 2025', x, baseY + 44, o.label ?? 0, { size: 24, align: 'center', col: GOLD.text });
  const m = clamp(o.more ?? 0);
  if (m > 0) {
    const y1 = baseY - hPay - 90 * sc, y0 = y1 - hMore * expoOut(m);
    ctx.save(); ctx.globalAlpha *= clamp(m * 3); ctx.setLineDash([10, 8]); ctx.strokeStyle = rgba(CREAM, .7); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(x - w / 2, y0, w, y1 - y0, [w * .18, w * .18, 2, 2]); ctx.stroke(); ctx.restore();
    if ((o.q ?? 0) > 0) K.cap(ctx, 'MORE?', x, (y0 + y1) / 2 + 10, o.q, { size: 28, align: 'center', col: CREAM });
    const up = clamp(o.up ?? 0);
    if (up > 0) { halo(ctx, x, (y0 + y1) / 2, 160 * sc, .4 * up, GOLD.halo, GOLD.core); K.cap(ctx, 'UP TO US', x, (y0 + y1) / 2 + 12, up, { size: 36, align: 'center', col: GOLD.text, glow: true }); }
  }
}
// a calm picture in a frame (a18l): bedside (a carer sits by a bed) or classroom (a teacher before a class); lit 0..1 warms it
function scenePanel(ctx, t, cx, cy, w, h, u, lit, kind) {
  u = clamp(u); if (u <= 0) return;
  const k = expoOut(u), x = cx - w / 2 * k, y = cy - h / 2 * k, ww = w * k, hh = h * k;
  ctx.save();
  if (lit > 0) halo(ctx, cx, cy, w * .9, .35 * lit, GOLD.halo, GOLD.core);
  ctx.fillStyle = K.lin(ctx, 0, y, 0, y + hh, [[0, mixHex('#141d52', '#6a5030', lit)], [1, mixHex('#0a0f30', '#2c2030', lit)]]); ctx.beginPath(); ctx.roundRect(x, y, ww, hh, 10); ctx.fill();
  ctx.strokeStyle = rgba(mixHex(P.blue1, GOLD.line, lit), .8); ctx.lineWidth = 2.5; ctx.stroke();
  ctx.beginPath(); ctx.roundRect(x, y, ww, hh, 10); ctx.clip();
  ctx.globalAlpha *= .5 + .5 * lit;
  const fy = cy + h * .42;
  ctx.fillStyle = mixHex('#0c1132', '#3a2a30', lit); ctx.fillRect(x, fy, ww, hh);
  if (kind === 'bedside') {
    halo(ctx, cx + w * .3, cy - h * .2, 90, .6 * lit, GOLD.halo, GOLD.core);   // the bedside lamp
    ctx.fillStyle = mixHex('#2a2140', '#cfc0a0', lit * .6); ctx.beginPath(); ctx.roundRect(cx - w * .36, fy - 70, w * .52, 70, 12); ctx.fill();   // bed
    ctx.fillStyle = mixHex('#1a1533', '#e8dcc0', lit * .7); ctx.beginPath(); ctx.ellipse(cx - w * .3, fy - 82, 26, 16, 0, 0, TAU); ctx.fill();   // pillow
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .5); ctx.beginPath(); ctx.arc(cx - w * .27, fy - 92, 17, 0, TAU); ctx.fill();   // the patient's head
    ctx.fillStyle = mixHex('#2c2440', '#9e8a74', lit * .6); ctx.beginPath(); ctx.roundRect(cx - w * .24, fy - 80, w * .38, 24, 10); ctx.fill();   // blanket
    E.person(ctx, cx + w * .2, fy, 170, { dir: -1, view: 'side', lean: .22, look: .1, light: -1, armR: [1.3, 1.6], rim: mixHex(P.blue0, GOLD.line, lit) });
  } else {
    E.person(ctx, cx - w * .28, fy, 180, { dir: 1, look: .2, light: 1, armR: [1.6, 1.9], rim: mixHex(P.blue0, GOLD.line, lit) });
    for (let i = 0; i < 4; i++) E.person(ctx, cx - w * .02 + i * w * .1, fy + 18, 96, { head: 1.3, view: 'back', look: .3, light: .5 });
  }
  ctx.restore();
}
