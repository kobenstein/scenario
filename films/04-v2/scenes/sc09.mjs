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
import { ready, P3, cs, plane, pitchFor, qio, eoX, eiX, span, TAU } from '../lib/v2_c09_kit.mjs';
import { court, lantern, lanternLight, paneP, CAM_PANE, CAM_END, PANE, XL, SILL_L, RAIL, ROOF, camFar, hillPt, LANTERN } from '../lib/v2_c09_court.mjs';
import { CARD, SPREAD, sw, coverTex, insideTex, cardClosedOrOpening, spread, PLOT, hu, fv, fAmber } from '../lib/v2_c09_card.mjs';
import { farField, amberStroke, sliceLen, OUTLINE } from '../lib/v2_c09_hill.mjs';
import { burinTip } from '../lib/ghost.mjs';
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
      const e = u < 1 ? qio(u) : 1, c = camMove(e, CAM_PANE, COURT, Qp, 'pitch');
      if (u > 1) { const k = Math.min(t - T2, 1); c.z += .5 * k * (2 - k); c.pitch += .004 * k; }   // a breath of drift while the lamp lights
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
    const KS = [[Tg0, A.x, A.y, dz(A)], [Tg0 + .55, XL + .32, CARD.y0 + .95, Math.log(2.1)], [Tg0 + .95, XL + 1.5, 25.6, Math.log(7)],
      [Tg0 + 1.35, -6.5, 35, Math.log(13.5)], [Tg1, CAM_END.x, CAM_END.y, Math.log(CAM_END.z - CARD.z)]];
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
    inkTip: t < K.more ? 0 : 1 - span(t, K.hurtE + .05, K.hurtE + .35),
    guide2: span(t, K.point, K.point + .35), guide5: span(t, K.after, K.after + .35),
    amber: t < K.but ? 0 : 7 * qio(clamp((t - K.but) / 1.05)), amberTip: t < K.but ? 0 : 1,
    amberLab: span(t, K.but + 1.0, K.but + 1.5, (x) => x),
    vig: span(t, K.alone - .05, K.alone + .3, (x) => x), vigLight: span(t, K.alone + .25, K.alone + .65),
    aloneLab: span(t, K.nothing - .1, K.nothing + .45, (x) => x),
  });
  // 9.07 line: the near part (card → up the wall → over the parapet), the bridge across the bay, the outline
  const zc = CARD.z + .002, NEARPTS = (() => {
    const c = [sw(hu(7), fv(fAmber(7))), sw(26.5, 3.95), sw(28.6, 3.4), [SPREAD.x1 + .07, SPREAD.y1 + .04], [SPREAD.x1 + .22, SPREAD.y1 + .45], [XL + .78, 22.6], [XL + .9, 23.6], [XL + .88, 24.9], [XL + .7, RAIL + .9]];
    const out = []; for (let i = 0; i < c.length - 1; i++) { const p0 = c[Math.max(0, i - 1)], p1 = c[i], p2 = c[i + 1], p3 = c[Math.min(c.length - 1, i + 2)]; for (let k = 0; k < 10; k++) { const q = k / 10, q2 = q * q, q3 = q2 * q; out.push([.5 * (2 * p1[0] + (-p0[0] + p2[0]) * q + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * q2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * q3), .5 * (2 * p1[1] + (-p0[1] + p2[1]) * q + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * q2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * q3), zc + (i > 5 ? .35 * (i - 5 + q) / 3 : 0)]); } }
    out.push([c[c.length - 1][0], c[c.length - 1][1], zc + .35]); return out;
  })();
  const B0 = NEARPTS[NEARPTS.length - 1];
  // the bridge across the bay: a swash in screen space from the line's end above the parapet (rising) into the hill's left foot
  // (arriving in the direction of the flank), so the line flows into the outline without a corner
  const bridge = (cam) => {
    const p0 = P3(cam, ...B0), pm = P3(cam, B0[0] - .05, B0[1] - .4, B0[2]), cf = camFar(cam), p3 = toScreen(cf, OUTLINE[0][0], OUTLINE[0][1]), p4 = toScreen(cf, OUTLINE[1][0], OUTLINE[1][1]);
    const up = nrm([p0[0] - pm[0], p0[1] - pm[1], 0]), fl = nrm([p4[0] - p3[0], p4[1] - p3[1], 0]), L = Math.hypot(p3[0] - p0[0], p3[1] - p0[1]);
    const c1 = [p0[0] + up[0] * L * .55, p0[1] + up[1] * L * .55], c2 = [p3[0] - fl[0] * L * .5, p3[1] - fl[1] * L * .5], out = [];
    for (let j = 0; j <= 48; j++) { const u = j / 48, a = (1 - u) ** 3, b = 3 * (1 - u) ** 2 * u, c = 3 * (1 - u) * u * u, d = u ** 3; out.push([a * p0[0] + b * c1[0] + c * c2[0] + d * p3[0], a * p0[1] + b * c1[1] + c * c2[1] + d * p3[1]]); }
    return out;
  };
  const Th0 = Tg0 + .12, Th1 = Th0 + .85, Th2 = Th1 + .3, Th3 = Th2 + .6;              // head: wall, bridge, outline
  const Tt0 = Th2 + .15, Tt1 = Tt0 + .5;                                              // tail retracts over the bridge
  const fill = (t) => [0, 1, 2, 3, 4].map((lv) => sm(clamp((t - (Th2 + .28 + lv * .1)) / .3)));
  const lab = (t) => [0, 1, 2, 3, 4].map((lv) => clamp((t - (Th2 + .28 + lv * .1 + .25)) / .25));
  const lineState = (t) => {
    // head h and tail a in "segment units": 0..1 near part, 1..2 bridge, 2..3 outline
    const h = t < Th0 ? 0 : t < Th1 ? qio((t - Th0) / (Th1 - Th0)) : t < Th2 ? 1 + (t - Th1) / (Th2 - Th1) : 2 + Math.min(1, eout((t - Th2) / (Th3 - Th2)));
    const a = t < Tt0 ? 0 : t < Tt1 ? 2 * qio((t - Tt0) / (Tt1 - Tt0)) : 2;
    return { h, a };
  };

  const draw = (ctx, t) => {
    const cam = camAt(t), lp = lamp(t);
    ctx.save(); ctx.fillStyle = '#0b0f2a'; ctx.fillRect(0, 0, W, H);
    // 1 · the far field (sky, bay, the hill), only where it can show
    const topY = P3(cam, cam.x, RAIL + 3, 0)[1], skyVis = cam.y > ROOF - 1 || topY > -4;
    const inG = t >= Tg0;
    let B = null;
    if (inG) {
      const ls = lineState(t), f = fill(t), lb = lab(t);
      B = { dark: 1, fill: f, label: lb, outline: ls.h > 2 ? [Math.max(0, ls.a - 2), ls.h - 2] : null, lineW: 4.5 };
    }
    if (t >= Tg1 - 1e-6) { drawHill(ctx, t, VIEWS.H2.cam, VIEWS.H2.st); ctx.restore(); return; }
    if (skyVis) farField(ctx, t, cam, B || { dark: 1, fill: [0, 0, 0, 0, 0], label: [0, 0, 0, 0, 0], outline: null });
    // 2 · the courtyard
    court(ctx, t, cam, { lamp: lp, lampWarm: lp, paneDetail: true, tvs: 1 });
    // 3 · the lantern and the card on L's sill
    const sL = P3(cam, LANTERN.x, LANTERN.y, LANTERN.z);
    lantern(ctx, t, cam, lp);
    const o = open(t);
    if (o < 1) cardClosedOrOpening(ctx, t, cam, o, lp); else spread(ctx, t, cam, CHst(t));
    lanternLight(ctx, t, cam, lp, o >= 1 ? .55 : 1);
    // 4 · 9.07: the amber line off the card, up the wall, across the bay (its outline part is drawn inside farField)
    if (inG) {
      const { h, a } = lineState(t);
      const nearScr = NEARPTS.map((p) => P3(cam, ...p)), brScr = bridge(cam);
      const pxcm = P3(cam, SPREAD.x0 + .01, SPREAD.y0, CARD.z)[0] - P3(cam, SPREAD.x0, SPREAD.y0, CARD.z)[0], lw = clamp(pxcm * .1, 4.2, 7);
      const parts = [];
      if (a < 1) parts.push(sliceLen(nearScr, a, Math.min(1, h)));
      if (h > 1 && a < 2) parts.push(sliceLen(brScr, Math.max(0, a - 1), Math.min(1, h - 1)));
      for (const p of parts) amberStroke(ctx, p, lw);
      // the burin at the head
      let tip = null;
      if (h < 1) { const p = sliceLen(nearScr, 0, h); if (p.length > 1) tip = p; } else if (h < 2) { const p = sliceLen(brScr, 0, h - 1); if (p.length > 1) tip = p; } else if (h < 3) { const cf = camFar(cam), p = sliceLen(OUTLINE.map(([x, y]) => toScreen(cf, x, y)), 0, h - 2); if (p.length > 1) tip = p; }
      if (tip) { const n = tip.length, an = Math.atan2(tip[n - 1][1] - tip[n - 2][1], tip[n - 1][0] - tip[n - 2][0]); burinTip(ctx, tip[n - 1][0], tip[n - 1][1], an, t, { size: 15, foil: '#ffb35c', seed: 5 }); }
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
