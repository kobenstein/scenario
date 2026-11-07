// Film 20 · B1 · c02 + c03 + c04 as ONE plan sequence (T.G('Aging looks like') → T.G('Yes. Earlier this year')).
// scenes/sc02.mjs, sc03.mjs and sc04.mjs each return one entry that draws THIS function, so the two inner chunk boundaries
// ('Twenty years ago', 'That search is too big') are seamless by construction (same camera, same world state on both sides).
// Starts on plateYou (first SEAM_HALF s), ends on plateEye (last SEAM_HALF s). Plan: docs/shots.md 2.01–4.10.
//
// | ID    | anchor (word)                          | picture (one idea)                                               | camera               |
// |-------|----------------------------------------|------------------------------------------------------------------|----------------------|
// | 2.01  | law of nature · It isn't one           | your lane becomes a life line: a straight rule, then a hinge     | rise, pull back      |
// | 2.02  | children's first years · stopped       | the stretch up to you lights warm; beyond, the light goes out     | breathing push       |
// | 2.03  | pays for your youth · sends the bill   | a bill of light is written in youth, slides to OLD AGE            | hold                 |
// | 2.04  | reset · The proof is you               | the bill folds to a point, runs back up the line into you; the    | down to the table    |
// |       |                                        | point leaves you and lands on the tabletop                        |                      |
// | 2.05★ | before your mother · decades · zero    | three nested lives drawn in light; counter 31 → snaps to 0        | slow push            |
// | 2.06  | marks on its DNA                       | the DNA unspools out of the egg, the age dial reads its marks     | breathing            |
// | 2.07  | goes down · ground zero                | the cell-age curve dips to GROUND ZERO (the dial follows it)      | widen                |
// | 2.08  | reset button · pressed it              | the minimum drops to the tabletop and swells into the button      | to the button        |
// | 2.09  | where that button is                   | the button under the lamp; the card rolls to WHERE IS THE BUTTON? | push                 |
// | 3.01  | four proteins · factory settings       | four proteins drift down from the lamp into the sockets; a press  | widen                |
// |       |                                        | runs to a grown cell: it rounds into a stem cell                  |                      |
// | 3.02  | Hold … down · forgets · tumors         | the press held: the cell loses its form, then clumps (IN MICE)    | hold                 |
// | 3.03  | pressing harder · letting go in time   | released; three short presses: the cell keeps its shape, warms    | hold                 |
// | 3.04  | window · More pressing                 | a gauge: TOO LITTLE · WINDOW · TOO MUCH                           | widen left           |
// | 3.05  | three of the four · glaucoma · half     | one protein lifts out; a mouse eye; its sharpness bar climbs half | to the right         |
// | 3.06  | eighty-year-old · under twenty         | blood cell → nerve stem cell; the age dial falls 80 → under 20    | widen                |
// | 3.07  | dishes · mice · long way               | a dish, a mouse on the table; pull back: a line of light from the | pull back to track   |
// |       |                                        | dish down the lane to you: A LONG WAY                             |                      |
// | 3.08  | other mix · how hard                   | sparks from the sockets; the switchboard grows in the sky         | crane up             |
// | 4.01★ | people alone · A.I. is helping         | the board grows past the frame; a cool light starts reading it    | push                 |
// | 4.02  | three thousand · Over twenty           | 3,000+ MIXES TESTED; 22 sockets turn gold (COMPANY CLAIM)         | push                 |
// | 4.03  | doubled                                | the reading light runs twice as fast: ×2 (COMPANY CLAIM)          | hold                 |
// | 4.04  | own update                             | the board folds into the footage frame                            | still                |
// | 4.05  | CLIP C1                                | Jacob Kimmel, NewLimit (still frame)                              | still                |
// | 4.06  | two of the four · fifty times          | the frame folds into four proteins; two redrawn cool; 1× vs 50×   | drift                |
// | 4.07  | companies themselves · not published   | two stamps                                                        | drift                |
// | 4.08  | machine learning                       | the age dial again, its marks read by a cool light                | drift                |
// | 4.09  | estimate, not proof                    | the needle gets a wobble band: AN ESTIMATE                        | down to the table    |
// | 4.10  | inside a living person                 | the drop on the table; the eye rises out of the tabletop → plateEye| push                 |
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f20_kit.mjs';
import * as S from './f20_seams.mjs';
import * as B from './f20_b1_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, cam3, camAt, camDrift, halo } = E;
const { GY, LAMP, TABLE, CLOCK, COOL, INK, camFor, stand, wp, bump, rise, maskLine, srcLine, trailSpan } = F;

const CACHE = new WeakMap();
export function b1Draw(T) {
  if (!CACHE.has(T)) CACHE.set(T, build(T));
  return CACHE.get(T);
}

// ===================================================================================================================== anchors
function anchors(T) {
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.aging = G('Aging looks like'); a.law = G('law of nature', a.aging); a.isnt = G("It isn't one", a.aging); a.evo = G('Evolution only', a.aging);
  a.kids = G("children's first years", a.aging); a.stopped = G('stopped looking', a.aging); a.pays = G('pays for your youth', a.aging);
  a.sends = G('sends the bill', a.aging); a.oldage = G('old age', a.sends); a.but = G('But that bill', a.aging); a.reset = G('reset', a.but);
  a.proof = G('The proof is you', a.but); a.egg = G('The egg you grew', a.but); a.before = G('before your mother', a.egg);
  a.soStarted = G('So you started out', a.egg); a.decades = G('decades old', a.egg); a.zero = G('started at zero', a.decades); a.zeroW = GE('started at zero', a.decades) - .2;
  a.sci = G('Scientists can read', a.egg); a.marks = G('marks on its DNA', a.sci); a.embryo = G('In an early embryo', a.sci);
  a.down = G('goes down', a.embryo); a.ground = G('ground zero', a.embryo); a.nature = G('So nature has', a.embryo); a.button = G('reset button', a.nature);
  a.pressed = G('It pressed it', a.nature); a.beforeBorn = G('before you were born', a.nature); a.which = G('Which makes the better', a.nature);
  a.notwhy = G('not why we age', a.which); a.where = G('where that button is', a.which);
  a.twenty = G('Twenty years ago', a.which); a.four = G('four proteins', a.twenty); a.factory = G('factory settings', a.twenty);
  a.hold = G('Hold the button down', a.twenty); a.forgets = G('forgets what it was', a.hold); a.mice = G('In mice, that grew', a.hold); a.tumors = G('tumors', a.hold);
  a.trick = G('So the trick', a.hold); a.harder = G('pressing harder', a.trick); a.letting = G('letting go in time', a.trick);
  a.window = G("There's a window", a.trick); a.more = G("More pressing doesn't", a.window); a.youth = G('more youth', a.window);
  a.three = G('three of the four', a.window); a.miceEyes = G('Mice whose eyes', a.window); a.glauc = G('glaucoma', a.miceEyes); a.half = G('half the sharpness', a.miceEyes);
  a.oct = G('And this October', a.miceEyes); a.blood = G('blood cells', a.oct); a.eighty = G('eighty-year-old', a.oct); a.turned = G('were turned into', a.oct);
  a.under = G('under twenty', a.oct); a.dishes = G('All of this was', a.oct); a.dish = G('dishes', a.dishes); a.miceE = G('and in mice', a.dishes);
  a.from = G('From a dish', a.dishes); a.yours = G('like yours', a.from); a.longway = G('long way', a.from);
  a.fourP = G('Four proteins were', a.from); a.other = G('other mix', a.fourP); a.howhard = G('how hard', a.fourP);
  a.search = G('That search is too big', a.fourP); a.alone = G('people alone', a.search); a.ai = G('artificial intelligence is helping', a.search);
  a.one = G('One company says', a.search); a.thousand = G('three thousand mixes', a.one); a.over = G('Over twenty made', a.one); a.liver = G('liver cells', a.over);
  a.ai2 = G('Artificial intelligence, it says', a.over); a.doubled = G('doubled how fast', a.ai2); a.thats = G("That's from the company's", a.ai2); a.update = G('own update', a.thats);
  a.redesign = G('has also redesigned', a.update); a.two = G('two of the four', a.redesign); a.inCells = G('In cells, the new', a.redesign); a.fifty = G('fifty times', a.inCells);
  a.these = G('These numbers come', a.fifty); a.companies = G('companies themselves', a.these); a.hasnt = G("hasn't even been published", a.these);
  a.clocks = G('And the clocks that read', a.hasnt); a.ml = G('machine learning', a.clocks); a.ifOne = G("If one says you're younger", a.clocks);
  a.estimate = G('estimate, not proof', a.ifOne); a.soHas = G('So has anyone pressed', a.ifOne); a.inside = G('inside a living person', a.soHas);
  a.end = G('Yes. Earlier this year', a.soHas);
  const c1 = F.clipWindow(T, 'C1'); a.c1s = c1.start; a.c1e = c1.end;
  return a;
}

// ===================================================================================================================== world layout
// the life line (2.01–2.04): lane 2 (yours), age 0 at the start line … 90 near the clock. Ages are spaced evenly on screen as seen
// from the LIFE camera (so the far years do not crush into the horizon).
const LIFE = cam3({ x: 230, y: -70, z: 2275 });          // low behind the start line: your lane runs from the frame's foot to the clock
const LX = F.laneX(2) - 210, AGE_YOU = 37.2;              // the line runs along the left side of your lane (you stand beside it)
const ZA = (age) => { const y = age <= AGE_YOU ? 940 - age * 212 / AGE_YOU : 728 - (age - AGE_YOU) * 116 / (90 - AGE_YOU); return 500 * 1700 / (y - 540) + 2275; };
// the bench (the tabletop under the lamp): stand units at LAMP.Z, ground y 0, tabletop y −150
const TT = -TABLE.h;
// the bench camera: low, just above the tabletop (h = camera height over the ground), so the bench stands against the night and the
// family on the track behind stays a low band of small figures above the table's back edge
const BENCH = (s, x = 0, h = 250) => cam3({ x, y: GY - h, z: LAMP.Z - 1700 / s });
const EGG = { x: -95, y: TT - 18 };                     // where the point of light lands on the tabletop
const GRAN = { x: -175, h: 420 };                       // the grandmother's outline (feet on the tabletop)
const BTN = { x: -200, r: 100 };                        // the reset button (on the tabletop, left of the drop)
const CELL = { x: 175, y: -390, r: 72 };                // the cell beside the button
const ZS = 9000, BOARD_H = 300;                         // the switchboard: a plate standing in the night over the track
const TRACKV = cam3({ x: 120, y: -20, z: 1000 });       // from behind the table down the track (the long way)
const SKY = cam3({ x: 0, y: -1970, z: 1500 });          // the night over the track, the switchboard filling it
const SKY2 = cam3({ x: 0, y: -2000, z: 2100 });

function build(T) {
  E.prepareEditorial();
  const a = anchors(T);
  const t0 = a.aging + S.SEAM_HALF, tPlate = a.end - S.SEAM_HALF;
  const BB = (s, x, h) => BENCH(s, x, h);
  const K = [
    [t0, S.YOU_CAM],
    [a.aging + 1.8, cam3({ x: 120, y: -650, z: 5350 })],              // 2.01 rise over you
    [a.evo + 1.2, LIFE],                                              //      pull back: the whole lane, the life line
    [a.but, cam3({ x: 228, y: -66, z: 2330 })],                        // 2.02–2.03 breathing push
    [a.proof + .35, cam3({ x: 226, y: -62, z: 2370 })],
    [a.egg + 1.35, BB(1.3, -70, 255), 's'],                          // 2.04 down to the table (the bench)
    [a.zero, BB(1.38, -80, 258)],                                     // 2.05 slow push on the nested lives
    [a.sci + 1.4, BB(1.32, 0, 262)],                                 // 2.06 the DNA
    [a.embryo + 1.3, BB(1.24, 60, 268)],                   // 2.07 the curve
    [a.nature + 1.7, BB(1.34, -110, 255)],                           // 2.08 the button
    [a.which + .5, BB(1.4, -120, 252)],
    [a.twenty, BB(1.5, -140, 250)],                                 // 2.09 push on the button (c03 starts here)
    [a.four + 1.1, BB(1.32, -20, 258)],                              // 3.01 widen: the cell beside it
    [a.trick, BB(1.38, -10, 255)],
    [a.window + .2, BB(1.3, -80, 262)],                             // 3.04 the gauge on the left
    [a.miceEyes + .7, BB(1.36, 70, 258)],                            // 3.05 the mouse eye and its bar
    [a.oct + 1.1, BB(1.28, -60, 262)],                               // 3.06 the dial on the left, the cell right
    [a.dishes + 2.1, BB(1.24, -40, 270)],
    [a.longway, TRACKV, 'q'],                                         // 3.07 pull back down the track: a long way
    [a.fourP + 1.6, cam3({ x: 100, y: -30, z: 1100 })],
    [a.howhard + 2.6, SKY],                                           // 3.08 crane up into the night: the switchboard
    [a.one, cam3({ x: 0, y: -1985, z: 1800 })],                       // 4.01–4.04 slow push
    [a.update + .5, SKY2],
    [a.c1e, SKY2],                                                    // 4.05 still during the clip
    [a.inCells, cam3({ x: 20, y: -2010, z: 2000 })],                  // 4.06–4.09 drift
    [a.ifOne, cam3({ x: -10, y: -2000, z: 2060 })],
    [a.estimate + .9, cam3({ x: -15, y: -1995, z: 2040 })],
    [a.soHas + 1.7, BENCH(1.5, 0, 300), 'q'],                // 4.09–4.10 down to the kitchen table
    [tPlate, S.EYE_CAM],                                              //      push to the eye → plateEye
  ];
  for (let i = 1; i < K.length; i++) K[i][0] = Math.max(K[i][0], K[i - 1][0] + .4);
  const clipK = (t) => smooth(span(t, a.c1s - .9, a.c1s - .1)) * (1 - smooth(span(t, a.c1e, a.c1e + .8)));
  const camOf = (t) => {
    const amt = smooth(span(t, t0, t0 + 1.4)) * (1 - smooth(span(t, tPlate - 1.4, tPlate))) * (1 - clipK(t));
    return camDrift(camAt(t, K, CLOCK.Z), t, amt);
  };

  // ------------------------------------------------------------------------------------------------ world state per frame
  const lampUp = (t) => {
    if (t < a.proof + .5) return 1;
    if (t < a.dishes + 2.6) return 1 - expoOut(span(t, a.proof + .5, a.egg + 1.3));
    if (t < a.soHas) return expoIn(span(t, a.dishes + 2.6, a.dishes + 4.0));
    return 1 - expoOut(span(t, a.estimate + 1.4, a.soHas + 1.4));
  };
  const clockLit = (t) => {
    let v = lerp(1, .07, smooth(span(t, a.proof + .4, a.egg + 1.2)));
    v = lerp(v, .55, smooth(span(t, a.dishes + 2.4, a.longway)));
    v = lerp(v, .12, smooth(span(t, a.c1s - 1.2, a.c1s + .5)));
    return v;
  };
  const trackLit = (t) => {
    let v = lerp(1, .22, smooth(span(t, a.proof + .4, a.egg + 1.2)));
    v = lerp(v, 1, smooth(span(t, a.dishes + 2.4, a.longway)));
    return v * (1 - smooth(span(t, a.c1s + 1, a.c1s + 3)));
  };
  const dialAt = (t) => {
    const pu = 1 - smooth(span(t, a.proof + .5, a.egg + 1.3)), th = 1 - smooth(span(t, a.proof + .5, a.egg + 1.0));
    return { ...S.DIAL, lit: clockLit(t), thr: th, push: pu > 0 ? { ...S.PUSH, u: pu } : null };
  };
  const seated = (t) => t >= a.c1s + 3;
  const famAt = (t) => {
    if (seated(t)) { const lk = .35 * smooth(span(t, a.inside - .4, a.inside + 1.4)); return S.famSeated({ grand: { look: lk }, parent: { look: lk }, you: { look: lk }, kid: { look: lk } }); }
    const g = Math.max(smooth(span(t, a.proof - .05, a.proof + .35)) * (1 - smooth(span(t, a.egg + .3, a.egg + 1.5))), .8 * bump(t, a.yours - .2, 1.6));
    return S.famOnTrack({ you: { glow: g } });
  };

  // ================================================================================================ the frame
  const frame = (ctx, t) => {
    if (t < t0) { S.plateYou(ctx, t); return; }
    if (t >= tPlate) { S.plateEye(ctx, t); return; }
    const c = camOf(t);
    const near = c.z < TABLE.z0 - 100, up = lampUp(t), tl = trackLit(t);
    F.scene20(ctx, c, t, {
      dial: dialAt(t), track: tl > 0 ? { lit: tl, reach: 1, fin: S.FIN_FAR, finA: .7 * tl } : null, fam: famAt(t),
      table: near ? { years: 1, light: 1 - .55 * up } : null,
      lamp: near && up < 1 ? { on: 1, up } : null,
      onTable: (cx, cc, tt) => bench(cx, cc, tt),
      extra: (cx, cc, tt, layer) => { if (layer === 'track') { lifeLine(cx, cc, tt); boardWorld(cx, cc, tt); } },
    });
    overlays(ctx, c, t);
  };

  // ================================================================================================ 2.01–2.04 the life line
  function lifeA(t) { return smooth(span(t, a.aging + .2, a.aging + .9)) * (1 - smooth(span(t, a.proof + .4, a.egg + .9))); }
  function backAge(t) { return lerp(90, AGE_YOU, sineIO(span(t, a.reset + .15, a.proof))); }   // the point running back up the line
  function lifeXZ(age, t) {
    const wv = 0;
    const beta = .1 * bump(t, a.isnt + .05, 1.7);
    let X = LX + wv, Z = ZA(age);
    if (age > AGE_YOU && beta) { const zy = ZA(AGE_YOU), d = Z - zy; X = LX + d * Math.sin(beta) + wv; Z = zy + d * Math.cos(beta); }
    return [X, Z];
  }
  function lifeLine(ctx, c, t) {
    const A = lifeA(t); if (A <= 0) return;
    const draw = sineIO(span(t, a.aging + .25, a.law + .3)), maxAge = 90 * draw;
    const warm = smooth(span(t, a.kids - .2, a.kids + .9));
    const back = t > a.reset + .1 ? backAge(t) : 999;
    const P0 = [];
    for (let age = 0; age <= maxAge + .001; age += 1) { const [X, Z] = lifeXZ(Math.min(age, maxAge), t), p = wp(c, X, GY, Z); if (p) P0.push([p[0], p[1], p[2], age]); }
    if (P0.length < 2) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.lineCap = 'round';
    for (let pass = 0; pass < 2; pass++) for (let i = 1; i < P0.length; i++) {
      const [x0, y0, s0, ag] = P0[i - 1], [x1, y1] = P0[i];
      const youth = ag < AGE_YOU;
      // after "stopped looking" the years beyond you go dark, stretch by stretch; the reset relights them as the point runs back
      const g = Math.floor((ag - AGE_YOU) / 13.3), off = youth ? 0 : smooth(span(t, a.stopped - .15 + g * .32, a.stopped + .3 + g * .32));
      const relit = !youth && ag > back - 1.5 ? smooth(clamp((ag - back + 1.5) / 3)) : 0;
      const hard = smooth(span(t, a.law - .1, a.law + .5)), dark = off * (1 - relit), w = (youth ? lerp(16, 22, warm) : 16) * s0 * lerp(2.2, 1, hard);
      const col = youth ? mixHex(P.halo2, P.core1, warm) : mixHex(mixHex(P.halo2, P.blue2, dark * .85), P.core1, relit * .6);
      const al = A * (youth ? 1 : lerp(.95, .3, dark)) * lerp(.55, 1, hard);
      if (pass === 0) { ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(youth ? P.halo0 : P.halo1, .22 * al * (youth ? 1 + warm : 1 - .7 * dark)); ctx.lineWidth = Math.max(4, w * 3.2); ctx.lineCap = 'butt'; }
      else { ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = rgba(col, .92 * al); ctx.lineWidth = Math.max(1.6, w); ctx.lineCap = 'round'; }
      if (pass === 1 && dark > .5) ctx.setLineDash([Math.max(3, w * 2), Math.max(3, w * 1.6)]); else ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    }
    ctx.setLineDash([]); ctx.globalCompositeOperation = 'source-over';
    // the rule's decade ticks (it hardens into a measuring rule on "law of nature")
    const tk = span(t, a.law - .05, a.law + .8);
    for (let dec = 0; dec <= 90; dec += 10) {
      const q = clamp(tk * 1.6 - dec / 90 * .6); if (q <= 0 || dec > maxAge) continue;
      const [X, Z] = lifeXZ(dec, t), p0 = wp(c, X - 70 * expoOut(q), GY, Z), p1 = wp(c, X + 70 * expoOut(q), GY, Z); if (!p0 || !p1) continue;
      ctx.strokeStyle = rgba(P.cream, .8 * A); ctx.lineWidth = Math.max(1.4, 10 * p0[2]); ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke();
    }
    // the hinge at you: a ring of light round the joint ("It isn't one": it can be bent)
    const hg = expoOut(span(t, a.isnt - .1, a.isnt + .5)) * A;
    if (hg > 0) { const [X, Z] = lifeXZ(AGE_YOU, t), p = wp(c, X, GY, Z); if (p) { ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(1, .3); ctx.strokeStyle = rgba(P.core1, .95 * hg); ctx.lineWidth = Math.max(2, 22 * p[2]); ctx.beginPath(); ctx.arc(0, 0, 150 * p[2] * hg, 0, 6.29); ctx.stroke(); ctx.restore(); halo(ctx, p[0], p[1], 260 * p[2], .5 * hg, P.halo0, P.core0); } }
    ctx.restore();
  }
  const lifeP = (c, age, t, h = 0) => { const [X, Z] = lifeXZ(age, t); return wp(c, X, GY - h, Z); };
  function lifeOverlay(ctx, c, t) {
    const A = lifeA(t); if (A <= 0) return;
    const out = 1 - smooth(span(t, a.proof + .2, a.proof + .9));
    // labels: YOUR LIFE (at the start line, on "law of nature"), YOUTH (on the lit stretch), OLD AGE (the far end)
    const p0 = lifeP(c, 14, t), p18 = lifeP(c, 24, t), p90 = lifeP(c, 89, t), p55 = lifeP(c, 58, t);
    if (p0) srcLine(ctx, t, 'YOUR LIFE', p0[0] - 50, Math.min(p0[1] + 8, 850), rise(span(t, a.law, a.law + .7)) * out * (1 - expoIn(span(t, a.kids - .3, a.kids + .2))), { size: 26, col: P.cream, align: 'right' });
    if (p18) srcLine(ctx, t, 'YOUTH', p18[0] - 50, p18[1] + 8, rise(span(t, a.kids, a.kids + .7)) * out, { size: 26, col: P.halo0, align: 'right' });
    if (p90) { srcLine(ctx, t, 'OLD AGE', p90[0] + 80, p90[1] + 2, rise(span(t, a.oldage - .1, a.oldage + .6)) * out, { size: 26, col: P.cream });
      if (p55) srcLine(ctx, t, 'NOBODY LOOKED', p55[0] - 34, p55[1] + 8, rise(span(t, a.stopped + .3, a.stopped + 1)) * out * (1 - smooth(span(t, a.reset, a.reset + .5))), { size: 20, col: P.halo2, align: 'right' }); }
    // the bill: written in the lit stretch, slides down the line, lands at OLD AGE, folds into a point on "reset"
    const wr = span(t, a.pays - .1, a.pays + .8), mv = span(t, a.sends - .05, a.oldage + .25), fold = expoIn(span(t, a.reset - .25, a.reset + .15));
    if (wr > 0 && fold < 1) {
      const age = lerp(16, 89, sineIO(mv)), p = lifeP(c, age, t), pp = lifeP(c, age, t, 1);
      if (p) {
        const s = p[2], hgt = Math.max(26, 230 * s) * expoOut(clamp(wr * 2)), hop = 18 * bump(mv, .02, .96) * s / .3;
        B.slip(ctx, p[0] + 34 * s, p[1] - hop, hgt, { u: wr, fold, a: A });
        srcLine(ctx, t, 'THE BILL', p[0] + 34 * s + hgt * .5, p[1] - hgt * 1.05 - hop, rise(span(t, a.pays + .2, a.pays + .8)) * (1 - expoIn(span(t, a.sends - .1, a.sends + .4))), { size: 22, col: P.cream });
      }
    }
    // the point of light: runs back up the line on "reset", into you on "The proof is you"
    if (t > a.reset + .05 && t < a.proof + .1) {
      const age = backAge(t), p = lifeP(c, age, t, 30);
      if (p) { halo(ctx, p[0], p[1], 46, .9, P.halo0, P.core0); ctx.fillStyle = mixHex(P.coat, P.core1, .5); ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, 6.29); ctx.fill(); }
    }
  }
  // 2.04: the point leaves you and lands on the tabletop as the egg (world arc, projected with the moving camera)
  function eggFlight(ctx, c, t) {
    const u = span(t, a.proof + .5, a.egg + .45); if (u <= 0 || u >= 1) return;
    const e = sineIO(u), X = lerp(LX, EGG.x, e), Z = lerp(S.STOPS.you, LAMP.Z, e), Y = lerp(GY - 250, GY + EGG.y, e) - 520 * Math.sin(Math.PI * e);
    const p = wp(c, X, Y, Z); if (!p) return;
    yellowPoint(ctx, p[0], p[1], Math.max(5, 9 * Math.min(2.2, p[2] * 1.4)), 1);
  }
  function yellowPoint(ctx, x, y, r, a) {
    halo(ctx, x, y, r * 7, .8 * a, P.halo0, P.core0);
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = E.rad(ctx, x - r * .3, y - r * .3, r * 1.4, [[0, P.core0], [.5, mixHex(P.coat, P.core1, .4)], [1, P.coat]]); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill(); ctx.restore();
  }

  // ================================================================================================ the bench (tabletop)
  function bench(ctx, c, t) {
    stand(ctx, c, 0, LAMP.Z, () => {
      dropOnTable(ctx, t);
      nested(ctx, t);
      dnaBench(ctx, t);
      curveBench(ctx, t);
      buttonBench(ctx, t);
      cellBench(ctx, t);
      gaugeBench(ctx, t);
      tableStuff(ctx, t);
      eyeRise(ctx, c, t);
    });
  }
  // the drop that stayed on the table since c01 1.05; at 4.10 the eye rises under it and takes it into the pupil
  function dropOnTable(ctx, t) {
    const r_ = span(t, a.inside - .5, a.inside + 1.6), gone = smooth(span(t, a.inside + .9, a.inside + 1.5));
    if (gone >= 1) return;
    const pupY = TT + lerp(560 * .56, -240, sineIO(r_)), y = Math.min(TT - 12, pupY);
    const glow = 1 + .5 * bump(t, a.soHas, 2.4);
    F.drop(ctx, 0, y, 9 * (1 - gone), { a: 1 - gone });
    halo(ctx, 0, TT - 6, 90 * glow, .35 * (1 - gone), P.halo0, P.core1);
  }
  // ---- 2.05 three nested lives
  function nested(ctx, t) {
    const land = span(t, a.egg + .35, a.egg + .55), inn = smooth(span(t, a.egg + .35, a.egg + .8));
    const gone = smooth(span(t, a.sci + 1.0, a.sci + 2.0));
    if (inn <= 0 || gone >= 1) return;
    const lift = sineIO(span(t, a.before - .5, a.before + .6));
    const fH = 84, fx = GRAN.x + .12 * GRAN.h - 4, fy = TT - .5 * GRAN.h + .45 * fH;      // the fetus inside the belly
    const ex = lerp(EGG.x, fx + .02 * fH, lift), ey = lerp(EGG.y, fy - .4 * fH, lift);
    // the outlines: the unborn mother drawn first (round the egg), then the grandmother (round her)
    const u0 = smooth(span(t, a.sci + .3, a.sci + 1.3));
    const fu = span(t, a.before - .2, a.before + .8), gu = span(t, a.before + .25, a.before + 1.7);
    if (fu > 0) B.outline(ctx, B.mapPts(B.FETUS, fx, fy, fH), u0, sineIO(fu), { w: 2.6, a: 1 });
    if (gu > 0) { B.outline(ctx, B.mapPts(B.GRANNY, GRAN.x, TT, GRAN.h), u0, sineIO(gu), { w: 3.2 }); B.outline(ctx, B.mapPts(B.GRANNY_ARM, GRAN.x, TT, GRAN.h), u0, sineIO(span(t, a.before + 1.2, a.before + 1.9)), { w: 2.6 }); }
    // the egg: YOU (the only yellow); it snaps to zero on "started at zero" (a flash, a ring)
    const zf = span(t, a.zeroW, a.zeroW + .9);
    const ea = 1 - smooth(span(t, a.sci + .2, a.sci + .9));   // it becomes the cell whose DNA is read (2.06)
    const er = 5.5 * (1 + .25 * Math.sin(t * 2)) * (land < 1 ? lerp(1.6, 1, expoOut(land)) : 1);
    if (ea > 0) {
      halo(ctx, ex, ey, er * 10 * (1 + 1.5 * bump(zf, 0, .5)), .75 * ea, P.halo0, P.core0);
      yellowPoint(ctx, ex, ey, er, ea);
      if (zf > 0 && zf < 1) { ctx.strokeStyle = rgba(P.core0, .9 * (1 - zf)); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(ex, ey, lerp(8, 70, expoOut(zf)), 0, 6.29); ctx.stroke(); }
    }
    nestedPos.egg = [ex, ey]; nestedPos.fetus = [fx + .15 * fH, fy - .55 * fH]; nestedPos.head = [GRAN.x + .03 * GRAN.h, TT - 1.0 * GRAN.h];
  }
  const nestedPos = { egg: [EGG.x, EGG.y], fetus: [0, 0], head: [0, 0] };
  // ---- 2.06–2.07 the epigenetic clock, then the curve; 3.06 and 4.08 reuse the dial
  function dnaState(t) {
    // where the strand + dial sit (bench units), its scale, read value, marks
    const inn = span(t, a.sci + .9, a.sci + 2.0), out = smooth(span(t, a.nature + .2, a.nature + 1.2));
    const toLeft = sineIO(span(t, a.embryo - .1, a.embryo + 1.0));
    const curveV = curveVal(t);
    const read = t < a.embryo ? lerp(0, 31, smooth(span(t, a.marks - .2, a.marks + .9))) : curveV / .85 * 31;
    return { inn, out, x: lerp(0, -340, toLeft), y: lerp(-330, -350, toLeft), k: lerp(1, .58, toLeft), read };
  }
  function dnaBench(ctx, t) {
    // 2.06–2.08
    const st = dnaState(t);
    if (st.inn > 0 && st.out < 1) {
      ctx.save(); ctx.translate(st.x, st.y + 260 * expoIn(st.out)); ctx.scale(st.k, st.k);
      const r = B.dnaGauge(ctx, t, 0, 0, 700, { u: st.inn, marks: span(t, a.marks - .2, a.marks + .6), read: st.read, dial: span(t, a.sci + 1.5, a.sci + 2.2), a: 1 - st.out });
      ctx.restore();
      dnaPos.dial = r?.dial ? [st.x + r.dial[0] * st.k, st.y + r.dial[1] * st.k, r.dial[2] * st.k] : null; dnaPos.a = st.inn * (1 - st.out);
    } else dnaPos.a = 0;
    // 3.06 the same dial reads the blood cells of an 80-year-old, then the nerve stem cells: under 20
    const bi = span(t, a.oct + .9, a.oct + 2.1), bo = smooth(span(t, a.dishes - .2, a.dishes + .8));
    if (bi > 0 && bo < 1) {
      const rd = lerp(lerp(30, 80, smooth(span(t, a.eighty - .2, a.eighty + .6))), 17, fallE(span(t, a.under - .25, a.under + .9)));
      ctx.save(); ctx.translate(-390, -360 + 240 * expoIn(bo)); ctx.scale(.8, .8);
      const r = B.dnaGauge(ctx, t, 0, 0, 600, { u: bi, marks: span(t, a.oct + 1.5, a.oct + 2.4), read: rd, dial: span(t, a.oct + 1.6, a.oct + 2.4), a: 1 - bo });
      ctx.restore();
      bonnPos.dial = r?.dial ? [-390 + r.dial[0] * .8, -360 + 240 * expoIn(bo) + r.dial[1] * .8, r.dial[2] * .8] : null; bonnPos.a = bi * (1 - bo);
    } else bonnPos.a = 0;
  }
  const dnaPos = { dial: null, a: 0 }, bonnPos = { dial: null, a: 0 };
  const fallE = (u) => { u = clamp(u); return u < .55 ? (u / .55) ** 2 : 1 + .05 * Math.sin((u - .55) / .45 * Math.PI * 2) * (1 - (u - .55) / .45); };   // heavy: falls, one small bounce
  // ---- 2.07 the curve of cell age in the early embryo
  const CRV = { x0: -150, x1: 380, y0: -340, y1: -590 };
  const crvV = (u) => (u < .45 ? lerp(.85, .07, sineIO(u / .45)) : .07 + .5 * ((u - .45) / .55) ** 1.5);
  const crvHead = (t) => (t < a.down + 1.2 ? .45 * sineIO(span(t, a.embryo + .7, a.down + 1.2)) : lerp(.45, 1, sineIO(span(t, a.ground + .3, a.ground + 1.6))));
  function curveVal(t) { return crvV(crvHead(t)); }
  const crvXY = (u) => [lerp(CRV.x0 + 20, CRV.x1, u), lerp(CRV.y0 - 10, CRV.y1, crvV(u))];
  function curveBench(ctx, t) {
    const inn = span(t, a.embryo + .2, a.embryo + 1.1), out = smooth(span(t, a.nature + .1, a.nature + 1.0));
    if (inn <= 0 || out >= 1) { crvPos.a = 0; return; }
    const k = expoOut(inn), A = 1 - out;
    ctx.save(); ctx.globalAlpha *= A; ctx.translate(0, 200 * expoIn(out));
    ctx.strokeStyle = rgba(P.blue2, .9); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(CRV.x0, lerp(CRV.y0, CRV.y1, k)); ctx.lineTo(CRV.x0, CRV.y0); ctx.lineTo(lerp(CRV.x0, CRV.x1, k), CRV.y0); ctx.stroke();
    const hu = crvHead(t), pts = []; for (let i = 0; i <= 60; i++) pts.push(crvXY(i / 60));
    if (hu > 0) trailSpan(ctx, pts, 0, hu, { w: 4.5, spark: hu < .999 && hu !== .45, a: 1 });
    ctx.restore();
    const mn = crvXY(.45);
    crvPos.a = A; crvPos.min = [mn[0], mn[1] + 200 * expoIn(out)]; crvPos.hu = hu; crvPos.k = k;
  }
  const crvPos = { a: 0, min: [0, 0] };
  // ---- 2.08 → c03 the reset button; the proteins seat in its sockets
  const btnY = TT - .72 * BTN.r;
  const SOCK = (i, R, depth) => { const an = -Math.PI / 2 + i * Math.PI / 2 + .6; return [BTN.x + Math.cos(an) * R * .55, btnY - depth + Math.sin(an) * R * .2]; };
  function pressAt(t) {
    let p = bump(t, a.pressed + .1, .55) + .6 * bump(t, a.factory - .05, .45);
    p = Math.max(p, smooth(span(t, a.hold, a.hold + .3)) * (1 - smooth(span(t, a.harder - .2, a.harder + .3))));
    for (const k of [0, 1, 2]) p = Math.max(p, .9 * bump(t, a.letting + k * .55, .34));
    return clamp(p);
  }
  // pulses of light the button sends to the cell (factory settings, the held press, the three short presses)
  const PULSES = (t) => { const out = [a.factory + .05]; for (let q = a.hold + .2; q < a.harder - .2; q += .45) out.push(q); for (const k of [0, 1, 2]) out.push(a.letting + .1 + k * .55); return out; };
  let PUL = null;
  function buttonBench(ctx, t) {
    const grow = span(t, a.button - .45, a.button + .55), sink = smooth(span(t, a.howhard - .5, a.howhard + 1.3));
    // the curve's minimum drops to the tabletop and swells into the button
    const mv = sineIO(span(t, a.nature + .2, a.button - .35));
    if (mv > 0 && grow < .3 && crvPos.min) {
      const [mx, my] = crvPos.min, x = lerp(mx, BTN.x, mv), y = lerp(my, btnY, mv) - 120 * Math.sin(Math.PI * mv);
      halo(ctx, x, y, 60, .8, P.halo0, P.core0); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(x, y, 7, 0, 6.29); ctx.fill();
    }
    if (grow <= 0 || sink >= 1) return;
    // seated proteins: 0 … 4 (four seat on "four proteins", one lifts out on "three of the four")
    const seat = [0, 1, 2, 3].reduce((s, i) => s + clamp(span(t, a.four - .15 + i * .32, a.four + .2 + i * .32)), 0) - clamp(span(t, a.three - .3, a.three + .1));
    const press = pressAt(t), lit = .7 + .3 * bump(t, a.fourP + .1, 1.6) + .2 * press;
    ctx.save(); ctx.translate(0, 220 * expoIn(sink));
    const r = F.button(ctx, t, BTN.x, btnY, BTN.r, { u: grow, press, lit: clamp(lit), slots: seat });
    // the press: a ring of light runs out over the tabletop
    for (const tp of [a.pressed + .25]) { const q = span(t, tp, tp + 1.5); if (q > 0 && q < 1) { ctx.strokeStyle = rgba(P.core1, .85 * (1 - q)); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(BTN.x, TT - 4, lerp(BTN.r * 1.4, BTN.r * 5, expoOut(q)), lerp(BTN.r * .5, BTN.r * 1.4, expoOut(q)), 0, 0, 6.29); ctx.stroke(); } }
    ctx.restore();
    // proteins drifting down from under the lamp into the sockets, and the one that lifts out again
    const depth = BTN.r * .28 * (1 - .8 * press);
    for (let i = 0; i < 4; i++) {
      const ta = a.four - .15 + i * .32, fl = span(t, ta - 1.9, ta);
      if (fl > 0 && fl < 1) { const [sx, sy] = SOCK(i, BTN.r, depth), e = sineIO(fl), x = lerp((i - 1.5) * 70, sx, e) + 30 * Math.sin(e * 3 + i), y = lerp(-590, sy - BTN.r * .9, e); F.protein(ctx, t, x, y, BTN.r * .13 * lerp(.7, 1, e), i, { lit: 1, a: clamp(fl * 4) }); }
    }
    const lf = span(t, a.three - .3, a.three + 1.6);
    if (lf > 0) { const [sx, sy] = SOCK(3, BTN.r, depth), e = sineIO(lf); F.protein(ctx, t, lerp(sx, sx + 90, e), lerp(sy - BTN.r * .1, -560, e), BTN.r * .13, 3, { lit: 1 - .5 * e, a: 1 - smooth(span(lf, .7, 1)) }); }
    btnPos.top = [BTN.x, btnY - depth]; btnPos.a = expoOut(grow) * (1 - sink);
    // 3.08 sparks from the sockets rise into the night (they start the switchboard)
    const sp = span(t, a.other - 1.1, a.other + .2);
    if (sp > 0 && sp < 1) for (let i = 0; i < 4; i++) { const [sx, sy] = SOCK(i, BTN.r, depth), q = clamp(sp * 1.3 - i * .1); if (q <= 0 || q >= 1) continue; const y = lerp(sy, -2600, expoIn(q)); halo(ctx, sx, y, 40, .9, P.halo0, P.core0); }
  }
  const btnPos = { top: [BTN.x, btnY], a: 0 };
  // ---- c03 the cell beside the button (and its later lives: the mouse eye, the blood cell, the dish)
  function cellState(t) {
    const u = span(t, a.four + .6, a.four + 1.5);
    let shape = .6 * smooth(span(t, a.factory + .25, a.factory + 1.0));
    shape = lerp(shape, 1, smooth(span(t, a.forgets - .1, a.forgets + .8)));
    const back = smooth(span(t, a.harder - .3, a.harder + 1.2));
    shape = lerp(shape, 0, back);
    const lump = smooth(span(t, a.tumors - .4, a.tumors + .9)) * (1 - back);
    let warm = .3 * smooth(span(t, a.factory + .25, a.factory + 1.0)) * (1 - smooth(span(t, a.forgets - .1, a.forgets + .8)));
    for (const k of [0, 1, 2]) warm += .3 * smooth(span(t, a.letting + .15 + k * .55, a.letting + .45 + k * .55));
    const over = smooth(span(t, a.more + .1, a.more + .8)) * (1 - smooth(span(t, a.youth - .1, a.youth + .6)));
    warm = clamp(warm) * (1 - .6 * over);
    const cool = Math.max(smooth(span(t, a.tumors - .4, a.tumors + .9)) * (1 - back), .35 * over);
    return { u, shape, lump, warm, cool };
  }
  function cellBench(ctx, t) {
    const st = cellState(t); if (st.u <= 0 || t > a.c1s) return;   // the lab things leave with the sky phase
    const toEye = span(t, a.miceEyes + .1, a.miceEyes + .9), eyeOut = span(t, a.oct + .1, a.oct + .9);
    const bloodIn = span(t, a.oct + .6, a.oct + 1.4);
    const dsh = sineIO(span(t, a.dish - .3, a.dish + .6));
    const cy = lerp(CELL.y, TT - 150, dsh);
    // the cell (gone into the eye from "Mice whose eyes" to "this October"; back as a blood cell → nerve stem cell)
    if (toEye < 1) B.cell(ctx, t, CELL.x, CELL.y, CELL.r, { ...st, u: st.u, a: 1 - smooth(toEye) });
    if (bloodIn > 0) {
      const nerve = smooth(span(t, a.turned - .1, a.turned + 1.2));
      B.cell(ctx, t, CELL.x, cy, CELL.r * lerp(.62, .85, nerve) * lerp(1, .6, dsh), { u: bloodIn, shape: 1, blood: 1 - nerve, nerve, warm: .25 + .55 * smooth(span(t, a.under - .2, a.under + .8)) });
    }
    // the mouse eye (3.05): the cell's nucleus becomes the iris; the bar of sharpness beside it
    if (toEye > 0 && eyeOut < 1) {
      const op = smooth(span(toEye, .3, 1)) * (1 - smooth(eyeOut));
      E.halo(ctx, CELL.x, CELL.y, 140, .25 * op, P.halo0, P.core1);
      F.eye(ctx, t, CELL.x, CELL.y, 150 * lerp(.5, 1, expoOut(toEye)) * lerp(1, .6, eyeOut), { open: op, young: .3 * smooth(span(t, a.half, a.half + 1.2)), look: [0, 0] });
    }
    const bu = span(t, a.glauc - .5, a.glauc + .3), bo = smooth(span(t, a.oct - .2, a.oct + .6));
    if (bu > 0 && bo < 1) { ctx.save(); ctx.globalAlpha *= 1 - bo; ctx.translate(0, 120 * expoIn(bo));
      sharpPos.r = B.sharpBar(ctx, t, CELL.x + 175, TT - 110, 230, { u: bu, lost: .3, v: lerp(.3, .63, sineIO(span(t, a.half - .1, a.half + 1.1))) }); ctx.restore(); sharpPos.a = expoOut(bu) * (1 - bo); }
    else sharpPos.a = 0;
    // 3.07 the dish rises round the cell on "dishes"
    const du = span(t, a.dish - .4, a.dish + .4); if (du > 0) B.dish(ctx, t, CELL.x, TT - 134, 120, { u: du });
    if (du > 0) { /* redraw the cell over the dish's back rim */ const nerve = 1; B.cell(ctx, t, CELL.x, cy, CELL.r * .85 * lerp(1, .6, dsh), { u: 1, shape: 1, nerve, warm: .8, a: smooth(clamp(du * 3)) }); }
  }
  const sharpPos = { a: 0, r: null };
  // ---- 3.04 the press gauge (left of the button)
  function gaugeBench(ctx, t) {
    const u = span(t, a.window - .2, a.window + .7), out = smooth(span(t, a.three - .8, a.three - .1)); if (u <= 0 || out >= 1) { gPos.a = 0; return; }
    let v = lerp(.06, .5, sineIO(span(t, a.window + .2, a.window + 1.0)));
    v = lerp(v, .9, sineIO(span(t, a.more + .1, a.more + .8))); v = lerp(v, .5, sineIO(span(t, a.youth - .1, a.youth + .7)));
    const lit = v > .38 && v < .62 ? 1 - Math.abs(v - .5) / .12 * .3 : 0;
    ctx.save(); ctx.globalAlpha *= 1 - out; ctx.translate(0, 100 * expoIn(out));
    gPos.r = B.pressGauge(ctx, t, -620, -505, 330, { u, v, lit }); ctx.restore(); gPos.a = expoOut(u) * (1 - out); gPos.v = v;
  }
  const gPos = { a: 0 };
  // ---- 3.07 the mouse on the table
  function tableStuff(ctx, t) {
    const mu = span(t, a.miceE - .3, a.miceE + .9), out = smooth(span(t, a.fourP, a.fourP + 1.2)); if (mu <= 0 || out >= 1) return;
    const x = lerp(-640, -430, sineIO(mu)), st = mu < 1 ? mu * 22 : null;
    ctx.save(); ctx.translate(0, 160 * expoIn(out));
    B.mouse(ctx, t, x, TT - 2, 120, { dir: 1, step: st, a: clamp(mu * 4) }); ctx.restore();
  }
  // ---- 4.10 the eye rises out of the tabletop again (plateEye's state at the end)
  function eyeRise(ctx, c, t) {
    const r_ = span(t, a.inside - .5, a.inside + 1.6); if (r_ <= 0) return;
    const fam = 0;
    F.tableEye(ctx, c, t, { rise: r_, open: smooth(span(t, a.inside + .5, a.inside + 1.8)), young: S.EYE_STATE.young * smooth(span(t, a.inside + .9, a.inside + 2.4)), look: [0, 0] });
    return fam;
  }

  // ================================================================================================ the switchboard (world plate in the night)
  const boardN = (t) => {
    if (t < a.other - .3) return 0;
    return clamp(.55 * sineIO(span(t, a.other - .3, a.search - .2)) + .45 * sineIO(span(t, a.search - .2, a.ai + .2)));
  };
  const foldF = (t) => sineIO(span(t, a.thats + .3, a.c1s - .35));   // long and soft: the board is the whole frame
  const sweepX = (t) => {
    if (t < a.ai) return null;
    const v1 = 11200 / 5.6, ta = a.ai, td = a.doubled;
    const d = t < td ? (t - ta) * v1 : (td - ta) * v1 + (t - td) * v1 * (1 + smooth(span(t, td, td + .8))) - 0;
    return -5600 + (d % 11200);
  };
  function boardBox(c, t) {
    const b = B.boardBox(boardN(t)), p0 = wp(c, b.x0, GY - BOARD_H + b.y0, ZS), p1 = wp(c, b.x1, GY - BOARD_H + b.y1, ZS);
    return p0 && p1 ? { x: p0[0], y: p0[1], w: p1[0] - p0[0], h: p1[1] - p0[1], k: p0[2] } : null;
  }
  function boardWorld(ctx, c, t) {
    const n = boardN(t), f = foldF(t); if (n <= 0 || f >= 1 || t > a.c1s + .5) return;
    const bx = boardBox(c, t); if (!bx) return;
    // the plate in screen space: the world projection (affine for a plate facing the camera), folding toward CLIP_RECT
    const R = F.CLIP_RECT, r = { x: lerp(bx.x, R.x, f), y: lerp(bx.y, R.y, f), w: lerp(bx.w, R.w, f), h: lerp(bx.h, R.h, f) };
    const b = B.boardBox(n), sx = r.w / (b.x1 - b.x0), sy = r.h / (b.y1 - b.y0);
    ctx.save(); ctx.setTransform(sx, 0, 0, sy, r.x - b.x0 * sx, r.y - b.y0 * sy);
    const g = smooth(span(t, a.over - .1, a.over + 1.1)), sw = sweepX(t);
    B.board(ctx, t, { n, plate: 1, sweep: sw, gold: g, cand: .25 * smooth(span(t, a.ai, a.ai + 2)), a: 1, sockA: 1 - smooth(span(f, .05, .45)) });
    ctx.restore();
    if (f > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const p = new Path2D(); p.roundRect(r.x, r.y, r.w, r.h, 8 + 20 * (1 - f)); ctx.strokeStyle = rgba(P.halo1, .55 + .3 * bump(f, .6, .4)); ctx.lineWidth = 3; ctx.stroke(p); ctx.restore(); }
  }

  // ================================================================================================ screen overlays
  const SP = (c, x, y) => wp(c, x, GY + y, LAMP.Z);
  function overlays(ctx, c, t) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    lifeOverlay(ctx, c, t);
    eggFlight(ctx, c, t);
    benchLabels(ctx, c, t);
    longWay(ctx, c, t);
    skyText(ctx, c, t);
    clipPart(ctx, c, t);
    after(ctx, c, t);
    F.qcard(ctx, t, [[-100, S.Q_YOU], [a.where - .25, 'WHERE IS THE BUTTON?'], [a.four - .1, null]]);
    ctx.restore();
  }
  const L = (ctx, t, s, p, dx, dy, u, o = {}) => { if (!p || u <= 0) return; srcLine(ctx, t, s, p[0] + dx, p[1] + dy, u, { size: o.size ?? 24, col: o.col ?? P.cream, align: o.align, weight: o.weight }); };
  const io = (t, i0, i1, o0, o1) => rise(span(t, i0, i1)) * (1 - expoIn(span(t, o0, o1)));
  function benchLabels(ctx, c, t) {
    // 2.05 the nested lives: labels right of the figure, the counter further right
    const nOut = a.sci + .2;
    const [ex, ey] = nestedPos.egg, [fx2, fy2] = nestedPos.fetus;
    L(ctx, t, 'YOUR GRANDMOTHER', SP(c, GRAN.x + 70, TT - GRAN.h + 30), 0, 0, io(t, a.before + 1.0, a.before + 1.7, nOut, nOut + .5), { size: 24 });
    L(ctx, t, 'YOUR MOTHER, NOT YET BORN', SP(c, fx2 + 70, fy2 + 8), 0, 0, io(t, a.before + .4, a.before + 1.1, nOut, nOut + .5), { size: 24 });
    const eu = io(t, a.before + .1, a.before + .8, nOut, nOut + .5);
    L(ctx, t, 'THE EGG: YOU', SP(c, ex + 70, ey + 40), 0, 0, eu, { size: 24, col: P.halo0 });
    // leader lines from the labels to their things
    const lead = (p, q, u) => { if (!p || !q || u <= .05) return; ctx.strokeStyle = rgba(P.halo2, .55 * u); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(lerp(p[0], q[0], expoOut(u)), lerp(p[1], q[1], expoOut(u))); ctx.stroke(); };
    lead(SP(c, ex + 62, ey + 32), SP(c, ex + 10, ey + 4), eu);
    // the counter: decades old (31: the EU's average age of a mother at birth), snaps to 0 on "started at zero"
    const cu = io(t, a.decades - .4, a.decades + .3, nOut + .2, nOut + .8), cp0 = SP(c, 150, -520), cp = cp0 && [cp0[0] + 170, cp0[1] + 80];
    if (cp && cu > 0) {
      const run = sineIO(span(t, a.decades - .2, a.decades + .9)), snap = t >= a.zeroW, n = snap ? 0 : Math.round(31 * run);
      const fl = snap ? bump(t, a.zeroW, .5) : 0;
      srcLine(ctx, t, 'THE EGG WAS', cp[0], cp[1] - 104, cu, { size: 24, col: P.cream });
      maskLine(ctx, [[String(n), snap ? 1 : 0]], cp[0], cp[1], 120, cu, { serif: true, col: snap ? P.halo0 : P.cream, glow: true });
      if (fl > 0) halo(ctx, cp[0] + 30, cp[1] - 40, 160, .55 * fl, P.halo0, P.core0);
      srcLine(ctx, t, snap ? 'YEARS OLD · STARTED AT ZERO' : 'YEARS OLD', cp[0], cp[1] + 44, cu, { size: 24, col: snap ? P.halo0 : P.cream });
      srcLine(ctx, t, 'IF YOUR MOTHER WAS 31', cp[0], cp[1] + 82, clamp(cu * 1.3 - .3), { size: 19 });
      srcLine(ctx, t, 'EU AVERAGE AT BIRTH', cp[0], cp[1] + 108, clamp(cu * 1.3 - .3), { size: 19 });
      srcLine(ctx, t, 'EUROSTAT 2023', cp[0], cp[1] + 134, clamp(cu * 1.3 - .3), { size: 19 });
    }
    // 2.06 EPIGENETIC CLOCK (right of the dial)
    if (dnaPos.a > 0 && dnaPos.dial) {
      const [dx, dy, dr] = dnaPos.dial, p = SP(c, dx + dr * 1.35, dy - dr * .15);
      const u = io(t, a.sci + 1.4, a.sci + 2.1, a.embryo - .2, a.embryo + .3);
      L(ctx, t, 'EPIGENETIC CLOCK', p, 0, 0, u, { size: 28 });
      L(ctx, t, 'READS THE MARKS ON THE DNA', p, 0, 34, clamp(u * 1.2 - .1) * rise(span(t, a.marks, a.marks + .6)), { size: 21, col: P.halo2 });
      const u2 = io(t, a.embryo + .3, a.embryo + 1.0, a.nature, a.nature + .5);
      L(ctx, t, 'CELL AGE', p, -10, -6, u2, { size: 22, col: P.halo2 });
    }
    // 2.07 the curve: labels, GROUND ZERO at the minimum, the source
    if (crvPos.a > 0) {
      const u = crvPos.k * crvPos.a;
      L(ctx, t, 'EARLY EMBRYO →', SP(c, CRV.x1, CRV.y0 - 14), 0, 0, u, { size: 22, col: P.halo2, align: 'right' });
      const gz = rise(span(t, a.ground - .05, a.ground + .6)) * crvPos.a, mn = SP(c, crvPos.min[0], crvPos.min[1]);
      if (mn && crvPos.hu >= .44) { const fl = bump(t, a.ground, .9); halo(ctx, mn[0], mn[1], 70 + 50 * fl, .7 + .3 * fl, P.halo0, P.core0); }
      L(ctx, t, 'GROUND ZERO', mn, 14, -62, gz, { size: 30, col: P.halo0, align: 'left' });
      L(ctx, t, 'KEREPESI ET AL. · SCIENCE ADVANCES 2021', SP(c, CRV.x1, CRV.y0 + 40), 0, 0, gz, { size: 19, col: P.halo2, align: 'right' });
    }
    // 2.08 NATURE'S RESET BUTTON
    const bp = SP(c, BTN.x + 140, btnY - 190);
    L(ctx, t, "NATURE'S RESET BUTTON", bp, 0, 0, io(t, a.button, a.button + .7, a.where - .4, a.where + .2), { size: 26 });
    L(ctx, t, 'PRESSED BEFORE YOU WERE BORN', bp, 0, 34, io(t, a.beforeBorn, a.beforeBorn + .7, a.where - .4, a.where + .2), { size: 21, col: P.halo2 });
    // 3.01–3.03 labels at the cell
    const cl = SP(c, CELL.x, CELL.y - CELL.r - 70);
    L(ctx, t, 'FOUR PROTEINS', SP(c, BTN.x - 140, btnY - 160), 0, 0, io(t, a.four + .1, a.four + .8, a.hold, a.hold + .5), { size: 26, align: 'right' });
    L(ctx, t, 'FACTORY SETTINGS', cl, 0, 0, io(t, a.factory + .2, a.factory + .9, a.forgets, a.forgets + .5), { size: 26, align: 'center' });
    L(ctx, t, 'YAMANAKA 2006', cl, 0, 30, io(t, a.factory + .4, a.factory + 1.1, a.forgets, a.forgets + .5), { size: 20, col: P.halo2, align: 'center' });
    L(ctx, t, 'HELD DOWN', SP(c, BTN.x - 140, btnY - 160), 0, 0, io(t, a.hold + .3, a.hold + 1.0, a.harder - .3, a.harder + .2), { size: 26, align: 'right' });
    L(ctx, t, 'TUMORS · IN MICE', cl, 0, 0, io(t, a.tumors, a.tumors + .7, a.harder - .3, a.harder + .2), { size: 26, align: 'center', col: COOL.core });
    L(ctx, t, 'ABAD ET AL. · NATURE 2013', cl, 0, 30, io(t, a.tumors + .2, a.tumors + .9, a.harder - .3, a.harder + .2), { size: 20, col: P.halo2, align: 'center' });
    L(ctx, t, 'SHORT PRESSES', SP(c, BTN.x - 140, btnY - 160), 0, 0, io(t, a.letting, a.letting + .7, a.window - .3, a.window + .2), { size: 26, align: 'right' });
    L(ctx, t, 'SAME CELL, YOUNGER', cl, 0, 0, io(t, a.letting + 1.0, a.letting + 1.7, a.window + 3.0, a.window + 3.5), { size: 24, align: 'center', col: P.halo0 });
    L(ctx, t, 'OCAMPO ET AL. · CELL 2016', cl, 0, 30, io(t, a.letting + 1.2, a.letting + 1.9, a.window + 3.0, a.window + 3.5), { size: 20, col: P.halo2, align: 'center' });
    // 3.04 the gauge's three words
    if (gPos.a > 0 && gPos.r) {
      const g = gPos.r, p0 = SP(c, g.x0, -505 + 46), p1 = SP(c, g.x1, -505 + 46), pw = SP(c, g.win[0], -505 - 46);
      L(ctx, t, 'TOO LITTLE', p0, 0, 0, gPos.a, { size: 20, col: P.halo2 });
      L(ctx, t, 'TOO MUCH', p1, 0, 0, gPos.a, { size: 20, col: P.halo2, align: 'right' });
      L(ctx, t, 'THE WINDOW', pw, 0, -14, gPos.a * rise(span(t, a.window + .6, a.window + 1.2)), { size: 24, col: P.halo0, align: 'center' });
    }
    // 3.05 three of four, the mouse eye, the sharpness
    L(ctx, t, '3 OF 4', SP(c, BTN.x - 140, btnY - 160), 0, 0, io(t, a.three + .1, a.three + .8, a.oct - .3, a.oct + .2), { size: 30, align: 'right', col: P.halo0 });
    const me = SP(c, CELL.x, CELL.y - 110);
    L(ctx, t, 'A MOUSE EYE · GLAUCOMA', me, 0, 0, io(t, a.glauc - .2, a.glauc + .5, a.oct - .3, a.oct + .2), { size: 24, align: 'center' });
    if (sharpPos.a > 0 && sharpPos.r) {
      const s = sharpPos.r, top = SP(c, s.top[0] + 30, s.top[1]), lo = SP(c, s.lost[0] + 30, s.lost[1]);
      L(ctx, t, 'SHARPNESS', top, 0, -26, sharpPos.a, { size: 20, col: P.halo2 });
      L(ctx, t, 'BEFORE', top, 0, 8, sharpPos.a, { size: 20, col: P.cream });
      L(ctx, t, 'AFTER DAMAGE', lo, 0, 26, sharpPos.a, { size: 20, col: COOL.mid });
      const hu = io(t, a.half + .3, a.half + 1.0, a.oct - .3, a.oct + .2);
      L(ctx, t, '≈ HALF THE LOST', SP(c, s.now[0] + 30, s.now[1]), 0, -6, hu * sharpPos.a, { size: 24, col: P.halo0 });
      L(ctx, t, 'SHARPNESS BACK', SP(c, s.now[0] + 30, s.now[1]), 0, 24, hu * sharpPos.a, { size: 24, col: P.halo0 });
      L(ctx, t, 'IN MICE · LU ET AL. · NATURE 2020', lo, 0, 54, hu * sharpPos.a, { size: 19, col: P.halo2 });
    }
    // 3.06 Bonn: the blood cells of an 80-year-old → nerve stem cells that read under 20
    if (bonnPos.a > 0 && bonnPos.dial) {
      const [dx, dy, dr] = bonnPos.dial, p = SP(c, dx + dr * 1.4, dy);
      const e = io(t, a.eighty - .1, a.eighty + .6, a.dishes - .3, a.dishes + .2), u20 = io(t, a.under + .2, a.under + .8, a.dishes - .3, a.dishes + .2);
      L(ctx, t, 'DONOR AGED 80', p, 0, -12, e * (1 - clamp(u20 * 4)), { size: 24 });
      if (u20 > 0) { maskLine(ctx, [['UNDER 20', 0]], p[0], p[1] + 10, 54, u20, { serif: true, col: P.halo0, glow: true }); }
      const cc = SP(c, CELL.x, CELL.y - CELL.r - 66);
      L(ctx, t, 'BLOOD CELLS', cc, 0, 0, io(t, a.blood - .1, a.blood + .5, a.turned + .2, a.turned + .6), { size: 24, align: 'center' });
      L(ctx, t, 'NERVE STEM CELLS', cc, 0, 0, io(t, a.turned + .6, a.turned + 1.3, a.dishes - .3, a.dishes + .2), { size: 24, align: 'center', col: P.halo0 });
      const sp = SP(c, CELL.x + 70, CELL.y + CELL.r + 96);
      L(ctx, t, 'IN A DISH · ONE DONOR', sp, 0, -26, io(t, a.under + .4, a.under + 1.1, a.dishes + .3, a.dishes + .8), { size: 20, align: 'center', col: P.cream });
      L(ctx, t, 'BERG / BRÜSTLE · AGING CELL 2026', sp, 0, 4, io(t, a.under + .5, a.under + 1.2, a.dishes + .3, a.dishes + .8), { size: 19, align: 'center' });
    }
  }
  // 3.07 the long way: a line of light from the dish down your lane to you
  function longWay(ctx, c, t) {
    const u = span(t, a.from - .2, a.longway - .2), out = smooth(span(t, a.fourP + .4, a.fourP + 1.4)); if (u <= 0 || out >= 1) return;
    // one soft arc through the air: from the dish over the table edge down to your feet
    const P0 = [CELL.x, GY + TT - 140, LAMP.Z], P1 = [LX - 160, GY + TT - 1000, TABLE.z1 + 1400], P2 = [LX + 60, GY - 20, S.STOPS.you - 120];
    const sp = []; for (let k = 0; k <= 40; k++) { const f = k / 40, g = 1 - f, q = [0, 1, 2].map(i => g * g * P0[i] + 2 * g * f * P1[i] + f * f * P2[i]), p = wp(c, q[0], q[1], q[2]); if (p) sp.push([p[0], p[1]]); }
    if (sp.length < 2) return;
    trailSpan(ctx, sp, 0, sineIO(u), { w: 3, spark: u < 1, a: 1 - out });
    const mid = wp(c, LX + 330, GY - 300, S.STOPS.you);
    if (mid) srcLine(ctx, t, 'A LONG WAY', mid[0], Math.min(mid[1], 820), io(t, a.longway - .1, a.longway + .6, a.fourP + .2, a.fourP + .8), { size: 30, col: P.cream });
  }
  // backing plate for text in the night (the qcard's material)
  function plate(ctx, x, y, w, h, u) { if (u <= 0) return; ctx.save(); ctx.beginPath(); ctx.roundRect(x, y + (1 - expoOut(u)) * 20, w, h, 6); ctx.globalAlpha *= clamp(u * 2); ctx.fillStyle = rgba(P.night1, .9); ctx.fill(); ctx.strokeStyle = rgba(P.halo1, .5); ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = P.halo0; ctx.fillRect(x, y + (1 - expoOut(u)) * 20, 5, h); ctx.restore(); }
  // 3.08–4.04 words on the switchboard
  function skyText(ctx, c, t) {
    const q1 = io(t, a.other - .1, a.other + .6, a.search + .3, a.search + .8), q2 = io(t, a.howhard - .1, a.howhard + .6, a.search + .3, a.search + .8);
    plate(ctx, 120, 230, 330, 70, q1); srcLine(ctx, t, 'WHICH MIX?', 150, 278, q1, { size: 30, col: P.cream });
    plate(ctx, 1470, 230, 330, 70, q2); srcLine(ctx, t, 'HOW HARD?', 1500, 278, q2, { size: 30, col: P.cream });
    // 4.02 the counter + the gold ones (top right)
    const cu = io(t, a.thousand - .4, a.thousand + .3, a.update + .2, a.update + .7);
    plate(ctx, 1310, 96, 520, 330, cu);
    if (cu > 0) {
      const n = Math.round(3000 * sineIO(span(t, a.thousand - .2, a.thousand + 1.0)) / 10) * 10, plus = t > a.thousand + 1.0;
      maskLine(ctx, [[n.toLocaleString('en-US') + (plus ? '+' : ''), 0]], 1345, 200, 84, cu, { serif: true, col: P.cream, glow: true });
      srcLine(ctx, t, 'MIXES TESTED', 1345, 246, cu, { size: 26, col: P.cream });
      const gu = cu * rise(span(t, a.liver - .2, a.liver + .5));
      srcLine(ctx, t, '20+ MADE OLD LIVER CELLS', 1345, 300, gu, { size: 24, col: P.halo0 });
      srcLine(ctx, t, 'ACT YOUNGER', 1345, 332, gu, { size: 24, col: P.halo0 });
      srcLine(ctx, t, 'COMPANY CLAIM', 1345, 390, cu * rise(span(t, a.liver + .4, a.liver + 1.0)), { size: 22, col: COOL.mid });
    }
    // 4.03 ×2 (top left)
    const du = io(t, a.doubled - .1, a.doubled + .6, a.update + .2, a.update + .7);
    plate(ctx, 96, 96, 420, 230, du);
    if (du > 0) {
      maskLine(ctx, [['×2', 1]], 130, 200, 84, du, { serif: true, col: P.halo0, glow: true });
      srcLine(ctx, t, 'DISCOVERY RATE', 130, 246, du, { size: 26, col: P.cream });
      srcLine(ctx, t, 'COMPANY CLAIM', 130, 296, du * rise(span(t, a.doubled + .5, a.doubled + 1.1)), { size: 22, col: COOL.mid });
    }
    // 4.04 the source, bottom left (above the subtitle zone)
    const su = io(t, a.thats + .1, a.thats + .8, a.c1s - 1.1, a.c1s - .7);
    srcLine(ctx, t, 'NEWLIMIT · COMPANY UPDATE · JULY 2026', 96, 800, su, { size: 22, col: P.halo2 });
  }
  // 4.04–4.05 the footage frame (CLIP C1)
  function clipPart(ctx, c, t) {
    if (t < a.c1s - .7 || t > a.c1e + .02) return;
    const u = smooth(span(t, a.c1s - .7, a.c1s));   // the screen fills in while the board finishes folding
    const al = smooth(span(t, a.c1s - .7, a.c1s - .25));   // the kit screen is opaque: let it settle over the folding board
    ctx.save(); ctx.globalAlpha *= al;
    F.clipScreen(ctx, t, { id: 'C1', u, on: al, label: rise(span(t, a.c1s - .2, a.c1s + .6)), name: 'Jacob Kimmel', role: 'CO-FOUNDER · NEWLIMIT', date: 'COMPANY UPDATE · JULY 2026' });
    ctx.restore();
    const lu = rise(span(t, a.c1s + .4, a.c1s + 1.2));
    srcLine(ctx, t, 'COMPANY CLAIM · ITS OWN FIGURE', 116, 606, lu, { size: 21, col: COOL.mid });
  }
  // 4.06–4.09 after the clip: the frame folds into four proteins, the 50× bar, the stamps, the age dial, the estimate
  const STRIP = { x: 470, y: 150, w: 980, h: 300 };
  function after(ctx, c, t) {
    if (t < a.c1e) return;
    const R = F.CLIP_RECT, f = sineIO(span(t, a.c1e + .05, a.c1e + 1.4));
    const toG = quartIO(span(t, a.clocks - .4, a.clocks + .6));
    const G2 = { x: 560, y: 150, w: 800, h: 560 };
    const tgt = { x: lerp(STRIP.x, G2.x, toG), y: lerp(STRIP.y, G2.y, toG), w: lerp(STRIP.w, G2.w, toG), h: lerp(STRIP.h, G2.h, toG) };
    const sink = expoIn(span(t, a.estimate + .9, a.estimate + 1.8));
    const r = { x: lerp(R.x, tgt.x, f), y: lerp(R.y, tgt.y, f) + sink * 900, w: lerp(R.w, tgt.w, f), h: lerp(R.h, tgt.h, f) };
    if (sink >= 1) return;
    const p = new Path2D(); p.roundRect(r.x, r.y, r.w, r.h, 10);
    halo(ctx, r.x + r.w / 2, r.y + r.h / 2, Math.max(r.w, r.h) * .7, .18, P.blue0, P.halo1);
    ctx.fillStyle = E.rad(ctx, r.x + r.w * .5, r.y + r.h * .4, r.w * .75, [[0, '#121c44'], [1, '#05060f']]); ctx.fill(p);
    ctx.strokeStyle = rgba(P.halo1, .55); ctx.lineWidth = 3; ctx.stroke(p);
    // the four proteins (two redrawn in cool light on "two of the four")
    const pu = span(t, a.c1e + .6, a.c1e + 1.6), pout = smooth(span(t, a.clocks - .5, a.clocks + .1));
    if (pu > 0 && pout < 1) {
      for (let i = 0; i < 4; i++) {
        const q = expoOut(clamp(pu * 2 - i * .3)), x = r.x + r.w * (.17 + i * .22), y = r.y + r.h * .45 + 30 * expoIn(pout), rr = 62 * q;
        if (q <= 0) continue;
        const re = (i === 1 || i === 2) ? smooth(span(t, a.two + .1 + (i - 1) * .3, a.two + 1.0 + (i - 1) * .3)) : 0;
        F.protein(ctx, t, x, y, rr, i, { lit: 1, a: (1 - pout) * (1 - re) });
        if (re > 0) { F.protein(ctx, t, x, y, rr * 1.05, i, { lit: 1, cool: 1, redraw: re, a: 1 - pout }); halo(ctx, x, y, rr * 2, .3 * re * (1 - pout), COOL.edge, COOL.core); }
        const nm = ['OCT4', 'SOX2', 'KLF4', 'MYC'][i];
        srcLine(ctx, t, nm, x, r.y + r.h - 34, q * (1 - pout), { size: 20, col: re > .5 ? COOL.mid : P.halo2, align: 'center' });
      }
      const ru = io(t, a.two + .6, a.two + 1.3, a.clocks - .5, a.clocks);
      srcLine(ctx, t, '2 OF 4 REDESIGNED BY A.I.', r.x + r.w / 2, r.y - 22, ru, { size: 26, col: COOL.core, align: 'center' });
    }
    // 1× vs 50× (in cells), the source, the stamps
    const bu = io(t, a.fifty - .5, a.fifty + .2, a.clocks - .5, a.clocks);
    if (bu > 0) {
      const y0 = 560, x0 = 700, L50 = 760, g = sineIO(span(t, a.fifty - .2, a.fifty + 1.0));
      srcLine(ctx, t, 'ORIGINAL', x0 - 24, y0 + 10, bu, { size: 21, col: P.halo2, align: 'right' });
      srcLine(ctx, t, 'REDESIGNED', x0 - 24, y0 + 70, bu, { size: 21, col: COOL.mid, align: 'right' });
      ctx.save(); ctx.globalAlpha *= clamp(bu * 2);
      ctx.fillStyle = P.halo1; ctx.fillRect(x0, y0 - 12, L50 / 50, 26);
      ctx.fillStyle = E.lin(ctx, x0, 0, x0 + L50, 0, [[0, COOL.edge], [1, COOL.core]]); ctx.fillRect(x0, y0 + 48, L50 * g, 26);
      halo(ctx, x0 + L50 * g, y0 + 61, 60, .5 * bu, COOL.mid, COOL.core); ctx.restore();
      srcLine(ctx, t, '1×', x0 + L50 / 50 + 14, y0 + 10, bu, { size: 24, col: P.cream });
      if (g > .2) maskLine(ctx, [['50×', 0]], x0 + L50 * g + 18, y0 + 82, 56, bu * rise(span(t, a.fifty, a.fifty + .5)), { serif: true, col: COOL.core, glow: true });
      srcLine(ctx, t, 'STRONGER SIGNS OF A RESET · IN CELLS', x0, y0 + 136, bu * rise(span(t, a.fifty + .4, a.fifty + 1.0)), { size: 22, col: P.cream });
      srcLine(ctx, t, 'OPENAI / RETRO BIOSCIENCES · BLOG 2025', x0, y0 + 170, bu * rise(span(t, a.fifty + .6, a.fifty + 1.2)), { size: 19, col: P.halo2 });
    }
    F.stamp(ctx, t, 'COMPANY CLAIM', 1450, 735, { t0: a.companies + .1, size: 34, rot: -.07, ink: P.cream, out: a.clocks - .5 });
    F.stamp(ctx, t, 'NOT PUBLISHED', 1490, 812, { t0: a.hasnt + .3, size: 34, rot: .05, ink: P.cream, out: a.clocks - .5 });
    // 4.08–4.09 the age dial again: a cool light reads its marks; then the needle gets its wobble band
    const gu = span(t, a.clocks + .1, a.clocks + 1.1);
    if (gu > 0) {
      const sw = span(t, a.clocks + .9, a.ml + .3), read = lerp(lerp(45, 45, 1), 31, sineIO(span(t, a.ifOne + .3, a.ifOne + 1.2)));
      B.dnaGauge(ctx, t, r.x + r.w / 2, r.y + r.h * .7, 640, { u: gu, marks: span(t, a.clocks + .5, a.clocks + 1.2), read, dial: span(t, a.clocks + .5, a.clocks + 1.3), sweep: sw > 0 && sw < 1 ? lerp(-.1, 1.1, sw) : null, wobble: smooth(span(t, a.estimate - .1, a.estimate + .7)) });
      srcLine(ctx, t, 'AGE CLOCKS = MACHINE LEARNING', r.x + r.w / 2, r.y + 56, rise(span(t, a.ml - .1, a.ml + .6)), { size: 30, col: COOL.core, align: 'center' });
      srcLine(ctx, t, 'HORVATH · GENOME BIOLOGY 2013', r.x + r.w / 2, r.y + 92, rise(span(t, a.ml + .2, a.ml + .9)), { size: 20, col: P.halo2, align: 'center' });
      const eu = rise(span(t, a.estimate, a.estimate + .6));
      srcLine(ctx, t, 'AN ESTIMATE', r.x + r.w * .5 + 150, r.y + r.h * .7 - 150, eu, { size: 32, col: P.halo0 });
      srcLine(ctx, t, 'NOT PROOF', r.x + r.w * .5 + 150, r.y + r.h * .7 - 112, eu * rise(span(t, a.estimate + .5, a.estimate + 1.0)), { size: 24, col: P.cream });
    }
  }
  return frame;
}
