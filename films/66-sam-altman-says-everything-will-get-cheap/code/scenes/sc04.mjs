// c04 · STATION 2 · EDUCATION · the college · the AI tutor (more than double the learning gains) · tuition $12,290 +2.9 % · the
// certificate only the university prints · the tag splits ★ (KNOWLEDGE falls · DIPLOMA stays) · subscribe 1 (the land's windows warm,
// "for everybody") → plateFactory.
// "Education. It's on his list" → 'So far, every price' · B1 (20.11.). Plan: docs/shots.md 3.01–3.05, M.01, M.02.
// Part of the B1 take: the picture is b1(T).draw from scenes/sc02.mjs; this file adds the c04 layers and anchors. The last .5 s is the
// seam plate S.plateFactory (b1 draws it); the camera lands on FACTORY_CAM with the plate's creep 2.6 s before it.
//
// | ID    | anchor (phrase)              | picture (one idea)                                                                    | camera / carrier      |
// |-------|------------------------------|---------------------------------------------------------------------------------------|-----------------------|
// | 3.01  | Education. It's on his list  | station 2: the college (the dust arrives in its windows); tag 2 lights: EDUCATION     | glide in · the window |
// | 3.02  | In some studies              | an arched window grows big: a student, a small cool tutor light · MORE THAN DOUBLE …  | creep · the arch      |
// | 3.03  | So a degree should           | the arch goes back; push to tag 2: $12,290 writes on it, it rises · +2.9 %             | push in · the tag     |
// | 3.04  | Because a big part           | a rolled certificate with a seal of light rises out of the roof by the cupola          | creep · the scroll    |
// | 3.05★ | So the second tag splits     | tag 2 tears: KNOWLEDGE (left half drops, cool) · DIPLOMA (stays; the certificate flies into it) | creep · the halves |
// | M.01  | This channel exists          | rise and pull back: the windows of the land warm ("for everybody")                     | pull back · windows   |
// | M.02  | Including the people / Want  | the glide right ends over the factory (its robot arms: the work that gets cheap) → plateFactory | glide right · plate |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f66_kit.mjs';
import * as S from '../lib/f66_world.mjs';
const { P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, smooth, mixHex, halo } = E;
const { rise, GOLD, COOL, LAMP, PAPER } = F;

export default async (T, R) => { const { b1 } = await import('./sc02.mjs'); E.prepareEditorial(); return [{ t: R.a, draw: b1(T).draw, print: F.PRINT66 }]; };

export function anchors04(T, a) {
  const G = (p, after) => T.G(p, 0, after);
  a.edu = G("Education. It's on his list", a.climbing);
  a.studies = G('In some studies', a.edu); a.learn = G('learn more than', a.studies); a.costsNothing = G('costs almost nothing', a.studies);
  a.degree = G('So a degree should', a.costsNothing); a.isnt = G("Its price tag isn't", a.degree); a.thisFall = G('This fall, the sticker', a.isnt); a.upAgain = G('went up again', a.thisFall);
  a.because = G('Because a big part', a.upAgain); a.cert = G("It's the certificate", a.because); a.print = G('can print it', a.cert);
  a.splits = G('So the second tag splits', a.print); a.kn = G('The knowledge is nearly free', a.splits); a.dip = G('The diploma is not', a.kn);
  a.channel = G('This channel exists', a.dip); a.everybody = G('for everybody', a.channel); a.including = G('Including the people', a.channel);
  a.want = G('Want that too', a.including);
}

// land card px
const COL = { x0: S.STATIONS[1].x - 260, x1: S.STATIONS[1].x + 260, top: S.GY - 250 };
const ARCH0 = { x: COL.x0 + 40, y: COL.top + 52, w: 36, h: S.GY - 40 - (COL.top + 52) };   // the college's first arched window
const roofY = (x) => COL.top - 90 * (1 - Math.abs(x - S.STATIONS[1].x) / (S.STATIONS[1].x - COL.x0 + 20));
const ST2 = (dx = 0, s = 1.9) => E.aim(S.Z_LAND, 2050 + dx, 640, s, 1250, 540);
const TAG2 = (s = 2.3, sx = 900, dv = 0) => E.aim(S.Z_LAND, 2050, 560 + dv, s, sx, 520);
const CERT = { x: 1885, y: 520, w: 120 };

export function layers04(a, T) {
  const archM = (t) => sineIO(span(t, a.studies - .25, a.studies + 1.75)) * (1 - sineIO(span(t, a.degree - .35, a.degree + 1.6)));
  const veil = (t) => .45 * smooth(span(t, a.studies - .1, a.studies + 1.2)) * (1 - smooth(span(t, a.degree, a.degree + 1.5)));
  const gainU = (t) => span(t, a.learn - .15, a.learn + .7) * (1 - span(t, a.degree - .3, a.degree + .1));
  const labU = (t) => span(t, a.upAgain - .2, a.upAgain + .7) * (1 - span(t, a.because + .2, a.because + .6));
  const certU = (t) => span(t, a.cert - .2, a.cert + 1.1), certGo = (t) => sineIO(span(t, a.dip - .35, a.dip + 1.1));
  const knU = (t) => span(t, a.kn - .05, a.kn + .6) * (1 - span(t, a.channel + .2, a.channel + .6));
  const dipU = (t) => span(t, a.dip - .05, a.dip + .6) * (1 - span(t, a.channel + .3, a.channel + .7));
  const city = (t) => sineIO(span(t, a.channel + .8, a.everybody + .8)) * (1 - sineIO(span(t, a.want - .4, a.out - .8)));

  function archInside(ctx, t, x, y, w, h, m) {   // the arched window: lamp light when small; inside, the student and the tutor light
    const path = () => { ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x, y + w / 2); ctx.arc(x + w / 2, y + w / 2, w / 2, Math.PI, 0); ctx.lineTo(x + w, y + h); ctx.closePath(); };
    ctx.save(); path(); ctx.clip();
    ctx.fillStyle = E.lin(ctx, 0, y, 0, y + h, [[0, mixHex(LAMP.body, LAMP.deep, .2 + .55 * m)], [1, mixHex(LAMP.deep, P.night1, .2 + .5 * m)]]); ctx.fillRect(x, y, w, h);
    const iu = span(m, .35, .85);
    if (iu > 0) {
      ctx.globalAlpha *= iu;
      const fy = y + h * .86;
      halo(ctx, x + w * .35, y + h * .3, w * .7, .25, GOLD.halo, LAMP.core);
      ctx.fillStyle = mixHex(P.night0, P.ind1, .35); ctx.fillRect(x, fy, w, h * .2);
      ctx.fillStyle = mixHex(P.night0, P.ind1, .5); ctx.fillRect(x + w * .3, y + h * .64, w * .62, h * .03); ctx.fillRect(x + w * .36, y + h * .67, w * .03, h * .19); ctx.fillRect(x + w * .84, y + h * .67, w * .03, h * .19);
      ctx.fillStyle = PAPER.body; ctx.fillRect(x + w * .44, y + h * .615, w * .12, h * .025);   // the open book
      E.person(ctx, x + w * .3, fy, h * .44, { dir: 1, light: .7, lean: .12 + .03 * Math.sin(t * .6), look: -.15, armR: [1.3, 1.9] });
      // the tutor: a small cool light (the machine as a circle, rings pulse inward)
      const tx = x + w * .7, ty = y + h * .56, r0 = w * .045;
      halo(ctx, tx, ty, w * .3, .55, COOL.halo, COOL.core);
      for (let i = 0; i < 3; i++) { const ph = (t * .45 + i / 3) % 1; ctx.strokeStyle = rgba(COOL.line, .6 * Math.sin(Math.PI * ph)); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(tx, ty, r0 + w * .12 * (1 - ph), 0, Math.PI * 2); ctx.stroke(); }
      ctx.fillStyle = COOL.core; ctx.beginPath(); ctx.arc(tx, ty, r0, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha /= iu;
    }
    ctx.restore();
    ctx.strokeStyle = rgba(mixHex(P.night0, P.ind1, .3), .9 * m); ctx.lineWidth = lerp(1, 10, m); path(); ctx.stroke();   // the window frame
    if (m > .4) { ctx.strokeStyle = rgba(mixHex(P.night0, P.ind1, .3), .8 * span(m, .4, 1)); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h * .4); ctx.stroke(); }
  }
  function certificate(ctx, t) {   // land card px: a rolled certificate with a seal of light; rises out of the roof, flies into the DIPLOMA half
    const u = certU(t); if (u <= 0) return;
    const go = certGo(t); if (go >= 1) return;
    const ry = roofY(CERT.x), y0 = lerp(ry + 50, CERT.y, expoOut(u));
    const tx = S.STATIONS[1].x + 34, ty = S.TAG_Y + 95, x = lerp(CERT.x, tx, go), y = lerp(y0, ty, go) - 90 * Math.sin(Math.PI * go), sc = lerp(1, .22, go * go);
    ctx.save();
    if (go <= 0) { ctx.beginPath(); ctx.moveTo(COL.x0 - 400, ry - 4000); ctx.lineTo(COL.x1 + 400, ry - 4000); ctx.lineTo(COL.x1 + 400, roofY(COL.x1)); ctx.lineTo(S.STATIONS[1].x, roofY(S.STATIONS[1].x)); ctx.lineTo(COL.x0 - 20, roofY(COL.x0 - 20)); ctx.lineTo(COL.x0 - 400, roofY(COL.x0 - 20)); ctx.closePath(); ctx.clip(); }
    ctx.translate(x, y); ctx.rotate(-.06 + .03 * Math.sin(t * .8) + go * .5); ctx.scale(sc, sc); ctx.globalAlpha *= 1 - span(go, .8, 1);
    const w = CERT.w, h = 36;
    ctx.fillStyle = E.lin(ctx, 0, -h / 2, 0, h / 2, [[0, PAPER.lit], [1, PAPER.shade]]); ctx.fillRect(-w / 2, -h / 2, w, h);
    for (const sd of [-1, 1]) { ctx.fillStyle = mixHex(PAPER.body, PAPER.edge, .3); ctx.beginPath(); ctx.ellipse(sd * w / 2, 0, 7, h / 2 + 3, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = PAPER.edge; ctx.beginPath(); ctx.ellipse(sd * w / 2, 0, 3, h / 2 - 4, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = rgba(PAPER.faint, .6); for (let i = 0; i < 3; i++) ctx.fillRect(-w * .36, -h * .25 + i * 8, w * (.42 - i * .08), 2.2);
    const sg = .55 + .45 * F.bump(t, a.print - .15, 1.3);
    halo(ctx, w * .26, h * .12, 46 * sg, .7 * sg, GOLD.halo, GOLD.core);
    ctx.fillStyle = mixHex(GOLD.body, GOLD.core, sg * .6); ctx.beginPath(); ctx.arc(w * .26, h * .12, 11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = GOLD.mid; ctx.fillRect(w * .26 - 7, h * .12 + 8, 4, 14); ctx.fillRect(w * .26 + 3, h * .12 + 8, 4, 12);
    ctx.restore();
  }

  return {
    camKeys: [
      [a.climbing + .45, ST2(0)], [a.studies + 2.2, ST2(8, 1.91)], [a.degree - .2, ST2(14, 1.92)],
      [a.degree + 2.0, TAG2(2.3)], [a.because - .1, TAG2(2.33, 905)], [a.cert + .5, TAG2(2.2, 920, -10)],
      [a.splits - .25, TAG2(2.24, 930, -10)], [a.splits + 1.8, TAG2(2.3, 960, -6)], [a.channel - .15, TAG2(2.34, 960, -6)],
      [a.channel + 3.4, E.aim(S.Z_LAND, 1900, 560, .52, 960, 650)], [a.including - .5, E.aim(S.Z_LAND, 1980, 556, .54, 960, 650)],
    ],
    veil,
    city,
    tags(tags, t) {
      const g = tags[1];
      if (g) {
        const lit = span(t, a.edu - .3, a.edu + .9), e = sineIO(span(t, a.splits - .1, a.splits + 1.6));
        g.glow = lerp(Math.max(g.glow, lerp(.35, 1, lit)), .6, e);
        g.dy += (-12 * sineIO(span(t, a.climbing - .1, a.climbing + 1.3)) - 16 * sineIO(span(t, a.upAgain - .25, a.upAgain + 1.2))) * (1 - e);
        g.split = .85 * e;
        g.swing = (g.swing ?? 0) + .06 * F.bump(t, a.splits - .05, 1.3) * Math.sin(t * 6);
        const gone = 1 - span(t, a.splits + .05, a.splits + .35);
        g.lines = [['EDUCATION', 15, 0, false]]; g.textU = span(t, a.edu - .1, a.edu + .6) * gone;
        g.price = '$12,290'; g.priceU = span(t, a.isnt + .1, a.isnt + .9) * gone; g.priceSize = 26;
      }
      const g3 = tags[2]; if (g3) g3.glow = lerp(g3.glow, .3, span(t, a.channel, a.out - 1));
    },
    land(ctx, t) {
      certificate(ctx, t);
      const cw = city(t);   // M.01 "for everybody": a warm breath of window light along the whole land (left → right with the windows)
      if (cw > 0) for (let i = 0; i < 9; i++) { const x = -1200 + i * 1000, w = clamp(cw * 1.5 - i * .06); if (w > 0) halo(ctx, x, S.GY - 120, 900, .16 * w, GOLD.halo, LAMP.core); }
    },
    screen(ctx, t, c) {
      if (t < a.studies - .5 || t > a.channel + 1.5) return;
      // 3.02 the arched window grows out of the college's first window
      const m = archM(t);
      if (m > 0) {
        const p0 = E.project(c, S.Z_LAND, ARCH0.x, ARCH0.y), p1 = E.project(c, S.Z_LAND, ARCH0.x + ARCH0.w, ARCH0.y + ARCH0.h);
        if (p0 && p1) {
          const B = { x: 120, y: 150, w: 560, h: 700 };
          ctx.save(); F.float(ctx, t, .4 * m);
          archInside(ctx, t, lerp(p0[0], B.x, m), lerp(p0[1], B.y, m), lerp(p1[0] - p0[0], B.w, m), lerp(p1[1] - p0[1], B.h, m), m);
          ctx.restore();
        }
      }
      const gu = gainU(t);
      if (gu > 0) {
        ctx.save(); F.float(ctx, t, .5);
        F.goldText(ctx, [['MORE THAN DOUBLE', .35]], 760, 590, 70, rise(gu), { serif: true, glow: true });
        F.goldText(ctx, [['THE LEARNING GAINS', .35]], 760, 672, 70, rise(span(gu, .15, 1)), { serif: true, glow: true });
        ctx.restore();
      }
      // 3.03 +2.9 % beside tag 2 (screen px from the tag's place on the land)
      const lu = labU(t);
      if (lu > 0) {
        const p = E.project(c, S.Z_LAND, S.STATIONS[1].x + 74, S.TAG_Y + 70); if (p) {
          const q = [p[0] + 70, p[1] - 50];
          F.goldSpan(ctx, [[p[0], p[1]], q], 0, smooth(clamp(lu * 1.6)), { w: 1.6, spark: false });
          F.maskLine(ctx, [[F.SOURCES.tuition, 0]], q[0] + 14, q[1] - 6, 24, rise(span(lu, .2, 1)), { serif: false, weight: 700, col: P.cream, glow: false });
          F.goldText(ctx, [['+2.9 %', 1]], q[0] + 12, q[1] + 66, 66, rise(span(lu, .3, 1)), { serif: true, glow: true });
        }
      }
      // 3.05 the two halves named
      const ku = knU(t), du = dipU(t);
      if (ku > 0) { const p = E.project(c, S.Z_LAND, S.STATIONS[1].x - 30, S.TAG_Y + 250); if (p) F.maskLine(ctx, [['KNOWLEDGE', 0]], p[0], p[1], 34, rise(ku), { serif: false, weight: 700, col: COOL.text, glow: false, align: 'right' }); }
      if (du > 0) { const p = E.project(c, S.Z_LAND, S.STATIONS[1].x + 74, S.TAG_Y + 120); if (p) F.goldText(ctx, [['DIPLOMA', 1]], p[0], p[1], 34, rise(du), { serif: false, weight: 700, spacing: .06 }); }
    },
    sources(ctx, t) {
      F.source(ctx, t, a.learn - .1, a.degree - .2, F.SOURCES.tutorSrc);
      F.source(ctx, t, a.upAgain - .1, a.because + .4, F.SOURCES.tuitionSrc);
    },
  };
}
