// s05_w2 · chapter 05, window 2 (shots 5.12–5.17): G5 Kenya → roadside stall → thread → G6 flow rings → two strips → the potter.
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, layer, put, stipple, maskLinear, maskRadial, roughPath, roughPoly, roughRect, roughLine, hatch, fog, cone, person, castShadow, printFinish, vnoise, fbm, soften, stratus, limb, qpts } from './art.mjs';
import { lin, sm, eio, eout, ein, sine, drift, text } from '../engine.mjs';
import { memo, view, toScreen, plate, camAt, glowSprite, spr, bokehSprite, smear, stripDraw, paper, bloom, pool, easeOutBack, WARM, HOT, CREAM, WHITE } from './s05_kit.mjs';

const INK = '#0b0f2a', MUTED = '#a49fc4', CYAN = '#8fe6ff';
const src = (ctx, s, a, y = 1010) => text(ctx, s, 110, y, { size: 17, weight: 500, color: MUTED, alpha: a, spacing: 1 });
const caps = (ctx, s, x, y, a, o = {}) => text(ctx, s.toUpperCase(), x, y, { size: 18, weight: 600, color: o.color || MUTED, alpha: a, spacing: 6, align: o.align || 'left' });

// =====================================================================================================
// 5.12 · G5 Kenya
// =====================================================================================================
const KE = [[35.9, 4.62], [36.85, 4.45], [38.12, 3.6], [38.9, 3.5], [39.56, 3.42], [39.85, 3.84], [40.77, 4.26], [41.17, 3.92], [41.86, 3.92], [40.99, 2.78], [40.99, -.85],
  [41.58, -1.68], [41.2, -1.95], [40.9, -2.25], [40.64, -2.5], [40.23, -2.7], [40.12, -3.28], [39.8, -3.68], [39.6, -4.35], [39.2, -4.68],
  [37.7, -3.1], [37.67, -3.0], [34.07, -1.06], [33.9, -.95], [33.89, .11], [34.18, .52], [34.67, 1.18], [35.03, 1.9], [34.6, 3.06], [34.48, 3.56], [34.0, 4.25], [34.39, 4.61], [35.3, 5.4], [35.9, 4.62]];
const COAST0 = 11, COAST1 = 19;
const MX = (lon) => 700 + (lon - 37.9) * 76, MY = (lat) => 530 - (lat - .1) * 76;
const KP = KE.map(([a, b]) => [MX(a), MY(b)]);
const VIL = (() => { const r = prng(55), o = []; for (const [lo, la, n] of [[34.35, .1, 18], [35.3, -.75, 14]]) for (let i = 0; i < n; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * .42; o.push({ x: MX(lo + Math.cos(a) * d), y: MY(la + Math.sin(a) * d * .8), d: r() }); } return o; })();
const HERO = VIL[5];
// polyline helpers
const plen = (P) => { let L = 0; for (let i = 1; i < P.length; i++) L += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); return L; };
function pathTo(ctx, P, u, move = true) {
  const L = plen(P) * u; let acc = 0; ctx[move ? 'moveTo' : 'lineTo'](...P[0]); let head = P[0];
  for (let i = 1; i < P.length; i++) { const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); if (acc + d >= L) { const q = (L - acc) / (d || 1); head = [mix(P[i - 1][0], P[i][0], q), mix(P[i - 1][1], P[i][1], q)]; ctx.lineTo(...head); return head; } acc += d; ctx.lineTo(...P[i]); head = P[i]; }
  return head;
}
function map12() {
  return memo('m12', () => {
    const [c, g] = layer();
    { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#080b22'); gr.addColorStop(1, '#151033'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
    { const [lc, lx] = layer(); const rg = lx.createRadialGradient(560, 760, 0, 560, 760, 900); rg.addColorStop(0, 'rgba(170,70,40,.35)'); rg.addColorStop(1, 'rgba(170,70,40,0)'); lx.fillStyle = rg; lx.fillRect(0, 0, W, H); stipple(lc, { k: .5, seed: 2 }); put(g, lc, { op: 'lighter' }); }
    // graticule
    g.setLineDash([2, 7]); g.strokeStyle = 'rgba(164,159,196,.16)'; g.lineWidth = 1;
    for (let lon = 32; lon <= 44; lon += 2) { g.beginPath(); g.moveTo(MX(lon), 40); g.lineTo(MX(lon), 1040); g.stroke(); }
    for (let lat = -6; lat <= 6; lat += 2) { g.beginPath(); g.moveTo(140, MY(lat)); g.lineTo(1160, MY(lat)); g.stroke(); }
    g.setLineDash([]);
    text(g, 'EQUATOR', MX(32.2), MY(0) - 8, { size: 13, weight: 600, color: MUTED, alpha: .45, spacing: 4 });
    // the Indian Ocean side: faint wave hatch beyond the coast
    g.save(); g.beginPath(); g.moveTo(KP[COAST0][0], KP[COAST0][1]); for (let i = COAST0; i <= COAST1; i++) g.lineTo(...KP[i]); g.lineTo(KP[COAST1][0], 1100); g.lineTo(1300, 1100); g.lineTo(1300, KP[COAST0][1] - 300); g.closePath(); g.clip();
    hatch(g, [800, 300, 600, 800], { angle: -.05, gap: 9, w: 1, col: '#6f7fb8', a: .18, seed: 4, broken: .5 }); g.restore();
    // Lake Victoria (outside, west) + its gulf
    g.fillStyle = '#121a46'; g.beginPath(); g.ellipse(MX(32.9), MY(-1.1), 1.25 * 76, 1.3 * 76, .2, 0, 7); g.fill();
    // the country: red earth, stippled toward the edges, hatched shade
    g.save(); g.beginPath(); roughPath(g, KP, { amp: 1, seed: 3 }); g.clip();
    { const gr = g.createRadialGradient(MX(37.5), MY(.5), 0, MX(37.5), MY(.5), 520); gr.addColorStop(0, '#7a3422'); gr.addColorStop(1, '#3a1612'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
    hatch(g, [300, 80, 900, 900], { angle: .6, gap: 6, w: 1, col: '#1a0806', a: .28, seed: 6, broken: .4 });
    { const [lc, lx] = layer(); const rg = lx.createRadialGradient(MX(35), MY(-.2), 0, MX(35), MY(-.2), 360); rg.addColorStop(0, 'rgba(255,190,110,.28)'); rg.addColorStop(1, 'rgba(255,190,110,0)'); lx.fillStyle = rg; lx.fillRect(0, 0, W, H); stipple(lc, { k: .35, seed: 7 }); put(g, lc, { op: 'lighter' }); }
    g.restore();
    g.fillStyle = '#121a46'; g.beginPath(); for (const [i, [a, b]] of [[36.0, 4.5], [36.25, 4.4], [36.5, 3.6], [36.62, 2.6], [36.42, 2.45], [36.1, 3.4], [35.95, 4.2]].entries()) g[i ? 'lineTo' : 'moveTo'](MX(a), MY(b)); g.fill();
    g.beginPath(); for (const [i, [a, b]] of [[33.9, -.2], [34.1, .05], [34.5, -.15], [34.85, -.3], [34.5, -.48], [34.2, -.5], [33.9, -.6]].entries()) g[i ? 'lineTo' : 'moveTo'](MX(a), MY(b)); g.fill();
    return c;
  });
}
function cam12(t, T0, tOut) { return camAt(t, [{ t: T0 - .4, x: -20, y: 0, z: 1.0 }, { t: tOut - .55, x: 10, y: 0, z: 1.04, ease: sine }, { t: tOut + .3, x: (HERO.x - W / 2) * .6, y: (HERO.y - H / 2) * .6, z: 1.9, ease: ein }], { dx: 4, dy: 3 }); }
export function shot12(T) {
  const T0 = T.S('05a', 'When people in Kenya') - .5, tRec = T.S('05a', 'received'), tDid = T.S('05a', 'didn\'t work'), tOut = T.S('05a', 'Many') - .15;
  const lead = [[-260, 760], [200, 700], [700, 640], [1060, 640], KP[COAST0]], coast = KP.slice(COAST0, COAST1 + 1), rest = [...KP.slice(COAST1), ...KP.slice(1, COAST0 + 1)];
  return {
    t: T0, tr: 'right', d: .7,
    draw(ctx, t) {
      const c = cam12(t, T0, tOut);
      plate(ctx, map12(), c, 1);
      ctx.save(); view(ctx, c, 1);
      // 1) the stroke flies in from the left and lands on the coast; 2) it runs down the coast; 3) the border draws on
      const uLead = eout(lin(T0 - .3, T0 + .55, t)), uCoast = eio(lin(T0 + .45, T0 + 1.15, t)), uRest = eio(lin(T0 + 1.0, tRec + .3, t));
      if (uLead > 0 && uLead < 1.2) { const fade = 1 - lin(T0 + .45, T0 + 1.0, t); if (fade > 0) { ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = rgba('#f0a040', .85 * fade); ctx.lineWidth = 22 * fade + 2; ctx.beginPath(); const h = pathTo(ctx, lead, uLead); ctx.stroke(); } }
      if (uCoast > 0) { ctx.lineCap = 'round'; ctx.strokeStyle = rgba(WARM, .3); ctx.lineWidth = 16; ctx.beginPath(); pathTo(ctx, coast, uCoast); ctx.stroke(); ctx.strokeStyle = '#ffcf8a'; ctx.lineWidth = 4.5; ctx.beginPath(); const h = pathTo(ctx, coast, uCoast); ctx.stroke(); if (uCoast < 1) spr(ctx, glowSprite(40, WARM, WHITE, .9, .3, 2), h[0], h[1], 1, 1); }
      if (uRest > 0) { ctx.strokeStyle = rgba(CREAM, .85); ctx.lineWidth = 2; ctx.beginPath(); const h = pathTo(ctx, rest, uRest); ctx.stroke(); if (uRest < 1) spr(ctx, glowSprite(30, CREAM, WHITE, .8, .3, 3), h[0], h[1], 1, 1); }
      // villages in the study (rural west) light up; cyan payments drop on "received" and turn amber in the village
      const vA = sm(lin(tRec - .5, tRec, t));
      for (const [i, v] of VIL.entries()) {
        const td = tRec + i * .045, f = lin(td - .4, td, t), land = f >= 1;
        if (vA > 0) { ctx.fillStyle = rgba(CREAM, .35 * vA); ctx.beginPath(); ctx.arc(v.x, v.y, 2.6, 0, 7); ctx.fill(); }
        if (f > 0 && !land) { const y = mix(v.y - 160, v.y, ein(f)); ctx.fillStyle = CYAN; ctx.beginPath(); ctx.arc(v.x, y, 3, 0, 7); ctx.fill(); ctx.strokeStyle = rgba(CYAN, .4); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(v.x, y - 24); ctx.lineTo(v.x, y); ctx.stroke(); }
        if (land) { const k = t - td, ring = lin(0, .7, k); if (ring < 1) { ctx.strokeStyle = rgba(WARM, .7 * (1 - ring)); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(v.x, v.y, 4 + ring * 20, 0, 7); ctx.stroke(); }
          ctx.fillStyle = mixHex(CYAN, '#ffc070', lin(0, .25, k)); ctx.beginPath(); ctx.arc(v.x, v.y, 3.6, 0, 7); ctx.fill(); spr(ctx, glowSprite(18, WARM, WHITE, .8, .2, 5), v.x, v.y, 1 + (v === HERO ? lin(tOut - .6, tOut, t) * 1.5 : 0), .5 + .2 * Math.sin(t * 2 + i)); }
      }
      // leader + label to the study villages
      const la = sm(lin(tRec + .6, tRec + 1.2, t)) * (1 - lin(tOut - .5, tOut - .1, t));
      if (la > 0) { ctx.strokeStyle = rgba(MUTED, .6 * la); ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(MX(34.3), MY(.6)); ctx.lineTo(MX(34.3), MY(2.6)); ctx.lineTo(MX(32.6), MY(2.6)); ctx.stroke(); ctx.setLineDash([]);
        text(ctx, 'villages in the study', MX(32.6), MY(2.6) - 10, { size: 26, font: 'Instrument Serif Italic', color: CREAM, alpha: .85 * la }); }
      ctx.restore();
      // the statement column (screen space, fades as we dive into the village)
      const out = 1 - sm(lin(tOut - .5, tOut - .1, t));
      const a1 = sm(lin(T0 + .8, T0 + 1.4, t)) * out;
      ctx.fillStyle = rgba(WARM, a1); ctx.fillRect(1240, 286, 34, 2);
      caps(ctx, 'Kenya · a basic-income study', 1240, 330, a1);
      const a2 = eout(lin(tDid - .1, tDid + .5, t)) * out;
      text(ctx, 'They didn’t', 1240 + (1 - a2) * 20, 430, { size: 76, font: 'Instrument Serif', color: CREAM, alpha: a2 });
      text(ctx, 'work less.', 1240 + (1 - a2) * 20, 510, { size: 76, font: 'Instrument Serif Italic', color: '#ffcf8a', alpha: a2 });
      const a3 = eout(lin(tDid + .7, tDid + 1.3, t)) * out;
      text(ctx, 'Work shifted toward running', 1240, 580, { size: 26, color: MUTED, alpha: a3 });
      text(ctx, 'their own small businesses.', 1240, 614, { size: 26, color: MUTED, alpha: a3 });
      src(ctx, 'Source: Banerjee, Faye, Krueger, Niehaus & Suri (2023), Universal Basic Income: Short-Term Results from a Long-Term Experiment in Kenya (GiveDirectly study), NBER', sm(lin(T0 + 1, T0 + 1.6, t)) * out);
      printFinish(ctx, { grain: .06, vig: .45 });
    },
  };
}
export const zoom12to13 = (T) => { const T0 = T.S('05a', 'When people in Kenya') - .5, tOut = T.S('05a', 'Many') - .15; return toScreen(cam12(tOut, T0, tOut), 1, HERO.x, HERO.y); };

// =====================================================================================================
// 5.13 · "Many started their own businesses." — a roadside stall at dusk; the shutter goes up, the machine starts.
// =====================================================================================================
const ST = { x0: 820, x1: 1500, top: 380, oy0: 520, oy1: 800, ox0: 880, ox1: 1440 };
function stall13() {
  return memo('st13', () => {
    const [c, g] = layer(), r = prng(13);
    { const gr = g.createLinearGradient(0, 0, 0, 620); gr.addColorStop(0, '#231c40'); gr.addColorStop(.45, '#7a3a50'); gr.addColorStop(.8, '#d8703a'); gr.addColorStop(1, '#f2b06a'); g.fillStyle = gr; g.fillRect(0, 0, W, 640); }
    bloom(g, 420, 600, 600, { col: '#ff8a4a', core: '#ffe0a0', a: .45, k: .4, seed: 3, sy: .45 });
    { const [hc, hx] = layer(); hx.beginPath(); for (const [y, x0, x1, th] of [[300, 900, 1900, 16], [360, -200, 700, 12], [420, 1200, 2100, 10]]) stratus(hx, y, x0, x1, th, y); hx.fillStyle = rgba('#e8806a', .45); hx.fill(); put(g, hc); }
    // far hills, savannah
    roughPoly(g, [[-20, 600], [300, 560], [620, 585], [900, 548], [1300, 575], [1700, 540], [1940, 566], [1940, 640], [-20, 640]], '#5a3048', { amp: 3, step: 14, seed: 4 });
    roughPoly(g, [[-20, 625], [400, 600], [800, 616], [1200, 598], [1940, 612], [1940, 680], [-20, 680]], '#46202e', { amp: 3, step: 14, seed: 5 });
    // red earth ground + road ruts toward the horizon
    { const gr = g.createLinearGradient(0, 610, 0, H); gr.addColorStop(0, '#9a4426'); gr.addColorStop(.4, '#6a2a18'); gr.addColorStop(1, '#2a0e0a'); g.fillStyle = gr; g.fillRect(0, 610, W, 480); }
    g.save(); g.beginPath(); g.rect(0, 612, W, 480); g.clip(); hatch(g, [0, 612, W, 480], { angle: -.03, gap: 7, w: 1.1, col: '#1a0604', a: .25, seed: 6, broken: .5 }); g.restore();
    for (const s of [-1, 1]) roughLine(g, [[600 + s * 30, 640], [300 + s * 420, 1090]], { w: 3, col: 'rgba(30,8,4,.5)', seed: 7 + s });
    // acacia: flat crown, splayed limbs (left)
    { const tx = 300, ty = 700; limb(g, qpts([tx, ty], [tx - 10, ty - 120], [tx - 90, ty - 260]), 26, 8, '#1a0a10', 1); limb(g, qpts([tx - 4, ty - 80], [tx + 40, ty - 180], [tx + 140, ty - 250]), 16, 6, '#1a0a10', 2); limb(g, qpts([tx - 8, ty - 140], [tx - 20, ty - 220], [tx + 10, ty - 270]), 10, 5, '#1a0a10', 3);
      g.fillStyle = '#1a0a12'; g.beginPath(); stratus(g, ty - 262, tx - 260, tx + 260, 34, 9); g.fill(); g.beginPath(); stratus(g, ty - 292, tx - 170, tx + 120, 22, 10); g.fill();
      g.strokeStyle = rgba('#ffb070', .5); g.lineWidth = 2; g.beginPath(); g.moveTo(tx - 250, ty - 268); g.quadraticCurveTo(tx, ty - 300, tx + 250, ty - 266); g.stroke(); }
    // the stall: painted teal wood, tin roof, the sign
    roughPoly(g, [[ST.x0 - 50, ST.top - 20], [ST.x1 + 60, ST.top - 40], [ST.x1 + 70, ST.top + 10], [ST.x0 - 60, ST.top + 30]], '#5a5560', { amp: 1.5, seed: 11 });
    g.save(); g.beginPath(); g.moveTo(ST.x0 - 50, ST.top - 20); g.lineTo(ST.x1 + 60, ST.top - 40); g.lineTo(ST.x1 + 70, ST.top + 10); g.lineTo(ST.x0 - 60, ST.top + 30); g.clip(); for (let x = ST.x0 - 60; x < ST.x1 + 80; x += 14) { g.fillStyle = 'rgba(255,220,180,.18)'; g.fillRect(x, ST.top - 50, 3, 90); } g.restore();
    roughRect(g, ST.x0, ST.top + 20, ST.x1 - ST.x0, 810 - ST.top - 20, '#24626a', { amp: 1.5, seed: 12 });
    g.save(); g.beginPath(); g.rect(ST.x0, ST.top + 20, ST.x1 - ST.x0, 800); g.clip(); hatch(g, [ST.x0, ST.top, ST.x1 - ST.x0, 440], { angle: Math.PI / 2, gap: 18, w: 2, col: '#0e2a30', a: .5, seed: 13, broken: .1 });
    const gr = g.createLinearGradient(ST.x0, 0, ST.x1, 0); gr.addColorStop(0, 'rgba(255,160,90,.35)'); gr.addColorStop(1, 'rgba(10,4,10,.4)'); g.fillStyle = gr; g.fillRect(ST.x0, ST.top, ST.x1 - ST.x0, 440); g.restore();
    roughRect(g, ST.x0 + 120, ST.top + 34, 440, 74, '#c4482a', { amp: 1, seed: 14 });
    text(g, 'TAILOR', ST.x0 + 340, ST.top + 88, { size: 46, weight: 600, color: '#f4e2c0', align: 'center', spacing: 10 });
    // the opening: dark until the shutter goes up; the interior is a separate layer
    roughRect(g, ST.ox0 - 6, ST.oy0 - 6, ST.ox1 - ST.ox0 + 12, ST.oy1 - ST.oy0 + 6, '#120808', { amp: .8, seed: 15 });
    // a bench and a crate outside
    roughRect(g, 1530, 740, 160, 16, '#3a1a10', { amp: .8, seed: 16 }); roughRect(g, 1545, 756, 10, 50, '#2a100a', { amp: .5, seed: 17 }); roughRect(g, 1665, 756, 10, 50, '#2a100a', { amp: .5, seed: 18 });
    return c;
  });
}
function inside13() {
  return memo('in13', () => {
    const [c, g] = layer(ST.ox1 - ST.ox0, ST.oy1 - ST.oy0), w = c.width, h = c.height;
    const gr = g.createRadialGradient(w * .55, 20, 0, w * .55, 20, w); gr.addColorStop(0, '#ffd39a'); gr.addColorStop(.5, '#c8682e'); gr.addColorStop(1, '#4a1a10'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    // fabric bolts on shelves (kanga colours)
    const cols = ['#c4482a', '#e5b23a', '#2a7a8a', '#7a2a6a', '#3a8a4a', '#f0e0c0', '#d8682a', '#2a3a8a'], r = prng(5);
    for (let s = 0; s < 3; s++) { const y = 30 + s * 62; roughRect(g, 10, y + 48, 260, 6, '#3a1a10', { amp: .5, seed: s });
      for (let k = 0; k < 6; k++) { const col = cols[(s * 3 + k) % cols.length]; roughRect(g, 16 + k * 42, y + 10, 38, 38, col, { amp: .6, seed: s * 9 + k }); g.fillStyle = 'rgba(255,255,255,.25)'; for (let q = 0; q < 3; q++) g.fillRect(18 + k * 42, y + 16 + q * 11, 34, 2); } }
    // hanging garments
    for (let k = 0; k < 4; k++) roughPoly(g, [[330 + k * 50, 20], [370 + k * 50, 20], [380 + k * 50, 150], [322 + k * 50, 150]], cols[(k + 3) % cols.length], { amp: 1, seed: 40 + k });
    g.fillStyle = '#2a1008'; g.fillRect(310, 16, 230, 4);
    // the sewing table
    roughRect(g, 250, 190, 290, 14, '#4a2214', { amp: .6, seed: 7 }); roughRect(g, 270, 204, 10, 76, '#2a1008', { amp: .4, seed: 8 }); roughRect(g, 510, 204, 10, 76, '#2a1008', { amp: .4, seed: 9 });
    return c;
  });
}
const WOMAN = { coat: '#c4482a', pants: '#7a2a2a', shoes: '#1a0a08', skin: '#5a3424', hair: '#e5b23a' };
const TAILOR = { coat: '#e9dcc0', pants: '#2a2a3a', shoes: '#1a0a08', skin: '#4a2a1c', hair: '#0e0a08' };
export function shot13(T, zoomFrom) {
  const T0 = T.S('05a', 'Many') - .15, tStart = T.S('05a', 'started'), tOut = T.S('05a', 'That\'s less') - .2;
  return {
    t: T0, tr: 'zoom', d: .8, x: zoomFrom[0], y: zoomFrom[1], depth: 6,
    draw(ctx, t) {
      const c = camAt(t, [{ t: T0 - .5, x: 60, y: -10, z: 1.1, f: [1160, 600] }, { t: tOut + .3, x: 120, y: 0, z: 1.22, ease: sine }], { dx: 4, dy: 3 });
      plate(ctx, stall13(), c, 1);
      ctx.save(); view(ctx, c, 1);
      const roll = eio(lin(tStart - .25, tStart + .55, t));
      // interior (light comes on as the shutter rises)
      const sb = mix(ST.oy1, ST.oy0 + 6, roll);
      ctx.save(); ctx.beginPath(); ctx.rect(ST.ox0, ST.oy0, ST.ox1 - ST.ox0, sb - ST.oy0 + 2 * 0 + (ST.oy1 - ST.oy0)); ctx.clip();
      ctx.drawImage(inside13(), ST.ox0, ST.oy0);
      // tailor at the machine: treadles once the shutter is up
      const run = sm(lin(tStart + .2, tStart + .6, t)), tread = Math.sin(t * 14) * run;
      const ft = person(ctx, ST.ox0 + 330, ST.oy0 + 214, 1.05, { lean: .32, head: .35, sh: [1.1, .95], el: [.6, .7], hip: [1.5, 1.4], kn: [1.45 + tread * .12, 1.4 - tread * .12], hair: 'short' }, { dress: TAILOR, light: { x: ST.ox0 + 300, y: ST.oy0, col: '#ffe0b0', a: .5 }, rim: HOT, rimSide: 1 });
      // machine
      const mx = ST.ox0 + 420, my = ST.oy0 + 190; roughPoly(ctx, [[mx - 50, my], [mx + 60, my], [mx + 60, my - 50], [mx + 30, my - 66], [mx - 40, my - 66], [mx - 40, my - 30], [mx - 50, my - 30]], '#141018', { amp: .5, seed: 2 });
      ctx.fillStyle = '#c8a040'; ctx.fillRect(mx - 30, my - 58, 50, 4); ctx.fillStyle = '#d0d0d8'; ctx.fillRect(mx - 46, my - 30 + Math.sin(t * 30) * 4 * run, 3, 26);
      ctx.restore();
      // the light spill onto the red earth
      if (roll > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = roll; const g = ctx.createLinearGradient(0, ST.oy1, 0, ST.oy1 + 260); g.addColorStop(0, 'rgba(255,190,110,.45)'); g.addColorStop(1, 'rgba(255,190,110,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(ST.ox0, ST.oy1); ctx.lineTo(ST.ox1, ST.oy1); ctx.lineTo(ST.ox1 + 220, ST.oy1 + 270); ctx.lineTo(ST.ox0 - 160, ST.oy1 + 270); ctx.fill(); ctx.restore(); }
      // shutter: corrugated metal rolling up into a drum
      const shH = sb - ST.oy0;
      if (shH > 4) { roughRect(ctx, ST.ox0, ST.oy0, ST.ox1 - ST.ox0, shH, '#6a6470', { amp: .5, seed: 3 }); ctx.save(); ctx.beginPath(); ctx.rect(ST.ox0, ST.oy0, ST.ox1 - ST.ox0, shH); ctx.clip(); for (let y = sb; y > ST.oy0 - 20; y -= 12) { ctx.fillStyle = 'rgba(20,16,24,.45)'; ctx.fillRect(ST.ox0, y - 3, ST.ox1 - ST.ox0, 3); ctx.fillStyle = 'rgba(255,220,190,.16)'; ctx.fillRect(ST.ox0, y - 7, ST.ox1 - ST.ox0, 2); } ctx.restore(); }
      roughRect(ctx, ST.ox0 - 8, ST.oy0 - 22, ST.ox1 - ST.ox0 + 16, 24 + roll * 8, '#4a4450', { amp: .6, seed: 4 });
      // the woman who opens up: hands on the shutter's edge, rising with it, then stepping back
      const fx = ST.ox0 + 90, base = 812, s = 1.55, hip = base - 88 * s;
      const reach = clamp((hip - 57 * s - Math.min(sb, hip - 20 * s)) / (55 * s), -1, 1), aUp = Math.acos(-reach);
      const P = { lean: mix(.25, -.05, roll), head: mix(.2, -.35, roll), sh: [mix(1.2, aUp, roll), mix(1.0, aUp - .1, roll)], el: [mix(.6, .1, roll), mix(.5, .1, roll)], hip: [.12, -.08], kn: [.12, .05], hair: 'bun', skirt: true };
      castShadow(ctx, fx, base, s, 420, 600, { a: .4, len: 2.2, col: '#1a0604' });
      person(ctx, fx, hip, s, P, { dress: { ...WOMAN, skirt: '#e5b23a' }, light: { x: 420, y: 560, col: '#ffb070', a: .5 }, rim: '#ffcf8a', rimSide: -1, shadeA: .12 });
      // the thread: pulled taut out of the machine and racing off to the right (carrier → 5.14)
      const tq = ein(lin(tOut - .45, tOut + .25, t));
      if (tq > 0) { const sx = ST.ox0 + 400, sy = ST.oy0 + 140, ex = mix(sx, 2700, tq), ey = mix(sy, 640, tq); ctx.strokeStyle = 'rgba(255,214,150,.4)'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke(); ctx.strokeStyle = '#ffe2b0'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke(); spr(ctx, glowSprite(30, WARM, WHITE, 1, .3, 8), ex, ey, 1, 1); }
      ctx.restore();
      printFinish(ctx, { grain: .075, vig: .45, vigCol: '#140406' });
    },
  };
}

// =====================================================================================================
// 5.14 + 5.15 · the thread snaps taut into a circle → G6 the 24-hour flow ring(s)
// =====================================================================================================
const RC = [640, 570], RR = 270;
const hourAng = (h) => -Math.PI / 2 + h / 24 * Math.PI * 2;
function ticksFor(seed, nWork, nLeis) { const r = prng(seed), o = []; for (let i = 0; i < nWork; i++) o.push({ h: 9 + r() * 8, len: .6 + r() * .4, work: 1, k: r() }); for (let i = 0; i < nLeis; i++) o.push({ h: 18 + r() * 5, len: .4 + r() * .4, work: 0, k: r() }); o.push({ h: 7.6 + r(), len: .4, work: 0, k: r() }); return o.sort((a, b) => a.k - b.k); }
const TK = [ticksFor(3, 16, 3), ticksFor(4, 13, 2), ticksFor(5, 15, 4)];
function ground14() { return memo('gr14', () => { const [c, g] = layer(); const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#080b22'); gr.addColorStop(1, '#14113a'); g.fillStyle = gr; g.fillRect(0, 0, W, H); const [lc, lx] = layer(); const rg = lx.createRadialGradient(RC[0], RC[1], 0, RC[0], RC[1], 700); rg.addColorStop(0, 'rgba(255,170,90,.18)'); rg.addColorStop(1, 'rgba(255,170,90,0)'); lx.fillStyle = rg; lx.fillRect(0, 0, W, H); stipple(lc, { k: .7, seed: 3 }); put(g, lc, { op: 'lighter' }); return c; }); }
function ring(ctx, t, x, y, R, ticks, { a = 1, dial = 1, bands = 1, pop0 = 0, pop1 = 0, popT = 0, workGlow = 0, leisPulse = 0, rot = 0, labels = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  // the circle itself (the thread)
  ctx.strokeStyle = rgba(WARM, .25 * a); ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(0, 0, R, 0, 6.2832); ctx.stroke();
  ctx.strokeStyle = rgba('#ffe2b0', a); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(0, 0, R, 0, 6.2832); ctx.stroke();
  // bands: sleep / work / leisure, just inside the circle
  if (bands > 0) for (const [h0, h1, col, al] of [[0, 7, '#3b2f6e', .55], [9, 17, WARM, .22 + .2 * workGlow], [18, 23, '#6f7fb8', .22 + .15 * leisPulse]]) { ctx.strokeStyle = rgba(col, al * bands * a); ctx.lineWidth = R * .1; ctx.beginPath(); ctx.arc(0, 0, R * .9, hourAng(h0), hourAng(h1)); ctx.stroke(); }
  // hour ticks
  if (dial > 0) for (let h = 0; h < 24; h++) { const an = hourAng(h), q = clamp(dial * 24 - h); if (q <= 0) continue; const l = h % 6 === 0 ? 14 : 6; ctx.strokeStyle = rgba(CREAM, .5 * q * a); ctx.lineWidth = h % 6 === 0 ? 2 : 1; ctx.beginPath(); ctx.moveTo(Math.cos(an) * (R - 4), Math.sin(an) * (R - 4)); ctx.lineTo(Math.cos(an) * (R - 4 - l), Math.sin(an) * (R - 4 - l)); ctx.stroke(); }
  // flow ticks: radial amber strokes outside the ring (each one a moment of absorption)
  const tipS = glowSprite(22, WARM, WHITE, .9, .25, 4);
  for (const [i, k] of ticks.entries()) {
    const tt = i < 3 ? pop0 + i * .12 : pop1 + (i - 3) * .05, u = clamp((t - tt) / .35); if (u <= 0) continue;
    const L = R * .26 * k.len * easeOutBack(u) * (k.work ? 1 + .25 * workGlow : 1 - .3 * leisPulse), an = hourAng(k.h);
    ctx.strokeStyle = rgba(k.work ? '#ffc070' : '#c8a0a0', a * (k.work ? 1 : .8)); ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(Math.cos(an) * (R + 8), Math.sin(an) * (R + 8)); ctx.lineTo(Math.cos(an) * (R + 8 + L), Math.sin(an) * (R + 8 + L)); ctx.stroke();
    spr(ctx, tipS, Math.cos(an) * (R + 8 + L), Math.sin(an) * (R + 8 + L), R / 270, a * (k.work ? .8 + .4 * workGlow : .5));
  }
  ctx.restore();
  if (labels > 0) {
    for (const [s, h, al] of [['0 h', 0, .6], ['6', 6, .6], ['12', 12, .6], ['18', 18, .6]]) { const an = hourAng(h); text(ctx, s, x + Math.cos(an) * (R - 38), y + Math.sin(an) * (R - 38) + 6, { size: 17, weight: 600, color: MUTED, alpha: al * labels * a, align: 'center' }); }
    const lab = (s, h, col, al, r2 = R + 120) => { const an = hourAng(h); text(ctx, s, x + Math.cos(an) * r2, y + Math.sin(an) * r2, { size: 19, weight: 600, color: col, alpha: al * labels * a, align: 'center', spacing: 5 }); };
    lab('AT WORK', 13, '#ffcf8a', .9 + .1 * workGlow); lab('AT LEISURE', 20.5, '#b8c0e8', .8); lab('ASLEEP', 3.5, MUTED, .5, R * .62);
  }
}
export function shot14(T) {
  const T0 = T.S('05a', 'That\'s less') - .2, tLess = T.S('05a', 'less', 1), tPeople = T.S('05a', 'People feel'), tAbs = T.S('05a', 'absorbed'), tAlive = T.S('05a', 'alive'), tWork = T.S('05a', 'work than'), tCouch = T.S('05a', 'couch'), tOut = T.S('05a', 'So, those') - .3;
  const LS = RC[0] + 340;   // straight length (from x=-340 to the circle's bottom point)
  return {
    t: T0, tr: 'right', d: .5,
    draw(ctx, t) {
      ctx.drawImage(ground14(), 0, 0);
      const pull = eio(lin(tAlive + .3, tCouch, t)), k = mix(1, .8, pull), cx = mix(RC[0], 520, pull), cy = mix(RC[1], 560, pull);
      const roll = ein(lin(tOut - .35, tOut + .45, t)), rx = cx + roll * 1700, rot = roll * 1700 / (RR * k);
      // 5.14: the thread whips in from the left, slack, wraps the circle and snaps taut on "less"
      const head = mix(0, LS, eout(lin(T0 - .4, T0 + .25, t))) + 2 * Math.PI * RR * eio(lin(T0 + .1, tLess + .05, t));
      const tail = LS * eio(lin(T0 + .05, tLess + .1, t)), taut = sm(lin(tLess - .25, tLess + .1, t));
      if (taut < 1 || head < LS + 2 * Math.PI * RR - 1) {
        const pts = []; for (let s = tail; s <= head; s += 6) { if (s < LS) { const x = -340 + s, slack = (1 - taut) * 28 * Math.sin(s * .012 - t * 9) * Math.sin(Math.PI * clamp((s - tail) / Math.max(1, LS - tail))); pts.push([x, RC[1] + RR + slack]); } else { const an = Math.PI / 2 - (s - LS) / RR; pts.push([RC[0] + Math.cos(an) * RR, RC[1] + Math.sin(an) * RR]); } }
        ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = rgba(WARM, .3); ctx.lineWidth = 12; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.stroke();
        ctx.strokeStyle = '#ffe2b0'; ctx.lineWidth = 2.4; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.stroke();
        if (pts.length) spr(ctx, glowSprite(30, WARM, WHITE, 1, .3, 8), ...pts[pts.length - 1], 1, 1);
      } else {
        // 5.15: the ring
        const fadeOut = 1 - sm(lin(tOut - .4, tOut, t));
        const dial = lin(tLess + .3, tPeople + .2, t), bands = sm(lin(tPeople - .1, tAbs, t));
        const snap = Math.exp(-Math.pow((t - tLess - .08) / .12, 2));
        if (snap > .02) spr(ctx, glowSprite(200, WARM, WHITE, .5, .3, 9), RC[0], RC[1] + RR, 1, snap);
        const workGlow = Math.exp(-Math.pow((t - tWork - .15) / .35, 2)) + .3 * sm(lin(tWork, tWork + .4, t)), leisPulse = sm(lin(tCouch - .2, tCouch + .3, t));
        ring(ctx, t, rx, cy, RR * k, TK[0], { a: 1, dial, bands, pop0: tAbs, pop1: tAlive, workGlow, leisPulse, rot, labels: bands * (1 - roll) });
        // more people, more days: two further rings slide in as we pull back
        for (const [j, [x, y, R]] of [[1, [1180, 760, 130]], [2, [1500, 720, 110]]]) { const ap = sm(lin(tAlive + .5 + j * .2, tAlive + 1.1 + j * .2, t)) * fadeOut; if (ap > 0) ring(ctx, t, x + (1 - ap) * 60, y, R, TK[j], { a: ap * .85, dial: 1, bands: 1, pop0: tAlive + .7 + j * .2, pop1: tAlive + .9 + j * .2, workGlow, leisPulse }); }
        // the statement
        const a1 = sm(lin(tPeople - .2, tPeople + .4, t)) * fadeOut;
        ctx.fillStyle = rgba(WARM, a1); ctx.fillRect(1100, 166, 34, 2);
        caps(ctx, 'Moments of flow · one day, 24 hours', 1100, 210, a1);
        const a2 = eout(lin(tAbs - .1, tAbs + .5, t)) * fadeOut;
        text(ctx, 'Fully absorbed —', 1100 + (1 - a2) * 20, 300, { size: 64, font: 'Instrument Serif', color: CREAM, alpha: a2 });
        const a3 = eout(lin(tAlive + .5, tAlive + 1.1, t)) * fadeOut;
        text(ctx, 'more often at work', 1100 + (1 - a3) * 20, 372, { size: 64, font: 'Instrument Serif Italic', color: '#ffcf8a', alpha: a3 });
        text(ctx, 'than at leisure.', 1100 + (1 - a3) * 20, 444, { size: 64, font: 'Instrument Serif Italic', color: '#ffcf8a', alpha: a3 });
        src(ctx, 'Source: Csikszentmihalyi & LeFevre (1989), Optimal experience in work and leisure, Journal of Personality and Social Psychology · schematic', sm(lin(tPeople, tPeople + .6, t)) * fadeOut);
      }
      printFinish(ctx, { grain: .06, vig: .45 });
    },
  };
}

// =====================================================================================================
// 5.16 · "So, those two things that sounded alike? / Here's the difference." — the two paper strips.
// =====================================================================================================
const POLE = 540, SY = 470, SW = 1060, SH = 74;
function rose16() {
  return memo('r16', () => {
    const [c, g] = layer();
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#2a1c3c'); gr.addColorStop(.45, '#7a4058'); gr.addColorStop(.78, '#d88a84'); gr.addColorStop(1, '#f0b8a0'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    bloom(g, 1400, 900, 700, { col: '#ffb090', core: '#fff0d8', a: .45, k: .4, seed: 4, sy: .5 });
    const [hc, hx] = layer(); hx.beginPath(); for (const [y, x0, x1, th] of [[250, 700, 2100, 20], [330, -200, 900, 14], [780, 900, 2100, 16], [860, -100, 800, 12]]) stratus(hx, y, x0, x1, th, y); hx.fillStyle = rgba('#f0a8a0', .4); hx.fill(); hx.save(); hx.clip(); hatch(hx, [0, 200, W, 700], { angle: -.01, gap: 4, w: 1, col: '#ffe0d0', a: .45, seed: 5, broken: .3 }); hx.restore(); put(g, hc);
    // far bay line (the morning-stripe world of chapter 01)
    roughPoly(g, [[-20, 940], [500, 930], [900, 945], [1400, 928], [1940, 940], [1940, 1100], [-20, 1100]], '#4a2a40', { amp: 2, step: 14, seed: 6 });
    return c;
  });
}
function stripTex(label, seed) { return memo('stx' + seed, () => { const c = paper(SW, SH, { seed, col: '#f3ead8' }); const g = c.getContext('2d'); text(g, label, 70, SH * .68, { size: 46, font: 'Instrument Serif', color: '#3a2230' }); return c; }); }
const ringPaper = () => memo('rp', () => paper(400, 30, { seed: 9 }));
export function shot16(T) {
  const T0 = T.S('05a', 'So, those') - .3, tTwo = T.S('05a', 'two things'), tAlike = T.S('05a', 'alike'), tDiff = T.S('05a', 'difference'), tFall = T.S('05a', 'difference') + .5;
  return {
    t: T0, tr: 'right', d: .7,
    draw(ctx, t) {
      const c = camAt(t, [{ t: T0 - .4, x: -20, y: 0, z: 1.0 }, { t: tDiff + .5, x: 30, y: 10, z: 1.08, ease: sine }, { t: tFall + 1.4, x: 40, y: 60, z: 1.1 }], { dx: 4, dy: 3 });
      plate(ctx, rose16(), c, .5);
      ctx.save(); view(ctx, c, 1);
      // the pole the strips fly from
      roughLine(ctx, [[POLE - 8, 380], [POLE - 8, 1100]], { w: 9, col: '#2a1424', seed: 2 }); ctx.fillStyle = '#2a1424'; ctx.beginPath(); ctx.arc(POLE - 8, 378, 9, 0, 7); ctx.fill();
      roughLine(ctx, [[POLE - 5, 380], [POLE - 5, 1100]], { w: 2, col: rgba('#ffd0b0', .5), seed: 3 });
      // the ring rolls in and stops at the pole …
      const R = 70, rIn = eout(lin(T0 - .4, T0 + .5, t)), rx = mix(-300, POLE + R, rIn), unroll = eio(lin(T0 + .45, T0 + 1.05, t));
      if (unroll < 1) { ctx.save(); ctx.translate(rx, SY); const rr = R * (1 - unroll * .85); ctx.rotate((rx + 300) / R); ctx.strokeStyle = '#f3ead8'; ctx.lineWidth = SH * 2 * .45 * (1 - unroll * .3); ctx.beginPath(); ctx.arc(0, 0, rr, 0, 6.2832); ctx.stroke(); ctx.strokeStyle = 'rgba(58,34,48,.4)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, rr - SH * .4, 0, 6.2832); ctx.stroke(); ctx.restore(); }
      // … unrolls into one strip that tears lengthwise into two
      if (unroll > 0) {
        const split = eio(lin(tTwo - .2, tTwo + .5, t)), sync = sm(lin(tAlike - .3, tAlike + .3, t)), diff = eio(lin(tDiff - .15, tDiff + .7, t));
        const fall = ein(lin(tFall, tFall + .9, t));
        const len = unroll;
        const mk = (ph, amp, droop) => (u) => { const uu = u * len, w = Math.sin(uu * 7.5 - t * 5.2 + ph) * amp * uu + droop * uu * uu, dw = Math.cos(uu * 7.5 - t * 5.2 + ph); return [w, 1 - .18 * Math.abs(dw) * uu, dw * .25 * uu]; };
        const top = mk(0, 34, 0), bot = mk(mix(1.6, 0, sync) + diff * .9, 34 * (1 - diff * .5), diff * 120);
        const gap = split * 46 + diff * 70, yT = SY - SH / 2 - gap / 2 - diff * 50 + fall * 900, yB = SY + SH / 2 + gap / 2;
        const xT = POLE + fall * 160;
        // the warm one glows from behind once the difference is named
        if (diff > 0) spr(ctx, glowSprite(300, WARM, WHITE, .5, .35, 6), POLE + 520, yT, 1.6, diff * (1 - fall) * .8);
        ctx.save(); ctx.beginPath(); ctx.rect(POLE, 0, SW * len + 40, H); ctx.clip();
        stripDraw(ctx, stripTex('not having to work', 1), xT, yT, top, { slices: 110 });
        stripDraw(ctx, stripTex('not working', 2), POLE, yB, bot, { slices: 110, alpha: 1 - diff * .4 });
        ctx.restore();
        // tear seam while they are still one strip
        if (split < 1 && split > 0) { ctx.strokeStyle = rgba('#3a2230', .5 * (1 - split)); ctx.lineWidth = 1.5; ctx.beginPath(); for (let x = 0; x < SW * len; x += 8) ctx.lineTo(POLE + x, SY + (x % 16 ? 2 : -2)); ctx.stroke(); }
      }
      ctx.restore();
      printFinish(ctx, { grain: .065, vig: .42, vigCol: '#1a0814' });
    },
  };
}

// =====================================================================================================
// 5.17 · [pause] "Not having to work doesn't mean not working." — the strip settles in the potter's hands at rest.
// =====================================================================================================
const WHEEL = [1080, 760], POT = { x: 1080, y: 736, h: 190 };
function shop17() {
  return memo('sh17', () => {
    const [c, g] = layer(), r = prng(17);
    g.fillStyle = '#3a1a12'; g.fillRect(0, 0, W, H);
    { const gr = g.createRadialGradient(960, 160, 0, 960, 160, 1300); gr.addColorStop(0, 'rgba(255,190,120,.6)'); gr.addColorStop(.4, 'rgba(170,80,40,.25)'); gr.addColorStop(1, 'rgba(10,4,6,.85)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
    hatch(g, [0, 0, W, 820], { angle: .5, gap: 6, w: 1, col: '#120604', a: .22, seed: 3, broken: .45 });
    // window to the night (left), shelves of finished pots (right and left)
    roughRect(g, 140, 170, 300, 360, '#0c1030', { amp: 1.5, seed: 4 }); { const gr = g.createLinearGradient(0, 180, 0, 520); gr.addColorStop(0, '#0a0e2a'); gr.addColorStop(1, '#2a2a5e'); g.fillStyle = gr; g.fillRect(152, 182, 276, 336); }
    for (let i = 0; i < 30; i++) { g.fillStyle = rgba('#dfe8ff', .2 + .5 * r()); g.fillRect(155 + r() * 270, 185 + r() * 200, 1.4, 1.4); }
    roughRect(g, 284, 170, 10, 360, '#1a0a08', { amp: .5, seed: 5 }); roughRect(g, 140, 340, 300, 10, '#1a0a08', { amp: .5, seed: 6 });
    for (const [x0, x1] of [[1380, 1860], [560, 820]]) for (let s = 0; s < 3; s++) { const y = 260 + s * 150; roughRect(g, x0, y, x1 - x0, 12, '#2a120a', { amp: .8, seed: s + x0 });
      let x = x0 + 14; while (x < x1 - 40) { const w = 30 + r() * 40, h = 50 + r() * 70, col = mixHex('#8a4a2a', '#c8865a', r()); g.fillStyle = col; g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x - w * .2, y - h * .5, x + w * .1, y - h * .8, x + w * .3, y - h); g.lineTo(x + w * .7, y - h); g.bezierCurveTo(x + w * .9, y - h * .8, x + w * 1.2, y - h * .5, x + w, y); g.fill(); g.strokeStyle = rgba(HOT, .35); g.lineWidth = 2; g.beginPath(); g.moveTo(x + w * .72, y - h); g.bezierCurveTo(x + w * .92, y - h * .8, x + w * 1.2, y - h * .5, x + w, y); g.stroke(); x += w + 10 + r() * 14; } }
    // floor, the wheel's splash pan + column
    roughPoly(g, [[-20, 840], [W + 20, 820], [W + 20, H + 20], [-20, H + 20]], '#24100a', { amp: 2, seed: 7 });
    g.save(); g.beginPath(); g.rect(0, 820, W, 280); g.clip(); hatch(g, [0, 820, W, 280], { angle: 0, gap: 8, w: 1, col: '#0a0402', a: .3, seed: 8 }); g.restore();
    pool(g, 1000, 880, 620, 120, { col: WARM, a: .4, k: .6, seed: 9 });
    roughRect(g, WHEEL[0] - 26, WHEEL[1], 52, 120, '#1a0c08', { amp: .6, seed: 10 });
    g.fillStyle = '#3a1c10'; g.beginPath(); g.ellipse(WHEEL[0], WHEEL[1] + 40, 190, 40, 0, 0, 7); g.fill(); g.strokeStyle = rgba(HOT, .3); g.lineWidth = 2; g.beginPath(); g.ellipse(WHEEL[0], WHEEL[1] + 40, 190, 40, 0, Math.PI * 1.05, Math.PI * 1.95); g.stroke();
    cone(g, 960, 110, { spread: .42, len: 900, col: '#ffd59a', a: .2, k: .6, seed: 11, op: 'screen' });
    return c;
  });
}
function pot(ctx, x, y, h) {
  const w = h * .62;
  ctx.fillStyle = '#b8643a'; ctx.beginPath(); ctx.moveTo(x - w * .32, y); ctx.bezierCurveTo(x - w * .7, y - h * .35, x - w * .55, y - h * .7, x - w * .2, y - h * .86); ctx.lineTo(x - w * .26, y - h); ctx.lineTo(x + w * .26, y - h); ctx.lineTo(x + w * .2, y - h * .86); ctx.bezierCurveTo(x + w * .55, y - h * .7, x + w * .7, y - h * .35, x + w * .32, y); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip(); const g = ctx.createLinearGradient(x - w * .6, 0, x + w * .6, 0); g.addColorStop(0, 'rgba(255,214,160,.5)'); g.addColorStop(.45, 'rgba(255,214,160,0)'); g.addColorStop(1, 'rgba(40,10,4,.55)'); ctx.fillStyle = g; ctx.fillRect(x - w, y - h, w * 2, h);
  ctx.strokeStyle = 'rgba(70,24,10,.35)'; ctx.lineWidth = 1.5; for (let k = 1; k < 9; k++) { ctx.beginPath(); ctx.ellipse(x, y - h * k / 10, w * .7, 4, 0, 0, Math.PI); ctx.stroke(); } ctx.restore();
  ctx.fillStyle = '#5a2a14'; ctx.beginPath(); ctx.ellipse(x, y - h, w * .26, 6, 0, 0, 7); ctx.fill();
}
export function shot17(T) {
  const T0 = T.S('05b', 'Not having') - 1.1, tNot = T.S('05b', 'not working'), tEnd = T.S('05b', 'It means') - .4;
  return {
    t: T0, tr: 'down', d: 1.0,
    draw(ctx, t) {
      const c = camAt(t, [{ t: T0 - .5, x: 0, y: 30, z: 1.5, f: [960, 650] }, { t: tNot + .3, x: 0, y: 0, z: 1.72, ease: sine }, { t: tEnd + 1, x: 0, y: -4, z: 1.76 }], { dx: 3, dy: 2.5 });
      plate(ctx, shop17(), c, 1);
      ctx.save(); view(ctx, c, 1);
      spr(ctx, glowSprite(130, WARM, WHITE, .9, .4, 3), 960, 110, 1, .9 + .05 * Math.sin(t * 2.7));
      ctx.strokeStyle = '#120604'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(960, -20); ctx.lineTo(960, 92); ctx.stroke(); roughPoly(ctx, [[930, 112], [990, 112], [976, 88], [944, 88]], '#1a0a06', { amp: .4, seed: 2 });
      // clay dust drifting in the lamp light
      const r = prng(5); for (let i = 0; i < 60; i++) { const x = 760 + r() * 400 + Math.sin(t * .3 + i) * 20, y = ((r() * 700 + t * (8 + r() * 10)) % 700) + 140; ctx.fillStyle = rgba(HOT, .15 + .25 * r()); ctx.fillRect(x, y, 2, 2); }
      // the wheel head turning slowly to a stop, with the finished pot
      const spin = t * 1.2 - 0.3 * Math.max(0, t - T0) ** 1.2 * .2;
      ctx.fillStyle = '#5a3a2a'; ctx.beginPath(); ctx.ellipse(WHEEL[0], WHEEL[1], 130, 24, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,220,180,.2)'; for (let k = 0; k < 6; k++) { const an = spin + k; ctx.fillRect(WHEEL[0] + Math.cos(an) * 110 - 4, WHEEL[1] + Math.sin(an) * 20 - 1, 8, 2.5); }
      pot(ctx, POT.x, POT.y, POT.h);
      // the potter, seated, hands open in the lap: at rest, by choice
      const land = lin(tNot - .25, tNot + .1, t), recv = sm(lin(tNot - .9, tNot - .2, t)), br = Math.sin(t * 1.6) * .012;
      const hipX = 830, hipY = 770, s = 2.25;
      roughRect(ctx, hipX - 60, hipY + 10, 120, 18, '#2a1208', { amp: .6, seed: 3 }); roughRect(ctx, hipX - 50, hipY + 26, 14, 90, '#1a0a06', { amp: .4, seed: 4 }); roughRect(ctx, hipX + 36, hipY + 26, 14, 90, '#1a0a06', { amp: .4, seed: 5 });
      const fig = person(ctx, hipX, hipY, s, { lean: .18 + br, head: .42 - recv * .1 + .03 * Math.sin(t * .7), sh: [.75 + recv * .2, .55 + recv * .2], el: [1.05 - recv * .1, 1.0], hip: [1.45, 1.4], kn: [1.4, 1.35], hair: 'bun', coat: .4 },
        { dress: { coat: '#6a3a5a', pants: '#3a2030', shoes: '#140808', skin: '#c98e6a', hair: '#1a0e0a' }, light: { x: 960, y: 110, col: '#ffd59a', a: .6 }, rim: HOT, rimSide: 1, rimW: 3, shadeA: .1 });
      const [hx, hy] = fig.hand(0);
      // clay on the apron/hands: small marks
      ctx.fillStyle = 'rgba(184,100,58,.6)'; ctx.beginPath(); ctx.arc(hx - 4, hy + 2, 5, 0, 7); ctx.fill();
      // the strip: falls in from above, folding like an accordion into a small card, settles in her hands
      const fu = lin(T0 - .3, tNot, t), fx = mix(1250, hx + 6, sine(fu)) + Math.sin(t * 2.4) * 40 * (1 - fu), fy = mix(-160, hy - 18, eout(fu) * .25 + sine(fu) * .75);
      const folds = 8, wid = mix(320, 196, sm(fu)), seg = wid / folds, zig = mix(4, 12, sm(fu)), rot = (1 - fu) * Math.sin(t * 1.9) * .5;
      ctx.save(); ctx.translate(fx, fy); ctx.rotate(rot);
      for (let i = 0; i < folds; i++) { const x0 = -wid / 2 + i * seg; ctx.fillStyle = i % 2 ? '#e8dcc4' : '#fbf2dc'; ctx.beginPath(); ctx.moveTo(x0, -22 + (i % 2 ? zig * .3 : 0)); ctx.lineTo(x0 + seg + .5, -22 + (i % 2 ? 0 : zig * .3)); ctx.lineTo(x0 + seg + .5, 22 - (i % 2 ? 0 : zig * .3)); ctx.lineTo(x0, 22 - (i % 2 ? zig * .3 : 0)); ctx.fill(); }
      text(ctx, 'not having to work', 0, 8, { size: 23, font: 'Instrument Serif', color: '#3a2230', align: 'center' });
      ctx.restore();
      if (land > 0) spr(ctx, glowSprite(90, WARM, WHITE, .6, .35, 7), hx + 6, hy - 18, 1, Math.sin(Math.PI * Math.min(1, land)) * .8 + .25 * sm(land));
      ctx.restore();
      printFinish(ctx, { grain: .075, vig: .5, vigCol: '#0e0404' });
    },
  };
}
