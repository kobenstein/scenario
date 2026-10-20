// C5 · "fjord": the engraved oil licence with an intaglio vignette of a fjord, which opens into the real fjord in morning mist (3.08). Owner: c05.
//   Both pictures share one silhouette (fjordShapes, normalized 0..1), so the push into the vignette lands on the same fjord.
//   licence(ctx, t, o)   the licence (cached paper + border + title + intaglio vignette); o: { x, y (centre), s, rot, seal (0..1 press),
//                        sealT (time of the press, for the flash), a } → { vig: { x, y, w, h } screen box of the vignette }
//   VIG                  the vignette box in licence units (licence is LW × LH, centred on 0,0)
//   fjord(ctx, t, o)     the painted fjord, full frame; o: { z (push-in about the water point), a, drop (time of the drop, rings) }
//                        → { ring: [x, y] screen point of the rings }
import { Path2D } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, eout, prng, canvas, text } from '../engine.mjs';
import { stipple, vnoise, fbm, fog as artFog, hatch as artHatch } from './art.mjs';
import { gBorder, intaglio, microtext, seal, foilGlint, ripple, INK, PAPER } from './certificate.mjs';
import { fibreFill } from './print.mjs';

const CACHE = new Map(); const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const TAU = Math.PI * 2;
const WL = .63;                                 // the water line (v)
const nz = vnoise(41);
const ridgeL = (u) => .05 + .58 * Math.pow(clamp(u / .47), 1.22) + .035 * fbm(nz, u * 9, 1.1) - .02;
const ridgeR = (u) => .1 + .53 * Math.pow(clamp((1 - u) / .44), 1.3) + .03 * fbm(nz, u * 8, 3.3) - .015;
const ridgeF = (u) => WL - .2 * Math.exp(-Math.pow((u - .5) / .1, 2)) - .15 * Math.exp(-Math.pow((u - .64) / .07, 2)) - .06 * Math.exp(-Math.pow((u - .36) / .08, 2)) - .012 * fbm(nz, u * 20, 7);
export const fjordShapes = { WL, ridgeL, ridgeR, ridgeF };
// ---------------- the painted fjord ----------------
function fjordLayer() {
  return once('fjordp', () => {
    const [c, g] = canvas(W, H), X = (u) => u * W, Y = (v) => v * H;
    const sg = g.createLinearGradient(0, 0, 0, Y(WL)); sg.addColorStop(0, '#b9c9cf'); sg.addColorStop(.6, '#cdd8d8'); sg.addColorStop(1, '#e2e4dc'); g.fillStyle = sg; g.fillRect(0, 0, W, Y(WL) + 2);
    // far mountains: hazy, with snow streaks
    g.fillStyle = '#8fa3ab'; g.beginPath(); g.moveTo(X(.2), Y(WL)); for (let u = .2; u <= .82; u += .004) g.lineTo(X(u), Y(ridgeF(u))); g.lineTo(X(.82), Y(WL)); g.closePath(); g.fill();
    g.save(); g.clip(); g.strokeStyle = 'rgba(240,244,240,.55)'; g.lineWidth = 2; const r = prng(4); for (let i = 0; i < 40; i++) { const u = .38 + r() * .32, v = ridgeF(u) + .005 + r() * .03; g.beginPath(); g.moveTo(X(u), Y(v)); g.lineTo(X(u + (r() - .5) * .01), Y(v + .02 + r() * .03)); g.stroke(); } g.restore();
    // cliffs (slate), lit from the left-top: a lighter face, darker gullies
    const cliff = (fn, u0, u1, edge) => { g.beginPath(); g.moveTo(X(edge), Y(WL + .01)); for (let u = u0; (u1 > u0 ? u <= u1 : u >= u1); u += (u1 > u0 ? .003 : -.003)) g.lineTo(X(u), Y(fn(u))); g.lineTo(X(u1), Y(WL + .01)); g.closePath(); };
    cliff(ridgeL, 0, .5, 0); { const cg = g.createLinearGradient(0, 0, X(.5), Y(WL)); cg.addColorStop(0, '#3c4858'); cg.addColorStop(.6, '#2f3a4a'); cg.addColorStop(1, '#3f4d5a'); g.fillStyle = cg; g.fill(); }
    g.save(); g.clip(); artHatch(g, [0, 0, X(.52), Y(WL)], { angle: 1.05, gap: 6, w: 1.4, col: '#1a222e', a: .45, wobble: 2, seed: 7, broken: .35 }); g.restore();
    cliff(ridgeR, 1, .53, 1); { const cg = g.createLinearGradient(W, 0, X(.53), Y(WL)); cg.addColorStop(0, '#263040'); cg.addColorStop(.7, '#2a3544'); cg.addColorStop(1, '#3a4856'); g.fillStyle = cg; g.fill(); }
    g.save(); g.clip(); artHatch(g, [X(.5), 0, X(.5), Y(WL)], { angle: -1.0, gap: 6, w: 1.4, col: '#141b26', a: .5, wobble: 2, seed: 9, broken: .35 }); g.restore();
    // water: petrol, the sky's light in streaks, the cliffs' reflections
    const wg = g.createLinearGradient(0, Y(WL), 0, H); wg.addColorStop(0, '#5f8a92'); wg.addColorStop(.25, '#2c6670'); wg.addColorStop(1, '#163f48'); g.fillStyle = wg; g.fillRect(0, Y(WL), W, H - Y(WL));
    g.save(); g.globalAlpha = .55; g.translate(0, 2 * Y(WL)); g.scale(1, -1); g.beginPath(); g.moveTo(0, Y(WL)); for (let u = 0; u <= .5; u += .004) g.lineTo(X(u), Y(ridgeL(u) * .55 + WL * .45)); g.lineTo(X(.5), Y(WL)); g.closePath(); g.fillStyle = '#132a33'; g.fill();
    g.beginPath(); g.moveTo(W, Y(WL)); for (let u = 1; u >= .53; u -= .004) g.lineTo(X(u), Y(ridgeR(u) * .55 + WL * .45)); g.lineTo(X(.53), Y(WL)); g.closePath(); g.fill(); g.restore();
    const r2 = prng(9); for (let i = 0; i < 520; i++) { const y = Y(WL) + Math.pow(r2(), 1.6) * (H - Y(WL)), x = r2() * W, len = 20 + r2() * 160 * (1 + (y - Y(WL)) / 300); g.fillStyle = `rgba(214,230,228,${.04 + r2() * .12})`; g.fillRect(x, y, len, 1 + (y - Y(WL)) / 260); }
    // mist banks: on the water and halfway up the cliffs
    artFog(g, { y0: Y(WL) - 140, y1: Y(WL) + 60, col: '#e6ece6', a: .55, seed: 31, sx: .0014, sy: .02, cover: .55, soft: .45, k: .6 });
    artFog(g, { y0: Y(.25), y1: Y(.48), col: '#dfe6e4', a: .32, seed: 33, sx: .0016, sy: .015, cover: .45, soft: .45, k: .6 });
    stipple(c, { k: .5, g: 1, seed: 12, mid: false, boost: 1.1 });
    return c;
  });
}
function mistBand() { return once('fjmist', () => { const [c, g] = canvas(W + 600, 360); artFog(g, { y0: 40, y1: 320, col: '#eef2ee', a: .5, seed: 37, sx: .0012, sy: .016, cover: .5, soft: .5, k: .6, x1: W + 600 }); return c; }); }
export const RINGPT = [1010, 790];
export function fjord(ctx, t, o = {}) {
  const z = o.z ?? 1, a = o.a ?? 1, px = RINGPT[0], py = RINGPT[1] - 70; if (a <= 0) return { ring: RINGPT };
  ctx.save(); ctx.globalAlpha = a; ctx.translate(px, py); ctx.scale(z, z); ctx.translate(-px, -py);
  ctx.drawImage(fjordLayer(), 0, 0);
  // drifting mist (two speeds) and the water shimmering
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = a * .55; ctx.drawImage(mistBand(), -300 + ((t * 14) % 300) - 150, WL * H - 230); ctx.globalAlpha = a * .3; ctx.drawImage(mistBand(), -200 - ((t * 9) % 200), H * .3); ctx.restore();
  { const r = prng(77); ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 90; i++) { const y = WL * H + 8 + Math.pow(r(), 1.5) * (H - WL * H), x = (r() * W + t * (8 + r() * 10)) % W, l = 30 + r() * 90, f = .5 + .5 * Math.sin(t * (1 + r() * 2) + i); ctx.fillStyle = `rgba(230,240,236,${.07 * f})`; ctx.fillRect(x, y, l, 1.2); } ctx.restore(); }
  // the drop and its rings (engraved guilloche rings lying flat on the water)
  if (o.drop != null && t > o.drop - .4) {
    const d = o.drop; if (t < d) { const q = clamp((t - (d - .4)) / .4), y = mix(RINGPT[1] - 380, RINGPT[1], q * q); ctx.fillStyle = 'rgba(240,248,244,.9)'; ctx.beginPath(); ctx.ellipse(RINGPT[0], y, 3, 6, 0, 0, TAU); ctx.fill(); }
    ripple(ctx, RINGPT[0], RINGPT[1], t, [d], { rings: 4, gap: .2, speed: 260, life: 3.2, w0: 6, h0: 6, lines: 6, band: 10, wave: 26, col: '#f3f6f0', glow: '#cfe3e0', a: .9, lw: 1, sy: .3 });
  }
  ctx.restore();
  return { ring: RINGPT };
}
// ---------------- the licence ----------------
export const LW = 1320, LH = 800;
export const VIG = { x: 30, y: -250, w: 520, h: 292 };   // vignette box (licence units, centre-relative), 16:9 like the frame
function vignetteLayer() {
  return once('fjvig', () => {
    const w = VIG.w, h = VIG.h, [c, g] = canvas(w, h);
    g.fillStyle = PAPER; g.fillRect(0, 0, w, h);
    const tone = (x, y) => {
      const u = x / w, v = y / h;
      if (v > WL) { const refl = (u < .5 && v < WL + (WL - ridgeL(u)) * .55) || (u > .53 && v < WL + (WL - ridgeR(u)) * .55) ? .35 : 0; return .26 + refl + .1 * (v - WL); }
      if (v > ridgeL(u) && u < .5) return .62 + .3 * clamp((v - ridgeL(u)) * 3) - .2 * (1 - u * 2) * .5;
      if (v > ridgeR(u) && u > .53) return .75 + .2 * clamp((v - ridgeR(u)) * 3);
      if (v > ridgeF(u) && u > .2 && u < .82) return .34;
      return .06 + .1 * v;
    };
    const warp = (x, y) => { const u = x / w, v = y / h; if (v > WL) return 1.2 * Math.sin(u * 40 + v * 9); if (u < .5 && v > ridgeL(u)) return (v - ridgeL(u)) * 18; if (u > .53 && v > ridgeR(u)) return -(v - ridgeR(u)) * 18; return 0; };
    intaglio(g, 0, 0, w, h, { gap: 3.3, maxW: 2.7, angle: -.05, tone, warp, col: '#20303e', a: .95 });
    // ridge contours, engraved crisp
    g.strokeStyle = 'rgba(20,30,40,.85)'; g.lineWidth = 1;
    for (const [fn, u0, u1] of [[ridgeL, 0, .5], [ridgeR, .53, 1], [ridgeF, .2, .82]]) { g.beginPath(); for (let u = u0; u <= u1; u += .004) { const x = u * w, y = fn(u) * h; u === u0 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
    g.beginPath(); g.moveTo(0, WL * h); g.lineTo(w, WL * h); g.stroke();
    return c;
  });
}
function licenceLayer() {
  return once('fjlic', () => {
    const pad = 40, [c, g] = canvas(LW + pad * 2, LH + pad * 2); g.translate(pad, pad);
    g.save(); g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 30; g.shadowOffsetY = 14; g.fillStyle = '#efe6cf'; g.fillRect(0, 0, LW, LH); g.restore();
    g.save(); g.beginPath(); g.rect(0, 0, LW, LH); fibreFill(g, .5); g.restore();
    const pg = g.createRadialGradient(LW * .35, LH * .3, 0, LW * .5, LH * .5, LW * .8); pg.addColorStop(0, 'rgba(255,250,235,.25)'); pg.addColorStop(1, 'rgba(120,100,70,.12)'); g.fillStyle = pg; g.fillRect(0, 0, LW, LH);
    gBorder(g, 18, 18, LW - 36, LH - 36, { band: 44, lines: 9, waves: 150, col: '#2c4a52', w: .8, a: .75 });
    g.strokeStyle = 'rgba(44,74,82,.6)'; g.lineWidth = 1; g.strokeRect(78, 78, LW - 156, LH - 156);
    text(g, 'PRODUCTION LICENCE', 110, 172, { size: 62, font: 'Instrument Serif', color: '#1f3440', spacing: 3 });
    text(g, 'PETROLEUM · NORWEGIAN CONTINENTAL SHELF', 112, 210, { size: 15, weight: 600, color: 'rgba(31,52,64,.8)', spacing: 4.5 });
    microtext(g, 112, 236, 500, 'NORGE · NORWAY · KONGERIKET NORGE', { size: 6, col: '#2c4a52', a: .7 });
    // engraved text lines (unreadable on purpose)
    const r = prng(3); g.fillStyle = 'rgba(31,52,64,.32)'; for (let i = 0; i < 9; i++) { const y = 290 + i * 26, w = 470 - r() * 140; g.fillRect(112, y, w, 3); }
    microtext(g, 112, 540, 500, 'STATE PARTICIPATION · SHARE OF THE RESOURCE', { size: 6, col: '#2c4a52', a: .6 });
    // the vignette in an oval frame with a guilloche rim
    const vx = LW / 2 + VIG.x, vy = LH / 2 + VIG.y, cxv = vx + VIG.w / 2, cyv = vy + VIG.h / 2;
    g.save(); g.beginPath(); g.ellipse(cxv, cyv, VIG.w / 2, VIG.h / 2, 0, 0, TAU); g.clip(); g.drawImage(vignetteLayer(), vx, vy); g.restore();
    g.strokeStyle = 'rgba(31,52,64,.85)'; g.lineWidth = 1.5; g.beginPath(); g.ellipse(cxv, cyv, VIG.w / 2, VIG.h / 2, 0, 0, TAU); g.stroke();
    g.lineWidth = .7; for (let k = 0; k < 6; k++) { g.beginPath(); for (let i = 0; i <= 360; i++) { const a = i / 360 * TAU, d = 8 + 3 * Math.sin(a * 60 + k * 1.05); const x = cxv + Math.cos(a) * (VIG.w / 2 + d), y = cyv + Math.sin(a) * (VIG.h / 2 + d); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
    // corner where the seal will land: a faint dotted ring (reserved)
    g.save(); g.setLineDash([2, 5]); g.strokeStyle = 'rgba(31,52,64,.35)'; g.beginPath(); g.arc(210, LH - 190, 92, 0, TAU); g.stroke(); g.restore();
    stipple(c, { k: .35, g: 1, seed: 21, mid: false, boost: 1 });
    return { c, pad };
  });
}
export function licence(ctx, t, o = {}) {
  const x = o.x ?? W / 2, y = o.y ?? H / 2, s = o.s ?? 1, rot = o.rot ?? 0, a = o.a ?? 1, L = licenceLayer();
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.drawImage(L.c, -LW / 2 - L.pad, -LH / 2 - L.pad);
  // a slow light sweep across the paper
  { const p = new Path2D(); p.rect(-LW / 2, -LH / 2, LW, LH); foilGlint(ctx, p, t, { x: -LW, y: 0, span: LW * 2, width: 260, speed: .12, a: .22 }); }
  // the STATE STAKE seal presses into the corner
  const sp = clamp(o.seal ?? 0);
  if (sp > 0) {
    const sx = -LW / 2 + 210, sy = LH / 2 - 190, k = mix(1.45, 1, eout(sp)), al = clamp(sp * 3);
    ctx.save(); ctx.globalAlpha = a * al; ctx.translate(sx, sy); ctx.scale(k, k); seal(ctx, 0, 0, 84, t, { foil: true, label: 'STATE STAKE · NORWAY', glintPhase: .4 }); ctx.restore();
    if (o.sealT != null) { const f = Math.exp(-Math.pow((t - o.sealT - .12) / .1, 2)); if (f > .01) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 260); g.addColorStop(0, `rgba(255,236,200,${.55 * f})`); g.addColorStop(1, 'rgba(255,200,140,0)'); ctx.fillStyle = g; ctx.fillRect(sx - 260, sy - 260, 520, 520); ctx.restore(); } }
    const ta = clamp((sp - .55) * 3); text(ctx, 'STATE STAKE', sx + 120, sy + 10, { size: 34, weight: 700, color: rgba('#8a4a16', .9 * ta * a), spacing: 6 });
  }
  ctx.restore();
  const vx = LW / 2 + VIG.x - LW / 2, vy = VIG.y;   // centre-relative top-left of the vignette
  const c = Math.cos(rot), sn = Math.sin(rot), cxl = (vx + VIG.w / 2) * s, cyl = (vy + VIG.h / 2) * s;
  return { vig: { x: x + cxl * c - cyl * sn, y: y + cxl * sn + cyl * c, w: VIG.w * s, h: VIG.h * s } };
}
