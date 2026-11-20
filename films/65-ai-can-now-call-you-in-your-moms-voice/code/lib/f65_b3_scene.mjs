// Film 65 · B3 (c12–c16, 'Then one step is left' → end) · ONE continuous take for the whole group: every chunk file returns the same
// draw function, so the inner boundaries (c12|c13|c14|c15|c16) match frame for frame by construction. The group starts on plateLine(5)
// (seam B2 → B3) and ends on the 15 s end picture (S.END_CAM + S.endState()).
// One world (THE LINE) with one world camera (S.camPath through phrase-anchored keys, S.drift always on); three things open out of it as
// portals and close back into it: the bank's counter window (the hall: one window, then two), her kitchen window (the kitchen), and in
// the kitchen her phone screen (the study panel). Clips: S2 grows out of the counter glass. Plan: docs/shots.md 5.01–E.01.
import * as E from './f10_editorial.mjs';
import * as F from './f65_kit.mjs';
import * as S from './f65_seams.mjs';
import * as B from './f65_b3_draw.mjs';
import { createCanvas } from '@napi-rs/canvas';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoIn, expoOut, mixHex, halo } = E;
const { rise, maskLine, GOLD, COPY, NEUTRAL, LAMP, bump } = F;

export const PRINT = F.PRINT65;
const CACHE = new WeakMap();
let LAYER = null;
export function b3Scene(T) {
  if (!CACHE.has(T)) { E.prepareEditorial(); CACHE.set(T, scene(anchors(T), T)); }
  return CACHE.get(T);
}

// ------------------------------------------------------------------------------------------------------------------ anchors (phrases only)
function anchors(T) {
  const a = {}, G = (p, after) => T.G(p, 0, after ?? a.T0 ?? 0), GE = (p, after) => T.GE(p, 0, after ?? a.T0);
  a.T0 = T.G('Then one step is left'); a.T1 = a.T0 + S.SEAM_HALF;
  // c12
  a.fifth = G('The fifth'); a.money = G('the money'); a.noM = G('And this is the one'); a.fake = G('no machine can fake');
  a.savings = G('Her savings sit'); a.bank = G('in a bank'); a.reach = G('To reach the scammer'); a.leave = G('have to leave');
  a.forged = G('A voice can be forged'); a.real = G('A transfer has to be real'); a.pass = G('And a real transfer can pass'); a.person = G('real person');
  a.agree = G('So put an agreement'); a.name = G('Your mother can name'); a.trusted = G('her trusted contact'); a.cent = G("You can't withdraw");
  a.wrong = G('But if something looks'); a.firm = G('the firm may call'); a.brokers = G('Brokers in the United'); a.mustAsk = G('must ask for');
  a.banks = G("Banks don't have"); a.herself = G('So she has to bring');
  // c13
  a.law = G('And the law is moving'); a.md = G('Maryland and North'); a.nc = G('North Carolina'); a.hold = G('hold a suspicious'); a.alert = G('alert that contact');
  a.lobby = G('own lobby group'); a.notice = G('can notice'); a.fright = G('frightened'); a.secret = G('secretive'); a.coached = G('or coached');
  a.speaking = G('lobby speaking'); a.ask = G('Ask her bank'); a.holdIt = G('will you hold it'); a.who = G('who gets the call');
  a.often = G('How often these agreements'); a.never = G('never been measured'); a.covers = G('But this one covers'); a.convinced = G('already convinced');
  a.strange = G('Which is strange'); a.newest = G('The newest machine'); a.form = G('a name on a form'); a.why = G('Why', a.form);
  // c14
  a.original = G('Because a copy needs'); a.rec = G('A recording'); a.photo = G('A photo'); a.life = G('A life posted'); a.whatever = G('Whatever reaches');
  a.copied = G('copied from that'); a.word = G('But the word you chose'); a.recorded = G('never recorded'); a.neither = G('Neither was the name'); a.herBank = G('gave her bank');
  a.table = G('the machine was never at'); a.history = G('For all of history'); a.proof = G('was proof'); a.ended = G('That has ended'); a.trust = G('So trust has to move');
  a.agreed = G('what you have agreed');
  // c15
  a.scams = G("And it won't stop"); a.study = G('In one small study'); a.chatted = G('people chatted'); a.trustedAI = G('They trusted the'); a.request = G('agreed to its request');
  a.twice = G('more than twice'); a.holds = G('If that holds up'); a.glimpse = G('early glimpse'); a.families = G('And for many families'); a.call = G('It arrives as a phone');
  a.answer = G('And the answer to it'); a.kt = G('that kitchen table'); a.ten = G('Ten minutes'); a.week = G('this week'); a.oneWord = G('One word');
  a.onePerson = G('One person to call'); a.oneName = G('One name at the bank'); a.yourself = G('the same for yourself');
  // c16
  a.evening = G('And one evening'); a.ring = GE('her phone does ring'); a.yourV = G("It's your voice", a.evening); a.tears = G('In tears', a.evening);
  a.asking = G('Asking for money', a.evening); a.flaw = G("doesn't listen for a flaw"); a.asks = G('She asks for the word'); a.quiet = G('The line goes quiet'); a.quietE = GE('The line goes quiet');
  a.copy2 = G('A machine can copy', a.evening); a.agreedOn = G("It can't copy what"); a.channel = G('This channel exists', a.evening); a.subscribe = G('Then subscribe', a.evening);
  a.END = T.duration; a.E0 = a.END - 15;                       // the end picture: 15 s
  a.s2 = F.clipWin(T, 'S2');
  return a;
}

// ------------------------------------------------------------------------------------------------------------------ cameras
const BW = S.bankWinWorld(), WIN = S.winWorld();
const lookBank = (mag, sy = 560, hz = 560) => S.look(BW[0], BW[1], BW[2], mag, 960, sy, hz);
const lookWin = (mag, sy = 560) => S.look(WIN[0], WIN[1], WIN[2], mag, 960, sy, 600);
const WIDE_YOU = E.cam3({ x: 1160, y: -330, z: 1550, hz: 600 });        // the bank, the line, you on the near hill (★ the firm may call you)
const VALLEY = E.cam3({ x: 1000, y: -960, z: 820, hz: 440 });           // over the valley: the town, the glow behind the ridge
const THUMB2 = E.cam3({ x: 700, y: -300, z: 1450, hz: 600 });           // behind you, her window across the valley
const LINE_ALL = S.look(-200, 330, 6400, 1.7, 960, 720, 600);           // the whole line, all five tags gold
const pl5 = (t, T) => S.lineCam(5, S.creep(t, T, S.LINE_PHRASE[5]));
function keys(a, T) {
  return [
    [a.T1, pl5(a.T1, T)],
    [a.fake + .6, S.look(1260, 215, 6420, 2.45, 760, 565, 534)],                       // pole 5 left, the bank right: the copy slides off
    [a.bank, lookBank(3.6)], [a.bank + 1.1, lookBank(5.4)],                            // into the counter window
    [a.cent + .2, lookBank(5.7)], [a.cent + 1.7, lookBank(2.6, 600, 580)],               // back out
    [a.firm - .3, WIDE_YOU], [a.brokers - .2, E.cam3({ x: 1180, y: -320, z: 1800, hz: 600 })],   // ★ the gold arc bank → your phone
    [a.brokers + .9, lookBank(3.6)], [a.mustAsk + .1, lookBank(5.4)],                 // into the hall
    [a.convinced + .3, lookBank(5.7)], [a.strange + .1, lookBank(2.4, 600, 560)],
    [a.form - .6, E.cam3({ x: 820, y: -745, z: 1300, hz: 445 })],                       // up: the huge glow, the small bank
    [a.original + 1.2, E.cam3({ x: 1000, y: -930, z: 980, hz: 440 })], [a.whatever, VALLEY], [a.copied + .3, E.cam3({ x: 960, y: -1060, z: 620, hz: 440 })],
    [a.word + 1.0, lookWin(3.8)], [a.recorded + .3, lookWin(5.2)],                     // to her window → the kitchen
    [a.holds + .4, lookWin(6.4)], [a.holds + 2.0, lookWin(2.6, 600)],                    // back out
    [a.glimpse + 2.2, E.cam3({ x: 900, y: -900, z: 850, hz: 455 })], [a.families - .1, E.cam3({ x: 860, y: -850, z: 980, hz: 465 })],
    [a.call - .4, THUMB2], [a.answer + .2, E.cam3({ x: 660, y: -300, z: 1600, hz: 600 })],
    [a.kt - .5, lookWin(3.8)], [a.kt + .5, lookWin(5.2)],
    [a.yourself + .8, lookWin(6.0)], [a.evening + .2, lookWin(3.2)], [a.ring - 1.0, lookWin(3.8)], [a.ring, lookWin(5.4)],
    [a.quietE + .4, lookWin(6.6)], [a.copy2 + 1.6, lookWin(1.9, 700)], [a.channel - .3, LINE_ALL],
    [a.E0 - 1.0, S.END_CAM],
  ];
}
// world-state helpers
const mixCam = (p, q, u) => ({ ...q, x: lerp(p.x, q.x, u), y: lerp(p.y, q.y, u), z: lerp(p.z, q.z, u), hz: lerp(p.hz ?? 640, q.hz ?? 640, u) });

// ------------------------------------------------------------------------------------------------------------------ the scene
function scene(a, T) {
  const K = keys(a, T);
  // the three town windows the tiles grow out of (picked once, with the c14 camera): left, middle, right of the frame
  const TW = (() => { const out = []; for (const want of [480, 960, 1440]) { let best = null, bd = 1e9; for (const w of S.WINDOWS) { const p = S.proj(VALLEY, w.x, w.y, w.z); if (!p || p[1] > 760 || p[1] < 560) continue; const d = Math.abs(p[0] - want); if (d < bd) { bd = d; best = w; } } out.push(best); } return out; })();
  return (ctx, t) => {
    if (t < a.T1) { S.plateLine(ctx, t, T, 5); return; }            // the seam: exactly what c11 hands over
    // ---------------------------------------------------------------- the world camera
    let c = S.camPath(t, K);
    const blend = sineIO(span(t, a.T1, a.T1 + 2.6)); if (blend < 1) c = mixCam(pl5(t, T), c, blend);
    const endU = span(t, a.E0 - 1.0, a.END);
    if (t > a.E0 - 1.0) { const k = 1 + .0025 * (t - (a.E0 - 1.0)); c = S.plateCam(S.END_P, k); }   // the end picture: a slow breath of a push
    const dA = (.5 + .5 * span(t, a.T1, a.T1 + 2.6)) * span(t, a.T1, a.T1 + .8) * (1 - .75 * span(t, a.E0 - 3, a.E0));
    c = S.drift(c, t, 3000, 1.7 * dA, 66);
    // ---------------------------------------------------------------- portals
    const lmB = sineIO(span(t, a.bank - .1, a.bank + 1.0)) * (1 - sineIO(span(t, a.cent + .25, a.cent + 1.45)))
      + sineIO(span(t, a.brokers + .55, a.mustAsk + .25)) * (1 - sineIO(span(t, a.convinced + .3, a.convinced + 1.6)));
    const lmK = sineIO(span(t, a.recorded - .7, a.recorded + .3)) * (1 - sineIO(span(t, a.holds + .4, a.holds + 1.6)))
      + sineIO(span(t, a.kt - .4, a.kt + .6)) * (1 - sineIO(span(t, a.yourself + .9, a.yourself + 2.3)))
      + sineIO(span(t, a.ring - .95, a.ring + .05)) * (1 - sineIO(span(t, a.quietE + .5, a.quietE + 1.8)));
    // ---------------------------------------------------------------- the world state
    const tag5 = rise(span(t, a.firm - .1, a.firm + .6));
    const evening = span(t, a.evening, a.ring - .7), townBack = sineIO(span(t, a.copy2, a.channel + 3));
    const st = {
      tags: { lit: (k) => (k < 5 ? 1 : tag5), hi: 5, hiA: 1 - tag5 },
      source: {
        a: Math.max(0, lerp(.55, .4, span(t, a.T1, a.fake)) + .9 * sineIO(span(t, a.newest - .2, a.form)) * (1 - span(t, a.copied + .6, a.word + 1.2)) + .25 * bump(t, a.whatever + .8, 3.2)
          + .75 * sineIO(span(t, a.glimpse - .3, a.glimpse + 2.2)) * (1 - span(t, a.answer - .5, a.kt)) + .3 * bump(t, a.call - .2, 3.0)
          - lerp(0, .4, span(t, a.copy2 + 1.0, a.subscribe))),
        pulse: .3 + .7 * bump(t, a.newest - .2, a.why - a.newest + 1.2) + .7 * bump(t, a.glimpse - .3, a.families - a.glimpse + .4),
      },
      bank: { win: lerp(.8, .7, endU), glow: lerp(.35, .8, sineIO(span(t, a.money - .2, a.money + .8))) * (1 - .45 * span(t, a.word, a.word + 2)) * (1 - .35 * span(t, a.copy2, a.subscribe)) + .25 * bump(t, a.convinced + .9, 2.4) },
      wire: { gold: lerp(1, .8, span(t, a.copy2 + 1, a.E0)), u: lerp(5, 7, sineIO(span(t, a.firm - .2, a.firm + 1.0))) },
      house: { win: 1 + .45 * bump(t, a.recorded - 1.6, 2.2) + .45 * bump(t, a.kt - 1.4, 2.0) + .45 * bump(t, a.ring - 1.6, 2.0) + .15 * span(t, a.channel, a.E0), two: sineIO(span(t, a.channel + 2.5, a.subscribe)) },
      town: { a: 1, lit: (k, w) => w.lit * (1 - clamp((evening * 1.4 - ((k * 37) % 46) / 46) * 4) * (1 - townBack)) },
      you: t > a.copy2 ? false : { phone: 1, screen: t > a.call - .5 ? 'wave' : 'dark', light: .55 + .45 * bump(t, a.firm - .5, 3.0) + .45 * span(t, a.call - .3, a.call + .3), ring: rise(span(t, a.firm + .5, a.firm + .8)) * (1 - span(t, a.brokers - .4, a.brokers)) + rise(span(t, a.call + .4, a.call + .7)) * (1 - span(t, a.answer - .1, a.answer + .3)), look: .1 },
      moon: t > a.yourself + .9 ? { x: lerp(1080, 960, sineIO(span(t, a.evening - 1, a.E0))), y: lerp(190, 150, sineIO(span(t, a.evening - 1, a.E0))), a: .8 } : undefined,
    };
    if (st.you && t > a.call - .5) st.you.waveCol = COPY;
    // ghost of pole 5 (5.02): drawn behind the poles
    st.back = (cx) => B.ghostPole5(cx, c, t, span(t, a.noM - .1, a.noM + 1.0), span(t, a.fake - .05, a.fake + 1.5));
    st.extra = (cx, out) => worldExtra(cx, t, a, c, out, TW);
    if (lmB < 1 && lmK < 1) S.lineWorld(ctx, c, t, st);
    else if (lmB >= 1 || lmK >= 1) { /* a portal covers the frame */ }
    // ---------------------------------------------------------------- the bank hall (portal out of the counter window)
    let hallOut = null;
    if (lmB > 0) {
      const from = S.bankWinRect(c);
      F.portal(ctx, from, { x: 0, y: 0, w: W, h: H }, lmB, (cx, w, h) => { hallOut = hallBeat(cx, t, a, w, h); }, { rim: LAMP, r: 12 * (1 - lmB), glow: lmB < .98 });
      if (hallOut) hallOut.lm = lmB;
    }
    // ---------------------------------------------------------------- the kitchen (portal out of her window)
    let kOut = null;
    if (lmK > 0) {
      const from = S.winRect(c);
      F.portal(ctx, from, { x: 0, y: 0, w: W, h: H }, lmK, (cx, w, h) => { kOut = kitchenBeat(cx, t, a, w, h); }, { rim: LAMP, r: 12 * (1 - lmK), glow: lmK < .98 });
    }
    // ---------------------------------------------------------------- the study panel on her phone (c15)
    if (kOut && kOut.phoneRect) {
      const pm = sineIO(span(t, a.study - .45, a.study + .55)) * (1 - sineIO(span(t, a.holds - .55, a.holds + .35)));
      if (pm > 0) F.portal(ctx, kOut.phoneRect, { x: 360, y: 130, w: 1200, h: 700 }, pm, (cx, pw, ph) => B.studyPanel(cx, t, pw, ph, {
        study: rise(span(t, a.study, a.study + .7)), chat: span(t, a.chatted - .2, a.chatted + 1.2), aiGlow: rise(span(t, a.trustedAI + .5, a.trustedAI + 1.4)) * (1 - span(t, a.request + .2, a.request + 1)),
        bars: span(t, a.request - .1, a.twice + .9),
      }), { rim: COPY, r: lerp(10, 18, pm), glow: pm < .98 });
    }
    // ---------------------------------------------------------------- S2 (Benda) out of the counter glass
    if (hallOut && hallOut.glass && t > a.s2.start - 1 && t < a.s2.end + 1.2) {
      const m = sineIO(span(t, a.s2.start - .55, a.s2.start + .05)) * (1 - sineIO(span(t, a.s2.end - .05, a.s2.end + .9)));
      // the frame fades in on the glass before it grows and fades out on it after it shrinks back (no pop at either end)
      const fa = span(t, a.s2.start - .55, a.s2.start - .3) * (1 - span(t, a.s2.end + .55, a.s2.end + .9));
      if (m > 0 && fa >= 1) F.clipFrame(ctx, t, T, 'S2', { from: hallOut.glass, morph: m });
      else if (m > 0 && fa > 0) {
        LAYER ??= createCanvas(W, H); const lx = LAYER.getContext('2d'); lx.setTransform(1, 0, 0, 1, 0, 0); lx.clearRect(0, 0, W, H);
        F.clipFrame(lx, t, T, 'S2', { from: hallOut.glass, morph: m });
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = sineIO(fa); ctx.drawImage(LAYER, 0, 0); ctx.restore();
      }
    }
    words(ctx, t, a, hallOut);
  };
}

// ------------------------------------------------------------------------------------------------------------------ the world's extras (screen space)
function worldExtra(cx, t, a, c, out, TW) {
  const bw = out.bankWin, ph = out.phone, wr = out.win;
  // ★ 5.04 the firm may call you: a gold arc from the bank window to your phone
  const g = sineIO(span(t, a.firm - .5, a.firm + .5)), gOut = sineIO(span(t, a.brokers - .3, a.brokers + .6));
  if (bw && ph && g > 0 && gOut < 1) {
    const pts = F.arcPts(bw.x + bw.w / 2, bw.y + bw.h * .4, ph.x, ph.y - ph.h * .2, 170, 48);
    F.voiceWave(cx, t, pts, { amp: 16, col: GOLD, seed: 9, speed: 70, u1: g, u0: gOut, taper: .12 });
  }
  // 5.11 a name on a form: a small gold paper at the counter window (scale contrast with the glow)
  const nf = rise(span(t, a.form - 1.4, a.form - .4)) * (1 - expoIn(span(t, a.original + .2, a.original + 1.0)));
  if (bw && nf > 0) { const s = clamp(bw.w * .9, 30, 96); halo(cx, bw.x + bw.w * .3, bw.y + bw.h * .55, s * 1.6, .35 * nf, GOLD.halo, GOLD.core); F.note(cx, t, bw.x + bw.w * .3, bw.y + bw.h * .55 - (1 - nf) * 8, s, { a: nf, lit: .6 + .4 * bump(t, a.form, 1.6), lines: [] }); }
  // c14 6.01 three tiles out of three town windows, ribbons from each to the glow
  const sp = out.source;
  const tl = [[a.rec, 'rec'], [a.photo, 'photo'], [a.life, 'life']];
  const back = sineIO(span(t, a.copied + .3, a.word + .3));
  tl.forEach(([t0, kind], i) => {
    const w = TW[i]; if (!w) return; const p = S.proj(c, w.x, w.y, w.z); if (!p) return;
    const u = span(t, t0 - .25, t0 + .55) * (1 - back);
    if (u <= 0) return;
    const tx = p[0] + [-40, 0, 40][i], ty = Math.min(p[1] - 210, 420 + [10, -30, 10][i]);
    const r = B.tile(cx, t, kind, tx, ty, 190, u, { from: [p[0], p[1]] });
    if (!r) return;
    const lab = ['A RECORDING', 'A PHOTO', 'A LIFE POSTED ONLINE'][i];
    maskLine(cx, [[lab, 0]], r.x, r.y + r.h / 2 + 34, 24, rise(span(t, t0, t0 + .6)) * (1 - back), { serif: false, weight: 600, col: P.cream, glow: false, align: 'center' });
    // the copy: a blue ribbon from the tile to the glow
    const ru = sineIO(span(t, a.whatever - .1 + i * .25, a.whatever + 1.4 + i * .25)), rOut = sineIO(span(t, a.copied + .5, a.word + .4));
    if (sp && ru > 0 && rOut < 1) F.voiceWave(cx, t, F.arcPts(r.x, r.y - r.h / 2, sp[0], sp[1] + 10, 120, 40), { amp: 9, col: COPY, seed: 20 + i, speed: 90, u1: ru, u0: rOut, flicker: .6, taper: .15, a: .9 });
  });
  // 6.02 the copy reaches for her kitchen window and stops at it (it was never inside)
  if (sp && wr) {
    const k = sineIO(span(t, a.word + .1, a.recorded - .2)), kOut = span(t, a.recorded + .2, a.recorded + .9);
    if (k > 0 && kOut < 1) {
      const pts = F.arcPts(sp[0], sp[1], wr.x + wr.w / 2, wr.y + wr.h / 2, 160, 48);
      F.voiceWave(cx, t, pts, { amp: clamp(wr.w * .18, 8, 30), col: COPY, seed: 31, speed: 70, u1: .86 * k + .02 * Math.sin(t * 6) * k, flicker: 1, tremble: .5, taper: .12, a: 1 - kOut });
    }
  }
  // c15 6.05 the call arrives as a phone call: a thin blue arc from the glow to your phone; 6.06 the answer: a gold arc your phone → her window
  if (sp && ph) {
    const b1 = sineIO(span(t, a.call - .3, a.call + .9)), b1o = sineIO(span(t, a.answer - .2, a.answer + .6));
    if (b1 > 0 && b1o < 1) F.voiceWave(cx, t, F.arcPts(sp[0], sp[1], ph.x, ph.y - ph.h * .2, 220, 48), { amp: 12, col: COPY, seed: 41, speed: 80, u1: b1, u0: b1o, flicker: 1, taper: .12 });
  }
  if (ph && wr) {
    const g2 = sineIO(span(t, a.answer - .45, a.answer + .65)), g2o = span(t, a.kt + .3, a.kt + .7);
    if (g2 > 0 && g2o < 1) F.voiceWave(cx, t, F.arcPts(ph.x, ph.y - ph.h * .2, wr.x + wr.w / 2, wr.y + wr.h / 2, 240, 48), { amp: 14, col: GOLD, seed: 43, speed: 70, u1: g2, taper: .12, a: 1 - g2o });
  }
}

// ------------------------------------------------------------------------------------------------------------------ the bank hall beats
// visit 1 (c12): window A full: the teller, her savings, the transfer path, her with the note (TRUSTED CONTACT)
// visit 2 (c12 end → c13): two windows (BROKER | BANK, then MARYLAND | NORTH CAROLINA), she places the note; push into A: frightened ·
// secretive · coached, S2 out of the glass, A LOBBY, the two questions, NEVER MEASURED; the note holds.
const TELLER_HAND = [990, 500];
function hallBeat(cx, t, a, w, h) {
  const v2 = t > a.cent + 2;
  const camA = B.hallCam(1010 + E.drift(t, 40, 3) - 6 * (t - a.bank), 545 + E.drift(t, 18, 7) - 2 * (t - a.bank), 1 + .02 * (t - a.bank));
  const camTwo = B.hallCam(250 + E.drift(t, 34, 5) + 7 * (t - a.brokers), 520 + E.drift(t, 18, 9), .6 + .009 * (t - a.brokers));
  const camIn = B.hallCam(960 + E.drift(t, 34, 2) - 6 * (t - a.lobby) + 30 * Math.sin((t - a.lobby) * .2), 505 + E.drift(t, 16, 4), 1.02 + .009 * (t - a.lobby));
  const cam = !v2 ? camA : B.lerpHall(camTwo, camIn, sineIO(span(t, a.lobby - .2, a.lobby + 2.2)));
  // the transfer path (visit 1): from her savings out to the right; then through the teller's hands
  const g = B.HALL.A.glass, s0 = [g.x + g.w - 140, g.y + 405 - 9 * 14];
  const P1 = [], P2 = [];
  for (let i = 0; i <= 24; i++) {
    const u = i / 24;
    P1.push([lerp(s0[0], 2300, u), lerp(s0[1], 120, u) - 120 * Math.sin(Math.PI * u)]);
    const q = u < .45 ? [lerp(s0[0], TELLER_HAND[0], u / .45), lerp(s0[1], TELLER_HAND[1], u / .45) - 70 * Math.sin(Math.PI * u / .45)] : [lerp(TELLER_HAND[0], 2300, (u - .45) / .55), lerp(TELLER_HAND[1], 120, (u - .45) / .55) - 160 * Math.sin(Math.PI * (u - .45) / .55)];
    P2.push(q);
  }
  const bend = sineIO(span(t, a.pass + .2, a.person + .3)), path = P1.map((p, i) => [lerp(p[0], P2[i][0], bend), lerp(p[1], P2[i][1], bend)]);
  const pu = span(t, a.reach - .1, a.leave + .4), pa = (1 - span(t, a.agree - .3, a.agree + .7)) * (v2 ? 0 : 1);
  const solid = lerp(.4, 1, rise(span(t, a.real, a.real + .8)));
  // her note: visit 1 she lifts it from below the frame and holds it up (TRUSTED CONTACT); visit 2 she holds it low, then places it in
  // the bank's empty place ("she has to bring it up herself"); there it stays and holds
  const [mx, my, mh] = B.HALL.mom, sl = B.HALL.slot, rest = [.3, -.2], up = [(sl[0] - 40 - mx) / mh, (sl[1] + 70 - my) / mh];
  let armU, inHand;
  if (!v2) { armU = sineIO(span(t, a.agree - .1, a.agree + 1.4)); inHand = armU; }
  else { armU = sineIO(span(t, a.herself + .1, a.herself + 1.2)) * (1 - sineIO(span(t, a.herself + 1.45, a.herself + 2.6))); inHand = t < a.herself + 1.25 ? 1 : 0; }
  const place = v2 && !inHand;
  const tg = [lerp(rest[0], up[0], armU), lerp(rest[1], up[1], armU)];
  const armR = F.reachArm([.098, -.74], tg, .17, .155, 1);
  const momLean = .05 + .04 * sineIO(span(t, a.fright - .2, a.fright + .8)) + .006 * Math.sin(t * 1.1);
  const momLook = .05 + .2 * sineIO(span(t, a.fright - .2, a.fright + .8)) * (1 - span(t, a.coached + .2, a.coached + 1.2)) - .1 * sineIO(span(t, a.secret - .1, a.secret + .7)) * (1 - span(t, a.speaking, a.speaking + 1)) + .02 * Math.sin(t * .7);
  // HOLD + ALERT (both windows)
  const holdU = span(t, a.hold - .1, a.hold + .7) * (1 - span(t, a.lobby, a.lobby + .6)), alertU = span(t, a.alert - .1, a.alert + 1.0) * (1 - span(t, a.lobby, a.lobby + .6));
  const tellerLook = v2 ? .08 + .22 * sineIO(span(t, a.notice - .2, a.notice + .8)) + .04 * Math.sin(t * .5) : .08 + .3 * sineIO(span(t, a.person - .3, a.person + .6)) * (1 - span(t, a.cent - .2, a.cent + .5)) + .04 * Math.sin(t * .5);
  const out = {};
  B.hall(cx, t, w, h, {
    cam,
    A: { stack: 9, look: tellerLook, tellerLit: !v2 ? .8 * bend * (1 - span(t, a.agree, a.agree + 1)) : .5 * bump(t, a.covers + .2, 3.4) },
    B: { a: v2 ? 1 : 0, stack: 7, look: .1 + .04 * Math.sin(t * .45 + 1) },
    mom: { a: 1, lean: momLean, look: momLook, armR },
    over: (k) => {
      if (!v2) {
        B.transferPath(k, t, path, pu, { a: pa, line: .55 * solid, n: 10, speed: 160 });
        // A VOICE CAN BE FORGED: a blue voice slips in at the top right, trembles, and is gone when the transfer has to be real
        const vf = sineIO(span(t, a.forged - .1, a.forged + .8)), vo = sineIO(span(t, a.real - .1, a.real + .7));
        if (vf > 0 && vo < 1) F.voiceWave(k, t, F.arcPts(2050, 160, 1330, 300, 60, 40), { amp: 26, col: COPY, seed: 12, speed: 80, u1: vf, u0: vo, flicker: 1, tremble: .4, taper: .15 });
      }
      // window B's form (the broker asked: the name is there, ✓) and window A's empty place (the bank did not ask)
      if (v2) {
        const bx = B.HALL.B.glass.x + 395 - 120, by = sl[1];
        const fu = rise(span(t, a.brokers + .6, a.mustAsk + .4)) * (1 - span(t, a.law, a.law + .6) * .4);
        F.note(k, t, bx, by, 170, { lines: ['TRUSTED', 'CONTACT'], a: fu, lit: .5 * fu, tilt: -.03 });
        F.checkMark(k, bx + 110, by - 90, 70, span(t, a.mustAsk, a.mustAsk + .6) * (1 - span(t, a.law, a.law + .6)), { col: GOLD });
        F.note(k, t, sl[0], sl[1], 170, { empty: rise(span(t, a.banks - .3, a.banks + .4)) * (1 - span(t, a.herself + 1.2, a.herself + 1.7)) });
        // HOLD: a gold bar closes each counter slot · ALERT: a small gold voice rises from each window to the contact
        for (const gl of [B.HALL.A.glass, B.HALL.B.glass]) {
          if (holdU > 0) F.accentSpan(k, [[gl.x + gl.w * .3, B.HALL.ledge - 8], [gl.x + gl.w * .7, B.HALL.ledge - 8]], .5 - .5 * sineIO(holdU), .5 + .5 * sineIO(holdU), { col: GOLD, w: 6, spark: false });
          if (alertU > 0) F.voiceWave(k, t, F.arcPts(gl.x + gl.w * .72, gl.y + 70, gl.x + gl.w + 90, gl.y - 90, 110, 36), { amp: 16, col: GOLD, seed: 50, speed: 60, u1: sineIO(alertU), taper: .15 });
        }
      }
    },
    top: (k, hands) => {
      // the note in her hand (visit 1: held up; visit 2: placed on the bank's counter, then it stays and holds)
      const nl = ['TRUSTED', 'CONTACT'], hp = hands.R, lit = v2 ? .45 + .45 * bump(t, a.covers - .1, 4.5) : rise(span(t, a.trusted, a.trusted + .6)) * .8;
      if (inHand > .001 && hp) F.note(k, t, hp[0] + 40, hp[1] - 70, 170, { lines: nl, a: clamp(inHand * 3), lit, tilt: -.03 });
      if (place) F.note(k, t, sl[0], sl[1], 170, { lines: nl, lit, tilt: -.03 });
    },
  });
  return { glass: B.hallRect(cam, B.HALL.A.glass), cam, v2 };
}

// ------------------------------------------------------------------------------------------------------------------ the kitchen beats
function kitchenBeat(cx, t, a, w, h) {
  const v1 = t < a.answer, v3 = t > a.evening + 1;
  let z, tx, ty;
  if (v1) {
    const t0 = a.recorded - .8, kp = sineIO(span(t, a.trust - .2, a.trust + 2.0)) * (1 - sineIO(span(t, a.scams - .4, a.scams + 1.4)));
    z = 1 + .008 * (t - t0) + .03 * Math.sin((t - t0) * .15) + .05 * kp; tx = 2 * (t - t0) - 45 * Math.sin((t - t0) * .11) + 300 * kp + E.drift(t, 30, 3); ty = E.drift(t, 16, 5) + 25 * kp;
  } else if (!v3) {
    const t0 = a.kt - .5; z = 1 + .012 * (t - t0); tx = -7 * (t - t0) + E.drift(t, 22, 3); ty = E.drift(t, 12, 5) + 3 * (t - t0);
  } else {   // the hook returns: the same framing and creep as c01's kitchen (H.06)
    const t0 = a.ring - .5, kp = sineIO(span(t, a.flaw - .3, a.asks + .2)) * .7;
    z = 1 + .024 * (t - t0) + .06 * kp; tx = 330 * kp + 15 * (t - t0) + E.drift(t, 26, 3); ty = E.drift(t, 14, 5) + 30 * kp + 4 * (t - t0);
  }
  cx.save(); cx.translate(w / 2, h / 2); cx.scale(z, z); cx.translate(-w / 2 + tx, -h / 2 + ty);
  const res = {};
  const NOTE_LINES = [{ lines: ['WORD'], cover: 1 }, { lines: ['?'], size: .4 }, { lines: ['FAMOUS', 'FACE +', 'PROFIT', '= FAKE'], size: .11 }, { lines: ['HURRY +', 'SECRET +', 'MONEY', '= STOP'], size: .1 }, { lines: ['TRUSTED', 'CONTACT'], size: .12 }];
  // gold reaching the notes (6.03): each note lights when its spark arrives
  const arrive = (k) => a.trust + 1.6 + k * .45 + .35;
  const litN = (k) => {
    let l = v1 ? .25 + .55 * span(t, arrive(k) - .1, arrive(k) + .4) : .55;
    if (v1) l += .7 * bump(t, a.recorded - .2, 1.6) * (k === 0) + .7 * bump(t, a.herBank, 1.6) * (k === 4);
    if (!v1 && !v3) l += .5 * bump(t, a.oneWord - .1, 1.4) * (k === 0) + .5 * bump(t, a.oneName - .1, 1.4) * (k === 4);
    if (v3) l = .45 + .55 * rise(span(t, a.asks + .2, a.asks + .9)) * (k === 0);
    return clamp(l);
  };
  const n5 = v1 ? sineIO(span(t, a.neither + .1, a.neither + 1.3)) : 1;
  const notes = NOTE_LINES.map((n, k) => ({ ...n, lit: litN(k), ...(k === 4 ? { a: 1 } : {}) }));
  if (v1 && n5 < 1) notes[4] = { empty: 1, a: 1 - n5 };
  // the phone on the table
  let phone;
  if (v3) {
    const reach = span(t, a.ring + .35, a.yourV - .1), lift = span(t, a.yourV - .1, a.yourV + .9);
    const ring = rise(span(t, a.ring - .15, a.ring + .2)) * (1 - span(t, a.yourV - .4, a.yourV));
    phone = { screen: lift > .3 ? 'timer' : 'call', ring, reach, lift, timer: Math.max(0, t - a.yourV), light: 1 };
    res.lift = lift;
  } else if (v1) {
    const on = rise(span(t, a.history - .3, a.history + .4)) * (1 - span(t, a.agreed + .6, a.scams - .2)) + rise(span(t, a.scams + .3, a.scams + 1.0)) * (1 - span(t, a.holds + .3, a.holds + 1));
    phone = { screen: 'dark', light: .4 + .6 * on, ring: 0 };
  } else {
    phone = { screen: t > a.onePerson - .3 ? 'contacts' : 'dark', light: .5 + .5 * span(t, a.onePerson - .4, a.onePerson + .2), ring: 0 };
  }
  const momO = { look: .02 + .015 * Math.sin(t * .7) + (v1 ? .06 * bump(t, a.table, 2.5) : 0) + (v3 ? -.06 * sineIO(span(t, a.asks - .2, a.asks + .6)) * (1 - span(t, a.quietE, a.quietE + 1)) : 0), lean: .06 + .008 * Math.sin(t * 1.1) };
  const dark = v1 ? sineIO(span(t, a.table - .1, a.table + 1.0)) * (1 - .6 * span(t, a.history, a.history + 2)) + .5 * (1 - span(t, a.recorded - .2, a.recorded + 2.2)) * (t < a.table ? 1 : 0) : 0;
  S.kitchen(cx, t, w, h, {
    notes, phone, mom: momO, dark: clamp(dark), you: !v1 && !v3 ? { x: 760, a: 1 } : false,
    extra: (kx, out) => {
      res.out = out; const ph = out.phone;
      if (v1 && ph) {
        // ★ 6.03 a gold voice = proof; it turns neutral; its gold slides onto the five notes
        const grow = sineIO(span(t, a.history + .1, a.history + 1.4)), neu = sineIO(span(t, a.ended, a.ended + .8));
        const sink = sineIO(span(t, a.agreed - .4, a.agreed + 1.2));
        if (grow > 0 && sink < 1) {
          const pts = F.arcPts(ph.x + 20, ph.y - 30, 1520, 380, 180, 48), amp = 30 + 8 * bump(t, a.proof - .1, 1.6);
          const o = { amp, seed: 7, speed: 70, u1: grow * (1 - sink), taper: .12 };
          if (neu < 1) F.voiceWave(kx, t, pts, { ...o, col: GOLD, a: 1 - neu });
          if (neu > 0) F.voiceWave(kx, t, pts, { ...o, col: NEUTRAL, a: neu * .85 });
        }
        // the gold leaves the voice and travels to the notes (sparks from the ribbon's middle, one per note)
        kx.save(); kx.globalCompositeOperation = 'lighter';
        S.NOTE_SLOTS.forEach(([nx, ny], k) => {
          const t0 = a.trust + .5 + k * .45, u = span(t, t0, arrive(k)); if (u <= 0 || u >= 1) return;
          const x0 = 1240 - k * 30, y0 = 420 + k * 6, e = sineIO(u), x = lerp(x0, nx, e), y = lerp(y0, ny, e) - 120 * Math.sin(Math.PI * u);
          halo(kx, x, y, 34, .7 * (1 - span(u, .85, 1)), GOLD.halo, GOLD.core); kx.fillStyle = rgba(GOLD.core, .95); kx.fillRect(x - 3.5, y - 3.5, 7, 7);
        });
        kx.restore();
        // note 5 arrives (6.02 "the name she gave her bank"): it slides up into its slot from below
        if (n5 > 0 && n5 < 1) { const [nx, ny] = S.NOTE_SLOTS[4]; F.note(kx, t, lerp(nx - 120, nx, n5), lerp(ny + 520, ny, n5), 112, { ...NOTE_LINES[4], tilt: .02 + .3 * (1 - n5), lit: litN(4) }); }
      }
      if (!v1 && !v3) {
        // 6.06 "and then the same for yourself": a small gold note slides across the table to you
        const s = sineIO(span(t, a.yourself - .3, a.yourself + 1.0));
        if (s > 0) { kx.save(); kx.translate(lerp(1180, 860, s), lerp(800, 812, s)); kx.scale(1, .55); F.note(kx, t, 0, 0, 92, { lines: ['?'], size: .3, a: clamp(s * 4), lit: .5 + .3 * bump(t, a.yourself + .8, 1.5), tilt: lerp(.2, -.05, s) }); kx.restore(); }
      }
      if (v3 && ph && res.lift > 0) {
        // 7.01 the hook returns: a trembling blue voice leaves the phone · 7.02 the line goes quiet: it goes flat and falls apart
        const p0 = [ph.x - 26, ph.y + 10];
        const grow = sineIO(span(t, a.yourV + .2, a.yourV + 1.4)), trem = rise(span(t, a.tears - .1, a.tears + .4)) * (1 - span(t, a.quiet, a.quiet + .6));
        const flat = sineIO(span(t, a.quiet + .4, a.quietE + .1)), fall = span(t, a.quietE - .05, a.quietE + 1.0);
        if (grow > 0 && fall < 1) {
          const arc = F.arcPts(p0[0], p0[1], 470, 420, 140, 48);
          if (fall <= 0) F.voiceWave(kx, t, arc, { amp: 34, col: COPY, seed: 5, speed: 80 * (1 - flat), u1: grow, tremble: trem, flat, flicker: 1 - flat, taper: .1 });
          else for (let j = 0; j < 5; j++) {   // the line falls apart: five pieces drop and go out one after another
            const f = span(fall, j * .1, .55 + j * .1), dy = 90 * f * f, u0 = j / 5, u1 = (j + 1) / 5 - .015;
            if (f >= 1) continue;
            F.voiceWave(kx, t, arc.map((q) => [q[0], q[1] + dy]), { amp: 34, col: COPY, seed: 5, speed: 0, u0, u1, flat: 1, a: 1 - f, taper: .04 });
          }
        }
      }
    },
  });
  cx.restore();
  // the phone screen in screen px (for the study panel portal): kitchen space → the kitchen camera (portal full: 1:1)
  const ps = res.out?.phone?.screen;
  if (v1 && ps) { const m = (x, y) => [w / 2 + z * (x - w / 2 + tx), h / 2 + z * (y - h / 2 + ty)], p0 = m(ps.x, ps.y); res.phoneRect = { x: p0[0], y: p0[1], w: ps.w * z, h: ps.h * z }; }
  return res;
}

// ------------------------------------------------------------------------------------------------------------------ words (screen space)
function words(ctx, t, a, hallOut) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const ml0 = (txt, x, y, size, u, o = {}) => { if (u > 0) maskLine(ctx, [[txt, 0]], x, y, size, u, { serif: false, weight: 600, col: P.core0, glow: true, ...o }); };
  const ml = ml0;
  // 5.01 STEP 5 OF 5 · THE MONEY
  F.stepLabel(ctx, t, 5, 'THE MONEY', rise(span(t, a.fifth - .1, a.fifth + .7)) * (1 - expoIn(span(t, a.savings - .6, a.savings + .1))));
  // 5.04 YOU CAN'T WITHDRAW A CENT
  ml('YOU CAN’T WITHDRAW A CENT', 110, 118, 56, rise(span(t, a.cent - .05, a.cent + .6)) * (1 - expoIn(span(t, a.firm - .5, a.firm + .1))));
  // 5.05 / 5.06 the two counter windows: labels above the glass (screen space, follow the hall camera)
  if (hallOut && hallOut.v2) {
    const gl = clamp((hallOut.lm - .8) / .2);
    const ml = (txt, x, y, size, u, o) => ml0(txt, x, y, size, u * gl, o);
    const c = hallOut.cam, gA = B.hallRect(c, B.HALL.A.glass), gB = B.hallRect(c, B.HALL.B.glass);
    const o1 = 1 - expoIn(span(t, a.law - .1, a.law + .5)), o2 = 1 - expoIn(span(t, a.lobby - .3, a.lobby + .3));
    ml('BROKER', gB.x, gB.y - 62, 44, rise(span(t, a.brokers + .9, a.brokers + 1.6)) * o1);
    ml('MUST ASK', gB.x, gB.y - 22, 28, rise(span(t, a.mustAsk, a.mustAsk + .6)) * o1, { col: GOLD.text, glow: false });
    ml('BANK', gA.x, gA.y - 62, 44, rise(span(t, a.banks - .2, a.banks + .5)) * o1);
    ml('NOT REQUIRED', gA.x, gA.y - 22, 28, rise(span(t, a.banks + .1, a.banks + .7)) * o1, { col: P.halo2, glow: false });
    ml('MARYLAND · 65+', gB.x, gB.y - 62, 44, rise(span(t, a.md - .1, a.md + .6)) * o2);
    ml('NORTH CAROLINA · 65+', gA.x, gA.y - 62, 44, rise(span(t, a.nc - .1, a.nc + .6)) * o2);
    ml('HOLD + ALERT', gB.x, gB.y - 22, 28, rise(span(t, a.hold - .1, a.hold + .5)) * o2, { col: GOLD.text, glow: false });
    ml('HOLD + ALERT', gA.x, gA.y - 22, 28, rise(span(t, a.hold, a.hold + .6)) * o2, { col: GOLD.text, glow: false });
  }
  F.source(ctx, t, a.brokers + .4, a.law, F.SOURCES.finra);
  F.source(ctx, t, a.md, a.lobby, F.SOURCES.states);
  // 5.07 FRIGHTENED · SECRETIVE · COACHED (they stand until the S2 frame has grown over them: "In THOSE moments")
  const wOut = 1 - span(t, a.s2.start + .05, a.s2.start + .2);
  ml('FRIGHTENED', 112, 150, 44, rise(span(t, a.fright - .05, a.fright + .5)) * wOut);
  ml('SECRETIVE', 112, 206, 44, rise(span(t, a.secret - .05, a.secret + .5)) * wOut);
  ml('COACHED', 112, 262, 44, rise(span(t, a.coached - .05, a.coached + .5)) * wOut);
  F.source(ctx, t, a.notice - .8, a.s2.start - .5, F.SOURCES.aba);
  // 5.09 A LOBBY · WILL YOU HOLD IT? · WHO GETS THE CALL?   5.10 NEVER MEASURED
  if (hallOut) {
    const gA = hallOut.glass, gl = clamp((hallOut.lm - .8) / .2);
    F.bracket(ctx, gA.x + 20, gA.x + gA.w - 20, gA.y - 26, span(t, a.speaking - .1, a.speaking + .7) * (1 - span(t, a.ask + .2, a.ask + .7)) * gl, 'A LOBBY', { size: 32 });
    F.bracket(ctx, gA.x + 20, gA.x + gA.w - 20, gA.y - 26, span(t, a.never - .1, a.never + .7) * (1 - span(t, a.covers + 1.5, a.covers + 2.1)) * gl, 'NEVER MEASURED', { size: 32 });
  }
  F.source(ctx, t, a.speaking, a.ask - .2, F.SOURCES.aba);
  const qOut = 1 - expoIn(span(t, a.often - .3, a.often + .3));
  ml('WILL YOU HOLD IT?', 112, 150, 48, rise(span(t, a.holdIt - .05, a.holdIt + .5)) * qOut);
  ml('WHO GETS THE CALL?', 112, 214, 48, rise(span(t, a.who - .05, a.who + .5)) * qOut, { col: GOLD.text });
  // 6.04 the study source
  F.source(ctx, t, a.study + .4, a.holds - .2, F.SOURCES.study);
  // 6.06 TEN MINUTES · THIS WEEK · ONE WORD · ONE PERSON TO CALL · ONE NAME AT THE BANK
  const lo = 1 - expoIn(span(t, a.yourself + .9, a.yourself + 1.6));
  ml('TEN MINUTES', 540, 190, 58, rise(span(t, a.ten - .05, a.ten + .5)) * lo);
  ml('· THIS WEEK', 540 + F.measure('TEN MINUTES ', 58, false, 600), 190, 58, rise(span(t, a.week - .05, a.week + .5)) * lo, { col: GOLD.text });
  ml('ONE WORD', 544, 262, 34, rise(span(t, a.oneWord - .05, a.oneWord + .5)) * lo, { col: GOLD.text, glow: false });
  ml('ONE PERSON TO CALL', 544, 314, 34, rise(span(t, a.onePerson - .05, a.onePerson + .5)) * lo, { col: GOLD.text, glow: false });
  ml('ONE NAME AT THE BANK', 544, 366, 34, rise(span(t, a.oneName - .05, a.oneName + .5)) * lo, { col: GOLD.text, glow: false });
  // 7.03 the thesis
  const kOut = 1 - expoIn(span(t, a.channel - .4, a.channel + .3));
  ml('A MACHINE CAN COPY', 110, 170, 60, rise(span(t, a.copy2 - .05, a.copy2 + .6)) * kOut);
  ml('YOUR VOICE.', 110, 240, 60, rise(span(t, a.copy2 + .25, a.copy2 + .85)) * kOut);
  ml('IT CAN’T COPY', 110, 330, 60, rise(span(t, a.agreedOn - .05, a.agreedOn + .6)) * kOut, { col: GOLD.text });
  ml('WHAT YOU AGREED ON.', 110, 400, 60, rise(span(t, a.agreedOn + .25, a.agreedOn + .85)) * kOut, { col: GOLD.text });
  ctx.restore();
}
