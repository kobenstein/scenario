// Film 8 · the one night sky of the minute: gradient, the Milky Way, ~2600 stars as directions (projected through the real camera, so a tilt or
// a turn moves them exactly like the world), an optional dawn, and the lens of the horizon light (stars bend away round it, an Einstein ring).
//   drawSky(ctx, t, C, o)   o: { lens: { x, y, th (ring radius px), R (reach px) }, dawn 0..1, dawnAz (rad), mw 1, stars 1 }
//   skyDir(az, el) → [x, y, z]   direction vector (az 0 = +Z, > 0 to the right)
// The Milky Way is a cached band (Film 4 c17's recipe: fbm star clouds, dust rifts, stipple, 26k fine stars), placed along a fixed path on the sky.
import { rgba, clamp, prng } from '../engine.mjs';
import { vnoise, fbm, stipple, layer } from './art.mjs';
import { toImg, best, TAU, mixHex, W, H } from './s8_kit.mjs';

export const DEEP = ['#04050f', '#0a0d26', '#141436'];
export const HORIZON = '#1f1c47';
export const skyDir = (az, el) => [Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)];

const STARS = (() => {
  const r = prng(8088), s = [];
  for (let i = 0; i < 9000; i++) {
    const az = (r() * 2 - 1) * Math.PI, u = r() * .97, el = Math.asin(u) + .004, m = r();
    s.push({ d: skyDir(az, el), s: m < .93 ? .4 + r() * .75 : m < .99 ? 1.05 + r() * .9 : 1.9 + r() * 1.1, ph: r() * TAU, f: .4 + r() * 1.6, warm: r() < .08 });
  }
  return s;
})();

// ---------------------------------------------------------------- gravitational lens on the drawn sky: concentric annuli of the patch round
// the light, each scaled about the centre by r'/r with r = r' − θ²/r' (point lens), so everything behind (stars, the Milky Way) bends round it
const LP = layer(900, 900);
function lensPatch(ctx, t, C, o, L, hy) {
  const R = Math.min(440, L.R), th = L.th, D = Math.ceil(2 * R), [pc, pg] = LP;
  pg.setTransform(1, 0, 0, 1, 0, 0); pg.clearRect(0, 0, 900, 900);
  pg.save(); pg.beginPath(); pg.rect(0, 0, D, D); pg.clip(); paintSky(pg, t, C, { ...o, lens: null }, L.x - R, L.y - R); pg.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, hy); ctx.clip();

  const N = 30;
  for (let i = N; i >= 1; i--) {
    const r1 = R * Math.pow(i / N, 1.25), r0 = R * Math.pow((i - 1) / N, 1.25), rm = (r0 + r1) / 2, rs = rm - th * th / rm;
    if (Math.abs(rs) > R * .98 || rm < th * .25) continue;
    const sc = rm / rs;
    ctx.save(); ctx.beginPath(); ctx.arc(L.x, L.y, r1 + .6, 0, TAU); if (r0 > .5) { ctx.moveTo(L.x + r0, L.y); ctx.arc(L.x, L.y, r0, 0, TAU); } ctx.clip('evenodd');
    ctx.translate(L.x, L.y); ctx.scale(sc, sc); ctx.drawImage(pc, 0, 0, D, D, -R, -R, D, D); ctx.restore();
  }
  const sh = ctx.createRadialGradient(L.x, L.y, 0, L.x, L.y, th * 1.02); sh.addColorStop(0, rgba('#02030a', .9)); sh.addColorStop(.8, rgba('#03040c', .78)); sh.addColorStop(1, rgba('#03040c', 0));
  ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(L.x, L.y, th * 1.02, 0, TAU); ctx.fill();
  ctx.restore();
}

// ---------------------------------------------------------------- the Milky Way band (sky pixels at F = 1400: 1 px = 1/1400 rad)
const MW = { w: 4600, h: 1150, az: -.36, el: .3, tilt: .62 };
let MWI = null;
function mwLayer() {
  if (MWI) return best(MWI);
  const w = MW.w, h = MW.h, q = 4, lw = Math.ceil(w / q), lh = Math.ceil(h / q);
  const axisY = (X) => h / 2 + 34 * Math.sin(X * .0011 + .6) + 16 * Math.sin(X * .0031 + 2.1);
  const halfW = (X) => 190 + 40 * Math.sin(X * .0007 + 1.3) + 60 * Math.exp(-(((X - 2100) / 600) ** 2));
  const coreK = (X) => Math.exp(-(((X - 2100) / 700) ** 2));
  const ends = (X) => clamp(X / 700) * clamp((w - X) / 700);
  const [dc, dg] = layer(lw, lh), img = dg.createImageData(lw, lh), p = img.data, n1 = vnoise(17), n2 = vnoise(29), n3 = vnoise(43);
  for (let j = 0; j < lh; j++) for (let i = 0; i < lw; i++) {
    const X = i * q, Y = j * q, ay = axisY(X), hw = halfW(X), v = (Y - ay) / hw, ck = coreK(X);
    const prof = Math.exp(-v * v * 2.1) * (.6 + .4 * ends(X));
    const cloud = .55 + .9 * (fbm(n1, X * .006, Y * .012, 4) - .5) * 1.6;
    const rift = Math.exp(-(((Y - ay + 16 + 30 * Math.sin(X * .0024)) / (22 + 16 * fbm(n2, X * .004, 0, 2))) ** 2)) * (.55 + .45 * fbm(n2, X * .009, Y * .01, 3));
    const lane2 = Math.exp(-(((Y - ay - 62 - 20 * Math.sin(X * .0017 + 1)) / 14) ** 2)) * clamp(fbm(n3, X * .005, 3, 3) * 1.8 - .55);
    const d = prof * clamp(cloud) * (1 - .8 * clamp(rift * 1.35)) * (1 - .6 * lane2) * (1 + .7 * ck) * ends(X);
    const k = (j * lw + i) * 4, warm = clamp(ck * 1.2 + .1 * (1 - Math.abs(v)));
    p[k] = 205 + 50 * warm; p[k + 1] = 214 + 24 * warm; p[k + 2] = 255 - 50 * warm; p[k + 3] = Math.round(255 * clamp(d * .3));
  }
  dg.putImageData(img, 0, 0);
  const [c, g] = layer(w, h);
  g.imageSmoothingEnabled = true; g.drawImage(dc, 0, 0, lw, lh, 0, 0, w, h);
  stipple(c, { k: .55, g: 1.1, seed: 7, boost: 2.2 });
  const r = prng(733);
  for (let i = 0; i < 24000; i++) {
    const X = r() * w, ay = axisY(X), hw = halfW(X), v = (r() + r() + r() - 1.5) * 1.15, Y = ay + v * hw;
    if (Y < 4 || Y > h - 4) continue;
    const ck = coreK(X), keep = Math.exp(-v * v * 1.6) * (1 + .6 * ck) * ends(X);
    if (r() > keep) continue;
    const m = r(), sz = m < .93 ? .35 + r() * .5 : .8 + r() * .7, a = m < .93 ? .25 + .45 * r() : .6 + .4 * r();
    const col = m > .985 ? '255,214,170' : m > .96 ? '214,226,255' : '238,236,228';
    g.fillStyle = `rgba(${col},${a})`; g.beginPath(); g.arc(X, Y, sz, 0, TAU); g.fill();
    if (sz > 1.2) { g.fillStyle = `rgba(${col},${a * .08})`; g.beginPath(); g.arc(X, Y, sz * 4.5, 0, TAU); g.fill(); }
  }
  MWI = toImg(c); return best(MWI);
}
export function prepareSky() { mwLayer(); }

const BK = [], HALO = [];
export function drawSky(ctx, t, C, o = {}) {
  paintSky(ctx, t, C, o, 0, 0);
  const L = o.lens;
  if (L && L.th > .3 && o.lensImage !== false) lensPatch(ctx, t, C, o, L, C.hy);
}
function paintSky(ctx, t, C, o, ox, oy) {
  const hy = C.hy, F = C.F, z = F / 1400;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, -ox, -oy); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  // 1 · gradient: the atmosphere is fixed to the horizon
  const top = hy - 1250 * z, g = ctx.createLinearGradient(0, top, 0, hy + 2);
  g.addColorStop(0, DEEP[0]); g.addColorStop(.6, DEEP[1]); g.addColorStop(.9, DEEP[2]); g.addColorStop(1, HORIZON);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, Math.min(H, hy + 4));
  const dawn = o.dawn || 0;
  if (dawn > 0) {   // dawn: a warm band at the horizon, strongest toward dawnAz, the night above lifts toward violet
    const D = C.D(...skyDir(o.dawnAz ?? 0, 0)), dx = D ? D[0] : W / 2;
    const vg = ctx.createLinearGradient(0, hy - 700 * z, 0, hy); vg.addColorStop(0, rgba('#2a2350', .0)); vg.addColorStop(.55, rgba('#4a3570', .55 * dawn)); vg.addColorStop(.85, rgba('#b8607a', .55 * dawn)); vg.addColorStop(1, rgba('#f2a070', .8 * dawn));
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, Math.min(H, hy + 2));
    ctx.save(); ctx.translate(dx, hy); ctx.scale(1, .32);
    const rg = ctx.createRadialGradient(0, 0, 0, 0, 0, 1300 * z); rg.addColorStop(0, rgba('#ffe2b0', .95 * dawn)); rg.addColorStop(.2, rgba('#ffb36a', .6 * dawn)); rg.addColorStop(.55, rgba('#d0607a', .25 * dawn)); rg.addColorStop(1, rgba('#3a2a60', 0));
    ctx.fillStyle = rg; ctx.beginPath(); ctx.rect(-W * 2, -4000, W * 4, 4000); ctx.fill(); ctx.restore();
  }
  if (hy < -40) { ctx.restore(); return; }
  // 2 · the Milky Way
  const mwA = (o.mw ?? 1) * (1 - .85 * dawn);
  if (mwA > 0) {
    const p0 = C.D(...skyDir(MW.az, MW.el));
    if (p0) {
      const p1 = C.D(...skyDir(MW.az + .05 * Math.cos(MW.tilt) / Math.cos(MW.el), MW.el - .05 * Math.sin(MW.tilt)));
      const ang = p1 ? Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) : MW.tilt;
      ctx.save(); ctx.translate(p0[0], p0[1]); ctx.rotate(ang); ctx.scale(z, z); ctx.globalAlpha = mwA;
      ctx.drawImage(mwLayer(), -MW.w / 2, -MW.h / 2); ctx.restore();
    }
  }
  // 3 · stars (batched by brightness), lensed round the horizon light
  const L = o.lens, sa = (o.stars ?? 1) * (1 - .8 * dawn), arcs = [];
  for (const S of STARS) {
    const p = C.D(S.d[0], S.d[1], S.d[2]); if (!p) continue;
    let [x, y] = p; if (x < -10 || x > W + 10 || y < -10 || y > hy - 1) continue;
    const tw = .55 + .45 * Math.sin(t * S.f + S.ph), s = S.s * Math.sqrt(z);
    if (L && L.th > .3 && o.lensImage === false) {
      const dx = x - L.x, dy = y - L.y, r = Math.hypot(dx, dy);
      if (r < L.R && r > .5) {
        const fall = clamp((L.R - r) / (L.R * .35)), th = L.th * fall, r1 = (r + Math.sqrt(r * r + 4 * th * th)) / 2, r2 = (r - Math.sqrt(r * r + 4 * th * th)) / 2, a = Math.atan2(dy, dx);
        arcs.push([a, r1, s, tw * sa, r1 / r]);
        if (r < L.th * 2.2) arcs.push([a, -r2, s * .7, tw * sa * .5 * clamp(1 - r / (L.th * 2.2)), -r2 / r, Math.PI]);
        continue;
      }
    }
    const q = Math.round((.35 + .65 * tw) * sa * 23), k = (s > 1.2 ? 24 : 0) + q;
    (BK[k] || (BK[k] = [])).push(x, y, s);
    if (s > 2) HALO.push(x, y, s, tw * sa);
  }
  for (let k = 0; k < 48; k++) {
    const b = BK[k]; if (!b || !b.length) continue;
    ctx.fillStyle = `rgba(243,239,226,${(k % 24) / 23 * (k >= 24 ? 1 : .8)})`; ctx.beginPath();
    for (let i = 0; i < b.length; i += 3) { ctx.moveTo(b[i] + b[i + 2], b[i + 1]); ctx.arc(b[i], b[i + 1], b[i + 2], 0, TAU); }
    ctx.fill(); b.length = 0;
  }
  for (let i = 0; i < HALO.length; i += 4) { ctx.fillStyle = `rgba(255,241,214,${.07 * HALO[i + 3]})`; ctx.beginPath(); ctx.arc(HALO[i], HALO[i + 1], HALO[i + 2] * 5, 0, TAU); ctx.fill(); }
  HALO.length = 0;
  if (arcs.length) {   // lensed stars: stretched along the ring (tangential arcs), the inner images dimmer, on the other side
    ctx.lineCap = 'round';
    for (const [a0, rr, s, al, stretch, flip] of arcs) {
      const a = a0 + (flip || 0), half = Math.min(.9, (s * 1.3 * stretch) / Math.max(4, rr));
      if (rr > L.R * 1.2) continue;
      ctx.strokeStyle = `rgba(232,246,255,${clamp(al * (.5 + .5 * Math.min(2, stretch) / 2))})`; ctx.lineWidth = Math.max(.7, s * 1.2);
      ctx.beginPath(); ctx.arc(L.x, L.y, rr, a - half, a + half); ctx.stroke();
    }
  }
  ctx.restore();
}
