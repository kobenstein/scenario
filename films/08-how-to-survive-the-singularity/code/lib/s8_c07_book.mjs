// Film 8 · c07 local pieces (owner B2): the open book on your table (Acemoglu & Johnson, Power and Progress) and its engraved plate, a
// 19th-century mill: a few carry the sacks away, many stand empty-handed. Drawn in plate space (s8_desk sheet textures), ink on lamp-lit paper.
//   bookSpread(g, t, PW, PH, o)   o: { plate: [x, y, w, h] fractions of the spread (the plate on the right page), mill(g, w, h) (the plate's
//                                 content), turn 0..1 (the right page turns over to a blank page) }
//   engravedMill(g, t, w, h)      the engraving, in a w × h box at the origin
import { clamp, prng } from '../engine.mjs';
import { TAU, hash, sio } from './s8_kit.mjs';

const INK = '#2a2420';
function textLines(g, x, y, w, h, seed, a = .55) {
  const r = prng(seed); g.strokeStyle = `rgba(42,36,32,${a})`; g.lineCap = 'round';
  for (let yy = y; yy < y + h; yy += 30) {
    let xx = x + (r() < .15 ? 30 : 0); const end = x + w * (r() < .1 ? .55 : 1);
    while (xx < end) { const L = 14 + r() * 50; g.lineWidth = 3 + r(); g.beginPath(); g.moveTo(xx, yy); for (let k = 1; k <= 4; k++) g.lineTo(Math.min(end, xx + L * k / 4), yy + Math.sin(k * 2 + xx) * 1.4); g.stroke(); xx += L + 12; }
  }
}
function hatchBox(g, x, y, w, h, gap, ang, a, lw = 1.6) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.strokeStyle = `rgba(42,36,32,${a})`; g.lineWidth = lw; g.beginPath();
  const d = Math.hypot(w, h); for (let s = -d; s < d; s += gap) { g.moveTo(x + w / 2 + Math.cos(ang) * -d - Math.sin(ang) * s, y + h / 2 + Math.sin(ang) * -d + Math.cos(ang) * s); g.lineTo(x + w / 2 + Math.cos(ang) * d - Math.sin(ang) * s, y + h / 2 + Math.sin(ang) * d + Math.cos(ang) * s); }
  g.stroke(); g.restore();
}
function person(g, x, y, s, o = {}) {   // an engraved little figure (side view), o.sack: carries a sack on the shoulder, o.empty: arms hanging
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = INK; g.strokeStyle = INK; g.lineCap = 'round';
  g.beginPath(); g.arc(0, -64, 7, 0, TAU); g.fill();                       // head
  g.beginPath(); g.moveTo(-7, -56); g.lineTo(7, -56); g.lineTo(8, -26); g.lineTo(-8, -26); g.closePath(); g.fill();   // coat
  g.lineWidth = 4.5; g.beginPath(); g.moveTo(-4, -27); g.lineTo(-6 + (o.step || 0), 0); g.moveTo(4, -27); g.lineTo(5 - (o.step || 0), 0); g.stroke();   // legs
  if (o.sack) { g.beginPath(); g.ellipse(4, -64, 14, 9, -.4, 0, TAU); g.fill(); g.lineWidth = 3.5; g.beginPath(); g.moveTo(5, -54); g.lineTo(10, -62); g.stroke(); }
  else { g.lineWidth = 3.5; g.beginPath(); g.moveTo(-5, -54); g.lineTo(-7, -30); g.moveTo(5, -54); g.lineTo(7, -30); g.stroke(); }
  g.restore();
}
export function engravedMill(g, t, w, h) {
  g.save();
  // the sky: fine horizontal engraving lines, denser at the top
  g.strokeStyle = 'rgba(42,36,32,.35)'; g.lineWidth = 1.2; g.beginPath(); for (let y = 6; y < h * .62; y += 7 + y * .02) { g.moveTo(4, y); g.lineTo(w - 4, y); } g.stroke();
  // smoke from the chimney: rolling, drifting (alive)
  const cx = w * .3, cy = h * .14;
  for (let i = 0; i < 9; i++) { const u = ((t * .08 + i / 9) % 1), x = cx + u * w * .5, y = cy - u * h * .12 + Math.sin(u * 6 + i) * 6, r = 14 + u * 40; g.fillStyle = 'rgba(243,236,218,.92)'; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.strokeStyle = 'rgba(42,36,32,.6)'; g.lineWidth = 1.6; g.beginPath(); g.arc(x, y, r, Math.PI * .9, Math.PI * 2.1); g.stroke(); hatchBox(g, x - r, y, r * 2, r, 6, -.5, .25, 1); }
  // the mill: a long block, a chimney, rows of windows (dark), a wheel
  const mx = w * .12, my = h * .3, mw = w * .62, mh = h * .34;
  g.fillStyle = '#e8dcc0'; g.fillRect(mx, my, mw, mh); g.strokeStyle = INK; g.lineWidth = 3; g.strokeRect(mx, my, mw, mh);
  hatchBox(g, mx + mw * .72, my, mw * .28, mh, 7, -.8, .55);
  g.beginPath(); g.moveTo(mx - 8, my); g.lineTo(mx + mw / 2, my - mh * .32); g.lineTo(mx + mw + 8, my); g.closePath(); g.fillStyle = '#d8c9a8'; g.fill(); g.stroke(); hatchBox(g, mx, my - mh * .32, mw, mh * .32, 6, .7, .35, 1.2);
  g.fillStyle = '#e8dcc0'; g.fillRect(cx - 14, cy, 28, my - cy); g.strokeRect(cx - 14, cy, 28, my - cy); hatchBox(g, cx + 2, cy, 12, my - cy, 5, -1.2, .6, 1.2);
  g.fillStyle = INK; for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) g.fillRect(mx + 22 + c * (mw - 40) / 9, my + 16 + r * mh * .3, (mw - 40) / 9 * .5, mh * .17);
  const wx = mx + mw + 40, wy = my + mh * .62, wr = mh * .38, wa = t * .5;
  g.lineWidth = 3; g.beginPath(); g.arc(wx, wy, wr, 0, TAU); g.stroke(); g.beginPath(); for (let k = 0; k < 8; k++) { const a = wa + k / 8 * TAU; g.moveTo(wx, wy); g.lineTo(wx + Math.cos(a) * wr, wy + Math.sin(a) * wr); } g.stroke();
  // the ground: hatched, a road to the right
  g.fillStyle = '#e2d4b4'; g.fillRect(4, my + mh, w - 8, h - my - mh - 4); hatchBox(g, 4, my + mh, w - 8, h - my - mh - 4, 8, .15, .35, 1.4);
  // the people: a few carry the sacks away down the road (walking), many stand empty-handed by the wall
  const gy = h * .93;
  for (let i = 0; i < 3; i++) { const u = ((t * .05 + i * .23) % 1), x = w * (.62 + u * .34), st = Math.sin(t * 5 + i * 2) * 4; person(g, x, gy - u * 10, .95, { sack: true, step: st }); }
  for (let i = 0; i < 11; i++) { const x = w * (.08 + i * .045) + hash(i) * 8, sway = Math.sin(t * .8 + i) * .02; g.save(); g.translate(x, gy); g.rotate(sway); person(g, 0, 0, .82 + hash(i * 3) * .12, { empty: true }); g.restore(); }
  // the border: a double rule
  g.strokeStyle = INK; g.lineWidth = 4; g.strokeRect(2, 2, w - 4, h - 4); g.lineWidth = 1.5; g.strokeRect(10, 10, w - 20, h - 20);
  g.restore();
}
export function bookSpread(g, t, PW, PH, o = {}) {
  const gx = PW / 2, turn = clamp(o.turn || 0), pr = o.plate || [.58, .2, .36, .5];
  // the gutter shadow and the page curve shading (the paperLamp ground is already there)
  const sg = g.createLinearGradient(gx - 160, 0, gx + 160, 0); sg.addColorStop(0, 'rgba(60,40,20,0)'); sg.addColorStop(.45, 'rgba(60,40,20,.35)'); sg.addColorStop(.5, 'rgba(30,20,10,.55)'); sg.addColorStop(.55, 'rgba(60,40,20,.35)'); sg.addColorStop(1, 'rgba(60,40,20,0)');
  g.fillStyle = sg; g.fillRect(gx - 160, 0, 320, PH);
  // the page block edges (a few thin lines at the outer edges)
  g.strokeStyle = 'rgba(60,44,30,.35)'; g.lineWidth = 2; for (let k = 0; k < 5; k++) { g.beginPath(); g.moveTo(8 + k * 4, 20); g.lineTo(8 + k * 4, PH - 20); g.moveTo(PW - 8 - k * 4, 20); g.lineTo(PW - 8 - k * 4, PH - 20); g.stroke(); }
  // left page: text
  if (turn < .5) textLines(g, 130, 150, gx - 260, PH - 330, 7);
  // right page: a caption line, the plate, text under it
  const px = PW * pr[0], py = PH * pr[1], pw = PW * pr[2], ph = PH * pr[3];
  if (turn < .5) {
    textLines(g, gx + 130, 110, gx - 260, 20, 9, .6);
    g.save(); g.translate(px, py); if (o.mill) o.mill(g, pw, ph); g.restore();
    textLines(g, gx + 130, py + ph + 70, gx - 260, PH - py - ph - 160, 11);
  }
  // the turning page: the right page swings over the gutter (its width follows cos), the back is blank, it lands on the left
  if (turn > 0 && turn < 1) {
    const a = turn * Math.PI, wv = Math.cos(a) * (gx - 40), x0 = gx, x1 = gx + wv, lift = Math.sin(a);
    g.save();
    // the shadow it throws
    g.fillStyle = `rgba(30,20,12,${.35 * lift})`; g.beginPath(); g.moveTo(x0, 20); g.lineTo(x1 + 30 * lift * Math.sign(wv || 1), 40); g.lineTo(x1 + 30 * lift * Math.sign(wv || 1), PH - 10); g.lineTo(x0, PH - 20); g.fill();
    const pg = g.createLinearGradient(x0, 0, x1, 0); pg.addColorStop(0, turn < .5 ? '#d8c6a0' : '#efe4cc'); pg.addColorStop(1, turn < .5 ? '#f6eedc' : '#cdb994');
    g.fillStyle = pg; g.beginPath(); g.moveTo(x0, 14); g.quadraticCurveTo((x0 + x1) / 2, 14 - 60 * lift, x1, 30 + 30 * lift); g.lineTo(x1, PH - 10 - 30 * lift); g.quadraticCurveTo((x0 + x1) / 2, PH - 14 + 20 * lift, x0, PH - 14); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(60,44,30,.5)'; g.lineWidth = 2; g.stroke();
    g.restore();
  }
}
