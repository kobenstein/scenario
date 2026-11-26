// c07 · B2 · THE ROOM (Rushkoff, 2017) · 'Some years ago' → 'But look at what gets planned' (inner seam to c08: B.plateSplit).
// Opens on the film's 2nd planned world change (W, shots.md 4.01): a hard cut from the city's last lit window (end of c06) to the lit
// window of a low desert resort at the same spot on screen, the ground line at the same height. Then one take: the window opens into the
// room (a masked fly-through, no zoom), the lamp's pool grows into the clip plate (C3), the plate shrinks into a banknote, the banknote
// turns over ("THE EVENT"), folds flat into a sketch line (the guards, the bunker, the far lanterns), the sketch sinks and three cards
// slide out of the table, slide back; the five lean back; the room contracts into a box: INVESTORS | AI BUILDERS → B.plateSplit.
// People only as calm silhouettes (the five from behind / against the light, never faces, never villains); no red anywhere.
//
// | ID    | anchor (phrase)                | zeigt wörtlich                                        | picture                                                                         | layer |
// |-------|--------------------------------|-------------------------------------------------------|---------------------------------------------------------------------------------|-------|
// | 4.01 W| Some years ago                 | Rushkoff was brought to a luxury resort               | the desert at night: a car's lights on the road to a low resort with palms: DOUGLAS RUSHKOFF · 2017 | MIX |
// | 4.02  | Instead of an audience         | five very rich investors instead of an audience       | the resort window opens into the room: rows of empty chairs, an empty lectern; five at a small table: FIVE INVESTORS | MIX |
// | 4.03  | Here's what they really        | what they wanted to know                              | the lamp's pool on the table grows into the clip plate                         | MIX   |
// | 4.04  | slot:C3                        | (Rushkoff: "… once my money is worthless?")          | C3 · DOUGLAS RUSHKOFF · ORIGINAL FOOTAGE (marked placeholder until the frames exist) | CLIP |
// | 4.05  | Once money is worthless        | once money is worthless                               | the plate shrinks into a banknote; its print fades, it floats, weightless: ONCE MONEY IS WORTHLESS | EXPL |
// | 4.06  | They called that day           | "the Event", the day everything breaks down           | the note turns over: “THE EVENT”; five tags drop: COLLAPSE · UNREST · NUCLEAR · VIRUS · HACK (+ source) | EXPL |
// | 4.07  | They knew they'd need          | armed guards against "the angry mobs"                 | the note folds flat into a sketch line: a bunker drawn under it, two guards; far left lanterns: “THE ANGRY MOBS” | MIX |
// | 4.08  | But after the Event            | why would the guards still obey?                      | the two guards turn slowly to the entrance; a ? rises                           | MIX   |
// | 4.09  | They had ideas                 | they had ideas                                        | the sketch sinks; three cards slide out of the table                            | MIX   |
// | 4.10  | Special locks                  | locks on the food supply                              | card 1 lights: a food store with a padlock (+ the quote)                        | EXPL  |
// | 4.11  | Disciplinary collars           | disciplinary collars                                  | card 2: a plain ring (+ the quote)                                              | EXPL  |
// | 4.12  | Robots as guards               | robots as guards                                      | card 3: the words only (no robot drawn)                                         | EXPL  |
// | 4.13  | Rushkoff offered               | Rushkoff offered a different answer                   | the cards slide back; a small figure at the table end, an empty speech line     | MIX   |
// | 4.14  | They rolled their eyes         | they rolled their eyes                                | the five lean back                                                              | SCENE |
// | 4.15  | That's his account             | that's his account                                    | a tag over the scene: HIS ACCOUNT (+ source: never named, his own account)      | EXPL  |
// | 4.16  | The men were never named       | never named                                           | five blank name cards on the table                                              | EXPL  |
// | 4.17  | And they were investors        | investors, not the people who build AI                | the room contracts into a box: INVESTORS; the glass room rises: AI BUILDERS; a dividing line → plateSplit | EXPL |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f72_kit.mjs';
import * as S from '../lib/f72_world.mjs';
import * as X from '../lib/f72_stage.mjs';
import * as B from '../lib/b2_parts.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, expoIn, halo } = E;
const { GOLD, COOL, CREAM, PAPER, SOURCES: SRC } = F;
const PR = F.PRINT72, LY = X.LINE_Y, TAU = Math.PI * 2;
const NOTE = { x: 960, y: 330, w: 560, h: 260 };
const CARDS = [[440, 350, -.02], [900, 362, .015], [1360, 346, -.01]], CW = 400, CH = 250;

export default async (T, R) => {
  const G = (p, n = 0, after = R.a - 1) => T.G(p, n, after);
  const C3 = T.clip('C3');
  const A = {
    some: R.a, resort: G('luxury resort'), talk: G('give a talk'), instead: G('Instead of an audience'), five: G('five very rich'), walked: G('walked in'),
    here: G("Here's what they"), tells: G('as he tells'), once: G('Once money'), worthless: G('worthless'), called: G('They called that day'), event: G('the Event'),
    day: G('The day everything'), knew: G('They knew'), guards: G('armed guards'), mobs: G('the angry mobs'), after: G('But after the Event'), obey: G('still obey'),
    ideas: G('They had ideas'), locks: G('Special locks'), collars: G('Disciplinary collars'), robots: G('Robots as guards'), offered: G('Rushkoff offered'),
    rolled: G('They rolled their eyes'), account: G("That's his account"), named: G('The men were never named'), investors: G('And they were investors'),
    build: G('not the people who build'), end: R.b,
  };
  const tP = A.end - S.SEAM_HALF;
  const PHRASE78 = 'But look at what gets planned';

  // ---------------------------------------------------------------- 4.01 the exterior (the W cut lands on the resort window)
  const [wsx, wsy] = B.lastWindowScreen();
  const V7 = { x: 1040, y: B.C06_END.view.y, s: B.C06_END.view.s };
  const winSheet = X.toSheet(V7, wsx, wsy), RW = 460, RX0 = winSheet[0] - RW * B.RESORT_WIN.dx - B.RESORT_WIN.w / 2;
  const VD = [[A.some, V7], [A.some + 3.4, { x: RX0 + RW * .45, y: 470, s: 1.18 }], [A.instead, { x: RX0 + RW * .5, y: 466, s: 1.22 }]];
  // out of the W cut with the same push c06 arrived with (B.W_PUSH per second), handed over to the glide
  const leave = (t) => 1 + B.W_PUSH * (t - A.some) * (1 - sineIO(span(t, A.some, A.some + 2)));
  const view = (t) => { const v = X.viewPath(t, VD), b = S.breathe(t); return { x: v.x + b.dx, y: v.y + b.dy, s: v.s * leave(t) }; };
  const carX = (t) => lerp(RX0 - 900, RX0 - 60, ((u) => .5 * (u + sineIO(u)))(span(t, A.some, A.instead - .6)));
  function exterior(ctx, t, v) {
    X.ground(ctx, t, v, { lx: RX0 + RW * .6, ly: 430, pool: .85 });
    X.inView(ctx, v, (s) => {
      // far dunes on the line (soft, dark), the road (a faint dashed line just under the ground line), palms, the resort, the car
      ctx.fillStyle = E.lin(ctx, 0, LY - 90, 0, LY, [[0, mixHex(P.night1, P.ind1, .5)], [1, mixHex(P.night1, P.ind2, .6)]]);
      ctx.beginPath(); ctx.moveTo(RX0 - 2400, LY); for (let x = RX0 - 2400; x <= RX0 + 2400; x += 60) ctx.lineTo(x, LY - 26 - 30 * Math.max(0, Math.sin(x * .0021 + 1)) - 12 * Math.sin(x * .007)); ctx.lineTo(RX0 + 2400, LY); ctx.fill();
      X.drawPath(ctx, [[RX0 - 2400, LY + 18], [RX0 + 30, LY + 18]], 1, { col: rgba(CREAM, .25), w: 1.6 / s, dash: [18 / s, 14 / s] });
      for (const [dx, h, ph] of [[-70, 170, 0], [-30, 130, 1.3], [RW + 40, 190, 2.2], [RW + 95, 140, .7], [RW * .35, 150, 3.1]]) B.palm(ctx, RX0 + dx, LY, h, ph, t);
      B.resort(ctx, t, RX0, LY, RW, { s });
      B.car(ctx, t, carX(t), LY + 10, span(t, A.some - .1, A.some + .5) * (1 - span(t, A.instead - .5, A.instead + .2)), { s });
      X.dateTag(ctx, `${B.LOCAL.rushkoff} · ${SRC.y2017}`, RX0 + RW * .5, LY - 200, B.lab(t, A.some + 1.6, A.instead + .6));
    });
  }

  // ---------------------------------------------------------------- the room box: window → full frame → (4.17) the split box
  const winRect = (v) => { const [x0, y0] = X.toScreen(v, RX0 + RW * B.RESORT_WIN.dx, LY - B.RESORT_WIN.dy); return { x: x0, y: y0, w: B.RESORT_WIN.w * v.s, h: B.RESORT_WIN.h * v.s }; };
  const FULL = (t) => { const b = S.breathe(t); return { x: -30 + b.dx, y: -20 + b.dy, w: W + 60, h: H + 40 }; };
  const L4 = (a, b, u) => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), w: lerp(a.w, b.w, u), h: lerp(a.h, b.h, u) });
  const openU = (t) => sineIO(span(t, A.instead - .35, A.instead + 1.45));
  const t17 = A.investors + .05, closeU = (t) => sineIO(span(t, t17, t17 + 1.7));
  const SV = (t) => B.splitView(t, T, PHRASE78, 1);
  const splitBox = (t) => { const v = SV(t), [x0, y0] = X.toScreen(v, B.SPLIT.box.x, B.SPLIT.box.y); return { x: x0, y: y0, w: B.SPLIT.box.w * v.s, h: B.SPLIT.box.h * v.s }; };

  // ---------------------------------------------------------------- states inside the room
  const lean = (t) => sineIO(span(t, A.rolled + .05, A.rolled + .8)) * (1 - sineIO(span(t, A.named - .3, A.named + .9)));
  const nameU = (t) => span(t, A.named + .15, A.named + 1.2);
  const ruU = (t) => span(t, A.offered - .1, A.offered + .7);
  const extra = (t) => (ctx) => {   // Rushkoff at the table end (4.13), his speech line (drawn, no words: we don't hear his answer yet)
    const u = ruU(t); if (u <= 0) return; const tb = B.ROOM.table, x = 1650;
    ctx.save(); ctx.globalAlpha *= clamp(u * 2); halo(ctx, x, B.ROOM.floor - 90, 120, .25 * u, F.LAMP.body, F.LAMP.core);
    F.person(ctx, x, B.ROOM.floor, 150 * (.9 + .1 * expoOut(u)), { pose: 'stand', dir: -1, light: 1, rim: GOLD.line }); ctx.restore();
    const sp = span(t, A.offered + .5, A.offered + 1.6) * (1 - span(t, A.rolled + .2, A.rolled + .9));
    if (sp > 0) X.drawPath(ctx, F.arcPts(x - 130, B.ROOM.floor - 150, 110, 40, -.2, -Math.PI + .2, 20), sineIO(sp), { col: rgba(CREAM, .7), w: 2.2, dash: [10, 8] });
  };
  const onTable = (t) => B.nameCards(nameU(t));

  // the clip plate (C3) out of the lamp's pool, back into the banknote
  const plateIn = (t) => sineIO(span(t, A.tells - .3, C3.start));
  const plateOut = (t) => sineIO(span(t, C3.end - .15, A.once + .1));
  const noteRect = { x: NOTE.x - NOTE.w / 2, y: NOTE.y - NOTE.h / 2, w: NOTE.w, h: NOTE.h };
  const noteU = (t) => t >= A.once + .1;
  const noteFloat = (t) => { const q = Math.max(0, t - A.once); return { dx: Math.sin(q * .9) * 10 * span(t, A.once, A.once + 1), dy: q * 3.5 * (1 - span(t, A.knew, A.knew + 1)), rot: Math.sin(q * 1.1) * .03 * span(t, A.once + .3, A.once + 1.3) }; };
  const flipU = (t) => quartIO(span(t, A.called + .05, A.called + .8));
  const foldU = (t) => sineIO(span(t, A.knew - .2, A.knew + .7));          // the note folds flat into the sketch line
  const SKY = 530;   // the sketch line (screen y)
  const sketchU = (t) => span(t, A.knew + .4, A.knew + 1.4) * (1 - span(t, A.ideas - .3, A.ideas + .4));
  const guardsU = (t) => span(t, A.guards - .3, A.guards + .5) * (1 - span(t, A.ideas - .3, A.ideas + .3));
  const turnU = (t) => sineIO(span(t, A.after + .4, A.obey + .9));
  const cardU = (i) => (t) => B.riseSink(span(t, A.ideas + .2 + i * .14, A.ideas + 1.0 + i * .14), span(t, A.offered - .4 + i * .08, A.offered + .3 + i * .08));
  const litT = [A.locks, A.collars, A.robots];

  function sketch(ctx, t) {   // 4.07–4.08: a line drawing on the wall over the empty chairs
    const su = sketchU(t), fu = foldU(t); if (fu <= 0) return;
    const x0 = lerp(NOTE.x - NOTE.w / 2, 230, sineIO(span(t, A.knew + .2, A.knew + 1.2))), x1 = lerp(NOTE.x + NOTE.w / 2, 1180, sineIO(span(t, A.knew + .2, A.knew + 1.2)));
    const out = span(t, A.ideas - .3, A.ideas + .4);
    if (out >= 1) return;
    ctx.save(); ctx.globalAlpha *= 1 - out;
    X.drawPath(ctx, [[x0, SKY], [x1, SKY]], 1, { col: rgba(CREAM, .8), w: 2.4, glow: 5, glowCol: GOLD.line });
    // the bunker drawn under the line (cream outline): a shaft, a room
    const bx = 700, bu = sineIO(su);
    X.drawPath(ctx, [[bx - 22, SKY], [bx - 22, SKY + 70], [bx - 90, SKY + 70], [bx - 90, SKY + 150], [bx + 150, SKY + 150], [bx + 150, SKY + 70], [bx + 22, SKY + 70], [bx + 22, SKY]], bu, { col: rgba(CREAM, .7), w: 2, dash: [9, 6] });
    if (bu > .2) { ctx.save(); ctx.globalAlpha *= span(bu, .2, 1); F.hatch(ctx, t, bx, SKY, 70, { tilt: .075, open: 0, glow: .2 }); ctx.restore(); }
    // two guards (calm, plain standing figures; "armed" stays a word in the VO), facing out, then turning to the entrance
    const gu = guardsU(t), tu = turnU(t);
    if (gu > 0) for (const [gx, d] of [[590, -1], [810, 1]]) B.riseFrom(ctx, SKY, 150, gu, () => B.turned(ctx, gx, tu, () => F.person(ctx, gx, SKY, 128, { pose: 'stand', dir: d, light: -d, rim: mixHex(CREAM, GOLD.line, .3) })));
    const qm = B.lab(t, A.obey - .3, A.ideas - .1);
    if (qm > 0) F.goldText(ctx, [['?', .1]], bx, SKY - 170, 96, F.rise(qm), { serif: true, align: 'center', col: CREAM });
    // far left: small people with lanterns (the "mobs": just people)
    const mu = span(t, A.mobs - .5, A.mobs + .5);
    if (mu > 0) F.lanternRow(ctx, t, 250, 470, SKY, 6, { h: 58, u: mu, seed: 7701 });
    X.label(ctx, SRC.mobs, 360, SKY - 96, B.lab(t, A.mobs - .1, A.ideas), { size: 28, gold: .4 });
    ctx.restore();
  }
  // the three sketch cards (4.09–4.12)
  const cardDraw = [
    (ctx, u) => { if (u <= 0) return; ctx.save(); ctx.globalAlpha *= u; const k = PAPER.ink;   // a food store in section + a padlock
      ctx.strokeStyle = rgba(k, .6); ctx.lineWidth = 2; ctx.strokeRect(-120, -100, 170, 100); ctx.beginPath(); ctx.moveTo(-120, -66); ctx.lineTo(50, -66); ctx.moveTo(-120, -33); ctx.lineTo(50, -33); ctx.stroke();
      ctx.fillStyle = rgba(F.CONCRETE.shade, .7); for (let i = 0; i < 6; i++) { ctx.fillRect(-112 + i * 26, -86, 18, 18); ctx.fillRect(-112 + i * 26, -53, 18, 18); }
      ctx.strokeStyle = PAPER.ink; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(100, -62, 18, Math.PI, 0); ctx.stroke(); ctx.fillStyle = mixHex(PAPER.ink, GOLD.deep, .4); ctx.beginPath(); ctx.roundRect(74, -64, 52, 44, 6); ctx.fill(); ctx.restore(); },
    (ctx, u) => { if (u <= 0) return; X.drawPath(ctx, F.arcPts(0, -54, 70, 34, -Math.PI / 2, Math.PI * 1.5, 40), u, { col: PAPER.ink, w: 7 }); },
    null,
  ];
  function cards(ctx, t) {
    CARDS.forEach(([x, y, r], i) => { const u = cardU(i)(t); if (u <= 0) return;
      const tb = B.ROOM.table, k = expoOut(clamp(u)), cx = lerp(tb.x - 60 + i * 30, x, k), cy = lerp(tb.y - 20, y, k), sc = .25 + .75 * k;
      ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc); ctx.translate(-cx, -cy);
      B.sketchCard(ctx, t, cx, cy, CW, CH, 1, i === 2 ? '' : SRC.ideas[i], cardDraw[i], { rot: r, a: clamp(u * 3), lit: span(t, litT[i] - .1, litT[i] + .5) * (1 - span(t, litT[i] + 2.0, litT[i] + 2.6)) });
      if (i === 2) { const L = B.wrap(SRC.ideas[2], 34, CW - 60), wu = span(t, A.ideas + .6, A.ideas + 1.4); ctx.translate(cx, cy); ctx.rotate(r); ctx.globalAlpha *= clamp(u * 3);
        L.forEach((ln, j) => F.maskLine(ctx, [[ln, 0]], -CW / 2 + 30, -CH / 2 + 62 + j * 44, 34, F.rise(span(wu, j * .15, 1)), { serif: false, weight: 700, col: mixHex(PAPER.ink, GOLD.deep, span(t, A.robots - .1, A.robots + .5) * (1 - span(t, A.robots + 2, A.robots + 2.6))), glow: false })); }
      ctx.restore();
    });
  }
  function roomOverlays(ctx, t) {
    // the clip plate
    const pi = plateIn(t), po = plateOut(t);
    if (pi > 0 && po < 1) {
      const pool = state.pool; const from = po > 0 ? noteRect : pool;
      F.clipPlate(ctx, t, T, 'C3', { from, morph: po > 0 ? 1 - po : pi, dark: po > 0 ? po : 0 });
    }
    // the banknote → THE EVENT → folds flat
    if (noteU(t) && foldU(t) < 1) {
      const f = noteFloat(t), fu = foldU(t);
      ctx.save(); ctx.translate(NOTE.x + f.dx, NOTE.y + f.dy); ctx.scale(1, Math.max(.01, 1 - fu)); ctx.translate(-NOTE.x - f.dx, -NOTE.y - f.dy);
      if (fu > 0) ctx.translate(0, (SKY - NOTE.y - f.dy) * fu);
      B.banknote(ctx, t, NOTE.x + f.dx, NOTE.y + f.dy, NOTE.w, NOTE.h, { print: 1 - span(t, A.once + .4, A.worthless + .6), thin: span(t, A.worthless, A.called), rot: f.rot, flip: flipU(t), backText: SRC.theEvent, backSize: 92, fill: mixHex(P.night0, P.ind0, .4), lw: lerp(2, 3, span(t, A.once + .1, A.once + .6)) });
      ctx.restore();
      // the five tags drop from the note (4.06 "the day everything breaks down")
      B.LOCAL.event5.forEach((txt, i) => { const u = span(t, A.day + .1 + i * .12, A.day + .7 + i * .12) * (1 - span(t, A.knew - .2, A.knew + .3)); if (u <= 0) return;
        const x = NOTE.x - 440 + i * 220, y = NOTE.y + NOTE.h / 2 + 70 + f.dy; X.dateTag(ctx, txt, x, lerp(NOTE.y + NOTE.h / 2 - 20 + f.dy, y, expoOut(u)), u); });
    }
    X.big(ctx, SRC.worthless, 960, 128, 64, B.lab(t, A.once - .1, A.called + .1), { gold: .1 });
    sketch(ctx, t);
    cards(ctx, t);
    // tags and labels over the room
    X.label(ctx, B.LOCAL.fiveInv, B.ROOM.table.x, 838, B.lab(t, A.five - .1, A.here + .2), { size: 30, spacing: .14, gold: .5 });
    X.dateTag(ctx, SRC.hisAccount, B.ROOM.table.x, 150, B.lab(t, A.account - .1, A.investors));
  }
  const state = { pool: { x: 1200, y: 660, w: 300, h: 40 } };

  // ---------------------------------------------------------------- the take
  function draw(ctx, t) {
    if (t < A.instead + 1.45) {   // the exterior with the window opening into the room
      const v = view(t); exterior(ctx, t, v);
      const u = openU(t); if (u > 0) { const box = L4(winRect(v), FULL(t), u); const r = B.roomBox(ctx, t, box, { five: 1, frame: 1 - span(u, .7, 1), r: lerp(4, 0, u) }); state.pool = r.pool && L4p(r.map, r.pool); }
      if (u < 1) overlaysOut(ctx, t);
      return;
    }
    if (t < t17) {   // inside the room (full frame)
      const r = B.roomBox(ctx, t, FULL(t), { five: 1, lean: lean(t), onTable: onTable(t), extra: extra(t), frame: 0 }); state.pool = L4p(r.map, r.pool);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); roomOverlays(ctx, t); ctx.restore();
    } else {   // 4.17: the room contracts into the box, the glass room rises, the dividing line
      const u = closeU(t), v = SV(t);
      B.drawSplit(ctx, t, v, { box: L4(FULL(t), splitBox(t), u), focus: u, zoom: lerp(1, 1.9, u), frame: u, lean: lean(t), onTable: onTable(t), extra: extra(t),
        glass: span(t, t17 + .5, t17 + 1.6), div: span(t, t17 + .9, t17 + 2.0), labels: span(t, A.build - .2, A.build + .6) });
    }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (t > C3.start - .5 && t < C3.end + .5) {}   // the clip's own lower third is drawn by F.clipPlate
    if (t > A.day - .2 && t < A.knew + 2) F.source(ctx, t, A.day, A.knew + 1.8, SRC.eventSrc);
    if (t > A.account - .2) F.source(ctx, t, A.account + .2, tP - .05, SRC.fiveMen);
    ctx.restore();
  }
  const overlaysOut = () => {};
  const L4p = (map, p) => { const [x0, y0] = map(p.x, p.y), [x1, y1] = map(p.x + p.w, p.y + p.h); return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }; };
  const marks = [A.some, A.instead, A.here, A.once, A.called, A.knew, A.after, A.ideas, A.offered, A.rolled, A.account, A.investors];
  return [...marks.map((t) => ({ t, draw, print: PR })), { t: tP, draw: (ctx, t) => B.plateSplit(ctx, t, T, PHRASE78), print: PR }];
};
