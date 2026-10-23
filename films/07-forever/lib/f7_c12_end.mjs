// Film 7 · c12 · the answer and the end (07a + the end plate): drawing pieces for scenes/sc12.mjs. Builder: c12. Pure functions of t, deterministic.
// The world is c06's orbit world (kit sky, earthHorizon, curve, ring) at dawn. THE SPLIT objects are 1:1 copies of lib/f7_c06_orbit.mjs, so the cool line
// and the amber line lying in the ring are the very lines c06 left behind:
//   coolPath(q) / coolPts(q0, q1, n)   the cool intelligence line (q 0 = the hero city S; q 1 just above c06's split framing; q ≤ 3 keeps climbing)
//   bendPts(CW, iS, u) / RING_R        the amber curve bent over and lying along the ring (u = 1: lying down)      AMBER = bendPts(curveO(), 30, 1)
//   CROSS                              world point where the cool line passes the dome (q ≈ .94);  saOf(x, y) screen angle round the Earth's centre
// THE PLATE (c11>c12 'light', tone dawn): dawnPlate(ctx, t, A) handoff4's plate copied 1:1 (A = 1 → identical), dawnOut(ctx, t, k, cx, cy) the
//   plate shrinking into a light at (cx, cy) (k 1 → the plate; after c11's dawnCover / c06's plateOut).
// THE DAWN: SUN, sunAt(t), sunrise / sunriseLimb / dawnSky (copied from lib/f7_c07_fork.mjs, sun angle as a parameter, conic offsets fixed for
//   @napi-rs: a conic gradient starts at the TOP), earth(ctx, t, cam, o) (kit earthHorizon + c07's polar cap + dawn form light toward the sun).
// THE DOME: domeRim(ctx, t, m, A) the dome's rim light with an angular profile A(sa) (sa = screen angle from +x; the kit dome only knows one
//   contact sector); starPass(ctx, t, X, Y, u) the soft chromatic sparkle of starlight passing the glass; starGlint(ctx, X, Y, r, a).
// THE MEMORY: furnaceSide(ctx, t, m, I, saEdge) c07's furnace vault glow + smoke ceiling, only on the left of the screen angle saEdge.
// THE RING: ringWave(ctx, t, m, u, sa0, w) a wave of light runs both ways round the ring from sa0 and closes at the far side.
// THE PEOPLE: PEOPLE, peoplePrepare() (sprites as Images), people(ctx, t, m, o) a row on the crest at figure scale, seen from behind
//   (figureBack, drawn at a fixed size and scaled: no per-size cache leak), crest(ctx, t, m, a) the dark hill line with grass and round trees.
// TEXT: question(ctx, t, lines, o) the comment question, word-timed mask reveal per line, wipe out.  END SCREEN: SAFE (the boxes left free),
//   endShade(ctx, a) keeps them dark and calm.
import { loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, prng, drift, canvas, text } from '../engine.mjs';
import { F7, EARTH, CURVE, camO, earthHorizon, curveO, glowAt, ease, mod, n1, limbY } from './f7_kit.mjs';
import { figureBack } from './figure.mjs';
import { TSHIFT } from './handoff4.mjs';

const TAU = Math.PI * 2;
export const bump = (t, a, b, c, d) => sm(lin(a, b, t)) * (1 - sm(lin(c, d, t)));
const wrap = (a) => mod(a + Math.PI, TAU) - Math.PI;
export const saOf = (x, y) => Math.atan2(y, x);

// ================================================================ the plate (handoff4 lightPlate, tone dawn, copied 1:1)
const DOTS = (() => { const r = prng(901), d = []; for (let i = 0; i < 2600; i++) d.push([r(), r(), r()]); return d; })();
export function dawnPlate(ctx, t, A = 1) {
  if (A <= 0) return;
  t += TSHIFT;
  const c0 = '#fff6e2', c1 = '#ffd9a0', c2 = '#f4a77a', br = 1 + .03 * Math.sin(t * 1.7) + .015 * Math.sin(t * 4.3);
  const cx = W / 2 + 18 * drift(t, 1, 3), cy = H / 2 + 12 * drift(t, 1, 7);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = clamp(A);
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 1150 * br); g.addColorStop(0, c0); g.addColorStop(.42, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const r = prng(31 + Math.floor(t * 12)); ctx.fillStyle = rgba(c2, .32);
  for (const [u, v, k] of DOTS) {
    const x = u * W, y = v * H, d = Math.hypot(x - cx, y - cy) / 1100; if (d < .35) continue;
    if (k > (d - .35) * 1.4) continue; const s = .8 + r() * 1.1; ctx.fillRect(x + (r() - .5) * 2, y + (r() - .5) * 2, s, s);
  }
  ctx.restore();
}
// the world is drawn; a warm light round (cx, cy) and the plate over it (k = 1 → exactly the plate)
export function dawnOut(ctx, t, k, cx, cy) {
  if (k <= 0) return;
  const kk = clamp(k);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
  const R = mix(80, 2600, Math.pow(kk, 1.25)), g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
  g.addColorStop(0, rgba('#fff6e2', clamp(.55 + .45 * kk))); g.addColorStop(.28, rgba('#ffd9a0', clamp(.25 + .5 * kk))); g.addColorStop(1, rgba('#f4a77a', 0));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
  dawnPlate(ctx, t, kk >= .999 ? 1 : sm(lin(.35, 1, kk)));
}

// ================================================================ THE SPLIT objects (copied 1:1 from lib/f7_c06_orbit.mjs)
const CS = CURVE.S, BC = 3.5, EC = Math.exp(BC) - 1, HC = 930;
export function coolPath(q) {
  if (q <= 1) return [CS[0] + 470 * q - 300 * q * q * q, CS[1] - HC * (Math.exp(BC * q) - 1) / EC];
  const d = q - 1, x1 = CS[0] + 170, y1 = CS[1] - HC;
  return [x1 - 430 * d + 150 * d * d, y1 - (3365 * d - 810 * d * d)];
}
export const coolPts = (q0, q1, n = 160) => { const o = []; for (let i = 0; i <= n; i++) { const q = mix(q0, q1, i / n); const p = coolPath(q); o.push([p[0], p[1], 1]); } return o; };
export const RING_R = EARTH.R * 1.045;
const polar = (x, y) => [Math.atan2(x, -y), Math.hypot(x, y)];
const fromPolar = (th, r) => [r * Math.sin(th), -r * Math.cos(th)];
export function bendPts(CW, iS, u, ext = 1) {
  if (u <= 0) return CW;
  const N = CW.length - 1, [thS, rS] = polar(CS[0], CS[1]);
  const L = [0]; for (let i = iS + 1; i <= N; i++) L.push(L[L.length - 1] + Math.hypot(CW[i][0] - CW[i - 1][0], CW[i][1] - CW[i - 1][1]));
  return CW.map((p, i) => {
    if (i < iS) return p;
    const s = (i - iS) / (N - iS), lag = .55, b = ease.io(clamp((u - (1 - s) * lag) / (1 - lag)));
    if (b <= 0) return p;
    const [th0, r0] = polar(p[0], p[1]), len = L[i - iS] * ext;
    const rise = clamp(len / 160), rT = mix(rS, RING_R, ease.sine(rise)), thT = thS + len / RING_R * .98;
    return [...fromPolar(mix(th0, thT, b), mix(r0, rT, b)), p[2]];
  });
}
export const AMBER = bendPts(curveO(), 30, 1);
// the amber's angular extent along the ring (screen angles from +x) and the cool line's crossing with the dome
export const AMB_SA = (() => { const a = AMBER.slice(30).map(([x, y]) => saOf(x, y)); return [Math.min(...a), Math.max(...a)]; })();
export const CROSS = (() => { let lo = .5, hi = 1; for (let k = 0; k < 40; k++) { const q = (lo + hi) / 2, p = coolPath(q); if (Math.hypot(p[0], p[1]) < EARTH.RD) lo = q; else hi = q; } const p = coolPath(lo); return { q: lo, x: p[0], y: p[1], sa: saOf(p[0], p[1]) }; })();
// the arclength parameter of the cool line (q → length) for glints that travel at an even speed
const QL = (() => { const o = [[0, 0]]; let L = 0, p = coolPath(0); for (let i = 1; i <= 600; i++) { const q = i / 200, n = coolPath(q); L += Math.hypot(n[0] - p[0], n[1] - p[1]); o.push([q, L]); p = n; } return o; })();
export const COOL_LEN = (q) => { const i = Math.min(QL.length - 2, Math.floor(q * 200)); return mix(QL[i][1], QL[i + 1][1], q * 200 - i); };
export const qAtLen = (L) => { let i = 1; while (i < QL.length - 1 && QL[i][1] < L) i++; const a = QL[i - 1], b = QL[i]; return mix(a[0], b[0], clamp((L - a[1]) / Math.max(1e-6, b[1] - a[1]))); };

// ================================================================ THE DAWN (sun on the limb; after lib/f7_c07_fork.mjs)
export const SUN = { th: .62, rs: 30 };
export const sunAt = (t, h) => fromPolar(SUN.th, EARTH.R + h);
// o: { h (world units above the surface), k (glow scale, × m.k), br }
export function sunrise(ctx, t, m, o = {}) {
  const [wx, wy] = sunAt(t, o.h ?? 50), X = m.X(wx), Y = m.Y(wy), k = m.k * (o.k ?? 1), br = (o.br ?? 1) * (1 + .03 * Math.sin(t * 2.3));
  if (X < -2400 * k || X > W + 2400 * k || Y < -2400 * k || Y > H + 2400 * k) return [X, Y];
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  glowAt(ctx, X, Y, 1500 * k * br, .3, '#ffb35c', '#fff1d6');
  glowAt(ctx, X, Y, 420 * k * br, .7, '#ffd08e', '#ffffff');
  glowAt(ctx, X, Y, 90 * k * br, .95, '#fff1d6', '#ffffff');
  ctx.fillStyle = '#fffaf0'; ctx.beginPath(); ctx.arc(X, Y, Math.max(1.2, SUN.rs * k), 0, TAU); ctx.fill();
  ctx.lineCap = 'round';
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * TAU + t * .03 + (i % 2) * .1, L = (i % 3 === 0 ? 620 : 300) * k * br, w = i % 3 === 0 ? 1.8 : 1.1;
    const gr = ctx.createLinearGradient(X, Y, X + Math.cos(a) * L, Y + Math.sin(a) * L); gr.addColorStop(0, rgba('#fff1d6', .55)); gr.addColorStop(1, rgba('#ffb35c', 0));
    ctx.strokeStyle = gr; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(X, Y); ctx.lineTo(X + Math.cos(a) * L, Y + Math.sin(a) * L); ctx.stroke();
  }
  ctx.restore();
  return [X, Y];
}
// conic profile round the Earth's centre: f(dd) of the angular distance to the sun (napi conic: stop u ↔ screen angle u·2π − π/2)
function conicAround(ctx, cx, cy, sa0, f, col, n = 48) {
  const cg = ctx.createConicGradient(0, cx, cy);
  for (let i = 0; i <= n; i++) { const sa = i / n * TAU - Math.PI / 2, dd = Math.abs(wrap(sa - sa0)); cg.addColorStop(i / n, rgba(col, clamp(f(dd)))); }
  return cg;
}
export function sunriseLimb(ctx, t, m, o = {}) {
  const u = o.u ?? 1; if (u <= 0) return;
  const cx = m.X(0), cy = m.Y(0), r = EARTH.R * m.k, sa0 = SUN.th - Math.PI / 2, a = clamp(u * 1.4) * (o.br ?? 1);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [lw, sp, amp, dr] of [[Math.max(10, 60 * m.k), .05, .22 * a, 6], [Math.max(3, 14 * m.k), .03, .55 * a, 2], [1.4, .02, .95 * a, 0]]) {
    ctx.strokeStyle = conicAround(ctx, cx, cy, sa0, (dd) => amp * Math.exp(-dd * dd / sp), '#ffcf8a'); ctx.lineWidth = lw; ctx.beginPath(); ctx.arc(cx, cy, r + dr * m.k, 0, TAU); ctx.stroke();
  }
  ctx.restore();
}
export function dawnSky(ctx, t, m, u, sun) {
  if (u <= 0) return;
  const cx = m.X(0), cy = m.Y(0), r = EARTH.R * m.k, [X, Y] = sun;
  const b = ctx.createRadialGradient(cx, cy, r, cx, cy, r * 1.16);
  b.addColorStop(0, rgba('#f1d9a8', .55 * u)); b.addColorStop(.1, rgba('#e7b893', .42 * u)); b.addColorStop(.35, rgba('#b47e98', .24 * u)); b.addColorStop(.7, rgba('#5a4c8a', .1 * u)); b.addColorStop(1, 'rgba(60,50,120,0)');
  ctx.fillStyle = b; ctx.beginPath(); ctx.arc(cx, cy, r * 1.16, 0, TAU); ctx.arc(cx, cy, r, 0, TAU, true); ctx.fill('evenodd');
  const R = Math.max(260, 1500 * m.k), g = ctx.createRadialGradient(X, Y, 0, X, Y, R);
  g.addColorStop(0, rgba('#fff1d0', .7 * u)); g.addColorStop(.2, rgba('#f1d9a8', .4 * u)); g.addColorStop(.5, rgba('#d49a8a', .16 * u)); g.addColorStop(1, 'rgba(160,110,140,0)');
  ctx.fillStyle = g; ctx.fillRect(Math.max(0, X - R), Math.max(0, Y - R), Math.min(W, X + R) - Math.max(0, X - R), Math.min(H, Y + R) - Math.max(0, Y - R));
}
// the Earth: kit earthHorizon + polar cap (whole disc in view) + the night side turning away from the dawn
export function earth(ctx, t, cam, o = {}) {
  const m = camO(cam), cx = m.X(0), cy = m.Y(0), r = EARTH.R * m.k;
  earthHorizon(ctx, t, cam, { city: o.city ?? 1, atmo: o.atmo ?? 1 });
  const pc = [m.X(0), m.Y(EARTH.R * .71)];
  if (pc[1] - .3 * r < H && pc[1] + .3 * r > 0 && r > 40) {
    ctx.save(); ctx.translate(pc[0], pc[1]); ctx.scale(1, .62);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, .34 * r); g.addColorStop(0, 'rgba(178,188,230,.5)'); g.addColorStop(.45, 'rgba(156,168,222,.36)'); g.addColorStop(.8, 'rgba(120,130,200,.1)'); g.addColorStop(1, 'rgba(110,120,190,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, .34 * r, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(220,226,255,.18)'; ctx.lineWidth = Math.max(.6, r * .003);
    ctx.beginPath(); for (let k = -6; k <= 6; k++) { const yy = k * .04 * r, hw = Math.sqrt(Math.max(0, .06 - (k * .04) ** 2)) * r * .95; ctx.moveTo(-hw, yy); ctx.lineTo(hw, yy); } ctx.stroke();
    ctx.restore();
  }
  // form light: the side toward the sun catches the dawn, the far side turns away into the night (only when most of the disc is in view)
  if (r < 2600) {
    const q = clamp((2600 - r) / 1200), sa0 = SUN.th - Math.PI / 2, lx = cx + .55 * r * Math.cos(sa0), ly = cy + .55 * r * Math.sin(sa0);
    const sh = ctx.createRadialGradient(lx, ly, r * .2, lx, ly, r * 1.8);
    sh.addColorStop(0, 'rgba(6,6,20,0)'); sh.addColorStop(.55, rgba('#06061a', .14 * q)); sh.addColorStop(1, rgba('#06061a', .6 * q));
    ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = conicAround(ctx, cx, cy, sa0, (dd) => .55 * q * Math.max(0, 1 - dd / 1.5) ** 2, '#ffc4aa', 24); ctx.lineWidth = Math.max(2, r * .02);
    ctx.beginPath(); ctx.arc(cx, cy, r - Math.max(1, r * .008), 0, TAU); ctx.stroke();
    // the dawn crescent: the first light wraps round the limb on the sun's side
    const q2 = clamp((1500 - r) / 700);
    if (q2 > 0) {
      const gx = cx + 1.32 * r * Math.cos(sa0), gy = cy + 1.32 * r * Math.sin(sa0), cg = ctx.createRadialGradient(gx, gy, .32 * r, gx, gy, 1.02 * r);
      cg.addColorStop(0, rgba('#ffd9a8', .42 * q2)); cg.addColorStop(.35, rgba('#f1b58a', .2 * q2)); cg.addColorStop(.7, rgba('#8a7ab0', .05 * q2)); cg.addColorStop(1, 'rgba(120,110,170,0)');
      ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  return { m, cx, cy, r };
}

// ================================================================ THE DOME: the rim light with an angular profile
// A(sa) → strength (0 … ~1.5) at screen angle sa (from +x, y down). Same strokes as the kit's dome rim, plus the fresnel band inside it.
export function domeRim(ctx, t, m, A, o = {}) {
  const cx = m.X(0), cy = m.Y(0), r = EARTH.RD * m.k; if (r < 30) return;
  // the profile is sampled along screen x over the upper half of the circle (the rim is only lit in near framings, where the visible arc is the
  // top of the dome and a conic gradient would need hundreds of stops for a soft edge): stop at x ↔ the angle of the rim point above x
  const n = 96, X0 = cx - r, X1 = cx + r, xa = Math.max(X0, -300), xb = Math.min(X1, W + 300); if (xb <= xa) return;
  const saAt = (x) => { const dx = clamp(x - cx, -r, r); return Math.atan2(-Math.sqrt(Math.max(0, r * r - dx * dx)), dx); };
  const prof = []; let any = 0;
  for (let i = 0; i <= n; i++) { const x = mix(xa, xb, i / n), v = Math.max(0, A(saAt(x))); prof.push(v); any = Math.max(any, v); }
  if (any < .005) return;
  const grad = (f) => { const g = ctx.createLinearGradient(xa, 0, xb, 0); prof.forEach((v, i) => g.addColorStop(i / n, f(v, mix(xa, xb, i / n)))); return g; };
  const a0 = Math.PI, a1 = TAU;   // the upper half
  ctx.save();
  // fresnel band inside the rim
  const fb = Math.max(18, Math.min(r * .05, 120));
  for (const [f0, f1, k] of [[1, .55, .25], [.55, .2, .5], [.2, 0, 1]]) {
    ctx.fillStyle = grad((v) => rgba(o.col || F7.rim, clamp(.11 * k * v)));
    ctx.beginPath(); ctx.arc(cx, cy, r - fb * f1, a0, a1); ctx.arc(cx, cy, r - fb * f0, a1, a0, true); ctx.closePath(); ctx.fill();
  }
  // warm light under the glass (o.warm(sa) → 0..1: the heat of the appetite held under the glass)
  if (o.warm) {
    const wv = []; for (let i = 0; i <= n; i++) wv.push(o.warm(saAt(mix(xa, xb, i / n))));
    for (const [f0, f1, al] of [[2.4, 1, .03], [1, .4, .06], [.4, 0, .1]]) {
      const g = ctx.createLinearGradient(xa, 0, xb, 0); wv.forEach((v, i) => g.addColorStop(i / n, rgba('#ffb070', clamp(al * v))));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r - fb * f1, a0, a1); ctx.arc(cx, cy, r - fb * f0, a1, a0, true); ctx.closePath(); ctx.fill();
    }
  }
  ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'butt';
  for (const [lw, al, col] of [[Math.max(10, Math.min(40, r * .012)), .07, F7.rim], [3.4, .22, F7.rim], [1.3, .85, '#ffffff']]) {
    ctx.strokeStyle = grad((v) => rgba(col, clamp(al * v * 2.2))); ctx.lineWidth = lw; ctx.beginPath(); ctx.arc(cx, cy, r, a0, a1); ctx.stroke();
  }
  ctx.restore();
}
// a soft chromatic sparkle where starlight passes the glass (u 0..1 of its life): thin rings that widen and fade, a 4-point glint
export function starPass(ctx, t, X, Y, u, s = 1) {
  if (u <= 0 || u >= 1) return;
  const a = Math.sin(Math.PI * u) ** .7;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineWidth = 1.2;
  for (const [r0, col, al] of [[10, '#ffd9a8', .5], [13, '#cfe6ff', .6], [17, '#ffffff', .35], [24, '#bfe3ff', .2]]) {
    ctx.strokeStyle = rgba(col, al * a); ctx.beginPath(); ctx.arc(X, Y, (r0 + 46 * ease.out(u)) * s, 0, TAU); ctx.stroke();
  }
  ctx.restore();
  starGlint(ctx, X, Y, 120 * s * (.5 + .5 * a), a);
}
export function starGlint(ctx, X, Y, r, a, col = F7.cool) {
  if (a <= 0 || r <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  glowAt(ctx, X, Y, r * .55, .8 * a, col, '#ffffff');
  for (const [dx, dy, L] of [[1, 0, 1], [0, 1, 1], [.7, .7, .45], [.7, -.7, .45]]) {
    const g = ctx.createLinearGradient(X - dx * r * L, Y - dy * r * L, X + dx * r * L, Y + dy * r * L);
    g.addColorStop(0, rgba(col, 0)); g.addColorStop(.5, rgba('#ffffff', .85 * a)); g.addColorStop(1, rgba(col, 0));
    ctx.strokeStyle = g; ctx.lineWidth = L < 1 ? .8 : 1.3; ctx.beginPath(); ctx.moveTo(X - dx * r * L, Y - dy * r * L); ctx.lineTo(X + dx * r * L, Y + dy * r * L); ctx.stroke();
  }
  ctx.restore();
}

// ================================================================ THE MEMORY: the furnace glow on one side (after c07's furnaceBack / smokeCeiling)
// I 0..1; the glow fills the vault (limb → dome) only at screen angles left of saEdge (soft .1 rad edge), fading toward the far limb
// drawn at quarter size into one reused canvas, masked by a soft horizontal edge (xEdge: screen x, the glow lies left of it), then laid
// over the frame (only for the ~1 s of the memory, so the per-frame canvas copy of @napi-rs stays small: 0.5 MB/frame)
let FC = null;
export function furnaceSide(ctx, t, m, I, xEdge) {
  if (I <= 0) return;
  const s = .25, w = Math.round(W * s), h = Math.round(H * s);
  if (!FC) FC = canvas(w, h);
  const [c, g] = FC;
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, w, h);
  g.setTransform(s, 0, 0, s, 0, 0);
  const cx = m.X(0), cy = m.Y(0), r = EARTH.R * m.k, rd = EARTH.RD * m.k;
  const gr = g.createRadialGradient(cx, cy, r, cx, cy, rd);
  gr.addColorStop(0, rgba('#ffc890', .95)); gr.addColorStop(.05, rgba('#ff8a48', .95)); gr.addColorStop(.18, rgba('#e2552c', .93)); gr.addColorStop(.42, rgba('#9a3418', .92));
  gr.addColorStop(.7, rgba('#4e2016', .92)); gr.addColorStop(.9, rgba('#2c1814', .94)); gr.addColorStop(1, rgba('#3a2420', .9));
  g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, rd, Math.PI, TAU); g.arc(cx, cy, r, TAU, Math.PI, true); g.closePath(); g.fill();
  // smoke instead of stars: engraved billow lines under the glass
  g.strokeStyle = rgba('#ffb080', .4); g.lineWidth = 5;
  for (let i = 0; i < 22; i++) {
    const rr = EARTH.RD * (.84 + .14 * ((i * 7) % 13) / 13), th0 = -1.1 + ((i * 37) % 22) / 22 * 1.2 + t * .006 * (i % 2 ? 1 : -1), L = .07 + .05 * ((i * 3) % 5) / 5;
    g.beginPath(); for (let k = 0; k <= 14; k++) { const th = th0 + L * k / 14, wob = 18 * Math.sin(k * .9 + i + t * .4); const X = cx + (rr + wob) * Math.sin(th) * m.k, Y = cy - (rr + wob) * Math.cos(th) * m.k; k ? g.lineTo(X, Y) : g.moveTo(X, Y); } g.stroke();
  }
  // the vault's rim glows like the mouth of a kiln
  g.globalCompositeOperation = 'lighter';
  for (const [lw, al] of [[Math.max(8, 46 * m.k), .14], [Math.max(4, 7 * m.k), .34], [4, .6]]) { g.strokeStyle = rgba('#ff9a50', al); g.lineWidth = lw; g.beginPath(); g.arc(cx, cy, rd, Math.PI, TAU); g.stroke(); }
  // the soft edge
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'destination-in';
  const lg = g.createLinearGradient(0, 0, w, 0), e = clamp(xEdge / W, .05, 1), e0 = clamp((xEdge - 260) / W, 0, e - .01);
  lg.addColorStop(0, 'rgba(0,0,0,.85)'); lg.addColorStop(e0, 'rgba(0,0,0,1)'); lg.addColorStop(e, 'rgba(0,0,0,0)'); lg.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = lg; g.fillRect(0, 0, w, h);
  g.globalCompositeOperation = 'source-over';
  ctx.save(); ctx.globalAlpha = clamp(I); ctx.drawImage(c, 0, 0, W, H); ctx.restore();
}

// ================================================================ THE RING: a wave of light runs round it from sa0 both ways (u 0..1) and closes
export function ringWave(ctx, t, m, u, sa0, w) {
  if (u <= 0 || u >= 1.6) return;
  const cx = m.X(0), cy = m.Y(0), rr = RING_R * m.k, ph = Math.PI * ease.io(clamp(u)), fade = 1 - sm(clamp((u - 1) / .6));
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  // the trail: the band behind the two fronts is brighter (it stays a little brighter once the wave has passed)
  if (ph > .01) for (const [lw, al, col] of [[w * .9, .12, F7.amber], [w * .3, .28, '#ffd9a0'], [1.6, .6, '#fff6e0']]) {
    ctx.strokeStyle = rgba(col, al * fade); ctx.lineWidth = lw; ctx.beginPath(); ctx.arc(cx, cy, rr + w * .2, sa0 - ph, sa0 + ph); ctx.stroke();
  }
  // the two fronts, and where they meet a short bloom
  if (u < 1) for (const s of [-1, 1]) { const a = sa0 + s * ph; glowAt(ctx, cx + Math.cos(a) * (rr + w * .2), cy + Math.sin(a) * (rr + w * .2), Math.max(14, w * 1.2), .75, F7.amber, F7.amberCore); }
  const meet = bump(u, .92, 1, 1.05, 1.5); if (meet > 0) { const a = sa0 + Math.PI; glowAt(ctx, cx + Math.cos(a) * (rr + w * .2), cy + Math.sin(a) * (rr + w * .2), Math.max(30, w * 2.4), .7 * meet, F7.amber, F7.amberCore); }
  ctx.restore();
}

// ================================================================ THE PEOPLE on the crest (seen from behind, at figure scale)
// x: world x on the limb; s: size factor; tilt0/tilt1: head (0 ahead, − up)
export const PEOPLE = [
  { x: 392, s: 1.0, seed: 4, coat: '#2c3656', acc: '#c98a3c', d: 0 },
  { x: 416, s: .93, seed: 7, coat: '#3a2c44', acc: '#e0b24a', d: .08 },
  { x: 470, s: 1.05, seed: 11, coat: '#22304a', acc: '#b4563a', d: .14 },
  { x: 509, s: .9, seed: 2, coat: '#33364e', acc: '#d8a050', d: .05 },
  { x: 531, s: 1.0, seed: 13, coat: '#2a2a40', acc: '#9a6a3a', d: .2 },
  { x: 588, s: .96, seed: 9, coat: '#2e3248', acc: '#c07a45', d: .11 },
];
export const PERSON_H = 39;   // world units tall (c07's storybook scale: the people of the ring town)
const SPR = new Map();   // per person: [Image at tilt 0, Image at tilt −.3] (fixed t = 0)
const SPS = 2, SPW = 140 * SPS, SPH = 210 * SPS, SOX = 70 * SPS, SOY = 198 * SPS;
const LIGHT = (s) => ({ x: 640 * s, y: -260 * s, col: '#ffd9a0', a: .95 });
export async function peoplePrepare() {
  if (SPR.size) return;
  for (const p of PEOPLE) {
    const ims = [];
    for (const tilt of [0, -.3]) {
      const [c, g] = canvas(SPW, SPH);
      figureBack(g, SOX, SOY, SPS, { t: 0, seed: p.seed, hold: 'none', dress: { coat: p.coat }, accent: p.acc, headTilt: tilt, light: { ...LIGHT(SPS), x: SOX + 640 * SPS, y: SOY - 260 * SPS } });
      ims.push(await loadImage(c.toBuffer('image/png')));
    }
    SPR.set(p.seed, ims);
  }
}
// o: { look (t → 0..1 per person: the head lifts toward the ring), live (true: draw live figureBack when big) }
export function people(ctx, t, m, o = {}) {
  for (const p of PEOPLE) {
    const ang = Math.asin(clamp(p.x / EARTH.R, -1, 1)), gy = limbY(p.x) + 1.5, X = m.X(p.x), Y = m.Y(gy);
    const hpx = PERSON_H * p.s * m.k; if (hpx < .8 || X < -hpx || X > W + hpx || Y < -hpx * 1.2 || Y > H + hpx) continue;
    const sc = hpx / 185, look = o.look ? o.look(p) : 0;
    ctx.save(); ctx.translate(X, Y); ctx.rotate(ang);
    if (sc > .34 && o.live !== false) {
      // live: breath, weight, the head lifts (figureBack at its own fixed size, the context scaled: one cache size, no leak per zoom)
      ctx.scale(sc, sc);
      figureBack(ctx, 0, 0, 1, { t, seed: p.seed, hold: 'none', dress: { coat: p.coat }, accent: p.acc, headTilt: -.3 * look, light: LIGHT(1) });
    } else {
      const [i0, i1] = SPR.get(p.seed), k = sc / SPS;
      ctx.drawImage(look > .5 ? i1 : i0, -SOX * k, -SOY * k, SPW * k, SPH * k);
    }
    ctx.restore();
  }
}
// the crest: a dark hill line along the limb round the people (grass tufts, round trees), seen against the dawn; a 0..1 (detail level)
const TREES = (() => { const r = prng(77), o = []; for (const [x0, x1, n] of [[318, 372, 3], [622, 668, 2]]) for (let i = 0; i < n; i++) o.push({ x: x0 + (i + .2 + .6 * r()) * (x1 - x0) / n, h: 34 + 16 * r(), seed: o.length }); return o; })();
export function crest(ctx, t, m, a = 1) {
  const cx = m.X(0), cy = m.Y(0), r = EARTH.R * m.k;
  // the hill body: the land just below the crest darkens to a silhouette (backlit by the dawn)
  if (a > 0 && r > 4000) {
    const g = ctx.createRadialGradient(cx, cy, r - 70 * m.k, cx, cy, r + 1);
    g.addColorStop(0, 'rgba(8,8,22,0)'); g.addColorStop(.55, rgba('#0a0a1c', .55 * a)); g.addColorStop(.9, rgba('#07071a', .9 * a)); g.addColorStop(1, rgba('#07071a', .95 * a));
    ctx.save(); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r + 1, 0, TAU); ctx.arc(cx, cy, Math.max(1, r - 70 * m.k), 0, TAU, true); ctx.fill('evenodd'); ctx.restore();
    // grass along the crest (fine strokes, rim-lit from the dawn side)
    if (m.k > 1.2) {
      ctx.save(); ctx.lineCap = 'round';
      const rr = prng(31), A0 = Math.asin(clamp((m.x(-40)) / EARTH.R, -1, 1)), A1 = Math.asin(clamp((m.x(W + 40)) / EARTH.R, -1, 1));
      for (let i = 0; i < 520; i++) {
        const th = mix(A0, A1, rr()), hh = (2 + 4 * rr()) * m.k, lean = (rr() - .3) * .6 + .08 * Math.sin(t * 1.3 + i), X = cx + r * Math.sin(th), Y = cy - r * Math.cos(th);
        ctx.strokeStyle = rr() < .35 ? rgba('#ffcf9a', .35 * a) : rgba('#07071a', .95 * a); ctx.lineWidth = Math.max(.7, .35 * m.k);
        ctx.beginPath(); ctx.moveTo(X, Y + 1); ctx.lineTo(X + Math.sin(th + lean) * hh, Y - Math.cos(th + lean) * hh); ctx.stroke();
      }
      ctx.restore();
    }
  }
  // round trees on the crest (c07's forest crowns), always there (tiny bumps on the limb in the wide views)
  ctx.save(); ctx.fillStyle = '#0a0a1a'; ctx.strokeStyle = 'rgba(255,214,160,.45)';
  for (const tr of TREES) {
    const s = tr.h * m.k; if (s < 1.2) continue;
    const X = m.X(tr.x), Y = m.Y(limbY(tr.x) + 2); if (X < -s || X > W + s || Y < -s || Y > H + s) continue;
    ctx.save(); ctx.translate(X, Y); ctx.rotate(Math.asin(clamp(tr.x / EARTH.R, -1, 1)) + .015 * Math.sin(t * .8 + tr.seed)); ctx.lineWidth = Math.max(.6, 1.2 * m.k);
    ctx.fillRect(-s * .04, -s * .45, s * .08, s * .45);
    ctx.beginPath(); ctx.arc(0, -s * .62, s * .3, 0, TAU); ctx.arc(-s * .18, -s * .5, s * .22, 0, TAU); ctx.arc(s * .2, -s * .52, s * .23, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -s * .62, s * .3, Math.PI * 1.55, Math.PI * 2.05); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

// ================================================================ TEXT: the comment question
// lines: [[words…], [words…]] with words {w, s, e} from T.W; o: { size, y0, gap, out0 (wipe-out start) }
export function question(ctx, t, lines, o = {}) {
  const size = o.size ?? 72, gap = o.gap ?? size * 1.2, y0 = o.y0 ?? 760, out0 = o.out0 ?? 1e9;
  ctx.save(); ctx.font = `${size}px "Instrument Serif"`;
  lines.forEach((ws, li) => {
    const parts = ws.map((w) => ({ ...w, s2: w.w.replace(/[^A-Za-z?'-]/g, '') }));
    const sp = size * .26, widths = parts.map((p) => ctx.measureText(p.s2).width), tot = widths.reduce((a, b) => a + b, 0) + sp * (parts.length - 1);
    const x0 = W / 2 - tot / 2, y = y0 + li * gap;
    // the mask grows with the spoken words (each word wipes in over its own duration, expo-out), and wipes out to the right
    let xr = x0 - 8, acc = x0;
    parts.forEach((p, i) => { const u = ease.out(lin(p.s - .08, p.s + .38, t)); if (u > 0) xr = acc + (widths[i] + (i < parts.length - 1 ? sp : 12)) * u; acc += widths[i] + sp; });
    const ob = ease.inn(lin(out0 + li * .12, out0 + li * .12 + .55, t)), xl = mix(x0 - 12, x0 + tot + 16, ob);
    if (xr <= xl) return;
    ctx.save(); ctx.beginPath(); ctx.rect(xl, y - size * 1.05, xr - xl, size * 1.45); ctx.clip();
    ctx.shadowColor = 'rgba(4,4,16,.6)'; ctx.shadowBlur = 18;
    let x = x0; parts.forEach((p, i) => { text(ctx, p.s2, x, y, { size, font: 'Instrument Serif', color: '#f6efdc' }); x += widths[i] + sp; });
    ctx.restore();
  });
  ctx.restore();
}

// ================================================================ END SCREEN: the regions left free (screen px, at camera float 1) and their calm
// YouTube end-screen elements are placed by the editor; these are the boxes this plate keeps dark and empty (a 30 px float margin included):
export const SAFE = { left: [120, 290, 700, 625], right: [1220, 290, 1800, 625], subscribe: { cx: 960, cy: 712, r: 92 } };
export function endShade(ctx, a) {
  if (a <= 0) return;
  ctx.save();
  for (const [x0, y0, x1, y1] of [SAFE.left, SAFE.right]) {
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, R = (x1 - x0) * .75;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(1, .68);
    const g = ctx.createRadialGradient(0, 0, R * .2, 0, 0, R); g.addColorStop(0, rgba('#03040e', .42 * a)); g.addColorStop(.6, rgba('#03040e', .3 * a)); g.addColorStop(1, 'rgba(3,4,14,0)');
    ctx.fillStyle = g; ctx.fillRect(-R, -R, 2 * R, 2 * R); ctx.restore();
  }
  { const { cx, cy, r } = SAFE.subscribe, R = r * 1.9, g = ctx.createRadialGradient(cx, cy, r * .3, cx, cy, R); g.addColorStop(0, rgba('#03040e', .32 * a)); g.addColorStop(1, 'rgba(3,4,14,0)'); ctx.fillStyle = g; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R); }
  ctx.restore();
}
