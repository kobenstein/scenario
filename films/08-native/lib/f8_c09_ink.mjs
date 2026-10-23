// Film 8 · chunk c09 · worlds B and C (owner B3; others may import, never edit).
//
//   WORLD B (8.10–8.11): the India image is a print lying on a dark table; three more prints next to it (a map, a city, a school),
//     a crate of fireflies flies to each; the World Bank report slides in, opens, a red margin mark draws itself beside a printed figure.
//   WORLD C (8.12–8.14): that printed figure IS the ink world (we fly into it): one big lantern on a hill, many small workshops hanging on
//     its threads (one provider), and further down the same sheet a market street in Kenya (the struggling stall, the mentor first).
//
// Units: B = table units (prints 1920×1080 at x 0, 2400, 4800, 7200); C = sheet units (CW × CH, the figure shows y 0…1080).
//   inkReady()                       paint the cached prints (call once)
//   PR                               print rects in B units
//   table(ctx, t, o)                 the dark table + the three prints + captions (current transform = B → screen)
//   cWorld(A)(ctx, t, o)             the ink world in C units (current transform = C → screen); o = { clipTop, lower }
//   inkFly(ctx, t, x, y, s, a, seed) a firefly on paper (green wash, engraved body); s = body length / 10
import { loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, prng, drift, canvas } from '../engine.mjs';
import { F8, swarm, firefly, qio, eoutX, einX } from './f8_kit.mjs';
import { figure, figureKid, walk } from './figure.mjs';
import { vnoise, fbm } from './art.mjs';
import { inkText, inkStrokePath, paperGround, INK } from './f8_chart.mjs';
import { crate, cached, glow, sine } from './f8_c09_world.mjs';

const TAU = Math.PI * 2;
export const CW = 1920, CH = 2280;
const PAPER = '#f1eadb', INKC = '#2a2420', OCHRE = '#b07a2e', AMBER = '#e8a24e', GREEN = '#5f8f6a', RED = '#b23a2a';

// ---------------------------------------------------------------- ink helpers (all in the current transform's units)
function hatchPath(ctx, box, gap, ang, a, lw = 1, col = INKC) {
  const [x, y, w, h] = box; ctx.save(); ctx.clip(); ctx.strokeStyle = rgba(col, a); ctx.lineWidth = lw; ctx.beginPath();
  const c = Math.cos(ang), s = Math.sin(ang), R = Math.hypot(w, h) / 2 + 2, cx = x + w / 2, cy = y + h / 2;
  for (let d = -R; d <= R; d += gap) { ctx.moveTo(cx - s * d - c * R, cy + c * d - s * R); ctx.lineTo(cx - s * d + c * R, cy + c * d + s * R); }
  ctx.stroke(); ctx.restore();
}
function wash(ctx, x, y, r, col, a) {
  if (a <= .004 || r <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(col, a)); g.addColorStop(.45, rgba(col, a * .45)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
}
// a firefly drawn on paper: a soft green wash, a bright abdomen with an ink rim, two wing strokes
export function inkFly(ctx, t, x, y, s = 1, a = 1, seed = 0) {
  if (a <= .01) return; const hx = x + Math.sin(t * 7.3 + seed) * 1.2 * s, hy = y + Math.cos(t * 6.1 + seed * 2) * 1.2 * s, br = .85 + .15 * Math.sin(t * 3.1 + seed * 1.7);
  ctx.save(); ctx.globalAlpha = clamp(a);
  wash(ctx, hx, hy, 16 * s * br, '#7fd39a', .55);
  const fl = Math.sin(t * 38 + seed) * .5 + .5; ctx.strokeStyle = rgba(INKC, .55); ctx.lineWidth = .5 * s; ctx.beginPath();
  ctx.ellipse(hx + 1.5 * s, hy - 2.5 * s, 3.2 * s, (1.2 + fl) * s, -.6, 0, TAU); ctx.ellipse(hx - 1.5 * s, hy - 2.5 * s, 3.2 * s, (1.2 + fl) * s, .6, 0, TAU); ctx.stroke();
  ctx.fillStyle = '#effff2'; ctx.beginPath(); ctx.arc(hx, hy, 2.2 * s, 0, TAU); ctx.fill(); ctx.strokeStyle = rgba('#2f6b52', .9); ctx.lineWidth = .6 * s; ctx.stroke();
  ctx.restore();
}
// the kit's workshop silhouette as an ink drawing on paper (240 × 104 local units); x,y = bottom centre; lit 0..1 = amber wash in windows
function inkHouse(ctx, x, y, s, lit, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const lw = (o.lw ?? 1.5) / s;
  // the window light first (a warm wash on the paper around the house)
  if (lit > 0) wash(ctx, 0, -40, 200, AMBER, .3 * lit);
  ctx.beginPath(); ctx.rect(-120, -70, 240, 70); ctx.fillStyle = '#ece2cc'; ctx.fill(); ctx.strokeStyle = INKC; ctx.lineWidth = lw; ctx.stroke();
  ctx.beginPath(); ctx.rect(-120, -70, 240, 70); hatchPath(ctx, [-120, -70, 240, 70], 9, -.9, .22, lw * .55);
  const tw = 61; ctx.beginPath(); ctx.moveTo(-122, -70); for (let i = 0; i < 4; i++) { const x0 = -122 + i * tw; ctx.lineTo(x0, -104); ctx.lineTo(x0 + tw, -70); } ctx.closePath();
  ctx.fillStyle = '#ded1b4'; ctx.fill(); ctx.strokeStyle = INKC; ctx.lineWidth = lw; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-122, -70); for (let i = 0; i < 4; i++) { const x0 = -122 + i * tw; ctx.lineTo(x0, -104); ctx.lineTo(x0 + tw, -70); } ctx.closePath(); hatchPath(ctx, [-122, -106, 244, 36], 7, -.35, .35, lw * .6);
  const nw = o.nwin ?? 7, ww = 200 / nw;
  for (let i = 0; i < nw; i++) {
    const wx = -112 + i * ww + ww * .2, wy = -56, w = ww * .58, h = 34, L = lit * (o.win ? o.win(i) : 1);
    ctx.fillStyle = L > 0 ? `rgb(${Math.round(mix(58, 240, L))},${Math.round(mix(51, 178, L))},${Math.round(mix(44, 92, L))})` : '#3a332c';
    ctx.fillRect(wx, wy, w, h); ctx.strokeStyle = INKC; ctx.lineWidth = lw * .8; ctx.strokeRect(wx, wy, w, h);
  }
  ctx.fillStyle = lit > 0 ? `rgb(${Math.round(mix(58, 246, lit))},${Math.round(mix(51, 196, lit))},${Math.round(mix(44, 120, lit))})` : '#3a332c'; ctx.fillRect(92, -46, 18, 46); ctx.strokeRect(92, -46, 18, 46);
  ctx.beginPath(); ctx.moveTo(-135, 1); ctx.lineTo(135, 1); ctx.strokeStyle = rgba(INKC, .6); ctx.lineWidth = lw * .9; ctx.stroke();
  ctx.restore();
  return { roof: [x - 92 * s, y - 104 * s], door: [x + 101 * s, y - 20 * s] };
}

// ================================================================ WORLD B · the prints on the table
export const PR = [0, 2400, 4800, 7200].map((x) => ({ x, y: 0, w: 1920, h: 1080 }));
const MAT = 70;
const PRINT_IMG = {};
function paintMap(g) {
  const r = prng(31), n = vnoise(77); g.fillStyle = '#efe6d2'; g.fillRect(0, 0, 1920, 1080);
  // the sea: horizontal engraved lines
  g.strokeStyle = rgba(INKC, .22); g.lineWidth = 1.4; g.beginPath(); for (let y = 12; y < 1080; y += 9) { g.moveTo(0, y); g.lineTo(1920, y); } g.stroke();
  // a land mass (no real country): a noisy blob
  const cx = 960, cy = 520, pts = []; for (let i = 0; i < 260; i++) { const a = i / 260 * TAU, rr = 330 + 150 * (fbm(n, Math.cos(a) * 1.4 + 3, Math.sin(a) * 1.4 + 3, 4) - .5) * 2.6 + 60 * Math.sin(a * 2 + .5); pts.push([cx + Math.cos(a) * rr * 1.45, cy + Math.sin(a) * rr * .95]); }
  const path = () => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); };
  // coastal ripple lines
  for (let k = 3; k >= 1; k--) { g.save(); g.translate(cx, cy); g.scale(1 + k * .035, 1 + k * .05); g.translate(-cx, -cy); path(); g.strokeStyle = rgba(INKC, .18); g.lineWidth = 1.2; g.stroke(); g.restore(); }
  path(); g.fillStyle = '#efe6d2'; g.fill(); g.fillStyle = rgba('#d8c49a', .5); g.fill(); g.strokeStyle = INKC; g.lineWidth = 3.2; g.stroke();
  // inner regions (dashed), rivers, hills
  g.save(); path(); g.clip();
  g.setLineDash([10, 7]); g.strokeStyle = rgba(INKC, .45); g.lineWidth = 1.6;
  for (let k = 0; k < 6; k++) { g.beginPath(); let x = 400 + k * 230, y = 0; g.moveTo(x, y); for (let j = 0; j < 30; j++) { y += 40; x += (r() - .5) * 60; g.lineTo(x, y); } g.stroke(); }
  g.setLineDash([]); g.strokeStyle = rgba('#3f5f7a', .7); g.lineWidth = 2.4;
  for (let k = 0; k < 3; k++) { g.beginPath(); let x = 700 + k * 260, y = 220; g.moveTo(x, y); for (let j = 0; j < 22; j++) { y += 30; x += Math.sin(j * .7 + k) * 22 + (r() - .5) * 10; g.lineTo(x, y); } g.stroke(); }
  g.strokeStyle = rgba(INKC, .5); g.lineWidth = 1.3; for (let i = 0; i < 70; i++) { const x = 500 + r() * 900, y = 260 + r() * 520; g.beginPath(); g.moveTo(x - 9, y + 5); g.lineTo(x, y - 6); g.lineTo(x + 9, y + 5); g.stroke(); }
  g.restore();
  // cities: dots with rings
  for (const [x, y, s] of [[760, 430, 1], [1180, 560, 1.4], [900, 690, .9], [1320, 380, .8], [620, 620, .8], [1050, 330, .7]]) { g.fillStyle = INKC; g.beginPath(); g.arc(x, y, 7 * s, 0, TAU); g.fill(); g.strokeStyle = INKC; g.lineWidth = 2; g.beginPath(); g.arc(x, y, 14 * s, 0, TAU); g.stroke(); }
  // a compass rose and a plain double border
  g.save(); g.translate(1690, 860); g.strokeStyle = INKC; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 70, 0, TAU); g.stroke(); g.beginPath(); g.arc(0, 0, 58, 0, TAU); g.stroke();
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, L = i % 2 ? 50 : 96; g.beginPath(); g.moveTo(Math.cos(a + .14) * 12, Math.sin(a + .14) * 12); g.lineTo(Math.cos(a) * L, Math.sin(a) * L); g.lineTo(Math.cos(a - .14) * 12, Math.sin(a - .14) * 12); g.closePath(); g.fillStyle = i % 2 ? '#efe6d2' : INKC; g.fill(); g.stroke(); }
  g.restore();
  g.strokeStyle = INKC; g.lineWidth = 3; g.strokeRect(30, 30, 1860, 1020); g.lineWidth = 1.2; g.strokeRect(44, 44, 1832, 992);
}
function paintCity(g) {
  const r = prng(52); const sk = g.createLinearGradient(0, 0, 0, 760); sk.addColorStop(0, '#efe3c6'); sk.addColorStop(.7, '#f1d9a8'); sk.addColorStop(1, '#ecc58e'); g.fillStyle = sk; g.fillRect(0, 0, 1920, 1080);
  g.strokeStyle = rgba(INKC, .12); g.lineWidth = 1.2; g.beginPath(); for (let y = 40; y < 700; y += 11) { g.moveTo(0, y); g.lineTo(1920, y); } g.stroke();
  // the sun, low
  g.fillStyle = '#f7e7c4'; g.beginPath(); g.arc(1320, 690, 70, 0, TAU); g.fill(); g.strokeStyle = rgba(INKC, .5); g.lineWidth = 1.6; g.stroke();
  // three rows of buildings: far (pale), mid, near (dark ink hatching)
  for (const [base, hmax, tone, ha] of [[720, 240, '#e1cba2', .12], [760, 330, '#d7bd90', .22], [800, 220, '#cbb084', .32]]) {
    let x = -20; while (x < 1940) {
      const w = 40 + r() * 90, h = (.3 + .7 * r()) * hmax * (.55 + .45 * Math.exp(-Math.pow((x - 900) / 600, 2))), kind = r();
      g.beginPath(); g.moveTo(x, base);
      if (kind < .12) { g.lineTo(x, base - h * .6); g.quadraticCurveTo(x + w / 2, base - h * 1.15, x + w, base - h * .6); }
      else if (kind < .3) { g.lineTo(x, base - h * .75); g.lineTo(x + w / 2, base - h); g.lineTo(x + w, base - h * .75); }
      else if (kind < .38) { g.lineTo(x + w * .4, base - h * 1.3); g.lineTo(x + w * .6, base - h * 1.3); }
      else g.lineTo(x, base - h), g.lineTo(x + w, base - h);
      g.lineTo(x + w, base); g.closePath(); g.fillStyle = tone; g.fill(); g.strokeStyle = INKC; g.lineWidth = 1.8; g.stroke();
      g.save(); g.clip(); g.strokeStyle = rgba(INKC, ha); g.lineWidth = 1.2; g.beginPath(); for (let k = -400; k < 400; k += 7) { g.moveTo(x + k, base); g.lineTo(x + k + 300, base - 300); } g.stroke(); g.restore();
      g.fillStyle = rgba(INKC, .55); for (let k = 0; k < 6; k++) { if (r() < .3) continue; g.fillRect(x + 8 + r() * (w - 18), base - h * (.15 + .6 * r()), 6, 9); }
      x += w + r() * 6;
    }
  }
  // the river with a bridge, the near bank, a plaza (where the crate lands)
  g.fillStyle = '#e6d6b4'; g.fillRect(0, 800, 1920, 280);
  g.strokeStyle = rgba('#3f5f7a', .45); g.lineWidth = 1.4; g.beginPath(); for (let y = 830; y < 930; y += 8) { for (let x = 0; x < 1920; x += 60 + r() * 40) { g.moveTo(x, y); g.lineTo(x + 30 + r() * 30, y); } } g.stroke();
  g.strokeStyle = INKC; g.lineWidth = 2.6; g.beginPath(); g.moveTo(0, 805); g.lineTo(1920, 805); g.moveTo(0, 935); g.lineTo(1920, 935); g.stroke();
  g.beginPath(); for (let k = 0; k < 5; k++) { const x0 = 260 + k * 110; g.moveTo(x0, 935); g.quadraticCurveTo(x0 + 55, 860, x0 + 110, 935); } g.moveTo(240, 850); g.lineTo(830, 850); g.stroke();
  g.strokeStyle = rgba(INKC, .3); g.lineWidth = 1.2; g.beginPath(); for (let x = 0; x < 1920; x += 14) { g.moveTo(x, 950); g.lineTo(x - 30, 1080); } g.stroke();
  g.fillStyle = '#efe4cb'; g.beginPath(); g.ellipse(1180, 1000, 260, 50, 0, 0, TAU); g.fill(); g.strokeStyle = INKC; g.lineWidth = 2; g.stroke();
  g.strokeStyle = INKC; g.lineWidth = 3; g.strokeRect(30, 30, 1860, 1020);
}
function paintSchool(g) {
  const r = prng(73); g.fillStyle = '#eee5d0'; g.fillRect(0, 0, 1920, 1080);
  g.strokeStyle = rgba(INKC, .1); g.lineWidth = 1.2; g.beginPath(); for (let y = 30; y < 620; y += 12) { g.moveTo(0, y); g.lineTo(1920, y); } g.stroke();
  // trees left and right (round crowns, hatched)
  for (const [x, y, R] of [[260, 600, 150], [430, 640, 110], [1640, 610, 160], [1480, 650, 100]]) { g.strokeStyle = INKC; g.lineWidth = 6; g.beginPath(); g.moveTo(x, y + R * 1.6); g.lineTo(x, y); g.stroke(); g.beginPath(); g.arc(x, y - R * .2, R, 0, TAU); g.fillStyle = '#d6cfae'; g.fill(); g.lineWidth = 2; g.stroke(); g.save(); g.clip(); g.strokeStyle = rgba(INKC, .35); g.lineWidth = 1.3; g.beginPath(); for (let k = -400; k < 400; k += 8) { g.moveTo(x + k, y + R); g.lineTo(x + k + 200, y - R * 1.4); } g.stroke(); g.restore(); }
  // the schoolhouse: gabled, a bell tower, tall windows, steps
  const x0 = 640, x1 = 1280, base = 760, top = 470;
  g.beginPath(); g.rect(x0, top, x1 - x0, base - top); g.fillStyle = '#e4d6b6'; g.fill(); g.strokeStyle = INKC; g.lineWidth = 3; g.stroke();
  g.save(); g.clip(); g.strokeStyle = rgba(INKC, .18); g.lineWidth = 1.2; g.beginPath(); for (let y = top + 10; y < base; y += 12) { g.moveTo(x0, y); g.lineTo(x1, y); } g.stroke(); g.restore();
  g.beginPath(); g.moveTo(x0 - 40, top); g.lineTo((x0 + x1) / 2, top - 170); g.lineTo(x1 + 40, top); g.closePath(); g.fillStyle = '#c9b48a'; g.fill(); g.stroke();
  g.save(); g.clip(); g.strokeStyle = rgba(INKC, .4); g.lineWidth = 1.4; g.beginPath(); for (let k = -800; k < 800; k += 9) { g.moveTo(x0 + k, top); g.lineTo(x0 + k + 300, top - 300); } g.stroke(); g.restore();
  const bx = (x0 + x1) / 2; g.beginPath(); g.rect(bx - 40, top - 300, 80, 140); g.fillStyle = '#e4d6b6'; g.fill(); g.stroke(); g.beginPath(); g.moveTo(bx - 52, top - 300); g.lineTo(bx, top - 370); g.lineTo(bx + 52, top - 300); g.closePath(); g.fillStyle = '#c9b48a'; g.fill(); g.stroke();
  g.beginPath(); g.arc(bx, top - 245, 22, Math.PI, 0); g.lineTo(bx + 22, top - 200); g.lineTo(bx - 22, top - 200); g.closePath(); g.fillStyle = '#3a332c'; g.fill();
  g.fillStyle = '#c99a4a'; g.beginPath(); g.arc(bx, top - 222, 10, 0, TAU); g.fill();
  for (let i = 0; i < 6; i++) { const wx = x0 + 50 + i * 95, wy = top + 60; g.beginPath(); g.rect(wx, wy, 50, 130); g.fillStyle = '#3a332c'; g.fill(); g.strokeStyle = INKC; g.lineWidth = 2; g.stroke(); g.strokeStyle = rgba('#efe6d2', .5); g.beginPath(); g.moveTo(wx + 25, wy); g.lineTo(wx + 25, wy + 130); g.moveTo(wx, wy + 65); g.lineTo(wx + 50, wy + 65); g.stroke(); }
  g.beginPath(); g.rect(bx - 45, base - 150, 90, 150); g.fillStyle = '#3a332c'; g.fill();
  for (let k = 0; k < 3; k++) { g.beginPath(); g.rect(bx - 80 - k * 18, base + k * 14, 160 + k * 36, 14); g.fillStyle = '#ddd0b2'; g.fill(); g.strokeStyle = INKC; g.lineWidth = 2; g.stroke(); }
  // the yard and the fence
  g.strokeStyle = INKC; g.lineWidth = 2.4; g.beginPath(); g.moveTo(0, 800); g.lineTo(1920, 800); g.stroke();
  g.strokeStyle = rgba(INKC, .7); g.lineWidth = 2; g.beginPath(); for (let x = 20; x < 1920; x += 34) { if (x > 560 && x < 1360) continue; g.moveTo(x, 800); g.lineTo(x, 740); } g.moveTo(0, 755); g.lineTo(560, 755); g.moveTo(1360, 755); g.lineTo(1920, 755); g.stroke();
  g.strokeStyle = rgba(INKC, .18); g.lineWidth = 1.1; g.beginPath(); for (let x = 0; x < 1920; x += 12) { g.moveTo(x, 810); g.lineTo(x - 40, 1080); } g.stroke();
  // the children in the yard (static in the print)
  const kids = [[420, 960, 'stand', false], [560, 990, 'reachUp', false], [700, 950, 'stand', true], [1310, 970, 'stand', false], [1450, 940, 'hold', true], [1580, 985, 'stand', true], [840, 1000, 'sit', false], [1180, 1005, 'squat', true]];
  const KP = { stand: {}, reachUp: { sh: [2.45, 0.18], el: [0.12, 0.3], lean: -.03, head: -.15 }, hold: { sh: [0.7, 0.6], el: [1.2, 1.3], head: .28 }, sit: { hip: [1.45, 1.5], kn: [1.45, 1.5], sh: [0.5, 0.42], el: [0.8, 0.9], lean: .05 }, squat: { hip: [1.95, 1.85], kn: [2.5, 2.4], lean: .5, sh: [0.95, 0.75], el: [0.45, 0.55], head: .4 } };
  kids.forEach(([x, y, p, fl], i) => figureKid(g, x, y - 92 * .95, .95, KP[p], { t: 0, seed: i + 2, flip: fl, dress: { coat: ['#a8553a', '#5f8f6a', '#3f5f7a', '#c9893f'][i % 4], pants: '#3a332c' }, shadow: true }));
  g.strokeStyle = INKC; g.lineWidth = 3; g.strokeRect(30, 30, 1860, 1020);
}
export async function inkReady() {
  PRINT_IMG.map = cached('c09:map', 1920, 1080, paintMap);
  PRINT_IMG.city = cached('c09:city', 1920, 1080, paintCity);
  PRINT_IMG.school = cached('c09:school', 1920, 1080, paintSchool);
}
// a print card: soft shadow, cream mat, a thin rule, the picture (img or fn), an ink plate mark
function printCard(ctx, R, art, o = {}) {
  ctx.save(); const m = MAT;
  const sh = ctx.createLinearGradient(0, R.y + R.h, 0, R.y + R.h + m * 2.2); sh.addColorStop(0, 'rgba(0,0,0,.45)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(R.x - m + 26, R.y - m + 34, R.w + 2 * m, R.h + 2 * m);
  ctx.fillStyle = '#e9dfc8'; ctx.fillRect(R.x - m, R.y - m, R.w + 2 * m, R.h + 2 * m);
  ctx.strokeStyle = rgba(INKC, .35); ctx.lineWidth = 2; ctx.strokeRect(R.x - 14, R.y - 14, R.w + 28, R.h + 28);
  ctx.save(); ctx.beginPath(); ctx.rect(R.x, R.y, R.w, R.h); ctx.clip();
  if (typeof art === 'function') { ctx.translate(R.x, R.y); art(ctx); } else ctx.drawImage(art, R.x, R.y, R.w, R.h);
  ctx.restore(); ctx.restore();
}
// the dark table, the four prints (P0 = the India world, drawn live by drawP0), the captions and the flying crates
// o = { drawP0(ctx), cap: [u0,u1,u2], crates: [{ from [x,y], to [x,y], t0, t1 }], k (screen px per B unit, for line widths) }
export function table(ctx, t, o = {}) {
  // the table: dark warm-indigo paper with fibre; a lamp pool over the prints
  paperGround(ctx, -3000, -2600, 17000, 6400, { tone: '#191626', grain: .55, seed: 3 });
  const lp = ctx.createRadialGradient(4800, 400, 0, 4800, 400, 7000); lp.addColorStop(0, 'rgba(255,214,160,.10)'); lp.addColorStop(1, 'rgba(255,214,160,0)'); ctx.fillStyle = lp; ctx.fillRect(-3000, -2600, 17000, 6400);
  printCard(ctx, PR[0], o.drawP0);
  printCard(ctx, PR[1], PRINT_IMG.map); printCard(ctx, PR[2], PRINT_IMG.city); printCard(ctx, PR[3], PRINT_IMG.school);
  // captions under the prints (Inter caps, cream on the dark table), revealed on the spoken words
  ['ANY COUNTRY', 'ANY CITY', 'ANY SCHOOL'].forEach((s, i) => { const u = o.cap?.[i] ?? 0; if (u > 0) inkText(ctx, s, PR[i + 1].x, PR[i + 1].y + PR[i + 1].h + 170, { size: 64, font: 'caps', u, color: '#efe4c6' }); });
  // the crates: each flies on an arc out of the India print, lands on its print and opens; fireflies (on paper) rise out of it
  for (const [i, C] of (o.crates || []).entries()) {
    const u = clamp((t - C.t0) / (C.t1 - C.t0)); if (u <= 0) continue;
    const e = qio(u), lift = 900, x = mix(C.from[0], C.to[0], e), y = mix(C.from[1], C.to[1], e) - Math.sin(Math.PI * e) * lift, s = 3.4 * (1 + .25 * Math.sin(Math.PI * e));
    const land = t - C.t1, sq = land > 0 ? 1 - .05 * Math.exp(-land * 12) * Math.sin(land * 30) : 1;
    ctx.save(); ctx.translate(x, y); ctx.scale(1, sq); ctx.rotate(.12 * Math.sin(Math.PI * e) * (i % 2 ? -1 : 1)); crate(ctx, t, 0, 0, s, { seed: 20 + i, lid: .3 * eoutX(land / .5), rim: .5 }); ctx.restore();
    if (land > 0) for (let k = 0; k < 6; k++) { const ff = eoutX((land - k * .06) / .9), a = TAU * k / 6 + t * (.6 + .1 * k), rr = 110 + 40 * Math.sin(k * 2.1); if (ff <= 0) continue; inkFly(ctx, t, x + Math.cos(a) * rr * ff, y - 140 * s * .3 - 160 * ff + Math.sin(a) * 40 * ff, 6.5, ff, k + i * 7); }
  }
}

// ================================================================ WORLD C · the ink world (one lantern, many workshops; the Kenya street below)
const LANT = { x: 960, y: 470, top: 140, s: 1.5 };   // post foot on the hill crest; the lantern body (scaled s) hangs from top
const HOUSES = (() => {
  const r = prng(909), out = [];
  for (let tries = 0; out.length < 19 && tries < 2000; tries++) {
    const y = 650 + Math.pow(r(), .85) * 430, x = 110 + r() * 1700, s = .3 + (y - 650) / 430 * .28;
    if (Math.abs(x - 960) < 520 && y < 790) continue; if (Math.abs(x - 960) < 200 && y < 900) continue;
    if (out.some((h) => Math.abs(h.x - x) < 240 * (h.s + s) * .6 && Math.abs(h.y - y) < 110)) continue;
    out.push({ x, y, s, seed: out.length, d: .06 + r() * .06 });
  }
  out.push({ x: 1700, y: 1810, s: .66, seed: 40, d: .1, street: true });
  return out.sort((a, b) => a.y - b.y);
})();
const LAND = (() => { const n = vnoise(404), L = []; for (const [y0, amp, a] of [[520, 26, .55], [600, 18, .4], [700, 22, .35], [830, 24, .3], [980, 26, .28], [1150, 30, .26], [1330, 30, .24], [1480, 26, .22]]) { const pts = []; for (let x = -60; x <= CW + 60; x += 30) pts.push([x, y0 - amp * (fbm(n, x * .003, y0 * .01, 3) - .5) * 2]); L.push({ pts, a }); } return L; })();
const STALLS = [{ x: 420, c: '#c9893f' }, { x: 760, c: '#5f8f6a' }, { x: 1100, c: '#a8553a', hero: true }, { x: 1520, c: '#3f5f7a' }];
const SB = 1900;   // the street ground line (C units)
function threadPath(h) { const b = inkRoof(h), a = [LANT.x + clamp((b[0] - LANT.x) * .05, -40, 40), LANT.top + 100 * LANT.s], mx = (a[0] + b[0]) / 2, my = Math.max(a[1], b[1]) + 20 + Math.abs(b[0] - a[0]) * .1; return { a, b, c: [mx, my] }; }
const inkRoof = (h) => [h.x - 92 * h.s, h.y - 104 * h.s];
const qpt = (P, q) => [(1 - q) ** 2 * P.a[0] + 2 * (1 - q) * q * P.c[0] + q * q * P.b[0], (1 - q) ** 2 * P.a[1] + 2 * (1 - q) * q * P.c[1] + q * q * P.b[1]];
function lantern(ctx, t, fl) {
  const { x, y, s: ls } = LANT, top0 = LANT.top;
  wash(ctx, x, top0 + 60 * ls, 520, AMBER, .42 * fl); wash(ctx, x, top0 + 60 * ls, 180, '#ffd58a', .55 * fl);
  ctx.strokeStyle = INKC; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, top0 + 100 * ls); ctx.stroke();
  ctx.save(); ctx.translate(x, top0); ctx.scale(ls, ls); ctx.translate(-x, 0); const top = 0;
  ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 14, top + 104); ctx.lineTo(x + 14, top + 104); ctx.stroke();
  // the body: a cap, four panes, a flame
  ctx.beginPath(); ctx.moveTo(x - 34, top + 100); ctx.lineTo(x - 42, top + 20); ctx.lineTo(x + 42, top + 20); ctx.lineTo(x + 34, top + 100); ctx.closePath();
  const L = fl; ctx.fillStyle = `rgb(${Math.round(mix(70, 250, L))},${Math.round(mix(60, 214, L))},${Math.round(mix(50, 140, L))})`; ctx.fill(); ctx.lineWidth = 3; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 14, top + 100); ctx.lineTo(x - 17, top + 20); ctx.moveTo(x + 14, top + 100); ctx.lineTo(x + 17, top + 20); ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = rgba('#fff6e0', .9 * L); ctx.beginPath(); ctx.moveTo(x, top + 38 - 4 * Math.sin(t * 9)); ctx.quadraticCurveTo(x + 12, top + 70, x, top + 82); ctx.quadraticCurveTo(x - 12, top + 70, x, top + 38 - 4 * Math.sin(t * 9)); ctx.fill();
  ctx.fillStyle = '#d9c9a4'; ctx.beginPath(); ctx.moveTo(x - 56, top + 22); ctx.lineTo(x, top - 26); ctx.lineTo(x + 56, top + 22); ctx.closePath(); ctx.fill(); ctx.lineWidth = 3; ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.moveTo(x - 56, top + 22); ctx.lineTo(x, top - 26); ctx.lineTo(x + 56, top + 22); ctx.closePath(); hatchPath(ctx, [x - 60, top - 30, 120, 56], 6, -.5, .4, 1.2); ctx.restore();
  ctx.beginPath(); ctx.arc(x, top - 34, 9, 0, TAU); ctx.stroke();
  ctx.restore();
  ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(x - 30, y); ctx.lineTo(x + 30, y); ctx.stroke();
}
// the stall of the market street: posts, a striped scalloped awning, a table with produce (bottom centre at x, SB)
function stall(ctx, t, S) {
  const x = S.x, w = 300, h = 210, y = SB;
  ctx.strokeStyle = INKC; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - w / 2 + 10, y); ctx.lineTo(x - w / 2 + 10, y - h); ctx.moveTo(x + w / 2 - 10, y); ctx.lineTo(x + w / 2 - 10, y - h); ctx.stroke();
  const sw = Math.sin(t * 1.3 + x) * 3;
  const awning = () => { ctx.beginPath(); ctx.moveTo(x - w / 2 - 20, y - h + 40 + sw * .3); ctx.lineTo(x - w / 2 + 10, y - h - 30); ctx.lineTo(x + w / 2 - 10, y - h - 30); ctx.lineTo(x + w / 2 + 20, y - h + 40 + sw * .3);
    for (let i = 6; i >= 0; i--) { const px = x - w / 2 - 20 + (w + 40) * i / 6; ctx.lineTo(px, y - h + 40 + sw * .3); if (i) ctx.quadraticCurveTo(px - (w + 40) / 12, y - h + 62 + sw * .3, px - (w + 40) / 6, y - h + 40 + sw * .3); }
    ctx.closePath(); };
  awning(); ctx.fillStyle = '#efe4cb'; ctx.fill();
  ctx.save(); ctx.clip(); ctx.fillStyle = rgba(S.c, .75); for (let i = 0; i < 6; i += 2) ctx.fillRect(x - w / 2 - 20 + (w + 40) * i / 6, y - h - 40, (w + 40) / 6, 120); ctx.restore();
  awning(); hatchPath(ctx, [x - w, y - h - 40, 2 * w, 120], 6, -.8, .25, 1.1);
  awning(); ctx.strokeStyle = INKC; ctx.lineWidth = 2.4; ctx.stroke();
  // the table and its produce (round fruit and baskets)
  ctx.fillStyle = '#d8c7a0'; ctx.fillRect(x - w / 2 + 6, y - 90, w - 12, 16); ctx.strokeRect(x - w / 2 + 6, y - 90, w - 12, 16);
  ctx.beginPath(); ctx.moveTo(x - w / 2 + 20, y - 74); ctx.lineTo(x - w / 2 + 26, y); ctx.moveTo(x + w / 2 - 20, y - 74); ctx.lineTo(x + w / 2 - 26, y); ctx.stroke();
  const r = prng(S.x | 0);
  for (let k = 0; k < 3; k++) { const bx = x - 90 + k * 90; ctx.beginPath(); ctx.ellipse(bx, y - 96, 36, 12, 0, 0, Math.PI); ctx.lineTo(bx - 36, y - 96); ctx.fillStyle = '#c8a36a'; ctx.fill(); ctx.stroke();
    for (let j = 0; j < 7; j++) { const fx = bx - 26 + j * 8.6, fy = y - 102 - (j % 2) * 9 - r() * 3; ctx.beginPath(); ctx.arc(fx, fy, 7, 0, TAU); ctx.fillStyle = [S.c, '#d0a03c', '#8a9a4a'][(j + k) % 3]; ctx.fill(); ctx.lineWidth = 1.4; ctx.stroke(); } ctx.lineWidth = 2.4; }
}
// the street behind the stalls: low buildings with tin roofs, an acacia, a few passers-by far behind
const STREET = (() => { const r = prng(1313), b = []; let x = -40; while (x < CW + 40) { const w = 120 + r() * 160, h = 110 + r() * 120; b.push({ x, w, h, k: r() }); x += w + 6 + r() * 30; } return b; })();
function streetBack(ctx, t) {
  const base = 1800;
  for (const B of STREET) {
    ctx.beginPath(); ctx.moveTo(B.x, base); ctx.lineTo(B.x, base - B.h); if (B.k < .5) { ctx.lineTo(B.x + B.w + 14, base - B.h - 16); ctx.lineTo(B.x + B.w + 14, base - B.h - 4); } ctx.lineTo(B.x + B.w, base - B.h); ctx.lineTo(B.x + B.w, base); ctx.closePath();
    ctx.fillStyle = '#e6dbc1'; ctx.fill(); ctx.strokeStyle = INKC; ctx.lineWidth = 2; ctx.stroke();
    ctx.save(); ctx.clip(); ctx.strokeStyle = rgba(INKC, .16); ctx.lineWidth = 1.1; ctx.beginPath(); for (let k = -300; k < 400; k += 8) { ctx.moveTo(B.x + k, base); ctx.lineTo(B.x + k + 260, base - 260); } ctx.stroke(); ctx.restore();
    ctx.fillStyle = '#3a332c'; ctx.fillRect(B.x + B.w * .2, base - 70, 26, 70); for (let k = 0; k < 2; k++) ctx.fillRect(B.x + B.w * (.5 + k * .22), base - B.h * .7, 20, 26);
  }
  // an acacia (flat crown) at the left
  ctx.strokeStyle = INKC; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(250, 1860); ctx.quadraticCurveTo(240, 1720, 280, 1620); ctx.moveTo(262, 1700); ctx.quadraticCurveTo(200, 1660, 170, 1620); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(250, 1600, 190, 34, -.03, 0, TAU); ctx.fillStyle = '#c9c39a'; ctx.fill(); ctx.lineWidth = 2.2; ctx.stroke(); ctx.save(); ctx.clip(); hatchPath(ctx, [40, 1550, 420, 100], 6, -.3, .4, 1.2); ctx.restore();
  // the ground of the street
  ctx.strokeStyle = INKC; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(-60, base); ctx.lineTo(CW + 60, base); ctx.moveTo(-60, SB); ctx.lineTo(CW + 60, SB); ctx.stroke();
  ctx.strokeStyle = rgba(INKC, .2); ctx.lineWidth = 1.2; ctx.beginPath(); for (let x = -40; x < CW + 60; x += 13) { ctx.moveTo(x, SB + 6); ctx.lineTo(x - 50, CH); } ctx.stroke();
  // passers-by behind the stalls (small, slow)
  for (const [i, P] of [[0, { x0: -60, v: 38, y: 1800, s: .55 }], [1, { x0: 1980, v: -30, y: 1800, s: .52 }]]) {
    const x = P.x0 + P.v * (t - 460); if (x < -120 || x > CW + 120) continue;
    figure(ctx, x, P.y - 92.6 * P.s, P.s, walk(t * 5.2 + i), { t, seed: 30 + i, flip: P.v < 0, dress: { coat: i ? '#6a7a5a' : '#8a5a3a', pants: '#3a332c', skin: '#6a4430' }, shadow: false });
  }
}
// the red falling line of 5.10, small, hovering over the stall
function fallLine(ctx, t, x, y, sink) {
  const pts = []; for (let i = 0; i <= 8; i++) { const q = i / 8; pts.push([x + q * 170, y - 40 + q * 52 + 8 * Math.sin(q * 9 + 1) * (1 - q) + q * q * 30 * sink]); }
  const yy = 4 * Math.sin(t * 1.6); ctx.save(); ctx.translate(0, yy + sink * 26);
  ctx.strokeStyle = rgba(INKC, .4); ctx.lineWidth = 1.4; ctx.setLineDash([4, 6]); ctx.beginPath(); ctx.moveTo(x - 10, y - 44); ctx.lineTo(x + 182, y - 44); ctx.stroke(); ctx.setLineDash([]);
  inkStrokePath(ctx, pts, 1, { w: 5, col: RED, seed: 4 });
  const [ax, ay] = pts[8], [bx, by] = pts[7], an = Math.atan2(ay - by, ax - bx); ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(ax + Math.cos(an) * 12, ay + Math.sin(an) * 12); ctx.lineTo(ax + Math.cos(an + 2.5) * 12, ay + Math.sin(an + 2.5) * 12); ctx.lineTo(ax + Math.cos(an - 2.5) * 12, ay + Math.sin(an - 2.5) * 12); ctx.closePath(); ctx.fill();
  ctx.restore();
}
// A = anchors { single, provider, didnt, first, second, mentorIn, mentorAt }
export function cWorld(A) {
  // the lantern's flicker on "single provider": a few irregular dips; a house follows with its own delay
  const fl = (t) => { let v = 1; for (const [c, w, d] of [[A.single + .05, .06, .55], [A.single + .22, .05, .35], [A.single + .4, .08, .7], [A.provider + .28, .07, .4], [A.provider + .5, .05, .25]]) v -= d * Math.exp(-Math.pow((t - c) / w, 2)); return clamp(v, .12, 1); };
  return (ctx, t, o = {}) => {
    ctx.save();
    if (o.clipTop) { ctx.beginPath(); ctx.rect(0, 0, CW, 1080); ctx.clip(); }
    const lw = o.lw ?? 1;
    // the land: contour lines with a faint hatch below the far hills
    for (const [i, L] of LAND.entries()) { if (!o.lower && L.pts[0][1] > 1120) continue; ctx.strokeStyle = rgba(INKC, L.a); ctx.lineWidth = 1.6 * lw; ctx.beginPath(); L.pts.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); if (i === 0) { ctx.save(); ctx.beginPath(); L.pts.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.lineTo(CW + 60, 600); ctx.lineTo(-60, 600); ctx.closePath(); hatchPath(ctx, [-60, 470, CW + 120, 140], 7, -.9, .16, 1); ctx.restore(); } }
    // the lantern hill
    { const hill = () => { ctx.beginPath(); ctx.moveTo(300, 800); ctx.bezierCurveTo(560, 760, 700, LANT.y + 4, 960, LANT.y); ctx.bezierCurveTo(1220, LANT.y + 4, 1360, 760, 1620, 800); };
      hill(); ctx.bezierCurveTo(1300, 860, 620, 860, 300, 800); ctx.closePath(); ctx.fillStyle = '#e9dfc6'; ctx.fill(); hatchPath(ctx, [300, 440, 1320, 420], 8, -.95, .2, 1.2 * lw);
      hill(); ctx.strokeStyle = INKC; ctx.lineWidth = 2.4 * lw; ctx.stroke();
      ctx.strokeStyle = rgba(INKC, .3); ctx.lineWidth = 1.3 * lw; ctx.beginPath(); for (let k = 1; k <= 3; k++) { const yy = LANT.y + k * 70; ctx.moveTo(960 - 140 - k * 150, yy + 12); ctx.quadraticCurveTo(960, yy - 10, 960 + 140 + k * 150, yy + 12); } ctx.stroke(); }
    const F = fl(t);
    // threads from the lantern to every workshop (gold ink), fireflies travelling down them
    const shown = HOUSES.filter((h) => !h.street || o.lower), land = shown.filter((h) => !h.street);
    ctx.lineCap = 'round';
    for (const h of shown) { const P = threadPath(h); ctx.strokeStyle = rgba(OCHRE, .75); ctx.lineWidth = 1.6 * lw; ctx.beginPath(); ctx.moveTo(P.a[0], P.a[1]); ctx.quadraticCurveTo(P.c[0], P.c[1], P.b[0], P.b[1]); ctx.stroke(); }
    lantern(ctx, t, F);
    const house = (h) => inkHouse(ctx, h.x, h.y, h.s, clamp(fl(t - h.d)), { lw: 1.5 * lw, win: (i) => .8 + .2 * Math.sin(t * 1.3 + i * 2 + h.seed) });
    for (const h of land) house(h);
    for (const [j, h] of shown.entries()) { const P = threadPath(h), per = 3.2 + (j % 5) * .35, q = .12 + .84 * (((t + j * .61) / per) % 1); inkFly(ctx, t, ...qpt(P, q), 2.4 * lw, sm(clamp((q - .12) * 8)) * sm(clamp((.96 - q) * 8)) * (.35 + .65 * F), j * 3); }
    if (o.lower) {
      streetBack(ctx, t);
      for (const h of shown) if (h.street) house(h);
      for (const S of STALLS) stall(ctx, t, S);
      kenya(ctx, t, o);
    }
    ctx.restore();
  };
  // 8.13 / 8.14 · the struggling woman at her stall, the red line, the mentor who comes first, the fireflies that come second
  function kenya(ctx, t, o) {
    const wx = 1010, sinkU = eio(clamp((t - A.didnt + .05) / .8));
    fallLine(ctx, t, 1040, 1560, sinkU);
    // the mentor: walks in from the right, stops beside her on "first", turns a little toward her
    const mx0 = 2020, mx1 = 1185, t0 = A.mentorIn, t1 = A.mentorAt, u = clamp((t - t0) / (t1 - t0));
    const ease = (q) => (q < .82 ? q / .82 * .9 : .9 + .1 * eout((q - .82) / .18));   // constant walk, then the last step settles
    const mx = mix(mx0, mx1, ease(u)), walking = u > 0 && u < 1;
    const ph = (mx0 - mx) / 230 * TAU;
    // the woman (profile, facing right toward the street); her three fireflies hang low, barely moving
    figure(ctx, wx, SB - 92.6 * 1.02, 1.02, { sh: [.2, .1], el: [.35, .3], head: .14 + .1 * eio(clamp((t - t1 + .3) / .6)) * -1 }, { t, seed: 4, dress: { coat: '#a8553a', pants: '#3a2a26', skin: '#6a4430', hair: '#1a1214' }, shadow: true, hatch: .5 });
    for (let k = 0; k < 3; k++) { const a = t * .5 + k * 2.1; inkFly(ctx, t, wx + 40 + Math.cos(a) * 26, SB - 120 + Math.sin(a * 1.3) * 8 + k * 6, 5.5, 1, k + 70); }
    if (u > 0) figure(ctx, mx, SB - 92.6 * 1.04, 1.04, walking ? { ...walk(ph), lean: .07 } : { lean: .05, head: .05, sh: [.3, .1], el: [.5, .3] }, { t, seed: 9, flip: true, dress: { coat: '#4a5a6a', pants: '#2a2a34', skin: '#5a3a28', hair: '#b8b2a8' }, shadow: true, hatch: .5 });
    // the fireflies that follow her (second): along her path, arriving on "second" round both of them
    const ts = A.second;
    for (let k = 0; k < 7; k++) {
      const delay = .5 + k * .12, q = clamp((t - t0 - delay) / (ts - .1 - t0 - delay)), e = eio(q); if (q <= 0) continue;
      const a = TAU * k / 7 + t * .9, gx = mix(wx, mx1, .5) + Math.cos(a) * 150, gy = SB - 190 + Math.sin(a) * 42;
      const sx = mix(2060 + k * 30, gx, e), sy = mix(SB - 260 - k * 14, gy, e) - Math.sin(Math.PI * e) * 70;
      inkFly(ctx, t, sx, sy, 6, 1, k + 90);
    }
  }
}
