// c17 · 17.04–17.06: the ghost lines of the things you do orbit you and unwind away (the badge last), then the film's own guilloche
// border (the 4.04 look: band 24, 7 woven lines + 2 hairlines, 96 waves, cream) is engraved at the picture's edges and its threads
// unwind into the stars. The motif line art (badge on its lanyard, hammer and saw, the boat, the violin with its bow, the landing net)
// copies the look of c08 / c10–c13 as faint engraved lines (ghost.mjs: solid → dotted → smoke).
//   ghosts(ctx, t, C, K, you, side)   side 'behind' | 'front' (of your silhouette); you = [X, Y, Z] of your chest
//   frameBorder(ctx, t, K, skyCamAt)  screen space, on top of everything
import { W, H, rgba, clamp, mix } from '../engine.mjs';
import { ghostLine, ghostPaths } from './ghost.mjs';
import { resample } from './certificate.mjs';
import { u01, sio, hash, HZ } from './v2_c17_kit.mjs';
import { starsOnScreen, starAt } from './v2_c17_sky.mjs';

const TAU = Math.PI * 2;
// ---------------------------------------------------------------- motif line art (metres, y up, centred)
const arcP = (cx, cy, rx, ry, a0, a1, n = 18, rot = 0) => { const P = []; for (let i = 0; i <= n; i++) { const a = mix(a0, a1, i / n), x = Math.cos(a) * rx, y = Math.sin(a) * ry; P.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]); } return P; };
function rrect(cx, cy, w, h, r) {
  const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2, P = [];
  const corner = (x, y, a0) => { for (let i = 0; i <= 4; i++) { const a = a0 + i / 4 * Math.PI / 2; P.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); } };
  corner(x1 - r, y1 - r, 0); corner(x0 + r, y1 - r, Math.PI / 2); corner(x0 + r, y0 + r, Math.PI); corner(x1 - r, y0 + r, 1.5 * Math.PI); P.push(P[0]); return P;
}
const rotL = (lines, a, dx = 0, dy = 0) => lines.map((L) => L.map(([x, y]) => [x * Math.cos(a) - y * Math.sin(a) + dx, x * Math.sin(a) + y * Math.cos(a) + dy]));
const mirror = (P) => P.map(([x, y]) => [-x, y]);

const BADGE = [
  rrect(0, -.12, .4, .54, .045), rrect(-.085, -.02, .15, .18, .018),
  arcP(-.085, .01, .032, .036, 0, TAU, 14), arcP(-.085, -.1, .06, .045, 0, Math.PI, 10),
  [[.03, .05], [.15, .05]], [[.03, .0], [.12, .0]], [[-.15, -.22], [.15, -.22]], [[-.15, -.29], [.06, -.29]],
  rrect(0, .18, .11, .05, .012), [[0, .205], [0, .25]], [[-.012, .25], [-.07, .4], [-.12, .55], [-.14, .64]], [[.012, .25], [.07, .4], [.12, .55], [.14, .64]], arcP(0, .64, .14, .1, Math.PI, 0, 16),
];
const HAMMER = [rrect(0, -.06, .05, .62, .02), [[-.06, .25], [.13, .25], [.16, .27], [.16, .33], [.13, .35], [-.06, .35], [-.06, .25]], [[-.06, .35], [-.15, .37], [-.25, .33]], [[-.06, .25], [-.14, .27], [-.22, .22]]];
const SAW = (() => {
  const teeth = [[.3, .0]]; for (let i = 1; i <= 16; i++) { const x = .3 - i * .04; teeth.push([x + .02, -.005 - i * .0045 - .025], [x, -.005 - i * .0045]); }
  return [[[-.34, .06], [.3, .06], [.3, .0]], teeth, [[-.34, .06], [-.34, -.08], [-.36, -.1], [-.5, -.1], [-.53, -.05], [-.53, .07], [-.48, .1], [-.36, .1], [-.34, .06]], rrect(-.44, .0, .07, .1, .02)];
})();
const TOOLS = [...rotL(HAMMER, -.6, -.08, 0), ...rotL(SAW, .55, .1, -.02)];
const BOAT = [
  [[-.42, .06], [-.36, -.04], [-.22, -.12], [0, -.15], [.22, -.11], [.38, -.02], [.47, .1]], [[-.42, .06], [-.1, .03], [.2, .04], [.47, .1]],
  [[-.34, -.02], [.0, -.07], [.4, .02]], [[0, .03], [.02, .56]], [[-.3, .12], [.42, .66]],
  [[-.26, .14], [-.08, .08], [.05, .08], [.12, .17], [.22, .33], [.32, .5], [.4, .65]],
  [[-.52, -.13], [-.44, -.1], [-.36, -.13], [-.28, -.1], [-.2, -.13]], [[.12, -.17], [.2, -.14], [.28, -.17], [.36, -.14], [.44, -.17]],
];
const VIOLIN = (() => {
  const R = [[0, -.3], [.1, -.29], [.165, -.24], [.18, -.16], [.16, -.09], [.11, -.055], [.1, -.0], [.11, .045], [.14, .085], [.15, .14], [.12, .2], [.06, .232], [0, .238]];
  const body = [...R, ...mirror(R).reverse().slice(1)];
  const scroll = []; for (let i = 0; i <= 30; i++) { const a = i / 30 * TAU * 1.3, r = .045 * (1 - i / 40); scroll.push([Math.cos(a + Math.PI) * r * .8, .5 + Math.sin(a + Math.PI) * r]); }
  const fR = [[.055, .03], [.075, .01], [.07, -.04], [.08, -.09], [.06, -.11]];
  const bow = []; for (let i = 0; i <= 20; i++) { const q = i / 20; bow.push([mix(-.42, .5, q), mix(-.36, .44, q) + .035 * Math.sin(Math.PI * q)]); }
  return [body, [[-.022, .238], [-.02, .45], [.02, .45], [.022, .238]], scroll, fR, mirror(fR), [[-.065, -.06], [0, -.05], [.065, -.06]],
    ...[-.015, -.005, .005, .015].map((dx) => [[dx * 1.6, -.24], [dx * .8, .45]]), [[-.035, -.28], [-.02, -.19], [.02, -.19], [.035, -.28], [-.035, -.28]],
    bow, bow.map(([x, y]) => [x + .012, y - .022]), rrect(-.4, -.36, .05, .04, .01)];
})();
const NET = (() => {
  const c = [.2, .24], rx = .22, ry = .14, rot = .45, B = [.36, -.2], hoop = arcP(c[0], c[1], rx, ry, 0, TAU, 36, rot);
  const at = (a) => { const x = Math.cos(a) * rx, y = Math.sin(a) * ry; return [c[0] + x * Math.cos(rot) - y * Math.sin(rot), c[1] + x * Math.sin(rot) + y * Math.cos(rot)]; };
  const mer = []; for (const a of [2.9, 3.4, 3.9, 4.4, 4.9, 5.4, 5.9]) { const p = at(a), P = []; for (let i = 0; i <= 10; i++) { const q = i / 10; P.push([mix(p[0], B[0], q) + .05 * Math.sin(Math.PI * q) * Math.cos(a), mix(p[1], B[1], q * q)]); } mer.push(P); }
  const par = [.35, .68].map((f) => { const P = []; for (let i = 0; i <= 24; i++) { const p = at(2.7 + i / 24 * 3.4); P.push([mix(p[0], B[0], f), mix(p[1], B[1], f * f)]); } return P; });
  return [hoop, [[-.5, -.5], [.03, .12]], [[-.48, -.52], [.05, .1]], ...mer, ...par];
})();
const MOTIFS = [
  { key: 'badge', lines: BADGE, size: .95, th: 3.24 },   // starts at your left, in front of you the whole time (never behind your head)
  { key: 'tools', lines: TOOLS, size: .95, th: 3.24 + 1.17 },   // phases chosen so that, while the camera is close (≈ "everything I"),
  { key: 'boat', lines: BOAT, size: .95, th: 3.24 + 2.37 },    // nobody hides straight behind you: badge, net, tools in front,
  { key: 'violin', lines: VIOLIN, size: .9, th: 3.24 + 4.95 }, // the boat at your right, the violin at your left
  { key: 'net', lines: NET, size: .95, th: 3.24 + .57 },
].map((m) => ({ ...m, lines: m.lines.map((L) => { let len = 0; for (let i = 1; i < L.length; i++) len += Math.hypot(L[i][0] - L[i - 1][0], L[i][1] - L[i - 1][1]); return resample(L, clamp(Math.round(len / .012), 4, 160)); }) }));

// the state of motif j at time t: orbit angle, radius, height, draw-on, ghost, smoke
function motifState(j, t, K) {
  const m = MOTIFS[j], tA = K.who + .1 + .14 * j, badge = j === 0;
  const tU = badge ? K.answer - .15 : K.do - .12 + .13 * (j - 1);   // unwind: the others on "do", the badge on "answer"
  const grow = sio(u01(t, tA, tA + .9)), away = sio(u01(t, tU, tU + (badge ? 1.6 : 1.3)));
  const th = m.th + .5 * (t - K.who) + (badge ? .25 * away : .6 * away);
  return {
    th, R: 1.7 * grow + (badge ? 3.4 : 1.7) * away, y: [.05, .32, -.18, .42, -.06][j] - .42 * Math.sin(th) + .1 * Math.sin(th * .8 + j) + (badge ? 1.5 : .7) * away, u: sio(u01(t, tA, tA + .55)),
    ghost: u01(t, tU, tU + .35), smoke: u01(t, tU + .25, tU + (badge ? 1.5 : 1.25)), a: .82 * clamp(grow * 3),
  };
}
export function ghosts(ctx, t, C, K, you, side) {
  if (t < K.who || t > K.answer + 1.8) return;
  for (let j = 0; j < MOTIFS.length; j++) {
    const S = motifState(j, t, K); if (S.u <= 0 || S.smoke >= 1) continue;
    const behind = Math.sin(S.th) > 0; if ((side === 'behind') !== behind) continue;
    const X = you[0] + S.R * Math.cos(S.th), Y = you[1] + S.y, Z = you[2] + .65 * S.R * Math.sin(S.th), p = C.P(X, Y, Z); if (!p) continue;
    const [sx, sy, k] = p, m = MOTIFS[j], sc = k * m.size, cyaw = .62 + .38 * Math.abs(Math.cos(S.th)), rho = .22 * Math.sin(S.th * 1.3 + j);
    const cr = Math.cos(rho), sr = Math.sin(rho), w = clamp(k * .0055, .8, 2.2);
    for (let i = 0; i < m.lines.length; i++) {
      const pts = m.lines[i].map(([x, y]) => { const xx = x * cyaw; return [sx + (xx * cr - y * sr) * sc, sy - (xx * sr + y * cr) * sc]; });
      ghostLine(ctx, pts, { u: S.u, ghost: S.ghost, smoke: S.smoke, col: '#f3efe2', w, a: S.a * (behind ? .75 : 1), dot: clamp(w * 4, 4, 8), seed: j * 31 + i, t, glow: '#bcd0ff' });
    }
  }
}

// ---------------------------------------------------------------- the film's border at the picture's edges, unwinding into the stars
const BAND = 24, NL = 7, WAVES = 96, BCOL = '#ffe9c8', BX0 = 26, BY0 = 26, BW = W - 52, BH = H - 52, RAD = 18;
function perimeter(w, h, r) {   // the rounded rectangle's outline by arc length (same construction as certificate.gBorder)
  const segs = []; let tot = 0; const add = (len, f) => { segs.push([tot, len, f]); tot += len; };
  add(w - 2 * r, (q) => [r + q * (w - 2 * r), 0, 0, 1]);
  add(Math.PI * r / 2, (q) => { const a = -Math.PI / 2 + q * Math.PI / 2; return [w - r + Math.cos(a) * r, r + Math.sin(a) * r, -Math.cos(a), -Math.sin(a)]; });
  add(h - 2 * r, (q) => [w, r + q * (h - 2 * r), -1, 0]);
  add(Math.PI * r / 2, (q) => { const a = q * Math.PI / 2; return [w - r + Math.cos(a) * r, h - r + Math.sin(a) * r, -Math.cos(a), -Math.sin(a)]; });
  add(w - 2 * r, (q) => [w - r - q * (w - 2 * r), h, 0, -1]);
  add(Math.PI * r / 2, (q) => { const a = Math.PI / 2 + q * Math.PI / 2; return [r + Math.cos(a) * r, h - r + Math.sin(a) * r, -Math.cos(a), -Math.sin(a)]; });
  add(h - 2 * r, (q) => [0, h - r - q * (h - 2 * r), 1, 0]);
  add(Math.PI * r / 2, (q) => { const a = Math.PI + q * Math.PI / 2; return [r + Math.cos(a) * r, r + Math.sin(a) * r, -Math.cos(a), -Math.sin(a)]; });
  return { tot, at: (s) => { s = ((s % tot) + tot) % tot; for (const [s0, len, f] of segs) if (s <= s0 + len) return f((s - s0) / (len || 1)); return segs[0][2](0); } };
}
let BLINES = null;
function borderLines() {
  if (BLINES) return BLINES;
  const P = perimeter(BW - BAND, BH - BAND, RAD), N = Math.round(P.tot / 2.2), out = [], ox = BX0 + BAND / 2, oy = BY0 + BAND / 2;
  for (let i = 0; i < NL; i++) { const ph = i / NL * TAU, pts = []; for (let j = 0; j <= N; j++) { const s = j / N * P.tot, [px, py, nx, ny] = P.at(s), q = s / P.tot * WAVES * TAU, d = BAND * .42 * (Math.sin(q + ph) * .75 + Math.sin(q * 2.03 - ph * 1.5) * .25); pts.push([ox + px + nx * d, oy + py + ny * d]); } out.push(pts); }
  for (const off of [-BAND * .5, BAND * .5]) { const pts = []; for (let j = 0; j <= N; j++) { const [px, py, nx, ny] = P.at(j / N * P.tot); pts.push([ox + px + nx * off, oy + py + ny * off]); } out.push(pts); }
  return (BLINES = out);
}
// the threads come loose from the top-left corner round the frame (line l a little later than line l−1); each loose piece flies to a star
const NP = 110, FLY = 1.15;
let TARGETS = null;
function targets(t1, cam, L) {   // each loose piece flies to a star near it (a little inward and up), never into the ground
  if (TARGETS && TARGETS.t1 === t1) return TARGETS.list;
  const st = starsOnScreen(t1, cam, [40, 30, W - 40, Math.min(H - 60, HZ - cam.dl - 40)]).filter((s) => s.s > .8), list = [];
  for (let l = 0; l < L.length; l++) for (let j = 0; j < NP; j++) {
    const P0 = L[l][Math.round(j / (NP - 1) * (L[l].length - 1))], h1 = hash(l * 113.7 + j * 7.31), h2 = hash(l * 17.1 + j * 3.9);
    const D = [P0[0] + (W / 2 - P0[0]) * .18 + (h1 - .5) * 260, Math.min(P0[1] + (H / 2 - P0[1]) * .18 - 60 - h2 * 140, HZ - cam.dl - 80)];
    let best = null, bd = 1e18; for (const s of st) { const d = (s.x - D[0]) ** 2 + (s.y - D[1]) ** 2; if (d < bd) { bd = d; best = s; } }
    list.push(best);
  }
  TARGETS = { t1, list }; return list;
}
export function frameBorder(ctx, t, K, skyCamAt) {
  const t0 = K.not + .05, t1 = K.either + .02; if (t < t0) return;
  const L = borderLines();
  if (t < t1) {   // engraved: the dotted ghost lines run round the frame, the burin cuts them solid behind
    ghostPaths(ctx, L, { u: sio(u01(t, t0, t0 + .5)), burin: u01(t, t0 + .1, t1 - .05), ghost: 1, stagger: .25, tips: 2, col: BCOL, w: .9, a: .85, dot: 5, t, tipSize: 12 });
    return;
  }
  const cam = skyCamAt(t), tg = targets(t1, skyCamAt(t1), L), done = t1 + .25 + 1.25 + FLY + .1; if (t > done) return;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let l = 0; l < L.length; l++) {
    const P = L[l], n = P.length, tl = t1 + .25 * l / (L.length - 1), front = clamp((t - tl) / 1.25), i0 = Math.ceil(front * (n - 1));
    if (i0 < n - 1) {   // the part still lying on the frame
      ctx.strokeStyle = rgba(BCOL, .85); ctx.lineWidth = l < NL ? .9 : 1.26; ctx.beginPath(); ctx.moveTo(P[i0][0], P[i0][1]); for (let i = i0 + 1; i < n; i++) ctx.lineTo(P[i][0], P[i][1]); ctx.stroke();
    }
    for (let j = 0; j < NP; j++) {   // the loose pieces in flight
      const f = j / (NP - 1), td = tl + 1.25 * f, a0 = (t - td) / FLY; if (a0 <= 0 || a0 >= 1) continue;
      const st = tg[l * NP + j]; if (!st) continue;
      const P0 = P[Math.round(f * (n - 1))], S = starAt(st, t, cam), hh = hash(l * 41.3 + j * 3.7) - .5;
      const pos = (q) => { const cx = mix(P0[0], S.x, .35) - (S.y - P0[1]) * .25 * hh, cy = mix(P0[1], S.y, .35) + (S.x - P0[0]) * .25 * hh, u = 1 - q; return [u * u * P0[0] + 2 * u * q * cx + q * q * S.x, u * u * P0[1] + 2 * u * q * cy + q * q * S.y]; };
      const q = sio(a0), qp = sio(Math.max(0, a0 - .025)), [x, y] = pos(q), [xp, yp] = pos(qp), al = .9 * (1 - smoothEnd(a0));
      ctx.strokeStyle = rgba(BCOL, al * .4); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(xp, yp); ctx.lineTo(x, y); ctx.stroke();
      ctx.fillStyle = rgba(BCOL, al); ctx.beginPath(); ctx.arc(x, y, mix(1.1, .6 + .5 * S.s, q), 0, TAU); ctx.fill();
    }
  }
  ctx.restore();
}
const smoothEnd = (a) => { const q = clamp((a - .78) / .22); return q * q * (3 - 2 * q); };
