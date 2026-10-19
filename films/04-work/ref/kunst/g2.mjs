// G2 · the word: UNEMPLOYED becomes "retired". Same days, same bench, a different label — and people got
// noticeably happier (Hetschko, Knabe & Schöb 2014, Economic Journal: unemployed people reaching retirement age).
// Diptych: the identical scene drawn twice by the same function; only the light and the word change.
// Under it, the days run on unchanged; a schematic satisfaction line steps up at the switch. No numbers.
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, layer, put, stipple, maskLinear, maskRadial, roughPath, roughPoly, roughRect, roughLine, hatch, fog, cone, pool, bloom, person, castShadow, printFinish, vnoise, limb, qpts } from './art.mjs';
import { text, save } from './lib.mjs';

const GOLD = '#ffb35c', HOT = '#ffdca6', RED = '#d23a2a';
function scene(ctx, X, Y, w, h, warm) {
  ctx.save(); ctx.beginPath(); roughPath(ctx, [[X, Y], [X + w, Y], [X + w, Y + h], [X, Y + h]], { amp: 1.2, seed: 3 }); ctx.clip(); ctx.translate(X, Y);
  const sky = warm ? ['#2a3a5c', '#c98a5a', '#f2c08a'] : ['#1b2238', '#3a4660', '#59657c'];
  { const g = ctx.createLinearGradient(0, 0, 0, h * .7); g.addColorStop(0, sky[0]); g.addColorStop(.7, sky[1]); g.addColorStop(1, sky[2]); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); }
  if (warm) bloom(ctx, w * .86, h * .5, 420, { col: GOLD, core: HOT, a: .6, k: .4, seed: 4 });
  // far park: tree line, a lamp, the city faint
  const rr = prng(5); ctx.fillStyle = warm ? '#5a5a5a' : '#2c3550';
  for (let x = -20; x < w + 40;) { const bw = 30 + rr() * 50, bh = 40 + rr() * 60; ctx.fillStyle = warm ? mixHex('#4a4a4e', '#7a5a46', rr()) : mixHex('#273049', '#323b55', rr()); ctx.beginPath(); ctx.ellipse(x, h * .66 - bh * .3, bw * .7, bh * .5, 0, 0, 7); ctx.fill(); x += bw * .9; }
  fog(ctx, { y0: h * .45, y1: h * .75, col: warm ? '#f2c08a' : '#6a7590', a: .4, seed: 6, cover: .7, soft: .4, k: .2, x0: 0, x1: w });   // drawn in the panel's translated space
  // ground
  { const g = ctx.createLinearGradient(0, h * .66, 0, h); g.addColorStop(0, warm ? '#5c5a3a' : '#2a3245'); g.addColorStop(1, warm ? '#2a2a20' : '#151a28'); ctx.fillStyle = g; roughRect(ctx, -10, h * .66, w + 20, h * .4, null, { amp: 1, seed: 7 }); ctx.fill(); }
  // big tree trunk on the left of the panel with a few leaves
  limb(ctx, qpts([w * .14, h + 10], [w * .1, h * .4], [w * .18, -20]), 46, 30, warm ? '#2a2018' : '#141a28', 8);
  limb(ctx, qpts([w * .15, h * .3], [w * .3, h * .2], [w * .44, -20]), 18, 6, warm ? '#2a2018' : '#141a28', 9);
  const lr = prng(10); for (let i = 0; i < 60; i++) { const x = w * (.05 + lr() * .5), y = lr() * h * .35; ctx.fillStyle = warm ? ['#e58a3a', '#ffb35c', '#c4482a'][i % 3] : ['#4a5068', '#565a70', '#3e4560'][i % 3]; ctx.beginPath(); ctx.ellipse(x, y, 7, 4, lr() * 3, 0, 7); ctx.fill(); }
  // fallen leaves on the ground
  for (let i = 0; i < 40; i++) { const x = lr() * w, y = h * .7 + lr() * h * .3; ctx.fillStyle = warm ? rgba(['#e58a3a', '#ffb35c', '#c4482a'][i % 3], .8) : rgba('#4a5470', .6); ctx.beginPath(); ctx.ellipse(x, y, 4, 2, lr() * 3, 0, 7); ctx.fill(); }
  // the bench and the man on it, exactly the same pose in both panels except the head (lifted when warm)
  const bx = w * .4, by = h * .9; ctx.save(); ctx.translate(bx, by); ctx.scale(1.3, 1.3); ctx.translate(-bx, -by);
  if (warm) castShadow(ctx, bx + 80, by + 8, .9, w * 1.2, h * .45, { a: .5, len: 2.6, col: '#1a140c' });
  const bc = warm ? '#2a1a12' : '#0e1220';
  roughRect(ctx, bx - 20, by - 70, 230, 9, bc, { amp: .6, seed: 11 }); roughRect(ctx, bx - 20, by - 96, 230, 8, bc, { amp: .6, seed: 12 }); roughRect(ctx, bx - 20, by - 118, 230, 8, bc, { amp: .6, seed: 13 });
  for (const lx of [0, 180]) { roughRect(ctx, bx + lx, by - 70, 8, 70, bc, { amp: .4, seed: lx }); roughRect(ctx, bx + lx - 4, by - 120, 6, 54, bc, { amp: .4, seed: lx + 1 }); }
  const P = { lean: .12, head: warm ? -.28 : .42, sh: warm ? [.7, .55] : [.95, .8], el: warm ? [1.2, 1.25] : [.85, .9], hip: [1.5, 1.45], kn: [1.5, 1.42], hair: 'grey', bulk: 1.12, coat: 0 };
  const f = person(ctx, bx + 100, by - 70, 1.22, P, { dress: { coat: warm ? '#3a5a4a' : '#2c3448', pants: warm ? '#2a2a34' : '#1c2030', shoes: '#0e0e14', skin: warm ? '#e2b28a' : '#9a8a84', hair: warm ? '#e8e0d2' : '#9a9aa8', hairBack: warm ? '#e8e0d2' : '#9a9aa8' },
    light: warm ? { x: w * 1.1, y: h * .45, col: HOT, a: .6 } : null, rim: warm ? HOT : null, rimSide: 1, rimW: 2.2, shadeA: warm ? 0 : .15 });
  // newspaper in his hands (folded on the lap when warm: he is looking up at the birds)
  const [hx, hy] = f.hand(0);
  if (!warm) roughPoly(ctx, [[hx - 22, hy - 18], [hx + 14, hy - 26], [hx + 18, hy + 4], [hx - 18, hy + 10]], '#9a9890', { amp: .4, seed: 14 });
  else roughPoly(ctx, [[hx - 30, hy - 2], [hx + 18, hy - 6], [hx + 20, hy + 8], [hx - 28, hy + 10]], '#e8dcc4', { amp: .5, seed: 14 });
  roughPoly(ctx, [[bx + 170, by - 82], [bx + 186, by - 82], [bx + 183, by - 100], [bx + 173, by - 100]], warm ? '#e8dcc4' : '#8a8ea0', { amp: .3, seed: 15 });
  ctx.restore();
  // pigeons on the ground
  for (const [px, py, s] of [[w * .3, h * .9, 1], [w * .34, h * .93, .9], [w * .8, h * .92, 1.1]]) { ctx.fillStyle = warm ? '#4a4040' : '#3a4256'; ctx.beginPath(); ctx.ellipse(px, py, 12 * s, 7 * s, -.2, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(px + 11 * s, py - 6 * s, 4.5 * s, 0, 7); ctx.fill(); ctx.fillStyle = warm ? '#e58a3a' : '#5a6070'; ctx.fillRect(px + 15 * s, py - 6 * s, 4 * s, 2 * s); }
  // birds in the sky (he looks up at them in the warm one)
  for (const [x, y, s] of [[w * .62, h * .22, 1], [w * .68, h * .18, .8], [w * .72, h * .26, .9]]) { ctx.strokeStyle = warm ? '#2a2020' : '#2a3348'; ctx.lineWidth = 2 * s; ctx.beginPath(); ctx.moveTo(x - 12 * s, y - 3 * s); ctx.quadraticCurveTo(x - 5 * s, y - 8 * s, x, y); ctx.quadraticCurveTo(x + 5 * s, y - 8 * s, x + 12 * s, y - 4 * s); ctx.stroke(); }
  if (!warm) { ctx.fillStyle = rgba('#0a0e1c', .25); ctx.fillRect(0, 0, w, h); }
  ctx.restore();
  // panel edge
  ctx.strokeStyle = rgba(warm ? HOT : '#8a90a8', .5); ctx.lineWidth = 1.5; ctx.beginPath(); roughPath(ctx, [[X, Y], [X + w, Y], [X + w, Y + h], [X, Y + h]], { amp: 1.2, seed: 3 }); ctx.stroke();
}
// a rubber stamp: heavy letters in a rough frame, ink that skips (noise holes), slight rotation
function stamp(ctx, s, x, y, { size = 84, rot = -.08, col = RED, seed = 1 } = {}) {
  const [c, g] = layer(); g.translate(x, y); g.rotate(rot);
  g.font = `600 ${size}px "Inter"`; try { g.letterSpacing = size * .08 + 'px'; } catch { } const tw = g.measureText(s).width + size * .08 * s.length;
  g.fillStyle = col; g.textAlign = 'left'; g.fillText(s, -tw / 2, size * .36);
  g.strokeStyle = col; g.lineWidth = size * .07; g.beginPath(); roughPath(g, [[-tw / 2 - size * .3, -size * .72], [tw / 2 + size * .2, -size * .72], [tw / 2 + size * .2, size * .62], [-tw / 2 - size * .3, size * .62]], { amp: 2, seed }); g.stroke();
  g.setTransform(1, 0, 0, 1, 0, 0);
  // ink skips: erase with clustered noise
  const d = g.getImageData(0, 0, W, H), p = d.data, n = vnoise(seed + 3), r = prng(seed);
  for (let yy = Math.max(0, y - size * 2); yy < Math.min(H, y + size * 2); yy++) for (let xx = Math.max(0, x - tw); xx < Math.min(W, x + tw); xx++) { const i = (yy * W + xx) * 4 + 3; if (!p[i]) continue; const v = n(xx * .05, yy * .05) * .7 + n(xx * .3, yy * .3) * .3; p[i] *= clamp((v - .28) * 3.2) * (r() < .08 ? .3 : 1) * .92; }
  g.putImageData(d, 0, 0); put(ctx, c);
}
export function frame(out) {
  const [cv, ctx] = layer();
  { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0a0c22'); g.addColorStop(1, '#14173a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  const PW = 800, PH = 560, Y = 170, XL = 120, XR = 1000;
  scene(ctx, XL, Y, PW, PH, false);
  scene(ctx, XR, Y, PW, PH, true);
  // the words
  stamp(ctx, 'UNEMPLOYED', XL + PW * .56, Y + 120, { size: 72, rot: -.07, seed: 4 });
  { const [c, g] = layer(); g.font = '150px "Instrument Serif Italic"'; g.fillStyle = HOT; g.textAlign = 'center'; g.fillText('retired', XR + PW * .56, Y + 168); const b = layer(); b[1].filter = 'blur(18px)'; b[1].drawImage(c, 0, 0); put(ctx, b[0], { op: 'lighter', a: .8 }); put(ctx, c); }
  // between the panels: the birthday
  { const x = (XL + PW + XR) / 2; ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(x, Y + PH / 2, 22, 0, 7); ctx.fill(); bloom(ctx, x, Y + PH / 2, 70, { a: .6, k: .2, seed: 5 }); text(ctx, '65', x, Y + PH / 2 + 8, { size: 22, weight: 600, color: '#2a1406', align: 'center' }); }
  // the days run on unchanged: one strip of identical day-cells under both panels
  const sy = Y + PH + 64, cells = 28, cw = (XR + PW - XL) / cells;
  for (let i = 0; i < cells; i++) { const x = XL + i * cw, warm = x >= XR - 40; roughRect(ctx, x + 3, sy, cw - 6, 30, warm ? '#3a2a1c' : '#1c2238', { amp: .4, seed: i });
    const ix = x + cw / 2; ctx.fillStyle = warm ? GOLD : '#7a809a'; roughRect(ctx, ix - 9, sy + 15, 18, 3, ctx.fillStyle, { amp: .2, seed: i + 50 }); roughRect(ctx, ix - 9, sy + 9, 18, 2, ctx.fillStyle, { amp: .2, seed: i + 60 }); roughRect(ctx, ix - 7, sy + 18, 2, 6, ctx.fillStyle, { amp: .1, seed: i }); roughRect(ctx, ix + 5, sy + 18, 2, 6, ctx.fillStyle, { amp: .1, seed: i + 1 });
    if (i % 7 === 0) text(ctx, ['MON', 'MON', 'MON', 'MON'][i / 7 | 0], x + 4, sy - 8, { size: 11, weight: 600, color: '#6f7596', spacing: 2 }); }
  text(ctx, 'the same days', XL, sy + 62, { size: 26, font: 'Instrument Serif Italic', color: '#b9b3d8' });
  // schematic satisfaction line: flat, then a step up at the switch, stays up
  { const ly = sy + 150, x0 = XL + 330, x1 = XR + PW, xs = (XL + PW + XR) / 2, n = vnoise(8);
    const pts = []; for (let x = x0; x <= x1; x += 4) { const up = x < xs ? 0 : 44 * (1 - Math.exp(-(x - xs) / 30)); pts.push([x, ly - up + (n(x * .03, 1) - .5) * 3]); }
    roughLine(ctx, pts, { w: 4, col: GOLD, seed: 2, amp: .3 }); ctx.setLineDash([3, 6]); ctx.strokeStyle = rgba('#b9b3d8', .5); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(xs, ly); ctx.lineTo(x1, ly); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'LIFE SATISFACTION · SCHEMATIC', XL, ly + 5, { size: 12, weight: 600, color: '#8f8ab0', spacing: 3 });
    text(ctx, 'noticeably happier', x1, ly - 58, { size: 24, font: 'Instrument Serif Italic', color: HOT, align: 'right' }); }
  // headline + source
  ctx.fillStyle = GOLD; ctx.fillRect(XL, 66, 28, 2); text(ctx, 'NOTHING ABOUT THEIR DAYS CHANGED', XL, 98, { size: 16, weight: 600, color: '#a49fc4', spacing: 6 });
  text(ctx, 'Only the word.', XL, 146, { size: 44, font: 'Instrument Serif', color: '#f3efe2' });
  text(ctx, 'Source: Hetschko, Knabe & Schöb (2014), The Economic Journal — unemployed people in Germany reaching retirement age', XR + PW, 1050, { size: 14, weight: 400, color: '#8f8ab0', align: 'right' });
  printFinish(ctx, { grain: .085, vig: .4 });
  save(cv, out);
}
frame(process.argv[2] || 'g2.png');
