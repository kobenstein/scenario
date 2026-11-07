// Film 19 · c11 (B3) · nets 2 + 3: the Black Monday brake, March 2020, stress tests · ★ three nets in morning light · THE HOLE: data-center
// debt · Hyperion · the separate company · protection 5 · one question. 418.70 → 515.36 (shots.md 11.01–11.21).
// One picture under the road (plateNet) with a world camera on the words; the vignettes (1987 floor, Hyperion) open as windows from a
// lit rect of the picture and close back into it; the message's send arrow → the HUD counter grows (shared with c12: lib/f19_b3 stage1000).
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f19_kit.mjs';
import * as PR from '../lib/f19_props.mjs';
import { hourglass } from '../lib/f13_kit.mjs';
import { stamp } from '../lib/f16_kit.mjs';
import { plateNet, seamWindow, SEAM_HALF } from '../lib/f19_seams.mjs';
import * as B from '../lib/f19_b3.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, quartIO, halo, glowFill, lin, prng } = B;
const { RED, COOL } = F;

export default async (T, R) => {
  const A = R.a, g = (p, n = 0) => T.G(p, n, A - .5), ge = (p, n = 0) => T.GE(p, n, A - .5);
  const S = {
    dow: g('the Dow'), quarter: g('quarter'), single: g('single day'),
    after: g('After that'), brake: g('emergency brake'), ifp: g('If prices fall'), stops: g('trading stops'),
    march: g('In March'), pandemic: g('pandemic'), pulled: g('pulled four'), two: g('two weeks'),
    each: g('Each time'), fifteen: g('fifteen minutes'), breathe: g('breathe'),
    nov: g('On November fifth'), never: g('never pulled'),
    fin: g('After the financial crisis'), third: g('third net'), stress: g('stress tests'),
    every: g('Every year'), night: g('nightmare crash'), banks: g('biggest banks'), survive: g('survive it'),
    three: g('Three crashes'), nets3: g('Three nets'),
    but: g('But this boom'), hole: g('hole in it'),
    growing: g('A growing part'), borrowed: g('never borrowed'),
    take: g('Take one giant'), louis: g('Louisiana'), meta: g('built for Meta'),
    about: g('About twenty-seven'), sep: g('separate company'), firm: g('investment firm'),
    books: g('Not on Meta'), own: g('own books'),
    none: g('None of the three'), ins: g('no insurance'), nobr: g('no brake'), nost: g('no stress test'),
    help: g('What would help'), visible: g('debt visible'), who: g('Who holds it'), much: g('how much'), pays: g('who pays'),
    testing: g('And testing it'), tested: g('banks are tested'),
    everyone: g('Every one of these'), damage: g('after the damage'), before: g('built before'),
    fifth: g("That's the fifth"), alone: g('alone'),
    law: g('Lawmakers'), decide: g('decide it'),
    q: g("Here's one question"), rep: g('representative'),
    whoq: g('Who holds the debt'), check: g('checking it'), checkE: ge('checking it'),
  };
  const T0 = A, Bend = R.b;
  // breathing pushes between keys were dropped (calm.py): the camera holds, the engine float keeps it alive
  // the pull times of March 2020 (four pulls in under two weeks, on the words)
  const pulls = [S.pulled, g('four times'), g('in under'), S.two];
  const K = [
    [T0 + SEAM_HALF, B.V0],
    [S.brake - .3, { x: 1110, y: 375, s: 1.85 }, 's', 2.8],   // moves while the 1987 window closes into its plate
    [S.march, { x: 1110, y: 375, s: 1.85 }],
    [S.march + 1.0, { x: 925, y: 380, s: 1.52 }],
    [S.fin, { x: 925, y: 380, s: 1.52 }],
    [S.third, { x: 1390, y: 392, s: 1.78 }],
    [S.three, { x: 1390, y: 392, s: 1.78 }],
    [S.nets3 + 1.1, { x: 1150, y: 470, s: .8 }],
    [S.hole + .1, { x: 2075, y: 470, s: 1.0 }],
    [S.growing + 2.0, { x: 1800, y: 450, s: 1.05 }],
    [S.take, { x: 1800, y: 450, s: 1.05 }],
    [S.about + .4, { x: 2040, y: 410, s: 1.24 }],
    [S.books, { x: 2040, y: 410, s: 1.24 }],
    [S.ins - .3, { x: 1700, y: 470, s: .9 }],
    [S.help + .2, { x: 1700, y: 470, s: .9 }],
    [S.visible + .2, { x: 2060, y: 400, s: 1.25 }],
    [S.testing + .3, { x: 2060, y: 400, s: 1.25 }],
    [S.everyone + 1.2, { x: 2075, y: 560, s: 1.15 }],   // one move to the fourth net and the hands under it, then it holds
  ];
  const cam = (t) => { const V = B.vcam(t, K), d = smooth(span(t, T0 + SEAM_HALF, T0 + 1.6)); return { x: V.x + B.drift(t, 1.2 * d, 3), y: V.y + B.drift(t, .9 * d, 7), s: V.s * (1 + B.drift(t, .0012 * d, 11)) }; };
  const warmAt = (t) => .6 * smooth(span(t, S.three, S.nets3 + 1.5));

  // ------------------------------------------------------------------------------------------------- the whole picture
  function draw(ctx, t) {
    const V = cam(t), warm = warmAt(t), red = 1 - smooth(span(t, S.three - .4, S.three + .4));   // no red from 11.08 on
    B.underBack(ctx, t, warm);
    B.deckW(ctx, t, V, warm);
    // the data-center gap: a darker well below the road there, and the label on the deck's underside
    {
      ctx.save(); B.vset(ctx, V);
      const hole = smooth(span(t, S.but, S.hole + .6));
      ctx.fillStyle = lin(ctx, 1640, 0, 2510, 0, [[0, rgba(P.night0, 0)], [.25, rgba(P.night0, .5 * hole)], [.75, rgba(P.night0, .5 * hole)], [1, rgba(P.night0, 0)]]); ctx.fillRect(1640, B.DECK + 60, 870, 1600);
      const la = smooth(span(t, S.but + .2, S.but + .9));
      if (la > 0) E.glowText(ctx, 'DATA CENTER DEBT', 2075, B.DECK - 34 + (1 - expoOut(la)) * 10, { size: 26, align: 'center', spacing: .12, col: COOL.core, glow: false, a: la });
      ctx.restore();
    }
    // fund towers (behind), rise in the gap when the money goes there
    B.towers(ctx, t, B.layer(V, .92), { rise: span(t, S.growing + .2, S.growing + 1.8), sink: span(t, S.take + 1.0, S.about), slit: 1 });
    // pillars: plates light on "Three crashes"
    const pl = [0, 1, 2].map((i) => smooth(span(t, S.three + i * .22, S.three + i * .22 + .4)));
    B.pillarsW(ctx, t, V, { lit: [lerp(.4, 1, pl[0]), 1, lerp(.4 + .6 * smooth(span(t, S.fin, S.fin + .6)), 1, pl[2])], warm, dc: true });
    // the nets: Black Monday's net lights when the brake is pulled, the stress-test net on "third net", all gold on "Three nets"
    const n87 = smooth(span(t, S.stops + .3, S.stops + 1.6)), n08 = smooth(span(t, S.third, S.third + 1.2));
    const all = (i) => smooth(span(t, S.nets3 + i * .25, S.nets3 + i * .25 + .6));
    const reachDim = 1 - .35 * smooth(span(t, S.none, S.none + .6)) * (1 - smooth(span(t, S.everyone, S.everyone + 1)));
    const lit = [lerp(lerp(.25, .7, n87), 1, all(1)) * reachDim, lerp(lerp(.25, .7, n08), 1, all(2)) * reachDim, lerp(.55, 1, all(0)) * reachDim];
    B.netsW(ctx, t, V, { lit, fg: 1.25 });
    B.netRun(ctx, V, [960, 520], [330, 520], 70, span(t, S.stops + .2, S.stops + 1.4));
    B.netRun(ctx, V, [1590, 520], [960, 520], 70, span(t, S.third, S.third + 1.1));
    if (warm > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); halo(ctx, W * .5, H * 1.05, W * .7, .22 * warm); halo(ctx, W * .92, H * .55, W * .45, .16 * warm); ctx.restore(); }

    // ---- 11.02–11.05 the brake gauge + lever on the 1987 pillar
    const gA = smooth(span(t, S.after + .5, S.after + 1.4)) * (1 - smooth(span(t, S.three - .2, S.three + .8)) * .0);
    const pullsA = pulls.map((p) => expoIn(span(t, p - .06, p + .04)) * (1 - smooth(span(t, p + .16, p + .38))));
    const firstPull = expoIn(span(t, S.stops - .08, S.stops + .06)) * (1 - smooth(span(t, S.stops + 1.3, S.stops + 2.2)));
    const pull = Math.max(firstPull, ...pullsA);
    // the day's line: 1987-style demo (to −7, the brake catches), four March days, then Nov 5 (−4.4, no halt)
    let line = null;
    if (t >= S.ifp && t < S.march + .3) line = { u: span(t, S.ifp + .5, S.stops), to: 7, a: 1 - smooth(span(t, S.march - .2, S.march + .3)) };
    else if (t >= S.pandemic - .4 && t < S.nov) {
      const k = pulls.findIndex((p, i) => t < (pulls[i + 1] ?? 1e9) - .25), p0 = k <= 0 ? S.pandemic : pulls[k - 1] + .1, p1 = pulls[Math.max(0, k)];
      line = { u: span(t, p0, p1 - .02), to: 7, x0: 0, a: 1 - smooth(span(t, S.nov - .4, S.nov)) };
      if (t > S.two) line = { u: 1, to: 7, a: 1 - smooth(span(t, S.nov - .4, S.nov)) };
    } else if (t >= S.nov) line = { u: span(t, S.nov + .3, S.never - .1), to: 4.4, label: '−4.4 %', labelA: smooth(span(t, S.never - .3, S.never + .2)) * (1 - smooth(span(t, S.fin, S.fin + .4))), a: 1 };
    if (line && t > S.fin) line.u = Math.min(line.u, 1 - expoIn(span(t, S.fin + .05, S.fin + .8)));
    const hot = [smooth(span(t, S.stops - .1, S.stops + .2)) * (1 - smooth(span(t, S.march, S.march + .5))) + pullsA.reduce((p, q) => Math.max(p, q), 0), 0, 0];
    if (gA > 0) {
      const gOut = 1 - smooth(span(t, S.fin + .4, S.fin + 1.4)), ret = 1 - expoIn(span(t, S.fin + .1, S.fin + .9));
      B.gauge(ctx, t, V, { a: gA, marks: span(t, S.ifp - .1, S.ifp + .9) * ret, zero: span(t, S.after + .5, S.after + 1.2) * ret, hot, line });
      // labels: CIRCUIT BREAKERS above, S&P 500 at the zero line
      ctx.save(); B.vset(ctx, V);
      const la = smooth(span(t, S.brake - .1, S.brake + .5)) * gOut;
      const sink = expoIn(span(t, S.fin + .1, S.fin + .7));
      ctx.save(); ctx.beginPath(); ctx.rect(B.GAUGE.x - 20, B.GAUGE.y - 80, 600, 70); ctx.clip();
      E.glowText(ctx, 'CIRCUIT BREAKERS', B.GAUGE.x, B.GAUGE.y - 44 + (1 - expoOut(la)) * 30 + sink * 40, { size: 24, spacing: .1, a: la });
      ctx.restore(); ctx.save(); ctx.beginPath(); ctx.rect(B.GAUGE.x - 20, B.GAUGE.y - 34, 600, 26); ctx.clip();
      E.glowText(ctx, 'S&P 500 · ONE DAY', B.GAUGE.x, B.GAUGE.y - 14 + sink * 26, { size: 14, spacing: .12, col: P.halo2, glow: false, a: smooth(span(t, S.ifp, S.ifp + .6)) });
      ctx.restore();
      const nh = smooth(span(t, S.never, S.never + .5));
      if (nh > 0) B.rtext(ctx, 'NO HALT', B.GAUGE.x, B.gy(20) + 52, { size: 30, spacing: .12 }, nh, sink);
      ctx.restore();
    }
    const lOut = smooth(span(t, S.brake - .5, S.brake + .3)) * (1 - smooth(span(t, S.fin + .4, S.fin + 1.4)));
    B.lever(ctx, t, V, { out: lOut, pull, calm: 1 - red, flash: Math.max(...pullsA, firstPull) * .8, tremble: smooth(span(t, S.never - .6, S.never)) * (1 - smooth(span(t, S.never + .8, S.never + 1.3))) });
    // ---- 11.03 March 2020 calendar (drops in from behind the deck), days light on each pull; 11.05 the page turns to NOV 5
    const calA = span(t, S.march + .5, S.march + 1.4), calUp = smooth(span(t, S.fin + .2, S.fin + 1.2));
    if (calA > 0 && calUp < 1) {
      const days = [9, 12, 16, 18], litD = {}; days.forEach((d, i) => (litD[d] = smooth(span(t, pulls[i], pulls[i] + .25))));
      const page = t >= S.nov + .25 ? 'nov' : 'mar';
      const flip = t >= S.nov - .2 && t < S.nov + .7 ? Math.abs(Math.cos(Math.PI * span(t, S.nov - .2, S.nov + .7))) : 1;
      ctx.save(); B.vset(ctx, V);
      B.calendar(ctx, t, V, { drop: calA * (1 - calUp), lit: litD, page, sway: 1, flip });
      ctx.restore();
      ctx.save(); B.vset(ctx, V);
      const cc = smooth(span(t, S.two - .3, S.two + .4)) * (1 - smooth(span(t, S.nov - .3, S.nov)));
      B.rtext(ctx, 'THE COVID CRASH', B.CAL.x + 166, B.CAL.y + 64 + 5 * 44 + 18 + 36, { size: 24, spacing: .1, align: 'center' }, span(t, S.two - .3, S.two + .4), span(t, S.nov - .4, S.nov));
      ctx.restore();
    }
    // ---- 11.04 the hourglass: fifteen minutes (stands up beside the gauge, sand runs while the line holds)
    const hgA = smooth(span(t, S.each + .1, S.fifteen)) * (1 - smooth(span(t, S.nov + .2, S.nov + .9)));
    if (hgA > 0) {
      ctx.save(); B.vset(ctx, V);
      const hx = 1330, hy = 556, up = expoOut(span(t, S.each + .1, S.fifteen));
      ctx.translate(hx, hy); ctx.rotate((1 - up) * Math.PI / 2); ctx.translate(-hx, -hy);
      const run = span(t, S.fifteen, S.nov + .5);
      hourglass(ctx, hx, hy, 118, t, { top: lerp(.8, .45, run), bot: lerp(.08, .4, run), flow: up > .95 ? 1 : 0, a: hgA });
      ctx.restore();
      ctx.save(); B.vset(ctx, V);
      E.glowText(ctx, '15:00', 1386, 520 + (1 - expoOut(span(t, S.fifteen - .1, S.fifteen + .4))) * 8, { size: 34, serif: true, align: 'left', a: smooth(span(t, S.fifteen - .1, S.fifteen + .4)) * hgA });
      ctx.restore();
    }
    // the gauge's line "breathes": on breathe the lever eases back (pull already released)

    // ---- 11.06–11.07, 11.16 shake table + banks at the 2008 pillar
    const tabOut = span(t, S.fin + .3, S.fin + 1.3);
    const shake = smooth(span(t, S.stress, S.stress + .3)) * (1 - smooth(span(t, S.stress + 1.6, S.stress + 2.2))) * .6
      + smooth(span(t, S.night, S.night + .4)) * (1 - smooth(span(t, S.night + 1.6, S.night + 2.4)))
      + smooth(span(t, S.tested - .1, S.tested + .3)) * (1 - smooth(span(t, S.tested + 1.0, S.tested + 1.6)));
    const tab = B.shakeTable(ctx, t, V, { out: tabOut, shake });
    const passGlow = smooth(span(t, S.survive, S.survive + .6));
    ctx.save(); B.vset(ctx, V);
    [[1300, 74], [1390, 92], [1476, 70]].forEach(([bx, bh], i) => {
      const rise = span(t, S.fin + .9 + i * .18, S.fin + 1.6 + i * .18), wob = shake * (Math.sin(t * 17 + i * 2) * .06 + Math.sin(t * 9.3 + i) * .04);
      B.bankModel(ctx, t, bx + tab.dx, B.TABLE.y - 4, bh, { rise, wob, lit: .4 + .6 * passGlow });
    });
    ctx.restore();
    // the stress scenario: one sheet drops from behind the deck, stamped SEVERELY ADVERSE; on "nightmare crash" it becomes a storm of sheets
    {
      const drop = span(t, S.every + .2, S.every + 1.0), storm = span(t, S.night, S.banks + .6), gone = smooth(span(t, S.night + 1.5, S.night + 2.7));
      if (drop > 0 && gone < 1) {
        ctx.save(); B.vset(ctx, V);
        if (t < S.night) {
          const y = lerp(-80, 300, expoOut(drop)) + Math.sin(t * 1.4) * 3;
          PR.paperCard(ctx, 1440, y, 210, 130, { tilt: -.05, lit: .5 });
          if (t > S.every + .8) stamp(ctx, t, 'SEVERELY ADVERSE', 1440, y + 6, { t0: S.every + 1.0, size: 15, ink: RED.line, rot: -.08 });
        } else {
          const r = prng(2008);
          for (let i = 0; i < 12; i++) {
            const ph = r() * 6.3, rad = 120 + r() * 90, sp = .5 + r() * .3, k = storm * 5;
            const ang = ph + t * sp, x = 1390 + Math.cos(ang) * rad * (1 + .2 * Math.sin(t + i)), y = 380 + Math.sin(ang) * rad * .45 - 40 + gone * (900 + r() * 300);
            const x0 = 1440 + (r() - .5) * 30, y0 = 306;
            const e = expoOut(clamp(k - i * .05));
            ctx.save(); ctx.translate(lerp(x0, x, e), lerp(y0, y, e)); ctx.rotate(lerp(-.05, ang * .7, e)); ctx.scale(1, lerp(1, Math.cos(t * 1.1 + i), e));
            if (i > 0) { const g0 = Math.max(.001, e); ctx.scale(g0, g0); }   // the storm's sheets grow out of the one sheet
            const big = i === 0 ? 1 - e * .6 : 0;
            PR.paperCard(ctx, 0, 0, lerp(70, 210, big), lerp(46, 130, big), { lit: .3 });
            if (i === 0) { ctx.scale(lerp(.4, 1, big), lerp(.4, 1, big)); stamp(ctx, t, 'SEVERELY ADVERSE', 0, 6, { t0: S.every + 1.0, size: 15, ink: RED.line, rot: -.08 }); }
            ctx.restore();
          }
        }
        ctx.restore();
      }
      {
        ctx.save(); B.vset(ctx, V);
        const out = span(t, S.three - .5, S.three);
        B.rtext(ctx, 'BANK STRESS TESTS', 1088, 200, { size: 26, spacing: .1 }, span(t, S.every, S.every + .6), out);
        B.rtext(ctx, 'EVERY YEAR SINCE THE FINANCIAL CRISIS', 1088, 226, { size: 13, spacing: .1, col: P.halo2, glow: false }, span(t, S.every + .3, S.every + .9), out);
        ctx.restore();
      }
    }

    // ---- 11.10 the money stream: from the road above, past the banks, into the windowless towers
    {
      const su = span(t, S.growing + .4, S.borrowed + .6), sa = 1 - smooth(span(t, S.borrowed, S.borrowed + .8));
      if (su > 0 && sa > 0) {
        for (const [k, tx] of [[0, B.TOWERS[0][0]], [1, B.TOWERS[1][0]], [2, B.TOWERS[2][0]]]) B.stream(ctx, t, V, [[960, 300 + k * 20], [1250, 170 + k * 25], [1700 + k * 40, 200 + k * 30], [tx, B.TOWERS[k][1] - 4]], su, { a: sa, n: 20, speed: .26 + k * .05 });
      }
    }
    // ---- 11.11 Hyperion: a window opens from the middle tower's roof slit, closes into the SEPARATE COMPANY box
    const hyR = { x: 400, y: 120, w: 1120, h: 620 };
    const boxS = B.r2s(V, B.BOX), slit = (() => { const [x, y] = B.w2s(V, B.TOWERS[1][0], B.TOWERS[1][1]); return { x: x - 50 * V.s, y: y - 3, w: 100 * V.s, h: 6 }; })();
    const hyO = smooth(span(t, S.take - .2, S.take + .9)), hyC = span(t, S.about - .1, S.about + .8);
    // ---- 11.12–11.16 the box (appears where the window lands)
    const boxOn = t >= S.about + .8 - 1e-6;
    if (boxOn) {
      const see = smooth(span(t, S.visible - .2, S.visible + .5));
      const wob = smooth(span(t, S.tested - .1, S.tested + .3)) * (1 - smooth(span(t, S.tested + 1.0, S.tested + 1.6))) * Math.sin(t * 15) * .03;
      B.debtBox(ctx, t, V, {
        open: 1, see, stack: span(t, g('twenty-seven'), g('twenty-seven') + 1.2), lit: see,
        label: span(t, S.sep - .1, S.sep + .5), bonds: span(t, g('billion dollars'), g('billion dollars') + .6),
        bar: span(t, S.firm - .7, S.firm - .1), split: span(t, S.firm, S.firm + .6),
        measure: span(t, S.much - .1, S.much + .8), wob, cables: 1 - smooth(span(t, S.testing + .3, S.tested - .2)),
        dx: 0,
      });
    }
    // ---- 11.13 Meta's books: a thin book; a dashed arrow runs from the box past it (the book stays thin)
    {
      const ba = smooth(span(t, S.books - .2, S.books + .4)) * (1 - smooth(span(t, S.none + .2, S.none + .9)));
      if (ba > 0) {
        ctx.save(); B.vset(ctx, V);
        const bx = 1700, by = 470, bt = 14;
        ctx.globalAlpha = ba;
        ctx.fillStyle = lin(ctx, bx, 0, bx + bt, 0, [[0, P.halo1], [1, P.shade0]]); ctx.fillRect(bx, by - 150 + (1 - expoOut(ba)) * 150, bt, 150 * expoOut(ba));
        E.glowText(ctx, 'META', bx + bt / 2, by + 30, { size: 18, align: 'center', spacing: .14, a: ba });
        E.glowText(ctx, 'BOOKS', bx + bt / 2, by + 52, { size: 13, align: 'center', spacing: .14, col: P.halo2, glow: false, a: ba });
        const au = span(t, S.own - .4, S.own + .5);
        if (au > 0) {
          const pts = [[1880, 420], [1800, 560], [1720, 600], [1620, 560]];
          ctx.setLineDash([8, 10]); ctx.strokeStyle = rgba(COOL.mid, .85); ctx.lineWidth = 3; ctx.beginPath();
          for (let i = 0; i <= 30 * au; i++) { const q = B.bez(pts, i / 30); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } ctx.stroke(); ctx.setLineDash([]);
          const q = B.bez(pts, au), q0 = B.bez(pts, Math.max(0, au - .03)), an = Math.atan2(q[1] - q0[1], q[0] - q0[0]);
          ctx.fillStyle = COOL.mid; ctx.beginPath(); ctx.moveTo(q[0] + Math.cos(an) * 12, q[1] + Math.sin(an) * 12); ctx.lineTo(q[0] + Math.cos(an + 2.5) * 12, q[1] + Math.sin(an + 2.5) * 12); ctx.lineTo(q[0] + Math.cos(an - 2.5) * 12, q[1] + Math.sin(an - 2.5) * 12); ctx.fill();
        }
        ctx.restore();
      }
    }
    // ---- 11.14 the three nets reach for the box and fall short (one per phrase)
    {
      const reach = [S.ins, S.nobr, S.nost], from = [[1600, 760], [1600, 520], [1600, 600]];
      const fade = 1 - smooth(span(t, S.help + .2, S.help + 1.0));
      ctx.save(); B.vset(ctx, V);
      reach.forEach((t0, i) => {
        const u = span(t, t0 - .1, t0 + .5), droop = smooth(span(t, t0 + .4, t0 + 1.0)); if (u <= 0 || fade <= 0) return;
        const [x0, y0] = from[i], xe = lerp(x0, B.BOX.x - 90, expoOut(u)), ye = lerp(y0, B.BOX.y + B.BOX.h - 20, expoOut(u)) + droop * 110;
        ctx.strokeStyle = rgba(P.halo0, .9 * fade); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.shadowColor = rgba(P.halo0, .7); ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + xe) / 2, Math.max(y0, ye) + 40 + droop * 40, xe, ye); ctx.stroke();
        halo(ctx, xe, ye, 30, .5 * fade);
      });
      ctx.restore();
    }
    // ---- 11.15 the light cone into the box; who holds it (lines to holders), how much (bars), who pays (an arrow down to people)
    {
      const cone = smooth(span(t, S.visible - .4, S.visible + .3)) * (1 - smooth(span(t, S.tested + .2, S.tested + 1.2)));
      if (cone > 0) {
        ctx.save(); B.vset(ctx, V);
        const bx = B.BOX.x + B.BOX.w / 2;
        ctx.fillStyle = lin(ctx, 0, B.DECK, 0, B.BOX.y + B.BOX.h, [[0, rgba(P.core1, .42 * cone)], [1, rgba(P.halo0, .1 * cone)]]);
        ctx.beginPath(); ctx.moveTo(bx - 40, B.DECK); ctx.lineTo(bx + 40, B.DECK); ctx.lineTo(bx + B.BOX.w * .62, B.BOX.y + B.BOX.h); ctx.lineTo(bx - B.BOX.w * .62, B.BOX.y + B.BOX.h); ctx.closePath(); ctx.fill();
        ctx.fillStyle = rgba(P.core0, .9 * cone); ctx.fillRect(bx - 40, B.DECK - 4, 80, 5);
        // holders: five small dots right of the box, lines from the slabs
        const hu = span(t, S.who, S.who + .9);
        for (let k = 0; k < 5; k++) {
          const e = expoOut(clamp(hu * 5 - k)); if (e <= 0) continue;
          const sx = B.BOX.x + 24 + B.BOX.w * .48, sy = B.BOX.y + B.BOX.h - 26 - k * 40, hx = B.BOX.x + B.BOX.w + 90 + (k % 2) * 40, hy = B.BOX.y + 30 + k * 46;
          ctx.strokeStyle = rgba(P.halo0, .7 * cone); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(lerp(sx, hx, e), lerp(sy, hy, e)); ctx.stroke();
          if (e > .9) { halo(ctx, hx, hy, 22, .6 * cone); ctx.fillStyle = rgba(P.core1, cone); ctx.beginPath(); ctx.arc(hx, hy, 7, 0, 7); ctx.fill(); }
        }
        // who pays: an arrow drops from the box to a row of small people below
        const pu = span(t, S.pays, S.pays + .7);
        if (pu > 0) {
          const ax = bx, ay0 = B.BOX.y + B.BOX.h + 70, ay1 = lerp(ay0, ay0 + 120, expoOut(pu));
          ctx.strokeStyle = rgba(P.halo0, .85 * cone); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ax, ay0); ctx.lineTo(ax, ay1); ctx.stroke();
          ctx.fillStyle = rgba(P.halo0, .85 * cone); ctx.beginPath(); ctx.moveTo(ax - 10, ay1 - 8); ctx.lineTo(ax + 10, ay1 - 8); ctx.lineTo(ax, ay1 + 6); ctx.fill();
          for (let k = -3; k <= 3; k++) E.person(ctx, ax + k * 34, ay0 + 210, 62, { dir: k < 0 ? 1 : -1, look: .6 * expoOut(pu), lean: .02 * Math.sin(t * 1.3 + k), a: cone });
        }
        ctx.restore();
      }
    }
    // ---- 11.16 the table stretches from the banks into the gap under the box
    {
      const ext = smooth(span(t, S.testing + .3, S.tested - .1)) * (1 - smooth(span(t, S.everyone + .2, S.everyone + 1.2)));
      if (ext > 0) {
        ctx.save(); B.vset(ctx, V);
        const x0 = B.TABLE.x1, x1 = lerp(x0, B.BOX.x + B.BOX.w + 30, expoOut(ext)), y = B.BOX.y + B.BOX.h + 4;
        const dx = shake * (Math.sin(t * 31) * 7 + Math.sin(t * 19.7) * 4);
        ctx.fillStyle = mixHex(P.shade0, P.ind1, .5); ctx.fillRect(x0 + dx, y, x1 - x0, 14);
        ctx.strokeStyle = rgba(P.halo0, .5); ctx.lineWidth = 1.5; ctx.strokeRect(x0 + dx, y, x1 - x0, 14);
        ctx.restore();
      }
    }
    // ---- 11.17–11.19 the fourth net: hands knot it in the gap before anything has fallen; it flies to gore 5; big hands hold it
    const knot = span(t, S.before - .3, S.fifth + .2);
    const handsIn = smooth(span(t, S.damage + .2, S.before));
    if (handsIn > 0 || knot > 0) {
      ctx.save(); B.vset(ctx, V);
      const a0 = [1640, 600], a1 = [2510, 600];
      F.netSpan(ctx, t, a0, a1, { sag: 80, rows: 3, lit: .4 + .6 * smooth(span(t, S.fifth, S.alone)), half: Math.max(.02, .5 * expoOut(knot) + .25 * smooth(span(t, S.law, S.decide))), knots: 1, seed: 5 });
      // the knotting hands (others, indigo) under the gap
      for (let k = 0; k < 5; k++) {
        const hx = 1720 + k * 170, e = expoOut(clamp(handsIn * 1.6 - k * .12)), hy = lerp(1400, 700 + (k % 2) * 40, e) + Math.sin(t * 3 + k * 1.3) * 6 * e;
        const lawOut = smooth(span(t, S.law - .2, S.law + .8));
        B.ihand(ctx, hx, hy + lawOut * 600, .75, { ang: (k - 2) * .1, grip: .5 + .5 * Math.sin(t * 4 + k) });
      }
      ctx.restore();
    }
    // 11.19 LAWMAKERS / REGULATORS: two big hands take the net's ends; your hand holds a strand
    {
      const h = smooth(span(t, S.law - .1, S.law + .9)), y2 = smooth(span(t, g('regulators'), g('regulators') + .8)), you = smooth(span(t, S.decide - .3, S.decide + .5));
      const out = smooth(span(t, S.q, S.q + .8));
      if (h > 0) {
        ctx.save(); B.vset(ctx, V);
        B.ihand(ctx, 1660, lerp(1400, 640, expoOut(h)) + out * 600, 1.05, { ang: .35, grip: 1 });
        B.ihand(ctx, 2490, lerp(1400, 640, expoOut(y2)) + out * 600, 1.05, { ang: -.35, grip: 1 });
        if (h > 0) E.glowText(ctx, 'LAWMAKERS', 1600, 770 + (1 - expoOut(h)) * 20 + out * 600, { size: 24, spacing: .12, a: h });
        if (y2 > 0) E.glowText(ctx, 'REGULATORS', 2550, 770 + (1 - expoOut(y2)) * 20 + out * 600, { size: 24, spacing: .12, a: y2, align: 'right' });
        if (you > 0) PR.hand(ctx, 2075, lerp(1300, 700, expoOut(you)) + out * 300, .7, { ang: .05 });
        ctx.restore();
      }
    }

    // ================= screen space: vignette windows, the gore flight, the phone
    // 11.01 the 1987 trading floor opens from the Black Monday pillar plate
    {
      const op = smooth(span(t, T0 + .55, T0 + 1.5)) * (1 - span(t, S.after, S.after + .8));
      const from = B.r2s(V, B.plateRect(1));
      if (op > 0) F.vWindow(ctx, t, { x: 330, y: 110, w: 1260, h: 640 }, quartIO(op) === 0 ? 0 : op, (cx, r) => B.tradingFloor(cx, t, r, {
        tick: span(t, S.dow - .2, S.dow + .7), num: span(t, S.quarter - .1, S.quarter + .4), panic: smooth(span(t, S.single - .4, S.single + .3)), paper: span(t, S.single - .1, S.single + 3),
      }), { from });
    }
    // 11.11 Hyperion
    if (hyO > 0 && hyC < 1) {
      const open = hyC > 0 ? 1 : hyO;
      const rect = hyC > 0 ? lerpR(hyR, boxS, quartIO(hyC)) : hyR;
      F.vWindow(ctx, t, rect, open, (cx, r) => B.hyperion(cx, t, r, { label: smooth(span(t, S.louis - .2, S.louis + .4)) * (1 - hyC) }), { from: slit });
    }
    // 11.18 the knotted net's light lifts off and flies into gore 5 (HUD lights it by itself after landing)
    {
      const [nx, ny] = B.w2s(V, 1860, 660), f = F.flyToGore(t, T, 4, [nx, ny], { s0: 1 });
      if (f.u > 0 && !f.landed) F.goreIcon(ctx, 4, f.x, f.y, f.s * 1.3, { lit: 1 });
      const tx = smooth(span(t, S.fifth, S.fifth + .6)) * (1 - smooth(span(t, S.law + .3, S.law + 1.0)));
      if (tx > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); E.glowText(ctx, F.GORE_TEXT[4], W / 2, 820 + (1 - expoOut(tx)) * 16, { size: 40, align: 'center', spacing: .08, a: tx }); ctx.restore(); }
    }
    // 11.20–11.21 your phone (rises with your hand), the message, the push into its screen, the send → the HUD counter grows (c12)
    phoneStage(ctx, t);
    // seam plate (B2 → B3)
    if (seamWindow(t, T0)) plateNet(ctx, t);
    // HUDs (every frame), the counter clone that grows out of the HUD (c11 → c12)
    F.hudUmbrella(ctx, t, T); F.hudDay(ctx, t, T, { a: t >= B.C1000(T).t0 ? 0 : 1 });
    B.counterClone(ctx, t, T);
  }
  const lerpR = (a, b, e) => ({ x: lerp(a.x, b.x, e), y: lerp(a.y, b.y, e), w: lerp(a.w, b.w, e), h: lerp(a.h, b.h, e) });

  // ------------------------------------------------------------------------------------------------- phone stage
  const PH = { x: 1180, y: 560, h: 560 };
  function phoneStage(ctx, t) {
    const rise = span(t, S.q, S.q + .9); if (rise <= 0) return;
    const push = sineIO(span(t, S.rep + .3, S.whoq + .9)), sc = Math.exp(lerp(0, Math.log(10), push));
    const y = lerp(H + 420, PH.y, expoOut(rise)), x = lerp(PH.x, W / 2, push), cy = lerp(y, H / 2 + 60 * 10 * 0, push);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const scr = (c, r) => {
      // the screen shows the night of the road at the counter's zoom: once it fills the frame it is the stage of c12
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
      B.stage1000Back(c, t, T);
      c.restore();
      const typ = span(t, S.rep - .9, S.rep + .2), fa = 1 - smooth(span(t, S.whoq - .2, S.whoq + .4));
      if (fa > 0) {
        c.fillStyle = rgba(P.night0, .5 * fa); c.fillRect(r.x, r.y + r.h * .06, r.w, r.h * .1);
        E.glowText(c, 'TO: YOUR REPRESENTATIVE'.slice(0, Math.round(23 * typ)), r.x + r.w * .07, r.y + r.h * .125, { size: r.w * .068, spacing: .04, a: fa, glow: false });
        const blink = (Math.sin(t * 9) > 0 ? 1 : 0) * fa; c.fillStyle = rgba(P.halo0, blink); c.fillRect(r.x + r.w * .07, r.y + r.h * .2, r.w * .015, r.h * .04);
      }
    };
    PR.phone(ctx, t, x, cy, PH.h * sc, { face: 1, screen: scr });
    PR.hand(ctx, x + PH.h * .2 * sc, cy + PH.h * .38 * sc, 1.25 * sc, { ang: -.55 });
    ctx.restore();
    // the question in the message field (stands large ≥ 4 s), then it folds into the send arrow; the arrow flies to the HUD counter
    const L = ['WHO HOLDS THE DEBT', 'BEHIND THE DATA CENTERS,', "AND WHO'S CHECKING IT?"];
    const send = B.SEND(T), fold = expoIn(span(t, send.t0, send.t0 + .45));
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    L.forEach((s, i) => {
      const u = span(t, S.whoq + .25 + i * .55, S.whoq + .95 + i * .55); if (u <= 0 || fold >= 1) return;
      const y0 = 420 + i * 92, tx = lerp(W / 2, send.x, fold), ty = lerp(y0, send.y, fold), k = 1 - fold * .95;
      ctx.save(); ctx.beginPath(); ctx.rect(0, y0 - 80, W, 100); if (fold <= 0) ctx.clip();
      ctx.translate(tx, ty + (1 - expoOut(u)) * 70); ctx.scale(k, k);
      E.glowText(ctx, s, 0, 0, { size: 68, align: 'center', spacing: .02 });
      ctx.restore();
    });
    // the send arrow: sits under the text, flashes on tap, then flies to the HUD counter
    const sa = smooth(span(t, S.check, S.checkE + .3));
    const fl = span(t, send.t0 + .4, send.t1);
    if (sa > 0 && fl < 1) {
      const e = quartIO(fl), cx = (send.x + F.HUD_DAY.x - 120) / 2, cy2 = Math.min(send.y, F.HUD_DAY.y) - 140;
      const px = (1 - e) ** 2 * send.x + 2 * (1 - e) * e * cx + e * e * (F.HUD_DAY.x - 120), py = (1 - e) ** 2 * send.y + 2 * (1 - e) * e * cy2 + e * e * (F.HUD_DAY.y + 25);
      const s = lerp(1, .4, e), tap = Math.sin(Math.PI * span(t, send.t0 - .25, send.t0 + .1));
      halo(ctx, px, py, 70 * s * (1 + tap * .4), .55 * sa);
      ctx.translate(px, py); ctx.scale(s, s); ctx.rotate(-.5 * e);
      ctx.fillStyle = rgba(P.core1, sa); ctx.beginPath(); ctx.moveTo(-26, -22); ctx.lineTo(30, 0); ctx.lineTo(-26, 22); ctx.lineTo(-14, 0); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  return [{ t: R.a, draw, print: F.PRINT19 }];
};
