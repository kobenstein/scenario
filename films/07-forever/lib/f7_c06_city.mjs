// Film 7 · c06 · the street of lit windows and the city (6.06). Builder: c06. Pure functions of t, deterministic.
// A row of engraved town houses seen across a night street (near layer), two skylines behind (cityLayer, cached Images), the kit
// night sky above; two lines rise behind the city: fuel (amber, gentle) and light (cool, steep).
// Camera (c02's horizon-anchored parallax): every layer is anchored on the street line HZ; layer p zooms by 1 + (z - 1)·p.
//   cityPrepare()                  builds the skyline layers as Images (await once)
//   cmap(cam, p)                   { k, X, Y } for layer p; cam = { x, y, z, tilt (px, everything moves down by it) }
//   HERO                           the hero window (world, near layer): the bulb hangs in it
//   city(ctx, t, cam, st)          st = { wave 0..1 (more windows light up, from the hero window outward), lamps 0..1 (street lamps),
//                                         lines { u 0..1 (draw-on), labA 0..1, relabel 0..1 (LIGHT→VALUE), relabel2 0..1 (FUEL→ENERGY) },
//                                         skyFn(ctx, t) draws the sky first, walkers true }
import { loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, prng, text } from '../engine.mjs';
import { cityLayer } from './city.mjs';
import { curve, glowAt, ease, n1 } from './f7_kit.mjs';
import { figure, walk } from './figure.mjs';

const TAU = Math.PI * 2;
export const HZ = 0;
export const HERO = { x: 0, y: -430, w: 80, h: 112 };
export function cmap(cam, p = 1) {
  const z = cam.z ?? 1, k = 1 + (z - 1) * p, cx = (cam.x ?? 0) * p, Yh = H / 2 + (HZ - (cam.y ?? 0)) * z + (cam.tilt ?? 0);
  return { k, X: (x) => W / 2 + (x - cx) * k, Y: (y) => Yh + (y - HZ) * k };
}
// ---------------------------------------------------------------- the near row: houses and their windows (world, layer p = 1)
const HOUSES = (() => {
  const r = prng(406), out = []; let x = -2600;
  while (x < 2700) {
    const w = 300 + r() * 140, fl = 3 + (r() < .45 ? 1 : 0), fh = 150 + r() * 20, roof = r() < .55 ? 'gable' : 'flat', tone = r();
    out.push({ x0: x, x1: x + w, fl, fh, h: fl * fh + 40, roof, tone, seed: Math.floor(r() * 1e6) });
    x += w + 6 + r() * 10;
  }
  // make sure the hero window sits in a house: shift so that x = 0 is inside the house nearest to it
  return out;
})();
const WINS = (() => {
  const out = [], r = prng(77);
  for (const hs of HOUSES) {
    const n = Math.max(2, Math.round((hs.x1 - hs.x0) / 110)), gap = (hs.x1 - hs.x0) / n;
    for (let f = 0; f < hs.fl; f++) for (let i = 0; i < n; i++) {
      const cx = hs.x0 + gap * (i + .5), cy = -40 - hs.fh * (f + .5) - 10, w = 62 + (hs.tone > .5 ? 8 : 0), h = 88 + (f === 0 ? 10 : 0);
      out.push({ cx, cy, w, h, lit0: r() < .3, warm: r(), bulb: r() < .45, curtain: r() < .5 ? (r() < .5 ? -1 : 1) : 0, ph: r() * TAU, f });
    }
  }
  // the hero window: the one closest to HERO
  let best = null, bd = 1e9; for (const w of out) { const d = Math.hypot(w.cx - HERO.x, w.cy - HERO.y); if (d < bd) { bd = d; best = w; } }
  HERO.x = best.cx; HERO.y = best.cy; HERO.w = best.w; HERO.h = best.h; best.hero = true; best.lit0 = true; best.bulb = true; best.curtain = 0;
  for (const w of out) w.d = Math.hypot(w.cx - HERO.x, (w.cy - HERO.y) * 1.3);
  return out;
})();
const LAMPS = [-1700, -900, -100, 700, 1500].map((x, i) => ({ x, i }));
const IM = {};
export async function cityPrepare() {
  if (IM.mid) return;
  const mid = cityLayer({ key: 'c06mid', seed: 61, w: 4200, h: 1100, ground: 1100, hMin: 180, hMax: 500, wMin: 90, wMax: 230, col: '#141a36', col2: '#1a2042', haze: '#3a3a6a', hazeH: 160, win: { p: .2, warm: .85, size: [5, 7], gap: [12, 16], a: .9, floors: .2 }, hatch: .5, tanks: .1, antennas: .2 });
  const far = cityLayer({ key: 'c06far', seed: 23, w: 4600, h: 1200, ground: 1200, hMin: 220, hMax: 640, wMin: 70, wMax: 200, col: '#121734', col2: '#161c3c', haze: '#4a4a7a', hazeH: 220, win: { p: .14, warm: .8, size: [4, 5], gap: [10, 13], a: .75, floors: .15 }, hatch: .35, tanks: .08, antennas: .25 });
  IM.mid = await loadImage(mid.toBuffer('image/png')); IM.far = await loadImage(far.toBuffer('image/png'));
}
function windowGlow(ctx, w, lit, t) {
  const { cx, cy } = w, ww = w.w, hh = w.h, x0 = cx - ww / 2, y0 = cy - hh / 2;
  if (lit <= 0) { ctx.fillStyle = '#0a0c1c'; ctx.fillRect(x0, y0, ww, hh); ctx.strokeStyle = 'rgba(120,130,190,.18)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0 + 4, y0 + hh - 6); ctx.lineTo(x0 + ww * .4, y0 + 6); ctx.stroke(); return; }
  const br = lit * (1 + .03 * Math.sin(t * 1.3 + w.ph)), warm = w.warm;
  const g = ctx.createRadialGradient(cx, y0 + hh * .3, 0, cx, y0 + hh * .3, hh * 1.1);
  g.addColorStop(0, rgba(warm > .2 ? '#ffe7b8' : '#e8eef6', .98 * br)); g.addColorStop(.55, rgba(warm > .2 ? '#f0a256' : '#9fb8d6', .9 * br)); g.addColorStop(1, rgba(warm > .2 ? '#8a4420' : '#3a4a70', .9 * br));
  ctx.fillStyle = '#0a0c1c'; ctx.fillRect(x0, y0, ww, hh); ctx.fillStyle = g; ctx.fillRect(x0, y0, ww, hh);
  // inside: a hanging bulb, or a curtain edge
  if (w.bulb) { ctx.strokeStyle = 'rgba(40,24,16,.7)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(cx, y0); ctx.lineTo(cx, y0 + hh * .26); ctx.stroke(); ctx.fillStyle = rgba('#fffaf0', .95 * lit); ctx.beginPath(); ctx.arc(cx, y0 + hh * .3, 4.2, 0, TAU); ctx.fill(); }
  if (w.curtain) { ctx.fillStyle = 'rgba(90,40,30,.55)'; const s = w.curtain; ctx.beginPath(); ctx.moveTo(s < 0 ? x0 : x0 + ww, y0); ctx.quadraticCurveTo(s < 0 ? x0 + ww * .32 : x0 + ww * .68, y0 + hh * .5, s < 0 ? x0 + ww * .18 : x0 + ww * .82, y0 + hh); ctx.lineTo(s < 0 ? x0 : x0 + ww, y0 + hh); ctx.closePath(); ctx.fill(); }
}
function windowFrame(ctx, w) {
  const { cx, cy } = w, ww = w.w, hh = w.h, x0 = cx - ww / 2, y0 = cy - hh / 2;
  ctx.strokeStyle = '#07070f'; ctx.lineWidth = 5; ctx.strokeRect(x0, y0, ww, hh);
  ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, y0); ctx.lineTo(cx, y0 + hh); ctx.moveTo(x0, y0 + hh * .42); ctx.lineTo(x0 + ww, y0 + hh * .42); ctx.stroke();
  // the stone sill and lintel
  ctx.fillStyle = '#2a2c44'; ctx.fillRect(x0 - 8, y0 + hh, ww + 16, 8); ctx.fillRect(x0 - 5, y0 - 10, ww + 10, 8);
  ctx.strokeStyle = 'rgba(190,190,230,.25)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0 - 8, y0 + hh); ctx.lineTo(x0 + ww + 8, y0 + hh); ctx.stroke();
}
function houses(ctx, t, m, st) {
  ctx.save(); ctx.setTransform(m.k, 0, 0, m.k, m.X(0), m.Y(0));
  const vx0 = (0 - m.X(0)) / m.k - 50, vx1 = (W - m.X(0)) / m.k + 50, vy0 = (0 - m.Y(0)) / m.k - 50;
  for (const hs of HOUSES) {
    if (hs.x1 < vx0 || hs.x0 > vx1) continue;
    const top = -hs.h;
    if (top > (H - m.Y(0)) / m.k + 50) continue;
    // the facade: an engraved dark wall, the gable or the cornice
    ctx.beginPath(); ctx.moveTo(hs.x0, 0); ctx.lineTo(hs.x0, top);
    if (hs.roof === 'gable') { ctx.lineTo((hs.x0 + hs.x1) / 2, top - (hs.x1 - hs.x0) * .32); } ctx.lineTo(hs.x1, top); ctx.lineTo(hs.x1, 0); ctx.closePath();
    const fg = ctx.createLinearGradient(0, top, 0, 0); fg.addColorStop(0, hs.tone > .5 ? '#1c2040' : '#191c38'); fg.addColorStop(1, '#10122a'); ctx.fillStyle = fg; ctx.fill();
    ctx.strokeStyle = 'rgba(170,170,230,.22)'; ctx.lineWidth = 1.4; ctx.stroke();
    // engraved horizontal courses (brick lines) and a cornice band
    if (top > vy0 - 2000) {
      ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(150,150,210,.09)'; ctx.lineWidth = 1; ctx.beginPath(); for (let y = -8; y > top - 300; y -= 13) { ctx.moveTo(hs.x0, y); ctx.lineTo(hs.x1, y); } ctx.stroke();
      // engraved shade: diagonal hatching over the right quarter and the lowest floor (no fills, like the kit's prints)
      ctx.strokeStyle = 'rgba(4,4,14,.55)'; ctx.lineWidth = 1.3; ctx.beginPath(); const xr = hs.x1 - (hs.x1 - hs.x0) * .24;
      for (let x = xr - 300; x < hs.x1 + 10; x += 7) { ctx.moveTo(Math.max(x, xr), top - 200 + Math.max(0, xr - x)); ctx.lineTo(x + 300, top - 200 + 300 + Math.max(0, xr - x) - Math.max(0, x + 300 - hs.x1)); }
      for (let x = hs.x0 - 60; x < hs.x1; x += 9) { ctx.moveTo(x, -40); ctx.lineTo(x + 60, -100); }
      ctx.stroke(); ctx.restore();
      ctx.strokeStyle = 'rgba(200,205,255,.28)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(hs.x0 + 1, -36); ctx.lineTo(hs.x0 + 1, top); ctx.stroke();
      ctx.fillStyle = '#23264a'; ctx.fillRect(hs.x0 - 6, top - 4, hs.x1 - hs.x0 + 12, 12);
      if (hs.roof === 'gable') { ctx.strokeStyle = 'rgba(190,180,240,.3)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(hs.x0 - 6, top); ctx.lineTo((hs.x0 + hs.x1) / 2, top - (hs.x1 - hs.x0) * .32); ctx.lineTo(hs.x1 + 6, top); ctx.stroke(); }
      // a chimney
      const cx = hs.x0 + (hs.x1 - hs.x0) * (.2 + .5 * ((hs.seed % 100) / 100)); ctx.fillStyle = '#14162e'; ctx.fillRect(cx, top - (hs.roof === 'gable' ? 70 : 40), 26, 60);
    }
    // the ground floor plinth
    ctx.fillStyle = '#0d0f22'; ctx.fillRect(hs.x0, -34, hs.x1 - hs.x0, 34);
  }
  // windows: lit ones glow; the wave lights more from the hero window outward
  for (const w of WINS) {
    if (w.cx + w.w < vx0 || w.cx - w.w > vx1) continue;
    let lit = w.lit0 ? 1 : 0;
    if (!w.lit0 && (st.wave ?? 0) > 0) { const reach = (st.wave ?? 0) * 2600; lit = clamp((reach - w.d) / 160) * (w.warm < .9 ? 1 : 0); }
    windowGlow(ctx, w, lit, t); windowFrame(ctx, w);
    if (lit > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(w.cx, w.cy, 0, w.cx, w.cy, 150); g.addColorStop(0, rgba(w.warm > .2 ? '#ffb35c' : '#9fb8d6', .16 * lit)); g.addColorStop(1, 'rgba(255,170,90,0)'); ctx.fillStyle = g; ctx.fillRect(w.cx - 150, w.cy - 150, 300, 300); ctx.restore(); }
  }
  // the pavement and the street
  ctx.fillStyle = '#151630'; ctx.fillRect(vx0, 0, vx1 - vx0, 40); ctx.strokeStyle = 'rgba(180,180,230,.2)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(vx0, 40); ctx.lineTo(vx1, 40); ctx.stroke();
  const sg = ctx.createLinearGradient(0, 40, 0, 600); sg.addColorStop(0, '#0e0f24'); sg.addColorStop(1, '#07081a'); ctx.fillStyle = sg; ctx.fillRect(vx0, 40, vx1 - vx0, 1200);
  // reflections of the lit windows on the wet street (stipple streaks)
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const w of WINS) {
    if (w.f > 1 || w.cx < vx0 || w.cx > vx1) continue; const lit = w.lit0 ? 1 : clamp(((st.wave ?? 0) * 2600 - w.d) / 160); if (lit <= 0) continue;
    // broken ripples: short horizontal dashes, wider and fainter further down, drifting a little (the wet street moves)
    const r = prng(Math.floor(w.cx * 7 + w.f * 131) & 0xffff);
    for (let k = 0; k < 9; k++) {
      const yy = 50 + k * k * 3.2 + (w.f ? 26 : 0) + r() * 6, wd = (14 + k * 5) * (.6 + r() * .8), off = (r() - .5) * 18 + 5 * Math.sin(t * 1.4 + k * 1.7 + w.ph);
      ctx.fillStyle = rgba(w.warm > .2 ? '#ffb35c' : '#b8c8e8', (.2 - k * .018) * lit * (w.f ? .5 : 1)); ctx.fillRect(w.cx - wd / 2 + off, yy, wd, 2 + k * .25);
    }
  }
  ctx.restore();
  // street lamps: posts with lanterns; they light in sequence (lamps 0..1)
  for (const L of LAMPS) {
    if (L.x < vx0 - 100 || L.x > vx1 + 100) continue;
    const on = clamp(((st.lamps ?? 0) * 1.3 - L.i * .08) / .3);
    ctx.strokeStyle = '#0a0b1c'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(L.x, 30); ctx.lineTo(L.x, -250); ctx.quadraticCurveTo(L.x, -280, L.x + 30, -282); ctx.stroke();
    ctx.fillStyle = '#0a0b1c'; ctx.beginPath(); ctx.moveTo(L.x + 18, -282); ctx.lineTo(L.x + 46, -282); ctx.lineTo(L.x + 40, -262); ctx.lineTo(L.x + 24, -262); ctx.closePath(); ctx.fill();
    if (on > 0) {
      ctx.fillStyle = rgba('#ffe2a8', on); ctx.fillRect(L.x + 24, -264, 16, 4);
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createRadialGradient(L.x + 32, -262, 0, L.x + 32, -262, 260); g.addColorStop(0, rgba('#ffd9a0', .5 * on)); g.addColorStop(.3, rgba('#ffb35c', .15 * on)); g.addColorStop(1, 'rgba(255,170,90,0)'); ctx.fillStyle = g; ctx.fillRect(L.x - 230, -520, 520, 520);
      ctx.beginPath(); ctx.moveTo(L.x + 24, -262); ctx.lineTo(L.x + 40, -262); ctx.lineTo(L.x + 130, 40); ctx.lineTo(L.x - 66, 40); ctx.closePath(); const cg = ctx.createLinearGradient(0, -262, 0, 40); cg.addColorStop(0, rgba('#ffd9a0', .22 * on)); cg.addColorStop(1, rgba('#ffb35c', .05 * on)); ctx.fillStyle = cg; ctx.fill();
      ctx.restore();
    }
  }
  ctx.restore();
}
// two walkers on the pavement (figure scale; drawn at a fixed size in a scaled context)
function walkers(ctx, t, m) {
  const P = [{ x0: -900, v: 46, seed: 2, coat: '#3a2a3e', flip: false }, { x0: 520, v: -38, seed: 5, coat: '#24304a', flip: true }];
  for (const p of P) {
    const x = p.x0 + p.v * (t - 384), X = m.X(x), Y = m.Y(-52); if (X < -100 || X > W + 100) continue;
    const ph = Math.abs(p.v * (t - 384)) / 54 * TAU;
    ctx.save(); ctx.translate(X, Y); ctx.scale(m.k, m.k);
    figure(ctx, 0, 0, .5, walk(ph), { t, seed: p.seed, flip: p.flip, dress: { coat: p.coat, pants: '#10102a' }, rim: '#ffcf8a', rimSide: -1, shadow: true });
    ctx.restore();
  }
}
// the two lines behind the city: amber (fuel) gentle, cool (light) steep; layer p = .18
export const LINES = (() => {
  const o = { x0: -766, y0: -330, xa: 740, xc: 667 }, amb = [], cool = [];
  for (let i = 0; i <= 140; i++) { const s = i / 140; amb.push([mix(o.x0, o.xa, s), o.y0 - 110 * s - 65 * s * s, 1]); cool.push([mix(o.x0, o.xc, s), o.y0 - 60 * s - 487 * Math.pow(s, 2.6), 1]); }
  return { amb, cool };
})();
function lines(ctx, t, cam, L) {
  const u = L.u ?? 0; if (u <= 0) return;
  const m = cmap(cam, .18), P = (pts) => pts.map(([x, y, w]) => [m.X(x), m.Y(y), w]);
  const ca = curve(ctx, t, P(LINES.amb), { tone: 'amber', u: ease.out(clamp(u * 1.05)), w: .95, br: .9, sparks: .5, seed: 7 });
  const cc = curve(ctx, t, P(LINES.cool), { tone: 'cool', u: ease.io(u), w: 1.05, br: 1.05, glint: .8, seed: 9 });
  const la = L.labA ?? 0; if (la <= 0) return;
  // labels at the tips: the words swap (mask replace) when the analogy is made
  const lab = (tip, a, b, k, col, dy) => {
    if (!tip) return; const x = tip[0] + 22, y = tip[1] + dy;
    ctx.save(); ctx.font = '600 26px "Inter"'; try { ctx.letterSpacing = '7px'; } catch { } const wa = ctx.measureText(a).width, wb = ctx.measureText(b).width; ctx.restore();
    const e = ease.io(k), cut = x - 4 + (Math.max(wa, wb) + 20) * e;
    if (e < 1) { ctx.save(); ctx.beginPath(); ctx.rect(cut, y - 34, (wa + 24) * ease.out(la), 46); ctx.clip(); text(ctx, a, x, y, { size: 26, weight: 600, color: col, spacing: 7 }); ctx.restore(); }
    if (e > 0) { ctx.save(); ctx.beginPath(); ctx.rect(x - 4, y - 34, cut - x + 4, 46); ctx.clip(); text(ctx, b, x, y, { size: 26, weight: 600, color: col, spacing: 7 }); ctx.restore(); }
  };
  lab(cc && cc.tip, 'LIGHT', 'VALUE', L.relabel ?? 0, '#e3f2ff', 8);
  lab(ca && ca.tip, 'FUEL', 'ENERGY', L.relabel2 ?? 0, '#ffe2bd', 10);
}
export function city(ctx, t, cam, st = {}) {
  if (st.skyFn) st.skyFn(ctx, t);
  // far and mid skylines (anchored on the street line), a haze between them
  for (const [im, p, w, h, y0] of [[IM.far, .3, 4600, 1200, -60], [IM.mid, .55, 4200, 1100, -20]]) {
    const m = cmap(cam, p), X = m.X(-w / 2), Y = m.Y(y0 - h), S = m.k;
    if (Y > H) continue;
    ctx.drawImage(im, X, Y, w * S, h * S);
    const hy = m.Y(y0); const g = ctx.createLinearGradient(0, hy - 260 * S, 0, hy); g.addColorStop(0, 'rgba(60,60,110,0)'); g.addColorStop(1, rgba('#3a3a6e', .35)); ctx.fillStyle = g; ctx.fillRect(0, hy - 260 * S, W, 262 * S);
  }
  // the two lines: over the skylines (a chart in the sky), behind the near row, which hides their common root
  lines(ctx, t, cam, st.lines || {});
  const m = cmap(cam, 1);
  houses(ctx, t, m, st);
  if (st.walkers !== false) walkers(ctx, t, m);
  return { m, hero: [m.X(HERO.x), m.Y(HERO.y - HERO.h * .2)] };
}
