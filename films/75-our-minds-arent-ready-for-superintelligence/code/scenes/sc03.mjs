// c03 · B1 · 'Companies have it too' → 'Even the experts missed' · companies, Bengio (C2), REFLEX 3 STRAIGHT LINE, ★ IT DOUBLES.
// One take with c02, c04, c05 (lib/b1_take.mjs). The chart drawn here runs on into c04 (1.24–1.26 add the medal, the flag, the sphere).
//
// | ID    | anchor (phrase)              | zeigt wörtlich                                                    | layer | carrier out                       |
// |-------|------------------------------|-------------------------------------------------------------------|-------|-----------------------------------|
// | 1.14  | Companies have it too        | the hand of niche 2 flies out and clones into four big hands over a row of data halls (no number) | EXPL | the hands |
// | 1.15  | The biggest pour fortunes    | gold pours from the hands into the halls, they light up; a card rises: “NO CHOICE”               | EXPL | the card |
// | 1.16  | The scientist who co-chairs  | a horseshoe table line draws round the card; the card darkens and grows into the clip plate      | MIX  | the plate |
// | 1.17  | slot C2                      | C2 · Bengio, UN Security Council (720p source: plate at CLIP_RECT)                               | CLIP | the plate shrinks into the card |
// | 1.18  | Not a law of nature          | the card: NOT A LAW OF NATURE, struck through; A CHOICE in gold; the pouring stops               | EXPL | the strike line |
// | 1.19  | The third reflex             | the strike line flies into niche 3 and becomes its ruled line: STRAIGHT LINE · IT MAKES US LATE  | EXPL | the line |
// | 1.20  | Your brain expects tomorrow  | the line flies up into a chart: the same small step per day: TODAY + A LITTLE                     | EXPL | the line |
// | 1.21  | But this machine doesn't add | gold bars climb the line's steps … the third stalls: the step is wrong                           | EXPL | the bars |
// | 1.22★ | It doubles                   | the bars double, and again, and again, out of the frame (pull back): IT DOUBLES                  | EXPL | the curve |
// | 1.23  | On one leading measure       | the bars thin into task lengths on a time axis (2019 · 2023 · 2026), a curve through them: DOUBLES ROUGHLY EVERY 3.5 MONTHS + source | EXPL | the curve |
import { L, SRC, F, S, X, E, GOLD, COOL, CREAM, OCHRE, PAPER, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, smooth, lab, ease, bump, ground, grabHand, chX, chY, rectToScreen, prng, take } from '../lib/b1_take.mjs';

export function part(K) {
  const { A, T } = K, beats = [];
  const SI = L.SITE, c2 = A.c2, N = L.NI;
  const HX = [-1000, -760, -520, -280], CW = 560, CH = 160;
  const cardScreen = (v) => rectToScreen(v, SI.card[0] - CW / 2, SI.card[1] - CH / 2, CW, CH);
  // ------------------------------------------------------------------ camera + light
  const keys = [
    [A.they + .9, { x: -1993, y: 1494, s: .955 }],
    [A.too + .6, { x: -640, y: 1500, s: .97 }],
    [A.noChoice - .3, { x: -640, y: 1480, s: 1.0 }],
    [A.answered - 1.8, { x: -639, y: 1468, s: 1.01 }],
    [A.answered, { x: -636, y: 1290, s: 1.12 }],
    [c2.start, { x: -635, y: 1265, s: 1.16 }],
    [c2.end, { x: -635, y: 1255, s: 1.2 }],
    [A.third + .15, { x: -640, y: 1260, s: 1.16 }],
    [A.quiet + .3, { x: -1890, y: 1200, s: 1.1 }],
    [A.expects + .25, { x: -1880, y: 1190, s: 1.08 }],
    [A.expects + 1.5, { x: -880, y: 790, s: 1.0 }],
    [A.notAdd + .2, { x: -900, y: 800, s: 1.0 }],
    [A.doesnt + .4, { x: -905, y: 795, s: .99 }],
    [A.doublesW + .7, { x: -1000, y: 480, s: .55 }],
    [A.measure + 1.4, { x: -960, y: 545, s: .56 }],
    [A.months35 + .5, { x: -950, y: 560, s: .57 }],
  ];
  const lights = [[A.companies, -640, 1650, 1.8], [A.noChoice, -640, 1300], [A.third + .3, -1800, 1200, 1.8], [A.expects + .6, -950, 850], [A.doubles, -950, 400], [A.measure + 1, -900, 300, 3]];

  // ------------------------------------------------------------------ 1.14–1.18 the hands over the halls, NO CHOICE, the clip, A CHOICE
  const fly = (t) => ease(t, A.companies + .05, A.too + .45);           // the hand leaves niche 2
  const split = (t) => ease(t, A.too - .15, A.biggest + .2);           // … and clones into four
  const pour = (t) => span(t, A.pour - .25, A.pour + .25) * (1 - span(t, A.choice + .05, A.choice + .15));   // the emission (stops on 'A choice')
  const pourT0 = A.pour - .25, pourT1 = A.choice + .1;
  const exitSite = (t) => span(t, A.third + .3, A.third + 1.4);
  const HALLS = Array.from({ length: 5 }, (_, i) => ({ x: lerp(SI.x0 + 100, SI.x1 - 100, i / 4), w: 200 + (i % 2) * 20, h: 140 + (i % 3) * 18, t0: A.companies + .45 + i * .08 }));
  const drops = (() => { const r = prng(75), out = []; for (let i = 0; i < 56; i++) out.push({ h: i % 4, ph: r(), dx: (r() - .5) * 46, sp: .8 + r() * .5 }); return out; })();
  beats.push({
    a: A.companies - .1, b: A.quiet + 1.2, z: 3,
    wall(ctx, t, v) {
      const ex = exitSite(t);
      ground(ctx, 1 - ex, SI.x0 - 200, SI.x1 + 200, SI.y + 2, 1100, () => {
        X.lightLine(ctx, [[SI.x0 - 140, SI.y], [SI.x1 + 140, SI.y]], span(t, A.companies, A.companies + .9), { a: .45, w: 2.5 });
        // the halls: long low blocks; gold reaches their roof lines as it pours in
        HALLS.forEach((hl, i) => {
          const ru = span(t, hl.t0, hl.t0 + .55), gl = span(t, A.pour + .25 + i * .25, A.fortunes + 1.4 + i * .3);
          ground(ctx, ru, hl.x - hl.w, hl.x + hl.w, SI.y, hl.h + 20, () => {
            if (gl > 0) halo(ctx, hl.x, SI.y - hl.h, hl.w * 1.3, .32 * gl, GOLD.halo, GOLD.hot);
            ctx.fillStyle = mixHex(P.night0, P.ind2, .55); ctx.beginPath(); ctx.roundRect(hl.x - hl.w / 2, SI.y - hl.h, hl.w, hl.h, 6); ctx.fill();
            ctx.fillStyle = rgba(mixHex(P.blue1, GOLD.body, gl), .5 + .5 * gl); ctx.fillRect(hl.x - hl.w / 2, SI.y - hl.h, hl.w, 5);
            for (let j = 0; j < 5; j++) { ctx.fillStyle = rgba(GOLD.hot, .65 * span(gl, j * .15, j * .15 + .3)); ctx.fillRect(hl.x - hl.w / 2 + 16 + j * (hl.w - 32) / 5, SI.y - hl.h * .45, (hl.w - 32) / 5 - 8, 8); }
          });
        });
        // the falling gold (from each palm into the halls): drops on a loop, emitted while pouring
        if (t > pourT0 && t < pourT1 + 1.2) {
          for (const d of drops) {
            const hx = HX[d.h], L0 = SI.y - 150 - (SI.hands + 110), per = 1.3 / d.sp, tt = t - pourT0 - d.ph * per;
            if (tt < 0) continue;
            const birth = pourT0 + d.ph * per + Math.floor(tt / per) * per; if (birth > pourT1) continue;
            const f = (tt % per) / per, y = SI.hands + 110 + f * f * L0;
            ctx.fillStyle = rgba(GOLD.hot, .85 * (1 - f * .3)); ctx.beginPath(); ctx.arc(hx + d.dx * (.4 + f), y, 6 + 3 * (1 - f), 0, Math.PI * 2); ctx.fill();
          }
        }
      });
      // the hand: out of niche 2, over to the site, then four hands (they grab, then pour: they tip a little while pouring)
      const fu = fly(t), sp = split(t);
      if (fu > 0 && ex < 1) {
        const src = [N.xs[1], N.icy], mid = [lerp(src[0], -640, fu), lerp(src[1], SI.hands, fu) - Math.sin(Math.PI * fu) * 200];
        const s = lerp(N.w * .32, 150, expoOut(fu)), stop = ease(t, A.choice - .1, A.choice + .5);
        ground(ctx, 1 - ex, SI.x0 - 300, SI.x1 + 300, SI.y + 2, 1100, () => {
          for (let i = 0; i < 4; i++) {
            const x = lerp(mid[0], HX[i], sp), y = lerp(mid[1], SI.hands, sp), tip = (.25 * pour(t) * (1 - stop) + .04 * Math.sin(t * 2.2 + i) * (1 - stop)) * (i < 2 ? -1 : 1);
            grabHand(ctx, t, x, y, s, lerp(1, .35, span(t, A.pour - .3, A.pour + .2)), { rot: tip, flip: ease(t, A.companies + .1, A.too + .3), glow: .4 * pour(t), a: i === 0 ? 1 : clamp(sp * 3) });
          }
        });
      }
      // the card: “NO CHOICE” rises from between the hands; before the clip it darkens into the plate's look; after the clip it is the
      // dark card of NOT A LAW OF NATURE (struck through) with A CHOICE under it in gold
      const cu = span(t, A.noChoice - .2, A.noChoice + .5), dk = ease(t, A.council + .05, A.council + .5);
      const before = t < c2.start - .9, after = t >= c2.end + .7;
      if (cu > 0 && (before || after) && ex < 1) {
        const [cx, cy] = SI.card, k = expoOut(cu);
        ground(ctx, 1 - ex, cx - CW, cx + CW, SI.y + 2, 1400, () => {
          ctx.save(); ctx.translate(cx, cy + (1 - k) * 160); ctx.globalAlpha *= clamp(cu * 3);
          const paper = before ? 1 - dk : 0;
          ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.roundRect(-CW / 2 + 6, -CH / 2 + 10, CW, CH, 12); ctx.fill();
          ctx.fillStyle = mixHex(mixHex(P.night0, P.ind0, .4), PAPER.lit, paper); ctx.beginPath(); ctx.roundRect(-CW / 2, -CH / 2, CW, CH, lerp(14, 8, paper)); ctx.fill();
          ctx.strokeStyle = rgba(mixHex(P.cream, PAPER.edge, paper), .95); ctx.lineWidth = 3; ctx.stroke();
          ctx.restore();
          if (before) F.goldText(ctx, [[SRC.noChoice, 0]], cx, cy + 26 + (1 - k) * 160, 76, F.rise(span(cu, .25, 1)) * (1 - dk), { serif: true, align: 'center', col: mixHex(PAPER.ink, P.cream, dk) });
          if (after) {
            const lu = span(t, A.notLaw - .1, A.notLaw + .5), st = ease(t, A.natureE - .05, A.natureE + .4), fl = flyLine(t);
            F.goldText(ctx, [[SRC.lawOfNature, 0]], cx, cy + 20, 50, F.rise(lu), { serif: false, weight: 700, spacing: .08, align: 'center', col: mixHex(P.cream, P.halo2, st * .6) });
            if (st > 0 && fl <= 0) X.lightLine(ctx, [[cx - 245, cy + 2], [cx + 245, cy + 2]], st, { col: rgba(OCHRE.hot, .95), w: 5, glowCol: OCHRE.mid });
            X.big(ctx, SRC.choice, cx, cy - 150, 96, lab(t, A.choice - .1, A.third + 1.3, .6), { gold: 1 });
          }
        });
      }
      // the horseshoe table of the Security Council: a cream U round the card (open towards us), seats as dots
      const hs = span(t, A.united - .2, A.council + .3) * (1 - span(t, c2.start - .9, c2.start - .5)) + span(t, c2.end + .6, c2.end + 1.4) * (1 - span(t, A.notLaw + 2, A.notLaw + 2.8));
      if (hs > 0) {
        const [cx, cy] = SI.card, rx = 420, ry = 230, a0 = Math.PI / 2 + .55, a1 = Math.PI / 2 + 2 * Math.PI - .55, n = 120, pts = [];
        for (let i = 0; i <= n; i++) { const q = lerp(a0, a1, i / n); pts.push([cx + Math.cos(q) * rx, cy + 20 + Math.sin(q) * ry]); }
        X.lightLine(ctx, pts, sineIO(hs), { a: .55, w: 3 });
        for (let i = 0; i < 17; i++) { const f = (i + .5) / 17; if (f > sineIO(hs)) break; const q = lerp(a0, a1, f); halo(ctx, cx + Math.cos(q) * (rx + 26), cy + 20 + Math.sin(q) * (ry + 22), 16, .5, P.halo2, P.cream); }
      }
    },
    screen(ctx, t, v) {
      // the clip: the card (dark) grows into the plate; after the clip the plate shrinks back into the card
      const mIn = ease(t, c2.start - .9, c2.start), mOut = 1 - ease(t, c2.end, c2.end + .7);
      if (t >= c2.start - .9 && t < c2.end + .7) {
        const m = t < c2.start ? mIn : t < c2.end ? 1 : mOut, dark = t < c2.start ? 1 - span(t, c2.start - .5, c2.start) : t > c2.end ? span(t, c2.end, c2.end + .4) : 0;
        F.clipPlate(ctx, t, T, 'C2', { from: cardScreen(v), morph: m, dark });
      }
    },
  });
  // the strike line flies into niche 3 and becomes its ruled line (1.19)
  const flyLine = (t) => ease(t, A.third + .1, A.quiet + .25);
  beats.push({
    a: A.third, b: A.quiet + .4, z: 6,
    wall(ctx, t) {
      const u = flyLine(t); if (u <= 0 || u >= 1) return;
      const [cx, cy] = SI.card, ic = [N.xs[2], N.icy], s = N.w * .36;
      const x = lerp(cx, ic[0], u), y = lerp(cy + 2, ic[1], u) - Math.sin(Math.PI * u) * 260, hw = lerp(245, s * 1.1, u), rot = lerp(0, -Math.atan2(s, s * 2), u);
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      X.lightLine(ctx, [[-hw, 0], [hw, 0]], 1, { col: rgba(mixHex(OCHRE.hot, OCHRE.mid, u), .95), w: lerp(5, 4, u), glowCol: OCHRE.mid });
      ctx.restore();
    },
  });
  beats.push({   // IT MAKES US LATE under niche 3
    a: A.late - .3, b: A.expects + 1.5, z: 7,
    wall(ctx, t) { X.label(ctx, SRC.late, N.xs[2] + 40, N.y + 120, lab(t, A.late - .1, A.expects + 1.0), { size: 38, spacing: .12, col: OCHRE.text }); },
  });

  // ------------------------------------------------------------------ 1.20–1.23 the chart: today + a little · it doubles · task length
  const C = L.CH, X0 = C.x0, Y0 = C.y, STEP = 100, DY = 14, NS = 12;
  const lineY = (x) => Y0 - 70 - DY * (x - X0) / STEP;
  const lineFly = (t) => ease(t, A.expects + .1, A.expects + 1.3);
  const dotT = (i) => A.expects + 1.35 + i * ((A.plus + .5) - (A.expects + 1.35)) / NS;   // one step a day, the last on 'a little'
  const BX = (k) => X0 + 50 + k * STEP, H0 = 77;
  const yrs = [2019, 2020.2, 2021.4, 2022.6, 2023.8, 2025.0];
  // bar heights over time: 1.21 bar 0, bar 1 (+ a little), bar 2 stalls; 1.22 they double (bar k = H0·2^k), bar 5 runs out of the frame
  const dT = (k) => A.doubles + .05 + (k - 1) * .2;
  const barH = (t, k) => {
    let h = 0;
    if (k === 0) h = H0 * expoOut(span(t, A.notAdd + .1, A.notAdd + .45));
    if (k === 1) h = (H0 + DY) * expoOut(span(t, A.notAdd + .4, A.notAdd + .75));
    if (k === 2) h = (H0 + 2 * DY) * .62 * expoOut(span(t, A.doesnt - .1, A.doesnt + .35));
    if (k >= 1) { const d = expoOut(span(t, dT(k), dT(k) + .45)); h = lerp(h, H0 * 2 ** k, d); }
    return h;
  };
  const morphT = (t) => ease(t, A.measure + .15, A.measure + 1.6);   // bars → task lengths on the curve
  beats.push({
    a: A.expects, b: A.fair + 1.0, z: 5,
    wall(ctx, t, v) {
      // the straight line flies out of niche 3 (a copy of its ruled line) and becomes the chart's first step
      const lf = lineFly(t);
      if (lf > 0 && lf < 1) { const ic = [N.xs[2], N.icy], s = N.w * .36, x = lerp(ic[0], X0 + 60, lf), y = lerp(ic[1], lineY(X0 + 60), lf) - Math.sin(Math.PI * lf) * 160;
        X.lightLine(ctx, [[x - lerp(s, 60, lf), y + lerp(s * .5, 7, lf)], [x + lerp(s, 60, lf), y - lerp(s * .5, 7, lf)]], 1, { col: rgba(OCHRE.hot, .95), w: 4, glowCol: OCHRE.mid }); }
      const out = span(t, A.fair - .2, A.fair + .9);   // (c04) the chart sinks when the flint takes over
      if (out >= 1) return;
      ctx.save(); ctx.globalAlpha *= 1 - out;
      // the axis (baseline), extended right to 2030 in c04 (1.24)
      const ax = span(t, A.expects + .6, A.expects + 1.4), ext = ease(t, A.experts - .1, A.experts + 1.0);
      X.lightLine(ctx, [[X0 - 40, Y0], [lerp(-200, chX(2030) + 60, ext), Y0]], ax, { a: .6, w: 3 });
      // the straight line: one dot per day, each one step a little higher; it dims when the machine's bars take over
      const dim = 1 - .6 * span(t, A.measure, A.measure + 1);
      for (let i = 0; i <= NS; i++) {
        const u = span(t, dotT(i) - .1, dotT(i) + .15); if (u <= 0) break;
        const x = X0 + i * STEP, y = lineY(x);
        if (i > 0) X.lightLine(ctx, [[x - STEP, lineY(x - STEP)], [x, y]], u, { col: rgba(OCHRE.body, .9 * dim), w: 4, glowCol: OCHRE.mid });
        ctx.fillStyle = rgba(OCHRE.core, dim); ctx.beginPath(); ctx.arc(x, y, 8 * expoOut(u), 0, Math.PI * 2); ctx.fill();
      }
      X.label(ctx, SRC.plusLittle, -560, 650, lab(t, A.plus - .25, A.notAdd + 1.2), { size: 46, spacing: .12, col: OCHRE.text });
      // the machine: gold bars on the same steps … then they double (1.22) … then they thin into task lengths on a curve (1.23)
      const m = morphT(t), sh = bump(t, A.doesnt + .3, .5) * (1 - span(t, dT(2), dT(2) + .1));
      const tops = [];
      for (let k = 0; k < 6; k++) {
        const h = barH(t, k); if (h <= .5) { tops.push(null); continue; }
        const x0 = BX(k), x = lerp(x0, chX(yrs[k]), m), hh = lerp(h, Y0 - chY(yrs[k]), m), bw = lerp(56, 8, m), jig = k === 2 ? Math.sin(t * 60) * 4 * sh : 0;
        const fl = k >= 1 ? bump(t, dT(k), .6) : 0;
        if (fl > 0) halo(ctx, x, Y0 - hh, 150, .55 * fl, GOLD.halo, GOLD.hot);
        ctx.fillStyle = lin2(ctx, x, Y0 - hh, Y0); ctx.fillRect(x - bw / 2 + jig, Y0 - hh, bw, hh);
        if (sh > 0 && k === 2) { ctx.strokeStyle = rgba(OCHRE.hot, .9 * sh); ctx.lineWidth = 4; ctx.strokeRect(x - bw / 2 - 6, Y0 - hh - 6, bw + 12, hh + 12); }
        tops.push([x, Y0 - hh]);
        if (m > 0) { ctx.fillStyle = GOLD.core; ctx.beginPath(); ctx.arc(x, Y0 - hh, 11 * m, 0, Math.PI * 2); ctx.fill(); }
      }
      // the curve: through the tops while they double, then the smooth exponential of the task length (runs out of the frame at the top)
      const cu = span(t, dT(1), dT(5) + .5);
      if (cu > 0 && m <= 0) { const pts = tops.filter(Boolean); if (pts.length > 1) X.lightLine(ctx, pts, cu, { col: rgba(GOLD.line, .8), w: 3, glowCol: GOLD.halo }); }
      if (m > 0) {
        const yEnd = lerp(2025.2, 2025.86, ease(t, A.ifEven - .2, A.whose)), pts = [];
        for (let yr = 2019; yr <= yEnd + 1e-6; yr += .05) pts.push([chX(yr), chY(yr)]);
        X.lightLine(ctx, pts, m, { col: rgba(GOLD.line, .95), w: 4, glowCol: GOLD.halo });
      }
      // years under the axis
      const yu = span(t, A.task - .4, A.task + .6);
      [[2019, '2019'], [2023, '2023'], [2026, '2026']].forEach(([yr, s], i) => { const x = chX(yr), u = span(yu, i * .15, .6 + i * .15); if (u <= 0) return;
        X.lightLine(ctx, [[x, Y0 - 14], [x, Y0 + 14]], u, { a: .8, w: 3 }); X.label(ctx, s, x, Y0 + 64, u * (1 - span(t, A.ifEven, A.ifEven + .6)), { size: 46, weight: 600 }); });
      X.big(ctx, SRC.doubles, -330, -60, 110, lab(t, A.doublesW - .3, A.measure + .9, .6), { gold: 1 });
      X.big(ctx, SRC.metr, X0, 150, 66, lab(t, A.dbl2 - .2, A.experts + 1.9, .8), { gold: .45, align: 'left' });
      ctx.restore();
    },
    screen(ctx, t) { F.source(ctx, t, A.dbl2 - .1, A.experts + 1.8, SRC.metrSrc); },
  });
  return { keys, lights, beats };
}
// a gold bar: bright top, deeper base
function lin2(ctx, x, y0, y1) { return E.lin(ctx, x, y0, x, y1, [[0, GOLD.core], [.25, GOLD.body], [1, GOLD.mid]]); }

export default async (T, R) => (await take(T)).entries(R);
