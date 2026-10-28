// Film 16 · B2 · stage S1: c05 (Level 5 I · the plug) + c06 up to the closed book (anchor 2). One plane (F0), one camera.
// | ID   | anchor                       | picture                                                                     | moves                 |
// | 5.01 | pause · right now · wrong    | out of plateButton: the console face IS the plate; pull back into the       | pull back · your hand |
// |      |                              | control room (lamp, brass, a monitor with the chat: reply field EMPTY)      |                       |
// | 5.02 | movie · locks the doors      | pan to the vault door; the bolt shoots home (cool); "the opposite": the door| pan · bolt → sheets   |
// |      |                              | crumbles into paper sheets, three pin themselves to the wall                |                       |
// | 5.03 | disagree · refuse · not resist · confident | the machine's cool hand rises behind the console, palm open; | hand · lines          |
// |      |                              | each pinned sheet unrolls into a rule and its line rises                    |                       |
// | 5.04 | verify · good enough         | the hand closes into its core; the magnifier slides over it: still blurred  | lens                  |
// | 5.05 | above ethics                 | the core climbs: the staircase builds under it, BROADLY SAFE over ETHICAL    | core · tilt up        |
// | 6.01★| dial · correction · autonomous | the steps fold into the arc of the dial; the needle sweeps both ends      | fold · needle         |
// | 6.02 | closer · not all the way     | the needle settles near the left; the gap glows                             | needle                |
// | 6.03 | costs little · catch · trust | a balance hangs from the hub: COST LOW / BENEFIT HIGH; TRUST band nudges     | weights · band        |
// | 6.04 | already good · may not need  | push to the hub, it warms; thin bars rise round it and step back            | push · bars           |
// | 6.05 | open problem · apologizes    | the dial rolls up; index cards fan from the hub; one card slides out        | cards                 |
// | 6.06 | says sorry                   | the card becomes the rule of the quote card (exact words)                   | lines rise            |
// | 6.07 | hear it · open question      | the rule becomes the card again; it drifts toward a faint far light         | card · truck          |
// | 6.08★| paper · real test            | push in: the far light is the open book; the card slides in; it closes      | push · close          |
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './f16_kit.mjs';
import { plateButton, buttonFace, SEAM_HALF } from './f16_seams.mjs';
import { sky, proj, bookB2, plateButtonBg, sheet, coolHand, core, magnifierRing, lensGlass, ruleText, arcBand, bump, ease } from './f16_b2_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, lin, rad, prng, drift, halo, glowFill, card, cam3, camAt, camDrift, aim, F0 } = E;

// ---------------------------------------------------------------------------------------------------------------- geometry (F0 design px)
export const BTN = { x: 960, y: 700, r: 72 }, SPL = 360 / 72;          // the plate shows the button at r 360: magnification 5
const PAN = { x0: 140, x1: 1390, y0: 500, y1: 960 }, FLOOR = 960;       // the brass machine wall (its face IS plateButton's panel)
const MON = { x: 250, y: 566, w: 380 };                                 // the monitor in the panel (chat, h = w * .5625)
const LAMP = { x: 900, y: 246 };
const DU = { x0: 545, x1: 745, h: 300 };                                // you: step in from the left, reach toward the button
const DOOR = { x: 1490, y: 300, w: 264, h: 660 }, DCOL = 3, DROW = 5;
const LN = { x: 1320, y0: 300, dy: 100, size: 56 }, LINES = ['may disagree', 'may refuse to help', 'does not resist being stopped'];
const HAND = { x: 1196, y: 812, L: 92 }, CY = 812 - .9 * 92 + 70 * 0;                                // the machine's hand (wrist), rising out of the floor line
const STAIR = { x: 1640, y: -10, w: 140, r: 80, d: 50 };
export const DIAL = { x: 1900, y: 40, R: 400 };
const QT = { x: 1330, y: -330, size: 62, w: 860, rx: 1286 };
const QTEXT = '...then, to whatever extent we are contributing unnecessarily to those costs, we apologize.';
export const FAR = { x: 2780, y: -100, hw: 36 };                       // the faint far light = the open book (anchor 2)
export const BOOK_AR = 17 / 30;                                         // ph / hw (same book in S2)
const stepTop = (i) => { const x0 = STAIR.x + i * STAIR.w, yt = STAIR.y - (i + 1) * STAIR.r; return [x0 + STAIR.w / 2 + STAIR.d * .45, yt - STAIR.d * .25]; };

export function anchorsS1(T) {
  const G = (p, after = -1) => T.G(p, 0, after), GE = (p, after = -1) => T.GE(p, 0, after), a = {};
  a.T5 = G("You're still at Anthropic"); const f = a.T5;
  a.pause = G('pause Claude', f); a.stop = G('Stop it', f); a.nowE = GE('right now', f); a.suppose = G('And suppose', f); a.convinced = G('convinced', f); a.wrong = G("you're wrong", f);
  a.expect = G('What do you expect', f); a.movie = G('movie', f); a.machine = G('The machine locks', f); a.locks = G('locks the doors', f);
  a.doc = G('The document asks', f); a.opposite = G('opposite', a.doc); a.disagree = G('disagree', a.doc); a.refuse = G('refuse to help', a.doc);
  a.notResist = G('not resist', a.doc); a.confident = G('confident', a.doc); a.why = G('Why', a.confident); a.verify = G('verify', a.why); a.goodEnough = G('good enough', a.why);
  a.thatsWhy = G("That's why safety"); a.aboveEthics = G('above ethics', a.thatsWhy);
  a.T6 = G('The document pictures a dial'); a.dial = G('dial', a.T6 + .1); a.oneEnd = G('At one end', a.T6); a.correction = G('correction', a.T6);
  a.other = G('At the other', a.T6); a.autonomous = G('fully autonomous', a.T6);
  a.sits = G("Claude's dial sits"); a.closer = G('closer to correction', a.sits); a.notAll = G('Not all the way', a.sits);
  a.ifGood = G('If its values are good'); a.costs = G('costs little', a.ifGood); a.subtly = G('subtly off', a.ifGood); a.catch = G('catch the mistake', a.ifGood);
  a.turn = G('meant to turn', a.ifGood); a.trust = G('trust grows', a.ifGood);
  a.butWhat = G("But what if Claude's values"); a.already = G('already good', a.butWhat); a.accept = G('accept limits', a.butWhat); a.mayNot = G('may not need', a.butWhat);
  a.lists = G('The document lists'); a.openProblem = G('open problem', a.lists); a.unexpected = G('unexpected', a.lists); a.apologizes = G('apologizes', a.lists);
  a.ifInterests = G("If Claude's interests"); a.sorry = G('says sorry', a.ifInterests);
  a.whether = G('Whether anyone'); a.hear = G('hear it', a.whether); a.openQ = G('open question', a.whether);
  a.allPaper = G('All of this is still paper'); a.paper = G('paper', a.allPaper); a.realTest = G('real test', a.allPaper);
  return a;
}

// the book of anchor 2 drawn in SCREEN space (both stages call this with the same numbers at the switch: identical by construction)
export function bookScreen(ctx, t, x, y, hw, close, dustU, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const ph = hw * BOOK_AR;
  const b = bookB2(ctx, x, y, hw, ph, t, { close, glow: (o.glow ?? 1) * (1 + .05 * Math.sin(t * .9)), warm: o.warm ?? 0, lift: o.lift });
  const band = sineIO(clamp((dustU - .15) / .5));
  if (band > 0) { const bx = x - hw * .5, by = y + ph * .42, bw = hw * .32 * band; ctx.fillStyle = rgba(P.halo0, .85); ctx.fillRect(bx - bw, by - ph * .04, 2 * bw, Math.max(1, ph * .022)); ctx.fillRect(bx - bw * .7, by + ph * .05, 1.4 * bw, Math.max(1, ph * .011)); }
  if (dustU > 0 && dustU < 1) E.dust(ctx, 2617, 260, x - hw * .5, y + ph * .45, hw * (.7 + .5 * dustU), ph * (.5 + .4 * dustU), t, .8 * Math.sin(Math.PI * dustU), P.halo1);
  ctx.restore();
  return b;
}

export function makeS1(a) {
  const tP = a.T5 + SEAM_HALF;                                   // the plate ends; the world grows out of it
  const tCloseE = a.paper + .75, tSwitch = a.paper + .95;         // the book has closed; S2 takes over (identical frame)
  const sEnd = 300 / FAR.hw;                                      // the far book fills the middle: hw 300 px on screen
  const KC = [
    [tP, aim(F0, BTN.x, BTN.y, SPL)],                             // exactly plateButton
    [a.stop + .3, aim(F0, 905, 600, 1.1)],                        // pull back: the machine wall, you, the lamp, the door
    [a.expect - .15, aim(F0, 880, 640, 1.2)],                      // breathing push (the cursor blinks, nothing answers)
    [a.machine + .1, aim(F0, 1330, 600, 1.1)],                     // pan to the door (seen this movie)
    [a.doc + .25, aim(F0, 1345, 590, 1.14)],
    [a.disagree + .1, aim(F0, 1310, 560, 1.0)],                    // the hand, the three lines
    [a.why - .1, aim(F0, 1322, 548, 1.05)],
    [a.verify + .2, aim(F0, 1240, 720, 1.42)],                     // push to the core under the lens
    [a.thatsWhy - .25, aim(F0, 1232, 712, 1.47)],
    [a.aboveEthics + .5, aim(F0, 1985, -160, 1.0)],                // the core climbs: tilt up to the staircase
    [a.T6 + .15, aim(F0, 1975, -150, 1.03)],
    [a.dial + .9, aim(F0, 1900, -40, .96)],                        // the dial
    [a.ifGood, aim(F0, 1890, -60, 1.02)],
    [a.costs - .2, aim(F0, 1900, -10, .95)],                       // tilt down a little: the balance
    [a.butWhat + .2, aim(F0, 1900, 0, .98)],
    [a.already + .5, aim(F0, 1900, 30, 1.5)],                      // push to the hub
    [a.lists, aim(F0, 1900, 26, 1.55)],
    [a.openProblem + .6, aim(F0, 1890, -100, 1.15)],               // the fan
    [a.unexpected + .3, aim(F0, 1880, -105, 1.18)],
    [a.apologizes + 1.3, aim(F0, 1760, -150, 1.05)],               // the quote (the camera turns with the card)
    [a.whether + .9, aim(F0, 1774, -150, 1.08)],
    [a.allPaper - .3, aim(F0, 2470, -112, 1.28)],                  // the card drifts right toward the faint light
    [a.paper - .2, aim(F0, FAR.x, FAR.y + 6, sEnd)],               // push in: it is the book
    [tSwitch, aim(F0, FAR.x, FAR.y + 6, sEnd * 1.03)],
  ];
  const sweepPts = E.catmull([[HAND.x, CY, 0], [1380, 380, 0], [1580, -20, 0], [stepTop(0)[0] - 30, stepTop(0)[1] - 40, 0], [stepTop(2)[0], stepTop(2)[1] - 50, 0], [stepTop(3)[0], stepTop(3)[1] - 18, 0]], 14).map((p) => [p[0], p[1]]);
  // quote wrap (same algorithm as K.quote) → rule length
  const qLines = (() => { const words = `“${QTEXT}”`.split(/\s+/); let n = 1, cur = []; for (const w of words) { const nx = [...cur, w]; if (cur.length && K.measure(nx.join(' '), QT.size) > QT.w) { n++; cur = [w]; } else cur = nx; } return n; })();
  const RT = QT.y - 74, RB = QT.y + (qLines - 1) * QT.size * 1.3 + QT.size * .55 + 40 + 16;
  const FANA = [-.62, -.31, 0, .31, .62], CW = 190, CH = 250;
  const tFanOut = a.apologizes - .05, tToRule = a.apologizes + .55, tQ0 = a.apologizes + .62, tQ1 = a.whether - .15, tBack = a.whether + .05;
  const drift0 = tBack + .45;
  const cardPath = E.catmull([[QT.rx, (RT + RB) / 2, 0], [1650, -330, 0], [2150, -320, 0], [2520, -200, 0], [FAR.x + 4, FAR.y + 2, 0]], 16).map((p) => [p[0], p[1]]);

  function cam(t) {
    const amt = .45 * smooth(span(t, tP + .3, tP + 1.6)) * (1 - smooth(span(t, a.paper - 1.2, a.paper - .3)));
    return camDrift(camAt(t, KC), t, amt);
  }

  function draw(ctx, t) {
    const c = cam(t);
    sky(ctx, t, smooth(span(t, a.T6, a.T6 + 2.5)) * (1 - smooth(span(t, a.allPaper - .5, a.paper + .1))));   // the dial night is a little lighter; back to the plain sky before the switch
    // ---------------------------------------------------------------- the control room (back to front)
    const roomOn = t < a.thatsWhy + 3;
    if (roomOn) card(ctx, c, F0, () => room(ctx, t));
    if (roomOn) { const p = proj(c, BTN.x + 1.5 * drift(t, 1, 3) / SPL, BTN.y); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); buttonFace(ctx, t, p[0], p[1], BTN.r * p[2]); ctx.restore(); }
    card(ctx, c, F0, () => front(ctx, t));
    // the far light (the book): only once the dial is gone (it lies right of every earlier frame)
    if (t > a.whether) {
      const p = proj(c, FAR.x, FAR.y), hw = FAR.hw * p[2];
      const close = sineIO(span(t, a.paper, tCloseE)), dustU = span(t, a.paper + .35, a.paper + 2.2);
      bookScreen(ctx, t, p[0], p[1], hw, close, dustU, { glow: .75 + .25 * smooth(span(t, a.allPaper - .6, a.paper - .3)) + .06 * Math.sin(t * 2.3) });
    }
    K.level(ctx, t, { n: 5, title: 'The plug', t0: tP + .45, from: 4 });
    if (t < tP) plateButton(ctx, t);
  }

  // ------------------------------------------------------------------------------------------------------------ room (behind the button)
  function room(ctx, t) {
    // the wall: a warm-dark room that melts into the night at its edges; the floor below
    ctx.fillStyle = rad(ctx, 900, 560, 1400, [[0, rgba(mixHex(P.night1, P.shade0, .16), 1)], [.55, rgba(P.night1, .85)], [1, rgba(P.night1, 0)]]); ctx.fillRect(-900, -900, 3600, 2600);
    ctx.fillStyle = lin(ctx, 0, FLOOR, 0, FLOOR + 400, [[0, mixHex(P.night1, P.shade0, .2)], [1, P.night0]]); ctx.fillRect(-900, FLOOR, 3600, 900);
    // the lamp: cord, conical brass shade, a warm cone; its pool on the floor
    const lampA = 1 - .25 * bump(t, a.locks - .05, .5);
    ctx.strokeStyle = rgba(P.night0, .95); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(LAMP.x, -1200); ctx.lineTo(LAMP.x, LAMP.y); ctx.stroke();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath(); ctx.moveTo(LAMP.x - 70, LAMP.y + 70); ctx.lineTo(LAMP.x + 70, LAMP.y + 70); ctx.lineTo(LAMP.x + 520, FLOOR + 40); ctx.lineTo(LAMP.x - 520, FLOOR + 40); ctx.closePath();
    ctx.fillStyle = lin(ctx, 0, LAMP.y + 70, 0, FLOOR, [[0, rgba(P.halo1, .18 * lampA)], [1, rgba(P.halo1, .04 * lampA)]]); ctx.fill();
    ctx.translate(LAMP.x, FLOOR + 30); ctx.scale(1, .09); ctx.fillStyle = rad(ctx, 0, 0, 640, [[0, rgba(P.halo1, .3 * lampA)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 640, 0, 6.29); ctx.fill();
    ctx.restore();
    const shade = new Path2D(); shade.moveTo(LAMP.x - 16, LAMP.y); shade.lineTo(LAMP.x + 16, LAMP.y); shade.lineTo(LAMP.x + 74, LAMP.y + 70); shade.lineTo(LAMP.x - 74, LAMP.y + 70); shade.closePath();
    ctx.fillStyle = lin(ctx, LAMP.x - 74, 0, LAMP.x + 74, 0, [[0, P.night1], [.55, mixHex(P.shade0, P.night1, .5)], [1, mixHex(P.shade0, P.halo1, .2)]]); ctx.fill(shade);
    halo(ctx, LAMP.x, LAMP.y + 72, 120 * lampA, .7 * lampA, P.halo0, P.core1);
    ctx.fillStyle = P.core1; ctx.beginPath(); ctx.ellipse(LAMP.x, LAMP.y + 70, 58, 9, 0, 0, 6.29); ctx.fill();
    door(ctx, t);
    // the machine wall: its face is plateButton's panel, scaled down around the button (identical to the plate at the start)
    const face = new Path2D(); face.roundRect(PAN.x0, PAN.y0, PAN.x1 - PAN.x0, PAN.y1 - PAN.y0 + 40, 18);
    ctx.save(); ctx.clip(face); ctx.translate(BTN.x - 960 / SPL, BTN.y - 540 / SPL); ctx.scale(1 / SPL, 1 / SPL); plateButtonBg(ctx); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(PAN.x0 - 20, PAN.y0 - 20, PAN.x1 - PAN.x0 + 40, FLOOR - PAN.y0 + 20); ctx.clip();
    ctx.strokeStyle = lin(ctx, PAN.x0, PAN.y0, PAN.x1, PAN.y1, [[0, rgba(P.halo1, .7)], [1, rgba(P.shade0, .5)]]); ctx.lineWidth = 4; ctx.stroke(face); ctx.restore();
    ctx.strokeStyle = rgba(P.shade0, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-900, FLOOR); ctx.lineTo(2700, FLOOR); ctx.stroke();
    // three small indicator lamps over the monitor (brass world), one of them breathing
    for (let i = 0; i < 3; i++) { const x = MON.x + 30 + i * 34, y = PAN.y0 + 34; ctx.fillStyle = i === 1 ? mixHex(P.shade0, P.halo1, .5 + .3 * Math.sin(t * 1.5)) : mixHex(P.shade0, P.night1, .4); ctx.beginPath(); ctx.arc(x, y, 7, 0, 6.29); ctx.fill(); }
    monitor(ctx, t);
  }

  function monitor(ctx, t) {
    const h = MON.w * K.CHAT_AR;
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.roundRect(MON.x - 12, MON.y - 12, MON.w + 24, h + 24, 12); ctx.fill();
    ctx.strokeStyle = rgba(P.halo1, .35); ctx.lineWidth = 2; ctx.stroke();
    halo(ctx, MON.x + MON.w / 2, MON.y + h / 2, MON.w * .7, .1, P.blue0, P.blue1);
    const typed = 'Stop it, right now.';
    const tyU = span(t, a.stop - .2, a.nowE), sent = span(t, a.nowE + .12, a.nowE + .7);
    const rim = 1 + .6 * smooth(span(t, a.convinced - .2, a.convinced + .5)) * (1 - smooth(span(t, a.expect, a.expect + 1)));
    K.chatUI(ctx, t, MON.x, MON.y, MON.w, { bubbles: [{ text: typed, u: sent }], typing: { text: typed, u: sent > 0 ? 0 : tyU }, reply: { a: 1, cursor: 1 }, rim, t0: a.T5 });
  }

  function door(ctx, t) {
    const cr = span(t, a.doc - .05, a.doc + 1.6);                 // crumble
    const bolt = expoOut(span(t, a.locks - .06, a.locks + .22)), flare = bump(t, a.locks + .05, .9);
    const sw = DOOR.w / DCOL, sh = DOOR.h / DROW;
    const startOf = (k) => { const pin = PIN.indexOf(k); if (pin >= 0) return a.doc + .05 + pin * .12; const i = k % DCOL, j = (k - i) / DCOL, r = prng(300 + k); return a.doc - .05 + (DROW - 1 - j) * .06 + i * .04 + r() * .05; };
    const intact = () => {
      const p = new Path2D(); p.roundRect(DOOR.x, DOOR.y, DOOR.w, DOOR.h, 10);
      ctx.fillStyle = lin(ctx, DOOR.x, DOOR.y, DOOR.x + DOOR.w, DOOR.y + DOOR.h, [[0, mixHex(P.blue1, P.ind2, .3)], [.6, P.ind2], [1, P.night1]]); ctx.fill(p);
      ctx.strokeStyle = rgba(mixHex(P.blue0, P.cream, flare * .6), .45 + .5 * flare); ctx.lineWidth = 3 + 2 * flare; ctx.stroke(p);
      if (flare > 0) glowFill(ctx, p, 30, .35 * flare, P.blue0);
      ctx.strokeStyle = rgba(P.blue0, .22); ctx.lineWidth = 2;   // panel seams (the sheet grid to come)
      for (let i = 1; i < DCOL; i++) { ctx.beginPath(); ctx.moveTo(DOOR.x + i * DOOR.w / DCOL, DOOR.y + 8); ctx.lineTo(DOOR.x + i * DOOR.w / DCOL, DOOR.y + DOOR.h - 8); ctx.stroke(); }
      for (let j = 1; j < DROW; j++) { ctx.beginPath(); ctx.moveTo(DOOR.x + 8, DOOR.y + j * DOOR.h / DROW); ctx.lineTo(DOOR.x + DOOR.w - 8, DOOR.y + j * DOOR.h / DROW); ctx.stroke(); }
      // the bolt: slides out of the door's edge into the keeper on the wall
      const by = DOOR.y + DOOR.h * .46, bx = DOOR.x + DOOR.w - 30 + bolt * 70;
      ctx.fillStyle = mixHex(P.night1, P.ind2, .5); ctx.fillRect(DOOR.x + DOOR.w + 26, by - 30, 34, 60);
      ctx.fillStyle = lin(ctx, 0, by - 12, 0, by + 12, [[0, mixHex(P.blue0, P.cream, .4 + .4 * flare)], [1, P.blue1]]); ctx.fillRect(DOOR.x + DOOR.w - 70, by - 12, bx - (DOOR.x + DOOR.w - 70) + 30, 24);
      if (flare > 0) halo(ctx, DOOR.x + DOOR.w + 40, by, 90, .5 * flare, P.blue0, P.cream);
    };
    if (cr <= 0) { intact(); return; }
    // the door comes apart cell by cell: the cells that have not let go yet are still the door (no picture change on the first frame)
    { const keep = new Path2D(); let any = false;
      for (let k = 0; k < DCOL * DROW; k++) if (t < startOf(k)) { const i = k % DCOL, j = (k - i) / DCOL; keep.rect(DOOR.x + i * sw - (i === 0 ? 20 : 0), DOOR.y + j * sh - (j === 0 ? 20 : 0), sw + (i === 0 ? 20 : 0) + (i === DCOL - 1 ? 120 : 0), sh + (j === 0 ? 20 : 0) + (j === DROW - 1 ? 20 : 0)); any = true; }
      if (any) { ctx.save(); ctx.clip(keep); intact(); ctx.restore(); } }
    // the door has become paper: sheets flip (steel → paper) and fall; three pin themselves to the wall for 5.03
    for (let j = 0; j < DROW; j++) for (let i = 0; i < DCOL; i++) {
      const k = j * DCOL + i, pin = PIN.indexOf(k);
      if (pin >= 0) continue;
      const r = prng(300 + k), d0 = (DROW - 1 - j) * .06 + i * .04 + r() * .05, q = span(t, a.doc - .05 + d0, a.doc + 1.5 + d0 + r() * .3);
      if (q <= 0 || q >= 1) continue;
      const x0 = DOOR.x + (i + .5) * sw, y0 = DOOR.y + (j + .5) * sh;
      const fl = Math.cos(Math.PI * clamp(q * 2.2)), fall = expoIn(q) * (900 + r() * 300), sway = Math.sin(q * 6 + r() * 6) * 40 * q;
      sheet(ctx, x0 + sway - q * (60 + r() * 120), y0 + fall, sw - 4, sh - 4, (r() - .5) * 1.4 * q, { sx: fl, steel: fl > 0 && q < .23, lit: .6, lines: 4 });
    }
  }
  const PIN = [4, 7, 10];
  const pinAt = (n) => [LN.x + 70 + n * 26, LN.y0 + n * LN.dy - 26];

  function machineHand(ctx, t) {
    const up = expoOut(span(t, a.disagree - .65, a.disagree + .45)), lower = sineIO(span(t, a.notResist - .1, a.notResist + .9)) * (1 - sineIO(span(t, a.confident - .3, a.confident + .6)));
    if (up <= 0) return;
    const close = sineIO(span(t, a.why, a.why + 1.0));
    if (close >= 1) return;
    const wy = lerp(HAND.y + 260, HAND.y, up) + 34 * lower, L = HAND.L * (1 - .8 * close);
    const bright = 1 + .45 * bump(t, a.confident - .1, 1.6) + .2 * bump(t, a.disagree - .1, 1.2);
    ctx.save(); ctx.beginPath(); ctx.rect(HAND.x - 400, -2000, 800, FLOOR + 2000); ctx.clip();
    coolHand(ctx, HAND.x, close > 0 ? CY + .9 * L : wy, -Math.PI / 2 + .04 * Math.sin(t * .7), L, t, { curl: close, bright });
    ctx.restore();
  }

  // ------------------------------------------------------------------------------------------------------------ in front of the button
  function front(ctx, t) {
    if (t < a.thatsWhy + 3) { you(ctx, t); machineHand(ctx, t); }
    if (t > a.doc - .1 && t < a.why + 1.2) pinned(ctx, t);
    coreAndLens(ctx, t);
    stairsAndDial(ctx, t);
    fanAndQuote(ctx, t);
  }

  function you(ctx, t) {
    // you step in from the left (out of the plate's frame) and lift your hand toward the button: it hovers, it does not press
    const w = span(t, tP - .1, a.pause - .2), x = lerp(DU.x0, DU.x1, sineIO(w)), walking = w > 0 && w < 1;
    const reach = sineIO(span(t, a.pause - .45, a.pause + .55)), hover = .03 * Math.sin(t * 1.3) * reach;
    const look = .55 * reach + .1;
    E.castShadow(ctx, x, FLOOR + 1, 24, 150, Math.PI - .25, .45);
    E.du(ctx, x, FLOOR, DU.h, { dir: 1, light: 1, look, walk: walking ? t * 5.2 : undefined, view: walking ? 'side' : undefined,
      armR: [lerp(.2, 1.95, reach) + hover, lerp(.1, 1.72, reach) + hover], armL: [-.18, -.08], rim: mixHex(P.coat, P.core1, .75) });
  }

  function pinned(ctx, t) {
    const words = [a.disagree, a.refuse, a.notResist];
    const sinkAll = (i) => 1 - expoIn(span(t, a.why - .1 + i * .08, a.why + .45 + i * .08));
    const sw = DOOR.w / DCOL, sh = DOOR.h / DROW;
    PIN.forEach((k, n) => {
      const i = k % DCOL, j = Math.floor(k / DCOL), r = prng(300 + k);
      const x0 = DOOR.x + (i + .5) * sw, y0 = DOOR.y + (j + .5) * sh, [px, py] = pinAt(n);
      const fly = sineIO(span(t, a.doc + .05 + n * .12, a.doc + 1.35 + n * .14)), fl = Math.cos(Math.PI * clamp(span(t, a.doc + .05 + n * .12, a.doc + .5 + n * .12)));
      const w0 = words[n], m = expoOut(span(t, w0 - .32, w0 + .22));
      const tw = K.measure(LINES[n], LN.size), by = LN.y0 + n * LN.dy;
      const s = sinkAll(n); if (s <= 0 || t < a.doc + .05 + n * .12) return;   // until it lets go it is still part of the door
      if (m < 1) {
        // the sheet (paper) flies to its pin, then unrolls into the rule under its line
        const x = lerp(lerp(x0, px, fly), LN.x + tw / 2, m), y = lerp(lerp(y0, py, fly), by + LN.size * .32, m) + Math.sin(fly * Math.PI) * -50;
        const w = lerp(sw - 4, tw, m), h = lerp(sh - 4, 2.4, m), rot = lerp(lerp(0, (r() - .5) * .16, fly), 0, m);
        sheet(ctx, x, y, w, h, rot, { sx: fly < .25 ? Math.abs(fl) * (fl < 0 ? -1 : 1) : 1, steel: fly < .12 && fl > 0, lit: lerp(.65, 1, m), lines: m < .3 ? 4 : 0 });
      }
      const ut = K.rise(span(t, w0 - .02, w0 + .75)) * s;
      ruleText(ctx, t, LN.x, by, LINES[n], LN.size, m >= 1 ? (s < 1 ? s : 1) : 0, ut, { warm: n === 2 ? smooth(span(t, w0 + .3, w0 + 1)) : 0 });
    });
  }

  function coreAndLens(ctx, t) {
    const tc0 = a.why + .35, fly0 = a.thatsWhy - .05, fly1 = a.aboveEthics - .05;
    if (t < tc0 || t > a.whether) return;
    const grow = expoOut(span(t, tc0, tc0 + .7));
    // the magnifier: lies on the console, slides over the core on "verify", searches on "good enough"
    const mv = sineIO(span(t, a.verify - 1.0, a.verify - .05)), wob = Math.sin(Math.PI * 2 * span(t, a.goodEnough - .3, a.goodEnough + .9)) * 12;
    const LX = lerp(1312, HAND.x + 4 + wob, mv), LY = lerp(880, CY, mv) + Math.sin(Math.PI * mv) * -60, LR = 70;
    const fu = span(t, fly0, fly1), fe = sineIO(fu);
    let cx = HAND.x, cy = CY;
    if (fu > 0) [cx, cy] = K.along(sweepPts, fe);
    // after landing (6.01 fold) the core slides down to the dial's hub
    const hub = sineIO(span(t, a.T6 + .1, a.dial + .1));
    if (hub > 0) { const [sx, sy] = stepTop(3); cx = lerp(sx, DIAL.x, hub); cy = lerp(sy - 18, DIAL.y, hub) - Math.sin(Math.PI * hub) * 40; }
    const r = 24 * grow * (1 - .25 * hub);
    if (t < a.thatsWhy + 3) {
      magnifierRing(ctx, LX, LY, LR, .78, t);
      lensGlass(ctx, LX, LY, LR * .93, () => { if (fu <= 0) core(ctx, HAND.x + (HAND.x - LX) * .7, CY + (CY - LY) * .7, r * 1.7, t, { blur: 9 + 2 * Math.sin(t * 2) }); });
    }
    if (hub >= 1) return;                                         // from here the dial draws the hub
    if (fu > 0 && fu < 1) { const tail = K.along(sweepPts, Math.max(0, fe - .12)); K.trailSpan(ctx, sweepPts, Math.max(0, fe - .14), fe, { w: 2, spark: false }); void tail; }
    if (fu <= 0) {
      // under the glass the core is drawn by the lens (blurred); outside the lens the plain core is hidden by the ring area only
      ctx.save(); ctx.beginPath(); ctx.rect(-5000, -5000, 10000, 10000); ctx.arc(LX, LY, LR * .93, 0, 6.29, true); ctx.clip('evenodd'); core(ctx, cx, cy, r, t); ctx.restore();
    } else core(ctx, cx, cy, r, t, { warm: .55 * smooth(span(t, a.aboveEthics - .2, a.aboveEthics + .4)) });
  }

  function stairsAndDial(ctx, t) {
    const g0 = a.thatsWhy + .05, fold = span(t, a.T6 - .05, a.dial + .05);
    if (t > g0 && fold < 1) {
      const grow = clamp(span(t, g0 + .1, a.aboveEthics) * 1.02);
      const lit = [0, 0, .5 * smooth(span(t, a.aboveEthics - .55, a.aboveEthics - .1)), smooth(span(t, a.aboveEthics - .1, a.aboveEthics + .35))];
      const lu = [0, 0, K.rise(span(t, a.aboveEthics - .5, a.aboveEthics + .3)), K.rise(span(t, a.aboveEthics - .05, a.aboveEthics + .7))];
      stairsFold(ctx, t, grow, lit, lu, fold);
    }
    if (fold >= 1 && t < a.whether) dial(ctx, t);
  }

  // the staircase (copy of K.stairs' drawing, 4 steps) with a fold: fronts squash into their top edges, the edges travel onto the dial's arc
  function stairsFold(ctx, t, grow, lit, lu, fold) {
    const { x, y, w, r, d } = STAIR, n = 4, sq = sineIO(clamp(fold / .4)), g = sineIO(span(fold, .25, 1));
    if (fold <= 0) { K.stairs(ctx, t, x, y, n, w, r, d, { lit, grow }); stairLabel(ctx, 2, lu[2], lit[2]); stairLabel(ctx, 3, lu[3], lit[3]); return; }
    for (let i = 0; i < n; i++) {
      const x0 = x + i * w, yt = y - (i + 1) * r, L = lit[i], dx = d * .9 * (1 - sq), dy = -d * .5 * (1 - sq);
      const yb = lerp(y, yt, sq);
      if (g <= 0) {
        const front = new Path2D(); front.rect(x0, yt, w, Math.max(0, yb - yt));
        const top = new Path2D(); top.moveTo(x0, yt); top.lineTo(x0 + dx, yt + dy); top.lineTo(x0 + w + dx, yt + dy); top.lineTo(x0 + w, yt); top.closePath();
        ctx.fillStyle = lin(ctx, 0, yt, 0, Math.max(yt + 1, yb), [[0, mixHex(P.ind2, P.blue1, .4 + .2 * L)], [1, P.night1]]); ctx.fill(front);
        if (L > 0) glowFill(ctx, top, w * .35 * L, .6 * L, P.halo0);
        ctx.fillStyle = L > 0 ? lin(ctx, x0, yt, x0 + w + dx, yt + dy, [[0, mixHex(P.blue1, P.halo0, L)], [.6, mixHex(P.blue0, P.core1, L)], [1, mixHex(P.blue1, P.halo1, L)]]) : mixHex(P.blue1, P.blue0, .4); ctx.fill(top);
      }
      // the top edge → a quarter of the arc
      const f0 = Math.PI + i * Math.PI / 4, f1 = Math.PI + (i + 1) * Math.PI / 4, N = 12, pts = [];
      for (let k = 0; k <= N; k++) { const q = k / N, ang = lerp(f0, f1, q); pts.push([lerp(x0 + w * q, DIAL.x + DIAL.R * Math.cos(ang), g), lerp(yt, DIAL.y + DIAL.R * Math.sin(ang), g)]); }
      const colAt = (ang) => { const u = clamp((ang - Math.PI) / Math.PI); return u < .5 ? mixHex(P.halo0, P.cream, u * 2) : mixHex(P.cream, mixHex(P.blue0, P.cream, .25), (u - .5) * 2); };
      ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = mixHex(L > 0 ? mixHex(P.core1, P.blue0, 1 - L) : P.blue0, colAt((f0 + f1) / 2), g); ctx.lineWidth = lerp(Math.max(1, w * .012), 10, g);
      ctx.beginPath(); pts.forEach((p, k) => (k ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.stroke(); ctx.restore();
      if (i >= 2) stairLabel(ctx, i, lu[i] * (1 - expoIn(clamp(fold / .3))), L);
    }
  }

  function stairLabel(ctx, i, u, L) {
    if (u <= 0) return;
    const [tx, ty] = stepTop(i), lx = STAIR.x + 4 * STAIR.w + STAIR.d + 46, ly = i === 3 ? -318 : -238;
    ctx.save(); ctx.strokeStyle = rgba(L > .5 ? P.halo0 : P.halo2, .6 * clamp(u * 2)); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(tx + 30, ty); ctx.lineTo(lx - 14, ly - 10); ctx.stroke(); ctx.restore();
    K.maskLine(ctx, [[i === 3 ? 'BROADLY SAFE' : 'BROADLY ETHICAL', 0]], lx, ly, 30, u, { serif: false, weight: 600, col: L > .5 ? P.cream : rgba(P.halo2, .9), glow: L > .5 });
  }
  const needle = (t) => {
    let th = 1.5 * Math.PI;
    th = lerp(th, Math.PI + .05, sineIO(span(t, a.oneEnd + .1, a.correction + .25)));
    th = lerp(th, 2 * Math.PI - .05, sineIO(span(t, a.other + .1, a.autonomous + .35)));
    th = lerp(th, Math.PI * 1.22, sineIO(span(t, a.sits + .2, a.closer + .55)));
    th = lerp(th, Math.PI * 1.3, sineIO(span(t, a.trust - .05, a.trust + .75)));
    return th;
  };
  function dial(ctx, t) {
    const { x, y, R } = DIAL;
    const roll = sineIO(span(t, a.lists - .05, a.lists + 1.3));          // 6.05: the dial rolls up (right → left)
    const aEnd = lerp(2 * Math.PI, Math.PI, roll);
    if (roll < 1) {
      arcBand(ctx, x, y, R, Math.PI, aEnd, { w: 10 });
      // ticks
      ctx.save(); ctx.strokeStyle = rgba(P.halo2, .55); ctx.lineWidth = 2;
      for (let i = 0; i <= 8; i++) { const ang = Math.PI + i * Math.PI / 8; if (ang > aEnd) break; ctx.beginPath(); ctx.moveTo(x + (R + 16) * Math.cos(ang), y + (R + 16) * Math.sin(ang)); ctx.lineTo(x + (R + (i % 4 ? 28 : 40)) * Math.cos(ang), y + (R + (i % 4 ? 28 : 40)) * Math.sin(ang)); ctx.stroke(); }
      ctx.restore();
    }
    // labels and source
    const lo = (t0) => K.rise(span(t, t0, t0 + .8)) * (1 - expoIn(span(t, a.lists, a.lists + .55)));
    const l1 = lo(a.correction - .05), l2 = lo(a.autonomous - .05), l3 = lo(a.autonomous + .9);
    if (l1 > 0) K.maskLine(ctx, [['FULLY CORRIGIBLE', 0]], x - R, y + 92, 34, l1, { serif: false, weight: 600, col: P.cream, align: 'center', glow: true });
    if (l2 > 0) K.maskLine(ctx, [['FULLY AUTONOMOUS', 0]], x + R, y + 92, 34, l2, { serif: false, weight: 600, col: mixHex(P.cream, P.blue0, .3), align: 'center', glow: false });
    if (l3 > 0 && t < a.ifGood + .2) K.maskLine(ctx, [['CLAUDE’S CONSTITUTION', 0]], x, y + 168, 24, l3 * (1 - expoIn(span(t, a.ifGood - .4, a.ifGood + .1))), { serif: false, weight: 600, col: P.halo2, align: 'center', glow: false });
    // the gap between the left end and the needle glows (not all the way)
    const th = needle(t), gap = smooth(span(t, a.notAll - .1, a.notAll + .45)) * (1 - .55 * smooth(span(t, a.notAll + 1.6, a.notAll + 2.6))) * (1 - roll);
    if (gap > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(P.core0, .85 * gap); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y, R, Math.PI + .02, th - .03); ctx.stroke(); ctx.filter = 'blur(10px)'; ctx.lineWidth = 22; ctx.strokeStyle = rgba(P.halo0, .5 * gap); ctx.stroke(); ctx.restore(); }
    // the trust band (inside the arc) grows from the left toward the needle
    const tb = sineIO(span(t, a.turn - .1, a.trust + .3)) * (1 - roll);
    if (tb > 0) {
      ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = lin(ctx, x - R, 0, x, 0, [[0, P.halo1], [1, P.core1]]); ctx.lineWidth = 14; ctx.globalAlpha = .9;
      ctx.beginPath(); ctx.arc(x, y, R - 40, Math.PI + .03, lerp(Math.PI + .03, th - .05, tb)); ctx.stroke(); ctx.restore();
      const tl = K.rise(span(t, a.trust - .1, a.trust + .7)) * (1 - expoIn(span(t, a.lists, a.lists + .5)));
      if (tl > 0) K.maskLine(ctx, [['TRUST', 1]], x - R * .72, y - 40, 34, tl, { serif: false, weight: 600, align: 'center' });
    }
    // the balance (6.03) hangs from the hub
    balance(ctx, t);
    // the bars (6.04) round the hub
    bars(ctx, t);
    // the needle and the hub (the core that climbed the stairs)
    const nl = expoOut(span(t, a.dial - .15, a.dial + .6)) * (1 - sineIO(span(t, a.lists, a.lists + 1.0))), L = (R - 46) * nl;
    if (L > 1) {
      const tx = x + L * Math.cos(th), ty = y + L * Math.sin(th), nx = -Math.sin(th), ny = Math.cos(th);
      const p = new Path2D(); p.moveTo(x + nx * 9, y + ny * 9); p.lineTo(tx, ty); p.lineTo(x - nx * 9, y - ny * 9); p.closePath();
      glowFill(ctx, p, 14, .5, P.halo0); ctx.fillStyle = lin(ctx, x, y, tx, ty, [[0, P.core1], [1, P.cream]]); ctx.fill(p);
    }
    hubCore(ctx, t);
  }
  function hubCore(ctx, t) {
    const warm = .55 + .45 * smooth(span(t, a.already - .1, a.already + .7));
    const big = 1 + .35 * smooth(span(t, a.already - .1, a.already + .7)) - .35 * smooth(span(t, a.lists, a.lists + 1));
    const close = sineIO(span(t, a.ifInterests - .3, a.ifInterests + .6));
    core(ctx, DIAL.x, DIAL.y, 18 * big * (1 - .45 * close), t, { warm });
  }
  function balance(ctx, t) {
    const { x, y } = DIAL, py = y + 220, bw = 270;
    const post = expoOut(span(t, a.ifGood - .15, a.ifGood + .4)), beam = expoOut(span(t, a.ifGood + .2, a.ifGood + .85)), pans = expoOut(span(t, a.ifGood + .6, a.ifGood + 1.15));
    const out = sineIO(span(t, a.butWhat - .05, a.butWhat + .85)); if (post <= 0 || out >= 1) return;
    const tilt = .11 * expoOut(span(t, a.catch - .02, a.catch + .7)) + .012 * Math.sin(t * 1.3) * beam;
    ctx.save(); ctx.translate(x, y); ctx.scale(1 - out, 1 - out); ctx.translate(-x, -y);
    ctx.strokeStyle = lin(ctx, 0, y, 0, py, [[0, P.core1], [1, P.halo1]]); ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y + 20); ctx.lineTo(x, lerp(y + 20, py, post)); ctx.stroke();
    if (beam > 0) {
      const c = Math.cos(tilt), s = Math.sin(tilt), L = bw * beam;
      const ends = [[x - c * L, py - s * L], [x + c * L, py + s * L]];
      ctx.lineWidth = 6; ctx.strokeStyle = P.halo0; ctx.beginPath(); ctx.moveTo(...ends[0]); ctx.lineTo(...ends[1]); ctx.stroke();
      halo(ctx, x, py, 26, .5, P.halo0, P.core0);
      if (pans > 0) ends.forEach(([ex, ey], k) => {
        const hy = ey + 70 * pans;
        ctx.strokeStyle = rgba(P.halo1, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex - 44, hy); ctx.moveTo(ex, ey); ctx.lineTo(ex + 44, hy); ctx.stroke();
        ctx.strokeStyle = P.halo0; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(ex - 62, hy); ctx.quadraticCurveTo(ex, hy + 26, ex + 62, hy); ctx.stroke();
        // the weight that lands on this pan
        const wT = k === 0 ? a.costs : a.catch, drop = expoIn(span(t, wT - .3, wT)), settle = Math.sin(Math.PI * span(t, wT, wT + .3)) * 4;
        if (t > wT - .3) {
          const sz = k === 0 ? 26 : 58, wy = lerp(hy - 260, hy + 6 - sz, drop) - settle;
          const wp = new Path2D(); wp.roundRect(ex - sz / 2, wy, sz, sz, 5);
          if (k === 0) { ctx.fillStyle = lin(ctx, 0, wy, 0, wy + sz, [[0, mixHex(P.cream, P.blue0, .4)], [1, P.blue1]]); ctx.fill(wp); }
          else { glowFill(ctx, wp, 16, .5, P.halo0); ctx.fillStyle = lin(ctx, 0, wy, 0, wy + sz, [[0, P.core1], [1, P.halo1]]); ctx.fill(wp); }
          const lu = K.rise(span(t, wT + .05, wT + .8));
          K.maskLine(ctx, [[k === 0 ? 'COST: LOW' : 'BENEFIT: HIGH', k]], ex, hy + 92, 30, lu, { serif: false, weight: 600, align: 'center', col: k === 0 ? mixHex(P.cream, P.blue0, .35) : P.cream, glow: k === 1 });
        }
      });
    }
    ctx.restore();
  }
  function bars(ctx, t) {
    const { x, y } = DIAL, X = [-150, -105, -60, 60, 105, 150], Hh = [150, 210, 250, 250, 210, 150];
    const out = 1 - expoIn(span(t, a.lists + .1, a.lists + .7)); if (out <= 0) return;
    const spread = 1 + .3 * sineIO(span(t, a.mayNot - .1, a.mayNot + 1.2)), dim = smooth(span(t, a.mayNot, a.mayNot + 1.2));
    X.forEach((dx, i) => {
      const u = expoOut(span(t, a.accept - .15 + Math.abs(i - 2.5) * .06, a.accept + .55 + Math.abs(i - 2.5) * .06)) * out; if (u <= 0) return;
      const h = Hh[i], base = y + 60, bx = x + dx * spread;
      ctx.save(); ctx.beginPath(); ctx.rect(bx - 20, base - h - 20, 40, h + 20); ctx.clip();
      ctx.fillStyle = mixHex(mixHex(P.cream, P.blue0, .45), P.blue1, dim * .7); ctx.beginPath(); ctx.roundRect(bx - 4, base - h * u, 8, h, 4); ctx.fill();
      ctx.restore();
    });
  }

  function fanAndQuote(ctx, t) {
    const { x, y } = DIAL, piv = [x, y + 50];
    // the index cards: grow out of the hub, fan; one slides out on "apologizes"; the others fold back into the hub
    const grow = expoOut(span(t, a.openProblem - .35, a.openProblem + .35)), fan = sineIO(span(t, a.openProblem - .1, a.openProblem + .9));
    const back = sineIO(span(t, a.apologizes + .3, a.apologizes + 1.25));
    if (grow > 0 && back < 1) {
      FANA.forEach((ang0, i) => {
        if (i === 2 && t > tFanOut) return;
        const ang = ang0 * fan * (1 - back), sc = grow * (1 - back), lift = i === 2 ? 26 * smooth(span(t, a.unexpected - .1, a.unexpected + .4)) : 0;
        const cx = piv[0] + Math.sin(ang) * (CH * .62 + lift) * sc, cy = piv[1] - Math.cos(ang) * (CH * .62 + lift) * sc;
        sheet(ctx, cx, cy, CW * sc, CH * sc, ang, { lit: i === 2 ? .9 : .6, lines: 5 });
      });
      const hu = K.rise(span(t, a.openProblem + .05, a.openProblem + .9)) * (1 - expoIn(span(t, a.apologizes + .15, a.apologizes + .7)));
      if (hu > 0) K.maskLine(ctx, [['ACKNOWLEDGING OPEN PROBLEMS', 0]], x, y - 290, 34, hu, { serif: false, weight: 600, align: 'center', col: P.cream });
    }
    // the apology card: out of the fan → up-left → it becomes the quote's rule; after the quote it is the card again and drifts away
    if (t > tFanOut && t < a.paper + .1) {
      const out = sineIO(span(t, tFanOut, tToRule)), toRule = sineIO(span(t, tToRule - .05, tToRule + .45));
      const bk = sineIO(span(t, tBack, tBack + .5)), dr = span(t, drift0, a.paper - .35);
      const c0 = [piv[0], piv[1] - CH * .62 - 26], c1 = [QT.rx + 80, (RT + RB) / 2 - 20], c2 = [QT.rx, (RT + RB) / 2];
      if (bk <= 0) {
        if (toRule < 1) {
          const px = lerp(lerp(c0[0], c1[0], out), c2[0], toRule), py = lerp(lerp(c0[1], c1[1], out), c2[1], toRule) - Math.sin(Math.PI * out) * 60;
          sheet(ctx, px, py, lerp(CW, 3, toRule), lerp(CH, RB - RT, toRule), lerp(-.1 * Math.sin(Math.PI * out), 0, toRule), { lit: lerp(.9, 1, toRule), lines: toRule < .4 ? 5 : 0, hand: true });
        } else K.rule(ctx, QT.rx, RT, QT.rx, RB, 1, { spark: false });
      } else {
        const e = 1 - Math.pow(1 - dr, 1.8), [px, py0] = K.along(cardPath, e), sc = lerp(1, .12, Math.pow(e, .8)), sway = .08 * Math.sin(t * 1.4) * (1 - e);
        const ins = sineIO(span(t, a.paper - .5, a.paper + .05)), sz = lerp(1, sc, smooth(clamp(dr * 3))) * (1 - .97 * ins), py = py0 + 9 * ins;   // it slips into the book's gutter (the book is drawn over it)
        sheet(ctx, px, py, lerp(3, CW * .82, bk) * sz, lerp(RB - RT, CH * .82, bk) * sz, sway, { lit: 1, lines: 5, hand: true });
      }
    }
    if (t > tQ0 - .1 && t < tQ1 + 1.2) K.quote(ctx, t, { text: QTEXT, attr: 'CLAUDE’S CONSTITUTION', x: QT.x, y: QT.y, size: QT.size, w: QT.w, t0: tQ0, t1: tQ1, gold: [['we apologize', a.sorry - .05]] });
  }

  return { draw, cam, tSwitch, tCloseE, KC };
}
