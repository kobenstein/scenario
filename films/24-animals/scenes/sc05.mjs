// c05 · The tour II · León crows, the pigs again · B2. T.G('Now north, to Spain') → T.G('In the Caribbean').
// Plan: docs/shots.md 5.01–5.06 · world/rules: docs/MOTION.md · seams: lib/f24_seams.mjs (plateNorth) · shared: lib/f24_b2_*.mjs
// ONE entry, one continuous take: plateNorth (received) → the map keeps creeping, then ONE move: the flight north into the gold León
// medallion while it grows with the map (the crow with the recorder inside) → the field at dawn: the family murmurs, each call flies
// into the recorder, 100,000+ CALLS → one call with its motion trace (the crow flies, lands, feeds) → CONTEXT engraves → the field
// closes into its pin, the map between Spain and Switzerland, OTHER TEAM · EUROPE → into the pig pin: the barn of the hook, the calls,
// BIRTH → SLAUGHTER, the FEELS beads fly into the tablet: FEELINGS → (c06) the barn closes into its pin, flight to Dominica.
//
// | ID   | anchor (phrase)                     | picture (one idea)                                               | move / carrier                |
// |------|-------------------------------------|------------------------------------------------------------------|-------------------------------|
// | 5.01 | Now north, to Spain                 | plateNorth → flight north, the León medallion grows with the map  | ONE flight + zoom (iris)      |
// | 5.02 | They caught more than               | the crow family at dawn; murmurs fly into the recorder; 100,000+  | pull back · counter           |
// | 5.03 | And each call comes with            | one call + its motion line: FLYING · LANDING · FEEDING; CONTEXT   | the crow acts it · slot       |
// | 5.04 | And the pigs from the start         | the field closes into its pin; OTHER TEAM · EUROPE                | zoom out · label              |
// | 5.05 | Their A.I. learned from thousands   | into the pig pin: the barn; calls; BIRTH → SLAUGHTER              | zoom in (iris) · line         |
// | 5.06 | So one piece is already in place    | the FEELS beads fly into the tablet: FEELINGS                     | beads → slot                  |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f24_kit.mjs';
import { plateNorth, NORTH_VIEW, SEAM_HALF, creep } from '../lib/f24_seams.mjs';
import * as B from '../lib/f24_b2_world.mjs';
import * as Hb from '../lib/f24_b2_habitats.mjs';
import { barnPart, barnTimes, MID } from '../lib/f24_b2_c56.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo } = E;
const { rise } = F;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = { T0: R.a, end: R.b };
  a.north = G('Now north, to Spain'); a.recorders = G('tiny recorders', a.north); a.crows = G('wild crows', a.north); a.crowsE = GE('wild crows', a.north);
  a.caught = G('They caught more than', a.north); a.hundredE = GE('hundred thousand calls', a.caught);
  a.many = G('Many were quiet', a.caught); a.miss = GE('microphones miss', a.many);
  a.each = G('And each call comes with', a.many); a.call = G('call comes', a.each); a.doing = G('was doing right then', a.each); a.doingE = GE('was doing right then', a.each);
  a.trick = G("That's the baby's trick", a.each); a.trickE = GE("That's the baby's trick", a.each);
  Object.assign(a, barnTimes(T));
  return [{ t: R.a, draw: scene(a, T), print: F.PRINT24 }];
};

function scene(a, T) {
  const T0 = a.T0, ts = T0 + SEAM_HALF;
  // ---- the map track: plate view (creeping) → ONE flight into the León medallion (zRef = the plate zoom at ts)
  const NV = B.crept(NORTH_VIEW, creep(ts, T, 'Now north, to Spain'));
  const zRefL = NV.z, V0L = B.medView('leon', zRefL);
  const tz0 = ts, tz1 = a.caught - .3;                          // 6.6 s: one calm move (flight north + zoom through the medallion)
  // ---- the field camera (design px, F0): medium on the tagged crow while the medallion grows, pull back to the family on "They
  //      caught", a slow push, then it follows the crow's short flight (5.03)
  const fly0 = a.call - .05, fly1 = a.doing - .35, land1 = fly1 + .45, peck1 = a.trickE - .3;   // the crow takes off, lands, feeds
  const K = [
    [tz0, F.aim(F.F0, 938, 742, 1.55)], [tz1 - .4, F.aim(F.F0, 950, 720, 1.42)], [a.caught + 1.6, F.aim(F.F0, 975, 660, 1.06)],
    [a.many + .2, F.aim(F.F0, 985, 652, 1.1)], [a.each - .1, F.aim(F.F0, 1000, 650, 1.16)], [fly1, F.aim(F.F0, 1050, 630, 1.16)],
    [a.trickE, F.aim(F.F0, 1060, 646, 1.22)], [a.zo1, F.aim(F.F0, 1040, 680, 1.4)],
  ];
  const fieldCam = (t) => B.stageCam(t, K, 1.5 * span(t, tz0, tz1), 3);
  // the murmurs: small pale calls from the family, each flies into the recorder (counted)
  const EMIT = []; for (let k = 0; k < 16; k++) EMIT.push({ t: a.caught + .1 + k * .41 + .13 * Math.sin(k * 2.3), i: [0, 2, 1, 3][k % 4], kind: k % 5 === 2 ? 'caw' : 'murmur', seed: 60 + k });
  const tagState = (t) => {   // the tagged crow: at rest, then 5.03 takes off, flies an arc to the right, lands, feeds
    const g = Hb.LEON.ground + 30, u = span(t, fly0, land1), air = t > fly0 && t < land1;
    const x = lerp(930, 1150, sineIO(u)), lift = Math.sin(Math.PI * u) * 150;
    const op = .8 * Math.sin(Math.PI * span(t, a.call - .7, a.call - .05));   // it calls before it goes
    const peck = t > land1 ? Math.max(0, Math.sin((t - land1) * 7.5)) ** 2 * (1 - span(t, peck1, peck1 + .4)) : 0;
    return { x, y: g - lift + (air ? .5 * Hb.LEON.tagged.h : 0), fly: air ? (t - fly0) * 15 : undefined, open: op, peck, dir: 1 };
  };
  function field(ctx, t, c) {
    let rec = null;
    Hb.leonStage(ctx, c, t, { cast: () => {
      const open = [0, 0, 0, 0];
      for (const m of EMIT) { const b = Math.sin(Math.PI * span(t, m.t - .25, m.t + .15)); if (b > 0) open[m.i] = Math.max(open[m.i], .7 * b); }
      const cast = Hb.crowCast(ctx, t, { tag: tagState(t), open });
      rec = cast.rec;
      const glow = .6 + .4 * Math.sin(t * 3) * 0, tg = clamp(span(t, a.recorders - .3, a.recorders + .4)) * (1 - .5 * span(t, a.each, a.each + 1));
      halo(ctx, rec[0], rec[1], 60 + 50 * tg, .25 + .5 * tg, F.GOLD.body, F.GOLD.core);   // the tiny recorder (ESP gold)
      for (const m of EMIT) {   // a murmur rises from the beak, then curves into the recorder and shrinks into it
        const u = span(t, m.t, m.t + 1.55); if (u <= 0 || u >= 1) continue;
        const mo = cast.fam[m.i].mouth, p0 = [mo[0] + 30 * Hb.FAMILY[m.i].dir, mo[1] - 30], p1 = [lerp(p0[0], rec[0], .5), Math.min(p0[1], rec[1]) - 120], p2 = rec;
        const q = sineIO(u), x = (1 - q) ** 2 * p0[0] + 2 * (1 - q) * q * p1[0] + q * q * p2[0], y = (1 - q) ** 2 * p0[1] + 2 * (1 - q) * q * p1[1] + q * q * p2[1];
        const s = (1 - expoIn(span(u, .55, 1))) * Math.min(1, u * 4);
        F.wave(ctx, t, x, y, 70 * s, 34 * s, m.kind, { u: Math.min(1, u * 3), bars: 11, seed: m.seed, head: false, a: .55, col: 'cream' });
      }
      const hit = EMIT.reduce((s, m) => s + Math.max(0, 1 - Math.abs(t - (m.t + 1.5)) / .25), 0);
      if (hit > 0) halo(ctx, rec[0], rec[1], 70, .5 * Math.min(1, hit), F.GOLD.body, F.GOLD.core);
    } });
    // 5.02 the counter (screen layer of the stage)
    const cu = B.win(t, a.caught + .15, a.each - .45);
    if (cu > 0) {
      const n = 100000 * expoOut(span(t, a.caught + .3, a.hundredE - .1) * 1.0) ** 1, plus = rise(span(t, a.hundredE - .2, a.hundredE + .4));
      const s = B.fmt(Math.round(n / 100) * 100);
      B.serif(ctx, s + (plus > .02 ? '+' : ''), 150, 300, 124, cu, { glow: true });
      B.caps(ctx, 'CALLS', 156, 360, 36, cu * rise(span(t, a.caught + .5, a.caught + 1.2)), { col: P.halo2 });
      if (rec && t < a.many + 1) {}
    }
    // 5.03 one call and its motion line (what the bird was doing right then)
    const ou = B.win(t, a.each + .1, a.zo0 - .4);
    if (ou > 0) {
      const x0 = 860, x1 = 1500, wy = 236, ly = 334;
      const wu = span(t, a.call - .75, a.call - .05);
      F.wave(ctx, t, (x0 + x1) / 2, wy, x1 - x0, 92 * ou, 'caw', { u: wu, bars: 56, seed: 77, col: 'cream', live: true });
      B.caps(ctx, 'ONE CALL', x0, wy - 66, 28, ou * rise(span(t, a.each + .2, a.each + .9)), { col: P.halo2 });
      // the trace: drawn in step with the crow (fly0 → peck1)
      const tu = span(t, fly0, peck1), segs = [[0, .4, 'FLYING'], [.4, .58, 'LANDING'], [.58, 1, 'FEEDING']];
      if (tu > 0) {
        ctx.save(); ctx.globalAlpha *= ou; ctx.strokeStyle = F.GOLD.body; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.beginPath();
        const N = 220;
        for (let i = 0; i <= N * tu; i++) {
          const f = i / N, x = lerp(x0, x1, f);
          let y = 0;
          if (f < .4) y = 16 * Math.sin(f * 120) * Math.min(1, f * 20);
          else if (f < .58) { const g = (f - .4) / .18; y = -46 * Math.exp(-g * 5) * Math.cos(g * 28); }
          else y = (Math.max(0, Math.sin((f - .58) * 95)) ** 6) * -24;
          i ? ctx.lineTo(x, ly + y) : ctx.moveTo(x, ly + y);
        }
        ctx.stroke(); ctx.restore();
        const hx = lerp(x0, x1, tu); if (tu < 1) halo(ctx, hx, ly, 40, .5 * ou, F.GOLD.body, F.GOLD.core);
        for (const [s0, s1, w] of segs) {
          const lu = rise(span(tu, s0 + .02, s0 + .14)) * ou; if (lu <= 0) continue;
          const xm = lerp(x0, x1, (s0 + s1) / 2), wdt = B.measure(w, 30, false);
          B.caps(ctx, w, xm - wdt / 2, ly + 70, 30, lu, { col: P.halo0 });
          if (s0 > 0) { ctx.save(); ctx.globalAlpha *= lu * .6; ctx.strokeStyle = P.halo2; ctx.lineWidth = 1.5; ctx.setLineDash([4, 6]); ctx.beginPath(); ctx.moveTo(lerp(x0, x1, s0), ly - 50); ctx.lineTo(lerp(x0, x1, s0), ly + 40); ctx.stroke(); ctx.restore(); }
        }
        B.caps(ctx, 'MOTION', x0, ly - 40, 24, ou * rise(span(tu, 0, .1)), { col: P.halo2 });
      }
    }
  }

  // ---- the map between León and the pigs (5.04): field closes into its pin; label; into the pig pin (5.05)
  const V0L2 = B.medView('leon', MID.z);
  return (ctx, t) => {
    if (t < ts) { plateNorth(ctx, t, T); return; }
    if (t < tz1) {   // 5.01 the flight north: the León medallion grows with the map
      const v = F.flight(NV, V0L, B.ZIN(span(t, tz0, tz1)));
      B.mapMed(ctx, t, T, v, { pid: 'leon', zRef: zRefL, scene: (c) => field(c, t, fieldCam(t)) });
    } else if (t < a.zo0) {
      field(ctx, t, fieldCam(t));
    } else if (t < a.zo1) {   // 5.04 the field closes into its pin
      const v = F.flight(V0L2, MID, B.ZOUT(span(t, a.zo0, a.zo1)));
      B.mapMed(ctx, t, T, v, { pid: 'leon', zRef: MID.z, scene: (c) => field(c, t, fieldCam(t)) });
    } else barnPart(ctx, t, T, a);
    B.hudTablet(ctx, t, T);
    F.strip(ctx, t, T);
  };
}
