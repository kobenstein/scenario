// C5 · "coast": the guilloche rule unwinds into Alaska's coast (3.05 → 3.06). Owner: c05.
// Copied and adapted from K0's reference ref/k0/scenes.mjs (unwindFrame: alaska, coastEngraving, revealAlong, unwindBack,
// unwindFog, dofArcs, frontMotes, tipBloom) — the lead's approved look for this transition (still k0-2b-unwind-coast).
//   alaska() → { pts (1400 pts along the mainland, starting at the point nearest START), rings, path, coastPath }
//   coastLayers() → [water, land] cached engraving layers (main-plane coordinates)
//   revealAlong(ctx, layer, P, end, front, width)   draw a layer only near the laid part of the coast
//   plateBack(ctx, t, cam)   the far engraved plate + drifting fog (parallax .3 / .55)
//   plateFront(ctx, t, cam)  out-of-focus guilloche arcs + motes in front (parallax 1.7 / 2.1)
//   tipBloom() → stippled light canvas (the laying point / burin tip)
import { Path2D } from '@napi-rs/canvas';
import { W, H, rgba, clamp, mix, prng, canvas } from '../engine.mjs';
import { stipple, hatch as artHatch, fog as artFog } from './art.mjs';
import { outlineLocal, fitTo, coastRuns } from './map.mjs';
import { rosette, ring, resample } from './certificate.mjs';

const CACHE = new Map(); const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const TAU = Math.PI * 2;
export const COAST = { x: 900, y: 170, w: 900, h: 760 };
export const START = [760, 560];   // the spool end of the rule: the coast thread starts at the coast point nearest to it
export function alaska() {
  return once('alaska', () => {
    const o = outlineLocal('Alaska', { detail: '50m', n: 30 }), r0 = o.rings[0];
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const [x, y] of r0) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    const rings = fitTo(o.rings, [x0, y0, x1 - x0, y1 - y0], COAST.x, COAST.y, COAST.w, COAST.h);
    let pts = resample(rings[0], 1400), best = 0, bd = 1e18;
    pts.forEach(([x, y], i) => { const d = (x - START[0]) ** 2 + (y - START[1]) ** 2; if (d < bd) { bd = d; best = i; } });
    pts = pts.slice(best).concat(pts.slice(0, best));
    const path = new Path2D(), coastPath = new Path2D();
    for (const r of rings) { r.forEach(([x, y], i) => (i ? path.lineTo(x, y) : path.moveTo(x, y))); path.closePath(); }
    rings.forEach((r, k) => { for (const run of coastRuns(r, o.coast[k])) run.forEach(([x, y], i) => (i ? coastPath.lineTo(x, y) : coastPath.moveTo(x, y))); });
    return { pts, rings, path, coastPath };
  });
}
export function coastLayers() {
  return once('coastengr', () => {
    const A = alaska(), [lm, lg] = canvas(W, H); lg.fillStyle = '#fff'; lg.fill(A.path);
    const band = (d, w) => {
      const [a, ag] = canvas(W, H), [b, bg] = canvas(W, H); ag.lineJoin = bg.lineJoin = 'round'; ag.lineCap = bg.lineCap = 'butt'; ag.strokeStyle = bg.strokeStyle = '#fff';
      ag.lineWidth = 2 * d + w; ag.stroke(A.coastPath); bg.lineWidth = Math.max(.1, 2 * d - w); bg.stroke(A.coastPath);
      ag.globalCompositeOperation = 'destination-out'; ag.drawImage(b, 0, 0); return a;
    };
    const [wc, wg] = canvas(W, H);
    [5, 10.5, 16.5, 23, 30.5, 39, 48.5, 59, 71].forEach((d, k) => { wg.globalAlpha = .58 * Math.pow(.83, k); wg.drawImage(band(d, .9), 0, 0); });
    wg.globalAlpha = 1; wg.globalCompositeOperation = 'destination-out'; wg.drawImage(lm, 0, 0);
    wg.globalCompositeOperation = 'source-in'; const sg = wg.createLinearGradient(0, COAST.y, 0, COAST.y + COAST.h); sg.addColorStop(0, '#c9d6f2'); sg.addColorStop(1, '#e9e2d0'); wg.fillStyle = sg; wg.fillRect(0, 0, W, H);
    const [hc, hg] = canvas(W, H);
    hg.save(); artHatch(hg, [COAST.x - 120, COAST.y - 80, COAST.w + 240, COAST.h + 200], { angle: -.75, gap: 3.6, w: .65, col: '#ffd9a0', a: .8, wobble: .5, seed: 9, broken: .12 }); hg.restore();
    const [fc, fg] = canvas(W, H); fg.filter = 'blur(16px)'; fg.strokeStyle = '#fff'; fg.lineJoin = 'round'; fg.lineWidth = 64; fg.stroke(A.coastPath); fg.filter = 'none';
    hg.globalCompositeOperation = 'destination-in'; hg.drawImage(fc, 0, 0); hg.drawImage(lm, 0, 0);
    hg.globalCompositeOperation = 'source-over'; hg.globalAlpha = .4; hg.drawImage(band(4.5, .8), 0, 0); hg.globalAlpha = 1;
    hg.globalCompositeOperation = 'destination-in'; hg.drawImage(lm, 0, 0); hg.globalCompositeOperation = 'source-over';
    hg.strokeStyle = 'rgba(243,239,226,.85)'; hg.lineWidth = 1.1; hg.lineJoin = 'round';
    for (const r of A.rings.slice(1)) { hg.beginPath(); r.forEach(([x, y], i) => (i ? hg.lineTo(x, y) : hg.moveTo(x, y))); hg.closePath(); hg.stroke(); }
    return [wc, hc];
  });
}
const RV = []; function revealCanvas() { if (!RV.length) RV.push(canvas(W, H)); return RV[0]; }
export function revealAlong(ctx, layer, P, end, front, width) {
  if (end < 2) return; const [c, g] = revealCanvas(); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, W, H);
  g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = '#fff';
  const full = Math.max(0, end - front); if (full > 2) { g.lineWidth = width; g.beginPath(); for (let i = 0; i <= full; i += 3) i ? g.lineTo(P[i][0], P[i][1]) : g.moveTo(P[i][0], P[i][1]); g.lineTo(P[full][0], P[full][1]); g.stroke(); }
  for (let s = 0; s < 6; s++) {
    const a = Math.round(mix(full, end, s / 6)), b = Math.round(mix(full, end, (s + 1) / 6)); if (b <= a) continue;
    g.globalAlpha = 1 - s / 6 * .85; g.lineWidth = width * (1 - s / 6 * .75); g.beginPath(); for (let i = a; i <= b; i++) i === a ? g.moveTo(P[i][0], P[i][1]) : g.lineTo(P[i][0], P[i][1]); g.stroke();
  }
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-in'; g.drawImage(layer, 0, 0);
  ctx.drawImage(c, 0, 0);
}
function unwindBack() {
  return once('unwindback', () => {
    const [c, g] = canvas(W + 200, H + 100);
    const rg = g.createRadialGradient(620, 500, 0, 820, 560, 1400); rg.addColorStop(0, '#1d2b5a'); rg.addColorStop(.5, '#0f1838'); rg.addColorStop(1, '#070a1f'); g.fillStyle = rg; g.fillRect(0, 0, c.width, c.height);
    const [p, pg] = canvas(W + 200, H + 100);
    rosette(pg, 1180, 560, { R: 660, A: 54, B: 26, n: 44, m: 13, lines: 70, col: '#b4bfe8', w: .6, a: .05 });
    pg.strokeStyle = 'rgba(200,210,255,.09)'; pg.lineWidth = 1; pg.setLineDash([2, 6]);
    for (let i = -2; i < 13; i++) { pg.beginPath(); pg.moveTo(760 + i * 110, 0); pg.lineTo(700 + i * 118, c.height); pg.stroke(); }
    for (let j = 0; j < 11; j++) { pg.beginPath(); pg.moveTo(560, 60 + j * 104); pg.lineTo(c.width, 40 + j * 110); pg.stroke(); }
    pg.setLineDash([]);
    g.filter = 'blur(2.5px)'; g.drawImage(p, 0, 0); g.filter = 'none';
    stipple(c, { k: .5, g: 1, seed: 41, mid: false, boost: 1 });
    return c;
  });
}
function unwindFog() { return once('unwindfog', () => { const [c, g] = canvas(W + 300, H); artFog(g, { y0: 80, y1: 1040, col: '#3a5a92', a: .3, seed: 17, sx: .0018, sy: .004, cover: .5, soft: .4, k: .6, x1: W + 300 }); return c; }); }
function dofArcs() {
  return once('dofarcs', () => { const [c, g] = canvas(W, H); g.filter = 'blur(7px)'; ring(g, -260, 1180, 820, 820, { lines: 6, band: 46, wave: 60, col: '#f3efe2', glow: '#ffb35c', glowA: .1, a: .5, lw: 2.2, op: 'source-over' }); ring(g, 2180, -160, 560, 560, { lines: 5, band: 36, wave: 54, col: '#f3efe2', glow: null, a: .32, lw: 2, op: 'source-over' }); g.filter = 'none'; return c; });
}
function frontMotes() {
  return once('frontmotes', () => {
    const [c, g] = canvas(W + 200, H + 100), r = prng(71);
    g.filter = 'blur(5px)'; for (let i = 0; i < 26; i++) { const x = r() * c.width, y = r() * c.height, rr = 6 + r() * 26; g.fillStyle = `rgba(255,${200 + r() * 40 | 0},160,${.035 + r() * .06})`; g.beginPath(); g.arc(x, y, rr, 0, TAU); g.fill(); }
    g.filter = 'none'; for (let i = 0; i < 90; i++) { const x = r() * c.width, y = r() * c.height; g.fillStyle = `rgba(255,236,205,${.12 + r() * .3})`; g.fillRect(x, y, 1 + r() * 1.2, 1 + r() * 1.2); }
    return c;
  });
}
export function tipBloom() { return once('tipbloom', () => { const R = 260, [c, g] = canvas(R * 2, R * 2); const rg = g.createRadialGradient(R, R, 0, R, R, R); rg.addColorStop(0, 'rgba(255,240,210,1)'); rg.addColorStop(.06, 'rgba(255,214,150,.75)'); rg.addColorStop(.2, 'rgba(255,180,100,.28)'); rg.addColorStop(.55, 'rgba(255,160,90,.07)'); rg.addColorStop(1, 'rgba(255,160,90,0)'); g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2); stipple(c, { k: .7, g: 1.15, seed: 47, boost: 2 }); return c; }); }
const FOGW = []; function fogScratch() { if (!FOGW.length) FOGW.push(canvas(1000, 1000)); return FOGW[0]; }
// far plate + fog; warm fog near `warm` (screen point of the light), o.dy shifts everything (the tilt)
export function plateBack(ctx, t, cam, o = {}) {
  const L = (k) => [cam.x * k, cam.y * k + (o.dy ?? 0) * k];
  { const [dx, dy] = L(.3); ctx.drawImage(unwindBack(), -100 + dx, -50 + dy); }
  const [dx, dy] = L(.55), F = unwindFog(), tl = clamp(t - 226, 0, 40), fx = -150 + dx - tl * 6; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .9; ctx.translate(fx, dy); ctx.scale(1.2, 1); ctx.drawImage(F, 0, 0); ctx.restore();
  if (o.warm) {
    const [c, g] = fogScratch(), ox = o.warm[0] - 500, oy = o.warm[1] - 500; g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, 1000, 1000); g.drawImage(F, fx - ox, dy - oy);
    g.globalCompositeOperation = 'source-in'; const wg = g.createRadialGradient(500, 500, 0, 500, 500, 500); wg.addColorStop(0, `rgba(255,170,90,${.9 * (o.warmA ?? 1)})`); wg.addColorStop(.45, `rgba(255,160,90,${.3 * (o.warmA ?? 1)})`); wg.addColorStop(1, 'rgba(255,160,90,0)'); g.fillStyle = wg; g.fillRect(0, 0, 1000, 1000);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(c, ox, oy); ctx.restore();
  }
}
export function plateFront(ctx, t, cam, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return; const L = (k) => [cam.x * k, cam.y * k + (o.dy ?? 0) * k];
  ctx.save(); ctx.globalAlpha = a;
  { const [dx, dy] = L(1.7); ctx.globalAlpha = a * .55; ctx.drawImage(dofArcs(), dx, dy); ctx.globalAlpha = a; }
  { const [dx, dy] = L(2.1); ctx.globalCompositeOperation = 'lighter'; const tl = clamp(t - 226, 0, 12); ctx.drawImage(frontMotes(), -100 + dx - tl * 9, -50 + dy - tl * 3); }
  ctx.restore();
}
