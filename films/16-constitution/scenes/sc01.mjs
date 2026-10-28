// c01 · Hook (anchor 1: the book) + Level 1 · the white lie · 0 → T.G('A letter from your landlord') · built by the lead (quality reference).
// Plan: docs/shots.md 1.01–1.12 (source tools/shots16.py) · world/rules: docs/MOTION.md · kit: lib/f16_kit.mjs (+ f10_editorial, f13_kit).
// ONE entry, two worlds joined by a flight into a surface: the hook's chat box (beside the book) and your laptop screen are the same
// chatUI drawn the same way, so at tSwitch (both fill the frame with the same glass and the same content) the world behind it changes
// unseen. The chunk ends in plateChat (lib/f16_seams.mjs) for the last .5 s: the push into the laptop lands exactly on it.
//
// | ID    | anchor (word)              | picture (one idea)                                                    | 1–2 moves                 | camera                    |
// |-------|----------------------------|-----------------------------------------------------------------------|---------------------------|---------------------------|
// | 1.01★ | constitution · eighty · thinks | the giant open book of light, you tiny at its foot, the blue head;   | label · riffle · threads  | slow push                 |
// |       |                            | three printed lines lift as threads into the head (network starts)    |                           |                           |
// | 1.02  | ten minutes                | a line on the left page lifts: it runs up and becomes the quote rule  | the thread                | tilt up (follows it)      |
// | 1.03  | world-altering · building  | quote card (exact words), two phrases warm on their words             | lines rise · warm         | hold, drift               |
// | 1.04  | aren't for you · machine · training | the card sinks, the thread goes home; pages fly into the head  | page stream               | tilt down, pan right      |
// | 1.05  | words                      | push to the head, the last thread enters, the network lights          | last thread               | push                      |
// | 1.06  | say · read · told          | a thread draws the chat box: Claude's reply field EMPTY, cursor;      | box drawn · page warms    | pull back, then flight    |
// |       |                            | the book page warms (we can read what it's told)                      |                           | into the box              |
// | 1.07  | paste in · not good        | LEVEL 1 · the box is your laptop at the kitchen table, warm lamp;     | pull back · lines fly     | pull back                 |
// |       |                            | the card's lines fly into your bubble, one sags                       |                           |                           |
// | 1.08  | Be honest · like it        | you type, it sends; the reply field stays empty                       | typing                    | slight push               |
// | 1.09  | lovely                     | the friend across the table leans in: "Lovely!"                       | lean · bubble             | pull back wide            |
// | 1.10  | Not even                   | the bubble unrolls into the rule; quote card, "not even" warms        | rule · lines              | tilt up to the wall       |
// | 1.11  | dishonestly · Kind · clear | diplomatically honest ↔ dishonestly diplomatic (the words swap)       | swap · strike             | hold, drift               |
// | 1.12  | hurt you                   | back at the screen; the chat scrolls away; push into the glass        | scroll · push             | tilt down, push → plate   |
import * as E from '../lib/f10_editorial.mjs';
import * as K from '../lib/f16_kit.mjs';
import { plateChat, CHAT_PLATE, SEAM_HALF } from '../lib/f16_seams.mjs';
import { Path2D } from '@napi-rs/canvas';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, card, cam3, camAt, camDrift, aim, F0 } = E;
const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));

export const PRINT = K.PRINT16;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0, n = 0) => T.G(p, n, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.cons = G('constitution'); a.eighty = G('eighty pages'); a.art = G('the artificial intelligence Claude thinks'); a.thinks = G('thinks');
  a.ten = G('In ten minutes'); a.tenE = GE('ten minutes');
  a.makers = G('Its makers'); a.wa = G('world-altering', a.makers); a.build = G('building it', a.makers); a.buildE = GE('building it', a.makers);
  a.but = G('But these pages'); a.afy = G("aren't for you", a.but); a.mach = G('machine', a.but); a.train = G('training', a.but);
  a.can = G('Can you give a mind'); a.words = G('words', a.can); a.know = G("We can't know"); a.say = G('say', a.know); a.read = G('read what', a.know); a.told = G('told', a.know);
  a.paste = G('You paste in'); a.poem = G('birthday poem', a.paste); a.proud = G('proud', a.paste); a.notgood = G('not good', a.paste);
  a.type = G('You type', a.paste); a.honest = G('Be honest', a.type); a.like = G('like it', a.type); a.likeE = GE('like it', a.type);
  a.friend = G('A polite friend'); a.lovely = G('lovely', a.friend); a.doc = G('The document says', a.friend); a.noteven = G('Not even that', a.doc);
  a.dipl = G('Diplomatically honest'); a.dish = G('not dishonestly', a.dipl); a.kind = G('Kind, but clear'); a.clear = G('clear', a.kind);
  a.easy = G('Easy with a poem'); a.hurt = G('hurt you', a.easy);
  a.end = R.b;
  return [{ t: 0, draw: scene(a, T), print: PRINT }];
};

// ===================================================================================================== geometry (focus plane, design px)
const GROUND = 905;
const BK = { cx: 640, cy: 652, hw: 380, ph: 218 };            // the open book (hook)
const DU = { x: 1088, h: 150 };                              // you, tiny at its foot
const HD = { x: 1170, y: 46, h: 862 };                       // the head of light (thumbnail profile, facing left)
const BOX = { x: 1150, y: 500, w: 640 };                     // the hook's chat box (h = w * .5625)
const LAB = 'CLAUDE’S CONSTITUTION · ANTHROPIC, JANUARY 2026';
// quote 1 (hook) in the sky above the book; the camera tilts up by TILT
const TILT = -170, Q1 = { x: 178, y: -16, size: 58, w: 960 }, RULE1_X = 138;
const Q1TEXT = 'we believe that AI might be one of the most world-altering and potentially dangerous technologies in human history, yet we are developing this very technology ourselves.';
// kitchen
const LS = { x: 760, y: 334, w: 520 };                       // the laptop screen = the chat rect (h = w * .5625 = 225)
const LAMP = { x: 1000, y: 196 };
const FR = { x: 1392, y: 812, h: 336 };                      // the friend (behind the table)
const YOU = { x: 600, y: 1012, h: 404 };                     // you, from behind, at the near side of the table
const CARD = { x: 640, y: 690, w: 104, h: 86 };              // the birthday card (tent), base line y
// quote 2 + the word pair on the dark wall left of the lamp cord, inside the wide frame (no tilt: the camera only breathes)
const Q2 = { x: 300, y: 104, size: 64, w: 640 }, RULE2_X = 266, RULE2_TOP = Q2.y - 70, RULE2_BOT = Q2.y + 150;
const PAIR = { x: 1110, y: 132, size: 64, dy: 96 };   // right of the cord: it answers the quote (left) while the quote still stands

function scene(a, T) {
  const tSwitch = a.paste - .14;                               // flight into the box ends: the world behind the glass changes
  const boxC = [BOX.x + BOX.w / 2, BOX.y + BOX.w * K.CHAT_AR / 2], scrC = [LS.x + LS.w / 2, LS.y + LS.w * K.CHAT_AR / 2];
  const SIN = 3.2;                                             // magnification of the box at the switch (box covers the frame: 640 × 3.2 > 1968)
  const T0 = a.end, tPlate = T0 - SEAM_HALF;
  // Calm budget (calm.py mafd median ≤ ~.45): moves are 2.5–3.5 s sine-S on word keys, separated by long breathing holds (drift only).
  const KH = [                                                 // hook camera
    [0, cam3({ z: -70, x: -30, y: 34 })],
    [a.art, cam3({ z: 40, x: -14, y: 14 })],                    // slow push while the label and the threads appear
    [a.ten - .2, cam3({ z: 60, x: -10, y: 12 })],
    [a.makers + .6, cam3({ z: 96, x: -40, y: TILT })],          // tilt up with the rising line: the quote above the book
    [a.but + .35, cam3({ z: 106, x: -44, y: TILT - 8 })],       // hold until the card has sunk (no line leaves the frame)
    [a.mach + .5, cam3({ z: 80, x: 30, y: -96 })],              // a short tilt back down (the book stays in frame)
    [a.can + .2, cam3({ z: 92, x: 60, y: -84 })],               // hold while the pages fly into the head
    [a.words + .4, cam3({ z: 130, x: 170, y: 10 })],            // settle: book left, the empty box right
    [a.know + 1.4, cam3({ z: 136, x: 178, y: 12 })],            // hold (the gap: the cursor blinks)
    [tSwitch, aim(F0, boxC[0], boxC[1], SIN), 's'],             // the flight lands on the glass (no lurch at the switch)
  ];
  const KK = [                                                 // kitchen camera
    [tSwitch, aim(F0, scrC[0], scrC[1], SIN * BOX.w / LS.w)],
    [a.paste + 3.1, aim(F0, 1000, 505, 1.85)],                  // pull back from rest: the kitchen opens around the screen
    [a.friend - .25, aim(F0, 1020, 495, 1.92)],                 // breathing push while you type
    [a.lovely + .6, aim(F0, 1000, 425, 1.04)],                  // pull back to the room (friend, lamp, wall)
    [a.hurt - 1.75, aim(F0, 975, 425, 1.12)],                  // breathing push while the quote and the pair stand
    [tPlate, aim(F0, scrC[0], scrC[1], CHAT_PLATE.w / LS.w, CHAT_PLATE.x + CHAT_PLATE.w / 2, CHAT_PLATE.y + CHAT_PLATE.w * K.CHAT_AR / 2)],   // push into the screen, landing on plateChat
  ];
  // threads and paths (computed once)
  const head0 = { entry: [HD.x + .2 * HD.h, HD.y + .3 * HD.h], center: [HD.x + .47 * HD.h, HD.y + .34 * HD.h] };
  const ruleTop = Q1.y - 70, ruleBot = Q1.y + 4 * Q1.size * 1.3 + 70;
  const pathPts = (p0, p1, mids) => E.catmull([p0, ...mids, p1].map((p) => [p[0], p[1], 3]), 12).map((p) => [p[0], p[1]]);
  const rand = E.prng(1601), PAGES = Array.from({ length: 6 }, (_, i) => ({ u: .28 + .45 * rand(), v: .25 + .45 * rand(), d: i * .2 + rand() * .08, sp: .9 + rand() * .3 }));
  const swap = { w1: K.measure('diplomatically ', PAIR.size), dis: K.measure('dis', PAIR.size), dishly: K.measure('dishonestly ', PAIR.size), dip: K.measure('diplomatic', PAIR.size), hon: K.measure('honest', PAIR.size) };

  return (ctx, t) => {
    const hook = t < tSwitch;
    // drift goes quiet around the switch and into the plate (the frames there must match exactly); the move itself carries life
    const dAmt = .8 * (1 - bump(t, tSwitch - .45, .9)) * (1 - smooth(span(t, tPlate - .6, tPlate)));
    const c = camDrift(camAt(t, hook ? KH : KK), t, dAmt);
    if (hook) hookWorld(ctx, t, c); else kitchen(ctx, t, c);
    // level 1: the stamp rises as the kitchen opens, then glides into the corner (badge)
    K.level(ctx, t, { n: 1, title: 'The white lie', t0: tSwitch + .05 });
    if (t >= tPlate) plateChat(ctx, t);
  };

  // ------------------------------------------------------------------------------------------------------------ the hook world
  function hookWorld(ctx, t, c) {
    // the threads at "thinks": three lines of the right page lift and run into the head
    const thr = [1, 3, 5].map((i, k) => ({ i, t0: a.art + .25 + k * .22 }));
    const tLast = a.words - 1.15;                                 // the last thread (1.05) arrives on "words"
    const tLine = a.tenE + .1;                                    // 1.02: the left-page line that becomes the quote rule
    const back = a.but - .05;                                     // the rule goes home
    const lit = .2 * smooth(span(t, a.thinks - .45, a.thinks + .5)) + .42 * smooth(span(t, a.mach + .9, a.train + .45)) + .2 * smooth(span(t, a.words - .2, a.words + .45));
    const flash = bump(t, a.words - .05, .9) * .9 + .25 * bump(t, a.thinks - .1, .8);
    const lift = (i, side) => {
      if (side === 'R') { const th = thr.find((q) => q.i === i); if (th) return smooth(span(t, th.t0, th.t0 + .35)); if (i === 7) return smooth(span(t, tLast, tLast + .3)); return 0; }
      if (i === 3) return smooth(span(t, tLine, tLine + .3)) * (1 - smooth(span(t, back + 1.25, back + 1.5)));
      return 0;
    };
    const look = lerp(.25, .75, sineIO(span(t, a.cons - .5, a.cons + 1))) + .25 * sineIO(span(t, a.afy - .2, a.afy + .8)) - .3 * sineIO(span(t, a.know, a.know + 1));

    card(ctx, c, 40000, () => {
      E.nightSky(ctx, [[0, P.night0], [.5, P.night1], [1, P.ind0]], -1400, H + 300);
      ctx.fillStyle = E.rad(ctx, 1500, 260, 1500, [[0, rgba(P.ind1, .95)], [.45, rgba(P.ind1, .45)], [1, rgba(P.ind0, 0)]]); ctx.fillRect(-W, -2 * H, 3 * W, 4 * H);
      E.stars(ctx, 16, 200, t, [-400, -900, W + 600, H + 300], .8);
    });
    card(ctx, c, 6500, () => {     // a soft editorial sweep on the left (depth)
      ctx.beginPath(); ctx.moveTo(-700, 300); ctx.bezierCurveTo(150, 260, 520, 600, 560, 1500); ctx.lineTo(-700, 1500); ctx.closePath();
      ctx.fillStyle = E.lin(ctx, 460, 560, 40, 1000, [[0, rgba(P.ind1, 0)], [.35, rgba(P.ind1, .55)], [1, rgba(P.ind0, 1)]]); ctx.fill();
    });
    card(ctx, c, F0, () => {
      const hd = K.head(ctx, HD.x, HD.y, HD.h, t, { lit, flash, entry: [.2, .3] });
      E.ground(ctx, [[-400, GROUND + 6], [900, GROUND], [2400, GROUND - 6]], { rim: rgba(P.blue0, .9), stops: [[0, P.night1], [1, P.night0]] });
      // the book's light on the ground (a soft pool) and your shadow away from it
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(BK.cx, GROUND + 4); ctx.scale(1, .1);
      ctx.fillStyle = E.rad(ctx, 0, 0, 700, [[0, rgba(P.halo1, .35)], [.5, rgba(P.halo1, .1)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 700, 0, 6.29); ctx.fill(); ctx.restore();
      E.castShadow(ctx, DU.x, GROUND + 1, 22, 120, -.2, .5);
      const riffle = span(t, a.eighty - .1, a.eighty + 1.05);
      const warm = smooth(span(t, a.read - .1, a.told + .2)) * (1 - .4 * smooth(span(t, tSwitch - .6, tSwitch)));
      const bk = K.book(ctx, BK.cx, BK.cy, BK.hw, BK.ph, t, { lift, riffle, warm, glow: 1 + .06 * Math.sin(t * .9) });
      E.du(ctx, DU.x, GROUND, DU.h, { dir: -1, look: clamp(look), light: -1, armL: [-.18, -.08], armR: [.16, .1] });
      // the label rises on "constitution" (and stays until the pages leave)
      const lu = K.rise(span(t, a.cons - .1, a.cons + .8)) * (1 - expoIn(span(t, a.makers - 1.2, a.makers - .6)));
      if (lu > 0) K.maskLine(ctx, [[LAB, 0]], BK.cx - BK.hw, BK.cy - 58, 24, lu, { serif: false, weight: 600, col: P.halo2, glow: false, spacing: .1 });
      // 1.01 threads → head
      for (const th of thr) {
        const L = bk.lines.R[th.i], p0 = [L[2], L[3]], pts = pathPts(p0, hd.entry, [[p0[0] + 70, p0[1] - 150], [lerp(p0[0], hd.entry[0], .6), lerp(p0[1], hd.entry[1], .45) - 90]]);
        const uh = smooth(span(t, th.t0, th.t0 + 1.15)), ut = smooth(span(t, th.t0 + 1.0, th.t0 + 1.8));
        if (uh > 0 && ut < 1) K.trailSpan(ctx, pts, ut, uh, { w: 2.2 });
      }
      // 1.05 the last thread
      { const L = bk.lines.R[7], p0 = [L[2], L[3]], pts = pathPts(p0, hd.entry, [[p0[0] + 90, p0[1] - 190], [lerp(p0[0], hd.entry[0], .6), lerp(p0[1], hd.entry[1], .45) - 120]]);
        const uh = smooth(span(t, tLast, a.words)), ut = smooth(span(t, a.words - .1, a.words + .55));
        if (uh > 0 && ut < 1) K.trailSpan(ctx, pts, ut, uh, { w: 2.6 }); }
      // 1.02 → 1.04 the rule: a left-page line runs up into the sky and stands as the quote's rule; at "But these pages" it goes home
      { const L = bk.lines.L[3], p0 = [L[4], L[5]];
        const pts = pathPts(p0, [RULE1_X, ruleTop], [[p0[0] - 60, p0[1] - 110], [260, ruleBot + 60], [RULE1_X, ruleBot]]);
        const iR = pts.findIndex((p, k) => k > 3 && p[1] <= ruleBot + 2);
        const lens = pts.slice(1).map((p, k) => Math.hypot(p[0] - pts[k][0], p[1] - pts[k][1])), tot = lens.reduce((s, v) => s + v, 0), uR = lens.slice(0, iR).reduce((s, v) => s + v, 0) / tot;
        const uh = smooth(span(t, tLine, a.makers - .2)), ut = uR * smooth(span(t, a.makers - .35, a.makers + .55));
        const home = smooth(span(t, back, back + 1.35));
        if (uh > 0 && home < 1) {
          if (home <= 0) K.trailSpan(ctx, pts, ut, uh, { w: 2.2 });
          else K.trailSpan(ctx, pts, 0, 1 - home, { w: 2.2, spark: false });     // the thread runs back down into its line on the page
        }
      }
      // 1.03 the quote card (lines rise from their baselines; two phrases warm on their words)
      if (t > a.makers - 1.2 && t < a.but + 1.4)
        K.quote(ctx, t, { text: Q1TEXT, attr: LAB, x: Q1.x, y: Q1.y, size: Q1.size, w: Q1.w, t0: a.makers - 1.15, t1: a.but - .2, gold: [['most world-altering and potentially dangerous', a.wa - .1], ['developing this very technology ourselves', a.build - .1]] });
      // 1.04 the pages fly into the head
      for (const pg of PAGES) {
        const q = span(t, a.mach - .15 + pg.d, a.mach - .15 + pg.d + 1.55 * pg.sp); if (q <= 0 || q >= 1) continue;
        const s0 = bk.page(1, pg.u, pg.v), pts = pathPts(s0, hd.entry, [[s0[0] + 40, s0[1] - 170], [lerp(s0[0], hd.entry[0], .55), lerp(s0[1], hd.entry[1], .5) - 140]]);
        const e = sineIO(q), [px, py] = K.along(pts, e), sc = lerp(1, .18, e), rot = Math.cos(q * 5.5 + pg.u * 6) * .9;
        if (q < .82) {
          ctx.save(); ctx.translate(px, py); ctx.rotate(-.35 + .5 * e); ctx.scale(sc * (.35 + .65 * Math.abs(rot)), sc);
          ctx.fillStyle = E.rad(ctx, 0, 0, 90, [[0, P.core0], [.5, P.core1], [1, P.halo1]]); ctx.fillRect(-48, -62, 96, 124);
          ctx.strokeStyle = rgba(P.shade0, .55); ctx.lineWidth = 2; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(-34, -40 + k * 20); ctx.lineTo(28 - (k % 2) * 16, -40 + k * 20); ctx.stroke(); }
          ctx.restore();
        }
        if (q > .45) K.trailSpan(ctx, pts, Math.max(0, e - .3), e, { w: 1.8, spark: false });
      }
      // 1.06 the chat box, drawn by a thread that drops out of the head
      const tb = a.words + .55, outlineU = smooth(span(t, tb + .45, a.say - .25));
      if (t > tb) {
        const bh = BOX.w * K.CHAT_AR, rr = 26 * BOX.w / 1000;
        const drop = pathPts(hd.center, [BOX.x + rr, BOX.y], [[hd.center[0] - 60, hd.center[1] + 150], [BOX.x + 160, BOX.y - 70]]);
        const ring = K.roundRectPts(BOX.x, BOX.y, BOX.w, bh, rr), pts = [...drop, ...ring];
        const lens = pts.slice(1).map((p, k) => Math.hypot(p[0] - pts[k][0], p[1] - pts[k][1])), tot = lens.reduce((s, v) => s + v, 0), uD = lens.slice(0, drop.length - 1).reduce((s, v) => s + v, 0) / tot;
        const uh = lerp(0, uD, smooth(span(t, tb, tb + .5))) + (1 - uD) * outlineU, ut = uD * smooth(span(t, tb + .5, tb + 1.1)) + (1 - uD) * smooth(span(t, a.say - .3, a.say + .25));
        K.chatUI(ctx, t, BOX.x, BOX.y, BOX.w, { glass: outlineU, rim: smooth(span(t, a.say - .4, a.say + .1)), bubbles: [], reply: { a: span(t, a.say - .35, a.say + .1), cursor: t > a.say - .05 ? 1 : 0 }, t0: a.say - .05 });
        if (uh > 0 && ut < 1) K.trailSpan(ctx, pts, ut, uh, { w: 2 });
      }
    });
  }

  // ------------------------------------------------------------------------------------------------------------ the kitchen
  function kitchen(ctx, t, c) {
    const lamp = 1 - .32 * bump(t, a.hurt - .05, .55);
    const lean = sineIO(span(t, a.friend + .05, a.friend + .95));
    card(ctx, c, 5200, () => {      // the back wall, a night window
      ctx.fillStyle = E.lin(ctx, 0, -900, 0, H + 400, [[0, P.night0], [.5, mixHex(P.night1, P.ind1, .4)], [1, P.night0]]); ctx.fillRect(-W, -2 * H, 3 * W, 4 * H);
      ctx.fillStyle = E.rad(ctx, LAMP.x, LAMP.y + 120, 1100, [[0, rgba(P.shade0, .28 * lamp)], [.45, rgba(P.shade0, .08 * lamp)], [1, rgba(P.shade0, 0)]]); ctx.fillRect(-W, -2 * H, 3 * W, 4 * H);
      const wx = 1450, wy = 340, ww = 290, wh = 280;     // low, behind the friend: the wall above stays free for the word pair
      ctx.fillStyle = E.lin(ctx, 0, wy, 0, wy + wh, [[0, P.ind0], [1, mixHex(P.ind1, P.blue1, .35)]]); ctx.fillRect(wx, wy, ww, wh);
      E.stars(ctx, 5, 26, t, [wx + 10, wy + 10, wx + ww - 10, wy + wh * .6], .7);
      ctx.fillStyle = P.night1; ctx.fillRect(wx + ww / 2 - 5, wy, 10, wh); ctx.fillRect(wx, wy + wh * .45 - 5, ww, 10);
      ctx.strokeStyle = rgba(P.blue0, .6); ctx.lineWidth = 4; ctx.strokeRect(wx, wy, ww, wh);
    });
    card(ctx, c, F0, () => {
      // the lamp: cord, shade, the bulb (hero), a cone of light in the air, the pool on the table
      ctx.strokeStyle = rgba(P.night0, .9); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(LAMP.x, -900); ctx.lineTo(LAMP.x, LAMP.y - 30); ctx.stroke();
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.beginPath(); ctx.moveTo(LAMP.x - 95, LAMP.y + 60); ctx.lineTo(LAMP.x + 95, LAMP.y + 60); ctx.lineTo(LAMP.x + 420, 700); ctx.lineTo(LAMP.x - 420, 700); ctx.closePath();
      ctx.fillStyle = E.lin(ctx, 0, LAMP.y + 60, 0, 700, [[0, rgba(P.halo1, .2 * lamp)], [1, rgba(P.halo1, .03 * lamp)]]); ctx.fill(); ctx.restore();
      const shade = new Path2D(); shade.moveTo(LAMP.x - 34, LAMP.y - 30); shade.lineTo(LAMP.x + 34, LAMP.y - 30); shade.quadraticCurveTo(LAMP.x + 70, LAMP.y + 10, LAMP.x + 100, LAMP.y + 62); shade.lineTo(LAMP.x - 100, LAMP.y + 62); shade.quadraticCurveTo(LAMP.x - 70, LAMP.y + 10, LAMP.x - 34, LAMP.y - 30); shade.closePath();
      ctx.fillStyle = E.lin(ctx, LAMP.x - 100, 0, LAMP.x + 100, 0, [[0, P.night1], [.6, P.ind2], [1, mixHex(P.ind2, P.shade0, .4)]]); ctx.fill(shade);
      ctx.strokeStyle = rgba(P.halo1, .55 * lamp); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(LAMP.x - 100, LAMP.y + 62); ctx.lineTo(LAMP.x + 100, LAMP.y + 62); ctx.stroke();
      E.halo(ctx, LAMP.x, LAMP.y + 66, 150 * lamp, .9 * lamp, P.halo0, P.core0);
      ctx.fillStyle = mixHex(P.core1, P.core0, lamp); ctx.beginPath(); ctx.ellipse(LAMP.x, LAMP.y + 64, 46, 12, 0, 0, 6.29); ctx.fill();
      // the friend (behind the table): sits back, leans in on "polite friend"
      E.person(ctx, FR.x, FR.y, FR.h, { dir: -1, light: -1, lean: .16 * lean, armR: [.5 + .5 * lean, .9 + .6 * lean], armL: [.25, .5], rim: mixHex(P.blue0, P.halo1, .45) });
      // the table: top (lamp-lit) and the dark front
      const top = new Path2D(); top.moveTo(410, 650); top.lineTo(1610, 650); top.lineTo(1730, 770); top.lineTo(290, 770); top.closePath();
      ctx.fillStyle = E.rad(ctx, LAMP.x, 700, 760, [[0, mixHex(P.shade0, P.halo1, .35 * lamp)], [.45, mixHex(P.shade0, P.ind2, .55)], [1, P.night1]]); ctx.fill(top);
      ctx.strokeStyle = rgba(P.halo1, .5 * lamp); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(290, 770); ctx.lineTo(1730, 770); ctx.stroke();
      ctx.fillStyle = E.lin(ctx, 0, 770, 0, 1100, [[0, P.night1], [1, P.night0]]); ctx.fillRect(290, 770, 1440, 400);
      // the birthday card (tent): a candle drawn in gold, three lines of handwriting that fly into your bubble
      const fly = (i) => span(t, a.paste + .45 + i * .14, a.paste + 1.25 + i * .14);
      cardDraw(ctx, t, fly);
      // the laptop: base, bezel, the screen = the chat
      ctx.fillStyle = E.lin(ctx, 0, 640, 0, 700, [[0, P.ind2], [1, P.night1]]);
      ctx.beginPath(); ctx.moveTo(LS.x - 6, 640); ctx.lineTo(LS.x + LS.w + 6, 640); ctx.lineTo(LS.x + LS.w + 40, 700); ctx.lineTo(LS.x - 40, 700); ctx.closePath(); ctx.fill();
      const lh = LS.w * K.CHAT_AR;
      ctx.fillStyle = P.night0; ctx.beginPath(); ctx.roundRect(LS.x - 14, LS.y - 14, LS.w + 28, lh + 28, 16); ctx.fill();
      ctx.strokeStyle = rgba(P.blue1, .6); ctx.lineWidth = 2; ctx.stroke();
      E.halo(ctx, LS.x + LS.w / 2, LS.y + lh / 2, LS.w * .7, .12, P.blue0, P.blue1);
      const typed = 'Be honest. Do you like it?';
      const tyU = span(t, a.honest - .55, a.likeE - .05), sent = span(t, a.likeE + .05, a.likeE + .65);
      const bubbles = [{ poem: 3, u: span(t, a.paste + 1.05, a.paste + 1.65), sag: smooth(span(t, a.notgood - .05, a.notgood + .45)) }, { text: typed, u: sent }];
      const chat = K.chatUI(ctx, t, LS.x, LS.y, LS.w, { bubbles, typing: { text: typed, u: sent > 0 ? 0 : tyU }, reply: { a: 1, cursor: 1 }, scroll: span(t, a.hurt - .85, a.hurt + .15), t0: a.say - .05 });
      // the handwriting lines in flight: card → your bubble
      for (let i = 0; i < 3; i++) {
        const q = fly(i); if (q <= 0 || q >= 1) continue;
        const s0 = [CARD.x + 16, CARD.y - CARD.h + 40 + i * 13], s1 = [LS.x + (554) * LS.w / 1000, LS.y + (92 + 38 * i) * LS.w / 1000];
        const e = sineIO(q), x = lerp(s0[0], s1[0], e), y = lerp(s0[1], s1[1], e) + Math.sin(Math.PI * e) * 24, len = lerp(60, 120 - (i % 2) * 28, e) * (LS.w / 1000 * 2.4 * e + (1 - e));
        ctx.strokeStyle = mixHex(P.shade0, P.cream, e); ctx.lineWidth = lerp(2.4, 1.3, e); ctx.lineCap = 'round'; ctx.beginPath();
        for (let k = 0; k <= 20; k++) { const u = k / 20, xx = x + u * len, yy = y + Math.sin(u * 19 + i * 2) * 1.6; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
        ctx.stroke(); E.halo(ctx, x + len, y, 14, .5, P.halo0, P.core0);
      }
      // you, from behind; the chair back hides your legs (you sit)
      E.du(ctx, YOU.x, YOU.y, YOU.h, { dir: 1, view: 'back', light: 1, armR: [.62, .3 + .05 * Math.sin(t * 9) * (tyU > 0 && tyU < 1 ? 1 : 0)], armL: [-.6, -.28], rim: mixHex(P.coat, P.core1, .7) });
      const chair = new Path2D(); chair.roundRect(YOU.x - 150, 842, 300, 400, 34);
      ctx.fillStyle = E.lin(ctx, 0, 842, 0, 1100, [[0, mixHex(P.night1, P.ind2, .6)], [1, P.night0]]); ctx.fill(chair);
      ctx.strokeStyle = rgba(P.halo1, .35); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(YOU.x - 116, 842); ctx.lineTo(YOU.x + 116, 842); ctx.stroke();
      // 1.09 the friend's bubble "Lovely!", then (1.10) its outline unrolls into the rule of the quote
      friendBubble(ctx, t);
      // 1.10 quote 2 + 1.11 the pair, on the wall above the lamp
      if (t > a.doc - .6 && t < a.easy + 1.2) {
        K.quote(ctx, t, { text: 'But Claude should not even tell white lies of this kind.', attr: 'CLAUDE’S CONSTITUTION', x: Q2.x, y: Q2.y, size: Q2.size, w: Q2.w, t0: a.doc - .2, t1: a.dish - .22, gold: [['not even', a.noteven - .05]] });
        pair(ctx, t);
      }
    });
  }

  function cardDraw(ctx, t, fly) {
    const { x, y, w, h } = CARD;
    ctx.fillStyle = E.lin(ctx, x, y - h, x + w, y, [[0, mixHex(P.halo1, P.core1, .3)], [1, P.shade0]]);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 10, y - h); ctx.lineTo(x + w - 6, y - h); ctx.lineTo(x + w, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(P.night0, .35); ctx.beginPath(); ctx.moveTo(x + w, y); ctx.lineTo(x + w - 6, y - h); ctx.lineTo(x + w + 26, y - h + 10); ctx.lineTo(x + w + 30, y); ctx.closePath(); ctx.fill();
    // a candle (gold line drawing) and its flame (breathes)
    ctx.strokeStyle = rgba(P.shade0, .9); ctx.lineWidth = 2; ctx.strokeRect(x + w * .62, y - h * .62, 8, 22);
    E.halo(ctx, x + w * .62 + 4, y - h * .7 + Math.sin(t * 7) * .6, 9, .9, P.halo0, P.core0);
    for (let i = 0; i < 3; i++) {
      if (fly(i) > 0) continue;
      ctx.strokeStyle = rgba(P.shade0, .95); ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.beginPath();
      for (let k = 0; k <= 20; k++) { const u = k / 20, xx = x + 16 + u * (50 - (i % 2) * 14), yy = y - h + 40 + i * 13 + Math.sin(u * 19 + i * 2) * 1.6; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
      ctx.stroke();
    }
  }

  function friendBubble(ctx, t) {
    const t0 = a.lovely - .12, unroll = a.lovely + .42;
    if (t < t0 || t > a.doc + 1.6) return;
    const bx = 1316, by = 352, bw = 214, bh = 82, rr = 30;
    const u = K.rise(span(t, t0, t0 + .55));
    const ring = K.roundRectPts(bx, by, bw, bh, rr), path = [...ring, ...E.catmull([[bx, by + rr, 2], [1250, 296, 2], [700, 290, 2], [RULE2_X + 22, 278, 2], [RULE2_X, RULE2_BOT, 2], [RULE2_X, RULE2_TOP, 2]], 14).map((p) => [p[0], p[1]])];
    const lens = path.slice(1).map((p, k) => Math.hypot(p[0] - path[k][0], p[1] - path[k][1])), tot = lens.reduce((s, v) => s + v, 0), uRing = lens.slice(0, ring.length - 1).reduce((s, v) => s + v, 0) / tot;
    const iRule = path.length - 3, uRule = lens.slice(0, iRule).reduce((s, v) => s + v, 0) / tot;
    const go = span(t, unroll, a.doc + .45);
    if (go <= 0) {
      // the bubble rises from the friend's head (mask from its own baseline), cream outline, the word in serif
      ctx.save(); ctx.beginPath(); ctx.rect(bx - 40, by - 30, bw + 80, bh + 70); ctx.clip(); ctx.translate(0, (1 - u) * (bh + 30));
      ctx.strokeStyle = rgba(P.halo0, .9); ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, rr); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(bx + bw * .62, by + bh); ctx.lineTo(bx + bw * .7, by + bh + 26); ctx.lineTo(bx + bw * .76, by + bh); ctx.stroke();
      E.glowText(ctx, 'Lovely!', bx + bw / 2, by + bh * .68, { size: 46, serif: true, align: 'center' });
      ctx.restore();
    } else {
      // the word sinks, the outline runs off as a thread and becomes the vertical rule of the quote
      const sk = expoIn(span(t, unroll, unroll + .4));
      if (sk < 1) { ctx.save(); ctx.beginPath(); ctx.rect(bx, by, bw, bh); ctx.clip(); E.glowText(ctx, 'Lovely!', bx + bw / 2, by + bh * .68 + sk * 60, { size: 46, serif: true, align: 'center' }); ctx.restore(); }
      const e = smooth(go), uh = lerp(uRing, 1, e), ut = lerp(0, uRule, smooth(span(t, unroll + .1, a.doc + .55)));
      K.trailSpan(ctx, path, ut, uh, { w: 2.2, spark: uh < .999 });
    }
    // after the quote has gone (dish): the rule retracts downward
    return null;
  }

  function pair(ctx, t) {
    // the vertical rule stays while the card stands, then shrinks away as the card sinks
    const ruleOut = expoIn(span(t, a.dish - .1, a.dish + .5));
    if (t > a.doc + .55 && ruleOut < 1) K.rule(ctx, RULE2_X, RULE2_TOP, RULE2_X, RULE2_BOT, 1, { from: ruleOut, spark: false });
    const { x, y, size, dy } = PAIR, cool = mixHex(P.cream, P.blue0, .5);
    const up = K.rise(span(t, a.dipl - .15, a.dipl + .75)), down = 1 - expoIn(span(t, a.easy - .2, a.easy + .35));
    const glowUp = .35 * smooth(span(t, a.kind - .05, a.kind + .5));
    if (up * down > 0) K.maskLine(ctx, [['diplomatically ', 1], ['honest', 1]], x, y, size, up * down);
    if (glowUp > 0 && down > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; E.glowText(ctx, 'diplomatically honest', x, y, { size, serif: true, col: P.halo0, a: glowUp * down }); ctx.restore(); }
    // the swap: copies of "honest" and "diplomatic" travel on two arcs into the line below
    const s0 = a.dish - .02, q = span(t, s0, s0 + 1.05), land = s0 + 1.05;
    const gone = 1 - expoIn(span(t, a.clear - .05, a.clear + .45));
    if (q > 0 && gone > 0) {
      const e = quartIO(q);
      const A0 = [x + swap.w1, y], A1 = [x + swap.dis, y + dy], B0 = [x, y], B1 = [x + swap.dishly, y + dy];
      const qa = (p0, p1, c, u) => [lerp(lerp(p0[0], c[0], u), lerp(c[0], p1[0], u), u), lerp(lerp(p0[1], c[1], u), lerp(c[1], p1[1], u), u)];
      const pa = qa(A0, A1, [x + swap.w1 * .35, y + dy * 1.9], e), pb = qa(B0, B1, [x + swap.dishly * .75, y - dy * .55], e);
      const col = mixHex(mixHex(P.cream, P.halo0, .6), cool, e);
      if (q < 1) {
        E.glowText(ctx, 'honest', pa[0], pa[1], { size, serif: true, col });
        E.glowText(ctx, 'diplomatic', pb[0], pb[1], { size, serif: true, col });
      } else {
        // landed: "dis" and "ly" rise from the baseline around the moved words; then a hairline strikes the cool line
        const fx = K.rise(span(t, land - .05, land + .55));
        ctx.save(); ctx.beginPath(); ctx.rect(x - 40, y + dy - size * 1.3, 1400, size * 1.65); ctx.clip(); ctx.translate(0, (1 - gone) * size * 1.15);
        E.glowText(ctx, 'honest', A1[0], A1[1], { size, serif: true, col: cool, glow: false });
        E.glowText(ctx, 'diplomatic', B1[0], B1[1], { size, serif: true, col: cool, glow: false });
        ctx.restore();
        K.maskLine(ctx, [['dis', 0]], x, y + dy, size, fx * gone, { col: cool, glow: false });
        K.maskLine(ctx, [['ly', 0]], x + swap.dis + swap.hon, y + dy, size, fx * gone, { col: cool, glow: false });
        const st = smooth(span(t, land + .35, land + .8)) * gone, sw = swap.dishly + swap.dip;
        if (st > 0) { ctx.strokeStyle = rgba(P.cream, .85); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 6, y + dy - size * .28); ctx.lineTo(x - 6 + (sw + 12) * st, y + dy - size * .3); ctx.stroke(); }
      }
    }
  }
}
