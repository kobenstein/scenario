// A freshly ploughed field at dawn, owner C4 (2.20, 2.21, 2.21a); also used by C6 (4.09) and C7 (4.18). v1 by C4 (real version, signature kept).
// field(ctx, t, { cam = { x: 0, y: 0, z: 1 }, mist = .5, light = 'dawn' | 'day', pegs = 0..1, string = 0..1, post = 0..1 (the stake with the sheet), sprout = 0..1 })
//   draws the whole frame. → { post: { x, y } (foot of the stake), soil: { x, y } (a free spot for seeds), ground(x) → y }
//
// The look: you stand at the corner of the field, the furrows run away from you toward a low sun behind a hedge line, so every ridge
// catches a warm crest light and its far flank sinks into engraved shadow lines (intaglio that follows the form, like the certificate).
// The furrows are drawn in true perspective every frame (cheap straight wedges toward the vanishing point), so a truck or crane really
// turns them; sky, hedge, sun, mist and grain are cached layers with parallax. One hero light: the low sun.
//   cam   { x (px, + = truck right), y (px, + = crane up), z (zoom around cam.fx, cam.fy = screen centre) }
//   mist  0..1 ground mist and haze;  light 'dawn' (rose-amber, §2 AGREE, §4) | 'day' (paler, §4 later)
//   pegs  0..1 pegs at the strip boundaries drop in one by one;  string 0..1 the strings run out from the near pegs to the far end
//         (the field is split into equal strips);  post 0..1 the stake at the field's edge with a sheet (empty signature line)
//   sprout 0..1 three fresh mounds at `soil`, a shoot grows out of each (4.09)
// Extra options (all optional): sheet true (false: draw the stake only and paint your own sheet at the returned `sheet` anchor),
//   strips 4 (number of equal strips), sun true, figuresFloor (nothing).
// Extra anchors: P(X, Z, Y = 0) → [x, y, k] ground point (metres: X right, Z forward, Y up) → screen (k = px per metre there),
//   sheet { x, y, w, h, ang } (the sheet on the stake, screen centre and size), pegNear(i) / pegFar(i) → { x, y } (string ends),
//   horizon (screen y), edgeZ (depth of the near field edge), stripX(i) (world X of strip boundary i, 0..strips).
import { W, H, rgba, clamp, mix, prng, canvas, drift, lin, eout, sm } from '../engine.mjs';
import { fog as artFog, stipple, vnoise, fbm } from './art.mjs';

const CACHE = new Map(); const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const TAU = Math.PI * 2;
const PAL = {
  dawn: { top: '#121735', mid: '#363a66', low: '#b8828a', hz: '#f2c28e', sun: '#fff1d6', sunCol: '#ffb35c', haze: '#c9a3a6', fog: '#b9a9c6', fogWarm: '#f3c08f',
    earthFar: '#6d5463', earth: '#3b291f', lit: '#5d4232', shade: '#1d140f', ink: '#120c0a', crest: '#f4b47c', grass: '#2f3830', grassLit: '#8a7a52', hedge: '#2a2440', hill: '#5a5579' },
  day: { top: '#4f6f9e', mid: '#8eaccb', low: '#d9d3c4', hz: '#f4ead4', sun: '#fffbe8', sunCol: '#ffe2a8', haze: '#d6d8d8', fog: '#e4e6ea', fogWarm: '#f7ead0',
    earthFar: '#958784', earth: '#4a3426', lit: '#6e5038', shade: '#2a1d14', ink: '#1a110c', crest: '#e2bc8e', grass: '#4d5c3c', grassLit: '#a4a06a', hedge: '#3a4a3a', hill: '#8e9cab' },
};
// geometry (metres)
const G = { HZ: 452, VX: 1180, F: 1150, H0: 1.65, XL: -1.8, XR: 64, ZN: 5.6, ZF: 210, FW: .6, SUNX: 1105 };
function proj(cam) {
  const cx = (cam.x || 0) / 170, ch = G.H0 + (cam.y || 0) / 260;
  const P = (X, Z, Y = 0) => { const k = G.F / Math.max(.3, Z); return [G.VX + (X - cx) * k, G.HZ + (ch - Y) * k, k]; };
  return { P, cx, ch };
}

// ---------- cached layers ----------
function sky(L, key) {
  return once('sky' + key, () => {
    const [c, g] = canvas(W + 400, G.HZ + 260), r = prng(7);
    const lg = g.createLinearGradient(0, 0, 0, G.HZ + 40); lg.addColorStop(0, L.top); lg.addColorStop(.45, L.mid); lg.addColorStop(.82, L.low); lg.addColorStop(1, L.hz);
    g.fillStyle = lg; g.fillRect(0, 0, c.width, c.height);
    // the dawn spreads from the sun along the horizon
    const sx = G.SUNX + 200, sg = g.createRadialGradient(sx, G.HZ, 0, sx, G.HZ, 1100); sg.addColorStop(0, rgba(L.hz, .85)); sg.addColorStop(.35, rgba(L.low, .35)); sg.addColorStop(1, rgba(L.low, 0));
    g.save(); g.translate(sx, G.HZ); g.scale(1, .42); g.translate(-sx, -G.HZ); g.fillStyle = sg; g.fillRect(0, 0, c.width, c.height * 3); g.restore();
    // high strata of cloud, engraved with fine horizontal lines, lit from below near the sun
    const n = vnoise(11);
    for (let i = 0; i < 7; i++) {
      const y = 60 + r() * 260, x0 = r() * c.width * .9 - 200, w = 500 + r() * 900, th = 10 + r() * 22;
      g.save(); g.beginPath(); g.moveTo(x0, y);
      for (let x = x0; x <= x0 + w; x += 16) g.lineTo(x, y - th * (.5 + .5 * Math.sin((x - x0) / w * Math.PI)) * (.6 + .4 * n(x * .01, i)));
      for (let x = x0 + w; x >= x0; x -= 16) g.lineTo(x, y + th * .35 * Math.sin((x - x0) / w * Math.PI));
      g.closePath(); const near = clamp(1 - Math.abs(x0 + w / 2 - sx) / 1400);
      g.fillStyle = rgba(L.mid, .5); g.fill(); g.clip();
      g.strokeStyle = rgba(near > .3 ? L.hz : '#c9c6e0', .25 + .35 * near); g.lineWidth = .9;
      for (let yy = y - th; yy < y + th; yy += 3.2) { g.beginPath(); g.moveTo(x0, yy + (r() - .5)); g.lineTo(x0 + w, yy + (r() - .5)); g.stroke(); }
      g.restore();
    }
    // a few stars still out at the top
    for (let i = 0; i < 90; i++) { const y = Math.pow(r(), 1.8) * 240; g.fillStyle = rgba('#e6ecff', (.15 + .45 * r()) * (1 - y / 260)); g.fillRect(r() * c.width, y, 1.3, 1.3); }
    stipple(c, { k: .35, g: 1, seed: 8, mid: false, boost: 1 });
    return c;
  });
}
function sunBloom(L, key) {
  return once('sun' + key, () => {
    const R = 520, [c, g] = canvas(R * 2, R * 2), rg = g.createRadialGradient(R, R, 0, R, R, R);
    rg.addColorStop(0, rgba(L.sun, .95)); rg.addColorStop(.035, rgba(L.sun, .85)); rg.addColorStop(.09, rgba(L.sunCol, .45)); rg.addColorStop(.3, rgba(L.sunCol, .14)); rg.addColorStop(1, rgba(L.sunCol, 0));
    g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2); stipple(c, { k: .8, g: 1.2, seed: 21, boost: 2 }); return c;
  });
}
// far hills and the hedge line at the end of the field (silhouettes with a warm rim toward the sun)
function hedge(L, key) {
  return once('hedge' + key, () => {
    const [c, g] = canvas(W + 600, 220), n = vnoise(5), r = prng(12), base = 150;
    g.fillStyle = L.hill; g.beginPath(); g.moveTo(0, base);
    for (let x = 0; x <= c.width; x += 10) g.lineTo(x, base - 40 - 34 * fbm(n, x * .0025, 1, 3) - 18 * Math.sin(x * .0012 + 1)); g.lineTo(c.width, base + 70); g.lineTo(0, base + 70); g.closePath(); g.fill();
    const hz = g.createLinearGradient(0, base - 80, 0, base + 40); hz.addColorStop(0, rgba(L.haze, .25)); hz.addColorStop(1, rgba(L.haze, .8)); g.fillStyle = hz; g.fillRect(0, base - 90, c.width, 160);
    // hedge row: lumpy crowns, a few taller trees (poplars, round oaks)
    g.fillStyle = L.hedge; g.beginPath(); g.moveTo(0, base + 6);
    for (let x = 0; x <= c.width; x += 6) g.lineTo(x, base - 6 - 12 * fbm(n, x * .02, 4, 3) - 6 * fbm(n, x * .09, 9, 2)); g.lineTo(c.width, base + 70); g.lineTo(0, base + 70); g.closePath(); g.fill();
    for (let i = 0; i < 26; i++) {
      const x = r() * c.width, h = 20 + r() * 46, poplar = r() < .35;
      g.beginPath(); if (poplar) g.ellipse(x, base - h * .7, h * .16, h * .7, 0, 0, TAU); else { for (let k = 0; k < 5; k++) g.ellipse(x + (r() - .5) * h * .6, base - h * (.45 + r() * .4), h * (.22 + r() * .14), h * (.2 + r() * .12), 0, 0, TAU); }
      g.fill(); g.fillRect(x - 1, base - h * .3, 2, h * .3);
    }
    // warm rim on the sun side of every crown + haze at the foot
    const [m, mg] = canvas(c.width, c.height); mg.drawImage(c, 0, 0); mg.globalCompositeOperation = 'destination-out'; mg.drawImage(c, 2.5, 2);
    mg.globalCompositeOperation = 'source-in'; const sg = mg.createLinearGradient(0, 0, c.width, 0); sg.addColorStop(0, rgba(L.crest, .25)); sg.addColorStop((G.SUNX + 300) / c.width, rgba(L.sun, .95)); sg.addColorStop(1, rgba(L.crest, .2)); mg.fillStyle = sg; mg.fillRect(0, 0, c.width, c.height);
    g.drawImage(m, 0, 0);
    const fg = g.createLinearGradient(0, base - 30, 0, base + 30); fg.addColorStop(0, rgba(L.haze, 0)); fg.addColorStop(1, rgba(L.haze, .75)); g.fillStyle = fg; g.fillRect(0, base - 30, c.width, 100);
    stipple(c, { k: .4, g: 1, seed: 13, mid: false, boost: 1 });
    return c;
  });
}
function mistLayer(L, key, k) {
  return once('mist' + key + k, () => {
    const [c, g] = canvas(W + 500, H);
    if (k === 0) artFog(g, { y0: G.HZ - 70, y1: G.HZ + 120, col: L.fog, a: .55, seed: 31, sx: .0016, sy: .03, cover: .62, soft: .45, k: .45, x1: W + 500, edgeTop: .5, edgeBot: .4 });
    else if (k === 1) artFog(g, { y0: G.HZ + 40, y1: G.HZ + 330, col: L.fog, a: .34, seed: 37, sx: .0013, sy: .012, cover: .55, soft: .45, k: .5, x1: W + 500 });
    else artFog(g, { y0: H - 330, y1: H + 20, col: L.fog, a: .26, seed: 43, sx: .0011, sy: .008, cover: .5, soft: .5, k: .55, x1: W + 500 });
    return c;
  });
}
// warm light of the low sun lying over the far field and in the mist (additive)
function warmth(L, key) {
  return once('warm' + key, () => {
    const [c, g] = canvas(W + 400, H), sx = G.SUNX + 200;
    const rg = g.createRadialGradient(sx, G.HZ, 0, sx, G.HZ, 1300); rg.addColorStop(0, rgba(L.fogWarm, .55)); rg.addColorStop(.25, rgba(L.fogWarm, .2)); rg.addColorStop(.6, rgba(L.sunCol, .05)); rg.addColorStop(1, rgba(L.sunCol, 0));
    g.save(); g.translate(sx, G.HZ); g.scale(1, .5); g.translate(-sx, -G.HZ); g.fillStyle = rg; g.fillRect(0, 0, c.width, H * 2); g.restore();
    stipple(c, { k: .7, g: 1.15, seed: 51, boost: 2 }); return c;
  });
}
function soilTex() {
  return once('soiltex', () => {
    const [c, g] = canvas(W + 400, H - G.HZ + 20), n = vnoise(17), r = prng(23), d = g.createImageData(c.width, c.height), p = d.data;
    for (let y = 0; y < c.height; y++) { const dz = 1 + y / 60; for (let x = 0; x < c.width; x++) { const v = fbm(n, x * .012 / dz * 3, y * .03, 3), i = (y * c.width + x) * 4, e = (v - .5) * 160 + (r() - .5) * 60; p[i] = p[i + 1] = p[i + 2] = 128 + e; p[i + 3] = 255 * clamp(y / 40); } }
    g.putImageData(d, 0, 0); return c;
  });
}
// the meadow verge left of the field: dense grass in perspective (cached), with dew catching the sun
function meadow(L, key) {
  return once('meadow' + key, () => {
    const [c, g] = canvas(W + 600, H - G.HZ + 60), r = prng(29), P = (X, Z) => { const k = G.F / Z; return [G.VX + 300 + X * k, 4 + G.H0 * k, k]; };
    g.lineCap = 'round';
    for (let i = 0; i < 16000; i++) {
      const Z = 1.4 + Math.pow(r(), 1.6) * 160, X = G.XL - .15 - r() * (2 + Z * 1.4), [x, y, k] = P(X, Z), h = (.08 + r() * .22) * k; if (h < .8 || x < -10 || x > c.width + 10 || y > c.height) continue;
      const lit = r() < .3, lean = (r() - .45) * .5; g.strokeStyle = lit ? rgba(L.grassLit, .35 + .4 * r()) : rgba(mixHex(L.grass, '#000000', r() * .4), .8); g.lineWidth = Math.max(.5, k * .01);
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + lean * h * .3, y - h * .55, x + lean * h, y - h); g.stroke();
    }
    // dew: tiny bright points toward the sun
    for (let i = 0; i < 1400; i++) { const Z = 2 + Math.pow(r(), 1.4) * 60, X = G.XL - .2 - r() * (2 + Z), [x, y] = P(X, Z); g.fillStyle = rgba(L.crest, .25 + .5 * r()); g.fillRect(x, y - r() * 6, 1.2, 1.2); }
    const hz = g.createLinearGradient(0, 0, 0, 160); hz.addColorStop(0, rgba(L.haze, .8)); hz.addColorStop(1, rgba(L.haze, 0)); g.globalCompositeOperation = 'source-atop'; g.fillStyle = hz; g.fillRect(0, 0, c.width, 160);
    stipple(c, { k: .3, g: 1, seed: 33, mid: false, boost: 1 }); return c;
  });
}
// clods and stones: a fixed scatter in world metres, drawn in perspective every frame
const CLODS = (() => { const r = prng(77), out = []; for (let i = 0; i < 1500; i++) { const Z = 1.2 + Math.pow(r(), 2.2) * 30, X = G.XL + .1 + r() * 26; out.push([X, Z, .018 + Math.pow(r(), 2) * .07, r(), r() * 6.28]); } return out; })();
const FN = vnoise(61);
const EDGE = (() => { const r = prng(47), out = []; for (let i = 0; i < 160; i++) out.push([1.5 + Math.pow(r(), 1.7) * 40, (r() - .3) * .5, .1 + r() * .22, r()]); return out; })();
const FURROW = (() => { const r = prng(55), out = []; for (let k = 0; k < 140; k++) out.push({ q: .3 + r() * .18, c: .45 + r() * .55, w: .9 + r() * .25 }); return out; })();
const GRASS = (() => { const r = prng(91), out = []; for (let i = 0; i < 260; i++) { const Z = 1.6 + Math.pow(r(), 1.5) * 10, X = G.XL - .2 - r() * 4.5 * (Z / 8 + .3); out.push([X, Z, .14 + r() * .3, r() - .5, r()]); } return out; })();

// ---------- the field ----------
export function field(ctx, t, o = {}) {
  const cam = { x: 0, y: 0, z: 1, ...(o.cam || {}) }, light = o.light === 'day' ? 'day' : 'dawn', L = PAL[light], key = light;
  const mist = clamp(o.mist ?? .5), { P, cx, ch } = proj(cam), z = cam.z ?? 1, fx = cam.fx ?? W / 2, fy = cam.fy ?? H / 2;
  const strips = o.strips ?? 4, stripX = (i) => G.XL + .6 + 3 * i;
  ctx.save(); ctx.translate(fx, fy); ctx.scale(z, z); ctx.translate(-fx, -fy);
  const hzY = G.HZ + (ch - G.H0) * 0;                                            // the horizon stays (pitch fixed)
  // sky + sun + hedge (far parallax)
  ctx.drawImage(sky(L, key), -200 - cx * 2 + drift(t, 4, 1), -6 + (cam.y || 0) * .02);
  if (o.sun !== false) { const B = sunBloom(L, key), sx = G.SUNX - cx * 2.5, sy = G.HZ - 18; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .9 + .06 * Math.sin(t * .7); ctx.drawImage(B, sx - B.width / 2, sy - B.height / 2); ctx.restore(); }
  ctx.drawImage(hedge(L, key), -300 - cx * 5.5, G.HZ - 150 + 2 + (ch - G.H0) * 5.5);
  // far mist band behind the field's end
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .55 + .45 * mist; ctx.drawImage(mistLayer(L, key, 0), -250 - ((t * 7 + cx * 6) % 250 + 250) % 250, 0); ctx.restore();

  // ground: meadow left of the field, the field itself
  const [xl0, yN] = P(G.XL, 2.6), [xlF, yF] = P(G.XL, G.ZF), [xrN] = P(G.XR, 2.6), [xrF] = P(G.XR, G.ZF);
  { // meadow (left verge, receding) and far land between field and hedge
    const gg = ctx.createLinearGradient(0, G.HZ, 0, H); gg.addColorStop(0, L.earthFar); gg.addColorStop(.1, mixHex(L.grass, L.haze, .5)); gg.addColorStop(.4, L.grass); gg.addColorStop(1, mixHex(L.grass, '#000000', .35));
    ctx.fillStyle = gg; ctx.fillRect(-50, G.HZ - 2, W + 100, H - G.HZ + 60);
    ctx.drawImage(meadow(L, key), -300 - cx * 70, G.HZ - 4 + (ch - G.H0) * 60);
  }
  // the field polygon
  const [xl00, yl00] = P(G.XL, .5), fieldPath = () => { ctx.beginPath(); ctx.moveTo(xl00, yl00); ctx.lineTo(xlF, yF); ctx.lineTo(xrF, yF); ctx.lineTo(...P(G.XR, .5).slice(0, 2)); ctx.closePath(); };
  const [, yEdge] = P(0, G.ZN);
  ctx.save(); fieldPath(); ctx.clip();
  { const eg = ctx.createLinearGradient(0, yF, 0, H); eg.addColorStop(0, L.earthFar); eg.addColorStop(.1, mixHex(L.earth, L.earthFar, .5)); eg.addColorStop(.35, L.earth); eg.addColorStop(1, mixHex(L.earth, '#000000', .25)); ctx.fillStyle = eg; ctx.fillRect(0, G.HZ - 2, W, H - G.HZ + 400); }
  // furrows run across the view: each ridge is a wavy crest line (warm rim from the low sun behind it) over a face that turns
  // toward us in shadow, engraved with lines that follow the ridge (intaglio). Spacing shrinks with depth; far away they merge into a tone.
  const wedge = (Xa, Xb) => { const [a1, b1] = P(Xa, .5), [a2, b2] = P(Xa, G.ZF), [c2] = P(Xb, G.ZF), [c1] = P(Xb, .5); ctx.beginPath(); ctx.moveTo(a1, b1); ctx.lineTo(a2, b2); ctx.lineTo(c2, b2); ctx.lineTo(c1, b1); ctx.closePath(); };
  const nz = FN, sunX = G.SUNX - cx * 2.5;
  const crest = (Z, k2) => { // screen polyline of a crest at depth Z: x from the field's left edge to the right frame edge
    const [x0r, y0, kk] = P(G.XL, Z), x0 = x0r + (nz(Z * 5.3, 2) - .5) * .5 * kk, x1 = W + 60, n = Math.max(6, Math.min(34, Math.round((x1 - x0) / 60))), pts = [];
    for (let i = 0; i <= n; i++) { const x = mix(x0, x1, i / n), X = cx + (x - G.VX) / kk, wob = (nz(X * .9, Z * 1.7) - .5) * .11 + (nz(X * 4.1, Z * 3.3 + 9) - .5) * .035; pts.push([x, y0 - wob * kk]); }
    return pts;
  };
  const Zs = []; { let Z = .9; while (Z < 70) { Zs.push(Z); Z += G.FW * (1 + .18 * Math.sin(Z * 7.7)); } }
  let prev = null;
  for (let i = Zs.length - 1; i >= 0; i--) {         // far to near, so near ridges overlap the far ones
    const Z = Zs[i], C1 = crest(Z), [, , kk] = P(0, Z), yTop = C1[0][1], face = Math.min(.36 * kk * ch / Z * 2.2, 140);
    if (yTop > H + 160) continue;
    const fog = clamp((Z - 8) / 60), fa = 1 - .7 * fog;
    // the face toward us (shadow), a slight lit band on top
    ctx.beginPath(); C1.forEach(([x, y], j) => (j ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); for (let j = C1.length - 1; j >= 0; j--) ctx.lineTo(C1[j][0], C1[j][1] + face); ctx.closePath();
    const fg = ctx.createLinearGradient(0, yTop, 0, yTop + face); fg.addColorStop(0, rgba(L.lit, .9 * fa)); fg.addColorStop(.18, rgba(L.shade, .85 * fa)); fg.addColorStop(1, rgba(L.ink, .55 * fa)); ctx.fillStyle = fg; ctx.fill();
    // engraved lines following the ridge (only where they are wide enough to read)
    if (face > 7) { ctx.strokeStyle = rgba(L.ink, .5 * fa); ctx.lineWidth = Math.max(.6, face * .03); for (const q of [.35, .55, .72, .86]) { ctx.beginPath(); C1.forEach(([x, y], j) => { const yy = y + face * q + Math.sin(j * 1.7 + Z) * face * .03; j ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); }); ctx.stroke(); } }
    // the crest catches the sun: brighter toward the sun's side
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const cg = ctx.createLinearGradient(sunX - 1400, 0, sunX + 1400, 0); const cb = .35 + .65 * nz(Z * 3.1, 7); cg.addColorStop(0, rgba(L.crest, .12 * fa * cb)); cg.addColorStop(.5, rgba(L.crest, .8 * fa * cb)); cg.addColorStop(1, rgba(L.crest, .18 * fa * cb));
    ctx.strokeStyle = cg; ctx.lineWidth = Math.max(.7, Math.min(2.4, kk * .009)); ctx.setLineDash([kk * (.5 + nz(Z, 3)), kk * .06 * (1 + nz(Z * 2, 4))]); ctx.lineDashOffset = Z * 37; ctx.beginPath(); C1.forEach(([x, y], j) => (j ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
  }
  // soil texture (cached noise + stipple)
  ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = .85; ctx.drawImage(soilTex(), -200 - (cx * 60 % 200), G.HZ - 10); ctx.restore();
  // clods in the near field (lit tops toward the sun)
  for (const [X, Z, s, v, a0] of CLODS) {
    const [x, y, k] = P(X, Z), r = s * k; if (r < .8 || x < -20 || x > W + 20 || y > H + 30 || y < G.HZ) continue;
    ctx.fillStyle = rgba(L.ink, .55); ctx.beginPath(); ctx.ellipse(x + r * .35, y + r * .12, r * 1.05, r * .42, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = v < .6 ? L.shade : mixHex(L.shade, L.lit, .5); ctx.beginPath();
    for (let i = 0; i < 6; i++) { const a = a0 + i / 6 * TAU, q = r * (.7 + .3 * Math.sin(a0 * 3 + i * 2.1)); i ? ctx.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q * .55) : ctx.moveTo(x + Math.cos(a) * q, y + Math.sin(a) * q * .55); } ctx.closePath(); ctx.fill();
    if (r > 1.6) { ctx.strokeStyle = rgba(L.crest, .55 + .3 * v); ctx.lineWidth = Math.max(.7, r * .18); ctx.beginPath(); ctx.ellipse(x - r * .05, y - r * .05, r * .62, r * .3, 0, Math.PI * 1.05, Math.PI * 1.75); ctx.stroke(); }
  }
  // strips: the field divided into equal strips (a whisper of tone on every other strip once the strings are out)
  const str = clamp(o.string ?? 0);
  if (str > 0) for (let i = 0; i < strips; i += 2) { ctx.fillStyle = rgba(L.crest, .045 * sm(clamp(str * 1.4 - .3))); wedge(stripX(i), stripX(i + 1)); ctx.fill(); }
  // depth haze toward the far end
  { const hg = ctx.createLinearGradient(0, yF, 0, G.HZ + 210); hg.addColorStop(0, rgba(L.haze, .85)); hg.addColorStop(.35, rgba(L.haze, .32 + .2 * mist)); hg.addColorStop(1, rgba(L.haze, 0)); ctx.fillStyle = hg; ctx.fillRect(0, G.HZ - 4, W, 220); }
  ctx.restore();
  // the meadow verge: grass blades and stubble, catching the light
  ctx.lineCap = 'round';
  for (const [X, Z, h, lean, v] of GRASS) {
    const [x, y, k] = P(X, Z), hh = h * k; if (hh < 1.2 || x < -30 || x > W + 30) continue;
    ctx.strokeStyle = v < .55 ? rgba(L.grass, .95) : rgba(L.grassLit, .55 + .3 * clamp(1 - Z / 40)); ctx.lineWidth = Math.max(.6, k * .012);
    const sw = Math.sin(t * 1.3 + X * 2 + Z) * .08 * hh; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + lean * hh * .3, y - hh * .6, x + lean * hh * .6 + sw, y - hh); ctx.stroke();
  }
  // tufts along the border so the meadow spills over the ploughed edge
  for (const [Zt, d, h, v] of EDGE) { const [x, y, k] = P(G.XL + d, Zt), hh = h * k; if (hh < 1 || y > H + 20) continue; ctx.strokeStyle = v < .5 ? rgba(L.grass, .95) : rgba(L.grassLit, .6); ctx.lineWidth = Math.max(.6, k * .011);
    for (let j = 0; j < 4; j++) { const lx = x + (j - 1.5) * hh * .12, ln = (j - 1.5) * .25 + Math.sin(t * 1.2 + Zt) * .05; ctx.beginPath(); ctx.moveTo(lx, y); ctx.quadraticCurveTo(lx + ln * hh * .3, y - hh * .6, lx + ln * hh, y - hh * (.8 + .2 * v)); ctx.stroke(); } }
  // mid mist over the field
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .25 + .7 * mist; ctx.drawImage(mistLayer(L, key, 1), -250 - ((t * 12 + cx * 14) % 250 + 250) % 250, (ch - G.H0) * 30); ctx.restore();
  // warm light over everything near the sun
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .7; ctx.drawImage(warmth(L, key), -200 - cx * 3, 0); ctx.restore();

  // sprouts (4.09): three fresh mounds near the soil spot, each with a shoot
  const soilW = [G.XL + 4.2, 8.6], spr = clamp(o.sprout ?? 0);
  if (spr > 0) for (let i = 0; i < 3; i++) {
    const [x, y, k] = P(soilW[0] + i * 1.5 - .8, soilW[1] + i * 1.6), r = .26 * k, gr = sm(clamp(spr * 1.6 - i * .25));
    ctx.fillStyle = L.shade; ctx.beginPath(); ctx.ellipse(x + r * .15, y + r * .05, r * 1.15, r * .42, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = mixHex(L.lit, L.crest, .25); ctx.beginPath(); ctx.ellipse(x, y - r * .08, r, r * .34, 0, Math.PI, TAU); ctx.fill();
    if (gr > 0) { const sh = .16 * k * gr, sw = Math.sin(t * 1.4 + i) * .1; ctx.strokeStyle = '#7fc06a'; ctx.lineWidth = Math.max(1, .012 * k); ctx.beginPath(); ctx.moveTo(x, y - r * .2); ctx.quadraticCurveTo(x + sh * .1, y - r * .2 - sh * .6, x + sh * (.1 + sw), y - r * .2 - sh); ctx.stroke();
      ctx.fillStyle = '#8fd27a'; for (const sg2 of [-1, 1]) { ctx.save(); ctx.translate(x + sh * (.1 + sw), y - r * .2 - sh); ctx.rotate(sg2 * .9 + sw); ctx.beginPath(); ctx.ellipse(sg2 * sh * .22, 0, sh * .24 * gr, sh * .1 * gr, 0, 0, TAU); ctx.fill(); ctx.restore(); } }
  }
  // pegs and strings
  const pg = clamp(o.pegs ?? 0), zPeg = G.ZN + 1.8, zFar = 120;
  const pegAt = (i, Z, k0) => { const s = sm(clamp((pg - k0) * 5)); return s; };
  const pegNear = (i) => { const [x, y] = P(stripX(i), zPeg, .42); return { x, y }; }, pegFar = (i) => { const [x, y] = P(stripX(i), zFar, .42); return { x, y }; };
  if (pg > 0 || str > 0) for (let i = 1; i < strips; i++) {
    const k0 = (i - 1) / strips, s = pegAt(i, zPeg, k0); if (s <= 0) continue;
    // far peg (tiny) and the string from the near peg toward it
    const [nx, ny, nk] = P(stripX(i), zPeg, .42 * s), [fx2, fy2] = P(stripX(i), zFar, .42), u = clamp(str * 1.35 - (i - 1) * .12);
    if (u > 0) {
      const ex = mix(nx, fx2, Math.pow(u, .55)), ey = mix(ny, fy2, Math.pow(u, .55));   // perspective: the line covers screen distance fast at first
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
      for (const [w, al] of [[5, .08], [1.6, .45], [.8, .9]]) { ctx.strokeStyle = rgba(w > 1 ? L.crest : L.sun, al); ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(nx, ny); ctx.quadraticCurveTo(mix(nx, ex, .5), mix(ny, ey, .5) + 2, ex, ey); ctx.stroke(); }
      if (u < 1) { const gr = ctx.createRadialGradient(ex, ey, 0, ex, ey, 12); gr.addColorStop(0, rgba(L.sun, .7)); gr.addColorStop(1, rgba(L.crest, 0)); ctx.fillStyle = gr; ctx.fillRect(ex - 12, ey - 12, 24, 24); }
      ctx.restore();
      if (u >= 1) { ctx.fillStyle = L.ink; ctx.fillRect(fx2 - 1, fy2, 2, 5); }
    }
    peg(ctx, P, stripX(i), zPeg, .42 * s, L);
  }
  // the stake at the field's corner with the sheet
  const ps = clamp(o.post ?? 0), stake = { X: G.XL - .75, Z: 6.4, h: 1.32 };
  const [px0, py0, pk] = P(stake.X, stake.Z), [px1, py1] = P(stake.X, stake.Z, stake.h * ps);
  const sway = .012 * Math.sin(t * .9) + .006 * Math.sin(t * 2.3);
  const sheet = { x: px1 + .05 * pk + .17 * pk, y: py1 + .26 * pk, w: .34 * pk, h: .44 * pk, ang: -.04 + sway };
  if (ps > 0) {
    // cast shadow toward us (the sun is behind), the post (rough wood, rim light), a nail and the sheet
    ctx.save(); ctx.translate(px0, py0); ctx.rotate(.25); const sh = ctx.createLinearGradient(0, 0, 0, 3.5 * pk); sh.addColorStop(0, rgba(L.ink, .45)); sh.addColorStop(1, rgba(L.ink, 0)); ctx.fillStyle = sh; ctx.beginPath(); ctx.ellipse(0, 1.6 * pk, .07 * pk, 1.7 * pk, 0, 0, TAU); ctx.fill(); ctx.restore();
    const w = .085 * pk; ctx.fillStyle = '#2a1d16'; ctx.beginPath(); ctx.moveTo(px0 - w / 2, py0); ctx.lineTo(px1 - w * .45, py1 + w * .2); ctx.lineTo(px1, py1 - w * .25); ctx.lineTo(px1 + w * .45, py1 + w * .2); ctx.lineTo(px0 + w / 2, py0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(L.crest, .8); ctx.lineWidth = Math.max(1, w * .12); ctx.beginPath(); ctx.moveTo(px0 + w * .45, py0); ctx.lineTo(px1 + w * .43, py1 + w * .2); ctx.stroke();
    ctx.strokeStyle = rgba('#000000', .35); ctx.lineWidth = Math.max(.6, w * .05); for (const q of [-.2, .05, .25]) { ctx.beginPath(); ctx.moveTo(px0 + w * q, py0); ctx.lineTo(px1 + w * q * .9, py1 + w * .3); ctx.stroke(); }
    if (o.sheet !== false) fieldSheet(ctx, sheet, t, L, ps);
  }
  // near mist rolling over the bottom of the frame
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .2 + .6 * mist; ctx.drawImage(mistLayer(L, key, 2), -250 - ((t * 16 + cx * 30) % 250 + 250) % 250, -(ch - G.H0) * 40); ctx.restore();
  ctx.restore();
  // anchors in screen space (after the zoom)
  const Z = (x, y) => [fx + (x - fx) * z, fy + (y - fy) * z];
  const [pX, pY] = Z(px0, py0), [sX, sY] = Z(...P(soilW[0], soilW[1]).slice(0, 2)), [, gY] = Z(0, P(0, G.ZN)[1]);
  const [shX, shY] = Z(sheet.x, sheet.y);
  return {
    post: { x: pX, y: pY }, soil: { x: sX, y: sY }, ground: () => gY, horizon: Z(0, G.HZ)[1], edgeZ: G.ZN, stripX,
    P: (X, Zd, Y = 0) => { const [x, y, k] = P(X, Zd, Y); const [a, b] = Z(x, y); return [a, b, k * z]; },
    sheet: { x: shX, y: shY, w: sheet.w * z, h: sheet.h * z, ang: sheet.ang },
    pegNear: (i) => { const p = pegNear(i), [a, b] = Z(p.x, p.y); return { x: a, y: b }; }, pegFar: (i) => { const p = pegFar(i), [a, b] = Z(p.x, p.y); return { x: a, y: b }; },
  };
}
function peg(ctx, P, X, Zd, h, L) {
  const [x0, y0, k] = P(X, Zd), [x1, y1] = P(X, Zd, h), w = .05 * k;
  if (w < .6) return;
  ctx.fillStyle = '#3a291e'; ctx.beginPath(); ctx.moveTo(x0 - w / 2, y0); ctx.lineTo(x1 - w / 2, y1); ctx.lineTo(x1 + w / 2, y1); ctx.lineTo(x0 + w / 2, y0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(L.crest, .85); ctx.fillRect(x1 - w / 2, y1 - 1, w, Math.max(1.2, w * .25)); ctx.fillRect(x1 + w * .3, y1, Math.max(1, w * .18), (y0 - y1) * .9);
  ctx.fillStyle = rgba(L.ink, .4); ctx.beginPath(); ctx.ellipse(x0 + w * .6, y0, w * 1.1, w * .3, 0, 0, TAU); ctx.fill();
}
// the sheet on the stake: cream paper, a slight curl, an empty signature line with an "x"
export function fieldSheet(ctx, S, t, L = PAL.dawn, a = 1) {
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(S.x, S.y); ctx.rotate(S.ang);
  const w = S.w, h = S.h, curl = Math.sin(t * 1.1) * .04 * w;
  ctx.fillStyle = 'rgba(10,6,4,.35)'; ctx.beginPath(); ctx.moveTo(-w / 2 + w * .06, -h / 2 + h * .05); ctx.lineTo(w / 2 + w * .06, -h / 2 + h * .05); ctx.lineTo(w / 2 + w * .06 + curl, h / 2 + h * .05); ctx.lineTo(-w / 2 + w * .06, h / 2 + h * .05); ctx.closePath(); ctx.fill();
  const g = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); g.addColorStop(0, '#f6ead2'); g.addColorStop(.6, '#e8d9bb'); g.addColorStop(1, '#c9b08c');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(w / 2, -h / 2); ctx.quadraticCurveTo(w / 2 + curl * .5, 0, w / 2 + curl, h / 2); ctx.lineTo(-w / 2, h / 2); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(L.crest, .9); ctx.lineWidth = Math.max(.8, w * .015); ctx.beginPath(); ctx.moveTo(w / 2, -h / 2); ctx.quadraticCurveTo(w / 2 + curl * .5, 0, w / 2 + curl, h / 2); ctx.stroke();
  if (w > 18) {
    ctx.strokeStyle = 'rgba(40,52,74,.55)'; ctx.lineWidth = Math.max(.5, w * .006);
    for (let i = 0; i < 4; i++) { const y = -h * .3 + i * h * .075; ctx.beginPath(); ctx.moveTo(-w * .36, y); ctx.lineTo(w * (i === 3 ? .1 : .36), y); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(31,26,38,.75)'; ctx.lineWidth = Math.max(.6, w * .01); ctx.beginPath(); ctx.moveTo(-w * .34, h * .26); ctx.lineTo(w * .34, h * .26); ctx.stroke();
    ctx.beginPath(); const xs = -w * .3, ys = h * .2, q = w * .03; ctx.moveTo(xs - q, ys - q); ctx.lineTo(xs + q, ys + q); ctx.moveTo(xs + q, ys - q); ctx.lineTo(xs - q, ys + q); ctx.stroke();
  }
  ctx.fillStyle = '#6b6f78'; ctx.beginPath(); ctx.arc(0, -h * .44, Math.max(1, w * .025), 0, TAU); ctx.fill();
  ctx.restore();
}
function mixHex(a, b, u) { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const m = (s) => Math.round(mix((A >> s) & 255, (B >> s) & 255, u)); return '#' + [m(16), m(8), m(0)].map((v) => v.toString(16).padStart(2, '0')).join(''); }
