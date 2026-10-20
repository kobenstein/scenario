// c11 (Film 4 v2) · the rooms of the cut-away esteem street (see lib/v2_c11_street.mjs for the geometry and the camera).
// A room is a box behind the opened facade: x0..x1, y0 (ceiling) .. y1 (floor), depth 0..d1. Drawn in perspective through the
// street camera V (V.P(x, y, d) → [sx, sy, q]). Each room: plaster walls, a plank floor, a beamed ceiling, its own lamp (the hero light
// of that room), then what happens in it. Ground floors are the workshops of 11.05–11.09; upper floors carry small domestic life.
import { W, H, rgba, clamp, mix, lin, sm, prng, TAU, eoX, eiX, qio, qo, u01, putGlow, mixHex, shadeHex, hash } from './v2_c11_kit.mjs';
import { person, kid, reachArm } from './v2_c11_people.mjs';
import * as ACT from './v2_c11_acts.mjs';

export const ROOMKINDS = (i, j) => (j === 0 ? ['potter', 'dancer', 'violin', 'joiner', 'office', 'painter'][i] || 'store'
  : j === 1 ? ['drying', 'sewing', 'piano', 'models', 'flat', 'kitchen'][i] || 'flat' : 'attic');

// ---------------------------------------------------------------- helpers
export function quad(ctx, V, pts) {
  ctx.beginPath(); let first = true;
  for (const [x, y, d] of pts) { const [sx, sy] = V.P(x, y, d); if (first) { ctx.moveTo(sx, sy); first = false; } else ctx.lineTo(sx, sy); }
  ctx.closePath();
}
export const seg3 = (ctx, V, a, b) => { const p = V.P(a[0], a[1], a[2]), q = V.P(b[0], b[1], b[2]); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); };
const WALLC = { warm: ['#b0906a', '#9a7c5a', '#5a4632'], cool: ['#8e969f', '#7a828b', '#3e4650'] };

// ---------------------------------------------------------------- the room shell + light
export function drawRoom(ctx, t, V, S, R, st) {
  const A = V.P(R.x0, R.y0, 0), B = V.P(R.x1, R.y1, 0);
  if (B[0] < 0 || A[0] > W || B[1] < 0 || A[1] > H) return;
  const kind = R.kind, office = kind === 'office';
  const dis = office && st.busy && st.busy.office != null ? clamp((t - st.busy.office) / 1.25) : 0;
  if (office && dis >= 1) return;                       // gone: the passage shows
  const cols = office ? WALLC.cool : WALLC.warm, r = prng(R.seed), d1 = R.d1;
  const wallTone = shadeHex(cols[0], (r() - .5) * .12), q0 = A[2];
  ctx.save();
  if (office && dis > 0) { ACT.officeClip(ctx, t, V, R, dis); }
  // back wall, side walls, floor, ceiling
  ctx.fillStyle = wallTone; quad(ctx, V, [[R.x0, R.y0, d1], [R.x1, R.y0, d1], [R.x1, R.y1, d1], [R.x0, R.y1, d1]]); ctx.fill();
  ctx.fillStyle = shadeHex(wallTone, -.16); quad(ctx, V, [[R.x0, R.y0, 0], [R.x0, R.y0, d1], [R.x0, R.y1, d1], [R.x0, R.y1, 0]]); ctx.fill();
  ctx.fillStyle = shadeHex(wallTone, -.2); quad(ctx, V, [[R.x1, R.y0, 0], [R.x1, R.y0, d1], [R.x1, R.y1, d1], [R.x1, R.y1, 0]]); ctx.fill();
  const floorC = office ? '#4e5258' : R.j === 0 ? '#5a4030' : '#644834';
  ctx.fillStyle = floorC; quad(ctx, V, [[R.x0, R.y1, 0], [R.x1, R.y1, 0], [R.x1, R.y1, d1], [R.x0, R.y1, d1]]); ctx.fill();
  ctx.fillStyle = office ? '#5a6068' : '#3e2e28'; quad(ctx, V, [[R.x0, R.y0, 0], [R.x1, R.y0, 0], [R.x1, R.y0, d1], [R.x0, R.y0, d1]]); ctx.fill();
  // engraved hatch on the side walls (courses along the depth) and the back wall's lower half
  ctx.strokeStyle = rgba('#1a1018', .2); ctx.lineWidth = Math.max(.5, q0 * .03); ctx.beginPath();
  for (let y = R.y0 + .5; y < R.y1; y += .5) { seg3(ctx, V, [R.x0, y, 0], [R.x0, y, d1]); seg3(ctx, V, [R.x1, y, 0], [R.x1, y, d1]); }
  ctx.stroke();
  // engraving: planks converge, beams cross the ceiling, a sparse plaster hatch on the walls
  const lw = Math.max(.6, q0 * .05);
  ctx.strokeStyle = rgba('#2a1a10', office ? .25 : .38); ctx.lineWidth = lw; ctx.beginPath();
  for (let x = R.x0 + 1.1; x < R.x1; x += 1.1) seg3(ctx, V, [x, R.y1, 0], [x, R.y1, d1]);
  for (let d = 2.4; d < d1; d += 3.1 + hash(d + R.seed) * .8) seg3(ctx, V, [R.x0, R.y1, d], [R.x1, R.y1, d]);
  ctx.stroke();
  if (!office) {
    ctx.fillStyle = '#3a2a22'; for (let d = 3; d < d1 - 1; d += 4.5) quad(ctx, V, [[R.x0, R.y0, d], [R.x1, R.y0, d], [R.x1, R.y0 + .45, d + .02], [R.x0, R.y0 + .45, d + .02]]), ctx.fill();
  }
  ctx.strokeStyle = rgba(shadeHex(wallTone, -.5), .22); ctx.lineWidth = lw * .8; ctx.beginPath();
  for (let y = R.y0 + .8; y < R.y1 - .3; y += .62) { const xa = R.x0 + hash(y * 3.1 + R.seed) * (R.x1 - R.x0) * .6, xb = Math.min(R.x1, xa + 2 + hash(y + R.seed) * 9); seg3(ctx, V, [xa, y, d1 - .01], [xb, y, d1 - .01]); }
  ctx.stroke();
  // a skirting board along the back wall
  ctx.fillStyle = shadeHex(wallTone, -.35); quad(ctx, V, [[R.x0, R.y1 - .5, d1 - .02], [R.x1, R.y1 - .5, d1 - .02], [R.x1, R.y1, d1 - .02], [R.x0, R.y1, d1 - .02]]); ctx.fill();
  // what is in the room (back to front), then the lamp's light: dark corners, warm pool; then the people (lit), then the lamp itself
  const lamp = ACT.lampOf(R);
  ACT.props(ctx, t, V, S, R, st, 'back');
  // darkness away from the lamp (one radial gradient over the whole box, centred on the lamp's floor pool)
  const Lp = V.P(lamp.x, (lamp.y + R.y1) / 2, lamp.d), rad = Math.max(R.x1 - R.x0, 26) * .62 * Lp[2];
  const g = ctx.createRadialGradient(Lp[0], Lp[1], rad * .05, Lp[0], Lp[1], rad);
  g.addColorStop(0, 'rgba(20,14,26,0)'); g.addColorStop(.35, 'rgba(20,14,26,.12)'); g.addColorStop(.75, rgba('#120c1a', office ? .45 : .58)); g.addColorStop(1, rgba('#0c0814', office ? .62 : .78));
  ctx.fillStyle = g; quad(ctx, V, [[R.x0, R.y0, 0], [R.x1, R.y0, 0], [R.x1, R.y1, 0], [R.x0, R.y1, 0]]); ctx.fill();
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g2 = ctx.createRadialGradient(Lp[0], Lp[1], 0, Lp[0], Lp[1], rad * .55);
  g2.addColorStop(0, rgba(office ? '#9fc8ff' : '#ff9a4a', office ? .12 : .2)); g2.addColorStop(1, 'rgba(255,154,74,0)');
  ctx.fillStyle = g2; ctx.fill(); ctx.restore();
  ACT.people(ctx, t, V, S, R, st, lamp);
  ACT.lamp(ctx, t, V, R, lamp, office);
  ctx.restore();
  if (office && dis > 0) ACT.officeSmoke(ctx, t, V, R, dis);
}

// ---------------------------------------------------------------- the section: cut party walls and floor slabs (poché), engraved
export function drawPoche(ctx, t, V, S, st) {
  const z = V.z, ink = '#241c2c';
  const band = (x0, y0, x1, y1) => {
    const a = V.P(x0, y0, 0), b = V.P(x1, y1, 0); if (b[0] < -4 || a[0] > W + 4 || b[1] < -4 || a[1] > H + 4) return;
    ctx.fillStyle = ink; ctx.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]);
    if (z > 6) {   // section hatch inside the cut
      ctx.save(); ctx.beginPath(); ctx.rect(a[0], a[1], b[0] - a[0], b[1] - a[1]); ctx.clip();
      ctx.strokeStyle = 'rgba(150,130,170,.28)'; ctx.lineWidth = Math.max(.6, z * .02); ctx.beginPath();
      const st2 = Math.max(3, z * .35); for (let k = a[0] - (b[1] - a[1]); k < b[0]; k += st2) { ctx.moveTo(k, b[1]); ctx.lineTo(k + (b[1] - a[1]), a[1]); } ctx.stroke(); ctx.restore();
    }
  };
  band(S.x0, S.top + .3, S.x0 + .7, S.yb); band(S.x1 - .7, S.top + .3, S.x1, S.yb);
  for (const R of S.rooms) if (R.j > 0) band(S.x0, R.y1, S.x1, R.y1 + .9);
  band(S.x0, S.top, S.x1, S.top + 1.6);
}

// the passage that the office leaves behind (behind and through the ground-floor room): see acts
export function drawPassage(ctx, t, V, S, st) { ACT.passage(ctx, t, V, S, st); }
