// c05 · B1 · "Take Europe's AI law" → 'This channel exists' · the EU AI Act on its axis, 7+ years vs a machine that doubles, too slow?,
// the ozone hole, the Montreal Protocol with its update cog, the sky needs decades, the rule kept learning, the slower clock can be set
// → the HUD lifts into the big gauges (plateClocks). One take with c02–c04 (lib/b1_take.mjs).
//
// | ID    | anchor (phrase)                  | zeigt wörtlich                                                                         | layer | carrier out        |
// |-------|----------------------------------|----------------------------------------------------------------------------------------|-------|--------------------|
// | 2.01  | Take Europe's AI law             | the dashed cog (from 1.36) moves aside, a law sheet EU AI ACT slides out of it onto a time axis | EXPL | the sheet |
// | 2.02  | It was proposed before           | PROPOSED · APRIL 2021 under the sheet, then CHATGPT · NOV 2022 lights later (cool tick)  | EXPL | the axis           |
// | 2.03  | Its last rules                   | the sheet slides to 2028: LAST RULES APPLY · AUG 2028 + source; gold model boxes run under it, faster and faster | EXPL | the span |
// | 2.04★ | More than seven years            | 7+ YEARS bracket; the cog turns ONE notch while the gold disc doubles again and again: DOUBLES EVERY FEW MONTHS | EXPL | the cog |
// | 2.05  | Not out of laziness              | a dashed sheet with empty boxes (the standards) pushes the date: PUSHED BACK · STANDARDS NOT READY + source | EXPL | the question |
// | 2.06  | So are rules just too slow       | TOO SLOW? over the cog                                                                  | EXPL | the cog            |
// | 2.07  | One case says no                 | the cog rolls to the right, towards a globe line                                        | EXPL | the globe          |
// | 2.08  | In the nineteen eighties         | a globe line (no map), the ozone layer round it, a hole opens at the bottom: OZONE HOLE REPORTED · MAY 1985 | EXPL | the axis |
// | 2.09  | A little over two years          | the axis runs May 1985 → Sept 1987, a sheet rises at its end, four signatures: MONTREAL PROTOCOL SIGNED · SEPT 1987 + source | EXPL | the sheet |
// | 2.10  | And that treaty has an update    | the cog flies onto the treaty's corner and turns solid: UPDATE BUILT IN                 | EXPL | the cog            |
// | 2.11  | It can be tightened              | the cog turns one notch, the sheet's lines tighten (no new sheet)                        | EXPL | the cog            |
// | 2.12  | It has been, again               | six notches, six tally marks: ADJUSTED OR AMENDED 6 TIMES + source                       | EXPL | the hole           |
// | 2.13  | The sky still needs decades      | the hole shrinks slowly on an axis to the 2070s: RECOVERY EXPECTED IN THE 2070s + source | EXPL | the cog            |
// | 2.14  | But the rule came fast           | the treaty cog keeps turning: IT KEPT LEARNING                                           | EXPL | the cog            |
// | 2.15  | So the slower clock can be set   | the HUD lifts into the big gauges, the treaty cog flies into the cog slot (solid, one notch): CAN BE SET · NOT IN A FEW MONTHS → plateClocks | EXPL | plateClocks |
import { L, SRC, F, S, X, GOLD, COOL, CREAM, OCHRE, PAPER, P, rgba, mixHex, clamp, lerp, span, expoOut, expoIn, halo, lab, ease, bump, ground, yearX, tag, take } from '../lib/b1_take.mjs';

export function part(K) {
  const { A, T } = K, beats = [], AY = L.ACT.y, OZ = L.OZ, MT = L.MT, TR = L.TR, BIG = L.BIG;
  // ------------------------------------------------------------------ camera + light
  const L0 = A.canSet - .2, L1 = A.canSet + 1.87;   // the HUD lifts into the big gauges
  const keys = [
    [A.take + .2, { x: -1945, y: 1570, s: 1.0 }],
    // 2.01–2.05 one wide framing (cog, axis, sheet, disc), a slow creep only
    [A.take + 2.0, { x: -740, y: 1460, s: .75 }],
    [A.seven, { x: -745, y: 1461, s: .755 }],
    [A.tooSlow, { x: -752, y: 1462, s: .76 }],
    [A.tooSlow + 1.6, { x: -1620, y: 1420, s: 1.0 }],
    [A.oneCase + .1, { x: -1630, y: 1420, s: 1.01 }],
    // 2.07–2.14 one framing (globe line + treaty), the camera follows the rolling cog into it and then only creeps
    [A.eighties + .4, { x: -450, y: 1420, s: .9 }],
    [A.update, { x: -446, y: 1420, s: .905 }],
    [A.sky, { x: -441, y: 1420, s: .91 }],
    [A.canSet, { x: -436, y: 1418, s: .915 }],
    [L1 + .1, { x: 960, y: 600, s: .86 }],
    [A.plate - 2.06, { x: 960, y: 565, s: .92 }],
    [A.plate, { x: 960, y: 560, s: 1.0 }],
    [A.plate + 1, { x: 960, y: 560, s: 1.04 }],
  ];
  const lights = [[A.take + .5, -900, 1480, 2], [A.tooSlow, -1700, 1400], [A.eighties, -600, 1400, 2], [A.update + 1, -100, 1380, 2.5], [L0, 960, 560, 2.4]];

  // ------------------------------------------------------------------ the cog (carrier through the whole chunk)
  const COG = L.COG, C1 = [-1840, 1440], R1 = 95, NOTCH = Math.PI * 2 / 12;
  const ROLL = 11, C2 = [C1[0] + R1 * ROLL * NOTCH, C1[1]];               // 2.07: it rolls 11 notches (no slip)
  const TW = TR.w, TH = TW * 1.3, TC = [TR.x + TW * .38, TR.y - TH * .4], TR_R = TW * .16;   // the treaty's corner cog
  const e1 = (t) => ease(t, A.take, A.take + 1.6), e2 = (t) => ease(t, A.oneCase + .1, A.oneCase + 2.0), e3 = (t) => ease(t, A.update + .1, A.update + 1.6);
  const e4 = (t) => ease(t, A.canSet - .1, A.setW - .1);                    // the flight into the cog slot of the big gauges (lands on 'set.')
  const six = (t) => { let s = 0; for (let k = 0; k < 6; k++) s += ease(t, A.againW - .6 + k * .36, A.againW - .28 + k * .36); return s; };
  const notch = (t) => ease(t, A.howFast + 1.25, A.take + 1.6) + ease(t, A.seven + .3, A.seven + 2.5) + ROLL * e2(t) + ease(t, A.tightW, A.tightW + .9) + six(t) + 2 * ease(t, A.fast + .2, A.canSet - .2)
    + F.clockState(T, t).rules.notch + .05 * Math.sin(t * .5) * (1 - e4(t));
  const cogAt = (t) => {   // wall position + radius (before the flight into the gauges)
    let x = COG.x, y = COG.y, r = COG.r;
    const a = e1(t); x = lerp(x, C1[0], a); y = lerp(y, C1[1], a); r = lerp(r, R1, a);
    const b = e2(t); x = lerp(x, C2[0], b);
    const c = e3(t); if (c > 0) { x = lerp(x, TC[0], c); y = lerp(y, TC[1], c) - Math.sin(Math.PI * c) * 220; r = lerp(r, TR_R, c); }
    return [x, y, r];
  };
  const dashed = (t) => 1 - ease(t, A.update + 1.3, A.update + 1.9);
  // the big gauges: screen centre + scale while the HUD lifts (L0 → L1), then exactly where plateClocks draws them
  const lift = (t) => ease(t, L0, L1);
  const bigAt = (t, v) => { const [sx, sy] = X.toScreen(v, BIG.x, BIG.y), e = lift(t); return [lerp(S.HUD_C[0], sx, e), lerp(S.HUD_C[1], sy, e), lerp(1, BIG.k * v.s, e)]; };
  beats.push({
    a: A.howFast + 1.25, b: A.plate, z: 9,
    wall(ctx, t) {
      if (e4(t) > 0) return;
      const [x, y, r] = cogAt(t);
      // 2.07: a hairline floor under the rolling cog
      const fl = span(t, A.oneCase - .1, A.oneCase + .5) * (1 - span(t, A.update, A.update + .8));
      if (fl > 0) X.lightLine(ctx, [[C1[0] - 140, C1[1] + R1 + 4], [C2[0] + 160, C1[1] + R1 + 4]], fl, { a: .45, w: 2 });
      const pulse = bump(t, A.seven + .3, 2.4);
      F.cogClock(ctx, t, x, y, r, { dashed: dashed(t), notch: notch(t), glow: .25 + .35 * pulse });
      // 2.12: six tally marks next to the treaty cog, one per notch
      const n6 = six(t), fade = 1 - span(t, A.sky - .2, A.sky + .6);
      for (let k = 0; k < 6; k++) { const u = clamp(n6 - k) * fade; if (u > 0) X.lightLine(ctx, [[432 + k * 30, 1420], [438 + k * 30, 1420 + 54 * u]], 1, { a: .9, w: 5 }); }
    },
    screen(ctx, t, v) {
      // 2.15 the HUD lifts into the big gauges; the treaty cog flies into their cog slot and lands on 'set.'
      if (t < L0) return;
      const [cx, cy, k] = bigAt(t, v), e = e4(t), st = F.clockState(T, t);
      const a = span(t, L0, L0 + .35), lu = span(lift(t), .72, 1);
      S.clocksBig(ctx, t, T, cx, cy, k, { a, labels: lu, only: e < 1 ? ['flint', 'ring', 'gap', 'counter'] : null, state: st });
      if (e < 1) {
        const [wx, wy, wr] = cogAt(t), [sx, sy] = X.toScreen(v, wx, wy), [bx, by] = S.bigPos('cog', cx, cy, k, st);
        const x = lerp(sx, bx, e), y = lerp(sy, by, e) - Math.sin(Math.PI * e) * 90, r = lerp(wr * v.s, F.HUD.cog[2] * k, e);
        F.cogClock(ctx, t, x, y, r, { dashed: 0, notch: notch(t), glow: lerp(.25, .3, e) });
      }
    },
  });
  const hudHide = (t) => span(t, L0, L0 + .35);

  // ------------------------------------------------------------------ 2.01–2.05 the EU AI Act on its axis
  const SW = 220, SH = SW * 1.3, SY = AY - 14 - SH / 2;                     // the law sheet sits on the axis
  const slide = (t) => ease(t, A.lastRules + .1, A.y2028);                   // 2021.3 → 2028.6, lands on 'twenty-eight'
  const sheetX = (t) => yearX(lerp(2021.3, 2028.6, slide(t)));
  const sinkAct = (t) => span(t, A.tooSlow - .1, A.tooSlow + 1.0);
  const DX = [150, 1400], D0 = 22;                                           // 2.04 the gold disc (the machine's counter)
  const dbl = (t) => { let s = 0; for (let k = 0; k < 5; k++) s += expoOut(span(t, A.dbl3 - .45 + k * .42, A.dbl3 - .1 + k * .42)); return s; };
  const discOut = (t) => ease(t, A.lazy + .1, A.lazy + 1.3);   // it sinks behind the axis
  const PUSH0 = yearX(2026.6), PUSH1 = yearX(2028.6);
  beats.push({
    a: A.take, b: A.tooSlow + 1.1, z: 6,
    wall(ctx, t) {
      const sk = sinkAct(t);
      // the axis (2020.6 → 2029.2), drawn from the cog to the right; yearly ticks; it retracts on 'too slow'
      const au = span(t, A.take + .3, A.take + 1.5) * (1 - sk), xa = yearX(2020.6), xb = yearX(2029.2);
      if (au > 0) {
        X.lightLine(ctx, [[xa, AY], [xb, AY]], au, { a: .6, w: 2.5 });
        for (let y = 2021; y <= 2029; y++) { const x = yearX(y), k = clamp((au * (xb - xa) - (x - xa)) / 60); if (k > 0) X.lightLine(ctx, [[x, AY - 10], [x, AY + 10]], k, { a: .7, w: 2 }); }
        const sl = slide(t), x0 = yearX(2021.3);   // the span the sheet travelled: a brighter cream line
        if (sl > 0) X.lightLine(ctx, [[x0, AY], [sheetX(t), AY]], 1, { col: rgba(CREAM, .95 * (1 - sk)), w: 5 });
      }
      // CHATGPT · NOV 2022: a cool tick (the sheet was first)
      const cu = span(t, A.chatgpt2 - .15, A.chatgpt2 + .4) * (1 - sk);
      if (cu > 0) { const x = yearX(2022.9); X.lightLine(ctx, [[x, AY - 26], [x, AY + 26]], cu, { col: rgba(COOL.line, .95), w: 4, glowCol: COOL.halo }); }
      // the law sheet: slides out of the cog, lands on 2021.3 ('law.'), slides to 2028.6, sinks behind the axis on 'too slow'
      const out = ease(t, A.take + .6, A.law + .05);
      if (out > 0) ground(ctx, 1 - sk, xa - 400, xb + 500, AY - 4, SH + 40, () => {
        const [cx, cy] = [C1[0], C1[1]], x = lerp(cx, sheetX(t), out), y = lerp(cy, SY, out) - Math.sin(Math.PI * out) * 60;
        const bumpX = 16 * bump(t, A.pushed + .55, .5);
        sheet(ctx, t, x + bumpX, y, lerp(.3, 1, expoOut(out)) * SW, { title: SRC.aiAct, tsize: 34, rot: (1 - out) * -.25 });
        // 2.05: the standards (a dashed sheet with empty boxes) at 2026.6, pushes on to the act on 'pushed'
        const su = span(t, A.lazy + .5, A.lazy + 1.2), pu = ease(t, A.pushed - .1, A.pushed + .6);
        if (su > 0) { const x2 = lerp(PUSH0, PUSH1 - SW * .9 - 12, pu);
          if (pu > 0) X.lightLine(ctx, [[PUSH0, SY - SH * .62], [x2, SY - SH * .62]], 1, { a: .7, w: 3, dash: [12, 10] });
          sheet(ctx, t, x2, SY + 20, SW * .8, { u: su, dashed: 1, boxes: 1, rot: .03 }); }
      });
      // tags: PROPOSED · APRIL 2021, CHATGPT · NOV 2022 (later), LAST RULES APPLY · AUG 2028 (above), PUSHED BACK · STANDARDS NOT READY
      tag(ctx, SRC.proposed, yearX(2021.3) + 60, AY + 82, lab(t, A.propW - .15, A.lastRules + .4), { size: 36 });
      tag(ctx, SRC.chatgpt, yearX(2022.9) + 120, AY + 160, lab(t, A.chatgpt2 - .1, A.lastRules + .5), { size: 36, col: COOL.text });
      tag(ctx, SRC.lastRules, PUSH1 - 40, SY - SH / 2 - 60, lab(t, A.y2028 - .3, A.seven + .1), { size: 36 });
      tag(ctx, SRC.standards, (PUSH0 + PUSH1) / 2, SY - SH / 2 - 110, lab(t, A.standards - .2, A.tooSlow + .3), { size: 34 });
      // 2.04: 7+ YEARS over the axis (from the 2021 landing to 2028), the disc doubles again and again
      const bu = span(t, A.seven - .1, A.seven + .6) * (1 - span(t, A.lazy - .2, A.lazy + .4));
      if (bu > 0) { const y = SY - SH / 2 - 70, m = (yearX(2021.3) + PUSH1) / 2, hw = (PUSH1 - yearX(2021.3)) / 2 * expoOut(bu);
        X.lightLine(ctx, [[m - hw, y + 30], [m - hw, y], [m + hw, y], [m + hw, y + 30]], 1, { a: .85 * clamp(bu * 2), w: 3.5 });
        X.big(ctx, SRC.sevenYears, m, y - 34, 96, lab(t, A.seven, A.lazy + .1, .6), { gold: .1 }); }
      const n = dbl(t), r = D0 * Math.sqrt(2 ** n), dout = discOut(t);
      const discU = span(t, A.lastRules + 1.1, A.lastRules + 1.8);
      if (discU > 0 && dout < 1) {
        const dx = DX[0], dy = DX[1] + dout * 360;
        ctx.save(); ctx.beginPath(); ctx.rect(DX[0] - 400, DX[1] - 600, 800, AY - 4 - (DX[1] - 600)); ctx.clip();
        for (let k = 0; k < 5; k++) { const ru = clamp(n - k); if (ru <= 0) continue; const rr = D0 * Math.sqrt(2 ** k);   // growth rings at each former size
          ctx.strokeStyle = rgba(GOLD.line, .45 * (1 - .5 * ru) * (1 - dout)); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(dx, dy, rr, 0, Math.PI * 2); ctx.stroke(); }
        F.sphere(ctx, t, dx, dy, r * expoOut(discU), { dust: 60 + 40 * n, seed: 21 });
        ctx.restore();
      }
      X.label(ctx, SRC.fewMonths, DX[0], DX[1] + 290, lab(t, A.dbl3 - .2, A.lazy + .2), { size: 44, spacing: .1, gold: 1, col: GOLD.text });
      // 2.03: model generations run under the axis as gold boxes, faster and faster, into the disc
      const M0 = A.lastRules + .25;
      for (let k = 0; k < 6; k++) {
        const t0 = M0 + 1.9 * (1 - .78 ** k) / (1 - .78) * .42, sp = 380 + k * 170, d = (t - t0) * sp; if (d <= 0) continue;
        const xa2 = yearX(2020.8), xe = DX[0], x = xa2 + d; if (x > xe + 40) continue;
        const up = span(x, -120, xe), y = lerp(AY + 120, DX[1], up * up), s = 26 * (1 - .8 * up);
        ctx.save(); ctx.globalAlpha *= (1 - sk) * clamp(d / 60);
        ctx.fillStyle = GOLD.body; ctx.strokeStyle = GOLD.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x - s / 2, y - s / 2, s, s, 4); ctx.fill(); ctx.stroke(); ctx.restore();
      }
    },
    screen(ctx, t) {
      F.source(ctx, t, A.y2028 - .2, A.seven + 1.2, SRC.aiActSrc);
      F.source(ctx, t, A.standards, A.tooSlow + .2, SRC.standardsSrc);
    },
  });

  // ------------------------------------------------------------------ 2.06 TOO SLOW? over the cog
  beats.push({ a: A.tooSlow - .2, b: A.oneCase + 1.2, z: 7,
    wall(ctx, t) { X.big(ctx, SRC.tooSlow, C1[0], C1[1] - R1 - 70, 92, lab(t, A.tooSlow + .1, A.oneCase + .9, .7), { gold: .1 }); } });

  // ------------------------------------------------------------------ 2.08–2.13 the globe line, the ozone layer, the hole
  const ER = OZ.r, BR = OZ.r + 42;
  const holeW = (t) => .52 * ease(t, A.hole - .25, A.hole + .9) * (1 - .62 * ease(t, A.sky + .2, A.heal + 1.6));
  beats.push({
    a: A.eighties - .3, b: A.canSet + 2, z: 5,
    wall(ctx, t) {
      const gone = span(t, A.canSet + .2, A.canSet + 1.6);
      ground(ctx, 1 - gone, OZ.x - 700, OZ.x + 700, OZ.y + BR + 40, BR * 2 + 120, () => {
        const eu = ease(t, A.eighties - .15, A.eighties + 1.1); if (eu <= 0) return;
        halo(ctx, OZ.x, OZ.y, ER * 1.6, .18 * eu, P.halo2, P.core0);
        ctx.fillStyle = rgba(mixHex(P.night1, P.ind1, .5), .9 * eu); ctx.beginPath(); ctx.arc(OZ.x, OZ.y, ER, 0, Math.PI * 2); ctx.fill();
        const q0 = -Math.PI / 2, pts = []; for (let i = 0; i <= 72; i++) { const q = q0 + i / 72 * Math.PI * 2; pts.push([OZ.x + Math.cos(q) * ER, OZ.y + Math.sin(q) * ER]); }
        X.lightLine(ctx, pts, eu, { a: .9, w: 3 });
        // a tilted equator + one meridian: a globe line, no map
        const gu = span(eu, .6, 1); if (gu > 0) { ctx.save(); ctx.strokeStyle = rgba(CREAM, .28 * gu); ctx.lineWidth = 2;
          ctx.beginPath(); ctx.ellipse(OZ.x, OZ.y, ER, ER * .28, -.12, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.ellipse(OZ.x, OZ.y, ER * .38, ER, -.12, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
        // the ozone layer: a pale band round it, with a hole opening over the south pole
        const bu = ease(t, A.eighties + .5, A.eighties + 1.6), hw = holeW(t);
        if (bu > 0) { ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(mixHex(CREAM, COOL.line, .5), .32 * bu); ctx.lineWidth = 30;
          const a0 = Math.PI / 2 + hw + .02, a1 = Math.PI / 2 - hw - .02 + Math.PI * 2;
          ctx.beginPath(); ctx.arc(OZ.x, OZ.y, BR, a0, lerp(a0, a1, bu)); ctx.stroke();
          ctx.strokeStyle = rgba(CREAM, .5 * bu); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(OZ.x, OZ.y, BR + 15, a0, lerp(a0, a1, bu)); ctx.stroke(); ctx.restore(); }
      });
      tag(ctx, SRC.ozone, OZ.x - 60, OZ.y + BR + 85, lab(t, A.ozone - .2, A.twoYears + 1.6), { size: 34 });
      // 2.13 the recovery axis under the globe: 1987 → the 2070s, a playhead walks slowly while the hole narrows
      const ru = span(t, A.sky + .1, A.sky + .9) * (1 - gone), ry = OZ.y + BR + 70, rx0 = OZ.x - 300, rx1 = OZ.x + 300;
      if (ru > 0) { X.lightLine(ctx, [[rx0, ry], [rx1, ry]], ru, { a: .6, w: 2.5 });
        for (const x of [rx0, rx1]) X.lightLine(ctx, [[x, ry - 12], [x, ry + 12]], ru, { a: .8, w: 2.5 });
        const p = ease(t, A.sky + .5, A.heal + 1.2), px = lerp(rx0, rx1, p);
        X.lightLine(ctx, [[rx0, ry], [px, ry]], 1, { col: rgba(CREAM, .95 * ru), w: 5 });
        ctx.fillStyle = rgba(CREAM, ru); ctx.beginPath(); ctx.arc(px, ry, 9, 0, Math.PI * 2); ctx.fill(); }
      X.label(ctx, SRC.heal, OZ.x, ry + 76, lab(t, A.heal - .3, A.canSet + .5), { size: 36, spacing: .1 });
    },
    screen(ctx, t) { F.source(ctx, t, A.heal - .1, A.canSet + .3, SRC.healSrc); },
  });

  // ------------------------------------------------------------------ 2.09–2.14 the Montreal axis, the treaty, the update cog
  const sign = (t, k) => span(t, A.signed - .3 + k * .2, A.signed + .1 + k * .2);
  beats.push({
    a: A.twoYears, b: A.canSet + 2, z: 7,
    wall(ctx, t) {
      const gone = span(t, A.canSet + .1, A.canSet + 1.4), axOut = span(t, A.update + .4, A.update + 1.4);
      // the axis May 1985 → Sept 1987 (just over two years), a playhead runs it and lands on 'treaty'
      const au = span(t, A.twoYears + .05, A.twoYears + .6) * (1 - axOut);
      if (au > 0) { X.lightLine(ctx, [[MT.x0, MT.y], [MT.x1, MT.y]], au, { a: .6, w: 2.5 });
        for (const x of [MT.x0, MT.x1]) X.lightLine(ctx, [[x, MT.y - 12], [x, MT.y + 12]], au, { a: .8, w: 2.5 });
        const p = ease(t, A.twoYears + .3, A.treatyW), px = lerp(MT.x0, MT.x1, p);
        X.lightLine(ctx, [[MT.x0, MT.y], [px, MT.y]], 1, { col: rgba(CREAM, .95 * au), w: 5 });
        ctx.fillStyle = rgba(CREAM, au); ctx.beginPath(); ctx.arc(px, MT.y, 10, 0, Math.PI * 2); ctx.fill(); }
      // the treaty rises out of the axis end (the playhead), four signatures on 'signed'
      const tu = ease(t, A.treatyW - .15, A.treatyW + .75);
      if (tu > 0) ground(ctx, 1 - gone, TR.x - 400, TR.x + 400, MT.y - 6, TH + 120, () => {
        const k = expoOut(tu), x = TR.x, y = lerp(MT.y - 40, TR.y, k);
        treaty(ctx, t, x, y, TW * lerp(.35, 1, k), { u: clamp(tu * 2), tight: ease(t, A.tightW + .1, A.tightW + 1.2), sign: [0, 1, 2, 3].map((i) => sign(t, i)) });
      });
      X.label(ctx, SRC.montreal, TR.x - 80, TR.y - TH / 2 - 44, lab(t, A.signed - .3, A.update + .6), { size: 34, spacing: .08 });
      X.label(ctx, SRC.update, TR.x, TR.y + TH / 2 + 86, lab(t, A.updW - .2, A.again + .2), { size: 40, spacing: .1 });
      X.label(ctx, SRC.sixTimes, TR.x, TR.y + TH / 2 + 86, lab(t, A.againW - .1, A.sky + .3), { size: 38, spacing: .08 });
      X.label(ctx, SRC.keptLearning, TR.x, TR.y + TH / 2 + 86, lab(t, A.fast + .5, A.canSet + .3), { size: 40, spacing: .1 });
    },
    screen(ctx, t) {
      F.source(ctx, t, A.signed, A.update + 1.2, SRC.montrealSrc);
      F.source(ctx, t, A.againW, A.sky + .9, SRC.sixSrc);
    },
  });

  // ------------------------------------------------------------------ 2.15 CAN BE SET · NOT IN A FEW MONTHS (on the wall, by the big gauges)
  beats.push({ a: A.setW - 1, b: A.plate, z: 10,
    wall(ctx, t) {
      const [cx, cy] = S.bigPos('cog', BIG.x, BIG.y, BIG.k);
      X.label(ctx, SRC.canSet, cx, cy - 112, lab(t, A.setW - .15, A.plate - .35), { size: 34, spacing: .12 });
      X.label(ctx, SRC.notFew, BIG.x, BIG.y + 250, lab(t, A.notFew - .1, A.plate - .3), { size: 38, spacing: .12 });
    } });

  return { keys, lights, beats, hudHide };
}

// a sheet (law / standards): x, y centre, w; o.title + o.tsize (wall units), o.dashed (not binding), o.boxes (empty boxes: the missing
// standards), o.u (lands), o.rot
function sheet(ctx, t, x, y, w, o = {}) {
  const h = w * 1.3, u = clamp(o.u ?? 1); if (u <= 0) return;
  const k = expoOut(u);
  ctx.save(); ctx.globalAlpha *= clamp(u * 3); ctx.translate(x, y + (1 - k) * 24); ctx.rotate(o.rot ?? 0);
  ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-w / 2 + 6, -h / 2 + 8, w, h);
  if (o.dashed) { ctx.fillStyle = rgba(PAPER.body, .1); ctx.fillRect(-w / 2, -h / 2, w, h); ctx.setLineDash([12, 9]); ctx.strokeStyle = rgba(PAPER.body, .85); ctx.lineWidth = 3; ctx.strokeRect(-w / 2, -h / 2, w, h); ctx.setLineDash([]); }
  else { ctx.fillStyle = mixHex(PAPER.lit, PAPER.body, .4); ctx.fillRect(-w / 2, -h / 2, w, h); }
  if (o.boxes) { ctx.strokeStyle = rgba(PAPER.body, .8); ctx.lineWidth = 2.5; for (let j = 0; j < 4; j++) { const yy = -h * .3 + j * h * .17; ctx.strokeRect(-w * .34, yy, w * .14, w * .14); ctx.fillStyle = rgba(PAPER.body, .45); ctx.fillRect(-w * .12, yy + w * .05, w * .46, Math.max(2, h * .014)); } }
  else { ctx.fillStyle = rgba(PAPER.faint, .55); for (let j = 0; j < 9; j++) ctx.fillRect(-w * .38, -h * .12 + j * h * .062, w * (j % 4 === 3 ? .42 : .76), Math.max(1.5, h * .013)); }
  if (o.title) F.goldText(ctx, [[o.title, 0]], 0, -h * .27, o.tsize ?? 30, F.rise(span(u, .3, 1)), { serif: false, weight: 800, align: 'center', col: PAPER.ink, glow: false, spacing: .04 });
  ctx.restore();
}
// the treaty: a sheet whose ruled lines are uneven and loose (tight = 0) and pull into an even, closer block (tight = 1);
// o.sign [4 × 0..1]: four signature scribbles at the foot
function treaty(ctx, t, x, y, w, o = {}) {
  const h = w * 1.3, u = clamp(o.u ?? 1); if (u <= 0) return;
  ctx.save(); ctx.globalAlpha *= u; ctx.translate(x, y);
  ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-w / 2 + 6, -h / 2 + 8, w, h);
  ctx.fillStyle = mixHex(PAPER.lit, PAPER.body, .35); ctx.fillRect(-w / 2, -h / 2, w, h);
  const tg = clamp(o.tight ?? 0);
  for (let j = 0; j < 10; j++) {
    const jit = Math.sin(j * 2.7) * .5 + .5, loose = -h * .3 + j * h * .058 + (jit - .5) * h * .03, firm = -h * .3 + j * h * .045;
    const len = lerp(.45 + .35 * jit, j % 5 === 4 ? .5 : .76, tg), dx = lerp((Math.cos(j * 1.9)) * w * .05, 0, tg);
    ctx.fillStyle = rgba(mixHex(PAPER.faint, PAPER.ink, .35 * tg), .6); ctx.fillRect(-w * .38 + dx, lerp(loose, firm, tg), w * len, Math.max(1.5, h * .013 * lerp(1, 1.4, tg)));
  }
  const sg = o.sign ?? [];
  ctx.strokeStyle = rgba(PAPER.ink, .8); ctx.lineWidth = Math.max(1.6, w * .011); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  sg.forEach((su, i) => { if (su <= 0) return; const bx = -w * .36 + (i % 2) * w * .4, by = h * .3 + Math.floor(i / 2) * h * .1, n = 14, m = Math.max(2, Math.round(n * su));
    ctx.beginPath(); for (let q = 0; q < m; q++) { const p = q / (n - 1), xx = bx + p * w * .3, yy = by - Math.sin(p * 9 + i) * w * .035 * (1 - p * .4) - p * w * .02; q ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); });
  ctx.restore();
}

export default async (T, R) => (await take(T)).entries(R);
