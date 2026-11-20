// Film 7 · c07 · the fork in twenty sixty (05a), from the c06>c07 dusk sky plate (H.b ≈ 428.85) to the c07>c08 paper plate (H.a ≈ 476.85). Builder: c07.
// ONE continuous take in one world: we stand at c04's dark table on the empty stage at dusk and look up; the sky is one picture at infinity
// (lib/f7_c07_fork.mjs "S plane") seen through a lens, the two Earths hang in it like two moons. Flying into an Earth = zooming the lens until
// its limb is c01's low-orbit view (the kit Earth, curve and dome). At the end the camera tips down onto the table (lib/f7_c07_table.mjs, a
// 1:1 copy of c04's) and pushes into card I's paper window = the c07>c08 paper plate. Every accent is anchored to a word (T.S / T.E).
//
// | shot | VO words (anchor)                                | image                                                                              | hero light         | camera                                      | flows on by                                   | ★ / sound                 |
// |------|--------------------------------------------------|------------------------------------------------------------------------------------|--------------------|---------------------------------------------|-----------------------------------------------|---------------------------|
// | 7.01 | So picture the same world in twenty sixty.       | out of the plate's dusk sky: tilt down; the rose glow becomes the horizon over     | the Earth          | tilt down 2.6 s (the plate scrolls up and    | continuous take                               |                           |
// |      | Two versions.                                    | the dark ridge; ONE night Earth hangs in it; 2060 (Instrument Serif). "Two": the   |                    | continues below), slow push                 |                                               | whoosh_airy (split, in    |
// |      |                                                  | Earth divides into two identical Earths side by side                               |                    |                                             |                                               | the pause after it)       |
// | 7.02 | In the first, superintelligence makes everything | THE FURNACE: zoom into the left Earth to its limb (c01's orbit look). The amber    | the vault's glow   | zoom 2.5 s (×11), then a slow drift          | continuous (lens zoom)                        | whoosh (dive)             |
// |      | cheaper, so we make more of everything. More     | curve climbs and presses the dome; the dome becomes the vault of a kiln: red-orange|                    |                                             |                                               |                           |
// |      | things. More mines. More land.                   | heat under the glass, smoke instead of stars; factories rise and multiply ("More   |                    |                                             |                                               |                           |
// |      |                                                  | things"), headframes + terraced pits ("mines"), the forest edge retreats ("land")  |                    |                                             |                                               |                           |
// | 7.03 | One planetary limit after another gives way. The | nine gauges on the dome's rim tip into the red one by one; "burns bright": the     | the glow, then     | hold, drift                                 | continuous                                    | steam_hiss (pause after   |
// |      | abundance burns bright, and then it fades. Call  | glow and the curve flare; "fades": windows go dark, the glow sinks to embers, the  | embers             |                                             |                                               | "fades.")                 |
// |      | it the furnace.                                  | smoke stays; title THE FURNACE                                                     |                    |                                             |                                               |                           |
// | 7.04 | In the second, abundance flows where it costs    | THE RING: the lens pulls back (the left Earth now a dim ember under smoke) and     | the sunrise        | zoom out/pan/zoom in 4.1 s                   | continuous                                    | bloom (sun clears the     |
// |      | the planet almost nothing. Knowledge. Health.    | flies into the right Earth: dawn on its limb; per word a library lights its tall   |                    |                                             |                                               | limb, pause after         |
// |      | Power from the sun.                              | windows, a clinic with a green cross, solar fields tilt up as the sun clears       |                    |                                             |                                               | "nothing.")               |
// | 7.05 | And where the planet is finite … we choose       | forests stay on both sides, teal sea with the sun's glitter, the bright town with  | the ring           | slow drift                                  | continuous                                    | shimmer_rings (ring       |
// |      | enough. Our lives grow richer while our appetite | people at figure scale; "wild places": birds lift from the forest; "enough": the   |                    |                                             |                                               | closes, pause after       |
// |      | shrinks. Call it the ring.                       | amber curve stops below the glass; "richer": every window glows; "shrinks": the    |                    |                                             |                                               | "ring.")                  |
// |      |                                                  | curve bends over and lies down into the ring, which lights around; THE RING        |                    |                                             |                                               |                           |
// | 7.06 | Same technology. Same intelligence.              | pull back to both Earths over the ridge: ember-and-smoke vs ring-and-dawn; the     | the cool line      | pull back 1.6 s, slow push                   | continuous                                    | chime (pause after        |
// |      |                                                  | same cool intelligence line arches from one to the other                           |                    |                                             |                                               | "intelligence.")          |
// | 7.07 | So which one are we building?                    | the camera tips down from the sky onto the table: the four stamped cards lie in    | the spotlight      | tilt + crane 1.6 s, push 1.6 s (log height) | PUSH INTO CARD I's paper window = the c07>c08 | whoosh_airy (push)        |
// |      |                                                  | the cold spotlight (c04/c05); push into card I's paper window                      |                    |                                             | PAPER PLATE (exact, windowCam)                |                           |
// ★ none (c06 carries the film's ★). Ambience: atmo/nightsky (dusk), a low kiln breath under the furnace (new sound), atmo/dawn_birds under the ring.
// Changes vs shots.md: the furnace's "mouth" is the dome itself turned into the glowing vault of a kiln (heat + smoke trapped under the glass; doors and
// arches are on the forbidden list), its nine dials sit on the dome rim; the cards at the end lie FACE UP with their questions and stamps (c04/c05
// leave them so, and card I's paper window is on its face; c08 turns them over).
import { W, H, rgba, clamp, lin, mix, sm, prng } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { F7, EARTH, CURVE, f7Prepare, camO, curveO, curve, dome, ring, ease, glowAt } from '../lib/f7_kit.mjs';
import { SP, lensOf, lensFor, localCam, duskSky, ground, earthDisc, forkPrepare, furnaceBack, furnaceDisc, furnaceProps, smoke, smokeCeiling, dials, DIALS,
  sunrise, sunriseLimb, dawnSky, ringDisc, ringProps, bendTo, RING_R, title } from '../lib/f7_c07_fork.mjs';
import { TB, CARDS, ROW, SPOT, tcam, camKeys, tableTop, beam, tablePaperCard, paperCardPrepare, windowCam, apply } from '../lib/f7_c07_table.mjs';

const TAU = Math.PI * 2, PI2 = Math.PI / 2;
const PRINT = { riso: .3 };
const bump = (t, a, b, c, d) => sm(lin(a, b, t)) * (1 - sm(lin(c, d, t)));
const LOGI = (a, b, u) => Math.exp(mix(Math.log(a), Math.log(b), u));

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c07', T);
  await f7Prepare(); await forkPrepare();
  await paperCardPrepare(CARDS.map((c) => ({ num: c.num, q: c.q, stamp: c.stamp })), HO.a);
  const S = (ph, n) => T.S('05a', ph, n), E = (ph, n) => T.E('05a', ph, n);
  const A = {
    so: S('So picture'), same: S('same world'), sixty: S('twenty sixty'), sixtyE: E('twenty sixty'), two: S('Two versions'), versionsE: E('Two versions'),
    in1: S('In the first'), sup: S('superintelligence makes'), cheaper: S('cheaper'), more: S('make more'), everythingE: E('more of everything'),
    things: S('More things'), mines: S('More mines'), land: S('More land'), landE: E('More land'),
    one: S('One planetary'), wayE: E('gives way'), burns: S('burns bright'), bright: S('bright'), fades: S('fades'), fadesE: E('fades'),
    call1: S('Call it the furnace'), furnace: S('furnace'), furnaceE: E('furnace'),
    in2: S('In the second'), flows: S('flows'), nothingE: E('almost nothing'), knowledge: S('Knowledge'), health: S('Health'), power: S('Power from'), sun: S('sun'), sunE: E('the sun'),
    finite: S('And where'), wild: S('wild places'), choose: S('choose enough'), enoughE: E('choose enough'), richer: S('richer'), appetite: S('appetite shrinks'), shrinksE: E('appetite shrinks'),
    call2: S('Call it the ring'), ringE: E('Call it the ring'),
    tech: S('Same technology'), intel: S('Same intelligence'), intelE: E('Same intelligence'), which: S('So which'), building: S('building'), buildingE: E('building'),
  };
  const T0 = HI.b, HA = HO.a, tEnd = HA - 1 / 30 - .002;

  // ============================================================== the lens camera (S plane: cx, cy, z)
  const PV = [960, 540, 1], B = [960, SP.C[1] - 70, 1];   // the plate view; the wide view (the Earths at screen y 470)
  const LC0 = { x: 200, y: -3200, z: .9 };                         // the furnace framing (c01's thumbnail family: limb, curve, dome rim)
  const RC0 = { x: 120, y: -3080, z: 1.45 };                       // the ring framing (closer: the town, the people, the ring arc)
  const tTilt = A.sixty + .15, tDive0 = A.in1 - .12, tDive1 = A.in1 + 2.35, tLR0 = A.furnaceE + .25, tLR1 = A.nothingE - .55, tBack0 = A.ringE + .12, tBack1 = A.tech + 1.25;
  const tA = A.intelE + .1;                                          // the tip down to the table starts (pause after "intelligence.")
  const tB = A.buildingE - .05;                                      // top-down over the four cards; the push starts
  const holdL = (t) => { const u = ease.sine(lin(tDive1, tLR0, t)); return { x: mix(200, 238, u), y: mix(-3200, -3186, u), z: LOGI(.9, .975, u) }; };
  const holdR = (t) => { const u = ease.sine(lin(tLR1, tBack0, t)); return { x: mix(120, 92, u), y: mix(-3080, -3090, u), z: LOGI(1.45, 1.55, u) }; };
  const zPush = (t) => LOGI(1, 1.035, ease.sine(lin(T0, tDive0, t)));
  // zoom between a wide state a (z small) and a close state b so that the target grows in place (lateral follows 1/z)
  const zoomTo = (a, b, u) => { const z = LOGI(a[2], b[2], u), lu = (1 / a[2] - 1 / z) / (1 / a[2] - 1 / b[2]); return [mix(a[0], b[0], lu), mix(a[1], b[1], lu), z]; };
  const lensC = (t) => {
    if (t < tDive0) { const u = ease.io(lin(T0, tTilt, t)) * .985 + .015 * lin(T0, tTilt, t); return [960, mix(PV[1], B[1], u), zPush(t)]; }
    if (t < tDive1) { const a = [960, B[1], zPush(tDive0)], l = lensFor(SP.L, LC0); return zoomTo(a, [l.cx, l.cy, l.z], ease.io(lin(tDive0, tDive1, t))); }
    if (t < tLR0) { const l = lensFor(SP.L, holdL(t)); return [l.cx, l.cy, l.z]; }
    if (t < tLR1) {
      const a = lensFor(SP.L, holdL(tLR0)), b = lensFor(SP.R, RC0), u = lin(tLR0, tLR1, t), s = ease.io(u), d = Math.sin(Math.PI * u) ** 2;
      return [mix(a.cx, b.cx, s), mix(a.cy, b.cy, s) + (B[1] + 10 - mix(a.cy, b.cy, s)) * d, Math.exp(mix(Math.log(a.z), Math.log(b.z), ease.sine(u)) - (Math.log(mix(a.z, b.z, .5)) - Math.log(1.3)) * d)];
    }
    if (t < tBack0) { const l = lensFor(SP.R, holdR(t)); return [l.cx, l.cy, l.z]; }
    if (t < tBack1) { const l = lensFor(SP.R, holdR(tBack0)); return zoomTo(B, [l.cx, l.cy, l.z], 1 - ease.io(lin(tBack0, tBack1, t))); }
    return [960, B[1], LOGI(1, 1.022, ease.sine(lin(tBack1, tA + 2, t)))];
  };

  // ============================================================== the table camera (from tA): tip down, then push into card I's window
  const lensA = lensC(tA), lzA = lensOf({ cx: lensA[0], cy: lensA[1], z: lensA[2] }), p0 = Math.atan((lzA.Y(SP.HZ) - H / 2) / TB.f);
  const hzOf = (p) => H / 2 + TB.f * Math.tan(p);
  const ROWc = { X: ROW.reduce((s, c) => s + c.X, 0) / 4, Z: ROW.reduce((s, c) => s + c.Z, 0) / 4 };
  const KT = [[tA, [0, 125, -115, p0, 0]], [tA + 1.1, [0, 100, -70, -.7, 0]], [tB, [ROWc.X, 64, ROWc.Z + .6, -PI2, 0]]];
  const WC = windowCam(ROW[0]);
  const camT = (t) => {
    if (t < tB) return camKeys(t, KT);
    const a = camKeys(tB, KT), u = ease.sine(lin(tB, tEnd, t)), hu = Math.exp(mix(Math.log(a[1] - .03), Math.log(WC.y - .03), u)) + .03;
    const lu = 1 - (hu - WC.y) / (a[1] - WC.y);   // the lateral move follows the height, so the window grows in place
    return [mix(a[0], WC.x, lu), hu, mix(a[2], WC.z, lu), -PI2, mix(a[4], WC.yaw, lu)];
  };

  // ============================================================== the two worlds' states
  const split = (t) => ease.out(lin(A.two - .06, A.two + .9, t));
  const CW = curveO(), iS = 30;
  const curveT0 = A.sup - .1, curveT1 = A.everythingE + .2;
  const F = (t) => {
    const build = sm(lin(A.sup - .3, A.landE + .4, t)), burn = bump(t, A.burns - .1, A.bright + .25, A.fades - .15, A.fades + .5), ember = sm(lin(A.fades - .1, A.fadesE + .8, t));
    const I = (.3 + .55 * build + .25 * burn) * (1 - .55 * ember) * sm(lin(A.in1 - .4, A.sup, t));
    const dial = DIALS.map((_, i) => { const d0 = A.one + .12 + i * (A.wayE - .35 - A.one - .12) / 8; return lin(d0, d0 + .55, t); });
    return { I, hot: (1 + .7 * burn) * (1 - .6 * ember), burn, ember, t0: A.cheaper - .05, things: A.things - .12, mines: A.mines - .1, land: A.land - .05, out0: A.fades - .05, dial, pall: sm(lin(A.more, A.landE + 1.5, t)) * (1 - .25 * ember) };
  };
  const CWR = curveO({ C: [200, -3330] });
  const G = (t) => ({ dawn: sm(lin(A.in2 + .6, A.sunE + .4, t)), know: A.knowledge, health: A.health, sun: A.power, rich: sm(lin(A.richer - .35, A.richer + .9, t)), wild: A.wild - .1 });
  const sunH = (t) => mix(-70, 58, sm(lin(A.flows, A.sun + .45, t)));
  const ringU = (t) => sm(lin(A.call2 - .2, A.ringE + .3, t));
  const lineU = (t) => ease.io(lin(A.call2 + .05, A.tech + .8, t));
  const bendU = (t) => lin(A.appetite - .15, A.shrinksE + .5, t);
  const rCurveU = (t) => ease.out(lin(A.finite - .1, A.choose + .2, t));
  // the cool line: from the left Earth's city over both to the right Earth's city (S plane)
  const k0 = SP.k0, cL = [SP.L[0] + CURVE.S[0] * k0, SP.L[1] + CURVE.S[1] * k0], cR = [SP.R[0] + CURVE.S[0] * k0, SP.R[1] + CURVE.S[1] * k0];
  const ARCH = []; for (let i = 0; i <= 120; i++) { const q = i / 120, x = mix(cL[0], cR[0], q), y = mix(cL[1], cR[1], q) - 205 * Math.sin(Math.PI * q) - 26 * Math.sin(Math.PI * q) ** 6; ARCH.push([x, y, .55 + .45 * Math.sin(Math.PI * q)]); }
  const archU = (t) => ease.io(lin(A.intel - .15, A.intelE - .05, t));

  // ============================================================== one Earth with its world
  function leftEarth(ctx, t, lz, E, f, pass) {
    if (pass === 'back') { if (f.I > 0) { const m = camO(localCam(lz, E)); furnaceBack(ctx, t, m, f); } return; }
    const eo = earthDisc(ctx, t, lz, E, { heat: clamp(f.I * 1.1), city: 1 + .6 * f.burn - .85 * f.ember, atmo: 1 - .55 * clamp(f.I * 1.5) });
    if (eo.off) return;
    const m = eo.m, lc = eo.lc;
    furnaceDisc(ctx, t, m, f);
    const tops = furnaceProps(ctx, t, m, f);
    smoke(ctx, t, m, tops, f); smokeCeiling(ctx, t, m, f);
    const cu = ease.io(lin(curveT0, curveT1, t)), touch = sm(lin(curveT1 - .25, curveT1 + .15, t)) * (.7 + .35 * f.burn) * (1 - .55 * f.ember);
    dome(ctx, t, lc, { contact: CURVE.C, touch, warm: .9 * f.I, glass: .65 * f.I, flare: .5 * f.burn, lines: .12 * touch, linesA: .5, sparks: SPARKS.filter((s) => s < t && s < A.fades) });
    if (cu > 0) curve(ctx, t, CW.map(([x, y, w]) => [m.X(x), m.Y(y), w]), { u: cu, w: 1.15 + .35 * f.burn, br: (1 + .8 * f.burn) * (1 - .55 * f.ember), a: 1 - .25 * f.ember, sparks: (3 + 12 * f.burn) * (1 - f.ember), burst: t > A.bright && t < A.bright + 2 ? A.bright + .02 : null, tipA: 1 - .5 * f.ember, seed: 1 });
    dials(ctx, t, m, f);
  }
  const SPARKS = []; { const r = prng(707); for (let s = curveT1 + .4; s < A.fades; s += .3 + r() * .4) SPARKS.push(s); }
  function rightEarth(ctx, t, lz, E, g, pass) {
    const lc = localCam(lz, E), m = camO(lc);
    if (pass === 'back') { if (g.dawn > 0) { dawnSky(ctx, t, m, g.dawn); sunrise(ctx, t, m, { u: 1, h: sunH(t), br: .6 + .4 * g.dawn, k: .55 }); } return; }
    const eo = earthDisc(ctx, t, lz, E, { city: 1 - .5 * g.dawn, rim: 1 - .6 * g.dawn }); if (eo.off) return;
    ringDisc(ctx, t, m, g.dawn); sunriseLimb(ctx, t, m, { u: g.dawn });
    if (t > A.in2 - .6) ringProps(ctx, t, m, g);
    if (g.dawn > 0) dome(ctx, t, lc, { glass: .45 * g.dawn, touch: 0, skyO: null });
    // the amber curve: rises gently from the town, stops below the glass ("enough"), bends over into the ring ("shrinks")
    const cu = rCurveU(t), bu = bendU(t), ru = ringU(t), w = 46 * m.k + 9;
    if (ru > 0) ring(ctx, t, { cx: m.X(0), cy: m.Y(0), r: RING_R * m.k - w * .35, w, a: ru, from: -PI2 - .048, to: -PI2 - .048 + TAU, line: lineU(t), seed: 6 });
    if (cu > 0 && lineU(t) < 1) { const P = bendTo(CWR, iS, bu); curve(ctx, t, P.map(([x, y, ww]) => [m.X(x), m.Y(y), ww]), { u: cu, w: .95, br: 1 - .15 * bu, sparks: 1.5 * (1 - bu), tipA: 1 - .4 * sm(lin(A.choose, A.enoughE, t)) - .6 * bu, shimmer: .7, seed: 2, a: 1 - lineU(t) }); }
  }

  // ============================================================== the world
  function sky(ctx, t, lz) {
    duskSky(ctx, t, lz);
    const sp = split(t), EL = [mix(SP.C[0], SP.L[0], sp), SP.L[1]], ER = [mix(SP.C[0], SP.R[0], sp), SP.R[1]];
    const f = F(t), g = G(t);
    leftEarth(ctx, t, lz, EL, f, 'back'); rightEarth(ctx, t, lz, ER, g, 'back');
    if (sp > 0) rightEarth(ctx, t, lz, ER, g, 'disc');
    leftEarth(ctx, t, lz, EL, f, 'disc');
    ground(ctx, t, lz);
    // the cool intelligence line over both worlds
    const au = archU(t); if (au > 0) curve(ctx, t, ARCH.map(([x, y, w]) => [lz.X(x), lz.Y(y), w]), { tone: 'cool', u: au, w: 1.05, glint: 1, seed: 5, tipA: 1 - sm(lin(A.intelE + .2, A.intelE + .8, t)) });
  }
  function world(ctx, t) {
    if (t < tA) {
      const c = lensC(t), lz = lensOf({ cx: c[0], cy: c[1], z: c[2] });
      sky(ctx, t, lz);
      title(ctx, t, '2060', 960, 180, A.sixty - .05, A.in1 + .1, { size: 124, align: 'center', bar: rgba(F7.amber, .9) });
      title(ctx, t, 'THE FURNACE', 150, 420, A.call1 + .05, tLR0 + .55, { size: 84, bar: rgba('#e2552c', .95) });
      title(ctx, t, 'THE RING', 150, 300, A.call2 + .05, tBack0 + .55, { size: 84, bar: rgba(F7.amber, .95) });
      return;
    }
    // the tip down to the table: the sky above the horizon (the same lens picture, moved up with the tilt), the table below
    const c = camT(Math.min(t, tEnd)), cam = tcam({ x: c[0], y: c[1], z: c[2], pitch: c[3], yaw: c[4] });
    const dy = hzOf(c[3]) - hzOf(p0);
    if (hzOf(c[3]) > -40) { const lz = lensOf({ cx: lensA[0], cy: lensA[1], z: lensA[2], dy }); sky(ctx, t, lz); }
    else { ctx.fillStyle = TB.black; ctx.fillRect(0, 0, W, H); }
    tableTop(ctx, t, cam, { spot: SPOT });
    for (let i = 1; i < 4; i++) tablePaperCard(ctx, t, cam, { ...ROW[i], num: i + 1, q: CARDS[i].q, stamp: CARDS[i].stamp, stampU: 1 });
    { const M = cam.flatM(SPOT.x, SPOT.z, 0, 1, 30); if (M && cam.pitch < -.3) { ctx.save(); apply(ctx, M); const g = ctx.createRadialGradient(0, 0, SPOT.r * .55, 0, 0, SPOT.r * 1.5); g.addColorStop(0, 'rgba(8,8,14,0)'); g.addColorStop(1, 'rgba(8,8,14,.72)'); ctx.fillStyle = g; ctx.fillRect(-400, -400, 800, 800); ctx.restore(); } }
    tablePaperCard(ctx, t, cam, { ...ROW[0], num: 1, q: CARDS[0].q, stamp: CARDS[0].stamp, stampU: 1, plateT: t });
    beam(ctx, t, cam, { spot: SPOT, a: sm(clamp((-.5 - c[3]) / .5)) });
  }

  return [
    { t: T0, tr: 'cut', d: .1, draw: world, print: HI.print, sound: [{ f: 'whoosh_airy', t: A.two - .14, v: .25 }, { f: 'whoosh', t: A.versionsE + .1, v: .35 }] },
    { t: A.sup, draw: world, print: PRINT, sound: [{ f: 'steam_hiss', t: A.fadesE + .05, v: .3 }] },
    { t: A.in2 - .4, draw: world, print: PRINT, sound: [{ f: 'bloom', t: A.nothingE + .04, v: .4 }, { f: 'shimmer_rings', t: A.ringE + .04, v: .45 }] },
    { t: A.tech - .3, draw: world, print: PRINT, sound: [{ f: 'chime', t: A.intelE + .05, v: .3 }] },
    { t: tA, draw: world, print: HO.print, sound: [{ f: 'whoosh_airy', t: A.buildingE + .02, v: .3 }] },
  ];
};
