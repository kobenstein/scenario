// c01 · Hook · THE LINE · thumbnail A at frame 0 (the door, the gold leak, the line, you far back; THE BEST AI / IS LOCKED) ·
// your phone lights → the kitchen opens out of it (the letter, the car outside) · the answer builds in seconds · back into the phone, the
// camera pulls back: your phone is a point of light at the end of the line · the 27-year flaw: a glimpse through the gap, the code wall,
// one hot line · HOW MUCH STRONGER? (you look up at the door) · the proof tape comes out of the gap: NOT SUMS. PROOFS. · the camera
// travels the line back from the door, the marks light 1…5: YOU'RE FIFTH · → plateLine (lib/f55_seams.mjs) at "At the very front stand".
// 0 → T.G('At the very front stand') · built by the lead (quality reference). Plan: docs/shots.md H.01–H.08 · world: docs/MOTION.md
// ONE entry, one world, one continuous camera (S.camPath through world cameras; the kitchen and the glimpses are portals, never cuts).
//
// | ID    | anchor (phrase)              | picture (one idea)                                                          | camera              |
// |-------|------------------------------|-----------------------------------------------------------------------------|---------------------|
// | H.01★ | The best                     | thumbnail A; THE BEST AI / IS LOCKED, out before "Tonight"                  | slow push · LINE    |
// | H.02  | Tonight                      | push to you; the phone lights; the kitchen opens out of its screen          | push + portal · SCENE |
// | H.03  | It answers in seconds        | the kitchen pushes in on the phone; the answer builds line by line          | inner push · SCENE  |
// | H.04  | It isn't                     | the kitchen folds back into the phone; pull back to the whole line; leak up | pull back · LINE    |
// | H.05  | And it has already found     | push to the gap; a glimpse: the code wall, one line glows; 27 YEARS          | push + portal · EXPL|
// | H.06  | So how much stronger         | the glimpse closes; you from behind, head up at the door; HOW MUCH STRONGER?| pull back · MIX     |
// | H.07  | And it doesn't stop          | push to the door; the proof tape slides out of the gap, rows tick (cyan)     | push · EXPL         |
// |       | Not sums / Proofs            | NOT SUMS. (struck) · PROOFS.                                                 | creep · EXPL        |
// | H.08  | There's a line               | the tape rolls back; travel down the line, marks 1–4 glow, 5 = you; YOU'RE FIFTH → plateLine | travel · LINE |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f55_kit.mjs';
import * as S from '../lib/f55_seams.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, mixHex, halo } = E;
const { rise, maskLine, GOLD, CHECK, LAMP, bump } = F;

export const PRINT = F.PRINT55;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.tonight = G('Tonight'); a.phone = G('phone', a.tonight); a.letter = G('letter from the bank', a.tonight); a.car = G('strange noise', a.tonight);
  a.answers = G('It answers in seconds'); a.smartest = G('smartest machine', a.answers);
  a.isnt = G("It isn't"); a.never = G('The best never sits'); a.pocket = G('pocket', a.never); a.sits = G('It sits behind'); a.cant = G("can't open", a.sits);
  a.found = G('And it has already found'); a.flaw = G('flaw', a.found); a.years = G('twenty-seven years', a.found); a.yearsE = GE('twenty-seven years', a.found);
  a.how = G('So how much stronger'); a.allowed = GE('not allowed to use', a.how);
  a.stop = G("And it doesn't stop"); a.behind = G('Behind that door', a.stop); a.math = G('mathematics', a.behind); a.sums = G('Not sums'); a.proofs = G('Proofs', a.sums);
  a.line = G("There's a line"); a.front = G("And you're not at", a.line); a.fifth = G('fifth', a.front);
  a.T0 = R.b;                                            // = T.G('At the very front stand'): the seam
  a.seam = a.T0 - S.SEAM_HALF;
  return [{ t: 0, draw: scene(a, T), print: PRINT }];
};

// ---------------------------------------------------------------------------------------------------------------- cameras (world)
const L = S.LINE, D = L.door, Y = L.you;
const CAM = {
  home: S.HOME,
  near: S.look(Y.x + 160, 105, Y.z, 2.3, 760, 690),                     // you, close, from behind: the phone at your hand
  wide: S.look(1100, 0, 6200, .9, 940, 860),                            // a little wider than home: the phone a point at the end of the line
  doorA: S.look(D.x, 3600, D.z, 1.5, 960, 520),                         // the door close (the glimpse of the code wall)
  back: S.look(Y.x + 110, 120, Y.z, 2.0, 520, 640, 700),                // you from behind, head up, the door far back right
  doorB: S.look(D.x, 3000, D.z, 1.25, 1250, 560),                       // the door, a little to the right (room for the words)
  mid: S.look(1600, 0, 9000, .82, 1020, 720, 560),                      // over the line, halfway back
  five: S.look(Y.x, 0, Y.z, 1.5, 560, 920, 600),                        // mark 5, you on it, the line ahead to the door
};
const PANEL = { x: 250, y: 110, w: 1420, h: 720 };                       // the glimpse (screen)

function keys(a) {
  return [
    [-4, S.look(Y.x, 0, Y.z, .9, 200, 984)], [0, CAM.home], [a.tonight - .1, S.look(Y.x, 0, Y.z, 1.2, 232, 990)],   // (the key at -4 gives frame 0 its speed)
    [a.phone + .9, CAM.near], [a.isnt + .1, S.drift(CAM.near, 0, 0)],
    [a.sits + .5, CAM.wide], [a.found - .2, S.look(1300, 0, 6400, .92, 960, 850)],
    [a.flaw + .5, CAM.doorA], [a.how + .1, S.look(D.x, 3600, D.z, 1.56, 960, 520)],
    [a.how + 2.6, CAM.back], [a.stop + .1, S.look(Y.x + 110, 120, Y.z, 2.06, 520, 640, 700)],
    [a.behind + .7, CAM.doorB], [a.line + .2, S.look(D.x, 3000, D.z, 1.3, 1250, 560)],
    [a.front - .1, CAM.mid], [a.fifth + .1, CAM.five], [a.seam, S.LINE_CAM],
  ];
}

// the phone in your hand in the world (screen px): a tiny lit rectangle at the right hand
function phoneAt(c) { const p = S.proj(c, Y.x + 34, 96, Y.z); return p ? { x: p[0] - 4 * p[2], y: p[1] - 9 * p[2], w: 8 * p[2], h: 15 * p[2] } : null; }

// the answer on the phone screen (abstract lines, never words): the question bubble, then the answer builds row by row
function screenFn(t, a) {
  const q = span(t, a.phone - .2, a.phone + .6), u = span(t, a.answers + .2, a.smartest + .6);
  return (ctx, w, h) => {
    if (q > 0) { ctx.fillStyle = rgba(P.cream, .85 * q); ctx.beginPath(); ctx.roundRect(w * .36, h * .1, w * .56 * rise(q), h * .07, h * .02); ctx.fill(); }
    for (let k = 0; k < 7; k++) { const v = clamp(u * 7 - k); if (v <= 0) break; ctx.fillStyle = rgba(P.night1, .55); ctx.fillRect(w * .1, h * (.24 + k * .065), w * (k === 6 ? .45 : .78 - (k % 3) * .08) * expoOut(v), h * .028); }
  };
}

function scene(a, T) {
  const K = keys(a);
  return (ctx, t) => {
    if (t >= a.seam) { S.plateLine(ctx, t, T); return; }                 // the seam: exactly what c02 draws
    // camera: the path plus a drift that dies before the seam (the plate has none)
    const dA = 1 - span(t, a.fifth - .2, a.seam - .15);
    let c = S.camPath(t, K); c = S.drift(c, t, Math.max(1500, D.z - c.z), 2.6 * dA, 55);   // ~13 px of slow drift wherever the camera looks
    // ---- the world state
    const ph = clamp(span(t, a.phone - .5, a.phone + .1)) * (1 - span(t, a.sits, a.sits + 1.2) * .6);   // your phone's light
    const leak = 1 + .35 * bump(t, a.sits + .4, 2.4);                                                    // "a door you can't open"
    const look = lerp(.2, .9, sineIO(span(t, a.how + 1.2, a.how + 2.4))) * (1 - .4 * span(t, a.behind, a.behind + 1)) + .35 * span(t, a.front, a.fifth);
    const hold = span(t, a.tonight + .2, a.phone) * (1 - span(t, a.how, a.how + 1));
    const mt = (i) => {                                                     // marks: 1–4 glow as the camera passes, 5 lights on "fifth", all up for the plate
      const ti = lerp(a.line + .5, a.front + 1.1, i / 3), pass = i < 4 ? .45 * rise(span(t, ti, ti + .6)) : rise(span(t, a.fifth - .25, a.fifth + .35));
      return { lit: Math.max(.2, pass, rise(span(t, a.fifth + .6, a.seam - .1))) };
    };
    const st = {
      gap: leak, mark: mt,
      you: { o: { look: Math.min(.9, look), armR: [lerp(.2, .62, hold), lerp(.1, 2.35, hold)] } },
      extra: (cx) => { if (ph <= 0) return; const r = phoneAt(c); if (!r) return; halo(cx, r.x + r.w / 2, r.y + r.h / 2, Math.max(18, r.h * 3), .5 * ph, LAMP.body, LAMP.core); cx.fillStyle = rgba(mixHex(LAMP.core, P.cream, .4), ph); cx.fillRect(r.x, r.y, r.w, r.h); },
    };
    S.lineWorld(ctx, c, t, st);
    // ---- H.01 the thesis (frame 0 = thumbnail A)
    F.thesis(ctx, t, 96, 250, 1, { size: 150, out: span(t, a.tonight - 1.1, a.tonight - .1) });
    // ---- H.02–H.04 the kitchen opens out of your phone, and folds back in
    const kOpen = sineIO(span(t, a.phone - .1, a.phone + 1.3)), kShut = sineIO(span(t, a.isnt + .05, a.never + .5)), km = kOpen * (1 - kShut);
    if (km > 0) {
      const from = phoneAt(c);
      const zu = sineIO(span(t, a.answers - .3, a.smartest + .4)), z = { x: lerp(960, 900, zu) + E.drift(t, 14, 3), y: lerp(540, 430, zu) + E.drift(t, 9, 5), s: lerp(1.0, 2.0, zu) + .028 * (t - a.phone) };
      F.portal(ctx, from, { x: 0, y: 0, w: W, h: H }, km, (cx, w, h) => S.kitchen(cx, t, w, h, { zoom: z, phone: { lit: 1, screen: screenFn(t, a) }, letter: 1, you: { look: .05, hold: 1 }, window: { a: 1 } }), { rim: LAMP, r: 18 * (1 - km), glow: km < .98 });
    }
    // ---- H.05 a glimpse through the gap: the code wall, one hot line (27 YEARS)
    const gOpen = sineIO(span(t, a.flaw + .2, a.flaw + 1.5)), gShut = sineIO(span(t, a.how - .05, a.how + .85)), gm = gOpen * (1 - gShut);
    if (gm > 0) {
      F.veil(ctx, .4 * gm);
      const hotU = span(t, a.flaw + 1.1, a.years - .3), big = rise(span(t, a.years - .05, a.years + .5)) * (1 - gShut);
      F.portal(ctx, S.gapRect(c), PANEL, gm, (cx, w, h) => {
        cx.fillStyle = mixHex(P.night1, P.ind1, .35); cx.fillRect(0, 0, w, h);
        F.codeWall(cx, t, 40, 30, w - 80, h - 60, { hot: 13, hotU, dust: span(t, a.years, a.years + 1.5), seed: 27 });
        if (big > 0) maskLine(cx, [['27 YEARS', 0]], w / 2, h * .58, 150, big, { serif: true, align: 'center', col: P.core0, glow: true });
      }, { rim: GOLD });
      F.source(ctx, t, a.flaw + 1.3, a.how + .3, F.SOURCES.flaw27, { y: 872 });
    }
    // ---- H.06 HOW MUCH STRONGER?
    const qU = rise(span(t, a.how + .9, a.how + 1.7)) * (1 - expoIn(span(t, a.stop + .2, a.stop + .9)));
    if (qU > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); maskLine(ctx, [['HOW MUCH', 0]], 120, 230, 104, qU, { serif: false, weight: 600, col: P.core0, glow: true }); maskLine(ctx, [['STRONGER?', 0]], 120, 340, 104, rise(span(t, a.how + 1.1, a.how + 1.9)) * (1 - expoIn(span(t, a.stop + .2, a.stop + .9))), { serif: false, weight: 600, col: GOLD.text, glow: true }); ctx.restore(); }
    // ---- H.07 the proof tape slides out of the gap; rows write themselves and tick (cyan): NOT SUMS. PROOFS.
    const tOut = span(t, a.behind + .5, a.math + .9), tIn = sineIO(span(t, a.line + .1, a.line + 1.1)), tu = expoOut(tOut) * (1 - tIn);
    if (tu > 0) {
      const g = S.gapRect(c), x = (g ? g.x : 1460) - 330, y = Math.max(120, g ? g.y + g.h * .12 : 120);
      const rows = Math.max(0, (t - a.behind - .5) * 2.4), ticks = Math.max(0, (t - a.behind - 1.3) * 2.4);
      F.proofTape(ctx, t, x, y, 300, 640 * tu, { rows, ticks, roll: true, seed: 7, flow: Math.max(0, t - a.math) * 6 });
    }
    const sU = rise(span(t, a.sums - .05, a.sums + .45)) * (1 - expoIn(span(t, a.line - .1, a.line + .5)));
    if (sU > 0) {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      maskLine(ctx, [['NOT SUMS.', 0]], 130, 420, 96, sU, { serif: false, weight: 600, col: mixHex(P.cream, P.blue1, .4), glow: false });
      const k = expoOut(span(t, a.sums + .35, a.sums + .8)); if (k > 0) { ctx.fillStyle = rgba(P.cream, .75 * sU); ctx.fillRect(130 + 245, 384, 250 * k, 6); }
      maskLine(ctx, [['PROOFS.', 0]], 130, 560, 132, rise(span(t, a.proofs - .05, a.proofs + .45)) * (1 - expoIn(span(t, a.line - .1, a.line + .5))), { serif: false, weight: 600, col: CHECK.text, glow: true });
      ctx.restore();
    }
    // ---- H.08 YOU'RE FIFTH (gone before the seam: the plate carries no words)
    const fU = rise(span(t, a.fifth - .1, a.fifth + .4)) * (1 - sineIO(span(t, a.seam - 1.1, a.seam - .15)));   // a soft exit (an expo exit popped)
    if (fU > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); maskLine(ctx, [["YOU'RE FIFTH", 0]], 120, 250, 112, fU, { serif: false, weight: 600, col: P.core0, glow: true }); ctx.restore(); }
  };
}
