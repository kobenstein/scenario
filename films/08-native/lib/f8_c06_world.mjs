// Film 8 · B2 world (chunks c06–c08): the paper day of 05a and the shared camera / plate helpers for c06, c07, c08. Owner: B2.
// Other builders may import, never edit.
//
//   camKeys(keys) → (t) → cam { x, y, k, r }   keyframed camera on a plane: keys [{ t, x, y, k, r, e }] (e = easing INTO the key:
//                     'sine' default (peak speed 1.6× the mean) | 'qio' | fn). Zoom is log-interpolated about an anchor (the target when zooming in, the source
//                     when zooming out), so the anchor's screen motion is one smooth eased move (no whip at the end of a dive).
//   toPlane(ctx, cam)                        apply the camera transform (world units → screen)
//   S(cam, X, Y) → [sx, sy]                  world point → screen;  ang(cam) → screen rotation of world "up"
//   lineGround(ctx, t, o, L)                 the c06>c07 / c08>c09 line plate, drawn by us: identical pixels to handoff4 linePlate at
//                                            L = 1400 (the line's half length); L < 1400 = the line still being drawn from the centre
//   nightOver(ctx, t, front, o)              night falls over the paper: above screen y `front` the frame IS the line-plate ground
//                                            (#0a0c22, violet glow, drifting hatch); a feather band below it (o.feather 420)
//   inkWorkshop(ctx, x, y, s, o)             the kit workshop as an unlit ink drawing on paper (world units, s 1 = 240 wide)
//   FIELD, fieldDraw(ctx, t, cam, o)         the paper landscape of identical booths (05a: building got cheap), pop-up paper:
//                                            o.pop(b) → 0..1 (booth standing up), o.fold(b) → 0..1 (folded flat again)
//   vendorDraw(ctx, t, cam, v, o)            a Kenyan stall keeper (ink silhouette, profile) with a basic phone; screen space
import { W, H, rgba, clamp, mix, sm, eio, prng, drift } from '../engine.mjs';
import { figureFlat, POSES, handPos } from './figure.mjs';
import { qio, eoutX } from './f8_kit.mjs';
import { TSHIFT } from './handoff4.mjs';
import { INK } from './f8_chart.mjs';

const TAU = Math.PI * 2;

// ---------------------------------------------------------------- camera
const EASE = { qio, sine: (x) => .5 - .5 * Math.cos(Math.PI * clamp(x)), lin: (x) => clamp(x), eio: (x) => eio(clamp(x)) };
export function camKeys(keys) {
  return (t) => {
    if (t <= keys[0].t) return { ...keys[0] };
    for (let i = 1; i < keys.length; i++) {
      const a = keys[i - 1], b = keys[i]; if (t > b.t) continue;
      const e = (typeof b.e === 'function' ? b.e : EASE[b.e || 'sine'])((t - a.t) / (b.t - a.t));
      const k = Math.exp(mix(Math.log(a.k), Math.log(b.k), e)), r = mix(a.r || 0, b.r || 0, e);
      let x, y;
      if (Math.abs(Math.log(b.k / a.k)) < .05) { x = mix(a.x, b.x, e); y = mix(a.y, b.y, e); }
      else if (b.k > a.k) { x = b.x - (b.x - a.x) * a.k * (1 - e) / k; y = b.y - (b.y - a.y) * a.k * (1 - e) / k; }
      else { x = a.x - (a.x - b.x) * b.k * e / k; y = a.y - (a.y - b.y) * b.k * e / k; }
      return { x, y, k, r };
    }
    return { ...keys[keys.length - 1] };
  };
}
export function toPlane(ctx, cam) { ctx.translate(W / 2, H / 2); if (cam.r) ctx.rotate(cam.r); ctx.scale(cam.k, cam.k); ctx.translate(-cam.x, -cam.y); }
export function S(cam, X, Y) { const dx = (X - cam.x) * cam.k, dy = (Y - cam.y) * cam.k, c = Math.cos(cam.r || 0), s = Math.sin(cam.r || 0); return [W / 2 + dx * c - dy * s, H / 2 + dx * s + dy * c]; }

// ---------------------------------------------------------------- the line plate, drawn by us (copy of handoff4 linePlate + a length)
export function lineGround(ctx, t, o = {}, L = 1400, parts = { ground: true, line: true }) {
  t += TSHIFT; const y = o.y ?? H / 2;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  if (parts.ground !== false) {
    ctx.fillStyle = '#0a0c22'; ctx.fillRect(0, 0, W, H);
    const v = ctx.createRadialGradient(W / 2, y, 0, W / 2, y, W * .7); v.addColorStop(0, 'rgba(40,36,90,.55)'); v.addColorStop(1, 'rgba(10,12,34,0)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(160,150,220,.05)'; ctx.lineWidth = 1; ctx.beginPath(); for (let k = -40; k < 80; k++) { const x = k * 34 + (t * 6) % 34; ctx.moveTo(x, 0); ctx.lineTo(x - 520, H); } ctx.stroke();
  }
  if (parts.line !== false && L > 0) lineOnly(ctx, t - TSHIFT, o, L);
  ctx.restore();
}
export function lineOnly(ctx, t, o = {}, L = 1400) {
  t += TSHIFT;
  const col = o.tone === 'amber' ? ['#ffb35c', '#fff1d6'] : o.tone === 'gold' ? ['#f3d9a0', '#fff8e6'] : o.tone === 'cool' ? ['#bfe3ff', '#eef8ff'] : ['#e9dcc0', '#fffaf0'], y = o.y ?? H / 2, a = o.ang || 0;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(W / 2, y + 2 * Math.sin(t * .9)); ctx.rotate(a); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  const br = .9 + .1 * Math.sin(t * 2.1), Lx = Math.min(L, 1400);
  for (const [w, al, c] of [[26, .05, col[0]], [10, .14, col[0]], [3.2, .55 * br, col[0]], [1.4, .95, col[1]]]) { ctx.strokeStyle = rgba(c, al); ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(-Lx, 0); ctx.lineTo(Lx, 0); ctx.stroke(); }
  ctx.strokeStyle = rgba(col[1], .35); ctx.lineWidth = 1; ctx.beginPath(); for (let x = -1400; x < 1400; x += 9) { if (x < -Lx || x + 3 > Lx) continue; const h = 2 + 1.5 * Math.sin(x * .07 + t); ctx.moveTo(x, -h); ctx.lineTo(x + 3, h); } ctx.stroke();
  ctx.restore();
}
// night falls over the paper: n(y) = 1 above `front` (screen y), 0 below front + feather; where n = 1 the frame is the line-plate ground
export function nightOver(ctx, t, front, o = {}) {
  const fe = o.feather ?? 420, y0 = o.y ?? H / 2, n = (yy) => clamp((front + fe - yy) / fe);
  if (n(0) <= 0) return; t += TSHIFT;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  const stops = 16, gb = ctx.createLinearGradient(0, 0, 0, H), gh = ctx.createLinearGradient(0, 0, 0, H);
  for (let i = 0; i <= stops; i++) { const q = i / stops, a = sm(n(q * H)); gb.addColorStop(q, `rgba(10,12,34,${a.toFixed(4)})`); gh.addColorStop(q, `rgba(160,150,220,${(.05 * a).toFixed(4)})`); }
  ctx.fillStyle = gb; ctx.fillRect(0, 0, W, H);
  // the violet glow, in strips (each strip at its own night amount)
  const v = ctx.createRadialGradient(W / 2, y0, 0, W / 2, y0, W * .7); v.addColorStop(0, 'rgba(40,36,90,.55)'); v.addColorStop(1, 'rgba(10,12,34,0)');
  const sh = 30;
  for (let ys = 0; ys < H; ys += sh) { const a = sm(n(ys + sh / 2)); if (a <= .002) continue; ctx.save(); ctx.beginPath(); ctx.rect(0, ys, W, sh); ctx.clip(); ctx.globalAlpha = a; ctx.fillStyle = v; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  ctx.strokeStyle = gh; ctx.lineWidth = 1; ctx.beginPath(); for (let k = -40; k < 80; k++) { const x = k * 34 + (t * 6) % 34; ctx.moveTo(x, 0); ctx.lineTo(x - 520, H); } ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------- ink drawings (world units)
const hatchRect = (ctx, x, y, w, h, gap, ang, lw, col) => {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath();
  const c = Math.cos(ang), s = Math.sin(ang), R = Math.hypot(w, h) / 2 + 2, cx = x + w / 2, cy = y + h / 2;
  for (let d = -R; d <= R; d += gap) { ctx.moveTo(cx - s * d - c * R, cy + c * d - s * R); ctx.lineTo(cx - s * d + c * R, cy + c * d + s * R); }
  ctx.stroke(); ctx.restore();
};
// the kit workshop's silhouette as an unlit engraving in ink (same proportions: wall 240×70, 4-tooth sawtooth roof, 11 windows, door)
export function inkWorkshop(ctx, x, y, s, o = {}) {
  const lw = (o.lw ?? 1.6) / s, ink = o.ink || INK.ink, a = o.a ?? 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = a; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // ground line and a soft shadow wash
  ctx.strokeStyle = rgba(ink, .55); ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(-200, 0); ctx.lineTo(200, 0); ctx.stroke();
  for (let i = 0; i < 26; i++) { ctx.beginPath(); ctx.moveTo(-150 + i * 12, 4); ctx.lineTo(-156 + i * 12, 10); ctx.stroke(); }
  // side wall (3/4 view) hatched dark
  ctx.fillStyle = '#e6dfcf'; ctx.beginPath(); ctx.moveTo(-120, 0); ctx.lineTo(-138, -10); ctx.lineTo(-138, -78); ctx.lineTo(-120, -70); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip(); hatchRect(ctx, -140, -80, 22, 82, 3, -1.1, lw * .8, rgba(ink, .7)); ctx.restore();
  ctx.beginPath(); ctx.moveTo(-120, 0); ctx.lineTo(-138, -10); ctx.lineTo(-138, -78); ctx.lineTo(-120, -70); ctx.closePath(); ctx.strokeStyle = ink; ctx.lineWidth = lw; ctx.stroke();
  // front wall: paper, light diagonal hatch, plinth
  ctx.fillStyle = '#ece6d8'; ctx.fillRect(-120, -70, 240, 70); hatchRect(ctx, -120, -70, 240, 70, 4.2, -.86, lw * .5, rgba(ink, .28));
  ctx.strokeStyle = ink; ctx.lineWidth = lw; ctx.strokeRect(-120, -70, 240, 70); ctx.beginPath(); ctx.moveTo(-120, -6); ctx.lineTo(120, -6); ctx.stroke();
  for (let i = 0; i < 11; i++) { const wx = -112 + i * 18.2; ctx.fillStyle = '#d9d1bf'; ctx.fillRect(wx, -54, 11.5, 32); hatchRect(ctx, wx, -54, 11.5, 32, 2.2, -.9, lw * .55, rgba(ink, .75)); ctx.strokeStyle = ink; ctx.lineWidth = lw * .9; ctx.strokeRect(wx, -54, 11.5, 32); ctx.beginPath(); ctx.moveTo(wx, -47); ctx.lineTo(wx + 11.5, -47); ctx.stroke(); }
  ctx.fillStyle = '#cfc6b2'; ctx.fillRect(92, -46, 18, 46); hatchRect(ctx, 92, -46, 18, 46, 2, -.9, lw * .6, rgba(ink, .85)); ctx.strokeStyle = ink; ctx.strokeRect(92, -46, 18, 46);
  // roof
  ctx.beginPath(); ctx.moveTo(-122, -70); for (let i = 0; i < 4; i++) { const x0 = -122 + i * 61; ctx.lineTo(x0, -104); ctx.lineTo(x0 + 61, -70); } ctx.closePath(); ctx.fillStyle = '#e4ddcc'; ctx.fill();
  ctx.save(); ctx.clip(); hatchRect(ctx, -122, -106, 244, 36, 3, -.4, lw * .55, rgba(ink, .45)); ctx.restore();
  ctx.beginPath(); ctx.moveTo(-122, -70); for (let i = 0; i < 4; i++) { const x0 = -122 + i * 61; ctx.lineTo(x0, -104); ctx.lineTo(x0 + 61, -70); } ctx.closePath(); ctx.strokeStyle = ink; ctx.lineWidth = lw; ctx.stroke();
  for (let i = 0; i < 4; i++) { const x0 = -122 + i * 61; ctx.beginPath(); ctx.moveTo(x0 + 1.5, -101); ctx.lineTo(x0 + 1.5, -72); ctx.lineTo(x0 + 7, -72); ctx.closePath(); ctx.fillStyle = '#d4cbb6'; ctx.fill(); ctx.stroke(); }
  ctx.restore();
  return { door: [x + 101 * s, y - 23 * s], roof: [x, y - 104 * s] };
}

// ---------------------------------------------------------------- the field of identical booths (pop-up paper)
// rows recede upward (fake perspective of an engraved panorama); row 0 is the front. The market street runs in front of row STREET.
export const FIELD = (() => {
  const rows = [], booths = [], r = prng(611), Y0 = 2900, STREET = 12, X0 = -1700, X1 = 3000;
  let y = Y0;
  for (let i = 0; i < 34; i++) {
    const s = Math.pow(.97, i); if (i === STREET) y -= 64 * s;   // the street: a wide gap (the road) in front of this row
    rows.push({ i, y, s });
    let x = X0 + r() * 40 * s;
    while (x < X1) { const kind = i === STREET ? 'stall' : 'booth'; booths.push({ x, y: y + (i === STREET ? 0 : (r() - .5) * 7 * s), s, row: i, kind, j: booths.length, seed: r(), h: .8 + .4 * r(), roof: r() < .7 ? 0 : 1, w: .85 + .3 * r() }); x += (i === STREET ? 58 : 44 + r() * 10) * s; }
    y -= 60 * s;
  }
  return { rows, booths, STREET, Y0, top: y, X0, X1 };
})();
// one booth in booth units (front 30 wide, 22 high, roof 10), feet at (0,0)
function boothPath(ctx, b, ph) {
  const w = 15 * (b.w || 1), h = 22 * b.h * ph, rf = 10 * ph;
  ctx.moveTo(-w, 0); ctx.lineTo(-w, -h);
  if (b.roof) { ctx.lineTo(-w - 2, -h); ctx.lineTo(0, -h - rf); ctx.lineTo(w + 2, -h); } else { ctx.lineTo(-w - 2, -h); ctx.lineTo(-w + 2, -h - rf * .8); ctx.lineTo(w + 2, -h - rf * .45); ctx.lineTo(w + 2, -h); }
  ctx.lineTo(w, -h); ctx.lineTo(w, 0); ctx.closePath();
}
export function fieldDraw(ctx, t, cam, o = {}) {
  const k = cam.k, pop = o.pop || (() => 1), fold = o.fold || (() => 0), red = o.red;
  // visible world box (rotation ignored here: c06 only rolls after the field is folded)
  const hw = W / 2 / k + 60, hh = H / 2 / k + 80, vx0 = cam.x - hw, vx1 = cam.x + hw, vy0 = cam.y - hh, vy1 = cam.y + hh;
  const byRow = new Map();
  for (const b of FIELD.booths) {
    if (b.x < vx0 - 40 * b.s || b.x > vx1 + 40 * b.s || b.y < vy0 || b.y - 40 * b.s > vy1) continue;
    const ph = clamp(pop(b)) * (1 - qio(clamp(fold(b)))); if (ph <= .001) continue;
    (byRow.get(b.row) || byRow.set(b.row, []).get(b.row)).push([b, ph]);
  }
  const rowsDesc = [...byRow.keys()].sort((a, b) => b - a);   // far rows first
  for (const ri of rowsDesc) {
    const L = byRow.get(ri), R = FIELD.rows[ri], lw = 1.15 / k;
    // the row's ground: an engraved line under each standing booth (it folds away with its booth)
    if (ri !== FIELD.STREET) { ctx.strokeStyle = rgba(INK.ink, .35); ctx.lineWidth = lw; ctx.beginPath(); for (const [b, ph] of L) { const hw = 25 * b.s * ph; ctx.moveTo(b.x - hw, b.y + 1); ctx.lineTo(b.x + hw, b.y + 1); } ctx.stroke(); }
    else { ctx.strokeStyle = rgba(INK.ink, .8); ctx.lineWidth = lw * 1.8; ctx.beginPath(); for (const [b, ph] of L) { const hw = 30 * b.s * ph; ctx.moveTo(b.x - hw, b.y + 1); ctx.lineTo(b.x + hw, b.y + 1); } ctx.stroke(); }
    const big = 30 * R.s * k;   // screen width of one booth: level of detail
    if (L[0][0].kind === 'stall' && big > 8) { for (const [b, ph] of L) stallDetail(ctx, t, b, ph, k); continue; }
    ctx.beginPath(); for (const [b, ph] of L) { ctx.save(); ctx.translate(b.x, b.y); ctx.scale(b.s, b.s); boothPath(ctx, b, ph); ctx.restore(); }
    ctx.fillStyle = '#ebe5d6'; ctx.fill(); ctx.strokeStyle = rgba(INK.ink, clamp(.22 + big / 45, 0, .68)); ctx.lineWidth = lw; ctx.stroke();   // far and small = paler (an engraving's aerial perspective; also keeps zooms calm)
    if (big > 9) {   // door openings + a shade hatch on the right third
      ctx.beginPath(); for (const [b, ph] of L) { if (ph < .4) continue; const s = b.s, h = 22 * b.h * ph; ctx.rect(b.x - 5 * s, b.y - Math.min(h, 13 * ph) * s, 9 * s, Math.min(h, 13 * ph) * s); }
      ctx.fillStyle = rgba(INK.ink, .5 * clamp((big - 9) / 30) + .25 * clamp((big - 120) / 200)); ctx.fill();
      if (big > 60) {   // close: a window beside the door, corrugated roof lines, a blank sign board
        ctx.beginPath(); for (const [b, ph] of L) { if (ph < .6) continue; const s = b.s, h = 22 * b.h * ph, ww = 15 * (b.w || 1); ctx.rect(b.x - ww * s + 3 * s, b.y - h * s + 4 * s, 6 * s, 5 * s); ctx.moveTo(b.x - 9 * s, b.y - h * s - 1.5 * s); ctx.lineTo(b.x + 9 * s, b.y - h * s - 1.5 * s); for (let q = -ww + 2; q < ww; q += 2.4) { ctx.moveTo(b.x + q * s, b.y - h * s); ctx.lineTo(b.x + (q + 1.5) * s, b.y - (h + 5 * ph) * s); } }
        ctx.strokeStyle = rgba(INK.ink, .55 * clamp((big - 60) / 50)); ctx.lineWidth = lw * .8; ctx.stroke();
      }
      if (big > 18) { ctx.beginPath(); for (const [b, ph] of L) { const s = b.s, h = 22 * b.h * ph; for (let q = 0; q < 5; q++) { const xx = b.x + (6 + q * 1.8) * s; ctx.moveTo(xx, b.y - h * s); ctx.lineTo(xx + 1.2 * s, b.y); } } ctx.strokeStyle = rgba(INK.ink, .4 * clamp((big - 18) / 25)); ctx.lineWidth = lw * .7; ctx.stroke(); }
    }
    if (red && red.row === ri) { const b = FIELD.booths[red.j], ph = clamp(pop(b)) * (1 - qio(clamp(fold(b)))) * (red.u ?? 1); if (ph > .01) redFlag(ctx, t, b, ph, k, red.blink ?? 0); }
  }
}
function redFlag(ctx, t, b, ph, k, bl) {
  const s = b.s, x = b.x + 2 * s, y0 = b.y - (22 * b.h + 10) * s * ph, y1 = y0 - 16 * s * ph;
  ctx.strokeStyle = INK.ink; ctx.lineWidth = 1.2 / k; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke();
  const wv = Math.sin(t * 6) * 1.2 * s; ctx.fillStyle = INK.red; ctx.beginPath(); ctx.moveTo(x, y1); ctx.quadraticCurveTo(x + 6 * s, y1 + 2 * s + wv, x + 11 * s, y1 + 3.5 * s); ctx.quadraticCurveTo(x + 6 * s, y1 + 5 * s - wv, x, y1 + 7 * s); ctx.closePath(); ctx.fill();
  if (bl > 0) { ctx.strokeStyle = rgba(INK.red, .9 * (1 - bl)); ctx.lineWidth = 2.4 / k; ctx.beginPath(); ctx.arc(x + 4 * s, y1 + 3 * s, (6 + 40 * eoutX(bl)) * s, 0, TAU); ctx.stroke(); }
}
// a market stall seen close (the Kenyan street, 05a/07a): counter, poles, striped awning, goods, a crate; pop-up paper (ph)
const AWN = ['#c9893f', '#5f8f6a', '#b5583a', '#3f6a8a', '#c9a45a'];
export function stallDetail(ctx, t, b, ph, k, o = {}) {
  const s = b.s, lw = 1.2 / k, r = prng(Math.floor(b.seed * 1e6));
  ctx.save(); ctx.translate(b.x, b.y); ctx.scale(s, s * ph); const L = lw / s;
  // back board (a plain wall behind the stall)
  ctx.fillStyle = '#e8e1d0'; ctx.fillRect(-26, -40, 52, 40); hatchRect(ctx, -26, -40, 52, 40, 1.4, -.86, L * .45, rgba(INK.ink, .3));
  ctx.strokeStyle = INK.ink; ctx.lineWidth = L; ctx.strokeRect(-26, -40, 52, 40);
  // poles + awning (striped, slanted toward the street), its scalloped edge
  ctx.beginPath(); ctx.moveTo(-24, 0); ctx.lineTo(-24, -34); ctx.moveTo(24, 0); ctx.lineTo(24, -34); ctx.stroke();
  const ac = AWN[Math.floor(r() * AWN.length)], sw = (o.sway ?? 0) * Math.sin(t * 1.3 + b.seed * 9) * .6;
  ctx.beginPath(); ctx.moveTo(-29, -36 + sw); ctx.lineTo(29, -36 - sw); ctx.lineTo(25, -46); ctx.lineTo(-25, -46); ctx.closePath(); ctx.fillStyle = '#efe8d8'; ctx.fill();
  ctx.save(); ctx.clip(); ctx.fillStyle = rgba(ac, .85); for (let q = -29; q < 29; q += 8) ctx.fillRect(q, -47, 4, 12); ctx.restore();
  ctx.stroke();
  ctx.beginPath(); for (let q = -29; q < 29; q += 6) { ctx.moveTo(q, -36 + sw * (q / -29)); ctx.quadraticCurveTo(q + 3, -33 + sw * (q / -29), q + 6, -36 + sw * ((q + 6) / -29)); } ctx.stroke();
  // counter with goods
  ctx.fillStyle = '#e2d9c4'; ctx.fillRect(-22, -14, 44, 14); hatchRect(ctx, -22, -14, 44, 14, 1.3, .9, L * .45, rgba(INK.ink, .45)); ctx.strokeRect(-22, -14, 44, 14);
  const goods = Math.floor(r() * 3);
  for (let q = 0; q < 7; q++) { const gx = -19 + q * 6.2 + r() * 1.5;
    if (goods === 0) { ctx.beginPath(); ctx.arc(gx, -16.5, 2.6, 0, TAU); ctx.fillStyle = q % 2 ? rgba('#c9893f', .9) : rgba('#b5583a', .85); ctx.fill(); ctx.stroke(); }
    else if (goods === 1) { ctx.fillStyle = '#ddd3bd'; ctx.fillRect(gx - 2.4, -21, 4.8, 7); ctx.strokeRect(gx - 2.4, -21, 4.8, 7); }
    else { ctx.beginPath(); ctx.ellipse(gx, -16, 2.8, 2, 0, Math.PI, TAU); ctx.fillStyle = rgba('#5f8f6a', .8); ctx.fill(); ctx.stroke(); } }
  // a crate and a basket on the ground
  ctx.fillStyle = '#ddd3bd'; ctx.fillRect(28, -8, 9, 8); ctx.strokeRect(28, -8, 9, 8); ctx.beginPath(); ctx.moveTo(28, -4); ctx.lineTo(37, -4); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(-32, -3, 5, 3.4, 0, 0, TAU); ctx.fillStyle = '#d8c9a4'; ctx.fill(); ctx.stroke();
  // ground shadow
  ctx.strokeStyle = rgba(INK.ink, .45); ctx.beginPath(); for (let q = -26; q < 26; q += 2.5) { ctx.moveTo(q, 1.5); ctx.lineTo(q - 2, 4); } ctx.stroke();
  ctx.restore();
}
// a stall keeper in profile (ink silhouette, accent colour), holding a basic phone upright (display away from the camera); screen space
export const VEND = ['#c9893f', '#5f8f6a', '#b5583a', '#3f6a8a', '#8a5a7a'];
export function vendorDraw(ctx, t, x, y, s, o = {}) {
  const seed = o.seed ?? 1, flip = !!o.flip, pose = o.pose || { ...POSES.hold, hair: ['short', 'bun', 'curly', 'long'][seed % 4], skirt: seed % 3 === 0 };
  const acc = o.accent || VEND[seed % VEND.length];
  figureFlat(ctx, x, y, s, pose, { t, seed, col: o.col || '#2c2522', accent: acc, accentPart: seed % 2 ? 'sweater' : 'scarf', fast: true, flip, shadow: o.shadow ?? true,
    prop: o.phone === false ? null : (g, fa) => { const ax = fa.hx + Math.sin(fa.ang) * 5, ay = fa.hy + Math.cos(fa.ang) * 5; g.save(); g.translate(ax + 3, ay - 6); g.rotate(-.25); g.fillStyle = '#16120f'; g.fillRect(-3.4, -8, 6.8, 13); g.fillStyle = '#3a332c'; g.fillRect(-2.6, -1, 5.2, 4); g.restore(); } });
  const hp = handPos(x, y, s, pose, 0, flip, { t, seed });
  return { phone: [hp[0] + (flip ? -3 : 3) * s, hp[1] - 10 * s], head: [x + (flip ? -2 : 2) * s, y - 82 * s] };
}
// an empty speech glyph (no text) in ink
export function bubble(ctx, x, y, s, u, col = INK.ink) {
  u = clamp(u); if (u <= 0) return; const e = eoutX(u), sc = s * (.6 + .4 * e);
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.globalAlpha = Math.min(1, u * 3);
  ctx.fillStyle = '#f6f1e4'; ctx.strokeStyle = col; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.ellipse(0, 0, 16, 11, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-6, 9); ctx.lineTo(-11, 17); ctx.lineTo(-1, 10.5); ctx.fillStyle = '#f6f1e4'; ctx.fill(); ctx.stroke();
  ctx.restore();
}
// a firefly on paper by day: a green halo laid over the paper (no additive white-out) and its engraved body; o.night 0..1 hands
// over to the kit's glowing night firefly (the light simply reads stronger as the page darkens)
import { firefly as kitFly } from './f8_kit.mjs';
export function dayFly(ctx, t, o = {}) {
  const n = clamp(o.night ?? 0), s = o.s ?? 1, x = o.x, y = o.y;
  if (n < 1) {
    const R = 26 * s * (o.glow ?? 1) * (1 + .08 * Math.sin(t * 3.1 + (o.seed ?? 0))), a = (1 - n) * (o.a ?? 1);
    ctx.save(); const g = ctx.createRadialGradient(x, y, 0, x, y, R); g.addColorStop(0, rgba('#f4fff6', .95 * a)); g.addColorStop(.25, rgba('#a8e6bd', .6 * a)); g.addColorStop(.6, rgba('#5fae86', .18 * a)); g.addColorStop(1, rgba('#5fae86', 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.fill();
    if (o.trail && o.trail.length > 1) { ctx.lineCap = 'round'; for (let k = 1; k < o.trail.length; k++) { const q = k / (o.trail.length - 1); ctx.strokeStyle = rgba('#4f9a76', .5 * q * a); ctx.lineWidth = Math.max(.6, 2.2 * s * q); ctx.beginPath(); ctx.moveTo(o.trail[k - 1][0], o.trail[k - 1][1]); ctx.lineTo(o.trail[k][0], o.trail[k][1]); ctx.stroke(); } }
    ctx.restore();
    if (s >= 1.6) kitFly(ctx, t, { x, y, s, seed: o.seed, glow: .01, a, heading: o.heading });
    else { ctx.fillStyle = rgba('#1c2a26', .9 * a); ctx.beginPath(); ctx.ellipse(x, y, 2.6 * s, 1.8 * s, -.4, 0, TAU); ctx.fill(); }
  }
  if (n > 0) kitFly(ctx, t, { x, y, s, seed: o.seed, glow: o.glow ?? 1, a: n * (o.a ?? 1), trail: o.trail, pulse: o.pulse });
  return { x, y };
}
