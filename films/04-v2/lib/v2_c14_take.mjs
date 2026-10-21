// c14 (Film 4 v2) · the one continuous take of the chunk: camera paths and the dispatcher that draws the right world at each t.
//   anchors(T, HI, HO) → A (all times, from the words)
//   take(ctx, t, A)    draws the frame (screen space, full frame)
// 14.01 sky → country (tilt down, the light waves, pull back) → the dive along one line of sight into the cottage's kitchen window,
// through the room, turning to look straight down on the table → 14.02–14.04 the banknote (top-down camera over it) → the flight
// into the oval → 14.05 the hill (lib/v2_c14_lake.mjs) up to VIEW H4.
import { W, H, clamp, mix } from '../engine.mjs';
import { cam, lookAt, qio, cio, sio, smo, smoother } from './v2_c14_util.mjs';
import { FL, P0, drawSky, drawLand, SLICES, COTTAGE, lightTime } from './v2_c14_land.mjs';
import { NOTEW, noteW, toLocal, drawCottage, drawRoom, drawTableTop, drawTableThings, noteAffine, HZ2, THK, NOTEL } from './v2_c14_kitchen.mjs';
import { drawPaper, drawInk, drawGlow, NW, NH } from './v2_c14_note.mjs';
import { lakeTimes, lnSigma, drawOval, ovalCovers, drawRise } from './v2_c14_lake.mjs';

export function anchors(T, HI, HO) {
  const w = (from, to, k) => T.W('06b', from, to)[k].s;
  const A = {
    hb: HI.b, ha: HO.a,
    now: T.S('06b', 'Now'), mul: T.S('06b', 'multiply'), every: T.S('06b', 'every'), kitchen: T.S('06b', 'kitchen'), table: T.S('06b', 'table'),
    earth: T.S('06b', 'Earth'), earthE: T.E('06b', 'Earth'), and: T.S('06b', 'And'), slowly: T.S('06b', 'slowly'),
    earns: T.S('06b', 'what earns'), respect: T.S('06b', 'respect'), starts: T.S('06b', 'starts'), change: T.S('06b', 'change'), changeE: T.E('06b', 'change'),
    not: T.S('06b', 'Not'), earn: w('you earn', 'you earn', 1), earnE: T.E('06b', 'you earn'),
    what: T.S('06b', 'What you give'), give: w('you give', 'you give', 1), giveE: T.E('06b', 'you give'),
    but: T.S('06b', 'But'), long: T.S('06b', 'long'), run: T.S('06b', 'run'), question: T.S('06b', 'question'), project: T.S('06b', 'project'),
    answer: T.S('06b', 'answer'), answerE: T.E('06b', 'answer'),
  };
  // the camera's schedule (derived from the words)
  A.tiltE = A.mul + .05;                 // the tilt from the sky lands just as "multiply" starts the light
  A.pullA = A.now + .2; A.pullB = A.earth;
  A.waveT0 = A.mul - .02;
  A.diveA = A.earth + .1; A.dive30 = A.and + .02; A.winT = A.and + .42; A.topT = A.slowly + .78;
  A.hKeys = [[A.topT, Math.log(.36), 0], [A.respect + .9, Math.log(.25), -.1], [A.earn - .25, Math.log(.195), -.06], [A.what - .2, Math.log(.19), -.05],
    [A.give + .12, Math.log(.075), 0], [A.but - .05, Math.log(.07), 0]];
  lakeTimes(A);
  return A;
}

// cubic Hermite through keys [t, value, slope]
function herm(K, t) {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 0; i < K.length - 1; i++) {
    const [t0, p0, m0] = K[i], [t1, p1, m1] = K[i + 1]; if (t > t1) continue;
    const h = t1 - t0, s = (t - t0) / h, s2 = s * s, s3 = s2 * s;
    return (2 * s3 - 3 * s2 + 1) * p0 + (s3 - 2 * s2 + s) * h * m0 + (-2 * s3 + 3 * s2) * p1 + (s3 - s2) * h * m1;
  }
  return K[K.length - 1][1];
}

// ---------------------------------------------------------------- 14.01: from the sky down onto the country, the pull back
const C1 = { x: -150, y: 560, z: 1000 }, C2 = { x: -360, y: 1300, z: 2300 };
const CEND = [C2.x, C2.y - 20, C2.z - 60];                     // where the pull back comes to rest
const LA = lookAt(CEND, NOTEW);                                 // …looking straight at the kitchen table
const PIT1 = -.25;
export function countryCam(t, A) {
  const e1 = qio((t - A.hb) / (A.tiltE - A.hb)), e2 = cio((t - A.pullA) / (A.pullB - A.pullA));
  const pitch = P0 + (PIT1 - P0) * e1 + (LA.pitch - PIT1) * e2;
  const fwd = 60 * sio((t - A.hb) / (A.tiltE + .4 - A.hb));
  return { x: mix(C1.x, C2.x, e2), y: mix(C1.y, C2.y, e2) - 20 * e1, z: mix(C1.z, C2.z, e2) - fwd, yaw: LA.yaw * e2, pitch: t <= A.hb ? P0 : pitch, F: FL };
}
const nightOf = (t, A) => .55 * smo((t - A.hb) / (A.earthE + .4 - A.hb));

// ---------------------------------------------------------------- the dive: one line of sight, log distance, turning down inside
const HDIR = (() => { const dx = CEND[0] - NOTEW[0], dz = CEND[2] - NOTEW[2], h = Math.hypot(dx, dz); return [dx / h, dz / h]; })();
const PHIL = Math.atan2(CEND[1] - NOTEW[1], Math.hypot(CEND[0] - NOTEW[0], CEND[2] - NOTEW[2]));
const D0 = Math.hypot(CEND[0] - NOTEW[0], CEND[1] - NOTEW[1], CEND[2] - NOTEW[2]);
const DIN = (() => {   // the distance at which the line crosses the inner face of the front wall
  const a = toLocal(NOTEW[0], NOTEW[1], NOTEW[2]), b = toLocal(NOTEW[0] + HDIR[0] * Math.cos(PHIL), NOTEW[1] + Math.sin(PHIL), NOTEW[2] + HDIR[1] * Math.cos(PHIL));
  return (HZ2 - THK - a[2]) / (b[2] - a[2]);
})();
const HTOP = .36;
function diveKeys(A) {
  return A._dk || (A._dk = [[A.diveA, Math.log(D0), 0], [A.dive30, Math.log(30), -6.2], [A.winT, Math.log(DIN), -2.6], [A.topT, Math.log(HTOP), 0]]);
}
function diveCam(t, A) {
  const lam = herm(diveKeys(A), t), D = Math.exp(lam), l0 = Math.log(DIN), l1 = Math.log(HTOP);
  const phi = lam >= l0 ? PHIL : PHIL + (Math.PI / 2 - PHIL) * smoother((l0 - lam) / (l0 - l1));
  const c = Math.cos(phi);
  return { x: NOTEW[0] + D * c * HDIR[0], y: NOTEW[1] + D * Math.sin(phi), z: NOTEW[2] + D * c * HDIR[1], yaw: LA.yaw, pitch: -phi, F: FL, near: .005 };
}
// the note's own heading: the camera turns slowly until the note lies level
const YAWN = (() => { const a = noteW(0, 0), b = noteW(NW, 0); return Math.atan2(b[2] - a[2], b[0] - a[0]); })();
function topCam(t, A) {
  let lnh;
  if (t <= A.fly0) lnh = herm(A.hKeys, t); else lnh = Math.log(.05654) - lnSigma(t, A);
  const yaw = mix(LA.yaw, YAWN, sio((t - A.topT) / (A.what - A.topT)));
  return { x: NOTEW[0], y: NOTEW[1] + Math.exp(lnh), z: NOTEW[2], yaw, pitch: -Math.PI / 2, F: FL, near: .002 };
}

// the cottage's window lights with the wave like every other
const COT = { X: COTTAGE.X, Z: COTTAGE.Z, wave: 0, jit: 0 };
const KBIN = (() => { let k = 0, best = 1e9; for (let i = 0; i < SLICES.length; i++) { const d = Math.abs(SLICES[i].Z - (COTTAGE.Z - 22)); if (d < best) { best = d; k = i; } } return k; })();

// ---------------------------------------------------------------- the note on the table, seen from straight above
function noteScene(ctx, t, A, P) {
  drawTableTop(ctx, t, P, smo((t - A.topT) / .5));
  drawTableThings(ctx, P);
  const M = noteAffine(P), ks = Math.hypot(M[0], M[1]);
  ctx.save(); ctx.setTransform(...M);
  ctx.fillStyle = 'rgba(24,12,6,.32)'; ctx.fillRect(5, 8, NW, NH);             // the paper's thin contact shadow
  drawPaper(ctx, t, A, ks);
  drawInk(ctx, t, A, ks);
  drawGlow(ctx, t, A);
  ctx.restore();
  drawOval(ctx, t, A, M);
  vignette(ctx, .42 * (1 - smo((t - A.s1) / .3)));
  return M;
}
// the lamp's falloff toward the frame's corners (grows in as the camera turns down to the table, gone once inside the picture)
function vignette(ctx, a) {
  if (a <= .005) return;
  const g = ctx.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, W * .62); g.addColorStop(0, 'rgba(20,10,6,0)'); g.addColorStop(1, `rgba(20,10,6,${a.toFixed(3)})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

export function take(ctx, t, A) {
  if (t < A.diveA) {
    const o = countryCam(t, A), P = cam(o), n = nightOf(t, A);
    drawSky(ctx, t, P, n);
    if (P.horizon < H + 140) drawLand(ctx, t, P, { n, wave: { t0: A.waveT0 }, target: cotTarget(t, A, n) });
    return;
  }
  if (t < A.topT) {
    const o = diveCam(t, A), P = cam(o), n = nightOf(t, A), lc = toLocal(o.x, o.y, o.z);
    if (lc[2] > HZ2) {
      drawSky(ctx, t, P, n);
      drawLand(ctx, t, P, { n, wave: { t0: A.waveT0 }, target: cotTarget(t, A, n) });
    } else {
      ctx.fillStyle = '#1c1416'; ctx.fillRect(0, 0, W, H);
      drawRoom(ctx, t, P, { reveal: true });
      vignette(ctx, .42 * smo((t - A.winT) / (A.topT - A.winT)));
    }
    return;
  }
  const P = cam(topCam(t, A));
  if (t > A.s1) {
    const M = noteAffine(P);
    if (ovalCovers(M)) { drawRise(ctx, t, A); return; }
  }
  noteScene(ctx, t, A, P);
}
function cotTarget(t, A, n) {
  const lt = lightTime(COT), lit = smo(clamp((t - A.waveT0 - lt) / .16));
  return { bin: KBIN, draw: (ctx, tt, P) => drawCottage(ctx, tt, P, { n, lit }) };
}
export const DIVE = { D0, DIN, PHIL, YAW: LA.yaw, KBIN };
