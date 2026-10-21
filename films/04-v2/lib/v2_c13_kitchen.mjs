// c13 (Film 4 v2) · TAKE 2 · THE KITCHEN TABLE (out of the window light ~380.30 → into the river line on the map ~385.45). Owner: c13.
// The window's light is the bulb of your kitchen lamp: the camera pulls back out of it ("One person") and finds you at the table at
// night, a hand-drawn map of the valley under the lamp. "idea": your pencil rings the river by the rope-swing tree. "help": a cyan point
// (the help, the only machine colour) wakes inside the ring and draws on the map: the flow, three sample rings, the outlet upstream.
// "ten years ago": the drawings lift off the map as cards and multiply round you; your pencil touches one and the cards warm to amber,
// one after another. Then the camera dives into the river line until its ink is the whole frame (inkFill = the valley take's first frame).
//   kitchenTake(ctx, t, K)   K: cut, one, person, idea, help, scientist, had, ten, ago, agoE, piv (+ k.* timings set in anchors)
//   inkFill(ctx, t)          the river ink / the water at the pivot (shared with the valley take)
//   warmKitchen()
import { W, H, rgba, clamp, mix, prng, canvas } from '../engine.mjs';
import { pin, polyPath, mixHex, eoX, eiX, qio, smo, smr, bump, mono, projPoly, projSeg, projLine, plane3, hatchPoly, scratchLayer, TAU } from './v2_c13_kit.mjs';
import { lightFill } from './v2_c13_road.mjs';
import { figure, reachArm } from './figure.mjs';
import { scribble } from './paper.mjs';

// ---------------------------------------------------------------- the room (metres; +X right, +Y up, +Z away from the first view)
const TY = .76;                                                     // table top
const TBL = { x0: -.98, x1: .98, z0: 2.42, z1: 3.42 };
const MAP = { x0: -.16, z0: 2.52, w: 1.0, d: .72, y: TY + .0015 };
const LAMP = { x: .36, z: 2.93, rim: 1.43, top: 1.6, rr: .2, tr: .052, ceil: 2.62 };
const BULB = { x: LAMP.x, y: LAMP.rim - .008, z: LAMP.z, r: .034 };
const WZ = 4.3, LWX = -2.5, RWX = 2.15;
const KWIN = { x0: -1.62, x1: -.62, y0: 1.02, y1: 1.98 };
const HIP = { x: 1.17, y: .5, z: 2.93 };                            // your hip on the chair (you face -X, toward the map)
const CYAN = '#8fe6ff', CYANW = '#d8f7ff', AMB = '#ffb35c';
export const PIVCOL = '#4f8577';                                    // the river's ink under the lamp = the water at the pivot

// ---------------------------------------------------------------- the map (metres on the paper: u east, v north)
const mw = (u, v, dy = 0) => [MAP.x0 + u, MAP.y + dy, MAP.z0 + v];
const rv = (u) => .33 + .05 * Math.sin(u * 7.2 + .5) + .02 * Math.sin(u * 18 + 1.2);       // the river's centreline
const drv = (u) => .36 * Math.cos(u * 7.2 + .5) + .36 * Math.cos(u * 18 + 1.2);
const RW = .0125;                                                   // the river band on paper
const SW = { u: .745 }; SW.v = rv(SW.u) - .024;                     // the rope-swing tree, south bank
const PV = { u: .55 }; PV.v = rv(PV.u);                             // the dive point on the river line (clear of the hand, road, samples)
const HOUSE = [.1, .085], TOWN = [.56, .57], OUTLET = [.235, rv(.235) + RW * .5];
const riverSide = (s, u0 = 0, u1 = 1, n = 120) => { const out = []; for (let i = 0; i <= n; i++) { const u = mix(u0, u1, i / n), d = drv(u), L = Math.hypot(1, d); out.push([u - s * RW * .5 * d / L, rv(u) + s * RW * .5 / L]); } return out; };
const HILLS = [[.14, .6, .16, .09, 7, 1], [.86, .66, .2, .07, 6, 2], [.9, .12, .12, .08, 5, 3], [.42, .1, .1, .05, 4, 4]];
const TREES = (() => { const r = prng(611), a = []; for (let i = 0; i < 70; i++) { const u = .03 + r() * .94, s = r() < .5 ? -1 : 1, v = rv(u) + s * (RW * .9 + .006 + r() * .03); if (Math.abs(u - SW.u) < .03) continue; a.push([u, v, .0032 + r() * .002]); } return a; })();
const BLOCKS = (() => { const r = prng(77), a = []; for (let i = 0; i < 34; i++) { const u = .44 + r() * .3, v = .53 + r() * .12; a.push([u, v, .012 + r() * .014, .008 + r() * .01, r() * .5 - .25]); } return a; })();
const ROAD = (() => { const a = []; for (let i = 0; i <= 60; i++) { const k = i / 60; a.push([mix(HOUSE[0], TOWN[0], k) + .06 * Math.sin(k * 3.1), mix(HOUSE[1], TOWN[1], k) - .03 * Math.sin(k * 6.2)]); } return a; })();
const SAMPLES = [.62, .47, .31];
// the help's drawings, lifted off the paper (three, from where the point drew), then spreading out of each other ("ten years ago")
const CARDS = [
  { p: [.56, 1.1, 2.8], from: [SAMPLES[0], .3], par: -1, kind: 1, w: .17 }, { p: [-.02, 1.06, 2.6], from: [SAMPLES[1], .3], par: -1, kind: 0, w: .19 },
  { p: [0, 1.36, 3.0], from: [OUTLET[0], .33], par: -1, kind: 2, w: .17 }, { p: [-.3, 1.62, 3.2], par: 2, kind: 3, w: .16 },
  { p: [.3, .98, 2.5], par: 1, kind: 4, w: .15 }, { p: [1.0, 1.66, 2.75], par: 0, kind: 5, w: .15 }, { p: [-.25, 1.15, 2.9], par: 1, kind: 0, w: .17 },
  { p: [1.3, 1.35, 2.5], par: 0, kind: 1, w: .15 }, { p: [.62, 1.75, 3.15], par: 2, kind: 2, w: .16 },
].map((c, i) => ({ ...c, rot: Math.sin(i * 2.3) * .12, ph: i * 1.7 }));
// ---------------------------------------------------------------- the camera
let _K = null, PX, PY, PZ, TX, TYc, TZ;
function paths(K) {
  if (_K === K) return; _K = K;
  const k = K.k, B = [BULB.x - .042, BULB.y - .1, BULB.z - .058];
  const keys = [[K.cut, B, [BULB.x, BULB.y, BULB.z]], [k.c1, [-.5, 1.34, 1.02], [.42, .99, 2.95]], [k.c1b, [-.47, 1.36, 1.1], [.44, .97, 2.95]],
    [k.c2, [-.12, 1.63, 1.93], [.52, .8, 2.86]], [k.c2b, [-.05, 1.58, 2.0], [.53, .79, 2.86]], [k.c3, [-.5, 1.42, 1.15], [.66, 1.3, 2.88]], [k.dive, [-.46, 1.43, 1.2], [.65, 1.28, 2.88]]];
  const ch = (j, i) => mono(keys.map((kk) => [kk[0], kk[j][i]]));
  PX = ch(1, 0); PY = ch(1, 1); PZ = ch(1, 2); TX = ch(2, 0); TYc = ch(2, 1); TZ = ch(2, 2);
}
const aim = (p, q) => { const dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2]; return [Math.atan2(dx, dz), Math.atan2(dy, Math.hypot(dx, dz))]; };
export function kitchenCam(t, K) {
  paths(K);
  const tt = Math.min(t, K.k.dive), p = [PX(tt), PY(tt), PZ(tt)], [yaw, pitch] = aim(p, [TX(tt), TYc(tt), TZ(tt)]);
  const c = { x: p[0], y: p[1], z: p[2], yaw, pitch, f: 1150, zmin: .0005 };
  if (t > K.k.dive) {   // the dive into the river line: exponential approach to 4 mm above the ink, turning to look straight down, downstream up
    const u = clamp((t - K.k.dive) / (K.piv - K.k.dive)), E = qio(u), G = mw(PV.u, PV.v), Gv = [G[0] - p[0], G[1] + .004 - p[1], G[2] - p[2]];
    const d0 = Math.hypot(...Gv), dd = d0 * Math.pow(.004 / d0, E), kk = 1 - dd / d0;
    const x = p[0] + Gv[0] * kk, y = p[1] + Gv[1] * kk, z = p[2] + Gv[2] * kk, w = smo(clamp(E * 1.25));
    const yawE = Math.atan2(1, drv(PV.u));   // downstream is up in the frame, as in the valley's first frame
    return { x, y, z, yaw: mix(yaw, yawE, w), pitch: mix(pitch, -Math.PI / 2 + 1e-4, w), f: 1150, zmin: .0005 };
  }
  return c;
}

// ---------------------------------------------------------------- small drawing helpers
const id = (ctx) => ctx.setTransform(1, 0, 0, 1, 0, 0);
const fillP = (ctx, pts, fill) => { if (pts.length < 3) return; polyPath(ctx, pts); ctx.fillStyle = fill; ctx.fill(); };
const INK = 'rgba(8,6,14,.6)';
const inkP = (ctx, pts, lw = 1, col = INK) => { if (pts.length < 3) return; polyPath(ctx, pts); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.stroke(); };
const qAt = (P, X, Y, Z) => P(X, Y, Z)[3];
// a stroke along map points (u, v) in ink of width wm metres (screen width from the median scale of its points in front of the lens)
function mapLine(ctx, P, pts, wm, col, dy = .0002, zn = .002) {
  const qs = pts.map(([u, v]) => P(...mw(u, v, dy))).filter((p) => p[2] > zn).map((p) => p[3]).sort((a, b) => a - b); if (!qs.length) return;
  const q = qs[qs.length >> 1]; ctx.strokeStyle = col; ctx.lineWidth = Math.max(.6, wm * q); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); projLine(ctx, P, pts.map(([u, v]) => mw(u, v, dy)), zn); ctx.stroke();
}
const ring = (cu, cv, r, n = 40, wob = 0, seed = 0) => { const a = []; for (let i = 0; i <= n; i++) { const th = i / n * TAU; const rr = r * (1 + wob * Math.sin(th * 3 + seed) + wob * .5 * Math.sin(th * 7 + seed * 2)); a.push([cu + Math.cos(th) * rr, cv + Math.sin(th) * rr]); } return a; };

// ---------------------------------------------------------------- the room: walls, window, shelf, floor, ceiling
function room(ctx, P, t, cam, Lp) {
  const zn = .02;
  // ceiling and floor
  fillP(ctx, projPoly(P, [[LWX, LAMP.ceil, -1], [RWX, LAMP.ceil, -1], [RWX, LAMP.ceil, WZ], [LWX, LAMP.ceil, WZ]], zn), '#0d0b18');
  { const s = projPoly(P, [[LWX, 0, -1], [RWX, 0, -1], [RWX, 0, WZ], [LWX, 0, WZ]], zn); fillP(ctx, s, '#120e18');
    ctx.save(); polyPath(ctx, s); ctx.clip(); ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.lineWidth = 1.2; ctx.beginPath(); for (let x = LWX; x < RWX; x += .16) projLine(ctx, P, [[x, 0, -1], [x, 0, WZ]], zn); ctx.stroke(); ctx.restore(); }
  // back wall (warm plaster where the lamp reaches it), left and right walls in the dark
  const wall = projPoly(P, [[LWX, 0, WZ], [RWX, 0, WZ], [RWX, LAMP.ceil, WZ], [LWX, LAMP.ceil, WZ]], zn);
  if (wall.length > 2) {
    const c = P(LAMP.x, 1.25, WZ), R = 2.6 * c[3], g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], R);
    g.addColorStop(0, '#5a4038'); g.addColorStop(.35, '#3a2a34'); g.addColorStop(.75, '#1c1628'); g.addColorStop(1, '#100e1e');
    fillP(ctx, wall, g); ctx.save(); polyPath(ctx, wall); ctx.clip();
    ctx.strokeStyle = 'rgba(10,6,16,.18)'; ctx.lineWidth = 1; ctx.beginPath(); for (let x = LWX; x < RWX; x += .11) projLine(ctx, P, [[x, 0, WZ], [x, LAMP.ceil, WZ]], zn); ctx.stroke();
    ctx.strokeStyle = 'rgba(10,6,16,.35)'; ctx.lineWidth = 1.4; ctx.beginPath(); projLine(ctx, P, [[LWX, .9, WZ - .002], [RWX, .9, WZ - .002]], zn); ctx.stroke();
    ctx.restore();
  }
  for (const [x, fx] of [[LWX, 1], [RWX, -1]]) { const s = projPoly(P, [[x, 0, -1], [x, 0, WZ], [x, LAMP.ceil, WZ], [x, LAMP.ceil, -1]], zn); fillP(ctx, s, '#0f0c1a');
    if (s.length > 2 && fx < 0) {   // the right wall catches the lamp too (a falloff drawn in the wall's own plane)
      ctx.save(); polyPath(ctx, s); ctx.clip();
      if (plane3(ctx, P, [x, 1.3, LAMP.z], [0, 0, 1], [0, -1, 0])) { const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 2.3); g.addColorStop(0, '#4a3434'); g.addColorStop(.4, '#2e2230'); g.addColorStop(.8, '#171222'); g.addColorStop(1, '#0f0c1a'); ctx.fillStyle = g; ctx.fillRect(-6, -4, 12, 8); }
      id(ctx); ctx.restore(); }
    if (s.length > 2) hatchPoly(ctx, s, -.9, 5, 'rgba(0,0,0,.25)'); }
  dresser(ctx, P, t, zn);
  // the window: the valley at night, a lamp reflection on the glass, cream frame, curtains
  const win = projPoly(P, [[KWIN.x0, KWIN.y0, WZ], [KWIN.x1, KWIN.y0, WZ], [KWIN.x1, KWIN.y1, WZ], [KWIN.x0, KWIN.y1, WZ]], zn);
  if (win.length > 2) {
    const a = P(KWIN.x0, KWIN.y1, WZ), b = P(KWIN.x0, KWIN.y0, WZ), g = ctx.createLinearGradient(0, a[1], 0, b[1]);
    g.addColorStop(0, '#0a1034'); g.addColorStop(.6, '#1a2350'); g.addColorStop(1, '#2c2a58'); fillP(ctx, win, g);
    ctx.save(); polyPath(ctx, win); ctx.clip();
    const r = prng(3); for (let i = 0; i < 26; i++) { const x = mix(KWIN.x0, KWIN.x1, r()), y = mix(KWIN.y0 + .45, KWIN.y1, r()), p = P(x, y, WZ + .5), s = .6 + r() * 1.1; ctx.fillStyle = `rgba(240,236,220,${.35 + .4 * Math.sin(t * (1 + r()) + i)})`; ctx.beginPath(); ctx.arc(p[0], p[1], s, 0, TAU); ctx.fill(); }
    const hill = []; for (let i = 0; i <= 24; i++) { const x = mix(KWIN.x0 - .1, KWIN.x1 + .1, i / 24); hill.push([x, KWIN.y0 + .2 + .1 * Math.sin(i * .7 + 1) + .05 * Math.sin(i * 1.9), WZ + .5]); }
    hill.push([KWIN.x1 + .1, KWIN.y0 - .1, WZ + .5], [KWIN.x0 - .1, KWIN.y0 - .1, WZ + .5]); fillP(ctx, projPoly(P, hill, zn), '#070818');
    for (const [x, y] of [[-1.2, 1.2], [-1.05, 1.17], [-.98, 1.19], [-.82, 1.14]]) { const p = P(x, y, WZ + .5); ctx.fillStyle = 'rgba(255,190,110,.85)'; ctx.fillRect(p[0] - 1, p[1] - 1, 2, 2); }
    const rf = P(LAMP.x - 1.6, 1.42, WZ), rg = ctx.createRadialGradient(rf[0], rf[1], 0, rf[0], rf[1], 40); rg.addColorStop(0, 'rgba(255,200,130,.35)'); rg.addColorStop(1, 'rgba(255,200,130,0)'); ctx.fillStyle = rg; ctx.fillRect(rf[0] - 40, rf[1] - 40, 80, 80);
    ctx.restore();
    const fr = '#a89a84', q = qAt(P, (KWIN.x0 + KWIN.x1) / 2, 1.5, WZ);
    ctx.strokeStyle = fr; ctx.lineWidth = Math.max(1.5, .045 * q); polyPath(ctx, win); ctx.stroke();
    ctx.lineWidth = Math.max(1, .028 * q); ctx.beginPath(); projLine(ctx, P, [[(KWIN.x0 + KWIN.x1) / 2, KWIN.y0, WZ], [(KWIN.x0 + KWIN.x1) / 2, KWIN.y1, WZ]], zn); projLine(ctx, P, [[KWIN.x0, (KWIN.y0 + KWIN.y1) / 2, WZ], [KWIN.x1, (KWIN.y0 + KWIN.y1) / 2, WZ]], zn); ctx.stroke();
    fillP(ctx, projPoly(P, [[KWIN.x0 - .07, KWIN.y0 - .05, WZ - .03], [KWIN.x1 + .07, KWIN.y0 - .05, WZ - .03], [KWIN.x1 + .07, KWIN.y0 - .01, WZ - .1], [KWIN.x0 - .07, KWIN.y0 - .01, WZ - .1]], zn), '#8a7c6a');
    for (const [x0, x1, s] of [[KWIN.x0 - .2, KWIN.x0 + .08, 1], [KWIN.x1 - .08, KWIN.x1 + .2, -1]]) {
      const sway = .012 * Math.sin(t * .7 + s); const cur = projPoly(P, [[x0, KWIN.y1 + .1, WZ - .05], [x1, KWIN.y1 + .1, WZ - .05], [x1 + s * .03 + sway, KWIN.y0 - .15, WZ - .06], [x0 + sway, KWIN.y0 - .15, WZ - .06]], zn);
      fillP(ctx, cur, '#4a2c34'); if (cur.length > 2) { ctx.save(); polyPath(ctx, cur); ctx.clip(); ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1.2; ctx.beginPath(); for (let k = 1; k < 6; k++) { const x = mix(x0, x1, k / 6); projLine(ctx, P, [[x, KWIN.y1 + .1, WZ - .05], [x + sway * .8, KWIN.y0 - .15, WZ - .06]], zn); } ctx.stroke(); ctx.restore(); inkP(ctx, cur, 1); }
    }
  }
  // shelf with jars and cups, a framed picture of the swing tree
  { const y = 1.64, s = projPoly(P, [[.15, y, WZ - .2], [1.55, y, WZ - .2], [1.55, y, WZ], [.15, y, WZ]], zn); fillP(ctx, s, '#3a2a26');
    fillP(ctx, projPoly(P, [[.15, y, WZ - .2], [1.55, y, WZ - .2], [1.55, y - .03, WZ - .2], [.15, y - .03, WZ - .2]], zn), '#24181c');
    const r = prng(19); for (let i = 0; i < 7; i++) { const x = .25 + i * .19, h = .1 + r() * .08, w = .045 + r() * .02, z = WZ - .1, glass = i % 3 !== 1;
      const jar = projPoly(P, [[x - w, y, z], [x + w, y, z], [x + w, y + h, z], [x - w, y + h, z]], zn); fillP(ctx, jar, glass ? ['#6a4a2a', '#5a5a32', '#7a3a2a'][i % 3] : '#c8bca4');
      if (jar.length > 2) { ctx.save(); polyPath(ctx, jar); ctx.clip(); const p = P(x - w * .5, y + h * .8, z); ctx.fillStyle = 'rgba(255,230,190,.35)'; ctx.fillRect(p[0], p[1], 2, h * p[3] * .6); ctx.restore(); inkP(ctx, jar, 1); }
      if (glass) fillP(ctx, projPoly(P, [[x - w - .004, y + h, z], [x + w + .004, y + h, z], [x + w + .004, y + h + .022, z], [x - w - .004, y + h + .022, z]], zn), '#2a2026'); }
  }
  { const pic = projPoly(P, [[-.42, 1.2, WZ - .01], [-.08, 1.2, WZ - .01], [-.08, 1.48, WZ - .01], [-.42, 1.48, WZ - .01]], zn); fillP(ctx, pic, '#3c2a20');
    const inn = projPoly(P, [[-.39, 1.23, WZ - .012], [-.11, 1.23, WZ - .012], [-.11, 1.45, WZ - .012], [-.39, 1.45, WZ - .012]], zn); fillP(ctx, inn, '#b8a888');
    if (inn.length > 2) { ctx.save(); polyPath(ctx, inn); ctx.clip(); const q = qAt(P, -.25, 1.34, WZ);
      ctx.fillStyle = '#5c6a5a'; const wv = P(-.39, 1.29, WZ - .013); ctx.fillRect(wv[0] - 2, wv[1], .3 * q, .07 * q);
      ctx.strokeStyle = '#3a3226'; ctx.lineWidth = Math.max(1, .012 * q); ctx.beginPath(); projLine(ctx, P, [[-.34, 1.25, WZ - .013], [-.3, 1.36, WZ - .013], [-.18, 1.42, WZ - .013]], zn); ctx.stroke();
      ctx.lineWidth = Math.max(.7, .003 * q); ctx.beginPath(); projLine(ctx, P, [[-.2, 1.415, WZ - .013], [-.2, 1.33, WZ - .013]], zn); ctx.stroke();
      ctx.fillStyle = '#3e4a3a'; const cp = P(-.3, 1.4, WZ - .013); ctx.beginPath(); ctx.ellipse(cp[0], cp[1], .07 * q, .045 * q, 0, 0, TAU); ctx.fill(); ctx.restore(); }
    inkP(ctx, pic, 1.2); }
  // a cupboard against the left wall, in the dark
  { const c = projPoly(P, [[LWX + .01, 0, 3.0], [LWX + .01, 0, 4.2], [LWX + .01, .92, 4.2], [LWX + .01, .92, 3.0]], zn); fillP(ctx, c, '#17121c'); inkP(ctx, c, 1);
    const top = projPoly(P, [[LWX, .92, 3.0], [LWX + .6, .92, 3.0], [LWX + .6, .92, 4.2], [LWX, .92, 4.2]], zn); fillP(ctx, top, '#2a1e22'); inkP(ctx, top, 1); }
}

// the dresser against the right wall: drawers below, a plate rack above (plates stand on edge behind a rail, catching the lamp)
const DR = { x0: RWX - .42, x1: RWX, z0: 3.02, z1: 4.12, top: .9, rack: .26 };
function dresser(ctx, P, t, zn) {
  const { x0, x1, z0, z1, top, rack } = DR, X = x0, wood = '#3a2418', dark = '#21140e', lit = (y) => P(X, y, LAMP.z)[3];
  const quad = (pts, fill, ink = 1) => { const s = projPoly(P, pts, zn); fillP(ctx, s, fill); if (ink) inkP(ctx, s, ink); return s; };
  // the base: side, front, worktop
  quad([[x0, 0, z0], [x1, 0, z0], [x1, top, z0], [x0, top, z0]], dark);
  const fr = quad([[X, 0, z0], [X, 0, z1], [X, top, z1], [X, top, z0]], wood);
  if (fr.length > 2) { ctx.save(); polyPath(ctx, fr); ctx.clip(); if (plane3(ctx, P, [X, .6, LAMP.z], [0, 0, 1], [0, -1, 0])) { const g = ctx.createRadialGradient(-.3, -.4, 0, -.3, -.4, 1.6); g.addColorStop(0, 'rgba(255,190,130,.22)'); g.addColorStop(1, 'rgba(255,190,130,0)'); ctx.fillStyle = g; ctx.fillRect(-3, -3, 6, 6); } id(ctx); ctx.restore(); }
  for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) {   // four drawers with brass knobs
    const za = mix(z0, z1, c / 2) + .03, zb = mix(z0, z1, (c + 1) / 2) - .03, ya = top - .06 - r * .38, yb = ya - .32;
    const d = quad([[X - .004, yb, za], [X - .004, yb, zb], [X - .004, ya, zb], [X - .004, ya, za]], '#432a1c', 1.1);
    const k = P(X - .02, (ya + yb) / 2, (za + zb) / 2); ctx.fillStyle = '#b48a4a'; ctx.beginPath(); ctx.arc(k[0], k[1], Math.max(1.5, .014 * k[3]), 0, TAU); ctx.fill(); }
  quad([[x0 - .03, top, z0 - .03], [x1, top, z0 - .03], [x1, top, z1 + .03], [x0 - .03, top, z1 + .03]], '#5a3a26');
  quad([[x0 - .03, top - .035, z0 - .03], [x0 - .03, top - .035, z1 + .03], [x0 - .03, top, z1 + .03], [x0 - .03, top, z0 - .03]], '#4a2e1e');
  // the rack: back board, sides, three shelves, plates on edge, the rails
  const R0 = x1 - rack, Y1 = 1.98;
  quad([[x1 - .01, top, z0], [x1 - .01, top, z1], [x1 - .01, Y1, z1], [x1 - .01, Y1, z0]], '#2a1a14');
  for (const z of [z0, z1]) quad([[R0, top, z], [x1, top, z], [x1, Y1, z], [R0, Y1, z]], dark);
  const shelves = [top + .04, 1.26, 1.62];
  for (const [j, y] of shelves.entries()) {
    quad([[R0, y, z0], [x1, y, z0], [x1, y, z1], [R0, y, z1]], '#4a2e20', 0); quad([[R0, y - .022, z0], [R0, y - .022, z1], [R0, y, z1], [R0, y, z0]], '#5a3a26');
    const n = 5, r = j === 0 ? .1 : .085;
    for (let i = 0; i < n; i++) {   // a plate: cream enamel, blue band, the lamp's glint on the left rim
      const z = mix(z0 + .13, z1 - .13, i / (n - 1)), c = [x1 - .1, y + r + .006, z];
      if (!plane3(ctx, P, c, [0, 0, r], [.22 * r, -r * .97, 0])) { id(ctx); continue; }
      ctx.fillStyle = '#d8ccb2'; ctx.beginPath(); ctx.arc(0, 0, 1, 0, TAU); ctx.fill();
      ctx.strokeStyle = (i + j) % 2 ? '#2c4a7a' : '#7a3a2a'; ctx.lineWidth = .1; ctx.beginPath(); ctx.arc(0, 0, .8, 0, TAU); ctx.stroke();
      ctx.fillStyle = 'rgba(40,30,30,.18)'; ctx.beginPath(); ctx.arc(.05, .05, .5, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(255,236,200,.7)'; ctx.lineWidth = .07; ctx.beginPath(); ctx.arc(0, 0, .93, Math.PI * .75, Math.PI * 1.25); ctx.stroke();
      ctx.strokeStyle = 'rgba(8,6,14,.55)'; ctx.lineWidth = .04; ctx.beginPath(); ctx.arc(0, 0, 1, 0, TAU); ctx.stroke();
      id(ctx); }
    const ry = y + .07; ctx.strokeStyle = '#6a4630'; ctx.lineWidth = Math.max(1.2, .014 * lit(ry)); ctx.beginPath(); projLine(ctx, P, [[R0 + .01, ry, z0], [R0 + .01, ry, z1]], zn); ctx.stroke();
  }
  quad([[R0 - .02, Y1, z0 - .02], [x1, Y1, z0 - .02], [x1, Y1, z1 + .02], [R0 - .02, Y1, z1 + .02]], '#4a2e20');
  quad([[R0 - .02, Y1 - .04, z0 - .02], [R0 - .02, Y1 - .04, z1 + .02], [R0 - .02, Y1, z1 + .02], [R0 - .02, Y1, z0 - .02]], '#5a3a26');
  // a jug on the worktop
  { const c = [x0 + .14, top, z1 - .2], b = P(...c), h = .2, tp = P(c[0], top + h, c[2]), w = .055 * b[3];
    ctx.fillStyle = '#c8c0ac'; ctx.beginPath(); ctx.moveTo(b[0] - w, b[1]); ctx.quadraticCurveTo(b[0] - w * 1.35, (b[1] + tp[1]) / 2, tp[0] - w * .7, tp[1]); ctx.lineTo(tp[0] + w * .8, tp[1] - w * .15); ctx.quadraticCurveTo(b[0] + w * 1.35, (b[1] + tp[1]) / 2, b[0] + w, b[1]); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.stroke(); ctx.strokeStyle = '#2c4a7a'; ctx.lineWidth = Math.max(1, .008 * b[3]); ctx.beginPath(); ctx.moveTo(b[0] - w * 1.25, (b[1] * 2 + tp[1]) / 3); ctx.lineTo(b[0] + w * 1.25, (b[1] * 2 + tp[1]) / 3); ctx.stroke(); }
}

// ---------------------------------------------------------------- the table, chair, props
function table(ctx, P, t, cam) {
  const zn = .02, q = qAt(P, 0, TY, 2.9);
  // legs (behind the top) and the apron
  for (const [x, z] of [[TBL.x0 + .06, TBL.z1 - .06], [TBL.x1 - .06, TBL.z1 - .06], [TBL.x0 + .06, TBL.z0 + .06], [TBL.x1 - .06, TBL.z0 + .06]]) {
    const s = projPoly(P, [[x - .03, 0, z - .03], [x + .03, 0, z - .03], [x + .03, TY - .05, z - .03], [x - .03, TY - .05, z - .03]], zn); fillP(ctx, s, '#24160f'); inkP(ctx, s, 1); }
  const ap = projPoly(P, [[TBL.x0 + .03, TY - .12, TBL.z0 + .03], [TBL.x1 - .03, TY - .12, TBL.z0 + .03], [TBL.x1 - .03, TY - .045, TBL.z0 + .03], [TBL.x0 + .03, TY - .045, TBL.z0 + .03]], zn); fillP(ctx, ap, '#2a1a12');
  // the top: its front edge, then the surface (oiled pine, grain, the lamp's pool)
  const edge = projPoly(P, [[TBL.x0, TY - .045, TBL.z0], [TBL.x1, TY - .045, TBL.z0], [TBL.x1, TY, TBL.z0], [TBL.x0, TY, TBL.z0]], zn); fillP(ctx, edge, '#4a2c1a'); inkP(ctx, edge, 1);
  if (cam.x > TBL.x1) { const se = projPoly(P, [[TBL.x1, TY - .045, TBL.z0], [TBL.x1, TY - .045, TBL.z1], [TBL.x1, TY, TBL.z1], [TBL.x1, TY, TBL.z0]], zn); fillP(ctx, se, '#3a2214'); }
  const top = projPoly(P, [[TBL.x0, TY, TBL.z0], [TBL.x1, TY, TBL.z0], [TBL.x1, TY, TBL.z1], [TBL.x0, TY, TBL.z1]], zn);
  if (top.length < 3) return top;
  fillP(ctx, top, '#5e3a22');
  ctx.save(); polyPath(ctx, top); ctx.clip();
  ctx.strokeStyle = 'rgba(30,14,6,.35)'; ctx.lineWidth = Math.max(.7, .0015 * q); ctx.beginPath();
  for (let k = 0; k < 26; k++) { const z = mix(TBL.z0, TBL.z1, (k + .5) / 26), pts = []; for (let i = 0; i <= 30; i++) { const x = mix(TBL.x0, TBL.x1, i / 30); pts.push([x, TY, z + .004 * Math.sin(x * 9 + k * 2.1) + .002 * Math.sin(x * 31 + k)]); } projLine(ctx, P, pts, zn); }
  ctx.stroke();
  ctx.strokeStyle = 'rgba(20,8,4,.55)'; ctx.lineWidth = Math.max(1, .003 * q); ctx.beginPath(); for (const z of [2.75, 3.08]) projLine(ctx, P, [[TBL.x0, TY, z], [TBL.x1, TY, z]], zn); ctx.stroke();
  ctx.restore();
  return top;
}
function chair(ctx, P, part) {
  const zn = .02, X0 = 1.06, X1 = 1.46, Z0 = 2.74, Z1 = 3.12, SY = .45, wood = '#3a2216', dark = '#22140c';
  if (part === 'back') {   // back legs and the backrest (behind you)
    for (const z of [Z0 + .03, Z1 - .03]) { const s = projPoly(P, [[X1 - .05, 0, z - .02], [X1 - .01, 0, z - .02], [X1 + .02, 1.02, z - .02], [X1 - .02, 1.02, z - .02]], zn); fillP(ctx, s, dark); inkP(ctx, s, 1); }
    for (const y of [.98, .82, .66]) { const s = projPoly(P, [[X1 + .015 * (y - .45), y - .04, Z0], [X1 + .015 * (y - .45), y - .04, Z1], [X1 + .015 * (y - .45), y, Z1], [X1 + .015 * (y - .45), y, Z0]], zn); fillP(ctx, s, wood); inkP(ctx, s, 1); }
    return;
  }
  const seat = projPoly(P, [[X0, SY, Z0], [X1, SY, Z0], [X1, SY, Z1], [X0, SY, Z1]], zn); fillP(ctx, seat, '#4a2c1c'); inkP(ctx, seat, 1);
  const fr = projPoly(P, [[X0, SY - .04, Z0], [X1, SY - .04, Z0], [X1, SY, Z0], [X0, SY, Z0]], zn); fillP(ctx, fr, wood);
  for (const x of [X0 + .03, X1 - .03]) { const s = projPoly(P, [[x - .02, 0, Z0 + .02], [x + .02, 0, Z0 + .02], [x + .02, SY - .04, Z0 + .02], [x - .02, SY - .04, Z0 + .02]], zn); fillP(ctx, s, dark); inkP(ctx, s, 1); }
}
// the map: paper, hills, river, road, town, trees, the swing tree, your house, scribbled names, the pencil ring, the help's drawings
function mapSheet(ctx, P, t, K, cam) {
  const zn = .0012, dy = .0002;
  const sheet = projPoly(P, [mw(0, 0), mw(MAP.w, 0), mw(MAP.w, MAP.d), mw(0, MAP.d)], zn);
  if (sheet.length < 3) return;
  fillP(ctx, projPoly(P, [mw(.006, -.008, -.001), mw(MAP.w + .008, -.008, -.001), mw(MAP.w + .008, MAP.d - .006, -.001), mw(.006, MAP.d - .006, -.001)], zn), 'rgba(20,8,4,.45)');
  fillP(ctx, sheet, '#e2d3b2');
  ctx.save(); polyPath(ctx, sheet); ctx.clip();
  const sep = 'rgba(80,48,26,.75)', sepL = 'rgba(80,48,26,.42)', blue = 'rgba(30,54,88,.92)';
  mapLine(ctx, P, [[.012, .012], [MAP.w - .012, .012], [MAP.w - .012, MAP.d - .012], [.012, MAP.d - .012], [.012, .012]], .0012, sep);
  mapLine(ctx, P, [[.018, .018], [MAP.w - .018, .018], [MAP.w - .018, MAP.d - .018], [.018, MAP.d - .018], [.018, .018]], .0005, sep);
  for (const [cu, cv, ru, rvv, n, sd] of HILLS) for (let k = 1; k <= n; k++) { const f = k / n, pts = []; for (let i = 0; i <= 48; i++) { const th = i / 48 * TAU, w = 1 + .12 * Math.sin(th * 3 + sd + k * .4) + .06 * Math.sin(th * 5 + sd * 2); pts.push([cu + Math.cos(th) * ru * f * w, cv + Math.sin(th) * rvv * f * w]); } mapLine(ctx, P, pts, .0005, k === n ? sep : sepL); }
  { const pts = []; for (let i = 0; i <= 60; i++) { const u = i / 60; pts.push([u, .5 + .025 * Math.sin(u * 9 + 1) + .012 * Math.sin(u * 23)]); } mapLine(ctx, P, pts, .0007, sep);
    ctx.strokeStyle = sepL; ctx.lineWidth = Math.max(.6, .0004 * qAt(P, ...mw(.5, .5))); ctx.beginPath(); for (let i = 0; i < 90; i++) { const u = i / 90, v = .5 + .025 * Math.sin(u * 9 + 1) + .012 * Math.sin(u * 23); projLine(ctx, P, [mw(u, v, dy), mw(u + .002, v - .014, dy)], zn); } ctx.stroke(); }
  { const pts = []; for (let i = 0; i <= 30; i++) { const k = i / 30; pts.push([.12 + .06 * Math.sin(k * 4), .66 - k * (.66 - rv(.15)) ]); } mapLine(ctx, P, pts, .0016, blue); }
  // the river: wash, banks, the water lines
  const L = riverSide(-1), R = riverSide(1);
  fillP(ctx, projPoly(P, [...L, ...R.reverse()].map(([u, v]) => mw(u, v, dy * .5)), zn), PIVCOL);
  mapLine(ctx, P, riverSide(-1), .0011, blue, dy); mapLine(ctx, P, riverSide(1), .0011, blue, dy);
  for (const s of [-.6, .6]) mapLine(ctx, P, riverSide(s).filter((_, i) => i % 9 < 5), .0004, 'rgba(30,58,80,.4)', dy);
  // road (double line), bridge, your house, the town, the barn
  const rd = (s) => ROAD.map(([u, v], i) => { const a = ROAD[Math.max(0, i - 1)], b = ROAD[Math.min(ROAD.length - 1, i + 1)], du = b[0] - a[0], dv = b[1] - a[1], l = Math.hypot(du, dv) || 1; return [u - s * .0035 * dv / l, v + s * .0035 * du / l]; });
  mapLine(ctx, P, rd(1), .0007, sep, dy); mapLine(ctx, P, rd(-1), .0007, sep, dy);
  for (const [u, v, w, h, a] of BLOCKS) { const c = Math.cos(a), s = Math.sin(a), pts = [[-w, -h], [w, -h], [w, h], [-w, h]].map(([x, y]) => mw(u + (x * c - y * s) / 2, v + (x * s + y * c) / 2, dy)); const sp = projPoly(P, pts, zn); fillP(ctx, sp, 'rgba(92,60,34,.28)'); inkP(ctx, sp, Math.max(.6, .0005 * qAt(P, ...mw(u, v))), sep); }
  { const sp = projPoly(P, [mw(.545, .585, dy), mw(.585, .585, dy), mw(.585, .615, dy), mw(.545, .615, dy)], zn); fillP(ctx, sp, 'rgba(92,60,34,.5)'); mapLine(ctx, P, [[.565, .615], [.565, .64], [.58, .633], [.565, .628]], .0006, sep, dy); }
  { const sp = projPoly(P, [mw(.8, .54, dy), mw(.84, .54, dy), mw(.84, .565, dy), mw(.8, .565, dy)], zn); fillP(ctx, sp, 'rgba(92,60,34,.4)'); }
  { const sp = projPoly(P, [mw(HOUSE[0] - .009, HOUSE[1] - .007, dy), mw(HOUSE[0] + .009, HOUSE[1] - .007, dy), mw(HOUSE[0] + .009, HOUSE[1] + .007, dy), mw(HOUSE[0] - .009, HOUSE[1] + .007, dy)], zn); fillP(ctx, sp, 'rgba(92,60,34,.55)'); }
  for (const [u, v, r] of TREES) mapLine(ctx, P, ring(u, v, r, 14, .08, u * 9), .0005, 'rgba(60,70,40,.6)', dy);
  mapLine(ctx, P, ring(SW.u, SW.v, .0085, 28, .1, 2), .0009, 'rgba(50,62,34,.85)', dy);
  mapLine(ctx, P, [[SW.u + .002, SW.v + .004], [SW.u + .004, SW.v + .016]], .0005, 'rgba(50,62,34,.85)', dy);
  // scribbled names (no readable words), north arrow, scale bar
  for (const [u, v, w, sd] of [[.6, .67, .11, 3], [.3, .26, .14, 5], [.06, .045, .08, 7], [.78, .36, .1, 9], [.13, .56, .09, 11]]) {
    const pl = plane3(ctx, P, mw(u, v, dy), [1, 0, 0], [0, 0, -1]); if (pl) { scribble(ctx, 0, 0, w, .007, { seed: sd, ink: 'rgba(92,60,34,.75)', lw: .0007 }); } id(ctx); }
  { const c = [.93, .62]; mapLine(ctx, P, [[c[0], c[1] - .03], [c[0], c[1] + .03]], .0008, sep, dy); mapLine(ctx, P, [[c[0] - .008, c[1] + .015], [c[0], c[1] + .03], [c[0] + .008, c[1] + .015]], .0008, sep, dy); }
  { for (let i = 0; i < 4; i++) { const sp = projPoly(P, [mw(.04 + i * .025, .03, dy), mw(.065 + i * .025, .03, dy), mw(.065 + i * .025, .034, dy), mw(.04 + i * .025, .034, dy)], zn); fillP(ctx, sp, i % 2 ? 'rgba(92,60,34,.15)' : 'rgba(92,60,34,.6)'); } }
  // pencil: old notes in the margin, and the ring drawn on "idea"
  const gph = 'rgba(58,56,62,.75)';
  for (const [u, v, w, sd] of [[.82, .1, .1, 21], [.82, .085, .07, 22], [.82, .07, .085, 23]]) { const pl = plane3(ctx, P, mw(u, v, dy), [1, 0, 0], [0, 0, -1]); if (pl) scribble(ctx, 0, 0, w, .006, { seed: sd, ink: gph, lw: .0005 }); id(ctx); }
  const ri = clamp((t - K.k.ring0) / (K.k.ring1 - K.k.ring0));
  if (ri > 0) { const pts = ring(SW.u - .02, SW.v + .02, .034, 64, .07, 1).slice(0, 2 + Math.floor(62 * ri)); mapLine(ctx, P, pts, .0011, gph, dy * 1.5); }
  helpDrawings(ctx, P, t, K, dy);
  ctx.restore();
}
// the help on the map: the point wakes in the ring, runs upstream drawing the flow, rings three samples, finds the outlet
function helpPath(t, K) {
  const a = K.help, u = clamp((t - a - .25) / 1.05), e = u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
  const uu = mix(SW.u - .02, OUTLET[0] + .01, e); return [uu, rv(uu)];
}
function helpDrawings(ctx, P, t, K, dy) {
  if (t < K.help - .02) return;
  const lift = smr(K.k.lift0, K.k.lift0 + .35, t), on = 1 - lift * .85;   // once the cards lift, the drawings on the paper are what they left behind
  const col = (a) => rgba(CYAN, a * on), dyy = dy * 2;
  const [pu, pv] = helpPath(t, K), u0 = SW.u - .02;
  if (pu < u0 - .002) { const pts = []; for (let u = u0; u >= pu; u -= .004) pts.push([u, rv(u) + .005]); pts.push([pu, rv(pu) + .005]);
    mapLine(ctx, P, pts, .0024, col(.16), dyy); mapLine(ctx, P, pts, .0008, col(.95), dyy);
    for (let u = u0 - .03; u > pu; u -= .05) { const d = drv(u), l = Math.hypot(1, d), tx = 1 / l, tv = d / l, c = [u, rv(u) + .005]; mapLine(ctx, P, [[c[0] - tx * .006 - tv * .003, c[1] - tv * .006 + tx * .003], c, [c[0] - tx * .006 + tv * .003, c[1] - tv * .006 - tx * .003]], .0006, col(.9), dyy); } }
  for (let i = 0; i < SAMPLES.length; i++) { const su = SAMPLES[i]; if (pu > su) continue; const k = eoX((u0 - pu - (u0 - su)) / .05 + .001), sv = rv(su);
    mapLine(ctx, P, ring(su, sv, .011 * k, 40), .0024, col(.14), dyy); mapLine(ctx, P, ring(su, sv, .011 * k, 40), .0008, col(.95), dyy);
    for (let j = 0; j < 8; j++) { const a = j / 8 * TAU; mapLine(ctx, P, [[su + Math.cos(a) * .013 * k, sv + Math.sin(a) * .013 * k], [su + Math.cos(a) * .017 * k, sv + Math.sin(a) * .017 * k]], .0005, col(.8), dyy); } }
  if (pu < OUTLET[0] + .03) { const k = eoX((OUTLET[0] + .03 - pu) / .04), [ou, ov] = OUTLET;
    mapLine(ctx, P, [[ou - .007 * k, ov - .007 * k], [ou + .007 * k, ov + .007 * k]], .0008, col(1), dyy); mapLine(ctx, P, [[ou - .007 * k, ov + .007 * k], [ou + .007 * k, ov - .007 * k]], .0008, col(1), dyy);
    const pl = smr(K.k.plume0, K.k.plume0 + .8, t); if (pl > 0) for (let j = 0; j < 9; j++) { const uu = ou + .02 + j * .018; if (uu > ou + .02 + pl * .2) break; mapLine(ctx, P, [[uu, rv(uu) - RW * .4], [uu + .008, rv(uu + .008) + RW * .4]], .0004, col(.7), dyy); } }
  // the point itself (a cyan spark with a ring pulse), until it lifts into the first card
  const born = eoX((t - K.help) / .3), gone = smr(K.k.lift0 - .05, K.k.lift0 + .15, t);
  if (born > 0 && gone < 1) { const p = P(...mw(pu, pv, .002)), q = p[3], r = Math.max(4, .003 * q) * born * (1 - gone);
    ctx.save(); id(ctx); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r * 6); g.addColorStop(0, rgba(CYANW, .9)); g.addColorStop(.18, rgba(CYAN, .55)); g.addColorStop(1, rgba(CYAN, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], r * 6, 0, TAU); ctx.fill();
    ctx.fillStyle = CYANW; ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.fill();
    const pu2 = (t - K.help) % .9 / .9; ctx.strokeStyle = rgba(CYAN, .5 * (1 - pu2) * born); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(p[0], p[1], r * (2 + pu2 * 7), 0, TAU); ctx.stroke();
    ctx.restore(); }
}
// notebook, pencils, mug with steam, the river samples, the stone on the map's corner, a ruler
function props(ctx, P, t, cam) {
  const zn = .01, q = qAt(P, .5, TY, 2.7);
  { const pg = (x0, x1, a) => { const pts = [[x0, TY + .006, 2.48], [x1, TY + .006 + a, 2.48], [x1, TY + .006 + a, 2.7], [x0, TY + .006, 2.7]]; const s = projPoly(P, pts, zn); fillP(ctx, s, '#d8cdb2'); inkP(ctx, s, 1, 'rgba(40,30,20,.5)'); return s; };
    fillP(ctx, projPoly(P, [[.6, TY + .001, 2.47], [.98, TY + .001, 2.47], [.98, TY + .001, 2.71], [.6, TY + .001, 2.71]], zn), '#5a2c22');
    pg(.61, .79, .002); pg(.79, .97, .002);
    for (let k = 0; k < 9; k++) { const z = 2.51 + k * .02; const s = projSeg(P, [.63, TY + .0075, z], [.77, TY + .0075, z], zn); if (s) { ctx.strokeStyle = 'rgba(80,90,120,.3)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(s[0][0], s[0][1]); ctx.lineTo(s[1][0], s[1][1]); ctx.stroke(); } }
    for (const [x, z, w, sd] of [[.81, 2.66, .12, 31], [.81, 2.62, .14, 32], [.81, 2.58, .1, 33], [.81, 2.54, .13, 34], [.63, 2.64, .12, 35]]) { const pl = plane3(ctx, P, [x, TY + .0078, z], [1, 0, 0], [0, 0, -1]); if (pl) scribble(ctx, 0, 0, w, .008, { seed: sd, ink: 'rgba(58,56,62,.7)', lw: .0006 }); id(ctx); } }
  { const s = projPoly(P, [[-.05, TY + .006, 2.45], [.17, TY + .006, 2.52], [.17, TY + .012, 2.523], [-.05, TY + .012, 2.453]], zn); fillP(ctx, s, '#c89c3a'); inkP(ctx, s, 1); }
  { const rack = projPoly(P, [[-.78, TY, 2.98], [-.48, TY, 2.98], [-.48, TY + .05, 2.98], [-.78, TY + .05, 2.98]], zn); fillP(ctx, rack, '#3a2418'); inkP(ctx, rack, 1);
    const cols = ['#5e7a52', '#6a6e4e', '#77705a'];
    for (let i = 0; i < 3; i++) { const x = -.72 + i * .1, tube = projPoly(P, [[x - .016, TY + .01, 2.99], [x + .016, TY + .01, 2.99], [x + .016, TY + .17, 2.99], [x - .016, TY + .17, 2.99]], zn);
      fillP(ctx, tube, 'rgba(190,210,220,.18)'); const liq = projPoly(P, [[x - .015, TY + .012, 2.99], [x + .015, TY + .012, 2.99], [x + .015, TY + .1 - i * .015, 2.99], [x - .015, TY + .1 - i * .015, 2.99]], zn); fillP(ctx, liq, cols[i]);
      inkP(ctx, tube, 1, 'rgba(200,220,230,.45)'); fillP(ctx, projPoly(P, [[x - .018, TY + .17, 2.99], [x + .018, TY + .17, 2.99], [x + .018, TY + .19, 2.99], [x - .018, TY + .19, 2.99]], zn), '#7a3a26');
      const lb = projPoly(P, [[x - .013, TY + .12, 2.988], [x + .013, TY + .12, 2.988], [x + .013, TY + .145, 2.988], [x - .013, TY + .145, 2.988]], zn); fillP(ctx, lb, '#d8ccb0'); } }
  { const cx = -.36, cz = 2.66, r = .042, h = .095, n = 24, base = [], rim = [];
    for (let i = 0; i <= n; i++) { const a = i / n * TAU; base.push([cx + Math.cos(a) * r, TY, cz + Math.sin(a) * r]); rim.push([cx + Math.cos(a) * r, TY + h, cz + Math.sin(a) * r]); }
    const bs = base.map((p) => P(...p)), rs = rim.map((p) => P(...p)); let iL = 0, iR = 0; for (let i = 0; i < n; i++) { if (bs[i][0] < bs[iL][0]) iL = i; if (bs[i][0] > bs[iR][0]) iR = i; }
    const body = [rs[iL], bs[iL], ...bs.filter((p, i) => { const a = i / n * TAU; return Math.sin(a) < 0; }).sort((a, b) => a[0] - b[0]), bs[iR], rs[iR]];
    ctx.fillStyle = '#d6d0c0'; ctx.beginPath(); ctx.moveTo(rs[iL][0], rs[iL][1]); ctx.lineTo(bs[iL][0], bs[iL][1]); for (const p of body.slice(2, -2)) ctx.lineTo(p[0], p[1]); ctx.lineTo(bs[iR][0], bs[iR][1]); ctx.lineTo(rs[iR][0], rs[iR][1]); ctx.closePath(); ctx.fill();
    const lg = ctx.createLinearGradient(rs[iL][0], 0, rs[iR][0], 0); lg.addColorStop(0, 'rgba(20,16,30,.45)'); lg.addColorStop(.6, 'rgba(255,220,170,.15)'); lg.addColorStop(1, 'rgba(20,16,30,.3)'); ctx.fillStyle = lg; ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = '#3a2218'; ctx.beginPath(); rs.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#2c4a7a'; ctx.lineWidth = Math.max(1.2, .006 * rs[0][3]); ctx.stroke();
    const hx = P(cx + r + .022, TY + h * .55, cz); ctx.strokeStyle = '#d6d0c0'; ctx.lineWidth = Math.max(1.5, .01 * hx[3]); ctx.beginPath(); ctx.arc(hx[0], hx[1], .022 * hx[3], -1.3, 1.3); ctx.stroke();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 3; i++) { const ph = t * .9 + i * 2.1, age = (ph % 3) / 3; const pts = []; for (let k = 0; k <= 12; k++) { const yy = TY + h + .01 + age * .05 + k * .012; pts.push([cx + .012 * Math.sin(yy * 60 + i * 2 + t * 1.5) + (k / 12) * .02 * Math.sin(i), yy, cz]); }
      ctx.strokeStyle = `rgba(230,220,210,${.13 * Math.sin(Math.PI * age)})`; ctx.lineWidth = Math.max(1, .004 * rs[0][3]); ctx.beginPath(); projLine(ctx, P, pts, zn); ctx.stroke(); } ctx.restore(); }
  { const c = P(-.12, TY + .02, 3.24), r = .035 * c[3]; ctx.fillStyle = '#5a5a66'; ctx.beginPath(); ctx.ellipse(c[0], c[1], r, r * .55, -.1, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,230,190,.25)'; ctx.beginPath(); ctx.ellipse(c[0] - r * .25, c[1] - r * .2, r * .45, r * .2, -.1, 0, TAU); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(c[0], c[1], r, r * .55, -.1, 0, TAU); ctx.stroke(); }
}

// ---------------------------------------------------------------- the lamp: cord, enamel shade, the bulb (its glare = lightFill)
function lampBack(ctx, P, t, cam) {
  const sw = .006 * Math.sin(t * .8), zn = .02;
  ctx.strokeStyle = '#141018'; ctx.lineWidth = Math.max(1, .006 * qAt(P, LAMP.x, 2, LAMP.z)); ctx.beginPath(); projLine(ctx, P, [[LAMP.x, LAMP.ceil, LAMP.z], [LAMP.x + sw, LAMP.top, LAMP.z]], zn); ctx.stroke();
}
function shadeGeo(P, t) {
  const sw = .006 * Math.sin(t * .8), n = 40, rim = [], top = [];
  for (let i = 0; i < n; i++) { const a = i / n * TAU; rim.push([LAMP.x + sw + Math.cos(a) * LAMP.rr, LAMP.rim, LAMP.z + Math.sin(a) * LAMP.rr]); top.push([LAMP.x + sw + Math.cos(a) * LAMP.tr, LAMP.top, LAMP.z + Math.sin(a) * LAMP.tr]); }
  return { rim, top, sw };
}
function hull(pts) {
  const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  up.pop(); lo.pop(); return lo.concat(up);
}
function lamp(ctx, P, t, cam) {
  const { rim, top, sw } = shadeGeo(P, t), zn = .02, cr = rim.map((p) => P(...p)), ct = top.map((p) => P(...p));
  if (cr.some((p) => p[2] < zn) || ct.some((p) => p[2] < zn)) return;
  const below = cam.y < LAMP.rim, outline = hull([...cr, ...ct].map((p) => [p[0], p[1]]));
  const c = P(LAMP.x + sw, (LAMP.rim + LAMP.top) / 2, LAMP.z), g = ctx.createLinearGradient(c[0] - LAMP.rr * c[3], 0, c[0] + LAMP.rr * c[3], 0);
  g.addColorStop(0, '#0e1a18'); g.addColorStop(.42, '#24403a'); g.addColorStop(.55, '#3e6a5e'); g.addColorStop(.7, '#1e3530'); g.addColorStop(1, '#0a1210');
  fillP(ctx, outline, g); inkP(ctx, outline, 1.1);
  if (below) {   // the inside of the shade: white enamel lit by the bulb
    const ig = ctx.createRadialGradient(c[0], cr.reduce((s, p) => s + p[1], 0) / cr.length, 0, c[0], cr.reduce((s, p) => s + p[1], 0) / cr.length, LAMP.rr * c[3]);
    ig.addColorStop(0, '#fff6e0'); ig.addColorStop(.6, '#f2d8a8'); ig.addColorStop(1, '#c89a62'); fillP(ctx, cr.map((p) => [p[0], p[1]]), ig);
  }
  ctx.strokeStyle = '#e8e0cc'; ctx.lineWidth = Math.max(1, .007 * c[3]); polyPath(ctx, cr.map((p) => [p[0], p[1]])); ctx.stroke();
  ctx.fillStyle = '#2c2a26'; const ck = P(LAMP.x + sw, LAMP.top + .02, LAMP.z); ctx.beginPath(); ctx.ellipse(ck[0], ck[1], .022 * ck[3], .012 * ck[3], 0, 0, TAU); ctx.fill();
}
// the bulb's glare: exactly lightFill at the cut (the window's light), shrinking to the bulb as the camera pulls back; hidden by the rim
function bulbGlare(ctx, P, t, cam, K) {
  const sw = .006 * Math.sin(t * .8), b = P(BULB.x + sw, BULB.y, BULB.z); if (b[2] < .003) return;
  const d = Math.hypot(cam.x - BULB.x, cam.y - BULB.y, cam.z - BULB.z), vis = smo(clamp((LAMP.rim + .012 - cam.y) / .07));
  const u = qio(clamp((t - K.cut) / .78)), Rt = Math.exp(mix(Math.log(1500), Math.log(40), u));
  const R = Math.min(1500, Math.max(Rt, 40 * 1.55 / Math.max(.3, d))) * vis;
  if (R < 1.5) return;
  lightFill(ctx, t, { cx: b[0], cy: b[1], R, k: 1 - smo(clamp((t - K.cut - .04) / .42)) });
}
// the lamp's pool of light on the table and paper (drawn after the map and props, before you)
function lampPool(ctx, P, t, top) {
  if (!top || top.length < 3) return;
  const C = [BULB.x, TY, BULB.z], o = P(...C); if (o[2] < .003) return;
  ctx.save(); polyPath(ctx, top); ctx.clip();
  if (plane3(ctx, P, C, [.75, 0, 0], [0, 0, -.75])) {
    const fl = 1 + .02 * Math.sin(t * 2.3);
    ctx.globalCompositeOperation = 'multiply'; const m = ctx.createRadialGradient(0, 0, 0, 0, 0, 1.6); m.addColorStop(0, 'rgb(255,250,240)'); m.addColorStop(.45, 'rgb(220,190,170)'); m.addColorStop(1, 'rgb(70,56,80)'); ctx.fillStyle = m; ctx.fillRect(-2, -2, 4, 4);
    ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(0, 0, 0, 0, 0, fl); g.addColorStop(0, 'rgba(255,200,130,.32)'); g.addColorStop(.5, 'rgba(255,180,110,.14)'); g.addColorStop(1, 'rgba(255,170,100,0)'); ctx.fillStyle = g; ctx.fillRect(-1.2, -1.2, 2.4, 2.4);
  }
  ctx.restore(); id(ctx);
}

// ---------------------------------------------------------------- you
function pose(t, K) {
  const k = K.k, back = smr(k.lift0 - .1, k.lift0 + .55, t) * (1 - smr(k.dive - .2, k.dive + .4, t));
  return { hip: [1.38, 1.46], kn: [1.36, 1.5], sh: [.9, .5], el: [.6, 1.1], lean: mix(.42, .16, back), head: mix(.42, -.12, back) + .05 * Math.sin(t * .6), coat: false, hair: 'short' };
}
function penTarget(t, K, P) {
  const k = K.k;
  const base = [SW.u + .045 + .012 * Math.sin(t * 1.7), SW.v - .03 + .008 * Math.sin(t * 2.3)];
  let uv = base;
  if (t > k.ring0 - .25 && t < k.ring1 + .35) { const r = clamp((t - k.ring0) / (k.ring1 - k.ring0)), th = r * TAU, a = ring(SW.u - .02, SW.v + .02, .034, 64, .07, 1)[Math.min(64, Math.floor(r * 64))];
    const w = smr(k.ring0 - .25, k.ring0, t) * (1 - smr(k.ring1, k.ring1 + .35, t)); uv = [mix(base[0], a[0], w), mix(base[1], a[1], w)]; }
  const lift = smr(K.help - .1, K.help + .3, t) * .012;
  let p = P(...mw(uv[0], uv[1], .006 + lift + .01 * bump(t, k.ring1, k.ring1 + .4)));
  const card = CARDS[k.touch];
  if (t > k.touch0 - .3 && t < k.touch1 + .5) { const cp = cardPos(card, t, K), sp = P(...cp), w = smo(clamp((t - (k.touch0 - .3)) / .3)) * (1 - smo(clamp((t - k.touch1) / .5))); p = [mix(p[0], sp[0], w), mix(p[1], sp[1], w)]; }
  return p;
}
function person(ctx, P, t, K, Lp, occ) {
  const h = P(HIP.x, HIP.y, HIP.z); if (h[2] < .1) return;
  if (h[2] < 1.4 && h[1] < 0) return;   // the dive: your hip has left over the top edge, the rest of you is beyond it (the table hides the legs)
  // the side-view figure lives in the plane X-Y at HIP.z (it faces -X): the camera's local affine of that plane, split into a uniform
  // scale s (figure() draws at that size, at most 4.2: closer in the dive R scales it up) and a residual R (mirror, foreshortening, shear)
  const m = 1.75 / 185, ax = P(HIP.x - m, HIP.y, HIP.z), ay = P(HIP.x, HIP.y - m, HIP.z);
  const M = [ax[0] - h[0], ax[1] - h[1], ay[0] - h[0], ay[1] - h[1]], det = M[0] * M[3] - M[2] * M[1], s = Math.min(4.2, Math.sqrt(Math.abs(det))), R = M.map((v) => v / s), dR = R[0] * R[3] - R[2] * R[1];
  const loc = ([x, y]) => { const dx = x - h[0], dy = y - h[1]; return [h[0] + (R[3] * dx - R[2] * dy) / dR, h[1] + (-R[1] * dx + R[0] * dy) / dR]; };
  const scr = ([x, y]) => { const dx = x - h[0], dy = y - h[1]; return [h[0] + R[0] * dx + R[2] * dy, h[1] + R[1] * dx + R[3] * dy]; };
  const ps = pose(t, K), L = loc(Lp);
  const o = { t, seed: 4, dress: { coat: '#3a4a5a', pants: '#1e1c2c', shoes: '#120e14', skin: '#d9b08e', hair: '#2a1c18' }, light: { x: L[0], y: L[1], col: '#ffcf8a', a: .75 }, rim: '#ffcf8a', rimSide: 1, shadow: false };
  const tg = penTarget(t, K, P), arm = reachArm(h[0], h[1], s, ps, 0, false, o, loc(tg), 1), back = reachArm(h[0], h[1], s, ps, 1, false, o, loc(P(.86, TY + .03, 2.6)), 1);
  const pz = { ...ps, sh: [arm.sh, back.sh], el: [arm.el, back.el], lock: [1, 1] };
  const [lc, lg] = scratchLayer('c13person');
  lg.setTransform(R[0], R[1], R[2], R[3], h[0] - (R[0] * h[0] + R[2] * h[1]), h[1] - (R[1] * h[0] + R[3] * h[1]));
  const f = figure(lg, h[0], h[1], s, pz, o);
  lg.setTransform(1, 0, 0, 1, 0, 0);
  const hd = f && f.hand ? scr(f.hand(0)) : null;
  if (hd) {   // the pencil: from its point on the paper (or the card) back through the fingers
    const dx = hd[0] - tg[0], dy = hd[1] - tg[1], Lh = Math.hypot(dx, dy) || 1, ux = dx / Lh, uy = dy / Lh, len = .16 * h[3], tip = [hd[0] - ux * len * .42, hd[1] - uy * len * .42];
    lg.lineCap = 'round'; lg.strokeStyle = '#c89c3a'; lg.lineWidth = Math.max(2, .008 * h[3]); lg.beginPath(); lg.moveTo(tip[0], tip[1]); lg.lineTo(hd[0] + ux * len * .58, hd[1] + uy * len * .58); lg.stroke();
    lg.strokeStyle = '#e8d8b0'; lg.lineWidth = Math.max(1, .003 * h[3]); lg.beginPath(); lg.moveTo(tip[0] + ux * len * .06, tip[1] + uy * len * .06); lg.lineTo(tip[0] + ux * len * .1, tip[1] + uy * len * .1); lg.stroke();
    lg.strokeStyle = '#2a2420'; lg.lineWidth = Math.max(1.2, .004 * h[3]); lg.beginPath(); lg.moveTo(tip[0], tip[1]); lg.lineTo(tip[0] + ux * len * .06, tip[1] + uy * len * .06); lg.stroke(); }
  if (occ.half.length > 2) { lg.save(); polyPath(lg, occ.half); lg.clip(); lg.globalCompositeOperation = 'destination-out'; lg.fillStyle = '#000'; for (const q of occ.polys) if (q.length > 2) { polyPath(lg, q); lg.fill(); } lg.restore(); }
  ctx.drawImage(lc, 0, 0);
}
// what of you the table hides: its top, front edge, apron and near legs, but only below the line where your plane meets the table top
// (near-clipped in 3D, so it holds down to the last millimetres of the dive)
function tableOcc(P) {
  const zn = .001, half = projPoly(P, [[-3, TY, HIP.z], [3, TY, HIP.z], [3, -2, HIP.z], [-3, -2, HIP.z]], zn);
  const polys = [projPoly(P, [[TBL.x0, TY, TBL.z0], [TBL.x1, TY, TBL.z0], [TBL.x1, TY, TBL.z1], [TBL.x0, TY, TBL.z1]], zn),
    projPoly(P, [[TBL.x0, TY - .045, TBL.z0], [TBL.x1, TY - .045, TBL.z0], [TBL.x1, TY, TBL.z0], [TBL.x0, TY, TBL.z0]], zn),
    projPoly(P, [[TBL.x1, TY - .045, TBL.z0], [TBL.x1, TY - .045, TBL.z1], [TBL.x1, TY, TBL.z1], [TBL.x1, TY, TBL.z0]], zn),
    projPoly(P, [[TBL.x0 + .03, TY - .12, TBL.z0 + .03], [TBL.x1 - .03, TY - .12, TBL.z0 + .03], [TBL.x1 - .03, TY - .045, TBL.z0 + .03], [TBL.x0 + .03, TY - .045, TBL.z0 + .03]], zn),
    projPoly(P, [[TBL.x1 - .03, TY - .12, TBL.z0 + .03], [TBL.x1 - .03, TY - .12, TBL.z1 - .03], [TBL.x1 - .03, TY - .045, TBL.z1 - .03], [TBL.x1 - .03, TY - .045, TBL.z0 + .03]], zn)];
  for (const [x, z] of [[TBL.x1 - .06, TBL.z0 + .06], [TBL.x0 + .06, TBL.z0 + .06]]) polys.push(projPoly(P, [[x - .03, 0, z - .03], [x + .03, 0, z - .03], [x + .03, TY - .05, z - .03], [x - .03, TY - .05, z - .03]], zn));
  return { half, polys };
}

// ---------------------------------------------------------------- the cards: the help's drawings lift off the paper and multiply round you
const cardT0 = (i, K) => (CARDS[i].par < 0 ? K.k.lift0 + i * .07 : K.ten - .02 + (i - 3) * .055);
function cardPos(c, t, K, depth = 0) {
  const i = CARDS.indexOf(c), t0 = cardT0(i, K), u = clamp((t - t0) / .62), e = 1 - Math.pow(1 - u, 3);
  const from = c.par < 0 ? mw(c.from[0], c.from[1], .002) : depth > 3 ? c.p : cardPos(CARDS[c.par], t0, K, depth + 1);
  const bob = [.008 * Math.sin(t * 1.1 + c.ph), .012 * Math.sin(t * .9 + c.ph * 1.3), .006 * Math.sin(t * .7 + c.ph)];
  return [mix(from[0], c.p[0], e) + bob[0] * e, mix(from[1], c.p[1], e) + bob[1] * e, mix(from[2], c.p[2], e) + bob[2] * e];
}
function cardWarm(i, t, K) { const k = K.k, d = i === k.touch ? 0 : .1 + ((i - k.touch + CARDS.length) % CARDS.length) * .045; return smr(k.touch0 + .1 + d, k.touch0 + .32 + d, t); }
function cards(ctx, P, t, K, cam) {
  const k = K.k; if (t < k.lift0) return;
  const list = CARDS.map((c, i) => ({ c, i, p: cardPos(c, t, K) })).filter((o) => t >= cardT0(o.i, K)).map((o) => ({ ...o, d: P(...o.p)[2] })).filter((o) => o.d > .03).sort((a, b) => b.d - a.d);
  for (const { c, i, p } of list) {
    const t0 = cardT0(i, K), u = clamp((t - t0) / .62), up = c.par < 0 ? 1 - Math.pow(1 - u, 2) : 1, th = up * Math.PI / 2;   // flat on the paper → upright
    const grow = c.par < 0 ? 1 : eoX(u * 1.4);                                                                        // a child card opens out of its parent
    const yawC = Math.atan2(cam.x - p[0], cam.z - p[2]) + Math.PI, cy = Math.cos(yawC), sy = Math.sin(yawC), w = c.w * (.35 + .65 * grow);
    const ux = [cy * w, 0, -sy * w], fwd = [sy, 0, cy], uy = [-fwd[0] * Math.cos(th) * w, -Math.sin(th) * w, -fwd[2] * Math.cos(th) * w];
    if (!plane3(ctx, P, p, ux, uy)) { id(ctx); continue; }
    ctx.rotate(c.rot * up);
    const col = mixHex(CYAN, AMB, cardWarm(i, t, K)), W2 = .5, H2 = .36;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const path = () => { ctx.beginPath();
      for (const [x, y, sx, sy2] of [[-W2, -H2, 1, 1], [W2, -H2, -1, 1], [W2, H2, -1, -1], [-W2, H2, 1, -1]]) { ctx.moveTo(x + sx * .09, y); ctx.lineTo(x, y); ctx.lineTo(x, y + sy2 * .09); }
      if (c.kind === 0) { ctx.moveTo(-.4, .26); ctx.lineTo(-.4, -.26); ctx.moveTo(-.4, .26); ctx.lineTo(.42, .26); for (let x = 0; x <= 20; x++) { const xx = -.38 + x * .04, yy = -.16 + x * .018 + .05 * Math.sin(x * 1.3); x ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } }
      else if (c.kind === 1) { ctx.moveTo(-.44, -.1); ctx.bezierCurveTo(-.25, -.08, -.22, .24, 0, .24); ctx.bezierCurveTo(.22, .24, .25, -.08, .44, -.1); ctx.moveTo(-.3, .02); ctx.lineTo(.3, .02); for (let x = -.24; x < .24; x += .06) { ctx.moveTo(x, .12); ctx.lineTo(x + .04, .2); } }
      else if (c.kind === 2) { for (let j = 0; j < 4; j++) { const y = -.22 + j * .15; ctx.moveTo(-.42, y); ctx.bezierCurveTo(-.15, y - .06, .1, y + .06, .36, y); ctx.moveTo(.3, y - .04); ctx.lineTo(.38, y); ctx.lineTo(.3, y + .04); } }
      else if (c.kind === 3) { for (let j = 0; j < 4; j++) for (let m = 0; m < 3; m++) { ctx.moveTo(-.35 + m * .27 + .03, -.24 + j * .15); ctx.arc(-.35 + m * .27, -.24 + j * .15, .03, 0, TAU); ctx.moveTo(-.29 + m * .27, -.24 + j * .15); ctx.lineTo(-.17 + m * .27, -.24 + j * .15); } }
      else if (c.kind === 4) { ctx.ellipse(-.1, 0, .2, .09, 0, 0, TAU); ctx.moveTo(.1, 0); ctx.lineTo(.24, -.09); ctx.lineTo(.24, .09); ctx.closePath(); ctx.moveTo(-.205, -.02); ctx.arc(-.22, -.02, .015, 0, TAU); for (let j = 0; j < 3; j++) { ctx.moveTo(-.4 + j * .1, -.24); ctx.lineTo(-.36 + j * .1, -.3); } }
      else { for (let j = 1; j <= 4; j++) { ctx.moveTo(.05 + .3 * j / 4, 0); ctx.ellipse(.05, 0, .3 * j / 4, .2 * j / 4, .2, 0, TAU); } ctx.moveTo(-.44, .2); ctx.bezierCurveTo(-.2, .1, .1, .3, .44, .18); } };
    path(); ctx.strokeStyle = rgba(col, .16); ctx.lineWidth = .07; ctx.stroke();
    ctx.strokeStyle = rgba(col, .95); ctx.lineWidth = .02; ctx.stroke();
    ctx.restore(); id(ctx);
  }
}

// ---------------------------------------------------------------- the frame at the pivot (the river's ink = the water)
let PIVS = null;
export const pivotCol = () => PIVS ?? PIVCOL;   // the water's colour at the pivot (measured by samplePivot in the warm-up)
export function samplePivot(K) {
  const [, g] = canvas(); g.save(); kitchenTake(g, K.piv - 1 / 30, K); g.restore();
  const d = g.getImageData(0, 0, W, H).data; let r = 0, gg = 0, b = 0, n = 0, lo = 255, hi = 0;
  for (let y = 40; y < H - 40; y += 20) for (let x = 40; x < W - 40; x += 20) { const i = (y * W + x) * 4, L = (d[i] + d[i + 1] + d[i + 2]) / 3; r += d[i]; gg += d[i + 1]; b += d[i + 2]; n++; lo = Math.min(lo, L); hi = Math.max(hi, L); }
  PIVS = '#' + [r, gg, b].map((v) => Math.round(v / n).toString(16).padStart(2, '0')).join('');
  return { col: PIVS, spread: hi - lo };
}
export function inkFill(ctx, t) {
  ctx.save(); id(ctx); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = pivotCol(); ctx.fillRect(0, 0, W, H); ctx.restore();
}

// ---------------------------------------------------------------- the take
export function kitchenTake(ctx, t, K) {
  const cam = kitchenCam(t, K), P = pin(cam);
  id(ctx); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#0c0a16'; ctx.fillRect(0, 0, W, H);
  const sw = .006 * Math.sin(t * .8), Lp = P(BULB.x + sw, BULB.y, BULB.z);
  room(ctx, P, t, cam, Lp);
  chair(ctx, P, 'back');
  const top = table(ctx, P, t, cam);
  mapSheet(ctx, P, t, K, cam);
  props(ctx, P, t, cam);
  lampPool(ctx, P, t, top);
  const occ = tableOcc(P);
  { const [sc, sg] = scratchLayer('c13seat'); chair(sg, P, 'seat');   // the seat stands beside the table: low cameras see it behind the top
    sg.globalCompositeOperation = 'destination-out'; sg.fillStyle = '#000'; for (const q of [occ.polys[0], occ.polys[2]]) if (q.length > 2) { polyPath(sg, q); sg.fill(); }
    sg.globalCompositeOperation = 'source-over'; ctx.drawImage(sc, 0, 0); }
  person(ctx, P, t, K, Lp, occ);
  lampBack(ctx, P, t, cam);
  lamp(ctx, P, t, cam);
  cards(ctx, P, t, K, cam);
  bulbGlare(ctx, P, t, cam, K);
  id(ctx);
}
export function warmKitchen() { }
