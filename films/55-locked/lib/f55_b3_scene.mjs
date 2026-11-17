// Film 55 · B3 · c12–c16 as ONE continuous take ('That call was made inside' → end, incl. subscribe 2, the walk, the 15 s end screen).
// Every chunk file (scenes/sc12 … sc16) returns the same draw function for its own range, so the inner boundaries are the same frame by
// construction. Plan: docs/shots.md 6.03–E.01 · world: docs/MOTION.md · the seam B2 → B3 = S.plateHeld at T.G('That call was made inside').
//
// | ID    | anchor (phrase)                  | picture (one idea)                                                                  | camera / carrier        |
// |-------|----------------------------------|-------------------------------------------------------------------------------------|-------------------------|
// | 6.03  | That call was made inside        | out of plateHeld: up the windowless wall; the lab's notice, a band covers it:       | rise up the wall        |
// |       | everything it sees               |   NOT EVERYTHING IS SHOWN                                                           |                         |
// | 6.04  | Marius Hobbhahn / slot C4        | the quote is lettered on the wall higher up (C4 card: the credit on his name,        | glide up-right · wall   |
// |       |                                  |   the words light evenly over the clip)                                             |                         |
// | 6.05  | Before release means             | pull back: the whole wall from outside, no window; WHO GETS TO LOOK IN?              | pull back · wide        |
// | 6.06  | A few outsiders do               | the side door opens: three testers with clipboards walk in, the lab's doorkeeper;    | glide to the side door  |
// |       | But the lab decides              |   THE LAB DECIDES · source testers                                                  |                         |
// | 6.07  | So keep asking                   | a clipboard comes out of the side door's light: WHO CHECKED IT? · WHAT'S NOT SHOWN?  | EXPL over a veil        |
// | 6.08  | So what is in that room          | the clipboard folds away: one breath of only the gold light in the gap               | the gap, close          |
// | 7.01★ | One clue was in plain sight      | the proof tape slides out of the gap, 11 DAYS → 30 HOURS; it leaves the gap; a hall  | portal out of the tape  |
// |       | A thousand copies                |   opens out of the tape: a thousand seats light, the same small core: 1,000 COPIES  | inner push              |
// | 7.02  | And the first machine            | the hall shrinks right; a glimpse out of the gap left (dozens of seats, gold):       | two panels              |
// |       | roughly comparable / 2 months    |   "ROUGHLY COMPARABLE" · 11 sheets · SEP 4 → NOV 9                                  |                         |
// | 7.03  | So if the machines are already   | the panels fold back (gap / your phone): the whole line; HOW MUCH STRONGER?           | wide                    |
// | 7.04  | The first is newer               | a glimpse out of the gap: doors behind doors, a sheet further each; 1 · NEWER         | push to the gap, portal |
// | 7.05  | The second is bigger             | 2 · BIGGER: a matte stadium of 10,000 dots, OPENAI SAYS · NOT CONFIRMED; your phone,  | EXPL over a veil        |
// |       |                                  |   one core; the hall grows out of it: SAME MACHINE × 1,000                          |                         |
// | 7.06  | So between you and the best      | the door: PERMISSION (the leaf) · POWER (the light)                                  | door                    |
// | 7.07  | And both are moving              | a sheet APR tears off → JUNE, the door opens; the price bar shrinks to ⅓              | door                    |
// | 7.08  | So what a lab shows off          | you from behind, the open door far off like a shop window; A FEW MONTHS · ESTIMATE   | glide back to you       |
// | 8.01  | One evening, a few months        | your phone lights, the kitchen opens (another season), the core answers               | portal out of the phone |
// | 8.02  | The best A.I. in the world       | back out to frame 0: the door, the line, you; the core sentence                      | pull back · HOME        |
// | A.01  | This channel exists (2nd)        | the line moves up one place, front to back (one enters the door); SUBSCRIBE          | slow glide              |
// | A.02  | (the walk) · E.01 END SCREEN 15 s | the camera settles on S.END_CAM: the door, the line, the light; no text               | END_CAM + drift         |
import * as E from './f10_editorial.mjs';
import * as F from './f55_kit.mjs';
import * as S from './f55_seams.mjs';
import * as B from './f55_b3_things.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, mixHex, halo } = E;
const { rise, maskLine, GOLD, CHECK, LAMP, bump } = F;
export const PRINT = F.PRINT55;

const L = S.LINE, D = L.door, Y = L.you;
const scr = (ctx, fn) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); fn(); ctx.restore(); };
const inOut = (t, a0, a1, b0, b1) => rise(span(t, a0, a1)) * (1 - sineIO(span(t, b0, b1)));   // soft exits (an expo exit pops)
const sinkOut = (t, b0, b1) => 1 - sineIO(span(t, b0, b1));
// a soft screen-space wall light (source-over, a dusty warm blue; it lifts the luma of a dark stretch without a hot spot)
const WASH = mixHex(P.blue1, P.shade1, .35);
function wash(ctx, x, y, r, a) { scr(ctx, () => { ctx.fillStyle = E.rad(ctx, x, y, r, [[0, rgba(WASH, a)], [.55, rgba(WASH, a * .45)], [1, rgba(WASH, 0)]]); ctx.fillRect(0, 0, W, H); }); }

// ------------------------------------------------------------------------------------------------------------- anchors (phrases only)
export function anchors(T) {
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.T0 = G('That call was made inside'); a.p0 = a.T0 + S.SEAM_HALF;
  a.rule = G('And no rule', a.T0); a.every = G('everything it sees', a.T0); a.hob = G('Marius Hobbhahn', a.T0); a.senate = G('He told the', a.T0);
  const c4 = T.clip('C4'); a.c4 = c4 ? c4.start : a.senate + 1.8; a.c4e = c4 ? c4.end : a.c4 + 7;
  a.before = G('Before release means', a.T0); a.who = G('So who gets to look in', a.before);
  a.few = G('A few outsiders do', a.before); a.testers = G('Independent testers', a.few); a.decides = G('But the lab decides', a.few);
  a.keep = G('So keep asking', a.T0); a.chk = G('Who checked it from outside', a.keep); a.shown = G('What are you not being shown', a.keep); a.hype = G('That protects you from hype', a.keep);
  a.room = G('So what is in that room', a.keep);
  a.clue = G('One clue was in plain sight', a.T0); a.eleven = G('Eleven days', a.clue); a.thirty = G('then thirty hours', a.clue); a.nolock = G('No locked machine', a.clue);
  a.fable = G('it was Fable', a.clue); a.thousand = G('A thousand copies', a.clue); a.parts = G('starting from', a.thousand);
  a.firstM = G('And the first machine', a.T0); a.cant = G('the one you', a.firstM); a.rough = G('roughly comparable', a.firstM); a.dozens = G('dozens of copies', a.firstM);
  a.elevenD = G('and eleven days', a.firstM); a.earlier = G('It was simply there', a.firstM); a.months2 = G('two months', a.earlier);
  a.ifm = G('So if the machines are already', a.T0); a.how = G('how much stronger', a.ifm); a.ways = G('Stronger in two ways', a.ifm);
  a.newer = G('The first is newer', a.T0); a.labs = G('Labs work with', a.newer); a.holding = G('still holding', a.newer); a.far = G('How far ahead', a.newer); a.nobody = G('Nobody outside', a.newer);
  a.bigger = G('The second is bigger', a.T0); a.says = G('OpenAI says', a.bigger); a.tenk = G('ten thousand', a.bigger); a.dispute = G('still dispute', a.bigger);
  a.method = G('Fermat shows the method', a.bigger); a.oneCopy = G('One copy answers', a.bigger); a.aThousand = G('A thousand write', a.bigger);
  a.notSmarter = G('That is not a smarter', a.bigger); a.same = G('more of the same machine', a.bigger);
  a.between = G('So between you and the best', a.T0); a.perm = G('Permission', a.between); a.power = G('And power', a.between);
  a.moving = G('And both are moving', a.T0); a.months = G('Permission moves in months', a.moving); a.april = G('Locked away in April', a.moving); a.june = G('in your hands by June', a.moving);
  a.powerMoves = G('Power moves', a.moving); a.fallen = G('has fallen by two thirds', a.moving); a.fallenE = GE('has fallen by two thirds', a.moving);
  a.preview = G('So what a lab shows off', a.T0); a.fewM = G('A few months is a fair', a.preview); a.estimate = G('estimate', a.fewM); a.plan = G('Time enough', a.preview);
  a.evening = G('One evening', a.T0); a.phone = G('ask your phone', a.evening); a.answer = G('And the answer will come', a.evening); a.machine = G('from a machine', a.answer);
  a.behind = G('Behind the door', a.evening); a.newer2 = G('something newer', a.behind); a.work = GE('already be at work', a.behind);
  a.best = G('The best A.I. in the world', a.T0); a.next = G('one you', a.best); a.nextE = GE('have next', a.best);
  a.chan = G('This channel exists', a.best); a.frontBack = G('From the front of the line', a.chan); a.want = G('Want that too', a.chan);
  a.sub = G('Then subscribe', a.chan); a.subE = GE('Then subscribe', a.chan);
  a.end = Math.max(a.subE + 6, T.duration - 15);   // the 15 s end screen (YouTube end cards)
  return a;
}

// ------------------------------------------------------------------------------------------------------------- cameras (world)
const sOf = (mag, Z = D.z) => mag * E.F0 / Z;                             // px per world unit at depth Z for a look() camera of this mag
const NOTE = { X: D.x + 600, Y: 8150, s: sOf(1.25), w: 480 };            // the lab's notice on the wall above the door (centre)
const CARD = { X: 15200, Y: 6200, s: sOf(1.0) };                          // the C4 quote lettered on the wall (anchor = card centre-left)
const SIDE = L.side.x, TZ = D.z - 260;                                    // the side door; the testers' path in front of the wall
const CAM = {
  note: S.look(NOTE.X, NOTE.Y, D.z, 1.25, 960, 470),
  card: S.look(CARD.X, CARD.Y, D.z, 1.0, 960, 500),
  card2: S.look(CARD.X + 260, CARD.Y, D.z, 1.06, 960, 500),
  wall: S.look(5600, 3600, D.z, .5, 960, 520, 760),
  side: S.look(SIDE, 300, D.z, 8.0, 1350, 624),
  side2: S.look(SIDE + 40, 300, D.z, 8.3, 1350, 624),
  gap: S.look(D.x + 1500, 4300, D.z, 1.55, 960, 520),
  tape: S.look(D.x, 3000, D.z, 1.25, 1250, 560),
  tapeL: S.look(D.x - 500, 2600, D.z, 1.3, 1250, 600),
  doorL: S.look(D.x, 3000, D.z, 1.1, 510, 600),
  wide: S.LINE_CAM,                                                          // the whole line from a raised camera behind you (plateLine's view)
  wide2: S.look(1400, 0, 7000, .655, 960, 700, 520),
  doorA: S.look(D.x, 3600, D.z, 1.5, 960, 520),
  doorP: S.look(D.x + 300, 4200, D.z, .95, 900, 600),
  doorP2: S.look(D.x + 300, 4200, D.z, 1.0, 900, 600),
  back: S.look(Y.x + 110, 120, Y.z, 2.0, 640, 640, 700),                    // you from behind, the door far back right (c01 'back', a little right)
  back2: S.look(Y.x + 110, 120, Y.z, 2.08, 650, 640, 700),
  near: S.look(Y.x + 160, 105, Y.z, 2.3, 760, 690),                         // you close: the phone at your hand (c01 'near')
  home: S.HOME,
};
const PANEL = { x: 640, y: 140, w: 1180, h: 664 };                        // the glimpse of doors behind doors
const LP = { x: 110, y: 170, w: 800, h: 450 }, RP = { x: 1010, y: 170, w: 800, h: 450 };   // 7.02: behind the door | the hall (public)
const BIGHALL = { x: 1150, y: 230, w: 660, h: 371 };                     // 7.05: the hall out of your phone

function keys(a) {
  return [
    [a.p0, B.plateCam(S.HELD_P, S.creep(a.p0, { G: () => a.T0 }, ''))],
    [a.rule + 1.3, CAM.note], [a.every + 1.2, S.look(NOTE.X + 120, NOTE.Y, D.z, 1.3, 960, 470)],
    [a.hob + 1.4, CAM.card], [a.c4e - .3, CAM.card2],
    [a.who + .2, CAM.wall], [a.few - .1, S.look(5700, 3400, D.z, .54, 960, 520, 760)],
    [a.testers + .5, CAM.side], [a.keep + .2, CAM.side2],
    [a.room - .3, CAM.gap], [a.clue - .2, S.look(D.x + 1500, 4300, D.z, 1.62, 960, 520)],
    [a.eleven - .4, CAM.tape], [a.nolock + .2, S.look(D.x, 3000, D.z, 1.3, 1250, 560)], [a.fable + .6, CAM.tapeL],
    [a.thousand, CAM.doorL], [a.months2 + .2, S.look(D.x, 3000, D.z, 1.14, 510, 600)],
    [a.ifm - .2, CAM.wide], [a.ways, CAM.wide2],
    [a.newer + 1.2, CAM.doorA], [a.nobody + 1.2, S.look(D.x, 3600, D.z, 1.62, 960, 520)],
    [a.between - .2, S.look(D.x, 3600, D.z, 1.7, 960, 520)], [a.perm - .3, CAM.doorP], [a.preview, CAM.doorP2],
    [a.preview + 2.6, CAM.back], [a.evening + .2, CAM.back2],
    [a.phone + .7, CAM.near], [a.behind + .2, S.drift(CAM.near, 0, 0)],
    [a.best - .5, S.look(Y.x, 0, Y.z, 1.2, 232, 990)], [a.best + .4, S.look(Y.x, 0, Y.z, 1.1, 216, 987)], [a.chan, CAM.home],
    [a.subE, E.cam3({ z: 260 })], [a.end, S.END_CAM],   // the line moves up in the frame-0 view; then the quiet walk out to the end screen
  ];
}

// the phone in your hand in the world (screen px)
function phoneAt(c, you) { const p = S.proj(c, you.x + 34, 96, you.z); return p ? { x: p[0] - 4 * p[2], y: p[1] - 9 * p[2], w: 8 * p[2], h: 15 * p[2] } : null; }

// the testers (6.06): walk along the wall to the side door, in, one after another
function testers(a) {
  return [0, 1, 2].map((j) => ({ t0: a.few - .6 + j * .9, x0: 5800 - j * 520, seed: 9101 + j * 17, h: L.personH * (.96 + .05 * j) }));
}
const WALK = 420;   // world units per second
function testerAt(tt, t, a) {
  const run = SIDE - tt.x0, dur = run / WALK, u = (t - tt.t0) / dur;
  if (u < 0) return { x: tt.x0, z: TZ, walk: null, a: 1 };
  if (u < 1) return { x: lerp(tt.x0, SIDE, sineIO(clamp(u * 1.05)) * .1 + clamp(u) * .9), z: TZ, walk: (t - tt.t0) * WALK / 60, a: 1 };
  const v = clamp((t - tt.t0 - dur) / .9);   // in through the door: forward into the cream light, fading
  return { x: SIDE, z: lerp(TZ, D.z - 20, v), walk: (t - tt.t0) * WALK / 60, a: 1 - sineIO(v), view: 'back' };
}

// the line moves up one place (A.01): person k walks to spot k + 1 (front first); the one at the threshold goes in; you to spot 0
const NQ = S.QUEUE.length;
function stepU(a, k) { const t0 = lerp(a.frontBack - .6, a.frontBack + 2.4, 1 - (k + 1) / NQ); return t0; }
const STEPD = 2.6;

// ------------------------------------------------------------------------------------------------------------- the scene
export function makeScene(T) {
  const a = anchors(T), K = keys(a), TS = testers(a);
  return (ctx, t) => {
    if (t < a.p0) { S.plateHeld(ctx, t, T); return; }                          // the seam: exactly what c11 draws
    // ---- camera: the plate's creep blends into the path; the drift (~13 px at any depth) fades in after the seam and never stops
    const cp = B.plateCam(S.HELD_P, S.creep(t, T, 'That call was made inside'));
    let c = B.mixCam(cp, S.camPath(t, K), sineIO(span(t, a.p0, a.p0 + 2.2)));
    const dA = span(t, a.p0, a.p0 + 2.5);
    c = S.drift(c, t, Math.max(1500, D.z - c.z), 2.6 * dA, 66);
    // ---- world state
    const doorOpen = .45 * sineIO(span(t, a.june - .2, a.june + 1.4)) * (1 - sineIO(span(t, a.phone + 1.6, a.answer + .6)))
      + .16 * bump(t, a.frontBack - 1.2, 3.4);                                     // June: it opens; the end: it lets the front one in
    const gap = (1 - .35 * sineIO(span(t, a.nolock, a.nolock + 1.2)) * (1 - span(t, a.thousand, a.thousand + 2)))
      * (1 + .3 * bump(t, a.room - .2, 2.6) + .35 * bump(t, a.power - .1, 2.2) + .4 * bump(t, a.newer2 - .2, 3.2));
    const sideOpen = sineIO(span(t, a.few - .4, a.few + .8)) * (1 - sineIO(span(t, a.decides + 1.6, a.keep + .2)));
    const sideLight = .55 * bump(t, a.keep - .1, 1.8);                            // the clipboard comes out of the side door's light
    const stepping = t > a.frontBack - 1.5;
    const youW = (() => { const t0 = stepU(a, -1), u = clamp((t - t0) / STEPD); return { u, walk: u > 0 && u < 1 ? (t - t0) * 4.6 : null }; })();
    const youPos = { x: lerp(Y.x, S.QUEUE[0].x, sineIO(youW.u)), z: lerp(Y.z, S.QUEUE[0].z, sineIO(youW.u)) };
    const hold = span(t, a.phone - .6, a.phone) * (1 - span(t, a.best, a.best + 1));
    const ph = clamp(span(t, a.phone - .6, a.phone - .1)) * (1 - span(t, a.behind + 1, a.best));
    const st = {
      gap, open: doorOpen, side: { open: Math.min(1, sideOpen + sideLight) },
      mark: (i) => ({ lit: t < a.ifm - 1 ? .3 : t < a.end ? .3 + .4 * span(t, a.best, a.chan) : .7 }),
      person: !stepping ? undefined : (k, q) => {
        const t0 = stepU(a, k), u = sineIO(clamp((t - t0) / STEPD)); if (u <= 0) return {};
        const walk = u < 1 ? (t - t0) * 4.6 : undefined;
        if (k === NQ - 1) { const z = lerp(q.z, D.z + 40, u); return { x: lerp(q.x, D.x - 600, u), z, walk, a: 1 - span(u, .6, 1), hidden: u >= 1 }; }
        const n = S.QUEUE[k + 1]; return { x: lerp(q.x, n.x, u), z: lerp(q.z, n.z, u), walk };
      },
      you: { x: youPos.x, z: youPos.z, o: { look: lerp(.55, .85, span(t, a.preview + 1, a.preview + 3)) * (1 - .3 * span(t, a.evening, a.phone)), walk: youW.walk ?? undefined, view: youW.walk != null ? 'back' : undefined, armR: hold > 0 ? [lerp(.2, .62, hold), lerp(.1, 2.35, hold)] : undefined } },
      extra: (cx) => {
        S.heldParcel(cx, c, t);                                                     // the held-back update stays at the door
        // the lab's doorkeeper at the side door, the testers
        const pk = S.proj(c, SIDE + 430, 0, D.z - 170);
        if (pk && pk[2] * L.personH > 6) scr(cx, () => F.queuer(cx, t, pk[0], pk[1], L.personH * pk[2], { seed: 9301, kind: 'lab', dir: -1, gold: .9, look: .15 }));
        for (const tt of TS) {
          if (t < tt.t0 - 2 || t > a.keep + 2) continue;
          const s = testerAt(tt, t, a); if (s.a <= 0) continue;
          const p = S.proj(c, s.x, 0, s.z); if (!p || p[2] * tt.h < 6) continue;
          scr(cx, () => {
            if (s.view === 'back') { cx.save(); const r = S.sideRect(c); if (r) { cx.beginPath(); cx.rect(r.x - r.w * .2, r.y - r.h, r.w * 1.4, r.h * 2); cx.clip(); } }
            const hd = F.queuer(cx, t, p[0], p[1], tt.h * p[2], { seed: tt.seed, kind: 'plain', dir: 1, gold: .25, a: s.a, walk: s.walk, view: s.view, look: .1 });
            if (hd?.R) B.smallBoard(cx, hd.R[0], hd.R[1], tt.h * p[2] * .2, s.a);
            if (s.view === 'back') cx.restore();
          });
        }
        if (ph > 0) { const r = phoneAt(c, youPos); if (r) { halo(cx, r.x + r.w / 2, r.y + r.h / 2, Math.max(18, r.h * 3), .5 * ph, LAMP.body, LAMP.core); cx.fillStyle = rgba(mixHex(LAMP.core, P.cream, .4), ph); cx.fillRect(r.x, r.y, r.w, r.h); } }
      },
    };
    S.lineWorld(ctx, c, t, st);
    // integration: a soft wall light lifts the dim C4 stretch (painted, never added; it comes and goes with the quote)
    const c4W = sineIO(span(t, a.every, a.hob + 1.2)) * (1 - sineIO(span(t, a.c4e, a.testers)));
    if (c4W > 0) wash(ctx, 820, 470, 1150, .5 * c4W);
    // ---- 6.03 the lab's notice on the windowless wall: a band covers it (NOT EVERYTHING IS SHOWN)
    B.wallAt(ctx, c, NOTE.X, NOTE.Y, NOTE.s, (k) => { const na = .92 * (1 - span(t, a.hob + 1.6, a.hob + 2.6)); if (k * NOTE.w > 40 && na > 0) B.notice(ctx, t, 0, 0, NOTE.w, { band: span(t, a.every - .1, a.every + .9), a: na }); });
    // ---- 6.04 the C4 quote, lettered on the wall (dim lettering; the credit on his name; the words light over the clip)
    B.wallAt(ctx, c, CARD.X, CARD.Y, CARD.s, (k) => {
      if (k < .25 || t > a.who + .5) return;
      const live = rise(span(t, a.hob - .6, a.hob + .6)) * (1 - sineIO(span(t, a.c4e + .2, a.who + .4)));
      F.quoteCard(ctx, t, T, { id: 'C4', x: -600, y: -120, w: 1200, size: 64, credit: span(t, a.hob - .1, a.hob + 1.1), a: live, dim: 0 });   // the words write themselves over the clip
    });
    // ---- 6.05 WHO GETS TO LOOK IN?
    const wU = inOut(t, a.who - .1, a.who + .6, a.few + 1.2, a.few + 1.9);
    if (wU > 0) scr(ctx, () => { maskLine(ctx, [['WHO GETS', 0]], 120, 230, 96, wU, { serif: false, weight: 600, col: P.core0, glow: true }); maskLine(ctx, [['TO LOOK IN?', 0]], 120, 334, 96, inOut(t, a.who + .15, a.who + .85, a.few + 1.2, a.few + 1.9), { serif: false, weight: 600, col: P.core0, glow: true }); });
    // ---- 6.06 THE LAB DECIDES · source
    const dU = inOut(t, a.decides + .3, a.decides + 1, a.keep - .2, a.keep + .4);
    if (dU > 0) scr(ctx, () => maskLine(ctx, [['THE LAB DECIDES', 0]], 120, 250, 88, dU, { serif: false, weight: 600, col: P.core0, glow: true }));
    F.source(ctx, t, a.testers, a.keep + .2, F.SOURCES.testers, { y: 870 });
    // ---- 6.07 the clipboard out of the side door: WHO CHECKED IT? · WHAT'S NOT SHOWN?
    const cbOut = span(t, a.keep - .1, a.keep + 1.3), cbIn = sineIO(span(t, a.room - .9, a.room + .2));
    const veilA = .55 * sineIO(span(t, a.keep, a.keep + 1.2)) * (1 - cbIn)
      + .5 * sineIO(span(t, a.bigger + .2, a.bigger + 1.4)) * (1 - sineIO(span(t, a.between - .6, a.between + .5)));
    if (cbOut > 0 && cbIn < 1) {
      const r = S.sideRect(c), from = r ? { x: r.x + r.w / 2, y: r.y + r.h * .5 } : { x: 1100, y: 600 };
      F.veil(ctx, veilA);
      const m = sineIO(cbOut), k = lerp(.05, 1, m) * (1 - .9 * cbIn);
      const bx = lerp(from.x, 1430, m), by = lerp(from.y, 210, m) + 260 * cbIn;
      scr(ctx, () => {
        ctx.globalAlpha = 1 - span(cbIn, .6, 1);
        ctx.translate(bx, by); ctx.scale(k, k);
        F.docSheet(ctx, t, 120, -30, 360, { lines: 8, rot: .08, seed: 9 });
        F.clipboard(ctx, t, 0, 0, 430, { rot: -.035, rows: [['WHO CHECKED IT?', 0, span(t, a.chk, a.chk + .3) * (1 - span(t, a.room - 1, a.room))], ['WHAT’S NOT SHOWN?', 0, span(t, a.shown, a.shown + .3) * (1 - span(t, a.room - 1, a.room))]] });
      });
      const q1 = inOut(t, a.chk - .1, a.chk + .5, a.room - 1.1, a.room - .4), q2 = inOut(t, a.shown - .1, a.shown + .5, a.room - 1.1, a.room - .4);
      scr(ctx, () => { if (q1 > 0) maskLine(ctx, [['WHO CHECKED IT?', 0]], 120, 420, 84, q1, { serif: false, weight: 600, col: CHECK.text, glow: true }); if (q2 > 0) maskLine(ctx, [['WHAT’S NOT SHOWN?', 0]], 120, 540, 84, q2, { serif: false, weight: 600, col: P.core0, glow: true }); });
    } else if (veilA > 0) F.veil(ctx, veilA);
    // ---- 7.01 the proof tape returns out of the gap: 11 DAYS → 30 HOURS; it leaves the gap; a hall opens out of it
    const tOut = span(t, a.clue + .1, a.clue + 2.4), hallM = sineIO(span(t, a.fable - .2, a.fable + 1.3)), hallR = sineIO(span(t, a.firstM - .1, a.firstM + 1.3));
    const tapeRect = (() => {
      const g = S.gapRect(c); if (!g || tOut <= 0) return null;
      const leave = sineIO(span(t, a.nolock, a.fable + .2));
      const x = lerp(g.x - 330, g.x - 700, leave), y = lerp(Math.max(110, g.y + g.h * .1), 150, leave);
      return { x, y, w: 300, h: 640 * expoOut(tOut) };
    })();
    if (tapeRect && hallM < 1) {
      const rows = Math.max(0, (t - a.clue - .1) * 2.4), ticks = Math.max(0, (t - a.clue - .9) * 2.4);
      F.proofTape(ctx, t, tapeRect.x, tapeRect.y, tapeRect.w, tapeRect.h, { rows, ticks, roll: true, seed: 7, flow: Math.max(0, t - a.eleven) * 5 });
    }
    // the calendar sheets (11 DAYS → 30 HOURS) fall beside the tape; the hall opening covers them
    const s1 = span(t, a.eleven - .15, a.eleven + .45), s2 = span(t, a.thirty, a.thirty + .6), sOut = sinkOut(t, a.nolock + .6, a.nolock + 1.4);
    if (s1 > 0 && sOut > 0 && hallM < 1) scr(ctx, () => {
      ctx.globalAlpha = sOut;
      F.calSheet(ctx, t, 330, 250 - 120 * (1 - expoOut(s1)), 220, '11', 'DAYS', { a: rise(s1), rot: -.04 });
      if (s1 > .5) E.glowText(ctx, '→', 545, 420, { size: 70, align: 'center', col: P.core0, glow: false, a: rise(span(t, a.eleven + .6, a.thirty)) });
      F.calSheet(ctx, t, 760, 250 - 120 * (1 - expoOut(s2)), 220, '30', 'HOURS', { a: rise(s2), rot: .03 });
    });
    if (hallM > 0 && tapeRect) {
      const to = { x: 0, y: 0, w: W, h: H }, r = hallR > 0 ? { x: lerp(0, RP.x, hallR), y: lerp(0, RP.y, hallR), w: lerp(W, RP.w, hallR), h: lerp(H, RP.h, hallR) } : to;
      const fold = sineIO(span(t, a.ifm - .9, a.ifm + .5)), pr = phoneAt(c, youPos);
      const lit = sineIO(span(t, a.thousand - .3, a.thousand + 1.8));
      const draw = (cx, w, h) => B.hall(cx, t, w, h, { n: 1000, lit, zoom: 1 + .05 * span(t, a.fable, a.firstM) + .04 * span(t, a.firstM, a.ifm), big: rise(span(t, a.thousand + 1.2, a.thousand + 2.2)) * .9 });
      const seed = { x: tapeRect.x + tapeRect.w * .5 - 16, y: tapeRect.y + tapeRect.h * .45 - 10, w: 32, h: 20 };   // the hall grows out of one row of the tape
      if (fold <= 0) F.portal(ctx, seed, r, hallM, draw, { rim: LAMP, r: 14, glow: hallM < .98 && hallR <= 0 });
      else if (pr) F.portal(ctx, { x: pr.x, y: pr.y, w: Math.max(4, pr.w), h: Math.max(4, pr.h) }, RP, 1 - fold, draw, { rim: LAMP, r: 14, glow: false });
    }
    // 1,000 COPIES · ONE RUN · the source
    const kU = inOut(t, a.thousand + .2, a.thousand + .9, a.firstM - .3, a.firstM + .3);
    if (kU > 0) scr(ctx, () => { maskLine(ctx, [['1,000 COPIES', 0]], 120, 200, 104, kU, { serif: true, col: P.core0, glow: true }); maskLine(ctx, [['ONE RUN', 0]], 124, 262, 34, inOut(t, a.parts - .2, a.parts + .5, a.firstM - .3, a.firstM + .3), { serif: false, weight: 600, col: GOLD.text, glow: false }); });
    F.source(ctx, t, a.parts, a.firstM + .4, F.SOURCES.fermat, { y: 870 });
    // ---- 7.02 the first machine: a glimpse out of the gap (dozens of seats, gold air) beside the hall; ROUGHLY COMPARABLE; sheets
    const lpM = sineIO(span(t, a.cant - .1, a.cant + 1.3)) * (1 - sineIO(span(t, a.ifm - .9, a.ifm + .5)));
    if (lpM > 0) {
      F.portal(ctx, S.gapRect(c), LP, lpM, (cx, w, h) => B.hall(cx, t, w, h, { n: 36, lit: 1, warm: 1, big: .95, zoom: 1 + .03 * span(t, a.cant, a.ifm) }), { rim: GOLD, r: 14, glow: lpM < .98 && t < a.ifm - 1 });
    }
    const rcU = inOut(t, a.rough - .1, a.rough + .6, a.ifm - 1.2, a.ifm - .5);
    if (rcU > 0) scr(ctx, () => maskLine(ctx, [['“ROUGHLY COMPARABLE”', 0]], 960, 128, 58, rcU, { serif: true, align: 'center', col: P.core0, glow: true }));
    const shU = sinkOut(t, a.ifm - 1.1, a.ifm - .2);
    if (t > a.dozens - .5 && shU > 0) scr(ctx, () => {
      ctx.globalAlpha = shU;
      const n11 = 11 * expoOut(span(t, a.elevenD - .1, a.elevenD + .8)), sep = span(t, a.earlier - .1, a.earlier + .5), nov = span(t, a.months2 - .1, a.months2 + .5);
      if (n11 > .3) F.calStack(ctx, t, 510, 655 - 60 * (1 - rise(span(t, a.elevenD - .1, a.elevenD + .5))), 150, n11, sep >= 1 ? 'SEP 4' : '11', sep >= 1 ? '' : 'DAYS', { a: rise(span(t, a.elevenD - .1, a.elevenD + .5)) });
      if (sep > 0 && sep < 1) F.calSheet(ctx, t, 510, 655 - 140 * (1 - expoOut(sep)), 150, 'SEP 4', '', { a: rise(sep), rot: (1 - expoOut(sep)) * .1 });
      if (nov > 0) { F.calSheet(ctx, t, 1410, 655 - 140 * (1 - expoOut(nov)), 150, 'NOV 9', '', { a: rise(nov), rot: (1 - nov) * -.1 }); E.glowText(ctx, '→', 960, 760, { size: 80, align: 'center', col: P.core0, glow: false, a: rise(span(t, a.months2 + .3, a.months2 + 1)) }); }
    });
    // ---- 7.03 HOW MUCH STRONGER? (the hook's question returns, same place)
    const hU = inOut(t, a.how - .1, a.how + .6, a.newer - .2, a.newer + .5), hU2 = inOut(t, a.how + .1, a.how + .8, a.newer - .2, a.newer + .5);
    if (hU > 0) scr(ctx, () => { maskLine(ctx, [['HOW MUCH', 0]], 120, 230, 104, hU, { serif: false, weight: 600, col: P.core0, glow: true }); maskLine(ctx, [['STRONGER?', 0]], 120, 340, 104, hU2, { serif: false, weight: 600, col: GOLD.text, glow: true }); });
    // ---- 7.04 1 · NEWER: doors behind doors out of the gap
    const cO = sineIO(span(t, a.newer + .9, a.labs + .8)), cC = sineIO(span(t, a.nobody + .9, a.bigger + .3)), cm = cO * (1 - cC);
    if (cm > 0) {
      F.veil(ctx, .4 * cm);
      F.portal(ctx, S.gapRect(c), PANEL, cm, (cx, w, h) => B.corridor(cx, t, w, h, { push: span(t, a.newer + .9, a.bigger), sheets: span(t, a.labs, a.holding + .4), fade: span(t, a.far, a.nobody + 1) }), { rim: GOLD });
    }
    const n1 = inOut(t, a.newer + .2, a.newer + .9, a.bigger - .3, a.bigger + .2);
    if (n1 > 0) scr(ctx, () => maskLine(ctx, [['1 · NEWER', 0]], 110, 230, 92, n1, { serif: false, weight: 600, col: P.core0, glow: true }));
    // ---- 7.05 2 · BIGGER: the stadium (OPENAI SAYS · NOT CONFIRMED) → your phone, one core → the hall out of the phone: SAME MACHINE × 1,000
    // integration: a soft light behind the stadium lifts the dark explainer
    const bW = sineIO(span(t, a.bigger - .4, a.says + .4)) * (1 - sineIO(span(t, a.between - .6, a.between + .8)));
    if (bW > 0) wash(ctx, lerp(1000, 760, sineIO(span(t, a.method, a.oneCopy + .2))), 560, 1100, .5 * bW);
    const n2 = inOut(t, a.bigger + .3, a.bigger + 1, a.between - .5, a.between + .2);
    if (n2 > 0) scr(ctx, () => maskLine(ctx, [['2 · BIGGER', 0]], 110, 230, 92, n2, { serif: false, weight: 600, col: P.core0, glow: true }));
    const bigOut = sinkOut(t, a.between - .4, a.between + .6);
    if (t > a.says - 1 && bigOut > 0) scr(ctx, () => {
      ctx.globalAlpha = bigOut;
      const mv = sineIO(span(t, a.method, a.oneCopy + .2)), sx = lerp(1000, 520, mv), sy = lerp(520, 520, mv), sk = lerp(1, .62, mv);
      const su = span(t, a.says - .9, a.says + .4);
      ctx.save(); ctx.globalAlpha *= 1 - .45 * mv;
      B.stadium(ctx, t, sx, sy + 40 * (1 - rise(su)), 860 * sk, 440 * sk, { u: su, dots: expoOut(span(t, a.tenk - .2, a.tenk + 1.4)), a: rise(su) });
      F.stamp(ctx, t, 'OPENAI SAYS', sx + 260 * sk, sy - 170 * sk, { t0: a.says + .35, size: 34 * Math.max(.75, sk), rot: -.08, a: bigOut * (1 - .45 * mv) * sineIO(span(t, a.says + .1, a.says + .4)) });
      const nc = rise(span(t, a.dispute - .3, a.dispute + .4));
      if (nc > 0) maskLine(ctx, [['NOT CONFIRMED', 0]], sx, sy + 270 * sk + 10, 30 * Math.max(.8, sk), nc, { serif: false, weight: 600, align: 'center', col: P.halo2, glow: false });
      ctx.restore();
    });
    // your phone with one core (from below), and the hall out of its screen
    const phU = span(t, a.oneCopy - .7, a.oneCopy + .5), bhM = sineIO(span(t, a.aThousand - .1, a.aThousand + 1.2)) * (1 - sineIO(span(t, a.between - .6, a.between + .5)));
    let phR = null;
    if (phU > 0 && bigOut > 0) scr(ctx, () => {
      ctx.globalAlpha = bigOut;
      const y = lerp(1180, 540, expoOut(phU));
      phR = F.phone(ctx, t, 980, y, 300, { lit: .9, core: rise(span(t, a.oneCopy - .2, a.oneCopy + .5)) });
    });
    if (bhM > 0 && phR) F.portal(ctx, phR, BIGHALL, bhM, (cx, w, h) => B.hall(cx, t, w, h, { n: 1000, lit: span(t, a.aThousand + .3, a.aThousand + 1.9), zoom: 1 + .04 * span(t, a.aThousand, a.between) }), { rim: LAMP, r: 12, glow: bhM < .98 });
    const smU = inOut(t, a.same - .2, a.same + .6, a.between - .5, a.between + .2);
    if (smU > 0) scr(ctx, () => maskLine(ctx, [['SAME MACHINE × 1,000', 0]], 1480, 690, 46, smU, { serif: false, weight: 600, align: 'center', col: P.core0, glow: true }));
    // ---- 7.06 PERMISSION · POWER (pinned to the door's leaf and its light)
    const dr = S.doorRect(c), gp = S.gapRect(c, doorOpen);
    const pmU = inOut(t, a.perm - .1, a.perm + .7, a.april - .3, a.april + .3), pwU = inOut(t, a.power, a.power + .8, a.powerMoves - .3, a.powerMoves + .3);
    if (dr && pmU > 0) scr(ctx, () => F.label(ctx, dr.x + dr.w * .35, dr.y + dr.h * .55, 'PERMISSION', '', pmU, { dx: -210, dy: -150, size: 44, col: GOLD }));
    if (gp && pwU > 0) scr(ctx, () => F.label(ctx, gp.x + 2, gp.y + gp.h * .3, 'POWER', '', pwU, { dx: 190, dy: -120, size: 44, col: GOLD }));
    // ---- 7.07 APR → JUNE (a sheet tears off), the price bar to a third
    const calA = inOut(t, a.months - .2, a.months + .6, a.preview, a.preview + .7);
    if (calA > 0) scr(ctx, () => {
      const cx0 = 1500, cy0 = 210 - 80 * (1 - calA);
      ctx.globalAlpha = calA;
      F.calStack(ctx, t, cx0, cy0, 220, 6, 'JUNE', '');
      const tear = span(t, a.june - .3, a.june + 1.1);
      if (tear < 1) { ctx.save(); ctx.translate(cx0, cy0 + 520 * expoIn(tear)); ctx.rotate(.5 * expoIn(tear)); F.calSheet(ctx, t, 0, 0, 220, 'APR', '', { a: 1 - span(tear, .55, 1) }); ctx.restore(); }
    });
    const prA = inOut(t, a.powerMoves - .2, a.powerMoves + .6, a.preview, a.preview + .7);
    if (prA > 0) scr(ctx, () => {
      const sh = expoOut(span(t, a.fallen - .1, a.fallenE + .4)), len = lerp(540, 180, sh), x0 = 140, y0 = 720;
      ctx.globalAlpha = prA;
      F.slab(ctx, t, x0, y0, len, 34, { col: 'gold', u: 1 });
      F.priceTag(ctx, t, x0 + len - 6, y0 + 17, 'MYTHOS', 1, { size: 20 });
      const tq = rise(span(t, a.fallenE - .1, a.fallenE + .5)); if (tq > 0) E.glowText(ctx, '⅓', x0 + len + 46, y0 + 22, { size: 72, serif: true, col: P.core0, a: tq, glow: true });
    });
    F.source(ctx, t, a.fallen - .3, a.preview + .6, F.SOURCES.priceDrop, { y: 870 });
    // ---- 7.08 A FEW MONTHS · ESTIMATE (3 TO 6) (you look at the open door like into a shop window)
    const fmA = inOut(t, a.fewM - .1, a.fewM + .6, a.evening - .4, a.evening + .4);
    if (fmA > 0) scr(ctx, () => {
      maskLine(ctx, [['A FEW MONTHS', 0]], 760, 250, 92, fmA, { serif: false, weight: 600, col: P.core0, glow: true });
      const eU = rise(span(t, a.estimate - .1, a.estimate + .8)) * (1 - sineIO(span(t, a.evening - .4, a.evening + .4)));
      if (eU > 0) F.bracket(ctx, 766, 1360, 300, eU, '', {});
      if (eU > 0) maskLine(ctx, [['ESTIMATE (3 TO 6)', 0]], 1063, 370, 34, eU, { serif: false, weight: 600, align: 'center', col: P.halo2, glow: false });
      for (let k = 0; k < 3; k++) { const u = span(t, a.fewM + .2 + k * .25, a.fewM + .8 + k * .25); if (u > 0) F.calSheet(ctx, t, 900 + k * 150, 430 - 90 * (1 - expoOut(u)), 120, ['3', '…', '6'][k], 'MONTHS', { a: rise(u) * fmA, rot: (k - 1) * .05 }); }
    });
    // ---- 8.01 the kitchen again, another season; the core answers in your phone
    const kOpen = sineIO(span(t, a.phone - .1, a.phone + 1.3)), kShut = sineIO(span(t, a.behind + .05, a.newer2 + .9)), km = kOpen * (1 - kShut);
    if (km > 0) {
      const from = phoneAt(c, youPos);
      const zu = sineIO(span(t, a.answer - .4, a.machine + 1.6)), z = { x: lerp(960, 900, zu) + E.drift(t, 14, 3), y: lerp(540, 430, zu) + E.drift(t, 9, 5), s: lerp(1.0, 1.9, zu) + .02 * (t - a.phone) };
      const coreU = rise(span(t, a.machine - .1, a.machine + .9));
      const screen = (cx, w, h) => {
        const q = span(t, a.phone, a.phone + .8); if (q > 0) { cx.fillStyle = rgba(P.cream, .85 * q); cx.beginPath(); cx.roundRect(w * .36, h * .1, w * .56 * rise(q), h * .07, h * .02); cx.fill(); }
        const u = span(t, a.machine + .6, a.front + 1.5);
        for (let k = 0; k < 5; k++) { const v = clamp(u * 5 - k); if (v <= 0) break; cx.fillStyle = rgba(P.night1, .55); cx.fillRect(w * .1, h * (.62 + k * .065), w * (k === 4 ? .45 : .78 - (k % 3) * .08) * expoOut(v), h * .028); }
      };
      F.portal(ctx, from, { x: 0, y: 0, w: W, h: H }, km, (cx, w, h) => S.kitchen(cx, t, w, h, { zoom: z, phone: { lit: 1, screen, core: coreU }, letter: 1, you: { look: .05, hold: 1 }, window: { a: 1, season: 1 } }), { rim: LAMP, r: 18 * (1 - km), glow: km < .98 });
    }
    // ---- 8.02 the core sentence (frame 0's place)
    const c1 = inOut(t, a.best - .1, a.best + .7, a.next - .5, a.next), c2 = inOut(t, a.next - .1, a.next + .7, a.chan - .4, a.chan + .5);
    if (c1 > 0) scr(ctx, () => { maskLine(ctx, [['THE BEST AI IS NEVER', 0]], 96, 230, 92, c1, { serif: false, weight: 600, col: P.core0, glow: true }); maskLine(ctx, [['THE ONE IN YOUR POCKET.', 0]], 96, 330, 92, inOut(t, a.best + .15, a.best + .85, a.next - .5, a.next), { serif: false, weight: 600, col: P.core0, glow: true }); });
    if (c2 > 0) scr(ctx, () => { maskLine(ctx, [['IT’S THE ONE', 0]], 96, 230, 92, c2, { serif: false, weight: 600, col: P.core0, glow: true }); maskLine(ctx, [['YOU’LL HAVE NEXT.', 0]], 96, 330, 92, inOut(t, a.next + .15, a.next + .85, a.chan - .4, a.chan + .5), { serif: false, weight: 600, col: GOLD.text, glow: true }); });
    // ---- A.01 subscribe 2: one quiet line (gone before the end screen)
    const sbU = inOut(t, a.sub - .2, a.sub + .6, a.subE + 2.6, a.subE + 3.6);
    if (sbU > 0) scr(ctx, () => maskLine(ctx, [['SUBSCRIBE', 0]], 1190, 700, 34, sbU, { serif: false, weight: 600, align: 'left', col: P.core0, glow: false, spacing: .3 }));
  };
}

const CACHE = new WeakMap();
export function sceneFor(T) { if (!CACHE.has(T)) CACHE.set(T, makeScene(T)); return CACHE.get(T); }
export const entry = (T, R) => [{ t: R.a, draw: sceneFor(T), print: PRINT }];
