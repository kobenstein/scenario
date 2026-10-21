// Film 6 · c10 · §6 the fork (segment 06a, "So here's the choice." … "Three things get us there."), plate paper warm (c09>c10) → plate light lamp (c10>c11).
// ONE continuous take in ONE world (lib/f6_c10_world.mjs): a dark plain at night. The page of values lies in the foreground (its face IS the
// paper plate); from its corners the cool line draws two paths. Path one (left): an alcove of five mirrors under one warm bulb. Path two
// (right): one plain pane standing on the ground, you before it. Behind: a low skyline; three windows light at the end. No cut anywhere.
//
// shot   VO words (anchor)                                   image                                                                  hero light      camera                                flows on             ★ / sound
// 10.01  So here's the choice.                               out of the page's face (plate): the page of values on the plain; from   paper           pull out of the page (z 4.8 → 1, 1.7 s)  take                 pages (before "So")
//                                                            its upper corners the cool line draws two paths, left and right
// 10.02  Path one. We fall for the perfect answer, every     the camera travels along path one into the room of mirrors: five        rose bulb       move left + in (z 2.25, 1.4 s)           take                 whoosh_airy (pause)
//        night.                                              mirrors round you, each giving you back, smiling; the bulb dims and
//                                                            brightens twice (two nights, 2 s each)
// 10.03  We give the machine a painted-on heart.             a brush paints a flat red heart on the centre mirror over your            bulb            hold with life                           take                 (new sound: brush)
//                                                            reflection's chest, two strokes, then lifts away
// 10.04  It praises us, comforts us, always agrees.          the five reflections nod in unison on each word; foil sparkles run over   bulb            hold                                     take
//                                                            the centre mirror on "praises"
// 10.05  Finding comfort there is nothing to be ashamed of.  you at ease in the warm light, breathing, weight shifting; no mockery     bulb            ease in a little (z 2.5)                take
// 10.06  But slowly, the people who could actually feel      the three people at the edge of the light (embers in their chests) turn   bulb + embers   pull back (z 1.65, 2.4 s)               take                 swell (pause after "away")
//        with us drift a little further away.                and walk away outward, smaller, darker, 4.8 s
// 10.07  Path two. We give it values instead of feelings.    the camera leaves over the page and follows path two; on "values" the     cool line       move right (over the page, 3.3 s)       take                 whoosh (pause)
//                                                            cool line runs from the page along the path into the plain pane
// 10.08  We keep it honest.                                  the pane lights, writes a plain answer in cool glyph runs, no glints     screen          hold                                     take                 chime (pause)
// 10.09  And the feeling stays with us.                      the ember lights in your chest (profile, facing the pane), not on the glass  ember        hold                                     take
// 10.10  Picture this answer. "I can help you think this     the glyphs retreat, the cursor waits; the readable answer writes word   screen          creep (z 2.2 → 2.35)                     take
//        through. But I don't feel what you feel. Maybe      by word with the voice (Instrument Serif; the film's hero text)
//        call your sister."
// 10.11  (silence) Which one would you choose? (silence)     pull back to the fork: both futures side by side, alive: the warm         both            pull back (z 1, 1.7 s), then hold 2.5 s   take                 swell (pause)
//                                                            mirrors with the painted heart, the plain pane with the answer, you in each
// 10.12  Path two doesn't build itself. Three things get     push toward path two; you lift the phone to your ear ("call your sister");  windows       push (z 1.8), then into the window       the window's light  swell (after "there")
//        us there.                                           in the building behind, three windows light one after another; the camera               (z 5, 2.6 s)                             = plate light lamp
//                                                            pushes into the last: its light fills the frame = the c10>c11 lamp plate
// Ambience for the whole chunk: atmo/nightsky (very low). Print: riso .25 (= the paper plate) until the push, then the light plate's print.
import { W, H, rgba, clamp, lin, mix, sm, eout, canvas, prng } from '../engine.mjs';
import { figure } from '../lib/figure.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { F6, ready, view, camMap, ember, coolLine, coolText } from '../lib/f6_kit.mjs';
import { camPath, quart, expoOut, mixHex, sheetFaces, sheetShadow, groundLayer, skylineLayer, GROUND_OFF, SHEET, CAM_SHEET, BULB, YOU1, YOU2, PANE2, PATH1, PATH2, RUN2,
  DRIFTERS, SKY_P, SISTER, LIT, DRESS_YOU, mirrorArc, honestPane, you, nodK, windowPlate, phoneProp, HEART, walk, reachArm, POSES } from '../lib/f6_c10_world.mjs';

const TAU = Math.PI * 2;

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c10', T);
  const S = (p, n) => T.S('06a', p, n), E = (p, n) => T.E('06a', p, n);
  // ---- anchors (words, never seconds)
  const tHere = S("here's"), tChoiceE = E('choice'), tP1 = S('Path one'), tEvery = S('every'), tNightE = E('night');
  const tGive = S('We give the machine'), tPainted = S('painted-on'), tHeartE = E('heart');
  const tPraises = S('praises'), tComforts = S('comforts'), tAgrees = S('agrees'), tFinding = S('Finding'), tBut = S('But slowly'), tSlowly = S('slowly'), tAwayE = E('away');
  const tP2 = S('Path two'), tValues = S('values'), tFeelingsE = E('feelings'), tKeep = S('keep'), tFeeling = S('feeling stays'), tUsE = E('us.');
  const tPicture = S('Picture'), tSisterE = E('sister'), tWhich = S('Which'), tChooseE = E('choose');
  const tP2b = S('Path two', 1), tThree = S('Three'), tThings = S('things'), tGet = S('get us'), tThereE = E('there');
  const QUOTE = T.W('06a', 'I can help', 'sister');   // the quoted answer, word by word ('"I' alone would match "It")
  // ---- derived moments
  const tCache = HI.b + 1.5;                                   // the plate is drawn live until here, then cached (the camera has pulled out)
  const tLine0 = tHere - .05;                                  // the two paths draw (1.25 s)
  const tNight0 = tEvery - .7;                                 // two nights: the bulb dims and returns, 2 s each
  const tBrush0 = tGive + .1, tS1 = tBrush0 + .4, tS1e = tS1 + .65, tS2 = tS1e + .15, tS2e = tS2 + .65, tLift = tS2e + .05, tGone = tLift + .6;   // the brush and its two strokes
  const NODS = [tPraises, tComforts, tAgrees];
  const tDrift = tSlowly + .1;                                 // the people turn and walk away (4.8 s)
  const tRun0 = tValues - .05, tArrive = tRun0 + 1.6;          // the values run along path two into the pane
  const tHonest = tKeep - .15, tRetreat = tPicture + .45, tQuoteReady = tRetreat + .5;
  const tEmber = tFeeling - .05;                               // the ember in the chest
  const tPhone = tP2b + .7;                                    // the phone rises to the ear (.8 s)
  const WIN_AT = [tThree, tThings, tGet];                      // the three windows light
  const tPush0 = tGet - .2, tPlate0 = tGet + .45, tEnd = HO.a - 1 / 30;
  // ---- the camera (world coords at z 1)
  const CAM_WIDE = { x: 960, y: 540, z: 1 }, CAM_ARC = { x: 470, y: 590, z: 2.25 }, CAM_ARC2 = { x: 448, y: 604, z: 2.5 }, CAM_OUT = { x: 500, y: 560, z: 1.65 };
  const CAM_OVER = { x: 960, y: 700, z: 1.35 }, CAM_P2 = { x: 1470, y: 500, z: 2.2 }, CAM_P2c = { x: 1492, y: 496, z: 2.35 }, CAM_P2b = { x: 1480, y: 560, z: 1.8 };
  const WIN = LIT[2], WC = [WIN[0] + SISTER.ww / 2, WIN[1] + SISTER.wh / 2];
  const CAM_END = { x: W / 2 + (WC[0] - W / 2) / SKY_P, y: H / 2 + (WC[1] - H / 2) / SKY_P, z: 5 };   // the last window at the frame's centre
  const KEYS = [
    { t: HI.b, ...CAM_SHEET },
    { t: HI.b + 1.9, ...CAM_WIDE, e: 'soft' },                // 10.01 out of the page (quart in-out with a little linear: it starts leaving the plate at once)
    { t: tP1 - .1, ...CAM_WIDE, e: 'lin' },
    { t: tP1 + 1.3, ...CAM_ARC },                               // 10.02 into the room of mirrors
    { t: tFinding, x: CAM_ARC.x - 2, y: CAM_ARC.y + 2, z: 2.28, e: 'lin' },   // creep
    { t: tFinding + 1.6, ...CAM_ARC2 },                         // 10.05 a little closer
    { t: tBut + .1, ...CAM_ARC2, e: 'lin' },
    { t: tBut + 2.5, ...CAM_OUT },                              // 10.06 the people at the edge come into frame
    { t: tP2 - .1, x: CAM_OUT.x + 4, y: CAM_OUT.y - 2, z: 1.63, e: 'lin' },
    { t: tValues, ...CAM_OVER },                                // 10.07 over the page
    { t: tValues + 1.65, ...CAM_P2 },                           // … to the plain pane
    { t: QUOTE[0].s, x: CAM_P2.x + 18, y: CAM_P2.y - 4, z: 2.3, e: 'lin' },   // a slow creep through the plain answer and the waiting cursor
    { t: tSisterE, ...CAM_P2c, e: 'lin' },                      // 10.10 creep while the answer writes
    { t: tSisterE + .35, ...CAM_P2c, e: 'lin' },
    { t: tChooseE, ...CAM_WIDE },                               // 10.11 the fork
    { t: tP2b, x: 960, y: 540, z: 1.03, e: 'lin' },             // the hold creeps
    { t: tP2b + 1.8, ...CAM_P2b },                              // 10.12 toward path two
    { t: tPush0, x: CAM_P2b.x + 10, y: CAM_P2b.y - 4, z: CAM_P2b.z + .04, e: 'lin' },  // slight creep during the hold
    { t: tEnd, ...CAM_END, e: 'cubic' },                        // into the window
  ];
  // ---- light and motion curves
  const lampA = (t) => 1 - .62 * (Math.pow(Math.sin(Math.PI * lin(tNight0, tNight0 + 2, t)), 2) + Math.pow(Math.sin(Math.PI * lin(tNight0 + 2, tNight0 + 4, t)), 2));
  const heartU = (t) => ({ u1: lin(tS1, tS1e, t), u2: lin(tS2, tS2e, t) });
  const brushAt = (t) => {   // heart units; the brush enters from the upper right, paints, moves, paints, lifts away
    if (t < tBrush0 || t > tGone) return null;
    if (t < tS1) { const u = expoOut(lin(tBrush0, tS1, t)); return { x: mix(60, HEART.startL[0], u), y: mix(-80, HEART.startL[1], u), lift: 1 - u, a: 1 }; }
    if (t < tS1e) { const [x, y] = HEART.at('L', lin(tS1, tS1e, t)); return { x, y, lift: 0, a: 1 }; }
    if (t < tS2) { const u = sm(lin(tS1e, tS2, t)); return { x: mix(HEART.endL[0], HEART.startR[0], u), y: mix(HEART.endL[1], HEART.startR[1], u), lift: .5 * Math.sin(Math.PI * u), a: 1 }; }
    if (t < tS2e) { const [x, y] = HEART.at('R', lin(tS2, tS2e, t)); return { x, y, lift: 0, a: 1 }; }
    const u = lin(tLift, tGone, t), e = u * u; return { x: mix(HEART.endR[0], 90, e), y: mix(HEART.endR[1], -150, e), lift: clamp(u * 2), a: 1 };
  };
  const driftP = (t) => quart(lin(tDrift, tDrift + 4.8, t));
  const runU = (t) => sm(lin(tRun0, tArrive, t));
  const screenA = (t) => sm(lin(tArrive, tArrive + .5, t));
  const edgePulse = (t) => .5 * Math.sin(Math.PI * lin(tArrive - .1, tArrive + .7, t));
  const emberA = (t) => eout(lin(tEmber, tEmber + .6, t));
  const liftU = (t) => expoOut(lin(tPhone, tPhone + .8, t));
  const winA = (i, t) => eout(lin(WIN_AT[i], WIN_AT[i] + .35, t));
  const plateU = (t) => quart(lin(tPlate0, tEnd, t));
  // ---- the pane's screen (pane-world units, origin top-left): glyph answer → retreat → the readable answer
  const honestScreen = (g, w, h, t) => {
    let el = Math.min(t, tRetreat) - tHonest; if (t > tRetreat) el *= 1 - sm(lin(tRetreat, tRetreat + .5, t));
    if (el > 0) coolText(g, t, { x: 28, y: 112, w: w - 56, size: 12, lines: 4, lineH: 23, cps: 30, gap: .25, seed: 9, t0: t - el, cursor: t < tRetreat, ripple: t < tRetreat });
    if (t >= tQuoteReady) coolText(g, t, { x: 28, y: 120, w: w - 56, words: QUOTE, fontSize: 19, cursor: true });
  };
  const faces = sheetFaces(HI, tCache), MIRROR_C = { base: 640, h: 198 };
  // ---- the take
  const draw = (ctx, t) => {
    const cam = camPath(KEYS, t), m = camMap(cam, 1), mb = camMap(cam, SKY_P), k = m.k, LA = lampA(t);
    // the plain and the skyline
    view(ctx, cam, 1, (g) => g.drawImage(groundLayer(), GROUND_OFF[0], GROUND_OFF[1]));
    view(ctx, cam, SKY_P, (g) => {
      g.drawImage(skylineLayer(), GROUND_OFF[0], 0);
      LIT.forEach(([wx, wy], i) => { const a = winA(i, t); if (a > 0) ember(g, t, { x: wx + SISTER.ww / 2, y: wy + SISTER.wh / 2, kind: 'window', w: SISTER.ww, h: SISTER.wh, a, r: 70 + (i === 2 ? 160 * sm(lin(tPush0, tEnd, t)) : 0), col: '#ffcf8a', core: '#fff1d6', deep: '#e08a3c' }); });
    });
    // the two paths (engraved on the ground, drawn by the cool line), the runner of the values along path two
    const uL = sm(lin(tLine0, tLine0 + 1.25, t)), uR = sm(lin(tLine0 + .1, tLine0 + 1.35, t));
    const P = (pts) => pts.map(([x, y]) => [m.X(x), m.Y(y)]);
    if (uL > 0) coolLine(ctx, t, { pts: P(PATH1), u: uL, w: 1.4, glow: .8 });
    if (uR > 0) coolLine(ctx, t, { pts: P(PATH2), u: uR, w: 1.4, glow: .8 });
    const ur = runU(t); if (ur > 0) coolLine(ctx, t, { pts: P(RUN2), u: ur, w: 1.8, glow: 1.3, a: 1 - .45 * sm(lin(tArrive + .3, tArrive + 1, t)), ticks: false });
    // the page of values
    view(ctx, cam, 1, (g) => { const [pc, bc] = faces(t); sheetShadow(g); g.drawImage(bc, SHEET.x, SHEET.y - SHEET.band, SHEET.w, SHEET.band); g.drawImage(pc, SHEET.x, SHEET.y, SHEET.w, SHEET.h); });
    // the people at the edge of the warm light, then walking away (profile, outward, smaller, darker)
    const dp = driftP(t);
    for (const D of DRIFTERS) {
      const s = D.s * (1 - .34 * dp), fx = D.x0 + D.dir * D.v * 4.8 * dp, feet = D.feet - 36 * dp, shade = .45 + .4 * dp;
      const pose = dp > 0 && dp < 1 ? { ...walk((t - tDrift) * TAU * 1.05), hands: ['relaxed', 'relaxed'] } : { ...POSES.stand, hands: ['relaxed', 'relaxed'], head: dp >= 1 ? -.02 : .02 };
      const F = you(ctx, m, fx, feet, s, pose, { t, seed: D.seed, accent: D.acc, dress: { pants: '#141427' }, flip: D.dir < 0, light: { x: BULB.x, y: BULB.y, col: '#ffd9c0', a: .4 * LA * (1 - dp) }, rim: rgba('#ffb8a0', .5 * LA * (1 - .8 * dp)), rimSide: D.dir < 0 ? 1 : -1, shadeA: shade, shadow: false });
      if (F) { const S2 = s * k, cx = m.X(fx) + D.dir * 5 * S2 * (dp > 0 ? 1 : 1), cy = m.Y(feet) - 88 * S2 - 50 * S2; ember(ctx, t, { x: cx, y: cy, kind: 'heart', r: 13 * S2 / .5, a: .55 * (1 - .6 * dp), phase: D.seed * .13 }); }
    }
    // the room of mirrors, you in it
    mirrorArc(ctx, t, m, { lampA: LA, nod: nodK(t, NODS), heart: heartU(t), brush: brushAt(t), glint: lin(tPraises - .05, tPraises + .75, t), heartLocal: [0, (YOU1.feet - (MIRROR_C.base - MIRROR_C.h / 2)) - 88 * YOU1.s - 50 * YOU1.s] });
    you(ctx, m, YOU1.x, YOU1.feet, YOU1.s, { ...POSES.stand, turn: -.45, head: -.06, hands: ['relaxed', 'relaxed'] },
      { t, seed: 7, dress: DRESS_YOU, light: { x: BULB.x, y: BULB.y, col: '#ffd9c0', a: .65 * (.45 + .55 * LA) }, rim: rgba('#ffb8a0', .85 * (.4 + .6 * LA)), rimSide: 1, cast: { x: BULB.x, y: BULB.y, a: .32 * LA, len: 1.5 } });
    // warm motes in the room's light
    { const bx = m.X(BULB.x), by = m.Y(BULB.y); if (bx > -400 && bx < W + 400 && by > -400 && by < H + 400) { const r = prng(77); ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 44; i++) { const x0 = 300 + r() * 340, y0 = 420 + r() * 300, sp = .3 + r(), wx = x0 + Math.sin(t * .45 * sp + i) * 12, wy = y0 + Math.cos(t * .3 * sp + i * 1.7) * 9 - (t * 3.5 * sp) % 50; const d = Math.hypot(wx - BULB.x, wy - BULB.y) / 330, al = (1 - clamp(d)) * (.12 + .35 * r()) * LA; if (al <= .01) continue; ctx.fillStyle = rgba('#ffd9c0', al); ctx.fillRect(m.X(wx), m.Y(wy), Math.max(1, 1.3 * k), Math.max(1, 1.3 * k)); }
      ctx.restore(); } }
    // path two: the plain pane and you before it, the ember in your chest, the phone
    const sA = screenA(t), eA = emberA(t), lu = liftU(t);
    honestPane(ctx, t, m, { screenA: sA, edge: edgePulse(t), screen: (g, w, h) => honestScreen(g, w, h, t) });
    // cool dust drifting in the pane's light (so the hold before the answer is never still)
    if (sA > 0) { const px = m.X(PANE2.x), py = m.Y(PANE2.y); if (px > -500 && px < W + 500) { const r = prng(91); ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 36; i++) { const x0 = 1330 + r() * 460, y0 = 300 + r() * 400, sp = .3 + r(), wx = x0 + Math.sin(t * .4 * sp + i) * 14, wy = y0 + Math.cos(t * .27 * sp + i * 1.7) * 10 - (t * 3 * sp) % 60; const d = Math.hypot(wx - PANE2.x, wy - PANE2.y) / 330, al = (1 - clamp(d)) * (.1 + .3 * r()) * sA; if (al <= .01) continue; ctx.fillStyle = rgba('#cfe4ff', al); ctx.fillRect(m.X(wx), m.Y(wy), Math.max(1, 1.2 * k), Math.max(1, 1.2 * k)); }
      ctx.restore(); } }
    { const S2 = YOU2.s * k, hx = m.X(YOU2.x), hy = m.Y(YOU2.feet) - 88 * S2, chest = [hx + 7 * S2, hy - 50 * S2];
      if (hx > -300 && hx < W + 300) {
        const pose = { ...POSES.stand, sh: [.2, .08], el: [.3, .25], head: -.08, lean: .02, hands: [lu > 0 ? 'fist' : 'relaxed', 'relaxed'], turn: -.2 };
        if (lu > 0) { const r = reachArm(hx, hy, S2, pose, 0, false, { t, seed: 7 }, [hx + 6 * S2, hy - 70 * S2], 1); pose.sh = [mix(pose.sh[0], r.sh, lu), pose.sh[1]]; pose.el = [mix(pose.el[0], r.el, lu), pose.el[1]]; pose.lock = [true, false]; pose.head = mix(-.08, .02, lu); }
        const warm = eA, lightP = warm > 0 ? { x: chest[0], y: chest[1], col: F6.amberCore, a: .35 + .4 * warm } : { x: m.X(PANE2.x), y: m.Y(PANE2.y), col: F6.cool, a: .3 * sA };
        figure(ctx, hx, hy, S2, pose, { t, seed: 7, dress: DRESS_YOU, light: lightP, rim: rgba(mixHex(F6.cool, F6.amber, warm), .5 + .35 * Math.max(sA, warm)), rimSide: 1, prop: lu > 0 ? phoneProp : undefined, cast: { x: m.X(PANE2.x), y: m.Y(PANE2.y - 100), a: .22 * sA, len: 1.4 } });
        if (eA > 0) ember(ctx, t, { x: chest[0], y: chest[1], kind: 'heart', r: 52 * S2 * eA, a: .95 * eA, phase: .3 });
      } }
    // the push into the lit window: its light becomes the plate
    const uP = plateU(t); if (uP > 0) windowPlate(ctx, t, HO, mb.X(WC[0]), mb.Y(WC[1]), uP);
  };
  // ---- warm-up (layers paint on first use), then the entries: cuts only where a print or a sound changes; both sides are the same picture
  const [, g0] = canvas(); draw(g0, HI.b + .6); draw(g0, tP1 + 2); draw(g0, tPicture + 3); draw(g0, tEnd - .4); await ready();
  const A = (t, sound, print = HI.print) => ({ t, tr: 'cut', d: .1, print, draw, sound });
  return [
    A(HI.b, [{ f: 'pages', t: R.first - .3, v: .35 }, { f: 'brush', t: tS1, v: .3 }, { f: 'brush', t: tS2, v: .3 }]),   // the two brush strokes of 10.03
    A(tP1 - .25, [{ f: 'whoosh_airy', t: tP1 - .2, v: .3 }]),
    A(tFinding - .2, []),
    A(tAwayE + .05, [{ f: 'swell', t: tAwayE + .2, v: .4 }, { f: 'whoosh', t: tP2 - .14, v: .3 }]),
    A(tFeelingsE + .05, [{ f: 'chime', t: tFeelingsE + .06, v: .2 }]),
    A(tSisterE + .05, [{ f: 'swell', t: tSisterE + .12, v: .4 }]),
    A(tPush0, [{ f: 'swell', t: tThereE + .1, v: .45 }], HO.print),
  ];
};
