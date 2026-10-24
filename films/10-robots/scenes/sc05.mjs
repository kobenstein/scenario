// Film 10 · c05 · "Was es uns kostet" (02b rest) · 246.78–292.42 s · night · ★ 5.11 (the pottery wheel)
// Editorial-Nacht (lib/f10_editorial.mjs) + B2 helpers (lib/f10_c04_b2.mjs) + the shared hall stage (lib/f10_c04_hall.mjs, from c04)
// + the pottery shed (lib/f10_c05_pot.mjs, continued by c06).
//
// PLAN (word → picture · hero light · ≤2 moves · carrier)                                                       [EXPL] = explainer
// 246.78 imagine it's your job      the hall (same frame as c04's end): the trainer becomes you, yellow rises from the hem
// 248.78 every move … it keeps      [EXPL] your move flows into the robot; a tally grows: IT KEEPS (strokes) / YOU DON'T (empty row)
// 252.38 not because … copy         [EXPL] on "copy" all strokes stream into the robot; it repeats your move exactly
// 256.14 then the robot comes home  the robot walks into the window light → flight into the light (flood)
// 257.47 remember … maker said      out of the light of an open front door: the robot steps over the threshold (door light = hero)
// 259.74 "If we don't have …"       [EXPL] the trace writes the quote on the dark wall beside the door, the source under it
// 263.58 in the hall … a cup        flight into the door light → out of the light of a cup: cold arcs of data circle it
// 266.22 in your home, your life    [EXPL] pull back: the kitchen is one cell of the house in section (lines of light)
// 268.70 sleep · eat · visit        [EXPL] one cell after the other lights (bed · open fridge · door with a friend); from each a cold
//                                   point rises through the roof; a count 1 · 2 · 3.
// 272.06 last year's robots · nine  [EXPL] crane up with the points: they split into ten robot marks; nine turn steel blue. ~9 IN 10
// 276.14 a few companies · one      [EXPL] pull back: the marks become points among all the homes and factories of a map of light;
//        country · power            cold threads run to a few nodes, the nodes slide into one; on "power" it becomes a cold ring.
// 283.66 a quieter question         the camera turns away from the flow (truck left) to one unconnected warm window: flight in
// 285.40 ★ own hands                the pottery shed, one bulb: grandmother's hands on a clay cup; on "own hands" they lift, the
//                                   wheel runs out alone. Silence: the camera rises over the wheel, the grooves become rings (→ c06)
import { Path2D } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import { run, wipe, writeOn, mark, floodK, floodIn, floodOut, sky, house, env, iris, COOLC } from '../lib/f10_c04_b2.mjs';
import { initHall, hallStage } from '../lib/f10_c04_hall.mjs';
import { initPot, potStage } from '../lib/f10_c05_pot.mjs';
const { W, H, P, F0, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, rgba, mixHex, lin, rad, prng } = E;

export default async function (T, R) {
  E.prepareEditorial();
  const s = (ph, n) => T.S('02b', ph, n);
  const HA = initHall(T), PA = initPot(T);
  const A = {
    remember: s('Remember what'), said: s('maker said') + .32, if1: s('If we'), data: s('your data,'), cant: s("we can't"), make: s('make the product'), better: s('product better') + .4,
    inhall: s('In the hall'), cup: s('a cup') + .16, yourhome: s('In your home'), life: s('your life') + .16, sleep: s('sleep'), eat: s('eat'), visit: s('visit'),
    of: s('Of last year'), nine: s('nine'), china: s('China', 1), if2: s('If a few'), few: s('few companies'), one: s('one country'), own: s('own the hands'),
    home: s('every home') + .32, factory: s('every factory') + .32, who: s('who holds'), power: s('power'), quieter: s('quieter question'),
  };
  const CUT_DOOR = HA.flood, CUT_CUP = A.inhall + .72, CUT_SHED = A.quieter + 1.34;
  const mono = (k) => Math.max(1e-3, k);

  // ===================== stage D · the front door: the robot steps in; the quote on the wall =====================
  const FL = 860, DR = { x: 1150, y: 470, w: 200, h: 390 }, DC = [DR.x + DR.w / 2, DR.y + DR.h * .55];
  const KD = [
    [CUT_DOOR, E.aim(F0, DC[0], DC[1], 60)],
    [CUT_DOOR + 1.9, E.aim(F0, 1000, 560, 1.0), 'o'],
    [CUT_CUP - .85, E.aim(F0, 985, 560, 1.06)],
    [CUT_CUP, E.aim(F0, DC[0], DC[1], 60), 'i'],
  ];
  const QL = [['“If we don’t have', A.if1 - .05, A.data - .1], ['your data, we can’t', A.data - .05, A.cant + .5], ['make the product', A.make - .05, A.make + .4], ['better.”', A.better - .4, A.better]];
  function stageD(ctx, t) {
    const c = E.camDrift(E.camAt(t, KD), t, .6);
    sky(ctx, c, t, { gx: DC[0], gy: 600, gr: 1300, ga: .5, seed: 31, n: 140 });
    E.card(ctx, c, 6000, () => E.ground(ctx, [[-1400, 700], [0, 650], [900, 690], [2000, 640], [3400, 680]], { stops: [[0, P.ind0], [1, P.night0]], rim: rgba(P.blue0, .6), rimW: 2 }));
    E.card(ctx, c, F0, () => {
      E.ground(ctx, [[-900, FL + 10], [400, FL], [1800, FL - 4], [3000, FL + 6]], { stops: [[0, P.night1], [1, P.night0]] });
      house(ctx, 760, FL, 1000, 600, { roof: 230, chimney: true, stops: [[0, mixHex(P.night1, P.ind0, .3)], [1, mixHex(P.ind0, P.blue0, .2)]] });
      // the door light (hero), the open leaf, the step, the light falling out onto the path
      E.lightForm(ctx, 'window', DR.x, DR.y, DR.w, DR.h, t, { mullions: [1, 1], dust: 1800, seed: 61, breath: .01 });
      ctx.fillStyle = P.night0; ctx.beginPath(); ctx.moveTo(DR.x, DR.y); ctx.lineTo(DR.x + 46, DR.y + 22); ctx.lineTo(DR.x + 46, DR.y + DR.h - 12); ctx.lineTo(DR.x, DR.y + DR.h); ctx.closePath(); ctx.fill();
      ctx.fillStyle = mixHex(P.night1, P.ind0, .5); ctx.fillRect(DR.x - 30, FL, DR.w + 60, 14);
      ctx.save(); ctx.filter = 'blur(8px)'; ctx.fillStyle = lin(ctx, 0, FL, 0, FL + 230, [[0, rgba(P.halo0, .55)], [.5, rgba(P.halo1, .2)], [1, rgba(P.shade0, 0)]]);
      ctx.beginPath(); ctx.moveTo(DR.x, FL + 14); ctx.lineTo(DR.x + DR.w, FL + 14); ctx.lineTo(DR.x + DR.w + 260, FL + 240); ctx.lineTo(DR.x - 200, FL + 240); ctx.closePath(); ctx.fill(); ctx.restore();
      // the robot with the cup: from the path over the threshold into the light (smaller, further in)
      const k = span(t, CUT_DOOR + .3, A.said + .6), e = sineIO(k), walking = k > 0 && k < 1;
      const rx = DC[0] + 6, ry = lerp(FL + 50, FL - 6, e), rh = lerp(330, 300, e);
      E.castShadow(ctx, rx, ry, 30, 160, 1.5, .5 * (1 - e));
      E.robot(ctx, rx, ry, rh, { dir: -1, light: -1, rim: P.halo0, body: P.night0, cup: 'R', walk: walking ? k * 9 : undefined, pose: walking ? 'walk' : 'stand' });
      // the quote, written by a warm trace on the dark wall left of the door; the source under it
      iris(ctx, 680, 480, 620, .5 * env(t, A.if1 - .5, A.if1 + .3), 1.35);
      QL.forEach(([str, a, b], i) => writeOn(ctx, str, 360, 330 + i * 86, span(t, a, b), { serif: true, size: 76 }));
      wipe(ctx, 'BERNT BØRNICH, CEO OF 1X (MAKER OF NEO)', 362, 690, span(t, A.if1 + .2, A.if1 + .7), { size: 26, glow: false, col: P.halo2, spacing: .1 });
      wipe(ctx, 'WALL STREET JOURNAL, 2025', 362, 728, span(t, A.if1 + .35, A.if1 + .85), { size: 26, glow: false, col: P.halo2, spacing: .1 });
    });
    E.lightFlood(ctx, Math.max(floodK(c, F0, DR.w * 1.05), floodOut(t, CUT_DOOR, 1.2), floodIn(t, CUT_CUP, .9), t < CUT_DOOR + 1e-3 || t >= CUT_CUP - 1e-3 ? 1 : 0));
  }

  // ===================== stage C · the cup → the house in section → the points → ten robots → the map of power =====================
  const HX0 = 560, HX1 = 1360, HF = 900, HM = 600, HT = 330, PEAK = [960, 140];
  const CUPP = [800, 846], BEDP = [760, 532], FRP = [640, 800], DOORP = [1318, 806], ROB = [1090, HF], VIS = [1090, HF - .93 * 240];
  const SRC = [BEDP, FRP, DOORP], AT = [A.sleep, A.eat, A.visit], PEND = [[880, 40], [960, 18], [1040, 40]];
  const ROW = (i) => [960 + (i - 4.5) * 146, -560];
  // the map of light (design units, seen from far away)
  const rnd = prng(1205), MP = [];
  for (let c = 0; c < 46; c++) {
    const cx = 960 + (rnd() * 2 - 1) * 2350, cy = -320 + (rnd() * 2 - 1) * 1250; if (Math.hypot((cx - 960) / 2350, (cy + 320) / 1250) > 1) { c--; continue; }
    const n = 3 + Math.floor(rnd() * 8); for (let j = 0; j < n; j++) MP.push([cx + (rnd() - .5) * 260, cy + (rnd() - .5) * 200, rnd()]);
  }
  for (let i = 0; i < 10; i++) MP.push([...ROW(i), rnd()]);
  MP.push([960, 520, .5]);                                           // your house (the section shrinks into it)
  const FAC = []; for (let i = 0; i < 12; i++) { const a = rnd() * 6.283, r = Math.sqrt(rnd()); FAC.push([960 + Math.cos(a) * r * 2000, -320 + Math.sin(a) * r * 1050]); }
  const NODES = [[1900, -1050], [2500, -420], [2200, 420], [1350, 60]], ONE = [2380, -300];
  const nodeOf = (p) => { let b = 0, bd = 1e9; NODES.forEach((n, i) => { const d = Math.hypot(n[0] - p[0], n[1] - p[1]); if (d < bd) { bd = d; b = i; } }); return b; };
  const MPN = MP.map(nodeOf), FACN = FAC.map(nodeOf);
  const SHED = [-1750, -120];
  const KC = [
    [CUT_CUP, E.aim(F0, CUPP[0], CUPP[1] - 14, 60)],
    [CUT_CUP + 1.0, E.aim(F0, CUPP[0], CUPP[1] - 16, 5.2), 'o'],
    [A.yourhome + .05, E.aim(F0, CUPP[0] + 4, CUPP[1] - 18, 4.7)],
    [A.life + .5, E.aim(F0, 960, 520, 1.0), 's'],
    [A.of - .1, E.aim(F0, 960, 505, 1.05)],
    [A.of + 1.5, E.aim(F0, 960, -545, 1.0), 's'],
    [A.if2 - .5, E.aim(F0, 960, -560, 1.05)],
    [A.one + .3, E.aim(F0, 1060, -320, .4), 's'],
    [A.who, E.aim(F0, 1180, -320, .43)],
    [A.power + .9, E.aim(F0, 1330, -310, .48), 's'],
    [A.quieter + .55, E.aim(F0, SHED[0], SHED[1] + 6, 1.3), 'q'],
    [CUT_SHED, E.aim(F0, SHED[0], SHED[1] + 6, 60), 'i'],
  ];
  // a cool line whose width stays the same on screen (k = card scale)
  const coolLine = (ctx, pts, k, w, a) => {
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const [m, al, col, op] of [[3.2, .35, P.blue0, 'lighter'], [1.4, .8, COOLC, 'source-over'], [.6, 1, P.cream, 'source-over']]) {
      ctx.globalCompositeOperation = op; ctx.globalAlpha = al * a; ctx.strokeStyle = col; ctx.lineWidth = w * m / k; ctx.beginPath(); ctx.moveTo(...pts[0]); for (const q of pts.slice(1)) ctx.lineTo(...q); ctx.stroke();
    }
    ctx.restore();
  };
  const ellPts = (cx, cy, rx, ry, rot, a0, a1, n = 40) => { const out = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n), x = Math.cos(a) * rx, y = Math.sin(a) * ry; out.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]); } return out; };
  const dot = (ctx, x, y, r, k, a = 1) => { E.halo(ctx, x, y, r * 3.2 / k, .55 * a, P.blue0, P.blue0); ctx.fillStyle = rgba(P.cream, a); ctx.beginPath(); ctx.arc(x, y, r / k, 0, 6.29); ctx.fill(); };
  // the count 1 · 2 · 3 (rolling digit, masked)
  const roll = (ctx, n, prev, u, x, y, size) => {
    ctx.save(); ctx.beginPath(); ctx.rect(x - size, y - size * 1.05, size * 2, size * 1.25); ctx.clip();
    const e = expoOut(u); if (prev) E.glowText(ctx, prev, x, y - e * size * 1.2, { size, serif: true, align: 'center' });
    E.glowText(ctx, n, x, y + (1 - e) * size * 1.2, { size, serif: true, align: 'center' }); ctx.restore();
  };
  function section(ctx, t, k) {
    const grow = smooth(span(t, A.yourhome + .1, A.life + .6)), sq = 1 - smooth(span(t, A.if2 - .7, A.if2 + .1));   // section shrinks into its point
    if (sq <= .002) return;
    ctx.save(); ctx.translate(960, 520); ctx.scale(sq, sq); ctx.translate(-960, -520);
    // rooms: dark cells; the active one warms
    const rooms = [[HX0, HT, 960, HM, 0], [960, HT, HX1, HM, -1], [HX0, HM, 960, HF, 1], [960, HM, HX1, HF, 2]];
    for (const [x0, y0, x1, y1, ev] of rooms) {
      const act = ev >= 0 ? env(t, AT[ev] - .25, AT[ev] + .35, (AT[ev + 1] ?? A.of + .6) - .2, (AT[ev + 1] ?? A.of + .6) + .5) : 0;
      ctx.fillStyle = lin(ctx, 0, y0, 0, y1, [[0, P.night0], [1, mixHex(P.night1, P.ind0, .4)]]); ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      if (act > 0) { const a = act * .6; ctx.fillStyle = rad(ctx, (x0 + x1) / 2, y1 - 40, 420, [[0, rgba(P.halo1, .5 * a)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(x0, y0, x1 - x0, y1 - y0); }
    }
    // furniture (dark) and the three things that light up
    ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.fillRect(740, 862, 150, 12); ctx.fillRect(752, 874, 10, 26); ctx.fillRect(868, 874, 10, 26);   // table
    E.icon(ctx, 'cup', CUPP[0], CUPP[1], 30, t, { lit: 1, dust: 0, glow: .6 });
    const lit = (i) => smooth(span(t, AT[i] - .15, AT[i] + .35));
    mark(ctx, 'bed', BEDP[0], BEDP[1] + 20, 190, t, { lit: lit(0) > .5 ? 1 : 0, a: .35 + .65 * lit(0), glow: .8 });
    mark(ctx, 'fridge', FRP[0], FRP[1] + 10, 170, t, { lit: lit(1) > .5 ? 1 : 0, a: .35 + .65 * lit(1), glow: .8 });
    mark(ctx, 'door', DOORP[0], DOORP[1] + 4, 180, t, { lit: lit(2) > .5 ? 1 : 0, a: .35 + .65 * lit(2), glow: .8 });
    // a friend comes in at the door (indigo), on "visit"
    const fk = span(t, A.visit - .9, A.visit + .3);
    if (fk > 0) { ctx.save(); ctx.beginPath(); ctx.rect(960, HM, HX1 - 960, HF - HM); ctx.clip(); E.person(ctx, lerp(1470, 1250, sineIO(fk)), HF, 200, { dir: -1, light: -1, pose: fk < 1 ? 'walk' : 'stand', walk: fk < 1 ? fk * 8 : undefined }); ctx.restore(); }
    // the robot in the hall of the house; its visor sends cold scan arcs through the rooms
    E.robot(ctx, ROB[0], ROB[1], 240, { dir: -1, light: 1, rim: P.blue0, body: P.night1 });
    const scan = env(t, A.yourhome + .5, A.life + .2, A.of, A.of + .4);
    if (scan > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(HX0, HT - 200, HX1 - HX0, HF - HT + 200); ctx.clip();
      for (let i = 0; i < 4; i++) { const ph = ((t - A.yourhome) * .55 + i / 4) % 1, r = 40 + ph * 640; coolLine(ctx, ellPts(VIS[0], VIS[1], r, r * .9, 0, Math.PI * .62, Math.PI * 1.38, 28), k, 1.6, scan * (1 - ph) * .9); }
      ctx.restore();
    }
    // the walls: lines of light that draw the section as the camera pulls back
    if (grow > 0) {
      const w = { w: 3 / Math.max(.6, k) * 1.4, spark: grow < 1 };
      E.trail(ctx, [[HX0, HF, w.w], [HX1, HF, w.w]], grow, w);
      E.trail(ctx, [[HX0, HF, w.w], [HX0, HT, w.w], [PEAK[0], PEAK[1], w.w], [HX1, HT, w.w], [HX1, HF, w.w]], grow, w);
      E.trail(ctx, [[HX0, HM, w.w], [HX1, HM, w.w]], grow, w); E.trail(ctx, [[960, HT, w.w], [960, HF, w.w]], grow, w);
    }
    ctx.restore();
  }
  function cupArcs(ctx, t, k) {
    const a = env(t, CUT_CUP - .1, CUT_CUP + .6, A.yourhome + .3, A.life);
    if (a <= 0) return;
    for (let i = 0; i < 3; i++) {
      const rot = -.5 + i * .5 + Math.sin(t * .4 + i) * .05, ph = t * (1.2 + i * .3) + i * 2, r = 34 + i * 9;
      coolLine(ctx, ellPts(CUPP[0], CUPP[1] - 4, r, r * .36, rot, ph, ph + 2.6, 30), k, 2, a);
      const hx = CUPP[0] + Math.cos(ph + 2.6) * r * Math.cos(rot) - Math.sin(ph + 2.6) * r * .36 * Math.sin(rot), hy = CUPP[1] - 4 + Math.cos(ph + 2.6) * r * Math.sin(rot) + Math.sin(ph + 2.6) * r * .36 * Math.cos(rot);
      dot(ctx, hx, hy, 2.6, k, a);
    }
  }
  function points(ctx, t, k) {
    // three cold points rise from bed / fridge / door through the roof; after "Of last year" they rise to the row and split into ten
    const up = smooth(span(t, A.of + .05, A.of + 1.2));
    const pos = [];
    SRC.forEach((sp, i) => {
      const u = span(t, AT[i] + .1, AT[i] + 1.0); if (u <= 0) return; const e = quartIO(u);
      let x = lerp(sp[0], PEND[i][0], smooth(span(e, .55, 1))), y = lerp(sp[1], PEND[i][1], e);
      x = lerp(x, 960, up); y = lerp(y, ROW(0)[1], up);
      pos.push([x, y]);
      if (up < 1) { coolLine(ctx, [[sp[0], sp[1]], [x, y]], k, .8, .25 * (1 - up) * (1 - smooth(span(t, AT[i] + 1, AT[i] + 1.6)))); dot(ctx, x, y, 7, Math.max(k, .3), 1); }
    });
    // the count beside them
    const ca = 1 - smooth(span(t, A.of, A.of + .4));
    if (t > AT[0] + .9 && ca > 0) {
      ctx.save(); ctx.globalAlpha = 1; let n = 0; AT.forEach((a) => { if (t > a + .9) n++; });
      const u = span(t, AT[n - 1] + .9, AT[n - 1] + 1.3); roll(ctx, String(n), n > 1 ? String(n - 1) : null, u, 1170, 100 + (1 - ca) * 140, 120); ctx.restore();
    }
    // ten robot marks (from the three points), nine turn steel blue on "nine"; ~9 IN 10
    const sh = 1 - smooth(span(t, A.if2 - .6, A.if2 + .2));   // they shrink into map points
    for (let i = 0; i < 10; i++) {
      const g = span(t, A.of + .9 + i * .07, A.of + 1.7 + i * .07); if (g <= 0) continue;
      const from = [960 + (Math.floor(i * 3 / 10) - 1) * 80, ROW(0)[1]], [tx, ty] = ROW(i), e = quartIO(g);
      const x = lerp(from[0], tx, e), y = lerp(from[1], ty, e) - Math.sin(Math.PI * e) * 60;
      const cool = i < 9 ? smooth(span(t, A.nine + i * .05, A.nine + .35 + i * .05)) : 0;
      if (sh > .02) mark(ctx, 'robot', x, y, 128 * sh, t, { lit: 1 - cool, u: g, glow: 1.1, dust: 0 });
    }
    const ta = 1 - smooth(span(t, A.if2 - .5, A.if2));
    if (ta > 0) {
      ctx.save(); ctx.globalAlpha = ta;
      writeOn(ctx, '~9 IN 10', 960, -700, span(t, A.nine - .1, A.nine + .55), { serif: true, size: 150, align: 'center' });
      wipe(ctx, 'FROM CHINA', 960, -410, span(t, A.china - .05, A.china + .45), { size: 46, align: 'center', glow: false, col: COOLC, spacing: .16, weight: 700 });
      wipe(ctx, 'OMDIA 2025 (87 %)', 960, -360, span(t, A.china + .25, A.china + .7), { size: 26, align: 'center', glow: false, col: P.halo2, spacing: .12 });
      ctx.restore();
    }
  }
  function powerMap(ctx, t, k) {
    const g0 = A.if2 - .5; if (t < g0) return;
    const nodeAt = (i) => { const m = quartIO(span(t, A.one - .05, A.one + .9 + i * .08)); return [lerp(NODES[i][0], ONE[0], m), lerp(NODES[i][1], ONE[1], m)]; };
    const pw = smooth(span(t, A.power - .2, A.power + .5)), hm = smooth(span(t, A.home - .3, A.home + .4)), fc = smooth(span(t, A.factory - .3, A.factory + .4));
    // threads: from every home and factory to its node (grow, then follow the nodes), outward pulses on "own the hands"
    const thread = (p, ni, d, i, a) => {
      const u = span(t, A.few - .15 + d * .00028, A.few + .45 + d * .00028); if (u <= 0) return;
      const n = nodeAt(ni), mx = (p[0] + n[0]) / 2 - (n[1] - p[1]) * .12 * (1 - pw), my = (p[1] + n[1]) / 2 + (n[0] - p[0]) * .12 * (1 - pw);
      const pts = []; for (let j = 0; j <= 10; j++) { const q = j / 10 * u, a1 = (1 - q) ** 2, b1 = 2 * (1 - q) * q, c1 = q * q; pts.push([a1 * p[0] + b1 * mx + c1 * n[0], a1 * p[1] + b1 * my + c1 * n[1]]); }
      ctx.strokeStyle = rgba(COOLC, (.16 + .2 * pw) * a); ctx.lineWidth = 1.3 / k; ctx.beginPath(); ctx.moveTo(...pts[0]); for (const q of pts.slice(1)) ctx.lineTo(...q); ctx.stroke();
      if (t > A.own && u >= 1) { const f = 1 - ((t - A.own) * .45 + i * .137) % 1, a1 = (1 - f) ** 2, b1 = 2 * (1 - f) * f, c1 = f * f; const x = a1 * p[0] + b1 * mx + c1 * n[0], y = a1 * p[1] + b1 * my + c1 * n[1]; ctx.fillStyle = rgba(P.cream, .5 * smooth(span(t, A.own, A.own + .6))); ctx.fillRect(x - 1.6 / k, y - 1.6 / k, 3.2 / k, 3.2 / k); }
    };
    MP.forEach((p, i) => thread(p, MPN[i], Math.hypot(p[0] - NODES[MPN[i]][0], p[1] - NODES[MPN[i]][1]), i, 1));
    FAC.forEach((p, i) => thread(p, FACN[i], Math.hypot(p[0] - NODES[FACN[i]][0], p[1] - NODES[FACN[i]][1]), i + 400, 1.3));
    // homes: warm points that grow outward from the robot row, brighten on "every home"
    MP.forEach((p, i) => {
      const d = Math.hypot(p[0] - 960, p[1] + 560), u = span(t, g0 + d * .00035, g0 + .5 + d * .00035); if (u <= 0) return;
      const br = 1 + .8 * hm * env(t, A.home - .3 + p[0] * .00012, A.home + .1 + p[0] * .00012, A.home + .9, A.home + 1.6);
      E.halo(ctx, p[0], p[1], 22 / k * br, .32 * u, P.halo1, P.halo0); ctx.fillStyle = P.core1; const r = 2.2 / k * expoOut(u); ctx.fillRect(p[0] - r, p[1] - r, 2 * r, 2 * r);
    });
    FAC.forEach((p, i) => { const d = Math.hypot(p[0] - 960, p[1] + 560), u = span(t, g0 + .2 + d * .00035, g0 + .8 + d * .00035); if (u > 0) E.icon(ctx, 'factory', p[0], p[1], 34 / k * expoOut(u), t, { lit: fc > .5 ? 1 : .3, dust: 0, glow: .7, a: .6 + .4 * fc }); });
    // the nodes: cold rings; they slide into one; on "power" it becomes the one cold ring in the picture
    const nk = smooth(span(t, A.few - .1, A.few + .5));
    if (nk > 0) {
      NODES.forEach((_, i) => { const n = nodeAt(i), r = (10 + 6 * nk) / k * (1 + 3.2 * pw); const p = new Path2D(); p.arc(n[0], n[1], r, 0, 6.29); E.lightShape(ctx, p.stroke({ width: r * .32, cap: 0, join: 1 }), t, { lit: 0, dust: 0, glow: 1.4 + pw }); });
      if (pw > 0) E.halo(ctx, ONE[0], ONE[1], 160 / k * pw, .3 * pw, P.blue0, P.cream);
    }
    // the shed far left: one warm window, no thread
    house(ctx, SHED[0] - 34, SHED[1] + 26, 68, 46, { roof: 26, rimW: 1.2 / k });
    E.lightForm(ctx, 'window', SHED[0] - 14, SHED[1] - 6, 28, 22, t, { mullions: [2, 1], dust: 0, breath: .01 });
  }
  function stageC(ctx, t) {
    const c = E.camDrift(E.camAt(t, KC), t, .5), k = E.cardM(c, F0)?.k ?? 1;
    sky(ctx, c, t, { gx: 960, gy: 300, gr: 1500, ga: .45, seed: 33, n: 120, box: [-6000, -5000, 9000, 4000] });
    E.card(ctx, c, F0, () => {
      section(ctx, t, k);
      cupArcs(ctx, t, k);
      points(ctx, t, k);
      powerMap(ctx, t, k);
    });
    E.lightFlood(ctx, Math.max(t < CUT_CUP + .9 ? floodK(c, F0, 120) : 0, t > A.quieter ? floodK(c, F0, 120) : 0, floodOut(t, CUT_CUP, 1.2), floodIn(t, CUT_SHED, .9), t < CUT_CUP + 1e-3 || t >= CUT_SHED - 1e-3 ? 1 : 0));
  }

  // ===================== stage P · the pottery shed (lib/f10_c05_pot.mjs) =====================
  function stageP(ctx, t) {
    const c = potStage(ctx, t, CUT_SHED);
    E.lightFlood(ctx, Math.max(floodK(c, F0, 160), floodOut(t, CUT_SHED, 1.2), t < CUT_SHED + 1e-3 ? 1 : 0));
  }

  const draw = run([[R.a, hallStage], [CUT_DOOR, stageD], [CUT_CUP, stageC], [CUT_SHED, stageP]]);
  void mono;
  return [{ t: R.a, draw, print: { editorial: true } }];
}
