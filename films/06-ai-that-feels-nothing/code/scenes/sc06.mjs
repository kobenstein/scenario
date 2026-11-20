// Film 6 · c06 · §3a: "Science asks it differently." … "Nobody rewards them."  (03a, C5 Anil Seth, start of 03b)
// ONE take, two worlds joined inside one pane. World A: the dark ground of the amber line plate; the pulse line runs into "you"; the ember
// lights in the chest; a dark window pane rises at the left and becomes Seth's screen. Then the screen goes dark, a night light comes on
// behind the glass (the pane turns: screen → window) and the camera pushes through the glass into world B, a night nursery: two bassinets,
// the laundry corner with the stranger and the toddler, the study page on the floor; the camera pushes into the page = the paper plate.
// Every entry below draws the same frame function; entries only split it for sound and the plates' print.
//
// shot  VO words                                    image                                                        hero light   camera                   flows on          ★  sound
// 6.01  Science asks it differently.                the amber plate line beats once: an engraved heartbeat       pulse        identity (the plate)     take                 whoosh_airy
//                                                   (P·QRS·T) runs across the frame left to right
// 6.02  Is there something it feels like to be     you rise out of the dark at the right (figure scale, facing  pulse        slow push (z 1→1.08)     take
//       you, right now?                             the line); the line's right end is drawn into the chest;
//                                                   on "right now?" a second beat runs the line and lands in
//                                                   the chest: the ember lights (heart kind)
// 6.03  There is.                                   ★ the ember's first big breath: the body warms (form light,  ember        hold with life           take                 bloom
//                                                   rim, warm pool on the ground), goose bumps run down the arms
// 6.04  And for the brain scientist Anil Seth,      three small cool gears turn in the head (callback to §2);   ember        pull back (z 1)          take
//       that feeling doesn't start in thinking.     a dark window pane rises at the left; ANIL SETH · UNIVERSITY
//                                                   OF SUSSEX; on "thinking" the gears stop and sink into the dark
// 6.05  It starts in a body trying to stay alive.   push to the chest: the breath moves the chest, the ember      ember        push (z 1.32)            take
//                                                   beats at 60
// 6.06  A heartbeat. Hunger. Fear.                  a beat runs the line into the chest (spike) · the ember sinks ember        hold                     take                 boom_soft
//                                                   into the belly · the body flinches, the light spikes
// 6.07  CLIP C5 Seth (18 s)                         the camera moves to the pane; the screen switches on inside  screen       move (z 1.31)            take                 whoosh_up
//                                                   the world (TV line); lower third ANIL SETH · NEUROSCIENTIST,
//                                                   UNIVERSITY OF SUSSEX · TED 2026 · APRIL 2026
// 6.08  That may be why you came into the world     the screen goes dark; a night light comes on behind the      night light  push through the glass   fly into the pane    screen_off · bulb
//       already caring.                             glass: the nursery (pane turn); the camera pushes through    (lamp)       (z 2.16 → nursery z 1)
//                                                   the window into the room: a baby asleep in a bassinet
// 6.09  Newborns cry when other babies cry.         two bassinets; baby A stirs and cries, baby B 100 ms later   lamp         push to the cribs        take
//                                                   with less; the warm glow spreads from A to B;
//                                                   SAGI & HOFFMAN · DEVELOPMENTAL PSYCHOLOGY · 1976
// 6.10  Toddlers help strangers without being       pan to the laundry corner: a stranger pegging baby clothes   lamp         pan (z 1.25)             take                 drop
//       asked.                                      on a clothes horse drops a peg, reaches, can't; the toddler
//                                                   squats, picks it up, stands and hands it up; the stranger
//                                                   takes it; WARNEKEN & TOMASELLO · SCIENCE · 2006
// 6.11  Nobody rewards them.                        the stranger goes back to pegging; the camera pushes into    lamp         push (z 1.25 → 12)       fly into the page    pages
//                                                   the study page on the floor: its surface IS the cream plate               → paper plate
// plates: in = line amber c05>c06 (the plate's ground and line are drawn by this chunk's own copies, so the first frame IS the plate);
//         out = paper cream c06>c07 (the page's surface is HO.plate in screen space, clipped to the sheet; the push makes it fill the frame).
// Ambience: world A none (or atmo/nightsky very low); world B atmo/ward (low). Print: riso .3; the plate entries carry the plates' print.
import { W, H, rgba, clamp, lin, mix, sm, eout, canvas } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { F6, ready, view, camMap, riseFromDark, ember, clipPane, lowerThird, pane, glassRect, coolLine } from '../lib/f6_kit.mjs';
import { figure, figureKid, POSES, KIDPOSES, reachArm } from '../lib/figure.mjs';
import { prepareClips } from '../lib/kit.mjs';
import { bezier, QUART, EXPO_OUT, lineGround, pulseLine, ecg, gears, gooseBumps, sourceLabel, NB, nurseryWall, dresser, bassinet, rack, peg, page, motes } from '../lib/f6_c06_world.mjs';

const TAU = Math.PI * 2;
const lerp = (A, B, u) => ({ x: mix(A.x, B.x, u), y: mix(A.y, B.y, u), z: Math.exp(mix(Math.log(A.z), Math.log(B.z), u)) });
const camOn = (SEGS) => (t) => { let cur = SEGS[0][2]; for (const [t0, t1, A, B, ease] of SEGS) { if (t < t0) break; if (t >= t1) { cur = B; continue; } return lerp(A, B, (ease || QUART)((t - t0) / (t1 - t0))); } return cur; };
// pose blending (figure / figureKid pose objects): numbers and pairs
const PKEYS = ['lean', 'head', 'dy'], PPAIRS = ['sh', 'el', 'hip', 'kn'];
const FIGD = { lean: 0, head: 0, dy: 0, sh: [.18, .08], el: [.32, .26], hip: [.05, -.05], kn: [0, 0] };
const poseMix = (A, B, u) => { const o = {}; for (const k of PKEYS) o[k] = mix(A[k] ?? FIGD[k], B[k] ?? FIGD[k], u); for (const k of PPAIRS) { const a = A[k] ?? FIGD[k], b = B[k] ?? FIGD[k]; o[k] = [mix(a[0], b[0], u), mix(a[1], b[1], u)]; } return o; };
const poseAt = (KEYS, t) => { let cur = KEYS[0][2]; for (const [t0, t1, A, B, ease] of KEYS) { if (t < t0) break; if (t >= t1) { cur = B; continue; } return poseMix(A, B, (ease || QUART)((t - t0) / (t1 - t0))); } return poseMix(cur, cur, 0); };
// where a toddler's feet are under a pose (figure units; KIDP.toddler legs 15.5 + 14, the foot ellipse 2.4 below the ankle + 4 radius)
const kidFootY = (P) => { let m = 0; for (let i = 0; i < 2; i++) { const a = P.hip[i], k = P.kn[i]; m = Math.max(m, Math.cos(a) * 15.5 + Math.cos(a - k) * 14); } return m + 6.4; };

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c06', T);
  const S3 = (p, n) => T.S('03a', p, n), E3 = (p, n) => T.E('03a', p, n), S4 = (p, n) => T.S('03b', p, n), E4 = (p, n) => T.E('03b', p, n);
  // ---- anchors (words, never seconds)
  const tSci = S3('Science'), tIs = S3('Is there'), tYou = S3('you,'), tRight = S3('right'), tNow = E3('now?'), tThere = S3('There is'), tThereE = E3('is.');
  const tAnd = S3('And for'), tBrain = S3('brain'), tSeth = S3('Seth'), tThink = S3('thinking'), tIt = S3('It starts'), tBody = S3('body'), tAlive = E3('alive');
  const tHeart = S3('heartbeat'), tHeartE = E3('heartbeat'), tHunger = S3('Hunger'), tFear = S3('Fear'), tFearE = E3('Fear');
  const C5 = T.clip('C5');
  const tThat = S4('That may'), tWorld = E4('world'), tAlready = S4('already'), tCaringE = E4('caring');
  const tNew = S4('Newborns'), tCry = S4('cry'), tOther = S4('other'), tCryE = E4('cry', 1);
  const tTodd = S4('Toddlers'), tHelp = S4('help'), tStr = S4('strangers'), tWithout = S4('without'), tAsked = S4('asked'), tAskedE = E4('asked');
  const tNobody = S4('Nobody'), tThemE = E4('them');
  const tEnd = HO.a - 1 / 30;                         // by here the frame IS the paper plate
  // ---- derived moments
  const tBeat1 = tSci - .1;                           // 6.01: the beat enters from the left
  const tRetract0 = tIs + .35, tRetract1 = tYou + .3; // the line's right end is drawn into the chest
  const tRise0 = tIs + .1;                            // you rise out of the dark
  const tBeat2 = tRight - .05, tLand2 = tNow - .05;   // the second beat lands in the chest: the ember lights
  const tWarm = tThere + .05;                         // 6.03 the body warms
  const tGear0 = tBrain, tGearStop = tThink + .05, tGearSink = tThink + .3;
  const tPane0 = tSeth - .1;                          // the window pane rises at the left
  const tBeat3 = tHeart - .05, tLand3 = tHeartE - .02;
  const tHung0 = tHunger + .02, tFear0 = tFear + .02;
  const tMoveW = tFearE - .25, tMoveWE = C5.start + .15;      // the camera moves to the pane; the screen switches on while it arrives
  const tTurn = C5.end + .5 + .17;                    // the pane turn: the night light comes on behind the glass (after the switch-off line)
  const tPush0 = tTurn + .65, tH = tWorld + .45;      // the push through the glass; tH = the handover into the nursery
  const tCryA = tCry, tCryB = tCry + .1;              // baby A cries; baby B 100 ms later, less
  const tPan0 = tTodd - .35, tPan1 = tHelp - .1;      // the pan to the laundry corner
  const tDrop = tHelp - .36, tLandP = tHelp - .06;    // the peg drops and lands in the pause before "help"
  const tReach = tLandP + .08;                        // the stranger reaches (80 ms after the contact)
  const tLook = tLandP + .3, tSquat = tLook + .25, tGrab = tSquat + .5, tUp = tGrab + .1, tOffer = tUp + .55, tTake = tOffer + .4, tBack = tAskedE + .35;
  const tPushP = tNobody + .45;                        // 6.11 the push into the page

  // ---- world A geometry
  const LY = 560, S = 3, FX = 1290, FY = LY + 44 * S, CH = [FX - 10 * S, LY];   // you (hip), the chest (the line ends here)
  const PW = 840, PH = 1080 * PW / 1920, PX = 440, PY = 290, sB = PW / 1920;     // the pane above the line: the nursery world (1920×1080) fills it exactly
  const CAM0 = { x: 960, y: 540, z: 1 }, CAM1 = { x: 1010, y: 556, z: 1.08 }, CAM2 = { x: 960, y: 556, z: 1 }, CAM3 = { x: 1180, y: 600, z: 1.32 };
  const zW = 1180 / PW, CAMW = { x: PX, y: PY + (540 - 420) / zW, z: zW };       // the pane lands at screen (960, 420), 1180 wide; the line passes under it
  const CAMF = { x: PX, y: PY, z: 1920 / PW * 1.012 };                          // the pane covers the frame (with a margin)
  const SOFT = bezier(.42, 0, .58, 1), PUSH = bezier(.5, 0, .7, 1);   // SOFT: no dead ends on the holds; PUSH: an even run into the page
  const camA = camOn([
    [tIs - .1, tNow + .3, CAM0, CAM1, SOFT],
    [tAnd, tSeth + .4, CAM1, CAM2, SOFT],
    [tIt, tAlive, CAM2, CAM3, SOFT],
    [tMoveW, tMoveWE, CAM3, CAMW],
    [tPush0, tH, CAMW, CAMF],
  ]);
  // ---- world B camera (the nursery): identity-scaled at the handover, then the cribs, the laundry corner, the page
  const zH = CAMF.z * sB, PG = NB.page;
  const CB0 = { x: 960, y: 540, z: zH }, CB1 = { x: 720, y: 640, z: 1.3 }, CB2 = { x: 1470, y: 690, z: 1.25 }, CB3 = { x: PG.x, y: PG.y + 20, z: 13.5 };
  const camB = camOn([
    [tH, tAlready + 1.2, CB0, CB1],
    [tPan0, tPan1, CB1, CB2],
    [tPushP, tEnd, CB2, CB3, PUSH],
  ]);

  // ---- the pulse line: y(x) with the travelling beats; its right end
  const beats = [[tBeat1, -520, 2600, 1.25], [tBeat2, -520, CH[0] + 20, tLand2 - tBeat2], [tBeat3, -520, CH[0] + 20, tLand3 - tBeat3]];   // [t0, x from, x to, duration]
  const lineEnd = (t) => mix(W / 2 + 1400, CH[0], QUART(lin(tRetract0, tRetract1, t)));
  const yAt = (t) => (x) => { let y = LY; for (const [t0, xa, xb, d] of beats) { if (t < t0 || t > t0 + d + .3) continue; const bx = mix(xa, xb, (t - t0) / d); y -= ecg(x - bx); } return y; };
  // ---- the ember in the chest: lit when the second beat lands; breath at 60 (heart); hunger sinks it; fear and the beats spike it
  const emberState = (t) => {
    if (t < tLand2) return { a: 0, r: 0, y: CH[1] };
    const on = EXPO_OUT(lin(tLand2, tLand2 + .14, t));
    let flash = 1 + .5 * Math.exp(-(t - tLand2) / .45);
    if (t > tLand3) flash += .45 * Math.exp(-(t - tLand3) / .4);
    if (t > tFear0) flash += .7 * Math.exp(-(t - tFear0) / .55);
    const grow = mix(105, 150, EXPO_OUT(lin(tWarm, tWarm + .7, t)));
    const hung = sm(lin(tHung0, tHung0 + .4, t)) * (1 - QUART(lin(tFear0 - .1, tFear0 + .18, t)));   // the hollow in the belly, released by the fear
    return { a: on * (1 - .25 * hung), r: grow * on * (1 - .38 * hung) * (1 + .12 * sm(lin(tFear0, tFear0 + .2, t)) * (1 - sm(lin(tFear0 + .4, tFear0 + 1.4, t)))), y: CH[1] + 108 * hung, flash };
  };
  // ---- you: pose with the flinch on "Fear."
  const BASE = { ...POSES.stand, head: .05, sh: [.3, .2], el: [.5, .45] }, FLINCH = { ...BASE, lean: -.11, head: -.14, sh: [.6, .42], el: [.95, .85], dy: -2.5 };
  const youPose = (t) => { const k = EXPO_OUT(lin(tFear0, tFear0 + .18, t)) * (1 - QUART(lin(tFear0 + .35, tFear0 + 1.1, t))); return k > 0 ? poseMix(BASE, FLINCH, k) : BASE; };
  // ---- the gears in the head: turn at 1.1 rad/s, stop on "thinking"
  const gearAng = (t) => { const w = 1.1, D = .6; if (t < tGearStop) return w * (t - tGear0); const u = lin(tGearStop, tGearStop + D, t); return w * (tGearStop - tGear0) + w * D * (u - u * u / 2); };

  // ---- world B: the nursery drawn with a camera; lit 0..1 scales the lamp (the night light coming on)
  const GRAB = { hip: [1.95, 1.85], kn: [2.5, 2.4], lean: .92, sh: [.5, .42], el: [.12, .3], head: .45, dy: 0 };
  const kidKeys = [
    [tSquat, tSquat + .45, KIDPOSES.stand, GRAB],
    [tUp, tUp + .45, GRAB, KIDPOSES.hold],
    [tOffer, tOffer + .35, KIDPOSES.hold, KIDPOSES.reachUp],
    [tBack + .3, tBack + .8, KIDPOSES.reachUp, KIDPOSES.stand],
  ];
  const ADULT = { sh: [1.45, 1.4], el: [.12, .22], lean: .05, head: .12, lock: [true, true] };
  const RK = NB.rack, AD = NB.adult, KD = NB.kid, SA = 2.2;
  const pegFloor = [AD[0] + 128, NB.floorY - 4];
  const nurseryFrame = (ctx, t, cam, lit) => {
    const lampA = lit;
    view(ctx, cam, .94, (g) => nurseryWall(g));
    let L = null;
    view(ctx, cam, 1, (g) => {
      dresser(g, 1130, NB.floorY);
      L = ember(g, t, { x: NB.lamp[0], y: NB.lamp[1], kind: 'lamp', s: 1.15, dir: -.42, a: lampA, r: 260, cone: 1.1 });
      // the pool of lamp light on the floor and the wall behind
      g.save(); g.globalCompositeOperation = 'lighter'; const pg = g.createRadialGradient(900, 700, 0, 900, 700, 900); pg.addColorStop(0, rgba(F6.amber, .13 * lampA)); pg.addColorStop(1, rgba(F6.amber, 0)); g.fillStyle = pg; g.fillRect(-500, -300, 3000, 1600); g.restore();
      const light = { x: L.x, y: L.y, col: F6.amberCore, a: .62 * lampA };
      // the bassinets (A nearer the lamp); the glow of a cry spreads from A to B
      const cryA = sm(lin(tCryA, tCryA + .5, t)) * (1 - sm(lin(tPan1, tPan1 + 2, t))), cryB = .8 * sm(lin(tCryB, tCryB + .9, t)) * (1 - sm(lin(tPan1, tPan1 + 2, t)));
      const gA = cryA, gB = cryB, travel = sm(lin(tCryA + .05, tCryA + .4, t));
      const bA = [NB.cribA[0], NB.floorY - 70 - 24 * 2.6], bB = [NB.cribB[0], NB.floorY - 70 - 24 * 2.5];
      if (gA > 0) ember(g, t, { x: bA[0], y: bA[1], kind: 'glow', r: 190, a: .5 * gA * lampA });
      if (travel > 0 && travel < 1) ember(g, t, { x: mix(bA[0], bB[0], travel), y: mix(bA[1], bB[1], travel), kind: 'glow', r: 110, a: .35 * Math.sin(travel * Math.PI) * lampA });
      if (gB > 0) ember(g, t, { x: bB[0], y: bB[1], kind: 'glow', r: 150, a: .4 * gB * lampA });
      bassinet(g, NB.cribA[0], NB.cribA[1], 2.6, { t, cry: cryA, skin: '#d9a984' });
      bassinet(g, NB.cribB[0], NB.cribB[1], 2.5, { t: t + 2.3, cry: cryB, skin: '#b98762', blanket: '#e9dcc8' });
      // the laundry corner: the clothes horse, the stranger, the toddler, the peg
      rack(g, RK[0], RK[1], { t });
      // the peg's place: in the stranger's front hand until it slips; the fall; the floor; the toddler's hand; the stranger's hand again
      const reachU = EXPO_OUT(lin(tReach, tReach + .5, t)) * (1 - QUART(lin(tBack, tBack + .6, t)));
      const toKid = sm(lin(tOffer + .15, tOffer + .45, t));
      // the toddler first (its hand position decides the stranger's second reach)
      const KP = poseAt(kidKeys, t), look = sm(lin(tLook, tLook + .3, t)) * (1 - sm(lin(tSquat, tSquat + .4, t)));
      const kidPose = { ...KP, head: KP.head + .32 * look };
      const kidY = NB.floorY - kidFootY(kidPose) * SA;
      const kid = figureKid(g, KD[0], kidY, SA, kidPose, { age: 'toddler', t, seed: 4, flip: true, hair: 'curly', accent: '#d9824a', light, rim: rgba(F6.amberCore, .45 * lampA), rimSide: -1 });
      const kidHand = kid.hand(0);
      // the stranger: both hands at the bar; the front arm reaches for the peg, then meets the toddler's hand
      const o = { t, seed: 11, dress: { coat: '#4f6a5e', pants: '#23263a' }, light, rim: rgba(F6.amberCore, .5 * lampA), rimSide: -1 };
      const AP = { ...ADULT, sh: [...ADULT.sh], el: [...ADULT.el] };
      const ay = NB.floorY - 90 * SA;
      if (reachU > 0) {
        const target = toKid > 0 ? [mix(pegFloor[0], kidHand[0] + 8, toKid), mix(pegFloor[1], kidHand[1] - 6, toKid)] : pegFloor;
        const r = reachArm(AD[0], ay, SA, AP, 0, false, o, target, 1);
        AP.sh[0] = mix(AP.sh[0], r.sh, reachU); AP.el[0] = mix(AP.el[0], r.el, reachU); AP.lean = mix(AP.lean, mix(.5, .42, toKid), reachU); AP.head = mix(AP.head, .42, reachU);
      }
      const adult = figure(g, AD[0], ay, SA, AP, o);
      const aHand = adult.hand(0);
      // the peg
      let P;
      if (t < tDrop) P = [aHand[0] + 4, aHand[1] + 2, -.2];
      else if (t < tGrab) { const u = lin(tDrop, tLandP, t), fall = u * u, hx = AD[0] + 136, k = lin(tLandP, tLandP + .18, t), bx = mix(hx, pegFloor[0], Math.min(1, u * .3 + k * .7)), by = mix(NB.floorY - 316, pegFloor[1], fall); const bounce = 26 * Math.sin(Math.PI * k); P = [bx, by - bounce, -.2 + u * 1.9 + k * 1.1]; }
      else if (t < tTake) P = [kidHand[0] - 4, kidHand[1] - 2, -.9 + .9 * sm(lin(tUp, tUp + .4, t))];
      else P = [aHand[0] + 4, aHand[1] + 2, -.2];
      peg(g, P[0], P[1], 1.2, P[2]);
      // the study page on the floor (its surface is the paper plate)
      page(g, t, { ...PG, plate: HO.plate, shade: 1 - sm(lin(tPushP + .25, tEnd - .2, t)) });
    });
    view(ctx, cam, 1.1, (g) => motes(g, t, NB.lamp[0] + 230, NB.lamp[1] + 40, 5, 26, 420));
  };
  const [NC, ng] = canvas(W, H);   // the nursery as seen through the glass (phase 1): drawn whole, darkened while the light is still off

  // ---- THE TAKE
  const frame = (ctx, t) => {
    if (t >= tEnd) { HO.plate(ctx, t); return; }
    if (t >= tH) {   // world B: the nursery
      nurseryFrame(ctx, t, camB(t), 1);
      sourceLabel(ctx, t, 'SAGI & HOFFMAN  ·  DEVELOPMENTAL PSYCHOLOGY  ·  1976', tCry + .2, tCryE + .5);
      sourceLabel(ctx, t, 'WARNEKEN & TOMASELLO  ·  SCIENCE  ·  2006', tStr - .1, tPushP - .1);
      return;
    }
    const cam = camA(t), E = emberState(t), rise = lin(tRise0, tRise0 + .8, t), lit = sm(lin(tTurn, tTurn + .6, t));
    const warm = EXPO_OUT(lin(tWarm, tWarm + 1.1, t));
    // the ground (the plate's), warmed by the ember
    view(ctx, cam, .97, (g) => {
      lineGround(g, t, { y: LY });
      if (E.a > 0) { const k = E.a * (.4 + .6 * warm); g.save(); const tg = g.createRadialGradient(CH[0], E.y + 60, 0, CH[0], E.y + 60, 1100); tg.addColorStop(0, rgba('#3a1c14', .7 * k)); tg.addColorStop(.6, rgba('#2a1410', .45 * k)); tg.addColorStop(1, rgba('#1a0e10', 0)); g.fillStyle = tg; g.fillRect(-800, -500, 3600, 2100);
        g.globalCompositeOperation = 'lighter'; const wg = g.createRadialGradient(CH[0], E.y, 0, CH[0], E.y, 620); wg.addColorStop(0, rgba('#6a3014', .5 * k)); wg.addColorStop(1, rgba('#6a3014', 0)); g.fillStyle = wg; g.fillRect(-800, -500, 3600, 2100); g.restore(); }
    });
    view(ctx, cam, 1, (g) => {
      // the pulse line (behind the pane and the body)
      pulseLine(g, t, { x1: lineEnd(t), yAt: yAt(t), head: t > tRetract0 && t < tRetract1 + .05 });
      // the warm pool under the feet
      if (E.a > 0) { g.save(); g.translate(FX - 6, FY + 90 * S); g.scale(1, .2); g.globalCompositeOperation = 'lighter'; const fl = g.createRadialGradient(0, 0, 0, 0, 0, 430); fl.addColorStop(0, rgba(F6.amber, .18 * E.a * warm)); fl.addColorStop(1, rgba(F6.amber, 0)); g.fillStyle = fl; g.beginPath(); g.arc(0, 0, 430, 0, TAU); g.fill(); g.restore(); }
    });
    // you: rise out of the dark, then alive with the ember's light
    const m = camMap(cam, 1);
    const drawYou = (g) => {
      if (E.a > 0) ember(g, t, { x: CH[0], y: E.y, kind: 'heart', r: E.r, a: E.a * Math.min(1.3, E.flash) });
      const fig = figure(g, FX, FY, S, youPose(t), { t, seed: 7, flip: true, accent: '#4a3a58', dress: { pants: '#1a1420' }, light: { x: CH[0], y: E.y, col: F6.amberCore, a: .75 * E.a * (.5 + .5 * warm) }, rim: rgba(F6.amber, .85 * E.a), rimSide: -1, cast: E.a > 0 ? { x: CH[0] - 300, y: 100, a: .3 * E.a } : null, shadow: true });
      if (E.a > 0) ember(g, t, { x: CH[0], y: E.y, kind: 'heart', r: E.r * .62, a: .9 * E.a * Math.min(1.5, E.flash) });   // the warmth through the coat
      if (t > tWarm) { const sh = [FX - 2 * S, FY - 57 * S]; gooseBumps(g, t, sh, fig.hand(0), tWarm + .15, 3, S / 2.2); gooseBumps(g, t, [sh[0] + 4 * S, sh[1]], fig.hand(1), tWarm + .3, 5, S / 2.2); }
    };
    if (rise < 1) riseFromDark(ctx, rise, (g) => { g.setTransform(m.k, 0, 0, m.k, m.tx, m.ty); drawYou(g); }, { col: '#0a0c22' });
    else view(ctx, cam, 1, (g) => drawYou(g));
    // the clockwork in the head: rises on "brain scientist", stops on "thinking", sinks into the dark
    const gu = Math.min(EXPO_OUT(lin(tGear0, tGear0 + .5, t)), 1 - lin(tGearSink, tGearSink + .5, t));
    if (gu > 0) { const drawG = (q) => gears(q, t, { x: FX - .5 * S, y: FY - 88 * S, s: 1.4, ang: gearAng(t) }); if (gu < 1) riseFromDark(ctx, gu, (q) => { q.setTransform(m.k, 0, 0, m.k, m.tx, m.ty); drawG(q); }, { col: '#0a0c22' }); else view(ctx, cam, 1, (g) => drawG(g)); }
    // the pane: a dark window rising at the left; Seth's screen; then the window onto the nursery
    const pu = EXPO_OUT(lin(tPane0, tPane0 + .7, t));
    if (pu > 0) {
      const drawPane = (g) => {
        if (t < tTurn) { clipPane(g, t, T, 'C5', PX - PW / 2, PY - PH / 2, PW, PH, { frame: 'window', radius: 2, edge: .7 }); return; }
        // the pane turn: the nursery behind the glass, lit by its night light coming on; then the camera passes through the glass
        const kGlass = 1 - sm(lin(tH - .4, tH - .05, t));
        const P = pane(g, t, { x: PX, y: PY, w: PW, h: PH, radius: 2, dark: false, edge: 0, frame: 'none', sheen: 0, spill: false });
        g.save(); P.path(); g.clip();
        glassRect(g, t, PX - PW / 2, PY - PH / 2, PW, PH, { sheen: 0 });
        ng.setTransform(1, 0, 0, 1, 0, 0); ng.globalCompositeOperation = 'source-over'; ng.globalAlpha = 1; ng.clearRect(0, 0, W, H);
        nurseryFrame(ng, t, { x: 960, y: 540, z: 1 }, lit);
        if (lit < 1) { ng.globalCompositeOperation = 'source-atop'; ng.fillStyle = rgba(F6.glassBot, 1 - lit); ng.fillRect(0, 0, W, H); }
        g.save(); g.translate(PX, PY); g.scale(sB, sB); g.drawImage(NC, -960, -540); g.restore();
        g.fillStyle = `rgba(10,15,36,${.14 * kGlass})`; g.fillRect(PX - PW / 2, PY - PH / 2, PW, PH);
        g.restore();
        pane(g, t, { x: PX, y: PY, w: PW, h: PH, radius: 2, dark: false, edge: .7 * kGlass, frame: 'window', sheen: kGlass, spill: false });
        // the switch-off line of the screen, continued (the kit draws it only while clipPane is called)
        const pre = 1 - sm(lin(C5.end + .5, C5.end + .9, t)); if (pre > 0) coolLine(g, t, { from: [PX - PW / 2 + 8, PY], to: [PX + PW / 2 - 8, PY], a: pre, head: false, w: 1.4 });
      };
      if (pu < 1) riseFromDark(ctx, pu, (g) => { g.setTransform(m.k, 0, 0, m.k, m.tx, m.ty); drawPane(g); }, { col: '#0a0c22' });
      else view(ctx, cam, 1, (g) => drawPane(g));
    }
    // dust drifting in the dark from the first frame (life in every hold), more of it in the ember's light (nearest plane)
    view(ctx, cam, 1.06, (g) => motes(g, t, 880, 540, 11, 34, 820, sm(lin(HI.b, HI.b + .9, t))));
    if (E.a > 0) view(ctx, cam, 1.08, (g) => motes(g, t, CH[0] - 120, E.y, 9, 18, 360, E.a));
    // screen space: the lower third while the clip plays; the Seth label before
    sourceLabel(ctx, t, 'ANIL SETH  ·  UNIVERSITY OF SUSSEX', tSeth + .2, tIt - .2);
    if (t > C5.start - .2 && t < C5.end + .2) lowerThird(ctx, t, T, 'C5', { y: 850 });
  };

  // ---- warm up (the layers paint on first use), preload the clip's edges, then await pending images
  await prepareClips(T, C5.start); await prepareClips(T, C5.end + .3);
  const [, wg] = canvas(W, H);
  for (const tt of [tThere + .5, tSeth + 1, C5.start + 1, tTurn + .4, tCry + .6, tAsked, tPushP + .8]) { wg.setTransform(1, 0, 0, 1, 0, 0); frame(wg, tt); }
  await ready();

  const P = { riso: .3 };
  return [
    { t: HI.b, tr: 'cut', d: .1, print: HI.print, draw: frame, sound: [{ f: 'whoosh_airy', t: tBeat1 - .1, v: .4 }] },
    { t: tIs, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'bloom', t: tLand2 - .02, v: .5 }] },
    { t: tAnd, tr: 'cut', d: .1, print: P, draw: frame },
    { t: tIt, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'boom_soft', t: tLand3, v: .45 }] },
    { t: tMoveW, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'whoosh_up', t: C5.start - .45, v: .35 }] },
    { t: C5.end, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'screen_off', t: C5.end + .05, v: .4 }, { f: 'bulb', t: tTurn - .05, v: .4 }] },
    { t: tNew, tr: 'cut', d: .1, print: P, draw: frame },
    { t: tTodd, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'drop', t: tLandP, v: .45 }] },
    { t: tPushP - .2, tr: 'cut', d: .1, print: HO.print, draw: frame, sound: [{ f: 'pages', t: tThemE + .1, v: .4 }] },
  ];
};
