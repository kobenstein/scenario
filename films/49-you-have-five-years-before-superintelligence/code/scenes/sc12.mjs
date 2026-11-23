// Film 49 · c12 · THE WEDDING AT THE TOP · END (B3). The same take (shared base in sc09.mjs) into S.endScreen for the last 15 s.
//
// | beat  | phrase (VO)                          | picture                                                                                   | camera / kind     |
// |-------|--------------------------------------|-------------------------------------------------------------------------------------------|-------------------|
// | S.05  | Five years from now … what you do    | the string lights over the small table light (right → left): it is the wedding table;     | push · SCENE      |
// |       |                                      | the neighbour (facing the child) turns to you; the counter goes                            |                   |
// | S.06★ | Who do you want to be …              | close on the place card: its blank line catches the light; no text                        | push in · SCENE   |
// | S.07  | It can sound like a loss · listen    | the child pushes its pen across the table; you take it; WHAT DO YOU WANT TO BE?           | pull back · MIX   |
// | S.08  | For most of history … the wonder     | the long pull back: both stairs in one picture; on the old one children climb past         | pull back · MIX   |
// |       |                                      | standing grown-ups; on the gold one grown-ups climb (grey hair among them, children by the |                   |
// |       |                                      | hand); WARNING · WORK · WONDER on their words                                               |                   |
// | S.09  | There is no next generation …        | back to you: the door's light reaches you across the landing; you set the pen on the       | glide in · MIX    |
// |       | This time, the next generation is you| blank line; THE NEXT GENERATION IS YOU                                                      |                   |
// | A.01  | This channel exists … subscribe      | the closing picture: the climbers walk into the door one by one; the light draws back     | pull back · LAND  |
// | E.01  | (end screen, 15 s)                   | S.endScreen (+ the place card with the pen and the two guests, same camera)                | END_CAM           |
// Carriers: the string lights · the place card · the pen · the climbers · the door light.
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f49_kit.mjs';
import * as S from '../lib/f49_world.mjs';
import { b3, YL, YOU_TOP, TOP, figure, placeOnTop } from './sc09.mjs';
import { neighbour, child, seated, SEAT } from './sc11.mjs';
const { span, clamp, lerp, smooth, sineIO, expoOut, rgba, mixHex, P, W, H, halo } = E;
const { GOLD } = F;

export default async (T, R) => {
  const B = b3(T);
  return [{ t: R.a, draw: scene(B, T), print: F.PRINT49 }];
};

// ---------------------------------------------------------------------------------------------------------------- the pen
const PEN_SET = { x: TOP.card - 3, y: TOP.y - 4, ang: 1.15 };   // leaning on the place card, its nib on the blank line
const PEN_TABLE = { x: 2052, y: TOP.y - 1.5, ang: Math.PI - .06 };
function youPose(t, a) {
  const reach = F.bump(t, a.listen - .25, .9), set = F.bump(t, a.core - .9, 1.3);
  const hold = smooth(span(t, a.listen + .1, a.listen + .7)) * (1 - smooth(span(t, a.core - .2, a.core + .3)));
  const base = [lerp(.2, .75, hold), lerp(.1, 2.2, hold)];
  const arm = reach > 0 ? [lerp(base[0], 1.45, reach), lerp(base[1], 1.5, reach)] : set > 0 ? [lerp(base[0], 1.1, set), lerp(base[1], 1.2, set)] : base;
  const look = lerp(lerp(.2, -.35, smooth(span(t, a.whoWant - .3, a.whoWant + .8))) * (1 - smooth(span(t, a.listen + .8, a.history))) + .3 * smooth(span(t, a.listen + .8, a.history)), .5, smooth(span(t, a.core + 1, a.core + 3)));
  const back = lerp(.2, .3, smooth(span(t, a.core + 1, a.core + 3)));
  return { x: YOU_TOP, y: YL, o: { dir: 1, back, look, lean: .22 * Math.max(reach, set), armR: arm } };
}
function penAt(t, a, hands, kid) {
  const push = span(t, a.loss + .9, a.loss + 1.9), take = span(t, a.listen + .05, a.listen + .4), put = span(t, a.core - .45, a.core + .05);
  if (put >= 1) return PEN_SET;
  const hand = hands?.R ? { x: hands.R[0] + 1, y: hands.R[1] - 1, ang: -.9 } : null;
  if (take >= 1) { if (put <= 0 || !hand) return hand; const e = sineIO(put); return { x: lerp(hand.x, PEN_SET.x, e), y: lerp(hand.y, PEN_SET.y, e), ang: lerp(hand.ang, PEN_SET.ang, e) }; }
  if (take > 0 && hand) { const e = sineIO(take); return { x: lerp(PEN_TABLE.x, hand.x, e), y: lerp(PEN_TABLE.y, hand.y, e), ang: lerp(PEN_TABLE.ang, hand.ang, e) }; }
  if (push > 0) { const e = expoOut(push), x0 = kid?.R ? kid.R[0] : SEAT.c - 40; return { x: lerp(x0 - 4, PEN_TABLE.x, e), y: PEN_TABLE.y, ang: PEN_TABLE.ang }; }
  return kid?.R ? { x: kid.R[0] - 3, y: kid.R[1] + 2, ang: Math.PI - .7 } : null;   // in the child's hand, drawing
}

// ---------------------------------------------------------------------------------------------------------------- the climbers (S.08 → A.01)
// one route over the five gold steps: the plain → carved stair k → tread k … → tread 4 → up onto the landing → into the door
const ROUTE = (() => {
  const seg = []; let x = 180;
  for (let k = 0; k < 5; k++) {
    const s = S.STEPS[k], below = k ? S.STAGES[k - 1].y : S.GY;
    seg.push({ kind: 'walk', x0: x, x1: s.L - 84, y: below }); seg.push({ kind: 'climb', k });
    x = s.L + 26;
  }
  seg.push({ kind: 'walk', x0: x, x1: 1745, y: S.STAGES[4].y }); seg.push({ kind: 'up', x0: 1745, x1: 1772 }); seg.push({ kind: 'walk', x0: 1772, x1: 1812, y: YL });
  let L = 0; for (const g of seg) { g.s0 = L; g.len = g.kind === 'climb' ? 150 : Math.abs(g.x1 - g.x0); L += g.len; } return { seg, L };
})();
const DOOR_IN = ROUTE.L - 52;   // from here the climber walks into the light
function routeAt(s) {
  for (const g of ROUTE.seg) {
    if (s > g.s0 + g.len && g !== ROUTE.seg[ROUTE.seg.length - 1]) continue;
    const u = clamp((s - g.s0) / g.len);
    if (g.kind === 'walk') return { x: lerp(g.x0, g.x1, u), y: g.y };
    if (g.kind === 'climb') { const p = S.climbPos(g.k, u); return { x: p.x, y: p.y }; }
    return { x: lerp(g.x0, g.x1, u), y: lerp(S.STAGES[4].y, YL, smooth(u)) };
  }
  return { x: 1812, y: YL };
}
// nine grown-ups (three grey-haired, three with a child by the hand); they arrive in the door between ~568 and ~575.5
const CLIMBERS = [
  { arr: 0, v: 56, h: 166, grey: 0 }, { arr: .8, v: 52, h: 158, grey: 1, kid: 1 }, { arr: 1.7, v: 58, h: 170, grey: 0 },
  { arr: 2.5, v: 50, h: 160, grey: 1 }, { arr: 3.3, v: 55, h: 164, grey: 0, kid: 1 }, { arr: 4.2, v: 53, h: 156, grey: 1 },
  { arr: 5.0, v: 57, h: 168, grey: 0 }, { arr: 6.0, v: 51, h: 162, grey: 0, kid: 1 }, { arr: 7.0, v: 54, h: 159, grey: 1 },
];
function climbers(ctx, t, a) {
  const arr0 = 568.2 - 547.69 + a.history;   // phrase-relative: the first one arrives ~20.5 s after 'For most of history'
  for (const [i, q] of CLIMBERS.entries()) {
    const ta = arr0 + q.arr * (a.subscribe + 3 - arr0) / 7.0, s = DOOR_IN + 40 - q.v * (ta - t);
    if (t < a.history - .5) continue;
    for (const kid of q.kid ? [1, 0] : [0]) {
      const sk = kid ? s - 30 : s; if (sk > ROUTE.L) continue;
      const p = routeAt(sk), into = span(sk, DOOR_IN, ROUTE.L), h = kid ? 96 : q.h;
      if (into >= 1) continue;
      ctx.save(); ctx.globalAlpha *= 1 - smooth(into);   // stepping into the door's light (the light flares as they enter)
      const o = { walk: sk * (kid ? .13 : .095), dir: 1, light: .9 };
      if (q.kid && !kid) o.armL = [-.5, -.2];
      if (kid) o.armR = [2.2, 2.4];
      E.person(ctx, p.x, p.y, h, o);
      if (q.grey && !kid) greyHair(ctx, p.x, p.y, h);
      ctx.restore();
      if (into > 0) halo(ctx, p.x + 6, p.y - h * .5, 60, .16 * Math.sin(Math.PI * into), GOLD.halo, GOLD.hot);
    }
  }
}
function greyHair(ctx, x, y, h) { ctx.fillStyle = mixHex(P.cream, P.halo2, .45); ctx.beginPath(); ctx.ellipse(x + .006 * h, y - .925 * h, .06 * h, .038 * h, 0, Math.PI, 0); ctx.fill(); }
// the old stair: grown-ups stand on it, children climb up past them (only seen in the long pull back)
const OLD_STAND = [-1900, -2620, -3360, -4180, -5020, -5760];
const OLD_KIDS = [-2250, -3050, -3800, -4560, -5400];
function oldPeople(ctx, t, a) {
  const d = t - a.history;
  for (const [i, x] of OLD_STAND.entries()) E.person(ctx, x, S.oldY(x), 162, { dir: 1, light: .7, look: .25 + .1 * Math.sin(t * .4 + i) });
  for (const [i, x0] of OLD_KIDS.entries()) { const x = x0 + 26 * d; E.person(ctx, x, S.oldY(x), 100, { walk: x * .13, dir: 1, light: .8 }); }
}

// ---------------------------------------------------------------------------------------------------------------- the land callback
function landing(B, t, cx, o) {
  const { a } = B;
  // S.09 the door's light reaches you across the landing (and draws back before the end screen)
  const pl = expoOut(span(t, a.noNext + .4, a.noNext + 2.8)) * (1 - sineIO(span(t, a.subscribe - 1.5, a.subscribe + 2.5)));
  if (pl > 0) {
    const x0 = S.DOOR.x1, x1 = lerp(x0, YOU_TOP + 60, pl);
    cx.save(); cx.globalCompositeOperation = 'lighter';
    cx.fillStyle = E.lin(cx, x0, 0, x1, 0, [[0, rgba(GOLD.hot, .45 * pl)], [1, rgba(GOLD.hot, .1 * pl)]]); cx.fillRect(x0, S.LANDING.top - S.TD + 2, x1 - x0, S.TD - 4);
    cx.restore();
    halo(cx, YOU_TOP, YL - 90, 150, .3 * pl, GOLD.halo, GOLD.core);
  }
  if (t > a.history - 1 && t < a.noNext + 6) oldPeople(cx, t, a);
  if (t > a.history - 1) climbers(cx, t, a);
  const kid = seated(cx, child(t, a)); seated(cx, neighbour(t, a));
  // the child's paper on the table
  cx.fillStyle = F.PAPER.lit; cx.beginPath(); cx.moveTo(SEAT.c - 58, TOP.y - .5); cx.lineTo(SEAT.c - 30, TOP.y - .5); cx.lineTo(SEAT.c - 26, TOP.y - 3); cx.lineTo(SEAT.c - 54, TOP.y - 3); cx.closePath(); cx.fill();
  const hands = figure(cx, youPose(t, a));
  const glow = smooth(span(t, a.whoWant - .2, a.whoWant + 1.2)) * (1 - smooth(span(t, a.listen, a.listen + 2))) + .6 * smooth(span(t, a.core - .6, a.core + .6)) * (1 - smooth(span(t, a.call + 2, a.call + 5)));
  placeOnTop(cx, t, { glow, pen: o.penOverride ?? penAt(t, a, hands, kid) });
  if (glow > 0) halo(cx, TOP.card, TOP.y - 6, 40, .3 * glow, GOLD.halo, GOLD.core);
}

// ================================================================================================================ the scene
function scene(B, T) {
  const { a } = B;
  return (ctx, t) => {
    if (t >= a.endT) {   // E.01 the end screen (lib) + the place card with its pen and the two guests (same camera)
      S.endScreen(ctx, t, T);
      E.card(ctx, B.endCam(t), S.Z_LAND, () => { seated(ctx, child(t, a)); seated(ctx, neighbour(t, a)); placeOnTop(ctx, t, { pen: PEN_SET }); });
      return;
    }
    const c = B.cam(t);
    const lights = span(t, a.five + .2, a.five + 2.0);
    const hist = .85 * smooth(span(t, a.history + .4, a.history + 2.6)) * (1 - smooth(span(t, a.noNext + .5, a.noNext + 3)));
    const st = {
      lit: B.lit(t), stage: B.stage(t), you: false, old: .5 * smooth(span(t, a.history, a.history + 3)),
      hist: [hist, hist, hist, hist], histWords: 0, topTable: { a: 1, lights },
      land: (cx) => landing(B, t, cx, {}),
    };
    S.stairsWorld(ctx, c, t, st);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    // S.07 WHAT DO YOU WANT TO BE? (small)
    F.goldText(ctx, [[F.SOURCES.wantToBe, .5]], W / 2, 200, 40, F.rise(span(t, a.whatWant - .1, a.whatWant + .7)) * (1 - span(t, a.history + 1.4, a.history + 2.1)), { serif: false, weight: 700, spacing: .08, align: 'center' });
    // S.08 WARNING · WORK · WONDER on their words
    const wOut = span(t, a.noNext + .2, a.noNext + 1.0);
    [[a.wWarning, 520], [a.wWork, 960], [a.wWonder, 1400]].forEach(([tw, x], i) => F.goldText(ctx, [[F.SOURCES.three[i], .35 + .3 * i]], x, 190, 64, F.rise(span(t, tw - .1, tw + .6)) * (1 - wOut), { serif: false, weight: 800, spacing: .1, align: 'center' }));
    ctx.restore();
    // S.09 THE NEXT GENERATION IS YOU
    F.caption(ctx, t, 110, 230, [F.SOURCES.nextGen], span(t, a.core - .05, a.core + 1.0), { size: 104, out: span(t, a.call + 2.6, a.call + 3.7) });
    F.counter(ctx, t, T);
  };
}
