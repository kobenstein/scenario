// c07 · the void (7.04–7.07): the hall has gone up in smoke; the fragment (E0's last steps, the comb, a piece of the landing) floats in
// the plate's dark ground. The same take goes on from lib/v2_c07_hall.mjs (same objects, same camera at K.TV, so the switch is invisible):
// 7.04 "slump": you sit down where you stand, on the last step at the comb, knees up, the phone's cyan on your face; the camera starts
//      a slow circle round the fragment (yaw about you).
// 7.05 "hangover, not a destiny": dawn floods in from the right (gold, slow), the cyan pales; on "destiny" your head lifts to the light.
// 7.06 "woken up": in the sunbeam a slip of paper drifts down, turning, and lands face up in front of your feet; the camera tilts down
//      with it and ends straight above it (7.07: the lottery ticket, lib/v2_c07_paper.mjs, its numbers turn to amber foil on "winners").
//   voidInit(K)               times and places (after hallInit)
//   voidCam(t, K)             the camera (continues hallCam; orbit → follow the slip → straight down onto the ticket)
//   ticketM(t, K)             the ticket's screen affine (ticket mm → screen) once it lies on the deck, from the camera
//   voidTake(ctx, t, K)       the frame
import { W, H, rgba, clamp, mix, prng } from '../engine.mjs';
import { Path2D } from '@napi-rs/canvas';
import { reachArm, life } from './figure.mjs';
import { TAU, sstep, cio, qio, mixHex, proj, pline, linePlateBG, glowAt, path2 } from './v2_c07_kit.mjs';
import { F, COL, E0, HERO, geo, heroX, KEEP, e0Frag } from './v2_c07_world.mjs';
import { drawEsc, drawBridge, drawHero, heroPose, lerpPose } from './v2_c07_esc.mjs';
import { hallCam, B0A, heroLit, heroCyan, e0SA } from './v2_c07_hall.mjs';
import { drawTicket, drawPaperPhase, paperM, TICKET } from './v2_c07_paper.mjs';

const U = 185 / 1.75;                     // figure units per metre
const DECK = E0.yb + E0.R;                // the landing deck (36 m)
const GOLD = '#ffcf8a', SUN = (() => { const v = [.78, .34, -.52], m = Math.hypot(...v); return v.map((c) => c / m); })();
export const VOID = { phi: .3, ticket: { du: .76, dz: .36 } };

export function voidInit(K) {
  const xF = heroX(K);
  K.xF = xF; K.seat = [xF - .5, DECK + .092, E0.z]; K.pivot = [xF - .25, DECK + .62, E0.z];
  K.T0 = [xF + VOID.ticket.du, DECK + .0025, E0.z + VOID.ticket.dz];   // where the ticket comes to rest (centre), long axis along yaw
  K.alpha = VOID.phi;                                                    // its long axis turns with the camera's final yaw
  K.orbit1 = K.slip0 + 1.1;
}

// ---------------------------------------------------------------- light
export const dawnAt = (t, K) => sstep(K.dawn0, K.dawn1, t);
const cyanAt = (t, K) => heroCyan(t, K) * (1 - .72 * dawnAt(t, K));

// ---------------------------------------------------------------- the hero sits down (feet planted, hips go back and down)
// leg IK in figure units (y down): hip joint (hx, hy), ankle (ax, ay) → thigh angle a (0 = down, + forward) and knee k (figure.mjs)
export function legIK(hx, hy, ax, ay) {
  const dx = ax - hx, dy = ay - hy, d = clamp(Math.hypot(dx, dy), 4, 87.6), psi = Math.atan2(dx, dy);
  const al = Math.acos(clamp((45 * 45 + d * d - 43 * 43) / (2 * 45 * d), -1, 1)), a = psi + al;
  const kx = hx + Math.sin(a) * 45, ky = hy + Math.cos(a) * 45, sh = Math.atan2(ax - kx, ay - ky);
  return { a, k: a - sh, kx, ky };
}
// the hero's hip (world) and pose at t: standing (hall) → sitting down → slumped → head up to the light → following the slip
export function heroSeat(t, K) {
  const stand = heroPose(t, K);
  if (t <= K.sit0) return { pose: stand, hip: null, sitting: false };
  const u = clamp((t - K.sit0) / (K.sit1 - K.sit0)), fall = cio(clamp(u / .92));
  const hx = K.xF + (K.seat[0] - K.xF) * sstep(0, .8, u), hy = mix(DECK + .87, K.seat[1], fall);
  // ankles stay where the feet stand (sole on the deck, ankle 4.8 units above it)
  const ay = (hy - (DECK + 4.8 / U)) * U, legs = [0, 1].map((i) => legIK(i ? -4 : 4, 0, (K.xF + (i ? -4 : 4) / U - hx) * U, ay));
  // the life of a standing figure (weight shift) is taken back while still "standing" in figure.mjs's sense, so the feet stay put
  const Lf = life(t, HERO.seed), w = Lf.w, sitting = legs[0].a > 1, kk = sstep(0, .22, u);
  const hip = [legs[0].a, legs[1].a], kn = [legs[0].k, legs[1].k];
  if (!sitting) { hip[0] -= w * .05 * kk; hip[1] += w * .05 * kk; kn[w > 0 ? 1 : 0] -= Math.abs(w) * .1 * kk; }
  const legP = { hip: [mix(stand.hip?.[0] ?? .05, hip[0], kk), mix(stand.hip?.[1] ?? -.05, hip[1], kk)], kn: [mix(stand.kn?.[0] ?? 0, kn[0], kk), mix(stand.kn?.[1] ?? 0, kn[1], kk)], ft: [0, 0] };
  // torso: forward to keep the balance on the way down, back a little on landing, then the slump
  const lean = u < 1 ? mix(.1, .5, sstep(0, .45, u)) * (1 - sstep(.55, 1, u)) + .22 * sstep(.55, 1, u) : mix(.22, .36, sstep(K.sit1, K.sit1 + .7, t));
  let head = u < 1 ? mix(.46, .3, sstep(0, .5, u)) + .22 * sstep(.6, 1, u) : .52;
  // arms: the phone at the chest while sitting down; then the forearms on the knees, the phone between them
  const knee = [legs[0].kx, legs[0].ky], o = { t, seed: HERO.seed };
  let tgt0 = [knee[0] + 9, knee[1] + 9], tgt1 = [knee[0] + 4, knee[1] + 11];
  const lift = sstep(K.lift, K.lift + .75, t);
  if (lift > 0) { tgt0 = [mix(tgt0[0], knee[0] + 6, lift), mix(tgt0[1], knee[1] + 21, lift)]; tgt1 = [mix(tgt1[0], knee[0] + 1, lift), mix(tgt1[1], knee[1] + 23, lift)]; }
  let pose = { ...stand, ...legP, lean, head, coat: mix(1, .5, sstep(.3, 1, u)), phone: stand.phone, phoneAng: mix(-.5, -1.05, sstep(.5, 1, u)) };
  const rest = sstep(.62, 1, u) * (1 - 0);
  if (rest > 0) {
    const base = { ...pose, sh: [0, 0], el: [0, 0] }, a0 = reachArm(0, 0, 1, base, 0, false, o, tgt0), a1 = reachArm(0, 0, 1, base, 1, false, o, tgt1);
    pose.sh = [mix(stand.sh[0], a0.sh, rest), mix(stand.sh[1], a1.sh, rest)]; pose.el = [mix(stand.el[0], a0.el, rest), mix(stand.el[1], a1.el, rest)];
    pose.lock = [true, true];
  }
  // "destiny": the head lifts toward the light, the back straightens a little
  if (lift > 0) { pose.lean = mix(pose.lean, .2, lift); head = mix(head, -.24, lift); }
  // the slip: the eyes and the head follow it down
  const sl = slipAt(t, K);
  if (sl && t > K.slip0 + .25) {
    const hw = [hx + Math.sin(pose.lean) * .6, hy + Math.cos(pose.lean) * .6], dx = sl.p[0] - hw[0], dy = hw[1] - sl.p[1];
    const look = clamp(Math.atan2(dy, Math.max(.3, dx)) - pose.lean, -.42, .72), k2 = sstep(K.slip0 + .25, K.slip0 + .9, t);
    head = mix(head, look, k2);
  }
  pose.head = head;
  return { pose, hip: [hx, hy, E0.z], sitting, dxU: sitting ? w : 0 };
}

// ---------------------------------------------------------------- the slip of paper: carried in by the morning air, fluttering down
// (a falling leaf: side to side, tilting into each swing, turning slowly), lands face up at K.T0
export function slipAt(t, K) {
  if (t < K.slip0 || !K.T0) return null;
  const u = clamp((t - K.slip0) / (K.land - K.slip0)), T0 = K.T0;
  const S0 = [T0[0] + 3.0, T0[1] + 3.5, T0[2] - 1.0];
  const fx = 1 - (1 - u) ** 1.6, fy = u < .9 ? u / .9 * .93 + .0 : .93 + .07 * sstep(.9, 1, u);   // drift slows as it nears the deck
  const sw = Math.sin(u * TAU * 2.4), amp = .3 * (1 - u) ** .7;
  const p = [mix(S0[0], T0[0], fx) - amp * sw * .35, mix(S0[1], T0[1], fy) + .06 * (1 - u) * Math.cos(u * TAU * 4.8), mix(S0[2], T0[2], fx) + amp * sw];
  if (u >= 1) p[1] = T0[1];
  const beta = K.alpha + 2.4 * (1 - u) ** 1.4, gam = .75 * (1 - u) ** .9 * Math.cos(u * TAU * 2.4), del = .22 * (1 - u) * Math.sin(u * TAU * 1.7 + 1);
  let e1 = [Math.cos(beta), 0, Math.sin(beta)], e2 = [-Math.sin(beta), 0, Math.cos(beta)], n = [0, 1, 0];
  const rot = (a, b, ang) => [a.map((v, i) => v * Math.cos(ang) + b[i] * Math.sin(ang)), b.map((v, i) => v * Math.cos(ang) - a[i] * Math.sin(ang))];
  [e2, n] = rot(e2, n, gam); [e1, n] = rot(e1, n, del);
  return { p, e1, e2, n, u, landed: u >= 1 };
}
const ticketPt = (K, u, v) => [K.T0[0] + (Math.cos(K.alpha) * u - Math.sin(K.alpha) * v) / 1000, K.T0[1], K.T0[2] + (Math.sin(K.alpha) * u + Math.cos(K.alpha) * v) / 1000];

// ---------------------------------------------------------------- the camera
const lerpCam = (a, b, k) => { const o = { ...a }; for (const key of ['x', 'y', 'z', 'yaw', 'pitch', 'ox', 'oy']) o[key] = mix(a[key] ?? (key === 'ox' ? W / 2 : key === 'oy' ? H / 2 : 0), b[key] ?? (key === 'ox' ? W / 2 : key === 'oy' ? H / 2 : 0), k); o.roll = mix(a.roll || 0, b.roll || 0, k); return o; };
function orbitCam(t, K) {
  const C = hallCam(t, K), ph = VOID.phi * cio(clamp((t - K.TV) / (K.orbit1 - K.TV))), pv = K.pivot;
  const k = sstep(K.TV, K.orbit1, t), dx = C.x - pv[0], dz = C.z - pv[2], c = Math.cos(ph), s = Math.sin(ph), dl = 1 - .1 * k;
  return { ...C, x: pv[0] + (dx * c - dz * s) * dl, y: C.y + .3 * k, z: pv[2] + (dx * s + dz * c) * dl, yaw: ph, pitch: -.03 * k };
}
// the camera straight above the ticket: (cu, cv) mm of the ticket at the frame centre, h m above it, the ticket's long axis level
export function topCam(K, cu, cv, h) { const c = ticketPt(K, cu, cv); return { x: c[0], y: c[1] + h, z: c[2], f: F, yaw: K.alpha, pitch: -Math.PI / 2 + 1e-4, roll: 0, ox: W / 2, oy: H / 2 }; }
// height of the camera over the ticket and the ticket point it looks at, from the landing to the push into the map (log-smooth keys)
export function topPath(t, K) {
  const keys = [[K.land - .7, 2.4], [K.land, .95], [K.td, .27], [K.cover, .093]];
  let h; if (t <= keys[0][0]) h = keys[0][1]; else if (t >= keys[3][0]) h = keys[3][1] * Math.exp(-.08 * sstep(keys[3][0], K.dive0, t)); else {
    let i = 0; while (i < keys.length - 2 && t > keys[i + 1][0]) i++;
    const [t0, h0] = keys[i], [t1, h1] = keys[i + 1], u = (t - t0) / (t1 - t0), e = i === 0 ? u * u * (3 - 2 * u) * .5 + u * .5 : i === 2 ? cio(u) : u;
    h = Math.exp(mix(Math.log(h0), Math.log(h1), e));
  }
  const cu = mix(0, -8, sstep(K.td, K.cover, t)), cv = mix(0, 1.5, sstep(K.td, K.cover, t)) + 2.6 * sstep(K.cover, K.dive0, t) ** 2;   // drifts down with the push: the type stays above y 910, the paper still fills the frame
  return { h, cu, cv };
}
export function voidCam(t, K) {
  let C = orbitCam(t, K);
  // 7.06: tilt down with the slip, then down onto it until the camera looks straight down at the ticket
  if (t > K.slip0) {
    const sl = slipAt(t, K), ka = sstep(K.slip0 + .2, K.land - .4, t);
    if (sl && ka > 0) {
      const E = [C.x, C.y, C.z], tg = [mix(K.pivot[0], sl.p[0], .55), mix(K.pivot[1], sl.p[1], .7), mix(K.pivot[2], sl.p[2], .6)];
      const vx = tg[0] - E[0], vy = tg[1] - E[1], vz = tg[2] - E[2];
      const look = { ...C, yaw: Math.atan2(vx, -vz), pitch: Math.atan2(vy, Math.hypot(vx, vz)), ox: W / 2, oy: H * .46 };
      C = lerpCam(C, look, ka * .85);
    }
    const kb = sstep(K.land - .75, K.td, t);
    if (kb > 0) { const tp = topPath(t, K); C = lerpCam(C, topCam(K, tp.cu, tp.cv, tp.h), qio(kb)); }
  }
  return C;
}
// the light on the ticket once it lies on the deck (the dawn's warm light, evening out as the camera comes down onto it)
export const paperLightAt = (t, K) => ({ lit: mix(.789, 1, sstep(K.td, K.cover + .4, t)), warm: mix(.7, .3, sstep(K.td, K.cover + .4, t)) });
export const foilAt = (t, K) => sstep(K.foil - .05, K.foil + .5, t);
// the ticket's screen affine once it lies on the deck and the camera looks straight down (exact): ticket mm → screen
export function ticketM(t, K) { const { h, cu, cv } = topPath(t, K), q = F / (h * 1000); return [q, 0, 0, q, W / 2 - q * cu, H / 2 - q * cv]; }

// ---------------------------------------------------------------- the void: dark ground, dawn from the right, dust, sunbeams
const DUST = (() => { const r = prng(4711), o = []; for (let i = 0; i < 170; i++) o.push([r(), r(), r(), r() * TAU, .12 + r() * .25, r()]); return o; })();
function sunScreen(P, C) { return P(C.x + SUN[0] * 1e4, C.y + SUN[1] * 1e4, C.z + SUN[2] * 1e4); }
function dawnSky(ctx, P, C, t, K, dw) {
  if (dw <= .001) return;
  const s = sunScreen(P, C), x = s[2] > 0 ? s[0] : W * 1.6, y = s[2] > 0 ? s[1] : -H * .3, r = W * (1.05 + .5 * dw);
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba('#fff4dc', .95)); g.addColorStop(.12, rgba('#ffd9a0', .85)); g.addColorStop(.3, rgba('#f2a36e', .62)); g.addColorStop(.55, rgba('#8a5a78', .34)); g.addColorStop(.8, rgba('#3a3266', .12)); g.addColorStop(1, rgba('#2a2a5a', 0));
  ctx.save(); ctx.globalAlpha = dw; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
}
function sunbeams(ctx, P, C, t, K, dw) {
  if (dw <= .01) return;
  const c = [K.xF + .9, DECK, E0.z + .2];
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [ox, oz, w, a] of [[-.6, -.3, .55, .1], [.2, .25, .4, .13], [1.0, -.6, .7, .07], [-1.7, .4, .5, .06], [.85, .7, .3, .09]]) {
    const b0 = [c[0] + ox, c[1], c[2] + oz], far = 26, b1 = [b0[0] + SUN[0] * far, b0[1] + SUN[1] * far, b0[2] + SUN[2] * far];
    const side = [-SUN[2], 0, SUN[0]], sm = Math.hypot(side[0], side[2]); side[0] /= sm; side[2] /= sm;
    const q = [[b0[0] - side[0] * w, b0[1], b0[2] - side[2] * w], [b0[0] + side[0] * w, b0[1], b0[2] + side[2] * w], [b1[0] + side[0] * w * 2.2, b1[1], b1[2] + side[2] * w * 2.2], [b1[0] - side[0] * w * 2.2, b1[1], b1[2] - side[2] * w * 2.2]].map((p) => P(p[0], p[1], p[2]));
    if (q.some((p) => p[2] < .3)) continue;
    const m0 = [(q[0][0] + q[1][0]) / 2, (q[0][1] + q[1][1]) / 2], m1 = [(q[2][0] + q[3][0]) / 2, (q[2][1] + q[3][1]) / 2];
    const g = ctx.createLinearGradient(m0[0], m0[1], m1[0], m1[1]); g.addColorStop(0, rgba(GOLD, a * dw * .9)); g.addColorStop(.5, rgba(GOLD, a * dw * .5)); g.addColorStop(1, rgba(GOLD, 0));
    ctx.fillStyle = g; ctx.beginPath(); pline(ctx, q); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}
function dust(ctx, P, C, t, K, dw, k0 = 1) {
  if (k0 <= .01) return;
  const box = [K.xF - 5, DECK - 2.5, E0.z - 5], size = [13, 7.5, 9];
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [a, b, c, ph, sp, k] of DUST) {
    const x = box[0] + ((a * size[0] + Math.sin(t * sp + ph) * .4 - t * .05) % size[0] + size[0]) % size[0], y = box[1] + ((b * size[1] + Math.cos(t * sp * .8 + ph) * .3 - t * .06 * (.5 + k)) % size[1] + size[1]) % size[1], z = box[2] + c * size[2];
    const p = P(x, y, z); if (p[2] < .4 || p[0] < -10 || p[0] > W + 10 || p[1] < -10 || p[1] > H + 10) continue;
    const near = Math.exp(-Math.abs(y - DECK - 1.2) / 3), tw = .55 + .45 * Math.sin(t * (1.2 + k) + ph * 3);
    const al = (.05 + .5 * dw * near) * tw * k0, s = Math.max(.9, .018 * p[3]);
    if (al < .02) continue;
    ctx.fillStyle = rgba(mixHex('#a9bde8', '#ffe2b0', dw), Math.min(.8, al)); ctx.fillRect(p[0] - s / 2, p[1] - s / 2, s, s);
  }
  ctx.restore();
}
// the landing deck from close by: diamond plate (only once the camera is low over it)
function deckPlate(ctx, P, C, t, K, Lw, warm) {
  const c = K.T0, x0 = Math.max(B0A.x0, c[0] - .75), x1 = Math.min(B0A.x1, c[0] + .75), z0 = Math.max(B0A.z0, c[2] - .7), z1 = Math.min(B0A.z1, c[2] + .45);
  const pc = P(c[0], c[1], c[2]); if (pc[2] < .02 || pc[3] < 220) return;
  const k = clamp((pc[3] - 220) / 300);
  ctx.save();
  const pts = []; for (const [x, z] of [[x0, z0], [x1, z0], [x1, z1], [x0, z1]]) pts.push(P(x, DECK, z)); ctx.clip(path2(pts));
  const hi = mixHex('#7d8fbf', '#ffd9a0', warm), sh = '#05070f';
  for (let x = Math.ceil(x0 / .032) * .032; x < x1; x += .032) for (let z = Math.ceil(z0 / .032) * .032, j = 0; z < z1; z += .032, j++) {
    const o = (Math.round(x / .032) + Math.round(z / .032)) % 2 ? 1 : -1, cx = x + .016, cz = z + .016, L = .011, Wd = .0028;
    const a = [cx - L * .7, cz - L * .7 * o], b = [cx + L * .7, cz + L * .7 * o], nx = -(b[1] - a[1]) / (L * 1.98) * Wd, nz = (b[0] - a[0]) / (L * 1.98) * Wd;
    const q = [P(a[0], DECK, a[1]), P((a[0] + b[0]) / 2 + nx, DECK, (a[1] + b[1]) / 2 + nz), P(b[0], DECK, b[1]), P((a[0] + b[0]) / 2 - nx, DECK, (a[1] + b[1]) / 2 - nz)];
    ctx.fillStyle = rgba(sh, .45 * k * Lw); ctx.beginPath(); pline(ctx, q.map((p) => [p[0] + 1.2, p[1] + 1.2])); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(hi, .32 * k * Lw); ctx.beginPath(); pline(ctx, q); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the frame
export function voidTake(ctx, t, K) {
  if (t >= K.cover) { const pl = paperLightAt(t, K); drawPaperPhase(ctx, paperM(t, K, ticketM(t, K)), t, K, pl); return null; }
  const C = voidCam(t, K), P = proj(C), dw = dawnAt(t, K), cy = cyanAt(t, K), down = t > K.slip0 ? sstep(K.land - .75, K.td, t) : 0;
  linePlateBG(ctx, t);
  dawnSky(ctx, P, C, t, K, dw);
  // the fragment and you, lit by the phone and then by the dawn (the same calls as the hall's last frames)
  const Lf = e0Frag(t, K) + .55 * dw, gold = mixHex(COL.ironHi, '#ffd59a', dw), sA = e0SA(t, K);
  drawBridge(ctx, P, C, B0A, t, K, 'back', { L: Lf, hi: dw > 0 ? gold : undefined });
  if (dw > .01 && C.y > DECK) deckGlow(ctx, P, C, t, K, dw);
  deckPlate(ctx, P, C, t, K, clamp(Lf), dw);
  const sl = slipAt(t, K);
  const seat = heroSeat(t, K), hero = () => {
    const lit = heroLit(t, K) * (1 - dw) + (.25 + .6 * dw) * dw;
    const sun = sunScreen(P, C);
    const light = (s) => {
      const hp = P(...(seat.hip || [K.xF, DECK + .87, E0.z]));
      const cyL = { x: 60 * s, y: -10 * s, col: COL.cyan, a: .32 * cy };
      if (dw < .02) return cy > .01 ? cyL : null;
      const dx = (sun[2] > 0 ? sun[0] : W * 2) - hp[0], dy = (sun[2] > 0 ? sun[1] : -H) - hp[1], m = Math.hypot(dx, dy) || 1;
      return { x: mix(cyL.x, dx / m * 600, dw), y: mix(cyL.y, dy / m * 600, dw), col: mixHex(COL.cyan, '#ffc887', dw), a: mix(.32 * cy, .62, dw) };
    };
    // below the deck nothing of you shows (a long coat on the floor): clip to the half plane above the deck line at your depth
    const a = P(K.xF - 3, DECK, E0.z), b = P(K.xF + 3, DECK, E0.z);
    ctx.save(); const cp = new Path2D(); const nx = b[1] - a[1], ny = a[0] - b[0], m = Math.hypot(nx, ny) || 1, ux = nx / m * 3000, uy = ny / m * 3000, s0 = [a[0] - (b[0] - a[0]) * 10, a[1] - (b[1] - a[1]) * 10], s1 = [b[0] + (b[0] - a[0]) * 10, b[1] + (b[1] - a[1]) * 10];
    const up = uy < 0 ? 1 : -1; cp.moveTo(s0[0], s0[1]); cp.lineTo(s1[0], s1[1]); cp.lineTo(s1[0] + ux * up, s1[1] + uy * up); cp.lineTo(s0[0] + ux * up, s0[1] + uy * up); cp.closePath(); ctx.clip(cp);
    drawHero(ctx, P, C, t, K, { L: 1, lit, morning: 0, cyan: cy, pose: seat.pose, hip: seat.hip || undefined, light, rimC: dw > .02 ? mixHex(COL.rim, '#ffd08a', dw) : undefined, rimA: dw > .02 ? .25 + .65 * dw : undefined, dxU: seat.dxU });
    ctx.restore();
  };
  drawEsc(ctx, P, C, E0, t, K, { L: Lf, dark: false, morning: 0, sA, hi: dw > 0 ? gold : undefined, mid: hero });
  drawBridge(ctx, P, C, B0A, t, K, 'front', { L: Lf, hi: dw > 0 ? gold : undefined });
  if (sl) drawSlip(ctx, P, C, t, K, sl, dw);
  sunbeams(ctx, P, C, t, K, dw * (1 - down));
  dust(ctx, P, C, t, K, dw * (1 - down), 1 - down);
  return { C, P };
}
// the warm light lying on the deck round you
function deckGlow(ctx, P, C, t, K, dw) {
  const c = P(K.xF + .6, DECK, E0.z + .3); if (c[2] < .2) return;
  const rx = 2.6 * c[3], ry = Math.max(4, rx * Math.abs((C.y - DECK) / Math.max(.3, c[2])) * 1.2);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx); g.addColorStop(0, rgba('#ffd9a0', .2 * dw)); g.addColorStop(1, rgba('#ffd9a0', 0));
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(c[0], c[1]); ctx.scale(1, Math.min(1, ry / rx)); ctx.fillStyle = g; ctx.fillRect(-rx, -rx, 2 * rx, 2 * rx); ctx.restore();
}
// the slip in 3D: an affine image of the ticket from its centre and two axes; a soft contact shadow as it nears the deck
function drawSlip(ctx, P, C, t, K, sl, dw) {
  const { p, e1, e2, n } = sl, hgt = p[1] - DECK;
  if (hgt < .5) {
    const k = 1 - hgt / .5, c = P(p[0], DECK + .001, p[2]); if (c[2] > .05) {
      const rx = .11 * c[3] * (1 + hgt), g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx); g.addColorStop(0, rgba('#05070f', .45 * k * k)); g.addColorStop(1, rgba('#05070f', 0));
      const ry = rx * Math.min(1, Math.abs((C.y - DECK) / Math.max(.05, c[2])) + .15);
      ctx.save(); ctx.translate(c[0], c[1]); ctx.rotate(Math.atan2(P(p[0] + Math.cos(K.alpha) * .1, DECK, p[2] + Math.sin(K.alpha) * .1)[1] - c[1], P(p[0] + Math.cos(K.alpha) * .1, DECK, p[2] + Math.sin(K.alpha) * .1)[0] - c[0]));
      ctx.scale(1.9, ry / rx * .9); ctx.fillStyle = g; ctx.fillRect(-rx, -rx, 2 * rx, 2 * rx); ctx.restore();
    }
  }
  const d = .01, o = P(...p), a = P(p[0] + e1[0] * d, p[1] + e1[1] * d, p[2] + e1[2] * d), b = P(p[0] + e2[0] * d, p[1] + e2[1] * d, p[2] + e2[2] * d);
  if (o[2] < .03) return;
  const M = [(a[0] - o[0]) / 10, (a[1] - o[1]) / 10, (b[0] - o[0]) / 10, (b[1] - o[1]) / 10, o[0], o[1]];
  const view = [C.x - p[0], C.y - p[1], C.z - p[2]], front = n[0] * view[0] + n[1] * view[1] + n[2] * view[2] > 0;
  const ndl = Math.max(0, n[0] * SUN[0] + n[1] * SUN[1] + n[2] * SUN[2]) * (front ? 1 : .6);
  // specular: the sun's reflection toward the camera
  const vm = Math.hypot(...view), r = [2 * ndl * n[0] - SUN[0], 2 * ndl * n[1] - SUN[1], 2 * ndl * n[2] - SUN[2]], spec = Math.pow(Math.max(0, (r[0] * view[0] + r[1] * view[1] + r[2] * view[2]) / vm), 24);
  if (sl.landed) { drawTicket(ctx, M, t, K, { ...paperLightAt(t, K), foil: foilAt(t, K) }); return; }
  const lit = mix(.42, 1, dw * (.45 + .55 * ndl));
  drawTicket(ctx, M, t, K, { back: !front, lit, warm: dw * .7, foil: 0, glint: spec * dw * (1 - sl.u) });
}
