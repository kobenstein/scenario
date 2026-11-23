// c05 · Check 4 · out of plateReferee: the alien-mind crop unrolls again, ALIEN MIND lifts into a big box 4 · Tao walks in and reads the
// ribbon through a magnifier (quote card) · Radziwiłł beside him rocks his head · fly into the lens → C3 Tao · back to the referee: he
// shows CORRECT, you ask WHY?, he shrugs: CORRECT ≠ UNDERSTOOD · the ≠ cracks down into your kitchen table, a sheet falls on it with the
// gold card · ★ you read at the paper tower's foot, the seasons turn behind you, the tower hardly shrinks (pull back, 250,000+ PAGES) ·
// your lamp lights only the start of the ribbon · the pale sketch of a loud arrival goes out · the headline, the post, the page in your
// hand turns into THE FILE (harvest) → plate56 (inner seam, lib/b2_extra.mjs).
// T.G("That leaves Wang's boldest") → T.G('This channel exists') · builder B2 · plan: docs/shots.md 4.01–4.10 · ONE entry, one camera.
//
// | ID    | anchor (phrase)                 | picture (one idea)                                                         | carrier       | camera            |
// |-------|---------------------------------|----------------------------------------------------------------------------|---------------|-------------------|
// | 4.01  | That leaves Wang's boldest      | veil; alien crop unrolls, highlighter; ALIEN MIND lifts into big box 4      | box 4         | creep (plate)     |
// | 4.02  | On the day it appeared          | box 4 shrinks home; Tao (walked in) reads the ribbon with a lens; quote     | the lens      | glide right · MIX |
// | 4.03  | Another mathematician           | a second figure rocks his head; MAKSYM RADZIWIŁŁ                            | the lens      | truck right       |
// | 4.04  | Here is Tao                     | push into the lens                                                         | the lens      | push in           |
// | 4.05  | slot:C3                         | C3 grows out of the lens and back                                          | the lens      | hold              |
// | 4.06  | So "correct" is not the same    | the referee shows CORRECT; you WHY?; he shrugs; CORRECT ≠ UNDERSTOOD        | the ≠         | glide left        |
// | 4.07  | And that gap is not a problem   | the ≠ cracks down into your kitchen table; a sheet + gold card falls on it   | the sheet     | glide (veil)      |
// | 4.08★ | This box may never turn gold    | you read at the tower's foot, seasons turn, pull back: 250,000+ PAGES       | the tower     | pull back · SCENE |
// | 4.09  | So on this point, Wang is right | your lamp lights only the start of the ribbon running to the horizon        | the ribbon    | wide right · LAND |
// | 4.10  | If you pictured the arrival     | pale searchlight sketch goes out; the post; the page turns into THE FILE    | the file      | glide home        |
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f67_kit.mjs';
import * as S from '../lib/f67_world.mjs';
import * as B from '../lib/b2_extra.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, smooth, halo } = E;
const { GOLD, CREAM, PAPER, LAMP, rise } = F;
const GY = S.GY;
export const PRINT = F.PRINT67;

export default async (T, R) => {
  E.prepareEditorial();
  const A = R.a, G = (p) => T.G(p, 0, A), GE = (p) => T.GE(p, 0, A);
  const a = { a: A, end: R.b };
  a.alien = G('alien mind'); a.check4 = G('Check four');
  a.day = G('On the day it appeared'); a.dig = G('the digestion process'); a.another = G('Another mathematician'); a.noOne = G('no one understands');
  a.here = G('Here is Tao'); a.clip = T.clip('C3');
  a.so = G('So correct is not'); a.under = G('as understood'); a.ref = G('The referee can tell you'); a.legal = G('step was legal'); a.why = G("It can't tell you why");
  a.gap = G('And that gap is not'); a.table = G('arrives at your table'); a.stamped = G('stamped correct');
  a.box = G('This box may never turn gold'); a.quarter = G('A quarter of a million'); a.life = GE('in a lifetime');
  a.point = G('So on this point'); a.some = G('Something has arrived that'); a.readE = GE('than we can read');
  a.loud = G('If you pictured the arrival'); a.noM = G('no machine announced'); a.human = G('A human did'); a.quiet = G('What arrived was quiet'); a.single = G('A single file');
  return [{ t: A, draw: (ctx, t) => S.plateReferee(ctx, t, T), print: PRINT }, { t: A + S.SEAM_HALF, draw: scene(a, T), print: PRINT }];
};

const L = (u, v, s = 1) => S.landCam(u, v, s);
const centreU = (c) => c.x * 1700 / S.Z_LAND + W / 2;
const TAO = { x0: 4520, x: 3930 }, RAD = { x0: 4720, x: 4240 };
const LENS = [3992, GY + 8], LR = 20;
const NEQ = [3810, GY - 290];
const KIT = { x: 1290, y: 610, w: 760 };
const CROP = { x: 300, y: 330, w: 1180 };
const BOX4 = { x: 1290, y: 470, s: 360 };
const dummy = createCanvas(8, 8).getContext('2d');

function scene(a, T) {
  const tPlate = a.end - S.SEAM_HALF, tCreep = tPlate - 2.4, t0 = a.a + S.SEAM_HALF, C3 = a.clip;
  const refCam = (t) => { const k = S.creep(t, T, "That leaves Wang's boldest"); return S.REFEREE_CAM(k, S.trk(k) * .3); };
  const creep56 = (t) => { const k = 1 + S.CREEP * (t - tPlate); return B.CAM56(k, S.trk(k) * .3); };
  const tA = a.day - .2;
  const K = [
    [tA, refCam(tA)], [a.day + 2.4, L(3990, 700, 2.3)], [a.another + .2, L(4020, 700, 2.32)], [a.noOne + .4, L(4090, 700, 2.25)],
    [a.here + .3, L(4060, 700, 2.3)], [C3.start - .25, L(LENS[0], LENS[1], 5.2)], [C3.end + .1, L(LENS[0], LENS[1] + 2, 5.35)],
    [a.so + 1.9, L(3660, 650, 2.0)], [a.why + .6, L(3670, 652, 2.05)], [a.gap + 1.4, L(3660, 655, 2.08)],
    [a.box - .5, L(1850, 770, 2.7)], [a.quarter + .1, L(1858, 760, 2.55)], [a.life + .7, L(2000, 420, .92)],
    [a.some + 1.8, L(3500, 500, .62)], [a.noM + .2, L(3880, 470, .6)],
    [tCreep, creep56(tCreep)],
  ];
  const camRaw = (t) => (t < tA ? refCam(t) : t < tCreep ? F.camPath(t, K) : creep56(t));
  const cam = (t) => E.camDrift(camRaw(t), t, 4 * smooth(span(t, t0, t0 + .9)) * (1 - smooth(span(t, tPlate - 2, tPlate))), 7);

  // ------------------------------------------------------------------ timings
  const veilA = (t) => Math.max(.55 * sineIO(span(t, t0, t0 + 1.4)) * (1 - sineIO(span(t, a.day + .2, a.day + 1.8))),
    .62 * sineIO(span(t, a.gap + .5, a.gap + 2.0)) * (1 - sineIO(span(t, a.box - .7, a.box + .9))));
  const cropU = (t) => span(t, t0 + .1, t0 + 1.5) * (1 - span(t, a.check4 + .3, a.check4 + 1.2));
  const lift = (t) => sineIO(span(t, a.check4 + .2, a.check4 + 1.8));
  const boxGrow = (t) => sineIO(span(t, a.check4 - .1, a.check4 + 1.4)) * (1 - sineIO(span(t, a.day - .1, a.day + 1.5)));
  const taoWalk = (t) => span(t, t0 + .4, a.day + .8), radWalk = (t) => span(t, a.day + .5, a.another + .3);
  const taoQ = (t) => span(t, a.dig - .6, a.dig + .4), taoOut = (t) => sineIO(span(t, a.noOne + .5, a.noOne + 1.9));
  const radL = (t) => span(t, a.another + .2, a.another + 1.0) * (1 - span(t, a.here - .1, a.here + .6));
  const lensIn = (t) => span(t, a.day + 1.0, a.day + 2.2);
  const morph = (t) => sineIO(span(t, C3.start - 1.7, C3.start + .25)) * (1 - sineIO(span(t, C3.end - .35, C3.end + 1.5)));
  const card = (t) => Math.max(1 - span(t, a.day, a.day + 1.0), span(t, a.legal - .35, a.legal + .55));
  const shrug = (t) => sineIO(span(t, a.why + .4, a.why + 1.2)) * (1 - sineIO(span(t, a.gap + 1.0, a.gap + 2.2)));
  const youWalk = (t) => span(t, a.so - .6, a.so + 2.2);
  const why = (t) => span(t, a.why + .1, a.why + .8) * (1 - span(t, a.gap + .6, a.gap + 1.4));
  const neq = (t) => span(t, a.under - .5, a.under + .5) * (1 - span(t, a.gap + 1.6, a.gap + 2.4));
  const crackL = (t) => span(t, a.gap + .1, a.gap + 1.3);
  const kit = (t) => span(t, a.gap + .9, a.gap + 2.3) * (1 - expoIn(span(t, a.box - .5, a.box + .6)));
  const lamp = (t) => smooth(span(t, a.gap + 1.3, a.gap + 2.6));
  const kitCrack = (t) => span(t, a.gap + 1.9, a.gap + 3.1);
  const sheetFall = (t) => span(t, a.table - .5, a.table + .35);
  const sheetFly = (t) => sineIO(span(t, a.box - .4, a.box + 1.3));
  const gcard = (t) => span(t, a.stamped - .15, a.stamped + .5);
  const season = (t) => { const x = Math.max(0, t - (a.box + .4)); return 4 * Math.pow(x / 2.3, 1.12); };
  const pagesT = (t) => span(t, a.quarter + .6, a.quarter + 1.6) * (1 - span(t, a.some - .4, a.some + .4));
  const ribG = (t) => lerp(1, .38, sineIO(span(t, a.point - .2, a.point + 1.6))) + .07 * sineIO(span(t, a.quiet, a.single));
  const ribA = (t) => lerp(1, .8, span(t, a.point, a.point + 2));
  const lampOn = (t) => smooth(span(t, a.box - .2, a.box + 1.2));
  const lit = (t) => span(t, a.point + .8, a.some + 1.2);
  const alarm = (t) => span(t, a.loud + .1, a.loud + 1.5), alarmOff = (t) => span(t, a.noM - .1, a.noM + 1.4);
  const headDim = (t) => lerp(.5, 0, sineIO(span(t, a.human - .2, a.human + 1.6)));
  const towerDark = (t) => lerp(.8, .25, sineIO(span(t, a.box - .3, a.box + 1.0))) + .3 * sineIO(span(t, a.loud, a.human + 1));
  const toFile = (t) => sineIO(span(t, a.quiet + .2, a.single - .1)), raise = (t) => sineIO(span(t, a.single - .4, a.single + .9));
  const pile = (t) => span(t, a.box + .4, a.point + .5);

  return (ctx, t) => {
    if (t >= tPlate) { B.plate56(ctx, t, T); return; }
    const c = cam(t), cu = centreU(c), atTower = t > a.gap + 2 && cu < 2850;
    const youX = atTower ? B.YOU56.x : lerp(3260, 3430, sineIO(youWalk(t)));
    let lensScreen = null, neqScreen = null, handScreen = null;
    S.landWorld(ctx, c, t, {
      head: { dim: headDim(t) }, post: span(t, a.human - .1, a.human + 1.4),
      tower: { u: 1, dark: Math.min(.8, towerDark(t)) }, ribbon: { u: 1, glow: ribG(t), a: ribA(t) }, chair: { referee: 0 }, board: { chalk: 1, spot: 1 }, you: false,
      land: (cx) => {
        // the referee (B2 draws him: he can shrug)
        const sh = shrug(t);
        B.refereeAt(cx, t, { card: card(t), look: .1 + .25 * sh, armL: [lerp(-.25, -1.15, sh), lerp(-.1, -2.0, sh)] });
        // Tao walks in from the labs, stops and bends over the ribbon with his lens; Radziwiłł beside him
        const tw = taoWalk(t), tx = lerp(TAO.x0, TAO.x, sineIO(tw));
        if (tw < 1) E.person(cx, tx, GY - 2, 70, { dir: -1, walk: tw * 26, view: 'side', look: .1 });
        else {
          const hd = E.person(cx, tx, GY - 2, 70, { dir: 1, lean: .16 * lensIn(t), look: -.2, armR: [lerp(.3, 1.05, lensIn(t)), lerp(.2, 1.35, lensIn(t))] });
          if (hd?.R && lensIn(t) > 0) { const lx = lerp(hd.R[0] + 8, LENS[0], lensIn(t)), ly = lerp(hd.R[1] + 4, LENS[1], lensIn(t));
            B.magnifier(cx, t, lx, ly, LR * lerp(.5, 1, lensIn(t)), { hand: hd.R, a: 1 - morph(t) * .0 }); lensScreen = E.project(c, S.Z_LAND, lx, ly); }
        }
        const rw = radWalk(t), rx = lerp(RAD.x0, RAD.x, sineIO(rw));
        if (rw > 0) {
          if (rw < 1) E.person(cx, rx, GY - 2, 72, { dir: -1, walk: rw * 22, view: 'side', look: .1 });
          else { const shake = Math.sin((t - a.noOne) * 13) * span(t, a.noOne - .2, a.noOne + .3) * (1 - span(t, a.noOne + 1.3, a.noOne + 1.8));
            const hd = E.person(cx, rx, GY - 2, 72, { dir: -1, lean: .05 * shake, look: -.3 + .2 * shake, armR: [.25, .1], armL: [-.25, -.1] }); }
        }
        // you walk in to the referee's chair, ask WHY?; later you read at the tower's foot
        let hd;
        if (!atTower) {
          const yw = youWalk(t);
          hd = yw > 0 && yw < 1 ? B.youAt(cx, youX, { walk: (youX - 3260) / 12, view: 'side', look: .2 }) : B.youAt(cx, youX, { look: .9, armR: [lerp(.2, 1.3, why(t)), lerp(.1, 2.2, why(t))] });
          const wu = why(t); if (wu > 0) F.goldText(cx, [['WHY?', 0]], youX + 4, GY - 120, 38, rise(wu), { serif: true, align: 'center', col: CREAM });
          const nu = neq(t);
          if (nu > 0) {
            F.goldText(cx, [[F.SOURCES.correct, 1]], NEQ[0] - 30, NEQ[1], 34, rise(nu), { serif: false, weight: 700, spacing: .06, align: 'right', glow: true });
            F.goldText(cx, [['≠', 0]], NEQ[0], NEQ[1], 40, rise(span(nu, .2, 1)), { serif: false, weight: 700, align: 'center', col: CREAM });
            F.goldText(cx, [['UNDERSTOOD', 0]], NEQ[0] + 30, NEQ[1], 34, rise(span(nu, .35, 1)), { serif: false, weight: 700, spacing: .06, col: CREAM });
            const cl = crackL(t); if (cl > 0) B.crack(cx, [NEQ[0], NEQ[1] + 14], [NEQ[0] + 8, GY], cl, { w: 9, seed: 31, n: 12 });
          }
        } else {
          // ★ the tower: the seasons tree behind you, your lamp, the small read pile, 250,000+ PAGES
          B.tree(cx, t, 1660, GY, 250, season(t));
          const lo = lampOn(t), lt = lit(t);
          halo(cx, B.YOU56.x + 10, GY - 60, lerp(180, 420, lt), (.3 + .25 * lt) * lo, GOLD.halo, LAMP.core);
          if (lt > 0) F.ribbon(cx, t, S.RIB, { w0: 38, w1: 3, seed: 3, u: .085 * expoOut(lt), glow: 1, a: .75 });
          const np = Math.round(14 * pile(t)); for (let i = 0; i < np; i++) { cx.fillStyle = mixHex(PAPER.shade, PAPER.lit, .5 + .5 * Math.sin(i)); cx.fillRect(B.YOU56.x + 44 + Math.sin(i * 3) * 2, GY - 3 - i * 3, 34, 2.6); }
          const r = raise(t);
          hd = B.youAt(cx, B.YOU56.x, { look: lerp(-.35, .9, r), armR: [lerp(.75, 2.2, r), lerp(2.35, 2.45, r)] });
          if (hd?.R && sheetFly(t) >= 1) {
            const f = toFile(t);
            if (f < 1) { cx.save(); cx.translate(hd.R[0] + 4, hd.R[1] - 8); cx.rotate(-.1); cx.fillStyle = PAPER.lit; cx.globalAlpha *= 1 - f; cx.fillRect(-9, -12, 18, 24); cx.restore(); }
            if (f > 0) B.fileInHand(cx, t, hd, { a: clamp(f * 2), glow: f });
          }
          const pu = pagesT(t); if (pu > 0) F.goldText(cx, [[F.SOURCES.pages, 1]], S.TOWER.x + 160, GY - 640, 40, rise(pu), { serif: true, glow: true });
        }
        if (hd?.R) handScreen = E.project(c, S.Z_LAND, hd.R[0] + 4, hd.R[1] - 8);
        B.sketchAlarm(cx, t, alarm(t), alarmOff(t));
        neqScreen = E.project(c, S.Z_LAND, NEQ[0], NEQ[1]);
      },
    });
    // 4.01: the veil, the alien crop again, ALIEN MIND lifts into a big box 4 (grown out of the checklist's box 4) and goes home
    const va = veilA(t); F.veil(ctx, va);
    const cu1 = cropU(t);
    if (cu1 > 0) F.xQuote(ctx, t, 'alien', CROP.x, CROP.y, CROP.w, { u: cu1, hiU: span(t, a.alien - .05, a.alien + .8) });
    const bg = boxGrow(t), lf = lift(t);
    if (bg > 0) {
      const r0 = F.checkBox(3), s = lerp(r0.w, BOX4.s, bg), x = lerp(r0.x + r0.w / 2, BOX4.x, bg), y = lerp(r0.y + r0.h / 2, BOX4.y, bg), pulse = .5 + .5 * Math.sin(t * 2.2);
      ctx.save(); ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(x - s / 2, y - s / 2, s, s);
      ctx.strokeStyle = rgba(CREAM, .7 + .3 * pulse); ctx.lineWidth = lerp(2, 5, bg); ctx.strokeRect(x - s / 2, y - s / 2, s, s); ctx.restore();
      if (t > a.day - .2) { const k = s / BOX4.s; F.goldText(ctx, [['ALIEN', 1]], x, y - 6 * k, 96 * k, 1, { serif: true, align: 'center', glow: true }); F.goldText(ctx, [['MIND', 1]], x, y + 84 * k, 96 * k, 1, { serif: true, align: 'center', glow: true }); }
    }
    if (lf > 0 && t <= a.day - .2) {   // the highlighted words leave the crop and settle inside the big box
      const q = F.xQuote(dummy, t, 'alien', CROP.x, CROP.y, CROP.w, { u: 1 }), h0 = q?.hi?.[0] ?? { x: 800, y: 400, w: 160, h: 40 };
      const x = lerp(h0.x + h0.w / 2, BOX4.x, lf), y1 = lerp(h0.y + h0.h * .8, BOX4.y - 6, lf), sz = lerp(h0.h * .9, 96, lf);
      if (lf < .5) F.goldText(ctx, [['ALIEN MIND', 1]], x, y1 - 120 * Math.sin(Math.PI * lf) * 0, sz, 1, { serif: true, align: 'center', glow: true });
      else { F.goldText(ctx, [['ALIEN', 1]], x, lerp(y1, BOX4.y - 6, span(lf, .5, 1)), sz, 1, { serif: true, align: 'center', glow: true }); F.goldText(ctx, [['MIND', 1]], x, lerp(y1, BOX4.y + 84, span(lf, .5, 1)), sz, 1, { serif: true, align: 'center', glow: true }); }
    }
    // 4.02 / 4.03: Tao's quote card, Radziwiłł's name
    const tq = taoQ(t);
    if (tq > 0 && taoOut(t) < 1) { F.float(ctx, t, .4); ctx.translate(0, -460 * taoOut(t)); F.quoteCard(ctx, t, T, { u: tq, text: F.SOURCES.tao, credit: F.SOURCES.taoSrc, x: 140, y: 120, w: 900, size: 50, spoken: ['the digestion', 'some time'], after: a.day }); ctx.setTransform(1, 0, 0, 1, 0, 0); }
    const rl = radL(t); if (rl > 0) { const p = E.project(c, S.Z_LAND, RAD.x + 6, GY - 76); if (p) F.goldLabel(ctx, p[0], p[1], F.SOURCES.radz, 'MATHEMATICIAN', rl, { dx: 60, dy: -90, size: 28 }); }
    // 4.04 / 4.05: C3 grows out of the lens and goes back into it
    const m = morph(t); if (m > 0 && lensScreen) F.clipPlate(ctx, t, T, 'C3', { from: [lensScreen[0], lensScreen[1], LR * lensScreen[2]], morph: m, dark: .75 * (1 - span(m, .35, 1)) });
    // 4.07: your kitchen table under the lamp; the sheet falls on it, the gold card rises; then the sheet flies to your hand at the tower
    const ku = kit(t);
    let sheet = null;
    if (ku > 0) {
      const k = B.kitchen(ctx, t, KIT.x, KIT.y, KIT.w, { u: ku, lamp: lamp(t), crack: kitCrack(t) });
      const sf = sheetFall(t);
      if (sf > 0 && k) sheet = [lerp(KIT.x - 170, KIT.x - 150, sf), lerp(-120, k.y - 6, sineIO(sf) * sineIO(sf)), lerp(.6, .06, expoOut(sf))];
    }
    const sfl = sheetFly(t);
    if (sheet || (sfl > 0 && sfl < 1)) {
      const s0 = sheet ?? [KIT.x - 150, KIT.y - 6, .06];
      const dst = handScreen ?? [W / 2, H / 2, 2.7];
      const x = lerp(s0[0], dst[0], sfl), y = lerp(s0[1], dst[1], sfl) - 160 * Math.sin(Math.PI * sfl), sc = lerp(1, dst[2] * .24, sfl);
      ctx.save(); ctx.translate(x, y); ctx.rotate(lerp(s0[2], -.1, sfl)); ctx.scale(sc, sc);
      ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-70, -6, 150, 8);
      ctx.fillStyle = PAPER.lit; ctx.fillRect(-75, -12, 150, 10);   // the sheet lying flat (seen from the side): a thin cream slab
      ctx.restore();
      const g = gcard(t) * (1 - sfl); if (g > 0) F.goldCard(ctx, t, x + 10, y - 12, 64, { u: g, text: 'CORRECT' });
    }
    F.checklist(ctx, t, T, { lit: t < a.day + 1 ? 3 : undefined });
  };
}
