// c09 · The invitation (04a → "where to go"): ONE continuous take, one camera through one world.
//
// | shot | VO words                                   | image                                                                                   | hero light            | camera                                              | flows on by                         | sound            |
// |------|--------------------------------------------|-----------------------------------------------------------------------------------------|-----------------------|-----------------------------------------------------|-------------------------------------|------------------|
// | in   | (plate c08>c09 glass, 227.58–227.84)       | the dark glass pane = the right lower light of a ground-floor window in a courtyard     | —                     | at H.b exactly the plate, at rest                   | pull out of the pane                | —                |
// | 9.01 | That question sounds **frightening**.      | out of the pane: a night courtyard, walls on three sides, rows of dark windows, a strip | moon on the high wall | pull back 105× and tilt up (expo in-out, 1.7 s)     | continuous take                      | whoosh_airy      |
// |      |                                            | of sky; on "frightening" a storm lantern flares on the sill of ONE top-floor window     | the lantern (amber)   | a breath of drift while it lights                   |                                     | lamp (pause)     |
// | 9.02 | It's actually an **invitation**.           | push up and in to that window: lantern + an engraved invitation card on the sill        | lantern               | crane + push 60×, levelling the tilt, expo landing  | continuous take                      |                  |
// |      |                                            | (deckle edge, guilloche border, "Invitation", scribbled calligraphy, foil seal);        |                       |                                                     |                                     |                  |
// |      |                                            | on "invitation" it opens like a book                                                     |                       | slow push into the open spread                      | the inner spread IS the chart        | card (pause)     |
// | 9.03 | Researchers looked at … how happy they are.| the spread: an engraved chart, x HOURS OF FREE TIME PER DAY 0·2·5·7, y WELL-BEING,       | lantern on the paper  | living hold (1–2 % drift)                           | —                                   |                  |
// |      |                                            | source line; a burin is carried in to the origin                                         |                       |                                                     |                                     | pencil (pause)   |
// | 9.04 | More **helps**, up to a point.             | the burin cuts the curve: steep rise to ~2 h, then level; dotted guide at 2 h            | burin glint           | drift follows the tip                               | —                                   |                  |
// | 9.05 | After that, it can start to **hurt**.      | past 5 h the curve dips (dotted guide at 5 h)                                            | burin glint           | drift                                               | —                                   |                  |
// | 9.06 | But mostly … alone, on nothing that **matters**. | "But": an amber foil curve WITH PEOPLE · SOMETHING THAT MATTERS stays level past 5 h; | amber foil            | drift                                               | the amber burin rests at 7 h         |                  |
// |      |                                            | under the dip an engraved vignette: someone alone on a sofa in a screen's cyan glow,     |                       |                                                     |                                     |                  |
// |      |                                            | ALONE · NOTHING THAT MATTERS                                                             |                       |                                                     |                                     | whoosh_up        |
// | 9.07★| Which tells you exactly where to **go**.   | the amber line runs off the card's edge into the night, climbs the wall, arcs over the  | the amber line        | pull back + crane over the roofs (lens shift, no    | the line becomes the hill's flank;  | bloom (after go) |
// |      |                                            | roofs across the bay and runs up the flank of the dark Maslow hill, outlines it; the     |                       | tilt) and land exactly on VIEWS.H2 by H.a − 1/30    | plate c09>c10 (hill H2)              |                  |
// |      |                                            | terraces fill from the foot up, labels print in → drawHill(VIEWS.H2)                     |                       |                                                     |                                     |                  |
// Ambience: courtyard + card: atmo/city_night_hill (quiet night city); the hill: atmo/harbour.
import { W, H, clamp, mix, lin, sm, eout } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { drawHill, VIEWS } from '../lib/maslow4.mjs';
import { ready, P3, cs, plane, pitchFor, qio, eoX, eiX, span, TAU, proj3, burin } from '../lib/v2_c09_kit.mjs';
import { court, lantern, lanternLight, paneP, CAM_PANE, CAM_END, PANE, XL, SILL_L, RAIL, ROOF, camFar, hillPt, LANTERN } from '../lib/v2_c09_court.mjs';
import { CARD, SPREAD, sw, coverTex, insideTex, cardClosedOrOpening, spread, PLOT, hu, fv, fAmber, PB } from '../lib/v2_c09_card.mjs';
import { farField, amberStroke, amberTaper, sliceLen, HOUT, outlineHead } from '../lib/v2_c09_hill.mjs';
import { toScreen } from '../lib/maslow4.mjs';

const len3 = (v) => Math.hypot(v[0], v[1], v[2]), nrm = (v) => { const l = len3(v) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
// a move about a point Q: the distance to Q eases in log space; the direction swings with the linear distance (so a push first
// travels, then approaches straight; a pull first backs off straight, then swings); the camera tilts (or shifts its lens) so that
// Q glides on screen from where A sees it to where B sees it.
function camMove(u, A, B, Q, mode = 'pitch') {
  const va = [A.x - Q[0], A.y - Q[1], A.z - Q[2]], vb = [B.x - Q[0], B.y - Q[1], B.z - Q[2]], da = len3(va), db = len3(vb);
  const D = Math.exp(mix(Math.log(da), Math.log(db), u)), w = clamp((D - da) / (db - da));
  const na = nrm(va), nb = nrm(vb), dir = nrm([mix(na[0], nb[0], w), mix(na[1], nb[1], w), mix(na[2], nb[2], w)]);
  const c = { x: Q[0] + dir[0] * D, y: Q[1] + dir[1] * D, z: Q[2] + dir[2] * D, f: mix(A.f, B.f, w), pitch: 0, oy: 540 };
  const syA = P3(A, ...Q)[1], syB = P3(B, ...Q)[1], sy = mix(syA, syB, w);
  if (mode === 'pitch') { c.oy = mix(A.oy ?? 540, B.oy ?? 540, w); c.pitch = pitchFor(c, ...Q, sy); }
  else { const d = c.z - Q[2]; c.oy = sy + c.f * (Q[1] - c.y) / d; }
  return c;
}

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c09', T);
  const S = (p) => T.S('04a', p), E = (p) => T.E('04a', p);
  const K = {
    a: HI.b, fr: S('frightening'), frE: E('frightening'), inv: S('invitation'), invE: E('invitation'),
    res: S('Researchers'), free: S('free time'), happy: S('happy'), areE: E('how happy they are'),
    more: S('More helps'), point: S('up to a point'), pointE: E('up to a point'), after: S('After that'), hurt: S('start to hurt'), hurtE: E('start to hurt'),
    but: S('But mostly'), alone: S('spent alone'), nothing: S('on nothing that matters'), mattersE: E('on nothing that matters'),
    which: S('Which tells'), go: S('where to go'), goE: E('where to go'), out: HO.a,
  };
  // ---- camera keys
  const Qp = [PANE.cx, PANE.cy, PANE.z];
  const COURT = { x: -3.2, y: 1.7, z: 33, f: 1000, pitch: .36, oy: 540 };
  const Qc = [CARD.xs + CARD.pw / 2, CARD.y0 + CARD.ph / 2, CARD.z];           // the closed card's centre
  const LAND = { x: CARD.xs - .16, y: CARD.y0 + .11, z: CARD.z + 1000 / 2350, f: 1000, pitch: 0, oy: 540 };   // lantern + card in frame
  const SC = 62;                                                               // chart framing: px per cm
  const CHART = { x: CARD.xs, y: SPREAD.y1 - 560 / (SC * 100), z: CARD.z + 1000 / (SC * 100), f: 1000, pitch: 0, oy: 540 };
  const T1 = K.a, T2 = K.fr + .45, Tl = K.frE - .06, T3 = K.frE + .14, T4 = K.inv + .2;    // pull-back, lamp, push start, landing
  const To0 = K.inv + .3, To1 = K.invE - .04;                                        // the card opens
  const Tc0 = K.invE - .4, Tc1 = K.res + .4;                                         // push into the spread
  const Tg0 = K.mattersE + .1, Tg1 = K.out - .08;                                      // 9.07: the pull-back + crane, landing on H2
  const camAt = (t) => {
    if (t < T3) {
      const u = (t - T1) / (T2 - T1);
      // smoothstep in log distance: the pane's edges leave the frame from the first frames on (no dead start), a soft landing
      const e = u < 1 ? u * u * (3 - 2 * u) : 1, c = camMove(e, CAM_PANE, COURT, Qp, 'pitch');
      if (u > 1) { const k = t - T2; c.z += .5 * k * k / (1 + k); c.pitch += .004 * k * k / (1 + k); }   // a breath of drift while the lamp lights (starts at rest)
      return c;
    }
    if (t < Tc0) {
      const A = camAt(T3 - 1e-4), u = clamp((t - T3) / (T4 - T3)), e = u < .5 ? 8 * u ** 4 : 1 - (1 - eoX((u - .5) * 2)) * .5;
      const c = camMove(e, A, LAND, Qc, 'pitch');
      if (t > T4) { const k = t - T4; c.z -= .012 * k; }
      return c;
    }
    if (t < Tg0) {
      const A = camAt(Tc0 - 1e-4), u = clamp((t - Tc0) / (Tc1 - Tc0)), c = camMove(qio(u), A, CHART, [CARD.xs, CARD.y0 + .09, CARD.z], 'shift');
      if (t > Tc1) { const k = (t - Tc1); c.z -= .0006 * k; c.x += .0004 * Math.sin(k * .5); }    // a living hold (≈1–2 % over the chart)
      return c;
    }
    // 9.07: keyed path (time, X, Y, log distance to the card plane), cubic Hermite, at rest at both ends
    const A = camAt(Tg0 - 1e-4), dz = (c) => Math.log(c.z - CARD.z);
    const KS = [[Tg0, A.x, A.y, dz(A)], [Tg0 + .68, XL + .32, CARD.y0 + .95, Math.log(2.1)], [Tg0 + 1.0, XL + 1.5, 25.6, Math.log(7)],
      [Tg0 + 1.3, -6.5, 35, Math.log(13.5)], [Tg1, CAM_END.x, CAM_END.y, Math.log(CAM_END.z - CARD.z)]];
    let i = 0; while (i < KS.length - 2 && t > KS[i + 1][0]) i++;
    const k0 = KS[i], k1 = KS[i + 1], h = k1[0] - k0[0], q = clamp((t - k0[0]) / h);
    const tan = (j, c) => (j === 0 || j === KS.length - 1 ? 0 : (KS[j + 1][c] - KS[j - 1][c]) / (KS[j + 1][0] - KS[j - 1][0]));
    const Hm = (c) => { const h00 = 2 * q ** 3 - 3 * q * q + 1, h10 = q ** 3 - 2 * q * q + q, h01 = -2 * q ** 3 + 3 * q * q, h11 = q ** 3 - q * q; return h00 * k0[c] + h10 * h * tan(i, c) + h01 * k1[c] + h11 * h * tan(i + 1, c); };
    return { x: Hm(1), y: Hm(2), z: CARD.z + Math.exp(Hm(3)), f: 1000, pitch: 0, oy: mix(A.oy, 540, sm(clamp((t - Tg0) / (Tg1 - Tg0)))) };
  };

  // ---- the state of everything else
  const lamp = (t) => eout(clamp((t - Tl) / .35));
  const open = (t) => { const u = clamp((t - To0) / (To1 - To0)); return u < .5 ? 4 * u ** 3 : 1 - Math.pow(-2 * u + 2, 3) / 2; };
  const CHst = (t) => ({
    axes: span(t, K.res + .1, K.res + .75), ticks: [0, 1, 2, 3].map((i) => span(t, K.res + .55 + i * .07, K.res + .95 + i * .07, eout)),
    xlab: span(t, K.free - .05, K.free + .45, (x) => x), ylab: span(t, K.happy - .05, K.happy + .3, (x) => x), src: span(t, K.res + .9, K.res + 1.5, (x) => x),
    burinIn: span(t, K.areE - .15, K.more - .1, eoX),
    ink: t < K.more ? 0 : t < K.pointE + .1 ? 2 * eout(clamp((t - K.more) / (K.point - .1 - K.more))) + 3 * clamp((t - (K.point - .1)) / (K.pointE - K.point + .1)) ** 1.15 : 5 + 2 * qio(clamp((t - (K.after + .2)) / (K.hurtE - .15 - K.after - .2))),
    inkOut: span(t, K.hurtE + .05, K.hurtE + .45, (x) => x),                       // the steel burin is lifted and carried out
    guide2: span(t, K.point, K.point + .35), guide5: span(t, K.after, K.after + .35),
    amberIn: span(t, K.but - .35, K.but + .05, eoX),                                 // the amber burin is carried in to the origin
    amber: t < K.but + .05 ? 0 : 7 * qio(clamp((t - K.but - .05) / 1.05)), amberTip: t >= K.but + .05 && t < Tg0 ? 1 : 0,
    amberLab: span(t, K.but + 1.0, K.but + 1.5, (x) => x),
    vig: span(t, K.alone - .05, K.alone + .3, (x) => x), vigLight: span(t, K.alone + .25, K.alone + .65),
    aloneLab: span(t, K.alone + .15, K.alone + .4, (x) => x), aloneLab2: span(t, K.nothing - .05, K.nothing + .4, (x) => x),   // ALONE · NOTHING THAT MATTERS, printed with the VO
  });
  // 9.07 line: the near part (card → up the wall → over the parapet), the bridge across the bay, the outline
  const zc = CARD.z + .002, NEARPTS = (() => {
    const c = [sw(hu(7), fv(fAmber(7))), sw(26.5, 3.95), sw(28.6, 3.4), [SPREAD.x1 + .07, SPREAD.y1 + .04], [SPREAD.x1 + .38, SPREAD.y1 + .36], [XL + .78, 22.6], [XL + .9, 23.6], [XL + .88, 24.9], [XL + .7, RAIL + .9]];
    const out = []; for (let i = 0; i < c.length - 1; i++) { const p0 = c[Math.max(0, i - 1)], p1 = c[i], p2 = c[i + 1], p3 = c[Math.min(c.length - 1, i + 2)]; for (let k = 0; k < 10; k++) { const q = k / 10, q2 = q * q, q3 = q2 * q; out.push([.5 * (2 * p1[0] + (-p0[0] + p2[0]) * q + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * q2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * q3), .5 * (2 * p1[1] + (-p0[1] + p2[1]) * q + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * q2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * q3), zc + (i >= 5 ? .35 * (i - 5 + q) / 3 : 0)]); } }
    out.push([c[c.length - 1][0], c[c.length - 1][1], zc + .35]); return out;
  })();
  const B0 = NEARPTS[NEARPTS.length - 1];
  // the near part is cut by 3D arc length (camera-independent): the card part on [0, .25], off the edge and up the wall on [.25, 1]
  const NCUM = [0]; for (let i = 1; i < NEARPTS.length; i++) NCUM.push(NCUM[i - 1] + Math.hypot(NEARPTS[i][0] - NEARPTS[i - 1][0], NEARPTS[i][1] - NEARPTS[i - 1][1], NEARPTS[i][2] - NEARPTS[i - 1][2]));
  const ICARD = 20, sOf = (h) => { const a = NCUM[ICARD], e = NCUM[NCUM.length - 1]; return h <= .25 ? clamp(h / .25) * a : a + clamp((h - .25) / .75) * (e - a); };
  const at3 = (s0) => { let i = 1; while (i < NCUM.length - 1 && NCUM[i] < s0) i++; const q = clamp((s0 - NCUM[i - 1]) / ((NCUM[i] - NCUM[i - 1]) || 1)); return [0, 1, 2].map((j) => mix(NEARPTS[i - 1][j], NEARPTS[i][j], q)); };
  const sub3 = (h0, h1) => { const s0 = sOf(h0), s1 = sOf(h1); if (s1 <= s0) return []; const out = [at3(s0)]; for (let i = 0; i < NEARPTS.length; i++) if (NCUM[i] > s0 && NCUM[i] < s1) out.push(NEARPTS[i]); out.push(at3(s1)); return out; };
  // the chart burin's angle at rest on the amber curve's end (screen, the card plane faces the camera: same in any of these cameras)
  const angRest = (cam) => { const p = P3(cam, ...sw(hu(6.97), fv(fAmber(6.97))), CARD.z), q = P3(cam, ...sw(hu(7), fv(fAmber(7))), CARD.z); return Math.atan2(q[1] - p[1], q[0] - p[0]); };
  // the bridge across the bay: a swash in screen space from the line's end above the parapet (rising) into the hill's left foot
  // (arriving in the direction of the flank), so the line flows into the outline without a corner
  const bridge = (cam) => {
    const p0 = P3(cam, ...B0), pm = P3(cam, B0[0] - .05, B0[1] - .4, B0[2]), cf = camFar(cam), p3 = toScreen(cf, HOUT[0][0], HOUT[0][1]), p4 = toScreen(cf, HOUT[6][0], HOUT[6][1]);
    const up = nrm([p0[0] - pm[0], p0[1] - pm[1], 0]), fl = nrm([p4[0] - p3[0], p4[1] - p3[1], 0]), L = Math.hypot(p3[0] - p0[0], p3[1] - p0[1]);
    const c1 = [p0[0] + up[0] * L * .55, p0[1] + up[1] * L * .55], c2 = [p3[0] - fl[0] * L * .5, p3[1] - fl[1] * L * .5], out = [];
    for (let j = 0; j <= 48; j++) { const u = j / 48, a = (1 - u) ** 3, b = 3 * (1 - u) ** 2 * u, c = 3 * (1 - u) * u * u, d = u ** 3; out.push([a * p0[0] + b * c1[0] + c * c2[0] + d * p3[0], a * p0[1] + b * c1[1] + c * c2[1] + d * p3[1]]); }
    return out;
  };
  const Th0 = Tg0 + .12, Te = Th0 + .3;                                               // the head: over the card to its edge, then up the wall
  // up the wall the camera chases the head: the head leaves the card's edge and is held near the top of the frame (it pulls the
  // camera up) until it tops the parapet; found per frame by bisection on the head's screen height (the path rises monotonically)
  const sE = NCUM[ICARD], sEnd = NCUM[NCUM.length - 1], yOn = (cam, s) => P3(cam, ...at3(s))[1];
  const sWall = (t) => {
    const cam = camAt(t), v = clamp((t - Te) / .46), w = -1.6 * v ** 3 + 2.2 * v * v + .4 * v, y0 = yOn(cam, sE);
    const y = mix(y0, mix(175, 150, clamp((t - Te - .46) / .25)), w);
    if (y0 <= y) return sE;
    if (yOn(cam, sEnd) >= y) return sEnd;
    let lo = sE, hi = sEnd; for (let k = 0; k < 24; k++) { const m = (lo + hi) / 2; if (yOn(cam, m) > y) lo = m; else hi = m; }
    return (lo + hi) / 2;
  };
  const Th1 = (() => { for (let t = Te; t < Tg1; t += 1 / 600) if (sWall(t) >= sEnd - 1e-6) return t; return Tg1; })();
  const Th2 = Th1 + .42, Th3 = Th2 + .55;                                             // across the bay; the outline round the hill
  const Tt0 = Th2 + .15, Tt1 = Tt0 + .5;                                              // the tail follows into the hill's foot
  const Tb1 = Tg1 - .1, Tl0 = Th3 + .2;                                               // the terraces rise; the labels print
  // across the bay: the bridge (screen space, from above the parapet into the hill's left foot); the head eases along it (slow while
  // the bridge's base still rides the near world down the frame, then faster on its calm far part)
  let BK0 = +(globalThis.__BK0 ?? .5);
  const G = (u) => { u = clamp(u); return u * u * (BK0 + (1 - BK0) * u); };
  const lineState = (t) => {
    // head h and tail a: 0..1 the near part (3D), 1..2 the flight across the bay (screen); then the hill's build line (st.build 0 → .35)
    const h = t < Th0 ? 0 : t < Te ? .25 * ((t - Th0) / (Te - Th0)) ** 2 : t < Th1 ? .25 + .75 * (sWall(t) - sE) / (sEnd - sE) : t < Th2 ? 1 + G((t - Th1) / (Th2 - Th1)) : 2;
    const a = t < Tt0 ? 0 : t < Tt1 ? 2 * qio((t - Tt0) / (Tt1 - Tt0)) : 2;
    return { h, a };
  };
  // st.build: the outline (0 → .35) starts at the bridge's speed and settles on the right foot; then the terraces (.35 → 1)
  const buildOf = (t) => {
    if (t <= Th2) return 0;
    if (t < Th3) { const u = (t - Th2) / (Th3 - Th2); return .35 * (.6 * u + 1.8 * u * u - 1.4 * u * u * u); }
    return .35 + .65 * sm(clamp((t - Th3) / (Tb1 - Th3)));
  };
  const labelsOf = (t) => clamp((t - Tl0) / (Tb1 - Tl0));
  globalThis.__c09dbg?.({ camAt, lineState, sOf, at3, NCUM, K, Th0, Th1, Th2, Tg0, Tg1, bridge, buildOf });

  const draw = (ctx, t) => {
    const cam = camAt(t), lp = lamp(t);
    ctx.save(); ctx.fillStyle = '#0b0f2a'; ctx.fillRect(0, 0, W, H);
    // 1 · the far field (sky, bay, the hill), only where it can show
    const topY = P3(cam, cam.x, RAIL + 3, 0)[1], skyVis = cam.y > ROOF - 1 || topY > -4;
    const inG = t >= Tg0;
    if (t >= Tg1 - 1e-6) { drawHill(ctx, t, VIEWS.H2.cam, VIEWS.H2.st); ctx.restore(); return; }
    if (skyVis) farField(ctx, t, cam, { build: buildOf(t), labels: labelsOf(t) });
    // 2 · the courtyard
    court(ctx, t, cam, { lamp: lp, lampWarm: lp, paneDetail: true, tvs: 1 });
    // 3 · the lantern and the card on L's sill
    const sL = P3(cam, LANTERN.x, LANTERN.y, LANTERN.z);
    lantern(ctx, t, cam, lp);
    const o = open(t);
    if (o < 1) cardClosedOrOpening(ctx, t, cam, o, lp); else spread(ctx, t, cam, CHst(t));
    lanternLight(ctx, t, cam, lp, o >= 1 ? .55 : 1);
    // 4 · 9.07: the amber line off the card, up the wall, across the bay into the hill's foot (round the hill: drawHill's build line)
    if (inG) {
      const { h, a } = lineState(t), b = buildOf(t);
      const pxcm = P3(cam, SPREAD.x0 + .01, SPREAD.y0, CARD.z)[0] - P3(cam, SPREAD.x0, SPREAD.y0, CARD.z)[0], lw = clamp(pxcm * .1, 4.2, 7);
      if (a < 1 && h > 0) for (const p of proj3(cam, sub3(a, Math.min(1, h)))) amberStroke(ctx, p, lw);
      const brScr = t >= Th1 && h > 1 && a < 2 ? bridge(cam) : null;
      if (brScr) {   // the bridge tapers to the hill outline's width and cools, so the line hands over without a step
        const u0 = Math.max(0, a - 1), u1 = Math.min(1, h - 1), WF = 2.5;
        amberTaper(ctx, sliceLen(brScr, u0, u1), mix(lw, WF, u0), mix(lw, WF, u1), 1 - u0, 1 - u1);
      }
      // the burin rides the head: the same tool that rested at the amber curve's end (same size, angle and glint at Tg0), growing
      // its night glint as it leaves the paper; constant on screen once the world has shrunk under it; then it rides drawHill's line
      let tip = null, an = 0, sz = Math.max(15, .5 * pxcm);
      if (h < 1) {
        const s0 = sOf(h), p = proj3(cam, [at3(s0), at3(Math.min(NCUM[NCUM.length - 1], s0 + .006))]);
        if (p.length && p[0].length > 1) { tip = p[0][0]; an = Math.atan2(p[0][1][1] - p[0][0][1], p[0][1][0] - p[0][0][0]); }
        const m = clamp(h / .1); if (tip) an = mix(angRest(cam), an, m * m * (3 - 2 * m));
      } else if (h < 2) { const p = sliceLen(bridge(cam), 0, h - 1); if (p.length > 1) { const n = p.length; tip = p[n - 1]; an = Math.atan2(p[n - 1][1] - p[n - 2][1], p[n - 1][0] - p[n - 2][0]); } sz = mix(15, 13, h - 1); }
      else if (b < .35) { const cf = camFar(cam), [q1, q0] = outlineHead(b), s1 = toScreen(cf, ...q1), s0 = toScreen(cf, ...q0); tip = s1; an = Math.atan2(s1[1] - s0[1], s1[0] - s0[0]); sz = 13; }
      else {   // the outline is closed: the burin is lifted off the hill's right foot and carried out of the frame (down-right, over the water)
        const k = clamp((t - Th3) / .42), cf = camFar(cam), n = HOUT.length, e0 = toScreen(cf, ...HOUT[n - 1]), e1 = toScreen(cf, ...HOUT[n - 2]), a0 = Math.atan2(e0[1] - e1[1], e0[0] - e1[0]), ax = Math.atan2(.25, 1);
        if (k < 1) { const d = 460 * k * k * k, m = k * k * (3 - 2 * k); tip = [e0[0] + Math.cos(ax) * d, e0[1] + Math.sin(ax) * d]; an = mix(a0, ax, m); sz = 13; }
      }
      if (tip) {
        const m = clamp((h - .2) / .15);
        burin(ctx, tip[0], tip[1], an, t, { size: sz, foil: '#ffb35c', seed: 5, glow: mix(PB.glow, 1, m), glowR: mix(PB.glowR, 2.6, m), dust: mix(PB.dust, 1, m), paper: 1 - m });
      }
    }
    ctx.restore();
  };

  await ready(); coverTex(); insideTex('L'); insideTex('R'); await ready();
  const snd = (f, t, v) => ({ f, t, v });
  return [
    { t: HI.b, tr: 'cut', d: .1, print: HI.print, draw, sound: [snd('whoosh_airy', K.a + .05, .3)] },
    { t: K.fr, tr: 'cut', d: .04, draw, print: { riso: .3 }, sound: [snd('lamp', K.frE + .02, .5)] },
    { t: K.inv, tr: 'cut', d: .04, draw, print: { riso: .3 }, sound: [snd('card', K.invE + .02, .45)] },
    { t: K.res, tr: 'cut', d: .04, draw, print: { riso: .3 }, sound: [snd('pencil', K.more - .12, .35)] },
    { t: K.but, tr: 'cut', d: .04, draw, print: { riso: .3 }, sound: [snd('foil_glint', K.but - .1, .3)] },
    { t: K.mattersE, tr: 'cut', d: .04, draw, print: HO.print, sound: [snd('whoosh_up', K.mattersE + .15, .4), snd('bloom', K.goE + .06, .45)] },
  ];
};
