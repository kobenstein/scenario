// Film 6 · c13 · §7b rest "And the last one is yours." (552.6 s → 592.5 s): practice at dawn, the comfort cards, meaning them, ★ the nurse at three
// Three worlds, two continuous takes, no blend anywhere:
//   TAKE AB  the hall at dawn (c04's room) → push into the still water → the table at night grows out of the dark surface (552.6 → 579.85)
//   TAKE C   the ward at three in the morning (579.85 → 592.5); the cut between AB and C sits INSIDE the one ember's light that fills the frame
//
// shot  | VO words (anchor)                               | image                                                                      | hero light   | camera / flow                                  | ★ | sound
// 13.01 | And the last one is yours.                      | out of the dawn plate: it is the glass of the hall's tall window at dawn;  | dawn window  | pull out of the window (z 7.5 → 1), 2 s; the   |   | whoosh_airy in the pause before "And"
//       |                                                 | the sitter of §2 on the bench, lit from the right, breath like morning mist |              | dawn bleeds into the room                       |   |
// 13.02 | Compassion can be practiced.                    | down to the still water: the lotus closed; it opens ring by ring on three  | lotus (ember)| move down to the water (z 2.4), 1.3 s           |   |
//       |                                                 | breaths (outer, inner, core)                                                |              |                                                |   |
// 13.03 | In the same research, training it made positive | the ember in the heart of the flower swells and warms; COMPASSION TRAINING  | lotus        | hold with life; then push INTO the dark water   |   |
//       | feelings stronger.                              | · KLIMECKI ET AL. · 2013 · 2014                                             |              | (z 2.4 → 14) until the surface fills the frame  |   |
// 13.04 | People rate comfort lower once they learn it    | out of the dark surface: a dark table at night; a small lamp lights up and  | lamp         | the table rises as the lamp lights it (cause →  |   |
//       | came from an artificial intelligence.           | reveals two cards with the same handwriting; PERSON on the first; on        |              | effect); slow settle (z 1.32 → 1.45)            |   |
//       |                                                 | "artificial" the AI tag is pressed into the second, 100 ms later its warmth |              |                                                |   |
//       |                                                 | leaves it; source YIN ET AL. · PNAS 2024 · RUBIN ET AL. · NAT. HUM. BEHAV. 2025 |          |                                                |   |
// 13.05 | Same words. Less comfort.                       | a glint runs over both lines of handwriting; the AI card darkens one more  | lamp         | hold                                            |   |
//       |                                                 | step                                                                       |              |                                                |   |
// 13.06 | Because what we want from each other isn't just | pull back: two people stand behind the table in the dark; an ember kindles | ember (chest | pull back (z 1.45 → 1), 1.4 s; A speaks, opens   |   | swell in the pause after "them."
//       | the right words. It's that someone meant them.  | in A's chest and lights them; A turns to B (head low), opens a hand, then  | → hand)      | the hand, lays it on B's shoulder; the light    |   |
//       |                                                 | lays it on B's shoulder; the ember travels down the arm to the hand; B    |              | travels 0.4 s; B lifts the head 100 ms later    |   |
//       |                                                 | lifts the head                                                             |              |                                                |   |
// 13.07 | When perfect words get cheap, meaning them gets | cool text lines fall like cheap confetti (two depths), land on the table   | the one ember| hold; on "precious" the ember swells, its light |   | bloom in the long pause after "precious."
//       | precious.                                       | and go dark; the one ember between the two stays and grows precious       |              | grows until it fills the frame (push z 1 → 1.5) |   | whoosh_airy as the ward pulls out
// 13.08 | Picture a nurse at three in the morning,        | ★ out of that light: the night light on a ward wall; pull out: teal ward,  | night light  | pull out of the light (z 7 → 1.08), 1.5 s; hold |★ |
//       | holding a stranger's hand.                      | a bed in three-quarter view, the patient under a blanket, the nurse on a   |              | with life (breath, the blanket rises, motes,    |   |
//       |                                                 | chair holding the hand; a monitor with the steady cool pulse line         |              | the monitor sweeps)                             |   |
// 13.09 | No rule asks her to. She does it anyway.        | the camera drifts to the rules sheet pinned on the wall (nothing on it for | night light  | move left 1.1 s, then back to her 1.1 s; she    |   |
//       |                                                 | this); back to her: she leans in a little, stays                           |              | leans in                                        |   |
// 13.10 | Artificial intelligence got the first. Caring   | the monitor's cool line and the night light in one frame; INTELLIGENCE     | both         | reframe 1 s; the line glints on "first"; push    |   | bloom after "second."
//       | comes from the second.                          | under the line on "first", CONSCIOUSNESS by the light on "Caring"; push   |              | into the night light → plate light lamp (c13>c14)|   |
//       |                                                 | into the night light                                                       |              |                                                |   |
// plates: in = light (dawn) c12>c13: the plate is the glass of the hall's window, clipped in world space; the camera pulls out of it.
//         out = light (lamp) c13>c14: a soft-edged disc of the plate grows from the night light's bulb until it covers the frame (c03's method).
import { W, H, rgba, clamp, lin, mix, sm, eout, ein, drift, canvas } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { F6, ready, once, view, camMap, ember } from '../lib/f6_kit.mjs';
import { wall, slab, bench, candle, motes, lotus, lotusReflection, FIG, FLAME, WIN, LOTUS, FLOOR_Y } from '../lib/f6_c04_room.mjs';
import { QUART, EXPO_OUT, EXPO_IN, aimCam, lerpCam, worldBox, label, lightFill, lightSheet, windowFrame, dawnWash, water, waterGlow, sitterDawn, mist, haloOutside, lotusOpen,
  tableB, wallB, lampB, card, figuresB, confetti, LAMPB, FA, FB, wardWall, windowC, rulesSheet, nightLight, bed, chair, nurse, monitor, curtain, motesC, LIGHTC, MON } from '../lib/f6_c13_world.mjs';

const TAU = Math.PI * 2;
const C0 = '#0b0f20';                                                   // the dark surface both worlds share (the still water = the table in the dark)

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c13', T);
  const S = (p, n) => T.S('07b', p, n), E = (p, n) => T.E('07b', p, n);
  // ---- anchors (words, never seconds)
  const tComp = S('Compassion'), tIn = S('In the same'), tPos = S('positive'), tStrongE = E('stronger');
  const tPeople = S('People'), tLower = S('lower'), tArt = S('artificial'), tSame = S('Same words'), tLess = S('Less comfort');
  const tBecause = S('Because'), tIts = S("It's that"), tMeant = S('meant'), tThemE = E('meant them');
  const tPerfect = S('perfect'), tCheap = S('cheap'), tPrecious = S('precious'), tPreciousE = E('precious');
  const tPicture = S('Picture'), tNo = S('No rule'), tShe = S('She does'), tArt2 = S('Artificial intelligence got'), tFirst = S('first'), tCaring = S('Caring'), tSecondE = E('second');
  const t0 = HI.b, tEnd = HO.a - 1 / 30;
  // ---- the moves of TAKE AB
  const tPull0 = t0 + .06, tPull1 = tComp - .55;                          // out of the dawn
  const tDown0 = tComp - .1, tDown1 = tComp + 1.25;                       // down to the lotus
  const tOpen = tComp + .2;                                               // the lotus opens on three breaths
  const tLab0 = tIn + .3, tLab1 = tPos + .7;                              // the research label
  const tSwell0 = tPos, tSwell1 = tPos + .75;                             // the ember in the flower swells
  const tPush0 = tPos + .75, tSwitch = tPush0 + 1.0;                      // into the water → the table
  const tRise0 = tSwitch, tRise1 = tSwitch + .8, tLight0 = tSwitch + .25, tLight1 = tSwitch + 1.05;
  const tTag0 = tPeople + .3, tTag1 = tArt, tDim1 = tArt + .1, tSrc0 = tLower, tSrc1 = tBecause - .25;
  const tBack0 = tBecause, tBack1 = tBecause + 1.4;                       // pull back to the two people
  const tEmber = tBecause + .1, tSpeak = tBecause + .3, tGest = tBecause + .45;
  const tReach0 = tIts + .15, tReach1 = tIts + .75, tPass0 = tMeant + .1, tPass1 = tMeant + .5, tLift0 = tMeant + .25;
  const tConf = tPerfect, tFill0 = tPrecious + .35, tFill1 = tPreciousE + .5;   // the one ember's light fills the frame
  // ---- the moves of TAKE C
  const tOut0 = tFill1, tOut1 = tFill1 + 1.5, tRules0 = tNo, tRules1 = tNo + 1.1, tHer0 = tShe, tHer1 = tShe + 1.1, tLean0 = tShe + .1, tLean1 = tShe + 1.1;
  const tFrame0 = tArt2, tFrame1 = tArt2 + 1.0, tLab2 = tFirst - .1, tLab3 = tCaring, tPushC = tEnd - 1.05, tLabOut = tPushC - .1;

  // ---- cameras
  const CAM_A0 = aimCam(WIN.x, WIN.y, 5.5), CAM_ROOM = { x: 960, y: 590, z: 1.0 };
  const CAM_LOTUS = { x: LOTUS.x, y: LOTUS.y - 8, z: 2.4 }, CAM_WATER = { x: LOTUS.x - 290, y: LOTUS.y + 110, z: 14 };
  const CAM_B0 = { x: 960, y: 662, z: 1.3 }, CAM_B1 = { x: 960, y: 650, z: 1.45 }, CAM_B2 = { x: 880, y: 560, z: 1.0 };
  const camA = (t) => {
    if (t < tPull0) return CAM_A0;
    if (t < tPull1) return lerpCam(CAM_A0, CAM_ROOM, QUART((t - tPull0) / (tPull1 - tPull0)));
    if (t < tDown0) return CAM_ROOM;
    if (t < tDown1) return lerpCam(CAM_ROOM, CAM_LOTUS, QUART((t - tDown0) / (tDown1 - tDown0)));
    if (t < tPush0) return CAM_LOTUS;
    return lerpCam(CAM_LOTUS, CAM_WATER, QUART((t - tPush0) / (tSwitch - tPush0)));
  };
  let handB = [FB.x - 10 * FB.s, FB.y - 62 * FB.s];                     // the contact point (updated by figuresB each frame; it is static once the hand has landed)
  const camB = (t) => {
    if (t < tRise1 + .8) return lerpCam(CAM_B0, CAM_B1, EXPO_OUT((t - tSwitch) / (tRise1 + .8 - tSwitch)));
    if (t < tBack0) return CAM_B1;
    if (t < tBack1) return lerpCam(CAM_B1, CAM_B2, QUART((t - tBack0) / (tBack1 - tBack0)));
    if (t < tFill0 - .15) return CAM_B2;
    const CAM_B3 = { x: handB[0], y: handB[1], z: 1.5 };
    return lerpCam(CAM_B2, CAM_B3, ein(clamp((t - (tFill0 - .15)) / (tFill1 - (tFill0 - .15)))));
  };
  const CAM_C0 = aimCam(LIGHTC.x, LIGHTC.y + 24, 7), CAM_C1 = { x: 1080, y: 600, z: 1.08 }, CAM_C2 = { x: 900, y: 545, z: 1.18 }, CAM_C3 = { x: 1200, y: 630, z: 1.22 }, CAM_C4 = { x: 1160, y: 540, z: 1.0 };
  const camC = (t) => {
    if (t < tOut1) return lerpCam(CAM_C0, CAM_C1, QUART((t - tOut0) / (tOut1 - tOut0)));
    if (t < tRules0) return CAM_C1;
    if (t < tRules1) return lerpCam(CAM_C1, CAM_C2, QUART((t - tRules0) / (tRules1 - tRules0)));
    if (t < tHer0) return CAM_C2;
    if (t < tHer1) return lerpCam(CAM_C2, CAM_C3, QUART((t - tHer0) / (tHer1 - tHer0)));
    if (t < tFrame0) return CAM_C3;
    if (t < tFrame1) return lerpCam(CAM_C3, CAM_C4, QUART((t - tFrame0) / (tFrame1 - tFrame0)));
    if (t < tPushC) return CAM_C4;
    return lerpCam(CAM_C4, CAM_C0, QUART(clamp((t - tPushC) / (tEnd - tPushC))));
  };
  const vignette = (ctx, a) => { if (a <= 0) return; const vg = ctx.createRadialGradient(960, 520, 420, 960, 520, 1300); vg.addColorStop(0, 'rgba(8,8,16,0)'); vg.addColorStop(1, rgba('#06080f', a)); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H); };

  // ================================================================ TAKE AB
  function hall(ctx, t) {
    const cam = camA(t), m = camMap(cam, 1), B = worldBox(m);
    const open = lotusOpen(t, tOpen), opened = open.reduce((a, v) => a + clamp(v || 0), 0) / 18;
    const swell = sm(lin(tSwell0, tSwell1, t)), glow = opened * (1 + .9 * swell);
    const sheen = clamp(2.2 / cam.z), heart = [LOTUS.x, LOTUS.y - LOTUS.L * .35];
    ctx.fillStyle = C0; ctx.fillRect(0, 0, W, H);
    view(ctx, cam, 1, (g) => {
      if (B.y < FLOOR_Y) {
        wall(g, t, 1); dawnWash(g, 1);
        // the window: its glass IS the dawn plate (screen space, clipped to the glass in world space)
        g.save(); g.beginPath(); g.rect(WIN.x - WIN.w / 2, WIN.y - WIN.h / 2, WIN.w, WIN.h); g.clip(); HI.plate(g, t); g.restore();
        windowFrame(g, WIN.x, WIN.y, WIN.w, WIN.h);
        slab(g); bench(g);
        if (cam.z < 4) { sitterDawn(g, t); mist(g, t, [FIG.x - 3 * FIG.s, FIG.y - 92 * FIG.s], FIG.seed, 1); candle(g, t); motes(g, t, FLAME); }
      }
      water(g, t, B, { sheen });
      if (cam.z < 6) { waterGlow(g, WIN.x, 440, 320, '#ffd9a0', .3); waterGlow(g, FLAME[0], 60, 140, F6.amber, .25); }
      if (cam.z < 9) { g.save(); g.translate(LOTUS.x, LOTUS.y); lotusReflection(g, t, { open, glow }); lotus(g, t, { open, glow, L: LOTUS.L }); g.restore(); }
    });
    // screen space: the dawn bleeding from the window into the room (outside the glass), the flower's light, the label
    const gl = { x: m.X(WIN.x - WIN.w / 2), y: m.Y(WIN.y - WIN.h / 2), w: WIN.w * m.k, h: WIN.h * m.k };
    haloOutside(ctx, gl, { x: m.X(WIN.x), y: m.Y(WIN.y), r: 760 * m.k, a: .5 * clamp(2 / cam.z), tone: 'dawn' });
    if (opened > 0 && cam.z < 9) lightFill(ctx, { x: m.X(heart[0]), y: m.Y(heart[1]), r: (120 + 90 * opened + 150 * swell) * m.k * (1 + .03 * Math.sin(t * TAU + .3)), a: (.25 + .3 * opened) * (1 + .5 * swell) * clamp(2.5 / cam.z) });
    const la = lin(tLab0, tLab0 + .9, t) * (1 - lin(tLab1, tLab1 + .3, t));
    label(ctx, 'COMPASSION TRAINING', 1180, 522, la, { size: 18, col: rgba(F6.amberCore, .92) });
    label(ctx, 'KLIMECKI ET AL. · 2013 · 2014', 1180, 558, la, { size: 15, col: rgba(F6.cream, .72) });
    vignette(ctx, .34 * clamp(2 / cam.z) * (1 - lin(tPush0, tSwitch, t)));
  }
  function table(ctx, t) {
    const cam = camB(t), m = camMap(cam, 1);
    const uRise = QUART(lin(tRise0, tRise1, t)), uLight = EXPO_OUT(lin(tLight0, tLight1, t));
    const press0 = lin(tTag0, tTag0 + .25, t), press1 = lin(tTag1, tTag1 + .25, t);
    const dim = .55 * EXPO_OUT(lin(tDim1, tDim1 + .5, t)) + .3 * EXPO_OUT(lin(tLess, tLess + .5, t));
    const glint = lin(tSame, tSame + .65, t); const gl = glint > 0 && glint < 1 ? glint : 0;
    const emberA = EXPO_OUT(lin(tEmber, tEmber + .7, t)), speak = lin(tSpeak, tSpeak + .6, t), gesture = lin(tGest, tGest + .7, t);
    const reach = lin(tReach0, tReach1, t), pass = lin(tPass0, tPass1, t), lift = lin(tLift0, tLift0 + .55, t);
    const precious = EXPO_OUT(lin(tPrecious, tPrecious + .6, t));
    ctx.fillStyle = C0; ctx.fillRect(0, 0, W, H);
    let fb = null;
    const paint = (g) => view(g, cam, 1, (q) => {
      wallB(q);
      confetti(q, t, tConf, { near: false });
      fb = figuresB(q, t, { emberA, speak, gesture, reach, lift, pass });
      tableB(q);
      card(q, t, 0, { press: press0, glint: gl }); card(q, t, 1, { press: press1, dim, glint: gl });
      lampB(q, t, uLight);
      confetti(q, t, tConf, { near: true });
    });
    if (uRise < 1) { const [sc, sg] = once('c13:rise', () => canvas(W, H)); sg.setTransform(1, 0, 0, 1, 0, 0); sg.globalCompositeOperation = 'source-over'; sg.globalAlpha = 1; sg.clearRect(0, 0, W, H); paint(sg); sg.globalCompositeOperation = 'source-atop'; sg.fillStyle = rgba(C0, 1 - uRise); sg.fillRect(0, 0, W, H); ctx.drawImage(sc, 0, 0); }
    else paint(ctx);
    if (fb && pass >= 1) {   // the one ember: at the hand on the shoulder, between the two
      handB = fb.hand; const hx = m.X(fb.hand[0]), hy = m.Y(fb.hand[1]);
      ember(ctx, t, { x: hx, y: hy, kind: 'heart', r: (50 + 12 * precious) * FA.s * m.k, a: 1 });
      lightFill(ctx, { x: hx, y: hy, r: (90 + 220 * precious + 1400 * QUART(lin(tFill0, tFill1, t))) * m.k * (1 + .03 * Math.sin(t * TAU)), a: .35 + .4 * precious });
    }
    const sa = lin(tSrc0, tSrc0 + 1.2, t) * (1 - lin(tSrc1, tSrc1 + .3, t));
    label(ctx, 'YIN ET AL. · PNAS 2024  ·  RUBIN ET AL. · NAT. HUM. BEHAV. 2025', 110, 852, sa, { size: 15, col: rgba(F6.cream, .72), w: 1100 });
    vignette(ctx, .3 * lin(tRise0, tRise1, t) * (1 - lin(tFill0, tFill1, t)));
    // the light of the one ember grows until it is the whole frame (the surface TAKE C pulls out of)
    const uF = QUART(lin(tFill0, tFill1, t));
    if (uF > 0) lightSheet(ctx, t, { x: m.X(handB[0]), y: m.Y(handB[1]), r: mix(60, 2300, uF), k: Math.pow(uF, 1.4) });
  }
  const takeAB = (ctx, t) => (t < tSwitch ? hall(ctx, t) : table(ctx, t));

  // ================================================================ TAKE C · the ward
  function ward(ctx, t) {
    const cam = camC(t), m = camMap(cam, 1), lean = sm(lin(tLean0, tLean1, t));
    const glint = Math.sin(Math.PI * clamp((t - tFirst) / .6)) * (t >= tFirst ? 1 : 0);
    ctx.fillStyle = '#0d252c'; ctx.fillRect(0, 0, W, H);
    let hand = null;
    view(ctx, cam, 1, (g) => {
      wardWall(g); windowC(g, t); rulesSheet(g); monitor(g, t, { glint });
      const L = nightLight(g, t);
      const b = bed(g, t);
      chair(g); hand = nurse(g, t, { lean, target: b.hand, light: { x: L.x, y: L.y, col: F6.amberCore, a: .6 } });
      motesC(g, t);
    });
    view(ctx, cam, 1.15, (g) => curtain(g));
    // screen space: the labels of the last sentence (the camera holds while they are read), the light pulling back, the push into it
    const lx = m.X(MON.x), ly = m.Y(MON.y + MON.h / 2) + 44, kx = m.X(LIGHTC.x), ky = m.Y(LIGHTC.y) - 58;
    const l2 = lin(tLab2, tLab2 + .45, t) * (1 - lin(tLabOut, tLabOut + .2, t)), l3 = lin(tLab3, tLab3 + .45, t) * (1 - lin(tLabOut, tLabOut + .2, t));
    label(ctx, 'INTELLIGENCE', lx - 100, ly, l2, { size: 17, col: rgba(F6.cool, .9), w: 220 });
    label(ctx, 'CONSCIOUSNESS', kx - 118, ky, l3, { size: 17, col: rgba(F6.amberCore, .92), w: 260 });
    vignette(ctx, .32 * clamp(2 / cam.z) * (1 - lin(tPushC, tEnd, t)));
    const uO = QUART(lin(tOut0, tOut1, t));
    if (uO < 1) lightSheet(ctx, t, { x: m.X(LIGHTC.x), y: m.Y(LIGHTC.y + 24), r: mix(2300, 40, uO), k: 1 });
    // the push into the night light: a soft-edged disc of the plate itself grows from the bulb until it covers the frame (c03's method)
    const uP = QUART(lin(tPushC, tEnd, t));
    if (uP > 0) {
      lightFill(ctx, { x: m.X(LIGHTC.x), y: m.Y(LIGHTC.y + 24), r: 300 + 2200 * uP, a: .5 + .5 * uP });
      const [pc, pg] = once('c13:plate', () => canvas(W, H)); pg.setTransform(1, 0, 0, 1, 0, 0); pg.globalCompositeOperation = 'source-over'; pg.globalAlpha = 1; pg.clearRect(0, 0, W, H);
      const fx = m.X(LIGHTC.x), fy = m.Y(LIGHTC.y + 24), rr = 40 + 1900 * uP;
      pg.fillStyle = '#e08a3c'; pg.fillRect(0, 0, W, H); HO.plate(pg, t);
      pg.globalCompositeOperation = 'destination-in'; const mk = pg.createRadialGradient(fx, fy, rr * .3, fx, fy, rr); mk.addColorStop(0, 'rgba(0,0,0,1)'); mk.addColorStop(1, 'rgba(0,0,0,0)'); pg.fillStyle = mk; pg.fillRect(0, 0, W, H);
      ctx.drawImage(pc, 0, 0);
    }
  }

  // ---------- warm up the caches, then the entries (cuts only where a sound is added; both sides are the same picture)
  const [wc, wg] = canvas(W, H);
  hall(wg, t0 + 1); hall(wg, tComp + 1.5); table(wg, tSwitch + 1.5); table(wg, tBecause + 2); table(wg, tPerfect + 1); ward(wg, tOut1 + .5); ward(wg, tFirst); await ready();
  const A = (t, sound) => ({ t, tr: 'cut', d: .1, print: HI.print, draw: takeAB, sound });
  const C = (t, sound) => ({ t, tr: 'cut', d: .1, print: HO.print, draw: ward, sound });
  return [
    A(t0, [{ f: 'whoosh_airy', t: t0 + .15, v: .3 }]),
    A(tMeant, [{ f: 'swell', t: tThemE + .05, v: .45 }]),
    A(tPrecious, [{ f: 'bloom', t: tPreciousE + .07, v: .5 }, { f: 'whoosh_airy', t: tFill1 + .05, v: .3 }]),
    C(tFill1, []),
    C(tCaring, [{ f: 'bloom', t: tSecondE + .05, v: .5 }]),
  ];
};
