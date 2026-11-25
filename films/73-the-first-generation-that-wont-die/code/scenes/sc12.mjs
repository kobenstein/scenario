// c12 · B3 · 'Part of that comes down' → 'So is yours the first' (planned hard cut W E.01 to c13). Rules, on THE LIFELINE at dawn.
// Out of plateFork the two curves flatten into the line and three blank rule cards rise out of it (WHO STEPS ASIDE · WHO PAYS · WHO CAN
// AFFORD IT). The AI ring reaches for one, it stays blank; voters raise cards; first lines appear. Card by card: a ledge with two terms
// (the figure steps down), the RETIRE tick that slides with the end of the line (Denmark), ★ the trial line PHASE 1 · 2 · 3: the clinic
// moves up to the end of phase 1, its door opens, a patient walks in (Montana), a thin gold stream (2%) to the people outside; a balance
// ACCESS / RISK; a long row of blank cards; one card becomes a window with a cradle in the town; the Sweden curves; 1 IN 5; THE ANSWER.
//
// | ID   | anchor (phrase)            | zeigt wörtlich                                                        | layer | carrier out       |
// |------|----------------------------|-----------------------------------------------------------------------|-------|-------------------|
// | 6.13 | Part of that comes down    | the fork flattens into the line; three blank rule cards rise out of it | EXPL | the cards         |
// | 6.14 | Labs don't write those     | the AI ring rises, its beam on a card: the card stays blank            | MIX   | the cards         |
// | 6.15 | Voters and lawmakers do    | people rise out of the line and raise cards                            | SCENE | the cards         |
// | 6.16 | A few exist already        | the first lines write themselves on the cards                          | EXPL  | card 1            |
// | 6.17 | Who steps aside            | card 1 comes forward, the others stack                                 | EXPL  | the ledge         |
// | 6.18 | American presidents must   | a ledge with two terms; the figure steps down: USA · 22ND AMENDMENT…   | MIX   | card 2            |
// | 6.19 | Who pays for longer lives  | card 2 comes forward                                                    | EXPL  | the RETIRE tick   |
// | 6.20 | Denmark has tied           | the RETIRE tick slides with the line's end (DENMARK + source)          | EXPL  | card 3            |
// | 6.21 | And who can afford it      | card 3 comes forward                                                    | EXPL  | the trial line    |
// | 6.22★| A Montana law              | PHASE 1 · 2 · 3; the clinic moves up to phase 1, its door opens, a patient walks in | MIX | the door |
// | 6.23 | In return                  | a thin gold stream (2%) from the clinic to the people outside          | MIX   | the stream        |
// | 6.24 | Supporters call that access| a balance rises: ACCESS                                                 | EXPL  | the balance       |
// | 6.25 | Critics call it a risk     | the other pan: RISK                                                     | EXPL  | the cards         |
// | 6.26 | Most rules for a world     | the cards join a long row of blank cards along the line                | EXPL  | a blank card      |
// | 6.27 | How many children          | one card becomes a window with a cradle; the town rises around it      | SCENE | the window        |
// | 6.28 | One projection for Sweden  | the window's light becomes the start of two curves: FEARED / PROJECTED | EXPL  | the curves        |
// | 6.29 | Even so, in this year's    | 100 dots, 20 gold: 1 IN 5                                               | EXPL  | the dots          |
// | 6.30 | Would you                  | the dots fold into THE ANSWER, the bead in the middle (where the stone's blank will be) | EXPL | the bead (W) |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f73_kit.mjs';
import * as S from '../lib/f73_world.mjs';
import * as X from '../lib/f73_stage.mjs';
import * as B from '../lib/b3_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, expoIn, halo, lin } = E;
const { GOLD, COOL, CREAM, LAMP, AGE, PAPER, SOURCES: SRC } = F;
const PR = F.PRINT73, PF = B.PF, LY = PF.base;
const KIDS = Number((SRC.kids20Src.match(/(\d+)\s?%/) || [0, 20])[1]);
const head = (s) => s.split(' · ')[0];
const CW = 340, CH = 220;

export default async (T, R) => {
  const G = (p, n = 0) => T.G(p, n, R.a - .5);
  const A = {
    part: R.a, labs: G("Labs don't write those"), voters: G('Voters and lawmakers do'), few: G('A few exist already'), steps: G('Who steps aside'),
    amer: G('American presidents must'), terms: G('after two terms'), pays: G('Who pays for longer lives'), den: G('Denmark has tied'), law: G('by law'),
    howlong: G('how long people live'), afford: G('And who can afford it'), mont: G('A Montana law'), sell: G('sell treatments'), trial: G('first safety trial'),
    ret: G('In return'), state: G('get treatment'), sup: G('Supporters call that access'), crit: G('Critics call it a risk'), most: G('Most rules for a world'),
    never: G('have never been written'), kids: G('How many children'), swe: G('One projection for Sweden'), slow: G('grow more slowly'), even: G("Even so, in this year's"),
    five: G('one in five'), would: G('Would you'), end: R.b,
  };
  const tA = R.a + S.SEAM_HALF;
  const VK = [
    [R.a - S.SEAM_HALF, { x: 960, y: 540, s: 1 }], [tA, { x: 960, y: 540, s: 1.04 }], [A.labs + .3, { x: 980, y: 530, s: 1.02 }], [A.voters + .6, { x: 960, y: 560, s: .97 }],
    [A.steps + .8, { x: 1040, y: 540, s: 1.0 }], [A.mont + 1.2, { x: 1120, y: 560, s: 1.03 }], [A.trial + 1.0, { x: 1210, y: 600, s: 1.13 }], [A.sup + .2, { x: 1000, y: 560, s: 1.0 }],
    [A.never + 1.0, { x: 1220, y: 600, s: .8 }], [A.kids + 2.2, { x: 1350, y: 650, s: 1.3 }], [A.swe + 1.4, { x: 990, y: 540, s: 1.0 }], [A.would - .3, { x: 960, y: 540, s: 1.0 }], [R.b, { x: 960, y: 540, s: 1.02 }],
  ];
  const view = (t) => (t < tA ? B.viewFork(t, T) : B.viewOf(t, VK, false));
  const PK = [[R.a, [900, 560]], [A.labs, [960, 480]], [A.steps, [1000, 520]], [A.mont + 1, [1200, 680]], [A.sup, [960, 600]], [A.kids + .5, [1350, 660]], [A.swe + 1, [1000, 560]], [A.would, [960, 540]], [R.b, [960, 540]]];
  const pool = (t) => { let i = 0; while (i < PK.length - 2 && t > PK[i + 1][0]) i++; const [t0, a] = PK[i], [t1, b] = PK[i + 1], u = sineIO(span(t, t0, t1)); return [lerp(a[0], b[0], u), lerp(a[1], b[1], u)]; };

  // ------------------------------------------------------------------ the three rule cards
  const HOME = [[560, 420], [960, 420], [1360, 420]], FOCUS = [330, 330], ROW = (i) => [300 + i * 175, LY - 50], RS = .42;
  const TF = [A.steps, A.pays, A.afford, 1e9];
  const cardState = (i, t, v) => {
    const rise = expoOut(span(t, A.part + .5 + i * .18, A.part + 1.7 + i * .18)), g = quartIO(span(t, A.steps - .15, A.steps + .9));
    const fw = quartIO(span(t, TF[i] - .15, TF[i] + .85)) * (1 - quartIO(span(t, TF[i + 1] - .15, TF[i + 1] + .85)));
    // focused / stacked cards stay put on the screen while the camera works below them (screen → sheet)
    const stack = X.toSheet(v, 1560 + i * 40, 170 + i * 26), foc = X.toSheet(v, FOCUS[0], FOCUS[1]), st = .5 / v.s, fs = 1 / v.s;
    let x = lerp(HOME[i][0], lerp(stack[0], foc[0], fw), g), y = lerp(HOME[i][1], lerp(stack[1], foc[1], fw), g), sc = lerp(1, lerp(st, fs, fw), g);
    const rw = quartIO(span(t, A.most - .3 + i * .1, A.most + 1.3 + i * .1)), [rx, ry] = ROW(i);
    x = lerp(x, rx, rw); y = lerp(y, ry, rw); sc = lerp(sc, RS, rw);
    return { x, y, sc, rise, sink: rw > 0 ? B.ease(t, A.kids - .2, A.kids + .8, quartIO) : 0 };
  };
  function cards(c, t, s, v) {
    for (let i = 2; i >= 0; i--) {
      const st = cardState(i, t, v); if (st.rise <= 0) continue;
      c.save();
      if (st.rise < 1 || st.sink > 0) { c.beginPath(); c.rect(-3000, -3000, 9000, LY - 1 + 3000); c.clip(); }
      c.translate(st.x, st.y + (1 - st.rise) * (LY - st.y + CH * st.sc) + st.sink * 160); c.scale(st.sc, st.sc);
      B.ruleCard(c, t, 0, 0, CW, CH, { head: SRC.rules3[i], lines: span(t, A.few + i * .25, A.few + 1.4 + i * .25), text: head([SRC.us22, SRC.denmark, SRC.montana][i]), textU: span(t, [A.amer, A.den, A.mont][i] + .2, [A.amer, A.den, A.mont][i] + .9), textSize: 26 });
      c.restore();
    }
  }
  // the long row of blank cards (6.26), one becomes the window (6.27)
  const WIN = 6;
  function row(c, t, s) {
    const ru = span(t, A.most + .3, A.never + 1.0); if (ru <= 0) return;
    const sinkO = B.ease(t, A.kids - .2, A.kids + .8, quartIO), m = B.ease(t, A.kids - .1, A.kids + 1.3, quartIO), wout = B.ease(t, A.swe - .2, A.swe + .9, quartIO);
    c.save(); c.beginPath(); c.rect(-3000, -3000, 9000, LY - 1 + 3000); c.clip();
    for (let i = 3; i < 18; i++) {
      const k = expoOut(span(ru, (i - 3) / 15 * .7, (i - 3) / 15 * .7 + .3)); if (k <= 0) continue;
      const [x, y] = ROW(i), w = CW * RS, h = CH * RS;
      if (i === WIN && m > 0) continue;
      c.save(); c.translate(0, (1 - k) * (h + 20) + (i === WIN ? 0 : sinkO * 140)); F.paperCard(c, t, x - w / 2, y - h / 2, w, h, { u: 1, rot: ((i * 37) % 7 - 3) * .006 }); c.restore();
    }
    c.restore();
    if (m > 0 && wout < 1) {   // the card → a window with a cradle; houses rise around it
      const [x, y] = ROW(WIN), hw = lerp(CW * RS, 150, m), hh = lerp(CH * RS, 122, m), wy = lerp(y, LY - 170, m);
      c.save(); c.beginPath(); c.rect(-3000, -3000, 9000, LY - 1 + 3000); c.clip(); c.translate(0, expoIn(wout) * 420);
      const hu = span(m, .2, 1);
      for (const [dx, w, lit] of [[-330, 190, .8], [330, 210, .6], [-560, 150, .4], [560, 170, .7], [-780, 180, .3], [790, 160, .5]]) { c.save(); c.translate(0, (1 - expoOut(span(hu, Math.abs(dx) / 900 * .5, Math.abs(dx) / 900 * .5 + .5))) * 260); F.house(c, t, x + dx, LY - 2, w, { lit }); c.restore(); }
      c.save(); c.translate(0, (1 - quartIO(hu)) * 380); c.fillStyle = mixHex(P.night1, P.ind2, .6); c.beginPath(); c.moveTo(x - 200, LY - 2); c.lineTo(x - 200, LY - 300); c.lineTo(x, LY - 420); c.lineTo(x + 200, LY - 300); c.lineTo(x + 200, LY - 2); c.fill(); c.restore();
      if (m < 1) { c.save(); c.globalAlpha *= 1 - m; F.paperCard(c, t, x - hw / 2, wy - hh / 2, hw, hh, { u: 1 }); c.restore(); }
      B.cradleWindow(c, t, x, wy, hw, hh, s, { u: m, cradle: span(m, .5, 1) });
      c.restore();
    }
  }
  // ------------------------------------------------------------------ the AI ring (6.14), the voters (6.15)
  function ring(c, t, s) {
    const up = expoOut(span(t, A.labs - .4, A.labs + .6)), dn = quartIO(span(t, A.voters - .1, A.voters + .9)); if (up <= 0 || dn >= 1) return;
    const x = 1660, y = lerp(LY, 250, up * (1 - dn)), bu = span(t, A.labs + .2, A.labs + .6) * (1 - span(t, A.labs + 1.1, A.voters + .1));
    const tx = lerp(1360, 1540, span(t, A.labs + .8, A.voters + .2));
    F.beam(c, x, y, tx, 420, bu, { s, w: 60 }); F.aiRing(c, t, x, y, 44, { u: up * (1 - dn), think: 1.4, s });
    X.label(c, SRC.ai, x + 84, y + 10, up * (1 - dn), { size: 26, col: COOL.text });
  }
  function voters(c, t, s) {
    const u = span(t, A.voters - .3, A.voters + .7), out = B.ease(t, A.steps - .3, A.steps + .7, quartIO); if (u <= 0 || out >= 1) return;
    c.save(); c.beginPath(); c.rect(-3000, -3000, 9000, LY - 1 + 3000); c.clip();
    for (let i = 0; i < 11; i++) {
      const x = 300 + i * 132, k = expoOut(span(u, i / 11 * .6, i / 11 * .6 + .4)), up = span(t, A.voters + .2 + (i % 4) * .12, A.voters + .9 + (i % 4) * .12), h = 112 + (i % 3) * 8;
      c.save(); c.translate(0, (1 - k) * (h + 10) + out * 150);
      const hd = F.person(c, x, LY - 2, h, { pose: up > .5 ? 'reach' : 'stand', dir: i % 2 ? 1 : -1, light: 1 });
      if (hd && hd.R && up > .5) { const [hx, hy] = hd.R; c.fillStyle = PAPER.lit; c.save(); c.translate(hx, hy - 14); c.rotate((i % 3 - 1) * .1); c.fillRect(-11, -16, 22, 30); c.restore(); }
      c.restore();
    }
    c.restore();
  }
  // ------------------------------------------------------------------ 6.18 the ledge with two terms · 6.20 the RETIRE tick · 6.22 the trial line
  function ledge(c, t, s) {
    const u = expoOut(span(t, A.steps + .4, A.amer + .3)), out = B.ease(t, A.pays - .2, A.pays + .8, quartIO); if (u <= 0 || out >= 1) return;
    const x0 = 880, x1 = 1480, ly = lerp(LY, 560, u * (1 - out));
    B.ledge(c, t, x0, x1, ly, LY, s, { legs: 1 });
    c.fillStyle = rgba(CREAM, .85); c.fillRect((x0 + x1) / 2 - 1.5 / s, ly - 12 / s, 3 / s, 24 / s);
    // the figure walks two terms and steps down
    const w = span(t, A.amer + .1, A.terms + .9), d = sineIO(w);
    let px, py; if (d < .8) { px = lerp(x0 + 40, x1, d / .8); py = ly; } else { const k = (d - .8) / .2; px = x1 + 60 * k; py = lerp(ly, LY, k); }
    c.save(); c.beginPath(); c.rect(-3000, -3000, 9000, LY - 1 + 3000); c.clip(); c.translate(0, out * 140);
    F.person(c, px, py - 2, 112, { pose: w > 0 && w < 1 ? 'walk' : 'stand', walk: w > 0 && w < 1 ? t * 5.5 : undefined, dir: 1, light: 1 }); c.restore();
    X.label(c, SRC.us22, 1180, LY + 52, B.lab(t, A.amer + .4, A.pays + .3), { size: 26 });
  }
  function retire(c, t, s) {
    const u = span(t, A.pays + .4, A.den + .2), out = B.ease(t, A.afford - .2, A.afford + .7, quartIO); if (u <= 0 || out >= 1) return;
    const sl = B.ease(t, A.law - .3, A.howlong + 1.0), xe = lerp(1460, 1720, sl), xr = xe - 300, y = lerp(LY, 600, quartIO(u)) + out * 260;
    c.save(); c.beginPath(); c.rect(-3000, -3000, 9000, LY - 1 + 3000); c.clip();
    X.lifeline(c, t, 760, xe, y, s, { u: 1, end: span(u, .5, 1), spark: false });
    c.fillStyle = rgba(CREAM, .9); c.fillRect(xr - 1.5 / s, y - 18 / s, 3 / s, 36 / s);
    X.drawPath(c, [[xr, y + 30], [xe, y + 30]], span(u, .6, 1), { col: rgba(CREAM, .4), w: 1.4 / s, dash: [6 / s, 6 / s] });
    X.label(c, SRC.plan3[2], xr, y - 34, span(u, .4, 1), { size: 26 });
    if (sl > 0 && sl < 1) { halo(c, xe, y, 60 / s, .5 * Math.sin(Math.PI * sl), GOLD.halo, GOLD.core); halo(c, xr, y, 50 / s, .4 * Math.sin(Math.PI * sl), GOLD.halo, GOLD.core); }
    c.restore();
  }
  function clinicAt(c, t, x, s, door) {
    const y = LY - 2, w = 280, h = 190;
    c.fillStyle = mixHex(P.night1, P.ind2, .7); c.fillRect(x - w / 2, y - h, w, h);
    c.fillStyle = mixHex(P.night1, P.ind2, .45); c.fillRect(x - w / 2 - 10, y - h - 14, w + 20, 16);
    c.strokeStyle = rgba(CREAM, .25); c.lineWidth = 1.6 / s; c.strokeRect(x - w / 2, y - h, w, h);
    for (const dx of [-90, 90]) { c.fillStyle = mixHex(mixHex(P.night0, P.ind1, .5), LAMP.body, .55); c.fillRect(x + dx - 18, y - h + 46, 36, 30); }
    const dw = 54, dh = 104, o = clamp(door);
    if (o > 0) { halo(c, x, y - dh / 2, 240 * o, .55 * o, GOLD.halo, GOLD.core); c.fillStyle = mixHex(GOLD.body, GOLD.core, .4); c.fillRect(x - dw / 2, y - dh, dw, dh);
      c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = lin(c, x, y, x, y + 60, [[0, rgba(GOLD.halo, .35 * o)], [1, rgba(GOLD.halo, 0)]]); c.beginPath(); c.moveTo(x - dw / 2, y); c.lineTo(x + dw / 2, y); c.lineTo(x + dw * 1.6, y + 50); c.lineTo(x - dw * 1.6, y + 50); c.fill(); c.restore(); }
    c.fillStyle = mixHex(P.night0, P.ind2, .5); c.fillRect(x - dw / 2, y - dh, dw * (1 - .85 * o), dh);   // the door leaf swings open
  }
  const CL0 = 1830, CL1 = 1210;
  function trial(c, t, s) {
    const u = span(t, A.afford + .3, A.mont + .4), out = B.ease(t, A.sup - .4, A.sup + .5, quartIO); if (u <= 0 || out >= 1) return;
    const mv = B.ease(t, A.sell - .1, A.trial + .5, quartIO), door = span(t, A.trial + .1, A.trial + .8), xs = [760, 1060, 1360, 1660];
    c.save(); c.beginPath(); c.rect(-3000, -3000, 9000, LY - 1 + 3000); c.clip(); c.translate(0, out * 300);
    // the patient walks along the line into the door
    const pw = span(t, A.trial + .5, A.ret + .2), pd = sineIO(pw), px = lerp(560, CL1 + 10, pd);
    if (pw > 0) F.person(c, px, LY - 2, 108, { pose: pw < 1 ? 'walk' : 'stand', walk: pw < 1 ? t * 5.5 : undefined, dir: 1, light: 1 });
    clinicAt(c, t, lerp(CL0, CL1, mv), s, door);
    // the people waiting outside and the 2% stream (6.23)
    const qu = span(t, A.ret - .3, A.ret + .7);
    for (let i = 0; i < 4; i++) { const k = expoOut(span(qu, i * .12, i * .12 + .6)); if (k <= 0) continue; c.save(); c.translate(0, (1 - k) * 130); F.person(c, 1480 + i * 70, LY - 2, 104 + (i % 2) * 8, { pose: i === 0 ? 'look' : 'stand', dir: -1, light: 1 }); c.restore(); }
    c.restore();
    // the phases: ticks + words above the line; phases 2 and 3 go dashed behind the clinic
    const pa = span(u, 0, .6) * (1 - out);
    for (let i = 0; i < 4; i++) { c.fillStyle = rgba(CREAM, .8 * pa * (i < 2 ? 1 : 1 - .6 * mv)); c.fillRect(xs[i] - 1.5 / s, LY - 14 / s, 3 / s, 28 / s); }
    for (let i = 0; i < 3; i++) X.label(c, B.LOCAL.phases[i], (xs[i] + xs[i + 1]) / 2, LY + 46, span(u, .2 + i * .15, .7 + i * .15) * (1 - out) * (i ? 1 - .55 * mv : 1), { size: 24, gold: i === 0 ? .6 * mv : 0 });
    const su = span(t, A.ret + .4, A.ret + 1.6) * (1 - out);
    if (su > 0) {
      const a0 = [CL1 + 40, LY - 70], a1 = [1480, LY - 120], cp = [1350, LY - 260], pts = Array.from({ length: 25 }, (_, i) => B.quad(a0, cp, a1, i / 24));
      F.goldSpan(c, pts, 0, su, { w: 2 / s, spark: su < 1 });
      for (let k = 0; k < 6; k++) { const ph = ((t * .45 + k / 6) % 1); if (ph > su) continue; const p = B.quad(a0, cp, a1, ph); halo(c, p[0], p[1], 18 / s, .7, GOLD.halo, GOLD.core); }
      X.label(c, B.pct(SRC.montana), 1350, LY - 214, B.lab(t, A.ret + .8, A.sup), { size: 30, gold: .8 });
    }
  }
  function balance(c, t, s) {
    const u = span(t, A.sup - .2, A.sup + .9), out = B.ease(t, A.most - .3, A.most + .7, quartIO); if (u <= 0 || out >= 1) return;
    const tilt = -.13 * expoOut(span(t, A.sup + .4, A.sup + 1.2)) + .2 * expoOut(span(t, A.crit + .2, A.crit + 1.1)) - .07 * span(t, A.crit + 1.1, A.most) + .01 * Math.sin(t * 1.7);
    c.save(); c.beginPath(); c.rect(-3000, -3000, 9000, LY - 1 + 3000); c.clip(); c.translate(0, out * 420);
    B.balance(c, t, 960, LY, 330, 440, s, { u, tilt, left: SRC.access, leftU: span(t, A.sup + .3, A.sup + .9), right: SRC.risk, rightU: span(t, A.crit + .2, A.crit + .8) });
    c.restore();
  }
  // ------------------------------------------------------------------ 6.28 Sweden · 6.29 1 IN 5 · 6.30 THE ANSWER
  const SW = { x0: 560, x1: 1480, y0: 700 };
  const feared = (p) => SW.y0 - 440 * Math.pow(p, 1.8), projected = (p) => SW.y0 - 150 * (1 - Math.exp(-2.2 * p)) / (1 - Math.exp(-2.2));
  function sweden(c, t, s) {
    const u = span(t, A.swe + .2, A.slow + .8), out = B.ease(t, A.even - .2, A.even + .9, quartIO); if (u <= 0 || out >= 1) return;
    const fl = (f) => (p) => lerp(f(p), LY, out), cv = (f) => Array.from({ length: 31 }, (_, i) => [lerp(SW.x0, SW.x1, i / 30), fl(f)(i / 30)]);
    X.drawPath(c, [[SW.x0, SW.y0], [SW.x0, LY]], span(u, 0, .3) * (1 - out), { col: rgba(CREAM, .35), w: 1.4 / s });
    X.drawPath(c, cv(feared), span(u, .1, .8), { col: rgba(CREAM, .6), w: 2.6 / s, dash: [12 / s, 9 / s] });
    F.goldSpan(c, cv(projected), 0, span(t, A.slow - .4, A.slow + 1.2), { w: 3 / s });
    halo(c, SW.x0, lerp(SW.y0, LY, out), 50 / s, .6 * (1 - out), GOLD.halo, GOLD.core);
    X.label(c, B.LOCAL.feared, SW.x1 + 24, feared(1) + 10, B.lab(t, A.swe + 1.2, A.even), { size: 26, align: 'left', col: rgba(CREAM, .8) });
    X.label(c, B.LOCAL.projected, SW.x1 + 24, projected(1) + 10, B.lab(t, A.slow + .6, A.even), { size: 26, align: 'left', gold: .7 });
    X.label(c, B.LOCAL.sweden, SW.x0 - 20, 330, B.lab(t, A.swe + .4, A.even), { size: 30, align: 'left', spacing: .16 });
  }
  function dotsAnswer(c, t, s) {
    const du = span(t, A.even + .4, A.even + 1.6), fold = quartIO(span(t, A.would - .45, A.would + .6)), on = KIDS * sineIO(span(t, A.five - .2, A.five + .9));
    const X0 = 960 - 135, Y0 = 380, AW = 560, AY = 540;
    if (du > 0 && fold < 1) for (let i = 0; i < 100; i++) {
      const d = expoOut(span(du, i / 100 * .7, i / 100 * .7 + .3)); if (d <= 0) continue;
      const gx = X0 + (i % 10) * 30, gy = Y0 + Math.floor(i / 10) * 30, lit = clamp(on - i), bx = 960 - AW / 2 + i / 99 * AW, f = clamp(fold * 1.15 - (i % 10) * .015);
      const x = lerp(gx, bx, f), y = lerp(gy, AY, f), r = lerp(8.5, 3, f) * d;
      if (lit > 0 && i % 7 === 0) halo(c, x, y, r * 3, .25 * lit * (1 - f), GOLD.halo, GOLD.core);
      c.fillStyle = lit > 0 ? mixHex(CREAM, GOLD.body, lit) : rgba(CREAM, .22); c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
    }
    const au = span(t, A.would - .1, A.would + .8);
    if (au > 0) F.answer(c, t, 960, AY, AW, .02 * Math.sin(t * 1.2), { u: au, tremble: 5 * span(t, A.would + .4, A.would + 1) });
  }

  function draw(ctx, t) {
    const v = view(t), pl = pool(t);
    B.ground(ctx, t, v, { lx: pl[0], ly: pl[1], dawn: 1 });
    X.inView(ctx, v, (s) => {
      // the fork flattens into the line (6.13); the line lives until the dots (6.29) and lifts into the answer
      const fl = span(t, tA, tA + 1.3), lineOut = B.ease(t, A.even - .1, A.even + 1.2, quartIO), lineU = span(t, tA + .5, tA + 2.0);
      if (fl < 1) B.drawFork(ctx, t, s, { flat: fl, flatY: LY, open: 1 - span(t, tA, tA + .8) });
      if (lineU > 0 && lineOut < 1) X.lifeline(ctx, t, -600, 2600, LY, s, { u: lineU, from: PF.x0, spark: false, a: 1 - lineOut });
      if (fl >= 1 && lineU < 1) B.drawFork(ctx, t, s, { flat: 1, flatY: LY, open: 0, axis: 0, up: 0 });
      ring(ctx, t, s); voters(ctx, t, s); ledge(ctx, t, s); retire(ctx, t, s); trial(ctx, t, s); balance(ctx, t, s);
      row(ctx, t, s); cards(ctx, t, s, v); sweden(ctx, t, s); dotsAnswer(ctx, t, s);
    });
    X.big(ctx, SRC.kids20, W / 2, 300, 84, B.lab(t, A.five - .1, A.would - .3), { gold: 1 });
    if (t > A.den && t < A.afford + 1) F.source(ctx, t, A.den + .6, A.afford + .4, SRC.denmark);
    if (t > A.mont && t < A.sup + 1) F.source(ctx, t, A.mont + .6, A.sup + .4, SRC.montana);
    if (t > A.swe && t < A.even + 1) F.source(ctx, t, A.swe + .6, A.even + .5, SRC.gavrilov);
    if (t > A.even && t < A.would + 1) F.source(ctx, t, A.even + .8, A.would + .3, SRC.kids20Src);
  }
  const marks = [A.labs, A.steps, A.afford, A.sup, A.kids, A.even];
  return [{ t: R.a, draw: (ctx, t) => B.plateFork(ctx, t, T), print: PR }, { t: tA, draw, print: PR }, ...marks.map((t) => ({ t, draw, print: PR }))];
};
