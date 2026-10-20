// Film 4 v2 · c10 · the street of the tribe (10.11–10.12): once the doors are open, the road at the block's foot is one long table of
// joined tables under zigzag strings of lanterns, a line of light through the town; neighbours along the table, on the front steps,
// in small groups, an accordion player, a child on someone's shoulders. Lantern light from above, no faces up close.
//   street(ctx, C, t, K, lights)   drawn by city() over the road surface (painter-sorted inside); pushes [x, y, k, col, a] glows
//   TX, ZT                         the table's centre line and its z range
import { W, H, rgba, clamp, mix, prng, mixHex, shade, TAU, fill3, seg3, at3, box3, painter, glowImg, glowAt, sm2, hash } from './v2_c10_kit.mjs';
import { person, kid, POSES, KIDPOSES, U } from './v2_c10_people.mjs';
import { WY } from './v2_c10_harbour.mjs';

const SY = WY + 2.2;
export const TX = 102, ZT = [-30, 196];
const TW = .9, TH = .76, BX = .95, SL = .7;
const CLOTHS = ['#f3ead8', '#d8574a', '#f3ead8', '#5a7ab0', '#e8c86a', '#f3ead8', '#7aa070', '#e8d8c0'];
const LOOKS = [
  { coat: '#b85a4a', pants: '#2a2a3a', hair: '#2a1a14' }, { coat: '#4a7a8a', pants: '#2a2a3a', hair: '#d8d0c4' }, { coat: '#d8a84a', pants: '#3a3040', hair: '#1a1210' },
  { coat: '#6a8a5a', pants: '#2a2a2a', hair: '#7a4a2a' }, { coat: '#8a5a8a', pants: '#2a2236', hair: '#3b2418' }, { coat: '#e0d4bc', pants: '#3a3a4a', hair: '#2a1a14' },
  { coat: '#c8703a', pants: '#2a2a3a', hair: '#c8c0b8' }, { coat: '#3a5a9a', pants: '#2a2a36', hair: '#5a3a22' }, { coat: '#9a3a4a', pants: '#2a2236', hair: '#1a1210' },
];
const SKIN = ['#e9c3a0', '#d9b08e', '#b98762', '#8d5f40', '#f0d2b4', '#c69472'];
const HAIRS = ['short', 'grey', 'long', 'short', 'bun', 'short', 'curly', 'long'];
const ACTS = ['glass', 'talk', 'lean', 'laugh', 'listen', 'talk', 'glass', 'turn'];
const look = (i) => { const L = LOOKS[i % LOOKS.length]; return { dress: { ...L, skin: SKIN[(i * 7) % SKIN.length] }, hair: HAIRS[(i * 5) % HAIRS.length], skirt: i % 5 === 2 }; };
// the tables: joined, each its own cloth and length
const TABLES = (() => { const r = prng(4711), o = []; let z = ZT[0]; while (z < ZT[1]) { const L = 2.0 + r() * .7; o.push({ z0: z, z1: Math.min(ZT[1], z + L), cloth: CLOTHS[o.length % CLOTHS.length] }); z += L + (r() < .25 ? .04 : 0); } return o; })();
const SEATS = (() => { const r = prng(5150), o = []; let i = 0; for (let z = ZT[0] + .4; z < ZT[1] - .3; z += SL) for (const side of [-1, 1]) { const q = r(); if (q > .68) { i++; continue; } o.push({ z: z + (r() - .5) * .12, side, i, act: ACTS[(i * 3 + (side > 0 ? 1 : 0)) % ACTS.length], ph: r() * 9, h: .92 + r() * .12, ...look(i) }); i++; } return o; })();
// standing people: groups on the carriageway beside the table and on the pavements; seats on the front steps
const STAND = (() => { const r = prng(6262), o = []; let i = 300;
  for (const [x, z, n] of [[95.6, 44, 3], [108.4, 57, 2], [96.2, 74, 3], [107.6, 86, 2], [95.4, 99, 2], [108.2, 108, 3], [96, 122, 2], [108, 134, 3], [95.8, 148, 2], [107.8, 160, 2], [96.4, 30, 2], [108.6, 33, 2], [95.2, 172, 3], [108, 184, 2]])
    for (let k = 0; k < n; k++) { const a = k / n * TAU + r(); o.push({ x: x + Math.cos(a) * .55, z: z + Math.sin(a) * .55, face: Math.cos(a) > 0 ? -1 : 1, i, ph: r() * 9, h: .92 + r() * .14, glass: r() < .5, ...look(i) }); i++; }
  return o; })();
const STEPS = [[113.3, 16.3, -1], [113.3, 40, -1], [113.3, 64, -1], [93.0, 46, 1], [93.0, 62, 1], [93.0, 80, 1]];   // x of the lowest step's front, z, facing (−1: west)
const STEPPEOPLE = (() => { const o = []; let i = 500; for (const [x, z, f] of STEPS) for (const dz of [-.8, .55]) { o.push({ x: x - f * .55, z: z + dz, face: f, i, ph: i * .7, h: .95, ...look(i) }); i++; } return o; })();
const ACC = { x: 106.4, z: 50.5 }, RIDE = { x: 97.8, z: 54.5 };

// a wine glass held at the hand (figure units)
const glassProp = (g, fa) => { const x = fa.hx + Math.sin(fa.ang) * 4, y = fa.hy + Math.cos(fa.ang) * 4 - 2; g.save(); g.translate(x, y); g.fillStyle = 'rgba(230,240,255,.6)'; g.beginPath(); g.moveTo(-3, -10); g.quadraticCurveTo(-3.4, -4, 0, -3); g.quadraticCurveTo(3.4, -4, 3, -10); g.closePath(); g.fill(); g.fillStyle = '#7a1424'; g.beginPath(); g.moveTo(-2.9, -7.5); g.quadraticCurveTo(-3, -4.2, 0, -3.4); g.quadraticCurveTo(3, -4.2, 2.9, -7.5); g.closePath(); g.fill(); g.strokeStyle = 'rgba(230,240,255,.85)'; g.lineWidth = .6; g.beginPath(); g.moveTo(0, -3); g.lineTo(0, 2.5); g.moveTo(-2, 2.6); g.lineTo(2, 2.6); g.stroke(); g.restore(); };
// the accordion: red body, white keys, bellows between the hands that open and close
const accProp = (t) => (g, fa, ba) => {
  const sq = .5 + .5 * Math.sin(t * 2.2), cx = (fa.hx + ba.hx) / 2 + 2, cy = (fa.hy + ba.hy) / 2 - 2, hh = 16, bw = 12 + 8 * sq, xa = cx - bw / 2;
  g.save(); g.fillStyle = '#3a2a34'; g.fillRect(xa, cy - hh + 2, bw, hh * 2 - 4);
  g.strokeStyle = '#d8c8b0'; g.lineWidth = .8; g.beginPath(); for (let k = 0; k <= 6; k++) { const x = xa + bw * k / 6; g.moveTo(x, cy - hh + 2); g.lineTo(x, cy + hh - 2); } g.stroke();
  g.fillStyle = '#b8322e'; g.beginPath(); g.roundRect(xa - 7, cy - hh, 7, hh * 2, 2); g.fill(); g.beginPath(); g.roundRect(xa + bw, cy - hh, 9, hh * 2, 2); g.fill();
  g.fillStyle = '#f3ead8'; g.fillRect(xa + bw + 4, cy - hh + 3, 4, hh * 2 - 6); g.fillStyle = '#2a1a20'; for (let k = 0; k < 6; k++) g.fillRect(xa + bw + 4, cy - hh + 5 + k * 4.6, 2.6, 1.6); g.restore();
};
// far away a person is a small solid shape in the same colours (head, shoulders, body), no switch in hue
function blob(ctx, x, y, k, L, sit) {
  const hh = 1.75 * k, r = Math.max(.8, hh * .065), by = sit ? y - hh * .1 : y - hh * .28;
  ctx.fillStyle = L.dress.coat; ctx.beginPath(); ctx.ellipse(x, by, Math.max(.8, hh * .12), Math.max(1, hh * (sit ? .17 : .26)), 0, 0, TAU); ctx.fill();
  ctx.fillStyle = L.dress.skin; ctx.beginPath(); ctx.arc(x, by - hh * (sit ? .22 : .32), r, 0, TAU); ctx.fill();
  ctx.fillStyle = L.dress.hair; ctx.beginPath(); ctx.arc(x, by - hh * (sit ? .22 : .32) - r * .35, r * .9, Math.PI, TAU); ctx.fill();
}
const LIGHT = (p) => ({ x: p.x + 60, y: p.y - 500, col: '#ffcf8a', a: .5 });
// the crowd in lantern light: every colour pulled a little toward the warm light, far ones toward the night
const WARM = (d) => (d > 60 ? { col: '#3a2c48', a: clamp((d - 60) / 160) * .5 } : { col: '#ffcf8a', a: .1 * clamp((60 - d) / 30) });
function seated(ctx, C, s0, t, P, camSide) {
  const xs = TX + s0.side * BX, hip = at3(C, xs, SY + .46, s0.z); if (!hip || hip.x < -80 || hip.x > W + 80 || hip.y < -120 || hip.y > H + 160) return;
  const far = s0.side === camSide ? -1 : 1, px = 1.75 * hip.k * s0.h;
  // the bench under them
  P.add(hip.d + far * .35 + .05, () => { const b0 = at3(C, xs, SY + .44, s0.z - SL / 2), b1 = at3(C, xs, SY + .44, s0.z + SL / 2); if (!b0 || !b1) return; ctx.strokeStyle = '#4a3428'; ctx.lineWidth = Math.max(1, .07 * hip.k); ctx.beginPath(); ctx.moveTo(b0.x, b0.y); ctx.lineTo(b1.x, b1.y); ctx.stroke(); });
  P.add(hip.d + far * .35, () => {
    if (px < 15) { blob(ctx, hip.x, hip.y, hip.k * s0.h, s0, true); return; }
    const tt = t + s0.ph, base = { ...POSES.sit, hair: s0.hair, skirt: s0.skirt, sh: [.62, .5], el: [.95, 1.0], head: .05 }; let pose = base, prop = null, smile = .3;
    const cyc = (per, on) => { const u = ((tt % per) + per) % per; return sm2(u / .35) * (1 - sm2((u - on) / .45)); };
    if (s0.act === 'glass') { const up = cyc(5.2, 1.3) * .9; pose = { ...base, sh: [mix(.62, 1.75, up), .5], el: [mix(.95, .35, up), 1.0], head: mix(.05, -.12, up) }; prop = glassProp; smile = .4; }
    else if (s0.act === 'talk') { const g = Math.sin(tt * 2.1) * .5 + .5; pose = { ...base, sh: [mix(.7, 1.1, g), .5], el: [mix(1.3, .9, g), 1.0] }; }
    else if (s0.act === 'lean') pose = { ...base, lean: .14, sh: [.9, .8], el: [.9, .95], head: .12 };
    else if (s0.act === 'laugh') { const l = cyc(4.6, 1.1); pose = { ...base, lean: -.05 * l, head: mix(.05, -.3, l) }; smile = .4 + .5 * l; }
    else if (s0.act === 'listen') pose = { ...base, sh: [.85, .5], el: [2.3, 1.0], head: .14, lean: .08 };
    else if (s0.act === 'turn') pose = { ...base, head: -.1, sh: [.5, .62], el: [.9, .7] };
    person(ctx, hip.x, hip.y, hip.k * U * s0.h, pose, { t, seed: s0.i, dress: s0.dress, flip: s0.side > 0, prop, smile, shadow: false, fog: WARM(hip.d) });
  });
}
function standing(ctx, C, p, t, P, o = {}) {
  const hipY = SY + (p.y0 || 0) + .82 * p.h, hip = at3(C, p.x, hipY, p.z); if (!hip || hip.x < -100 || hip.x > W + 100 || hip.y < -200 || hip.y > H + 200) return;
  const px = 1.75 * hip.k * p.h;
  P.add(hip.d, () => {
    if (px < 15) { blob(ctx, hip.x, hip.y, hip.k * p.h, p, false); return; }
    const tt = t + p.ph, g = .5 + .5 * Math.sin(tt * 1.9);
    let pose = o.pose || (p.glass ? { sh: [mix(.55, 1.45, sm2(((tt % 6) / 6 - .55) / .15) * (1 - sm2(((tt % 6) / 6 - .8) / .12))), .2], el: [1.25, .3], head: .02 } : { sh: [mix(.35, .9, g), .15], el: [mix(.9, 1.4, g), .35], head: .03 * Math.sin(tt) });
    pose = { ...POSES.stand, ...pose, hair: p.hair, skirt: p.skirt };
    const r = person(ctx, hip.x, hip.y, hip.k * U * p.h, pose, { t, seed: p.i, dress: p.dress, flip: p.face < 0, ...(o.prop ? { light: LIGHT(hip), rim: '#ffcf8a', rimSide: p.face < 0 ? 1 : -1 } : { fog: WARM(hip.d) }), prop: o.prop || (p.glass ? glassProp : null), smile: .35 });
    if (o.after) o.after(r, hip);
  });
}
function sitStep(ctx, C, p, t, P) {
  const hip = at3(C, p.x, SY + .44, p.z); if (!hip || hip.x < -80 || hip.x > W + 80 || hip.y < -120 || hip.y > H + 160) return;
  P.add(hip.d, () => {
    if (1.75 * hip.k < 15) { blob(ctx, hip.x, hip.y, hip.k, p, true); return; }
    const tt = t + p.ph;
    person(ctx, hip.x, hip.y, hip.k * U * p.h, { ...POSES.sit, hip: [1.9, 1.95], kn: [2.1, 2.15], sh: [.9, .8], el: [.9, 1.0], lean: .2, head: .05 * Math.sin(tt * .7), hair: p.hair, skirt: p.skirt }, { t, seed: p.i, dress: p.dress, flip: p.face < 0, smile: .3, shadow: false, fog: WARM(hip.d) });
  });
}
// one slice of the long table (cloth top, the near drape, the things on it)
function slice(ctx, C, z0, z1, cloth, camSide, t, lights) {
  const y = SY + TH, x0 = TX - TW / 2, x1 = TX + TW / 2;
  if (!fill3(ctx, C, [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]], cloth)) return;
  const xs = camSide > 0 ? x1 + .02 : x0 - .02; fill3(ctx, C, [[xs, y, z0], [xs, y, z1], [xs, y - .3, z1], [xs, y - .3, z0]], shade(cloth, -.22));
  if (cloth === '#d8574a') { const p = at3(C, TX, y, (z0 + z1) / 2); if (p && p.k > 30) { ctx.strokeStyle = 'rgba(250,240,230,.55)'; ctx.lineWidth = Math.max(1, .03 * p.k); ctx.beginPath(); seg3(ctx, C, [x0, y + .002, (z0 + z1) / 2], [x1, y + .002, (z0 + z1) / 2]); seg3(ctx, C, [TX, y + .002, z0], [TX, y + .002, z1]); ctx.stroke(); } }
  // plates and glasses at each seat, a candle every other slice, a bottle now and then
  const zc = (z0 + z1) / 2, p = at3(C, TX, y, zc); if (!p) return;
  if (p.k > 10) for (const sx of [-.28, .28]) { const q = at3(C, TX + sx, y + .004, zc); if (!q) continue; ctx.fillStyle = '#fbf6ec'; ctx.beginPath(); ctx.ellipse(q.x, q.y, .11 * q.k, .05 * q.k, 0, 0, TAU); ctx.fill(); }
  const h = hash(Math.round(zc * 10), 3);
  if (h < .5) { const c = at3(C, TX + .05, y + .1, zc); if (c) { const fl = .85 + .15 * Math.sin(t * 9 + zc * 3) * Math.sin(t * 5.3 + zc); if (c.k > 20) { ctx.fillStyle = 'rgba(232,240,255,.3)'; ctx.fillRect(c.x - .04 * c.k, c.y, .08 * c.k, .1 * c.k); } ctx.fillStyle = '#fff1d6'; ctx.beginPath(); ctx.arc(c.x, c.y, Math.max(.9, .025 * c.k * fl), 0, TAU); ctx.fill(); lights.push([c.x, c.y, c.k * .5 * fl, '#ffb35c', .8]); } }
  else if (h > .82 && p.k > 14) { const b = at3(C, TX - .1, y, zc); if (b) { const hh = .3 * b.k, w = .035 * b.k; ctx.fillStyle = h > .9 ? '#2a3a2a' : '#5a1a24'; ctx.fillRect(b.x - w, b.y - hh, w * 2, hh); ctx.fillRect(b.x - w * .45, b.y - hh * 1.35, w * .9, hh * .4); } }
}
// the lantern strings: zigzag across the street between poles on both kerbs, bulbs and paper lanterns
const PX = [93.7, 110.3], LY = 5.3, ZL = [-34, 330];
function strings(ctx, C, t, K, lights) {
  const on = (z) => sm2((t - (K.againE - .35 + Math.max(0, z - 10) / 120)) / .3);   // the bulbs light in a wave up the street, from the block
  for (let z = ZL[0], i = 0; z < ZL[1]; z += 6, i++) {
    const xa = PX[i % 2], xb = PX[(i + 1) % 2], za = z, zb = z + 6, mid = at3(C, (xa + xb) / 2, SY + LY, (za + zb) / 2); if (!mid) continue;
    const pole = at3(C, xa, SY, za), poleT = at3(C, xa, SY + LY + .3, za);
    if (pole && poleT && mid.k > 3) { ctx.strokeStyle = '#1a1622'; ctx.lineWidth = Math.max(1, .09 * poleT.k); ctx.beginPath(); ctx.moveTo(pole.x, pole.y); ctx.lineTo(poleT.x, poleT.y); ctx.stroke(); }
    const n = 16, pts = []; for (let k = 0; k <= n; k++) { const u = k / n; pts.push([mix(xa, xb, u), SY + LY - 1.0 * Math.sin(Math.PI * u), mix(za, zb, u)]); }
    if (mid.k > 4) { ctx.strokeStyle = 'rgba(26,20,30,.85)'; ctx.lineWidth = 1; ctx.beginPath(); for (let k = 0; k < n; k++) seg3(ctx, C, pts[k], pts[k + 1]); ctx.stroke(); }
    const L = on(z);
    for (let k = 1; k < n; k++) {
      const sw = .03 * Math.sin(t * 1.4 + k + i), p = at3(C, pts[k][0], pts[k][1] - .12 + sw * .3, pts[k][2] + sw); if (!p || p.x < -30 || p.x > W + 30 || p.y < -30 || p.y > H + 30) continue;
      const lan = (k + i) % 5 === 2;
      if (lan && p.k > 6) { const r = .17 * p.k, col = (k + i) % 2 ? '#ff9a5a' : '#ffc06a'; ctx.fillStyle = mixHex(shade(col, -.45), mixHex(col, '#fff1d6', .3), L); ctx.beginPath(); ctx.ellipse(p.x, p.y + r * .4, r, r * 1.15, 0, 0, TAU); ctx.fill(); if (L > 0) lights.push([p.x, p.y + r * .4, p.k * 1.1, '#ffb35c', .55 * L]); }
      else { ctx.fillStyle = mixHex('#3a3040', '#fff1d6', L); ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(.7, .035 * p.k), 0, TAU); ctx.fill(); if (L > 0 && p.k > 2.5) lights.push([p.x, p.y, p.k * .45, '#ffcf8a', .5 * L]); }
    }
  }
}
export function street(ctx, C, t, K, lights) {
  const camSide = C.x > TX ? 1 : -1, P = painter();
  strings(ctx, C, t, K, lights);
  // the table slices, the seated, the standing, the steps
  for (const T of TABLES) for (let z = T.z0; z < T.z1 - .01; z += SL) { const z1 = Math.min(T.z1, z + SL), c = at3(C, TX, SY + TH, (z + z1) / 2); if (!c || c.x < -200 || c.x > W + 200 || c.y < -200 || c.y > H + 200) continue; P.add(c.d, () => slice(ctx, C, z, z1, T.cloth, camSide, t, lights)); }
  for (const [x, z, f] of STEPS) for (let k = 0; k < 3; k++) { const xa = x - f * k * .35, xb = f < 0 ? 116 : 92, c = at3(C, (xa + xb) / 2, SY + k * .17, z); if (!c) continue; P.add(c.d + .6 - k * .01, () => box3(ctx, C, Math.min(xa, xb), SY + k * .17, z - 2, Math.max(xa, xb), SY + (k + 1) * .17, z + 2, (fc) => (fc === 'y1' ? '#5a5466' : '#3a3446'))); }
  for (const s0 of SEATS) seated(ctx, C, s0, t, P, camSide);
  for (const p of STAND) standing(ctx, C, p, t, P);
  for (const p of STEPPEOPLE) sitStep(ctx, C, p, t, P);
  // the accordion player (by the table, facing the guests, swaying) and the child on a father's shoulders
  standing(ctx, C, { x: ACC.x, z: ACC.z, face: -1, i: 900, ph: 0, h: 1.02, ...look(6) }, t, P, { pose: { sh: [1.05, .95], el: [1.35, 1.45], lean: .04 + .03 * Math.sin(t * 2.2), head: .1 + .06 * Math.sin(t * 1.1) }, prop: accProp(t) });
  standing(ctx, C, { x: RIDE.x, z: RIDE.z, face: 1, i: 901, ph: 1, h: 1.04, ...look(7) }, t, P, { pose: { sh: [.55, .45], el: [1.9, 2.0], head: 0 },
    after: (r, hip) => { const s = hip.k * U * 1.04; if (1.75 * hip.k < 15) return; const hd = r.head; kid(ctx, hd[0] - 3 * s, hd[1] + 5 * s, s, { ...KIDPOSES.ride, sh: [2.2 + .3 * Math.sin(t * 2.4), .7], el: [.4, 1.1] }, { t, seed: 902, dress: { top: '#e8c84a', pants: '#3a5a8a', skin: '#e9c3a0', hair: '#5a3a22' }, hair: 'curly', light: LIGHT(hip), rim: '#ffcf8a' }); } });
  P.run();
}
