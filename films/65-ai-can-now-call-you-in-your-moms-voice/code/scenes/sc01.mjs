// c01 · Hook · THE LINE · frame 0 = thumbnail A echoed (her house far left with the warm kitchen window, the line on five poles down to the
// bank, you on the near hill right with your phone; a GOLD voice arcs from her window to your phone; IT'S NOT / YOUR MOM) · on "sound
// exactly like your mom" the arc's far end lifts off her window and slides to the cold glow behind the far ridge: the voice turns BLUE
// (the copy) · a second blue arc drops into her window ("call her ... like you": IT'S NOT / YOU) · a short gold snippet at the source (the
// recording), ≈ $0 · ★ the camera rises over the valley, gold sparks rise from every lit window of the town and gather into
// $8 BILLION · the glide down to her window: WHAT STILL PROTECTS HER? · through the window into the kitchen: the phone rings with your
// picture, she lifts it to her ear, a trembling blue voice (SCENARIO) · the voice turns neutral and clones itself: REAL / A.I. swap, a coin
// flips (54 %) · the voices sink back, she listens, fooled · an empty dashed place for a note on the fridge; on "it exists" it glows ·
// back out through the window · gold runs down the wire from her house, the five tags light: 5 STEPS · four poles get blue copies ·
// the bank window glows calm gold: ONE IT CANNOT · the light runs back to pole 1 → plateLine(1) (lib/f65_seams.mjs) at "The first step is the voice".
// 0 → T.G('The first step is the voice') · built by the lead (quality reference). Plan: docs/shots.md H.01–H.09 · world: docs/MOTION.md
// ONE entry, one world, one continuous camera (S.camPath through world cameras; the kitchen is a portal out of her window: never a cut).
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f65_kit.mjs';
import * as S from '../lib/f65_seams.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, mixHex, halo } = E;
const { rise, maskLine, GOLD, COPY, NEUTRAL, LAMP, bump } = F;

export const PRINT = F.PRINT65;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after);
  const a = {};
  a.callYou = G('call you'); a.mom = G('like your mom'); a.callHer = G('And it can call her'); a.likeYou = G('like you', a.callHer);
  a.takes = G('It takes a short'); a.rec = G('recording', a.takes); a.money0 = G('almost no money');
  a.losses = G('And the losses'); a.year = G('In a single year'); a.billion = G('eight billion'); a.crime = G('online crime');
  a.copy = G('A machine can copy'); a.what = G('So what still protects');
  a.rings = G('Her phone rings'); a.yourV = G("It's your voice"); a.tears = G('In tears'); a.asking = G('Asking for money');
  a.ears = G("Don't count on her"); a.yours = G('Or on yours'); a.byEar = G('By ear'); a.coin = G('coin toss');
  a.forget = G('So forget listening'); a.whatP = G('What protects her has'); a.fooled = G('completely fooled');
  a.exists = G('And it exists'); a.alone = G('Because a voice alone'); a.dollar = G('move a dollar'); a.reach = G('To reach her savings');
  a.five = G('five steps'); a.four = G('Four of them'); a.fake = G('can now fake'); a.one = G('One, it cannot');
  a.T0 = R.b;                                            // = T.G('The first step is the voice'): the seam
  a.seam = a.T0 - S.SEAM_HALF;
  return [{ t: 0, draw: scene(a, T), print: PRINT }];
};

// ---------------------------------------------------------------------------------------------------------------- cameras (world)
const WIN = S.winWorld();
const lookWin = (mag, sy = 560) => S.look(WIN[0], WIN[1], WIN[2], mag, 960, sy, 600);
function keys(a) {
  return [
    [-4, E.cam3({ x: 700, y: -290, z: 1150, hz: 600 })], [0, S.THUMB_CAM],                                    // frame 0 = the thumbnail, a slow push
    [a.mom + .6, E.cam3({ x: 520, y: -320, z: 2000, hz: 600 })],
    [a.likeYou + .8, S.look(-700, 410, 6400, 1.85, 960, 600, 600)],                                              // glide left: her house, the source
    [a.money0 + .6, S.look(-1150, 480, 6400, 2.75, 960, 625, 615)],
    [a.billion - .4, E.cam3({ x: 1300, y: -900, z: 0, hz: 430 })],                                              // ★ up over the valley: the town
    [a.crime + .6, E.cam3({ x: 1000, y: -820, z: 750, hz: 450 })],
    [a.what + 1.0, lookWin(4.0)], [a.rings - .05, lookWin(5.2)], [a.rings + 1.3, lookWin(6.4)],                // down to her window → the kitchen
    [a.alone + .1, lookWin(6.8)],
    [a.dollar + .5, S.look(-1350, 520, 6400, 2.6, 760, 560, 575)],                                             // back out: her house, pole 1
    [a.reach + 1.6, S.look(60, 330, 6400, 1.75, 960, 640, 562)], [a.four - .2, S.look(330, 330, 6400, 1.75, 960, 640, 562)],                                                  // along the wire: the whole line
    [a.one + .5, S.look(-260, 330, 6400, 2.0, 930, 640, 556)],
    [a.seam, S.lineCam(1)],                                                                                      // → plateLine(1)
  ];
}

function scene(a, T) {
  const K = keys(a);
  const WINS = S.WINDOWS, NS = WINS.length * 3;
  return (ctx, t) => {
    if (t >= a.seam) { S.plateLine(ctx, t, T, 1); return; }                 // the seam: exactly what c02 draws
    const dA = 1 - span(t, a.one + .4, a.seam - .1);
    let c = S.camPath(t, K); c = S.drift(c, t, 3000, 1.5 * dA, 65);
    // ---- the portal into the kitchen (opens out of her window, closes back into it)
    const pOpen = sineIO(span(t, a.rings - .45, a.rings + .55)), pShut = sineIO(span(t, a.alone + .05, a.alone + 1.55)), lm = pOpen * (1 - pShut);
    // ---- the line's state: wire gold, tags, ghosts, bank (H.09) and the convergence onto plate 1
    const wireU = lerp(0, 6, sineIO(span(t, a.reach - .15, a.five + .35))), back = sineIO(span(t, a.one + .9, a.seam - .15));
    const wU = lerp(wireU, 1, back), wGold = rise(span(t, a.reach - .2, a.reach + .3)) * (t < a.reach + .5 ? 1 : 1);
    const tagLit = (k) => (k === 1 ? rise(span(wireU, .95, 1.3)) * (1 - back) : rise(span(wireU, k - .05, k + .3)) * (1 - back));
    const ghostA = (1 - span(t, a.one + .9, a.seam - .2));
    const st = {
      source: { a: lerp(.85, .55, span(t, a.alone, a.dollar + .5)) * (1 - .45 * span(t, a.losses, a.year) * (1 - span(t, a.copy - .4, a.copy + .6))), pulse: 1 - span(t, a.alone, a.dollar) },
      tags: { lit: tagLit, hi: 1, hiA: rise(span(t, a.one + .9, a.seam - .3)) },
      ghosts: { a: ghostA, of: (k) => (k < 5 ? rise(span(t, a.four + (k - 1) * .32, a.four + (k - 1) * .32 + .7)) : 0) },
      wire: { gold: t > a.reach - .2 ? wGold : 0, u: wU },
      bank: { win: .8, glow: rise(span(t, a.one - .1, a.one + .6)) * (1 - span(t, a.one + 1.0, a.seam - .15)) },
      house: { win: 1 + .5 * bump(t, a.what + .2, 2.4) + .4 * span(t, a.rings - 1.2, a.rings - .4) * (1 - span(t, a.alone + 1.2, a.dollar + .6)) },
      you: { phone: 1, screen: 'call', light: lerp(.75, 1, bump(t, a.callYou - .2, 3.2)), ring: rise(span(t, a.callYou - .2, a.callYou + .3)) * (1 - span(t, a.mom - .2, a.mom + .8)), look: .12 },
      town: { a: 1 + .5 * bump(t, a.year, 5.5) },
    };
    // ---- the voices across the valley (screen arcs; recomputed from the world every frame)
    const arcs = (cx, out) => {
      const wp = S.proj(c, ...WIN), sp = out.source, ph = out.phone;
      // 1 · the first voice: her window → your phone, gold; its far end lifts to the source and it turns blue; then it hangs up
      const lift1 = sineIO(span(t, a.mom - .9, a.mom + .5)), hang = sineIO(span(t, a.callHer + .2, a.likeYou + .3));
      if (wp && sp && ph && hang < 1) {
        const x0 = lerp(wp[0], sp[0], lift1), y0 = lerp(wp[1], sp[1], lift1), pts = F.arcPts(x0, y0, ph.x, ph.y - ph.h * .2, lerp(260, 330, lift1), 48);
        const o = { amp: 18 + 4 * Math.sin(t * .7), seed: 3, speed: 70, u1: 1 - hang, taper: .12 };
        if (lift1 < 1) F.voiceWave(cx, t, pts, { ...o, col: GOLD, a: 1 - lift1 });
        if (lift1 > 0) F.voiceWave(cx, t, pts, { ...o, col: COPY, a: lift1, flicker: lift1 });
      }
      // 2 · the copy calls her: source → her window, blue (stays until the kitchen; again in H.05)
      const g2 = sineIO(span(t, a.callHer + .7, a.callHer + 2.3)), dim = 1 - .6 * span(t, a.losses - .2, a.year) * (1 - span(t, a.copy - .2, a.copy + .8));
      if (wp && sp && g2 > 0 && lm < 1) {
        const s2 = wp[2], amp = clamp(6 + 9 * s2 * 2.2, 8, 40), pts = F.arcPts(sp[0], sp[1], wp[0], wp[1], 120 + 80 * Math.min(2, s2 * 2), 48);
        F.voiceWave(cx, t, pts, { amp, col: COPY, seed: 3, speed: 70, u1: g2, a: dim * (1 - span(t, a.rings - .3, a.rings + .3)), flicker: 1, tremble: span(t, a.what, a.rings), taper: .12,
          cut: [0, .16], cutA: rise(span(t, a.rec - .2, a.rec + .4)) * (1 - span(t, a.losses - .3, a.losses + .4)) });
      }
      // ≈ $0: a gold price tag swings in under the source
      if (sp) F.priceTag(cx, t, sp[0] + 70, sp[1] + 24, '≈ $0', rise(span(t, a.money0 - .3, a.money0 + .5)) * (1 - expoIn(span(t, a.losses + .2, a.losses + .9))), { size: 30, len: 34 });
      // ★ sparks: gold rises from every lit town window and gathers into the number
      if (t > a.year - .1 && t < a.copy + .6) {
        cx.save(); cx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < NS; i++) {   // three sparks per lit window
          const w = WINS[i % WINS.length], j = Math.floor(i / WINS.length), t0 = a.year + .05 + ((i * 37) % 40) / 40 * 1.9 + j * .32;
          const u = span(t, t0, t0 + 1.6); if (u <= 0) continue;
          const p = S.proj(c, w.x, w.y, w.z); if (!p) continue;
          const tx = F.TALLY.x + 30 + ((i * 53) % 420), ty = F.TALLY.y - 50 + ((i * 29) % 70), e = sineIO(u);
          const x = lerp(p[0], tx, e) + 40 * Math.sin(Math.PI * u) * Math.sin(i * 1.7), y = lerp(p[1], ty, e) - 60 * Math.sin(Math.PI * u);
          const al = (u < .08 ? u / .08 : 1) * (1 - span(u, .82, 1)) * (1 - span(t, a.copy - .2, a.copy + .5));
          if (al <= 0) continue; cx.fillStyle = rgba(GOLD.core, .9 * al); cx.fillRect(x - 2.4, y - 2.4, 4.8, 4.8);
          if (i % 4 === 0) halo(cx, x, y, 18, .55 * al, GOLD.halo, GOLD.core);
        }
        cx.restore();
      }
    };
    if (lm < 1) S.lineWorld(ctx, c, t, { ...st, extra: arcs });
    // ---- the kitchen behind her window (H.06–H.08)
    if (lm > 0) {
      const from = S.winRect(c);
      F.portal(ctx, from, { x: 0, y: 0, w: W, h: H }, lm, (cx, w, h) => {
        const kp = sineIO(span(t, a.whatP - .3, a.whatP + 1.9)) * (1 - sineIO(span(t, a.exists + .4, a.alone + .3)));
        const z = 1 + .024 * (t - a.rings) + .06 * kp;   // a slow push the whole time + a slow truck toward the fridge (never a held frame)
        cx.save(); cx.translate(w / 2, h / 2); cx.scale(z, z); cx.translate(-w / 2 + 330 * kp + 15 * (t - a.rings) + E.drift(t, 26, 3), -h / 2 + E.drift(t, 14, 5) + 30 * kp + 4 * (t - a.rings));
        kitchenBeat(cx, t, a, w, h);
        cx.restore();
      }, { rim: LAMP, r: 12 * (1 - lm), glow: lm < .98 });
    }
    // ---- words
    F.thesis(ctx, t, 108, 236, 1, { size: 108, lines: ['IT’S NOT', 'YOUR MOM'], out: span(t, a.callHer - .5, a.callHer + .3) });
    F.thesis(ctx, t, 108, 236, rise(span(t, a.likeYou - .25, a.likeYou + .5)), { size: 108, lines: ['IT’S NOT', 'YOU'], out: span(t, a.takes + .6, a.takes + 1.4) });
    F.source(ctx, t, a.rec, a.losses + .4, F.SOURCES.clone);
    const tU = rise(span(t, a.billion - .9, a.billion - .2)) * (1 - expoIn(span(t, a.copy - .3, a.copy + .4)));
    if (tU > 0) F.tally(ctx, t, { v: 8, from: .5, dec: 0, pre: 'NEARLY $', post: ' BILLION', size: 104, u: span(t, a.billion - .9, a.billion + .5), label: 'AMERICANS 60+ · ONE YEAR · +59 %', rise: tU, col: GOLD.core });
    F.source(ctx, t, a.billion + .2, a.copy + .3, F.SOURCES.losses);
    const qU = rise(span(t, a.what - .05, a.what + .6)) * (1 - expoIn(span(t, a.rings - .5, a.rings + .1)));
    if (qU > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); maskLine(ctx, [['WHAT STILL', 0]], 110, 230, 84, qU, { serif: false, weight: 600, col: P.core0, glow: true }); maskLine(ctx, [['PROTECTS HER?', 0]], 110, 322, 84, rise(span(qU, .15, 1)), { serif: false, weight: 600, col: GOLD.text, glow: true }); ctx.restore(); }
    F.scenario(ctx, t, a.rings + .3, a.ears - .1);
    F.source(ctx, t, a.byEar + .3, a.forget + .6, F.SOURCES.ear);
    // H.09 5 STEPS · 4 A MACHINE CAN FAKE · 1 IT CANNOT
    const fU = rise(span(t, a.five - .15, a.five + .5)), fOut = 1 - expoIn(span(t, a.one + 1.1, a.seam - .3));
    if (fU * fOut > 0) {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      maskLine(ctx, [['5 STEPS', 0]], 110, 214, 84, fU * fOut, { serif: false, weight: 600, col: P.core0, glow: true });
      maskLine(ctx, [['4 A MACHINE CAN FAKE', 0]], 112, 282, 30, rise(span(t, a.four, a.four + .6)) * fOut, { serif: false, weight: 600, col: COPY.text, glow: false });
      maskLine(ctx, [['1 IT CANNOT', 0]], 112, 330, 30, rise(span(t, a.one, a.one + .6)) * fOut, { serif: false, weight: 600, col: GOLD.text, glow: false });
      ctx.restore();
    }
  };
}

// ---------------------------------------------------------------------------------------------------------------- the kitchen beats
// H.06 the phone rings (your picture), she reaches and lifts it, a trembling blue voice leaves it · H.07 the voice turns neutral and clones:
// REAL / A.I., the labels swap, a coin flips (54 %) · H.08 the voices sink back into the phone, she listens · the empty place on the fridge
const ROW = [[520, 392], [990, 392]], ROW2 = 168;
function kitchenBeat(cx, t, a, w, h) {
  const reach = span(t, a.rings + .45, a.yourV - .1), lift = span(t, a.yourV - .1, a.yourV + .9);
  const ring = rise(span(t, a.rings - .1, a.rings + .25)) * (1 - span(t, a.yourV - .4, a.yourV));
  const slot = rise(span(t, a.whatP - .1, a.whatP + .9)), glow = rise(span(t, a.exists, a.exists + .7));
  const nod = .06 * bump(t, a.fooled - .2, 1.2);
  let K = null;
  const extra = (kx, out) => {
    K = out; const ph = out.phone; if (!ph || lift <= 0) return;
    const p0 = [ph.x - 26, ph.y + 10];
    // the voice from the phone (blue, trembling) → neutral → two identical rows → back into the phone
    const grow = sineIO(span(t, a.yourV + .2, a.yourV + 1.4)), neu = sineIO(span(t, a.ears - .1, a.ears + .7));
    const toRow = sineIO(span(t, a.ears + .2, a.ears + 1.5)) * (1 - sineIO(span(t, a.forget - .1, a.forget + 1.1)));
    const split = sineIO(span(t, a.ears + 1.0, a.yours + .1)) * (1 - sineIO(span(t, a.forget - .2, a.forget + .7)));
    const sink = sineIO(span(t, a.forget + .7, a.whatP + .3));
    if (grow <= 0 || sink >= 1) return;
    const arc = F.arcPts(p0[0], p0[1], 470, 420, 140, 48), row = F.arcPts(ROW[1][0], ROW[0][1], ROW[0][0], ROW[0][1], 0, 48);
    const path = (dy) => arc.map((q, i) => [lerp(q[0], row[i][0], toRow), lerp(q[1], row[i][1], toRow) + dy * split]);
    const trem = rise(span(t, a.tears - .1, a.tears + .4)) * (1 - neu);
    const o = { amp: 34 + 6 * toRow, seed: 5, speed: 80, u0: 0, u1: grow * (1 - sink), tremble: trem, taper: .1 };
    if (neu < 1) F.voiceWave(kx, t, path(0), { ...o, col: COPY, a: 1 - neu, flicker: 1 - neu });
    if (neu > 0) { F.voiceWave(kx, t, path(0), { ...o, col: NEUTRAL, a: neu }); if (split > 0) F.voiceWave(kx, t, path(ROW2), { ...o, col: NEUTRAL, a: neu * split }); }
    // the labels: REAL / A.I. (swap on "Or on yours": you can't tell which is which)
    const lu = rise(span(t, a.ears + .9, a.ears + 1.5)) * (1 - expoIn(span(t, a.forget - .3, a.forget + .3)));
    if (lu > 0 && split > .5) {
      const sw = sineIO(span(t, a.yours + .1, a.yours + 1.1)) - sineIO(span(t, a.byEar - .2, a.byEar + .6)), y1 = ROW[0][1] - 66, y2 = y1 + ROW2;   // swap, and swap back
      const yA = lerp(y1, y2, sw), yB = lerp(y2, y1, sw);
      maskLine(kx, [['REAL', 0]], ROW[0][0], yA, 24, lu, { serif: false, weight: 600, col: GOLD.text, glow: false });
      maskLine(kx, [['A.I.', 0]], ROW[0][0], yB, 24, lu, { serif: false, weight: 600, col: COPY.text, glow: false });
    }
    // the coin between the rows: it flips on "coin toss"
    const cu = rise(span(t, a.byEar + .4, a.byEar + 1.0)) * (1 - expoIn(span(t, a.forget - .1, a.forget + .4)));
    if (cu > 0) F.coin(kx, t, 1090, ROW[0][1] + ROW2 / 2, 34 * cu, { ph: 2 * Math.PI * 2.5 * sineIO(span(t, a.coin - .4, a.coin + .9)) + .25 * Math.sin(t * .8) });
  };
  S.kitchen(cx, t, w, h, {
    phone: { screen: lift > .3 ? 'timer' : 'call', ring, reach, lift, timer: Math.max(0, t - a.yourV), light: 1 },
    mom: { look: .02 + nod + .015 * Math.sin(t * .7), lean: .06 + .02 * bump(t, a.ears, 6) + .008 * Math.sin(t * 1.1) },
    notes: [{ empty: slot, glowIn: glow, a: slot }],
    extra,
  });
  // 54 % (the share who spotted the A.I. voice by ear): top left in kitchen space, over the dark wall above the fridge
  const nU = rise(span(t, a.coin - .2, a.coin + .5)) * (1 - expoIn(span(t, a.forget + .1, a.forget + .7)));
  if (nU > 0) {
    cx.save();
    maskLine(cx, [['54 %', 0]], 560, 236, 96, nU, { serif: true, col: P.core0, glow: true });
    maskLine(cx, [['HOW OFTEN PEOPLE SPOT AN A.I. VOICE', 0]], 564, 282, 20, nU, { serif: false, weight: 600, col: P.halo2, glow: false });
    cx.restore();
  }
  return K;
}
