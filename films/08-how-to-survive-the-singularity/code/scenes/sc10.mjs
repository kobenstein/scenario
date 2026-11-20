// Film 8 · c10 · the fork (VO 06a, 606.7 → 644.8 s) as ONE take in ONE world: the same sea under the same sky, split by a seam along X = 0
// (the vertical cream line of the c09>c10 plate). Left (X < 0): we drift. Right (X > 0): millions of compasses point the same way.
// Binding shot list: /mnt/project-files/scenario/film-singularitaet/m1/bild/shots.md §8 c10 (B3).
//
// shot   | VO (accent)                                        | image                                                      | camera / carrier
// -------+----------------------------------------------------+------------------------------------------------------------+-------------------------------------------
// c10.01★| So picture the same fast world, TWICE.            | the line is the seam between two halves of one sea; the    | out of the line plate, pull back + crane up
//        |                                                    | horizon light sits on it; a pulse runs along it on "twice" |
// c10.02 | In the first, we DRIFT.                            | left: slack sails, dim lanterns, the rose dark, boats turn  | slide left, lower
// c10.03 | A FEW set the direction … whoever OWNS them.       | left: one big ship, glass wheelhouse, three at its wheel,  | follow the ship
//        |                                                    | small boats towed behind on long lines                     |
// c10.04 | Everyone else REACTS.                              | the ship turns; the towed boats jerk and swing a beat later| hold, pull up a little
// c10.05 | In the second, MILLIONS … point the SAME WAY.     | right, from above: a field of boats, each with a tiny amber| crane up across the seam
//        |                                                    | needle; the needles swing and settle the same way          |
// c10.06 | Governments make the rules IN THE OPEN.            | right: an open deck in lantern light, a rule board; a hand | crane down to the raft
//        |                                                    | adds a line                                                |
// c10.07 | The builders get TESTED.                           | the cool-lit new vessel passes through the lit gate        | pan to the gate
// c10.08 | And voters, PEOPLE LIKE YOU, help STEER.           | many hands on the canoe's steering paddle; yours joins     | behind the canoe; hands carried in
// c10.09 | Same TECHNOLOGY.                                   | rise to the seam: the one light on both sides              | crane up to the seam
// c10.10 | Same SPEED.                                        | both halves: the same swell racing                         | low over the water
// c10.11 | Different CREW.                                    | two boats either side of the seam: few at the helm / all   | hold between the two boats
//        |                                                    | at their stations                                          |
// c10.12 | … isn't decided by the MACHINES.                   | the light on the seam, lighting both halves the same       | push toward the light
// c10.13 | It's decided by who's HOLDING the COMPASS.         | right: a hand holding a small lit compass                  | turn right; hand carried in from below
// c10.14 | Which one are WE building?                         | both halves and the seam, a slow hold; then one lantern    | pull back; push into a lantern → `light` fire
import { clamp } from '../engine.mjs';
import { ready, track, trackLog, camera, eoX, eiX, sio, qio, u01, pulse, settle, hash } from '../lib/s8_kit.mjs';
import { drawSky, prepareSky } from '../lib/s8_sky.mjs';
import { drawSea, waterY } from '../lib/s8_sea.mjs';
import { lightAt, lensOf, drawLight } from '../lib/s8_light.mjs';
import { boat, roseBoats, handCompass, frameOf } from '../lib/s8_boats.mjs';
import { seaRose } from '../lib/s8_fleet.mjs';
import { canoe } from '../lib/s8_canoe.mjs';
import { hand, plate, HAND } from '../lib/handoff4.mjs';
import { prng } from '../engine.mjs';
import { seam, seamLine, coldHalf, farBoat, needleGlyph, ship, towLine, crew, ruleBoard, gate, vessel, paddleHands } from '../lib/s8_c10_world.mjs';
import { lineGround, lineStroke } from '../lib/handoff4.mjs';
import { figure, reachArm } from '../lib/figure.mjs';

export default async function (T, R) {
  const S = (p, n) => T.S('06a', p, n), E = (p, n) => T.E('06a', p, n);
  const HI = hand('c09>c10', T), HO = hand('c10>c11', T);
  const K = {
    in: HI.b, so: S('So picture'), twice: S('twice'), first: S('In the first'), drift: S('drift'), few: S('A few'), owns: S('owns'), everyone: S('Everyone else'), reacts: S('reacts'),
    second: S('In the second'), millions: S('millions'), sameWay: S('same way'), govs: S('Governments'), open: S('in the open'), builders: S('The builders'), tested: S('tested'),
    voters: S('And voters'), people: S('people like'), you: S('like you'), steer: S('help steer'), tech: S('Same technology'), techW: S('technology'), speed: S('Same speed'), speedW: S('speed'),
    diff: S('Different crew'), crew: S('crew'), which: S('Which world'), machines: S('machines'), its: S("It's decided"), holding: S('holding'), compass: S('compass'),
    which2: S('Which one'), we: S('we building'), building: S('building', 1), endW: E('building', 1), out: HO.a,
  };
  // ---------------------------------------------------------------- the world
  const r = prng(1010);
  const FAR = { L: [], R: [] };
  for (let i = 0; i < 300; i++) { const z = 120 + Math.pow(r(), .8) * 1100, x = 8 + r() * (40 + z * .5); FAR.L.push({ x: -x, z, head: r() * 6.28, sail: 'slack', lan: .3, ph: r() * 6.28, k: .9 + .2 * r() }); }
  for (let i = 0; i < 300; i++) { const z = 120 + Math.pow(r(), .8) * 1100, x = 8 + r() * (40 + z * .5); FAR.R.push({ x, z, head: .12 + (r() - .5) * .08, sail: 'full', side: .5, lan: .55, n0: (r() - .5) * 5, d: r(), k: .9 + .2 * r() }); }
  const NEAR_L = [], NEAR_R = [];
  for (let i = 0; i < 12; i++) NEAR_L.push({ x: -10 - r() * 60, z: 70 + r() * 120, head: r() * 6.28, ph: r() * 6.28 });
  for (let i = 0; i < 12; i++) NEAR_R.push({ x: 10 + r() * 60, z: 70 + r() * 120, head: .12, fig: i % 3 === 0 });
  // keep the lanes free for the raft, the gate and the canoe
  const RAFT = { x: 26, z: 110, head: -.15 }, GATE = { x: 46, z: 150, half: 6 }, CANOE = { x: 14, z: 75, head: 0 }, ROSE_R = { x: 95, z: 320, R: 26 }, ROSE_L = { x: -95, z: 320, R: 26 };
  const free = (b) => Math.hypot(b.x - RAFT.x, b.z - RAFT.z) > 14 && Math.hypot(b.x - GATE.x, b.z - GATE.z) > 16 && Math.hypot(b.x - CANOE.x, b.z - CANOE.z) > 16;
  const NR = NEAR_R.filter(free), RB_L = roseBoats(ROSE_L.R), RB_R = roseBoats(ROSE_R.R);
  // the ship of the few: a path integrated once (straight on, then the turn on "reacts"), the towed boats follow its stern with a lag
  const SHIP = (() => {
    const t0 = K.so - 30, t1 = K.out + 2, dt = 1 / 30, out = []; let x = -42, z = 60, h = .04;
    for (let t = t0; t <= t1; t += dt) { h = .04 - .75 * sio(u01(t, K.reacts - .15, K.reacts + 1.9)); const v = 1.6; x += Math.sin(h) * v * dt; z += Math.cos(h) * v * dt; out.push([x, z, h]); }
    // shift so the ship is at (−40, 104) when it is first seen
    const i0 = Math.round((K.few - t0) / dt), [sx, sz] = out[i0], ox = -40 - sx, oz = 104 - sz;
    const at = (t) => { const f = clamp((t - t0) / dt, 0, out.length - 1), i = Math.floor(f), j = Math.min(out.length - 1, i + 1), v = f - i; return { x: out[i][0] + (out[j][0] - out[i][0]) * v + ox, z: out[i][1] + (out[j][1] - out[i][1]) * v + oz, head: out[i][2] + (out[j][2] - out[i][2]) * v }; };
    return { at };
  })();
  const TOW = [[-3.5, 6.5], [3.2, 8.5], [-5.5, 11], [5.4, 13], [-2, 16], [1.6, 18.5]];   // lateral offset (m), lag (s)
  const towPos = (t, i) => { const [off, lag] = TOW[i], s = SHIP.at(t - lag), stern = { x: s.x - Math.sin(s.head) * 17, z: s.z - Math.cos(s.head) * 17 }; const jerk = .5 * pulse(t, K.reacts + .25 + i * .09, K.reacts + 1.1 + i * .09); return { x: stern.x + Math.cos(s.head) * off * (1 + jerk), z: stern.z - Math.sin(s.head) * off * (1 + jerk), head: s.head + jerk * .5 * Math.sign(off) }; };

  // ---------------------------------------------------------------- the camera: position + look-at target keys (PCHIP), F
  const shipCam = (t, dz, y, dx) => { const s = SHIP.at(t); return [s.x + dx, y, s.z + dz]; };
  const ship0 = SHIP.at(K.few + 1), ship1 = SHIP.at(K.reacts + 1.2);
  const LBz = 50, RBz = 50;
  const KEYS = [
    // t, px, py, pz, tx, ty, tz, F
    [K.in, 0, 42, 30, 0, 0, 33, 1400],
    [K.in + .9, 0, 95, -10, 0, 0, 160, 1400],
    [K.twice + .1, 0, 118, -40, 0, 0, 420, 1400],
    [K.first + .2, -12, 70, 0, -22, 0, 260, 1400],
    [K.drift + .35, -38, 26, 36, -50, 0, 150, 1400],
    [K.few - .3, ship0.x - 30, 11, ship0.z - 8, ship0.x - 2, 1.5, ship0.z - 10, 1400],
    [K.owns, ship0.x - 31 + .4, 11, ship0.z - 4 + 1.6 * (K.owns - K.few - 1), ship0.x, 1.5, ship0.z - 7 + 1.6 * (K.owns - K.few - 1), 1400],
    [K.reacts + .9, ship1.x - 30, 14, ship1.z - 10, ship1.x - 4, 1, ship1.z - 12, 1400],
    [K.second + .05, ship1.x - 30, 17, ship1.z - 11, ship1.x - 3, 1, ship1.z - 12, 1400],
    [K.millions + .25, 26, 34, 104, 42, 0, 190, 1400],
    [K.sameWay + .5, 28, 32, 110, 44, 0, 196, 1400],
    [K.govs - .05, RAFT.x - 1.6, 3.6, RAFT.z - 9.5, RAFT.x + .2, 2.2, RAFT.z + 1.5, 1400],
    [K.open + .3, RAFT.x - 1.2, 3.4, RAFT.z - 8.6, RAFT.x + .3, 2.2, RAFT.z + 1.5, 1400],
    [K.builders - .05, GATE.x - 13, 6, GATE.z - 22, GATE.x - 1, 2.5, GATE.z + 2, 1400],
    [K.tested + .6, GATE.x - 12, 5.5, GATE.z - 20, GATE.x + 1, 2.5, GATE.z + 6, 1400],
    [K.voters - .05, CANOE.x + 1.2, 3.4, CANOE.z - 19, CANOE.x, 2.6, CANOE.z, 1400],
    [K.steer + .4, CANOE.x + 1.0, 3.3, CANOE.z - 18.2, CANOE.x - .2, 2.6, CANOE.z, 1400],
    [K.tech + .05, 0, 24, 6, 0, 0, 420, 1400],
    [K.speed - .1, 0, 13, 18, 0, 0, 500, 1400],
    [K.diff - .05, 0, 4.6, LBz - 15, 0, 1.6, LBz + 1, 1400],
    [K.which - .1, 0, 4.4, LBz - 13.8, 0, 1.6, LBz + 2, 1400],
    [K.machines - .3, 0, 7, LBz - 4, 0, 0, 2400, 1700],
    [K.its, 0, 6.5, LBz + 2, 0, 0, 2400, 1900],
    [K.holding - .35, 9, 3.4, LBz + 8, 30, 0, LBz + 60, 1400],
    [K.which2 - .3, 9.5, 3.6, LBz + 9, 31, 0, LBz + 62, 1400],
    [K.which2 + .9, 0, 105, -30, 0, 0, 420, 1400],
    [K.endW + .2, 0, 108, -33, 0, 0, 420, 1400],
  ];
  const cols = [1, 2, 3, 4, 5, 6].map((c) => track(KEYS.map((k) => [k[0], k[c]])));
  const fF = trackLog(KEYS.map((k) => [k[0], k[7]]));
  const look = (p, q, F) => { const dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2]; return camera({ x: p[0], y: p[1], z: p[2], yaw: Math.atan2(dx, dz), pitch: Math.atan2(-dy, Math.hypot(dx, dz)), F }); };
  // the end: push into one lantern of the right half (a near boat), then its light fills the frame (the c10>c11 `light` plate)
  const LANB = NR.slice().sort((a, b) => Math.hypot(a.x - 22, a.z - 160) - Math.hypot(b.x - 22, b.z - 160))[0];
  const lanW = (t) => { const F = frameOf({ ...LANB, roll: -.06 }, t); return F(-.5, 1.35, -2.4); };
  K.push0 = K.endW + .05; K.disc0 = K.out - .6;
  const pushD = trackLog([[K.push0, 1], [K.out, .006]]);
  const camAt = (t) => {
    const p = cols.slice(0, 3).map((f) => f(t)), q = cols.slice(3, 6).map((f) => f(t));
    if (t <= K.push0) return look(p, q, fF(t));
    const L = lanW(t), p0 = cols.slice(0, 3).map((f) => f(K.push0)), u = pushD(t), a = sio(u01(t, K.push0, K.push0 + .45));
    const pp = [L[0] + (p0[0] - L[0]) * u, L[1] + (p0[1] - L[1]) * u + 1.2 * (1 - u) * 0, L[2] + (p0[2] - L[2]) * u];
    const q0 = cols.slice(3, 6).map((f) => f(K.push0)), qq = q0.map((v, i) => v + (L[i] - v) * a);
    return look(pp, qq, 1400);
  };
  // the sea clock: the swell races on "Same speed" (both halves alike)
  const SEA = (() => { const t0 = K.in - 1, dt = 1 / 60, v = [0]; for (let t = t0; t < K.out + 2; t += dt) v.push(v[v.length - 1] + dt * (1 + 1.3 * sio(u01(t, K.speed - .3, K.speed + .3)) * (1 - sio(u01(t, K.diff + .1, K.diff + .8))))); return (t) => { const f = clamp((t - t0) / dt, 0, v.length - 1), i = Math.floor(f); return t0 + v[i] + (v[Math.min(v.length - 1, i + 1)] - v[i]) * (f - i); }; })();
  const seaT = (t) => SEA(t);
  const LIGHT = { az: 0, el: .0025 };
  const needleA = (b, t) => { const u = clamp((t - K.sameWay + .55 - b.d * .5) / 1.3); return b.n0 * (1 - settle(u)) + .03 * Math.sin(t * 1.3 + b.d * 9); };

  function frame(ctx, t) {
    const C = camAt(t), ts = seaT(t);
    const Ls = { ...LIGHT, ign: 1, ring: .55 + .2 * pulse(t, K.machines - .1, K.machines + 1.4), pulse: .25 * pulse(t, K.machines - .05, K.machines + 1.0) + .2 * pulse(t, K.techW - .05, K.techW + .9), size: 1.25 };
    const L = lightAt(C, Ls), lens = lensOf(C, Ls, L);
    drawSky(ctx, t, C, { lens: lens && L && L.x > -300 && L.x < 2220 && L.y > -200 ? lens : null });
    const glints = [];
    if (L && L.x > -300 && L.x < 2220) glints.push({ x: L.x, y: L.y, col: '#bfefff', a: 1, w: 3, spread: .2 });
    drawSea(ctx, ts, C, { glints });
    drawLight(ctx, t, C, Ls, L);
    coldHalf(ctx, C, 1);
    // the seam (a pulse runs along it on "twice")
    const pz = pulse(t, K.twice - .05, K.twice + .9);
    seamLine(ctx, t, C, { a: .85, w: 1, pulse: pz });
    // far fleets (glyphs): left dim and slack, right full, each with a needle
    const farOn = C.y > 14 || C.pitch > .2;
    const glyphs = [];
    if (farOn) {
      for (const b of FAR.L) glyphs.push([C.depth(b.x, 0, b.z), () => farBoat(ctx, t, C, { ...b, head: b.head + .4 * Math.sin(t * .3 + b.ph) })]);
      for (const b of FAR.R) glyphs.push([C.depth(b.x, 0, b.z), () => farBoat(ctx, t, C, { ...b, needle: b.head + needleA(b, t), glow: .7 + .3 * u01(t, K.sameWay - .2, K.sameWay + .6) })]);
    }
    glyphs.sort((a, b) => b[0] - a[0]); for (const [d, f] of glyphs) if (d > 1) f();
    // the two roses: left dark (unlit boats), right lit
    seaRose(ctx, t, C, { x: ROSE_R.x, z: ROSE_R.z, R: ROSE_R.R, a: 1, points: [1, 1, 1, 1], icons: 1 });
    seaRose(ctx, t, C, { x: ROSE_L.x, z: ROSE_L.z, R: ROSE_L.R, a: 0, dim: 1 });
    // near objects, far → near
    const items = [];
    const B = (b) => items.push([C.depth(b.x, 0, b.z), () => boat(ctx, t, C, b)]);
    for (const b of RB_L) B({ x: ROSE_L.x + Math.sin(b.th) * b.rr, z: ROSE_L.z + Math.cos(b.th) * b.rr, head: b.head + .3 * Math.sin(t * .3 + b.th), sail: 'none', lantern: 0, scale: b.sc * .8 });
    for (const b of RB_R) B({ x: ROSE_R.x + Math.sin(b.th) * b.rr, z: ROSE_R.z + Math.cos(b.th) * b.rr, head: b.head, sail: 'none', lantern: .9, scale: b.sc * .8 });
    for (const b of NEAR_L) B({ x: b.x + 2 * Math.sin(t * .1 + b.ph), z: b.z, head: b.head + .5 * Math.sin(t * .25 + b.ph), roll: .1 * Math.sin(t * .6 + b.ph), sail: 'slack', lantern: .3 });
    for (const b of NR) { const bb = { x: b.x, z: b.z + .9 * (t - K.so), head: b.head, roll: -.06, sail: 'full', sailSide: -.45, lantern: 1, fig: b.fig ? 'sight' : null }; items.push([C.depth(bb.x, 0, bb.z), () => { boat(ctx, t, C, bb); const n = { n0: b.x * .37 % 5 - 2.5, d: (b.z * .13) % 1 }; needleGlyph(ctx, t, C, bb.x, 1.9, bb.z + .4, bb.head + needleA(n, t), .7 + .3 * u01(t, K.sameWay - .2, K.sameWay + .6), 1); }]); }
    // the ship of the few and its towed boats
    { const s = SHIP.at(t); items.push([C.depth(s.x, 0, s.z), () => {
      const sh = ship(ctx, t, C, { ...s, L: 34 });
      for (let i = 0; i < TOW.length; i++) { const b = towPos(t, i), F = frameOf({ ...b, roll: 0 }, t), bow = F(0, .7, 2.6), taut = pulse(t, K.reacts + .2 + i * .09, K.reacts + .9 + i * .09); towLine(ctx, t, C, sh.stern, bow, { sag: .9, taut, a: .45 }); }
    }]);
      for (let i = 0; i < TOW.length; i++) { const b = towPos(t, i); items.push([C.depth(b.x, 0, b.z), () => boat(ctx, t, C, { ...b, sail: 'none', lantern: .25, scale: .85 })]); } }
    // the raft with the rule board (a person at the board adds a line in the open)
    items.push([C.depth(RAFT.x, 0, RAFT.z), () => {
      const add = u01(t, K.open - .45, K.open + .55), rb = ruleBoard(ctx, t, C, { ...RAFT, add });
      const F = rb.F, pp = C.P(...F(-2.25, .5, 1.0)), wp = rb.pen || C.P(...F(-1.4, 2.3, 1.4));
      if (pp && pp[2] * 1.74 / 184 < 5) {
        const s = pp[2] * 1.74 / 184, x = pp[0], y = pp[1] - 90 * s, o = { t, seed: 21, rim: '#ffc890', light: { x: pp[0] + 300, y: pp[1] - 200, col: '#ffc890', a: .8 }, dress: { coat: '#2a1e1e', pants: '#120e14', skin: '#7a4f33', hair: '#120c10' }, shadow: false };
        const pose = { head: -.05, lean: .03 };
        const tgt = wp ? [wp[0], wp[1]] : null;
        if (tgt) Object.assign(pose, { arm: reachArm(x, y, s, { head: -.05 }, 0, false, o, tgt) });
        figure(ctx, x, y, s, pose.arm ? { ...pose, sh: [pose.arm.sh, .1], el: [pose.arm.el, .3] } : pose, o);
        if (wp && add > 0 && add < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(wp[0], wp[1], 0, wp[0], wp[1], 14); g.addColorStop(0, 'rgba(255,200,120,.7)'); g.addColorStop(1, 'rgba(255,150,60,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(wp[0], wp[1], 14, 0, 7); ctx.fill(); ctx.restore(); }
      }
      // the people on the deck who watch it happen (backs to us, rim-lit by the lanterns)
      for (const [u, w, sd] of [[-3.6, -2.2, 1], [-.6, -3.1, 2], [1.8, -2.6, 3], [3.7, -1.6, 4]]) { const q = C.P(...F(u, .5, w)); if (!q) continue; const s = q[2] * 1.7 / 184; if (s > 5) continue; figure(ctx, q[0], q[1] - 90 * s, s, { head: -.1 + .03 * Math.sin(t * .5 + sd), sh: [.2, .15], el: [.3, .3] }, { t, seed: 30 + sd, flip: sd % 2 === 0, rim: '#ffc890', light: { x: q[0], y: q[1] - 260 * s, col: '#ffb35c', a: .7 }, dress: { coat: ['#1d1c33', '#2a2236', '#1e2a3a', '#26304a'][sd - 1], pants: '#0e0d1c', skin: '#3a2a26', hair: '#0c0a12' }, shadow: false }); }
    }]);
    // the gate and the new vessel (cool light) passing through it; a patrol lantern follows
    items.push([C.depth(GATE.x, 0, GATE.z) + .5, () => gate(ctx, t, C, { ...GATE, on: .8 + .6 * pulse(t, K.tested - .05, K.tested + .8) })]);
    { const vz = GATE.z - 16 + 22 * sio(u01(t, K.builders - .6, K.tested + 1.6)) + .6 * (t - K.builders), V = { x: GATE.x, z: vz, head: 0 };
      items.push([C.depth(V.x, 0, V.z), () => vessel(ctx, t, C, V)]);
      items.push([C.depth(V.x - 1, 0, vz - 13), () => boat(ctx, t, C, { x: V.x - 1, z: vz - 13, head: 0, sail: 'none', lantern: 1, scale: .8 })]); }
    // Hōkūleʻa (the steering paddle scene)
    items.push([C.depth(CANOE.x, 0, CANOE.z), () => canoe(ctx, t, C, { ...CANOE, z: CANOE.z })]);
    // the two crew boats at the seam: same boat, different crew
    const LB = { x: -5.2, z: LBz + .5 * Math.sin(t * .2), head: .25 + .3 * Math.sin(t * .23), roll: .08 * Math.sin(t * .5), sail: 'slack', lantern: .3 };
    const RBt = { x: 5.2, z: RBz, head: .02, roll: -.05, sail: 'full', sailSide: -.45, lantern: 1 };
    items.push([C.depth(LB.x, 0, LB.z), () => { boat(ctx, t, C, LB); crew(ctx, t, C, LB, [{ u: 0, w: -1.9 }, { u: -.4, w: .3, sit: true }, { u: .4, w: -.6, sit: true }, { u: 0, w: 1.4, sit: true }], { light: C.P(...lanW0(LB, t)), lightA: .35, rim: '#7e8ab8', seed: 40 }); }]);
    items.push([C.depth(RBt.x, 0, RBt.z), () => { const ln = C.P(...lanW0(RBt, t)); boat(ctx, t, C, RBt); crew(ctx, t, C, RBt, [{ u: 0, w: -1.9, pose: { sh: [1.1, .3], el: [.5, .4], head: -.1 } }, { u: -.45, w: -.2, pose: { sh: [2.4, .3], el: [.2, .3], head: -.3 }, flip: true }, { u: .45, w: .6, pose: { sh: [1.5, 1.2], el: [.4, .5], head: -.15 } }, { u: 0, w: 1.7, pose: { head: -.2, sh: [.4, .9], el: [.9, .2] } }], { light: ln, lightA: .85, seed: 50 }); }]);
    items.sort((a, b) => b[0] - a[0]); for (const [d, f] of items) if (d > .3) f();
    // c10.08 the hands on the steering paddle (screen space; carried in from the frame edges, lowered out before the crane up)
    { const hU = (t0) => u01(t, t0, t0 + .55) * (1 - eiX(u01(t, K.tech - .55, K.tech - .1)));
      if (t > K.voters - .6 && t < K.tech + .1) paddleHands(ctx, t, { u: [hU(K.voters - .1), hU(K.voters + .25), hU(K.people - .2), hU(K.people + .05)], you: hU(K.you - .15), lean: sio(u01(t, K.steer - .1, K.steer + .5)) - sio(u01(t, K.tech - .6, K.tech - .1)), enter: qio(u01(t, K.voters - .55, K.voters + .05)) * (1 - qio(u01(t, K.tech - .45, K.tech + .05))) }); }
    // c10.13 the hand with the small lit compass (carried in from below, lowered out on "Which one")
    { const hu = eoX(u01(t, K.holding - .5, K.holding + .25)) - eiX(u01(t, K.which2 - .45, K.which2 + .15));
      if (hu > .001) { const ns = u01(t, K.holding - .2, K.compass + .4), needle = 2.4 * (1 - settle(ns)) + .035 * Math.sin(t * 1.6); handCompass(ctx, t, { x: 1150, y: 1560 - 800 * hu, s: 3.1, glow: eoX(u01(t, K.compass - .1, K.compass + .6)), needle }); } }
    // c10.01 the line plate: the dark ground sinks away round the line as the world rises (the same picture at K.in)
    const dk = 1 - u01(t, K.in + .05, K.in + .8);
    if (dk > 0) { ctx.save(); ctx.globalAlpha = dk; lineGround(ctx, t, HI.o); ctx.restore(); ctx.save(); ctx.globalAlpha = Math.min(1, dk * 1.4); lineStroke(ctx, t, HI.o); ctx.restore(); }
    // c10.14 the lantern's light fills the frame (opaque disc of the `light` plate growing out of the lantern's core)
    if (t > K.disc0) {
      const Lp = C.P(...lanW(t)) || [960, 540], R = 30 + 2300 * eiX(u01(t, K.disc0, K.out - .1)), gA = 1 - u01(t, K.disc0 + .1, K.out - .2);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.arc(Lp[0], Lp[1], R, 0, 7); ctx.clip(); plate(ctx, t, 'light', HO.o); ctx.restore();
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(Lp[0], Lp[1], R * .9, Lp[0], Lp[1], R * 1.35 + 30); g.addColorStop(0, `rgba(255,200,120,${.45 * gA})`); g.addColorStop(1, 'rgba(255,140,60,0)'); ctx.fillStyle = g; if (gA > 0) ctx.fillRect(0, 0, 1920, 1080); ctx.restore();
    }
  }
  const lanW0 = (b, t) => frameOf(b, t)(-.5, 1.35, -2.4);
  prepareSky();
  await ready();
  return [
    { t: K.in, tr: 'cut', d: .1, draw: frame, print: HI.print },
    { t: K.disc0 + .25, tr: 'cut', d: .1, draw: frame, print: HO.print },
  ];
}
