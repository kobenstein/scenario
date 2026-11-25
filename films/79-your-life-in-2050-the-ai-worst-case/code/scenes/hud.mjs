// HUD of film 79 (mirror of #74): the day clock (MONDAY · 8:10 AM → evening, the same hours as #74) and the counter NOT NEEDED 1 … n
// (one line per station: what on this street no longer needs you), top left, persistent across every carrier. Anchored on rows of
// docs/shots.md; entries whose row does not exist (yet) are skipped, so the HUD runs on a partial shot list. Lines are PROVISIONAL (vo-v1);
// the final wording comes with vo-v2 (the way-out pass marks every line LOST / WON / OPEN, see docs/MOTION.md §6).
import { span, clamp } from '../lib/f79_kit.mjs';
export const CLOCK = [['H.08', 'MONDAY · 8:10 AM'],
  ['B.07', 'MONDAY · 8:40 AM'], ['B.09', 'MONDAY · 9:00 AM'], ['D.01', 'MONDAY · 9:30 AM'], ['D.17', 'MONDAY · 10:00 AM'], ['K.12', 'MONDAY · 11:59 AM'],   // B1 c02–c04
  ['N.01', 'MONDAY · 12:00 NOON'], ['G.05', 'MONDAY · 1:00 PM'], ['L.02', 'MONDAY · 2:00 PM'], ['L.08', 'MONDAY · 4:00 PM'],   // B2 c05–c07
  ['Q.02', 'MONDAY · 6:00 PM'], ['E.01', 'MONDAY · 7:30 PM'],   // B3 c08–c10
];   // + per station (v2): 9:00 · 9:30 · 10:00 (kitchen) · 12:00 NOON · 1 PM · 2 PM · 4 PM · 6 PM · 7:30 PM
export const COUNT = [['H.15', 1, 'THE ALARM CLOCK'],
  ['B.06', 2, 'YOUR WORK'], ['D.16', 3, 'THE BUILDING SITE'], ['K.11', 4, 'YOUR KITCHEN, FIRST'],   // B1 c02–c04
  ['N.29', 5, 'YOUR TAXES, YOUR VOTE'], ['G.14', 6, 'THE SCHOOL'], ['L.10', 7, 'THE FIELDS'],   // B2 c05–c07
  ['Q.14', 9, 'YOUR TIME'],   // B3 c08 (the ninth box of the hallway counter)
];   // + per station (v2)
const HOURS = [['H.01', 7.6], ['H.08', 8.2], ['H.17', 8.3],
  ['B.01', 8.3], ['B.09', 9.0], ['D.01', 9.5], ['D.17', 9.9], ['K.01', 10.0], ['K.12', 11.9],   // B1 c02–c04
  ['N.01', 12.0], ['G.03', 12.6], ['G.05', 13.0], ['L.02', 14.0], ['L.08', 16.0],   // B2 c05–c07
  ['Q.01', 17.6], ['Q.02', 18.0], ['Q.11', 18.6], ['Q.14', 19.0], ['E.01', 19.6], ['E.08', 20.6], ['W.28', 21],   // B3 c08–c10
];   // the hour drives the sky (K.hourLook); builders append their stations
export function hourAt(R, t) {
  const H = HOURS.filter(([id]) => R[id] != null).map(([id, h]) => [R[id], h]);
  if (!H.length || t <= H[0][0]) return H.length ? H[0][1] : 8.2;
  for (let i = 0; i < H.length - 1; i++) if (t < H[i + 1][0]) { const u = clamp((t - H[i][0]) / Math.max(1, H[i + 1][0] - H[i][0])); return H[i][1] + (H[i + 1][1] - H[i][1]) * u; }
  return H[H.length - 1][1];
}
export const HIDE = [['H.01', 'H.08', -.6], ['H.15', 'H.16', -.3],
  ['B.06', 'B.07', .3], ['D.08', 'D.12', -.3], ['K.11', 'K.12', -.4],   // B1 c02–c04: the big counter (YOUR WORK, YOUR KITCHEN, FIRST) shrinks into the HUD; the paper card over the C2 plate (D.08–D.11)
  ['G.01', 'G.03', -.5],   // B2 c06: the big half-full counter over the street at noon grows out of the HUD and goes back into it
  ['Q.12', 'Q.14', -.4], ['W.01', 'END'],   // B3: the big NOT NEEDED list (c08); the way out is 2026, no 2050 day clock (c10)
];   // [from row, to row]: hidden (title, the big counter in the hall); clips + end screen are added below
let EV = null;
export function hudState(T, R, t) {
  if (!EV) EV = { clock: CLOCK.filter(([id]) => R[id] != null).map(([id, s]) => [R[id], s]), count: COUNT.filter(([id]) => R[id] != null).map(([id, n, s]) => [R[id], n, s]).sort((a, b) => a[0] - b[0]) };
  const hide = [...HIDE.filter(([a, b]) => R[a] != null && R[b] != null).map(([a, b, d]) => [a === 'H.01' ? -1 : R[a] - .1, R[b] + (d ?? 0)]),
    ...['C1', 'C2', 'C3', 'C4', 'C5', 'R6'].filter((c) => T.clip(c)).map((c) => [T.clip(c).start - .4, T.clip(c).end + .2]), ...(R.END != null ? [[R.END - 1, 1e9]] : [])];
  let a = 1; for (const [x, y] of hide) a = Math.min(a, 1 - clamp(span(t, x, x + .5) - span(t, y, y + .6)));
  if (a <= 0) return null;
  let clock = null, clockU = 1; for (const [t0, s] of EV.clock) if (t >= t0 - .2) { clock = s; clockU = span(t, t0 - .2, t0 + .5); }
  let n = 0, line = null, nU = 1, lineU = 1, lastN = 0;
  for (const [t0, k, s] of EV.count) if (t >= t0) { if (k !== lastN) nU = span(t, t0, t0 + .6); lastN = k; n = k; line = s; lineU = span(t, t0 + .15, t0 + .75); }
  return { a, clock, clockU, n, nU, line, lineU, label: 'NOT NEEDED' };
}
