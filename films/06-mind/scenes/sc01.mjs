// Film 6 · c01 · the hook (segment 00a, Fassung 3 = hook A, Jakob 2026-10-21: "The artificial intelligence you talk to is very probably not
// conscious." … "So if no one is in there, who does the caring?"), film start → plate glass (c01>c02).
// ONE continuous take over the whole chunk: one draw function, one camera path through the night room (f6_kit nightRoom; the window pane
// is c01's own overlay, lib/f6_c01_room.mjs). Entries only split it for sound and the plate's print. No cut anywhere inside the chunk.
// (Fassung 1–2 had a 44 s scene hook, "You write to an artificial intelligence, late at night." … "It isn't."; Jakob: too long, the first
// words must say what the film is about. Same room, same objects, new order.)
//
// shot · VO words (anchor) · image · hero light · camera · flows on · ★ / sound
// 1.01 "The artificial intelligence you talk to" · the night room wide: you from behind at the desk, typing; your short line on the laptop's
//      pane, sent; the answer builds line by line (cool glyph runs) · lamp → screen · one push over the shoulder (z 1.00 → 2.10, cubic) · take.
// 1.02 "is very probably" · the push arrives in the answer; the room darkens around the screen, the answer is calm and perfect · screen.
// 1.03 "not conscious. No one in there." · the camera moves to the window (1.3 s, landing on "No one"): the room mirrored in the glass, the lamp's reflection the brightest
//      thing, ★ the empty chair opposite you; the cool line writes the first title line as light in the glass: "AI Isn't Conscious." ·
//      lamp (reflected) · move, then hold · take.
// 1.04 "And that is the problem." · the second line writes under it: "That's the Problem." · hold (a slow creep back) · sound: chime when
//      the title is complete, in the pause.
// 1.05 "Intelligence and consciousness are two different things." · the camera pulls back to the desk: you (left, lamp-lit, warm) and the
//      laptop (right, cool). On "Intelligence" the answer's lines brighten one by one and INTELLIGENCE writes itself above the screen (cool);
//      on "consciousness" the lamp breathes up and CONSCIOUSNESS writes itself above your head (amber) · both lights · move, then hold.
// 1.06 "Caring comes from the second." · the warm light grows around you (the lamp swells, a warm rim on head and shoulders), the screen's
//      glow and its label sink back; then both labels un-write in the pause · lamp · hold with life · take.
// 1.07 "Even one of the companies building it isn't sure." · the camera goes to the laptop (1 s, starting in the pause); on the screen a
//      second, anonymous chat window opens beside yours out of one cool line, its typed lines jagged and cold; the source line writes itself
//      bottom-left: ANTHROPIC · ITS MODELS CAN END PERSISTENTLY ABUSIVE CONVERSATIONS · SINCE AUG 2025 · screen · pan · sound: whoosh_airy
//      (in the pause) as the window opens.
// 1.08 "Anthropic lets its artificial intelligence hang up on people who keep being abusive." · the harsh lines keep coming, your answer pane
//      stays calm; 80 ms after the last harsh line ("hang"): the window goes dark, its last glyphs retreat, it folds shut to a line (expo-in),
//      the line collapses to the centre and goes out · screen · hold · sound: screen_off on the fold.
// 1.09 "Not because it knows. Just in case." · the laptop's glass where the window was, dark; the source line stays readable; the camera eases
//      back so the lamp comes into the frame · lamp · ease back (z 2.4 → 2.1) · take. The source line un-writes in the pause.
// 1.10 "So if no one is in there, who does the caring?" · the camera moves to the window again (1.3 s, in the pause): the title still in the
//      glass, the empty chair under it; from "in there," the camera pushes into the dark glass below the title (3.4 s, cubic,
//      z 1.72 → 5.9): the title leaves at the top, the reflection deepens into the glass (reflectA 1 → 0), the pane fills the frame; the glass
//      IS the c01>c02 plate (drawn through the pane in screen space) → at HO.a − 1/30 the frame equals HO.plate · lamp, then the glass ·
//      push · sound: swell on the deepening, after the question.
// Ambience for the whole chunk: atmo/nightsky (very low). Print: riso .3 throughout (= the glass plate's print).
import { W, H, rgba, clamp, lin, sm, canvas, text, addGlow } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { F6, nightRoom, ready, coolText, coolLine, reveal } from '../lib/f6_kit.mjs';
import { camPath, piecewise, windowC01, harshWindow, sourceLine, darkAround } from '../lib/f6_c01_room.mjs';

// a label in the split's lettering (f6_kit splitLight: Inter 600 caps, wide spacing), revealed left to right and un-revealed the same way
function label(ctx, s, x, y, u, col, size = 24) {
  u = clamp(u); if (u <= 0) return;
  ctx.save(); ctx.font = `600 ${size}px "Inter"`; const w = ctx.measureText(s).width + s.length * size * .42 + 24; ctx.restore();
  reveal(ctx, x - w / 2, y - size * 1.4, w, size * 2, u, (g) => text(g, s, x, y, { size, weight: 600, color: col, align: 'center', spacing: size * .42 }));
}

export default async (T, R) => {
  const { out: HO } = handsOf('c01', T);
  const S = (p, n) => T.S('0', p, n), E = (p, n) => T.E('0', p, n);
  // ---- anchors (words, never seconds)
  const tThe = S('The artificial'), tVery = S('very'), tConsc = E('not conscious.');
  const tNoOne = S('No one in there'), tThere = E('No one in there.'), tAnd = S('And that is'), tProbE = E('the problem.');
  const tIntel = S('Intelligence and'), tCon = S('consciousness are'), tThings = E('different things.');
  const tCaring = S('Caring comes'), tSecond = E('the second.');
  const tEven = S('Even'), tHang = S('hang'), tNotB = S('Not because'), tCase = E('case.');
  const tWho = S('who does'), tQ = E('the caring?');
  // ---- derived moments
  const tSend = tThe + .9;                          // you send your short line
  const tAns = tSend + .35;                         // the answer starts
  const tTypeOff = tAns + .2;                       // the hands come to rest
  const tWin1 = tNoOne - 1.5;                       // 1.03: the camera leaves the answer for the window (on "not conscious"), lands on "No one"
  const tBack = tProbE + .35;                       // 1.05: back to the desk, in the pause after the title
  const tPan = tEven - .65;                         // 1.07: the camera starts toward the laptop, in the pause
  const tLine0 = tEven - .14, tOpen = tLine0 + .2, tText0 = tOpen + .35;   // the anonymous window: line · opens · writes
  const tClose0 = tHang + .08;                      // 80 ms after the last harsh line: dark, fold, collapse
  const tWin2 = tCase + .15;                        // 1.10: to the window again, in the pause
  const tPush = HO.a - 3.4;                         // the push into the glass (3.4 s, cubic in-out): it starts on "in there,", the question rides it
  const WIN = { x: 1487, y: 375, z: 1.85 };         // the window composition: the window full-height, right of centre; the lamp low-left
  const TWO = { x: 715, y: 565, z: 1.5 };           // 1.05–1.06: you and the laptop (the window with the title stays out of frame)
  const END = { x: 960 + (1565 - 960) / .85, y: 540 + (560 - 540) / .85, z: 1 + 4.2 / .85 };   // the pane covers the frame (k 5.2), focus on the empty chair, below the title
  const KEYS = [
    { t: 0, x: 960, y: 560, z: 1.00 },
    { t: tWin1, x: 880, y: 492, z: 2.10, e: 'cubic' },             // 1.01–1.02 one push over the shoulder into the answer
    { t: tWin1 + 1.3, ...WIN, e: 'io' },                           // 1.03 to the window
    { t: tBack, x: WIN.x - 2, y: WIN.y + 2, z: 1.76, e: 'lin' },   // 1.03–1.04 the title holds, a slow creep back
    { t: tBack + 1.1, ...TWO, e: 'io' },                           // 1.05 back to you and the laptop
    { t: tPan, x: TWO.x + 6, y: TWO.y - 3, z: TWO.z + .06, e: 'lin' },   // 1.05–1.06 hold, a creep
    { t: tPan + 1.0, x: 905, y: 470, z: 2.40, e: 'io' },           // 1.07 the laptop, both windows
    { t: tNotB, x: 903, y: 472, z: 2.43, e: 'lin' },               // 1.08 hold
    { t: tNotB + 1.3, x: 890, y: 505, z: 2.10, e: 'io' },          // 1.09 ease back, the lamp comes in (the window with the title stays out of frame)
    { t: tWin2, x: 892, y: 506, z: 2.12, e: 'lin' },
    { t: tWin2 + 1.3, ...WIN, e: 'io' },                           // 1.10 to the window
    { t: tPush, x: WIN.x + 2, y: WIN.y + 2, z: 1.78, e: 'lin' },   // the title and the empty chair
    { t: HO.a, ...END, e: 'cubic' },                               // the push into the glass
  ];
  // ---- your short line: typed from before the first word, sent (cps 9: el = seconds of typing)
  const elUser = (t) => piecewise([[.25, 0], [tSend - .05, 2.0]], t);
  const answerA = (t) => 1 - .3 * sm(lin(tCaring, tCaring + 1.2, t)) * (1 - sm(lin(tSecond + .4, tEven, t)));   // 1.06: the screen sinks back a little
  const chatScreen = (q, t, w, h) => {
    const sent = sm(lin(tSend, tSend + .3, t));
    coolText(q, t, { x: 24, y: 16, w: 150, size: 10, lines: 1, lineH: 19, cps: 9, gap: .25, seed: 21, lengths: [.8], t0: t - elUser(t), a: 1 - .35 * sent, cursor: t < tSend });
    const ru = lin(tAns - .3, tAns, t);
    if (ru > 0) coolLine(q, t, { from: [24, 43], to: [174, 43], u: ru, w: .8, glow: .4, head: false, a: .55, ticks: false });
    if (t >= tAns) coolText(q, t, { x: 24, y: 51, w: 150, size: 10, lines: 6, lineH: 19, cps: 56, gap: .16, seed: 5, t0: tAns, a: answerA(t),
      accent: [{ i: 0, at: tIntel, d: .35 }, { i: 2, at: tIntel + .2, d: .35 }, { i: 4, at: tIntel + .4, d: .4 }] });
    harshWindow(q, t, { x: 250, y: 108, w: 128, h: 178, tLine0, tOpen, tText0, tClose0, cps: 25, lines: 11, seed: 11 });
  };
  // ---- light changes
  const kDark = (t) => sm(lin(tAns, tVery + .6, t)) * (1 - sm(lin(tWin1, tWin1 + .9, t)));               // the room darkens around the screen
  const warm = (t) => sm(lin(tCaring - .1, tCaring + 1.1, t)) * (1 - sm(lin(tSecond + .5, tEven + .2, t)));   // 1.06: the warm light grows around you
  const rA = (t) => 1 - Math.pow(lin(tWho, HO.a - .1, t), 3);                                                  // the reflection deepens into the glass (slow, then gone)
  const uSrc = (t) => sm(lin(tEven + .9, tEven + 1.5, t)) * (1 - sm(lin(tCase + .55, tCase + 1.05, t)));    // the source line writes, then un-writes
  const titleU = (t) => [lin(tNoOne - .05, tThere + .15, t), lin(tAnd - .05, tProbE + .05, t)];
  const offL = (t) => 1 - sm(lin(tSecond + .25, tSecond + .85, t));                                           // both labels un-write in the pause
  const uIntel = (t) => lin(tIntel - .05, tIntel + .6, t) * offL(t), uCon = (t) => lin(tCon - .05, tCon + .75, t) * offL(t);
  // ---- the take
  const draw = (ctx, t) => {
    const cam = camPath(KEYS, t), typing = t < tTypeOff, kd = kDark(t), wm = warm(t), lampA = (1 - .3 * kd) * (1 + .35 * wm);
    const room = nightRoom(ctx, t, { cam, typing, lampA, screen: (q, w, h) => chatScreen(q, t, w, h), window: { reflectA: 0 } });
    windowC01(ctx, t, cam, { reflectA: rA(t), title: { u: titleU(t) }, plate: HO.plate, lampA, typing, screenOn: true, seed: 3 });
    darkAround(ctx, room.screen.x + room.screen.w * .32, room.screen.y + room.screen.h * .62, kd);
    if (wm > 0) {   // the warm light around you (1.06): the lamp's colour on head and shoulders
      const [hx, hy] = room.head, k = cam.z;
      addGlow(ctx, hx + 30 * k, hy + 40 * k, 240 * k, .28 * wm, F6.amber, F6.amberCore);
      addGlow(ctx, hx + 10 * k, hy + 10 * k, 95 * k, .14 * wm, F6.amberCore, '#fff1d6');
    }
    const ui = uIntel(t), uc = uCon(t);
    if (ui > 0) label(ctx, 'INTELLIGENCE', room.screen.x + room.screen.w / 2, room.screen.y - 30 * cam.z, ui, rgba(F6.cool, .92 * (1 - .4 * wm)), 21 * cam.z);
    if (uc > 0) label(ctx, 'CONSCIOUSNESS', room.head[0], room.head[1] - 74 * cam.z, uc, rgba(F6.amberCore, .95), 21 * cam.z);
    sourceLine(ctx, t, uSrc(t));
  };
  // ---- warm-up (layers are painted on first use), then the entries
  const [, g0] = canvas(); draw(g0, tVery + .5); draw(g0, HO.a - .5); await ready();
  const P = { riso: .3 };
  return [
    { t: 0, tr: 'cut', d: .1, print: P, draw: draw, sound: [{ f: 'chime', t: tProbE + .12, v: .22 }] },
    { t: tPan, tr: 'cut', d: .1, print: P, draw: draw, sound: [{ f: 'whoosh_airy', t: tLine0 - .05, v: .3 }, { f: 'screen_off', t: tClose0 + .3, v: .35 }] },
    { t: tWin2, tr: 'cut', d: .1, print: HO.print, draw: draw, sound: [{ f: 'swell', t: tQ + .15, v: .4 }] },
  ];
};
