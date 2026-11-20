// "If you could have an independent tester check one thing first, what would it be? Let me know in the comments."
// Full morning now: wide warm hills, mist in the valleys, the road winding away with the little car on it.
// The question writes itself in, line by line, on the left; "Let me know in the comments" follows underneath.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, out, ease } = L;
const { gf, curve, glowE, mix } = require('./s_k11_poll');

const T0 = 714.65, T1 = 721.85;
const SUN = [1450, 300];
const LINES = [{ t: 715.22, s: 'If you could have an independent tester' }, { t: 717.08, s: 'check one thing first,' }, { t: 718.68, s: 'what would it be?' }];
const T_ASK = 720.0;

const ROAD = [[1180, 1180, 160], [1120, 1000, 110], [1010, 880, 70], [1100, 800, 46], [1260, 740, 30], [1200, 690, 20], [1080, 650, 13], [1160, 615, 8], [1290, 590, 5]];
const HILLS = [
  { pts: [[-200, 560], [200, 520], [520, 548], [860, 500], [1200, 530], [1500, 490], [1800, 520], [2200, 500]], c0: '#c08a8a', c1: '#8a5a7a', g: 0.35, par: 0.2 },
  { pts: [[-200, 640], [260, 600], [600, 650], [900, 610], [1240, 640], [1600, 600], [2200, 630]], c0: '#a8687a', c1: '#5a3a64', g: 0.4, par: 0.3 },
  { pts: [[-200, 760], [300, 700], [700, 740], [1000, 690], [1400, 720], [1800, 680], [2200, 720]], c0: '#7a4a6a', c1: '#3a2850', g: 0.45, par: 0.45 },
  { pts: [[-200, 900], [240, 820], [620, 860], [940, 800], [1300, 840], [1700, 790], [2200, 830]], c0: '#4a2e56', c1: '#1e1838', g: 0.5, par: 0.7 },
];
let BG = null;
function buildBG() {
  const cv = L.createCanvas(W + 400, H + 400), ctx = cv.getContext('2d'); ctx.translate(200, 200); ctx.offscreen = true;
  ctx.fillStyle = lin(ctx, 0, -200, 0, 620, [[0, '#3a3a78'], [0.45, '#8a6a9a'], [0.8, '#e8a888'], [1, '#ffd0a0']]); ctx.fillRect(-200, -200, W + 400, 900);
  // keep the upper left calmer and deeper so the question reads
  glowE(ctx, 300, 120, 1100, 520, [[0, 'rgba(40,30,80,0.55)'], [1, 'rgba(40,30,80,0)']]);
  return cv;
}
const BIRDS = (() => { const r = rng(716); return Array.from({ length: 7 }, () => ({ x: 900 + r() * 700, y: 200 + r() * 160, ph: r() * 6, sp: 14 + r() * 10 })); })();
const HILLC = [];

function draw(ctx, t) {
  const z = lerp(1.0, 1.06, sm((t - T0) / (T1 - T0)));
  const dx0 = drift(t, 1, 91) * 7, dy0 = drift(t, 1, 92) * 4;
  const layer = (par, fn) => { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 + dx0 * par, -H / 2 + dy0 * par); fn(); ctx.restore(); };
  if (!BG) {
    BG = buildBG();
    for (const h of HILLS) { const cv = L.createCanvas(W + 400, H + 400), c2 = cv.getContext('2d'); c2.translate(200, 200); c2.offscreen = true;
      gf(c2, c => { curve(c, h.pts); c.lineTo(2200, 1400); c.lineTo(-200, 1400); c.closePath(); }, lin(c2, 0, Math.min(...h.pts.map(p => p[1])) - 20, 0, 1100, [[0, h.c0], [0.5, h.c1], [1, '#140e28']]), h.g);
      c2.save(); c2.beginPath(); curve(c2, h.pts); c2.strokeStyle = rgba('#ffd9a8', 0.35); c2.lineWidth = 2.5; c2.stroke(); c2.restore();
      if (h === HILLS[2]) gf(c2, c => { const p = ROAD.slice(2); const Lf = p.map(q => [q[0] - q[2] / 2, q[1]]), Rt = p.map(q => [q[0] + q[2] / 2, q[1]]); curve(c, Lf); curve(c, Rt.reverse(), false); c.closePath(); }, lin(c2, 0, 590, 0, 900, [[0, '#ffd9a8'], [1, '#b88080']]), 0.35);
      HILLC.push(cv); }
  }
  layer(0.1, () => {
    ctx.drawImage(BG, -200, -200);
    // the sun: high enough now, its glow the brightest thing
    light(ctx, SUN[0], SUN[1], 700, '#ffd9a0', 0.45);
    light(ctx, SUN[0], SUN[1], 160, '#fff4dc', 0.8);
    ctx.fillStyle = '#fff6e0'; ctx.beginPath(); ctx.arc(SUN[0], SUN[1], 52, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#3a2440'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    for (const b of BIRDS) { const x = b.x + (t - T0) * b.sp, y = b.y + Math.sin(t + b.ph) * 6, f = Math.sin(t * 6 + b.ph) * 5; ctx.beginPath(); ctx.moveTo(x - 9, y - f); ctx.quadraticCurveTo(x - 4, y - 3, x, y); ctx.quadraticCurveTo(x + 4, y - 3, x + 9, y - f); ctx.stroke(); }
  });
  HILLS.forEach((h, i) => layer(h.par, () => {
    ctx.drawImage(HILLC[i], -200, -200);
    // mist lying in the valley in front of each range, drifting
    for (let k = 0; k < 4; k++) { const x = ((k * 600 + (t - T0) * (10 + i * 4) + i * 230) % 2600) - 340, y = Math.min(...h.pts.map(p => p[1])) + 70 + i * 6;
      glowE(ctx, x, y, 520, 40, [[0, rgba('#ffe6d0', 0.16 - i * 0.02)], [1, 'rgba(255,230,208,0)']]); }
    if (i === 2) {
      // the little car, far off now, climbing toward the light
      const u = clamp((t - T0) / (T1 - T0)), p = ROAD.slice(2), k = 0.25 + 0.5 * u, idx = Math.floor(k * (p.length - 1)), f = k * (p.length - 1) - idx;
      const x = lerp(p[idx][0], p[idx + 1][0], f), y = lerp(p[idx][1], p[idx + 1][1], f), s = lerp(p[idx][2], p[idx + 1][2], f) / 22;
      ctx.fillStyle = '#2a1e40'; ctx.beginPath(); ctx.ellipse(x, y - 3 * s, 9 * s, 5 * s, 0, 0, Math.PI * 2); ctx.fill();
      light(ctx, x, y - 3 * s, 30 * s, '#ffe6c0', 0.5);
    }
  }));
  // the question card: Instrument Serif, written in line by line; the call to comment beneath in Inter
  ctx.save();
  const x0 = 110, y0 = 150;
  ctx.textBaseline = 'top'; ctx.shadowColor = 'rgba(30,16,50,0.7)'; ctx.shadowBlur = 30;
  const fadeOut = 1 - ramp(t, T1 - 0.45, T1);
  LINES.forEach((ln, i) => {
    const a = ramp(t, ln.t, ln.t + 0.6) * fadeOut; if (a <= 0) return;
    const rise = (1 - out((t - ln.t) / 0.9)) * 16;
    ctx.globalAlpha = a; ctx.fillStyle = C.cream; ctx.font = `${i === 2 ? 92 : 72}px "Instrument Serif"`;
    ctx.fillText(ln.s, x0, y0 + [0, 86, 178][i] + rise);
  });
  const a = ramp(t, T_ASK, T_ASK + 0.6) * fadeOut;
  if (a > 0) {
    const w = out((t - T_ASK) / 0.8);
    ctx.globalAlpha = a; ctx.strokeStyle = C.amber; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 + 2, y0 + 316); ctx.lineTo(x0 + 2 + 56 * w, y0 + 316); ctx.stroke();
    ctx.fillStyle = '#fff4e4'; ctx.font = '26px "Inter Medium"'; ctx.letterSpacing = '6px'; ctx.fillText('LET ME KNOW IN THE COMMENTS', x0 + 4, y0 + 334);
  }
  ctx.restore();
}

module.exports = { T0, T1, draw };
