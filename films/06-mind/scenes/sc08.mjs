// Film 6 · c08 · §4a "You came with a reason to care." … "And Geoffrey Hinton has the most human idea of all." + CLIP C7 (300.16 → 350.0)
// Two worlds, one continuous camera each; the cut between them sits INSIDE the glass (the library of words fills the frame on both sides):
//   TAKE A  the night street (plate line = the kerb) → push into the glass sign panel → inside it the ★ library of words
//   TAKE B  the researchers' hall: pull back out of the wall display (the same library on it) → the sheet → the hall → Hinton's screen → the lamp plate
//
// shot  | VO words (anchor)                         | image                                                                       | hero light  | camera / flow                                  | ★ | sound
// 8.01  | You came with a reason to care.           | out of the plate: the cream line is the kerb of a night street; a lamp; "you"  | street lamp | the world comes up around the line (0.8 s);    |   | whoosh_airy before "You"
//       |                                           | under it with an ember breathing in the chest; a walker comes along          |             | identity camera, the figures move              |   |
// 8.02  | A body that flinches when someone else    | the walker's foot catches, he goes down on his knees (in the pause); "you"   | ember       | continuous: the fall, the recoil 80 ms later,  |   | drop on the landing (pause before "A body")
//       | gets hurt.                                | recoil, the hand to the chest, the ember FLARES; then two steps and a bend   |             | the flare 60 ms after that; steps on "someone" |   |
//       |                                           | down, the hand on the fallen one's shoulder                                 |             |                                                |   |
// 8.03  | Artificial intelligence didn't come with  | the glass sign panel at the back of the pavement: cool text writes on it; it | screen      | push toward the panel, the pane turns edge-on  |   |
//       | one.                                      | turns edge-on: behind it only the dark street, no ember; turns back          |             | (1.3 rad) and back, the push continues INTO it |   |
// 8.04  | It has all our words, the kind ones and   | ★ inside the glass: the text lines recede into a square well of shelves of   | the sky at  | the well comes up out of the glass (the far    | ★ |
//       | the cruel ones.                           | engraved words rising to the sky; warm-tinted and cold-tinted runs, equal    | the far end | end grows), the camera rises up the shaft      |   |
//       |                                           | brightness                                                                  |             |                                                |   |
// 8.05  | Every lullaby. Every threat.              | one shelf's line glows warm (LULLABY); one shelf's line glints cold (THREAT)  | words       | the rise slows to a drift (labels readable)    |   |
// 8.06  | Which ones it follows is decided from     | pull back: the well is on a wall display in a half-dark hall; below it a     | desk lamp   | exact match cut inside the glass; pull out     |   | whoosh_up in the pause before "Which"
//       | outside.                                  | researcher in profile at a desk, a cream sheet with a ruled frame, the pen   |             | (z 7.1 → 2.1) to the sheet                     |   |
// 8.07  | Described. Trained. Tested.               | the hand sets one word per line into the frame: a cool spark leaves the      | desk lamp   | hold with life                                 |   | stamp ×3 (the press, in the gaps)
//       |                                           | display, lands in the frame, the pen presses the word (letterpress)          |             |                                                |   |
// 8.08  | That's the quiet job of a whole field of  | pull back and track right: desks in the half-dark, a small lamp on each, a   | lamps       | pull back + lateral move (3.3 s)               |   |
//       | researchers.                              | dark screen, people writing                                                 |             |                                                |   |
// 8.09  | And Geoffrey Hinton has the most human    | one desk's screen turns toward us as the camera pushes to it; it switches    | screen      | push (z .95 → 4.54) + the screen's yaw to 0    |   | whoosh_up at the switch-on (pause)
//       | idea of all.                              | on into the clip                                                            |             |                                                |   |
// 8.10  | CLIP C7 Hinton (19.6 s)                   | lower third; after "we can survive" the screen's glow swells, the lamp light | the light   | hold; the light grows out from the screen's    |   | bloom at the plate
//       |                                           | floods the hall from the screen outward and whites the screen → plate light |             | edge → plate light lamp (c08>c09)              |   |
import { W, H, rgba, clamp, lin, mix, sm, eout, prng, drift, canvas, text, addGlow } from '../engine.mjs';
import { F6, ready, once, pane, coolText, coolLine, ember, view, camMap, riseFromDark, lowerThird, figureDesk, breathe } from '../lib/f6_kit.mjs';
import { figure } from '../lib/figure.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { ROOT } from '../lib/kit.mjs';
import { LINE_Y, LAMP, SIGN, quartIO, quartIn, expoOut, worldBox, plateGround, kerbLine, streetPlanes, lampLight, lampPost, signPosts, walkerAt, bystanderAt, chestPoint, BY, WK } from '../lib/f6_c08_street.mjs';
import { REF, wellPrepare, wellDraw, wellLevelRect, wellS } from '../lib/f6_c08_well.mjs';
import { HORIZON, DISP, NEAR, SHEET, WORDS, HS, DESKS, FAR, hallRoom, deskSlab, deskScreen, deskLamp, floorPool, sheetWithFrame, wordPoint, researcher, clipPane8, closingLight } from '../lib/f6_c08_hall.mjs';
import fs from 'node:fs';
import { loadImage } from '@napi-rs/canvas';

const TAU = Math.PI * 2;
const geo = (a, b, u) => a * Math.pow(b / a, u);
const lerpCam = (A, B, u) => ({ x: mix(A.x, B.x, u), y: mix(A.y, B.y, u), z: geo(A.z, B.z, u) });
const CLIP_RECT = [370, 120, 1180, 664];                                 // the clip pane on screen (≥ 1100 wide, above the lower third)
const PUSH_Z = 3.6;                                                       // the sign panel at this zoom covers the frame (592 × 3.6 = 2131 px)

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c08', T);
  const S = (p, n) => T.S('04a', p, n), E = (p, n) => T.E('04a', p, n);
  const C7 = T.clip('C7');
  // ---- anchors (words, never seconds)
  const tYou = S('You came'), tCareE = E('care'), tBody = S('A body'), tFlinchW = S('flinches'), tSomeone = S('someone'), tHurtE = E('hurt');
  const tArt = S('Artificial'), tDidnt = S("didn't"), tOneE = E('one'), tIt = S('It has'), tKind = S('kind'), tCruel = S('cruel'), tOnesE = E('ones', 1);
  const tLull = S('lullaby'), tThreat = S('threat'), tThreatE = E('threat'), tWhich = S('Which'), tDecided = S('decided'), tOutsideE = E('outside');
  const tDesc = S('Described'), tTrain = S('Trained'), tTest = S('Tested'), tThats = S("That's"), tResE = E('researchers'), tAnd = S('And Geoffrey'), tAllE = E('all');
  const t0 = HI.b, tEnd = HO.a - 1 / 30;
  // the choreography of the street (in the pause after "care.")
  const K = { tTrip: tCareE + .05, tLand: tCareE + .5, tFlinch: tCareE + .56, tLift: tSomeone + .9, tStep: tSomeone - .1, tBend: tSomeone + .85 };
  // the cut inside the glass (TAKE A → TAKE B)
  const tCut = tWhich;
  // the well's rise: c = levels passed by the camera (S = RATIO^-c)
  const wellC = (t) => {
    if (t < tIt - .1) return -22;
    if (t < tIt + .9) return mix(-22, 0, expoOut(lin(tIt - .1, tIt + .9, t)));
    if (t < tLull - .35) return mix(0, 4.2, quartIO(lin(tIt + .9, tLull - .35, t)));
    return 4.2 + .06 * (t - (tLull - .35));
  };
  // the accents: a lullaby shelf (top, warm) and a threat shelf (bottom, cold), chosen so they sit at ~55 % and ~40 % of the frame
  const kOf = (t, target) => Math.round(Math.log(target / wellS(wellC(t))) / Math.log(.84));
  const kL = kOf(tLull + .1, .56), kT = kOf(tThreat + .1, .42) + 1;
  const accents = (t) => [
    { k: kL, edge: 'top', kind: 'warm', v: sm(lin(tLull - .05, tLull + .3, t)) * (1 - sm(lin(tThreat - .3, tThreat + .1, t))) },
    { k: kT, edge: 'bottom', kind: 'cold', v: lin(tThreat - .1, tThreat + .5, t) },
  ];

  // ================================================================ the pane's screen: the machine's lines, then the library (shared by both takes)
  const screenFn = (g, pw, ph, t) => {
    const k0 = pw / REF.w, c = wellC(t);
    if (t >= tIt - .1) wellDraw(g, pw, ph, t, { S: wellS(c), a: 1, fade: sm(lin(tIt - .1, tIt + .4, t)), accent: t > tLull - .2 ? accents(t) : null });
    // the machine's answer: lines writing themselves; from "It has all our words" the block recedes into the far end of the well
    const sb = t < tIt + .1 ? 1 : mix(1, .012, quartIO(lin(tIt + .1, tIt + 1.25, t)));
    if (sb > .014) {
      g.save(); g.translate(pw / 2, ph / 2); g.scale(k0 * sb, k0 * sb); g.translate(-REF.w / 2, -REF.h / 2);
      coolText(g, t, { x: 40, y: 34, w: 220, size: 7.4, lines: 6, lineH: 14.2, t0: tArt + .1, cps: 40, gap: .22, seed: 8, cursor: sb > .9, ripple: sb > .9 });
      g.restore();
    }
  };

  // ================================================================ TAKE A · the night street → into the glass
  const CA0 = { x: W / 2, y: H / 2, z: 1 }, CA1 = { x: 1290, y: 470, z: 1.32 }, CA2 = { x: SIGN.x, y: SIGN.y, z: PUSH_Z };
  const streetCam = (t) => {
    let c;
    if (t < tArt - .15) c = CA0;
    else if (t < tDidnt - .05) c = lerpCam(CA0, CA1, quartIO(lin(tArt - .15, tArt + 1.25, t)));
    else c = lerpCam(CA1, CA2, quartIO(lin(tDidnt + .55, tIt + .35, t)));
    const d = sm(lin(t0 + .4, t0 + 2, t)) * (1 - sm(lin(tIt - .2, tIt + .3, t)));
    return { x: c.x + 5 * drift(t, 1, 2) * d / c.z, y: c.y + 3 * drift(t, 1, 5) * d / c.z, z: c.z * (1 + .003 * Math.sin(t * .31) * d) };
  };
  const signYaw = (t) => { const up = quartIO(lin(tDidnt - .1, tDidnt + .55, t)), down = quartIO(lin(tDidnt + .7, tDidnt + 1.35, t)); return 1.3 * up * (1 - down); };
  const vignette = (ctx, a) => { if (a <= 0) return; const vg = ctx.createRadialGradient(960, 520, 420, 960, 520, 1300); vg.addColorStop(0, 'rgba(8,8,16,0)'); vg.addColorStop(1, rgba('#08080f', a)); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H); };

  function street(ctx, t) {
    const cam = streetCam(t), m = camMap(cam, 1), B = worldBox(m);
    const uW = sm(lin(t0, t0 + .9, t));                  // the world comes up out of the dark around the line
    const uO = lin(t0 + .03, t0 + .8, t);                      // the objects rise
    const brL = breathe(t, 60, .3);
    const deep = cam.z > 2.2;                                   // deep in the glass: only the panel matters
    view(ctx, cam, 1, (g) => { plateGround(g, t, B); if (!deep) streetPlanes(g, t, uW, B); });
    // the objects: the lamp post, the sign posts, the two people (one solid picture rising out of the dark), then the lights
    const walker = walkerAt(t, K), you = bystanderAt(t, K, walker);
    const lampL = { x: LAMP.x, y: LAMP.top + 40, col: F6.amberCore, a: .55 };
    const yaw = signYaw(t), writing = t >= tArt - .2;
    const drawPane = (q) => pane(q, t, { x: SIGN.x, y: SIGN.y, w: SIGN.w, h: SIGN.h, yaw, frame: 'thin', edge: .55, radius: 4, seed: 5, spill: writing, screen: writing ? (q2, pw, ph) => screenFn(q2, pw, ph, t) : null, screenA: writing ? sm(lin(tArt - .2, tArt + .1, t)) : 0 });
    const drawObjects = (g) => view(g, cam, 1, (q) => {
      if (deep) return;
      signPosts(q, t, { yaw });
      drawPane(q);
      lampPost(q, t, { a: 1 });
      // the walker (behind "you" in depth: drawn first)
      figure(q, walker.x, walker.y, WK.s, walker.pose, { t, seed: WK.seed, accent: '#5a4a6a', dress: { pants: '#171428' }, light: lampL, rim: rgba(F6.amberCore, .7), rimSide: 1, flip: walker.flip, shadow: false });
      // "you": under the lamp, the ember in the chest
      figure(q, you.x, you.y, BY.s, you.pose, { t, seed: BY.seed, accent: '#3c5a8a', dress: { pants: '#141a2e' }, light: lampL, rim: rgba(F6.amberCore, .75), rimSide: 1, flip: false, shadow: false });
      const flare = Math.sin(Math.PI * clamp((t - (K.tFlinch + .06)) / .7)) * sm(lin(K.tFlinch + .06, K.tFlinch + .16, t));
      const [cx, cy] = chestPoint(you, BY.s), eR = 58 * (1 + 1.1 * flare), eA = .85 * (1 + .35 * flare);
      ember(q, t, { x: cx, y: cy, kind: 'heart', r: eR, a: eA, bpm: 60 + 24 * flare });
      if (flare > 0) addGlow(q, cx, cy, 420 * flare, .35 * flare, F6.amber, F6.amberCore);
    });
    // ground shadows under the people (part of the objects)
    const drawShadows = (g) => view(g, cam, 1, (q) => { if (deep) return; q.fillStyle = 'rgba(2,3,10,.55)'; for (const P of [walker, you]) { const fy = LAMP.base; q.beginPath(); q.ellipse(P.x + 6, fy + 2, 46 * 2, 9, 0, 0, TAU); q.fill(); } });
    if (uO < 1) riseFromDark(ctx, uO, (g) => { drawShadows(g); drawObjects(g); }, { col: '#0a0c22' });
    else { drawShadows(ctx); drawObjects(ctx); }
    // the lamp's light on the pavement and the road (additive: nothing at u 0)
    if (!deep) view(ctx, cam, 1, (g) => lampLight(g, t, uW, brL));
    // deep in the glass only the panel is drawn (the pane at the back of the pavement: it turns; its screen writes the machine's lines, then holds the library)
    if (deep) view(ctx, cam, 1, (g) => drawPane(g));
    // the kerb line: the plate's line, in world space (identical pixels at the plate's camera)
    view(ctx, cam, 1, (g) => { if (!deep) kerbLine(g, t); });
    // motes in the lamp light (near plane)
    if (!deep) view(ctx, cam, 1.15, (g) => { const r = prng(91); g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 44; i++) { const x0 = LAMP.x - 300 + r() * 600, y0 = LAMP.top + r() * 440, sp = .3 + r(), x = x0 + Math.sin(t * .5 * sp + i) * 14, y = y0 + Math.cos(t * .33 * sp + i * 1.7) * 10 - (t * 4 * sp) % 60, d = Math.hypot(x - LAMP.x, y - LAMP.top - 80) / 380, al = (1 - clamp(d)) * (.12 + .3 * r()) * uW; if (al <= .01) continue; g.fillStyle = rgba('#ffd9a8', al); g.fillRect(x, y, 1.4, 1.4); } g.restore(); });
    vignette(ctx, .42 * sm(lin(t0 + .2, t0 + 1.8, t)) * (1 - clamp((cam.z - 1.6) / 1.6)));
    labels(ctx, t, m, { x: SIGN.x, y: SIGN.y, w: SIGN.w });
  }
  // the LULLABY / THREAT labels in screen space, next to their shelves (pane-local → world → screen)
  function labels(ctx, t, m, P) {
    const aL = sm(lin(tLull, tLull + .25, t)) * (1 - sm(lin(tThreat - .35, tThreat - .2, t))), aT = sm(lin(tThreat - .2, tThreat + .05, t)) * (1 - sm(lin(tCut - .18, tCut - .02, t)));
    const kp = P.w / REF.w, S0 = wellS(wellC(t));
    const at = (k, edge) => { const L = wellLevelRect(S0, k); return [m.X(P.x + (-L.a + 6 * L.s) * kp), m.Y(P.y + (edge === 'top' ? -L.b - 10 * L.s : L.b + 10 * L.s) * kp)]; };
    if (aL > 0) { const [x, y] = at(kL, 'top'); const w = 150; ctx.save(); ctx.beginPath(); ctx.rect(x - 4, y - 30, w * aL, 36); ctx.clip(); text(ctx, 'LULLABY', x, y - 6, { size: 18, weight: 600, color: rgba('#ffcf8a', .95), spacing: 7 }); ctx.restore(); }
    if (aT > 0) { const [x, y] = at(kT, 'bottom'); const w = 130; ctx.save(); ctx.beginPath(); ctx.rect(x - 4, y - 4, w * aT, 36); ctx.clip(); text(ctx, 'THREAT', x, y + 20, { size: 18, weight: 600, color: rgba('#bcd2ee', .95), spacing: 7 }); ctx.restore(); }
  }

  // ================================================================ TAKE B · the hall: out of the display, the sheet, the desks, Hinton's screen
  const zCut = PUSH_Z * SIGN.w / DISP.w;                                 // the display at the cut covers the frame exactly like the sign panel
  const CB0 = { x: DISP.x, y: DISP.y, z: zCut }, CB1 = { x: 905, y: 690, z: 2.15 }, CB2 = { x: 1130, y: 640, z: .95 };
  const zClip = CLIP_RECT[2] / HS.w, CB3 = { x: HS.x, y: HS.y + (540 - (CLIP_RECT[1] + CLIP_RECT[3] / 2)) / zClip, z: zClip };
  const hallCam = (t) => {
    let c;
    if (t < tCut) c = CB0;
    else if (t < tThats - .1) { const uz = quartIO(lin(tCut, tCut + 1.75, t)), uxy = quartIO(lin(tCut + .1, tCut + 1.85, t)); c = { x: mix(CB0.x, CB1.x, uxy), y: mix(CB0.y, CB1.y, uxy), z: geo(CB0.z, CB1.z, uz) }; }
    else if (t < tAnd) c = lerpCam(CB1, CB2, quartIO(lin(tThats - .1, tThats + 3.3, t)));
    else c = lerpCam(CB2, CB3, quartIO(lin(tAnd + .05, tAnd + 3.15, t)));
    const d = sm(lin(tCut + 1.4, tCut + 2.2, t)) * (1 - sm(lin(tAnd + 2.6, tAnd + 3.1, t)));
    return { x: c.x + 4 * drift(t, 1, 3) * d / c.z, y: c.y + 3 * drift(t, 1, 8) * d / c.z, z: c.z * (1 + .003 * Math.sin(t * .29 + 1) * d) };
  };
  const hsYaw = (t) => .62 * (1 - quartIO(lin(tAnd + .5, tAnd + 2.4, t)));
  // the words: picked from the display (a cool spark flies to the frame), then pressed
  const tWord = [tDesc, tTrain, tTest];
  const pressU = (t) => tWord.reduce((acc, tw) => acc + clamp((t - tw) / .25), 0);
  const handAt = (t) => {   // the pen hand: comes in from the lap, goes to each word's line just before the press, bobs on the press, hovers right of the frame between words, returns
    const rest = [SHEET.x + SHEET.w * .9, SHEET.y + SHEET.h * SHEET.sq + 26], hover = (i) => { const p = wordPoint(i); return [p[0] + 62, p[1] - 14]; };
    if (t < tDecided - .2) return null;
    const lap = [rest[0] - 60, rest[1] + 40];
    let p = hover(0), from = lap;
    const uIn = quartIO(lin(tDecided - .2, tDecided + .45, t)); p = [mix(from[0], p[0], uIn), mix(from[1], p[1], uIn)];
    tWord.forEach((tw, i) => {
      const target = wordPoint(i), at = [target[0] + 40, target[1] - 8], hv = hover(i), hvN = hover(Math.min(i + 1, 2));
      const uGo = quartIO(lin(tw - .38, tw - .08, t)), uOff = quartIO(lin(tw + .22, tw + .55, t));
      if (t >= tw - .38) p = [mix(hv[0], at[0], uGo), mix(hv[1], at[1], uGo)];
      if (t >= tw + .22) p = [mix(at[0], hvN[0], uOff), mix(at[1], hvN[1], uOff)];
    });
    const uBack = quartIO(lin(tTest + .6, tTest + 1.2, t)); if (uBack > 0) p = [mix(p[0], rest[0], uBack), mix(p[1], rest[1], uBack)];
    for (const tw of tWord) p = [p[0], p[1] + 5 * Math.sin(Math.PI * lin(tw - .08, tw + .18, t))];
    return p;
  };
  const spark = (g, t) => {   // one engraved point of cool light leaves the display and lands in the frame 120 ms before each press
    tWord.forEach((tw, i) => { const u = lin(tw - .5, tw - .12, t); if (u <= 0 || u >= 1) return; const e = quartIO(u), a = [DISP.x, DISP.y + 30], b = wordPoint(i), c = [a[0] - 120, b[1] - 220]; const x = (1 - e) ** 2 * a[0] + 2 * (1 - e) * e * c[0] + e * e * b[0], y = (1 - e) ** 2 * a[1] + 2 * (1 - e) * e * c[1] + e * e * b[1]; addGlow(g, x, y, 60, .9, F6.cool, F6.coolCore); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(x, y, 2.2, 0, TAU); g.fill(); });
  };

  function hall(ctx, t) {
    if (t >= tEnd) { HO.plate(ctx, t); return; }
    const cam = hallCam(t), m = camMap(cam, 1), B = worldBox(m);
    const inClip = t > C7.start - 1.2;
    // the room, the far row of desks (parallax .95)
    view(ctx, cam, .9, (g) => hallRoom(g, t, B));
    view(ctx, cam, .95, (g) => { if (B.y + B.h < 300 || B.y > 900) return; for (const F of FAR) { if (F.x + 520 < B.x || F.x - 520 > B.x + B.w) continue; const D = { x0: F.x - 150, x1: F.x + 150, yTop: 596, yFront: 616, lamp: [F.x + 128, 598], seed: F.seed }; deskSlab(g, D, { k: .7 }); floorPool(g, D, { k: .7 }); deskScreen(g, t, { x: F.x - 20, y: 560, w: 120, h: 68 }, { seed: F.seed }); figureDesk(g, t, F.x, 640, .95, { seed: F.seed, lamp: { x: D.lamp[0], y: D.lamp[1] - 60 }, screen: { x: F.x - 20, y: 560 }, lampA: .9, screenA: .5, shade: .3 }); deskLamp(g, t, D, { s: .46 }); } });
    // the wall display (the library) above the near desk; its light on the wall
    view(ctx, cam, 1, (g) => {
      g.save(); g.fillStyle = '#0c1020'; g.fillRect(DISP.x - 16, DISP.y + DISP.h / 2, 32, 12); g.restore();
      pane(g, t, { x: DISP.x, y: DISP.y, w: DISP.w, h: DISP.h, frame: 'thin', edge: .5, radius: 2, seed: 7, spill: true, screen: (q, pw, ph) => screenFn(q, pw, ph, t), screenA: 1 });
    });
    // the near row: the Hinton desk and the left desk (people from behind), the near desk with the researcher in profile
    view(ctx, cam, 1, (g) => {
      for (const D of DESKS) {
        if (D.x1 + 520 < B.x || D.x0 - 520 > B.x + B.w || D.yTop - 560 > B.y + B.h) continue;   // off frame (with the lamp's reach)
        deskSlab(g, D, { lampDir: D.lamp[0] > D.screen.x ? -1 : 1 });
        if (D.hinton) {
          const yaw = hsYaw(t), sx = HS.x - HS.w / 2, sy = HS.y - HS.h / 2;
          g.fillStyle = '#121728'; g.fillRect(HS.x - 22, HS.y + HS.h / 2 + 2, 44, 8); g.fillRect(HS.x - 4, HS.y + HS.h / 2 - 2, 8, 10);
          if (t < C7.start - 1.2) deskScreen(g, t, HS, { yaw, seed: 21, screenA: .35 });
          else { const onR = t < C7.end - .5 ? undefined : 1; clipPane8(g, t, T, 'C7', sx, sy, HS.w, HS.h, { frame: 'thin', edge: .8, yaw, seed: 21, spill: true, on: onR, last: LAST.C7 }); }
        } else deskScreen(g, t, D.screen, { seed: D.seed, screenA: .5 });
        figureDesk(g, t, D.seat[0], D.seat[1], D.s, { seed: D.seed, lamp: { x: D.lamp[0], y: D.lamp[1] - 90 }, screen: { x: D.screen.x, y: D.screen.y }, lampA: 1, screenA: .5 });
        floorPool(g, D, { dir: D.lamp[0] > D.screen.x ? -1 : 1 }); deskLamp(g, t, D, { s: .6, dir: D.lamp[0] > D.screen.x ? .5 : -.5 });
      }
      if (!(NEAR.x1 + 520 < B.x || NEAR.x0 - 520 > B.x + B.w || NEAR.yTop - 560 > B.y + B.h)) {
        // the near desk: the researcher behind the sheet's end of the desk, the sheet on it, the lamp
        const N = NEAR, hand = handAt(t);
        deskSlab(g, N, { lampDir: -1 }); floorPool(g, N);
        sheetWithFrame(g, t, { u: pressU(t), light: [N.lamp[0] - 60, N.lamp[1] - 120] });
        researcher(g, t, { hand, leanK: hand ? 1 : 0 });
        deskLamp(g, t, N, { s: .66, dir: .55 });
        spark(g, t);
      }
    });
    // motes in the near lamp's light; the frame's vignette
    if (B.y + B.h > NEAR.yTop - 320) view(ctx, cam, 1.12, (g) => { const r = prng(71); g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 30; i++) { const x0 = NEAR.lamp[0] - 320 + r() * 360, y0 = NEAR.lamp[1] - 300 + r() * 320, sp = .3 + r(), x = x0 + Math.sin(t * .5 * sp + i) * 12, y = y0 + Math.cos(t * .33 * sp + i * 1.7) * 9 - (t * 3 * sp) % 50, d = Math.hypot(x - NEAR.lamp[0] + 90, y - NEAR.lamp[1] + 120) / 300, al = (1 - clamp(d)) * (.12 + .3 * r()); if (al <= .01) continue; g.fillStyle = rgba('#ffd9a8', al); g.fillRect(x, y, 1.4, 1.4); } g.restore(); });
    vignette(ctx, .42 * (1 - clamp((cam.z - 2.6) / 2)) * sm(lin(tCut + .9, tCut + 1.7, t)));
    // the lower third while the clip plays (screen space)
    if (inClip && t < C7.end + .2) lowerThird(ctx, t, T, 'C7', { y: 850 });
    // the labels of the accents (the cut may land inside the threat label's second)
    labels(ctx, t, m, { x: DISP.x, y: DISP.y, w: DISP.w });
    // after "we can survive": the screen's glow swells (warm: the lamps' light joins it), then the plate grows out of the screen's edge
    const uG = sm(lin(C7.end - 1.9, C7.end - .4, t)); if (uG > 0) addGlow(ctx, 960, 452, 900 * uG, .32 * uG, '#ffcf8a', '#fff1d6');
    const uP = quartIO(lin(C7.end - 1.15, tEnd - .2, t)), uIn = lin(tEnd - .36, tEnd - 1 / 30, t); if (uP > 0) closingLight(ctx, t, { rect: CLIP_RECT, u: uP, inner: uIn, plate: HO.plate });
  }

  // ---------- the clip's last frame (for the closing frames), the strips, a warm-up of both takes, then the entries
  const LAST = {};
  for (let k = Math.round((C7.end - C7.start) * 30) + 1; k > 0; k--) { const f = `${ROOT}clips/C7/f${String(k).padStart(5, '0')}.jpg`; if (fs.existsSync(f)) { LAST.C7 = await loadImage(f); break; } }
  wellPrepare();
  const [wc, wg] = canvas(W, H); street(wg, t0 + 1); street(wg, tLull); hall(wg, tCut + 2); hall(wg, tThats + 2); hall(wg, C7.start + 1); await ready();
  const frame = (ctx, t) => (t < tCut ? street(ctx, t) : hall(ctx, t));
  const A = (t, print, sound) => ({ t, tr: 'cut', d: .1, print, draw: frame, sound });
  const P = { riso: .3 };
  return [
    A(t0, HI.print, [{ f: 'whoosh_airy', t: t0 - .08, v: .42 }]),
    A(tBody - .55, HI.print, [{ f: 'drop', t: K.tLand - .02, v: .5 }]),
    A(tArt - .2, P, []),
    A(tIt - .1, P, []),
    A(tCut, P, [{ f: 'whoosh_up', t: tThreatE + .03, v: .4 }]),
    A(tDesc - .12, P, [{ f: 'stamp', t: tDesc - .04, v: .32 }, { f: 'stamp', t: tTrain - .04, v: .3 }, { f: 'stamp', t: tTest - .04, v: .3 }]),
    A(tThats - .1, P, []),
    A(tAnd, P, [{ f: 'whoosh_up', t: tAllE + .08, v: .38 }]),
    A(C7.start - .55, HO.print, [{ f: 'bloom', t: C7.end - .02, v: .42 }]),
  ];
};
