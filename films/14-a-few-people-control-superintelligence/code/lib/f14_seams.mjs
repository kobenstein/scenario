// Film 14 · seam plates between the builder groups (owned by the lead; builders import, never edit).
// A plate is the EXACT picture at a group boundary, drawn in screen space (after the camera, before finish). The handing builder
// steers its last move so the frame converges to the plate and draws the plate over everything for t in [T0 - .5, T0); the
// receiving builder draws the same plate for t in [T0, T0 + .5) and grows its world out of it. Both call it with the same t, so the
// frames on both sides of the seam come from one function. Check with tools/seam.mjs; view with tools/seam_plates14.mjs.
//   B1 → B2 at T.seg('s08').start (c04 → c05): THE FILE ON THE CONSOLE SCREEN. The push into the screen ends with the warm file
//            (THE WEIGHTS) centred in a dark screen. B2: the file opens into the test sheet (Polite / Helpful / Flawless).
//   B2 → B3 at T.seg('s14').start (c06 → c07): THE ROUND LAB WINDOW. A warm round window in a dark facade, you small below.
//            B3: the launch room of 4.05 appears in the window (match), push in.
//   B3 → Lead at T.seg('s19').start (c08 → c09): THE SCALES AT DAWN. Vault door (left pan) against glass box (right pan), the beam
//            never comes to rest. Lead: both become keys on one ring.
// The vault door and the glass box here are the REFERENCE look for B1's vaultDoor() and B3's glassBox(): match them.
// NO KEYS on any plate (keys only at the four anchors).
import * as E from './f10_editorial.mjs';
import { fileShape, numberField } from './f14_kit.mjs';
const { W, H, P, rgba, mixHex, rad, lin, drift, prng } = E;

export const SEAM_HALF = .5;
export const seamWindow = (t, T0) => t >= T0 - SEAM_HALF && t < T0 + SEAM_HALF;

// the giant file as it sits on the plate (also usable by B1 / B2 to converge to it)
export const PLATE_FILE = fileShape(960, 560, 560, 760, 104);

// --- B1 → B2: the file on the console screen -------------------------------------------------------------------------------
export function plateScreen(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H);
  // the screen glass: deep indigo, a faint cool sheen top-left, the bezel as a thin blue rim just inside the frame
  ctx.fillStyle = rad(ctx, 960, 540, 1150, [[0, P.ind1], [.55, P.ind0], [1, P.night0]]); ctx.beginPath(); ctx.roundRect(46, 34, W - 92, H - 68, 26); ctx.fill();
  ctx.strokeStyle = rgba(P.blue0, .85); ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = lin(ctx, 46, 34, 900, 700, [[0, rgba(P.cream, .05)], [1, rgba(P.cream, 0)]]); ctx.fill();
  // the file: warm light, the folded corner, its numbers (the same digits as in the hook)
  const F = PLATE_FILE, y = 2 * drift(t, 1, 4);
  ctx.translate(0, y);
  ctx.save(); ctx.filter = 'blur(28px)'; ctx.fillStyle = rgba(P.halo1, .28); ctx.fill(F.path); ctx.restore();
  ctx.fillStyle = lin(ctx, 0, F.rect[1], 0, F.rect[3], [[0, mixHex(P.ind2, P.halo1, .22)], [1, mixHex(P.ind1, P.halo1, .12)]]); ctx.fill(F.path);
  ctx.fillStyle = rgba(P.halo0, .35); ctx.fill(F.fold);
  ctx.strokeStyle = rgba(P.core0, .95); ctx.lineWidth = 2.6; ctx.lineJoin = 'round'; ctx.stroke(F.path);
  numberField(ctx, t, { gather: 1, file: F, onlyFile: true, size: 20 });
  ctx.font = '600 22px Inter'; ctx.textAlign = 'center'; ctx.fillStyle = rgba(P.halo0, .9);
  ctx.fillText('THE WEIGHTS', 960, F.rect[1] - 26);
  ctx.restore();
}

// --- B2 → B3: the round lab window -----------------------------------------------------------------------------------------
export const PLATE_WINDOW = { cx: 960, cy: 470, r: 300 };
export function plateWindow(ctx, t) {
  const { cx, cy, r } = PLATE_WINDOW;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  // the facade fills the frame: indigo, darker to the edges
  ctx.fillStyle = rad(ctx, cx, cy, 1250, [[0, mixHex(P.ind2, P.blue0, .14)], [.5, P.ind1], [1, P.night0]]); ctx.fillRect(0, 0, W, H);
  // faint panel seams of the facade (horizontal), so it reads as a wall, not a sky
  ctx.strokeStyle = rgba(P.blue0, .32); ctx.lineWidth = 1.5;
  for (const yy of [130, 250, 700, 820]) { ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke(); }
  // the window: warm light inside, breathing very slightly
  const b = 1 + .025 * Math.sin(t * 1.1);
  ctx.save(); ctx.filter = 'blur(40px)'; ctx.fillStyle = rgba(P.halo1, .3 * b); ctx.beginPath(); ctx.arc(cx, cy, r + 30, 0, 6.29); ctx.fill(); ctx.restore();
  ctx.fillStyle = rad(ctx, cx, cy - 40, r * 1.05, [[0, P.core1], [.35, P.halo0], [.75, P.halo1], [1, P.shade0]]); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.29); ctx.fill();
  // muntins (a cross) and the frame ring: dark, with a thin blue rim
  ctx.strokeStyle = rgba(P.night1, .9); ctx.lineWidth = 9;
  ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke();
  ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(cx, cy, r + 8, 0, 6.29); ctx.stroke();
  ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(cx, cy, r + 20, 0, 6.29); ctx.stroke();
  // the ground strip and you, small, looking up at the window
  ctx.fillStyle = P.night1; ctx.fillRect(0, 960, W, H - 960);
  ctx.strokeStyle = rgba(P.blue0, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 960); ctx.lineTo(W, 960); ctx.stroke();
  ctx.fillStyle = rad(ctx, cx, 962, 260, [[0, rgba(P.halo1, .22)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(cx - 260, 950, 520, 30);
  E.du(ctx, cx + 4 * drift(t, 1, 7), 960, 92, { light: 1 });
  ctx.restore();
}

// --- B3 → Lead: the scales at dawn -----------------------------------------------------------------------------------------
// Built from exported parts so c09 (lead) grows out of exactly the same drawing; plateScale = all parts at their rest state.
export const PLATE_SCALE = { cx: 960, by: 420, arm: 440, hang: 170 };
export const RIDGE = (() => { const r = prng(1914), p = []; for (let x = -40; x <= W + 40; x += 60) p.push([x, 860 + 50 * Math.sin(x * .004) + 26 * (r() - .5)]); return p; })();
export const ridgeY = (x) => { for (let i = 1; i < RIDGE.length; i++) if (RIDGE[i][0] >= x) { const [x0, y0] = RIDGE[i - 1], [x1, y1] = RIDGE[i]; return y0 + (y1 - y0) * (x - x0) / (x1 - x0); } return RIDGE[RIDGE.length - 1][1]; };
export const DAWN0 = [[0, P.night0], [.45, P.ind1], [.8, mixHex(P.ind2, P.halo1, .28)], [1, mixHex(P.ind2, P.halo1, .4)]];
export function dawnSky(ctx, stops = DAWN0) { ctx.fillStyle = lin(ctx, 0, 0, 0, H, stops); ctx.fillRect(-W, -H, 3 * W, 3 * H); }
export function drawRidge(ctx, rim = .45) {
  ctx.fillStyle = P.night1; ctx.beginPath(); ctx.moveTo(-40, H + 600); RIDGE.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(W + 40, H + 600); ctx.closePath(); ctx.fill();
  ctx.fillRect(-W, H + 590, 3 * W, 2000);
  ctx.strokeStyle = rgba(P.halo1, rim); ctx.lineWidth = 2; ctx.beginPath(); RIDGE.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
}
export const beamAngle = (t) => .014 * Math.sin(t * .55) + .006 * Math.sin(t * 1.3 + 1);
// the two pan anchors (where the vault door / glass box sit) at time t
export function scalePans(t) {
  const { cx, by, arm, hang } = PLATE_SCALE, ang = beamAngle(t);
  const L = [cx - arm * Math.cos(ang), by - arm * Math.sin(ang)], R = [cx + arm * Math.cos(ang), by + arm * Math.sin(ang)];
  return { L, R, vault: [L[0], L[1] + hang - 92], glass: [R[0], R[1] + hang - 79] };
}
// beam, post, strings and pans; k = 1 whole, → 0 retracts into the pivot (post shrinks up into it too)
export function drawBeam(ctx, t, k = 1) {
  if (k <= 0) return;
  const { cx, by, hang } = PLATE_SCALE, { L, R } = scalePans(t);
  const at = (p, u) => [cx + (p[0] - cx) * u, by + (p[1] - by) * u];
  ctx.save(); ctx.strokeStyle = rgba(P.cream, .85); ctx.lineCap = 'round';
  ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, by); ctx.lineTo(cx, by + (860 - by) * k); ctx.stroke();
  const l = at(L, k), r = at(R, k);
  ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(...l); ctx.lineTo(...r); ctx.stroke();
  ctx.fillStyle = P.cream; ctx.beginPath(); ctx.arc(cx, by, 9 * Math.min(1, k * 3), 0, 6.29); ctx.fill();
  const hk = hang * Math.min(1, k * 1.15);
  for (const [x, y] of [l, r]) {
    const w = 140 * k;
    ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(P.cream, .6); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 120 * k, y + hk); ctx.moveTo(x, y); ctx.lineTo(x + 120 * k, y + hk); ctx.stroke();
    ctx.lineWidth = 4; ctx.strokeStyle = rgba(P.cream, .9); ctx.beginPath(); ctx.moveTo(x - w, y + hk); ctx.quadraticCurveTo(x, y + hk + 34 * k, x + w, y + hk); ctx.stroke();
  }
  ctx.restore();
}
// the vault door (round, dark, light only in its joints), centre (x, y), scale s
export function drawVault(ctx, x, y, s = 1, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(rot);
  ctx.fillStyle = mixHex(P.ind2, P.night1, .4); ctx.beginPath(); ctx.arc(0, 0, 84, 0, 6.29); ctx.fill();
  ctx.strokeStyle = rgba(P.halo0, .85); ctx.lineWidth = 2.2 / s;      // a constant 2.2 px at any scale
  for (const rr of [84, 58, 22]) { ctx.beginPath(); ctx.arc(0, 0, rr, 0, 6.29); ctx.stroke(); }
  for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + .2; ctx.beginPath(); ctx.moveTo(22 * Math.cos(a), 22 * Math.sin(a)); ctx.lineTo(58 * Math.cos(a), 58 * Math.sin(a)); ctx.stroke(); }
  ctx.restore();
}
// the open glass box (cool cream edges, open lid, the public file list), centre (x, y) of the box, scale s
export function drawGlass(ctx, x, y, s = 1) {
  const S = 150;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const gx0 = -S / 2, gy = -S / 2;
  ctx.fillStyle = rgba(P.cream, .07); ctx.fillRect(gx0, gy, S, S);
  ctx.strokeStyle = rgba(mixHex(P.cream, P.blue0, .25), .9); ctx.lineWidth = 2.2 / s; ctx.strokeRect(gx0, gy, S, S);
  ctx.beginPath(); ctx.moveTo(gx0, gy); ctx.lineTo(gx0 + 34, gy - 46); ctx.lineTo(gx0 + S + 34, gy - 46); ctx.lineTo(gx0 + S, gy); ctx.stroke();
  ctx.strokeStyle = rgba(P.halo0, .8); ctx.lineWidth = 3 / s;
  for (let i = 0; i < 4; i++) { const yy = gy + 30 + i * 30; ctx.beginPath(); ctx.moveTo(gx0 + 24, yy); ctx.lineTo(gx0 + 24 + [92, 70, 100, 60][i], yy); ctx.stroke(); }
  ctx.restore();
}
export function plateScale(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  dawnSky(ctx); drawRidge(ctx); drawBeam(ctx, t, 1);
  const { vault, glass } = scalePans(t);
  drawVault(ctx, vault[0], vault[1]); drawGlass(ctx, glass[0], glass[1]);
  ctx.restore();
}
