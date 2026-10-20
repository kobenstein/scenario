// Chunk c13 · Film 4 v2 · "The catch" · shots 13.01–13.15 (bild/shots.md §4) · VO 06a (372.06–410.78)
// PLAN — work in progress (filled in as the takes are built)
import { canvas } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { ready } from '../lib/v2_c13_kit.mjs';
import { roadTake, warmRoad } from '../lib/v2_c13_road.mjs';
import { kitchenTake, warmKitchen, inkFill, samplePivot } from '../lib/v2_c13_kitchen.mjs';

// every anchor from the VO (never seconds); last(ph) = the last word of a phrase
export function anchors(T) {
  const S = (p) => T.S('06a', p), E = (p) => T.E('06a', p);
  const last = (ph) => { const s0 = S(ph), n = ph.split(' ').length; return T.W('06a').filter((w) => w.s >= s0 - 1e-3)[n - 1]; };
  const H = handsOf('c13', T);
  const K = {
    HI: H.in, HO: H.out, b0: H.in.b, a1: H.out.a,
    but: S('But wanting'), catch: last('has a catch').s, catchE: E('has a catch'),
    now: S('Now nothing'), nothing: S('nothing stops'), stops: S('stops you'), you1: last('stops you').s, nowE: E('stops you'),
    money: S('money'), moneyE: E('money'), permission: S('permission'), permE: E('permission'),
    only: S('Only you'), you2: last('Only you').s, onlyE: E('Only you'),
    one: S('One person'), person: S('person'), idea: last('one idea').s, help: S('help no'), scientist: S('scientist'), had: S('had ten'), ten: S('ten years'), ago: last('years ago').s, agoE: E('years ago'),
    maybe: S('Maybe'), river1: S('river where'), swam: S('swam'), kid: S('kid'), dying: S('dying'), summer: S('summer'), summerE: E('every summer'),
    nobody1: S('Nobody was'), paid: S('paid'), saveE: E('save it'),
    now2: S('Now nobody'), nobody2: S('nobody has'), beE: E('has to be'),
    down: S('Down the road'), road: last('Down the road').s, someone: S('someone runs'), runs: S('runs'), council: S('council'), finally: S('finally'),
    has: last('she has').s, time1: last('she has the time').s, time1E: E('she has the time'),
    else: S('Someone else'), opens: S('opens'), shelter: S('shelter'), animals: S('animals'), wanted: S('wanted'), wantedE: E('nobody wanted'),
    and1: S('And you start'), start: S('start on'), river2: last('start on the river').s, river2E: E('start on the river'),
    you3: S('You have the time'), time2: last('You have the time').s, time2E: E('You have the time'),
    you4: S('You have the help'), help2: last('You have the help').s, help2E: E('You have the help'),
    and3: S('And you have the best'), best: S('best'), reason: S('reason'), there: last('reason there').s, isE: E('there is'),
  };
  // road take
  K.sun0 = K.permE - .1; K.push0 = K.you2 + .12; K.cut = K.one + .16;
  // kitchen take
  K.piv = K.maybe + .11;
  K.k = { c1: K.cut + .75, c1b: K.cut + 1.0, c2: K.idea + .66, c2b: K.had - .21, c3: K.ten + .21, dive: K.ago + .24,
    ring0: K.idea - .02, ring1: K.idea + .5, plume0: K.help + 1.25, lift0: K.had, touch: 0, touch0: K.ago - .2, touch1: K.ago + .3 };
  return K;
}

export default async (T, R) => {
  const K = anchors(T);
  warmRoad(); warmKitchen();
  { const [, g] = canvas(); for (const t of [K.b0 + .3, K.catch, K.money, K.permission + .4, K.you2 + .1, K.cut - .05]) { g.save(); roadTake(g, t, K); g.restore(); }
    for (const t of [K.cut + .5, K.help + .5, K.ten]) { g.save(); kitchenTake(g, t, K); g.restore(); } samplePivot(K); await ready(); }
  const road = (ctx, t) => roadTake(ctx, t, K), kitchen = (ctx, t) => kitchenTake(ctx, t, K);
  return [
    { t: K.b0, tr: 'cut', d: .1, draw: road, print: K.HI.print,
      sound: [{ f: 'key', t: K.catch + .02, v: .14 }, { f: 'lever_switch', t: K.nothing + .04, v: .16 }] },
    { t: K.now - .1, tr: 'cut', d: .06, draw: road, print: K.HI.print, sound: [{ f: 'curtain', t: K.permission + .03, v: .14 }] },
    { t: K.only - .2, tr: 'cut', d: .06, draw: road, print: K.HI.print, sound: [{ f: 'whoosh_airy', t: K.push0 + .05, v: .16 }] },
    { t: K.cut, tr: 'cut', d: .06, draw: kitchen, print: K.HI.print, sound: [{ f: 'tone', t: K.help + .02, v: .12 }] },
    { t: K.piv, tr: 'cut', d: .06, draw: (ctx, t) => inkFill(ctx, t), print: K.HO.print },
  ];
};
