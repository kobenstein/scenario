// C5 · "villaGate": a villa at night behind tall bars (3.03), and the end of its fence on open land at first light (3.04). Owner: c05.
//   villaGate(ctx, t, o)   o: { close (0..1 the gate wings swing shut; 1 = latched), push (0..1 slow dolly toward the gate),
//                               pan (px the camera has moved right along the fence), a }
//   Real perspective (pinhole camera 12 m in front of the fence): a low moon behind the villa throws the bars' shadows toward us
//   across the gravel (they radiate from the moon's point on the horizon, hatched like an engraving). While the gate is open a
//   clean wedge of moonlight falls through it; closing, the wings' bars slice it into stripes. One warm window is lit.
//   fenceEnd(ctx, t, o)    the last bars, the end pillar and a broken-off rail as silhouettes; o: { x (screen x of the end pillar), a, dawn }
import { Path2D } from '@napi-rs/canvas';
import { W, H, rgba, clamp, mix, prng, canvas } from '../engine.mjs';
import { stipple, vnoise, fbm, hatch as artHatch, fog as artFog } from './art.mjs';

const CACHE = new Map(); const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const TAU = Math.PI * 2;
// camera: x right, y up, z away from the camera (fence plane z = 0); camera at z = -ZC, height HC
const F = 1500, ZC = 12, HC = 1.55, HZ = 500;
const MOON = [1350, 92];               // the moon (screen), low behind the villa; shadows radiate from (MOON.x, HZ)
const proj = (x, y, z, cx = 0) => { const k = F / (z + ZC); return [W / 2 + (x - cx) * k, HZ + (HC - y) * k, k]; };
const BAR = .032, GAP = .155, BH = 3.25, GATE = 2.5, PIL = .62, PH = 3.7;   // metres

function skyLayer() {
  return once('vsky', () => {
    const [c, g] = canvas(W + 300, H);
    const sg = g.createLinearGradient(0, 0, 0, HZ + 60); sg.addColorStop(0, '#04061a'); sg.addColorStop(.55, '#0b1438'); sg.addColorStop(1, '#1b2a5c'); g.fillStyle = sg; g.fillRect(0, 0, c.width, H);
    const mx = MOON[0] + 150, my = MOON[1];
    const halo = g.createRadialGradient(mx, my, 0, mx, my, 520); halo.addColorStop(0, 'rgba(214,226,255,.42)'); halo.addColorStop(.08, 'rgba(170,190,240,.22)'); halo.addColorStop(.4, 'rgba(90,110,180,.07)'); halo.addColorStop(1, 'rgba(60,80,150,0)'); g.fillStyle = halo; g.fillRect(0, 0, c.width, H);
    g.fillStyle = '#eef2ff'; g.beginPath(); g.arc(mx, my, 34, 0, TAU); g.fill();
    g.fillStyle = 'rgba(160,170,200,.25)'; for (const [dx, dy, r] of [[-9, -6, 9], [8, 7, 6], [-4, 12, 5], [12, -10, 4]]) { g.beginPath(); g.arc(mx + dx, my + dy, r, 0, TAU); g.fill(); }
    const r = prng(5); for (let i = 0; i < 260; i++) { const x = r() * c.width, y = r() * HZ * .9, d = Math.hypot(x - mx, y - my); if (d < 160) continue; g.fillStyle = `rgba(230,236,255,${(.15 + r() * .55) * Math.min(1, d / 500)})`; const s = r() < .1 ? 1.8 : 1; g.fillRect(x, y, s, s); }
    // a thin cloud band across the moon
    artFog(g, { y0: 90, y1: 300, col: '#6c7fb8', a: .22, seed: 23, sx: .002, sy: .012, cover: .5, soft: .4, k: .6, x1: c.width });
    stipple(c, { k: .45, g: 1, seed: 12, mid: false, boost: 1 });
    return c;
  });
}
// far trees + the villa (static, in world space, rendered for the camera without pan; the pan shifts it by parallax)
function villaLayer() {
  return once('villa', () => {
    const [c, g] = canvas(W + 600, H), ox = 300, n = vnoise(11);
    // tree line behind the villa
    g.fillStyle = '#060a1c'; g.beginPath(); g.moveTo(0, HZ + 40);
    for (let x = 0; x <= c.width; x += 6) { const h = 70 + 60 * fbm(n, x * .006, 1.3) + 40 * Math.max(0, Math.sin(x * .021)) * fbm(n, x * .03, 4); g.lineTo(x, HZ + 30 - h); }
    g.lineTo(c.width, HZ + 60); g.closePath(); g.fill();
    // cypresses / tall poplars flanking the villa
    for (const [x, h, w] of [[ox + 250, 330, 34], [ox + 300, 280, 30], [ox + 1650, 350, 36], [ox + 1700, 300, 30]]) { g.fillStyle = '#05081a'; g.beginPath(); g.ellipse(x, HZ + 40 - h / 2, w, h / 2, 0, 0, TAU); g.fill(); }
    // villa volumes (screen space at the camera's rest position): a long low wing, a taller block, a cantilevered upper floor
    const P = (x, y, z) => { const [sx, sy] = proj(x, y, z); return [sx + ox, sy]; };
    const box = (x0, x1, y0, y1, z, col, edge) => { const [a, b] = P(x0, y1, z), [d, e] = P(x1, y0, z); g.fillStyle = col; g.fillRect(a, b, d - a, e - b); if (edge) { g.strokeStyle = edge; g.lineWidth = 1.2; g.strokeRect(a + .5, b + .5, d - a - 1, e - b - 1); } return [a, b, d - a, e - b]; };
    const Z = 26;
    const wingL = box(-17, -4, 0, 4.2, Z + 2, '#0d1430', 'rgba(150,170,230,.12)');
    const block = box(-5, 7, 0, 7.6, Z, '#18224a', 'rgba(170,190,240,.2)');
    const upper = box(1, 15, 7.6, 10.4, Z - 1, '#16204a', 'rgba(170,190,240,.22)');
    const wingR = box(7, 18, 0, 4.6, Z + 1, '#0c1330', 'rgba(150,170,230,.12)');
    // flat roof slabs (thin cream edges catching the moon)
    for (const [x0, x1, y, z] of [[-17.6, -3.6, 4.2, Z + 2], [-5.4, 7.4, 7.6, Z], [.6, 15.6, 10.4, Z - 1], [6.6, 18.6, 4.6, Z + 1]]) { const [a, b] = P(x0, y, z), [d] = P(x1, y, z); g.fillStyle = 'rgba(205,215,245,.35)'; g.fillRect(a, b - 3, d - a, 4); g.fillStyle = '#080d22'; g.fillRect(a, b + 1, d - a, 7); }
    // facade hatching (engraved shade), denser at the bottom
    for (const R of [wingL, block, upper, wingR]) { g.save(); g.beginPath(); g.rect(...R); g.clip(); artHatch(g, R, { angle: -1.45, gap: 4.2, w: .7, col: '#3a4a86', a: .35, wobble: .3, seed: R[0] | 0, broken: .3 }); g.restore(); }
    // dark glass bands (window walls) with a few cool reflections of the moon
    const glass = (x0, x1, y0, y1, z) => { const [a, b] = P(x0, y1, z), [d, e] = P(x1, y0, z); const gg = g.createLinearGradient(a, b, d, e); gg.addColorStop(0, '#0a1230'); gg.addColorStop(.5, '#141f4c'); gg.addColorStop(1, '#070c22'); g.fillStyle = gg; g.fillRect(a, b, d - a, e - b);
      g.strokeStyle = 'rgba(120,140,200,.25)'; g.lineWidth = 1; for (let x = a; x < d; x += (d - a) / Math.max(2, Math.round((d - a) / 38))) { g.beginPath(); g.moveTo(x, b); g.lineTo(x, e); g.stroke(); } return [a, b, d - a, e - b]; };
    glass(-15.5, -5.5, .6, 3.4, Z + 2); glass(8.2, 16.8, .6, 3.8, Z + 1); glass(2, 14, 8.1, 9.9, Z - 1);
    glass(-3.6, 5.8, .6, 3.2, Z); glass(-3.6, 5.8, 4.2, 6.8, Z);
    const lit = glass(1.4, 4.6, 8.1, 9.9, Z - 1);
    // the one lit window: warm interior, a lamp, a shelf line, light spilling onto the terrace
    { const [a, b, w, h] = lit, wg = g.createRadialGradient(a + w * .62, b + h * .45, 4, a + w * .55, b + h * .55, w * .75); wg.addColorStop(0, '#ffe6b8'); wg.addColorStop(.25, '#ffb35c'); wg.addColorStop(.8, '#9a5a2a'); wg.addColorStop(1, '#5a3418'); g.fillStyle = wg; g.fillRect(a, b, w, h);
      g.fillStyle = 'rgba(60,30,14,.55)'; g.fillRect(a, b + h * .7, w, 3); g.fillRect(a + w * .12, b + h * .2, 3, h * .5); g.fillRect(a + w * .2, b + h * .2, w * .18, 2);
      g.strokeStyle = 'rgba(70,36,16,.7)'; g.lineWidth = 2; for (let k = 1; k < 4; k++) { const x = a + w * k / 4; g.beginPath(); g.moveTo(x, b); g.lineTo(x, b + h); g.stroke(); }
      g.save(); g.globalCompositeOperation = 'lighter'; const sp = g.createRadialGradient(a + w / 2, b + h, 0, a + w / 2, b + h, w * .9); sp.addColorStop(0, 'rgba(255,170,90,.35)'); sp.addColorStop(1, 'rgba(255,170,90,0)'); g.fillStyle = sp; g.fillRect(a - w, b, w * 3, h * 1.6); g.restore(); }
    // lawn behind the fence (dark, cool), the drive up to the house
    const [gx0, gy0] = P(-60, 0, Z + 3), lg = g.createLinearGradient(0, gy0, 0, HZ + 260); lg.addColorStop(0, '#0b1230'); lg.addColorStop(1, '#0a0f24'); g.fillStyle = lg; g.fillRect(0, gy0, c.width, HZ + 300 - gy0);
    { const q = [P(-2.2, 0, 1), P(2.2, 0, 1), P(1.6, 0, Z), P(-1.6, 0, Z)]; g.fillStyle = '#1a2348'; g.beginPath(); q.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fill(); }
    stipple(c, { k: .55, g: 1.05, seed: 19, mid: false, boost: 1.3 });
    return c;
  });
}
// gravel in front of the fence (static), lit faintly by the moon; the shadow hatch layer (full frame, reused per frame through a clip)
function gravelLayer() {
  return once('vgravel', () => {
    const [c, g] = canvas(W + 600, H - HZ + 40), r = prng(31), y0 = HZ - 40;
    const gg = g.createLinearGradient(0, 0, 0, c.height); gg.addColorStop(0, '#161c38'); gg.addColorStop(.35, '#262f56'); gg.addColorStop(1, '#323d68'); g.fillStyle = gg; g.fillRect(0, 0, c.width, c.height);
    for (let i = 0; i < 26000; i++) { const y = Math.pow(r(), .7) * c.height, x = r() * c.width, s = .6 + (y / c.height) * 2.6 * r(); g.fillStyle = r() < .5 ? `rgba(220,228,255,${.08 + r() * .2})` : `rgba(8,12,30,${.15 + r() * .3})`; g.fillRect(x, y, s, s * .6); }
    stipple(c, { k: .5, g: 1, seed: 8, mid: false, boost: 1.2 });
    return { c, y0 };
  });
}
function hatchLayer() { return once('vhatch', () => { const [c, g] = canvas(W, H); artHatch(g, [0, 0, W, H], { angle: -.95, gap: 5.2, w: 1.1, col: '#02040c', a: .85, wobble: .6, seed: 3, broken: .1 }); return c; }); }
// all bars of the fence + gate as feet/tops in world space
function bars(close) {
  const out = [];
  for (let x = -40; x <= -GATE - PIL; x += GAP) out.push({ x0: x, z0: 0, x1: x, z1: 0, kind: 'f' });
  for (let x = GATE + PIL; x <= 40; x += GAP) out.push({ x0: x, z0: 0, x1: x, z1: 0, kind: 'f' });
  const th = mix(1.32, 0, close);   // open: swung back 76°
  for (const sgn of [-1, 1]) { const hx = sgn * GATE; for (let s = GAP * .6; s < GATE - .02; s += GAP) { const x = hx - sgn * s * Math.cos(th), z = s * Math.sin(th); out.push({ x0: x, z0: z, kind: 'g', s, sgn }); } }
  return out;
}
export function villaGate(ctx, t, o = {}) {
  const close = clamp(o.close ?? 0), push = o.push ?? 0, pan = o.pan ?? 0, a = o.a ?? 1;
  const cx = pan / (F / ZC);                 // camera x in metres
  const sc = 1 + .07 * push, ax = W / 2, ay = HZ + 140;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(ax, ay); ctx.scale(sc, sc); ctx.translate(-ax, -ay);
  ctx.drawImage(skyLayer(), -150 - pan * .05, 0);
  ctx.drawImage(villaLayer(), -300 - pan * .32, 0);
  const G = gravelLayer(); ctx.drawImage(G.c, -300 - pan * 1.0, G.y0 + 40);
  // moonlight on the gravel: brightest in the gate's wedge, fading toward us
  const vp = [MOON[0] - pan * .05, HZ + 4];
  { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createRadialGradient(vp[0], vp[1] + 140, 20, vp[0], vp[1] + 300, 900); lg.addColorStop(0, 'rgba(190,205,255,.16)'); lg.addColorStop(.5, 'rgba(150,170,240,.06)'); lg.addColorStop(1, 'rgba(120,140,220,0)'); ctx.fillStyle = lg; ctx.fillRect(0, HZ, W, H - HZ); ctx.restore(); }
  // the window's warm spill reaches the lawn and the gate (faint)
  // shadows: every bar's shadow is the wedge between two lines from the vanishing point through the bar's foot edges
  const B = bars(close), sh = new Path2D(), ext = (p) => { const dx = p[0] - vp[0], dy = p[1] - vp[1], k = (H + 200 - vp[1]) / Math.max(1, dy); return [vp[0] + dx * k, vp[1] + dy * k]; };
  const feet = [];
  for (const b of B) {
    const [x, y] = proj(b.x0, 0, b.z0, cx), [xr] = proj(b.x0 + BAR, 0, b.z0, cx); if (y < HZ + 2 || x < -400 || x > W + 400) continue;
    const w = Math.max(1.2, xr - x), p0 = [x - w / 2, y], p1 = [x + w / 2, y], e0 = ext(p0), e1 = ext(p1);
    sh.moveTo(p0[0], p0[1]); sh.lineTo(p1[0], p1[1]); sh.lineTo(e1[0], e1[1]); sh.lineTo(e0[0], e0[1]); sh.closePath(); feet.push([x, y, w, b]);
  }
  // pillars' shadows (wider)
  for (const sgn of [-1, 1]) { const x0 = sgn > 0 ? GATE : -GATE - PIL, [a0, y0] = proj(x0, 0, 0, cx), [a1] = proj(x0 + PIL, 0, 0, cx), e0 = ext([a0, y0]), e1 = ext([a1, y0]); sh.moveTo(a0, y0); sh.lineTo(a1, y0); sh.lineTo(e1[0], e1[1]); sh.lineTo(e0[0], e0[1]); sh.closePath(); }
  ctx.save(); ctx.beginPath(); ctx.rect(0, HZ + 6, W, H); ctx.clip();
  ctx.save(); ctx.clip(sh); ctx.fillStyle = 'rgba(4,6,18,.62)'; ctx.fillRect(0, 0, W, H); ctx.drawImage(hatchLayer(), 0, 0); ctx.restore();
  ctx.restore();
  // fence rails + bars (silhouettes against the sky, cool rim on the moon side)
  const railY = [.18, BH - .38], top = BH;
  ctx.lineCap = 'butt';
  const drawBar = (xw, zw, hgt) => {
    const [x, yb, k] = proj(xw, 0, zw, cx), [, yt] = proj(xw, hgt, zw, cx), w = Math.max(1, BAR * k);
    if (x < -20 || x > W + 20) return;
    ctx.fillStyle = '#04050d'; ctx.fillRect(x - w / 2, yt, w, yb - yt);
    ctx.fillStyle = 'rgba(170,190,240,.28)'; ctx.fillRect(x - w / 2, yt, Math.max(.6, w * .3), yb - yt);
    // spear finial
    ctx.fillStyle = '#04050d'; ctx.beginPath(); ctx.moveTo(x - w * 1.3, yt + 2); ctx.lineTo(x, yt - w * 4.2); ctx.lineTo(x + w * 1.3, yt + 2); ctx.closePath(); ctx.fill();
  };
  // fixed fence
  for (const sgn of [-1, 1]) {
    const xa = sgn < 0 ? -40 : GATE + PIL, xb = sgn < 0 ? -GATE - PIL : 40;
    for (const ry of railY) { const [p, q] = [proj(xa, ry, 0, cx), proj(xb, ry, 0, cx)]; ctx.fillStyle = '#04050d'; ctx.fillRect(p[0], p[1] - 3, q[0] - p[0], 6); ctx.fillStyle = 'rgba(170,190,240,.18)'; ctx.fillRect(p[0], p[1] - 3, q[0] - p[0], 1); }
  }
  for (const b of B) if (b.kind === 'f') drawBar(b.x0, 0, top);
  // gate wings: far parts first (sorted by depth)
  const wings = B.filter((b) => b.kind === 'g').sort((p, q) => q.z0 - p.z0);
  for (const sgn of [-1, 1]) {
    const th = mix(1.32, 0, close), hx = sgn * GATE, tip = [hx - sgn * GATE * Math.cos(th), GATE * Math.sin(th)];
    for (const ry of [...railY, 1.6]) { const p = proj(hx, ry, 0, cx), q = proj(tip[0], ry, tip[1], cx); ctx.strokeStyle = '#04050d'; ctx.lineWidth = Math.max(2, 6 * q[2] / (F / ZC)); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); }
  }
  for (const b of wings) drawBar(b.x0, b.z0, top + .25 * Math.sin(Math.PI * b.s / GATE));
  // pillars with caps and unlit lanterns
  for (const sgn of [-1, 1]) {
    const x0 = sgn > 0 ? GATE : -GATE - PIL, [a0, yb] = proj(x0, 0, 0, cx), [a1, yt] = proj(x0 + PIL, PH, 0, cx);
    const pg = ctx.createLinearGradient(a0, 0, a1, 0); pg.addColorStop(0, '#1b2346'); pg.addColorStop(.5, '#121a38'); pg.addColorStop(1, '#090d20'); ctx.fillStyle = pg; ctx.fillRect(a0, yt, a1 - a0, yb - yt);
    ctx.save(); ctx.beginPath(); ctx.rect(a0, yt, a1 - a0, yb - yt); ctx.clip(); ctx.strokeStyle = 'rgba(150,165,215,.18)'; ctx.lineWidth = 1; for (let y = yt + 18; y < yb; y += 26) { ctx.beginPath(); ctx.moveTo(a0, y); ctx.lineTo(a1, y); ctx.stroke(); } ctx.restore();
    ctx.fillStyle = '#0a0f26'; ctx.fillRect(a0 - 8, yt - 14, a1 - a0 + 16, 16); ctx.fillStyle = 'rgba(190,205,250,.35)'; ctx.fillRect(a0 - 8, yt - 14, a1 - a0 + 16, 2);
    const lx = (a0 + a1) / 2; ctx.fillStyle = '#06081a'; ctx.beginPath(); ctx.moveTo(lx - 16, yt - 14); ctx.lineTo(lx - 12, yt - 62); ctx.lineTo(lx + 12, yt - 62); ctx.lineTo(lx + 16, yt - 14); ctx.closePath(); ctx.fill(); ctx.fillRect(lx - 18, yt - 70, 36, 9);
    ctx.strokeStyle = 'rgba(190,205,250,.25)'; ctx.lineWidth = 1; ctx.stroke();
  }
  // ground mist hugging the gravel
  { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const mg = ctx.createLinearGradient(0, HZ - 30, 0, HZ + 140); mg.addColorStop(0, 'rgba(110,130,200,0)'); mg.addColorStop(.5, 'rgba(110,130,200,.10)'); mg.addColorStop(1, 'rgba(110,130,200,0)'); ctx.fillStyle = mg; ctx.fillRect(0, HZ - 30, W, 170); ctx.restore(); }
  ctx.restore();
  return { latch: proj(0, 1.6, 0, cx) };
}
// the end of the fence: last bars and the end pillar, black against the dawn
export function fenceEnd(ctx, t, o = {}) {
  const x = o.x ?? 600, a = o.a ?? 1, base = o.base ?? 860, s = o.s ?? 1.6; if (a <= 0 || x < -900) return;
  const k = 125 * s, top = base - BH * k;
  ctx.save(); ctx.globalAlpha = a;
  // rails
  ctx.fillStyle = '#0b0a14'; for (const ry of [.18, BH - .38]) { const y = base - ry * k; ctx.fillRect(-50, y - 4 * s, x + 50, 8 * s); }
  for (let bx = x - GAP * k; bx > -60; bx -= GAP * k) {
    const w = BAR * k; ctx.fillStyle = '#0b0a14'; ctx.fillRect(bx - w / 2, top, w, base - top);
    ctx.beginPath(); ctx.moveTo(bx - w * 1.3, top + 2); ctx.lineTo(bx, top - w * 4.2); ctx.lineTo(bx + w * 1.3, top + 2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,200,150,.22)'; ctx.fillRect(bx + w * .2, top, Math.max(.8, w * .3), base - top);
  }
  // end pillar
  const pw = PIL * k, pt = base - PH * k, pg = ctx.createLinearGradient(x, 0, x + pw, 0); pg.addColorStop(0, '#16131f'); pg.addColorStop(.7, '#1e1a28'); pg.addColorStop(1, '#3a2e34'); ctx.fillStyle = pg; ctx.fillRect(x, pt, pw, base - pt);
  ctx.fillStyle = '#100e18'; ctx.fillRect(x - 10 * s, pt - 16 * s, pw + 20 * s, 18 * s); ctx.fillStyle = 'rgba(255,200,150,.35)'; ctx.fillRect(x - 10 * s, pt - 16 * s, pw + 20 * s, 2);
  ctx.strokeStyle = 'rgba(255,210,170,.12)'; ctx.lineWidth = 1; for (let y = pt + 24; y < base; y += 30 * s) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + pw, y); ctx.stroke(); }
  // ground shadow under the fence
  const gg = ctx.createLinearGradient(0, base - 6, 0, base + 30); gg.addColorStop(0, 'rgba(10,8,20,.6)'); gg.addColorStop(1, 'rgba(10,8,20,0)'); ctx.fillStyle = gg; ctx.fillRect(-50, base - 6, x + pw + 60, 36);
  ctx.restore();
}
