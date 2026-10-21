// c15 · the engraved world panorama around the Maslow hill: terrain layers (theatre flats at depth k, maslow4's parallax), terraced fields,
// trees, villages, and the ghosts who work on them. Every layer is drawn in its own units through LC(C, k) (lib/v2_c15_kit.mjs).
//   night n (1 deep night … 0 day) and sun { x, y (screen), u (0..1 strength) } tint the land; ghosts live on the terrace lines.
import { W, H, clamp, mix, prng } from '../engine.mjs';
import { LC, toS, toW, setL, viewB, HZ, hash, noise, fbm, rgba, mixH, shadeH, hatchL, poly, line, vg, glowAt, smt } from './v2_c15_kit.mjs';
import { ghost, workPose, POSE, mixPose } from './v2_c15_ghost.mjs';

const TAU = Math.PI * 2, INK = '#130f24';

// ---------------------------------------------------------------- terrain layers
// top(x): the crest (layer units, y down); terraces at fixed heights; ghosts: { x, kind, rate, ph, dir, props, robe, hat }
const smoothstep = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
const bump = (x, c, w, h) => h * Math.exp(-(((x - c) / w) ** 2));
export const LAND = {
  // far panorama behind the hill (k > 1): soft ranges with villages, seen beyond the hill to its right
  far3: { k: 3.0, col: '#1d1c44', day: '#8a7a8a', rim: .16, seed: 3, top: (x) => HZ - 18 - 22 * (.5 + .5 * fbm(x * .006 + 3)) - bump(x, 1500, 160, 30) - bump(x, 2100, 220, 42) },
  far2: { k: 2.0, col: '#1a1a3e', day: '#7a6a72', rim: .2, seed: 5, top: (x) => HZ - 10 - 26 * (.5 + .5 * fbm(x * .008 + 9)) - bump(x, 1650, 120, 26) - bump(x, 2350, 170, 48) },
  mid14: { k: 1.4, col: '#17163a', day: '#6e5c5c', rim: .24, seed: 7, top: (x) => HZ - 6 - 20 * (.5 + .5 * fbm(x * .011 + 1)) - bump(x, 1900, 90, 30) },
  // the near ridges in front of the hill's right flank (k < 1): terraced fields where the ghosts of the valleys work
  near8: { k: .8, col: '#16143a', day: '#5a4a48', rim: .3, seed: 11, terr: 18, top: (x) => HZ - 28 - 34 * (1 - smt((x - 1720) / 200)) - bump(x, 1640, 150, 120) - bump(x, 1700, 120, 100) - 14 * fbm(x * .013 + 4) },
  near6: { k: .6, col: '#141236', day: '#4e3e3a', rim: .34, seed: 13, terr: 22, top: (x) => HZ - 40 + 16 * smt((x - 1980) / 320) - bump(x, 1560, 120, 250) - bump(x, 1760, 160, 300) - bump(x, 1960, 110, 90) - 16 * fbm(x * .011 + 2) },
};
// the visible x range of a layer with a margin
const xRange = (L, m = 60) => { const [x0, , x1] = viewB(L, m); return [x0, x1]; };

// draw one terrain layer (screen-space path from layer units; fills down to the frame bottom)
export function drawLand(ctx, t, C, key, o = {}) {
  const Ld = LAND[key], L = LC(C, Ld.k); if (L.z <= 0 || L.z > 400) return;
  const [x0, x1] = xRange(L), n = o.night ?? 1, sun = o.sun;
  const step = Math.max(.5, 7 / L.z), pts = [];
  for (let x = Math.floor(x0 / step) * step; x <= x1 + step; x += step) pts.push([x, Ld.top(x)]);
  // skip when the whole crest is below the frame
  let minY = 1e9; for (const p of pts) { const Y = toS(L, p[0], p[1])[1]; if (Y < minY) minY = Y; } if (minY > H + 5) return;
  ctx.save(); setL(ctx, L);
  const [, by] = toW(L, 0, H + 40), bot = Math.max(by, HZ + 5);
  ctx.beginPath(); ctx.moveTo(pts[0][0], bot); for (const p of pts) ctx.lineTo(p[0], p[1]); ctx.lineTo(pts[pts.length - 1][0], bot); ctx.closePath();
  const yTop = Math.min(...pts.map((p) => p[1])), base = mixH(Ld.day, Ld.col, n);
  ctx.fillStyle = vg(ctx, yTop, bot, [[0, shadeH(base, .1)], [.35, base], [1, shadeH(base, -.35)]]); ctx.fill();
  ctx.save(); ctx.clip();
  // terraces: fixed heights; each a retaining wall band below the line and furrows on the field above it
  if (Ld.terr) {
    const g = Ld.terr; ctx.lineCap = 'butt';
    for (let y = Math.ceil(yTop / g) * g; y < bot; y += g) {
      const yy = y + 3 * Math.sin(y * .7);
      // wall
      ctx.fillStyle = rgba(INK, .32); ctx.fillRect(x0 - 50, yy, x1 - x0 + 100, g * .22);
      ctx.strokeStyle = rgba('#c8b8d8', .1 + .1 * (1 - n)); ctx.lineWidth = 1.1 / L.z; ctx.beginPath(); ctx.moveTo(x0 - 50, yy); ctx.lineTo(x1 + 50, yy); ctx.stroke();
      // furrows (short slanted strokes in rows above the wall)
      if (L.z * g > 26) {
        ctx.strokeStyle = rgba(INK, .28); ctx.lineWidth = .9 / L.z; ctx.beginPath();
        const fs = Math.max(2.2, 6 / L.z); for (let x = Math.floor(x0 / fs) * fs; x < x1; x += fs) { const hh = hash(Math.round(x / fs) * 1.3 + y); if (hh < .25) continue; ctx.moveTo(x, yy - g * .78); ctx.lineTo(x + g * .1, yy - g * .1); }
        ctx.stroke();
      }
    }
  }
  hatchL(ctx, [x0 - 40, yTop - 10, x1 + 40, bot], L.z, { ang: .12, gap: 2.6, a: .2, seed: Ld.seed });
  ctx.restore();
  // the crest: a moonlit rim (cream) or the sun's warm edge
  ctx.lineJoin = 'round'; ctx.strokeStyle = rgba(mixH('#e8dcc8', '#ffd08a', sun ? sun.u : 0), Ld.rim * (.6 + .4 * n) + (sun ? .3 * sun.u : 0)); ctx.lineWidth = 1.3 / L.z;
  ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
  // trees along the crest and the terrace walls (deterministic per layer, density by zoom)
  trees(ctx, L, Ld, x0, x1, n);
  ctx.restore();
}
function trees(ctx, L, Ld, x0, x1, n) {
  const sp = 26 / Math.max(.6, Ld.k) * 1.4, r = (i) => hash(i * 7.31 + Ld.seed);
  const colA = mixH('#56604e', '#26303a', n), colB = mixH('#3c4638', '#1a2030', n);
  for (let i = Math.floor(x0 / sp); i * sp < x1; i++) {
    if (r(i) < .45) continue;
    const x = i * sp + r(i + .5) * sp * .6, y = Ld.top(x) + 1, s = (6 + 6 * r(i + .7)) / Ld.k * .5;
    if (r(i + .3) < .5) { // cypress
      ctx.fillStyle = r(i + .9) < .5 ? colA : colB; ctx.beginPath(); ctx.moveTo(x, y - s * 2.6); ctx.quadraticCurveTo(x + s * .55, y - s * 1.2, x + s * .3, y); ctx.lineTo(x - s * .3, y); ctx.quadraticCurveTo(x - s * .55, y - s * 1.2, x, y - s * 2.6); ctx.fill();
    } else { // olive: a round crown on a short trunk
      ctx.strokeStyle = colB; ctx.lineWidth = s * .14; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + s * .1, y - s * .6); ctx.stroke();
      ctx.fillStyle = colA; ctx.beginPath(); ctx.ellipse(x, y - s * .95, s * .75, s * .5, 0, 0, TAU); ctx.fill();
    }
  }
}

// ---------------------------------------------------------------- ghosts of the valleys (on the near terraces)
// deterministic crowd per layer: on terrace lines below the crest, each with a work cycle; returns nothing
export const CROWD = {};
function crowdOf(key) {
  if (CROWD[key]) return CROWD[key];
  const Ld = LAND[key], r = prng(97 + Ld.seed * 13), out = [], kinds = ['sickle', 'hoe', 'glean', 'carry', 'hoe', 'plant', 'sickle', 'haul'];
  for (let x = 1350; x < 2700; x += 22 + r() * 40) {
    const y0 = Ld.top(x), g = Ld.terr || 20, lines = []; for (let y = Math.ceil(y0 / g) * g; y < HZ - 4; y += g) lines.push(y);
    if (!lines.length) continue;
    const y = lines[Math.floor(r() * Math.min(lines.length, 5))] + 3 * Math.sin(lines[0] * .7);
    if (y < y0 + 4) continue;
    const kind = kinds[Math.floor(r() * kinds.length)];
    out.push({ x, y, kind, rate: .55 + r() * .35, ph: r(), dir: r() < .5 ? 1 : -1, robe: r() < .4 ? 'ankle' : r() < .5 ? 'knee' : 0, hat: ['brim', 'scarf', 0, 'cap', 0, 'hood'][Math.floor(r() * 6)], seed: Math.floor(r() * 1000) });
  }
  // the hero's neighbours on his terrace (near6): he is one of many, bent at work
  if (key === 'near6') for (const [x, y, kind, dir, seed] of [[1527, 485, 'hoe', 1, 611], [1543, 463, 'sickle', -1, 612], [1586, 463, 'hoe', 1, 613], [1607, 485, 'carry', -1, 614], [1626, 463, 'sickle', 1, 615]])
    out.push({ x, y, kind, rate: .62 + (seed % 5) * .05, ph: (seed * .37) % 1, dir, robe: seed % 2 ? 'knee' : 0, hat: ['brim', 'scarf', 'cap'][seed % 3], seed });
  return (CROWD[key] = out);
}
const PROPS = { sickle: [{ kind: 'sickle' }], hoe: [{ kind: 'hoe', through: 'hands', over: 8, under: 34 }], glean: [], carry: [{ kind: 'basket', on: 'head', fill: 'sheaf' }], plant: [], haul: [] };
// u straighten 0..1 (★: the bent stand up), look 0..1 (and look up); hero: { x, y, look } one chosen ghost
export function drawCrowd(ctx, t, C, key, o = {}) {
  const Ld = LAND[key], L = LC(C, Ld.k); if (L.z <= 0) return;
  const [x0, x1] = xRange(L, 120), sc = L.z * 8.5 / Ld.k / 100, list = crowdOf(key);
  for (const g of list) {
    if (g.x < x0 || g.x > x1) continue;
    const [X, Y] = toS(L, g.x, g.y); if (Y < -50 || Y > H + 120) continue;
    const hero = o.hero && Math.abs(g.x - o.hero.x) < 1 ? o.hero : null, kind = hero && hero.kind ? hero.kind : g.kind;
    // the hero keeps working until his moment: the work cycle slows to a stop before he straightens (no snap)
    const ph = hero ? t * g.rate + g.ph - hero.u * .35 : t * g.rate + g.ph;
    let P = workPose(kind, ph, { robe: g.robe });
    let su = clamp((o.straight ?? 0) * 1.6 - hash(g.seed) * .6);
    if (hero) su = Math.max(su, hero.u);
    if (su > 0) P = mixPose(P, { ...POSE.look, robe: g.robe, ...(hero ? { head: -.62 } : {}) }, su * su * (3 - 2 * su));
    ghost(ctx, X, Y, sc, { ...P, hat: g.hat }, { t, seed: g.seed, dir: hero ? -1 : g.dir, props: su > .5 && !hero ? [] : PROPS[kind], a: hero ? Math.min(1, (o.a ?? .85) + .15 * hero.u) : o.a ?? .85, warm: hero ? hero.warm : o.warm });
  }
}

// ---------------------------------------------------------------- the frieze: everyone who has ever lived, standing on the far ridge
// (layer k 4.5, the nearer of maslow4's two ridges); ghosts ~140 units tall, a slow wave rises along the horizon (reveal u per figure)
import { ridgeTop } from './v2_c15_kit.mjs';
const ARCH = [
  { n: 'hunter', P: { sh: [.35, -.04], el: [.95, .2] }, props: [{ kind: 'spear', len: 125, up: .75 }] },
  { n: 'mother', P: { robe: 'ankle', hat: 'scarf', sh: [.55, .25], el: [1.75, .4] }, child: true },
  { n: 'farmer', P: { hat: 'brim', sh: [.5, -.04], el: [2.1, .2] }, props: [{ kind: 'hoe', ang: -.55, len: 70, up: .2, side: -1 }] },
  { n: 'builder', P: { sh: [2.75, .1], el: [1.4, .3], lean: .05 }, props: [{ kind: 'stone' }] },
  { n: 'water', P: { robe: 'ankle', sh: [2.95, .1], el: [.25, .2] }, props: [{ kind: 'jar' }] },
  { n: 'shepherd', P: { robe: 'knee', hat: 'hood', sh: [.45, .0], el: [.9, .2] }, props: [{ kind: 'crook', len: 120, up: .8, side: 1 }] },
  { n: 'fisher', P: { hat: 'cap', sh: [.6, .1], el: [.6, .3] }, props: [{ kind: 'net' }] },
  { n: 'reaper', P: { hat: 'brim', sh: [.4, -.04], el: [2.2, .2] }, props: [{ kind: 'scythe', ang: -.5, len: 85, up: .25, side: -1 }] },
  { n: 'porter', P: { sh: [2.6, .05], el: [1.6, .25], lean: .06 }, props: [{ kind: 'sack', dx: -1, w: 12, h: 8 }] },
  { n: 'elder', P: { lean: .12, head: .1, sh: [.55, .05], el: [.5, .2], robe: 'knee' }, props: [{ kind: 'staff', len: 95, up: .82 }] },
  { n: 'miner', P: { hat: 'cap', sh: [.45, -.04], el: [2.0, .2] }, props: [{ kind: 'pick', ang: -.6, len: 60, up: .25 }] },
  { n: 'washer', P: { robe: 'ankle', hat: 'scarf', sh: [.3, .05], el: [.9, .2] }, props: [{ kind: 'basket', w: 18, h: 10 }] },
  { n: 'smith', P: { sh: [.2, .05], el: [.3, .2] }, props: [{ kind: 'hammer' }] },
  { n: 'worker', P: { hat: 'cap', sh: [.15, .05], el: [.25, .2] }, props: [{ kind: 'pail' }] },
  { n: 'child', P: { kid: 1, sh: [.3, .1], el: [.4, .3] } },
  { n: 'weaver', P: { robe: 'ankle', hat: 'bun', sh: [.55, .35], el: [1.3, 1.1] } },
];
export const FRIEZE = (() => { const r = prng(4501), out = []; let x = 380, i = 0; while (x < 3200) { const a = ARCH[(i * 7 + Math.floor(r() * 3)) % ARCH.length]; out.push({ x, a, dir: r() < .55 ? -1 : 1, h: 128 + r() * 26, seed: i * 13 + 5 }); x += 70 + r() * 46; i++; } return out; })();
// o: { u(x) → reveal 0..1 for a figure at layer x, a, look (0..1: they lift their heads), clip }
export function drawFrieze(ctx, t, C, o = {}) {
  const L = LC(C, 4.5), [x0, x1] = xRange(L, 200);
  for (const f of FRIEZE) {
    if (f.x < x0 || f.x > x1) continue;
    const u = o.u ? o.u(f.x) : 1; if (u <= 0) continue;
    const [X, Y] = toS(L, f.x, ridgeTop(1, f.x) + 2), sc = L.z * f.h / 100;
    let P = { ...POSE.stand, ...f.a.P };
    if (o.look) P = mixPose(P, { ...P, head: -.55, lean: (P.lean || 0) - .05 }, o.look);
    ghost(ctx, X, Y, sc, P, { t, seed: f.seed, dir: f.dir, props: f.a.props, a: (o.a ?? .8), fill: .05, reveal: { u, mode: 'rise' } });
    if (f.a.child) { const kx = X + f.dir * sc * 9, ky = Y - sc * 30; ghost(ctx, kx, ky, sc, { kid: 1, seat: true, hip: [1.3, 1.2], kn: [1.5, 1.4], sh: [.6, .3], el: [.8, .6], lean: -.05, head: -.1 }, { t, seed: f.seed + 1, dir: f.dir, a: (o.a ?? .8), fill: .05, reveal: { u, mode: 'rise' } }); }
  }
}
