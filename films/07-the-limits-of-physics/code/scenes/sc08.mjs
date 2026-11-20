// Film 7 · c08 · card I turned: clean power (06a), from the c07>c08 paper plate (card I's window) to the c08>c09 paper plate (card II's
// window). Builder: c08. ONE continuous take through two worlds joined by a fly-in and a fly-out of one surface (card I's engraving):
// the table (lib/f7_c08_table.mjs, a 1:1 copy of c04's) → the engraved land on card I's answer side becomes the land itself
// (lib/f7_c08_land.mjs, true perspective, noon → blue hour) → back out of the same engraving onto the table → into card II's window.
// Every accent is anchored to a word (T.S / T.E), never to seconds.
//
// | shot | VO words (anchor)                                  | image                                                                      | hero light       | camera                                   | flows on by                                  | ★ / sound                  |
// |------|----------------------------------------------------|----------------------------------------------------------------------------|------------------|------------------------------------------|----------------------------------------------|----------------------------|
// | 8.01 | Let's turn those four cards back over.            | out of card I's paper window: the four stamped cards in the cold pool;     | the spotlight    | pull out (log height) 1.2 s, then glide  | take                                         | card (first landings, in   |
// |      |                                                    | on "back over" they turn over in a ripple (3D flip, lift, flutter, land)    |                  | to a 3/4 view of the row                 |                                              | the pause after "over.")   |
// |      | This time, with answers.                          | the answer sides: an engraved picture + one word each: SUN · CEILING ·      | the pool         | slow drift down toward the row           | continuous                                   |                            |
// |      |                                                    | WATCHMAN; card IV's picture is covered by a pinned slip with a red "?"      |                  |                                          |                                              |                            |
// |      | And one of them points to a number …              | glide to card IV; on "number" a glint runs over the "?"                     | the slip         | glide 1.8 s                              | continuous                                   |                            |
// | 8.02 | First card. Can clean power outrun the machines?  | glide back to card I, straight above it: ANSWER I · SUN, its engraving a    | card I           | glide 1.5 s; push into the engraving     | FLY INTO THE ENGRAVING: the box fills the    | whoosh_airy (pause after   |
// |      |                                                    | sun over solar fields; on "clean power" the camera pushes into the picture  |                  | 2.4 s (log height)                       | frame; ink turns to colour = the land itself | "machines?")               |
// |      |                                                    | and the ink takes colour: noon light, blue panels, the far coal plant       |                  |                                          |                                              |                            |
// | 8.03 | It's already racing. In 2025, renewables overtook | over the land two lines race across the sky, 2000 → 2025 (share of world    | the sun          | slow push, tilt up into the sky          | continuous                                   |                            |
// |      | coal … for the first time, according to Ember.    | electricity): grey coal falls, gold renewables climbs and passes it on      |                  |                                          |                                              |                            |
// |      |                                                    | "overtook" (a flash); 33.8 % vs 33.0 % · EMBER · GLOBAL ELECTRICITY REVIEW  |                  |                                          |                                              |                            |
// |      | Clean sources covered all of the growth.          | new rows of panels unroll, new turbines rise on the far hills;              | the sun          | drift                                    | continuous                                   | bloom (pause after         |
// |      |                                                    | ALL OF 2025'S DEMAND GROWTH: CLEAN                                          |                  |                                          |                                              | "growth.")                 |
// | 8.04 | And data centers can be good neighbors.           | the sun sinks (time-lapse, continuous colour) while the camera flies right  | the sunset       | rising flight 4 s, turn right .55 rad    | continuous                                   | whoosh_airy (pause after   |
// |      |                                                    | over the desert: a long low data center (c02's hall) beside Phoenix         |                  |                                          |                                              | "neighbors.")              |
// |      | In a test in Phoenix, … cut its power use by a    | blue hour: the city's lights come on; its demand curve rises in the sky;    | the DC glow      | slow push                                | continuous                                   |                            |
// |      | quarter, for three hours, right when the grid was | on "cut" the hall's vents and glow dim, the fans slow: −25 %; "three hours":|                  |                                          |                                              |                            |
// |      | under the most strain.                             | a bracket on the peak; "strain": the peak and the wires glow amber          |                  |                                          |                                              |                            |
// |      | And every job still met its performance targets.  | small ticks run along the hall, one per job; EVERY JOB ON TARGET            | the hall         | slow push                                | continuous                                   | tick (pause after          |
// |      |                                                    |                                                                             |                  |                                          |                                              | "targets.")                |
// | 8.05 | So here's the rule.                               | the camera comes down to a home at the city's edge: its window stays warm,  | the window       | crane down 3 s                           | FLY OUT OF THE ENGRAVING: the land shrinks   |                            |
// |      |                                                    | a parent and a child inside; the hall behind steps back                     |                  |                                          | back into card I's picture on the table      |                            |
// |      | Data centers pay for their own clean power, and   | card I (top down) now carries its answer in colour; the rule prints under   | card I           | hold over card I                         | continuous                                   |                            |
// |      | make room when your city needs it most.           | SUN, line by line: "Pay for your own clean power. / Make room when the city |                  |                                          |                                              |                            |
// |      |                                                    | needs it."                                                                  |                  |                                          |                                              |                            |
// | 8.06 | (handoff)                                          | glide to card II (back up: CEILING) and push into its paper window          | paper            | glide + push 1.8 s (log height)          | = the c08>c09 PAPER PLATE (exact, windowCam) | whoosh_airy (after "most.")|
// ★ none (c06 carries the film's ★). Ambience: atmo/hall (table) → atmo/hill (the sunlit land, from the fly-in) → atmo/city_night_hill
// (Phoenix, blue hour) → atmo/hall (back on the table).
// Changes vs shots.md: the four cards turn over together (8.01) and stay BACK UP: card II's paper window is on its answer side too (same
// place as on the front), so c09 starts from card II already turned (CEILING) instead of turning it; the race (8.03) runs in the sky over the
// land (share of world electricity, 2000–2025); "all of the growth" is shown as new rows and turbines; the family window (8.05) sits beside
// the hall at the city's edge; the rule is printed on card I's answer side (paper and ink for every rule), under SUN.
import { W, H, rgba, clamp, lin, mix, sm, text } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { F7, f7Prepare, ease } from '../lib/f7_kit.mjs';
import { TB, CARDS, ROW, SPOT, tcam, camKeys, stage, tableTop, beam, paperCardPrepare, windowCam, cardFaceM, apply, mulA, depthSpread } from '../lib/f7_c08_table.mjs';
import { ANSWERS, BOX, backPrepare, backCard, turnCard, faceCam, boxM } from '../lib/f7_c08_cards.mjs';
import { land, landCam, landInk, ENTRY, RACE } from '../lib/f7_c08_land.mjs';

const PI2 = Math.PI / 2, PI = Math.PI;
const bump = (t, a, b, c, d) => sm(lin(a, b, t)) * (1 - sm(lin(c, d, t)));
// monotone cubic through timed keys (C1, no overshoot, ends held)
function pchip(t, K) {
  if (t <= K[0][0]) return K[0][1].slice(); const n = K.length; if (t >= K[n - 1][0]) return K[n - 1][1].slice();
  let i = 0; while (t > K[i + 1][0]) i++;
  return K[i][1].map((_, j) => {
    const d = (a) => (K[a + 1][1][j] - K[a][1][j]) / (K[a + 1][0] - K[a][0]), h = (a) => K[a + 1][0] - K[a][0];
    const m = (a) => { if (a === 0 || a === n - 1) return 0; const d0 = d(a - 1), d1 = d(a); if (d0 * d1 <= 0) return 0; const w1 = 2 * h(a) + h(a - 1), w2 = h(a) + 2 * h(a - 1); return (w1 + w2) / (w1 / d0 + w2 / d1); };
    const hh = h(i), u = (t - K[i][0]) / hh, u2 = u * u, u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * K[i][1][j] + (u3 - 2 * u2 + u) * hh * m(i) + (-2 * u3 + 3 * u2) * K[i + 1][1][j] + (u3 - u2) * hh * m(i + 1);
  });
}
// a camera that looks at a table point from a distance at a pitch / yaw → [x, ln y, z, pitch, yaw]
const orbit = (X, Z, dist, pitch, yaw = 0) => { const cp = Math.cos(-pitch); return [X - Math.sin(yaw) * dist * cp, Math.log(dist * Math.sin(-pitch)), Z - Math.cos(yaw) * dist * cp, pitch, yaw]; };
const fromCam = (c) => [c.x, Math.log(c.y), c.z, c.pitch, c.yaw];

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c08', T);
  const S = (p, n) => T.S('06a', p, n), E = (p, n) => T.E('06a', p, n);
  const A = {
    turn: S('turn those'), back: S('back over'), overE: E('back over'), thisT: S('This time'), answersE: E('with answers'), one: S('And one'), number: S('a number'), questionE: E('whole question'),
    first: S('First card'), firstE: E('First card'), can: S('Can clean'), clean: S('clean power'), machinesE: E('the machines'), racing: S("It's already"), racingE: E('already racing'),
    in25: S('In twenty'), renew: S('renewables'), overtook: S('overtook'), coalE: E('overtook coal'), first2: S('for the first'), ember: S('according to Ember'), emberE: E('according to Ember'),
    cleanS: S('Clean sources'), growthE: E('of the growth'), andData: S('And data'), neighborsE: E('good neighbors'), test: S('In a test'), phoenix: S('Phoenix'), cluster: S('a cluster'),
    cut: S('cut its'), quarter: S('a quarter'), quarterE: E('a quarter'), three: S('three hours'), threeE: E('three hours'), rightW: S('right when'), strain: S('most strain'), strainE: E('most strain'),
    every: S('every job'), targetsE: E('performance targets'), so: S("So here's"), ruleE: E("the rule"), dataPay: S('Data centers pay'), powerE: E('own clean power'), make: S('make room'), mostE: E('needs it most'),
  };
  const HB = HI.b, HA = HO.a, tEnd = HA - 1 / 30 - .002;
  const tIn = A.machinesE + .12;            // the engraving fills the frame: from here the land alone is drawn
  const tOut = A.so + .18;                   // the camera leaves the land (pull out of the engraving)
  const tOutE = A.dataPay + .6;            // above card I again
  const tV = A.first - .25;                 // card I's answer side is drawn live from here (its cached image is baked at this time)

  // ---------------------------------------------------------------- the land inside card I (camera, time of day, the story's state)
  const IK = [
    [tV, [ENTRY.x, ENTRY.y, ENTRY.z, ENTRY.yaw, ENTRY.pitch, Math.log(ENTRY.f)]],
    [tIn, [0, 30, 10, -.045, .072, Math.log(1560)]],
    [A.racing + .9, [0, 30, 18, -.01, .075, Math.log(1600)]],
    [A.overtook + .5, [0, 30, 27, .02, .08, Math.log(1600)]],
    [A.growthE + .2, [0, 31, 40, .045, .07, Math.log(1620)]],
    [mix(A.growthE, A.test, .55), [500, 150, 260, .32, -.05, Math.log(1650)]],
    [A.phoenix + .2, [980, 140, 480, .5, -.08, Math.log(1700)]],
    [A.strainE, [995, 137, 500, .505, -.08, Math.log(1720)]],
    [A.every + .4, [1005, 134, 515, .51, -.078, Math.log(1740)]],
    [tOut - .1, [1120, 6, 790, .55, .02, Math.log(1700)]],
    [tOutE + 4, [1121, 5.8, 792, .552, .021, Math.log(1700)]],
  ];
  const innerCam = (t) => { const v = pchip(Math.max(t, tV), IK); return landCam({ x: v[0], y: v[1], z: v[2], yaw: v[3], pitch: v[4], f: Math.exp(v[5]) }); };
  const ev = (t) => mix(0, 1, sm(lin(A.growthE - .3, A.phoenix - .2, t))) + .85 * sm(lin(A.phoenix - .2, A.every, t));
  const sunAt = (t) => { const u = sm(lin(A.growthE - .4, A.phoenix + 1.2, t)); return { az: mix(.46, .7, u), el: mix(.26, -.035, Math.pow(u, .85)) }; };
  const raceU = (t) => { const u = lin(A.racing + .15, A.overtook + .25, t); return u < .5 ? 2 * u * u * .5 + u * .5 : u; };
  const inner = (t) => ({
    ev: ev(t), ink: 1 - ease.io(lin(A.clean - .1, tIn - .05, t)), sun: sunAt(t),
    race: clamp(raceU(t)), raceA: 1, raceFrom: ease.io(lin(A.growthE + .15, A.andData + .9, t)), cross: lin(A.overtook + .08, A.overtook + 1.1, t),
    grow: lin(A.cleanS + .1, A.growthE + .5, t) * 1.4, dcOn: 1, dcDim: ease.io(lin(A.cut + .1, A.quarterE, t)),
    load: ease.io(lin(A.test + .3, A.cut, t)), head: lin(A.test + .3, A.strainE + 1.5, t) * .78, bracket: lin(A.three - .05, A.threeE + .1, t),
    strain: bump(t, A.strain - .35, A.strainE, A.targetsE, A.targetsE + 1.2), ticks: lin(A.every + .1, A.targetsE - .1, t), lights: sm(lin(A.phoenix, A.cluster + 1.5, t)), home: sm(lin(A.every, tOut, t)),
  });
  const landAt = (g, t) => land(g, t, innerCam(t), inner(t));

  await f7Prepare();
  await paperCardPrepare(CARDS.map((c) => ({ num: c.num, q: c.q, stamp: c.stamp })), HB);
  await backPrepare(ANSWERS.map((a) => ({ ...a, img: a.num === 1 ? (g, t) => land(g, t, landCam(ENTRY), inner(tV)) : a.img, imgT: tV })), tV);

  // ---------------------------------------------------------------- the cards: the ripple of turns
  const flipT = [0, 1, 2, 3].map((i) => A.back - .12 + i * .17), FD = .8;
  const turnOf = (i, t) => {
    const u = lin(flipT[i], flipT[i] + FD, t), e = ease.io(u);
    const settle = t > flipT[i] + FD ? .05 * Math.sin(PI * clamp((t - flipT[i] - FD) / .26)) * (1 - lin(flipT[i] + FD, flipT[i] + FD + .3, t)) : 0;
    return { phi: PI * e - settle * PI, hop: .9 * Math.sin(PI * e), bend: .45 * Math.sin(PI * e) * (1 - e * .3) };
  };
  const cardAt = (i, t, big) => {
    const r = ROW[i], f = turnOf(i, t), o = { X: r.X, Z: r.Z, rot: r.rot, phi: f.phi, hop: f.hop, bend: f.bend, plateT: t, front: { num: i + 1, q: CARDS[i].q, stamp: CARDS[i].stamp },
      back: { ...ANSWERS[i], num: i + 1, plateT: t, img: i === 0 ? landAt : ANSWERS[i].img, forceVector: big } };
    return o;
  };

  // ---------------------------------------------------------------- the table camera ([x, ln y, z, pitch, yaw])
  const W0 = windowCam(ROW[0]), W1 = windowCam(ROW[1]), BC = faceCam(ROW[0], BOX), c1 = ROW[0], c2 = ROW[1];
  const over1 = [c1.X, Math.log(16.5), c1.Z, -PI2, -c1.rot], over2 = [c2.X, Math.log(15.5), c2.Z, -PI2, -c2.rot];
  const KA = [
    [HB, fromCam(W0)],
    [HB + 1.25, [c1.X + .6, Math.log(17), c1.Z - .8, -PI2 + .02, -c1.rot]],
    [A.back - .05, orbit(.3, -12, 40, -1.13, .02)],
    [A.answersE + .2, orbit(.6, -12, 33, -1.24, .02)],
    [A.number + .45, orbit(11.8, -12.2, 21, -1.33, .07)],
    [A.questionE + .15, orbit(12.4, -12.2, 19.5, -1.37, .075)],
    [A.firstE + .05, over1],
  ];
  const tPush = A.can - .05;
  const pushCam = (t0, t1, a, b, t, ez = ease.sine) => {   // log-height push from a to b (top-down), the lateral move follows the height
    const u = ez(lin(t0, t1, t)), ly = mix(a[1], b[1], u), lu = (Math.exp(ly) - Math.exp(a[1])) / (Math.exp(b[1]) - Math.exp(a[1]));
    return [mix(a[0], b[0], lu), ly, mix(a[2], b[2], lu), mix(a[3], b[3], lu), mix(a[4], b[4], lu)];
  };
  const tG = A.make + .78;   // leave card I (the rule has been read), glide to card II and push into its window
  const KC = [[tOutE, over1], [tG, [c1.X + .12, Math.log(16.1), c1.Z + .04, -PI2, -c1.rot]], [mix(tG, tEnd, .5), [c2.X - .2, Math.log(10.5), c2.Z + .3, -PI2, -c2.rot]], [tEnd, fromCam(W1)]];
  const tableCam = (t) => {
    let v;
    if (t < tPush) v = pchip(t, KA);
    else if (t < tOut) v = pushCam(tPush, tIn, over1, fromCam(BC), t);
    else if (t < tOutE) v = pushCam(tOut, tOutE, fromCam(BC), over1, t);
    else v = pchip(t, KC);
    return tcam({ x: v[0], y: Math.exp(v[1]), z: v[2], pitch: v[3], yaw: v[4] });
  };

  // ---------------------------------------------------------------- the table take
  function table(ctx, t) {
    const cam = tableCam(Math.min(t, tEnd));
    stage(ctx, t, cam, {});
    tableTop(ctx, t, cam, { spot: SPOT });
    // order: cards far from the turn first; the card in the air last
    const big1 = t > tV && t < A.mostE + 1, order = [3, 2, 1, 0].sort((a, b) => turnOf(a, t).hop - turnOf(b, t).hop);
    for (const i of order) {
      const o = cardAt(i, t, i === 0 ? big1 : (i === 1 && t > A.make));
      if (i === 0 && o.phi >= PI - 1e-3 && o.hop <= 1e-4) {
        // card I lying back up: drawn here so its picture and the rule are live
        const M = cardFaceM(cam, { X: o.X, Z: o.Z, rot: o.rot }); if (!M) continue;
        backCard(ctx, t, M, { ...o.back, rule: t > tOut ? [ease.out(lin(A.dataPay + .25, A.powerE - .55, t)), ease.out(lin(A.powerE - .25, A.make - .1, t))] : null });
      } else turnCard(ctx, t, cam, o);
    }
    // the light falls off outside the pool
    { const M = cam.flatM(SPOT.x, SPOT.z, 0, 1, 30); if (M && cam.pitch < -.3) { ctx.save(); apply(ctx, M); const g = ctx.createRadialGradient(0, 0, SPOT.r * .55, 0, 0, SPOT.r * 1.5); g.addColorStop(0, 'rgba(8,8,14,0)'); g.addColorStop(1, 'rgba(8,8,14,.72)'); ctx.fillStyle = g; ctx.fillRect(-400, -400, 800, 800); ctx.restore(); } }
    // "one of them points to a number": a glint runs over card IV's slip
    const gl = lin(A.number - .05, A.number + .9, t);
    if (gl > 0 && gl < 1) { const r = ROW[3], M = cardFaceM(cam, { X: r.X, Z: r.Z, rot: r.rot }); if (M) { ctx.save(); apply(ctx, M); ctx.globalCompositeOperation = 'lighter'; const x = mix(40, 520, ease.io(gl)), g = ctx.createLinearGradient(x - 80, 0, x + 80, 0); g.addColorStop(0, 'rgba(255,248,230,0)'); g.addColorStop(.5, `rgba(255,248,230,${.32 * Math.sin(PI * gl)})`); g.addColorStop(1, 'rgba(255,248,230,0)'); ctx.fillStyle = g; ctx.fillRect(90, 220, 330, 290); ctx.restore(); } }
    beam(ctx, t, cam, { spot: SPOT });
  }

  // ---------------------------------------------------------------- labels (screen space, still while read, above the bottom 170 px)
  function tag(ctx, t, big, small, x, y, t0, t1, o = {}) {
    const a = ease.out(lin(t0, t0 + .6, t)), b = ease.inn(lin(t1 - .4, t1, t)); if (a <= 0 || b >= 1) return;
    const bs = o.size ?? 64, dark = !!o.dark, col = dark ? F7.ink : '#f6efdc', sc = dark ? rgba(F7.ink, .78) : rgba('#e6e2f2', .9);
    ctx.save(); ctx.font = `${bs}px "Instrument Serif"`; const bw = big ? ctx.measureText(big).width : 0; ctx.restore();
    const wv = Math.max(bw, small.length * 14.5, (o.small2 || '').length * 14.5) + 40, al = o.align === 'right' ? -1 : 0, x0 = x + al * wv;
    ctx.save(); ctx.beginPath(); ctx.rect(x0 - 10 + wv * b, y - bs * 1.2, wv * (a - b), bs * 1.2 + 90); ctx.clip();
    if (big) text(ctx, big, x0, y, { size: bs, font: 'Instrument Serif', color: o.col || col });
    text(ctx, small, x0 + 2, y + (big ? 40 : 0), { size: 17, weight: 600, color: sc, spacing: 4 });
    if (o.small2) text(ctx, o.small2, x0 + 2, y + (big ? 66 : 26), { size: 17, weight: 600, color: sc, spacing: 4 });
    if (o.gauge != null) { const gx = x0 + bw + 26, gy = y - bs * .42, gw = 220; ctx.strokeStyle = sc; ctx.lineWidth = 1.4; ctx.strokeRect(gx, gy, gw, 16); ctx.fillStyle = rgba('#bfe3ff', .85); ctx.fillRect(gx + 3, gy + 3, (gw - 6) * o.gauge, 10);
      ctx.fillStyle = sc; ctx.fillRect(gx + 3 + (gw - 6) * .75, gy - 6, 1.4, 28); }
    ctx.restore();
    ctx.fillStyle = rgba(o.bar || F7.amber, .9); ctx.fillRect(x0 - 22, y - bs * .8, 3, (bs * .8 + (big ? 48 : 8) + (o.small2 ? 26 : 0)) * (a - b));
  }
  function labels(ctx, t, An) {
    // the race
    if (An.base0) tag(ctx, t, '2000', '', An.base0[0] - 30, An.base0[1] + 48, A.racing + .2, A.growthE + .2, { size: 36, dark: true, bar: '#7a7f88' });
    tag(ctx, t, '33.8 %', 'RENEWABLES', 1210, 300, A.overtook + .35, A.growthE + .35, { dark: true, col: '#7a5c08', bar: '#d6aa34' });
    tag(ctx, t, '33.0 %', 'COAL', 1210, 470, A.overtook + .5, A.growthE + .35, { dark: true, col: '#3e4048', bar: '#6a6e78' });
    tag(ctx, t, null, 'SHARE OF WORLD ELECTRICITY · 2025', 170, 110, A.ember - .2, A.growthE + .35, { dark: true, small2: 'EMBER · GLOBAL ELECTRICITY REVIEW 2026', bar: '#d6aa34' });
    tag(ctx, t, null, "ALL OF 2025'S DEMAND GROWTH: CLEAN", 170, 200, A.cleanS + .1, A.growthE + .5, { dark: true, bar: '#d6aa34' });
    // Phoenix
    tag(ctx, t, 'Phoenix', 'TEST · MAY 2025', 150, 250, A.phoenix - .1, A.cut + .6, { small2: 'EPRI · EMERALD AI · ORACLE · NVIDIA' });
    if (An.dcL) tag(ctx, t, '−25 %', 'DATA CENTER POWER', An.dcL[0] + 20, An.dcL[1] - 120, A.cut - .15, A.every - .2, { bar: '#bfe3ff', gauge: 1 - .25 * ease.io(lin(A.cut + .1, A.quarterE, t)) });
    if (An.load0) tag(ctx, t, null, 'GRID DEMAND · ONE DAY', An.load0[0] - 40, An.load0[1] + 6, A.test + .6, A.every - .2, { bar: '#e9dcc0', align: 'right' });
    if (An.bracket) tag(ctx, t, '3 hours', 'AT THE EVENING PEAK', An.bracket[0] - 70, An.bracket[1] + 64, A.three - .05, A.every - .2, {});
    tag(ctx, t, null, 'EVERY JOB ON TARGET', 150, 250, A.every + .3, tOut - .02, { bar: '#bfe3ff' });
  }

  // ---------------------------------------------------------------- the one take
  function take(ctx, t) {
    if (t >= tIn && t < tOut) { const An = landAt(ctx, t); labels(ctx, t, An); return; }
    table(ctx, t);
  }
  const PR = HI.print;
  return [
    { t: HB, tr: 'cut', d: .1, print: PR, draw: take, sound: [{ f: 'card_ripple', t: flipT[0] + FD - .02, v: .4 }, { f: 'powerdown', t: A.cut + .1, v: .22 }] },
    { t: A.can, draw: take, print: PR, sound: [{ f: 'whoosh_airy', t: A.machinesE + .02, v: .3 }] },
    { t: A.cleanS, draw: take, print: PR, sound: [{ f: 'bloom', t: A.growthE + .05, v: .28 }, { f: 'whoosh_airy', t: A.neighborsE + .1, v: .25 }] },
    { t: A.every, draw: take, print: PR, sound: [{ f: 'tick', t: A.targetsE + .1, v: .3 }] },
    { t: A.make, draw: take, print: HO.print, sound: [{ f: 'whoosh_airy', t: A.mostE + .05, v: .3 }] },
  ];
};
