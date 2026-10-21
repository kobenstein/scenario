// Film 6 · c09 · the world of §4b + §5: the mother in backlight and her wireframe copy, the night street, the brass scale, the policy card,
// the lab desks and the page the camera flies into. Pure functions of t; every static layer cached with once()/layer().
// Copied (and marked) from the kit: the candle's flame (f6_kit ember 'candle' → flameSmall, a flame on its own without the candle body),
// the page-into-plate pattern (f6_c06_world page()).
import { W, H, rgba, clamp, lin, mix, sm, eout, prng, drift, canvas, hatch, text, rough, poly } from '../engine.mjs';
import { F6, once, layer, ember, breathe, coolLine, riseFromDark } from './f6_kit.mjs';
import { stipple, vnoise, cone, pool } from './art.mjs';
import { figure, POSES, cradleProp, walk, reachArm } from './figure.mjs';
import { hand } from './hand.mjs';
import { paperSheet, scribble, pen } from './paper.mjs';
import { resample, unwind } from './certificate.mjs';

const TAU = Math.PI * 2;
export const QUART = (x) => (x = clamp(x), x < .5 ? 8 * x * x * x * x : 1 - 8 * Math.pow(1 - x, 4));
export const EXPO_OUT = (x) => (x = clamp(x), x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
export const EXPO_IN = (x) => (x = clamp(x), x <= 0 ? 0 : Math.pow(2, 10 * (x - 1)));

// ---------------------------------------------------------------- the mother (figure scale, cradling a sleeping child), backlit
export const MOTHER = { x: 640, y: 640, s: 2.0, seed: 4 };
export const MDRESS = { coat: '#5a4a72', pants: '#2a2240', shoes: '#15121f', skin: '#d9b08e', hair: '#1c1420' };
export const GLOW = { x: 830, y: 500, r: 520 };            // the backlight behind her (the light plate we came out of)
export function mother(ctx, t, o = {}) {
  const { x, y, s, seed } = MOTHER, a = o.a ?? 1;
  return figure(ctx, x, y, s, { ...POSES.cradle, hair: 'bun' }, {
    t, seed, flip: true, dress: MDRESS, prop: cradleProp({ t, blanket: '#efe4cc', skin: '#e2b894' }),
    light: { x: GLOW.x, y: GLOW.y, col: F6.amberCore, a: .55 * a }, rim: rgba('#ffd9a0', .95 * a), rimSide: 1, rimW: 3, shadow: true,
    cast: { x: GLOW.x, y: GLOW.y - 60, a: .35 * a, len: 1.6 },
  });
}
// the same figure drawn flat in four colours (clothes / skin / hair / blanket) for the wireframe extraction: no light, no life
function motherFlat(g, ox, oy) {
  figure(g, ox, oy, MOTHER.s, { ...POSES.cradle, hair: 'bun', eye: 0 }, {
    flip: true, dress: { coat: '#ff0000', pants: '#ff0000', shoes: '#ff0000', skin: '#00ff00', hair: '#0000ff' },
    prop: cradleProp({ blanket: '#ffff00', skin: '#00ff00', hair: '#0000ff' }), shadow: false, hatch: false,
  });
}

// ---------------------------------------------------------------- contours: marching squares over a binary mask → polylines
// mask(i, j) → 0|1 on a grid nx × ny (cell = px per grid step); returns polylines in pixel coordinates (closed loops chained)
function marching(mask, nx, ny, cell) {
  const segs = new Map(), key = (i, j, h) => (h ? 'h' : 'v') + i + ',' + j;   // edge ids: h = the edge between (i,j)-(i+1,j), v = (i,j)-(i,j+1)
  const pos = { h: (i, j) => [(i + .5) * cell, j * cell], v: (i, j) => [i * cell, (j + .5) * cell] };
  const add = (a, b) => { if (!segs.has(a)) segs.set(a, []); if (!segs.has(b)) segs.set(b, []); segs.get(a).push(b); segs.get(b).push(a); };
  for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
    const c = (mask(i, j) ? 8 : 0) | (mask(i + 1, j) ? 4 : 0) | (mask(i + 1, j + 1) ? 2 : 0) | (mask(i, j + 1) ? 1 : 0);
    if (c === 0 || c === 15) continue;
    const T = key(i, j, 1), B = key(i, j + 1, 1), L = key(i, j, 0), R = key(i + 1, j, 0);
    switch (c) {
      case 1: case 14: add(L, B); break; case 2: case 13: add(B, R); break; case 3: case 12: add(L, R); break;
      case 4: case 11: add(T, R); break; case 6: case 9: add(T, B); break; case 7: case 8: add(L, T); break;
      case 5: add(L, T); add(B, R); break; case 10: add(T, R); add(L, B); break;
    }
  }
  const P = (id) => { const h = id[0] === 'h', [i, j] = id.slice(1).split(',').map(Number); return pos[h ? 'h' : 'v'](i, j); };
  const seen = new Set(), out = [];
  for (const start of segs.keys()) {
    if (seen.has(start)) continue;
    const line = [P(start)]; seen.add(start); let cur = start, prev = null;
    for (; ;) { const nb = segs.get(cur).find((n) => n !== prev && !seen.has(n)); if (!nb) break; line.push(P(nb)); seen.add(nb); prev = cur; cur = nb; }
    // try to close the loop
    if (segs.get(cur).includes(start) && line.length > 2) line.push(P(start));
    if (line.length > 6) out.push(line);
  }
  return out;
}
const chaikin = (pts, n = 2) => { let p = pts; for (let k = 0; k < n; k++) { const q = []; for (let i = 0; i < p.length - 1; i++) { const a = p[i], b = p[i + 1]; q.push([mix(a[0], b[0], .25), mix(a[1], b[1], .25)], [mix(a[0], b[0], .75), mix(a[1], b[1], .75)]); } q.push(p[p.length - 1]); p = q; } return p; };
const plen = (p) => { let L = 0; for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return L; };
// the wireframe of the mother: polylines in figure-local coordinates (origin = hip), cached once
export function motherWire() {
  return once('c09:wire', () => {
    const BW = 640, BH = 640, OX = 320, OY = 280, [c, g] = canvas(BW, BH);
    motherFlat(g, OX, OY);
    const src = g.getImageData(0, 0, BW, BH).data;
    const cls = (k) => { const a = src[k + 3], r = src[k], gg = src[k + 1], b = src[k + 2]; if (a < 120) return 0; if (r > 150 && gg > 150) return 4; if (r >= gg && r >= b) return 1; if (gg >= b) return 2; return 3; };
    // one canvas per class, closed with a small blur (the hatching and the face lines are 1 px slits)
    const masks = {}; for (const id of [1, 2, 3, 4]) { const [mc, mg] = canvas(BW, BH); const im = mg.createImageData(BW, BH); for (let k = 0; k < BW * BH; k++) { const v = cls(k * 4) === id ? 255 : 0; im.data[k * 4] = v; im.data[k * 4 + 1] = v; im.data[k * 4 + 2] = v; im.data[k * 4 + 3] = 255; } mg.putImageData(im, 0, 0); masks[id] = mc; }
    const [ac, ag] = canvas(BW, BH); const im = ag.createImageData(BW, BH); for (let k = 0; k < BW * BH; k++) { const v = src[k * 4 + 3] > 120 ? 255 : 0; im.data[k * 4] = v; im.data[k * 4 + 1] = v; im.data[k * 4 + 2] = v; im.data[k * 4 + 3] = 255; } ag.putImageData(im, 0, 0);
    const blurred = (src2, px) => { const [bc, bg] = canvas(BW, BH); bg.fillStyle = '#000'; bg.fillRect(0, 0, BW, BH); bg.filter = `blur(${px}px)`; bg.drawImage(src2, 0, 0); bg.filter = 'none'; return bg.getImageData(0, 0, BW, BH).data; };
    const cell = 2, nx = Math.floor(BW / cell), ny = Math.floor(BH / cell);
    const lines = [];
    const extract = (data, th, minLen, tag) => { const m = (i, j) => data[((j * cell) * BW + i * cell) * 4] > th * 255 ? 1 : 0; for (const p of marching(m, nx, ny, cell)) { const q = chaikin(p, 2).map(([x, y]) => [x - OX, y - OY]); if (plen(q) >= minLen) lines.push({ pts: q, tag }); } };
    extract(blurred(ac, 1.2), .5, 120, 'sil');          // the silhouette
    extract(blurred(masks[2], 1.4), .5, 40, 'skin');     // head, hands, the child's face
    extract(blurred(masks[3], 1.2), .5, 40, 'hair');
    extract(blurred(masks[4], 1.4), .5, 60, 'blanket');
    extract(blurred(masks[1], 9), .62, 120, 'inner');    // one inner isoline of the clothes (volume)
    lines.sort((a, b) => plen(b.pts) - plen(a.pts));
    return lines;
  });
}
// draw the wireframe: each line written by the cool line, staggered; u = overall progress (0..1), a = light
export function wireframe(ctx, t, lines, x, y, u, o = {}) {
  const n = lines.length, a = o.a ?? 1, st = o.stagger ?? .55;
  for (let i = 0; i < n; i++) {
    const L = lines[i], ui = clamp((u * (1 + st) - (i / n) * st) / 1);
    if (ui <= 0) continue;
    const pts = L.pts.map(([px, py]) => [x + px, y + py]);
    coolLine(ctx, t, { pts, u: ui, w: o.w ?? 1.3, a: a * (L.tag === 'inner' ? .55 : 1), glow: o.glow ?? 1, ticks: L.tag === 'sil', head: ui < 1 });
  }
}

// ---------------------------------------------------------------- the scale: geometry (polylines, local, origin = the beam's pivot) + the brass object
export const SCALE = { arm: 250, drop: 150, col: 300, panR: 100 };
const ellipsePts = (cx, cy, rx, ry, n = 48, a0 = 0, a1 = TAU) => { const o = []; for (let i = 0; i <= n; i++) { const q = a0 + (a1 - a0) * i / n; o.push([cx + Math.cos(q) * rx, cy + Math.sin(q) * ry]); } return o; };
export function scaleGeom(ang = 0, t = 0, sway = 0) {
  const { arm, drop, col, panR } = SCALE, c = Math.cos(ang), s = Math.sin(ang);
  const R = (px, py) => [px * c - py * s, px * s + py * c];
  const swL = sway * (2.2 * Math.sin(t * 1.9) + .8 * Math.sin(t * 3.1)), swR = sway * (2.2 * Math.sin(t * 1.7 + 1.3) + .8 * Math.sin(t * 2.9 + .5));
  const hl = R(-arm, 0), hr = R(arm, 0), pl = [hl[0] + swL, hl[1] + drop], pr = [hr[0] + swR, hr[1] + drop];
  const beam = [R(-arm, -7), R(arm, -7), R(arm, 7), R(-arm, 7), R(-arm, -7)];
  const pointer = [R(0, -8), R(-7, -44), R(0, -64), R(7, -44), R(0, -8)];
  const column = [[-8, 12], [8, 12], [8, col - 10], [-8, col - 10], [-8, 12]];
  const base = ellipsePts(0, col, 96, 20);
  const cap = [[0, -26], [16, 0], [0, 16], [-16, 0], [0, -26]];
  const chain = (h, p) => [[[h[0], h[1]], [p[0] - panR * .78, p[1] - 6]], [[h[0], h[1]], [p[0] + panR * .78, p[1] - 6]]];
  const pan = (p) => ellipsePts(p[0], p[1], panR, 22);
  const dish = (p) => ellipsePts(p[0], p[1] + 2, panR, 30, 32, .08, Math.PI - .08);
  return { hl, hr, pl, pr, beam, pointer, column, base, cap, chainL: chain(hl, pl), chainR: chain(hr, pr), panL: pan(pl), panR: pan(pr), dishL: dish(pl), dishR: dish(pr) };
}
export function scaleLines(ang = 0) {
  const G = scaleGeom(ang);
  return [G.beam, G.column, G.base, G.panL, G.panR, G.dishL, G.dishR, ...G.chainL, ...G.chainR, G.pointer, G.cap];
}
// the morph: the wireframe's lines unwind into the scale's lines (both in local coords), u 0..1; returns polylines
export function morphLines(wire, target, u) {
  const N = wire.length, M = target.length, K = Math.max(N, M), out = [];
  for (let i = 0; i < K; i++) {
    const A = wire[i % N].pts, B = target[(i * 7) % M];
    const ui = clamp((u * 1.35 - (i / K) * .35));
    out.push(unwind(A, B, ui, { n: 120, sweep: .5 }));
  }
  return out;
}
// the brass scale as a solid artefact: x, y = pivot on screen, ang = beam tilt (+ = right pan down), light {x, y, a} = a warm light nearby
export function scaleSolid(ctx, t, o = {}) {
  const x = o.x, y = o.y, ang = o.ang ?? 0, G = scaleGeom(ang, t, o.sway ?? 1), br0 = '#b8894a', hi = '#e9cd8a', dk = '#3e2c14', lk = o.light;
  ctx.save(); ctx.translate(x, y);
  const P = (pts) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); };
  // shadow on the desk under the base
  ctx.fillStyle = 'rgba(3,3,10,.45)'; ctx.beginPath(); ctx.ellipse(8, SCALE.col + 6, 110, 22, 0, 0, TAU); ctx.fill();
  // base: a heavy ring
  const bg = ctx.createLinearGradient(-96, 0, 96, 0); bg.addColorStop(0, dk); bg.addColorStop(.42, hi); bg.addColorStop(.6, br0); bg.addColorStop(1, dk);
  ctx.fillStyle = bg; ctx.beginPath(); ctx.ellipse(0, SCALE.col, 96, 20, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#5a4324'; ctx.beginPath(); ctx.ellipse(0, SCALE.col - 8, 70, 12, 0, 0, TAU); ctx.fill();
  // column
  const cg = ctx.createLinearGradient(-8, 0, 8, 0); cg.addColorStop(0, dk); cg.addColorStop(.35, hi); cg.addColorStop(.7, br0); cg.addColorStop(1, dk);
  ctx.fillStyle = cg; ctx.beginPath(); ctx.roundRect(-8, 10, 16, SCALE.col - 18, 3); ctx.fill();
  // pivot cap
  ctx.fillStyle = br0; P(G.cap); ctx.fill(); ctx.fillStyle = hi; ctx.beginPath(); ctx.arc(0, 0, 6, 0, TAU); ctx.fill();
  // pans with chains (the pans hang vertical whatever the beam does)
  for (const [h, p, ch] of [[G.hl, G.pl, G.chainL], [G.hr, G.pr, G.chainR]]) {
    ctx.strokeStyle = '#8a6a3a'; ctx.lineWidth = 1.6; for (const c of ch) { P(c); ctx.stroke(); }
    ctx.strokeStyle = rgba(hi, .5); ctx.lineWidth = .7; for (const c of ch) { P(c); ctx.stroke(); }
    ctx.fillStyle = '#6a5028'; ctx.beginPath(); ctx.arc(h[0], h[1], 5, 0, TAU); ctx.fill();
    // the dish: a shallow bowl, lit rim
    ctx.fillStyle = 'rgba(3,3,10,.35)'; ctx.beginPath(); ctx.ellipse(p[0] + 6, p[1] + 36, SCALE.panR * .9, 10, 0, 0, TAU); ctx.fill();
    const dg = ctx.createLinearGradient(p[0] - SCALE.panR, 0, p[0] + SCALE.panR, 0); dg.addColorStop(0, dk); dg.addColorStop(.4, br0); dg.addColorStop(.55, hi); dg.addColorStop(1, dk);
    ctx.fillStyle = dg; ctx.beginPath(); ctx.ellipse(p[0], p[1] + 3, SCALE.panR, 30, 0, 0, Math.PI); ctx.fill();
    const tg = ctx.createLinearGradient(0, p[1] - 22, 0, p[1] + 22); tg.addColorStop(0, '#7a5a2a'); tg.addColorStop(1, '#2e2010');
    ctx.fillStyle = tg; ctx.beginPath(); ctx.ellipse(p[0], p[1], SCALE.panR, 22, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba(hi, .75); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.ellipse(p[0], p[1], SCALE.panR, 22, 0, 0, TAU); ctx.stroke();
  }
  // the beam, tapered, with its pointer
  ctx.save(); ctx.rotate(ang);
  const bgr = ctx.createLinearGradient(0, -8, 0, 8); bgr.addColorStop(0, hi); bgr.addColorStop(.5, br0); bgr.addColorStop(1, dk);
  ctx.fillStyle = bgr; ctx.beginPath(); ctx.moveTo(-SCALE.arm, -4); ctx.lineTo(-30, -8); ctx.lineTo(30, -8); ctx.lineTo(SCALE.arm, -4); ctx.lineTo(SCALE.arm, 4); ctx.lineTo(30, 8); ctx.lineTo(-30, 8); ctx.lineTo(-SCALE.arm, 4); ctx.closePath(); ctx.fill();
  ctx.fillStyle = br0; ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(-6, -44); ctx.lineTo(0, -64); ctx.lineTo(6, -44); ctx.closePath(); ctx.fill();
  ctx.restore();
  // engraving: hatching on the shadow side of the column and the base
  hatch(ctx, (g) => { g.rect(-8, 10, 7, SCALE.col - 18); }, -1.1, 5, .35, { col: '#1a1008', w: .8 });
  // the warm light of the small flame on the brass (a soft gradient toward it)
  if (lk && lk.a > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const wg = ctx.createRadialGradient(lk.x - x, lk.y - y, 0, lk.x - x, lk.y - y, 260); wg.addColorStop(0, rgba(F6.amber, .22 * lk.a)); wg.addColorStop(1, rgba(F6.amber, 0)); ctx.fillStyle = wg; ctx.beginPath(); ctx.roundRect(-8, 10, 16, SCALE.col - 18, 3); P(G.beam); ctx.fill(); ctx.restore(); }
  ctx.restore();
  return { pl: [x + G.pl[0], y + G.pl[1]], pr: [x + G.pr[0], y + G.pr[1]], hl: [x + G.hl[0], y + G.hl[1]], hr: [x + G.hr[0], y + G.hr[1]] };
}
// a small flame on its own (copied from f6_kit ember 'candle': the flame part, on a small brass dish); x, y = the wick, h = size 0..1
export function flameSmall(ctx, t, x, y, h, o = {}) {
  const n = once('c09:fnoise', () => vnoise(23)), br = breathe(t, 60, .3), sway = n(t * 1.7, 3) - .5, fl = .06 * (n(t * 6.3, 9) - .5) * 2;
  // the dish and the wick are always there
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#6a5028'; ctx.beginPath(); ctx.ellipse(0, 4, 16, 5, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#c9a45a'; ctx.beginPath(); ctx.ellipse(0, 2, 12, 3.5, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#2a2018'; ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 2); ctx.lineTo(sway * 1.5, -8); ctx.stroke();
  if (h > 0) {
    const fh = 40 * h * br * (1 + fl), fx = sway * 4 * h, col = o.col || '#ff9a3c', core = F6.amberCore;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const fg = ctx.createRadialGradient(fx * .5, -12, 0, fx * .5, -12, fh); fg.addColorStop(0, rgba(core, .95)); fg.addColorStop(.35, rgba(col, .8)); fg.addColorStop(1, rgba(F6.amberDeep, 0));
    ctx.fillStyle = fg; ctx.beginPath(); ctx.moveTo(0, -4); ctx.bezierCurveTo(-11 * h, -12, -10 * h, -28, fx, -4 - fh); ctx.bezierCurveTo(10 * h, -28, 11 * h, -12, 0, -4); ctx.fill();
    ctx.fillStyle = rgba('#ffffff', .85 * h); ctx.beginPath(); ctx.ellipse(fx * .3, -14, 3 * h, 8 * h * br, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }
  ctx.restore();
  if (h > 0) ember(ctx, t, { x: x + sway * 2, y: y - 18, kind: 'glow', r: 190 * h, a: .8 * h, phase: .3 });
}

// a light pool cached once per key (art.pool paints a full-frame layer on every call)
export function cachedPool(ctx, key, x, y, rx, ry, o = {}) {
  const c = once('c09:pool:' + key, () => { const [cc, g] = canvas(W, H); pool(g, x, y, rx, ry, { ...o, a: 1 }); return cc; });
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = o.a ?? .5; ctx.drawImage(c, 0, 0); ctx.restore();
}
// ---------------------------------------------------------------- the night street (phase C): wall, pavement, kerb, a street lamp, a low ledge
export const STREET = { x0: 900, x1: 3000, wallTop: 300, paveY: 760, kerbY: 862, lamp: { x: 2250, top: 330, base: 860 }, ledge: { x: 2020, w: 300, y: 790, h: 36 } };
export function streetBack(ctx, t) {
  const S = STREET, L = layer('c09:street', S.x1 - S.x0, H, (g) => {
    g.translate(-S.x0, 0);
    // the wall: slate with faint rendered stones and a few dark panes
    const wg = g.createLinearGradient(0, S.wallTop, 0, S.paveY); wg.addColorStop(0, '#0d1230'); wg.addColorStop(1, '#1a2040'); g.fillStyle = wg; g.fillRect(S.x0, S.wallTop - 100, S.x1 - S.x0, S.paveY - S.wallTop + 100);
    const r = prng(91); g.strokeStyle = 'rgba(120,130,170,.07)'; g.lineWidth = 1;
    for (let yy = S.wallTop + 20; yy < S.paveY; yy += 46) { g.beginPath(); g.moveTo(S.x0, yy + r() * 3); g.lineTo(S.x1, yy + r() * 3); g.stroke(); for (let xx = S.x0 + ((yy / 46) % 2) * 60; xx < S.x1; xx += 120) { g.beginPath(); g.moveTo(xx + r() * 4, yy); g.lineTo(xx + r() * 4, yy + 46); g.stroke(); } }
    for (const [px, pw, ph] of [[1150, 160, 220], [1620, 140, 200], [2620, 180, 230]]) { g.fillStyle = '#070a1c'; g.fillRect(px, S.wallTop + 90, pw, ph); g.strokeStyle = 'rgba(160,180,220,.12)'; g.strokeRect(px, S.wallTop + 90, pw, ph); }
    // the pavement, the kerb face, the road
    const pg = g.createLinearGradient(0, S.paveY, 0, S.kerbY); pg.addColorStop(0, '#232a46'); pg.addColorStop(1, '#1b2038'); g.fillStyle = pg; g.fillRect(S.x0, S.paveY, S.x1 - S.x0, S.kerbY - S.paveY);
    g.fillStyle = '#2b3150'; g.fillRect(S.x0, S.kerbY - 6, S.x1 - S.x0, 8); g.fillStyle = '#0a0d20'; g.fillRect(S.x0, S.kerbY + 2, S.x1 - S.x0, 12);
    const rg = g.createLinearGradient(0, S.kerbY + 14, 0, H); rg.addColorStop(0, '#0c0f24'); rg.addColorStop(1, '#070916'); g.fillStyle = rg; g.fillRect(S.x0, S.kerbY + 14, S.x1 - S.x0, H - S.kerbY);
    g.strokeStyle = 'rgba(140,150,190,.08)'; for (let xx = S.x0; xx < S.x1; xx += 90) { g.beginPath(); g.moveTo(xx, S.paveY); g.lineTo(xx - 10, S.kerbY); g.stroke(); }
    // the low stone ledge at the wall (where someone sits)
    const E = S.ledge; g.fillStyle = '#2e3352'; g.fillRect(E.x - E.w / 2, E.y, E.w, E.h); g.fillStyle = '#3a4066'; g.fillRect(E.x - E.w / 2, E.y, E.w, 6); g.fillStyle = 'rgba(3,3,10,.4)'; g.fillRect(E.x - E.w / 2, E.y + E.h, E.w, 10);
    // the lamp post
    const P = S.lamp; g.strokeStyle = '#1b2033'; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(P.x, P.base); g.lineTo(P.x, P.top + 30); g.stroke();
    g.strokeStyle = '#2a3048'; g.lineWidth = 4; g.beginPath(); g.moveTo(P.x - 4, P.base); g.lineTo(P.x - 4, P.top + 40); g.stroke();
    g.fillStyle = '#1b2033'; g.beginPath(); g.ellipse(P.x, P.base, 26, 8, 0, 0, TAU); g.fill();
    g.fillStyle = '#151a2c'; g.beginPath(); g.moveTo(P.x - 34, P.top + 30); g.lineTo(P.x + 34, P.top + 30); g.lineTo(P.x + 22, P.top - 10); g.lineTo(P.x - 22, P.top - 10); g.closePath(); g.fill();
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(g.canvas, { k: .3, g: 1.1, seed: 19 });   // putImageData honours the transform: reset first
  });
  ctx.drawImage(L, S.x0, 0);
}
// the lamp's light: the lantern ember, the cone onto the pavement, the pool (cached cone, drawn under the world transform)
export function streetLight(ctx, t, a = 1) {
  const P = STREET.lamp, C = once('c09:cone', () => { const [c, g] = canvas(W, H); return cone(g, W / 2, 40, { dir: 0, spread: .5, len: 560, col: F6.amber, a: .5, k: .6, seed: 5 }); });
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a * (.85 + .15 * (breathe(t, 60, .1) - .97) / .06); ctx.drawImage(C, P.x - W / 2, P.top + 10); ctx.restore();
  cachedPool(ctx, 'lamp', P.x, STREET.kerbY - 20, 330, 36, { col: F6.amber, a: .35 * a, seed: 6 });
  ember(ctx, t, { x: P.x, y: P.top + 18, kind: 'glow', r: 210, a: .9 * a, phase: .1 });
  ctx.save(); ctx.fillStyle = rgba(F6.amberCore, .9 * a); ctx.beginPath(); ctx.ellipse(P.x, P.top + 20, 14, 9, 0, 0, TAU); ctx.fill(); ctx.restore();
}
// the sitter on the ledge (head down, arms on the knees), with a faint ember in the chest
export function sitter(ctx, t, o = {}) {
  const E = STREET.ledge, s = 1.9, x = E.x + 30, y = E.y - 2;
  const pose = { ...POSES.perch, head: .42, sh: [.55, .48], el: [1.05, 1.1], hair: 'short', gaze: .8 };
  const L = STREET.lamp;
  figure(ctx, x, y, s, pose, { t, seed: 11, flip: true, dress: { coat: '#3a3448', pants: '#1a1826', skin: '#b98762' }, light: { x: L.x, y: L.top, col: F6.amberCore, a: .5 }, rim: rgba(F6.amber, .6), rimSide: 1, shadow: false });
  const cx = x - 6 * s, cy = y - 44 * s; ember(ctx, t, { x: cx, y: cy, kind: 'heart', r: 48, a: .45 * (o.a ?? 1), phase: .6 });
}
// the passers-by: each walks right → left along the pavement, carries a small ember in the chest, and turns the head away as it passes the sitter
export const WALKERS = [
  { x0: 2605, v: 150, t0: 0, s: 1.95, seed: 21, dress: { coat: '#2c3450', pants: '#15142a', skin: '#8d5f40' }, near: true },        // passes the sitter 3.7 s after the street rises
  { x0: 2630, v: 138, t0: 1.1, s: 1.9, seed: 22, dress: { coat: '#4a3a3a', pants: '#1a1420', skin: '#d9b08e', hair: '#3a2a20' }, near: true, hair: 'long' },   // 5.3 s
  { x0: 2274, v: 112, t0: 2.6, s: 1.5, seed: 23, dress: { coat: '#2a2f44', pants: '#12122a', skin: '#e9c3a0' }, near: false },      // 4.6 s
  { x0: 2400, v: 125, t0: 3.3, s: 1.55, seed: 24, dress: { coat: '#36304a', pants: '#14132a', skin: '#b98762', hair: '#2a1c18' }, near: false, hair: 'bob' },   // 6.1 s
];
export function walkers(ctx, t, tStart, near, o = {}) {
  const L = STREET.lamp, sit = STREET.ledge.x;
  for (const Wk of WALKERS) {
    if (Wk.near !== near) continue;
    const tt = t - tStart - Wk.t0;
    const x = Wk.x0 - Wk.v * tt, y = near ? STREET.kerbY - 20 - 90 * Wk.s : STREET.paveY + 8 - 90 * Wk.s + 60;
    if (x < STREET.x0 - 200) continue;
    const ph = TAU * tt * (Wk.v / 150) * 1.05 + Wk.seed, wk = walk(ph);
    // the head: level while walking, turns away from the sitter as the walker passes (cause: the sitter in view → the head turns 60 ms later)
    const d = (x - sit) / Wk.v, away = sm(lin(1.3, .7, d)) * (1 - sm(lin(-1.6, -2.4, d)));
    const pose = { ...wk, lean: wk.lean + .03, head: -.06 - .1 * away, turn: -.9 * away, hair: Wk.hair || 'short' };
    const lit = clamp(1 - Math.abs(x - L.x) / 700);
    figure(ctx, x, y, Wk.s, pose, { t, seed: Wk.seed, flip: true, dress: Wk.dress, light: { x: L.x, y: L.top, col: F6.amberCore, a: .25 + .45 * lit }, rim: rgba(F6.amber, .3 + .5 * lit), rimSide: 1, shadow: true, shadeA: near ? 0 : .35 });
    const cx = x - 2 * Wk.s, cy = y - 46 * Wk.s; ember(ctx, t, { x: cx, y: cy, kind: 'heart', r: 42 * Wk.s / 1.9, a: (near ? .5 : .3) * (o.a ?? 1), phase: Wk.seed * .17 });
  }
}

// ---------------------------------------------------------------- the lab: the near desk (the scale stands on it), far desk rows with seated writers and lamps
// seen from slightly above: desk tops are trapezoids (wider toward us), the sheets on them are foreshortened, the writers sit behind them
export const DESK = { yFar: 790, yNear: 960, x0: -400, x1: 2800 };
export const PAGE = { x: 1010, y: 862, w: 420, h: 260, rot: -.06, fs: .6 };    // fs = foreshortening of a sheet lying on the desk; top edge at the desk's far edge
export const WRITER = { x: 905, y: 852, s: 2.1, seed: 31 };   // seated behind the far edge: the hand reaches the short lines in front of the shoulder
export const NEARLAMP = { x: 520, y: 800 };
export function deskTop(ctx, t, o = {}) {
  const D = DESK, L = layer('c09:desk', D.x1 - D.x0, D.yNear - D.yFar + 70, (g) => {
    g.translate(-D.x0, -D.yFar);
    const wg = g.createLinearGradient(0, D.yFar, 0, D.yNear); wg.addColorStop(0, '#30221a'); wg.addColorStop(1, '#1a120c'); g.fillStyle = wg; g.fillRect(D.x0, D.yFar, D.x1 - D.x0, D.yNear - D.yFar);
    const r = prng(44); g.strokeStyle = 'rgba(255,220,170,.055)'; g.lineWidth = 1; for (let i = 0; i < 70; i++) { const yy = D.yFar + r() * (D.yNear - D.yFar); g.beginPath(); g.moveTo(D.x0, yy); g.bezierCurveTo(D.x0 + 900, yy + (r() - .5) * 10, D.x1 - 900, yy + (r() - .5) * 10, D.x1, yy); g.stroke(); }
    g.fillStyle = '#4a3828'; g.fillRect(D.x0, D.yFar - 3, D.x1 - D.x0, 4);
    const fg = g.createLinearGradient(0, D.yNear, 0, D.yNear + 70); fg.addColorStop(0, '#120c08'); fg.addColorStop(1, '#07050a'); g.fillStyle = fg; g.fillRect(D.x0, D.yNear, D.x1 - D.x0, 70);
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(g.canvas, { k: .35, g: 1.1, seed: 45 });
  });
  ctx.drawImage(L, D.x0, D.yFar);
}
// a seated writer behind a desk edge at y (the desk hides hips and legs): x = where the hip is, facing +x unless flip
function seatedWriter(ctx, t, x, y, s, o) {
  const pose = { hip: [1.35, 1.45], kn: [1.4, 1.5], lean: .2, head: .3, sh: [1.05, .55], el: [.75, 1.0], gaze: .9, hair: o.hair || 'short', lock: [true, false] };
  return figure(ctx, x, y, s, pose, { t, seed: o.seed, flip: !!o.flip, dress: o.dress, light: o.light, rim: o.rim, rimSide: o.flip ? 1 : -1, shadow: false, shadeA: o.dim });
}
// a far desk row: a trapezoid table top at y (far edge) with depth d, n seated writers behind it, each with a sheet and a small lamp
export function farDesks(ctx, t, o) {
  const { y, d, x0, x1, s, seeds, lampS, dim, inset } = o, n = seeds.length, gap = (x1 - x0) / n;
  const lamps = [];
  for (let i = 0; i < n; i++) {
    const flip = i % 2 === 1, x = x0 + gap * (i + .5), lx = x + (flip ? -1 : 1) * 95 * s / 1.9;
    lamps.push([lx, flip]);
    seatedWriter(ctx, t, x, y + 6 * s / 1.9, s, { seed: seeds[i], flip, hair: ['short', 'bun', 'short', 'bob'][i % 4], dim, dress: { coat: ['#2c3450', '#3a3448', '#43365a', '#2f3a46'][i % 4], skin: ['#d9b08e', '#8d5f40', '#e9c3a0', '#b98762'][seeds[i] % 4] }, light: { x: lx, y: y - 70 * s / 1.9, col: F6.amberCore, a: .6 }, rim: rgba(F6.amber, .55) });
  }
  // the table top (a trapezoid), its front face
  const tg = ctx.createLinearGradient(0, y, 0, y + d); tg.addColorStop(0, '#2c2016'); tg.addColorStop(1, '#19110b'); ctx.fillStyle = tg;
  ctx.beginPath(); ctx.moveTo(x0 + inset, y); ctx.lineTo(x1 - inset, y); ctx.lineTo(x1, y + d); ctx.lineTo(x0, y + d); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#4a3828'; ctx.fillRect(x0 + inset, y - 2, x1 - x0 - 2 * inset, 3);
  ctx.fillStyle = '#0d0906'; ctx.fillRect(x0, y + d, x1 - x0, d * .3);
  for (let i = 0; i < n; i++) {
    const [lx, flip] = lamps[i], x = x0 + gap * (i + .5), sw = 96 * s / 1.9, sh = 66 * s / 1.9, px = x + (flip ? 10 : -10), py = y + d * .5;
    ctx.save(); ctx.translate(px, py); ctx.scale(1, .5); ctx.rotate(-.05 + .04 * (i % 3));
    paperSheet(ctx, -sw / 2, -sh / 2, sw, sh, { seed: 60 + i, tone: '#efe4cc', shadow: false, light: [lx - px, -60], content: (g, w, h) => { scribble(g, 8, 14, w * .7, 5, { seed: 70 + i, ink: '#2a2420', lw: 1.2 }); scribble(g, 8, 26, w * .6, 5, { seed: 71 + i, ink: '#2a2420', lw: 1.2 }); scribble(g, 8, 38, w * .5, 5, { seed: 72 + i, ink: '#2a2420', lw: 1.2 }); } });
    ctx.restore();
    ember(ctx, t, { x: lx, y: y + d * .45, kind: 'lamp', s: lampS, dir: flip ? .55 : -.55, r: 150, phase: i * .23, cone: .7 });
  }
}
// the page on the near desk, foreshortened (a sheet lying flat); o.plate = the paper plate (screen space) drawn inside the sheet,
// shade 1 → 0 as the push nears (copied pattern: f6_c06_world page). The writing sits at the top of the sheet: the push aims below it.
export function page(ctx, t, o) {
  const { x, y, w, h, rot, fs } = PAGE, shade = o.shade ?? 1;
  const edge = once('c09:pageedge', () => rough([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], 1.3, 13, { step: 12 }));
  ctx.save(); ctx.translate(x, y); ctx.scale(1, fs); ctx.rotate(rot);
  ctx.save(); ctx.translate(8, 14); ctx.fillStyle = 'rgba(0,0,0,.5)'; poly(ctx, edge); ctx.fill(); ctx.restore();
  poly(ctx, edge); ctx.save(); ctx.clip();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); o.plate(ctx, t); ctx.restore();
  ctx.fillStyle = `rgba(28,18,10,${.42 * shade})`; ctx.fillRect(-w, -h, 2 * w, 2 * h);
  const ink = rgba('#2a2420', .8), u = o.write ?? 1;
  text(ctx, 'VALUES', -w / 2 + 40, -h / 2 + 34, { size: 16, font: 'Inter', weight: 700, color: rgba('#2a2420', .7), spacing: 4 });
  for (let i = 0; i < 3; i++) scribble(ctx, -w / 2 + 40, -h / 2 + LINES[i][1], LINES[i][0], 9, { seed: 81 + i, ink, lw: 1.7, u: clamp(u * 3 - i) });
  text(ctx, 'because', -w / 2 + 40, -h / 2 + 108, { size: 14, font: 'Inter', weight: 600, color: rgba('#8e2f2a', .75 * clamp(u * 3 - 2.4)), spacing: 2 });
  ctx.restore();
  ctx.strokeStyle = 'rgba(90,70,50,.4)'; ctx.lineWidth = 1.2; poly(ctx, edge); ctx.stroke();
  ctx.restore();
}
// a sheet-local point (before the foreshortening) → world
export const pagePoint = (px, py) => { const c = Math.cos(PAGE.rot), s = Math.sin(PAGE.rot), qx = px * c - py * s, qy = px * s + py * c; return [PAGE.x + qx, PAGE.y + qy * PAGE.fs]; };
// the three short lines of writing [width, y from the top]: short, so the seated writer's hand can follow the nib
const LINES = [[124, 62], [138, 84], [104, 104]];
// where the pen's nib is on the sheet while the writing runs (u 0..1): along the three scribble lines
export function penTip(u) {
  const { w, h } = PAGE, k = clamp(u * 3), line = Math.min(2, Math.floor(k)), q = k - line;
  return pagePoint(-w / 2 + 40 + LINES[line][0] * q, -h / 2 + LINES[line][1] - 2);
}
// the near writer: seated behind the near desk, the front arm reaching the pen on the page; returns the hand point
export function nearWriter(ctx, t, o = {}) {
  const Wr = WRITER, target = o.target, base = { hip: [1.35, 1.45], kn: [1.4, 1.5], lean: .22, head: .34, sh: [1.1, .6], el: [.7, 1.0], gaze: .95, hair: 'short', lock: [true, false] };
  const opts = { t, seed: Wr.seed, flip: false, dress: { coat: '#43365a', pants: '#1a1426', skin: '#d9b08e' }, light: { x: NEARLAMP.x, y: NEARLAMP.y - 120, col: F6.amberCore, a: .7 }, rim: rgba(F6.amber, .8), rimSide: -1, shadow: false };
  const pose = { ...base };
  if (target) { const r = reachArm(Wr.x, Wr.y, Wr.s, base, 0, false, opts, target); pose.sh = [r.sh, base.sh[1]]; pose.el = [r.el, base.el[1]]; }
  return figure(ctx, Wr.x, Wr.y, Wr.s, pose, opts);
}

// ---------------------------------------------------------------- the policy card (paper, landing from above), with its seal
export const CARD = { w: 560, h: 410 };
function fit(ctx, s, maxW, size, font, weight, spacing) { let sz = size; for (; sz > 9; sz -= .5) { ctx.font = `${weight} ${sz}px "${font}"`; try { ctx.letterSpacing = spacing + 'px'; } catch { } if (ctx.measureText(s).width <= maxW) break; } return sz; }
export function policyCard(ctx, t, o) {
  const { x, y, t0 } = o, { w, h } = CARD, u = EXPO_OUT(lin(t0, t0 + .7, t)); if (u <= 0) return;
  // lands from above: position leads, rotation follows, the shadow grows as it meets the desk; later it tips back and lies flat (lay 0..1)
  const dy = -820 * (1 - u), rot = -.14 + .1 * EXPO_OUT(lin(t0 + .08, t0 + .8, t)), lift = 40 * (1 - u), lay = o.lay ?? 0;
  const lines = o.lines;   // [{ t, kind, s }]
  ctx.save();
  if (lay > 0) { const by = y + h / 2 + dy; ctx.translate(x, by); ctx.scale(1, mix(1, .2, lay)); ctx.translate(-x, -by); }
  paperSheet(ctx, x - w / 2, y - h / 2 + dy, w, h, { rot: rot * (1 - lay), seed: 17, tone: '#f1e6cc', lift, light: [x + w * .4, y - h], content: (g, cw, ch) => {
    const ink = '#2a2420', dim = rgba(ink, .55), red = '#8e2f2a';
    let yy = 54;
    for (const L of lines) {
      const k = clamp((t - L.t) / .28); if (k <= 0) continue;
      g.save(); g.textBaseline = 'alphabetic'; g.textAlign = 'left';
      const sz = fit(g, L.s, cw - 80, L.size, L.font || 'Inter', L.weight || 600, L.sp ?? 3);
      const sc = 1 + .05 * (1 - eout(k)), al = .35 + .65 * k;
      g.translate(40, yy); g.scale(sc, sc);
      g.fillStyle = rgba('#ffffff', .45 * al); g.fillText(L.s, -.7, -.7); g.fillStyle = rgba(L.col || ink, (L.a ?? 1) * al); g.fillText(L.s, 0, 0);
      g.restore();
      yy += L.gap ?? sz * 1.5;
      if (L.rule) { g.strokeStyle = rgba(ink, .3); g.lineWidth = 1; g.beginPath(); g.moveTo(40, yy - 10); g.lineTo(cw - 40, yy - 10); g.stroke(); yy += 10; }
    }
    // the body: unreadable paragraphs
    scribble(g, 40, ch - 118, cw * .55, 5, { seed: 91, ink: rgba(ink, .5), lw: 1 }); scribble(g, 40, ch - 104, cw * .6, 5, { seed: 92, ink: rgba(ink, .5), lw: 1 }); scribble(g, 40, ch - 90, cw * .42, 5, { seed: 93, ink: rgba(ink, .5), lw: 1 });
    // the seal: a round ink stamp with a ring of ticks, pressed on when the last line lands
    const sk = EXPO_OUT(lin(o.sealT, o.sealT + .3, t));
    if (sk > 0) { g.save(); g.translate(cw - 92, ch - 78); g.scale(1 + .25 * (1 - sk), 1 + .25 * (1 - sk)); g.globalAlpha = .55 + .45 * sk; g.strokeStyle = red; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 40, 0, TAU); g.stroke(); g.lineWidth = 1.2; g.beginPath(); g.arc(0, 0, 32, 0, TAU); g.stroke();
      g.beginPath(); for (let i = 0; i < 36; i++) { const q = i / 36 * TAU; g.moveTo(Math.cos(q) * 34, Math.sin(q) * 34); g.lineTo(Math.cos(q) * 38, Math.sin(q) * 38); } g.stroke();
      g.fillStyle = red; g.beginPath(); g.arc(0, 0, 9, 0, TAU); g.fill(); text(g, '2026', 0, 24, { size: 9, font: 'Inter', weight: 700, color: red, align: 'center', spacing: 2 }); g.restore(); }
  } });
  ctx.restore();
}

// ---------------------------------------------------------------- small helpers
// a source line in Inter caps at the bottom of the frame (baseline ≤ 860), written by a mask reveal, held, then wiped
export function sourceLine(ctx, t, s, t0, t1, o = {}) {
  const a = Math.min(lin(t0, t0 + .5, t), 1 - lin(t1, t1 + .3, t)); if (a <= 0) return;
  const y = o.y ?? 850, size = o.size ?? 19; ctx.save(); ctx.font = `600 ${size}px "Inter"`; try { ctx.letterSpacing = '4px'; } catch { }
  const w = ctx.measureText(s).width, x = o.align === 'right' ? W - 110 - w : o.x ?? 110;
  ctx.beginPath(); ctx.rect(x - 4, y - size - 8, (w + 12) * eout(a), size + 16); ctx.clip();
  ctx.fillStyle = rgba('#000000', .25); ctx.fillText(s, x + 1, y + 1); ctx.fillStyle = rgba(o.col || '#dfe7f2', .85); ctx.fillText(s, x, y); ctx.restore();
}
// a label under a pan: Inter caps, mask-revealed
export function panLabel(ctx, t, s, x, y, t0, o = {}) {
  const a = lin(t0, t0 + .4, t); if (a <= 0) return;
  ctx.save(); ctx.font = `600 ${o.size ?? 22}px "Inter"`; try { ctx.letterSpacing = '5px'; } catch { } ctx.textAlign = 'center';
  const w = ctx.measureText(s).width; ctx.beginPath(); ctx.rect(x - w / 2 - 6, y - 30, (w + 12) * eout(a), 44); ctx.clip();
  ctx.fillStyle = rgba(o.col || '#dfe7f2', .9); ctx.fillText(s, x, y); ctx.restore();
}
// dust motes in a warm light (life in every hold)
export function motes(ctx, t, cx, cy, seed = 5, n = 24, R = 420, A = 1) {
  if (A <= 0) return;
  const r = prng(seed); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) { const a0 = r() * TAU, rr = (r() * .9 + .1) * R, sp = .4 + r() * .8, ph = r() * TAU; const x = cx + Math.cos(a0) * rr + drift(t * sp, 24, ph), y = cy + Math.sin(a0) * rr * .7 + drift(t * sp * .7, 18, ph + 2), k = .35 + .65 * (.5 + .5 * Math.sin(t * sp * 1.3 + ph)); ctx.fillStyle = rgba('#ffe2b8', .2 * k * A); ctx.beginPath(); ctx.arc(x, y, 1.3 + .8 * k, 0, TAU); ctx.fill(); }
  ctx.restore();
}
