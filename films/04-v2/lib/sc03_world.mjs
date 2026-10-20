// c03 (Film 4 minute 1) · the world of shots 3.01–3.04: one continuous night landscape in world units (1 unit = 1 px at camera scale 1).
// From left to right: the foot of the engraved staircase (c02's slabs, rising to the upper right over the hall), the works hall on its
// terrace (amber windows, rows of racks behind the bars, a rosette in the pediment), the two-tier stone aqueduct that carries the share
// lights across a misty valley, its broken end, the gap, and on the far plateau a small house whose window is "you".
// Static parts are cached in raster layers (A: x -500…3960 at 1×, B: x 3820…5400 at 2.4× for the final push to the window);
// per frame only transforms, lights, smoke, stars, fog drift and the bridge/seal engraving are drawn. Close to the works hall's door
// (3.01 starts inside its light at scale 13) the hall is drawn from sharp raster levels (k up to 12.2) over layer A.
// Every cached canvas is handed to the renderer as a decoded Image (@napi-rs/canvas copies a Canvas source on every drawImage and keeps
// the copy): toImg / best / warmWorld() (await it in the scene's default export).
//
//   GEO                     world geometry (hall, aqueduct top(x), gap, house, window, outlet, door)
//   warmWorld()             builds every cache and awaits the Image decodes
//   drawWorld(ctx, cam, t, o)  sky, stars, far hills, back fog, mid hills, main layers (A, B); o.live: the hall from its sharp levels
//   drawValleyFog(ctx, cam, t)  the valley mist in front of the piers (after the lights, so falling lights sink into it)
//   drawLive(ctx, t)        steam, hall glow, chimney smoke, the tree (world transform set)
//   DOORL, doorPath(g), doorFrame(ctx)  the hall's great open door: its light's centre, its opening (clip for the scene's lightAt),
//                           its frame and sill drawn over that light (world transform set)
//   drawWindow(ctx, t, warm) the house window (0 faint, 1 warm amber)
//   camT(ctx, cam)          sets the world transform;  toScreen(cam, x, y)
//   bridgeLines(), bridgeFill(ctx, a, xFront), BRIDGE   the bridge across the gap (ghost → burin → stone)
//   ifSeal(ctx, x, y, r, t, o)  copied from lib/sc02_m1.mjs (c02's IF seal, 2.05) so 3.03 shows the same seal; o.clip(ctx, r) clips the body
//   slabLayer(i), STEP      copied from lib/sc02_m1.mjs (c02's stair slabs) so 3.01 lands at the foot of the same staircase
import { Path2D, Image } from '@napi-rs/canvas';
import { W, H, rgba, clamp, mix, prng, canvas, lin, sm, eout, addGlow } from '../engine.mjs';
import { stipple, vnoise, fbm, hatch } from './art.mjs';
import { rosette, microtext, FOIL, guilloche, microRing, foilGlint, INK, PAPER } from './certificate.mjs';
const certSeal = (...a) => sealFixed(...a);

export const AMBER = '#ffb35c', CORE = '#fff1d6', CREAM = '#f3efe2';
const STONE = '#2c3060', STONE_L = '#40467c', STONE_D = '#161935';
const TAU = Math.PI * 2;
const CACHE = new Map();
export const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
// cached canvases → decoded Images (the toImg / best / ready pattern of lib/sc01_m1_open.mjs, copied: minute files are not imported)
const PEND = [], REC = new WeakMap();
const isCanvas = (c) => !!c && typeof c.getContext === 'function' && typeof c.toBuffer === 'function';
export const toImg = (c) => { if (!isCanvas(c) || REC.has(c)) return c; const im = new Image(), r = { im, ok: false }; REC.set(c, r); im.src = c.toBuffer('image/png'); PEND.push(im.decode().then(() => { r.ok = im.width > 0; }, () => { })); return c; };
export const best = (c) => { const r = REC.get(c); return r && r.ok ? r.im : c; };   // the decoded Image if there is one, else the Canvas
export async function ready() { while (PEND.length) await PEND.shift(); }

// ---------------------------------------------------------------- geometry
const HX0 = 720, HX1 = 1700, AQ0 = 1790, AQ1 = 4110, CLIFF = 4542, VALLEY = 1560;
const aq = (x) => clamp((x - AQ0) / (AQ1 - AQ0));
export const GEO = {
  hall: { x0: HX0, x1: HX1, base: 905, top: 440, peak: 300, side: 1772 },
  aq: { x0: AQ0, x1: AQ1 },
  top: (x) => mix(470, 600, Math.pow(aq(x), .95)),            // top of the channel lip
  gap: { x0: AQ1, x1: CLIFF },
  house: { x0: 4618, x1: 4846, base: 724, eave: 588, ridge: 492 },
  win: { x: 4732, y: 662, w: 50, h: 60 },
  outlet: { x: 1790, y: 466 },
  stair: { x: -150, y: 905 },
  door: { x0: 1130, x1: 1290, top: 600, bot: 880, cx: 1210, cy: 742 },   // the hall's great arched door (its light opens 3.01)
};
const G = GEO;
const NG = vnoise(31);
export function ground(x) {
  const n = NG, wob = (fbm(n, x * .004, 1.3, 3) - .5) * 26;
  if (x < 1800) return 906 + wob * .25;
  if (x < 1990) return mix(906, VALLEY, sm(lin(1800, 1990, x))) + wob * .3;
  if (x < CLIFF - 40) return VALLEY;
  if (x < CLIFF + 6) return mix(VALLEY, 726, sm(lin(CLIFF - 40, CLIFF + 6, x)));
  return 726 + (x - CLIFF) * .012 + wob * .25;
}

// ---------------------------------------------------------------- camera
export const toScreen = (cam, x, y) => [960 + (x - cam.cx) * cam.s, 540 + (y - cam.cy) * cam.s];
export const camT = (ctx, cam) => ctx.setTransform(cam.s, 0, 0, cam.s, 960 - cam.cx * cam.s, 540 - cam.cy * cam.s);
// a layer with parallax p (p = 1: the main plane); layer coordinates sit where drawn when the camera is at REF
const REF = [880, 560];
function put(ctx, cam, L, p, dx = 0) {
  const sp = 1 + (cam.s - 1) * p, cx = REF[0] + (cam.cx - REF[0]) * p, cy = REF[1] + (cam.cy - REF[1]) * p;
  ctx.setTransform(sp / L.k, 0, 0, sp / L.k, 960 + (L.x0 + dx - cx) * sp, 540 + (L.y0 - cy) * sp);
  ctx.drawImage(best(L.c), 0, 0);
}

// ---------------------------------------------------------------- c02's pieces (copied, see header)
export const STEP = { run: 128, rise: 92, th: 34, D: [52, -34], n: 14 };
export function slabLayer(i) {
  return once('c03slab' + i, () => {
    const { run, th, D } = STEP, pad = 24, w = run + D[0] + pad * 2, h = th - D[1] + pad * 2, [c, g] = canvas(w, h); g.translate(pad, pad - D[1]);
    const gap = Math.max(1.7, 6.2 * Math.pow(.82, i)), waves = 10 + i * 4;
    const top = new Path2D(); top.moveTo(0, 0); top.lineTo(run, 0); top.lineTo(run + D[0], D[1]); top.lineTo(D[0], D[1]); top.closePath();
    const tg = g.createLinearGradient(0, 0, run + D[0], D[1]); tg.addColorStop(0, '#e9dcbf'); tg.addColorStop(1, '#fff3da'); g.fillStyle = tg; g.fill(top);
    g.save(); g.clip(top); g.strokeStyle = rgba('#7a5a34', .35); g.lineWidth = .6; for (let k = 0; k < 5; k++) { const q = (k + 1) / 6; g.beginPath(); g.moveTo(D[0] * q, D[1] * q); g.lineTo(run + D[0] * q, D[1] * q); g.stroke(); } g.restore();
    const side = new Path2D(); side.moveTo(run, 0); side.lineTo(run + D[0], D[1]); side.lineTo(run + D[0], D[1] + th); side.lineTo(run, th); side.closePath();
    g.fillStyle = '#5b4a3a'; g.fill(side); g.save(); g.clip(side); g.strokeStyle = 'rgba(20,12,8,.55)'; g.lineWidth = .8; for (let k = -40; k < 80; k += 3.2) { g.beginPath(); g.moveTo(run + k, -40); g.lineTo(run + k + 40, 60); g.stroke(); } g.restore();
    const front = new Path2D(); front.rect(0, 0, run, th);
    const fg = g.createLinearGradient(0, 0, 0, th); fg.addColorStop(0, '#d9ccb0'); fg.addColorStop(1, '#a8977a'); g.fillStyle = fg; g.fill(front);
    g.save(); g.clip(front); g.strokeStyle = rgba('#1f2a3a', .5); g.lineWidth = Math.max(.45, gap * .22); for (let y = gap * .5; y < th; y += gap) { g.beginPath(); for (let x = 0; x <= run; x += 3) { const yy = y + Math.sin(x * .05 + y) * .6; x ? g.lineTo(x, yy) : g.moveTo(x, yy); } g.stroke(); }
    g.strokeStyle = rgba('#2a3550', .65); g.lineWidth = .55; for (let k = 0; k < 3; k++) { const ph = k / 3 * TAU; g.beginPath(); for (let x = 0; x <= run; x += 1.5) { const yy = th * .5 + th * .22 * Math.sin(x / run * waves * TAU / 2 + ph); x ? g.lineTo(x, yy) : g.moveTo(x, yy); } g.stroke(); }
    g.restore();
    g.strokeStyle = rgba('#2a1d14', .7); g.lineWidth = 1; g.strokeRect(0, 0, run, th);
    const eg = g.createLinearGradient(0, 0, run, 0); FOIL.forEach((col, k) => eg.addColorStop(k / (FOIL.length - 1), col)); g.strokeStyle = eg; g.lineWidth = 2.2; g.beginPath(); g.moveTo(0, 0); g.lineTo(run, 0); g.stroke();
    return { c: toImg(c), pad, D };
  });
}
// c02's seal body uses certificate.seal(), whose foil stipple lands off-centre (putImageData under a translate): a fixed copy
const strokePts = (ctx, pts) => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke(); };
function foilFill(g, x, y, w, h, ang = .6) { const gr = g.createLinearGradient(x, y, x + Math.cos(ang) * w, y + Math.sin(ang) * h); FOIL.forEach((c, i) => gr.addColorStop(i / (FOIL.length - 1), c)); return gr; }
function sealFixed(ctx, x, y, r, t, o = {}) {
  const foil = !!o.foil, scal = o.scallops ?? 36;
  const edge = (g, rr) => { g.beginPath(); for (let i = 0; i <= 360; i++) { const a = i / 360 * TAU, q = rr * (1 + .035 * Math.cos(scal * a)); i ? g.lineTo(Math.cos(a) * q, Math.sin(a) * q) : g.moveTo(Math.cos(a) * q, Math.sin(a) * q); } g.closePath(); };
  const key = 'c03seal' + JSON.stringify([r, foil, o.label, o.emblem, scal]);
  const pad = r * .3, S = (r + pad) * 2;
  const c = once(key, () => { const [cc, g] = canvas(Math.ceil(S), Math.ceil(S));
    g.translate(S / 2, S / 2);
    // emboss: light upper-left rim, dark lower-right rim, then the face
    g.save(); g.translate(-r * .025, -r * .025); edge(g, r); g.fillStyle = foil ? '#ffe9c0' : 'rgba(255,252,240,.9)'; g.fill(); g.restore();
    g.save(); g.translate(r * .035, r * .04); edge(g, r); g.fillStyle = foil ? 'rgba(70,30,8,.85)' : 'rgba(60,45,30,.35)'; g.fill(); g.restore();
    edge(g, r); g.fillStyle = foil ? foilFill(g, -r, -r, 2 * r, 2 * r) : PAPER; g.fill();
    const ink = foil ? 'rgba(90,40,10,.75)' : rgba(INK, .55);
    // concentric rings + ring microtext + a small guilloche rosette as emblem
    g.strokeStyle = ink; g.lineWidth = Math.max(.8, r * .012);
    for (const q of [.9, .72, .7]) { g.beginPath(); g.arc(0, 0, r * q, 0, TAU); g.stroke(); }
    microRing(g, 0, 0, r * .81, o.label || 'ONE EQUAL SHARE FOR EVERY PERSON', { size: Math.max(5, r * .085), col: foil ? '#5a2a08' : INK, a: .8 });
    const G = guilloche({ R: r * .42, A: r * .12, B: r * .05, n: 12, m: 5, lines: 18 }); g.lineWidth = Math.max(.6, r * .008);
    for (let k = 0; k < G.lines; k++) strokePts(g, G.line(k));
    if (o.emblem !== 'none') { // a seed at the centre
      g.save(); g.rotate(-.5); const sr = r * .16, sg = g.createRadialGradient(-sr * .3, -sr * .4, 0, 0, 0, sr * 1.3); sg.addColorStop(0, foil ? '#fff4dc' : '#f3efe2'); sg.addColorStop(1, foil ? '#b8641e' : '#bba98a');
      g.fillStyle = sg; g.beginPath(); g.moveTo(0, -sr * 1.3); g.bezierCurveTo(sr * .95, -sr * .5, sr * .85, sr * .9, 0, sr); g.bezierCurveTo(-sr * .85, sr * .9, -sr * .95, -sr * .5, 0, -sr * 1.3); g.fill(); g.restore();
    }
    // foil texture: fine stipple so it reads as metal leaf, not a gradient
    if (foil) { const [nc, nx] = canvas(Math.ceil(S), Math.ceil(S)); nx.translate(S / 2, S / 2); edge(nx, r); nx.fillStyle = 'rgba(255,240,200,.35)'; nx.fill(); nx.setTransform(1, 0, 0, 1, 0, 0); stipple(nc, { k: 1, g: 1.4, seed: 5, mid: false, boost: 1.4 }); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'overlay'; g.drawImage(nc, 0, 0); g.restore(); }
    return cc;
  });
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.drawImage(c, -S / 2, -S / 2);
  if (foil) { const p = new Path2D(); for (let i = 0; i <= 120; i++) { const a = i / 120 * TAU, q = r * (1 + .035 * Math.cos(scal * a)); i ? p.lineTo(Math.cos(a) * q, Math.sin(a) * q) : p.moveTo(Math.cos(a) * q, Math.sin(a) * q); } p.closePath(); foilGlint(ctx, p, t, { x: -r * 1.6, y: 0, span: r * 3.2, width: r * .5, speed: o.glintSpeed ?? .18, phase: o.glintPhase ?? 0 }); }
  ctx.restore();
}
// resample a polyline to n points (by arc length)

export function ifSeal(ctx, x, y, r, t, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const body = once('c03ifseal' + r, () => {
    const S = Math.ceil(r * 2.8), [c, g] = canvas(S, S); g.translate(S / 2, S / 2);
    certSeal(g, 0, 0, r, 0, { foil: true, label: 'IF AI AND ROBOTS KEEP GETTING BETTER', emblem: 'none' });
    const cg = g.createRadialGradient(-r * .2, -r * .25, 0, 0, 0, r * .66); cg.addColorStop(0, '#ffe7b8'); cg.addColorStop(.6, '#d98d3c'); cg.addColorStop(1, '#8a4416'); g.fillStyle = cg; g.beginPath(); g.arc(0, 0, r * .64, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(90,40,10,.6)'; g.lineWidth = Math.max(.8, r * .01); for (let k = 0; k < 26; k++) { g.beginPath(); g.arc(0, 0, r * (.2 + k * .017), 0, TAU); g.stroke(); }
    g.font = `400 ${Math.round(r * .82)}px "Instrument Serif"`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = 'rgba(70,28,6,.85)'; g.fillText('IF', r * .025, r * .1); g.fillStyle = 'rgba(255,246,222,.95)'; g.fillText('IF', -r * .015, r * .055);
    g.fillStyle = '#b5621f'; g.fillText('IF', 0, r * .075);
    return toImg(c);
  });
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.globalAlpha = a; const S = body.width;
  if (o.clip) { o.clip(ctx, r); ctx.clip(); }   // the burin engraves it round (sector) or its rim unwinds it (cap): the body is clipped, never faded
  ctx.drawImage(best(body), -S / 2, -S / 2);
  if (o.glint != null) { const p = o.glint, gx = mix(-r * 1.4, r * 1.4, p), gg = ctx.createLinearGradient(gx - r * .4, -r, gx + r * .4, r); gg.addColorStop(0, 'rgba(255,240,210,0)'); gg.addColorStop(.5, `rgba(255,248,232,${.55 * Math.sin(Math.PI * clamp(p))})`); gg.addColorStop(1, 'rgba(255,240,210,0)');
    ctx.globalCompositeOperation = 'lighter'; ctx.beginPath(); ctx.arc(0, 0, r * 1.02, 0, TAU); ctx.clip(); ctx.fillStyle = gg; ctx.fillRect(-r * 1.2, -r * 1.2, r * 2.4, r * 2.4); }
  ctx.restore();
}

// ---------------------------------------------------------------- static drawing
const archPath = (g, x0, x1, ySpring, yBot) => { const r = (x1 - x0) / 2, xm = (x0 + x1) / 2; g.moveTo(x0, yBot); g.lineTo(x0, ySpring); g.arc(xm, ySpring, r, Math.PI, TAU); g.lineTo(x1, yBot); g.closePath(); };
// lib/art.mjs hatch, copied with view culling: the same lines (same prng / noise sequence); with `view` = [x0, y0, x1, y1] (world) only
// the segments near the view are stroked (the hall's high-resolution levels cover small regions), pixel-identical inside the view
function hatchV(ctx, bbox, { angle = -.6, gap = 7, w = 1.1, col = '#000', a = .3, wobble = 1.2, seed = 1, broken = .25 } = {}, view = null) {
  const [bx, by, bw, bh] = bbox, r = prng(seed), n = vnoise(seed + 5), cx = bx + bw / 2, cy = by + bh / 2, R = Math.hypot(bw, bh) / 2 + 10;
  const ca = Math.cos(angle), sa = Math.sin(angle), M = 14;
  const [vx0, vy0, vx1, vy1] = view ? [view[0] - M, view[1] - M, view[2] + M, view[3] + M] : [-Infinity, -Infinity, Infinity, Infinity];
  let nMin = -Infinity, nMax = Infinity;   // the view's extent across the lines (offset o along the normal)
  if (view) { nMin = Infinity; nMax = -Infinity; for (const [x, y] of [[vx0, vy0], [vx1, vy0], [vx0, vy1], [vx1, vy1]]) { const q = -(x - cx) * sa + (y - cy) * ca; nMin = Math.min(nMin, q); nMax = Math.max(nMax, q); } }
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round';
  for (let o = -R; o <= R; o += gap * (.8 + r() * .4)) {
    const al = a * (.55 + .45 * r());
    if (o + wobble < nMin || o - wobble > nMax) continue;
    ctx.globalAlpha = al; ctx.beginPath(); let pen = false;
    for (let s = -R; s <= R; s += 6) {
      const brk = broken && n(o * .07, s * .012) < broken; if (brk) { pen = false; continue; }
      const off = (n(o * .05, s * .02) - .5) * 2 * wobble, x = cx + ca * s - sa * (o + off), y = cy + sa * s + ca * (o + off);
      if (x < vx0 || x > vx1 || y < vy0 || y > vy1) { pen = false; continue; }
      if (!pen) { ctx.moveTo(x, y); pen = true; } else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();
}

// the staircase: c02's slabs, from the ground at the stair foot up to the upper right (over the hall roof, out of frame)
function drawStairs(g) {
  const F = G.stair, { run, rise, th, D } = STEP;
  // a soft shadow where the first slab meets the ground
  g.save(); g.translate(F.x + 90, F.y + 4); g.scale(1, .16); const sg = g.createRadialGradient(0, 0, 0, 0, 0, 220); sg.addColorStop(0, 'rgba(3,3,12,.6)'); sg.addColorStop(1, 'rgba(3,3,12,0)'); g.fillStyle = sg; g.fillRect(-240, -240, 480, 480); g.restore();
  for (let i = 15; i >= 0; i--) { const S = slabLayer(Math.min(i, 13)), x = F.x + i * run, y = F.y - th - i * rise; g.drawImage(best(S.c), x - S.pad, y - S.pad + D[1]); }
}

// opt.view = [x0, y0, x1, y1] (world): only what is near the view is drawn (same pixels inside it, see hatchV)
function drawHall(g, opt = {}) {
  const h = G.hall, r = prng(17), cxH = (h.x0 + h.x1) / 2, V = opt.view || null;
  const vis = (x0, y0, x1, y1) => !V || (x1 > V[0] - 16 && x0 < V[2] + 16 && y1 > V[1] - 16 && y0 < V[3] + 16);
  // right side wall in perspective (the channel leaves through it)
  g.fillStyle = STONE_D; g.beginPath(); g.moveTo(h.x1, h.top); g.lineTo(h.side, h.top + 22); g.lineTo(h.side, h.base - 4); g.lineTo(h.x1, h.base); g.closePath(); g.fill();
  if (vis(h.x1, h.top, h.side, h.base)) { g.save(); g.clip(); hatchV(g, [h.x1, h.top, 90, h.base - h.top], { angle: -1.2, gap: 4.5, col: '#000', a: .35, seed: 4 }, V); g.restore(); }
  g.fillStyle = '#10122a'; g.beginPath(); g.moveTo(cxH, h.peak); g.lineTo(cxH + 70, h.peak + 4); g.lineTo(h.side + 8, h.top + 16); g.lineTo(h.x1 + 16, h.top - 4); g.closePath(); g.fill();
  // the vent tower behind (steam is live)
  if (vis(852, 128, 928, 450)) {
    g.fillStyle = '#14163a'; g.fillRect(860, 140, 60, 310); g.fillStyle = '#23275a'; g.fillRect(852, 128, 76, 20);
    g.save(); g.beginPath(); g.rect(860, 140, 60, 310); g.clip(); hatchV(g, [860, 140, 60, 310], { angle: -1.3, gap: 4, col: '#000', a: .4, seed: 9 }, V); g.restore();
    g.strokeStyle = rgba('#8c90c4', .35); g.lineWidth = 1.5; g.beginPath(); g.moveTo(860, 148); g.lineTo(860, 450); g.stroke();
  }
  // facade body
  const body = () => { g.beginPath(); g.moveTo(h.x0, h.base); g.lineTo(h.x0, h.top); g.lineTo(cxH, h.peak); g.lineTo(h.x1, h.top); g.lineTo(h.x1, h.base); g.closePath(); };
  body(); const fg = g.createLinearGradient(0, h.peak, 0, h.base); fg.addColorStop(0, '#323770'); fg.addColorStop(.55, STONE); fg.addColorStop(1, '#1b1e44'); g.fillStyle = fg; g.fill();
  g.save(); body(); g.clip();
  g.strokeStyle = rgba('#0c0e24', .5); g.lineWidth = 1;
  for (let y = h.top + 18; y < h.base; y += 22) { if (!vis(h.x0, y, h.x1, y + 22)) continue; g.beginPath(); g.moveTo(h.x0, y); g.lineTo(h.x1, y); g.stroke(); const off = ((y / 22) | 0) % 2 ? 0 : 30; for (let x = h.x0 + off; x < h.x1; x += 60) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 22); g.stroke(); } }
  for (const px of [h.x0 + 8, 856, 976, 1096, 1300, 1420, 1540, h.x1 - 38]) { if (!vis(px, h.top, px + 30, h.base)) continue; const pg = g.createLinearGradient(px, 0, px + 30, 0); pg.addColorStop(0, rgba('#555b98', .55)); pg.addColorStop(1, rgba('#0c0e24', .35)); g.fillStyle = pg; g.fillRect(px, h.top + 10, 30, h.base - h.top); }
  hatchV(g, [h.x0, h.top, h.x1 - h.x0, h.base - h.top], { angle: -.75, gap: 6, col: '#05061a', a: .3, seed: 12, broken: .3 }, V);
  // the glow from the windows lifts the lower facade
  const lg = g.createLinearGradient(0, h.base - 360, 0, h.base); lg.addColorStop(0, 'rgba(255,179,92,0)'); lg.addColorStop(1, 'rgba(255,179,92,.16)'); g.fillStyle = lg; g.fillRect(h.x0, h.base - 360, h.x1 - h.x0, 360);
  g.restore();
  if (vis(h.x0 - 16, h.peak - 20, h.x1 + 16, h.top + 12)) {
    g.strokeStyle = rgba('#9da2d8', .55); g.lineWidth = 3; g.beginPath(); g.moveTo(h.x0 - 16, h.top + 2); g.lineTo(h.x1 + 16, h.top + 2); g.stroke();
    g.lineWidth = 2.5; g.beginPath(); g.moveTo(h.x0 - 16, h.top); g.lineTo(cxH, h.peak - 12); g.lineTo(h.x1 + 16, h.top); g.stroke();
    g.strokeStyle = rgba('#05061a', .7); g.lineWidth = 6; g.beginPath(); g.moveTo(h.x0 - 16, h.top + 9); g.lineTo(h.x1 + 16, h.top + 9); g.stroke();
  }
  if (vis(cxH - 70, h.top - 124, cxH + 70, h.top + 16)) rosette(g, cxH, h.top - 54, { R: 46, A: 9, B: 4, n: 14, m: 5, lines: 24, col: '#e9b46a', w: .7, a: .6 });
  if (vis(h.x0 + 110, h.top + 24, h.x1 - 110, h.top + 44)) microtext(g, h.x0 + 110, h.top + 34, h.x1 - h.x0 - 220, 'THE WORKS · ', { size: 7, col: '#9da2d8', a: .5 });
  // the windows (racks behind bars) and, in the middle, the great door: open, full of the works' white-hot light (the light itself is
  // drawn live by the scene, lightAt clipped to doorPath; here only its warm ground, in case a pixel of the clip edge shows)
  const wins = [[cxH - 80, 160, 600, 880], [h.x0 + 60, 66, 570, 860], [h.x0 + 180, 66, 570, 860], [h.x0 + 300, 66, 570, 860], [h.x1 - 366, 66, 570, 860], [h.x1 - 246, 66, 570, 860], [h.x1 - 126, 66, 570, 860]];
  wins.forEach(([x, w, yTop, yBot], wi) => {
    const rr = w / 2, ys = yTop + rr, nb = Math.max(2, Math.round(w / 28)), door = wi === 0;
    if (door || !vis(x - 8, yTop, x + w + 8, yBot + 8)) { for (let i = 0; i < nb * 11; i++) r(); }   // keep the prng sequence of the other windows
    if (!vis(x - 8, yTop, x + w + 8, yBot + 8)) return;
    g.save(); g.beginPath(); archPath(g, x, x + w, ys, yBot); g.clip();
    if (door) { const dg = g.createRadialGradient(DOORL.x, DOORL.y, 0, DOORL.x, DOORL.y, 180); dg.addColorStop(0, '#fff4dc'); dg.addColorStop(.5, '#ffc978'); dg.addColorStop(1, '#e8893a'); g.fillStyle = dg; g.fillRect(x, yTop, w, yBot - yTop); g.restore(); }
    else {
      const wg = g.createLinearGradient(0, yTop, 0, yBot); wg.addColorStop(0, '#6a3a1a'); wg.addColorStop(.45, '#d98a3c'); wg.addColorStop(1, '#ffd79a'); g.fillStyle = wg; g.fillRect(x, yTop, w, yBot - yTop);
      for (let i = 0; i < nb; i++) {
        const bx = x + (i + .5) * w / nb - 7, bw = 12 + r() * 4, by = yTop + rr * .6 + r() * 20;
        g.fillStyle = 'rgba(40,18,8,.82)'; g.fillRect(bx, by, bw, yBot - by);
        for (let k = 0; k < 9; k++) { g.fillStyle = r() < .7 ? 'rgba(255,226,170,.9)' : 'rgba(255,150,60,.9)'; g.fillRect(bx + 3 + (k % 2) * 4, by + 10 + k * ((yBot - by - 20) / 9), 2, 2); }
      }
      g.fillStyle = 'rgba(30,12,4,.35)'; g.fillRect(x, yBot - 30, w, 30);
      g.restore();
    }
    g.strokeStyle = 'rgba(14,10,22,.95)'; g.lineWidth = 3; g.beginPath(); archPath(g, x, x + w, ys, yBot); g.stroke();
    if (!door) {
      g.lineWidth = 2; for (let k = 1; k < 4; k++) { const xx = x + k * w / 4; g.beginPath(); g.moveTo(xx, yTop + (k === 2 ? 0 : rr * .3)); g.lineTo(xx, yBot); g.stroke(); }
      for (let yy = ys; yy < yBot; yy += 46) { g.beginPath(); g.moveTo(x, yy); g.lineTo(x + w, yy); g.stroke(); }
      for (let k = 1; k < 6; k++) { const a = Math.PI + k * Math.PI / 6; g.beginPath(); g.moveTo(x + rr, ys); g.lineTo(x + rr + Math.cos(a) * rr, ys + Math.sin(a) * rr); g.stroke(); }
    }
    g.strokeStyle = rgba(AMBER, .35); g.lineWidth = 1.5; g.beginPath(); g.moveTo(x - 3, yBot); g.lineTo(x - 3, ys); g.stroke();
    g.fillStyle = '#4a4f86'; g.fillRect(x - 8, yBot, w + 16, 7); g.fillStyle = 'rgba(255,179,92,.4)'; g.fillRect(x - 8, yBot, w + 16, 2);
  });
  // the forecourt: engraved paving in perspective, leading from the stair foot to the hall (not in the live overlay: it lies on layer A)
  if (opt.forecourt !== false) {
  g.save(); g.beginPath(); g.rect(-400, h.base, 2200, 700); g.clip();
  { const rr = prng(23); g.strokeStyle = rgba('#5a5f98', .22); g.lineCap = 'round';
    for (let k = 0; k < 90; k++) { const y = h.base + 8 + Math.pow(rr(), 1.6) * 260, x = 300 + rr() * 1600, L = 30 + rr() * 120 * (1 + (y - h.base) / 120); g.lineWidth = .8 + (y - h.base) / 200; g.beginPath(); g.moveTo(x, y); g.lineTo(x + L, y + (rr() - .5) * 2); g.stroke(); } }
  const pg2 = g.createRadialGradient(cxH, h.base, 0, cxH, h.base, 900); pg2.addColorStop(0, 'rgba(255,179,92,.22)'); pg2.addColorStop(.5, 'rgba(255,179,92,.06)'); pg2.addColorStop(1, 'rgba(255,179,92,0)'); g.save(); g.translate(0, h.base); g.scale(1, .35); g.translate(0, -h.base); g.fillStyle = pg2; g.fillRect(-400, h.base, 2400, 1400); g.restore();
  g.restore();
  }
  // plinth
  g.fillStyle = '#1a1d40'; g.fillRect(h.x0 - 10, h.base - 14, h.x1 - h.x0 + 20, 16); g.fillStyle = rgba('#9da2d8', .35); g.fillRect(h.x0 - 10, h.base - 14, h.x1 - h.x0 + 20, 2);
  // the outlet where the channel leaves the hall
  const o = G.outlet;
  if (vis(o.x - 30, o.y - 30, o.x + 14, o.y + 32)) {
    g.fillStyle = '#1a0d06'; g.beginPath(); g.ellipse(o.x - 8, o.y + 2, 20, 28, 0, 0, TAU); g.fill();
    const og = g.createRadialGradient(o.x - 8, o.y + 8, 0, o.x - 8, o.y + 8, 28); og.addColorStop(0, 'rgba(255,224,170,.95)'); og.addColorStop(1, 'rgba(255,140,50,0)'); g.fillStyle = og; g.beginPath(); g.ellipse(o.x - 8, o.y + 2, 18, 26, 0, 0, TAU); g.fill();
  }
}
// the great door (world): its opening as a path, the point its light shines from, and its frame + sill drawn over the light
export const DOORL = { x: 1210, y: 751 };   // the light's centre: every point of the opening lies within 152 of it
export function doorPath(g) { const d = G.door; archPath(g, d.x0, d.x1, d.top + (d.x1 - d.x0) / 2, d.bot); }
export function doorFrame(ctx) {
  const d = G.door, w = d.x1 - d.x0, ys = d.top + w / 2;
  ctx.strokeStyle = 'rgba(14,10,22,.95)'; ctx.lineWidth = 3; ctx.beginPath(); archPath(ctx, d.x0, d.x1, ys, d.bot); ctx.stroke();
  ctx.fillStyle = '#4a4f86'; ctx.fillRect(d.x0 - 8, d.bot, w + 16, 7); ctx.fillStyle = 'rgba(255,179,92,.4)'; ctx.fillRect(d.x0 - 8, d.bot, w + 16, 2);
}
// the hall's opaque silhouette (body, side wall, roof wedge, vent tower, plinth, outlet): everything drawHall paints opaque first, so the
// live overlay inside it repaints layer A's hall pixel for pixel (only sharper) and never doubles a translucent stroke outside it
function hallSilhouette(g) {
  const h = G.hall, cxH = (h.x0 + h.x1) / 2, o = G.outlet;
  g.beginPath();
  g.moveTo(h.x0, h.base); g.lineTo(h.x0, h.top); g.lineTo(cxH, h.peak); g.lineTo(h.x1, h.top); g.lineTo(h.x1, h.base); g.closePath();
  g.moveTo(h.x1, h.top); g.lineTo(h.side, h.top + 22); g.lineTo(h.side, h.base - 4); g.lineTo(h.x1, h.base); g.closePath();
  g.moveTo(cxH, h.peak); g.lineTo(cxH + 70, h.peak + 4); g.lineTo(h.side + 8, h.top + 16); g.lineTo(h.x1 + 16, h.top - 4); g.closePath();
  g.rect(860, 140, 60, 310); g.rect(852, 128, 76, 20); g.rect(h.x0 - 10, h.base - 14, h.x1 - h.x0 + 20, 16);
  g.moveTo(o.x - 8 + 20, o.y + 2); g.ellipse(o.x - 8, o.y + 2, 20, 28, 0, 0, TAU);
}
// the works hall for the camera close to it (3.01 starts at scale 13 in its door): cached raster levels at k = 1.5, 3, 6 and 12.2 px per
// world unit, clipped to the hall's silhouette (no stipple), drawn over layer A whenever the hall is in view. Each level covers the views
// the pull-back passes at its scales; drawWorld picks the sharpest one that covers the view (the switch at k = s is invisible).
const HALL_BOX = [705, 125, 1785, 910];
const HALL_LV = [{ k: 1.5, r: HALL_BOX }, { k: 3, r: HALL_BOX }, { k: 6, r: [800, 505, 1460, 885] }, { k: 12.2, r: [1015, 636, 1345, 826] }];
function hallLevel(i) {
  return once('c03hall' + i, () => {
    const { k, r } = HALL_LV[i], [c, g] = canvas(Math.ceil((r[2] - r[0]) * k), Math.ceil((r[3] - r[1]) * k));
    g.setTransform(k, 0, 0, k, -r[0] * k, -r[1] * k); hallSilhouette(g); g.clip('nonzero'); drawHall(g, { forecourt: false, view: r });
    return { c: toImg(c), x0: r[0], y0: r[1], k, r };
  });
}
function hallPick(cam) {
  const hw = W / 2 / cam.s, hh = H / 2 / cam.s, v = [Math.max(cam.cx - hw, HALL_BOX[0]), Math.max(cam.cy - hh, HALL_BOX[1]), Math.min(cam.cx + hw, HALL_BOX[2]), Math.min(cam.cy + hh, HALL_BOX[3])];
  if (v[0] >= v[2] || v[1] >= v[3]) return null;   // the hall is not in view
  let best = null;
  for (let i = 0; i < HALL_LV.length; i++) { const L = HALL_LV[i]; if (v[0] < L.r[0] || v[1] < L.r[1] || v[2] > L.r[2] || v[3] > L.r[3]) continue; best = i; if (L.k >= cam.s * .98) break; }
  return best == null ? null : hallLevel(best);
}
// the aqueduct: two tiers, piers down into the valley; the last pier ends at AQ1 with a broken stub of the next arch
function aqPiers() {
  const P = []; let x = AQ1;
  while (x > AQ0 + 40) { const q = aq(x), span = mix(250, 170, q), pw = span * .24; P.unshift({ x: x - pw, pw, span }); x -= pw + span; }
  P[0].x = AQ0; P[0].pw = Math.max(20, P[1].x - P[0].span - AQ0);
  return P;
}
function drawAqueduct(g, xa, xb, k) {
  const [c, a] = canvas(Math.ceil((xb - xa) * k), Math.ceil(1700 * k)); a.setTransform(k, 0, 0, k, -xa * k, 0);
  const n = vnoise(77), END = AQ1 + 70, tier = (x) => G.top(x) + mix(118, 84, aq(x));
  const brk = (y) => END + (fbm(n, y * .05, 2.1, 3) - .5) * 44 - Math.max(0, y - tier(AQ1)) * .9;
  a.beginPath(); a.moveTo(AQ0, G.top(AQ0));
  for (let x = AQ0; x <= END - 30; x += 8) a.lineTo(x, G.top(x));
  for (let y = G.top(AQ1); y <= tier(AQ1) + 40; y += 5) a.lineTo(brk(y), y);
  a.lineTo(AQ1, tier(AQ1) + 70); a.lineTo(AQ1, VALLEY); a.lineTo(AQ0, VALLEY); a.closePath();
  const bg = a.createLinearGradient(0, 460, 0, 1200); bg.addColorStop(0, '#4b5188'); bg.addColorStop(.12, STONE_L); bg.addColorStop(.5, STONE); bg.addColorStop(1, '#14173a'); a.fillStyle = bg; a.fill();
  a.save(); a.clip();
  // stone courses (follow the slope of the top)
  a.strokeStyle = rgba('#0b0d26', .45); a.lineWidth = 1;
  for (let i = 1; i < 40; i++) { a.beginPath(); for (let x = AQ0; x <= END; x += 20) { const y = G.top(x) + i * mix(17, 12, aq(x)); x === AQ0 ? a.moveTo(x, y) : a.lineTo(x, y); } a.stroke(); }
  // tier cornices
  for (const yy of [(x) => G.top(x) + 16, tier]) { a.strokeStyle = rgba('#0b0d26', .85); a.lineWidth = 3; a.beginPath(); for (let x = AQ0; x <= END; x += 20) a.lineTo(x, yy(x)); a.stroke(); a.strokeStyle = rgba('#8c90c4', .35); a.lineWidth = 1.5; a.beginPath(); for (let x = AQ0; x <= END; x += 20) a.lineTo(x, yy(x) - 3); a.stroke(); }
  a.fillStyle = rgba('#a3a8dc', .55); a.beginPath(); for (let x = AQ0; x <= END; x += 20) a.lineTo(x, G.top(x)); for (let x = END; x >= AQ0; x -= 20) a.lineTo(x, G.top(x) + 6); a.closePath(); a.fill();
  a.strokeStyle = rgba(AMBER, .4); a.lineWidth = 3; a.beginPath(); for (let x = AQ0; x <= END; x += 20) a.lineTo(x, G.top(x) + 1); a.stroke();
  for (let x = AQ0; x <= END; x += 40) { const y = G.top(x), wg = a.createLinearGradient(0, y, 0, y + 90); wg.addColorStop(0, 'rgba(255,179,92,.2)'); wg.addColorStop(1, 'rgba(255,179,92,0)'); a.fillStyle = wg; a.fillRect(x, y, 41, 90); }
  hatch(a, [AQ0, 460, END - AQ0, 1100], { angle: -.9, gap: 6, col: '#05061a', a: .26, seed: 21, broken: .35 });
  a.restore();
  const P = aqPiers();
  const cut = (x0, x1, ys, bot, face, seed, rings = true) => {
    const xm = (x0 + x1) / 2, rr = (x1 - x0) / 2;
    a.save(); a.globalCompositeOperation = 'destination-out'; a.beginPath(); archPath(a, x0, x1, ys, bot); a.fillStyle = '#000'; a.fill(); a.restore();
    // the inner face of the right pier and the soffit (we look slightly from the left)
    const fw = rr * face;
    a.save(); a.beginPath(); archPath(a, x0, x1, ys, bot); a.clip();
    a.fillStyle = '#1b1e42'; a.beginPath(); a.moveTo(x1, bot); a.lineTo(x1, ys); a.arc(xm, ys, rr, 0, -Math.PI * .5, true); a.lineTo(xm, ys - rr + fw * .5); a.arc(xm - fw * .25, ys + 3, rr - fw * .75, -Math.PI * .5, 0); a.lineTo(x1 - fw, bot); a.closePath(); a.fill();
    hatch(a, [x1 - fw - 10, ys - rr, fw + 14, bot - ys + rr], { angle: -1.35, gap: 4, col: '#000', a: .4, seed });
    a.restore();
    if (rings) { a.strokeStyle = rgba('#0b0d26', .7); a.lineWidth = 1.1; for (let v = 0; v <= 11; v++) { const an = Math.PI + v * Math.PI / 11; a.beginPath(); a.moveTo(xm + Math.cos(an) * rr, ys + Math.sin(an) * rr); a.lineTo(xm + Math.cos(an) * (rr + 16), ys + Math.sin(an) * (rr + 16)); a.stroke(); }
      a.strokeStyle = rgba('#8c90c4', .45); a.lineWidth = 1.5; a.beginPath(); a.arc(xm, ys, rr + 1, Math.PI * 1.02, Math.PI * 1.55); a.stroke(); }
  };
  for (let i = 0; i < P.length; i++) {
    const L = P[i], x0 = L.x + L.pw, x1 = i + 1 < P.length ? P[i + 1].x : AQ1 + 999; if (x1 > AQ1) continue;
    const xm = (x0 + x1) / 2, ty = tier(xm);
    // lower tier: tall arches into the valley
    cut(x0, x1, ty + 26 + (x1 - x0) / 2, VALLEY + 40, .3, 30 + i);
    // upper tier: three small arches per bay
    const sw = (L.pw + x1 - x0) / 3, top = G.top(xm) + 22;
    for (let j = 0; j < 3; j++) { const u0 = L.x + j * sw + sw * .18, u1 = L.x + (j + 1) * sw - sw * .06, rr = (u1 - u0) / 2; cut(u0, u1, top + rr + 8, ty - 6, .28, 60 + i * 3 + j, false); }
  }
  // the broken stub beyond the last pier: a torn half arch, loose blocks
  const r = prng(5);
  a.fillStyle = '#353a70'; a.strokeStyle = rgba('#0b0d26', .8); a.lineWidth = 1.2;
  for (let i = 0; i < 7; i++) { const y = G.top(AQ1) + 8 + i * 22 + r() * 8, x = brk(y) - 8 - r() * 12, w = 14 + r() * 12, hh = 10 + r() * 8; a.save(); a.translate(x, y); a.rotate((r() - .5) * .5); a.fillRect(-w / 2, -hh / 2, w, hh); a.strokeRect(-w / 2, -hh / 2, w, hh); a.restore(); }
  a.strokeStyle = rgba(AMBER, .3); a.lineWidth = 2; a.beginPath(); for (let y = G.top(AQ1); y < G.top(AQ1) + 60; y += 5) a.lineTo(brk(y) + 2, y); a.stroke();
  a.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .35, g: 1, seed: 8, mid: false, boost: 1.1 });
  return c;
}

function drawLand(g, xa, xb) {
  const n = vnoise(9);
  // terrace of the hall (left) and the plateau of the house (right); the valley between lies in fog
  const mass = (x0, x1) => { g.beginPath(); g.moveTo(x0, 1700); for (let x = x0; x <= x1; x += 6) g.lineTo(x, ground(x)); g.lineTo(x1, 1700); g.closePath(); };
  for (const [x0, x1] of [[Math.max(xa, -600), Math.min(xb, 2000)], [Math.max(xa, CLIFF - 60), xb]]) {
    if (x1 <= x0) continue;
    mass(x0, x1); const lg = g.createLinearGradient(0, 700, 0, 1200); lg.addColorStop(0, '#22265a'); lg.addColorStop(.35, '#141739'); lg.addColorStop(1, '#080a1c'); g.fillStyle = lg; g.fill();
    g.save(); g.clip();
    g.strokeStyle = rgba('#4a4f86', .35); g.lineWidth = .8;
    for (let i = 0; i < 40; i++) { g.beginPath(); let on = false; for (let x = x0; x <= x1; x += 12) { const gy = ground(x); if (gy > 1400) { on = false; continue; } const yy = gy + 8 + i * i * .45 + (n(x * .01, i) - .5) * 6; on ? g.lineTo(x, yy) : g.moveTo(x, yy); on = true; } g.stroke(); }
    hatch(g, [x0, 700, x1 - x0, 900], { angle: -1.1, gap: 5, col: '#000', a: .25, seed: 41 + x0, broken: .4 });
    g.restore();
  }
  // the cliff faces (terrace edge falling into the valley; the plateau's cliff rising from it)
  if (xb > 1780 && xa < 2100) { g.fillStyle = '#10122e'; g.beginPath(); g.moveTo(1800, 906); for (let y = 906; y < 1700; y += 10) g.lineTo(1810 + (y - 906) * .2 + (n(y * .03, 3) - .5) * 20, y); g.lineTo(1700, 1700); g.closePath(); g.fill(); }
  if (xb > CLIFF - 80 && xa < CLIFF + 200) {
    g.fillStyle = '#151838'; g.beginPath(); g.moveTo(CLIFF + 60, 727); for (let y = 727; y < 1700; y += 10) g.lineTo(CLIFF - (y - 727) * .08 + (n(y * .03, 7) - .5) * 22, y); g.lineTo(CLIFF + 200, 1700); g.closePath(); g.fill();
    g.save(); g.clip(); hatch(g, [CLIFF - 120, 720, 340, 980], { angle: -1.3, gap: 4, col: '#000', a: .45, seed: 66 }); g.restore();
    g.strokeStyle = rgba('#9da2d8', .45); g.lineWidth = 1.5; g.beginPath(); g.moveTo(CLIFF + 2, 727); g.lineTo(CLIFF + 260, 730); g.stroke();
  }
}

function drawHouse(g) {
  const h = G.house, w = G.win, cx = (h.x0 + h.x1) / 2;
  // the stub of channel on this side: it leads into the house
  const sx0 = CLIFF - 4;
  g.fillStyle = '#23274f'; g.fillRect(sx0 + 8, 626, 36, h.base - 626);
  g.save(); g.beginPath(); g.rect(sx0 + 8, 626, 36, h.base - 626); g.clip(); hatch(g, [sx0, 620, 60, 120], { angle: -1.2, gap: 3.5, col: '#000', a: .4, seed: 3 }); g.restore();
  const sg = g.createLinearGradient(0, 598, 0, 628); sg.addColorStop(0, '#4b5188'); sg.addColorStop(1, '#262a55'); g.fillStyle = sg; g.fillRect(sx0, 598, h.x0 - sx0 + 2, 30);
  g.fillStyle = rgba('#a3a8dc', .55); g.fillRect(sx0, 598, h.x0 - sx0 + 2, 4);
  g.strokeStyle = rgba('#0b0d26', .8); g.lineWidth = 1.5; g.strokeRect(sx0, 598, h.x0 - sx0 + 2, 30);
  g.fillStyle = '#262a55'; g.beginPath(); g.moveTo(sx0, 598); g.lineTo(sx0 - 12, 604); g.lineTo(sx0 - 6, 612); g.lineTo(sx0 - 14, 621); g.lineTo(sx0, 628); g.closePath(); g.fill();
  // chimney
  g.fillStyle = '#191c3c'; g.fillRect(h.x1 - 72, h.ridge + 10, 28, 72); g.fillStyle = '#2b2f5c'; g.fillRect(h.x1 - 76, h.ridge + 3, 36, 10);
  // walls: stone cottage
  const wall = () => { g.beginPath(); g.moveTo(h.x0, h.base); g.lineTo(h.x0, h.eave); g.lineTo(h.x1, h.eave); g.lineTo(h.x1, h.base); g.closePath(); };
  wall(); const wg = g.createLinearGradient(h.x0, 0, h.x1, 0); wg.addColorStop(0, '#363b70'); wg.addColorStop(1, '#22264f'); g.fillStyle = wg; g.fill();
  g.save(); wall(); g.clip();
  const r = prng(44); g.strokeStyle = rgba('#0b0d26', .5); g.lineWidth = .9;
  for (let y = h.eave + 4, row = 0; y < h.base; y += 13, row++) { g.beginPath(); g.moveTo(h.x0, y); g.lineTo(h.x1, y); g.stroke(); for (let x = h.x0 + (row % 2) * 14; x < h.x1; x += 22 + r() * 10) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 13); g.stroke(); } }
  hatch(g, [h.x0, h.eave, h.x1 - h.x0, h.base - h.eave], { angle: -.8, gap: 3.5, w: .6, col: '#05061a', a: .28, seed: 41 });
  const lg = g.createRadialGradient(w.x, w.y, 0, w.x, w.y, 130); lg.addColorStop(0, 'rgba(255,179,92,.16)'); lg.addColorStop(1, 'rgba(255,179,92,0)'); g.fillStyle = lg; g.fillRect(h.x0, h.eave, h.x1 - h.x0, h.base - h.eave);
  g.restore();
  // roof: tiles in engraved rows
  const roof = () => { g.beginPath(); g.moveTo(h.x0 - 20, h.eave + 6); g.lineTo(cx, h.ridge); g.lineTo(h.x1 + 20, h.eave + 6); g.closePath(); };
  roof(); g.fillStyle = '#15183a'; g.fill();
  g.save(); roof(); g.clip(); g.strokeStyle = rgba('#4a4f86', .55); g.lineWidth = .8;
  for (let y = h.ridge + 8; y < h.eave + 8; y += 8) { g.beginPath(); g.moveTo(h.x0 - 30, y); g.lineTo(h.x1 + 30, y); g.stroke(); for (let x = h.x0 - 30 + ((y / 8) % 2) * 6; x < h.x1 + 30; x += 12) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 8); g.stroke(); } }
  hatch(g, [h.x0 - 20, h.ridge, h.x1 - h.x0 + 40, h.eave - h.ridge + 10], { angle: -.6, gap: 3, w: .6, col: '#000', a: .35, seed: 47 });
  g.restore();
  g.strokeStyle = rgba('#a3a8dc', .6); g.lineWidth = 1.8; g.beginPath(); g.moveTo(h.x0 - 20, h.eave + 6); g.lineTo(cx, h.ridge); g.lineTo(h.x1 + 20, h.eave + 6); g.stroke();
  // window surround and shutters (the glass is live)
  const x = w.x - w.w / 2, y = w.y - w.h / 2;
  g.fillStyle = '#4a4f86'; g.fillRect(x - 8, y - 8, w.w + 16, w.h + 16);
  for (const sxx of [x - 8 - 22, x + w.w + 8]) { g.fillStyle = '#2b2f5c'; g.fillRect(sxx, y - 6, 22, w.h + 12); g.strokeStyle = rgba('#0b0d26', .7); g.lineWidth = 1; for (let yy = y - 2; yy < y + w.h + 6; yy += 6) { g.beginPath(); g.moveTo(sxx + 3, yy); g.lineTo(sxx + 19, yy); g.stroke(); } g.strokeRect(sxx, y - 6, 22, w.h + 12); }
  g.fillStyle = '#5a5f98'; g.fillRect(x - 12, y + w.h + 6, w.w + 24, 6);
}

function buildMain(xa, xb, k, key, y0 = -900, hh = 2500) {
  return once(key, () => {
    const [c, g] = canvas(Math.ceil((xb - xa) * k), Math.ceil(hh * k));
    g.setTransform(k, 0, 0, k, -xa * k, -y0 * k);
    drawLand(g, xa, xb);
    if (xa < 1800) { drawHall(g); drawStairs(g); }
    if (xb > AQ0 && xa < AQ1 + 100) { const x0 = Math.max(xa, AQ0 - 10), x1 = Math.min(xb, AQ1 + 120), A = drawAqueduct(g, x0, x1, k); g.save(); g.setTransform(1, 0, 0, 1, (x0 - xa) * k, (0 - y0) * k); g.drawImage(A, 0, 0); g.restore(); }
    if (xb > 4400) drawHouse(g);
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .3, g: 1, seed: 3, mid: false, boost: 1.05 });
    return { c: toImg(c), x0: xa, y0, k };
  });
}

// ---------------------------------------------------------------- sky, hills, fog
function buildSky() {
  return once('c03sky', () => {
    const [c, g] = canvas(W, H), sg = g.createLinearGradient(0, 0, 0, H);
    sg.addColorStop(0, '#060820'); sg.addColorStop(.4, '#10153d'); sg.addColorStop(.7, '#242a62'); sg.addColorStop(1, '#3a3672'); g.fillStyle = sg; g.fillRect(0, 0, W, H);
    const wg = g.createRadialGradient(W * .55, H * 1.05, 0, W * .55, H * 1.05, W * .75); wg.addColorStop(0, 'rgba(150,110,160,.25)'); wg.addColorStop(1, 'rgba(150,110,160,0)'); g.fillStyle = wg; g.fillRect(0, 0, W, H);
    rosette(g, W * .72, -H * .3, { R: 950, A: 60, B: 30, n: 34, m: 11, lines: 40, col: '#9aa3e0', w: .6, a: .05 });
    stipple(c, { k: .5, g: 1, seed: 2, mid: false, boost: 1 });
    return toImg(c);
  });
}
function ridgeY(n, x, base, amp, f, seed) { return base - amp * fbm(n, x * f, seed * .1, 4); }
function buildHills(key, x0, x1, draw) { return once(key, () => { const [c, g] = canvas(x1 - x0, 1500); g.translate(-x0, 0); draw(g); g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .5, g: 1, seed: 6, mid: false, boost: 1 }); return { c: toImg(c), x0, y0: 0, k: 1 }; }); }
const farHills = () => buildHills('c03far', -900, 3600, (g) => {
  const n = vnoise(3), Y = (x) => ridgeY(n, x, 760, 230, .0015, 3);
  g.beginPath(); g.moveTo(-900, 1500); for (let x = -900; x <= 3600; x += 8) g.lineTo(x, Y(x)); g.lineTo(3600, 1500); g.closePath();
  const fg = g.createLinearGradient(0, 520, 0, 900); fg.addColorStop(0, '#2c3168'); fg.addColorStop(1, '#1d2150'); g.fillStyle = fg; g.fill();
  const m = vnoise(4); g.strokeStyle = rgba('#7a80bc', .22); g.lineWidth = .8;
  for (let i = 0; i < 30; i++) { g.beginPath(); for (let x = -900; x <= 3600; x += 14) { const y = Y(x) + 5 + i * 9 + (m(x * .01, i) - .5) * 4; x === -900 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
});
const midHills = () => buildHills('c03mid', -900, 5200, (g) => {
  const n = vnoise(7), Y = (x) => ridgeY(n, x, 860, 170, .0022, 7);
  g.beginPath(); g.moveTo(-900, 1500); for (let x = -900; x <= 5200; x += 8) g.lineTo(x, Y(x)); g.lineTo(5200, 1500); g.closePath(); g.fillStyle = '#1a1d47'; g.fill();
  const r = prng(12);
  for (let x = -880; x < 5180; x += 16 + r() * 54) { const y = Y(x) + 4, h = 14 + r() * 28; g.fillStyle = '#15183e'; g.beginPath(); g.moveTo(x - h * .28, y); g.lineTo(x, y - h); g.lineTo(x + h * .28, y); g.closePath(); g.fill(); }
  g.strokeStyle = rgba('#5a5f98', .22); g.lineWidth = .8;
  for (let i = 0; i < 34; i++) { g.beginPath(); for (let x = -900; x <= 5200; x += 14) { const y = Y(x) + 10 + i * 10; x === -900 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
});
// valley mist: a soft fbm band, low res (scaled ×4 when drawn), world coordinates x 1500…5200, y top…top+h
function mistLayer(key, seed, x0, x1, yTop, h, col, a, cover = .5) {
  return once(key, () => {
    const q = 4, w = Math.ceil((x1 - x0) / q), hh = Math.ceil(h / q), [c, g] = canvas(w, hh), d = g.createImageData(w, hh), p = d.data, n = vnoise(seed);
    const N = parseInt(col.slice(1), 16), R = N >> 16, Gc = (N >> 8) & 255, B = N & 255;
    for (let j = 0; j < hh; j++) { const v = j / hh, band = Math.pow(clamp(v / .35), 1.5) * clamp((1 - v) / .15 + .3);
      for (let i = 0; i < w; i++) { const f = fbm(n, i * q * .0022, j * q * .009, 5), dens = clamp((f - (1 - cover)) / .35) * band; const o = (j * w + i) * 4; p[o] = R; p[o + 1] = Gc; p[o + 2] = B; p[o + 3] = 255 * a * clamp(dens + band * .35); } }
    g.putImageData(d, 0, 0);
    return { c: toImg(c), x0, y0: yTop, k: 1 / q };
  });
}
export function worldLayers() {
  return { A: buildMain(-500, 3960, 1, 'c03A', -560, 2260), B: buildMain(3820, 5400, 2.4, 'c03B', 300, 1400), far: farHills(), mid: midHills(), sky: buildSky(),
    mistBack: mistLayer('c03mistB', 5, 1300, 5600, 700, 360, '#6f78bb', .55, .55), mistFront: mistLayer('c03mistF', 11, 1830, 5400, 860, 700, '#8a92d0', .75, .5) };
}
const STARS = (() => { const r = prng(91), out = []; for (let i = 0; i < 300; i++) out.push([r() * 2400 - 240, r() * 640, r(), r()]); return out; })();

// o.live: the hall is drawn from its sharp levels (hallPick) over layer A; when the frame shows nothing but the facade (the view lies
// inside the facade body, which every level paints opaque) the far layers and layer A are skipped
export function drawWorld(ctx, cam, t, o = {}) {
  const L = worldLayers(), live = !!o.live, h = G.hall, hw = W / 2 / cam.s, hh = H / 2 / cam.s;
  const inside = live && cam.cx - hw > h.x0 + 1 && cam.cx + hw < h.x1 - 1 && cam.cy - hh > h.top + 1 && cam.cy + hh < h.base - 15;
  ctx.save();
  if (inside) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = STONE; ctx.fillRect(0, 0, W, H); }
  else {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(best(L.sky), 0, 0);
    const sx = -(cam.cx - REF[0]) * .03, sy = -(cam.cy - REF[1]) * .03;
    ctx.globalCompositeOperation = 'lighter';
    for (const [x, y, b, ph] of STARS) { const tw = .55 + .45 * Math.sin(t * (1 + ph * 2) + ph * 20), X = ((x + sx) % 2400 + 2400) % 2400 - 240; ctx.fillStyle = `rgba(220,226,255,${(.1 + .5 * b * b) * tw})`; const z = b > .93 ? 2.2 : 1.3; ctx.fillRect(X, y + sy, z, z); }
    ctx.globalCompositeOperation = 'source-over';
    put(ctx, cam, L.far, .25);
    ctx.globalAlpha = .9; put(ctx, cam, L.mistBack, .45, Math.sin(t * .11) * 60 - t * 6); ctx.globalAlpha = 1;
    put(ctx, cam, L.mid, .55);
    put(ctx, cam, L.A, 1);
  }
  if (live) { const lv = hallPick(cam); if (lv) put(ctx, cam, lv, 1); }
  if (cam.cx + 960 / cam.s > 3820) put(ctx, cam, L.B, 1);
  ctx.restore();
}
// every cache of this world, built once and decoded to Images (await in the scene's default export); then the Canvas copies are dropped
let WARM = null;
export function warmWorld(sealR = [210]) {
  if (WARM) return WARM;
  WARM = (async () => {
    const L = worldLayers(), [, g] = canvas(64, 64);
    for (let i = 0; i < 14; i++) slabLayer(i);
    nightTree(g, 0, 0, 1, 0); for (const r of sealR) ifSeal(g, 0, 0, r, 0); bridgeLines();
    for (let i = 0; i < HALL_LV.length; i++) hallLevel(i);
    await ready();
    for (const v of Object.values(L)) if (v && v.c) v.c = best(v.c);
    for (const [k, v] of CACHE) { if (isCanvas(v) && REC.has(v)) CACHE.set(k, best(v)); else if (v && v.c && REC.has(v.c)) v.c = best(v.c); }
  })();
  return WARM;
}
export function drawValleyFog(ctx, cam, t) {
  const L = worldLayers(); ctx.save(); ctx.globalAlpha = .95; put(ctx, cam, L.mistFront, 1, t * 9 - 40); ctx.restore();
}

// ---------------------------------------------------------------- live bits (world transform set)
export function drawLive(ctx, t, cam) {
  const vis = (x0, x1) => x1 > cam.cx - 980 / cam.s && x0 < cam.cx + 980 / cam.s;
  if (vis(700, 1900)) {
    for (let i = 0; i < 14; i++) {   // steam from the vent, lit warm from below
      const ph = ((t * .16 + i / 14) % 1), x = 890 + Math.sin(ph * 5 + i) * 18 + ph * 150, y = 128 - ph * 420, rad = 18 + ph * 74, a = .12 * Math.sin(Math.PI * ph);
      const g = ctx.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, `rgba(205,195,232,${a})`); g.addColorStop(1, 'rgba(205,195,232,0)'); ctx.fillStyle = g; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
    const br = .85 + .15 * Math.sin(t * 1.7);
    ctx.save(); ctx.translate(1210, 918); ctx.scale(1, .15); addGlow(ctx, 0, 0, 700, .3 * br, AMBER, '#ffd9a0'); ctx.restore();
    addGlow(ctx, G.outlet.x - 8, G.outlet.y + 4, 90, .35 * br, AMBER, CORE);
  }
  if (vis(4500, 5100)) {
    const h = G.house;
    for (let i = 0; i < 10; i++) {   // chimney smoke
      const ph = ((t * .12 + i / 10) % 1), x = h.x1 - 58 + ph * 80 + Math.sin(ph * 4 + i) * 9, y = h.ridge - ph * 190, rad = 7 + ph * 30, a = .16 * Math.sin(Math.PI * ph);
      const g = ctx.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, `rgba(175,175,215,${a})`); g.addColorStop(1, 'rgba(175,175,215,0)'); ctx.fillStyle = g; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
    nightTree(ctx, 4930, 736, 1, t);
  }
}
// a night tree beside the house: dark engraved crown, a cool rim, swaying (cached sprite)
function nightTree(ctx, x, y, s, t) {
  const S = once('c03tree', () => {
    const w = 260, h = 330, [c, g] = canvas(w * 2, h * 2); g.scale(2, 2); const r = prng(8);
    g.fillStyle = '#0d0f26'; g.beginPath(); g.moveTo(w / 2 - 6, h); g.lineTo(w / 2 - 3, h * .45); g.lineTo(w / 2 + 3, h * .45); g.lineTo(w / 2 + 7, h); g.closePath(); g.fill();
    // branches, then many small leaf tufts (irregular, in three tones), so the crown reads as foliage, not balls
    g.strokeStyle = '#0d0f26'; g.lineCap = 'round';
    for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .32, L = 70 + r() * 40; g.lineWidth = 4 - i * .3; g.beginPath(); g.moveTo(w / 2, h * .62); g.quadraticCurveTo(w / 2 + Math.cos(a) * L * .5, h * .62 + Math.sin(a) * L * .6, w / 2 + Math.cos(a) * L, h * .5 + Math.sin(a) * L * .8); g.stroke(); }
    const n = vnoise(6);
    for (let pass = 0; pass < 3; pass++) for (let i = 0; i < 150; i++) {
      const a = r() * TAU, d = Math.pow(r(), .6) * 96, bx = w / 2 + Math.cos(a) * d * 1.08, by = h * .37 + Math.sin(a) * d * .78 + (pass - 1) * 6, br = 7 + r() * 9;
      const lit = clamp(.5 - (bx - w / 2) / 220 - (by - h * .37) / 180 + (r() - .5) * .3);
      if (pass === 2 && lit < .55) continue;
      g.fillStyle = pass === 0 ? '#0c0e26' : pass === 1 ? (lit > .5 ? '#1f2452' : '#141838') : '#2a2f62';
      g.beginPath(); for (let k = 0; k <= 9; k++) { const q = k / 9 * TAU, rr = br * (.7 + .5 * n(bx * .1 + Math.cos(q) * 2, by * .1 + Math.sin(q) * 2)); g.lineTo(bx + Math.cos(q) * rr, by + Math.sin(q) * rr * .8); } g.closePath(); g.fill();
    }
    g.globalCompositeOperation = 'source-atop'; hatch(g, [0, 0, w, h], { angle: -.7, gap: 3, w: .6, col: '#000', a: .35, seed: 5 });
    g.globalCompositeOperation = 'source-over'; g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .5, g: 1, seed: 4, mid: false, boost: 1.1 });
    return { c: toImg(c), w, h };
  });
  ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * .9) * .012 + Math.sin(t * 2.3) * .004); ctx.scale(s / 2, s / 2); ctx.drawImage(best(S.c), -S.w, -S.h * 2); ctx.restore();
}
export function drawWindow(ctx, t, warm) {
  const w = G.win, x = w.x - w.w / 2, y = w.y - w.h / 2, fl = 1 + .04 * Math.sin(t * 7.1) * Math.sin(t * 3.3);
  const lg = ctx.createLinearGradient(0, y, 0, y + w.h);
  lg.addColorStop(0, mixc('#5a4038', '#ffcf8a', warm)); lg.addColorStop(1, mixc('#9a7450', '#fff1d6', warm));
  ctx.fillStyle = lg; ctx.fillRect(x, y, w.w, w.h);
  ctx.strokeStyle = '#0d0f26'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(w.x, y); ctx.lineTo(w.x, y + w.h); ctx.moveTo(x, w.y - 4); ctx.lineTo(x + w.w, w.y - 4); ctx.stroke();
  ctx.lineWidth = 3; ctx.strokeRect(x, y, w.w, w.h);
  addGlow(ctx, w.x, w.y, mix(46, 170, warm) * fl, mix(.16, .6, warm), AMBER, CORE);
  if (warm > 0) { ctx.save(); ctx.translate(w.x, G.house.base + 8); ctx.scale(1, .2); addGlow(ctx, 0, 0, 200, .35 * warm, AMBER, '#ffd9a0'); ctx.restore(); }
}
const mixc = (a, b, k) => { const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16), f = (s) => Math.round(mix((pa >> s) & 255, (pb >> s) & 255, clamp(k))); return `rgb(${f(16)},${f(8)},${f(0)})`; };

// ---------------------------------------------------------------- the bridge across the gap
const BX0 = AQ1 - 4, BX1 = CLIFF + 2, DECK = 600, DECKB = 630, CROWN = 652, SPRING = 800;
const ell = (rx0, rx1, crown, spring, n = 120) => { const out = [], xm = (rx0 + rx1) / 2, rx = (rx1 - rx0) / 2, ry = spring - crown; for (let i = 0; i <= n; i++) { const a = Math.PI + i / n * Math.PI; out.push([xm + Math.cos(a) * rx, spring + Math.sin(a) * ry]); } return out; };
export function bridgeLines() {
  return once('c03bridge', () => {
    const arch = ell(BX0 + 10, BX1 - 10, CROWN, SPRING), ring = ell(BX0 - 6, BX1 + 6, CROWN - 20, SPRING + 2);
    const deck = [[BX0, DECK], [BX1, DECK]], deckB = [[BX0, DECKB], [BX1, DECKB]];
    const vous = []; for (let i = 1; i < 18; i++) { const k = Math.round(i / 18 * 120); vous.push([arch[k], ring[k]]); }
    const spand = []; for (let i = 0; i < 11; i++) { const x = mix(BX0 + 16, BX1 - 16, i / 10), q = clamp((x - (BX0 - 6)) / (BX1 - BX0 + 12)), y1 = CROWN - 20 + (SPRING + 2 - CROWN + 20) * (1 - Math.sin(Math.acos(clamp(1 - 2 * q, -1, 1)))); if (y1 - DECKB > 12) spand.push([[x, DECKB + 2], [x, y1 - 2]]); }
    return { arch, ring, deck, deckB, vous, spand };
  });
}
// xFront: the stone exists only left of this x (it is cut out of the dark behind the burin); null = the whole bridge
export function bridgeFill(ctx, a, xFront = null) {
  if (a <= 0) return; const B = bridgeLines();
  ctx.save(); ctx.globalAlpha = a;
  if (xFront != null) { if (xFront <= BX0) { ctx.restore(); return; } ctx.beginPath(); ctx.rect(BX0 - 20, DECK - 20, xFront - BX0 + 20, SPRING - DECK + 60); ctx.clip(); }
  ctx.beginPath(); ctx.moveTo(BX0, DECK); ctx.lineTo(BX1, DECK); ctx.lineTo(BX1, SPRING + 6);
  for (let i = B.arch.length - 1; i >= 0; i--) ctx.lineTo(B.arch[i][0], B.arch[i][1]); ctx.lineTo(BX0, SPRING + 6); ctx.closePath();
  const g = ctx.createLinearGradient(0, DECK, 0, SPRING); g.addColorStop(0, '#5d639e'); g.addColorStop(.15, '#474d86'); g.addColorStop(.6, STONE); g.addColorStop(1, '#202451'); ctx.fillStyle = g; ctx.fill();
  ctx.clip();
  ctx.strokeStyle = rgba('#0b0d26', .45); ctx.lineWidth = 1; for (let y = DECKB + 12; y < SPRING; y += 13) { ctx.beginPath(); ctx.moveTo(BX0, y); ctx.lineTo(BX1, y); ctx.stroke(); }
  hatch(ctx, [BX0, DECK, BX1 - BX0, SPRING - DECK + 20], { angle: -.9, gap: 5, col: '#05061a', a: .28, seed: 71 });
  const wg = ctx.createLinearGradient(0, DECK, 0, DECK + 90); wg.addColorStop(0, 'rgba(255,179,92,.22)'); wg.addColorStop(1, 'rgba(255,179,92,0)'); ctx.fillStyle = wg; ctx.fillRect(BX0, DECK, BX1 - BX0, 90);
  ctx.fillStyle = rgba('#a3a8dc', .6); ctx.fillRect(BX0, DECK, BX1 - BX0, 4);
  ctx.fillStyle = 'rgba(11,13,38,.85)'; ctx.fillRect(BX0, DECKB - 2, BX1 - BX0, 3);
  ctx.restore();
}
export const BRIDGE = { x0: BX0, x1: BX1, deck: DECK };
