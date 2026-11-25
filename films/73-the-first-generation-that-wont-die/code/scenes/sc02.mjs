// c02 · B1 · 'The date comes from' → 'Is that bet paying off' · KURZWEIL'S DATE AND THE FOUR CENTURIES
// One continuous take on THE LIFELINE (no cut inside; the clip plate grows out of the 2032 and goes back into it).
// ★ = 1.13: the dashed run of the analysis lands at 2459, four centuries along the line; the camera has pulled back over all of it and
// your whole life is a short gold piece at the start (tiny you on it). Fact check 25.11. (faktencheck.md MB1, K1): no "Google" on screen,
// the Z3 card is de Magalhães' own sentence, the analysis is a blogger's (strings: lib/b1_kit.mjs FC).
//
// | ID   | anchor (phrase)                 | zeigt wörtlich                                                                   | layer | carrier out           |
// |------|---------------------------------|----------------------------------------------------------------------------------|-------|-----------------------|
// | 1.01 | The date comes from             | out of plate2032: REPAIR and COPY sink into the line, a name tag on the 2032: RAY KURZWEIL · INVENTOR AND FUTURIST; the 2032 opens into the clip plate | MIX | the plate |
// | 1.02 | slot C1                         | C1 Kurzweil (ORIGINAL FOOTAGE); the plate shrinks back into the 2032               | CLIP  | the 2032              |
// | 1.03 | His claim                       | you walk your line; each year you live the end tick slides one year on (an arc carries the year): +1 YEAR FOR EVERY YEAR | EXPL | the end tick |
// | 1.04 | That's what "won't die" means   | the grey old-age end turns gold: “WON’T DIE” · OLD AGE STOPS BEING THE CAUSE       | EXPL  | the end               |
// | 1.05 | Not immortal                    | NOT IMMORTALITY: a dashed ray tries to run on past the end tick and falls back     | EXPL  | the line              |
// | 1.06 | An accident could               | a small cream tick drops onto the line: AN ACCIDENT: STILL POSSIBLE              | EXPL  | the tick              |
// | 1.07 | Old age couldn't                | the old-age end tick lifts off, the line runs on: OLD AGE: NO LONGER             | EXPL  | the 2032 tag          |
// | 1.08 | But Kurzweil has moved          | the date tag hops 2029 → AROUND 2030 → 2032 (KURZWEIL'S DATE); books grow under it | EXPL | the tag              |
// | 1.09 | Critics note                    | the tag turns hollow (dashed), the books sink: CRITICS: NO PEER-REVIEWED BASIS…; the old end comes back | EXPL | the line |
// | 1.10 | And at today's pace             | a dashed cream run starts at today and runs on, far past 2032; the camera follows and pulls back | EXPL | the run |
// | 1.11 | A leading aging researcher      | quote card (de Magalhães on X) + source (the analysis: a blog)                   | EXPL  | the card              |
// | 1.12 | Its result: not 2032            | the hollow 2032 tag dims                                                          | EXPL  | the run               |
// | 1.13★| Around 2459                     | the run lands: 2459; the pull back shows four centuries; your life a short gold piece | EXPL | your piece           |
// | 1.14 | In your lifetime                | your piece glows: IN YOUR LIFETIME (2032 inside it)                               | EXPL  | 2459                  |
// | 1.15 | Or four centuries too late      | at the far end: FOUR CENTURIES TOO LATE                                           | EXPL  | the AI ring           |
// | 1.16 | And even that analysis          | the AI ring rises over the run's head and pulls it back: NO CHANCE UNLESS AI SPEEDS IT UP | EXPL | the ring          |
// | 1.17 | So the first generation         | the title returns small; the ring's beam lands on you: A BET ON AI → betPlate (c03) | MIX | the ring             |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f73_kit.mjs';
import * as S from '../lib/f73_world.mjs';
import * as X from '../lib/f73_stage.mjs';
import * as B from '../lib/b1_kit.mjs';
const { W, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, expoIn, halo } = E;
const { GOLD, COOL, CREAM, AGE, SOURCES: SRC } = F;
const { LY, YPX, X0, XEND, XAGE, X32, XNOW, X59, BET, FC, lab } = B;
const PR = F.PRINT73;
// text only while it is up (a sunk serif line still leaks its glow above the mask)
const big = (c, txt, x, y, sz, u, o) => { if (u > 0) X.big(c, txt, x, y, sz, u, o); };
const label = (c, txt, x, y, u, o) => { if (u > 0) X.label(c, txt, x, y, u, o); };

export default async (T, R) => {
  const G = (p, n = 0) => T.G(p, n, R.a - .01);
  const A = {
    date: R.a, kurz: G('Ray Kurzweil'), claim: G('His claim'), every: G('for every year'), means: G("That's what"), notImm: G('Not immortal'),
    acc: G('An accident could'), old: G("Old age couldn't"), moved: G('But Kurzweil has moved'), books: G('sells books'), critics: G('Critics note'),
    pace: G("And at today's pace"), leading: G('A leading aging researcher'), result: G('Its result'), y2459: G('Around twenty-four'),
    life: G('In your lifetime'), cent: G('Or four centuries'), even: G('And even that analysis'), chance: G('no chance'), speeds: G('speeds things up'),
    so: G('So the first generation'), bet: G('a bet on'), end: R.b,
  };
  const C1 = T.clip('C1') || { start: A.kurz + 3, end: A.claim - .6 };
  const tb = R.b;

  // the run of the analysis (1.10 → 1.16): today → 2459 → pulled back by the ring to x 1600
  const runX = (t) => lerp(lerp(XNOW, X59, sineIO(span(t, A.pace + .4, A.y2459 + .05))), BET.run, sineIO(span(t, A.even + 1.7, A.speeds + .9)));
  // while the ring pulls the run back the camera keeps its head at screen x ~1500 (never further right than it already was)
  function retractKeys() {
    const a = A.even + 1.9, b = A.speeds + .7, out = [];
    for (let i = 0; i <= 6; i++) { const q = i / 6, t = lerp(a, b, q), s = Math.exp(lerp(Math.log(.19), Math.log(.5), sineIO(q))); out.push([t, { x: Math.min(4900, runX(t) - 540 / s), y: lerp(852, 772, sineIO(q)), s }]); }
    return out;
  }
  // ---------------------------------------------------------------- the view: plate2032's creep → one path to the bet plate
  const creepV = (t) => S.view2032(t, S.creep(t, T, 'The date comes from'));
  const t0 = A.date + .3, v0 = S.P2032.view;
  const VD = [
    [t0, { ...v0, s: S.creep(t0, T, 'The date comes from') }], [A.date + 3.0, { x: 1040, y: 690, s: 1.3 }], [C1.start, { x: 1045, y: 692, s: 1.34 }],
    [C1.end - .6, { x: 1045, y: 694, s: 1.38 }], [A.claim + 1.6, { x: 1360, y: 770, s: 1.55 }], [A.means + .2, { x: 1390, y: 768, s: 1.5 }],
    [A.acc, { x: 1470, y: 760, s: 1.42 }], [A.old + .7, { x: 1540, y: 760, s: 1.36 }], [A.moved + 1.0, { x: 1090, y: 760, s: 1.42 }],
    [A.critics + 1.2, { x: 1070, y: 752, s: 1.32 }], [A.pace, { x: 1060, y: 750, s: 1.3 }], [A.pace + 2.2, { x: 1500, y: 780, s: .8 }],
    [A.pace + 4.2, { x: 2600, y: 800, s: .45 }], [A.leading, { x: 3700, y: 820, s: .3 }], [A.result, { x: 5000, y: 835, s: .2 }],
    [A.result + 1.6, { x: 5000, y: 845, s: .19 }], [A.y2459 + 1.6, { x: 4950, y: 860, s: .175 }], [A.even, { x: 4900, y: 860, s: .17 }],
    ...retractKeys(), [A.so + .8, { x: 1330, y: 720, s: .58 }], [tb, BET.view],
  ];
  const path = (t) => B.withBreath(t, X.viewPath(t, VD));
  const view = (t) => (t <= t0 ? creepV(t) : B.mixV(creepV(t), path(t), sineIO(span(t, t0, t0 + 1.4))));
  const vs = (t) => X.viewPath(t, VD).s;   // the scale without breath (ring size / run offset stay constant on screen)
  const PK = [[R.a, [X32, 686, 1]], [C1.end, [X32, 700, 1]], [A.claim + 1, [1350, 760, 1]], [A.moved + 1, [1080, 760, 1]], [A.pace + 3, [3000, 820, .9]],
    [A.result, [5000, 840, .85]], [A.even + 1, [4000, 840, .85]], [tb, [1300, 600, .9]]];
  const pool = (t) => { let i = 0; while (i < PK.length - 2 && t > PK[i + 1][0]) i++; const [a0, a] = PK[i], [a1, b] = PK[i + 1], u = sineIO(span(t, a0, a1)); return a.map((x, j) => lerp(x, b[j], u)); };

  // ---------------------------------------------------------------- states
  const plateM = (t) => sineIO(span(t, C1.start - 1.0, C1.start + .4)) * (1 - sineIO(span(t, C1.end - .7, C1.end + .45)));
  const STEP = Array.from({ length: 3 }, (_, i) => lerp(A.every - .2, A.means - 1.0, i / 2));   // the three years you live (1.03)
  const steps = (t) => STEP.reduce((a, s0) => a + sineIO(span(t, s0, s0 + .7)), 0);
  const backK = (t) => sineIO(span(t, A.critics + 1.0, A.critics + 2.4));                      // the claim is undone after the critics
  const shift = (t) => steps(t) * YPX * (1 - backK(t));
  const WALK2 = [A.old + .15, A.old + 1.9];
  const youX = (t) => X32 + 60 + steps(t) * YPX + (BET.you - X32 - 60 - 3 * YPX) * sineIO(span(t, WALK2[0], WALK2[1]));
  const walking = (t) => STEP.some((s0) => t > s0 - .05 && t < s0 + .75) || (t > WALK2[0] && t < WALK2[1]);
  const lift = (t) => span(t, A.old + .05, A.old + .9) * (1 - backK(t));
  const open = (t) => span(t, A.old + .2, A.old + 1.7) * (1 - backK(t));
  const ageU = (t) => clamp(1 - span(t, A.means + .1, A.means + 1.2) + backK(t));
  const accX = B.yx(2058);
  // the date tag (1.08): 2029 → around 2030 → 2032, hops on arcs
  const HOP = [A.moved + 1.2, A.moved + 2.4];
  const tagX = (t) => lerp(lerp(B.yx(2029), B.yx(2030), quartIO(span(t, HOP[0], HOP[0] + .5))), X32, quartIO(span(t, HOP[1], HOP[1] + .55)));
  const tagHop = (t) => 26 * (Math.sin(Math.PI * span(t, HOP[0], HOP[0] + .5)) + Math.sin(Math.PI * span(t, HOP[1], HOP[1] + .55)));
  const tagTxt = (t) => (t < HOP[0] + .25 ? SRC.kDates[0] : t < HOP[1] + .27 ? SRC.kDates[1] : SRC.kDates[2]);
  const tagU = (t) => span(t, A.moved - .1, A.moved + .5);
  const booksU = (t) => span(t, A.books - .3, A.books + .9) * (1 - span(t, A.critics, A.critics + .9));
  const hollow = (t) => span(t, A.critics + .2, A.critics + 1.0);
  const dim = (t) => span(t, A.result + .3, A.result + 1.1);
  const ringRise = (t) => expoOut(span(t, A.even + .6, A.even + 1.8));

  // ---------------------------------------------------------------- phase A: the plate taken apart (1.01) + the clip (1.02)
  function plateStage(ctx, t, v) {
    const k = (a, d) => 1 - span(t, A.date + a, A.date + a + d);
    S.draw2032(ctx, t, v, {
      pool: pool(t), body: { u: k(.5, 1.4) }, repair: k(.3, .6), comp: { u: k(.9, 1.3), on: 1 }, fly: { u: k(.5, .6) }, copy: k(.4, .6),
      y2032: 1, you: { x: S.P2032.you, dir: 1, pose: 'look' },
      top: (c, s) => F.goldLabel(c, X32 + 150, LY - 196, FC.kurzweil[0], FC.kurzweil[1], lab(t, A.kurz - .3, C1.start - .5), { dx: 56, dy: -64, size: 30 }),
    });
  }
  // the big 2032 numeral (sheet) and its screen rect: the clip grows out of it and goes back into it
  const numY = (t) => (t < C1.start + .5 ? LY - 60 : LY - 110);
  function numRect(t, v) {
    const w = F.measure('2032', 200, true), [ax, ay] = X.toScreen(v, X32 - w / 2, numY(t) - 150), [bx, by] = X.toScreen(v, X32 + w / 2, numY(t) + 10);
    return { x: ax, y: ay, w: bx - ax, h: by - ay };
  }

  // ---------------------------------------------------------------- phase B: your line (1.03 → 1.09)
  function lineStage(ctx, t, v) {
    const [lx, ly, pl] = pool(t);
    X.ground(ctx, t, v, { lx, ly, pool: pl });
    let booksTop = LY;
    X.inView(ctx, v, (s) => {
      const sh = shift(t), L = X.lifeline(ctx, t, X0, XEND + sh, LY, s, { age: XAGE + sh, ageU: ageU(t), end: 1, lift: lift(t), open: open(t), openTo: XEND + sh + 900, glow: 1 });
      X.yearTag(ctx, '1985', X0, LY, 1, s, { below: true, size: 34 });
      // 1.05: the line tries to become a ray and falls back
      const ray = F.bump(t, A.notImm - .05, 1.2); if (ray > 0) X.drawPath(ctx, [[XEND + sh + 8, LY], [XEND + sh + 8 + 620 * ray, LY]], 1, { col: rgba(CREAM, .75), w: 2.4 / s, dash: [10 / s, 8 / s], a: ray });
      // 1.03: each year lived lights under you and an arc carries one year to the end
      STEP.forEach((s0) => {
        const k = span(t, s0, s0 + .8); if (k <= 0 || k >= 1) return;
        const hx = youX(t), ex = XEND + sh, au = sineIO(span(k, 0, .55)), fa = 1 - span(k, .6, 1);
        F.goldSpan(ctx, [[hx - YPX, LY], [hx, LY]], 0, 1, { w: 4 / s, a: fa, spark: false });
        F.goldSpan(ctx, [[ex - YPX, LY], [ex, LY]], 0, 1, { w: 4 / s, a: span(k, .45, .6) * fa, spark: false });
        const pts = Array.from({ length: 25 }, (_, i) => { const q = i / 24, x = lerp(hx - YPX / 2, ex - YPX / 2, q); return [x, LY - 16 - Math.sin(Math.PI * q) * 150]; });
        X.arrow(ctx, pts, au, { col: rgba(GOLD.line, .9), w: 2.2 / s, a: fa, glow: 6 / s, head: 12 / s });
      });
      // 1.06: the accident tick (cream, smaller than an end tick)
      const ad = span(t, A.acc + .1, A.acc + .6), ag = 1 - span(t, A.critics + .4, A.critics + 1.2);
      if (ad > 0 && ag > 0) { const yy = lerp(LY - 260, LY, expoIn(ad)), hh = 22 * ag; ctx.fillStyle = rgba(CREAM, .9); ctx.fillRect(accX - 2.2 / s, yy - hh, 4.4 / s, hh * 2);
        const land = F.bump(t, A.acc + .6, .8); if (land > 0) halo(ctx, accX, LY, 60 / s, .5 * land, CREAM, CREAM); }
      // the 2032: the big numeral (the clip's carrier) shrinks to the line, then the date tag takes over (1.08)
      X.yearTag(ctx, '', X32, LY, 1, s, { gold: 1 });
      const nk = sineIO(span(t, A.claim - .3, A.claim + 1.1)), nu = 1 - span(t, A.moved - .3, A.moved + .2);
      if (nu > 0) { const sz = lerp(200, 44 / s, nk); big(ctx, SRC.y2032, X32, lerp(LY - 110, LY + 16 / s + 40 / s, nk), sz, F.rise(nu), { gold: 1 }); }
      const bu = booksU(t); if (bu > 0) booksTop = B.books(ctx, X32, LY - 2, bu, s);
      F.du(ctx, youX(t), LY - 2, 92, walking(t) ? { dir: 1, walk: t * 6.4 } : { pose: 'look', dir: 1 });
    });
    // screen-space words
    label(ctx, SRC.claim, W / 2, 250, lab(t, A.claim + .5, A.means), { size: 40, gold: .25, spacing: .1 });
    big(ctx, SRC.wontDie[0], W / 2, 270, 96, lab(t, A.means + .15, A.notImm - .05), { gold: .9 });
    label(ctx, SRC.wontDie[1], W / 2, 336, lab(t, A.means + .45, A.notImm - .05), { size: 28, spacing: .12 });
    label(ctx, SRC.notImmortal, W / 2, 270, lab(t, A.notImm - .1, A.acc + .7), { size: 40, spacing: .12 });
    const [ax, ay] = X.toScreen(v, accX, LY);
    label(ctx, SRC.accident, ax, ay - 82, lab(t, A.acc + .35, A.moved + .2), { size: 24 });
    const [ex, ey] = X.toScreen(v, XEND + shift(t), LY);
    label(ctx, SRC.oldAge, Math.min(ex + 40, W - 260), ey - 150, lab(t, A.old - .05, A.moved + .5), { size: 28, gold: .4 });
    label(ctx, SRC.critics, W / 2, 250, lab(t, A.critics + .2, A.pace + .4), { size: 30, spacing: .1 });
    dateTag(ctx, t, v, booksTop);
  }
  // the date tag (screen px) on the line at tagX, above the books; hollow after the critics, dimmed at "not 2032"
  function dateTag(ctx, t, v, booksTop = LY) {
    const u = tagU(t); if (u <= 0) return;
    const [x, ly] = X.toScreen(v, tagX(t), LY), [, by] = X.toScreen(v, tagX(t), booksTop);
    const y = Math.min(ly, by) - 40 - tagHop(t);
    X.drawPath(ctx, [[x, ly - 6], [x, y + 18]], 1, { col: rgba(GOLD.line, .6 * (1 - .7 * dim(t))), w: 1.4, a: u });
    B.pill(ctx, tagTxt(t), x, y, u, { gold: true, hollow: hollow(t), dim: dim(t), size: 24 });
    label(ctx, SRC.kDatesTag, x, y - 46, lab(t, A.moved + .3, A.critics + .4), { size: 24, gold: .5 });
  }

  // ---------------------------------------------------------------- phase C: the run, four centuries, the bet (1.10 → 1.17), drawn as betPlate
  function runStage(ctx, t, v) {
    const s0 = vs(t), rr = ringRise(t), rx = runX(t), rUp = (t > A.even ? 1 : 0);
    const landed = span(t, A.y2459 - .05, A.y2459 + .2);
    B.betPlate(ctx, t, v, {
      pool: pool(t), run: rx, runA: 1, ringU: rr, ring: [rx, LY - lerp(0, 200, rr) / s0, 50 / s0], think: lerp(.5, 1.2, span(t, A.even + 1, A.even + 2)),
      beam: span(t, A.even + 1.3, A.even + 2.0), beamX: lerp(rx, BET.beam, sineIO(span(t, A.so, A.so + 1.4))),
      title: 1, titleU: span(t, A.so + .1, A.so + 1.3), bet: span(t, A.bet - .25, A.bet + .55),
      under: (c, s) => {   // your piece of the line glows (1.14)
        const g = F.bump(t, A.life - .1, 1.8); if (g > 0) F.goldSpan(c, [[X0, LY], [XEND, LY]], 0, 1, { w: 5 / s, a: g, spark: false });
      },
      mid: (c, s) => {
        if (rx > XNOW + 4 && (t < A.y2459 || rUp)) halo(c, rx, LY - 16 / s, 34 / s, .8, CREAM, CREAM);   // the run's head
        if (landed > 0 && t < A.even + 1.8) { const k = expoOut(landed) * (1 - span(t, A.even + .9, A.even + 1.7)); c.fillStyle = rgba(CREAM, .9 * k); c.fillRect(X59 - 2.5 / s, LY - 26 / s, 5 / s, 52 / s);
          const b = F.bump(t, A.y2459 - .05, 1.4); if (b > 0) halo(c, X59, LY, 220 / s, .6 * b, CREAM, CREAM); }
        X.yearTag(c, '', X32, LY, 1, s, { gold: 1 });
      },
      top: (c) => {
        dateTag(c, t, v);
        const [nx, ny] = X.toScreen(v, X59, LY);
        big(c, SRC.y2459, nx, ny - 64, 110, lab(t, A.y2459 - .1, A.even + 1.0), { gold: .3 });
        label(c, SRC.centuries, Math.min(nx, W - 300), ny + 74, lab(t, A.cent - .1, A.even + .9), { size: 28, spacing: .1 });
        const [px, py] = X.toScreen(v, (X0 + XEND) / 2, LY);
        label(c, SRC.lifetime, px, py - 74, lab(t, A.life - .15, A.even + .6), { size: 28, gold: .6 });
        label(c, SRC.unlessAI, W / 2, 230, lab(t, A.chance - .35, A.so + .25), { size: 32, col: COOL.text, spacing: .1 });
        // 1.11: the quote card (de Magalhães' own sentence on X) + where the analysis comes from
        const qu = span(t, A.leading - .5, A.leading + .4) * (1 - span(t, A.y2459 - .7, A.y2459 - .15));
        if (qu > 0) F.quoteCard(c, t, T, { text: FC.z3.text, credit: FC.z3.credit, u: qu, size: 44, w: 1260, y: 110, rot: -.004 });
        if (t > A.leading - .4 && t < A.y2459) F.source(c, t, A.leading - .3, A.y2459 - .2, FC.z3.src);
      },
    });
  }

  // ---------------------------------------------------------------- the take
  function take(ctx, t) {
    const v = view(t);
    if (t < C1.start + .5) plateStage(ctx, t, v); else if (t < A.pace) lineStage(ctx, t, v); else runStage(ctx, t, v);
    const m = plateM(t);
    if (m > 0) {
      const from = numRect(t, v);
      F.clipPlate(ctx, t, T, 'C1', { from, morph: m });
      // the numeral stays on top while the plate opens out of it (and lands back into it)
      const na = 1 - span(m, .08, .45); if (na > 0) { ctx.save(); ctx.globalAlpha *= na; const [x, y] = X.toScreen(v, X32, numY(t)); big(ctx, SRC.y2032, x, y, 200 * v.s, 1, { gold: 1 }); ctx.restore(); }
    }
  }
  const draw = (ctx, t) => take(ctx, t);
  return [{ t: R.a, draw, print: PR }];
};
