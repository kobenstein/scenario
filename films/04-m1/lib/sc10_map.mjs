// C10 · 6.22 ★ the engraved paper map at the same moment: Ohio at dusk, Manila at dawn, both phones buzz, their guilloche
// rings (the rings of H.01) race toward each other across the night and touch; 6.23 the two "Your share" cards close in
// and lock in register (two print plates, one impression).
//   mapStar(ctx, t, o)  o: { t0, wake (screens light), same (the clocks flip 6:11 → 6:12), buzz, touch } → { mid: [x, y] (touch point) }
//   cards(ctx, t, o)    o: { t0, reg (the cards lock), glint (foil glint), exit (the merged card lifts out of frame) }
import { Path2D } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, eout, eio, prng, drift, canvas, text } from '../engine.mjs';
import { stipple, cone } from './art.mjs';
import { nightSheet, drawSheet, paperAt } from './map.mjs';
import { ring, rosette, microtext, foilGlint, gBorder } from './certificate.mjs';
import { expoOut, expoIn, quart } from './sc10_places.mjs';
import { maskedGlint } from './sc10_engrave.mjs';

const CACHE = new Map(); const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const TAU = Math.PI * 2;
const MANILA = [120.98, 14.6], OHIO = [-82.99, 39.96];
export const MAPCAM10 = { cx: .34, cy: .45, z: 1.17, rot: -.09, tilt: .62, x: 960, y: 600, f: 1500 };
// the screen point where the two rings touch (mapStar's mid at the touch; measured, the view is nearly still by then) = the zoom point into 6.23
export const MAP_MID = [951, 576];
const UTC = 22.2;   // 22:12 UTC = 6:12 PM in Ohio (EDT), 6:12 AM in Manila (PHT): the hook's "6:12" on both phones

function lampCone() { return once('m10-lamp', () => { const [c, g] = canvas(W, H); cone(g, W * .88, -160, { dir: -.6, spread: .38, len: 1550, col: '#ffcf96', a: .15, k: .65, seed: 8, soft: .35 }); return c; }); }
function sprite(key, r, stops) { return once(key, () => { const [c, g] = canvas(r * 2, r * 2), rg = g.createRadialGradient(r, r, 0, r, r, r); for (const [p, col] of stops) rg.addColorStop(p, col); g.fillStyle = rg; g.fillRect(0, 0, r * 2, r * 2); stipple(c, { k: .7, g: 1.2, seed: r, boost: 2 }); return c; }); }
const spark = () => sprite('m10-spark', 300, [[0, 'rgba(255,248,232,1)'], [.05, 'rgba(255,220,160,.8)'], [.2, 'rgba(255,179,92,.3)'], [.6, 'rgba(255,160,90,.06)'], [1, 'rgba(255,160,90,0)']]);
// a phone lying on the paper (paper units), its display wakes, then buzzes
function paperPhone(ctx, t, wake, buzz) {
  const lit = sm(lin(wake, wake + .4, t)), k = t > buzz ? Math.exp(-(t - buzz) * 2.4) : 0, jit = k * Math.sin(t * 95) * 1.1;
  ctx.save(); ctx.translate(jit, 0); ctx.rotate(-.35); ctx.scale(2.3, 2.3);
  ctx.fillStyle = 'rgba(5,6,14,.55)'; ctx.beginPath(); ctx.roundRect(-6 + 2.5, -11 + 3.5, 12, 22, 2.8); ctx.fill();
  ctx.fillStyle = '#121420'; ctx.beginPath(); ctx.roundRect(-6, -11, 12, 22, 2.8); ctx.fill();
  ctx.fillStyle = `rgb(${mix(28, 255, lit) | 0},${mix(33, 222, lit) | 0},${mix(51, 170, lit) | 0})`; ctx.beginPath(); ctx.roundRect(-4.7, -9.4, 9.4, 18.8, 2); ctx.fill();
  if (lit > 0) { ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 46); g.addColorStop(0, `rgba(255,206,140,${.4 * lit + .6 * k})`); g.addColorStop(1, 'rgba(255,170,90,0)'); ctx.fillStyle = g; ctx.fillRect(-46, -46, 92, 92); }
  ctx.restore();
}
// clock label: the minute flips from 11 to 12 at `same` (both at the same frame)
function label(ctx, x, y, name, sub, flipAt, t, a, align) {
  if (a <= 0) return;
  ctx.save(); ctx.shadowColor = 'rgba(4,6,20,.85)'; ctx.shadowBlur = 10; ctx.globalAlpha = a;
  text(ctx, name, x, y, { size: 30, weight: 600, color: '#fff1d6', spacing: 7, align });
  const f = clamp((t - flipAt) / .22), parts = sub.split('#'), ctx2 = ctx;
  ctx2.font = '500 17px "Inter"'; try { ctx2.letterSpacing = '3px'; } catch { }
  const w0 = ctx2.measureText(parts[0]).width, wm = ctx2.measureText('12').width, w1 = ctx2.measureText(parts[1]).width, tot = w0 + wm + w1;
  const x0 = align === 'right' ? x - tot : x;
  text(ctx, parts[0], x0, y + 28, { size: 17, weight: 500, color: '#ffd59a', spacing: 3 });
  ctx.save(); ctx.beginPath(); ctx.rect(x0 + w0 - 2, y + 10, wm + 6, 24); ctx.clip();
  text(ctx, '11', x0 + w0, y + 28 - 22 * eio(f), { size: 17, weight: 500, color: '#ffd59a', spacing: 3, alpha: 1 - f });
  text(ctx, '12', x0 + w0, y + 28 + 22 * (1 - eio(f)), { size: 17, weight: 600, color: f > 0 ? '#fff1d6' : '#ffd59a', spacing: 3, alpha: f });
  ctx.restore();
  text(ctx, parts[1], x0 + w0 + wm, y + 28, { size: 17, weight: 500, color: '#ffd59a', spacing: 3 });
  ctx.restore();
}
function inv2(m) { const [a, b, c, d] = m, det = a * d - b * c || 1; return [d / det, -b / det, -c / det, a / det]; }
export function mapStar(ctx, t, o = {}) {
  const t0 = o.t0 ?? 0, lt = t - t0, wake = o.wake ?? t0 + .3, same = o.same ?? t0 + 1.6, buzz = o.buzz ?? t0 + 3.3, touch = o.touch ?? buzz + .44;
  const S = nightSheet(MAPCAM10, { utc: UTC, decl: -10.5 });
  const view = { z: mix(1.075, 1.0, expoOut(lt / 3.2)) + .004 * Math.sin(t * .5), dx: drift(t, 6, 1) - lt * 5, dy: drift(t, 4, 2) + 10, t };
  drawSheet(ctx, S, view);
  const AO = paperAt(S, view, ...OHIO), AM = paperAt(S, view, ...MANILA), mid = [(AO.x + AM.x) / 2, (AO.y + AM.y) / 2 - 10];
  // the twilight bands breathe: a slow warm shimmer runs along the two day–night lines
  // (cheap: two soft glows that travel with the places)
  for (const A of [AO, AM]) { const g = ctx.createRadialGradient(A.x, A.y, 0, A.x, A.y, 260); g.addColorStop(0, `rgba(255,180,110,${.12 + .04 * Math.sin(t * 1.3 + A.x)})`); g.addColorStop(1, 'rgba(255,170,100,0)'); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(A.x - 260, A.y - 260, 520, 520); ctx.restore(); }
  // the rings: each phone sends its engraved ring flat over the paper; they race toward each other and touch at `touch`
  const ringsFor = (A, sign) => {
    const im = inv2(A.m), vx = mid[0] - A.x, vy = mid[1] - A.y, px = im[0] * vx + im[2] * vy, py = im[1] * vx + im[3] * vy, rT = Math.hypot(px, py);
    ctx.save(); ctx.translate(A.x, A.y); ctx.transform(...A.m, 0, 0);
    for (let k = 0; k < 3; k++) {
      const b = buzz + k * .11, age = t - b; if (age <= 0) continue;
      const u = age / (touch - buzz), r = k === 0 ? (u < 1 ? rT * expoOut(u) : rT * (1 + .35 * eout(clamp((u - 1) / 2.5)))) : rT * (k === 1 ? .82 : .64) * expoOut(u * 1.05) * (1 + .3 * eout(clamp((u - 1) / 2.5)));
      const fade = k === 0 ? (u < 1 ? 1 : Math.max(0, 1 - (u - 1) / 2.8)) : Math.max(0, 1 - u / 3.2), w0 = 6, h0 = 11, relax = clamp(r / 40), rx = mix(w0 + r, r + 8, relax), ry = mix(h0 + r, r + 8, relax);
      const opt = { p: mix(6, 2, relax), lines: k ? 4 : 8, band: (k ? 10 : 18) * (1 - .3 * clamp(u - 1)), wave: 34, rot: -.35 * (1 - relax), ph: b * 3.1 + k * 1.7 + age * .7 };
      ring(ctx, 0, 0, rx, ry, { ...opt, col: '#b4561a', glow: null, op: 'source-over', lineA: 1, a: .9 * fade, lw: 1.05 });
      ring(ctx, 0, 0, rx, ry, { ...opt, lines: 3, col: '#fff1d6', glow: '#ffb35c', glowA: .14, a: .75 * fade, lw: .75 });
    }
    ctx.restore();
  };
  ringsFor(AO, 1); ringsFor(AM, -1);
  // the touch: a foil spark where the two rings meet, a small burst ring
  { const u = t - touch; if (u > -.05) { const B = spark(), k = Math.exp(-Math.max(0, u) * 1.6) * clamp((u + .05) / .08), sz = 1 + .4 * eout(clamp(u / .4));
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = k; ctx.drawImage(B, mid[0] - 300 * sz, mid[1] - 300 * sz, 600 * sz, 600 * sz); ctx.restore();
      ring(ctx, mid[0], mid[1], 20 + 120 * eout(clamp(u / .8)), (20 + 120 * eout(clamp(u / .8))) * .62, { lines: 5, band: 10, wave: 22, col: '#fff1d6', glow: '#ffb35c', a: .8 * k, lw: .8 }); } }
  // the two phones, then the labels with the clocks
  for (const [A, wk] of [[AO, wake], [AM, wake + .08]]) { ctx.save(); ctx.translate(A.x, A.y); ctx.transform(...A.m, 0, 0); paperPhone(ctx, t, wk, buzz); ctx.restore(); }
  const la = (d) => eout(clamp((t - t0 - d) / .6));
  { const lx = AO.x + 120, ly = AO.y - 96; ctx.save(); ctx.globalAlpha = la(.25); ctx.strokeStyle = 'rgba(255,236,205,.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(AO.x + 14, AO.y - 12); ctx.lineTo(lx - 8, ly + 12); ctx.lineTo(lx - 2, ly + 12); ctx.stroke(); ctx.restore();
    label(ctx, lx, ly, 'OHIO', 'DUSK · 6:#  PM', same, t, la(.25), 'left'); }
  { const lx = AM.x - 120, ly = AM.y - 96; ctx.save(); ctx.globalAlpha = la(.4); ctx.strokeStyle = 'rgba(255,236,205,.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(AM.x - 14, AM.y - 12); ctx.lineTo(lx + 8, ly + 12); ctx.lineTo(lx + 2, ly + 12); ctx.stroke(); ctx.restore();
    label(ctx, lx, ly, 'MANILA', 'DAWN · 6:#  AM', same, t, la(.4), 'right'); }
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .85; ctx.drawImage(lampCone(), 0, 0); ctx.restore();
  { const r = prng(83); ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 60; i++) { const x = ((W * (.4 + .6 * r()) - t * (4 + r() * 9)) % W + W) % W, y = (H * r() + Math.sin(t * .4 + i) * 12 + t * 3) % H; ctx.fillStyle = `rgba(255,226,180,${(.08 + .3 * r())})`; ctx.fillRect(x, y, 1.3, 1.3); } ctx.restore(); }
  const vg = ctx.createRadialGradient(W * .5, H * .55, 420, W * .5, H * .55, 1250); vg.addColorStop(0, 'rgba(6,6,14,0)'); vg.addColorStop(1, 'rgba(6,6,14,.55)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  return { mid };
}

// ---------------------------------------------------------------- 6.23 the same share: two cards in register
const CW = 900, CHh = 330;
function cardLayer() {
  return once('m10-card', () => {
    const pad = 40, [c, g] = canvas(CW + pad * 2, CHh + pad * 2); g.translate(pad, pad);
    g.save(); g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 40; g.shadowOffsetY = 18; g.fillStyle = '#2a1d1a'; g.beginPath(); g.roundRect(0, 0, CW, CHh, 34); g.fill(); g.restore();
    const bg = g.createLinearGradient(0, 0, CW, CHh); bg.addColorStop(0, '#523528'); bg.addColorStop(.5, '#3c2722'); bg.addColorStop(1, '#4e3026'); g.fillStyle = bg; g.beginPath(); g.roundRect(0, 0, CW, CHh, 34); g.fill();
    g.save(); g.beginPath(); g.roundRect(0, 0, CW, CHh, 34); g.clip(); rosette(g, CW * .62, CHh * .5, { R: 300, A: 40, B: 18, n: 30, m: 11, lines: 46, col: '#c87a2c', w: .5, a: .12 }); g.restore();
    gBorder(g, 10, 10, CW - 20, CHh - 20, { band: 18, lines: 6, waves: 120, col: '#ffb35c', w: .8, a: .85, radius: 26 });
    rosette(g, 150, CHh * .5, { R: 64, A: 12, B: 6, n: 18, m: 7, lines: 26, col: '#ffcf8a', w: .6, a: .6 }); g.strokeStyle = 'rgba(255,207,138,.7)'; g.lineWidth = 1.2; g.beginPath(); g.arc(150, CHh * .5, 84, 0, TAU); g.stroke();
    microtext(g, 270, 252, 560, 'ONE EQUAL SHARE FOR EVERY PERSON ON EARTH', { size: 7, col: '#ffcf8a', a: .55 });
    text(g, 'of the largest fortune ever made', 272, 222, { size: 26, weight: 400, color: 'rgba(255,225,190,.82)' });
    stipple(c, { k: .2, g: 1, seed: 6, mid: false, boost: 1 });
    return c;
  });
}
function titleFoil() {
  return once('m10-title', () => {
    const [c, g] = canvas(620, 150); g.font = '112px "Instrument Serif"'; g.textBaseline = 'alphabetic';
    const fg = g.createLinearGradient(0, 20, 620, 130); ['#7a3b17', '#c87a2c', '#ffb35c', '#ffe2a8', '#c87a2c'].forEach((col, i) => fg.addColorStop(i / 4, col)); g.fillStyle = fg; g.fillText('Your share', 6, 112);
    return c;
  });
}
function regMark(ctx, x, y, r, col, a) { ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.moveTo(x - r * 1.7, y); ctx.lineTo(x + r * 1.7, y); ctx.moveTo(x, y - r * 1.7); ctx.lineTo(x, y + r * 1.7); ctx.stroke(); ctx.restore(); }
export function cards(ctx, t, o = {}) {
  const t0 = o.t0 ?? 0, reg = o.reg ?? t0 + .3, glintAt = o.glint ?? reg + .2, ex = o.exit ?? t0 + 1;
  // ground: an engraved plate, dawn-peach on the left, dusk-orange on the right, the rings still running through it
  ctx.fillStyle = '#120d1c'; ctx.fillRect(0, 0, W, H);
  { const g1 = ctx.createRadialGradient(260, 520, 0, 260, 520, 1100); g1.addColorStop(0, 'rgba(240,138,75,.32)'); g1.addColorStop(1, 'rgba(240,138,75,0)'); ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
    const g2 = ctx.createRadialGradient(1680, 560, 0, 1680, 560, 1100); g2.addColorStop(0, 'rgba(245,176,138,.34)'); g2.addColorStop(1, 'rgba(245,176,138,0)'); ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H); }
  const lt = t - t0;
  for (const [cx, k] of [[-260, 0], [W + 260, 1]]) for (let j = 0; j < 3; j++) { const r = 700 + j * 110 + lt * 60; ring(ctx, cx, 540, r, r * .9, { lines: 5, band: 14, wave: 40, col: '#fff1d6', glow: '#ffb35c', glowA: .05, a: .22 - j * .05, lw: .6, ph: t * .3 + j + k }); }
  const u = expoOut(clamp((t - t0 + .05) / (reg - t0 + .05))), off = (1 - u) * 640, rise = expoIn(clamp((t - ex) / .4)) * 900, y = 540 - 40 - rise;
  const L = cardLayer(), TT = titleFoil();
  ctx.save(); ctx.translate(W / 2, 540); ctx.scale(1.4, 1.4); ctx.translate(-W / 2, -540);
  const drawCard = (dx, tag, tagAlign, a) => {
    ctx.save(); ctx.globalAlpha = a; ctx.translate(W / 2 + dx, y); ctx.rotate(dx * -.00012);
    ctx.drawImage(L, -CW / 2 - 40, -CHh / 2 - 40);
    ctx.drawImage(TT, -CW / 2 + 262, -CHh / 2 + 52);
    regMark(ctx, -CW / 2 - 40, 0, 9, '#ffd59a', .8); regMark(ctx, CW / 2 + 40, 0, 9, '#ffd59a', .8);
    ctx.restore();
    const tx = tagAlign === 'left' ? W / 2 + dx - CW / 2 + 10 : W / 2 + dx + CW / 2 - 10;
    text(ctx, tag, tx, y - CHh / 2 - 26, { size: 18, weight: 600, color: '#ffd59a', spacing: 5, align: tagAlign, alpha: a * .95 });
  };
  drawCard(-off, 'OHIO · 6:12 PM', 'left', 1);
  ctx.save(); ctx.globalCompositeOperation = u > .985 ? 'source-over' : 'source-over'; drawCard(off, 'MANILA · 6:12 AM', 'right', u > .985 ? .55 : .92); ctx.restore();
  // in register: one impression; a foil glint runs through both at once, the marks lock with a tiny flash
  if (t > reg - .02) {
    maskedGlint(ctx, TT, W / 2 - CW / 2 + 262, y - CHh / 2 + 52, (t - glintAt) * 2.2, { x: W / 2 - CW / 2 + 160, y: y - 40, span: 900, width: 120, speed: .5, a: 1.6 });
    const fl = Math.exp(-Math.max(0, t - reg) * 6); ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (const mx of [W / 2 - CW / 2 - 40, W / 2 + CW / 2 + 40]) { const g = ctx.createRadialGradient(mx, y, 0, mx, y, 60); g.addColorStop(0, `rgba(255,241,214,${.8 * fl})`); g.addColorStop(1, 'rgba(255,179,92,0)'); ctx.fillStyle = g; ctx.fillRect(mx - 60, y - 60, 120, 120); } ctx.restore();
  }
  ctx.restore();
  const vg = ctx.createRadialGradient(W / 2, H / 2, 380, W / 2, H / 2, 1200); vg.addColorStop(0, 'rgba(8,6,14,0)'); vg.addColorStop(1, 'rgba(8,6,14,.6)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
}
