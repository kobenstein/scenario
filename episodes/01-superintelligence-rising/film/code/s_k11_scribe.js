// "I'll tell you what I think. The people who invented writing never got a vote on what it would do to the world."
// An ancient scribe sits by an oil lamp pressing wedge marks into a clay tablet; every mark glows as it lands.
// On "what it would do to the world" the marks lift off the tablet and drift up and out into the dark, multiplying.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, out, ease } = L;
const { gf, curve, rr, glowE, camera, mix } = require('./s_k11_poll');

const T0 = 677.35, T1 = 683.75;
const T_LAMP = 677.62;          // "I'll": the lamp is lit
const T_LIFT = 681.96;          // "what it would do to the world"

// the tablet: a 5 x 4 grid of cells, each a little cluster of wedges; one lands per stylus tap
const TAB = { x: 905, y: 565, w: 170, h: 124, rot: -0.12 };
const MARKS = (() => {
  const r = rng(680), a = [];
  for (let row = 0; row < 4; row++) for (let col = 0; col < 5; col++) {
    const n = 1 + Math.floor(r() * 3), w = [];  // 1-3 wedges
    for (let k = 0; k < n; k++) w.push({ dx: (k - (n - 1) / 2) * 9 + (r() - 0.5) * 3, dy: (r() - 0.5) * 6, rot: r() < 0.25 ? Math.PI / 2 : r() < 0.15 ? 0.6 : 0, l: 13 + r() * 6 });
    a.push({ u: (col + 0.5) / 5, v: (row + 0.5) / 4, w });
  }
  return a;
})();
const TAP0 = 677.95, TAP = 0.2;           // one tap every 0.2 s
const markT = i => TAP0 + i * TAP;
// the flight of the marks: each mark spawns several glowing wedges that travel up and outward
const FLY = (() => {
  const r = rng(681), a = [];
  MARKS.forEach((m, i) => { for (let k = 0; k < 6; k++) a.push({ i, ang: -Math.PI / 2 + (r() - 0.5) * 2.9, d: 260 + r() * 900, d0: r() * 0.35, rot: r() * 6, s: 0.7 + r() * 1.1, wob: r() * 6, kind: Math.floor(r() * 3) }); });
  return a;
})();
const DUST = (() => { const r = rng(682); return Array.from({ length: 50 }, () => [r() * W, r() * H, r(), r()]); })();

function wedge(ctx, l, a) {          // a cuneiform wedge: triangular head with a tapering tail
  ctx.beginPath(); ctx.moveTo(-l * 0.5, -l * 0.34); ctx.quadraticCurveTo(-l * 0.38, 0, -l * 0.5, l * 0.34); ctx.lineTo(-l * 0.02, l * 0.1); ctx.lineTo(l * 0.42, l * 0.035);
  ctx.lineTo(l * 0.42, -l * 0.035); ctx.lineTo(-l * 0.02, -l * 0.1); ctx.closePath();
  ctx.fill();
}
function tabPt(u, v) {                // tablet local -> world
  const x = (u - 0.5) * TAB.w, y = (v - 0.5) * TAB.h, c = Math.cos(TAB.rot), s = Math.sin(TAB.rot);
  return [TAB.x + x * c - y * s, TAB.y + x * s + y * c];
}

function scribe(ctx, t, lamp) {
  const br = Math.sin(t * 1.5);
  const i = Math.floor((t - TAP0) / TAP), ph = ((t - TAP0) / TAP) % 1;
  const working = t > TAP0 - 0.3 && t < T_LIFT + 0.2;
  // stylus press: quick in, slow lift
  const press = working && i >= 0 && i < MARKS.length ? (ph < 0.3 ? out(ph / 0.3) : 1 - sm((ph - 0.3) / 0.7)) : 0;
  const cur = MARKS[clamp(i, 0, MARKS.length - 1)], tp = tabPt(cur.u, cur.v);
  const look = ramp(t, T_LIFT, T_LIFT + 0.9);     // he lifts his head to watch the marks rise
  // stool
  gf(ctx, c => { rr(c, 560, 690, 190, 34, 8); c.rect(578, 720, 18, 140); c.rect(712, 720, 18, 140); }, lin(ctx, 560, 690, 750, 860, [[0, '#4a2a1e'], [1, '#160c0c']]), 0.5);
  ctx.save(); ctx.translate(0, br * 1.2);
  // far arm holding the tablet from below
  gf(ctx, c => { c.moveTo(735, 420); c.quadraticCurveTo(800, 520, 860, 600); c.lineTo(900, 618); c.lineTo(895, 640); c.lineTo(845, 628); c.quadraticCurveTo(770, 560, 712, 450); c.closePath(); }, lin(ctx, 735, 420, 900, 630, [[0, '#7a3b17'], [1, '#3a1608']]), 0.5);
  // robe: back, seat, lap over the knees, falling to the ankles
  const robe = c => { c.moveTo(700, 372); c.bezierCurveTo(640, 400, 610, 520, 600, 640); c.quadraticCurveTo(596, 700, 640, 708);
    c.lineTo(860, 700); c.quadraticCurveTo(905, 698, 912, 730); c.bezierCurveTo(918, 790, 925, 830, 940, 868); c.lineTo(838, 872);
    c.bezierCurveTo(836, 820, 832, 760, 800, 742); c.lineTo(660, 742); c.bezierCurveTo(700, 640, 760, 520, 790, 430); c.quadraticCurveTo(770, 380, 700, 372); c.closePath(); };
  ctx.save(); ctx.translate(4, -3); gf(ctx, robe, rgba('#ffc888', 0.55 * lamp), 0); ctx.restore();   // lamp rim on the front
  gf(ctx, robe, lin(ctx, 900, 400, 600, 860, [[0, mix('#5a3a5a', '#e8964c', lamp)], [0.45, mix('#2a1f48', '#9a4a1c', lamp)], [1, '#1a0c10']]), 0.45);
  // folds in the robe
  ctx.strokeStyle = 'rgba(40,14,8,0.5)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  for (const p of [[[700, 460], [680, 560], [672, 680]], [[760, 712], [820, 706], [880, 712]], [[880, 740], [890, 800], [900, 860]], [[640, 500], [630, 580], [632, 650]]]) { ctx.beginPath(); curve(ctx, p); ctx.stroke(); }
  // sash
  gf(ctx, c => { c.moveTo(640, 600); c.quadraticCurveTo(700, 615, 760, 590); c.lineTo(752, 618); c.quadraticCurveTo(700, 640, 636, 628); c.closePath(); }, lin(ctx, 640, 600, 760, 620, [[0, '#3a3a7a'], [1, '#1a1a40']]), 0.4);
  // feet
  gf(ctx, c => { c.ellipse(912, 872, 42, 12, 0, 0, Math.PI * 2); }, '#5a2a12', 0.4);
  // head: bowed over the work, then lifting to watch the marks rise; hair bound in a cloth
  ctx.save(); ctx.translate(745, 362); ctx.rotate(0.38 - 0.55 * ease(look) + 0.03 * Math.sin(t * 0.8) + press * 0.025);
  gf(ctx, c => { c.moveTo(-22, 20); c.lineTo(-14, -30); c.lineTo(20, -28); c.lineTo(24, 24); c.closePath(); }, '#7a3b17', 0.4);   // neck
  const head = c => { c.moveTo(-40, -50); c.bezierCurveTo(-46, -100, -10, -126, 22, -116); c.bezierCurveTo(52, -106, 64, -78, 60, -50); c.lineTo(66, -36); c.lineTo(58, -30);
    c.bezierCurveTo(60, -10, 44, 2, 22, -2); c.bezierCurveTo(-4, -4, -36, -20, -40, -50); c.closePath(); };
  ctx.save(); ctx.translate(4, -2); gf(ctx, head, rgba('#ffd59a', 0.85 * lamp), 0); ctx.restore();
  gf(ctx, head, lin(ctx, 60, -110, -40, -10, [[0, mix('#5a3a5a', '#e8964c', lamp)], [0.6, mix('#2a1f48', '#9a4a1c', lamp)], [1, '#2e140a']]), 0.45);
  // head cloth and the knot at the back
  gf(ctx, c => { c.moveTo(-44, -52); c.bezierCurveTo(-50, -104, -10, -132, 26, -120); c.bezierCurveTo(48, -112, 58, -96, 56, -84); c.quadraticCurveTo(10, -92, -30, -40); c.closePath();
    c.moveTo(-40, -60); c.quadraticCurveTo(-66, -50, -70, -18); c.quadraticCurveTo(-52, -30, -34, -42); c.closePath(); }, lin(ctx, -40, -120, 40, -40, [[0, '#d8c8a8'], [1, '#6a5a6a']]), 0.45);
  ctx.restore();
  // near arm with the stylus: shoulder, elbow, hand on the tablet
  const hx = tp[0] + 18 - press * 6, hy = tp[1] - 30 + press * 14;
  const sh = [748, 440], el = [790, 590];
  gf(ctx, c => { c.moveTo(sh[0] - 30, sh[1] - 20); c.quadraticCurveTo(sh[0] + 40, sh[1] + 10, el[0] + 22, el[1] - 6); c.lineTo(hx + 10, hy + 6); c.lineTo(hx - 4, hy + 24); c.lineTo(el[0] - 18, el[1] + 18); c.quadraticCurveTo(sh[0] - 30, sh[1] + 60, sh[0] - 30, sh[1] - 20); c.closePath(); },
    lin(ctx, sh[0], sh[1], hx, hy, [[0, mix('#3a2a50', '#d07a38', lamp)], [1, mix('#2a1a30', '#9a4a1c', lamp)]]), 0.45);
  // hand and stylus
  gf(ctx, c => c.ellipse(hx, hy + 10, 18, 13, -0.5, 0, Math.PI * 2), mix('#3a2030', '#c9702e', lamp), 0.35);
  ctx.strokeStyle = mix('#3a2a20', '#d8b070', lamp); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(hx + 22, hy - 26); ctx.lineTo(tp[0] + 2, tp[1] - 2 + press * 3); ctx.stroke();
  ctx.restore();
}

function tablet(ctx, t, lamp) {
  ctx.save(); ctx.translate(TAB.x, TAB.y); ctx.rotate(TAB.rot);
  // the clay: a soft pillow shape with a thick lower edge
  gf(ctx, c => rr(c, -TAB.w / 2 - 4, -TAB.h / 2 + 4, TAB.w + 8, TAB.h + 12, 16), '#4a2410', 0.5);
  gf(ctx, c => rr(c, -TAB.w / 2, -TAB.h / 2, TAB.w, TAB.h, 16), lin(ctx, -TAB.w / 2, -TAB.h / 2, TAB.w / 2, TAB.h / 2, [[0, mix('#5a4a5a', '#e0a070', lamp)], [1, mix('#2a2038', '#9a5a2e', lamp)]]), 0.5);
  // ruled lines pressed in the clay
  ctx.strokeStyle = 'rgba(70,30,12,0.45)'; ctx.lineWidth = 1.5;
  for (let r = 1; r < 4; r++) { ctx.beginPath(); ctx.moveTo(-TAB.w / 2 + 10, -TAB.h / 2 + r * TAB.h / 4); ctx.lineTo(TAB.w / 2 - 10, -TAB.h / 2 + r * TAB.h / 4); ctx.stroke(); }
  ctx.restore();
  // the marks: each glows hot when pressed, then settles to a warm ember
  MARKS.forEach((m, i) => {
    const tm = markT(i); if (t < tm) return;
    const age = t - tm, heat = Math.exp(-age * 2.2), lift = ramp(t, T_LIFT + i * 0.02, T_LIFT + 0.6 + i * 0.02);
    const p = tabPt(m.u, m.v);
    ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(TAB.rot);
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = rgba('#ffd08a', 0.55 + 0.45 * heat - 0.25 * lift);
    for (const w of m.w) { ctx.save(); ctx.translate(w.dx, w.dy); ctx.rotate(w.rot); wedge(ctx, w.l, 0); ctx.restore(); }
    ctx.restore();
    light(ctx, p[0], p[1], 30 + 30 * heat, C.amber, 0.25 + 0.6 * heat);
  });
}

function draw(ctx, t) {
  const lamp = ramp(t, T_LAMP, T_LAMP + 0.5) * (0.88 + 0.12 * Math.sin(t * 11) * Math.sin(t * 4.3));
  const flare = Math.exp(-Math.max(0, t - T_LAMP) * 3) * (t > T_LAMP ? 1 : 0);
  const lift = ramp(t, T_LIFT, T1);
  // camera: drifts toward the tablet, then tilts up after the rising marks
  const z = lerp(1.0, 1.14, sm((t - T0) / (T_LIFT - T0))) + 0.06 * lift;
  const ty = lerp(0, 120, ease(lift));
  ctx.save(); ctx.translate(0, ty);
  const layer = camera(ctx, t, 900, 560, z, 21);
  // wall: mud brick in the lamp glow
  layer(0.3, () => {
    gf(ctx, c => c.rect(-300, -500, W + 600, 1500), lin(ctx, 0, -500, 0, 900, [[0, '#07081a'], [0.6, '#16123a'], [1, '#221a40']]), 0.55);
    ctx.strokeStyle = rgba('#0a0818', 0.5); ctx.lineWidth = 2;
    for (let r = 0; r < 14; r++) { const y = 120 + r * 52; ctx.beginPath(); ctx.moveTo(-300, y); ctx.lineTo(W + 300, y); ctx.stroke();
      for (let k = 0; k < 22; k++) { const x = -300 + k * 120 + (r % 2) * 60; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 52); ctx.stroke(); } }
    // a niche with stacked tablets and a jar
    gf(ctx, c => { c.moveTo(1380, 520); c.lineTo(1380, 330); c.quadraticCurveTo(1490, 250, 1600, 330); c.lineTo(1600, 520); c.closePath(); }, '#0e0a22', 0.5);
    for (let k = 0; k < 4; k++) gf(ctx, c => rr(c, 1400 + (k % 2) * 6, 492 - k * 26, 110, 24, 8), mix('#2a1a2a', '#6a3a1e', lamp * 0.6), 0.5);
    gf(ctx, c => { c.moveTo(1540, 520); c.bezierCurveTo(1510, 470, 1525, 420, 1555, 410); c.lineTo(1565, 392); c.lineTo(1580, 392); c.lineTo(1585, 410); c.bezierCurveTo(1615, 420, 1625, 470, 1595, 520); c.closePath(); }, mix('#1a1230', '#5a2a12', lamp * 0.7), 0.5);
    light(ctx, 1130, 560, 900, C.amber, 0.22 * lamp + 0.2 * flare);
  });
  // floor with a reed mat
  layer(0.6, () => {
    gf(ctx, c => c.rect(-300, 860, W + 600, 600), lin(ctx, 0, 860, 0, 1300, [[0, mix('#1a1436', '#3a2230', lamp * 0.7)], [1, '#08061a']]), 0.55);
    gf(ctx, c => { c.moveTo(480, 870); c.lineTo(1300, 870); c.lineTo(1380, 960); c.lineTo(420, 960); c.closePath(); }, lin(ctx, 0, 870, 0, 960, [[0, mix('#2a2238', '#7a5a3a', lamp * 0.6)], [1, '#1a1220']]), 0.5);
    ctx.strokeStyle = 'rgba(20,10,10,0.35)'; ctx.lineWidth = 2; for (let k = 0; k < 20; k++) { const x = 500 + k * 42; ctx.beginPath(); ctx.moveTo(x, 870); ctx.lineTo(x - 40 + k * 0.5, 960); ctx.stroke(); }
    glowE(ctx, 1130, 880, 420, 60, [[0, rgba(C.amber, 0.25 * lamp)], [1, rgba(C.amber, 0)]], true);
  });
  // the scribe, the tablet, the lamp
  layer(0.8, () => {
    scribe(ctx, t, Math.max(0.15, lamp));
    tablet(ctx, t, Math.max(0.15, lamp));
    // lamp on a low stand: a clay slipper lamp with a flame
    gf(ctx, c => { rr(c, 1060, 760, 150, 22, 6); c.rect(1080, 780, 14, 90); c.rect(1176, 780, 14, 90); }, lin(ctx, 0, 760, 0, 870, [[0, '#3a2018'], [1, '#120808']]), 0.5);
    gf(ctx, c => { c.moveTo(1090, 760); c.bezierCurveTo(1090, 730, 1150, 722, 1170, 738); c.lineTo(1196, 738); c.quadraticCurveTo(1206, 746, 1196, 752); c.lineTo(1170, 756); c.quadraticCurveTo(1160, 762, 1090, 760); c.closePath(); },
      lin(ctx, 1090, 730, 1200, 760, [[0, '#c9702e'], [1, '#5a2a12']]), 0.45);
    if (t > T_LAMP - 0.05) {
      const fl = 1 + 0.12 * Math.sin(t * 17) + 0.08 * Math.sin(t * 29), sway = 0.12 * Math.sin(t * 5.3);
      ctx.save(); ctx.translate(1198, 738); ctx.rotate(sway); ctx.scale(lamp * fl + 0.3 * flare, lamp * fl + 0.3 * flare);
      ctx.fillStyle = lin(ctx, 0, -40, 0, 0, [[0, 'rgba(255,240,200,0)'], [0.3, '#ffe0a0'], [1, '#ff9a3c']]);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(-12, -6, -10, -24, 0, -40); ctx.bezierCurveTo(10, -24, 12, -6, 0, 0); ctx.fill();
      ctx.fillStyle = '#fff4dc'; ctx.beginPath(); ctx.ellipse(0, -9, 4, 8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      light(ctx, 1198, 720, 120, '#ffd9a0', 0.75 * lamp + 0.4 * flare);
      light(ctx, 1198, 720, 420, C.amber, 0.28 * lamp + 0.3 * flare);
    }
    // dust in the lamp light
    for (const [x, y, k, s] of DUST) { const yy = (y - (t - T0) * (8 + 14 * k)) % H, xx = x + Math.sin(t * 0.6 + s * 9) * 20; const d = Math.hypot(xx - 1150, yy - 650); const a = 0.35 * lamp * Math.max(0, 1 - d / 650); if (a > 0.01) { ctx.fillStyle = rgba('#ffd9a0', a); ctx.fillRect(xx, yy < 0 ? yy + H : yy, 2, 2); } }
  });
  ctx.restore();
  // the marks rise off the tablet into the dark, multiplying as they spread (screen space, so they fly past the camera tilt)
  if (lift > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const f of FLY) {
      const m = MARKS[f.i], p0w = tabPt(m.u, m.v);
      const k = ease(clamp((t - T_LIFT - f.d0 - f.i * 0.02) / 1.5)); if (k <= 0) continue;
      // start where the mark sits on screen (approximation of the camera transform)
      const zz = lerp(1.0, 1.14, 1) + 0.06 * lift, x0 = 900 + (p0w[0] - 900) * zz, y0 = 560 + (p0w[1] - 560) * zz + lerp(0, 120, ease(lift));
      const x = x0 + Math.cos(f.ang) * f.d * k + Math.sin(t * 1.2 + f.wob) * 10 * k, y = y0 + Math.sin(f.ang) * f.d * k * 0.75 - 140 * k;
      const s = f.s * (1 + 0.6 * k), a = (0.9 - 0.3 * k) * (0.85 + 0.15 * Math.sin(t * 3 + f.wob));
      ctx.save(); ctx.translate(x, y); ctx.rotate(f.rot * k * 0.3 + (f.kind === 1 ? Math.PI / 2 : 0)); ctx.scale(s, s);
      ctx.fillStyle = rgba('#ffd08a', a); wedge(ctx, 18, 0); ctx.restore();
      light(ctx, x, y, 26 * s, C.amber, 0.35 * a);
    }
    ctx.restore();
  }
}

module.exports = { T0, T1, draw };
