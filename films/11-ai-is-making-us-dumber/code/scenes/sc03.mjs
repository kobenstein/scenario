// c03 · Why you don't notice (02a + 02b), plate mirror → plate light (sun). ONE continuous take in the gym of light, no cut.
// Shot list: /mnt/project-files/scenario/film-klueger/bild/shots.md §4 (3.01–3.10). Anchors are VO phrases (T.S / T.E on '02a' / '02b').
//
//  shot  anchor                                     image                                                         the one movement
//  3.01  start … "Not necessarily."                 pull back out of the mirror (the reflection of a window in the    the pull-out, then the
//                                                   glass): you at the mirror, thin arms; your reflection swells      reflection swells
//  3.02  "In early twenty twenty-five … without."   sixteen programmers at two rows of desks along the mirror, piles  the camera backs along the
//                                                   of their own papers, desk machines on every other desk; tag METR   rows
//  3.03  "Before they started … faster."            the camera turns to the mobile slate: a chalk clock; its hand      the hand
//                                                   sweeps a short dashed arc (expected)
//  3.04  "With the tools … nineteen percent longer." the hand sweeps on: the long arc, "+19 %"                         the hand
//  3.05  "And here's the strange part … sped up."   in the mirror, the slate's reflection shows a short arc (felt)     the reflected arc
//  3.06  "They felt faster. They were slower."       ★ both clocks in one frame: mirror (felt) / slate (were), labels   the labels
//  3.07  "One small study … critical thinking"       a brass balance on a gym box: TRUST rises, THINKING sinks; tag CHI  the balance
//  3.08  "The writer Ted Chiang … weight room."      the camera arrives at the quote card pinned on the slate            camera only
//  3.09  "The weights go up … stay the same."        the forks lift a whole crate of weights high; your arms stay thin,  the lift
//                                                   your reflection glows broad ("feels like progress")
//  3.10  02b "So is this simply … weaker?"           the shadow of a far bigger machine slides over the floor; the       the shadow, then the tilt
//                                                   camera tilts down into a sun patch → plate light (sun) (c03>c04)
// New places: the programmer rows PROG (x 7.95/9.7, z 4.3…12.35), the slate here at SLATE3 (9.3, 13.6)
// just beyond the rows by the glass (its reflection is the felt clock), the balance BAL (7.0, 13.4); you train at the rack here (YOU + 4.4 m in z).
import { W, H, rgba, clamp, lin, mix, sm, eio, eout } from '../engine.mjs';
import * as K from '../lib/f11_kit.mjs';
import * as Wd from '../lib/f11_c02_world.mjs';
import * as P3 from '../lib/f11_c03_props.mjs';
import { handsOf, plate } from '../lib/handoff4.mjs';

const PRINT = { riso: .25 };
const YOU_DZ = 4.4;
export const SLATE3 = [9.3, 0, 13.6];
export const BAL = [7.35, 0, 13.15];

export default async (T, R) => {
  await K.studentsPrepare();
  const { in: HI, out: HO } = handsOf('c03', T);
  const S = (p, n) => T.S('02a', p, n), E = (p, n) => T.E('02a', p, n), Sb = (p) => T.S('02b', p), Eb = (p) => T.E('02b', p);
  const A = {
    start: HI.b, s1: S('Not necessarily'), s1e: E('Not necessarily'), s2: S('In early'), sixteen: S('sixteen'), s2b: S('Sometimes with'), s3: S('Before they'), faster: S('faster'),
    s4: S('With the tools'), slower: S('slower'), s4b: S('They took'), nineteen: S('nineteen'), s5: S('And here'), s5b: S('Afterwards'), sped: S('sped'),
    s6: S('They felt'), s6b: S('They were'), s7: S('One small'), s7b: S('But a survey'), trusted: S('trusted'), less: S('the less'), s7e: E('they did'),
    s8: S('The writer'), s8b: S('Using a chatbot'), s8e: E('weight room'), s9: S('The weights'), s10: S('It even'), s11: S('But your arms'), s11e: E('stay the same'),
    b1: Sb('So is this'), b2: Sb('Do we'), b2e: Eb('weaker'), end: HO.a,
  };

  // ---------------------------------------------------------------- the camera
  const F1 = { x: 5.9, y: 1.9, z: 14.6, yaw: .58, pitch: -.05, f: 1500 };            // 3.01 you + your reflection
  const F3 = { x: 6.8, y: 2.0, z: 6.5, yaw: .52, pitch: -.03, f: 1800 };            // 3.03–3.06 the slate (were) + its reflection (felt)
  const F4 = { x: 7.5, y: 1.8, z: 9.5, ...Wd.lookAt({ x: 7.5, y: 1.8, z: 9.5 }, [8.25, 1.3, 13.4]), f: 1850 };   // 3.07 the balance
  const CARD = [SLATE3[0], 1.55, SLATE3[2] - .02];   // the whole slate (clock, +19 %, the card)
  const F5 = { x: 8.95, y: 1.7, z: 10.7, ...Wd.lookAt({ x: 8.95, y: 1.7, z: 10.7 }, CARD), f: 1750 };                // 3.08 the card
  const YP = [K.YOU[0], 1.0, K.YOU[2] + YOU_DZ];
  // 3.09 ★ the lift: the camera cranes up over the slate (no lateral sweep) and looks down past its top edge at you
  const F6 = { x: 9.0, y: 3.3, z: 12.6, ...Wd.lookAt({ x: 9.0, y: 3.3, z: 12.6 }, [YP[0] + .1, 1.2, YP[2]]), f: 2400 };   // just above + in front of the slate's top: it stays below the frame
  const PATCH = P3.SUNC;
  const KEYS = [
    [A.s1e + 2.4, F1],
    [A.s2 + 2.8, { ...F1, x: 5.85, z: 14.4, f: 1490 }],
    [A.s2 + 5.0, { x: 4.7, y: 2.15, z: 11.4, yaw: .56, pitch: -.06, f: 1550 }],   // wide of the slate, so it enters far off
    [A.s2b + 1.0, F3],                                                            // one move: you → the rows + the slate (3.02 is in this frame)
    [A.s3 + 3.0, { ...F3, x: 6.79, z: 6.62, f: 1812 }],
    [A.s6b + .2, { ...F3, x: 6.78, z: 6.8, f: 1830 }],
    [A.s7b + 2.9, F4],
    [A.less + .2, { ...F4, z: 9.65, f: 1870 }],
    [A.s8b + .2, F5],
    [A.s8e - 2.6, { ...F5, z: 10.8, f: 1775 }],
    [A.s10 + .3, F6],
    [A.b1 + 1.2, { ...F6, y: 3.25, z: 12.7, f: 2380 }],
  ];
  // the fly-out of the reflected window (window 5 seen in the glass from F1)
  const WIN = K.WINDOWS[5], TG = [Wd.MX, (WIN.y0 + WIN.y1) / 2 + .2, WIN.z];
  const t0 = A.start, t1 = KEYS[0][0];
  const LEND = (() => { const u = .55, s = (10.6 - F1.x) / (TG[0] - F1.x); return { x: mix(F1.x, 10.6, u), y: mix(F1.y, F1.y + (TG[1] - F1.y) * s, u), z: mix(F1.z, F1.z + (TG[2] - F1.z) * s, u) }; })();
  const dEnd = Math.hypot(TG[0] - LEND.x, TG[1] - LEND.y, TG[2] - LEND.z);
  const CS = { ...LEND, ...Wd.lookAt(LEND, TG), f: 1.45 * 960 / (WIN.w / 2 / dEnd) };
  // the end: down into the sun patch (light plate). The patch fills the frame from straight above.
  const tTilt = A.b1 + 1.2, tEnd = A.end - .04;
  const CP = P3.SUNCAM;
  const LAST = KEYS[KEYS.length - 1][1];
  function cam(t) {
    if (t < t1) {
      const u = 1 - sm(lin(t0, t1, t)), c = Wd.flyCam(u, F1, CS, TG), lk = Wd.lookAt(c, TG), w = sm(lin(0, .55, u));
      return { ...c, yaw: mix(F1.yaw, lk.yaw, w), pitch: mix(F1.pitch, lk.pitch, w) };
    }
    if (t < tTilt) return Wd.glide(t, KEYS);
    const u = lin(tTilt, tEnd, t), e = u * u * (3 - 2 * u), c = Wd.flyCam(e, LAST, CP, PATCH);
    return c;
  }

  // ---------------------------------------------------------------- you, the machine, the crate (forklift)
  const tLift = A.s9 + .9;
  function gym(t) {
    const st = { ...Wd.FORK, dz: YOU_DZ, pose: { ...K.GYM.idle } };
    st.fork = .02 + .9 * eio(lin(tLift, tLift + 1.5, t));
    st.load = (c, tt) => P3.crate(c, tt, 0, 0, { glow: .12 + .2 * sm(lin(tLift, tLift + 1.5, t)) });
    st.loadDx = 18;
    // your reflection: thin at first, it swells after "Not necessarily" (the belief), and glows broader still at "feels like progress"
    st.refl = mix(.85, 1.35, eio(lin(A.s1 + .2, A.s1e + 1.4, t))) + .1 * eio(lin(A.s10, A.s10 + 1.2, t));
    st.pose.head = .14 * sm(lin(A.s11, A.s11 + .8, t));   // you look down at your arms: the same
    return st;
  }

  // ---------------------------------------------------------------- the slate (were) and its reflection (felt)
  const hand = (t) => P3.CLK.meas * eio(lin(A.slower - .5, A.nineteen + .3, t));
  const expU = (t) => eio(lin(A.faster - .7, A.faster + .5, t));
  function chalk(ctx, Sl, t) {
    const cx = 52, cy = 70, r = 42;
    P3.clockChalk(ctx, cx, cy, r, { base: 1, exp: expU(t), meas: hand(t) / P3.CLK.meas, hand: hand(t) });
    K.chalkText(ctx, 'expected', 70, 24, { size: 10, u: lin(A.faster + .4, A.faster + .9, t), col: '#cfe6f2' });
    K.chalkText(ctx, '+19 %', 95, 66, { size: 9.5, u: lin(A.nineteen + .3, A.nineteen + .8, t), col: K.PAL.effort });
    K.chalkText(ctx, 'were', cx, 132, { size: 14, align: 'center', u: lin(A.s6b, A.s6b + .5, t) });
    // the quote card pinned on the right half
    ctx.save(); ctx.translate(117, 15); P3.quoteCard(ctx, 108, 82, ['“Using ChatGPT to complete assignments', 'is like bringing a forklift into the', 'weight room; you will never improve', 'your cognitive fitness that way.”'], 'TED CHIANG  ·  THE NEW YORKER  ·  2024', { size: 5.1, top: 19, lead: 11.4, pad: 6 }); ctx.restore();
  }
  // the reflected slate: drawn readable (the mirror shows what they believed): the hand stops short, "felt"
  const feltU = (t) => eio(lin(A.sped - .3, A.sped + .9, t));
  function reflSlate(ctx, V, t) {
    const xr = 2 * K.MIRROR.x - SLATE3[0];
    const hw = Wd.SLATE.w / 200, y0 = Wd.SLATE.y0, y1 = y0 + Wd.SLATE.h / 100, z = SLATE3[2];
    // stand + frame + slate, as the real one (mirrored position)
    const q = [[xr - hw, y0, z], [xr + hw, y0, z], [xr + hw, y1, z], [xr - hw, y1, z]];
    if (V.poly(ctx, [[xr - hw - .07, y0 - .07, z + .004], [xr + hw + .07, y0 - .07, z + .004], [xr + hw + .07, y1 + .07, z + .004], [xr - hw - .07, y1 + .07, z + .004]])) { ctx.fillStyle = K.PAL.frame; ctx.fill(); }
    for (const sx of [xr - hw - .02, xr + hw + .02]) { const a = V.P([sx, .12, z + .02]), b = V.P([sx, y1 + .12, z + .02]); if (a.z > .2) { ctx.strokeStyle = '#8a5d3b'; ctx.lineWidth = Math.max(1.5, a.k * .06); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); } }
    if (!V.poly(ctx, q)) return; ctx.fillStyle = K.PAL.slate; ctx.fill();
    const F = K.wallFrame(V, xr - hw, y1, z - .001, 100); if (!F) return;
    ctx.save(); V.poly(ctx, q); ctx.clip(); ctx.transform(F.a, F.b, F.c, F.d, F.e, F.f);
    // the card is seen from behind in the reflection's logic: a pale paper rectangle on the left
    ctx.fillStyle = '#e9dcc2'; ctx.fillRect(15, 15, 108, 82);
    const cx = 188, cy = 70, r = 42, fu = feltU(t);
    P3.clockChalk(ctx, cx, cy, r, { base: 1, exp: fu, expA: P3.CLK.felt, hand: P3.CLK.felt * fu });
    K.chalkText(ctx, 'felt', cx, 132, { size: 14, align: 'center', u: lin(A.s6, A.s6 + .5, t), col: '#cfe6f2' });
    ctx.restore();
  }

  // ---------------------------------------------------------------- the balance, the shadow
  const tilt = (t) => eio(lin(A.trusted - .2, A.less + 1.2, t));
  const shadowU = (t) => lin(A.b1 - 3.3, A.b1 + 3.1, t);   // the shadow crosses you (x 9) at about b1 + 2

  function draw(ctx, t) {
    const V = Wd.safeView(K.view3(cam(t))), st = gym(t);
    if (V.f > 6000) { ctx.fillStyle = K.PAL.mirror; ctx.fillRect(0, 0, W, H); Wd.mirrorOverlay(ctx, t, V, {}); return; }
    K.hall(ctx, t, V, { board: (c, Bd) => Wd.board01(c, Bd), go: (c, VV) => Wd.go01(c, VV, t) });
    P3.sunPlatePatch(ctx, t, V);
    P3.bigShadow(ctx, V, shadowU(t), { z: 19.2, a: .32 });
    Wd.mirrorOverlay(ctx, t, V, { actors: (c, VV) => { reflSlate(c, VV, t); P3.programmers(c, t, VV, { mirror: true }); Wd.drawGym(c, t, VV, st, true); } });
    Wd.rack(ctx, t, V, { dust: 2 });
    Wd.drawGym(ctx, t, V, st, false);
    P3.programmers(ctx, t, V, { live: new Set(['B0', 'B1', 'A0']) });
    Wd.slate(ctx, t, V, SLATE3, { chalk });
    P3.balance(ctx, t, V, BAL, { tilt: tilt(t) });
    // tags
    const u1 = Math.min(lin(A.s2 + .6, A.s2 + 1.2, t), 1 - lin(A.s3 + .2, A.s3 + .6, t));
    if (u1 > 0) K.tag(ctx, 'METR  ·  RANDOMIZED STUDY  ·  EARLY 2025', 72, 96, { u: u1 });
    const u2 = Math.min(lin(A.s7b + .4, A.s7b + 1.0, t), 1 - lin(A.s8, A.s8 + .4, t));
    if (u2 > 0) K.tag(ctx, 'MICROSOFT RESEARCH + CARNEGIE MELLON  ·  SURVEY  ·  CHI 2025', 72, 96, { u: u2 });
  }

  return [
    { t: HI.b, tr: 'cut', d: .1, draw, print: PRINT,
      sound: [
        { f: 'whoosh_airy', t: A.start + .1, v: .2 }, { f: 'chalk', t: A.faster - .3, v: .35 }, { f: 'chalk', t: A.nineteen, v: .35 },
        { f: 'glass_ticks', t: A.sped - .2, v: .25 }, { f: 'clink', t: A.less + .3, v: .3 }, { f: 'brass_click', t: tLift, v: .45 },
        { f: 'rumble', t: A.b1, v: .25 },
      ] },
    // the light plate's print (riso .2, halftone .5) from the start of the tilt: a 1 px shift hidden in the move
    { t: tTilt + 1.0, tr: 'cut', d: .1, draw, print: HO.print },
  ];
};
