// Film 18 · builder B3 (c09–c11): the world pieces of "rules II" on THE BOARD. Owned by B3; built on lib/f18_kit.mjs (never edited).
// Everything here draws in WORLD units through stand() (origin on the ground, y up = −) or in screen space where it says so.
//   sky3 / board3 / road3   the board as in the kit, plus: o.dark (the plateRules night: the board's light comes up out of it),
//                           o.sea (the right edge of the board turns into water), o.warm (first light), o.pres (road presence)
//   camK                    camera keys (sine-S per segment; a key may carry ref: log-distance z toward a plane, for push-ins)
//   props                   satellite, pin, blockB (one building that grows into the Vienna block), earth (the section cut),
//                           riesenrad, spire, turbine, dcHall, townHall (+ room), shelf, popUp, kid / plumber
import { Path2D, createCanvas, loadImage } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f18_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, cam3, F0, lin, rad, halo, glowFill, drift, prng } = E;
const { BOARD, LOOP, gp, wp, loopPt, loopDir, COOL } = F;

// ================================================================================================================== camera
export const camFor = (X, Y, Z, s, sx = W / 2, sy = H / 2, f = F0) => { const dz = f / s; return cam3({ x: X - (sx - W / 2) / s, y: Y + BOARD.GY - (sy - H / 2) / s, z: Z - dz, f }); };
const EZ = { s: sineIO, q: quartIO, i: expoIn, o: expoOut, l: (x) => clamp(x), a: (x) => 1 - Math.cos(Math.PI / 2 * clamp(x)), b: (x) => Math.sin(Math.PI / 2 * clamp(x)) };
export function camK(t, K) {
  if (t <= K[0][0]) return { ...K[0][1] };
  const n = K.length; if (t >= K[n - 1][0]) return { ...K[n - 1][1] };
  let i = 0; while (t > K[i + 1][0]) i++;
  const [ta, a] = K[i], [tb, b, ez] = K[i + 1], u = EZ[ez || 's']((t - ta) / (tb - ta));
  const out = cam3({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), f: lerp(a.f, b.f, u) });
  const ref = b.ref ?? a.ref2;
  if (ref) {   // a zoom path: distance to ref moves evenly in log space, and x / y / f follow the distance itself (the target stays in frame)
    const da = Math.max(1, ref - a.z), db = Math.max(1, ref - b.z); out.z = ref - Math.exp(lerp(Math.log(da), Math.log(db), u));
    const v = Math.abs(db - da) > 1 ? clamp((ref - out.z - da) / (db - da)) : u;   // linear in distance: lateral moves happen where we are far
    out.x = lerp(a.x, b.x, v); out.y = lerp(a.y, b.y, v); out.f = lerp(a.f, b.f, v);
  }
  else out.z = lerp(a.z, b.z, u);
  return out;
}

// ================================================================================================================== sky
// The sky is the plateRules night (screen space, so the seam frame is exact), shifted a little with the camera (depth 40000).
export const C0 = { x: 0, y: -35.2, z: 5004 - 1700 / .65, f: 1700 };       // the camera that sees rule card II exactly as the plate
const skyOff = (c) => { const k = c.f / 40000; return [-(c.x - C0.x) * k, clamp(-(c.y - C0.y) * k, -160, 160)]; };
const plateGrad = (ctx, oy) => lin(ctx, 0, oy, 0, H + oy, [[0, P.night0], [.6, P.night1], [1, mixHex(P.ind0, P.blue1, .2)]]);
export function sky3(ctx, c, t, o = {}) {
  const [ox, oy] = skyOff(c), warm = o.warm ?? 0, lift = o.lift ?? 0;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = plateGrad(ctx, oy); ctx.fillRect(0, 0, W, H);
  // the board's own sky (as c01's F.sky): an indigo glow low in the middle, once the light has come up
  if (lift > 0) { ctx.fillStyle = rad(ctx, W * .5 + ox, H * .95 + oy, 1900, [[0, rgba(mixHex(P.ind1, P.blue1, .25 + .3 * warm), .85 * lift)], [.5, rgba(P.ind1, .32 * lift)], [1, rgba(P.ind0, 0)]]); ctx.fillRect(0, 0, W, H); }
  // a lifted blue toward the horizon (the board's night is lit from its road), warming at first light
  if (lift > 0 || warm > 0) {
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(ctx, 0, 60 + oy, 0, 680, [[0, rgba(P.blue0, 0)], [.56, rgba(mixHex(P.blue0, P.shade0, warm), .1 * lift + .1 * warm)], [.78, rgba(mixHex(P.blue0, P.halo1, warm), .18 * lift + .26 * warm)], [.86, rgba(mixHex(P.blue0, P.halo1, warm), .1 * lift + .14 * warm)], [1, rgba(P.blue0, 0)]]);
    ctx.fillRect(0, 0, W, 680);
    if (warm > 0) { ctx.save(); ctx.translate(W * .5 + ox, 545); ctx.scale(2.2, .8); ctx.fillStyle = rad(ctx, 0, 0, 520, [[0, rgba(P.halo0, .22 * warm)], [.4, rgba(P.halo1, .09 * warm)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(-W, -560, 2 * W, 700); ctx.restore(); }
    ctx.globalCompositeOperation = 'source-over';
  }
  ctx.translate(ox, oy);
  E.stars(ctx, 1818, 90, t, [0, 0, W, H], .55 * (1 - .55 * warm));
  if ((o.air ?? 0) > 0) E.stars(ctx, 181, Math.round(520 * o.air), t, [-260, -120, W + 520, H * .5 + 60], .5 * o.air * (1 - .5 * warm));
  ctx.restore();
}

// ================================================================================================================== board
function projPoly(c, pts, Y = BOARD.GY) {
  const zMin = c.z + 60, out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], ia = a[1] >= zMin, ib = b[1] >= zMin;
    if (ia) out.push(a);
    if (ia !== ib) { const f = (zMin - a[1]) / (b[1] - a[1]); out.push([lerp(a[0], b[0], f), zMin]); }
  }
  return out.map((p) => wp(c, p[0], Y, p[1])).filter(Boolean);
}
const pathOf = (ctx, poly) => { ctx.beginPath(); poly.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); };
export const SEA = { x0: 4300 };
const GLINTS = (() => { const r = prng(4747); return Array.from({ length: 260 }, () => [SEA.x0 + 150 + r() * 5500, -2000 + r() * 18000, .5 + r(), r() * 6.3, 60 + r() * 160]); })();
export function board3(ctx, c, t, o = {}) {
  const { GY, cz, half } = BOARD, sq = [[-half, cz - half], [half, cz - half], [half, cz + half], [-half, cz + half]];
  const poly = projPoly(c, sq); if (poly.length < 3) return;
  const far = wp(c, 0, GY, cz + half), yTop = far ? far[1] : H / 2, warm = o.warm ?? 0, dark = clamp(o.dark ?? 0), [, oy] = skyOff(c);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  pathOf(ctx, poly);
  if (dark > 0) { ctx.fillStyle = plateGrad(ctx, oy); ctx.fill(); }
  if (dark < 1) {
    ctx.globalAlpha = 1 - dark;
    const lf = o.lift ?? 0;
    ctx.fillStyle = lin(ctx, 0, yTop, 0, Math.max(yTop + 60, H), [[0, mixHex(mixHex(P.ind1, P.blue1, .35 + .2 * lf), P.halo1, .3 * warm)], [.12, mixHex(mixHex(P.night1, P.ind1, .5 + .4 * lf), P.shade0, .18 * warm)], [.55, mixHex(mixHex(P.night1, P.ind1, .45 * lf), P.ind2, .25 * warm)], [1, mixHex(P.night0, P.night1, .6 * lf)]]);
    ctx.fill(); ctx.globalAlpha = 1;
  }
  // the sea: the board's right edge turns to water (o.sea 0..1 moves the shore from the edge in to SEA.x0)
  const sea = o.sea ?? 0;
  if (sea > 0) {
    const xs = lerp(half, SEA.x0, expoOut(sea)), sp = projPoly(c, [[xs, cz - half], [half, cz - half], [half, cz + half], [xs, cz + half]]);
    if (sp.length > 2) {
      pathOf(ctx, sp); ctx.fillStyle = lin(ctx, 0, yTop, 0, H, [[0, mixHex(P.blue0, P.halo1, .25 + .3 * warm)], [.05, mixHex(P.ind1, P.blue0, .55)], [.4, mixHex(P.ind0, P.ind1, .5)], [1, P.night0]]); ctx.fill();
      ctx.save(); pathOf(ctx, sp); ctx.clip(); ctx.globalCompositeOperation = 'lighter';
      for (const [X, Z, s, ph, len] of GLINTS) {
        if (X < xs + 60) continue; const p = gp(c, X, Z); if (!p || p[1] > H + 10 || p[0] < -200 || p[0] > W + 200) continue;
        const a = (.5 + .5 * Math.sin(t * (1.2 + s) + ph)) * .5 * s; ctx.strokeStyle = rgba(P.halo1, a); ctx.lineWidth = Math.max(1, 6 * p[2]);
        const dx = len * p[2]; ctx.beginPath(); ctx.moveTo(p[0] - dx / 2 + Math.sin(t * .6 + ph) * dx * .3, p[1]); ctx.lineTo(p[0] + dx / 2 + Math.sin(t * .6 + ph) * dx * .3, p[1]); ctx.stroke();
      }
      ctx.restore();
      // the shore: a thin line of light
      const a = gp(c, xs, Math.max(c.z + 80, cz - half)), b = gp(c, xs, cz + half);
      if (a && b) { ctx.strokeStyle = rgba(P.halo1, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
    }
  }
  ctx.restore();
  // the zero line (far edge, the horizon = price zero); at first light it warms
  const z = (o.zero ?? 1) * (1 - dark);
  if (z > 0 && far) {
    const a = wp(c, -half, GY, cz + half), b = wp(c, half, GY, cz + half);
    if (a && b) {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
      const hc = mixHex(P.blue0, P.halo0, warm);
      { const mx = (a[0] + b[0]) / 2, hw = Math.abs(b[0] - a[0]) / 2 + 40; ctx.save(); ctx.translate(mx, far[1] + 4); ctx.scale(hw / 90, 1);
        ctx.fillStyle = rad(ctx, 0, 0, 90, [[0, rgba(P.halo1, (.2 + .14 * warm) * z)], [.35, rgba(hc, (.16 + .06 * warm) * z)], [1, rgba(hc, 0)]]); ctx.fillRect(-90, -90, 180, 96); ctx.restore(); }
      ctx.strokeStyle = rgba(mixHex(P.halo2, P.cream, .5 + .5 * warm), (.55 + .4 * warm) * z); ctx.lineWidth = 1.6 + 1.6 * warm; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      ctx.restore();
    }
  }
  road3(ctx, c, t, o);
}
// the loop road (copy of F.road with a presence factor: in the plate's dark the road is not there yet, then its light comes up)
const RN = 240, RPTS = Array.from({ length: RN + 1 }, (_, k) => loopPt(k / RN)), RDIR = Array.from({ length: RN + 1 }, (_, k) => loopDir(k / RN));
export function road3(ctx, c, t, o = {}) {
  const base = o.road ?? .5, lit = o.lit || [], ticks = o.ticks ?? .5, hw = LOOP.w / 2, pres = clamp(o.pres ?? 1), warm = o.warm ?? 0;
  if (pres <= 0) return;
  const litAt = (u) => { let s = 0; for (const [u0, u1, a] of lit) { if (u1 - u0 >= 1) s = Math.max(s, a); else { const d = ((u - u0) % 1 + 1) % 1, len = ((u1 - u0) % 1 + 1) % 1; if (d <= len) s = Math.max(s, a * smooth(clamp(d / .012)) * smooth(clamp((len - d) / .012))); } } return s; };
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  for (const [w, mode, ga] of [[hw * 16, 'glow', .045], [hw * 5, 'glow', .1], [hw, 'core', 0]]) {
    let prev = null;
    for (let k = 0; k <= RN; k++) {
      const [x, z] = RPTS[k], [dx, dz] = RDIR[k], a = gp(c, x - dz * w, z + dx * w), b = gp(c, x + dz * w, z - dx * w);
      const cur = a && b ? [a, b] : null;
      if (cur && prev) {
        const [A, B] = prev, [Cc, D] = cur;
        if (!(Math.max(A[0], B[0], Cc[0], D[0]) < -50 || Math.min(A[0], B[0], Cc[0], D[0]) > W + 50 || Math.min(A[1], B[1], Cc[1], D[1]) > H + 50)) {
          const L1 = clamp(base * .55 + litAt((k - .5) / RN));
          if (mode === 'glow') { if (L1 >= .05) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(mixHex(P.halo1, P.halo0, warm), ga * L1 * pres); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(Cc[0], Cc[1]); ctx.lineTo(D[0], D[1]); ctx.lineTo(B[0], B[1]); ctx.closePath(); ctx.fill(); } }
          else { ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = pres; ctx.fillStyle = mixHex(mixHex(P.ind2, P.shade0, .5), mixHex(P.halo0, P.core1, .5 + .3 * warm), L1); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(Cc[0], Cc[1]); ctx.lineTo(D[0], D[1]); ctx.lineTo(B[0], B[1]); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; }
        }
      }
      prev = cur;
    }
  }
  if (ticks > 0) {
    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 40; i++) {
      const u = i / 40, [x, z] = loopPt(u), [dx, dz] = loopDir(u), a = gp(c, x - dz * hw * 2.2, z + dx * hw * 2.2), b = gp(c, x + dz * hw * 2.2, z - dx * hw * 2.2);
      if (!a || !b) continue;
      ctx.strokeStyle = rgba(P.halo1, .28 * ticks * pres * (.4 + .6 * clamp(base + litAt(u)))); ctx.lineWidth = Math.max(.8, 5 * a[2]); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    }
  }
  ctx.restore();
}
// a rounded square on the ground (the glyph of rule card II growing into the loop): centre (X, Z), half size hs, corner r
export function groundSquare(ctx, c, X, Z, hs, r, o = {}) {
  r = Math.min(r, hs); const pts = [];
  const arc = (ox, oz, a0) => { for (let k = 0; k <= 8; k++) { const a = a0 + k / 8 * Math.PI / 2; pts.push([ox + Math.cos(a) * r, oz + Math.sin(a) * r]); } };
  arc(X + hs - r, Z - hs + r, -Math.PI / 2); arc(X + hs - r, Z + hs - r, 0); arc(X - hs + r, Z + hs - r, Math.PI / 2); arc(X - hs + r, Z - hs + r, Math.PI);
  pts.push(pts[0]);
  const sp = pts.map((p) => gp(c, p[0], p[1])); if (sp.some((p) => !p)) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  F.trailSpan(ctx, sp.map((p) => [p[0], p[1]]), 0, 1, { w: o.w ?? 3, a: o.a ?? 1, spark: false });
  ctx.restore();
}
// a trail of light lying on the ground through world points [[X, Z], …] from u0 to u1 (screen-projected)
export function groundTrail(ctx, c, pts, u0, u1, o = {}) {
  const sp = pts.map((p) => gp(c, p[0], p[1])); if (sp.some((p) => !p)) return null;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const r = F.trailSpan(ctx, sp.map((p) => [p[0], p[1]]), u0, u1, { w: o.w ?? 3, a: o.a ?? 1, spark: o.spark });
  ctx.restore(); return r;
}

// ================================================================================================================== rule card II, lying down
// The plate draws ruleCard II live in screen space at (960, 520) w 1040. While upright we draw it live the same way (exact seam); as
// it lays itself down (rotating back about its bottom edge onto the board) it is a prerendered image warped strip by strip.
export const CARD = { Zb: 5004, Wc: 1600, wpx: 1040 };
const CW = 1880, CHh = 1500;
export const CARD_IMG = await (async () => {
  const cv = createCanvas(CW, CHh), x = cv.getContext('2d');
  F.ruleCard(x, 0, CW / 2, CHh / 2, CARD.wpx, { n: 'II', sub: 'everybody wins', glow: 1 });
  return loadImage(await cv.encode('png'));
})();
export function cardWorld(c, ix, iy, th, jx = 0) {
  const k = CARD.Wc / CARD.wpx, u = ix - CW / 2, v = iy - CHh / 2, h = CARD.wpx * .62, d = (h / 2 - v) * k;
  return wp(c, u * k + jx, BOARD.GY - d * Math.cos(th), CARD.Zb + d * Math.sin(th));
}
export function cardDown(ctx, c, t, th, o = {}) {
  const jx = 2 * drift(t, 1, 5) * CARD.Wc / CARD.wpx * (o.jit ?? 1);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = o.a ?? 1;
  if (th < 1e-4) {
    const ctr = cardWorld(c, CW / 2, CHh / 2, 0, jx), e = cardWorld(c, CW / 2 + CARD.wpx / 2, CHh / 2, 0, jx);
    if (ctr && e) F.ruleCard(ctx, t, ctr[0], ctr[1], (e[0] - ctr[0]) * 2, { n: 'II', sub: 'everybody wins', glow: 1 + .05 * Math.sin(t * 1.2) });
  } else {
    const N = 44;
    for (let i = 0; i < N; i++) {
      const y0 = i / N * CHh, y1 = (i + 1) / N * CHh, A = cardWorld(c, 0, y0, th, jx), B = cardWorld(c, CW, y0, th, jx), C = cardWorld(c, 0, y1, th, jx);
      if (!A || !B || !C) continue;
      const sh = y1 - y0;
      ctx.setTransform((B[0] - A[0]) / CW, (B[1] - A[1]) / CW, (C[0] - A[0]) / sh, (C[1] - A[1]) / sh, A[0], A[1]);
      ctx.drawImage(CARD_IMG, 0, y0, CW, Math.min(sh + 1.5, CHh - y0), 0, 0, CW, Math.min(sh + 1.5, CHh - y0));
    }
  }
  ctx.restore();
}
// where the glyph (the small rounded square of the card) lies when the card is flat
export const GLYPH = { X: 0, Z: CARD.Zb + (CARD.wpx * .31 + CARD.wpx * .36 - CARD.wpx * .06) * CARD.Wc / CARD.wpx, hs: CARD.wpx * .06 * CARD.Wc / CARD.wpx, r: CARD.wpx * .025 * CARD.Wc / CARD.wpx };

// ================================================================================================================== small props
// pop-up: a card that rises out of the board (it stands up from flat; anchored at the ground, origin = foot)
// a softer stamp than the kit's (f16 stamp): it settles down over .5 s from a little above, alpha from 0, no flash frame
export function stampSoft(ctx, t, text, x, y, o = {}) {
  const t0 = o.t0 ?? 0; if (t < t0 - .5) return;
  const size = o.size ?? 40, drop = sineIO(span(t, t0 - .5, t0 + .05)), k = 1.1 - .1 * drop, hit = span(t, t0, t0 + .5);
  const away = o.out != null ? sineIO(span(t, o.out, o.out + .7)) : 0; if (away >= 1) return;
  const tw = F.measure(text, size, false, 600) + size * text.length * .12, bw = tw + size * 1.2, bh = size * 1.75, ink = o.ink ?? P.cream;
  ctx.save(); ctx.translate(x, y - (1 - drop) * 30 - away * 40); ctx.rotate(o.rot ?? -.06); ctx.scale(k * (1 + .015 * Math.sin(hit * Math.PI)), k);
  ctx.globalAlpha = drop * (1 - away);
  const r = prng(text.length * 31 + 7);
  ctx.strokeStyle = ink; ctx.lineWidth = size * .08;
  ctx.beginPath(); ctx.roundRect(-bw / 2, -bh / 2, bw, bh, size * .18); ctx.stroke();
  ctx.lineWidth = size * .03; ctx.beginPath(); ctx.roundRect(-bw / 2 + size * .16, -bh / 2 + size * .16, bw - size * .32, bh - size * .32, size * .1); ctx.stroke();
  E.glowText(ctx, text, 0, size * .36, { size, weight: 600, align: 'center', spacing: .12, col: ink, glow: false });
  ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = 'rgba(0,0,0,.55)';
  for (let i = 0; i < 26; i++) { ctx.beginPath(); ctx.arc((r() - .5) * bw, (r() - .5) * bh, size * (.03 + r() * .05), 0, 6.29); ctx.fill(); }
  ctx.restore();
  if (hit > 0 && hit < 1) E.dust(ctx, 61, 120, x, y, bw * .6 * (.6 + hit), bh * .5, t, .4 * Math.sin(Math.PI * hit));
}
export function popUp(ctx, u, fn) { if (u <= 0) return; ctx.save(); ctx.scale(1, Math.max(.001, expoOut(clamp(u)) * (1 + .025 * Math.sin(Math.PI * clamp(u))))); fn(); ctx.restore(); }
export function satellite(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(o.rot ?? -.12); ctx.scale(s, s);
  halo(ctx, 0, 0, 90, .45, P.halo0, P.core1);
  for (const sd of [-1, 1]) {                 // the two solar wings: panels of light with cell lines
    ctx.strokeStyle = rgba(P.halo1, .9); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sd * 18, 0); ctx.lineTo(sd * 30, 0); ctx.stroke();
    const p = new Path2D(); p.rect(sd > 0 ? 30 : -30 - 74, -17, 74, 34);
    ctx.fillStyle = lin(ctx, 0, -17, 0, 17, [[0, mixHex(P.blue0, P.halo1, .55)], [1, mixHex(P.blue1, P.halo0, .35)]]); ctx.fill(p);
    ctx.strokeStyle = rgba(P.night1, .7); ctx.lineWidth = 2; ctx.stroke(p);
    for (let k = 1; k < 4; k++) { const xx = sd > 0 ? 30 + k * 18.5 : -30 - k * 18.5; ctx.beginPath(); ctx.moveTo(xx, -17); ctx.lineTo(xx, 17); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(sd > 0 ? 30 : -104, 0); ctx.lineTo(sd > 0 ? 104 : -30, 0); ctx.stroke();
  }
  ctx.fillStyle = rad(ctx, -4, -6, 26, [[0, P.core0], [.6, P.core1], [1, P.halo0]]); ctx.beginPath(); ctx.roundRect(-18, -20, 36, 40, 5); ctx.fill();   // the body
  ctx.strokeStyle = rgba(P.shade0, .8); ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = P.halo1; ctx.beginPath(); ctx.ellipse(0, 26, 12, 6, 0, 0, Math.PI); ctx.fill();                                          // the dish (pointing down)
  ctx.strokeStyle = P.halo1; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 20); ctx.lineTo(0, 30); ctx.stroke();
  ctx.restore();
}
// a map pin of light (the GPS fix), tip on the ground at (0, 0), height h (world units in stand())
export function pin(ctx, t, h, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || h <= 0) return;
  const r = h * .32, cy = -h + r, p = new Path2D();
  p.moveTo(0, 0); p.bezierCurveTo(-r * .35, -h * .3, -r, cy + r * .55, -r, cy); p.arc(0, cy, r, Math.PI, 0); p.bezierCurveTo(r, cy + r * .55, r * .35, -h * .3, 0, 0); p.closePath();
  ctx.save(); ctx.globalAlpha *= a;
  glowFill(ctx, p, h * .25, .5, P.blue0); glowFill(ctx, p, h * .06, .7, P.halo0);
  ctx.fillStyle = rad(ctx, -r * .3, cy - r * .3, h, [[0, P.core0], [.4, P.core1], [1, P.halo0]]); ctx.fill(p);
  ctx.fillStyle = mixHex(P.shade0, P.night1, .3); ctx.beginPath(); ctx.arc(0, cy, r * .42, 0, 6.29); ctx.fill();
  ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.scale(1, .2); ctx.fillStyle = rad(ctx, 0, 0, h * .7, [[0, rgba(P.halo0, .5 * a)], [1, rgba(P.halo0, 0)]]); ctx.beginPath(); ctx.arc(0, 0, h * .7, 0, 6.29); ctx.fill(); ctx.restore();
}

// ---- one building that grows: the Baden-Württemberg house (4 bays, 2 → 4 floors) widens into the Vienna block (12 bays, 5 floors).
// Windows sit on a fixed grid (bay BX, floor FY) and are revealed by the growing wall (clip), so nothing pops.
export const BX = 220, FY = 210;
export function blockB(ctx, t, w, h, o = {}) {
  const x0 = -w / 2, lit = o.lit || (() => .35), wcol = o.wcol || (() => 0);
  const body = new Path2D(); body.rect(x0, -h, w, h);
  ctx.fillStyle = lin(ctx, x0, 0, -x0, 0, [[0, P.night1], [.5, mixHex(P.night1, P.ind2, .6)], [1, P.ind1]]); ctx.fill(body);
  ctx.save(); ctx.clip(body);
  const nb = Math.ceil(w / BX / 2) + 1, nf = Math.ceil(h / FY);
  for (let f = 0; f < nf; f++) for (let b = -nb; b < nb; b++) {
    const cx = (b + .5) * BX, y = -(f + 1) * FY + FY * .28, ww = BX * .46, wh = FY * .46;
    const L = clamp(lit(b, f)), warm = clamp(wcol(b, f));
    const col = mixHex(mixHex(P.night0, P.ind2, .6), mixHex(mixHex(P.halo2, COOL.mid, .55 * (1 - warm)), mixHex(P.halo0, P.core1, .45), warm), L);
    if (L > .25) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(mixHex(COOL.edge, P.halo0, warm), .16 * L); ctx.fillRect(cx - ww, y - wh * .5, ww * 2, wh * 2); ctx.restore(); }
    ctx.fillStyle = col; ctx.fillRect(cx - ww / 2, y, ww, wh);
    if (o.who) o.who(ctx, b, f, cx, y, ww, wh);
  }
  // floor bands and the ground floor: arches (the Viennese Hof) once the block is wide
  ctx.fillStyle = rgba(P.night0, .35); for (let f = 1; f < nf; f++) ctx.fillRect(x0, -f * FY - 3, w, 6);
  ctx.restore();
  ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x0, -h); ctx.lineTo(-x0, -h); ctx.lineTo(-x0, 0); ctx.stroke();
  ctx.fillStyle = mixHex(P.night1, P.ind2, .4); ctx.fillRect(x0 - 12, -h - 26, w + 24, 26);                 // the cornice
  const arch = clamp(o.arch ?? 0);
  if (arch > 0) { ctx.save(); ctx.globalAlpha *= arch; ctx.fillStyle = mixHex(P.night0, P.halo1, .3); const aw = 170, ah = 190; ctx.beginPath(); ctx.moveTo(-aw / 2, 0); ctx.lineTo(-aw / 2, -ah + aw / 2); ctx.arc(0, -ah + aw / 2, aw / 2, Math.PI, 0); ctx.lineTo(aw / 2, 0); ctx.closePath(); ctx.fill(); ctx.restore(); }
  else { ctx.fillStyle = mixHex(P.night0, P.halo1, .2); ctx.fillRect(BX * .5 - 40, -150, 80, 150); }
}

// ---- the section cut under the middle field: the earth face (front of the cut ground). Origin = ground at the cut, depth down = +.
// o: { open 0..1 (how far the cut has opened), plotW, warm 0..1 (the land layer glows: nobody made it), mark 0..1 (outline of the plot) }
export function earth(ctx, t, o = {}) {
  const D = 1000 * expoOut(clamp(o.open ?? 1)), pw = o.plotW ?? 900, warm = o.warm ?? 0, mark = o.mark ?? 0;
  if (D <= 1) return;
  ctx.fillStyle = lin(ctx, 0, 0, 0, 1000, [[0, mixHex(P.night1, P.shade0, .22)], [.35, mixHex(P.night1, P.shade0, .1)], [1, P.night0]]); ctx.fillRect(-9000, 0, 18000, D);
  ctx.save(); ctx.beginPath(); ctx.rect(-9000, 0, 18000, D); ctx.clip();
  // strata: soft darker bands
  for (const [y, h, a] of [[120, 40, .25], [330, 60, .3], [560, 50, .25], [800, 80, .3]]) { ctx.fillStyle = rgba(P.night0, a); ctx.fillRect(-9000, y, 18000, h); }
  // the plot's land: the slab under the building
  const slab = new Path2D(); slab.rect(-pw / 2, 0, pw, 640);
  ctx.fillStyle = lin(ctx, 0, 0, 0, 640, [[0, mixHex(mixHex(P.ind2, P.shade0, .45), P.halo0, .55 * warm)], [.6, mixHex(mixHex(P.night1, P.shade0, .3), P.halo1, .4 * warm)], [1, mixHex(P.night1, P.shade0, .15 + .2 * warm)]]); ctx.fill(slab);
  if (warm > 0) { glowFill(ctx, slab, 50, .35 * warm, P.halo0); }
  if (mark > 0) { ctx.strokeStyle = rgba(mixHex(P.halo1, P.core1, warm), .8 * mark); ctx.lineWidth = 6; ctx.setLineDash([22, 14]); ctx.stroke(slab); ctx.setLineDash([]); }
  E.dust(ctx, 909, 160, 0, 340, pw * .32, 200, t, .35 + .4 * warm, mixHex(P.shade1, P.halo2, warm));
  ctx.restore();
  // the cut line: the ground's lit edge
  ctx.fillStyle = mixHex(P.blue0, P.halo1, .35); ctx.fillRect(-9000, -3, 18000, 6);
}

// ---- Vienna in the distance (they rise out of the board): the Riesenrad and the spire of St. Stephen's. Silhouettes with a blue rim.
export function riesenrad(ctx, t, r, o = {}) {
  const rot = t * .05, cy = -r - r * .22, rimc = rgba(P.blue0, .95);
  ctx.strokeStyle = P.ind2; ctx.lineWidth = r * .05; ctx.lineCap = 'round';
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * r * .55, 0); ctx.lineTo(0, cy); ctx.stroke(); }
  ctx.strokeStyle = mixHex(P.ind2, P.blue1, .4); ctx.lineWidth = r * .028; ctx.beginPath(); ctx.arc(0, cy, r, 0, 6.29); ctx.stroke(); ctx.beginPath(); ctx.arc(0, cy, r * .93, 0, 6.29); ctx.stroke();
  ctx.lineWidth = r * .008; for (let k = 0; k < 15; k++) { const a = rot + k / 15 * 6.283; ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(Math.cos(a) * r * .93, cy + Math.sin(a) * r * .93); ctx.stroke(); }
  ctx.strokeStyle = rimc; ctx.lineWidth = r * .012; ctx.beginPath(); ctx.arc(0, cy, r * 1.01, Math.PI * .95, Math.PI * 1.75); ctx.stroke();
  for (let k = 0; k < 15; k++) {   // the gondolas (little red-wagon cabins, here warm lit windows) hang below the rim
    const a = rot + k / 15 * 6.283, gx = Math.cos(a) * r, gy = cy + Math.sin(a) * r;
    ctx.fillStyle = P.ind1; ctx.fillRect(gx - r * .07, gy, r * .14, r * .1);
    ctx.fillStyle = rgba(P.halo0, .55 + .35 * (o.lit ?? 0)); ctx.fillRect(gx - r * .045, gy + r * .02, r * .09, r * .04);
  }
  ctx.fillStyle = P.night1; ctx.beginPath(); ctx.arc(0, cy, r * .06, 0, 6.29); ctx.fill();
}
export function spire(ctx, t, h) {
  const p = new Path2D(), b = h * .5;
  p.moveTo(-b * .7, 0); p.lineTo(-b * .7, -h * .26); p.lineTo(-b * .3, -h * .36); p.lineTo(-b * .16, -h * .36); p.lineTo(-b * .16, -h * .46); p.lineTo(-b * .02, -h);
  p.lineTo(b * .02, -h); p.lineTo(b * .16, -h * .46); p.lineTo(b * .16, -h * .36); p.lineTo(b * .55, -h * .36); p.lineTo(b * .9, -h * .22); p.lineTo(b * .9, 0); p.closePath();
  ctx.fillStyle = lin(ctx, -b, 0, b, 0, [[0, P.night1], [.6, mixHex(P.night1, P.ind2, .7)], [1, P.ind1]]); ctx.fill(p);
  ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = h * .006; ctx.beginPath(); ctx.moveTo(-b * .02, -h); ctx.lineTo(-b * .16, -h * .46); ctx.lineTo(-b * .16, -h * .36); ctx.stroke();
  for (let k = 0; k < 4; k++) { ctx.fillStyle = rgba(P.halo1, .4); ctx.fillRect(-b * .05, -h * (.5 + k * .1), b * .1, h * .03); }   // little lit slits
}
// ---- a wind turbine: tapered tower, nacelle, three blades (rot rad). o.warm 0..1: warm (co-op) vs cool-cream (city utility) light
export function turbine(ctx, t, h, o = {}) {
  const warm = o.warm ?? .5, lt = o.light ?? 0, rot = o.rot ?? 0, hub = [0, -h], L = h * .4;
  const lc = mixHex(mixHex(COOL.core, COOL.mid, .35), P.halo0, warm), body = mixHex(P.ind2, P.blue1, .5);
  const tw = new Path2D(); tw.moveTo(-h * .026, 0); tw.lineTo(-h * .013, -h); tw.lineTo(h * .013, -h); tw.lineTo(h * .026, 0); tw.closePath();
  ctx.fillStyle = lin(ctx, -h * .026, 0, h * .026, 0, [[0, mixHex(body, P.night1, .4)], [.6, body], [1, mixHex(body, lc, .45 * lt)]]); ctx.fill(tw);
  ctx.fillStyle = mixHex(body, lc, .3 * lt); ctx.beginPath(); ctx.roundRect(-h * .035, -h - h * .028, h * .1, h * .05, h * .014); ctx.fill();
  for (let k = 0; k < 3; k++) {
    const a = rot + k * 2.0944, ca = Math.cos(a), sa = Math.sin(a), bp = new Path2D();
    bp.moveTo(hub[0] - sa * h * .016, hub[1] + ca * h * .016); bp.quadraticCurveTo(hub[0] + ca * L * .5 - sa * h * .022, hub[1] + sa * L * .5 + ca * h * .022, hub[0] + ca * L, hub[1] + sa * L);
    bp.lineTo(hub[0] + ca * L * .2 + sa * h * .028, hub[1] + sa * L * .2 - ca * h * .028); bp.closePath();
    ctx.fillStyle = mixHex(mixHex(body, P.cream, .25), lc, .55 * lt); ctx.fill(bp);
  }
  ctx.fillStyle = mixHex(body, lc, .4 + .6 * lt); ctx.beginPath(); ctx.arc(hub[0], hub[1], h * .024, 0, 6.29); ctx.fill();
  if (lt > 0) halo(ctx, hub[0], hub[1], h * .2, .5 * lt, lc, mixHex(lc, P.core0, .5));
  // the light on the water at its foot
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.scale(1, .14); ctx.fillStyle = rad(ctx, 0, 0, h * .28, [[0, rgba(lc, .4 * lt)], [1, rgba(lc, 0)]]); ctx.beginPath(); ctx.arc(0, 0, h * .28, 0, 6.29); ctx.fill(); ctx.restore();
}
// ---- the data-centre hall (Loudoun): a long low box, ribbed, rooftop chillers with fans, a lit door, small status lights (cool)
export function dcHall(ctx, t, w, h, o = {}) {
  const x0 = -w / 2, blink = o.blink ?? 1, dl = o.door ?? .6;
  const body = new Path2D(); body.rect(x0, -h, w, h);
  ctx.fillStyle = lin(ctx, x0, 0, -x0, 0, [[0, P.night1], [.6, mixHex(P.night1, P.ind2, .55)], [1, P.ind1]]); ctx.fill(body);
  ctx.strokeStyle = rgba(P.night0, .5); ctx.lineWidth = 6; for (let x = x0 + 70; x < -x0; x += 70) { ctx.beginPath(); ctx.moveTo(x, -h + 30); ctx.lineTo(x, -20); ctx.stroke(); }
  for (let k = 0; k < 7; k++) {   // rooftop chillers
    const cx = x0 + w * (k + .5) / 7; ctx.fillStyle = mixHex(P.ind2, P.blue1, .3); ctx.fillRect(cx - 95, -h - 70, 190, 70);
    for (const s of [-1, 1]) { ctx.strokeStyle = rgba(COOL.mid, .5); ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(cx + s * 45, -h - 70, 30, Math.PI, 0); ctx.stroke(); }
  }
  ctx.strokeStyle = rgba(P.blue0, .85); ctx.lineWidth = 7; ctx.strokeRect(x0, -h, w, h);
  for (let k = 0; k < 22; k++) {  // status lights: a calm cool row, blinking
    const x = x0 + 60 + k * (w - 120) / 21, ph = (k * 0.37) % 1, on = blink * (.55 + .45 * Math.sin(t * 3 + ph * 6.3));
    ctx.fillStyle = rgba(COOL.core, .2 + .7 * on); ctx.fillRect(x - 6, -h * .62, 12, 12);
  }
  const dp = new Path2D(); dp.rect(-90, -260, 180, 260);
  glowFill(ctx, dp, 70, .5 * dl, P.halo0); ctx.fillStyle = mixHex(P.night1, mixHex(P.halo0, P.core1, .5), dl); ctx.fill(dp);
}
// ---- the town hall (where the zoning meetings are): facade with a pediment and a big window (a hole into the lit room) and a door.
export const TH = { w: 1200, h: 820, win: [-330, -560, 560, 330], door: [380, 0, 150, 300] };   // win: x, y(top), w, h
export function townHallFacade(ctx, t, o = {}) {
  const { w, h } = TH, x0 = -w / 2, [wx, wy, ww, wh] = TH.win, [dx, , dw, dh] = TH.door;
  const p = new Path2D(); p.rect(x0, -h, w, h); p.moveTo(wx, wy); p.lineTo(wx, wy + wh); p.lineTo(wx + ww, wy + wh); p.lineTo(wx + ww, wy); p.closePath();
  ctx.fillStyle = lin(ctx, x0, 0, -x0, 0, [[0, P.night1], [.55, mixHex(P.night1, P.ind2, .6)], [1, P.ind1]]); ctx.fill(p, 'evenodd');
  for (const px of [-520, -400, 290, 520]) { ctx.fillStyle = mixHex(P.ind2, P.blue1, .25); ctx.fillRect(px - 22, -h + 40, 44, h - 40); }   // pilasters
  ctx.fillStyle = mixHex(P.night1, P.ind2, .7); ctx.beginPath(); ctx.moveTo(x0 - 40, -h); ctx.lineTo(0, -h - 230); ctx.lineTo(-x0 + 40, -h); ctx.closePath(); ctx.fill();   // pediment
  ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 8; ctx.stroke();
  ctx.fillStyle = mixHex(P.ind2, P.blue1, .3); ctx.fillRect(x0 - 40, -60, w + 80, 60);   // steps
  const L = o.lit ?? .7;
  ctx.strokeStyle = rgba(P.halo1, .55 + .35 * L); ctx.lineWidth = 10; ctx.strokeRect(wx, wy, ww, wh);   // the window frame
  ctx.strokeStyle = rgba(P.night1, .9 * (o.mull ?? 1)); ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.moveTo(wx, wy + wh * .32); ctx.lineTo(wx + ww, wy + wh * .32); ctx.stroke();
  const dp = new Path2D(); dp.rect(dx, -dh - 60, dw, dh);
  glowFill(ctx, dp, 40, .4 * (o.door ?? .5), P.halo0); ctx.fillStyle = mixHex(P.night0, P.halo1, .6 * (o.door ?? .5)); ctx.fill(dp);
}
// ---- the shelf of encyclopedias (callback 3.06): a dark case, two boards of gold spines. o.glow 0..1 (the value that stays)
export function shelf(ctx, t, o = {}) {
  const w = 1100, h = 640, x0 = -w / 2, g = o.glow ?? .5;
  ctx.fillStyle = lin(ctx, x0, 0, -x0, 0, [[0, P.night1], [1, P.ind1]]); ctx.fillRect(x0, -h, w, h);
  ctx.strokeStyle = rgba(P.blue0, .85); ctx.lineWidth = 8; ctx.strokeRect(x0, -h, w, h);
  const r = prng(3306);
  for (const by of [-h + 40, -h / 2 + 20]) {
    let x = x0 + 40; let i = 0;
    while (x < -x0 - 60) {
      const bw = 52 + r() * 10, bh = 220 + r() * 30, L = g * (.75 + .25 * Math.sin(t * .8 + i));
      ctx.fillStyle = mixHex(mixHex(P.shade0, P.night1, .35), mixHex(P.halo0, P.core1, .4), L); ctx.fillRect(x, by + 250 - bh, bw - 6, bh);
      ctx.fillStyle = rgba(P.night1, .55); ctx.fillRect(x, by + 250 - bh + 30, bw - 6, 10); ctx.fillRect(x, by + 250 - 40, bw - 6, 10);
      x += bw; i++;
    }
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .35); ctx.fillRect(x0, by + 250, w, 18);
  }
  if (g > .3) { const p = new Path2D(); p.rect(x0 + 30, -h + 30, w - 60, h - 60); glowFill(ctx, p, 60, .25 * g, P.halo0); }
}
// the kid (Lagos) and the plumber (Ohio): indigo people (no yellow), lit from the road behind them
export function kid(ctx, t, x, h, o = {}) {
  const hd = E.person(ctx, x, 0, h, { dir: 1, light: -1, armR: [1.2, 2.1], armL: [-.15, -.1], look: .2, rim: o.rim });
  const [px, py] = hd.R;   // a phone with the GPS fix on it
  ctx.fillStyle = P.night0; ctx.fillRect(px - 9, py - 28, 18, 30);
  ctx.fillStyle = mixHex(P.blue1, P.halo0, .6); ctx.fillRect(px - 7, py - 26, 14, 24);
  halo(ctx, px, py - 14, 40, .5 * (o.lit ?? 1), P.halo0, P.core1);
}
export function plumber(ctx, t, x, h, o = {}) {
  const hd = E.person(ctx, x, 0, h, { dir: -1, light: 1, armR: [.12, .05], armL: [-.2, -.1], rim: o.rim, long: false });
  const [px, py] = hd.R;   // the toolbox
  ctx.fillStyle = mixHex(P.ind2, P.blue1, .45); ctx.fillRect(px - 34, py + 2, 68, 40);
  ctx.strokeStyle = rgba(P.halo1, .7); ctx.lineWidth = 3; ctx.strokeRect(px - 34, py + 2, 68, 40);
  ctx.beginPath(); ctx.moveTo(px - 14, py + 2); ctx.lineTo(px - 14, py - 6); ctx.lineTo(px + 14, py - 6); ctx.lineTo(px + 14, py + 2); ctx.stroke();
  ctx.fillStyle = P.ind1; ctx.beginPath(); ctx.ellipse(x + 2, -h * .95, h * .085, h * .03, 0, 0, 6.29); ctx.fill();   // cap brim
}
// a label in screen space: a big line + a small line (+ source), rising from its baseline; u in, out (sinks)
export function label(ctx, x, y, l1, l2, u, o = {}) {
  if (u <= 0) return;
  const al = o.align ?? 'left', s1 = o.s1 ?? 44, s2 = o.s2 ?? 30;
  F.maskLine(ctx, [[l1, o.warm1 ?? 0]], x, y, s1, u, { serif: o.serif1 ?? false, weight: 600, align: al, col: P.cream });
  if (l2) F.maskLine(ctx, [[l2, 0]], x, y + s2 * 1.55, s2, F.rise(clamp(u * 1.1 - .1)), { serif: false, weight: 600, align: al, col: P.halo2, glow: false });
  if (o.src) F.maskLine(ctx, [[o.src, 0]], x, y + s2 * 1.55 + 40, 24, F.rise(clamp(u * 1.15 - .15)), { serif: false, weight: 600, align: al, col: P.halo2, glow: false });
}
