// Film 4 v2 · c10 · the stairwell of the block (10.10–10.11): an open spiral, seen from above from inside its well. Each floor: a
// landing on the east side with two flat doors, fourteen steps winding up the other 260°, an iron railing on the inner edge (the
// engraved spiral). Cold and dim at first: two strangers on two landings (one unlocks a door, one waits with shopping bags), not
// looking at each other. ★ On "Now" the doors open, landing by landing: warm light, neighbours step out and lean on the railing,
// talking up and down the well; the camera rises up the well and out through the skylight.
//   stairs(ctx, C, t, K, o)   the stairwell from camera C (inside it, or through a facade window / the skylight: clip outside)
//   ST                         geometry
import { W, H, rgba, clamp, mix, prng, mixHex, shade, TAU, fill3, seg3, at3, radial, glowImg, glowAt, sm2, hash, proj3, trace } from './v2_c10_kit.mjs';
import { mann, MP } from './v2_c10_mann.mjs';
import { SY, BLK } from './v2_c10_city.mjs';

export const ST = { x: 119.8, z: 16.3, ri: 2.2, ro: 3.8, fh: 3, la: -.87, lb: .87, n: 14 };
const RISE = ST.fh / ST.n, DTH = (TAU - (ST.lb - ST.la)) / ST.n;
const P = (r, th, y) => [ST.x + r * Math.cos(th), y, ST.z + r * Math.sin(th)];
const Yf = (f) => SY + f * ST.fh;
// who lives here: per floor, the two doors and who steps out of them on the tribe
const DOORS = [-.45, .45];
const LOOKS = [
  { coat: '#b85a4a', pants: '#2a2a3a', hair: '#2a1a14', skin: '#e0b090' }, { coat: '#4a7a8a', pants: '#2a2a3a', hair: '#d8d0c4', skin: '#d8a882' },
  { coat: '#d8a84a', pants: '#3a3040', hair: '#1a1210', skin: '#8d5f40' }, { coat: '#6a8a5a', pants: '#2a2a2a', hair: '#7a4a2a', skin: '#f0d2b4' },
  { coat: '#8a5a8a', pants: '#2a2236', hair: '#3b2418', skin: '#c69472' }, { coat: '#e0d4bc', pants: '#3a3a4a', hair: '#2a1a14', skin: '#b98762' },
  { coat: '#c8703a', pants: '#2a2a3a', hair: '#c8c0b8', skin: '#e9c3a0' }, { coat: '#3a5a9a', pants: '#2a2a36', hair: '#5a3a22', skin: '#d9b08e' },
];
const FOLK = (() => { const r = prng(9090), o = []; for (let f = 0; f <= 14; f++) for (let d = 0; d < 2; d++) { const n = r() < .35 ? 2 : 1; for (let k = 0; k < n; k++) o.push({ f, d, k, look: LOOKS[Math.floor(r() * LOOKS.length)], dth: (k ? .17 : 0) * (d ? 1 : -1) + (r() - .5) * .08, talk: r(), up: r() < .5, ph: r() * 9, h: .94 + r() * .1 }); } return o; })();
// the two strangers
export const STR = { a: { f: 9, door: .45 }, b: { f: 8, th: -.25 } };
const doorOpen = (f, d, K) => K.now + .06 + Math.abs(f - 9) * .085 + d * .07;

function floorDraw(ctx, C, t, K, f, FOG) {
  const y0 = Yf(f), warmF = sm2((t - doorOpen(f, 0, K)) / .6), cold = FOG;
  const wallC = cold(mixHex('#8e96ac', '#d8b890', warmF * .55)), floorC = cold(mixHex('#6a7088', '#a88a6a', warmF * .5)), stepC = cold(mixHex('#7a8098', '#b89a78', warmF * .45)), edge = cold('#232636');
  // the outer wall of this storey (inner face), with the two doors on the landing, the window to the west
  const NS = 36;
  for (let i = 0; i < NS; i++) {
    const a = i / NS * TAU, b = (i + 1) / NS * TAU, sh = .82 + .18 * Math.cos((a + b) / 2 - 2.4);
    fill3(ctx, C, [P(ST.ro, a, y0), P(ST.ro, b, y0), P(ST.ro, b, y0 + ST.fh), P(ST.ro, a, y0 + ST.fh)], shade(wallC, sh - 1));
  }
  // the window (west, over the stairs): the night outside
  fill3(ctx, C, [P(ST.ro - .01, Math.PI - .13, y0 + 1.25), P(ST.ro - .01, Math.PI + .13, y0 + 1.25), P(ST.ro - .01, Math.PI + .13, y0 + 3.15), P(ST.ro - .01, Math.PI - .13, y0 + 3.15)], cold('#1a2040'));
  for (let d = 0; d < 2; d++) {
    const th = DOORS[d], w = .13, open = sm2((t - doorOpen(f, d, K)) / .45);
    const q = [P(ST.ro - .012, th - w, y0), P(ST.ro - .012, th + w, y0), P(ST.ro - .012, th + w, y0 + 2.05), P(ST.ro - .012, th - w, y0 + 2.05)];
    fill3(ctx, C, q, open > 0 ? mixHex(cold('#3a2a2a'), '#ffd9a0', open) : cold('#4a3a36'));
    if (open > 0) {
      // the leaf swings in (a dark sliver turning away), the light falls out onto the landing in a wedge
      const hx = th + w, lx = th + w - 2 * w * Math.cos(open * 1.4);
      fill3(ctx, C, [P(ST.ro - .012, hx, y0), P(ST.ro + .5 * Math.sin(open * 1.4), lx, y0), P(ST.ro + .5 * Math.sin(open * 1.4), lx, y0 + 2.05), P(ST.ro - .012, hx, y0 + 2.05)], cold('#3a2622'));
    } else { const kn = at3(C, ...P(ST.ro - .02, th + w * .7, y0 + 1.0)); if (kn) { ctx.fillStyle = cold('#c8b07a'); ctx.beginPath(); ctx.arc(kn.x, kn.y, Math.max(1, .03 * kn.k), 0, TAU); ctx.fill(); } }
    ctx.strokeStyle = edge; ctx.lineWidth = 1; ctx.beginPath(); for (let k = 0; k < 4; k++) seg3(ctx, C, q[k], q[(k + 1) % 4]); ctx.stroke();
  }
  // the landing
  const land = []; for (let i = 0; i <= 8; i++) land.push(P(ST.ro, mix(ST.la, ST.lb, i / 8), y0 + .001)); for (let i = 8; i >= 0; i--) land.push(P(ST.ri, mix(ST.la, ST.lb, i / 8), y0 + .001));
  fill3(ctx, C, land, floorC);
  // light spilling from the open doors across the landing
  for (let d = 0; d < 2; d++) { const open = sm2((t - doorOpen(f, d, K)) / .45); if (open <= 0) continue; const th = DOORS[d], w = .13 * open + .02; const S = proj3(C, [P(ST.ro, th - w, y0 + .003), P(ST.ro, th + w, y0 + .003), P(ST.ri + .05, th + w * 2.6, y0 + .003), P(ST.ri + .05, th - w * 2.6, y0 + .003)]); if (S) { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.beginPath(); trace(ctx, S); ctx.fillStyle = rgba('#ffcf8a', .45 * open); ctx.fill(); ctx.restore(); } }
  // the steps: treads, risers, the inner stringer (the helix band seen from the well)
  for (let k = 0; k < ST.n; k++) {
    const a = ST.lb + k * DTH, b = a + DTH, yt = y0 + (k + 1) * RISE;
    const tread = [P(ST.ri, a, yt), P(ST.ro, a, yt), P(ST.ro, (a + b) / 2, yt), P(ST.ro, b, yt), P(ST.ri, b, yt)];
    fill3(ctx, C, [P(ST.ri, a, yt - RISE), P(ST.ro, a, yt - RISE), P(ST.ro, a, yt), P(ST.ri, a, yt)], shade(stepC, -.25));
    if (fill3(ctx, C, tread, shade(stepC, .04 * Math.sin(k)))) { ctx.strokeStyle = edge; ctx.lineWidth = 1.2; ctx.beginPath(); seg3(ctx, C, tread[0], tread[1]); ctx.stroke(); }
    fill3(ctx, C, [P(ST.ri, a, yt - RISE - .32), P(ST.ri, b, yt - .32), P(ST.ri, b, yt), P(ST.ri, a, yt - RISE)], shade(stepC, -.4));
  }
}
function railing(ctx, C, t, K, f, FOG) {
  const y0 = Yf(f), rail = cold('#1c1e2a'), wood = FOG(mixHex('#6a4a3a', '#a8703a', sm2((t - doorOpen(f, 0, K)) / .6) * .5)); function cold(c) { return FOG(c); }
  const pts = [], bal = [];
  for (let i = 0; i <= 10; i++) { const th = mix(ST.la, ST.lb, i / 10); pts.push(P(ST.ri + .03, th, y0 + .95)); if (i % 1 === 0) bal.push([P(ST.ri + .03, th, y0), P(ST.ri + .03, th, y0 + .95)]); }
  for (let k = 0; k <= ST.n * 2; k++) { const th = ST.lb + k * DTH / 2, y = y0 + Math.min(ST.fh, (k / 2) * RISE + RISE * .5); pts.push(P(ST.ri + .03, th, y + .95)); bal.push([P(ST.ri + .03, th, y), P(ST.ri + .03, th, y + .95)]); }
  ctx.strokeStyle = rail; ctx.lineWidth = 1; ctx.beginPath(); for (const [a, b] of bal) seg3(ctx, C, a, b); ctx.stroke();
  const k = at3(C, ...P(ST.ri, 0, y0 + .95))?.k ?? 60;
  ctx.strokeStyle = wood; ctx.lineWidth = Math.max(1.5, .05 * k); ctx.lineCap = 'round'; ctx.beginPath(); for (let i = 0; i < pts.length - 1; i++) seg3(ctx, C, pts[i], pts[i + 1]); ctx.stroke();
}
function folk(ctx, C, t, K, f, FOG) {
  const y0 = Yf(f), out = [];
  // the strangers
  if (f === STR.a.f) { const th = STR.a.door, pr = sm2((t - doorOpen(f, 1, K) - .3) / .7); const r = mix(ST.ro - .5, ST.ri + .45, pr), face = mix(th, th + Math.PI, sm2((t - doorOpen(f, 1, K) - .1) / .5));
    out.push([r, th + .02, () => mann(ctx, C, ...P(r, th + .02, y0), face, pr > .02 && pr < .98 ? { ...MP.stand, step: (t - doorOpen(f, 1, K)) * 7 } : pr >= .98 ? MP.talk : MP.unlock, { col: { coat: '#6a6a5a', pants: '#2a2a32', hair: '#3a2a20', skin: '#d8a882' }, key: pr < .02, fog: FOG.f, light: sm2((t - doorOpen(f, 1, K)) / .6) * .8 }) ]); }
  if (f === STR.b.f) { const th = STR.b.th, lean = sm2((t - doorOpen(f, 0, K) - .2) / .6), r = mix(2.75, ST.ri + .45, lean);
    out.push([r, th, () => mann(ctx, C, ...P(r, th, y0), lean > .5 ? th + Math.PI : th + Math.PI / 2 + .3, lean > .5 ? MP.rail : MP.bags, { col: { coat: '#7a4a5a', pants: '#2a2a36', hair: '#c8c0b8', skin: '#e0b090' }, bags: lean < .5, fog: FOG.f, light: lean * .7 }) ]);
    if (lean >= .5) for (const s of [-.07, .07]) { const b = at3(C, ...P(2.85, th + s, y0 + .15)); if (b) out.push([2.85, th + s, () => { ctx.fillStyle = FOG('#d8c8a8'); ctx.fillRect(b.x - .09 * b.k, b.y - .15 * b.k, .18 * b.k, .3 * b.k); }]); }
  }
  // the neighbours: out of their doors on the tribe, a step or two to the railing, then lean, talk up and down
  for (const p of FOLK) {
    if (p.f !== f || (f === STR.a.f && p.d === 1 && p.k === 0)) continue;
    const t0 = doorOpen(f, p.d, K) + .15 + p.k * .3, u = clamp((t - t0) / .8); if (t < t0) continue;
    const th = DOORS[p.d] + p.dth, r = mix(ST.ro - .25, ST.ri + .45, sm2(u)), face = u < .7 ? th + Math.PI : th + Math.PI + (p.up ? .25 : -.25) * sm2((u - .7) / .3);
    const talk = .5 + .5 * Math.sin((t + p.ph) * 2.3), pose = u < 1 ? { ...MP.stand, step: (t - t0) * 7.5 } : { ...(p.talk < .5 ? MP.rail : MP.talk), head: p.up ? -.55 : .5, arms: p.talk < .5 ? MP.rail.arms : [{ fw: 1.0, out: .12, el: .9 }, { fw: mix(.7, 1.2, talk), out: .2, el: mix(1.4, .9, talk) }] };
    out.push([r, th, () => mann(ctx, C, ...P(r, th, y0), face, pose, { col: p.look, fog: FOG.f, light: .8, h: p.h })]);
  }
  return out;
}
// the whole stairwell from C: floors from the deepest visible up to the camera
export function stairs(ctx, C, t, K, o = {}) {
  const fc = Math.floor((C.y - SY) / ST.fh), lo = Math.max(0, fc - (o.deep ?? 6)), hi = Math.min(14, o.top ?? fc);
  // the bottom of the well (ground floor) far down, dark
  if (lo === 0) fill3(ctx, C, (() => { const q = []; for (let i = 0; i < 24; i++) q.push(P(ST.ro, i / 24 * TAU, SY)); return q; })(), '#2a2e40');
  else { ctx.fillStyle = '#0c0e1c'; ctx.fillRect(0, 0, W, H); }
  for (let f = lo; f <= hi; f++) {
    if (Yf(f) > C.y - .05) break;
    const depth = clamp((C.y - Yf(f)) / 24), FOG = (c) => mixHex(c, '#0a0c1a', depth * .85); FOG.f = { col: '#0a0c1a', a: depth * .85 };
    floorDraw(ctx, C, t, K, f, FOG);
    const ppl = folk(ctx, C, t, K, f, FOG); ppl.sort((p, q) => q[0] - p[0]); for (const [, , d] of ppl) d();
    railing(ctx, C, t, K, f, FOG);
    // the landing lamp (cold): a small bright fitting on the wall over the doors
    const lp = at3(C, ...P(ST.ro - .05, 0, Yf(f) + 2.5)); if (lp) glowAt(ctx, glowImg('#e8f0ff', { R: 48, core: .45, dots: 0 }), lp.x, lp.y, Math.max(3, .9 * lp.k), .5 * (1 - depth), 'screen');
  }
}
