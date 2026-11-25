// c06 · B2 · THE CHAOS · 'Ask the people who sell them' → 'Some years ago' (the W cut to the resort, c07).
// One continuous take on THE GROUND LINE, no cut inside: the bunker of plateBunker stays under the line the whole time (it is what the
// chapter asks about), everything "out here" rises out of the line above it and sinks back into it. Carriers: the shelves → the time axis
// → the time head (★) → the list (row 3) → the glass room → the struck words → the three signs → the middle sign widens into the
// departure board → the plane lifts off → the list → the clock band → the dark rooms → fuel, filters, people → the city goes dark window
// by window; its last lit window is where the resort window of c07 lies (the W cut rhymes on it).
//
// | ID    | anchor (phrase)                  | zeigt wörtlich                                   | picture                                                                         | layer |
// |-------|----------------------------------|--------------------------------------------------|---------------------------------------------------------------------------------|-------|
// | 3.08  | Ask the people who sell them     | ask the sellers                                  | out of plateBunker: a seller rises out of the line beside the hatch, a catalogue | MIX   |
// | 3.09  | Most shelters are stocked        | stocked for weeks or months                      | the shelves fill; the gold supply band grows on the axis: DAYS · WEEKS · MONTHS | EXPL  |
// | 3.10  | The biggest ones promise         | the biggest promise a few years                  | the band stretches to YEARS: A FEW YEARS (makers' claims in the source line)     | EXPL  |
// | 3.11  | Sales promises                   | sales promises, all of them                      | the claimed part of the band turns hollow (dashed): SALES PROMISES               | EXPL  |
// | 3.12★ | But every bunker is a clock      | every bunker is a clock                          | the time head runs along the axis, the band is used up, the shelves empty: EVERY BUNKER IS A CLOCK | EXPL |
// | 3.13  | So what are they expecting       | what do they expect to wait out?                 | THE LIST rises out of the line: row 3 THE CHAOS lights, a ?                       | EXPL  |
// | 3.14  | Inside the A.I. industry         | insiders expect a major AI incident              | the view lifts to the sky; the glass room rises: A MAJOR AI INCIDENT (+ Axios)    | MIX   |
// | 3.15  | Not killer robots                | not killer robots                                | the words KILLER ROBOTS, struck through (no robot drawn)                          | EXPL  |
// | 3.16  | More like a cyberattack          | banks, the internet, maybe the power go down     | three signs rise: BANKS · INTERNET · POWER; they go dark on the words             | MIX   |
// | 3.17  | And you've already seen          | you've seen how fragile that is                  | the middle sign widens into a departure board; an airport window; you walk in     | MIX   |
// | 3.18  | In November, one faulty router   | one faulty router stopped takeoffs               | a router rises, blinks (cream); the rows flip to GROUND STOP (+ 13 NOV 2026, FAA) | EXPL  |
// | 3.19  | For hours                        | for hours                                        | a bar grows along the board: MORE THAN 4 HOURS (KB2)                              | EXPL  |
// | 3.20  | No A.I. involved                 | no AI involved                                   | under the router: NO AI INVOLVED                                                  | EXPL  |
// | 3.21  | Then the planes flew again       | then the planes flew again                       | the rows flip back; a plane lifts off past the window: IT PASSED                  | EXPL  |
// | 3.22  | The chaos stays on the list      | the chaos stays on the list                      | the board sinks, the list rises: row 3, STAYS                                     | EXPL  |
// | 3.23  | A bunker can carry you           | a bunker can carry you through it                | the view back down: the band refills; THE CHAOS is a short band inside it         | EXPL  |
// | 3.24  | For a while                      | for a while                                      | row 3: the half strike stops mid-row: STAYS · FOR A WHILE                         | EXPL  |
// | 3.25  | But it can't run itself          | it can't run itself                              | the list sinks; the rooms go dark                                                 | EXPL  |
// | 3.26  | It needs fuel                    | it needs fuel                                    | a generator lights in the room: FUEL                                              | EXPL  |
// | 3.27  | Filters                          | filters                                          | an air filter turns in the shaft: FILTERS                                         | EXPL  |
// | 3.28  | And people                       | and people                                       | three workers climb down and walk into the room: PEOPLE                           | MIX   |
// | 3.29  | And when the world outside       | who do they answer to?                           | a city rises over the line, its windows go out one by one; the workers turn and look up; row 4 of the list (a strip) flickers: WHO DO THEY ANSWER TO? | SCENE |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f72_kit.mjs';
import * as S from '../lib/f72_world.mjs';
import * as X from '../lib/f72_stage.mjs';
import * as B from '../lib/b2_parts.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, halo } = E;
const { GOLD, COOL, CREAM, SOURCES: SRC } = F;
const PR = F.PRINT72, LY = X.LINE_Y, Q = S.PBUNK, AX = Q.axis;
const FAA_DATE = SRC.faa.split(' · ')[0];   // '13 NOV 2026'
const MAKERS = `${SRC.makersHead} · ${SRC.makers.map((m, i) => (i === 2 ? SRC.kb.condo : m).join(': ')).join(' · ')}`;   // KB6: SRC.kb.condo

export default async (T, R) => {
  const G = (p, n = 0, after = R.a - 1) => T.G(p, n, after);
  const A = {
    ask: R.a, sell: G('who sell them'), most: G('Most shelters'), weeks: G('weeks'), months: G('months'), biggest: G('The biggest ones'), years: G('a few years'),
    sales: G('Sales promises'), clock: G('But every bunker'), clockW: G('a clock'), expect: G('So what are they expecting'), inside: G('Inside the'),
    incident: G('incident'), robots: G('Not killer robots'), cyber: G('More like a cyberattack'), banks: G('banks'), internet: G('the internet'), power: G('the power'),
    fragile: G("And you've already seen"), nov: G('In November'), router: G('faulty router'), takeoffs: G('stopped takeoffs'), hours: G('For hours'),
    flew: G('Then the planes flew'), stays: G('The chaos stays'), carry: G('A bunker can carry'), while: G('For a while'), run: G("But it can't run"),
    fuel: G('It needs fuel'), people: G('And people'), world: G('And when the world outside'), answer: G('who do those people'), end: R.b,
  };
  A.noai = G('No A.I', 0, A.hours); A.filters = G('Filters', 0, A.fuel);
  const t0 = R.a + S.SEAM_HALF;

  // ---------------------------------------------------------------- the view: zoom out from the plate, rest; lift to the sky (3.14–3.22), back down, push into the bunker
  const VD = [
    [t0, { x: Q.view.x, y: Q.view.y, s: Q.view.s * (1 + S.CREEP * .5 * 2) }], [A.most + 1.6, { x: 1040, y: 730, s: .86 }], [A.clock - .2, { x: 1040, y: 730, s: .87 }],
    [A.clockW + 1.4, { x: 1040, y: 726, s: .9 }], [A.inside - .1, { x: 1040, y: 722, s: .89 }], [A.inside + 2.3, { x: 1040, y: 560, s: .88 }],
    [A.stays + .3, { x: 1040, y: 556, s: .89 }], [A.carry + .7, { x: 1040, y: 730, s: .87 }], [A.run + .3, { x: 1042, y: 732, s: .87 }],
    [A.fuel + .4, { x: 1070, y: 770, s: .98 }], [A.world + .4, { x: 1070, y: 771, s: 1.0 }], [A.end, B.C06_END.view],
  ];
  // into the W cut with speed: a slow push that lands exactly on C06_END.view at the cut (c07 starts with the same push)
  const arrive = (t) => 1 - B.W_PUSH * (A.end - t) * sineIO(span(t, A.end - 1.6, A.end));
  const view = (t) => { const v = X.viewPath(t, VD), b = S.breathe(t); return { x: v.x + b.dx, y: v.y + b.dy, s: v.s * arrive(t) }; };
  const pool = (t) => B.seq(t, [[t0, [1040, 700, .8]], [A.most + 1.6, [1040, 760, .8]], [A.expect, [1040, 520, .85]], [A.inside + 2, [1040, 420, .9]], [A.stays, [1040, 440, .9]], [A.carry + .6, [1040, 820, .8]], [A.world, [1060, 760, .8]], [A.world + 1.5, [1150, 450, .85]], [A.end, [1150, 450, .85]]]);

  // ---------------------------------------------------------------- the clock
  const solid = (t) => lerp(.5 * sineIO(span(t, A.weeks - .3, A.weeks + .6)), 2 / 3 + .04, sineIO(span(t, A.months - .2, A.months + .6)));
  const full = (t) => Math.max(solid(t), lerp(solid(t), .97, sineIO(span(t, A.years - .3, A.years + .9))));
  const head = (t) => lerp(0, 2 / 3 + .04, quartIO(span(t, A.clockW - .25, A.clockW + 1.9))) * (1 - quartIO(span(t, A.carry - .5, A.carry + .7)));
  const headOn = (t) => span(t, A.clock - .2, A.clock + .3) * (1 - span(t, A.carry + .5, A.carry + 1.0));
  const stock = (t) => span(t, A.most + .1, A.months + .5);   // the shelves fill left → right; the time head empties them as it passes
  function shelfBoxes(ctx, t) {
    const sw = 64, x0 = Q.room.x0 + sw + 30, x1 = Q.room.x1 - 20, n = Math.floor((x1 - x0) / 26), ry0 = LY + Q.depth, xh = AX.x + AX.w * head(t), fu = stock(t) * n;
    for (const [j, yy] of [ry0 + Q.room.h * .38, ry0 + Q.room.h * .7].entries()) for (let i = 0; i < n; i++) {
      const bx = x0 + 3 + i * 26, k = clamp(fu - i - j * .3) * clamp((bx + 10 - xh) / 18 + 1); if (k <= 0) continue;
      const bh = (18 + ((i * 7 + j * 3) % 5) * 3) * expoOut(k); ctx.fillStyle = mixHex(F.PAPER.shade, GOLD.mid, ((i + j) % 3) * .2); ctx.fillRect(bx, yy - bh, 20, bh); }
  }
  const light = (t) => B.seq(t, [[t0, [.55]], [A.run - .1, [.55]], [A.run + 1.1, [.06]], [A.fuel - .1, [.06]], [A.fuel + .6, [.3]], [A.people, [.3]], [A.people + 1, [.42]], [A.end, [.42]]])[0];
  const clockA = (t) => 1 - .65 * span(t, A.run, A.run + 1.2);
  const SCALE_T = [A.most + .3, A.weeks - .1, A.months - .1, A.years - .05];

  // ---------------------------------------------------------------- the list (screen space): 3.13 and 3.22–3.25
  const rowsAt = (t) => [
    { num: 1, strike: 1, kind: 'thin', verdict: SRC.verdicts[0], vu: 1 },
    { num: 1, strike: 1, kind: 'bold', verdict: SRC.verdicts[1], vu: 1 },
    (() => { const stay = span(t, A.stays + .7, A.stays + 1.3), out1 = span(t, A.while - .25, A.while), full2 = span(t, A.while + .05, A.while + .7);
      return { num: 1, lit: span(t, A.expect + .4, A.expect + 1.0), q: span(t, A.expect + 1.0, A.expect + 1.6) * (1 - span(t, A.stays + .3, A.stays + .7)),
        strike: span(t, A.while - .1, A.while + .6), kind: 'half', verdict: full2 > 0 ? SRC.verdicts[2] : SRC.verdicts[2].split(' · ')[0], vu: full2 > 0 ? full2 : stay * (1 - out1) }; })(),
    { num: 1, redact: 1 },
  ];
  const listU = (t) => B.riseSink(span(t, A.expect + .05, A.expect + 1.0), span(t, A.inside - .4, A.inside + .3)) + B.riseSink(span(t, A.stays - .05, A.stays + .8), span(t, A.run - .2, A.run + .5));
  function drawList(ctx, t, v) {
    const u = listU(t); if (u <= 0) return;
    const ly = X.toScreen(v, 0, LY)[1], sc = .55, h = (F.LIST.head + F.LIST.row * 4 + 36) * sc, cy = Math.min(250, ly - h / 2 - 22);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    B.riseFrom(ctx, ly, ly - cy + h / 2, u, () => F.list(ctx, t, 960, cy, { s: sc, rows: rowsAt(t) }));
    ctx.restore();
  }

  // ---------------------------------------------------------------- out here: the things that rise out of the line (sheet units)
  const sellerU = (t) => B.riseSink(span(t, t0 + .1, t0 + 1.1), span(t, A.clock - .4, A.clock + .3));
  const glassU = (t) => B.riseSink(span(t, A.inside + .3, A.inside + 1.4), span(t, A.robots - .3, A.robots + .4));
  const signsU = (i) => (t) => B.riseSink(span(t, A.cyber + .2 + i * .12, A.cyber + 1.1 + i * .12), i === 1 ? 0 : span(t, A.fragile - .3 + (i ? .1 : 0), A.fragile + .3 + (i ? .1 : 0)));
  const darkT = [A.banks, A.internet, A.power];
  const boardM = (t) => sineIO(span(t, A.fragile - .1, A.fragile + 1.3));            // the middle sign → the departure board
  const boardOut = (t) => span(t, A.stays - .8, A.stays - .1);
  const winU = (t) => span(t, A.fragile + .3, A.fragile + 1.6) * (1 - span(t, A.stays - .8, A.stays - .1));
  const youX = (t) => lerp(470, 640, sineIO(span(t, A.fragile + .2, A.fragile + 2.2)));
  const flips = (t) => [0, 1, 2, 3, 4].map((i) => span(t, A.takeoffs - .5 + i * .14, A.takeoffs - .1 + i * .14) - span(t, A.flew + .1 + i * .12, A.flew + .5 + i * .12));
  const routerU = (t) => B.riseSink(span(t, A.router - .5, A.router + .3), boardOut(t));
  const planeU = (t) => span(t, A.flew + .5, A.flew + 3.4);
  const BRD0 = { x: 1040 - 125, y: 600 - 120 - 116, w: 250, h: 116 }, BRD1 = { x: 770, y: 236, w: 540, h: 250 };
  const cityU = (t) => span(t, A.world - .2, A.world + 1.1);
  const offT = (i, n, t) => span(t, A.world + 1.2 + (i / n) * (A.end - .9 - A.world - 1.2), A.world + 1.35 + (i / n) * (A.end - .9 - A.world - 1.2));
  const WORK = [880, 1030, 1180];

  function stage(ctx, t, v) {
    const [lx, ly, pl] = pool(t);
    X.ground(ctx, t, v, { lx, ly, pool: pl, cut: { ...Q.cut, u: 1 } });
    X.inView(ctx, v, (s) => {
      // the city (3.29) behind everything above the line
      if (cityU(t) > 0) B.city(ctx, t, B.C06_END.cityX0, LY, cityU(t), (i, n) => offT(i, n, t), { s });
      // the airport window (behind the board)
      const wu = winU(t);
      if (wu > 0) { const x0 = 560, x1 = 1520, y0 = 150, col = rgba(CREAM, .28);
        X.drawPath(ctx, [[x0, LY], [x0, y0], [x1, y0], [x1, LY]], sineIO(wu), { col, w: 2 / s });
        for (let i = 1; i < 6; i++) { const xx = lerp(x0, x1, i / 6); X.drawPath(ctx, [[xx, y0], [xx, LY]], span(wu, .2 + i * .06, .7 + i * .06), { col: rgba(CREAM, .14), w: 1.4 / s }); }
        ctx.fillStyle = rgba(COOL.body, .03 * wu); ctx.fillRect(x0, y0, x1 - x0, LY - y0); }
      // the hatch, the bunker, the clock
      F.hatch(ctx, t, Q.x, LY, 150, { tilt: .075, open: 0, glow: .3, s });
      const ppl = [];
      for (let i = 0; i < 3; i++) { const w0 = A.people - .3 + i * .35, d = span(t, w0, w0 + .7), wk = span(t, w0 + .7, w0 + 2.0); if (d <= 0) continue;
        const turn = span(t, A.world + .3 + i * .15, A.world + 1.4 + i * .15);
        ppl.push({ d, wk, x: lerp(Q.x, WORK[i], sineIO(wk)), turn, i }); }
      F.bunker(ctx, t, Q.x, LY, { s, depth: Q.depth, room: Q.room, shelves: 0, light: light(t) });
      shelfBoxes(ctx, t);
      // fuel, filters
      const fu = span(t, A.fuel + .1, A.fuel + .6), fi = span(t, A.filters - .1, A.filters + .4);
      if (t > A.run) { B.generator(ctx, t, 1420, Q.room.x1 > 0 ? 750 + Q.room.h : 920, fu, { s }); B.filter(ctx, t, Q.x, 690, fi, { s }); }
      X.label(ctx, SRC.needs[0], 1420, 820, B.lab(t, A.fuel + .1, A.world + .2), { size: 28, gold: .5 });
      X.label(ctx, SRC.needs[1], Q.x - 54, 700, B.lab(t, A.filters - .05, A.world + .2), { size: 28, align: 'right', gold: .5 });
      X.label(ctx, SRC.needs[2], 1030, 800, B.lab(t, A.people + .2, A.world + .2), { size: 28, gold: .5 });
      // the workers: climb down the shaft (clipped to it), walk into the room, turn and look up
      for (const p of ppl) {
        const fy = 750 + Q.room.h - 2;
        if (p.wk <= 0) { ctx.save(); ctx.beginPath(); ctx.rect(Q.x - 32, LY, 64, 400); ctx.clip(); B.worker(ctx, Q.x, lerp(LY + 20, fy, quartIO(p.d)), 100, { pose: 'reach' }); ctx.restore(); }
        else B.turned(ctx, p.x, p.turn * .5, () => B.worker(ctx, p.x, fy, 100, { walk: p.wk < 1 ? t * 5.4 + p.i : undefined, pose: p.turn > .5 ? 'look' : 'stand' }));
      }
      F.supplyClock(ctx, t, AX.x, AX.y, AX.w, { s, u: 1, scale: [], full: 0 });
      const hl = headOn(t) * (1 - span(t, A.expect + .6, A.expect + 1.4));
      if (hl > 0) { const xh = AX.x + AX.w * head(t); X.drawPath(ctx, [[xh, AX.y - 20], [xh, 750 + 6]], hl, { col: rgba(CREAM, .75), w: 2 / s, glow: 8, glowCol: GOLD.line }); }
      ctx.save(); ctx.globalAlpha *= clockA(t);
      B.supplyBand(ctx, AX.x, AX.y, AX.w, { s, solid: solid(t), full: full(t), hollow: span(t, A.sales - .1, A.sales + .9), head: head(t), headOn: headOn(t) });
      SRC.clockScale.forEach((lb, i) => { const xx = AX.x + AX.w * i / 3, k = span(t, SCALE_T[i], SCALE_T[i] + .6);
        X.drawPath(ctx, [[xx, AX.y - 8], [xx, AX.y + 8]], k, { col: rgba(CREAM, .7), w: 1.6 / s }); X.label(ctx, lb, xx, AX.y + 44, k, { size: 26, col: P.halo2, spacing: .1 }); });
      // A FEW YEARS / SALES PROMISES right of the band's end
      X.label(ctx, B.LOCAL.fewYears, AX.x + AX.w + 24, AX.y - 22, B.lab(t, A.years, A.sales + .1), { size: 28, align: 'left', gold: .7 });
      X.label(ctx, SRC.salesPromises, AX.x + AX.w + 24, AX.y - 22, B.lab(t, A.sales + .15, A.clockW + .3), { size: 28, align: 'left' });
      // the chaos: a short cream band inside the supply band (3.23)
      const cu = span(t, A.carry + .5, A.carry + 1.3) * (1 - span(t, A.run - .2, A.run + .6));
      if (cu > 0) { const x0 = AX.x + AX.w * .02, x1 = AX.x + AX.w * .3, yb = AX.y - 18 - 22;
        X.drawPath(ctx, [[x0, yb - 6], [x1, yb - 6], [x1, yb + 28], [x0, yb + 28], [x0, yb - 6]], sineIO(cu), { col: rgba(CREAM, .95), w: 3 / s });
        X.label(ctx, SRC.list[2], AX.x - 30, AX.y - 22, cu, { size: 28, align: 'right' }); }
      ctx.restore();
      // the seller with a catalogue (3.08)
      const su = sellerU(t);
      if (su > 0) B.riseFrom(ctx, LY, 150, su, () => { halo(ctx, 440, LY - 60, 120, .3, F.LAMP.body, F.LAMP.core);
        F.person(ctx, 420, LY, 120, { pose: 'hold', dir: 1, light: -1, rim: GOLD.line });
        F.paperCard(ctx, t, 438, LY - 84, 30, 40, { u: 1, rot: .18 }); });
      // the glass room (3.14)
      const gu = glassU(t);
      if (gu > 0) { F.glassRoom(ctx, t, 860, LY, 360, 210, { u: gu, s, n: 4 }); }
      X.label(ctx, B.LOCAL.incident, 1040, LY - 252, B.lab(t, A.incident - .5, A.robots + .1), { size: 34, spacing: .12, col: COOL.text });
      // the three signs (3.16) → the middle one becomes the departure board (3.17)
      [700, 1040, 1380].forEach((x, i) => { const u = signsU(i)(t); if (u <= 0 || (i === 1 && boardM(t) > 0)) return; B.sign(ctx, t, x, LY, SRC.down3[i], u, span(t, darkT[i] - .05, darkT[i] + .55), { s }); });
      const bm = boardM(t);
      if (bm > 0) { const r = { x: lerp(BRD0.x, BRD1.x, bm), y: lerp(BRD0.y, BRD1.y, bm), w: lerp(BRD0.w, BRD1.w, bm), h: lerp(BRD0.h, BRD1.h, bm) }, bo = sineIO(boardOut(t));
        B.riseFrom(ctx, LY, LY - BRD1.y + 20, 1 - bo, () => {
          ctx.fillStyle = mixHex(P.night0, F.CONCRETE.shade, .6); ctx.fillRect(1035, r.y + r.h, 10, LY - r.y - r.h);
          if (bm < 1) B.sign(ctx, t, 1040, LY, SRC.down3[1], 1, 1, { s, w: r.w, h: r.h, post: LY - r.y - r.h });
          B.board(ctx, t, r.x, r.y, r.w, r.h, { s, a: span(bm, .5, 1), rows: flips(t), bar: span(t, A.hours - .1, A.hours + 1.0) });
        }); }
      // you at the window, looking up at the board
      if (winU(t) > 0) B.riseFrom(ctx, LY, 130, span(t, A.fragile + .1, A.fragile + .8) * (1 - sineIO(boardOut(t))), () => F.du(ctx, youX(t), LY, 104, { pose: t > A.fragile + 2.2 ? 'look' : undefined, walk: t < A.fragile + 2.2 ? t * 5.4 : undefined, dir: 1, light: -1 }));
      // the router (3.18), NO AI INVOLVED (3.20)
      const ru = routerU(t);
      if (ru > 0) B.router(ctx, t, 1440, LY, ru, { s, blink: t < A.flew ? (Math.sin(t * 9) > .2 ? 1 : 0) : .4 });
      const tg = B.lab(t, A.nov - .1, A.stays - .3);
      if (tg > 0) { ctx.save(); ctx.translate(0, 0); const [sx, sy] = [1440, LY - 130]; X.dateTag(ctx, FAA_DATE, sx, sy, tg); ctx.restore(); }
      X.label(ctx, B.LOCAL.noAI, 1440, LY + 56, B.lab(t, A.noai - .1, A.stays - .3), { size: 28, col: COOL.text });
      // the plane lifts off past the window (3.21)
      const pu = planeU(t);
      if (pu > 0 && pu < 1) { const k = sineIO(pu), x = lerp(1180, 1900, k), y = LY - 6 - Math.pow(k, 1.6) * 430; B.plane(ctx, x, y, 120, .12 + .25 * k, 1 - span(pu, .85, 1)); }
      X.label(ctx, B.LOCAL.passed, 1660, 240, B.lab(t, A.flew + 1.0, A.stays - .2), { size: 30, gold: .3 });
    });
  }

  // ---------------------------------------------------------------- screen-space type
  function screen(ctx, t, v) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    // ★ EVERY BUNKER IS A CLOCK
    const ec = B.lab(t, A.clockW - .2, A.expect - .35, .8, .5);
    if (ec > 0) X.big(ctx, SRC.everyClock, 960, 210, 92, ec, { gold: .25 });
    // KILLER ROBOTS, struck through
    const kr = B.lab(t, A.robots - .1, A.cyber + .6, .6, .5);
    if (kr > 0) { X.big(ctx, B.LOCAL.killer, 960, 230, 96, kr, { gold: 0, glow: false });
      const w = F.measure(B.LOCAL.killer, 96, true) + 40, su = sineIO(span(t, A.robots + .45, A.robots + 1.0)) * (1 - span(t, A.cyber + .1, A.cyber + .6));
      X.drawPath(ctx, [[960 - w / 2, 198], [960 + w / 2, 194]], su, { col: CREAM, w: 7 }); }
    // the question + row 4 of the list (a strip) at the end (3.29)
    const qa = B.lab(t, A.answer - .5, A.end + 5);
    if (qa > 0) { X.label(ctx, SRC.answerTo, 380, 96, qa, { size: 32, spacing: .12 });
      const su = span(t, A.world + .8, A.world + 1.6), sc = .46, Lh = F.LIST.head + F.LIST.row * 4 + 36, cx = 380, cy = 180 - (F.LIST.head + F.LIST.row * 3.5 - Lh / 2) * sc;
      if (su > 0) { const y0 = cy + (F.LIST.head + F.LIST.row * 3 - Lh / 2) * sc - 4, y1 = cy + (F.LIST.head + F.LIST.row * 4 - Lh / 2) * sc + 2;
        const gh = Math.max(0, Math.sin(t * 13.7) * Math.sin(t * 3.1 + 1)) > .35 ? .9 : .12 * (1 + Math.sin(t * 2));
        ctx.save(); ctx.beginPath(); ctx.rect(cx - 220, y0 + (1 - expoOut(su)) * 40, 440, y1 - y0); ctx.clip();
        F.list(ctx, t, cx, cy + (1 - expoOut(su)) * 40, { s: sc, rows: [{}, {}, {}, { num: 1, redact: 1, ghost: gh }] }); ctx.restore(); } }
    ctx.restore();
    // sources
    if (t > A.years - 1 && t < A.clock + .5) F.source(ctx, t, A.years - .2, A.clock + .4, MAKERS);
    if (t > A.inside && t < A.cyber + 1) F.source(ctx, t, A.inside + .6, A.cyber + .6, SRC.axios);
    if (t > A.nov - .5 && t < A.flew + .6) F.source(ctx, t, A.nov, A.flew - .05, SRC.faa);
    if (t > A.flew && t < A.stays + 1.5) F.source(ctx, t, A.flew + .5, A.stays + 1.4, SRC.faa2);
  }

  // while the eye is out here (3.14–3.22) the bunker below rests in the dark: a soft veil from the line down (sources stay readable)
  const veilA = (t) => .5 * span(t, A.inside + .4, A.inside + 2.2) * (1 - span(t, A.stays + .2, A.carry + .4));
  function veil(ctx, t, v) { const a = veilA(t); if (a <= 0) return; const ly = X.toScreen(v, 0, LY)[1] + 4;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = E.lin(ctx, 0, ly, 0, ly + 160, [[0, rgba(P.night0, 0)], [1, rgba(P.night0, a)]]); ctx.fillRect(0, ly, W, H - ly); ctx.restore(); }
  const draw = (ctx, t) => { const v = view(t); stage(ctx, t, v); veil(ctx, t, v); drawList(ctx, t, v); screen(ctx, t, v); };
  const marks = [A.most, A.clock, A.expect, A.inside, A.robots, A.cyber, A.fragile, A.nov, A.flew, A.stays, A.run, A.people, A.world];
  return [{ t: R.a, draw: (ctx, t) => S.plateBunker(ctx, t, T), print: PR }, { t: t0, draw, print: PR }, ...marks.map((t) => ({ t, draw, print: PR }))];
};
