// Film 7 · c11 · the you-image of 11.04: a warm home on a winter night, seen from outside (06d "A warm home. Food on the table. Clean water
// from the tap. Electricity that never cuts out."). Builder: c11. Pure functions of t, deterministic (prng only).
// World units = px at zoom 1; the house stands on the ground line y = 0, centred at x = 0; y grows toward the viewer below the line.
// Layers with parallax p (p = 1: the house): screen = W/2 + (x − cam.x·p)·k, H/2 + (y − cam.y·p)·k, k = 1 + (cam.z − 1)·p.
//   homePrepare()                 builds the cached layers (far hills with a village, the pines, the house body with its window holes) as Images
//   WIN1 … WIN4, DOOR             the windows (house units): WIN1 dining (ground left), WIN2 kitchen (ground right), WIN3 bedroom (upstairs left),
//                                 WIN4 the child's room (upstairs right: dark until the lamp switches on)
//   winScreen(cam, win)           the window's centre on screen (for the light covers)
//   home(ctx, t, cam, st)         the whole picture. st: { warm 0..1 ("A warm home": every window a notch warmer), food 0..1 (the dish is
//                                 carried in 0 → .6, set down .6 → .85, the carrier stands back), steamT (t the dish lands), water 0..1 (the tap
//                                 runs), lamp 0..1 (the lamp upstairs), gust 0..1 (a gust of snow; the lights hold steady), ringA (the ring in the sky) }
import { loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, prng, canvas, text } from '../engine.mjs';
import { ring as kitRing, glowAt, ease, n1 } from './f7_kit.mjs';
import { figureFlat, figureBack, POSES } from './figure.mjs';

const TAU = Math.PI * 2;
export const WIN1 = { x: -240, y: -168, w: 184, h: 128 }, WIN2 = { x: 92, y: -168, w: 166, h: 128 }, WIN3 = { x: -214, y: -382, w: 132, h: 108 }, WIN4 = { x: 72, y: -382, w: 144, h: 108 };
export const DOOR = { x: -30, y: -186, w: 92, h: 186 }, DOORG = { x: -16, y: -172, w: 64, h: 66 };
const HOUSE = { x0: -290, x1: 290, wall: -420, apex: -640, eave: 34 };
const LAYER = { hills: { p: .22, x0: -1700, y0: -330, w: 3400, h: 420, sc: 1 }, pines: { p: .6, x0: -1500, y0: -520, w: 3000, h: 560, sc: 1.5 }, house: { p: 1, x0: -340, y0: -700, w: 680, h: 740, sc: 2 } };
const IMG = {};
export const hm = (cam, p) => { const k = 1 + (cam.z - 1) * p; return { k, X: (x) => W / 2 + (x - cam.x * p) * k, Y: (y) => H / 2 + (y - cam.y * p) * k }; };
export function winScreen(cam, w) { const m = hm(cam, 1); return [m.X(w.x + w.w / 2), m.Y(w.y + w.h / 2)]; }

// ---------------------------------------------------------------- cached layers
function hillsLayer() {
  const L = LAYER.hills, [c, g] = canvas(L.w, L.h), r = prng(71);
  g.translate(-L.x0, -L.y0);
  const ridge = (base, amp, f, ph, col, rim) => {
    g.beginPath(); g.moveTo(L.x0, L.y0 + L.h);
    for (let x = L.x0; x <= L.x0 + L.w; x += 8) g.lineTo(x, base - amp * (.6 + .4 * Math.sin(x * f + ph)) - amp * .3 * Math.sin(x * f * 2.7 + ph * 2));
    g.lineTo(L.x0 + L.w, L.y0 + L.h); g.closePath(); g.fillStyle = col; g.fill(); g.strokeStyle = rim; g.lineWidth = 1.4; g.stroke();
  };
  ridge(-150, 90, .0021, 1.3, '#2a3466', 'rgba(220,230,255,.35)');
  // snow hatching on the far ridge (cool, fine)
  g.save(); g.clip(); g.strokeStyle = 'rgba(200,214,255,.08)'; g.lineWidth = 1; g.beginPath(); for (let x = L.x0 - 300; x < L.x0 + L.w; x += 9) { g.moveTo(x, -260); g.lineTo(x + 300, 60); } g.stroke(); g.restore();
  ridge(-60, 70, .0033, 4.1, '#1d2552', 'rgba(220,230,255,.28)');
  // a village on the far slope: tiny warm windows (more homes, all lit)
  for (let i = 0; i < 140; i++) { const x = L.x0 + 100 + r() * (L.w - 200), y = -70 - r() * 80 + 30 * Math.sin(x * .003); g.fillStyle = `rgba(255,${190 + Math.round(r() * 40)},120,${.55 + .4 * r()})`; const s = 1.6 + r() * 1.8; g.fillRect(x, y, s, s * .8); }
  return c;
}
function pine(g, x, y, h, r) {
  const w = h * .42;
  g.fillStyle = '#0d1430'; g.fillRect(x - h * .025, y - h * .16, h * .05, h * .16);
  for (let k = 0; k < 4; k++) {
    const yt = y - h * (.25 + .21 * k) - h * .1, wb = w * (1 - .2 * k), yb = y - h * (.12 + .2 * k);
    g.fillStyle = '#0f1734'; g.beginPath(); g.moveTo(x - wb / 2, yb); g.quadraticCurveTo(x - wb * .15, yb - h * .08, x, yt); g.quadraticCurveTo(x + wb * .15, yb - h * .08, x + wb / 2, yb); g.closePath(); g.fill();
    // snow on the tier
    g.fillStyle = 'rgba(214,224,246,.8)'; g.beginPath(); g.moveTo(x - wb * .42, yb - h * .015); g.quadraticCurveTo(x - wb * .12, yb - h * .09, x, yt + h * .01); g.quadraticCurveTo(x + wb * .02, yb - h * .07, x + wb * .2, yb - h * .05); g.quadraticCurveTo(x - wb * .1, yb - h * .03, x - wb * .42, yb - h * .015); g.closePath(); g.fill();
  }
  g.strokeStyle = 'rgba(200,214,255,.25)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y - h); g.lineTo(x, y - h * .9); g.stroke();
}
function pinesLayer() {
  const L = LAYER.pines, [c, g] = canvas(L.w * L.sc, L.h * L.sc), r = prng(83);
  g.scale(L.sc, L.sc); g.translate(-L.x0, -L.y0);
  // a snowy rise the pines stand on
  g.beginPath(); g.moveTo(L.x0, L.y0 + L.h); for (let x = L.x0; x <= L.x0 + L.w; x += 10) g.lineTo(x, -20 - 22 * Math.sin(x * .004 + 1) - 10 * Math.sin(x * .011)); g.lineTo(L.x0 + L.w, L.y0 + L.h); g.closePath();
  const sg = g.createLinearGradient(0, -60, 0, 40); sg.addColorStop(0, '#5a6896'); sg.addColorStop(1, '#2c3764'); g.fillStyle = sg; g.fill();
  const xs = []; for (let x = L.x0 + 40; x < L.x0 + L.w - 40; x += 46 + r() * 50) { if (Math.abs(x) < 330) continue; xs.push(x); }
  for (const x of xs) pine(g, x + r() * 12, -18 - 22 * Math.sin(x * .004 + 1) + 6, 170 + r() * 160, r);
  return c;
}
function houseLayer() {
  const L = LAYER.house, [c, g] = canvas(L.w * L.sc, L.h * L.sc), r = prng(97);
  g.scale(L.sc, L.sc); g.translate(-L.x0, -L.y0);
  const { x0, x1, wall, apex, eave } = HOUSE;
  // walls: dark painted boards with engraved siding lines
  const wg = g.createLinearGradient(x0, 0, x1, 0); wg.addColorStop(0, '#1e2648'); wg.addColorStop(.6, '#232c52'); wg.addColorStop(1, '#171d3c'); g.fillStyle = wg; g.fillRect(x0, wall, x1 - x0, -wall);
  g.strokeStyle = 'rgba(150,170,230,.16)'; g.lineWidth = 1; g.beginPath(); for (let y = wall + 10; y < 0; y += 11) { g.moveTo(x0, y); g.lineTo(x1, y + .5); } g.stroke();
  g.strokeStyle = 'rgba(0,0,0,.25)'; g.beginPath(); for (let y = wall + 11; y < 0; y += 11) { g.moveTo(x0, y + 1.2); g.lineTo(x1, y + 1.7); } g.stroke();
  // shadow hatching toward the ground and the right side
  g.save(); g.beginPath(); g.rect(x0, wall, x1 - x0, -wall); g.clip(); g.strokeStyle = 'rgba(4,6,20,.35)'; g.lineWidth = 1; g.beginPath(); for (let x = x0 - 400; x < x1; x += 6) { g.moveTo(x, 0); g.lineTo(x + 140, -140); } g.stroke(); g.restore();
  const vg = g.createLinearGradient(0, -120, 0, 0); vg.addColorStop(0, 'rgba(4,6,20,0)'); vg.addColorStop(1, 'rgba(4,6,20,.4)'); g.fillStyle = vg; g.fillRect(x0, -120, x1 - x0, 120);
  // corner boards, the floor band
  g.fillStyle = '#2c355e'; g.fillRect(x0, wall, 12, -wall); g.fillRect(x1 - 12, wall, 12, -wall); g.fillRect(x0, -214, x1 - x0, 9);
  // the chimney (behind the roof line), brick hatching
  g.fillStyle = '#2a2236'; g.fillRect(150, -600, 50, 120); g.strokeStyle = 'rgba(255,200,170,.12)'; g.beginPath(); for (let y = -596; y < -480; y += 9) { g.moveTo(150, y); g.lineTo(200, y); } g.stroke();
  g.fillStyle = '#3a3048'; g.fillRect(144, -608, 62, 12); g.fillStyle = 'rgba(226,234,250,.9)'; g.beginPath(); g.ellipse(175, -608, 33, 7, 0, Math.PI, TAU); g.fill();
  // the roof: dark slate under a thick blanket of snow (its edge drips over the eaves)
  g.fillStyle = '#121630'; g.beginPath(); g.moveTo(x0 - eave, wall + 4); g.lineTo(0, apex); g.lineTo(x1 + eave, wall + 4); g.lineTo(x1 + eave, wall + 16); g.lineTo(0, apex + 14); g.lineTo(x0 - eave, wall + 16); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(x0 - eave - 6, wall + 2); g.lineTo(0, apex - 10); g.lineTo(x1 + eave + 6, wall + 2);
  for (let x = x1 + eave + 6; x >= x0 - eave - 6; x -= 14) g.lineTo(x, wall + 4 + 5 * Math.abs(Math.sin(x * .13)) + (r() < .15 ? 9 : 0));
  g.closePath(); const rg = g.createLinearGradient(-200, apex, 200, wall); rg.addColorStop(0, '#e9eef8'); rg.addColorStop(.55, '#c9d3ea'); rg.addColorStop(1, '#8e9cc4'); g.fillStyle = rg; g.fill();
  g.strokeStyle = 'rgba(70,86,140,.3)'; g.lineWidth = 1; g.beginPath(); for (let k = 1; k < 9; k++) { const q = k / 9; g.moveTo(mix(0, x0 - eave, q), mix(apex, wall, q) + 3); g.lineTo(mix(0, x1 + eave, q * .98), mix(apex, wall, q) + 2); } g.stroke();
  // the gable: an attic vent, engraved boards
  g.fillStyle = '#1a2142'; g.beginPath(); g.moveTo(x0 + 10, wall); g.lineTo(0, apex + 30); g.lineTo(x1 - 10, wall); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(150,170,230,.14)'; g.beginPath(); for (let y = apex + 40; y < wall; y += 11) { const hw = (y - apex - 30) / (wall - apex - 30) * (x1 - x0 - 20) / 2; g.moveTo(-hw, y); g.lineTo(hw, y); } g.stroke();
  g.fillStyle = '#0d1028'; g.beginPath(); g.arc(0, -500, 18, 0, TAU); g.fill(); g.strokeStyle = 'rgba(207,214,238,.5)'; g.lineWidth = 2; g.stroke();
  // the porch roof over the door, with snow
  g.fillStyle = '#151a36'; g.beginPath(); g.moveTo(DOOR.x - 34, DOOR.y - 6); g.lineTo(DOOR.x + DOOR.w / 2, DOOR.y - 46); g.lineTo(DOOR.x + DOOR.w + 34, DOOR.y - 6); g.closePath(); g.fill();
  g.fillStyle = '#d6deef'; g.beginPath(); g.moveTo(DOOR.x - 38, DOOR.y - 8); g.lineTo(DOOR.x + DOOR.w / 2, DOOR.y - 52); g.lineTo(DOOR.x + DOOR.w + 38, DOOR.y - 8); g.lineTo(DOOR.x + DOOR.w + 30, DOOR.y - 2); g.lineTo(DOOR.x + DOOR.w / 2, DOOR.y - 42); g.lineTo(DOOR.x - 30, DOOR.y - 2); g.closePath(); g.fill();
  // the door (wood, warm glass pane cut out), steps with snow
  g.fillStyle = '#3a2a30'; g.fillRect(DOOR.x, DOOR.y, DOOR.w, DOOR.h); g.strokeStyle = 'rgba(255,214,170,.25)'; g.lineWidth = 1.5; g.strokeRect(DOOR.x + 8, DOOR.y + 96, DOOR.w - 16, 70);
  g.fillStyle = '#c4a26a'; g.beginPath(); g.arc(DOOR.x + DOOR.w - 14, DOOR.y + 100, 3.5, 0, TAU); g.fill();
  g.fillStyle = '#d9e1f1'; g.fillRect(DOOR.x - 16, -6, DOOR.w + 32, 8);
  // window frames, mullions are drawn live; here the trim and the snowy sills; then the holes are cut
  for (const wn of [WIN1, WIN2, WIN3, WIN4]) {
    g.fillStyle = '#c9cfe0'; g.fillRect(wn.x - 9, wn.y - 9, wn.w + 18, wn.h + 18);
    g.fillStyle = '#e4eaf6'; g.beginPath(); g.moveTo(wn.x - 16, wn.y + wn.h + 9); g.quadraticCurveTo(wn.x + wn.w / 2, wn.y + wn.h - 2, wn.x + wn.w + 16, wn.y + wn.h + 9); g.lineTo(wn.x + wn.w + 16, wn.y + wn.h + 16); g.lineTo(wn.x - 16, wn.y + wn.h + 16); g.closePath(); g.fill();
    g.fillStyle = '#b4bdd4'; g.fillRect(wn.x - 14, wn.y - 16, wn.w + 28, 8);
  }
  g.fillStyle = '#c9cfe0'; g.fillRect(DOORG.x - 4, DOORG.y - 4, DOORG.w + 8, DOORG.h + 8);
  // the holes (clearRect: destination-out fills were ignored on this layer)
  for (const wn of [WIN1, WIN2, WIN3, WIN4, DOORG]) g.clearRect(wn.x, wn.y, wn.w, wn.h);
  // the wall lamp by the door (its glow is live)
  g.fillStyle = '#1a1a2c'; g.fillRect(DOOR.x + DOOR.w + 16, DOOR.y + 20, 14, 22); g.fillStyle = '#e8d6a8'; g.fillRect(DOOR.x + DOOR.w + 18, DOOR.y + 24, 10, 14);
  return c;
}
export async function homePrepare() {
  if (IMG.house) return;
  for (const [k, f] of [['hills', hillsLayer], ['pines', pinesLayer], ['house', houseLayer]]) IMG[k] = await loadImage(f().toBuffer('image/png'));
}

// ---------------------------------------------------------------- interiors (house units)
const SIL = '#3a2418', RIM = '#ffe2b0';
const mixPose = (a, b, u) => { const o = {}; for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) { const x = a[k] ?? (Array.isArray(b[k]) ? [0, 0] : 0), y = b[k] ?? (Array.isArray(a[k]) ? [0, 0] : 0); o[k] = Array.isArray(x) ? x.map((v, i) => mix(v, y[i], u)) : (typeof x === 'number' ? mix(x, y, u) : (u < .5 ? x : y)); } return o; };
function room(ctx, wn, lx, ly, br, col0, col1) {
  const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, Math.max(wn.w, wn.h) * 1.05);
  g.addColorStop(0, rgba(col0, br)); g.addColorStop(.55, rgba(col1, br * .95)); g.addColorStop(1, rgba('#7a3e1e', br * .9));
  ctx.fillStyle = '#120e1c'; ctx.fillRect(wn.x, wn.y, wn.w, wn.h); ctx.fillStyle = g; ctx.fillRect(wn.x, wn.y, wn.w, wn.h);
}
function frameBars(ctx, wn, cross = true) {
  ctx.fillStyle = '#2a3054'; ctx.fillRect(wn.x + wn.w / 2 - 2.5, wn.y, 5, wn.h); if (cross) ctx.fillRect(wn.x, wn.y + wn.h * .42 - 2.5, wn.w, 5);
  ctx.strokeStyle = 'rgba(255,240,210,.25)'; ctx.lineWidth = 1; ctx.strokeRect(wn.x + 1, wn.y + 1, wn.w - 2, wn.h - 2);
}
function curtains(ctx, wn, col, a) {
  ctx.fillStyle = rgba(col, a);
  for (const side of [0, 1]) { const x = side ? wn.x + wn.w : wn.x, d = side ? -1 : 1; ctx.beginPath(); ctx.moveTo(x, wn.y); ctx.lineTo(x + d * wn.w * .2, wn.y); ctx.quadraticCurveTo(x + d * wn.w * .1, wn.y + wn.h * .5, x + d * wn.w * .16, wn.y + wn.h); ctx.lineTo(x, wn.y + wn.h); ctx.closePath(); ctx.fill(); }
}
function pot(ctx, x, y, s) {
  ctx.fillStyle = '#4a3226'; ctx.beginPath(); ctx.ellipse(x, y - s * .28, s * .62, s * .34, 0, 0, Math.PI); ctx.lineTo(x - s * .62, y - s * .28); ctx.fill();
  ctx.fillRect(x - s * .62, y - s * .5, s * 1.24, s * .24);
  ctx.fillStyle = '#6a4a36'; ctx.beginPath(); ctx.ellipse(x, y - s * .5, s * .62, s * .14, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#2e2018'; ctx.fillRect(x - s * .82, y - s * .46, s * .2, s * .08); ctx.fillRect(x + s * .62, y - s * .46, s * .2, s * .08);
  ctx.fillStyle = '#7a5a40'; ctx.beginPath(); ctx.arc(x, y - s * .66, s * .07, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(255,230,190,.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y - s * .5, s * .6, s * .12, 0, Math.PI * 1.05, Math.PI * 1.6); ctx.stroke();
}
function steam(ctx, t, x, y, s, t0) {
  const age = t - t0; if (age < 0) return;
  ctx.save(); ctx.lineCap = 'round';
  for (let i = 0; i < 4; i++) {
    const per = 1.6, u = ((age + i * per / 4) % per) / per, on = clamp(age * 2 - i * .3); if (on <= 0) continue;
    ctx.strokeStyle = `rgba(255,248,236,${.42 * Math.sin(Math.PI * u) * on})`; ctx.lineWidth = 2.2;
    ctx.beginPath(); for (let q = 0; q <= 10; q++) { const yy = y - s * .7 - u * s * 1.4 - q * s * .08, xx = x + (i - 1.5) * s * .22 + Math.sin(q * .8 + t * 3 + i) * s * .08; q ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke();
  }
  ctx.restore();
}
function dining(ctx, t, st, br) {
  const wn = WIN1, yt = wn.y + wn.h * .66;
  room(ctx, wn, wn.x + wn.w * .5, wn.y + 18, br, '#fff1d6', '#ffc97e');
  // the back wall: a framed picture, the pendant lamp over the table
  ctx.strokeStyle = 'rgba(80,40,20,.55)'; ctx.lineWidth = 2; ctx.strokeRect(wn.x + 22, wn.y + 20, 34, 26); ctx.fillStyle = 'rgba(120,70,40,.25)'; ctx.fillRect(wn.x + 25, wn.y + 23, 28, 20);
  const lx = wn.x + wn.w * .52; ctx.strokeStyle = 'rgba(60,30,16,.8)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(lx, wn.y); ctx.lineTo(lx, wn.y + 22); ctx.stroke();
  ctx.fillStyle = '#5a3420'; ctx.beginPath(); ctx.moveTo(lx - 16, wn.y + 32); ctx.lineTo(lx - 6, wn.y + 22); ctx.lineTo(lx + 6, wn.y + 22); ctx.lineTo(lx + 16, wn.y + 32); ctx.closePath(); ctx.fill();
  glowAt(ctx, lx, wn.y + 34, 60, .55 * br, '#ffd9a0', '#ffffff');
  // two seated at the table (their lower halves behind the cloth)
  const s = .4, sit = { ...POSES.sit, sh: [.7, .5], el: [1.0, 1.1] };
  figureFlat(ctx, wn.x + 38, yt + 10, s, sit, { t, seed: 11, col: SIL, rim: RIM, rimSide: 1, fast: true, shadow: false, hatch: false });
  figureFlat(ctx, wn.x + wn.w - 40, yt + 10, s * .82, sit, { t, seed: 23, col: '#43291c', rim: RIM, rimSide: -1, fast: true, shadow: false, hatch: false, flip: true });
  // the carrier: walks in from the right with the pot, leans and sets it down, stands back
  const f = st.food ?? 0;
  const cx = wn.x + wn.w * .58;
  if (f > 0) {
    const walkU = ease.out(clamp(f / .6)), setU = ease.io(clamp((f - .6) / .25)), backU = ease.io(clamp((f - .85) / .15));
    const fx = mix(wn.x + wn.w + 34, cx + 10, walkU) + 10 * backU, hip = yt + 26;
    const pose = mixPose(mixPose(POSES.hold, POSES.lean, setU * (1 - backU * .7)), POSES.stand, backU * .6);
    figureFlat(ctx, fx, hip, .44, pose, { t, seed: 31, col: '#2e1c14', rim: RIM, rimSide: -1, fast: true, shadow: false, hatch: false, flip: true });
    // the pot: in the hands at the chest, then lowered onto the cloth
    const px = mix(fx - 14, cx - 6, setU), py = mix(hip - 50, yt + 2, ease.io(clamp((f - .6) / .25)));
    pot(ctx, px, py, 26);
    if (st.steamT != null) steam(ctx, t, cx - 6, yt + 2, 26, st.steamT);
  }
  // the table: a cream cloth across the lower window, its folds
  ctx.fillStyle = '#efe2c4'; ctx.fillRect(wn.x, yt, wn.w, wn.y + wn.h - yt);
  ctx.strokeStyle = 'rgba(150,110,70,.35)'; ctx.lineWidth = 1; ctx.beginPath(); for (let x = wn.x + 12; x < wn.x + wn.w; x += 22) { ctx.moveTo(x, yt + 4); ctx.lineTo(x - 3, wn.y + wn.h); } ctx.stroke();
  ctx.fillStyle = 'rgba(255,250,236,.7)'; ctx.fillRect(wn.x, yt, wn.w, 2.5);
  // bread and a bowl already on the table (no cups)
  ctx.fillStyle = '#b8814a'; ctx.beginPath(); ctx.ellipse(wn.x + 46, yt + 1, 15, 7, 0, Math.PI, TAU); ctx.fill();
  ctx.fillStyle = '#c9d2e0'; ctx.beginPath(); ctx.ellipse(wn.x + wn.w - 52, yt + 1, 13, 6, 0, 0, Math.PI); ctx.fill();
  frameBars(ctx, wn);
}
function kitchen(ctx, t, st, br) {
  const wn = WIN2, yc = wn.y + wn.h * .7;
  room(ctx, wn, wn.x + wn.w * .35, wn.y + 20, br, '#fff4e0', '#ffd49a');
  // tiles, a shelf with plates standing
  ctx.strokeStyle = 'rgba(120,80,50,.18)'; ctx.lineWidth = 1; ctx.beginPath(); for (let y = yc - 46; y < yc; y += 11) { ctx.moveTo(wn.x, y); ctx.lineTo(wn.x + wn.w, y); } for (let x = wn.x + 6; x < wn.x + wn.w; x += 13) { ctx.moveTo(x, yc - 46); ctx.lineTo(x, yc); } ctx.stroke();
  ctx.fillStyle = '#6a4228'; ctx.fillRect(wn.x + 10, wn.y + 30, 70, 5);
  for (let i = 0; i < 4; i++) { ctx.fillStyle = i % 2 ? '#e8e0d0' : '#c8d4e0'; ctx.beginPath(); ctx.ellipse(wn.x + 20 + i * 16, wn.y + 20, 7, 10, 0, 0, TAU); ctx.fill(); }
  // the person at the sink, hands toward the tap
  const s = .62, tx = wn.x + wn.w * .42, fx = wn.x + wn.w * .68;
  figureFlat(ctx, fx, yc + 6, s, { ...POSES.hold, sh: [.95, .75], el: [.9, 1.0], head: .3, lean: .08 }, { t, seed: 47, col: '#2c1c16', rim: RIM, rimSide: -1, fast: true, shadow: false, hatch: false, flip: true });
  // the tap: a pipe from the counter, a curved spout
  ctx.strokeStyle = '#3a3a48'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(tx - 16, yc); ctx.lineTo(tx - 16, yc - 28); ctx.quadraticCurveTo(tx - 16, yc - 40, tx - 4, yc - 40); ctx.lineTo(tx + 2, yc - 34); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(tx - 17.5, yc - 6); ctx.lineTo(tx - 17.5, yc - 28); ctx.stroke();
  // the water: a clear bright thread, glints running down it, a small splash
  const wv = st.water ?? 0;
  if (wv > 0) {
    const y0 = yc - 32, y1 = mix(y0, yc + 2, ease.out(clamp(wv * 3)));
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = rgba('#dff3ff', .5 * wv); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(tx + 2, y0); ctx.lineTo(tx + 2 + .6 * Math.sin(t * 13), y1); ctx.stroke();
    ctx.strokeStyle = rgba('#ffffff', .95 * wv); ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(tx + 2, y0); ctx.lineTo(tx + 2 + .6 * Math.sin(t * 13), y1); ctx.stroke();
    for (let i = 0; i < 4; i++) { const u = ((t * 2.6 + i / 4) % 1); if (y0 + u * (y1 - y0) > y1) continue; glowAt(ctx, tx + 2, y0 + u * (y1 - y0), 6, .8 * wv, '#eef8ff', '#ffffff'); }
    if (y1 >= yc) { const r = prng(Math.floor(t * 20) + 3); ctx.fillStyle = rgba('#eef8ff', .8 * wv); for (let i = 0; i < 6; i++) ctx.fillRect(tx + 2 + (r() - .5) * 16, yc - r() * 8, 1.6, 1.6); }
    ctx.restore();
  }
  // the counter front
  ctx.fillStyle = '#4a3024'; ctx.fillRect(wn.x, yc, wn.w, wn.y + wn.h - yc); ctx.fillStyle = 'rgba(255,230,190,.5)'; ctx.fillRect(wn.x, yc, wn.w, 2);
  ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.moveTo(wn.x + wn.w * .5, yc + 4); ctx.lineTo(wn.x + wn.w * .5, wn.y + wn.h); ctx.stroke();
  frameBars(ctx, wn);
}
function bedroom(ctx, t, br) {
  const wn = WIN3;
  room(ctx, wn, wn.x + 26, wn.y + wn.h - 26, br * .85, '#ffe2b0', '#e8a060');
  ctx.fillStyle = '#5a3420'; ctx.fillRect(wn.x + 18, wn.y + wn.h - 30, 18, 14); glowAt(ctx, wn.x + 27, wn.y + wn.h - 34, 40, .5 * br, '#ffd9a0', '#ffffff');
  curtains(ctx, wn, '#6a2a2a', .85);
  frameBars(ctx, wn);
}
function childRoom(ctx, t, st, br) {
  const wn = WIN4, lamp = clamp(st.lamp ?? 0), on = lamp > 0 ? clamp(lamp * 4) : 0;
  // dark before, then the lamp: the room snaps to warm (≤ .1 s) and settles
  ctx.fillStyle = '#0f1434'; ctx.fillRect(wn.x, wn.y, wn.w, wn.h);
  if (on > 0) room(ctx, wn, wn.x + wn.w * .5, wn.y + 26, on * (1 + .25 * (1 - clamp(lamp * 2.2))), '#fff6e2', '#ffcf8a');
  const g = ctx.createLinearGradient(wn.x, wn.y, wn.x + wn.w, wn.y + wn.h); g.addColorStop(0, `rgba(120,150,220,${.12 * (1 - on)})`); g.addColorStop(1, 'rgba(120,150,220,0)'); ctx.fillStyle = g; ctx.fillRect(wn.x, wn.y, wn.w, wn.h);
  // a bookshelf, the bed, a child reading on it
  ctx.fillStyle = on > 0 ? '#5a3a26' : '#1a1e40'; ctx.fillRect(wn.x + wn.w - 34, wn.y + 22, 30, wn.h - 22);
  for (let k = 0; k < 3; k++) for (let i = 0; i < 4; i++) { ctx.fillStyle = on > 0 ? ['#8a3a2a', '#2f5a5e', '#a07a2a', '#5a2f4a'][(i + k) % 4] : '#22264a'; ctx.fillRect(wn.x + wn.w - 31 + i * 7, wn.y + 28 + k * 26, 5, 18); }
  const bedY = wn.y + wn.h - 22;
  figureFlat(ctx, wn.x + 52, bedY - 4, .34, { ...POSES.sit, sh: POSES.hold.sh, el: POSES.hold.el, head: .3 }, { t, seed: 59, col: on > 0 ? '#3a2418' : '#141836', rim: on > 0 ? RIM : null, rimSide: 1, fast: true, shadow: false, hatch: false });
  ctx.fillStyle = on > 0 ? '#e8dcc4' : '#2a2e52'; ctx.fillRect(wn.x + 64, bedY - 30, 9, 7);   // the book
  ctx.fillStyle = on > 0 ? '#8a5a40' : '#1c2044'; ctx.fillRect(wn.x, bedY, wn.w - 36, wn.y + wn.h - bedY); ctx.fillStyle = on > 0 ? '#e9ddc6' : '#2c3058'; ctx.fillRect(wn.x, bedY - 2, wn.w - 36, 7);
  // the pendant bulb
  const bx = wn.x + wn.w * .5; ctx.strokeStyle = '#2a2236'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(bx, wn.y); ctx.lineTo(bx, wn.y + 20); ctx.stroke();
  ctx.fillStyle = on > 0 ? '#fffaf0' : '#3a3e66'; ctx.beginPath(); ctx.arc(bx, wn.y + 26, 6, 0, TAU); ctx.fill();
  if (on > 0) { glowAt(ctx, bx, wn.y + 26, 90, .6 * on, '#ffd9a0', '#ffffff'); glowAt(ctx, bx, wn.y + 26, 18, on, '#fff6e2', '#ffffff'); }
  frameBars(ctx, wn);
}
function doorGlass(ctx, br) { const d = DOORG; room(ctx, d, d.x + d.w / 2, d.y + 10, br * .8, '#ffe8c0', '#ffc278'); ctx.fillStyle = '#2a3054'; ctx.fillRect(d.x + d.w / 2 - 2, d.y, 4, d.h); }

// ---------------------------------------------------------------- the picture
const FLAKES = (() => { const r = prng(321), o = []; for (let i = 0; i < 300; i++) { const z = r(); o.push({ x: r() * (W + 200) - 100, y: r() * (H + 80), z, s: z < .5 ? .9 + r() * .6 : z < .85 ? 1.6 + r() * .9 : 2.8 + r() * 2.2, vy: 18 + 50 * z + 12 * r(), ph: r() * TAU, sw: 6 + 16 * r() }); } return o; })();
const STARS = (() => { const r = prng(611), o = []; for (let i = 0; i < 260; i++) o.push([r() * W * 1.3 - W * .15, r() * 640, .5 + r() * 1.3, r() * TAU, .5 + r() * 1.5]); return o; })();
export function home(ctx, t, cam, st = {}) {
  const warm = clamp(st.warm ?? 0), lampU = clamp(st.lamp ?? 0), br = .82 + .18 * warm;
  // ---- sky: deep winter night, stars, the ring seen from the ground as a faint warm arc
  { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#060a22'); g.addColorStop(.55, '#121a44'); g.addColorStop(1, '#27305e'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  const ms = hm(cam, .06);
  for (const [x, y, s, ph, f] of STARS) { const X = ms.X(x - W / 2), Y = ms.Y(y - 700); if (X < -4 || X > W + 4 || Y < -4 || Y > H) continue; const tw = .55 + .45 * Math.sin(t * f + ph); ctx.fillStyle = `rgba(236,240,255,${.6 * tw})`; ctx.fillRect(X, Y, s, s); }
  if ((st.ringA ?? 1) > 0) { const k = ms.k; kitRing(ctx, t, { cx: ms.X(120), cy: ms.Y(1900), r: 2420 * k, w: 70 * k, a: .32 * (st.ringA ?? 1), from: Math.PI * 1.15, to: Math.PI * 1.85, line: .9, seed: 9 }); }
  // ---- far hills with a village (all lit)
  const lay = (key) => { const L = LAYER[key], m = hm(cam, L.p); ctx.drawImage(IMG[key], m.X(L.x0), m.Y(L.y0), L.w * m.k, L.h * m.k); return m; };
  lay('hills');
  lay('pines');
  // ---- the snow field in front of the house (p 1): bluish, engraved drifts, the light pools of the windows
  const m = hm(cam, 1), k = m.k;
  { const y0 = m.Y(-4); const g = ctx.createLinearGradient(0, y0, 0, H); g.addColorStop(0, '#7f8fbe'); g.addColorStop(.4, '#5e6c9e'); g.addColorStop(1, '#3a4678'); ctx.fillStyle = g; ctx.fillRect(0, y0, W, H - y0);
    ctx.strokeStyle = 'rgba(230,236,255,.14)'; ctx.lineWidth = 1; ctx.beginPath(); for (let i = 0; i < 26; i++) { const yy = 6 + i * i * 1.4; const Y = m.Y(yy); if (Y > H) break; ctx.moveTo(0, Y); for (let x = -900; x <= 900; x += 60) ctx.lineTo(m.X(x), m.Y(yy + 4 * Math.sin(x * .01 + i))); } ctx.stroke(); }
  // light pools on the snow under each lit window (the window's light falls forward and spreads)
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const pools = [[WIN1, .55 * br], [WIN2, .5 * br], [DOOR, .3 * br], [WIN4, .22 * clamp(lampU * 4)], [WIN3, .14 * br]];
  for (const [wn, a] of pools) {
    if (a <= 0) continue; const x0 = wn.x, x1 = wn.x + wn.w, sp = wn.y < -300 ? .5 : 1;
    const P = [[m.X(x0), m.Y(0)], [m.X(x1), m.Y(0)], [m.X(x1 + 60 * sp), m.Y(150 * sp)], [m.X(x0 - 60 * sp), m.Y(150 * sp)]];
    const g = ctx.createLinearGradient(0, m.Y(0), 0, m.Y(150 * sp)); g.addColorStop(0, rgba('#ffc878', .42 * a)); g.addColorStop(1, rgba('#ffc878', 0));
    ctx.fillStyle = g; ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
  // ---- the interiors, then the house body over them (window holes)
  ctx.save(); ctx.setTransform(k, 0, 0, k, m.X(0), m.Y(0));
  dining(ctx, t, st, br); kitchen(ctx, t, st, br); bedroom(ctx, t, br); childRoom(ctx, t, st, br); doorGlass(ctx, br);
  ctx.restore();
  lay('house');
  // ---- glows: windows bloom a little, the porch lamp, steady
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [wn, a] of [[WIN1, .3 * br], [WIN2, .26 * br], [WIN3, .14 * br], [WIN4, .3 * clamp(lampU * 4)]]) { if (a <= 0) continue; const [X, Y] = [m.X(wn.x + wn.w / 2), m.Y(wn.y + wn.h / 2)]; glowAt(ctx, X, Y, wn.w * 1.1 * k, a, '#ffb35c', '#fff1d6'); }
  glowAt(ctx, m.X(DOOR.x + DOOR.w + 23), m.Y(DOOR.y + 31), 70 * k, .5 * br, '#ffd08e', '#fff6e0');
  ctx.restore();
  // a warm breath from the chimney (heat shimmer, no smoke)
  { ctx.save(); ctx.strokeStyle = 'rgba(236,240,255,.18)'; ctx.lineWidth = 1.4 * k; for (let i = 0; i < 3; i++) { const u = ((t * .35 + i / 3) % 1); ctx.globalAlpha = Math.sin(Math.PI * u) * (.5 + .5 * warm); ctx.beginPath(); for (let q = 0; q <= 8; q++) { const xx = 175 + Math.sin(q * .9 + t * 2 + i) * 6, yy = -616 - u * 90 - q * 8; q ? ctx.lineTo(m.X(xx), m.Y(yy)) : ctx.moveTo(m.X(xx), m.Y(yy)); } ctx.stroke(); } ctx.restore(); }
  // ---- the foreground: a snow bank, two fence posts, footprints, YOU (from behind) looking at the house
  { const mf = hm(cam, 1.25), y0 = 40;
    ctx.beginPath(); ctx.moveTo(mf.X(-1400), H + 10); for (let x = -1400; x <= 1400; x += 40) ctx.lineTo(mf.X(x), mf.Y(y0 + 30 * Math.sin(x * .004 + .6) + 14 * Math.sin(x * .013))); ctx.lineTo(mf.X(1400), H + 10); ctx.closePath();
    const g = ctx.createLinearGradient(0, mf.Y(y0 - 30), 0, H); g.addColorStop(0, '#9aa8d4'); g.addColorStop(.25, '#6a78aa'); g.addColorStop(1, '#2e3866'); ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = 'rgba(230,238,255,.5)'; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(20,26,60,.22)'; ctx.lineWidth = 1; ctx.beginPath(); for (let x = -1500; x < 1500; x += 9) { ctx.moveTo(mf.X(x), mf.Y(y0 + 40)); ctx.lineTo(mf.X(x + 160), mf.Y(y0 + 300)); } ctx.stroke(); ctx.restore();
    for (const px of [560, 700]) { const X = mf.X(px), Y = mf.Y(y0 + 18 * Math.sin(px * .004 + .6) + 6); ctx.fillStyle = '#141a38'; ctx.fillRect(X - 6 * mf.k, Y - 120 * mf.k, 12 * mf.k, 130 * mf.k); ctx.fillStyle = '#e4eaf6'; ctx.beginPath(); ctx.ellipse(X, Y - 120 * mf.k, 9 * mf.k, 4 * mf.k, 0, Math.PI, TAU); ctx.fill(); }
    ctx.strokeStyle = 'rgba(14,18,44,.5)'; ctx.lineWidth = 2 * mf.k; ctx.beginPath(); ctx.moveTo(mf.X(560), mf.Y(y0 - 70)); ctx.lineTo(mf.X(700), mf.Y(y0 - 64)); ctx.stroke();
    // footprints from the left edge to where you stand
    ctx.fillStyle = 'rgba(30,38,80,.45)'; for (let i = 0; i < 9; i++) { const x = -1100 + i * 70, y = 120 - i * 7 + (i % 2) * 12; ctx.beginPath(); ctx.ellipse(mf.X(x), mf.Y(y), 9 * mf.k, 4 * mf.k, 0, 0, TAU); ctx.fill(); }
    const fx = mf.X(-470), fy = mf.Y(108);
    if (fx > -200 && fx < W + 200 && fy < H + 420) { ctx.save(); ctx.translate(fx, fy); ctx.scale(mf.k, mf.k); figureBack(ctx, 0, 0, 1.25, { t, seed: 5, hold: 'none', headTilt: -.05, accent: '#c8843a', light: { x: 520, y: -380, col: '#ffcf8a', a: .8 }, dress: { coat: '#2a3352' } }); ctx.restore(); }
  }
  // ---- falling snow (three depths; a gust bends it, the lights do not flicker)
  const gust = clamp(st.gust ?? 0);
  ctx.save();
  for (const f of FLAKES) {
    const sp = .6 + f.z, vx = (8 + 160 * gust) * sp, X = ((f.x + Math.sin(t * .7 + f.ph) * f.sw + t * vx - cam.x * f.z * .3) % (W + 200) + W + 200) % (W + 200) - 100, Y = ((f.y + t * f.vy * (1 + .6 * gust)) % (H + 80) + H + 80) % (H + 80) - 40;
    const a = f.z < .5 ? .45 : f.z < .85 ? .65 : .5, s = f.s * (1 + (cam.z - 1) * f.z * .5);
    ctx.fillStyle = `rgba(240,244,255,${a})`;
    if (s < 2.2) ctx.fillRect(X, Y, s, s); else { ctx.beginPath(); ctx.arc(X, Y, s * .5, 0, TAU); ctx.fill(); }
  }
  ctx.restore();
}
