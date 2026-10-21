// Film 6 · c11 · §7a part 1: "First, we write down what good means." … "Help them, honestly."  (07a; no clip)
// ONE take in one world space: out of the lamp light comes the big sheet on a table under that lamp, writers of different origins around it, a small
// standing pane at the right that reads what they write. The hall of a thousand rises around the table; pulling further out, the hall stands on a
// card lying on a paper map of the world (the USA); on "billions" blank dotted cards appear on every continent; the camera flies into one blank card,
// whose paper is the same paper as our sheet (exact match cut on plain paper), and pulls back out onto the sheet: the lotus opens in the margin, two
// profiles are engraved, one burns and drains, the other sends a small engraved figure to help; "care =" and "feel what they feel" are written in ink,
// struck through; the cool line writes "Help them, honestly." and runs on into the pane, which reads it; the camera pushes into the pane's glass.
//
// shot   VO words                                              image                                                        hero light   camera                        flows on              ★  sound
// 11.01  First, we write down what good means.                 out of the lamp light: the big sheet, four writers, pens;    lamp         pull out (z 7 → 1)            take                     whoosh_airy
//                                                              the first sentences scribble themselves; the small pane
// 11.02  For the first time … a mind unlike ours can act on it. a red 'because' + a reason beside each sentence; after each,  lamp         slow push (z 1.2)             take
//                                                              a cool line writes on the pane (it reads and acts)
// 11.03  Companies have started writing rules for their models. two documents land side by side on the table: ANTHROPIC ·   lamp         drift down (z 1.1)            take                     card (pause)
//                                                              CONSTITUTION · OPENAI · MODEL SPEC; neither highlighted
// 11.04  But this can't be left to them alone.                  pull back: the hall of tiers rises out of the dark around    lamp         pull back (z .42)             take                     whoosh (pause)
//                                                              the table, a thousand seated people
// 11.05  A few years ago, about a thousand ordinary Americans … a thousand cards rise, staggered, held up; COLLECTIVE        cards        hold with life                take                 ★
//        helped write the rules for an artificial intelligence. CONSTITUTIONAL AI · ANTHROPIC & COLLECTIVE INTELLIGENCE
//                                                              PROJECT · 2023 · ≈ 1,000 US PARTICIPANTS
// 11.06  So it can be done. Next, it has to be billions.        pull out: the hall stands on a card on a paper world map      the US card  pull out (z .036)             fly into a card          whoosh_up (pause)
//                                                              (USA); on "billions" blank dotted cards on every continent;              then push into one card     → paper, match cut        whoosh_airy (pause)
//                                                              the camera flies into one blank card: plain paper
// 11.07  Remember compassion as a skill?                        out of the paper: the sheet; the lotus engraved in its        lotus        pull out (z 1.55)             take
//                                                              margin opens again, its ember heart
// 11.08  Brain research found the same split.                   two head profiles engrave themselves, facing each other;      ink          drift to the profiles (z 1.6)  take                     pencil (pause)
//                                                              SINGER & KLIMECKI · CURRENT BIOLOGY · 2014
// 11.09  Feeling someone's pain and caring about it …           left: a hot red flicker (EMPATHIC DISTRESS); right: a calm    both         hold with life                take
//        are different things in the brain.                    warm ember (COMPASSION)
// 11.10  One can drain you.                                     the flicker sinks down the profile and dims to a cinder       red → ember  hold                          take
// 11.11  The other moves you to help.                           beside the calm profile a small engraved figure with the      ember        drift right (z 1.5)           take
//                                                              ember in its chest takes two real steps toward someone,
//                                                              reaches out
// 11.12  So when we write 'care' for a machine, we can be       the pen writes 'care =' and 'feel what they feel' in ink;     lamp         drift to the text + pane      take
//        precise.                                              the pane in frame at the right
// 11.13  Not 'feel what they feel'. Help them, honestly.        the pen strikes the line through in red; the cool line comes   cool line    hold, then push into the      fly into the pane        pencil · chime · whoosh_airy
//                                                              in from the left, writes 'Help them, honestly.' and runs on                pane (z 12)                   → glass plate            (pauses)
//                                                              into the pane; the pane reads it; push into its dark glass
// plates: in = light lamp c10>c11 (the plate masked by a glow-shaped falloff that shrinks into the lamp as the camera pulls out; pattern c04/c09);
//         out = glass c11>c12 (the pane's face IS HO.plate at identity, clipped to the pane; the push makes it fill the frame).
// Ambience: the writing room atmo/lab (low) throughout; the hall atmo/hall (low) from 11.04 to 11.06. Print: riso .28; plate entries carry the plates' print.
import { W, H, rgba, clamp, lin, mix, sm, eout, ein, canvas, addGlow } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { F6, ready, view, camMap, riseFromDark, coolLine, pane as kitPane, ember } from '../lib/f6_kit.mjs';
import { pen } from '../lib/paper.mjs';
import { PETAL_COUNT } from '../lib/f6_c04_room.mjs';
import { QUART, EXPO_OUT, EXPO_IN, G0, SHEET, LAMP, LAMPTIP, PANE, FLOOR, CARD, KS, MAPC, IDX_IN, GHOSTS, ghostAt, sheetPt, sheetAt, tableTop, lamp, writer, WRITERS, nearWriter,
  sheetText, marginLotus, profile, PROF, distress, labelOn, stepFigures, inkWriting, CARE, machinePane, documents, hall, hallFloor, mapSheet, blankCard, usCard, usGlow, sourceLine, motes } from '../lib/f6_c11_world.mjs';

const TAU = Math.PI * 2;
const aim = (px, py, z) => ({ x: px, y: py, z });

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c11', T);
  const S = (p, n) => T.S('07a', p, n), E = (p, n) => T.E('07a', p, n);
  // ---- anchors (words, never seconds)
  const tWrite = S('write'), tMeans = E('means');
  const tFor = S('For the first'), tDescribe = S('describe'), tKindness = S('kindness'), tClearly = S('clearly'), tMind = S('mind'), tActE = E('act on it');
  const tCompanies = S('Companies'), tRules = S('rules'), tModelsE = E('models');
  const tBut = S('But this'), tAloneE = E('alone');
  const tThousand = S('thousand'), tIntelE = E('intelligence');
  const tSo = S('So it'), tDoneE = E('done'), tNext = S('Next'), tBillions = S('billions'), tBillionsE = E('billions');
  const tRemember = S('Remember'), tCompassion = S('compassion'), tSkill = S('skill'), tSkillE = E('skill');
  const tBrain = S('Brain'), tFound = S('found'), tSplit = S('split'), tSplitE = E('split');
  const tPain = S('pain'), tCaring = S('caring'), tDifferent = S('different'), tBrainE = E('brain', 1);
  const tOne = S('One can'), tYouE = E('drain you');
  const tOther = S('The other'), tMoves = S('moves'), tToHelpE = E('to help');
  const tSoWhen = S('So when'), tCare = S('care'), tMachine = S('machine'), tPrecise = S('precise'), tPreciseE = E('precise');
  const tNot = S('Not'), tHelp = S('Help them'), tHonestlyE = E('honestly');
  const tEnd = HO.a - 1 / 30;                       // by here the frame IS the glass plate
  const tCut = tRemember - .1;                      // the match cut on plain paper (card → sheet)
  const tNotes = [tFor + .6, tDescribe + .5, tClearly + .5, tMind + .9];
  const tHall0 = tBut + .1, tCards = tThousand - .2, tMap0 = tDoneE - .25, tGhost0 = tBillions - .05, tPush0 = tHonestlyE + .1;

  // ---- the camera path: segments [t0, t1, from, to, ease]; holds between them
  const [gx, gy] = ghostAt(IDX_IN), CAMCARD = aim(gx, gy + 90 * KS, 2.6 / KS);
  const sp = (lx, ly, z) => { const [x, y] = sheetPt(lx, ly); return aim(x, y, z); };
  const SEGS = [
    [HI.b + .02, tMeans - .2, aim(LAMPTIP[0], LAMPTIP[1], 7), aim(960, 540, 1), EXPO_OUT],
    [tFor, tKindness + .4, aim(960, 540, 1), aim(900, 520, 1.2)],
    [tCompanies - .35, tRules, aim(900, 520, 1.2), aim(830, 1060, 1.1)],
    [tBut + .05, tAloneE, aim(830, 1060, 1.1), aim(960, 240, .42)],
    [tDoneE + .05, tBillions + .3, aim(960, 240, .42), aim(MAPC[0], MAPC[1], .036)],
    [tBillionsE + .3, tCut, aim(MAPC[0], MAPC[1], .036), CAMCARD],
    [tCut, tCut, CAMCARD, sp(590, 430, 2.6)],
    [tRemember, tSkillE - .1, sp(590, 430, 2.6), sp(560, 430, 1.55), EXPO_OUT],
    [tBrain, tSplit, sp(560, 430, 1.55), sp(610, 350, 1.6)],
    [tOther, tMoves + .6, sp(610, 350, 1.6), sp(790, 370, 1.5)],
    [tSoWhen - .1, tCare + .2, sp(790, 370, 1.5), aim(1300, 790, 1.45)],
    [tPush0, tEnd, aim(1300, 790, 1.45), aim(PANE.x, PANE.y + 78, 12), ein],
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

  // ---- the opening plate: the lamp light fills the frame, then shrinks into the lamp's bulb as the camera pulls out (pattern: c04, c09)
  const [disc, dg] = canvas(W, H);
  const openingDisc = (ctx, t, cam) => {
    if (t > HI.b + 1.1) return;
    const k = 1 - sm(lin(HI.b + .12, HI.b + 1.05, t)), m = camMap(cam, 1), fx = m.X(LAMPTIP[0]), fy = m.Y(LAMPTIP[1]);
    const Rr = 3.0 * 260 * cam.z * k; if (Rr < 6) return;
    dg.setTransform(1, 0, 0, 1, 0, 0); dg.globalCompositeOperation = 'source-over'; dg.globalAlpha = 1; dg.clearRect(0, 0, W, H);
    HI.plate(dg, t);
    const gr = dg.createRadialGradient(fx, fy, 0, fx, fy, Rr); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(.22 * k, 'rgba(0,0,0,1)'); gr.addColorStop(.5, `rgba(0,0,0,${.5 * Math.sqrt(k)})`); gr.addColorStop(.8, `rgba(0,0,0,${.12 * k})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
    dg.globalCompositeOperation = 'destination-in'; dg.fillStyle = gr; dg.fillRect(0, 0, W, H);
    ctx.drawImage(disc, 0, 0);
  };

  // ---- the lotus: petal openings (outer alternating sides, then inner, then the core; as in c04)
  const OUTER = [0, 4, 2, 6, 1, 5, 3, 7];
  const petalOpen = (t) => {
    const open = new Array(PETAL_COUNT).fill(0);
    OUTER.forEach((i, j) => { open[i] = QUART(lin(tCompassion - .25 + j * .13, tCompassion - .25 + j * .13 + 1.0, t)); });
    for (let j = 0; j < 6; j++) open[8 + j] = QUART(lin(tSkill - .45 + j * .12, tSkill - .45 + j * .12 + .9, t));
    for (let j = 0; j < 4; j++) open[14 + j] = QUART(lin(tSkill + .1 + j * .1, tSkill + .1 + j * .1 + .8, t));
    return open;
  };

  // ---- the cool line's path on the sheet (local units): in from the left along the baseline, the words, on into the pane's lower-left corner
  const [, mg] = canvas(8, 8); mg.font = '62px "Instrument Serif"'; const HELPW = mg.measureText('Help them, honestly.').width;
  const c = Math.cos(SHEET.rot), s = Math.sin(SHEET.rot), pcx = PANE.x - PANE.w / 2 + 2, pcy = PANE.y + PANE.h / 2 - 2;
  const PANECORNER = [(pcx - SHEET.x) * c + (pcy - SHEET.y) * s, -(pcx - SHEET.x) * s + (pcy - SHEET.y) * c];
  const by = CARE.helpY + 62 * .16, x0 = CARE.x;
  const LINEPTS = [[x0 - 420, by], [x0 + HELPW + 70, by], PANECORNER];
  const LLEN = Math.hypot(LINEPTS[1][0] - LINEPTS[0][0], 0) + Math.hypot(PANECORNER[0] - LINEPTS[1][0], PANECORNER[1] - LINEPTS[1][1]);
  const uAtText0 = 420 / LLEN, uAtText1 = (420 + HELPW) / LLEN;
  const lineU = (t) => {   // the tip reaches the first letter as "Help" is said, the last as "honestly." ends, the pane just after
    const k0 = tHelp - .12, k1 = tHonestlyE + .05, k2 = tHonestlyE + .45;
    if (t < k0 - .45) return 0; if (t < k0) return uAtText0 * (t - (k0 - .45)) / .45; if (t < k1) return mix(uAtText0, uAtText1, (t - k0) / (k1 - k0)); if (t < k2) return mix(uAtText1, 1, (t - k1) / (k2 - k1)); return 1;
  };

  // ---- the pen on the sheet (local): rests at the right, flies to the ink front, writes, strikes, lies down again
  const REST = [1110, 600], RESTANG = -1.2;
  const penState = (t, front) => {
    const toFront = EXPO_OUT(lin(tCare - .4, tCare - .1, t)), back = EXPO_OUT(lin(tNot + .62, tNot + 1.05, t));
    if (toFront <= 0 || back >= 1) return { p: REST, ang: RESTANG, lift: .08 };
    const F = front || (t < tCare ? [CARE.x, CARE.y - 2] : t < tMachine + .1 ? [CARE.x + 118, CARE.y - 2] : t < tNot ? [CARE.x + HELPW * .92, CARE.feelY - 10] : [CARE.x + HELPW + 8, CARE.feelY - 21]);
    const k = back > 0 ? 1 - back : toFront, P = [mix(REST[0], F[0], k), mix(REST[1], F[1], k)], ang = mix(RESTANG, -1.05, k);
    const writing = front != null, lift = writing ? 0 : (back > 0 ? .5 * Math.sin(Math.PI * back) + .08 * back : .55 * (1 - toFront) + .12);
    return { p: P, ang, lift };
  };

  // ---- the sheet's content (local units)
  const content = (g, t) => {
    const sent = [0, 1, 2, 3].map((i) => lin(tWrite + i * .48 - .1, tWrite + i * .48 + .5, t));
    const notes = tNotes.map((tn) => lin(tn, tn + .6, t));
    sheetText(g, t, { sent, notes });
    if (t >= tRemember) marginLotus(g, t, { u: lin(tRemember + .1, tRemember + .75, t), open: petalOpen(t), glow: .85 * lin(tSkill - .1, tSkill + .6, t) });
    if (t >= tBrain) {
      const uL = lin(tBrain + .1, tFound + .5, t), uR = lin(tBrain + .4, tSplit + .35, t);
      profile(g, t, PROF.lx, PROF.y, uL, false); profile(g, t, PROF.rx, PROF.y, uR, true);
      const bl = [PROF.lx + PROF.w * PROF.brain[0], PROF.y + PROF.h * PROF.brain[1]], br = [PROF.rx + PROF.w * (1 - PROF.brain[0]), PROF.y + PROF.h * PROF.brain[1]];
      distress(g, t, bl[0], bl[1], { a: lin(tPain - .1, tPain + .3, t), sink: QUART(lin(tOne + .1, tYouE, t)) });
      const ea = lin(tCaring - .1, tCaring + .4, t); if (ea > 0) ember(g, t, { x: br[0], y: br[1], kind: 'glow', r: 46 * (.6 + .4 * ea), a: ea, phase: .35 });
      labelOn(g, t, 'SINGER & KLIMECKI  ·  CURRENT BIOLOGY  ·  2014', 990, PROF.y - 16, tBrain + .3, { size: 13 });
      labelOn(g, t, 'EMPATHIC DISTRESS', PROF.lx + PROF.w / 2, PROF.y + PROF.h + 36, tDifferent, { col: '#8e2f2a' });
      labelOn(g, t, 'COMPASSION', PROF.rx + PROF.w / 2, PROF.y + PROF.h + 36, tDifferent + .25, { col: '#7a4a1a' });
      const sa = lin(tOther - .1, tOther + .35, t);
      if (sa > 0) { g.save(); g.beginPath(); g.rect(900, 300, 260 * eout(sa), 140); g.clip(); stepFigures(g, t, { walkU: lin(tMoves - .1, tMoves + 1.25, t), reach: EXPO_OUT(lin(tMoves + 1.25, tToHelpE + .25, t)), a: 1, emberA: .9 }); g.restore(); }
    }
    let front = null;
    if (t >= tCare - .3) front = inkWriting(g, t, { care: lin(tCare - .05, tCare + .55, t), feel: lin(tMachine + .1, tPrecise + .5, t), strike: lin(tNot, tNot + .55, t) });
    const uL = lineU(t);
    if (uL > 0) coolLine(g, t, { pts: LINEPTS, u: uL, w: 1.8, glow: 1.2, col: '#7fb8e8', core: '#f4fbff', write: { text: 'Help them, honestly.', x: x0, y: CARE.helpY, size: 62, lag: 70, fill: 1, outline: 1 } });
    if (t >= tCare - .45) { const P = penState(t, front); pen(g, P.p[0], P.p[1], .7, { ang: P.ang, t, lift: P.lift }); }
    else pen(g, REST[0], REST[1], .7, { ang: RESTANG, t, lift: .08 });
  };

  // ---- THE TAKE
  const frame = (ctx, t) => {
    if (t >= tEnd) { HO.plate(ctx, t); return; }
    const cam = camAt(t), m = camMap(cam, 1);
    ctx.fillStyle = G0; ctx.fillRect(0, 0, W, H);
    const withView = (g, fn) => { g.save(); g.setTransform(m.k, 0, 0, m.k, m.tx, m.ty); fn(g); g.restore(); };
    const mapPhase = t >= tMap0 && t < tCut, far = cam.z < .15;
    const pushU = lin(tPush0, tEnd, t);

    // the paper world map and its cards (rise out of the dark as the camera pulls out of the hall)
    if (mapPhase) {
      const uMap = EXPO_OUT(lin(tMap0, tMap0 + 1.5, t));
      const drawMap = (g) => { mapSheet(g, t, { night: .5 }); GHOSTS.forEach((_, i) => blankCard(g, t, i, EXPO_OUT(lin(tGhost0 + (i * 7 % 13) / 13 * 1.1, tGhost0 + (i * 7 % 13) / 13 * 1.1 + .5, t)), i === IDX_IN ? { shade: lin(tBillionsE + .3, tCut - .3, t), m } : { m })); usCard(g, t, { rise: 1 }); };
      if (uMap < 1) riseFromDark(ctx, uMap, (g) => withView(g, drawMap), { col: G0 }); else view(ctx, cam, 1, drawMap);
    }
    // the hall's floor (always: the ground behind the table), the hall itself from "alone"
    view(ctx, cam, 1, (g) => hallFloor(g));
    const uHall = EXPO_OUT(lin(tHall0, tHall0 + 1.45, t));
    if (uHall > 0) { const drawHall = (g) => hall(g, t, { tCards: cam.z >= .08 ? tCards : null, m }); if (uHall < 1) riseFromDark(ctx, uHall, (g) => withView(g, drawHall), { col: G0 }); else view(ctx, cam, 1, drawHall); }

    // the table world: the writers behind and beside the table, the table top, the lamp, the sheet, the pane, the documents, the near writer
    view(ctx, cam, 1, (g) => {
      if (!far) { writer(g, t, 0); writer(g, t, 1); writer(g, t, 2); writer(g, t, 3); }
      tableTop(g);
      lamp(g, t, 1, 'cone');
      sheetAt(g, t, { ...SHEET, seed: 9, shade: 1, lift: 6, key: 'c11:sheet', content: (q) => content(q, t) });
      lamp(g, t, 1, 'bloom');
      machinePane(g, t, { plate: HO.plate, paneFn: kitPane, glow: Math.min(1, lin(tNotes[0], tNotes[0] + .7, t) * .5 + lin(tHelp, tHelp + .5, t) * .5) * (1 - sm(lin(.15, .75, pushU))),
        lines: tNotes.map((tn, i) => ({ t0: tn + .35, len: [.72, .55, .8, .62][i] })), read: { text: 'Help them, honestly.', t0: tHonestlyE + .3, per: .12, size: 28 } });
      if (t >= tCompanies - .4) documents(g, t, tCompanies - .35);
      if (!far) nearWriter(g, t);
      if (!far) motes(g, t, LAMPTIP[0] - 180, LAMPTIP[1] + 120, 7, 20, 300, .7);
    });
    if (mapPhase) view(ctx, cam, 1, (g) => usGlow(g, t, 1 - sm(lin(.06, .3, cam.z))));
    // the pane's cool spill into the room while it writes (screen space; dims during the push)
    const gl = Math.min(1, lin(tNotes[0], tNotes[0] + .7, t) * .4 + lin(tHelp, tHelp + .5, t) * .6) * (1 - sm(lin(0, .5, pushU)));
    if (gl > 0 && !far) addGlow(ctx, m.X(PANE.x), m.Y(PANE.y), Math.max(PANE.w, PANE.h) * .95 * m.k, .14 * gl, F6.cool, F6.coolCore);

    // screen space: the sources (baseline ≤ 850), the opening disc
    sourceLine(ctx, t, 'COLLECTIVE CONSTITUTIONAL AI  ·  2023', tThousand - .3, tDoneE - .1, { y: 790, align: 'right' });
    sourceLine(ctx, t, 'ANTHROPIC & COLLECTIVE INTELLIGENCE PROJECT', tThousand - .1, tDoneE - .1, { y: 820, align: 'right' });
    sourceLine(ctx, t, '≈ 1,000 US PARTICIPANTS', tThousand + .1, tDoneE - .1, { y: 850, align: 'right' });
    openingDisc(ctx, t, cam);
  };

  // ---- warm up (the layers paint on first use), then await pending images
  const [, wg] = canvas(W, H);
  for (const tt of [HI.b + .3, tFor + 1, tCompanies + 1, tBut + 1.2, tThousand + 2, tBillions + .5, tCut - .02, tCut + .02, tSkill, tSplit + .5, tMoves + .8, tPrecise, tHelp + 1, tEnd - .2]) { wg.setTransform(1, 0, 0, 1, 0, 0); frame(wg, tt); }
  await ready();

  const P = { riso: .28 };
  return [
    { t: HI.b, tr: 'cut', d: .1, print: HI.print, draw: frame, sound: [{ f: 'whoosh_airy', t: HI.b - .05, v: .4 }] },
    { t: tFor, tr: 'cut', d: .1, print: P, draw: frame },
    { t: tCompanies - .35, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'card', t: tCompanies - .3, v: .35 }] },
    { t: tBut, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'whoosh', t: tBut - .14, v: .35 }] },
    { t: tThousand - .3, tr: 'cut', d: .1, print: P, draw: frame },
    { t: tSo, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'whoosh_up', t: tDoneE - .02, v: .3 }, { f: 'whoosh_airy', t: tBillionsE + .34, v: .35 }] },
    { t: tRemember, tr: 'cut', d: .1, print: P, draw: frame },
    { t: tBrain, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'pencil', t: tSplitE + .12, v: .3 }] },
    { t: tOne, tr: 'cut', d: .1, print: P, draw: frame },
    { t: tSoWhen, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'pencil', t: tPreciseE + .08, v: .3 }, { f: 'chime', t: tHelp - .2, v: .3 }] },
    { t: tPush0 - .4, tr: 'cut', d: .1, print: HO.print, draw: frame, sound: [{ f: 'whoosh_airy', t: tPush0 - .06, v: .4 }] },
  ];
};
