// Film 11 · props for c10 (builder of c07/c08/c10). Same style as lib/f11_kit.mjs: brass, wood, paper, warm light, pure functions of t.
//   shelves(ctx, t, V, o)        book shelves along the window wall (tall between the windows, low under them); o.grow(z, row, seed) → 0…1
//                                (each book rises out of its shelf: the scroll unrolls into a library)
//   mini(ctx, t, o)              the small desk machine with forks and an arm (cm units, origin = plinth centre, faces +x):
//                                o { fork 0…1 (height), forkOut 0…1 (0 = folded up), armOut 0…1, reach [x, y], core, seed, load(ctx, x, y, ang) }
//   leverBox(ctx, t, o)          the brass switch box LEARN (cm units, origin = its bottom centre): o.on 0…1 (lever angle), o.lit
//   deskWindow(ctx, t, V, w, st) a window of the city with a child at a desk and the desk machine: st { on (lever), u (0 forklift … 1 trainer),
//                                seed, lever (draw the switch box), kid 0/1, glow }
//   simulator(ctx, t, V, o)      a flight simulator by the windows (seat, console, brass yoke), the pilot flying by hand
//   lightbox(ctx, t, V, o)       an easel with a lit exam image (an endoscopy frame); a doctor practises without the machine
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, prng } from '../engine.mjs';
import * as K from './f11_kit.mjs';
import * as X from './f11_c05_kit.mjs';
import * as C from './f11_c07_city.mjs';
import { DRESSES } from './f11_c07_rooms.mjs';

const TAU = Math.PI * 2, { PAL } = K;
const brass = (ctx, x0, y0, x1, y1) => X.brassGrad(ctx, x0, y0, x1, y1);

// ---------------------------------------------------------------- the shelves
const SX = K.HALL.x0, SD = .34, ROWH = .42;
const BOOKC = ['#8a3b2e', '#3f5d6b', '#c49a4a', '#5b6b45', '#7a4a5e', '#d8c7a0', '#2f4256', '#a8643c', '#6e7d86', '#b5523c'];
const BOOKD = BOOKC.map((c) => { const n = parseInt(c.slice(1), 16), f = (s) => Math.round(((n >> s) & 255) * .8); return `rgb(${f(16)},${f(8)},${f(0)})`; });
export const SHELVES = (() => {
  const Wz = K.WINDOWS.map((w) => w.z), segs = [];
  const piers = [[-3.85, Wz[0] - 1.45]]; for (let i = 0; i + 1 < Wz.length; i++) piers.push([Wz[i] + 1.45, Wz[i + 1] - 1.45]); piers.push([Wz[Wz.length - 1] + 1.45, 39.85]);
  for (const [z0, z1] of piers) segs.push({ z0, z1, h: 4.62 });
  for (const z of Wz) segs.push({ z0: z - 1.45, z1: z + 1.45, h: 1.88 });
  const r = prng(1010);
  for (const s of segs) {
    s.rows = [];
    for (let y = .1; y + .36 < s.h - .05; y += ROWH) {
      const books = []; let z = s.z0 + .04;
      while (z < s.z1 - .06) {
        const w = .022 + r() * .038, hb = .2 + r() * .15;
        if (r() < .04) { z += .06 + r() * .1; continue; }   // a gap (books leaning, a missing one)
        books.push({ z0: z, z1: Math.min(z + w, s.z1 - .04), h: hb, c: Math.floor(r() * BOOKC.length), d: r() < .5 ? 1 : 0, in: r() * .03, seed: r() });
        z += w + .003;
      }
      s.rows.push({ y, books });
    }
  }
  return segs;
})();
export function shelves(ctx, t, V, o = {}) {
  const cam = V.cam, xf = SX + SD;
  for (const s of SHELVES) {
    // cull: the segment's corners on screen?
    const cs = [[xf, 0, s.z0], [xf, 0, s.z1], [xf, s.h, s.z0], [xf, s.h, s.z1]].map((p) => V.P(p));
    if (cs.every((p) => p.z > .1) && (cs.every((p) => p.x < -20) || cs.every((p) => p.x > W + 20) || cs.every((p) => p.y < -20) || cs.every((p) => p.y > H + 20))) continue;
    if (cs.every((p) => !(p.z > .1))) continue;
    // the case: back panel, then for each row the board top, the books, the board's front edge; the uprights; the cornice
    if (V.poly(ctx, [[SX + .01, 0, s.z0], [SX + .01, 0, s.z1], [SX + .01, s.h, s.z1], [SX + .01, s.h, s.z0]])) { ctx.fillStyle = '#5e4130'; ctx.fill(); }
    const kk = cs[0].k || 1;
    for (const row of s.rows) {
      const y = row.y;
      if (cam.y > y && V.poly(ctx, [[SX, y, s.z0], [xf, y, s.z0], [xf, y, s.z1], [SX, y, s.z1]])) { ctx.fillStyle = '#8e6240'; ctx.fill(); }
      if (cam.y < y + ROWH - .025 && V.poly(ctx, [[SX, y + ROWH - .025, s.z0], [xf, y + ROWH - .025, s.z0], [xf, y + ROWH - .025, s.z1], [SX, y + ROWH - .025, s.z1]])) { ctx.fillStyle = '#4a3222'; ctx.fill(); }
      // books, batched by colour (front faces: spines)
      for (let c = 0; c < BOOKC.length; c++) for (const dk of [0, 1]) {
        ctx.beginPath(); let any = false;
        for (const b of row.books) {
          if (b.c !== c || b.d !== dk) continue;
          const g = o.grow ? o.grow((b.z0 + b.z1) / 2, row, b.seed) : 1; if (g <= 0) continue;
          const x = xf - .02 - b.in, hh = b.h * eout(clamp(g));
          if (V.poly(ctx, [[x, y, b.z0], [x, y, b.z1], [x, y + hh, b.z1], [x, y + hh, b.z0]], false)) any = true;
        }
        if (any) { ctx.fillStyle = dk ? BOOKD[c] : BOOKC[c]; ctx.fill(); }
      }
      // gilt bands on the spines (only when near)
      if (kk > 160) {
        ctx.strokeStyle = rgba('#e8c27a', .55); ctx.lineWidth = Math.max(.6, kk * .004); ctx.beginPath();
        for (const b of row.books) { const g = o.grow ? o.grow((b.z0 + b.z1) / 2, row, b.seed) : 1; if (g < .98 || b.seed > .55) continue; const x = xf - .021 - b.in; V.seg(ctx, [x, y + b.h * .8, b.z0 + .004], [x, y + b.h * .8, b.z1 - .004]); V.seg(ctx, [x, y + b.h * .2, b.z0 + .004], [x, y + b.h * .2, b.z1 - .004]); }
        ctx.stroke();
      }
      if (V.poly(ctx, [[xf, y - .028, s.z0], [xf, y - .028, s.z1], [xf, y, s.z1], [xf, y, s.z0]])) { ctx.fillStyle = '#b98250'; ctx.fill(); }
    }
    for (const z of [s.z0, s.z1]) if (V.poly(ctx, [[xf, 0, z - .025], [xf, 0, z + .025], [xf, s.h, z + .025], [xf, s.h, z - .025]])) { ctx.fillStyle = '#a87448'; ctx.fill(); }
    if (V.poly(ctx, [[xf + .03, s.h, s.z0 - .03], [xf + .03, s.h, s.z1 + .03], [xf + .03, s.h + .07, s.z1 + .03], [xf + .03, s.h + .07, s.z0 - .03]])) { ctx.fillStyle = '#9a6a44'; ctx.fill(); }
    if (cam.y > s.h && V.poly(ctx, [[SX, s.h + .07, s.z0 - .03], [xf + .03, s.h + .07, s.z0 - .03], [xf + .03, s.h + .07, s.z1 + .03], [SX, s.h + .07, s.z1 + .03]])) { ctx.fillStyle = '#c99a66'; ctx.fill(); }
  }
}

// ---------------------------------------------------------------- the small desk machine (forks + arm), cm units
export function mini(ctx, t, o = {}) {
  const core = o.core ?? 1, br = 1 + .04 * Math.sin(t * TAU / 4.2 + (o.seed || 0));
  const out = {};
  ctx.fillStyle = 'rgba(60,36,20,.3)'; ctx.beginPath(); ctx.ellipse(1, .4, 11, 1.8, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = brass(ctx, -9, 0, 9, 0); ctx.beginPath(); ctx.ellipse(0, -1.6, 9, 2, 0, 0, Math.PI); ctx.lineTo(-9, -3.6); ctx.ellipse(0, -3.6, 9, 2, 0, Math.PI, 0, true); ctx.closePath(); ctx.fill();
  ctx.fillStyle = PAL.brassLit; ctx.beginPath(); ctx.ellipse(0, -3.6, 9, 2, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = brass(ctx, -1.2, 0, 1.2, 0); ctx.fillRect(-1.1, -44, 2.2, 41);
  for (const y of [-8, -40]) { ctx.fillStyle = brass(ctx, -2, 0, 2, 0); ctx.fillRect(-2, y - 1, 4, 2); }
  ctx.fillStyle = brass(ctx, -1.8, -48, 1.8, -45); ctx.beginPath(); ctx.arc(0, -46, 1.8, 0, TAU); ctx.fill();
  // the core
  const cy = -30, R = 5.6; out.core = [0, cy];
  if (core > .02) { const gl = ctx.createRadialGradient(0, cy, 0, 0, cy, R * 4.6 * br); gl.addColorStop(0, rgba(PAL.core, .42 * core)); gl.addColorStop(1, rgba(PAL.core, 0)); ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(0, cy, R * 4.6 * br, 0, TAU); ctx.fill(); ctx.restore(); }
  const ph = t * .35 + (o.seed || 0);
  const ring = (rx, ry, rot, front) => { ctx.save(); ctx.translate(0, cy); ctx.rotate(rot); ctx.strokeStyle = brass(ctx, -rx, 0, rx, 0); ctx.lineWidth = .7; ctx.beginPath(); ctx.ellipse(0, 0, rx, Math.max(.2, ry), 0, front ? 0 : Math.PI, front ? Math.PI : TAU); ctx.stroke(); ctx.restore(); };
  const r1 = (R + 1.8) * Math.abs(Math.sin(ph)), r2 = (R + 1) * Math.abs(Math.cos(ph * .8));
  ring(R + 1.8, r1, .35, false); ring(R + 1, r2, Math.PI / 2 - .2, false);
  const gg = ctx.createRadialGradient(-1.5, cy - 1.8, .3, 0, cy, R); gg.addColorStop(0, PAL.coreHot); gg.addColorStop(.55, PAL.core); gg.addColorStop(1, PAL.coreCool);
  ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(0, cy, R, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.ellipse(-2, cy - 2.2, 1.4, .75, -.6, 0, TAU); ctx.fill();
  ring(R + 1.8, r1, .35, true); ring(R + 1, r2, Math.PI / 2 - .2, true);
  // forks: carriage on the column front, two tines (folded up when forkOut = 0)
  const fy = -mix(1.4, 30, clamp(o.fork ?? 0)), fo = clamp(o.forkOut ?? 1), tl = 17, ta = -Math.PI / 2 * (1 - eio(fo));
  ctx.fillStyle = brass(ctx, 0, fy - 5, 0, fy + 1); ctx.fillRect(1, fy - 5, 3, 6);
  ctx.save(); ctx.translate(3.6, fy); ctx.rotate(ta);
  ctx.fillStyle = rgba(PAL.brassDark, .9); ctx.beginPath(); ctx.moveTo(0, -1.2); ctx.lineTo(tl, -.6); ctx.lineTo(tl + .7, 0); ctx.lineTo(0, .3); ctx.closePath(); ctx.fill();
  ctx.fillStyle = brass(ctx, 0, -1, 0, 1); ctx.beginPath(); ctx.moveTo(0, -.7); ctx.lineTo(tl, -.1); ctx.lineTo(tl + .9, .5); ctx.lineTo(0, .9); ctx.closePath(); ctx.fill();
  if (o.load) o.load(ctx, tl * .55, -1.1, ta);
  ctx.restore();
  out.fork = [3.6 + Math.cos(ta) * tl * .55, fy + Math.sin(ta) * tl * .55];
  // the arm: shoulder under the core, two segments, a hand of light
  const sx = 1.6, sy = -22, a = 19, b = 19, armOut = clamp(o.armOut ?? 0);
  const fold = [sx + 9, sy + 13], tgt = o.reach ? [mix(fold[0], o.reach[0], eio(armOut)), mix(fold[1], o.reach[1], eio(armOut))] : fold;
  const J = K.ik2(sx, sy, a, b, tgt[0], tgt[1], -1);
  ctx.lineCap = 'round';
  ctx.strokeStyle = PAL.brassDark; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(J.ex, J.ey); ctx.lineTo(J.hx, J.hy); ctx.stroke();
  ctx.strokeStyle = PAL.brass; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(J.ex, J.ey); ctx.lineTo(J.hx, J.hy); ctx.stroke();
  for (const [x, y, r] of [[sx, sy, 1.8], [J.ex, J.ey, 1.5]]) { ctx.fillStyle = brass(ctx, x - r, y - r, x + r, y + r); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  out.hand = [J.hx, J.hy]; out.handAng = Math.atan2(J.hy - J.ey, J.hx - J.ex); out.handO = { a: core * (.45 + .55 * armOut), open: armOut, s: .34 };
  return out;
}

// ---------------------------------------------------------------- the switch box LEARN, cm units (origin: bottom centre; 18 × 7 cm)
export function leverBox(ctx, t, o = {}) {
  const on = clamp(o.on ?? 0), w = 18, h = 7;
  ctx.fillStyle = 'rgba(60,36,20,.3)'; ctx.fillRect(-w / 2 + .6, -.4, w, 1);
  ctx.fillStyle = '#6a4630'; ctx.fillRect(-w / 2, -h, w, h);                       // walnut body
  ctx.fillStyle = '#8a5d3c'; ctx.fillRect(-w / 2, -h, w, 1.1);
  ctx.fillStyle = brass(ctx, -w / 2 + 1.2, -h + 1.8, w / 2 - 1.2, -1); ctx.fillRect(-w / 2 + 1.4, -h + 2, w - 2.8, h - 3.1);   // the plate
  ctx.fillStyle = '#3a2614'; ctx.font = '700 3.3px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('L E A R N', 0, -h / 2 + .5);
  // the indicator: a warm bead that lights when on
  const gx = w / 2 - 2.1, gy = -h + 1.1;
  if (on > .5) { const gw = ctx.createRadialGradient(gx, gy - .8, 0, gx, gy - .8, 4); gw.addColorStop(0, rgba(PAL.effort, .8)); gw.addColorStop(1, rgba(PAL.effort, 0)); ctx.fillStyle = gw; ctx.beginPath(); ctx.arc(gx, gy - .8, 4, 0, TAU); ctx.fill(); }
  ctx.fillStyle = on > .5 ? PAL.effortHot : '#5a4a3a'; ctx.beginPath(); ctx.arc(gx, gy - .6, .9, 0, TAU); ctx.fill();
  // the lever: pivot on the top, tilted left (off) or right (on)
  const ang = mix(-.75, .75, eio(on)), L = 8.5, px = -1.5, py = -h;
  ctx.fillStyle = brass(ctx, px - 2, py - 1.5, px + 2, py); ctx.beginPath(); ctx.ellipse(px, py, 2.4, 1.1, 0, Math.PI, 0); ctx.fill();
  const ex = px + Math.sin(ang) * L, ey = py - Math.cos(ang) * L;
  ctx.lineCap = 'round'; ctx.strokeStyle = PAL.brassDark; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(ex, ey); ctx.stroke();
  ctx.strokeStyle = PAL.brassLit; ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(px - .3, py); ctx.lineTo(ex - .3, ey); ctx.stroke();
  ctx.fillStyle = brass(ctx, ex - 1.4, ey - 1.4, ex + 1.4, ey + 1.4); ctx.beginPath(); ctx.arc(ex, ey, 1.4, 0, TAU); ctx.fill();
}

// ---------------------------------------------------------------- a window of the city: a desk, a person at it, the desk machine
const LEANBACK = X.LEANBACK, LEANIN = X.LEANIN;
const mixPose = (a, b, u) => {
  const o = {};
  for (const k of ['hip', 'kn', 'sh', 'el']) o[k] = [mix(a[k][0], b[k][0], u), mix(a[k][1], b[k][1], u)];
  o.lean = mix(a.lean, b.lean, u); o.head = mix(a.head, b.head, u); o.hands = u > .5 ? b.hands : a.hands;
  return o;
};
// the four steps of the change after the lever: forks down, forks fold, the person leans in, the hand reaches
export function changeState(t, t0) {
  return { on: eio(lin(t0, t0 + .35, t)), down: eio(lin(t0 + .2, t0 + .7, t)), fold: eio(lin(t0 + .7, t0 + 1.2, t)), lean: eio(lin(t0 + .7, t0 + 1.6, t)), reach: eio(lin(t0 + 1.1, t0 + 1.9, t)) };
}
export function deskWindow(ctx, t, V, w, st) {
  const F = C.winFrame(V, w, .05); if (!F) return false;
  const ppm = Math.hypot(F.c, F.d); if (!(ppm > 1 && ppm < 1400)) return false;
  const at = (u, v) => [F.e + F.a * u + F.c * v, F.f + F.b * u + F.d * v];
  const ww = w.w, wh = w.y1 - w.y0, seed = Math.floor(w.seed * 997), glow = st.glow ?? 1;
  // the room: warm back wall (lamp falloff), a picture, the floor line hidden below the sill
  const A = at(0, wh + .2), B = at(ww, -.4);
  ctx.fillStyle = ['#e2b985', '#dcae7c', '#e6c08e', '#d6a676'][seed % 4]; ctx.fillRect(Math.min(A[0], B[0]) - 4, Math.min(A[1], B[1]) - 4, Math.abs(B[0] - A[0]) + 8, Math.abs(B[1] - A[1]) + 8);
  const n = Math.max(1, Math.round(ww / 1.15)), cw = ww / n;
  for (let k = 0; k < n; k++) {
    const u0 = k * cw, sd = seed + k * 13, kid = (st.kid ?? 1) && (sd % 5 !== 0);
    const U = (u) => u0 + u * cw / 1.15;   // local layout in a 1.15 m cell
    // the lamp: a pendant above the desk, its warm pool
    const lp = at(U(.66), wh - .38), R = ppm * .95;
    const g = C.rgrad(ctx, lp[0], lp[1] + ppm * .1, 0, R); g.addColorStop(0, rgba('#fff3d6', .7 * glow)); g.addColorStop(1, rgba('#ffd9a0', 0)); ctx.fillStyle = g; ctx.fillRect(lp[0] - R, lp[1] - R, 2 * R, 2 * R + ppm * .2);
    const cordTop = at(U(.66), wh + .3); ctx.strokeStyle = '#4a3424'; ctx.lineWidth = Math.max(1, ppm * .006); ctx.beginPath(); ctx.moveTo(cordTop[0], cordTop[1]); ctx.lineTo(lp[0], lp[1]); ctx.stroke();
    const sh = ppm * .11; ctx.fillStyle = '#7a5a3a'; ctx.beginPath(); ctx.moveTo(lp[0] - sh * .35, lp[1]); ctx.lineTo(lp[0] + sh * .35, lp[1]); ctx.lineTo(lp[0] + sh, lp[1] + sh * .7); ctx.lineTo(lp[0] - sh, lp[1] + sh * .7); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff4dc'; ctx.beginPath(); ctx.ellipse(lp[0], lp[1] + sh * .7, sh, sh * .16, 0, 0, TAU); ctx.fill();
    // a small framed picture on the back wall
    if (sd % 3 === 0) { const p0 = at(U(.12), wh - .5), p1 = at(U(.3), wh - .74); ctx.fillStyle = '#8a6a4a'; ctx.fillRect(p0[0], p0[1], p1[0] - p0[0], p1[1] - p0[1]); ctx.fillStyle = ['#9fb3a0', '#c9a27c', '#a6b8c8'][sd % 3]; ctx.fillRect(p0[0] + ppm * .015, p0[1] + ppm * .015, p1[0] - p0[0] - ppm * .03, p1[1] - p0[1] - ppm * .03); }
    // the desk (seen from the side, a little from above): top + front
    const dv = .08, d0 = at(U(.44), dv), d1 = at(U(1.15), dv);
    ctx.fillStyle = '#c99a66'; ctx.fillRect(d0[0], d0[1] - ppm * .035, d1[0] - d0[0], ppm * .035);
    const deskBody = () => { const e0 = at(U(.36), dv); ctx.fillStyle = '#9a6b45'; ctx.fillRect(e0[0], d0[1], d1[0] - e0[0], ppm * .05); ctx.fillStyle = '#7a5236'; ctx.fillRect(e0[0], d0[1] + ppm * .05, d1[0] - e0[0], ppm * .4); };
    // the change (st.t0 = the moment its lever flips; Infinity = not yet)
    const cs = changeState(t, st.t0 ?? Infinity);
    // the person: a child (smaller) or a grown-up at the desk, seated, facing the machine (screen right)
    const s = ppm * 1.75 / 185 * (kid ? .74 : .95), Cp = at(U(.3), -.62), hipY = Cp[1] - 46 * s;
    const dress = DRESSES[sd % DRESSES.length];
    const breathe = .02 * Math.sin(t * 1.3 + sd);
    const pose = mixPose({ ...LEANBACK, head: LEANBACK.head + breathe }, { ...LEANIN, head: LEANIN.head + .05 * Math.sin(t * 2.2 + sd) }, cs.lean);
    // the machine on the desk, facing the person (flipped)
    const Mp = at(U(.88), dv), km = ppm / 100;
    const hnd = K.athlete(ctx, Cp[0], hipY, s, { ...pose, hair: ['short', 'long', 'curly', 'bun'][sd % 4] }, { t, seed: sd, dress, arm: .9, rimW: Math.max(1, .6 * s) });
    deskBody();
    const hand = hnd.hand(0);
    const toL = (p) => [-(p[0] - Mp[0]) / km, (p[1] - Mp[1]) / km];
    // the notebook: on the forks (forklift: the machine does the homework, a cool scan on the page) or on the desk (trainer)
    const forkH = mix(.42, 0, cs.down), forkOut = 1 - cs.fold;
    const reachL = toL([hand[0] + ppm * .035, hand[1] - ppm * .045]);
    ctx.save(); ctx.translate(Mp[0], Mp[1]); ctx.scale(-km, km);
    const mo = mini(ctx, t, {
      fork: forkH, forkOut, armOut: cs.reach, reach: reachL, seed: sd,
      load: (c, x, y, ang) => {
        if (cs.down > .99) return;
        c.fillStyle = '#f3ead8'; c.fillRect(x - 7, y - 1.6, 14, 1.6); c.fillStyle = '#b9a98c'; c.fillRect(x - 7, y - .5, 14, .5);
        if (cs.down < .5) { const gl = c.createRadialGradient(x, y - 1, 0, x, y - 1, 9); gl.addColorStop(0, rgba('#cfe6f2', .55)); gl.addColorStop(1, rgba('#cfe6f2', 0)); c.fillStyle = gl; c.fillRect(x - 9, y - 10, 18, 11); }
      },
    });
    ctx.restore();
    // the notebook left on the desk after the forks fold (it stays where the tines set it down)
    if (cs.down > .99) { const nb = Mp[0] - km * (3.6 + 17 * .55), y = Mp[1] - km * 1.4 - km * 1.1; ctx.fillStyle = '#f3ead8'; ctx.fillRect(nb - 7 * km, y - .7 * km, 14 * km, 1.6 * km); }
    if (st.lever) { ctx.save(); const L = at(U(1.03), dv + .002); ctx.translate(L[0], L[1] - ppm * .035); ctx.scale(km, km); leverBox(ctx, t, { on: cs.on }); ctx.restore(); }
    if (cs.reach > .02) { const hp = [Mp[0] - mo.hand[0] * km, Mp[1] + mo.hand[1] * km]; K.lightHand(ctx, t, hp[0], hp[1], Math.PI - mo.handAng, { ...mo.handO, s: mo.handO.s * km }); }
    // a pencil in the writing hand once the person leans in
    if (cs.lean > .5) { ctx.strokeStyle = '#d9a440'; ctx.lineWidth = Math.max(1, ppm * .008); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(hand[0], hand[1]); ctx.lineTo(hand[0] + ppm * .05, hand[1] + ppm * .04); ctx.stroke(); }
  }
  // the evening glass: a faint warm reflection over everything (lighter at the top)
  const T0 = at(0, wh), T1 = at(0, 0), gq = C.lgrad(ctx, T0[0], T0[1], T1[0], T1[1]); gq.addColorStop(0, 'rgba(255,240,220,.05)'); gq.addColorStop(1, 'rgba(255,240,220,0)');
  ctx.fillStyle = gq; const A2 = at(0, wh + .2), B2 = at(ww, -.4); ctx.fillRect(Math.min(A2[0], B2[0]) - 4, Math.min(A2[1], B2[1]) - 4, Math.abs(B2[0] - A2[0]) + 8, Math.abs(B2[1] - A2[1]) + 8);
  return true;
}

// ---------------------------------------------------------------- the flight simulator (by a window): seat, console, brass yoke
// o: { p: [x, 0, z] the pilot's seat (the pilot faces −x, toward the window), bank(t) radians of the yoke }
export function simulator(ctx, t, V, o) {
  const [x, , z] = o.p, cam = V.cam;
  const box = (x0, x1, z0, z1, y0, y1, top, front, side) => X.box3(ctx, V, x0, x1, z0, z1, y1 - y0, { y0, top, front, side, noShadow: y0 > .01 });
  K.floorShadow(ctx, V, [x - .6, 0, z], 1.1, .7, .22);
  box(x - 1.55, x + .45, z - .8, z + .8, 0, .1, '#a07650', '#7d5a3c', '#6a4a30');                     // the platform
  // the console (in front of the pilot, toward the window), its face toward the pilot (+x) with dials
  box(x - 1.45, x - 1.05, z - .62, z + .62, .1, 1.02, '#5a4a3c', '#4a3a2e', '#3e3026');
  const face = [[x - 1.05, 1.0, z - .58], [x - 1.05, 1.0, z + .58], [x - 1.05, .5, z + .58], [x - 1.05, .5, z - .58]];
  if (cam.x > x - 1.05 && V.poly(ctx, face)) { ctx.fillStyle = '#2f2822'; ctx.fill(); }
  if (cam.x > x - 1.05) {
    for (let i = 0; i < 5; i++) {
      const zz = z - .45 + i * .225, yy = i % 2 ? .82 : .66, c = V.P([x - 1.055, yy, zz]); if (!(c.z > .2)) continue;
      const r = Math.max(1.5, c.k * .06);
      ctx.fillStyle = '#f2e6cc'; ctx.beginPath(); ctx.ellipse(c.x, c.y, r * .75, r, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = PAL.brass; ctx.lineWidth = Math.max(.8, r * .18); ctx.stroke();
      const a = (i * 1.3 + Math.sin(t * .5 + i) * .25) + (o.bank ? o.bank(t) * (i === 2 ? 3 : 0) : 0);
      ctx.strokeStyle = '#3a2614'; ctx.lineWidth = Math.max(.6, r * .12); ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(c.x + Math.sin(a) * r * .55, c.y - Math.cos(a) * r * .7); ctx.stroke();
    }
  }
  // the seat (behind the pilot)
  box(x - .2, x + .25, z - .24, z + .24, .1, .52, '#7a4a32', '#64402c', '#583826');
  box(x + .17, x + .27, z - .24, z + .24, .52, 1.25, '#7a4a32', '#64402c', '#583826');
  // the yoke column (console → the pilot's hands): drawn after the pilot (see scene)
  return { hands: [x - .68, .98, z], column: [x - 1.05, .86, z] };
}
export function yoke(ctx, t, V, at, col, bank, flip) {
  const A = V.P(col), B = V.P(at); if (!(A.z > .2 && B.z > .2)) return;
  const k = B.k;
  ctx.lineCap = 'round'; ctx.strokeStyle = PAL.brassDark; ctx.lineWidth = Math.max(2, k * .045); ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
  ctx.strokeStyle = PAL.brass; ctx.lineWidth = Math.max(1.4, k * .03); ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
  // the wheel: two horns (seen nearly edge-on from the side: a short bar that tilts with the bank)
  ctx.save(); ctx.translate(B.x, B.y); ctx.rotate(bank * (flip ? -1 : 1));
  const r = k * .17;
  ctx.strokeStyle = PAL.brassDark; ctx.lineWidth = Math.max(2, k * .04); ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(0, r); ctx.stroke();
  ctx.strokeStyle = brass(ctx, -r, -r, r, r); ctx.lineWidth = Math.max(1.4, k * .028); ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(0, r); ctx.stroke();
  for (const s of [-1, 1]) { ctx.fillStyle = '#3a2a20'; ctx.beginPath(); ctx.ellipse(0, s * r, k * .03, k * .055, 0, 0, TAU); ctx.fill(); }
  ctx.fillStyle = PAL.brassLit; ctx.beginPath(); ctx.arc(0, 0, Math.max(1.5, k * .03), 0, TAU); ctx.fill();
  ctx.restore();
}

// ---------------------------------------------------------------- the light box: an exam image the doctor reads herself
// o: { c: [x, y, z] centre, n: [nx, nz] its normal (toward the viewer), w, h, u (0…1: her chalk ring round what she found) }
export function lightbox(ctx, t, V, o) {
  const [x, y, z] = o.c, [nx, nz] = o.n, rx = -nz, rz = nx, w = o.w ?? .9, h = o.h ?? .7;
  const P = (a, b, d = 0) => [x + rx * a + nx * d, y + b, z + rz * a + nz * d];
  // the easel legs
  ctx.strokeStyle = '#6a4630'; ctx.lineCap = 'round';
  const kk = V.P([x, y, z]).k || 1; ctx.lineWidth = Math.max(1, kk * .03); ctx.beginPath();
  V.seg(ctx, P(-w * .42, -y, .08), P(-w * .36, 0, .02)); V.seg(ctx, P(w * .42, -y, .08), P(w * .36, 0, .02)); V.seg(ctx, P(0, -y, -.35), P(0, h * .4, -.02));
  ctx.stroke();
  // the frame + the glowing panel
  const fr = [P(-w / 2 - .04, h / 2 + .04), P(w / 2 + .04, h / 2 + .04), P(w / 2 + .04, -h / 2 - .04), P(-w / 2 - .04, -h / 2 - .04)];
  if (V.poly(ctx, fr)) { ctx.fillStyle = '#4a3a2e'; ctx.fill(); }
  const pn = [P(-w / 2, h / 2, .005), P(w / 2, h / 2, .005), P(w / 2, -h / 2, .005), P(-w / 2, -h / 2, .005)];
  const S = V.poly(ctx, pn); if (!S) return;
  ctx.fillStyle = '#f4f2ea'; ctx.fill();
  // affine frame on the panel: local cm, origin top-left
  const o0 = V.P(pn[0]), ou = V.P(P(-w / 2 + .01, h / 2, .005)), ov = V.P(P(-w / 2, h / 2 - .01, .005));
  if (!(o0.z > .1 && ou.z > .1 && ov.z > .1)) return;
  ctx.save(); V.poly(ctx, pn); ctx.clip(); ctx.transform(ou.x - o0.x, ou.y - o0.y, ov.x - o0.x, ov.y - o0.y, o0.x, o0.y);
  const cxp = w * 50, cyp = h * 50, R = Math.min(w, h) * 42;
  ctx.fillStyle = '#1e1a18'; ctx.fillRect(0, 0, w * 100, h * 100);
  const g = ctx.createRadialGradient(cxp - R * .2, cyp - R * .25, R * .1, cxp, cyp, R); g.addColorStop(0, '#f2c2b0'); g.addColorStop(.55, '#d98a7c'); g.addColorStop(1, '#6e3430');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cxp, cyp, R, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(120,50,45,.45)'; ctx.lineWidth = 1.6;
  for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.ellipse(cxp + 3, cyp + 2, R * (.25 + k * .17), R * (.18 + k * .14), .3, 0, TAU); ctx.stroke(); }
  // the small bump (what a trained eye finds) and her warm ring round it
  const bx = cxp + R * .38, by = cyp - R * .22;
  ctx.fillStyle = '#e7a08e'; ctx.beginPath(); ctx.ellipse(bx, by, 4.2, 3.4, .4, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,240,230,.6)'; ctx.beginPath(); ctx.ellipse(bx - 1.2, by - 1.2, 1.4, .9, .4, 0, TAU); ctx.fill();
  const u = clamp(o.u ?? 0);
  if (u > 0) { ctx.strokeStyle = PAL.effortHot; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(bx, by, 8.5, -1.2, -1.2 + TAU * u * .97); ctx.stroke(); }
  ctx.restore();
  // the panel's light on its surroundings
  const c = V.P([x + nx * .1, y, z + nz * .1]); if (c.z > .2) { const R2 = c.k * .9, gl = C.rgrad(ctx, c.x, c.y, 0, R2); gl.addColorStop(0, rgba('#fff8ea', .22)); gl.addColorStop(1, rgba('#fff8ea', 0)); ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = gl; ctx.fillRect(c.x - R2, c.y - R2, 2 * R2, 2 * R2); ctx.restore(); }
  return { bump: (() => { const a = (bx / 100) - w / 2, b = h / 2 - by / 100; return V.P(P(a, b, .01)); })() };
}
