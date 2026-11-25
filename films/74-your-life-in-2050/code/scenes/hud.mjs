// HUD of film 74: the day clock (MONDAY · 8:10 AM → 7:30 PM) and the counter GONE 1 … 9 (text-v2 Einblendungen), top left, persistent across
// every carrier. Anchored on rows of docs/shots.md. Hidden at 0:00–0:09 (hook title), during the clips and the space rows, and in the end screen.
import { span, clamp } from '../lib/f74_kit.mjs';
const CLOCK = [['H.06', 'MONDAY · 8:10 AM'], ['2.01', 'MONDAY · 9:00 AM'], ['3.01', 'MONDAY · 9:30 AM'], ['4.01', 'MONDAY · 11:00 AM'], ['5.03', 'MONDAY · 12:00 NOON'],
  ['6.01', 'MONDAY · 1:00 PM'], ['6.08', 'MONDAY · 2:00 PM'], ['8.01', 'MONDAY · 4:00 PM'], ['9.01', 'MONDAY · 6:00 PM'], ['P.03', 'MONDAY · 7:30 PM']];
const GONE = [['H.11', 1, 'THE ALARM CLOCK'], ['H.19', 2, 'PARKED CARS'], ['2.07', 2, 'PARKED CARS · ROAD DEATHS'],
  ['3.05', 3, 'WAITING WEEKS FOR A REPAIR'], ['4.01', 4, 'THE POWER BILL'], ['5.09', 5, 'FEAR OF THE END OF THE MONTH'], ['6.01', 6, 'THE CLASSROOM'],
  ['7.03', 7, 'THE WAITING ROOM · HEALTH INSURANCE'], ['8.03', 8, '"THAT WILL TAKE DECADES"'], ['9.01', 9, 'FIELDS TO THE HORIZON']];
export const GONE_LINES = ['THE ALARM CLOCK · HAVING TO WORK', 'PARKED CARS · ROAD DEATHS', 'WAITING WEEKS FOR A REPAIR', 'THE POWER BILL', 'FEAR OF THE END OF THE MONTH',
  'THE CLASSROOM', 'THE WAITING ROOM · HEALTH INSURANCE', '"THAT WILL TAKE DECADES"', 'FIELDS TO THE HORIZON'];
const PEEK = [['1.15', 'MONDAY · 12:00 NOON']];   // the corner clock twitches forward and back
// the hour as a number (drives the sky: K.hourLook(hourAt(R, t)))
const HOURS = [['H.01', 8.2], ['H.06', 8.2], ['2.01', 9], ['3.01', 9.5], ['4.01', 11], ['5.03', 12], ['6.01', 13], ['6.08', 14], ['8.01', 16], ['8.20', 17.6], ['9.01', 18.2], ['P.01', 19.1], ['P.03', 19.5], ['E.19', 19.8]];
export function hourAt(R, t) {
  const H = HOURS.map(([id, h]) => [R[id] ?? 0, h]);
  if (t <= H[0][0]) return H[0][1];
  for (let i = 0; i < H.length - 1; i++) if (t < H[i + 1][0]) { const u = clamp((t - H[i][0]) / Math.max(1, H[i + 1][0] - H[i][0])); return H[i][1] + (H[i + 1][1] - H[i][1]) * u; }
  return H[H.length - 1][1];
}
let EV = null;
export function hudState(T, R, t) {
  if (!EV) EV = { clock: CLOCK.map(([id, s]) => [R[id], s]), gone: GONE.map(([id, n, s]) => [R[id], n, s]).sort((a, b) => a[0] - b[0]) };
  const hide = [[-1, R['H.06'] - .6], ...['C3', 'C4', 'C1', 'C6'].filter((c) => T.clip(c)).map((c) => [T.clip(c).start - .4, T.clip(c).end + .2]), [R['H.14'] - .1, R['H.15'] - .3], [R['8.11'] - .3, R['8.17'] - .2], [R['E.05'] - .3, R['E.12'] - .2], [R['END'] - 1, 1e9]];
  let a = 1; for (const [x, y] of hide) a = Math.min(a, 1 - clamp(span(t, x, x + .5) - span(t, y, y + .6)));
  if (a <= 0) return null;
  let clock = null, clockU = 1; for (const [t0, s] of EV.clock) if (t >= t0 - .2) { clock = s; clockU = span(t, t0 - .2, t0 + .5); }
  for (const [id, str] of PEEK) { const t0 = R[id] + .3, t1 = t0 + 1.3; if (t >= t0 && t < t1 + .5) { if (t < t1) { clock = str; clockU = span(t, t0, t0 + .35); } else clockU = span(t, t1, t1 + .35); } }
  let n = 0, line = null, nU = 1, lineU = 1, lastN = 0;
  for (const [t0, k, s] of EV.gone) if (t >= t0) { if (k !== lastN) nU = span(t, t0, t0 + .6); lastN = k; n = k; line = s; lineU = span(t, t0 + .15, t0 + .75); }
  return { a, clock, clockU, n, nU, line, lineU };
}
