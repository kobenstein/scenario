// Film 4 v2 · c10 · the lane behind the garden wall (10.04–10.05): it runs along +X from the gate down to the harbour; a long table of
// joined tables stepping down the slope, neighbours and family on both sides, candles, lanterns on wires, the church clock over the
// roofs at the end (it passes nine on "nine"), a neighbour leaning out of a window above who waves; someone at the table waves back.
//   lane(ctx, C, t, E, K, o)   o.behindWall: drawn from the garden (only what shows over the wall and through the gate)
//   LANE                      geometry: z (centre line), z0 (south edge = garden wall), z1 (north facades), x1 (lane end, quay)
import { W, H, rgba, clamp, mix, prng, mixHex, shade, TAU, poly3, fill3, seg3, hatchQuad, at3, box3, painter, radial, glowImg, glowAt, sm2, smr, hash, eoX, qio, trace, proj3 } from './v2_c10_kit.mjs';
import { person, POSES, U, jointAt } from './v2_c10_people.mjs';
import { G, NORTH, laneY, houseFront, sun } from './v2_c10_garden.mjs';
import { harbourFar } from './v2_c10_harbour.mjs';

export const LANE = { z: 20, z0: 17, z1: 23, x0: -8, x1: 15.5, t0: 5.0, t1: 12.6, tw: .9 };
const LZ = LANE.z;
// the south row (after the garden wall): fronts facing +Z at Z = 17
const SOUTH = (() => { const r = prng(5522), o = []; let x = 8.3; const cols = ['#c98a6a', '#e0b88a', '#b98a72', '#d9a77a']; while (x < LANE.x1 - .3) { const w = 2.8 + r() * 1.8; o.push({ x0: x, x1: Math.min(LANE.x1, x + w), h: (r() < .5 ? 2 : 3) * 2.9 + .6, fl: 0, col: cols[o.length % cols.length], sh: '#3f6a6a', seed: Math.floor(r() * 1e5), roof: r() }); o[o.length - 1].fl = Math.round((o[o.length - 1].h - .6) / 2.9); x += w + .05; } return o; })();
// the seats: x along the table, side +1 north (faces −Z: screen right), −1 south (faces +Z: screen left)
const LOOKS = [
  { coat: '#7a3a3a', pants: '#2a2236', hair: '#2a1a14' }, { coat: '#3a5a7a', pants: '#2a2a3a', hair: '#d8d0c4' }, { coat: '#c89a4a', pants: '#2a2236', hair: '#3b2418', skirt: '#7a5a3a' },
  { coat: '#4a6a4a', pants: '#2a2a2a', hair: '#1a1210' }, { coat: '#8a5a7a', pants: '#2a2236', hair: '#5a3a22', skirt: '#5a3a5a' }, { coat: '#e0d4bc', pants: '#3a3a4a', hair: '#2a1a14' },
  { coat: '#5a4a7a', pants: '#2a2a3a', hair: '#c8c0b8' }, { coat: '#9a6a3a', pants: '#2a2236', hair: '#1a1210', skirt: '#6a4a2a' }, { coat: '#3a6a6a', pants: '#2a2a3a', hair: '#7a4a2a' },
];
const HAIRS = ['short', 'grey', 'long', 'short', 'bun', 'short', 'grey', 'long', 'curly'];
export const SEATS = (() => { const r = prng(808), o = []; let i = 0;
  for (const side of [1, -1]) for (let k = 0; k < 7; k++) { const x = LANE.t0 + .55 + k * 1.08 + (side < 0 ? .45 : 0); if (x > LANE.t1 - .3) continue; const L = LOOKS[(i * 4 + (side > 0 ? 1 : 0)) % LOOKS.length], hair = HAIRS[(i * 5 + 2) % HAIRS.length];
    o.push({ x, side, seed: 40 + i, dress: { ...L, skin: ['#e9c3a0', '#d9b08e', '#b98762', '#8d5f40', '#f0d2b4', '#c69472'][i % 6] }, hair, skirt: !!L.skirt, act: ['glass', 'talk', 'lean', 'laugh', 'listen', 'talk', 'glass'][(i * 3 + (side > 0 ? 0 : 1)) % 7], ph: r() * 9, h: .93 + r() * .12 }); i++; }
  return o; })();
const tableY = (x) => laneY(LANE.t0 + Math.floor((x - LANE.t0) / 2.6) * 2.6 + 1.3);   // three joined tables, each level, stepping down
// ---------------------------------------------------------------- pieces
function ground(ctx, C, E, nightK) {
  // the lane surface: cobbles (sloped), from the gate to the quay
  const q = [[LANE.x0, laneY(LANE.x0), LANE.z0], [LANE.x1, laneY(LANE.x1), LANE.z0], [LANE.x1, laneY(LANE.x1), LANE.z1], [LANE.x0, laneY(LANE.x0), LANE.z1]];
  const pts = []; for (let x = LANE.x0; x <= LANE.x1 + .01; x += 1.5) pts.push([x, laneY(x), LANE.z0]); for (let x = LANE.x1; x >= LANE.x0 - .01; x -= 1.5) pts.push([x, laneY(x), LANE.z1]);
  const S = poly3(ctx, C, pts); if (!S) return;
  ctx.fillStyle = mixHex('#8a7a6a', '#3a3450', nightK * .7); ctx.fill();
  ctx.save(); ctx.clip();
  ctx.strokeStyle = rgba('#2a2030', .35); ctx.lineWidth = 1; ctx.beginPath();
  for (let z = LANE.z0 + .25; z < LANE.z1; z += .25) { let prev = null; for (let x = Math.max(LANE.x0, C.x - 2); x <= LANE.x1; x += .5) { const p = [x, laneY(x) + .002, z]; if (prev) seg3(ctx, C, prev, p); prev = p; } }
  ctx.stroke();
  ctx.strokeStyle = rgba('#2a2030', .22); ctx.beginPath();
  for (let i = 0; i < 420; i++) { const x = mix(Math.max(LANE.x0, C.x - 1), LANE.x1, hash(i, 1)), z = LANE.z0 + .25 * Math.floor(hash(i, 2) * 24); seg3(ctx, C, [x, laneY(x) + .002, z], [x, laneY(x) + .002, z + .25]); }
  ctx.stroke();
  ctx.restore();
}
function wallBack(ctx, C, E, gateA, nightK) {
  // the lane side of the garden wall (faces +Z) with the gate opening; the gate leaf swung in
  const z = G.wallZ, y0 = G.gy - .02, y1 = G.gy + G.wallH, g = G.gate;
  const outer = [[8, y0 - .3, z], [-8, y0, z], [-8, y1, z], [8, y1, z]], hole = [[g.x1, G.gy, z], [g.x1, G.gy + g.y1, z], [g.x0, G.gy + g.y1, z], [g.x0, G.gy, z]];
  const S = proj3(C, outer), Hh = proj3(C, hole); if (!S) return;
  ctx.beginPath(); trace(ctx, S); if (Hh) trace(ctx, Hh); ctx.fillStyle = mixHex('#b08a6a', '#4a3a52', nightK * .6); ctx.fill('evenodd');
  ctx.strokeStyle = 'rgba(40,24,30,.35)'; ctx.lineWidth = 1; ctx.beginPath(); for (let k = 1; k < 8; k++) { const y = mix(y0, y1, k / 8); seg3(ctx, C, [Math.max(-8, C.x - 1), y, z + .005], [8, y, z + .005]); } ctx.stroke();
  box3(ctx, C, -8, y1, z - .14, 8.2, y1 + .12, z + .14, (f) => (f === 'y1' ? '#c8ae8c' : '#8f735a'));
  const ang = gateA * 1.75, hx = g.x1, wl = g.x1 - g.x0, ex = hx - Math.cos(ang) * wl, ez = z + Math.sin(ang) * wl, top = G.gy + g.y1 - .02;
  fill3(ctx, C, [[ex, G.gy + .04, ez], [hx, G.gy + .04, z], [hx, top, z], [ex, top, ez]], '#2f5552');
}
function tower(ctx, C, t, E, K, nightK) {
  // the church tower by the harbour, its clock face toward the lane (−X); the minute hand reaches 12 on "nine"
  const X = 26, Z = 12, b = laneY(15.5) - .2, top = b + 11, w = 2.6;
  box3(ctx, C, X, b, Z - w / 2, X + w, top, Z + w / 2, (f) => (f === 'x0' ? mixHex('#c8a07a', '#5a4a62', nightK * .6) : f === 'z1' ? mixHex('#a87a5a', '#3a3050', nightK * .6) : '#6a5060'));
  // the spire
  const ap = at3(C, X + w / 2, top + 4.2, Z), q1 = at3(C, X, top, Z - w / 2), q2 = at3(C, X, top, Z + w / 2);
  if (ap && q1 && q2) { ctx.fillStyle = mixHex('#7a4a3a', '#2a2238', nightK * .6); ctx.beginPath(); ctx.moveTo(ap.x, ap.y); ctx.lineTo(q1.x, q1.y); ctx.lineTo(q2.x, q2.y); ctx.closePath(); ctx.fill(); }
  // belfry openings (dark arches)
  for (const zz of [-.5, .5]) { const p = at3(C, X - .01, top - 1.6, Z + zz); if (p) { ctx.fillStyle = '#1a1424'; ctx.beginPath(); ctx.ellipse(p.x, p.y, .28 * p.k, .7 * p.k, 0, 0, TAU); ctx.fill(); } }
  const c = at3(C, X - .02, top - 3.6, Z); if (!c) return;
  const R = .82 * c.k, lit = .55 + .45 * nightK;
  ctx.fillStyle = mixHex('#efe2c4', '#ffe7b0', nightK); ctx.beginPath(); ctx.ellipse(c.x, c.y, R * .8, R, 0, 0, TAU); ctx.fill();
  if (nightK > .2) radial(ctx, c.x, c.y, R * 3, '#ffcf8a', .25 * nightK, 'screen');
  ctx.strokeStyle = '#2a2030'; ctx.lineWidth = Math.max(1, R * .08); ctx.beginPath(); ctx.ellipse(c.x, c.y, R * .8, R, 0, 0, TAU); ctx.stroke();
  ctx.lineWidth = Math.max(1, R * .05); ctx.beginPath(); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ctx.moveTo(c.x + Math.sin(a) * R * .66, c.y - Math.cos(a) * R * .82); ctx.lineTo(c.x + Math.sin(a) * R * .74, c.y - Math.cos(a) * R * .92); } ctx.stroke();
  // time: 8:58 at the start of the lane, 9:00 exactly on "nine", then on
  const mins = 58 + 2 * clamp((t - (K.nine - 1.6)) / 1.6) + Math.max(0, t - K.nine) / 60, hr = 8 + mins / 60;
  const am = mins / 60 * TAU, ah = hr / 12 * TAU;
  ctx.lineCap = 'round'; ctx.lineWidth = Math.max(1.2, R * .09); ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(c.x + Math.sin(ah) * R * .4, c.y - Math.cos(ah) * R * .5); ctx.stroke();
  ctx.lineWidth = Math.max(1, R * .06); ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(c.x + Math.sin(am) * R * .62, c.y - Math.cos(am) * R * .78); ctx.stroke();
  // the bell's ring on nine: two soft rings leave the belfry
  const d = t - K.nine; if (d > 0 && d < 1.6) { for (let k = 0; k < 2; k++) { const q = clamp(d / 1.4 - k * .25); if (q <= 0 || q >= 1) continue; const bp = at3(C, X - .02, top - 1.6, Z); if (!bp) continue; ctx.strokeStyle = rgba('#ffe2b0', .5 * (1 - q)); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(bp.x, bp.y, (.6 + q * 4) * bp.k, (.8 + q * 4) * bp.k, 0, 0, TAU); ctx.stroke(); } }
}
function lanterns(ctx, C, t, E, nightK) {
  const out = [];
  for (const [xi, k] of [[6.2, 0], [9.0, 1], [11.8, 2]]) {
    const ya = laneY(xi) + 4.3, wire = [];
    for (let i = 0; i <= 12; i++) { const z = mix(LANE.z0 + .3, LANE.z1, i / 12); wire.push([xi, ya - Math.sin(Math.PI * i / 12) * .7, z]); }
    ctx.strokeStyle = 'rgba(30,24,30,.8)'; ctx.lineWidth = 1; ctx.beginPath(); for (let i = 0; i < 12; i++) seg3(ctx, C, wire[i], wire[i + 1]); ctx.stroke();
    for (let j = 1; j < 6; j++) { const w = wire[j * 2], sw = Math.sin(t * 1.3 + j + k) * .03, p = at3(C, w[0] + sw, w[1] - .28, w[2]); if (!p) continue; out.push(p);
      const r = .16 * p.k, col = j % 2 ? '#ffb35c' : '#ff9a5a'; ctx.fillStyle = mixHex(shade(col, -.2), '#fff1d6', .35 * nightK); ctx.beginPath(); ctx.ellipse(p.x, p.y, r, r * 1.15, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = rgba('#7a3a1a', .5); ctx.lineWidth = Math.max(.6, r * .08); ctx.beginPath(); for (const v of [-.5, 0, .5]) { ctx.moveTo(p.x - r * Math.sqrt(1 - v * v), p.y + v * r); ctx.lineTo(p.x + r * Math.sqrt(1 - v * v), p.y + v * r); } ctx.stroke(); }
  }
  return out;
}
// one tablecloth-covered table segment (level), stepping down the slope
function tables(ctx, C, t, E, nightK) {
  for (let k = 0; k < 3; k++) {
    const x0 = LANE.t0 + k * 2.6, x1 = Math.min(LANE.t1, x0 + 2.6), y = tableY(x0 + .1) + .76, z0 = LZ - LANE.tw / 2, z1 = LZ + LANE.tw / 2;
    const cl = mixHex('#f3ead8', '#c8c0d8', nightK * .5);
    box3(ctx, C, x0, y - .03, z0 - .06, x1, y, z1 + .06, (f) => (f === 'y1' ? cl : f === 'x0' ? shade(cl, -.12) : shade(cl, -.2)));
    // the cloth hangs down on both long sides with folds (the side facing the camera is drawn)
    for (const zs of [z0 - .06, z1 + .06]) {
      const q = [[x0, y - .03, zs], [x1, y - .03, zs], [x1, y - .34, zs], [x0, y - .34, zs]], S = poly3(ctx, C, q); if (!S) continue;
      ctx.fillStyle = shade(cl, -.16); ctx.fill(); ctx.strokeStyle = rgba('#8a8098', .45); ctx.lineWidth = 1; ctx.beginPath(); for (let i = 1; i < 12; i++) { const x = mix(x0, x1, i / 12); seg3(ctx, C, [x, y - .05, zs], [x + .02, y - .33, zs]); } ctx.stroke();
    }
    for (const [lx, lz] of [[x0 + .1, z0 + .1], [x1 - .1, z0 + .1], [x0 + .1, z1 - .1], [x1 - .1, z1 - .1]]) box3(ctx, C, lx - .03, laneY(lx), lz - .03, lx + .03, y - .34, lz + .03, () => '#3a2a24');
  }
}
// the things on the table: plates, glasses, bottles, bread, candles in jars (the candle flames are the warm hero lights)
function tableTop(ctx, C, t, E, nightK, lights) {
  const r = prng(321);
  for (let x = LANE.t0 + .3; x < LANE.t1 - .2; x += .54) {
    const y = tableY(x) + .76;
    for (const zs of [-.24, .24]) { const p = at3(C, x + (zs > 0 ? 0 : .27), y + .005, LZ + zs); if (!p) continue; ctx.fillStyle = '#fbf6ec'; ctx.beginPath(); ctx.ellipse(p.x, p.y, .12 * p.k, .045 * p.k, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = rgba('#a8a0b8', .6); ctx.lineWidth = 1; ctx.stroke(); }
  }
  for (let x = LANE.t0 + .6; x < LANE.t1 - .2; x += 1.2) {
    const y = tableY(x) + .76, b = at3(C, x + .25, y, LZ - .05); if (b) { const h = .32 * b.k, w = .035 * b.k; ctx.fillStyle = '#2a3a2a'; ctx.beginPath(); ctx.roundRect(b.x - w, b.y - h, w * 2, h, w * .5); ctx.fill(); ctx.fillRect(b.x - w * .45, b.y - h * 1.35, w * .9, h * .4); ctx.fillStyle = rgba('#d8e8c8', .35); ctx.fillRect(b.x - w * .5, b.y - h * .9, w * .35, h * .6); ctx.fillStyle = '#e8dcc0'; ctx.fillRect(b.x - w, b.y - h * .55, w * 2, h * .22); }
    const br = at3(C, x - .3, y, LZ + .05); if (br) { ctx.fillStyle = '#c8904a'; ctx.beginPath(); ctx.ellipse(br.x, br.y - .03 * br.k, .16 * br.k, .05 * br.k, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(90,50,20,.6)'; ctx.lineWidth = 1; ctx.beginPath(); for (const o of [-.08, 0, .08]) { ctx.moveTo(br.x + o * br.k - 2, br.y - .06 * br.k); ctx.lineTo(br.x + o * br.k + 2, br.y - .02 * br.k); } ctx.stroke(); }
    // the candle in a glass jar
    const c = at3(C, x, y, LZ + .02); if (c) { const fl = .85 + .15 * Math.sin(t * 9 + x * 3) * Math.sin(t * 5.3 + x); ctx.fillStyle = rgba('#e8f0ff', .25); ctx.beginPath(); ctx.roundRect(c.x - .05 * c.k, c.y - .14 * c.k, .1 * c.k, .14 * c.k, .02 * c.k); ctx.fill(); ctx.fillStyle = '#f6eedd'; ctx.fillRect(c.x - .02 * c.k, c.y - .09 * c.k, .04 * c.k, .07 * c.k); ctx.fillStyle = '#fff1d6'; ctx.beginPath(); ctx.ellipse(c.x, c.y - .12 * c.k, .012 * c.k + .6, .03 * c.k * fl + .8, 0, 0, TAU); ctx.fill(); lights.push([c.x, c.y - .12 * c.k, c.k, fl]); }
  }
}
// a wine glass held at the hand (figure units): bowl, stem, foot; red wine
const glassProp = (lift) => (g, fa) => {
  const x = fa.hx + Math.sin(fa.ang) * 4, y = fa.hy + Math.cos(fa.ang) * 4 - 2;
  g.save(); g.translate(x, y); g.fillStyle = 'rgba(230,240,255,.55)'; g.beginPath(); g.moveTo(-3, -10); g.quadraticCurveTo(-3.4, -4, 0, -3); g.quadraticCurveTo(3.4, -4, 3, -10); g.closePath(); g.fill();
  g.fillStyle = '#7a1424'; g.beginPath(); g.moveTo(-2.9, -7.5); g.quadraticCurveTo(-3, -4.2, 0, -3.4); g.quadraticCurveTo(3, -4.2, 2.9, -7.5); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(230,240,255,.8)'; g.lineWidth = .6; g.beginPath(); g.moveTo(0, -3); g.lineTo(0, 2.5); g.moveTo(-2, 2.6); g.lineTo(2, 2.6); g.stroke(); g.restore();
};
const bottleProp = (pull) => (g, fa, ba) => {
  const x = (fa.hx + ba.hx) / 2, y = (fa.hy + ba.hy) / 2 + 2;
  g.save(); g.translate(ba.hx + 2, ba.hy + 6); g.rotate(-.15); g.fillStyle = '#2a4a2a'; g.beginPath(); g.roundRect(-3, -14, 6, 18, 2); g.fill(); g.fillRect(-1.2, -21, 2.4, 8); g.fillStyle = '#e8dcc0'; g.fillRect(-3, -8, 6, 5); g.restore();
};
function seat(ctx, C, s0, t, E, K, P, nightK) {
  const y = tableY(s0.x), zSeat = LZ + s0.side * (LANE.tw / 2 + .42), hip = at3(C, s0.x, y + .48, zSeat); if (!hip) return;
  const s = hip.k * U * s0.h, flip = s0.side < 0, ph = s0.ph, tt = t + ph;
  // the chair (wooden, its back away from the table)
  P.add(hip.d + .02, () => {
    const c0 = at3(C, s0.x, y, zSeat + s0.side * .02); if (!c0) return; const k = c0.k, sd = flip ? 1 : -1;
    ctx.strokeStyle = '#3a261a'; ctx.lineWidth = Math.max(1, .035 * k); ctx.lineCap = 'round'; ctx.beginPath();
    ctx.moveTo(c0.x + sd * .2 * k, c0.y); ctx.lineTo(c0.x + sd * .2 * k, c0.y - .95 * k); ctx.moveTo(c0.x - sd * .2 * k, c0.y); ctx.lineTo(c0.x - sd * .2 * k, c0.y - .45 * k); ctx.moveTo(c0.x - sd * .22 * k, c0.y - .45 * k); ctx.lineTo(c0.x + sd * .22 * k, c0.y - .45 * k); ctx.stroke();
  });
  P.add(hip.d, () => {
    const base = { ...POSES.sit, hair: s0.hair, skirt: s0.skirt, kn: [1.5, 1.55], sh: [.62, .5], el: [.95, 1.0], head: .05 };
    let pose = base, prop = null, smile = .25;
    const cyc = (per, on) => { const u = ((tt % per) + per) % per; return sm2(u / .35) * (1 - sm2((u - on) / .45)); };
    if (s0.act === 'glass') { const up = cyc(5.6, 1.4) * .9 + (t > K.long + .4 && t < K.long + 2.2 ? sm2((t - K.long - .4) / .4) * (1 - sm2((t - K.long - 1.8) / .4)) : 0); pose = { ...base, sh: [mix(.62, 1.75, clamp(up)), .5], el: [mix(.95, .35, clamp(up)), 1.0], head: mix(.05, -.12, clamp(up)) }; prop = glassProp(up); smile = .35 + .4 * clamp(up); }
    else if (s0.act === 'talk') { const g = Math.sin(tt * 2.1) * .5 + .5; pose = { ...base, sh: [mix(.7, 1.1, g), .5], el: [mix(1.3, .9, g), 1.0], head: .02 * Math.sin(tt * 1.3) }; smile = .3; }
    else if (s0.act === 'lean') { pose = { ...base, lean: .14, sh: [.9, .8], el: [.9, .95], head: .12 }; smile = .2; }
    else if (s0.act === 'laugh') { const l = cyc(4.8, 1.1); pose = { ...base, lean: -.05 * l, head: mix(.05, -.3, l), sh: [.62, .5], el: [.95, 1.0] }; smile = .4 + .5 * l; }
    else if (s0.act === 'listen') { pose = { ...base, sh: [.85, .5], el: [2.3, 1.0], head: .14, lean: .08 }; smile = .15; }
    // the wave back on "name": the near south-side guest turns up to the window and waves
    if (s0.wave) { const w = sm2((t - K.name + .25) / .35) * (1 - sm2((t - K.name - 1.3) / .4)); if (w > 0) { pose = { ...pose, sh: [mix(pose.sh[0], 2.75, w), .5], el: [mix(pose.el[0], .3 + .15 * Math.sin(t * 9) * w, w), 1.0], head: mix(pose.head, -.42, w) }; smile = .6; } }
    if (s0.cork) { const pull = clamp((t - (K.workdayE - .6)) / .7); pose = { ...base, sh: [mix(.62, .95, sm2(pull * 2)), .75], el: [mix(.95, .7, pull), 1.35], head: .2 }; prop = bottleProp(pull); }
    const L = E.tableLight ? { x: E.tableLight[0], y: E.tableLight[1], col: '#ffcf8a', a: .45 } : E.figLight;
    person(ctx, hip.x, hip.y, s, pose, { t, seed: s0.seed, dress: s0.dress, flip, light: L, rim: E.rim, rimSide: flip ? -1 : 1, prop, smile, fog: { col: E.haze, a: clamp((hip.d - 6) / 26) * .5 } });
  });
}
// the neighbour at the window above (north facade): leans on the sill, waves down
function neighbour(ctx, C, t, E, K, nightK) {
  const X = 10.6, Z = LANE.z1, y0 = laneY(X) + 3.35, ww = .9, wh = 1.3;
  // the window: open shutters, warm room light behind
  const q = [[X - ww / 2, y0, Z - .01], [X + ww / 2, y0, Z - .01], [X + ww / 2, y0 + wh, Z - .01], [X - ww / 2, y0 + wh, Z - .01]];
  if (!fill3(ctx, C, q, mixHex('#ffcf8a', '#ffb35c', .3))) return;
  const g0 = at3(C, X, y0 + wh * .6, Z); if (g0) radial(ctx, g0.x, g0.y, 1.4 * g0.k, '#ffcf8a', .35, 'screen');
  for (const sd of [-1, 1]) fill3(ctx, C, [[X + sd * ww / 2, y0, Z - .02], [X + sd * (ww / 2 + .02), y0, Z - .42], [X + sd * (ww / 2 + .02), y0 + wh, Z - .42], [X + sd * ww / 2, y0 + wh, Z - .02]], '#3f6a6a');
  const wave = sm2((t - K.neigh - .25) / .45) * (1 - sm2((t - K.name - .2) / .5)), wv = Math.sin((t - K.neigh) * 7.5);
  // she leans out over the sill toward the lane (seen from the lane: facing −Z → screen right when looking +X)
  const hip = at3(C, X, y0 + .1, Z - .05); if (hip) {
    const s = hip.k * U * .96;
    const pose = { ...POSES.lean, hair: 'bun', lean: .32, sh: [mix(.8, 2.8, wave), .9], el: [mix(.8, .35 + .25 * wv, wave), .8], head: mix(.25, -.05, wave), hands: ['open', 'relaxed'], part: 'all' };
    ctx.save(); const sill = at3(C, X, y0, Z - .3); ctx.beginPath(); ctx.rect(0, 0, W, sill ? sill.y + .02 * sill.k : H); ctx.clip();
    person(ctx, hip.x, hip.y, s, pose, { t, seed: 77, dress: { coat: '#c86a5a', pants: '#2a2236', hair: '#d8d0c4', skin: '#e3b894', skirt: '#8a4a4a' }, light: { x: hip.x - 400, y: hip.y - 100, col: '#ffd9a0', a: .4 }, rim: '#ffcf8a', rimSide: -1, smile: .5, shadow: false });
    ctx.restore();
  }
  // the sill and a flower box in front of her
  box3(ctx, C, X - ww / 2 - .1, y0 - .1, Z - .3, X + ww / 2 + .1, y0, Z, (f) => (f === 'y1' ? '#d8c0a0' : '#8a6a52'));
  const fb = at3(C, X, y0 - .1, Z - .3); if (fb) { ctx.fillStyle = '#4a6a3a'; ctx.beginPath(); ctx.ellipse(fb.x, fb.y - .12 * fb.k, .5 * fb.k, .14 * fb.k, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#e05a6a'; for (let k = 0; k < 7; k++) { ctx.beginPath(); ctx.arc(fb.x + (k - 3) * .13 * fb.k, fb.y - .2 * fb.k + (k % 2) * .04 * fb.k, .045 * fb.k, 0, TAU); ctx.fill(); } }
}
// ---------------------------------------------------------------- the whole lane
export function lane(ctx, C, t, E, K, o = {}) {
  const nightK = clamp((t - K.long) / 9);
  if (!o.behindWall) {
    // sky + sun + the harbour at the end of the lane
    harbourFar(ctx, C, t, E, K, { fromLane: true });
  }
  // the north facades (left when looking down the lane), the south row (right), the tower
  if (!o.behindWall) {
    tower(ctx, C, t, E, K, nightK);
    for (const h of SOUTH) houseSouth(ctx, C, h, E, nightK);
  }
  if (o.behindWall) {
    // from the garden: only the lane ground and the far end of the table through the open gate, plus the tower over the roofs
    if ((E.gate ?? 0) < .02) return;
    ground(ctx, C, E, nightK);
    return;
  }
  for (const h of NORTH) houseFront(ctx, C, h, LANE.z1, { ...E, facade: E.facade * .8 }, { lit: (hh, f, i, r) => (r() < .45 ? clamp((t - K.long - 1 - r() * 6) * 3) * .9 : 0) });
  ground(ctx, C, E, nightK);
  wallBack(ctx, C, E, E.gate ?? 1, nightK);
  neighbour(ctx, C, t, E, K, nightK);
  const lan = lanterns(ctx, C, t, E, nightK);
  // table, guests, candles (painter-sorted)
  const P = painter(), lights = [];
  P.add(at3(C, LANE.t1, tableY(LANE.t1) + .7, LZ)?.d ?? 30, () => { tables(ctx, C, t, E, nightK); tableTop(ctx, C, t, E, nightK, lights); });
  for (const s0 of SEATS) { if (s0.side < 0 && s0.x > 6 && s0.x < 7.2 && !s0.wave) s0.wave = true; if (s0.side < 0 && Math.abs(s0.x - 10.4) < .55) s0.cork = true; seat(ctx, C, s0, t, E, K, P, nightK); }
  // the table and its top must sit between the far and the near guests: split by side
  P.run();
  // the light of the candles and lanterns (screen), the cork's pop
  for (const [x, y, k, fl] of lights) glowAt(ctx, glowImg('#ffb35c', { R: 64, core: .4 }), x, y, .55 * k * fl, .8, 'screen');
  for (const p of lan) glowAt(ctx, glowImg('#ffb35c', { R: 64, core: .4 }), p.x, p.y, 1.1 * p.k, .65 + .3 * nightK, 'screen');
}
function houseSouth(ctx, C, h, E, nightK) {
  // a south-row facade at Z = 17 facing +Z (the lane): drawn like houseFront, mirrored
  const yb = laneY((h.x0 + h.x1) / 2) - .2, yt = yb + h.h, z = LANE.z0, col = mixHex(h.col, '#4a3a5a', nightK * .55);
  const q = [[h.x1, yb, z], [h.x0, yb, z], [h.x0, yt, z], [h.x1, yt, z]]; const S = poly3(ctx, C, q); if (!S) return;
  ctx.fillStyle = col; ctx.fill();
  const rt = yt + 1.2; fill3(ctx, C, [[h.x1 + .15, yt, z + .25], [h.x0 - .15, yt, z + .25], [h.x0 - .15, rt, z - 1.8], [h.x1 + .15, rt, z - 1.8]], mixHex('#9a4a32', '#3a2230', nightK * .6));
  const n = Math.max(1, Math.round((h.x1 - h.x0) / 1.7)), r = prng(h.seed);
  for (let f = 0; f < h.fl; f++) for (let i = 0; i < n; i++) { const cx = mix(h.x0, h.x1, (i + .5) / n), y0 = yb + .9 + f * 2.9, lit = r() < .4 ? clamp(nightK * 3 - r()) : 0;
    fill3(ctx, C, [[cx + .31, y0, z + .01], [cx - .31, y0, z + .01], [cx - .31, y0 + 1.15, z + .01], [cx + .31, y0 + 1.15, z + .01]], lit > 0 ? mixHex('#231d33', '#ffcf8a', lit) : '#231d33');
    for (const sd of [-1, 1]) fill3(ctx, C, [[cx + sd * .31, y0, z + .02], [cx + sd * .67, y0, z + .05], [cx + sd * .67, y0 + 1.15, z + .05], [cx + sd * .31, y0 + 1.15, z + .02]], mixHex('#3f6a6a', '#22303a', nightK * .5)); }
}
