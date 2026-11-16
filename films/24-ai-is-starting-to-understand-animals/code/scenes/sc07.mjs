// c07 · The wall · toddler, prize, Alaska · 2030? · subscribe · B2. T.G('Why is meaning so hard') → T.G('But suppose they make it').
// Plan: docs/shots.md 7.01–7.17 · world/rules: docs/MOTION.md · shared: lib/f24_b2_*.mjs (the bar field with c06, the dusk medallion
// and the California field with c08).
// ONE entry, one continuous take (7.16 ✂ is not used: the elephant medallion opens instead):
// the question rises over the empty bar → the bar glides up, a bead from its cursor opens the kitchen medallion: the toddler calls and
// points, the parent hands over the cup → the sounds leave as dots (TEL AVIV UNIVERSITY · 2026 on its pin), they sort into UPSET ·
// HUNGRY · MOM/DAD → a cream listener drinks them and pours them back mixed up, a band over its bell → the medallion closes into the
// Tel Aviv pin, the map flies to the open Pacific: one whale, far off, dives → a spotlight, an empty pedestal (COLLER DOLITTLE
// CHALLENGE · UP TO $10M · UNCLAIMED) → flight to Alaska, into a large medallion: the speaker calls, the humpback answers, 20 MIN →
// the medallion grows into the clip plate [C4] and back → ONE WHALE · ONE CALL · ONE TIME → out and away to California: the gold pin
// and the quote card → the strip big: 2030? → the bar returns, NO TRANSLATOR; whale, elephant, dog medallions → the elephant
// medallion opens: the family at dusk, SO SUPERINTELLIGENCE GOES WELL FOR EVERYBODY. → it closes back (→ c08).
//
// | ID   | anchor (phrase)                  | picture (one idea)                                                  | move / carrier              |
// |------|----------------------------------|---------------------------------------------------------------------|-----------------------------|
// | 7.01 | Why is meaning so hard           | the question over the empty bar                                     | line rises                  |
// | 7.02 | Remember the baby                | bar up; its cursor opens the kitchen: toddler calls, parent knows   | bead → medallion opens      |
// | 7.03 | Researchers tested A.I.          | the sounds leave as dots; the Tel Aviv pin                          | dots                        |
// | 7.04 | Sounds their parents understand  | the dots sort under UPSET · HUNGRY · MOM/DAD                        | dots → columns              |
// | 7.05 | The best systems                 | the listener drinks them, pours them back mixed up                  | listener                    |
// | 7.06 | If machines can't yet            | the medallion closes into the pin; flight to the Pacific; one whale | close · flight              |
// | 7.07 | There's a prize worth            | spotlight, empty pedestal; COLLER DOLITTLE CHALLENGE · UP TO $10M   | pedestal rises              |
// | 7.08 | It's still unclaimed             | UNCLAIMED; the light breathes                                       | hold                        |
// | 7.09 | The closest thing yet            | flight to the Alaska pin                                            | flight                      |
// | 7.10 | Off Alaska, a humpback           | into the medallion: speaker ↔ humpback, 20 MIN                      | zoom in · waves             |
// | 7.11 | [C4]                             | the medallion grows into the plate                                  | clip                        |
// | 7.12 | One whale. One call.             | ONE WHALE · ONE CALL · ONE TIME                                     | cards                       |
// | 7.13 | And the Earth Species Project    | zoom out, flight to California; the gold pin, the quote card       | zoom out · card             |
// | 7.14 | So will they make twenty         | the strip big: 2030?                                                | strip big                   |
// | 7.15 | Today, there is no translator    | the bar; NO TRANSLATOR; whale, elephant, dog medallions             | medallions                  |
// | 7.16 | This channel exists              | the elephant medallion opens: the family at dusk; the line          | medallion opens · push      |
// | 7.17 | Want that too                    | same picture; it closes back (→ c08)                                | close                       |
import { Path2D } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f24_kit.mjs';
import * as B from '../lib/f24_b2_world.mjs';
import * as Hb from '../lib/f24_b2_habitats.mjs';
import { wallTimes, bar, worldView, fieldDim } from '../lib/f24_b2_c67.mjs';
import { duskTimes, duskMed, duskMedallion, duskClose, field, fieldView, CALQ, MED_E, MED_R, FIELD_DIM } from '../lib/f24_b2_c78.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, prng } = E;
const { rise } = F;
const TAU = Math.PI * 2;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = { ...wallTimes(T), ...duskTimes(T), end: R.b };
  a.remember = G('Remember the baby'); a.babyW = G('baby', a.remember); a.learns = G('It learns what a sound means');
  a.seeing = G('seeing', a.learns); a.aboutE = GE("seeing what it's about");
  a.res = G('Researchers tested A.I.'); a.sounds = G('Sounds their parents understand');
  a.upset = G('upset', a.sounds); a.hungry = G('hungry', a.sounds); a.mom = G('Mom', a.sounds);
  a.best = G('The best systems'); a.sortW = G('sort them', a.best); a.meaningW = G('by meaning', a.best);
  a.ifm = G("If machines can't yet"); a.whaleW = G('a whale is a long way off'); a.offE = GE('a long way off');
  a.prize = G("There's a prize worth"); a.prizeW = G('prize', a.prize); a.millions = G('millions', a.prize);
  a.uncl = G("It's still unclaimed"); a.unclW = G('unclaimed', a.uncl);
  a.closest = G('The closest thing yet'); a.offA = G('Off Alaska'); a.answer = G('seemed to answer', a.offA);
  a.recCall = G('recorded call', a.offA); a.twenty = G('twenty minutes', a.offA); a.c4 = F.clipWin(T, 'C4');
  a.oneW = G('One whale'); a.oneC = G('One call'); a.oneT = G('One time');
  a.admits = G('And the Earth Species Project admits'); a.tell = G("can't always tell", a.admits);
  a.so = G('So will they make twenty'); a.promiseE = GE("The team itself can't promise that");
  a.today = G('Today, there is no translator'); a.transW = G('translator', a.today);
  a.whales = G('whales', a.today); a.elephs = G('elephants', a.today); a.dogW = G('dog', a.today);
  a.soThat = G('so that the arrival'); a.want = G('Want that too');
  return [{ t: R.a, draw: scene(a, T), print: F.PRINT24 }];
};

// ===================================================================================================== the kitchen (7.02–7.06)
const KM = [600, 560], KR = 290;                       // the kitchen medallion
const TOD = { x: 1150, h: 190 }, PAR = { x: 690, h: 430 }, CUP0 = [897, 640];
const MOUTH = [TOD.x - .17 * TOD.h, Hb.KITCHEN.floor - .78 * TOD.h];   // the toddler's mouth (design px, F0)
// the dots: 12 sounds, three meanings
const CATS = [0, 1, 2, 1, 0, 2, 2, 0, 1, 0, 2, 1], HEAD = ['UPSET', 'HUNGRY', 'MOM/DAD'], COLX = [1120, 1370, 1620], ROW0 = 662, ROWD = 46;
const CATC = [mixHex(P.blue0, P.cream, .45), mixHex(P.shade0, P.cream, .3), P.cream];
const DOTS = (() => {
  const r = prng(2701), n = [0, 0, 0], perm = [5, 9, 0, 7, 2, 11, 3, 1, 10, 4, 8, 6];
  return CATS.map((c, i) => ({ c, j: n[c]++, cl: [1100 + r() * 540, 650 + r() * 170], seed: r() * 6, k: perm[i] }));
})();
DOTS.forEach((d) => { const q = DOTS[d.k]; d.mix = [COLX[q.c], ROW0 + q.j * ROWD]; });   // the wrong place it lands after the listener
const LIS = [1570, 300, 62];

// ===================================================================================================== the take
function scene(a, T) {
  const ambient = (t) => ({ esp: .25 + .25 * Math.sin(t * 1.3), leon: .2, dominica: .2, bahamas: .2, berkeley: .2 });   // = c06's flashPins after the words

  // ---- the bar: from the centre (c06) up to the top while the kitchen opens; it sinks before the flight
  const bg0 = a.remember - .3, bg1 = a.remember + 1.3, bs0 = a.ifm - .05, bs1 = bs0 + .55;
  const barAt = (t) => { const m = sineIO(span(t, bg0, bg1)); return { x: 960, y: lerp(540, 150, m) - 30 * Math.sin(Math.PI * m), w: lerp(600, 460, m) }; };
  const cursorAt = (t) => { const b = barAt(t); return [b.x - b.w / 2 + 34, b.y]; };

  // ---- the kitchen medallion: opens from a bead out of the cursor, closes into the Tel Aviv pin
  const ko0 = a.remember + .55, ko1 = ko0 + 1.9, kc0 = a.ifm, kc1 = kc0 + 1.35;
  const KK = [[ko0, F.aim(F.F0, 1130, 650, 3.6)], [ko1, F.aim(F.F0, 920, 640, 2.5)], [a.res, F.aim(F.F0, 935, 640, 2.55)], [a.res + 1.6, F.aim(F.F0, 1000, 650, 2.6)], [kc0, F.aim(F.F0, 1010, 650, 2.62)], [kc1, F.aim(F.F0, 1130, 650, 3.6)]];
  const kCam = (t) => B.stageCam(t, KK, 1.2, 21);
  function kitchenScene(ctx, t) {
    const c = kCam(t);
    const reach = sineIO(span(t, a.seeing - .35, a.seeing + .45)), give = sineIO(span(t, a.aboutE - .3, a.aboutE + .6));
    const point = sineIO(span(t, a.learns - .2, a.learns + .4)) * (1 - sineIO(span(t, a.aboutE + .1, a.aboutE + .8)));
    let hands = null;
    const calls = [[a.babyW + .15, 3], [a.learns + .15, 7], [a.res + .15, 11]];
    Hb.kitchen(ctx, c, t, { cup: false, cast: () => {
      const g = Hb.KITCHEN.floor;
      hands = E.person(ctx, PAR.x, g, PAR.h, { dir: 1, light: 1, back: .35, look: .15 * reach, lean: .03 + .05 * reach - .02 * give, armR: [lerp(.2, 1.15, reach) + .4 * give, lerp(.1, 1.3, reach) + .3 * give] });
      const grab = span(t, a.seeing + .3, a.seeing + .45), hp = hands.R;
      const cp = grab > 0 ? [lerp(CUP0[0], hp[0] + 10, grab), lerp(CUP0[1], hp[1] + 20, grab)] : CUP0;
      Hb.cup(ctx, cp[0], cp[1]);
      const td = Hb.toddler(ctx, t, TOD.x, g, TOD.h, { dir: -1, arm: Math.max(point, .7 * give), open: calls.reduce((m, [t0]) => Math.max(m, Math.sin(Math.PI * span(t, t0 - .1, t0 + .7))), 0) });
      // the toddler's calls: a babble floats to the parent's head and is drunk there (understood at once)
      const ph = [PAR.x + 30, g - PAR.h * .9];
      for (const [t0, seed] of calls) {
        const u = span(t, t0, t0 + 1.25); if (u <= 0 || u >= 1) continue;
        const q = sineIO(u), x = lerp(td.mouth[0] - 70, ph[0] + 60, q), y = lerp(td.mouth[1] - 10, ph[1], q) - 60 * Math.sin(Math.PI * q), s = 1 - expoIn(span(u, .55, 1));
        F.wave(ctx, t, x, y, 120 * s, 46 * s, 'babble', { bars: 14, seed, col: 'cream', live: true, u: span(u, 0, .3), head: false });
      }
      F.tick(ctx, ph[0] + 10, ph[1] - 70, 18, span(t, a.aboutE - .2, a.aboutE + .3) * (1 - span(t, a.res + 1.5, a.res + 2)), 'cream');
    } });
    return c;
  }
  const kitR = (t) => {
    if (t < ko0) return 0;
    if (t < kc0) return Math.exp(lerp(Math.log(7), Math.log(KR), B.ZIN(span(t, ko0, ko1))));
    return Math.exp(lerp(Math.log(KR), Math.log(F.PIN_R), sineIO(span(t, kc0, kc1))));
  };
  // ---- the dots (screen px)
  const DT = (d, i) => ({ te: a.res + .25 + i * .21, w: [a.upset, a.hungry, a.mom][d.c] + .05 + d.j * .09, tin: a.best + .1 + i * .07, tout: a.sortW - .2 + i * .075 });
  function dots(ctx, t, src) {
    DOTS.forEach((d, i) => {
      const k = DT(d, i); if (t < k.te) return;
      const slot = [COLX[d.c], ROW0 + d.j * ROWD], bell = [LIS[0] - .8 * LIS[2], LIS[1]], tip = [LIS[0] + 1.05 * LIS[2], LIS[1] - 4];
      let p, s = 1, col = P.cream;
      const u1 = span(t, k.te, k.te + .9), u2 = span(t, k.w, k.w + .7), u3 = span(t, k.tin, k.tin + .6), u4 = span(t, k.tout, k.tout + .75);
      const arc = (p0, p1, u, lift) => { const q = sineIO(u), cx = lerp(p0[0], p1[0], .5), cy = Math.min(p0[1], p1[1]) - lift; return [(1 - q) ** 2 * p0[0] + 2 * (1 - q) * q * cx + q * q * p1[0], (1 - q) ** 2 * p0[1] + 2 * (1 - q) * q * cy + q * q * p1[1]]; };
      const cl = [d.cl[0] + 10 * Math.sin(t * 1.3 + d.seed), d.cl[1] + 8 * Math.sin(t * 1.7 + d.seed * 2)];
      if (u2 <= 0) { p = arc(src, cl, u1, 90); s = expoOut(u1 * 2); }
      else if (u3 <= 0) { p = arc(cl, slot, u2, 60); col = mixHex(P.cream, CATC[d.c], sineIO(u2)); }
      else if (u4 <= 0) { p = arc(slot, bell, u3, 80); col = CATC[d.c]; s = 1 - .7 * expoIn(u3); if (u3 >= 1) return; }
      else { p = arc(tip, d.mix, u4, 90); col = CATC[d.c]; s = .3 + .7 * expoOut(u4); }
      const r = 10 * s * (1 + .08 * Math.sin(t * 3 + d.seed));
      halo(ctx, p[0], p[1], r * 3.4, .3, col, col);
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.fill();
    });
  }
  function sorting(ctx, t, src) {
    const out = span(t, a.ifm - .4, a.ifm + .25);
    B.sink(ctx, 870, out, 360, () => {
      HEAD.forEach((w, c) => B.caps(ctx, w, COLX[c], ROW0 - 46, 30, rise(span(t, [a.upset, a.hungry, a.mom][c] - .15, [a.upset, a.hungry, a.mom][c] + .55)), { align: 'center' }));
      const lu = rise(span(t, a.best - .1, a.best + .6));
      if (lu > 0) F.listener(ctx, t, LIS[0], LIS[1], LIS[2], { u: lu, col: 'cream', drink: Math.max(0, Math.sin(Math.PI * span(t, a.best + .1, a.sortW + .6))) * .8, blind: span(t, a.meaningW - .15, a.meaningW + .5) });
      dots(ctx, t, src);
    });
  }

  // ---- the Pacific: one whale, far off; the pedestal
  const PAC = F.mapView(-158, 37, 2.2), fp0 = kc1 - .25, fp1 = fp0 + 2.8;
  const pacHold = (t) => B.crept(PAC, 1 + .02 * Math.max(0, t - fp1));
  const WH = [-171, 30];
  function farWhale(ctx, t, v) {
    const [x, y] = F.mapXY(v, WH[0], WH[1]), up = expoOut(span(t, a.whaleW - .1, a.whaleW + .8)), dive = sineIO(span(t, a.prize - 1.5, a.prize - .8));
    for (const t0 of [a.whaleW - .2, a.prize - 1.5]) { const u = span(t, t0, t0 + 1.6); if (u > 0 && u < 1) { ctx.strokeStyle = rgba(P.cream, .5 * (1 - u)); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y + 6, 14 + 70 * expoOut(u), 4 + 16 * expoOut(u), 0, 0, TAU); ctx.stroke(); } }
    const k = up * (1 - dive); if (k <= .01) return;
    ctx.save(); ctx.beginPath(); ctx.rect(x - 200, y - 200, 400, 206); ctx.clip();   // it surfaces from (and dives under) the sea line
    F.humpback(ctx, t, x, y + 38 * (1 - k), 38, { dir: -1, light: 1, warm: .3, seed: 7, tilt: -.05 + .3 * dive, swim: .4 });
    ctx.restore();
    const sp = span(t, a.whaleW + .5, a.whaleW + 1.7); if (sp > 0 && sp < 1) for (let i = 0; i < 7; i++) { const q = expoOut(sp), an = -Math.PI / 2 + (i - 3) * .16; ctx.fillStyle = rgba(P.cream, .7 * (1 - sp)); ctx.beginPath(); ctx.arc(x - 34 + Math.cos(an) * 46 * q, y - 14 + Math.sin(an) * 52 * q, 2.4, 0, TAU); ctx.fill(); }
  }
  const pe0 = a.prize - .5, pe1 = pe0 + 1.0, px0 = a.closest - .45, px1 = px0 + .7;
  const MOTES = (() => { const r = prng(2702), s = []; for (let i = 0; i < 40; i++) s.push([r(), r(), r() * 6, .5 + r()]); return s; })();
  function pedestal(ctx, t) {
    const open = expoOut(span(t, pe0 - .3, pe0 + .5)) * (1 - expoIn(span(t, px0, px1 - .1))), up = sineIO(span(t, pe0, pe1)), out = span(t, px0, px1);
    if (open <= 0 && up <= 0) return;
    const br = 1 + .06 * Math.sin(t * 1.6) + .05 * Math.sin(t * .7 + 1), cx = 960, top = 640, base = 900, pz = 1 + .007 * Math.max(0, t - pe0);
    ctx.save(); ctx.translate(cx, 700); ctx.scale(pz, pz); ctx.translate(-cx, -700);   // a slow push on the pedestal
    if (open > 0) {   // the spotlight: a cone of light from above onto the empty top
      const w0 = 40 * open, w1 = 270 * open * br;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const g = E.lin(ctx, 0, -40, 0, top, [[0, rgba(P.cream, .02)], [1, rgba(P.halo2, .14 * open * br)]]);
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(cx - w0, -40); ctx.lineTo(cx + w0, -40); ctx.lineTo(cx + w1, top + 10); ctx.lineTo(cx - w1, top + 10); ctx.closePath(); ctx.fill();
      for (const [mx, my, ph, sp] of MOTES) { const yy = ((my + t * .02 * sp) % 1) * top, ww = lerp(w0, w1, yy / top), xx = cx + (mx - .5) * 2 * ww * .8 + 8 * Math.sin(t * .5 + ph); ctx.fillStyle = rgba(P.cream, .25 * open * (.5 + .5 * Math.sin(t + ph))); ctx.beginPath(); ctx.arc(xx, yy, 1.6, 0, TAU); ctx.fill(); }
      ctx.restore();
    }
    B.sink(ctx, 905, out, 360, () => {
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 905); ctx.clip(); ctx.translate(0, (1 - up) * 300);
      ctx.fillStyle = E.lin(ctx, cx - 160, 0, cx + 160, 0, [[0, mixHex(P.night0, P.ind1, .5)], [.6, mixHex(P.ind1, P.blue1, .5)], [1, mixHex(P.night0, P.ind1, .6)]]);
      ctx.fillRect(cx - 130, top + 24, 260, base - top - 24);   // the column
      ctx.fillStyle = mixHex(P.ind1, P.blue1, .6); ctx.fillRect(cx - 170, top, 340, 26); ctx.fillRect(cx - 170, base - 26, 340, 30);   // cap and foot
      ctx.fillStyle = E.rad(ctx, cx, top, 200, [[0, rgba(P.core1, .55 * open * br)], [1, rgba(P.halo2, 0)]]); ctx.beginPath(); ctx.ellipse(cx, top, 170, 14, 0, 0, TAU); ctx.fill();   // the empty top, lit
      ctx.fillStyle = rgba(P.halo2, .5 * open); ctx.fillRect(cx - 170, top, 340, 3);
      // UNCLAIMED: a plate on the column (cool: empty)
      const uu = rise(span(t, a.unclW - .1, a.unclW + .5));
      if (uu > 0) { ctx.fillStyle = mixHex(P.night0, P.ind0, .6); ctx.fillRect(cx - 118, 742, 236, 54); ctx.strokeStyle = rgba(mixHex(P.blue0, P.cream, .5), .8); ctx.lineWidth = 2; ctx.strokeRect(cx - 118, 742, 236, 54); B.caps(ctx, 'UNCLAIMED', cx, 780, 28, uu, { align: 'center', col: mixHex(P.blue0, P.cream, .6) }); }
      ctx.restore();
    });
    B.sink(ctx, 470, out, 260, () => {
      B.caps(ctx, 'COLLER DOLITTLE CHALLENGE', cx, 300, 32, rise(span(t, a.prizeW - .1, a.prizeW + .6)), { align: 'center' });
      B.serif(ctx, 'UP TO $10M', cx, 420, 100, rise(span(t, a.millions - .15, a.millions + .6)), { align: 'center' });
    });
    ctx.restore();
  }

  // ---- Alaska: the big medallion, the speaker and the humpback; the plate; three cards
  const ALA = F.mapView(-139, 53.5, 4.4), fa0 = a.closest - .1, fa1 = fa0 + 2.7, za0 = fa1 + .1, za1 = za0 + 2.7;
  const alaHold = (t) => B.crept(ALA, 1 + .012 * Math.max(0, t - fa1));
  const zRefA = alaHold(za0).z, RA = 300, MA = [700, 478], VA = B.medViewAt('alaska', zRefA, RA, MA);
  const pm0 = a.c4.start - .85, pm1 = a.c4.start, pb0 = a.c4.end, pb1 = pb0 + .9, ao0 = a.alaskaOut, ao1 = a.calq;
  const AK = [[za0, F.aim(F.F0, 1000, 570, 2.6)], [za1, F.aim(F.F0, 910, 560, 1.7)], [pm0, F.aim(F.F0, 900, 560, 1.65)], [pm1, F.aim(F.F0, 960, 540, 1.0)], [pb0, F.aim(F.F0, 960, 540, 1.02)], [pb1, F.aim(F.F0, 910, 560, 1.7)], [ao0, F.aim(F.F0, 920, 560, 1.75)], [ao1, F.aim(F.F0, 1000, 570, 2.6)]];
  const aCam = (t) => B.stageCam(t, AK, 1.2, 23);
  const SPK = [560, 560], HMP = [1260, 600];
  // the exchange: speaker → whale, whale → speaker … (cream waves travelling through the water)
  const XCH = (() => { const s = []; for (let i = 0; i < 6; i++) s.push({ t0: a.answer - 1.1 + i * 1.25, back: i % 2 === 1, seed: 40 + i }); return s; })();
  function alaska(ctx, t) {
    const c = aCam(t);
    let mouth = [HMP[0] - 200, HMP[1]];
    Hb.alaskaSea(ctx, c, t, { cast: () => {
      const on = XCH.reduce((m, x) => Math.max(m, x.back ? 0 : Math.sin(Math.PI * span(t, x.t0 - .1, x.t0 + .5))), 0);
      const sm = Hb.speaker(ctx, t, SPK[0], SPK[1], 46, on);
      const sing = XCH.reduce((m, x) => Math.max(m, x.back ? Math.sin(Math.PI * span(t, x.t0 - .2, x.t0 + .6)) : 0), 0);
      const w = F.humpback(ctx, t, HMP[0] + 20 * Math.sin(t * .12), HMP[1] + 14 * Math.sin(t * .3), 110, { dir: -1, light: 1, warm: .3, seed: 5, tilt: -.04 + .03 * Math.sin(t * .3) - .05 * sing, swim: .7 });
      if (w && w.mouth) mouth = w.mouth;
      for (const x of XCH) {
        const u = span(t, x.t0, x.t0 + 1.3); if (u <= 0 || u >= 1) continue;
        const p0 = x.back ? mouth : sm, p1 = x.back ? sm : mouth, q = sineIO(u), s = Math.sin(Math.PI * u) ** .5;
        F.wave(ctx, t, lerp(p0[0], p1[0], q), lerp(p0[1], p1[1], q) - 40 * Math.sin(Math.PI * q), 190 * s, 64 * s, 'song', { bars: 22, seed: x.seed, col: 'cream', live: true, head: false });
      }
    } });
  }
  const pill = (ctx, t, txt, kind, x, y, u) => {   // a small card: a dark pill with a mark and a caps line, rising from its baseline
    if (u <= 0) return; const w = 360, h = 76, k = expoOut(u);
    ctx.save(); ctx.beginPath(); ctx.rect(x - 10, y - h / 2 - 10, w + 20, h + 20); ctx.clip(); ctx.translate(0, (1 - k) * (h + 14));
    ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .5), .92); ctx.beginPath(); ctx.roundRect(x, y - h / 2, w, h, h / 2); ctx.fill(); ctx.strokeStyle = rgba(F.CREAM.line, .6); ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.beginPath(); ctx.arc(x + 40, y, 26, 0, TAU); ctx.fill();
    if (kind === 'whale') { ctx.save(); ctx.beginPath(); ctx.arc(x + 40, y, 25, 0, TAU); ctx.clip(); F.icon(ctx, 'humpback', x + 40, y, 24, { col: 'cream', t }); ctx.restore(); }
    else if (kind === 'call') F.wave(ctx, t, x + 40, y, 34, 24, 'song', { bars: 9, seed: 41, col: 'cream', head: false });
    else { ctx.fillStyle = P.cream; ctx.beginPath(); ctx.arc(x + 40, y, 7, 0, TAU); ctx.fill(); }
    B.caps(ctx, txt, x + 84, y + 11, 30, 1, {});
    ctx.restore();
  };
  function cards(ctx, t) {
    const out = span(t, ao0 - .25, ao0 + .35);
    B.sink(ctx, 620, out, 360, () => {
      [['ONE WHALE', 'whale', a.oneW], ['ONE CALL', 'call', a.oneC], ['ONE TIME', 'time', a.oneT]].forEach(([s, k, t0], i) => pill(ctx, t, s, k, 1110, 330 + i * 110, span(t, t0 - .15, t0 + .55)));
    });
  }

  // ---- California: the gold pin and the quote card; the strip big; NO TRANSLATOR and three medallions
  const qc0 = a.calq - .3, qc1 = a.so - .3;
  function quoteCard(ctx, t, hd) {
    const u = rise(span(t, qc0, qc0 + .8)), out = span(t, qc1, qc1 + .5); if (u <= 0 || out >= 1 || !hd) return;
    const [ex, ey, er] = hd, x = ex + er + 70, y = ey - 120, w = 720, h = 196;
    B.sink(ctx, y + h + 4, out, 260, () => {
      ctx.save(); ctx.beginPath(); ctx.rect(x - 60, y - 30, w + 90, h + 34); ctx.clip(); ctx.translate(0, (1 - expoOut(u)) * (h + 30));
      ctx.strokeStyle = rgba(F.GOLD.line, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ex + er + 6, ey); ctx.lineTo(x, ey); ctx.stroke();
      ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .5), .93); ctx.beginPath(); ctx.roundRect(x, y, w, h, 14); ctx.fill(); ctx.strokeStyle = rgba(F.CREAM.line, .55); ctx.stroke();
      ctx.fillStyle = F.GOLD.body; ctx.fillRect(x + 18, y, 54, 3);
      F.maskLine(ctx, [["WON'T KNOW WHEN A MODEL", 0]], x + 30, y + 72, 40, 1, { serif: true, col: P.cream, glow: false });
      F.maskLine(ctx, [['IS "ABSOLUTELY RIGHT"', 0]], x + 30, y + 124, 40, 1, { serif: true, col: P.cream, glow: false });
      B.caps(ctx, 'AP · 2025', x + 30, y + 168, 17, 1, { col: P.halo2 });
      ctx.restore();
    });
  }
  const sb0 = a.so - .1, sb1 = sb0 + 1.1, sr0 = a.promiseE - .1, sr1 = sr0 + 1.0;
  const stripBig = (t) => sineIO(span(t, sb0, sb1)) * (1 - sineIO(span(t, sr0, sr1)));
  const MEDS = [['whale', 700, a.whales], ['elephant', 960, a.elephs], ['dog', 1220, a.dogW]];
  const nt0 = a.today - .1, mo0 = a.channel - .75, mo1 = mo0 + .6;   // the bar rises; the others sink as the elephant opens
  function whaleIn(ctx, t) { Hb.deepSea(ctx, F.aim(F.F0, 960, 545, 3.6), t, { cast: () => F.humpback(ctx, t, 960 + 20 * Math.sin(t * .2), 560, 110, { dir: 1, light: 1, warm: .3, seed: 8, tilt: .03 * Math.sin(t * .4), swim: .8 }) }); }
  function dogIn(ctx, t) { Hb.kitchen(ctx, F.aim(F.F0, 990, 660, 3.4), t, { cup: false, cast: () => F.dog(ctx, t, 960, Hb.KITCHEN.floor, 380, { dir: 1, light: 1, warm: .7, seed: 4, sit: 1, tilt: .15 * Math.sin(t * .6), wag: 1 }) }); }
  function smallMed(ctx, t, x, y, r, fn) {
    if (r <= .5) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = mixHex(P.night0, P.ind1, .55); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore();
    B.inMed(ctx, x, y, r - 1, fn); B.ring(ctx, x, y, r, 'other');
  }
  function noTranslator(ctx, t) {
    const out = span(t, mo0, mo1);
    if (t >= nt0) {
      B.sink(ctx, 420, out, 160, () => bar(ctx, t, a, { x: 960, y: 380, w: 600, u: rise(span(t, nt0, nt0 + .6)) }));
      B.sink(ctx, 500, out, 160, () => B.caps(ctx, 'NO TRANSLATOR', 960, 486, 40, rise(span(t, a.transW - .1, a.transW + .55)), { align: 'center', col: mixHex(P.blue0, P.cream, .6) }));
    }
    for (const [k, x, t0] of MEDS) {
      const g = expoOut(span(t, t0 - .25, t0 + .6)); if (g <= 0) continue;
      if (k === 'elephant') { duskMedallion(ctx, t, a, g); continue; }
      const sh = expoIn(out);   // whale and dog shrink back into their points as the elephant opens
      smallMed(ctx, t, x, MED_E[1], MED_R * g * (1 - sh), (c) => (k === 'whale' ? whaleIn(c, t) : dogIn(c, t)));
    }
  }

  return (ctx, t) => {
    let hudBar = null;
    if (t < kc1 + .05) {   // 7.01–7.06: the world map, the bar, the kitchen medallion, the dots (the flight starts under the close)
      const v = t < fp0 ? worldView(t, a) : F.flight(worldView(fp0, a), PAC, B.FLY(span(t, fp0, fp1))), kr = kitR(t), closing = t >= kc0;
      F.map(ctx, t, v, { calls: .32, dim: lerp(fieldDim(t, a), .12, sineIO(span(t, fp0, fp1 - .3))) });
      const inner = closing ? { telaviv: () => {} } : undefined;
      const kg = 1 - sineIO(span(t, a.res + .1, a.res + .8)) + sineIO(span(t, kc0, kc0 + .8));   // the Kenya pins step aside for the sorting
      const hd = F.pins(ctx, t, T, v, { pulse: ambient(t), inner, grow: { kenya: kg, amboseli: kg } });
      // the medallion: centre stays at KM while it lives; closing it flies into the Tel Aviv pin head
      let cx = KM[0], cy = KM[1];
      if (closing && hd.telaviv) { const q = sineIO(span(t, kc0, kc1)); cx = lerp(KM[0], hd.telaviv[0], q); cy = lerp(KM[1], hd.telaviv[1], q) - 60 * Math.sin(Math.PI * q); }
      if (kr > 0 && !(closing && t >= kc1)) {
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = mixHex(P.night0, P.ind1, .55); ctx.beginPath(); ctx.arc(cx, cy, kr, 0, TAU); ctx.fill(); ctx.restore();
        let c = null; B.inMed(ctx, cx, cy, kr - 1, (cc) => { c = kitchenScene(cc, t); }); B.ring(ctx, cx, cy, kr, 'other');
        if (t >= a.res && c) sorting(ctx, t, B.medPoint(c, F.F0, MOUTH[0], MOUTH[1], cx, cy, kr));
      } else if (closing && t >= kc1 && hd.telaviv) {   // the pin's head now shows the kitchen
        const [hx, hy, hr] = hd.telaviv; B.inMed(ctx, hx, hy, hr - 1, (cc) => kitchenScene(cc, t)); B.ring(ctx, hx, hy, hr, 'other');
      }
      // the bead from the cursor into the medallion's centre
      B.bead(ctx, cursorAt(ko0 - .6), KM, span(t, ko0 - .6, ko0 + .05), 'cream', 60);
      F.questionLine(ctx, t, a.why + .15, a.remember - .45, { text: 'Why is meaning so hard?', y: 420, size: 64 });
      if (t < bs1) { const b = barAt(t); hudBar = () => bar(ctx, t, a, { x: b.x, y: b.y, w: b.w, u: 1 - span(t, bs0, bs1) }); }
    } else if (t < fa0) {   // 7.06–7.08: the flight to the Pacific; one whale; the pedestal
      const v = t < fp1 ? F.flight(worldView(fp0, a), PAC, B.FLY(span(t, fp0, fp1))) : pacHold(t);
      const dim = lerp(.5, .12, sineIO(span(t, fp0, fp1 - .3))) + (FIELD_DIM - .12) * sineIO(span(t, pe0 - .4, pe0 + .4)) - FIELD_DIM * sineIO(span(t, px0, fa0 + 1.2));
      F.map(ctx, t, v, { calls: .32, dim: Math.max(0, dim) });
      F.pins(ctx, t, T, v, { pulse: ambient(t) });
      farWhale(ctx, t, v);
      pedestal(ctx, t);
    } else if (t < za0) {   // 7.09: flight to Alaska (the pin grows on its phrase)
      const v = t < fa1 ? F.flight(pacHold(fa0), ALA, B.FLY(span(t, fa0, fa1))) : alaHold(t);
      const dim = Math.max(0, FIELD_DIM * (1 - sineIO(span(t, px0, fa0 + 1.2))));
      F.map(ctx, t, v, { calls: .32, dim }); F.pins(ctx, t, T, v, { pulse: ambient(t) });
      pedestal(ctx, t);
    } else if (t < pm0) {   // 7.10: into the large Alaska medallion; 20 MIN
      const v = t < za1 ? F.flight(alaHold(za0), VA, B.ZIN(span(t, za0, za1))) : VA;
      B.mapMed(ctx, t, T, v, { pid: 'alaska', zRef: zRefA, scene: (c) => alaska(c, t), calls: .32, pins: { labels: { alaska: rise(span(t, a.offA, a.offA + .8)) * (1 - expoIn(span(t, za0 + .2, za0 + .7))) } } });
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); B.serif(ctx, '20 MIN', MA[0] + RA + 90, MA[1] + 30, 96, B.win(t, a.twenty - .15, pm0 - .3, .5, .3), {}); ctx.restore();
    } else if (t < pb1) {   // 7.11: the plate
      F.map(ctx, t, VA, { calls: .32, dim: .35 * sineIO(span(t, pm0, pm1)) * (1 - sineIO(span(t, pb0, pb1))) });
      F.pins(ctx, t, T, VA, { hide: ['alaska'] });
      if (t < pm1) B.plateMorph(ctx, span(t, pm0, pm1), MA, RA, (c) => alaska(c, t));
      else if (t < pb0) { F.clipPlate(ctx, t, T, 'C4', { morph: 1, credits: false }); B.credits(ctx, t, T, 'C4'); }
      else B.plateMorph(ctx, 1 - span(t, pb0, pb1), MA, RA, (c) => alaska(c, t));
    } else if (t < ao1) {   // 7.12–7.13: three cards; then out of the medallion and away to California
      const v = t < ao0 ? VA : F.flight(VA, CALQ, B.ZOUT(span(t, ao0, ao1)));
      B.mapMed(ctx, t, T, v, { pid: 'alaska', zRef: zRefA, scene: (c) => alaska(c, t), calls: .32, pins: { labels: { alaska: 0 }, pulse: { esp: Math.sin(Math.PI * span(t, a.admits - .2, a.so)) } } });
      cards(ctx, t);
    } else if (t < a.dc0) {   // 7.13–7.16: the field on California; quote card; strip big; NO TRANSLATOR; the dusk opens
      const m = duskMed(t, a);
      if (m.u < 1 - 1e-6) {
        const dim = FIELD_DIM * sineIO(span(t, sb0 - .3, sb1));
        const { hd } = field(ctx, t, T, a, { dim, pulse: { esp: Math.sin(Math.PI * span(t, a.admits - .2, a.so)) } });
        quoteCard(ctx, t, hd.esp);
        noTranslator(ctx, t);
      } else duskMedallion(ctx, t, a);
      const su = B.win(t, a.soThat - .05, a.dc0 - .35, .5, .4);
      if (su > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); B.caps(ctx, 'SO SUPERINTELLIGENCE GOES WELL FOR EVERYBODY.', 960, 868, 30, su, { align: 'center' }); ctx.restore(); }
    } else duskClose(ctx, t, T, a);   // 7.17: it closes back (shared with c08)
    if (hudBar) hudBar();
    F.strip(ctx, t, T, { big: stripBig(t), at: [960, 470], w: 1100, s: 1.9 });
  };
}
