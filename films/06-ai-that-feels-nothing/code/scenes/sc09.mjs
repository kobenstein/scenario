// Film 6 · c09 · §4b + §5: "It's a beautiful picture." … "They write their values down."  (04b, 05a; no clip)
// ONE take in one world space (1920×1080 world, the camera moves over it): out of the lamp light comes the mother in backlight; the cool
// line copies her as a hollow wireframe; the night street grows around the wireframe (people with embers walk past the sitter and look
// away); the street sinks into the dark and the wireframe's lines unwind into a brass scale that stands on a desk; a small flame (SUFFER?),
// the policy card, an open hand with an ember (CARE?) that tips the scale; the lab's desks rise around it, the writers' lamps; the camera
// pushes into the near page whose surface is the warm paper plate. Every entry draws the same frame function (entries split for sound/print).
//
// shot  VO words                                         image                                                         hero light    camera                     flows on              ★  sound
// 9.01  It's a beautiful picture.                        out of the light: a mother cradling a sleeping child, the      backlight     pull out (z 7.5 → 1)       take                     whoosh_airy
//                                                        backlight (ember glow) behind her, warm pool on the floor
// 9.02  But can you build an instinct into something     the cool line runs along the floor to the right and writes    line          hold with life             take                     chime
//       that very probably feels nothing?                the same pose as an empty wireframe (7 engraved lines, 1.3 s);
//                                                        no ember in it; on "nothing" the lines flare once (hollow)
// 9.03  Feeling alone wouldn't save us, either.          the street rises out of the dark around the wireframe: wall,   street lamp   pan right (z 1)            take
//                                                        pavement, kerb, a street lamp, a figure sitting on a ledge
// 9.04  People feel plenty, and still look away.         four walkers pass (walk cycle, two planes), each with a small  street lamp   hold                       take
//                                                        ember in the chest; as each passes the sitter the head turns
//                                                        away; EMPATHY FAVOURS THE NEAR OVER THE FAR · PAUL BLOOM
// 9.05  So maybe we've been asking the wrong question.   the street sinks into the dark, the camera pushes to the       line          push (z 1.1)               morph                    bloom (pause)
//                                                        wireframe; its lines unwind into the lines of a scale; the
//                                                        brass scale fills in; a desk rises under it (the 2 s pause)
// 9.06  Right now, the world is asking: can artificial   the scale, level; on "suffer?" a small flame lights on the      small flame   settle (z 1)               take                     bulb (pause)
//       intelligence suffer?                             left pan; SUFFER?
// 9.07  One company has even added a ban … Just in case. the policy card lands at the right: ANTHROPIC · USAGE POLICY   small flame   drift right                take                     stamp (pause)
//                                                        · 8 OCT 2026 · IN FORCE 12 NOV 2026 · NO SUSTAINED, NEEDLESS
//                                                        CRUELTY TOWARD MODELS · NAMES NEITHER FEELINGS NOR CONSCIOUSNESS;
//                                                        the seal is pressed on "Just in case"
// 9.08  But for the rest of us … Not whether it can      the camera recentres the scale; on "Whether it can care" an    ember (hand)  drift left                 take                 ★   swell (pause)
//       suffer. Whether it can care.                     open hand with an ember in the palm rises on the right pan;
//                                                        CARE?; the scale tips slowly to the right (2 s)
// 9.09  And the most careful companies don't count on    pull back: the desk is one of several in a half-dark lab,     desk lamps    pull back (z .8),          fly into the page        pencil · pages (pause)
//       a feeling. They write their values down.         writers with small lamps and documents; on "feeling" the                    then push (z .8 → 13)      → paper plate
//                                                        small flame goes out; the near writer's pen writes on the
//                                                        page; ANTHROPIC · CONSTITUTION · OPENAI · MODEL SPEC;
//                                                        the camera pushes into the page: its surface IS the warm plate
// plates: in = light lamp c08>c09 (the plate is masked by a glow-shaped falloff that shrinks into the backlight as the camera pulls out);
//         out = paper warm c09>c10 (the page's surface is HO.plate in screen space, clipped to the sheet; the push makes it fill the frame).
// Ambience: phase A–B none (room tone), the street atmo/city_street (low), the lab atmo/lab (low). Print: riso .3; plate entries carry the plates' print.
import { W, H, rgba, clamp, lin, mix, sm, eout, ein, canvas } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { F6, ready, view, camMap, riseFromDark, ember, coolLine } from '../lib/f6_kit.mjs';
import { hand, palmPos } from '../lib/hand.mjs';
import { pen } from '../lib/paper.mjs';
import { QUART, EXPO_OUT, MOTHER, GLOW, mother, cachedPool, motherWire, wireframe, scaleLines, morphLines, scaleSolid, flameSmall, SCALE,
  scaleGeom, STREET, streetBack, streetLight, sitter, walkers, WALKERS, DESK, deskTop, farDesks, page, pagePoint, penTip, nearWriter, NEARLAMP, policyCard, CARD,
  sourceLine, panLabel, motes } from '../lib/f6_c09_world.mjs';

const TAU = Math.PI * 2;
const aimCam = (px, py, z, p = 1) => ({ x: W / 2 + (px - W / 2) / p, y: H / 2 + (py - H / 2) / p, z });
const G0 = '#0b1030';   // the ground of this world (everything that sinks into the dark sinks into this colour)

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c09', T);
  const S = (s, p, n) => T.S(s, p, n), E = (s, p, n) => T.E(s, p, n);
  // ---- anchors (words, never seconds)
  const tBeaut = S('04b', 'beautiful'), tBut = S('04b', 'But'), tBuild = S('04b', 'build'), tNothing = S('04b', 'nothing');
  const tFeeling = S('04b', 'Feeling'), tPeople = S('04b', 'People'), tLook = S('04b', 'look'), tSo = S('04b', 'So maybe') /* 'So' alone would match 'something' */, tMaybe = S('04b', 'maybe'), tWrongE = E('04b', 'question');
  const tRight = S('05a', 'Right'), tSuffer = S('05a', 'suffer'), tOne = S('05a', 'One'), tAdded = S('05a', 'added'), tCruelty = S('05a', 'cruelty'), tJust = S('05a', 'Just'), tCaseE = E('05a', 'case');
  const tBut2 = S('05a', 'But'), tBigger = S('05a', 'bigger'), tWhether2 = S('05a', 'whether', 1), tCare = S('05a', 'care'), tAnd = S('05a', 'And the most'), tCareful = S('05a', 'careful');
  const tCount = S('05a', 'count'), tThey = S('05a', 'They'), tWrite = S('05a', 'write'), tValues = S('05a', 'values'), tDownE = E('05a', 'down');
  const tEnd = HO.a - 1 / 30;   // by here the frame IS the paper plate

  // ---- the wireframe / scale position, the street, the lab (world)
  const WX = 1400, WY = MOTHER.y;                       // the wireframe's hip (feet at WY + 180)
  const FLOOR = WY + 182;                               // the floor line under the mother and the wireframe
  const SX = WX, SY = FLOOR + 12 - SCALE.col;           // the scale's pivot: its base stands where the wireframe's feet were (on the desk top)
  const CARDP = { x: SX + 670, y: 560 };
  const tStreet0 = tNothing + .85, tStreetUp = 1.3, tSink0 = tMaybe, tSinkD = 1.25;
  const tMorph0 = tMaybe + .2, tMorph1 = tWrongE - .15, tBrass0 = tWrongE - .05, tDesk0 = tWrongE + .3;
  const tFlame = tSuffer, tFlameOut = tCount + .4;
  const tCard = tAdded, tHand = tWhether2, tTip0 = tCare, tTip1 = tCare + 2.0;
  const tLab0 = tAnd + .1, tPush0 = tValues + .5;

  // ---- the camera path: segments [t0, t1, from, to, ease]; holds between them
  const CAM0 = aimCam(GLOW.x, GLOW.y, 7.5), CAM1 = { x: 960, y: 585, z: 1 }, CAM2 = { x: 1960, y: 600, z: 1 }, CAM3 = { x: WX, y: 600, z: 1.1 };
  const CAM3b = { x: WX, y: 612, z: 1 }, CAMc = { x: WX + 230, y: 612, z: 1 }, CAM4 = { x: WX + 80, y: 612, z: 1 }, CAM5 = { x: 1150, y: 650, z: .8 };
  const PP = pagePoint(40, 52), CAMF = aimCam(PP[0], PP[1], 13);   // a blank spot of the sheet: at z 13 its edges and its writing are out of frame
  const SEGS = [
    [HI.b, tBeaut + .6, CAM0, CAM1, EXPO_OUT],
    [tStreet0 + .1, tFeeling + 1.3, CAM1, CAM2],
    [tSo + .1, tWrongE - .3, CAM2, CAM3],
    [tRight, tRight + 2.6, CAM3, CAM3b],
    [tOne - .3, tOne + 1.1, CAM3b, CAMc],
    [tBut2 + .3, tBigger + 1.2, CAMc, CAM4],
    [tAnd + .2, tCareful + 2.2, CAM4, CAM5],
    [tPush0, tEnd, CAM5, CAMF, ein],
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

  // ---- the opening plate: the lamp light fills the frame, then shrinks into the backlight as the camera pulls out (pattern: c04)
  const [disc, dg] = canvas(W, H);
  const openingDisc = (ctx, t, cam) => {
    if (t > HI.b + 1.1) return;
    const k = 1 - sm(lin(HI.b + .06, HI.b + 1.0, t)), m = camMap(cam, 1), fx = m.X(GLOW.x), fy = m.Y(GLOW.y);
    const Rr = 2.2 * GLOW.r * cam.z * k; if (Rr < 6) return;
    dg.setTransform(1, 0, 0, 1, 0, 0); dg.globalCompositeOperation = 'source-over'; dg.globalAlpha = 1; dg.clearRect(0, 0, W, H);
    HI.plate(dg, t);
    const gr = dg.createRadialGradient(fx, fy, 0, fx, fy, Rr); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(.22 * k, 'rgba(0,0,0,1)'); gr.addColorStop(.5, `rgba(0,0,0,${.5 * Math.sqrt(k)})`); gr.addColorStop(.8, `rgba(0,0,0,${.12 * k})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
    dg.globalCompositeOperation = 'destination-in'; dg.fillStyle = gr; dg.fillRect(0, 0, W, H);
    ctx.drawImage(disc, 0, 0);
  };

  // ---- the policy card's lines (readable ≥ 1 s each, nothing cut: fit() shrinks a line that would not fit)
  const CARDLINES = [
    { t: tCard + .45, s: 'ANTHROPIC  ·  USAGE POLICY', size: 20, weight: 700, sp: 4, gap: 34 },
    { t: tCard + .85, s: 'ANNOUNCED 8 OCT 2026  ·  IN FORCE 12 NOV 2026', size: 14, weight: 600, sp: 2.5, a: .7, gap: 30, rule: true },
    { t: tCruelty - .35, s: 'NO SUSTAINED, NEEDLESS', size: 25, weight: 700, sp: 3, gap: 36 },
    { t: tCruelty + .05, s: 'CRUELTY TOWARD MODELS', size: 25, weight: 700, sp: 3, gap: 44 },
    { t: tJust, s: 'NAMES NEITHER FEELINGS', size: 15, weight: 600, sp: 2.5, a: .7, gap: 24 },
    { t: tJust + .3, s: 'NOR CONSCIOUSNESS', size: 15, weight: 600, sp: 2.5, a: .7, gap: 24 },
  ];

  const WIRE = motherWire(), TARGET = scaleLines(0);

  // ---- THE TAKE
  const frame = (ctx, t) => {
    if (t >= tEnd) { HO.plate(ctx, t); return; }
    const cam = camAt(t), m = camMap(cam, 1);
    ctx.fillStyle = G0; ctx.fillRect(0, 0, W, H);
    const withView = (g, fn) => { g.save(); g.setTransform(m.k, 0, 0, m.k, m.tx, m.ty); fn(g); g.restore(); };

    // the floor of the first world: a darker plane under the floor line, the backlight's warm pool on it
    if (t < tSink0 + tSinkD) view(ctx, cam, 1, (g) => {
      const fg = g.createLinearGradient(0, FLOOR - 40, 0, H + 200); fg.addColorStop(0, G0); fg.addColorStop(.25, '#090d26'); fg.addColorStop(1, '#05070f'); g.fillStyle = fg; g.fillRect(-1500, FLOOR - 40, 4500, H + 300);
    });

    // the street (rises out of the dark on "Feeling", sinks on "maybe"), with its lamp, the sitter and the walkers inside it
    // rise: expo-out; sink: an even darkening (riseFromDark's brightness is eout(u), so the sink maps its brightness b back through u = 1 - cbrt(1 - b))
    const bSink = 1 - sm(lin(tSink0, tSink0 + tSinkD, t));
    const uStreet = t < tSink0 ? EXPO_OUT(lin(tStreet0, tStreet0 + tStreetUp, t)) : 1 - Math.cbrt(1 - bSink);
    if (uStreet > 0) {
      const drawStreet = (g) => {
        streetBack(g, t);
        streetLight(g, t, 1);
        walkers(g, t, tStreet0, false);
        sitter(g, t);
        walkers(g, t, tStreet0, true);
      };
      if (uStreet < 1) riseFromDark(ctx, uStreet, (g) => withView(g, drawStreet), { col: G0 }); else view(ctx, cam, 1, drawStreet);
    }

    // the backlight and the mother (the first world; both out of frame once the camera has panned to the street)
    if (t < tSink0) view(ctx, cam, 1, (g) => {
      const gl = 1 - .5 * sm(lin(tStreet0, tStreet0 + 1.2, t));   // the backlight eases down a little once the street lamp takes over
      cachedPool(g, 'back', GLOW.x, FLOOR + 10, 460, 44, { col: F6.amber, a: .22 * gl, seed: 3 });
      ember(g, t, { x: GLOW.x, y: GLOW.y, kind: 'glow', r: GLOW.r, a: gl, phase: .2 });
      mother(g, t, { a: gl });
      motes(g, t, GLOW.x, GLOW.y, 7, 22, 380, .8 * gl);
    });

    // the cool line: along the floor from the mother to the wireframe's place, then the wireframe writes itself; the flare on "nothing"
    const uRun = EXPO_OUT(lin(tBut, tBuild - .05, t)), uWire = lin(tBuild, tBuild + 1.3, t), flare = Math.sin(Math.PI * lin(tNothing, tNothing + .55, t));
    const lineA = 1 - lin(tSo, tSo + .6, t);
    if (uRun > 0 && lineA > 0) view(ctx, cam, 1, (g) => coolLine(g, t, { from: [MOTHER.x + 70, FLOOR], to: [WX, FLOOR], u: uRun, w: 1.4, a: lineA, head: uRun < 1 }));
    const uMorph = QUART(lin(tMorph0, tMorph1, t));
    if (uWire > 0 && t < tMorph0) view(ctx, cam, 1, (g) => wireframe(g, t, WIRE, WX, WY, uWire, { w: 1.3 + .5 * flare, glow: 1 + 1.4 * flare }));

    // the desk under the scale rises in the pause; the lab around it on "And the most careful companies"
    const uDesk = EXPO_OUT(lin(tDesk0, tDesk0 + 1.0, t)), uLab = EXPO_OUT(lin(tLab0, tLab0 + 1.3, t));
    const uWrite = lin(tWrite, tDownE, t), tip = penTip(uWrite);
    const rise = (u, draw) => { if (u <= 0) return; if (u < 1) riseFromDark(ctx, u, (g) => { g.setTransform(1, 0, 0, 1, 0, 0); draw(g); }, { col: G0 }); else draw(ctx); };
    rise(uLab, (g) => {
      view(g, cam, .82, (q) => farDesks(q, t, { y: 520, d: 46, inset: 120, x0: 120, x1: 2500, s: 1.15, seeds: [41, 42, 43, 44], lampS: .34, dim: .4 }));
      view(g, cam, .9, (q) => farDesks(q, t, { y: 650, d: 64, inset: 90, x0: -250, x1: 2650, s: 1.45, seeds: [45, 46, 47], lampS: .44, dim: .2 }));
      view(g, cam, 1, (q) => nearWriter(q, t, { target: uWrite > 0 ? tip : [tip[0], tip[1] - 26] }));
    });
    rise(uDesk, (g) => view(g, cam, 1, (q) => deskTop(q, t)));

    // the scale: the morph of the lines, the brass filling in, the small flame, the open hand, the tip
    const ang = .16 * QUART(lin(tTip0, tTip1, t));
    const uBrass = EXPO_OUT(lin(tBrass0, tBrass0 + .7, t)), linesA = 1 - .85 * sm(lin(tBrass0 + .1, tBrass0 + .9, t));
    const fh = Math.min(EXPO_OUT(lin(tFlame, tFlame + .45, t)), 1 - sm(lin(tFlameOut, tFlameOut + .55, t)));
    const uHand = EXPO_OUT(lin(tHand, tHand + .55, t));
    const GG = scaleGeom(ang, t, 1), G = { pl: [SX + GG.pl[0], SY + GG.pl[1]], pr: [SX + GG.pr[0], SY + GG.pr[1]] };
    rise(uBrass, (g) => view(g, cam, 1, (q) => scaleSolid(q, t, { x: SX, y: SY, ang, light: fh > 0 ? { x: G.pl[0], y: G.pl[1] - 20, a: fh } : null })));
    if (uMorph > 0 && linesA > .02) view(ctx, cam, 1, (g) => {
      const L = uMorph < 1 ? morphLines(WIRE, TARGET, uMorph) : TARGET;
      for (const pts of L) coolLine(g, t, { pts: pts.map(([px, py]) => [SX + px, SY + py]), w: 1.3, a: linesA, head: false, ticks: uMorph >= 1, glow: linesA });
    });
    if (t > tFlame - .2 && fh >= 0) view(ctx, cam, 1, (g) => flameSmall(g, t, G.pl[0] - 2, G.pl[1] - 4, fh));
    const HX = G.pr[0] + 4, HY = G.pr[1] + 12, HS = 1.0, HO2 = { pose: 'open', ang: -1.38, t, seed: 2, skin: '#d9b08e', sleeve: '#43365a', sleeveLen: 40, rim: rgba(F6.amber, .9), light: [0, 1], spread: 1.05 };
    rise(uHand, (g) => view(g, cam, 1, (q) => { const pp = palmPos(HX, HY, HS, HO2); ember(q, t, { x: pp[0], y: pp[1] - 6, kind: 'heart', r: 150, a: .9, phase: .5 }); hand(q, HX, HY, HS, HO2); ember(q, t, { x: pp[0], y: pp[1] - 6, kind: 'heart', r: 70, a: .85, phase: .5 }); }));
    if (uBrass >= 1) view(ctx, cam, 1, (g) => {
      panLabel(g, t, 'SUFFER?', G.pl[0], G.pl[1] + 78, tFlame + .15, { col: '#dfe7f2' });
      panLabel(g, t, 'CARE?', G.pr[0], G.pr[1] + 78, tCare + .1, { col: '#ffcf8a' });
      if (fh > 0) motes(g, t, G.pl[0], G.pl[1] - 60, 9, 12, 140, .6 * fh);
      motes(g, t, SX, SY + 120, 17, 24, 420, .5);
    });

    // the policy card (lands at the right of the scale; lies down flat on "the bigger question is a different one")
    if (t > tCard) view(ctx, cam, 1, (g) => policyCard(g, t, { x: CARDP.x, y: CARDP.y, t0: tCard, lines: CARDLINES, sealT: tCaseE - .2, lay: QUART(lin(tBigger + .1, tBigger + .9, t)) }));

    // the near page (its surface is the warm plate), the lamp on the near desk, the writer's pen on the page
    rise(uLab, (g) => view(g, cam, 1, (q) => {
      page(q, t, { plate: HO.plate, shade: 1 - sm(lin(tPush0 + .4, tEnd - .12, t)), write: uWrite });
      ember(q, t, { x: NEARLAMP.x, y: NEARLAMP.y, kind: 'lamp', s: .8, dir: .55, r: 230, phase: .15 });
      pen(q, tip[0], tip[1], .5, { ang: -2.05, t, lift: uWrite <= 0 ? .5 : 0 });
      motes(q, t, NEARLAMP.x + 160, NEARLAMP.y - 80, 13, 16, 260, .7);
    }));

    // screen space: the source lines (baseline 850, bottom 170 px free), the opening disc
    sourceLine(ctx, t, 'EMPATHY FAVOURS THE NEAR OVER THE FAR  ·  PAUL BLOOM  ·  AGAINST EMPATHY  ·  2016', tPeople + .35, tSo + .25);
    sourceLine(ctx, t, 'ANTHROPIC  ·  CONSTITUTION   ·   OPENAI  ·  MODEL SPEC', tThey - .3, tEnd - .75);
    openingDisc(ctx, t, cam);
  };

  // ---- warm up (the layers and the wireframe paint on first use), then await pending images
  const [, wg] = canvas(W, H);
  for (const tt of [HI.b + .3, tBuild + .8, tFeeling + 1.5, tLook, tMaybe + .9, tRight + .5, tSuffer + .6, tCard + 1.2, tCare + 1, tAnd + 1.2, tPush0 + .9]) { wg.setTransform(1, 0, 0, 1, 0, 0); frame(wg, tt); }
  await ready();

  const P = { riso: .3 };
  return [
    { t: HI.b, tr: 'cut', d: .1, print: HI.print, draw: frame, sound: [{ f: 'whoosh_airy', t: HI.b - .06, v: .4 }] },
    { t: tBut, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'chime', t: tNothing + .75, v: .3 }] },
    { t: tFeeling, tr: 'cut', d: .1, print: P, draw: frame },
    { t: tSo, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'bloom', t: tBrass0 + .05, v: .45 }] },
    { t: tRight, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'bulb', t: tSuffer + .55, v: .35 }] },
    { t: tOne, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'stamp', t: tCaseE + .03, v: .3 }] },
    { t: tBut2, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'swell', t: tCare + .6, v: .35 }] },
    { t: tAnd, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'pencil', t: tDownE + .25, v: .35 }] },
    { t: tPush0 - .3, tr: 'cut', d: .1, print: HO.print, draw: frame, sound: [{ f: 'pages', t: tDownE + .75, v: .4 }] },
  ];
};
