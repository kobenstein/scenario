// Film 7 · c03 · the wall (02a), from the c02>c03 sky plate (H.b ≈ 134.71) to the c03>c04 glass plate (H.a ≈ 189.23). Builder: c03.
// ONE continuous take in the orbit world of c01 (kit sky, earthHorizon, the amber curve, the dome); every accent anchored to a word (T.S / T.E).
// Pieces: lib/f7_c03_wall.mjs (plate sky continuation, sunrise + streams, year run, Kardashev ladder, the stage whose screen is the glass plate).
//
// | shot | VO words (anchor)                               | image                                                                              | hero light         | camera                                      | flows on by                                   | ★ / sound                 |
// |------|-------------------------------------------------|------------------------------------------------------------------------------------|--------------------|---------------------------------------------|-----------------------------------------------|---------------------------|
// | 3.01 | Breathtaking. But does physics agree?           | out of the plate's night sky: tilt down; the curve's tip, then the dome contact,   | the contact        | tilt down 2.4 s (the plate sky scrolls up   | continuous take                               | shimmer_rings after       |
// |      |                                                 | then the night Earth rise into frame (c01 thumbnail framing); "physics": the dome |                    | and ends in the kit sky below it)           |                                               | "agree?"                  |
// |      |                                                 | rim glints along its edge                                                          |                    |                                             |                                               |                           |
// | 3.02 | The physicist Tom Murphy … century after century| TOM MURPHY · UC SAN DIEGO, then +2.3 % / year written in light; a bead of light   | the bead           | slow push down to the curve's foot ("tiny"),| continuous                                    |                           |
// |      |                                                 | (TODAY) creeps along the flat foot, decade ticks; "compounds": it runs up the     |                    | then pulls back with the runner              |                                               |                           |
// |      |                                                 | curve, faster and faster; ×10 · ×100 · ×1,000 at each century                      |                    |                                             |                                               |                           |
// | 3.03★| Keep that up … four hundred years, … all the    | "four hundred years": the bead reaches the dome (×10,000), lines of light spread; | the sun            | pull wide 4.4 s                             | continuous                                    | glass_hum (contact),      |
// |      | sunlight that falls on Earth.                   | the sun rises over the limb, the day side's light flows in golden threads along   |                    |                                             |                                               | bloom in the pause        |
// |      |                                                 | the limb into the curve, which burns brighter than ever                           |                    |                                             |                                               |                           |
// | 3.04 | And around that same time … to a boil. That's   | (c01 1.12 family) land and sea shimmer, steam wisps from the sea, the dome glows  | warm haze          | move in 3 s, hold with life                 | continuous                                    |                           |
// |      | the number you heard at the start.              | warm inside; the c01 label ~400 YEARS comes back                                  |                    |                                             |                                               |                           |
// | 3.05 | On the Kardashev scale … not even type one yet. | a radial ladder of light rises from the limb: rung I sits ON the dome (all the    | rung I             | pull left/out 2.4 s, slow push              | continuous                                    | whoosh_airy (pull),       |
// |      |                                                 | energy reaching the planet), II and III up in the stars; "we're": a warm dot US   |                    |                                             |                                               | chime after "yet"         |
// |      |                                                 | climbs the rail and stops just below rung I. Label Kardashev scale · 1964          |                    |                                             |                                               |                           |
// | 3.06 | To be clear … thought experiment … a ceiling.   | Thought experiment / NOT A FORECAST; the heat is gone; the curve relaxes, then     | the dome rim       | to the contact framing 2.3 s, slow push     | continuous                                    | shimmer_rings (ceiling)   |
// |      |                                                 | rises once more and rests against the glass: the rim light runs across the frame  |                    |                                             |                                               |                           |
// | 3.07 | And the promise you just heard doesn't mention  | the camera follows the curve down to its foot: a stage grows out of the land, its | the screen         | push down + in to the screen, then THROUGH  | the screen's light goes out (CRT line): its   | screen_off, whoosh        |
// |      | one.                                            | screen says SUSTAINABLE ABUNDANCE, no ceiling over it; after "one." it switches   |                    | it (exp. zoom to 17.5×)                     | dark glass IS the c03>c04 glass plate and     |                           |
// |      |                                                 | off                                                                                |                    |                                             | grows over the frame by H.a                   |                           |
import { W, H, rgba, clamp, lin, mix, sm, prng, text } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { F7, EARTH, CURVE, f7Prepare, skyWarm, sky, camO, earthHorizon, curveO, curve, dome, seaSpots, onSphere, ease, keys, mod, glowAt } from '../lib/f7_kit.mjs';
import { patchPrepare, earthPatch } from '../lib/f7_c03_patch.mjs';
import { plateSky, sunrise, sunriseLimb, streams, yearRun, ptAt, ladder, LAD, stage, STG } from '../lib/f7_c03_wall.mjs';

const TAU = Math.PI * 2;
const PRINT = { riso: .3 };
const bump = (t, a, b, c, d) => sm(lin(a, b, t)) * (1 - sm(lin(c, d, t)));

export default async (T, R) => {
  await f7Prepare(); await patchPrepare();
  const { in: HI, out: HO } = handsOf('c03', T);
  const S = (ph, n) => T.S('02a', ph, n), E = (ph, n) => T.E('02a', ph, n);
  const A = {
    breath: S('Breathtaking'), physics: S('physics'), agreeE: E('agree'), tom: S('Tom Murphy'), calc: S('simple calculation'), let: S('Let our'), grow: S('grow by'), two: S('two percent'), yearE: E('percent a year'),
    tiny: S('tiny'), compounds: S('compounds'), century: S('century'), keep: S('Keep that'), four: S('four hundred'), yearsE: E('hundred years'), need: S("we'd need"), sunlight: S('sunlight'), earthE: E('falls on Earth'),
    around: S('And around'), waste: S('waste heat'), boil: S('boil'), number: S("That's the number"), startE: E('at the start'),
    kard: S('On the Kardashev'), typeOne: S('type one civilization'), uses: S('uses all'), planetE: E('its planet'), measure: S('By that measure'), were: S("we're not"), notEven: S('not even'), yetE: E('one yet'),
    clear: S('To be clear'), thought: S('thought experiment'), forecast: S('forecast'), shows: S('it shows'), appetite: S('Our appetite'), ceiling: S('ceiling'), ceilingE: E('ceiling'),
    promise: S('And the promise'), doesnt: S("doesn't mention"), oneE: E('mention one'),
  };
  const T0 = HI.b, HA = HO.a, tEnd = HA - 1 / 30;
  const CW = curveO(), iS = 30;

  // ============================================================== camera (world x, y, zoom; zoom interpolates in log space)
  const KC = [
    [T0, [200, -3230, .86]],
    [A.agreeE + .4, [222, -3262, .93], ease.sine],
    [A.let - .1, [190, -3215, .98], ease.sine],
    [A.compounds - .1, [-40, -2992, 1.85]],                    // the slow push down to the foot ("tiny")
    [A.yearsE - .2, [230, -3232, .95]],                       // pull back with the runner
    [A.earthE + .2, [800, -2800, .5]],                         // ★ wide: the sun over the limb
    [A.boil - .4, [255, -3150, .78]],                          // in to the heat
    [A.startE + .05, [240, -3180, .84], ease.sine],
    [A.kard + 1.9, [-860, -3470, .56]],                        // pull to the ladder
    [A.yetE + .55, [-820, -3455, .6], ease.sine],
    [A.thought + .2, [240, -3300, 1.12]],                      // to the contact (the ceiling)
    [A.promise - .3, [262, -3322, 1.2], ease.sine],
    [A.doesnt - .25, [-232, -2962, 4.1]],                      // follow the curve down to the stage
    [A.oneE + .05, [-236, -2958, 5.0], ease.sine],
    [tEnd, [-238, -2954, 17.5], (x) => Math.pow(x, 1.6)],      // through the screen: accelerating push
  ];
  const camAt = (t) => {
    if (t <= KC[0][0]) return KC[0][1];
    for (let i = 1; i < KC.length; i++) if (t <= KC[i][0]) {
      const [t0, a] = KC[i - 1], [t1, b, f] = KC[i], u = (f || ease.io)(lin(t0, t1, t));
      return [mix(a[0], b[0], u), mix(a[1], b[1], u), Math.exp(mix(Math.log(a[2]), Math.log(b[2]), u))];
    }
    return KC[KC.length - 1][1];
  };
  // the opening tilt: the world starts D px lower (we look up into the plate's sky) and rises into place
  const D = 1500, tiltE = A.agreeE - .9;
  const tiltD = (t) => { const x = lin(T0, tiltE, t); return D * (1 - (.78 * ease.io(x) + .22 * ease.out(x))); };   // leaves the plate at once (no dead start), lands softly
  const skyBase = { ox: 1040, oy: -170, ang: -.62 };
  const skyAt = (t, c) => { const d = tiltD(t); return { ox: skyBase.ox - (c[0] - 200) * .03 + d * Math.sin(skyBase.ang), oy: skyBase.oy - (c[1] + 3230) * .04 + d * Math.cos(skyBase.ang), ang: skyBase.ang }; };

  // ============================================================== states over time
  const sRun = (t) => .055 * lin(A.grow, A.compounds - .15, t) + .945 * lin(A.compounds - .15, A.yearsE - .55, t);
  const tRun0 = A.compounds - .15, tRun1 = A.yearsE - .55;
  const cent = [1, 2, 3, 4].map((c) => tRun0 + (tRun1 - tRun0) * (c / 4 - .055) / .945);
  const tHit = tRun1;                                                   // the bead reaches the dome
  const heat = (t) => sm(lin(A.waste - .2, A.boil + .1, t)) * (1 - sm(lin(A.startE - .3, A.kard + 1.4, t)));
  const sunU = (t) => lin(A.need - .3, A.sunlight + .1, t);
  const front = (t) => ease.io(lin(A.sunlight - .7, A.earthE - .3, t));
  const streamA = (t) => sm(lin(A.sunlight - .8, A.sunlight - .2, t)) * (1 - sm(lin(A.around + 1.0, A.waste + .9, t)));
  const flareC = (t) => bump(t, A.earthE - .9, A.earthE + .05, A.around + .8, A.waste + 1.2);
  const relax = (t) => sm(lin(A.clear + .2, A.thought + .3, t)) * (1 - ease.io(lin(A.shows, A.ceiling + .25, t)));
  const ladGrow = (t) => lin(A.kard + .15, A.kard + 2.6, t);
  const rTop = (t) => mix(LAD.r0, LAD.r1, ease.out(ladGrow(t)));
  const lab = LAD.rungs.map((rr) => { for (let t = A.kard; t < A.kard + 4; t += 1 / 30) if (rTop(t) >= rr + 60) return t; return A.kard + 3; });
  const stageG = (t) => lin(A.promise - .15, A.promise + .75, t);
  const offU = (t) => lin(A.oneE + .08, A.oneE + .62, t);

  // ============================================================== small pieces
  function label(ctx, t, big, small, x, y, t0, t1, tb) {
    // small caps line from t0, the big line wipes in from tb (default t0); both wipe out together at t1; an amber bar marks it
    tb = tb ?? t0;
    const a = ease.out(lin(t0, t0 + .6, t)), ab = ease.out(lin(tb, tb + .6, t)), b = ease.inn(lin(t1 - .4, t1, t)); if (a <= 0 || b >= 1) return;
    ctx.save(); ctx.font = '76px "Instrument Serif"'; const bw = big ? ctx.measureText(big).width : 0; ctx.restore();
    const wv = Math.max(bw, small.length * 15.5) + 40;
    ctx.save(); ctx.beginPath(); ctx.rect(x - 10 + wv * b, y - 90, wv * (Math.max(a, ab) - b), 160); ctx.clip();
    if (big && ab > 0) { ctx.save(); ctx.beginPath(); ctx.rect(x - 10, y - 90, (bw + 30) * ab, 110); ctx.clip(); text(ctx, big, x, y, { size: 76, font: 'Instrument Serif', color: '#f6efdc' }); ctx.restore(); }
    ctx.save(); ctx.beginPath(); ctx.rect(x - 10, y + 10, wv * a, 60); ctx.clip(); text(ctx, small, x + 2, y + 44, { size: 18, weight: 600, color: rgba('#cfd6ee', .9), spacing: 4 }); ctx.restore();
    ctx.restore();
    ctx.fillStyle = rgba(F7.amber, .9); ctx.fillRect(x - 24, y - 62, 3, 116 * (a - b));
  }
  const sea = seaSpots().filter(([x, y]) => x > -300 && x < 1500 && y < -2780).slice(0, 34);
  function steam(ctx, t, m, a) {   // (copied from sc01: steam wisps rising from the sea)
    if (a <= 0) return;
    ctx.save(); ctx.lineCap = 'round';
    sea.forEach(([x, y], i) => {
      const v = onSphere(x, y); if (!v) return;
      for (let k = 0; k < 2; k++) {
        const life = 4.5, ph = mod(t / life + i * .37 + k * .5, 1), X = m.X(x), Y = m.Y(y), Lh = (40 + 50 * ph) * m.k;
        ctx.beginPath(); for (let q = 0; q <= 12; q++) { const f = q / 12; ctx[q ? 'lineTo' : 'moveTo'](X + Math.sin(f * 5 + t * 1.3 + i) * 6 * m.k * f + f * 12 * m.k, Y - f * Lh - ph * 20 * m.k); }
        const al = a * Math.sin(Math.PI * ph);
        ctx.strokeStyle = rgba('#b8b0e8', .035 * al); ctx.lineWidth = (10 + 16 * ph) * m.k; ctx.stroke();
        ctx.strokeStyle = rgba('#d8d4f4', .06 * al); ctx.lineWidth = (4 + 6 * ph) * m.k; ctx.stroke();
      }
    });
    ctx.restore();
  }
  const sparkTimes = []; { const r = prng(313); for (let t = tHit + .2; t < A.kard; t += .25 + r() * .4) sparkTimes.push(t); }

  // ============================================================== the take
  function O(ctx, t) {
    const c = camAt(t), d = tiltD(t), cam = { x: c[0], y: c[1] - d / c[2], z: c[2] }, m = camO(cam), sO = skyAt(t, c);
    sky(ctx, t, sO);
    if (d > D - H - 360) plateSky(ctx, t, d - D);
    // the sun first: the disc of the Earth hides it until it clears the limb
    const su = sunU(t), sunVis = su > 0 && t < A.kard;
    if (sunVis) sunrise(ctx, t, m, { u: su, br: 1 + .25 * flareC(t) });
    const ht = heat(t);
    earthHorizon(ctx, t, cam, { heat: ht });
    if (t > A.clear) earthPatch(ctx, t, cam);
    if (sunVis) sunriseLimb(ctx, t, m, { u: su });
    steam(ctx, t, m, ht);
    // the curve (it relaxes below the glass in 3.06 and rises again into it)
    const rl = relax(t), C = [CURVE.C[0] - 22 * rl, CURVE.C[1] + 120 * rl], CWt = rl > 0 ? curveO({ C }) : CW;
    // the dome
    const hitU = lin(tHit - .05, tHit + .15, t), ceil = ease.io(lin(A.ceiling, A.ceilingE + .7, t));
    const touch = (.55 + .2 * Math.sin(t * 1.3) ** 2 + .5 * sm(hitU) * (1 - .6 * lin(tHit + 1, tHit + 4, t)) + .5 * flareC(t)) * (1 - rl) + .4 * ceil;
    dome(ctx, t, cam, {
      contact: C, touch, reveal: ceil, glass: .6 + .4 * ceil,
      flare: .55 * bump(t, A.physics - .1, A.physics + .3, A.agreeE + .1, A.agreeE + .9) + .5 * bump(t, A.ceiling - .05, A.ceiling + .25, A.ceilingE + .5, A.promise + 1.2),
      lines: ease.out(lin(tHit, tHit + 1.8, t)) * (1 - rl), linesA: .8 - .5 * lin(tHit + 3, tHit + 8, t),
      warm: .7 * Math.max(ht, .5 * flareC(t)), skyO: sO, sparks: sparkTimes,
    });
    // ★ the day side's light flows into the curve
    streams(ctx, t, m, CW, iS, { front: front(t), a: streamA(t) });
    const pts = CWt.map(([px, py, w]) => [m.X(px), m.Y(py), w]), fl = flareC(t);
    curve(ctx, t, pts, { w: 1.12 + .2 * fl + .12 * sm(hitU), br: 1 + .95 * fl + .2 * sm(hitU) * (1 - lin(tHit + 1, tHit + 3, t)), sparks: 3 + 9 * fl, burst: t > A.earthE - .1 && t < A.earthE + 2 ? A.earthE - .05 : (t > tHit && t < tHit + 2 ? tHit : null), seed: 1 });
    // the years run up the curve
    const s = sRun(t), runA = 1 - lin(A.need, A.need + .5, t);
    if (t > A.grow - .2 && runA > 0) {
      yearRun(ctx, t, m, CW, iS, { s, a: runA, bead: ease.out(lin(A.grow - .1, A.grow + .4, t)) * (1 - sm(lin(tHit, tHit + .3, t))), cent, out: A.need + .5 });
      // TODAY at the start of the run (on the land at the curve's foot)
      const la = ease.out(lin(A.grow + .1, A.grow + .6, t)) * (1 - ease.inn(lin(A.compounds + .3, A.compounds + .8, t)));
      if (la > 0) {   // TODAY: a label above the line with a fine leader down to the bead
        const [x, y] = ptAt(CW, iS, 0), X = m.X(x), Y = m.Y(y), top = Y - 130;
        ctx.save(); ctx.strokeStyle = rgba('#fff1d6', .6 * la); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(X, Y - 26); ctx.lineTo(X, mix(Y - 26, top + 8, la)); ctx.stroke();
        ctx.beginPath(); ctx.rect(X - 60, top - 30, 120, 40 * la); ctx.clip(); text(ctx, 'TODAY', X, top, { size: 20, weight: 600, color: rgba('#ffe2b8', .95), spacing: 6, align: 'center' }); ctx.restore();
      }
    }
    // the Kardashev ladder (rung I sits on the dome; the dome answers where the rail crosses it)
    if (t > A.kard && t < A.promise) {
      const f0 = bump(t, A.typeOne - .1, A.typeOne + .25, A.typeOne + .9, A.typeOne + 1.8) + .8 * bump(t, A.uses + .3, A.uses + .7, A.planetE - .2, A.planetE + .6) + .5 * bump(t, A.yetE - .2, A.yetE + .1, A.yetE + .5, A.yetE + 1.4);
      ladder(ctx, t, m, { grow: ladGrow(t), lab, flare: [f0, 0, 0], us: lin(A.were - .1, A.notEven + .2, t), usLift: 9 * bump(t, A.notEven + .25, A.notEven + .55, A.notEven + .7, A.yetE), usLab: A.were + .3 });
      if (f0 > 0) { const ph = LAD.phi, X = m.X(Math.sin(ph) * EARTH.RD), Y = m.Y(-Math.cos(ph) * EARTH.RD); glowAt(ctx, X, Y, 240 * m.k, .25 * f0, F7.rim, '#ffffff'); }
    }
    // the stage at the foot; its screen is the c03>c04 glass plate
    stage(ctx, t, m, { grow: stageG(t), lit: 1, off: offU(t) }, HO.plate);
    // labels (screen space, still while read)
    label(ctx, t, '+2.3 % / year', 'TOM MURPHY · UC SAN DIEGO', 150, 300, A.tom + .05, A.need - .2, A.two - .1);
    label(ctx, t, '~400 YEARS', 'THOUGHT EXPERIMENT · TOM MURPHY · UC SAN DIEGO', 150, 300, A.number - .05, A.kard + .4);
    label(ctx, t, 'Kardashev scale', 'NIKOLAI KARDASHEV · 1964', 760, 190, A.kard + .7, A.yetE + .5);
    label(ctx, t, 'Thought experiment', 'NOT A FORECAST', 150, 330, A.thought, A.ceiling - .1, A.thought + .05);
  }

  // pre-build the rotated sky for every offset the take uses
  { const off = []; for (let t = T0; t < HA; t += 1 / 30) { const so = skyAt(t, camAt(t)); off.push([so.ox, so.oy]); } await skyWarm(skyBase.ang, off); }

  return [
    { t: T0, tr: 'cut', d: .1, draw: O, print: HI.print, sound: [{ f: 'shimmer_rings', t: A.agreeE + .05, v: .35 }] },
    { t: A.keep, draw: O, print: PRINT, sound: [{ f: 'glass_hum', t: tHit, v: .55 }, { f: 'bloom', t: A.earthE + .05, v: .5 }] },
    { t: A.kard - .3, draw: O, print: PRINT, sound: [{ f: 'whoosh_airy', t: A.startE + .1, v: .3 }, { f: 'chime', t: A.yetE + .1, v: .3 }] },
    { t: A.clear, draw: O, print: PRINT, sound: [{ f: 'shimmer_rings', t: A.ceilingE, v: .5 }] },
    { t: A.promise - .2, draw: O, print: HO.print, sound: [{ f: 'screen_off', t: A.oneE + .08, v: .4 }, { f: 'whoosh', t: A.oneE + .75, v: .35 }] },
  ];
};
