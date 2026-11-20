// Film 8 · c09 local sea pieces (B3). World = metres through the s8 camera (+Y up, sea Y = 0); screen = 1920 × 1080.
//   rope(ctx, t, C, a, b, o)          a three-strand rope between two world points: o.fray 0..1 (cut in the middle, the strands splay into
//                                     fibres), o.splice 0..1 (the ends come together and the strands twist back into one, a thicker splice),
//                                     o.r .025 (m), o.sag .12 (m), o.lamp [sx, sy] (the lit side)
//   lantern(ctx, t, C, X, Y, Z, o)    a hanging storm lantern (cage, glass, flame) → screen point of the flame | null; o: { s .26 (m), a 1 }
//   iris(ctx, t, p, R, o)             a light that fills the frame from a point: the handoff4 light plate clipped to a disc of radius R at p,
//                                     with its warm rim. o.tone 'lamp' | 'fire'. Draw it last (R ≥ 2210 covers the frame from anywhere)
//   coolFill(ctx, t, o)               the cool white-blue glow of a lit screen filling the frame (the ping / laptop carrier); o.rect clips it
//   searchShip(ctx, t, C, S)          the loudest boat: a big dark ship (s8_storms.bigShip) with a blinding searchlight and a blaring horn.
//                                     S: { x, z, head, L, beam (yaw of the beam, world), glare 0..1, horn 0..1 } → { lamp: [sx, sy] | null }
//   headlines(ctx, t, C, o)           a squall of headline sheets (bold unreadable type) whipping across: o: { u (s since the gust), n 26, x0, z0,
//                                     y0, wind [dx, dz] m/s, lamp [sx, sy] } (each sheet tumbles, its back is blank paper)
//   headlineTex()                     the cached headline sheet texture (bold black bars, grey text rows) for one caught sheet
import { rgba, clamp, prng } from '../engine.mjs';
import { TAU, projPoly, fillPoly, mixHex, hash, eoX, sio, u01 } from './s8_kit.mjs';
import { plate } from './handoff4.mjs';
import { bigShip } from './s8_storms.mjs';
import { layer } from './art.mjs';

// ---------------------------------------------------------------- the rope
export function rope(ctx, t, C, a, b, o = {}) {
  const r = o.r ?? .025, sag = o.sag ?? .12, fray = clamp(o.fray ?? 0), spl = clamp(o.splice ?? 0), broken = fray * (1 - spl);
  const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]), twist = L / .09;   // one turn per 9 cm
  const ax = (v) => [a[0] + (b[0] - a[0]) * v, a[1] + (b[1] - a[1]) * v - sag * 4 * v * (1 - v) * (1 - .25 * broken), a[2] + (b[2] - a[2]) * v];
  const N = Math.max(60, Math.min(260, Math.round(L * 120)));
  const P = []; for (let i = 0; i <= N; i++) { const v = i / N, p = C.P(...ax(v), .05); P.push(p ? [p[0], p[1], p[2], v] : null); }
  // gap: the two ends pull apart as it frays and come back as it is spliced
  const gh = .07 * broken + .004 * fray * (1 - spl > 0 ? 1 : 0);
  const lamp = o.lamp, strands = [];
  for (let k = 0; k < 3; k++) {
    const seg = [];
    for (let i = 0; i <= N; i++) {
      const p = P[i]; if (!p) { seg.push(null); continue; }
      const v = p[3], dv = v - .5, ad = Math.abs(dv);
      if (broken > .01 && ad < gh) { seg.push(null); continue; }
      const prev = P[Math.max(0, i - 1)] || p, next = P[Math.min(N, i + 1)] || p, tx = next[0] - prev[0], ty = next[1] - prev[1], tl = Math.hypot(tx, ty) || 1, nx = -ty / tl, ny = tx / tl;
      const sp = broken * Math.exp(-(ad - gh) / .05), bulge = spl * fray * .45 * Math.exp(-((dv / .07) ** 2));   // splay near the cut, bulge of the splice
      const tw = twist * (1 - .8 * sp) * (1 + .6 * bulge);
      const ph = k / 3 * TAU + v * tw * TAU / 10 + (sp > 0 ? Math.sign(dv) * sp * (k - 1) * 1.2 : 0);
      const rr = r * p[2] * (1 + bulge) * (1 + 3.2 * sp * (.6 + .4 * hash(k * 7.1)));
      const off = Math.sin(ph) * rr * .62, depth = Math.cos(ph);
      seg.push([p[0] + nx * off + nx * sp * (k - 1) * r * p[2] * 2.2, p[1] + ny * off + ny * sp * (k - 1) * r * p[2] * 2.2 + sp * r * p[2] * .8, depth, rr, sp]);
    }
    strands.push(seg);
  }
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // under-shadow (the rope's dark body), then the back halves of the strands, then the front halves (lit on the lamp side)
  for (const pass of [0, 1, 2]) {
    for (let k = 0; k < 3; k++) {
      const s = strands[k];
      for (let i = 1; i < s.length; i++) {
        const p = s[i - 1], q = s[i]; if (!p || !q) continue;
        const front = (p[2] + q[2]) / 2;
        if (pass === 1 && front > 0) continue; if (pass === 2 && front <= 0) continue;
        const w = Math.max(1.2, p[3] * (pass === 0 ? 1.15 : .78));
        let col;
        if (pass === 0) col = '#0c0806';
        else { const lit = clamp(.35 + .45 * front + (lamp ? .15 * Math.sign(lamp[1] - p[1]) * -1 : 0)); col = mixHex('#3a2616', '#e0b884', lit); }
        ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
      }
    }
  }
  // fibres at the cut: thin hairs fanning out of each strand end
  if (broken > .02) {
    for (let k = 0; k < 3; k++) for (const side of [-1, 1]) {
      const s = strands[k]; let e = null;
      if (side < 0) { for (let i = 0; i < s.length; i++) if (s[i] && (!s[i + 1])) { e = s[i]; break; } }
      else { for (let i = s.length - 1; i > 0; i--) if (s[i] && !s[i - 1]) { e = s[i]; break; } }
      if (!e) continue;
      for (let f = 0; f < 9; f++) {
        const h = hash(k * 31 + f * 7 + (side > 0 ? 3 : 0)), ang = (side > 0 ? 0 : Math.PI) + (h - .5) * 2.2 + .2 * Math.sin(t * 1.3 + f), len = e[3] * (1.6 + 2.6 * hash(f * 13 + k)) * broken;
        ctx.strokeStyle = rgba(mixHex('#6a4a2a', '#e8c898', .3 + .5 * hash(f + k * 3)), .8); ctx.lineWidth = Math.max(.6, e[3] * .12);
        ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.quadraticCurveTo(e[0] + Math.cos(ang) * len * .5, e[1] + Math.sin(ang) * len * .5 + len * .15, e[0] + Math.cos(ang) * len, e[1] + Math.sin(ang) * len + len * .3); ctx.stroke();
      }
    }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- a hanging storm lantern
export function lantern(ctx, t, C, X, Y, Z, o = {}) {
  const s = o.s ?? .26, a = o.a ?? 1, p = C.P(X, Y, Z, .05); if (!p) return null;
  const k = p[2] * s, fl = 1 + .05 * Math.sin(t * 9.3 + X) + .03 * Math.sin(t * 21.7);
  if (k > 4000) return [p[0], p[1]];
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // the warm halo behind
  ctx.globalCompositeOperation = 'lighter';
  { const R = k * 3.2 * fl, g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], R); g.addColorStop(0, rgba('#ffcf8a', .5 * a)); g.addColorStop(.25, rgba('#ff9a4a', .18 * a)); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], R, 0, TAU); ctx.fill(); }
  ctx.globalCompositeOperation = 'source-over';
  // the glass (a warm lit chimney), the flame
  const gw = k * .3, gh = k * .5;
  { const g = ctx.createRadialGradient(p[0], p[1] + gh * .1, 0, p[0], p[1], gh * .9); g.addColorStop(0, rgba('#fff6e2', a)); g.addColorStop(.35, rgba('#ffcf8a', .95 * a)); g.addColorStop(1, rgba('#c4642a', .85 * a)); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(p[0], p[1], gw, gh * .55, 0, 0, TAU); ctx.fill(); }
  ctx.fillStyle = rgba('#fffaf0', a); ctx.beginPath(); ctx.ellipse(p[0], p[1] + gh * .08, gw * .16 * fl, gh * .2 * fl, 0, 0, TAU); ctx.fill();
  // the cage: top cap, base, bars, the bail handle
  ctx.strokeStyle = '#120a06'; ctx.fillStyle = '#1a0f08'; ctx.lineWidth = Math.max(1, k * .035);
  ctx.beginPath(); ctx.ellipse(p[0], p[1] - gh * .55, gw * 1.05, gh * .1, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(p[0] - gw * .5, p[1] - gh * .62); ctx.lineTo(p[0], p[1] - gh * .85); ctx.lineTo(p[0] + gw * .5, p[1] - gh * .62); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.ellipse(p[0], p[1] + gh * .58, gw * 1.1, gh * .12, 0, 0, TAU); ctx.fill();
  for (const dx of [-.9, -.3, .3, .9]) { ctx.beginPath(); ctx.moveTo(p[0] + dx * gw, p[1] - gh * .5); ctx.quadraticCurveTo(p[0] + dx * gw * 1.12, p[1], p[0] + dx * gw, p[1] + gh * .52); ctx.stroke(); }
  ctx.beginPath(); ctx.arc(p[0], p[1] - gh * .85, gw * .55, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
  // a rim of light on the cage's lit edge
  ctx.strokeStyle = rgba('#ffd9a0', .55 * a); ctx.lineWidth = Math.max(.8, k * .015); ctx.beginPath(); ctx.ellipse(p[0], p[1] + gh * .58, gw * 1.1, gh * .12, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  ctx.restore();
  return [p[0], p[1]];
}

// ---------------------------------------------------------------- carriers
export function iris(ctx, t, p, R, o = {}) {
  if (!p || R <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.save(); ctx.beginPath(); ctx.arc(p[0], p[1], R, 0, TAU); ctx.clip(); plate(ctx, t, 'light', { tone: o.tone || 'lamp' }); ctx.restore();
  if (R < 2300) {   // a warm halo round the disc's edge only (transparent inside: no wash over the plate)
    const R1 = R * 1.3 + 40, k0 = R * .92 / R1;
    ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], R1);
    g.addColorStop(0, rgba('#ffc890', 0)); g.addColorStop(Math.max(0, k0 - .04), rgba('#ffc890', 0)); g.addColorStop(k0, rgba('#ffc890', .45)); g.addColorStop(1, rgba('#ff8a3a', 0));
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
  }
  ctx.restore();
}
export function coolFill(ctx, t, o = {}) {
  ctx.save(); if (!o.local) ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (o.rect) { ctx.beginPath(); ctx.rect(...o.rect); ctx.clip(); }
  const br = 1 + .02 * Math.sin(t * 2.3), g = ctx.createRadialGradient(960, 520, 0, 960, 520, 1250 * br);
  g.addColorStop(0, '#f2fbff'); g.addColorStop(.45, '#bfe6ff'); g.addColorStop(1, '#5a86b8');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
  // fine scan rows (a lit screen), drifting
  ctx.fillStyle = 'rgba(40,80,130,.06)'; for (let y = (t * 20) % 6; y < 1080; y += 6) ctx.fillRect(0, y, 1920, 2);
  ctx.restore();
}
// a cool disc that fills the frame from a point (the ping → the lit screen)
export function coolIris(ctx, t, p, R) {
  if (!p || R <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.arc(p[0], p[1], R, 0, TAU); ctx.clip(); coolFill(ctx, t); ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(p[0], p[1], R * .9, p[0], p[1], R * 1.3 + 30); g.addColorStop(0, rgba('#bfe6ff', .5)); g.addColorStop(1, rgba('#8fe6ff', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); ctx.restore();
}

// ---------------------------------------------------------------- the loudest boat: searchlight and horn
export function searchShip(ctx, t, C, S) {
  const r = bigShip(ctx, t, C, { x: S.x, z: S.z, head: S.head, L: S.L ?? 46, glow: 0 });
  const L = S.L ?? 46, h = S.head, fx = Math.sin(h), fz = Math.cos(h);
  const src = [S.x - fx * L * .38, L * .12 + L * .16, S.z - fz * L * .38];   // on the bridge roof
  const sp = C.P(...src); const out = { lamp: sp ? [sp[0], sp[1]] : null };
  const gl = clamp(S.glare ?? 1);
  if (!sp || gl <= 0) return out;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  // the beam: a long cone over the water toward S.beam
  const bx = Math.sin(S.beam), bz = Math.cos(S.beam), len = 260, w = 28;
  const e1 = C.P(src[0] + bx * len - bz * w, 0, src[2] + bz * len + bx * w, .5), e2 = C.P(src[0] + bx * len + bz * w, 0, src[2] + bz * len - bx * w, .5);
  if (e1 && e2) {
    const g = ctx.createLinearGradient(sp[0], sp[1], (e1[0] + e2[0]) / 2, (e1[1] + e2[1]) / 2); g.addColorStop(0, rgba('#f4fbff', .55 * gl)); g.addColorStop(.5, rgba('#cfe6ff', .18 * gl)); g.addColorStop(1, rgba('#cfe6ff', 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(sp[0], sp[1]); ctx.lineTo(e1[0], e1[1]); ctx.lineTo(e2[0], e2[1]); ctx.closePath(); ctx.fill();
  }
  // the glare: blinding when the beam swings at the camera
  const toCam = Math.atan2(C.x - src[0], C.z - src[2]), d = Math.abs(((S.beam - toCam + Math.PI) % TAU + TAU) % TAU - Math.PI), at = clamp(1 - d / .6);
  const R = (60 + 900 * at * at) * gl * (1 + .04 * Math.sin(t * 13));
  const g = ctx.createRadialGradient(sp[0], sp[1], 0, sp[0], sp[1], R); g.addColorStop(0, rgba('#ffffff', 1)); g.addColorStop(.12, rgba('#eaf6ff', .85 * gl)); g.addColorStop(.4, rgba('#9fc8ff', .25 * gl)); g.addColorStop(1, rgba('#6a90d0', 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sp[0], sp[1], R, 0, TAU); ctx.fill();
  // the horn: hard rings blaring out from the bow mast, one every .45 s while it sounds
  const hn = clamp(S.horn ?? 0);
  if (hn > 0) {
    const hp = C.P(S.x + fx * L * .25, L * .3, S.z + fz * L * .25);
    if (hp) for (let k = 0; k < 4; k++) { const ph = ((t / .45) + k / 4) % 1, rr = 20 + ph * 420 * hp[2] / 30; ctx.strokeStyle = rgba('#dfe8ff', .5 * hn * (1 - ph)); ctx.lineWidth = 3 * (1 - ph) + 1; ctx.beginPath(); ctx.arc(hp[0], hp[1], rr, -2.6, -.5); ctx.stroke(); ctx.beginPath(); ctx.arc(hp[0], hp[1], rr, .5 - Math.PI * 0 - 0, .5); ctx.stroke(); }
  }
  ctx.restore();
  return out;
}

// ---------------------------------------------------------------- headline sheets
const HTEX = { c: null };
export function headlineTex() {
  if (HTEX.c) return HTEX.c;
  const [c, g] = layer(300, 400), r = prng(5150);
  g.fillStyle = '#efe6d0'; g.fillRect(0, 0, 300, 400);
  g.fillStyle = '#0c0a0a';
  // masthead rule, two bold headline bars (unreadable), a photo block, columns of grey rows
  g.fillRect(18, 16, 264, 6);
  for (const [y, w, h] of [[36, 250, 34], [78, 200, 34], [122, 150, 16]]) g.fillRect(22, y, w + (r() - .5) * 20, h);
  g.fillStyle = '#3a3634'; g.fillRect(22, 152, 130, 90);
  g.fillStyle = 'rgba(40,36,34,.55)';
  for (let col = 0; col < 2; col++) for (let y = 0; y < 14; y++) { const x0 = col ? 162 : 22, yy = col ? 152 + y * 12 : 252 + y * 10; if (yy > 380) continue; g.fillRect(x0, yy, (col ? 116 : 130) * (.7 + .3 * r()), 4); }
  for (let y = 0; y < 8; y++) g.fillRect(162, 330 + y * 7, 110 * (.6 + .4 * r()), 3);
  HTEX.c = c; return c;
}
const SHEETS = (() => { const r = prng(8080), a = []; for (let i = 0; i < 40; i++) a.push({ d: r() * 1.4, dx: (r() - .5) * 10, dz: (r() - .5) * 8, y: .6 + r() * 3.2, sp: .8 + r() * .6, ax: r() * TAU, ay: r() * TAU, wx: 2 + r() * 4, wy: 1.5 + r() * 3, s: .8 + r() * .4 }); return a; })();
export function headlines(ctx, t, C, o) {
  const u = o.u ?? 0, n = Math.min(40, o.n ?? 26), [wx, wz] = o.wind || [-9, 1.5], lamp = o.lamp, tex = headlineTex();
  const list = [];
  for (let i = 0; i < n; i++) {
    const S = SHEETS[i], tt = u - S.d; if (tt <= 0) continue;
    const X = o.x0 + S.dx + wx * S.sp * tt, Z = o.z0 + S.dz + wz * S.sp * tt + .6 * Math.sin(tt * 2 + i), Y = (o.y0 ?? 0) + S.y + .6 * Math.sin(tt * 3.1 + i * 2) - .1 * tt;
    // tumbling: the sheet's two axes rotate
    const a1 = S.ax + tt * S.wx, a2 = S.ay + tt * S.wy, w = .32 * S.s, h = .43 * S.s;
    const U = [Math.cos(a1) * w, Math.sin(a1) * Math.cos(a2) * w, Math.sin(a1) * Math.sin(a2) * w], V = [-Math.sin(a2) * .4 * h, Math.cos(a2) * h, Math.sin(a2 + .7) * .5 * h];
    const P0 = C.P(X - U[0] / 2 - V[0] / 2, Y - U[1] / 2 - V[1] / 2, Z - U[2] / 2 - V[2] / 2, .2), P1 = C.P(X + U[0] / 2 - V[0] / 2, Y + U[1] / 2 - V[1] / 2, Z + U[2] / 2 - V[2] / 2, .2), P3 = C.P(X - U[0] / 2 + V[0] / 2, Y - U[1] / 2 + V[1] / 2, Z - U[2] / 2 + V[2] / 2, .2);
    if (!P0 || !P1 || !P3) continue;
    if (Math.max(Math.abs(P1[0] - P0[0]), Math.abs(P3[1] - P0[1])) > 3000) continue;
    list.push([C.depth(X, Y, Z), P0, P1, P3, i]);
  }
  list.sort((a, b) => b[0] - a[0]);
  for (const [, P0, P1, P3, i] of list) {
    const ax = (P1[0] - P0[0]) / 300, ay = (P1[1] - P0[1]) / 300, bx = (P3[0] - P0[0]) / 400, by = (P3[1] - P0[1]) / 400, det = ax * by - ay * bx;
    ctx.save(); ctx.setTransform(ax, ay, bx, by, P0[0], P0[1]);
    if (det > 0) ctx.drawImage(tex, 0, 0); else { ctx.fillStyle = '#e6dcc4'; ctx.fillRect(0, 0, 300, 400); }
    // lamp light on the sheet: warm near the lamp, cool in the dark
    const cx = P0[0] + (P1[0] - P0[0]) / 2 + (P3[0] - P0[0]) / 2, cy = P0[1] + (P1[1] - P0[1]) / 2 + (P3[1] - P0[1]) / 2;
    const dl = lamp ? Math.hypot(cx - lamp[0], cy - lamp[1]) / 900 : 1;
    ctx.fillStyle = rgba(mixHex('#3a1e0c', '#0a0c22', clamp(dl)), .35 + .45 * clamp(dl)); ctx.fillRect(0, 0, 300, 400);
    ctx.restore();
  }
}
