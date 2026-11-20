// c01 · Lead · 0 – 31.34 s · Hook · 2037, a possible Tuesday · 06:15 the message from the clinic · it could have gone only to payers.
// ONE continuous take in the street in section (docs/shots.md 1.01–1.05):
//   1.01 THUMBNAIL A: the dark kitchen, the chest scan glowing on the light wall (gold spot in its ring), you with a steaming mug,
//        the hallway's warm light through the door. The HUD rolls the big year in (2026 → 2037). Very slow push.
//   1.02 'Superintelligence': the scan folds to a line and a point (old-screen grammar); one slow crane out and left to the
//        street with the clinic (4.5 s); on the way the night-shift tower's windows light cool bottom → top; 'for years': small cool points in ordinary windows.
//   1.03 'Six-fifteen' (the clock prints) as the camera settles on the clinic + your building; 'phone buzzes': your phone on the
//        counter lights cool; 'clinic': a gold line arcs from the clinic's tall window into your kitchen, to the phone.
//   1.04 'Overnight': the camera follows the line in; 'read your scan': the phone's light runs up the wall and the scan sweeps on;
//        'found something': the gold ring closes; 'Early': the growth wedge with the mark at its very start; 'stay small': ring tightens,
//        the wedge stays small. We are back in the thumbnail frame, now with meaning.
//   1.05 ★ 'stay small' → 'luck': one slow pull back to the whole city in section (a map of windows); 'only to people who pay extra':
//        gold lines from the clinic reach only a few windows, which get a small gold price tag (the rest of the city stays dark);
//        'go well': the lines run out to every window at once (the version that happened). Carrier into c02: the line to YOUR window (the camera follows it back in).
import * as E from '../lib/f10_editorial.mjs';
import * as K from '../lib/f23_kit.mjs';
const { W, H, P, clamp, lerp, span, smooth, expoOut, expoIn, sineIO, rgba, camAt, camDrift, halo } = E;
const { ZS, ZB, KITCHEN, LIGHTWALL, look, wp, CAM_THUMB } = K;

export default (T, R) => {
  const G = (p, after = -1) => T.G(p, 0, after);
  const tS = G('Superintelligence'), tYears = G('for years'), t615 = G('Six-fifteen'), tBuzz = G('phone buzzes'), tClinic = G('clinic', tBuzz);
  const tOver = G('Overnight'), tRead = G('read your scan'), tFound = G('found something'), tEarly = G('Early', tFound), tSmall = G('stay small');
  const tLuck = G('luck', tSmall), tSame = G('same machines'), tOnly = G('only to people'), tPay = G('pay extra'), tWell = G('go well'), tEnd = R.b;

  // ---------------------------------------------------------------- the camera (keys on words; slow; ref = the section plane)
  const LW = LIGHTWALL, KY = KITCHEN.floor;
  const THUMB = CAM_THUMB, THUMB_IN = look(LW.cx, KY, ZB, 1.82, 1404, 912);          // thumbnail A, then a very slow push
  const CLIN = look(-3350, -1180, ZS, .3), CLIN_IN = look(-3300, -1190, ZS, .315);  // the clinic + your building (1.03)
  const BACK = look(LW.cx, KY, ZB, 1.78, 1408, 909), BACK_IN = look(LW.cx, KY, ZB, 1.86, 1402, 914);   // back in the thumbnail frame (1.04)
  const CITY = look(-1150, -1950, ZS, .19), CITY_IN = look(-1120, -1965, ZS, .198);  // the city as a map of windows (1.05): a crane up, the rows stack
  // three travels only (calm): out to the clinic frame (it holds the tower too), in to the wall, out to the city
  const KEYS = [
    [0, THUMB], [tS + .05, THUMB_IN],
    [t615 + .8, CLIN, 'l'],                // 1.02 + 1.03: one slow crane out and left (4.5 s): the tower is found on the way
    [tOver, CLIN_IN],
    [tFound + .9, BACK, 'l'],              // 1.04: follow the line back in (3.8 s)
    [tSmall + .9, BACK_IN],
    [tLuck + 4.4, CITY, 'l'],              // 1.05: out to the whole city (5.4 s, from the end of 'stay small')
    [tEnd, CITY_IN],
  ];
  const camOf = (t) => camDrift(camAt(t, KEYS, ZB), t, .5, 3);

  // ---------------------------------------------------------------- the city's windows for the fan (1.05)
  const all = K.cityWindows();
  const targets = all.filter((w) => w.q < .3 || w.room || (w.r > .965 && w.Z === ZS));
  const CW = K.CLINIC_WIN;
  const dist = (w) => clamp(Math.hypot(w.X - CW[0], (w.Z - ZS) * 1.6) / 14000);
  const payer = (w) => !w.room && w.r > .965 && w.Z < 6000;   // the few windows that pay extra (street row + first back row)
  const fan = (w, t) => {   // → { u1 } of the line clinic → window, gold 0..1 at the window
    const d = dist(w);
    const few = payer(w) ? expoOut(span(t, tOnly + .1 + d * .5, tOnly + .9 + d * .5)) : 0;   // the other way: only the payers
    const all = expoOut(span(t, tWell + .05 + d * .6, tWell + .9 + d * .6));                 // this way: every window at once
    const u1 = Math.max(few, all);
    return { u1, gold: clamp((u1 - .92) / .08) };
  };

  // ---------------------------------------------------------------- per-window look over the film time
  const winFn = (t) => (w) => {
    const lit = w.r < .16 ? 1 : 0;
    const ta = tYears + .05 + w.r * 1.4, cool = w.q < .42 && w.r > .16 ? clamp((t - ta) / .35) * (w.room ? 0 : 1) : 0;
    let gold = 0;
    if (t > tOnly && (w.q < .3 || payer(w))) gold = fan(w, t).gold;
    return { lit, gold, cool };
  };

  // ---------------------------------------------------------------- the scan on the wall
  const scanState = (t) => {
    if (t < tRead) {   // the opening picture, folding away on 'Superintelligence'
      const col = span(t, tS + .1, tS + .75);
      return col >= 1 ? null : { a: 1, draw: 1, ring: 1, spot: 1, collapse: col };
    }
    const dr = span(t, tRead + .85, tRead + 2.1);
    return { a: 1, draw: dr, spot: clamp((dr - .45) / .1), ring: expoOut(span(t, tFound, tFound + .8)), timeline: span(t, tEarly, tEarly + .9), tight: span(t, tSmall, tSmall + .7), small: span(t, tSmall + .1, tSmall + .9) };
  };
  const PH = [KITCHEN.phone[0], KITCHEN.phone[1] - 4, KITCHEN.phone[2]];
  const phoneState = (t) => {
    const on = Math.max(expoOut(span(t, tBuzz - .05, tBuzz + .2)) * (1 - .45 * span(t, tBuzz + 1, tBuzz + 2)), .0);
    const bz = (t > tBuzz && t < tBuzz + .16) || (t > tBuzz + .34 && t < tBuzz + .5) ? 1 : 0;
    return { on: t > tRead + 2.4 ? on * (1 - span(t, tRead + 2.4, tRead + 3)) + .2 : on, buzz: bz, gold: Math.sin(Math.PI * span(t, tClinic + 1.05, tClinic + 1.75)) };
  };

  const draw = (ctx, t) => {
    const c = camOf(t);
    const scan = scanState(t), ph = phoneState(t), scanOn = scan ? (scan.a ?? 1) * (1 - (scan.collapse ?? 0)) : 0;
    const lookUp = t < tS + .5 ? .8 : t < tBuzz + .2 ? lerp(.8, .5, span(t, tS + .5, tS + 1.5)) : t < tRead ? lerp(.5, .1, sineIO(span(t, tBuzz + .2, tBuzz + .9))) : lerp(.1, .85, sineIO(span(t, tRead + .1, tRead + 1)));
    K.world(ctx, c, t, {
      hour: 6.25,
      winFn: winFn(t),
      tower: { glow: span(t, tS + .4, tS + 2.2) },
      you: {
        hallLamp: 1,
        kitchen: {
          scan, wall: scanOn, phone: ph, kettle: { steam: 0 },
          people: [[KITCHEN.you[2], (cx) => K.you(cx, KITCHEN.you[0], KY, 140, t, { pose: 'hold', cup: 'R', look: lookUp, light: -1, seed: 1, steam: 1 })]],
        },
      },
    });
    // ---- screen space: the clinic's line (1.03), the fan (1.05)
    const cw = wp(c, CW[0], CW[1], CW[2]);
    if (t > tClinic && t < tOver + 1.6) {
      const p = wp(c, PH[0], PH[1], PH[2]), u = expoOut(span(t, tClinic, tClinic + 1.1)), tail = expoIn(span(t, tOver + .2, tOver + 1.4));
      if (cw && p) K.goldLine(ctx, [cw[0], cw[1]], [p[0], p[1]], u, { u0: tail, lift: .22, w: 2.2 });
    }
    // 'read your scan': the phone's light runs up to the wall and spreads along the top of the light area (then the sweep)
    {
      const u = expoOut(span(t, tRead, tRead + .55)), sp = expoOut(span(t, tRead + .55, tRead + .85)), gone = span(t, tRead + .85, tRead + 1.2);
      const p = wp(c, PH[0], PH[1], PH[2]), q = wp(c, LW.cx, LW.y + 6, ZB);
      if (u > 0 && gone < 1 && p && q) {
        ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(K.COOL.core, 1);
        if (sp <= 0) { const x = lerp(p[0], q[0], u), y = lerp(p[1], q[1], u); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(x, y); ctx.stroke(); halo(ctx, x, y, 22, .9); }
        else { const hw = LW.w / 2 * q[2] * sp * (1 - gone); ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(q[0] - hw, q[1]); ctx.lineTo(q[0] + hw, q[1]); ctx.stroke(); }
        ctx.restore();
      }
    }
    if (t > tOnly) {
      const tagA = expoOut(span(t, tPay, tPay + .5));
      for (const w of targets) {
        const f = fan(w, t); if (f.u1 <= 0) continue;
        const p = wp(c, w.X, w.Y, w.Z); if (!p || !cw) continue;
        K.goldLine(ctx, [cw[0], cw[1]], [p[0], p[1]], f.u1, { lift: .07, w: payer(w) ? 1.6 : .9, a: w.Z === ZS ? .8 : w.Z > 6000 ? .3 : .45, spark: f.u1 < .98 });
        if (w.room && f.gold > 0) halo(ctx, p[0], p[1], 26 * p[2] / .19 * .19, .7 * f.gold);
        if (payer(w) && tagA > 0) K.priceTag(ctx, p[0] + 8, p[1] - 4, 22, tagA * (1 - span(t, tWell + .9, tWell + 1.5) * 0));
      }
    }
  };
  return [{ t: 0, draw, tr: 'cut' }];
};
