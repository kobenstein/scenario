// c04 · The turn (03a), plate light (sun) → plate light (core). ONE continuous take in the gym of light, no cut.
// Shot list: /mnt/project-files/scenario/film-klueger/bild/shots.md §4 (4.01–4.10). Anchors are VO phrases (T.S / T.E on '03a').
//
//  shot  anchor (03a)                                 image                                                       the one movement
//  4.01  start … "Remember the Go players."           pull up out of the sun patch onto the Go grid (line + stones     the pull-out
//                                                     as c01 left them)
//  4.02  "In twenty sixteen … one of the world's best" a Go player seated at the grid, the machine across; the white  the white stone glows
//                                                     stone; tag ALPHAGO vs LEE SEDOL · SEOUL · MARCH 2016
//  4.03  "Later, researchers had a machine grade…"     fine ticks run back along the line to 1950; tag SHIN ET AL.     the ticks
//  4.04  "For sixty-six years, the line was flat."     the camera sinks along the flat line; floor tag 66 YEARS        dolly
//  4.05  "Then the machine won. And the line went up." the bent line lifts off the floor: now we see its height; the   the line, the crane
//                                                     camera rises with it
//  4.06  "Players started making moves … better play." black stones drop on unusual points and glow warm (new moves)  the stones
//  4.07  "The machine was stronger … made them better." the player lifts a warm stone like the dumbbell                 the lift
//  4.08  "The study shows … keep coming back to."      the camera pulls back over the hall                              pull back
//  4.09  "Next to a machine, the doctors slipped. …"    the doctors' table (machines dark, the slate 28 → 22) on the     camera only
//                                                     left, the Go grid and its bright line on the right, the machine between
//  4.10  "So what did the Go players do …?"            push into the glass core of the machine across the board → plate the push
//                                                     light (core) (c04>c05)
// New places: the Go player PLAYER (4.12, 20.65) at the grid's -x edge, the machine across GOM (9.62, 20.65). Print: the light plates' print throughout.
import { W, H, rgba, clamp, lin, mix, sm, eio, eout } from '../engine.mjs';
import * as K from '../lib/f11_kit.mjs';
import * as Wd from '../lib/f11_c02_world.mjs';
import * as P3 from '../lib/f11_c03_props.mjs';
import * as G from '../lib/f11_c04_go.mjs';
import { handsOf } from '../lib/handoff4.mjs';

const SLATE_P = [8.2, 0, 24.6];

export default async (T, R) => {
  await Wd.doctorsPrepare();
  const { in: HI, out: HO } = handsOf('c04', T);
  const S = (p, n) => T.S('03a', p, n), E = (p, n) => T.E('03a', p, n);
  const A = {
    start: HI.b, s1: S('Remember'), s1e: E('Go players'), s2: S('In twenty'), beat: S('beat'), s2e: E('world'), s3: S('Later'), grade: S('grade'), move: S('move by'), back: S('all the way'), s3e: E('nineteen fifty'),
    s4: S('For sixty'), s4e: E('was flat'), s5: S('Then the machine'), won: S('won'), s6: S('And the line'), up: S('went up'), s7: S('Players started'), s7e: E('professional games'),
    s8: S('And those'), s8e: E('better play'), s9: S('The machine was'), s10: S('And it made'), s10e: E('them better'), s11: S('The study'), s12: S('But this is'),
    s13: S('Next to a machine'), slipped: S('slipped'), s14: S('Next to a far'), s14e: E('than ever'), s15: S('So what did'), end: HO.a,
  };

  // ---------------------------------------------------------------- the camera
  const PATCH = P3.SUNC;
  const C0 = P3.SUNCAM;   // inside the sun patch (the plate)
  const G1 = { x: 0.9, y: 3.5, z: 15.0, ...Wd.lookAt({ x: 0.9, y: 3.5, z: 15.0 }, [7.0, 0, 20.9]), f: 1180 };     // the grid from above-left (4.01–4.03)
  const tOut = A.s1e + 1.6;
  const G3 = { x: 2.6, y: 1.35, z: 18.6, ...Wd.lookAt({ x: 2.6, y: 1.35, z: 18.6 }, [7.6, .2, 20.5]), f: 1450 };   // low along the flat line (4.04)
  const G4 = { x: 2.3, y: 2.6, z: 16.9, ...Wd.lookAt({ x: 2.3, y: 2.6, z: 16.9 }, [8.4, 1.5, 21.6]), f: 1350 };   // up with the rising line (4.05–4.06)
  const G5 = { x: 2.2, y: 1.9, z: 18.0, ...Wd.lookAt({ x: 2.2, y: 1.9, z: 18.0 }, [G.PLAYER[0], 1.2, G.PLAYER[2]]), f: 1700 };   // the player's lift (4.07)
  const G6 = { x: -1.0, y: 3.4, z: 16.0, yaw: .82, pitch: -.16, f: 1300 };                        // doctors left, Go right (4.08–4.09)
  const KEYS = [
    [tOut, G1],
    [A.s3 + 2.0, { ...G1, x: .95, z: 15.1, f: 1192 }],
    [A.s4 - .8, { ...G1, x: 1.0, z: 15.2, f: 1205 }],
    [A.s4 + 3.0, G3],
    [A.up - .3, { ...G3, x: 2.62, z: 18.68, f: 1460 }],
    [A.up + 3.6, G4],
    [A.s9 - 1.2, { ...G4, x: 2.28, z: 17.0, f: 1360 }],
    [A.s10 + .2, G5],
    [A.s11 + .2, { ...G5, z: 18.06, f: 1712 }],
    [A.s12 + 1.4, G6],
    [A.s15 - .8, { ...G6, x: -.9, z: 16.12, f: 1320 }],
  ];
  const LAST = KEYS[KEYS.length - 1][1], CORE = G.GOM_CORE;
  const tFly0 = KEYS[KEYS.length - 1][0], tFly1 = A.end - .04;
  // end: in front of the core, close enough that the orb overfills the frame (R on screen ≈ 1.25 × half diagonal)
  const YA = Math.atan2(CORE[0] - LAST.x, CORE[2] - LAST.z);   // the push comes straight in from the last framing
  const dEnd = .23 * 1700 / (1.25 * 1102), CE = { x: CORE[0] - dEnd * Math.sin(YA), y: CORE[1], z: CORE[2] - dEnd * Math.cos(YA), yaw: YA, pitch: 0, f: 1700 };
  function cam(t) {
    if (t < tOut) { const u = sm(lin(A.start, tOut, t)), c = Wd.flyCam(u, C0, G1, PATCH); return { ...c, yaw: mix(C0.yaw, G1.yaw, sm(lin(.15, 1, u))), pitch: mix(C0.pitch, G1.pitch, sm(lin(.1, 1, u))) }; }
    if (t < tFly0) return Wd.glide(t, KEYS);
    const u = lin(tFly0, tFly1, t), e = u * u * (3 - 2 * u), c = Wd.flyCam(e, LAST, CE, CORE), lk = Wd.lookAt(c, CORE), w = sm(lin(0, .5, u));
    return { ...c, yaw: mix(LAST.yaw, lk.yaw, w), pitch: mix(LAST.pitch, lk.pitch, w) };
  }

  // ---------------------------------------------------------------- the story on the floor
  const lift = (t) => 2.1 * eio(lin(A.up - .1, A.up + 3.0, t)) + .5 * sm(lin(A.s7, A.s8e, t));
  const tickU = (t) => sm(lin(A.move - .2, A.s3e + .2, t));
  const whiteGlow = (t) => Math.max(0, Math.sin(Math.PI * lin(A.beat - .1, A.beat + 1.6, t)));
  function go(ctx, V, t) {
    for (const [i, j, c] of Wd.GAME) K.goStone(ctx, V, i, j, { col: c === 'b' ? 'black' : 'white' });
    K.floorLine(ctx, V, Wd.FLAT, { u: 1, w: .55 });
    G.ticks(ctx, V, tickU(t));
    K.goStone(ctx, V, 11, 7, { col: 'white' });
    const wg = whiteGlow(t);
    if (wg > 0) { const p = V.P(K.goPt(11, 7, .03)); if (p.z > .1) { const r = p.k * .4, g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r); g.addColorStop(0, rgba(K.PAL.core, .55 * wg)); g.addColorStop(1, rgba(K.PAL.core, 0)); ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill(); ctx.restore(); } }
    K.goStone(ctx, V, 13, 9, { col: 'black', glow: 1 });
    G.newStones(ctx, V, t, A.s7 + .6, .75);
  }
  const playerLift = (t) => eio(lin(A.s10 - .1, A.s10 + 1.3, t)) * (1 - eio(lin(A.s12 + .5, A.s12 + 1.6, t)));
  function floorTags(ctx, V, t) {
    const lab = (s, p, u) => { const q = V.P([p[0], .01, p[1]]); if (q.z > .3 && q.y < H - 190) K.tag(ctx, s, q.x - 40, q.y - 34, { u, size: 22 }); };
    const a = K.goPt(1, 6), b = K.goPt(11, 5.4), m = K.goPt(6, 5.2);
    const v1 = Math.min(lin(A.back, A.back + .5, t), 1 - lin(A.s5 + .2, A.s5 + .6, t));
    if (v1 > 0) lab('1950', [a[0], a[2]], v1);
    const v2 = Math.min(lin(A.beat + .4, A.beat + .9, t), 1 - lin(A.s5 + .2, A.s5 + .6, t));
    if (v2 > 0) lab('2016', [b[0], b[2]], v2);
    const v3 = Math.min(lin(A.s4 + 2.6, A.s4 + 3.1, t), 1 - lin(A.s5 + .2, A.s5 + .6, t));
    if (v3 > 0) lab('66 YEARS', [m[0] - .2, m[2]], v3);
  }

  // ---------------------------------------------------------------- you (at your place, the forks hold your weight) and the frame
  const st = { ...Wd.FORK, pose: { ...K.GYM.idle } };
  function draw(ctx, t) {
    const V = Wd.safeView(K.view3(cam(t)));
    if (t > tFly0 && Math.hypot(V.cam.x - CORE[0], V.cam.y - CORE[1], V.cam.z - CORE[2]) < .34) {   // the orb already overfills the frame: draw only the machine (nothing else can show)
      ctx.fillStyle = '#e8eef0'; ctx.fillRect(0, 0, W, H); G.goMachine(ctx, t, V); return;
    }
    K.hall(ctx, t, V, { board: (c, Bd) => Wd.board01(c, Bd), go: (c, VV) => go(c, VV, t) });
    P3.sunPlatePatch(ctx, t, V);
    Wd.mirrorOverlay(ctx, t, V, { actors: (c, VV) => { G.goMachine(c, t, VV, { mirror: true }); Wd.drawGym(c, t, VV, st, true); } });
    Wd.doctorsRow(ctx, t, V, { lamp: () => 0, mark: () => 0, stack: () => 1, lean: () => 1 });
    Wd.slate(ctx, t, V, SLATE_P, { chalk: (c) => G.chalkPoland(c) });
    Wd.rack(ctx, t, V, { dust: 2 });
    G.goMachine(ctx, t, V);
    G.riseLine(ctx, V, lift(t));
    G.goPlayer(ctx, t, V, { lift: playerLift(t), stone: true });
    Wd.drawGym(ctx, t, V, st, false);
    floorTags(ctx, V, t);
    const u1 = Math.min(lin(A.s2 + .5, A.s2 + 1.1, t), 1 - lin(A.s3 - .1, A.s3 + .3, t));
    if (u1 > 0) K.tag(ctx, 'ALPHAGO vs LEE SEDOL  ·  SEOUL  ·  MARCH 2016', 72, 96, { u: u1 });
    const u2 = Math.min(lin(A.s3 + .5, A.s3 + 1.1, t), 1 - lin(A.s4 + 2.2, A.s4 + 2.6, t));
    if (u2 > 0) K.tag(ctx, 'SHIN ET AL.  ·  PNAS 2023  ·  5.8 MILLION MOVES, 1950–2021', 72, 96, { u: u2 });
  }

  return [{
    t: HI.b, tr: 'cut', d: .1, draw, print: HI.print,
    sound: [
      { f: 'stone_click', t: A.beat, v: .35 }, { f: 'glass_ticks', t: A.move, v: .25 }, { f: 'bloom', t: A.up, v: .3 },
      { f: 'stone_click', t: A.s7 + .95, v: .3 }, { f: 'stone_click', t: A.s7 + 2.45, v: .25 }, { f: 'glass_hum', t: A.s15 + .5, v: .3 },
    ],
  }];
};
