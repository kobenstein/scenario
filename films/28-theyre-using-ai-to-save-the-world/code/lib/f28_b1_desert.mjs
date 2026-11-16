// Film 28 · B1 · THE NAZCA DESERT FROM ABOVE (No. 9, and the pipe of No. 8). Shared by c04 (the eagle's frame drops onto it),
// c05 (the figures, the aerial tiles, the leads, the arrow) and c06 (the camera rises from it into orbit).
// Map design px on the card F0 (top-down: the ground is the card). Things above the ground (the bead, haze) sit on nearer cards.
//   st: { figs 0..1 (the known giant figures draw on in gold), figA 0..1 (their glow), grid 0..1, tiles(k) → 0..1 (frame k lit), markers
//         { u, on(k) }, walkers 0..1, newFigs 0..1, pipe 0..1, plume 0..1 (cool shimmer, the methane shadow), plumeCut 0..1, ring 0..1
//         (a ring of tiny lights round the hummingbird: the rituals), extra(ctx) on the map card, haze 0..1 }
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f28_kit.mjs';
import * as B from './f28_b1_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, halo, lin, rad, prng, sineIO, expoOut } = E;
const TAU = Math.PI * 2;

const SAND0 = mixHex(P.night1, P.shade0, .16), SAND1 = mixHex(P.ind0, P.shade0, .22), SAND2 = mixHex(P.night0, P.shade1, .1);
// ground patches and dry riverbeds, seeded once
const PATCH = (() => { const r = prng(909), a = []; for (let i = 0; i < 70; i++) a.push([-2200 + r() * 6400, -1600 + r() * 4300, 200 + r() * 700, r() * 6.3, r()]); return a; })();
const WADI = (() => { const r = prng(77), a = []; for (let k = 0; k < 4; k++) { let x = -2400, y = -800 + k * 900 + r() * 300; const pts = []; for (let i = 0; i < 22; i++) { pts.push([x, y]); x += 330; y += (r() - .5) * 260; } a.push(E.catmull(pts, 6)); } return a; })();
const LINES = (() => { const r = prng(3141), a = []; for (let k = 0; k < 16; k++) { const x = -1200 + r() * 4200, y = -900 + r() * 2900, ang = r() * Math.PI, L = 900 + r() * 2200; a.push([x - Math.cos(ang) * L / 2, y - Math.sin(ang) * L / 2, x + Math.cos(ang) * L / 2, y + Math.sin(ang) * L / 2, .5 + r() * .5]); } return a; })();
// old footpaths (pale, winding); the new small figures sit close to them
export const PATHS = [
  E.catmull([[-900, 1500], [-300, 1180], [200, 1060], [640, 980], [1100, 1010], [1600, 900], [2200, 760], [3000, 700]], 10),
  E.catmull([[-600, -400], [0, -150], [520, 40], [880, 260], [1260, 330], [1760, 520], [2400, 560]], 10),
];
// the known giant figures (local unit shapes → map px)
const HUMM = [[0, -1], [0, -.55], [.15, -.45], [.9, -.15], [.95, -.05], [.2, -.2], [.12, .3], [.25, .75], [.1, .65], [0, .8], [-.1, .65], [-.25, .75], [-.12, .3], [-.2, -.2], [-.95, -.05], [-.9, -.15], [-.15, -.45], [0, -.55]];
const MONKEY = (() => { const p = []; for (let i = 0; i <= 60; i++) { const u = i / 60, a = u * TAU * 2.3, r = .05 + .4 * u; p.push([.45 + Math.cos(a) * r * .8, .35 + Math.sin(a) * r * .8]); }
  return p.concat([[.2, .55], [-.2, .5], [-.5, .3], [-.75, .4], [-.85, .2], [-.6, .05], [-.65, -.3], [-.8, -.5], [-.6, -.6], [-.4, -.35], [-.2, -.5], [-.05, -.75], [.15, -.6], [.1, -.3], [.3, -.1], [.45, .1]]); })();
const SPIDER = (() => { const p = []; for (let i = 0; i <= 24; i++) { const a = i / 24 * TAU; p.push([Math.cos(a) * .22, Math.sin(a) * .34]); }
  for (const s of [-1, 1]) for (let k = 0; k < 4; k++) { const y = -.2 + k * .14; p.push([s * .2, y], [s * .55, y - .25 + k * .12], [s * .85, y + .1 + k * .1], [s * .55, y - .25 + k * .12], [s * .2, y]); }
  return p; })();
export const GIANTS = [
  { pts: HUMM, x: 900, y: 520, s: 230, rot: .3 },
  { pts: MONKEY, x: 1560, y: 300, s: 210, rot: -.2 },
  { pts: SPIDER, x: 330, y: 760, s: 170, rot: .5 },
].map((g) => ({ ...g, path: g.pts.map(([u, v]) => { const c = Math.cos(g.rot), s = Math.sin(g.rot); return [g.x + (u * c - v * s) * g.s, g.y + (u * s + v * c) * g.s, 4]; }) }));
// the 303 new ones: small relief figures beside the paths (we show a dozen)
export const SMALL = (() => { const r = prng(303), a = []; for (let k = 0; k < 14; k++) { const P0 = PATHS[k % 2], i = 8 + Math.floor(r() * (P0.length - 16)), p = P0[i], q = P0[i + 1], nx = -(q[1] - p[1]), ny = q[0] - p[0], l = Math.hypot(nx, ny) || 1, side = r() < .5 ? -1 : 1; a.push({ x: p[0] + nx / l * 34 * side, y: p[1] + ny / l * 34 * side, s: 16 + r() * 8, kind: k % 3, rot: r() * 6 }); } return a; })();
// the leads that survived (best leads checked on site)
export const BEST = SMALL.map((s) => [s.x, s.y]).slice(0, 12);
// the aerial tiles: a grid of square frames
export const TILE = 150, TILE_X0 = -1050, TILE_Y0 = -750, TCOLS = 28, TROWS = 18;
export const tileRect = (k) => [TILE_X0 + (k % TCOLS) * TILE, TILE_Y0 + Math.floor(k / TCOLS) * TILE, TILE, TILE];
// the pipe at the desert edge (No. 8 begins here)
export const PIPE = { x0: 2350, y0: 1250, x1: 3600, y1: 980, plant: [2700, 1170] };

export function desertMap(ctx, c, t, st = {}) {
  E.card(ctx, c, E.F0, () => {
    B.fillView(ctx, SAND1);
    for (const [x, y, r, rot, v] of PATCH) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(1, .55); ctx.fillStyle = rad(ctx, 0, 0, r, [[0, rgba(v < .5 ? SAND0 : SAND2, .55)], [1, rgba(v < .5 ? SAND0 : SAND2, 0)]]); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.restore(); }
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const w of WADI) { ctx.strokeStyle = rgba(P.night0, .5); ctx.lineWidth = 26; ctx.beginPath(); w.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.strokeStyle = rgba(P.blue1, .12); ctx.lineWidth = 6; ctx.stroke(); }
    for (const [x0, y0, x1, y1, a] of LINES) { ctx.strokeStyle = rgba(mixHex(P.shade1, P.cream, .3), .1 * a); ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); }
    // the old footpaths
    const pa = .35 + .5 * clamp(st.paths ?? 0);
    for (const p of PATHS) { ctx.strokeStyle = rgba(mixHex(P.halo2, P.blue1, .55), .28 * pa); ctx.lineWidth = 12; ctx.setLineDash([22, 14]); ctx.beginPath(); p.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke(); ctx.setLineDash([]); }
    // the known giant figures, drawn in gold light
    const fu = clamp(st.figs ?? 0);
    if (fu > 0) GIANTS.forEach((g, k) => { const u = clamp(fu * 1.6 - k * .3); if (u > 0) { ctx.save(); ctx.globalAlpha = .75 + .25 * (st.figA ?? 1); E.trail(ctx, g.path, u, { w: 4 }); ctx.restore(); if (u >= 1) halo(ctx, g.x, g.y, g.s * 1.3, .18 * (st.figA ?? 1), P.halo0, P.core1); } });
    // a ring of tiny warm lights round the hummingbird (the rituals)
    const rg = clamp(st.ring ?? 0);
    if (rg > 0) { const g = GIANTS[0]; for (let k = 0; k < 40; k++) { const e = expoOut(span(rg, k / 40 * .6, k / 40 * .6 + .4)); if (e <= 0) continue; const a = k / 40 * TAU + t * .05, r = g.s * 1.25; halo(ctx, g.x + Math.cos(a) * r, g.y + Math.sin(a) * r * .9, 16, .7 * e, P.halo0, P.core0); } }
    // the new small figures (light up beside the paths)
    const nf = clamp(st.newFigs ?? 0);
    if (nf > 0) SMALL.forEach((s, k) => { const u = clamp(nf * 1.5 - k * .035); if (u <= 0) return; ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.rot); const pts = (s.kind === 0 ? [[-.5, .3], [-.1, -.4], [.1, -.1], [.45, -.35], [.2, .1], [.45, .4], [-.1, .2], [-.5, .3]] : s.kind === 1 ? [[-.5, .1], [-.2, -.3], [0, .2], [.2, -.3], [.5, .1], [.2, .35], [-.2, .35], [-.5, .1]] : [[0, -.5], [.35, 0], [0, .5], [-.35, 0], [0, -.5]]).map(([a, b]) => [a * s.s * 2, b * s.s * 2, 2.4]);
      E.trail(ctx, pts, u, { w: 2.4, spark: false }); ctx.restore(); });
    // the aerial tiles (a grid of thin cool frames) and the lit ones
    const gr = clamp(st.grid ?? 0);
    if (gr > 0) {
      ctx.strokeStyle = rgba(F.COOL.line, .16 * gr); ctx.lineWidth = 1.6;
      for (let i = 0; i <= TCOLS; i++) { const x = TILE_X0 + i * TILE; ctx.beginPath(); ctx.moveTo(x, TILE_Y0); ctx.lineTo(x, TILE_Y0 + TROWS * TILE * gr); ctx.stroke(); }
      for (let j = 0; j <= TROWS; j++) { const y = TILE_Y0 + j * TILE; ctx.beginPath(); ctx.moveTo(TILE_X0, y); ctx.lineTo(TILE_X0 + TCOLS * TILE * gr, y); ctx.stroke(); }
    }
    if (st.tiles) for (let k = 0; k < TCOLS * TROWS; k++) { const v = st.tiles(k); if (v <= 0) continue; const [x, y, w, h] = tileRect(k); ctx.strokeStyle = rgba(F.COOL.line, .7 * v); ctx.lineWidth = 2.5; ctx.strokeRect(x + 6, y + 6, w - 12, h - 12); }
    // the leads: many cool marks (dotField), almost all go out
    if (st.markers) F.dotField(ctx, t, { x: -900, y: -600, w: 4000, h: 2500, n: 1400, layout: 'scatter', r: 5, seed: 47410, u: st.markers.u, on: st.markers.on, col: () => 'cool', a: st.markers.a ?? 1 });
    // walkers: tiny people with lanterns going out to the best leads
    const wk = clamp(st.walkers ?? 0);
    if (wk > 0) BEST.forEach(([x, y], k) => { const e = sineIO(clamp(wk * 1.3 - k * .03)); const sx = x - 160 - 40 * Math.sin(k), sy = y + 140; const px = lerp(sx, x + 18, e), py = lerp(sy, y + 10, e); halo(ctx, px, py, 26, .7, P.halo0, P.core0); ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(px - 6, py - 4, 4, 0, TAU); ctx.fill(); });
    // the pipe at the edge of the desert: a long dark line, a small plant; the plume (only infrared sees it): a cool curling shimmer
    const pp = clamp(st.pipe ?? 0);
    if (pp > 0) {
      ctx.save(); ctx.globalAlpha = pp; ctx.strokeStyle = mixHex(P.night0, P.blue1, .4); ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(PIPE.x0, PIPE.y0); ctx.lineTo(PIPE.x1, PIPE.y1); ctx.stroke();
      ctx.strokeStyle = rgba(P.blue1, .5); ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = mixHex(P.night0, P.ind1, .5); ctx.fillRect(PIPE.plant[0] - 60, PIPE.plant[1] - 46, 120, 92); ctx.strokeStyle = rgba(P.blue1, .6); ctx.lineWidth = 2; ctx.strokeRect(PIPE.plant[0] - 60, PIPE.plant[1] - 46, 120, 92);
      ctx.restore();
    }
    const pl = clamp(st.plume ?? 0);
    if (pl > 0) plume(ctx, t, PIPE.plant[0] + 40, PIPE.plant[1] - 20, 1, pl, st.plumeCut ?? 0);
    if (st.extra) st.extra(ctx);
  });
}
// the methane plume seen in shortwave infrared: a dark-cool curling shadow with a shimmering edge, drifting downwind (+x, −y).
// (x, y) = source, s = scale (1 = 700 px long), a = visibility, cut 0..1 = it stopped (the plume detaches and drifts away)
export function plume(ctx, t, x, y, s, a, cut = 0) {
  const n = 18, off = cut * 900 * s;
  for (let i = 0; i < n; i++) {
    const u = i / n, d = (u * 700 + (t * 40) % (700 / n)) * s + off, w = (30 + 140 * u) * s;
    if (cut > 0 && d < off + 10) continue;
    const px = x + d * .86 + 40 * Math.sin(t * .7 + u * 6) * s * u, py = y - d * .5 + 30 * Math.cos(t * .9 + u * 5) * s * u;
    const al = a * (1 - u) * .55 * (1 - .7 * cut);
    ctx.fillStyle = E.rad(ctx, px, py, w, [[0, rgba(mixHex(P.night0, F.COOL.deep, .5), al)], [.6, rgba(F.COOL.halo, al * .35)], [1, rgba(F.COOL.halo, 0)]]);
    ctx.beginPath(); ctx.arc(px, py, w, 0, TAU); ctx.fill();
  }
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(F.COOL.body, .35 * a * (1 - cut)); ctx.lineWidth = 2.5 * s;
  ctx.beginPath(); for (let i = 0; i <= 40; i++) { const u = i / 40, d = u * 680 * s + off, px = x + d * .86 + (60 + 120 * u) * s * Math.sin(t * 1.1 + u * 9), py = y - d * .5 + (40 + 80 * u) * s * Math.cos(t * .8 + u * 7); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); ctx.restore();
}
// a map camera: design point (u, v) of the map at the screen centre, magnified s (cards nearer than F0 get parallax)
export const MC = (u, v, s, sx, sy) => E.aim(E.F0, u, v, s, sx, sy);

// ======================================================================================================================== EYE LEVEL → ORBIT
// The desert at eye level (c05 9.05–9.08) and the same horizon bent into the Earth's limb when the camera rises (c06 8.01 …).
// Design px; cam3() = the home view (horizon at y EHOR). The ground of the horizon card (Z_EH) is a disc of radius R: flat while
// bend = 0, the planet (R = PLANET_R) at bend = 1. st: { bend, du { x, walk, a } (you walking the path), fig 0..1 (the small figure
// lights), pipe 0..1, plume 0..1, plumeCut, glow 0..1 (dusk on the horizon), lights 0..1 (warm specks on the night side), extraSky(ctx),
// extraFar(ctx) (on the horizon card, after the planet), extraNear(ctx), nearA 0..1 (the near cards fade as the camera flies over them) }
export const EHOR = 600, Z_EH = 9000, PLANET_R = 1100;
export const PIPE_EYE = { x: 1580, y: EHOR - 2 };                     // the plant on the horizon (right), on Z_EH
export const planetR = (bend) => Math.exp(lerp(Math.log(400000), Math.log(PLANET_R), clamp(bend)));   // log: the curve shows up steadily
// the leak: from the plant's chimney (eye level) to a site on the planet's night side (orbit); s = plume scale
export const SITE = { x: 1420, y: 742 };
export function plumeSite(bend) { const b = sineIO(span(clamp(bend), .05, .95)); return { x: lerp(PIPE_EYE.x + 12, SITE.x, b), y: lerp(PIPE_EYE.y - 50, SITE.y, b), s: lerp(.35, .2, b) }; }
const EYEGROUND = mixHex(P.ind0, P.shade0, .3);
const SCRUB = (() => { const r = prng(55), a = []; for (let k = 0; k < 26; k++) a.push([-600 + r() * 3200, 980 + r() * 160, 30 + r() * 70, r()]); return a; })();
const CITY = (() => { const r = prng(808), a = []; for (let k = 0; k < 140; k++) { const ang = -Math.PI / 2 + (r() - .5) * 1.5, rr = PLANET_R * (.55 + .44 * Math.sqrt(r())); a.push([Math.cos(ang) * rr, Math.sin(ang) * rr, .8 + r() * 1.6]); } return a; })();
export function eyeWorld(ctx, c, t, st = {}) {
  const bend = clamp(st.bend ?? 0), R = planetR(bend), cx0 = W / 2, cy0 = EHOR + R;
  E.card(ctx, c, 40000, () => {
    B.fillView(ctx, lin(ctx, 0, -4000, 0, H / 2 + (EHOR - H / 2) * Z_EH / 40000 + 30, [[0, P.night0], [.7, P.night1], [1, mixHex(P.ind0, P.blue0, .5 * (1 - bend))]]));
    E.stars(ctx, 29, 900, t, [-9000, -9000, 21000, 12000], .7 + .3 * bend);
    if (st.extraSky) st.extraSky(ctx);
  });
  E.card(ctx, c, Z_EH, () => {
    const g = clamp(st.glow ?? .6) * (1 - .4 * bend);
    halo(ctx, 300, EHOR, 1400, .25 * g, mixHex(P.blue0, P.halo1, .45), mixHex(P.halo1, P.core1, .4));
    // the ground / the planet: one disc. Its fill turns from desert to the night side as it bends
    ctx.save(); ctx.beginPath(); ctx.arc(cx0, cy0, R, 0, TAU);
    ctx.fillStyle = lin(ctx, 0, EHOR, 0, EHOR + Math.min(R, 2400), [[0, mixHex(EYEGROUND, mixHex(P.ind0, P.blue0, .25), bend)], [.25, mixHex(SAND2, P.night1, bend)], [1, P.night0]]); ctx.fill();
    ctx.clip();
    if (bend > .3) { const ca = clamp(st.lights ?? 0) * span(bend, .3, 1); if (ca > 0) for (const [x, y, s] of CITY) { ctx.fillStyle = rgba(P.core1, .7 * ca); ctx.fillRect(cx0 + x, EHOR + PLANET_R + y, s * 2, s * 2); } }
    ctx.restore();
    // the atmosphere rim (cool, thin) — the limb
    ctx.save(); ctx.strokeStyle = rgba(mixHex(P.blue0, F.COOL.body, .5), .35 + .45 * bend); ctx.lineWidth = 2.5 + 5 * bend; ctx.beginPath(); ctx.arc(cx0, cy0, R + 2, 0, TAU); ctx.stroke();
    if (bend > 0) { ctx.globalCompositeOperation = 'lighter'; for (const [w, al] of [[16, .06], [40, .05], [80, .035]]) { ctx.strokeStyle = rgba(F.COOL.halo, al * bend); ctx.lineWidth = w; ctx.beginPath(); ctx.arc(cx0, cy0, R + 4 + w / 2, 0, TAU); ctx.stroke(); } }
    ctx.restore();
    if (bend < .5) { ctx.save(); ctx.globalAlpha *= 1 - span(bend, .15, .48); F.hills(ctx, [[-3000, EHOR + 2], [-1500, EHOR - 30], [-600, EHOR - 12], [200, EHOR - 40], [900, EHOR - 8], [1700, EHOR - 26], [4600, EHOR]].map(([x, y]) => [x, lerp(y, EHOR + 40, span(bend, 0, .5))]), { top: mixHex(P.night1, P.ind1, .5), bottom: P.night1, rimA: .25, depth: 30 }); ctx.restore(); }
    // the pipe and its plant on the horizon (right); the plume rises from it
    const pp = clamp(st.pipe ?? 0) * (1 - span(bend, .2, .6));
    if (pp > 0) { ctx.save(); ctx.globalAlpha = pp; ctx.fillStyle = mixHex(P.night0, P.ind1, .5); ctx.fillRect(PIPE_EYE.x - 30, PIPE_EYE.y - 22, 60, 24); ctx.fillRect(PIPE_EYE.x + 8, PIPE_EYE.y - 50, 9, 30); ctx.strokeStyle = mixHex(P.night0, P.blue1, .4); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(PIPE_EYE.x - 30, PIPE_EYE.y - 6); ctx.lineTo(PIPE_EYE.x - 900, PIPE_EYE.y + 4); ctx.stroke(); ctx.restore(); }
    const pl = clamp(st.plume ?? 0);
    if (pl > 0) { const q = plumeSite(bend); plume(ctx, t, q.x, q.y, q.s, pl, st.plumeCut ?? 0); }
    if (st.extraFar) st.extraFar(ctx, { cx: cx0, cy: cy0, R });
  });
  // the near ground: the old footpath into the distance, the small figure, you (they sink out of view as the camera rises)
  const nearA = clamp(st.nearA ?? 1);
  if (bend < .999 && nearA > 0) E.card(ctx, c, E.F0, () => {
    ctx.globalAlpha *= nearA;
    ctx.fillStyle = lin(ctx, 0, 700, 0, 1300, [[0, rgba(SAND2, 0)], [1, rgba(P.night0, .6)]]); ctx.fillRect(-3000, 700, 9000, 2000);
    ctx.strokeStyle = rgba(mixHex(P.halo2, P.blue1, .5), .5); ctx.lineWidth = 26; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-200, 1500); ctx.quadraticCurveTo(600, 760, 1220, 640); ctx.stroke();
    ctx.lineWidth = 6; ctx.strokeStyle = rgba(mixHex(P.halo2, P.blue1, .4), .35); ctx.beginPath(); ctx.moveTo(-180, 1480); ctx.quadraticCurveTo(610, 760, 1220, 640); ctx.stroke();
    const fu = clamp(st.fig ?? 0);
    if (fu > 0) { ctx.save(); ctx.translate(980, 830); ctx.scale(1, .42); const pts = [[-.4, .3], [-.1, -.4], [.1, -.1], [.45, -.35], [.2, .1], [.45, .4], [-.1, .2], [-.4, .3]].map(([a, b]) => [a * 300, b * 300, 7]); E.trail(ctx, pts, fu, { w: 7 }); ctx.restore(); if (fu >= 1) halo(ctx, 980, 830, 220, .3, P.halo0, P.core1); }
    const d = st.du; if (d && (d.a ?? 1) > 0) { const u = d.u, x = (1 - u) ** 2 * -200 + 2 * (1 - u) * u * 600 + u * u * 1220, y = (1 - u) ** 2 * 1500 + 2 * (1 - u) * u * 760 + u * u * 640; E.du(ctx, x, y + 12, lerp(300, 60, Math.sqrt(u)), { walk: d.walk, view: 'side', dir: 1, a: d.a, light: -1 }); }
    if (st.extraNear) st.extraNear(ctx);
  });
  if (bend < .999 && nearA > 0) E.card(ctx, c, 1100, () => { ctx.globalAlpha *= nearA; for (const [x, y, s, v] of SCRUB) { ctx.fillStyle = mixHex(P.night0, P.ind0, .3 + .2 * v); ctx.beginPath(); ctx.ellipse(x, y, s * 1.4, s * .6, 0, Math.PI, 0); ctx.fill(); } ctx.fillStyle = P.night0; ctx.fillRect(-3000, 1040, 9000, 1200); });
}
