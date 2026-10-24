// c01 · Hook + road map (00a, 01a to "And again.") · 0.00–74.94 · morning → forenoon · ★ 1.01 (the Führung at the start line)
// ONE world (the valley, lib/f10_kit.mjs). Drawn parts are continuous takes; the cuts are clip cuts (ORIGINAL FOOTAGE) only.
//
// | ID   | anchor            | image                                                                 | 1–2 movements                    | camera                         | on →                    |
// |------|-------------------|-----------------------------------------------------------------------|----------------------------------|--------------------------------|-------------------------|
// | 1.01★| body @3.24        | backlit start line: a human hand guides a robot hand; robot steps over | fingers close · the step         | hold + 2 % push, pull back 2.3 s| clip cut on "Last"      |
// | 1.02 | Beijing @5.40     | K1a (start 2025)                                                      | footage                          | –                              | clip cut on "Most"      |
// | 1.03 | head @12.28       | our road as race track: four robots sit, a helper kneels, a head rolls | the head · side track            | truck 3.3 s quart              | clip cut "One year"     |
// | 1.04–1.06 | faster @15.08 | K2a (times written by the trace) · K2c (barrier, set back up) · K2a end | footage + text                 | –                              | clip cut on "They"      |
// | 1.07 | hands @25.43      | at our barrier: your hands steady the robot; on "For now" one lets go | the hand lifts · 3 % push        | push                           | plan sequence           |
// | 1.08 | teaching @28.17   | tilt to the hands: the trace (warm) flows into the robot's arm        | trace · tilt                     | push/tilt 1.6 s                | drive                   |
// | 1.09 | working @30.49    | crane: the road runs to the fork (hall left by the river, house right)| crane · trace hesitates at fork  | crane 4.5 s sine               | plan sequence           |
// | 1.10 | thirteen @34.53   | the valley from high above: a small group walks onto the road         | the group · text                 | hold, drift                    | plan sequence           |
// | 1.11 | billion @40.77    | the group floods all ways of the valley                               | the spread · pull back           | pull back 3.4 s                | plan sequence           |
// | 1.12 | robots @42.85     | the full valley; the sun clears the ridge, a light edge crosses        | light edge                       | (descent starts softly)        | drive down              |
// | 1.13 | hands @44.93      | down into the crowd to one robot raising both hands; many behind      | descent                          | log-distance dolly 3.3 s       | plan sequence           |
// | 1.14 | ours @47.09       | your hand lays on the raised robot hand; trace in, a warm wave runs back| the hand · the wave            | hold                           | drive up                |
// | 1.15 | coming @51.09     | crane up: the road climbs out of the valley into the mist              | crane · the crowd sinks back     | crane 3.2 s                    | pan                     |
// | 1.16 | planet @53.49     | pan right: the far hill with a pale stepped scar                       | pan                              | pan 2.5 s (7°)                 | tilt                    |
// | 1.17 | life @57.41       | tilt down to the house: the sun reaches its window, two birds rise    | light in the window · birds      | tilt 3.5 s; from 58.0 descent  | drive down to the hall  |
// | 1.18 | learn @63.42      | down the slope to the hall: sawtooth roof, tall windows, CHINA sign   | the drive                        | 6.4 s sine, into the window    | fly through the window  |
// | 1.19 | cup @67.74        | inside at noon light: the trainer lifts THE cup, the learner opposite | her arm                          | hold, 2 % push                 | clip cut "A robot"      |
// | 1.20 | Again @70.70      | K3 (VR trainer, robot mirrors), cuts on "Again" / "And again"         | footage                          | –                              | clip cut "Thousands"    |
// | 1.21 | Thousands @72.94  | the wide hall: 12 stations, robots lift cups 60 ms apart, halos        | the staggered lift               | hold, drift                    | plan sequence → c02     |
import * as K from '../lib/f10_kit.mjs';
const { W, H, rgba, clamp, lin, mix, PAL, VAL, sineS, qio, expoOut, expoIn } = K;

// the camera c02 starts from (wide hall, local coordinates of the hall turned into world)
const wideLocal = { x: 0, y: 4.2, z: 215.6, pitch: -.17, f: 1250 };
export const HALL_WIDE_CAM = (() => { const p = VAL.hallWorld([wideLocal.x, wideLocal.y, wideLocal.z]); return { x: p[0], y: p[1], z: p[2], yaw: VAL.hall.rot, pitch: wideLocal.pitch, f: wideLocal.f }; })();
const hallCam = (x, y, z, pitch = 0, f = 1700, dyaw = 0) => { const p = VAL.hallWorld([x, y, z]); return { x: p[0], y: p[1], z: p[2], yaw: VAL.hall.rot + dyaw, pitch, f }; };

export default async (T, R) => {
  await K.prepareKit();
  const A = (w, n) => T.S('00a', w, n), B = (w, n) => T.S('01a', w, n);
  const a = {
    body: A('body'), last: A('Last'), most: A('Most'), head: A('head'), oneYear: A('One year'), faster: A('faster'), oneOf: A('One of them'),
    feet: A('feet'), winner2: A('The winner', 1), they: A('They still'), hands: A('hands'), forNow: A('For now'), teaching: A('teaching'), andWho: A('And who'),
    working: A('working'), lastYear: A('Last year', 1), thirteen: A('thirteen'), by: A('By the middle'), billion: A('billion'), aBillion: A('A billion'),
    two: A('Two billion'), hands2: A('hands', 1), all: A('All of them'), learning: A('learning'), ours: A('ours'), inNext: A('In the next'), coming: A('coming'),
    what: A('What it'), planet: A('planet'), andHow: A('And how'), wake: A('wake'), life: A('life'), lifeE: T.E('00a', 'life'),
    here: B('And here'), learn: B('learn'), inHall: B('In a hall'), lifts: B('lifts'), cup: B('cup'), aRobot: B('A robot copies'), again1: B('Again'), again2: B('And again'), thousands: B('Thousands'),
  };
  const crashCut = a.oneOf + 2.4;
  const slots = {
    K1a: K.footage('K1a', a.last, a.most), K2a1: K.footage('K2a1', a.oneYear, a.oneOf), K2c1: K.footage('K2c1', a.oneOf, crashCut),
    K2c2: K.footage('K2c2', crashCut, a.winner2), K2a2: K.footage('K2a2', a.winner2, a.they),
    K3a: K.footage('K3a', a.aRobot, a.again1), K3b: K.footage('K3b', a.again1, a.again2), K3c: K.footage('K3c', a.again2, a.thousands),
  };
  const clip = (id, lt) => (ctx, t) => { K.clipSlot(ctx, t, slots[id], {}); if (lt) K.lowerThird(ctx, t, lt); if (id === 'K2a1') raceTimes(ctx, t, a.faster, a.oneOf); };
  const lt26 = { place: 'Beijing', date: 'April 2026', t0: a.oneYear }, lt3 = { place: 'China', date: 'Robot training centre', t0: a.aRobot };
  return [
    { t: 0, draw: startLine(a), print: { riso: .3 } },
    { t: a.last, draw: clip('K1a', { place: 'Beijing', date: 'April 2025', t0: a.last }), clip: true, print: false, sound: [{ f: 'whoosh_airy', t: a.last - .25, v: .15 }] },
    { t: a.most, draw: raceRoad(a), print: { riso: .3 } },
    { t: a.oneYear, draw: clip('K2a1', lt26), clip: true, print: false },
    { t: a.oneOf, draw: clip('K2c1', lt26), clip: true, print: false },
    { t: crashCut, draw: clip('K2c2', lt26), clip: true, print: false },
    { t: a.winner2, draw: clip('K2a2', lt26), clip: true, print: false },
    { t: a.they, draw: valleyTake(a), print: { riso: .3 }, sound: [{ f: 'shimmer_rings', t: a.teaching - .1, v: .25 }, { f: 'whoosh_up', t: a.andWho - .1, v: .18 }, { f: 'wings', t: a.life - .9, v: .35 }, { f: 'glass_hum', t: a.learn + .7, v: .2 }] },
    { t: a.aRobot, draw: clip('K3a', lt3), clip: true, print: false },
    { t: a.again1, draw: clip('K3b', lt3), clip: true, print: false },
    { t: a.again2, draw: clip('K3c', lt3), clip: true, print: false },
    { t: a.thousands, draw: hallWide(a, R.b), print: { riso: .3 } },
  ];
};

// ---------------------------------------------------------------- the two race times on K2a ("faster"): written by the trace
function raceTimes(ctx, t, t0, t1) {
  // a calm paper card top right (the clip's own banners sit low), the trace writes the two times in ink
  const x = 1256, y = 84, w = 580, h = 318, u = expoOut(lin(t0 - .2, t0 + .45, t)) * (1 - expoIn(lin(t1 - .45, t1, t)));
  if (u <= 0) return;
  ctx.save(); ctx.globalAlpha = u;
  ctx.fillStyle = 'rgba(20,16,12,.18)'; ctx.fillRect(x + 6, y + 8, w, h);
  ctx.fillStyle = rgba(PAL.paper, .95); ctx.fillRect(x, y, w, h);
  ctx.fillStyle = PAL.traceGlow; ctx.fillRect(x, y, 5, h);
  ctx.restore();
  K.traceWrite(ctx, t, { text: '50:26', x: x + 40, y: y + 118, size: 96, col: PAL.ink, t0: t0 + .25, t1: t1 - .5, dur: .6, source: 'Robot · winning time', srcSize: 19, srcCol: K.mixHex(PAL.ink, PAL.paper, .3) });
  K.traceWrite(ctx, t, { text: '57:20', x: x + 40, y: y + 258, size: 96, col: K.mixHex(PAL.ink, PAL.paper, .25), t0: t0 + .85, t1: t1 - .5, dur: .6, source: 'Human world record at the time', srcSize: 19, srcCol: K.mixHex(PAL.ink, PAL.paper, .3) });
}
const mixA = (c) => K.mixHex(c, '#d9cbb3', .25);

// ---------------------------------------------------------------- 1.01 ★ the start line
// The robot stands at the line (left, nearer), you stand half a step behind it (right, a little farther) and hold its hand from behind,
// like teaching a child to ride a bike. The two hands meet in the gap between you, in the low sun.
function startLine(a) {
  const yaw = -.5, fw = [Math.sin(yaw), Math.cos(yaw)], rt = [Math.cos(yaw), -Math.sin(yaw)];
  const sx = VAL.startX, rz = VAL.roadZ(sx);
  const RB = [sx + .4, 0, rz + .1];
  const HB = [RB[0] + rt[0] * .62 + fw[0] * .55, 0, RB[2] + rt[1] * .62 + fw[1] * .55];
  const HP = [RB[0] + rt[0] * .3 + fw[0] * .25, .86, RB[2] + rt[1] * .3 + fw[1] * .25];   // where the hands meet
  return (ctx, t) => {
    const L = K.lightAt(t);
    const D = mix(1.45, 1.41, sineS(t / 2.4)) + (3.1 - 1.41) * sineS(lin(2.4, 4.7, t));
    const cy = mix(.95, 1.0, lin(2.4, 4.7, t)), tgtY = mix(.86, .9, sineS(lin(2.4, 4.7, t)));
    const cam = K.withDrift({ x: HP[0] - fw[0] * D, y: cy, z: HP[2] - fw[1] * D, yaw, pitch: Math.atan2(tgtY - cy, D), f: 1700 }, t, 3, .4);
    const V = K.view3(cam);
    // the step: on "body" the robot lifts its front foot over the line, guided (1.2 s); you follow half a step later
    const st = clamp((t - a.body + .15) / 1.2), lift = Math.sin(Math.PI * st), fwd = qio(st);
    const rPose = { lean: .03 + .03 * lift, head: .05, sh: [.12 - .15 * lift, -.42 + .08 * lift], el: [.22, .12], hip: [.02 + .5 * lift + .22 * fwd, -.04 - .12 * fwd], kn: [.1 + .8 * lift, .05 + .1 * fwd], ft: [-.2 * lift, 0] };
    const st2 = clamp((t - a.body - .35) / 1.2), lift2 = Math.sin(Math.PI * st2), fwd2 = qio(st2);
    const rPos = [RB[0] - .3 * fwd, 0, RB[2]], hPos = [HB[0] - .26 * fwd2, 0, HB[2]];
    const grip = expoOut(lin(.25, .85, t)), arcU = qio(lin(.9, 1.7, t)), arc = Math.sin(Math.PI * arcU);
    const state = {};
    const items = [];
    // you (farther): drawn first, your front hand left out (drawn last, over the robot's hand)
    items.push({ p: hPos, draw: () => {
      const sp = K.sprite(V, hPos, 1.74); if (!sp.vis) return;
      const s = sp.s, hipX = sp.x, hipY = sp.y - 90 * s;
      const base = { lean: .06, head: .26, sh: [.7, .1], el: [.35, .25], hip: [.03 + .28 * lift2 + .12 * fwd2, -.03 - .08 * fwd2], kn: [.05 + .5 * lift2, .05], hands: ['none', 'relaxed'] };
      const rs = K.sprite(V, rPos, 1.7), rw = rs.vis ? robotWrist(rs, rPose, t) : [hipX - 40 * s, hipY + 10 * s];
      const tgt = [rw[0] + 8 * rs.s - 3 * rs.s * arc, rw[1] - 1 * rs.s - 2 * rs.s * arc];
      const ra = K.reachArm(hipX, hipY, s, base, 0, true, { t, seed: 11 }, tgt, 1);
      const r = K.person10(ctx, t, 'you', hipX, hipY, s, { ...base, sh: [ra.sh, .1], el: [ra.el, .25] }, { L, flip: true, seed: 11 });
      const arm = r.arm(0); state.yh = arm.h; state.yang = Math.atan2(arm.h[1] - arm.e[1], arm.h[0] - arm.e[0]); state.ys = s;
    } });
    items.push({ p: rPos, draw: () => {
      const sp = K.sprite(V, rPos, 1.7); if (!sp.vis) return;
      const s = sp.s;
      K.robot(ctx, sp.x, sp.y - 92 * s, s, rPose, { t, seed: 7, L, side: -1, flip: true, bib: '01', handFn: (c2, i, w0, ang) => {
        if (i !== 1) return false;
        // the guided hand: detailed, its fingers close 80 ms after yours
        const g = clamp(grip - .08);
        K.robotHand(c2, w0[0], w0[1], .17, { L, side: 1, ang: Math.atan2(Math.cos(ang), Math.sin(ang)), curl: [.3 + .25 * g, .25 + .5 * g, .3 + .55 * g, .32 + .55 * g, .35 + .5 * g], spread: .4, arm: false, flip: true });
        return true;
      } });
      // your hand over it, fingers around its knuckles
      if (state.yh) K.humanHand(ctx, state.yh[0], state.yh[1], .2 * state.ys, { L, ang: state.yang, pose: 'grip', close: .15 + .45 * grip, flip: true, t, seed: 4, sleeve: null });
    } });
    K.world(ctx, t, V, L, { items, mistAmt: 1.1 });
  };
}
// the robot's back wrist on screen for a pose (same rig as robot(): shoulder at (−2, −60) turned by lean)
function robotWrist(sp, P, t) {
  const s = sp.s, lean = P.lean, S = [-2 * Math.cos(lean) + 60 * Math.sin(lean), -2 * Math.sin(lean) - 60 * Math.cos(lean)];
  const a1 = P.sh[1] + lean, e = P.el[1], E = [S[0] + Math.sin(a1) * 29, S[1] + Math.cos(a1) * 29], Wr = [E[0] + Math.sin(a1 + e) * 26, E[1] + Math.cos(a1 + e) * 26];
  return [sp.x - Wr[0] * s, sp.y - 92 * s + Wr[1] * s];   // flipped (faces left)
}
const arcOff = (u, s) => [-6 * s * Math.sin(Math.PI * u), -4 * s * Math.sin(Math.PI * u)];

// ---------------------------------------------------------------- 1.03 the race road (most never finished, one lost its head)
function raceRoad(a) {
  const nz = VAL.roadZ(-95) + VAL.roadW / 2 - .35;
  const sit = [[-99.6, false, 3], [-97.2, true, 4], [-94.2, false, 5], [-89.6, true, 6]];
  return (ctx, t) => {
    const L = K.lightAt(t);
    const u = K.sineS(lin(a.most + .2, a.most + 3.2, t));   // a held frame with a 0.12 m creep (calm: the head and the helper carry the motion)
    const cam = K.withDrift({ x: mix(-95.36, -95.24, u), y: 1.45, z: VAL.roadZ(-95) - 3.3, yaw: mix(-.058, -.052, u), pitch: -.06, f: 1700 }, t, 5, .3);
    const V = K.view3(cam), items = [];
    sit.forEach(([x, flip, seed], i) => items.push({ p: [x, 0, nz + .1], draw: () => {
      const sp = K.sprite(V, [x, 0, nz + .1], 1.7); if (!sp.vis) return;
      const slump = .04 * Math.sin(t * .8 + i);
      K.robot(ctx, sp.x, sp.y - 46 * sp.s, sp.s, { ...K.RPOSE.sitSlump, head: .45 + slump + (i === 1 ? -.25 * sineS(lin(a.head + .1, a.head + .7, t)) : 0) }, { t, seed, L, side: -1, flip, bib: ['112', '047', '230', '081'][i] });
    } }));
    // a helper kneels by the second robot (green vest), a hand on its shoulder
    items.push({ p: [-96.4, 0, nz - .55], draw: () => {
      const sp = K.sprite(V, [-96.4, 0, nz - .55], 1.7); if (!sp.vis) return; const s = sp.s;
      K.person10(ctx, t, 'worker', sp.x, sp.y - 90 * s, s, { lean: .28, head: .25 + .08 * Math.sin(t * .7), hip: [1.35, -.15], kn: [1.45, 1.9], sh: [.9, .5], el: [.6, .5], dy: 34 }, { L, flip: true, seed: 21, dress: { coat: '#7fa35a', skin: K.SKINS[2] } });
    } });
    // the headless runner stands and turns a little, ratlos; its head rolls in from the right and stops at the kerb on "head"
    items.push({ p: [-91.6, 0, nz - .9], draw: () => {
      const sp = K.sprite(V, [-91.6, 0, nz - .9], 1.7); if (!sp.vis) return; const s = sp.s, look = sineS(lin(a.head + .3, a.head + 1.1, t));
      K.robot(ctx, sp.x, sp.y - 92 * s, s, { sh: [.35 + .05 * Math.sin(t * 1.3), .3], el: [.5, .45], lean: -.04 + .05 * look, head: 0 }, { t, seed: 9, L, side: -1, flip: look > .5, headless: true, bib: '163' });
    } });
    const hu = expoOut(lin(a.head - .75, a.head + .35, t)), hx = mix(-85.6, -90.5, hu), hz = nz - 1.6;
    if (t > a.head - .8) items.push({ p: [hx, 0, hz], draw: () => {
      const p = V.P([hx, .14, hz]); if (!(p.z > .3)) return; const s = p.k * .28 / 29;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(-(hx + 85.6) / .14 * .9); ctx.scale(s, s); K.robotHead(ctx, L, -1, {}); ctx.restore();
    } });
    K.world(ctx, t, V, L, { items });
  };
}

// ---------------------------------------------------------------- 1.07 – 1.19: one take from our barrier into the hall
function valleyTake(a) {
  const rx = -70, rz = VAL.roadZ(-70) + VAL.roadW / 2 - .5, HZ = rz - .35;
  const RB = [rx, 0, rz], YB = [rx + .82, 0, rz - .32];
  const hero = [-40, 0, 154], heroYaw = .45;
  const C13 = { x: hero[0] - 3.4 * Math.sin(heroYaw), y: 1.62, z: hero[2] - 3.4 * Math.cos(heroYaw), yaw: heroYaw, pitch: .065, f: 1700 };
  const C11 = { x: -60, y: 140, z: -215, yaw: .02, pitch: -.235, f: 1700 };
  // 1.15–1.18 lie on one line of sight: the road (start), the hall below, the house up the slope behind it, the road's crest and the far hill
  const C15 = { x: -92, y: 45, z: 96, yaw: .62, pitch: -.085, f: 1700 };
  // Takt (Ruhe-Runde): every sentence gets a hold of 1.5–3 s on its motif (breathing drift only); the moves between are few,
  // long and eased, leaving near subjects in log distance ('logout') and approaching walls in log distance ('log').
  const KEYS = [
    [a.they, { x: rx + .35, y: 1.25, z: rz - 3.5, yaw: .02, pitch: -.03, f: 1700 }],
    [a.andWho + .3, { x: rx + .36, y: 1.23, z: rz - 3.35, yaw: .022, pitch: -.04, f: 1700 }],   // 1.07–1.08 hold: hands, release, the trace into the arm
    [a.lastYear + 1.9, { ...C11, f: 1800 }, 'logout'],                                         // 1.09 one crane up to the valley (the trace runs to the fork)
    [a.by + .3, { ...C11, f: 1800 }],                                                          // 1.10 hold: the group, 13,000
    [a.billion - .2, C11],                                                                     // 1.11 a slow 6 % pull back as the group spreads
  ];
  const C16 = { ...C15, yaw: .68, pitch: -.062 };
  const KEYS2 = [
    [a.all + .05, C13],
    [a.ours + 1.8, C13],                                                    // 1.14 hold: the hand, the trace, the wave
    [a.coming + .9, C16, 'logout'],                                         // 1.15 crane up, already turned to the far hill
    [a.lifeE + 1.2, { ...C16, yaw: .705, pitch: -.07 }],                  // 1.16–1.17 one long hold, barely turning from the far hill towards the house (in frame, right)
    [a.learn - .1, hallCam(-6.75, 4.6, 212.4, -.025), 'log'],                // 1.18 down the slope to the hall window, log approach
    [a.inHall - .45, hallCam(-6.74, 4.58, 212.6, -.03)],                    //      hold: we look in through the glass
    [a.inHall + 2.55, hallCam(-6.55, 1.6, 218.6, -.05)],                    //      through the window, down to the station
    [a.aRobot, hallCam(-6.55, 1.58, 218.8, -.05)],                         // 1.19 hold: the cup
  ];
  // the descent into the crowd: distance to the hero shrinks in log space along a turning ray
  const descent = (t) => {
    const u0 = lin(a.aBillion + .1, a.all + .05, t), u = u0 < .5 ? 2 * u0 * u0 : 1 - 2 * (1 - u0) * (1 - u0);
    const tg = [hero[0], mix(0, 1.62, u), hero[2]];   // ends exactly in C13 (no pop at the switch)
    const d0 = [C11.x - tg[0], C11.y - tg[1], C11.z - tg[2]], D0 = Math.hypot(...d0), D1 = 3.4;
    const d1 = [-Math.sin(heroYaw), (1.62 - 1.62 - 0) / 3.4 + 0, -Math.cos(heroYaw)], n1 = Math.hypot(...d1);
    const dir = d0.map((v, i) => mix(v / D0, d1[i] / n1, sineS(lin(.15, 1, u)))), nd = Math.hypot(...dir);
    const D = Math.exp(mix(Math.log(D0), Math.log(D1), u));
    const pos = dir.map((v, i) => tg[i] + v / nd * D); pos[1] = Math.max(pos[1], 1.62);
    const look = [tg[0] - pos[0], tg[1] - pos[1], tg[2] - pos[2]];
    let yaw = Math.atan2(look[0], look[2]), pitch = Math.atan2(look[1], Math.hypot(look[0], look[2]));
    // the last part settles onto C13 exactly
    const e = sineS(lin(.85, 1, u)); yaw = mix(yaw, C13.yaw, e); pitch = mix(pitch, C13.pitch, e);
    // and the first part leaves C11's own view gently (no pop at the switch)
    const e0 = sineS(lin(0, .18, u)); yaw = mix(C11.yaw, yaw, e0); pitch = mix(C11.pitch, pitch, e0);
    return { x: pos[0], y: pos[1], z: pos[2], yaw, pitch, f: 1700 };
  };
  const camAt = (t) => {
    if (t < a.billion - .2) return K.camEase(t, KEYS);
    if (t < a.aBillion + .1) return C11;
    if (t < a.all + .05) return descent(t);
    return K.camEase(t, KEYS2);
  };
  return (ctx, t) => {
    const L = K.lightAt(t);
    const cam = K.withDrift(camAt(t), t, 9, mix(.35, .55, sineS(lin(a.they + 5, a.they + 6.5, t))) * mix(1, .55, sineS(lin(a.inHall, a.inHall + 1.5, t)))), V = K.view3(cam);
    const items = [];
    // --- 1.07–1.09: the robot at our barrier, your two hands steady it; "For now": the upper hand lets go
    const near = V.dist(RB) < 70;
    const rel = expoOut(lin(a.forNow + .15, a.forNow + .75, t));
    const st = {};
    if (near) {
      items.push({ p: RB, draw: () => {
        const sp = K.sprite(V, RB, 1.7); if (!sp.vis) return; const s = sp.s;
        const r = K.robot(ctx, sp.x, sp.y - 92 * s, s, { lean: -.02 + .02 * Math.sin(t * .9), head: .05, sh: [.55, .05], el: [.55, .2], hip: [.06, -.05], kn: [.08, .04] }, { t, seed: 31, L, side: -1, bib: '053', handFn: (c2, i, w0, ang) => {
          if (i !== 0) return false;
          K.robotHand(c2, w0[0], w0[1], .16, { L, side: -1, ang: Math.atan2(Math.cos(ang), Math.sin(ang)), curl: .35, spread: .3, arm: false });
          return true;
        } });
        st.r = r; st.s = s;
      } });
      items.push({ p: YB, draw: () => {
        const sp = K.sprite(V, YB, 1.74); if (!sp.vis || !st.r) return; const s = sp.s, hx = sp.x, hy = sp.y - 90 * s;
        const base = { lean: .1, head: .22, sh: [.9, .7], el: [.6, .9], hands: ['none', 'none'] };
        const w = st.r.wrist(0), e = st.r.elbow(0);
        const t0 = [w[0] + 3 * st.s, w[1] - 1 * st.s - rel * 4.5 * st.s], t1 = [e[0] + 1 * st.s, e[1] + 5 * st.s];
        const r0 = K.reachArm(hx, hy, s, base, 0, true, { t, seed: 12 }, t0, 1), r1 = K.reachArm(hx, hy, s, base, 1, true, { t, seed: 12 }, t1, 1);
        const r = K.person10(ctx, t, 'you', hx, hy, s, { ...base, sh: [r0.sh, r1.sh], el: [r0.el, r1.el] }, { L, flip: true, seed: 12 });
        for (const i of [1, 0]) { const m = r.arm(i), ang = Math.atan2(m.h[1] - m.e[1], m.h[0] - m.e[0]); K.humanHand(ctx, m.h[0], m.h[1], .19 * s, { L, ang, pose: i ? 'cup' : 'grip', close: i ? 0 : .5 * (1 - rel), spread: i ? .5 : .3, t, seed: 5 + i, sleeve: null }); }
        st.yt = r.arm(0).h;
        // 1.08: the trace flows from your fingertips into the robot's hand and up its arm, then down to the road
        const tu = lin(a.teaching - .5, a.teaching + .7, t);
        if (tu > 0) {
          const w2 = st.r.wrist(0), e2 = st.r.elbow(0), sh = st.r.shoulder;
          const pts = [st.yt, [w2[0] + 2 * st.s, w2[1]], e2, sh];
          K.trace(ctx, pts, expoOut(tu), { col: 0, w: Math.max(2, st.s * 1.1), ticks: [.36, .66, .99], from: lin(a.andWho + .3, a.andWho + 1.3, t) });
        }
      } });
    }
    // 1.09: the trace runs along the road to the fork and hesitates there (branches: hall left, house right)
    const ru = lin(a.andWho + .1, a.working + .9, t);
    if (ru > 0 && t < a.ours) {
      const pts = []; for (let x = rx + .5; x <= VAL.forkX; x += 2) pts.push([x, .08, VAL.roadZ(x)]);
      const hes = Math.max(0, t - (a.working + .9));
      const wob = Math.sin(hes * 5) * Math.exp(-hes * 1.6);
      const end = VAL.forkX + 2.5, br = wob > 0 ? VAL.branchHouse : VAL.branchHall;
      pts.push([end, .08, VAL.roadZ(end) + 1.5 + Math.abs(wob) * 2]);
      items.push({ p: [VAL.forkX, 0, 70], draw: () => K.trace3(ctx, V, pts, expoOut(ru), { col: 0, w: 2.6, ticks: [] }) });
    }
    // --- the crowd (1.10–1.15)
    const group = lin(a.lastYear + .4, a.thirteen + 1.4, t), spread = sineS(lin(a.by + .3, a.aBillion - .2, t));
    const sink = sineS(lin(a.inNext + .4, a.coming + .4, t));
    const crowdOn = t > a.lastYear && t < a.what + 1;
    const crowd = crowdOn ? K.crowdField({ t, L, group, spread, sink, raise: { at: [hero[0], hero[2]], r: 70, t0: a.two + .3 }, wave: { t0: a.ours - .15, at: [hero[0], hero[2]] } }) : null;
    // 1.13–1.14: the hero robot raises both hands; your hand comes in from the right and lays on its hand
    if (t > a.aBillion && t < a.what + 1) items.push({ p: hero, draw: () => {
      const sp = K.sprite(V, hero, 1.7); if (!sp.vis) return; const s = sp.s;
      const up = expoOut(lin(a.two + .2, a.hands2 + .2, t)) * (1 - sink);
      const pose = { sh: [mix(.1, 2.15, up), mix(-.05, 1.95, up)], el: [mix(.2, .62, up), mix(.15, .7, up)], head: -.12 * up, lean: -.03 * up };
      let palm = null;
      const r = K.robot(ctx, sp.x, sp.y - 92 * s, s, pose, { t, seed: 61, L, side: -1, handFn: (c2, i, w0, ang) => {
        if (s < 1.2) return false;
        K.robotHand(c2, w0[0], w0[1], .16, { L, side: -1, ang: Math.atan2(Math.cos(ang), Math.sin(ang)) - .9 * up, curl: .12, spread: .6, arm: false, palm: 'front', flip: i === 1 });
        return true;
      } });
      if (s > 1.2) {
        const w = r.wrist(0), an = r.ang(0);
        const hu = expoOut(lin(a.learning - .35, a.learning + .5, t)), tx = w[0] + 9 * s, ty = w[1] - 9 * s;
        const hx = mix(W + 260, tx, hu), hy = mix(ty + 120, ty, hu) - 2 * s * Math.sin(Math.PI * hu);
        if (hu > 0) {
          // your forearm in the ochre knit: a tapered capsule from the wrist out of frame, rib lines, a cuff
          const hl = 22 * s, ca = Math.cos(.32), sa = Math.sin(.32), bx = hx + ca * hl * .22, by = hy + sa * hl * .22 + hl * .05, ex = bx + ca * 1400, ey = by + sa * 1400;
          const w0 = hl * .24, w1 = hl * .46, nx = -sa, ny = ca;
          ctx.fillStyle = L.lit(K.PAL.you, .85); ctx.beginPath();
          ctx.moveTo(bx + nx * w0, by + ny * w0); ctx.lineTo(ex + nx * w1, ey + ny * w1); ctx.lineTo(ex - nx * w1, ey - ny * w1); ctx.lineTo(bx - nx * w0, by - ny * w0);
          ctx.arc(bx, by, w0, Math.atan2(-ny, -nx), Math.atan2(ny, nx), true); ctx.fill();
          ctx.strokeStyle = K.mixHex(K.PAL.you, '#4a2e14', .32); ctx.lineWidth = Math.max(1, hl * .012);
          for (let k = -2; k <= 2; k++) { const f = k / 2.6; ctx.beginPath(); ctx.moveTo(bx + nx * w0 * f + ca * w0, by + ny * w0 * f + sa * w0); ctx.lineTo(ex + nx * w1 * f, ey + ny * w1 * f); ctx.stroke(); }
          ctx.fillStyle = K.mixHex(K.PAL.you, '#4a2e14', .22); ctx.beginPath(); ctx.moveTo(bx + nx * w0 * 1.04, by + ny * w0 * 1.04); ctx.lineTo(bx + nx * w0 * 1.06 + ca * hl * .12, by + ny * w0 * 1.06 + sa * hl * .12); ctx.lineTo(bx - nx * w0 * 1.06 + ca * hl * .12, by - ny * w0 * 1.06 + sa * hl * .12); ctx.lineTo(bx - nx * w0 * 1.04, by - ny * w0 * 1.04); ctx.fill();
          K.humanHand(ctx, hx, hy, .21 * s, { L, ang: Math.PI + .32, pose: 'open', flip: true, t, seed: 8, sleeve: null });
        }
        // at the touch: the trace glows and runs into the robot (down the arm to its chest)
        const tu = lin(a.learning + .4, a.ours + .25, t);
        if (tu > 0) K.trace(ctx, [[tx - 4 * s, ty + 2 * s], w, r.elbow(0), r.shoulder, [r.shoulder[0] - 4 * s, r.shoulder[1] + 18 * s]], expoOut(tu), { col: 0, w: Math.max(2, s * 1.0), ticks: [.3, .62, .86] });
      }
    } });
    // --- 1.17 the house: the sun reaches its window, the garden lights up, two birds rise from the tree
    const sunWin = sineS(lin(a.andHow + .5, a.wake + .9, t)), gardenLit = sineS(lin(a.wake, a.life + .2, t));
    if (t > a.wake && t < a.learn) items.push({ p: [VAL.houseTree[0], 8, VAL.houseTree[1]], draw: () => birds(ctx, V, t - (a.life - .7), L) });
    // the hall: station 0 is the trainer with the cup (1.19), the others idle
    const lift = qio(lin(a.cup - .45, a.cup + .55, t));
    const hallOpts = { station: (i) => (i === 0 ? { lift, headset: 'up' } : { headset: i % 3 ? 'up' : 'on', robotLift: 0 }) };
    K.world(ctx, t, V, L, { hallOpts, items, crowd, sunWin, gardenLit, shadowX: t < a.all ? mix(-700, 3200, sineS(lin(a.aBillion - .2, a.all - .1, t))) : null, shadowA: sineS(lin(a.andWho, a.lastYear + 1.9, t)), mistAmt: mix(1, .7, lin(30, 60, t)) });
    // --- text written by the trace (1.10, 1.11): upper left, fixed while it is read
    K.traceWrite(ctx, t, { text: '2025: >13,000', x: 120, y: 214, size: 104, col: PAL.ink, t0: a.thirteen - .1, t1: a.by - .35, dur: .9, source: 'Robots installed worldwide · Omdia', srcSize: 21, shadow: 'rgba(250,244,230,.95)' });
    K.traceWrite(ctx, t, { text: '~1 billion by 2050', x: 120, y: 214, size: 104, col: PAL.ink, t0: a.billion - .25, t1: a.aBillion + .9, dur: 1.0, source: 'Forecast · Morgan Stanley', srcSize: 21, shadow: 'rgba(250,244,230,.95)' });
  };
}
// two birds rise out of the house tree and fly off to the left over the valley
function birds(ctx, V, u, L) {
  if (u < 0) return;
  for (let i = 0; i < 2; i++) {
    const k = Math.max(0, u - i * .25), p = V.P([VAL.houseTree[0] - k * 9 - i * 2, 9 + k * 5 + i, VAL.houseTree[1] - k * 4]); if (!(p.z > 1)) continue;
    const s = Math.max(2, p.k * .35), fl = Math.sin(k * 14 + i * 2) * .7;
    ctx.strokeStyle = rgba(PAL.ink, .8); ctx.lineWidth = Math.max(1, s * .14); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(p.x - s, p.y - s * fl * .6); ctx.quadraticCurveTo(p.x - s * .4, p.y - s * .3, p.x, p.y); ctx.quadraticCurveTo(p.x + s * .4, p.y - s * .3, p.x + s, p.y - s * fl * .6); ctx.stroke();
  }
}

// ---------------------------------------------------------------- 1.21 the wide hall: twelve stations, robots lift cups 60 ms apart
function hallWide(a, END) {
  return (ctx, t) => {
    const L = K.lightAt(t);
    const dz = .35 * (t - END);   // a slow push along the hall axis that arrives exactly in HALL_WIDE_CAM at the chunk end (c02 continues it)
    const cam = K.withDrift({ ...HALL_WIDE_CAM, x: HALL_WIDE_CAM.x + dz * Math.sin(VAL.hall.rot), z: HALL_WIDE_CAM.z + dz * Math.cos(VAL.hall.rot) }, t, 13, .4 * clamp((END - t) / 1.5)), V = K.view3(cam);
    const halo = sineS(lin(a.thousands - .3, a.thousands + 1.6, t));
    const station = (i, S) => ({ robotCup: true, robotLift: Math.sin(Math.PI * clamp((t - a.thousands - .15 - i * .06) / 1.7)) , halo, headset: i % 3 ? 'up' : 'on', lift: 0, cupScale: 1.9 });
    K.world(ctx, t, V, L, { hallOpts: { station } });
  };
}
