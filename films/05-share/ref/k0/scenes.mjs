// K0 art-test scenes for Film 5 (reference implementations for the builders, like Film 4's ref/kunst/*.mjs).
// Each export is a pure draw(ctx, t, o) for a full 1920×1080 frame; expensive static layers are cached on first use.
//   hookPhone(ctx, t, { buzz })        H.01: the phone on the kitchen table at first light, top-down, buzzing, amber "Your share"
//   certFrame(ctx, t)                  the certificate language: "YOUR SHARE", guilloche, seal, foil glint
//   unwindFrame(ctx, t, { u })         transition: one guilloche line unwinds into Alaska's coastline on the paper map
//   mapNight(ctx, t, { utc })          6.22: the paper map at night, Manila at dawn, Ohio at dusk, two phones buzz at once
import { W, H, rgba, clamp, lin, mix, eout, eio, sm, prng, drift, canvas, addGlow, text } from '../../engine.mjs';
import { vnoise, fbm, stipple, roughPath, hatch as artHatch, pool, bloom, cone, fog } from '../../lib/art.mjs';
import { phone } from '../../lib/phone.mjs';
import { shareLight } from '../../lib/share.mjs';
import { worldMap, ll, project, region, country } from '../../lib/map.mjs';
import { certificate, rosette, guilloche, unwind, gBorder, microtext } from '../../lib/certificate.mjs';
import { fibreFill } from '../../lib/print.mjs';

const CACHE = new Map(); const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };

// ============ H.01 · the kitchen table at first light (top-down, turned 18°) ============
const TW = 2600, TH = 1800; // table layer, larger than the frame so the camera can drift and turn
function tableLayer() {
  return once('table', () => {
    const [c, g] = canvas(TW, TH), n = vnoise(7), r = prng(3);
    const planks = 6, ph = TH / planks;
    for (let i = 0; i < planks; i++) {
      const y0 = i * ph, base = ['#3b2a22', '#33241d', '#3f2d24', '#36271f', '#3a2921', '#31231c'][i];
      g.fillStyle = base; g.fillRect(0, y0, TW, ph);
      // grain: long warped lines, each plank its own flow
      g.lineCap = 'round';
      for (let k = 0; k < 150; k++) {
        const yy = y0 + r() * ph, light = r() < .45; g.strokeStyle = light ? `rgba(150,105,72,${.06 + r() * .12})` : `rgba(18,10,8,${.1 + r() * .18})`; g.lineWidth = .6 + r() * 1.6;
        g.beginPath(); for (let x = -20; x <= TW + 20; x += 24) { const yv = yy + (fbm(n, x * .0016 + i * 7, yy * .01, 3) - .5) * 70; x < 0 ? g.moveTo(x, yv) : g.lineTo(x, yv); } g.stroke();
      }
      // a knot or two with rings bending the grain
      for (let q = 0; q < 2; q++) { const kx = r() * TW, ky = y0 + ph * (.3 + r() * .4); for (let rr = 4; rr < 46; rr += 5) { g.strokeStyle = `rgba(20,12,8,${.25 - rr * .004})`; g.lineWidth = 1.2; g.beginPath(); g.ellipse(kx, ky, rr * 2.6, rr, 0, 0, 7); g.stroke(); } }
      // seam between planks
      g.fillStyle = 'rgba(8,5,4,.85)'; g.fillRect(0, y0 + ph - 3, TW, 3); g.fillStyle = 'rgba(160,120,90,.12)'; g.fillRect(0, y0 + ph, TW, 1.5);
    }
    stipple(c, { k: .18, g: 1, seed: 4, mid: false, boost: 1 });
    return c;
  });
}
// window light falling across the table: four panes, mullion shadows, soft edges, stippled falloff
function lightLayer() {
  return once('light', () => {
    const [c, g] = canvas(W, H);
    const quad = (x0, y0, x1, y1, x2, y2, x3, y3) => { g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.lineTo(x2, y2); g.lineTo(x3, y3); g.closePath(); };
    g.filter = 'blur(14px)';
    const panes = [[0, 0], [1, 0], [0, 1], [1, 1]], ox = 520, oy = -120, ux = [430, 150], uy = [-170, 420];   // projected window: two axes
    for (const [i, j] of panes) {
      const px = ox + i * (ux[0] + 26) + j * (uy[0] - 16), py = oy + i * (ux[1] + 10) + j * (uy[1] + 26);
      const gr = g.createLinearGradient(px, py, px + uy[0] + ux[0], py + uy[1] + ux[1]); gr.addColorStop(0, 'rgba(236,240,246,.95)'); gr.addColorStop(1, 'rgba(196,212,232,.6)');
      g.fillStyle = gr; quad(px, py, px + ux[0], py + ux[1], px + ux[0] + uy[0], py + ux[1] + uy[1], px + uy[0], py + uy[1]); g.fill();
    }
    g.filter = 'none';
    stipple(c, { k: .7, g: 1.25, seed: 8 });
    return c;
  });
}
function mug(ctx, x, y, R, t, tb) {
  // long soft shadow away from the window (light from upper left)
  ctx.save(); ctx.translate(x + R * .9, y + R * .75); ctx.rotate(.55); const sg = ctx.createLinearGradient(-R, 0, R * 3.2, 0); sg.addColorStop(0, 'rgba(5,3,6,.55)'); sg.addColorStop(1, 'rgba(5,3,6,0)'); ctx.fillStyle = sg; ctx.beginPath(); ctx.ellipse(R * .9, 0, R * 2.3, R * .95, 0, 0, 7); ctx.fill(); ctx.restore();
  // handle
  ctx.save(); ctx.translate(x, y); ctx.rotate(.9); ctx.strokeStyle = '#cfc6b6'; ctx.lineWidth = R * .2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.ellipse(R * 1.1, 0, R * .36, R * .3, 0, -2.25, 2.25); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = R * .05; ctx.beginPath(); ctx.ellipse(R * 1.1, 0, R * .4, R * .34, 0, -1.6, -.4); ctx.stroke(); ctx.restore();
  // rim + body (seen from above)
  const g = ctx.createRadialGradient(x - R * .4, y - R * .45, R * .1, x, y, R * 1.05); g.addColorStop(0, '#fbf6ec'); g.addColorStop(.7, '#d9d0c0'); g.addColorStop(1, '#8a8278');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, R, 0, 7); ctx.fill();
  // coffee with buzz ripples
  const cr = R * .8, cg = ctx.createRadialGradient(x + cr * .2, y + cr * .25, 0, x, y, cr); cg.addColorStop(0, '#3a1e10'); cg.addColorStop(1, '#170a05');
  ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(x, y, cr, 0, 7); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, cr, 0, 7); ctx.clip();
  for (const b of tb) { const age = t - b; if (age < 0 || age > 2.4) continue; for (let k = 0; k < 4; k++) { const rr = (age * 70 + k * 16) % (cr * 1.1); ctx.strokeStyle = `rgba(255,210,170,${.22 * (1 - age / 2.4) * (1 - rr / cr)})`; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(x + 3, y + 2, rr, 0, 7); ctx.stroke(); } }
  // window reflection on the coffee
  ctx.fillStyle = 'rgba(255,225,190,.25)'; ctx.beginPath(); ctx.ellipse(x - cr * .35, y - cr * .4, cr * .28, cr * .12, -.6, 0, 7); ctx.fill();
  ctx.restore();
  // steam: thin wisps drifting off to the right, top-down they read as curls
  ctx.save(); ctx.lineCap = 'round';
  for (let k = 0; k < 5; k++) { ctx.strokeStyle = `rgba(235,230,225,${.07 + .03 * k / 5})`; ctx.lineWidth = 6 - k; ctx.beginPath(); for (let i = 0; i <= 30; i++) { const q = i / 30, a = q * 5 + t * .9 + k; const px = x + q * 260 + Math.sin(a) * 26 * q + k * 6, py = y - q * 90 + Math.cos(a * 1.3) * 18 * q; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
  ctx.restore();
}
function keys(ctx, x, y, t) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(-.4);
  ctx.fillStyle = 'rgba(5,3,6,.45)'; ctx.beginPath(); ctx.ellipse(12, 10, 70, 22, .2, 0, 7); ctx.fill();
  ctx.strokeStyle = '#a99a7a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, 16, 0, 7); ctx.stroke();
  for (const [a, col] of [[.3, '#c8a860'], [-.5, '#9aa0a8']]) { ctx.save(); ctx.rotate(a); const kg = ctx.createLinearGradient(14, -8, 14, 8); kg.addColorStop(0, '#fff3d0'); kg.addColorStop(.4, col); kg.addColorStop(1, '#3a3020'); ctx.fillStyle = kg; ctx.beginPath(); ctx.roundRect(14, -11, 26, 22, 6); ctx.fill(); ctx.fillRect(38, -4, 50, 8); for (let i = 0; i < 4; i++) ctx.fillRect(52 + i * 9, 3, 5, 5 + (i % 2) * 3); ctx.restore(); }
  ctx.restore();
}
function lanyard(ctx, x, y, t) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(.25);
  // strap coiled flat (a loose loop), work-lanyard teal with a pale weave
  ctx.strokeStyle = 'rgba(5,3,6,.45)'; ctx.lineWidth = 22; ctx.beginPath(); ctx.ellipse(14, 16, 150, 70, -.15, .4, 5.9); ctx.stroke();
  ctx.strokeStyle = '#1f5560'; ctx.lineWidth = 18; ctx.beginPath(); ctx.ellipse(0, 0, 150, 70, -.15, .4, 5.9); ctx.stroke();
  ctx.setLineDash([2, 6]); ctx.strokeStyle = 'rgba(200,230,230,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, 0, 150, 70, -.15, .4, 5.9); ctx.stroke(); ctx.setLineDash([]);
  // clip + blank badge (no name, no text)
  ctx.fillStyle = '#9aa0a8'; ctx.fillRect(132, -30, 16, 26);
  ctx.save(); ctx.translate(150, 0); ctx.rotate(.12);
  ctx.fillStyle = 'rgba(5,3,6,.5)'; ctx.fillRect(10, 12, 130, 180);
  const bg = ctx.createLinearGradient(0, 0, 130, 180); bg.addColorStop(0, '#f4f1ea'); bg.addColorStop(1, '#bdb6aa'); ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(0, 0, 130, 180, 9); ctx.fill();
  ctx.fillStyle = 'rgba(30,60,70,.18)'; ctx.fillRect(14, 20, 50, 60); ctx.fillStyle = 'rgba(30,40,50,.12)'; ctx.fillRect(14, 104, 100, 8); ctx.fillRect(14, 122, 70, 8);
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(130, 0); ctx.lineTo(0, 120); ctx.closePath(); ctx.globalAlpha = .25; ctx.fill();
  ctx.restore(); ctx.restore();
}
function dust(ctx, t, light) {
  const r = prng(17); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 140; i++) { const x0 = 500 + r() * 1100, y0 = r() * H, sp = 6 + r() * 14, x = x0 + Math.sin(t * .3 + i) * 30 + t * sp * .4, y = y0 + Math.cos(t * .23 + i * 1.3) * 22 - t * sp * .2; const a = (.15 + .5 * r()) * light; ctx.fillStyle = `rgba(255,228,190,${a})`; const s = r() < .85 ? 1.3 : 2.2; ctx.fillRect(x % W, ((y % H) + H) % H, s, s); }
  ctx.restore();
}
export function hookPhone(ctx, t, o = {}) {
  const buzz = o.buzz ?? [1.0, 1.75], rot = -.31 + .012 * Math.sin(t * .17), z = 1.0 + t * .004;
  ctx.fillStyle = '#120d0c'; ctx.fillRect(0, 0, W, H);
  // table (rotated, drifting)
  ctx.save(); ctx.translate(W / 2 + drift(t, 8, 1), H / 2 + drift(t, 6, 2)); ctx.rotate(rot); ctx.scale(z, z); ctx.drawImage(tableLayer(), -TW / 2, -TH / 2); ctx.restore();
  // cold first-light ambience over everything, warmer where the window light lands
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = '#7f8fae'; ctx.fillRect(0, 0, W, H); ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = 'rgba(29,42,68,.55)'; ctx.fillRect(0, 0, W, H); ctx.restore();   // slate first light lifts the blacks
  ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = 1; ctx.drawImage(lightLayer(), drift(t, 4, 3), drift(t, 3, 4)); ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .2; ctx.drawImage(lightLayer(), drift(t, 4, 3), drift(t, 3, 4)); ctx.restore();
  // objects (screen space, they share the table's slow drift)
  const dx = drift(t, 8, 1), dy = drift(t, 6, 2);
  lanyard(ctx, 180 + dx, 820 + dy, t);
  keys(ctx, 1560 + dx, 880 + dy, t);
  mug(ctx, 1280 + dx, 330 + dy, 92, t, buzz);
  // the phone, display up, buzzing; its light spills amber onto the wood
  const lit = sm(lin(buzz[0], buzz[0] + .3, t));
  const amber = once('phonepool', () => { const [c, g] = canvas(W, H); const rg = g.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 560); rg.addColorStop(0, 'rgba(255,179,92,.9)'); rg.addColorStop(.3, 'rgba(255,150,70,.4)'); rg.addColorStop(1, 'rgba(255,140,60,0)'); g.fillStyle = rg; g.fillRect(0, 0, W, H); stipple(c, { k: .8, g: 1.2, seed: 12 }); return c; });
  const px = 900 + dx, py = 560 + dy;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .75 * lit * (.92 + .08 * Math.sin(t * 2.2)); ctx.drawImage(amber, px - W / 2, py - H / 2); ctx.restore();
  // motion ghosts while it buzzes (two faint offset copies = the vibration reads in a still)
  const s0 = buzz[0] + .3;
  const screen = (g, w, h, tt) => {   // a warm notification, large enough to read from above
    const u = eout(lin(buzz[0] + .05, buzz[0] + .5, tt)); if (u <= 0) return;
    const bg = g.createRadialGradient(w * .5, h * .3, 0, w * .5, h * .3, h * .8); bg.addColorStop(0, `rgba(120,62,24,${.85 * u})`); bg.addColorStop(1, `rgba(20,12,10,${.6 * u})`); g.fillStyle = bg; g.fillRect(0, 0, w, h);
    const cy = h * .3 + (1 - u) * 40; g.globalAlpha = u;
    g.fillStyle = 'rgba(52,34,26,.95)'; g.beginPath(); g.roundRect(8, cy - 34, w - 16, 70, 14); g.fill();
    g.strokeStyle = 'rgba(255,179,92,.6)'; g.lineWidth = 1.2; g.stroke();
    shareLight(g, 34, cy + 1, 11, tt, { born: s0 });
    text(g, 'Your share', 56, cy + 2, { size: 19, weight: 600, color: '#fff1d6' });
    text(g, 'now', 56, cy + 22, { size: 11, weight: 500, color: 'rgba(255,225,190,.7)' });
    g.globalAlpha = 1;
  };
  const buzzing = buzz.some((b) => t > b && t < b + .6);
  if (buzzing) for (const [gx, gy] of [[-6, 2], [6, -2]]) { ctx.save(); ctx.globalAlpha = .2; phone(ctx, px + gx, py + gy, 1.6, { t, buzz, slide: [14, 6], ang: .38, screen, glow: 0 }); ctx.restore(); }
  const P = phone(ctx, px, py, 1.6, { t, buzz, slide: [14, 6], ang: .38, screen, glow: .15 });
  addGlow(ctx, P.x, P.y, 300, .35 * lit, '#ffb35c', '#fff1d6');
  dust(ctx, t, .9);
  // vignette pull toward the phone (light falls off to the corners like a print)
  const vg = ctx.createRadialGradient(px, py, 200, px, py, 1300); vg.addColorStop(0, 'rgba(10,8,16,0)'); vg.addColorStop(1, 'rgba(10,8,16,.55)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
}

// ============ certificate: "YOUR SHARE" ============
export function certFrame(ctx, t, o = {}) {
  ctx.fillStyle = '#16100e'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(.18); ctx.globalAlpha = .9; ctx.drawImage(tableLayer(), -TW / 2, -TH / 2); ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = '#5a5470'; ctx.fillRect(0, 0, W, H); ctx.restore();
  const z = 1.06 + .02 * Math.sin(t * .2), x = 1040 + drift(t, 10, 1) - t * 4, y = 610 + drift(t, 6, 2);
  certificate(ctx, t, { x, y, s: .92 * z, rot: -.07 + .004 * Math.sin(t * .3) });
  // raking warm light from the upper left, falling off across the sheet
  const L = once('certlight', () => { const [c, g] = canvas(W, H); const lg = g.createRadialGradient(260, 120, 0, 420, 260, 1500); lg.addColorStop(0, 'rgba(255,200,140,.55)'); lg.addColorStop(.45, 'rgba(255,170,100,.16)'); lg.addColorStop(1, 'rgba(255,160,90,0)'); g.fillStyle = lg; g.fillRect(0, 0, W, H); stipple(c, { k: .7, g: 1.2, seed: 21 }); return c; });
  ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.drawImage(L, 0, 0); ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .35; ctx.drawImage(L, 0, 0); ctx.restore();
  const vg = ctx.createRadialGradient(900, 520, 300, 900, 520, 1350); vg.addColorStop(0, 'rgba(8,6,12,0)'); vg.addColorStop(1, 'rgba(8,6,12,.7)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
}

// ============ transition: a guilloche line unwinds into Alaska's coastline ============
function alaskaCoast(cam) {
  const c = country('USA', '50m'), polys = c.polys.filter((p) => p[0][0][0] < -130 && p[0][0][1] > 50);
  let best = polys[0]; for (const p of polys) if (p[0].length > best[0].length) best = p;
  return best[0].map(([lon, lat]) => { const [sx, sy] = project(cam, lon, lat); return [sx, sy]; });
}
export function unwindFrame(ctx, t, o = {}) {
  const u = clamp(o.u ?? .5);
  // explainer ground: indigo with a soft cream light behind the rosette
  ctx.fillStyle = '#0b0f2a'; ctx.fillRect(0, 0, W, H);
  const bg = once('unwindbg', () => { const [c, g] = canvas(W, H); const rg = g.createRadialGradient(560, 520, 0, 700, 540, 1300); rg.addColorStop(0, 'rgba(60,70,140,.55)'); rg.addColorStop(1, 'rgba(11,15,42,0)'); g.fillStyle = rg; g.fillRect(0, 0, W, H); stipple(c, { k: .8, g: 1.2, seed: 41 }); return c; });
  ctx.drawImage(bg, 0, 0);
  const cam = { ...region('Alaska', .5), tilt: .22, rot: -.06, x: W * .66, y: H * .5, f: 1800 };
  const mapA = sm(lin(.78, 1, u));
  if (mapA > 0) { ctx.save(); ctx.globalAlpha = mapA; worldMap(ctx, cam, { t, detail: '50m', paper: '#e9dfc6' }); ctx.restore(); }
  // the rosette the line comes from (left, cream ink on indigo), slowly turning
  const rx = 520 + drift(t, 6, 1), ry = 540 + drift(t, 5, 2), G = { R: 250, A: 40, B: 16, n: 18, m: 7, lines: 34 };
  ctx.save(); ctx.globalAlpha = 1 - .6 * sm(lin(.3, 1, u)); rosette(ctx, rx, ry, { ...G, rot: t * .05, col: '#f3efe2', w: .8, a: .5, cache: true }); ctx.restore();
  // where it will land: the coast as a faint dotted ghost
  const coast = alaskaCoast(cam);
  ctx.save(); ctx.setLineDash([2, 7]); ctx.strokeStyle = `rgba(243,239,226,${.22 * (1 - mapA)})`; ctx.lineWidth = 1.4; ctx.beginPath(); coast.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.restore();
  // one line in amber unwinds: rosette line 7 (in screen space) → the coast
  const line = guilloche(G).line(7).map(([x, y]) => { const a = t * .05, c = Math.cos(a), s = Math.sin(a); return [rx + x * c - y * s, ry + x * s + y * c]; });
  const pts = unwind(line, coast, u, { n: 1400, sweep: .9 });
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.globalCompositeOperation = 'lighter';
  for (const [w, a] of [[18, .08], [8, .2], [2.4, 1]]) { ctx.strokeStyle = w < 3 ? 'rgba(255,236,200,1)' : `rgba(255,179,92,${a})`; ctx.lineWidth = w; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); }
  ctx.restore();
  // the unwinding front carries a small light
  const fi = Math.min(pts.length - 1, Math.floor(clamp(u * 1.9 - .9 + .9) * (pts.length - 1) * .999));
  const fr = Math.floor(clamp((u * 1.9) / 1.9) * (pts.length - 1));
  addGlow(ctx, pts[fr][0], pts[fr][1], 70, .8, '#ffb35c', '#fff1d6');
  if (o.labels !== false) { const la = sm(lin(.55, .85, u)); text(ctx, 'ALASKA', 1380, 300, { size: 54, font: 'Instrument Serif', color: rgba('#f3efe2', la) }); text(ctx, 'THE RULE CAME FIRST · 1976', 1384, 336, { size: 16, weight: 600, color: rgba('#a49fc4', la), spacing: 5 }); }
}

// ============ 6.22 · the map at night: Manila at dawn, Ohio at dusk ============
const MANILA = [120.98, 14.6], OHIO = [-82.99, 39.96];
export function mapNight(ctx, t, o = {}) {
  const utc = o.utc ?? 22.6, buzzT = o.buzz ?? 1.0;
  ctx.fillStyle = '#07080f'; ctx.fillRect(0, 0, W, H);
  // the table in a dark room, one warm lamp pool to the right
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-.06); ctx.globalAlpha = .55; ctx.drawImage(tableLayer(), -TW / 2, -TH / 2); ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = '#3a4060'; ctx.fillRect(0, 0, W, H); ctx.restore();
  // Pacific-centred view would cut the Americas; centre between Ohio and Manila across the Atlantic/Africa instead
  const cam = { cx: .05, cy: .26, z: 1.02 + .012 * t, rot: -.07 + .003 * Math.sin(t * .2), tilt: .5, x: W * .5 + drift(t, 8, 1), y: H * .56 + drift(t, 5, 2), f: 1500 };
  const M = worldMap(ctx, cam, { t, terminator: { utc, decl: -10.5 }, paper: '#e6dcc4', land: '#cbb68c', light: [W * .78, H * .2] });
  // city lights on the night side: tiny amber specks on land, only where the sun is down
  const lights = once('citylights', () => { const r = prng(51), pts = []; const D = []; for (let i = 0; i < 900; i++) { const lon = -180 + r() * 360, lat = -50 + Math.pow(r(), .8) * 110; pts.push([lon, lat, r()]); } return pts; });
  // two phones: Manila (dawn) and Ohio (dusk) buzz in the same frame; rings run toward each other along the twilight line
  const pM = project(cam, ...MANILA), pO = project(cam, ...OHIO);
  for (const [p, label, sub] of [[pM, 'MANILA', 'DAWN · 6:36 AM'], [pO, 'OHIO', 'DUSK · 6:36 PM']]) {
    const age = t - buzzT;
    for (let k = 0; k < 3; k++) { const a = age - k * .45; if (a < 0 || a > 2.6) continue; const rr = 10 + a * 120; ctx.strokeStyle = `rgba(255,179,92,${.7 * (1 - a / 2.6)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(p[0], p[1], rr, rr * .62, -.07, 0, 7); ctx.stroke(); }
    addGlow(ctx, p[0], p[1], 90, .55, '#ffb35c', '#fff1d6');
    shareLight(ctx, p[0], p[1], 9, t, { born: buzzT - .2 });
    const lx = p[0] + (label === 'OHIO' ? -230 : 40), ly = p[1] - 70;
    ctx.strokeStyle = 'rgba(255,241,214,.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p[0], p[1] - 12); ctx.lineTo(lx + (label === 'OHIO' ? 190 : 0), ly + 10); ctx.stroke();
    ctx.fillStyle = 'rgba(7,9,24,.55)'; ctx.fillRect(lx - 10, ly - 30, 200, 52);
    text(ctx, label, lx, ly - 6, { size: 22, weight: 600, color: '#fff1d6', spacing: 5 });
    text(ctx, sub, lx, ly + 14, { size: 14, weight: 500, color: '#f3d9b0', spacing: 3 });
  }
  // lamp pool from the right and cold room light from the left
  const L = once('maplamp', () => { const [c, g] = canvas(W, H); const lg = g.createRadialGradient(W * .86, H * .1, 0, W * .8, H * .2, 1200); lg.addColorStop(0, 'rgba(255,190,120,.5)'); lg.addColorStop(.5, 'rgba(255,160,90,.12)'); lg.addColorStop(1, 'rgba(255,150,80,0)'); g.fillStyle = lg; g.fillRect(0, 0, W, H); stipple(c, { k: .7, g: 1.2, seed: 33 }); return c; });
  ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.drawImage(L, 0, 0); ctx.restore();
  const vg = ctx.createRadialGradient(W * .5, H * .55, 380, W * .5, H * .55, 1250); vg.addColorStop(0, 'rgba(6,6,14,0)'); vg.addColorStop(1, 'rgba(6,6,14,.75)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
}
