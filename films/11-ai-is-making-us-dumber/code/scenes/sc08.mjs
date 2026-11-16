// c08 · Twenty thirty-five, twice (07a + 08a), plate sky (dusk) → plate light (dusk: one lit pane of the hall). Builder: c07/c08/c10.
// ONE continuous take, no cut. The same city as c07 (lib/f11_c07_city.mjs): the river behind the hall, the same houses on both banks.
//
//  shot  anchor (07a / 08a)                         image                                                        the one movement
//  8.01  "Let's imagine twenty thirty-five. Twice."  tilt down from the dusk sky: the river, the same city on both     the tilt (tag 2035)
//                                                   banks, mirror images
//  8.02  "In the first version, answers…"           the right bank, low and oblique: in window after window the forks  descend to the bank, then a
//                                                   hold the weight, people sit; only a few windows bright (a luxury)  slow drift
//  8.03  "In the second version, every machine…"    across the river to the left bank: hands of light on backs,        the crossing, then a hold
//                                                   people curl; children at desks with small machines (asks why)
//  8.04  "Both cities run on the same machines…"    pull up over the left bank: both cities to the horizon, the river  the pull up, then a hold
//                                                   between them
//  8.05  "So what can you do, starting tomorrow?"   one push from there, over the school, into one lit pane of the     the push → plate light (dusk)
//                                                   hall's window wall
// Dusk throughout (env.dusk = 1: rose and gold, never night). Ruhe: lib camSmooth keys, one thing moves at a time.
import { W, H, rgba, clamp, lin, mix, sm, eio, eout } from '../engine.mjs';
import * as K from '../lib/f11_kit.mjs';
import * as C from '../lib/f11_c07_city.mjs';
import * as RM from '../lib/f11_c07_rooms.mjs';
import { handsOf, plate } from '../lib/handoff4.mjs';

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c08', T);
  const S = (p, n) => T.S('07a', p, n), E = (p, n) => T.E('07a', p, n), Sb = (p) => T.S('08a', p);
  const A = {
    s1: S('Let'), s1t: S('Twice'), s2: S('In the first'), s2f: S('Everyone has'), s2l: S('Thinking for'), s2n: S('Most people'), s2e: E('never notice'),
    s3: S('In the second'), s3s: S('Schools'), s3g: S('A generation'), s3m: S('And it becomes'), s3e: E('has ever been'),
    s4: S('Both cities'), s4d: S('The difference'), s4e: E('right now'), b1: Sb('So what'), b2: Sb('And who'),
    start: HI.b, end: HO.a,
  };
  const P = C.PLAN;
  const look = (p, L, f) => C.lookAt(p, L, f);

  // ---------------------------------------------------------------- the camera
  const C0 = { x: 0, y: 30, z: 58, yaw: 0, pitch: C.SKYREF.pitch, f: C.SKYREF.f };   // the sky plate (SKYREF): only sky in the frame
  // the pane we push into at the end: hall window 3 (z 21.5), middle column, second row
  const PW = 3, PC = 1, PR = 1, Wn = K.WINDOWS[PW], ph = (Wn.y1 - Wn.y0) / 4, PY = Wn.y0 + (PR + .5) * ph, PZ = Wn.z - Wn.w / 2 + (PC + .5) * Wn.w / 3;
  // calm: five moves, each followed by a hold with a slow drift (the moves are long and eased; the holds carry the sentences)
  const KEYS = [
    [A.start, C0],
    [A.s1t + .6, { x: 0, y: 24, z: 62, yaw: 0, pitch: -.16, f: 1450 }],                    // 8.01 both banks
    [A.s2 + .5, { x: 0, y: 23.9, z: 62.3, yaw: 0, pitch: -.16, f: 1452 }],
    [A.s2f + 2.3, look([11, 6.6, 70], [22, 5.4, 82], 1500)],                            // 8.02 the forklift bank (right), low and oblique
    [A.s2e, look([11.25, 6.56, 70.6], [22, 5.4, 82.6], 1506)],
    [A.s3 + 5.6, look([-11, 6.6, 88], [-22, 5.4, 100], 1500)],                          // 8.03 across the river: the trainer bank (left)
    [A.s3e - .2, look([-11.3, 6.56, 88.8], [-22, 5.4, 100.8], 1550)],
    [A.s4 + 4.4, look([-30, 30, 52], [6, 0, 110], 1200)],                                // 8.04 pull up: both cities to the horizon
    [A.b1 - 1.3, look([-30.2, 30.15, 51.7], [6, 0, 110], 1206)],
  ];
  const PUSH0 = KEYS[KEYS.length - 1], P1 = { x: HALLX0() - .45, y: PY, z: PZ, yaw: Math.PI / 2, pitch: 0, f: 1500 };
  function HALLX0() { return C.HALLX.x0 - .02; }
  function cam(t) {
    if (t < PUSH0[0]) return C.aboveRoof(C.camSmooth(t, KEYS));
    // the push: log distance toward the pane, the view turning square onto the glass
    const a = PUSH0[1], u = clamp((t - PUSH0[0]) / (A.end - 1 / 30 - PUSH0[0])), e = u * u * (3 - 2 * u), turn = sm(clamp(e * 1.15));
    const d0 = Math.hypot(a.x - P1.x, a.y - P1.y, a.z - P1.z), D = Math.exp(mix(Math.log(d0), Math.log(.0001), e));
    const k = 1 - D / d0;   // 0 → 1 along the line
    return { x: mix(a.x, P1.x, k), y: mix(a.y, P1.y, k), z: mix(a.z, P1.z, k), yaw: mix(a.yaw, P1.yaw, turn), pitch: mix(a.pitch, P1.pitch, turn), f: mix(a.f, P1.f, k) };
  }

  // ---------------------------------------------------------------- windows: the forklift bank and the trainer bank
  function win(w, h, t) {
    const s = w.seed;
    if (h.cz < 56) return { glow: s < .6 ? .85 : .3, fig: null };   // around the hall: today
    if (h.x0 > 0) {   // right bank: the first version
      if (s < .08) return { glow: 1, fig: 'train', hand: 1, fork: 0 };
      return { glow: .32, fig: 'sit', fork: 1, hand: 0, dim: .35 };
    }
    // left bank: the second version (the bank c10 returns to) (children at desks asking why: their small machine's hand on the page)
    if (s < .26) return { glow: 1, fig: 'kid', cool: 1, hand: 1 };
    return { glow: 1, fig: 'train', fork: 0, hand: 1 };
  }
  function interior(ctx, V, w, h, t, info) {
    if (info.px > 70) { const st = win(w, h, t); if (st.fig) return RM.heroWindow(ctx, t, V, w, st); }
    return false;
  }

  function draw(ctx, t) {
    const c = cam(t), V = K.view3(c);
    C.cityFrame(ctx, t, V, {
      dusk: 1, win, interior, refYaw: 0, grow: (o) => (o.kind === 'tree' && Math.abs(Math.abs(o.x) - 16.5) < .1 && o.z > 60 && o.z < 136 ? 0 : 1),   // the near quay trees stand aside (the camera glides along the banks)
      sunGlow: t > A.s1 + 2.2 && t < A.b1 + 1.5,
      hall: { glow: 1, pane: { win: PW, c: PC, r: PR, fill: (cx, tt) => plate(cx, tt, 'light', { tone: 'dusk' }) } },
    });
    const tg = Math.min(lin(A.s1 + .8, A.s1 + 1.3, t), 1 - lin(A.s2 + 2.2, A.s2 + 2.6, t));
    if (tg > 0) K.tag(ctx, '2035', 72, 96, { u: tg, size: 22 });
    if (t >= A.end - 1 / 30 - 1e-6) plate(ctx, t, 'light', { tone: 'dusk' });
  }

  return [
    { t: HI.b, tr: 'cut', d: .1, draw, print: HI.print, sound: [{ f: 'whoosh_airy', t: A.start + .4, v: .25 }, { f: 'brass_click', t: A.s2f + .2, v: .35 }] },
    { t: A.s3 - 1.2, tr: 'cut', d: .1, draw, print: HO.print, sound: [{ f: 'chime', t: A.s3 + .3, v: .3 }, { f: 'glass_hum', t: A.s4 + .2, v: .25 }, { f: 'whoosh_airy', t: A.b1 - 1.0, v: .3 }] },
  ];
};
