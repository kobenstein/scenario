// c07 · The gym becomes a city (06a + 06b), plate light (sun, the oculus) → plate sky (dusk). Builder: c07/c08/c10. ONE continuous take, no cut.
// Shot list: /mnt/project-files/scenario/film-klueger/bild/shots.md §4 (7.01–7.13). The city: lib/f11_c07_city.mjs (the hall from outside,
// the river behind it, the same houses on both banks), rooms behind windows: lib/f11_c07_rooms.mjs.
//
//  shot  anchor (06a / 06b)                        image                                                          the one movement
//  7.01  "Now picture the gym growing…"            pull out of the oculus light, now from outside: the hall's       the growth (ring by ring, the
//                                                  back gable on its plaza; the houses rise street by street          houses rise, roofs set on)
//  7.02  "In some windows, minds…"                 the camera turns to the riverfront: in some windows a figure     the windows
//                                                  curls a warm weight and the lamp brightens; in others it dims
//  7.03  "Maybe the next big divide…"              rise over the villas: an ink line on the street (rich | poor);   the line (drawn, rubbed out,
//                                                  bright and dim windows on both sides; rubbed out, redrawn        redrawn)
//                                                  across (with machines | without): it does not fit either
//  7.04  "Maybe it's people who train…"            push to one villa's front: the line runs up the facade between   the push, then the line
//                                                  a trainer window (hand of light, curl) and a forklift window
//  7.05  "We've lived through this…"               to the school's gable: on its slate a chalk line, flat, then     the chalk line (FT tag)
//                                                  falling from 2012
//  7.06  "One Financial Times analysis…"           pull back along the bank: in many windows a grey feed flickers,  the flicker (slow)
//                                                  people bent over
//  7.07  "And the other direction…"                one window turns warm, the warmth spreads to its neighbours      the spread
//  7.08  "In Nigeria, hundreds of students…"       push to the school's classroom window: students at desks with    the push (World Bank tag)
//                                                  desk machines, a teacher right beside them
//  7.09  "The World Bank compared…"                on the classroom board: 6 weeks ≈ 1.5–2 years (chalk bars)        the bars
//  7.10  "A small pilot…look where it points."     pull back and rise, turning upriver toward the low sun            the pull back
//  7.11  "This is the part that gives me hope."    warm light, the city golden, held drift                           drift
//  7.12  "For most of history, a personal tutor…"  a villa window: a child at a desk, a tutor beside; on "Now it     the spread of trainer lights
//                                                  could cost almost nothing" every window gets a small trainer light
//  7.13  "So which city are we building?"          tilt up into the dusk sky → plate sky (dusk)                       the tilt
// Ruhe: 0 hard cuts; camera keys with lib/f11_c07_city camSmooth (monotone, no dead stop); one thing moves at a time. Light: the afternoon
// warms slowly into a rose-gold dusk (env.dusk) so the sky at the end IS the sky plate. Print: the light plate's print, then the sky plate's.
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, ein } from '../engine.mjs';
import * as K from '../lib/f11_kit.mjs';
import * as C from '../lib/f11_c07_city.mjs';
import * as RM from '../lib/f11_c07_rooms.mjs';
import { handsOf, plate } from '../lib/handoff4.mjs';

const TAU = Math.PI * 2;

export default async (T, R) => {
  await K.studentsPrepare();
  const { in: HI, out: HO } = handsOf('c07', T);
  const S = (p, n) => T.S('06a', p, n), E = (p, n) => T.E('06a', p, n), Sb = (p, n) => T.S('06b', p, n), Eb = (p, n) => T.E('06b', p, n);
  const A = {
    s1: S('Now picture'), s1e: E('into a city'), s2: S('In some windows'), s2b: S('In others'), s2e: E('slowly dimming'),
    s3: S('Maybe the next'), s3b: S('Or people with'), s3e: E('people without'), s4: S('Maybe it'), s4h: S('and people who hand'), s4e: E('everything over'),
    s5: S('We'), s5s: S('Since the early'), s5e: E('rich countries'), s6: S('One Financial'), s6b: S('If that'), s6e: E('whole society'),
    s7: S('And the other'), s7e: E('spread too'), s8: S('In Nigeria'), s8b: S('After school'), s8e: E('beside them'), s9: S('The World Bank'), s9g: S('one and a half'), s9e: E('normal schooling'),
    b1: Sb('A small pilot'), b2: Sb('The comparison'), b3: Sb('But look'), b3e: Eb('it points'), b4: Sb('This is the part'), b4e: Eb('gives me hope'),
    b5: Sb('For most of history'), b6: Sb('Now it could'), b7: Sb('For every child'), b7e: Eb('on Earth'), b8: Sb('So which city'), b8e: Eb('are we building'),
    start: HI.b, end: HO.a,
  };
  const P = C.PLAN, SCH = P.school, house = (id) => P.houses.find((h) => h.id === id);
  const R0 = (a, b, kind) => P.right.find((h) => h.row === 0 && h.cz > a && h.cz < b && (!kind || h.kind === kind));
  const H17 = R0(56, 67.5, 'house'), V19 = R0(86, 102, 'villa');
  const WA = SCH.wins.find((w) => w.face === 0 && w.big && w.j === 0);   // the classroom window (z ≈ 165)
  const WB = SCH.wins.find((w) => w.face === 0 && w.big && w.j === 1);
  const ROOM2 = { x0: 22.25, x1: 31.5, z0: 16.3, z1: 26.5, y0: 0, y1: 4.4, wall: '#efdcb6', floor: '#b98a57', lamp: [26.5, 3.6, 21.5], open: 0 };
  const TUT = V19.wins.find((w) => w.face === 0 && w.i === 1 && w.j === 1);   // the villa window with the tutor
  const zOf = (h, w) => h.z1 - w.u;   // face 0: the window's z

  // ---------------------------------------------------------------- light: the afternoon warms into dusk
  const dusk = (t) => .55 * sm(lin(A.s5, A.b4, t)) + .45 * sm(lin(A.b4, A.b8 + .4, t));

  // ---------------------------------------------------------------- the camera
  // 7.01: the pull out of the oculus is one log-distance move (a fly-out: the apparent speed stays even while the distance grows 100×)
  const OC = C.OCC, ang = Math.PI + Math.PI / 8;   // the middle of one sector between the mullions (lower left of the oculus seen from inside)
  const SEC = [OC.x + Math.cos(ang) * .83, OC.y + Math.sin(ang) * .83, OC.z];
  const PO = { t0: A.start, t1: A.s2 + .6, D0: .42, D1: 58 };
  const L1 = [-1.5, 8.5, 34];
  function pullOut(t) {
    const u = clamp((t - PO.t0) / (PO.t1 - PO.t0)), e = u * u * u * (u * (6 * u - 15) + 10);   // smootherstep
    const D = PO.D0 * Math.pow(PO.D1 / PO.D0, e), w = sm(lin(.15, 1, u));
    const L = [mix(SEC[0], L1[0], w), mix(SEC[1], L1[1], w), mix(SEC[2], L1[2], w)];
    return C.orbitCam(L, D, mix(0, -.05, w), mix(0, .2, w), mix(1700, 1500, sm(u)));
  }
  const look = (p, L, f) => C.lookAt(p, L, f);
  const KEYS = [
    [PO.t1, pullOut(PO.t1)],
    [A.s2 + 2.4, look([-1.5, 17, 82], [18, 7, 30], 1500)],                // 7.02 the windows of the plaza's east side
    [A.s2e - .4, look([-2.2, 17.6, 80.8], [19.4, 6.7, 29.0], 1490)],
    [A.s3 + 2.6, look([-12, 30, 74], [21, 0, 59], 1400)],                 // 7.03 high over the river head: the quay in front of the first row
    [A.s3e, look([-12.3, 30.4, 74.4], [21, 0, 59.2], 1420)],
    [A.s4h + .6, look([-12.4, 30.2, 74.4], [22, 3, 61.4], 2300)],          // 7.04 the same eye leans in on the house by the quay (lens)
    [A.s5s + 1.6, look([6, 16.5, 28.2], [22, 5.9, 28.2], 1950)],          // 7.05 the school slate (over the hall's roof edge)
    [A.s5e + .4, look([5.6, 16.7, 28.0], [22, 5.9, 28.0], 1990)],
    [A.s7e - .2, look([3.4, 17.8, 28.6], [24, 6, 27.8], 1450)],          // 7.06/7.07 one slow pull back over the hall roof: the feeds, the spread
    [A.s8 + 3.1, look([12.6, 2.6, 33.4], [24, 2.2, 33.4], 1500)],         // 7.08 the classroom window
    [A.s9e + .2, look([15.6, 2.48, 33.6], [31.5, 2.2, 33.0], 1580)],     // 7.09 one slow push on toward the board
    [A.b3, look([2, 18, 58], [24, 6, 100], 1450)],                        // 7.10 pull back, turn toward the riverfront
    [A.b4 + .2, look([1.8, 17.6, 59], [24, 6, 101], 1470)],               // 7.11 hold
    [A.b6 - .3, look([8, 10, 80], [23, 5.2, zOf(V19, TUT)], 2700)],       // 7.12 the villa window (a long lens from the quay)
    [A.b6 + 1.4, look([8.25, 10, 80.5], [23, 5.2, zOf(V19, TUT)], 2750)],
  ];
  // 7.13: the tilt up into the sky lands on SKYREF (pitch .5, f 1500) at the plate
  const TILT0 = A.b6 + 1.4, SKYPOS = { x: -1.6, y: 27, z: 70 };
  const endYaw = KEYS[KEYS.length - 1][1].yaw;
  function cam(t) {
    if (t < PO.t1) return pullOut(t);
    if (t < TILT0) return C.aboveRoof(C.camSmooth(t, KEYS));
    const a = KEYS[KEYS.length - 1][1], u = sm(lin(TILT0, A.end - .05, t)), u2 = eio(lin(TILT0, A.end - .05, t));
    return { x: mix(a.x, SKYPOS.x, u), y: mix(a.y, SKYPOS.y, u), z: mix(a.z, SKYPOS.z, u), yaw: a.yaw, pitch: mix(a.pitch, C.SKYREF.pitch, u2), f: mix(a.f, C.SKYREF.f, u2) };
  }

  // ---------------------------------------------------------------- the city grows (7.01): ring by ring from the hall, house by house
  const grow = (o, t) => {
    if (o.kind === 'bridge') return clamp((t - (A.s1 + 2.4)) / 1.6);
    const tb = A.s1 + .25 + 6.2 * Math.sqrt(o.dist / 420) + (((o.id || Math.floor(o.seed * 7) || 1) * .618) % 1) * .35;
    return clamp((t - tb) / 1.3);
  };

  // ---------------------------------------------------------------- windows
  const RIGHT = (h) => h.x0 > 0;
  const spread = (w, h, origin, t0, speed) => { const p = [h.x0, w.y0, h.z1 - w.u]; return t0 + Math.hypot(p[0] - origin[0], p[1] - origin[1], p[2] - origin[2]) / speed; };
  const W7 = (() => { const h = R0(0, 14, 'house'); return { h, w: h.wins.find((w) => w.face === 0 && w.i === 1 && w.j === 1) }; })();   // the window that turns warm first (7.07)
  const W7p = [W7.h.x0, W7.w.y0, W7.h.z1 - W7.w.u];
  const TUTp = [V19.x0, TUT.y0, zOf(V19, TUT)];
  const LINE3U = (H17.z1 - H17.z0) / 3;   // 7.04: the line between the two window columns of the house by the quay
  function win(w, h, t) {
    const s = w.seed, st = { glow: s < .5 ? .45 : 0, fig: null };
    // 7.02: in some windows a figure lifts and the lamp brightens; in others the light slowly dims
    if (s < .22) { const u = eout(lin(A.s2 + .2 + (s / .22) * 1.6, A.s2 + .6 + (s / .22) * 1.6, t)); st.glow = mix(.45, 1, u); if (u > 0) st.fig = 'lift'; }
    else if (s < .5) { const u = sm(lin(A.s2b, A.s2b + 4.5 + (s - .22) * 6, t)); st.glow = mix(.45, .1, u); if (u > .05) st.fig = 'sit'; }
    // 7.04: the villa front, split by the line: trainer windows left, forklift windows right
    if (h === H17 && w.face === 0 && t > A.s4 - 1) { const left = w.u < LINE3U; st.fig = left ? 'train' : 'sit'; st.glow = left ? 1 : .18; st.hand = left ? 1 : 0; st.fork = left ? 0 : 1; }
    // 7.06: grey feeds flicker in many windows along the bank (both banks, beyond the school)
    if (t > A.s6 && h.cz < 60 && h.cz > -120 && h.kind !== 'school' && s >= .3 && s < .85) {
      const dd = Math.abs(h.cz - 28) + Math.abs(h.cx) * .3, on = sm(lin(A.s6 + .3 + dd * .02 + s * .8, A.s6 + .9 + dd * .02 + s * .8, t));
      if (on > 0) { st.feed = on; st.glow = mix(st.glow, .15, on); st.fig = 'bent'; }
    }
    // 7.07: the other direction spreads: warmth from one window to its neighbours
    if (t > A.s7) { const tw = spread(w, h, W7p, A.s7 + .4, 9); const u = eout(lin(tw, tw + .45, t)); if (u > 0 && (s < .85 || w === W7.w)) { st.feed = (st.feed || 0) * (1 - u); st.glow = Math.max(st.glow, u); st.fig = u > .5 ? 'lift' : st.fig; } }
    // 7.12: a tutor in one villa window, then a small trainer light in every window, spreading from it
    if (w === TUT && t > A.b5 - 1) { st.fig = 'tutor'; st.glow = 1; }
    if (t > A.b6) { const tw = spread(w, h, TUTp, A.b6 + .3, 26); const u = eout(lin(tw, tw + .5, t)); if (u > 0) { st.cool = u; st.glow = Math.max(st.glow, .55 + .45 * u); st.feed = (st.feed || 0) * (1 - u); if (w !== TUT && st.fig !== 'lift') st.fig = 'train'; st.hand = 1; } }
    return st;
  }

  // ---------------------------------------------------------------- the classroom behind the school's big window (7.08–7.09)
  const ROOM = { x0: 22.25, x1: 31.5, z0: 26.6, z1: 39.7, y0: 0, y1: 4.4, wall: '#eedcb8', floor: '#b98a57', lamp: [26.5, 3.6, 33.2], open: 0 };
  const SEATS = []; { const vs = [3, 4, 8, 9, 3, 8, 4, 9, 3]; let k = 0; for (const x of [24.6, 26.8, 29.0]) for (const z of [31.0, 34.0, 37.0]) SEATS.push({ x, z, v: vs[k++] }); }
  const TEACH = [27.9, 0, 29.6];
  const BOARD = { x: 31.48, zL: 37.6, yT: 3.0, w: 900, h: 150 };   // cm
  function classroom(ctx, V, t) {
    RM.room(ctx, t, V, ROOM);
    // the board on the back wall
    const bp = [[BOARD.x, BOARD.yT, BOARD.zL], [BOARD.x, BOARD.yT, BOARD.zL - 9], [BOARD.x, BOARD.yT - 1.5, BOARD.zL - 9], [BOARD.x, BOARD.yT - 1.5, BOARD.zL]];
    if (V.poly(ctx, bp.map((p) => [p[0] - .005, p[1] + (p[1] > 2 ? .08 : -.08), p[2] + (p[2] > 33 ? .08 : -.08)]))) { ctx.fillStyle = K.PAL.frame; ctx.fill(); }
    if (V.poly(ctx, bp.map((p) => [p[0] - .01, p[1], p[2]]))) {
      ctx.fillStyle = K.PAL.slate; ctx.fill();
      const F = RM.boardOnX(V, BOARD.x - .012, BOARD.zL, BOARD.yT);
      if (F) { ctx.save(); V.poly(ctx, bp.map((p) => [p[0] - .012, p[1], p[2]])); ctx.clip(); ctx.transform(F.a, F.b, F.c, F.d, F.e, F.f); classBoard(ctx, t); ctx.restore(); }
    }
    // desks + students far to near (by depth), the teacher among them
    const items = SEATS.map((s) => ({ d: V.toCam([s.x, .7, s.z])[2], f: () => {
      RM.classDesk(ctx, V, [s.x, 0, s.z - .58], { sheet: 1 });
      const Sm = K.sprite(V, [s.x + .18, .73, s.z - .7]); if (Sm.vis) { ctx.save(); ctx.translate(Sm.x, Sm.y); ctx.scale(Sm.k / 100, Sm.k / 100); K.deskMachine(ctx, t, { core: 1, seed: s.v }); ctx.restore(); }
      K.stool(ctx, V, [s.x, 0, s.z]);
      K.student(ctx, V, [s.x, 0, s.z], { v: s.v, pose: 'write', live: s.v === 8 && s.x > 26 && s.z < 32 ? t : null });
    } }));
    items.push({ d: V.toCam(TEACH)[2], f: () => RM.personAt(ctx, t, V, TEACH, { lean: .16, head: .26, sh: [.75, .25], el: [.55, .35] }, { flip: true, seed: 21, dress: { coat: '#c46a45', pants: '#3a3040', shoes: '#2a221c', skin: K.PAL.skin[4], hair: '#1c1420', sleeve: 'long' } }) });
    items.sort((a, b) => b.d - a.d).forEach((i) => i.f());
  }
  // 6 weeks ≈ 1.5–2 years: a short bar with the warm dot (tutor) and a long bar (normal schooling), equal in what they reached
  function classBoard(ctx, t) {
    const u = (a, b) => lin(a, b, t);
    K.chalkText(ctx, 'gains', 40, 34, { size: 30, u: u(A.s9 + .3, A.s9 + .9), a: .8 });
    K.chalkText(ctx, '6 weeks', 40, 82, { size: 40, u: u(A.s9g - .6, A.s9g), col: K.PAL.effortHot });
    K.chalkLine(ctx, [[220, 70], [360, 70]], { u: eout(u(A.s9g - .2, A.s9g + .4)), lw: 12, col: K.PAL.effort, a: .9 });
    K.chalkText(ctx, '≈', 390, 84, { size: 48, u: u(A.s9g + .6, A.s9g + .9) });
    K.chalkText(ctx, '1.5–2 years', 40, 134, { size: 40, u: u(A.s9g + .9, A.s9g + 1.6) });
    K.chalkLine(ctx, [[270, 122], [840, 122]], { u: eout(u(A.s9g + 1.4, A.s9g + 2.6)), lw: 12, a: .85 });
    K.chalkText(ctx, 'of school', 845, 128, { size: 22, align: 'right', u: u(A.s9g + 2.4, A.s9g + 2.9), a: .7 });
  }

  // ---------------------------------------------------------------- the lines of 7.03 / 7.04 (ink on the street, on a facade)
  const ink = (ctx, V, pts, u, o = {}) => {
    if (u <= 0) return;
    let L = 0; const d = []; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(...pts[i].map((v, j) => v - pts[i - 1][j])); d.push(l); L += l; }
    const a = (o.from ?? 0) * L; let rem = L * u, acc = 0;
    ctx.save(); ctx.strokeStyle = rgba('#3a2a22', o.a ?? .85); ctx.lineCap = 'round'; ctx.setLineDash(o.dash || []);
    for (let i = 1; i < pts.length; i++) {
      const s0 = acc, s1 = acc + d[i - 1]; acc = s1; if (s1 < a || s0 > rem) continue;
      const q0 = clamp((a - s0) / d[i - 1]), q1 = clamp((rem - s0) / d[i - 1]), P0 = pts[i - 1].map((v, j) => mix(v, pts[i][j], q0)), P1 = pts[i - 1].map((v, j) => mix(v, pts[i][j], q1));
      const m = V.P(P0.map((v, j) => (v + P1[j]) / 2)); if (!(m.z > .2)) continue;
      ctx.lineWidth = Math.max(1.5, m.k * (o.w ?? .35)); ctx.beginPath(); if (V.line(ctx, P0, P1)) ctx.stroke();
    }
    ctx.restore();
  };
  // a word in ink lying on the ground, read from the camera side (u → screen right ≈ −z, v → toward the camera ≈ −x)
  const groundWord = (ctx, V, s, p, size, u, ang = 0) => {
    if (u <= 0) return;
    const ca = Math.cos(ang), sa = Math.sin(ang), dirU = [sa, 0, -ca], dirV = [-ca, 0, -sa];
    const o = V.P(p), ux = V.P(p.map((v, j) => v + dirU[j])), vy = V.P(p.map((v, j) => v + dirV[j])); if (!(o.z > .3 && ux.z > .3 && vy.z > .3)) return;
    ctx.save(); ctx.transform((ux.x - o.x) / 100, (ux.y - o.y) / 100, (vy.x - o.x) / 100, (vy.y - o.y) / 100, o.x, o.y);
    ctx.font = `${size}px "Instrument Serif"`; const w = ctx.measureText(s).width;
    ctx.beginPath(); ctx.rect(-w / 2 - 10, -size, (w + 20) * clamp(u), size * 1.5); ctx.clip();
    ctx.fillStyle = rgba('#3a2a22', .85); ctx.textAlign = 'center'; ctx.fillText(s, 0, 0); ctx.restore();
  };
  const L1P = [[10.5, .02, 67.2], [40, .02, 67.2]], L2P = [[10.5, .02, 48], [40, .02, 48]];
  const WANG = Math.PI / 2 - KEYS[4][1].yaw;   // ground words face the 7.03 camera
  function chalk(ctx, V, t) {
    // 7.03: rich | poor along the street behind the first row, then across it: with machines | without. Neither fits the windows.
    const d1 = eio(lin(A.s3 + .3, A.s3 + 1.7, t)), e1 = eio(lin(A.s3b - .2, A.s3b + .6, t));
    ink(ctx, V, L1P, d1, { from: e1, dash: [14, 10] });
    const lab1 = Math.min(lin(A.s3 + 1.2, A.s3 + 1.8, t), 1 - lin(A.s3b - .2, A.s3b + .3, t));
    groundWord(ctx, V, 'rich', [16, .02, 72], 380, lab1, WANG); groundWord(ctx, V, 'poor', [16, .02, 62], 380, lab1, WANG);
    const d2 = eio(lin(A.s3b + .4, A.s3b + 1.7, t)), e2 = eio(lin(A.s4 - .3, A.s4 + .5, t));
    ink(ctx, V, L2P, d2, { from: e2, dash: [14, 10] });
    const lab2 = Math.min(lin(A.s3b + 1.4, A.s3b + 2.0, t), 1 - lin(A.s4 - .3, A.s4 + .2, t));
    groundWord(ctx, V, 'with machines', [16, .02, 43.5], 300, lab2, WANG); groundWord(ctx, V, 'without', [16, .02, 53], 300, lab2, WANG);
  }
  // 7.04: the line runs up the villa's front, between the windows of the same house
  function after(ctx, V, o, t) {
    if (o === H17 && t > A.s4 - .5 && t < A.s5s + 2) {
      const z = H17.z1 - LINE3U, u = eio(lin(A.s4h - .6, A.s4h + .9, t)), off = 1 - eio(lin(A.s5 + .2, A.s5 + 1.2, t));
      ink(ctx, V, [[H17.x0 - .05, .1, z], [H17.x0 - .05, H17.h + .02, z]], Math.min(u, off > 0 ? 1 : 0), { from: 1 - off, dash: [10, 8], w: .09 });
    }
  }

  // ---------------------------------------------------------------- the school slate (7.05): the FT line, flat, then falling from about 2012
  function slate(ctx, G, t) {
    const u = (a, b) => lin(a, b, t);
    K.chalkText(ctx, 'reading · maths · reasoning', 40, 62, { size: 50, u: u(A.s5s + .2, A.s5s + 1.6), a: .85 });
    const x0 = 60, x1 = 560, yb = 214, ys = 104;
    K.chalkLine(ctx, [[x0, yb], [x1, yb]], { u: u(A.s5 + .4, A.s5 + 1.0), lw: 2.6 });
    const pts = [[x0 + 10, ys + 8], [140, ys + 2], [210, ys + 6], [270, ys], [320, ys + 4]], fall = [[320, ys + 4], [380, ys + 26], [430, ys + 52], [480, ys + 66], [540, ys + 92]];
    K.chalkLine(ctx, pts, { u: eio(u(A.s5s + 1.0, A.s5s + 2.6)), lw: 4.4 });
    K.chalkLine(ctx, fall, { u: eio(u(A.s5s + 2.7, A.s5s + 4.6)), lw: 4.4, col: K.PAL.effortHot });
    K.chalkLine(ctx, [[320, yb - 8], [320, yb + 8]], { u: u(A.s5s + 2.4, A.s5s + 2.7), lw: 2.4 });
    K.chalkText(ctx, '2012', 320, yb + 32, { size: 38, align: 'center', u: u(A.s5s + 2.5, A.s5s + 3.0), a: .85 });
  }

  // ---------------------------------------------------------------- interiors: the classroom, the hero windows at figure scale
  function interior(ctx, V, w, h, t, info) {
    if (w === WA) { if (info.px < 40) return false; classroom(ctx, V, t); return true; }
    if (w === WB) { if (info.px < 40) return false; RM.room(ctx, t, V, ROOM2); for (const [x, z, v] of [[27.5, 24, 4], [25.2, 21, 9], [27.5, 18, 3]]) { RM.classDesk(ctx, V, [x, 0, z - .58], { sheet: 1 }); K.stool(ctx, V, [x, 0, z]); K.student(ctx, V, [x, 0, z], { v, pose: 'look' }); } return true; }
    if (info.px > 70) { const st = win(w, h, t); if (st && st.fig) return RM.heroWindow(ctx, t, V, w, st); }
    return false;
  }

  // ---------------------------------------------------------------- the frame
  const sunGlowK = (t) => 1 - sm(lin(TILT0, A.end - .6, t));
  function draw(ctx, t) {
    const V = K.view3(cam(t)), dk = dusk(t);
    C.cityFrame(ctx, t, V, {
      dusk: dk, grow, win, interior, chalk, after, slate, refYaw: endYaw, sunGlow: sunGlowK(t) > .01,
      hall: { glow: mix(.55, .9, dk), oculus: (c, tt) => plate(c, tt, 'light', { tone: 'sun' }) },
    });
    // source tags (upper left, held still while read)
    const ft = Math.min(lin(A.s5s + .6, A.s5s + 1.2, t), 1 - lin(A.s6b - .4, A.s6b, t));
    if (ft > 0) K.tag(ctx, 'JOHN BURN-MURDOCH  ·  FINANCIAL TIMES  ·  MARCH 2025', 72, 96, { u: ft });
    const wb = Math.min(lin(A.s8 + 2.0, A.s8 + 2.6, t), 1 - lin(A.b3 - .2, A.b3 + .2, t));
    if (wb > 0) K.tag(ctx, 'WORLD BANK PILOT  ·  EDO STATE, NIGERIA  ·  2024', 72, 96, { u: wb });
    // the sky plate exactly at the end (the camera is at SKYREF: only sky is in the frame)
    if (t >= A.end - 1 / 30 - 1e-6) plate(ctx, t, 'sky', { tone: 'dusk' });
  }

  return [
    { t: HI.b, tr: 'cut', d: .1, draw, print: HI.print,
      sound: [{ f: 'whoosh_airy', t: A.start + .3, v: .3 }, { f: 'chime', t: A.s2 + .4, v: .3 }, { f: 'paper_slide', t: A.s3 + .3, v: .25 }] },
    { t: A.s3 + 3.4, tr: 'cut', d: .1, draw, print: HO.print,
      sound: [{ f: 'chalk', t: A.s5s + 1.0, v: .35 }, { f: 'chime', t: A.s7 + .4, v: .3 }, { f: 'chalk', t: A.s9g, v: .35 }, { f: 'chime', t: A.b6 + .3, v: .35 }, { f: 'whoosh_airy', t: A.b8 + .3, v: .25 }] },
  ];
};
