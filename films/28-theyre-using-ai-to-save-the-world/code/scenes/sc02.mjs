// c02 · No. 12 cont. · the offer from the towers, the station says no, C1 Peter-Lucas Jones, the speakers hold the machine.
// T.G('A global data company') → T.G('That machine was built to listen') · builder B1 · plan: docs/shots.md 12.07–12.12
// ONE continuous take in the station world (lib/f28_seams.mjs), grown out of plateStation. No door, no cut.
//
// | ID    | anchor (phrase)                      | picture (one idea)                                                     | camera                 |
// |-------|--------------------------------------|------------------------------------------------------------------------|------------------------|
// | 12.07 | A global data company                | a tower window brightens; a glossy cool envelope glides from the towers across the water to the door: ≈ $45 / HOUR | plate creep → follow the envelope |
// | 12.08 | The station said no                  | the door stays shut; the envelope stops, turns back and sinks into the dark water (a ring) | settle on the station |
// | 12.09 | Peter Lucas Jones runs it            | a figure in the warm window; the window grows into the clip plate     | push to the window     |
// | 12.10 | [C1]                                 | C1 PETER-LUCAS JONES · CEO, TE HIKU MEDIA · ORIGINAL FOOTAGE           | (behind the plate)     |
// | 12.11 | A machine can't keep a language alive| the plate shrinks into the window; the bead rises small; the ring of voices widens round the whole coast | pull back |
// | 12.12★| But this time, the speakers own      | the ring closes round the bead at the antenna: KAITIAKITANGA LICENCE  | push to the antenna → ride |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f28_kit.mjs';
import * as S from '../lib/f28_seams.mjs';
import * as B from '../lib/f28_b1_kit.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, halo, mixHex } = E;

export const anchors02 = (T) => {
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.T0 = G('A global data company'); a.recs = G('recordings like these'); a.pay = G('offered to pay');
  a.no = G('The station said no'); a.peter = G('Peter Lucas Jones'); a.explain = G('This is how he explained');
  a.C1 = T.clip('C1'); a.keep = G("A machine can't keep"); a.only = G('Only speakers can');
  a.own = G('But this time, the speakers own'); a.ownW = G('own the machine', a.own); a.end = G('That machine was built to listen');
  return a;
};
// the shared ride into c03 (the bead held in the ring at the antenna): both chunks call it
const CS = (u, v, s, sx, sy) => E.aim(S.Z_ST, u, v, s, sx, sy);
export const RING_C = [S.STATION.antenna[0], S.STATION.antenna[1] - 6];
export const ride23 = (T) => { const t0 = T.G('That machine was built to listen') - .6; return { t0, cam: B.ride(S.Z_ST, RING_C[0] - 20, RING_C[1] + 40, 1.5, t0) }; };
// the ring of voices at time t (c02 and the first seconds of c03): centre, radii, voice size. Closes round the bead from 'own'.
export function ringAt(a, t) {
  const wide = sineIO(span(t, a.keep + .3, a.only + .6)), close = sineIO(span(t, a.own + .1, a.ownW + 1.2));
  const ax = RING_C[0], ay = RING_C[1];
  const cx = lerp(lerp(ax, 520, wide), ax, close), cy = lerp(lerp(ay, 600, wide), ay, close);
  const rx = lerp(lerp(150, 760, wide), 96, close), ry = lerp(lerp(150 * .45, 120, wide), 96 * .62, close);
  return { cx, cy, rx, ry, s: lerp(lerp(30, 34, wide), 24, close), spin: lerp(.35, .22, wide), bright: 1 + .5 * F.bump(t, a.only, 1.6) };
}

export default async (T, R) => {
  E.prepareEditorial();
  const a = anchors02(T);
  return [{ t: R.a, draw: scene(a, T), print: F.PRINT28 }];
};

function scene(a, T) {
  const tP = a.T0 - S.SEAM_HALF, tPlateEnd = a.T0 + S.SEAM_HALF;
  const plateCam = (t) => CS(860 + S.TRUCK * (t - tP), 610, .78 * (1 + S.CREEP * (t - tP)));
  const R23 = ride23(T);
  const win = S.STATION.window, door = S.STATION.door;
  const c3 = a.C1;
  // ---------------------------------------------------------------- camera: the plate creep, then the carriers (envelope → window → ring)
  const K = [
    [tPlateEnd + .7, plateCam(tPlateEnd + .7)],
    [a.recs + 1.4, CS(1010, 600, .86)], [a.pay + .9, CS(1050, 640, .98)],
    [a.no + .3, CS(1040, 650, 1.05)], [a.peter + .2, CS(1020, 655, 1.4, W / 2, 500)], [a.explain + .3, CS(win[0], win[1] - 4, 2.2, W / 2, 400)],
    [c3.start, CS(win[0], win[1] - 2, 2.5, W / 2, 380)], [c3.end + .1, CS(win[0] - 6, win[1], 2.7, W / 2, 380)],
    [a.keep + 1.4, CS(820, 590, .95)], [a.only + .9, CS(760, 585, .9)],
    [a.own + 1.6, CS(930, 520, 1.15)], [R23.t0, R23.cam(R23.t0)],
  ];
  const camAt = (t) => {
    if (t < tPlateEnd) return plateCam(t);
    if (t >= R23.t0) return R23.cam(t);
    const cp = F.camPath(t, K);
    return t < K[0][0] ? B.mixCam(plateCam(t), cp, sineIO(span(t, tPlateEnd, K[0][0])), S.Z_ST) : cp;
  };
  const drift = (t) => sineIO(span(t, tPlateEnd, tPlateEnd + 1.6));
  const cam = (t) => B.drifted(camAt(t), S.Z_ST, t, drift(t));

  // ---------------------------------------------------------------- the envelope (world path: a tower window → over the sea → before the door)
  const TW = B.toWorld(1694, 380, 9000);          // a lit window high in the second tower
  const PTS = [[TW[0], TW[1], 9000], [2900, -40, 6800], [1500, 120, 4300], [520, 205, 3000], [40, 200, 2650]];
  const bez = (u) => { // Catmull-Rom through the points, uniform
    const n = PTS.length - 1, x = clamp(u) * n, i = Math.min(n - 1, Math.floor(x)), f = x - i;
    const p0 = PTS[Math.max(0, i - 1)], p1 = PTS[i], p2 = PTS[i + 1], p3 = PTS[Math.min(n, i + 2)];
    return [0, 1, 2].map((j) => .5 * (2 * p1[j] + (-p0[j] + p2[j]) * f + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * f * f + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * f * f * f));
  };
  const tE0 = tPlateEnd + .3, tE1 = a.no + .15;     // leaves the tower … stops before the door
  const tS0 = a.no + .9, tS1 = a.peter + .6;        // turns back and sinks
  function envelopeAt(c, t) {
    if (t < tE0 - .8 || t > tS1 + .6) return null;
    const born = expoOut(span(t, tE0 - .8, tE0 + .2));
    if (t < tS0) {
      const u = sineIO(span(t, tE0, tE1)); const [X, Y, Z] = bez(u); const p = B.P3(c, X, Y + 6 * Math.sin(t * 2.1), Z); if (!p) return null;
      return { x: p[0], y: p[1], s: 110 * p[2] * born, a: born, tilt: .06 * Math.sin(t * 1.3), sink: 0 };
    }
    const u = span(t, tS0, tS1), e = sineIO(u), X = lerp(40, 760, e), Z = lerp(2650, 3900, e), Y = lerp(200, 330, expoIn(u) * .3 + e * .7);
    const p = B.P3(c, X, Y, Z); if (!p) return null;
    return { x: p[0], y: p[1], s: 110 * p[2], a: 1 - span(u, .7, 1), tilt: -.25 * e, sink: u };
  }

  return (ctx, t) => {
    if (t < tPlateEnd) { S.plateStation(ctx, t, T); return; }
    const c = cam(t), rg = ringAt(a, t);
    const towers = .7 + .25 * F.bump(t, tE0 - .9, 2.4) - .2 * span(t, a.no, a.no + 1.5);
    S.stationWorld(ctx, c, t, {
      window: 1, ring: 0, towers,
      voices: (cx) => {
        // a figure in the warm window ('runs it'): a tiny dark silhouette against the light
        const fig = span(t, a.peter - .2, a.peter + .8) * (1 - span(t, a.explain + 1.6, a.explain + 2.2)) + span(t, c3.end + .2, c3.end + 1.2) * (1 - span(t, a.keep + 1.5, a.keep + 2.5));
        if (fig > 0) { cx.save(); cx.beginPath(); cx.rect(win[0] - 13, win[1] - 16, 26, 22); cx.clip(); cx.globalAlpha = fig; E.person(cx, win[0] - 3 + 2 * Math.sin(t * .4), win[1] + 10, 22, { look: .1, light: -1 }); cx.restore(); }
        // the bead rises small out of the window (it settled there in c01) and floats to the antenna; the ring holds it
        const born = expoOut(span(t, a.keep - .2, a.keep + 1.4));
        if (born > 0) {
          const up = sineIO(span(t, a.keep, a.only + .4)), bx = lerp(win[0], RING_C[0], up) + 3 * Math.sin(t * 1.2), by = lerp(win[1], RING_C[1], up) - 26 * Math.sin(Math.PI * up) + 2.5 * Math.sin(t * 1.6);
          F.agent(cx, t, bx, by, 7.5 * born, { think: .6 * span(t, a.own + .8, a.ownW + 1.4) });
        }
        B.voiceRing(cx, t, rg.cx, rg.cy, rg.rx, rg.ry, 1, { s: rg.s, spin: rg.spin, n: 16, a: Math.min(1.3, rg.bright) });
        // where the ring holds the bead: a warm touch
        const hold = span(t, a.ownW + .2, a.ownW + 1.4);
        if (hold > 0) halo(cx, RING_C[0], RING_C[1], 70, .35 * hold, P.halo0, P.core1);
      },
    });
    // the envelope (screen space, sorted after the world: it flies in front of the coast)
    const ev = envelopeAt(c, t);
    if (ev && ev.a > 0) {
      if (ev.sink > .55) { const k = span(ev.sink, .55, 1); ctx.save(); ctx.strokeStyle = rgba(F.COOL.line, .55 * (1 - k)); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(ev.x, ev.y + ev.s * .2, ev.s * (.5 + 1.6 * k), ev.s * (.12 + .3 * k), 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
      ctx.save(); if (ev.sink > 0) { ctx.beginPath(); ctx.rect(0, 0, W, ev.y + ev.s * .2 + ev.s * .31 * (1 - span(ev.sink, .5, 1)) * 2); ctx.clip(); }
      B.envelope(ctx, t, ev.x, ev.y + ev.s * .62 * span(ev.sink, .5, 1), ev.s, { a: ev.a, tilt: ev.tilt, glow: 1 - .5 * ev.sink });
      ctx.restore();
      // ≈ $45 / HOUR: a small cool tag on the envelope while it comes (it goes with it)
      const tu = span(t, a.pay - .1, a.pay + .7) * (1 - span(t, a.no + .3, a.no + 1.0));
      if (tu > 0) F.tag(ctx, t, ev.x + ev.s * .3, ev.y + ev.s * .28, '≈ $45 / HOUR', tu, { col: 'cool', size: 20, len: 16 });
    }
    F.source(ctx, t, a.recs + .4, a.peter, F.SOURCES.lionbridge);
    // C1: the warm window grows into the clip plate and shrinks back into it
    if (t > a.explain - .6 && t < c3.end + .8) {
      const p0 = E.project(c, S.Z_ST, win[0] - 13, win[1] - 16), p1 = E.project(c, S.Z_ST, win[0] + 13, win[1] + 6);
      const m = sineIO(span(t, a.explain - .2, c3.start)) * (1 - sineIO(span(t, c3.end - .05, c3.end + .6)));
      const fade = span(t, a.explain - .2, a.explain + .2) * (1 - span(t, c3.end + .35, c3.end + .6));
      if (m > 0 && fade > 0) { ctx.save(); ctx.globalAlpha = fade; F.clipPlate(ctx, t, T, 'C1', { from: { x: p0[0], y: p0[1], w: p1[0] - p0[0], h: p1[1] - p0[1] }, morph: m }); ctx.restore(); }
    }
    // 12.12: the licence, pinned to the closed ring
    const lu = span(t, a.ownW + .5, a.ownW + 1.3) * (1 - span(t, R23.t0 - .5, R23.t0 + .1));
    if (lu > 0) { const p = E.project(c, S.Z_ST, RING_C[0] + 90, RING_C[1] - 20); if (p) F.label(ctx, p[0], p[1], 'KAITIAKITANGA LICENCE', 'GUARDIANSHIP OF THE DATA', lu, { dx: 60, dy: -60, size: 24 }); }
    const cm = sineIO(span(t, a.explain - .2, c3.start)) * (1 - sineIO(span(t, c3.end - .05, c3.end + .6)));
    F.lampRail(ctx, t, T, { a: 1 - .85 * span(cm, .8, 1) });   // the rail steps back while the clip's credit line sits under it (as in c12)
  };
}
