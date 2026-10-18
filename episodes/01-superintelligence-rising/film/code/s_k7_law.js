// "Then there's the law. California makes labs report serious incidents."
// The camera tilts down out of the night sky onto a domed state capitol between palms. A small cyan lab sits across
// the plaza; a sealed report lifts from it and arcs into the capitol, whose windows answer with light.
const L = require('./lib');
const K = require('./s_k7_kit');
const { W, H, C, sm, ramp, lerp, rng, lin, rad, rgba, light, cone, out, clamp, ease } = L;
const { gf, cached, rr } = K;

const T0 = 454.45, T1 = 460.20;
const GROUND = 860, CX = 1180, REP = [457.9, 459.1];

function capitolArt(c) {
  const g = (x0, y0, x1, y1) => lin(c, x0, y0, x1, y1, [[0, '#4a3a78'], [0.6, '#2c2458'], [1, '#17133a']]);
  // wings
  gf(c, cc => cc.rect(CX - 470, GROUND - 210, 940, 210), g(CX - 470, GROUND - 210, CX + 470, GROUND), 0.5);
  gf(c, cc => cc.rect(CX - 490, GROUND - 226, 980, 18), '#5a4a8a', 0.4);
  // portico: pediment and columns
  gf(c, cc => { cc.moveTo(CX - 170, GROUND - 300); cc.lineTo(CX, GROUND - 370); cc.lineTo(CX + 170, GROUND - 300); cc.closePath(); }, '#5a4a8a', 0.4);
  gf(c, cc => cc.rect(CX - 180, GROUND - 304, 360, 20), '#4a3a78', 0.4);
  for (let i = 0; i < 6; i++) gf(c, cc => cc.rect(CX - 150 + i * 56, GROUND - 284, 20, 284), lin(c, 0, GROUND - 284, 0, GROUND, [[0, '#6a5a9a'], [1, '#2a2252']]), 0.4);
  // drum, dome, lantern
  gf(c, cc => cc.rect(CX - 150, GROUND - 470, 300, 110), g(CX - 150, GROUND - 470, CX + 150, GROUND - 360), 0.5);
  for (let i = 0; i < 8; i++) gf(c, cc => cc.rect(CX - 136 + i * 36, GROUND - 462, 10, 96), '#5a4a8a', 0.3);
  gf(c, cc => { cc.moveTo(CX - 160, GROUND - 470); cc.bezierCurveTo(CX - 160, GROUND - 620, CX - 40, GROUND - 660, CX, GROUND - 662); cc.bezierCurveTo(CX + 40, GROUND - 660, CX + 160, GROUND - 620, CX + 160, GROUND - 470); cc.closePath(); },
    rad(c, CX - 60, GROUND - 600, 10, 220, [[0, '#7a6aaa'], [0.6, '#3a3070'], [1, '#1c1840']]), 0.5);
  c.strokeStyle = 'rgba(20,16,50,0.5)'; c.lineWidth = 3; for (const k of [-0.6, -0.25, 0.25, 0.6]) { c.beginPath(); c.moveTo(CX + k * 160, GROUND - 470); c.quadraticCurveTo(CX + k * 110, GROUND - 620, CX, GROUND - 660); c.stroke(); }
  gf(c, cc => cc.rect(CX - 22, GROUND - 720, 44, 62), '#4a3a78', 0.4);
  gf(c, cc => { cc.moveTo(CX - 28, GROUND - 720); cc.quadraticCurveTo(CX, GROUND - 760, CX + 28, GROUND - 720); cc.closePath(); }, '#5a4a8a', 0.4);
  // steps
  for (let i = 0; i < 5; i++) gf(c, cc => cc.rect(CX - 200 - i * 14, GROUND - 10 + i * 0, 400 + i * 28, 6), '#3a3270', 0);
}
function palm(c, x, h, lean) {
  c.strokeStyle = '#0c0a22'; c.lineWidth = 12; c.lineCap = 'round';
  c.beginPath(); c.moveTo(x, GROUND); c.quadraticCurveTo(x + lean * 0.4, GROUND - h * 0.6, x + lean, GROUND - h); c.stroke();
  c.fillStyle = '#0c0a22';
  for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * 0.42, tx = x + lean, ty = GROUND - h;
    c.beginPath(); c.moveTo(tx, ty); c.quadraticCurveTo(tx + Math.cos(a) * 80, ty + Math.sin(a) * 60 - 20, tx + Math.cos(a) * 130, ty + Math.sin(a) * 40 + 40); c.quadraticCurveTo(tx + Math.cos(a) * 70, ty + Math.sin(a) * 40, tx, ty + 6); c.fill(); }
}
function plazaArt(c) {
  gf(c, cc => cc.rect(-300, GROUND, 2520, 400), lin(c, 0, GROUND, 0, 1200, [[0, '#2a2252'], [1, '#0a0a1c']]), 0.5);
  const r = rng(4);
  for (let x = -300; x < 2300;) { const w = 70 + r() * 120, h = 60 + r() * 160; c.fillStyle = '#100e2c'; c.fillRect(x, GROUND - h, w, h); x += w + 20 + r() * 40; }
  for (const [x, h, l] of [[560, 360, -20], [660, 300, 16], [1760, 380, 24], [1880, 320, -14], [-40, 340, 10]]) palm(c, x, h, l);
  // the small lab across the plaza
  gf(c, cc => cc.rect(130, GROUND - 230, 300, 230), lin(c, 0, GROUND - 230, 0, GROUND, [[0, '#2a9cc0'], [1, '#0a4a66']]), 0.4);
  c.strokeStyle = '#08283c'; c.lineWidth = 8; c.strokeRect(130, GROUND - 230, 300, 230); for (const x of [230, 330]) { c.beginPath(); c.moveTo(x, GROUND - 230); c.lineTo(x, GROUND); c.stroke(); }
  c.beginPath(); c.moveTo(130, GROUND - 115); c.lineTo(430, GROUND - 115); c.stroke();
}

function draw(ctx, t) {
  const tilt = 1 - L.ease(clamp((t - T0) / 1.9));
  const layer = K.camera(ctx, t, T0, T1, { z0: 1.0, z1: 1.06, cx: 960, cy: 560, py: () => -520 * tilt, seed: 71 });
  K.sky(ctx, [[0, '#06081c'], [0.6, '#1a1846'], [1, '#3a2c66']]);
  layer(0.6, () => { K.stars(ctx, t, 1, 700); K.stars(ctx, t + 3, 0.7, 700); ctx.save(); ctx.translate(0, -600); K.stars(ctx, t, 1, 700); ctx.restore(); light(ctx, 1500, 200, 140, '#fff1cf', 0.1); });
  const arrive = ramp(t, REP[1] - 0.05, REP[1] + 0.35);
  layer(1, () => {
    light(ctx, CX, GROUND - 300, 900, '#7a5aa0', 0.2);
    cached(ctx, 'k7plaza', -300, GROUND - 400, 2220, 1260, plazaArt);
    light(ctx, 280, GROUND - 120, 300, C.cyan, 0.2);
    cached(ctx, 'k7cap', CX - 520, GROUND - 780, CX + 520, GROUND + 10, capitolArt);
    // windows in the wings: warm, brighter when the report arrives
    for (let row = 0; row < 2; row++) for (let i = 0; i < 12; i++) {
      const x = CX - 450 + i * 76 + (i >= 6 ? 76 * 0 : 0); if (Math.abs(x + 14 - CX) < 190) continue;
      const a = 0.35 + 0.15 * Math.sin(t * 1.3 + i * 2 + row) + 0.45 * ramp(t, REP[1] + Math.abs(x - CX) / 1200, REP[1] + 0.4 + Math.abs(x - CX) / 1200);
      ctx.fillStyle = rgba('#ffb35c', clamp(a)); ctx.fillRect(x, GROUND - 180 + row * 86, 28, 52);
    }
    // portico glow and drum windows
    light(ctx, CX, GROUND - 140, 260, '#ffb35c', 0.18 + 0.3 * arrive);
    for (let i = 0; i < 7; i++) { ctx.fillStyle = rgba('#ffd28c', 0.3 + 0.6 * arrive); ctx.fillRect(CX - 118 + i * 36, GROUND - 450, 16, 70); }
    light(ctx, CX, GROUND - 600, 340, '#ffb35c', 0.12 + 0.35 * arrive);
    // flag
    ctx.strokeStyle = '#0c0a22'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(CX, GROUND - 760); ctx.lineTo(CX, GROUND - 850); ctx.stroke();
    ctx.fillStyle = '#c9702e'; ctx.beginPath(); ctx.moveTo(CX, GROUND - 850);
    for (let i = 0; i <= 8; i++) ctx.lineTo(CX + i * 8, GROUND - 850 + Math.sin(t * 4 - i * 0.7) * 4 * i / 8);
    for (let i = 8; i >= 0; i--) ctx.lineTo(CX + i * 8, GROUND - 822 + Math.sin(t * 4 - i * 0.7) * 4 * i / 8);
    ctx.fill();
    // the report flies from the lab into the capitol
    const k = clamp((t - REP[0]) / (REP[1] - REP[0]));
    if (k > 0 && k < 1) {
      const u = ease(k), x = lerp(280, CX, u), y = lerp(GROUND - 230, GROUND - 140, u) - Math.sin(u * Math.PI) * 360;
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(u * 6) * 0.25); const sc = 1.3 - 0.6 * u; ctx.scale(sc, sc);
      gf(ctx, c => c.rect(-44, -30, 88, 60), '#f3efe2', 0.2, [-50, -35, 100, 70]);
      ctx.strokeStyle = 'rgba(74,58,112,0.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-44, -30); ctx.lineTo(0, 4); ctx.lineTo(44, -30); ctx.stroke();
      ctx.fillStyle = C.cyanD; ctx.beginPath(); ctx.arc(0, 4, 8, 0, 7); ctx.fill();
      ctx.restore();
      light(ctx, x, y, 90, '#fff1cf', 0.35);
      // trail
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#fff1cf', 0.25); ctx.lineWidth = 3; ctx.setLineDash([3, 12]); ctx.beginPath();
      for (let j = 0; j <= 20; j++) { const v = u * j / 20; const xx = lerp(280, CX, v), yy = lerp(GROUND - 230, GROUND - 140, v) - Math.sin(v * Math.PI) * 360; j ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); ctx.restore();
    }
    if (arrive > 0) { const ph = clamp((t - REP[1]) / 0.9); ctx.strokeStyle = rgba('#ffb35c', 0.6 * (1 - ph)); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(CX, GROUND - 140, 30 + ph * 160, 0, 7); ctx.stroke(); }
    K.fog(ctx, t, 12, GROUND - 60, GROUND + 20, C.lav, 1.2, 6);
  });
  L.label(ctx, t, 456.7, T1, 'California', 'labs must report serious incidents', 96, 70);
}

module.exports = { T0, T1, draw };
