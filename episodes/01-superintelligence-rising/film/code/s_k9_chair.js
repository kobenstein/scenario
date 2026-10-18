// "Not everyone thinks this is urgent."
// A quiet room at night. A man in an armchair under a warm floor lamp leans back, laces a hand behind his head,
// feet up on an ottoman, and lifts his tea. The wall clock's second hand sweeps slowly. No hurry at all.
const L = require('./lib');
const { W, H, C, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, cone, out, clamp } = L;
const { gf, rr, cap, ik2, cached } = require('./s_k9_kit');

const T0 = 551.5, T1 = 555.1;
const LAMP = { x: 1500, y: 300 };

function roomArt(c) {
  // wall: deep indigo, wainscot below
  gf(c, cc => cc.rect(-200, -200, W + 400, 960), lin(c, 0, -200, 0, 760, [[0, '#0a0b24'], [0.7, '#17163c'], [1, '#1d1946']]), 0.55);
  gf(c, cc => cc.rect(-200, 560, W + 400, 200), lin(c, 0, 560, 0, 760, [[0, '#191538'], [1, '#110f2c']]), 0.55);
  c.fillStyle = 'rgba(164,159,196,0.12)'; c.fillRect(-200, 556, W + 400, 5);
  for (let x = -160; x < W + 200; x += 180) { c.fillStyle = 'rgba(5,6,18,0.35)'; c.fillRect(x, 590, 130, 140); c.fillStyle = 'rgba(164,159,196,0.05)'; c.fillRect(x, 590, 130, 3); }
  // window on the left: night city far away
  const wx = 150, wy = 140, ww = 420, wh = 400;
  gf(c, cc => cc.rect(wx - 20, wy - 20, ww + 40, wh + 40), '#0c0b22', 0.4);
  gf(c, cc => cc.rect(wx, wy, ww, wh), lin(c, 0, wy, 0, wy + wh, [[0, '#0d1236'], [0.7, '#2b2660'], [1, '#463a7c']]), 0.4);
  const r = rng(91); let x = wx;
  while (x < wx + ww) { const w = 18 + r() * 40, h = 40 + r() * 150; c.fillStyle = '#141236'; c.fillRect(x, wy + wh - h, w, h);
    for (let k = 0; k < 4; k++) if (r() < 0.5) { c.fillStyle = rgba(r() < 0.2 ? C.cyan : C.amber, 0.3 + r() * 0.3); c.fillRect(x + 4 + r() * (w - 10), wy + wh - h + 8 + r() * (h - 16), 4, 6); }
    x += w + 3; }
  c.fillStyle = '#0c0b22'; c.fillRect(wx + ww / 2 - 6, wy, 12, wh); c.fillRect(wx, wy + wh / 2 - 6, ww, 12);
  gf(c, cc => cc.rect(wx - 34, wy + wh + 14, ww + 68, 18), '#221d4c', 0.4);
  // curtains
  for (const [cx, d] of [[wx - 40, -1], [wx + ww + 40, 1]]) gf(c, cc => { cc.moveTo(cx - 40 * d, wy - 50); cc.lineTo(cx + 34 * d, wy - 50); cc.bezierCurveTo(cx + 20 * d, wy + 200, cx + 50 * d, wy + 420, cx + 40 * d, 760); cc.lineTo(cx - 50 * d, 760); cc.closePath(); }, lin(c, cx - 40, 0, cx + 40, 0, [[0, '#2a2058'], [1, '#141034']]), 0.55);
  // bookshelf behind the chair, right
  gf(c, cc => cc.rect(1640, 120, 300, 640), '#100e28', 0.5);
  for (let sy = 170; sy < 740; sy += 120) { c.fillStyle = '#1e1a44'; c.fillRect(1640, sy + 92, 300, 10); let bx = 1656; const rb = rng(sy);
    while (bx < 1920) { const bw = 12 + rb() * 22, bh = 50 + rb() * 40; c.fillStyle = ['#2a2258', '#3a2a5a', '#5a3a2a', '#1c1a40'][Math.floor(rb() * 4)]; c.fillRect(bx, sy + 92 - bh, bw, bh); bx += bw + 3; } }
  // rug and floor
  gf(c, cc => cc.rect(-200, 760, W + 400, 600), lin(c, 0, 760, 0, H + 200, [[0, '#211b48'], [1, '#0b0a20']]), 0.6);
  gf(c, cc => cc.ellipse(1000, 900, 760, 120, 0, 0, 7), lin(c, 0, 780, 0, 1020, [[0, '#4a2a3a'], [1, '#2a1630']]), 0.55);
  c.strokeStyle = 'rgba(255,179,92,0.12)'; c.lineWidth = 3; c.beginPath(); c.ellipse(1000, 900, 700, 100, 0, 0, 7); c.stroke();
  // side table with books
  gf(c, cc => { rr(cc, 1430, 690, 130, 14, 4); cc.rect(1440, 704, 10, 120); cc.rect(1540, 704, 10, 120); }, '#2a1a14', 0.4);
  gf(c, cc => { cc.rect(1446, 664, 96, 13); cc.rect(1452, 677, 88, 13); }, lin(c, 1446, 0, 1542, 0, [[0, '#7a3b17'], [1, '#3a2a5a']]), 0.4);
}

function clock(ctx, t) {
  const x = 820, y = 260, R = 92;
  gf(ctx, c => c.arc(x, y, R + 12, 0, 7), lin(ctx, x - R, y - R, x + R, y + R, [[0, '#6a3a1a'], [1, '#2a140a']]), 0.4);
  gf(ctx, c => c.arc(x, y, R, 0, 7), rad(ctx, x - 20, y - 30, 10, R, [[0, '#f3efe2'], [1, '#bfb4a0']]), 0.3);
  ctx.save(); ctx.translate(x, y);
  for (let k = 0; k < 12; k++) { ctx.save(); ctx.rotate(k * Math.PI / 6); ctx.fillStyle = '#3a2a3a'; ctx.fillRect(-2, -R + 8, 4, k % 3 ? 10 : 18); ctx.restore(); }
  const hand = (a, len, wd, col) => { ctx.save(); ctx.rotate(a); ctx.fillStyle = col; ctx.beginPath(); rr(ctx, -wd / 2, -len, wd, len + 12, wd / 2); ctx.fill(); ctx.restore(); };
  hand(Math.PI * 2 * 10.3 / 12, R * 0.5, 8, '#2a1a2a');
  hand(Math.PI * 2 * 0.22 + t * 0.002, R * 0.75, 6, '#2a1a2a');
  // the second hand: one slow tick per second, eased
  const sec = Math.floor(t) + sm((t % 1) / 0.25);
  hand(Math.PI * 2 * sec / 60 + 1.3, R * 0.82, 2.5, '#c9702e');
  ctx.fillStyle = '#c9702e'; ctx.beginPath(); ctx.arc(0, 0, 6, 0, 7); ctx.fill();
  ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, R, 0, 7); ctx.clip(); light(ctx, x + 60, y + 40, 160, C.amber, 0.16); ctx.restore();
}

function lamp(ctx, t, glow) {
  gf(ctx, c => { c.rect(LAMP.x - 5, LAMP.y + 40, 10, 760 - LAMP.y - 40); }, lin(ctx, LAMP.x - 5, 0, LAMP.x + 5, 0, [[0, '#5a3a2a'], [1, '#1c1210']]), 0.3);
  gf(ctx, c => c.ellipse(LAMP.x, 765, 52, 10, 0, 0, 7), '#1c1210', 0.3);
  cone(ctx, LAMP.x, LAMP.y + 60, 150, 900, 520, C.amber, 0.13 * glow);
  gf(ctx, c => { c.moveTo(LAMP.x - 46, LAMP.y - 24); c.lineTo(LAMP.x + 46, LAMP.y - 24); c.lineTo(LAMP.x + 82, LAMP.y + 60); c.lineTo(LAMP.x - 82, LAMP.y + 60); c.closePath(); },
    lin(ctx, 0, LAMP.y - 24, 0, LAMP.y + 60, [[0, '#ffcf8c'], [1, '#e48a3c']]), 0.35);
  ctx.fillStyle = '#fff1cf'; ctx.beginPath(); ctx.ellipse(LAMP.x, LAMP.y + 60, 82, 9, 0, 0, 7); ctx.fill();
  light(ctx, LAMP.x, LAMP.y + 40, 520, C.amber, 0.30 * glow);
  light(ctx, LAMP.x, LAMP.y + 60, 120, '#fff1cf', 0.5 * glow);
}

// the armchair, seen in profile, facing left
function chairBack(ctx) {
  gf(ctx, c => { c.moveTo(1200, 760); c.lineTo(1215, 520); c.bezierCurveTo(1220, 400, 1270, 360, 1330, 380); c.bezierCurveTo(1380, 400, 1385, 470, 1360, 560); c.lineTo(1330, 760); c.closePath(); },
    lin(ctx, 1200, 380, 1380, 760, [[0, '#4a3a86'], [0.5, '#2a2260'], [1, '#14112f']]), 0.5);
  gf(ctx, c => { rr(c, 960, 640, 400, 100, 30); }, lin(ctx, 0, 640, 0, 740, [[0, '#3c3078'], [1, '#18143a']]), 0.5);
  gf(ctx, c => { c.rect(985, 735, 14, 40); c.rect(1310, 735, 14, 40); }, '#0e0a1c', 0);
}
function chairArm(ctx) {
  gf(ctx, c => { c.moveTo(990, 760); c.lineTo(980, 640); c.bezierCurveTo(978, 600, 1010, 586, 1040, 590); c.lineTo(1250, 600); c.bezierCurveTo(1280, 602, 1290, 625, 1288, 650); c.lineTo(1280, 760); c.closePath(); },
    lin(ctx, 980, 590, 1290, 760, [[0, '#5a4a9a'], [0.35, '#342a70'], [1, '#16123a']]), 0.5);
  ctx.strokeStyle = rgba(C.amber, 0.25); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(1040, 592); ctx.lineTo(1250, 602); ctx.stroke();
}

function man(ctx, t, pass) {
  const br = Math.sin(t * 1.5);
  const back = out((t - 552.5) / 1.1);                     // leans back on "Not everyone"
  const handUp = sm((t - 552.75) / 0.9);                   // hand goes behind the head
  const sip = sm((t - 554.0) / 0.6);                        // lifts the tea on "urgent"
  const hip = [1185, 668];
  const sa = lerp(-1.32, -1.08, back);                      // spine angle from the hip
  const SL = 175, sh = [hip[0] + Math.cos(sa) * SL, hip[1] + Math.sin(sa) * SL + br * 1.5];
  const hd = [sh[0] + Math.cos(sa - 0.15) * 70, sh[1] + Math.sin(sa - 0.15) * 70];
  const pal = ['#ffb35c', '#c36a2b', '#5a2a12'];
  if (pass === 'far') {
    // far arm, hand behind the head (mostly hidden)
    const tgt = [lerp(hip[0] - 40, hd[0] + 26, handUp), lerp(hip[1] - 30, hd[1] - 4, handUp)];
    const el = ik2(sh[0] - 6, sh[1] + 6, tgt[0], tgt[1], 82, 78, handUp > 0.3 ? -1 : 1);
    gf(ctx, c => { cap(c, sh[0] - 6, sh[1] + 6, el[0], el[1], 17, 14); cap(c, el[0], el[1], tgt[0], tgt[1], 14, 11); }, pal[2], 0.3);
    return;
  }
  if (pass !== 'arm') {
  // legs: thighs on the cushion, stretched out to the ottoman, ankles crossed
  const knee = [990, 640 + br * 0.3], ank = [790, 676], ank2 = [770, 668];
  gf(ctx, c => { cap(c, hip[0], hip[1] - 4, knee[0], knee[1] - 4, 30, 22); cap(c, knee[0], knee[1] - 4, ank2[0], ank2[1], 21, 13); }, '#4a2210', 0.35);
  gf(ctx, c => { c.save(); c.translate(ank2[0], ank2[1]); c.rotate(-1.75); c.moveTo(-12, -6); c.lineTo(36, -10); c.quadraticCurveTo(46, 0, 36, 12); c.lineTo(-12, 12); c.closePath(); c.restore(); }, '#1c0c06', 0);
  gf(ctx, c => { cap(c, hip[0], hip[1] + 10, knee[0] + 6, knee[1] + 14, 32, 23); cap(c, knee[0] + 6, knee[1] + 14, ank[0], ank[1], 22, 13); },
    lin(ctx, 0, 620, 0, 700, [[0, '#9a4c1c'], [1, '#5a2a12']]), 0.4);
  gf(ctx, c => { c.save(); c.translate(ank[0], ank[1]); c.rotate(-1.62); c.moveTo(-12, -7); c.lineTo(38, -10); c.quadraticCurveTo(50, 0, 38, 13); c.lineTo(-12, 13); c.closePath(); c.restore(); }, '#2a140a', 0);
  // torso: knit sweater, reclined
  const n = [Math.cos(sa + Math.PI / 2), Math.sin(sa + Math.PI / 2)];
  gf(ctx, c => {
    c.moveTo(hip[0] + n[0] * 44, hip[1] + n[1] * 44 + 10);
    c.bezierCurveTo(hip[0] - 60, hip[1] - 10, sh[0] - 52, sh[1] + 40, sh[0] - 34, sh[1] - 6);      // belly / chest
    c.quadraticCurveTo(sh[0] - 14, sh[1] - 30, sh[0] + 20, sh[1] - 24);
    c.quadraticCurveTo(sh[0] + 48, sh[1] - 4, sh[0] + 44, sh[1] + 40);                                 // shoulder, back
    c.bezierCurveTo(sh[0] + 40, sh[1] + 100, hip[0] + 50, hip[1] - 40, hip[0] + 40, hip[1] + 12);
    c.closePath(); }, lin(ctx, sh[0] - 60, sh[1] - 30, hip[0] + 50, hip[1] + 20, [[0, '#ffc488'], [0.45, '#d27a34'], [1, '#6a3214']]), 0.4);
  ctx.strokeStyle = 'rgba(90,42,18,0.4)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(hip[0] - 50 + k * 8, hip[1] - 8 - k * 4); ctx.quadraticCurveTo(hip[0] - 20, hip[1] + 4, hip[0] + 30, hip[1] - 2 - k * 6); ctx.stroke(); }
  // head: profile, faceless, hair; tilts back a little
  ctx.save(); ctx.translate(hd[0], hd[1]); ctx.rotate(sa + Math.PI / 2 - 0.15 + 0.05 * Math.sin(t * 0.7));
  gf(ctx, c => cap(c, 4, 44, 2, 6, 15, 14), '#b0602a', 0);
  const head = c => { c.moveTo(-34, -8); c.bezierCurveTo(-38, -46, -10, -62, 12, -58); c.bezierCurveTo(36, -54, 44, -30, 40, -6); c.bezierCurveTo(38, 14, 30, 30, 16, 32);
    c.lineTo(-20, 34); c.bezierCurveTo(-30, 30, -34, 20, -36, 10); c.lineTo(-42, 2); c.closePath(); };
  gf(ctx, head, lin(ctx, -40, -40, 40, 30, [[0, '#ffd29a'], [0.6, '#e0904a'], [1, '#7a3b17']]), 0.35, [-60, -80, 120, 130]);
  gf(ctx, c => { c.moveTo(-26, -30); c.bezierCurveTo(-24, -60, 10, -70, 30, -50); c.bezierCurveTo(46, -34, 46, 0, 36, 18); c.bezierCurveTo(28, 4, 22, -10, 18, -20); c.bezierCurveTo(4, -28, -14, -26, -26, -30); c.closePath(); },
    lin(ctx, -26, -60, 40, 20, [[0, '#5a2a12'], [1, '#1c0a05']]), 0.4, [-60, -80, 120, 130]);
  gf(ctx, c => c.ellipse(14, -4, 6, 10, 0.2, 0, 7), '#c36a2b', 0);
  ctx.restore();
  }
  // near arm: elbow on the armrest, mug in hand; lifts on "urgent"
  const elb = [1130, 600], mug = [lerp(1040, 1100, sip), lerp(590, 496, sip) + br];
  gf(ctx, c => { cap(c, sh[0] + 6, sh[1] + 12, elb[0], elb[1], 20, 16); cap(c, elb[0], elb[1], mug[0] + 30, mug[1] + 10, 16, 12); }, lin(ctx, sh[0], sh[1], elb[0], elb[1], [[0, '#ffb35c'], [1, '#b0602a']]), 0.4);
  gf(ctx, c => { rr(c, mug[0] - 26, mug[1] - 36, 44, 52, 6); }, lin(ctx, mug[0] - 26, 0, mug[0] + 18, 0, [[0, '#e9e1cf'], [1, '#9a9086']]), 0.3);
  ctx.strokeStyle = '#9a9086'; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(mug[0] - 30, mug[1] - 12, 12, Math.PI * 0.5, Math.PI * 1.5); ctx.stroke();
  gf(ctx, c => c.ellipse(mug[0] + 20, mug[1] - 4, 14, 18, 0, 0, 7), '#e0904a', 0);
  for (let k = 0; k < 3; k++) {
    const ph = (t * 0.4 + k / 3) % 1; ctx.strokeStyle = rgba(C.cream, 0.18 * Math.sin(ph * Math.PI)); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(mug[0] - 14 + k * 10, mug[1] - 40);
    for (let s = 1; s <= 8; s++) ctx.lineTo(mug[0] - 14 + k * 10 + Math.sin(s * 0.8 + t * 2 + k) * 6, mug[1] - 40 - s * 8 - ph * 26); ctx.stroke();
  }
}

const DUST = (() => { const r = rng(17); return Array.from({ length: 34 }, () => [r(), r(), r()]); })();

function draw(ctx, t) {
  const z = lerp(1.2, 1.3, sm((t - T0) / (T1 - T0)));
  const dx = drift(t, 1, 3) * 6, dy = drift(t, 1, 5) * 4;
  const glow = 0.95 + 0.04 * Math.sin(t * 1.3) + 0.02 * Math.sin(t * 4.1);
  const layer = (par, fn) => { ctx.save(); ctx.translate(1180, 560); ctx.scale(z, z); ctx.translate(-1180 + dx * par, -560 + dy * par); fn(); ctx.restore(); };
  layer(0.4, () => { cached(ctx, 'k9room', -200, -200, W + 200, H + 200, roomArt); clock(ctx, t); });
  layer(0.8, () => {
    lamp(ctx, t, glow);
    // ottoman
    gf(ctx, c => rr(c, 700, 680, 210, 90, 22), lin(ctx, 0, 680, 0, 770, [[0, '#4a3a86'], [1, '#1a1640']]), 0.5);
    gf(ctx, c => { c.rect(718, 765, 12, 30); c.rect(878, 765, 12, 30); }, '#0e0a1c', 0);
    chairBack(ctx);
    man(ctx, t, 'far');
    man(ctx, t);
    chairArm(ctx);
    // the near arm rests on top of the armrest: redraw it over the arm
    ctx.save(); ctx.beginPath(); ctx.rect(960, 380, 330, 222); ctx.clip(); man(ctx, t, 'arm'); ctx.restore();
    // lamp light over the man's shoulder
    light(ctx, 1260, 480, 380, C.amber, 0.12 * glow);
    for (const [a, b, c] of DUST) {
      const ph = (b + t * (0.02 + c * 0.03)) % 1, x = LAMP.x - 300 + a * 600 + Math.sin(t * 0.5 + a * 7) * 14, y = LAMP.y + 80 + ph * 420;
      ctx.fillStyle = rgba('#ffe2a8', 0.35 * Math.sin(ph * Math.PI) * (1 - Math.abs(a - 0.5))); ctx.beginPath(); ctx.arc(x, y, 1.2 + c * 1.6, 0, 7); ctx.fill();
    }
  });
}

module.exports = { T0, T1, draw };
