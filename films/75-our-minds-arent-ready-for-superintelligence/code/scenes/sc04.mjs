// c04 · B1 · 'Even the experts missed' → "Take Europe's AI law" · the experts missed, whose gut, we adapt (years vs months), Wilson (K1),
// INSTITUTIONS → RULES · LAWS → the seat belt → the cog. One take with c02, c03, c05 (lib/b1_take.mjs); the chart itself is drawn in sc03.
//
// | ID    | anchor (phrase)              | zeigt wörtlich                                                    | layer | carrier out                       |
// |-------|------------------------------|-------------------------------------------------------------------|-------|-----------------------------------|
// | 1.24  | Even the experts missed      | the axis runs on to 2030: a cool forecast flag at 2030, the real point at 2025 — they fall apart  | EXPL | the medal |
// | 1.25  | AI reached gold-medal        | a gold medal lands on July 2025, the flag on 2030: 5 YEARS EARLY + the two labels + source FRI    | EXPL | the curve |
// | 1.26  | If even the experts          | pull back: the curve runs up out of the chart to the small sphere; the niches under it: WHOSE GUT IS READY? | EXPL | the flint |
// | 1.27  | To be fair                   | the flint of the HUD drops onto the wall, big; a fine new scratch: “OUR EXTRAORDINARY CAPACITY FOR ADAPTATION” + source | EXPL | the scratches |
// | 1.28  | True. But we adapt over years| two time bars: YEARS (flint scratches, slow) · MONTHS (gold ticks, racing)                         | EXPL | the bars |
// | 1.29  | The machine moves in months  | the MONTHS bar runs off to the right; the three niches slide together into one card             | EXPL | the card |
// | 1.30  | had a sentence for this      | the card darkens and grows into the clip plate                                                  | MIX  | the plate |
// | 1.31  | slot K1                      | K1 · E. O. Wilson, 2017 (16.1 s, approved)                                                       | CLIP | the plate shrinks |
// | 1.32  | He wasn't talking about AI   | three lines on the wall: PALEOLITHIC EMOTIONS (ochre node) · MEDIEVAL INSTITUTIONS · GODLIKE TECHNOLOGY (the sphere) | EXPL | the middle line |
// | 1.33  | But listen to the middle     | the outer lines step back, the middle one grows                                                  | EXPL | the word |
// | 1.34  | Institutions. Rules. Laws.   | INSTITUTIONS, then it splits into two sheets: RULES · LAWS                                       | EXPL | the sheets |
// | 1.35  | A seat belt for the brain    | the sheets become a belt across you on the sofa while your eyes are on the phone; it tightens: A SEAT BELT FOR THE BRAIN | MIX | the buckle |
// | 1.36  | So how fast do rules move    | the buckle flies up and becomes the cog gauge, big and dashed: HOW FAST DO RULES MOVE?           | EXPL | the cog (→ c05) |
import { createCanvas } from '@napi-rs/canvas';
import { L, SRC, XS, F, S, X, E, GOLD, COOL, CREAM, OCHRE, COAT, PAPER, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, smooth, lab, ease, bump, ground, chX, chY, rectToScreen, take } from '../lib/b1_take.mjs';

export function part(K) {
  const { A, T } = K, beats = [], k1 = A.k1, C = L.CH;
  // ------------------------------------------------------------------ camera + light
  const keys = [
    [A.experts + 1.4, { x: -190, y: 800, s: .8 }],
    [A.farOff, { x: -178, y: 800, s: .82 }],
    [A.whose - .15, { x: -1100, y: 650, s: .45 }],
    [A.fair - .2, { x: -1110, y: 652, s: .46 }],
    [A.defines + .8, { x: -2950, y: 840, s: 1.0 }],
    [A.trueW + .2, { x: -2942, y: 842, s: 1.0 }],
    [A.overYears + .5, { x: -2932, y: 845, s: 1.0 }],
    [A.moves + .2, { x: -2922, y: 848, s: 1.0 }],
    [A.wilsonS + .35, { x: -1950, y: 1150, s: 1.05 }],
    [k1.start, { x: -1950, y: 1150, s: 1.22 }],
    [k1.end, { x: -1950, y: 1150, s: 1.16 }],
    [A.listen + .2, { x: -1950, y: 1155, s: 1.08 }],
    [A.belt - .2, { x: -1950, y: 1170, s: 1.05 }],
    [A.holds - .2, { x: -1950, y: 1880, s: 1.0 }],
    [A.howFast + .45, { x: -1950, y: 1890, s: 1.0 }],
    [A.howFast + 1.95, { x: -1950, y: 1595, s: 1.0 }],
  ];
  const lights = [[A.experts, -300, 800], [A.whose - 1.5, -1000, 500, 2], [A.fair, -2950, 700, 2.2], [A.overYears, -2950, 1000], [A.monthsW, -1950, 1150, 1.8],
    [A.belt + .3, -1950, 1900, 1.8], [A.howFast + .5, -1950, 1550, 1.6]];

  // ------------------------------------------------------------------ 1.24–1.26 the medal, the flag, the sphere, the gut question
  const MX = chX(2025.54), FX = chX(2030), Y0 = C.y;
  const out26 = (t) => span(t, A.fair - .3, A.fair + .7);
  beats.push({
    a: A.experts - .2, b: A.fair + 1.0, z: 6,
    wall(ctx, t) {
      // the forecast flag on 2030 (cool) and the real point on 2025 (gold): they fall apart; then the medal lands on the 2025 point
      const fu = span(t, A.experts + .3, A.experts + 1.0) * (1 - out26(t)), mu = span(t, A.experts + .6, A.experts + 1.2) * (1 - out26(t));
      ground(ctx, fu, FX - 200, FX + 200, Y0, 260, () => {
        X.lightLine(ctx, [[FX, Y0], [FX, Y0 - 210]], 1, { col: rgba(COOL.line, .9), w: 3.5, glowCol: COOL.halo });
        const wv = Math.sin(t * 2.1) * 6;
        ctx.fillStyle = rgba(COOL.body, .9); ctx.beginPath(); ctx.moveTo(FX, Y0 - 210); ctx.quadraticCurveTo(FX + 60, Y0 - 196 + wv, FX + 118, Y0 - 182); ctx.lineTo(FX, Y0 - 150); ctx.closePath(); ctx.fill();
      });
      if (mu > 0) {   // the real point: a gold drop line from the top of the frame down to 2025 on the axis, the medal lands on it
        const land = expoOut(span(t, A.reached + .7, A.reached + 1.3)), my = lerp(Y0 - 900, Y0 - 52, land);
        X.lightLine(ctx, [[MX, Y0 - 900], [MX, Y0]], mu, { col: rgba(GOLD.line, .5), w: 2, dash: [8, 8] });
        ctx.fillStyle = GOLD.core; ctx.beginPath(); ctx.arc(MX, Y0, 9 * mu, 0, Math.PI * 2); ctx.fill();
        if (land > 0) { ctx.save(); ctx.globalAlpha *= clamp(land * 4) * (1 - out26(t));
          ctx.fillStyle = rgba(COOL.body, .75); ctx.beginPath(); ctx.moveTo(MX - 30, my - 70); ctx.lineTo(MX - 6, my - 20); ctx.lineTo(MX - 16, my - 70); ctx.closePath(); ctx.fill();
          ctx.beginPath(); ctx.moveTo(MX + 30, my - 70); ctx.lineTo(MX + 6, my - 20); ctx.lineTo(MX + 16, my - 70); ctx.closePath(); ctx.fill();
          F.sphere(ctx, t, MX, my, 40, { dust: 80, seed: 9 });
          ctx.strokeStyle = rgba(GOLD.deep, .7); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(MX, my, 28, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
      }
      // 5 YEARS EARLY: a bracket from the medal to the flag (above the axis), the two labels under the axis
      const bu = span(t, A.five - .15, A.five + .55) * (1 - out26(t));
      if (bu > 0) { const y = 800, m = (MX + FX) / 2, hw = (FX - MX) / 2 * expoOut(bu);
        X.lightLine(ctx, [[m - hw, y + 26], [m - hw, y], [m + hw, y], [m + hw, y + 26]], 1, { a: .85, w: 3 });
        X.label(ctx, XS.early5, m, y - 26, lab(t, A.five, A.ifEven + 1.2), { size: 52, spacing: .12, gold: .8, col: GOLD.text }); }
      X.label(ctx, SRC.olympiad[0], MX, Y0 + 130, lab(t, A.olympiad - .2, A.ifEven + 1.0), { size: 30, spacing: .1, col: GOLD.text });
      X.label(ctx, SRC.olympiad[1], FX - 60, Y0 + 200, lab(t, A.expected - .3, A.ifEven + 1.0), { size: 30, spacing: .1, col: COOL.text });
      // 1.26: the sphere at the end of the curve (where it runs out of the chart), the gut question to the left
      const su = span(t, A.farOff - .2, A.whose - .2) * (1 - out26(t));
      if (su > 0) { const yr = 2025.86; F.sphere(ctx, t, chX(yr), chY(yr) - 40, 70 * expoOut(su), { dust: 160, a: 1 }); }
      X.big(ctx, SRC.gut, -1900, 300, 92, lab(t, A.whose - .1, A.fair + .3, .8), { gold: .25 });
    },
    screen(ctx, t) { F.source(ctx, t, A.olympiad, A.ifEven + 1.0, SRC.olympiadSrc); },
  });

  // ------------------------------------------------------------------ 1.27–1.29 the flint tablet, YEARS vs MONTHS, the niches → one card
  const FL = L.FL, TB = L.TB, HUDF = F.HUD.flint;
  const drop = (t) => ease(t, A.fair + .05, A.defines + .7);   // the HUD flint drops onto the wall
  const runOff = (t) => expoIn(span(t, A.monthsW - .05, A.monthsW + 1.0));
  beats.push({
    a: A.fair, b: A.wilsonS + 1.6, z: 6,
    wall(ctx, t, v) {
      const d = drop(t), leave = span(t, A.wilsonS - .2, A.wilsonS + 1.2);
      if (d >= 1) ground(ctx, 1 - leave, FL.x - 400, FL.x + 400, FL.y + 200, 600, () => F.flintClock(ctx, t, FL.x, FL.y, FL.s, { next: ease(t, A.defines + .5, A.adapt1 + .3), glow: .35 }));
      X.big(ctx, SRC.adapt, FL.x, FL.y + 330, 48, lab(t, A.researcher - .2, A.trueW + .5, .8), { gold: .15 });
      // YEARS: a flint-coloured bar, four tall scratches, slowly
      const yu = span(t, A.trueW + .5, A.overYears + .5) * (1 - leave);
      if (yu > 0) {
        X.lightLine(ctx, [[TB.x0, TB.yY], [TB.x1, TB.yY]], yu, { col: rgba(OCHRE.line, .7), w: 3, glowCol: OCHRE.mid });
        for (let k = 0; k < 4; k++) { const x = TB.x0 + 137 + k * 275, u = span(t, A.overYears + .35 + k * .42, A.overYears + .85 + k * .42) * (1 - leave);
          if (u > 0) X.lightLine(ctx, [[x, TB.yY - 34], [x + 6, TB.yY - 34 + 68 * u]], 1, { col: rgba(OCHRE.hot, .95), w: 6, glowCol: OCHRE.mid }); }
        X.label(ctx, SRC.years, TB.x0 - 30, TB.yY + 13, lab(t, A.years - .3, A.wilsonS + .5), { size: 36, spacing: .14, align: 'right', col: OCHRE.text });
      }
      // MONTHS: a gold bar with twelve ticks per year, racing in, then it runs off to the right (the race = screen right)
      const mu = span(t, A.moves + .05, A.moves + .45), ro = runOff(t);
      if (mu > 0 && ro < 1) {
        ctx.save(); ctx.translate(ro * 2600, 0);
        X.lightLine(ctx, [[TB.x0, TB.yM], [TB.x1, TB.yM]], mu, { col: rgba(GOLD.line, .85), w: 3, glowCol: GOLD.halo });
        for (let k = 0; k < 48; k++) { const x = TB.x0 + 12 + k * (TB.x1 - TB.x0 - 24) / 47, u = span(t, A.moves + .15 + k * .016, A.moves + .3 + k * .016);
          if (u > 0) { ctx.fillStyle = rgba(GOLD.hot, .95); ctx.fillRect(x - 2.5, TB.yM - 18 * u, 5, 36 * u); } }
        ctx.restore();
        X.label(ctx, SRC.months, TB.x0 - 30 + ro * 2600, TB.yM + 13, lab(t, A.moves + .2, A.monthsW + 2), { size: 36, spacing: .14, align: 'right', col: GOLD.text, gold: .8 });
      }
    },
    screen(ctx, t, v) {
      const d = drop(t); if (d <= 0 || d >= 1) return;   // the flight out of the HUD (screen space)
      const [tx, ty] = X.toScreen(v, FL.x, FL.y), x = lerp(HUDF[0], tx, d), y = lerp(HUDF[1], ty, d) - Math.sin(Math.PI * d) * 60;
      F.flintClock(ctx, t, x, y, lerp(HUDF[2], FL.s * v.s, d), { next: 0, glow: .35 * d });
    },
  });
  beats.push({ a: A.researcher - .3, b: A.trueW + 1.5, screen(ctx, t) { F.source(ctx, t, A.researcher, A.trueW + 1.0, SRC.adaptSrc); } });

  // ------------------------------------------------------------------ 1.29–1.34 the card → K1 → three lines → INSTITUTIONS → RULES · LAWS
  const WI = L.WI, CW = 430, CH = 270;
  const cardU = (t) => ease(t, A.monthsW - .1, A.monthsW + 1.0);
  const KO = 1.6;   // the plate shrinks back into the strip over 1.6 s (a big area change)
  const mIn = (t) => ease(t, k1.start - 1.0, k1.start), mOut = (t) => 1 - ease(t, k1.end, k1.end + KO);
  const lineU = (t, i) => span(t, k1.end + KO - .38 + i * .12, k1.end + KO + .5 + i * .12);
  beats.push({
    a: A.moves, b: A.belt + 1.6, z: 7,
    wall(ctx, t) {
      const cu = cardU(t);
      if (cu > 0 && t < k1.start - 1.0) {   // the card forms round the three niches as they slide together (dark, plate look)
        const k = expoOut(cu), w = lerp(700, CW, k), h = lerp(300, CH, k);
        ctx.save(); ctx.globalAlpha *= clamp(cu * 2.5);
        ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.roundRect(WI.x - w / 2 + 6, WI.y - h / 2 + 10, w, h, 14); ctx.fill();
        ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.beginPath(); ctx.roundRect(WI.x - w / 2, WI.y - h / 2, w, h, 14); ctx.fill();
        ctx.strokeStyle = rgba(P.cream, .95); ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
        const ic = 1 - span(t, k1.start - 1.6, k1.start - 1.1);   // three small ochre marks inside: the three reflexes
        for (let i = 0; i < 3; i++) { const x = WI.x + (i - 1) * 80, a = span(cu, .5 + i * .1, .9 + i * .1) * ic; if (a > 0) { halo(ctx, x, WI.y, 40, .5 * a, OCHRE.mid, OCHRE.hot); ctx.fillStyle = rgba(OCHRE.core, a); ctx.beginPath(); ctx.arc(x, WI.y, 9, 0, Math.PI * 2); ctx.fill(); } }
      }
      // 1.32 three lines (the plate has shrunk into a thin dark strip that opens into them)
      if (t >= k1.end + KO - .4) {
        const st = ease(t, A.listen + .25, A.middle + .3), inst = span(t, A.institutions - .2, A.institutions + .05), gone = span(t, A.institutions - .3, A.institutions + .2);
        const sl = 1 - span(t, k1.end + KO, k1.end + KO + .5);   // the strip
        if (sl > 0) { ctx.save(); ctx.globalAlpha *= sl; ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.strokeStyle = rgba(P.cream, .9); ctx.lineWidth = 3;
          ctx.beginPath(); ctx.roundRect(WI.x - 300 * (1 + .2 * (1 - sl)), WI.y - 40 * sl, 600 * (1 + .2 * (1 - sl)), 80 * sl, 10); ctx.fill(); ctx.stroke(); ctx.restore(); }
        const L1 = lab(t, k1.end + KO - .38, A.institutions + .1) * (1 - .55 * st), L3 = lab(t, k1.end + KO - .14, A.institutions + .1) * (1 - .55 * st);
        const dy = 40 * st;
        ctx.save(); ctx.globalAlpha *= 1 - .5 * st;
        X.label(ctx, SRC.wilson[0], WI.x, WI.y - 120 - dy, L1 > 0 ? lab(t, k1.end + KO - .38, A.institutions + .1) : 0, { size: lerp(48, 40, st), spacing: .12, col: OCHRE.text });
        X.label(ctx, SRC.wilson[2], WI.x, WI.y + 140 + dy, L3 > 0 ? lab(t, k1.end + KO - .14, A.institutions + .1) : 0, { size: lerp(48, 40, st), spacing: .12, gold: 1, col: GOLD.text });
        ctx.restore();
        const nu = lab(t, k1.end + KO - .38, A.institutions + .1) * (1 - st), su = lab(t, k1.end + KO - .14, A.institutions + .1) * (1 - st);
        if (nu > 0) { halo(ctx, WI.x - 420, WI.y - 136, 40, .6 * nu, OCHRE.mid, OCHRE.hot); ctx.fillStyle = rgba(OCHRE.core, nu); ctx.beginPath(); ctx.arc(WI.x - 420, WI.y - 136, 10, 0, Math.PI * 2); ctx.fill(); }
        if (su > 0) F.sphere(ctx, t, WI.x + 420, WI.y + 124, 26 * su, { dust: 40 });
        const mid = lab(t, k1.end + KO - .26, A.institutions + .05);
        X.label(ctx, SRC.wilson[1], WI.x, WI.y + 18, mid * (1 - gone), { size: lerp(48, 64, st), spacing: .12 });
        // INSTITUTIONS (big), then it splits into the two sheets
        X.big(ctx, SRC.institutions, WI.x, WI.y + 40, 120, lab(t, A.institutions - .05, A.rules + .05, .6) * inst, { gold: .1 });
      }
      // RULES · LAWS: two sheets; on 'A seat belt' they fly down and become the belt (beat below)
      const fl = ease(t, A.belt - .1, A.belt + .9);
      if (fl < 1) for (const [i, ttl, t0] of [[0, SRC.rulesLaws[0], A.rules], [1, SRC.rulesLaws[1], A.laws]]) {
        const u = span(t, t0 - .15, t0 + .5); if (u <= 0) continue;
        const x0 = WI.x + (i ? 190 : -190), y0 = WI.y + 20, [bx, by] = beltEnd(i);
        X.doc(ctx, t, lerp(x0, bx, fl), lerp(y0, by, fl) - Math.sin(Math.PI * fl) * 120, lerp(250, 40, fl), { u, title: ttl, rot: (i ? .05 : -.05) * (1 - fl) + fl * (i ? .6 : -.6) });
      }
    },
    screen(ctx, t, v) {
      if (t < k1.start - 1.0 || t >= k1.end + KO) return;
      const m = t < k1.start ? mIn(t) : t < k1.end ? 1 : mOut(t), dark = t < k1.start + .4 ? 1 - ease(t, k1.start - .9, k1.start + .4) : t > k1.end ? ease(t, k1.end, k1.end + 1.2) : 0;
      const from = t < k1.end ? rectToScreen(v, WI.x - CW / 2, WI.y - CH / 2, CW, CH) : rectToScreen(v, WI.x - 300, WI.y - 40, 600, 80);
      F.clipPlate(ctx, t, T, 'K1', { from, morph: m, dark });
    },
  });

  // ------------------------------------------------------------------ 1.35 the seat belt on the sofa · 1.36 the buckle becomes the cog
  const SO = L.SO, geo = X.sofa(createCanvas(8, 8).getContext('2d'), 0, SO.x, SO.y, 1, { look: .8 });
  const BA = [geo.chest[0] + 120, geo.chest[1] - 80], BB = [geo.chest[0] - 95, geo.chest[1] + 165];   // shoulder → hip (you face left)
  function beltEnd(i) { return i ? BB : BA; }
  const BU = [lerp(BA[0], BB[0], .5) + 6, lerp(BA[1], BB[1], .5)];
  const buckleFly = (t) => ease(t, A.howFast + .05, A.howFast + 1.25);
  beats.push({
    a: A.listen, b: A.take + .8, z: 8,
    wall(ctx, t) {
      const sink = span(t, A.howFast + .35, A.howFast + 1.35);
      ground(ctx, 1 - sink, SO.x - 700, SO.x + 700, SO.y + 230, 900, () => {
        X.sofa(ctx, t, SO.x, SO.y, 1, { look: .8, table: true, phone: { on: 1, draw: (c2, r) => F.headline(c2, t, r.x + r.w * .1, r.y + r.h * .16, r.w * .8, { u: 1, big: 1, bad: 1, a: .85 }) } });
        // the belt: drawn on between the two sheets as they land, it tightens on 'it holds'
        const bu = span(t, A.belt + .5, A.belt + 1.1), tight = ease(t, A.holds - .2, A.holds + .35);
        if (bu > 0) {
          const sag = lerp(46, 0, tight), mx = (BA[0] + BB[0]) / 2 + sag, my = (BA[1] + BB[1]) / 2 + sag * .5, pts = [];
          for (let i = 0; i <= 24; i++) { const u = i / 24, a = (1 - u) ** 2, b = 2 * u * (1 - u), c = u * u; pts.push([a * BA[0] + b * mx + c * BB[0], a * BA[1] + b * my + c * BB[1]]); }
          ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(P.night0, .5); ctx.lineWidth = 30; ctx.beginPath(); pts.slice(0, Math.max(2, Math.round(24 * bu) + 1)).forEach((p, i) => (i ? ctx.lineTo(p[0], p[1] + 4) : ctx.moveTo(p[0], p[1] + 4))); ctx.stroke(); ctx.restore();
          X.lightLine(ctx, pts, bu, { col: mixHex(PAPER.lit, CREAM, .5), w: 18, glowCol: P.halo2, blur: 14 });
          const sq = bump(t, A.holds - .05, .5);
          if (buckleFly(t) <= 0 && bu >= 1) buckle(ctx, BU[0] + sag * .5, BU[1] + sag * .25, 1 + .12 * sq);
        }
      });
      X.label(ctx, SRC.seatBelt, SO.x, 1625, lab(t, A.belt + .2, A.howFast + .2), { size: 54, spacing: .12 });
      // the buckle flies up and grows into the big dashed cog (sc05 carries it on from A.howFast + 1.25)
      const bf = buckleFly(t);
      if (bf > 0 && bf < 1) { const x = lerp(BU[0], L.COG.x, bf), y = lerp(BU[1], L.COG.y, bf) - Math.sin(Math.PI * bf) * 120;
        if (bf < .55) buckle(ctx, x, y, 1 + bf * 2);
        if (bf > .35) F.cogClock(ctx, t, x, y, L.COG.r * lerp(.25, 1, span(bf, .35, 1)), { dashed: 1, notch: 0, glow: .25 * span(bf, .35, 1), a: span(bf, .35, .6) }); }
      X.label(ctx, SRC.howFast, L.COG.x, L.COG.y + 270, lab(t, A.howFast + .5, A.take + .7), { size: 54, spacing: .12 });
    },
  });
  function buckle(ctx, x, y, k) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(.85); ctx.scale(k, k);
    ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(-26, -20, 56, 44);
    ctx.strokeStyle = CREAM; ctx.lineWidth = 6; ctx.strokeRect(-26, -22, 52, 44); ctx.fillStyle = CREAM; ctx.fillRect(-4, -22, 8, 44);
    ctx.restore();
  }
  return { keys, lights, beats };
}

export default async (T, R) => (await take(T)).entries(R);
