// Film 15 · B1 · c03 STATION 1 (44.40 – ~84.4): the tumour read like a text → 34 gold marks → one vial → you, not the average →
// the sealed program → not approved, survival not known → 1,137 patients → a slip leaves the envelope and flies up (→ c04, the box).
// One explainer stage on one card (design coords below), the camera tours it: page (top) → list → vial (down) → you → envelope → curve/field.
// Shots 3.01–3.08 (docs/shots.md). Entry from plateCell (lib/f15_seams.mjs): at the home camera the page IS the plate.
//
// | ID    | time        | anchor                    | picture                                                                    | moves                | carrier → next            |
// | 3.01  | 44.40–49.52 | reads · letter · text     | nine rows read by the cursor; the cursor grows into a scan line + ring; pull back: a page | rows run · pull back | plan sequence |
// | 3.02  | 49.52–53.12 | marks · only · carries    | 34 letters light gold (a wave back from the cursor), lift off, line up: up to 34 MARKS | marks · tiles fly | tiles → grains, down |
// | 3.03★ | 53.12–57.76 | vaccine · one · Nobody    | the tiles crumble into grains that fall into ONE vial; it stands alone in its cone | grains · vial fills | pull back |
// | 3.04  | 57.76–61.04 | reads you · average       | you beside it in the same warm cone; behind, a row of identical cool people (the average) | pull back · light grazes | the label → envelope |
// | 3.05  | 61.04–68.84 | artificial · machine · secret · check | a slip peels off the label, folds into an envelope, gold seal; the ring circles it, no way in | fold · ring | plan sequence |
// | 3.06  | 68.84–73.72 | approved · longer · known | an empty dashed APPROVED field; a gold line from the vial runs on as survival, solid 2 years, then dashed | stamp · line | line → points |
// | 3.07  | 73.72–78.53 | lucky · thousand          | the line breaks into 1,137 points that settle into a calm field, left → right | field | plan sequence |
// | 3.08  | 78.53–84.4  | read · list               | the field flows back into the vial; a slip slides out of the envelope and flutters up-right | points · slip | slip → the box (c04) |
import { Path2D, createCanvas } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f15_kit.mjs';
import { CELL, cellShift } from './f15_seams.mjs';
import * as U from './f15_b1_util.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, card, cam3, camAt, camDrift, aim, project, F0, prng } = E;

export function setC03(T, a) {
  // ------------------------------------------------------------------------------------------------ layout (design coords, card F0)
  const PAGE = { x0: -60, x1: 1980, y0: -30, y1: 1110 };
  const ADV = CELL.size * .95, rowY = (r) => CELL.y + r * CELL.pitch;
  const FLOOR = 2410, VIAL = { x: 1350, h: 300 }, DU = { x: 600, h: 600 };
  const ENV = { x: 1900, y: 2040, w: 470, h: 300 };
  const G = { x0: 2330, x1: 3300, y0: 1880, y1: 2270 };                         // the survival line, then the field of patients
  const LIST = { x: 1350, y: 1262, pitch: 50, row: 64, n: 17, size: 40 };
  const ZC = 2900;                                                               // the row of people (the average) stands on this card
  // the reading slows down once the plate is behind us (38 → 4 px/s over 1.6 s): calmer, and the marks can be picked
  const tS = a.T0 + .5, DS = 1.6, V1 = 4;
  const shift = (t) => { if (t <= tS) return cellShift(t); const dt = t - tS, u = Math.min(1, dt / DS); return cellShift(tS) + V1 * dt + (CELL.v - V1) * DS * (u - U.smoothInt(u)); };

  // the 34 marks: letters on the read side of the cursor at "marks", spread over the nine rows (seeded, no neighbours)
  const seq = (r) => { const g = prng(CELL.seed + r * 7); return Array.from({ length: 400 }, () => 'ACGT'[Math.floor(g() * 4)]); };
  const SEQ = {}; for (let r = -4; r <= 4; r++) SEQ[r] = seq(r);
  const lx = (col, t) => CELL.x + col * ADV - shift(t);
  const MARKS = [];
  {
    const g = prng(1503), used = new Set();
    const c0 = Math.ceil((150 - CELL.x + shift(a.marks)) / ADV), c1 = Math.floor((905 - CELL.x + shift(a.marks)) / ADV);
    while (MARKS.length < 34) {
      const row = Math.floor(g() * 9) - 4, col = c0 + Math.floor(g() * (c1 - c0 + 1));
      if ([-1, 0, 1].some((d) => used.has(row + ':' + (col + d)))) continue;
      used.add(row + ':' + col); MARKS.push({ row, col, ch: SEQ[row][col] });
    }
    MARKS.sort((p, q) => p.col - q.col || p.row - q.row);                        // list order = reading order (left → right)
    MARKS.forEach((m, j) => {
      const x50 = lx(m.col, a.marks);
      m.tOn = a.marks + .05 + 1.05 * Math.pow(clamp((962 - x50) / 820), .85);       // a wave back from the cursor (the result arrives)
      m.tLift = a.carries - .3 + j * .024; m.dur = .78;
      m.slot = [LIST.x + ((j % LIST.n) - (LIST.n - 1) / 2) * LIST.pitch, LIST.y + Math.floor(j / LIST.n) * LIST.row];
      m.tFall = a.list + .02 + j * .02;
    });
  }
  // grains: 16 per tile, seeded offsets inside the tile; they fall into the vial neck
  const GR = []; { const g = prng(77); MARKS.forEach((m, j) => { for (let k = 0; k < 16; k++) GR.push({ j, dx: (g() - .5) * LIST.size * .8, dy: -g() * LIST.size, d: g() * .25, s: g() }); }); }
  const scratch = createCanvas(8, 8).getContext('2d');
  const V = F.vial(scratch, VIAL.x, FLOOR, VIAL.h, 0, { fill: .8 });
  const NECK = [VIAL.x, V.top[1] + VIAL.h * .12];
  const LABEL = { x: (V.label[0] + V.label[2]) / 2, y: (V.label[1] + V.label[3]) / 2, w: V.label[2] - V.label[0], h: V.label[3] - V.label[1] };

  // the survival line (from the vial's base along the floor, up into the graph; solid 2 years, then dashed)
  const yS = (v) => lerp(G.y0, G.y1, (100 - v) / 45);                            // % alive → y
  const X2 = lerp(G.x0, G.x1, .4);                                               // 2 years
  const CURVE = E.catmull([[G.x0, yS(100), 3], [lerp(G.x0, X2, .3), yS(97), 3], [lerp(G.x0, X2, .7), yS(92.5), 3], [X2, yS(89), 3], [lerp(X2, G.x1, .35), yS(86.5), 3], [lerp(X2, G.x1, .7), yS(84.5), 3], [G.x1, yS(83), 3]], 12);
  const iX2 = CURVE.findIndex((p) => p[0] >= X2);
  const THREAD = E.catmull([[ENV.x + ENV.w / 2 - 6, ENV.y - 20, 2.4], [ENV.x + ENV.w / 2 + 60, ENV.y - 34, 2.4], [G.x0 - 70, yS(100) + 40, 2.4], [G.x0 - 20, yS(100) + 6, 2.4], [G.x0, yS(100), 2.4]], 10);   // from the program's edge into the graph
  const curveY = (x) => { for (let i = 1; i < CURVE.length; i++) if (CURVE[i][0] >= x) { const p = CURVE[i - 1], q = CURVE[i]; return lerp(p[1], q[1], (x - p[0]) / Math.max(1e-6, q[0] - p[0])); } return CURVE[CURVE.length - 1][1]; };
  // the field: 1,137 patients, a calm jittered field (no grid lines: every point slightly off its cell)
  const FIELD = []; {
    const g = prng(1137), cols = 48, rows = 24, all = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) all.push([c, r, g(), g(), g()]);
    const drop = new Set(); while (drop.size < cols * rows - 1137) drop.add(Math.floor(g() * all.length));
    all.forEach(([c, r, u1, u2, u3], i) => {
      if (drop.has(i)) return;
      const x = lerp(G.x0 + 12, G.x1 - 12, (c + .5 + (u1 - .5) * .55) / cols), y = lerp(G.y0 + 10, G.y1 - 10, (r + .5 + (u2 - .5) * .55) / rows);
      FIELD.push({ x, y, x0: x + (u3 - .5) * 30, y0: curveY(x) + (u2 - .5) * 10, d: (x - G.x0) / (G.x1 - G.x0), s: u3 });
    });
  }

  // ------------------------------------------------------------------------------------------------ camera (keys on words)
  const KEYS = [
    [a.T0 + .5, cam3()],
    [a.letter - .2, cam3({ z: 14, x: 3 })],
    [a.only + .8, aim(F0, 962, 600, .755)],                              // a long, slow pull back: the rows become a page
    [a.made + .6, aim(F0, 1350, 2250, 1.36, 860, 560)],                  // the descent ends while the push goes on (no key where all stops)
    [a.medicine - .4, aim(F0, 1300, 2245, 1.52, 860, 560)],               // then one long pull back: the vial alone, then you, then the average
    [a.average + .25, aim(F0, 1080, 2160, .62, 960, 560)],
    [a.isThat + .2, aim(F0, 1092, 2160, .615, 960, 560)],
    [a.moderna + .2, aim(F0, 1450, 2120, .62, 960, 560)],
    [a.andVaccine - .1, aim(F0, 1480, 2120, .64, 960, 560)],
    [a.helps + .3, aim(F0, 1950, 2100, .555, 960, 560)],
    [a.lucky + .4, aim(F0, 2040, 2090, .565, 960, 560)],
    [a.ifComp + .4, aim(F0, 1960, 2085, .58, 960, 560)],
    [a.cancer3 + .2, aim(F0, 1700, 2140, .54, 960, 560)],
    [a.whatElse + .2, aim(F0, 1650, 2100, .54, 960, 560)],
  ];
  const camRaw = (t) => U.camGlide(t, KEYS);

  // ------------------------------------------------------------------------------------------------ draw
  function draw(ctx, t, c) {
    // a deeper night round the page once you can see past it (the page is the lit sheet)
    // ---- the page (3.01–3.02)
    const dimRows = .55 * smooth(span(t, a.only - .1, a.only + .8)) + .3 * smooth(span(t, a.carries - .2, a.carries + .8));   // the text steps back behind the marks, then further while we leave the page
    card(ctx, c, F0, () => {
      // the sheet: lit like the plate, a fine rim (only visible once the camera has pulled back), a soft shadow under it
      ctx.save(); ctx.filter = 'blur(40px)'; ctx.fillStyle = rgba(P.night0, .7); ctx.fillRect(PAGE.x0 + 40, PAGE.y0 + 60, PAGE.x1 - PAGE.x0, PAGE.y1 - PAGE.y0); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(PAGE.x0, PAGE.y0, PAGE.x1 - PAGE.x0, PAGE.y1 - PAGE.y0); ctx.clip();
      ctx.fillStyle = P.night0; ctx.fillRect(PAGE.x0, PAGE.y0, PAGE.x1 - PAGE.x0, PAGE.y1 - PAGE.y0);
      ctx.fillStyle = E.rad(ctx, 960, 540 + 6 * E.drift(t, 1, 3), 1250, [[0, P.ind1], [.45, P.ind0], [1, P.night0]]); ctx.fillRect(PAGE.x0, PAGE.y0, PAGE.x1 - PAGE.x0, PAGE.y1 - PAGE.y0);
      ctx.restore();
      ctx.strokeStyle = rgba(P.blue0, .95); ctx.lineWidth = 3; ctx.strokeRect(PAGE.x0, PAGE.y0, PAGE.x1 - PAGE.x0, PAGE.y1 - PAGE.y0);
      ctx.strokeStyle = rgba(P.halo1, .35); ctx.lineWidth = 1.2; ctx.strokeRect(PAGE.x0 + 3, PAGE.y0 + 3, PAGE.x1 - PAGE.x0 - 6, PAGE.y1 - PAGE.y0 - 6);
      // the rows (exactly the plate's numbers), dimmed once "only this one" picks out the marks
      ctx.save(); ctx.beginPath(); ctx.rect(PAGE.x0, PAGE.y0, PAGE.x1 - PAGE.x0, PAGE.y1 - PAGE.y0); ctx.clip();
      F.genomeRows(ctx, CELL.x, CELL.y, CELL.w, t, { rows: CELL.rows, pitch: CELL.pitch, size: CELL.size, shift: shift(t), seed: CELL.seed, cursor: CELL.cursor, hi: 1, a: 1 - dimRows });
      // the cursor grows into a scan line over all nine rows, with the machine's small ring on the middle row
      const sc = expoOut(span(t, a.reads - .15, a.reads + .55));
      if (sc > 0) {
        const yTop = lerp(CELL.y - CELL.size * 1.05, rowY(-4) - CELL.size * 1.1, sc), yBot = lerp(CELL.y + CELL.size * .35, rowY(4) + CELL.size * .45, sc);
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.lin(ctx, CELL.cursor - 46, 0, CELL.cursor + 4, 0, [[0, rgba(P.blue0, 0)], [1, rgba(P.blue0, .42)]]); ctx.fillRect(CELL.cursor - 46, yTop, 50, yBot - yTop); ctx.restore();
        ctx.fillStyle = F.COOL_HI; ctx.fillRect(CELL.cursor, yTop, 3, yBot - yTop);
        F.reticle(ctx, CELL.cursor + 1.5, CELL.y - CELL.size * .35, lerp(8, 34, sc), t, { a: sc * (1 - dimRows * .6), rot: .4 });
      }
      // the marks: a gold tile grows behind the letter, then it lifts off the page (drawn later, in the tile pass)
      ctx.restore();
    });
    // ---- the floor, the people behind, the cone, you, the vial (3.03–3.08)
    const coneOn = expoOut(span(t, a.list - .1, a.vaccine + .4));
    const narrow = sineIO(span(t, a.nobody - .3, a.nobody + .7)) * (1 - sineIO(span(t, a.medicine - .1, a.readsYou + .5)));
    const wide = sineIO(span(t, a.medicine - .1, a.readsYou + .5));
    const graze = sineIO(span(t, a.readsYou - .2, a.average + .3)) * (1 - sineIO(span(t, a.artificial, a.artificial + 1.4)));   // the average is only there while it is said
    card(ctx, c, ZC + 900, () => {   // the far wall: a cool wash rises behind the row of people ("not the average")
      if (graze <= 0) return;
      const [gx, gy] = PEOPLE.wall;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = E.rad(ctx, gx, gy, PEOPLE.wr, [[0, rgba(P.blue1, .5 * graze)], [.55, rgba(P.blue0, .22 * graze)], [1, rgba(P.blue0, 0)]]);
      ctx.fillRect(gx - PEOPLE.wr, gy - PEOPLE.wr, PEOPLE.wr * 2, PEOPLE.wr * 2); ctx.restore();
    });
    card(ctx, c, ZC, () => {
      if (graze <= 0) return;
      ctx.save(); ctx.globalAlpha = graze;
      for (const p of PEOPLE.list) {
        const rim = mixHex(P.night1, F.COOL, .25 + .75 * graze);
        E.person(ctx, p.x, p.y, p.h, { dir: p.dir, light: -1, rim, look: .05, long: true });
      }
      ctx.fillStyle = E.lin(ctx, 0, PEOPLE.floor - 4, 0, PEOPLE.floor + 300, [[0, rgba(P.night0, .0)], [.2, rgba(P.night0, .85)], [1, P.night0]]); ctx.fillRect(PEOPLE.x0, PEOPLE.floor + 2, PEOPLE.x1 - PEOPLE.x0, 600);
      ctx.restore();
    });
    card(ctx, c, F0, () => {
      // floor: dark, its edge catches the warm light under the cone
      ctx.fillStyle = E.lin(ctx, 0, FLOOR, 0, FLOOR + 500, [[0, P.ind2], [.08, P.night1], [1, P.night0]]); ctx.fillRect(-2500, FLOOR, 9000, 1400);
      const cx = lerp(VIAL.x, (VIAL.x + DU.x) / 2 + 20, wide), hw1 = lerp(lerp(230, 150, narrow), 420, wide), hw0 = lerp(lerp(46, 30, narrow), 90, wide);
      ctx.fillStyle = E.lin(ctx, cx - 1400, 0, cx + 1400, 0, [[0, rgba(P.blue0, .5)], [.38, rgba(P.blue0, .8)], [.5, rgba(P.halo1, .25 + .7 * coneOn)], [.62, rgba(P.blue0, .8)], [1, rgba(P.blue0, .5)]]); ctx.fillRect(-2500, FLOOR - 1, 9000, 3);
      if (coneOn > 0) {
        const top = FLOOR - 700, cp = new Path2D(); cp.moveTo(cx - hw0, top); cp.lineTo(cx + hw0, top); cp.lineTo(cx + hw1, FLOOR + 6); cp.lineTo(cx - hw1, FLOOR + 6); cp.closePath();
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(18px)';
        ctx.fillStyle = E.lin(ctx, 0, top, 0, FLOOR, [[0, rgba(P.halo1, 0)], [.35, rgba(P.halo1, .08 * coneOn)], [1, rgba(P.halo0, .3 * coneOn)]]); ctx.fill(cp); ctx.restore();
        E.dust(ctx, 3031, 600, cx, FLOOR - 330, hw1 * .55, 300, t, .5 * coneOn, P.halo2);
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(cx, FLOOR + 6); ctx.scale(1, .12);
        ctx.fillStyle = E.rad(ctx, 0, 0, hw1 * 1.6, [[0, rgba(P.halo1, .6 * coneOn)], [.5, rgba(P.halo1, .16 * coneOn)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, hw1 * 1.6, 0, 6.29); ctx.fill(); ctx.restore();
      }
      // you: in the warm cone, looking at the vial (the yellow coat is the only yellow in the film)
      const look = .15 + .25 * sineIO(span(t, a.readsYou - .3, a.readsYou + .8)) - .1 * sineIO(span(t, a.whatElse, a.whatElse + 1.2));
      E.castShadow(ctx, DU.x, FLOOR + 2, 40, 200, Math.PI - .25, .35 * (.4 + .6 * wide));
      E.du(ctx, DU.x, FLOOR + 1, DU.h, { dir: 1, light: 1, look, armR: [.32, .18], armL: [-.12, -.05], rim: mixHex(P.coat, P.core1, .55 + .3 * wide) });
      // the vial fills with the grains; it pulses when the field flows back into it (3.08)
      const fill = .86 * smooth(span(t, a.list + .2, a.made + .5));
      const back = FIELD_BACK(t);
      E.castShadow(ctx, VIAL.x + 30, FLOOR + 2, 60, 150 + 50 * narrow, .15, .35 * coneOn);
      F.vial(ctx, VIAL.x, FLOOR, VIAL.h, t, { fill: Math.max(.02, fill), glow: .4 + .8 * coneOn + .9 * back });
      if (back > 0) E.halo(ctx, VIAL.x, FLOOR - VIAL.h * .35, VIAL.h * 1.3, .35 * back, P.halo1, P.core0);
    });
    // ---- the gold tiles (page → list → grains), the number block of 3.02
    card(ctx, c, F0, () => {
      for (let j = 0; j < MARKS.length; j++) {
        const m = MARKS[j], on = span(t, m.tOn, m.tOn + .3); if (on <= 0) continue;
        const lift = span(t, m.tLift, m.tLift + m.dur), fall = span(t, m.tFall, m.tFall + .25);
        if (fall >= 1) continue;
        const p0 = [lx(m.col, t), rowY(m.row)], e = 1 - Math.pow(1 - lift, 3);
        const p = lift > 0 ? U.arcPt(p0, m.slot, e, 160 + 3 * j) : p0;
        const size = lerp(CELL.size, LIST.size, e) * expoOut(on) * (1 - expoIn(fall) * .9);
        if (lift <= 0) {   // on the page: the tile grows from the letter's centre
          U.tile(ctx, p[0], p[1], m.ch, CELL.size * (.4 + .6 * expoOut(on)), { glow: on });
        } else U.tile(ctx, p[0], p[1], m.ch, size, { glow: 1 });
      }
      // grains: from each tile into the neck of the vial (gravity, pulled into the funnel), gold specks
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (const g of GR) {
        const m = MARKS[g.j], u = (t - m.tFall - .08 - g.d) / 1.05; if (u <= 0 || u >= 1) continue;
        const x0 = m.slot[0] + g.dx, y0 = m.slot[1] + g.dy, k = u * u;
        const x = lerp(x0, NECK[0] + (g.s - .5) * 20, smooth(u)), y = lerp(y0, NECK[1], k);
        ctx.fillStyle = g.s > .5 ? P.core1 : P.halo0; ctx.globalAlpha = .9; ctx.fillRect(x - 1.6, y - 1.6, 3.2, 3.2 * (1 + 2.2 * u));
      }
      ctx.restore();
      const uN = span(t, a.carries + .15, a.carries + 1.15) * (1 - span(t, a.from - .2, a.from + .25));
      U.numBlock(ctx, { x: 150, y: 1268, num: 'up to 34', label: 'marks only in this cancer', src: 'Moderna 10-K · 2025', u: uN, size: 162, labelSize: 46, srcSize: 30, gap: 70 });
    });
    // ---- 3.05–3.08: the envelope, the ring, the stamp field, the survival line, the field
    card(ctx, c, F0, () => {
      // the slip peels off the vial's label and flies to its place, growing, then folds shut (envelope)
      const fly = span(t, a.isThat - .1, a.artificial + 1.15), fold = sineIO(span(t, a.artificial + 1.0, a.moderna + .4)), flap = expoOut(span(t, a.artificial + .7, a.artificial + 1.3));
      if (fly > 0) {
        const e = sineIO(fly), p = U.arcPt([LABEL.x, LABEL.y], [ENV.x, ENV.y], e, 260);
        const w = lerp(LABEL.w, ENV.w, e), h = lerp(LABEL.h, ENV.h, e);
        U.envelope(ctx, p[0], p[1], w, h, t, {
          fold: fly < 1 ? 0 : fold, flap: fly < 1 ? 0 : flap, seal: span(t, a.secret - .15, a.secret + .45), label: 'ALGORITHM', labelU: span(t, a.moderna - .4, a.moderna + .5),
          stamp: span(t, a.approved - .2, a.approved + .9), glow: .8,
        });
      }
      // 3.05 · “MACHINE LEARNING” · MODERNA above the envelope
      const uQ = span(t, a.machine - .1, a.machine + .9) * (1 - span(t, a.andVaccine - .1, a.andVaccine + .35));
      if (uQ > 0) {
        F.maskLine(ctx, [['“machine learning”', 0]], ENV.x - ENV.w / 2 - 20, ENV.y - ENV.h / 2 - 150, 120, uQ);
        U.capsLine(ctx, 'Moderna', ENV.x - ENV.w / 2 - 10, ENV.y - ENV.h / 2 - 82, 34, span(t, a.machine + .3, a.machine + 1.2) * (1 - span(t, a.andVaccine - .1, a.andVaccine + .3)), { col: P.halo2 });
      }
      // the machine's ring comes down, circles the envelope once, finds no way in, rises again
      const rIn = span(t, a.check - .9, a.check - .2), rOrb = span(t, a.check - .25, a.check + 1.5), rOut = span(t, a.check + 1.4, a.check + 2.2);
      if (rIn > 0 && rOut < 1) {
        const ang = -Math.PI / 2 + sineIO(rOrb) * Math.PI * 2.1, ex = ENV.w * .66, ey = ENV.h * .88;
        let x = ENV.x + Math.cos(ang) * ex, y = ENV.y + Math.sin(ang) * ey;
        const nudge = Math.sin(rOrb * Math.PI * 4) * 14 * (rOrb > 0 && rOrb < 1 ? 1 : 0);   // it presses against the edge, twice
        x -= Math.cos(ang) * Math.max(0, nudge); y -= Math.sin(ang) * Math.max(0, nudge);
        if (rIn < 1) { const s = sineIO(rIn); x = lerp(ENV.x + 120, x, s); y = lerp(ENV.y - 900, y, s); }
        if (rOut > 0) { const s = expoIn(rOut); y -= s * 900; x += s * 200; }
        F.reticle(ctx, x, y, 70, t, { rot: .2, lock: .15 * Math.max(0, nudge) / 14 });
      }
      // 3.06 · the gold line from the vial along the floor into the graph: solid for two years, then dashed (not known yet)
      const uT = span(t, a.andVaccine + .4, a.helps + .3), uC = span(t, a.helps + .1, a.known + .1), brk = span(t, a.lucky - .4, a.lucky + .9);
      if (uT > 0 && brk < 1) {
        F.trailSpan(ctx, THREAD, 0, sineIO(uT), { w: 2.2, spark: uT < 1, a: 1 - brk });
        if (uC > 0) {
          const n = Math.floor(sineIO(uC) * (CURVE.length - 1));
          const solid = CURVE.slice(0, Math.min(n, iX2) + 1);
          // the people still alive: a gold area under the line (solid part strong, the dashed part only a hint)
          const area = (pts, al) => { if (pts.length < 2) return; const ap = new Path2D(); ap.moveTo(pts[0][0], G.y1); pts.forEach((q) => ap.lineTo(q[0], q[1])); ap.lineTo(pts[pts.length - 1][0], G.y1); ap.closePath();
            ctx.fillStyle = E.lin(ctx, 0, G.y0, 0, G.y1, [[0, rgba(P.halo1, .3 * al)], [1, rgba(P.halo0, .04 * al)]]); ctx.fill(ap); };
          area(solid, 1 - brk); if (n > iX2) area(CURVE.slice(iX2, n + 1), .35 * (1 - brk));
          if (solid.length > 1) F.trailSpan(ctx, solid, 0, 1, { w: 3.2, spark: n < iX2, a: 1 - brk });
          if (n > iX2) {
            ctx.save(); ctx.setLineDash([10, 16]); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(P.halo0, .9 * (1 - brk)); ctx.lineWidth = 4; ctx.beginPath();
            for (let i = iX2; i <= n; i++) i === iX2 ? ctx.moveTo(CURVE[i][0], CURVE[i][1]) : ctx.lineTo(CURVE[i][0], CURVE[i][1]); ctx.stroke(); ctx.restore();
          }
          // 2 years: a fine tick on the base where the line turns dashed
          const tk = span(t, a.longer - .3, a.longer + .5) * (1 - brk);
          if (tk > 0) {
            ctx.strokeStyle = rgba(P.blue0, .95); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(G.x0 - 30, G.y1 + 20); ctx.lineTo(lerp(G.x0 - 30, G.x1 + 30, expoOut(tk)), G.y1 + 20); ctx.stroke();
            ctx.strokeStyle = rgba(P.halo1, .9); ctx.beginPath(); ctx.moveTo(X2, G.y1 + 6); ctx.lineTo(X2, G.y1 + 34); ctx.stroke();
            U.capsLine(ctx, '2 years', X2, G.y1 + 88, 40, tk, { align: 'center', col: P.halo2 });
          }
        }
      }
      const uL = span(t, a.longer - .2, a.longer + .9) * (1 - span(t, a.lucky - .5, a.lucky));
      U.numBlock(ctx, { x: G.x0, y: 1690, label: ['overall survival', 'data immature'], src: 'ESMO 2026', u: uL, labelSize: 60, srcSize: 40, gap: -40 });
      // 3.07 · the points: from the breaking line down into a calm field, left → right; then they flow back into the vial (3.08)
      const back = FIELD_BACK(t);
      if (brk > 0) {
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        const glow = span(t, a.thousand - .3, a.thousand + .9);
        for (const p of FIELD) {
          const u = span(t, a.lucky - .35 + p.d * 1.7 + p.s * .25, a.lucky + .55 + p.d * 1.7 + p.s * .25); if (u <= 0) continue;
          const e = 1 - Math.pow(1 - u, 3);
          let x = lerp(p.x0, p.x, e), y = lerp(p.y0, p.y, e) + Math.sin(t * .8 + p.s * 9) * 1.5;
          const bk = span(back * 1.6 - (1 - p.d) * .55 - p.s * .08, 0, 1);
          if (bk >= 1) continue;
          if (bk > 0) { const q = U.arcPt([x, y], NECK, sineIO(bk), 180 + 120 * p.s); x = q[0]; y = q[1]; }
          const pulse = Math.max(0, 1 - Math.abs(glow * 1.4 - p.d - .2) * 4);
          ctx.fillStyle = pulse > .2 ? P.core0 : (p.s > .35 ? P.core1 : P.halo0); ctx.globalAlpha = .55 + .45 * Math.max(pulse, 1 - u);
          const sz = 4.4 + 2.4 * pulse; ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
        }
        ctx.restore();
        if (back < .6) E.halo(ctx, (G.x0 + G.x1) / 2, (G.y0 + G.y1) / 2, 700, .12 * span(t, a.lucky, a.thousand) * (1 - back * 1.6), P.halo1, P.halo0);
      }
      const uF = span(t, a.thousand - .15, a.thousand + 1.2) * (1 - span(t, a.ifComp - .1, a.ifComp + .4));
      U.numBlock(ctx, { x: G.x0, y: 1660, num: '1,137', label: 'patients in the trial', src: 'INTERPATH-001 · ESMO 2026', u: uF, size: 170, labelSize: 52, srcSize: 36, gap: 80 });
    });
  }
  // 0..1: the field flowing back into the vial (3.08)
  const FIELD_BACK = (t) => span(t, a.ifComp - .1, a.cancer3 + .2);

  // the row of people: placed once from the 3.04 camera so they stand behind you, on their own floor line
  const PEOPLE = (() => {
    const c = camAt(a.average + .25, KEYS), floorS = project(c, F0, 0, FLOOR)[1] - 46, m = E.cardM(c, ZC), list = [];
    const hS = 268;                                                     // screen px at the 3.04 camera (you: ~372)
    for (let i = 0; i < 11; i++) {
      const sx = 140 + i * 165 + (i % 2) * 12, [x, y] = U.invCard(c, ZC, sx, floorS);
      list.push({ x, y, h: hS / m.k * (1 + .04 * Math.sin(i * 2.3)), dir: 1 });
    }
    const [wx, wy] = U.invCard(c, ZC + 900, 960, floorS - 200);
    const fl = list[0].y;
    return { list, floor: fl, x0: list[0].x - 600, x1: list[list.length - 1].x + 600, wall: [wx, wy], wr: 1500 };
  })();

  return { draw, camRaw, ENV, KEYS, FLOOR };
}
