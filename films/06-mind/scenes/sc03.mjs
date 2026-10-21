// Film 6 · c03 · §1b "Intelligence and consciousness." (segment 01b, 103.5 s → 131.5 s)
// Two worlds, three continuous takes, no blend anywhere:
//   TAKE A  the stage of the line (103.5 → 123.3)   one draw function (stage) under one camera path
//   TAKE B  the oldest map at first light (123.3 → 131.5)   one draw function (room); the cut between A and B sits INSIDE the paper
//
// shot  | VO words (anchor)                              | image                                                                        | hero light | camera / flow                                   | ★ | sound
// 3.01  | Intelligence and consciousness. Two different  | the plate's cool line; on "consciousness" a warm ember tears itself off the  | both       | pull back from the plate (z 1 → .78), the split   | ★ | bloom in the pause after "consciousness."
//       | things.                                        | line and rises, breathing; the line dips, stays straight and cold; labels    |            | 1.3 s, then hold with life                      |   |
//       |                                                | INTELLIGENCE under the line, CONSCIOUSNESS by the ember                      |            |                                                 |   |
// 3.02  | Artificial intelligence got the first.         | the line's bright tip runs left and draws the outline of a pane standing on  | line       | continuous: the line writes the next thing;     |   | whoosh_airy as the tip departs (pause)
//       |                                                | the line; the glass fills in dark; the machine's cool text starts writing    |            | riseFromDark for the glass                      |   |
// 3.03  | Caring comes from the second.                  | the ember leaves the line and floats to the lower right; its light reveals   | ember      | continuous: the ember travels 1.15 s; the figures |   | swell in the pause after "second."
//       |                                                | two figures on a bench; it settles into the chest of the one behind, who    |            | rise out of the dark as it nears                |   |
//       |                                                | 80 ms later puts a hand on the other's shoulder; the other lifts the head   |            |                                                 |   |
// 3.04  | And that's the problem. No one in there means  | the camera pushes to the pane, which turns a full circle: edge-on, then its  | screen     | push 1.6 s + the pane turn 5.25 s (slow while   |   | whoosh at the edge-on moment (pause)
//       | no one who cares how you're doing.             | back: dark glass, nothing, no ember; the figures leave the frame; a person  |            | the back faces us); a figure walks in from the  |   |
//       |                                                | walks in from the right carrying a sheet                                     |            | right (real gait) while the back is shown       |   |
// 3.05  | Every bit of care it shows has to be put in,   | the person lays the sheet on the line (a ledge), takes the pen: each word of | screen +   | continuous: letterpress on the sheet, 120 ms    |   | card when the sheet lands (pause)
//       | from the outside.                              | care is pressed into the paper OUTSIDE, then the cool line writes it on the  | the sheet  | later the cool line writes it on the pane; on   |   |
//       |                                                | pane: KIND · PATIENT · HONEST · GENTLE · WARM                                 |            | "from the outside" the camera flies INTO the sheet |   | pages as the camera enters the paper
// 3.06  | The oldest maps of that difference weren't     | inside the paper: it ages to parchment; a hand-drawn diagram appears in ink: | paper      | TAKE B starts inside the same sheet (pixel-     |   |
//       | drawn in a lab.                                | a line, a flame above it, Sanskrit-like notes; no instruments               |            | exact); slow drift                              |   |
// 3.07  | They were drawn by people sitting very still.  | pull back: the sheet lies on the floor before a figure sitting cross-legged  | candle +   | pull back 1.7 s, hold with breath, then push    |   | bloom as the flame fills the frame (silence)
//       |                                                | in a dim room at first light; a candle; the camera pushes into the flame    | first light| into the flame → plate light (c03>c04)          |   |
import { W, H, rgba, clamp, lin, mix, sm, eout, prng, drift, canvas, text, addGlow } from '../engine.mjs';
import { F6, ready, once, pane, coolText, coolLine, ember, view, camMap, riseFromDark, letterpress, breathe } from '../lib/f6_kit.mjs';
import { figure, POSES, walk, reachArm } from '../lib/figure.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { LINE_Y, FLOOR_Y, quartIO, expoOut, hermite, worldBox, lineGround, emberBody, splitThread, splitLabels, paneBack, sheetFace, diagram, mixHex, candleHalo } from '../lib/f6_c03_world.mjs';

const TAU = Math.PI * 2;
const PANE = { x: 520, y: 350, w: 560, h: 380 };                         // stands on the line (bottom edge at LINE_Y)
const SPLIT = { x: 960, y: LINE_Y, rise: 185, r: 165 };
const FA = { x: 1470, y: 955, s: 2.0, seed: 4 }, FB = { x: 1560, y: 985, s: 2.1, seed: 7 };   // the two on the bench (A behind, B in front)
const CHEST = [FB.x - 7 * FB.s, FB.y - 46 * FB.s];
const WR = { x: 1120, y: LINE_Y + 20, s: 1.7, seed: 2 };                  // the writer, standing behind the ledge (the line at his waist)
const SHEET = { w: 200, h: 167, rot: -.05, sq: .7 };                     // one sheet in both worlds (local units)
const SS = { x: 985, y: LINE_Y };                                         // the sheet on the ledge (stage world, local origin, k 1)
const SR = { x: 790, y: 720, k: 2.7 };                                    // the same sheet on the floor of the room (k 3.2)
const CARE = ['KIND', 'PATIENT', 'HONEST', 'GENTLE', 'WARM'];
const ROOM = { horizon: 600, window: { x: 330, y: 430, w: 260, h: 360 }, candle: { x: 660, y: 1110, s: 1.25 }, sitter: { x: 1540, y: 930, s: 2.3, seed: 5 } };
const geo = (a, b, u) => a * Math.pow(b / a, u);                         // geometric interpolation (zooms feel even)
const lerpCam = (A, B, u) => ({ x: mix(A.x, B.x, u), y: mix(A.y, B.y, u), z: geo(A.z, B.z, u) });

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c03', T);
  const S = (p, n) => T.S('01b', p, n), E = (p, n) => T.E('01b', p, n);
  const tCons = S('consciousness'), tArt = S('Artificial'), tGot = S('got'), tCaring = S('Caring'), tSecondE = E('second');
  const tAnd = S('And that'), tDoingE = E('doing'), tCare = S('of care') + .3, tFrom = S('from the outside'), tOutsideE = E('outside');
  const tOldest = S('oldest'), tLabE = E('lab'), tThey = S('They'), tStillE = E('still');
  const t0 = HI.b, tSwitch = tFrom + 1.75;                                 // TAKE A → TAKE B inside the paper
  const tWord = (i) => tCare + i * .45;                                    // the five words pressed from outside

  // ---------- measured text (once): the words on the sheet (local units) and on the pane (pane-local)
  const [mc, mg] = canvas(8, 8);
  const measure = (font, s) => { mg.font = font; try { mg.letterSpacing = '0px'; } catch { } return mg.measureText(s).width; };
  const SHEETW = (() => { const rows = [[0, 3, 16, 14], [3, 5, 16, 34]], out = []; for (const [i0, i1, x0, y] of rows) { let x = x0; for (let i = i0; i < i1; i++) { const w = measure('600 10px "Inter"', CARE[i]) + CARE[i].length * 1; out.push({ s: CARE[i], x, y, w }); x += w + 8; } } return out; })();
  const PANEW = (() => { const rows = [[0, 2, 36, 222], [2, 4, 36, 282], [4, 5, 36, 342]], out = []; for (const [i0, i1, x0, y] of rows) { let x = x0; for (let i = i0; i < i1; i++) { const w = measure('600 40px "Inter"', CARE[i]) + CARE[i].length * 5; out.push({ s: CARE[i], x, y, w }); x += w + 40; } } return out; })();
  const sheetLocal = (lx, ly) => { const c = Math.cos(SHEET.rot), s = Math.sin(SHEET.rot), yy = ly * SHEET.sq; return [SS.x + lx * c - yy * s, SS.y + lx * s + yy * c]; };   // local → stage world

  // ---------- the stage camera (TAKE A)
  const C0 = { x: W / 2, y: H / 2, z: 1 }, C1 = { x: 980, y: 640, z: .9 }, C2 = { x: 600, y: 430, z: 1.5 };
  const [tx3, ty3] = sheetLocal(100, 110); const C3 = { x: tx3, y: ty3, z: 14 };
  const stageCam = (t) => {
    let c;
    if (t < 113.0) c = lerpCam(C0, C1, quartIO(lin(t0 + .05, tCons + 1.3, t)));
    else if (t < tFrom - .05) c = lerpCam(C1, C2, quartIO(lin(tAnd - .1, tAnd + 1.5, t)));
    else c = lerpCam(C2, C3, quartIO(lin(tFrom - .05, tSwitch, t)));
    const d = sm(lin(t0 + .3, t0 + 2, t)) * (1 - sm(lin(tFrom - .6, tFrom, t)));   // a slow float of the stage camera (not at the plate, not inside the paper)
    return { x: c.x + 6 * drift(t, 1, 2) * d / c.z, y: c.y + 4 * drift(t, 1, 5) * d / c.z, z: c.z * (1 + .004 * Math.sin(t * .31) * d) };
  };
  // ---------- the room camera (TAKE B): starts exactly where the stage camera ends, seen through the same sheet
  const camS = stageCam(tSwitch);
  const R0 = { x: SR.x - SR.k * (SS.x - camS.x), y: SR.y - SR.k * (SS.y - camS.y), z: camS.z / SR.k };
  const R1 = { x: 1000, y: 820, z: .85 };
  const flameW = () => [ROOM.candle.x, ROOM.candle.y - 118 * ROOM.candle.s];
  const R2 = { x: flameW()[0], y: flameW()[1], z: 9 };
  const roomCam = (t) => {
    let c;
    if (t < tThey - .15) c = { ...R0 };
    else if (t < tStillE - .4) c = lerpCam(R0, R1, quartIO(lin(tThey - .15, tThey + 1.6, t)));
    else c = lerpCam(R1, R2, quartIO(lin(tStillE - .4, HO.a - 1 / 30, t)));
    const d = sm(lin(tThey + 1.2, tThey + 2, t)) * (1 - sm(lin(tStillE - .5, tStillE, t)));
    return { x: c.x + 5 * drift(t, 1, 3) * d / c.z, y: c.y + 3 * drift(t, 1, 8) * d / c.z, z: c.z * (1 + .004 * Math.sin(t * .29 + 1) * d) };
  };

  // ---------- shared pieces
  const inFrame = (m, x, y, s) => { const sx = m.X(x), sy = m.Y(y), r = 130 * s * m.k; return sx + r > 0 && sx - r < W && sy + r > 0 && sy - r < H; };
  const age = (t) => sm(lin(tSwitch + .1, tOldest + .9, t));
  const diagU = (t) => lin(tOldest - .1, tLabE - .25, t);
  // the sheet, drawn under the caller's world transform at (x, y, k): identical pixels in both worlds for the same t
  const drawSheet = (g, t, x, y, k, px, words = true, shadowK = 1) => {
    g.save(); g.translate(x, y); g.rotate(SHEET.rot); g.scale(k, k * SHEET.sq);
    const u = CARE.reduce((acc, _, i) => acc + clamp((t - tWord(i)) / .25), 0);
    sheetFace(g, t, { w: SHEET.w, h: SHEET.h, px, age: age(t), seed: 9, shadowK, content: (q, w, h) => {
      // the words pressed from outside: letterpress, one by one (they stay)
      if (words && u > 0) for (const wd of SHEETW) { const i = CARE.indexOf(wd.s); if (u - i > 0) letterpress(q, t, { x: wd.x, y: wd.y, words: [wd.s], u: u - i, size: 10, spacing: 1, ink: F6.ink }); }
      diagram(q, t, { w, h, u: diagU(t), px, sy: 1 / SHEET.sq, ink: mixHex('#3a2814', '#2a1a0c', age(t)) });
    } });
    g.restore();
  };
  // the pen in the writer's front hand (figure units: +x forward, +y down)
  const penProp = (g, fa) => { const a = fa.ang + .35, dx = Math.sin(a), dy = Math.cos(a), hx = fa.hx + Math.sin(fa.ang) * 1.5, hy = fa.hy + Math.cos(fa.ang) * 1.5; g.save(); g.lineCap = 'round'; g.strokeStyle = '#2a2738'; g.lineWidth = 3; g.beginPath(); g.moveTo(hx - dx * 11, hy - dy * 11); g.lineTo(hx + dx * 20, hy + dy * 20); g.stroke(); g.strokeStyle = 'rgba(255,240,220,.45)'; g.lineWidth = .8; g.beginPath(); g.moveTo(hx - dx * 10 - dy * .8, hy - dy * 10 + dx * .8); g.lineTo(hx + dx * 17 - dy * .8, hy + dy * 17 + dx * .8); g.stroke(); g.strokeStyle = '#c9a45a'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(hx + dx * 20, hy + dy * 20); g.lineTo(hx + dx * 25, hy + dy * 25); g.stroke(); g.restore(); };

  // ================================================================ TAKE A · the stage of the line
  function stage(ctx, t) {
    const cam = stageCam(t), m = camMap(cam, 1);
    // the split: the ember tears off the line on "consciousness"
    const uS = lin(tCons - .1, tCons + 1.2, t), eS = eout(uS), dip = Math.sin(Math.PI * clamp(uS * 1.6)) * .5;
    const emberRise = [SPLIT.x, SPLIT.y - SPLIT.rise * eS];
    // its travel to the chest (3.03)
    const uT = quartIO(lin(tCaring - .05, tCaring + 1.1, t)), cp = [1250, 300];
    const emberPos = uT <= 0 ? emberRise : [(1 - uT) ** 2 * emberRise[0] + 2 * (1 - uT) * uT * cp[0] + uT * uT * CHEST[0], (1 - uT) ** 2 * emberRise[1] + 2 * (1 - uT) * uT * cp[1] + uT * uT * CHEST[1]];
    const landed = uT >= 1, la = sm(lin(.7, 1, uS)) * (1 - sm(lin(tCaring - .35, tCaring - .02, t)));
    lineGround(ctx, t, { cam, dipX: SPLIT.x - W / 2, dip });
    // the pane (3.02 → ): outline written by the line, the glass rising from the dark, the turn (3.04), the words of care (3.05)
    const uOut = lin(tArt - .15, tArt + 1.35, t), uGlass = lin(tArt + 1.3, tArt + 1.9, t), uTurn = lin(tAnd, tDoingE + .25, t);
    const yaw = TAU * hermite([[0, 0, 0], [.29, .25, 1.02], [.78, .75, 1.02], [1, 1, 0]], uTurn), yawN = ((yaw + Math.PI) % TAU + TAU) % TAU - Math.PI, front = Math.abs(yawN) < Math.PI / 2;
    const screenFn = (g, pw, ph) => {
      coolText(g, t, { x: 30, y: 26, w: pw - 60, size: 16, lines: 5, t0: tGot + .3, cps: 44, gap: .25, seed: 3 });
      for (const wd of PANEW) { const i = CARE.indexOf(wd.s), u = lin(tWord(i) + .12, tWord(i) + .5, t); if (u > 0) coolLine(g, t, { write: { text: wd.s, x: wd.x, y: wd.y, size: 40, font: 'Inter', weight: 600, spacing: 5, lead: 70, lag: 30, fill: .85 }, u, w: 1.4, glow: .8 }); }
    };
    const cy = Math.max(.08, Math.abs(Math.cos(yawN))), OUTL = 1480, SEG = SPLIT.x - (PANE.x + PANE.w / 2);
    const drawOutline = (g) => {
      // the line's tip runs left along the line (its extra light drains into the pane once the glass is there), then draws the rectangle
      const segA = .85 * (1 - lin(tArt + 1.9, tArt + 2.6, t));
      if (segA > 0) coolLine(g, t, { pts: [[SPLIT.x, LINE_Y], [PANE.x + PANE.w / 2, LINE_Y]], u: clamp(uOut * OUTL / SEG), w: 1.5, glow: .9, a: segA });
      if (uOut * OUTL > SEG) { g.save(); g.translate(PANE.x, PANE.y); g.scale(cy, 1); g.translate(-PANE.x, -PANE.y);    // the outline turns with the pane
        coolLine(g, t, { pts: [[PANE.x + PANE.w / 2, LINE_Y], [PANE.x + PANE.w / 2, PANE.y - PANE.h / 2], [PANE.x - PANE.w / 2, PANE.y - PANE.h / 2], [PANE.x - PANE.w / 2, LINE_Y]], u: clamp((uOut * OUTL - SEG) / (OUTL - SEG)), w: 1.5, glow: .9, a: .85 }); g.restore(); }
    };
    const drawGlass = (g) => {
      if (front) pane(g, t, { ...PANE, yaw: yawN, frame: 'thin', edge: .5, radius: 4, seed: 5, screen: screenFn, screenA: lin(tGot + .2, tGot + .55, t), spill: true });
      else paneBack(g, t, { ...PANE, yaw: yawN - Math.sign(yawN) * Math.PI });
    };
    if (uOut > 0 && inFrame(m, PANE.x, PANE.y, 2.6)) view(ctx, cam, 1, drawOutline);
    if (uGlass > 0 && uGlass < 1) riseFromDark(ctx, uGlass, (g) => view(g, cam, 1, drawGlass), { col: '#151436' });
    else if (uGlass >= 1 && inFrame(m, PANE.x, PANE.y, 2.6)) view(ctx, cam, 1, drawGlass);
    // the two on the bench (3.03): revealed by the ember's light as it arrives; the hand on the shoulder follows the landing
    const uFig = lin(tCaring + .35, tCaring + 1.05, t);
    // the ember on its way (and, once arrived, inside the chest: behind the body, so the coat holds it)
    if (uT > 0 && uT <= .72) view(ctx, cam, 1, (q) => emberBody(q, t, { x: emberPos[0], y: emberPos[1], r: mix(SPLIT.r, 120, uT), e: 1 }));   // behind the figures while far
    if (uFig > 0 && inFrame(m, FB.x, FB.y, 3)) {
      const uHand = expoOut(lin(tCaring + 1.18, tCaring + 1.75, t)), uHead = eout(lin(tCaring + 1.3, tCaring + 1.95, t));
      const drawFigs = (g) => view(g, cam, 1, (q) => {
        const near = clamp(1.15 - Math.hypot(emberPos[0] - FB.x, emberPos[1] - FB.y) / 650), light = { x: emberPos[0], y: emberPos[1], col: F6.amberCore, a: .75 * near };
        // the bench: a low dark slab seen from above-front, the ember's rim on its near edge
        q.fillStyle = 'rgba(3,3,10,.5)'; q.beginPath(); q.ellipse(1520, FLOOR_Y + 4, 190, 16, 0, 0, TAU); q.fill();
        q.fillStyle = '#1a1626'; q.beginPath(); q.moveTo(1400, 940); q.lineTo(1650, 940); q.lineTo(1672, 992); q.lineTo(1378, 992); q.closePath(); q.fill();
        q.fillStyle = '#100d18'; q.fillRect(1378, 992, 294, 22); q.fillStyle = rgba(F6.amber, .3); q.fillRect(1378, 991, 294, 2);
        q.strokeStyle = '#0d0b14'; q.lineWidth = 9; q.lineCap = 'round'; q.beginPath(); for (const lx of [1396, 1654]) { q.moveTo(lx, 1010); q.lineTo(lx, FLOOR_Y - 2); } q.stroke();
        // A (behind): bowed, lifts the head as the hand lands
        figure(q, FA.x, FA.y, FA.s, { ...POSES.sit, head: mix(.14, -.03, uHead), sh: [.5, .42], el: [.95, 1.0], lean: .05 }, { t, seed: FA.seed, accent: '#4e4466', dress: { pants: '#17132a' }, light, rim: rgba(F6.amber, .8 * near), rimSide: 1, flip: true, shadow: false });
        // B (in front): the carer; the front arm reaches to A's shoulder after the ember lands
        const target = [FA.x - 3 * FA.s, FA.y - 62 * FA.s], restPose = { ...POSES.sit, head: .08, sh: [.55, .45], el: [.9, .95], lean: .04 };
        const o = { t, seed: FB.seed, accent: '#8a5a3a', dress: { pants: '#1a1420' }, light: { x: CHEST[0], y: CHEST[1], col: F6.amberCore, a: .8 * near }, rim: rgba(F6.amberCore, .85 * near), rimSide: -1, flip: true, shadow: false };
        let pose = restPose;
        if (uHand > 0) { const r = reachArm(FB.x, FB.y, FB.s, restPose, 0, true, o, target); pose = { ...restPose, sh: [mix(restPose.sh[0], r.sh, uHand), restPose.sh[1]], el: [mix(restPose.el[0], r.el, uHand), restPose.el[1]], lean: mix(.04, .1, uHand), head: mix(.08, .12, uHand) }; }
        figure(q, FB.x, FB.y, FB.s, pose, o);
        // the warmth shows through the coat
        if (landed) ember(q, t, { x: CHEST[0], y: CHEST[1], kind: 'heart', r: 92 * eout(lin(tCaring + 1.05, tCaring + 1.5, t)), a: .9 });
      });
      if (uFig < 1) riseFromDark(ctx, uFig, drawFigs, { col: '#121231' }); else drawFigs(ctx);
      // the last stretch in front of the body (never hidden by it): the ember's body sinks into the coat while the heart glow takes over
      if (uT > .72 && !landed) { const k = lin(.72, 1, uT); view(ctx, cam, 1, (q) => emberBody(q, t, { x: emberPos[0], y: emberPos[1], r: mix(120, 64, k), e: 1 - k * k })); }
    }
    // the split's ember while it still belongs to the line (before the travel)
    if (uS > 0 && uT <= 0) view(ctx, cam, 1, (q) => { splitThread(q, t, { x: SPLIT.x, y: SPLIT.y, ey: emberRise[1], u: uS }); emberBody(q, t, { x: emberRise[0], y: emberRise[1], r: SPLIT.r, e: eS }); });
    if (la > 0) splitLabels(ctx, { x: m.X(SPLIT.x), y: m.Y(SPLIT.y), ey: m.Y(emberRise[1]), emberR: SPLIT.r * m.k, la, size: 19 });   // screen space: the labels keep their size
    // the writer (3.04 → 3.05): walks in from the right with the sheet, lays it on the ledge, presses the words with the pen
    const tWalk0 = tAnd + 2.7, tWalk1 = tDoingE + .2;
    if (t >= tWalk0) view(ctx, cam, 1, (q) => {
      const uW = lin(tWalk0, tWalk1, t), xW = mix(1500, WR.x, uW), uStop = quartIO(lin(tWalk1, tWalk1 + .4, t)), uLow = quartIO(lin(tWalk1 + .05, tWalk1 + .6, t));
      const wk = walk((t - tWalk0) * 1.8 * TAU), carry = { sh: [mix(1.0, .5, uLow), mix(.95, .45, uLow)], el: [mix(.45, .35, uLow), mix(.5, .4, uLow)] };   // the arms carry the sheet, then lower it onto the ledge
      const pose = { hip: [mix(wk.hip[0], .05, uStop), mix(wk.hip[1], -.05, uStop)], kn: [mix(wk.kn[0], 0, uStop), mix(wk.kn[1], 0, uStop)], ft: [wk.ft[0] * (1 - uStop), wk.ft[1] * (1 - uStop)], dy: wk.dy * (1 - uStop), lean: mix(wk.lean, .1, uStop), head: mix(wk.head, .12, uStop), sh: [...carry.sh], el: [...carry.el], lock: [true, true] };
      const o = { t, seed: WR.seed, accent: '#3c5a8a', dress: { pants: '#141a2e' }, light: { x: PANE.x, y: PANE.y, col: F6.cool, a: .5 }, rim: rgba(F6.cool, .75), rimSide: -1, flip: true, shadow: false };
      // where the pen hand goes: the sheet's words, in order, then a rest above the sheet
      const hand = (lx, ly) => { const [wx, wy] = sheetLocal(lx, ly); return [wx + 15, wy - 22]; };   // the hand sits just up-right of the pen's tip
      const keys = []; SHEETW.forEach((wd, i) => keys.push([tWord(i), hand(wd.x + wd.w * .5, wd.y - 3)]));
      const rest = hand(118, 2); let H0 = null, lean = .1;
      if (t >= tWalk1 + .6) {
        H0 = rest; for (let i = 0; i < keys.length; i++) { const [ti, p] = keys[i], prev = i ? keys[i - 1][1] : rest, u = quartIO(lin(ti - .3, ti - .06, t)); if (t >= ti - .3) H0 = [mix(prev[0], p[0], u), mix(prev[1], p[1], u)]; }
        const last = keys[keys.length - 1][0]; const uBack = quartIO(lin(last + .35, last + .9, t)); if (uBack > 0) H0 = [mix(keys[keys.length - 1][1][0], rest[0], uBack), mix(keys[keys.length - 1][1][1], rest[1], uBack)];
        for (const [ti] of keys) { const p = Math.sin(Math.PI * lin(ti - .06, ti + .16, t)); H0 = [H0[0], H0[1] + 6 * p]; }    // the press
        lean = mix(.12, .22, 1 - uBack);
        const r = reachArm(xW, WR.y, WR.s, { ...pose, lean }, 0, true, o, H0);
        const uArm = quartIO(lin(tWalk1 + .6, tWalk1 + 1.0, t));
        pose.sh = [mix(carry.sh[0], r.sh, uArm), mix(carry.sh[1], .62, uArm)]; pose.el = [mix(carry.el[0], r.el, uArm), mix(carry.el[1], .95, uArm)]; pose.lean = mix(.1, lean, uArm); pose.head = mix(.12, .2, uArm);
      }
      const sx = m.X(xW), sy = m.Y(WR.y), big = WR.s * m.k;
      const sheetCovers = (() => { const c = [sheetLocal(0, 0), sheetLocal(SHEET.w, 0), sheetLocal(SHEET.w, SHEET.h), sheetLocal(0, SHEET.h)].map(([x, y]) => [m.X(x), m.Y(y)]); const inside = (px, py) => { let s = 0; for (let i = 0; i < 4; i++) { const [ax, ay] = c[i], [bx, by] = c[(i + 1) % 4], cr = (bx - ax) * (py - ay) - (by - ay) * (px - ax); if (i === 0) s = Math.sign(cr); else if (Math.sign(cr) !== s) return false; } return true; }; return uLow >= 1 && inside(0, 0) && inside(W, 0) && inside(W, H) && inside(0, H); })();
      if (!sheetCovers && sx + 200 * big > 0 && sx - 200 * big < W) figure(q, xW, WR.y, WR.s, pose, { ...o, prop: penProp });
      // the sheet: carried flat in both hands, lowered onto the ledge, then lying there
      const carried = [xW - 115, WR.y - 25 + wk.dy * (1 - uStop) * WR.s], ledgeC = sheetLocal(SHEET.w / 2, SHEET.h / 2);
      const cxy = [mix(carried[0], ledgeC[0], uLow), mix(carried[1], ledgeC[1], uLow)];
      const c = Math.cos(SHEET.rot), s = Math.sin(SHEET.rot), hw = SHEET.w / 2, hh = SHEET.h / 2 * SHEET.sq;
      drawSheet(q, t, cxy[0] - hw * c + hh * s, cxy[1] - hw * s - hh * c, 1, m.k);
    });
    // motes in the ember's light; the vignette grows as the camera leaves the plate (the plate has none)
    if (uS > 0) view(ctx, cam, 1.15, (g) => { const r = prng(91); g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 40; i++) { const x0 = emberPos[0] - 260 + r() * 520, y0 = emberPos[1] - 220 + r() * 440, sp = .3 + r(), x = x0 + Math.sin(t * .5 * sp + i) * 14, y = y0 + Math.cos(t * .33 * sp + i * 1.7) * 10 - (t * 4 * sp) % 60, d = Math.hypot(x - emberPos[0], y - emberPos[1]) / 300, al = (1 - clamp(d)) * (.12 + .3 * r()) * clamp(uS * 2); if (al <= .01) continue; g.fillStyle = rgba('#ffd9a8', al); g.fillRect(x, y, 1.4, 1.4); } g.restore(); });
    vignette(ctx, (.5 - .36 * clamp((cam.z - 2) / 4)) * sm(lin(t0 + .1, t0 + 1.6, t)));   // the same strength as the room's at the paper switch
  }
  const vignette = (ctx, a) => { if (a <= 0) return; const vg = ctx.createRadialGradient(960, 520, 420, 960, 520, 1300); vg.addColorStop(0, 'rgba(8,8,16,0)'); vg.addColorStop(1, rgba('#08080f', a)); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H); };

  // ================================================================ TAKE B · the oldest map at first light
  function room(ctx, t) {
    const cam = roomCam(t), m = camMap(cam, 1), B = worldBox(m), fl = flameW();
    ctx.fillStyle = '#1b1a22'; ctx.fillRect(0, 0, W, H);
    view(ctx, cam, 1, (g) => {
      // wall and floor at first light: grey-gold from the window on the left
      const wg = g.createLinearGradient(0, B.y, 0, ROOM.horizon); wg.addColorStop(0, '#141219'); wg.addColorStop(1, '#221e27'); g.fillStyle = wg; g.fillRect(B.x, B.y, B.w, ROOM.horizon - B.y);
      const fg = g.createLinearGradient(0, ROOM.horizon, 0, ROOM.horizon + 900); fg.addColorStop(0, '#1d1920'); fg.addColorStop(1, '#0d0b10'); g.fillStyle = fg; g.fillRect(B.x, ROOM.horizon, B.w, B.y + B.h - ROOM.horizon + 10);
      g.fillStyle = 'rgba(241,217,168,.12)'; g.fillRect(B.x, ROOM.horizon - 1, B.w, 2);
      // the window: the pane as a window onto the first light; its light on the wall and in a pool on the floor
      const Wn = ROOM.window, dawn = .55 + .45 * sm(lin(tThey, tStillE + 1, t));
      const wl = g.createRadialGradient(Wn.x, Wn.y, 0, Wn.x, Wn.y, 1400); wl.addColorStop(0, rgba('#f1d9a8', .4 * dawn)); wl.addColorStop(.4, rgba('#f1d9a8', .1 * dawn)); wl.addColorStop(1, rgba('#f1d9a8', 0)); g.fillStyle = wl; g.fillRect(B.x, B.y, B.w, B.h);
      // the window's light lies on the floor as a long soft field, strongest by the window
      g.save(); g.translate(820, 980); g.scale(1, .34); const pl = g.createRadialGradient(-300, 0, 0, 0, 0, 900); pl.addColorStop(0, rgba('#f1d9a8', .3 * dawn)); pl.addColorStop(.55, rgba('#f1d9a8', .1 * dawn)); pl.addColorStop(1, rgba('#f1d9a8', 0)); g.fillStyle = pl; g.beginPath(); g.arc(0, 0, 900, 0, TAU); g.fill(); g.restore();
      if (inFrame(m, Wn.x, Wn.y, 3)) pane(g, t, { x: Wn.x, y: Wn.y, w: Wn.w, h: Wn.h, frame: 'window', edge: .2, radius: 0, seed: 4, throughA: 1, through: (q) => { const dg = q.createLinearGradient(0, -Wn.h / 2, 0, Wn.h / 2); dg.addColorStop(0, mixHex('#8d8a94', '#e4d2ae', dawn)); dg.addColorStop(.55, mixHex('#5e5a66', '#b5a287', dawn)); dg.addColorStop(1, '#3a3440'); q.fillStyle = dg; q.fillRect(-Wn.w / 2, -Wn.h / 2, Wn.w, Wn.h); q.fillStyle = 'rgba(20,16,20,.55)'; q.fillRect(-Wn.w / 2, Wn.h * .22, Wn.w, Wn.h * .3); q.fillStyle = 'rgba(12,10,14,.8)'; q.fillRect(-Wn.w / 2, Wn.h * .28, Wn.w, Wn.h * .06); } });
      // the sitter: cross-legged on a flat cushion, hands open on the knees, breathing; lit by the window and the candle
      const St = ROOM.sitter;
      if (inFrame(m, St.x, St.y, 3) && cam.z < 4) {
        // a low dark mat on the floor (seen from above-front), the window's light on its far edge
        g.fillStyle = 'rgba(3,3,8,.45)'; g.beginPath(); g.ellipse(St.x - 6, St.y + 25 * St.s, 64 * St.s, 9 * St.s, 0, 0, TAU); g.fill();
        g.fillStyle = '#2e2530'; g.beginPath(); g.moveTo(St.x - 70 * St.s, St.y + 12 * St.s); g.lineTo(St.x + 46 * St.s, St.y + 12 * St.s); g.lineTo(St.x + 54 * St.s, St.y + 28 * St.s); g.lineTo(St.x - 78 * St.s, St.y + 28 * St.s); g.closePath(); g.fill();
        g.fillStyle = 'rgba(241,217,168,.14)'; g.fillRect(St.x - 70 * St.s, St.y + 12 * St.s, 116 * St.s, 1.2 * St.s);
        figure(g, St.x, St.y, St.s, { hip: [1.6, 1.46], kn: [2.95, 2.75], lean: .03, head: .06, sh: [.62, .52], el: [1.02, 1.08], hands: ['open', 'open'] }, { t, seed: St.seed, accent: '#8a5a3a', dress: { pants: '#2a2128' }, light: { x: fl[0], y: fl[1], col: F6.amberCore, a: .5 }, rim: rgba('#f1d9a8', .75), rimSide: -1, flip: true, shadow: false });
      }
      // the sheet on the floor: the same sheet, older
      drawSheet(g, t, SR.x, SR.y, SR.k, SR.k * m.k, false, .3);   // the old map never carried the modern words; it lies flat (a thin shadow)
      // the candle (the ember of this room)
      ember(g, t, { x: ROOM.candle.x, y: ROOM.candle.y, kind: 'candle', s: ROOM.candle.s, r: 0 });   // its halo is drawn below, in screen space
    });
    candleHalo(ctx, { x: m.X(fl[0]), y: m.Y(fl[1]), r: 300 * ROOM.candle.s * m.k * breathe(t, 60, 0, 'sine'), a: .9 });
    vignette(ctx, .5 - .36 * clamp((cam.z - 2) / 4));   // lighter inside the paper (no spotlight on the sheet)
    // the push into the flame: the light itself becomes the plate (c03>c04), a soft-edged region that grows until it covers the frame
    const uP = quartIO(lin(tStillE + .15, HO.a - 1 / 30, t));
    if (uP > 0) {
      const [pc, pg] = once('c03plate', () => canvas(W, H)); pg.setTransform(1, 0, 0, 1, 0, 0); pg.globalCompositeOperation = 'source-over'; pg.globalAlpha = 1; pg.clearRect(0, 0, W, H);
      const fx = m.X(fl[0]), fy = m.Y(fl[1]), rr = 40 + 1900 * uP, ko = Math.pow(1 - uP, 1.6);
      // the plate's bright core sits on the flame first and slides to the plate's own centre as the light fills the frame (0 at HO.a - 1/30)
      pg.fillStyle = '#7a2a12'; pg.fillRect(0, 0, W, H);
      pg.save(); pg.translate((fx - W / 2) * ko, (fy - H / 2) * ko); HO.plate(pg, t); pg.restore();
      pg.globalCompositeOperation = 'destination-in'; const mk = pg.createRadialGradient(fx, fy, rr * .62, fx, fy, rr); mk.addColorStop(0, 'rgba(0,0,0,1)'); mk.addColorStop(1, 'rgba(0,0,0,0)'); pg.fillStyle = mk; pg.fillRect(0, 0, W, H);
      ctx.drawImage(pc, 0, 0);
    }
  }

  // ---------- warm up the caches, then the entries (cuts only where a print or a sound changes; both sides are the same picture)
  const [wc, wg] = canvas(W, H); stage(wg, t0 + 1); stage(wg, tCaring + 1.3); stage(wg, tCare + 1); room(wg, tThey + 2); room(wg, HO.a - .1); await ready();
  const A = (t, sound) => ({ t, tr: 'cut', d: .1, print: HI.print, draw: stage, sound });
  const B = (t, sound) => ({ t, tr: 'cut', d: .1, print: HO.print, draw: room, sound });
  return [
    A(t0, [{ f: 'bloom', t: E('consciousness') + .04, v: .5 }]),
    A(tArt - .25, [{ f: 'whoosh_airy', t: tArt - .2, v: .4 }]),
    A(tCaring - .3, [{ f: 'swell', t: tSecondE + .08, v: .45 }]),
    A(tAnd - .15, [{ f: 'whoosh', t: E('problem') + .06, v: .35 }]),
    A(S('Every') - .25, [{ f: 'card', t: tDoingE + .1, v: .4 }, { f: 'pages', t: tOutsideE + .15, v: .45 }]),
    B(tSwitch, []),
    B(tStillE + .1, [{ f: 'bloom', t: tStillE + .35, v: .5 }]),
  ];
};
