// c06 · One habit (04b + 05a), in: paper (cream) → out: light (lamp glow, sun tone). ONE continuous take in the gym of light, no cut.
// Shot list: /mnt/project-files/scenario/film-klueger/bild/shots.md §4 (6.01–6.12). Anchors are VO words (T.S / T.E on '04b', '05a').
//
//  shot  anchor                                    image                                                       the one movement
//  6.01  plate … "They'll do everything…"          pull up out of a test sheet on a front desk: the hall full of     the pull-out; then the forks
//                                                  desks (the study), brass machines in forklift shape hold loads    rise one after another
//                                                  (books, a crate, a chair); on "everything" their forks rise
//  6.02  "So what then?"                           the camera settles over the hall                                  drift
//  6.03  "One of the companies … Claude."          source tag ANTHROPIC (MAKER OF CLAUDE) · STUDY · JAN 2026 ·       held (masked in)
//                                                  PREPRINT (upper left, held still)
//  6.04  "Fifty-two programmers … to help."        52 young programmers at desks in two halves; the rolling board     "52" chalked; the desk machines
//                                                  chalks 52; on "Half of them" the desk machines of the right half   light in a wave (chime)
//                                                  light
//  6.05  "That half scored worse…"                 the board: bars 67 % (no machine) · 50 % (machine)                 bars
//  6.06  "Those who just let it write…"            in the machine half one programmer leans back, his machine writes  he leans back; bar < 40 %
//                                                  on his sheet in cool light → bar < 40 %
//  6.07  "Those who kept asking why…"              the woman beside him leans in, a small warm light at her pencil    she leans in; bar 65 %+
//                                                  → bar 65 %+
//  6.08  "Same machine. Different habit."          same frame (6.04–6.08 share one slowly drifting frame): the two     drift; both lights at once
//                                                  desks side by side in the front row
//  6.09  "The groups were small. But…"             the quote card unrolls on the rolling board (ANTHROPIC · 2026);     the card unrolls, held
//                                                  the camera arrives and holds while it is read
//  6.10  "So here's the rule. When…"               ★ at your place: the forklift holds your weight (you thin, forks   the shape change (brass click)
//                                                  lift it higher on "thinks for you"); on "makes you think" the forks
//                                                  bring it back to your hand and fold, the hand of light reaches your
//                                                  back, you curl, your arm grows
//  6.11  05a "Same machine. Forklift, or…"         held on you and the machine; on "Forklift" the rise begins, curving  drift, then the rise
//  6.12  "But if it all comes down to one habit…"  it rises to the pendant lamp above the Go grid and pushes into     the rise → plate light (sun)
//                                                  its globe of light
// New places: the study's desks (52 = 2 halves × 26: x −8.6…−4.25 and −1.3…3.05, rows z 14.6 + 1.65 r) in place of the exam desks;
// the rolling board at (3.6, 11.8); forklift machines at (−6.4, 11.6) books, (−9.2, 20.5) crate, (6.4, 26.4) chair; the lamp (5.5, 6.4, 19).
// Improvement (calm): 6.12 pushes into the pendant lamp right above the grid instead of the far oculus (28 m away): same light plate,
// a third of the travel. Ruhe: one main movement at a time, the camera never stops (glide). Print { riso: .25 } (the light plate's at the end).
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, ein, canvas } from '../engine.mjs';
import * as K from '../lib/f11_kit.mjs';
import * as X from '../lib/f11_c05_kit.mjs';
import { handsOf, plate } from '../lib/handoff4.mjs';

const PRINT = { riso: .25 };
const DR = 11;
const COOL = '#cfe6f2';

export default async (T, R) => {
  await K.studentsPrepare();
  const { in: HI, out: HO } = handsOf('c06', T);
  const S = (p, n) => T.S('04b', p, n), E = (p, n) => T.E('04b', p, n), S5 = (p) => T.S('05a', p), E5 = (p) => T.E('05a', p);
  const A = {
    s1: S('But most'), s2: S('They'), s2e: S('everything'), s3: S('So what'), s4: S('One of the'), s4a: S('Anthropic'), s4e: E('of Claude'),
    s5: S('Fifty'), s5e: E('coding tool'), s6: S('Half of'), s7: S('That half'), s7w: S('worse'), s8: S('Those who just'), s8f: S('finished'), s9: S('But they'), s9u: S('under forty'),
    s10: S('Those who kept'), s10s: S('sixty'), s11: S('Same machine'), s11d: S('Different'), s11e: E('Different habit'), s12: S('The groups'), s13: S('But their'), s13e: E('master something'),
    s14: S('So here'), s15: S('When the machine'), s15t: S('thinks for'), s16: S('When it makes'), s16e: E('get stronger'),
    b1: S5('Same machine'), b2: S5('Forklift'), b2e: E5('personal trainer'), b3: S5('But if'), b3e: E5('differently'), end: HO.a,
  };

  // ---------------------------------------------------------------- the study's desks (52), the heroes
  const DESKS = [];
  for (const [half, xs] of [['L', [-8.6, -7.15, -5.7, -4.25]], ['R', [-1.3, .15, 1.6, 3.05]]]) for (let r = 0; r < 7; r++) xs.forEach((x, ci) => {
    if (r === 6 && ((half === 'L' && ci === 0) || (half === 'R' && ci === 3))) return;
    DESKS.push({ half, row: r, col: ci, x, z: 14.6 + 1.65 * r, v: (r * 5 + ci * 3 + (half === 'R' ? 7 : 0)) % 12 });
  });
  const HL = DESKS.find((d) => d.half === 'R' && d.row === 0 && d.col === 1), HR = DESKS.find((d) => d.half === 'R' && d.row === 0 && d.col === 2);
  HR.v = 5; HL.v = 2;
  const pose0 = (d) => (d.half === 'R' && (d.v % 3 === 0) ? 'look' : 'write');
  const lamp = (d, t) => (d.half === 'R' ? eout(lin(A.s6 + .1 + d.row * .14 + d.col * .07, A.s6 + .55 + d.row * .14 + d.col * .07, t)) : 0);
  // the sheet of HR is the cream plate (we pull out of its blank lower half)
  const SH = (d) => ({ x: d.x + .62 - .02, z: d.z - .12, a: .12, y: .742 });
  const onS = (d, u, v) => { const s = SH(d); return [s.x + u * Math.cos(s.a) - v * Math.sin(s.a), s.y + .0006, s.z + u * Math.sin(s.a) + v * Math.cos(s.a)]; };
  const SHEET = onS(HR, -.03, .06);   // the blank part of HR's sheet (toward −x, the near half)
  const leanBack = (t) => sm(lin(A.s8 + .2, A.s8 + 1.4, t)), leanIn = (t) => sm(lin(A.s10 + .2, A.s10 + 1.3, t));
  function sheetOf(d, V, t) {
    return (ctx) => {
      if (d === HR) plate(ctx, t, 'paper', { tone: 'cream' }); else { ctx.fillStyle = K.PAL.paper; ctx.fillRect(0, 0, W, H); }
      // printed task lines on the far half (+x side of the sheet)
      ctx.fillStyle = rgba(K.PAL.inkSoft, .34);
      for (let i = 0; i < 5; i++) { const u = .09 - i * .011, v0 = -.115, v1 = v0 + .08 + .1 * ((i * 7) % 5) / 5; if (V.poly(ctx, [onS(d, u - .002, v0), onS(d, u + .002, v0), onS(d, u + .002, v1), onS(d, u - .002, v1)])) ctx.fill(); }
      if (d === HL) {   // the machine writes his code in cool light
        const w = lin(A.s8f - .3, A.s9 + .6, t);
        if (w > 0) { ctx.fillStyle = rgba('#7fb4cc', .85); for (let i = 0; i < 6; i++) { const q = clamp(w * 6 - i); if (q <= 0) break; const u = .03 - i * .011, v0 = -.1, v1 = v0 + .17 * q; if (V.poly(ctx, [onS(d, u - .0018, v0), onS(d, u + .0018, v0), onS(d, u + .0018, v1), onS(d, u - .0018, v1)])) ctx.fill(); } }
      }
      if (d === HR) {   // her own lines, slowly (pencil), from "asking why"
        const w = lin(A.s10 + .8, A.s11 + 1.5, t);
        if (w > 0) { ctx.fillStyle = rgba(K.PAL.ink, .6); for (let i = 0; i < 3; i++) { const q = clamp(w * 3 - i); if (q <= 0) break; const u = .035 - i * .012, v0 = -.1, v1 = v0 + .13 * q; if (V.poly(ctx, [onS(d, u - .0015, v0), onS(d, u + .0015, v0), onS(d, u + .0015, v1), onS(d, u - .0015, v1)])) ctx.fill(); } }
      }
    };
  }
  function drawDesk(ctx, V, d, t) {
    K.stool(ctx, V, [d.x, 0, d.z]);
    if (d === HL || d === HR) {
      const P = X.personAt(V, [d.x, 0, d.z], true);
      if (P && P.z > .7) {
        const base = d === HL ? K.GYM.write : K.GYM.write, tgt = d === HL ? X.LEANBACK : X.LEANIN, u = d === HL ? leanBack(t) : leanIn(t);
        const mp = (a, b) => (Array.isArray(a) ? a.map((v, i) => mix(v, b[i], u)) : mix(a, b, u));
        const pose = { hip: mp(base.hip, tgt.hip), kn: mp(base.kn, tgt.kn), sh: mp(base.sh, tgt.sh), el: mp(base.el, tgt.el), lean: mp(base.lean, tgt.lean), head: mp(base.head, tgt.head), hair: d === HR ? 'bun' : 'short', hands: u > .5 ? tgt.hands : ['relaxed', 'relaxed'] };
        K.athlete(ctx, P.x, P.hipY, P.s, pose, { t, seed: d.v, dress: K.studentDress(d.v), arm: .95, rimW: Math.max(1, .7 * P.s) });
      }
    } else K.student(ctx, V, [d.x, 0, d.z], { v: d.v, pose: pose0(d) });
    K.desk3(ctx, V, [d.x + .62, 0, d.z], { sheet: 1, sheetFill: sheetOf(d, V, t) });
    if (d.half === 'R') {
      const Sp = K.sprite(V, [d.x + .72, .74, d.z + .3]);
      if (Sp.vis && Sp.z > .5) { ctx.save(); ctx.translate(Sp.x, Sp.y); ctx.scale(Sp.k / 100, Sp.k / 100); K.deskMachine(ctx, t, { core: Math.max(lamp(d, t), d === HL ? 1.4 * leanBack(t) : 0), seed: d.v }); ctx.restore(); }
    }
    if (d === HR && leanIn(t) > 0) {   // a small warm light at her pencil: her own effort
      const p = V.P(onS(d, .02, -.02)); if (p.z > .2) { const r = p.k * .09 * leanIn(t); const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3); g.addColorStop(0, rgba(K.PAL.effortHot, .9)); g.addColorStop(.3, rgba(K.PAL.effort, .45)); g.addColorStop(1, rgba(K.PAL.effort, 0)); ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    }
  }

  // ---------------------------------------------------------------- forklift machines all over the hall (loads in local cm at the fork point)
  const books = (ctx, x, y) => { const c = ['#8a4a3a', '#3f6a7a', '#c9a25a', '#5d6f5a', '#7a5a8a']; for (let i = 0; i < 5; i++) { ctx.fillStyle = c[i]; ctx.fillRect(x - 6 + (i % 2) * 3, y - 6 * (i + 1), 46 - (i % 3) * 4, 5.6); ctx.fillStyle = 'rgba(255,240,210,.5)'; ctx.fillRect(x - 6 + (i % 2) * 3, y - 6 * (i + 1), 46 - (i % 3) * 4, 1); } };
  const crate = (ctx, x, y) => { ctx.fillStyle = '#b98250'; ctx.fillRect(x - 8, y - 36, 54, 36); ctx.strokeStyle = 'rgba(90,58,34,.7)'; ctx.lineWidth = 1.2; for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x - 8, y - 9 * i); ctx.lineTo(x + 46, y - 9 * i); ctx.stroke(); } ctx.strokeRect(x - 8, y - 36, 54, 36); };
  const chair = (ctx, x, y) => { ctx.strokeStyle = '#5a3c28'; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 2); ctx.moveTo(x + 2, y - 2); ctx.lineTo(x + 2, y - 46); ctx.moveTo(x + 36, y - 2); ctx.lineTo(x + 36, y - 46); ctx.moveTo(x + 2, y - 2); ctx.lineTo(x + 2, y + 0); ctx.stroke(); ctx.fillStyle = '#a87448'; ctx.fillRect(x - 2, y - 48, 42, 5); ctx.strokeStyle = '#5a3c28'; ctx.beginPath(); ctx.moveTo(x + 2, y - 48); ctx.lineTo(x + 2, y - 84); ctx.moveTo(x - 1, y - 84); ctx.lineTo(x - 1, y - 60); ctx.stroke(); };
  const FORKS = [
    { p: [-6.4, 0, 11.6], load: books, t0: A.s2e - .1, seed: 2 }, { p: [-9.2, 0, 20.5], load: crate, t0: A.s2e + .5, seed: 4 }, { p: [6.4, 0, 26.4], load: chair, t0: A.s2e + 1.1, seed: 6 },
  ];
  const forkUp = (m, t) => mix(.18, .72, eio(lin(m.t0, m.t0 + 1.4, t)));

  // ---------------------------------------------------------------- you and your machine (forklift → trainer), as in c01
  const [, sg0] = canvas(400, 400);
  const top = K.athlete(sg0, 200, 200, 1, K.curl(1), { t: 0, arm: 1 }).hand(0), TOP = [top[0] - 200, top[1] - 200];
  const tb = A.s16;
  const cycle = (t, t0, per = 2.9) => .5 - .5 * Math.cos(Math.PI * 2 * (t - t0) / per);
  function gym(t) {
    const st = { curl: 0, arm: .85, armOut: 0, forkOut: 1, lift: 10 + 12 * sm(lin(A.s15t, A.s15t + 1.2, t)), onFork: 1, glow: .2 };
    if (t >= tb) {
      const c0 = tb + 2.6;
      st.curl = t < c0 ? eio(lin(tb, tb + 1, t)) : .5 + .5 * Math.cos(Math.PI * 2 * (t - c0) / 2.9);
      st.lift = mix(22, 0, eio(lin(tb + .2, tb + 1.1, t))) - 8 * eio(lin(tb + 1.15, tb + 1.9, t));
      st.onFork = t < tb + 1.1 ? 1 : 0;
      st.forkOut = 1 - eio(lin(tb + 1.2, tb + 1.9, t));
      st.armOut = eio(lin(tb + 1.7, tb + 2.6, t));
      st.glow = t < tb + 1.1 ? .2 : mix(.2, .5 + .4 * st.curl, sm(lin(tb + 2.3, tb + 3.6, t)));
      st.arm = mix(.85, 1.2, sm(lin(tb + 2.6, tb + 8, t)));
    }
    st.refl = st.arm;
    return st;
  }
  function drawGym(ctx, t, V, st, mir) {
    const pY = mir ? K.mirrorPt(K.YOU) : K.YOU, pM = mir ? K.mirrorPt(K.MACHINE) : K.MACHINE;
    const Y = K.sprite(V, pY), M = K.sprite(V, pM); if (!Y.vis || !M.vis) return;
    if (!X.personAt(V, pY, false) && !X.personAt(V, pM, false)) return;   // both off screen (or too close): a huge figure would cost seconds
    const sg = mir ? -1 : 1, km = M.k / 100;
    const toL = (p) => [sg * (p[0] - M.x) / km, (p[1] - M.y) / km], toS = (p) => [M.x + sg * p[0] * km, M.y + p[1] * km];
    const hipY = Y.y - 88 * Y.s;
    const topS = [Y.x + sg * TOP[0] * Y.s, hipY + TOP[1] * Y.s], topL = toL(topS);
    const fy = topL[1] + DR + 3 - st.lift, fork = clamp((-fy - 16) / 134);
    if (!mir) { X.safeShadow(ctx, V, K.MACHINE, .6, .3, .26); X.safeShadow(ctx, V, K.YOU, .4, .28, .3); }
    const reach = toL([Y.x - sg * 24 * Y.s, hipY - 46 * Y.s]);
    ctx.save(); ctx.translate(M.x, M.y); ctx.scale(sg * km, km);
    const mo = K.machine(ctx, t, { reach, armOut: st.armOut, fork, forkOut: st.forkOut, core: 1, noHand: true });
    ctx.restore();
    const hnd = K.athlete(ctx, Y.x, hipY, Y.s, K.curl(st.curl), { t, arm: st.arm, flip: mir, seed: 11 });
    const hp = toS(mo.hand); K.lightHand(ctx, t, hp[0], hp[1], mir ? Math.PI - mo.handAng : mo.handAng, { ...mo.handO, s: mo.handO.s * km });
    const h = st.onFork ? toS([topL[0], -mix(16, 150, fork) - 3 - DR]) : hnd.hand(0);
    K.dumbbell(ctx, t, h[0], h[1], { r: DR * km, glow: st.glow });
  }

  // ---------------------------------------------------------------- the rolling board: 52, the bars; the card
  const RB = [3.6, 0, 11.8], RBX0 = RB[0] - X.RB_W / 2, RBY1 = X.RB_Y0 + X.RB_H;
  const WARM = K.PAL.effort;
  function rbContent(ctx, B, t) {
    K.chalkText(ctx, '52 programmers', 10, 20, { size: 13, u: lin(A.s5 + .1, A.s5 + 1.0, t) });
    K.chalkText(ctx, 'new coding tool', 112, 20, { size: 9, u: lin(A.s5e - .6, A.s5e, t), a: .75 });
    const base = 108, U = .85;
    if (t > A.s7) {
      K.chalkLine(ctx, [[10, base], [104, base]], { u: lin(A.s7, A.s7 + .5, t), lw: 1.8 });
      K.chalkBar(ctx, 20, base, 26, 67 * U, { u: eout(lin(A.s7 + .3, A.s7 + .9, t)), lw: 1.8, seed: 1 });
      K.chalkBar(ctx, 64, base, 26, 50 * U, { u: eout(lin(A.s7w, A.s7w + .6, t)), lw: 1.8, col: COOL, seed: 2 });
      K.chalkText(ctx, '67 %', 33, base - 67 * U - 5, { size: 10, align: 'center', u: lin(A.s7 + .8, A.s7 + 1.2, t) });
      K.chalkText(ctx, '50 %', 77, base - 50 * U - 5, { size: 10, align: 'center', u: lin(A.s7w + .5, A.s7w + .9, t), col: COOL });
      K.chalkText(ctx, 'no machine', 33, base + 10, { size: 7.5, align: 'center', u: lin(A.s7 + .4, A.s7 + .9, t), a: .8 });
      K.chalkText(ctx, 'machine', 77, base + 10, { size: 7.5, align: 'center', u: lin(A.s7w, A.s7w + .5, t), a: .8 });
    }
    if (t > A.s8) {
      K.chalkLine(ctx, [[130, base], [246, base]], { u: lin(A.s8, A.s8 + .5, t), lw: 1.8 });
      K.chalkBar(ctx, 142, base, 26, 38 * U, { u: eout(lin(A.s9u, A.s9u + .6, t)), lw: 1.8, col: COOL, seed: 3 });
      K.chalkText(ctx, '< 40 %', 155, base - 38 * U - 5, { size: 10, align: 'center', u: lin(A.s9u + .5, A.s9u + .9, t), col: COOL });
      K.chalkText(ctx, 'let it write', 155, base + 10, { size: 7.5, align: 'center', u: lin(A.s8 + .6, A.s8 + 1.2, t), a: .8 });
    }
    if (t > A.s10) {
      K.chalkBar(ctx, 196, base, 26, 66 * U, { u: eout(lin(A.s10s - .1, A.s10s + .6, t)), lw: 1.8, col: WARM, seed: 4 });
      K.chalkText(ctx, '65 %+', 209, base - 66 * U - 5, { size: 10, align: 'center', u: lin(A.s10s + .5, A.s10s + .9, t), col: WARM });
      K.chalkText(ctx, 'asked why', 209, base + 10, { size: 7.5, align: 'center', u: lin(A.s10 + .6, A.s10 + 1.2, t), a: .8 });
    }
  }
  const CARD = { x0: RBX0 + .07, x1: RBX0 + 1.63, y1: RBY1 - .05, y0: RBY1 - 1.07, z: RB[2] };
  const CARDC = [(CARD.x0 + CARD.x1) / 2, (CARD.y0 + CARD.y1) / 2, RB[2]];
  const cardU = (t) => eout(lin(A.s13 - .1, A.s13 + .6, t));
  const cardText = (ctx, w, h) => X.quoteText(ctx, w, h, ['“Cognitive effort—and even', 'getting painfully stuck—is likely', 'important for fostering mastery.”'], 'ANTHROPIC  ·  2026', { size: 10.2, x: 9, y: 19 });

  // ---------------------------------------------------------------- the camera (one take)
  const look = (p, q) => ({ yaw: Math.atan2(q[0] - p[0], q[2] - p[2]), pitch: Math.atan2(q[1] - p[1], Math.hypot(q[0] - p[0], q[2] - p[2])) });
  const c = (x, y, z, yaw, pitch, f) => ({ x, y, z, yaw, pitch, f });
  const HERO = [(HL.x + HR.x) / 2 + .55, .95, HL.z];
  const hv = (p, f) => { const L = look(p, HERO); return c(p[0], p[1], p[2], L.yaw, L.pitch, f); };
  const cv = (p, f) => { const L = look(p, CARDC); return c(p[0], p[1], p[2], L.yaw, L.pitch, f); };
  const YP = [8.7, 1.2, 15.2], yv = (p, f) => { const L = look(p, YP); return c(p[0], p[1], p[2], L.yaw, L.pitch, f); };
  const START = c(SHEET[0], SHEET[1] + .075, SHEET[2], -.31, -1.5, 1500);
  // RUHE (calm.py): few framings, long holds. 6.04–6.08 share one frame (the study, the board, the two desks in the front row) that drifts
  // very slowly; 6.09 closes in on the card; then your place, a small arc, the rise.
  const CAM = [
    [HI.b, START],
    [HI.b + 1.2, c(SHEET[0] - .02, SHEET[1] + .3, SHEET[2] - .12, -.28, -1.25, 1500)],
    [A.s2e - .1, c(1.45, 2.05, 11.0, -.11, -.5, 1420)],
    [A.s3 + 1.2, c(.8, 3.25, 7.4, -.08, -.21, 1350)],                    // 6.01–6.03 the hall, the forklifts, the tag
    [A.s4 + 3.6, c(.8, 3.25, 7.4, -.08, -.21, 1340)],
    [A.s5 + 2.0, c(.85, 2.45, 6.3, .2, -.11, 1560)],                       // 6.04–6.08 the study + the board
    [A.s7 + .4, c(.85, 2.45, 6.3, .2, -.11, 1580)],
    [A.s8 + 1.2, c(.85, 2.45, 6.3, .2, -.11, 1600)],
    [A.s10 + 1.0, c(.85, 2.45, 6.3, .2, -.11, 1615)],
    [A.s11e, c(.85, 2.45, 6.3, .2, -.11, 1630)],
    [A.s13 + 2.0, cv([2.2, 1.9, 7.4], 1750)],                              // 6.09 the card (held while it is read)
    [A.s13e - 1.8, cv([2.2, 1.9, 7.4], 1765)],
    [A.s15 + 2.0, yv([4.6, 1.95, 9.0], 1900)],                             // 6.10 your place (a turn and a step)
    [A.b2 - .2, yv([4.6, 1.95, 9.0], 1880)],                               // 6.11 held; then the rise curves round you
  ];
  const LAMP = [5.5, 19], GLOBE = [LAMP[0], 6.4 - .07, LAMP[1]];
  const P0 = CAM[CAM.length - 1], P1 = c(GLOBE[0], GLOBE[1], GLOBE[2] - .23, 0, 0, 1600), PC = { x: 6.5, y: 3.5, z: 11.4 };
  // the remaining distance to the globe shrinks (partly) exponentially: no rush at the end; the look turns over most of the way
  const DR = .23 / Math.hypot(P0[1].x - P1.x, P0[1].y - P1.y, P0[1].z - P1.z);
  function rise(t) {
    const v = sm(lin(P0[0], A.end - .3, t)), u = .5 * v + .5 * (1 - Math.pow(DR, v)) / (1 - DR), a = P0[1];
    const q = (k) => (1 - u) * (1 - u) * a[k] + 2 * u * (1 - u) * PC[k] + u * u * P1[k];
    const x = q('x'), y = q('y'), z = q('z'), L = look([x, y, z], GLOBE), w = sm(lin(0, .75, v)), k = sm(lin(.75, 1, v));
    return { x, y, z, yaw: mix(mix(a.yaw, L.yaw, w), 0, k), pitch: mix(mix(a.pitch, L.pitch, w), 0, k), f: mix(a.f, P1.f, u) };
  }
  const drA = (t) => .02 * sm(lin(HI.b + 2, HI.b + 4.5, t));
  const cam = (t) => (t > P0[0] ? rise(t) : X.glide(t, CAM, { drift: drA(t) }));

  // ---------------------------------------------------------------- the frame
  function draw(ctx, t) {
    X.gcTick();
    const V = X.safeV(K.view3(cam(t)), LAMP), st = gym(t);
    X.hall(ctx, t, V, { mirror: (cx, VV) => drawGym(cx, t, VV, st, true) });
    // everything on the floor, far → near (camera depth)
    const items = DESKS.map((d) => ({ z: V.toCam([d.x + .3, .74, d.z])[2], f: () => drawDesk(ctx, V, d, t) }));
    for (const m of FORKS) items.push({ z: V.toCam(m.p)[2], f: () => X.machineAt(ctx, t, V, m.p, { fork: forkUp(m, t), forkOut: 1, load: m.load, armOut: 0, seed: m.seed }) });
    items.push({ z: V.toCam(K.YOU)[2] + .2, f: () => drawGym(ctx, t, V, st, false) });
    items.push({ z: V.toCam(RB)[2], f: () => { X.rollingBoard(ctx, t, V, RB, { content: rbContent, seed: 21 }); X.cardOn(ctx, t, V, CARD, { u: cardU(t), text: cardText }); } });
    items.filter((e) => e.z > -.5).sort((a, b) => b.z - a.z).forEach((e) => e.f());
    // the lamp we rise into: its globe is the light plate (drawn on top, the same circle hall() draws)
    const G = X.lampGlobe(V, LAMP[0], LAMP[1]);
    if (G) { ctx.save(); ctx.beginPath(); ctx.arc(G.x, G.y, G.r, 0, Math.PI * 2); ctx.clip(); HO.plate(ctx, t); ctx.restore(); }
    // the source tag (held still while it is read)
    const su = Math.min(lin(A.s4a - .4, A.s4a + .3, t), 1 - lin(A.s7, A.s7 + .4, t));
    if (su > 0) K.tag(ctx, 'ANTHROPIC (MAKER OF CLAUDE)  ·  STUDY  ·  JAN 2026  ·  PREPRINT', 72, 96, { u: su });
  }

  return [{
    t: HI.b, tr: 'cut', d: .1, draw, print: PRINT,
    sound: [
      { f: 'brass_click', t: A.s2e - .1, v: .35 }, { f: 'chime', t: A.s6 + .1, v: .35 }, { f: 'chalk', t: A.s7 + .3, v: .4 }, { f: 'chalk', t: A.s9u, v: .35 },
      { f: 'chalk', t: A.s10s, v: .35 }, { f: 'paper_slide', t: A.s13, v: .35 }, { f: 'brass_click', t: tb + 1.2, v: .5 }, { f: 'whoosh_airy', t: A.end - 1.4, v: .3 },
    ],
  }, { t: A.end - .22, tr: 'cut', d: .1, draw, print: HO.print }];   // the last frames are the globe = the plate: switch to the plate's finish there
};
