// c05 · No. 9 Nazca: the giant figures · an A.I. combs the aerial photos (47,410 leads) · almost all nothing · walkers check the best
// on site: 430 known + 303 new · small, close to old footpaths · rituals vs people walking past · it only had to say where to look
// (lamp 9) · but what if the machine points and no one looks (the pipe on the horizon).
// T.G('The Nazca desert') → T.G('Methane is invisible') · builder B1 · plan: docs/shots.md 9.01–9.08
// ONE continuous take: the desert from above (lib/f28_b1_desert.mjs, from c04) → a frame round one small figure grows into the screen
// (a portal): the desert at eye level, you walking the old path → the bead's arrow → the pipe (continued by c06).
//
// | ID    | anchor (phrase)                    | picture (one idea)                                                          | camera                  |
// |-------|------------------------------------|-----------------------------------------------------------------------------|-------------------------|
// | 9.01  | The Nazca desert is famous         | the empty frames go out; the giant figures draw on in gold · REAL            | ride, push              |
// | 9.02  | An A.I. combed aerial photos       | the bead sweeps the aerial grid; cool leads blink on behind it: 47,410 LEADS | wide                    |
// | 9.03  | Almost all of them were nothing    | almost all leads go out; a dozen stay                                        | hold                    |
// | 9.04  | Archaeologists checked only        | tiny lanterns walk out to them; small figures light; 430 KNOWN + 303 NEW     | push to the paths       |
// | 9.05  | The new ones are small             | one small figure beside an old path: ≈ 9 M · ≈ 43 M FROM A PATH               | dive to it              |
// | 9.06  | The team's reading                 | a ring of tiny lights round the hummingbird (rituals) → the frame grows: at eye level you walk the path past the small one | pull back → portal |
// | 9.07★ | The A.I. didn't need to be right   | the bead in the sky points a gold beam at the figure: WHERE TO LOOK; lamp 9    | tilt up a little        |
// | 9.08  | But what happens when the machine points | the beam swings to a pipe on the horizon: a cool shadow curls; nobody comes | truck right → ride |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f28_kit.mjs';
import * as B from '../lib/f28_b1_kit.mjs';
import * as D from '../lib/f28_b1_desert.mjs';
import { ride45, tileFlag } from './sc04.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, halo, mixHex, prng } = E;

const CE = (u, v, s, sx, sy) => E.aim(E.F0, u, v, s, sx, sy);
export const ride56 = (T) => { const t0 = T.G('Methane is invisible') - .6; return { t0, cam: B.ride(E.F0, 1260, 480, .9, t0) }; };
export const BEAD_EYE = { Z: 5200, x: 1180, y: 330 };   // the bead in the sky over the desert (card Z 5200)

// the small hero figure on the map: 43 m from the old path, 9 m long (≈ 120 px : 25 px)
const HP = (() => { const P0 = D.PATHS[0], i = 44, p = P0[i], q = P0[i + 1], nx = -(q[1] - p[1]), ny = q[0] - p[0], l = Math.hypot(nx, ny); return { px: p[0], py: p[1], x: p[0] - nx / l * 120, y: p[1] - ny / l * 120 }; })();
const LEADS = (() => { const r = prng(47410), a = []; for (let k = 0; k < 1100; k++) a.push([-900 + r() * 4000, -600 + r() * 2500, r()]); return a; })();

export function anchors05(T) {
  const G = (p, after = 0) => T.G(p, 0, after);
  const a = {};
  a.nazca = G('The Nazca desert'); a.drawings = G('giant drawings'); a.anai = G('combed aerial', a.nazca) - .4; a.flagged = G('flagged tens');
  a.almost = G('Almost all of them'); a.arch = G('Archaeologists checked'); a.site = G('on site'); a.doubled = G('nearly doubled');
  a.newones = G('The new ones are small'); a.close = G('close to ancient'); a.reading = G("The team's reading"); a.rituals = G('community rituals');
  a.smallones = G('The small ones, for'); a.walking = G('walking past'); a.didnt = G("didn't need to be right") - .4; a.only = G('It only had to tell');
  a.where = G('where to look'); a.but = G('But what happens when'); a.noone = G('no one looks');
  a.c04wrong = G('was wrong almost');
  return a;
}
export default async (T, R) => {
  E.prepareEditorial();
  const a = anchors05(T); a.end = R.b;
  return [{ t: R.a, draw: scene(a, T), print: F.PRINT28 }];
};

// the eye-level world of 9.05–9.08 as c06 continues it: o.st(t) → state overrides (bend …), o.bead(t) → { Z, x, y } (the bead's card
// point), o.beamTo(c, t) → screen point the beam aims at (default: the plume site), o.beamA 0..1
export function eyeParts(a) {
  const tP0 = a.smallones - .1;
  const duU = (t) => lerp(.05, .5, sineIO(span(t, tP0, a.didnt + 1.0))) + lerp(0, .5, sineIO(span(t, a.where, a.noone + 1.6)));
  const eyeSt = (t) => ({
    bend: 0, glow: .7, fig: 1, pipe: span(t, a.but - .4, a.but + .8), plume: span(t, a.but + 1.0, a.noone + .2),
    du: { u: duU(t), walk: t * 6.2, a: 1 - span(duU(t), .9, 1) },
    extraSky: null,
  });
  function eyePart(ctx, c, t, top = true, o = {}) {
    const st = { ...eyeSt(t), ...(o.st ? o.st(t) : {}) };
    D.eyeWorld(ctx, c, t, st);
    if (!top) return;
    // the bead in the sky; the gold beam to the small figure (WHERE TO LOOK), then it swings to the pipe and stays cool
    const bb = o.bead ? o.bead(t) : BEAD_EYE, q = D.plumeSite(st.bend);
    const bp = E.project(c, bb.Z, bb.x, bb.y), fp = E.project(c, E.F0, 980, 830), pp = o.beamTo ? o.beamTo(c, t) : E.project(c, D.Z_EH, q.x, q.y + 10);
    const born = expoOut(span(t, a.didnt - .6, a.didnt + .6));
    if (born > 0 && bp) {
      F.agent(ctx, t, bp[0] + 3 * Math.sin(t * 1.1), bp[1] + 2 * Math.sin(t * 1.5), 10 * born, { think: span(t, a.didnt, a.only) * .6 });
      const bu = sineIO(span(t, a.only + .1, a.where + .2)), sw = sineIO(span(t, a.but + .2, a.but + 1.8));
      if (bu > 0 && pp) { const tx = fp ? lerp(fp[0], pp[0], sw) : pp[0], ty = fp ? lerp(fp[1] - 20, pp[1], sw) : pp[1];
        F.beam(ctx, t, bp[0], bp[1] + 10, tx, ty, bu, { w: 3, hit: span(t, a.where, a.where + .6) * (1 - sw), warm: .85 * (1 - sw), a: o.beamA ?? 1 }); }
      const wl = span(t, a.where + .1, a.where + .8) * (1 - span(t, a.but, a.but + .6));
      if (wl > 0 && fp) F.maskLine(ctx, [['WHERE TO LOOK', 1]], fp[0], fp[1] + 120, 34, F.rise(wl), { serif: false, weight: 600, align: 'center', glow: false });
    }
  }
  return { eyeSt, eyePart };
}

function scene(a, T) {
  const R45 = ride45(T), R56 = ride56(T);
  const tP0 = a.smallones - .1, tP1 = a.smallones + 1.9;           // the frame round the small figure grows into the screen
  // ---------------------------------------------------------------- map camera (top-down)
  const KM = [[R45.t0 + 1.2, R45.cam(R45.t0 + 1.2)], [a.drawings + 1.2, D.MC(980, 500, .66)], [a.flagged, D.MC(1100, 640, .5)], [a.almost + 1.4, D.MC(1000, 640, .52)],
    [a.site + .4, D.MC(800, 760, .66)], [a.doubled + 1.5, D.MC(820, 820, .72)], [a.close + .8, D.MC(HP.x + 40, HP.y + 40, 2.4)], [a.reading + .5, D.MC(HP.x + 30, HP.y + 30, 2.2)],
    [a.rituals + .4, D.MC(930, 560, 1.15)], [a.smallones - .5, D.MC(940, 600, 1.1)], [tP0 + .9, D.MC(HP.x, HP.y, 2.6)], [tP1, D.MC(HP.x, HP.y, 2.75)]];
  const camM = (t) => (t < R45.t0 + 1.2 ? R45.cam(t) : F.camPath(t, KM));
  // ---------------------------------------------------------------- eye-level camera
  const KE = [[tP0, CE(960, 540, 1)], [tP1 + .4, CE(940, 560, 1.02)], [a.didnt + .3, CE(980, 520, .98)], [a.where + .6, CE(1030, 500, .96)],
    [a.but + 1.4, CE(1180, 490, .92)], [R56.t0, R56.cam(R56.t0)]];
  const camE = (t) => (t >= R56.t0 ? R56.cam(t) : F.camPath(t, KE));
  const sweep = (t) => sineIO(span(t, a.anai + .4, a.almost - .2));
  const leadOff = (k, t) => (k < 0 ? 0 : sineIO(span(t, a.almost + .1 + LEADS[k][2] * 1.2, a.almost + .5 + LEADS[k][2] * 1.2)));

  const mapSt = (t) => ({
    figs: span(t, a.nazca + .2, a.drawings + 1.6), figA: 1 - .5 * span(t, a.anai, a.anai + 1) + .5 * span(t, a.reading, a.rituals),
    grid: Math.max(1 - span(t, a.nazca - .1, a.nazca + .9), span(t, a.anai + .3, a.anai + 1.2) * (1 - span(t, a.arch, a.arch + 1.2))),
    tiles: (k) => tileFlag(k, t, a.c04wrong) * (1 - span(t, a.nazca - .1, a.nazca + .8)),
    walkers: span(t, a.arch + .4, a.site + 1.4) * (1 - span(t, a.newones, a.newones + 1)), newFigs: span(t, a.site + .3, a.doubled + .8),
    paths: span(t, a.newones + .3, a.close + .6), ring: span(t, a.rituals - .3, a.rituals + 1.4),
    extra: (cx) => {
      // the leads: appear under the sweep, almost all go out
      const sw = sweep(t);
      if (sw > 0) { const by = lerp(-600, 1900, sw); for (let k = 0; k < LEADS.length; k++) { const [x, y] = LEADS[k]; if (y > by) continue; const off = leadOff(k, t); if (off >= 1) continue; const fresh = 1 - span(by - y, 0, 220); cx.fillStyle = rgba(mixHex(F.COOL.body, P.cream, fresh), (.8 - .2 * (1 - fresh)) * (1 - off)); cx.beginPath(); cx.arc(x, y, 6 + 6 * fresh, 0, Math.PI * 2); cx.fill(); } }
      // the best leads stay (cool rings), then the walkers reach them
      const bl = span(t, a.almost + .8, a.almost + 1.6) * (1 - span(t, a.site + .6, a.site + 1.6));
      if (bl > 0) for (const [x, y] of D.BEST) { cx.strokeStyle = rgba(F.COOL.line, .9 * bl); cx.lineWidth = 3; cx.beginPath(); cx.arc(x, y, 18 + 3 * Math.sin(t * 3 + x), 0, Math.PI * 2); cx.stroke(); }
      // the small hero figure, 43 m from the path
      const hu = span(t, a.site + .6, a.doubled + .6);
      if (hu > 0) { cx.save(); cx.translate(HP.x, HP.y); cx.rotate(.4); const pts = [[-.4, .3], [-.1, -.4], [.1, -.1], [.45, -.35], [.2, .1], [.45, .4], [-.1, .2], [-.4, .3]].map(([u, v]) => [u * 50, v * 50, 2.6]); E.trail(cx, pts, hu, { w: 2.6, spark: false }); cx.restore(); if (hu >= 1) halo(cx, HP.x, HP.y, 50, .4, P.halo0, P.core1); }
      // the measure: figure ↔ path
      const mu = span(t, a.close - .1, a.close + .8) * (1 - span(t, a.reading + .2, a.reading + .9));
      if (mu > 0) { E.trail(cx, [[HP.x, HP.y, 1.4], [HP.px, HP.py, 1.4]], mu, { w: 1.4 }); }
    },
  });
  const { eyePart } = eyeParts(a);

  return (ctx, t) => {
    if (t < tP1) {
      const cm = B.drifted(camM(t), E.F0, t, 1);
      D.desertMap(ctx, cm, t, mapSt(t));
      // sweep: the bead combs the photos (screen space over the map)
      const sw = sweep(t), bOn = span(t, a.anai - .2, a.anai + .5) * (1 - span(t, a.almost + .2, a.almost + 1.2));
      if (bOn > 0) { const by = lerp(-600, 1900, sw), bx = 1100 + 1700 * Math.sin(sw * Math.PI * 7), p = E.project(cm, E.F0, bx, by); if (p) { F.agent(ctx, t, p[0], p[1] - 40, 11 * bOn, { a: bOn }); F.beam(ctx, t, p[0], p[1] - 40, p[0], p[1] + 30, bOn, { w: 2, spark: false }); } }
      const cu = span(t, a.anai + .5, a.anai + 1.2) * (1 - span(t, a.arch - .3, a.arch + .4));
      if (cu > 0) { const n = Math.round(47410 * clamp(sweep(t) * 1.08)).toLocaleString('en-US'); F.maskLine(ctx, [[n, 0]], 1640 - F.measure(n, 76, true), 210, 76, F.rise(cu), {}); F.maskLine(ctx, [['LEADS', 0]], 1660, 196, 24, F.rise(cu), { serif: false, weight: 600, col: F.COOL.text, glow: false }); }
      // 9.04 the slabs: known + new
      const su = span(t, a.doubled - .2, a.doubled + .6) * (1 - span(t, a.newones + .4, a.newones + 1.1));
      if (su > 0) { F.slab(ctx, t, 1000, 150, 387, 30, { col: 'stone', u: su, label: '430 KNOWN', a: su }); F.slab(ctx, t, 1387, 150, 273, 30, { col: 'warm', u: span(su, .4, 1), value: '+303 NEW', a: su }); }
      // 9.05 the labels at the small figure
      const lu = span(t, a.newones + .5, a.newones + 1.3) * (1 - span(t, a.reading + .2, a.reading + .9));
      if (lu > 0) { const p = E.project(cm, E.F0, HP.x, HP.y), q = E.project(cm, E.F0, (HP.x + HP.px) / 2, (HP.y + HP.py) / 2);
        if (p) F.label(ctx, p[0] + 40, p[1] - 20, '≈ 9 M', null, lu, { dx: 60, dy: -70, size: 30 });
        if (q) F.label(ctx, q[0], q[1], '≈ 43 M FROM A PATH', null, span(t, a.close + .2, a.close + 1.0) * (1 - span(t, a.reading + .2, a.reading + .9)), { dx: -70, dy: 80, size: 26 }); }
      // the frame round the small figure grows into the screen: inside lies the desert at eye level
      if (t > tP0) {
        const p = E.project(cm, E.F0, HP.x, HP.y), g = sineIO(span(t, tP0 + .3, tP1)), snap = expoOut(span(t, tP0, tP0 + .35));
        const sz = lerp(lerp(220, 130, snap), W, g), cx = lerp(p[0], W / 2, g), cy = lerp(p[1], H / 2, g), k = sz / W;
        if (g > 0) { ctx.save(); ctx.beginPath(); ctx.rect(cx - sz / 2, cy - sz / 2, sz, sz); ctx.clip(); E.withOuter({ k, e: cx - W / 2 * k, f: cy - H / 2 * k }, () => eyePart(ctx, camE(t), t, false)); ctx.restore(); }
        ctx.save(); ctx.strokeStyle = rgba(F.COOL.line, .9 * snap * (1 - span(g, .8, 1))); ctx.lineWidth = 2.5; ctx.strokeRect(cx - sz / 2, cy - sz / 2, sz, sz); ctx.restore();
      }
    } else eyePart(ctx, B.drifted(camE(t), E.F0, t, sineIO(span(t, tP1, tP1 + 1.4))), t);
    F.realStamp(ctx, t, a.nazca + 1.0, a.anai + .2, 'nazca');
    F.source(ctx, t, a.arch + .5, a.reading, F.SOURCES.nazca);
    F.lampRail(ctx, t, T);
  };
}
