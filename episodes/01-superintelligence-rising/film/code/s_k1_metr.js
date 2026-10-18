// "METR, an independent lab, measures how long a task an AI can finish about half the time.
//  Long as in, how long it would take a skilled person."
// Beat 1: a cyan AI agent at a screen runs the same task again and again; a row of ten attempts fills in,
// five come back finished: about half the time. Beat 2: the camera pans left to a skilled person doing the
// same task at a desk, a wall clock racing and an amber bar measuring their hours.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, cone, label, out } = L;
const { figure, roundRect } = require('./s_timeline');

const T0 = 84.5, T1 = 95.7;

let PAT = null;
function grainFill(ctx, pathFn, fill, grain = 0.5, box = null) {
  ctx.save(); ctx.beginPath(); pathFn(ctx); ctx.fillStyle = fill; ctx.fill();
  if (grain > 0) {
    if (!PAT) PAT = ctx.createPattern(L.tex().dark, 'repeat');
    ctx.clip(); ctx.globalAlpha = grain; ctx.fillStyle = PAT;
    if (box) ctx.fillRect(box[0], box[1], box[2], box[3]); else ctx.fillRect(-3000, -300, W + 6000, H + 600);
  }
  ctx.restore();
}
const CACHE = {};
function cached(ctx, key, x0, y0, x1, y1, fn) {
  if (!CACHE[key]) { const cv = L.createCanvas(x1 - x0, y1 - y0), c = cv.getContext('2d'); c.translate(-x0, -y0); fn(c); CACHE[key] = cv; }
  ctx.drawImage(CACHE[key], x0, y0);
}

const PAN0 = 91.45, PAN1 = 92.75, PANX = 1700;
const AI = { x: 1000, mon: [790, 400, 420, 270] };
const HU = { x: AI.x - PANX, mon: [AI.mon[0] - PANX, 400, 420, 270] };
const CLK = [HU.x - 520, 380, 140];
const BAR = { x0: HU.x + 300, x1: HU.x + 800, y: 300 };
const ATT = [1, 0, 1, 1, 0, 0, 1, 0, 1, 0];
const AT0 = 87.5, ADT = 0.27;                  // attempt k starts at AT0 + k*ADT
const HALF = 90.4;
const R = rng(88);
const MOTES = Array.from({ length: 70 }, () => [R(), R(), R()]);
const DOC = Array.from({ length: 9 }, () => 0.35 + R() * 0.6);

// the task, as a page on a screen: same page on both screens
function screen(ctx, m, t, col, prog, verdict) {
  const [x, y, w, h] = m;
  ctx.fillStyle = '#05060f'; ctx.beginPath(); roundRect(ctx, x - 12, y - 12, w + 24, h + 24, 10); ctx.fill();
  ctx.fillRect(x + w / 2 - 14, y + h + 10, 28, 60);
  grainFill(ctx, c => roundRect(c, x, y, w, h, 4), lin(ctx, x, y, x + w * 0.5, y + h, col === C.cyan ? [[0, '#1a86a8'], [0.6, '#0e5878'], [1, '#08344e']] : [[0, '#5a4a8a'], [0.6, '#2c2458'], [1, '#14123a']]), 0.3, [x, y, w, h]);
  // the task page
  const px = x + w / 2 - 110, py = y + 22;
  grainFill(ctx, c => c.rect(px, py, 220, h - 44), lin(ctx, 0, py, 0, py + h, [[0, '#f3efe2'], [1, '#c8c0aa']]), 0.25, [px, py, 220, h]);
  ctx.fillStyle = 'rgba(40,36,70,0.85)'; ctx.font = '16px "Inter SemiBold"'; ctx.letterSpacing = '3px'; ctx.textBaseline = 'top'; ctx.fillText('TASK', px + 16, py + 14);
  DOC.forEach((l, k) => { ctx.fillStyle = 'rgba(40,36,70,0.5)'; ctx.fillRect(px + 16, py + 46 + k * 18, 188 * l, 4); });
  // progress through the task
  if (prog > 0) {
    ctx.fillStyle = rgba(col, 0.25); ctx.fillRect(px, py + h - 52, 220, 8);
    ctx.fillStyle = col; ctx.fillRect(px, py + h - 52, 220 * prog, 8);
    if (verdict !== undefined) { ctx.fillStyle = rgba(px ? col : col, 0.15 * prog); ctx.fillRect(px, py, 220 * prog, h - 44); }
  }
  light(ctx, x + w / 2, y + h / 2, 420, col, 0.2);
}

function token(ctx, x, y, t, k) {
  const ts = AT0 + k * ADT, r = ramp(t, ts + 0.12, ts + 0.3); const ok = ATT[k];
  const half = ok ? Math.exp(-Math.max(0, t - HALF) * 1.2) * (t > HALF ? 1 : 0) : 0;
  ctx.save();
  ctx.strokeStyle = rgba(C.lav, 0.45); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 22, 0, 7); ctx.stroke();
  if (r > 0) {
    const s = 0.6 + 0.4 * out(r) + 0.25 * Math.sin(Math.PI * clamp((t - ts - 0.2) / 0.3)) + 0.15 * half;
    ctx.translate(x, y); ctx.scale(s, s);
    if (ok) {
      grainFill(ctx, c => c.arc(0, 0, 22, 0, 7), rad(ctx, -6, -6, 2, 24, [[0, C.cyanW], [0.6, C.cyan], [1, C.cyanD]]), 0.3, [-24, -24, 48, 48]);
      ctx.strokeStyle = '#06283a'; ctx.lineWidth = 4.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(-9, 0); ctx.lineTo(-3, 7); ctx.lineTo(10, -8); ctx.stroke();
    } else {
      ctx.globalAlpha = 0.8; ctx.fillStyle = '#1c1a40'; ctx.beginPath(); ctx.arc(0, 0, 21, 0, 7); ctx.fill();
      ctx.strokeStyle = rgba(C.lav, 0.7); ctx.lineWidth = 3.5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-7, -7); ctx.lineTo(7, 7); ctx.moveTo(7, -7); ctx.lineTo(-7, 7); ctx.stroke();
    }
  }
  ctx.restore();
  if (r > 0 && ok) light(ctx, x, y, 60 + 40 * half, C.cyan, 0.25 + 0.5 * half);
}

function desk(ctx, cx, y) {
  grainFill(ctx, c => { c.moveTo(cx - 520, y); c.lineTo(cx + 520, y); c.lineTo(cx + 600, y + 60); c.lineTo(cx - 600, y + 60); c.closePath(); }, lin(ctx, 0, y, 0, y + 60, [[0, '#2e2864'], [1, '#1a1640']]), 0.5, [cx - 620, y, 1240, 70]);
  grainFill(ctx, c => c.rect(cx - 600, y + 60, 1200, 400), lin(ctx, 0, y + 60, 0, y + 400, [[0, '#15123a'], [1, '#08081a']]), 0.6, [cx - 620, y + 60, 1240, 420]);
}

function clock(ctx, t) {
  const [x, y, r] = CLK, run = ramp(t, 92.2, 92.8), hrs = Math.max(0, t - 92.4) * 1.6 * run;
  const face = c => c.arc(x, y, r, 0, 7);
  ctx.fillStyle = '#06060f'; ctx.beginPath(); ctx.arc(x, y, r + 14, 0, 7); ctx.fill();
  grainFill(ctx, face, rad(ctx, x - 30, y - 40, 10, r, [[0, '#f6ead0'], [1, '#bfa884']]), 0.3, [x - r, y - r, 2 * r, 2 * r]);
  ctx.strokeStyle = 'rgba(40,24,30,0.75)'; ctx.lineCap = 'round';
  for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; ctx.lineWidth = k % 3 ? 3 : 6; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8); ctx.lineTo(x + Math.cos(a) * r * 0.92, y + Math.sin(a) * r * 0.92); ctx.stroke(); }
  const hA = (9 + hrs) / 12 * Math.PI * 2 - Math.PI / 2, mA = hrs * Math.PI * 2 - Math.PI / 2 + t * 0.05;
  // motion blur trail on the minute hand while it races
  if (run > 0) { ctx.save(); ctx.globalAlpha = 0.18 * run; ctx.fillStyle = '#7a3b17'; ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r * 0.78, mA - 1.2, mA); ctx.closePath(); ctx.fill(); ctx.restore(); }
  ctx.strokeStyle = '#2a1410'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(hA) * r * 0.5, y + Math.sin(hA) * r * 0.5); ctx.stroke();
  ctx.strokeStyle = '#c9702e'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(mA) * r * 0.78, y + Math.sin(mA) * r * 0.78); ctx.stroke();
  ctx.fillStyle = '#2a1410'; ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.fill();
  return hrs;
}

function hoursBar(ctx, t, hrs) {
  const a = ramp(t, 92.0, 92.6); if (a <= 0) return;
  const { x0, x1, y } = BAR, MAXH = 8, f = clamp(hrs / MAXH);
  ctx.save(); ctx.globalAlpha = a;
  ctx.font = '20px "Inter Medium"'; ctx.letterSpacing = '5px'; ctx.fillStyle = C.lav; ctx.textBaseline = 'alphabetic';
  ctx.fillText("A SKILLED PERSON'S TIME", x0, y - 34);
  grainFill(ctx, c => roundRect(c, x0, y - 14, x1 - x0, 28, 14), '#14123a', 0.4, [x0, y - 20, x1 - x0, 40]);
  if (f > 0) grainFill(ctx, c => roundRect(c, x0, y - 14, Math.max(28, (x1 - x0) * f), 28, 14), lin(ctx, x0, 0, x1, 0, [[0, C.amberD], [0.7, C.amber], [1, '#ffe2b8']]), 0.35, [x0, y - 20, x1 - x0, 40]);
  ctx.font = '18px "Inter Medium"'; ctx.letterSpacing = '2px'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  for (let h = 0; h <= MAXH; h += 2) { const x = lerp(x0, x1, h / MAXH); ctx.fillStyle = rgba(C.cream, 0.6); ctx.fillRect(x - 1, y + 18, 2, 10); ctx.fillText(h + ' h', x, y + 34); }
  ctx.restore();
  if (f > 0) light(ctx, x0 + (x1 - x0) * f, y, 90, C.amber, 0.45 * a);
}

// a chair back in front of a seated figure seen from behind: covers the lower back
function chair(ctx, x, hip, s, col) {
  const w = 52 * s, top = hip - 62 * s, bot = hip + 120 * s;
  const p = c => { c.moveTo(x - w, bot); c.lineTo(x - w * 1.02, top + 18 * s); c.quadraticCurveTo(x - w, top, x - w * 0.8, top - 2 * s); c.quadraticCurveTo(x, top - 10 * s, x + w * 0.8, top - 2 * s); c.quadraticCurveTo(x + w, top, x + w * 1.02, top + 18 * s); c.lineTo(x + w, bot); c.closePath(); };
  ctx.save(); ctx.translate(0, -3); grainFill(ctx, p, rgba(col, 0.35), 0); ctx.restore();
  grainFill(ctx, p, lin(ctx, x - w, top, x + w, bot, [[0, '#2a2458'], [1, '#0a0a1c']]), 0.55, [x - w - 10, top - 20, 2 * w + 20, bot - top + 30]);
}

function draw(ctx, t) {
  const pan = L.ease((t - PAN0) / (PAN1 - PAN0)) * PANX;
  const z = lerp(1.0, 1.05, sm((t - T0) / (T1 - T0)));
  const dx = drift(t, 1, 17) * 6, dy = drift(t, 1, 19) * 4;
  const layer = (par, fn) => { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 + dx * par + pan * par, -H / 2 + dy * par); fn(); ctx.restore(); };
  const flick = 0.92 + 0.08 * Math.sin(t * 9) * Math.sin(t * 2.3);
  layer(0.35, () => {
    cached(ctx, 'bg', -1400, -100, W + 300, H + 100, c => {
      grainFill(c, cc => cc.rect(-1400, -100, W + 1700, H + 200), lin(c, 0, 0, 0, H, [[0, '#0b0d28'], [0.6, '#17163c'], [1, '#0b0a1e']]), 0.55, [-1400, -100, W + 1700, H + 200]);
      c.fillStyle = 'rgba(4,4,16,0.22)'; for (let x = -1300; x < W + 300; x += 340) c.fillRect(x, -100, 3, H + 200);
    });
    light(ctx, 1000, 520, 800, C.cyan, 0.08);
    light(ctx, 1000 - PANX * 0.35, 520, 800, C.amber, 0.08);
  });
  layer(0.6, () => {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const [a, b, c] of MOTES) { const x = -1200 + a * (W + 1400) + Math.sin(t * 0.3 + c * 7) * 20, y = (b * H - t * (5 + c * 6) + 2 * H) % H; ctx.fillStyle = rgba(x > 0 ? C.cyan : '#ffd9a0', 0.16 * (0.5 + 0.5 * Math.sin(t * 1.3 + a * 20))); ctx.beginPath(); ctx.arc(x, y, 1.2 + c * 1.5, 0, 7); ctx.fill(); }
    ctx.restore();
  });
  layer(1.0, () => {
    // ---- the AI side
    {
      const cur = Math.floor((t - AT0) / ADT), ph = ((t - AT0) / ADT) % 1;
      const prog = t < AT0 ? clamp((t - 85.6) / 1.6) * 0.6 : cur < 10 ? (ATT[clamp(cur, 0, 9)] ? out(ph) : Math.min(out(ph), 0.45 + 0.1 * ((cur * 7) % 3))) : 0.35 * (0.5 + 0.5 * Math.sin(t * 3));
      screen(ctx, AI.mon, t, C.cyan, prog * flick);
      // attempts row above the screen
      const ra = ramp(t, 87.0, 87.5);
      if (ra > 0) {
        ctx.save(); ctx.globalAlpha = ra;
        ctx.font = '20px "Inter Medium"'; ctx.letterSpacing = '5px'; ctx.fillStyle = C.lav; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
        ctx.fillText('SAME TASK, TEN TRIES', AI.x, 200);
        for (let k = 0; k < 10; k++) token(ctx, AI.x - 297 + k * 66, 258, t, k);
        const h = ramp(t, HALF, HALF + 0.5);
        if (h > 0) {
          ctx.globalAlpha = ra * h; ctx.font = '30px "Inter SemiBold"'; ctx.letterSpacing = '2px'; ctx.fillStyle = C.cyanW;
          ctx.fillText('5 of 10 finished', AI.x, 330 + (1 - out(h)) * 10);
          ctx.strokeStyle = rgba(C.cyan, 0.6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(AI.x - 320, 226); ctx.lineTo(AI.x - 320, 218); ctx.lineTo(AI.x + 320, 218); ctx.lineTo(AI.x + 320, 226); ctx.stroke();
        }
        ctx.restore();
      }
      desk(ctx, AI.x, 700);
      const b = Math.sin(t * 1.6);
      light(ctx, AI.x, 760, 300, C.cyan, 0.14 * flick);
      figure(ctx, { x: AI.x + 10, y: 1060 + b * 1.5, s: 1.55, facing: 'back', br: b, len: 0.95, lean: -0.03, turn: 0.12 * Math.sin(t * 0.5), tilt: 0.08, lx: 1,
        pal: ['#d8f7ff', '#5fc4e4', '#0a4f6c'], skin: ['#e8fbff', '#8fe6ff', '#0a6f8c'], hair0: '#2a8fb0', grain: 0.3, rim: C.cyanW, rimA: 0.5, rimDy: -4, rimDx: 0,
        arms: [{ a1: 1.95, a2: 0.15 + Math.sin(t * 14) * 0.06, behind: true }, { a1: 1.19, a2: 2.99 + Math.sin(t * 12) * 0.06, behind: true }] });
      chair(ctx, AI.x + 10, 1060 + b * 1.5, 1.55, C.cyan);
    }
    // ---- the human side
    {
      const hrs = clock(ctx, t);
      hoursBar(ctx, t, hrs);
      const hp = clamp(hrs / 8);
      screen(ctx, HU.mon, t, C.amber, hp);
      desk(ctx, HU.x, 700);
      // desk lamp: the hero light on this side
      const lx = HU.x + 360, ly = 700, lf = 0.95 + 0.05 * Math.sin(t * 6.1) * Math.sin(t * 1.9);
      ctx.strokeStyle = '#1a1638'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 30, ly - 150); ctx.lineTo(lx - 30, ly - 200); ctx.stroke();
      ctx.save(); ctx.translate(lx - 44, ly - 196); ctx.rotate(-0.5);
      cone(ctx, 0, 24, 60, 420, 260, C.amber, 0.1 * lf);
      grainFill(ctx, c => { c.moveTo(-14, -26); c.lineTo(14, -26); c.lineTo(40, 22); c.lineTo(-40, 22); c.closePath(); }, lin(ctx, -36, 0, 36, 0, [[0, '#3c3270'], [1, '#120e2a']]), 0.5, [-50, -40, 100, 80]);
      ctx.fillStyle = '#ffe6b8'; ctx.beginPath(); ctx.ellipse(0, 22, 40, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      light(ctx, lx - 60, ly - 160, 110, C.amber, 0.6 * lf);
      light(ctx, HU.x + 200, 720, 420, C.amber, 0.22 * lf);
      // a mug and papers
      grainFill(ctx, c => { c.moveTo(HU.x - 400, 690); c.lineTo(HU.x - 350, 690); c.lineTo(HU.x - 354, 744); c.lineTo(HU.x - 396, 744); c.closePath(); }, lin(ctx, HU.x - 400, 0, HU.x - 350, 0, [[0, '#4a4f92'], [1, '#1c1d48']]), 0.4, [HU.x - 410, 680, 70, 70]);
      const b = Math.sin(t * 1.6 + 1), wr = Math.sin(t * 7) * 0.05;
      figure(ctx, { x: HU.x - 10, y: 1060 + b * 1.5, s: 1.55, facing: 'back', br: b, len: 0.95, lean: 0.04, turn: -0.18 + 0.1 * Math.sin(t * 0.45) - 0.35 * ramp(t, 93.0, 93.6) * (1 - ramp(t, 94.6, 95.2)), tilt: 0.1, lx: 1,
        pal: ['#ffc27c', '#cf7a36', '#5a2a12'], rim: C.amber, rimA: 0.45, rimDx: 4, rimDy: -3,
        arms: [{ a1: 1.95, a2: 0.15 + wr, behind: true }, { a1: 1.19, a2: 2.99 - wr, behind: true }] });
      chair(ctx, HU.x - 10, 1060 + b * 1.5, 1.55, C.amber);
    }
  });
  label(ctx, t, 85.04, T1 + 1, 'METR', 'independent lab', 96, 40, { color: C.cyan });
}

module.exports = { T0, T1, draw };
