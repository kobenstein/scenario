// Chunk c05 · the town on the hill (shots 5.09–5.15): the shared Maslow hill (lib/maslow4.mjs, read-only) in afternoon gold with its top
// lost in haze, grandmother's garden on the quay (drawn here through st.garden), the children chalk-drawing on the quay, the paper plane.
// Hill world units: 1 m = 5.39 units (a 1.75 m figure = .051 × 185). The garden keeps the hill's own layout (pergola, bench, chair, beds,
// low wall with a gate) so it can take over from the hill's garden at the raster/vector switch (z 4.3) without a jump.
import { W, H, rgba, clamp, mix, canvas, TAU, putGlow, mixHex, shade, smo } from './v2_c05_kit.mjs';
import { drawHill, HILL, toScreen } from './maslow4.mjs';
import { figure, figureKid, POSES, KIDPOSES, reachArm, handPos } from './figure.mjs';
import { dartScreen } from './v2_c05_plane.mjs';

const G = HILL.garden, GY = G.ground, ZV = 4.3;
export const UPM = 5.39;
export const SPOT = { you: G.x + 40.4, gran: G.x + 45.6, seatYou: GY - 4.2, seatGran: GY - 4.0, coping: GY - 4.0, land: [G.x + 43.9, GY - 4.15], cat: G.x + 33.2 };
const lerpPose = (a, b, u) => { const o = { ...a, ...b }; for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) { const x = a[k] ?? (Array.isArray(b[k]) ? [0, 0] : 0), y = b[k] ?? (Array.isArray(a[k]) ? [0, 0] : 0); if (Array.isArray(x) || Array.isArray(y)) o[k] = [mix(x[0] ?? 0, y[0] ?? 0, u), mix(x[1] ?? 0, y[1] ?? 0, u)]; else if (typeof x === 'number' && typeof y === 'number') o[k] = mix(x, y, u); else o[k] = u < .5 ? x : y; } return o; };
const STAND = { lean: 0, head: 0, sh: [0.18, 0.08], el: [0.32, 0.26], hip: [0.05, -0.05], kn: [0, 0] };
const SQUAT_DY = (() => { const [, g] = canvas(8, 8); const r = figureKid(g, 0, 0, 1, KIDPOSES.squat, {}); return r.feetY; })();

// ---------------------------------------------------------------- the garden (screen space inside the garden rect)
const WOOD = '#6a4e40', WOOD_L = '#8e7058', LEAF = ['#3e5a46', '#4c6c52', '#5e7e5c', '#36503e'], STONE = '#a8a2b4', STONE_L = '#c6c0d0';
function furniture(ctx, X, Y, z, t) {
  const x = G.x, u = z;
  // pergola posts and beam, rafter ends
  ctx.fillStyle = WOOD; for (const px of [x + 26, x + 50]) ctx.fillRect(X(px - .45), Y(GY - 15.2), .9 * u, 15.2 * u);
  ctx.fillStyle = WOOD_L; for (const px of [x + 26, x + 50]) ctx.fillRect(X(px - .45), Y(GY - 15.2), .28 * u, 15.2 * u);
  ctx.fillStyle = WOOD; ctx.fillRect(X(x + 22), Y(GY - 15.6), 32 * u, .9 * u); ctx.fillStyle = '#4a362e'; for (let rx = x + 23; rx < x + 54; rx += 2.6) ctx.fillRect(X(rx), Y(GY - 15.9), .5 * u, .5 * u);
  // the vine on the pergola: leaves in four greens, a few grapes, swaying a little
  const r = ((s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; })(901);
  for (let i = 0; i < 150; i++) {
    const lx = x + 23 + r() * 30, ly = GY - 16 + (r() - .5) * 5.4 * (1 - Math.abs(lx - (x + 38)) / 22), sw = Math.sin(t * 1.3 + i) * .12, rr = (.75 + r() * .55) * u;
    ctx.fillStyle = LEAF[i % 4]; ctx.beginPath(); ctx.ellipse(X(lx + sw), Y(ly), rr, rr * .72, r() * 3, 0, TAU); ctx.fill();
  }
  ctx.fillStyle = '#5a3a5a'; for (const [gx, gy] of [[x + 30, GY - 13.4], [x + 41.5, GY - 13.0], [x + 47, GY - 13.6]]) for (let j = 0; j < 7; j++) { ctx.beginPath(); ctx.arc(X(gx + (j % 3 - 1) * .32), Y(gy + Math.floor(j / 3) * .36 + .1 * Math.sin(t + gx)), .2 * u, 0, TAU); ctx.fill(); }
  // the vine's trunk up the right post
  ctx.strokeStyle = '#4a3a2e'; ctx.lineWidth = .35 * u; ctx.beginPath(); ctx.moveTo(X(x + 50.6), Y(GY - 4)); for (let k = 0; k <= 10; k++) ctx.lineTo(X(x + 50.6 + Math.sin(k * .9) * .5), Y(GY - 4 - k * 1.15)); ctx.stroke();
  // beds behind the wall: shrubs with flowers
  for (const [bx, c] of [[x + 6, '#c06878'], [x + 14, '#d8a858'], [x + 52, '#9a78ae']]) {
    for (let i = 0; i < 16; i++) { ctx.fillStyle = LEAF[(i + 1) % 4]; ctx.beginPath(); ctx.ellipse(X(bx - 3.6 + (i % 8) * 1.0), Y(GY - 4.6 - (i < 8 ? 0 : 1.2) - Math.sin(i) * .4), .95 * u, .8 * u, 0, 0, TAU); ctx.fill(); }
    ctx.fillStyle = c; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc(X(bx - 3.2 + i * .8), Y(GY - 5.3 - (i % 2) * .9 - Math.sin(i * 2) * .3), .32 * u, 0, TAU); ctx.fill(); }
  }
  // the bench: two back slats, arms, a slatted seat, legs down to the wall
  ctx.fillStyle = WOOD; ctx.fillRect(X(x + 30), Y(GY - 7.3), 11 * u, .55 * u); ctx.fillRect(X(x + 30), Y(GY - 6.3), 11 * u, .55 * u);
  for (const lx of [x + 30, x + 40.4]) { ctx.fillRect(X(lx), Y(GY - 7.6), .6 * u, 6 * u); ctx.fillRect(X(lx - .2), Y(GY - 5.6), 1.0 * u, .4 * u); }
  ctx.fillStyle = WOOD_L; ctx.fillRect(X(x + 29.8), Y(GY - 4.45), 11.4 * u, .5 * u); ctx.fillStyle = shade(WOOD, -.08); ctx.fillRect(X(x + 29.8), Y(GY - 3.95), 11.4 * u, .25 * u);
  // the garden chair (wicker, a cushion), its back to the right
  ctx.fillStyle = '#a07a52'; ctx.beginPath(); ctx.moveTo(X(x + 47.0), Y(GY - 3.9)); ctx.lineTo(X(x + 47.4), Y(GY - 8.6)); ctx.quadraticCurveTo(X(x + 48.1), Y(GY - 9.0), X(x + 48.5), Y(GY - 8.5)); ctx.lineTo(X(x + 48.2), Y(GY - 3.9)); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba('#5a4028', .5); ctx.lineWidth = Math.max(1, .12 * u); ctx.beginPath(); for (let k = 0; k < 9; k++) { ctx.moveTo(X(x + 47.1 + k * .04), Y(GY - 4.2 - k * .5)); ctx.lineTo(X(x + 48.2 + k * .03), Y(GY - 4.2 - k * .5)); } ctx.stroke();
  ctx.fillStyle = '#a07a52'; ctx.fillRect(X(x + 44.2), Y(GY - 4.3), 4.1 * u, .55 * u); ctx.fillRect(X(x + 44.4), Y(GY - 5.9), 3.2 * u, .4 * u); ctx.fillRect(X(x + 44.4), Y(GY - 5.9), .4 * u, 1.7 * u);
  ctx.fillStyle = '#c99a86'; ctx.beginPath(); ctx.ellipse(X(x + 46.1), Y(GY - 4.45), 1.9 * u, .42 * u, 0, 0, TAU); ctx.fill();
}
function wall(ctx, X, Y, z) {
  const x = G.x, u = z;
  // the low garden wall along the quay (face, block joints, coping) and the iron gate between its two parts
  for (const [a, b] of [[x - .4, x + 20.4], [x + 26.6, x + 56.4]]) {
    const g = ctx.createLinearGradient(0, Y(GY - 3.4), 0, Y(GY)); g.addColorStop(0, shade(STONE, .02)); g.addColorStop(1, shade(STONE, -.12));
    ctx.fillStyle = g; ctx.fillRect(X(a + .4), Y(GY - 3.4), (b - a - .8) * u, 3.4 * u);
    if (u > 6) { ctx.strokeStyle = rgba('#4a4458', .22); ctx.lineWidth = Math.max(1, .08 * u); ctx.beginPath(); for (const yy of [GY - 2.2, GY - 1.0]) { ctx.moveTo(X(a + .4), Y(yy)); ctx.lineTo(X(b - .4), Y(yy)); } for (let bx = a + 2; bx < b - 1; bx += 2.6) { const o = Math.round((bx - a) / 2.6) % 2 ? 1.3 : 0; ctx.moveTo(X(bx + o), Y(GY - 3.4)); ctx.lineTo(X(bx + o), Y(GY - 2.2)); ctx.moveTo(X(bx + 1.3 - o), Y(GY - 2.2)); ctx.lineTo(X(bx + 1.3 - o), Y(GY - 1.0)); } ctx.stroke(); }
    ctx.fillStyle = STONE_L; ctx.fillRect(X(a), Y(GY - 4.0), (b - a) * u, .9 * u);
    ctx.fillStyle = rgba('#3a3448', .25); ctx.fillRect(X(a), Y(GY - 3.1), (b - a) * u, .22 * u);
  }
  ctx.strokeStyle = '#2a2632'; ctx.lineWidth = Math.max(1, .22 * u); ctx.beginPath(); for (let gx = x + 20.9; gx < x + 26.6; gx += .9) { ctx.moveTo(X(gx), Y(GY)); ctx.lineTo(X(gx), Y(GY - 4.4)); } ctx.moveTo(X(x + 20.6), Y(GY - 4.2)); ctx.lineTo(X(x + 26.6), Y(GY - 4.2)); ctx.moveTo(X(x + 20.6), Y(GY - 1.2)); ctx.lineTo(X(x + 26.6), Y(GY - 1.2)); ctx.stroke();
}
// ---------------------------------------------------------------- the cat on the wall (loaf → stretch → sit)
const CATP = {
  loaf: { b: [0, -.55, 1.05, .5, 0], h: [1.05, -.82, .36], fl: [[.6, -.3], [.75, 0]], hl: [[-.6, -.3], [-.7, 0]], tl: [[-1.0, -.3], [-.2, .05], [.7, -.02]], eye: 0 },
  stretch: { b: [-.05, -.78, 1.18, .38, .26], h: [1.3, -.55, .34], fl: [[.8, -.5], [1.8, 0]], hl: [[-.85, -.95], [-.95, 0]], tl: [[-1.2, -1.05], [-1.55, -1.9], [-1.3, -2.45]], eye: 0 },
  sit: { b: [0, -.86, .55, .78, -.2], h: [.36, -1.86, .36], fl: [[.32, -.6], [.42, 0]], hl: [[-.2, -.4], [-.1, 0]], tl: [[-.5, -.2], [.2, .06], [.85, 0]], eye: 1 },
};
const mixArr = (a, b, u) => (Array.isArray(a) ? a.map((v, i) => mixArr(v, b[i], u)) : mix(a, b, u));
function cat(ctx, x, y, u, st, t) {
  const P = st < 1 ? mixArr(CATP.loaf, CATP.stretch, smo(st)) : mixArr(CATP.stretch, CATP.sit, smo(st - 1)), br = 1 + .03 * Math.sin(t * 2.4);
  ctx.save(); ctx.translate(x, y); ctx.scale(u, u);
  const col = '#c8803e', dk = '#94582a';
  ctx.strokeStyle = col; ctx.lineCap = 'round';
  ctx.lineWidth = .26; ctx.beginPath(); ctx.moveTo(P.tl[0][0], P.tl[0][1]); ctx.quadraticCurveTo(P.tl[1][0], P.tl[1][1], P.tl[2][0], P.tl[2][1]); ctx.stroke();
  ctx.lineWidth = .24; for (const L of [P.hl, P.fl]) for (const d of [0, .14]) { ctx.strokeStyle = d ? dk : col; ctx.beginPath(); ctx.moveTo(L[0][0] + d, L[0][1]); ctx.lineTo(L[1][0] + d, L[1][1]); ctx.stroke(); }
  ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(P.b[0], P.b[1], P.b[2], P.b[3] * br, P.b[4], 0, TAU); ctx.fill();
  ctx.save(); ctx.clip(); ctx.strokeStyle = rgba(dk, .7); ctx.lineWidth = .1; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.ellipse(P.b[0] + i * .32, P.b[1] - P.b[3], .2, P.b[3] * .9, P.b[4], 0, Math.PI); ctx.stroke(); } ctx.restore();
  const [hx, hy, hr] = P.h; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(hx, hy, hr, 0, TAU); ctx.fill();
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(hx + s * hr * .25 - .12, hy - hr * .6); ctx.lineTo(hx + s * hr * .55, hy - hr * 1.45); ctx.lineTo(hx + s * hr * .85, hy - hr * .45); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = '#2a1e18'; if (P.eye > .5) { ctx.beginPath(); ctx.arc(hx + .14, hy - .04, .05, 0, TAU); ctx.fill(); } else { ctx.strokeStyle = '#2a1e18'; ctx.lineWidth = .04; ctx.beginPath(); ctx.moveTo(hx + .05, hy); ctx.lineTo(hx + .2, hy - .01); ctx.stroke(); }
  ctx.restore();
}
// ---------------------------------------------------------------- grandmother and you
const GRAN = { dress: { coat: '#8a7a96', pants: '#5a4a5c', shoes: '#3a2e2e', skin: '#e9c3a0', hair: '#ece8e0', scarf: '#c08a6a' }, accent: '#c08a6a', accentPart: 'scarf' };
const YOU = { dress: { coat: '#e8a3a0', pants: '#3a3a4c', shoes: '#2a2226', skin: '#d9b08e', hair: '#3a2a24' }, accent: '#e8a3a0', accentPart: 'coat' };
function knitting(lap) {
  return (g, a0, a1) => {
    const h0 = [a0.hx + Math.sin(a0.ang) * 4, a0.hy + Math.cos(a0.ang) * 4], h1 = [a1.hx + Math.sin(a1.ang) * 4, a1.hy + Math.cos(a1.ang) * 4];
    const m = lap ? [16, -4] : [(h0[0] + h1[0]) / 2, (h0[1] + h1[1]) / 2 + 2];
    g.fillStyle = '#d07a86'; g.beginPath(); g.moveTo(m[0] - 7, m[1]); g.lineTo(m[0] + 7, m[1]); g.lineTo(m[0] + 6, m[1] + (lap ? 4 : 12)); g.lineTo(m[0] - 6, m[1] + (lap ? 4 : 12)); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(120,50,60,.5)'; g.lineWidth = .8; g.beginPath(); for (let k = 2; k < (lap ? 4 : 12); k += 2.4) { g.moveTo(m[0] - 6, m[1] + k); g.lineTo(m[0] + 6, m[1] + k); } g.stroke();
    g.strokeStyle = '#d8cfbe'; g.lineWidth = 1.4; g.lineCap = 'round'; g.beginPath();
    if (lap) { g.moveTo(m[0] - 9, m[1] - 1); g.lineTo(m[0] + 9, m[1] + 1); g.moveTo(m[0] - 8, m[1] + 2); g.lineTo(m[0] + 10, m[1] - 2); }
    else { g.moveTo(h0[0] - 3, h0[1] + 3); g.lineTo(h0[0] + 13, h0[1] - 11); g.moveTo(h1[0] - 2, h1[1] + 3); g.lineTo(h1[0] + 15, h1[1] - 7); }
    g.stroke();
  };
}
// the garden choreography (T = the anchor times)
export function gardenPeople(ctx, t, X, Y, z, T, P) {
  const s = .051 * z;
  // you: standing at the bench's end, sitting down slowly, the plane on your knee, leaning back on "because"
  const sit = smo(clamp((t - T.sit0) / (T.sit1 - T.sit0))), back = smo(clamp((t - T.because) / .7));
  let yp = lerpPose(STAND, POSES.sit, sit);
  yp = { ...yp, head: mix(.05, .28, smo(clamp((t - T.lay1 + .25) / .4)) * (1 - back * .7)) - .08 * back, lean: yp.lean - .09 * back };
  const yx = X(SPOT.you + mix(.4, 0, sit)), yy = Y(mix(GY - 4.72, SPOT.seatYou - .35, sit));
  figure(ctx, yx, yy, s, yp, { t, seed: 5, flip: false, ...YOU });
  const knee = [yx + 33 * s, yy - 9 * s];
  // grandmother: knitting, lowering it to her lap, reaching for the plane, laying it on your knee, leaning back
  const gx = X(SPOT.gran), gy = Y(SPOT.seatGran - .35);
  const knit = { ...POSES.sit, hair: 'bun', skirt: true, coat: .45, lean: .1, head: .3, sh: [.62 + .05 * Math.sin(t * 13), .5 + .05 * Math.sin(t * 13 + 2)], el: [1.25 + .08 * Math.sin(t * 13 + 1), 1.3 + .08 * Math.sin(t * 13 + 3)] };
  const rest = { ...POSES.sit, hair: 'bun', skirt: true, coat: .45, lean: .04, head: .12, sh: [.35, .3], el: [1.0, 1.05] };
  const lapU = smo(clamp((t - T.lap0) / .35)) * (1 - 0), reachU = smo(clamp((t - T.pick0) / (T.pick1 - T.pick0))), carryU = smo(clamp((t - T.pick1) / (T.lay0 - T.pick1))), layU = smo(clamp((t - T.lay0) / (T.lay1 - T.lay0))), offU = smo(clamp((t - T.lay1) / .45));
  let gp = lerpPose(knit, rest, lapU);
  const lean = mix(gp.lean, .62, reachU) - .42 * carryU - .1 * offU - .1 * back;
  gp = { ...gp, lean };
  const o = { t, seed: 9, flip: true, ...GRAN, prop: knitting(lapU > .5) };
  let hand = null;
  if (reachU > 0 && offU < 1) {
    const land = [X(SPOT.land[0]), Y(SPOT.land[1])], chest = [gx - 12 * s, gy - 52 * s];
    let tgt = land; if (carryU > 0) tgt = [mix(land[0], chest[0], Math.sin(carryU * Math.PI / 2)), mix(land[1], chest[1], Math.sin(carryU * Math.PI / 2))];
    if (carryU >= 1) tgt = [mix(chest[0], knee[0] + 6 * s, layU), mix(chest[1], knee[1] - 2 * s, layU)];
    const ra = reachArm(gx, gy, s, gp, 0, true, o, tgt);
    const w = Math.min(reachU, 1 - offU);
    gp = { ...gp, sh: [mix(gp.sh[0], ra.sh, w), gp.sh[1]], el: [mix(gp.el[0], ra.el, w), gp.el[1]] };
    hand = handPos(gx, gy, s, gp, 0, true, o);
  }
  figure(ctx, gx, gy, s, gp, o);
  return { hand, knee };
}
// ---------------------------------------------------------------- the children chalk-drawing on the quay
const KIDS = [{ x: 703, flip: false, seed: 31, top: '#e0b040', hair: 'pigtails' }, { x: 712.5, flip: true, seed: 37, top: '#5a8ac0', hair: 'short' }, { x: 829, flip: true, seed: 41, top: '#c05a5a', hair: 'bob' }];
const CHALK = ['#f4e8a0', '#f0a8c0', '#a8d8f0', '#c8f0b0'];
function kids(ctx, t, cam) {
  const z = cam.z, s = .051 * z;
  for (const [i, k] of KIDS.entries()) {
    const [fx, fy] = toScreen(cam, k.x, HILL.quay.y); if (fx < -80 || fx > W + 80) continue;
    // the drawing on the paving in front of the child (flat, a few strokes)
    ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = Math.max(1, .28 * z);
    for (let j = 0; j < 4; j++) { ctx.strokeStyle = CHALK[(i + j) % 4]; ctx.beginPath(); const cx = fx + (k.flip ? -1 : 1) * (2.4 + j * .9) * z, cy = fy + (.5 + (j % 2) * .5) * z; ctx.ellipse(cx, cy, (.5 + j * .15) * z, .22 * z, 0, 0, TAU * (.6 + .1 * j)); ctx.stroke(); }
    ctx.restore();
    const pose = { ...KIDPOSES.squat, sh: [KIDPOSES.squat.sh[0] + .08 * Math.sin(t * 5 + i), KIDPOSES.squat.sh[1]], el: [KIDPOSES.squat.el[0] + .1 * Math.sin(t * 5 + i + 1), KIDPOSES.squat.el[1]] };
    figureKid(ctx, fx, fy - SQUAT_DY * s, s, pose, { t, seed: k.seed, flip: k.flip, accent: k.top, hair: k.hair, dress: { top: k.top } });
  }
}
// ---------------------------------------------------------------- afternoon: haze over the top of the hill, the gold grade
function haze(ctx, cam, h) {
  if (h <= .002) return;
  const y0 = toScreen(cam, 0, 470)[1], y1 = toScreen(cam, 0, 615)[1];
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createLinearGradient(0, y0, 0, Math.max(y0 + 1, y1)); g.addColorStop(0, rgba('#f2d6b0', h)); g.addColorStop(.55, rgba('#efcfa8', h * .55)); g.addColorStop(1, rgba('#eecca4', 0));
  if (y0 > 0) { ctx.fillStyle = rgba('#f4dcb8', h); ctx.fillRect(0, 0, W, y0); }
  ctx.fillStyle = g; ctx.fillRect(0, Math.max(0, y0), W, Math.max(0, y1 - Math.max(0, y0)));
  const [sx, sy] = toScreen(cam, 470, 380); putGlow(ctx, sx, sy, 420, .5 * h, '#ffcf8a', '#fff4dc');
  ctx.restore();
}
function grade(ctx, g, warm) {
  if (g <= .002 && warm <= .002) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = clamp(g * .85 + warm * .35); ctx.fillStyle = '#ffb05a'; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = clamp(g * .16 + warm * .07); ctx.fillStyle = '#ff9850'; ctx.fillRect(0, 0, W, H);
  ctx.restore();
}
// ---------------------------------------------------------------- one hill frame
// S: { night, lit0, labels, title, focusU, doors, people, haze, gold, warm, chars, kids, T (garden times), plane(ctx, info) }
export function hillFrame(ctx, t, cam, S) {
  const st = { night: S.night, lit: [S.lit0 ?? 0, 0, 0, 0, 0], labels: S.labels ?? 0, title: S.title ?? 0, focus: 0, focusU: S.focusU ?? 0, people: S.people ?? 1, doors: S.doors ?? 0 };
  let info = null;
  if (S.chars) {
    const full = cam.z > ZV;
    st.garden = { draw: (c, sx, sy, sw) => {
      const z = sw / G.w, X = (wx) => sx + (wx - G.x) * z, Y = (wy) => sy + (wy - G.y) * z;
      if (full) furniture(c, X, Y, z, t);
      c.save(); if (!full) { c.beginPath(); c.rect(sx, sy, sw, Y(GY - 4.0) - sy); c.clip(); }
      info = gardenPeople(c, t, X, Y, z, S.T, S.P);
      c.restore();
      if (full) wall(c, X, Y, z);
      cat(c, X(SPOT.cat), Y(SPOT.coping), z, S.catU ?? 0, t);
      info.X = X; info.Y = Y; info.z = z;
    } };
  }
  drawHill(ctx, t, cam, st);
  if (S.kids) kids(ctx, t, cam);
  haze(ctx, cam, S.haze ?? 0);
  grade(ctx, S.gold ?? 0, S.warm ?? 0);
  if (S.plane) S.plane(ctx, info);
}
export { G as GARDEN, ZV };
