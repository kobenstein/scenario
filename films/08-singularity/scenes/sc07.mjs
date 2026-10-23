// Film 6 · c07 · §3b end / C6 Hinton / §3c: "Not everyone agrees." … "Not yet."  (03b rest, clip C6, 03c)
// ONE take in one world (lib/f6_c07_world.mjs): a dim room, a dark table with the cards of the maps on it and one desk lamp (the ember),
// beyond the table the tall mirror of the mind on the back wall, empty floor before it. The camera never cuts; every entry draws the same frame.
//
// shot  VO words                                     image                                                          hero light   camera                                  flows on                      ★  sound
// 7.01  Not everyone agrees.                         out of the cream paper: the study page is one of six cards on   lamp         pull out of the page (z 5.05 → 1)       take                             pages
//                                                    the table; three cards turn over: their backs are dark glass                                                                                           card
//                                                    panes where the machine's cool lines write. DAVID CHALMERS ·
//                                                    2023, JOSCHA BACH above them; screen caption MACHINE
//                                                    CONSCIOUSNESS: POSSIBLE · CHALMERS · BACH (written by the line)
// 7.02  One of the fathers of artificial             the third glass card lifts off the table, grows and turns        screen       push into the card (z 1 → 2.2)          take → the pane switches on       whoosh_up
//       intelligence goes much further.              square to us; a cool line appears on its glass
// 7.03  CLIP C6 Hinton (6.7 s)                       the pane is a window on Hinton (1180 px), lower third            screen       hold (float only)                       take                              screen_off (after)
//       GEOFFREY HINTON · NOBEL PRIZE IN PHYSICS 2024 · BIG TECHNOLOGY · JUNE 2026
// 7.04  But many who look closest at feeling, from   the screen goes dark, the card sinks back; the camera returns    lamp/ember   pull back (z 2.2 → 1), drift to the     take                              swell (pause after "alive")
//       monks to brain scientists, tie it to being    to the table and leans toward the monk card (SAMKHYA · VEDANTA)               two cards (z 1.2)
//       alive.                                        and the science card (ANIL SETH): on "monks" the flame on the
//                                                    map lights as an ember, on "brain scientists" the heart on the
//                                                    pulse; on "being alive" both beat together; the glass cards stay cool
// 7.05  So our bet: very probably, no one is         the camera rises to the mirror beyond the table: it gives back   mirror       move up to the mirror (z .95)           take                              shimmer_rings
//       looking into the mirror.                     the lamp, the cards' lights and the dark where a face would be;
//                                                    the heartbeat runs along the mirror's lower edge as an amber pulse line
// 7.06  Not yet.                                     the pulse straightens, goes cream, grows beyond the mirror's      line         hold; then the picture collapses        the old-TV collapse into the      screen_off
//                                                    edges across the whole frame; in the pause the picture collapses              into the line (1.1 s)                  cream line = plate line (c07>c08)
// plates: in = paper cream c06>c07 (the study page's face IS the plate: live until HI.b + 1.6 s, then the same image cached);
//         out = line cream y 620 c07>c08 (the plate is drawn beneath from the collapse's first frame; the band's edges carry the cream line).
// ambience: sfx-bibliothek/atmo/hall (a dim hall, very low).
import { W, H, rgba, clamp, lin, mix, sm, eout, canvas } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { F6, ready, view, camMap, ember, lowerThird } from '../lib/f6_kit.mjs';
import { addGlow } from '../engine.mjs';
import { softShadow, QUART, EXPO_OUT, LAMP, MIRROR, EDGE_Y, CARDS, SLIP, WALL, TBOX, wallLayer, wallWash, tableLayer, cardFace, slipLayer, platePage, cardBack,
  preloadEnds, lamp, motes, mirror, pulseEdge, collapse, caption, cardEmber } from '../lib/f6_c07_world.mjs';

const TAU = Math.PI * 2;

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c07', T);
  const S = (s, p) => T.S(s, p), E = (s, p) => T.E(s, p);
  // ---- anchors (words, never seconds)
  const tAgrees = E('03b', 'agrees'), tOne = S('03b', 'One of'), tAI = S('03b', 'artificial'), tFurther = E('03b', 'further');
  const C6 = T.clip('C6');
  const tBut = S('03c', 'But'), tMonks = S('03c', 'monks'), tBrain = S('03c', 'brain'), tAlive = S('03c', 'being'), tAliveE = E('03c', 'alive');
  const tSo = S('03c', 'So'), tBet = S('03c', 'bet'), tNoOne = S('03c', 'no one'), tMirror = E('03c', 'mirror'), tNot2 = S('03c', 'Not yet'), tYet = E('03c', 'yet');
  const tCache = HI.b + 1.6;                 // the plate is drawn live until here (the camera has pulled out by then), then the same image cached
  const tSq0 = tYet + .12, tSq1 = HO.a - 1 / 30;   // the collapse into the line; at tSq1 the frame IS the plate

  // ---- the camera path (world coords at cam z 1); holds between segments
  const C0 = CARDS[0], C3 = CARDS.find((c) => c.id === 'C3');
  const CAM_A = { x: C0.x, y: C0.y, z: 1920 / C0.w };                  // the page's face fills the frame exactly (the paper plate)
  const CAM_T = { x: 820, y: 700, z: 1 };                               // the table, the lamp, the mirror's lower half
  const LIFT = 1.75, CAM_H = { x: C3.x, y: C3.y - 10 + 80 / 2.25, z: 2.25 };   // the Hinton card at 1181 px, its centre at screen y 460
  const CAM_M = { x: 420, y: 830, z: 1.25 };                             // the monk card and the science card
  const CAM_R = { x: 1380, y: EDGE_Y - 80 / 1.12, z: 1.12 };           // the mirror's lower edge at screen y 620 (the plate's line), the lamp at the left
  const tPush0 = tAI + .5, tPush1 = C6.start - .55;
  const SEGS = [
    [HI.b, HI.b + 1.8, CAM_A, CAM_T, (u) => .92 * QUART(u) + .08 * u],   // no jump out of the plate (expo-out zoomed 20 % in the first frame), never frozen
    [tPush0, tPush1, CAM_T, CAM_H],
    [C6.end + .3, C6.end + 1.7, CAM_H, CAM_T],
    [tBut + 1.2, tBrain + .3, CAM_T, CAM_M],
    [tSo - .2, tBet + .75, CAM_M, CAM_R],
  ];
  const camAt = (t) => {
    let cur = SEGS[0][2];
    for (const [t0, t1, A, B, ease] of SEGS) {
      if (t < t0) break;
      if (t >= t1) { cur = B; continue; }
      const u = (ease || QUART)((t - t0) / (t1 - t0));
      return { x: mix(A.x, B.x, u), y: mix(A.y, B.y, u), z: Math.exp(mix(Math.log(A.z), Math.log(B.z), u)) };
    }
    return cur;
  };

  // ---- the cards' states: the three that turn over (C2, C4, C3), the lift of the Hinton card
  const FLIP = { C2: tAgrees + .02, C4: tAgrees + .14, C3: tAgrees + .26 }, FLIP_D = .5;
  const cardState = (c, t) => {
    const tf = FLIP[c.id], a = tf == null ? 0 : QUART(lin(tf, tf + FLIP_D, t)) * Math.PI, sa = Math.sin(a), ca = Math.cos(a);
    let s = 1, rot = c.rot, dy = -26 * sa;
    if (c.id === 'C3') { const L = QUART(lin(tPush0 + .2, tPush1, t)) * (1 - QUART(lin(C6.end + .4, C6.end + 1.5, t))); s = mix(1, LIFT, L); rot = mix(c.rot, 0, L); dy -= 10 * L; c.lift = L; }
    return { a, sa, ca, s, rot, dy, back: ca < 0, tFlipEnd: tf == null ? 0 : tf + FLIP_D * .5 };
  };
  const emberAt = (c) => { const [ex, ey] = c.ember, px = ex - c.w / 2, py = ey - c.h / 2, cs = Math.cos(c.rot), sn = Math.sin(c.rot); return [c.x + px * cs - py * sn, c.y + px * sn + py * cs]; };
  const page = platePage(HI, tCache);
  const shadow = (g, c, st) => {
    const lift = st.sa * 30 + (c.lift || 0) * 40, sw = c.w * Math.max(.02, Math.abs(st.ca)) * st.s, sh = c.h * st.s, L = softShadow(c);
    g.save(); g.translate(c.x + 5 + lift * .35, c.y + st.dy + 8 + lift * .55); g.rotate(st.rot); g.globalAlpha = .55 - Math.min(.25, lift * .004);
    g.drawImage(L, -sw / 2 - 24 - lift * .3, -sh / 2 - 24 - lift * .3, sw + 48 + lift * .6, sh + 48 + lift * .6); g.restore();
  };
  const drawCard = (g, t, c, st) => {
    g.save(); g.translate(c.x, c.y + st.dy); g.rotate(st.rot); g.scale(st.ca * st.s, st.s);
    if (!st.back) {
      if (c.kind === 'plate') g.drawImage(page(t), -c.w / 2, -c.h / 2, c.w, c.h);
      else g.drawImage(cardFace(c), -c.w / 2 - 2, -c.h / 2 - 2, c.w + 4, c.h + 4);
    } else { g.scale(-1, 1); cardBack(g, t, c, st.tFlipEnd, T, {}); }
    g.restore();
  };
  const ORDER = [...CARDS].sort((p, q) => p.y - q.y);

  // ---- THE TAKE
  const world = (ctx, t) => {
    const cam = camAt(t);
    const uMonk = lin(tMonks - .15, tMonks + .5, t), uSci = lin(tBrain - .1, tBrain + .55, t), alive = sm(lin(tAlive - .1, tAlive + .45, t));
    // far: the wall and the floor, the lamp's breathing wash
    view(ctx, cam, .95, (g) => { g.drawImage(wallLayer(), WALL.x, WALL.y); wallWash(g, t); });
    // main plane: the mirror, the table, the cards, the lamp, the embers, the pulse line
    view(ctx, cam, 1, (g) => {
      mirror(g, t, { emberMonk: uMonk * (1 + .5 * alive), emberSci: uSci * (1 + .5 * alive) });
      g.drawImage(tableLayer(), TBOX[0], TBOX[1]);
      const states = ORDER.map((c) => [c, cardState(c, t)]);
      for (const [c, st] of states) shadow(g, c, st);
      g.save(); g.translate(SLIP.x, SLIP.y); g.rotate(SLIP.rot); g.drawImage(slipLayer(), -SLIP.w / 2 - 2, -SLIP.h / 2 - 2, SLIP.w + 4, SLIP.h + 4); g.restore();
      for (const [c, st] of states) if (!st.back) drawCard(g, t, c, st);
      lamp(g, t, 1);
      for (const [c, st] of states) if (st.back) drawCard(g, t, c, st);
      // the two embers of 7.04: the flame on the map, the pulse on the science card (light grows; on "being alive" both beat as one heart)
      for (const [c, u] of [[CARDS.find((q) => q.id === 'C5'), uMonk], [CARDS.find((q) => q.id === 'C1'), uSci]]) {
        if (u <= 0) continue; const [x, y] = emberAt(c);
        if (alive > 0) addGlow(g, x, y, 260, .2 * alive * breath(t), F6.amber, F6.amberCore);
        g.save(); g.translate(c.x, c.y); g.rotate(c.rot); cardEmber(g, t, c, u, alive); g.restore();
      }
      // the pulse line along the mirror's lower edge (7.05), straightening, cream and across the frame (7.06)
      const pa = lin(tNoOne - .4, tNoOne + .1, t);
      if (pa > 0) pulseEdge(g, t, { a: 1, grow: pa, t0: tNoOne, amp: 22 * sm(lin(tNoOne, tNoOne + .7, t)) * (1 - QUART(lin(tNot2 - .05, tYet, t))), cream: QUART(lin(tNot2, tYet + .15, t)), ext: QUART(lin(tNot2 + .3, tYet + .55, t)) });
    });
    view(ctx, cam, 1.12, (g) => motes(g, t));
    // screen space: the caption written by the line, the lower third while the clip plays
    caption(ctx, t, 'MACHINE CONSCIOUSNESS: POSSIBLE   ·   CHALMERS   ·   BACH', lin(tAgrees - .05, tAgrees + .85, t) * (1 - lin(tFurther - .25, tFurther + .45, t)));
    if (t > C6.start - .2 && t < C6.end + .2) lowerThird(ctx, t, T, 'C6', { y: 850 });
  };
  const breath = (t) => .97 + .03 * Math.sin(t * TAU);
  const [sc, sg] = canvas(W, H);
  const frame = (ctx, t) => {
    const sq = lin(tSq0, tSq1, t);
    if (sq <= 0) { world(ctx, t); return; }
    HO.plate(ctx, t);
    const k = 1 - QUART(sq); if (k * H < .5) return;
    sg.setTransform(1, 0, 0, 1, 0, 0); sg.globalAlpha = 1; sg.globalCompositeOperation = 'source-over'; sg.clearRect(0, 0, W, H); world(sg, t);
    collapse(ctx, sc, k, HO.o.y ?? 620);
  };

  // ---- prepare: the clip's first and last frames, warm up every cached layer, await the pending images
  preloadEnds('C6', Math.round((C6.end - C6.start) * 30) + 1);
  const [wc, wg] = canvas(W, H);
  for (const tt of [HI.b + .8, tAgrees + 1, C6.start + 1, tMonks + .5, tBet + 1]) { wg.setTransform(1, 0, 0, 1, 0, 0); frame(wg, tt); }
  await ready();

  const P = { riso: .25 };
  return [
    { t: HI.b, tr: 'cut', d: .1, print: HI.print, draw: frame, sound: [{ f: 'pages', t: HI.b + .02, v: .3 }] },
    { t: tAgrees, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'card', t: tAgrees + .04, v: .4 }] },
    { t: tOne, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'whoosh_up', t: tFurther + .04, v: .35 }] },
    { t: C6.start - .5, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'screen_off', t: C6.end + .03, v: .3 }] },
    { t: tBut, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'swell', t: tAliveE + .03, v: .32 }] },
    { t: tSo, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'shimmer_rings', t: tMirror + .05, v: .25 }] },
    { t: tNot2 - .1, tr: 'cut', d: .1, print: HO.print, draw: frame, sound: [{ f: 'screen_off', t: tSq0 - .02, v: .4 }] },
  ];
};
