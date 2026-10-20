// c14 (Film 4 v2) · the banknote (shots 14.02–14.04): cream paper, green-grey guilloche, microtext, a stern engraved portrait of a man
// in a suit in its central oval, 100 in the corners. Note space: NW × NH px (150 × 75 mm, 16 px per mm), origin top left.
//   noteBase()            cached Image: everything that stays (paper, border, rosettes, seals, banner, oval frame, serials, signatures)
//   inkStatic()           cached Image: what washes out (the portrait with its oval ground, the four 100s), as engraved lines
//   inkFrame(u, t)        the ink layer while it washes out: u 0 → .3 the lines break into dots, .3 → 1 the dots lift off as smoke
//                         → a canvas in note space (or null when nothing is left)
//   OV                    the portrait oval { x, y, a, b } (note px)
// The ink is one engraving system: each region has its line families (straight or concentric), a tone 0..1 sets each line's width
// (a box-filtered band, so thin lines stay thin), and the same lines become the dots of the smoke.
import { clamp, mix, prng, canvas, rgba } from '../engine.mjs';
import { guilloche, gBorder, microtext } from './certificate.mjs';
import { scribble } from './paper.mjs';
import { once, onceRaw, TAU } from './v2_c14_util.mjs';

export const NW = 2400, NH = 1200;
export const OV = { x: 1200, y: 600, a: 272, b: 336 };
export const NOTE_M = .15;                                  // the note's width in metres
export const PAPERC = '#ebe2c6', G1 = '#2b463c', G2 = '#557366', G3 = '#a7b9a6', CARM = '#8e3b31';
const G1RGB = [43, 70, 60];

// ---------------------------------------------------------------- the paper and everything printed that stays
const strokeP = (g, pts, close) => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); if (close) g.closePath(); g.stroke(); };
function ellipseBand(g, cx, cy, a, b, o) {
  // a woven guilloche band around an ellipse (offsets r0..r1 outside the ellipse a, b)
  const { r0, r1, lines = 12, waves = 96, col = G1, w = 1, al = .9 } = o, N = 1400, mid = (r0 + r1) / 2, amp = (r1 - r0) / 2 * .92;
  g.save(); g.strokeStyle = col; g.lineWidth = w; g.globalAlpha = al; g.lineJoin = 'round';
  for (let i = 0; i < lines; i++) {
    const ph = i / lines * TAU, pts = [];
    for (let j = 0; j <= N; j++) {
      const th = j / N * TAU, off = mid + amp * (Math.sin(waves * th + ph) * .78 + Math.sin(waves * 2 * th - ph * 1.7) * .22);
      const c = Math.cos(th), s = Math.sin(th), nx = b * c, ny = a * s, nl = Math.hypot(nx, ny) || 1;
      pts.push([cx + a * c + nx / nl * off, cy + b * s + ny / nl * off]);
    }
    strokeP(g, pts, true);
  }
  g.restore();
}
function ellipsePts(cx, cy, a, b, off = 0, N = 720) {
  const pts = []; for (let j = 0; j <= N; j++) { const th = j / N * TAU, c = Math.cos(th), s = Math.sin(th), nx = b * c, ny = a * s, nl = Math.hypot(nx, ny) || 1; pts.push([cx + a * c + nx / nl * off, cy + b * s + ny / nl * off]); } return pts;
}
function sawSeal(g, cx, cy, R, o = {}) {
  const teeth = o.teeth ?? 64, col = o.col ?? G1;
  g.save(); g.translate(cx, cy);
  g.beginPath(); for (let i = 0; i <= teeth * 2; i++) { const a = i / (teeth * 2) * TAU, r = i % 2 ? R * .93 : R; i ? g.lineTo(Math.cos(a) * r, Math.sin(a) * r) : g.moveTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath();
  g.fillStyle = rgba(PAPERC, 1); g.fill(); g.strokeStyle = col; g.lineWidth = 2.2; g.stroke();
  g.lineWidth = 1.4; for (const q of [.86, .82, .5]) { g.beginPath(); g.arc(0, 0, R * q, 0, TAU); g.stroke(); }
  const G = guilloche({ R: R * .62, A: R * .14, B: R * .06, n: o.n ?? 14, m: o.m ?? 5, lines: 30 }); g.lineWidth = 1; g.globalAlpha = .9; g.strokeStyle = G2;
  for (let k = 0; k < G.lines; k++) strokeP(g, G.line(k));
  g.globalAlpha = 1;
  // a solid engraved star in the centre (a struck emblem, no letters)
  const sp = o.points ?? 12; g.fillStyle = col; g.beginPath();
  for (let i = 0; i <= sp * 2; i++) { const a = i / (sp * 2) * TAU - Math.PI / 2, r = i % 2 ? R * .17 : R * .42; i ? g.lineTo(Math.cos(a) * r, Math.sin(a) * r) : g.moveTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fill();
  g.fillStyle = rgba(PAPERC, 1); g.beginPath(); g.arc(0, 0, R * .14, 0, TAU); g.fill(); g.strokeStyle = col; g.lineWidth = 1.6; g.stroke();
  g.restore();
}
// the four corner cartouches (the 100s themselves are ink, they wash out)
export const CORNERS = [[230, 196], [NW - 230, 196], [230, NH - 196], [NW - 230, NH - 196]];
const CART = { rx: 168, ry: 104 };
export function noteBase() {
  return once('c14-note-base', () => {
    const [c, g] = canvas(NW, NH), r = prng(77);
    // paper: cream with a faint green tint toward the middle, soft mottling, fibres
    const pg = g.createRadialGradient(NW / 2, NH / 2, 80, NW / 2, NH / 2, NW * .62);
    pg.addColorStop(0, '#eee7cf'); pg.addColorStop(.6, PAPERC); pg.addColorStop(1, '#ddd2b2');
    g.fillStyle = pg; g.fillRect(0, 0, NW, NH);
    { const [mc, mx] = canvas(96, 48), d = mx.createImageData(96, 48); for (let i = 0; i < d.data.length; i += 4) { const v = 120 + r() * 120; d.data[i] = v; d.data[i + 1] = v * .98; d.data[i + 2] = v * .9; d.data[i + 3] = 255; } mx.putImageData(d, 0, 0);
      g.save(); g.globalAlpha = .07; g.globalCompositeOperation = 'multiply'; g.imageSmoothingEnabled = true; g.drawImage(mc, 0, 0, NW, NH); g.restore(); }
    g.save(); g.lineWidth = 1; for (let i = 0; i < 900; i++) { const x = r() * NW, y = r() * NH, l = 6 + r() * 22, a = r() * TAU; g.strokeStyle = r() < .5 ? 'rgba(120,140,120,.16)' : 'rgba(150,120,90,.14)'; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a + .6) * l * .6, y + Math.sin(a + .6) * l * .6, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); } g.restore();
    // underprint: lathe-work waves across the whole note, two big rosettes behind the seals
    g.save(); g.strokeStyle = G3; g.lineWidth = 1; g.globalAlpha = .5;
    for (let y = 110; y < NH - 100; y += 7) {
      g.beginPath();
      for (let x = 100; x <= NW - 100; x += 6) {
        const A = 5 + 4 * Math.sin(x * .0021 + y * .004) * Math.sin(y * .011);
        const yy = y + A * Math.sin(x * .031 + y * .19) + 2 * Math.sin(x * .0087 - y * .05);
        x === 100 ? g.moveTo(x, yy) : g.lineTo(x, yy);
      }
      g.stroke();
    }
    g.restore();
    for (const [x, R, n, m] of [[640, 250, 22, 7], [NW - 640, 250, 20, 9]]) {
      const G = guilloche({ R, A: 38, B: 16, n, m, lines: 46 }); g.save(); g.translate(x, NH / 2); g.strokeStyle = G3; g.lineWidth = 1.1; g.globalAlpha = .8;
      for (let k = 0; k < G.lines; k++) strokeP(g, G.line(k)); g.restore();
    }
    // the border: outer rule, woven band, inner rule, microtext rows
    g.strokeStyle = G1; g.lineWidth = 3; g.strokeRect(24, 24, NW - 48, NH - 48);
    gBorder(g, 36, 36, NW - 72, NH - 72, { band: 60, lines: 11, waves: 150, col: G2, w: 1.15, a: .95, radius: 24 });
    g.strokeStyle = G1; g.lineWidth = 1.6; g.strokeRect(104, 104, NW - 208, NH - 208);
    for (const y of [116, NH - 116]) microtext(g, 400, y, NW - 800, 'ONE HUNDRED', { size: 11, col: G1, a: .8, spacing: 1.2 });
    // the corner cartouches: an ellipse of fine rosette lines in a double frame
    for (const [x, y] of CORNERS) {
      g.save(); g.translate(x, y);
      g.fillStyle = '#efe8d0'; g.beginPath(); g.ellipse(0, 0, CART.rx, CART.ry, 0, 0, TAU); g.fill();
      g.strokeStyle = G3; g.lineWidth = 1; g.globalAlpha = .95;
      for (let k = 0; k < 18; k++) { const ph = k / 18 * TAU; g.beginPath(); for (let j = 0; j <= 360; j++) { const th = j / 360 * TAU, q = .55 + .38 * (.5 + .5 * Math.sin(12 * th + ph)) * (.8 + .2 * Math.sin(5 * th - ph)); const X = Math.cos(th) * CART.rx * q, Y = Math.sin(th) * CART.ry * q; j ? g.lineTo(X, Y) : g.moveTo(X, Y); } g.stroke(); }
      g.globalAlpha = 1; g.strokeStyle = G1; g.lineWidth = 2.2; g.beginPath(); g.ellipse(0, 0, CART.rx, CART.ry, 0, 0, TAU); g.stroke();
      g.lineWidth = 1.1; g.beginPath(); g.ellipse(0, 0, CART.rx - 8, CART.ry - 8, 0, 0, TAU); g.stroke();
      g.restore();
    }
    // the banner on top: a ribbon with two rows of microtext
    {
      const x0 = 820, x1 = NW - 820, y0 = 126, y1 = 196;
      g.save(); g.fillStyle = '#e9e1c6'; g.strokeStyle = G1; g.lineWidth = 1.8;
      g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y0); g.quadraticCurveTo(x1 + 40, (y0 + y1) / 2, x1 + 70, y0 + 8); g.lineTo(x1 + 50, (y0 + y1) / 2 + 4); g.lineTo(x1 + 70, y1 + 6); g.quadraticCurveTo(x1 + 36, y1 + 4, x1, y1);
      g.lineTo(x0, y1); g.quadraticCurveTo(x0 - 36, y1 + 4, x0 - 70, y1 + 6); g.lineTo(x0 - 50, (y0 + y1) / 2 + 4); g.lineTo(x0 - 70, y0 + 8); g.quadraticCurveTo(x0 - 40, (y0 + y1) / 2, x0, y0); g.closePath(); g.fill(); g.stroke();
      g.lineWidth = 1; g.beginPath(); g.moveTo(x0 + 10, y0 + 7); g.lineTo(x1 - 10, y0 + 7); g.moveTo(x0 + 10, y1 - 7); g.lineTo(x1 - 10, y1 - 7); g.stroke();
      microtext(g, x0 + 16, y0 + 24, x1 - x0 - 32, 'ONE HUNDRED', { size: 13, col: G1, a: .85, spacing: 1.4 });
      microtext(g, x0 + 30, y1 - 24, x1 - x0 - 60, 'ONE HUNDRED', { size: 13, col: G1, a: .85, spacing: 1.4 });
      g.restore();
    }
    // the oval frame: woven band, rules, microtext ring outside it
    {
      const { x, y, a, b } = OV;
      g.save(); g.fillStyle = '#efe8d0'; g.beginPath(); g.ellipse(x, y, a + 60, b + 60, 0, 0, TAU); g.fill(); g.restore();
      ellipseBand(g, x, y, a, b, { r0: 10, r1: 52, lines: 13, waves: 104, col: G2, w: 1.05, al: .95 });
      g.strokeStyle = G1; g.lineWidth = 2.4; strokeP(g, ellipsePts(x, y, a, b, 6), true); strokeP(g, ellipsePts(x, y, a, b, 56), true);
      g.lineWidth = 1; strokeP(g, ellipsePts(x, y, a, b, 64), true);
      // microtext around the frame
      const pts = ellipsePts(x, y, a, b, 74, 900); g.save(); g.font = '600 12px "Inter"'; g.fillStyle = G1; g.globalAlpha = .85; g.textAlign = 'center'; g.textBaseline = 'middle';
      const unit = 'ONE HUNDRED · '; let s = 0, k = 0; const d = [0]; for (let i = 1; i < pts.length; i++) d.push(d[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      const L = d[d.length - 1]; let j = 0;
      while (s < L - 10) { const ch = unit[k++ % unit.length], wch = g.measureText(ch).width + 1.4, sm2 = s + wch / 2; s += wch; while (j < d.length - 2 && d[j + 1] < sm2) j++; const q = (sm2 - d[j]) / ((d[j + 1] - d[j]) || 1), px = mix(pts[j][0], pts[j + 1][0], q), py = mix(pts[j][1], pts[j + 1][1], q), an = Math.atan2(pts[j + 1][1] - pts[j][1], pts[j + 1][0] - pts[j][0]); if (ch !== ' ') { g.save(); g.translate(px, py); g.rotate(an); g.fillText(ch, 0, 0); g.restore(); } }
      g.restore();
    }
    // seals left and right of the oval
    sawSeal(g, 640, NH / 2, 128, { teeth: 72, n: 14, m: 5, points: 12 });
    sawSeal(g, NW - 640, NH / 2, 112, { teeth: 60, n: 11, m: 4, points: 8 });
    // serial numbers (carmine) and signatures (unreadable, as on every note)
    g.save(); g.font = '600 40px "Inter"'; g.fillStyle = CARM; g.globalAlpha = .9; try { g.letterSpacing = '7px'; } catch { }
    g.textAlign = 'left'; g.fillText('B 04817263 A', 430, 372); g.textAlign = 'right'; g.fillText('B 04817263 A', NW - 430, NH - 330); g.restore();
    for (const [x, sd] of [[430, 11], [NW - 830, 23]]) {
      scribble(g, x + 14, NH - 268, 360, 30, { seed: sd, ink: '#22302c', lw: 2.6 });
      g.strokeStyle = G1; g.lineWidth = 1.3; g.beginPath(); g.moveTo(x, NH - 236); g.lineTo(x + 400, NH - 236); g.stroke();
      microtext(g, x + 40, NH - 216, 320, 'ONE HUNDRED', { size: 9, col: G1, a: .75, spacing: 1 });
    }
    // the denomination in words (a number, the only plain text on the note)
    g.save(); g.font = '600 46px "Inter"'; g.fillStyle = G1; g.textAlign = 'center'; try { g.letterSpacing = '18px'; } catch { } g.fillText('ONE HUNDRED', NW / 2 + 9, NH - 132); g.restore();
    // worn edge: a slightly darker rim
    g.save(); const eg = g.createLinearGradient(0, 0, 0, NH); g.globalCompositeOperation = 'multiply'; g.strokeStyle = 'rgba(176,160,128,.55)'; g.lineWidth = 10; g.strokeRect(5, 5, NW - 10, NH - 10); void eg; g.restore();
    return c;
  });
}

// ---------------------------------------------------------------- the ink that washes out: the portrait and the four 100s
// The portrait is engraved like a medal on a ruling machine: one family of fine parallel lines runs across the whole oval and is
// deflected by the relief (so it bends over the forehead, the nose, the shoulders), a second family crosses it in the dark tones.
// The relief is built from the painted silhouettes (inflated) plus sculpted bumps; light from the upper left with cast shadows.
export const PB = { x0: OV.x - OV.a, y0: OV.y - OV.b, w: OV.a * 2, h: OV.b * 2 };
const KAP = .16;                                                          // line deflection per px of relief height
export const FAMS = [{ ang: -.05, P: 3.6, kap: KAP }, { ang: 1.02, P: 3.9, kap: KAP }];
export const FNUM = { ang: 0, P: 3.2, kap: 0 };
// split a tone 0..1 into the two families' line coverages
const split = (T) => { if (T <= .46) return [T, 0]; const c1 = .46 + (T - .46) * .5, c2 = 1 - (1 - T) / (1 - c1); return [c1, clamp(c2)]; };
// coverage of a band of half width hw at distance d from its centre, box-filtered over one pixel
const band = (d, hw) => Math.max(0, Math.min(d + .5, hw) - Math.max(d - .5, -hw));

// a smooth dome over a mask (membrane inflation: solve laplace(P) = -1 inside, P = 0 outside, by SOR on a grid ds times coarser;
// sqrt(P) makes the profile round, R scales it to that height at the widest part)
function dome(M, w, h, R, ds = 4) {
  const gw = Math.ceil(w / ds) + 2, gh = Math.ceil(h / ds) + 2, G = new Float32Array(gw * gh), In = new Uint8Array(gw * gh);
  for (let j = 1; j < gh - 1; j++) for (let i = 1; i < gw - 1; i++) {
    let s = 0, n = 0; for (let b = 0; b < ds; b++) for (let a = 0; a < ds; a++) { const x = (i - 1) * ds + a, y = (j - 1) * ds + b; if (x < w && y < h) { s += M[y * w + x]; n++; } }
    In[j * gw + i] = n && s / n > .5 ? 1 : 0;
  }
  const om = 1.9;
  for (let it = 0; it < 900; it++) {
    for (let j = 1; j < gh - 1; j++) for (let i = 1; i < gw - 1; i++) { const k = j * gw + i; if (!In[k]) continue; const v = (G[k - 1] + G[k + 1] + G[k - gw] + G[k + gw] + 1) / 4; G[k] += om * (v - G[k]); }
  }
  let mx = 0; for (let k = 0; k < G.length; k++) { G[k] = Math.sqrt(Math.max(0, G[k])); if (G[k] > mx) mx = G[k]; }
  const out = new Float32Array(w * h), sc = R / (mx || 1);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const gx = (x + .5) / ds + .5, gy = (y + .5) / ds + .5, i0 = Math.floor(gx), j0 = Math.floor(gy), fx = gx - i0, fy = gy - j0;
    const at = (i, j) => G[Math.min(gh - 1, Math.max(0, j)) * gw + Math.min(gw - 1, Math.max(0, i))];
    out[y * w + x] = sc * ((at(i0, j0) * (1 - fx) + at(i0 + 1, j0) * fx) * (1 - fy) + (at(i0, j0 + 1) * (1 - fx) + at(i0 + 1, j0 + 1) * fx) * fy);
  }
  return out;
}
const maxM = (A, B) => A.map((v, i) => Math.max(v, B[i]));
// separable box blur (radius r, two passes ≈ gaussian) of a w × h field
function blurF(A, w, h, r = 2) {
  const tmp = new Float32Array(A.length), out = new Float32Array(A.length);
  for (let pass = 0; pass < 2; pass++) {
    const src = pass ? out : A;
    for (let y = 0; y < h; y++) { let s = 0; for (let x = -r; x <= r; x++) s += src[y * w + Math.min(w - 1, Math.max(0, x))]; for (let x = 0; x < w; x++) { tmp[y * w + x] = s / (2 * r + 1); s += src[y * w + Math.min(w - 1, x + r + 1)] - src[y * w + Math.max(0, x - r)]; } }
    for (let x = 0; x < w; x++) { let s = 0; for (let y = -r; y <= r; y++) s += tmp[Math.min(h - 1, Math.max(0, y)) * w + x]; for (let y = 0; y < h; y++) { out[y * w + x] = s / (2 * r + 1); s += tmp[Math.min(h - 1, y + r + 1) * w + x] - tmp[Math.max(0, y - r) * w + x]; } }
  }
  return out;
}

// the silhouettes (portrait box px): a man in profile facing left, like a medal — strong brow, straight nose, firm mouth, set chin
const SIL = {
  body: (c) => { c.moveTo(232, 474); c.bezierCurveTo(212, 520, 194, 600, 180, 700); c.lineTo(600, 700); c.lineTo(600, 600); c.bezierCurveTo(530, 520, 470, 474, 424, 452); c.bezierCurveTo(380, 456, 300, 466, 232, 474); c.closePath(); },
  lapel: (c) => { c.moveTo(246, 478); c.bezierCurveTo(236, 520, 226, 560, 214, 600); c.lineTo(236, 612); c.bezierCurveTo(226, 650, 218, 680, 214, 700); c.lineTo(194, 700); c.bezierCurveTo(204, 610, 220, 530, 236, 476); c.closePath(); },
  shirt: (c) => { c.moveTo(232, 474); c.bezierCurveTo(218, 520, 204, 600, 192, 700); c.lineTo(212, 700); c.bezierCurveTo(222, 600, 234, 520, 244, 476); c.closePath(); },
  tie: (c) => { c.moveTo(229, 480); c.bezierCurveTo(218, 530, 208, 600, 198, 700); c.lineTo(206, 700); c.bezierCurveTo(216, 600, 226, 530, 238, 482); c.closePath(); },
  collar: (c) => { c.moveTo(226, 452); c.bezierCurveTo(262, 446, 340, 440, 416, 436); c.lineTo(420, 450); c.bezierCurveTo(340, 458, 270, 468, 234, 484); c.closePath(); },
  knot: (c) => { c.moveTo(220, 462); c.bezierCurveTo(212, 470, 214, 482, 224, 490); c.lineTo(244, 486); c.lineTo(244, 462); c.closePath(); },
  neck: (c) => { c.moveTo(206, 410); c.bezierCurveTo(224, 428, 238, 446, 240, 470); c.lineTo(414, 466); c.bezierCurveTo(406, 420, 408, 378, 416, 334); c.lineTo(318, 392); c.closePath(); },
  head: (c) => {
    c.moveTo(320, 108); c.bezierCurveTo(384, 108, 436, 150, 444, 220); c.bezierCurveTo(450, 270, 438, 312, 414, 338);
    c.bezierCurveTo(380, 360, 334, 376, 318, 392); c.bezierCurveTo(300, 410, 240, 420, 206, 418);
    c.bezierCurveTo(192, 416, 184, 406, 183, 394); c.bezierCurveTo(182, 384, 190, 376, 192, 372);
    c.bezierCurveTo(186, 368, 180, 364, 180, 359); c.bezierCurveTo(180, 354, 186, 351, 189, 350);
    c.bezierCurveTo(183, 347, 177, 343, 178, 338); c.bezierCurveTo(179, 332, 182, 326, 184, 322);
    c.bezierCurveTo(176, 322, 162, 320, 159, 313); c.bezierCurveTo(157, 306, 162, 298, 166, 292);
    c.bezierCurveTo(176, 276, 186, 262, 190, 255); c.bezierCurveTo(186, 248, 182, 244, 182, 236);
    c.bezierCurveTo(182, 222, 186, 200, 192, 186); c.bezierCurveTo(210, 140, 258, 108, 320, 108); c.closePath(); },
  ear: (c) => { c.moveTo(332, 246); c.bezierCurveTo(356, 236, 374, 254, 372, 280); c.bezierCurveTo(371, 304, 358, 324, 340, 326); c.bezierCurveTo(328, 326, 324, 314, 328, 304); c.bezierCurveTo(332, 288, 324, 266, 332, 246); c.closePath(); },
  hair: (c) => {
    c.moveTo(194, 178); c.bezierCurveTo(212, 130, 262, 98, 322, 98); c.bezierCurveTo(392, 98, 448, 146, 454, 222);
    c.bezierCurveTo(458, 276, 444, 320, 418, 344); c.bezierCurveTo(406, 334, 394, 320, 386, 308); c.bezierCurveTo(378, 290, 372, 262, 360, 244);
    c.bezierCurveTo(346, 230, 320, 234, 306, 252); c.bezierCurveTo(298, 266, 296, 284, 298, 300); c.lineTo(286, 302);
    c.bezierCurveTo(282, 272, 268, 236, 258, 212); c.bezierCurveTo(246, 190, 222, 176, 194, 178); c.closePath(); },
};
// sculpted bumps: [cx, cy, sx, sy, amp] (gaussians) and ridges/grooves along segments: [x0, y0, x1, y1, sigma, amp0, amp1]
const BUMPS = [
  [222, 192, 40, 30, 6], [206, 244, 26, 8, 7], [258, 230, 18, 22, -5],
  [219, 268, 16, 12, -11], [216, 268, 10, 8, 7], [216, 261, 12, 4, 2],
  [248, 298, 26, 18, 8], [264, 340, 26, 20, -4], [198, 310, 9, 8, 8],
  [191, 336, 10, 8, 3], [191, 358, 9, 6, 4], [198, 395, 16, 14, 8], [244, 446, 6, 9, 6],
];
const RIDGES = [[190, 258, 166, 300, 8, 8, 12], [212, 414, 316, 394, 6, 4, 3], [186, 302, 204, 322, 2.4, -3, -3], [204, 322, 207, 350, 3, -3, -2], [190, 350, 205, 352, 1.6, -4, -4]];
const L3 = (() => { const v = [-.66, -.5, .56], l = Math.hypot(...v); return v.map((q) => q / l); })();

function portraitPaint() {
  const w = PB.w, h = PB.h, S = 2, N = w * h;
  // masks at 2×, box-averaged to 1×
  const maskOf = (path) => {
    const [c, x] = canvas(w * S, h * S); x.scale(S, S); x.fillStyle = '#fff'; x.beginPath(); path(x); x.fill();
    const d = x.getImageData(0, 0, w * S, h * S).data, M = new Float32Array(N);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { let s = 0; for (let b = 0; b < S; b++) for (let a = 0; a < S; a++) s += d[((j * S + b) * w * S + i * S + a) * 4 + 3]; M[j * w + i] = s / (S * S * 255); }
    void c; return M;
  };
  const M = {}; for (const k of Object.keys(SIL)) M[k] = maskOf(SIL[k]);
  // layers (painter's order), each with its own smooth height; the top one gives the surface normal
  const Hb = dome(M.body, w, h, 150, 4), Hlap = dome(M.lapel, w, h, 1, 2), Hcol = dome(M.collar, w, h, 1, 2), Hknot = dome(M.knot, w, h, 1, 2);
  const Hneck = dome(M.neck, w, h, 60, 3), Hhead = dome(M.head, w, h, 112, 3), Hear = dome(M.ear, w, h, 1, 2), Hhair = dome(M.hair, w, h, 1, 2);
  const body = new Float32Array(N), neck = new Float32Array(N), head = new Float32Array(N), ear = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    body[i] = .4 * Hb[i] + 9 * Hlap[i] - (M.shirt[i] > .5 ? 4 : 0) + 10 * Hcol[i] + 10 * Hknot[i];
    const xx = i % w; neck[i] = 26 + 54 * smoothstep(280, 370, xx) + .6 * Hneck[i];
    head[i] = 92 + .8 * Hhead[i] + 8 * Hhair[i];
    ear[i] = 160 + 14 * Hear[i];
  }
  // the face's sculpture
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const k = j * w + i; if (M.head[k] < .01 && M.neck[k] < .01) continue; const x = i + .5, y = j + .5; let s = 0;
    for (const [cx, cy, sx, sy, A] of BUMPS) { const dx = (x - cx) / sx, dy = (y - cy) / sy, q = dx * dx + dy * dy; if (q < 9) s += A * Math.exp(-q * .5); }
    for (const [x0, y0, x1, y1, sg, A0, A1] of RIDGES) { const vx = x1 - x0, vy = y1 - y0, L2 = vx * vx + vy * vy, u = clamp(((x - x0) * vx + (y - y0) * vy) / L2), px = x0 + vx * u - x, py = y0 + vy * u - y, q = (px * px + py * py) / (sg * sg); if (q < 9) s += mix(A0, A1, u) * Math.exp(-q * .5); }
    head[k] += s * (1 - Hhair[k] * .8); neck[k] += s;
  }
  // the ear: a hollow inside the rim
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const k = j * w + i; if (M.ear[k] < .01) continue; const dx = (i - 346) / 9, dy = (j - 286) / 17; ear[k] -= 9 * Math.exp(-(dx * dx + dy * dy) * .5); }
  const LH = [blurF(body, w, h, 2), blurF(neck, w, h, 2), blurF(head, w, h, 2), blurF(ear, w, h, 1)];
  const top = new Uint8Array(N), Hc = new Float32Array(N);
  for (let i = 0; i < N; i++) { let t = 255, hh = 0; if (M.body[i] > .5 || M.collar[i] > .5 || M.knot[i] > .5) { t = 0; hh = LH[0][i]; } if (M.neck[i] > .5 && !(M.collar[i] > .5 || M.knot[i] > .5)) { t = 1; hh = LH[1][i]; } if (M.head[i] > .5 || M.hair[i] > .5) { t = 2; hh = LH[2][i]; } if (M.ear[i] > .5) { t = 3; hh = LH[3][i]; } top[i] = t; Hc[i] = hh; }
  // shading: Lambert from the upper left with soft cast shadows (height-field ray march toward the light)
  const shade = new Float32Array(N), lx = L3[0], ly = L3[1], lz = L3[2], lxy = Math.hypot(lx, ly), dx = lx / lxy, dy = ly / lxy, rise = lz / lxy;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const k = j * w + i, t = top[k]; if (t === 255) continue;
    const A = LH[t], at = (ii, jj) => A[Math.min(h - 1, Math.max(0, jj)) * w + Math.min(w - 1, Math.max(0, ii))];
    const gx = (at(i + 1, j) - at(i - 1, j)) / 2, gy = (at(i, j + 1) - at(i, j - 1)) / 2, nl = Math.hypot(gx, gy, 1);
    const ndl = (-gx * lx - gy * ly + lz) / nl;
    let occ = 0; const h0 = Hc[k] + 1.5;
    for (let s = 2; s < 80; s += 2) { const ii = Math.round(i + dx * s), jj = Math.round(j + dy * s); if (ii < 0 || jj < 0 || ii >= w || jj >= h) break; const e = Hc[jj * w + ii] - (h0 + rise * s); if (e > occ) occ = e; }
    shade[k] = Math.max(0, ndl) * clamp(1 - occ / 7);
  }
  // albedo: base per part + painted features (brow, eye, nostril, mouth, hair strands, grey at the temple)
  const [ac, ax] = canvas(w * S, h * S); ax.scale(S, S);
  const grey = (rho) => { const v = Math.round(255 * rho); return `rgb(${v},${v},${v})`; };
  const fillA = (path, rho) => { ax.fillStyle = grey(rho); ax.beginPath(); path(ax); ax.fill(); };
  ax.fillStyle = '#000'; ax.fillRect(0, 0, w, h);
  fillA(SIL.body, .17); fillA(SIL.lapel, .21); fillA(SIL.shirt, .95); fillA(SIL.tie, .13); fillA(SIL.neck, .84); fillA(SIL.collar, .97); fillA(SIL.knot, .14); fillA(SIL.head, .86);
  { ax.save(); ax.beginPath(); SIL.hair(ax); ax.clip(); const hg = ax.createLinearGradient(200, 120, 440, 330); hg.addColorStop(0, grey(.46)); hg.addColorStop(.45, grey(.3)); hg.addColorStop(1, grey(.2)); ax.fillStyle = hg; ax.fillRect(0, 0, w, h);
    const tg = ax.createRadialGradient(290, 262, 4, 290, 262, 40); tg.addColorStop(0, 'rgba(170,170,170,.5)'); tg.addColorStop(1, 'rgba(190,190,190,0)'); ax.fillStyle = tg; ax.fillRect(0, 0, w, h);   // grey at the temple
    const rs = prng(41); ax.lineCap = 'round';   // combed strands, from the hairline back over the crown
    for (let i = 0; i < 90; i++) { const u = rs(), x0 = 200 + u * 90 + rs() * 10, y0 = 178 - u * 60 + rs() * 40, v = rs() < .55 ? 30 : 140; ax.strokeStyle = `rgba(${v},${v},${v},.55)`; ax.lineWidth = 1 + rs() * 1.8; ax.beginPath(); ax.moveTo(x0, y0); ax.bezierCurveTo(x0 + 60 + rs() * 30, y0 - 40 + rs() * 20, x0 + 150 + rs() * 30, y0 - 10 + rs() * 30, x0 + 210 + rs() * 40, y0 + 70 + rs() * 60); ax.stroke(); }
    ax.restore(); }
  fillA(SIL.ear, .8);
  ax.lineCap = 'round'; ax.lineJoin = 'round';
  const poly = (pts, rho) => { ax.fillStyle = grey(rho); ax.beginPath(); ax.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ax.lineTo(pts[i][0], pts[i][1]); ax.closePath(); ax.fill(); };
  const line = (pts, rho, lw) => { ax.strokeStyle = grey(rho); ax.lineWidth = lw; ax.beginPath(); ax.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ax.lineTo(pts[i][0], pts[i][1]); ax.stroke(); };
  { const sg = ax.createRadialGradient(218, 266, 2, 218, 266, 22); sg.addColorStop(0, 'rgba(140,140,140,.6)'); sg.addColorStop(1, 'rgba(140,140,140,0)'); ax.fillStyle = sg; ax.fillRect(190, 240, 60, 52); }   // the socket
  poly([[186, 244], [200, 238], [222, 238], [242, 243], [244, 250], [222, 247], [202, 249], [188, 252]], .15);      // the brow: heavy, low, level
  poly([[203, 270], [210, 262], [222, 261], [231, 267], [224, 274], [211, 275]], .78);                              // the eye (profile almond)
  ax.save(); ax.beginPath(); ax.moveTo(203, 270); ax.lineTo(210, 262); ax.lineTo(222, 261); ax.lineTo(231, 267); ax.lineTo(224, 274); ax.lineTo(211, 275); ax.closePath(); ax.clip();
  ax.fillStyle = grey(.22); ax.beginPath(); ax.ellipse(209, 268, 4.4, 7, 0, 0, TAU); ax.fill(); ax.fillStyle = grey(.05); ax.beginPath(); ax.ellipse(207.6, 268, 2, 5, 0, 0, TAU); ax.fill(); ax.restore();
  line([[202, 270], [210, 261.5], [222, 260.5], [232, 266]], .07, 3.2);                                               // the upper lid
  line([[204, 271], [212, 275.5], [224, 274.5]], .5, 1.3);
  line([[206, 254], [218, 252], [232, 256]], .42, 1.4);                                                               // the lid crease
  ax.fillStyle = grey(.12); ax.beginPath(); ax.ellipse(190, 316, 5, 3, -.25, 0, TAU); ax.fill();                    // the nostril
  line([[186, 300], [196, 304], [204, 314], [200, 322]], .45, 2);                                                     // the nose wing's crease
  line([[189, 350], [197, 351], [205, 353]], .12, 2.6);                                                               // the mouth: closed, straight
  line([[205, 353], [208, 357]], .4, 1.8);                                                                            // its corner turned down
  poly([[180, 340], [186, 335], [190, 342], [189, 349], [181, 346]], .62); poly([[181, 352], [190, 351], [192, 358], [185, 363], [180, 359]], .66);   // lips
  line([[206, 322], [207, 336], [206, 350]], .55, 2);                                                                 // the fold from the nose to the mouth
  line([[184, 232], [188, 226]], .5, 1.5);                                                                            // a line over the brow
  const [ac1, ax1] = canvas(w, h); ax1.filter = 'blur(.6px)'; ax1.drawImage(ac, 0, 0, w, h); ax1.filter = 'none';
  const ad = ax1.getImageData(0, 0, w, h).data; void ac1;
  // tone = ink amount: the ground darker toward the oval's edge and lighter in front of the face (the light's side), the figure by albedo × light
  const T = new Float32Array(N), Hout = new Float32Array(N);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const k = j * w + i, t = top[k];
    if (t === 255) { const rx = (i - 250) / 300, ry = (j - 250) / 360, r = Math.hypot(rx, ry * 1.1); T[k] = clamp(.34 + .46 * smoothstep(.25, 1.05, r) + .06 * (j / h) + .12 * clamp((230 - i) / 160) - .1 * clamp(1 - Math.hypot(i - 450, j - 240) / 160)); Hout[k] = 0; continue; }
    const rho = ad[k * 4] / 255, light = .14 + .86 * shade[k], b = rho * light;
    T[k] = clamp(.1 + .92 * (1 - Math.pow(b, .75) * 1.08)); Hout[k] = Hc[k];
  }
  return { T, H: Hout, w, h };
}
const smoothstep = (a, b, x) => { const q = clamp((x - a) / (b - a)); return q * q * (3 - 2 * q); };
export const portrait = () => onceRaw('c14-portrait', portraitPaint);

// the 100s: a glyph mask per corner (engraved with fine horizontal lines)
const NUMBOX = { w: 300, h: 170 };
function numPaint() {
  const [c, x] = canvas(NUMBOX.w, NUMBOX.h); x.fillStyle = '#fff'; x.font = '178px "Instrument Serif"'; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
  x.fillText('100', NUMBOX.w / 2, NUMBOX.h / 2 + 62);
  const d = x.getImageData(0, 0, NUMBOX.w, NUMBOX.h).data, M = new Float32Array(NUMBOX.w * NUMBOX.h); for (let i = 0; i < M.length; i++) M[i] = d[i * 4 + 3] / 255;
  void c; return M;
}
const numMask = () => onceRaw('c14-num', numPaint);

// ---------------------------------------------------------------- the engraver (per pixel, note space)
// family coordinates at note point (x, y) with relief height hh: phi (across the lines, px), psi (along, px)
const famPhi = (f, x, y, hh) => -Math.sin(f.ang) * x + Math.cos(f.ang) * y - f.kap * hh;
const famPsi = (f, x, y) => Math.cos(f.ang) * x + Math.sin(f.ang) * y;
// writes ink (G1, coverage as alpha) for one box into an RGBA buffer of the box size. dash: null = solid lines, or { P: dot pitch,
// k: 0 → 1 the dot mask closes from the full line to dots of .85 of the line's half width }
function engraveBox(out, b, dash) {
  const { w: bw, h: bh, x0, y0, fams } = b, P = dash ? dash.P : 0, Rk = dash ? dash.k : 0;
  for (let j = 0; j < bh; j++) {
    for (let i = 0; i < bw; i++) {
      const idx = j * bw + i; if (!b.inside(idx)) continue;
      const T = b.tone[idx]; if (T < .015) continue;
      const [c1, c2] = split(T), x = x0 + i + .5, y = y0 + j + .5, hh = b.H ? b.H[idx] : 0;
      let cov = 0;
      for (let q = 0; q < 2; q++) {
        const f = fams[q], cq = q ? c2 : c1; if (!f || cq <= .004) continue;
        const phi = famPhi(f, x, y, hh), k = Math.round(phi / f.P), d = Math.abs(phi - k * f.P), hw = cq * f.P / 2;
        let c = band(d, hw); if (c <= 0) continue;
        if (dash) { const sh = (k & 7) * P * .37, psi = famPsi(f, x, y) + sh, jj = Math.round(psi / P), dp = Math.abs(psi - jj * P), R = Math.max(.35, mix(P * .9, hw * .85, Rk)); c *= clamp(R + .5 - Math.hypot(dp, d)); }
        cov = 1 - (1 - cov) * (1 - c);
      }
      if (cov > 0) { const o = idx * 4; out[o] = G1RGB[0]; out[o + 1] = G1RGB[1]; out[o + 2] = G1RGB[2]; out[o + 3] = Math.round(255 * Math.min(1, cov)); }
    }
  }
}
// the boxes of the ink layer: the portrait (inside the oval) and the four numerals
function inkBoxes() {
  const Pt = portrait(), M = numMask(), boxes = [];
  const a2 = 1 / (OV.a * OV.a), b2 = 1 / (OV.b * OV.b), inO = new Uint8Array(PB.w * PB.h);
  for (let j = 0; j < PB.h; j++) for (let i = 0; i < PB.w; i++) { const x = i + .5 - OV.a, y = j + .5 - OV.b; inO[j * PB.w + i] = x * x * a2 + y * y * b2 <= 1 ? 1 : 0; }
  boxes.push({ x0: PB.x0, y0: PB.y0, w: PB.w, h: PB.h, tone: Pt.T, H: Pt.H, fams: FAMS, inside: (i) => inO[i] === 1 });
  const nt = M.map((v) => v * .86);
  for (const [cx, cy] of CORNERS) boxes.push({ x0: Math.round(cx - NUMBOX.w / 2), y0: Math.round(cy - NUMBOX.h / 2), w: NUMBOX.w, h: NUMBOX.h, tone: nt, H: null, fams: [FNUM, null], inside: (i) => M[i] > .02 });
  return boxes;
}
export const BOXES = () => onceRaw('c14-inkboxes', inkBoxes);
// static ink (cached Image)
export function inkStatic() {
  return once('c14-ink-static', () => {
    const [c, g] = canvas(NW, NH);
    for (const b of BOXES()) { const im = g.createImageData(b.w, b.h); engraveBox(im.data, b, null); g.putImageData(im, b.x0, b.y0); }
    return c;
  });
}
