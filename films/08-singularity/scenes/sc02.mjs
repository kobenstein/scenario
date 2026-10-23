// Film 8 · c02 · what the singularity really is (VO 01a; 65.74 → 130.66 s) · B1. ONE continuous take through the night shore (lib/s8_c02_shore)
// and two beach-house windows (portals into s8_desk rooms). No blend: places change by camera moves, through window glass, through the
// black heart of the ring (a full-black frame, ≤ .2 s), and in-world (the backdrop falls). Binding shot list: m1/bild/shots.md §8 c02.
//
// shot  | VO (accent)                                    | image                                                       | camera
// ------+------------------------------------------------+-------------------------------------------------------------+-------------------------------
// 02.01 | But what does the WORD actually mean?           | out of the Milky Way (plate sky) down onto the horizon light; label SINGULARITY | tilt down 1.25 s
// 02.02 | Most people picture a MOVIE.                    | pan left + travel: the open-air cinema, rows from behind     | pan 1.05 s
// 02.03 | A ROBOT uprising.                               | the screen flares red (≤ 1.2 s), sparks, the audience flinches 80 ms later | tiny push
// 02.04 | One DRAMATIC day.                               | white blast, long shadows backward over the sand             | hold
// 02.05 | That's NOT it.                                  | projector off, stars return, a back-row person turns to the sea | follow the turn to the light
// 02.06 | … Vernor VINGE:                                 | crane to the beach house, through the glass: desk lamp, typewriter typing, paperbacks; label | fly + push through glass
// 02.07 | … PREDICTIONS … HEART of a black hole.          | back out; dotted forecast lines end on the ring; the ring opens, push into the black heart | log dolly into black
// 02.08 | So are we THERE?                                | pull back out of the heart: the pier, a figure with a lantern | log pull back
// 02.09 | Honestly? … PROFIT …                            | pan up to the lab on the headland: the builders, coins into a chest | pan + zoom
// 02.10 | … SUPERINTELLIGENCE. Not YET.                   | the stair of light builds; the light climbs; stops on the last solid step at "yet" | tilt up with it
// 02.11 | That part may be a SALES pitch.                 | a corner of the sky lifts: it is a painted backdrop on a frame, ropes behind | hold
// 02.12 | But one part ISN'T.                             | the backdrop falls forward into the sea; the real light; a big swell | tilt down, push
// 02.13 | … FAST … FEW years …                            | the pier with +1 YR … +10; the swell races; beyond +3 the pier is torn away | track along the pier
// 02.14 | That's the singularity you're ALREADY living in.| pull back: the lantern figure stands at +1, water racing past | pull back
// 02.15 | Back in 1970 … FUTURE SHOCK.                    | cross to the beach-house window, through: the paperback drops onto the table; label | fly + push through glass
// 02.16 | Too much CHANGE, in too little TIME.            | the wind riffles its pages faster and faster, the flame bends | top-down turn
// 02.17 | You know the QUESTIONS.                         | pull back: you at the table from behind, the cup, the window | pull back
// 02.18 | What should I LEARN?                            | the hand lifts the notebook off the course books, puts it back | drift
// 02.19 | Will my JOB still exist …                       | the hand turns the work badge (scribbled name, no logo)       | drift
// 02.20 | What do I tell my CHILD?                        | the head turns: the child in the doorway holds up a drawing    | wide
// 02.21 | … stops MATCHING the land.                      | you hold the coast chart up to the window; the ink coast slides and cannot catch up; push into the blank middle = plate `paper` | over the shoulder, push
import { rgba, clamp, prng } from '../engine.mjs';
import { ready, track, camera, eoX, eiX, sio, qio, u01, pulse, settle, TAU, projPoly, fillPoly, projRuns } from '../lib/s8_kit.mjs';
import { drawSky, prepareSky } from '../lib/s8_sky.mjs';
import { drawSea } from '../lib/s8_sea.mjs';
import { lightAt, lensOf, drawLight } from '../lib/s8_light.mjs';
import { hand as handoff, paperLamp } from '../lib/handoff4.mjs';
import { label } from '../lib/s8_card.mjs';
import * as S from '../lib/s8_c02_shore.mjs';
import { typewriter, paperback } from '../lib/s8_c02_study.mjs';
import { DESK, room, sheet, sheetCorners, book, cup, badge, texMesh } from '../lib/s8_desk.mjs';
import { hand as drawHand } from '../lib/hand.mjs';
import { layer } from '../lib/art.mjs';

export default async function (T, R) {
  const SG = '01a', S_ = (p, n) => T.S(SG, p, n), E_ = (p, n) => T.E(SG, p, n);
  const Hin = handoff('c01>c02', T), Hout = handoff('c02>c03', T);
  const K = {
    b: Hin.b, word: S_('word'), most: S_('Most'), movie: S_('movie'), robot: S_('robot'), dramatic: S_('dramatic'), day: S_('day'),
    not: S_("That's not"), made: S_('It was made'), vernor: S_('Vernor'), point: S_('a point beyond'), predictions: S_('predictions'),
    heart: S_('heart'), so: S_('So are we'), there: S_('there'), honestly: S_('Honestly'), profit: S_('profit'), noOne: S_('And no one'),
    yet: S_('yet'), thatPart: S_('That part'), sales: S_('sales'), isnt: S_("isn't"), things: S_('Things now'), fast: S_('fast'), few: S_('few years'),
    sing: S_("That's the singularity"), already: S_('already'), back: S_('Back in'), future: S_('future shock'), tooMuch: S_('Too much'),
    change: S_('change'), time: S_('little time'), youKnow: S_('You know'), what: S_('What should'), learn: S_('learn'), will: S_('Will my job'),
    job: S_('job'), tell: S_('What do I tell'), child: S_('child'), feels: S_("That's what it feels"), matching: S_('matching'), end: Hout.a,
  };
  K.not += .4;   // "That's not": the accent is on "not"
  K.time += .24;
  const VG = S.HOUSES.vinge, YO = S.HOUSES.yours;
  // desk-coords key → shore key (positions and yaw are affine, so a track through converted keys equals the track in desk coords)
  const dk = (H, t, x, y, z, yaw, pitch, F) => { const p = S.toShore(H, [x, y, z]); return [t, p[0], p[1], p[2], yaw + H.face, pitch, F]; };
  const ci = (lx, y, lz) => S.CIN.at(lx, y, lz);
  // ---------------------------------------------------------------- the camera (shore coords): take A until the black heart, take B after
  K.blk = K.heart + 1.58;            // the frame is all black heart here (≈ .15 s)
  K.wb0 = K.robot - .05; K.wb1 = Math.min(K.robot + 1.13, K.dramatic - .3);   // red
  K.ww0 = K.dramatic - .04; K.ww1 = K.day + .45;                                // white
  const P1 = ci(1.2, 1.85, 6.5), P2 = ci(1.2, 1.85, 7.4), P3 = ci(1.4, 2.0, 8.6), CY0 = S.CIN.yaw + .04;
  const keysA = [
    [K.b, -4, 3.2, -8, .3, -.58, 1100],
    [K.b + 1.26, -4, 3.15, -7.9, .02, .05, 1400],
    [K.most + .05, -2.6, 2.85, -4.6, .0, .055, 1440],
    [K.movie - .02, ...ci(1.2, 1.85, 5.7), CY0, .02, 1400],
    [K.robot + .6, ...ci(1.2, 1.85, 6.6), CY0 + .005, .02, 1430],
    [K.not - .1, ...ci(1.2, 1.8, 8.0), CY0 + .01, .022, 1560],
    [K.not + 1.5, ...P3, .06, .03, 1400],
    dk(VG, K.vernor - .9, 0, 1.5, 5, Math.PI, .05, 1400),
    dk(VG, K.vernor, 0, 1.42, .9, Math.PI, .1, 1400),
    dk(VG, K.vernor + .55, 0, 1.26, .4, Math.PI, .78, 1300),
    dk(VG, K.point - .05, .01, 1.22, .35, Math.PI + .02, .8, 1330),
    dk(VG, K.point + .75, 0, 1.6, 2.0, Math.PI, .08, 1400),
    [K.predictions + .55, 13.5, 4.6, 6.5, .02, .05, 1400],
    [K.heart + .1, 13.1, 4.4, 8.4, .021, .045, 1440],
  ];
  const tB = keysA.map((_, i) => track(keysA.map((k) => [k[0], i === 6 ? Math.log(k[6]) : k[i]])));
  // the push into the heart (log dolly, accelerating) after the last A key
  const pushU = (t) => u01(t, K.heart + .15, K.blk);
  const camA = (t) => {
    const v = [1, 2, 3, 4, 5].map((i) => tB[i](t)); let F = Math.exp(tB[6](t));
    if (t > K.heart + .15) { const u = pushU(t), e = u * u; F = Math.exp(Math.log(1440) + (Math.log(12000) - Math.log(1440)) * e); v[3] = .021 + (S.LAZ - .021) * sio(u); v[4] = .045 + (-S.LEL - .045) * sio(u); }
    return camera({ x: v[0], y: v[1], z: v[2], yaw: v[3], pitch: v[4], F });
  };
  const PIERC = [3.5, 5.6, 14];   // high enough that the pier is below the frame while the heart fills it
  K.lab0 = K.honestly + .05; K.lab1 = K.lab0 + 1.05; K.ret0 = K.noOne + .05; K.ret1 = K.noOne + 1.0;
  K.snap = K.thatPart + .15; K.fall0 = K.isnt - .08; K.fall1 = K.fall0 + .75;
  const keysB = [
    [K.blk, ...PIERC, S.LAZ, -S.LEL, 12000],
    [K.there + .1, 3.5, 3.3, 13.6, .02, .03, 1400],
    [K.lab0, 3.5, 3.3, 14.2, .03, .025, 1420],
    [K.lab1, 3.5, 3.3, 14.1, .416, -.116, 4600],
    [K.ret0, 3.5, 3.3, 14.0, .433, -.118, 9800],
    [K.ret1, 3.5, 3.3, 13.4, .022, .0, 1400],
    [K.yet + .05, 3.5, 3.4, 13.6, .025, -.14, 1400],
    [K.snap, 3.3, 3.45, 14.4, .018, -.142, 1450],
    [K.fall0, 3.95, 3.52, 16.3, .05, -.156, 1570],
    [K.fall1 + .3, 5.0, 2.7, 18.4, .02, .02, 1400],
    [K.things + .55, 5.6, 2.4, 23, .0, .03, 1400],
    [K.sing - .1, 5.6, 2.4, 36, -.02, .03, 1400],
    [K.already + .2, 5.8, 3.4, 9.5, -.12, .06, 1400],
    [K.back, 5.85, 3.45, 9.3, -.13, .06, 1390],
    dk(YO, K.back + 1.55, 0, 1.5, 4.5, Math.PI, .06, 1400),
    dk(YO, K.back + 2.2, 0, 1.42, .9, Math.PI, .25, 1400),
    dk(YO, K.back + 2.8, .1, 1.32, .44, Math.PI, .95, 1300),
    dk(YO, K.tooMuch + .1, .13, 1.25, .37, Math.PI + .14, 1.06, 1340),
    dk(YO, K.change + .6, .12, 1.4, .2, Math.PI * .55, 1.38, 1300),
    dk(YO, K.youKnow - .1, .12, 1.45, .02, .15, 1.38, 1300),
    dk(YO, K.youKnow + .5, .2, 1.7, -.55, .08, .8, 1300),
    dk(YO, K.youKnow + 1.15, .28, 1.62, -1.72, 0, .34, 1300),
    dk(YO, K.what - .05, .3, 1.61, -1.68, .02, .36, 1320),
    dk(YO, K.will - .05, .38, 1.58, -1.52, .08, .43, 1400),
    dk(YO, K.tell - .05, .30, 1.6, -1.40, .0, .41, 1450),
    dk(YO, K.tell + .75, .6, 1.5, -2.0, -.6, .1, 1000),
    dk(YO, K.feels + .05, .56, 1.5, -1.95, -.55, .1, 1020),
    dk(YO, K.feels + 1.0, .22, 1.52, -1.35, .0, .12, 1250),
    dk(YO, K.matching + .2, .14, 1.55, -.95, .0, .05, 1300),
  ];
  // the chart held up at the window and the camera that sees its blank middle as the paper plate
  const CH = { x: .02, y: 1.24, z: .40, w: .64, aspect: 16 / 9 };
  CH.h = CH.w / CH.aspect;
  const plateD = 1400 * (CH.w / 2) / 1920;
  keysB.push(dk(YO, K.matching + 1.0, .08, 1.5, -.62, .0, .02, 1350));
  keysB.push(dk(YO, K.end, CH.x, CH.y + CH.h / 2, CH.z - plateD, 0, 0, 1400));
  const tBk = keysB[0].map((_, i) => (i === 0 ? null : track(keysB.map((k) => [k[0], i === 6 ? Math.log(k[6]) : k[i]]))));
  const camB = (t) => {
    let F = Math.exp(tBk[6](t));
    if (t < K.there + .1) { const u = u01(t, K.blk, K.there + .1), e = 1 - Math.pow(1 - u, 3); F = Math.exp(Math.log(12000) + (Math.log(1400) - Math.log(12000)) * e); }
    return camera({ x: tBk[1](t), y: tBk[2](t), z: tBk[3](t), yaw: tBk[4](t), pitch: tBk[5](t), F });
  };
  const cam = (t) => (t < K.blk ? camA(t) : camB(t));

  // ---------------------------------------------------------------- the world state over time
  // sea time: the swell races from "fast" (×4) and calms again after the cut to the house
  const W0 = K.fast - .3, W1 = K.few + 1.0, W2 = K.back + .2, W3 = K.back + 1.9;
  const tSea = (t) => {
    let x = t; const D1 = W1 - W0, D2 = W3 - W2;
    if (t > W0) { const u = clamp((t - W0) / D1); x += 3 * D1 * (u / 2 - Math.sin(Math.PI * u) / (2 * Math.PI)); }
    if (t > W1) x += 3 * (Math.min(t, W2) - W1);
    if (t > W2) { const u = clamp((t - W2) / D2); x += 3 * D2 * (u / 2 + Math.sin(Math.PI * u) / (2 * Math.PI)); }
    return x;
  };
  const cinState = (t) => {
    let mode = 'film', t0;
    if (t >= K.wb0 && t < K.wb1) { mode = 'red'; t0 = K.wb0; }
    else if (t >= K.ww0 && t < K.ww1) mode = 'white';
    else if (t >= K.not) mode = 'off';
    return { mode, t0, beam: t < K.not ? 1 : 0, flinch: t >= K.wb0 ? K.wb0 + .08 : null, shadows: mode === 'white' ? eoX(u01(t, K.ww0, K.ww0 + .25)) : 0, turn: sio(u01(t, K.not + .1, K.not + .95)) };
  };
  const ringSize = (t) => 1 + 2 * eoX(u01(t, K.heart, K.heart + .75)) - 2 * sio(u01(t, K.blk + .25, K.there + .15));
  const heartK = (t) => eoX(u01(t, K.heart + .02, K.heart + .7)) * (1 - sio(u01(t, K.blk + .3, K.there + .1)));
  const built = (t) => 22 * sio(u01(t, K.ret0 + .5, K.yet - .25)), climbOf = (t) => (t >= K.ret0 + .7 && t < K.snap ? Math.max(.001, 22 * sio(u01(t, K.ret0 + .7, K.yet))) : 0);
  const stairOn = (t) => t >= K.ret0 + .45 && t < K.snap;
  const fallA = (t) => (Math.PI / 2) * eiX(u01(t, K.fall0, K.fall1));
  K.forecasts = S_('forecasts');
  const pierState = (t) => ({ figure: { z: 22 }, marks: u01(t, K.things + .2, K.forecasts + .2), tear: sio(u01(t, K.few - .05, K.few + 1.7)) });
  const swellA = (t) => 1.1 * sio(u01(t, K.isnt, K.isnt + 1.2)) * (1 - sio(u01(t, K.back + 2, K.back + 4)));
  const START = [[3.5, 20], [3.5, 32], [3.5, 48], [7, 9.8], [11, 11.4], [15, 13.6], [18.5, 15.8]];

  // ---------------------------------------------------------------- the backdrop (c02.11–c02.12): the frame at K.snap painted on a canvas
  const [SNc, SNg] = layer(1920, 1080);
  let snapDone = false;
  const snapshot = () => { if (snapDone) return; snapDone = true; SNg.setTransform(1, 0, 0, 1, 0, 0); SNg.fillStyle = '#000'; SNg.fillRect(0, 0, 1920, 1080); shoreWorld(SNg, K.snap, cam(K.snap), { paint: true }); };
  const flapF = (t) => .42 * eoX(u01(t, K.thatPart + .25, K.sales + .25)), flapPhi = (t) => (2.0 * sio(u01(t, K.thatPart + .25, K.sales + .1)) + .22 * Math.sin(t * 6.3) * u01(t, K.thatPart + .4, K.thatPart + .9) + .1 * Math.sin(t * 11.7 + 1)) * (flapF(t) > 0 ? 1 : 0);
  // world point of the backdrop at (u, v), standing (a = 0) or fallen forward by a (about its bottom edge, toward the camera), sunk by sk
  const bdAt = (u, v, a, sk = 0) => { const p = S.BD.at(u, v), h = S.BD.h * (1 - v); return [p[0] - S.BD.d[0] * h * Math.sin(a), h * Math.cos(a) - sk, p[2] - S.BD.d[2] * h * Math.sin(a)]; };
  const rotAxis = (X, A, B, phi) => {   // Rodrigues: X about the axis A→B by phi
    const k = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], L = Math.hypot(...k); k[0] /= L; k[1] /= L; k[2] /= L;
    const v = [X[0] - A[0], X[1] - A[1], X[2] - A[2]], c = Math.cos(phi), s = Math.sin(phi), d = k[0] * v[0] + k[1] * v[1] + k[2] * v[2];
    const cr = [k[1] * v[2] - k[2] * v[1], k[2] * v[0] - k[0] * v[2], k[0] * v[1] - k[1] * v[0]];
    return [0, 1, 2].map((i) => A[i] + v[i] * c + cr[i] * s + k[i] * d * (1 - c));
  };
  let FLIP = 0;   // the flap's fold direction: toward the camera (decided once from the snapshot camera)
  function backdrop(ctx, t, C) {
    snapshot();
    if (!FLIP) { const Cs = cam(K.snap), A = S.BD.at(.3, 0), B = S.BD.at(0, .3), P0 = S.BD.at(0, 0); FLIP = Cs.depth(...rotAxis(P0, A, B, .2)) < Cs.depth(...rotAxis(P0, A, B, -.2)) ? 1 : -1; }
    const Cs = cam(K.snap), a = fallA(t), src = (u, v) => { const p = Cs.P(...S.BD.at(u, v)); return p ? [p[0], p[1]] : null; };
    const dst = (P) => (u, v) => { const p = C.P(...P(u, v), 1); return p ? [p[0], p[1]] : null; };
    const f = a > 0 ? 0 : flapF(t), phi = a > 0 ? 0 : flapPhi(t);
    // the canvas (minus the flap), as a mesh: the flap region is the triangle u + v < f
    const main = (u, v) => bdAt(u, v, a);
    if (f < .002) texMesh(ctx, SNc, src, dst(main), 8);
    else {
      // the canvas without the corner triangle: two quads (top strip right of the flap, and everything below)
      const q1 = (u, v) => [f + (1 - f) * u, f * v], q2 = (u, v) => [u, f + (1 - f) * v];
      texMesh(ctx, SNc, (u, v) => src(...q1(u, v)), (u, v) => dst(main)(...q1(u, v)), 5);
      texMesh(ctx, SNc, (u, v) => src(...q2(u, v)), (u, v) => dst(main)(...q2(u, v)), 8);
      // the remaining triangle (f,0)-(f,f)-(0,f) of the canvas
      texMesh(ctx, SNc, (u, v) => src(f - f * v * (1 - u), f * v), (u, v) => dst(main)(f - f * v * (1 - u), f * v), 4);
      // the hole: the real sky behind (drawn already), the frame's battens and the ropes, starlit
      const k = C.P(...S.BD.at(.1, .1))?.[2] ?? .9;
      ctx.save(); ctx.lineCap = 'round';
      const bat = (A, B, w) => { const p = C.P(...A), q = C.P(...B); if (!p || !q) return; ctx.strokeStyle = '#1a120c'; ctx.lineWidth = Math.max(2, w * k); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); ctx.strokeStyle = rgba('#a4b0dc', .3); ctx.lineWidth = 1; ctx.stroke(); };
      const back = (u, v) => { const p = S.BD.at(u, v); return [p[0] + S.BD.d[0] * 8, p[1], p[2] + S.BD.d[2] * 8]; };
      ctx.save(); const hole = projPoly(C, [S.BD.at(0, 0), S.BD.at(f, 0), S.BD.at(0, f)]); fillPoly(ctx, hole); ctx.clip();
      bat(back(0, .02), back(1, .02), 9); bat(back(.02, 0), back(.02, 1), 9); bat(back(.18, 0), back(.18, 1), 7); bat(back(0, .2), back(1, .2), 7); bat(back(0, .45), back(.45, 0), 6);
      for (const [u0, v0] of [[.03, .03], [.18, .2], [.02, .3]]) { const A = back(u0, v0), B = [A[0] + S.BD.d[0] * 260, 0, A[2] + S.BD.d[2] * 260], p = C.P(...A), q = C.P(...B); if (p && q) { ctx.strokeStyle = rgba('#c8b89a', .5); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.quadraticCurveTo((p[0] + q[0]) / 2, (p[1] + q[1]) / 2 + 30, q[0], q[1]); ctx.stroke(); } }
      ctx.restore(); ctx.restore();
      // the flap: rotated about the fold line (f,0)–(0,f) toward the camera; the curl grows toward the corner
      // the flap as the convex quad (0,0) (f,0) (f/2,f/2) (0,f) of the canvas, folded about the line (f,0)–(0,f)
      const fq = (u, v) => [f * u * (1 - v) + f / 2 * u * v, f * v * (1 - u) + f / 2 * u * v];
      const A = S.BD.at(f, 0), B = S.BD.at(0, f), flap = (u, v) => { const [uu, vv] = fq(u, v), d = 1 - (uu + vv) / f, P = S.BD.at(uu, vv); return rotAxis(P, A, B, FLIP * phi * (1 + .6 * d * d)); };
      // per cell: the painted front where it still faces us, the raw linen back where the curl has turned it over
      const N = 10, base = (() => { const a0 = C.P(...S.BD.at(0, 0)), b0 = C.P(...S.BD.at(1, 0)), d0 = C.P(...S.BD.at(0, 1)); return a0 && b0 && d0 ? Math.sign((b0[0] - a0[0]) * (d0[1] - a0[1]) - (b0[1] - a0[1]) * (d0[0] - a0[0])) : 1; })();
      for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
        const u0 = i / N, u1 = (i + 1) / N, v0 = j / N, v1 = (j + 1) / N, Q = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]].map(([u, v]) => C.P(...flap(u, v), 1)); if (Q.some((q) => !q)) continue;
        const w = Math.sign((Q[1][0] - Q[0][0]) * (Q[3][1] - Q[0][1]) - (Q[1][1] - Q[0][1]) * (Q[3][0] - Q[0][0]));
        if (w === base) texMesh(ctx, SNc, (u, v) => src(...fq(u0 + (u1 - u0) * u, v0 + (v1 - v0) * v)), (u, v) => { const q = C.P(...flap(u0 + (u1 - u0) * u, v0 + (v1 - v0) * v), 1); return q ? [q[0], q[1]] : null; }, 1);
        else { const sh = .55 + .45 * Math.cos(phi * (1 + .6 * (1 - (fq((u0 + u1) / 2, (v0 + v1) / 2)[0] + fq((u0 + u1) / 2, (v0 + v1) / 2)[1]) / f) ** 2) - Math.PI), col = `rgb(${Math.round(150 * sh + 30)},${Math.round(138 * sh + 28)},${Math.round(112 * sh + 30)})`; ctx.beginPath(); Q.forEach((q, k2) => (k2 ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.stroke(); }
      }
      // the curled edge catches the starlight
      { const E = []; for (let i = 0; i <= 16; i++) E.push(flap(i / 16, 0)); for (let i = 0; i <= 16; i++) E.push(flap(1, i / 16)); for (let i = 16; i >= 0; i--) E.push(flap(i / 16, 1)); for (let i = 16; i >= 0; i--) E.push(flap(0, i / 16)); for (const run of projRuns(C, E, 1)) { ctx.strokeStyle = rgba('#e8dcc0', .5); ctx.lineWidth = 1.2; ctx.beginPath(); run.forEach((q, k2) => (k2 ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke(); } }
    }
    // the splash where it lands
    if (t > K.fall1 - .05 && t < K.fall1 + 1.2) {
      const r = prng(91), u = u01(t, K.fall1 - .05, K.fall1 + 1.2);
      for (let i = 0; i < 160; i++) { const uu = r(), p = C.P(...bdAt(uu, .1 + .9 * r(), Math.PI / 2)); if (!p) continue; const h = (1 - (1 - u) ** 2) * (8 + 26 * r()) * (1 - u * .4), x = p[0] + (r() - .5) * 20 * u; ctx.fillStyle = `rgba(230,236,250,${.75 * (1 - u)})`; ctx.fillRect(x, p[1] - h, 1.6, 1.6 + 2 * r()); }
    }
  }

  // ---------------------------------------------------------------- the shore world in one call
  const LS0 = { az: S.LAZ, el: S.LEL };
  function lightState(t) { return { ...LS0, ign: t < K.b + .5 ? u01(t, K.b, K.b + .5) : 1, ring: 1, size: ringSize(t), pulse: .15 * pulse(t, K.word - .1, K.word + .8) }; }
  function shoreWorld(ctx, t, C, o = {}) {
    const st = lightState(t), out = {};
    const climb = o.paint ? climbOf(K.snap - 1e-4) : climbOf(t), useStair = o.paint || stairOn(t);
    let L = lightAt(C, st);
    if (useStair && climb > 0) { const i0 = Math.floor(climb), f = climb - i0, p0 = S.stepPos(i0), p1 = S.stepPos(i0 + 1); const P = C.P(p0[0] + (p1[0] - p0[0]) * f, p0[1] + (p1[1] - p0[1]) * f + Math.sin(Math.PI * f) * 24 * .4, p0[2] + (p1[2] - p0[2]) * f); if (P) L = { x: P[0], y: P[1] }; }
    const lensOn = lensOf(C, st, L), lens = lensOn && st.ign > 0 ? { ...lensOn, th: lensOn.th * clamp(u01(t, K.b, K.b + .8)) } : null;
    drawSky(ctx, t, C, { lens });
    if (useStair) S.stair(ctx, t, C, { built: o.paint ? 22 : built(t), dotted: Math.round(8 * u01(t, K.ret0 + .5, K.ret0 + 2.2)) + (o.paint ? 8 : 0) * 0, climb });
    const bdUp = !o.paint && t >= K.snap && t < K.fall1;
    // glint: during the backdrop the painted light's glint stays, sliding to the real light while it falls
    let gx = L ? L.x : null;
    if (!o.paint && t >= K.snap && t < K.fall1 + .3 && L) { const Cs = cam(K.snap), ps = (() => { const c = 22, p0 = S.stepPos(c); return Cs.P(...p0); })(), Ls = lightAt(Cs, st); if (ps && Ls) gx = L.x + (ps[0] - Ls.x) * (1 - sio(u01(t, K.fall0, K.fall1 + .3))); }
    const ts = tSea(t);
    drawSea(ctx, ts, C, { glints: L && st.ign > 0 ? [{ x: gx, y: Math.max(L.y, C.hy), col: '#bfefff', a: st.ign, w: 3, spread: .2 }] : [] });
    S.swell(ctx, t, C, { A: o.paint ? 0 : swellA(t), tS: ts, speed: 5 });
    S.headland(ctx, t, C, { coins: eoX(u01(t, K.profit - .1, K.profit + .7)) });
    drawLight(ctx, t, C, !o.paint && t >= K.snap && t < K.fall1 + .3 ? { ...st, ign: sio(u01(t, K.fall0 + .1, K.fall1 + .3)) } : st, L);
    // the black heart
    const hk = heartK(t);
    if (hk > 0 && L) { S.heart(ctx, t, L, 64 * st.size * hk * C.F / 1400 * .98, 1); out.heart = true; }
    if (!o.paint && L) {   // the forecast lines (c02.07)
      const fu = u01(t, K.predictions - .1, K.predictions + 1.6) * (1 - u01(t, K.heart + .2, K.heart + .7));
      if (fu > 0) S.forecasts(ctx, t, C, L, 64 * st.size * C.F / 1400, eoX(fu), START);
    }
    if (bdUp) backdrop(ctx, t, C);
    S.beach(ctx, t, C);
    const pr = S.pier(ctx, t, C, pierState(t)); out.pier = pr;
    if (!o.noHouses) {
      const ord = [VG, YO].sort((a, b) => C.depth(b.x, b.y, b.z) - C.depth(a.x, a.y, a.z));
      for (const H of ord) S.house(ctx, t, C, H, { room: H === VG ? vingeRoom(t) : yoursRoom(t) });
    }
    S.cinema(ctx, t, C, cinState(t));
    out.L = L;
    return out;
  }

  // ---------------------------------------------------------------- the two rooms
  const TW = typewriter({ x: -.02, z: .06, t0: K.vernor - 30, cps: 11 });
  const VINGE_ITEMS = [TW, paperback({ x: .42, z: .16, rot: .35, seed: 3 }), paperback({ x: .5, z: -.06, rot: -.25, seed: 5, c0: '#0a1a22', c1: '#1a3a40', neb: 'rgba(140,220,255,.4)', band: '#d8d0c0' }), paperback({ x: .46, z: -.05, y: DESK.top + .018, rot: -.1, seed: 7, c0: '#180a20', c1: '#40182a', band: '#e86a3a' }), cup({ x: -.62, z: -.1 })];
  function vingeRoom() { return { items: VINGE_ITEMS, lampKind: 'desk', open: true }; }
  // your table
  const FS = { x: .12, z: .02 };
  K.drop0 = K.future - .36;
  const fsY = (t) => { if (t < K.drop0) return DESK.top + .9; const u = clamp((t - K.drop0) / .36); if (u < 1) return DESK.top + .6 * (1 - u * u); const b = t - K.future; return DESK.top + Math.max(0, .02 * Math.sin(b * 18) * Math.exp(-b * 9)); };
  // the riffle: the cover opens (.45 s), the leaves turn faster and faster (to ~13/s), then the wind drops to ~1 leaf a second
  const fsOpenC = (t) => { const a = K.change - .2; if (t < a) return 0; if (t < a + .45) return sio(u01(t, a, a + .45)); const s = t - a - .45; if (s < 2) return 1 + 1.6 * s + 3 * s * s; const r = s - 2; if (r < 1.5) return 17.2 + 13.6 * r - (12.4 / 3) * r * r; return 17.2 + 13.6 * 1.5 - 12.4 / 3 * 2.25 + 1.2 * (r - 1.5); };
  const FUTURE = (g, t, W, H) => {
    g.fillStyle = '#0c0b0e'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#e8e2d4'; g.textAlign = 'center'; g.font = `400 ${W * .34}px Anton`; g.fillText('FUTURE', W / 2, H * .3); g.fillText('SHOCK', W / 2, H * .43);
    g.fillStyle = '#d63a2a'; g.fillRect(W * .12, H * .48, W * .76, H * .012);
    g.fillStyle = '#c8c2b4'; g.font = `600 ${W * .07}px Inter`; g.fillText('ALVIN TOFFLER', W / 2, H * .9);
  };
  const BOOKS = [{ x: .5, z: -.13, w: .17, d: .24, th: .032, rot: -.18, col: '#2a3a5a' }, { x: .51, z: -.12, w: .16, d: .23, th: .028, rot: -.1, col: '#5a2a24', y: DESK.top + .032 }, { x: .5, z: -.125, w: .155, d: .22, th: .03, rot: -.22, col: '#2a4a3a', y: DESK.top + .06 }];
  const NB = { x: .5, z: -.12, w: .14, d: .2, th: .012, rot: -.15, col: '#1a1a1e', y0: DESK.top + .09 };
  const nbLift = (t) => sio(u01(t, K.what + .15, K.learn + .1)) - sio(u01(t, K.learn + .35, K.will - .05));
  const BADGE = { x: .27, z: -.24 };
  const badgeTurn = (t) => sio(u01(t, K.job - .1, K.job + .5)), badgeLift = (t) => pulse(t, K.job - .15, K.job + .6);
  const chartPose = (t) => { const u = sio(u01(t, K.feels + .1, K.feels + 1.25)), fl = { x: .1, z: .3, y: DESK.top + .002 }; return { x: fl.x + (CH.x - fl.x) * u, z: fl.z + (CH.z - fl.z) * u, y: fl.y + (CH.y - fl.y) * u + .12 * Math.sin(Math.PI * u), w: CH.w, aspect: CH.aspect, tilt: Math.PI / 2 * u }; };
  const coastDX = (t) => 70 * sio(u01(t, K.matching - .1, K.matching + .9)) + 8 * Math.sin(t * 2.3) * u01(t, K.matching, K.matching + 1);
  const CHINK = (() => {   // the old chart's ink: a coast on the left, islands on the right, soundings, a rose in a corner; the middle half stays blank
    const r = prng(303), coast = []; for (let i = 0; i <= 60; i++) { const y = -20 + i * 19; coast.push([200 + 120 * Math.sin(i * .37) + 60 * Math.sin(i * 1.13 + 1) + 30 * (r() - .5), y]); }
    const isl = []; for (const [cx, cy, R0] of [[1640, 180, 70], [1760, 420, 50], [1600, 880, 90], [1820, 700, 40]]) { const p = []; for (let i = 0; i <= 24; i++) { const a = i / 24 * TAU; p.push([cx + Math.cos(a) * R0 * (.75 + .35 * r()), cy + Math.sin(a) * R0 * (.6 + .3 * r())]); } isl.push(p); }
    const snd = []; for (let i = 0; i < 70; i++) { const x = r() < .5 ? 300 + r() * 150 : 1460 + r() * 120, y = 40 + r() * 1000; snd.push([x, y, Math.floor(r() * 40) + 2]); }
    return { coast, isl, snd };
  })();
  const chartLit = (t) => .22 + .78 * sio(u01(t, K.feels + .5, K.feels + 1.6));
  const chartInk = (g, t, W, H) => {
    g.save(); g.translate(480, 270); g.scale(.5, .5); paperLamp(g, t, { rect: [-960, -540, 3840, 2160] }); g.restore();
    const lk = chartLit(t); if (lk < 1) { g.fillStyle = `rgba(40,26,16,${.78 * (1 - lk)})`; g.fillRect(0, 0, W, H); }
    const dx = coastDX(t), ink = 'rgba(36,28,22,.92)';
    g.save(); g.translate(dx, 0);
    g.fillStyle = 'rgba(96,66,40,.38)'; g.beginPath(); g.moveTo(-40, -40); CHINK.coast.forEach(([x, y]) => g.lineTo(x, y)); g.lineTo(-40, 1120); g.closePath(); g.fill();
    g.strokeStyle = ink; g.lineWidth = 5; g.beginPath(); CHINK.coast.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke();
    for (let k = 1; k <= 3; k++) { g.strokeStyle = `rgba(42,36,32,${.35 - k * .08})`; g.lineWidth = 1.2; g.beginPath(); CHINK.coast.forEach(([x, y], i) => (i ? g.lineTo(x + k * 16, y) : g.moveTo(x + k * 16, y))); g.stroke(); }
    g.strokeStyle = 'rgba(42,36,32,.3)'; g.lineWidth = 1; for (let y = 0; y < 1080; y += 14) { const i = Math.min(60, Math.max(0, Math.round((y + 20) / 19))), x = CHINK.coast[i][0]; g.beginPath(); g.moveTo(x - 90, y); g.lineTo(x - 10, y - 10); g.stroke(); }
    g.restore();
    g.save(); g.translate(-dx * .6, 0);
    for (const p of CHINK.isl) { g.fillStyle = 'rgba(96,66,40,.38)'; g.strokeStyle = ink; g.lineWidth = 4; g.beginPath(); p.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fill(); g.stroke(); }
    g.restore();
    g.fillStyle = 'rgba(42,36,32,.55)'; g.font = '500 16px Inter'; for (const [x, y, n] of CHINK.snd) g.fillText(String(n), x, y);
    // the rose in the lower-left corner and the cartouche top right (both well outside the middle)
    g.save(); g.translate(330, 930); g.strokeStyle = ink; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 90, 0, TAU); g.stroke(); g.beginPath(); g.arc(0, 0, 70, 0, TAU); g.stroke();
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU - Math.PI / 2, L = i % 4 ? 70 : 120; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * L, Math.sin(a) * L); g.stroke(); } g.restore();
    g.strokeStyle = ink; g.lineWidth = 2; g.strokeRect(1500, 40, 380, 120); g.strokeRect(1510, 50, 360, 100); g.fillStyle = 'rgba(42,36,32,.6)'; for (let i = 0; i < 5; i++) g.fillRect(1550 + i * 62, 90, 44, 8);
    g.strokeStyle = 'rgba(42,36,32,.6)'; g.lineWidth = 4; g.strokeRect(14, 14, W - 28, H - 28);
  };
  function chartItem(t) {
    const s = chartPose(t);
    return { x: s.x, z: s.z, drawItem: (ctx, tt, C) => {
      const K4 = sheetCorners(s), pts = K4.map((p) => C.P(...p));
      const wpx = pts.every(Boolean) ? Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]) : 4000, res = wpx > 1900 ? 2 : wpx > 950 ? 1 : .5;
      sheet(ctx, tt, C, { ...s, lamp: false, res, n: res > 1 ? 6 : 4, draw: chartInk });
      if (s.tilt > .3) {   // your two hands hold it at its side edges
        for (const side of [-1, 1]) { const e = side < 0 ? [K4[0], K4[3]] : [K4[1], K4[2]], m = [0, 1, 2].map((i) => e[0][i] * .4 + e[1][i] * .6), w = C.P(m[0] + side * .03, m[1] - .09, m[2] - .06), tip = C.P(m[0] - side * .015, m[1] + .02, m[2] - .005); if (!w || !tip) continue; const sc = Math.hypot(tip[0] - w[0], tip[1] - w[1]) / 110; drawHand(ctx, w[0], w[1], sc, { pose: 'grip', ang: Math.atan2(tip[1] - w[1], tip[0] - w[0]), flip: side < 0, skin: '#c99a74', sleeve: '#2a2236', rim: '#ffb066', light: [-.6, -1], t: tt, sleeveLen: 380 }); }
      }
    } };
  }
  function nbItem(t) {
    const l = nbLift(t);
    return { x: NB.x, z: NB.z, drawItem: (ctx, tt, C) => { book({ ...NB, y: NB.y0 + .11 * l, rot: NB.rot + .25 * l, cover: (g, ttt, W, H) => { g.fillStyle = '#1e1e24'; g.fillRect(0, 0, W, H); g.fillStyle = '#c8b890'; g.fillRect(W * .1, H * .1, W * .8, H * .04); } }).drawItem(ctx, tt, C); } };
  }
  function yoursRoom(t, o = {}) {
    const items = [
      ...BOOKS.map((b) => book(b)), nbItem(t), badge({ ...BADGE, turn: badgeTurn(t), lift: badgeLift(t) }), cup({ x: -.32, z: -.2 }),
      ...(t >= K.drop0 ? [book({ x: FS.x, z: FS.z, w: .11, d: .175, th: .02, rot: Math.PI + .06, y: fsY(t), col: '#0c0b0e', cover: FUTURE, open: fsOpenC(t) })] : []), chartItem(t),
    ];
    return { items, lampKind: 'oil', open: true, outsideDraw: o.outsideFn, wind: t > K.change - .4 && t < K.youKnow + 1.5 ? .55 + .35 * Math.sin(t * 3.1) * Math.sin(t * 1.3) : .08 * Math.sin(t * 1.7), person: t > K.change + .3 ? { turn: -sio(u01(t, K.tell + .15, K.child - .1)) * (1 - sio(u01(t, K.feels - .3, K.feels + .4))) } : null, door: t > K.tell - .5 ? { open: sio(u01(t, K.tell + .05, K.tell + .65)), child: 1, drawing: eoX(u01(t, K.child - .1, K.child + .45)) } : null };
  }

  // ---------------------------------------------------------------- the hand at your table (c02.18 notebook, c02.19 badge)
  function yourHand(ctx, t, C) {
    const inU = eoX(u01(t, K.what - .25, K.what + .3)) - eiX(u01(t, K.tell - .35, K.tell + .15)); if (inU <= .001) return;
    const toBadge = sio(u01(t, K.will - .2, K.job - .15));
    const nbl = nbLift(t), g1 = [NB.x - .04, NB.y0 + .11 * nbl + .012, NB.z - .08], g2 = [BADGE.x + .01, DESK.top + .01 + .05 * badgeLift(t), BADGE.z - .03];
    const G = [0, 1, 2].map((i) => g1[i] + (g2[i] - g1[i]) * toBadge), Wd = [G[0] + .02, G[1] + .03, G[2] - .17];
    const away = 1 - inU, Wp = C.P(Wd[0] + .15 * away, Wd[1] - .25 * away, Wd[2] - .35 * away), Gp = C.P(G[0] + .15 * away, G[1] - .25 * away, G[2] - .35 * away); if (!Wp || !Gp) return;
    const sc = Math.hypot(Gp[0] - Wp[0], Gp[1] - Wp[1]) / 105;
    drawHand(ctx, Wp[0], Wp[1], sc, { pose: 'grip', ang: Math.atan2(Gp[1] - Wp[1], Gp[0] - Wp[0]), skin: '#c99a74', sleeve: '#2a2236', rim: '#ffb066', light: [-.8, -.6], t, sleeveLen: 420, close: .6 + .3 * Math.sin(t * .7) * .1 });
  }

  // ---------------------------------------------------------------- the frame
  const inside = (H, C) => { const Cd = S.deskCam(H, C); return Cd.z < DESK.wallZ - .002 && Math.abs(Cd.x) < 1.75 && Cd.y > .1 && Cd.y < 2.4 ? Cd : null; };
  const outsideYours = (ctx, t, Cd) => { shoreWorld(ctx, t, S.shoreCam(YO, Cd), { noHouses: true }); };
  function frame(ctx, t) {
    const C = cam(t);
    let Cd = null;
    if (t > K.back && (Cd = inside(YO, C))) {
      const out = room(ctx, t, Cd, yoursRoom(t, { outsideFn: (c, tt, Cw) => outsideYours(c, tt, Cw) }));
      yourHand(ctx, t, Cd);
      const tu = u01(t, K.future + .05, K.future + .7) - u01(t, K.tooMuch + .3, K.tooMuch + .75), bp = Cd.P(FS.x + .06, DESK.top + .02, FS.z);
      if (tu > 0 && bp) label(ctx, t, bp[0], bp[1], tu, 'ALVIN TOFFLER', '1970', { dx: 60, len: 110 });
      void out; return;
    }
    if (t > K.made && t < K.predictions && (Cd = inside(VG, C))) {
      room(ctx, t, Cd, vingeRoom(t));
      const tp = Cd.P(TW.x, DESK.top + .14, TW.z - .1), tu = u01(t, K.vernor, K.vernor + .6) - u01(t, K.point + .1, K.point + .5);
      if (tp && tu > 0) label(ctx, t, tp[0], tp[1], tu, 'VERNOR VINGE', '1993', { dx: 70, len: 120 });
      return;
    }
    const o = shoreWorld(ctx, t, C);
    const su = u01(t, K.word - .05, K.word + .55) - u01(t, K.most - .3, K.most + .05);
    if (su > 0 && o.L) label(ctx, t, o.L.x + 8, o.L.y - 14, su, 'SINGULARITY', '', { dx: 46, len: 130 });
    if (t > K.made && t < K.predictions) {   // the label also holds while the camera is still outside the glass
      const p = C.P(...S.toShore(VG, [TW.x, DESK.top + .14, TW.z - .1])), tu = u01(t, K.vernor, K.vernor + .6) - u01(t, K.point + .1, K.point + .5);
      if (p && tu > 0) label(ctx, t, p[0], p[1], tu, 'VERNOR VINGE', '1993', { dx: 70, len: 120 });
    }
  }
  prepareSky();
  await ready();
  return [
    { t: K.b, tr: 'cut', d: .1, draw: frame, print: Hin.print },
    { t: K.blk, tr: 'cut', d: .1, draw: frame, print: Hout.print },
  ];
}
