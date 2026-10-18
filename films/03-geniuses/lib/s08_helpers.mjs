// Shared drawing helpers for sections 08 (two endings) and 10 (your part):
// eye chart, wall clock, clinic room, envelopes, mini experts, the narrow door, the room of heads, bus interior.
import { W, H, C, rgba, clamp, lin, mix, sm, eio, eout, sine, prng, canvas, addGlow, glow, text } from '../engine.mjs';
import { P, shade, mixHex, fogBand, person } from './world.mjs';

const cache = new Map(); export const once = (k, f) => { if (!cache.has(k)) cache.set(k, f()); return cache.get(k); };

// camera: zoom z around focus (fx, fy), then shift (dx, dy)
export function cam(ctx, fx, fy, z = 1, dx = 0, dy = 0) { ctx.translate(W / 2 + dx, H / 2 + dy); ctx.scale(z, z); ctx.translate(-fx, -fy); }

// ---------- eye chart (Snellen) ----------
export const CHART = ['E', 'FP', 'TOZ', 'LPED', 'PECFD', 'EDFCZP', 'FELOPZD', 'DEFPOTEC'];
// sharp(row) in 0..1 → blur for that row; lit(row) adds a warm highlight
export function eyeChart(ctx, x, y, w, h, { sharp = () => 1, lit = () => 0, paper = '#e9e4d6', alpha = 1, ink = '#1a1a2a' } = {}) {
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(x + 10, y + 14, w, h);
  ctx.fillStyle = paper; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = shade(paper, -.25); ctx.lineWidth = 3; ctx.strokeRect(x + 6, y + 6, w - 12, h - 12);
  const raw = CHART.map((_, i) => .2 - i * .022), tot = raw.reduce((a, b) => a + b, 0) * 1.12, k = .9 / tot;
  let yy = y + h * .03;
  CHART.forEach((row, i) => {
    const size = h * raw[i] * k, gap = size * .12;
    yy += size + gap;
    const sh = clamp(sharp(i)), b = (1 - sh) * size * .22;
    ctx.save();
    if (b > .3) ctx.filter = `blur(${b.toFixed(1)}px)`;
    const tw = row.length * size * .9; ctx.font = `600 ${size}px "Inter"`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    for (let k = 0; k < row.length; k++) {
      const lx = x + w / 2 - tw / 2 + (k + .5) * size * .9;
      ctx.fillStyle = ink; ctx.globalAlpha = alpha * mix(.55, 1, sh); ctx.fillText(row[k], lx, yy);
    }
    ctx.restore();
    const l = lit(i); if (l > 0) { ctx.fillStyle = rgba(P.amber, .22 * l); ctx.fillRect(x + 12, yy - size * .95, w - 24, size * 1.1); }
    if (i === 5) { ctx.fillStyle = 'rgba(200,60,60,.6)'; ctx.fillRect(x + 14, yy + 4, w - 28, 2); }
  });
  ctx.restore();
}

// ---------- wall clock with a ticking second hand ----------
export function wallClock(ctx, x, y, r, t, { face = '#e9e4d6', dark = 0 } = {}) {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.arc(x + 6, y + 8, r, 0, 7); ctx.fill();
  ctx.fillStyle = '#2a2a3a'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  ctx.fillStyle = mixHex(face, '#5a5a70', dark); ctx.beginPath(); ctx.arc(x, y, r * .9, 0, 7); ctx.fill();
  ctx.strokeStyle = '#2a2a3a';
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; ctx.lineWidth = i % 3 ? 2 : 4; ctx.beginPath(); ctx.moveTo(x + Math.sin(a) * r * .72, y - Math.cos(a) * r * .72); ctx.lineTo(x + Math.sin(a) * r * .84, y - Math.cos(a) * r * .84); ctx.stroke(); }
  const sec = Math.floor(t) + eout(clamp((t % 1) * 6)), as = sec / 60 * Math.PI * 2, am = (t / 600 + .62) * Math.PI * 2, ah = (t / 7200 + .3) * Math.PI * 2;
  ctx.lineCap = 'round';
  ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(ah) * r * .45, y - Math.cos(ah) * r * .45); ctx.stroke();
  ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(am) * r * .68, y - Math.cos(am) * r * .68); ctx.stroke();
  ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x - Math.sin(as) * r * .15, y + Math.cos(as) * r * .15); ctx.lineTo(x + Math.sin(as) * r * .8, y - Math.cos(as) * r * .8); ctx.stroke();
  ctx.fillStyle = '#2a2a3a'; ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.fill();
  ctx.restore();
}

// ---------- mood colours (0 = first future, cool grey; 1 = second future, warm morning) ----------
export const mood = (m) => ({
  wallTop: mixHex('#161a3e', '#3a2c48', m), wallBot: mixHex('#22284f', '#7a4f52', m),
  floor: mixHex('#0f1230', '#3a2638', m), light: m > .5 ? P.amber : '#9fb6d8', lightA: mix(.18, .45, m),
});

// ---------- window view: sky + far city of lights (the room of geniuses) or morning sun ----------
export function windowView(ctx, t, x, y, w, h, m = 0, { city = 1, sun = m, seed = 4 } = {}) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, mixHex('#1b2148', '#3d4f8a', m)); g.addColorStop(.65, mixHex('#3b4570', '#f0a77a', m)); g.addColorStop(1, mixHex('#56608a', '#ffd9a0', m));
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  if (sun > 0) { addGlow(ctx, x + w * .62, y + h * .72, h * .9, .55 * sun, P.amber, '#fff6e0'); ctx.fillStyle = rgba('#fff3d6', .9 * sun); ctx.beginPath(); ctx.arc(x + w * .62, y + h * .74, h * .07, 0, 7); ctx.fill(); }
  // clouds drifting
  const r = prng(seed);
  for (let i = 0; i < 5; i++) { const cx = x + ((r() * w * 1.4 + t * (6 + r() * 6)) % (w * 1.4)) - w * .2, cy = y + h * (.15 + r() * .3); ctx.fillStyle = rgba(mixHex('#7d86b8', '#ffd0b0', m), .18); ctx.beginPath(); ctx.ellipse(cx, cy, 90 + r() * 80, 14 + r() * 8, 0, 0, 7); ctx.fill(); }
  // far city: low blocks, many warm windows; a glowing core (the data centre)
  if (city > 0) {
    const base = y + h * .86; ctx.save(); ctx.globalAlpha = city;
    for (let i = 0; i < 30; i++) { const bx = x + (i / 30) * w + (r() - .5) * 10, bw = w / 30 + r() * 10, bh = h * (.05 + r() * .16); ctx.fillStyle = mixHex('#1a1f45', '#5a4a6a', m); ctx.fillRect(bx, base - bh, bw, bh + h * .2); for (let k = 0; k < 6; k++) { if (r() < .5) { ctx.fillStyle = rgba(P.amber, .5 + .5 * Math.sin(t * 2 + i + k)); ctx.fillRect(bx + 3 + r() * (bw - 8), base - bh + 4 + r() * (bh - 8), 3, 3); } } }
    const cx = x + w * .5, core = 1 + .1 * Math.sin(t * 1.3);
    ctx.fillStyle = mixHex('#141a40', '#4a3a58', m); ctx.fillRect(cx - w * .12, base - h * .2, w * .24, h * .25);
    for (let k = 0; k < 10; k++) { ctx.fillStyle = rgba(C.cyan, .6 + .4 * Math.sin(t * 3 + k)); ctx.fillRect(cx - w * .11 + k * w * .022, base - h * .17, w * .012, h * .02); }
    addGlow(ctx, cx, base - h * .12, w * .3 * core, .35 * (1 - m * .5), C.cyan, C.cyanWhite);
    ctx.restore();
  }
  ctx.fillStyle = mixHex('#141838', '#3a2a3a', m); ctx.fillRect(x, y + h * .95, w, h * .05);
}

// window frame (mullions, sill) drawn over the view
export function windowFrame(ctx, x, y, w, h, m = 0, { cross = true } = {}) {
  const fc = mixHex('#2c3260', '#d8c9b8', m * .7);
  ctx.fillStyle = fc; const b = Math.max(10, w * .025);
  ctx.fillRect(x - b, y - b, w + 2 * b, b); ctx.fillRect(x - b, y + h, w + 2 * b, b * 1.6); ctx.fillRect(x - b, y, b, h); ctx.fillRect(x + w, y, b, h);
  if (cross) { ctx.fillRect(x + w / 2 - b * .4, y, b * .8, h); ctx.fillRect(x, y + h * .45 - b * .4, w, b * .8); }
  ctx.fillStyle = 'rgba(255,255,255,.04)'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w * .3, y); ctx.lineTo(x, y + h * .4); ctx.fill();
}

// ---------- the mother (seated, grey hair, cardigan) ----------
export function mother(ctx, x, y, h, t, { look = 0, flip = false, warm = 0 } = {}) {
  person(ctx, x, y, h, t, { sit: true, coat: mixHex('#5d5577', '#a0727a', warm), dark: '#1c1d3c', hood: false, hair: '#cfcbd6', skin: mixHex('#b88e74', '#d7a383', warm), look, flip, breathe: .7 });
}

// ---------- envelopes ----------
export function envelope(ctx, x, y, s, rot = 0, { a = 1, col = '#e9e4d6', glowA = 0 } = {}) {
  if (a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = a;
  ctx.fillStyle = col; ctx.fillRect(-s, -s * .64, 2 * s, s * 1.28);
  ctx.strokeStyle = shade(col, -.28); ctx.lineWidth = Math.max(1, s * .06); ctx.beginPath(); ctx.moveTo(-s, -s * .64); ctx.lineTo(0, s * .1); ctx.lineTo(s, -s * .64); ctx.stroke();
  if (glowA > 0) { ctx.fillStyle = rgba(P.amber, glowA); ctx.beginPath(); ctx.arc(0, s * .1, s * .2, 0, 7); ctx.fill(); }
  ctx.restore();
}

// ---------- mini expert: a small figure (thumb-sized) with a soft glow and a prop ----------
// pose: 'sit' on an edge, 'stand', 'jump' (u = jump phase 0..1). prop: 'book' | 'map' | 'dish' | 'flask' | null
export function mini(ctx, x, y, h, t, { col = C.cyan, pose = 'stand', jump = 0, prop = null, look = 0, nod = 0, a = 1, seed = 1 } = {}) {
  if (a <= 0) return;
  const s = h / 100, hop = pose === 'jump' ? Math.sin(Math.PI * clamp(jump)) * 60 : 0;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y - hop * s); ctx.scale(s, s);
  addGlow(ctx, 0, -50, 70, .25, col, C.cyanWhite);
  const body = shade(col, -.35), light = col;
  // legs
  ctx.strokeStyle = body; ctx.lineCap = 'round'; ctx.lineWidth = 9;
  if (pose === 'sit') { ctx.beginPath(); ctx.moveTo(-6, -30); ctx.lineTo(-8, 0); ctx.lineTo(-4, 14); ctx.moveTo(6, -30); ctx.lineTo(8, 0); ctx.lineTo(12, 12 + Math.sin(t * 3 + seed) * 4); ctx.stroke(); }
  else { const sp = pose === 'jump' ? 10 * Math.sin(Math.PI * jump) : 0; ctx.beginPath(); ctx.moveTo(-6, -36); ctx.lineTo(-8 - sp, 0); ctx.moveTo(6, -36); ctx.lineTo(8 + sp, 0); ctx.stroke(); }
  // torso
  const ty = pose === 'sit' ? -32 : -36;
  ctx.fillStyle = body; ctx.beginPath(); ctx.roundRect(-17, ty - 46, 34, 52, 12); ctx.fill();
  ctx.fillStyle = rgba(light, .55); ctx.beginPath(); ctx.roundRect(-17, ty - 46, 12, 52, 10); ctx.fill();
  // arms (raised when jumping or holding a prop)
  const up = pose === 'jump' ? Math.sin(Math.PI * jump) : 0;
  ctx.strokeStyle = body; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(-15, ty - 38); ctx.lineTo(-26 - up * 6, ty - 14 - up * 50); ctx.moveTo(15, ty - 38); ctx.lineTo(prop ? 20 : 26 + up * 6, prop ? ty - 22 : ty - 14 - up * 50); ctx.stroke();
  // head with a nod
  const hx = look * 4, hy = ty - 62 + nod * 6;
  ctx.fillStyle = mixHex(light, '#ffffff', .3); ctx.beginPath(); ctx.arc(hx, hy, 15, 0, 7); ctx.fill();
  ctx.fillStyle = body; ctx.beginPath(); ctx.arc(hx, hy - 5, 15, Math.PI * 1.05, Math.PI * 1.95); ctx.fill();
  // prop
  if (prop === 'book') { ctx.fillStyle = '#c2553f'; ctx.fillRect(14, ty - 34, 26, 30); ctx.fillStyle = '#f3efe2'; ctx.fillRect(16, ty - 32, 3, 26); }
  if (prop === 'map') { ctx.fillStyle = '#e9e4d6'; ctx.fillRect(10, ty - 40, 40, 28); ctx.strokeStyle = '#4a7fa0'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(14, ty - 30); ctx.bezierCurveTo(24, ty - 38, 32, ty - 18, 46, ty - 28); ctx.stroke(); }
  if (prop === 'dish') { ctx.fillStyle = rgba('#d8f7ff', .8); ctx.beginPath(); ctx.ellipse(28, ty - 26, 18, 7, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#5fd38a'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(20 + i * 5, ty - 27, 2.4, 0, 7); ctx.fill(); } }
  if (prop === 'flask') { ctx.fillStyle = rgba('#7fe3ff', .8); ctx.beginPath(); ctx.moveTo(22, ty - 44); ctx.lineTo(30, ty - 44); ctx.lineTo(30, ty - 34); ctx.lineTo(40, ty - 14); ctx.lineTo(12, ty - 14); ctx.lineTo(22, ty - 34); ctx.fill(); }
  ctx.restore();
}

// ---------- the narrow door: frame in a wall, opening o (0..1), light pours out ----------
export function narrowDoor(ctx, x, y, w, h, o, t, { wall = '#10143a', lightA = 1, beam = 1 } = {}) {
  // light behind
  const gap = w * o;
  ctx.fillStyle = '#05061a'; ctx.fillRect(x - w / 2, y - h, w, h);
  if (gap > 0) {
    const g = ctx.createLinearGradient(x - w / 2, 0, x - w / 2 + gap, 0); g.addColorStop(0, '#fff6e0'); g.addColorStop(1, '#ffd29a');
    ctx.fillStyle = g; ctx.fillRect(x - w / 2, y - h, gap, h);
    addGlow(ctx, x - w / 2 + gap / 2, y - h / 2, h * (.6 + o * .6), .5 * lightA, P.amber, '#fff6e0');
    if (beam > 0) {
      const bg = ctx.createLinearGradient(x, y, x, y + h * .9); bg.addColorStop(0, rgba('#ffd29a', .38 * beam * lightA)); bg.addColorStop(1, rgba('#ffd29a', 0));
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x - w / 2 + gap, y); ctx.lineTo(x + gap * 2.4 + w * .6, y + h * .9); ctx.lineTo(x - w * 1.6 - gap * 1.4, y + h * .9); ctx.fill(); ctx.restore();
      // dust in the beam
      const r = prng(21); ctx.fillStyle = rgba('#fff3dd', .6 * beam * lightA);
      for (let i = 0; i < 40; i++) { const px = x - w / 2 + r() * gap * 2 + (r() - .5) * w * 2, py = y + ((r() * h * .8 + t * (8 + r() * 10)) % (h * .8)); ctx.fillRect(px, py, 2, 2); }
    }
  }
  // door leaf swings inward (drawn as a narrowing panel on the right)
  const leaf = w * (1 - o);
  ctx.fillStyle = '#2a2244'; ctx.fillRect(x + w / 2 - leaf, y - h, leaf, h);
  ctx.fillStyle = rgba('#ffd29a', .25 * o); ctx.fillRect(x + w / 2 - leaf, y - h, 3, h);
  ctx.fillStyle = '#c9a36a'; ctx.beginPath(); ctx.arc(x + w / 2 - leaf + Math.min(14, leaf * .3), y - h * .48, 4, 0, 7); ctx.fill();
  // frame
  ctx.strokeStyle = shade(wall, .08); ctx.lineWidth = 10; ctx.strokeRect(x - w / 2 - 5, y - h - 5, w + 10, h + 5);
}

// ---------- room of heads: a vast hall of glowing seated minds (perspective rows) ----------
export function roomOfHeads(ctx, t, x, y, w, h, { rows = 14, a = 1, warm = 0 } = {}) {
  ctx.save(); ctx.globalAlpha = a;
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, mixHex('#0b0f2e', '#2a2140', warm)); g.addColorStop(1, mixHex('#1a2260', '#4a3450', warm));
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  addGlow(ctx, x + w / 2, y + h * .3, w * .6, .3, C.cyan, C.cyanWhite);
  const r = prng(55);
  for (let i = 0; i < rows; i++) {
    const v = i / (rows - 1), py = y + h * (.28 + v * .66), sc = mix(.28, 1.2, v * v), n = Math.round(mix(40, 12, v)), span = w * mix(.6, 1.05, v);
    for (let k = 0; k < n; k++) {
      const px = x + w / 2 - span / 2 + (k + .5) * span / n, pulse = .5 + .5 * Math.sin(t * 1.6 + i * .7 + k * 1.3);
      const hr = 11 * sc, col = r() < .14 ? P.amber : C.cyan;
      ctx.fillStyle = rgba(mixHex('#0e1440', '#2a2a5a', v), 1); ctx.beginPath(); ctx.ellipse(px, py + hr * 2.1, hr * 1.7, hr * 1.4, 0, Math.PI, 0); ctx.fill();
      ctx.fillStyle = rgba(col, .45 + .4 * pulse); ctx.beginPath(); ctx.arc(px, py, hr, 0, 7); ctx.fill();
      if (sc > .5) addGlow(ctx, px, py, hr * 3, .12 * pulse, col, C.cyanWhite);
    }
  }
  ctx.restore();
}

// ---------- bus interior: windows with passing morning landscape, seat rows ----------
export function busInterior(ctx, t, { warm = .6, speed = 120, z = 1, fx = W / 2, fy = H / 2 } = {}) {
  ctx.save(); cam(ctx, fx, fy, z);
  // ceiling + wall
  ctx.fillStyle = mixHex('#141838', '#3a2a40', warm); ctx.fillRect(-200, -200, W + 400, H + 400);
  // windows strip
  const wy = 150, wh = 380;
  for (let i = 0; i < 4; i++) {
    const wx = -60 + i * 520, ww = 470;
    ctx.save(); ctx.beginPath(); ctx.roundRect(wx, wy, ww, wh, 26); ctx.clip();
    const g = ctx.createLinearGradient(0, wy, 0, wy + wh); g.addColorStop(0, mixHex('#2a3a7a', '#f2b98a', warm)); g.addColorStop(1, mixHex('#5a6aa0', '#ffe2b0', warm)); ctx.fillStyle = g; ctx.fillRect(wx, wy, ww, wh);
    // passing scenery: far hills slow, near poles/trees fast
    const r = prng(9);
    ctx.fillStyle = mixHex('#2a3266', '#c08a7a', warm); ctx.beginPath(); ctx.moveTo(wx, wy + wh);
    for (let k = 0; k <= 12; k++) { const px = wx + k * ww / 12, sx = px + t * speed * .15; ctx.lineTo(px, wy + wh * .62 - 40 * Math.sin(sx * .006) - 20 * Math.sin(sx * .017)); }
    ctx.lineTo(wx + ww, wy + wh); ctx.fill();
    ctx.fillStyle = mixHex('#141a40', '#6a4a52', warm);
    for (let k = 0; k < 8; k++) { const px = ((k * 300 - t * speed + i * 520) % 2400 + 2400) % 2400 - 300; if (px > wx - 40 && px < wx + ww + 40) { ctx.fillRect(px, wy + wh * .3, 8, wh); ctx.beginPath(); ctx.arc(px + 4, wy + wh * .35, 34, 0, 7); ctx.fill(); } }
    ctx.restore();
    ctx.strokeStyle = mixHex('#0c0f2a', '#2a1c2a', warm); ctx.lineWidth = 14; ctx.beginPath(); ctx.roundRect(wx, wy, ww, wh, 26); ctx.stroke();
  }
  // light patches sliding over the interior (warm sun through the windows)
  for (let i = 0; i < 4; i++) { const px = ((i * 520 + t * 40) % 2080) - 200; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(px, 0, px + 300, 0); g.addColorStop(0, rgba(P.amber, 0)); g.addColorStop(.5, rgba(P.amber, .12 * warm)); g.addColorStop(1, rgba(P.amber, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(px, 540); ctx.lineTo(px + 300, 540); ctx.lineTo(px + 420, H + 100); ctx.lineTo(px + 120, H + 100); ctx.fill(); ctx.restore(); }
  // floor
  ctx.fillStyle = mixHex('#0b0d26', '#24182a', warm); ctx.fillRect(-200, 900, W + 400, 400);
  ctx.restore();
}
// one bus seat seen from the side (back at x, top at y)
export function busSeat(ctx, x, y, { warm = .6, s = 1 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = mixHex('#1c2258', '#5a3048', warm); ctx.beginPath(); ctx.roundRect(-30, 0, 60, 260, 22); ctx.fill();
  ctx.fillStyle = mixHex('#2a3270', '#7a4a58', warm); ctx.beginPath(); ctx.roundRect(-26, 6, 18, 240, 12); ctx.fill();
  ctx.fillStyle = mixHex('#161b48', '#4a2a40', warm); ctx.beginPath(); ctx.roundRect(-10, 200, 200, 50, 16); ctx.fill();
  ctx.fillStyle = '#0a0c22'; ctx.fillRect(60, 250, 14, 120);
  ctx.restore();
}
