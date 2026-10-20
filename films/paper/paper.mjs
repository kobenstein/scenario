// paper.mjs · cut-paper diorama engine: flat paper planes stacked in real depth, one slow camera.
// A plane is a sheet at depth z (world units; a sheet at distance F from the camera shows 1:1).
//   { z, x, y, w, h, img, res, a, draw(g, t, s), portal: { rect:[x,y,w,h], world }, shadow: { img, dx, dy, a } }
// x/y = world position of the sheet's centre; img is baked once (res px per world unit); draw() adds motion in sheet units.
// A portal is a hole in the sheet through which another world (same camera) is seen until the camera passes the sheet.
import { createCanvas } from '@napi-rs/canvas';
export const W = 1920, H = 1080, F = 1100;

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const mix = (a, b, x) => a + (b - a) * x;
export const lin = (a, b, t) => clamp((t - a) / (b - a));
export const sm = (x) => x * x * (3 - 2 * x);
export const smoo = (x) => x * x * x * (x * (x * 6 - 15) + 10);          // smootherstep: calm starts and landings
export function canvas(w, h) { const c = createCanvas(Math.max(1, Math.ceil(w)), Math.max(1, Math.ceil(h))); return [c, c.getContext('2d')]; }
export function prng(seed) { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
export function rgba(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }
export function mixHex(a, b, u) { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const m = (s) => Math.round(mix((A >> s) & 255, (B >> s) & 255, clamp(u))); return '#' + ((m(16) << 16) | (m(8) << 8) | m(0)).toString(16).padStart(6, '0'); }
const fract = (x) => x - Math.floor(x);
export function vnoise(seed = 1) {
  const h = (i, j) => fract(Math.sin(i * 127.1 + j * 311.7 + seed * 74.7) * 43758.5453);
  return (x, y) => { const i = Math.floor(x), j = Math.floor(y), u = x - i, v = y - j, a = u * u * (3 - 2 * u), b = v * v * (3 - 2 * v);
    return mix(mix(h(i, j), h(i + 1, j), a), mix(h(i, j + 1), h(i + 1, j + 1), a), b); };
}
export function fbm(n, x, y, oct = 4) { let s = 0, a = .5, f = 1, t = 0; for (let o = 0; o < oct; o++) { s += a * n(x * f, y * f); t += a; a *= .5; f *= 2.03; } return s / t; }

// ---------------------------------------------------------------- camera
// keys: [[t, {x,y,z}], ...]; position eases between keys with smootherstep on a Catmull-Rom path, plus a breath of drift.
export function camPath(keys, { drift = 1 } = {}) {
  const P = keys.map((k) => k[1]);
  return (t) => {
    let i = 0; while (i < keys.length - 2 && t > keys[i + 1][0]) i++;
    const [t0] = keys[i], [t1] = keys[i + 1], u = smoo(clamp((t - t0) / (t1 - t0)));
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    const cr = (k) => { const a = p0[k], b = p1[k], c = p2[k], d = p3[k]; return .5 * ((2 * b) + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u); };
    const dz = (Math.sin(t * .31) * .6 + Math.sin(t * .73 + 1) * .4) * drift;
    return { x: cr('x') + dz * 3, y: cr('y') + Math.sin(t * .43 + 2) * 2 * drift, z: cr('z') };
  };
}

// ---------------------------------------------------------------- sheets
// sheet(w, h, res, paint): bake a cut-paper sheet. paint(g) draws in sheet units (g is pre-scaled by res).
// Adds the paper look: a lit top edge (thickness), a faint fibre texture and fine grain in the colour.
const PAPER = (() => { const [c, g] = canvas(512, 512), n = vnoise(91), r = prng(7), d = g.createImageData(512, 512), p = d.data;
  for (let y = 0; y < 512; y++) for (let x = 0; x < 512; x++) { const i = (y * 512 + x) * 4, v = 128 + (fbm(n, x * .05, y * .4, 3) - .5) * 60 + (r() - .5) * 36; p[i] = p[i + 1] = p[i + 2] = v; p[i + 3] = 255; }
  g.putImageData(d, 0, 0); return c; })();
export function sheet(w, h, res, paint, { edge = '#fff2dc', edgeA = .55, edgeW = 1.6, texture = .16, pad = 0 } = {}) {
  const [c, g] = canvas((w + pad * 2) * res, (h + pad * 2) * res);
  g.save(); g.scale(res, res); g.translate(pad, pad); paint(g); g.restore();
  if (edgeA) {   // lit top rim: the sheet minus itself shifted down = a thin band along every upper edge
    const [e, eg] = canvas(c.width, c.height); eg.drawImage(c, 0, 0); eg.globalCompositeOperation = 'source-in'; eg.fillStyle = edge; eg.fillRect(0, 0, c.width, c.height);
    eg.globalCompositeOperation = 'destination-out'; eg.drawImage(c, 0, edgeW * Math.max(1, res));
    g.save(); g.globalAlpha = edgeA; g.globalCompositeOperation = 'source-atop'; g.drawImage(e, 0, 0); g.restore();
  }
  if (texture) {   // fibre texture only inside the cut shape
    const [tc, tg] = canvas(c.width, c.height); for (let y = 0; y < c.height; y += 512) for (let x = 0; x < c.width; x += 512) tg.drawImage(PAPER, x, y);
    tg.globalCompositeOperation = 'destination-in'; tg.drawImage(c, 0, 0);
    g.save(); g.globalCompositeOperation = 'overlay'; g.globalAlpha = texture; g.drawImage(tc, 0, 0); g.restore(); }
  return { img: c, w: w + pad * 2, h: h + pad * 2, res };
}
// soft shadow of a sheet (cast on whatever lies behind it): black silhouette, blurred, at reduced resolution
export function shadowOf(sh, blur = 6, scale = .35) {
  const [c, g] = canvas(sh.img.width * scale + blur * 4, sh.img.height * scale + blur * 4);
  const [m, mg] = canvas(sh.img.width * scale, sh.img.height * scale); mg.drawImage(sh.img, 0, 0, m.width, m.height);
  mg.globalCompositeOperation = 'source-in'; mg.fillStyle = '#05060f'; mg.fillRect(0, 0, m.width, m.height);
  g.filter = `blur(${blur}px)`; g.drawImage(m, blur * 2, blur * 2);
  return { img: c, scale, pad: blur * 2 };
}
// grain inside a soft alpha falloff (light dissolves into fine dots, cells 1 px)
export function stipple(c, { k = .55, seed = 1 } = {}) {
  const g = c.getContext('2d'); g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  const d = g.getImageData(0, 0, c.width, c.height), p = d.data, r = prng(seed * 977 + 13);
  for (let i = 3; i < p.length; i += 4) { const a = p[i] / 255; if (a <= 0) continue; const on = r() < a ? Math.min(1, a * 2.2) : 0, kk = k * 4 * a * (1 - a); p[i] = 255 * (a * (1 - kk) + kk * on); }
  g.putImageData(d, 0, 0); g.restore(); return c;
}

// ---------------------------------------------------------------- render
export function proj(cam, z, x, y) { const d = z - cam.z; if (d <= 1) return null; const s = F / d; return { s, x: W / 2 + (x - cam.x) * s, y: H / 2 + (y - cam.y) * s, d }; }
// world = { bg(g, cam, t), planes: [...], post(g, cam, t) }
export function renderWorld(g, world, cam, t, depth = 0) {
  if (world.bg) world.bg(g, cam, t);
  const list = world.planes.filter((p) => (p.on ? p.on(t) : true)).map((p) => ({ p, z: typeof p.z === 'function' ? p.z(t) : p.z })).sort((a, b) => b.z - a.z);
  for (const { p, z } of list) {
    const px = typeof p.x === 'function' ? p.x(t) : p.x, py = typeof p.y === 'function' ? p.y(t) : p.y;
    const pr = proj(cam, z, px, py); if (!pr) continue;
    const near = p.near ?? 40; let a = (typeof p.a === 'function' ? p.a(t) : p.a ?? 1) * clamp((pr.d - near) / near);   // sheets fade as the camera reaches them
    if (a <= 0.003) continue;
    const s = pr.s, x0 = pr.x - p.w / 2 * s, y0 = pr.y - p.h / 2 * s;
    if (x0 > W || y0 > H || x0 + p.w * s < 0 || y0 + p.h * s < 0) continue;
    if (p.portal && depth < 2 && cam.z < z) {   // the other world, seen through the hole, clipped to its projection
      const [rx, ry, rw, rh] = p.portal.rect, qx = x0 + rx * s, qy = y0 + ry * s;
      if (qx < W && qy < H && qx + rw * s > 0 && qy + rh * s > 0) {
        g.save(); g.beginPath(); g.rect(qx, qy, rw * s, rh * s); g.clip(); renderWorld(g, p.portal.world, cam, t, depth + 1); g.restore();
      }
    }
    if (p.shadow) { const S = p.shadow, sp = proj(cam, z + (S.dz ?? 8), px + (S.dx ?? 6), py + (S.dy ?? 8)); if (sp) {
      const k = sp.s / (p.img.res ?? 1) / S.scale, sx0 = sp.x - (p.w / 2) * sp.s - S.pad * k, sy0 = sp.y - (p.h / 2) * sp.s - S.pad * k;
      g.save(); g.globalAlpha = a * (S.a ?? .35); g.drawImage(S.img, sx0, sy0, S.img.width * k, S.img.height * k); g.restore(); } }
    g.save(); g.globalAlpha = a;
    if (p.img) g.drawImage(p.img.img, x0, y0, p.w * s, p.h * s);
    if (p.draw) { g.setTransform(s, 0, 0, s, x0, y0); p.draw(g, t, s); }
    g.restore();
  }
  if (world.post) world.post(g, cam, t);
}
export function screenGlow(g, x, y, r, col, a, sy = 1) {
  g.save(); g.globalCompositeOperation = 'lighter'; g.translate(x, y); g.scale(1, sy);
  const gr = g.createRadialGradient(0, 0, 0, 0, 0, r); gr.addColorStop(0, rgba(col, a)); gr.addColorStop(.35, rgba(col, a * .35)); gr.addColorStop(1, rgba(col, 0));
  g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill(); g.restore();
}
// final print: fine film grain (static paper tooth + a moving 1-px grain) and a gentle vignette
const GRAIN = Array.from({ length: 6 }, (_, k) => { const [c, g] = canvas(W / 2, H / 2), r = prng(100 + k), d = g.createImageData(W / 2, H / 2), p = d.data;
  for (let i = 0; i < p.length; i += 4) { const v = 128 + (r() - .5) * 110; p[i] = p[i + 1] = p[i + 2] = v; p[i + 3] = 255; } g.putImageData(d, 0, 0); return c; });
const [PAPERFULL, pf] = canvas(W, H); for (let y = 0; y < H; y += 512) for (let x = 0; x < W; x += 512) pf.drawImage(PAPER, x, y);
export function finish(g, t, { grain = .05, paper = .07, vig = .42, vigCol = '#0a0716' } = {}) {
  g.save();
  const v = g.createRadialGradient(W / 2, H / 2, H * .38, W / 2, H / 2, H * 1.05); v.addColorStop(0, rgba(vigCol, 0)); v.addColorStop(1, rgba(vigCol, vig)); g.fillStyle = v; g.fillRect(0, 0, W, H);
  g.globalCompositeOperation = 'overlay'; g.globalAlpha = paper; g.drawImage(PAPERFULL, 0, 0);
  g.globalAlpha = grain; g.drawImage(GRAIN[Math.floor(t * 12) % GRAIN.length], 0, 0, W, H);
  g.restore();
}
