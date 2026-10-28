// Film 13 · B1 · c03 "The track stays" (110.26 'But one thing didn't vanish' → 162.30 'Then the crash'), one take.
// docs/shots.md 3.01–3.07. Worlds, all carried:
//   V  (tP … ~114.4)   ★ RAIL ANCHOR A2. c02 lands in the paper with the ink line at y 700 (B.paperPlate, identical frame). Ink floods
//                      the page from top and bottom (sky / ground, as at A1), the paper band closes into the mist on the horizon, the
//                      ink line becomes a fresh iron rail, dew on it, no train. On "The track" its rim catches the first light. Slow pull.
//   G  (… ~132.3)      the mist opens back into paper: the rail is the Liverpool–Manchester line on a map of Britain (one long pull-back,
//                      the map turns north-up). The 1840s lines draw in ink-gold (~6,000 MILES · 1840s), today's network in cool over
//                      them. Push to England: the city nodes grow into clocks (London the big one), each on its own local time; from
//                      "Greenwich time" they fall in one after another (RAILWAYS BEGIN SWITCHING · DEC 1847).
//   T  (… ~138.7)      the clocks fly into London's, the map contracts into the point 1840s on the timeline (gold, y 640); on "rails
//                      behind" an empty second point grows at the right; the camera flies into it: it lights (cool) and fills the frame.
//   S  (… 162.30)      out of that light: the end of a fibre glowing in a cable at the stern of a cable ship on a black sea (2000). The
//                      light runs down the cable into the water, the camera follows it to the seabed, where the cable lies among many
//                      others, their cut ends facing us; push into its end: 100 fibres, 5 lit (≈ 5 % LIT · USA, ESTIMATE 2001), the
//                      rest dims on "in the dark". c04 flips this cross-section into the Global Crossing certificate.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './base_kit.mjs';
import * as B from './bubble_kit.mjs';
import * as U from './b1_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, card, cam3, camAt, camDrift, aim, project, F0, lin, rad, halo, prng } = E;
const { COL } = B;
const { rise } = U;

// ------------------------------------------------------------------------------------------------ the map of Britain (lon, lat)
const COAST = [[-5.0, 58.62], [-3.37, 58.67], [-3.05, 58.64], [-3.09, 58.44], [-3.65, 58.12], [-4.0, 57.87], [-3.77, 57.86], [-4.2, 57.5], [-3.87, 57.6], [-3.28, 57.72], [-2.0, 57.69], [-1.78, 57.5], [-2.08, 57.15], [-2.2, 56.96], [-2.47, 56.71], [-2.75, 56.47], [-3.1, 56.43], [-2.58, 56.28], [-3.0, 56.18], [-3.6, 56.05], [-3.2, 55.98], [-2.72, 56.06], [-2.52, 56.0], [-2.13, 55.9], [-2.0, 55.77], [-1.8, 55.67], [-1.42, 55.02], [-1.38, 54.9], [-1.2, 54.69], [-1.15, 54.62], [-.61, 54.49], [-.4, 54.28], [-.08, 54.12], [-.2, 53.9], [.12, 53.58], [-.3, 53.72], [-.1, 53.62], [.34, 53.14], [.2, 52.85], [.48, 52.94], [1.3, 52.93], [1.75, 52.48], [1.6, 52.1], [1.35, 51.95], [1.15, 51.79], [.85, 51.6], [.7, 51.53], [.4, 51.45], [1.0, 51.45], [1.44, 51.38], [1.32, 51.13], [.98, 50.91], [.25, 50.74], [-.14, 50.82], [-.79, 50.73], [-1.1, 50.8], [-1.4, 50.85], [-1.88, 50.71], [-2.46, 50.51], [-2.94, 50.72], [-3.4, 50.62], [-3.64, 50.22], [-4.14, 50.36], [-4.6, 50.32], [-5.2, 49.96], [-5.71, 50.07], [-5.48, 50.21], [-5.08, 50.42], [-4.75, 50.55], [-4.53, 51.02], [-4.12, 51.21], [-3.47, 51.21], [-2.98, 51.35], [-2.6, 51.62], [-2.99, 51.55], [-3.17, 51.45], [-3.94, 51.6], [-4.31, 51.56], [-4.7, 51.67], [-5.1, 51.75], [-5.31, 51.9], [-4.98, 52.0], [-4.66, 52.11], [-4.08, 52.41], [-4.06, 52.72], [-4.42, 52.83], [-4.77, 52.8], [-4.27, 53.14], [-4.63, 53.31], [-4.05, 53.3], [-3.83, 53.33], [-3.49, 53.32], [-3.1, 53.35], [-3.0, 53.42], [-3.0, 53.65], [-3.05, 53.82], [-2.9, 54.07], [-3.23, 54.1], [-3.64, 54.51], [-3.55, 54.64], [-3.3, 54.95], [-3.6, 54.98], [-4.05, 54.83], [-4.4, 54.68], [-4.86, 54.64], [-5.0, 54.9], [-5.15, 55.0], [-4.63, 55.47], [-4.9, 55.9], [-5.3, 55.85], [-5.8, 55.3], [-5.6, 55.8], [-5.47, 56.42], [-6.22, 56.73], [-5.83, 57.0], [-5.71, 57.28], [-5.83, 57.43], [-5.7, 57.73], [-5.16, 57.9], [-5.24, 58.15], [-5.0, 58.62]];
const LIVI = COAST.findIndex(([lo, la]) => lo === -3.0 && la === 53.42);
const CITY = {
  LON: [-.13, 51.51], BHM: [-1.9, 52.48], LIV: [-2.98, 53.41], MAN: [-2.24, 53.48], BRI: [-2.59, 51.45], EXE: [-3.53, 50.72], PLY: [-4.14, 50.37],
  LEE: [-1.55, 53.8], YOR: [-1.08, 53.96], NEW: [-1.6, 54.97], CAR: [-2.93, 54.89], NOR: [1.3, 52.63], DOV: [1.31, 51.13], EDI: [-3.19, 55.95],
  GLA: [-4.25, 55.86], RUG: [-1.26, 52.37], CRE: [-2.44, 53.09], DER: [-1.47, 52.92], SOU: [-1.4, 50.9], BTN: [-.14, 50.83], CAM: [.12, 52.2],
  IPS: [1.15, 52.06], HUL: [-.33, 53.74], PRE: [-2.7, 53.76], CHE: [-2.89, 53.19], HOL: [-4.63, 53.31], GLO: [-2.24, 51.86], PET: [-.24, 52.57],
  DAR: [-1.55, 54.52], BER: [-2.0, 55.77], PER: [-3.44, 56.4], ABE: [-2.1, 57.15], INV: [-4.22, 57.48], PEN: [-5.53, 50.12], SWA: [-3.94, 51.62],
  CDF: [-3.17, 51.48], SHR: [-2.75, 52.71], ABY: [-4.08, 52.41], FTW: [-5.1, 56.82], KYL: [-5.71, 57.28], WIC: [-3.09, 58.44], OXF: [-1.26, 51.75],
  READ: [-.97, 51.45], SWI: [-1.78, 51.56], LCR: [-1.13, 52.63], NOT: [-1.15, 52.95], SHE: [-1.47, 53.38], LAN: [-2.8, 54.05], DUN: [-2.97, 56.46],
};
// the 1840s lines (ink-gold) and today's network (cool, mostly on top of them); each route grows from its first city
const R1840 = [['LON', 'RUG', 'BHM', 'CRE', 'MAN'], ['CRE', 'LIV'], ['LIV', 'MAN'], ['LON', 'READ', 'SWI', 'BRI', 'EXE', 'PLY'], ['LON', 'SOU'], ['LON', 'BTN'], ['LON', 'DOV'],
  ['LON', 'CAM', 'NOR'], ['LON', 'IPS', 'NOR'], ['RUG', 'LCR', 'DER', 'SHE', 'LEE'], ['DER', 'NOT'], ['LEE', 'YOR', 'DAR', 'NEW', 'BER', 'EDI'], ['LEE', 'MAN'], ['HUL', 'YOR'],
  ['CRE', 'PRE', 'LAN', 'CAR', 'GLA'], ['CAR', 'NEW'], ['EDI', 'GLA'], ['CHE', 'HOL'], ['BHM', 'GLO', 'BRI'], ['LON', 'PET', 'YOR'], ['SWI', 'GLO'], ['CRE', 'CHE'], ['EDI', 'PER', 'DUN']];
const RTODAY = [['LON', 'RUG', 'BHM', 'CRE', 'PRE', 'LAN', 'CAR', 'GLA'], ['LON', 'PET', 'YOR', 'NEW', 'EDI', 'PER', 'ABE', 'INV', 'WIC'], ['LON', 'READ', 'SWI', 'BRI', 'EXE', 'PLY', 'PEN'],
  ['SWI', 'CDF', 'SWA'], ['CRE', 'SHR', 'ABY'], ['GLA', 'FTW'], ['INV', 'KYL'], ['LON', 'CAM', 'NOR'], ['LIV', 'MAN', 'LEE', 'HUL'], ['LON', 'LCR', 'SHE', 'LEE'],
  ['LON', 'SOU'], ['LON', 'BTN'], ['LON', 'DOV'], ['CHE', 'HOL'], ['BHM', 'GLO', 'BRI'], ['LON', 'OXF', 'BHM']];
// the clocks: city, local mean time vs Greenwich (min = lon · 4), order in which they fall in
const CLOCKS = [['BRI', 1], ['BHM', 3], ['NOR', 2], ['DOV', 5], ['LEE', 6], ['YOR', 4], ['LIV', 8], ['EXE', 7], ['NEW', 9], ['CAR', 10], ['PLY', 11]];

// projection: the Liverpool–Manchester line is the rail: centred on (960, 700), 2200 px long, horizontal (the map is rotated by THETA
// about that point until the pull-back turns it north-up)
const LM = { lon: (CITY.LIV[0] + CITY.MAN[0]) / 2, lat: (CITY.LIV[1] + CITY.MAN[1]) / 2 }, CL = Math.cos(53.45 * Math.PI / 180);
const dLM = [(CITY.MAN[0] - CITY.LIV[0]) * CL, CITY.MAN[1] - CITY.LIV[1]];
const KM = 2200 / Math.hypot(dLM[0], dLM[1]), THETA = Math.atan2(dLM[1], dLM[0]);
const mp = (lon, lat) => [960 + (lon - LM.lon) * CL * KM, 700 - (lat - LM.lat) * KM];
const HOR = 700;

// ------------------------------------------------------------------------------------------------ the sea (world S, design at Z = F0)
const SEA = { hor: 520, water: 600, bed: 2620, vp: [1380, 2540] };
const SHEAVE = { x: 1290, y: 470, r: 46 };
const FACE = { x: 1560, y: 2740, r: 52 };   // our cable's cut end on the seabed
// the cable: over the sheave, down into the water, down to the seabed, bends toward us into its end
const CABLE = E.catmull([[SHEAVE.x - 10, SHEAVE.y - SHEAVE.r], [SHEAVE.x + 30, SHEAVE.y - 34], [SHEAVE.x + SHEAVE.r + 4, SHEAVE.y + 10], [1372, 560], [1420, 640], [1462, 900],
  [1490, 1400], [1508, 1900], [1520, 2350], [1528, 2560], [1540, 2660], [FACE.x, FACE.y]], 10);
const CLEN = (() => { const a = [0]; for (let i = 1; i < CABLE.length; i++) a.push(a[i - 1] + Math.hypot(CABLE[i][0] - CABLE[i - 1][0], CABLE[i][1] - CABLE[i - 1][1])); return a; })();
const cableAt = (d) => { d = clamp(d, 0, CLEN[CLEN.length - 1]); let i = 1; while (i < CABLE.length - 1 && CLEN[i] < d) i++; const f = (d - CLEN[i - 1]) / Math.max(1e-6, CLEN[i] - CLEN[i - 1]); return [lerp(CABLE[i - 1][0], CABLE[i][0], f), lerp(CABLE[i - 1][1], CABLE[i][1], f)]; };
const dWater = (() => { let i = 0; while (CABLE[i][1] < SEA.water) i++; return CLEN[i]; })();
// the other cables on the seabed: their cut ends face us (x, y, r), bodies run back to the vanishing point
const OTHERS = (() => { const r = prng(5150), o = []; const pos = [[1290, 2700, 40], [1420, 2668, 30], [1700, 2694, 42], [1840, 2730, 50], [1150, 2756, 54], [1980, 2660, 30], [1010, 2688, 34], [1640, 2632, 24], [1240, 2630, 22], [2130, 2720, 44], [880, 2740, 46], [1510, 2612, 18]];
  for (const [x, y, rr] of pos) o.push({ x, y, r: rr, seed: Math.floor(r() * 1e6), lit: r() }); return o; })();
// 100 fibres in a hex pack (cross-section units: radius 1 = the core); 5 lit
const FIB = (() => { const pts = [], d = .168; for (let j = -8; j <= 8; j++) for (let i = -8; i <= 8; i++) { const x = (i + (j & 1) * .5) * d, y = j * d * .866; pts.push([x, y, Math.hypot(x, y)]); } pts.sort((p, q) => p[2] - q[2]); return pts.slice(0, 100).map(([x, y]) => [x, y]); })();
const LIT5 = [0, 23, 41, 67, 88];   // the first is our fibre (the light we followed)

export function build(a, c02) {
  const tP = c02.tP, headX = c02.headX, LW = c02.lineW;
  // ---------- V + G timing ----------
  const tFl0 = tP + .12, tFl1 = tFl0 + 1.15, tBand = tFl1 + .5;                 // ink flood, then the paper band closes into the mist
  const tRim = a.track - .05;                                                      // the rim catches the first light
  const tIron0 = a.boom - .05, tUn0 = a.boom + .45, tUn1 = a.boom + 1.2;         // iron → ink (ends draw in), then the mist opens into paper (the map)
  const tMap1 = a.sixK + .9;                                                       // the pull-back lands on the whole map
  const tSix = a.sixK, tToday = a.today;
  const tEng0 = a.in1847 + .1, tEng1 = a.in1847 + 2.2;                             // push to England; the nodes grow into clocks
  const tCon0 = a.luck - .3, tCon1 = a.luck + 1.6;                                 // the clocks fly in, the map contracts into the point
  const tLine0 = tCon1 - .3, tLine1 = a.behind + .2, tRing = a.behind + .1;      // the timeline grows, the empty point on "rails behind"
  const tFly0 = a.behind + 1.0, tSea = a.y2000 + .25;                             // fly into the point → light → the sea
  const P1 = [560, 640], P2 = [1100, 640];
  // camera V/G: log-zoom m(t) = two overlapping sine bumps (slow pull over the A2 valley, then the long pull-back to the whole map),
  // then a push to England; the aim point follows the zoom
  const mEnd = 940 / ((58.75 - 49.9) * KM), mEng = 860 / (5.0 * KM);
  const L = (t) => -.28 * sineIO(span(t, tP, a.boom + .9)) + (Math.log(mEnd) + .28) * sineIO(span(t, a.boom + .3, tMap1))
    + (Math.log(mEng) - Math.log(mEnd)) * sineIO(span(t, tEng0, tEng1));
  const GB = mp(-2.35, 54.3), ENG = mp(-1.75, 52.72), LONP = mp(...CITY.LON);
  const camVG = (t) => {
    const m = Math.exp(L(t)), p = clamp(L(t) / Math.log(mEnd)), g = sineIO(p ** 1.3), e = sineIO(span(t, tEng0, tEng1));
    let u = lerp(960, GB[0], g), v = lerp(HOR, GB[1], g), sx = lerp(960, 800, g), sy = lerp(HOR, 540, g);
    u = lerp(u, ENG[0], e); v = lerp(v, ENG[1], e); sx = lerp(sx, 760, e); sy = lerp(sy, 560, e);
    const cam = aim(F0, u, v, m, sx, sy);
    return camDrift(cam, t, .35 * smooth(span(t, tBand, tBand + 1.5)) * (1 - smooth(span(t, tCon0 - .5, tCon0))), 13);
  };
  const theta = (t) => THETA * (1 - sineIO(span(t, a.boom + .6, tMap1 - .4)));
  // ---------- S timing / camera ----------
  const tRun0 = a.laid + .1, tRun1 = a.farMore + .1;                               // the light runs down the cable to the seabed
  const tFace0 = a.by2001 - .1, tFace1 = a.by2001 + 2.1;                          // push into the cut end
  const lightD = (t) => {
    // where the fibre's light is along the cable: at the sheave, then a slow creep to the waterline, then down to the end
    if (t < tRun0) return lerp(24, dWater - 30, sineIO(span(t, tSea + 1.2, tRun0)) * .35);
    return lerp(lerp(24, dWater - 30, .35), CLEN[CLEN.length - 1] - 6, sineIO(span(t, tRun0, tRun1)) ** 1.1);
  };
  const LP0 = cableAt(24);
  const camFollow = (t) => { const p = cableAt(lightD(t)); return aim(F0, p[0], p[1], 1.25, 960, 400); };
  const camBed = aim(F0, 1500, 2690, 1.55, 960, 560);
  const camX = aim(F0, FACE.x, FACE.y, 380 / FACE.r, 720, 520);
  const KS = [
    [tSea, aim(F0, LP0[0], LP0[1], 16, 960, 540)],
    [a.y2000 + 3.0, aim(F0, 900, 520, 1.0, 960, 520), 'o'],
    [tRun0 - .2, aim(F0, 920, 530, 1.05, 960, 520)],
  ];
  const camS = (t) => {
    let c;
    if (t < tRun0 - .2) c = camAt(t, KS);
    else if (t < tRun1 + .2) {
      // follow the light down: blend from the wide shot onto the carrier (the camera trails the light, never leads it)
      const k = sineIO(span(t, tRun0 - .2, tRun0 + 1.4)), f = camFollow(t - .25), w = KS[2][1];
      c = { ...w, x: lerp(w.x, f.x, k), y: lerp(w.y, f.y, k), z: lerp(w.z, f.z, k) };
      const b = sineIO(span(t, tRun1 - 1.4, tRun1 + .2)); if (b > 0) c = { ...c, x: lerp(c.x, camBed.x, b), y: lerp(c.y, camBed.y, b), z: lerp(c.z, camBed.z, b) };
    } else c = camAt(t, [[tRun1 + .2, camBed], [tFace0, aim(F0, 1520, 2700, 1.62, 960, 560)], [tFace1, camX, 'q']]);
    return camDrift(c, t, .4 * smooth(span(t, tSea + .6, tSea + 2)), 17);
  };
  // the explainer stays alive in screen space after the push: a slow breath (c04 continues it)
  const breathe = (t) => 1 + .006 * Math.sin((t - tFace1) * .5) * smooth(span(t, tFace1, tFace1 + 1));

  // ============================================================================================== draw
  function draw(ctx, t) {
    if (t < tCon0) return worldVG(ctx, t);
    if (t < tSea) return worldT(ctx, t);
    return worldS(ctx, t);
  }

  // ---------------------------------------------------------------------------------------------- V + G
  function worldVG(ctx, t) {
    const c = camVG(t);
    const fl = sineIO(span(t, tFl0, tFl1)), bc = sineIO(span(t, tFl1, tBand));
    const un = sineIO(span(t, tUn0, tUn1));
    const valley = t < tUn1;
    // the base: paper (first the plate from c02, then the map sheet)
    if (t < tBand) B.paperPlate(ctx, t);
    else mapWorld(ctx, t, c);
    if (!valley) return mapText(ctx, t);
    // the flood (and its reverse): the ink edges from top and bottom; the paper band between them closes into the mist / opens again
    const yTop = lerp(lerp(lerp(-40, HOR - 70, fl), HOR, bc), -60, un), yBot = lerp(lerp(lerp(H + 40, HOR + 64, fl), HOR, bc), H + 60, un);
    const open = t < tBand || t > tUn0;
    const topClip = edge(yTop, -1, t), botClip = edge(yBot, 1, t);
    const layer = (clip, fn) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); if (open) ctx.clip(clip); fn(); ctx.restore(); };
    const sky = () => {
      card(ctx, c, 40000, () => {
        E.nightSky(ctx, [[0, P.night0], [.4, P.night1], [.68, mixHex(P.ind1, P.blue1, .35)], [.86, mixHex(P.ind2, P.shade1, .5)], [.96, mixHex(P.shade1, P.halo1, .4)], [1, mixHex(P.shade0, P.halo1, .5)]], -900, HOR - 60);
        E.stars(ctx, 61, 120, t, [-600, -900, W + 1200, HOR - 400], .35);
        // dawn: the light low on the right (east), the first light of the morning (no sun yet)
        ctx.fillStyle = rad(ctx, 1460, HOR - 40, 1500, [[0, rgba(P.core1, .5)], [.12, rgba(P.halo1, .42)], [.35, rgba(P.shade0, .2)], [.7, rgba(P.shade1, .06)], [1, rgba(P.shade1, 0)]]); ctx.fillRect(-W, -H, 3 * W, 3 * H);
        // two long thin clouds catching the light from below
        for (const [x, y, w, a2] of [[600, 250, 1500, .6], [1500, 380, 1100, .8], [-200, 120, 1800, .4]]) {
          const xx = x + t * 6; ctx.fillStyle = lin(ctx, 0, y - 22, 0, y + 22, [[0, rgba(P.ind2, 0)], [.5, rgba(P.ind2, .7 * a2)], [.8, rgba(P.shade0, .5 * a2)], [1, rgba(P.shade0, 0)]]);
          ctx.beginPath(); ctx.ellipse(xx, y, w / 2, 22, 0, 0, 6.29); ctx.fill();
        }
      });
      // the valley: high moor on the left and right, dipping in the middle where the light comes from; mist lies in the low ground
      card(ctx, c, 9000, () => E.ground(ctx, [[-2200, 300], [-900, 420], [100, 560], [800, 650], [1300, 660], [1800, 600], [2600, 470], [3800, 330]], { stops: [[0, mixHex(P.ind1, P.blue1, .4)], [1, P.ind1]], rim: rgba(P.halo1, .45), rimW: 2, bottom: HOR + 400 }));
      card(ctx, c, 9000, () => { B.mist(ctx, HOR - 50, 70, .55); });
      card(ctx, c, 4200, () => E.ground(ctx, [[-2400, 470], [-1100, 540], [-200, 640], [500, 690], [1500, 700], [2300, 640], [3200, 560], [4400, 500]], { stops: [[0, mixHex(P.ind1, P.night1, .25)], [1, P.night1]], rim: rgba(P.blue0, .4), rimW: 2, bottom: HOR + 400 }));
      card(ctx, c, 4200, () => { B.mist(ctx, HOR - 14, 60, .5); B.mist(ctx, HOR - 30, 160, .22); });
    };
    const ground = () => {
      card(ctx, c, F0, () => {
        ctx.fillStyle = lin(ctx, 0, HOR, 0, H + 500, [[0, mixHex(P.ind1, P.night1, .35)], [.25, P.night1], [1, P.night0]]); ctx.fillRect(-6000, HOR, 14000, 3000);
        // the dawn's reflection on the wet valley floor
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, 1460, HOR + 10, 900, [[0, rgba(P.shade0, .22)], [1, rgba(P.shade0, 0)]]); ctx.fillRect(-2000, HOR, 7000, 1200); ctx.restore();
        dew(ctx, t);
      });
    };
    if (open) { layer(topClip, sky); layer(botClip, ground); } else { sky(); ground(); }
    // the paper band → mist (paper-coloured light); in reverse the mist opens into the paper of the map
    const mistA = smooth(span(t, tFl1 - .2, tBand + .3)) * (1 - smooth(span(t, tUn0 - .3, tUn0 + .5)));
    if (mistA > 0) card(ctx, c, 9000, () => { B.mist(ctx, HOR - 6, 50, mistA); B.mist(ctx, HOR - 14, 140, .45 * mistA); });
    if (open) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = rgba(COL.ink, .7); ctx.lineWidth = 5; ctx.stroke(edgeLine(yTop, -1, t)); ctx.stroke(edgeLine(yBot, 1, t)); ctx.restore(); }
    // the line: exactly c02's ink line (screen space) until the flood, then the rail (same y, same width), then ink again whose ends
    // draw in to Liverpool and Manchester (the map's line under it is the same band)
    if (t < tFl0 + .5) {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); B.inkLine(ctx, [[-60, HOR], [Math.max(-59, headX(t)), HOR]], 1, { col: COL.ink, w: LW }); ctx.restore();
    } else if (t < tUn1) {
      const iron = smooth(span(t, tFl1 - .1, tBand + .4)) * (1 - smooth(span(t, tIron0, tIron0 + .55))), sl = smooth(span(t, tFl1 + .1, tBand + .9)) * (1 - smooth(span(t, tIron0 - .2, tIron0 + .4)));
      const glint = smooth(span(t, tRim - .1, tRim + .5)), ret = sineIO(span(t, a.boom, a.boom + .8));
      const x0 = lerp(-6000, 960 - 1100, ret), x1 = lerp(8000, 960 + 1100, ret), y = HOR - LW / 2;
      card(ctx, c, F0, (k) => {
        // the bed: a low gravel embankment (cool-lit top), heavy sleepers
        if (sl > 0) {
          ctx.fillStyle = lin(ctx, 0, y + LW, 0, y + LW + 70, [[0, mixHex(P.ind2, P.blue1, .3)], [1, mixHex(P.night1, P.ind1, .3)]]);
          ctx.beginPath(); ctx.moveTo(x0 - 120 * sl, y + LW + 70 * sl); ctx.lineTo(x0, y + LW + 6 * sl); ctx.lineTo(x1, y + LW + 6 * sl); ctx.lineTo(x1 + 120 * sl, y + LW + 70 * sl); ctx.closePath(); ctx.fill();
          ctx.fillStyle = rgba(P.halo1, .18 * sl); ctx.fillRect(x0, y + LW + 6 * sl, x1 - x0, 2);
          for (let xx = Math.ceil(x0 / 150) * 150; xx < x1; xx += 150) { ctx.fillStyle = mixHex(P.night1, P.night0, .4); ctx.fillRect(xx - 48, y + LW * .8, 96, 24 * sl); ctx.fillStyle = rgba(P.blue0, .4 * sl); ctx.fillRect(xx - 48, y + LW * .8, 96, 2); }
        }
        const rim = iron * (.4 + .6 * glint);
        ctx.fillStyle = mixHex(mixHex(P.ind2, P.night1, .35), COL.ink, 1 - iron); ctx.fillRect(x0, y, x1 - x0, LW);
        if (rim > 0) {
          ctx.fillStyle = lin(ctx, x0, 0, x1, 0, [[0, rgba(P.blue0, .5 * rim)], [.4, rgba(P.halo0, .85 * rim)], [.55, rgba(P.core1, rim)], [1, rgba(P.halo0, .8 * rim)]]); ctx.fillRect(x0, y - 2, x1 - x0, 6);
          ctx.fillStyle = rgba(P.shade0, .35 * rim); ctx.fillRect(x0, y + 6, x1 - x0, 5);   // the light on the rail's head below the rim
        }
        // the first light runs along the rim from the right (east) on "The track"; dew sparkles on the iron
        if (glint > 0 && glint < 1) halo(ctx, lerp(2400, -400, sineIO(span(t, tRim, tRim + 1.8))), y + 1, 160, .6 * Math.sin(Math.PI * glint) * iron, P.halo1, P.core0);
        if (iron > .3) { halo(ctx, 1460, y + 1, 260, .4 * glint * iron, P.halo1, P.core1); const r = prng(919); for (let i = 0; i < 26; i++) { const xx = -400 + r() * 3000, ph = r() * 6.3; ctx.fillStyle = rgba(P.core1, iron * glint * (.5 + .5 * Math.sin(t * 2.2 + ph)) ** 4); ctx.beginPath(); ctx.arc(xx, y + 1, 2.4, 0, 6.29); ctx.fill(); } }
      });
    }
    mapText(ctx, t);
  }

  function dew(ctx, t) {
    const r = prng(7781);
    ctx.save(); ctx.fillStyle = P.core1;
    for (let i = 0; i < 160; i++) {
      const x = -1200 + r() * 4400, y = HOR + 20 + r() ** 1.6 * 700, s = 1 + r() * 2.4, ph = r() * 6.3, east = clamp((x - 200) / 1600);
      ctx.globalAlpha = (.12 + .5 * east) * (.5 + .5 * Math.sin(t * (1 + r()) + ph)) ** 3;
      ctx.beginPath(); ctx.arc(x, y, s, 0, 6.29); ctx.fill();
    }
    ctx.restore();
  }

  function edge(y0, dir, t) { const p = new Path2D(); p.moveTo(-50, dir < 0 ? -50 : H + 50); for (let x = -50; x <= W + 50; x += 30) p.lineTo(x, y0 + dir * (7 * Math.sin(x * .011 + t * .8) + 4 * Math.sin(x * .037 + 1))); p.lineTo(W + 50, dir < 0 ? -50 : H + 50); p.closePath(); return p; }
  function edgeLine(y0, dir, t) { const p = new Path2D(); for (let x = -50; x <= W + 50; x += 30) { const y = y0 + dir * (7 * Math.sin(x * .011 + t * .8) + 4 * Math.sin(x * .037 + 1)); x === -50 ? p.moveTo(x, y) : p.lineTo(x, y); } return p; }

  // the map: paper sheet on the night, coast in ink, lines (gold), today's network (cool), clocks
  function mapWorld(ctx, t, c, contract = null) {
    ctx.save();
    if (contract) { ctx.translate(contract.x, contract.y); ctx.scale(contract.s, contract.s); ctx.translate(-contract.x0, -contract.y0); }
    const M = ctx.getTransform();
    // the night around the sheet
    if (!contract) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.6, P.night1], [1, P.ind0]]); ctx.fillRect(0, 0, W, H); ctx.setTransform(M); }
    card(ctx, c, F0, (k) => {
      if (contract) { const m2 = ctx.getTransform(); ctx.setTransform(M); ctx.transform(m2.a, m2.b, m2.c, m2.d, m2.e, m2.f); }
      ctx.translate(960, HOR); ctx.rotate(theta(t)); ctx.translate(-960, -HOR);
      const px = 1 / k;   // one screen pixel in design units
      // the sheet
      const s0 = mp(-7.3, 59.4), s1 = mp(2.7, 49.4), sheet = new Path2D(); sheet.rect(s0[0], s0[1], s1[0] - s0[0], s1[1] - s0[1]);
      ctx.fillStyle = rgba(P.night0, .55); ctx.fillRect(s0[0] + 14 * px, s0[1] + 18 * px, s1[0] - s0[0], s1[1] - s0[1]);   // contact shadow
      B.paperFill(ctx, sheet, { lum: .92, seed: 3301, lx: mp(-3, 54)[0], ly: mp(-3, 54.5)[1], r: (s1[1] - s0[1]) * .9 });
      // coast: ink, drawn as the pull-back opens the view
      const cu = smooth(span(t, a.boom + .9, a.sixK + .4));
      if (cu > 0) {
        const pts = COAST.map(([lo, la]) => mp(lo, la)), land = new Path2D(); pts.forEach((q, i) => (i ? land.lineTo(q[0], q[1]) : land.moveTo(q[0], q[1]))); land.closePath();
        ctx.save(); ctx.globalAlpha = .5 * cu; ctx.fillStyle = mixHex(COL.paper1, COL.paper2, .25); ctx.fill(land); ctx.restore();
        // the ink runs out from Liverpool both ways round the coast (the eye is there)
        B.inkLine(ctx, pts.slice(LIVI), cu, { col: COL.ink2, w: 2.2 * px, a: .8 });
        B.inkLine(ctx, pts.slice(0, LIVI + 1).reverse(), cu, { col: COL.ink2, w: 2.2 * px, a: .8 });
      }
      // the 1840s lines (ink-gold) grow from their first city on "six thousand"; Liverpool–Manchester is the rail (always drawn)
      const gold = mixHex(P.shade0, COL.ink, .18);
      R1840.forEach((r, i) => {
        const isLM = r.length === 2 && r[0] === 'LIV' && r[1] === 'MAN', u = isLM ? 1 : expoOut(span(t, tSix - .1 + (i % 9) * .07, tSix + 1.0 + (i % 9) * .07));
        if (u <= 0) return;
        const w = isLM ? Math.max(4.2 * px, lerp(LW, 4.2 * px, smooth(span(t, tUn1 - .2, tMap1)))) : 4.2 * px;
        B.inkLine(ctx, r.map((cc) => mp(...CITY[cc])), u, { col: isLM ? mixHex(COL.ink, gold, smooth(span(t, tUn1, tSix + .5))) : gold, w });
      });
      // today's network (cool) on "today's network", slightly offset so both read where they overlap
      RTODAY.forEach((r, i) => {
        const u = sineIO(span(t, tToday - .1 + (i % 8) * .08, tToday + 1.1 + (i % 8) * .08)); if (u <= 0) return;
        B.inkLine(ctx, r.map((cc) => { const q = mp(...CITY[cc]); return [q[0] + 3.4 * px, q[1] + 3.4 * px]; }), u, { col: COL.coolDeep, w: 3 * px, a: 1 });
      });
      // the city nodes (gold dots) → clocks
      clocks(ctx, t, px);
    });
    ctx.restore();
  }

  function cityClock(ctx, x, y, r, minOff, t, grow, fall, px, big) {
    // a station clock: lamp-lit paper face, ink ticks, two hands; minOff = local time vs Greenwich (minutes), fall 0..1 = set to London
    if (grow <= 0) { ctx.fillStyle = mixHex(P.shade0, P.halo1, .3); ctx.beginPath(); ctx.arc(x, y, 5 * px, 0, 6.29); ctx.fill(); return; }
    const R = lerp(5 * px, r, expoOut(grow));
    ctx.save();
    ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.arc(x + R * .06, y + R * .1, R * 1.06, 0, 6.29); ctx.fill();
    ctx.fillStyle = mixHex(P.shade1, P.night1, .3); ctx.beginPath(); ctx.arc(x, y, R * 1.08, 0, 6.29); ctx.fill();   // the case
    const face = new Path2D(); face.arc(x, y, R, 0, 6.29);
    B.paperFill(ctx, face, { lum: big ? 1 : .9, seed: 3401, lx: x - R * .3, ly: y - R * .4, r: R * 2, fibre: 0 });
    ctx.strokeStyle = rgba(P.halo1, big ? .9 : .6); ctx.lineWidth = Math.max(1.5 * px, R * .05); ctx.beginPath(); ctx.arc(x, y, R * 1.04, 0, 6.29); ctx.stroke();
    if (grow > .5) {
      const g = smooth((grow - .5) * 2);
      ctx.strokeStyle = rgba(COL.ink, .8 * g); ctx.lineCap = 'round';
      for (let i = 0; i < 12; i++) { const an = i / 12 * 2 * Math.PI, l = i % 3 ? .1 : .18; ctx.lineWidth = R * (i % 3 ? .03 : .05); ctx.beginPath(); ctx.moveTo(x + Math.sin(an) * R * (.9 - l), y - Math.cos(an) * R * (.9 - l)); ctx.lineTo(x + Math.sin(an) * R * .9, y - Math.cos(an) * R * .9); ctx.stroke(); }
      // time: London runs from 11:57 (1 min per 4 s); a city shows its own local time until it falls in
      const lon = 57 + (t - tEng0) / 4, mins = lon + minOff * (1 - fall), hA = ((11 + mins / 60) / 12) * 2 * Math.PI, mA = (mins / 60) * 2 * Math.PI;
      ctx.lineWidth = R * .07; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(hA) * R * .5, y - Math.cos(hA) * R * .5); ctx.stroke();
      ctx.lineWidth = R * .045; ctx.beginPath(); ctx.moveTo(x - Math.sin(mA) * R * .1, y + Math.cos(mA) * R * .1); ctx.lineTo(x + Math.sin(mA) * R * .8, y - Math.cos(mA) * R * .8); ctx.stroke();
      if (big) { const sA = ((t - tEng0) % 60) / 60 * 2 * Math.PI * 1; ctx.strokeStyle = rgba(P.shade1, .9 * g); ctx.lineWidth = R * .015; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(sA) * R * .85, y - Math.cos(sA) * R * .85); ctx.stroke(); }
      ctx.fillStyle = rgba(COL.ink, g); ctx.beginPath(); ctx.arc(x, y, R * .06, 0, 6.29); ctx.fill();
    }
    ctx.restore();
  }

  function clocks(ctx, t, px) {
    const grow0 = tEng0 + 1.0;
    // the nodes: every city of the 1840s lines gets a gold dot when its line reaches it
    const lm = mp(...CITY.LON);
    CLOCKS.forEach(([cc, ord], i) => {
      const q = mp(...CITY[cc]), off = CITY[cc][0] * 4;
      const grow = span(t, grow0 + .35 + ord * .09, grow0 + 1.15 + ord * .09);
      const fall = Math.min(1.03, expoOut(span(t, a.greenwich + .05 + (ord - 1) * .42, a.greenwich + .6 + (ord - 1) * .42)) * 1.03) - .03 * smooth(span(t, a.greenwich + .6 + (ord - 1) * .42, a.greenwich + 1.2 + (ord - 1) * .42));
      // the contraction: they fly into London's clock (arcs), shrinking
      const fly = quartIO(span(t, tCon0 + ord * .04, tCon0 + .9 + ord * .04));
      const x = lerp(q[0], lm[0], fly) + Math.sin(fly * Math.PI) * 30 * px * (i % 2 ? 1 : -1), y = lerp(q[1], lm[1], fly) - Math.sin(fly * Math.PI) * 40 * px;
      if (fly >= 1) return;
      cityClock(ctx, x, y, 34 * px * (1 - .7 * fly), off, t, grow, fall, px, false);
    });
    cityClock(ctx, lm[0], lm[1], 112 * px, 0, t, span(t, grow0, grow0 + .9), 1, px, true);
  }

  function mapText(ctx, t) {
    // labels in screen space beside the map (the sea east of Britain)
    const l1 = rise(span(t, tSix + .2, tSix + .8)), l2 = rise(span(t, tToday + .15, tToday + .75));
    const out = 1 - smooth(span(t, tEng0, tEng0 + .5));
    const gx = 1180;
    if (l1 > 0 && out > 0) { const w = U.approx(ctx, gx, 470, 130, l1 * out); K.maskLine(ctx, [['6,000', 0]], gx + w, 470, 130, l1 * out, { col: P.cream }); K.maskLine(ctx, [['MILES · 1840s', 0]], gx + 6, 530, 40, rise(span(t, tSix + .4, tSix + 1)) * out, { serif: false, col: P.halo1, glow: false }); }
    if (l2 > 0 && out > 0) K.maskLine(ctx, [["TODAY'S NETWORK", 0]], gx + 6, 600, 40, l2 * out, { serif: false, col: COL.cool, glow: false });
    // the Greenwich label
    const g = rise(span(t, a.greenwich - .1, a.greenwich + .5)), go = 1 - smooth(span(t, tCon0 - .5, tCon0));
    if (g > 0 && go > 0) { K.maskLine(ctx, [['RAILWAYS BEGIN', 0]], 1220, 330, 46, g * go, { serif: false, col: P.cream, glow: false }); K.maskLine(ctx, [['SWITCHING', 0]], 1220, 386, 46, rise(span(t, a.greenwich - .02, a.greenwich + .58)) * go, { serif: false, col: P.cream, glow: false }); K.maskLine(ctx, [['DEC 1847', 0]], 1220, 446, 40, rise(span(t, a.greenwich + .15, a.greenwich + .75)) * go, { serif: false, col: P.halo2, glow: false }); }
  }

  // ---------------------------------------------------------------------------------------------- T: the timeline
  function worldT(ctx, t) {
    // the map with its clocks contracts into the first point (P1); the line grows to the right; the empty point; the fly into it
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const fz = expoIn(span(t, tFly0, tSea)) * 0 + (Math.exp(Math.log(40) * smooth(span(t, tFly0, tSea)) ** 1.6) - 1) / 39, Z = 1 + 39 * fz;
    ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.6, P.night1], [1, P.ind0]]); ctx.fillRect(0, 0, W, H);
    ctx.translate(P2[0], P2[1]); ctx.scale(Z, Z); ctx.translate(-P2[0], -P2[1]);
    const cs = 1 - sineIO(span(t, tCon0 + .7, tCon1)) ** 1.4, cam = camVG(Math.min(t, tCon0));
    const lp = project(cam, F0, ...LONP);
    if (cs > 0) mapWorld(ctx, t, cam, { x: lerp(lp[0], P1[0], quartIO(span(t, tCon0, tCon1))), y: lerp(lp[1], P1[1], quartIO(span(t, tCon0, tCon1))), s: cs, x0: lp[0], y0: lp[1] });
    // the point 1840s (gold), the line, the empty point
    const pt = smooth(span(t, tCon1 - .35, tCon1));
    const lu = expoOut(span(t, tLine0, tLine1)), ring = expoOut(span(t, tRing, tRing + .6));
    if (lu > 0) B.inkLine(ctx, [[P1[0], P1[1]], [lerp(P1[0], P2[0], lu), P2[1]]], 1, { col: P.halo1, w: 3, glow: .5 });
    if (pt > 0) { halo(ctx, P1[0], P1[1], 60, .5 * pt, P.halo1, P.core0); ctx.fillStyle = mixHex(P.halo1, P.core0, .3); ctx.beginPath(); ctx.arc(P1[0], P1[1], 11 * pt, 0, 6.29); ctx.fill(); }
    const yl = rise(span(t, tCon1 - .1, tCon1 + .5));
    if (yl > 0) K.maskLine(ctx, [['1840s', 0]], P1[0], P1[1] + 70, 44, yl, { serif: false, col: P.cream, glow: false, align: 'center' });
    if (ring > 0) {
      const lit = smooth(span(t, tFly0 - .5, tFly0 + .4));
      ctx.strokeStyle = rgba(mixHex(P.halo1, COL.cool, lit), .95); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(P2[0], P2[1], 16 * ring, 0, 6.29); ctx.stroke();
      if (lit > 0) { halo(ctx, P2[0], P2[1], 70, .6 * lit, COL.cool2, '#f4f7ff'); ctx.fillStyle = rgba('#f4f7ff', lit); ctx.beginPath(); ctx.arc(P2[0], P2[1], 7 * lit, 0, 6.29); ctx.fill(); }
    }
    ctx.restore();
    U.lightFill(ctx, P2[0], P2[1], smooth(span(t, tFly0 + .3, tSea)), COL.cool2);
  }

  // ---------------------------------------------------------------------------------------------- S: the sea, the seabed, the fibres
  function worldS(ctx, t, o = {}) {
    const c = camS(t), ld = lightD(t), lp = cableAt(ld);
    card(ctx, c, 40000, () => {
      E.nightSky(ctx, [[0, P.night0], [.7, P.night1], [1, mixHex(P.ind1, P.blue1, .3)]], -900, SEA.hor);
      E.stars(ctx, 88, 180, t, [-1500, -900, W + 3000, SEA.hor + 400], .55);
    });
    card(ctx, c, 6000, () => {
      // the far sea: long cool glints that drift
      ctx.fillStyle = lin(ctx, 0, SEA.hor, 0, SEA.hor + 600, [[0, mixHex(P.ind1, P.blue1, .25)], [1, P.night0]]); ctx.fillRect(-3000, SEA.hor, 8000, 9000);
      ctx.fillStyle = rgba(P.blue0, .5); ctx.fillRect(-3000, SEA.hor - 1, 8000, 2);
      const r = prng(611);
      for (let i = 0; i < 70; i++) { const y = SEA.hor + 8 + r() ** 1.8 * 380, x = -1500 + r() * 5000 + (t * (8 + r() * 10)) % 400, w = 30 + r() * 140 * (1 + (y - SEA.hor) / 200); ctx.fillStyle = rgba(COL.cool2, .1 + .18 * (.5 + .5 * Math.sin(t * .9 + i))); ctx.fillRect(x, y, w, 1.5 + (y - SEA.hor) / 160); }
    });
    card(ctx, c, F0, (k) => {
      // under water: from the surface down to the seabed, darker with depth; marine snow
      ctx.fillStyle = lin(ctx, 0, SEA.water, 0, SEA.bed, [[0, mixHex(P.ind1, P.night1, .4)], [.3, P.night1], [1, P.night0]]); ctx.fillRect(-3000, SEA.water, 8000, SEA.bed - SEA.water + 2000);
      E.dust(ctx, 6121, 260, 1500, 1600, 1100, 900, t * .3, .5, COL.cool2);
      // the surface seen from the ship's side: a band of waves at the waterline
      ctx.fillStyle = lin(ctx, 0, SEA.hor, 0, SEA.water + 40, [[0, mixHex(P.ind1, P.blue1, .2)], [1, mixHex(P.ind1, P.night1, .4)]]); ctx.fillRect(-3000, SEA.hor + 30, 8000, SEA.water - SEA.hor + 10);
      seabed(ctx, t, ld);
      ship(ctx, t);
      cable(ctx, t, ld);
      // the waves in front of the cable at the waterline
      ctx.strokeStyle = rgba(COL.cool2, .45); ctx.lineWidth = 2.5;
      for (let j = 0; j < 3; j++) { ctx.beginPath(); for (let x = -1200; x <= 3200; x += 24) { const y = SEA.water - 6 + j * 16 + 5 * Math.sin(x * .02 + t * (1.4 + j * .3) + j); x === -1200 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
      // the light of the fibre: a cool point inside the cable, a halo around it (the hero light)
      const pulse = 1 + .25 * Math.exp(-((t - a.glass - .2) ** 2) / .08);
      if (ld < CLEN[CLEN.length - 1] - 8) { halo(ctx, lp[0], lp[1], 90 * pulse, .55, COL.cool2, '#f4f7ff'); ctx.fillStyle = '#f4f7ff'; ctx.beginPath(); ctx.arc(lp[0], lp[1], 5, 0, 6.29); ctx.fill(); }
    });
    // "The rest lay in the dark": the light of the seabed goes out round the cross-section (only the explainer night stays; c04 goes on
    // on that same night)
    const dk = smooth(span(t, a.dark - .1, a.dark + 1.3));
    if (dk > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = dk; nightBg(ctx); ctx.restore(); }
    if (o.sx !== 0) card(ctx, c, F0, () => { if (o.sx != null) { ctx.translate(FACE.x, FACE.y); ctx.scale(o.sx, 1); ctx.translate(-FACE.x, -FACE.y); } faceDetail(ctx, t, dk); });
    // labels
    const y2 = rise(span(t, a.y2000 + 1.1, a.y2000 + 1.7)) * (1 - smooth(span(t, a.laid + .4, a.laid + 1.0)));
    if (o.noText) return;
    if (y2 > 0) K.maskLine(ctx, [['2000', 0]], 300, 330, 150, y2, { col: P.cream });
    const fx = rise(span(t, a.five + .05, a.five + .6)), src = rise(span(t, a.five + .5, a.five + 1.1)), out = 1 - smooth(span(t, a.c04 - .45, a.c04 - .05));
    if (fx > 0 && out > 0 && !o.noText) {
      ctx.save(); ctx.translate(960, 540); ctx.scale(breathe(t), breathe(t)); ctx.translate(-960, -540);
      const aw = U.approx(ctx, 1170, 520, 150, fx * out);
      K.maskLine(ctx, [['5 %', 0]], 1170 + aw, 520, 150, fx * out, { col: P.cream });
      K.maskLine(ctx, [['LIT', 0]], 1170 + aw + K.measure('5 % ', 150) + 4, 520, 48, rise(span(t, a.five + .2, a.five + .7)) * out, { serif: false, col: COL.cool, glow: false });
      K.maskLine(ctx, [['USA, ESTIMATE 2001', 0]], 1174, 590, 28, src * out, { serif: false, col: P.halo2, glow: false });
      ctx.restore();
    }
    U.lightFill(ctx, 960, 540, 1 - smooth(span(t, tSea, tSea + 1.1)), COL.cool2);
  }

  function ship(ctx, t) {
    // a cable ship, side view, stern to the right: long dark hull, a bridge, the stern A-frame with the big sheave (the cable runs over it)
    const bob = 3 * Math.sin(t * .8), x0 = 330, x1 = 1250, wl = SEA.water + bob;
    ctx.save(); ctx.translate(0, bob);
    const hull = new Path2D(); hull.moveTo(x0 - 60, SEA.water - 70); hull.lineTo(x1 + 40, SEA.water - 64); hull.lineTo(x1 + 20, SEA.water + 6); hull.lineTo(x0 + 30, SEA.water + 6); hull.closePath();
    ctx.fillStyle = lin(ctx, 0, SEA.water - 70, 0, SEA.water, [[0, mixHex(P.ind2, P.blue1, .3)], [1, P.night0]]); ctx.fill(hull);
    ctx.fillStyle = rgba(P.blue0, .6); ctx.fillRect(x0 - 50, SEA.water - 71, x1 - x0 + 90, 2);
    // the bridge + mast, lit portholes (a few warm lights: people at work)
    ctx.fillStyle = mixHex(P.ind2, P.night1, .4); ctx.fillRect(x0 + 60, SEA.water - 170, 220, 100); ctx.fillRect(x0 + 100, SEA.water - 230, 120, 60); ctx.fillRect(x0 + 152, SEA.water - 330, 8, 100);
    ctx.fillStyle = rgba(P.blue0, .5); ctx.fillRect(x0 + 60, SEA.water - 171, 220, 2); ctx.fillRect(x0 + 100, SEA.water - 231, 120, 2);
    for (let i = 0; i < 6; i++) { ctx.fillStyle = rgba(P.halo1, .55 + .2 * Math.sin(t * .7 + i)); ctx.fillRect(x0 + 78 + i * 32, SEA.water - 140, 14, 10); }
    halo(ctx, x0 + 156, SEA.water - 336, 40, .5, P.halo1, P.core0);   // the masthead light
    // the cable tanks (low drums on deck)
    ctx.fillStyle = mixHex(P.ind2, P.night1, .3); for (const cx of [560, 720, 880]) { ctx.beginPath(); ctx.ellipse(cx, SEA.water - 72, 64, 18, 0, Math.PI, 0); ctx.fill(); }
    // the A-frame at the stern and the sheave
    ctx.strokeStyle = mixHex(P.ind2, P.blue1, .3); ctx.lineWidth = 12; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x1 - 60, SEA.water - 66); ctx.lineTo(SHEAVE.x, SHEAVE.y); ctx.lineTo(x1 + 30, SEA.water - 66); ctx.stroke();
    ctx.fillStyle = mixHex(P.ind2, P.night1, .2); ctx.beginPath(); ctx.arc(SHEAVE.x, SHEAVE.y, SHEAVE.r, 0, 6.29); ctx.fill();
    ctx.strokeStyle = rgba(P.blue0, .7); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(SHEAVE.x, SHEAVE.y, SHEAVE.r - 6, 0, 6.29); ctx.stroke();
    const sp = t * 1.2; ctx.lineWidth = 5; for (let i = 0; i < 3; i++) { const an = sp + i * 2.09; ctx.beginPath(); ctx.moveTo(SHEAVE.x, SHEAVE.y); ctx.lineTo(SHEAVE.x + Math.cos(an) * (SHEAVE.r - 8), SHEAVE.y + Math.sin(an) * (SHEAVE.r - 8)); ctx.stroke(); }   // turning: the cable pays out
    ctx.restore();
  }

  function cable(ctx, t, ld) {
    // the cable (dark, a cool rim); the part the light has passed glows faintly
    const pts = CABLE;
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = P.night0; ctx.lineWidth = 18; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
    ctx.strokeStyle = mixHex(P.ind2, P.night1, .35); ctx.lineWidth = 14; ctx.stroke();
    ctx.strokeStyle = rgba(COL.cool2, .35); ctx.lineWidth = 2; ctx.translate(-4, -2); ctx.stroke();
    ctx.restore();
    // the lit trail inside: a thin cool line behind the light
    const n = pts.findIndex((_, i) => CLEN[i] >= ld), sub = pts.slice(Math.max(0, n - 40), Math.max(1, n)).concat([cableAt(ld)]);
    if (sub.length > 1) B.inkLine(ctx, sub, 1, { col: COL.cool, w: 2.4, a: .65, glow: .5 });
  }

  function seabed(ctx, t, ld) {
    // the seabed: dark sand rising toward the back (the vanishing point), the other cables run back into the dark, their cut ends face us
    const [vx, vy] = SEA.vp;
    ctx.fillStyle = lin(ctx, 0, vy, 0, vy + 500, [[0, mixHex(P.night1, P.ind1, .35)], [.3, mixHex(P.night1, P.ind0, .4)], [1, P.night1]]);
    ctx.beginPath(); ctx.moveTo(-3000, vy + 30); ctx.quadraticCurveTo(vx, vy - 20, 5000, vy + 40); ctx.lineTo(5000, vy + 3000); ctx.lineTo(-3000, vy + 3000); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(P.blue0, .25); ctx.fillRect(-3000, vy - 2, 8000, 2);
    const strands = smooth(span(t, a.farMore - .1, a.farMore + .8));
    const all = [...OTHERS].sort((p, q) => p.y - q.y);
    for (const o of all) {
      // body: from the far point to the face (a tapered dark strip)
      const nx = -(o.y - vy), ny = (o.x - vx), nl = Math.hypot(nx, ny), ux = nx / nl, uy = ny / nl;
      ctx.fillStyle = lin(ctx, vx, vy, o.x, o.y, [[0, rgba(P.night0, .2)], [1, mixHex(P.ind2, P.night1, .5)]]);
      ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(o.x + ux * o.r, o.y + uy * o.r); ctx.lineTo(o.x - ux * o.r, o.y - uy * o.r); ctx.closePath(); ctx.fill();
      cableEnd(ctx, o.x, o.y, o.r, t, strands, o.seed, .25 + .4 * o.lit);
    }
  }

  function cableEnd(ctx, x, y, r, t, strands, seed, lum) {
    // a cut cable end, frontal: sheath ring, steel armour ring, the core with its fibres (tiny dots, a few faintly lit)
    ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill();
    ctx.strokeStyle = rgba(P.blue0, .55); ctx.lineWidth = Math.max(1, r * .05); ctx.beginPath(); ctx.arc(x, y, r * .97, -2.6, -.6); ctx.stroke();
    ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.beginPath(); ctx.arc(x, y, r * .78, 0, 6.29); ctx.fill();
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(x, y, r * .62, 0, 6.29); ctx.fill();
    if (strands > 0) {
      const rr = prng(seed); ctx.save(); ctx.globalAlpha = strands;
      for (let i = 0; i < 100; i += 2) { const [fx, fy] = FIB[i], on = rr() < .05; ctx.fillStyle = on ? rgba(COL.cool, .9) : rgba(COL.cool2, .22 * lum + .08); ctx.beginPath(); ctx.arc(x + fx * r * .6, y + fy * r * .6, Math.max(.8, r * .05), 0, 6.29); ctx.fill(); }
      ctx.restore();
    }
  }

  function faceDetail(ctx, t, dk = 0) {
    // OUR cable's end: the fibre cross-section (100 fibres in the core); the light we followed is fibre 0; on "five percent" 4 more light
    const R = FACE.r;
    cableEnd(ctx, FACE.x, FACE.y, R, t, 0, 1, 1);
    if (dk > 0) { ctx.strokeStyle = rgba(COL.cool2, .5 * dk); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(FACE.x, FACE.y, R * 1.01, 0, 6.29); ctx.stroke(); }
    const core = R * .6, arrive = smooth(span(t, tRun1 - .3, tRun1 + .3));
    const dots = smooth(span(t, a.farMore - .1, a.farMore + .8)), dim = 1 - .7 * smooth(span(t, a.dark - .05, a.dark + .9));
    FIB.forEach(([fx, fy], i) => {
      const li = LIT5.indexOf(i), on = li === 0 ? arrive : li > 0 ? expoOut(span(t, a.five - .05 + li * .12, a.five + .45 + li * .12)) : 0;
      const x = FACE.x + fx * core, y = FACE.y + fy * core, rr = core * .062;
      ctx.fillStyle = rgba(mixHex(P.ind1, COL.coolDeep, .5), .9 * dots); ctx.beginPath(); ctx.arc(x, y, rr, 0, 6.29); ctx.fill();
      ctx.strokeStyle = rgba(COL.cool2, .45 * dots * dim); ctx.lineWidth = rr * .22; ctx.beginPath(); ctx.arc(x, y, rr * .9, 0, 6.29); ctx.stroke();
      if (on > 0) { halo(ctx, x, y, rr * 5, .5 * on, COL.cool2, '#f4f7ff'); ctx.fillStyle = rgba('#f4f7ff', on); ctx.beginPath(); ctx.arc(x, y, rr * .75, 0, 6.29); ctx.fill(); }
    });
  }

  function nightBg(ctx) { ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.6, P.night1], [1, P.ind0]]); ctx.fillRect(0, 0, W, H); }
  draw.FIB = FIB; draw.LIT5 = LIT5; draw.tSea = tSea; draw.camS = camS; draw.worldS = worldS; draw.FACE = FACE; draw.breathe = breathe; draw.tFace1 = tFace1;
  return draw;
}
