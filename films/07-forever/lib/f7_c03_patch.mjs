// Film 7 · c03 · a hi-res patch of the night Earth around the curve's foot (for the push down to the stage in 3.07, zoom up to ~6×).
// COPIED from lib/f7_kit.mjs buildEarth('cap') (same land function, same city clusters, same hatching in world units), rendered at
// k = 6 px / world unit for one small region, so the zoomed land stays engraved instead of upscaled. Edges feathered (6 % of the rect), so
// it sits invisibly on top of the kit's cap. Also redraws what earthHorizon draws on top of the cap there: the twinkling city points
// (CITYLIVE copy) and the atmosphere band.
//   await patchPrepare()       builds the Image once (~3 s)
//   earthPatch(ctx, t, cam)    draw after earthHorizon (only when heat = 0: the heat veil is not repeated here); the band's inner half is baked in
import { loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, mix, prng, canvas } from '../engine.mjs';
import { vnoise, fbm } from './art.mjs';
import { EARTH, CURVE, camO, onSphere, n1 } from './f7_kit.mjs';

const TAU = Math.PI * 2;
export const PATCH = { x0: -600, y0: -3006, w: 760, h: 216, k: 6 };
const RC = Math.cos(EARTH.tilt), RS = Math.sin(EARTH.tilt);
const latlon = (nx, ny, nz) => [Math.atan2(nx, ny * RS + nz * RC), Math.asin(clamp(ny * RC - nz * RS, -1, 1))];
const fromLL = (lon, lat) => { const sx = Math.cos(lat) * Math.sin(lon), sy = Math.sin(lat), sz = Math.cos(lat) * Math.cos(lon); return [sx, sy * RC + sz * RS, -sy * RS + sz * RC]; };
const gauss = (x, y, cx, cy, r) => Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (r * r));
const hash = (x) => { const v = Math.sin(x * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const NL = vnoise(101), NR = vnoise(202), NC = vnoise(303), NT = vnoise(404);
function landAt(x, y) {
  const v = onSphere(x, y); if (!v) return -1;
  const [lon, lat] = latlon(...v);
  let f = fbm(NL, lon * 2.1 + 7.3, lat * 3.0 + 2.2, 5) - .5;
  f += .32 * gauss(x, y, CURVE.S[0], CURVE.S[1], 520) + .12 * gauss(x, y, -600, -2950, 500) - .3 * gauss(x, y, 780, -2860, 420) - .18 * gauss(x, y, 1250, -2700, 380);
  return f;
}
const CLUSTERS = (() => {
  const r = prng(4242), out = [[CURVE.S[0], CURVE.S[1], 70, 1400, true], [CURVE.S[0] - 120, CURVE.S[1] + 25, 34, 300, false], [CURVE.S[0] + 95, CURVE.S[1] + 30, 28, 220, false]];
  for (let i = 0; i < 9000 && out.length < 520; i++) {
    const x = -2900 + r() * 5800, y = -3000 + r() * 2400, v = onSphere(x, y); if (!v || v[2] < .03) continue;
    const f = landAt(x, y); if (f < .02) continue;
    const [lon, lat] = latlon(...v), de = fbm(NT, lon * 16, lat * 24, 3); if (r() > Math.pow(de, 3) * 2.5 + .02) continue;
    out.push([x, y, 8 + r() * r() * 34, Math.round(20 + r() * r() * 260), false]);
  }
  return out;
})();
const CITYLIVE = (() => { const r = prng(55), out = []; for (let i = 0; i < 1400 && out.length < 260; i++) { const x = -1500 + r() * 3400, y = -3000 + r() * 420, v = onSphere(x, y); if (!v || landAt(x, y) < .02) continue; const near = gauss(x, y, CURVE.S[0], CURVE.S[1], 300); if (r() > .25 + near) continue; out.push([x, y, r() * TAU, .8 + r() * 2.2, .6 + r() * 1.4]); } return out; })();

function buildPatch() {
  const R = EARTH.R, { x0, y0, w: ww, h: hh, k } = PATCH;
  const pw = Math.ceil(ww * k), ph = Math.ceil(hh * k), [c, g] = canvas(pw, ph);
  const img = g.createImageData(pw, ph), d = img.data;
  const [mc, mg] = canvas(pw, ph), mimg = mg.createImageData(pw, ph), md = mimg.data;
  for (let j = 0; j < ph; j++) {
    const y = y0 + (j + .5) / k;
    for (let i = 0; i < pw; i++) {
      const x = x0 + (i + .5) / k, v = onSphere(x, y), o = (j * pw + i) * 4;
      if (!v) continue;
      const [lon, lat] = latlon(...v), f = landAt(x, y), land = clamp((f + .006) / .012), coast = Math.exp(-Math.pow(f / .007, 2));
      const rel = fbm(NR, lon * 9, lat * 13, 3), cl = Math.max(0, fbm(NC, lon * 3.2 + 4, lat * 9.5, 4) - .52) * 2.4;
      let R0 = mix(5, 13 + 9 * rel, land), G0 = mix(8, 17 + 10 * rel, land), B0 = mix(27, 42 + 14 * rel, land);
      R0 += coast * 16; G0 += coast * 22; B0 += coast * 40;
      R0 += cl * 26; G0 += cl * 30; B0 += cl * 42;
      const lb = Math.exp(-v[2] / .035); R0 += lb * 40; G0 += lb * 26; B0 += lb * 92;
      d[o] = R0; d[o + 1] = G0; d[o + 2] = B0; d[o + 3] = 255;
      md[o] = md[o + 1] = md[o + 2] = 255; md[o + 3] = 255 * land;
    }
  }
  g.putImageData(img, 0, 0); mg.putImageData(mimg, 0, 0);
  const hatchLayer = (landSide) => {
    const [hc, hg] = canvas(pw, ph); hg.setTransform(k, 0, 0, k, -x0 * k, -y0 * k); hg.lineCap = 'round';
    for (let lat = -.9; lat < 1.2; lat += .0016) {
      hg.beginPath(); let on = false;
      for (let lon = -1.6; lon <= 1.6; lon += .0008) {
        const v = fromLL(lon, lat); if (v[2] <= 0) { on = false; continue; }
        const X = v[0] * R, Y = -v[1] * R; if (X < x0 - 20 || X > x0 + ww + 20 || Y < y0 - 20 || Y > y0 + hh + 20) { on = false; continue; }
        const wob = n1(lon * 60 + lat * 900) * .8;
        on ? hg.lineTo(X, Y + wob) : hg.moveTo(X, Y + wob); on = true;
      }
      if (landSide) { hg.strokeStyle = 'rgba(150,160,235,.30)'; hg.lineWidth = .6; hg.setLineDash([]); }
      else { hg.strokeStyle = 'rgba(110,130,215,.18)'; hg.lineWidth = .5; hg.setLineDash([6, 9]); }
      hg.stroke();
    }
    hg.setTransform(1, 0, 0, 1, 0, 0); hg.globalCompositeOperation = landSide ? 'destination-in' : 'destination-out'; hg.drawImage(mc, 0, 0);
    return hc;
  };
  g.drawImage(hatchLayer(true), 0, 0); g.drawImage(hatchLayer(false), 0, 0);
  g.setTransform(k, 0, 0, k, -x0 * k, -y0 * k);
  const r = prng(9001), dot = (x, y, s, col) => { const v = onSphere(x, y); if (!v) return; g.fillStyle = col; g.beginPath(); g.ellipse(x, y, s / 2, s * (.35 + .65 * v[2]) / 2, 0, 0, TAU); g.fill(); };
  const glowL = [];
  for (const [x, y, rad, n, hero] of CLUSTERS) {
    const rr = prng(Math.round(x * 13 + y * 7)), inR = !(x < x0 - 200 || x > x0 + ww + 200 || y < y0 - 200 || y > y0 + hh + 200);
    for (let i = 0; i < n; i++) {
      const q = rr() * TAU, dd = rad * Math.sqrt(-Math.log(1 - rr() * .995)) * .6, px = x + Math.cos(q) * dd, py = y + Math.sin(q) * dd * .8, core = Math.exp(-dd * dd / (rad * rad * .15));
      if (landAt(px, py) < -.01) continue;
      const hot = rr() < .1 + .5 * core, sz = .8 + rr() * 1.5 + core * 1.2, col = hot ? `rgba(255,240,205,${.75 + .25 * rr()})` : `rgba(255,${165 + Math.round(rr() * 60)},${70 + Math.round(rr() * 60)},${.35 + .45 * rr()})`;
      if (inR) dot(px, py, sz, col);
    }
    if (inR) glowL.push([x, y, rad, hero]);
  }
  for (let i = 0; i < CLUSTERS.length; i++) for (let j = i + 1; j < CLUSTERS.length; j++) {
    const A = CLUSTERS[i], B = CLUSTERS[j], dd = Math.hypot(A[0] - B[0], A[1] - B[1]); if (dd > 260 || hash(i * 31 + j) > .45) continue;
    if (A[0] < x0 - 300 || A[0] > x0 + ww + 300) continue;
    const n = Math.round(dd / 4);
    for (let q2 = 0; q2 < n; q2++) { const q = q2 / n, px = mix(A[0], B[0], q) + n1(q * 6 + i) * 8, py = mix(A[1], B[1], q) + n1(q * 5 + j) * 6; if (r() < .6) dot(px, py, .6 + r() * .8, `rgba(255,190,110,${.25 + .3 * r()})`); }
  }
  g.globalCompositeOperation = 'lighter';
  for (const [x, y, rad, hero] of glowL) { const R2 = rad * (hero ? 2.6 : 1.5), gr = g.createRadialGradient(x, y, 0, x, y, R2); gr.addColorStop(0, `rgba(255,180,100,${hero ? .4 : .12})`); gr.addColorStop(.4, `rgba(255,150,70,${hero ? .14 : .04})`); gr.addColorStop(1, 'rgba(255,140,60,0)'); g.fillStyle = gr; g.fillRect(x - R2, y - R2, R2 * 2, R2 * 2); }
  g.globalCompositeOperation = 'source-over';
  // the inner half of the atmosphere band, as earthHorizon draws it over the cap (40 world units for any zoom ≥ .4), baked in
  { const th = 40, gr = g.createRadialGradient(0, 0, R - th * .5, 0, 0, R + th);
    gr.addColorStop(0, 'rgba(80,60,160,0)'); gr.addColorStop(.3, rgba('#6a58c8', .35)); gr.addColorStop(.36, rgba('#b4a4ff', .62)); gr.addColorStop(.5, rgba('#6a56c0', .28)); gr.addColorStop(.75, rgba('#3a2c88', .08)); gr.addColorStop(1, 'rgba(40,30,100,0)');
    g.save(); g.beginPath(); g.arc(0, 0, R, 0, TAU); g.clip(); g.fillStyle = gr; g.beginPath(); g.arc(0, 0, R + th, 0, TAU); g.arc(0, 0, R - th * .5, 0, TAU, true); g.fill('evenodd'); g.restore(); }
  g.setTransform(1, 0, 0, 1, 0, 0);
  // feather the rect edges (left, right, bottom; the top is sky above the limb anyway)
  g.globalCompositeOperation = 'destination-in';
  const fx = pw * .08, fy = ph * .12;
  const gx = g.createLinearGradient(0, 0, pw, 0); gx.addColorStop(0, 'rgba(0,0,0,0)'); gx.addColorStop(fx / pw, 'rgba(0,0,0,1)'); gx.addColorStop(1 - fx / pw, 'rgba(0,0,0,1)'); gx.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gx; g.fillRect(0, 0, pw, ph);
  const gy = g.createLinearGradient(0, 0, 0, ph); gy.addColorStop(0, 'rgba(0,0,0,1)'); gy.addColorStop(1 - fy / ph, 'rgba(0,0,0,1)'); gy.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gy; g.fillRect(0, 0, pw, ph);
  g.globalCompositeOperation = 'source-over';
  return c;
}
let IMG = null, PREP = null;
export function patchPrepare() { if (!PREP) PREP = (async () => { const c = buildPatch(); IMG = await loadImage(c.toBuffer('image/png')); })(); return PREP; }

export function earthPatch(ctx, t, cam, o = {}) {
  if (!IMG) return;
  const m = camO(cam), R = EARTH.R, cx = m.X(0), cy = m.Y(0), r = R * m.k, P = PATCH;
  const X0 = m.X(P.x0), Y0 = m.Y(P.y0), Wp = P.w * m.k, Hp = P.h * m.k;
  if (X0 > W || X0 + Wp < 0 || Y0 > H || Y0 + Hp < 0) return;
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip();
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(IMG, X0, Y0, Wp, Hp);
  // the twinkling city points (as earthHorizon draws them), inside the patch
  if ((o.city ?? 1) > 0 && m.k > .35) {
    ctx.globalCompositeOperation = 'lighter';
    for (const [x, y, ph, f, s] of CITYLIVE) {
      if (x < P.x0 + P.w * .08 || x > P.x0 + P.w * .92 || y < P.y0 || y > P.y0 + P.h * .88) continue;
      const Xs = m.X(x), Ys = m.Y(y); if (Xs < -10 || Xs > W + 10 || Ys < -10 || Ys > H + 10) continue;
      const tw = .5 + .5 * Math.sin(t * f + ph); ctx.fillStyle = `rgba(255,214,150,${.5 * tw})`; const ss = s * Math.min(2, m.k); ctx.fillRect(Xs - ss / 2, Ys - ss / 4, ss, ss / 2);
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  ctx.restore();
}
