// Film 7 · c09 · card II turned: dig less, the lithium search, a ceiling, the sulfur cap (06b), from the c08>c09 paper plate (card II's
// window, back up) to the c09>c10 paper plate (card III's window). Builder: c09. ONE continuous take on THE TABLE (lib/f7_c09_table.mjs =
// c09's copy of c04/c05's table; the card backs are c08's, copied 1:1 in lib/f7_c09_cards.mjs). The answers rise out of the lacquer behind
// the cards as c05's questions did, in the same engraved standee / solid language (lib/f7_c09_props.mjs = c05's props, lib/f7_c09_answers.mjs
// = c09's new props); the cold spotlight warms toward evening gold while the answers come. Every accent anchored to a word (T.S / T.E).
//
// | shot | VO words (anchor)                                  | image                                                                   | hero light        | camera                                   | flows on by                          | ★ / sound                 |
// |------|----------------------------------------------------|-------------------------------------------------------------------------|-------------------|------------------------------------------|--------------------------------------|---------------------------|
// | 9.01 | Second card. Can we stop digging?                  | out of card II's paper window (back up, c08): CEILING, the engraved      | the pool          | pull up 0.9 s (log height), glide down   | take continues                       | card (pause after "card") |
// |      |                                                    | ceiling chart; behind it the open-pit block rises, an excavator digs     |                   | to a 3/4 view of the mine 1.5 s          |                                      |                           |
// | 9.02 | Not completely. But we can dig far less.           | the excavator keeps working, then lifts its arm and stops; the dashed   | the pool, warming | slow push                                | continuous                           |                           |
// |      |                                                    | outline of the pit we would need shrinks to the real one                |                   |                                          |                                      |                           |
// |      | Recycle what's already above ground.               | scrap on the lacquer lifts into a ring, circles through a small press   | the press glow    | glide right 1.4 s                        | continuous                           |                           |
// |      |                                                    | and comes out as bright new ingots                                       |                   |                                          |                                      |                           |
// |      | Put less metal into every device.                  | an upright phone in x-ray: its metal frame and its body slim down       | the pool          | push a little                            | continuous                           |                           |
// | 9.03 | And even today's models can help. Researchers …    | the props sink; the spot narrows to a lab bench (glassware, two          | the beam / sieve  | rise + swing 1.9 s, then hold, drift     | continuous                           | glass_hum (sieve, pause   |
// |      | Microsoft, used AI to search through millions of   | researchers); a disc of cool light (the sieve) hangs in the beam;        |                   |                                          |                                      | after "help")             |
// |      | candidates.                                         | crystals rain through it by the thousand. 32 MILLION · PNNL + MS 2024    |                   |                                          |                                      |                           |
// |      | They found a battery material that may need far    | the rain stops; one crystal stays on the sieve and glows, then sinks     | the found crystal | push to the vial 1.2 s                   | continuous                           | chime (pause after        |
// |      | less lithium. It's still in the lab.               | into the vial on the bench. −70 % LITHIUM · LAB STAGE                     |                   |                                          |                                      | "candidates")             |
// | 9.04 | But imagine that search running on every material  | the bench sinks; the sieve rises and widens over the table: a phone, a  | the wide sieve    | pull back + up 2.5 s                     | continuous                           | shimmer_rings             |
// |      | you depend on.                                      | bike, a kettle, a window frame rise; a band of light passes up each     |                   |                                          |                                      |                           |
// | 9.05 | Then one rule makes the savings stick. Remember    | a paper chart slides onto the table; the amber appetite curve is drawn, | the paper chart   | tilt down onto the chart 1.5 s, push     | continuous                           | paper_slide               |
// |      | Jevons. Efficiency alone gets eaten up. So you     | three small savings (dips, SAVED) are eaten by its growth; "ceiling":   |                   |                                          |                                      | (pause after "stick")     |
// |      | need a ceiling.                                    | an ink ceiling is ruled across the top, the curve bends and runs flat   |                   |                                          |                                      | pencil (the rule)         |
// | 9.06 | America once capped the sulfur from its power      | the camera tilts up: three 1990 power plants rise behind the chart; the | the cap rule      | tilt up 1.6 s                            | MORPH: the chart's ceiling line      | whoosh_up (the rule lifts)|
// |      | plants and let companies trade permits under the   | ceiling line lifts off the paper and hangs over the stacks as THE CAP; |                   |                                          | lifts into the air as the cap        |                           |
// |      | cap. The pollution fell sharply, at a fraction of  | smoke flattens under it; paper permits fly between the plants; the cap |                   | drift right                              |                                      |                           |
// |      | the feared cost.                                   | lowers, the smoke thins to wisps; a cost column drops 75 % (ghost)      |                   |                                          |                                      |                           |
// | 9.07 | (pause)                                            | top-down over the four cards; push into card III's paper window         | the pool          | rise 0.7 s + push 0.5 s (log height)     | = the c09>c10 PAPER PLATE (exact)    | whoosh_airy (push)        |
// ★ none. Ambience: atmo/hall (quiet room tone) throughout; a low kiln breath under the press (9.02) is optional.
// Changes vs shots.md: the answers are props on the table (as c05's questions), not a fly into the engraving; the lab is a bench on the table
// under the spotlight's beam, the "sieve of light" hangs in that beam; the sulfur line is told by the smoke under the cap (the cap lowers,
// the smoke shrinks) + the cost column; the ceiling line of the chart becomes the cap over the plants (one ink line, two stories).
import { W, H, rgba, clamp, lin, mix, sm } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { f7Prepare, ease } from '../lib/f7_kit.mjs';
import { TB, CARDS, ROW, SPOT, tcam, camKeys, stage, tableTop, beam, paperCardPrepare, windowCam, apply, mulA } from '../lib/f7_c09_table.mjs';
import { ANSWERS, backPrepare, turnCard } from '../lib/f7_c09_cards.mjs';
import { propsPrepare, mineBlock, person, priceColumn, label } from '../lib/f7_c09_props.mjs';
import { answersPrepare, excavator, pitGhost, loop, device, bench, sieve, rain, things, chart, CH, plants, capBar, permits } from '../lib/f7_c09_answers.mjs';
import { POSES } from '../lib/figure.mjs';
import { landInk } from '../lib/f7_c09_land.mjs';

const PI2 = Math.PI / 2;
const bump = (t, a, b, c, d) => sm(lin(a, b, t)) * (1 - sm(lin(c, d, t)));
const look = (tx, ty, tz, d, pitch, yaw = 0) => { const cp = Math.cos(pitch); return [tx - Math.sin(yaw) * cp * d, ty - Math.sin(pitch) * d, tz - Math.cos(yaw) * cp * d, pitch, yaw]; };
function track(t, K, f = ease.io) {
  if (t <= K[0][0]) return K[0][1]; if (t >= K[K.length - 1][0]) return K[K.length - 1][1];
  let i = 0; while (t > K[i + 1][0]) i++;
  const [t0, a] = K[i], [t1, b] = K[i + 1], u = (K[i + 1][2] || f)((t - t0) / (t1 - t0));
  return Array.isArray(a) ? a.map((v, j) => mix(v, b[j], u)) : mix(a, b, u);
}
export const BACKS = (t) => ANSWERS.map((a) => ({ num: a.num, img: a.num === 1 ? landInk : a.img, word: a.word, slip: a.slip }));

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c09', T);
  const S = (ph, n) => T.S('06b', ph, n), E = (ph, n) => T.E('06b', ph, n);
  const A = {
    second: S('Second card'), cardE: E('Second card'), can: S('Can we stop'), digging: S('digging'), diggingE: E('digging'),
    not: S('Not completely'), notE: E('Not completely'), but: S('But we can'), digLess: S('dig far less'), far: S('far less'), lessE: E('dig far less'),
    recycle: S('Recycle'), above: S('above ground'), groundE: E('above ground'),
    put: S('Put less'), metal: S('less metal'), every: S('every device'), deviceE: E('every device'),
    andEven: S('And even'), models: S('models can'), helpE: E('can help'),
    researchers: S('Researchers'), lab: S('national laboratory'), working: S('working with'), msE: E('with Microsoft'),
    used: S('used artificial'), search: S('to search'), millions: S('millions'), candE: E('millions of candidates'),
    they: S('They found'), found: S('found a'), battery: S('battery material'), may: S('may need'), lithium: S('less lithium'), lithiumE: E('less lithium'),
    still: S("It's still"), labE: E('in the lab'),
    but2: S('But imagine'), imagine: S('imagine that'), running: S('search running'), everyM: S('every material'), depend: S('depend on'), dependE: E('you depend on'),
    then: S('Then one rule'), rule: S('one rule'), savings: S('savings stick'), stickE: E('savings stick'),
    remember: S('Remember Jevons'), jevonsE: E('Remember Jevons'),
    eff: S('Efficiency alone'), eaten: S('eaten up'), eatenE: E('eaten up'),
    so: S('So you need'), ceiling: S('a ceiling'), ceilingE: E('a ceiling'),
    america: S('America once'), capped: S('capped the'), sulfur: S('sulfur'), plantsE: E('power plants'),
    trade: S('trade permits'), permits: S('permits under'), capE: E('under the cap'),
    pollution: S('The pollution'), fell: S('fell sharply'), sharplyE: E('fell sharply'),
    fraction: S('at a fraction'), feared: S('feared cost'), cost: S('cost.'), costE: E('feared cost'),
  };
  await f7Prepare(); await propsPrepare(); await answersPrepare();
  const HB = HI.b, HA = HO.a, tEnd = HA - 1 / 30 - .002;
  await paperCardPrepare(CARDS.map((c) => ({ num: c.num, q: c.q, stamp: c.stamp })), HB);
  await backPrepare(BACKS(), HB);

  // ---------------------------------------------------------------- the props: where and when
  const MINE = { X: -12, Z: 14, rot: .05 };
  const mineRise = (t) => lin(A.can - .05, A.digging + .35, t) * (1 - lin(A.andEven, A.andEven + .9, t));
  const EXC = { X: MINE.X + 4.6, Y: 5.5, Z: MINE.Z - .9, s: 1.7 };
  const LOOP = { C: [4.5, 9], R: 4 };
  const loopA = (t) => ease.out(lin(A.recycle - .2, A.recycle + .4, t)) * (1 - lin(A.andEven + .1, A.andEven + .8, t));
  const gatherU = (t) => lin(A.recycle - .1, A.groundE + .2, t) * (1 - ease.inn(lin(A.andEven, A.andEven + .9, t)));
  const DEV = { X: 13.5, Z: 8 };
  const devRise = (t) => lin(A.put - .35, A.put + .4, t) * (1 - lin(A.andEven + .15, A.andEven + .95, t));
  const LAB = { X: 2, Z: 24, k: .9 };
  const labRise = (t) => lin(A.researchers - .25, A.researchers + .55, t) * (1 - lin(A.imagine + .1, A.imagine + .9, t));
  const vialAt = [LAB.X + (5.15 - 4.7) * LAB.k, (2.9 - 1.7) * LAB.k + .22, LAB.Z - .25];
  const SV = (t) => {   // the sieve: forms in the beam on "help", widens over the table on "every material"
    const w = ease.io(lin(A.running - .1, A.everyM + .4, t));
    return { X: mix(LAB.X, 2.5, w), Y: mix(5.4, 9.5, w), Z: mix(LAB.Z, 31, w), r: mix(3.8, 15, w) * ease.out(lin(A.andEven + .3, A.helpE + .4, t)) * (1 - ease.inn(lin(A.then - .45, A.then + .25, t))), a: 1,   // closes like an iris before the chart slides in
      pulse: bump(t, A.millions - .3, A.millions, A.candE, A.candE + .6) + .6 * bump(t, A.found - .2, A.found + .1, A.lithiumE, A.lithiumE + .6) };
  };
  const KEEP = { t0: A.found - 1.15, tl: A.may + .1, dx: .8, dz: -.6, land: vialAt };
  const THINGS = [{ kind: 'phone', X: -11, Z: 30, hgt: 6.2 }, { kind: 'bike', X: -3.5, Z: 34, hgt: 4.8 }, { kind: 'kettle', X: 8.5, Z: 33, hgt: 4.4 }, { kind: 'window', X: 15.5, Z: 29, hgt: 5.8 }];
  const thingRise = (k, t) => lin(A.running - .2 + k * .18, A.running + .5 + k * .18, t) * (1 - lin(A.savings + .2, A.savings + 1, t));
  const thingShim = (k, t) => lin(A.everyM - .35 + k * .3, A.everyM + .65 + k * .3, t);
  const CHART = { X: 1.5, Z: 4, u: .02 };
  const chartIn = (t) => ease.out(lin(A.then - .05, A.then + .95, t));
  const chartOut = (t) => ease.inn(lin(A.trade - .3, A.trade + .7, t));
  const chartM = (cam, t) => { const x = mix(46, CHART.X, chartIn(t)) - 52 * chartOut(t), M = cam.M3([x, .05, CHART.Z], [CHART.u, 0, 0], [0, 0, -CHART.u], 750); return M ? mulA(M, [1, 0, 0, 1, -CH.w / 2, -CH.h / 2]) : null; };
  const chartAt = (t) => ({ draw: .8 * ease.io(lin(A.remember - .2, A.eatenE, t)) + .2 * ease.io(lin(A.ceiling + .1, A.ceilingE + .5, t)), dips: ease.out(lin(A.eff - .3, A.eff + .5, t)), eat: ease.io(lin(A.eaten - .1, A.eatenE + .25, t)),
    ceil: ease.out(lin(A.ceiling - .15, A.ceiling + .5, t)), bend: ease.io(lin(A.ceiling + .1, A.ceilingE + .4, t)), ceilT: lin(A.ceiling + .35, A.ceiling + .8, t), liftA: lin(A.capped - .25, A.capped + .05, t) });
  // the chart's ceiling line in world coordinates (chart px y = CH.yc) → it lifts and becomes the cap over the plants
  const cx2w = (px) => CHART.X + (px - CH.w / 2) * CHART.u, cy2w = (py) => CHART.Z - (py - CH.h / 2) * CHART.u;
  const CAP0 = [[cx2w(CH.x0 - 30), .06, cy2w(CH.yc)], [cx2w(CH.x1 + 40), .06, cy2w(CH.yc)]];
  const PL = [{ X: -11, Z: 27 }, { X: 1, Z: 28.5 }, { X: 13, Z: 27.5 }], PK = 1.35;
  const exitSink = (k, t) => ease.io(lin(A.feared - .12 + k * .07, A.feared + .4 + k * .07, t));   // the props sink back into the table as the camera rises
  const plantRise = (k, t) => lin(A.america - .2 + k * .15, A.america + .7 + k * .15, t) * (1 - exitSink(k, t));
  const capY = (t) => mix(16.4, 13.6, ease.io(lin(A.fell - .2, A.sharplyE + .3, t))) * (1 - .97 * exitSink(1, t));
  const capU = (t) => ease.io(lin(A.capped - .25, A.capped + .85, t));
  const capPts = (t) => { const u = capU(t), y = capY(t), P1 = [[-17.5, y, 27.5], [19.5, y, 27.5]]; return [0, 1].map((i) => [0, 1, 2].map((d) => mix(CAP0[i][d], P1[i][d], u)).map((v, d) => (d === 1 ? v + 3.5 * Math.sin(Math.PI * u) : v))); };
  const COST = { X: 15.5, Z: 19, h: 9 };

  // ---------------------------------------------------------------- the spotlight (x, z, r, a, warm)
  const SPK = [
    [HB, [0, 2, 46, 1, 0]],
    [A.can - .1, [0, 2, 46, 1, 0]],
    [A.digging + .4, [-9, 11, 30, 1, .25]],
    [A.recycle - .2, [-8, 10, 32, 1, .35]],
    [A.groundE, [2, 8, 30, 1, .45]],
    [A.put + .5, [6, 8, 30, 1, .5]],
    [A.andEven + .1, [6, 8, 30, 1, .5]],
    [A.helpE + .3, [LAB.X, LAB.Z - 1, 13, 1, .55]],
    [A.but2 - .1, [LAB.X, LAB.Z - 1, 13, 1, .55]],
    [A.dependE, [2.5, 28, 34, 1, .55]],
    [A.then + .2, [2.5, 26, 36, 1, .55]],
    [A.rule + .7, [CHART.X, CHART.Z + 1, 27, 1, .55]],
    [A.america - .1, [CHART.X, CHART.Z + 1, 27, 1, .55]],
    [A.plantsE, [1.5, 15, 40, 1, .6]],
    [A.fraction - .2, [5, 12, 42, 1, .6]],
    [A.cost + .4, [4, -4, 40, 1, .6]],
    [HA, [4, -6, 40, 1, .6]],
  ];
  const spotAtT = (t) => { const v = track(t, SPK); return { x: v[0], z: v[1], r: v[2], a: v[3], warm: v[4] }; };

  // ---------------------------------------------------------------- the camera
  const WC = windowCam(ROW[1]), WC3 = windowCam(ROW[2]);
  const UP1 = [ROW[1].X + .4, 23, ROW[1].Z + 1.2, -PI2, -ROW[1].rot];
  const tUp = HB + .95;
  const K = [
    [tUp, UP1],
    [A.can - .05, [ROW[1].X + .2, 21.5, ROW[1].Z + 1.6, -PI2 + .06, -ROW[1].rot * .5]],
    [A.diggingE + .35, look(-10.5, 3, 12, 31, -.5, .1)],
    [A.but, look(-10.5, 3.2, 12, 29, -.49, .09)],
    [A.recycle - .1, look(-9.5, 3.2, 11.5, 27, -.48, .08)],
    [A.recycle + 1.3, look(6, 1.6, 9, 25, -.52, -.04)],
    [A.put + .1, look(7.5, 1.8, 8.8, 24, -.48, -.06)],
    [A.deviceE + .2, look(9, 2.2, 8.5, 21.5, -.44, -.08)],
    [A.andEven + .15, look(9, 2.2, 8.5, 21.5, -.44, -.08)],
    [A.researchers - .1, look(LAB.X + .5, 3.3, LAB.Z - .5, 14.5, -.38, .02)],
    [A.used, look(LAB.X + .5, 3.9, LAB.Z, 15.5, -.37, .02)],
    [A.candE, look(LAB.X + .5, 4.1, LAB.Z, 16, -.37, .01)],
    [A.found + .1, look(LAB.X + .9, 4, LAB.Z, 14, -.38, .02)],
    [A.may + 1.3, look(vialAt[0], 2, vialAt[2] + .5, 10.5, -.4, .03)],
    [A.labE + .1, look(vialAt[0], 1.9, vialAt[2] + .5, 10, -.4, .03)],
    [A.everyM + .6, look(2.5, 4.5, 30, 44, -.42, 0)],
    [A.then + .15, look(2.5, 4.2, 29.5, 42, -.43, 0)],
    [A.rule + 1.0, look(CHART.X, 0, CHART.Z + .3, 37, -1.1, 0)],
    [A.so, look(CHART.X, 0, CHART.Z + .6, 34, -1.12, 0)],
    [A.ceilingE + .2, look(CHART.X, 0, CHART.Z + .6, 33.5, -1.12, 0)],
    [A.sulfur + .2, look(1.5, 10.5, 22, 49, -.38, 0)],
    [A.trade, look(1.5, 10.2, 23, 47, -.37, 0)],
    [A.fraction - .3, look(4, 10, 23, 47, -.37, -.03)],
    [A.feared - .1, look(5, 9.8, 23, 46.5, -.37, -.04)],
  ];
  const tA = A.feared - .25, tB = A.cost + .2;   // rise to top-down over card III, then the push into its window
  const UP3 = [WC3.x, 15, WC3.z - .4, -PI2, WC3.yaw];
  const camAt = (t) => {
    if (t <= tUp) {   // out of card II's window (exact at HB), lateral follows the height
      const u = ease.sine(lin(HB, tUp, t)), hu = Math.exp(mix(Math.log(WC.y - .03), Math.log(UP1[1] - .03), u)) + .03, lu = (hu - WC.y) / (UP1[1] - WC.y);
      return [mix(WC.x, UP1[0], lu), hu, mix(WC.z, UP1[2], lu), -PI2, mix(WC.yaw, UP1[4], lu)];
    }
    if (t < tA) return camKeys(t, K);
    if (t < tB) return camKeys(t, [...K.slice(-2), [tB, UP3]]);
    const a = UP3, u = ease.sine(lin(tB, tEnd, t)), hu = Math.exp(mix(Math.log(a[1] - .03), Math.log(WC3.y - .03), u)) + .03;
    const lu = 1 - (hu - WC3.y) / (a[1] - WC3.y);
    return [mix(a[0], WC3.x, lu), hu, mix(a[2], WC3.z, lu), -PI2, mix(a[4], WC3.yaw, lu)];
  };

  // ---------------------------------------------------------------- the one take
  const RES = [{ X: LAB.X - 2.6, Z: LAB.Z - 1.5, seed: 31, flip: false, pose: POSES.lean }, { X: LAB.X + 2.9, Z: LAB.Z - 1.6, seed: 32, flip: true, pose: POSES.look }];
  function world(ctx, t) {
    const c = camAt(Math.min(t, tEnd)), cam = tcam({ x: c[0], y: c[1], z: c[2], pitch: c[3], yaw: c[4] }), sp = spotAtT(t), warm = sp.warm;
    stage(ctx, t, cam, { screen: false });
    tableTop(ctx, t, cam, { spot: sp });
    // the four cards, back up (c08 turned them)
    for (let i = 0; i < 4; i++) turnCard(ctx, t, cam, { ...ROW[i], phi: Math.PI, back: { ...BACKS()[i], plateT: t } });
    // the light falls off (as c04/c05)
    { const M = cam.flatM(sp.x, sp.z, 0, 1, 30); if (M && cam.pitch < -.3) { ctx.save(); apply(ctx, M); const g = ctx.createRadialGradient(0, 0, sp.r * .55, 0, 0, sp.r * 1.5 + 6); g.addColorStop(0, 'rgba(8,8,14,0)'); g.addColorStop(1, 'rgba(8,8,14,.72)'); ctx.fillStyle = g; ctx.fillRect(-400, -400, 800, 800); ctx.restore(); } }

    // 9.01–9.02 the mine, the loop, the device
    const mr = mineRise(t);
    if (mr > 0) {
      mineBlock(ctx, t, cam, { ...MINE, rise: mr, glow: .35 * (1 - lin(A.digLess, A.lessE + .4, t)) + .08 * Math.sin(t * 1.6), spot: sp, warm });
      const g = bump(t, A.digging - .1, A.digging + .5, A.digLess - .2, A.lessE + .2);
      if (g > 0) pitGhost(ctx, cam, { X: MINE.X + .25, Y: 5.5 * ease.out(mr), Z: MINE.Z - 5, r: mix(6.4, 10.5, ease.out(lin(A.digging - .1, A.digging + .6, t))) * (1 - .35 * ease.io(lin(A.far - .1, A.lessE + .2, t))), r0: 6.3, a: g });
      if (mr > .7) excavator(ctx, t, cam, { ...EXC, Y: 5.5 * ease.out(mr), dig: lin(A.digging - .3, A.digging + .2, t), lift: ease.io(lin(A.far - .15, A.lessE + .1, t)), warm });
    }
    const la = loopA(t);
    if (la > 0) loop(ctx, t, cam, { ...LOOP, gather: gatherU(t), a: la, spot: sp, warm });
    const dr = devRise(t);
    if (dr > 0) device(ctx, t, cam, { ...DEV, rise: dr, scan: lin(A.put + .1, A.metal + .5, t), thin: lin(A.every - .3, A.deviceE + .5, t), spot: sp, warm });

    // 9.03 the lab, the sieve, the rain
    const lr = labRise(t);
    if (lr > 0) {
      const list = RES.map((q) => ({ ...q, d: Math.hypot(q.X - cam.x, q.Z - cam.z) }));
      bench(ctx, t, cam, { ...LAB, rise: lr, vial: ease.out(lin(KEEP.tl + 1.0, KEEP.tl + 1.4, t)), glow: .5 + .3 * Math.sin(t * 1.3) });
      if (lr > .9) for (const q of list.sort((a, b) => b.d - a.d)) person(ctx, t, cam, q, { spot: sp, warm });
    }
    const sv = SV(t);
    if (t > A.used - .3 && t < A.but2 + .6) rain(ctx, t, cam, { X: LAB.X, Z: LAB.Z, Y0: 16, Ys: 5.4, r: 3.6, t0: A.used + .2, t1: A.found - .2, keep: KEEP });
    if (sv.r > 0 && sv.a > 0) sieve(ctx, t, cam, sv);
    // 9.04 the everyday things
    if (t > A.running - .3 && t < A.savings + 1.1) things(ctx, t, cam, { list: THINGS.map((q, k) => ({ ...q, rise: thingRise(k, t), shim: thingShim(k, t), lit: .4 * bump(t, A.everyM - .4 + k * .3, A.everyM + k * .3, A.dependE + .2, A.dependE + 1) })) });

    // 9.05 the chart (and its ceiling, which lifts off as the cap)
    if (t > A.then - .1 && chartOut(t) < 1) { const M = chartM(cam, t); if (M) chart(ctx, t, M, chartAt(t)); }
    // 9.06 the plants, the cap, the permits, the cost
    if (t > A.america - .3) {
      plants(ctx, t, cam, { k: PK, list: PL.map((q, k) => ({ ...q, rise: plantRise(k, t) })), smoke: lin(A.america + .5, A.capped + .5, t), low: ease.io(lin(A.fell - .1, A.sharplyE + .6, t)), capY: capU(t) > .9 ? capY(t) : 1e9 });
      if (t > A.capped - .3) { const [P0, P1] = capPts(t); capBar(ctx, t, cam, { P0, P1, a: 1, word: lin(A.capped + .9, A.capped + 1.3, t) }); }
      permits(ctx, t, cam, { from: PL.map((q) => [q.X + 1.6, 3.2, q.Z - .8]), t0: A.trade - .1, t1: A.capE - .2, n: 8 });
      if (t > A.fraction - .4) priceColumn(ctx, t, cam, { ...COST, rise: lin(A.fraction - .35, A.fraction + .25, t) * (1 - exitSink(3, t)), drop: .75, fall: ease.io(lin(A.fraction + .1, A.feared + .3, t)), spot: sp, warm });
    }
    beam(ctx, t, cam, { spot: sp, a: .9 });

    // labels (screen space, still while read; never in the bottom 170 px)
    label(ctx, t, '32 million', 'CANDIDATES SEARCHED BY AI', 130, 210, A.millions - .05, A.found - .15, { small2: 'PNNL + MICROSOFT · 2024' });
    label(ctx, t, 'up to −70 %', 'LITHIUM IN A NEW BATTERY MATERIAL', 130, 210, A.may - .1, A.labE + .3, { small2: 'PNNL + MICROSOFT · 2024 · LAB STAGE' });
    label(ctx, t, '1990', 'SULFUR CAP + PERMIT TRADING', 130, 200, A.capped - .1, A.capE + .1, { small2: 'US CLEAN AIR ACT · ACID RAIN PROGRAM' });
    label(ctx, t, '−75 %', 'COST VS. THE FORECAST', 130, 200, A.fraction - .1, A.cost + .3, { small2: 'US EPA · ACID RAIN PROGRAM' });
  }

  const P1 = HI.print, PO = HO.print;
  return [
    { t: HB, tr: 'cut', d: .1, print: P1, draw: world, sound: [{ f: 'card', t: A.cardE + .1, v: .25 }] },
    { t: A.andEven, draw: world, print: P1, sound: [{ f: 'glass_hum', t: A.helpE + .12, v: .25 }, { f: 'chime', t: A.candE + .25, v: .3 }] },
    { t: A.but2, draw: world, print: P1, sound: [{ f: 'shimmer_rings', t: A.dependE + .08, v: .3 }, { f: 'paper_slide', t: A.then - .35, v: .35 }, { f: 'pencil', t: A.ceiling - .1, v: .3 }] },
    { t: A.america - .3, draw: world, print: P1, sound: [{ f: 'swell', t: A.sharplyE + .05, v: .2 }] },
    { t: tA, draw: world, print: PO, sound: [{ f: 'whoosh_airy', t: tB - .1, v: .3 }] },
  ];
};
