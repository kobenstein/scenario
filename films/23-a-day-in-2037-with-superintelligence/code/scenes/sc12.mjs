// c12 · Lead · 552.38 – 619.90 s · 22:30 · the call with Dad · the city goes to sleep · the year rolls back · subscribe line 2 · end screen
// (docs/shots.md 12.01–12.07). ONE continuous take out of plateNotebook (B3's seam), ending on the same notebook:
//   12.01 from plateNotebook (the HUD jumps to 22:30): pull back. Your kid asleep at the table, head on her arms; the black-hole
//         drawing and the pea beside the notebook; the lamp low; you at the counter, where the morning began (thumbnail A's spot).
//   12.02 'phone buzzes' the phone on the counter lights cool (the 1.03 rhyme); you take it; 'Your dad' the camera pulls out of the
//         kitchen and along the street to Dad's lit flat; a gold line joins the two windows.
//   12.03 the call: small lights travel the line. 'How big' a gold caliper over your building holds the spot; 'Really small' it closes
//         to a hair; 'every word' Dad's earbud glows. Carrier: you walk into the hallway.
//   12.04 the hallway window, the city behind: 'going to sleep' its windows go out one by one; 'night shift' the tower lights cool.
//   12.05 ★ the HUD year rolls back to 2026 (big); a timeline across the sky draws back from 2037 to 2026, 'ordinary days' lit windows
//         along it, 'people like you' a small yellow figure with a '?' at its 2026 end, 'who these machines were for' the line turns
//         gold all the way. SUBSCRIBE LINE 2 (593.9–599.3) sits in this same slow rise over the night city while lights go out
//         (the rhyme of line 1); the HUD's channel mark settles under the stamp (the big year sits lower: BIG_BACK, no overlap).
//   12.06 'Your twenty thirty-seven' the year rolls forward; the line folds into its 2037 end, a star; 'already started' it settles.
//   12.07 END SCREEN (604.0–619.9, no voice): the rise goes on, the last windows go out, the tower stays on (cool); ≈ 8 s in the camera
//         sinks down your building and through the kitchen's open front to the notebook in the moonlight ('Because people kept asking.',
//         the pea), slow push. Free areas for the end cards stay clear: left x 90–780 / right x 1140–1830 (y 250–700), centre
//         x 810–1110 (y 330–600); the notebook sits below y 720.
import * as E from '../lib/f10_editorial.mjs';
import * as K from '../lib/f23_kit.mjs';
import { plateNotebook, seamT, SEAM_HALF, CAM_NOTEBOOK, NOTEBOOK_WORLD, NOTEBOOK_STATE, notebookItem } from '../lib/f23_seams.mjs';
const { W, H, P, clamp, lerp, span, smooth, expoOut, expoIn, sineIO, rgba, mixHex, camAt, camDrift, halo, rad } = E;
const { ZS, ZB, KITCHEN, look, wp, atZ, COOL, WARM, STREET, floorY } = K;
const bump = K.bump;

export default (T, R) => {
  const G = (p, after = -1) => T.G(p, 0, after);
  const T0 = seamT(T, 'notebook'), tPl = T0 + SEAM_HALF, tEnd = R.b, VOE = T.endscreen ? T.endscreen.start - .5 : tEnd - 15.9;
  const tFell = G('fell asleep', T0), tInside = G('inside a black hole', T0), tBuzz = G('phone buzzes', T0), tDad = G('Your dad', T0);
  const tTell = G('tell me something', T0), tYouTell = G('You tell him', T0), tHow = G('How big', T0), tSmallD = G('Small, Dad', T0);
  const tReally = G('Really small', T0), tHears = G('He hears', T0), tEveryW = G('every word', T0), tHall = G('You stand in the hallway', T0);
  const tOutside = G('Outside', tHall), tSleep = G('going to sleep', T0), tNight = G('night shift is starting', T0);
  const tThis = G("This Tuesday didn't begin", T0), tBegan = G('It began years before', T0), tOrd = G('ordinary days', T0);
  const tPeople = G('people like you', T0), tWho = G('who these machines were for', T0), tSub = G('If you want a Tuesday', T0);
  const tFinal = G('Your twenty thirty-seven', tSub), tAlready = G('already started', tFinal);
  const tSink = VOE + 8;                                    // ≈ 8 s into the end screen

  // ---------------------------------------------------------------- places
  const KY = KITCHEN.floor, TB = KITCHEN.table, NB = NOTEBOOK_WORLD;
  const YOU = [-1700, KY, ZB - 120], HALLWIN = [-2395, KY, ZB - 70];
  const KIDP = [-1490, ZB - 172], PEA = [-1238, KY - 64.5, ZB - 162], BH = [-1176, ZB - 142];
  const DAD = [4760, floorY(3), ZB - 150], DADWIN = [4750, floorY(3) - 230, ZS], YOURWIN = [-1500, KY - 230, ZS];
  const CAL = [-1420, -2950];                                 // the caliper over your building (world, plane ZS)
  const PH = KITCHEN.phone;

  // ---------------------------------------------------------------- the camera (ref = the back wall)
  const KMED = look(-1455, KY - 118, ZB - 150, 2.5, 960, 560), KMED_IN = look(-1460, KY - 120, ZB - 150, 2.58, 960, 560);
  const WIDE = look(1900, -1650, ZS, .215, 960, 560), WIDE_IN = look(1700, -1650, ZS, .225, 960, 560);
  const HALLC = look(-1250, -2150, ZS, .3, 960, 560);
  const RISE0 = look(-3600, -2350, ZS, .29, 960, 640), RISE1 = look(-3900, -2350, ZS, .255, 960, 900), RISE2 = look(-4000, -2350, ZS, .235, 960, 1060);   // the tower right of the sky's timeline
  const END0 = look(NB.X, NB.Y, NB.Z, 8.4, 960, 800), END1 = look(NB.X + 2, NB.Y, NB.Z, 11.7, 960, 860);
  const KEYS = [
    [T0, CAM_NOTEBOOK], [tPl, CAM_NOTEBOOK],
    [tInside + .2, KMED, 'l'],               // 12.01: pull back out of the page (4.5 s)
    [tDad - .3, KMED_IN],
    [tYouTell + .3, WIDE, 'l'],              // 12.02: out of the kitchen and along the roofs to Dad's window (3.9 s)
    [tHears, WIDE_IN],
    [tSleep - .3, HALLC, 'l'],               // 12.03 → 12.04: to the hallway window and the city behind (6.9 s, slow)
    [tThis, RISE0],
    [VOE, RISE1, 's'],                        // 12.05 / 12.06: the long slow rise (subscribe line 2 inside it)
    [tSink - 1.2, RISE2, 's'],                // 12.07: the rise goes on
    [tSink + 4.6, END0, 'l'],                 // sink down the facade, through the kitchen's open front
    [tEnd, END1],                             // the slow push to the notebook
  ];
  const camOf = (t) => {
    const c = camAt(t, KEYS, ZB), dz = ZB - c.z;
    const amt = .5 * clamp(dz / 870, .03, 1) * span(t, tPl, tPl + 1.5);
    return camDrift(c, t, amt, 7);
  };

  // ---------------------------------------------------------------- the city going to sleep
  const sleepAt = (w) => tSleep + .1 + w.q * 32;                  // 577.6 … 609.6: one window after another
  const winFn = (t) => (w) => {
    const lit = w.r < .28 && t < sleepAt(w) ? 1 : 0;
    return { lit, gold: 0, cool: 0 };
  };
  const towerGlow = (t) => smooth(span(t, tNight, tNight + 1.8));

  // ---------------------------------------------------------------- figures and things in the kitchen
  const kidItem = (t) => [KIDP[1], (ctx) => {   // asleep on the stool, bent over the table, head on her arms
    const x = KIDP[0], hipY = KITCHEN.seatY - 4, br = Math.sin(t * 1.1) * .5 + .5;
    ctx.save();
    ctx.strokeStyle = mixHex(P.night1, P.ind1, .5); ctx.lineCap = 'round'; ctx.lineWidth = 7.5;   // the legs: thigh on the stool, shin down
    ctx.beginPath(); ctx.moveTo(x - 2, hipY - 2); ctx.lineTo(x + 18, hipY - 1); ctx.lineTo(x + 20, KY - 4); ctx.stroke();
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.ellipse(x + 23, KY - 2.5, 6, 2.6, 0, 0, 6.29); ctx.fill();
    ctx.translate(x, hipY + 47 - .6 * br);
    K.kid(ctx, 0, 0, 100, t, { dir: 1, lean: .95 + .03 * br, look: 0, armR: [1.75, 2.75], armL: [-1.75, -2.75].map((v) => -v), seed: 2 });
    ctx.restore();
  }];
  const tableThings = (t) => [
    notebookItem(t, { moon: true }),
    [BH[1], (ctx) => {   // her black-hole drawing, propped against the fruit bowl: a dark disc, a thin gold ring, the pea's orbit
      const x = BH[0], y = TB.top - 1, w = 30, h = 22;
      ctx.save(); ctx.translate(x, y); ctx.rotate(.08);
      ctx.fillStyle = mixHex(P.cream, P.blue1, .6); ctx.fillRect(-w / 2, -h, w, h);
      ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(0, -h / 2, 4.5, 0, 6.29); ctx.fill();
      ctx.strokeStyle = P.halo0; ctx.lineWidth = .9; ctx.beginPath(); ctx.ellipse(0, -h / 2, 9, 3, -.2, 0, 6.29); ctx.stroke();
      ctx.strokeStyle = rgba(P.ind1, .7); ctx.lineWidth = .5; ctx.setLineDash([1.2, 1.2]); ctx.beginPath(); ctx.ellipse(0, -h / 2, 12.5, 6.5, -.2, 0, 6.29); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
    }],
    [PEA[2], (ctx) => {   // the pea (a gold dot)
      const g = 1 + .05 * Math.sin(t * 1.7);
      ctx.fillStyle = rad(ctx, PEA[0], PEA[1] - 2, 8, [[0, rgba(P.halo0, .35)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(PEA[0] - 8, PEA[1] - 10, 16, 16);
      ctx.fillStyle = P.core1; ctx.beginPath(); ctx.arc(PEA[0], PEA[1] - 2.2, 2.3 * g, 0, 6.29); ctx.fill();
      ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(PEA[0] - .7, PEA[1] - 2.9, .7, 0, 6.29); ctx.fill();
    }],
  ];
  // you: at the counter (thumbnail A's spot) → the phone (buzz) → at your ear → walk into the hallway → at the hallway window
  const pick = (t) => sineIO(span(t, tBuzz + .35, tBuzz + .8)), ear = (t) => sineIO(span(t, tBuzz + .8, tDad + .1));
  const tW0 = tHears + 1.6, tW1 = tW0 + 3.2;
  const youItem = (t) => {
    const wu = span(t, tW0, tW1), z = t < tW0 ? YOU[2] : lerp(lerp(YOU[2], ZS + 330, smooth(span(wu, 0, .3))), HALLWIN[2], smooth(span(wu, .7, 1)));   // through the door (front part of the wall)
    return [z, (ctx) => {
      if (wu > 0 && wu < 1) { K.you(ctx, lerp(YOU[0], HALLWIN[0], sineIO(wu)), KY, 140, t, { pose: 'walk', walk: wu * 11, dir: -1, armR: [2.6, 4.2], light: -1, seed: 1 }); return; }
      if (wu >= 1) { K.you(ctx, HALLWIN[0], KY, 140, t, { pose: 'stand', view: 'back', look: .25 + .1 * Math.sin(t * .4), armR: t < tSleep + 1.5 ? [2.6, 4.2] : [.25, .15], light: -1, seed: 1 }); return; }
      const p = pick(t), e = ear(t), look = lerp(.15, .05, p);
      const armR = [lerp(lerp(.2, 1.15, p), 2.6, e), lerp(lerp(.1, 1.35, p), 4.2, e)];
      const hands = K.you(ctx, YOU[0], KY, 140, t, { pose: 'stand', dir: t > tBuzz + .2 ? -1 : 1, armR, look, light: -1, seed: 1 });
      if (p >= 1 && hands.R) { ctx.fillStyle = P.night0; ctx.fillRect(hands.R[0] - 2, hands.R[1] - 6, 4, 8); halo(ctx, hands.R[0], hands.R[1] - 2, 9, .5 * (1 - span(t, tDad + .5, tDad + 2))); }
    }];
  };
  const phoneState = (t) => {
    if (t > tBuzz + .8) return null;   // in your hand
    const on = expoOut(span(t, tBuzz - .05, tBuzz + .2)), bz = (t > tBuzz && t < tBuzz + .16) || (t > tBuzz + .34 && t < tBuzz + .5) ? 1 : 0;
    return { on, buzz: bz };
  };

  // ---------------------------------------------------------------- Dad in his flat (lamp on until he goes to sleep)
  const dadItems = (t) => ({ l3a: [[DAD[2], (ctx) => K.dad(ctx, DAD[0], DAD[1], 145, t, { dir: -1, look: .15, seed: 3 })]] });
  const dadLamp = (t) => .85 * (1 - span(t, tSub + 2.5, tSub + 3.1));

  // ---------------------------------------------------------------- the sky's timeline (12.05): world-anchored on a far plane (Z 30000)
  const ZT = 30000, TL = (() => {   // its ends from where they should sit on screen at 'ordinary days' (beside the big year)
    const c = camAt(tOrd, KEYS, ZB), s = c.f / (ZT - c.z), X = (sx) => c.x + (sx - W / 2) / s, Y = (sy) => c.y + (sy - H / 2) / s;
    return { a: [X(890), Y(385)], b: [X(1520), Y(385)], s };
  })();
  const timeline = (ctx, c, t) => {
    if (t < tBegan || t > tAlready + 1.2) return;
    const s = c.f / (ZT - c.z); if (s <= 0) return;
    const P2 = (q) => [W / 2 + (q[0] - c.x) * s, H / 2 + (q[1] - c.y) * s];
    const A = P2(TL.a), B = P2(TL.b), k = s / TL.s;
    const grow = expoOut(span(t, tBegan + .15, tBegan + 1.6));                 // it draws back in time: from 2037 (right) to 2026 (left)
    const fold = sineIO(span(t, tFinal + .1, tAlready - .2));                   // 'Your 2037…': it folds into its 2037 end
    const x0 = lerp(B[0], A[0], grow), xa = lerp(x0, B[0], fold), y = A[1];
    const gold = (x) => clamp((t - tWho - .1) / 1.4 - (x - A[0]) / (B[0] - A[0]) + .001) > 0 ? 1 : 0;   // gold runs left → right
    ctx.save(); ctx.lineCap = 'round';
    const N = 60; for (let i = 0; i < N; i++) {
      const u0 = i / N, u1 = (i + 1) / N, xa0 = lerp(A[0], B[0], u0), xa1 = lerp(A[0], B[0], u1); if (xa1 < xa) continue;
      const g = gold((xa0 + xa1) / 2);
      ctx.strokeStyle = g ? rgba(P.halo0, .35) : rgba(COOL.edge, .3); ctx.lineWidth = 9 * k; ctx.beginPath(); ctx.moveTo(Math.max(xa, xa0), y); ctx.lineTo(xa1, y); ctx.stroke();
      ctx.strokeStyle = g ? P.core1 : COOL.mid; ctx.lineWidth = 2.6 * k; ctx.stroke();
    }
    if (grow < 1) halo(ctx, x0, y, 22 * k, .9);
    // 'ordinary days': small lit windows along it, one after another
    for (let i = 0; i < 9; i++) {
      const u = (i + .7) / 9.6, x = lerp(A[0], B[0], u); if (x < xa) continue;
      const ap = expoOut(span(t, tOrd + i * .12, tOrd + .3 + i * .12)); if (ap <= 0) continue;
      const w = 13 * k * ap, h = 17 * k * ap, g = gold(x);
      ctx.fillStyle = g ? P.core1 : mixHex(P.halo1, P.core1, .5); ctx.fillRect(x - w / 2, y - 16 * k - h, w, h);
      ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.fillRect(x - .6 * k, y - 16 * k - h, 1.2 * k, h); ctx.fillRect(x - w / 2, y - 16 * k - h * .55, w, 1.2 * k);
    }
    // 'people like you': a small yellow figure with a '?' at the 2026 end (it rides the fold to 2037, then becomes the star)
    const fp = expoOut(span(t, tPeople, tPeople + .5)) * (1 - span(fold, .75, 1));
    if (fp > 0) {
      const fx = xa + 14 * k, fh = 72 * k * fp;
      K.you(ctx, fx, y - 3 * k, fh, t, { pose: 'look', look: .7, light: 1, seed: 5, out: true });
      const qa = expoOut(span(t, tPeople + .35, tPeople + .8)) * fp;
      if (qa > 0) { ctx.save(); ctx.beginPath(); ctx.rect(fx - 40 * k, y - 150 * k, 80 * k, 66 * k * qa); ctx.clip(); E.glowText(ctx, '?', fx, y - 92 * k + 40 * k * (1 - qa), { size: 46 * k, serif: true, align: 'center', col: P.core1 }); ctx.restore(); }
    }
    // the 2037 end: a small year, then (folded) the star of 'already started'
    const lab = expoOut(span(t, tBegan + .2, tBegan + .8)) * (1 - span(fold, .2, .5));
    if (lab > 0) { ctx.save(); ctx.beginPath(); ctx.rect(B[0] - 50 * k, y + 14 * k, 120 * k, 40 * k); ctx.clip(); E.glowText(ctx, '2037', B[0], y + 44 * k + 30 * k * (1 - lab), { size: 26 * k, serif: true, align: 'center', col: P.core1 }); ctx.restore(); }
    ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(B[0], y, (4 + 3 * bump(t, tAlready - .05, .8)) * k, 0, 6.29); ctx.fill();
    halo(ctx, B[0], y, (16 + 30 * bump(t, tAlready - .05, 1)) * k, .8);
    ctx.restore();
  };

  // ---------------------------------------------------------------- frame
  const draw = (ctx, t) => {
    if (t < tPl) { plateNotebook(ctx, t); return; }
    const c = camOf(t);
    const kLamp = NOTEBOOK_STATE.you.kitchen.lamp * (1 - span(t, tW0 + .4, tW0 + .9));   // you switch it off on your way out
    const hall = NOTEBOOK_STATE.you.hallLamp * (1 - span(t, VOE + 3.2, VOE + 3.6));
    const moon = span(t, tW0 + .4, tW0 + 1.4);
    K.world(ctx, c, t, {
      hour: 22.5, winFn: winFn(t),
      tower: { glow: towerGlow(t) }, clinic: { lit: 1 - span(t, tSleep + 2, tSleep + 2.3) },
      dad: { open: 1, lamp: dadLamp(t), items: dadItems(t) },
      you: {
        hallLamp: hall,
        rooms: { l3b: .7 * (1 - span(t, tSleep + 3, tSleep + 3.4)), l1a: .6 * (1 - span(t, tSleep + 9, tSleep + 9.4)) },
        kid: { asleep: true },
        kitchen: {
          lamp: kLamp, wall: 0, scan: null, phone: phoneState(t), kettle: { steam: 0 },
          people: [kidItem(t), youItem(t), ...tableThings(t)],
        },
      },
    });
    // the plate's moon glow (screen space) hands over to the moon's light in the room as the camera pulls back (light, not an object)
    const pm = 1 - sineIO(span(t, tPl, tPl + 2.5));
    if (pm > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = rad(ctx, 1500, 120, 900, [[0, rgba(COOL.mid, (.12 + .02 * Math.sin(t * .7)) * pm)], [1, rgba(COOL.mid, 0)]]); ctx.fillRect(0, 0, W, H); ctx.restore(); }
    // the moon through the open front: a cool breath over the table (stronger once the lamp is off)
    {
      const p = wp(c, NB.X + 120, NB.Y - 80, NB.Z), mk = Math.max(moon, .5 * (1 - pm)); if (p && mk > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, p[0], p[1], 260 * p[2], [[0, rgba(COOL.edge, .16 * mk)], [1, rgba(COOL.edge, 0)]]); ctx.fillRect(p[0] - 260 * p[2], p[1] - 260 * p[2], 520 * p[2], 520 * p[2]); ctx.restore(); }
    }
    // ---- 12.02 / 12.03: the gold line between your window and Dad's, small lights travelling it; the caliper; Dad's earbud
    const a = wp(c, ...YOURWIN), b = wp(c, ...DADWIN);
    if (t > tTell - .2 && t < tSleep + 1.5 && a && b) {
      const u = expoOut(span(t, tTell - .15, tTell + 1.3)), out = expoIn(span(t, tSleep - .2, tSleep + 1.2));
      K.goldLine(ctx, [a[0], a[1]], [b[0], b[1]], u, { u0: out, lift: .16, w: 2.4 });
      const pts = K.arcPts([a[0], a[1]], [b[0], b[1]], .16, 60);
      if (u >= 1 && out <= 0) for (const [t1, dir] of [[tYouTell, 1], [tYouTell + 1.1, 1], [tHow, -1], [tSmallD, 1], [tReally, 1], [tHears + .3, 1]]) {
        const v = span(t, t1, t1 + 1.4); if (v <= 0 || v >= 1) continue;
        const q = pts[Math.round((dir > 0 ? v : 1 - v) * 60)]; halo(ctx, q[0], q[1], 14, .9); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(q[0], q[1], 2.6, 0, 6.29); ctx.fill();
      }
    }
    // the caliper: two gold jaws over your building, the spot between them; 'Really small' closes it to a hair
    const cal = expoOut(span(t, tHow, tHow + .5)) * (1 - sineIO(span(t, tHears - .6, tHears)));
    if (cal > 0) {
      const gap = 2.3 * lerp(lerp(190, 80, sineIO(span(t, tSmallD, tSmallD + .6))), 30, sineIO(span(t, tReally, tReally + .6)));
      const h = 690 * cal, p = wp(c, CAL[0], CAL[1], ZS);
      if (p) {
        const s = p[2]; ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = P.core1; ctx.lineWidth = Math.max(2, 14 * s);
        for (const d of [-1, 1]) { const x = p[0] + d * gap / 2 * s; ctx.beginPath(); ctx.moveTo(x, p[1] - h / 2 * s); ctx.lineTo(x, p[1] + h / 2 * s); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, p[1] - h / 2 * s); ctx.lineTo(x - d * 90 * s, p[1] - h / 2 * s); ctx.stroke(); }
        ctx.restore();
        halo(ctx, p[0], p[1], 90 * s, .8 * cal); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(p[0], p[1], 20 * s * cal, 0, 6.29); ctx.fill();
      }
    }
    const eb = expoOut(span(t, tEveryW, tEveryW + .4)) * (1 - span(t, tSleep - .5, tSleep + .5));
    if (eb > 0) { const p = wp(c, DAD[0] - 7, DAD[1] - 145 * .88, DAD[2]); if (p) { halo(ctx, p[0], p[1], 26 + 6 * Math.sin(t * 3), .85 * eb, COOL.mid, COOL.core); } }
    // ---- 12.05 / 12.06: the timeline in the sky
    timeline(ctx, c, t);
  };
  return [{ t: R.a, draw, tr: 'cut' }];
};
