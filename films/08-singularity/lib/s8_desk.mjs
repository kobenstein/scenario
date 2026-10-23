// Film 8 · YOUR table by the window (owner B1; shots.md §6 "your table by the window", §7: paper is never flat beige). A dark room lit only
// by one oil lamp (breath ~60 bpm, flicker), a wooden table pushed against the wall under a window that looks onto the s8 night sky and sea
// through the same camera, the reflection of the lamp (and of you) in the glass, lamp-lit paper objects, the pen hand, you from behind.
// World units are metres, s8_kit camera (+Y up). Origin = the floor under the table centre; +Z points to the window (you sit at −Z).
//
//   DESK                       { top (table top y .76), x0, x1, z0, z1 (table), wallZ .62, win: { x0, x1, y0, y1 } (window opening),
//                              lamp: [x, y, z] (the flame), seat: [x, y, z] (your head) }
//   lampLevel(t) → 0.9…1.08    the lamp's breath (≈ 60 bpm) and flicker; multiply your own lamp-lit things by it
//   room(ctx, t, C, o)         the whole room in one call: dark room, wall, the window (outside: s8 sky + sea through C, lifted o.outY 6 m
//                              above the sea; o.outside 0..1 how bright the outside reads in the glass), the window frame, the table, the
//                              items, the lamp, the person. o: { items: [sheet objects, see below], person: { a 1, turn 0..1 (head turns to
//                              the right/door), arm 0..1 } | null, lamp 1 (0 = not lit), lampKind 'oil' | 'desk', reflect: { a, ring 0..1
//                              (the ring glowing at the reflection's chest, c03.20) } | null, outside 1, dawn 0 (s8 sky dawn), flame 1,
//                              wind 0..1 (the flame bends), open (casement open: no sash bars, no reflection), outsideDraw(ctx, t, C) (your
//                              own world in the window instead of the default sky + sea), door: { open, child 0..1, drawing 0..1 } (the door
//                              in the left wall, warm hall light, a child holding up a drawing), glassPane (the window is the dark glass plate,
//                              reflections only: push into it for the c03>c04 glass handoff) }. The camera may also be OUTSIDE the window
//                              (C.z > wallZ): clip to the window opening first; room() then draws the interior seen through it, bars last.
//                              → { lamp: [sx, sy] screen point of the flame, window: [[sx, sy] × 4], head: [sx, sy] }
//   sheet(ctx, t, C, s)        one lamp-lit paper object in the world. s: { x, z (centre on the table), y (default DESK.top + .001), w (m),
//                              aspect (16/9: the texture is PLATE SPACE 1920 × 1920/aspect px), rot (rad about Y), tilt (rad: lifts the far
//                              edge, e.g. a held chart; or o.corners [4 world points] for any pose), draw(g, t, W, H) your content in plate
//                              space px (ink, compass, text …), lamp true (handoff4 paperLamp shading; false: your draw paints the whole
//                              ground), res .5 (texture scale), n 4 (mesh cells for perspective) }  → { corners: 4 screen points }
//   sheetCorners(s) → 4 world points (TL, TR, BR, BL in plate space order)
//   plateCam(s, F) → camera    looking straight down at sheet s so that its plate space IS the screen (1920 × 1080): at this camera the
//                              sheet equals the 'paper' lamp plate of handoff4 (for the c02>c03 and c05>c06 handoffs: push in with your own
//                              track and end on plateCam at H.a). Only for flat sheets (tilt 0).
//   texMesh(ctx, img, src, dst, n)  the same with a source point per vertex (src(u, v) → image px)
//   texQuad(ctx, img, sw, sh, P, n)   draw an image (sw × sh px) onto a projected quad P = 4 world-projected screen points given as a function
//                              (u, v) → [x, y] | null (u, v 0..1); n × n cells, two triangles each, exact per triangle (no visible seams)
//   penHand(ctx, t, x, y, s, o)   YOUR hand holding a pen, nib at x, y (screen), s = scale (1 ≈ 150 px wrist to fingertip). o: { lift 0..1,
//                              ang (direction nib → pen end, default −.95: up-right, a right hand), skin, sleeve '#2a2236', light [dx, dy] (toward the lamp) }
//   personBack(ctx, t, C, o)   you, seated at the table, seen from behind (head, hair, shoulders, back), rim-lit by the lamp; o: { turn, a }
//   glass(ctx, t)              handoff4's glass plate in screen space (what the window looks like when it fills the frame)
//   lerpCam(a, b, u) → camera  interpolate two camera poses { x, y, z, yaw, pitch, F } (F in log space); a helper for pushThroughWindow moves
import { rgba, clamp, prng, drift } from '../engine.mjs';
import { camera, TAU, projPoly, projRuns, fillPoly, mixHex, nz, sio } from './s8_kit.mjs';
import { drawSky } from './s8_sky.mjs';
import { drawSea } from './s8_sea.mjs';
import { flames } from './s8_canoe.mjs';
import { hand, handTip } from './hand.mjs';
import { pen } from './paper.mjs';
import { paperLamp, glassPlate } from './handoff4.mjs';
import { layer } from './art.mjs';
import { backFig } from './s8_people.mjs';
import { Path2D } from '@napi-rs/canvas';

export const DESK = { top: .76, x0: -.85, x1: .85, z0: -.42, z1: .55, wallZ: .62, win: { x0: -.55, x1: .55, y0: .98, y1: 1.98 }, lamp: [-.42, .95, .22], seat: [.05, 1.22, -.72] };
export const glass = (ctx, t) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); glassPlate(ctx, t, {}); ctx.restore(); };
export const lampLevel = (t) => 1 + .025 * Math.sin(t * TAU) + .02 * nz(t * 7.3, 2) + .012 * Math.sin(t * 17.1);

// ---------------------------------------------------------------- texture onto a projected quad
function affine(s0, s1, s2, d0, d1, d2) {
  const den = (s1[0] - s0[0]) * (s2[1] - s0[1]) - (s2[0] - s0[0]) * (s1[1] - s0[1]); if (Math.abs(den) < 1e-9) return null;
  const ux = ((d1[0] - d0[0]) * (s2[1] - s0[1]) - (d2[0] - d0[0]) * (s1[1] - s0[1])) / den, vx = ((d2[0] - d0[0]) * (s1[0] - s0[0]) - (d1[0] - d0[0]) * (s2[0] - s0[0])) / den;
  const uy = ((d1[1] - d0[1]) * (s2[1] - s0[1]) - (d2[1] - d0[1]) * (s1[1] - s0[1])) / den, vy = ((d2[1] - d0[1]) * (s1[0] - s0[0]) - (d1[1] - d0[1]) * (s2[0] - s0[0])) / den;
  return [ux, uy, vx, vy, d0[0] - ux * s0[0] - vx * s0[1], d0[1] - uy * s0[0] - vy * s0[1]];
}
function tri(ctx, img, s, d) {
  const m = affine(...s, ...d); if (!m) return;
  const cx = (d[0][0] + d[1][0] + d[2][0]) / 3, cy = (d[0][1] + d[1][1] + d[2][1]) / 3, ex = (p) => { const dx = p[0] - cx, dy = p[1] - cy, l = Math.hypot(dx, dy) || 1; return [p[0] + dx / l * .7, p[1] + dy / l * .7]; };
  ctx.save(); ctx.beginPath(); const e = d.map(ex); ctx.moveTo(...e[0]); ctx.lineTo(...e[1]); ctx.lineTo(...e[2]); ctx.closePath(); ctx.clip();
  ctx.transform(...m); ctx.drawImage(img, 0, 0); ctx.restore();
}
// texMesh: like texQuad, but the source point of each mesh vertex is given too: src(u, v) → [x, y] in the image, dst(u, v) → [x, y] | null
export function texMesh(ctx, img, src, dst, n = 6) {
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const u0 = i / n, u1 = (i + 1) / n, v0 = j / n, v1 = (j + 1) / n, a = dst(u0, v0), b = dst(u1, v0), c = dst(u1, v1), d = dst(u0, v1);
    if (!a || !b || !c || !d) continue;
    const A = src(u0, v0), B = src(u1, v0), Cc = src(u1, v1), D = src(u0, v1); if (!A || !B || !Cc || !D) continue;
    tri(ctx, img, [A, B, Cc], [a, b, c]); tri(ctx, img, [A, Cc, D], [a, c, d]);
  }
}
export function texQuad(ctx, img, sw, sh, P, n = 4) {
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const u0 = i / n, u1 = (i + 1) / n, v0 = j / n, v1 = (j + 1) / n, a = P(u0, v0), b = P(u1, v0), c = P(u1, v1), d = P(u0, v1);
    if (!a || !b || !c || !d) continue;
    const A = [u0 * sw, v0 * sh], B = [u1 * sw, v0 * sh], Cc = [u1 * sw, v1 * sh], D = [u0 * sw, v1 * sh];
    tri(ctx, img, [A, B, Cc], [a, b, c]); tri(ctx, img, [A, Cc, D], [a, c, d]);
  }
}

// ---------------------------------------------------------------- sheets
export function sheetCorners(s) {
  const w = s.w ?? .4, h = w / (s.aspect ?? 16 / 9), r = s.rot ?? 0, y = s.y ?? DESK.top + .001, x = s.x ?? 0, z = s.z ?? 0;
  if (s.corners) return s.corners;
  const u = [Math.cos(r), 0, -Math.sin(r)], tl = s.tilt ?? 0, v = [-Math.sin(r) * Math.cos(tl), -Math.sin(tl), -Math.cos(r) * Math.cos(tl)];   // v = plate-down (toward you); tilt lifts the far edge
  const P = (a, b) => [x + u[0] * a + v[0] * b, y + u[1] * a + v[1] * b + (tl ? h / 2 * Math.sin(tl) : 0), z + u[2] * a + v[2] * b];
  return [P(-w / 2, -h / 2), P(w / 2, -h / 2), P(w / 2, h / 2), P(-w / 2, h / 2)];
}
const TEX = new Map();
export function sheet(ctx, t, C, s) {
  const res = s.res ?? .5, PW = 1920, PH = Math.round(1920 / (s.aspect ?? 16 / 9)), key = `${Math.round(PW * res)}x${Math.round(PH * res)}`;
  let L = TEX.get(key); if (!L) { L = layer(Math.round(PW * res), Math.round(PH * res)); TEX.set(key, L); }
  const [c, g] = L;
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, c.width, c.height); g.scale(res, res);
  if (s.lamp !== false) paperLamp(g, t, { rect: [0, 0, PW, PH] });
  if (s.draw) { g.save(); s.draw(g, t, PW, PH); g.restore(); }
  const K = sheetCorners(s), bil = (u, v) => K[0].map((_, i) => (1 - v) * ((1 - u) * K[0][i] + u * K[1][i]) + v * ((1 - u) * K[3][i] + u * K[2][i]));
  const P = (u, v) => { const p = C.P(...bil(u, v), .02); return p ? [p[0], p[1]] : null; };
  // contact shadow on the table (a soft dark rim), then the sheet
  const S = projPoly(C, K);
  if (S.length > 2 && !s.tilt && !s.corners) { ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 4; fillPoly(ctx, S, 'rgba(20,12,8,.9)'); ctx.restore(); }
  texQuad(ctx, c, c.width, c.height, P, s.n ?? 4);
  return { corners: K.map((p) => C.P(...p)) };
}
// a camera straight above a flat sheet whose view equals the sheet's plate space
export function plateCam(s, F = 1400) {
  const w = s.w ?? .4, d = F * w / 1920, y = (s.y ?? DESK.top + .001) + d;
  return camera({ x: s.x ?? 0, y, z: s.z ?? 0, yaw: s.rot ?? 0, pitch: Math.PI / 2, F });
}
export function lerpCam(a, b, u) {
  const m = (k) => a[k] + (b[k] - a[k]) * u;
  return camera({ x: m('x'), y: m('y'), z: m('z'), yaw: m('yaw'), pitch: m('pitch'), F: Math.exp(Math.log(a.F) + (Math.log(b.F) - Math.log(a.F)) * u) });
}

// ---------------------------------------------------------------- the lamp
function lampDraw(ctx, t, C, o) {
  const [lx, ly, lz] = DESK.lamp, base = C.P(lx, DESK.top, lz), fl = C.P(lx, ly, lz); if (!base || !fl) return null;
  const k = base[2], lv = lampLevel(t) * (o.lamp ?? 1);
  // brass font and foot
  ctx.save();
  const bw = .075 * k, bh = .07 * k;
  ctx.fillStyle = '#2a1c10'; ctx.beginPath(); ctx.ellipse(base[0], base[1], bw * 1.1, bw * .3, 0, 0, TAU); ctx.fill();
  const g = ctx.createLinearGradient(base[0] - bw, 0, base[0] + bw, 0); g.addColorStop(0, '#5a3a1c'); g.addColorStop(.35, '#f0c27a'); g.addColorStop(.6, '#b8894a'); g.addColorStop(1, '#2a1a0c');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(base[0], base[1] - bh * .55, bw, bh * .75, 0, 0, TAU); ctx.fill();
  // the glass chimney (dark glass with highlights) round the flame
  const cy0 = base[1] - bh * 1.1, cy1 = fl[1] - .1 * k, cw = .032 * k;
  ctx.strokeStyle = 'rgba(255,230,190,.35)'; ctx.lineWidth = Math.max(1, k * .002);
  ctx.beginPath(); ctx.moveTo(fl[0] - cw, cy0); ctx.bezierCurveTo(fl[0] - cw * 2, cy0 - (cy0 - fl[1]) * .5, fl[0] - cw * .9, fl[1], fl[0] - cw * .7, cy1); ctx.moveTo(fl[0] + cw, cy0); ctx.bezierCurveTo(fl[0] + cw * 2, cy0 - (cy0 - fl[1]) * .5, fl[0] + cw * .9, fl[1], fl[0] + cw * .7, cy1); ctx.stroke();
  ctx.restore();
  // the flame (Film 4 flames, small), bending in the wind
  if ((o.lamp ?? 1) > 0) {
    ctx.save(); ctx.translate(fl[0], fl[1] + .03 * k); ctx.transform(1, 0, -.6 * (o.wind || 0) * (.7 + .3 * Math.sin(t * 9)), 1, 0, 0); flames(ctx, t, 0, 0, .1 * k * lv * (o.flame ?? 1)); ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const r = .55 * k * lv, h = ctx.createRadialGradient(fl[0], fl[1], 0, fl[0], fl[1], r); h.addColorStop(0, rgba('#fff1d6', .55)); h.addColorStop(.12, rgba('#ffb35c', .28)); h.addColorStop(.5, rgba('#c4512e', .06)); h.addColorStop(1, rgba('#c4512e', 0));
    ctx.fillStyle = h; ctx.fillRect(fl[0] - r, fl[1] - r, 2 * r, 2 * r); ctx.restore();
  }
  return fl;
}

// ---------------------------------------------------------------- you, from behind
export function personBack(ctx, t, C, o = {}) {
  const [sx, sy, sz] = DESK.seat, hd = C.P(sx, sy, sz); if (!hd) return null;
  const k = hd[2], b = Math.sin(t * TAU / 4.2) * .006, turn = o.turn || 0, lp = C.P(...DESK.lamp), L = lp ? Math.sign(lp[0] - hd[0]) : -1;
  const S = (x, y) => [hd[0] + x * k, hd[1] - y * k];
  ctx.save();
  // back and shoulders (a dark knit), down to below the frame
  const sh = -.2 + b;   // shoulder line relative to the head centre
  const body = [S(-.25, sh - .55 - 1), S(-.24, sh - .12), S(-.2, sh - .02), S(-.07, sh + .04), S(.07, sh + .04), S(.2, sh - .02), S(.24, sh - .12), S(.25, sh - .55 - 1)];
  const path = () => { ctx.beginPath(); body.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); };
  ctx.save(); ctx.translate(L * Math.max(1.2, k * .006), -Math.max(.8, k * .003)); path(); ctx.fillStyle = rgba('#ffb066', .85); ctx.fill(); ctx.restore();
  path(); ctx.fillStyle = '#17121c'; ctx.fill();
  ctx.save(); path(); ctx.clip(); const g = ctx.createLinearGradient(hd[0] + L * .25 * k, 0, hd[0] - L * .25 * k, 0); g.addColorStop(0, rgba('#a0603a', .35)); g.addColorStop(.5, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.35)'); ctx.fillStyle = g; ctx.fillRect(hd[0] - k, hd[1] - k, 2 * k, 3 * k); ctx.restore();
  // neck + head (back of the head, hair), turning a little
  const hx = turn * .035, hr = .095;
  ctx.fillStyle = '#2a1c18'; ctx.fillRect(hd[0] - .045 * k + hx * k, hd[1] + .02 * k, .09 * k, .1 * k);
  ctx.save(); ctx.translate(L * Math.max(1, k * .005), 0); ctx.beginPath(); ctx.ellipse(hd[0] + hx * k, hd[1] - .01 * k, hr * k, hr * 1.12 * k, turn * .15, 0, TAU); ctx.fillStyle = rgba('#ffb066', .8); ctx.fill(); ctx.restore();
  ctx.beginPath(); ctx.ellipse(hd[0] + hx * k, hd[1] - .01 * k, hr * k, hr * 1.12 * k, turn * .15, 0, TAU); ctx.fillStyle = '#120d12'; ctx.fill();
  {   // hair: soft strands from the crown, lamp-warm on the lit side; the ears show a little
    ctx.save(); ctx.clip(); const cx = hd[0] + hx * k, cy = hd[1] - .01 * k, R = hr * k;
    const hg = ctx.createRadialGradient(cx + L * R * .7, cy - R * .2, 0, cx + L * R * .7, cy - R * .2, R * 1.4); hg.addColorStop(0, rgba('#7a4a2c', .55)); hg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = hg; ctx.fillRect(cx - 2 * R, cy - 2 * R, 4 * R, 4 * R);
    ctx.lineCap = 'round'; const rr = prng(31);
    for (let i = 0; i < 26; i++) { const a0 = -Math.PI / 2 + (rr() - .5) * 2.6, len = R * (.8 + .7 * rr()), x0 = cx + Math.cos(a0) * R * .15, y0 = cy - R * .55; ctx.strokeStyle = rgba(rr() < .5 ? '#3a281e' : '#05040a', .55); ctx.lineWidth = Math.max(.8, R * .035); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(x0 + Math.cos(a0 + 1.6) * len * .5, y0 + len * .5, x0 + Math.sin(a0) * R * .9, y0 + len); ctx.stroke(); }
    ctx.restore();
    for (const sd of [-1, 1]) { ctx.fillStyle = sd === L ? '#6a3e28' : '#1c1214'; ctx.beginPath(); ctx.ellipse(cx + sd * R * .98, cy + R * .1, R * .12, R * .2, 0, 0, TAU); ctx.fill(); }
  }
  if (Math.abs(turn) > .05) { ctx.beginPath(); ctx.ellipse(hd[0] + (hx + .07 * Math.sign(turn)) * k, hd[1] + .02 * k, .03 * k, .05 * k, 0, 0, TAU); ctx.fillStyle = mixHex('#120d12', '#7a4f33', Math.abs(turn) * .6); ctx.fill(); }   // a cheek edge as the head turns (turn < 0: to the left, the door)   // a cheek edge as the head turns
  ctx.restore();
  return { head: [hd[0], hd[1]], k };
}

// ---------------------------------------------------------------- the pen hand
export function penHand(ctx, t, x, y, s, o = {}) {
  const ang = o.ang ?? -.95, lift = o.lift || 0, d = [Math.cos(ang), Math.sin(ang)], ha = ang + Math.PI + .12;
  const ho = { pose: 'write', ang: ha, skin: o.skin || '#c99a74', sleeve: o.sleeve || '#2a2236', sleeveLen: 420, rim: '#ffb066', light: o.light || [-.6, -1], t };
  pen(ctx, x, y, s * .62, { ang, lift, t });
  const gx = x + d[0] * 42 * s, gy = y + d[1] * 42 * s - lift * 13 * s, tip = handTip(0, 0, s, ho);   // the index tip rests on the pen near the nib
  hand(ctx, gx - tip[0] + d[1] * 6 * s, gy - tip[1] - d[0] * 6 * s, s, ho);
}

// ---------------------------------------------------------------- the room
const GRAIN = (() => { const r = prng(404), g = []; for (let i = 0; i < 46; i++) g.push([DESK.z0 + r() * (DESK.z1 - DESK.z0), r() * 6, .3 + r() * .7]); return g; })();
export const SHELL = { x0: -1.8, x1: 1.8, zb: -2.6, h: 2.5, door: { z0: -.6, z1: .25, h: 2.05 } };
const lit = (ctx, P, base, lp, r, a = .5) => { if (!fillPoly(ctx, P, base)) return; if (!lp) return; ctx.save(); fillPoly(ctx, P); ctx.clip(); const g = ctx.createRadialGradient(lp[0], lp[1], 0, lp[0], lp[1], r); g.addColorStop(0, rgba('#a0643a', a)); g.addColorStop(.35, rgba('#5a3424', a * .6)); g.addColorStop(1, 'rgba(20,14,24,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); ctx.restore(); };
// the room's shell: floor, back wall, side walls, the door in the left wall (o.door: { open 0..1, child 0..1, drawing 0..1 })
function shell(ctx, t, C, o, lp, lv) {
  const { x0, x1, zb, h, door } = SHELL, wz = DESK.wallZ, r = (lp ? lp[2] : 300) * 2.2 * lv;
  lit(ctx, projPoly(C, [[x0, 0, zb], [x1, 0, zb], [x1, 0, wz], [x0, 0, wz]]), '#0d0a0e', lp, r, .25);
  lit(ctx, projPoly(C, [[x0, 0, zb], [x1, 0, zb], [x1, h, zb], [x0, h, zb]]), '#130f17', lp, r, .3);
  lit(ctx, projPoly(C, [[x1, 0, zb], [x1, 0, wz], [x1, h, wz], [x1, h, zb]]), '#120e16', lp, r, .35);
  lit(ctx, projPoly(C, [[x0, 0, zb], [x0, 0, wz], [x0, h, wz], [x0, h, zb]]), '#120e16', lp, r, .35);
  const d = o.door; if (!d) return;
  const DP = projPoly(C, [[x0 + .002, 0, door.z0], [x0 + .002, 0, door.z1], [x0 + .002, door.h, door.z1], [x0 + .002, door.h, door.z0]]);
  if (DP.length < 3) return;
  const op = clamp(d.open ?? 1);
  // the opening: warm hall light; the door leaf swings into the room (a dark panel hinged at z1)
  ctx.save(); fillPoly(ctx, DP); ctx.clip();
  const c = DP.reduce((a, p) => [a[0] + p[0] / DP.length, a[1] + p[1] / DP.length], [0, 0]), k = C.P(x0, 1, (door.z0 + door.z1) / 2)?.[2] ?? 300;
  const g = ctx.createRadialGradient(c[0], c[1] - .3 * k, 0, c[0], c[1], 1.4 * k); g.addColorStop(0, rgba('#ffd9a0', .95 * op)); g.addColorStop(.5, rgba('#e08a3c', .7 * op)); g.addColorStop(1, rgba('#5a3424', .9)); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
  // the child in the doorway, backlit: a small silhouette holding up a drawing (lamp-lit from the front)
  if ((d.child ?? 0) > 0) {
    const f = C.P(x0 - .25, 0, (door.z0 + door.z1) / 2); if (f) {
      const kk = f[2], hh = 1.12, X = f[0], Y = f[1];
      // a small figure in pyjamas, backlit by the hall (figure.mjs: breath and weight; the silhouette reads the same from the front)
      backFig(ctx, t, X, Y, kk * hh / 178, { seed: 23, hold: 'none', light: { x: X - .3 * kk, y: Y - 1.6 * kk, col: '#ffd9a0', a: .9 }, dress: { coat: '#1a1420', pants: '#1a1420', shoes: '#0c0a10', skin: '#2a1c18', hair: '#0c0a10' }, accent: '#22182a', headTilt: .1 });
      const du = clamp(d.drawing ?? 0);
      if (du > 0) {   // the drawing held up in both hands at chest height, facing the room
        const dw = .34 * kk, dh = .26 * kk, dx = X + .02 * kk, dy = Y - (.62 + .22 * du) * kk;
        ctx.fillStyle = '#120c12'; ctx.fillRect(X - .19 * kk, dy + dh * .3, .06 * kk, (.75 - .22 * du) * kk * .5); ctx.fillRect(X + .13 * kk, dy + dh * .3, .06 * kk, (.75 - .22 * du) * kk * .5);
        ctx.fillStyle = '#e8dcc0'; ctx.fillRect(dx - dw / 2, dy - dh / 2, dw, dh);
        ctx.strokeStyle = '#c4512e'; ctx.lineWidth = Math.max(1, kk * .006); ctx.beginPath(); ctx.arc(dx - dw * .2, dy - dh * .1, dh * .18, 0, TAU); ctx.stroke();
        ctx.strokeStyle = '#2a5a8a'; ctx.beginPath(); ctx.moveTo(dx - dw * .45, dy + dh * .3); ctx.quadraticCurveTo(dx, dy + dh * .1, dx + dw * .45, dy + dh * .3); ctx.stroke();
        ctx.strokeStyle = '#3a2a20'; ctx.beginPath(); ctx.moveTo(dx + dw * .15, dy + dh * .25); ctx.lineTo(dx + dw * .15, dy - dh * .2); ctx.lineTo(dx + dw * .3, dy - dh * .32); ctx.lineTo(dx + dw * .4, dy - dh * .2); ctx.lineTo(dx + dw * .4, dy + dh * .25); ctx.stroke();
      }
    }
  }
  ctx.restore();
  // the leaf (open by op, swung against the wall toward the window)
  const a = op * 1.5, lz = door.z1, w = door.z1 - door.z0, ex = x0 + Math.sin(a) * w, ez = lz - Math.cos(a) * w;   // hinged at the window-side jamb (z1), it swings into the room clear of the opening
  fillPoly(ctx, projPoly(C, [[x0 + .01, 0, lz], [ex, 0, ez], [ex, door.h, ez], [x0 + .01, door.h, lz]]), '#1c130e');
}
// the desk lamp (lampKind 'desk'): a dark conical shade on an arm, a warm pool under it
function deskLampDraw(ctx, t, C, o) {
  const [lx, ly, lz] = DESK.lamp, base = C.P(lx, DESK.top, lz), bulb = C.P(lx + .12, ly + .05, lz - .05); if (!base || !bulb) return null;
  const k = base[2], lv = lampLevel(t) * (o.lamp ?? 1);
  ctx.save(); ctx.strokeStyle = '#1a1410'; ctx.lineWidth = Math.max(1.5, .012 * k); ctx.beginPath(); ctx.moveTo(base[0], base[1]); ctx.lineTo(base[0] - .02 * k, base[1] - .28 * k); ctx.lineTo(bulb[0], bulb[1] - .06 * k); ctx.stroke();
  ctx.fillStyle = '#16120e'; ctx.beginPath(); ctx.ellipse(base[0], base[1], .07 * k, .02 * k, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#1f2a1c'; ctx.beginPath(); ctx.moveTo(bulb[0] - .1 * k, bulb[1]); ctx.lineTo(bulb[0] - .035 * k, bulb[1] - .09 * k); ctx.lineTo(bulb[0] + .035 * k, bulb[1] - .09 * k); ctx.lineTo(bulb[0] + .1 * k, bulb[1]); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba('#ffcf8a', .5); ctx.lineWidth = Math.max(1, .004 * k); ctx.beginPath(); ctx.moveTo(bulb[0] - .1 * k, bulb[1]); ctx.lineTo(bulb[0] + .1 * k, bulb[1]); ctx.stroke();
  ctx.globalCompositeOperation = 'lighter'; const r = .45 * k * lv, g = ctx.createRadialGradient(bulb[0], bulb[1] + .01 * k, 0, bulb[0], bulb[1] + .01 * k, r); g.addColorStop(0, rgba('#fff1d6', .7)); g.addColorStop(.15, rgba('#ffcf8a', .25)); g.addColorStop(1, rgba('#e08a3c', 0)); ctx.fillStyle = g; ctx.fillRect(bulb[0] - r, bulb[1] - r, 2 * r, 2 * r);
  ctx.restore();
  return bulb;
}
export function room(ctx, t, C, o = {}) {
  const lv = lampLevel(t) * (o.lamp ?? 1), lp = C.P(...DESK.lamp), out = {}, wz = DESK.wallZ, inside = C.z < wz, kind = o.lampKind || 'oil';
  // the dark room (from outside the caller has clipped to the window opening)
  if (inside || o.fill !== false) { ctx.fillStyle = '#0a0810'; ctx.fillRect(0, 0, 1920, 1080); }
  shell(ctx, t, C, o, lp, lv);
  const { x0, x1, y0, y1 } = DESK.win, W4 = [[x0, y1, wz], [x1, y1, wz], [x1, y0, wz], [x0, y0, wz]], WP = projPoly(C, W4);
  out.window = WP;
  const bar = (a, b, w) => { const d = [b[0] - a[0], b[1] - a[1]], vert = Math.abs(d[1]) > Math.abs(d[0]); const off = vert ? [w, 0, 0] : [0, w, 0]; const P = projPoly(C, [[a[0] - off[0], a[1] - off[1], wz - .005], [b[0] - off[0], b[1] - off[1], wz - .005], [b[0] + off[0], b[1] + off[1], wz - .005], [a[0] + off[0], a[1] + off[1], wz - .005]]); if (fillPoly(ctx, P, '#1d140f')) { ctx.strokeStyle = rgba('#c07a44', .25 * lv); ctx.lineWidth = 1; ctx.stroke(); } };
  const bars = () => { const xm = (x0 + x1) / 2, ym = (y0 + y1) / 2; if (!o.open) { bar([xm, y0], [xm, y1], .018); bar([x0, ym], [x1, ym], .018); } bar([x0, y0 - .03], [x0, y1 + .03], .035); bar([x1, y0 - .03], [x1, y1 + .03], .035); bar([x0 - .03, y1], [x1 + .03, y1], .035); bar([x0 - .06, y0], [x1 + .06, y0], .04); };
  if (inside) {
    // the wall (z = wallZ), lamp-lit, with the window opening cut out
    const wall = projPoly(C, [[SHELL.x0, 0, wz], [SHELL.x1, 0, wz], [SHELL.x1, SHELL.h, wz], [SHELL.x0, SHELL.h, wz]]);   // only the room's own front wall (it must not cover the side walls and the door)
    if (wall.length > 2) { ctx.save(); const cp = new Path2D(); cp.moveTo(...wall[0]); wall.slice(1).forEach((p) => cp.lineTo(...p)); cp.closePath(); if (WP.length > 2) { cp.moveTo(...WP[0]); WP.slice(1).forEach((p) => cp.lineTo(...p)); cp.closePath(); } ctx.clip(cp, 'evenodd'); lit(ctx, wall, '#15101a', lp, 1.6 * (lp ? lp[2] : 300) * lv, .55); ctx.restore(); }
    if (WP.length > 2) {
      ctx.save(); fillPoly(ctx, WP); ctx.clip();
      if (o.glassPane) glass(ctx, t);   // the dark pane = handoff4's glass plate (c03>c04: push into it)
      else if (o.outsideDraw) o.outsideDraw(ctx, t, C);
      else { const Co = camera({ x: C.x, y: C.y + (o.outY ?? 6), z: C.z, yaw: C.yaw, pitch: C.pitch, F: C.F }); drawSky(ctx, t, Co, { dawn: o.dawn || 0, dawnAz: o.dawnAz ?? 0 }); drawSea(ctx, t, Co, {}); }
      if (!o.glassPane) { ctx.fillStyle = `rgba(4,6,16,${.15 + .6 * (1 - (o.outside ?? 1))})`; ctx.fillRect(0, 0, 1920, 1080); }
      const rl = C.P(DESK.lamp[0], DESK.lamp[1], 2 * wz - DESK.lamp[2]);
      if (rl && (o.lamp ?? 1) > 0 && !o.open) { ctx.globalCompositeOperation = 'lighter'; const r = .25 * rl[2] * lv, g = ctx.createRadialGradient(rl[0], rl[1], 0, rl[0], rl[1], r); g.addColorStop(0, rgba('#ffd9a0', .5)); g.addColorStop(.2, rgba('#ffb35c', .18)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(rl[0] - r, rl[1] - r, 2 * r, 2 * r); ctx.globalCompositeOperation = 'source-over'; }
      if (o.reflect) {
        const [sx, sy, sz] = DESK.seat, rh = C.P(sx, sy + .02, 2 * wz - sz);
        if (rh) {
          const k = rh[2], a = o.reflect.a ?? 1;
          ctx.fillStyle = `rgba(2,3,8,${.75 * a})`; ctx.beginPath(); ctx.ellipse(rh[0], rh[1], .1 * k, .12 * k, 0, 0, TAU); ctx.fill();
          ctx.beginPath(); ctx.moveTo(rh[0] - .3 * k, rh[1] + 1 * k); ctx.bezierCurveTo(rh[0] - .28 * k, rh[1] + .25 * k, rh[0] - .15 * k, rh[1] + .16 * k, rh[0], rh[1] + .16 * k); ctx.bezierCurveTo(rh[0] + .15 * k, rh[1] + .16 * k, rh[0] + .28 * k, rh[1] + .25 * k, rh[0] + .3 * k, rh[1] + 1 * k); ctx.fill();
          if (o.reflect.ring) { const cx = rh[0], cy = rh[1] + .38 * k, R = .09 * k * (1 + .03 * Math.sin(t * TAU / 4.2)), u = clamp(o.reflect.ring); ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (const [w, al] of [[R * .5, .08], [R * .18, .25], [Math.max(1.2, R * .05), .9]]) { ctx.strokeStyle = rgba('#ffb35c', al * u); ctx.lineWidth = w; ctx.beginPath(); ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + TAU * u); ctx.stroke(); } ctx.restore(); out.ring = [cx, cy, R]; }
          out.reflectHead = [rh[0], rh[1]];
        }
      }
      if (!o.glassPane) { const sh = ctx.createLinearGradient(WP[0][0], WP[0][1], WP[2][0], WP[2][1]); sh.addColorStop(0, 'rgba(216,247,255,.05)'); sh.addColorStop(.5, 'rgba(216,247,255,0)'); sh.addColorStop(1, 'rgba(216,247,255,.03)'); ctx.fillStyle = sh; ctx.fillRect(0, 0, 1920, 1080); }
      ctx.restore();
      bars();
    }
  }
  // the table top: dark wood, lamp pool, grain lines
  const T4 = [[DESK.x0, DESK.top, DESK.z1], [DESK.x1, DESK.top, DESK.z1], [DESK.x1, DESK.top, DESK.z0], [DESK.x0, DESK.top, DESK.z0]], TP = projPoly(C, T4);
  if (fillPoly(ctx, TP, '#24170f')) {
    ctx.save(); fillPoly(ctx, TP); ctx.clip();
    const tb = C.P(DESK.lamp[0] + (kind === 'desk' ? .12 : 0), DESK.top, DESK.lamp[2]);
    if (tb) { const r = .9 * tb[2] * lv, g = ctx.createRadialGradient(tb[0], tb[1], 0, tb[0], tb[1], r); g.addColorStop(0, rgba('#a8683a', .9)); g.addColorStop(.3, rgba('#6a3e22', .6)); g.addColorStop(1, 'rgba(20,12,8,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); }
    ctx.lineCap = 'round';
    for (const [z, ph, a] of GRAIN) { const pts = []; for (let i = 0; i <= 24; i++) { const x = DESK.x0 + (DESK.x1 - DESK.x0) * i / 24; pts.push(C.P(x, DESK.top, z + .006 * Math.sin(x * 9 + ph))); } if (pts.some((p) => !p)) continue; ctx.strokeStyle = rgba('#0a0604', .25 * a); ctx.lineWidth = Math.max(.6, pts[12][2] * .0012); ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
    ctx.restore();
    const ez = inside ? DESK.z0 : DESK.z1;
    const E = projPoly(C, [[DESK.x0, DESK.top, ez], [DESK.x1, DESK.top, ez], [DESK.x1, DESK.top - .04, ez], [DESK.x0, DESK.top - .04, ez]]); fillPoly(ctx, E, '#120b07');
  }
  // items (far → near), the lamp, you; from outside, the window bars last
  const items = (o.items || []).slice().sort((a, b) => C.depth(b.x ?? 0, DESK.top, b.z ?? 0) - C.depth(a.x ?? 0, DESK.top, a.z ?? 0));
  const lampItem = { x: DESK.lamp[0], z: DESK.lamp[2], drawItem: () => { if (C.depth(...DESK.lamp) < .2) return; out.lamp = kind === 'desk' ? deskLampDraw(ctx, t, C, o) : lampDraw(ctx, t, C, o); } };
  const all = [...items, lampItem].sort((a, b) => C.depth(b.x ?? 0, DESK.top, b.z ?? 0) - C.depth(a.x ?? 0, DESK.top, a.z ?? 0));
  for (const it of all) (it.drawItem ? it.drawItem(ctx, t, C) : sheet(ctx, t, C, it));
  if (o.person) { const p = personBack(ctx, t, C, o.person); if (p) out.head = p.head; }
  if (!inside && WP.length > 2) bars();
  return out;
}

// ---------------------------------------------------------------- paper objects (items for room({ items }); each is { x, z, drawItem })
// book(o): a closed book lying on the table (or falling onto it). o: { x, z, w .13, d .2 (m), th .025 (thickness), rot, y (bottom; default
//   the table), cover(g, t, W, H) (the cover in its own px space, W 1000 × H 1000·d/w), col '#1a1418' (edges/back), pages '#e8dcc0',
//   open 0 (riffle: leaves turned about the left spine; the fraction is the leaf in the air, leaf 0 = the cover; c02.16 the wind) }
export function book(o) {
  return { x: o.x, z: o.z, drawItem: (ctx, t, C) => {
    const w = o.w ?? .13, d = o.d ?? .2, th = o.th ?? .025, y = o.y ?? DESK.top, r = o.rot ?? 0, cx = o.x, cz = o.z;
    const u = [Math.cos(r), 0, -Math.sin(r)], v = [Math.sin(r), 0, Math.cos(r)], P = (a, b, h) => [cx + u[0] * a + v[0] * b, y + h, cz + u[2] * a + v[2] * b];   // b > 0 = the far edge (the cover's top, read from your seat)
    const fill = (pts, c) => fillPoly(ctx, projPoly(C, pts), c);
    if (Math.abs(y - DESK.top) < .002) { const S = projPoly(C, [P(-w / 2, -d / 2, .001), P(w / 2, -d / 2, .001), P(w / 2, d / 2, .001), P(-w / 2, d / 2, .001)]); if (S.length > 2) { ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 12; fillPoly(ctx, S, 'rgba(10,6,4,.8)'); ctx.restore(); } }
    // the visible sides: page block (cream lines) and spine
    for (const [a, b, c2, d2, col] of [[P(-w / 2, d / 2, 0), P(w / 2, d / 2, 0), P(w / 2, d / 2, th), P(-w / 2, d / 2, th), o.pages || '#d8c8a4'], [P(-w / 2, -d / 2, 0), P(w / 2, -d / 2, 0), P(w / 2, -d / 2, th), P(-w / 2, -d / 2, th), o.pages || '#d8c8a4'], [P(w / 2, -d / 2, 0), P(w / 2, d / 2, 0), P(w / 2, d / 2, th), P(w / 2, -d / 2, th), o.pages || '#d8c8a4'], [P(-w / 2, -d / 2, 0), P(-w / 2, d / 2, 0), P(-w / 2, d / 2, th), P(-w / 2, -d / 2, th), o.col || '#1a1418']]) fill([a, b, c2, d2], col);
    const K = [P(-w / 2, d / 2, th), P(w / 2, d / 2, th), P(w / 2, -d / 2, th), P(-w / 2, -d / 2, th)];
    const coverDraw = (g, tt, W, H) => { g.fillStyle = o.col || '#1a1418'; g.fillRect(0, 0, W, H); if (o.cover) o.cover(g, tt, W, H); };
    const f = Math.max(0, o.open || 0);
    if (f <= 0) { sheet(ctx, t, C, { corners: K, aspect: w / d, lamp: false, res: .4, n: 2, draw: coverDraw }); return; }
    // riffling (o.open = leaves turned, the fraction = the leaf in the air; leaf 0 is the cover): leaves turn about the spine (left edge)
    const n = Math.floor(f), q = f - n, page = (i) => (g, tt, W, H) => { if (o.page) { o.page(g, tt, W, H, i); return; } g.fillStyle = '#e6dac0'; g.fillRect(0, 0, W, H); g.fillStyle = 'rgba(42,36,32,.5)'; const rr = prng(i * 13 + 5); for (let l = 0; l < 20; l++) { let x = W * .12; const yy = H * .1 + l * H * .04; while (x < W * .86) { const ww = 16 + rr() * 60; g.fillRect(x, yy, Math.min(ww, W * .86 - x), H * .009); x += ww + 12; } } };
    const inside = (g, tt, W, H) => { g.fillStyle = '#d8cdb4'; g.fillRect(0, 0, W, H); };
    sheet(ctx, t, C, { corners: K, aspect: w / d, lamp: true, res: .3, n: 2, draw: page(n + 1) });   // the top page on the right
    const lt = Math.min(th, .002 * n + .002);   // the left stack (leaves already turned, the cover at the bottom)
    fill([P(-w / 2, -d / 2, 0), P(-1.5 * w, -d / 2, 0), P(-1.5 * w, -d / 2, lt), P(-w / 2, -d / 2, lt)], o.pages || '#d8c8a4');
    sheet(ctx, t, C, { corners: [P(-1.5 * w, d / 2, lt), P(-w / 2, d / 2, lt), P(-w / 2, -d / 2, lt), P(-1.5 * w, -d / 2, lt)], aspect: w / d, lamp: n > 0, res: .3, n: 2, draw: n > 0 ? page(n) : inside });
    if (q > .001) {
      const a = Math.PI * q, bend = .012 * Math.sin(a), Q = (s, b) => P(-w / 2 + s * w * Math.cos(a), b, th + s * w * Math.sin(a) + bend * Math.sin(Math.PI * s));
      const front = q < .5;
      sheet(ctx, t, C, { corners: front ? [Q(0, d / 2), Q(1, d / 2), Q(1, -d / 2), Q(0, -d / 2)] : [Q(1, d / 2), Q(0, d / 2), Q(0, -d / 2), Q(1, -d / 2)], aspect: w / d, lamp: !(front && n === 0) && !(!front && n === 0), res: .3, n: 2, draw: front ? (n === 0 ? coverDraw : page(n + 1)) : (n === 0 ? inside : page(n + 2)) });
    }
  } };
}
// openBook(o): an open book; o.flip (float: how many pages have turned; the fractional part is the page in the air), o.pages(g, t, W, H, i) draws
//   page i (default: grey lines of text); o: { x, z, w .26 (both pages), d .2, rot, cover '#1a1418' }
export function openBook(o) {
  return { x: o.x, z: o.z, drawItem: (ctx, t, C) => {
    const w = (o.w ?? .26) / 2, d = o.d ?? .2, y = DESK.top + .012, r = o.rot ?? 0, cx = o.x, cz = o.z;
    const u = [Math.cos(r), 0, -Math.sin(r)], v = [-Math.sin(r), 0, -Math.cos(r)], P = (a, b, h) => [cx + u[0] * a + v[0] * b, y + h, cz + u[2] * a + v[2] * b];
    const page = (i) => (g, tt, W, H) => { g.fillStyle = '#efe4cc'; g.fillRect(0, 0, W, H); if (o.pages) o.pages(g, tt, W, H, i); else { g.fillStyle = 'rgba(42,36,32,.55)'; const rr = prng(i * 7 + 1); for (let l = 0; l < 22; l++) { let x = W * .1; const yy = H * .1 + l * H * .036; while (x < W * .88) { const ww = 20 + rr() * 70; g.fillRect(x, yy, Math.min(ww, W * .88 - x), H * .008); x += ww + 14; } } } };
    fillPoly(ctx, projPoly(C, [P(-w - .006, -d / 2 - .006, -.01), P(w + .006, -d / 2 - .006, -.01), P(w + .006, d / 2 + .006, -.01), P(-w - .006, d / 2 + .006, -.01)]), o.cover || '#1a1418');
    const f = o.flip ?? 0, n = Math.floor(f), q = f - n;
    sheet(ctx, t, C, { corners: [P(-w, -d / 2, 0), P(0, -d / 2, .004), P(0, d / 2, .004), P(-w, d / 2, 0)].map((p, i) => p), aspect: w / d, res: .35, n: 2, lamp: true, draw: page(2 * n) });
    sheet(ctx, t, C, { corners: [P(0, -d / 2, .004), P(w, -d / 2, 0), P(w, d / 2, 0), P(0, d / 2, .004)], aspect: w / d, res: .35, n: 2, lamp: true, draw: page(2 * n + 3) });
    if (q > .001) {   // the turning leaf, rotating about the spine (right → left)
      const a = Math.PI * q, ca = Math.cos(a), sa = Math.sin(a), bend = .015 * Math.sin(a);
      const Q = (s, b) => P(s * w * ca, b, .004 + s * w * sa + bend * s);
      sheet(ctx, t, C, { corners: q < .5 ? [Q(0, -d / 2), Q(1, -d / 2), Q(1, d / 2), Q(0, d / 2)] : [Q(1, -d / 2), Q(0, -d / 2), Q(0, d / 2), Q(1, d / 2)], aspect: w / d, res: .35, n: 2, lamp: true, draw: page(q < .5 ? 2 * n + 1 : 2 * n + 2) });
    }
  } };
}
// cup(o): a cup of tea on the table, a thread of steam; o: { x, z, r .04, h .085, col '#3a2a24' }
export function cup(o) {
  return { x: o.x, z: o.z, drawItem: (ctx, t, C) => {
    const r = o.r ?? .04, h = o.h ?? .085, b = C.P(o.x, DESK.top, o.z), tp = C.P(o.x, DESK.top + h, o.z); if (!b || !tp) return;
    const k = b[2], k2 = tp[2], ry = (y, kk) => Math.max(1, r * kk * Math.abs(Math.sin(C.pitch + .0001)) * 1);
    ctx.save(); ctx.fillStyle = o.col || '#3a2a24'; ctx.beginPath(); ctx.ellipse(b[0], b[1], r * k, ry(0, k), 0, 0, Math.PI); ctx.lineTo(tp[0] - r * k2, tp[1]); ctx.ellipse(tp[0], tp[1], r * k2, ry(0, k2), 0, Math.PI, 0, true); ctx.closePath(); ctx.fill();
    const g = ctx.createLinearGradient(tp[0] - r * k2, 0, tp[0] + r * k2, 0); g.addColorStop(0, 'rgba(255,190,120,.35)'); g.addColorStop(.4, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.4)'); ctx.fillStyle = g; ctx.fill();
    ctx.fillStyle = '#2a1408'; ctx.beginPath(); ctx.ellipse(tp[0], tp[1], r * k2 * .9, ry(0, k2) * .9, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(232,220,200,.5)'; ctx.lineWidth = Math.max(1, k2 * .003); ctx.beginPath(); ctx.ellipse(tp[0], tp[1], r * k2, ry(0, k2), 0, 0, TAU); ctx.stroke();
    ctx.strokeStyle = 'rgba(232,226,214,.16)'; ctx.lineWidth = Math.max(1, k2 * .004); ctx.beginPath(); for (let i = 0; i <= 20; i++) { const v = i / 20, x = tp[0] + Math.sin(v * 7 + t * 1.6) * r * k2 * .4 * v, y = tp[1] - v * .12 * k2; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
    ctx.restore();
  } };
}
// badge(o): a work badge on a lanyard lying on the table; o.turn 0..1 (it is turned over by a hand: 0 back, 1 front), o.lift 0..1
export function badge(o) {
  return { x: o.x, z: o.z, drawItem: (ctx, t, C) => {
    const w = .055, d = .085, lift = (o.lift ?? 0) * .05, tu = o.turn ?? 1, a = Math.PI * (1 - tu), y = DESK.top + .002 + lift;
    // the lanyard: a loose loop on the table
    const cord = []; for (let i = 0; i <= 30; i++) { const v = i / 30, ang = v * TAU * .9 + .3; cord.push([o.x + .1 * Math.cos(ang) * (1 + .2 * Math.sin(v * 9)), DESK.top + .003 + (v < .1 ? lift * (1 - v * 10) : 0), o.z - d / 2 - .09 + .07 * Math.sin(ang)]); }
    for (const run of projRuns(C, cord)) { ctx.strokeStyle = '#2a3a6a'; ctx.lineWidth = Math.max(1.2, run[0][2] * .006); ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
    const ca = Math.cos(a), sa = Math.sin(a), Q = (s, b) => [o.x + s * w / 2 * ca, y + s * w / 2 * sa * .6, o.z + b];
    const front = ca > 0;
    sheet(ctx, t, C, { corners: [Q(-1, d / 2), Q(1, d / 2), Q(1, -d / 2), Q(-1, -d / 2)], aspect: w / d, res: .3, n: 2, lamp: false, draw: (g, tt, W, H) => {
      g.fillStyle = front ? '#e8e4da' : '#d8d2c4'; g.fillRect(0, 0, W, H);
      if (front) { g.fillStyle = '#5a6a8a'; g.fillRect(W * .25, H * .15, W * .5, H * .35); g.fillStyle = '#2a2a3a'; g.beginPath(); g.ellipse(W * .5, H * .28, W * .1, H * .08, 0, 0, TAU); g.fill(); g.fillRect(W * .36, H * .38, W * .28, H * .12); scribbleBars(g, W * .15, H * .62, W * .7, H * .05); scribbleBars(g, W * .25, H * .74, W * .5, H * .03); }
      else { g.strokeStyle = 'rgba(40,40,50,.25)'; g.lineWidth = 3; for (let i = 0; i < 8; i++) { g.beginPath(); g.moveTo(W * .15, H * (.2 + i * .08)); g.lineTo(W * .85, H * (.2 + i * .08)); g.stroke(); } }
    } });
  } };
}
function scribbleBars(g, x, y, w, h) { const r = prng(Math.floor(x + y)); g.fillStyle = '#2a2420'; let xx = x; while (xx < x + w) { const ww = 8 + r() * 30; g.fillRect(xx, y, Math.min(ww, x + w - xx), h); xx += ww + 6; } }
