// c01 · Hook + road map (00a, 01a to "Thousands of times.") · 0.00–74.94 · Editorial-Nacht (B1, rebuilt 2026-10-24)
// Kit: lib/f10_editorial.mjs (2.5D cards, light forms, du/robot, icons) + lib/f10_c01_draw.mjs (B1 helpers) + lib/f10_c01_world.mjs.
// Explainers (light on night) carry ~60 % of the drawn time; the scenes are the anchors (hook, du, the hands, the hall).
//
// | ID    | time        | anchor            | picture (one idea)                                                        | 1–2 moves                 | camera                      | → carrier · position · direction                     |
// |-------|-------------|-------------------|---------------------------------------------------------------------------|---------------------------|-----------------------------|------------------------------------------------------|
// | 1.01★ | 0–4.76      | body @3.24        | K1: a hand of light reaches down, a small robot lifts its hand to the     | robot's arm · the spark   | breathing push 4.8 s        | clip cut on "Last" (footage)                         |
// |       |             |                   | fingertip; you on the ledge look up. Spark on "body".                     |                           |                             |                                                      |
// | 1.02  | 4.76–9.72   | Beijing @5.40     | ORIGINAL FOOTAGE K1a · BEIJING · APRIL 2025                                | footage                   | –                           | clip cut on "Most": the start arch → arch of light    |
// | 1.03E | 9.72–13.16  | never @10.04 · head @12.28 | EXPL: 21 runner icons under an arch of light; 15 stop and go cool, 6 reach the finish (6 OF 21). On "head" one stopped icon loses its head; it rolls. | the stop cascade · the head | small push | clip cut "One year later" |
// | 1.04  | 13.16–17.88 | faster @15.08     | K2a + the race times as light: 50:26 vs 57:20 with time bars                | footage + numbers         | –                           | cuts in the footage                                  |
// | 1.05  | 17.88–21.99 | barrier @19.16    | K2c (crash, set back up)                                                   | footage                   | –                           |                                                      |
// | 1.06  | 21.99–24.23 | own @23.43        | K2a end (the winner alone)                                                 | footage                   | –                           | clip cut on "They"                                   |
// | 1.07★ | 24.23–27.61 | hands @25.43 · now @26.39 | you on the ledge hold the robot's hand and elbow, the setting sun behind; "For now": your hand lifts off | the hand · push 3 % | close (1.8×), hold | plan sequence |
// | 1.08  | 27.61–29.21 | teaching @28.17   | the trace (warm, joint ticks) runs from your fingers into its hand, up the arm, out over the edge | the trace · pull back | logout pull back 3 s | the trace runs down onto the road                    |
// | 1.09E | 29.21–32.53 | working @30.49    | EXPL: the valley as a map; the trace reaches the fork: hall left, house right (icons); it hesitates | the trace head | home, hold | plan sequence                                         |
// | 1.10E | 32.53–37.01 | thirteen @34.53   | EXPL: a small cool group walks up the road, packs into a block · >13,000 · ROBOTS · 2025 · OMDIA | the group | slow push | plan sequence                                          |
// | 1.11E | 37.01–41.81 | billion @40.77    | EXPL: the block floods the whole valley to the horizon (scale) · ~1 BILLION · BY 2050 · FORECAST · MORGAN STANLEY | the flood · pull back | pull back 4 s | plan sequence |
// | 1.12E | 41.81–43.49 | robots @42.85     | the full field; a light edge sweeps it                                     | the edge                  | hold                        | plan sequence                                        |
// | 1.13E | 43.49–45.65 | hands @44.93      | EXPL: a loupe of light opens over the field: every dot is a robot with two raised hands · 2 BILLION · NEW HANDS | the loupe | hold | the loupe shrinks back into its dot |
// | 1.14  | 45.65–47.97 | ours @47.09       | you raise your hand; a warm trace runs into the field, the dots turn warm in a wave (K2) | your arm · the wave | hold | the trace runs on to the horizon                      |
// | 1.15E | 47.97–51.73 | coming @51.09     | EXPL: the trace rises from the horizon and draws the road map: a timeline 0 → 11 MIN, mark 1 (robot) COMING? | the line | crane up 2.2 s | the head travels along the line                     |
// | 1.16E | 51.73–54.05 | planet @53.49     | mark 2 (coin + planet) COST                                                | the head                  | hold                        |                                                      |
// | 1.17E | 54.05–60.78 | wake @55.41 · life @57.41 | mark 3: a sun of light rises, LIFE; in the pause the camera flies into the sun | sun · flight | flight 'i' | FLIGHT through the light (flood) → hall window |
// | 1.18  | 60.78–64.38 | learn @63.42      | K3: out of the light: the tall hall window in a dark wall, the robot in its light, you (headset, cup) | the robot stirs | 'o' out of the light, then push | plan sequence |
// | 1.19  | 64.38–68.62 | cup @67.74        | you lift the cup · CHINA                                                   | your arm                  | 2 % push                    | clip cut "A robot copies"                            |
// | 1.20  | 68.62–72.94 | Again @70.70      | ORIGINAL FOOTAGE K3 (3 pieces) · CHINA · ROBOT TRAINING CENTRE              | footage                   | –                           | clip cut "Thousands": same staging (trainer left, robot right) |
// | 1.21E | 72.94–74.94 | Thousands @72.94  | EXPL: the copied move as an arc of light; the repetitions pile up into a dense crown | the arcs | slow pull back | plan sequence → c02 (the window becomes one of forty) |
import { Path2D, PathOp } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as D from '../lib/f10_c01_draw.mjs';
import * as V from '../lib/f10_c01_world.mjs';
import { footage, clipSlot } from '../lib/f10_core.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, card, cam3, aim, camAt, camDrift, project, F0 } = E;

export const PRINT = { editorial: true };
export const PRINT_CLIP = { editorial: true, grain: 12, floor: 3, vig: .28 };

export default async (T, R) => {
  E.prepareEditorial();
  const A = (w, n) => T.S('00a', w, n), B = (w, n) => T.S('01a', w, n);
  const a = {
    sup: A('Superintelligence'), body: A('body'), last: A('Last'), beijing: A('Beijing'), most: A('Most'), never: A('never'), finished: A('finished'), lost: A('One lost'), head: A('head'),
    oneYear: A('One year'), faster: A('faster'), oneOf: A('One of them'), winner2: A('The winner', 1), they: A('They still'), hands: A('hands'), forNow: A('For now'),
    so: A('So what'), teaching: A('teaching'), andWho: A('And who'), working: A('working'), lastYear: A('Last year', 1), thirteen: A('thirteen'), by: A('By the middle'),
    century: A('century'), billion: A('billion'), aBillion: A('A billion'), robots3: A('robots', 2), two: A('Two billion'), hands2: A('hands', 1), all: A('All of them'), ours: A('ours'),
    inNext: A('In the next'), eleven: A('eleven'), whether: A('whether'), coming: A('coming'), what: A('What it'), cost: A('cost'), planet: A('planet'), andHow: A('And how'), wake: A('wake'), life: A('life'),
    lifeE: T.E('00a', 'life'), here: B('And here'), learn: B('learn'), inHall: B('In a hall'), china: B('China'), trainer: B('trainer'), headset: B('headset'), lifts: B('lifts'), cup: B('cup'),
    aRobot: B('A robot copies'), again1: B('Again'), again2: B('And again'), thousands: B('Thousands'),
  };
  a.crash = a.oneOf + 2.4;   // K2c: the crash (2.4 s) then the helper sets it up (K2c2)
  a.flight = 60.5;           // the flight through the sun of the road map into the hall window (both sides full light)
  const slot = {
    K1a: footage('K1a', a.last, a.most), K2a1: footage('K2a1', a.oneYear, a.oneOf), K2c1: footage('K2c1', a.oneOf, a.crash), K2c2: footage('K2c2', a.crash, a.winner2),
    K2a2: footage('K2a2', a.winner2, a.they), K3a: footage('K3a', a.aRobot, a.again1), K3b: footage('K3b', a.again1, a.again2), K3c: footage('K3c', a.again2, a.thousands),
  };
  const clip = (id, tag, extra) => (ctx, t) => { clipSlot(ctx, t, slot[id], {}); if (extra) extra(ctx, t); D.tagFoot(ctx, t, tag); };
  const tag25 = { place: 'Beijing · April 2025', t0: a.last }, tag26 = { place: 'Beijing · April 2026', t0: a.oneYear }, tag3 = { place: 'China · Robot training centre', t0: a.aRobot };
  const C = { editorial: true }, CL = PRINT_CLIP;
  return [
    { t: 0, draw: hook(a), print: C },
    { t: a.last, draw: clip('K1a', tag25), clip: true, print: CL },
    { t: a.most, draw: neverFinished(a), print: C },
    { t: a.oneYear, draw: clip('K2a1', tag26, (ctx, t) => D.raceTimes(ctx, t, a.faster, a.oneOf)), clip: true, print: CL },
    { t: a.oneOf, draw: clip('K2c1', { ...tag26, t0: a.oneYear - 5 }), clip: true, print: CL },
    { t: a.crash, draw: clip('K2c2', { ...tag26, t0: a.oneYear - 5 }), clip: true, print: CL },
    { t: a.winner2, draw: clip('K2a2', { ...tag26, t0: a.oneYear - 5 }), clip: true, print: CL },
    { t: a.they, draw: valleyTake(a), print: C },
    { t: a.flight, draw: hallTake(a), print: C },
    { t: a.aRobot, draw: clip('K3a', tag3), clip: true, print: CL },
    { t: a.again1, draw: clip('K3b', { ...tag3, t0: a.aRobot - 5 }), clip: true, print: CL },
    { t: a.again2, draw: clip('K3c', { ...tag3, t0: a.aRobot - 5 }), clip: true, print: CL },
    { t: a.thousands, draw: V.hallEcho(a.thousands, R.b), print: C },
  ];
};

// ===================================================================================================== 1.01 ★ the hook (K1, refined)
// a hand of light reaches down from the upper right; the small robot lifts its hand to the fingertip; you stand beside it and look up.
// Accent on "body": the spark at the touch (expo-out 0.3 s), the robot's rim turns warm 80 ms later.
function hook(a) {
  const LEDGE = 896, RX = 1066, RH = 300, UX = 848, UH = 210;
  const reach = [2.42, 2.5], rest = [.55, .42];
  const tip = D.robotJ(RX, LEDGE + 2, RH, { armR: reach }).R;            // where the robot's fingertip ends
  const ang = Math.atan2(380, -560), Lh = 365, ho = { pose: 'point' };
  const ht = E.handTip(ho, 0), m0 = E.handMatrix(0, 0, ang, Lh, -1), [ox, oy] = E.applyM(m0, ...ht);
  const wrist = [tip[0] + 6 - ox, tip[1] - 6 - oy];                          // the light fingertip touches the robot's fingertip
  const KEYS = [[0, cam3({ z: -40, x: -10 })], [a.last, cam3({ z: 150, x: 40, y: -14 })]];
  return (ctx, t) => {
    const c = camDrift(camAt(t, KEYS), t, .8);
    const arm = sineIO(span(t, .35, a.body - .12)), touch = expoOut(span(t, a.body - .02, a.body + .32)), warm = smooth(span(t, a.body + .08, a.body + .7));
    const look = sineIO(span(t, a.sup + .1, a.sup + 1.2));
    card(ctx, c, 40000, () => {
      E.nightSky(ctx, [[0, P.night0], [.45, P.night1], [1, P.ind0]]);
      ctx.fillStyle = E.rad(ctx, 1420, 420, 1250, [[0, rgba(P.blue0, 1)], [.38, rgba(P.blue0, .55)], [.75, rgba(P.ind1, .25)], [1, rgba(P.ind0, 0)]]); ctx.fillRect(-W, -H, 3 * W, 3 * H);
      E.stars(ctx, 3, 150, t, [-200, -100, W + 400, H], .85);
    });
    card(ctx, c, 6000, () => {   // big soft editorial sweeps (depth)
      ctx.beginPath(); ctx.moveTo(-500, 420); ctx.bezierCurveTo(250, 380, 640, 700, 760, 1350); ctx.lineTo(-500, 1350); ctx.closePath();
      ctx.fillStyle = E.lin(ctx, 520, 640, 80, 1000, [[0, rgba(P.ind1, 0)], [.35, rgba(P.ind1, .7)], [1, rgba(P.ind0, 1)]]); ctx.fill();
      ctx.beginPath(); ctx.moveTo(380, -300); ctx.bezierCurveTo(900, 120, 700, 560, 1000, 1350); ctx.lineTo(1400, 1350); ctx.bezierCurveTo(1000, 560, 1200, 120, 760, -300); ctx.closePath();
      ctx.fillStyle = E.lin(ctx, 640, 0, 1150, 300, [[0, rgba(P.blue0, 0)], [.5, rgba(P.blue0, .35)], [1, rgba(P.blue0, 0)]]); ctx.fill();
    });
    card(ctx, c, F0, () => {
      // the hand of light: it has come down a little and stops exactly at the fingertip (anticipation: it was moving before the touch)
      const app = 1 - expoOut(span(t, -.6, a.body - .05)), br = 1 + .03 * Math.sin(t * 1.25);
      const m = E.handMatrix(wrist[0] + 46 * app + E.drift(t, 2), wrist[1] - 34 * app + E.drift(t, 1.5, 1), ang, Lh * br * (1 + .004 * touch), -1);
      E.halo(ctx, 1500, 330, 1100, .14, P.blue0, P.halo1);
      E.lightHand(ctx, m, t, { ...ho, a: 1 });
      // the ledge
      ctx.beginPath(); ctx.moveTo(760, LEDGE + 6); ctx.lineTo(2400, LEDGE - 14); ctx.lineTo(2400, 1500); ctx.lineTo(728, 1500); ctx.closePath();
      ctx.fillStyle = E.lin(ctx, 0, LEDGE, 0, H, [[0, P.ind1], [.08, P.night1], [1, P.night0]]); ctx.fill();
      ctx.fillStyle = E.lin(ctx, 760, 0, 1900, 0, [[0, rgba(P.blue0, .9)], [.45, rgba(P.halo1, .85)], [1, rgba(P.blue0, .7)]]);
      ctx.beginPath(); ctx.moveTo(760, LEDGE + 6); ctx.lineTo(2400, LEDGE - 14); ctx.lineTo(2400, LEDGE - 8); ctx.lineTo(758, LEDGE + 12); ctx.closePath(); ctx.fill();
      E.castShadow(ctx, RX, LEDGE + 2, 34, 330, 2.62, .45); E.castShadow(ctx, UX, LEDGE + 4, 26, 240, 2.62, .4);
      const armR = [lerp(rest[0], reach[0], arm), lerp(rest[1], reach[1], arm)];
      E.robot(ctx, RX, LEDGE + 2, RH, { light: 1, rim: mixHex(mixHex(P.halo0, P.blue0, .3), P.core1, warm), body: P.ind0, armR, armL: [-.08, -.04] });
      E.du(ctx, UX, LEDGE + 4, UH, { dir: 1, look: look * .9, light: 1, armR: [.24, .12], armL: [-.22, -.1] });
      if (touch > 0) { const [x, y] = tip; E.halo(ctx, x + 3, y - 3, 280 * touch, .9 * touch); E.halo(ctx, x + 3, y - 3, 64 * touch, 1, P.core1, P.core0); }
    });
  };
}

// ===================================================================================================== 1.03 E "Most never finished. One lost its head."
// 21 runner icons of light under an arch (the start); 15 stop and cool down (cascade from the back), 6 run on to the finish line.
// Number: 6 OF 21 · FINISHED · BEIJING 2025 (Semafor/Wired: 6 of 21 finished; Bloomberg 4 within the time limit).
function neverFinished(a) {
  const N = 21, BASE = 760, X0 = 250, FIN = 1640, rr = E.prng(7), stopOrder = [];
  const keep = new Set([0, 1, 2, 4, 7, 11]);   // the six that finish are among the leaders
  for (let i = 0; i < N; i++) if (!keep.has(i)) stopOrder.push(i);
  const R = Array.from({ length: N }, (_, i) => ({ i, x0: 1180 - i * 44 - rr() * 16, ph: rr() * 6.3, k: keep.has(i), so: stopOrder.indexOf(i) }));
  const lost = R[9];
  return (ctx, t) => {
    const c = camDrift(camAt(t, [[a.most, cam3({ z: -20 })], [a.oneYear, cam3({ z: 80, x: 30 })]]), t, .6);
    const tt = t - a.most;
    card(ctx, c, 40000, () => { D.bloomBg(ctx, 1020, 560, 1250, .9); E.stars(ctx, 11, 120, t, [-200, -100, W + 400, 700], .7); });
    card(ctx, c, F0, () => {
      // the course: a line of light from the start arch to the finish
      E.trail(ctx, [[X0 - 60, BASE + 6, 2.4], [FIN + 140, BASE + 6, 2.4]], 1, { spark: false, a: .7 });
      // start arch (gate of light, cool: the start is behind them) and finish line (warm, the light form of this frame)
      const gp = new Path2D(); gp.moveTo(X0 - 95, BASE); gp.lineTo(X0 - 95, BASE - 190); gp.arc(X0, BASE - 190, 95, Math.PI, 0); gp.lineTo(X0 + 95, BASE);
      E.lightShape(ctx, gp.stroke({ width: 16, cap: 1, join: 1 }), t, { lit: 0, a: .8, dust: 0 });
      const fp = new Path2D(); fp.roundRect(FIN - 7, BASE - 330, 14, 336, 7); E.lightShape(ctx, fp, t, { lit: 1, dust: 900, seed: 3 });
      const flag = new Path2D(); flag.moveTo(FIN + 7, BASE - 330); flag.lineTo(FIN + 120, BASE - 300); flag.lineTo(FIN + 7, BASE - 270); flag.closePath(); E.lightShape(ctx, flag, t, { lit: 1, dust: 0 });
      for (const r of R) {
        // runners move right; a stopper slows to a halt in the cascade (from the back), turns cool and sinks a little (sits down)
        const st = r.k ? 1e9 : a.never - a.most - .15 + r.so * .045, run = (s) => s * 260;
        const x = r.k ? r.x0 + run(tt) * (1 + .05 * (r.i % 3)) : r.x0 + (tt < st ? run(tt) : run(st) + 70 * expoOut((tt - st) / .5) * .5);
        const xx = Math.min(x, r.k ? FIN + 70 + (6 - [...keep].indexOf(r.i)) * 34 : 1e9);
        const stopped = r.k ? 0 : smooth(span(tt, st, st + .45)), arrived = r.k ? smooth(span(xx, FIN - 20, FIN + 40)) : 0;
        const bob = (1 - stopped) * (r.k && xx >= FIN + 60 ? .3 : 1) * Math.abs(Math.sin(tt * 9 + r.ph)) * 5;
        const y = BASE - 2 - bob + stopped * 6;
        const headOff = r === lost ? lostHead(t, a) : null;
        runnerIcon(ctx, xx, y, 62, t, { lit: r.k ? 1 : 1 - stopped * .9, a: 1 - stopped * .35, sit: stopped, headless: !!headOff, seed: 70 + r.i });
        if (headOff) { const hp = new Path2D(); hp.arc(xx + headOff.x, y - 62 * .86 + headOff.y, 62 * .11, 0, 6.29); E.lightShape(ctx, hp, t, { lit: 0, a: .9, dust: 0 }); }
      }
      // the number: 6 OF 21 · FINISHED, upper left on night
      D.numBlock(ctx, t, { x: 170, y: 330, num: '6 of 21', label: 'FINISHED', src: 'BEIJING 2025 · SEMAFOR', t0: a.finished - .25, size: 150 });
    });
  };
}
// the lost head: off on "head", it hops once and rolls right along the course, then settles (2 % overshoot)
function lostHead(t, a) {
  const u = span(t, a.head - .12, a.head + 1.1); if (u <= 0) return null;
  const k = expoOut(u), hop = Math.sin(Math.PI * clamp(u / .35)) * 26;
  return { x: 210 * k + 4 * Math.sin(Math.PI * clamp((u - .7) / .3)), y: -hop + 62 * .86 * smooth(clamp(u / .3)) - 7 };
}
// a runner icon of light (the kit icon set's robot, small): sit 0..1 folds it down a little
function runnerIcon(ctx, x, y, s, t, o) {
  const p = new Path2D(), q = 1 - .12 * (o.sit || 0);
  const m = { a: s, b: 0, c: 0, d: s * q, e: x, f: y };
  const body = robotIconPath(o.headless); p.addPath(body, m);
  E.lightShape(ctx, p, t, { lit: o.lit, a: o.a, dust: 0, glow: .7 });
}
let RIP = null, RIPH = null;
function robotIconPath(headless) {
  if (headless ? RIPH : RIP) return headless ? RIPH : RIP;
  const r = new Path2D();
  // simple runner: helmet, chest, arms swinging, legs; local units, feet at 0, height 1
  if (!headless) r.ellipse(0, -.86, .1, .11, 0, 0, 6.29);
  const b = new Path2D(); b.moveTo(-.17, -.73); b.lineTo(.17, -.73); b.lineTo(.12, -.44); b.lineTo(-.12, -.44); b.closePath();
  let p = headless ? b : r.op(b, PathOp.Union);
  const st = (pts, w) => { const s = new Path2D(); s.moveTo(...pts[0]); for (const q of pts.slice(1)) s.lineTo(...q); return s.stroke({ width: w, cap: 1, join: 1 }); };
  for (const s of [st([[-.06, -.46], [-.15, -.24], [-.1, 0]], .09), st([[.06, -.46], [.16, -.26], [.24, -.06]], .09), st([[-.16, -.7], [-.26, -.52], [-.2, -.38]], .07), st([[.16, -.7], [.26, -.56], [.33, -.62]], .07)]) p = p.op(s, PathOp.Union);
  if (headless) RIPH = p; else RIP = p; return p;
}

// ===================================================================================================== 1.07–1.17: one take from the ledge over the valley
// cards: sky 40000 · sun 12000 (sets behind the ridge) · ridges 9000 · valley map 3600 · road map 2400 (the timeline) · ledge F0 (you + robot)
function valleyTake(a) {
  const W0 = V.VALLEY;
  const U = { x: 410, y: 686, h: 150 }, RB = { x: 528, y: 690, h: 205 };
  // 1.07 close framing: you and the robot at 1.8× (you stay ≤ 25 % of the frame height), the sun behind them (its design point is solved for this camera)
  const C1 = aim(F0, 470, 600, 1.8, 820, 590), C1b = aim(F0, 474, 602, 1.85, 818, 590);
  const SUNZ = 12000, sunAt = (() => { const m = E.cardM(C1, SUNZ); return [(1090 - m.e) / m.k, (420 - m.f) / m.k, 300 / m.k]; })();
  const HOME = cam3({ x: 20, y: -10 }), TLZ = V.TL.Z;
  const tlCam = cam3({ x: 70, y: -300, z: -40 });
  const sunG = V.TL.marks[2];
  const KEYS = [
    [a.they, C1], [a.forNow + .6, C1b],
    [a.teaching + .2, C1b], [a.working + .6, HOME, 's'],                 // 1.08 pull back to the valley (3.4 s)
    [a.thirteen + .3, cam3({ x: 26, y: -12, z: 60 })],                    // 1.09–1.10 hold with a slow push
    [a.by + .1, cam3({ x: 26, y: -12, z: 66 })],
    [a.billion + .1, cam3({ x: 40, y: -40, z: -250 })],                    // 1.11 pull back for the scale (3.7 s)
    [a.ours + .4, cam3({ x: 20, y: -36, z: -215 })],                       // 1.12–1.14 hold
    [a.eleven + .3, tlCam, 's'],                                           // 1.15 crane up to the road map (2.5 s)
    [a.lifeE + .5, cam3({ ...tlCam, z: 40, x: 90 })],                      // 1.15–1.17 hold, slow push
    [a.flight, aim(TLZ, sunG.x, sunG.y - 40, 60), 'i'],                    // flight into the sun (both sides full light)
  ];
  const duPose = (t) => {   // 1.07 hold its hand and elbow · 1.14 raise your hand to the valley
    const rl = expoOut(span(t, a.forNow + .05, a.forNow + .6)), raise = sineIO(span(t, a.all + .05, a.all + .75));
    return { rl, raise };
  };
  return (ctx, t) => {
    const c0 = camAt(t, KEYS, F0), c = camDrift(c0, t, lerp(.5, 1, span(t, a.working, a.working + 2)));
    // ------- state from the voice
    const s = {};
    s.sunY = 340 * sineIO(span(t, a.teaching - .1, a.working + 1.2));       // the sun sets behind the ridge as the trace takes over
    s.trace = expoOut(span(t, a.teaching - .45, a.teaching + .9)) * .42 + .58 * sineIO(span(t, a.teaching + .5, a.working - .1));
    s.traceIn = sineIO(span(t, a.lastYear - .1, a.lastYear + .9));       // the trace retracts into the fork node
    s.hesit = t - (a.working - .2);
    s.group = sineIO(span(t, a.lastYear + .2, a.thirteen + .8));          // the 13,000 walk up the road and pack into a block
    s.flood = t - (a.century - .3);                                       // seconds since the flood started
    s.edge = span(t, a.aBillion - .1, a.robots3 + .7);                    // the light edge over the field
    s.loupe = expoOut(span(t, a.two + .1, a.two + .8)) * (1 - quartIO(span(t, a.all - .1, a.all + .5)));
    s.wave = t - (a.ours - .25);                                          // the warm wave through the field
    s.trail2 = sineIO(span(t, a.all + .4, a.ours - .2));                  // your trace into the field
    s.horizon = sineIO(span(t, a.inNext - .2, a.eleven + .1));            // it runs on to the horizon and up
    s.tl = sineIO(span(t, a.eleven - .1, a.eleven + 1.3));                // the timeline draws
    s.head = [a.whether + .2, a.cost - .1, a.wake - .05];                 // the head travels to mark 1, 2, 3
    const dp = duPose(t);
    // ------- far → near
    card(ctx, c, 40000, () => { V.sky(ctx, t, 1 - span(t, a.working, a.billion)); });
    card(ctx, c, SUNZ, () => { if (s.sunY < 330) V.sun(ctx, t, sunAt[0], sunAt[1] + s.sunY, sunAt[2], 1 - span(s.sunY, 200, 330)); });
    card(ctx, c, 9000, () => V.ridges(ctx));
    let mapS = null;
    card(ctx, c, W0.Z, (k) => { mapS = V.valley(ctx, t, s, k, a); });
    card(ctx, c, TLZ, () => V.roadmap(ctx, t, s, a));
    // ------- the ledge, the robot, you
    let J = null, Ju = null, fig = null;
    card(ctx, c, F0, () => {
      V.ledge(ctx, 1 - span(s.sunY, 60, 300));
      // the robot: unsteady at first (a small sway that settles once you let go)
      const sway = Math.sin(t * 1.9) * (1 - .8 * dp.rl) * 1.6;
      const rArm = { armL: [-.42 + .05 * Math.sin(t * 1.3) * (1 - dp.rl), -.25], armR: [.12, .06] };
      E.castShadow(ctx, RB.x, RB.y, 26, 190, 3.6, .35);
      E.robot(ctx, RB.x + sway, RB.y, RB.h, { light: 1, rim: mixHex(P.halo0, P.blue0, .35 + .4 * span(s.sunY, 60, 300)), body: P.ind0, ...rArm });
      J = D.robotJ(RB.x + sway, RB.y, RB.h, rArm);
      // you: right hand holds its hand (lifts 2 cm on "For now"), left hand under its elbow; later you raise the right hand
      const sh = D.duJ(U.x, U.y, U.h, {}), L1 = .17 * U.h, L2 = .155 * U.h;
      const holdT = [J.L[0] - 2, J.L[1] - 2 - dp.rl * 6], elbT = [J.elL[0] - 4, J.elL[1] + 7];
      let armR = D.armIK(sh.shR, holdT, L1, L2), armL = D.armIK(sh.shL, elbT, L1, L2);
      armL = [lerp(armL[0], -.18, dp.rl * .0), lerp(armL[1], -.1, 0)];
      if (dp.raise > 0) { const up = [2.35, 2.25]; armR = [lerp(armR[0], up[0], dp.raise), lerp(armR[1], up[1], dp.raise)]; armL = [lerp(armL[0], -.2, dp.raise), lerp(armL[1], -.1, dp.raise)]; }
      E.castShadow(ctx, U.x, U.y, 22, 150, 3.6, .3);
      const hd = E.du(ctx, U.x, U.y, U.h, { dir: 1, light: 1, look: .25 + .4 * dp.raise, armR, armL });
      Ju = { R: hd.R };
      fig = true;
    });
    // ------- the trace in screen space (1.08 → 1.09): your fingers → its hand → up the arm → over the edge → down the road to the fork
    if (s.trace > 0 && s.traceIn < 1) {
      const pts = [[F0, ...Ju.R, 3], [F0, ...J.L, 3], [F0, ...J.wrL, 3], [F0, ...J.elL, 3], [F0, ...J.shL, 3.2],
        [F0, 640, 520, 3.2], [F0, 860, 640, 3], ...W0.road.slice(2).map(([x, y]) => [W0.Z, x, y, 2.6])];
      const sp = E.catmull(D.screenPts(c, pts), 8), uu = clamp(s.trace), tail = s.traceIn;
      drawTrailRange(ctx, sp, tail, uu, s.hesit);
      // joint ticks while the trace climbs the arm
      if (s.traceIn < .2) D.ticks(ctx, sp, [.05, .1, .16].filter((f) => f < uu * .99), 1 - s.traceIn * 5);
    }
    // ------- your trace into the field (1.14) and on to the horizon, up into the road map (1.15); it fades as the camera flies off
    const mF = E.cardM(c, F0), fa = 1 - span(t, a.lifeE + .4, a.lifeE + 1.4);
    if (s.trail2 > 0 && Ju && mF && fa > 0) {
      const head = [...W0.cluster];
      const pts = [[F0, ...Ju.R, 3.2], [F0, 640, 520, 3.2], [W0.Z, head[0] - 60, head[1] - 70, 3], [W0.Z, ...head, 3]];
      E.trail(ctx, E.catmull(D.screenPts(c, pts), 10), s.trail2, { w: 3.2, a: fa });
      if (s.horizon > 0) {
        const p2 = [[W0.Z, ...head, 3], ...W0.toHorizon.map(([x, y]) => [W0.Z, x, y, 2.4]), [TLZ, V.TL.x0 - 46, V.TL.y + 120, 2.6], [TLZ, V.TL.x0 - 26, V.TL.y + 30, 2.7], [TLZ, V.TL.x0, V.TL.y, 2.8]];
        E.trail(ctx, E.catmull(D.screenPts(c, p2), 10), s.horizon, { w: 3, spark: s.horizon < 1, a: fa });
      }
    }
    // the flight into the sun of mark 3: the frame becomes light (identical full-light frame on the hall side)
    const kz = E.cardM(c0, TLZ); if (kz && t > a.lifeE) E.lightFlood(ctx, smooth(span(kz.k, 3.5, 34)));
  };
}
// a trail drawn from share `tail` to share `head` (the trace retracts into its head); the head hesitates at the fork
function drawTrailRange(ctx, pts, tail, head, hes) {
  if (head <= tail + .001) return;
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = len[len.length - 1], a = tail * L, b = head * L, sub = [];
  for (let i = 0; i < pts.length; i++) {
    if (len[i] < a) { if (len[i + 1] !== undefined && len[i + 1] > a) { const f = (a - len[i]) / (len[i + 1] - len[i]); sub.push(pts[i].map((v, j) => lerp(v, pts[i + 1][j], f))); } continue; }
    if (len[i] > b) { const f = (b - len[i - 1]) / (len[i] - len[i - 1]); sub.push(pts[i - 1].map((v, j) => lerp(v, pts[i][j], f))); break; }
    sub.push(pts[i]);
  }
  if (sub.length < 2) return;
  E.trail(ctx, sub, 1, { w: 3, spark: false });
  const hd = sub[sub.length - 1], k = hes > 0 ? Math.exp(-hes * .5) : 1;
  E.halo(ctx, hd[0], hd[1], 70 + 20 * Math.sin(hes * 4) * k, .9);
}

// ===================================================================================================== 1.18–1.19: the hall window (K3)
function hallTake(a) {
  const H3 = V.HALL, OUT = aim(F0, H3.win.x + H3.win.w / 2, H3.win.y + H3.win.h * .5, 45);
  const KEYS = [[a.flight, OUT], [a.flight + 1.7, cam3({ z: -30, x: 10 }), 'o'], [a.aRobot, cam3({ z: 70, x: 30, y: -8 })]];
  return (ctx, t) => {
    const c0 = camAt(t, KEYS, F0), c = camDrift(c0, t, span(t, a.flight + 1.2, a.flight + 2.5) * .7);
    const lift = sineIO(span(t, a.lifts - .1, a.cup + .5)), stir = smooth(span(t, a.learn - .2, a.learn + .6)) * (1 - smooth(span(t, a.learn + 1.4, a.learn + 2.6)));
    const copy = sineIO(span(t, a.cup + .35, a.cup + 1.3));
    V.hall(ctx, t, c, { lift, rob: copy * .5 + stir * .12, look: .15 + .2 * smooth(span(t, a.here, a.learn)), glint: span(t, a.headset - .1, a.headset + .6), place: { s: 'China', t0: a.china - .1 } });
    const m = E.cardM(c0, F0); E.lightFlood(ctx, m ? smooth(span(m.k, 3.5, 34)) : 1);
  };
}
