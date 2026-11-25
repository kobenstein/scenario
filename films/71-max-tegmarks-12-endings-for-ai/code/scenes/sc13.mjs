// Film 71 · c13 (B3): THE CLOSE. One continuous take + the end screen (docs/shots.md S.01 – E.01):
//   A  the twelve from above (the frame c12 ends on): WHICH ENDING?, NO SINGLE ONE YET (a lamp pulse climbs the trunk and stops at the split),
//      the levers point both ways
//   B  the camera tilts down past you to four big switches on the yard (one truck move each):
//      1 SPEED OF THE RACE: the July tag grows into C5 (Altman), back into a hand on the left: PACE IT · a second hand: THEN CHINA LEADS
//      2 CHIPS: the chip flies in with its locator: a shield (PROTECTS) and an eye (WATCHES)
//      3 SHARED RULES: a field of countries, a cluster lit: ABOUT 30 COUNTRIES · USA and CHINA stay dark
//      4 the key leaves its pocket: WHO OWNS WHAT MACHINES EARN? · a contract: PROMISED, nobody signs: NOT BINDING
//   C  ★ the pull-up to the ranked row: five doors lift, their levers stand in the middle, the five names; LABS · GOVERNMENTS · VOTERS; a headline
//      without text lands: HOW SCARY? → WHICH ENDING? (a line to one door) → the headline grows into C6 (Tegmark)
//   D  ANCHOR 4/4: C6 goes back into the gold door of the arc; you walk toward it, all tags glow, DECIDED / THIS YEAR, subscribe 2, the calm
//      glide into S.endScreen (the last 15 s, the lower half free for the end-screen tiles).
// Anchors are phrases only. c12 | c13 share VP / planLev (scenes/sc12.mjs) so the inner boundary is one frame.
import * as F from '../lib/f71_kit.mjs';
import * as S from '../lib/f71_world.mjs';
import * as B from '../lib/b3_extra.mjs';
import { VP, seamCam, planLev, keyPocket } from './sc12.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, prng, GOLD, CREAM, CREAM2, COOL, PAPER, LAMP, DATA, TXT } = F;
const TAU = Math.PI * 2;
const ref = (ctx, vd) => ctx.transform(1 / vd.s, 0, 0, 1 / vd.s, vd.x - W / 2 / vd.s, vd.y - H / 2 / vd.s);
const inRef = (ctx, v, vd, fn, a = 1) => { if (a <= .002) return; F.inView(ctx, v, () => { ref(ctx, vd); ctx.globalAlpha *= a; fn(); }); };
const refToScreen = (v, vd, X, Y) => F.toScreen(v, vd.x + (X - W / 2) / vd.s, vd.y + (Y - H / 2) / vd.s);
const bump = (t, a, d) => Math.sin(Math.PI * span(t, a, a + d));
const out = (t, a, d = .5) => 1 - span(t, a, a + d);

// the field of countries for SHARED RULES: 15 × 13 cells; a loose cluster lit (about thirty, no exact count is the message)
const GRIDC = 15, GRIDR = 13, CELL = 18, GAP = 4;
const LIT = (() => { const r = prng(7301), cx = 6.2, cy = 5.4, s = [];
  for (let i = 0; i < GRIDC * GRIDR; i++) { const c = i % GRIDC, rr = Math.floor(i / GRIDC), d = Math.hypot((c - cx) / 1.5, rr - cy); s.push([i, d + r() * 2.6]); }
  s.sort((a, b) => a[1] - b[1]); const lit = new Map(); s.slice(0, 30).forEach(([i], k) => lit.set(i, k)); return lit; })();

export default function (T, R) {
  const G = (p, n = 0, after = R.a - 1) => T.G(p, n, after);
  const A = {
    which: R.a, whichW: G('which ending are we'), none: G('No single one yet'), both: G("This year's switches"), bothW: G('point both ways'),
    speed: G('Take the speed of the race'), after: G("After July's breakout"), runs: G('He runs a company'), opp: G('Opponents of a slowdown'), china: G('then China leads'),
    chips: G('Or the chips'), prot: G('protects'), watches: G('it watches'), rules: G('Or shared rules'), about: G('countries now call for'), human: G('human control'),
    neither: G('Neither America nor China'), america: G('America nor'), chinaW: G('China has joined'), key: G('And the key: who owns'), who: G('who owns what'),
    promise: G('Some companies now promise'), nothing: G('Nothing binding yet'), five: G('At least five of the twelve'), fiveW: G('five of the twelve'), still: G('Still open'),
    held: G('Held by labs'), labs: G('labs, governments'), gov: G('governments, and'), voters: G('the voters behind'), next: G('So at the next AI headline'), headW: G('headline'),
    scary: G('how scary'), ask: G('Ask which ending it pushes'), pushes: G('pushes us toward'), teg: G('Tegmark, who wrote down the twelve'),
    notDec: G("The ending isn't decided in the future"), decided: G("It's being decided this year"), thisYear: G('decided this year'), chan: G('This channel exists'), want: G('Want that too'), sub: G('Then subscribe'),
  };
  const C5 = T.clip('C5'), C6 = T.clip('C6'), T0 = T.duration - 15, K = F.counterTimes(T);
  const SWX = (i) => 700 + i * 800, SWY = 1480, SW = (i) => ({ x: SWX(i), y: 1330, s: 1 }), ROWV = { x: 960, y: 560, s: 1 };
  const SWAP = C6.start + 3.5;   // under the full C6 plate the world changes to the arc (ANCHOR)
  const cam = [...seamCam(T, R.a), [A.none + 1, { x: 960, y: 495, s: .975 }], [A.speed - .25, { x: 960, y: 492, s: .99 }], [A.speed + .65, { x: 840, y: 930, s: .72 }], [A.speed + 1.65, SW(0)],
    [A.chips - .35, { ...SW(0), x: SWX(0) + 12 }], [A.chips + 1.3, SW(1)], [A.rules - .45, { ...SW(1), x: SWX(1) + 10 }], [A.rules + 1.2, SW(2)], [A.key - .35, { ...SW(2), x: SWX(2) + 12 }], [A.key + 1.25, SW(3)],
    [A.nothing + .9, { ...SW(3), x: SWX(3) + 10 }], [A.fiveW - .35, { x: 2050, y: 940, s: .5 }], [A.fiveW + .55, ROWV], [A.held - .2, { x: 960, y: 566, s: 1.01 }], [A.held + 1.2, { x: 960, y: 650, s: .93 }],
    [A.next, { x: 960, y: 646, s: .935 }], [A.next + 1.2, { x: 960, y: 600, s: .96 }], [SWAP, { x: 960, y: 596, s: .965 }]];
  const yv = (t) => F.viewPath(t, cam);
  const LV = (t) => { const q = t - T0; return { x: 900, y: 600 + 4 * q, s: .9 - .004 * q }; };   // = S.endScreen's view, extended backwards

  // ---------------------------------------------------------------- the four switches
  const KNOB = (ang) => [960 + Math.sin(ang) * 140, 690 - Math.cos(ang) * 140];   // ref px of the knob at its own SW view
  const swAng = (i, t) => {
    const intro = [A.speed + .2, A.chips + .45, A.rules + .5, A.key + .5][i], sw = .32 * Math.sin(TAU * span(t, intro, intro + 1.4)) * (1 - span(t, intro + .7, intro + 1.4));
    let a = .04 * Math.sin(t * .9 + i * 1.7) + sw;
    if (i === 0) { const l = sineIO(span(t, C5.end + .35, C5.end + 1.1)), r = sineIO(span(t, A.china - .1, A.china + .6)); a += lerp(0, -.3, l) + lerp(0, .38, r) + .06 * Math.sin(t * 7.3) * span(t, A.china + .4, A.china + 1); }
    if (i >= 1 && t > A.five) a = lerp(a, 0, sineIO(span(t, A.fiveW, A.fiveW + .8)));
    return a;
  };
  const NAMES = ['SPEED OF THE RACE', TXT.end.chips, TXT.end.rules, 'WHO OWNS WHAT MACHINES EARN?'];
  const nameAt = [A.speed + .2, A.chips + .45, A.rules + .5, A.who];
  const TAG = { x: 1330, y: 300, txt: "JUL 2026 · AFTER THE BREAKOUT" };
  const tagW = F.measure(TAG.txt, 22, false, 600) * 1.08 + 44;
  const HL = { x: 960 - 205, y: 618 - 100, ang: -.3 }, HR = { ang: .38 };
  function board(ctx, t, v) {
    F.inView(ctx, v, () => {
      for (let i = 0; i < 4; i++) {
        const x = SWX(i), ang = swAng(i, t);
        ctx.strokeStyle = rgba(CREAM, .3); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 180, SWY + 22); ctx.lineTo(x + 180, SWY + 22); ctx.stroke();
        F.lever(ctx, t, x, SWY, ang, 140, { knob: bump(t, nameAt[i] - .2, 1.2) });
      }
    });
    for (let i = 0; i < 4; i++) inRef(ctx, v, SW(i), () => F.label(ctx, NAMES[i], 960, 780, span(t, nameAt[i], nameAt[i] + .6), { size: 30, spacing: .14 }));
  }
  function sw0(ctx, t, v) {   // SPEED: the tag → C5 → the left hand: PACE IT; the right hand: THEN CHINA LEADS
    const tg = span(t, A.after + .3, A.after + .9) * (t < C5.start - .85 ? 1 : 0);
    inRef(ctx, v, SW(0), () => {
      if (tg > 0) F.dateTag(ctx, TAG.txt, TAG.x, TAG.y, tg);
      const o = out(t, A.chips - .4, .5);
      const hl = span(t, C5.end + .45, C5.end + 1.05) * o, hr = span(t, A.opp + .3, A.opp + 1.0) * o;
      const ang = swAng(0, t), [kx, ky] = KNOB(ang);
      if (hl > 0) { const e = expoOut(hl); F.hand(ctx, lerp(kx - 260, kx - 92, e), ky + 26, -.22, 92, { pose: 'hold', a: clamp(hl * 3) }); }
      if (hr > 0) { const e = expoOut(hr); F.hand(ctx, lerp(kx + 260, kx + 92, e), ky + 26, Math.PI + .22, 92, { pose: 'hold', flip: -1, a: clamp(hr * 3) }); }
      F.big(ctx, TXT.end.pace, 500, 330, 64, span(t, C5.end + .35, C5.end + 1.05) * o, { gold: .2 });
      F.label(ctx, TXT.end.runs, 500, 384, span(t, A.runs + .2, A.runs + .8) * o, { size: 22, weight: 600, col: CREAM2 });
      F.big(ctx, TXT.end.china, 1420, 330, 64, span(t, A.china - .05, A.china + .65) * o, { gold: .2 });
    });
    // C5 grows out of the tag and goes back into the left hand
    if (t > C5.start - .9 && t < C5.end + .8) {
      const into = span(t, C5.start - .85, C5.start + .1), back = span(t, C5.end - .25, C5.end + .75);
      const [tx, ty] = refToScreen(v, SW(0), TAG.x - tagW / 2, TAG.y - 20), [hx, hy] = refToScreen(v, SW(0), KNOB(0)[0] - 150, KNOB(0)[1] + 30);
      F.clipPlate(ctx, t, T, 'C5', back > 0 ? { from: [hx, hy, 26], morph: 1 - back } : { from: { x: tx, y: ty, w: tagW * v.s, h: 40 * v.s, r: 20 }, morph: into });
    }
  }
  function sw1(ctx, t, v) {   // CHIPS: the chip with its locator, a shield and an eye
    const o = out(t, A.rules + .4, .5);
    inRef(ctx, v, SW(1), () => {
      const f = sineIO(span(t, A.chips, A.chips + 1.2)); if (f <= 0) return;
      const [sx, sy] = refToScreen(SW(1), SW(1), 0, 0);   // (ref px = screen px at its own view)
      const x = lerp(2000, 960, f), y = lerp(-80, 330, f) - 120 * Math.sin(Math.PI * f), s = lerp(30, 118, f);
      ctx.save(); ctx.globalAlpha *= o; F.chip(ctx, t, x, y, s, { ping: 1, rot: (1 - f) * .6 }); ctx.restore();
      B.shield(ctx, 690, 330, 150, span(t, A.prot - .15, A.prot + .5) * o);
      F.label(ctx, 'PROTECTS', 690, 456, span(t, A.prot, A.prot + .6) * o, { size: 26 });
      const eu = span(t, A.watches - .2, A.watches + .4) * o;
      if (eu > 0) F.guardEye(ctx, t, 1230, 330, 46 * expoOut(eu), { open: span(t, A.watches, A.watches + .5), a: clamp(eu * 3), look: [Math.sin(t * .8) * .5, 0] });
      F.label(ctx, 'WATCHES', 1230, 456, span(t, A.watches + .1, A.watches + .7) * o, { size: 26 });
      if (eu > 0) { ctx.save(); ctx.globalAlpha *= eu * .7; ctx.strokeStyle = rgba(CREAM, .35); ctx.setLineDash([6, 8]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(800, 330); ctx.lineTo(888, 330); ctx.moveTo(1032, 330); ctx.lineTo(1160, 330); ctx.stroke(); ctx.restore(); }
    });
  }
  function sw2(ctx, t, v) {   // SHARED RULES: the countries, a cluster lit; USA and CHINA dark
    const o = out(t, A.key + .15, .5);
    inRef(ctx, v, SW(2), () => {
      const gu = span(t, A.rules + .3, A.rules + 1.2); if (gu <= 0) return;
      const x0 = 960 - (GRIDC * (CELL + GAP) - GAP) / 2, y0 = 120;
      ctx.save(); ctx.globalAlpha *= o;
      for (let i = 0; i < GRIDC * GRIDR; i++) {
        const c = i % GRIDC, r = Math.floor(i / GRIDC), a = clamp(gu * 2 - (r / GRIDR) * .9); if (a <= 0) continue;
        const k = LIT.get(i), on = k == null ? 0 : span(t, A.about - .55 + k * .045, A.about - .3 + k * .045);
        ctx.fillStyle = on > 0 ? mixHex(mixHex(P.night1, CREAM, .14), DATA.human, on) : rgba(CREAM, .14); ctx.globalAlpha = a * o;
        ctx.beginPath(); ctx.roundRect(x0 + c * (CELL + GAP), y0 + r * (CELL + GAP), CELL, CELL, 4); ctx.fill();
      }
      ctx.restore();
      F.big(ctx, 'ABOUT 30 COUNTRIES', x0 - 40, 262, 48, span(t, A.about - .6, A.about + .1) * o, { align: 'right', gold: .15 });
      F.label(ctx, 'CALL FOR HUMAN CONTROL', x0 - 40, 306, span(t, A.human - .1, A.human + .5) * o, { align: 'right', size: 22, weight: 600, col: CREAM2 });
      // USA, CHINA: two big cells, outlined, dark
      [[A.america, 'USA', 150], [A.chinaW - .35, 'CHINA', 262]].forEach(([t0, s, y]) => {
        const u = span(t, t0, t0 + .55) * o; if (u <= 0) return; const x = x0 + GRIDC * (CELL + GAP) + 60, k = expoOut(u);
        ctx.save(); ctx.globalAlpha *= clamp(u * 3); ctx.fillStyle = rgba(P.night0, .6); ctx.strokeStyle = rgba(CREAM, .4); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(x, y + (1 - k) * 20, 72, 72, 8); ctx.fill(); ctx.stroke(); ctx.restore();
        F.label(ctx, s, x + 96, y + 46, span(u, .3, 1), { align: 'left', size: 28 });
      });
      F.label(ctx, 'NOT JOINED', x0 + GRIDC * (CELL + GAP) + 60, 384, span(t, A.america + .5, A.america + 1.1) * o, { align: 'left', size: 22, weight: 600, col: CREAM2 });
    });
    F.source(ctx, t, A.about, A.key, 'A Call for Control of Frontier AI Models · launched Sep 21, 2026');
  }
  function sw3(ctx, t, v) {   // THE KEY: out of its pocket; the contract: PROMISED, NOT BINDING
    const o = out(t, A.fiveW - .5, .5);
    const f = sineIO(span(t, A.key + .15, A.key + 1.3));
    if (f > 0 && o > 0) {
      const [px, py] = F.hudPocket('key'), [tx, ty] = refToScreen(v, SW(3), 960, 330);
      const x = lerp(px, tx, f), y = lerp(py, ty, f) - 90 * Math.sin(Math.PI * f), s = lerp(30, 150 * v.s, f);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= o; F.keyGlyph(ctx, t, x, y, s, { rot: -.12 * f + .03 * Math.sin(t * .8), glint: bump(t, A.key + 1.1, 1.4) }); ctx.restore();
    }
    inRef(ctx, v, SW(3), () => {
      B.contract(ctx, t, 1400, 140, 420, span(t, A.promise + .25, A.promise + .9) * o, { empty: span(t, A.nothing, A.nothing + .3) });
      F.label(ctx, 'NOT BINDING', 1400, 500, span(t, A.nothing + .2, A.nothing + .8) * o, { size: 30, spacing: .14 });
    });
  }
  const keyGone = (t) => t >= A.key + .15;

  // ---------------------------------------------------------------- the ranked row (★ the five)
  const FIVE = [12, 9, 7, 4, 1];
  const lift = (n, t) => { const k = FIVE.indexOf(n); return k < 0 ? 0 : sineIO(span(t, A.fiveW + k * .22, A.fiveW + .8 + k * .22)); };
  const dim = (t) => sineIO(span(t, A.fiveW, A.fiveW + 1.4));
  function row(ctx, t, v) {
    F.inView(ctx, v, () => {
      for (const e of F.ENDINGS) {
        const n = e.n, x = F.rowX(n), lf = lift(n, t), five = FIVE.includes(n), lit = five ? lerp(.55, 1, lf) : lerp(.55, .2, dim(t));
        const dy = -40 * lf, h = F.ROW.h;
        F.door(ctx, t, x, F.ROW.y + dy, F.ROW.w, h, { col: e.col, lit, beam: five ? lerp(.3, .8, lf) : .3, seed: n });
        const ang = five ? lerp(.45, 0, lf) + .07 * Math.sin(t * (6 + n * .4) + n) * lf : .45;
        S.rowLever(ctx, t, x, ang, five ? 1 : lerp(1, .5, dim(t)), five ? .6 * lf : 0);
        F.miniTag(ctx, x, F.ROW.y + dy - h - 26, 1, n);
      }
      const y = S.ROW_YOU; F.du(ctx, y.x, y.y, y.h, { hood: false, look: .2 + .3 * span(t, A.ask, A.ask + .8) + .04 * Math.sin(t * .5), light: 1 });
      // the people under the levers
      [[430, A.labs, 4, 1], [960, A.gov, 5, 2], [1490, A.voters, 9, 3]].forEach(([x, t0, n, sd]) => B.crowd(ctx, t, x, 905, n, 66, span(t, t0 - .1, t0 + .7), sd));
    });
    // the five names (screen px over their doors)
    const no = out(t, A.held - .3, .5);
    FIVE.forEach((n, k) => {
      const [X, Y] = F.toScreen(v, F.rowX(n), F.ROW.y - F.ROW.h - 120);
      F.big(ctx, n === 1 ? 'EGALITARIAN UTOPIA' : TXT.end.five[k], X, Y, n === 1 ? 40 : 40, span(t, A.fiveW + .1 + k * .22, A.fiveW + .7 + k * .22) * no, { gold: n === 1 ? 1 : .15 });
    });
    [[430, A.labs, TXT.end.who[0]], [960, A.gov, TXT.end.who[1]], [1490, A.voters, TXT.end.who[2]]].forEach(([x, t0, s]) => { const [X, Y] = F.toScreen(v, x, 950); F.label(ctx, s, X, Y, span(t, t0, t0 + .6) * out(t, A.next + .4, .6), { size: 26 }); });
  }
  // the headline: lands before the row, HOW SCARY? → WHICH ENDING?, a line to one door, then it grows into C6
  const HLR = { x: 960, y: 250, w: 600, h: 150 };
  function headlineLayer(ctx, t, v) {
    const f = sineIO(span(t, A.next + .1, A.headW + .1)); if (f <= 0 || t > C6.start + .05) return;
    const x = lerp(2300, HLR.x, f), y = lerp(120, HLR.y, f) - 60 * Math.sin(Math.PI * f);
    if (t < C6.start - .8) B.headline(ctx, x, y, HLR.w, HLR.h, 1, { rot: .25 * (1 - f) });
    F.label(ctx, 'HOW SCARY?', HLR.x, HLR.y - HLR.h / 2 - 34, span(t, A.scary - .05, A.scary + .5) * out(t, A.ask - .05, .4), { size: 34, col: CREAM2 });
    F.big(ctx, TXT.end.which, HLR.x, HLR.y - HLR.h / 2 - 30, 52, span(t, A.ask + .2, A.ask + .8) * out(t, A.teg + .1, .5), { gold: .2 });
    const lu = span(t, A.pushes - .1, A.pushes + .6) * out(t, A.teg - .2, .6);
    if (lu > 0) { const [dx, dy] = F.toScreen(v, F.rowX(4), F.ROW.y - F.ROW.h - 40 * lift(4, t) - 44); F.lightLine(ctx, [[HLR.x, HLR.y + HLR.h / 2 + 6], [dx, dy]], expoOut(lu), { w: 3, a: .85 }); halo(ctx, dx, dy, 60, .45 * lu, LAMP.body, LAMP.core); }
  }

  // ---------------------------------------------------------------- the arc (ANCHOR 4/4) and subscribe 2
  const youAt = (t) => { const u = sineIO(span(t, A.notDec - .2, A.chan + 1.5)); return { x: lerp(870, 895, u), y: lerp(880, 742, u), h: lerp(118, 92, u), walk: u > 0 && u < 1 ? t * 6 : undefined, look: lerp(.15, .35, u) }; };
  const goldSlot = (t) => ({ open: .22 + .02 * Math.sin(t * .6), inner: (c, box) => { c.fillStyle = GOLD.core; c.fillRect(box.x0, box.y0, box.w, box.h); } });
  function arc(ctx, t) {
    const v = LV(t);
    S.leitbild(ctx, t, { v, beams: .75, stars: 1, slots: (i) => (i === S.GOLD_SLOT ? goldSlot(t) : { lit: .7 }), you: youAt(t) });
    // every switch was touched this year: the tags glow over the doors, then settle back into them
    F.inView(ctx, v, () => { for (let i = 0; i < 12; i++) { const d = S.thumbSlot(i), u = span(t, A.notDec + .3 + i * .05, A.notDec + .9 + i * .05) * out(t, A.chan - .6, .8); if (u <= 0) continue;
      F.miniTag(ctx, d.x, d.y - d.h - 24, u, F.THUMB_ORDER[i]); halo(ctx, d.x, d.y - d.h - 24, 44, .45 * u * (.8 + .2 * Math.sin(t * 2 + i)), LAMP.body, LAMP.core); } });
    F.big(ctx, 'DECIDED', W / 2, 190, 88, span(t, A.decided + .45, A.decided + 1.1) * out(t, A.chan - .3, .5), { gold: .55 });
    F.big(ctx, 'THIS YEAR', W / 2, 292, 88, span(t, A.thisYear + .5, A.thisYear + 1.15) * out(t, A.chan - .25, .5), { gold: .7 });
    button(ctx, t);
    const gr = span(t, A.sub + 1.2, T0); if (gr > 0) { ctx.save(); ctx.globalAlpha = gr; ctx.fillStyle = lin(ctx, 0, 560, 0, H, [[0, rgba(P.night0, 0)], [.35, rgba(P.night0, .55)], [1, rgba(P.night0, .8)]]); ctx.fillRect(0, 560, W, H - 560); ctx.restore(); }
  }
  function button(ctx, t) {   // a plain subscribe button: rises, glows on "Want that too?", is pressed on "subscribe" and sinks away
    const u = span(t, A.chan + .5, A.chan + 1.2), gone = span(t, A.sub + .45, A.sub + 1.15); if (u <= 0 || gone >= 1) return;
    const k = expoOut(u), press = bump(t, A.sub, .3), w = 380, h = 84, x = W / 2, y = 240 + (1 - k) * 40 + expoIn(gone) * 70;
    const glow = span(t, A.want, A.want + .6);
    ctx.save(); ctx.globalAlpha *= clamp(u * 3) * (1 - gone); ctx.translate(x, y); ctx.scale(1 - .07 * press, 1 - .07 * press);
    if (glow > 0) halo(ctx, 0, 0, 260, .35 * glow * (1 - gone), LAMP.body, LAMP.core);
    ctx.fillStyle = mixHex(P.night1, LAMP.deep, .35 * glow + .3 * press); ctx.strokeStyle = mixHex(CREAM, LAMP.core, glow); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fill(); ctx.stroke();
    F.glowText(ctx, 'SUBSCRIBE', 0, 11, { size: 32, weight: 700, align: 'center', col: CREAM, glow: false, spacing: .22 });
    ctx.restore();
  }

  // ---------------------------------------------------------------- the take
  function draw(ctx, t) {
    if (t >= SWAP) {
      arc(ctx, t);
      if (t < C6.end + .6) { const v = LV(t), d = S.thumbSlot(S.GOLD_SLOT), [x0, y0] = F.toScreen(v, d.x - d.w / 2, d.y - d.h), back = span(t, C6.end - .05, C6.end + .5);
        F.clipPlate(ctx, t, T, 'C6', { from: { x: x0, y: y0, w: d.w * v.s, h: d.h * v.s, r: 3 }, morph: 1 - back }); }
      return;
    }
    const v = yv(t);
    F.yard(ctx, t, v, { lx: v.x, ly: v.y - 60, pool: .8, rails: 1 });
    if (t < A.speed + 2.2) {
      const pulseA = out(t, A.bothW + .1, .6);
      B.planScene(ctx, t, v, { slabs: (n) => ({ lit: n === 1 ? 1 : .6, a: 1 }), fan: 1, lev: planLev(t, T), you: 1, pulse: span(t, A.whichW + .3, A.none + .1), pulseA });
      if (pulseA > 0) F.inView(ctx, v, () => { const g = span(t, A.none, A.none + .4) * pulseA; if (g > 0) halo(ctx, B.PLAN.split[0], B.PLAN.split[1], 80, .4 * g * (.8 + .2 * Math.sin(t * 3)), LAMP.body, LAMP.core); });
      F.big(ctx, TXT.end.which, W / 2, 132, 74, span(t, A.whichW, A.whichW + .7) * out(t, A.none - .25, .5), { gold: .25 });
      F.big(ctx, TXT.end.none, W / 2, 132, 74, span(t, A.none + .05, A.none + .75) * out(t, A.speed - .4, .5), { gold: .1 });
    }
    if (t > A.speed - .5 && t < A.fiveW + 1.5) { board(ctx, t, v); sw0(ctx, t, v); sw1(ctx, t, v); sw2(ctx, t, v); sw3(ctx, t, v); }
    if (t > A.nothing) { row(ctx, t, v); headlineLayer(ctx, t, v); }
    if (t > C6.start - .85) { const into = span(t, C6.start - .8, C6.start + .1), [hx, hy] = [HLR.x - HLR.w / 2, HLR.y - HLR.h / 2];
      F.clipPlate(ctx, t, T, 'C6', { from: { x: hx, y: hy, w: HLR.w, h: HLR.h, r: 4 }, morph: into });
      // the paper peels off top-down (a mask carried by the headline) and shows the footage under it
      const wu = sineIO(span(into, 0, .35)); if (wu < 1) { ctx.save(); ctx.beginPath(); ctx.rect(hx - 40, hy - 20 + (HLR.h + 40) * wu, HLR.w + 80, HLR.h + 60); ctx.clip(); B.headline(ctx, HLR.x, HLR.y, HLR.w, HLR.h, 1, { rot: 0 }); ctx.restore(); } }
    F.counterHud(ctx, t, T, { parked: 'key' });
    if (!keyGone(t)) keyPocket(ctx, t);
  }
  return [
    { t: R.a, draw, print: F.PRINT71 },
    { t: T0, draw: (ctx, t) => S.endScreen(ctx, t, T), print: F.PRINT71 },
  ];
}
