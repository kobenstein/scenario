// c01 · Hook + the clock · 0 → T.G('Aging looks like') · built by the lead (quality reference for B1–B3).
// Plan: docs/shots.md 1.01–1.14 (source tools/shots20.py) · world/rules: docs/MOTION.md · kit: lib/f20_kit.mjs · seams: lib/f20_seams.mjs.
// ONE entry, ONE world (THE TRACK UNDER THE CLOCK), one continuous camera. The hook is a kitchen table at night (four generations,
// one lamp, a dim wall clock behind them). "It's a race": the lamp is pulled up, the clock rises as a sun over a track that runs out
// behind the family; they stand up and walk to the start line. The clock is then read like a diagram (camera cranes up), the family
// walks the lanes toward "that day", the needle falls, the finish line moves away, the push wedge grows, and the camera comes down
// behind you: the chunk ends on plateYou for its last SEAM_HALF seconds.
//
// | ID    | anchor (word)                         | picture (one idea)                                              | 1–2 moves                 | camera            |
// |-------|---------------------------------------|-----------------------------------------------------------------|---------------------------|-------------------|
// | 1.01  | You could be part · grow old          | four generations at a table under one lamp, a dim clock behind  | lamp sway · needle tick   | slow push         |
// | 1.02  | Gray hair · Reading glasses · Stairs  | the grandparent: hair glints, glasses ring, stairs drawn slowly | the light line            | truck + push left |
// | 1.03  | That's the deal                       | four identical bent shadows rise on the clock face              | shadows rise              | pull back         |
// | 1.04  | this year · eye · young again         | a drop forms in the lamp; the eye rises from the table; it falls| drop · eye                | push to the table |
// | 1.05  | one small step · suddenly real        | the eye blinks and lies down, the drop stays on the table       | eye sinks                 | pull back         |
// | 1.06  | grandparents? parents? You? kids?     | each one lights on their word; card WHO GETS THERE IN TIME?     | one glow per word         | breathing push    |
// | 1.07★ | birthday · It's a race                | years struck; the lamp goes up, the clock rises as a sun, the   | lamp · sunrise · walk     | rise + pull back  |
// |       |                                       | lanes run out, the family walks to the start line               |                           |                   |
// | 1.08  | country that does best · Like clockwork| the clock as a gauge: record line → 3 months, MEASURED; tick   | the line · the spark      | crane up          |
// | 1.09  | twelve months · escape velocity       | ghost needle to 12, two counters, the threshold; ghost falls    | ghost · counters          | breathing push    |
// | 1.10  | on that day · You may be in it        | the finish line glides close; the family walks the lanes        | finish · walkers          | crane down        |
// | 1.11  | slipped · less than two months        | the needle falls 3 → 1.7, MEASURED 2004–2024                    | needle                    | slow push         |
// | 1.12  | moves further away                    | the finish line slides away up the track                        | finish                    | hold              |
// | 1.13  | has to push · isn't human · three uses| the push wedge (hope, not a measurement), cool share, 3 symbols | wedge · symbols           | fly over family   |
// | 1.14  | you have to know · Why … at all?      | down the track behind you; card WHY DO BODIES AGE? → plateYou   | descent                   | descend           |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f20_kit.mjs';
import * as S from '../lib/f20_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, cam3, camAt, camDrift, halo } = E;
const { FAMILY, SEAT, START, LAMP, TABLE, CLOCK, camFor, stand, bump, rise, maskLine, srcLine, trailSpan } = F;

export const PRINT = F.PRINT20;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.could = G('You could be part'); a.old = G('grow old'); a.think = G('Think about');
  a.gray = G('Gray hair'); a.glasses = G('Reading glasses'); a.stairs = G('Stairs'); a.longerE = GE('longer', a.stairs);
  a.deal = G("That's the deal"); a.year = G('But this year'); a.never = G('never been done'); a.put = G('They put');
  a.eye = G("living person's eye"); a.built = G('built to make'); a.young = G('young again');
  a.step = G("It's one small step"); a.real = G('suddenly real'); a.ifw = G('If this works'); a.who = G('who gets there', a.ifw);
  a.gp = G('Your grandparents?', a.ifw); a.pa = G('Your parents?', a.ifw); a.you = G('You?', a.pa); a.kids = G('Your kids?', a.pa);
  a.answer = G('The answer'); a.bday = G('birthday', a.answer); a.race = G("It's a race");
  a.every = G('Every year, medical'); a.adds = G('adds a little', a.every);
  a.country = G('Take the country'); a.hundred = G('For a hundred'); a.three = G('three months', a.hundred); a.clock = G('Like clockwork');
  a.now = G('Now imagine'); a.twelve = G('twelve months', a.now); a.full = G('A full year'); a.day = G('From that day');
  a.out = G('running out of time'); a.call = G('Researchers call'); a.esc = G('escape velocity', a.call); a.nobody = G('Nobody has reached');
  a.whoever = G('Whoever'); a.onday = G('on that day', a.whoever); a.born = G('already be born'); a.inIt = G('You may be in it');
  a.problem = G("But there's a problem"); a.slipped = G('slipped', a.problem); a.today = G('Today it grows'); a.two = G('two months', a.today);
  a.isnt = G("So it isn't"); a.further = G('moves further away'); a.forit = G('For it to'); a.push = G('has to push', a.forit);
  a.notHuman = G("isn't human", a.push); a.exp = G('pick experiments'); a.mol = G('design molecules', a.exp); a.read = G('read how old', a.exp);
  a.butPush = G('But to push'); a.know = G('you have to know', a.butPush); a.why = G('Why does a body');
  a.end = R.b;
  return [{ t: 0, draw: scene(a), print: PRINT }];
};

// ===================================================================================================================== cameras
const HOOK = (s = 1.1, y = -250) => camFor(0, y, SEAT.Z, s, 960, 640);                     // the table: eye level of the sitters
const GRAND = (s) => camFor(-690, -300, SEAT.Z, s, 900, 600);                           // the grandparent (left), stairs beside him
const EYEC = (s) => camFor(0, -390, LAMP.Z, s, 960, 500);                               // the eye on the table (plateEye = s 1.8)
const RACE_A = cam3({ x: 0, y: -130, z: 900 });                                          // behind the table: track, family, the clock
const D1 = (s) => camFor(0, 0, CLOCK.Z, s, 960, 870);                                   // the gauge as a diagram (R ≈ 560 px, pivot at 870)
const RACE_B = cam3({ x: 0, y: -20, z: 1800 });                                          // the lanes: the family walks toward the finish line
const D2 = cam3({ x: 0, y: -2270, z: 4500 });                                            // over the family toward the gauge (R ≈ 600 px)

// the four bent shadows of 1.03 (on the clock face, one behind each sitter; identical: everyone gets old)
const SHADOW_X = [-.58, -.2, .2, .58];
// the record line of 1.08 (record life expectancy, women, best country each year: almost a straight line, Oeppen & Vaupel 2002)
const REC = (() => { const r = E.prng(2002); return Array.from({ length: 33 }, (_, i) => [i / 32, i / 32 + (r() - .5) * .035 * (i % 32 ? 1 : 0)]); })();
const CH = { x0: 130, x1: 520, y0: 230, y1: 450 };                                       // the chart's frame (screen, top-left of D1)
const CNT = { x: 1400, y: 130 };                                                         // the counters (screen, top-right of D1)
const STAIRS = (() => { const pts = [], n = 5, x0 = -1250, w = 64, h = 52; let y = -150;   // 1.02: five steps of a line of light (stand units at SEAT.Z)
  for (let k = 0; k < n; k++) { const x = x0 + k * w; pts.push([x, y]); y -= h; pts.push([x, y]); } pts.push([x0 + n * w, y]); return pts; })();

function scene(a) {
  const tPlate = a.end - S.SEAM_HALF;
  const K = [
    [0, HOOK(.98)],
    [a.think - .2, HOOK(1.02)],                              // 1.01 slow push
    [a.gray + .5, GRAND(1.42)],                             // 1.02 truck + push to the grandparent
    [a.longerE + .5, GRAND(1.48)],
    [a.deal + 1.4, HOOK(1.02)],                              // 1.03 pull back: the four shadows on the clock face
    [a.year + .2, HOOK(1.05)],
    [a.put + 2.2, EYEC(1.78)],                              // 1.04 push down to the tabletop, the eye rises
    [a.step + .1, EYEC(1.84)],
    [a.real + .9, HOOK(.99)],                         // 1.05 pull back to the table
    [a.race - .15, HOOK(1.04)],                       // 1.06 breathing push while the four light up
    [a.race + 3.4, RACE_A, 'q'],                            // 1.07 ★ rise and pull back: the track and the clock
    [a.adds + .5, cam3({ ...RACE_A, y: -150, z: 980 })],
    [a.country + .5, D1(.0622), 'q'],                       // 1.08 crane up: the gauge as a diagram
    [a.whoever - .9, D1(.0645)],
    [a.onday + .5, RACE_B, 'q'],                            // 1.10 crane down to the lanes
    [a.forit - .4, cam3({ ...RACE_B, y: -40, z: 2150 })],   // 1.11–1.12 slow push along the track
    [a.push + .6, D2, 'q'],                                 // 1.13 fly over the family toward the gauge
    [a.butPush - .1, cam3({ ...D2, y: -2300, z: 4800 })],
    [tPlate, S.YOU_CAM, 'q'],                               // 1.14 down the track behind you → plateYou
  ];
  for (let i = 1; i < K.length; i++) K[i][0] = Math.max(K[i][0], K[i - 1][0] + .4);
  const camOf = (t) => {
    const amt = 1 - smooth(span(t, tPlate - 1.4, tPlate));                     // the drift settles into the plate
    return camDrift(camAt(t, K, CLOCK.Z), t, amt);
  };

  // --------------------------------------------------------------------------------------------- the family (seats → start → lanes)
  const SEATDIR = [1, 1, -1, -1];
  const famAt = (t) => FAMILY.map((f, i) => {
    const up = smooth(span(t, a.race + .05 + i * .12, a.race + .95 + i * .12)), seat = 1 - up;
    // to the start line (behind the chairs): they turn and walk away from us
    const w0 = a.race + .75 + i * .14, w1 = w0 + (f.who === 'kid' ? 3.2 : 3.8);
    const u1 = span(t, w0, w1);
    // down the lanes toward the finish line (1.10): the kid furthest, you to the line, the elders shorter and slower
    const stop = S.STOPS[f.who], d = { grand: [.5, 5.2], parent: [.35, 5.0], you: [.0, 6.4], kid: [.2, 6.6] }[f.who];
    const v0 = a.whoever + .3 + d[0], u2 = span(t, v0, v0 + d[1]);
    const Z = u2 > 0 ? lerp(START.Z, stop, sineIO(u2)) : lerp(SEAT.Z, START.Z, sineIO(u1));
    const moving = (u1 > 0 && u1 < 1) || (u2 > 0 && u2 < 1), stride = f.who === 'kid' ? .052 : f.who === 'grand' ? .03 : .036;
    const back = up > .55;
    // looks: at the eye (1.04–1.05), up on their own word (1.06)
    const word = [a.gp, a.pa, a.you, a.kids][i];
    const look = seat > .5 ? .3 * smooth(span(t, a.eye - .4, a.eye + .6)) * (1 - smooth(span(t, a.step + 1, a.step + 2))) + .25 * bump(t, word - .1, 1.6) : 0;
    let glow = smooth(span(t, word - .15, word + .3)) * (1 - .65 * smooth(span(t, a.answer, a.answer + 1.4)));
    glow *= 1 - smooth(span(t, a.race + .4, a.race + 1.6));
    if (f.who === 'you') glow = Math.max(glow, smooth(span(t, a.inIt - .1, a.inIt + .6)) * (1 - smooth(span(t, a.further, a.further + 2.4))));
    if (f.who === 'grand') glow = Math.max(glow, .55 * bump(t, a.gray - .1, 1.2));            // the gray hair catches the light
    return { who: f.who, X: f.X, Z, seat, dir: back ? 1 : SEATDIR[i], light: back ? 1 : (i < 2 ? 1 : -1), view: back ? 'back' : undefined,
      walk: moving ? (Z - SEAT.Z) * stride : undefined, look, glow,
      glasses: f.who === 'grand' ? smooth(span(t, a.glasses - .1, a.glasses + .5)) * (1 - smooth(span(t, a.race, a.race + .5))) : 0 };
  });

  // --------------------------------------------------------------------------------------------- the clock (dial options per frame)
  const dialAt = (t) => {
    const lit = .12 + .88 * smooth(span(t, a.race - .1, a.race + 2.2));
    // the needle: 3 (measured 1840–2000) → falls to 1.7 on "slipped" (heavy: a fall, a short bounce, settle)
    const fu = span(t, a.slipped - .15, a.slipped + 1.4), fk = fu < .3 ? (fu / .3) ** 2 : 1 - .07 * Math.sin((fu - .3) / .7 * Math.PI * 2) * (1 - (fu - .3) / .7);
    const needle = 3 - 1.3 * (fu > 0 ? fk : 0);
    // the ghost: 3 → 12 on "twelve months", back to 3 on "Nobody has reached it"
    const gu = quartIO(span(t, a.twelve - .3, a.twelve + 1.1)), gb = expoIn(span(t, a.nobody + .1, a.nobody + 1.1));
    const ghost = gu > 0 && gb < 1 ? lerp(3, lerp(3, 12, gu), 1) * (1 - gb) + 3 * gb : null;
    const exD1 = smooth(span(t, a.country - .6, a.country + .4)) * (1 - smooth(span(t, a.onday - .9, a.onday - .2)));
    const exD2 = smooth(span(t, a.push - .4, a.push + .4)) * (1 - smooth(span(t, a.butPush + .4, a.butPush + 1.2)));
    const sinkEnd = 1 - smooth(span(t, a.butPush + .3, a.butPush + 1.3));
    const marks = [];
    const m3 = smooth(span(t, a.three + .7, a.three + 1.4)) * sinkEnd;
    if (m3 > 0) marks.push({ v: 3, text: '1840–2000', sub: '≈ 3 MONTHS', src: 'MEASURED · OEPPEN & VAUPEL', u: m3 });
    const m17 = smooth(span(t, a.today - .1, a.today + .7)) * sinkEnd;
    if (m17 > 0) marks.push({ v: 1.7, text: '2004–2024', sub: '≈ 1.7 MONTHS', src: 'MEASURED · RECORD, WOMEN', u: m17 });
    const pu = span(t, a.push - .1, a.push + 1.8);
    const sym = (t0) => smooth(span(t, t0 - .1, t0 + .7)) * sinkEnd;
    return {
      lit, ticks: 1, num: 1, needle, ghost,
      tick: (tt) => span(tt, a.clock - .02, a.clock + .05) * (1 - smooth(span(tt, a.clock + .12, a.clock + .7))) + .35 * span(tt, a.old - .02, a.old + .05) * (1 - smooth(span(tt, a.old + .1, a.old + .6))),
      title: Math.max(exD1, exD2), foot: Math.max(exD1, exD2, smooth(span(t, a.problem, a.problem + .8)) * (1 - smooth(span(t, a.butPush + .4, a.butPush + 1.2)))),
      thr: expoOut(span(t, a.twelve + .7, a.twelve + 1.7)), thrLabel: smooth(span(t, a.esc - .3, a.esc + .5)) * (1 - smooth(span(t, a.forit - .3, a.forit + .4))),
      thrSub: smooth(span(t, a.nobody - .1, a.nobody + .6)) * (1 - smooth(span(t, a.forit - .3, a.forit + .4))),
      thrSrc: 'TERM AFTER AUBREY DE GREY\nPLOS BIOLOGY 2004', thrSrcU: smooth(span(t, a.esc + .2, a.esc + 1)) * (1 - smooth(span(t, a.onday - 1.2, a.onday - .6))),
      marks,
      push: pu > 0 ? { v0: 1.7, v1: 7, u: pu, cool: .6 * smooth(span(t, a.notHuman - .1, a.notHuman + 1.2)), label: smooth(span(t, a.push + .5, a.push + 1.2)) * (1 - smooth(span(t, a.butPush - .2, a.butPush + .5))) } : null,
      symbols: pu > 0 ? [['grid', sym(a.exp)], ['molecule', sym(a.mol)], ['gauge', sym(a.read)]] : null,
    };
  };
  const trackAt = (t) => {
    const lit = smooth(span(t, a.race, a.race + 1.6)), reach = span(t, a.race + .1, a.race + 2.6);
    const fin0 = span(t, a.onday - 1.1, a.onday + 1.1), fin1 = span(t, a.further - .2, a.further + 2.8);
    const fin = fin1 > 0 ? lerp(S.STOPS.you, S.FIN_FAR, expoOut(fin1)) : lerp(CLOCK.Z - 400, S.STOPS.you, expoOut(fin0));
    return { lit, reach, fin, finA: smooth(span(t, a.onday - 1.1, a.onday - .5)) * (1 - .3 * smooth(fin1)) };
  };

  return (ctx, t) => {
    const c = camOf(t);
    const up = expoIn(span(t, a.race - .2, a.race + 1.3));
    const fam = famAt(t), dial = dialAt(t), tr = trackAt(t);
    const nearTable = c.z < TABLE.z0 - 100;
    F.scene20(ctx, c, t, {
      dial, track: tr.lit > 0 || tr.finA > 0 ? tr : null, fam, chairs: 0,
      table: nearTable ? { years: 1, light: 1 - .55 * up, yearDim: (f) => smooth(span(t, a.bday - .05 + FAMILY.indexOf(f) * .09, a.bday + .5 + FAMILY.indexOf(f) * .09)) } : null,
      lamp: up < 1 && nearTable ? { on: 1, up } : null,
      onTable: (cx, cc, tt) => onTable(cx, cc, tt),
      extra: (cx, cc, tt, layer, d) => {
        if (layer === 'far' && d) { shadows(cx, tt, d); }
        if (layer === 'near') { stairs(cx, cc, tt); }
      },
    });
    // the drop forming in the lamp and falling into the eye (drawn over the lamp)
    if (nearTable) dropFall(ctx, c, t);
    overlays(ctx, t, c);
    if (t >= tPlate) S.plateYou(ctx, t);
  };

  // ---------------------------------------------------------------------------------------------- 1.03 the four bent shadows
  function shadows(ctx, t, d) {
    const u = sineIO(span(t, a.deal - .2, a.deal + 1.6)), out = sineIO(span(t, a.year - .4, a.year + .8));
    if (u <= 0 || out >= 1) return;
    const { cx, cy, R } = d;
    ctx.save(); ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.arc(cx, cy, R * .985, Math.PI, 2 * Math.PI); ctx.closePath(); ctx.clip();
    SHADOW_X.forEach((sx, i) => {
      const k = clamp(u * 1.25 - i * .08) - out, h = R * .62;
      if (k <= 0) return;
      ctx.save(); ctx.translate(0, (1 - sineIO(k)) * h * 1.05);
      ctx.globalAlpha *= .8;
      E.person(ctx, cx + sx * R, cy, h, { dir: i < 2 ? 1 : -1, lean: .42, long: true, look: -.6, armR: [.35, .55], armL: [.12, .3], light: 0, rim: mixHex(P.night1, P.ind1, .5) });
      ctx.restore();
    });
    ctx.restore();
  }
  // ---------------------------------------------------------------------------------------------- 1.02 the stairs (a line of light drawn slower and slower)
  function stairs(ctx, c, t) {
    const p = span(t, a.stairs - .15, a.longerE + .9); if (p <= 0) return;
    const u = 1 - (1 - p) ** 2.4, u0 = smooth(span(t, a.deal - .2, a.deal + .9)); if (u0 >= 1) return;
    stand(ctx, c, 0, SEAT.Z, () => {
      const head = trailSpan(ctx, STAIRS, u0, u, { w: 5, spark: u0 <= 0, a: .95 });
      if (head && u0 <= 0) halo(ctx, head[0], head[1], 40, .5, P.halo0, P.core0);
    });
  }
  // ---------------------------------------------------------------------------------------------- 1.04–1.05 the eye on the table, the drop
  function eyeState(t) {
    const rise_ = span(t, a.eye - 1.3, a.eye + 1.2), lie = sineIO(span(t, a.step + .9, a.step + 2.6));
    return { rise: rise_, open: smooth(span(t, a.eye - .1, a.eye + .8)), lie, blink: bump(t, a.step + .25, .36),
      young: smooth(span(t, a.young - .1, a.young + 1.6)), ripple: span(t, a.built + .42, a.built + 1.7), look: [0, -.15 * smooth(span(t, a.built - .6, a.built + .3))] };
  }
  function onTable(ctx, c, t) {
    const e = eyeState(t);
    if (e.rise > 0 && e.lie < 1) F.tableEye(ctx, c, t, e);
    // the drop that stays on the table once the eye has gone (the carrier to c05)
    const st = smooth(span(t, a.step + 2.2, a.step + 2.8));
    if (st > 0) stand(ctx, c, 0, LAMP.Z, () => { F.drop(ctx, 0, -TABLE.h - 12, 9, { a: st }); halo(ctx, 0, -TABLE.h - 6, 90, .35 * st, P.halo0, P.core1); });
  }
  function dropFall(ctx, c, t) {
    const g = smooth(span(t, a.year + .4, a.put + .4)), fall = span(t, a.built - .05, a.built + .42);
    if (g <= 0 || fall >= 1) return;
    stand(ctx, c, 0, LAMP.Z, () => {
      const y0 = -LAMP.h + 24, y = lerp(y0, F.EYE_Y, expoIn(fall));
      F.drop(ctx, 0, y + 4 * Math.sin(t * 2.1) * (1 - fall), 8 + 6 * g, { stretch: .2 * g + .6 * expoIn(fall) });
    });
  }

  // ---------------------------------------------------------------------------------------------- screen-space explainers
  function overlays(ctx, t, c) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    // 1.04 FIRST TIME IN A PERSON + source (right of the eye)
    const lu = rise(span(t, a.eye + .5, a.eye + 1.3)), lo = expoIn(span(t, a.step + .5, a.step + 1.1));
    if (lu > 0 && lo < 1) {
      const k = lu * (1 - lo);
      maskLine(ctx, [['FIRST TIME', 0]], 1510, 420, 40, k, { serif: false, col: P.cream, glow: true, weight: 600 });
      maskLine(ctx, [['IN A PERSON', 0]], 1510, 470, 40, clamp(k * 1.2 - .1), { serif: false, col: P.cream, glow: true, weight: 600 });
      srcLine(ctx, t, 'ER-100 · PHASE 1 TRIAL', 1510, 525, clamp(k * 1.3 - .2), { size: 21 });
      srcLine(ctx, t, 'CLINICALTRIALS.GOV · NCT07290244', 1510, 556, clamp(k * 1.3 - .3), { size: 21 });
    }
    // 1.06–1.07 / 1.14 the question card
    F.qcard(ctx, t, [[a.who - .25, 'WHO GETS THERE IN TIME?'], [a.adds + .2, null]]);
    F.qcard(ctx, t, [[a.why - .3, S.Q_YOU]]);
    // 1.08 the record line (top-left of D1) and the spark that carries its slope to the 3 on the rim
    chart(ctx, t, c);
    // 1.09 the two counters (top-right of D1) + the source of the term
    counters(ctx, t);
    ctx.restore();
  }
  function chart(ctx, t, c) {
    const inn = rise(span(t, a.country - .2, a.country + .8)), out = expoIn(span(t, a.three + .2, a.three + .75));
    if (inn <= 0 || out >= 1) return;
    const k = inn * (1 - out), { x0, x1, y0, y1 } = CH, dy = out * 40;
    ctx.save(); ctx.translate(0, dy);
    maskLine(ctx, [['THE COUNTRY THAT DOES BEST', 0]], x0, y0 - 70, 32, k, { serif: false, col: P.cream, glow: false, weight: 600 });
    srcLine(ctx, t, 'RECORD LIFE EXPECTANCY, WOMEN', x0, y0 - 32, clamp(k * 1.2 - .15), { size: 22 });
    // axes (drawn from the corner)
    const ax = expoOut(span(t, a.country, a.country + .9)) * (1 - out);
    ctx.strokeStyle = rgba(P.blue2, .8); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(x0, y1 - (y1 - y0) * ax); ctx.lineTo(x0, y1); ctx.lineTo(x0 + (x1 - x0) * ax, y1); ctx.stroke();
    srcLine(ctx, t, '1840', x0, y1 + 36, ax, { size: 22 }); srcLine(ctx, t, '2000', x1, y1 + 36, ax, { size: 22, align: 'right' });
    srcLine(ctx, t, '45 YEARS', x0 + 14, y1 - 14, ax, { size: 19 }); srcLine(ctx, t, '85 YEARS', x0 + 14, y0 + 20, ax, { size: 19 });
    // the line (160 years, almost straight)
    const lu = sineIO(span(t, a.hundred - .1, a.three + .2));
    const pts = REC.map(([u, v]) => [lerp(x0, x1, u), lerp(y1 - 10, y0 + 10, v)]);
    if (lu > 0) trailSpan(ctx, pts, 0, lu, { w: 5, spark: lu < 1, a: k });
    // the slope in words, under the line
    const su = rise(span(t, a.three - .15, a.three + .5)) * k;
    if (su > 0) maskLine(ctx, [['+3 MONTHS A YEAR', 0]], lerp(x0, x1, .36), lerp(y1, y0, .2) + 8, 28, su, { serif: false, col: P.halo0, glow: true, weight: 600 });
    srcLine(ctx, t, 'OEPPEN & VAUPEL · SCIENCE 2002', x0, y1 + 72, clamp(k * 1.3 - .3), { size: 19 });
    ctx.restore();
    // the spark: from the line's head along an arc into the MEASURED notch at 3 (the slope becomes the needle's value)
    const sp = span(t, a.three + .05, a.three + .75);
    if (sp > 0 && sp < 1) {
      const d = F.wp(c, 0, F.GY, CLOCK.Z); if (!d) return;
      const R = CLOCK.R * d[2], ang = F.angOf(3), tx = d[0] + Math.cos(ang) * R, ty = d[1] + Math.sin(ang) * R;
      const sx = x1, sy = y0 + 10, e = sineIO(sp), mx = (sx + tx) / 2 + 60, my = Math.min(sy, ty) - 30;
      const x = (1 - e) ** 2 * sx + 2 * (1 - e) * e * mx + e * e * tx, y = (1 - e) ** 2 * sy + 2 * (1 - e) * e * my + e * e * ty;
      halo(ctx, x, y, 50, .85, P.halo0, P.core0); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(x, y, 7, 0, 6.29); ctx.fill();
    }
  }
  function counters(ctx, t) {
    const inn = rise(span(t, a.full - .2, a.full + .7)), out = expoIn(span(t, a.onday - 1.3, a.onday - .6));
    if (inn <= 0 || out >= 1) return;
    const k = inn * (1 - out), { x, y } = CNT;
    const ticks = [a.full + .7, a.full + 1.7, a.full + 2.7, a.day + .3, a.day + 1.3, a.out + .3];
    let n = 0; for (const tk of ticks) if (t >= tk) n++;
    const last = n ? ticks[n - 1] : -9, ru = rise(span(t, last, last + .35));
    ctx.save(); ctx.translate(0, out * 40);
    srcLine(ctx, t, 'ONE EXAMPLE', x, y, k, { size: 20, col: P.halo2 });
    srcLine(ctx, t, 'THE YEAR', x, y + 48, k, { size: 24, col: P.cream });
    maskLine(ctx, [[String(2041 + n), 0]], x, y + 128, 80, n ? ru * k : k, { serif: true, col: P.cream, glow: true });
    srcLine(ctx, t, 'YEARS STILL AHEAD OF YOU', x, y + 186, clamp(k * 1.2 - .1), { size: 24, col: P.cream });
    const hold = smooth(span(t, a.out - .1, a.out + .6));
    maskLine(ctx, [['40', 0]], x, y + 268, 80, clamp(k * 1.2 - .15), { serif: true, col: mixHex(P.cream, P.halo0, hold), glow: true });
    // each passing year: −1 and +1 at the same moment (the time ahead stays the same)
    if (n > 0) { const pu = bump(t, last, .9); if (pu > 0) { srcLine(ctx, t, '−1', x + 110, y + 232, pu, { size: 28, col: COOLC }); srcLine(ctx, t, '+1', x + 110, y + 268, pu, { size: 28, col: P.halo0 }); } }
    ctx.restore();
  }
}
const COOLC = F.COOL.mid;
