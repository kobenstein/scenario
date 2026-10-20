// K0 round-3 reference frames: the "Wertpapier-Sprache" helpers in use (shots.md v2 §1). Each export is a pure draw(ctx, t, o).
// Rendered by tools/k0_stills.mjs (ghost-*, perforate-*, micro-*, kids-*, feet-*). Read these as usage examples.
import { W, H, rgba, clamp, mix, prng, canvas, sm, eout, lin, text } from '../../engine.mjs';
import { certificate, rosette, microPath, microRing, resample, seal } from '../../lib/certificate.mjs';
import { ghostLine, burinTip } from '../../lib/ghost.mjs';
import { perforateText, perforation, tearAway } from '../../lib/perforate.mjs';
import { worldMap, region, project, country } from '../../lib/map.mjs';
import { fibreFill } from '../../lib/print.mjs';
import { stipple, vnoise } from '../../lib/art.mjs';
import { figure, figureKid, POSES, KIDPOSES, cradleProp, babyBed, smallFeetSide, breath } from '../../lib/figure.mjs';

const TAU = Math.PI * 2;
const ONCE = new Map(); const once = (k, f) => { if (!ONCE.has(k)) ONCE.set(k, f()); return ONCE.get(k); };

// ---------- the engraving ground: printing-plate indigo, a warm cone from the top left, plate hatch, fibre (cached) ----------
export function plate(ctx, t = 0, o = {}) {
  const c = once('plate' + (o.key || ''), () => {
    const [c, g] = canvas(); g.fillStyle = o.base || '#141433'; g.fillRect(0, 0, W, H);
    const L = o.light || [520, 160], gr = g.createRadialGradient(L[0], L[1], 0, L[0] + 200, L[1] + 260, 1350);
    gr.addColorStop(0, 'rgba(255,196,128,.22)'); gr.addColorStop(.35, 'rgba(190,120,110,.08)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    // the plate's own fine hatch (engraved ground), stronger in the shadow
    g.save(); g.strokeStyle = 'rgba(150,160,230,.05)'; g.lineWidth = .7; for (let d = -H; d < W; d += 6) { g.beginPath(); g.moveTo(d, 0); g.lineTo(d + H * .55, H); g.stroke(); } g.restore();
    g.save(); g.globalCompositeOperation = 'multiply'; const v = g.createRadialGradient(W * .45, H * .42, H * .3, W / 2, H / 2, H * 1.05); v.addColorStop(0, 'rgba(255,255,255,1)'); v.addColorStop(1, 'rgba(60,60,110,1)'); g.fillStyle = v; g.fillRect(0, 0, W, H); g.restore();
    g.beginPath(); g.rect(0, 0, W, H); fibreFill(g, .05);
    return c;
  });
  ctx.drawImage(c, 0, 0);
}
// light dust in the cone
function motes(ctx, t, n = 70, seed = 5) {
  const r = prng(seed); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) { const x0 = r() * W * .8, y0 = r() * H * .7, sp = .3 + r(), x = (x0 + t * 9 * sp + Math.sin(t * .5 + i) * 12) % W, y = y0 + Math.sin(t * .3 + i * 1.7) * 18 - t * 4 * sp;
    const d = Math.hypot(x - 520, y - 160) / 1100, a = (1 - clamp(d)) * (.25 + .35 * r()); if (a <= 0) continue; ctx.fillStyle = rgba('#ffd9a8', a); ctx.beginPath(); ctx.arc(x, ((y % H) + H) % H, .6 + r() * 1.4, 0, TAU); ctx.fill(); }
  ctx.restore();
}

// ---------- 1.02: the share that does not exist yet; a burin cuts the first line ----------
export function ghostBurin(ctx, t, o = {}) {
  plate(ctx, t);
  certificate(ctx, t, { x: 960, y: 548, s: .86, rot: -.05, ghost: 1, burin: o.burin ?? .085, seq: true, tips: 1 });
  motes(ctx, t);
}

// ---------- a ghost rosette in three states: dotted (not yet) · burin (agreed) · smoke (a mere promise) ----------
export function ghostRosettes(ctx, t, o = {}) {
  plate(ctx, t);
  const G = { R: 190, A: 30, B: 12, n: 16, m: 7, lines: 30, ghostLines: 7, col: '#f3efe2', w: 1.6, dot: 8, a: .95 };
  const X = [400, 960, 1520], Y = 500;
  rosette(ctx, X[0], Y, { ...G, ghost: 1, rot: t * .02 });
  rosette(ctx, X[1], Y, { ...G, burin: o.burin ?? .55, glow: '#ffb35c', t, rot: t * .02, tips: 2 });
  rosette(ctx, X[2], Y, { ...G, ghost: 1, smoke: o.smoke ?? .42, t, rot: t * .02 });
  const cap = (s, x) => text(ctx, s, x, 830, { size: 17, weight: 600, color: 'rgba(243,239,226,.72)', align: 'center', spacing: 6 });
  cap('GHOST · NOT YET', X[0]); cap('BURIN · AGREED', X[1]); cap('SMOKE · A PROMISE', X[2]);
  const sub = (s, x) => text(ctx, s, x, 862, { size: 14, weight: 500, color: 'rgba(243,239,226,.42)', align: 'center', spacing: 2 });
  sub("rosette(ctx, x, y, { ghost: 1 })", X[0]); sub("{ burin: .55, glow: '#ffb35c' }", X[1]); sub('{ ghost: 1, smoke: .42 }', X[2]);
  motes(ctx, t, 40);
}

// ---------- paper helpers for the perforation frames ----------
const PAPER = '#efe4cc';
function sheet(ctx, x, y, w, h, rot, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 40; ctx.shadowOffsetX = 18; ctx.shadowOffsetY = 26; ctx.fillStyle = '#000'; ctx.fillRect(-w / 2 + 6, -h / 2 + 6, w - 12, h - 12); ctx.restore();
  const g = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); g.addColorStop(0, '#f6ecd6'); g.addColorStop(1, '#d9ccb0'); ctx.fillStyle = g; ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); fibreFill(ctx, .35);
  // typeset content as grey lines (cards are the builders'; this is only the reservation look)
  const r = prng(o.seed ?? 3); ctx.fillStyle = 'rgba(31,26,38,.85)'; ctx.font = '44px "Instrument Serif"'; ctx.fillText(o.title || 'A pledge', -w / 2 + 56, -h / 2 + 96);
  ctx.fillStyle = 'rgba(31,26,38,.5)'; ctx.font = '600 13px "Inter"'; try { ctx.letterSpacing = '3px'; } catch { } ctx.fillText(o.kicker || 'PUBLISHED · 2026', -w / 2 + 58, -h / 2 + 128); try { ctx.letterSpacing = '0px'; } catch { }
  ctx.fillStyle = 'rgba(31,26,38,.16)'; for (let i = 0; i < 9; i++) { const lw = (w - 112) * (i % 4 === 3 ? .55 + r() * .2 : .86 + r() * .14); ctx.fillRect(-w / 2 + 56, -h / 2 + 170 + i * 26, lw, 7); }
  // the empty signature line and an unembossed seal ring (a promise, not a contract)
  ctx.strokeStyle = 'rgba(31,26,38,.55)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-w / 2 + 56, h / 2 - 70); ctx.lineTo(w / 2 - 200, h / 2 - 70); ctx.stroke();
  ctx.fillStyle = 'rgba(31,26,38,.45)'; ctx.font = '600 11px "Inter"'; try { ctx.letterSpacing = '3px'; } catch { } ctx.fillText('SIGNATURE', -w / 2 + 56, h / 2 - 50); try { ctx.letterSpacing = '0px'; } catch { }
  ctx.save(); ctx.setLineDash([2, 5]); ctx.strokeStyle = 'rgba(31,26,38,.35)'; ctx.beginPath(); ctx.arc(w / 2 - 110, h / 2 - 90, 52, 0, TAU); ctx.stroke(); ctx.restore();
  if (o.inner) o.inner(ctx);
  ctx.restore();
}
// a warm lamp behind the sheets
function backLamp(ctx, x, y, r, a = 1) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba('#ffd59a', .55 * a)); g.addColorStop(.4, rgba('#ff9a4a', .16 * a)); g.addColorStop(1, rgba('#ff9a4a', 0)); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore(); }

// ---------- 0.05: PROMISE punched through both sheets, light shining through ----------
export function perforatePromise(ctx, t, o = {}) {
  plate(ctx, t, { key: 'b', base: '#16142e' });
  const u = o.u ?? 1;
  const A = [610, 540, 640, 820, -.035], B = [1310, 548, 640, 820, .03];
  for (const [x, y, w, h, rot] of [A, B]) sheet(ctx, x, y, w, h, rot, { title: x < 900 ? 'Investing in…' : 'A post', kicker: x < 900 ? 'ANNOUNCEMENT · 18 OCT 2026' : 'POST ON X · 19 OCT 2026', seed: x,
    inner: (c) => perforateText(c, 'PROMISE', 0, 40, { size: 70, pitch: 6.2, hole: 1.55, u, t, onPaper: true, light: '#fff0c8' }) });
  motes(ctx, t, 30);
}

// ---------- coupons tear off at the perforation (dividend coupons PLANT · GROW · HARVEST; 4.05 slices) ----------
function couponSheet(ctx, x, y, t) {
  const w = 1180, h = 300, cw = w / 3;
  ctx.save(); ctx.translate(x, y);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 36; ctx.shadowOffsetY = 22; ctx.fillStyle = '#000'; ctx.fillRect(-w / 2 + 6, -h / 2 + 6, w - 12, h - 12); ctx.restore();
  const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, '#f4ead3'); g.addColorStop(1, '#e2d4b6'); ctx.fillStyle = g; ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); fibreFill(ctx, .3);
  ['PLANT', 'GROW', 'HARVEST'].forEach((name, i) => {
    const cx = -w / 2 + cw * (i + .5);
    ctx.save(); ctx.strokeStyle = 'rgba(40,64,90,.75)'; ctx.lineWidth = 1; ctx.strokeRect(cx - cw / 2 + 16, -h / 2 + 16, cw - 32, h - 32); ctx.strokeRect(cx - cw / 2 + 22, -h / 2 + 22, cw - 44, h - 44); ctx.restore();
    rosette(ctx, cx - cw / 2 + 92, 0, { R: 46, A: 13, B: 6, n: 12, m: 5, lines: 18, col: '#28405a', w: .6, a: .8, cache: true });
    text(ctx, name, cx + 40, 6, { size: 40, font: 'Instrument Serif', color: '#7a3b17', align: 'center', spacing: 4 });
    text(ctx, 'COUPON No ' + (i + 1), cx + 40, 46, { size: 12, weight: 600, color: 'rgba(40,64,90,.8)', align: 'center', spacing: 4 });
    microPath(ctx, [[cx - cw / 2 + 30, -h / 2 + 40], [cx + cw / 2 - 30, -h / 2 + 40]], 'ONE EQUAL SHARE FOR EVERY PERSON · ', { size: 6, col: '#28405a', a: .7 });
  });
  ctx.restore();
}
export function couponTear(ctx, t, o = {}) {
  plate(ctx, t, { key: 'b', base: '#16142e' });
  const x = 960, y = 560, w = 1180, cw = w / 3, tear = o.tear ?? .62, lx = x + w / 2 - cw;
  const line = [[lx, y - 150], [lx, y + 150]];
  tearAway(ctx, { line, part: 'rest', side: -1, draw: (c) => couponSheet(c, x, y, t) });
  perforation(ctx, [[x - w / 2 + cw, y - 150], [x - w / 2 + cw, y + 150]], { pitch: 8, hole: 1.6, light: '#ffe2b0' });
  perforation(ctx, line, { pitch: 8, hole: 1.6, tear, light: '#ffe2b0' });
  tearAway(ctx, { line, part: 'piece', side: -1, tear, lift: 90, rot: -.3, draw: (c) => couponSheet(c, x, y, t) });
  motes(ctx, t, 30);
}

// ---------- 5.16b: the border of one country as a microtext line on the dark map ----------
const CAM_US = { ...region('USA', .62), tilt: .38, rot: -.04 };
function usaRing(cam) {
  return once('usaRing', () => {
    const c = country('USA', '50m'), polys = c.polys.map((p) => p[0]).filter((r) => r[0][0] > -130 && r[0][1] < 50).sort((a, b) => b.length - a.length);
    return resample(polys[0].map(([lon, lat]) => project(cam, lon, lat).slice(0, 2)).concat([project(cam, polys[0][0][0], polys[0][0][1]).slice(0, 2)]), 2400);
  });
}
export function microBorder(ctx, t, o = {}) {
  const base = once('usmap', () => { const [c, g] = canvas(); worldMap(g, CAM_US, { t: 0, dim: .75, detail: '50m', borders: true });
    g.globalCompositeOperation = 'multiply'; g.fillStyle = '#25264f'; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over';
    const v = g.createRadialGradient(W * .5, H * .45, H * .2, W * .5, H * .5, H); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(4,4,16,.6)'); g.fillStyle = v; g.fillRect(0, 0, W, H); return c; });
  ctx.drawImage(base, 0, 0);
  const P = usaRing(CAM_US);
  // under-glow along the line, then the microtext riding on it
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineJoin = 'round'; ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.strokeStyle = 'rgba(255,150,70,.07)'; ctx.lineWidth = 26; ctx.stroke(); ctx.strokeStyle = 'rgba(255,179,92,.12)'; ctx.lineWidth = 9; ctx.stroke(); ctx.restore();
  microPath(ctx, P, 'ONE RICH COUNTRY · ', { size: 10, u: o.u ?? 1, glint: (t * .08) % 1, col: '#ffd9a8', a: .95, offset: -t * 18, weight: 700 });
}

// ---------- people: children next to adults (same s), a baby in arms, where babies sleep ----------
function porch(ctx, t, key = 'porch') {
  const c = once(key, () => {
    const [c, g] = canvas(); const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#0d0f30'); sky.addColorStop(.62, '#1b1840'); sky.addColorStop(.63, '#2a2036'); sky.addColorStop(1, '#171222'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
    // floor boards in perspective, a warm lamp pool
    g.strokeStyle = 'rgba(255,220,180,.05)'; g.lineWidth = 1; for (let i = -20; i <= 20; i++) { g.beginPath(); g.moveTo(W / 2 + i * 40, 680); g.lineTo(W / 2 + i * 160, H); g.stroke(); }
    const pool = g.createRadialGradient(W / 2, 880, 20, W / 2, 880, 820); pool.addColorStop(0, 'rgba(255,190,120,.42)'); pool.addColorStop(.5, 'rgba(255,150,90,.12)'); pool.addColorStop(1, 'rgba(0,0,0,0)'); g.save(); g.translate(W / 2, 880); g.scale(1, .32); g.translate(-W / 2, -880); g.fillStyle = pool; g.fillRect(0, 0, W, H * 4); g.restore();
    const halo = g.createRadialGradient(W / 2, 40, 0, W / 2, 40, 700); halo.addColorStop(0, 'rgba(255,200,140,.28)'); halo.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = halo; g.fillRect(0, 0, W, H);
    g.beginPath(); g.rect(0, 0, W, H); fibreFill(g, .04);
    return c; });
  ctx.drawImage(c, 0, 0);
}
function envelope(ctx, x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.fillStyle = '#efe4cc'; ctx.fillRect(-11, -7.5, 22, 15); ctx.strokeStyle = 'rgba(60,40,30,.45)'; ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(-11, -7.5); ctx.lineTo(0, 1.5); ctx.lineTo(11, -7.5); ctx.stroke(); ctx.restore(); }
export function kidsLineup(ctx, t, o = {}) {
  porch(ctx, t);
  const S = 2.7, G = 905, L = { x: W / 2, y: 60, col: '#ffd9a0', a: .55 }, rim = 'rgba(255,214,160,.85)';
  const hip = (legs) => G - legs * S;
  // grandmother and child open the same envelope (3.07c)
  const gm = figure(ctx, 300, hip(88), S, { ...POSES.hold, head: .3 }, { t, seed: 5, accent: '#7a3b2a', dress: { hair: '#cfc8c0' }, light: L, rim, flip: false });
  envelope(ctx, gm.hand(0)[0] + 6, gm.hand(0)[1] - 8, S * .9, -.2);
  const ch = figureKid(ctx, 520, hip(49), S, KIDPOSES.hold, { age: 'child', t, seed: 2, accent: '#e9a54b', hair: 'pigtails', light: L, rim, flip: true });
  envelope(ctx, ch.hand(0)[0] - 4, ch.hand(0)[1] - 6, S * .8, .15);
  // a baby in arms
  figure(ctx, 830, hip(88), S, POSES.cradle, { t, seed: 3, accent: '#2f6f6a', light: L, rim, prop: cradleProp({ t, blanket: '#efe4cc' }) });
  // a toddler holding a grown-up's hand
  const ad = figure(ctx, 1130, hip(88), S, { sh: [0.3, 0.1], el: [0.1, 0.25] }, { t, seed: 1, accent: '#c8442f', light: L, rim });
  figureKid(ctx, 1218, hip(29.5), S, KIDPOSES.reachUp, { age: 'toddler', t, seed: 4, accent: '#8fd27a', hair: 'curly', light: L, rim, flip: true });
  // a child crouching to plant
  figureKid(ctx, 1460, hip(49) + 18, S, KIDPOSES.squat, { age: 'child', t, seed: 0, accent: '#4a7ab0', hair: 'beanie', light: L, rim });
  // a baby asleep in a basket
  babyBed(ctx, 1720, G, S, 'basket', { t });
  const cap = (s, x) => text(ctx, s, x, 990, { size: 15, weight: 600, color: 'rgba(243,239,226,.55)', align: 'center', spacing: 4 });
  cap('figure · hold', 300); cap("figureKid · child", 520); cap('POSES.cradle + cradleProp', 830); cap('toddler · reachUp', 1175); cap('child · squat', 1460); cap("babyBed 'basket'", 1720);
}
export function babyBeds(ctx, t, o = {}) {
  porch(ctx, t, 'porch2');
  const S = 4.2, G = 760;
  babyBed(ctx, 330, G, S, 'hammock', { t, cloth: '#c8442f' }); babyBed(ctx, 760, G, S, 'basket', { t }); babyBed(ctx, 1180, G, S, 'crib', { t }); babyBed(ctx, 1600, G, S, 'mat', { t, blanket: '#f5b08a' });
  const cap = (s, x) => text(ctx, s, x, 900, { size: 16, weight: 600, color: 'rgba(243,239,226,.6)', align: 'center', spacing: 4 });
  cap('HAMMOCK', 330); cap('BASKET', 760); cap('CRIB', 1180); cap('MAT', 1600);
}
// 4.18: two small bare feet toddle in next to the sprout (ground-level macro)
export function feetSoil(ctx, t, o = {}) {
  const c = once('soilbg', () => { const [c, g] = canvas(); const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#2b2030'); bg.addColorStop(.55, '#4a3426'); bg.addColorStop(.56, '#3a2a1f'); bg.addColorStop(1, '#1d140f'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    const sun = g.createRadialGradient(380, 300, 0, 380, 300, 900); sun.addColorStop(0, 'rgba(255,190,140,.35)'); sun.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = sun; g.fillRect(0, 0, W, H);
    g.save(); g.filter = 'blur(10px)'; const r = prng(9); for (let i = 0; i < 70; i++) { g.fillStyle = `rgba(${r() < .5 ? '120,88,62' : '20,14,10'},${.3 + r() * .4})`; g.beginPath(); g.ellipse(r() * W, 560 + r() * 60, 30 + r() * 80, 6 + r() * 10, 0, 0, TAU); g.fill(); } g.restore();
    return c; });
  ctx.drawImage(c, 0, 0);
  // the sprout (stand-in for C7's tree) so the scale reads
  ctx.save(); ctx.strokeStyle = '#8fd27a'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(560, 760); ctx.bezierCurveTo(566, 690, 548, 640, 572, 585); ctx.stroke();
  ctx.fillStyle = '#8fd27a'; ctx.beginPath(); ctx.ellipse(612, 590, 46, 18, -.5, 0, TAU); ctx.fill(); ctx.fillStyle = '#6fb85e'; ctx.beginPath(); ctx.ellipse(532, 610, 36, 14, .6, 0, TAU); ctx.fill(); ctx.restore();
  const ph = (o.phase ?? .35);
  smallFeetSide(ctx, 900, 800, 2.6, { t, light: { x: 380, y: 300 }, step: [0, ph], seed: 5 });
}
