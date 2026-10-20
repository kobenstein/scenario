// C02 kit (Film 4 minute 1 · chunk c02, shots 2.01–2.07): the static artefacts of the take in lib/m1x_c02_take.mjs. Every cache is built
// once and handed to the renderer as a decoded Image (toImg / best from lib/sc01_m1_open.mjs: no drawImage(<Canvas>) per frame once
// ready() has run); the live parts (light, particles, people, camera) are drawn per frame by the take.
//   nightBG(ctx, t, o)        deep indigo plate (cream hairlines, a faint guilloche sweep). o.dx / o.dy offset it, o.s scales it about
//                             the frame centre (default 1). The plate has a 420 px margin (was 180; the old plate sits at the same place,
//                             so the picture at dx = dy = 0, s = 1 is unchanged), so parallax and a zoom down to ~0.75 stay covered.
//   motes(ctx, t, seed, n, a, col, box)    drifting dust specks (additive, screen space)
//   VIG, SHEET, sheetLayer(K)              the floating sheet that carries c01's wall picture (used by lib/m1x_bridge.mjs b12)
//   STAGE, trussImg(), floorImg(), lectern(), screenBG(), ringImg(k), audienceRow(ctx, k, t, o)   the conference stage (2.02, 2.03)
//   RULER, yearX(y), rulerLayer()          the engraved timeline ruler (2.04, 2.05)
//   ifSeal(ctx, x, y, r, t, o)             the foil seal with the engraved word IF (o.wipe 0..1: engraved round by the burin)
//   STEP, slabLayer(i)                     one stair slab, its engraving finer with every step (2.06, 2.07)
//   warmKit()                              builds every cache (await ready() afterwards)
import { W, H, rgba, clamp, mix, prng, canvas } from '../engine.mjs';
import { Path2D } from '@napi-rs/canvas';
import { stipple, vnoise } from './art.mjs';
import { guilloche, microtext, microRing, FOIL } from './certificate.mjs';
import { paperSheet } from './paper.mjs';
import { fibreFill } from './print.mjs';
import { life } from './figure.mjs';
import { toImg, best } from './sc01_m1_open.mjs';

export const TAU = Math.PI * 2;
export const AMBER = '#ffb35c', CORE = '#fff1d6', CREAM = '#f3efe2', PAPER = '#ece2c9', INK = '#241d2a', NIGHT = '#0b0f2a', ICE = '#cfe9ff', CYAN = '#8fe6ff';
const CACHE = new Map();
export function once(key, f) { if (!CACHE.has(key)) CACHE.set(key, f()); return CACHE.get(key); }
// a cached raster as a decoded Image (the Canvas only until ready() has resolved its decode)
export const imgOnce = (key, f) => best(once(key, () => toImg(f())));
export const strokePoly = (g, P, close = false) => { if (P.length < 2) return; g.beginPath(); g.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) g.lineTo(P[i][0], P[i][1]); if (close) g.closePath(); g.stroke(); };

// ---------------------------------------------------------------- ground
const NM = 420;
function nightPlate() {
  return imgOnce('night', () => {
    const w = W + NM * 2, h = H + NM * 2, [c, g] = canvas(w, h), w0 = W + 360, h0 = H + 360, x0 = 180 - NM, y0 = 180 - NM;
    g.translate(NM - 180, NM - 180);   // the old plate's coordinates (it was W+360 × H+360, drawn at -180)
    const bg = g.createRadialGradient(w0 * .48, h0 * .42, 0, w0 * .5, h0 * .5, w0 * .72); bg.addColorStop(0, '#1d1f4a'); bg.addColorStop(.55, '#121436'); bg.addColorStop(1, '#06071a');
    g.fillStyle = bg; g.fillRect(x0, y0, w, h);
    g.save(); g.globalAlpha = .045; g.strokeStyle = CREAM; g.lineWidth = .8;
    for (let y = -h0 - 7 * 150; y < h0 * 2 + 7 * 150; y += 7) { g.beginPath(); g.moveTo(x0, y + x0 * .3); g.lineTo(x0 + w, y + (x0 + w) * .3); g.stroke(); }
    g.restore();
    const G = guilloche({ R: 980, A: 120, B: 40, n: 9, m: 4, lines: 20 }); g.save(); g.translate(w0 * .55, h0 * 1.3); g.strokeStyle = rgba(CREAM, .04); g.lineWidth = 1;
    for (let k = 0; k < G.lines; k++) strokePoly(g, G.line(k)); g.restore();
    return c;
  });
}
export function nightBG(ctx, t, o = {}) {
  const L = nightPlate(), s = o.s ?? 1, dx = o.dx ?? 0, dy = o.dy ?? 0;
  ctx.fillStyle = NIGHT; ctx.fillRect(0, 0, W, H);
  if (s === 1) ctx.drawImage(L, -NM + dx, -NM + dy);
  else { ctx.save(); ctx.translate(W / 2 + dx, H / 2 + dy); ctx.scale(s, s); ctx.drawImage(L, -W / 2 - NM, -H / 2 - NM); ctx.restore(); }
}
export function motes(ctx, t, seed, n, a, col = '255,226,190', box = [0, 0, W, H]) {
  const r = prng(seed); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const x0 = r() * box[2], y0 = r() * box[3], sp = 5 + r() * 14, ph = r() * 9, z = r() < .85 ? 1.3 : 2.4, al = (.08 + .3 * r()) * a;
    const x = box[0] + ((x0 + t * sp) % box[2] + box[2]) % box[2], y = box[1] + ((y0 + Math.sin(t * .5 + ph) * 16 - t * 6) % box[3] + box[3]) % box[3];
    ctx.fillStyle = `rgba(${col},${al})`; ctx.fillRect(x, y, z, z);
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the sheet (2.01)
// vignette units: 0..VIG.w × 0..VIG.h = c01's full frame / DEPTH (lib/m1x_bridge.mjs); the sheet carries the vignette at SHEET.vx, SHEET.vy
export const VIG = { w: 600, h: 337.5, slip: { x: 104, y: 100, w: 200, h: 105, rot: -.045 }, q: { x: 420, y: 168, s: 1 } };
export const SHEET = { w: 820, h: 590, vx: 110, vy: 74 };
export function sheetLayer(K = 2) {
  return once('sheet' + K, () => {
    const pad = 60, [c, g] = canvas(Math.ceil((SHEET.w + pad * 2) * K), Math.ceil((SHEET.h + pad * 2) * K)); g.scale(K, K); g.translate(pad, pad);
    paperSheet(g, 0, 0, SHEET.w, SHEET.h, { seed: 12, tone: '#e9dfc6', light: [SHEET.w * .3, SHEET.h * .2], shadow: false });
    // engraved double frame around the plate mark and around the vignette
    g.strokeStyle = rgba('#5a4a36', .5); g.lineWidth = 1; g.strokeRect(34, 30, SHEET.w - 68, SHEET.h - 60); g.lineWidth = .6; g.strokeRect(40, 36, SHEET.w - 80, SHEET.h - 72);
    g.strokeStyle = rgba('#3a2e22', .7); g.lineWidth = 1.4; g.strokeRect(SHEET.vx - 8, SHEET.vy - 8, VIG.w + 16, VIG.h + 16); g.lineWidth = .7; g.strokeRect(SHEET.vx - 13, SHEET.vy - 13, VIG.w + 26, VIG.h + 26);
    // caption: microtext rules and an unreadable title in the plate's margin (no invented words)
    microtext(g, SHEET.vx, SHEET.vy + VIG.h + 40, VIG.w, 'YOUR INCOME · EVERY MONTH', { size: 6, col: '#5a4a36', a: .65 });
    microtext(g, SHEET.vx + 80, SHEET.vy + VIG.h + 64, VIG.w - 160, 'FOR THE REST OF YOUR LIFE', { size: 6, col: '#5a4a36', a: .5 });
    for (const [x, y] of [[62, 58], [SHEET.w - 62, 58], [62, SHEET.h - 58], [SHEET.w - 62, SHEET.h - 58]]) { const G = guilloche({ R: 13, A: 4, B: 1.6, n: 9, m: 4, lines: 10 }); g.save(); g.translate(x, y); g.strokeStyle = rgba('#7a5a34', .55); g.lineWidth = .5; for (let k = 0; k < G.lines; k++) strokePoly(g, G.line(k)); g.restore(); }
    return { c, pad, K };
  });
}

// ---------------------------------------------------------------- the conference stage (2.02, 2.03)
// stage units = screen pixels at the camera { cx 960, cy 540, s 1 }; the back of the hall is the night plate itself (no wall raster),
// so every part of the stage stands in the same dark the floating sheet was in, and the camera reveals them by pulling back.
export const STAGE = {
  scr: { x: 700, y: 112, w: 880, h: 495 }, lect: { x: 470, top: 628, bot: 792 }, floor: { back: 712, lip: 806, riser: 866 },
  spot: { x: 300, y: 64 }, pool: { x: 470, y: 776, rx: 168, ry: 26 }, lamps: [300, 620, 980, 1340, 1700], x0: -140, x1: 2060,
};
const TK = 1.5, TR = { x: -140, y: 14, w: 2200, h: 84 };
// the lighting truss: two tube rails, a welded lattice, lamp housings with dark lenses (the first one is the spot)
export function trussImg() {
  return imgOnce('truss', () => {
    const [c, g] = canvas(Math.ceil(TR.w * TK), Math.ceil(TR.h * TK)); g.scale(TK, TK); g.translate(-TR.x, -TR.y);
    for (const y of [30, 52]) { g.strokeStyle = '#05060f'; g.lineWidth = 4.2; g.beginPath(); g.moveTo(TR.x, y); g.lineTo(TR.x + TR.w, y); g.stroke(); g.strokeStyle = rgba('#a7acd6', .3); g.lineWidth = 1; g.beginPath(); g.moveTo(TR.x, y - 1.4); g.lineTo(TR.x + TR.w, y - 1.4); g.stroke(); }
    g.strokeStyle = rgba('#a7acd6', .2); g.lineWidth = .9; for (let x = TR.x; x < TR.x + TR.w; x += 22) { g.beginPath(); g.moveTo(x, 31); g.lineTo(x + 22, 51); g.moveTo(x + 22, 31); g.lineTo(x, 51); g.stroke(); }
    for (const x of STAGE.lamps) {
      g.strokeStyle = '#06070f'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(x - 9, 52); g.lineTo(x - 9, 60); g.moveTo(x + 9, 52); g.lineTo(x + 9, 60); g.stroke();   // the yoke
      g.save(); g.translate(x, 66); g.rotate(x === STAGE.spot.x ? .22 : 0);
      g.fillStyle = '#0a0b1c'; g.beginPath(); g.roundRect(-17, -9, 34, 22, 5); g.fill(); g.strokeStyle = rgba('#a7acd6', .28); g.lineWidth = 1; g.stroke();
      g.fillStyle = '#05060c'; g.beginPath(); g.ellipse(0, 13, 12, 3.2, 0, 0, TAU); g.fill(); g.strokeStyle = rgba('#c9cfee', .22); g.stroke();   // the lens
      g.restore();
    }
    return c;
  });
}
export const truss = { K: TK, x: TR.x, y: TR.y, w: TR.w, h: TR.h };
// the stage platform: engraved planks in perspective, the front lip, the dark riser; transparent below (the hall is the night)
const FK = 1.5, FR = { x: -140, y: 704, w: 2200, h: 170 };
export function floorImg() {
  return imgOnce('floor', () => {
    const F = STAGE.floor, [c, g] = canvas(Math.ceil(FR.w * FK), Math.ceil(FR.h * FK)); g.scale(FK, FK); g.translate(-FR.x, -FR.y);
    const fg = g.createLinearGradient(0, F.back, 0, F.lip); fg.addColorStop(0, '#141330'); fg.addColorStop(1, '#241f3a'); g.fillStyle = fg; g.fillRect(FR.x, F.back, FR.w, F.lip - F.back);
    g.save(); g.strokeStyle = rgba('#c9b99a', .08); g.lineWidth = 1; const vx = 1000, vy = 200, k1 = (F.back - vy) / (F.lip - vy);
    for (let x = -1600; x < W + 1800; x += 70) { g.beginPath(); g.moveTo(vx + (x - vx) * k1, F.back); g.lineTo(x, F.lip); g.stroke(); }
    g.strokeStyle = rgba('#c9b99a', .05); for (const y of [730, 752, 777]) { g.beginPath(); g.moveTo(FR.x, y); g.lineTo(FR.x + FR.w, y); g.stroke(); }
    g.restore();
    g.strokeStyle = rgba('#e9dcc0', .12); g.beginPath(); g.moveTo(FR.x, F.back + .5); g.lineTo(FR.x + FR.w, F.back + .5); g.stroke();
    g.fillStyle = '#0c0b1d'; g.fillRect(FR.x, F.lip, FR.w, 12); g.strokeStyle = rgba('#e9dcc0', .2); g.beginPath(); g.moveTo(FR.x, F.lip); g.lineTo(FR.x + FR.w, F.lip); g.stroke();
    const rg = g.createLinearGradient(0, F.lip + 12, 0, F.riser); rg.addColorStop(0, '#08081a'); rg.addColorStop(1, '#05050f'); g.fillStyle = rg; g.fillRect(FR.x, F.lip + 12, FR.w, F.riser - F.lip - 12);
    g.save(); g.strokeStyle = rgba('#8c93c8', .05); for (let x = FR.x; x < FR.x + FR.w; x += 6) { g.beginPath(); g.moveTo(x, F.lip + 13); g.lineTo(x, F.riser); g.stroke(); } g.restore();
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .35, g: 1, seed: 9, mid: false, boost: 1.3 });
    return c;
  });
}
export const floorR = { K: FK, x: FR.x, y: FR.y, w: FR.w, h: FR.h };
// an engraved wooden lectern with a guilloche roundel (2x raster + its dark silhouette for the unlit state); x = centre, y = floor line
export function lectern() {
  return once('lectern', () => {
    const w = 190, h = 190, pad = 30, K = 2, mk = (dark) => {
      const [c, g] = canvas((w + pad * 2) * K, (h + pad * 2) * K); g.scale(K, K); g.translate(pad + w / 2, pad);
      const body = [[-62, 26], [62, 26], [74, h], [-74, h]];
      const wg = g.createLinearGradient(-74, 0, 74, 0); wg.addColorStop(0, '#2a1a12'); wg.addColorStop(.35, '#4a2e1c'); wg.addColorStop(.75, '#2f1d14'); wg.addColorStop(1, '#180e0a');
      g.fillStyle = dark ? '#07060d' : wg; g.beginPath(); body.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fill();
      if (!dark) {
        g.save(); g.clip(); g.strokeStyle = 'rgba(10,5,3,.55)'; g.lineWidth = 1.1; for (let k = -9; k <= 9; k++) { g.beginPath(); g.moveTo(k * 6.6, 26); g.lineTo(k * 7.9, h); g.stroke(); }
        g.strokeStyle = 'rgba(255,214,160,.10)'; for (let k = -9; k <= 9; k++) { g.beginPath(); g.moveTo(k * 6.6 + 2, 26); g.lineTo(k * 7.9 + 2.4, h); g.stroke(); } g.restore();
      }
      g.fillStyle = dark ? '#09080f' : '#5a3820'; g.beginPath(); g.moveTo(-80, 26); g.lineTo(80, 26); g.lineTo(70, 4); g.lineTo(-70, 4); g.closePath(); g.fill();
      if (!dark) {
        g.strokeStyle = 'rgba(255,220,170,.35)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-70, 4); g.lineTo(70, 4); g.stroke();
        g.save(); g.translate(0, 92); const G = guilloche({ R: 22, A: 6, B: 2.5, n: 11, m: 4, lines: 14 }); g.strokeStyle = 'rgba(255,200,130,.5)'; g.lineWidth = .7; for (let k = 0; k < G.lines; k++) strokePoly(g, G.line(k)); g.beginPath(); g.arc(0, 0, 31, 0, TAU); g.stroke(); g.restore();
      }
      g.strokeStyle = '#1a1a22'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(40, 6); g.bezierCurveTo(46, -16, 30, -30, 14, -34); g.stroke(); g.fillStyle = '#20202a'; g.beginPath(); g.ellipse(12, -35, 6, 4, -.4, 0, TAU); g.fill();
      return toImg(c);
    };
    return { c: mk(false), dark: mk(true), w, h, pad, K };
  });
}
// the stage screen's keynote picture: deep blue ground with fine scanlines (2x raster) and two guilloche rings drawn live (rotating)
export function screenBG() {
  return imgOnce('scrBG', () => {
    const S = STAGE.scr, K = 2, [c, g] = canvas(S.w * K, S.h * K); g.scale(K, K);
    const bg = g.createRadialGradient(S.w * .5, S.h * .5, 0, S.w * .5, S.h * .5, S.w * .62); bg.addColorStop(0, '#2a52a0'); bg.addColorStop(.55, '#11275e'); bg.addColorStop(1, '#071029'); g.fillStyle = bg; g.fillRect(0, 0, S.w, S.h);
    g.save(); g.translate(S.w / 2, S.h / 2); g.strokeStyle = rgba(ICE, .07); g.lineWidth = .8; for (let k = 1; k < 30; k++) { g.beginPath(); g.arc(0, 0, k * 17, 0, TAU); g.stroke(); } g.restore();
    g.strokeStyle = rgba(ICE, .1); g.lineWidth = .8; for (let y = 0; y < S.h; y += 3) { g.beginPath(); g.moveTo(0, y); g.lineTo(S.w, y); g.stroke(); }
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .35, g: 1, seed: 6, mid: false, boost: 1.3 });
    return c;
  });
}
const RINGS = [{ R: 150, A: 46, B: 18, n: 22, m: 7, lines: 40, col: ICE, a: .55, w: .9 }, { R: 238, A: 14, B: 6, n: 60, m: 9, lines: 12, col: CYAN, a: .36, w: .9 }];
export function ringImg(k) {
  return once('ring' + k, () => {
    const o = RINGS[k], K = 2, rr = o.R + o.A + o.B + 6, [c, g] = canvas(Math.ceil(rr * 2 * K), Math.ceil(rr * 2 * K)); g.scale(K, K); g.translate(rr, rr);
    const G = guilloche(o); g.strokeStyle = rgba(o.col, o.a); g.lineWidth = o.w; for (let i = 0; i < G.lines; i++) strokePoly(g, G.line(i));
    return { c: toImg(c), r: rr, K };
  });
}
// the audience seen from behind: three rows of heads and shoulders, every head alive (breath, a glance now and then), rim-lit on top by
// the screen (cool) and the spot (warm). Row k = 0 near … 2 far, in stage units at the camera { 960, 540, 1 } (the take adds parallax).
const ROWS = [{ y: 1075, r: 74, gap: 235, seed: 3, x0: -90, col: '#040410' }, { y: 960, r: 44, gap: 128, seed: 5, x0: -30, col: '#06071a' }, { y: 884, r: 27, gap: 78, seed: 8, x0: 10, col: '#0a0b22' }];
const HEADS = ROWS.map((R, k) => {
  const r = prng(R.seed), out = [];
  for (let x = R.x0 - 260; x < W + 300; x += R.gap * (.8 + r() * .45)) {
    if (r() < .12) { x += R.gap * .5; continue; }
    out.push({ x, hr: R.r * (.86 + r() * .28), hy: R.y - R.r * .9 + (r() - .5) * R.r * .35, swk: 2.5 + r() * .5, bun: r() < .25, lean: (r() - .5) * .12, seed: k * 40 + out.length, ph: r() * TAU, sp: .3 + r() * .4 });
  }
  return out;
});
// o: { cool 0..1 (screen light on the rims), warm 0..1 (spot light, falls off with distance from warmX), warmX }
export function audienceRow(ctx, k, t, o = {}) {
  const R = ROWS[k], cool = o.cool ?? 0, warm = o.warm ?? 0, wx = o.warmX ?? 470, base = R.y + R.r * 3;
  ctx.save(); ctx.fillStyle = R.col; ctx.lineCap = 'round';
  const P = HEADS[k].map((q) => {
    const L = life(t, q.seed), b = L.b, sway = Math.sin(t * q.sp + q.ph) * .016 * q.hr;
    return { ...q, hx: q.x + sway + L.turn * q.hr * .1, hy: q.hy - b * q.hr * .012, sh: q.hy + b * q.hr * .008, tilt: q.lean + L.turn * .05 };
  });
  ctx.beginPath();
  for (const q of P) {
    const { x, hr } = q, sw = hr * q.swk, hy = q.sh;
    ctx.moveTo(x - sw, base); ctx.bezierCurveTo(x - sw, hy + hr * 1.6, x - sw * .55, hy + hr * 1.05, x - hr * .45, hy + hr * .9);
    ctx.lineTo(x + hr * .45, hy + hr * .9); ctx.bezierCurveTo(x + sw * .55, hy + hr * 1.05, x + sw, hy + hr * 1.6, x + sw, base); ctx.closePath();
    ctx.moveTo(q.hx + hr, q.hy); ctx.ellipse(q.hx, q.hy, hr * .86, hr, q.tilt, 0, TAU);
    if (q.bun) { ctx.moveTo(q.hx + hr * .45, q.hy - hr * .95); ctx.arc(q.hx, q.hy - hr * .95, hr * .4, 0, TAU); }
  }
  ctx.fill();
  // rims: the top of each head and the shoulder lines catch the light
  const rim = (col, a, sel) => {
    if (a <= .005) return; ctx.strokeStyle = col; ctx.lineWidth = [3, 2.4, 1.8][k];
    for (const q of P) {
      const f = sel(q); if (f <= .01) continue; ctx.globalAlpha = a * f; const { hr } = q, sw = hr * q.swk, hy = q.sh;
      ctx.beginPath(); ctx.ellipse(q.hx, q.hy, hr * .86, hr, q.tilt, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(q.x - sw * .92, hy + hr * 1.75); ctx.bezierCurveTo(q.x - sw * .8, hy + hr * 1.2, q.x - sw * .5, hy + hr * 1.03, q.x - hr * .5, hy + hr * .92);
      ctx.moveTo(q.x + hr * .5, hy + hr * .92); ctx.bezierCurveTo(q.x + sw * .5, hy + hr * 1.03, q.x + sw * .8, hy + hr * 1.2, q.x + sw * .92, hy + hr * 1.75); ctx.stroke();
    }
  };
  rim('#b8e4ff', .72 * cool, (q) => clamp(1 - Math.abs(q.x - 1140) / 1500));
  rim('#ffc98a', .5 * warm, (q) => clamp(1 - Math.abs(q.x - wx) / 700));
  ctx.restore();
}

// ---------------------------------------------------------------- the timeline ruler (2.04, 2.05)
export const RULER = { y: 520, h: 132, x0: 230, px: 72, y0: 2025, y1: 2045, left: -260, right: 3700 };
export const yearX = (yr) => RULER.x0 + (yr - RULER.y0) * RULER.px;
export function rulerLayer() {
  return once('ruler', () => {
    const { h, left, right } = RULER, w = right - left, pad = 30, [c, g] = canvas(w + pad * 2, h + pad * 2); g.translate(pad - left, pad + h / 2);   // origin: x world, y = ruler centre
    // the strip: cream paper, rough edges, light from the upper left
    const edge = []; const n = vnoise(21); for (let x = left; x <= right; x += 10) edge.push([x, -h / 2 + n(x * .05, 0) * 1.2]); for (let x = right; x >= left; x -= 10) edge.push([x, h / 2 + n(x * .05, 40) * 1.2]);
    g.save(); g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 18; g.shadowOffsetY = 10; g.fillStyle = PAPER; g.beginPath(); edge.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fill(); g.restore();
    const pg = g.createLinearGradient(0, -h / 2, 0, h / 2); pg.addColorStop(0, 'rgba(255,250,236,.5)'); pg.addColorStop(.6, 'rgba(255,250,236,0)'); pg.addColorStop(1, 'rgba(120,96,64,.25)'); g.fillStyle = pg; g.beginPath(); edge.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fill();
    g.save(); g.beginPath(); edge.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); fibreFill(g, .45); g.restore();
    for (const [yc, band] of [[-h / 2 + 15, 13], [h / 2 - 15, 13]]) {
      g.strokeStyle = rgba('#3d4a63', .55); g.lineWidth = .7;
      for (let k = 0; k < 6; k++) { const ph = k / 6 * TAU; g.beginPath(); for (let x = left; x <= right; x += 2) { const q = x * .085, d = band * .42 * (Math.sin(q + ph) * .75 + Math.sin(q * 2.03 - ph * 1.5) * .25); x === left ? g.moveTo(x, yc + d) : g.lineTo(x, yc + d); } g.stroke(); }
      g.lineWidth = 1; g.strokeStyle = rgba('#3d4a63', .6); for (const o of [-band * .55, band * .55]) { g.beginPath(); g.moveTo(left, yc + o); g.lineTo(right, yc + o); g.stroke(); }
    }
    microtext(g, left, -h / 2 + 28, w, 'YEARS FROM NOW', { size: 5.5, col: '#3d4a63', a: .55 });
    g.save(); g.strokeStyle = rgba('#3d2c1c', .16); g.lineWidth = .8; for (let x = left; x < right; x += 4) { g.beginPath(); g.moveTo(x, h / 2 - 30); g.lineTo(x + 8, h / 2 - 3); g.stroke(); } g.restore();
    // the scale on its own layer (the burin engraves it from left to right)
    const [sc, sg] = canvas(c.width, c.height); sg.translate(pad - left, pad + h / 2); scale(sg);
    return { c: toImg(c), sc: toImg(sc), pad, left, w: c.width, h: c.height };
  });
}
function scale(g) {
  const { left, right } = RULER, ink = INK, yb = 0;
  g.strokeStyle = rgba(ink, .8); g.lineWidth = 1.2; g.beginPath(); g.moveTo(left, yb); g.lineTo(right, yb); g.stroke();
  for (let yr = 2016; yr <= 2054; yr++) {
    const x = yearX(yr), big = yr % 5 === 0; g.lineWidth = big ? 2 : 1.1; g.beginPath(); g.moveTo(x, yb); g.lineTo(x, yb - (big ? 34 : 17)); g.stroke();
    g.lineWidth = .6; for (let q = 1; q < 4; q++) { const xx = x + q * RULER.px / 4; g.beginPath(); g.moveTo(xx, yb); g.lineTo(xx, yb - 7); g.stroke(); }
    if (big) { g.font = '400 34px "Instrument Serif"'; g.fillStyle = rgba(ink, .9); g.textAlign = 'center'; g.fillText(String(yr), x, yb + 34); }
  }
}

// ---------------------------------------------------------------- the IF seal (2.05)
function sealBody(r) {
  return once('ifseal' + r, () => {
    const S = Math.ceil(r * 2.8), [c, g] = canvas(S, S); g.translate(S / 2, S / 2);
    // the film's seal (copied from certificate.seal, with the foil stipple placed correctly): scallops, emboss, foil, rings, ring microtext
    const scal = 36, edge = (gg, rr) => { gg.beginPath(); for (let i = 0; i <= 360; i++) { const a = i / 360 * TAU, q = rr * (1 + .035 * Math.cos(scal * a)); i ? gg.lineTo(Math.cos(a) * q, Math.sin(a) * q) : gg.moveTo(Math.cos(a) * q, Math.sin(a) * q); } gg.closePath(); };
    g.save(); g.translate(-r * .025, -r * .025); edge(g, r); g.fillStyle = '#ffe9c0'; g.fill(); g.restore();
    g.save(); g.translate(r * .035, r * .04); edge(g, r); g.fillStyle = 'rgba(70,30,8,.85)'; g.fill(); g.restore();
    edge(g, r); const fg = g.createLinearGradient(-r, -r, r, r); FOIL.forEach((col, i) => fg.addColorStop(i / (FOIL.length - 1), col)); g.fillStyle = fg; g.fill();
    g.strokeStyle = 'rgba(90,40,10,.75)'; g.lineWidth = Math.max(.8, r * .012); for (const q of [.9, .72, .7]) { g.beginPath(); g.arc(0, 0, r * q, 0, TAU); g.stroke(); }
    microRing(g, 0, 0, r * .81, 'IF AI AND ROBOTS KEEP GETTING BETTER', { size: Math.max(5, r * .085), col: '#5a2a08', a: .8 });
    { const [nc, nx] = canvas(S, S); nx.translate(S / 2, S / 2); edge(nx, r); nx.fillStyle = 'rgba(255,240,200,.35)'; nx.fill(); nx.setTransform(1, 0, 0, 1, 0, 0); stipple(nc, { k: 1, g: 1.4, seed: 5, mid: false, boost: 1.4 });
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'overlay'; g.drawImage(nc, 0, 0); g.restore(); }
    const cg = g.createRadialGradient(-r * .2, -r * .25, 0, 0, 0, r * .66); cg.addColorStop(0, '#ffe7b8'); cg.addColorStop(.6, '#d98d3c'); cg.addColorStop(1, '#8a4416'); g.fillStyle = cg; g.beginPath(); g.arc(0, 0, r * .64, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(90,40,10,.6)'; g.lineWidth = Math.max(.8, r * .01); for (let k = 0; k < 26; k++) { g.beginPath(); g.arc(0, 0, r * (.2 + k * .017), 0, TAU); g.stroke(); }
    g.font = `400 ${Math.round(r * .82)}px "Instrument Serif"`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = 'rgba(70,28,6,.85)'; g.fillText('IF', r * .025, r * .1); g.fillStyle = 'rgba(255,246,222,.95)'; g.fillText('IF', -r * .015, r * .055);
    g.fillStyle = '#b5621f'; g.fillText('IF', 0, r * .075);
    return toImg(c);
  });
}
export function ifSeal(ctx, x, y, r, t, o = {}) {
  const wipe = clamp(o.wipe ?? 1), a = o.a ?? 1; if (a <= 0 || wipe <= 0) return;
  const body = sealBody(r), im = best(body), S = body.width;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.globalAlpha = a;
  if (wipe < 1) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, S, -Math.PI / 2, -Math.PI / 2 + wipe * TAU); ctx.closePath(); ctx.clip(); }
  ctx.drawImage(im, -S / 2, -S / 2);
  // a slow foil glint across the face
  if (o.glint != null) { const p = o.glint, gx = mix(-r * 1.4, r * 1.4, p), gg = ctx.createLinearGradient(gx - r * .4, -r, gx + r * .4, r); gg.addColorStop(0, 'rgba(255,240,210,0)'); gg.addColorStop(.5, `rgba(255,248,232,${.55 * Math.sin(Math.PI * clamp(p))})`); gg.addColorStop(1, 'rgba(255,240,210,0)');
    ctx.globalCompositeOperation = 'lighter'; ctx.beginPath(); ctx.arc(0, 0, r * 1.02, 0, TAU); ctx.clip(); ctx.fillStyle = gg; ctx.fillRect(-r * 1.2, -r * 1.2, r * 2.4, r * 2.4); }
  ctx.restore();
}

// ---------------------------------------------------------------- the staircase (2.06, 2.07)
// slab i: an engraved plate floating as a step; front face RUN × TH, top face with depth vector D; finer engraving with every i
export const STEP = { run: 172, rise: 112, th: 46, D: [64, -40], n: 14 };
export function slabLayer(i) {
  return once('slab' + i, () => {
    const { run, th, D } = STEP, pad = 24, w = run + D[0] + pad * 2, h = th - D[1] + pad * 2, [c, g] = canvas(w, h); g.translate(pad, pad - D[1]);   // origin = front face top-left
    const gap = Math.max(1.7, 6.2 * Math.pow(.82, i)), waves = 10 + i * 4;
    const top = new Path2D(); top.moveTo(0, 0); top.lineTo(run, 0); top.lineTo(run + D[0], D[1]); top.lineTo(D[0], D[1]); top.closePath();
    const tg = g.createLinearGradient(0, 0, run + D[0], D[1]); tg.addColorStop(0, '#e9dcbf'); tg.addColorStop(1, '#fff3da'); g.fillStyle = tg; g.fill(top);
    g.save(); g.clip(top); g.strokeStyle = rgba('#7a5a34', .35); g.lineWidth = .6; for (let k = 0; k < 5; k++) { const q = (k + 1) / 6; g.beginPath(); g.moveTo(D[0] * q, D[1] * q); g.lineTo(run + D[0] * q, D[1] * q); g.stroke(); } g.restore();
    const side = new Path2D(); side.moveTo(run, 0); side.lineTo(run + D[0], D[1]); side.lineTo(run + D[0], D[1] + th); side.lineTo(run, th); side.closePath();
    g.fillStyle = '#5b4a3a'; g.fill(side); g.save(); g.clip(side); g.strokeStyle = 'rgba(20,12,8,.55)'; g.lineWidth = .8; for (let k = -40; k < 80; k += 3.2) { g.beginPath(); g.moveTo(run + k, -40); g.lineTo(run + k + 40, 60); g.stroke(); } g.restore();
    const front = new Path2D(); front.rect(0, 0, run, th);
    const fg = g.createLinearGradient(0, 0, 0, th); fg.addColorStop(0, '#d9ccb0'); fg.addColorStop(1, '#a8977a'); g.fillStyle = fg; g.fill(front);
    g.save(); g.clip(front); g.strokeStyle = rgba(INK, .72); g.lineWidth = Math.max(.45, gap * .22); for (let y = gap * .5; y < th; y += gap) { g.beginPath(); for (let x = 0; x <= run; x += 3) { const yy = y + Math.sin(x * .05 + y) * .6; x ? g.lineTo(x, yy) : g.moveTo(x, yy); } g.stroke(); }
    g.strokeStyle = rgba('#2a3550', .65); g.lineWidth = .55; for (let k = 0; k < 3; k++) { const ph = k / 3 * TAU; g.beginPath(); for (let x = 0; x <= run; x += 1.5) { const yy = th * .5 + th * .22 * Math.sin(x / run * waves * TAU / 2 + ph); x ? g.lineTo(x, yy) : g.moveTo(x, yy); } g.stroke(); }
    g.restore();
    g.strokeStyle = rgba('#2a1d14', .7); g.lineWidth = 1; g.strokeRect(0, 0, run, th);
    const eg = g.createLinearGradient(0, 0, run, 0); FOIL.forEach((col, k) => eg.addColorStop(k / (FOIL.length - 1), col)); g.strokeStyle = eg; g.lineWidth = 2.2; g.beginPath(); g.moveTo(0, 0); g.lineTo(run, 0); g.stroke();
    return { c: toImg(c), pad, D, w, h };
  });
}

// ---------------------------------------------------------------- warm-up: build every cache once (the caller awaits ready())
export function warmKit() {
  nightPlate(); toImg(sheetLayer().c); trussImg(); floorImg(); lectern(); screenBG(); ringImg(0); ringImg(1); rulerLayer(); sealBody(84);
  for (let i = 0; i < STEP.n; i++) slabLayer(i);
}
