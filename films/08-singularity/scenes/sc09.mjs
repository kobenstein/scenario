// Film 8 · c09 · Our compass: South and the needle (VO 05c, C6, 05d, 05e). Owner B3.
// Binding shot list: /mnt/project-files/scenario/film-singularitaet/m1/bild/shots.md §8 c09. Every move is a carrier, no dissolves:
//
//  act | shots          | world                                         | in → out
//  ----+----------------+-----------------------------------------------+-------------------------------------------------------------
//  A1  | c09.01–.03     | the sea, the rose, the south front, the raft  | out of the deep sky (c08>c09) → push into the raft lantern
//  M   | c09.04         | the ministry steps, men with reports          | the lantern light shrinks into the open door → turn up into the sky
//  TW  | c09.05         | Taiwan from above, 447 pings                  | the same sky, tilt down → push into one ping (cool light)
//  RM  | c09.06         | a stranger's lamp-lit room, the laptop        | out of the lit screen → back into it (the call opens)
//  GR  | c09.06–.10     | the call grid, groups, the fake ad, the card  | the screen IS the grid → frame carrier into C6 and back → push into the card
//  BL  | c09.11–.12     | the bill page on a raft deck, the rope        | the card paper IS the page → pull back to the rope, it splices
//  A2  | c09.13–.14     | the rose: lights stream back, hands on the rim| crane up out of the raft → tilt up into the sky
//  BY  | c09.15         | Ostrom's moonlit bay                          | the same sky, tilt down → push into the farmhouse window light
//  TB  | c09.16         | your table, the invitation, YES               | the window light shrinks into your lamp → through the open casement into the sky
//  A3  | c09.17–.25     | the needle, panic, calm, Solnit, the squall,  | the same sky, tilt down → the folded headline sheet's crease = the c09>c10 line plate
//      |                | the caught sheet                              |
import { clamp } from '../engine.mjs';
import { ready, track, trackLog, camera, eoX, eiX, sio, qio, u01, pulse, settle, hash, TAU, mixHex, projPoly, fillPoly } from '../lib/s8_kit.mjs';
import { drawSky, prepareSky } from '../lib/s8_sky.mjs';
import { drawSea } from '../lib/s8_sea.mjs';
import { boat, frameOf } from '../lib/s8_boats.mjs';
import { seaRose, drawFleet, scatterLayout, needleLayout, moveLayout } from '../lib/s8_fleet.mjs';
import { stormTone, front, fogBank, bigShip, lightFlight, flashAt } from '../lib/s8_storms.mjs';
import { clip, label } from '../lib/s8_card.mjs';
import { room, sheet, sheetCorners, penHand, DESK } from '../lib/s8_desk.mjs';
import { hand, plate, lineGround, lineStroke, paperLamp } from '../lib/handoff4.mjs';
import { hand as handDraw } from '../lib/hand.mjs';
import { figure, reachArm, handPos } from '../lib/figure.mjs';
import { towLine, crew } from '../lib/s8_c10_world.mjs';
import { drawGrid, tileLayout, HERO, FRAG } from '../lib/s8_c09_tiles.mjs';
import { ministry, taiwan, PINGS, laptopRoom, SCREEN, moon, bay, SH } from '../lib/s8_c09_places.mjs';
import { rope, lantern, iris, coolFill, coolIris, searchShip, headlines, headlineTex } from '../lib/s8_c09_sea.mjs';

const PI = Math.PI;
// a camera from rows [t, x, y, z, yaw, pitch, F] (PCHIP per column, F in log space)
function camTrack(rows) {
  const f = [1, 2, 3, 4, 5].map((c) => track(rows.map((r) => [r[0], r[c]]))), fF = trackLog(rows.map((r) => [r[0], r[6]]));
  return (t) => camera({ x: f[0](t), y: f[1](t), z: f[2](t), yaw: f[3](t), pitch: f[4](t), F: fF(t) });
}
const aim = (p, q) => { const dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2]; return [Math.atan2(dx, dz), Math.atan2(-dy, Math.hypot(dx, dz))]; };
const row = (t, p, q, F = 1400, wrap = 0) => { const [y, pi] = aim(p, q); return [t, ...p, y + wrap * TAU, pi, F]; };
const lerp3 = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];

export default async function (T, R) {
  const A = (seg) => (p, n) => T.S(seg, p, n), c = A('05c'), d = A('05d'), e = A('05e');
  const HI = hand('c08>c09', T), HO = hand('c09>c10', T), C6 = T.clip('C6');
  const K = { in: HI.b, out: HO.a, c6a: C6.start, c6b: C6.end };

  // ================================================================ shared sea world: the rose, the south, the raft
  const ROSE = { x: 0, z: 0, R: 40 };
  const RZ = -64;
  const RAFT_B = []; for (let r = 0; r < 2; r++) for (let i = 0; i < 5; i++) RAFT_B.push({ x: -4.6 + i * 2.3 + r * 1.1, z: RZ - r * 6.2, head: (hash(i + r * 5) - .5) * .06, sc: 1, seed: hash(i * 3 + r) });
  const SCAT = scatterLayout(10, 0, RZ + 4, 16, 91).map((b, i) => ({ ...b, z: b.z - 6 * hash(i) }));
  const RA = { x: 7.0, z: RZ, head: 0, roll: 0 }, RB = { x: 10.3, z: RZ + .3, head: -.04, roll: 0 };
  const ropeEnds = (t) => [frameOf(RA, t)(.9, .62, .5), frameOf(RB, t)(-.9, .62, .4)];
  const LAN = (t) => frameOf(RA, t)(.75, 2.05, 1.25);   // the lantern hanging out over the gap
  const lanPole = (ctx, t, C) => { const a = C.P(...frameOf(RA, t)(.55, .62, 1.25)), b = C.P(...frameOf(RA, t)(.62, 2.3, 1.25)), q = C.P(...frameOf(RA, t)(.75, 2.3, 1.25)); if (!a || !b || !q) return; ctx.strokeStyle = '#120a06'; ctx.lineWidth = Math.max(1.5, a[2] * .05); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); };
  const bench = (ctx, t, C) => { const F = frameOf(RA, t), P = projPoly(C, [F(-.86, .5, -.86), F(.86, .5, -.86), F(.86, .5, -.34), F(-.86, .5, -.34)]); if (fillPoly(ctx, P, '#1e130b')) { const lp = C.P(...LAN(t)); if (lp) { ctx.save(); fillPoly(ctx, P); ctx.clip(); const g = ctx.createRadialGradient(lp[0], lp[1], 0, lp[0], lp[1], Math.max(400, lp[2] * 2.2)); g.addColorStop(0, 'rgba(200,130,70,.55)'); g.addColorStop(1, 'rgba(10,6,4,.4)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); for (let k = 1; k < 4; k++) { const a = C.P(...F(-.86, .501, -.86 + k * .13)), b = C.P(...F(.86, .501, -.86 + k * .13)); if (a && b) { ctx.strokeStyle = 'rgba(8,4,2,.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } } ctx.restore(); } ctx.strokeStyle = 'rgba(255,190,120,.35)'; ctx.lineWidth = 1.2; ctx.stroke(); } };
  const SHIPS = [{ x: -78, z: -12, head: .4, L: 46 }, { x: 80, z: 6, head: -.5, L: 46 }, { x: -6, z: 86, head: 1.6, L: 46 }];
  const RING = Array.from({ length: 28 }, (_, i) => { const th = i / 28 * TAU + .1; return [Math.sin(th) * 53, .8, Math.cos(th) * 53]; });

  // ================================================================ A1: out of the sky, the south front, the raft, the frayed rope
  const lanA1 = (t) => LAN(t);
  const camA1 = camTrack([
    [K.in, 4, 30, -14, .3, -.58, 1100],
    [c('storms') - .2, 4, 29, -15, 1.9, -.12, 1200],
    [c('power') + .2, 3, 15, -18, 3.08, .13, 1350],
    [c('They') - .1, 2, 13, -21, 3.13, .16, 1400],
    row(c('each'), [8, 8, -42], [1.5, .5, RZ - 4], 1400, 1),
    row(c('How') - .15, [9.6, 2.4, RZ - 5.2], [8.6, .7, RZ + .4], 1400, 1),
    row(c('rebuild') + .45, [9.2, 1.75, RZ - 2.2], [8.6, .62, RZ + .45], 1400, 1),
  ]);
  K.a1push = c('rebuild') + .55; K.a1iris = c("You'd") - .5; K.a1end = c("You'd") - .12;
  function camA1x(t) {
    if (t <= K.a1push) return camA1(t);
    const C0 = camA1(K.a1push), L = lanA1(t), p0 = [C0.x, C0.y, C0.z], u = trackLog([[K.a1push, 1], [K.a1end, .08]])(t), p = lerp3(L, p0, u);
    const [y0, pi0] = [C0.yaw, C0.pitch], [y1, pi1] = aim(p, L), w = sio(u01(t, K.a1push, K.a1push + .5)), yy = y1 + Math.round((y0 - y1) / TAU) * TAU;
    return camera({ x: p[0], y: p[1], z: p[2], yaw: y0 + (yy - y0) * w, pitch: pi0 + (pi1 - pi0) * w, F: 1400 });
  }
  function raftBoats(t) { const u = u01(t, c('They') - .1, c('each') + .3); return moveLayout(SCAT, RAFT_B, u, { stagger: .35 }); }
  function seaBase(ctx, t, C, o = {}) {
    drawSky(ctx, t, C, o.sky || {});
    drawSea(ctx, t, C, { glints: o.glints || [] });
  }
  function drawA1(ctx, t) {
    const C = camA1x(t);
    seaBase(ctx, t, C);
    const fr = u01(t, c('storms') - .4, c('power') + .9), fl = Math.max(flashAt(t, [c('power') + .05, c('trust') + .05]), 0);
    stormTone(ctx, C, .55 * fr, { kind: 'storm' });
    front(ctx, t, C, { az: PI - .3, w: .22, h: .1, kind: 'trust', a: u01(t, c('power'), c('trust') + .8), seed: 7 });
    front(ctx, t, C, { az: PI + .12, w: .5, h: .2, kind: 'power', a: fr, glow: .5, flash: fl, bolt: fl ? 3 : 0, seed: 4 });
    seaRose(ctx, t, C, { ...ROSE, a: 1, points: [1, 1, 1, 1], icons: 1 });
    const bs = raftBoats(t), lan = u01(t, c('They'), c('each'));
    drawFleet(ctx, t, C, bs, { lantern: (b, i) => .5 + .5 * clamp(lan * 2 - i * .1), sail: 'none' });
    // lines thrown between neighbours once alongside, people step across and take hands
    const ln = u01(t, c('South') - .1, c('each') + .4);
    if (ln > 0) for (let i = 0; i < bs.length - 1; i++) { if (i % 5 === 4) continue; const a = frameOf(bs[i], t)(.9, .62, .6), b = frameOf(bs[i + 1], t)(-.9, .62, .6), v = clamp(ln * 2 - i * .12); if (v > 0) towLine(ctx, t, C, a, lerp3(a, b, eoX(v)), { sag: .15, a: .8 }); }
    const hk = u01(t, c('each') - .2, c('each') + .6);
    if (hk > 0) for (let i = 0; i < 5; i++) { const B = bs[i]; crew(ctx, t, C, B, [{ u: .45, w: -.4, pose: { sh: [.3 + 1.1 * hk, .2], el: [.3 - .2 * hk, .3], head: .05 } }, { u: -.45, w: .6, flip: true, pose: { sh: [.3 + 1.0 * hk, .2], el: [.3, .3] } }], { light: C.P(...frameOf(B, t)(-.5, 1.35, -2.4)), lightA: .6, rim: '#ffc890', seed: 50 + i }); }
    // the rope pair, the frayed rope, the lantern
    boat(ctx, t, C, { ...RA, sail: 'none', lantern: 0 }); boat(ctx, t, C, { ...RB, sail: 'none', lantern: .6 });
    lanPole(ctx, t, C);
    const [ra, rb] = ropeEnds(t), lp = C.P(...lanA1(t));
    rope(ctx, t, C, ra, rb, { fray: 1, splice: 0, sag: .14, lamp: lp });
    const L = lantern(ctx, t, C, ...lanA1(t), { s: .26 });
    if (t > K.a1iris) iris(ctx, t, L || [960, 540], 20 + 2300 * eiX(u01(t, K.a1iris, K.a1end)));
  }

  // ================================================================ M: the ministry (out of the door light, up into the sky)
  K.m0 = K.a1end; K.mUp = c('In') - .75; K.m1 = c('In') - .05;
  const SKM = { yaw: -.95, pitch: -.98 };
  const camM = camTrack([
    row(K.m0, [4.5, 3.2, -26], [0, 4.6, 0], 1400),
    row(c('consultants') - .3, [5.6, 3.5, -23.5], [-.4, 4.4, 0], 1400),
    row(K.mUp, [6.0, 3.6, -22.8], [-.6, 4.6, 0], 1400),
    [K.m1, 6.2, 3.8, -22.6, SKM.yaw, SKM.pitch, 1400],
  ]);
  function drawM(ctx, t) {
    const C = camM(t);
    drawSky(ctx, t, C, {}); drawSea(ctx, t, C, {});
    const r = ministry(ctx, t, C, { door: .55 + .45 * sio(u01(t, c('expect'), c('consultants'))), walk: K.m0 - 3.2 });
    if (t < K.m0 + .6) { const DP = r.door, cx = DP.length ? DP.reduce((s, p) => [s[0] + p[0] / DP.length, s[1] + p[1] / DP.length], [0, 0]) : [960, 540]; iris(ctx, t, cx, 2300 * (1 - eoX(u01(t, K.m0, K.m0 + .6)))); }
  }

  // ================================================================ TW: Taiwan from above, the pings (km world)
  K.tw0 = K.m1; K.tw1 = c('About') - .2;
  const TP = [121.52, 25.05], tpx = (TP[0] - 121) * 101, tpz = (TP[1] - 23.7) * 111;
  const HOT = PINGS.map((q, i) => [Math.hypot(q.x - tpx, q.z - tpz) + 60 * q.d, i]).sort((a, b) => a[0] - b[0])[0][1];
  const hotP = [PINGS[HOT].x, 0, PINGS[HOT].z];
  const camTW0 = camTrack([
    [K.tw0, -20, 340, -310, SKM.yaw, SKM.pitch, 1400],
    [c('Taiwan') - .1, -20, 340, -300, .05, .84, 1400],
    row(c('strangers') + .25, [-12, 300, -250], [10, 0, 40], 1400),
  ]);
  K.twPush = c('strangers') + .25; K.twIris = K.tw1 - .45;
  function camTW(t) {
    if (t <= K.twPush) return camTW0(t);
    const C0 = camTW0(K.twPush), p0 = [C0.x, C0.y, C0.z], u = trackLog([[K.twPush, 1], [K.tw1, .004]])(t), p = lerp3(hotP, p0, u), [y1, pi1] = aim(p, hotP), w = sio(u01(t, K.twPush, K.twPush + .6));
    return camera({ x: p[0], y: p[1], z: p[2], yaw: C0.yaw + (y1 - C0.yaw) * w, pitch: C0.pitch + (pi1 - C0.pitch) * w, F: 1400 });
  }
  function drawTW(ctx, t) {
    const C = camTW(t);
    drawSky(ctx, t, C, {}); drawSea(ctx, t, C, { calm: 1 });
    taiwan(ctx, t, C, { ping: u01(t, c('texted') - .1, c('strangers') + .3), hot: HOT });
    const hp = C.P(...hotP, .5);
    if (hp) label(ctx, t, hp[0] < 1500 ? Math.min(1500, hp[0] + 160) : hp[0], Math.max(260, hp[1] - 40), u01(t, c('Taiwan'), c('Taiwan') + .7) * (1 - u01(t, K.twPush + .2, K.twPush + .5)), 'TAIWAN · 2024', '', { len: 90 });
    if (t > K.twIris) coolIris(ctx, t, hp || [960, 540], 8 + 2300 * eiX(u01(t, K.twIris, K.tw1)));
  }

  // ================================================================ RM: the room with the laptop (out of the screen and back in)
  K.rm0 = K.tw1; K.rm1 = c('met') + .35;
  const SN = [0, Math.sin(SCREEN.tilt), -Math.cos(SCREEN.tilt)], SD = 1400 * SCREEN.w / 1920;
  const fill = [SCREEN.c[0] + SN[0] * SD, SCREEN.c[1] + SN[1] * SD, SCREEN.c[2] + SN[2] * SD];
  const camRM = camTrack([
    [K.rm0, ...fill, 0, SCREEN.tilt, 1400],
    row(c('About') + .9, [.42, 1.42, -1.05], [0, .95, .4], 1400),
    row(c('fifty') + .5, [.36, 1.38, -.95], [0, .97, .42], 1400),
    [K.rm1, ...fill, 0, SCREEN.tilt, 1400],
  ]);
  K.call = c('met') - .55;
  const screenRM = (g, t) => {
    coolFill(g, t, { local: true });
    const u = eoX(u01(t, K.call, K.call + .45));
    if (u > 0) { const w = 1920 * u, h = 1080 * u; drawGrid(g, t, { rect: [960 - w / 2, 540 - h / 2, w, h], cardDraw }); }
    else { g.save(); g.strokeStyle = 'rgba(40,80,130,.6)'; g.lineWidth = 6; for (let k = 0; k < 3; k++) { const ph = (t * .9 + k / 3) % 1; g.globalAlpha = 1 - ph; g.beginPath(); g.arc(960, 540, 60 + ph * 260, 0, TAU); g.stroke(); } g.restore(); }
  };
  function drawRM(ctx, t) {
    const C = camRM(t);
    ctx.fillStyle = '#07060c'; ctx.fillRect(0, 0, 1920, 1080);
    laptopRoom(ctx, t, C, { screen: screenRM });
    grpLabel(ctx, t);
  }
  const grpLabel = (ctx, t) => label(ctx, t, 330, 330, u01(t, c('fifty'), c('fifty') + .8) * (1 - u01(t, c('scam') - .4, c('scam') + .1)), 'ABOUT 450 PEOPLE · SMALL GROUPS · ONLINE', '', { len: 100 });

  // ================================================================ GR: the call grid (the screen IS the grid), C6, the summary card
  K.gr0 = K.rm1; K.grRows0 = d('Audrey'); K.grPush0 = d('tells') - .25; K.gr1 = d('Strangers') - .1;
  const CK = 1920 / 360, CY0 = (2507 - 1080) / 2;   // the card's local plate space (1920 × 2507) and the visible band at the end of the push
  const lineOn = (lineU, i) => clamp(lineU * 1.6 - i * .08) >= 1;
  function cardInk(g, t, o) {   // in card plate space
    g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
    FRAG.forEach((f, i) => {
      if (o.lineU != null && !lineOn(o.lineU, i)) return;
      const fl = o.flow ? o.flow(i) : 0, y0 = (50 + i * 52) * CK, y1 = 760 + 190 * i, y = y0 + (y1 - y0) * fl, x0 = 30 * CK + (210 - 30 * CK) * fl;
      const L = (300 * f.len * CK) * (1 - fl) + 1250 * f.len * fl, lw = 5 * CK * (1 - fl) + 9 * fl;
      g.strokeStyle = mixHex('#3a6a8a', '#c4651e', o.amber ?? 1); g.lineWidth = lw; g.beginPath(); g.moveTo(x0, y);
      for (let x = 0; x <= L; x += 8 * CK * (1 - fl) + 6) g.lineTo(x0 + x, y + 1.6 * CK * (1 - fl) * Math.sin((x / CK) * .3 + i)); g.stroke();
    });
    g.restore();
  }
  let GS = { lineU: 0, amber: 0 };
  function cardDraw(g, card) {
    g.save(); g.translate(card[0], card[1]); g.scale(1 / CK, 1 / CK);
    g.beginPath(); g.roundRect(0, 0, 1920, 2507, 10 * CK); g.clip();
    paperLamp(g, GS.t, { rect: [0, 0, 1920, 2507] });
    cardInk(g, GS.t, { lineU: GS.lineU, amber: GS.amber });
    g.restore();
  }
  // grid "camera": scale + the grid point at the frame centre
  const zS = trackLog([[K.gr0, 1], [c('scam') - .4, 1.12], [K.c6a - 1.1, 1.2], [K.c6a, 1.32], [K.c6b, 1.32], [K.c6b + 1.4, 1.08], [K.grPush0, 1.1], [K.gr1, CK]]);
  const tl = tileLayout({ group: 1 }), heroC = [tl[HERO].x + tl[HERO].w / 2, tl[HERO].y + tl[HERO].h / 2];
  const endC = [1500 + 960 / CK, 300 + (CY0 + 540) / CK];
  const zcx = track([[K.gr0, 960], [c('scam') - .4, 880], [K.c6a - 1.1, 1060], [K.c6a, heroC[0]], [K.c6b, heroC[0]], [K.c6b + 1.4, 980], [K.grPush0, 1000], [K.gr1, endC[0]]]);
  const zcy = track([[K.gr0, 540], [c('scam') - .4, 570], [K.c6a - 1.1, 520], [K.c6a, heroC[1]], [K.c6b, heroC[1]], [K.c6b + 1.4, 545], [K.grPush0, 540], [K.gr1, endC[1]]]);
  const zoomAt = (t) => { const s = zS(t), gx = zcx(t), gy = zcy(t); return [s, 960 - gx * s, 540 - gy * s]; };
  const gridState = (t) => ({ group: u01(t, c('small') - .1, c('groups') + .5), ad: u01(t, c('scam') - .5, c('scam') - .1), cross: u01(t, c('scam') + .05, c('ads.') + .2), line: u01(t, c('Artificial') - .1, c('discussions') + .25), card: u01(t, c('Artificial') + .1, c('intelligence') + .4), amber: u01(t, c('The ideas') - .05, c('theirs') - .2), threads: u01(t, c('ideas'), c('theirs') + .6) * (1 - u01(t, K.c6a - .4, K.c6a)), rows: t > K.c6b ? u01(t, K.grRows0, K.grRows0 + 2.6) : null });
  function drawGR(ctx, t) {
    const st = gridState(t); GS = { t, lineU: st.line, amber: st.amber };
    const [s, ox, oy] = zoomAt(t), full = t > K.c6a + .36 && t < K.c6b - .36;
    if (!full) { ctx.fillStyle = '#070a14'; ctx.fillRect(0, 0, 1920, 1080); drawGrid(ctx, t, { rect: [ox, oy, 1920 * s, 1080 * s], ...st, cardDraw, hide: t > K.c6a && t < K.c6b ? HERO : undefined }); }
    const hr = [ox + tl[HERO].x * s, oy + tl[HERO].y * s, tl[HERO].w * s, tl[HERO].h * s];
    if (t >= K.c6a - .01 && t <= K.c6b + .01) clip(ctx, t, T, 'C6', { carrier: 'frame', from: hr, to: hr, info: { name: 'Audrey Tang', role: "Taiwan's digital minister, 2022–2024" } });
    if (t < K.c6a) grpLabel(ctx, t);
  }

  // ================================================================ BL: the bill page on the raft deck, the rope splices
  K.bl0 = K.gr1; K.blRope = d("That's", 1) - .3; K.bl1 = d('power') - .45;
  const BS0 = { x: 0, z: -.6 }, ASP = 1920 / 2507, BW = .3;
  const benchW = (t) => frameOf(RA, t)(BS0.x, .505, BS0.z);
  const p0 = benchW(K.bl0), BILL0 = { x: p0[0], y: p0[1], z: p0[2], w: BW, aspect: ASP, rot: 0 };
  const billCorners = (t) => { const st = sheetCorners(BILL0), F = frameOf(RA, t), h = BW / ASP, mv = [F(-BW / 2, .505, -.6 + h / 2), F(BW / 2, .505, -.6 + h / 2), F(BW / 2, .505, -.6 - h / 2), F(-BW / 2, .505, -.6 - h / 2)], u = sio(u01(t, K.bl0 + .3, K.bl0 + 1.4)); return st.map((p, i) => lerp3(p, mv[i], u)); };
  const PCd = 1400 * BW / 1920;
  const camBL = camTrack([
    [K.bl0, BILL0.x, BILL0.y + PCd, BILL0.z, 0, PI / 2, 1400],
    [K.bl0 + .5, BILL0.x, BILL0.y + PCd * 1.25, BILL0.z, 0, PI / 2 - .02, 1400],
    [d('rules') + .1, BILL0.x - .18, BILL0.y + .62, BILL0.z - .42, .12, 1.0, 1400],
    row(K.blRope, [6.2, 1.75, RZ - 3.0], [8.4, .62, RZ + .3], 1400),
    row(d('grows') + .3, [7.4, 1.35, RZ - 2.1], [8.6, .62, RZ + .45], 1400),
    row(K.bl1, [7.6, 1.6, RZ - 2.6], [8.6, .8, RZ + .5], 1400),
  ]);
  const flow = (t) => (i) => sio(u01(t, d('Strangers') + .05 + i * .07, d('shaping') + .35 + i * .07));
  function billInk(g, t, W, H) {
    // printed: the act's title block (heavy bars), clause rows printing in from the left
    const pr = u01(t, d('Strangers') + .1, d('rules') + .2);
    g.save(); g.fillStyle = 'rgba(28,20,14,.88)';
    const reveal = (y, x0, w, h, k) => { const v = clamp(pr * 1.4 - k * .03); if (v > 0) g.fillRect(x0, y, w * v, h); };
    reveal(150, 210, 1500, 46, 0); reveal(230, 210, 1180, 46, 1); reveal(330, 210, 520, 20, 2);
    g.fillStyle = 'rgba(40,30,22,.6)';
    for (let i = 0; i < 8; i++) for (let r = 0; r < 3; r++) reveal(690 + 190 * i - 46 * (2 - r) - 20, 210, (r === 2 ? .55 + .3 * hash(i) : .92) * 1500, 14, 3 + i * 3 + r);
    g.restore();
    cardInk(g, t, { amber: 1, flow: flow(t) });
  }
  function drawBL(ctx, t) {
    const C = camBL(t);
    seaBase(ctx, t, C, {});
    stormTone(ctx, C, .35 * (1 - u01(t, d('grows'), d('back') + .8)), { kind: 'storm' });
    seaRose(ctx, t, C, { ...ROSE, a: 1, points: [1, 1, 1, 1], icons: 1 });
    drawFleet(ctx, t, C, RAFT_B, { lantern: 1, sail: 'none' });
    boat(ctx, t, C, { ...RA, sail: 'none', lantern: 0 }); boat(ctx, t, C, { ...RB, sail: 'none', lantern: .6 });
    bench(ctx, t, C); lanPole(ctx, t, C);
    const [ra, rb] = ropeEnds(t), lp = C.P(...LAN(t));
    rope(ctx, t, C, ra, rb, { fray: 1, splice: sio(u01(t, d('trust') - .1, d('back') + .2)), sag: .14, lamp: lp });
    const S = sheet(ctx, t, C, { ...BILL0, corners: billCorners(t), draw: billInk });
    lantern(ctx, t, C, ...LAN(t), { s: .26 });
    const k0 = S.corners && S.corners[0];
    if (k0) label(ctx, t, clamp(k0[0], 120, 1300), clamp(k0[1], 330, 760), u01(t, d('Strangers') + .3, d('shaping') + .4) * (1 - u01(t, d("That's", 1) - .5, d("That's", 1) - .1)), 'FRAUD CRIME HAZARD PREVENTION ACT', 'JULY 2024', { len: 110 });
  }

  // ================================================================ A2: the lights stream back, many hands on the rim, up into the sky
  K.a20 = K.bl1; K.a2Up = d('Elinor') - .55; K.a21 = d('Elinor') - .02;
  const SKO = { yaw: .55, pitch: -.95 };
  const camA2 = camTrack([
    row(K.a20, [7.6, 1.6, RZ - 2.6], [8.6, .8, RZ + .5], 1400),
    row(d('spreads') + .35, [24, 62, -132], [0, 0, -4], 1250),
    row(d('when') + .05, [20, 52, -122], [0, 0, 0], 1250),
    row(d('hands') - .1, [50.5, 1.9, -15.5], [43.5, .3, 6], 1400),
    row(K.a2Up, [50.2, 2.0, -14.8], [43.2, .5, 7], 1400),
    [K.a21, 31.8, 2.6, -39, SKO.yaw, SKO.pitch, 1400],
  ]);
  const flights = SHIPS.flatMap((S, si) => Array.from({ length: 9 }, (_, k) => ({ si, to: RING[(si * 9 + k * 3) % RING.length], d: (si * 9 + k) / 27 })));
  function drawA2(ctx, t) {
    const C = camA2(t);
    seaBase(ctx, t, C, {});
    const sp = u01(t, d('power') - .1, d('when') + .2), rimU = u01(t, d('when') - .2, d('many') + .2), hands = u01(t, d('many'), d('hands') + .3);
    seaRose(ctx, t, C, { ...ROSE, a: 1, points: [1, 1, 1, 1], icons: 1, rim: rimU, rimHands: hands });
    drawFleet(ctx, t, C, RAFT_B, { lantern: 1, sail: 'none' });
    const ringB = RING.map(([x, , z], i) => ({ x, z, head: Math.atan2(x, z) + PI / 2, sc: .9, seed: hash(i) }));
    drawFleet(ctx, t, C, ringB, { lantern: (b, i) => .25 + .75 * clamp((sp - flights.filter((f) => RING.indexOf(f.to) === i).map((f) => f.d * .6)[0] ?? 0) / .4 || 0), sail: 'none' });
    for (const S of SHIPS) { const h = bigShip(ctx, t, C, { ...S, glow: 1 - sp }); S._hold = h.hold; }
    for (const f of flights) { const S = SHIPS[f.si]; if (S._hold) lightFlight(ctx, t, C, S._hold, f.to, clamp((sp - f.d * .6) / .4)); }
    // the foreground hands on the rope rim (many hands on the compass): carried in from below, they close round it
    if (hands > 0 && t > d('when')) {
      const RR = ROSE.R * 1.18, cand = [];
      for (let k = 0; k < 360; k++) { const th = k / 360 * TAU, p = C.P(Math.sin(th) * RR, .12, Math.cos(th) * RR); if (p && p[0] > 160 && p[0] < 1760 && p[1] > 600 && p[1] < 890) cand.push(p); }
      cand.sort((a, b) => a[0] - b[0]);
      const pick = []; for (const p of cand) if (!pick.length || p[0] - pick[pick.length - 1][0] > 170) pick.push(p);
      pick.slice(0, 6).forEach((p, i) => { const v = sio(clamp(hands * 1.6 - i * .12)); if (v <= 0) return; const s = clamp(p[2] / 110, .7, 2.0), y = p[1] + 105 * s + (1 - v) * 600; handDraw(ctx, p[0], y, s, { pose: 'grip', ang: -PI / 2 + (i % 2 ? -.35 : .3), flip: i % 2 === 1, skin: ['#7a4f33', '#c99a74', '#a8734f', '#5a3a26', '#e9c2a0', '#8d5f40'][i % 6], sleeve: ['#2a3450', '#3a2a1e', '#1e3a3a', '#40303a', '#26304a', '#3a2418'][i % 6], sleeveLen: 380, rim: '#ffc890', light: [0, -1], t, seed: i, close: v }); });
    }
  }

  // ================================================================ BY: Ostrom's bay (moon, terraces, the lanes)
  K.by0 = K.a21; K.byPush = d('planner') - .1; K.by1 = d('If') - .05;
  const LANES = Array.from({ length: 6 }, (_, i) => ({ x: -30 + i * 12, ph: hash(i * 5.3) }));
  const camBY0 = camTrack([
    [K.by0, -10, 34, -40, SKO.yaw, SKO.pitch, 1400],
    row(d('Ostrom') + .6, [-12, 30, -46], [6, 12, 70], 1400),
    row(d('fishers') + .2, [-8, 22, -36], [0, 8, 60], 1400),
    row(d('farmers') + .9, [4, 26, -20], [14, 22, 90], 1400),
    row(K.byPush, [10, 24, 30], [22, 22, 84.9], 1400),
  ]);
  let winW = null;
  function camBY(t) {
    if (t <= K.byPush || !winW) return camBY0(t);
    const C0 = camBY0(K.byPush), p0 = [C0.x, C0.y, C0.z], tgt = [winW[0], winW[1], winW[2] - .6], u = trackLog([[K.byPush, 1], [K.by1, .012]])(t), p = lerp3(tgt, p0, u);
    const w = sio(u01(t, K.byPush, K.byPush + .6)), yaw = C0.yaw * (1 - w), pitch = C0.pitch + (0 - C0.pitch) * w;
    return camera({ x: p[0], y: p[1], z: p[2], yaw, pitch, F: 1400 });
  }
  function drawBY(ctx, t) {
    if (!winW) { const C0 = camBY0(K.by0); const r = bay(ctx, t, C0, {}); winW = r.win; ctx.clearRect(0, 0, 1920, 1080); }
    const C = camBY(t);
    drawSky(ctx, t, C, {}); moon(ctx, t, C, .5, .2, 1); drawSea(ctx, t, C, { glints: [] });
    bay(ctx, t, C, { chan: u01(t, d('farmers') - .3, d('wisely') + .2), lanes: u01(t, d('fishers') - .6, d('fishers') + .5), win: 1 });
    // one boat per lane, taking turns: each glides down its lane and back out, staggered (no boat leads)
    const bs = LANES.map((L, i) => { const ph = ((t - K.by0) / 9 + L.ph) % 1, z = SH.z0 - 10 - 52 * Math.sin(PI * ph); return { x: L.x + 1.5 * Math.sin(t * .3 + i), z, head: ph < .5 ? PI : 0, sc: .9, seed: L.ph }; });
    drawFleet(ctx, t, C, bs, { lantern: 1, sail: 'none' });
    const wp = C.P(...winW);
    if (wp) label(ctx, t, 1400, 330, u01(t, d('Elinor') + .2, d('Nobel') + .3) * (1 - u01(t, d('without') - .3, d('without') + .1)), 'ELINOR OSTROM', 'NOBEL PRIZE IN ECONOMICS 2009', { side: 'left', len: 100 });
  }

  // ================================================================ TB: your table, the invitation, YES (out of your lamp, out of the window)
  K.tb0 = K.by1; K.tbUp = d('yes') + .35; K.tb1 = e('And') - .4;
  const INV = { x: .04, z: .02, w: .3, aspect: 1.414, rot: .05 };
  const invPos = (t) => { const u = eoX(u01(t, d('ever') - .1, d('invited') + .45)); return { ...INV, z: INV.z + .5 * (1 - u), x: INV.x + .06 * (1 - u), rot: INV.rot + .3 * (1 - u) }; };
  const TICK = [1180, 1010];
  const invPlate = (s, px, py) => { const K4 = sheetCorners(s), u = px / 1920, v = py / (1920 / s.aspect); return K4[0].map((_, i) => (1 - v) * ((1 - u) * K4[0][i] + u * K4[1][i]) + v * ((1 - u) * K4[3][i] + u * K4[2][i])); };
  function invDraw(g, t, W, H) {
    g.save(); g.textAlign = 'center'; g.fillStyle = '#2a1c12';
    g.font = '600 46px Inter'; g.letterSpacing = '14px'; g.fillText("CITIZENS' ASSEMBLY", W / 2, 330);
    g.fillStyle = '#7a2a12'; g.fillRect(W / 2 - 180, 380, 360, 3);
    g.fillStyle = '#2a1c12'; g.font = '400 92px "Instrument Serif"'; g.letterSpacing = '0px'; g.fillText('You are invited', W / 2, 540);
    g.fillStyle = 'rgba(42,28,18,.45)'; for (let i = 0; i < 4; i++) g.fillRect(W / 2 - 520 + (i % 2) * 40, 640 + i * 52, 1040 - (i % 2) * 80 - (i === 3 ? 300 : 0), 12);
    g.strokeStyle = '#2a1c12'; g.lineWidth = 5; g.font = '600 40px Inter'; g.letterSpacing = '8px'; g.fillStyle = '#2a1c12';
    g.strokeRect(TICK[0] - 380 - 40, TICK[1] - 40, 80, 80); g.fillText('NO', TICK[0] - 380 + 110, TICK[1] + 15);
    g.strokeRect(TICK[0] - 40 - 240, TICK[1] - 40, 80, 80); g.textAlign = 'left'; g.fillText('YES', TICK[0] - 270 + 70, TICK[1] + 15);
    // the tick (YOUR ink), drawn by the pen
    const u = u01(t, d('say') + .05, d('yes') + .25);
    if (u > 0) { const a = [TICK[0] - 270 - 22, TICK[1]], b = [TICK[0] - 270 - 4, TICK[1] + 26], c2 = [TICK[0] - 270 + 40, TICK[1] - 44]; g.strokeStyle = '#1a2a6a'; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(...a); const v1 = clamp(u / .35); g.lineTo(a[0] + (b[0] - a[0]) * v1, a[1] + (b[1] - a[1]) * v1); if (u > .35) { const v2 = clamp((u - .35) / .65); g.lineTo(b[0] + (c2[0] - b[0]) * v2, b[1] + (c2[1] - b[1]) * v2); } g.stroke(); }
    g.restore();
  }
  const tickPen = (t) => { const u = u01(t, d('say') + .05, d('yes') + .25), a = [TICK[0] - 292, TICK[1]], b = [TICK[0] - 274, TICK[1] + 26], c2 = [TICK[0] - 230, TICK[1] - 44]; return u < .35 ? lerp3([...a, 0], [...b, 0], u / .35) : lerp3([...b, 0], [...c2, 0], (u - .35) / .65); };
  const camTB = camTrack([
    [K.tb0, .05, 1.3, -.55, -.25, .7, 1400],
    [d('citizens') + .2, .04, 1.18, -.38, 0, 1.0, 1400],
    [K.tbUp, .06, 1.12, -.3, .02, 1.05, 1400],
    [K.tbUp + .7, .02, 1.42, .2, 0, .1, 1400],
    [K.tb1, 0, 1.5, .565, SKO.yaw * 0, SKO.pitch, 1400],
  ]);
  const SKT = { yaw: 0, pitch: SKO.pitch };
  function drawTB(ctx, t) {
    const C = camTB(t), s = invPos(t);
    ctx.fillStyle = '#05040a'; ctx.fillRect(0, 0, 1920, 1080);
    const r = room(ctx, t, C, { items: [{ ...s, draw: invDraw }], person: null, open: true, outside: 1 });
    // your hand with the pen comes in for the tick, then leaves
    const hu = sio(u01(t, d('assembly') - .2, d('say') - .05)) * (1 - sio(u01(t, d('yes') + .3, K.tbUp + .2)));
    if (hu > 0) { const tp = tickPen(t), w = invPlate(s, tp[0], tp[1]), p = C.P(w[0], w[1] + .002, w[2]); if (p) penHand(ctx, t, p[0] + (1 - hu) * 700, p[1] + (1 - hu) * 500, 1.6, { lift: u01(t, d('yes') + .25, d('yes') + .4) }); }
    if (t < K.tb0 + .6 && r && r.lamp) iris(ctx, t, r.lamp, 2300 * (1 - eoX(u01(t, K.tb0, K.tb0 + .6))));
  }

  // ================================================================ A3: the needle, calm and panic, Solnit, the squall, the caught sheet
  K.a30 = K.tb1;
  const N0 = needleLayout(24, 0, 0, 0, 40, 33), SC = scatterLayout(24, 0, 14, 30, 34), CL = scatterLayout(24, 46, 22, 11, 35), N1 = needleLayout(24, 0, 0, .35, 40, 36);
  const SPR = Array.from({ length: 24 }, (_, i) => ({ x: -70 + 150 * hash(i * 2.1) + 40, z: 70 + 120 * hash(i * 3.7), head: .35 + (hash(i) - .5) * .2, sc: .9, seed: hash(i * 9) }));
  const tipB = N1.reduce((a, b) => (Math.hypot(b.x, b.z) > Math.hypot(a.x, a.z) ? b : a));
  const LEAD = { x: tipB.x, z: tipB.z, head: .35 };
  const DK = { x: 34, z: 168, head: .35, y: .7 };   // the deck of the lead boat after the spread (static, lantern on a pole)
  const DF = (u, v, w) => { const h = DK.head, fx = Math.sin(h), fz = Math.cos(h), rx = Math.cos(h), rz = -Math.sin(h); return [DK.x + rx * u + fx * w, v, DK.z + rz * u + fz * w]; };
  const DLAN = DF(-.85, 2.05, .95);
  const fleetA3 = (t) => {
    let L = N0;
    const q = .9 * pulse(t, e('panic') - .3, e('panic') + .5);
    if (q > 0) L = N0.map((b, i) => ({ ...b, x: b.x + q * Math.sin(t * 19 + i) * .9, head: b.head + q * .3 * Math.sin(t * 13 + i * 2) }));
    if (t > e('A society') - .1) L = moveLayout(N0, SC, u01(t, e('A society') - .1, e('panic', 1) + .5), { stagger: .3 });
    if (t > e('steer') - .2) L = moveLayout(SC, CL, u01(t, e('steer') - .2, e('loudest') + .1), { stagger: .3 });
    if (t > e('calm', 1) - .1) L = moveLayout(CL, N1, u01(t, e('calm', 1) - .1, e('choose') + .1), { stagger: .3 });
    if (t > e('we') - .2) L = moveLayout(N1, SPR, u01(t, e('we') - .2, e('act') + .2), { stagger: .4 });
    return L;
  };
  const shipA3 = (t) => { const u = u01(t, e('A society') - .2, e('steer') + .2), w = u01(t, e('calm', 1), e('choose') + .8); return { x: 96 - 44 * sio(u) + 60 * eiX(w), z: 46 - 18 * sio(u), head: -1.9, L: 46, beam: -1.9 + .9 * Math.sin((t - e('A society')) * 1.2) * (1 - .6 * pulse(t, e('panic', 1) - .2, e('panic', 1) + .4)), glare: u01(t, e('A society') - .2, e('A society') + .3) * (1 - .85 * u01(t, e('calm', 1), e('choose'))), horn: pulse(t, e('loudest') - .25, e('loudest') + .75) }; };
  const CENTRE = { x: 0, z: -2, head: 0 };
  const lanC = (t) => frameOf(CENTRE, t)(.25, 1.75, .3);
  const rowsA3 = [
    [K.a30, -6, 44, -74, SKT.yaw, SKT.pitch, 1400],
    row(e('needle') + .2, [-6, 40, -70], [0, 0, 8], 1400),
    row(e('panic') + .2, [-4, 30, -58], [0, 0, 12], 1400),
    row(e("Here's") + .25, [1.6, 1.9, -5.4], [.2, 1.55, -1.6], 1400),
    row(e('believe') + .3, [1.4, 1.85, -5.0], [.2, 1.6, -1.6], 1400),
    row(e('society') + .5, [-34, 30, -62], [20, 0, 26], 1400),
    row(e('loudest') + .3, [-30, 26, -56], [28, 0, 28], 1400),
    row(e('choose') + .3, [-24, 34, -62], [6, 0, 30], 1400),
    row(e('Rebecca') - .1, [LEAD.x - 4.2, 2.3, LEAD.z - 6.2], [LEAD.x + 3, 2.6, LEAD.z + 12], 1400),
    row(e('there') + .2, [LEAD.x - 3.8, 2.2, LEAD.z - 5.6], [LEAD.x + 3.5, 3.0, LEAD.z + 12], 1400),
    row(e('act') + .35, [-20, 72, -70], [40, 0, 160], 1400),
    row(e('headlines') - .1, ...[DF(-3.6, 1.7, -2.8), DF(.8, .9, 1.4)], 1400),
    row(e('this') + .1, ...[DF(-3.3, 1.75, -2.4), DF(1.2, 1.0, 1.6)], 1400),
    [e('Ask', 1) - .05, ...DF(0, DK.y + 1.15, 0), DK.head, PI / 2 - .001, 1400],
    [e('do', 2) + .1, ...DF(0, DK.y + 1.05, 0), DK.head, PI / 2 - .001, 1400],
  ];
  const camA3a = camTrack(rowsA3);
  // the end: the tent-folded sheet's ridge (along the deck's w axis) → the camera sinks onto it, the ridge = the plate line
  K.fold0 = e('do', 2) + .02; K.fold1 = K.fold0 + .55; K.push0 = K.fold0 + .3;
  const SW = .42, SH2 = SW / 1.414;
  const RIDGE_H = .07;
  const camA3 = (t) => {
    if (t <= K.push0) return camA3a(t);
    const C0 = camA3a(K.push0), u = trackLog([[K.push0, 1], [K.out, .006]])(t), top = DK.y + RIDGE_H, p = DF(0, top + (C0.y - top) * u, 0);
    return camera({ x: p[0], y: p[1], z: p[2], yaw: DK.head, pitch: PI / 2 - .001, F: 1400 });
  };
  // the caught sheet's state: corners in deck coordinates (u across, w along), its face (front = headline, back = blank)
  K.catch = e('this') + .25; K.flat = e('Ask', 1) - .05; K.turn0 = e('Ask', 1); K.turn1 = e('Ask', 1) + .45; K.write0 = e('what', 2) - .05; K.write1 = e('do', 2) - .02;
  function sheetGeo(t) {
    // flight in (from upper left, tumbling) → caught and laid flat → turned over about its w axis → tent fold about the u = 0 crease
    const cu = sio(u01(t, K.catch, K.flat)), fx = (1 - cu) * -1.4, fy = (1 - cu) * .6, rot = (1 - cu) * 1.2;
    const turn = PI * sio(u01(t, K.turn0, K.turn1)), fold = sio(u01(t, K.fold0, K.fold1));
    const hw = SW / 2, hh = SH2 / 2, phi = fold * 1.15, ex = hw * Math.cos(phi), ry = hw * Math.sin(phi) * (RIDGE_H / (hw * Math.sin(1.15)));
    const pt = (a, b, half) => {   // a ∈ [-1, 1] across (crease at 0), b ∈ [-1, 1] along
      let x = a * hw, y = 0, w = b * hh;
      if (fold > 0) { const s = Math.sign(a) || 1, k = Math.abs(a); x = s * k * ex; y = (1 - k) * ry; }
      // turn over about the w axis (the sheet flips left ↔ right)
      const ct = Math.cos(turn), st2 = Math.sin(turn); const xx = x * ct, yy = y + Math.abs(x) * st2 * .9;
      const cr = Math.cos(rot), sr = Math.sin(rot);
      return DF(xx * cr - w * sr + fx, DK.y + .004 + yy + fy, xx * sr + w * cr + fy * .4);
    };
    return { pt, turn, fold };
  }
  const WRITE = 'what can we do?';
  function backDraw(g, t, W, H) {   // the blank back: your handwriting
    paperLamp(g, t, { rect: [0, 0, W, H] });
    const u = u01(t, K.write0, K.write1);
    if (u <= 0) return;
    g.save(); g.font = '400 150px "Instrument Serif Italic"'; g.fillStyle = '#1a2a6a'; g.textBaseline = 'alphabetic';
    const tw = g.measureText(WRITE).width, x0 = W / 2 - tw / 2 + 120, y0 = H * .56;
    g.beginPath(); g.rect(x0 - 10, 0, (tw + 20) * u, H); g.clip(); g.fillText(WRITE, x0, y0); g.restore();
  }
  const writePt = (t) => { const u = u01(t, K.write0, K.write1); return [1920 / 2 - 450 + 120 + 900 * u, 1358 * .56 - 30 + 20 * Math.sin(u * 40)]; };
  function frontDraw(g, t, W, H) { g.drawImage(headlineTex(), 0, 0, W, H); const v = g.createRadialGradient(W * .45, H * .4, 0, W / 2, H / 2, W * .8); v.addColorStop(0, 'rgba(255,200,140,.15)'); v.addColorStop(1, 'rgba(30,16,8,.55)'); g.fillStyle = v; g.fillRect(0, 0, W, H); }
  function deckDraw(ctx, t, C) {
    const P = projPoly(C, [DF(-1.6, DK.y, -3), DF(1.6, DK.y, -3), DF(1.6, DK.y, 3), DF(-1.6, DK.y, 3)]);
    if (!fillPoly(ctx, P, '#2a1a10')) return;
    ctx.save(); fillPoly(ctx, P); ctx.clip();
    for (let i = 0; i < 16; i++) { const u0 = -1.6 + i * .2; const Q = projPoly(C, [DF(u0, DK.y, -3), DF(u0 + .195, DK.y, -3), DF(u0 + .195, DK.y, 3), DF(u0, DK.y, 3)]); fillPoly(ctx, Q, mixHex('#24160c', '#4a3020', .3 + .5 * hash(i * 3.3))); ctx.strokeStyle = 'rgba(8,4,2,.7)'; ctx.lineWidth = 1.5; ctx.stroke(); }
    const lp = C.P(DLAN[0], DK.y, DLAN[2]);
    if (lp) { const g = ctx.createRadialGradient(lp[0], lp[1], 0, lp[0], lp[1], Math.max(300, lp[2] * 2.6)); g.addColorStop(0, 'rgba(255,190,110,.45)'); g.addColorStop(.5, 'rgba(160,80,30,.15)'); g.addColorStop(1, 'rgba(5,4,12,.6)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); }
    ctx.restore();
    const a = C.P(...DF(-.85, DK.y, .95)), b = C.P(...DF(-.85, 2.3, .95)); if (a && b) { ctx.strokeStyle = '#120a06'; ctx.lineWidth = Math.max(2, a[2] * .05); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  }
  function drawA3(ctx, t) {
    const C = camA3(t), late = t > e('headlines') - .4;
    seaBase(ctx, t, C, {});
    if (!late || t < e('Ask', 1) - .2) {
      const closeK = pulse(t, e("Here's") - 1.0, e('society') + .9) > 0 ? clamp(Math.min(u01(t, e("Here's") - 1.0, e("Here's") - .2), 1 - u01(t, e('believe') + .6, e('society') + .5))) : 0;
      seaRose(ctx, t, C, { ...ROSE, a: (1 - .5 * u01(t, e('we'), e('act'))) * (1 - .8 * closeK), points: [1, 1, 1, 1], icons: 1, rim: 1 });
      const L = fleetA3(t), nl = (b, i) => clamp((t - e('needle') + .35 - i * .04) / .3);
      const S = shipA3(t), sx = S.x;
      const glareP = (t > e('A society') - .3 && t < e('choose') + 1.5) ? searchShip(ctx, t, C, S).lamp : null;
      drawFleet(ctx, t, C, closeK > 0 ? L.filter((b) => Math.hypot(b.x - C.x, b.z - C.z) > 9 && Math.hypot(b.x, b.z + 2) > 4) : L, { lantern: (b, i) => t < e('needle') + 1.5 ? nl(b, i) : 1, sail: t > e('choose') - .3 ? 'full' : 'slack', light: glareP || undefined });
      // the steady lantern held at the centre
      if (t > e("Here's") - 1.2 && t < e('society') + 1) {
        boat(ctx, t, C, { ...CENTRE, sail: 'none', lantern: 0 });
        const F = frameOf(CENTRE, t), hp = C.P(...F(0, .62, 0));
        if (hp && hp[2] * 1.72 / 184 < 5) { const s = hp[2] * 1.72 / 184, x = hp[0], y = hp[1] - 90 * s, lw = C.P(...lanC(t)); const pose = { head: -.15, lean: .02 }; const o = { t, seed: 61, rim: '#ffc890', light: lw ? { x: lw[0], y: lw[1], col: '#ffc890', a: .9 } : undefined, dress: { coat: '#2a2236', pants: '#120e14', skin: '#a8734f', hair: '#120c10' }, shadow: false }; const arm = lw ? reachArm(x, y, s, pose, 0, false, o, [lw[0], lw[1] - 12]) : null; figure(ctx, x, y, s, arm ? { ...pose, sh: [arm.sh, .15], el: [arm.el, .3] } : pose, o); }
        lantern(ctx, t, C, ...lanC(t), { s: .24 });
      }
      // Solnit: at the lead boat's bow, a figure raises a lantern into the dark ahead
      if (t > e('The writer') - .6 && t < e('act') + .5) {
        const LB = { ...LEAD, ...(() => { const l = fleetA3(t), b = l.reduce((a, q) => (Math.hypot(q.x - LEAD.x, q.z - LEAD.z) < Math.hypot(a.x - LEAD.x, a.z - LEAD.z) ? q : a)); return { x: b.x, z: b.z }; })() };
        const F = frameOf({ ...LB, head: .35 }, t), fp = C.P(...F(0, .62, 1.7));
        if (fp && fp[2] * 1.72 / 184 < 5) {
          const s = fp[2] * 1.72 / 184, x = fp[0], y = fp[1] - 90 * s, ru = sio(u01(t, e('The writer') + .1, e('Solnit') + .2));
          const lw = C.P(...F(.15, 1.75 + .75 * ru, 2.2 + .25 * ru));
          const pose = { head: -.25 * ru, lean: -.03 }, o = { t, seed: 77, rim: '#ffc890', light: lw ? { x: lw[0], y: lw[1], col: '#ffc890', a: .9 } : undefined, dress: { coat: '#3a2a40', pants: '#120e14', skin: '#c99a74', hair: '#2a1e1a' }, shadow: false };
          const arm = lw ? reachArm(x, y, s, pose, 0, true, { ...o, flip: true }, [lw[0], lw[1] - 10]) : null;
          figure(ctx, x, y, s, arm ? { ...pose, sh: [arm.sh, .2], el: [arm.el, .3] } : pose, { ...o, flip: true });
          const lp = lantern(ctx, t, C, ...F(.15, 1.75 + .75 * ru, 2.2 + .25 * ru), { s: .26 });
          if (lp) label(ctx, t, lp[0] + 30, lp[1] - 20, u01(t, e('Solnit') - .1, e('puts') + .3) * (1 - u01(t, e('we') - .3, e('we') + .1)), 'REBECCA SOLNIT', 'HOPE IN THE DARK', { len: 110, dx: 80 });
        }
      }
    }
    if (late) {
      deckDraw(ctx, t, C);
      const lp = C.P(...DLAN);
      // the caught sheet
      if (t > K.catch) {
        const G = sheetGeo(t), back = G.turn > PI / 2;
        if (G.fold <= 0) {
          const pts = back ? [G.pt(1, 1), G.pt(-1, 1), G.pt(-1, -1), G.pt(1, -1)] : [G.pt(-1, 1), G.pt(1, 1), G.pt(1, -1), G.pt(-1, -1)];
          sheet(ctx, t, C, { corners: pts, aspect: 1.414, w: SW, lamp: false, draw: back ? backDraw : frontDraw });
        } else {
          // two halves (the back faces up): plate space halves of the back
          const lit = 1 - u01(t, K.push0 + .1, K.out - .12);
          for (const side of [-1, 1]) {
            const pts = side < 0 ? [G.pt(1, 1), G.pt(0, 1), G.pt(0, -1), G.pt(1, -1)] : [G.pt(0, 1), G.pt(-1, 1), G.pt(-1, -1), G.pt(0, -1)];
            const SP = pts.map((p) => C.P(...p, .005));
            if (SP.some((p) => !p)) continue;
            ctx.save(); ctx.beginPath(); SP.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.clip(); lineGround(ctx, t, HO.o); ctx.restore();
            if (lit > 0) { ctx.save(); ctx.globalAlpha = lit; sheet(ctx, t, C, { corners: pts, aspect: .707, w: SW / 2, lamp: false, draw: (g, tt, W, H) => { g.save(); g.scale(2, 2); g.translate(side < 0 ? 0 : -960, 0); backDraw(g, tt, 1920, 1358); g.restore(); g.fillStyle = `rgba(10,12,34,${.25 + .35 * G.fold})`; g.fillRect(0, 0, W, H); } }); ctx.restore(); }
          }
          // the crease: the plate's line, along the ridge
          const r0 = C.P(...G.pt(0, 1), .005), r1 = C.P(...G.pt(0, -1), .005);
          const cu = u01(t, K.fold0 + .2, K.fold1);
          if (r0 && r1 && cu > 0) { ctx.save(); ctx.globalAlpha = cu; ctx.translate((r0[0] + r1[0]) / 2 - 960, 0); lineStroke(ctx, t, { ...HO.o, x0: Math.min(r0[1], r1[1]) - 540, x1: Math.max(r0[1], r1[1]) - 540 }); ctx.restore(); }
        }
        // hands: catch the sheet at its two edges, hold while it turns; the left one holds it flat while you write; both push the edges in to fold
        const hu = sio(u01(t, K.catch - .1, K.catch + .25)) * (1 - sio(u01(t, K.fold1 - .05, K.fold1 + .3)));
        if (hu > 0) {
          const fl = G.turn > PI / 2 ? -1 : 1, Ls = C.P(...G.pt(-fl, .1)), Rs = C.P(...G.pt(fl, -.1)), wr = t > K.write0 - .3 && t < K.fold0;
          if (Ls) handDraw(ctx, Ls[0] - 40, Ls[1] + 60 + (1 - hu) * 600, 1.5, { pose: wr ? 'open' : 'grip', ang: -1.1, skin: '#c99a74', sleeve: '#2a2236', sleeveLen: 900, rim: '#ffc890', light: [0, -1], t, seed: 3 });
          if (!wr && Rs) handDraw(ctx, Rs[0] + 40, Rs[1] + 60 + (1 - hu) * 600, 1.5, { pose: 'grip', ang: -2.0, flip: true, skin: '#c99a74', sleeve: '#2a2236', sleeveLen: 900, rim: '#ffc890', light: [0, -1], t, seed: 4 });
        }
        if (t > K.write0 - .35 && t < K.fold0 + .1) {
          const G2 = sheetGeo(t), wp = writePt(t), u = 1 - wp[0] / 1920, v = wp[1] / 1358, a = 2 * u - 1, b = 1 - 2 * v, w = C.P(...G2.pt(a, b)), pu = sio(u01(t, K.write0 - .35, K.write0)) * (1 - sio(u01(t, K.write1, K.fold0 + .1)));
          if (w) penHand(ctx, t, w[0] + (1 - pu) * 600, w[1] + (1 - pu) * 500, 1.5, { lift: t > K.write1 ? .8 : .05 * Math.sin(t * 30) });
        }
      }
      // the headline squall (whips across before the catch)
      if (t < K.flat + .1) headlines(ctx, t, C, { u: t - e('headlines') + .3, n: 30, x0: DK.x + 9, z0: DK.z + 1, y0: DK.y - .4, wind: [-7.5, -1.5], lamp: lp });
      if (t < K.push0) lantern(ctx, t, C, ...DLAN, { s: .26 });
    }
    // the last frames ARE the plate (the camera rests on the ridge)
    if (t >= K.out - .12) plate(ctx, t, 'line', HO.o);
  }

  // ================================================================ the cut list (one frame function, acts by time)
  const ACTS = [[K.in, drawA1], [K.m0, drawM], [K.tw0, drawTW], [K.rm0, drawRM], [K.gr0, drawGR], [K.bl0, drawBL], [K.a20, drawA2], [K.by0, drawBY], [K.tb0, drawTB], [K.a30, drawA3]];
  for (let i = 1; i < ACTS.length; i++) if (!(ACTS[i][0] > ACTS[i - 1][0])) throw new Error(`sc09: act ${i} starts before act ${i - 1}`);
  function frame(ctx, t) {
    let f = ACTS[0][1]; for (const [t0, g] of ACTS) if (t >= t0) f = g;
    f(ctx, t);
  }
  sc09K = K;
  prepareSky();
  await ready();
  const PR = { riso: .35 };
  return [
    { t: K.in, tr: 'cut', d: .1, draw: frame, print: HI.print },
    { t: K.c6a + .3, tr: 'cut', d: .1, draw: frame, print: { riso: .15, halftone: .4, hatch: .3 } },
    { t: K.c6b - .3, tr: 'cut', d: .1, draw: frame, print: PR },
    { t: K.out - .1, tr: 'cut', d: .1, draw: frame, print: HO.print },
  ];
}
export let sc09K = null;
