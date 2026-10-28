// Film 14 · B3 · shared objects of station 5 (the lead READS these for 9.01, only B3 edits):
//   glassBox(ctx, t, o)   the open glass box (Apertus): a cube of light edges, the public file list inside as gold lines.
//                         At { detail: 0, lid: 0 } it is EXACTLY the glass box on plateScale (lib/f14_seams.mjs), the reference.
//   vaultMark(ctx, t, o)  the round vault door as on plateScale (dark disc, light only in its joints); detail adds glow + a slit
//   eye(ctx, x, y, w, open, o)   a plain almond eye of cream light (the "eyes" on the scales, 8.09)
//   scaleRig(ctx, t, p)   the scales of light exactly as on plateScale, but every part can grow and the beam angle is free
//   plateAngle(t)         the beam angle of plateScale (never at rest)
// Everything is drawn in the CURRENT transform (no setTransform), so it can sit on a card or in screen space.
// Rules: no canvas / pattern per frame, seeded randomness only, everything driven by t and the options. No keys, no locks, ever.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import { PLATE_SCALE } from './f14_seams.mjs';
const { P, rgba, mixHex, clamp, lerp, smooth, rad } = E;

// ---------------------------------------------------------------------------------------------------------------- the glass box
// o: { x (centre of the front face), y (bottom of the front face), s (side, plate: 150), lid 0..1 (0 = closed: the plate look,
//      1 = the lid stands open on its back edge), detail 0..1 (back face, side edges, glow, list labels), a, glow 0..1,
//      lines 0..1 (how far the inner gold lines are drawn), lineA [a0..a3] (alpha share per line, e.g. 0 while a row is out),
//      spot 0..1 (the sleeper: a cool notch on line 2), found 0..1 (a warm ring round it), edge (stroke colour override) }
// returns { x0, y0 (top-left of the front face), s, D: [dx, dy] (depth offset to the back face), lines: [[x, y, w] ×4], top: [x, y]
//           (centre of the open top), spot: [x, y] }
export const BOX_LINES = [92, 70, 100, 60];
export function glassBox(ctx, t, o = {}) {
  const s = o.s ?? 150, k = s / 150, gx0 = (o.x ?? 960) - s / 2, gy1 = o.y ?? 586, gy = gy1 - s, a = o.a ?? 1;
  const det = clamp(o.detail ?? 0), lid = clamp(o.lid ?? 0), dx = 34 * k, dy = -46 * k;
  const lw = 2.2 * Math.sqrt(k), edge = o.edge ?? rgba(mixHex(P.cream, P.blue0, .25), .9);
  ctx.save(); ctx.globalAlpha = a; ctx.lineCap = 'butt';   // as the plate (default caps)
  // detail: the back face and the side edges (a real cube of glass), a cool glow round the edges, a warm glow from the list
  if (det > 0) {
    const g = o.glow ?? 1;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = rad(ctx, gx0 + s / 2 + dx / 2, gy + s / 2 + dy / 2, s * 1.3, [[0, rgba(P.halo1, .16 * det * g)], [.5, rgba(P.blue0, .14 * det * g)], [1, rgba(P.blue0, 0)]]);
    ctx.fillRect(gx0 - s, gy - s * 1.2, s * 3.2, s * 3.2); ctx.restore();
    ctx.fillStyle = rgba(P.cream, .035 * det);   // the right side face and the top (glass seen through)
    ctx.beginPath(); ctx.moveTo(gx0 + s, gy); ctx.lineTo(gx0 + s + dx, gy + dy); ctx.lineTo(gx0 + s + dx, gy1 + dy); ctx.lineTo(gx0 + s, gy1); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(mixHex(P.cream, P.blue0, .4), .42 * det); ctx.lineWidth = lw * .8;
    ctx.beginPath();
    ctx.moveTo(gx0 + dx, gy + dy); ctx.lineTo(gx0 + dx, gy1 + dy); ctx.lineTo(gx0 + s + dx, gy1 + dy); ctx.lineTo(gx0 + s + dx, gy + dy);   // back face (3 edges; the top one is the hinge)
    ctx.moveTo(gx0, gy1); ctx.lineTo(gx0 + dx, gy1 + dy); ctx.moveTo(gx0 + s, gy1); ctx.lineTo(gx0 + s + dx, gy1 + dy);                       // floor edges
    ctx.stroke();
    if (lid > 0) { ctx.beginPath(); ctx.moveTo(gx0 + dx, gy + dy); ctx.lineTo(gx0, gy); ctx.moveTo(gx0 + s + dx, gy + dy); ctx.lineTo(gx0 + s, gy); ctx.stroke(); }   // the top edges stay when the lid opens
    // the edges glow (light lines, not wire)
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = `blur(${4 * k}px)`; ctx.strokeStyle = rgba(P.blue0, .8 * det * (o.glow ?? 1)); ctx.lineWidth = lw * 3;
    ctx.strokeRect(gx0, gy, s, s); ctx.restore();
  }
  // 1 · the front face (exactly the plate)
  ctx.fillStyle = rgba(P.cream, .07); ctx.fillRect(gx0, gy, s, s);
  ctx.strokeStyle = edge; ctx.lineWidth = lw; ctx.strokeRect(gx0, gy, s, s);
  // 2 · the lid: closed = the plate's top outline; open = hinged on the back edge, the free edge swings up and back
  if (lid <= 0) { ctx.beginPath(); ctx.moveTo(gx0, gy); ctx.lineTo(gx0 + dx, gy + dy); ctx.lineTo(gx0 + s + dx, gy + dy); ctx.lineTo(gx0 + s, gy); ctx.stroke(); }
  else {
    const th = smooth(lid) * 1.78, vx = -dx * Math.cos(th), vy = -dy * Math.cos(th) - s * Math.sin(th);
    const B0 = [gx0 + dx, gy + dy], B1 = [gx0 + s + dx, gy + dy], F0 = [B0[0] + vx, B0[1] + vy], F1 = [B1[0] + vx, B1[1] + vy];
    ctx.fillStyle = rgba(P.cream, .05 + .03 * det); ctx.beginPath(); ctx.moveTo(...B0); ctx.lineTo(...F0); ctx.lineTo(...F1); ctx.lineTo(...B1); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(...B0); ctx.lineTo(...F0); ctx.moveTo(...F1); ctx.lineTo(...B1); ctx.moveTo(...B0); ctx.lineTo(...B1); ctx.stroke();
    ctx.save(); ctx.globalAlpha = a * clamp(lid * 6); ctx.beginPath(); ctx.moveTo(...F0); ctx.lineTo(...F1); ctx.stroke(); ctx.restore();
  }
  // 3 · the public file list inside: four gold lines (exactly the plate at lines = 1)
  const lu = clamp(o.lines ?? 1), la = o.lineA || [1, 1, 1, 1], lines = [];
  ctx.strokeStyle = rgba(P.halo0, .8); ctx.lineWidth = 3 * Math.sqrt(k);
  for (let i = 0; i < 4; i++) {
    const yy = gy + 30 * k + i * 30 * k, w = BOX_LINES[i] * k; lines.push([gx0 + 24 * k, yy, w]);
    if (lu <= 0 || la[i] <= 0) continue;
    ctx.save(); ctx.globalAlpha = a * clamp(la[i]); ctx.beginPath(); ctx.moveTo(gx0 + 24 * k, yy); ctx.lineTo(gx0 + 24 * k + w * lu, yy); ctx.stroke(); ctx.restore();
  }
  // the sleeper: a short cool notch at the end of line 2 (planted, hard to see); found = a warm ring round it
  const sp = [gx0 + 24 * k + BOX_LINES[2] * k + 10 * k, gy + 30 * k + 2 * 30 * k];
  if ((o.spot ?? 0) > 0) { ctx.save(); ctx.globalAlpha = a * clamp(o.spot); ctx.strokeStyle = mixHex(P.blue1, P.cream, .25); ctx.lineWidth = 3 * Math.sqrt(k); ctx.beginPath(); ctx.moveTo(sp[0], sp[1]); ctx.lineTo(sp[0] + 12 * k, sp[1]); ctx.stroke(); ctx.restore(); }
  if ((o.found ?? 0) > 0) { const f = clamp(o.found); E.halo(ctx, sp[0] + 6 * k, sp[1], 34 * k, .5 * f * a, P.halo1, P.halo0); ctx.save(); ctx.globalAlpha = a * f; ctx.strokeStyle = P.core1; ctx.lineWidth = 2 * Math.sqrt(k); ctx.beginPath(); ctx.arc(sp[0] + 6 * k, sp[1], 13 * k, 0, 6.29); ctx.stroke(); ctx.restore(); }
  ctx.restore();
  return { x0: gx0, y0: gy, s, D: [dx, dy], lines, top: [gx0 + s / 2 + dx / 2, gy + dy / 2], spot: sp };
}

// ---------------------------------------------------------------------------------------------------------------- the vault door
// o: { x, y, r (plate: 84), detail 0..1 (frame ring, shading, glowing joints), crack 0..1 (a slit of warm light on the right), a }
export function vaultMark(ctx, t, o = {}) {
  const x = o.x ?? 520, y = o.y ?? 498, r = o.r ?? 84, k = r / 84, det = clamp(o.detail ?? 0), a = o.a ?? 1;
  ctx.save(); ctx.globalAlpha = a;
  if (det > 0) {   // the frame ring in its wall, a cool rim, a shaded face
    ctx.fillStyle = rgba(mixHex(P.night1, P.ind2, .5), det); ctx.beginPath(); ctx.arc(x, y, r * 1.14, 0, 6.29); ctx.fill();
    ctx.strokeStyle = rgba(P.blue0, .85 * det); ctx.lineWidth = 2 * Math.sqrt(k); ctx.beginPath(); ctx.arc(x, y, r * 1.14, 0, 6.29); ctx.stroke();
    ctx.fillStyle = rgba(P.blue1, .7 * det);
    for (let i = 0; i < 14; i++) { const q = i / 14 * 6.283 + .1; ctx.beginPath(); ctx.arc(x + Math.cos(q) * r * 1.07, y + Math.sin(q) * r * 1.07, 1.2 * Math.sqrt(k), 0, 6.29); ctx.fill(); }
  }
  ctx.fillStyle = mixHex(P.ind2, P.night1, .4); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill();
  if (det > 0) { ctx.fillStyle = rad(ctx, x - r * .35, y - r * .45, r * 1.6, [[0, rgba(mixHex(P.ind2, P.blue1, .3), .9 * det)], [.5, rgba(P.ind2, .3 * det)], [1, rgba(P.night0, .5 * det)]]); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill(); }
  const jp = new Path2D();
  for (const rr of [84, 58, 22]) { jp.moveTo(x + rr * k, y); jp.arc(x, y, rr * k, 0, 6.29); }
  for (let i = 0; i < 6; i++) { const q = i * Math.PI / 3 + .2; jp.moveTo(x + 22 * k * Math.cos(q), y + 22 * k * Math.sin(q)); jp.lineTo(x + 58 * k * Math.cos(q), y + 58 * k * Math.sin(q)); }
  if (det > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = `blur(${5 * k}px)`; ctx.strokeStyle = rgba(P.halo1, .55 * det * (.92 + .08 * Math.sin(t * .9))); ctx.lineWidth = 5 * Math.sqrt(k); ctx.stroke(jp); ctx.restore(); }
  // the joints exactly as the plate draws them (each ring and spoke its own stroke, default butt caps)
  ctx.strokeStyle = rgba(P.halo0, .85); ctx.lineWidth = 2.2 * Math.sqrt(k); ctx.lineCap = 'butt';
  for (const rr of [84, 58, 22]) { ctx.beginPath(); ctx.arc(x, y, rr * k, 0, 6.29); ctx.stroke(); }
  for (let i = 0; i < 6; i++) { const q = i * Math.PI / 3 + .2; ctx.beginPath(); ctx.moveTo(x + 22 * k * Math.cos(q), y + 22 * k * Math.sin(q)); ctx.lineTo(x + 58 * k * Math.cos(q), y + 58 * k * Math.sin(q)); ctx.stroke(); }
  const cr = clamp(o.crack ?? 0);
  if (cr > 0) {   // the slit: a thin crescent of warm light at the right edge (the vault is shut, light only leaks)
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = rgba(P.core1, .9 * cr); ctx.lineWidth = 3 * Math.sqrt(k); ctx.beginPath(); ctx.arc(x, y, r * 1.015, -.75, .75); ctx.stroke();
    ctx.filter = `blur(${10 * k}px)`; ctx.strokeStyle = rgba(P.halo1, .6 * cr); ctx.lineWidth = 12 * Math.sqrt(k); ctx.stroke(); ctx.restore();
  }
  ctx.restore();
  return { x, y, r };
}

// ---------------------------------------------------------------------------------------------------------------- an eye
// almond of cream light, w wide; open 0..1 (the lids part from the middle line); o: { cool 0..1 (a cooler, narrower eye), a, look [dx,dy] }
export function eye(ctx, x, y, w, open, o = {}) {
  const op = clamp(open); if (op <= 0) return;
  const h = w * .32 * op * (1 - .45 * (o.cool ?? 0)), a = o.a ?? 1, col = mixHex(P.cream, mixHex(P.blue1, P.cream, .5), o.cool ?? 0);
  ctx.save(); ctx.globalAlpha = a; ctx.lineWidth = Math.max(1.2, w * .07); ctx.strokeStyle = col; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.quadraticCurveTo(x, y - h * 2, x + w / 2, y); ctx.quadraticCurveTo(x, y + h * 2, x - w / 2, y); ctx.closePath();
  ctx.fillStyle = rgba(P.night0, .55); ctx.fill(); ctx.stroke();
  if (op > .35) { const [lx, ly] = o.look || [0, 0]; ctx.save(); ctx.clip(); ctx.fillStyle = (o.cool ?? 0) > .5 ? mixHex(P.blue1, P.cream, .3) : P.core1; ctx.beginPath(); ctx.arc(x + lx * w * .15, y + ly * w * .08, w * .14, 0, 6.29); ctx.fill(); ctx.restore(); }
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- the scales
export const plateAngle = (t) => .014 * Math.sin(t * .55) + .006 * Math.sin(t * 1.3 + 1);
// p: { ang (beam angle, default plateAngle(t)), post 0..1 (grows up from the ridge), beam 0..1 (grows out from the pivot),
//      pans [l, r] 0..1 (strings drop, pan draws) } · returns { L, R (beam ends), panL, panR (pan bottoms), vault: [x, y] (where the
//      plate puts the vault centre), box: [x, y] (front-face centre x, bottom y of the plate's glass box) }
export function scaleRig(ctx, t, p = {}) {
  const { cx, by, arm, hang } = PLATE_SCALE;
  const ang = p.ang ?? plateAngle(t), post = clamp(p.post ?? 1), beam = clamp(p.beam ?? 1), pans = p.pans || [1, 1];
  const L = [cx - arm * Math.cos(ang), by - arm * Math.sin(ang)], R = [cx + arm * Math.cos(ang), by + arm * Math.sin(ang)];
  ctx.save(); ctx.strokeStyle = rgba(P.cream, .85); ctx.lineCap = 'round';
  if (post > 0) { ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, lerp(860, by, 1 - (1 - post))); ctx.lineTo(cx, 860); ctx.stroke(); }
  if (beam > 0) {
    ctx.lineWidth = 5;
    if (beam >= 1) { ctx.beginPath(); ctx.moveTo(...L); ctx.lineTo(...R); ctx.stroke(); }
    else { ctx.beginPath(); ctx.moveTo(lerp(cx, L[0], beam), lerp(by, L[1], beam)); ctx.lineTo(lerp(cx, R[0], beam), lerp(by, R[1], beam)); ctx.stroke(); }
    ctx.fillStyle = P.cream; ctx.beginPath(); ctx.arc(cx, by, 9, 0, 6.29); ctx.fill();
  }
  [L, R].forEach(([x, y], i) => {
    const u = clamp(pans[i]); if (u <= 0) return;
    const h = hang * u;
    ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(P.cream, .6); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 120 * u, y + h); ctx.moveTo(x, y); ctx.lineTo(x + 120 * u, y + h); ctx.stroke();
    ctx.lineWidth = 4; ctx.strokeStyle = rgba(P.cream, .9); ctx.beginPath(); ctx.moveTo(x - 140 * u, y + h); ctx.quadraticCurveTo(x, y + h + 34 * u, x + 140 * u, y + h); ctx.stroke();
  });
  ctx.restore();
  return { L, R, ang, vault: [L[0], L[1] + hang - 92], box: [R[0], R[1] + hang - 4] };
}
