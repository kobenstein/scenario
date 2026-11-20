// Film 8 · c08 · Our compass: North, East and West (VO 05a, 05b) · builder B2 · shots.md §8 c08.01–c08.21.
// Four worlds, joined by carriers: the sea with OUR rose (out of the fire box; the storms; tilt up to the North Star), Paris 1948 (cut on the
// same sky, tilt down to the hall's windows, through the glass; the hall; push into the sheet's glowing north point: light), the sea again
// (out of the north beacon's light; the beam and the rings; the whirl breaks on the buoys; East and West; the lighthouse; along the coast to
// the lock, the lagoons and the harbour post), and your table (push into the fresh rule sheet: paper; pull back off your note; through the
// window into the night sky: the sky plate).
//
// shot  | VO (accent)                                           | image                                                         | carrier / camera
// 08.01 | Our compass has the SAME POINTS.                      | out of the fire box, crane up: canoe at the centre of the rose; four icons light | light → crane 2 s
// 08.02 | But here, each one MEETS A STORM.                     | higher: whirl + fog from the south, squall fronts E and W, north clear | crane up
// 08.03 | North stays FIXED above all of them.                  | tilt up: Hōkūpaʻa still, the sky wheels round it in silver trails | tilt 1.4 s
// 08.04 | In 1948 … the world WROTE DOWN the rights …          | tilt down onto the hall's tall windows (Paris), through the glass; one sheet passes hand to hand | sky → glass
// 08.05 | It wasn't a LAW.                                      | the heavy law book beside the sheet closes and slides away     | close
// 08.06 | It wasn't a PLAN.                                     | a rolled plan rolls off the table's edge                        | pan
// 08.07 | It was a shared DIRECTION.                            | the engraved north point on the sheet glows; every head turns the same way | pull back
// 08.08 | Not a single country voted AGAINST it.                | hands rise across the hall; 48 FOR · 0 AGAINST · 8 ABSTAINED   | wide; push into the point (light)
// 08.09 | Our rights don't stop … MACHINE makes the DECISION.  | out of the north beacon: the cool beam sweeps the fleet, amber rings rise | light → pull back
// 08.10 | Power can move FAST.                                  | the whirl races in                                             | track
// 08.11 | Rights tell it where it CAN'T GO.                     | it breaks on the amber buoys along the north; its lights spill back | push
// 08.12 | Speed meets EAST and WEST … LOOK EARLY … SMALL STEPS. | E and W light; the lighthouse beam far out into the squall; tacking legs in the west | pans
// 08.13 | BRITAIN … TESTS … BEFORE AND AFTER release.           | the lock: the new vessel, inspectors with lanterns, the gate opens, a patrol follows | crane down
// 08.14 | Europe's new law … SANDBOX                            | crane up along the coast: a row of roped lagoons               | crane
// 08.15 | a SUPERVISED space … before they go EVERYWHERE.       | a new boat tries turns in one lagoon, lanterns on the quay, the boom opens | push
// 08.16 | And laws can come with an EXPIRY DATE.                | a rule sheet on a harbour post, a candle burns down under it  | swing round, close
// 08.17 | If no one RENEWS them, they simply END.               | the candle gutters out, the pin lets go, the sheet drops into the water | tilt
// 08.18 | Don't FREEZE the rules.                               | the second sheet frosts over, locked in ice                     | tilt down
// 08.19 | Let them LEARN.                                       | the ice cracks off, a pen amends it, a fresh pin                | push into the paper
// 08.20 | So ask the people who represent you one QUESTION:     | your table: your hand writes a note                              | paper → pull back
// 08.21 | when will this rule be REVIEWED?                      | the note in your hand; it slips under the envelope; up through the window into the sky | sky plate
import { clamp } from '../engine.mjs';
import { ready, camera, track, eoX, eiX, sio, u01, pulse, TAU, hash, projRuns } from '../lib/s8_kit.mjs';
import { drawSky, prepareSky, skyDir } from '../lib/s8_sky.mjs';
import { drawSea } from '../lib/s8_sea.mjs';
import { boat } from '../lib/s8_boats.mjs';
import { canoe, canoeFrame } from '../lib/s8_nav.mjs';
import { lanterns, lockGate, lagoons } from '../lib/s8_harbour.mjs';
import { seaRose, drawFleet, ringLayout, tackPos } from '../lib/s8_fleet.mjs';
import { front, whirl, fogBank, lightFlight, stormTone } from '../lib/s8_storms.mjs';
import { LIGHT, lightAt, drawLight } from '../lib/s8_light.mjs';
import { room, sheet, penHand, DESK } from '../lib/s8_desk.mjs';
import { inkRose } from '../lib/s8_rose.mjs';
import { crowd } from '../lib/s8_crowd.mjs';
import { label } from '../lib/s8_card.mjs';
import { hand } from '../lib/hand.mjs';
import { hand as handoff } from '../lib/handoff4.mjs';
import { growPlate, keys, vign, paperPatch } from '../lib/s8_b2kit.mjs';
import { envBack, envCorners } from '../lib/s8_c06_local.mjs';
import { roll } from '../lib/s8_c05_local.mjs';
import { starTrails, poleStar, eiffel, roofs, HALL, facade, hallRoom, longTable, chairBack, heavyBook, beamFan, buoyLine, lighthouse, land, sleek, candle, frost, ice, ruleText, noteText } from '../lib/s8_c08_local.mjs';

export default async function (T, R) {
  const A = (p, n) => T.S('05a', p, n), B = (p, n) => T.S('05b', p, n);
  const HI = handoff('c07>c08', T), HO = handoff('c08>c09', T);
  const K = {
    in: HI.b, our: A('Our compass'), same: A('same points'), but: A('But here'), meets: A('meets'), north: A('North stays'), fixed: A('fixed'), above: A('above'),
    in48: A('In nineteen'), war: A('war'), wrote: A('wrote'), lose: A('lose'), law: A('law'), plan: A('plan'), shared: A('shared'), direction: A('direction'),
    not: A('Not a'), against: A('against'), rights: A('Our rights'), machine: A('machine'), decision: A('decision'), power: A('Power can'), fast: A('fast'),
    tell: A('Rights tell'), cant: A("can't"), go: A('go'),
    speed: B('Speed'), east: B('East'), west: B('West'), look: B('look early'), small: B('small steps'), undo: B('undo'), britain: B('Britain'), tests: B('tests'),
    before: B('before and'), release: B('release'), europe: B("Europe's"), sandbox: B('sandbox'), supervised: B('supervised'), everywhere: B('everywhere'),
    laws: B('And laws'), expiry: B('expiry'), renews: B('renews'), end: B('end'), freeze: B("Don't freeze"), learn: B('learn'), so: B('So ask'), question: B('question'),
    when: B('when will'), reviewed: B('reviewed'), out: HO.a,
  };
  K.A1 = K.in48 - .2; K.B1 = K.rights - .25; K.C1 = K.so - .05;   // the three cuts: sea → hall (sky), hall → sea (light), harbour → table (paper)
  const aimW = (q, d, yaw, p, F) => ({ x: q[0] - d * Math.sin(yaw) * Math.cos(p), y: q[1] + d * Math.sin(p), z: q[2] - d * Math.cos(yaw) * Math.cos(p), yaw, pitch: p, F });
  const POLE = [0, .38], SKYCUT = { yaw: 0, pitch: -.5, F: 1100 };
  const trailArc = (t) => .08 + 1.5 * sio(u01(t, K.fixed - .8, K.in48 + 1.8)), trailRot = (t) => .045 * (t - K.north);

  // ================================================================ the sea: OUR rose (centre 0, 0; N = +Z), the fleet, the storms
  const RR = 40, FLEET = ringLayout(64, 0, 0, RR * 1.8, 11), HK = { x: 0, z: 0, head: 0 };
  const FIRE = canoeFrame(HK, K.in)(.35, 1.35, 1.2);
  const BEACON = [0, 5, RR * 1.02];
  const pointsAt = (t) => {
    const p = [0, 1, 2, 3].map((i) => u01(t, K.same - .1 + i * .3, K.same + .3 + i * .3));
    if (t > K.speed - .3) { const ew = .5 + .5 * u01(t, K.speed, K.east + .2); p[1] = Math.max(p[1], ew + .6 * pulse(t, K.east - .05, K.east + .7)); p[3] = Math.max(p[3], ew + .6 * pulse(t, K.west - .05, K.west + .7)); }
    return p.map((v) => clamp(v));
  };
  // the storms (08.02): the whirl and the fog come in from the south, speed fronts on the E and W horizon
  const WH = (t) => {
    if (t < K.B1) { const u = sio(u01(t, K.but, K.north + .5)); return { x: -60 + 20 * u, z: -230 + 90 * u, R: 62, a: u01(t, K.but - .2, K.meets + .3), spin: .5, bright: .6 }; }
    // 08.10–11: it races in from the north-west toward the north rim and breaks on the buoys
    const u = u01(t, K.power - .1, K.cant - .1), e = u * u * (3 - 2 * u);
    const brk = u01(t, K.cant - .1, K.go + .6);
    return { x: -230 + 220 * e, z: 330 - 180 * e, R: 46 * (1 - .6 * brk), a: u01(t, K.power - .3, K.power + .2) * (1 - brk), spin: .5 + .9 * u, brk, bright: 1 };
  };
  const BUOYS = Array.from({ length: 23 }, (_, i) => { const th = -.8 + 1.6 * i / 22; return [Math.sin(th) * 96, Math.cos(th) * 96]; });
  // the horizon light's beam (08.09): from the light on the horizon toward the fleet, sweeping; boats it touches get their ring
  const LO = [Math.sin(LIGHT.az) * 2600, Math.cos(LIGHT.az) * 2600];
  const sweep = track([[K.rights - .1, -.06], [K.machine - .2, -.01], [K.machine + .3, .0], [K.decision, .035], [K.decision + .6, .06], [K.power, .07]]);
  const beamAng = (t) => Math.PI + LIGHT.az + sweep(t);
  const angOf = (b) => Math.atan2(b.x - LO[0], b.z - LO[1]);
  const touchT = FLEET.map((b) => { const a = angOf(b); for (let t = K.rights - .1; t < K.power; t += 1 / 30) if (Math.abs(((beamAng(t) - a + 3 * Math.PI) % TAU) - Math.PI) < .012) return t; return 1e9; });
  // the lighthouse (08.12) on the headland of the coast to the east; the coast: north shore z = 48 from x 262 east
  const LH = { x: 250, z: 62, h: 26 };
  const LOCK = { x: 300, z: -12, w: 14, L: 60 }, SHORE = 48;
  const LANDW = [[262, -220], [291, -220], [291, SHORE], [262, SHORE]], LANDE = [[309, -220], [620, -220], [620, SHORE], [309, SHORE]];
  const LAG = { n: 6, R: 17, gapX: 44, x0: 344, z: SHORE + 22, at: 2 };
  const lagX = LAG.x0 + LAG.at * LAG.gapX;
  const POST = { x: 470, z: SHORE + .3, base: 2.4, h: 5.9 };
  // the vessel in the lock and its patrol
  const vesselZ = (t) => LOCK.z + 30 + 70 * eiX(u01(t, K.release - .5, K.europe + 1.5)) * .35 + 50 * sio(u01(t, K.release - .3, K.europe + 1.2));
  const gateOpen = (t) => sio(u01(t, K.before - .3, K.release - .2));
  function seaWorld(ctx, t, C, o = {}) {
    drawSky(ctx, t, C, { stars: 1, mw: .9 });
    if (o.trails) { starTrails(ctx, t, C, { pole: POLE, arc: trailArc(t), rot: trailRot(t), a: o.trails }); poleStar(ctx, C, POLE, 1); }
    const L = lightAt(C); if (t > K.B1 && L) drawLight(ctx, t, C, { ign: 1, ring: 0, size: .8, pulse: .2 * pulse(t, K.machine - .1, K.machine + .6) }, { x: L.x, y: L.y });
    drawSea(ctx, t, C, { glints: L && t > K.B1 ? [{ x: L.x, y: L.y, col: '#8fe6ff', a: .5, w: 80, spread: .4 }] : [] });
    // the speed fronts on the E and W horizon, the power front low in the south-west
    const fa = u01(t, K.but - .1, K.meets + .6) * (1 - u01(t, K.fixed - .2, K.above + .3)) * (t < K.A1 ? 1 : 0) + (t > K.speed - .4 ? u01(t, K.speed - .4, K.east + .4) : 0);
    if (t > K.B1 && t < K.speed) { const pa = u01(t, K.power - .4, K.fast + .2) * (1 - u01(t, K.cant, K.go + .8)); if (pa > 0) front(ctx, t, C, { az: -.45, w: .22, h: .1, kind: 'power', seed: 9, a: pa, spin: .6, glow: .6 }); }
    if (fa > 0) { front(ctx, t, C, { az: t < K.A1 ? .62 : 1.05, w: .3, h: .09, kind: 'speed', seed: 3, a: fa }); front(ctx, t, C, { az: t < K.A1 ? -.62 : -1.05, w: .3, h: .08, kind: 'speed', seed: 4, a: fa }); }
    if (t < K.A1) { const sa = u01(t, K.but - .1, K.meets + .5); if (sa > 0) { front(ctx, t, C, { az: Math.PI + .3, w: .35, h: .12, kind: 'power', seed: 6, a: sa, spin: .4 }); front(ctx, t, C, { az: Math.PI - .5, w: .4, h: .07, kind: 'trust', seed: 7, a: sa }); } }
    // the coast to the east: land, the lock, the lagoons, the lighthouse, the post (only once the camera can see it)
    const coast = t > K.speed;
    if (coast) coastWorld(ctx, t, C);
    // the storms on the water
    const wh = WH(t);
    if (wh.a > 0) whirl(ctx, t, C, { x: wh.x, z: wh.z, R: wh.R, a: wh.a, spin: wh.spin ?? .3, bright: wh.bright || 0 });
    if (t < K.A1) { const fa2 = u01(t, K.but, K.north); if (fa2 > 0) fogBank(ctx, t, C, { x0: 10, x1: 300, z0: -280 + 80 * fa2, z1: -90, h: 30, a: .6 * fa2 }); }
    // the rose, the canoe, the fleet
    const lit = t < K.B1 ? 1 : 1;
    seaRose(ctx, t, C, { x: 0, z: 0, R: RR, a: lit, points: pointsAt(t), icons: 1, rim: 0, spin: 0 });
    // the buoys on the north line (08.11)
    let BL = [];
    if (t > K.B1) { const ba = u01(t, K.power - .5, K.power + .3); if (ba > 0) BL = buoyLine(ctx, t, C, BUOYS, { a: ba, flare: pulse(t, K.cant - .15, K.go + .5) }); }
    // the beam (08.09)
    if (t > K.B1 && t < K.power + .6) beamFan(ctx, t, C, { O: LO, ang: beamAng(t), half: .0055, len: 2900, y: .15, a: u01(t, K.rights - .2, K.rights + .3) * (1 - u01(t, K.fast - .4, K.power + .6)), k: .2, r0: 600, air: 0 });
    const ringFn = (b, i) => (t > K.B1 ? clamp((t - touchT[i]) / .45) : 0);
    // the fleet in the west tacks in short legs (08.12)
    const tk = u01(t, K.small - .6, K.small - .2);
    drawFleet(ctx, t, C, FLEET, { lantern: 1, sail: 'slack', ringFn });
    if (tk > 0) tacking(ctx, t, C, tk);
    canoe(ctx, t, C, HK);
    // the captured lights in the whirl, and how they spill back to the boats when it breaks
    if (wh.a > 0 || (wh.brk > 0 && wh.brk < 1)) spill(ctx, t, C, wh);
    if (BL.length) lanterns(ctx, t, BL, 1, 0);
    // the fleet's labels: none. The canoe's fire box (for the light carrier)
    return { fire: C.P(...canoeFrame(HK, t)(.35, 1.35, 1.2)), beacon: C.P(...BEACON) };
  }
  const SPILL = Array.from({ length: 26 }, (_, i) => ({ r: .25 + .75 * hash(i * 2.3), ph: hash(i * 5.1) * TAU, to: FLEET[(i * 5 + 3) % FLEET.length] }));
  function spill(ctx, t, C, wh) {
    const L = [];
    for (const s of SPILL) {
      const brk = wh.brk || 0, th = s.ph + t * 1.6 * (1 + s.r);
      if (brk < .15) { const p = C.P(wh.x + Math.sin(th) * wh.R * s.r, .8, wh.z + Math.cos(th) * wh.R * s.r); if (p) L.push([p[0], p[1], Math.max(1.4, p[2] * .5), s.ph]); }
      else { const u = clamp((brk - .15) / .8); lightFlight(ctx, t, C, [wh.x + Math.sin(th) * 10 * s.r, 1, wh.z + Math.cos(th) * 10 * s.r], [s.to.x, 1.2, s.to.z], u, { curl: .8 }); }
    }
    if (L.length) lanterns(ctx, t, L, .9, 0);
  }
  const TACK = Array.from({ length: 7 }, (_, i) => ({ x: -150 - 22 * (i % 3) - 6 * i, z: -40 + 18 * i, ph: hash(i * 7) * 1.2 }));
  function tacking(ctx, t, C, a) {
    const t0 = K.small - .8, boats = [];
    for (const b of TACK) {
      const pos = (tt) => tackPos(Math.max(0, tt - t0) + b.ph, b.x, b.z, 0, 9, 1.1, .75);
      const pts = []; for (let k = 0; k <= 28; k++) { const p = pos(t - k * .12); pts.push([p.x, .15, p.z]); }
      for (const run of projRuns(C, pts)) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,179,92,${.3 * a})`; ctx.lineWidth = 7; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.strokeStyle = `rgba(255,217,160,${.95 * a})`; ctx.lineWidth = 2.4; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore(); }
      const p = pos(t); boats.push({ x: p.x, z: p.z, head: p.head, sc: .9, seed: b.ph });
    }
    drawFleet(ctx, t, C, boats, { lantern: a, sail: 'full' });
  }
  // the coast: land, lock with the vessel, the lagoons, the lighthouse, the post with its sheets
  function coastWorld(ctx, t, C) {
    land(ctx, t, C, LANDW); land(ctx, t, C, LANDE);
    roofs(ctx, t, C, { x0: 330, x1: 610, z: -60, seed: 31, lit: .8 });
    const lg = lockGate(ctx, t, C, { x: LOCK.x, z: LOCK.z, w: LOCK.w, L: LOCK.L, open: gateOpen(t) });
    // the vessel, its inspectors, the patrol lantern
    const vz = vesselZ(t), V = { x: LOCK.x, z: vz, head: 0, L: 24, glow: 1 };
    const items = [{ d: C.depth(V.x, 1, V.z), f: () => {
      const s = sleek(ctx, t, C, V);
      const walk = u01(t, K.britain + .2, K.release - .3), ins = [0, 1, 2].map((i) => { const w = -.32 + .2 * i + .25 * Math.sin(walk * 3 + i * 2); const p = s.deck((i - 1) * .25, w); return { x: p[0], z: p[2], h: 1.7, pose: 'stand', seed: 400 + i, hold: 'lantern' }; });
      if (t < K.europe + 1) crowd(ctx, t, C, ins, { y: s.deck(0, 0)[1], light: [V.x, 6, V.z], lightCol: '#cfe8ff' });
    } }, { d: C.depth(LOCK.x, 1, vz - 20), f: () => boat(ctx, t, C, { x: LOCK.x - 2, z: vz - 22 + 6 * u01(t, K.release, K.europe + 1), head: 0, lantern: 1, sail: 'none', scale: 1 }) }];
    items.sort((a, b) => b.d - a.d).forEach((it) => it.f());
    // the lagoons; inside one a new boat tries turns, then goes out through the boom
    const lgn = lagoons(ctx, t, C, { n: LAG.n, R: LAG.R, gapX: LAG.gapX, x0: LAG.x0, z: LAG.z, lit: u01(t, K.europe - .2, K.sandbox), boom: u01(t, K.everywhere - .6, K.everywhere + .2), at: LAG.at });
    const tr = u01(t, K.supervised - .4, K.everywhere - .4), out = u01(t, K.everywhere - .3, K.laws + 1);
    if (t > K.europe) { const th = tr * TAU * 1.5, bx = lagX + Math.sin(th) * 8 * (1 - out), bz = LAG.z + Math.cos(th) * 6 * (1 - out) + 34 * out * out; boat(ctx, t, C, { x: bx, z: bz, head: out > 0 ? 0 : th + Math.PI / 2, lantern: 1, sail: 'full', scale: 1.1 }); }
    // the watchers on the quay with lanterns
    if (t > K.europe) crowd(ctx, t, C, Array.from({ length: 9 }, (_, i) => ({ x: lagX - 12 + i * 3 + hash(i) * 1.2, z: SHORE - 1.4 - hash(i * 3) * 1.2, h: 1.65 + hash(i * 5) * .2, pose: 'stand', seed: 500 + i, hold: i % 2 ? 'lantern' : null })), { y: 2.4, light: [lagX, 4, SHORE + 4], lightCol: '#ffb066' });
    lighthouse(ctx, t, C, { x: LH.x, z: LH.z, h: LH.h, ang: lhAng(t), a: u01(t, K.speed, K.east), half: .04, len: 1500 });
    postWorld(ctx, t, C);
    return lg;
  }
  const lhAng = track([[K.speed, .3], [K.look - .4, .7], [K.look + .3, 1.05], [K.small + .4, 1.12], [K.britain, .9], [K.out, .2]]);

  // ---------------------------------------------------------------- the harbour post: two rule sheets, the candle (c08.16–19)
  const PZ = POST.z + .34;   // the sheets on the post's north face (seen from the water)
  const SHA = { w: .5, h: .7, y: POST.h - .3 }, SHB = { w: .5, h: .7, y: POST.h - 1.65 };
  const cornersOf = (S, drop = 0) => {
    const dy = drop * drop * (S.y - .25), tilt = drop * .9, dz = drop * 1.2, x0 = POST.x;
    const P = (u, v) => { const yy = S.y - v * S.h; return [x0 + (u - .5) * S.w * Math.cos(tilt * .3) * -1, yy - dy + (u - .5) * Math.sin(tilt) * .3, PZ + dz + v * Math.sin(tilt) * .2]; };
    return [P(0, 0), P(1, 0), P(1, 1), P(0, 1)];
  };
  // the camera looks south (yaw π), so plate-left is world +x: the sheet's TL corner is at the larger x
  const fallA = (t) => u01(t, K.end - .2, K.end + .55);
  const frostU = (t) => sio(u01(t, K.freeze - .1, K.freeze + .8)) * (1 - u01(t, K.learn - .1, K.learn + .35));
  const crackU = (t) => u01(t, K.learn - .3, K.learn);
  const amendU = (t) => u01(t, K.learn + .25, K.so - .55);
  const MGB = [[460, 2116], [1460, 2116], [1460, 2678], [460, 2678]];   // the blank foot of sheet B (16:9): the paper carrier
  const onB = (px, py) => { const Q = cornersOf(SHB), u = px / 1920, v = py / 2688; return [0, 1, 2].map((i) => (1 - v) * ((1 - u) * Q[0][i] + u * Q[1][i]) + v * ((1 - u) * Q[3][i] + u * Q[2][i])); };
  const MGBW = MGB.map(([x, y]) => onB(x, y)), MGBC = onB(960, 2397);
  function postWorld(ctx, t, C) {
    if (C.depth(POST.x, POST.h, POST.z) < .2 || C.depth(POST.x, POST.h, POST.z) > 400) return;
    // the post itself (dark wood, cool rim)
    const a = C.P(POST.x, POST.base, PZ - .02), b = C.P(POST.x, POST.h + .25, PZ - .02); if (!a || !b) return;
    const w = .3 * b[2];
    ctx.save(); ctx.fillStyle = '#1e1622'; ctx.fillRect(Math.min(a[0], b[0]) - w, b[1], 2 * w, a[1] - b[1]);
    ctx.strokeStyle = 'rgba(5,4,10,.5)'; ctx.lineWidth = 1; for (let i = 0; i < 6; i++) { const x = b[0] - w * .8 + i * w * .32; ctx.beginPath(); ctx.moveTo(x, b[1]); ctx.bezierCurveTo(x + 3, (a[1] + b[1]) / 2, x - 3, (a[1] + b[1]) / 2 + 20, x, a[1]); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(164,176,220,.35)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(b[0] - w, b[1]); ctx.lineTo(a[0] - w, a[1]); ctx.stroke(); ctx.restore();
    // sheet A (expiry) and the candle under it
    const fa = fallA(t);
    if (fa < 1) sheet(ctx, t, C, { corners: cornersOf(SHA, fa), aspect: SHA.w / SHA.h, res: .45, draw: (g, tt, W, H) => ruleText(g, tt, W, H, { title: 'RULE 7', stamp: 'EXPIRES · 31 DEC 2027', seed: 3 }) });
    else { const fl = u01(t, K.end + .55, K.end + 3), x0 = POST.x, z0 = PZ + 1.0 + fl * 1.4; sheet(ctx, t, C, { corners: [[x0 + .25, .03, z0], [x0 - .25, .03, z0], [x0 - .25, .03, z0 + .7], [x0 + .25, .03, z0 + .7]], aspect: SHA.w / SHA.h, res: .35, draw: (g, tt, W, H) => { ruleText(g, tt, W, H, { title: 'RULE 7', stamp: 'EXPIRES · 31 DEC 2027', seed: 3 }); g.fillStyle = `rgba(20,30,50,${.3 + .4 * fl})`; g.fillRect(0, 0, W, H); } }); }
    // the pin (pops out as it lets go)
    const pinA = C.P(POST.x, SHA.y - .04 - (fa > 0 ? fa * .4 : 0), PZ + .01 + fa * .3); if (pinA) { ctx.fillStyle = '#c8a050'; ctx.beginPath(); ctx.arc(pinA[0], pinA[1], Math.max(2, pinA[2] * .012), 0, TAU); ctx.fill(); }
    const left = 1 - u01(t, K.laws - .4, K.end - .5) * .85, gust = pulse(t, K.renews - .1, K.end), on = t < K.end - .25 ? 1 : 0;
    candle(ctx, t, C, [POST.x, SHA.y - SHA.h - .14, PZ + .12], { h: left, on, gust, outT: K.end - .25 });
    // sheet B: frost, ice, cracks, the amendment, the fresh pin
    const fr = frostU(t), cr = crackU(t), am = amendU(t);
    sheet(ctx, t, C, { corners: cornersOf(SHB), aspect: SHB.w / SHB.h, res: t > K.so - 1 ? 1.1 : .5, draw: (g, tt, W, H) => { ruleText(g, tt, W, H, { title: 'RULE 12', seed: 8, amend: am }); frost(g, W, H, fr); ice(g, W, H, fr, cr); } });
    const pin2 = C.P(POST.x, SHB.y - .04, PZ + .01); if (pin2) { const fresh = pulse(t, K.so - .6, K.so - .3); ctx.fillStyle = fresh > 0 ? '#e8c060' : '#c8a050'; ctx.beginPath(); ctx.arc(pin2[0], pin2[1], Math.max(2, pin2[2] * .012) * (1 + .5 * fresh), 0, TAU); ctx.fill(); }
    // the ice shards falling off (08.19)
    if (cr > 0 && t < K.learn + 1.2) { const r0 = u01(t, K.learn - .05, K.learn + 1.1); for (let i = 0; i < 14; i++) { const u = hash(i * 3.3), v = hash(i * 7.1), p = onB(u * 1920, v * 2688); const q = C.P(p[0], p[1] - 4.9 * Math.pow(r0 * (.8 + .4 * hash(i)), 2) * 1.2, p[2] + .05 + r0 * .4); if (!q || r0 <= 0) continue; const s = q[2] * .022 * (.5 + hash(i * 9)); ctx.save(); ctx.translate(q[0], q[1]); ctx.rotate(r0 * 6 * (hash(i) - .5) + hash(i * 2)); ctx.fillStyle = `rgba(226,240,255,${.75 * (1 - r0)})`; ctx.strokeStyle = `rgba(255,255,255,${.9 * (1 - r0)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-s * 1.6, -s * .2); ctx.lineTo(s * .4, -s * .7); ctx.lineTo(s * 1.4, s * .1); ctx.lineTo(-s * .2, s * .5); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); } }
    // the pen amending it (a hand from the right)
    if (am > 0 && am < 1) { const y = (.22 + 3 * .075) * 2688 - .055 * 2688 + 20, x = am < .45 ? 230 + 1340 * clamp(am * 2.2) : 270 + 1150 * clamp((am - .45) / .55); const p = C.P(...onB(x, y)); if (p) { const s = p[2] * .17 / 150; penHand(ctx, t, p[0], p[1], s, { lift: 0, ang: -.95, skin: '#c99a74', sleeve: '#2a2236' }); } }
    // the pressing thumb for the fresh pin
    const pp = pulse(t, K.so - .75, K.so - .25); if (pp > 0 && pin2) { const s = pin2[2] * .19 / 150; hand(ctx, pin2[0] + 30 * s, pin2[1] + 150 * s * (1 - pp * .6), s, { pose: 'reach', ang: -1.75, skin: '#c99a74', sleeve: '#2a2236', rim: '#ffb066', t, close: .5 }); }
    // the label: none (the sheets speak). Lamplight from the candle on the post
  }

  // ================================================================ Paris, 10 December 1948: the hall
  const WINX = 3, ROWS = HALL.tables;
  const DELS = ROWS.map((zt, j) => { const a = []; for (const [x0, x1] of [[-13.4, -1.6], [1.6, 13.4]]) for (let x = x0; x <= x1 + .01; x += 1.6) a.push({ x: x + (j % 2) * .3, z: zt - .78, h: 1.7 + hash(x * 3 + j) * .2, pose: 'sit', seed: j * 50 + Math.round(x * 3) + 60, ph: hash(x + j * 9) }); return a; });
  // the sheet that passes from hand to hand on the first table (left block, delegates at x −6.8 … −2.0)
  const HOPS = [-7.6, -6.0, -4.4, -2.8], HOPT = [K.in48 + 1.6, K.war + .3, K.wrote, K.lose - .3, K.lose + .5];
  const sheetX = (t) => { let x = HOPS[0]; for (let i = 0; i < 3; i++) x += (HOPS[i + 1] - HOPS[i]) * sio(u01(t, HOPT[i + 1] - .55, HOPT[i + 1] - .05)); return x; };
  const SZ = ROWS[0] + .1;
  const sheetCorn = (t) => { const x = sheetX(t), r = .05 * Math.sin(t * .7); return [[x - .105, .762, SZ + .15], [x + .105, .762, SZ + .15], [x + .105, .762, SZ - .15], [x - .105, .762, SZ - .15]].map(([a, y, c]) => [x + (a - x) * Math.cos(r) - (c - SZ) * Math.sin(r), y, SZ + (a - x) * Math.sin(r) + (c - SZ) * Math.cos(r)]); };
  const pointGlow = (t) => u01(t, K.direction - .5, K.direction + .2);
  function udhrSheet(g, t, W, H) {
    g.fillStyle = '#2a2420'; g.font = `600 ${Math.round(W * .045)}px Inter`; g.textAlign = 'center';
    g.fillText('UNIVERSAL DECLARATION', W / 2, H * .17); g.fillText('OF HUMAN RIGHTS', W / 2, H * .21);
    g.fillStyle = 'rgba(42,36,32,.55)'; for (let i = 0; i < 22; i++) { let x = W * .12; const y = H * .27 + i * H * .029; const r = hash(i * 3.7); while (x < W * (.84 - (i % 6 === 5 ? .3 : 0) * r)) { const w = W * (.02 + .05 * hash(x + i)); g.fillRect(x, y, w, 3); x += w + W * .012; } }
    // the small engraved compass point at the head of the sheet
    const pg = pointGlow(t), cx = W / 2, cy = H * .085, s = W * .045;
    if (pg > 0) { const gr = g.createRadialGradient(cx, cy, 0, cx, cy, s * 4); gr.addColorStop(0, `rgba(255,179,92,${.8 * pg})`); gr.addColorStop(1, 'rgba(255,179,92,0)'); g.fillStyle = gr; g.fillRect(cx - s * 4, cy - s * 4, s * 8, s * 8); }
    g.fillStyle = pg > .3 ? '#c4512e' : '#2a2420'; g.beginPath(); g.moveTo(cx, cy - s * 1.4); g.lineTo(cx + s * .32, cy - s * .2); g.lineTo(cx + s * 1.1, cy); g.lineTo(cx + s * .32, cy + s * .2); g.lineTo(cx, cy + s * 1.1); g.lineTo(cx - s * .32, cy + s * .2); g.lineTo(cx - s * 1.1, cy); g.lineTo(cx - s * .32, cy - s * .2); g.closePath(); g.fill();
  }
  const PTW = (t) => { const Q = sheetCorn(t), u = .5, v = .085; return [0, 1, 2].map((i) => (1 - v) * ((1 - u) * Q[0][i] + u * Q[1][i]) + v * ((1 - u) * Q[3][i] + u * Q[2][i])); };
  const BOOKX = -2.32, rollP = (t) => { const u = u01(t, K.plan - .1, K.plan + .7), f = u01(t, K.plan + .7, K.plan + 1.05); const z = SZ - .12 + .42 * sio(u) + .18 * f; return { x0: -3.48, x1: -3.08, z, y: .762 + .035 - 1.6 * f * f, rot: u * 9 }; };
  function hallInterior(ctx, t, C) {
    hallRoom(ctx, t, C, { lv: 1 });
    const turn = sio(u01(t, K.direction - .2, K.direction + .6)), up = (i, j) => sio(u01(t, K.against - .5 + hash(i * 3 + j) * .7, K.against + .1 + hash(i * 3 + j) * .7));
    for (let j = ROWS.length - 1; j >= 0; j--) {
      const zt = ROWS[j];
      if (C.depth(0, 1, zt) < -1 && C.depth(-10, 1, zt) < -1 && C.depth(10, 1, zt) < -1) continue;
      for (const [x0, x1] of [[-14, -1.2], [1.2, 14]]) longTable(ctx, t, C, { x0, x1, z: zt, lamps: [x0 + 1.6, (x0 + x1) / 2, x1 - 1.6] });
      if (j === 0) tableTop(ctx, t, C);
      const ppl = DELS[j].map((p, i) => ({ ...p, turn: turn * (.8 + .2 * p.ph), raise: up(i, j) }));
      crowd(ctx, t, C, ppl, { light: [0, 1.2, zt + .3], lightCol: '#ffb066' });
      for (const p of DELS[j]) chairBack(ctx, C, p.x, p.z - .28, 1);
    }
  }
  // what lies on the first table: the passing sheet, the law book, the rolled plan, the hands
  function tableTop(ctx, t, C) {
    sheet(ctx, t, C, { corners: sheetCorn(t), aspect: .21 / .297, res: .5, draw: (g, tt, W, H) => udhrSheet(g, tt, W, H) });
    heavyBook(ctx, t, C, { x: BOOKX, z: SZ + .02, w: .2, d: .28, close: sio(u01(t, K.law - .2, K.law + .35)), dx: 1.4 * eiX(u01(t, K.law + .35, K.law + .95)) });
    const r = rollP(t); if (r.y > -.2) roll(ctx, t, C, [r.x0, r.y, r.z], [r.x1, r.y, r.z], .035);
    // the hands that pass it (one gives, the next takes)
    for (let i = 0; i < 3; i++) {
      const a = pulse(t, HOPT[i + 1] - .8, HOPT[i + 1] + .25); if (a <= 0) continue;
      const x = sheetX(t);
      for (const [dx, side] of [[-.16, 1], [.16, -1]]) { const p = C.P(x + dx, .79, SZ - .1); if (!p) continue; const s = p[2] * .19 / 150; hand(ctx, p[0] - side * 10 * s, p[1] + 60 * s * (1 - a), s, { pose: side > 0 ? 'grip' : 'reach', ang: -1.57 + side * .5, flip: side < 0, skin: ['#c99a74', '#a8734f', '#e9c2a0', '#7a4f33'][(i + (side > 0 ? 0 : 1)) % 4], sleeve: '#16141f', sleeveLen: 300, rim: '#ffb066', light: [0, -1], t, close: .3 }); }
    }
  }
  const camH = keys([
    [K.A1, { x: WINX, y: 30, z: -70, ...SKYCUT }],
    [K.in48 + 1.0, aimW([WINX, 9, 0], 30, 0, .12, 1150)],
    [K.war - .1, aimW([WINX, 7.5, 0], 9, 0, .05, 1200)],
    [K.war + .55, { x: WINX - .5, y: 4.6, z: 1.4, yaw: -.12, pitch: .32, F: 1200 }],
    [K.war + 1.3, aimW([sheetX(K.war + 1.3), .76, SZ], 2.9, -.18, .78, 1250)],
    [K.wrote + .3, aimW([sheetX(K.wrote + .3), .76, SZ], 2.6, -.12, .82, 1280)],
    [K.lose + .3, aimW([sheetX(K.lose + .3) + .2, .76, SZ], 2.3, -.05, .86, 1300)],
    [K.law - .3, aimW([-2.55, .78, SZ + .02], 1.15, .05, 1.12, 1300)],
    [K.law + .7, aimW([-2.35, .78, SZ + .02], 1.1, .1, 1.1, 1300)],
    [K.plan + .3, aimW([-3.15, .7, SZ + .15], 1.2, -.05, .95, 1300)],
    [K.shared, aimW([-2.8, .78, SZ + .02], .9, 0, 1.15, 1350)],
    [K.direction + .4, { x: -.6, y: 3.6, z: 1.6, yaw: -.05, pitch: .38, F: 1200 }],
    [K.against, { x: 0, y: 6.2, z: .5, yaw: 0, pitch: .34, F: 1100 }],
    [K.rights - .75, { x: -.3, y: 6.0, z: 1.1, yaw: -.03, pitch: .38, F: 1120 }],
    [K.B1, { ...aimW(PTW(K.B1), .5, 0, 1.0, 1300) }],
  ]);
  function hallWorld(ctx, t, C) {
    if (C.z < -.05) {   // outside: the night sky over Paris, the tower far off, the roofs, the façade; the hall seen through the windows
      drawSky(ctx, t, C, { stars: 1, mw: .9 });
      starTrails(ctx, t, C, { pole: POLE, arc: trailArc(t), rot: trailRot(t), a: 1 }); poleStar(ctx, C, POLE, 1);
      eiffel(ctx, C, -.55, .085, 1);
      roofs(ctx, t, C, { x0: -260, x1: -26, z: 40, seed: 12 }); roofs(ctx, t, C, { x0: 26, x1: 260, z: 40, seed: 13 });
      facade(ctx, t, C, { z: 0, inside: (cx) => hallInterior(cx, t, C) });
      vign(ctx, .35);
      return;
    }
    hallInterior(ctx, t, C);
    // the labels
    const lp = C.P(-2.0, .9, SZ + .2);
    if (lp) label(ctx, t, lp[0], lp[1], u01(t, K.war + .9, K.war + 1.5) * (1 - u01(t, K.lose + .3, K.lose + .6)), 'UNIVERSAL DECLARATION OF HUMAN RIGHTS', 'PARIS, 10 DEC 1948', { len: 150, dx: 90, side: 'left' });
    const vp = C.P(0, 2.4, HALL.front - 4);
    if (vp) label(ctx, t, vp[0], vp[1], u01(t, K.against - .2, K.against + .4) * (1 - u01(t, K.rights - .7, K.rights - .45)), '48 FOR · 0 AGAINST · 8 ABSTAINED', '', { len: 120, dx: 70 });
    vign(ctx, .4);
  }

  // ================================================================ the sea cameras (A: 08.01–03, C: 08.09–08.19)
  const camA = keys([
    [K.in, aimW(FIRE, 4.5, .2, .32, 1300)],
    [K.in + .7, aimW(FIRE, 12, .14, .45, 1250)],
    [K.same + .4, aimW([0, 0, 2], 150, .02, .95, 1150)],
    [K.but, aimW([0, 0, 0], 190, 0, 1.0, 1100)],
    [K.meets + .7, aimW([0, 0, -70], 330, -.04, .64, 1050)],
    [K.north, aimW([0, 0, -60], 340, -.02, .6, 1060)],
    [K.fixed + .5, { yaw: 0, pitch: -.36, F: 1100 }],
    [K.A1, { ...SKYCUT }],
  ]);
  const camC = keys([
    [K.B1, aimW(BEACON, 6, .08, .22, 1300)],
    [K.B1 + .7, aimW([0, 0, 30], 90, .1, .32, 1200)],
    [K.decision, aimW([0, 0, 30], 150, .12, .38, 1100)],
    [K.power + .2, aimW([-20, 0, 70], 170, .02, .34, 1050)],
    [K.cant, aimW([-10, 0, 90], 120, .04, .38, 1150)],
    [K.go + .7, aimW([-5, 0, 85], 112, .05, .4, 1150)],
    [K.speed + .3, aimW([0, 0, 0], 250, -.06, .72, 1050)],
    [K.east + .2, aimW([40, 0, 10], 320, .08, .64, 1050)],
    [K.look - .2, aimW([75, 0, 30], 370, .18, .56, 1050)],
    [K.look + .6, aimW([215, 10, 70], 160, .75, .26, 1100)],
    [K.small, aimW([-150, 0, 20], 130, -.35, .5, 1100)],
    [K.undo + .3, aimW([-160, 0, 30], 120, -.4, .5, 1100)],
    [K.britain - .3, aimW([LOCK.x, 2, LOCK.z + 40], 70, .5, .42, 1150)],
    [K.tests, aimW([LOCK.x, 2, LOCK.z + 40], 34, .62, .3, 1250)],
    [K.before, aimW([LOCK.x, 2, LOCK.z + 46], 36, .5, .28, 1250)],
    [K.release - .3, aimW([LOCK.x, 2, LOCK.z + 58], 48, .4, .3, 1200)],
    [K.europe + .2, aimW([LOCK.x + 30, 0, SHORE + 30], 140, .9, .5, 1100)],
    [K.sandbox, aimW([lagX + 20, 0, LAG.z], 230, 1.15, .55, 1050)],
    [K.supervised + .3, aimW([lagX, 0, LAG.z], 70, .9, .52, 1200)],
    [K.everywhere + .3, aimW([lagX, 0, LAG.z + 10], 74, .8, .45, 1200)],
    [K.laws - .1, aimW([POST.x, POST.h - .8, PZ], 14, Math.PI - .35, .16, 1250)],
    [K.expiry, aimW([POST.x, SHA.y - .5, PZ], 1.35, Math.PI - .08, .1, 1300)],
    [K.renews, aimW([POST.x + .1, SHA.y - .75, PZ], 1.15, Math.PI - .16, .2, 1350)],
    [K.end, aimW([POST.x, SHA.y - .62, PZ], 1.45, Math.PI - .04, .14, 1300)],
    [K.end + .6, aimW([POST.x, SHA.y - 1.1, PZ + .4], 2.2, Math.PI - .02, .34, 1250)],
    [K.freeze, aimW([POST.x, SHB.y - .35, PZ], 1.2, Math.PI + .05, .04, 1300)],
    [K.freeze + .9, aimW([POST.x - .05, SHB.y - .3, PZ], .95, Math.PI + .12, -.02, 1350)],
    [K.learn, aimW([POST.x, SHB.y - .33, PZ], 1.0, Math.PI + .02, .02, 1350)],
    [K.C1 - .42, aimW(MGBC, 1400 * (.5 * 1000 / 1920) / 1920 * .88, Math.PI, 0, 1400)],
    [K.C1, aimW(MGBC, 1400 * (.5 * 1000 / 1920) / 1920, Math.PI, 0, 1400)],
  ]);

  // ================================================================ your table (08.20–21): the note, the envelope with your compass
  const SH = { x: .05, z: .02, w: .56, aspect: 16 / 9, rot: 0, res: .6 };
  const NOTE = { x: .2, z: -.24, w: .2, aspect: 16 / 9, rot: -.08, res: 1.0 };
  const EV = { c: [-.06, DESK.top, -.32], w: .2, h: .125, rot: .1 };
  const slide = (t) => sio(u01(t, K.reviewed + .35, K.reviewed + .85));
  const noteAt = (t) => { const s = slide(t); return { ...NOTE, x: NOTE.x + (EV.c[0] - NOTE.x) * s, z: NOTE.z + (EV.c[2] + .05 - NOTE.z) * s, rot: NOTE.rot + (EV.rot - NOTE.rot) * s, w: NOTE.w * (1 - .1 * s) }; };
  const writeU = (t) => u01(t, K.so + .5, K.when + .9);
  let notePen = null;
  const noteCorners = (s) => { const w = s.w, h = w / s.aspect, r = s.rot, u = [Math.cos(r), 0, -Math.sin(r)], v = [-Math.sin(r), 0, -Math.cos(r)], y = DESK.top + .0015; const P = (a, b) => [s.x + u[0] * a + v[0] * b, y, s.z + u[2] * a + v[2] * b]; return [P(-w / 2, -h / 2), P(w / 2, -h / 2), P(w / 2, h / 2), P(-w / 2, h / 2)]; };
  const sheetRoseOpts = (t) => ({ x: 960, y: 540, R: 250, seed: 3, ring: 1, cross: 1, points: 1, letters: 1, icons: 1, lit: [.7, .7, .7, .7], t });
  const envOpts = (t) => ({ x: 960, y: 1200 * .55, R: 330, seed: 9, ring: 1, cross: 1, points: [1, 1, 1, 1], letters: 0, icons: 0, words: [1, 1, 1, 1], needle: -Math.PI / 2 + .03 * Math.sin(t * .8), needleU: 1, t });
  function tableFrame(ctx, t, C) {
    notePen = null;
    const n = noteAt(t), Qn = noteCorners(n);
    const ec = envCorners(EV.c, EV.w, EV.h, EV.rot, 1);
    const items = [
      { ...SH, draw: (g, tt) => inkRose(g, tt, sheetRoseOpts(tt)) },
      { x: n.x, z: n.z, corners: Qn, aspect: NOTE.aspect, res: NOTE.res, draw: (g, tt, W, H) => { notePen = noteText(g, tt, W, H, writeU(tt)); } },
      { x: EV.c[0], z: EV.c[2], corners: ec.corners, aspect: 1.6, res: .7, draw: (g, tt, W, H) => { envBack(g, tt, W, H); inkRose(g, tt, envOpts(tt)); } },
    ];
    const r = room(ctx, t, C, { items, person: null, outside: 1, outsideDraw: (cx, tt) => drawSky(cx, tt, C, {}) });
    // the pen hand writing the note
    if (t < K.reviewed + .4) {
      const wu = writeU(t), np = notePen;
      let P = null;
      if (np && wu > 0 && wu < 1) { const u = np[0] / 1920, v = np[1] / 1080; P = [0, 1, 2].map((i) => (1 - v) * ((1 - u) * Qn[0][i] + u * Qn[1][i]) + v * ((1 - u) * Qn[3][i] + u * Qn[2][i])); }
      else { const u = wu <= 0 ? .2 : .9, v = .7; P = [0, 1, 2].map((i) => (1 - v) * ((1 - u) * Qn[0][i] + u * Qn[1][i]) + v * ((1 - u) * Qn[3][i] + u * Qn[2][i]) + (i === 1 ? .02 : 0)); }
      const sp = C.P(...P); if (sp) { const s = sp[2] * .17 / 150, lift = wu <= 0 || wu >= 1 ? .6 : 0, on = u01(t, K.C1 + .15, K.C1 + .5) * (1 - u01(t, K.reviewed, K.reviewed + .4)); if (on > 0 && s > .15 && s < 8) penHand(ctx, t, sp[0] + 400 * s * (1 - on), sp[1] + 300 * s * (1 - on), s, { lift, ang: -.95, skin: '#c99a74', sleeve: '#2a2236' }); }
    }
    vign(ctx, .35 * (1 - u01(t, K.out - .9, K.out - .3)));
    return r;
  }
  const aim = (q, d, p, F, dx = 0, yaw = 0) => ({ x: q[0] + dx - d * Math.sin(yaw) * Math.cos(p), y: q[1] + d * Math.sin(p), z: q[2] - d * Math.cos(yaw) * Math.cos(p), yaw, pitch: p, F });
  const NC = [NOTE.x, DESK.top, NOTE.z], NH = 1400 * NOTE.w / 1920;
  const camT = keys([
    [K.C1, { x: NOTE.x, y: DESK.top + .0015 + NH, z: NOTE.z, yaw: NOTE.rot, pitch: Math.PI / 2, F: 1400 }],
    [K.C1 + .6, { ...aim(NC, .3, 1.4, 1350), yaw: NOTE.rot * .5 }],
    [K.when - .4, aim([NOTE.x - .02, DESK.top, NOTE.z + .01], .38, 1.25, 1350)],
    [K.reviewed + .3, aim([NOTE.x - .03, DESK.top, NOTE.z], .34, 1.3, 1400)],
    [K.reviewed + .85, aim([EV.c[0] + .05, DESK.top, EV.c[2] + .06], .5, 1.05, 1300)],
    [K.out - .45, { x: 0, y: 1.42, z: .25, yaw: .16, pitch: -.05, F: 1200 }],
    [K.out, { x: 0, y: 1.5, z: DESK.wallZ + .4, yaw: HO.o.yaw, pitch: HO.o.pitch, F: HO.o.F }],
  ]);

  // ================================================================ the frame
  prepareSky();
  await ready();
  const frame = (ctx, t) => {
    if (t < K.A1) {
      const C = camA(t), o = seaWorld(ctx, t, C, { trails: u01(t, K.north - .2, K.fixed + .3) });
      if (o.fire) growPlate(ctx, t, 'light', HI.o, o.fire[0], o.fire[1], 1 - eoX(u01(t, K.in, K.in + .55)));
      vign(ctx, .4);
      return;
    }
    if (t < K.B1) {
      const C = camH(t);
      hallWorld(ctx, t, C);
      const pt = C.P(...PTW(t)); if (pt) growPlate(ctx, t, 'light', HI.o, pt[0], pt[1], eiX(u01(t, K.B1 - .5, K.B1 - .04)));
      return;
    }
    if (t < K.C1) {
      const C = camC(t), o = seaWorld(ctx, t, C, {});
      if (o.beacon) growPlate(ctx, t, 'light', HI.o, o.beacon[0], o.beacon[1], 1 - eoX(u01(t, K.B1, K.B1 + .55)));
      const lp = C.P(LOCK.x, 9, vesselZ(t));
      if (lp) label(ctx, t, lp[0], lp[1], u01(t, K.britain + .3, K.britain + .9) * (1 - u01(t, K.release - .2, K.release + .1)), 'BRITAIN · PUBLIC TESTING INSTITUTE', 'SINCE 2023', { len: 130, dx: 80, side: 'left' });
      const gp = C.P(lagX + 60, 8, LAG.z);
      if (gp) label(ctx, t, gp[0], gp[1], u01(t, K.sandbox - .6, K.sandbox) * (1 - u01(t, K.supervised + .3, K.supervised + .6)), 'EUROPEAN UNION · REGULATORY SANDBOXES', '', { len: 140, dx: 80, side: 'left' });
      vign(ctx, .4 * (1 - u01(t, K.C1 - .5, K.C1 - .2)));
      paperPatch(ctx, t, C, [MGBW[0], MGBW[1], MGBW[2], MGBW[3]], u01(t, K.C1 - .4, K.C1 - .08));
      return;
    }
    const C = camT(t);
    if (C.z < DESK.wallZ) {
      tableFrame(ctx, t, C);
      paperPatch(ctx, t, C, noteCorners(NOTE), 1 - u01(t, K.C1 + .1, K.C1 + .5));
    } else drawSky(ctx, t, C, {});
  };
  const PR = { riso: .35 };
  return [
    { t: K.in, tr: 'cut', d: .1, draw: frame, print: HI.print },
    { t: K.in + .3, tr: 'cut', d: .1, draw: frame, print: PR },
    { t: K.out - .1, tr: 'cut', d: .1, draw: frame, print: HO.print },
  ];
}
