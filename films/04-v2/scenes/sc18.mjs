// c18 · The open question (08a–08d). ONE continuous take in one 3D world (camera path anchored to the VO words), no cut, no blend:
//
// shot  | VO (accent)                     | image                                                        | hero light          | camera / flow
// ------+---------------------------------+--------------------------------------------------------------+---------------------+------------------------------
// 18.01 | That "if" … still there         | the deep night plate IS this sky; the camera tilts down to   | the seal's foil     | from the plate (H.b, exact) tilt
//       |                                 | the horizon: the engraved IF seal (2.05/3.03) rises behind   |                     | down + drop; dawn begins (rose)
//       |                                 | district D like a pale foil moon, a guilloche halo round it  |                     |
// 18.02 | … becoming possible             | pull back over the parapet: 1.04's roof at dawn, you from    | the sun's glow      | pull back + down behind you,
//       |                                 | behind (ochre scarf), the city waking (windows, warm rims)   | (stippled bloom)    | creeping in (1.04 framing)
// 18.03 | … the same as shared            | the 3.02 aqueduct carries the amber lights into district A   | A's amber           | push past your shoulder, zoom
//       |                                 | only; on "shared" the camera trucks to the dark districts    |                     | to A; truck right on "shared"
// 18.04 | It could come for a few         | A's few lit towers among the many dark ones                  | A's amber           | crane up and back
// 18.05★| Or it could reach every … Earth | the burin swoops in, draws the aqueduct on from A to the     | sun crests on       | crane to the wide, high view
//       |                                 | horizon (the sun crests on "every"), lines branch to every   | "every"; the towns  | of the land
//       |                                 | town, the towns light in a wave                              |                     |
// 18.06 | That part is still wide open    | the far branch ends ragged over the gap; the burin sketches  | the dotted line     | descend to the gap behind
//       |                                 | the dotted ghost of the next stretch across the valley to    |                     | your roof
//       |                                 | your parapet (on "open") and lands on your coping            |                     |
// 18.07 | … wake up to that day           | the sun rises fully; the morning light floods the towns'     | the sun             | drift down, gaze up to the
//       |                                 | windows (gold wave from the horizon toward you)              |                     | horizon
// 18.08 | You don't have to               | you at the edge of the gap, standing; the burin beside you   | rim light on you    | come close behind-right
// 18.09★| You want to                     | you take up the burin (pause), on "want" you push it: the    | the engraved line   | hold, slight pull back
//       |                                 | dotted line turns solid, the stone unrolls under it          |                     |
// 18.10 | So how … to there?              | wide and high: the half-built bridge reaching toward the     | sun + flowing       | rises and drifts to the last
//       | (562.6–end music)               | sunrise, lights waiting at the far broken end                | lights              | frame (alive, no fade, no text)
// In: plate c17>c18 (sky, deep): at H.b the frame IS HI.plate (drawn directly), then the same stars are re-projected through the moving
// camera. Out: none — the film ends on this image. Sound (in pauses): foil_glint (the seal glints after "still there."), whoosh_airy (the
// burin swoops in), tick (the burin lands on the coping after "open."), clink (you take it up), shimmer_rings (the stretch stands after
// "You want to."), whoosh_up (the camera starts to rise before "So how"). Ambience: atmo/nightsky → atmo/dawn_birds.
import { W, H, clamp, mix } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { ready, camPath, qio, eoX, eiX, cio, span, sio, cs, toScr, dirScr, NEAR, mix3, css, sealImage } from '../lib/v2_c18_kit.mjs';
import { drawSky, prewarmSky, skyGlow } from '../lib/v2_c18_sky.mjs';
import { drawFar, drawValley, drawMist, G, hazeRGB } from '../lib/v2_c18_land.mjs';
import { TOWERS, drawTower, CASTELLUM } from '../lib/v2_c18_city.mjs';
import { netItems, netLights, netClock, BR, S_BREAK, S_YOURS, S_LAND, TOP, ghostStretch, bigBurin, LINE_LIST } from '../lib/v2_c18_net.mjs';
import { arcadeItems } from '../lib/v2_c18_arcade.mjs';
import { drawHere } from '../lib/v2_c18_roof.mjs';
import { you, arm3, burinShape, prewarmYou } from '../lib/v2_c18_you.mjs';

export default async (T, R) => {
  const { in: HI } = handsOf('c18', T);
  const S8 = (p) => T.S('08a', p), E8 = (p) => T.E('08a', p);
  const K = { a: HI.b, that: S8('That'), stillE: E8('still there'), day0: S8('The day'), poss: S8('possible'), possE: E8('possible'),
    but: S8('But possible'), shared: S8('shared'), few0: S8('It could come'), few: S8('few'), fewE: E8('few'), or: S8('Or it could'), every: S8('every'), earth: S8('Earth'), earthE: E8('Earth'),
    part: S8('That part'), open: S8('open'), openE: E8('open'), morning: T.S('08b', 'And one'), dayB: T.S('08b', 'day'), dont: T.S('08b', 'You don'), dontE: T.E('08b', 'have to'),
    want0: T.S('08c', 'You want'), want: T.S('08c', 'want'), wantE: T.E('08c'), so: T.S('08d', 'So how'), there: T.S('08d', 'there'), end: T.duration };
  // ---------------------------------------------------------------- the camera
  const cam0 = { x: .6, y: 3.2, z: 1.2, az: -.02, pitch: .62, f: 1400, oy: 540 };
  const cam = camPath([
    { t: K.a, cam: cam0 },
    { t: K.a + .5, cam: { x: .6, y: 3.6, z: .7, az: -.05, pitch: .48, f: 1400 } },
    { t: K.that + .45, cam: { x: .5, y: 4.4, z: -.4, az: -.13, pitch: .1, f: 1420 } },
    { t: K.stillE, cam: { x: .45, y: 4.3, z: -.6, az: -.15, pitch: .085, f: 1460 } },
    { t: K.poss, cam: { x: .48, y: 1.5, z: 2.85, az: .05, pitch: .03, f: 1650 } },
    { t: K.but, cam: { x: .5, y: 1.52, z: 2.7, az: .052, pitch: .03, f: 1700 } },
    { t: K.but + 1.0, cam: { x: 1.4, y: 2.6, z: -4, az: .0, pitch: .0, f: 2300 } },
    { t: K.shared, cam: { x: 1.8, y: 3.2, z: -9, az: -.02, pitch: -.005, f: 2700 } },
    { t: K.shared + .9, cam: { x: 60, y: 4, z: -14, az: .3, pitch: -.01, f: 2500 } },
    { t: K.few, cam: { x: 30, y: 30, z: 60, az: .12, pitch: -.06, f: 1800 } },
    { t: K.or, cam: { x: -20, y: 80, z: 160, az: .06, pitch: -.12, f: 1500 } },
    { t: K.every, cam: { x: -60, y: 150, z: 280, az: .05, pitch: -.16, f: 1350 } },
    { t: K.earth, cam: { x: -80, y: 190, z: 340, az: .06, pitch: -.18, f: 1300 } },
    { t: K.part, cam: { x: -70, y: 160, z: 300, az: .08, pitch: -.2, f: 1300 } },
    { t: K.open, cam: { x: -10, y: 40, z: 70, az: .2, pitch: -.28, f: 1300 } },
    { t: K.openE + .8, cam: { x: -6, y: 30, z: 52, az: .21, pitch: -.22, f: 1300 } },
    { t: K.dayB, cam: { x: -4, y: 16, z: 30, az: .22, pitch: -.08, f: 1350 } },
    { t: K.dont, cam: { x: -.6, y: 3.4, z: 5.2, az: .16, pitch: -.12, f: 1500 } },
    { t: K.dontE + .5, cam: { x: .55, y: 2.5, z: 3.6, az: .1, pitch: -.13, f: 1550 } },
    { t: K.want0, cam: { x: .7, y: 2.3, z: 3.3, az: .12, pitch: -.13, f: 1500 } },
    { t: K.wantE + .1, cam: { x: .8, y: 2.6, z: 3.6, az: .16, pitch: -.1, f: 1450 } },
    { t: K.so, cam: { x: .6, y: 4, z: 6, az: .18, pitch: -.12, f: 1400 } },
    { t: K.there, cam: { x: -6, y: 22, z: 30, az: .2, pitch: -.2, f: 1350 } },
    { t: K.end, cam: { x: -30, y: 70, z: 110, az: .2, pitch: -.18, f: 1350 } },
  ]);
  // ---------------------------------------------------------------- the clock of the light, the network, the burin
  const NC = netClock({ t0: K.or + .33, every: K.every, spurs: K.every + .25 });
  const sunEl = (t) => (t < K.every ? mix(-.12, -.0195, (t - K.a) / (K.every - K.a)) : -.0195 + .0085 * (t - K.every));
  const L = (t) => .55 * span(t, K.a + .2, K.stillE, sio) + .45 * span(t, K.stillE, K.but, sio) + .6 * span(t, K.or, K.earthE + .4, sio) + .4 * span(t, K.morning, K.dayB, sio);
  const flare = (z) => { const tf = K.morning + .3 + 3 * (1 - clamp(-z / 12000)); return (t) => sio(clamp((t - tf) / .8)); };
  const YOU = { x: 0, z: .3, az: .2 };
  const fwd = [Math.sin(YOU.az), 0, -Math.cos(YOU.az)], rgt = [Math.cos(YOU.az), 0, Math.sin(YOU.az)];
  const REST = { h: [.45, TOP + .05, -.15], tip: [.67, TOP + .04, -.16] };     // the burin lying on the coping, at the start of the dotted line
  const LINE0 = [.6, TOP + .02, -.2];                                          // where the dotted line begins (on the coping)
  const state = (t) => {
    const l = L(t);
    return {
      L: l, wake: span(t, K.day0, K.possE, sio), stars: 1 - span(t, K.a + .6, K.poss, sio), few: span(t, K.few - .35, K.few + .3, sio) * (1 - .4 * span(t, K.or, K.every)),
      sun: clamp((t - K.every) / 4), flare: (Tz) => flare(typeof Tz === 'number' ? Tz : (Tz.z0 + Tz.z1) / 2)(t),
      wave: (Tw) => (Tw.dist === 'A' ? 1 : NC.distLit(Tw.dist, t)),
      branch: eoX(clamp((t - (K.every + .3)) / .9)), branchLit: clamp((t - (K.every + 1.2)) / .8),
      ghostSketch: clamp((t - (K.earthE - .2)) / (K.open - K.earthE + .2)), yours: S_YOURS * eoX(clamp((t - K.want) / .9)), yoursDrop: clamp((t - K.want - .2) / 2.2),
    };
  };
  // the burin: swoops in to A's castellum, draws the trunk to the horizon (the sun crests on "every"), flies back to the far branch's
  // broken end, sketches the dotted ghost across the gap (reaching your parapet on "open"), lands on your coping in the pause
  const tIn = K.or - .12, tA = K.or + .33, tBack = K.every + .02, tSk0 = K.earthE - .2, tSk1 = K.open, tLand = K.openE + .25;
  const burinState = (t, c, S) => {
    if (t < tIn || t > K.dontE + .3) return null;
    const P = (x, y, z) => { const q = cs(c, x, y, z); return q[2] > NEAR ? toScr(c, q) : null; };
    const at = (s) => { const [x, z] = BR.at(s); return P(x, TOP + .2, z); };
    if (t < tA) { const e = P(CASTELLUM[0], TOP + 6, CASTELLUM[1]); if (!e) return null; const u = eoX(clamp((t - tIn) / (tA - tIn))), s = [W + 240, -260]; return { x: mix(s[0], e[0], u), y: mix(s[1], e[1], u) - Math.sin(Math.PI * u) * 120, ang: Math.atan2(e[1] - s[1], e[0] - s[0]), len: 250, glow: u }; }
    if (t < tBack) { const Tr = LINE_LIST[0], f = NC.front('trunk', t), [x, z, dx, dz] = Tr.A.at(f), p = P(x, TOP + 2, z), p2 = P(x + dx * 40, TOP + 2, z + dz * 40); if (!p || !p2) return null; return { x: p[0], y: p[1], ang: Math.atan2(p2[1] - p[1], p2[0] - p[0]), len: 250, draw: true }; }
    if (t < tSk0) { const Tr = LINE_LIST[0], [ex, ez] = Tr.A.at(Tr.A.len), a = P(ex, TOP + 2, ez), b = at(S_BREAK); if (!a || !b) return null; const u = cio(clamp((t - tBack) / (tSk0 - tBack))), mx = (a[0] + b[0]) / 2, my = Math.min(a[1], b[1]) - Math.abs(b[0] - a[0]) * .35 - 140; const x = (1 - u) ** 2 * a[0] + 2 * (1 - u) * u * mx + u * u * b[0], y = (1 - u) ** 2 * a[1] + 2 * (1 - u) * u * my + u * u * b[1], dx = 2 * (1 - u) * (mx - a[0]) + 2 * u * (b[0] - mx), dy = 2 * (1 - u) * (my - a[1]) + 2 * u * (b[1] - my); return { x, y, ang: Math.atan2(dy, dx), len: mix(250, 200, u) }; }
    if (t < tSk1) { const u = sio(clamp((t - tSk0) / (tSk1 - tSk0))), s = mix(S_BREAK, 0, u), p = at(s), p2 = at(Math.max(0, s - 6)); if (!p || !p2) return null; const q = c.f / Math.max(1, cs(c, ...BR.at(s).slice(0, 1), TOP, BR.at(s)[1])[2]); return { x: p[0], y: p[1], ang: Math.atan2(p2[1] - p[1], p2[0] - p[0]), len: mix(200, Math.max(26, .22 * q * 1.6), u * u), draw: true, sketch: true }; }
    return { rest: true, land: clamp((t - tSk1) / (tLand - tSk1)) };
  };
  // your right arm through the take: hanging → reaching for the burin → lifting it → the tip on the line → the push on "want" → resting
  const tReach = K.dontE + .3, tGrip = tReach + .75, tLift = tGrip + .45, tAim = K.want0 + .15, tPushE = K.want + .5, tDown = K.so + .4;
  const armPose = (t) => {
    if (t < tReach) return null;
    const S3 = [YOU.x + rgt[0] * .19, 1.38, YOU.z + rgt[2] * .19];
    const grip = [REST.h[0] + .03, REST.h[1] + .03, REST.h[2]], aim = [LINE0[0] - fwd[0] * .14 + .02, LINE0[1] + .13, LINE0[2] - fwd[2] * .14], push = [aim[0] + fwd[0] * .22, aim[1] - .03, aim[2] + fwd[2] * .22], low = [S3[0] + .08, .98, S3[2] - .16];
    let W3, burDir, held = t > tGrip;
    const k1 = sio(clamp((t - tReach) / (tGrip - tReach))), k2 = sio(clamp((t - tGrip) / (tLift - tGrip))), k3 = sio(clamp((t - tLift) / (tAim - tLift))), k4 = eoX(clamp((t - K.want) / (tPushE - K.want))), k5 = sio(clamp((t - tDown) / 1.4));
    const hang = [S3[0] + .05, .82, S3[2] + .02];
    if (t < tGrip) W3 = hang.map((v, i) => mix(v, grip[i], k1));
    else if (t < tLift) W3 = grip.map((v, i) => mix(v, v + (i === 1 ? .14 : 0), k2));
    else if (t < K.want) W3 = [grip[0], grip[1] + .14, grip[2]].map((v, i) => mix(v, aim[i], k3));
    else if (t < tDown) W3 = aim.map((v, i) => mix(v, push[i], k4));
    else W3 = push.map((v, i) => mix(v, low[i], k5));
    // the burin's direction: lying along the coping → turned to point down the line
    const dRest = [1, -.03, 0], dLine = [fwd[0] * .9, -.42, fwd[2] * .9], dLow = [fwd[0] * .4, -.9, fwd[2] * .4];
    const kd = t < tLift ? 0 : t < tDown ? sio(clamp((t - tLift) / (tAim - tLift))) : 1;
    burDir = (t < tDown ? dRest.map((v, i) => mix(v, dLine[i], kd)) : dLine.map((v, i) => mix(v, dLow[i], k5)));
    const n = Math.hypot(...burDir); burDir = burDir.map((v) => v / n);
    const { E, W: Wr } = arm3(S3, W3, .3, .29, [rgt[0] * .7, -.7, rgt[2] * .7 + .2]);
    return { S3, E, W: Wr, burDir, held };
  };
  // ---------------------------------------------------------------- the frame
  const draw = (ctx, t) => {
    if (t < K.a + 1 / 60) { HI.plate(ctx, t); return; }
    const c = cam(t), S = state(t), sunE = sunEl(t);
    const sealEl = mix(-.09, .075, span(t, K.that - .4, K.stillE + .2, eoX)) + .0022 * (t - K.a);
    const sealGl = clamp((t - K.stillE) / .7);
    const sk = drawSky(ctx, t, c, { L: S.L, stars: S.stars, t0: K.a, cam0, sun: { az: .26, el: sunE }, sunA: 1, sunRing: clamp((t - K.every + .3) / 1.2),
      seal: { az: -.36, el: sealEl, r: .072, pale: .18 + .55 * clamp(S.L - .45), ring: 1, halo: 1, glint: sealGl > 0 && sealGl < 1 ? sealGl : null } });
    // the land and everything out there, far → near
    const items = netItems(t, c, S, NC);
    for (const T0 of TOWERS) { const d = cs(c, (T0.x0 + T0.x1) / 2, T0.y0 + T0.h * .3, (T0.z0 + T0.z1) / 2)[2]; if (d > NEAR) items.push({ d, draw: (g) => drawTower(g, t, c, T0, S) }); }
    drawFar(ctx, t, c, S, items);
    skyGlow(ctx, t, c, S, sk);
    drawValley(ctx, t, c, S);
    // the line to you over the valley: your stretch (engraved, the stone unrolling), the far side's broken end
    const vb = [], hz = hazeRGB(S.L);
    if (S.branch > 0) for (const it of arcadeItems(t, c, BR, { L: S.L, hz, lit: S.branchLit, s0: S_BREAK - 1, s1: S_LAND, broken: S_BREAK, drop: () => clamp(S.branch * 3 - 2) })) vb.push(it);
    if (S.yours > 0) for (const it of arcadeItems(t, c, BR, { L: S.L, hz, lit: 0, s0: 0, s1: S.yours, drop: (b) => clamp(S.yoursDrop * 1.8 - b.i * .3) })) vb.push(it);
    vb.sort((p, q) => q.d - p.d); for (const it of vb) it.draw(ctx);
    drawMist(ctx, t, c, S);
    netLights(ctx, t, c, S, NC);
    ghostStretch(ctx, t, c, S, { sketch: S.ghostSketch, solid: S.yours });
    // here: the near rim, your roof, the burin on the coping, you
    const B = burinState(t, c, S), A3 = armPose(t);
    const onRoof = (g) => { if (B && B.rest && !(A3 && A3.held)) restBurin(g, t, c, B.land); };
    const youDraw = (g) => drawYou(g, t, c, S, A3, sk);
    drawHere(ctx, t, c, S, youDraw, onRoof);
    if (B && !B.rest) bigBurin(ctx, t, B);
  };
  // the burin lying on the coping (it settles with a small rock as it lands)
  function restBurin(g, t, c, land) {
    const rock = land < 1 ? Math.sin(land * Math.PI * 3) * (1 - land) * .02 : 0;
    const h = cs(c, REST.h[0], REST.h[1] + rock, REST.h[2]), p = cs(c, REST.tip[0], REST.tip[1] - rock, REST.tip[2]); if (h[2] < NEAR || p[2] < NEAR) return;
    const a = toScr(c, h), b = toScr(c, p), Lp = Math.hypot(b[0] - a[0], b[1] - a[1]), w = Lp / 124;
    g.save(); burinShape(g, a, b, Math.max(.12, w)); g.restore();
  }
  // you: the sprite at your feet, scaled to the camera; the arm and the burin projected from 3D into figure units
  function drawYou(g, t, c, S, A3, sk) {
    const f3 = cs(c, YOU.x, 0, YOU.z); if (f3[2] < .3) return;
    const ft = toScr(c, f3), q = c.f / f3[2], s = q * 1.78 / 1000;
    if (s * 1000 < 8 || ft[0] < -600 * s - 50 || ft[0] > W + 600 * s + 50) return;
    const ca = Math.cos(c.az), sa = Math.sin(c.az), cp = Math.cos(c.pitch), sp = Math.sin(c.pitch);
    const Rv = [ca, 0, sa], Uv = [-sa * sp, cp, ca * sp], U = 1000 / 1.78;
    const fu = (P, O) => { const v = [P[0] - O[0], P[1] - O[1], P[2] - O[2]]; return [(v[0] * Rv[0] + v[2] * Rv[2]) * U, -(v[0] * Uv[0] + v[1] * Uv[1] + v[2] * Uv[2]) * U]; };
    let arm = null, bur = null;
    if (A3) {
      const sh = [104, -790], o = A3.S3, e = fu(A3.E, o), w = fu(A3.W, o);
      arm = { el: [sh[0] + e[0], sh[1] + e[1]], wr: [sh[0] + w[0], sh[1] + w[1]] };
      if (A3.held) { const hb = A3.W.map((v, i) => v + A3.burDir[i] * .02), tp = A3.W.map((v, i) => v + A3.burDir[i] * .24), a = fu(hb, o), b = fu(tp, o); bur = { h: [sh[0] + a[0], sh[1] + a[1]], tip: [sh[0] + b[0], sh[1] + b[1]], w: 1.15 }; }
    }
    const look = t < K.dontE ? .9 : t < K.want0 ? mix(.9, .35, sio(clamp((t - K.dontE) / .6))) : mix(.35, .85, sio(clamp((t - K.want - .3) / .9)));
    const sun = sk.sun || [W * .8, H * .4];
    const res = you(g, ft[0], ft[1], s, { t, look, wind: .8, lean: A3 ? clamp(Math.min((t - (K.dontE + .3)) / .7, 1) - clamp((t - (K.so + .4)) / 1.4)) * .5 : 0, light: { x: sun[0], y: sun[1], col: '#ffd9a8', a: .55 + .35 * clamp(S.L - .5) }, sky: S.L > 1 ? '#e8b8b0' : '#b0a0c8', arm, burin: bur });
    // the engraving tip glints where the burin meets the line
    if (bur && res.tip && t > K.want0 && t < K.want + 1.4) { const k = Math.sin(Math.PI * clamp((t - K.want0) / (K.want + 1.4 - K.want0))); const gl = g.createRadialGradient(res.tip[0], res.tip[1], 0, res.tip[0], res.tip[1], 26 * s * 4); gl.addColorStop(0, `rgba(255,241,214,${.9 * k})`); gl.addColorStop(.3, `rgba(255,179,92,${.4 * k})`); gl.addColorStop(1, 'rgba(255,179,92,0)'); g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = gl; g.fillRect(res.tip[0] - 110 * s, res.tip[1] - 110 * s, 220 * s, 220 * s); g.restore(); }
  }
  prewarmSky(); prewarmYou(); sealImage(150);
  await ready();
  const snd = (f, t, v) => ({ f, t, v });
  return [
    { t: HI.b, tr: 'cut', d: .1, print: HI.print, draw, sound: [snd('foil_glint', K.stillE + .02, .5)] },
    { t: K.or - .2, tr: 'cut', d: .1, print: HI.print, draw, sound: [snd('whoosh_airy', K.or - .14, .45)] },
    { t: K.openE, tr: 'cut', d: .1, print: HI.print, draw, sound: [snd('tick', tLand, .55), snd('clink', K.dontE + .3 + .78, .4)] },
    { t: K.wantE, tr: 'cut', d: .1, print: HI.print, draw, sound: [snd('shimmer_rings', K.wantE + .04, .5), snd('whoosh_up', K.so - .25, .3)] },
  ];
};
