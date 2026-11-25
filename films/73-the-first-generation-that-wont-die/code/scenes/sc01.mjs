// c01 · HOOK (lead, the quality reference) · 'Every generation before yours' → 'The date comes from' (plate2032, B1).
// One continuous take, no cut inside. A motion-design sequence, not a world ride: every sentence gets its own picture that shows exactly
// what it says; the pictures hand over through carrier objects (the stone → its drawing → its DASH, which drops and stretches into THE
// LIFELINE · the blank where the death year would go → the line's end tick · the offer card folds into THE ANSWER · the AI ring sinks and
// becomes the computer · the screen swallows the camera (the fly) and gives it back · the line grows the body drawing and the date).
// Leitbild only in H.01–H.03 (anchor 1 of 4). ★ = the brain map, wire by wire.
//
// | ID    | anchor (phrase)                         | zeigt wörtlich                                                        | layer  | carrier out                 |
// |-------|-----------------------------------------|-----------------------------------------------------------------------|--------|-----------------------------|
// | H.01  | Every generation before yours           | thumbnail A: the stone "1985 –", title; the old stones' two years glow | ANCHOR | the stone                   |
// | H.02  | Yours may be the first that won't       | push in; on "won't" the crack in the stone tears open, light pours     | ANCHOR | the crack's light           |
// | H.03  | Because labs … engineering problem      | the stone becomes a technical drawing: AN ENGINEERING PROBLEM; its dash drops and stretches into the lifeline (1985 → end tick) | MIX | the line's end tick |
// | H.04  | And they've pointed AI at it            | the AI ring rises behind the line, its cool beam lands on the end tick | MIX    | the beam                    |
// | H.05  | So picture the day it works             | you step onto the line; the beam turns steady                          | MIX    | you                         |
// | H.06  | The offer is in front of you · No more aging · No end date | a card rises before you: THE OFFER; NO MORE AGING (the grey end of the line turns gold) · NO END DATE (the end tick lifts off, the line runs on) | EXPL | the card |
// | H.07  | Yes, or no                              | the card folds into THE ANSWER: NO ·—●—· YES                           | EXPL   | the bead                    |
// | H.08  | If you could stop dying, would you?     | the question above the answer, the bead trembles in the middle         | EXPL   | the bead                    |
// | H.09  | Most people say no                      | the bead slides to NO · PEW RESEARCH CENTER, 2013                      | EXPL   | the answer                  |
// | H.10  | But the labs aren't waiting             | the answer lifts away; the AI ring thinks faster, its beam runs along the line | MIX | the ring                 |
// | H.11  | Some want to copy a mind into a computer| a head rises out of the line (COPY A MIND); the ring sinks and becomes a computer; a dashed cool line carries the mind over | EXPL | the screen |
// | H.12  | And they've started                     | the screen lights                                                      | MIX    | the screen                  |
// | H.13  | With a fly                              | a fly in the screen; the camera dives into it                          | MIX    | the fly                     |
// | H.14★ | A real fly's brain was mapped, wire by wire | the fly's brain map draws itself, strand by strand (FlyWire)       | EXPL   | the map                     |
// | H.15  | This year, a simple computer model …    | the map turns cool, small; a virtual fly walks beside it (Eon)         | EXPL   | the virtual fly             |
// | H.16  | There's a second way to stop dying      | pull out of the screen: the computer on the line = COPY                | EXPL   | the line                    |
// | H.17  | Closer                                  | left of you, a body drawing rises out of the line                      | EXPL   | the body                    |
// | H.18  | Repair the body you already have        | REPAIR: its worn joints light gold, one by one                         | EXPL   | the line                    |
// | H.19  | And it comes with a date                | a gold tick drops onto the line between the two                        | EXPL   | the tick                    |
// | H.20  | Twenty thirty-two                       | 2032 rises big on the tick → plate2032                                 | EXPL   | plate2032                   |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f73_kit.mjs';
import * as S from '../lib/f73_world.mjs';
import * as X from '../lib/f73_stage.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, expoIn, halo } = E;
const { GOLD, COOL, CREAM, SOURCES: SRC } = F;
const PR = F.PRINT73;
const Q = S.P2032, LY = Q.line;
const quad = (a, c, b, u) => [(1 - u) ** 2 * a[0] + 2 * u * (1 - u) * c[0] + u * u * b[0], (1 - u) ** 2 * a[1] + 2 * u * (1 - u) * c[1] + u * u * b[1]];

export default async (T, R) => {
  const G = (p, n = 0, after) => T.G(p, n, after), GE = (p, n = 0, after) => T.GE(p, n, after);
  const A = {
    every: G('Every generation before yours'), die: G('had to die'), yours: G('Yours may be'), wont: G("that won't"), labs: G('Because labs'),
    eng: G('an engineering problem'), point: G("And they've pointed"), picture: G('So picture the day'), offer: G('The offer is in front'),
    aging: G('No more aging'), endDate: G('No end date'), yesno: G('Yes, or no'), q: G('If you could stop dying'), most: G('Most people say no'),
    wait: G("But the labs aren't"), copy: G('Some want to copy'), into: G('into a computer'), started: G("And they've started"), fly: G('With a fly'),
    real: G("A real fly's brain"), wire: G('wire by wire'), year: G('This year, a simple'), model: G('computer model'), steer: G('began to steer'),
    body: G('a virtual body'), second: G("There's a second way"), closer: G('Closer'), repair: G('Repair the body'), date: G('And it comes with a date'),
    y2032: G('Twenty thirty-two'), end: R.b,
  };
  A.wontW = T.G("won't", 0, A.yours);
  const tP = A.end - S.SEAM_HALF;
  const lab = (t, a, b) => span(t, a, a + .7) * (1 - span(t, b - .45, b + .1));

  // ---------------------------------------------------------------- the view (sheet units), one path for the whole take
  const VIN = { x: 1500, y: 702, s: 7.4 };   // inside the computer screen
  const VD = [
    [0, { x: 960, y: 540, s: 1 }], [A.yours, { x: 1040, y: 548, s: 1.05 }], [A.labs, { x: 1180, y: 560, s: 1.13 }],
    [A.eng + .2, { x: 1150, y: 562, s: 1.04 }], [A.point - .1, { x: 975, y: 662, s: .99 }], [A.picture, { x: 955, y: 664, s: 1.02 }],
    [A.offer + .3, { x: 925, y: 640, s: 1.16 }], [A.aging - .1, { x: 945, y: 656, s: 1.05 }], [A.yesno, { x: 985, y: 650, s: 1.03 }],
    [A.q + .3, { x: 975, y: 600, s: 1.12 }], [A.wait - .1, { x: 970, y: 606, s: 1.17 }], [A.copy, { x: 985, y: 664, s: 1.0 }],
    [A.started, { x: 1230, y: 676, s: 1.24 }], [A.fly + .2, { x: 1440, y: 690, s: 1.7 }], [A.real + .3, VIN], [A.second - .2, { ...VIN, s: 7.9 }],
    [A.closer - .1, { x: 1010, y: 672, s: 1.06 }], [A.date, { x: 1000, y: 670, s: 1.05 }], [tP, Q.view],
  ];
  const view = (t) => { const v = X.viewPath(t, VD), b = S.breathe(t), k = 1 - span(v.s, 2.2, 6.5) * .9; return { x: v.x + b.dx * k, y: v.y + b.dy * k, s: v.s }; };
  // the ground's pool of light: on the stone (1440, 560) → on the line → on the plate (1040, 686)
  const PK = [[0, [1440, 560, .85]], [A.point, [1300, 660, .7]], [A.offer, [960, 560, .9]], [A.copy, [1240, 640, .85]], [A.started, [1500, 690, 1]], [A.closer, [1040, 686, 1]], [tP, [Q.year, 686, 1]]];
  const pool = (t) => { let i = 0; while (i < PK.length - 2 && t > PK[i + 1][0]) i++; const [t0, a] = PK[i], [t1, b] = PK[i + 1], u = sineIO(span(t, t0, t1)); return a.map((x, j) => lerp(x, b[j], u)); };

  // ---------------------------------------------------------------- states over time
  const drawU = (t) => span(t, A.labs + .3, A.eng + .6);                       // the stone turns into a drawing
  const dashK = (t) => span(t, A.eng + 1.2, A.point + .35);                     // the dash drops and stretches into the line
  const retract = (t) => span(t, A.eng + 1.0, A.point + .5);                    // the world sinks away
  const youX = (t) => { if (t < A.picture) return S.YOU.x; if (t < A.copy - .2) return lerp(S.YOU.x, 900, sineIO(span(t, A.picture + .1, A.picture + 2.2))); return lerp(900, Q.you, sineIO(span(t, A.copy - .2, A.copy + 2.4))); };
  const youWalk = (t) => { const w1 = span(t, A.picture + .1, A.picture + 2.2), w2 = span(t, A.copy - .2, A.copy + 2.4); return (w1 > 0 && w1 < 1) || (w2 > 0 && w2 < 1) ? t * 6.2 : undefined; };
  const youDir = (t) => (t > A.copy - .2 && t < A.copy + 2.4 ? -1 : 1);
  const ring = (t) => {   // the AI ring: rises behind the line, hovers, sinks and becomes the computer
    const up = expoOut(span(t, A.point - .1, A.point + 1.3)), down = quartIO(span(t, A.into - .4, A.into + .6));
    return { x: 1500, y: lerp(lerp(LY + 80, 330, up), 700, down), r: lerp(56, 30, down), u: up * (1 - span(t, A.into + .2, A.into + .7)), think: .5 + 1.6 * span(t, A.wait, A.wait + 1) * (1 - span(t, A.copy, A.copy + 1)) };
  };
  const BEAM_X = (t) => (t < A.wait ? 1700 : 1700 - 420 * Math.sin(Math.PI * span(t, A.wait + .4, A.copy + .4)));

  // ---------------------------------------------------------------- stage A: the stone (H.01–H.03)
  function stoneStage(ctx, t, v) {
    const ret = retract(t), drw = drawU(t);
    S.stoneWorld(ctx, t, v, {
      ground: false, crack: .12 + .88 * expoOut(span(t, A.wontW - .05, A.wontW + .55)) - .3 * drw, crackDrain: span(t, A.eng + .6, A.eng + 1.8),
      drawing: drw, retract: ret, dash: dashK(t) <= 0, old: 1, you: { y: lerp(S.hillY(S.YOU.x) + 2, LY - 2, sineIO(ret)) },
    });
    // the title rises with the first words and sinks before "Yours"
    F.title(ctx, t, span(t, .15, 1.4), { out: span(t, A.yours - .6, A.yours + .5) });
    // AN ENGINEERING PROBLEM over the drawing
    X.inView(ctx, v, () => X.label(ctx, SRC.engineering, S.STONE.x, S.STONE.top - 34, lab(t, A.eng - .1, A.point + .2), { size: 30, spacing: .16 }));
  }

  // ---------------------------------------------------------------- the dash → the lifeline (from H.03 on)
  function lineOpts(t) {
    const k = dashK(t), ky = sineIO(span(k, 0, .45)), kx = quartIO(span(k, .25, 1));
    const { dash, y } = S.ENGRAVE, x1 = lerp(dash[1], Q.x1, kx), ageU = 1 - span(t, A.aging + .1, A.aging + 1.1);
    return { u: k > 0 ? 1 : 0, x0: lerp(dash[0], Q.x0, kx), x1, y: lerp(y - 21, LY, ky), age: lerp(x1, Q.age, kx), ageU: ageU * kx, end: span(k, .7, 1),
      lift: span(t, A.endDate + .1, A.endDate + .9), open: span(t, A.endDate + .25, A.endDate + 1.6), openTo: Q.openTo, glow: .6 + .4 * kx };
  }
  function line(ctx, t, s) { const L = lineOpts(t); if (L.u > 0) X.lifeline(ctx, t, L.x0, L.x1, L.y, s, L); }
  // 1985 leaves the stone and lands as the line's first year
  function year1985(t) { return span(t, A.point - .2, A.point + .6); }
  function flyingYear(ctx, t, s) {
    const k = span(t, A.eng + 1.3, A.point - .15); if (k <= 0 || k >= 1) return;
    const u = quartIO(k), p = quad([S.ENGRAVE.x + 2, S.ENGRAVE.y], [700, 420], [Q.x0, LY + 16 + 34 * 1.05], u), size = lerp(S.ENGRAVE.size, 34, u);
    F.goldText(ctx, [['1985', .2 * (1 - u)]], p[0], p[1], size, 1, { serif: true, align: 'center' });
  }

  // ---------------------------------------------------------------- the stage (H.03 → H.20), drawn through draw2032 so it lands on the plate
  function stage(ctx, t, v) {
    const r = ring(t), on = span(t, A.started, A.started + .5), comp = span(t, A.into + .1, A.into + .8);
    const inside = span(v.s, 2.5, 6.5);   // 0 outside the screen … 1 inside
    S.draw2032(ctx, t, v, {
      pool: pool(t),
      line: lineOpts(t),
      year1985: year1985(t),
      body: { u: span(t, A.closer - .1, A.closer + 1.1), fix: span(t, A.repair + .2, A.repair + 2.1), worn: 1 - span(t, A.repair + .2, A.repair + 2.1) },
      repair: lab(t, A.repair, 1e9), tick: span(t, A.date + .7, A.date + 1.3), y2032: span(t, A.y2032 - .05, A.y2032 + .8),
      comp: { u: comp, on: on * (1 - .55 * inside) }, fly: { u: span(t, A.body - .3, A.body + .4), ...flyState(t) },
      copy: lab(t, A.second + .9, 1e9), you: { x: youX(t), dir: youDir(t), walk: youWalk(t), a: 1 - inside, h: lerp(S.YOU.h, 92, sineIO(span(t, A.picture + .1, A.offer + .4))) },
      mid: (c, s) => {
        flyingYear(c, t, s);
        // H.19: a gold tick falls onto the line between REPAIR and COPY (and the line flashes where it lands)
        const td = span(t, A.date + .2, A.date + .75); if (td > 0 && td < 1) { const yy = lerp(LY - 260, LY, expoIn(td)); c.fillStyle = GOLD.body; c.fillRect(Q.year - 2 / s, yy - 16 / s, 4 / s, 32 / s); halo(c, Q.year, yy, 40 / s, .6, GOLD.halo, GOLD.core); }
        const land = F.bump(t, A.date + .7, 1.2); if (land > 0) halo(c, Q.year, LY, 160 / s, .7 * land, GOLD.halo, GOLD.core);
        // the AI ring + its beam on the end tick (H.04 → H.10)
        if (r.u > 0) { const bu = span(t, A.point + .6, A.point + 1.4) * (1 - span(t, A.copy, A.copy + .8)) * (1 - span(t, A.endDate, A.endDate + 1.2) * .55);
          F.beam(c, r.x, r.y, BEAM_X(t), LY, bu, { s, w: 46 }); F.aiRing(c, t, r.x, r.y, r.r, { u: r.u, think: r.think, s });
          X.label(c, SRC.ai, r.x + r.r + 46, r.y + 10, lab(t, A.point + .9, A.yesno), { size: 26, col: COOL.text }); }
        // the head rises out of the line (H.11) and hands the mind to the computer
        const hu = span(t, A.copy + .4, A.copy + 1.8), hout = span(t, A.started + .3, A.fly);
        if (hu > 0 && hout < 1) { c.save(); c.globalAlpha *= 1 - hout; const hd = F.headProfile(c, t, 1180, LY - 2, 210, { u: hu, s });
          const pu = span(t, A.into + .5, A.started + .3), mid = [1340, 600];
          if (pu > 0) { const pts = Array.from({ length: 21 }, (_, i) => quad(hd.mind, mid, [Q.comp, 702], i / 20));
            X.drawPath(c, pts, pu, { col: rgba(COOL.line, .9), w: 2.4 / s, dash: [10 / s, 8 / s], glow: 8 / s, glowCol: COOL.halo });
            const hp = pts[Math.min(20, Math.floor(pu * 20))]; halo(c, hp[0], hp[1], 40 / s, .8 * (1 - span(pu, .9, 1)), COOL.halo, COOL.core); }
          c.restore(); }
        X.label(c, SRC.copyMind, 1180, LY - 268, lab(t, A.copy + .9, A.fly), { size: 28, col: COOL.text });
      },
      top: (c, s) => { brain(c, t, s); offerAndAnswer(c, t, s); },   // the brain map (★ H.14) + the model (H.15) live in the screen, over it
    });
    // screen-space texts (≥ 22 px): the brain map labels, sources
    const lm = lab(t, A.real + .9, A.year - .1), lmod = lab(t, A.year + .6, A.second + .1);
    X.label(ctx, SRC.flyMap, W / 2, 150, lm, { size: 34, spacing: .14 });
    X.label(ctx, SRC.flyModel, W / 2, 150, lmod, { size: 34, spacing: .12, col: COOL.text });
    if (lm > 0) F.source(ctx, t, A.real + 1.2, A.year - .1, SRC.flyMapSrc);
    if (lmod > 0) F.source(ctx, t, A.year + .9, A.second + .1, SRC.flyModelSrc);
    if (t > A.most && t < A.wait + 2.6) F.source(ctx, t, A.most + .4, A.wait + 2.4, SRC.pew2013);
  }
  function flyState(t) {   // the real fly (H.13), the virtual one (H.15 →): position and size in the screen
    if (t < A.year) return { x: Q.comp, y: 704, size: 12 + 6 * span(t, A.fly, A.real) };
    const k = sineIO(span(t, A.body - .3, A.body + 1.2)), back = sineIO(span(t, A.second, A.second + 1.8));
    return { x: lerp(lerp(1546, 1528, k), Q.comp, back), y: lerp(708, 706, back), size: lerp(24, 40, back) };
  }
  function brain(c, t, s) {
    const u = span(t, A.real + .3, A.wire + 1.1), out = span(t, A.second - .3, A.second + .6); if (out >= 1) return;
    const sm = sineIO(span(t, A.year + .1, A.model + .3)), x = lerp(Q.comp, 1462, sm), y = lerp(698, 690, sm), sz = lerp(82, 34, sm);
    c.save(); c.globalAlpha *= 1 - out;
    // the real fly is the start: it sits where the map grows and fades into it
    const fu = span(t, A.fly, A.fly + .4) * (1 - span(t, A.real + .2, A.real + 1));
    if (fu > 0) F.fly(c, t, Q.comp, 704, 12 + 6 * span(t, A.fly, A.real), { style: 'real', s, a: fu, groom: .4 + .4 * Math.sin(t * 2), rot: -.2 });
    if (u > 0) F.flyBrain(c, t, x, y, sz, { u, s, col: span(t, A.model - .2, A.model + .6) > .5 ? 'cool' : 'gold', fire: span(t, A.steer, A.steer + .6) });
    c.restore();
  }
  // H.06–H.10: the offer card, the answer, the question
  function offerAndAnswer(c, t, s) {
    const cu = span(t, A.offer + .1, A.offer + 1.0), fold = quartIO(span(t, A.yesno - .2, A.yesno + .6));
    const cx = 960, cy = 520, w = 520, h = 214;
    if (cu > 0 && fold < 1) {
      c.save(); c.translate(cx, cy); c.scale(1 - .1 * fold, 1 - fold); c.translate(-cx, -cy); c.globalAlpha *= 1 - span(fold, .6, 1);
      F.paperCard(c, t, cx - w / 2, cy - h / 2, w, h, { u: cu, head: SRC.offerHead, rot: -.008 });
      const l1 = F.rise(span(t, A.aging - .1, A.aging + .5)), l2 = F.rise(span(t, A.endDate - .1, A.endDate + .5));
      const g1 = span(t, A.aging + .1, A.aging + .9), g2 = span(t, A.endDate + .1, A.endDate + .9);
      F.goldText(c, [[SRC.offer[0], 0]], cx - w / 2 + 34, cy + 12, 40, l1, { serif: false, weight: 700, col: mixHex(F.PAPER.ink, GOLD.deep, g1) });
      F.goldText(c, [[SRC.offer[1], 0]], cx - w / 2 + 34, cy + 66, 40, l2, { serif: false, weight: 700, col: mixHex(F.PAPER.ink, GOLD.deep, g2) });
      c.restore();
    }
    // THE ANSWER: born where the card folds; the bead trembles, then slides to NO; lifts away when the labs don't wait
    const au = span(t, A.yesno + .1, A.yesno + 1.0), away = quartIO(span(t, A.wait + .5, A.copy - .1)); if (au <= 0 || away >= 1) return;
    const p = -.72 * expoOut(span(t, A.most + .15, A.most + 1.2)) + .04 * Math.sin(t * 1.3);
    c.save(); c.globalAlpha *= 1 - away; const ay = cy + 10 - away * 160;
    F.answer(c, t, cx, ay, w, p, { u: au, tremble: 5 * span(t, A.q, A.q + .6) * (1 - span(t, A.most, A.most + .6)) });
    X.big(c, SRC.question, cx, ay - 116, 66, span(t, A.q - .05, A.q + .9), { gold: .12, glow: false });
    c.restore();
  }

  // ---------------------------------------------------------------- the take
  function hook(ctx, t) {
    const v = view(t);
    if (t < A.point + .6) {
      X.ground(ctx, t, v, (([lx, ly, pl]) => ({ lx, ly, pool: pl }))(pool(t)));
      stoneStage(ctx, t, v);
      if (dashK(t) > 0) X.inView(ctx, v, (s) => { line(ctx, t, s); flyingYear(ctx, t, s); });
      return;
    }
    stage(ctx, t, v);
  }
  const draw = (ctx, t) => hook(ctx, t);
  const marks = [0, A.yours, A.labs, A.point, A.picture, A.offer, A.yesno, A.q, A.most, A.wait, A.copy, A.started, A.fly, A.real, A.year, A.second, A.closer, A.repair, A.date, A.y2032];
  return [...marks.map((t) => ({ t, draw, print: PR })), { t: tP, draw: (ctx, t) => S.plate2032(ctx, t, T), print: PR }];
};
