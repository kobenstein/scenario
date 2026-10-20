// hook2.mjs · 10-second style example, infographic-led: a cut-paper dawn whose far horizon line lifts off,
// straightens and becomes the income line of a whole life (age 30 to 90), drawn as amber paper bars.
// VO: "One day soon, you might never have to work again." (1.5–4.5) "Your income, taken care of." (6.4–8.2)
//     "For the rest of your life." (8.7–10.3)
import { GlobalFonts } from '@napi-rs/canvas';
import { W, H, F, canvas, sheet, shadowOf, stipple, renderWorld, camPath, screenGlow, finish, proj,
  clamp, mix, lin, smoo, prng, rgba, mixHex, vnoise, fbm } from './paper.mjs';
const FONTS = '/home/user/scenario/style-tests/shared/fonts/';
GlobalFonts.registerFromPath(FONTS + 'InstrumentSerif.woff2', 'Instrument Serif');
for (const w of [400, 500, 600]) GlobalFonts.registerFromPath(FONTS + `Inter-${w}-normal.woff2`, 'Inter');

export const DUR = 11.4;
const AMBER = '#ffb35c', CREAM = '#f3efe2';
const expoIO = (x) => x <= 0 ? 0 : x >= 1 ? 1 : x < .5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
const expoO = (x) => x >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(x));
function grad(g, x0, y0, x1, y1, stops) { const gr = g.createLinearGradient(x0, y0, x1, y1); for (const [o, c] of stops) gr.addColorStop(o, c); return gr; }
let CAM = { x: 0, y: 0, z: 0 };

// ---------------------------------------------------------------- camera: calm push, small truck, then a long pull-back over a whole life
const cam = camPath([
  [0, { x: 0, y: 0, z: 0 }],
  [4.3, { x: 60, y: -10, z: 240 }],
  [6.4, { x: 200, y: 0, z: 320 }],
  [7.7, { x: 560, y: 50, z: 260 }],
  [11.4, { x: 3250, y: 230, z: -350 }],
], { drift: 1 });

// ---------------------------------------------------------------- the landscape: five paper layers, back-lit
const ridgeFn = (seed, amp, freq, oct = 4) => { const n = vnoise(seed); return (x) => (fbm(n, x * freq, seed * .37, oct) - .5) * 2 * amp; };
const LAYERS = [
  { z: 4200, sy: 520, col: '#e0a99a', amp: 900, freq: .00035, seed: 11, lit: '#ffe2c4', fall: 5.15 },
  { z: 2900, sy: 610, col: '#b47f8e', amp: 700, freq: .0005, seed: 23, lit: '#ffcfaa', fall: 5.0 },
  { z: 1900, sy: 720, col: '#5d5b86', amp: 520, freq: .0008, seed: 37, lit: '#f7b89a', fall: 4.9 },
  { z: 1150, sy: 850, col: '#2f3c63', amp: 330, freq: .0013, seed: 51, lit: '#e9a093', fall: 4.82 },
  { z: 650, sy: 1000, col: '#151b33', amp: 190, freq: .0024, seed: 63, lit: '#d48d8d', fall: 4.75 },
];
const TOP = 800;   // crest baseline inside each sheet
for (const L of LAYERS) {
  L.w = W * L.z / F * 1.6; L.h = 1300 * L.z / F + TOP; L.r = ridgeFn(L.seed, L.amp, L.freq);
  L.top = (L.sy - H / 2) * L.z / F - TOP; L.x0 = -L.w / 2 + 300;
  L.drop = (t) => 1250 * L.z / F * expoIO(lin(L.fall, L.fall + 1.15, t));
  L.crest = (X, t) => L.top + TOP + L.r(X - L.x0) + L.drop(t);   // world y of the crest at world x
}
function ridgeSheet(L) {
  const res = Math.min(1.25, 1.15 * F / L.z), prof = (x) => TOP + L.r(x);
  const s = sheet(L.w, L.h, res, (g) => {
    g.beginPath(); g.moveTo(0, L.h); for (let x = 0; x <= L.w; x += 4) g.lineTo(x, prof(x)); g.lineTo(L.w, L.h); g.closePath();
    g.fillStyle = grad(g, 0, 0, 0, L.h * .6, [[0, L.col], [1, mixHex(L.col, '#0a0818', .45)]]); g.fill();
    // the back light catches the slopes that face the sun and dissolves into grain
    const [l, lg] = canvas(L.w * res, L.h * res); lg.scale(res, res);
    lg.beginPath(); lg.moveTo(0, L.h); for (let x = 0; x <= L.w; x += 4) lg.lineTo(x, prof(x)); lg.lineTo(L.w, L.h); lg.closePath(); lg.clip();
    for (let x = 0; x <= L.w; x += 3) { const d = prof(x - 10) - prof(x + 10); lg.fillStyle = rgba(L.lit, .1 + clamp(d / 20) * .3); lg.fillRect(x, prof(x), 3.5, 40 + Math.max(0, d) * 4); }
    const [l2, lg2] = canvas(l.width, l.height); lg2.filter = 'blur(10px)'; lg2.drawImage(l, 0, 0); stipple(l2, { k: .25, seed: L.seed });
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(l2, 0, 0); g.restore();
  }, { edge: '#ffe6cc', edgeA: .75, edgeW: 2.2, texture: .1 });
  return s;
}
function hazeSheet(w, h, res, col, a, seed) {
  const [c, g] = canvas(w * res, h * res);
  g.fillStyle = grad(g, 0, 0, 0, c.height, [[0, rgba(col, 0)], [.3, rgba(col, a)], [1, rgba(col, a * .2)]]); g.fillRect(0, 0, c.width, c.height);
  const n = vnoise(seed), d = g.getImageData(0, 0, c.width, c.height), p = d.data;
  for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) { const i = (y * c.width + x) * 4 + 3; p[i] *= .5 + fbm(n, x / res * .002, y / res * .02, 3); }
  g.putImageData(d, 0, 0); stipple(c, { k: .2, seed });
  return { img: c, w, h, res };
}

// ---------------------------------------------------------------- the chart: a lifetime of income, age 30 to 90
const CZ = 2000, BZ = 1960;                       // grid board depth, bars + line depth (bars cast shadows on the board)
const lineY = (515 - H / 2) * CZ / F;             // the income line (world y): where the horizon settles
const axisY = (725 - H / 2) * CZ / F;             // the age axis
const A0 = 30, A1 = 90, X30 = -1700, PER = 100;   // one year = 100 world units
const ageX = (a) => X30 + (a - A0) * PER;
const BAR_W = 74;
const barStart = (i) => i < 35 ? 6.45 + i * .03 : 8.7 + (i - 35) * .058;   // ages 30–64 with "income", 65–90 with "rest of your life"
const gridIn = (t) => smoo(lin(5.6, 6.7, t));
const morph = (t) => expoIO(lin(5.25, 6.35, t));  // crest -> straight line
const trace = (t) => smoo(lin(4.15, 5.2, t));     // light runs along the far crest

export async function build() {
  const sheets = LAYERS.map(ridgeSheet);
  const planes = [];
  LAYERS.forEach((L, i) => {
    const s = sheets[i], sh = shadowOf(s, 12, .18);
    planes.push({ z: L.z, x: L.x0 + L.w / 2, y: (t) => L.top + L.h / 2 + L.drop(t), w: L.w, h: L.h, img: s, near: 60,
      a: (t) => 1 - lin(L.fall + .7, L.fall + 1.15, t),
      shadow: { ...sh, dx: 0, dy: -14 * L.z / F, dz: 40, a: .55 } });
    if (false) { const hw = L.w, hh = 500 * L.z / F;
      planes.push({ z: L.z - 60, x: L.x0 + L.w / 2, y: (t) => L.top + TOP + hh * .35 + L.drop(t), w: hw, h: hh, near: 60,
        img: hazeSheet(hw, hh, .25 * F / L.z, '#f2b8a6', .45 - i * .1, 70 + i), a: (t) => 1 - lin(L.fall + .3, L.fall + .9, t) }); }
  });

  // paper bar (one baked strip, reused) and its soft shadow
  const BAR_H = axisY - lineY - 16;
  const bar = sheet(BAR_W, BAR_H + 200, 1.2, (g) => {
    g.fillStyle = grad(g, 0, 0, 0, BAR_H, [[0, '#ffc477'], [.5, AMBER], [1, '#b8622a']]); g.fillRect(0, 0, BAR_W, BAR_H + 200);
    g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(0, 0, BAR_W * .3, BAR_H + 200);   // light from the left
  }, { edge: '#fff4dd', edgeA: .9, edgeW: 3 });
  const barSh = shadowOf(bar, 8, .3);

  // grid board: faint engraved lines on the sky (fade in as the hills fall away)
  const left = X30 - 400, right = ageX(A1) + 600, top = lineY - 1500, bottom = axisY + 700;
  planes.push({ z: CZ, x: (left + right) / 2, y: (top + bottom) / 2, w: right - left, h: bottom - top, near: 40, a: gridIn,
    draw: (g, t, s) => {
      g.translate(-left, -top);
      const groove = (x0, y0, x1, y1, a) => { g.lineWidth = 1.4 / s; g.strokeStyle = rgba('#0b0a20', .35 * a); g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
        g.strokeStyle = rgba('#ffe4cf', .16 * a); g.beginPath(); g.moveTo(x0 + 1.4 / s, y0 + 1.4 / s); g.lineTo(x1 + 1.4 / s, y1 + 1.4 / s); g.stroke(); };
      for (let a = A0; a <= A1; a += 10) groove(ageX(a), top + 300, ageX(a), axisY, 1);
      for (let k = 1; k <= 6; k++) groove(left, axisY - k * 220, right, axisY - k * 220, .7);
    } });

  // bars, axis, labels and the line itself
  planes.push({ z: BZ, x: (left + right) / 2, y: (top + bottom) / 2, w: right - left, h: bottom - top, near: 40,
    draw: (g, t, s) => {
      g.translate(-left, -top);   // local = world
      // age axis: a cream paper rule that draws itself on from the left
      const ax = smoo(lin(6.2, 7.4, t)), axEnd = mix(X30 - 200, ageX(A1) + 200, ax * .55 + .45 * smoo(lin(8.7, 10.4, t)));
      if (ax > 0) { g.fillStyle = rgba(CREAM, .85 * (1 - lin(11.4, 11.9, t))); g.fillRect(X30 - 200, axisY, axEnd - X30 + 200, 5); }
      // bars (each a year of income), rising with an expo ease and a small overshoot settle
      g.save(); g.beginPath(); g.rect(X30 - 300, lineY - 400, (A1 - A0 + 8) * PER, axisY - lineY + 3000); g.clip();
      for (let i = 0; i <= A1 - A0; i++) {
        const k = lin(barStart(i), barStart(i) + .55, t); if (k <= 0) continue;
        const e = expoO(k), y = axisY - (BAR_H) * e + 6 * Math.sin(k * Math.PI) * (1 - k) + 1400 * expoIO(lin(11.35 + i * .012, 12.05 + i * .012, t)), x = ageX(A0 + i) - BAR_W / 2;
        const sk = barSh.scale / bar.res;
        g.globalAlpha = .45; g.drawImage(barSh.img, x - 10 - barSh.pad / sk, y + 8 - barSh.pad / sk, barSh.img.width / sk, barSh.img.height / sk); g.globalAlpha = 1;
        g.drawImage(bar.img, x, y, BAR_W, BAR_H + 200);
      }
      g.restore();
      // age labels under the axis, each arriving with its decade's first bar
      g.font = '130px "Instrument Serif"'; g.textAlign = 'center'; g.textBaseline = 'top';
      for (let a = A0; a <= A1; a += 10) { const k = smoo(lin(barStart(a - A0) + .1, barStart(a - A0) + .6, t)); if (k <= 0) continue;
        g.save(); g.beginPath(); g.rect(ageX(a) - 160, axisY + 22, 320, 170); g.clip();
        g.fillStyle = rgba(CREAM, .9 * k * (1 - lin(11.4, 11.9, t))); g.fillText(String(a), ageX(a), axisY + 30 + (1 - k) * 140); g.restore(); }
      { const k = smoo(lin(9.0, 9.8, t)); if (k > 0) { g.font = '600 46px Inter'; g.letterSpacing = '14px'; g.textAlign = 'left'; g.fillStyle = rgba('#a49fc4', k * (1 - lin(11.4, 11.9, t))); g.fillText('AGE', ageX(A1) + 170, axisY + 70); g.letterSpacing = '0px'; } }
      // label: line + two-line caption, wiped in from below
      { const k = smoo(lin(6.55, 7.25, t)), lx = -640, ly = lineY - 70;
        if (k > 0) { g.save(); g.beginPath(); g.rect(lx - 10, ly - 150, 1200, 150); g.clip();
          g.fillStyle = rgba(CREAM, 1); g.font = '600 56px Inter'; g.letterSpacing = '16px'; g.textAlign = 'left'; g.textBaseline = 'alphabetic';
          g.fillText('YOUR INCOME', lx, ly - 62 + (1 - k) * 110); g.font = '500 38px Inter'; g.letterSpacing = '10px'; g.fillStyle = rgba('#d8cde8', 1);
          g.fillText('EVERY YEAR, GUARANTEED', lx, ly - 6 + (1 - k) * 110); g.letterSpacing = '0px'; g.restore(); } }
      // the line, once it has settled: a thin glowing amber rule from age 30 to 90, with a light at its end
      if (morph(t) >= 1) {
        const x1 = ageX(A1);
        g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = rgba('#ffcf8f', .22); g.lineWidth = 22; g.beginPath(); g.moveTo(X30 - 3000, lineY); g.lineTo(x1, lineY); g.stroke(); g.restore();
        g.strokeStyle = '#ffe2b0'; g.lineWidth = 5; g.beginPath(); g.moveTo(X30 - 3000, lineY); g.lineTo(x1, lineY); g.stroke();
        const k = smoo(lin(9.6, 10.8, t)); if (k > 0) { g.save(); g.globalCompositeOperation = 'lighter';
          const gr = g.createRadialGradient(x1, lineY, 0, x1, lineY, 260); gr.addColorStop(0, rgba('#fff0cf', .9 * k)); gr.addColorStop(.3, rgba('#ffc27a', .35 * k)); gr.addColorStop(1, rgba('#ffb35c', 0));
          g.fillStyle = gr; g.fillRect(x1 - 260, lineY - 260, 520, 520); g.restore(); g.fillStyle = rgba('#fff4dc', k); g.beginPath(); g.arc(x1, lineY, 13, 0, 7); g.fill(); }
      }
    } });

  const world = {
    bg: (g, c, t) => {
      const u = smoo(lin(4.9, 6.2, t));   // dawn sky deepens into the chart board
      g.fillStyle = grad(g, 0, 0, 0, H, [[0, mixHex('#16193a', '#12132c', u)], [.35, mixHex('#3c3f73', '#1f2148', u)], [.55, mixHex('#b07b93', '#2e2c5a', u)],
        [.68, mixHex('#f0b48f', '#433a68', u)], [1, mixHex('#f7cf9f', '#4a3e66', u)]]); g.fillRect(0, 0, W, H);
      const r = prng(12); for (let i = 0; i < 7; i++) { const y = 120 + r() * 260, x = ((r() * 2600 + t * (5 + r() * 5)) % 2600) - 300, w = 300 + r() * 500;
        g.fillStyle = rgba(mixHex('#c88fa6', '#ffd2b0', y / 400), (.16 + r() * .14) * (1 - u * .7)); g.beginPath(); g.ellipse(x, y, w / 2, 4 + r() * 8, 0, 0, 7); g.fill(); }
      const sx = 1240, sy = mix(640, 455, smoo(clamp(t / 6))) - 150 * smoo(lin(6.6, 11.4, t)), up = smoo(lin(2.4, 4.6, t));
      screenGlow(g, sx, sy, 820, '#ffb88a', (.3 + .25 * up) * (1 - u * .55), .55);
      screenGlow(g, sx, sy, 230, '#ffc98a', .5 + .3 * up);
      g.fillStyle = '#fff1cf'; g.beginPath(); g.arc(sx, sy, 40, 0, 7); g.fill();
    },
    planes,
    post: (g, c, t) => {
      // the far horizon: light runs along its crest, it lifts off the paper and straightens into the income line
      const tr = trace(t), m = morph(t); if (tr <= 0 || m >= 1) return;
      const L = LAYERS[0], s1 = F / (L.z - c.z), s2 = F / (BZ - c.z), pts = [];
      for (let sx = -20; sx <= W + 20; sx += 8) {
        const X = c.x + (sx - W / 2) / s1, yc = H / 2 + (L.top + TOP + L.r(X - L.x0) - c.y) * s1;
        const yl = H / 2 + (lineY - c.y) * s2; pts.push([sx, mix(yc, yl, m)]);
      }
      const n = Math.floor(pts.length * tr);
      g.save(); g.lineJoin = 'round'; g.lineCap = 'round';
      const path = () => { g.beginPath(); pts.slice(0, n).forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); };
      g.globalCompositeOperation = 'lighter'; g.strokeStyle = rgba('#ffcf8f', .25); g.lineWidth = 14; path(); g.stroke();
      g.globalCompositeOperation = 'source-over'; g.strokeStyle = '#ffe2b0'; g.lineWidth = 3 + 0.25 * m * 0 + 2 * m; path(); g.stroke();
      if (tr < 1 && n > 0) { const [hx, hy] = pts[n - 1]; screenGlow(g, hx, hy, 70, '#fff0cf', .8); }
      g.restore();
    },
  };

  const [c, g] = canvas(W, H);
  return {
    duration: DUR,
    frame(t) {
      CAM = cam(t); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
      renderWorld(g, world, CAM, t);
      finish(g, t, { vig: .38 });
      return c;
    },
  };
}
