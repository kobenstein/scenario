// c07 · the world of have-to: geometry, time and light shared by the hall (lib/v2_c07_hall.mjs), the hero's escalator, its landing and
// the hero (lib/v2_c07_e0.mjs) and the void after the hall has gone (lib/v2_c07_void.mjs).
// World: metres, x right, y up, z toward the camera. A barrel-vaulted iron-and-glass station hall 116 m wide (x ±58), springing at 44 m,
// crown 74 m, iron ribs every 16 m (z 56 … -72), the end wall at z = -88 (the time-card rack of 1.01 under a giant station clock),
// galleries at 12 / 24 / 36 m along both side walls (front edge at x ±52). Escalators run along x in planes z = const (30°, R m high).
// E0 is the hero's: from the floor at x -31.18 up to the landing bridge at 36 m (to the right gallery).
// Light: the hall is dark (the c06>c07 plate's ground) and its bays switch on one after another from the rail outward (7.01); in 7.03 they
// go dark again from the far end toward the hero (their engraved lines turn to dotted ghost lines and drift off as smoke).
import { clamp, mix, prng } from '../engine.mjs';
import { TAU, sstep, mixHex } from './v2_c07_kit.mjs';

export const T30 = Math.tan(Math.PI / 6), C30 = Math.cos(Math.PI / 6), RAILH = .95, SKIRT = .14, TRUSS = 1.3, A = 1.6, F = 1300, HW = .78;
export const STRIP = RAILH - .1;   // the lit strip under the handrail (the plate's line)
export const STEP = .4;            // step pitch along x on the incline (m)
export const HALL = { X: 58, spring: 44, crown: 74, ribs: [56, 40, 24, 8, -8, -24, -40, -56, -72], end: -88, levels: [12, 24, 36], gx: 52 };
// cold steel blue; amber only in the clock faces; the morning (7.02) a pale warm white
export const COL = {
  void: '#0a0c22', amber: '#ffb35c', core: '#fff1d6', lamp: '#eef3ff', haze: '#2c3962', rim: '#aabfe8', morning: '#fff1dc',
  iron: '#0b1020', ironHi: '#a3b6e0', stone: '#121a32', floor: '#0f162c', clad: '#0d1327', glass: '#9fbbe6', cyan: '#5fe3f0',
};

// ---------------------------------------------------------------- escalators (z = centre plane; d = +1 rises toward +x; mv = +1 runs up)
export const ESC = [
  { id: 'E0', z: 1.4, xb: -31.18, yb: 0, R: 36, d: 1, mv: 1, seed: 11, n: 58 },
  { id: 'E0b', z: -1.4, xb: -31.18, yb: 0, R: 36, d: 1, mv: -1, seed: 12, n: 50 },
  { id: 'E0c', z: -4.2, xb: -31.18, yb: 0, R: 36, d: 1, mv: 1, seed: 17, n: 54 },
  { id: 'E1', z: -29.2, xb: 31.18, yb: 0, R: 36, d: -1, mv: 1, seed: 13, n: 54 },
  { id: 'E1b', z: -32, xb: 31.18, yb: 0, R: 36, d: -1, mv: -1, seed: 14, n: 44 },
  { id: 'E2', z: -61.2, xb: -46, yb: 12, R: 24, d: 1, mv: 1, seed: 15, n: 36 },
  { id: 'E2b', z: -64, xb: -46, yb: 12, R: 24, d: 1, mv: -1, seed: 16, n: 30 },
  { id: 'E3', z: -61.2, xb: 46, yb: 12, R: 24, d: -1, mv: 1, seed: 18, n: 34 },
];
const GEO = new Map();
// along-track coordinate s (horizontal metres from the foot of the incline): yN(s) is the height of the step noses, with parabolic
// blends of length 2A at the bottom and the top; s0 / s1 are the ends of the balustrade (newels), bot / top the flat ends of the incline
export function geo(e) {
  if (GEO.has(e)) return GEO.get(e);
  const run = e.R / T30;
  const yN = (s) => (s < -A ? 0 : s < A ? T30 * (s + A) ** 2 / (4 * A) : s < run - A ? T30 * s : s < run + A ? e.R - T30 * (run + A - s) ** 2 / (4 * A) : e.R);
  const g = { run, yN, X: (s) => e.xb + e.d * s, Y: (s) => e.yb + yN(s), s0: -A - 1.4, s1: run + A + 1.4, top: run + A, bot: -A, comb: run + A + .62 };
  GEO.set(e, g); return g;
}
export const E0 = ESC[0];
// E0's landing: the comb plate, then a deck at 36 m that becomes the bridge over to the right gallery (front face toward the camera)
export const BR0 = { x0: geo(E0).X(geo(E0).top) - .05, x1: HALL.gx, y: 36, z0: -5.6, z1: E0.z + HW + .25, deep: 1.25 };

// ---------------------------------------------------------------- time: the machine starts with the light and stops on "ends"
export const VMAX = .75;   // step speed along the incline (m/s)
function intS(t, a, d) { if (t <= a) return 0; const u = (t - a) / d; return u >= 1 ? d / 2 + (t - a - d) : d * (u ** 3 - u ** 4 / 2); }
// horizontal metres a step has been carried since the hall woke (smooth start, smooth stop)
export function runDist(t, K) { return VMAX * C30 * (intS(t, K.hb + .2, 1.1) - intS(t, K.stop, .8)); }

// ---------------------------------------------------------------- the hero ("you"): rides E0 to the top, one step off, stands bowed
export const HERO = { s0: 0, seed: 7, dress: { coat: '#3b4763', pants: '#1a1b2e', shoes: '#0c0c16', skin: '#d9b08e', hair: '#2a1d1a' }, scarf: '#c8843a' };
export const STEPOFF = { dur: .8, len: .78 };
export function heroPath(t, K) {
  const g = geo(E0), sTop = g.top + .3;
  const s = sTop + (runDist(t, K) - runDist(K.top, K));
  if (t <= K.top) return { s, x: g.X(s), y: E0.yb + g.yN(s), step: 0, carried: true };
  const u = clamp((t - K.top) / STEPOFF.dur), e = u - Math.sin(u * TAU) / TAU;   // one step: the body moves on with the stride
  const st = sTop + STEPOFF.len * e;
  return { s: st, x: g.X(st), y: E0.yb + E0.R, step: u, carried: false };
}
export const heroX = (K) => geo(E0).X(geo(E0).top + .3 + STEPOFF.len);   // where the hero stands after the step
export function worldInit(K) { HERO.s0 = geo(E0).top + .3 - runDist(K.top, K); RIDERS.clear(); }

// ---------------------------------------------------------------- light: bays switch on from the rail outward, go dark from the far end
export const BAYS = [[56, 70], [40, 56], [24, 40], [8, 24], [-8, 8], [-24, -8], [-40, -24], [-56, -40], [-72, -56], [-88, -72]];
export const rankOf = (z) => (z <= HALL.end + .5 ? 6 : Math.round(Math.abs(z) / 16));
export const onTime = (z, K) => K.hb + .32 + .33 * rankOf(z);
const switchOn = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : 1 - (1 - u) ** 3);
// light of the hall at depth z: 0 dark (the plate's ground) .. 1 lit
export function secLight(z, t, K) { const on = onTime(z, K); return switchOn((t - on) / .36) * (1 - goneAt(z, t, K)); }
// 7.03: the dark runs from the far end toward the hero; disTime(z) = when the bay at z goes dark
export function disTime(z, K) { return K.dis0 + 2.3 * Math.pow(clamp(1 - Math.abs(z - E0.z) / 92), 1.1); }
export function goneAt(z, t, K) { if (!K.dis0) return 0; const d = disTime(z, K); return sstep(d, d + .45, t); }
// E0 itself goes from its foot upward; only the top (the last steps, the comb, the landing) stays: the fragment of 7.04
export const KEEP = { s: () => geo(E0).top - 2.6, x1: () => BR0.x0 + 2.6 };
export function e0Gone(s, t, K) { if (!K.dis0) return 0; const g = geo(E0), u = clamp((s - g.s0) / (KEEP.s() - g.s0)), d = K.dis0 + .9 + 1.5 * u; return s >= KEEP.s() ? 0 : sstep(d, d + .45, t); }
// E0 and its landing: switched on with the plate line (just after H.b); after the dissolve has passed the hero's bay only the fragment
// stays, dim (the hall's light is gone; the phone and later the dawn light it)
export const e0On = (t, K) => sstep(K.hb + .25, K.hb + .75, t);
export const e0Hall = (t, K) => e0On(t, K) * (1 - goneAt(E0.z, t, K));            // riders, the rest of the landing bridge
export const fragDim = (t, K) => (K.dis0 ? 1 - .7 * sstep(disTime(E0.z, K) - .1, disTime(E0.z, K) + .7, t) : 1);
export const e0Frag = (t, K) => e0On(t, K) * fragDim(t, K);                         // the fragment: E0's last steps, the comb, the landing
export const stripOn = (t, K) => (K.dis0 ? 1 - sstep(disTime(E0.z, K) - .1, disTime(E0.z, K) + .5, t) : 1);
// the morning: a pale light through the high east windows onto E0's landing (7.02), gone with the hall (7.03)
export function morningAt(t, K) { return sstep(K.top - 1.2, K.top + 1.4, t) * (1 - sstep(K.dis0 + 1.6, K.dis0 + 2.6, t)); }

// ---------------------------------------------------------------- depth: far things take the colour of the lit air
export const fogK = (depth) => .62 * (1 - Math.exp(-Math.max(0, depth - 10) / 90));
export const fogC = (hex, depth, k = 1) => mixHex(hex, COL.haze, fogK(depth) * k);

// ---------------------------------------------------------------- riders: they stand on the steps; at the ends they walk on and off
const RIDERS = new Map();
export function riders(e) {
  if (RIDERS.has(e)) return RIDERS.get(e);
  const g = geo(e), r = prng(e.seed * 97), out = [], len = g.top - g.bot;
  for (let i = 0; i < e.n; i++) {
    const s0 = g.bot + (i + .3 + r() * .5) / e.n * len;
    const o = { s0, seed: e.seed * 31 + i, col: ['#1b2036', '#232a45', '#171b2e', '#262d47', '#1d2238'][Math.floor(r() * 5)], arm: .3 + r() * .2, coat: r() < .5, hair: ['short', 'long', 'bun', 'short', 'grey', 'curly'][Math.floor(r() * 6)], bulk: .9 + r() * .2, stop: e === E0 ? 13 + r() * 7 : 2 + r() * 8, dz: (r() - .5) * .5 };
    if (e === E0 && Math.abs(s0 - HERO.s0) < 1.5) continue;
    out.push(o);
  }
  for (let i = 0; i < 6; i++) out.push({ s0: e.mv > 0 ? g.bot - 1.5 - i * 2.4 - r() : g.top + 1.5 + i * 2.4 + r(), walker: true, seed: e.seed * 31 + 50 + i, col: '#1e243c', arm: .5, coat: r() < .5, hair: 'short', bulk: 1, stop: 3 + r() * 8, dz: (r() - .5) * .5 });
  RIDERS.set(e, out); return out;
}
// where a rider is: riding (carried), walking on / off (real gait) or standing
export function riderAt(rd, e, t, K) {
  const g = geo(e), dist = runDist(t, K) * e.mv, t0 = K.hb;
  if (rd.walker) {
    const sB = e.mv > 0 ? g.bot - .3 : g.top + .3, toGo = Math.abs(sB - rd.s0), tB = t0 + toGo / 1.2;
    if (t < tB) { const s = rd.s0 + Math.sign(sB - rd.s0) * 1.2 * (t - t0); return { s, mode: 'walk', ph: Math.abs(s) / 1.45 * TAU }; }
    return { s: sB + (dist - runDist(tB, K) * e.mv), mode: 'ride' };
  }
  const s = rd.s0 + dist, off = e.mv > 0 ? g.top + .3 : g.bot - .3;
  if ((e.mv > 0 && s > off) || (e.mv < 0 && s < off)) {
    let lo = t0, hi = t; for (let i = 0; i < 22; i++) { const m = (lo + hi) / 2; if ((rd.s0 + runDist(m, K) * e.mv - off) * e.mv > 0) hi = m; else lo = m; }
    const wd = Math.min(rd.stop, 1.25 * (t - hi)), sw = off + e.mv * wd;
    return { s: sw, mode: wd >= rd.stop - 1e-3 ? 'stand' : 'walk', ph: wd / 1.45 * TAU };
  }
  return { s, mode: 'ride' };
}
