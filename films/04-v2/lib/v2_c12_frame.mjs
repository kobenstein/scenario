// c12 (Film 4 v2) · 12.08–12.09 · the tall frame on the esteem square (HILL.square.frame of lib/maslow4.mjs) as an engraved poster
// column; its screen (clip A plays in it: on/off like a picture tube, out of and back into the rule), the lit rule under the screen and
// the dark glass panel below it, both lit like handoff4's line plate (at the end the rule IS the c12>c13 line plate), the lower third.
//   housing(ctx, t, cam) · screen(ctx, t, T, cam, o) · spill(ctx, cam, a) · lowerThird(ctx, t, u) · rects(cam)
//   cam = maslow4 camera { x, y, z }. The housing covers maslow4's own stand (posts, pediment, base) exactly, so it can be drawn at any zoom.
import { footageTag } from './footage_tag.mjs';
import { W, H, rgba, clamp, mix } from '../engine.mjs';
import { HILL } from './maslow4.mjs';
import { clipScreen } from './kit.mjs';
import { linePlateIn, label } from './v2_c12_kit.mjs';

export const FR = HILL.square.frame;                                     // the screen's aperture (world units)
export const RULE = { x0: FR.x, x1: FR.x + FR.w, y: FR.y + FR.h };
const PANEL = 3.3, GROUND = HILL.square.y;
const HX0 = FR.x - 2.8, HX1 = FR.x + FR.w + 2.8;                         // pilasters' outer faces
const TOP = FR.y - 2.1, CORN = FR.y - 3.9, APEX = FR.y - 5.9;            // frieze top, cornice top, pediment apex
const tx = (cam, x) => (x - cam.x) * cam.z + W / 2, ty = (cam, y) => (y - cam.y) * cam.z + H / 2;
export function rects(cam) {
  const ax = tx(cam, FR.x), aw = FR.w * cam.z, ay = ty(cam, FR.y), ry = ty(cam, RULE.y);
  return { ax, ay, aw, ah: ry - ay, ry, pb: ty(cam, RULE.y + PANEL), hx0: tx(cam, HX0 - .6), hx1: tx(cam, HX1 + .6), hy0: ty(cam, APEX), hy1: ty(cam, GROUND) };
}
// the screen and the panel cover the whole frame (the end of the push onto the rule)
export const covers = (cam) => { const r = rects(cam); return r.ax <= 0 && r.ax + r.aw >= W && r.ay <= 0 && r.pb >= H; };

// ---------------------------------------------------------------- the engraved housing (world units under the hill camera)
export function housing(ctx, t, cam) {
  const r = rects(cam); if (r.hx1 < 0 || r.hx0 > W || r.hy1 < 0 || r.hy0 > H) return;
  const z = cam.z, px = (v) => v / z, eng = z > 5;
  ctx.save(); ctx.setTransform(z, 0, 0, z, W / 2 - cam.x * z, H / 2 - cam.y * z);
  const IRON = '#2a2232', IRON_L = '#4a3e52', STONE = '#9a8c84', STONE_D = '#6a5e5a', GILT = '#c8a868';
  // plinth on the square
  ctx.fillStyle = STONE_D; ctx.fillRect(HX0 - .9, RULE.y + PANEL, HX1 - HX0 + 1.8, GROUND - RULE.y - PANEL);
  ctx.fillStyle = STONE; ctx.fillRect(HX0 - .9, RULE.y + PANEL, HX1 - HX0 + 1.8, .45);
  // pilasters (fluted), frieze, cornice, pediment
  ctx.fillStyle = IRON; ctx.fillRect(HX0, TOP, HX1 - HX0, RULE.y + PANEL - TOP);
  const g = ctx.createLinearGradient(HX0, 0, HX1, 0); g.addColorStop(0, rgba('#8a7a9a', .28)); g.addColorStop(.18, rgba('#8a7a9a', 0)); g.addColorStop(.82, rgba('#000000', 0)); g.addColorStop(1, rgba('#000000', .3));
  ctx.fillStyle = g; ctx.fillRect(HX0, TOP, HX1 - HX0, RULE.y + PANEL - TOP);
  ctx.fillStyle = STONE; ctx.fillRect(HX0 - .7, CORN, HX1 - HX0 + 1.4, TOP - CORN);
  ctx.fillStyle = STONE_D; ctx.fillRect(HX0 - .7, TOP - .55, HX1 - HX0 + 1.4, .55);
  ctx.beginPath(); ctx.moveTo(HX0 - .9, CORN); ctx.lineTo((HX0 + HX1) / 2, APEX); ctx.lineTo(HX1 + .9, CORN); ctx.closePath(); ctx.fillStyle = '#8a7c74'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(HX0 + .6, CORN - .15); ctx.lineTo((HX0 + HX1) / 2, APEX + .75); ctx.lineTo(HX1 - .6, CORN - .15); ctx.closePath(); ctx.fillStyle = '#6e625c'; ctx.fill();
  // the gilt moulding round the screen and the panel
  ctx.strokeStyle = GILT; ctx.lineWidth = .22; ctx.strokeRect(FR.x - .2, FR.y - .2, FR.w + .4, FR.h + PANEL + .4);
  if (eng) {
    ctx.lineWidth = px(1); ctx.strokeStyle = rgba('#0a0812', .55); ctx.beginPath();
    for (const x0 of [HX0, FR.x + FR.w + .2]) for (let k = 1; k < 4; k++) { const x = x0 + (FR.x - .2 - HX0) * k / 4; ctx.moveTo(x, TOP + .6); ctx.lineTo(x, RULE.y + PANEL - .6); }
    for (let x = HX0 - .5; x < HX1 + .5; x += .7) { ctx.moveTo(x, TOP - .5); ctx.lineTo(x, TOP - .1); }                     // dentils
    for (let x = HX0 - .4; x < HX1 + .4; x += .28) { ctx.moveTo(x, RULE.y + PANEL + .5); ctx.lineTo(x + .18, GROUND - .1); }  // stone hatch
    ctx.stroke();
    ctx.strokeStyle = rgba('#e8dcc8', .28); ctx.beginPath(); ctx.moveTo(HX0 - .7, CORN + .05); ctx.lineTo(HX1 + .7, CORN + .05); ctx.moveTo(HX0 + .05, TOP); ctx.lineTo(HX0 + .05, RULE.y + PANEL); ctx.stroke();
    ctx.strokeStyle = rgba(IRON_L, .9); ctx.beginPath(); ctx.moveTo(HX0 - .4, CORN + .9); ctx.lineTo(HX1 + .4, CORN + .9); ctx.stroke();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the screen, the rule, the panel
// o: { pic: 0..1 (picture height, grows out of / collapses into the rule), flash: 0..1, img (own frame image, else the clip),
//      ruleA: 0..1, ruleGrow: 0..1 (the light runs along the rule from the left), wob: 0..1 (the plate's own slow wobble of the line) }
function picture(ctx, img, x, y, w, h) {    // kit clipScreen's look for an own frame image
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.fillStyle = '#05060f'; ctx.fillRect(x, y, w, h);
  const s = Math.max(w / img.width, h / img.height), dw = img.width * s, dh = img.height * s; ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
  ctx.globalAlpha = .06; ctx.fillStyle = '#000'; for (let yy = y; yy < y + h; yy += 4) ctx.fillRect(x, yy, w, 1.5); ctx.globalAlpha = 1;
  const sh = ctx.createLinearGradient(x, y, x + w, y + h); sh.addColorStop(0, 'rgba(216,247,255,.07)'); sh.addColorStop(.5, 'rgba(216,247,255,0)'); ctx.fillStyle = sh; ctx.fillRect(x, y, w, h);
  ctx.restore();
}
export function screen(ctx, t, T, cam, o = {}) {
  const r = rects(cam); if (r.ax > W || r.ax + r.aw < 0 || r.ay > H || r.pb < 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  // the dark glass of the screen and the panel: the line plate's ground, lit from the rule
  linePlateIn(ctx, t, { y: r.ry, clip: [r.ax, r.ay, r.aw, r.pb - r.ay], lineA: 0 });
  const pic = clamp(o.pic ?? 0);
  if (pic > 0) {
    const ph = r.ah * pic;
    ctx.save(); ctx.beginPath(); ctx.rect(r.ax, r.ry - ph, r.aw, ph); ctx.clip();
    ctx.translate(0, r.ry); ctx.scale(1, pic); ctx.translate(0, -r.ry);
    if (o.img) picture(ctx, o.img, r.ax, r.ay, r.aw, r.ah); else clipScreen(ctx, t, T, 'A', r.ax, r.ay, r.aw, r.ah, { glow: false, bezel: false, radius: 0 });
    if ((o.flash ?? 0) > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba('#fff4e0', .85 * o.flash); ctx.fillRect(r.ax, r.ay, r.aw, r.ah); }
    ctx.restore();
  }
  const la = clamp(o.ruleA ?? 0), gr = clamp(o.ruleGrow ?? 1);
  if (la > 0 && gr > 0) {
    const yl = r.ry - 2 * Math.sin(t * .9) * (1 - clamp(o.wob ?? 0));
    linePlateIn(ctx, t, { y: yl, clip: [r.ax, r.ry - 70, r.aw * gr, 140], ground: false, lineA: la });
  }
  ctx.restore();
}
// the screen's cool light on the square round the frame (not on the screen itself)
export function spill(ctx, cam, a) {
  if (a <= 0) return; const r = rects(cam), cx = r.ax + r.aw / 2, cy = r.ay + r.ah * .45, rr = r.ah * 1.25;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.rect(r.ax, r.ay, r.aw, r.pb - r.ay); ctx.clip('evenodd');
  ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(cx, cy, r.aw * .3, cx, cy, rr); g.addColorStop(0, rgba('#bcd2ff', .12 * a)); g.addColorStop(1, rgba('#bcd2ff', 0));
  ctx.fillStyle = g; ctx.fillRect(cx - rr, cy - rr, rr * 2, rr * 2); ctx.restore();
}
// lower third (scenes/sc02.mjs lowerThird, written on from its amber bar instead of faded): u 0 → 1 in, back to 0 out
export function lowerThird(ctx, t, u, x = 150, y = 712) {
  if (u <= 0) return; const e = clamp(u);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#ffb35c'; ctx.fillRect(x, y - 38, 3, 128 * Math.min(1, e * 1.6));
  ctx.beginPath(); ctx.rect(x + 14, y - 50, 470 * clamp((e - .15) / .85), 160); ctx.clip();
  const rise = (k) => (1 - clamp((e - .15 - k * .06) / .6)) * 14;
  label(ctx, 'Sam Altman', x + 20, y + rise(0), 1, { size: 44, font: 'Instrument Serif', weight: 400, spacing: 0 });
  label(ctx, 'CEO, OPENAI', x + 21, y + 32 + rise(1), 1, { size: 17, spacing: 4, alpha: .85 });
  label(ctx, 'THE RUNDOWN AI', x + 21, y + 58 + rise(2), 1, { size: 16, spacing: 3, col: '#c9c3dc', alpha: .8 });
  label(ctx, 'OCT 9, 2025', x + 21, y + 82 + rise(3), 1, { size: 16, spacing: 3, col: '#c9c3dc', alpha: .8 });
  ctx.restore();
  footageTag(ctx, t, x + 20, y, 'Sam Altman', clamp((e - .2) / .8));
}
