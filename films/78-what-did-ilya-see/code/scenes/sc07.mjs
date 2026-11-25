// Film 78 · c07 (B2) · 'That is why this channel exists' (348.85) → 'Six months after that famous Friday' (380.71) · ONE continuous take.
// Receives S.plateRecord for [T0, T0 + .5) exactly (drawn by the plate itself), then grows out of it:
//   M.01  subscribe 1: the camera keeps creeping toward you at the end of HIS LIFE LINE; a row of rooftops rises on the horizon and its
//         windows light up from you outward ("goes well for everybody", "not just for the people who build it"); warm light round you,
//         a calm cream ring SUBSCRIBE draws itself (no QR)                                                          carrier: the dawn
//   6.01  you turn and walk to where the dawn is: the gold LINE rises out of it, BEFORE | AFTER, the day rising on the AFTER side
//   6.02  the camera travels on along the rooftops: a university rises out of them, OPEN UNIVERSITY OF ISRAEL; a schoolboy with books
//         goes in (AS A SCHOOLBOY); in its arched window Ilya at a lectern, sound rings (he asked it himself, 2025)  carrier: the window
//   6.03  fly through the window: a sound ring turns into a machine ring; it builds a second ring, which builds a third (GEN 1 · 2 · 3)
//   6.04  ★ "the intelligence explosion": the rings cascade outward until they fill the sky; QUOTE CARD C4 (not a clip) unfolds in front
//   6.05  "what do you do about that?" lights gold on the card
//   6.06  the camera tilts down out of the sky (the rings stay up there): the card folds into a window of the tower; the man stands at
//         its foot, the tower of light ahead (Leitbild A2 starts, lib/b2_seams.mjs leitA2 → c08)
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f78_kit.mjs';
import * as S from '../lib/f78_world.mjs';
import * as B from '../lib/b2_kit.mjs';
import { leitA2 } from '../lib/b2_seams.mjs';
import { createCanvas } from '@napi-rs/canvas';
const { W, H, P, clamp, lerp, span, sineIO, expoOut, expoIn, rgba, halo, mixHex } = E;
const { mv, land, rise, GOLD, CREAM, CREAM2, COOL } = F;
const TAU = Math.PI * 2;

export default (T, R) => {
  const G = (p, n = 0, a = -1) => T.G(p, n, a);
  const T0 = G('That is why this channel exists'), tP = T0 + S.SEAM_HALF;
  const tSoThat = G('so that the arrival', 0, T0), tEvery = G('goes well for everybody', 0, T0), tNotJust = G('Not just for the people', 0, T0);
  const tWant = G('Want that too', 0, T0), tSub = G('Then subscribe', 0, T0);
  const tWhat = G('So what do you do if you believe'), tDay = G('that day is coming', 0, tWhat);
  const tAsked = G('Ilya has asked that himself'), tUni = G('at the university where', 0, tAsked), tSchool = G('as a schoolboy', 0, tAsked);
  const tPic = G('Picture an AI'), tNext = G('the next generation of', 0, tPic), tGen3 = T.GE('next generation of AI', 0, tPic) - .25;
  const tExpl = G('The intelligence explosion'), tCalled = G('he called it', 0, tExpl), tWhatDo = G('What do you do about that', 0, tExpl);
  const A2 = leitA2(T), ts = A2.ts, tByThen = A2.tByThen;

  // ---------------------------------------------------------------------------------------------- the record space (the plate's layout)
  const RC = S.RECORD, YOU = { x: RC.x1 + 40, y: RC.y + 4, h: 92 };
  const LINE_X = 1700, LINE_Y0 = 250, LINE_Y1 = 760, SUN = { x: 2010, y: RC.y + 4 };
  const ROOF_BASE = 905;
  const UNI = { x: 2760, base: ROOF_BASE, w: 780, h: 480 };
  const uniGeo = B.university(null, 0, UNI.x, UNI.base, UNI.w, UNI.h, { rise: 0, winW: .27, winH: .5 });
  const FLY = { x: uniGeo.win.cx, y: uniGeo.win.cy - uniGeo.win.h * .3 };
  // the creep of the plate, continued (velocity continuity at tP), then my path
  const creepCam = (t) => { const k = 1 + S.CREEP * (t - (T0 - S.SEAM_HALF)); return { x: W / 2 + S.trk(k) * .5, y: H / 2, s: k }; };
  const KR = [
    [tP, creepCam(tP)], [tEvery + .5, { x: 1330, y: 590, s: 1.3 }], [tSub + .7, { x: 1395, y: 596, s: 1.4 }],
    [tWhat + .3, { x: 1430, y: 590, s: 1.36 }], [tDay + .5, { x: 1690, y: 575, s: 1.16 }],
    [tAsked + .15, { x: 1760, y: 590, s: 1.12 }], [tAsked + 1.15, { x: 2250, y: 640, s: .9 }], [tUni + 1.0, { x: 2690, y: 640, s: 1.15 }],
    [tPic - .5, { x: FLY.x - 30, y: FLY.y + 40, s: 1.07 }], [ts, { x: FLY.x, y: FLY.y, s: 16 }],
  ];
  const camRraw = (t) => B.lerpC(creepCam(t), S.camPath2(t, KR), sineIO(span(t, tP, tP + 2.2)));
  const camR = (t) => S.drift2(camRraw(t), t, .7 * span(t, tP, tP + 2.5) * (1 - span(t, tPic - .6, tPic)), 31);
  // the stage camera: the record camera muted (parallax), turning into the sky camera of the Leitbild during the fly
  const mute = (c) => ({ x: W / 2 + (c.x - W / 2) * .55, y: H / 2 + (c.y - H / 2) * .55, s: Math.exp(Math.log(c.s) * .35) });
  const stageCam = (t) => {
    if (t >= ts) return A2.cam(t);
    const m = t < tP + 2.2 ? B.lerpC(creepCam(t), mute(camRraw(t)), sineIO(span(t, tP, tP + 2.2))) : mute(camRraw(t));
    return B.lerpC(m, A2.cam(ts), sineIO(span(t, tPic - .6, ts)));
  };
  const dawnAt = (t) => lerp(.35, .62, mv(t, tSoThat, 4)) * (1 - .55 * mv(t, tAsked, 2.2)) * (1 - span(t, tPic, ts));

  // ---------------------------------------------------------------------------------------------- the sky space (Leitbild coordinates)
  const SKY = (sx, sy) => ({ x: sx + 40, y: sy - 1060 });                 // screen point at the sky camera {1000, -520, 1} → design
  const RINGS = [{ ...SKY(520, 660), r: 84, t: tPic }, { ...SKY(860, 540), r: 128, t: tNext }, { ...SKY(1310, 420), r: 190, t: tGen3 }];
  const CASC = (() => { const a = [], r = E.prng(707); for (let k = 0; k < 34; k++) { const an = -2.2 + k * 2.39996, d = 170 + k * 34 + r() * 40; const rr = 50 + k * 9 + r() * 30; a.push({ dx: Math.cos(an) * d * 1.35, dy: Math.min(Math.sin(an) * d * .8, 470 - rr * 1.25), r: rr, born: tExpl - .3 + k * .05, from: k ? k - 1 : -1, q: r() }); } return a; })();
  const CC = SKY(960, 470);   // the cascade's centre
  const card = { x: SKY(960, 0).x - 650, y: SKY(0, 230).y, w: 1300 }; 
  const C4 = F.SOURCES.c4, cardTimes = B.litTimes(T, C4.text.split(/\s+/).length, [[12, 'The intelligence explosion', null, tPic], [17, 'What do you do about that', null, tExpl]]);
  const cardH = B.qcard(createCanvas(8, 8).getContext('2d'), 0, { ...card, text: C4.text, size: 56, u: 1, times: cardTimes, inkAll: true, head: 'IN HIS WORDS', credit: C4.credit }).h;
  // the ring 1 hand-over at the fly (record space → sky space): same screen point and radius at ts
  const r1Design = (t) => 20 * expoOut(span(t, tPic - .35, tPic + .9));
  const r1Hand = (() => { const c = camR(ts), [sx, sy] = S.toScreen(c, FLY.x, FLY.y), sc = A2.cam(ts); return { x: sc.x + (sx - W / 2) / sc.s, y: sc.y + (sy - H / 2) / sc.s, r: r1Design(ts) * c.s / sc.s }; })();

  const lift = () => 0;   // (the cascade stays above y −100: the tilt leaves it in the sky)
  const draw = (ctx, t) => {
    const sc = stageCam(t);
    S.stage(ctx, t, sc, { dawn: t < ts ? dawnAt(t) : .12 * mv(t, tByThen, 2.6) });

    // ===================================================================================== record space: M.01 · 6.01 · 6.02 · the fly
    if (t < ts) {
      const c = camR(t); S.view(ctx, c);
      // the rooftops rise on the horizon; their windows light from you outward
      const wave = (x) => { const rr = 2400 * sineIO(span(t, tSoThat + .2, tNotJust + 1.6)); return clamp((rr - Math.abs(x - YOU.x)) / 260); };
      const rr = mv(t, tP + .2, 2.2);
      if (rr > 0) B.rooftops(ctx, t, -300, ROOF_BASE, { rise: rr, wave, len: 4400 });
      // HIS LIFE LINE exactly as the plate draws it (you drawn separately below)
      const dw = 1 - mv(t, tWhat + .2, 1.6);
      F.lifeLine(ctx, t, RC.x0, RC.x1, RC.y, { u: 1, years: RC.years, markers: S.RECORD_MARKERS(), knot: 1, knotF: .95, you: 0, dawn: dw });
      // the ground beyond the line's end (you walk on it to the LINE), the day rising on the AFTER side
      const gu = mv(t, tWhat - .2, 1.6);
      if (gu > 0) F.goldSpan(ctx, [[RC.x1, RC.y + 4], [RC.x1 + 1100, RC.y + 4]], 0, gu, { w: 1.2, spark: false, a: .5 });
      const lineU = mv(t, tWhat + .3, 1.3);
      if (lineU > 0) {
        halo(ctx, LINE_X, LINE_Y1, 260 * lineU, .3, GOLD.halo, GOLD.core);
        F.goldSpan(ctx, [[LINE_X, LINE_Y1], [LINE_X, LINE_Y0]], 0, lineU, { w: 2.6 });
        const lb = rise(span(t, tWhat + 1.2, tWhat + 2));
        F.goldText(ctx, [['BEFORE', .3]], LINE_X - 30, LINE_Y0 + 40, 30, lb, { serif: false, weight: 700, spacing: .12, align: 'right' });
        F.goldText(ctx, [['AFTER', .3]], LINE_X + 30, LINE_Y0 + 40, 30, rise(span(t, tWhat + 1.4, tWhat + 2.2)), { serif: false, weight: 700, spacing: .12, col: CREAM });
        const su = mv(t, tDay - .1, 1.9);
        B.sunrise(ctx, SUN.x, SUN.y, 46, su);
        if (su > 0) F.goldText(ctx, [['THAT DAY', 0]], SUN.x, SUN.y - 92, 24, rise(span(t, tDay + .4, tDay + 1.2)), { serif: false, weight: 700, spacing: .14, align: 'center', col: CREAM });
      }
      // the university rises out of the rooftops; the boy goes in; Ilya at the lectern in the window
      const ur = mv(t, tAsked + .5, 1.9);
      let geo = uniGeo;
      if (ur > 0) {
        const flyK = span(c.s, 1.6, 7);
        geo = B.university(ctx, t, UNI.x, UNI.base, UNI.w, UNI.h, { rise: ur, lit: .4 + .6 * span(t, tAsked + 1.2, tAsked + 2.6), winW: .27, winH: .5, winGlow: 1 - flyK, winFill: 1 - span(c.s, 1.5, 4), archA: 1 - span(c.s, 4.5, 9),
          sign: span(t, tAsked + 1.6, tAsked + 2.4), signText: 'OPEN UNIVERSITY OF ISRAEL', inside: span(t, tAsked + 1.8, tAsked + 2.8) * (1 - span(c.s, 2.5, 6)), rings: .9 * span(t, tAsked + 2.2, tAsked + 3) * (1 - span(t, tPic - .2, tPic + .4)) });
        // the schoolboy with his books walks to the door and in
        const b0 = tUni - .3, b1 = tSchool + 1.0, bp = span(t, b0, b1), bx = lerp(UNI.x - 700, geo.door.x + geo.door.w * .5, sineIO(bp) * .85 + bp * .15);
        if (bp > 0 && bp < 1) {
          const inDoor = span(bp, .88, 1);
          ctx.save(); if (inDoor > 0) { ctx.beginPath(); ctx.rect(bx - 200, UNI.base - 400, 200 + (geo.door.x + 8 - bx) + 200 * (1 - inDoor), 420); ctx.clip(); }
          B.schoolboy(ctx, t, bx, UNI.base - 2, 185, { walk: (t - b0) * 6.2, a: rise(span(bp, 0, .1)) });
          ctx.restore();
        }
        const lb = rise(span(t, tSchool - .2, tSchool + .5)) * (1 - span(t, tPic - .6, tPic));
        if (lb > 0) F.goldLabel(ctx, lerp(UNI.x - 700, geo.door.x, .7), UNI.base - 205, 'AS A SCHOOLBOY', null, lb, { dx: -40, dy: -80, size: 30 });
      }
      // ring 1 is born in the window as we fly through it
      const r1 = r1Design(t);
      if (r1 > .5) F.ring(ctx, t, FLY.x, FLY.y, r1, { a: clamp(r1 / 6), think: .8 });
      // you: the plate's figure → looks along the line, the warm light, the subscribe ring → turns and walks to the LINE
      const walkP = span(t, tWhat + .15, tDay + .9), yx = lerp(YOU.x, LINE_X - 70, sineIO(walkP)), walking = walkP > 0 && walkP < 1;
      const warm = mv(t, tWant - .2, 1.2) * (1 - mv(t, tWhat, 1.4));
      if (warm > 0) halo(ctx, yx, YOU.y - 50, 170, .35 * warm, P.coat, P.core1);
      const yh = YOU.h * (1 + .35 * mv(t, tP, 3));
      if (t < tAsked + 2.4) E.du(ctx, yx, YOU.y, yh, { light: 1, dir: t < tWhat + .15 ? -1 : 1, look: walking ? .25 : (t < tWhat ? lerp(.5, .2, mv(t, tP, 2)) + .25 * warm : .45), walk: walking ? (t - tWhat) * 6.4 : undefined });
      const subU = mv(t, tSub - .1, 1.3) * (1 - mv(t, tWhat - .3, 1.2));
      if (subU > 0) B.subRing(ctx, t, YOU.x, YOU.y - yh * .5, yh * .82, subU, { size: 24 });
      // the dateTag for the university (screen space): his speech there, 2025
      const tg = rise(span(t, tAsked + 2.0, tAsked + 2.8)) * (1 - span(t, tPic - .5, tPic));
      if (tg > 0) { ctx.setTransform(1, 0, 0, 1, 0, 0); F.dateTag(ctx, 110, 150, 'HIS SPEECH THERE · 2025', tg, { size: 26 }); }
    }

    // ===================================================================================== sky space: the rings, ★ the explosion, the card
    if (t >= ts - .001 && t < tByThen + 3.2) {
      const c = A2.cam(t); S.view(ctx, c);
      ctx.translate(0, -lift(t));   // the rings stay up in the sky while the camera tilts down (far layer)
      const cardU = mv(t, tExpl + .15, .8), dim = 1 - .62 * span(t, tExpl + .2, tExpl + 1.1);
      // the cascade (★): each ring is born out of the one before and flies out to its place, growing
      for (const [k, Q] of CASC.entries()) {
        const b = span(t, Q.born, Q.born + .9); if (b <= 0) continue;
        const pr = k ? CASC[k - 1] : null, ox = pr ? CC.x + pr.dx : RINGS[2].x, oy = pr ? CC.y + pr.dy : RINGS[2].y;
        const e = expoOut(b), x = lerp(ox, CC.x + Q.dx, e), y = lerp(oy, CC.y + Q.dy, e), slow = 1 + .04 * (t - Q.born);
        F.ring(ctx, t, x, y, Q.r * lerp(.2, 1, e) * slow, { a: clamp(b * 4) * dim * (.55 + .45 * Q.q), think: 1 });
      }
      // the three generations (6.03)
      RINGS.forEach((Q, i) => {
        const b = expoOut(span(t, Q.t - .1, Q.t + .8)); if (i && b <= 0) return;
        let x = Q.x, y = Q.y, r = Q.r * (i ? lerp(.15, 1, b) : 1);
        if (i === 0) { const hp = sineIO(span(t, ts, ts + 1.3)); x = lerp(r1Hand.x, Q.x, hp); y = lerp(r1Hand.y, Q.y, hp); r = lerp(r1Hand.r, Q.r, hp); }
        else { const P0 = RINGS[i - 1]; x = lerp(P0.x, Q.x, b); y = lerp(P0.y, Q.y, b);
          F.goldSpan(ctx, [[P0.x, P0.y], [Q.x, Q.y]], 0, span(t, Q.t - .15, Q.t + .35), { w: 1.4, col: COOL, spark: true, a: .7 * dim }); }
        const sw = 1 + .1 * span(t, tExpl - .3, tExpl + 2.5);
        F.ring(ctx, t, x, y, r * sw, { a: (i ? clamp(b * 3) : 1) * lerp(1, .55, 1 - dim), think: .7 + .3 * span(t, tExpl - .3, tExpl + .4) });
        const lu = rise(span(t, Math.max(Q.t, ts) + .2, Math.max(Q.t, ts) + .8)) * (1 - span(t, tExpl - .4, tExpl));
        if (lu > 0) F.goldText(ctx, [[`GEN ${i + 1}`, 0]], x, y + r * sw + 44, 24, lu, { serif: false, weight: 700, spacing: .14, align: 'center', col: CREAM });
      });
      // the quote card C4 unfolds in front of the cascade; then (6.06) it folds into a window of the tower
      if (cardU > 0) {
        const fold = sineIO(span(t, tByThen + .25, tByThen + 2.55));
        if (fold <= 0) { const b = B.qcard(ctx, t, { ...card, text: C4.text, size: 56, u: cardU, times: cardTimes, inkAll: true, head: 'IN HIS WORDS', credit: C4.credit });
          // 6.05: the last words light gold (the lit underline is drawn by qcard as the words are spoken)
        }
      }
    }
    // ===================================================================================== 6.06 the Leitbild (A2): the tower, the man
    if (t >= tByThen + .2) {
      ctx.save(); const st = drawLeit(ctx, t); ctx.restore();
      // the card over the Leitbild while it folds in (drawn again on top, so it lands IN the tower)
      const fold = sineIO(span(t, tByThen + .25, tByThen + 2.55));
      if (fold > 0 && fold < 1) {
        S.view(ctx, A2.cam(t));
        const target = towerCell(), cr = { x: card.x, y: card.y - lift(t), w: card.w, h: cardH }, r = B.lerpR(cr, target, fold), k = r.w / card.w;
        ctx.save(); ctx.translate(r.x, r.y); ctx.scale(k, r.h / cr.h); ctx.translate(-card.x, -card.y);
        B.qcard(ctx, t, { ...card, text: C4.text, size: 56, u: 1, times: cardTimes, inkAll: true, head: 'IN HIS WORDS', credit: C4.credit });
        ctx.restore();
        ctx.fillStyle = rgba(GOLD.hot, .95 * span(fold, .35, 1)); ctx.fillRect(r.x, r.y, r.w, r.h);
      }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };
  // the Leitbild layer (only where the tilt has brought it into view)
  const drawLeit = (ctx, t) => A2.draw(ctx, t, { name: 0 });
  // the tower window cell the card folds into (tower geometry as F.tower lays it out: 5 cols, rows from the height)
  const towerCell = () => { const w = S.TOWER.w, h = S.TOWER.h, cols = 5, rows = Math.max(6, Math.round(h / (w / cols) / 1.25)), taper = w * .06, x0 = S.TOWER.x - w / 2, gw = (w - taper * 2) / cols, gh = (h * .9) / rows, top = S.GY - h;
    const c = 2, r = 6; return { x: x0 + taper + c * gw + gw * .14, y: top + h * .07 + r * gh + gh * .14, w: gw * .72, h: gh * .7 }; };

  return [{ t: T0, draw: (ctx, t) => S.plateRecord(ctx, t, T), print: F.PRINT78 }, { t: tP, draw, print: F.PRINT78 }];
};
