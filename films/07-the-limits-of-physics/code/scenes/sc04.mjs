// Film 7 · c04 · back to Tesla, four questions, card I (03a), from the c03>c04 glass plate to the c04>c05 paper plate. Builder: c04.
// ONE continuous take in one world (the empty stage of c01 at night, a round black table in a cold spotlight on it): every accent is
// anchored to a word (T.S / T.E), never to seconds. The table, spotlight, cards and plate windows live in lib/f7_c04_table.mjs (shared
// with c05, c07–c11); the page, robots, halls and clipping in lib/f7_c04_props.mjs.
//
// | shot | VO words (anchor)                                  | image                                                                   | hero light        | camera                                  | flows on by                          | ★ / sound                |
// |------|----------------------------------------------------|-------------------------------------------------------------------------|-------------------|-----------------------------------------|--------------------------------------|--------------------------|
// | 4.01 | Which brings us back to Tesla.                     | out of the dark glass: it is the stage screen of c01 (truss, light      | the screen        | pull back from the glass 2.5 s          | take continues                       | bloom (screen on, pause  |
// |      |                                                    | towers, the night, the ridge); after "Tesla." it opens (TV line) into   |                   |                                         |                                      | after "Tesla.")          |
// |      |                                                    | SUSTAINABLE ABUNDANCE                                                    |                   |                                         |                                      |                          |
// |      | Two months before that meeting, … master plan.     | tilt down along the cold beam: a round black table on the empty stage,  | the spotlight     | tilt + crane down 3.5 s                 | continuous                           |                          |
// |      |                                                    | a printed page in the pool: MASTER PLAN PART IV · TESLA · SEPT 2025     |                   |                                         |                                      |                          |
// | 4.02 | One of its principles reads: growth is infinite. … | push onto the page: the principle set in type, masked in per phrase:     | the page          | push 2.3 s, then a slow living push      | continuous                           |                          |
// |      | … fixed with better technology.                    | "Growth is infinite." + the two following sentences (Tesla's wording)   |                   |                                         |                                      |                          |
// |      | That's exactly what physics just put on trial.     | red pencil: two strokes under "infinite." (on "trial")                  | the page          | hold                                    | continuous                           | pencil (after "trial.")  |
// | 4.03 | So let's test it. Fairly. Four questions.          | rise to the table from above; the page slides aside; four cream cards   | the pool          | rise 1.9 s, top-down                    | continuous                           | card (first landing)     |
// |      |                                                    | are dealt in from the near edge and land face up in a row (I–IV)        |                   |                                         |                                      |                          |
// | 4.04 | Question one. Where does the energy come from?     | card I lifts and turns up toward us (question readable); II–IV lie on   | card I            | glide down to a 3/4 view 1.6 s           | continuous                           |                          |
// | 4.05 | At the November meeting … pay package for Musk.    | card I settles back; the camera skims down to the lacquer: a dark floor | the pool          | descend to grazing height 2 s           | continuous                           |                          |
// |      |                                                    | to the table's horizon; on "pay package" ONE small robot rises out of it |                   |                                         |                                      |                          |
// |      |                                                    | at figure scale. Label NOV 2025 · TESLA SHAREHOLDER MEETING             |                   |                                         |                                      |                          |
// |      | One of its goals: a million robots … ten years.    | the grid multiplies from that robot outward to the dark horizon; the     | rims in the pool  | pull back + rise 4 s                    | continuous                           | multiply (pause before   |
// |      |                                                    | counter runs to 1,000,000 · TESLA PAY PACKAGE GOAL · WITHIN 10 YEARS     |                   |                                         |                                      | "One of its goals")      |
// | 4.06 | A million robots, plus the data centers behind them| long low halls rise out of the far table behind the field (vents, fans) | the halls         | slow rise                               | continuous                           |                          |
// |      | That's a lot more electricity.                     | THE CURVE: the amber appetite line climbs out of the halls into the dark | the curve         | tilt up with it                         | continuous                           | swell (pause before)     |
// |      | And the plan puts no number on where … comes from. | the camera follows the line's FOOT back across the table, looking for    | the line's tip    | pan down/left along the foot 2 s, push  | continuous                           | pencil (pause after      |
// |      |                                                    | the source: it ends at the plan page, at nothing; red pencil rings ? GW  |                   |                                         |                                      | "from.")                 |
// | 4.07 | One Bloomberg columnist … a plan at all.           | a torn newspaper clipping slides onto the page: "It wasn't really a plan | the clipping      | top-down over the page                  | continuous                           |                          |
// |      |                                                    | at all." BLOOMBERG OPINION · SEPT 2025 · A COLUMNIST, PARAPHRASED        |                   |                                         |                                      |                          |
// |      | A huge promise, with no power bill attached.       | glide to card I; on "bill" the red stamp NO POWER BILL hits it           | card I            | glide 1.5 s, then                       | PUSH INTO CARD I's paper window      | stamp (contact on "bill")|
// | 4.08 | (handoff)                                          | the camera pushes into the blank paper right of the numeral until the   | paper             | push 1.2 s (log height)                 | = the c04>c05 PAPER PLATE            | whoosh_airy              |
// |      |                                                    | window fills the frame: it is the paper plate (exact, lib windowCam)     |                   |                                         |                                      |                          |
// ★ none in this chunk (the shot list has none; c06 carries the film's ★). Ambience: atmo/nightsky under 4.01, then atmo/hall (quiet room tone).
import { W, H, rgba, clamp, lin, mix, sm } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { F7, f7Prepare, skyWarm, curve, ease } from '../lib/f7_kit.mjs';
import { TB, CARDS, ROW, SPOT, tcam, camKeys, stage, tableTop, beam, tablePaperCard, paperCardPrepare, windowCam, apply, mulA, depthSpread, meshImage } from '../lib/f7_c04_table.mjs';
import { PAGE, pagePrepare, planPage, pageImage, pageRing, robotField, robotsPrepare, hall, clipping, CLIP, label } from '../lib/f7_c04_props.mjs';

const PI2 = Math.PI / 2;
const bump = (t, a, b, c, d) => sm(lin(a, b, t)) * (1 - sm(lin(c, d, t)));

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c04', T);
  const S = (ph, n) => T.S('03a', ph, n), E = (ph, n) => T.E('03a', ph, n);
  const A = {
    tesla: S('Tesla'), teslaE: E('Tesla'), two: S('Two months'), planE: E('master plan'), one: S('One of its principles'), growth: S('growth is infinite'), infE: E('growth is infinite'),
    growth2: S('Growth in one'), anotherE: E('in another'), shortages: S('shortages'), techE: E('better technology'), physics: S('physics'), trial: S('trial'), trialE: E('trial'),
    so: S('So let'), test: S('test it'), testE: E('test it'), fairly: S('Fairly'), four: S('Four questions'), fourE: E('Four questions'),
    q1: S('Question one'), where: S('Where does'), fromE: E('energy come from'), at: S('At the November'), approved: S('approved'), pkg: S('pay package'), muskE: E('for Musk'),
    goals: S('One of its goals'), million: S('a million robots'), delivered: S('delivered'), yearsE: E('ten years'), aMillion: S('a million robots', 1), data: S('data centers'), themE: E('behind them'),
    thats: S("That's a lot"), elec: S('electricity'), elecE: E('electricity'), and: S('And the plan'), number: S('no number'), comesE: E('power comes from'),
    bloom: S('Bloomberg'), wasnt: S("wasn't really"), allE: E('plan at all'), huge: S('A huge'), bill: S('power bill'), billW: S('bill'), attachedE: E('attached'),
  };
  await f7Prepare(); await pagePrepare(); await robotsPrepare();
  await paperCardPrepare(CARDS.map((c, i) => ({ num: c.num, q: c.q, stamp: i ? null : c.stamp })), HO.a);
  await skyWarm(-.42, [[420, -50]]);
  const HB = HI.b, HA = HO.a, tEnd = HA - 1 / 30 - .002;

  // ---------------------------------------------------------------- object timelines
  const spot = { ...SPOT, x: -6, z: 2, r: 52 };
  const page0 = { X: 0, Z: 5, rot: .04 }, page1 = { X: -30, Z: 14, rot: -.1 };
  const pageAt = (t) => { const u = ease.io(lin(A.test - .1, A.testE + .35, t)); return { X: mix(page0.X, page1.X, u), Z: mix(page0.Z, page1.Z, u), rot: mix(page0.rot, page1.rot, u) }; };
  const pageM = (cam, p, Y = .02) => { const M = cam.flatM(p.X, p.Z, p.rot, .1, 105, Y); return M ? mulA(M, [1, 0, 0, 1, -PAGE.w / 2, -PAGE.h / 2]) : null; };
  const pagePt = (p, u, v) => { const c0 = Math.cos(p.rot), s0 = Math.sin(p.rot), du = (u - PAGE.w / 2) / 10, dv = (v - PAGE.h / 2) / 10; return [p.X + du * c0 + dv * s0, p.Z + du * s0 - dv * c0]; };
  // the deal: four cards fly in from the near edge and land face up in a row
  const land = [A.four + .5, A.four + .7, A.four + .93, A.fourE + .2];
  const dealt = (i, t) => {
    const r = ROW[i], u = ease.out(lin(land[i] - .44, land[i], t)); if (u <= 0) return null;
    const settle = .03 * Math.sin(Math.PI * clamp((t - land[i]) / .22)) * (1 - lin(land[i], land[i] + .3, t));
    return { X: mix(r.X * .3 - 4, r.X, u), Z: mix(-56, r.Z, u), rot: mix(-.7 + i * .15, r.rot, ease.out(lin(land[i] - .44, land[i] + .05, t))) + settle, Y: 5.5 * Math.sin(Math.PI * u) * (1 - u * .4) };
  };
  // card I: lifts and turns up toward us for "Question one", settles back, takes the stamp
  const c1 = (t) => {
    const d = dealt(0, t); if (!d) return null;
    const up = .53 * ease.io(lin(A.q1 - .05, A.q1 + 1.0, t)) * (1 - ease.io(lin(A.at + .25, A.at + 1.15, t)));
    const Y = d.Y + 5.2 * ease.io(lin(A.q1 - .05, A.q1 + 1.0, t)) * (1 - ease.io(lin(A.at + .25, A.at + 1.2, t)));
    return { ...d, Y, up };
  };
  const stampU = (t) => clamp((t - (A.billW - .17)) / .25);
  // the robots, the halls, the curve
  const robotT0 = A.pkg - .15;
  const HALLS = [{ X: -11, Z: 79, L: 17, D: 7, h: 5 }, { X: 9, Z: 81, L: 18, D: 7.5, h: 5.6 }, { X: 29, Z: 78.5, L: 16, D: 7, h: 4.8 }];
  const hallRise = (i, t) => lin(A.data - .1 + i * .13, A.data + .75 + i * .13, t);
  const RISE = (() => { const o = [], n = 70; for (let i = 0; i <= n; i++) { const s = i / n, e = (Math.exp(4.1 * s) - 1) / (Math.exp(4.1) - 1); o.push([9 + 26 * Math.pow(s, 1.25), 5.6 + 175 * e, 81 + 10 * s]); } return o; })();
  const FOOT = (() => {
    const p = pagePt(page1, PAGE.w + 4, PAGE.mark[1] - 4), P = [[9, .3, 77], [-2, .3, 73.5], [-10, .3, 60], [-14, .3, 44], [-15, .3, 28], [-16.4, .3, 14], [-18.1, .3, 5.2], [p[0], .3, p[1]]];
    const out = []; for (let i = 0; i < P.length - 1; i++) { const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)]; for (let j = 0; j < 12; j++) { const q = j / 12, q2 = q * q, q3 = q2 * q; out.push([0, 1, 2].map((d) => .5 * (2 * p1[d] + (-p0[d] + p2[d]) * q + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * q2 + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * q3))); } }
    out.push(P[P.length - 1]); return out;
  })();
  const riseU = (t) => ease.out(lin(A.thats - .25, A.elecE - .1, t));
  const footU = (t) => ease.io(lin(A.and - .05, A.comesE - .35, t));
  // the clipping slides in from the left onto the page
  const clipAt = (t) => { const u = ease.out(lin(A.bloom - .25, A.bloom + .45, t)); if (u <= 0) return null; return { X: mix(-4, -16.5, u), Z: mix(46, 21.5, u), rot: mix(-.5, .06, u) }; };

  // ---------------------------------------------------------------- the camera ([x, y, z, pitch, yaw], cm / rad)
  const p0 = pageAt(0), pc = pagePt(p0, 105, 88.5);
  const WC = windowCam(ROW[0]);
  const K = [
    [HB, [0, 330, 600 - TB.f * 640 / 1920, 0, 0]],
    [A.two + .2, [0, 150, -700, -.035, 0]],
    [A.two + 2.1, [-1, 120, -175, -.6, 0]],
    [A.planE - .2, [-.6, 58, 1.2, -1.42, -.01]],
    [A.growth - .2, [pc[0], 21.6, pc[1], -PI2, -p0.rot]],
    [A.trialE + .1, [pc[0] + .1, 20.4, pc[1] - .05, -PI2, -p0.rot]],
    [A.fairly + .2, [-3.5, 100, -4.5, -PI2, 0]],
    [A.fourE + .5, [-4, 96, -5.5, -PI2, 0]],
    [A.where + .15, [-10.2, 23.8, -33, -.73, .17]],
    [A.at + .35, [-10.4, 23.2, -32.4, -.72, .165]],
    [A.at + 1.5, [-5.5, 12, -14, -.36, .1]],
    [A.approved + .25, [-.5, 4.4, -3.5, -.1, .05]],
    [A.goals - .1, [2.4, 2.6, 3.6, -.04, .025]],
    [A.million + .2, [4.4, 6.2, -4.5, -.1, .04]],
    [A.yearsE + .2, [7, 10.5, -16, -.2, .06]],
    [A.themE + .1, [9, 12.5, -4, -.13, .08]],
    [A.elecE + .05, [9.5, 14.5, -6, .04, .12]],
    [A.comesE - .45, [-5, 25, -31, -.41, -.3]],
    [A.comesE + .3, [-15.5, 21, -15, -.86, -.2]],
    [A.wasnt - .3, [-17.2, 21.6, 21.2, -PI2, -.06]],
    [A.huge + .1, [-17.3, 21.2, 21.3, -PI2, -.06]],
    [A.billW - .3, [ROW[0].X, 33, ROW[0].Z + .4, -PI2, -ROW[0].rot]],
  ];
  const tP = A.billW + .12;   // the push into card I's paper window starts after the stamp's contact
  const camAt = (t) => {
    if (t < tP) return camKeys(t, K);
    const a = camKeys(tP, K), u = ease.sine(lin(tP, tEnd, t)),   // sine, not quartic: an even push (peak speed 1.6× mean)
      hu = Math.exp(mix(Math.log(a[1] - .03), Math.log(WC.y - .03), u)) + .03;
    const lu = 1 - (hu - WC.y) / (a[1] - WC.y);   // the lateral move follows the height, so the window grows in place
    return [mix(a[0], WC.x, lu), hu, mix(a[2], WC.z, lu), -PI2, mix(a[4], WC.yaw, lu)];
  };

  // ---------------------------------------------------------------- the one take
  function world(ctx, t) {
    const c = camAt(Math.min(t, tEnd)), cam = tcam({ x: c[0], y: c[1], z: c[2], pitch: c[3], yaw: c[4] });
    const words = ease.out(lin(A.teslaE + .05, A.teslaE + .5, t));
    stage(ctx, t, cam, { words });
    tableTop(ctx, t, cam, { spot });
    // flat things on the table: the page (+ its red pencil), the clipping, cards II–IV
    const pg = pageAt(t), pAt = (u, v) => { const [X, Z] = pagePt(pg, u * PAGE.w, v * PAGE.h); return [X, .02, Z]; }, pds = depthSpread(cam, pAt);
    const ring = lin(A.comesE - .02, A.comesE + .55, t);
    if (!pds.off && pds.ratio > .86) {
      const PM = pageM(cam, pg);
      if (PM) planPage(ctx, t, PM, { reveal: [ease.out(lin(A.growth - .05, A.infE - .1, t)), lin(A.growth2 - .05, A.anotherE - .9, t), lin(A.shortages - .05, A.techE - .4, t)], pencil: lin(A.trial, A.trialE + .2, t), blank: ring });
    } else if (!pds.off && pageImage()) {
      meshImage(ctx, cam, pageImage(), PAGE.w, PAGE.h, pAt, 7, 9);
      if (ring > 0) { const [X, Z] = pagePt(pg, PAGE.mark[0], PAGE.mark[1]), M = cam.flatM(X, Z, pg.rot, .1, 12, .02); if (M) { ctx.save(); apply(ctx, mulA(M, [1, 0, 0, 1, -PAGE.mark[0], -PAGE.mark[1]])); pageRing(ctx, ring); ctx.restore(); } }
    }
    const cl = clipAt(t); if (cl) { const M = cam.flatM(cl.X, cl.Z, cl.rot, .1, 56, .04); if (M) clipping(ctx, t, mulA(M, [1, 0, 0, 1, -CLIP.w / 2, -CLIP.h / 2]), { reveal: lin(A.wasnt - .3, A.allE - .2, t) }); }
    for (let i = 1; i < 4; i++) { const d = dealt(i, t); if (d) tablePaperCard(ctx, t, cam, { ...d, num: i + 1, q: CARDS[i].q }); }
    // the light falls off: everything flat outside the pool sinks into the dark
    { const M = cam.flatM(spot.x, spot.z, 0, 1, 30); if (M && cam.pitch < -.3) { ctx.save(); apply(ctx, M); const g = ctx.createRadialGradient(0, 0, spot.r * .55, 0, 0, spot.r * 1.5); g.addColorStop(0, 'rgba(8,8,14,0)'); g.addColorStop(1, 'rgba(8,8,14,.72)'); ctx.fillStyle = g; ctx.fillRect(-400, -400, 800, 800); ctx.restore(); } }
    // the halls, the curve, the robots
    if (t > A.data - .2) HALLS.forEach((h, i) => hall(ctx, t, cam, { ...h, rise: hallRise(i, t), light: 1 }));
    const ru = riseU(t), fu = footU(t);
    const proj = (P) => P.map(([X, Y, Z]) => { const q = cam.p(X, Y, Z); return q[3] > 1 ? [q[0], q[1], clamp(q[2] / 22, .35, 1.15)] : null; }).filter(Boolean);
    if (fu > 0) curve(ctx, t, proj(FOOT), { u: fu, w: .8, br: .95, tipA: 1 - .65 * lin(A.comesE - .2, A.comesE + .8, t), sparks: 0, shimmer: .5, seed: 4 });
    if (t > robotT0) robotField(ctx, t, cam, { t0: robotT0, wave: A.goals + .1 - robotT0, speed: 54, spot });
    if (ru > 0) curve(ctx, t, proj(RISE), { u: ru, w: 1.05, br: 1 + .35 * bump(t, A.elec - .1, A.elec + .25, A.elecE + .3, A.elecE + 1.2), sparks: 4, burst: t > A.elec ? A.elec + .05 : null, seed: 2 });
    // card I (the paper card: its blank window carries the paper plate)
    const k1 = c1(t);
    if (k1) tablePaperCard(ctx, t, cam, { ...k1, num: 1, q: CARDS[0].q, stamp: CARDS[0].stamp, stampU: stampU(t), plateT: t });
    beam(ctx, t, cam, { spot });
    // labels (screen space, still while read; never in the bottom 170 px)
    label(ctx, t, 'Nov 2025', 'TESLA SHAREHOLDER MEETING · PAY PACKAGE', 150, 250, A.at + .9, A.goals - .05);
    const cu = lin(A.goals + .1, A.million + .02, t), n = Math.round(Math.pow(10, 6 * ease.out(cu)));
    label(ctx, t, cu > 0 ? n.toLocaleString('en-US') : '1', 'ROBOTS · TESLA PAY PACKAGE GOAL', 150, 250, A.goals + .05, A.aMillion + 1.6, { size: 96, small2: 'DELIVERED WITHIN 10 YEARS' });
  }

  return [
    { t: HB, tr: 'cut', d: .1, print: HI.print, draw: world, sound: [{ f: 'bloom', t: A.teslaE + .08, v: .3 }] },
    { t: A.physics, draw: world, print: HI.print, sound: [{ f: 'pencil', t: A.trialE - .3, v: .35 }, { f: 'card', t: land[0], v: .32 }] },
    { t: A.pkg, draw: world, print: HI.print, sound: [{ f: 'multiply', t: A.muskE + .15, v: .35 }, { f: 'swell', t: A.themE + .02, v: .3 }] },
    { t: A.comesE - .4, draw: world, print: HI.print, sound: [{ f: 'pencil', t: A.comesE + .05, v: .35 }] },
    { t: A.huge, draw: world, print: HO.print, sound: [{ f: 'stamp', t: A.billW - .02, v: .55 }, { f: 'whoosh_airy', t: A.attachedE - .1, v: .3 }] },
  ];
};
