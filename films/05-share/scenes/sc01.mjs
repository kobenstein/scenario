// Chunk C1 · Hook and §0 up to the Musk quote · shots H.01–0.04 (15) · R.a → R.b (0.00–50.94 s with the final VO) · ★ H.04
// Builder C1. Every accent is anchored to a VO phrase (T.S / T.E), never to seconds; the chunk range comes from R.
//
// PLAN (MOTION.md gate 1) — hero onset · carrier into the next shot · transition type · accent
// | shot  | words                                   | hero onset (word)                          | carrier → next                                  | type      | acc |
// |-------|-----------------------------------------|--------------------------------------------|-------------------------------------------------|-----------|-----|
// | H.01  | Your phone buzzes.                      | display wakes + first buzz ring (buzz sfx) | rings contract onto the display                 | (b) zoom  | ▲   |
// | H.02a | Not a bill.                             | grey bill card lands, flicked off on "bill"| the paycheck slides in behind the flick         | (a) cut   |     |
// | H.02b | Not a paycheck.                         | paycheck card flung up on "paycheck"       | warm light rises from below the glass edge      | (a) cut   |     |
// | H.03  | A share.                                | engraved share card locks in (foil glint)  | the share light at the card's heart             | (b) out   | ▲   |
// | H.04  | Your share of the largest fortune …     | rosette lifts over the horizon, "largest"  | the camera keeps gliding                        | take      | ★   |
// | H.05  | Sounds like a fantasy.                  | lines → dotted ghost → smoke, "fantasy"    | one dotted thread leaves to the right           | (a) cut   |     |
// | H.06  | But a few days ago … public good.       | thread lays round the sheet; corner tears  | the torn corner floats right (camera follows)   | take      |     |
// |       |                                         | off on "piece"                             |                                                 |           |     |
// | H.07  | Then Elon Musk … every child in America.| corner lands as marker; one share fans out | one certificate folds into a light, rises       | (a) up    |     |
// |       |                                         | over the US map on "every child"           |                                                 |           |     |
// | H.08  | So whose fortune will it be?            | the light stops mid-air on "whose"         | the light pulls a thread to the right           | (a) left  |     |
// | H.09  | Let me show you … every person on Earth.| the row runs to the horizon, "every person"| the sideways track                              | (c) whipL |     |
// | H.10  | With a plan you could explain …         | she nods on "friend"                       | the pen lifts and leaves right                  | (a) cut   |     |
// | 0.01  | The company is Anthropic.               | shadow band slides off, pen underlines     | the underline curls into a ring                 | (b) iris  |     |
// | 0.03  | It's pledging a slice of itself now.    | a foil segment slides out on "now"         | the camera stays                                | take      |     |
// | 0.03a | That slice can climb … if its board …   | seal lands on "agrees", ghost → engraved   | the segment glides right                        | (a) left  |     |
// | 0.04  | And Musk added: "This will be …"        | words light with the voice, "many" glints  | carry('c01>c02') own: the sheet slides right    | (a) cut   |     |
// Carriers: c01>c02 (kind 'own'): Musk's quote sheet is drawn at C.pos(t) with scale s (lib/sc01_sheets.mjs muskSheet, also importable by C2).
import { W, H, rgba, clamp, lin, mix, eout, eio, sm, drift } from '../engine.mjs';
import { carry } from '../lib/carry.mjs';
import { roofTake, roofNight } from '../lib/sc01_roof.mjs';
import { hookHand, lockShot, shareShot } from '../lib/sc01_hook.mjs';
import { plateTake, sheetName, rosetteTake, muskQuote, nameRingScreen } from '../lib/sc01_sheets.mjs';
import { mailboxShot } from '../lib/sc01_mailbox.mjs';
import { handsShot } from '../lib/sc01_hands.mjs';

export default (T, R) => {
  const S = (p, n) => T.S('H0a', p, n), E = (p, n) => T.E('H0a', p, n);
  const S0 = (p, n) => T.S('00a', p, n), E0 = (p, n) => T.E('00a', p, n);
  const C = carry('c01>c02', T, R);
  // ---- anchors ----
  const K = {
    buzz: E('buzzes') + .05 + .1,                 // the phone_buzz sfx starts at E + .05; its first pulse is audible ~.1 s later
    buzz2: E('buzzes') + .05 + 1.12,              // its second pulse
    bill: S('Not a bill'), billW: S('bill'), billE: E('bill'), pay: S('Not a paycheck'), payW: S('paycheck'), payE: E('paycheck'),
    share: S('A share'), shareE: E('A share'),
    t04: S('Your share of'), largest: S('largest'), made: E('ever made'), fantasy: S('fantasy'),
    t06: S('But a few'), promised: S('promised a piece'), piece: S('piece of itself'), good: E('public good'),
    t07: S('Then Elon'), elon: S('Elon Musk'), musk: S('Musk made'), spacex: S('SpaceX share'), every: S('every child'), america: E('in America'),
    t08: S('So whose'), whose: S('whose'), be: E('will it be'),
    t09: S('Let me show'), person: S('every person'), earth: E('on Earth'),
    t10: S('With a plan'), plan: S('plan you'), friend: S('a friend'), tonight: E('tonight'),
    t01: S0('The company'), anth: S0('Anthropic'),
    t03: S0("It's pledging"), now: S0('itself now') + .5, nowE: E0('itself now'),
    t03a: S0('That slice can'), climb1: S0('climb as'), climbs: S0('value climbs'), climb2: S0('value climbs') + .4, board: S0('board agrees'), agrees: S0('agrees'),
    t04q: S0('And Musk added'), added: S0('added'), quote: T.W('00a', 'This will', 'many'), many: S0('of many') + .2, cut: C.t,
  };
  K.t03b = K.shareE + .48;                        // H.04's pull-back starts as the card has locked in
  const shots = [];
  // H.01 ▲ your hand, the phone, the buzz as guilloche rings
  shots.push({ t: R.a, draw: (ctx, t) => hookHand(ctx, t, K), print: { riso: .4 } });
  // H.02a · H.02b · H.03 inside the display (lock-screen motion graphics)
  // one continuous take on the glass: the camera flies into the notification; the cards themselves are the transitions
  shots.push({ t: K.bill, tr: 'zoom', x: 940, y: 470, depth: 4, d: .7, draw: (ctx, t) => lockShot(ctx, t, K), print: { riso: .3 } });
  shots.push({ t: K.pay, tr: 'cut', d: .08, draw: (ctx, t) => lockShot(ctx, t, K), print: { riso: .3 } });
  shots.push({ t: K.payE + .12, tr: 'cut', d: .08, draw: (ctx, t) => shareShot(ctx, t, K), print: { riso: .3 } });
  // H.04 ★ + H.05: one take on the roof (pull back from the display into your hand)
  const K4 = { t0: K.t04, largest: K.largest, made: K.made, fantasy: K.fantasy, out: K.t06 };
  shots.push({ t: K.t04 + .3, tr: 'out', x: 705, y: 636, depth: 9, d: .9, draw: (ctx, t) => roofTake(ctx, t, K4), print: { riso: .25 },
    sound: [{ f: 'whoosh_airy', t: K.t04 - .12, v: .18 }] });
  shots.push({ t: K.fantasy - .55, tr: 'cut', d: .08, draw: (ctx, t) => roofTake(ctx, t, K4), print: { riso: .25 } });
  // H.06 + H.07: one take on the engraving plate (the announcement, the torn corner, Musk's card, the US map)
  const KP = { ...K, cutIn: K.t06 };
  shots.push({ t: K.t06, tr: 'cut', d: .08, draw: (ctx, t) => plateTake(ctx, t, KP), sound: [{ f: 'tear', t: K.piece + .05, v: .15 }] });   // short and low: the tear lands on "piece" (no pause to move it to)
  shots.push({ t: K.t07 - .3, tr: 'cut', d: .08, draw: (ctx, t) => plateTake(ctx, t, KP) });   // (no accent under the running sentence)
  // H.08 the mailbox wall
  shots.push({ t: K.t08 - .2, tr: 'up', d: .6, draw: (ctx, t) => mailboxShot(ctx, t, K) });
  // H.09 the row of open hands
  shots.push({ t: K.t09, tr: 'left', d: .55, draw: (ctx, t) => handsShot(ctx, t, K) });
  // H.10 the two friends on the roof at night
  const K10 = { t0: K.t10, plan: K.plan, friend: K.friend, tonight: K.tonight, out: K.t01 };
  shots.push({ t: K.t10, tr: 'whipL', d: .3, draw: (ctx, t) => roofNight(ctx, t, K10), print: { riso: .25 }, sound: [{ f: 'whoosh_airy', t: K.t01 - .78, v: .14 }] });   // in the long pause after "tonight.": the pen lifts away
  // 0.01 the name under the shadow band, the pen underlines it
  shots.push({ t: K.t01, tr: 'cut', d: .08, draw: (ctx, t) => sheetName(ctx, t, K) });
  // 0.03 + 0.03a the rosette and its slice (one take)
  const [rgx, rgy] = nameRingScreen(K);
  shots.push({ t: K.t03, tr: 'iris', x: rgx, y: rgy, r: 68, d: .8, draw: (ctx, t) => rosetteTake(ctx, t, K) });
  shots.push({ t: K.t03a, tr: 'cut', d: .08, draw: (ctx, t) => rosetteTake(ctx, t, K), sound: [{ f: 'stamp', t: K.agrees + .02, v: .2 }] });   // the board's seal lands on the sentence's last word
  // 0.04 Musk's quote sheet; it slides aside on the register's curve (carry c01>c02, kind 'own')
  shots.push({ t: K.t04q, tr: 'left', d: .6, draw: (ctx, t) => muskQuote(ctx, t, K, C) });
  return shots;
};
