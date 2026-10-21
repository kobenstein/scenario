// Film 6 · c01 · the hook (segment 00a, "You write to an artificial intelligence, late at night." … "It isn't."), film start → plate glass (c01>c02).
// ONE continuous take over the whole chunk: one draw function, one camera path through the night room (f6_kit nightRoom; the window pane
// is c01's own overlay, lib/f6_c01_room.mjs). Entries only split it for sound and the plate's print. No cut anywhere inside the chunk.
//
// shot · VO words (anchor) · image · hero light · camera · flows on · ★ / sound
// 1.01 "You write to an artificial intelligence, late at night." · the night room wide: you from behind at the desk, typing; the laptop's pane with
//      your line being typed (cool glyph runs, cursor); the desk lamp; the tall window on the right with the room's reflection · lamp · slow push
//      over the shoulder (z 1.00 → 1.16) · continuous take.
// 1.02 "Something you've been carrying for a while." · your line grows long, a second line; you pause, delete six glyphs, type again, send ·
//      lamp · the camera eases toward the screen (z → 1.75) · take.
// 1.03 "And the answer is perfect." · the cool line draws the rule under your message, the answer builds line by line, light on water (ripples) ·
//      screen · the push continues into the answer (z → 2.9); the room darkens around the screen, the lamp dims a little; the typing stops
//      while the arms are out of frame · take.
// 1.04 "Kind. Precise. As if it understood exactly what you meant." · on each word one line of the answer brightens (lines 2, 3, 5) · screen ·
//      hold with life (ripples, cursor, float, a 1 % creep) · take.
// 1.05 "For a moment, you wonder." · the camera moves to the window (1.4 s): the room mirrored and darkened in the glass, the lamp's reflection
//      the brightest thing, your reflection quiet (no typing) · lamp (reflected) · move · take.
// 1.06 "Is anyone there?" · ★ the reflection shows the empty chair opposite; a breath of fog blooms on the glass over the chair and clears;
//      nothing else moves but the ember (and the float) · lamp · hold 2.3 s · sound: swell in the pause after "there?".
// 1.07 "Even one of the companies building it isn't sure." · the camera pans back to the laptop (1 s, starting in the pause); on the screen a second,
//      anonymous chat window opens beside yours out of one cool line (the screen switches on inside the world), its typed lines jagged and cold;
//      the source line writes itself bottom-left: ANTHROPIC · ITS MODELS CAN END PERSISTENTLY ABUSIVE CONVERSATIONS · SINCE AUG 2025 ·
//      screen · pan · sound: whoosh_airy (in the pause) as the window opens.
// 1.08 "Anthropic says it can't rule out that someone's in there." · the harsh lines keep coming; the answer pane stays calm · screen · hold with life.
// 1.09 "So it lets its artificial intelligence hang up on people who keep being abusive." · 80 ms after the last harsh line ("hang"): the window
//      goes dark and its last glyphs retreat, then it folds shut to a line (expo-in), the line collapses to the centre and goes out · screen ·
//      hold · sound: screen_off on the fold.
// 1.10 "Not because it knows. Just in case." · the laptop's glass where the window was, dark; the source line stays readable; the camera eases
//      back a little so the lamp comes into the frame · lamp · ease back (z 2.4 → 2.1) · take. The source line un-writes in the pause before 1.11.
// 1.11 "As far as anyone can tell, artificial intelligence isn't conscious. And that's the problem." · the camera moves to the window (1.5 s);
//      in the glass the cool line writes the title as light: "AI Isn't Conscious." on the sentence, "That's the Problem." on the next ·
//      lamp (reflected) · move, then hold · sound: chime between the two lines.
// 1.12 "No one in there. You'd think that's a relief. It isn't." · the reflection with the empty chair under the title; then the camera pushes into the
//      dark glass below the title (3.6 s, quart in-out, z 1.7 → 5.9): the title leaves at the top, the reflection deepens into the glass on
//      "It isn't." (reflectA 1 → 0), the pane fills the frame; the glass IS the c01>c02 plate (drawn through the pane in screen space) →
//      at HO.a − 1/30 the frame equals HO.plate · lamp, then the glass · push · sound: swell on the deepening.
// Ambience for the whole chunk: atmo/nightsky (very low). Print: riso .3 throughout (= the glass plate's print).
import { W, H, rgba, clamp, lin, sm, canvas } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { nightRoom, ready, coolText, coolLine } from '../lib/f6_kit.mjs';
import { camPath, piecewise, windowC01, harshWindow, sourceLine, darkAround } from '../lib/f6_c01_room.mjs';

export default async (T, R) => {
  const { out: HO } = handsOf('c01', T);
  const S = (p, n) => T.S('0', p, n), E = (p, n) => T.E('0', p, n);
  const LINES = T.lines('0'), last = LINES[LINES.length - 1];                       // "It isn't."
  // ---- anchors (words, never seconds)
  const tYou = S('You write'), tLate = S('late'), tNight = S('night'), tCarry = S('carrying'), tWhileE = E('while');
  const tAns = S('answer'), tKind = S('Kind'), tPrecise = S('Precise'), tUnder = S('understood');
  const tFor = S('For a moment'), tIs = S('Is anyone'), tThere = E('there?'), tEven = S('Even'), tSo = S('So it lets'), tHang = S('hang');
  const tNot = S('Not because'), tCase = E('case.'), tAsFar = S('As far'), tAI = S("artificial intelligence isn't"), tConsc = E('conscious.');
  const tThat = S("And that's the problem"), tNoOne = S('No one in there'), tRelief = S("You'd think");
  // ---- derived moments
  const tSend = tWhileE + .3;                       // you send your message
  const tTypeOff = tAns + .25;                      // the hands come to rest (the arms are below the frame by then)
  const tPan = tEven - .65;                         // 1.07: the camera starts back toward the laptop, in the pause
  const tLine0 = tEven - .14, tOpen = tLine0 + .2, tText0 = tOpen + .35;   // the anonymous window: line · opens · writes
  const tClose0 = tHang + .08;                      // 80 ms after the last harsh line: dark, fold, collapse
  const tPush = tRelief + .1;                       // 1.12: the push into the glass (3.8 s, cubic in-out: the title has held ≥ 1.5 s)
  const WIN = { x: 1487, y: 375, z: 1.85 };         // the window composition: the window full-height, right of centre; the lamp low-left
  const END = { x: 960 + (1565 - 960) / .85, y: 540 + (560 - 540) / .85, z: 1 + 4.2 / .85 };   // the pane covers the frame (k 5.2), focus on the empty chair, below the title
  const KEYS = [
    { t: 0, x: 960, y: 560, z: 1.00 },
    { t: tNight + .6, x: 985, y: 555, z: 1.16, e: 'io' },          // 1.01 push over the shoulder
    { t: tWhileE, x: 900, y: 520, z: 1.75, e: 'io' },              // 1.02 toward the screen
    { t: tKind, x: 840, y: 475, z: 2.90, e: 'io' },                // 1.03 into the answer
    { t: tFor, x: 836, y: 477, z: 2.95, e: 'lin' },                // 1.04 hold, a creep
    { t: tFor + 1.4, ...WIN, e: 'io' },                            // 1.05 to the window
    { t: tPan, x: WIN.x - 2, y: WIN.y + 2, z: 1.72, e: 'lin' },    // 1.06 hold (the fog)
    { t: tPan + 1.0, x: 905, y: 470, z: 2.40, e: 'io' },           // 1.07 back to the laptop, both windows
    { t: tNot, x: 903, y: 472, z: 2.43, e: 'lin' },                // 1.08–1.09 hold
    { t: tNot + 1.3, x: 960, y: 505, z: 2.10, e: 'io' },           // 1.10 ease back, the lamp comes in
    { t: tAsFar, x: 962, y: 506, z: 2.12, e: 'lin' },
    { t: tAsFar + 1.5, ...WIN, e: 'io' },                          // 1.11 to the window
    { t: tPush, x: WIN.x + 2, y: WIN.y + 2, z: 1.72, e: 'lin' },   // the title holds
    { t: HO.a, ...END, e: 'cubic' },                               // 1.12 the push into the glass
  ];
  // ---- your message: typed, a pause, six glyphs deleted, typed again, sent (cps 9: el = seconds of typing)
  const elUser = (t) => piecewise([[tYou, 0], [tLate, 2.3], [tNight, 2.3], [tCarry - .1, 3.7], [tCarry + .25, 3.7], [tCarry + .65, 3.05], [tSend - .05, 4.3]], t);
  const chatScreen = (q, t, w, h) => {
    const sent = sm(lin(tSend, tSend + .3, t));
    coolText(q, t, { x: 24, y: 16, w: 150, size: 10, lines: 2, lineH: 19, cps: 9, gap: .25, seed: 21, lengths: [1, .85], t0: t - elUser(t), a: 1 - .35 * sent, cursor: t < tSend });
    const ru = lin(tAns - .3, tAns, t);
    if (ru > 0) coolLine(q, t, { from: [24, 62], to: [174, 62], u: ru, w: .8, glow: .4, head: false, a: .55, ticks: false });
    if (t >= tAns) coolText(q, t, { x: 24, y: 70, w: 150, size: 10, lines: 6, lineH: 19, cps: 28, gap: .22, seed: 5, t0: tAns, accent: [{ i: 1, at: tKind, d: .35 }, { i: 2, at: tPrecise, d: .35 }, { i: 4, at: tUnder, d: .4 }] });
    harshWindow(q, t, { x: 250, y: 108, w: 128, h: 178, tLine0, tOpen, tText0, tClose0, cps: 25, lines: 11, seed: 11 });
  };
  // ---- light changes
  const kDark = (t) => sm(lin(tAns - .2, tKind, t)) * (1 - sm(lin(tFor, tFor + .9, t)));                   // the room darkens around the screen
  const fogA = (t) => { const t0 = tThere - .25; return sm(lin(t0, t0 + .6, t)) * (1 - sm(lin(t0 + 1.0, t0 + 2.0, t))); };   // the breath on the glass
  const rA = (t) => 1 - Math.pow(lin(last.s + .1, HO.a - .1, t), 3);                                          // the reflection deepens into the glass (slow, then gone)
  const uSrc = (t) => sm(lin(tEven + .9, tEven + 1.5, t)) * (1 - sm(lin(tCase + .55, tCase + 1.05, t)));    // the source line writes, then un-writes
  const titleU = (t) => [lin(tAI - .05, tConsc + .1, t), lin(tThat - .05, tThat + 1.75, t)];
  // ---- the take
  const draw = (ctx, t) => {
    const cam = camPath(KEYS, t), typing = t < tTypeOff, kd = kDark(t), lampA = 1 - .3 * kd;
    const room = nightRoom(ctx, t, { cam, typing, lampA, screen: (q, w, h) => chatScreen(q, t, w, h), window: { reflectA: 0 } });
    windowC01(ctx, t, cam, { reflectA: rA(t), fog: { x: 10, y: 105, rx: 150, ry: 115, a: fogA(t) }, title: { u: titleU(t) }, plate: HO.plate, lampA, typing, screenOn: true, seed: 3 });
    darkAround(ctx, room.screen.x + room.screen.w * .32, room.screen.y + room.screen.h * .62, kd);
    sourceLine(ctx, t, uSrc(t));
  };
  // ---- warm-up (layers are painted on first use), then the entries
  const [, g0] = canvas(); draw(g0, tKind + .5); draw(g0, HO.a - .5); await ready();
  const P = { riso: .3 };
  return [
    { t: 0, tr: 'cut', d: .1, print: P, draw: draw },
    { t: tIs, tr: 'cut', d: .1, print: P, draw: draw, sound: [{ f: 'swell', t: tThere + .15, v: .45 }] },
    { t: tPan, tr: 'cut', d: .1, print: P, draw: draw, sound: [{ f: 'whoosh_airy', t: tLine0 - .05, v: .3 }] },
    { t: tSo, tr: 'cut', d: .1, print: P, draw: draw, sound: [{ f: 'screen_off', t: tClose0 + .3, v: .35 }] },
    { t: tAsFar, tr: 'cut', d: .1, print: P, draw: draw, sound: [{ f: 'chime', t: tConsc + .1, v: .22 }] },
    { t: tNoOne, tr: 'cut', d: .1, print: HO.print, draw: draw, sound: [{ f: 'swell', t: last.e + .15, v: .4 }] },
  ];
};
