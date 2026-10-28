// Film 10 kit, the hall (die Trainingshalle): an old brick-and-steel hall with a sawtooth roof by the river; the gable front faces the
// road. Inside: 12 stations in two rows (table, cup, trainer, learner robot), skylights, columns, the hall clock above the gate.
//   hall(ctx, t, V, L, o) draws it from outside (the inside is seen through the windows, clipped) or from inside, depending on the camera.
//   STATIONS[i] = { x, z, side, trainer:[x,z], robot:[x,z], cupP:[x,y,z] }; o.station(i) → { lift 0..1, robotLift 0..1, headset, look }
import { W, H, rgba, clamp, lin, mix, prng, PAL, mixHex, shadeHex, sprite, tod, trace, localView , heroLight } from './f10_core.mjs';
import { VAL, hgt, signpost } from './f10_valley.mjs';
import { robot, person10, cup, reachArm, RPOSE } from './f10_figs.mjs';

const HL = VAL.hall;
export const HALL = HL;
export const WINDOWS = [-10.5, -6.0, 6.0, 10.5].map((x) => ({ x0: x - 1.5, x1: x + 1.5, y0: 2.0, y1: 7.6 }));
export const STATIONS = [];
for (let r = 0; r < 6; r++) for (const side of [-1, 1]) {
  const x = side * 6.5, z = 224 + r * 8;
  STATIONS.push({ x, z, side, row: r, trainer: [x + side * 1.05, z], robot: [x - side * 1.05, z], cupP: [x + side * .18, .76, z] });
}
// a camera flying in through a front window counts as inside 35 cm before the glass: closer than that the window clip degenerates (one-frame flash)
const inWin = (c) => [-10.5, -6, 6, 10.5].some((wx) => Math.abs(c.x - wx) < 1.2) && c.y > 2.3 && c.y < 7.3;
const inside = (c) => c.z > HL.z0 + (inWin(c) ? -.35 : .02) && c.z < HL.z1 && c.x > HL.x0 && c.x < HL.x1 && c.y < HL.eave + 4;
export const hallInside = inside;

function fill(ctx, V, pts, col) { if (V.poly(ctx, pts)) { ctx.fillStyle = col; ctx.fill(); return true; } return false; }
// the front outline: brick gable with the sawtooth profile
const FRONT = (z) => { const e = HL.eave, r = HL.ridge, p = [[HL.x0, 0, z], [HL.x1, 0, z], [HL.x1, e, z]]; for (let i = HL.teeth - 1; i >= 0; i--) { const xa = HL.x0 + i * 7; p.push([xa, r, z]); if (i > 0) p.push([xa, e, z]); } return p; };

// ---------------------------------------------------------------- inside
function interior(ctx, t, V, L, o) {
  const c = V.cam, z0 = HL.z0, z1 = HL.z1, e = HL.eave, wall = '#d9ccb4', hallL = PAL.hallLight;
  const lit = (col, f) => mixHex(L.lit(col, f), hallL, .25);
  // back wall + ceiling teeth (undersides warm grey, glazing bright)
  fill(ctx, V, FRONT(z1), lit(wall, .7));
  for (let i = 0; i < HL.teeth; i++) {
    const xa = HL.x0 + i * 7, xb = xa + 7;
    fill(ctx, V, [[xa, HL.ridge, z0], [xb, e, z0], [xb, e, z1], [xa, HL.ridge, z1]], lit('#b7aa98', .55));
    fill(ctx, V, [[xa, e, z0], [xa, HL.ridge, z0], [xa, HL.ridge, z1], [xa, e, z1]], mixHex(L.sky[1], '#ffffff', .55));
    // truss chords under every tooth
    ctx.beginPath(); for (let z = z0 + 6; z < z1; z += 6) { ctx.moveTo(0, 0); V.seg(ctx, [xa, HL.ridge - .2, z], [xb, e, z]); V.seg(ctx, [xa, e - .2, z], [xb, e - .2, z]); } ctx.strokeStyle = rgba('#5d6168', .6); ctx.lineWidth = 2; ctx.stroke();
  }
  // side walls with tall windows; the left windows carry the morning sun
  for (const sx of [HL.x0, HL.x1]) {
    fill(ctx, V, [[sx, 0, z0], [sx, 0, z1], [sx, e, z1], [sx, e, z0]], lit(wall, sx < 0 ? .45 : .8));
    for (let z = z0 + 4; z < z1 - 2; z += 6) fill(ctx, V, [[sx, 2.2, z], [sx, 2.2, z + 2.6], [sx, 7.4, z + 2.6], [sx, 7.4, z]], mixHex(L.sky[1], '#fffaf0', sx < 0 ? .75 : .35));
  }
  // floor: pale concrete, sun patches from the left windows (cast towards +x)
  fill(ctx, V, [[HL.x0, 0, z0], [HL.x1, 0, z0], [HL.x1, 0, z1], [HL.x0, 0, z1]], lit('#c6bba5', .8));
  const sl = clamp(L.shadowLen, .8, 3.5) * 2.2;
  ctx.save(); ctx.globalCompositeOperation = 'source-over';
  for (let z = z0 + 4; z < z1 - 2; z += 6) fill(ctx, V, [[HL.x0, .01, z], [HL.x0 + sl * 2.6, .01, z + .8], [HL.x0 + sl * 2.6, .01, z + 3.4], [HL.x0, .01, z + 2.6]], rgba('#fff6e0', .5));
  ctx.restore();
  // things on the floor, far → near: columns and the stations
  const items = [];
  const push = (p, fn) => { const q = V.toCam(p); if (q[2] > .15) items.push({ z: q[2], fn }); };
  for (const cx of [-12.6, 12.6]) for (let z = z0 + 6; z < z1; z += 12) push([cx, 0, z], () => { ctx.beginPath(); V.seg(ctx, [cx, 0, z], [cx, e, z]); ctx.strokeStyle = lit('#6f767e', .6); const k = V.P([cx, 0, z]).k || 1; ctx.lineWidth = clamp(k * .3, 1, 60); ctx.stroke(); });
  STATIONS.forEach((S, i) => {
    const st = o.station ? o.station(i, S) : {};
    push([S.x, 0, S.z + .01], () => table(ctx, t, V, L, S, st));
    push([S.trainer[0], 0, S.trainer[1]], () => trainerAt(ctx, t, V, L, S, i, st));
    push([S.robot[0], 0, S.robot[1]], () => robotAt(ctx, t, V, L, S, i, st));
    if (st.halo) push([S.x, 1.6, S.z - .2], () => halo(ctx, t, V, S, st.halo, i));
  });
  // the hall clock (inside the front wall, above the gate) is seen only when the camera looks back; skip
  items.sort((a, b) => b.z - a.z); for (const it of items) it.fn();
  // light in the air: soft shafts from the skylights
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < HL.teeth; i++) { const xa = HL.x0 + i * 7; const p = V.P([xa + 1.5, 6, c.z + 14]); if (p.z > .5) { const g = ctx.createLinearGradient(p.x - 120, 0, p.x + 220, H); g.addColorStop(0, rgba('#ffc46e', 0)); g.addColorStop(.5, rgba('#ffc46e', .1)); g.addColorStop(1, rgba('#ffc46e', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); } }
  ctx.restore();
  // the hero light of an interior frame: the skylights over the middle of the view (a pool + a long cone down onto the floor)
  { const hp = V.P([0, 8.5, c.z + 16]); if (hp.z > .5) heroLight({ x: hp.x + 260, y: Math.max(-200, hp.y), r: 640, k: 1, cone: 1, coneLen: 1100, coneW: .7 }); }
  // tone: the hall reads as a warm, lit room, not a white void (luma ~160–175 at noon); a soft multiply over the whole interior
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = '#e4dccd'; ctx.fillRect(0, 0, W, H); ctx.restore();
}
function table(ctx, t, V, L, S, st) {
  const x0 = S.x - .65, x1 = S.x + .65, za = S.z - .38, zb = S.z + .38, y = .75, top = L.lit('#b89470', .85);
  ctx.beginPath(); for (const [x, z] of [[x0 + .05, za + .05], [x1 - .05, za + .05], [x0 + .05, zb - .05], [x1 - .05, zb - .05]]) V.seg(ctx, [x, 0, z], [x, y, z]);
  ctx.strokeStyle = L.lit('#5c4a3a', .5); ctx.lineWidth = clamp((V.P([S.x, y, S.z]).k || 1) * .05, 1, 8); ctx.stroke();
  fill(ctx, V, [[x0, y, za], [x1, y, za], [x1, y, zb], [x0, y, zb]], top);
  fill(ctx, V, [[x0, y, za], [x1, y, za], [x1, y - .05, za], [x0, y - .05, za]], shadeHex(top, -.18));
  // the cup on the table when nobody holds it
  if (!(st.lift > 0) && !(st.robotLift > 0)) { const p = V.P(S.cupP); if (p.z > .2) cup(ctx, p.x, p.y, p.k * .00095 * (st.cupScale || 1), { L }); }
  if (st.robotCup && !(st.robotLift > 0)) { const p = V.P([S.x - S.side * .25, .76, S.z + .1]); if (p.z > .2) cup(ctx, p.x, p.y, p.k * .00095 * (st.cupScale || 1), { L }); }
}
// the cup is 9.5 cm tall: cup() s = 1 ↔ 100 px, so s = k · 0.095 / 100 · 100 px … = k · 0.00095 · 100
function trainerAt(ctx, t, V, L, S, i, st) {
  const sp = sprite(V, [S.trainer[0], 0, S.trainer[1]], 1.68); if (!sp.vis) return;
  const flip = S.side > 0, s = sp.s, hipX = sp.x, hipY = sp.y - 90 * s;
  const lift = st.lift || 0;
  let pose = { sh: [.18, .05], el: [.45, .3], head: .12 };
  if (lift > 0) {
    // her hand goes to the cup and lifts it to chest height in front of her
    const cupS = V.P(S.cupP), up = V.P([S.cupP[0] - S.side * .1, S.cupP[1] + .32 * lift, S.cupP[2] - .1]);
    const tgt = [mix(cupS.x, up.x, lift), mix(cupS.y, up.y, lift) - 4 * s];
    const r = reachArm(hipX, hipY, s, { sh: [.2, .05], el: [.4, .3] }, 0, flip, { t, seed: 20 + i }, tgt, 1);
    pose = { sh: [r.sh, .05], el: [r.el, .3], head: .18 - lift * .1 };
  }
  person10(ctx, t, 'trainer', hipX, hipY, s, pose, { L, flip, seed: 20 + i, headset: st.headset || 'up' });
  if (lift > 0) { const cupS = V.P(S.cupP), up = V.P([S.cupP[0] - S.side * .1, S.cupP[1] + .32 * lift, S.cupP[2] - .1]); cup(ctx, mix(cupS.x, up.x, lift), mix(cupS.y, up.y, lift) + 6 * s, cupS.k * .00095 * (st.cupScale || 1), { L }); }
}
function robotAt(ctx, t, V, L, S, i, st) {
  const sp = sprite(V, [S.robot[0], 0, S.robot[1]], 1.7); if (!sp.vis) return;
  const flip = S.side < 0 ? true : false, s = sp.s, hipX = sp.x, hipY = sp.y - 92 * s, u = st.robotLift || 0;
  const pose = u > 0 ? { sh: [mix(.1, .75, u), -.04], el: [mix(.2, 1.15, u), .14], head: .1 } : { ...RPOSE.stand, head: .06 };
  const r = robot(ctx, hipX, hipY, s, pose, { t, seed: 40 + i, L, side: -1, flip, visor: { rec: st.rec || 0 } });
  if (u > 0 && r.wrist) { const w = r.wrist(0); const k = V.P([S.robot[0], 1, S.robot[1]]).k; cup(ctx, w[0] + (flip ? -1 : 1) * 4 * s, w[1] + 10 * s, k * .00095 * (st.cupScale || 1), { L }); }
}
// the wreath of attempt arcs over a table (hundreds of tries)
function halo(ctx, t, V, S, u, i) {
  const c = V.P([S.x, 1.25, S.z]); if (!(c.z > .3)) return;
  const r = prng(300 + i), n = Math.round(46 * u), k = c.k;
  ctx.save(); ctx.lineWidth = Math.max(.6, k * .004);
  for (let j = 0; j < n; j++) {
    const a0 = Math.PI * (1.05 + r() * .25), a1 = a0 + Math.PI * (.45 + r() * .3), rr = k * (.28 + r() * .22), cx = c.x + (r() - .5) * k * .2, cy = c.y + k * .25;
    ctx.strokeStyle = rgba(mixHex(PAL.traceWarm, PAL.traceCold, r() * .7), .18 + .2 * r()); ctx.beginPath(); ctx.arc(cx, cy, rr, a0, a1); ctx.stroke();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- outside
export const hallView = (V) => localView(V, HL.rot, HL.piv);
export const hallToWorld = (p) => VAL.hallWorld(p);
export const HALLYAW = HL.rot;
export function hall(ctx, t, VW, L, o = {}) {
  const V = hallView(VW), c = V.cam;
  if (inside(c)) { interior(ctx, t, V, L, o); return; }
  const z0 = HL.z0, z1 = HL.z1, e = HL.eave, d = V.dist([0, 5, z0]);
  const brick = (f) => L.air(L.lit(PAL.brick, f), d, 1.3);
  // side wall facing the camera
  for (const sx of [HL.x0, HL.x1]) {
    if ((sx < 0 && c.x < sx) || (sx > 0 && c.x > sx)) {
      fill(ctx, V, [[sx, 0, z0], [sx, 0, z1], [sx, e, z1], [sx, e, z0]], brick(sx < 0 ? .95 : .45));
      ctx.beginPath(); for (let z = z0 + 4; z < z1 - 2; z += 6) V.poly(ctx, [[sx, 2.2, z], [sx, 2.2, z + 2.6], [sx, 7.4, z + 2.6], [sx, 7.4, z]], false); ctx.fillStyle = L.air(mixHex('#5d6870', L.sky[1], .5), d, 1.3); ctx.fill();
    }
  }
  // roof teeth: sloped zinc faces + glazing (catches the sky)
  for (let i = 0; i < HL.teeth; i++) {
    const xa = HL.x0 + i * 7, xb = xa + 7;
    if (c.y > e || c.x > xa) fill(ctx, V, [[xa, HL.ridge, z0], [xb, e, z0], [xb, e, z1], [xa, HL.ridge, z1]], L.air(L.lit('#9aa3a8', .6 + .3 * (L.dir[0] > 0 ? 1 : 0)), d, 1.3));
    if (c.x < xa) fill(ctx, V, [[xa, e, z0], [xa, HL.ridge, z0], [xa, HL.ridge, z1], [xa, e, z1]], L.air(mixHex(L.sky[1], '#fffaf0', .5), d, 1.3));
  }
  if (c.z > z0) return;   // seen from behind the front: nothing more (not used in c01)
  // the inside through the windows (clipped), then the front wall with holes
  const wins = WINDOWS.map((w) => [[w.x0, w.y0, z0], [w.x1, w.y0, z0], [w.x1, w.y1, z0], [w.x0, w.y1, z0]]);
  const near = d < 90;
  if (near) {
    ctx.save(); ctx.beginPath(); let any = false; for (const q of wins) if (V.poly(ctx, q, false)) any = true;
    if (any) { ctx.clip(); interior(ctx, t, V, L, o); }
    ctx.restore();
  }
  // the brick front (evenodd: windows and the gate are holes) with coursing lines
  ctx.save(); ctx.beginPath(); V.poly(ctx, FRONT(z0), false); for (const q of wins) V.poly(ctx, q, false);
  ctx.fillStyle = brick(.62); ctx.fill('evenodd');
  ctx.clip('evenodd');
  const k0 = V.P([0, 4, z0]).k || 1;
  if (k0 > 6) { ctx.beginPath(); for (let y = .3; y < HL.ridge; y += .3) V.seg(ctx, [HL.x0, y, z0 - .01], [HL.x1, y, z0 - .01]); ctx.strokeStyle = rgba(shadeHex(PAL.brick, -.25), clamp((k0 - 6) / 30) * .35); ctx.lineWidth = 1; ctx.stroke(); }
  ctx.restore();
  // window glass (sky reflection, thinner as we come close), frames and muntins (2 × 3 panes)
  for (const w of WINDOWS) {
    const q = [[w.x0, w.y0, z0 - .01], [w.x1, w.y0, z0 - .01], [w.x1, w.y1, z0 - .01], [w.x0, w.y1, z0 - .01]];
    if (!near) fill(ctx, V, q, L.air(mixHex('#4e5a62', L.sky[1], .45), d, 1.3));
    else { const a = clamp((d - 6) / 60) * .55; if (a > 0 && V.poly(ctx, q)) { ctx.fillStyle = rgba(mixHex(L.sky[1], '#ffffff', .3), a); ctx.fill(); } }
    ctx.beginPath(); const xm = (w.x0 + w.x1) / 2;
    V.seg(ctx, [xm, w.y0, z0 - .02], [xm, w.y1, z0 - .02]);
    for (const y of [w.y0 + (w.y1 - w.y0) / 3, w.y0 + 2 * (w.y1 - w.y0) / 3]) V.seg(ctx, [w.x0, y, z0 - .02], [w.x1, y, z0 - .02]);
    V.poly(ctx, q, false);
    const kw = V.P([xm, 4, z0]).k || 1; ctx.strokeStyle = L.air('#3d4246', d, 1.3); ctx.lineWidth = clamp(kw * .07, .6, 40); ctx.stroke();
  }
  // the gate (closed sliding doors, steel) and the big hall clock above it, showing the time of day
  fill(ctx, V, [[-3, 0, z0 - .02], [3, 0, z0 - .02], [3, 5.2, z0 - .02], [-3, 5.2, z0 - .02]], L.air(L.lit('#6f7c84', .7), d, 1.3));
  ctx.beginPath(); V.seg(ctx, [0, 0, z0 - .03], [0, 5.2, z0 - .03]); for (let x = -2.6; x < 3; x += .6) V.seg(ctx, [x, .1, z0 - .03], [x, 5.1, z0 - .03]); ctx.strokeStyle = rgba('#3d4246', .5); ctx.lineWidth = 1; ctx.stroke();
  clock(ctx, t, V, L, [0, 6.75, z0 - .03], 1.0, d);
  signpost(ctx, t, V, L, { x: 4.6, z: z0 - 5, boards: [{ text: o.sign ?? 'CHINA', dir: Math.PI }] });
}
export function clock(ctx, t, V, L, p, r, d) {
  const c = V.P(p); if (!(c.z > .3)) return; const R = r * c.k;
  ctx.fillStyle = L.air('#f6f1e4', d, 1.3); ctx.beginPath(); ctx.arc(c.x, c.y, R, 0, 7); ctx.fill();
  ctx.strokeStyle = L.air('#2b2622', d, 1.3); ctx.lineWidth = Math.max(1, R * .08); ctx.stroke();
  const h = tod(t) % 12, m = (tod(t) % 1) * 60;
  ctx.lineCap = 'round';
  for (const [a, l, w] of [[h / 12, .52, .09], [m / 60, .78, .06]]) { const an = a * Math.PI * 2 - Math.PI / 2; ctx.lineWidth = Math.max(1, R * w); ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(c.x + Math.cos(an) * R * l, c.y + Math.sin(an) * R * l); ctx.stroke(); }
  if (R > 14) { ctx.lineWidth = Math.max(1, R * .04); for (let k = 0; k < 12; k++) { const an = k / 12 * Math.PI * 2; ctx.beginPath(); ctx.moveTo(c.x + Math.cos(an) * R * .82, c.y + Math.sin(an) * R * .82); ctx.lineTo(c.x + Math.cos(an) * R * .93, c.y + Math.sin(an) * R * .93); ctx.stroke(); } }
}
