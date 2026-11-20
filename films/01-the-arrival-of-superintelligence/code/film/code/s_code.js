// "More than eighty percent of the code ... is now written by its own AI."
// An engineer leans back, arms crossed, while the code on three screens writes itself.
const L = require('./lib');
const { W, H, C, sm, ramp, lerp, drift, hash, rng, grainFill, lin, rad, rgba, light, cone, stamp, out } = L;

const T0 = 5.0, T1 = 11.35;

// pre-generate the code: rows of tokens per screen
function makeCode(seed, rows) {
  const r = rng(seed), out = []; let ind = 0;
  for (let i = 0; i < rows; i++) {
    if (r() < 0.12 && ind > 0) ind--; else if (r() < 0.22 && ind < 4) ind++;
    if (r() < 0.08) { out.push({ ind, toks: [] }); continue; }
    const n = 1 + Math.floor(r() * 5), toks = [];
    for (let k = 0; k < n; k++) {
      const c = r(); toks.push({ w: 20 + Math.floor(r() * 90), col: c < 0.55 ? C.cyanW : c < 0.8 ? C.cyan : c < 0.92 ? C.amber : C.lav });
    }
    out.push({ ind, toks });
  }
  return out;
}
const CODE = [makeCode(1, 120), makeCode(2, 120), makeCode(3, 120)];
const rowChars = row => row.toks.reduce((s, k) => s + k.w + 12, 0);

// a screen: (x, y, w, h) with a horizontal skew for the angled side screens
const SCREENS = [
  { x: 120, y: 190, w: 400, h: 330, sk: 0.10, code: CODE[0], start: 0.25, rate: 1900 },
  { x: 560, y: 150, w: 640, h: 390, sk: 0.0, code: CODE[1], start: 0.0, rate: 2600 },
  { x: 1240, y: 190, w: 420, h: 330, sk: -0.10, code: CODE[2], start: 0.45, rate: 1700 },
];

function screen(ctx, s, t, flick) {
  ctx.save(); ctx.translate(s.x, s.y); ctx.transform(1, s.sk, 0, 1, 0, 0);
  // bezel and stand
  ctx.fillStyle = '#05060f'; roundRect(ctx, -14, -14, s.w + 28, s.h + 28, 10); ctx.fill();
  // glass
  grainFill(ctx, c => roundRect(c, 0, 0, s.w, s.h, 4),
    lin(ctx, 0, 0, s.w * 0.4, s.h, [[0, '#1a86a8'], [0.6, '#0e5878'], [1, '#08344e']]), 0.25);
  // code: typed row by row at `rate` px of tokens per second, then scrolls
  ctx.save(); ctx.beginPath(); ctx.rect(10, 10, s.w - 20, s.h - 20); ctx.clip();
  const lt = Math.max(0, t - T0 - s.start), budget = lt * s.rate, rowH = 22, scale = s.w / 640;
  let used = 0, rowsVisible = Math.floor((s.h - 30) / rowH), rowsDone = 0, cur = null;
  const rows = [];
  for (const row of s.code) {
    const need = rowChars(row) * scale + 30;
    if (used + need <= budget) { rows.push({ row, frac: 1 }); used += need; rowsDone++; }
    else { rows.push({ row, frac: (budget - used) / need }); break; }
  }
  const scroll = Math.max(0, rows.length - rowsVisible);
  rows.forEach((it, i) => {
    const y = 22 + (i - scroll) * rowH; if (y < 0) return;
    let x = 22 + it.row.ind * 26 * scale; const lim = x + (rowChars(it.row) * scale) * it.frac;
    for (const k of it.row.toks) {
      const w = k.w * scale; if (x >= lim) break;
      ctx.fillStyle = rgba(k.col, 0.92); roundRect(ctx, x, y, Math.min(w, lim - x), 8, 3); ctx.fill();
      x += w + 12 * scale;
    }
    if (it.frac < 1) { cur = [lim + 6, y]; }
  });
  if (cur && Math.floor(t * 3) % 2 === 0) { ctx.fillStyle = C.cyanW; ctx.fillRect(cur[0], cur[1] - 4, 9, 16); }
  ctx.restore();
  // glass sheen and light
  ctx.fillStyle = lin(ctx, 0, 0, s.w, s.h, [[0, 'rgba(216,247,255,0.10)'], [0.5, 'rgba(216,247,255,0)'], [1, 'rgba(216,247,255,0.04)']]);
  ctx.fillRect(0, 0, s.w, s.h);
  ctx.restore();
  light(ctx, s.x + s.w / 2, s.y + s.h / 2, s.w * 0.9, C.cyan, 0.16 * flick);
}

function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

// the engineer, seen from behind over his right shoulder: back of the head, hood, an elbow from crossed arms.
// Built from joints so he breathes, shifts and turns his head toward the screens.
function person(ctx, t) {
  const br = Math.sin(t * 1.7);                                   // breathing cycle
  const look = 0.05 * Math.sin(t * 0.45) + 0.10 * ramp(t, 8.8, 9.6);  // turns a little toward the centre screen
  ctx.save(); ctx.translate(1530, 1080 + br * 2);
  // chair back, dark against the cyan room
  grainFill(ctx, c => { c.moveTo(-230, 0); c.bezierCurveTo(-240, -260, -200, -420, -40, -440); c.bezierCurveTo(140, -450, 250, -330, 260, 0); c.closePath(); },
    lin(ctx, -230, -420, 260, 0, [[0, '#231d4c'], [1, '#0a0a1c']]), 0.6);
  ctx.save(); ctx.scale(1, 1 + br * 0.008);
  // body: hoodie seen from behind, shoulders sloping, left elbow out from the crossed arms
  const body = c => { c.moveTo(-300, 0); c.bezierCurveTo(-310, -120, -330, -250, -300, -330);   // elbow
    c.bezierCurveTo(-280, -380, -230, -420, -150, -450); c.bezierCurveTo(-90, -475, -40, -480, 0, -480);
    c.bezierCurveTo(70, -480, 160, -455, 210, -400); c.bezierCurveTo(250, -350, 265, -200, 270, 0); c.closePath(); };
  ctx.save(); ctx.translate(-7, -3); grainFill(ctx, body, C.cyan, 0); ctx.restore();       // cyan rim from the screens
  grainFill(ctx, body, lin(ctx, -300, -480, 270, 0, [[0, '#ffb35c'], [0.4, '#d27a34'], [1, '#5a2a12']]), 0.38);
  // shading: spine fold and shoulder blade
  ctx.strokeStyle = 'rgba(90,42,18,0.55)'; ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(10, -380); ctx.bezierCurveTo(0, -260, 15, -140, 5, -20); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-230, -300); ctx.bezierCurveTo(-210, -250, -205, -200, -215, -150); ctx.stroke();
  // hood bunched at the neck
  grainFill(ctx, c => { c.moveTo(-130, -455); c.bezierCurveTo(-120, -520, 110, -525, 130, -450); c.bezierCurveTo(70, -430, -60, -425, -130, -455); c.closePath(); },
    lin(ctx, -130, -520, 130, -430, [[0, '#ffc488'], [1, '#9a4c1c']]), 0.5);
  ctx.restore();
  // head: back of the head, hair mass with the light catching its left edge; only the ear and nape are skin
  ctx.save(); ctx.translate(-5, -470 + br * 1.5); ctx.rotate(-0.04 - look * 0.6);
  grainFill(ctx, c => { c.moveTo(-34, 0); c.lineTo(-30, -50); c.lineTo(34, -50); c.lineTo(36, 0); c.closePath(); }, '#a2521f', 0.5);
  ctx.translate(-look * 30, -88);
  const head = c => { c.moveTo(-70, 30); c.bezierCurveTo(-82, -40, -60, -92, -10, -96); c.lineTo(4, -106); c.lineTo(16, -95);
    c.bezierCurveTo(50, -96, 64, -82, 72, -60); c.lineTo(84, -58); c.lineTo(76, -40); c.bezierCurveTo(84, 0, 74, 60, 50, 84);
    c.bezierCurveTo(20, 96, -30, 96, -52, 76); c.bezierCurveTo(-62, 64, -68, 48, -70, 30); c.closePath(); };
  ctx.save(); ctx.translate(-5, -2); grainFill(ctx, head, C.cyan, 0); ctx.restore();
  grainFill(ctx, head, lin(ctx, -70, -80, 70, 80, [[0, '#5a2c14'], [0.5, '#2e140a'], [1, '#160806']]), 0.6);
  // the light from the screens catches the crown of the head
  ctx.save(); ctx.beginPath(); head(ctx); ctx.clip(); light(ctx, -60, -40, 90, '#ffb35c', 0.22); ctx.restore();
  // ear on the screen side, sliding as he turns
  grainFill(ctx, c => c.ellipse(-70 + look * 40, 12, 13, 24, -0.15, 0, Math.PI * 2), '#c36a2b', 0.4);
  ctx.restore();
  ctx.restore();
}

function draw(ctx, t) {
  const z = lerp(1.0, 1.09, sm((t - T0) / (T1 - T0)));
  const dx = drift(t, 1, 1) * 6, dy = drift(t, 1, 2) * 4;
  const flick = 0.9 + 0.1 * Math.sin(t * 13) * Math.sin(t * 3.1);
  const layer = (par, fn) => { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 + dx * par, -H / 2 + dy * par); fn(); ctx.restore(); };
  // back wall
  layer(0.3, () => {
    grainFill(ctx, c => c.rect(-200, -200, W + 400, H + 400), lin(ctx, 0, 0, 0, H, [[0, '#0b0d26'], [0.6, '#17163c'], [1, '#0b0a1e']]), 0.6);
    // shelf with books, catching cyan light
    ctx.fillStyle = '#0a0a1d'; ctx.fillRect(-100, 96, W + 200, 14);
    const r = rng(9); let x = 60;
    while (x < W) { const w = 14 + r() * 26, h = 40 + r() * 50; ctx.fillStyle = r() < 0.2 ? '#221c4a' : '#121034'; ctx.fillRect(x, 96 - h, w, h); x += w + 4 + (r() < 0.1 ? 60 : 0); }
    light(ctx, 860, 340, 900, C.cyan, 0.10 * flick);
  });
  // desk
  layer(0.7, () => {
    grainFill(ctx, c => { c.moveTo(-200, 600); c.lineTo(W + 200, 600); c.lineTo(W + 200, H + 200); c.lineTo(-200, H + 200); c.closePath(); },
      lin(ctx, 0, 600, 0, H, [[0, '#262052'], [1, '#0c0a1e']]), 0.6);
    cone(ctx, 880, 560, 1200, 1700, 420, C.cyan, 0.10 * flick);
    // keyboard
    ctx.save(); ctx.translate(620, 690); ctx.transform(1, 0, -0.25, 1, 0, 0);
    grainFill(ctx, c => roundRect(c, 0, 0, 420, 90, 8), '#11122c', 0.4);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 14; j++) { ctx.fillStyle = rgba(C.cyan, 0.10 + 0.06 * (i === 0)); roundRect(ctx, 12 + j * 28.5, 10 + i * 19, 22, 13, 3); ctx.fill(); }
    ctx.restore();
    // mug with steam
    ctx.save(); ctx.translate(1110, 652);
    grainFill(ctx, c => { c.moveTo(0, 0); c.lineTo(70, 0); c.lineTo(64, 84); c.lineTo(6, 84); c.closePath(); }, lin(ctx, 0, 0, 70, 0, [[0, '#3a4a8a'], [1, '#141638']]), 0.5);
    ctx.strokeStyle = '#1c1f48'; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(76, 36, 18, -1.2, 1.2); ctx.stroke();
    for (let k = 0; k < 3; k++) {
      const ph = (t * 0.35 + k / 3) % 1;
      ctx.strokeStyle = rgba(C.cream, 0.16 * Math.sin(ph * Math.PI)); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(25 + k * 12, -6);
      for (let s = 1; s <= 10; s++) ctx.lineTo(25 + k * 12 + Math.sin(s * 0.7 + t * 2 + k) * 8, -6 - s * 9 - ph * 30);
      ctx.stroke();
    }
    ctx.restore();
  });
  // screens
  layer(0.6, () => { for (const s of SCREENS) screen(ctx, s, t, flick); });
  // the engineer, closest to camera: most parallax
  layer(1.4, () => person(ctx, t));
  // the number
  const pct = Math.round(80 * out((t - 5.7) / 1.2));
  stamp(ctx, t, 5.7, T1 - 0.15, `${pct}%`, 'of the code is written by its own AI', { size: 170, x: 90, y: 600 });
}

module.exports = { T0, T1, draw };
