// Film 8 · chunk c06 · 05a "V · Does it work?" (shots 5.01–5.12, 288.62–333.10 s). Builder: B2. World: lib/f8_c06_world.mjs, cards: lib/f8_chart.mjs.
// ONE take on one sheet of paper (the sober paper day), one camera (camKeys). No cut inside the chunk. Pop-up paper is the motif:
// what is built stands up out of the page, what is gone folds flat again. Night falls over the page at the end (5.12).
//
// | shot | VO (accent)                                  | image                                                              | hero light / accent  | camera                                   | flow into next                     | ★/▲ | sound            |
// |------|----------------------------------------------|--------------------------------------------------------------------|----------------------|------------------------------------------|------------------------------------|-----|------------------|
// | in   | (plate c05>c06: green firefly light)          | the frame IS the plate                                             | the plate            | —                                        | the light contracts into a firefly |     | whoosh_airy      |
// | 5.01 | Not by **itself**.                           | paper day; the firefly lands on the page beside the kit workshop   | the firefly → ink    | k 1.35, drift                            | the dot slides along the baseline  |     | drop             |
// |      |                                              | drawn in ink (unlit); its light goes out, it is an ink dot; dries  |                      |                                          | (morph: dot → foot of the bar)     |     |                  |
// | 5.02 | …560,000 new apps **landed**…                | engraved chart on the page: the bar grows from the dot, hundreds   | the tile rain        | pan right + pull back 2.3 s              | take                               |     | pencil           |
// |      |                                              | of app tiles (no logos) rain into it; ≈ 560,000 NEW APPS; source   |                      |                                          |                                    |     |                  |
// | 5.03 | About **twice** as many…                     | a half-high bar H1 2025 rains in; ×2 snaps between them            | ×2                   | slow push                                | take                               |     | tick             |
// | 5.04 | Downloads? / Up by **two percent**. ▲        | a thin DOWNLOADS line under the bars; its end lifts a hair: +2 %   | the red mark         | hold                                     | the tiles fall out of the chart    | ▲   |                  |
// | 5.05 | Building got **cheap**.                      | the tiles fall down the page; where each lands a small identical   | the booths           | 3 s crane back and down over the page    | take                               |     | paper_pop        |
// |      |                                              | booth pops up; hundreds more pop up; on cheap the last twenty      |                      |                                          |                                    |     |                  |
// | 5.06 | Getting **noticed** didn't.                  | a sea of identical booths to the horizon; one tiny red flag blinks | the red flag         | hold high                                | dive into the street               |     | spark_tick       |
// |      |                                              | once and sinks under                                               |                      |                                          |                                    |     |                  |
// | 5.07 | …Kenya…640 small business owners…**WhatsApp**| dive 3.1 s into one row: a Kenyan market street in ink; keepers in | fireflies over phones| dive k .62 → 8.5, slow drift             | the stalls fold flat onto the line |     | wings            |
// |      |                                              | profile with basic phones; a firefly over each phone; empty speech |                      |                                          | (pop-up book closes)               |     |                  |
// |      |                                              | glyphs on WhatsApp; KENYA · 640 SMALL BUSINESS OWNERS, OTIS ET AL.  |                      |                                          |                                    |     |                  |
// | 5.08 | On average, **nothing** changed.             | the whole landscape folds flat; the street's ground line is left:  | the bead on the line | pull back 2.4 s to the chart             | take                               |     | pages            |
// |      |                                              | AVERAGE, a bead runs along it and stops at 0 %                     |                      |                                          |                                    |     |                  |
// | 5.09 | …about **fifteen percent** better.           | the line splits; the upper branch rises: +15 % ALREADY DOING WELL  | +15 %                | slow push                                | take                               |     |                  |
// | 5.10 | …almost ten percent **worse**. ▲             | the lower branch falls in red: −10 % STRUGGLING, a red circle      | the red mark         | hold                                     | the branch ends become two figures | ▲   | tick             |
// | 5.11 | Similar advice. / **Different choices**.      | labels fold flat, two figures pop up at the branch ends; the one   | the firefly          | push 2.25 s to the two ends              | the paths lead each to a swarm     |     |                  |
// |      |                                              | waiting firefly reaches both; then two paths draw on, apart        |                      |                                          |                                    |     |                  |
// | 5.12 | The hands **amplify** whatever will…         | night falls over the page; two conductors in profile, mirror-      | two swarms           | slow push; then tilt up 2.1 s            | firefly → thread → line plate      | ★   | shimmer_rings    |
// | ★    |                                              | symmetric about the midline: above an ordered column of light,     |                      | (follows the question firefly)           | (c06>c07)                          |     | whoosh_up        |
// |      |                                              | below a chaotic cloud; on amplify both grow ×3                     |                      |                                          |                                    |     |                  |
// | out  | (plate c06>c07: gold line y 560 on dark)      | a firefly rises from the middle; the thread it lays runs out to    | the line             | the page leaves the frame below          |                                    |     |                  |
// |      |                                              | both edges; the night above the page IS the plate ground           |                      |                                          |                                    |     |                  |
import { W, H, rgba, clamp, mix, sm, eio, prng, drift } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { ready, F8, firefly, conductor, qio, eoutX } from '../lib/f8_kit.mjs';
import { glowFrom } from '../lib/f8_c02_world.mjs';
import { chartReady, chartCard, barSlots, drawTile, paperGround, inkText, inkStrokePath, INK } from '../lib/f8_chart.mjs';
import { camKeys, toPlane, S, lineOnly, nightOver, inkWorkshop, FIELD, fieldDraw, vendorDraw, bubble, dayFly } from '../lib/f8_c06_world.mjs';

const TAU = Math.PI * 2;

export default async (T, R) => {
  await ready(); await chartReady();
  const { in: HI, out: HO } = handsOf('c06', T);
  const s5 = (p) => T.S('05a', p), e5 = (p) => T.E('05a', p);
  const A = {
    hb: HI.b, itself: s5('itself'), first: s5('In the first half'), thousand: s5('sixty thousand'), newApps: s5('new apps'), landed: s5('landed'),
    about: s5('About twice'), twice: s5('twice'), down: s5('Downloads'), two: s5('two percent'), building: s5('Building got'), cheap: s5('cheap'),
    getting: s5('Getting noticed'), noticed: s5('noticed'), kenya: s5('And in Kenya'), kenyaW: s5('Kenya'), owners: s5('small business owners'), whatsapp: s5('WhatsApp'),
    onavg: s5('On average'), nothing: s5('nothing changed'), those1: s5('Those already'), fifteen: s5('fifteen percent'), those2: s5('Those who were'),
    worse: s5('worse'), similar: s5('Similar advice'), different: s5('Different choices'), hands: s5('The hands amplify'), amplify: s5('amplify'),
    them: e5('in front of them'), ha: HO.a,
  };
  const Ys = FIELD.rows[FIELD.STREET].y;           // the market street's ground = chart B's AVERAGE line
  // ---------------------------------------------------------------- chart A (the app flood), on the page
  const CA = { x: -150, y: -450, w: 1500, h: 900, plot: [.1, .16, .9, .8], sheet: true };
  const bar1 = { c: .3, w: .2, v: .88, tile: 15 }, bar2 = { c: .7, w: .2, v: .44, tile: 15 };
  const rain1 = { t0: A.first + 1.55, dur: A.landed - A.first - 1.55 }, rain2 = { t0: A.about - .35, dur: .75 };
  const DROP = A.building - .3;                    // the tiles leave the chart
  const slots = [barSlots({ ...CA, bars: [bar1, bar2] }, 0), barSlots({ ...CA, bars: [bar1, bar2] }, 1)];
  // every tile gets a booth to become (rows behind the street), a release time (top rows first) and a fall
  const rr = prng(77), cand = FIELD.booths.filter((b) => b.row >= 16 && b.row <= 30 && b.x > -250 && b.x < 1550).map((b) => [rr(), b]).sort((p, q) => p[0] - q[0]).map((p) => p[1]);
  const TILE = []; let ci = 0;
  slots.forEach((L, bi) => L.forEach((sl) => { const j1 = rr(), j2 = rr(), ts = DROP + .85 * (1 - sl.row / sl.rows) + .2 * j1 + bi * .1, d = 1.05 + .4 * j2; TILE.push({ ...sl, bi, ts, d, land: ts + d, b: cand[ci++ % cand.length], j1, j2 }); }));
  const tileOf = new Map(); for (const tl of TILE) tileOf.set(tl.b.j, tl);
  const relT = [new Map(), new Map()]; for (const tl of TILE) relT[tl.bi].set(tl.k, tl.ts);
  // booth pop-up times: tile booths pop where their tile lands; the rest in a wave from the landing area; twenty pop together on "cheap"
  const twenty = new Set(FIELD.booths.filter((b) => b.row >= 13 && b.row <= 17 && b.x > 350 && b.x < 950 && !tileOf.has(b.j)).filter((_, i) => i % 3 === 0).slice(0, 20).map((b) => b.j));
  const popAt = (b) => { const tl = tileOf.get(b.j); if (tl) return tl.land; if (twenty.has(b.j)) return A.cheap - .04; return A.building + .55 + Math.hypot(b.x - 650, (b.y - 1850) * 2.2) / 2100 + .15 * b.seed; };
  const redB = FIELD.booths.filter((b) => b.row === 19).sort((p, q) => Math.abs(p.x - 1150) - Math.abs(q.x - 1150))[0];
  const foldAt = (b) => (b.j === redB.j ? A.noticed + .5 : A.onavg - .4 + 1.15 * clamp(Math.log(1 + Math.hypot(b.x - 730, (b.row - FIELD.STREET) * 45) / 50) / Math.log(1 + 1000 / 50)));
  const pop = (b, t) => { const u = (t - popAt(b)) / .32; if (u <= 0) return 0; return Math.min(1.04, eoutX(u) * 1.04) - .04 * clamp((u - 1) / .5); };
  const fold = (b, t) => clamp((t - foldAt(b)) / .5);
  // the street: stall keepers in front of every second stall around the dive point, each with a firefly over the phone
  const STALLS = FIELD.booths.filter((b) => b.row === FIELD.STREET && b.x > 380 && b.x < 1150);
  const VENDORS = STALLS.map((b, i) => ({ b, x: b.x + (i % 2 ? 14 : -16) * b.s, flip: i % 3 === 1, seed: 3 + i * 5, fly: A.kenyaW + 1.5 + i * .09 + (i % 3) * .05 }));
  // ---------------------------------------------------------------- chart B (Kenya), the street's ground line becomes AVERAGE
  const CB = { x: 100, y: Ys - 470, w: 1400, h: 800, plot: [.08, .2, .86, .8], sheet: true, axis: 0 };
  const SPLIT = .55, up = (u) => .354 + .25 * sm(clamp((u - SPLIT) / .3)), dn = (u) => .354 - .1667 * sm(clamp((u - SPLIT) / .3));
  const PB = (u, v) => [CB.x + CB.w * (CB.plot[0] + u * (CB.plot[2] - CB.plot[0])), CB.y + CB.h * CB.plot[1] + (1 - v) * CB.h * (CB.plot[3] - CB.plot[1])];
  const E1 = PB(1, up(1)), E2 = PB(1, dn(1)), MID = [E1[0] + 96, (E1[1] + E2[1]) / 2];
  const S1 = [E1[0] + 240, E1[1] - 30], S2 = [E2[0] + 240, E2[1] + 30];
  const FM = PB(.62, .354 + .55);                  // where the street's fireflies gather into one (the waiting advisor)
  // ---------------------------------------------------------------- camera
  const C = { x: MID[0], y: MID[1], k: 2.0 };
  const cam = camKeys([
    { t: A.hb, x: -420, y: 140, k: 1.35 }, { t: A.first - .1, x: -405, y: 140, k: 1.37, e: 'sine' },
    { t: A.first + 2.2, x: 600, y: 10, k: .9 }, { t: A.building - .75, x: 600, y: 22, k: .97, e: 'sine' },
    { t: A.getting + .6, x: 650, y: 2080, k: .7, e: (u) => .5 - .5 * Math.cos(Math.PI * (1 - Math.pow(1 - clamp(u), 1.4))) }, { t: A.kenya - 1.4, x: 655, y: 2081, k: .698, e: 'sine' },
    { t: A.kenya + 3.2, x: 700, y: Ys - 12, k: 9.2, e: (u) => .5 - .5 * Math.cos(Math.PI * Math.pow(clamp(u), 1.3)) }, { t: A.onavg - .6, x: 716, y: Ys - 12, k: 9.45, e: 'sine' },
    { t: A.onavg + 2.3, x: 840, y: Ys - 70, k: 1.05 }, { t: A.similar - .35, x: 850, y: Ys - 68, k: 1.09, e: 'sine' },
    { t: A.similar + 1.9, x: C.x, y: C.y, k: C.k }, { t: A.them - .35, x: C.x + 10, y: C.y, k: 2.06, e: 'sine' },
    { t: A.ha, x: C.x + 10, y: C.y - 700, k: 2.06 },
  ]);
  // ---------------------------------------------------------------- the firefly that becomes the dot (5.01)
  const LAND = A.itself + .45, DOT = [-60, 270];
  const glowU = (t) => clamp((t - A.hb) / (LAND - A.hb));
  // the dot: lands, spreads, dries; then slides along the baseline to the foot of bar 1, drawing the axis behind it
  const dotPos = (t) => { const u = qio(clamp((t - (A.first + .05)) / 1.4)); return [mix(DOT[0], CA.x + CA.w * (CA.plot[0] + bar1.c * (CA.plot[2] - CA.plot[0])), u), DOT[1]]; };
  // ---------------------------------------------------------------- swarms of 5.12 (own: births from a seed light, ordered column / chaotic cloud)
  const swarmPts = (t, seedPt, n, ordered, born0) => {
    const out = [];
    for (let i = 0; i < n; i++) {
      const r = prng(91 + i * 13 + (ordered ? 0 : 500)), a = r(), b = r(), c = r(), d = r();
      const tb = i < 6 ? born0 + i * .07 : A.amplify + .02 + (i - 6) * .028;
      const at = (tt) => {
        let sx, sy;
        if (ordered) { const col = i % 3, row = Math.floor(i / 3), rows = Math.ceil(n / 3); sx = (col - 1) * 34 + 3 * Math.sin(tt * 1.6 + row); sy = (row - (rows - 1) / 2) * 22 + 2 * Math.sin(tt * 2 + col); const g = clamp((tt - A.amplify - .3) / 1.4); sx = mix(sx * 1.5 + (a - .5) * 40, sx, sm(g)); sy = mix(sy * 1.2 + (b - .5) * 30, sy, sm(g)); }
        else { const ph = a * TAU, sp = 1.4 + 2.2 * b; sx = (c - .5) * 260 + Math.cos(tt * sp + ph) * 46 + 30 * Math.sin(tt * 3.1 * b + d * 9); sy = (d - .5) * 160 + Math.sin(tt * sp * 1.3 + ph) * 38; }
        return [sx, sy];
      };
      out.push({ i, tb, at, seedPt });
    }
    return out;
  };
  // ---------------------------------------------------------------- draw
  const draw = (ctx, t) => {
    const cm = cam(t), k = cm.k;
    // ---- the page (world)
    ctx.save(); toPlane(ctx, cm);
    const hw = W / 2 / k * 1.5 + 50, hh = H / 2 / k * 1.5 + 50;
    paperGround(ctx, cm.x - hw, cm.y - hh, hw * 2, hh * 2, { light: [cm.x - 600 / k, cm.y - 900 / k] });
    // 5.01 the workshop as an ink drawing (unlit)
    if (t < A.building + 1) inkWorkshop(ctx, -700, 270, 1.5, { lw: 1.6 / k * 1.5 });
    // chart A
    if (t < A.kenya + 1.5) {
      const fr = clamp((t - A.first - .1) / 1.5), dl = clamp((t - A.down) / .75), lift = eoutX(clamp((t - A.two) / .5));
      chartCard(ctx, t, { ...CA, frame: fr, axis: 0,
        bars: [
          { ...bar1, grow: clamp((t - A.first - 1.35) / .6), rain: rain1, close: clamp((t - A.landed) / .4), label: 'H1 2026', lu: clamp((t - A.first - .9) / .5), skip: (kk, tt) => tt >= relT[0].get(kk) },
          { ...bar2, grow: clamp((t - A.about + .55) / .35), rain: rain2, close: clamp((t - A.twice - .05) / .3), label: 'H1 2025', lu: clamp((t - A.about) / .5), skip: (kk, tt) => tt >= relT[1].get(kk) },
        ],
        lines: dl > 0 ? [{ f: (u) => -.17 + .012 * sm(clamp((u - .55) / .45)) * lift, u: dl, w: 2.2, label: 'DOWNLOADS', labelAt: [0, -.1], lu: clamp((t - A.down - .2) / .5), labelSize: 20, bead: true }] : [],
        texts: [
          { text: '≈ 560,000', at: [.42, .84], size: 78, u: clamp((t - A.thousand + .1) / .5), snap: t - A.thousand - .4 },
          { text: 'NEW APPS', at: [.425, .77], size: 22, font: 'caps', u: clamp((t - A.newApps) / .5) },
          { text: '×2', at: [.5, .5], size: 92, u: clamp((t - A.twice - .05) / .25), snap: t - A.twice - .3, align: 'center' },
          { text: '+2 %', at: [1.0, -.08], size: 40, col: 'red', font: 'serif', u: clamp((t - A.two - .1) / .3), snap: t - A.two - .4, align: 'right' },
        ],
        marks: [{ at: [1, -.17 + .012], u: clamp((t - A.two - .15) / .45), r: 22 }],
        source: 'Sensor Tower 2026', su: clamp((t - A.landed - .4) / .6) });
      // the axis drawn by the sliding dot, then the dot itself (ink)
      const dp = dotPos(t), [ax0] = PBa(0);
      if (t > A.first) { const x1 = Math.max(dp[0], DOT[0]); ctx.strokeStyle = rgba(INK.ink, .85); ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(Math.min(DOT[0], x1), DOT[1]); ctx.lineTo(x1, DOT[1]); if (t > A.first + 1.2) { const u = eio(clamp((t - A.first - 1.2) / 1.1)); ctx.moveTo(x1, DOT[1]); ctx.lineTo(mix(x1, ax0 + 1220, u), DOT[1]); } ctx.stroke(); }
      if (t >= LAND) { const sp = eoutX(clamp((t - LAND) / .3)), dry = clamp((t - LAND - .2) / .5), gr = dotGrow(t); ctx.fillStyle = INK.ink; ctx.beginPath(); ctx.arc(dp[0], dp[1], (4 + 5 * sp) * gr, 0, TAU); ctx.fill();
        if (dry < 1 && gr > .9) { ctx.fillStyle = `rgba(255,255,255,${.5 * (1 - dry)})`; ctx.beginPath(); ctx.arc(dp[0] - 2.5, dp[1] - 3, 2.2 * sp, 0, TAU); ctx.fill(); } }
      // falling tiles (released from the bars, each into its booth)
      for (const tl of TILE) {
        if (t < tl.ts || t >= tl.land) continue;
        const q = (t - tl.ts) / tl.d, b = tl.b, tx = b.x, ty = b.y - 10 * b.s, x = mix(tl.x, tx, sm(q)) + Math.sin(q * 6 + tl.j1 * 9) * 18 * (1 - q), y = mix(tl.y, ty, q * q);
        drawTile(ctx, x, y, mix(15, 26 * b.s, q), (tl.j2 - .5) * 6 * q);
      }
    }
    // the field of booths (5.05–5.08), the red flag (5.06)
    if (t > A.building && t < A.onavg + 3) {
      const redU = t < foldAt(redB) ? 1 : 1 - clamp((t - foldAt(redB)) / .4);
      fieldDraw(ctx, t, cm, { pop: (b) => pop(b, t), fold: (b) => fold(b, t), red: t > A.cheap ? { row: redB.row, j: redB.j, u: redU, blink: clamp((t - A.noticed) / .5) * (t < A.noticed + .5 ? 1 : 0) } : null });
    }
    // chart B: the AVERAGE line (= the street's ground), the bead, the branches
    if (t > A.kenya) {
      const L0 = PB(0, .354), L1 = PB(1, .354);
      ctx.strokeStyle = INK.ink; ctx.lineWidth = Math.min(3.4, 3.8 / k); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(L0[0], L0[1]); ctx.lineTo(L1[0], L1[1]); ctx.stroke();
      if (t > A.onavg - .5) {
        const fr = clamp((t - A.onavg - .2) / 1.4), labU = (t0) => clamp((t - t0) / .5) * (1 - clamp((t - A.similar - .05) / .35));
        const fUp = clamp((t - A.those1 - .1) / (A.fifteen - A.those1 - .1)), fDn = clamp((t - A.those2 - .1) / (A.worse - A.those2 - .1));
        chartCard(ctx, t, { ...CB, frame: fr * (1 - 0),
          lines: [
            ...(fUp > 0 ? [{ f: up, from: SPLIT, to: 1, u: fUp, w: 3.4, bead: false }] : []),
            ...(fDn > 0 ? [{ f: dn, from: SPLIT, to: 1, u: fDn, w: 3.4, col: 'red', bead: false }] : []),
          ],
          texts: [
            { text: 'AVERAGE', at: [0, .42], size: 22, font: 'caps', u: labU(A.onavg + .2) },
            { text: '0 %', at: [SPLIT - .02, .4], size: 46, u: labU(A.nothing + .1), snap: t - A.nothing - .4, align: 'center' },
            { text: '+15 %', at: [1.02, up(1) + .02], size: 56, u: labU(A.fifteen - .05), snap: t - A.fifteen - .25 },
            { text: 'ALREADY DOING WELL', at: [1.025, up(1) - .06], size: 18, font: 'caps', u: labU(A.fifteen + .3) },
            { text: '−10 %', at: [1.04, dn(1) - .015], size: 56, col: 'red', u: labU(A.worse - .05), snap: t - A.worse - .25 },
            { text: 'STRUGGLING', at: [1.045, dn(1) - .095], size: 18, font: 'caps', col: 'red', u: labU(A.worse + .25) },
          ],
          marks: [{ at: [1, dn(1)], u: clamp((t - A.worse - .05) / .4) * (1 - clamp((t - A.similar - .05) / .35)), r: 20 }],
          source: 'Otis et al.', su: clamp((t - A.onavg - .5) / .6) });
        // the bead runs along the flat line and stops at 0 %
        const bu = qio(clamp((t - A.onavg - .3) / (A.nothing + .2 - A.onavg - .3))), bp = PB(bu * SPLIT, .354);
        if (t > A.onavg + .3) { ctx.fillStyle = INK.ink; ctx.beginPath(); ctx.arc(bp[0], bp[1], Math.min(8, 8.4 / k), 0, TAU); ctx.fill(); }
        // 5.11: the two paths draw on from the branch ends (calm / hesitant)
        const pu = clamp((t - A.different) / 1.1);
        if (pu > 0) {
          const pathPts = (E, Sp, wob) => { const pts = []; for (let i = 0; i <= 40; i++) { const q = i / 40; pts.push([mix(E[0], Sp[0], q), mix(E[1], Sp[1], sm(q)) + wob * Math.sin(q * 17) * 9 * q]); } return pts; };
          inkStrokePath(ctx, pathPts(E1, S1, 0), eio(pu), { w: 3.4, seed: 5 });
          inkStrokePath(ctx, pathPts(E2, S2, 1), eio(pu), { w: 3.4, col: INK.red, seed: 8 });
        }
      }
    }
    ctx.restore();
    // ---- screen space: vendors, fireflies, conductors, labels
    // the street's keepers (fold with their stalls)
    if (t > A.building && t < A.onavg + 1.2) {
      for (const v of VENDORS) {
        const ph = pop(v.b, t) * (1 - qio(fold(v.b, t))); if (ph <= .01) continue;
        const [sx, sy] = S(cm, v.x, v.b.y + 4 * v.b.s), sc = .105 * v.b.s / .69 * k; if (sx < -200 || sx > W + 200 || sy < -50 || sy > H + 300) continue;
        ctx.save(); ctx.translate(sx, sy); ctx.scale(1, ph); ctx.translate(-sx, -sy);
        const res = vendorDraw(ctx, t, sx, sy - 92 * sc, sc, { seed: v.seed, flip: v.flip, shadow: sc > .3 });
        v.phone = res.phone; ctx.restore(); v.ph = ph; v.sc = sc;
      }
      // a firefly over every phone (flies in after "Kenya"), empty speech glyph on WhatsApp; they rise and gather on "On average"
      const gather = (v) => clamp((t - (A.onavg - .35 + (v.seed % 7) * .03)) / 1.2);
      for (const v of VENDORS) {
        if (!v.phone || t < v.fly) continue; const ar = eoutX(clamp((t - v.fly) / .9)), g = qio(gather(v));
        const hover = [v.phone[0] + 4 * Math.sin(t * 2.3 + v.seed), v.phone[1] - 34 * v.sc - 4 * Math.cos(t * 1.9 + v.seed)];
        const fmS = S(cm, FM[0], FM[1]), from = [hover[0] + (v.seed % 2 ? 260 : -260), hover[1] - 520];
        let p = [mix(from[0], hover[0], ar), mix(from[1], hover[1], ar)]; p = [mix(p[0], fmS[0], g), mix(p[1], fmS[1], g)];
        if (g >= 1) continue;
        dayFly(ctx, t, { x: p[0], y: p[1], s: Math.min(2.4, 1.5 * v.sc + .2), seed: v.seed, trail: [[p[0] - (1 - ar) * 30, p[1] - (1 - ar) * 60], p], glow: 1 });
        bubble(ctx, hover[0] + 30 * v.sc, hover[1] - 44 * v.sc, Math.min(2, 1.5 * v.sc), clamp((t - A.whatsapp - (v.seed % 5) * .06) / .35) * (1 - g * 4), INK.ink);
      }
    }
    // night falls over the page (5.12): above `front` the frame IS the line-plate ground
    const front = mix(-480, H + 40, sm(clamp((t - A.different - .9) / 3.1)));
    nightOver(ctx, t, front, { y: 560 });
    // the one waiting firefly (the advisor): forms where the street's fireflies gather, waits over the chart, reaches both figures (5.11)
    if (t > A.onavg + .7 && t < A.different + 1.4) {
      const fm = S(cm, FM[0], FM[1]), mid = S(cm, MID[0] - 40, MID[1]), dn2 = qio(clamp((t - A.similar + .15) / 1.0));
      const p = [mix(fm[0], mid[0], dn2) + 6 * Math.sin(t * 1.7), mix(fm[1], mid[1] - 150, dn2) + 5 * Math.cos(t * 1.3)];
      if (t < A.different + .35) dayFly(ctx, t, { x: p[0], y: p[1], s: 1.8, seed: 4, glow: 1.2 + .5 * clamp(1 - Math.abs(t - A.similar - 1) * 2) });
      // its light reaches both heads (two thin threads of light), then it splits: one light along each path
      const reach = clamp((t - A.similar - .7) / .45) * (1 - clamp((t - A.different - .2) / .5));
      if (reach > 0) { ctx.save(); ctx.lineCap = 'round'; for (const E of [E1, E2]) { const h = S(cm, E[0], E[1]); const hx = h[0], hy = h[1] - 150 * .9 * k / 1.6; ctx.strokeStyle = rgba('#5fae86', .7 * reach); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.quadraticCurveTo(mix(p[0], hx, .5), mix(p[1], hy, .5) - 30, mix(p[0], hx, eoutX(reach)), mix(p[1], hy, eoutX(reach))); ctx.stroke(); } ctx.restore(); }
      if (t > A.different + .35) for (const [Sp, sd] of [[S1, 1], [S2, 2]]) { const u = qio(clamp((t - A.different - .35) / 1.0)), s = S(cm, Sp[0], Sp[1]); const fx = mix(p[0], s[0], u), fy = mix(p[1], s[1], u) - Math.sin(Math.PI * u) * 50; dayFly(ctx, t, { x: fx, y: fy, s: 1.6, seed: sd + 10, glow: 1.2, night: clamp((front + 420 - fy) / 420) }); }
    }
    // the two paths glow faintly at night (walked roads), the conductors, the swarms
    if (t > A.similar) {
      const night = clamp((t - A.different - .9) / 3.1);
      if (night > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; for (const [E, Sp, col] of [[E1, S1, '#e9dcc0'], [E2, S2, '#e7a08f']]) { ctx.strokeStyle = rgba(col, .3 * night); ctx.lineWidth = 2.2; ctx.beginPath(); for (let i = 0; i <= 30; i++) { const q = i / 30, w = col === '#e7a08f' ? Math.sin(q * 17) * 9 * q : 0, [x, y] = S(cm, mix(E[0], Sp[0], q), mix(E[1], Sp[1], sm(q)) + w); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); } ctx.restore(); }
      const popF = eoutX(clamp((t - A.similar - .2) / .45)), sc = .9 * k / 1.6;
      if (popF > 0) for (const [E, calm, seed] of [[E1, true, 8], [E2, false, 21]]) {
        const [fx, fy] = S(cm, E[0], E[1]); if (fy > H + 260) continue;
        const raise = calm ? eoutX(clamp((t - A.amplify - .05) / .6)) : .55 + .3 * Math.sin((t - A.amplify) * 2.4) * clamp((t - A.amplify) / .5);
        ctx.save(); ctx.translate(fx, fy); ctx.scale(1, popF); ctx.translate(-fx, -fy);
        conductor(ctx, t, fx, fy, sc, { view: 'profile', pose: calm ? 'handRaised' : 'handHalf', from: 'stand', u: t > A.amplify ? clamp(raise) : 0, seed, rim: .25 + .75 * night, glow: night * .8, light: { x: fx + 400, y: fy - 200, col: F8.amber, a: .9 } });
        ctx.restore();
      }
      // the swarms: six lights each from the split firefly, ×3 on "amplify"; above an ordered column, below a chaotic cloud
      if (t > A.different + 1.3) for (const [Sp, ordered] of [[S1, true], [S2, false]]) {
        const s0 = S(cm, Sp[0], Sp[1]), n = t > A.amplify ? 24 : 6, sw = swarmPts(t, s0, 24, ordered, A.different + 1.35), kk = k / 1.6;
        for (const f of sw) { if (f.i >= n && t < f.tb) continue; if (t < f.tb) continue;
          const bu = eoutX(clamp((t - f.tb) / .6)), P = (tt) => { const [ox, oy] = f.at(tt), bb = eoutX(clamp((tt - f.tb) / .6)); return [s0[0] + ox * kk * bb + (ordered ? 0 : 0), s0[1] + oy * kk * bb]; };
          const tr = []; for (let q = 6; q >= 0; q--) tr.push(P(t - .25 * q / 6)); const p = tr[tr.length - 1]; if (p[1] > H + 80) continue;
          firefly(ctx, t, { x: p[0], y: p[1], s: .95 * kk, seed: f.i + (ordered ? 0 : 50), trail: tr, glow: ordered ? 1.15 : 1 }); }
      }
    }
    // the closing firefly: rises from the middle, lays the thread (the line plate), flies on upward
    if (t > A.them - .3) {
      const u1 = qio(clamp((t - (A.them - .3)) / 1.1)), u2 = einOut(clamp((t - (A.ha - .78)) / .5));
      const p0 = S(cm, MID[0] + 60, MID[1]);
      const fp = (tt) => { const a = qio(clamp((tt - (A.them - .3)) / 1.1)), b = einOut(clamp((tt - (A.ha - .78)) / .5)), base = S(cam(Math.max(tt, A.them - .3)), MID[0] + 60, MID[1]); return [mix(mix(p0[0], 960, a), 1010, b), mix(mix(base[1], 560, a), -140, b)]; };
      const Lw = 1400 * eoutX(clamp((t - (A.them + .55)) / .85));
      if (Lw > 0) lineOnly(ctx, t, { y: 560, tone: 'gold' }, Lw);
      const p = fp(t); if (p[1] > -60) { const tr = []; for (let q = 8; q >= 0; q--) tr.push(fp(t - .3 * q / 8)); firefly(ctx, t, { x: p[0], y: p[1], s: 1.4, seed: 30, trail: tr, glow: 1.3, pulse: clamp(1 - Math.abs(t - A.them - .7) * 2) }); }
    }
    // the plate light contracts into the firefly that lands on the page (5.01)
    if (t < LAND + .5) {
      const u = glowU(t), at = S(cm, DOT[0], DOT[1] - 6);
      if (u < 1) { const g = glowFrom(ctx, t, HI.plate, u, at, { kMin: .02 }); if (u > .4) firefly(ctx, t, { x: g.x, y: g.y, s: 1.6, seed: 12, glow: 1.3 }); }
      else { const o = clamp((t - LAND) / .45); firefly(ctx, t, { x: at[0], y: at[1] - 4 * (1 - o), s: 1.6 * (1 - .6 * o), seed: 12, a: 1 - o, glow: 1.3 * (1 - o) }); }
    }
    // KENYA label (screen space, still while read)
    const kl = clamp((t - Math.max(A.kenyaW, A.kenya + 2.3)) / .6) * (1 - clamp((t - A.onavg + .45) / .35));
    if (kl > 0) { inkText(ctx, 'KENYA · 640 SMALL BUSINESS OWNERS', 112, 806, { size: 30, font: 'caps', u: kl, color: INK.ink }); inkText(ctx, 'OTIS ET AL.', 114, 872, { size: 18, font: 'caps', u: clamp((t - Math.max(A.owners, A.kenya + 2.7)) / .6) * (1 - clamp((t - A.onavg + .45) / .35)), color: rgba(INK.ink, .7) }); }
  };
  const PBa = (u) => [CA.x + CA.w * (CA.plot[0] + u * (CA.plot[2] - CA.plot[0])), 0];
  const dotGrow = (t) => 1;
  const einOut = (x) => x * x * (3 - 2 * x) * x;
  const PR = HI.print;
  const SND = {
    [A.hb]: [{ f: 'whoosh_airy', t: A.hb + .05, v: .35 }, { f: 'drop', t: LAND - .03, v: .3 }],
    [A.first]: [{ f: 'pencil', t: A.first + .1, v: .25 }],
    [A.building]: [{ f: 'paper_pop', t: A.building + .5, v: .35 }],
    [A.kenya]: [{ f: 'wings', t: A.kenyaW + 1.4, v: .25 }],
    [A.onavg]: [{ f: 'pages', t: A.onavg - .3, v: .4 }],
    [A.hands]: [{ f: 'shimmer_rings', t: A.amplify + .05, v: .35 }],
    [A.them - 1]: [{ f: 'whoosh_up', t: A.them + .3, v: .35 }],
  };
  const starts = [A.hb, A.first, A.about, A.building, A.getting, A.kenya, A.onavg, A.those2, A.hands, A.them - 1];
  return starts.map((t0, i) => ({ t: t0, tr: 'cut', d: .1, draw, print: i === starts.length - 1 ? HO.print : PR, sound: SND[t0] }));
};
