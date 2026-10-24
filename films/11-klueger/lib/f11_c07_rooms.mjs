// Film 11 · c07 / c08 / c10 · rooms behind the city's windows (builder c07/c08/c10).
//   room(ctx, t, V, R)                the inside of a lit room seen through a window (3D box: floor, ceiling, walls; warm lamp light)
//                                     R: { x0, x1, z0, z1, y0 (floor), y1 (ceiling), wall, floor, lamp: [x, y, z], open: 0|1|2|3 (the window wall: not drawn) }
//   classDesk(ctx, V, p, o)           a school desk whose student sits on its +z side facing −z (seen from −x: facing screen right)
//   boardOnX(V, x, zL, yT)            affine frame (cm) for a board on a wall at x (seen from −x: u → −z, v → −y)
//   heroWindow(ctx, t, V, w, st, o)   people and the machine inside a window, at figure scale (kit athlete + K.machine), in screen space:
//                                     st.fig: 'train' (you curl, the hand of light on your back) | 'lift' | 'sit' (the forks hold your weight) |
//                                     'bent' (over a grey feed) | 'tutor' (a child at a desk, a tutor beside) | 'kid' (a child, desk machine)
//                                     st.fork, st.hand (0…1: forklift → trainer), st.glow
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, prng, canvas } from '../engine.mjs';
import * as K from './f11_kit.mjs';
import { winFrame, hx, mx, css, rgrad, lgrad } from './f11_c07_city.mjs';

const TAU = Math.PI * 2;

export function room(ctx, t, V, R) {
  const { x0, x1, z0, z1 } = R, y0 = R.y0 ?? 0, y1 = R.y1 ?? 3.2, cam = V.cam;
  const wall = hx(R.wall || '#ecd9b6'), flo = hx(R.floor || '#b98a57'), lamp = R.lamp || [(x0 + x1) / 2, y1 - .5, (z0 + z1) / 2];
  const faces = [
    { n: [0, 1, 0], pts: [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], col: flo, k: .92 },
    { n: [0, -1, 0], pts: [[x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0]], col: mx(wall, [255, 240, 215], .2), k: .8 },
    { n: [1, 0, 0], open: 0, pts: [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], col: wall, k: .9 },
    { n: [-1, 0, 0], open: 1, pts: [[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]], col: wall, k: 1 },
    { n: [0, 0, 1], open: 2, pts: [[x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]], col: wall, k: .95 },
    { n: [0, 0, -1], open: 3, pts: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], col: wall, k: .95 },
  ];
  const Lp = V.P(lamp);
  for (const F of faces) {
    if (F.open === R.open) continue;
    const c = F.pts.reduce((a, p) => [a[0] + p[0] / 4, a[1] + p[1] / 4, a[2] + p[2] / 4], [0, 0, 0]);
    if ((cam.x - c[0]) * F.n[0] + (cam.y - c[1]) * F.n[1] + (cam.z - c[2]) * F.n[2] <= 0) continue;
    if (!V.poly(ctx, F.pts)) continue;
    ctx.fillStyle = css(F.col.map((v) => v * F.k * (R.dim ?? 1))); ctx.fill();
    if (Lp.z > .1) { const r = Lp.k * 6; const g = rgrad(ctx, Lp.x, Lp.y, 0, r); g.addColorStop(0, rgba('#fff0cc', .5)); g.addColorStop(.5, rgba('#ffd9a0', .18)); g.addColorStop(1, rgba('#ffd9a0', 0)); ctx.save(); ctx.clip(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g; ctx.fillRect(Lp.x - r, Lp.y - r, 2 * r, 2 * r); ctx.restore(); }
  }
  // the pendant lamp (a warm globe on a cord, like the hall's)
  if (Lp.z > .1 && R.globe !== false) {
    const top = V.P([lamp[0], y1, lamp[2]]), r = Math.max(2, Lp.k * .16);
    ctx.strokeStyle = 'rgba(40,26,18,.7)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(top.x, top.y); ctx.lineTo(Lp.x, Lp.y); ctx.stroke();
    const g = rgrad(ctx, Lp.x, Lp.y + r * .3, 0, r); g.addColorStop(0, '#fff6e2'); g.addColorStop(1, '#ffd08a'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(Lp.x, Lp.y + r * .3, r, 0, TAU); ctx.fill();
  }
}

export function classDesk(ctx, V, p, o = {}) {
  const [x, , z] = p, hl = .5, hw = .28, y = .72, k = V.P([x, .4, z]).k; if (!(k > 0)) return;
  const fill = (pts, c) => { if (V.poly(ctx, pts)) { ctx.fillStyle = c; ctx.fill(); } };
  ctx.strokeStyle = '#6b4a30'; ctx.lineWidth = Math.max(1, k * .035); ctx.beginPath();
  for (const [dx, dz] of [[-hl + .05, -hw + .05], [hl - .05, -hw + .05], [hl - .05, hw - .05], [-hl + .05, hw - .05]]) V.seg(ctx, [x + dx, 0, z + dz], [x + dx, y, z + dz]);
  ctx.stroke();
  fill([[x - hl, y, z - hw], [x - hl, y, z + hw], [x - hl, y - .06, z + hw], [x - hl, y - .06, z - hw]], '#8e6240');
  fill([[x - hl, y, z + hw], [x + hl, y, z + hw], [x + hl, y - .06, z + hw], [x - hl, y - .06, z + hw]], '#9a6b45');
  fill([[x - hl, y, z - hw], [x + hl, y, z - hw], [x + hl, y, z + hw], [x - hl, y, z + hw]], o.top || '#c99a66');
  if (o.sheet) fill([[x - .15, y + .002, z - .02], [x + .1, y + .002, z - .05], [x + .12, y + .002, z + .15], [x - .13, y + .002, z + .18]], K.PAL.paper);
}
export function boardOnX(V, x, zL, yT, upm = 100) {
  const o = V.P([x, yT, zL]), ux = V.P([x, yT, zL - 1]), vy = V.P([x, yT - 1, zL]);
  if (!(o.z > .1 && ux.z > .1 && vy.z > .1)) return null;
  return { a: (ux.x - o.x) / upm, b: (ux.y - o.y) / upm, c: (vy.x - o.x) / upm, d: (vy.y - o.y) / upm, e: o.x, f: o.y };
}

// a person standing / sitting at a world point (feet), facing screen right unless flip
export function personAt(ctx, t, V, p, pose, o = {}) {
  const S = K.sprite(V, p); if (!S.vis || S.z < .4) return null;
  const s = S.s * (o.scale ?? 1), hipY = S.y - (o.seated ? 46 : 88) * s;
  return K.athlete(ctx, S.x, hipY, s, pose, { t, seed: o.seed ?? 3, dress: o.dress, arm: o.arm ?? 1, flip: o.flip, rimW: Math.max(1, .7 * s) });
}

// ---------------------------------------------------------------- people inside a window, at figure scale
const SIT = { hip: [1.42, 1.5], kn: [1.42, 1.5], sh: [.35, .25], el: [.55, .7], lean: .08, head: .1 };
const BENT = { hip: [1.42, 1.5], kn: [1.42, 1.5], sh: [.62, .5], el: [1.1, 1.2], lean: .3, head: .45 };
export const DRESSES = [
  { coat: '#3f7f8a', pants: '#2e3448', shoes: '#2a221c', skin: K.PAL.skin[1], hair: '#2a1a14', sleeve: 'short' },
  { coat: '#c46a45', pants: '#2e3448', shoes: '#2a221c', skin: K.PAL.skin[2], hair: '#1c1420', sleeve: 'short' },
  { coat: '#e2b04a', pants: '#3a3a48', shoes: '#2a221c', skin: K.PAL.skin[0], hair: '#5a3a24', sleeve: 'short' },
  { coat: '#8a9a5b', pants: '#2e3448', shoes: '#2a221c', skin: K.PAL.skin[4], hair: '#1c1420', sleeve: 'short' },
  { coat: '#b86a7d', pants: '#2e3448', shoes: '#2a221c', skin: K.PAL.skin[3], hair: '#7a5232', sleeve: 'short' },
  { coat: '#6c7fb0', pants: '#2e3448', shoes: '#2a221c', skin: K.PAL.skin[1], hair: '#2a1a14', sleeve: 'short' },
];
export function heroWindow(ctx, t, V, w, st, o = {}) {
  const F = winFrame(V, w, .05); if (!F) return false;
  const ppm = Math.hypot(F.c, F.d); if (!(ppm > 1 && ppm < 900)) return false;
  const at = (u, v) => [F.e + F.a * u + F.c * v, F.f + F.b * u + F.d * v], ww = w.w, seed = Math.floor(w.seed * 997);
  const glow = clamp(st.glow ?? 1), dim = st.dim ?? 0;
  // the room behind the glass: a warm back wall with the lamp's falloff, a darker floor line
  const A = at(0, w.y1 - w.y0), B = at(ww, -1.05);
  const back = mx(mx(hx('#e9cfa2'), hx('#8c7a6a'), dim), hx('#fff0d0'), glow * .25);
  ctx.fillStyle = css(back); ctx.fillRect(Math.min(A[0], B[0]) - 4, Math.min(A[1], B[1]) - 4, Math.abs(B[0] - A[0]) + 8, Math.abs(B[1] - A[1]) + 8);
  const lp = at(ww * (.3 + .4 * (w.seed % .37) / .37), (w.y1 - w.y0) * .9), R = ppm * 1.6;
  const g = rgrad(ctx, lp[0], lp[1], 0, R); g.addColorStop(0, rgba('#fff6e0', .55 * glow)); g.addColorStop(1, rgba('#ffd9a0', 0)); ctx.fillStyle = g; ctx.fillRect(lp[0] - R, lp[1] - R, 2 * R, 2 * R);
  const s = ppm * 1.75 / 185, km = ppm / 100, dress = DRESSES[seed % DRESSES.length];
  const kind = st.fig;
  const floorAt = (u) => at(u, -1.05);
  if (kind === 'train' || kind === 'lift' || kind === 'sit') {
    // the machine stands behind you (to the left in the window), you face right toward the window's right edge
    const mu = ww * .2, yu = ww * .62, M = floorAt(mu), Y = floorAt(yu);
    const fork = clamp(st.fork ?? (kind === 'sit' ? 1 : 0)), hand = clamp(st.hand ?? (kind === 'train' ? 1 : 0));
    const sitting = kind === 'sit' || st.seated, hipY = Y[1] - (sitting ? 46 : 88) * s;
    const per = 2.9 + (seed % 7) * .15, curl = hand > .5 ? .5 - .5 * Math.cos(TAU * (t + seed * .37) / per) * eio(clamp(hand * 2 - 1)) : 0;
    const pose = sitting ? (kind === 'sit' ? SIT : BENT) : K.curl(curl);
    // reach target: your upper back (screen) → machine local
    const reachS = [Y[0] - 24 * s, hipY - (sitting ? 40 : 46) * s], reach = [(reachS[0] - M[0]) / km, (reachS[1] - M[1]) / km];
    // the weight: on the forks (forklift) or in your hand (trainer)
    ctx.save(); ctx.translate(M[0], M[1]); ctx.scale(km, km);
    const topL = [(Y[0] + 20 * s - M[0]) / km, (hipY - 70 * s - M[1]) / km];
    const fy = clamp((-topL[1] - 16) / 134);
    const mo = K.machine(ctx, t, { reach, armOut: hand, fork: fork > .01 ? fy : 0, forkOut: fork, core: 1, noHand: true, seed });
    ctx.restore();
    const hnd = K.athlete(ctx, Y[0], hipY, s, pose, { t, seed: seed + 3, dress, arm: kind === 'sit' ? .85 : mix(.95, 1.15, hand), rimW: Math.max(1, .6 * s) });
    if (hand > .02) { const hp = [M[0] + mo.hand[0] * km, M[1] + mo.hand[1] * km]; K.lightHand(ctx, t, hp[0], hp[1], mo.handAng, { ...mo.handO, s: mo.handO.s * km }); }
    if (fork > .5) { const fp = [M[0] + mo.fork[0] * km, M[1] + (mo.fork[1] - 14) * km]; K.dumbbell(ctx, t, fp[0], fp[1], { r: 11 * km, glow: .12, dim: .2 }); }
    else if (kind !== 'sit') { const h = hnd.hand(0); K.dumbbell(ctx, t, h[0], h[1], { r: 11 * km, glow: .4 + .5 * curl }); }
  } else if (kind === 'bent') {
    const Y = floorAt(ww * .5), hipY = Y[1] - 46 * s;
    const hnd = K.athlete(ctx, Y[0], hipY, s, BENT, { t, seed: seed + 5, dress, arm: .85, rimW: Math.max(1, .6 * s) });
    const h = hnd.hand(0), fl = .6 + .25 * Math.sin(t * 2.3 + seed) * Math.sin(t * 1.1 + seed * .7);
    ctx.save(); ctx.translate(h[0], h[1]); ctx.rotate(-.5); ctx.fillStyle = '#4a4440'; ctx.fillRect(-9 * s, -6 * s, 18 * s, 12 * s); ctx.fillStyle = css(mx(hx('#c9d1d2'), hx('#e6ebea'), fl)); ctx.fillRect(-8 * s, -5 * s, 16 * s, 10 * s); ctx.restore();
    const gl = rgrad(ctx, h[0], h[1] - 10 * s, 0, 60 * s); gl.addColorStop(0, rgba('#d8e0e0', .3 * fl)); gl.addColorStop(1, rgba('#d8e0e0', 0)); ctx.fillStyle = gl; ctx.fillRect(h[0] - 60 * s, h[1] - 70 * s, 120 * s, 120 * s);
  } else if (kind === 'tutor' || kind === 'kid') {
    // a child at a desk (smaller figure), a desk lamp; tutor: an adult stands beside, leaning in, pointing at the page
    const cu = ww * .38, C = floorAt(cu), cs = s * .74;
    const desk = [floorAt(ww * .62), floorAt(ww * 1.05)], dy = C[1] - .74 * ppm;
    ctx.fillStyle = '#9a6b45'; ctx.fillRect(desk[0][0], dy, desk[1][0] - desk[0][0], .05 * ppm); ctx.fillStyle = '#c99a66'; ctx.fillRect(desk[0][0], dy - .03 * ppm, desk[1][0] - desk[0][0], .04 * ppm);
    ctx.fillStyle = K.PAL.paper; ctx.fillRect(desk[0][0] + .05 * ppm, dy - .045 * ppm, .25 * ppm, .02 * ppm);
    K.athlete(ctx, C[0], C[1] - 46 * cs, cs, K.GYM.write, { t, seed: seed + 7, dress: DRESSES[(seed + 2) % 6], rimW: Math.max(1, .6 * cs) });
    if (kind === 'tutor') { const T = floorAt(ww * .86); K.athlete(ctx, T[0], T[1] - 88 * s, s, { lean: .22, head: .3, sh: [.9, .3], el: [.5, .4] }, { t, seed: seed + 9, dress: { ...DRESSES[(seed + 4) % 6], coat: '#7a5a48', sleeve: 'long' }, flip: true, rimW: Math.max(1, .6 * s) }); }
    if (st.cool) {   // the small machine of today on the desk (with its trainer hand when st.hand)
      const Mp = [desk[0][0] + .42 * ppm, dy - .03 * ppm];
      ctx.save(); ctx.translate(Mp[0], Mp[1]); ctx.scale(km, km); K.deskMachine(ctx, t, { core: st.cool, dot: st.dot ?? 0, seed }); ctx.restore();
    }
  }
  return true;
}
