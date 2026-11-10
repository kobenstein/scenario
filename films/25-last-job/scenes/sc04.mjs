// c04 · No. 7 creative handwork: the stone tips (image, music, cut on its face), CREATIVE HANDWORK · into the image glyph's light →
// out of the ANIMATION header glyph in the studio (W) · beads drop in and take ANIMATION, MUSIC, SOUND, SHOOT on their words; the EDIT
// bead starts and hesitates halfway · J3 Jakob walks to the ladder and climbs to the first ledge, the desk lamp goes low · J3b the EDIT
// bead runs through · settle on S.plateStudio (B2 takes over at "So here's the puzzle").
// Builder B1 · plan: docs/shots.md 4.01–4.05 · ONE entry (the first frame continues c03's take on No. 7, see lib/f25_b1_cut.mjs).
//
// | ID   | anchor            | picture                                                                 | camera                     |
// |------|-------------------|-------------------------------------------------------------------------|----------------------------|
// | 4.01 | Number seven      | No. 7 tips; CREATIVE HANDWORK; the image glyph brightens                 | breathing hold             |
// | 4.02 | Not really        | into the image glyph's light → out of the ANIMATION header glyph         | dive · W (light door)      |
// | 4.03 | Images … the edit | beads take ANIMATION, MUSIC, SOUND, SHOOT on their words; EDIT hesitates | pull out → truck right     |
// | 4.04 | [J3]              | Jakob walks to the ladder, climbs to the first ledge; the lamp goes low   | follow Jakob               |
// | 4.05 | [J3b]             | the EDIT bead runs through; settle on plateStudio                        | onto the plate's creep line|
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f25_kit.mjs';
import * as S from '../lib/f25_seams.mjs';
import * as B from '../lib/f25_b1_lib.mjs';
import { headerCut, n7, n7Cam, n7Creep, n7Fall, no7Face, n7GlyphPt } from '../lib/f25_b1_cut.mjs';
const { P, clamp, lerp, span, smooth, sineIO, expoIn, halo } = E;
const { rise, F0 } = F;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after);
  const a = { a0: R.a, end: R.b };
  a.n7 = n7(T); a.n8 = T.G('Number eight', 0, T.G('So if even a voice')); a.not = G('Not really', a.n7);
  a.images = G('Images', a.not); a.music = G('Music', a.images); a.sound = G('Sound', a.music); a.shots = G('Whole shots', a.sound);
  a.edit = G('Even the edit', a.shots); a.J3 = T.clip('J3'); a.J3b = T.clip('J3b'); a.puzzle = G("So here's the puzzle", a.edit);
  return [{ t: R.a, draw: scene(a, T), print: F.PRINT25 }];
};

const C = (u, v, s) => E.aim(F0, u, v, s);
const F7 = B.field(7);
const LIE = Math.PI / 2 - .015;
const LN = F.STUDIO.lanes, LL = LN.x1 - LN.x0, HD = F.STUDIO.head;
const frac = (x) => x - Math.floor(x);
const per = (i) => 5.5 + i * .63;                                   // the kit's loop period per lane (F.studio)
const lerpCam = (p, q, u) => ({ ...p, x: lerp(p.x, q.x, u), y: lerp(p.y, q.y, u), z: lerp(p.z, q.z, u) });

function scene(a, T) {
  const tP = a.puzzle - S.SEAM_HALF;                                 // plateStudio from here
  const tp = Math.max(a.not + .3, a.a0 + 1.45);                     // flood peak (the ramp starts after c03 ended)
  const J3 = a.J3, J3b = a.J3b, cut = headerCut(T);

  // ------------------------------------------------------------------ the rank side: No. 7 tips, the dive into its image glyph
  const gp = n7GlyphPt(LIE, 0);
  const glyphCam = B.fieldCam(F7, gp[0], gp[1], 22);
  const camRank = (t) => {
    const cd = E.camAt(t, [[a.a0, n7Cam()], [tp, glyphCam, 'i']], glyphCam.z + 400), c0 = n7Cam(), cr = n7Creep(t, T);
    const k = 1 - smooth(span(t, a.a0, tp));                          // the creep that carries the take over the boundary fades into the dive
    return { ...cd, x: cd.x + (cr.x - c0.x) * k, y: cd.y + (cr.y - c0.y) * k, z: cd.z + (cr.z - c0.z) * k };
  };
  function rankPart(ctx, t) {
    const c = E.camDrift(camRank(t), t, .6 * (1 - smooth(span(t, a.a0 + .2, tp - .5))), 11);
    const gl = smooth(span(t, a.not - .6, tp));
    B.rankWorld(ctx, c, t, {
      fall: (n) => (n === 10 ? LIE : n === 9 ? B.leanAngle(t, cut.tL, cut.tc) : n === 8 ? B.fallAngle(t, a.n8 + .15) : n === 7 ? n7Fall(t, T) : 0),
      each: (n) => (n === 9 || n === 8 ? { glyphA: 0 } : n === 7 ? { glyph: null } : null),
      after: (n, ang) => {
        if (n === 8) B.faceGlyphs(ctx, t, ang, [['form', .78, 1, undefined, 1], ['invoice', .5, 1, undefined, 1], ['calendar', .22, 1, undefined, 1]], { size: 80 });
        if (n === 7) {
          no7Face(ctx, t, T, ang);
          if (gl > 0) { const q = n7GlyphPt(ang, 0); halo(ctx, q[0], q[1], 90 + 260 * gl, .65 * gl, P.halo1, P.core0); }
        }
      },
    });
  }

  // ------------------------------------------------------------------ the studio
  // beads: ANIMATION (2) already holds its first part (J2) and runs on "Images"; MUSIC (0), SOUND (1), SHOOT (4) drop in on their
  // words; EDIT (3) drops in on "Even the edit", stops halfway and hesitates, runs through in J3b. After its sweep a bead wraps to
  // the lane start and eases into the kit's own loop (F.studio), so the plate takes over without a jump.
  const SW = 1.45;
  const take = { 2: a.images + .05, 0: a.music + .05, 1: a.sound + .05, 4: a.shots + .05, 3: a.edit + .1 };
  const e3a = take[3] + 1.5;                                          // EDIT reaches half
  const s3 = Math.max(J3b.start + .3, e3a + 1), te3 = Math.min(s3 + 2.8, tP - 3.4);
  const tEnd = { 2: take[2] + SW, 0: take[0] + SW, 1: take[1] + SW, 4: take[4] + SW, 3: te3 };
  const taken = (i, t) => {
    if (i === 2) return .3 + .7 * span(t, take[2], tEnd[2]);
    if (i === 3) return t < s3 ? .5 * sineIO(span(t, take[3], e3a)) : .5 + .5 * sineIO(span(t, s3, te3));
    if (i in take) return span(t, take[i], tEnd[i]);
    return 0;
  };
  const kitLoop = (i, t) => frac(t / per(i) + i * .37);
  function bead(ctx, t, i) {
    if (!(i in take)) return;
    const ly = F.laneMid(i), x0 = LN.x0 + 16, xl = LL - 32;
    let x, y = ly, al = 1;
    if (t >= tEnd[i]) {                                                // after the sweep: wrap, then ease into the kit's loop
      const te = tEnd[i], kap = kitLoop(i, te);
      const m = frac(t / per(i) + i * .37 - kap * (1 - smooth(span(t, te, te + 3))));
      x = x0 + xl * m; al = Math.min(1, Math.sin(Math.PI * m) * 6);
    } else if (i === 2) {
      const pos = sineIO(taken(2, t)); x = x0 + xl * pos;
      if (t < take[2]) x += 10 * Math.sin(t * 1.3);                   // still working its first part (J2)
      if (pos > .5) al = Math.min(1, Math.sin(Math.PI * pos) * 6);
    } else {
      const d = span(t, take[i] - .55, take[i]);
      if (d <= 0) return;
      if (d < 1) {                                                     // drops from the dark above the wall onto the lane start
        const v = sineIO(d); x = lerp(x0 + 150, x0, v); y = lerp(ly - 330, ly, v) - Math.sin(Math.PI * v) * 50; al = smooth(Math.min(1, d * 3));
      } else {
        const pos = sineIO(taken(i, t)); x = x0 + xl * pos;
        if (i === 3) {                                                 // hesitates at half
          const env = smooth(span(t, e3a - .2, e3a + .5)) * (1 - smooth(span(t, s3 - .5, s3)));
          x -= 16 * env * Math.sin(2 * Math.PI * (t - e3a) / 1.7);
        }
        if (pos > .5) al = Math.min(1, Math.sin(Math.PI * pos) * 6);
      }
    }
    if (al > 0) F.agent(ctx, t, x, y, 9, { a: al, ring: .8, think: i === 3 && t > e3a && t < s3 ? .6 : 0 });
  }

  // camera: out of the ANIMATION header glyph, along the takes, with Jakob up the ladder, onto the plate's creep line
  const hg = [HD.x0 + 34, F.laneMid(2)];
  const lvl = (t) => span(t, J3.start + .8, J3.start + 9.4);
  const KS = [[tp + 1.4, C(1150, 650, 1.3)], [a.shots + .4, C(1340, 660, 1.16)], [a.edit + 1.6, C(1400, 620, 1.14)],
    [J3.start + 1.2, C(1080, 650, 1.04)], [J3.start + 3.6, C(800, 660, 1.0)], [J3.start + 6.6, C(1000, 560, 1.06)],
    [J3.start + 9.6, C(1110, 470, 1.12)], [J3b.start + .2, C(1150, 500, 1.06)], [J3b.start + 2.6, C(1260, 560, 1.02)]];
  const creepLine = (t) => C(960 + S.TRUCK * (t - tP), 540, 1 + S.CREEP * (t - tP));
  const wS = (t) => sineIO(span(t, Math.min(KS[KS.length - 1][0], tP - 3.2), tP - .35));
  const camStudio = (t) => {
    if (t < tp + 1.4) return E.camAt(t, [[tp, E.aim(F0, hg[0], hg[1], 18)], [tp + 1.4, KS[0][1], 'o']]);
    const w = wS(t), p = F.camPath(t, KS);
    return w > 0 ? lerpCam(p, creepLine(t), w) : p;
  };
  function room(ctx, t) {
    const w = wS(t), c = E.camDrift(camStudio(t), t, .6 * (1 - w), 7);
    const tk = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => taken(i, t));
    const lampA = lerp(1, .35, smooth(span(t, J3.start + 3, J3.start + 8.5)));
    F.studio(ctx, c, t, { taken: tk, part: [0, 0, .3, 0, 0, 0, 0, 0, 0], level: lvl(t), work: 1, beads: 0, lampA });
    E.card(ctx, c, F0, () => {
      const ex = 1 - smooth(span(t, tp, tp + 1.6));                   // the light we came out of
      if (ex > 0) halo(ctx, hg[0], hg[1], 120 + 300 * ex, .7 * ex, P.halo1, P.core0);
      for (const i of [0, 1, 2, 3, 4]) bead(ctx, t, i);
    });
  }

  return (ctx, t) => {
    if (t >= tP) { S.plateStudio(ctx, t, T); return; }
    const inStudio = t >= tp;
    if (inStudio) room(ctx, t); else rankPart(ctx, t);
    F.rankTitle(ctx, t, 110, 330, 7, 'CREATIVE HANDWORK', rise(span(t, a.n7 + .1, a.n7 + .9)) * (1 - expoIn(span(t, tp - .6, tp))), { size: 120 });
    F.rankRail(ctx, t, T, { a: 1 - smooth(span(t, tP - 2.4, tP - .9)) });
    if (inStudio) { F.lowerThird(ctx, t, T, 'J3', { y: 170 }); F.lowerThird(ctx, t, T, 'J3b', { y: 170 }); }
    const fl = t < tp ? smooth(span(t, tp - 1.4, tp)) : 1 - smooth(span(t, tp, tp + 1.4));
    E.lightFlood(ctx, fl);
  };
}
