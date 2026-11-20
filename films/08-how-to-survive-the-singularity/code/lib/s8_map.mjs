// Film 8 · 3.01–4.02 the map world: a dark plain under the one sky; a giant paper map lying on it (X −7…7, Z 3…far); a walker with a
// lantern on its road; the roll that unrolls ahead and races away; a fog bank; three papers (ladder, planner, note); the edges burn into
// flakes; the big compass at the end of the road; many walkers with lamps coming across the plain.
//   drawMapWorld(ctx, t, C, S)   S = the scene state for this t (see sc01: walker, roll, fog, burn, compass, crowd …)
// The paper is star-shaped around the compass (CEN), so its burning edge is one radius function r(θ, t): no self-intersections.
import { rgba, clamp, prng } from '../engine.mjs';
import { vnoise, fbm, layer, stipple } from './art.mjs';
import { once, TAU, mixHex, hash, nz, projPoly, fillPoly, eoX, sio, u01, settle, spline } from './s8_kit.mjs';
import { walkerBack, crowdWalker } from './s8_people.mjs';

export const MAP = { x0: -7, x1: 7, z0: 3, z1: 60 };
export const CEN = [0, 27];           // the compass on the map (X, Z)
export const CR = 2.2;                // compass radius (m)
export const roadX = (Z) => .9 * Math.sin(Z * .13 + .4) - .35 * Math.sin(Z * .31) * clamp((Z - 4) / 6) ;
export const PAPERS = [
  { kind: 'ladder', x: -2.3, z: 12.5, w: 1.5, h: 2.0, rot: .12 },
  { kind: 'plan', x: 2.15, z: 15.8, w: 2.0, h: 1.5, rot: -.08 },
  { kind: 'note', x: -2.0, z: 19.2, w: 1.3, h: 1.6, rot: .22 },
];

// ---------------------------------------------------------------- ground of the plain
const RIDGES = [
  { z: 1500, x0: -2600, x1: 2600, top: '#1d1c46', bot: '#26244f', rim: '#a4b0dc', ra: .34, seed: 3, h: (X, n) => { const r = 1 - Math.abs(2 * fbm(n, X * .0012, .3, 5) - 1); return 60 + 240 * Math.pow(r, 2.2) + 30 * fbm(n, X * .006, 2.1, 3); } },
  { z: 600, x0: -1300, x1: 1300, top: '#151436', bot: '#1c1b42', rim: '#8e9ac8', ra: .28, seed: 5, h: (X, n) => { const r = 1 - Math.abs(2 * fbm(n, X * .0035, .7, 5) - 1); return 14 + 70 * r * r + 12 * fbm(n, X * .02, 1.3, 3); } },
];
function ridgeImg(R) {
  return once('ridge' + R.seed, () => {
    const k0 = 1400 / R.z, n = vnoise(R.seed), N = 400, hs = []; let hmax = 0;
    for (let i = 0; i <= N; i++) { const X = R.x0 + (R.x1 - R.x0) * i / N, hh = R.h(X, n); hs.push([X, hh]); hmax = Math.max(hmax, hh); }
    const w = Math.ceil((R.x1 - R.x0) * k0), h = Math.ceil(hmax * k0) + 30, [c, g] = layer(w, h), base = h - 4, P = (X, Y) => [(X - R.x0) * k0, base - Y * k0];
    const path = () => { g.beginPath(); g.moveTo(0, h); for (const [X, Y] of hs) g.lineTo(...P(X, Y)); g.lineTo(w, h); g.closePath(); };
    path(); const gr = g.createLinearGradient(0, base - hmax * k0, 0, base); gr.addColorStop(0, R.top); gr.addColorStop(1, R.bot); g.fillStyle = gr; g.fill();
    g.strokeStyle = rgba(R.rim, R.ra); g.lineWidth = 1.2; g.beginPath(); hs.forEach(([X, Y], i) => { const [x, y] = P(X, Y); i ? g.lineTo(x, y + .6) : g.moveTo(x, y + .6); }); g.stroke();
    return c;
  });
}
function drawRidges(ctx, C) {
  if (C.hy > 1200 || C.hy < -300) return;
  for (const R of RIDGES) {
    const im = ridgeImg(R), k0 = 1400 / R.z, p = C.P(R.x0 + C.x, 0, C.z + R.z); if (!p) continue;
    const s = (C.F / 1400), y = C.hy + (C.y / R.z) * C.F;   // the ridge foot sits just under the horizon
    ctx.drawImage(im, p[0], y - im.height * s + 4 * s, im.width * s, im.height * s);
  }
}
function drawGround(ctx, t, C) {
  const top = Math.max(-2, C.hy);
  if (top < 1082) {
    const g = ctx.createLinearGradient(0, C.hy, 0, Math.max(C.hy + 60, 1140)); g.addColorStop(0, '#17163a'); g.addColorStop(.08, '#0f0e26'); g.addColorStop(1, '#06050d');
    ctx.fillStyle = g; ctx.fillRect(0, top, 1920, 1082 - top);
  }
  // engraved furrows at world-fixed rows (stream past when the camera moves), broken strokes
  ctx.save(); ctx.lineCap = 'round';
  const lam = 1.6, zA = C.z - 30, zB = C.z + 900;
  let lastY = -1;
  for (let j = Math.ceil(zA / lam); j * lam < zB; j++) {
    const Z = j * lam, d = C.depth(C.x, 0, Z); if (d < .5) continue;
    const step = Math.max(1, 2 ** Math.floor(Math.log2(Math.max(1, d / 18)))); if (((j % step) + step) % step) continue;
    const pc = C.P(C.x, 0, Z); if (!pc || pc[1] > 1090 || pc[1] < C.hy + 1) continue; if (Math.abs(pc[1] - lastY) < 1.6) continue; lastY = pc[1];
    const k = pc[2], cw = 1.2 * step, X0 = C.x - 980 / k - 40, X1 = C.x + 980 / k + 40, lw = clamp(k * .01, .5, 1.6);
    ctx.strokeStyle = rgba(j % 3 ? '#26244c' : '#302d5a', clamp(.16 + k * .002, .16, .38)); ctx.lineWidth = lw; ctx.beginPath();
    for (let n = Math.floor(X0 / cw); n <= Math.ceil(X1 / cw); n++) {
      const hh = hash(j * 31.7 + n * 7.3); if (hh < .4) continue;
      const a = C.P(n * cw, 0, Z), b = C.P(n * cw + cw * (.35 + .5 * hh), 0, Z); if (!a || !b) continue; ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
    }
    ctx.stroke();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the paper's outline: r(θ) round CEN, eroded by the burn
function rectR(th, x0, x1, z0, z1, cx, cz) {   // distance from (cx, cz) to the rectangle's edge along θ (θ 0 = +Z, π/2 = +X)
  const dx = Math.sin(th), dz = Math.cos(th); let r = 1e9;
  if (dx > 1e-6) r = Math.min(r, (x1 - cx) / dx); else if (dx < -1e-6) r = Math.min(r, (x0 - cx) / dx);
  if (dz > 1e-6) r = Math.min(r, (z1 - cz) / dz); else if (dz < -1e-6) r = Math.min(r, (z0 - cz) / dz);
  return r;
}
const NTH = 720;
// the map's burn: Emax(θ) leaves a ragged island round the compass; τ, start stagger and a slow creep keep it dissolving
function mapR(th, t, B, zFar) {
  const r0 = rectR(th, MAP.x0, MAP.x1, MAP.z0, zFar, CEN[0], CEN[1]);
  if (!B || t < B.t0) return r0;
  const isl = 4.6 + 1.1 * nz(th * 3.1, 1) + .5 * nz(th * 9.3, 2) + 1.6 * Math.abs(Math.cos(th)), em = Math.max(0, r0 - isl);
  const t0 = B.t0 + .55 * (nz(th * 4.3, 3) + 1) * .5 + (Math.cos(th) < -.5 ? .2 : 0), tau = 1.1 + .9 * (nz(th * 2.7, 4) + 1) * .5 + em * .05, a = Math.max(0, t - t0);
  const creep = Math.min(isl - CR - .9, .16 * a);
  const e = em * (1 - Math.exp(-a / tau)) + Math.max(0, creep) * clamp(a / 3);
  return Math.max(CR + .7, r0 - e - .06 * (hash(Math.round(th * 400) * .37) - .5) * clamp(a));
}
function paperR(P, th, t, B) {   // a small sheet, burning all the way (θ relative to the sheet's own axes)
  const r0 = rectR(th - P.rot, -P.w / 2, P.w / 2, -P.h / 2, P.h / 2, 0, 0);
  if (!B || t < B.t0) return r0;
  const t0 = B.t0 + P.delay + .3 * (nz(th * 3.7, P.w * 7) + 1) * .5, a = Math.max(0, t - t0), sp = (.22 + .12 * (nz(th * 5.1, P.h) + 1)) * (1 + a * .55);
  return Math.max(0, r0 - sp * a - .03 * (hash(Math.round(th * 300) * .71 + P.z) - .5) * clamp(a * 3));
}
export function mapOutline(t, B, zFar) {
  const o = [];
  if (zFar < CEN[1] + 3) {   // while the roll is still short of the compass, the sheet is a plain rectangle (no burn yet)
    const cz = (MAP.z0 + zFar) / 2;
    for (let i = 0; i < NTH; i++) { const th = i / NTH * TAU, r = rectR(th, MAP.x0, MAP.x1, MAP.z0, zFar, 0, cz); o.push([Math.sin(th) * r, cz + Math.cos(th) * r, r, th]); }
    return o;
  }
  for (let i = 0; i < NTH; i++) { const th = i / NTH * TAU, r = mapR(th, t, B, zFar); o.push([CEN[0] + Math.sin(th) * r, CEN[1] + Math.cos(th) * r, r, th]); }
  return o;
}
function paperOutline(P, t, B, n = 160) { const o = []; for (let i = 0; i < n; i++) { const th = i / n * TAU, r = paperR(P, th, t, B); o.push([P.x + Math.sin(th) * r, P.z + Math.cos(th) * r, r, th]); } return o; }

// ---------------------------------------------------------------- the light on the paper: the lantern pool + the compass glow + the embers
function lightAt(S, X, Z) {
  let w = 0;
  if (S.lantern) { const d = Math.hypot(X - S.lantern[0], Z - S.lantern[2]); w += S.lanternA * Math.exp(-((d / 5.2) ** 2)); }
  if (S.compass && S.compass.glow > 0) { const d = Math.hypot(X - CEN[0], Z - CEN[1]); w += S.compass.glow * .9 * Math.exp(-(((d - 1.5) / 4.5) ** 2)); }
  return clamp(w);
}
function warmPool(ctx, C, X, Z, R, a, col) {   // a warm pool of light lying on the ground (projected ellipse, gradient)
  const A = C.plane([X, .02, Z], [1, 0, 0], [0, 0, 1]); if (!A) return;
  ctx.save(); ctx.transform(...A); const g = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
  g.addColorStop(0, rgba(col, a)); g.addColorStop(.35, rgba(col, a * .45)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fill(); ctx.restore();
}

// ---------------------------------------------------------------- map content: contours, grid, coast, the road (generated once, in map metres)
const CONTENT = (() => {
  const r = prng(4040), lines = [];
  for (let c = 0; c < 9; c++) {   // hills: nested wobbly loops
    const cx = MAP.x0 + 1 + r() * 12, cz = 5 + r() * 50, n = 3 + Math.floor(r() * 4), ph = r() * 9;
    for (let k = 1; k <= n; k++) { const pts = []; for (let i = 0; i <= 48; i++) { const a = i / 48 * TAU, rr = (.45 * k) * (1 + .25 * Math.sin(a * 3 + ph + k * .3) + .12 * Math.sin(a * 5 + ph * 2)); pts.push([cx + Math.sin(a) * rr * 1.2, cz + Math.cos(a) * rr]); } lines.push({ pts, w: .02, a: .32, col: '#5a4030' }); }
  }
  for (let X = -6; X <= 6; X += 3) lines.push({ pts: [[X, MAP.z0], [X, 70]], w: .012, a: .25, col: '#3a3048', dash: true });
  for (let Z = 6; Z <= 66; Z += 4) lines.push({ pts: [[MAP.x0, Z], [MAP.x1, Z]], w: .012, a: .25, col: '#3a3048', dash: true });
  { const pts = []; for (let Z = MAP.z0; Z <= 70; Z += .5) pts.push([4.6 + 1.3 * Math.sin(Z * .21) + .5 * Math.sin(Z * .67), Z]); lines.push({ pts, w: .035, a: .45, col: '#2c4060' }); }   // a river
  { const pts = []; for (let Z = MAP.z0; Z <= 70; Z += .5) pts.push([-5.3 + .8 * Math.sin(Z * .17 + 1) + .4 * Math.sin(Z * .9), Z]); lines.push({ pts, w: .03, a: .4, col: '#3a3048' }); }   // a coast / border
  return lines;
})();
const TOWNS = (() => { const r = prng(88), a = []; for (let i = 0; i < 26; i++) a.push([MAP.x0 + .6 + r() * 12.8, 4 + r() * 60, .05 + r() * .06]); return a; })();
function strokeProj(ctx, C, pts, y = .015) { let on = false; for (const [X, Z] of pts) { const p = C.P(X, y, Z, .15); if (!p) { on = false; continue; } on ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); on = true; } }

// ---------------------------------------------------------------- the three papers
function sheetAffine(C, P, lift = 0) { return C.plane([P.x, .03 + lift, P.z], [Math.cos(P.rot), 0, -Math.sin(P.rot)], [Math.sin(P.rot), 0, Math.cos(P.rot)]); }
function drawPaper(ctx, t, C, S, P, i) {
  const B = S.burn, O = paperOutline(P, t, B), alive = O.some((p) => p[2] > .02); if (!alive) return;
  const pts = projPoly(C, O.map(([X, Z]) => [X, .03, Z])); if (pts.length < 3) return;
  const lit = lightAt(S, P.x, P.z) * .95 + .05, paper = mixHex('#4a4862', '#f1e2bd', lit);
  // shadow, sheet, content (drawn in the sheet's own metres through its affine)
  ctx.save(); ctx.translate(5, 6); fillPoly(ctx, pts, 'rgba(3,3,10,.35)'); ctx.restore();
  fillPoly(ctx, pts, paper);
  ctx.save(); fillPoly(ctx, pts); ctx.clip();
  const A = sheetAffine(C, P);
  if (A) {
    ctx.save(); ctx.transform(...A); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const ink = rgba('#2a2420', .85), inkS = rgba('#2a2420', .45), hw = P.w / 2, hh = P.h / 2;
    if (P.kind === 'ladder') {   // the career ladder: rails, rungs inking bottom to top, a little box of scribble at some rungs, an arrow at the top
      const u = S.ladder ?? 1; ctx.strokeStyle = ink; ctx.lineWidth = .035;
      ctx.beginPath(); ctx.moveTo(-.3, -hh + .15); ctx.lineTo(-.3, -hh + .15 + (P.h - .3) * clamp(u * 1.6)); ctx.moveTo(.3, -hh + .15); ctx.lineTo(.3, -hh + .15 + (P.h - .3) * clamp(u * 1.6)); ctx.stroke();
      for (let k = 0; k < 7; k++) { const v = clamp((u * 1.25 - k * .12) / .14); if (v <= 0) continue; const y = -hh + .3 + k * .24; ctx.beginPath(); ctx.moveTo(-.3, y); ctx.lineTo(-.3 + .6 * v, y); ctx.stroke();
        if (k % 2 === 1 && v >= 1) { ctx.lineWidth = .018; ctx.strokeStyle = inkS; ctx.strokeRect(.42, y - .07, .26, .14); ctx.beginPath(); ctx.moveTo(.46, y); ctx.lineTo(.46 + .18 * hash(k), y); ctx.stroke(); ctx.lineWidth = .035; ctx.strokeStyle = ink; } }
      const v = clamp((u - .85) / .15); if (v > 0) { const y = hh - .12; ctx.beginPath(); ctx.moveTo(0, y - .22 * v); ctx.lineTo(0, y); ctx.moveTo(-.08, y - .08); ctx.lineTo(0, y); ctx.lineTo(.08, y - .08); ctx.stroke(); }
      // a tiny figure on the bottom rung
      ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(0, -hh + .44, .035, 0, TAU); ctx.fill(); ctx.fillRect(-.02, -hh + .3, .04, .1);
    } else if (P.kind === 'plan') {   // the five-year planner: a header band, five columns, ticks running across them
      const u = S.plan ?? 1; ctx.strokeStyle = inkS; ctx.lineWidth = .016;
      ctx.fillStyle = rgba('#2a2420', .12); ctx.fillRect(-hw + .1, hh - .32, P.w - .2, .2);
      for (let c = 0; c <= 5; c++) { const x = -hw + .1 + c * (P.w - .2) / 5; ctx.beginPath(); ctx.moveTo(x, -hh + .1); ctx.lineTo(x, hh - .12); ctx.stroke(); }
      for (let r2 = 0; r2 < 4; r2++) { const y = -hh + .25 + r2 * .26; ctx.beginPath(); ctx.moveTo(-hw + .1, y + .13); ctx.lineTo(hw - .1, y + .13); ctx.stroke(); }
      ctx.save(); ctx.scale(.01, -.01); ctx.fillStyle = rgba('#2a2420', .75); ctx.font = '600 11px Inter'; ctx.textAlign = 'center';
      ctx.font = '600 7px Inter'; for (let c = 0; c < 5; c++) ctx.fillText('YEAR ' + (c + 1), 100 * (-hw + .1 + (c + .5) * (P.w - .2) / 5), -100 * (hh - .26)); ctx.restore();
      ctx.strokeStyle = rgba('#7a2a18', .85); ctx.lineWidth = .03;
      for (let c = 0; c < 5; c++) for (let r2 = 0; r2 < 4; r2++) { const v = clamp((u * 1.3 - (c * .18 + r2 * .04)) / .1); if (v <= 0 || (r2 + c) % 3 === 2) continue; const x = -hw + .1 + (c + .5) * (P.w - .2) / 5, y = -hh + .25 + r2 * .26;
        ctx.beginPath(); ctx.moveTo(x - .07, y + .02); ctx.lineTo(x - .07 + .05 * clamp(v * 2), y - .04 * clamp(v * 2)); if (v > .5) ctx.lineTo(x - .02 + .1 * (v - .5) * 2, y + .1 * (v - .5) * 2); ctx.stroke(); }
    } else {   // the note: folded in half, it opens (the top half turns over), handwriting and a small heart
      const u = S.note ?? 1, ang = Math.PI * (1 - sio(u));
      const write = (sgn) => { ctx.strokeStyle = rgba('#2a2a5a', .7); ctx.lineWidth = .02; for (let k = 0; k < 5; k++) { const y = sgn * (.15 + k * .13); ctx.beginPath(); let x = -hw + .14; ctx.moveTo(x, y); while (x < hw - .2 - (k === 4 ? .5 : 0)) { const s = .05 + .04 * hash(x * 9 + k); ctx.quadraticCurveTo(x + s * .5, y + .05 * (hash(x * 13 + k) - .3), x + s, y); x += s; } ctx.stroke(); } };
      write(-1);
      if (u > .02) {   // the opened half shows the end of the note and the heart
        ctx.save(); ctx.scale(1, -Math.cos(ang)); if (Math.cos(ang) < 0) { write(-1); ctx.fillStyle = rgba('#b0302a', .8); const hx = hw - .32, hy = -hh + .28; ctx.beginPath(); ctx.moveTo(hx, hy - .05); ctx.bezierCurveTo(hx - .1, hy + .05, hx - .04, hy + .12, hx, hy + .05); ctx.bezierCurveTo(hx + .04, hy + .12, hx + .1, hy + .05, hx, hy - .05); ctx.fill(); } ctx.restore();
      }
      ctx.strokeStyle = rgba('#2a2420', .25); ctx.lineWidth = .01; ctx.beginPath(); ctx.moveTo(-hw, 0); ctx.lineTo(hw, 0); ctx.stroke();
    }
    ctx.restore();
  }
  ctx.restore();
  // the folded flap of the note (lifted, turning over the fold line)
  if (P.kind === 'note') { const u = S.note ?? 1; if (u < .999) noteFlap(ctx, t, C, S, P, u, paper); }
  burnEdge(ctx, t, C, O, B ? (th) => t > B.t0 + P.delay : null, .03, 1);
}
function noteFlap(ctx, t, C, S, P, u, paper) {
  const ang = Math.PI * (1 - sio(u)), c = Math.cos(P.rot), s = Math.sin(P.rot), hw = P.w / 2, hh = P.h / 2;
  const W2 = (lx, ly, lz) => [P.x + lx * c + lz * s, .03 + ly, P.z - lx * s + lz * c];
  // the flap: from the fold (lz 0) to lz = hh rotated about the fold line by ang (lies on the bottom half when ang = π)
  const q = [[-hw, 0], [hw, 0], [hw, hh], [-hw, hh]].map(([lx, lz]) => W2(lx, Math.sin(ang) * lz, Math.cos(ang) * lz));
  const pts = projPoly(C, q); if (pts.length < 3) return;
  fillPoly(ctx, pts, mixHex(paper, '#000000', .12 + .2 * Math.abs(Math.sin(ang))));
  ctx.strokeStyle = 'rgba(40,30,30,.3)'; ctx.lineWidth = 1; ctx.stroke();
}

// ---------------------------------------------------------------- the burning edge (ember line, charred rim, glow) along an outline
function burnEdge(ctx, t, C, O, on, y = .015, wide = 1) {
  if (!on) return;
  const P = O.map(([X, Z, r, th]) => (on(th) ? C.P(X, y, Z, .15) : null));
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const seg = (fn) => { ctx.beginPath(); let st = false; for (let i = 0; i <= P.length; i++) { const p = P[i % P.length]; if (!p || p[0] < -200 || p[0] > 2120 || p[1] < -200 || p[1] > 1280) { st = false; continue; } st ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); st = true; } fn(); };
  const k = (P.find((p) => p) || [0, 0, 100])[2];
  seg(() => { ctx.strokeStyle = 'rgba(40,16,8,.75)'; ctx.lineWidth = clamp(k * .09 * wide, 2, 16); ctx.stroke(); });
  ctx.globalCompositeOperation = 'lighter';
  const fl = .8 + .2 * Math.sin(t * 9.1) * Math.sin(t * 5.3);
  seg(() => { ctx.strokeStyle = rgba('#ff7a2e', .22 * fl); ctx.lineWidth = clamp(k * .2 * wide, 4, 30); ctx.stroke(); ctx.strokeStyle = rgba('#ffb35c', .85 * fl); ctx.lineWidth = clamp(k * .025 * wide, 1, 4); ctx.stroke(); ctx.strokeStyle = rgba('#fff1d6', .6 * fl); ctx.lineWidth = clamp(k * .008, .6, 1.5); ctx.stroke(); });
  ctx.restore();
}

// ---------------------------------------------------------------- flakes: born on a burning edge, lifted by the warm air, carried by the wind
function flakeOf(n, born, X, Z, src) {
  const h = (q) => hash(n * 1.37 + q * 7.1);
  return { born, X, Z, s: .045 + .1 * h(1), up: .45 + .7 * h(2), wx: .5 + .5 * h(3), wz: .9 + .9 * h(4), spin: (h(5) - .5) * 9, ph: h(6) * TAU, life: 2.2 + 2 * h(7), src, sh: h(8) };
}
function flakesAt(t, S) {
  const B = S.burn; if (!B || t < B.t0) return [];
  const out = [], dt = 1 / 160, n1 = Math.floor((t - B.t0) / dt);
  for (let n = Math.max(0, n1 - 4.2 * 160); n <= n1; n++) {
    const born = B.t0 + n * dt, rate = born < B.t0 + 2.6 ? .7 : born < B.t0 + 5 ? .32 : .16; if (hash(n * .713) > rate) continue;
    const pick = hash(n * 3.17); let X, Z, src;
    if (pick < .62) { const th = hash(n * 5.3) * TAU, r = mapR(th, born, B, S.zFar ?? MAP.z1); X = CEN[0] + Math.sin(th) * r; Z = CEN[1] + Math.cos(th) * r; if (Z > (S.fogZ ?? 99) + 6) continue; src = 'map'; }
    else { const P = PAPERS[Math.floor(hash(n * 9.1) * 3)], th = hash(n * 2.9) * TAU, r = paperR(P, th, born, B); if (born < B.t0 + P.delay || r <= .01 && hash(n) > .2) continue; X = P.x + Math.sin(th) * r; Z = P.z + Math.cos(th) * r; src = P.kind; }
    const F = flakeOf(n, born, X, Z, src); if (t - born > F.life) continue; out.push(F);
  }
  return out;
}
function drawFlakes(ctx, t, C, S, list) {
  ctx.save();
  for (const F of list) {
    const a = t - F.born, lift = F.up * a + .25 * a * a, X = F.X + F.wx * a * a * .35 + .15 * Math.sin(a * 2 + F.ph), Z = F.Z + F.wz * a * a * .3, Y = .03 + lift;
    const sp = F.spin * a + F.ph, c = Math.cos(sp), s = Math.sin(sp), w = F.s * (1 - .4 * clamp(a / F.life)), tilt = Math.cos(sp * .7 + F.ph);
    const q = [[-w, -w * .7], [w * .8, -w * .6], [w, w * .7], [-w * .7, w * .6]].map(([u, v]) => [X + u * c - v * s * tilt, Y + v * Math.sin(sp * .7 + F.ph) * .6, Z + u * s + v * c * tilt]);
    const P = q.map((p) => C.P(p[0], p[1], p[2], .2)); if (P.some((p) => !p)) continue;
    if (P[0][0] < -40 || P[0][0] > 1960 || P[0][1] < -40 || P[0][1] > 1120) continue;
    const heat = clamp(1 - a / .9), side = tilt > 0, lit = lightAt(S, X, Z) * .8 + .15;
    const base = side ? mixHex('#3c3a50', '#d8c39a', lit) : mixHex('#1e161a', '#5a3a2a', lit);
    ctx.fillStyle = mixHex(base, '#1a0c08', clamp(a / F.life * 1.2) * .7);
    ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]); for (let i = 1; i < 4; i++) ctx.lineTo(P[i][0], P[i][1]); ctx.closePath(); ctx.fill();
    if (heat > 0) { ctx.strokeStyle = rgba('#ffb35c', .9 * heat); ctx.lineWidth = Math.max(.8, P[0][2] * .012); ctx.stroke(); }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the roll ahead of the walker
function drawRoll(ctx, t, C, zr, burnA) {
  if (zr > 700) return;
  const r = .38, a = C.P(MAP.x0, r, zr), b = C.P(MAP.x1, r, zr); if (!a || !b) return;
  const top0 = C.P(MAP.x0, 2 * r, zr), bot0 = C.P(MAP.x0, 0, zr), top1 = C.P(MAP.x1, 2 * r, zr), bot1 = C.P(MAP.x1, 0, zr);
  const hh = Math.max(1.2, (bot0[1] - top0[1]));
  ctx.save();
  const g = ctx.createLinearGradient(0, top0[1], 0, bot0[1]); g.addColorStop(0, '#c8bca0'); g.addColorStop(.35, '#8c84a0'); g.addColorStop(1, '#2a2840');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(top0[0], top0[1]); ctx.lineTo(top1[0], top1[1]); ctx.lineTo(bot1[0], bot1[1]); ctx.lineTo(bot0[0], bot0[1]); ctx.closePath(); ctx.fill();
  // the spiral ends of the roll
  for (const [p, q] of [[top0, bot0], [top1, bot1]]) { const cx = (p[0] + q[0]) / 2, cy = (p[1] + q[1]) / 2, rr = hh / 2; ctx.fillStyle = '#a89c84'; ctx.beginPath(); ctx.ellipse(cx, cy, rr * .35, rr, 0, 0, TAU); ctx.fill(); if (rr > 3) { ctx.strokeStyle = 'rgba(60,50,40,.6)'; ctx.lineWidth = 1; ctx.beginPath(); for (let k = 1; k < 4; k++) ctx.ellipse(cx, cy, rr * .35 * k / 4, rr * k / 4, 0, 0, TAU); ctx.stroke(); } }
  // the paper streaming off the roll, toward us: bright edge line where it touches the ground
  ctx.strokeStyle = 'rgba(240,230,210,.35)'; ctx.lineWidth = Math.max(.8, hh * .06); ctx.beginPath(); ctx.moveTo(bot0[0], bot0[1]); ctx.lineTo(bot1[0], bot1[1]); ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------- fog: a bank of cloud lying on the plain from fogZ to the horizon
const PUFF = () => once('fogpuff', () => {
  const S = 256, [c, g] = layer(S, S), n = vnoise(61), img = g.createImageData(S, S), p = img.data;
  for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) { const dx = (i - S / 2) / (S / 2), dy = (j - S / 2) / (S / 2), d = Math.hypot(dx, dy * 1.3), v = clamp(1 - d) ** 1.3 * (.55 + .9 * (fbm(n, i * .03, j * .03, 4) - .4)), k = (j * S + i) * 4; p[k] = 78; p[k + 1] = 75; p[k + 2] = 110; p[k + 3] = Math.round(255 * clamp(v * 1.4)); }
  g.putImageData(img, 0, 0); stipple(c, { k: .4, g: 1, seed: 3, boost: 1.6 }); return c;
});
const PUFFS = (() => { const r = prng(707), a = []; for (let i = 0; i < 70; i++) a.push({ x: -40 + r() * 80, dz: r() * 26, y: .2 + r() * 2.2, s: 3 + r() * 5, ph: r() * TAU }); return a.sort((p, q) => q.dz - p.dz); })();
function drawFog(ctx, t, C, fz, density = 1) {
  if (fz > 600 || density <= 0) return;
  const far = projPoly(C, [[-300, 0, fz + 3], [300, 0, fz + 3], [300, 0, 2000], [-300, 0, 2000]]);
  const pz = C.P(C.x, 0, fz + 3);
  if (fillPoly(ctx, far)) { const g = ctx.createLinearGradient(0, pz ? pz[1] : C.hy, 0, C.hy); g.addColorStop(0, rgba('#3a3858', .95 * density)); g.addColorStop(1, rgba('#4a4766', density)); ctx.fillStyle = g; ctx.fill(); }
  // the wall of fog standing up from the plain (up to ~9 m), hiding the horizon
  const top = C.P(C.x, 9, fz + 8), bot = C.P(C.x, 0, fz + 3);
  if (top && bot) { const g = ctx.createLinearGradient(0, top[1], 0, bot[1]); g.addColorStop(0, rgba('#3a3858', 0)); g.addColorStop(.5, rgba('#3c3a5a', .8 * density)); g.addColorStop(1, rgba('#3e3c5c', .95 * density)); ctx.fillStyle = g; ctx.fillRect(0, top[1], 1920, bot[1] - top[1] + 2); }
  const im = PUFF();
  for (const P of PUFFS) {
    const z = fz + P.dz, x = P.x + 1.2 * Math.sin(t * .2 + P.ph) + t * .3, p = C.P(((x + 40) % 80 + 80) % 80 - 40 + C.x * .0, P.y + .3 * Math.sin(t * .4 + P.ph), z); if (!p) continue;
    const s = P.s * p[2]; if (p[0] + s < 0 || p[0] - s > 1920) continue;
    ctx.globalAlpha = .85 * density; ctx.drawImage(im, p[0] - s, p[1] - s * .7, 2 * s, 1.4 * s); ctx.globalAlpha = 1;
  }
}

// ---------------------------------------------------------------- the big compass lying on the map (brass ring, cream face, rose, glowing needle)
function circ(C, cx, cz, r, y, n = 96) { const o = []; for (let i = 0; i < n; i++) { const a = i / n * TAU; o.push([cx + Math.sin(a) * r, y, cz + Math.cos(a) * r]); } return o; }
export function drawCompass(ctx, t, C, K) {
  const [cx, cz] = CEN, glow = K.glow ?? 0, wall = .24;
  if (C.depth(cx, 0, cz) < .5) return;
  // shadow, outer wall (brass, dark), top ring (brass, lit by the needle), ticks, face, rose, needle, glass
  fillPoly(ctx, projPoly(C, circ(C, cx + .25, cz - .2, CR + .1, .01)), 'rgba(3,3,10,.45)');
  const outerTop = projPoly(C, circ(C, cx, cz, CR, wall)), outerBot = projPoly(C, circ(C, cx, cz, CR, .02));
  // wall: the convex hull of top and bottom ellipses (draw bottom, then a band)
  fillPoly(ctx, outerBot, '#3a2a18');
  ctx.save(); ctx.fillStyle = '#4a3420'; ctx.beginPath(); for (let i = 0; i < outerTop.length; i++) { ctx.moveTo(outerTop[i][0], outerTop[i][1]); ctx.lineTo(outerBot[i][0], outerBot[i][1]); ctx.lineTo(outerBot[(i + 1) % outerBot.length][0], outerBot[(i + 1) % outerBot.length][1]); ctx.lineTo(outerTop[(i + 1) % outerTop.length][0], outerTop[(i + 1) % outerTop.length][1]); ctx.closePath(); } ctx.fill(); ctx.restore();
  const brass = mixHex('#6a5030', '#e6b86a', .25 + .6 * glow);
  fillPoly(ctx, outerTop, brass);
  const inner = projPoly(C, circ(C, cx, cz, CR * .86, wall));
  const face = mixHex('#5a566c', '#f3e6c4', .2 + .75 * glow);
  fillPoly(ctx, inner, face);
  // ticks on the ring
  ctx.strokeStyle = rgba('#2a1a0c', .7); ctx.lineWidth = 1.2; ctx.beginPath();
  for (let i = 0; i < 72; i++) { const a = i / 72 * TAU, r0 = CR * (i % 6 ? .9 : .875), p = C.P(cx + Math.sin(a) * r0, wall, cz + Math.cos(a) * r0), q = C.P(cx + Math.sin(a) * CR * .97, wall, cz + Math.cos(a) * CR * .97); if (p && q) { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); } }
  ctx.stroke();
  // the rose: 16 points, engraved
  ctx.save(); fillPoly(ctx, inner); ctx.clip();
  const pt = (a, r) => C.P(cx + Math.sin(a) * r, wall, cz + Math.cos(a) * r);
  for (const [n, L, wd, col] of [[8, .55, .07, rgba('#2a2420', .35)], [4, .74, .1, rgba('#3a2a1a', .55)], [4, .82, .13, rgba('#2a2420', .75)]]) {
    for (let i = 0; i < n; i++) {
      const a = (i + (n === 8 ? .5 : n === 4 && L < .8 ? .5 : 0)) / n * TAU * (n === 8 ? 1 : 1) + (n === 8 ? 0 : 0), tip = pt(a, CR * L), l = pt(a - Math.PI / 2, CR * wd), r = pt(a + Math.PI / 2, CR * wd), c0 = pt(0, 0);
      if (!tip || !l || !r) continue;
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(tip[0], tip[1]); ctx.lineTo(l[0], l[1]); ctx.lineTo(c0[0], c0[1]); ctx.closePath(); ctx.fill();
      ctx.fillStyle = rgba('#2a2420', .12); ctx.beginPath(); ctx.moveTo(tip[0], tip[1]); ctx.lineTo(r[0], r[1]); ctx.lineTo(c0[0], c0[1]); ctx.closePath(); ctx.fill();
    }
  }
  for (const rr of [.3, .6]) { const ring = projPoly(C, circ(C, cx, cz, CR * rr, wall + .001, 64)); if (ring.length > 2) { ctx.strokeStyle = rgba('#2a2420', .3); ctx.lineWidth = 1; fillPoly(ctx, ring); ctx.stroke(); } }
  // N on the face (a small engraved letter)
  const nP = pt(0, CR * .66); if (nP) { ctx.fillStyle = rgba('#2a2420', .7); ctx.font = `600 ${Math.max(8, nP[2] * .2)}px Inter`; ctx.textAlign = 'center'; ctx.fillText('N', nP[0], nP[1] + nP[2] * .07); }
  ctx.restore();
  // the needle: a long diamond, the north half amber and glowing; swings and settles (≤ 5 % overshoot)
  const na = K.needle ?? 0, nl = CR * .78, nw = CR * .09, y2 = wall + .05;
  const P = (a, r, side) => C.P(cx + Math.sin(a) * r + Math.sin(a + Math.PI / 2) * side, y2, cz + Math.cos(a) * r + Math.cos(a + Math.PI / 2) * side);
  const tipN = P(na, nl, 0), tipS = P(na + Math.PI, nl, 0), sl = P(na, 0, -nw), sr = P(na, 0, nw);
  if (tipN && tipS && sl && sr) {
    ctx.fillStyle = '#1a1622'; ctx.beginPath(); ctx.moveTo(tipS[0], tipS[1]); ctx.lineTo(sl[0], sl[1]); ctx.lineTo(sr[0], sr[1]); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mixHex('#8a4a20', '#ffcf8a', glow); ctx.beginPath(); ctx.moveTo(tipN[0], tipN[1]); ctx.lineTo(sl[0], sl[1]); ctx.lineTo(sr[0], sr[1]); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba('#fff1d6', .5 * glow); ctx.beginPath(); ctx.moveTo(tipN[0], tipN[1]); ctx.lineTo(sl[0], sl[1]); ctx.lineTo((sl[0] + sr[0]) / 2, (sl[1] + sr[1]) / 2); ctx.closePath(); ctx.fill();
    const pv = C.P(cx, y2 + .01, cz); if (pv) { ctx.fillStyle = mixHex('#5a4020', '#f0c27a', .3 + .6 * glow); ctx.beginPath(); ctx.arc(pv[0], pv[1], Math.max(2, pv[2] * .07), 0, TAU); ctx.fill(); }
    if (glow > 0) {   // the needle's light (the hero light of the title)
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const m = [(tipN[0] * 2 + pv[0]) / 3, (tipN[1] * 2 + pv[1]) / 3], R2 = (pv ? pv[2] : 100) * 3.6 * (1 + .03 * Math.sin(t * 6.28));
      const g = ctx.createRadialGradient(m[0], m[1], 0, m[0], m[1], R2); g.addColorStop(0, rgba('#ffb35c', .7 * glow)); g.addColorStop(.25, rgba('#ff8a3a', .24 * glow)); g.addColorStop(1, rgba('#c4512e', 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(m[0], m[1], R2, 0, TAU); ctx.fill();
      ctx.lineCap = 'round'; for (const [lw, al] of [[pv[2] * .09, .25], [pv[2] * .03, .8]]) { ctx.strokeStyle = rgba('#fff1d6', al * glow); ctx.lineWidth = Math.max(1, lw); ctx.beginPath(); ctx.moveTo(pv[0], pv[1]); ctx.lineTo(tipN[0], tipN[1]); ctx.stroke(); }
      ctx.restore();
    }
  }
  // the glass: one soft highlight arc
  const gA = pt(-.9, CR * .7), gB = pt(-.2, CR * .74); if (gA && gB) { ctx.strokeStyle = rgba('#ffffff', .12 + .1 * glow); ctx.lineWidth = Math.max(2, gA[2] * .06); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(gA[0], gA[1]); ctx.quadraticCurveTo((gA[0] + gB[0]) / 2, Math.min(gA[1], gB[1]) - gA[2] * .1, gB[0], gB[1]); ctx.stroke(); }
  // rim light on the ring's top edge
  ctx.strokeStyle = rgba('#ffd08a', .25 + .5 * glow); ctx.lineWidth = 1.4; fillPoly(ctx, outerTop); ctx.stroke();
}

// ---------------------------------------------------------------- the crowd: walkers with lamps converging on the compass over the plain
const CROWD = (() => { const r = prng(5150), a = []; for (let i = 0; i < 110; i++) { const ang = r() * TAU, rad = 13 + Math.pow(r(), .9) * 75; if (Math.abs(Math.sin(ang)) < .25 && Math.cos(ang) < 0 && rad < 30) continue; a.push({ ang, rad, v: .9 + .5 * r(), ph: r() * TAU, h: 1.55 + .35 * r(), ign: r() }); } return a; })();
function drawCrowd(ctx, t, C, S) {
  const list = [];
  for (const P of CROWD) {
    const rr = Math.max(CR + 3.5 + P.rad * .1, P.rad - P.v * Math.max(0, t - S.crowdT0)), X = CEN[0] + Math.sin(P.ang) * rr, Z = CEN[1] + Math.cos(P.ang) * rr;
    const p = C.P(X, 0, Z, .5); if (!p || p[0] < -60 || p[0] > 1980 || p[1] < -20 || p[1] > 1140) continue;
    list.push([p, P, X, Z]);
  }
  list.sort((a, b) => a[0][2] - b[0][2]);
  for (const [p, P, X, Z] of list) {
    const h = P.h * p[2]; if (h < 2) continue;
    const toC = Math.sin(P.ang + Math.PI), dirScreen = (C.P(X + Math.sin(P.ang + Math.PI) * .5, 0, Z + Math.cos(P.ang + Math.PI) * .5, .5) || p)[0] > p[0] ? 1 : -1;
    crowdWalker(ctx, t, p[0], p[1], h, (t * P.v * 3.2 + P.ph), { dir: dirScreen, lamp: clamp(((S.crowdLamp ?? 1) * 1.6 - P.ign * .6) / .25) });
  }
}

// ---------------------------------------------------------------- the world
export function drawMapWorld(ctx, t, C, S) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  drawRidges(ctx, C);
  drawGround(ctx, t, C);
  // the paper
  const zFar = Math.min(S.roll ?? MAP.z1, MAP.z1), O = mapOutline(t, S.burn, zFar);
  const MP = projPoly(C, O.map(([X, Z]) => [X, .01, Z]));
  const lit0 = '#2e2c44';
  if (fillPoly(ctx, MP, lit0)) {
    ctx.save(); fillPoly(ctx, MP); ctx.clip();
    // light on the paper: the lantern's pool, the compass, the cool sky toward the far end
    if (S.lantern) warmPool(ctx, C, S.lantern[0], S.lantern[2], 5.2, .7 * S.lanternA, '#e8c08a');
    if (S.compass && S.compass.glow > 0) warmPool(ctx, C, CEN[0], CEN[1], 7.5, .7 * S.compass.glow, '#f6cf90');
    if (S.burn && t > S.burn.t0) warmPool(ctx, C, CEN[0], CEN[1] - 4, 11, .25 * clamp((t - S.burn.t0) * 1.5), '#ff9a50');
    // ink
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const k = (C.P(C.x, 0, C.z + 8) || [0, 0, 100])[2];
    for (const L of CONTENT) { ctx.strokeStyle = rgba(L.col, L.a); ctx.lineWidth = Math.max(.6, L.w * k); if (L.dash) ctx.setLineDash([6, 6]); ctx.beginPath(); strokeProj(ctx, C, L.pts); ctx.stroke(); if (L.dash) ctx.setLineDash([]); }
    ctx.fillStyle = rgba('#3a2420', .6); for (const [X, Z, r] of TOWNS) { const p = C.P(X, .015, Z, .2); if (p) { ctx.beginPath(); ctx.arc(p[0], p[1], Math.max(.8, r * p[2]), 0, TAU); ctx.fill(); } }
    // the road: a double line with a dashed centre, red-brown ink, toward the compass
    const road = []; for (let Z = MAP.z0; Z <= CEN[1] - CR - .3; Z += .3) road.push([roadX(Z), Z]);
    for (const off of [-.32, .32]) { ctx.strokeStyle = rgba('#5a2a1a', .75); ctx.lineWidth = Math.max(.8, .04 * k); ctx.beginPath(); strokeProj(ctx, C, road.map(([X, Z]) => [X + off, Z])); ctx.stroke(); }
    ctx.strokeStyle = rgba('#7a3a20', .55); ctx.setLineDash([10, 9]); ctx.lineWidth = Math.max(.6, .025 * k); ctx.beginPath(); strokeProj(ctx, C, road); ctx.stroke(); ctx.setLineDash([]);
    ctx.restore();
    // the near edge (the line we came out of): a thin bright paper edge
    const e0 = C.P(MAP.x0, .01, MAP.z0), e1 = C.P(MAP.x1, .01, MAP.z0);
    if (e0 && e1 && S.edgeA > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#f3ecda', .8 * S.edgeA); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(e0[0], e0[1]); ctx.lineTo(e1[0], e1[1]); ctx.stroke(); ctx.restore(); }
  }
  if (zFar >= CEN[1] + 3) burnEdge(ctx, t, C, O, S.burn ? (th) => t > S.burn.t0 + .55 * (nz(th * 4.3, 3) + 1) * .5 + (Math.cos(th) < -.5 ? .2 : 0) && rectR(th, MAP.x0, MAP.x1, MAP.z0, zFar, CEN[0], CEN[1]) - mapR(th, t, S.burn, zFar) > .02 : null, .012, 1.2);
  if (S.roll != null) drawRoll(ctx, t, C, S.roll);
  // papers, the compass, flakes
  for (let i = 0; i < PAPERS.length; i++) drawPaper(ctx, t, C, S, PAPERS[i], i);
  if (S.compass) drawCompass(ctx, t, C, S.compass);
  const FL = flakesAt(t, S);
  // the walker (behind the papers in depth order is fine: he never stands on one)
  if (S.walker) {
    const W = S.walker, p = C.P(W.x, 0, W.z, .3);
    if (S.lantern) { const q = C.P(S.lantern[0], S.lantern[1], S.lantern[2], .3); if (q) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const R = q[2] * 1.1, g = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], R); g.addColorStop(0, rgba('#ffcf8a', .5 * S.lanternA)); g.addColorStop(.3, rgba('#ff9a4a', .12 * S.lanternA)); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(q[0], q[1], R, 0, TAU); ctx.fill(); ctx.restore(); } }
    if (p) { const h = 1.78 * p[2]; const L = S.lantern ? C.P(S.lantern[0], S.lantern[1], S.lantern[2] + 2.5) : null; walkerBack(ctx, t, p[0], p[1], h, W.phase, { lantern: '#ffb35c', light: L ? { x: L[0], y: L[1], col: '#ffc27a', a: .55 } : null }); }
  }
  drawFog(ctx, t, C, S.fogZ ?? 999, S.fogA ?? 1);
  if (S.crowdT0 != null) drawCrowd(ctx, t, C, S);
  drawFlakes(ctx, t, C, S, FL);
  ctx.restore();
}
