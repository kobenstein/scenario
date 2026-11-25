// c11 · B3 · 'One country has built' (p1011) → 'So a world nobody wants' (p1112). Safety for everyone, and why a bunker against people
// cannot give it. One continuous take, no cut inside (the answer part: the night warms a little): the thin wall becomes the wall of a house →
// the ground opens under it: a shelter in concrete → each resident's gold dot drops into a place → ★ pull back: house after house, every
// basement lit, PLACES > PEOPLE → two basements in use (wine cellar, party room) → the houses sink, the city of Helsinki rises, rock halls
// with a playground and a pool → the small hook bunker beside them: A HIDING PLACE → the line's people go down into the halls: A SOCIETY →
// BUILT AGAINST BOMBS → the halls close, a bunker against people grows and its queue grows faster → the door shuts on all but one (p1112).
//
// | ID   | anchor (phrase)               | zeigt wörtlich                                   | picture                                                                    | layer | carrier out |
// |------|-------------------------------|--------------------------------------------------|----------------------------------------------------------------------------|-------|-------------|
// | 5.22 | One country has built         | one country built safety for everyone            | the thick wall sinks; a house unrolls out of the thin wall, the lantern people stand before it | MIX | the house |
// | 5.23 | In concrete                   | in concrete                                      | the ground opens under it: a shelter, concrete stipple, a thick door        | EXPL  | the shelter |
// | 5.24 | Switzerland made it a rule    | a protected place for every resident             | each resident's gold dot drops into a place in the shelter: SWITZERLAND · PRINCIPLE SINCE 1963 / A PROTECTED PLACE FOR EVERY RESIDENT | EXPL | the dots |
// | 5.25★| Today it has more shelter     | more shelter places than people                  | pull back: house after house, every basement lit; two bars in the section: PLACES > PEOPLE (+ ~9 MILLION PLACES · ~370,000 SHELTERS) | EXPL | a basement |
// | 5.26 | Some are wine cellars         | some are wine cellars or party rooms             | push into two basements: a wine cellar with friends, a party room under a string of lights | SCENE | the ground |
// | 5.27 | In Helsinki                   | Helsinki: playgrounds and swimming pools         | the houses sink, a city rises; rock halls cut under it: a slide, a pool: HELSINKI, FINLAND | MIX | the hall |
// | 5.28 | A bunker for a few            | a bunker for a few is a hiding place             | beside the halls the small hook bunker with three figures: A HIDING PLACE  | MIX   | the hall    |
// | 5.29 | A bunker for everyone         | a bunker for everyone is a society               | the people on the line go down, the halls fill: A SOCIETY                  | MIX   | the hall    |
// | 5.30 | But those shelters are built  | those are built against bombs                    | BUILT AGAINST BOMBS over the halls                                         | EXPL  | the halls   |
// | 5.31 | A bunker against people       | never has room for everyone                      | the halls close; a bunker with guards grows, the queue grows with it and never fits | MIX | the queue |
// | 5.32 | Someone has to stay outside   | someone stays outside                            | the queue goes in, the door shuts: one figure stays outside: SOMEONE STAYS OUTSIDE (p1112) | MIX | the concrete |
import { E, F, S, X, LY, TAU, LOCAL, lab, view, seamKeys, keyed, above, rowPeople, skyline, secBunker, stage1011, P1011, PL1011, p1011, stage1112, P1112, PL1112, p1112, ROOM_PEOPLE } from '../lib/b3_common.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, halo, prng } = E;
const { GOLD, CREAM, PAPER, CONCRETE, SOURCES: SRC } = F;
const PR = F.PRINT72;
const HA = { x: 1420, w: 360 };                      // the Swiss house (its left wall = the thin wall at 1240)
const HOUSES = [[1840, 320, 'party'], [1000, 310], [2250, 300], [590, 300], [2660, 310], [180, 300]];
const SH = (x, w) => { const bw = w * .8, bh = w * .42; return { x0: x - bw / 2, y0: LY + 16, w: bw, h: bh }; };
const CUT0 = { x0: 1180, x1: 1700, depth: 330 }, CUTW = { x0: -300, x1: 2950, depth: 330 }, CUTH = { x0: -300, x1: 2950, depth: 560 };
const HALLS = [[1720, 'play'], [2250, 'pool']], HALL = { y: LY + 470, w: 470, h: 320 };
const HIDE = { x: 1160, room: { x0: 1110, x1: 1400, h: 150 }, depth: 120 };   // = the P1112 bunker at its first width (c11 → stage1112 continues it)
const LINEP = rowPeople(1500, 2480, 9, 92, 7352);

export default async (T, R) => {
  const G = (p, n = 0) => T.G(p, n, R.a - .01);
  const A = {
    one: R.a, built: G('has built'), safety: G('safety for'), concrete: G('In concrete'), swiss: G('Switzerland made'), rule: G('a rule'), prot: G('a protected'),
    res: G('every resident'), today: G('Today it has'), places: G('shelter places'), people: G('than people'), wine: G('Some are wine'), party: G('or party'), mean: G('the meantime'),
    hel: G('In Helsinki'), play: G('playgrounds'), swim: G('and swimming'), few: G('A bunker for a few'), hiding: G('a hiding place'), every: G('A bunker for everyone'),
    society: G('a society'), but: G('But those shelters'), bombs: G('against bombs'), againstP: G('A bunker against people'), never: G('never has'), room: G('room for everyone'),
    someone: G('Someone has to'), outside: G('stay outside'), end: R.b,
  };
  const tP = A.end - S.SEAM_HALF, tSwitch = A.againstP - .45;
  // ---------------------------------------------------------------- view + pool
  const VD = [...seamKeys(T, 'One country has built', P1011.V), [A.concrete - .2, { x: 1300, y: 560, s: 1.0 }], [A.swiss + .6, { x: 1320, y: 600, s: 1.0 }], [A.today - .1, { x: 1330, y: 606, s: 1.02 }],
    [A.places + .6, { x: 1250, y: 660, s: .8 }], [A.wine - .3, { x: 1260, y: 660, s: .81 }], [A.mean + .5, { x: 1380, y: 662, s: .86 }],
    [A.hel + 1.4, { x: 1560, y: 700, s: .89 }], [A.swim + .6, { x: 1550, y: 702, s: .9 }], [A.few + .6, { x: 1470, y: 700, s: .88 }], [A.but + .4, { x: 1468, y: 700, s: .885 }],
    [A.never + .6, { x: 1170, y: 650, s: .9 }], [tP, P1112.V]];
  const vw = (t) => view(t, VD);
  const PK = [[A.one, P1011.pool], [A.concrete, [1400, 470, .85]], [A.places, [1250, 520, .9]], [A.wine, [1250, 520, .9]], [A.party + .3, [1620, 560, .85]], [A.hel + 1, [1600, 640, .85]], [A.againstP + .5, [1300, 600, .85]], [tP, P1112.pool]];
  const pool = (t) => { let i = 0; while (i < PK.length - 2 && t > PK[i + 1][0]) i++; const [t0, a] = PK[i], [t1, b] = PK[i + 1], u = sineIO(span(t, t0, t1)); return a.map((x, j) => lerp(x, b[j], u)); };
  // the cut: opens under the house, widens under all the houses, deepens for the halls; then (stage1112) narrows to the bunker
  const cutU = (t) => span(t, A.concrete - .25, A.concrete + .75);
  const cutAt = (t) => { const w = sineIO(span(t, A.today - .1, A.places + .9)), d = sineIO(span(t, A.hel - .2, A.hel + 1.4));
    const C = { x0: lerp(CUT0.x0, CUTW.x0, w), x1: lerp(CUT0.x1, CUTW.x1, w), depth: lerp(CUT0.depth, CUTH.depth, d) };
    const n = sineIO(span(t, A.againstP - .1, A.againstP + 1.3)); return { x0: lerp(C.x0, P1112.cut.x0, n), x1: lerp(C.x1, P1112.cut.x1, n), depth: lerp(C.depth, P1112.cut.depth, n) }; };

  // ---------------------------------------------------------------- the houses
  const houseRise = (t) => span(t, A.one + .55, A.built + 1.1);
  const houseSink = (t, i) => span(t, A.hel - .55 + i * .07, A.hel + .45 + i * .07);
  const residents = rowPeople(P1011.row[0], P1011.row[1], 5, 96, 7323, -1);
  const resX = (t, i) => residents[i].x + sineIO(span(t, A.built, A.safety + .6)) * (80 + i * 12);
  const dotU = (t, i) => quartIO(span(t, A.prot + i * .14, A.prot + .85 + i * .14));
  const otherRise = (t, i) => span(t, A.today + .1 + Math.floor(i / 2) * .16, A.today + 1.0 + Math.floor(i / 2) * .16);
  const useU = (t, i) => span(t, [A.wine + .2, A.party][i], [A.wine + 1.0, A.party + .8][i]);
  function house(ctx, t, x, w, o) {   // the house above the line + its shelter revealed by the cut below (o.rise, o.sink, o.use, o.useU, o.cutY)
    const k = expoOut(o.rise) * (1 - sineIO(o.sink)); if (o.rise <= 0 || o.sink >= 1) return;
    above(ctx, () => { ctx.save(); ctx.translate(0, (1 - k) * w * 1.1); if (o.clipX != null) { ctx.beginPath(); ctx.rect(o.clipX0, -2000, o.clipX - o.clipX0, 4000); ctx.clip(); } F.house(ctx, t, x, LY, w, { shelter: 0, lit: 1 }); ctx.restore(); });
    ctx.save(); ctx.beginPath(); ctx.rect(x - w, LY, w * 2, o.cutY); ctx.clip(); ctx.translate(0, (1 - expoOut(o.rise)) * w * .6 + sineIO(o.sink) * (o.cutY + 20));
    ctx.beginPath(); ctx.rect(x - w, LY + 2, w * 2, 4000); ctx.clip();
    F.house(ctx, t, x, LY, w, { shelter: 1 });
    const sh = SH(x, w); halo(ctx, sh.x0 + sh.w * .45, sh.y0 + sh.h * .55, sh.w * .5, .3 * (o.lit ?? 1), GOLD.halo, GOLD.core);
    if (o.use && o.useU > 0) { ctx.save(); ctx.beginPath(); ctx.rect(sh.x0, sh.y0, sh.w * sineIO(o.useU), sh.h); ctx.clip(); F.house(ctx, t, x, LY, w, { shelter: 1, use: o.use });
      ctx.beginPath(); ctx.rect(sh.x0, sh.y0, sh.w, sh.h); ctx.clip();
      const P3 = o.use === 'wine' ? [[.62, 58, 1], [.78, 54, -1], [.9, 56, -1]] : [[.25, 56, 1], [.42, 60, -1], [.6, 54, 1], [.75, 58, -1]];
      if (o.use === 'wine') { ctx.fillStyle = mixHex(P.night1, P.ind2, .5); ctx.fillRect(sh.x0 + sh.w * .66, sh.y0 + sh.h - 30, sh.w * .2, 6); }
      for (const [f, h, d] of P3) F.person(ctx, sh.x0 + sh.w * f, sh.y0 + sh.h - 2, h, { pose: 'stand', dir: d, light: -1, rim: GOLD.line });
      ctx.restore(); }
    ctx.restore();
  }
  function houses(ctx, t, s, C) {
    const cy = C.depth * sineIO(cutU(t));
    // the other houses (pull back), the Swiss house A
    HOUSES.forEach(([x, w, use], i) => house(ctx, t, x, w, { rise: otherRise(t, i), sink: houseSink(t, i + 1), cutY: cy, use, useU: use ? useU(t, 1) : 0 }));
    const hr = houseRise(t);
    if (hr > 0) house(ctx, t, HA.x, HA.w, { rise: 1, sink: houseSink(t, 0), cutY: cy, clipX0: P1011.thin.x - 12, clipX: lerp(P1011.thin.x + 12, HA.x + HA.w * .62, sineIO(hr)), use: 'wine', useU: useU(t, 0) });
    // the residents (the lantern people of the plate) and their gold dots → places in the shelter
    const sh = SH(HA.x, HA.w), sinkR = houseSink(t, 0);
    residents.forEach((p, i) => { const x = resX(t, i);
      above(ctx, () => F.lanternPerson(ctx, t, x, LY + sineIO(sinkR) * 130, p.h, { ph: p.ph, dir: p.dir, lamp: 1 }));
      const du = dotU(t, i); if (du <= 0) return;
      const a = [x + p.h * p.dir * .105, LY - p.h * .465], b = [sh.x0 + 34 + i * (sh.w - 68) / 4, sh.y0 + sh.h * .66], q = du, mx = (a[0] + b[0]) / 2, my = Math.min(a[1], b[1]) - 90;
      const px = (1 - q) ** 2 * a[0] + 2 * q * (1 - q) * mx + q * q * b[0], py = (1 - q) ** 2 * a[1] + 2 * q * (1 - q) * my + q * q * b[1];
      const fade = 1 - span(t, A.wine - .2, A.wine + .6) - sineIO(sinkR);
      if (fade > 0) { F.glowDot(ctx, px, py, 26, .9 * fade, 'gold'); if (du >= 1) { ctx.fillStyle = rgba(GOLD.body, fade); ctx.beginPath(); ctx.arc(px, py, 6, 0, TAU); ctx.fill(); } } });
  }

  // ---------------------------------------------------------------- Helsinki, the hiding place
  const cityU = (t) => span(t, A.hel + .1, A.hel + 1.6) * (1 - span(t, A.againstP - .3, A.againstP + .6));
  const hallU = (t, i) => span(t, [A.play - .3, A.swim - .3][i], [A.play + .7, A.swim + .7][i]) * (1 - span(t, A.againstP - .9, A.againstP + .1));
  const hideU = (t) => span(t, A.few - .1, A.few + .9);
  const descend = (t, i) => span(t, A.every + .1 + i * .13, A.every + .7 + i * .13);
  function helsinki(ctx, t, s, noHide) {
    const cu = cityU(t); if (cu <= 0 && hallU(t, 0) <= 0 && (noHide || hideU(t) <= 0)) return;
    skyline(ctx, t, 1020, 2300, cu, 7351, s);
    // the people of the city on the line, they go down into the halls (5.29)
    LINEP.forEach((p, i) => { const d = descend(t, i), k = cu * (1 - sineIO(d)); if (k <= 0) return;
      above(ctx, () => F.lanternPerson(ctx, t, p.x, LY + (1 - expoOut(cu)) * 110 + sineIO(d) * 120, p.h, { ph: p.ph, dir: p.dir })); });
    const full = span(t, A.every + .3, A.society + .6);
    HALLS.forEach(([x, use], i) => { const u = hallU(t, i); if (u <= 0) return;
      F.rockHall(ctx, t, x, HALL.y, HALL.w, HALL.h, { u, use, people: 4, full, s }); });
    const hu = hideU(t); if (hu > 0 && !noHide) {   // the hiding place grows down out of its hatch (clip from the line), the few walk in
      ctx.save(); ctx.beginPath(); ctx.rect(HIDE.x - 400, LY - 10, 1000, 10 + (HIDE.depth + HIDE.room.h + 40) * quartIO(hu)); ctx.clip();
      secBunker(ctx, t, HIDE.x, LY, { s, depth: HIDE.depth, room: HIDE.room, light: .9 * span(hu, .4, 1), door: 0, people: ROOM_PEOPLE(HIDE.room, 3).map((p, j) => ({ ...p, a: span(hu, .55 + j * .12, .75 + j * .12) })) });
      ctx.restore();
      above(ctx, () => { ctx.save(); ctx.translate(0, (1 - expoOut(span(hu, 0, .5))) * 60); F.hatch(ctx, t, HIDE.x, LY, 150, { tilt: .075, open: 0, glow: .25, s }); ctx.restore(); }); }
    X.label(ctx, SRC.hiding, (HIDE.room.x0 + HIDE.room.x1) / 2, LY + 320, lab(t, A.hiding - .2, A.againstP), { size: 28, spacing: .14 });
    X.label(ctx, SRC.society, (HALLS[0][0] + HALLS[1][0]) / 2, LY + 92, lab(t, A.society - .15, A.but + .5), { size: 30, spacing: .14, gold: .5 });
    X.label(ctx, LOCAL.againstBombs, (HALLS[0][0] + HALLS[1][0]) / 2, LY + 92, lab(t, A.bombs - .2, A.againstP), { size: 30, spacing: .14 });
  }

  // ---------------------------------------------------------------- 5.31–5.32 the bunker against people (stage1112)
  const roomX1 = (t) => lerp(1400, P1112.room.x1, sineIO(span(t, A.never - .4, A.room + .8)));
  const nIn = (t) => 3 + Math.round(3 * sineIO(span(t, A.never - .4, A.room + .8)));
  const QN = 13, qLen = (t) => QN * sineIO(span(t, A.againstP + .1, A.room + .9));
  const shiftMax = P1112.out - 1060 + (QN - 1) * 62, shift = (t) => shiftMax * quartIO(span(t, A.someone - .55, A.outside + .3));
  const QP = rowPeople(0, 1, QN, 92, 7353); QP[QN - 1] = { ...QP[QN - 1], h: 96, ph: 2.1 };   // the last one = the plate's figure outside
  function queue(t) {
    return Array.from({ length: QN }, (_, i) => { const x = 1060 - i * 62 + shift(t), grow = clamp(qLen(t) - i);
      return { x, h: QP[i].h, ph: QP[i].ph, dir: 1, a: grow > 0 ? 1 : 0, sink: Math.max(1 - expoOut(grow), i === QN - 1 ? 0 : span(x, 1100, 1180)) }; })
      .filter((q) => q.a > 0 && q.sink < 1);
  }
  const guardsU = (t) => span(t, A.againstP + .2, A.againstP + 1.0), guardsIn = (t) => span(t, A.outside - .3, A.outside + .3);
  function draw(ctx, t) {
    const v = vw(t), pl = pool(t), C = cutAt(t);
    if (t < tSwitch) {
      if (t < A.one + 2.5) {   // the plate's walls: the thick one sinks, the thin one becomes the house's wall
        stage1011(ctx, t, v, { ...PL1011, pool: pl, thickSink: span(t, A.one + .5, A.one + 1.5), label2: 1 - span(t, A.one + .5, A.one + 1.0), thinA: 1 - span(t, A.built + .3, A.built + 1.0), row: 0,
          top: (cx, s) => houses(cx, t, s, C) });
        return;
      }
      X.ground(ctx, t, v, { lx: pl[0], ly: pl[1], pool: pl[2], cut: cutU(t) > 0 ? { ...C, u: cutU(t) } : null });
      X.inView(ctx, v, (s) => { houses(ctx, t, s, C); helsinki(ctx, t, s); });
      X.label(ctx, SRC.swiss.split(': ')[0], 150, 250, lab(t, A.swiss - .1, A.today + .2), { size: 30, spacing: .12, align: 'left' });
      X.label(ctx, SRC.swiss.split(': ')[1], 150, 300, lab(t, A.prot - .1, A.today + .2), { size: 30, spacing: .12, gold: .5, align: 'left' });
      bars(ctx, t);
      helsinkiScreen(ctx, t, v);
      return;
    }
    stage1112(ctx, t, v, { pool: pl, cutR: C, cut: 1, reveal: 1, room: { ...P1112.room, x1: roomX1(t) }, door: span(t, A.outside - .05, A.outside + .6), light: .9,
      people: ROOM_PEOPLE({ ...P1112.room, x1: roomX1(t) }, nIn(t)).map((p, i) => ({ ...p, a: i < 6 ? 1 : 0 })), queue: queue(t), outside: 0, label: lab(t, A.outside - .1, A.end + 5),
      under: (cx, s) => helsinki(cx, t, s, true),
      top: (cx, s) => { const g = guardsU(t), gi = guardsIn(t); if (g <= 0 || gi >= 1) return;
        above(cx, () => [1238, 1280].forEach((x, i) => F.person(cx, x, LY + (1 - expoOut(g)) * 140 + sineIO(gi) * 150, 112, { pose: 'stand', dir: -1, light: -1, rim: CREAM }))); } });
  }
  // the bars (screen space, in the section under the houses): PLACES > PEOPLE, the figures, the source
  function bars(ctx, t) {
    const out = span(t, A.wine - .3, A.wine + .4), pu = span(t, A.places - .3, A.places + .7) * (1 - out), qu = span(t, A.people - .2, A.people + .7) * (1 - out);
    if (pu <= 0 && qu <= 0) return;
    const x0 = 640, L = 760, y1 = 676, y2 = 724;
    X.bar(ctx, x0, y1, 22, L * 1.06, pu, { col: 'gold', horizontal: true }); X.bar(ctx, x0, y2, 22, L, qu, { col: 'cream', horizontal: true, a: .85 });
    X.label(ctx, SRC.placesPeople[0], x0 - 24, y1 + 9, pu > 0 ? span(t, A.places - .3, A.places + .4) * (1 - out) : 0, { size: 24, align: 'right', gold: .6 });
    X.label(ctx, SRC.placesPeople[1], x0 - 24, y2 + 9, qu > 0 ? span(t, A.people - .2, A.people + .5) * (1 - out) : 0, { size: 24, align: 'right' });
    X.label(ctx, SRC.swissNums, x0, 790, span(t, A.people + .3, A.people + 1.0) * (1 - out), { size: 22, align: 'left', spacing: .08 });
    F.source(ctx, t, A.places, A.wine + .3, SRC.swissSrc);
  }
  function helsinkiScreen(ctx, t, v) {
    const [sx, sy] = X.toScreen(v, 1630, 300);
    X.dateTag(ctx, SRC.helsinki, sx, sy, lab(t, A.hel + .2, A.few));
    F.source(ctx, t, A.play - .2, A.few, SRC.kb.helsinkiSrc);
  }
  const marks = [R.a + S.SEAM_HALF, A.built, A.concrete, A.swiss, A.today, A.wine, A.hel, A.few, A.every, A.but, A.againstP, A.someone];
  return [{ t: R.a, draw: (ctx, t) => p1011(ctx, t, T), print: PR }, ...marks.map((t) => ({ t, draw, print: PR })), { t: tP, draw: (ctx, t) => p1112(ctx, t, T), print: PR }];
};
