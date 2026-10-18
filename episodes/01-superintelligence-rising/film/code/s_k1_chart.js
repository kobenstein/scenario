// "In 2019, that was a few seconds. Last year, around two hours. This spring, at least sixteen hours.
//  That's as far as their tests go."
// An amber ruler of a skilled person's hours (0 to 16 h). Three cyan bars rise on their words: 2019 a sliver,
// 2025 two hours, 2026 shoots to the top of the ruler, which simply ends. The bar keeps glowing past the end.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, label, out } = L;

const T0 = 95.4, T1 = 107.3;

let PAT = null;
function grainFill(ctx, pathFn, fill, grain = 0.5, box = null) {
  ctx.save(); ctx.beginPath(); pathFn(ctx); ctx.fillStyle = fill; ctx.fill();
  if (grain > 0) {
    if (!PAT) PAT = ctx.createPattern(L.tex().dark, 'repeat');
    ctx.clip(); ctx.globalAlpha = grain; ctx.fillStyle = PAT;
    if (box) ctx.fillRect(box[0], box[1], box[2], box[3]); else ctx.fillRect(-300, -300, W + 600, H + 600);
  }
  ctx.restore();
}
const CACHE = {};
function cached(ctx, key, x0, y0, x1, y1, fn) {
  if (!CACHE[key]) { const cv = L.createCanvas(x1 - x0, y1 - y0), c = cv.getContext('2d'); c.translate(-x0, -y0); fn(c); CACHE[key] = cv; }
  ctx.drawImage(CACHE[key], x0, y0);
}
function roundTop(c, x, y, w, h, r) { r = Math.min(r, h, w / 2); c.moveTo(x, y + h); c.lineTo(x, y + r); c.arcTo(x, y, x + r, y, r); c.lineTo(x + w - r, y); c.arcTo(x + w, y, x + w, y + r, r); c.lineTo(x + w, y + h); c.closePath(); }

const RX = 440, Y0 = 830, YT = 215, MAXH = 16, PXH = (Y0 - YT) / MAXH;
const BW = 200;
const BARS = [
  { x: 780, year: '2019', yt: 96.0, g0: 97.5, g1: 97.95, h: 0.0012, val: 'a few seconds', vt: 97.76 },
  { x: 1150, year: '2025', yt: 98.8, g0: 99.6, g1: 100.25, h: 2, val: '~2 h', vt: 100.0 },
  { x: 1520, year: '2026', yt: 101.28, g0: 101.75, g1: 103.45, h: 16, val: '16 h+', vt: 103.4 },
];
const R = rng(61);
const MOTES = Array.from({ length: 80 }, () => [R(), R(), R()]);

function barH(b, t) {
  const k = clamp((t - b.g0) / (b.g1 - b.g0)); if (k <= 0) return 0;
  // the last bar accelerates (it is the jump), the others ease in with a small overshoot
  const e = b.h === 16 ? Math.pow(k, 2.2) : out(k) + 0.06 * Math.sin(k * Math.PI) * (1 - k);
  return Math.max(4, b.h * PXH * e);
}

function draw(ctx, t) {
  const rise = sm((t - 102.4) / 1.4) * 30 - sm((t - 104.6) / 2.2) * 12;   // camera lifts a little as the big bar climbs
  const z = lerp(1.03, 1.0, L.ease((t - T0) / 2)) * lerp(1, 1.035, sm((t - 98) / 9));
  const dx = drift(t, 1, 23) * 5, dy = drift(t, 1, 29) * 3.5;
  const layer = (par, fn) => { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 + dx * par, -H / 2 + dy * par + rise * par); fn(); ctx.restore(); };
  const top = BARS[2], hTop = barH(top, t), reached = ramp(t, 103.3, 103.6), edge = ramp(t, 104.4, 105.0);
  const breathe = 0.92 + 0.08 * Math.sin(t * 1.4);

  layer(0.3, () => {
    cached(ctx, 'bg', -100, -150, W + 100, H + 150, c => {
      grainFill(c, cc => cc.rect(-100, -150, W + 200, H + 300), lin(c, 0, -150, 0, H + 150, [[0, '#0a0c26'], [0.55, '#151640'], [1, '#0a0a1e']]), 0.55);
    });
    light(ctx, top.x, YT + 120, 900, C.cyan, (0.05 + 0.12 * reached) * breathe);
  });
  layer(0.55, () => {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const [a, b, c] of MOTES) { const x = a * W + Math.sin(t * 0.4 + c * 9) * 18, y = ((b * H - t * (6 + c * 10)) % H + H) % H; const near = Math.max(0, 1 - Math.abs(x - top.x) / 600); ctx.fillStyle = rgba(C.cyan, (0.08 + 0.2 * near * reached) * (0.5 + 0.5 * Math.sin(t * 1.3 + a * 20))); ctx.beginPath(); ctx.arc(x, y, 1.2 + c * 1.6, 0, 7); ctx.fill(); }
    ctx.restore();
  });
  layer(1.0, () => {
    const ra = ramp(t, T0, T0 + 0.6);
    ctx.save(); ctx.globalAlpha = ra;
    // grid lines every 2 hours
    for (let h = 2; h <= MAXH; h += 2) { const y = Y0 - h * PXH; ctx.fillStyle = rgba(C.lav, h === MAXH ? 0 : 0.07); ctx.fillRect(RX + 10, y, 1300, 1.5); }
    // floor line
    ctx.fillStyle = rgba(C.lav, 0.4); ctx.fillRect(RX, Y0, 1340, 2);
    // the amber ruler: a skilled person's hours
    grainFill(ctx, c => c.rect(RX - 10, YT, 20, Y0 - YT), lin(ctx, 0, YT, 0, Y0, [[0, C.amber], [1, C.amberD]]), 0.4, [RX - 12, YT, 24, Y0 - YT]);
    ctx.font = '22px "Inter Medium"'; ctx.letterSpacing = '2px'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    for (let h = 0; h <= MAXH; h += 1) {
      const y = Y0 - h * PXH, major = h % 4 === 0 || h === 2;
      ctx.fillStyle = rgba(C.amber, major ? 0.9 : 0.5); ctx.fillRect(RX - 10 - (major ? 22 : 12), y - 1, major ? 22 : 12, 2);
      if (major) { ctx.fillStyle = rgba(C.cream, 0.85); ctx.fillText(h === 0 ? '0' : h + ' h', RX - 44, y); }
    }
    // axis title, along the ruler
    ctx.save(); ctx.translate(RX - 150, (Y0 + YT) / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = 'center'; ctx.fillStyle = C.amber; ctx.font = '20px "Inter Medium"'; ctx.letterSpacing = '5px';
    ctx.fillText("A SKILLED PERSON'S HOURS", 0, 0); ctx.restore();
    ctx.restore();

    // the end of the scale: the ruler stops here
    {
      const capA = ra * (0.6 + 0.4 * edge);
      ctx.save(); ctx.globalAlpha = capA;
      ctx.strokeStyle = rgba(edge > 0 ? '#ffe2b8' : C.amber, 0.85); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(RX - 34, YT); ctx.lineTo(RX + 14, YT); ctx.stroke();
      ctx.setLineDash([10, 10]); ctx.lineDashOffset = -t * 12; ctx.strokeStyle = rgba(C.cream, 0.25 + 0.45 * edge); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(RX + 14, YT); ctx.lineTo(RX + 1330, YT); ctx.stroke(); ctx.setLineDash([]);
      if (edge > 0) {
        ctx.globalAlpha = edge; ctx.font = '20px "Inter Medium"'; ctx.letterSpacing = '5px'; ctx.fillStyle = C.cream; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
        ctx.fillText('END OF THE TEST SCALE', RX + 30, YT - 18 - (1 - out(edge)) * 8);
      }
      ctx.restore();
      if (edge > 0) light(ctx, RX, YT, 80, C.amber, 0.5 * edge * Math.exp(-Math.max(0, t - 104.8) * 1.5) + 0.12 * edge);
    }

    // bars
    BARS.forEach((b, i) => {
      const ya = ramp(t, b.yt, b.yt + 0.5); if (ya <= 0) return;
      const hb = barH(b, t), hero = i === 2;
      ctx.save(); ctx.globalAlpha = ya;
      // year under the bar
      ctx.font = '56px "Instrument Serif"'; ctx.fillStyle = hero ? C.cream : rgba(C.cream, 0.85); ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(b.year, b.x, Y0 + 14 + (1 - out(ya)) * 10);
      // base plate
      ctx.fillStyle = rgba(C.cyan, 0.25); ctx.fillRect(b.x - BW / 2, Y0 - 2, BW, 4);
      ctx.restore();
      if (hb > 0) {
        const y = Y0 - hb;
        grainFill(ctx, c => roundTop(c, b.x - BW / 2, y, BW, hb, 10), lin(ctx, 0, y, 0, Y0, [[0, C.cyanW], [Math.min(0.25, 40 / hb), C.cyan], [1, C.cyanD]]), 0.4, [b.x - BW / 2, y, BW, hb]);
        ctx.fillStyle = rgba(C.cyanW, 0.9); ctx.fillRect(b.x - BW / 2 + 6, y, BW - 12, Math.min(3, hb));
        const pop = Math.exp(-Math.max(0, t - b.g1) * 3) * (t > b.g1 - 0.05 ? 1 : 0);
        light(ctx, b.x, y, hero ? 260 : 150, C.cyan, (hero ? 0.35 + 0.2 * reached : 0.22) * breathe + 0.4 * pop);
      }
      // the value, on its word
      const va = ramp(t, b.vt - 0.05, b.vt + 0.35);
      if (va > 0) {
        ctx.save(); ctx.globalAlpha = va; ctx.shadowColor = 'rgba(4,4,16,0.8)'; ctx.shadowBlur = 18;
        ctx.fillStyle = C.cream; ctx.font = (hero ? 96 : 64) + 'px "Instrument Serif"'; ctx.textBaseline = 'alphabetic';
        const up = (1 - out(va)) * 14;
        if (hero) { ctx.textAlign = 'left'; ctx.fillText(b.val, b.x + BW / 2 + 28, YT + 92 + up); ctx.font = '22px "Inter Medium"'; ctx.letterSpacing = '5px'; ctx.fillStyle = C.lav; ctx.fillText('AT LEAST', b.x + BW / 2 + 32, YT + 128 + up); }
        else { ctx.textAlign = 'center'; ctx.fillText(b.val, b.x, Y0 - hb - 26 + up); }
        ctx.restore();
      }
    });

    // past the end: the bar's light keeps going up beyond what the tests can measure
    if (hTop >= (MAXH * PXH) - 1) {
      const k = ramp(t, 103.45, 105.6), w = BW - 24;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const len = 120 + 300 * out(k);
      ctx.fillStyle = lin(ctx, 0, YT, 0, YT - len, [[0, rgba(C.cyanW, 0.5 * breathe)], [0.35, rgba(C.cyan, 0.2 * breathe)], [1, rgba(C.cyan, 0)]]);
      ctx.beginPath(); ctx.moveTo(top.x - w / 2, YT); ctx.lineTo(top.x + w / 2, YT); ctx.lineTo(top.x + w * 0.22, YT - len); ctx.lineTo(top.x - w * 0.22, YT - len); ctx.closePath(); ctx.fill();
      ctx.restore();
      for (let j = 1; j <= 4; j++) light(ctx, top.x, YT - j * len * 0.22, 150 - j * 14, C.cyan, 0.16 * (1 - j / 5) * breathe * (0.85 + 0.15 * Math.sin(t * 2 + j)));
      ctx.save();
      ctx.restore();
      // a flare where the bar meets the end of the scale
      const hit = Math.exp(-Math.max(0, t - 103.45) * 2.2);
      light(ctx, top.x, YT, 200 + 160 * hit, C.cyanW, (0.25 + 0.55 * hit) * breathe);
    }
  });
  label(ctx, t, 95.6, T1 + 1, 'METR', 'longest task AI finishes half the time', 96, 40, { color: C.cyan });
}

module.exports = { T0, T1, draw };
