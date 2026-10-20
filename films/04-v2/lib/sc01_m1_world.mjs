// C01 (Film 4 minute 1) · the "what would you do" shots and the wall, 1.04 → 1.09. Owner c01.
//   roofShot(ctx, t, K)    1.04 you on the roof at dawn (rooftop.mjs set, youFree), the far light is the sun, it climbs
//   facadeShot(ctx, t, K)  1.05 an apartment window at morning: the blind lowers on "Sleep", the sun climbs past, shadows swing
//   mapShot(ctx, t, K)     1.06 the engraved paper map (sc09_map daySheet): a dotted route and a little engraved plane land on a coast
//   lakeTake(ctx, t, K)    1.07 + 1.08 the lake at dusk, the hammock; days and nights flicker, you sit up, the paper wall rises
//   wallShot(ctx, t, K)    1.09 the wall: your income slip pinned to it, still glowing; a guilloche "?" engraves itself beside it
import { W, H, rgba, clamp, mix, eio, sm, prng, drift, canvas, text } from '../engine.mjs';
import { stipple, vnoise, fbm } from './art.mjs';
import { rooftop, ROOF } from './rooftop.mjs';
import { youFree } from './sc01_m1_you.mjs';
import { rosette, ring, seal, microtext } from './certificate.mjs';
import { ghostLine } from './ghost.mjs';
import { tree } from './tree.mjs';
import { daySheet, drawDay, toView, ll } from './sc09_map.mjs';
import { once, toImg, best, eoX, eiX, qio, slipTex, SLIP } from './sc01_m1_open.mjs';

const TAU = Math.PI * 2;
const poly = (ctx, pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); };
const mixHex = (a, b, u) => { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16), m = (s) => Math.round(mix((A >> s) & 255, (B >> s) & 255, clamp(u))); return '#' + [m(16), m(8), m(0)].map((v) => v.toString(16).padStart(2, '0')).join(''); };
function bloomSprite(key, R, stops, k = .8) { return once(key, () => { const [c, g] = canvas(R * 2, R * 2), rg = g.createRadialGradient(R, R, 0, R, R, R); stops.forEach(([o, col]) => rg.addColorStop(o, col)); g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2); if (k) stipple(c, { k, g: 1.2, seed: R }); return c; }); }
const sunBloom = () => bloomSprite('sunbloom', 640, [[0, 'rgba(255,246,226,1)'], [.05, 'rgba(255,226,170,.9)'], [.16, 'rgba(255,180,100,.35)'], [.45, 'rgba(255,150,80,.08)'], [1, 'rgba(255,150,80,0)']]);
function putBloom(ctx, B, x, y, s, a) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; ctx.drawImage(B, x - B.width / 2 * s, y - B.height / 2 * s, B.width * s, B.height * s); ctx.restore(); }
function motes(ctx, t, cx, cy, R, a, seed = 23) {
  if (a <= 0) return; const r = prng(seed); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 120; i++) { const ang = r() * TAU, d = R * (.2 + r() * 1.1), sp = .2 + r() * .5, x = cx + Math.cos(ang) * d + Math.sin(t * sp + i) * 24, y = cy + Math.sin(ang) * d * .8 + Math.cos(t * sp * .8 + i * 1.7) * 18 - t * 8; const f = Math.max(0, 1 - d / (R * 1.3)); ctx.fillStyle = `rgba(255,214,170,${(.12 + .45 * r()) * f * a})`; const z = r() < .8 ? 1.5 : 2.6; ctx.fillRect(x, y, z, z); }
  ctx.restore();
}

// =====================================================================================================================
// 1.04 · the roof at dawn: you, seen from behind, hands free, looking out; the sun (the far light of 1.03) climbs
// =====================================================================================================================
export const ROOF_SUN0 = [1290, 520];
export function roofShot(ctx, t, K) {
  const u = clamp((t - K.t0) / (K.out - K.t0)), climb = sm(u) * .45 + eiX(clamp((t - (K.out - .9)) / .9)) * .55;
  const dawn = sm(clamp((t - K.t0 - .45) / .9));   // blue before dawn → the gold arrives on "do?" (one set at a time outside the cross-fade)
  const cam = { x: (t - K.t0) * 9 + drift(t, 5, 1), y: drift(t, 3, 2) - 40 * eiX(clamp((t - (K.out - .7)) / .7)), z: mix(1.08, 1.02, eoX(clamp((t - K.t0) / 1.6))), fx: 1290, fy: 520 };
  let SUN = null;
  const A = rooftop(ctx, t, {
    state: 'dawn', dawn, cam, glowA: 1.1,
    onSky: (g, A0) => {
      const [x, y] = A0.map(.12)(ROOF_SUN0[0] + 30 * climb, mix(ROOF_SUN0[1], 300, climb)), k = A0.k(.12);
      putBloom(g, sunBloom(), x, y, 1.15 * k * (1 + .02 * Math.sin(t * 1.4)), .95);
      g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(255,248,232,.95)'; g.beginPath(); g.arc(x, y, 26 * k, 0, TAU); g.fill(); g.restore();
      // the buzz rings of Film 5 are gone; one faint guilloche halo keeps the engraved line alive round the sun
      ring(g, x, y, 150 * k, 150 * k, { lines: 7, band: 14, wave: 24, col: '#fff1d6', glow: '#ffb35c', glowA: .05, a: .28, lw: .6, ph: t * .25 });
      SUN = [x, y];
    },
  });
  const k1 = A.k(1), [fx, fy] = A.map(1)(560, 1460);
  // your long shadow toward us (the sun is behind you), then you
  ctx.save(); ctx.translate(fx + 40 * k1, fy - 30 * k1); ctx.rotate(.18); const sg = ctx.createLinearGradient(0, -40, 0, 300); sg.addColorStop(0, 'rgba(4,3,10,.55)'); sg.addColorStop(1, 'rgba(4,3,10,0)'); ctx.fillStyle = sg; ctx.beginPath(); ctx.ellipse(0, 120, 150 * k1, 260 * k1, 0, 0, TAU); ctx.fill(); ctx.restore();
  const look = .75 + .25 * sm(clamp((t - K.t0 - .3) / 1.2));
  ctx.save(); ctx.translate(fx, fy); ctx.scale(k1, k1);   // a fixed figure size (stable buffers); the camera scale goes on the context
  youFree(ctx, 0, 0, 1.2, { t, look, lit: 0, light: { x: ((SUN ? SUN[0] : 1300) - fx) / k1, y: ((SUN ? SUN[1] : 500) - fy) / k1, col: '#ffe0b0', a: .95 }, wind: 1.2, accent: '#c8843a' });
  ctx.restore();
  if (SUN) motes(ctx, t, SUN[0], SUN[1], 420, .5);
  const vg = ctx.createRadialGradient(W * .55, H * .48, 420, W * .5, H * .5, 1250); vg.addColorStop(0, 'rgba(3,4,12,0)'); vg.addColorStop(1, 'rgba(3,4,12,.45)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  return { sun: SUN };
}

// =====================================================================================================================
// 1.05 · Sleep in: an apartment window at morning. The blind lowers on "Sleep"; the sun climbs past, the shadows swing.
// =====================================================================================================================
const WIN = { x: 560, y: 250, w: 420, h: 560, rev: 34 };   // the window opening on the facade (screen at cam 0)
function facadeLayer() {
  return once('facade', () => {
    const [c, g] = canvas(W + 200, H + 200), r = prng(8), n = vnoise(4);
    g.translate(100, 100);
    // sky strip at the right (behind the building's edge) is drawn live; the facade is opaque up to x = 1460
    const fw = 1380;
    const pg = g.createLinearGradient(0, -100, fw, H); pg.addColorStop(0, '#2b3352'); pg.addColorStop(.6, '#3a3e5c'); pg.addColorStop(1, '#262a44'); g.fillStyle = pg; g.fillRect(-100, -100, fw + 100, H + 200);
    // plaster: mottled, engraved hatch, horizontal string course and a cornice
    for (let i = 0; i < 2600; i++) { const x = r() * (fw + 100) - 100, y = r() * (H + 200) - 100, a = .03 + .05 * fbm(n, x * .004, y * .004, 3); g.fillStyle = r() < .5 ? `rgba(220,200,180,${a})` : `rgba(0,0,0,${a * 1.4})`; g.fillRect(x, y, 3 + r() * 5, 2 + r() * 3); }
    g.strokeStyle = 'rgba(8,8,20,.28)'; g.lineWidth = 1; g.beginPath(); for (let d = -1400; d < fw + 1200; d += 7 + r() * 3) { g.moveTo(d, -100); g.lineTo(d - 700, H + 100); } g.stroke();
    for (const [y, hh] of [[-40, 26], [WIN.y + WIN.h + 120, 18]]) { g.fillStyle = '#1e2238'; g.fillRect(-100, y, fw + 100, hh); g.fillStyle = 'rgba(255,220,180,.16)'; g.fillRect(-100, y, fw + 100, 3); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(-100, y + hh, fw + 100, 10); }
    // a neighbour window cut by the left edge and one at the far right (their blinds already down)
    for (const nx of [-330]) { g.fillStyle = '#121527'; g.fillRect(nx, WIN.y, WIN.w, WIN.h); g.fillStyle = '#c8b894'; g.fillRect(nx + 22, WIN.y + 22, WIN.w - 44, WIN.h * .7); g.strokeStyle = 'rgba(60,50,40,.35)'; g.lineWidth = 2; for (let y = WIN.y + 40; y < WIN.y + WIN.h * .7 + 22; y += 26) { g.beginPath(); g.moveTo(nx + 22, y); g.lineTo(nx + WIN.w - 22, y); g.stroke(); } g.fillStyle = 'rgba(10,12,30,.5)'; g.fillRect(nx + 22, WIN.y + 22, WIN.w - 44, WIN.h * .7); g.fillStyle = '#5a5470'; g.fillRect(nx - 20, WIN.y + WIN.h, WIN.w + 40, 22); }
    // the building's edge and a drainpipe
    g.fillStyle = '#151829'; g.fillRect(fw - 8, -100, 12, H + 200); g.fillStyle = '#20243a'; g.fillRect(fw - 70, -100, 22, H + 200); g.fillStyle = 'rgba(255,220,180,.22)'; g.fillRect(fw - 52, -100, 3, H + 200);
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .3, g: 1, seed: 5, mid: false, boost: 1 });
    return c;
  });
}
function windowLayer() {   // frame, panes, sill, flower box (static); the glass reflection and the blind are live
  return once('window', () => {
    const { w, h, rev } = WIN, [c, g] = canvas(w + 200, h + 200), o = 100;
    g.translate(o, o);
    // reveal (deep, in shade) and the frame
    g.fillStyle = '#10121f'; g.fillRect(-rev, -rev, w + rev * 2, h + rev); g.fillStyle = '#1a1d30'; g.fillRect(0, 0, w, h);
    return c;
  });
}
const FRAME = '#e6dcc6';
export function facadeShot(ctx, t, K) {
  const u = clamp((t - K.t0) / (K.out - K.t0)), sunU = sm(u) * .6 + eiX(clamp((t - (K.out - .6)) / .6)) * .4;
  const cam = { x: -30 * u + drift(t, 4, 1), y: 20 * u + drift(t, 3, 2), z: 1 + .025 * u };
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(cam.z, cam.z); ctx.translate(-W / 2 + cam.x, -H / 2 + cam.y);
  // sky strip and the sun (far plane: moves less)
  const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, mixHex('#33406e', '#5b7bb0', sunU)); sky.addColorStop(1, mixHex('#e9b58a', '#f3d6b0', sunU)); ctx.fillStyle = sky; ctx.fillRect(1300, -100, 800, H + 200);
  { const r = prng(4); ctx.fillStyle = mixHex('#1c2036', '#2c3352', sunU); for (let x = 1370; x < 2100; x += 30 + r() * 50) { const hh = 120 + r() * 260; ctx.fillRect(x, H - hh, 26 + r() * 60, hh + 100); } }
  const sx = mix(1560, 1800, sunU), sy = mix(760, 150, Math.sin(sunU * Math.PI / 2));
  ctx.save(); ctx.beginPath(); ctx.rect(1376, -200, 900, H + 400); ctx.clip(); putBloom(ctx, sunBloom(), sx, sy, .9, .95); ctx.fillStyle = 'rgba(255,250,236,.95)'; ctx.beginPath(); ctx.arc(sx, sy, 30, 0, TAU); ctx.fill(); ctx.restore();
  ctx.drawImage(facadeLayer(), -100, -100);
  // sunlight across the facade: warm, raking from the right; it grows as the sun climbs
  { ctx.save(); ctx.beginPath(); ctx.rect(-100, -100, 1480, H + 200); ctx.clip(); ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createLinearGradient(1380, sy, 200, sy + 500); lg.addColorStop(0, `rgba(255,190,120,${.35 + .2 * sunU})`); lg.addColorStop(.6, `rgba(255,170,100,${.08 + .06 * sunU})`); lg.addColorStop(1, 'rgba(255,170,100,0)'); ctx.fillStyle = lg; ctx.fillRect(-100, -100, 1560, H + 200); ctx.restore(); }
  // the window: reveal, glass with the sky in it, the blind, muntins, frame
  const { x, y, w, h, rev } = WIN;
  ctx.fillStyle = '#0c0e1a'; ctx.fillRect(x - rev, y - rev, w + 2 * rev, h + rev);
  const gl = ctx.createLinearGradient(x, y, x + w, y + h); gl.addColorStop(0, '#1b2140'); gl.addColorStop(.5, '#2a3460'); gl.addColorStop(1, '#141830'); ctx.fillStyle = gl; ctx.fillRect(x, y, w, h);
  // a room in there: a warm lamp left on, a dark shape of a bed's headboard
  { const rg = ctx.createRadialGradient(x + w * .25, y + h * .55, 0, x + w * .25, y + h * .55, 220); rg.addColorStop(0, 'rgba(255,190,120,.45)'); rg.addColorStop(1, 'rgba(255,190,120,0)'); ctx.fillStyle = rg; ctx.fillRect(x, y, w, h); ctx.fillStyle = 'rgba(8,8,16,.6)'; ctx.fillRect(x + w * .35, y + h * .62, w * .65, h * .38); }
  // the blind: cream cloth with a scalloped hem and a wooden bar; lowers on "Sleep" (expo-out, a 4 % settle)
  const bu = clamp((t - (K.sleep - .05)) / .65), drop = bu <= 0 ? 0 : eoX(bu) + .04 * Math.sin(clamp((t - K.sleep - .4) / .5) * Math.PI) * (t > K.sleep + .4);
  const bh = mix(h * .14, h * .97, clamp(drop, 0, 1.04));
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const bg = ctx.createLinearGradient(x, y, x + w, y); bg.addColorStop(0, '#d9c9a4'); bg.addColorStop(.5, '#efe2c4'); bg.addColorStop(1, '#cdb994'); ctx.fillStyle = bg; ctx.fillRect(x, y, w, bh);
  ctx.strokeStyle = 'rgba(120,95,60,.25)'; ctx.lineWidth = 1; for (let yy = y + 14; yy < y + bh - 10; yy += 14) { ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); ctx.stroke(); }
  // the lamp shines through the cloth once it is down
  { const rg = ctx.createRadialGradient(x + w * .25, y + h * .55, 0, x + w * .25, y + h * .55, 240); rg.addColorStop(0, `rgba(255,200,130,${.35 * clamp(bh / h)})`); rg.addColorStop(1, 'rgba(255,200,130,0)'); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(200,190,170,1)'; ctx.globalCompositeOperation = 'source-over'; ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, bh); ctx.clip(); ctx.fillStyle = rg; ctx.fillRect(x, y, w, h); ctx.restore(); }
  ctx.fillStyle = '#efe2c4'; ctx.beginPath(); ctx.moveTo(x, y + bh); for (let k = 0; k <= 8; k++) { const xx = x + k * w / 8; ctx.quadraticCurveTo(xx - w / 16, y + bh + 16, xx, y + bh); } ctx.fill();
  ctx.fillStyle = '#6a4a2a'; ctx.fillRect(x - 2, y + bh - 4, w + 4, 8); ctx.strokeStyle = '#6a4a2a'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + w / 2, y + bh + 4); ctx.lineTo(x + w / 2 + Math.sin(t * 2.1) * 3, y + bh + 44); ctx.stroke(); ctx.beginPath(); ctx.arc(x + w / 2 + Math.sin(t * 2.1) * 3, y + bh + 50, 6, 0, TAU); ctx.stroke();
  // reflection of the sky on the glass, a diagonal sheen moving with the sun
  ctx.globalCompositeOperation = 'lighter'; const rf = ctx.createLinearGradient(x + w * (1.2 - sunU), y, x + w * (.4 - sunU * .5), y + h); rf.addColorStop(0, 'rgba(255,220,180,0)'); rf.addColorStop(.45, 'rgba(255,230,200,.16)'); rf.addColorStop(.55, 'rgba(255,230,200,.04)'); rf.addColorStop(1, 'rgba(255,220,180,0)'); ctx.fillStyle = rf; ctx.fillRect(x, y, w, h);
  ctx.restore();
  // muntins and frame (cream paint), the sill
  ctx.fillStyle = FRAME; ctx.fillRect(x - 6, y - 6, w + 12, 12); ctx.fillRect(x - 6, y - 6, 12, h + 12); ctx.fillRect(x + w - 6, y - 6, 12, h + 12); ctx.fillRect(x + w / 2 - 5, y, 10, h); ctx.fillRect(x, y + h * .42 - 5, w, 10);
  ctx.fillStyle = '#d8ccb2'; ctx.fillRect(x - 40, y + h, w + 80, 20); ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(x - 40, y + h + 20, w + 80, 8);
  // the window's shadows on the facade: the reveal and the sill cast toward the lower left; they swing and shorten as the sun climbs
  { const ang = mix(.25, 1.05, sunU), L = mix(110, 60, sunU), dx = -Math.cos(ang) * L, dy = Math.sin(ang) * L;
    ctx.fillStyle = 'rgba(6,6,18,.38)';
    poly(ctx, [[x - 40, y + h + 28], [x + w + 40, y + h + 28], [x + w + 40 + dx * .6, y + h + 28 + dy * 1.4], [x - 40 + dx * .6, y + h + 28 + dy * 1.4]]); ctx.fill();
    poly(ctx, [[x - rev, y - rev], [x - rev + dx, y - rev + dy], [x - rev + dx, y + h + dy], [x - rev, y + h]]); ctx.fill();
    // the sunlit inner reveal on the left side of the opening
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,190,120,${.25 + .15 * sunU})`; ctx.fillRect(x - rev, y - rev, rev - 6, h + rev); ctx.restore(); }
  // a flower box on the sill: leaves stir in the morning air
  { const bx = x + 30, by = y + h - 30; ctx.fillStyle = '#5a3a26'; ctx.fillRect(bx, by, w - 60, 34); ctx.fillStyle = 'rgba(255,200,140,.25)'; ctx.fillRect(bx, by, w - 60, 3);
    const r = prng(5); for (let i = 0; i < 26; i++) { const lx = bx + 10 + r() * (w - 80), ly = by + 4, L = 30 + r() * 40, a = -Math.PI / 2 + (r() - .5) * 1.4 + Math.sin(t * 1.6 + i) * .08; ctx.fillStyle = r() < .3 ? '#c4512e' : mixHex('#2f5a3a', '#6f9a5a', r()); ctx.save(); ctx.translate(lx, ly); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(L / 2, 0, L / 2, 6 + r() * 4, 0, 0, TAU); ctx.fill(); ctx.restore(); } }
  ctx.restore();
  // soft vignette
  const vg = ctx.createRadialGradient(W * .45, H * .45, 380, W * .5, H * .5, 1200); vg.addColorStop(0, 'rgba(3,4,12,0)'); vg.addColorStop(1, 'rgba(3,4,12,.5)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  return { sun: [sx, sy] };
}

// =====================================================================================================================
// 1.06 · Travel: the engraved paper map, a dotted route with a little engraved plane, landing on a coast
// =====================================================================================================================
const ccOf = (lon, lat) => { const [x, y] = ll(lon, lat); return { cx: x, cy: y }; };
const mapSheet = () => once('m1map', () => ((S) => { const c0 = toImg(S.c); return { ...S, get c() { return best(c0); } }; })(daySheet({ ...ccOf(9, 47), z: 5.2, rot: -.05, tilt: .36 }, { seed: 17, lamp: [W * .7 + 90, -40], scale: 1.4 })));
const ROUTE = { from: [-3.7, 40.4], to: [19.9, 39.6] };   // Madrid → the coast of Corfu
function routePts(S) { const out = []; for (let i = 0; i <= 80; i++) { const q = i / 80, lon = mix(ROUTE.from[0], ROUTE.to[0], q), lat = mix(ROUTE.from[1], ROUTE.to[1], q) + Math.sin(q * Math.PI) * 6.5; out.push(S.PL(lon, lat).slice(0, 2)); } return out; }
function plane(ctx, x, y, ang, s) {
  ctx.save(); ctx.translate(x + 10 * s, y + 16 * s); ctx.rotate(ang); ctx.scale(s, s); ctx.fillStyle = 'rgba(20,12,8,.25)'; planeShape(ctx); ctx.fill(); ctx.restore();
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s); planeShape(ctx); ctx.fillStyle = '#f3ead6'; ctx.fill(); ctx.strokeStyle = '#2b2433'; ctx.lineWidth = 1.4; ctx.stroke();
  ctx.save(); planeShape(ctx); ctx.clip(); ctx.strokeStyle = 'rgba(43,36,51,.6)'; ctx.lineWidth = .8; for (let k = -30; k < 30; k += 3.2) { ctx.beginPath(); ctx.moveTo(k, -30); ctx.lineTo(k + 20, 30); ctx.stroke(); } ctx.restore();
  ctx.fillStyle = '#c87a2c'; ctx.beginPath(); ctx.arc(14, 0, 2.6, 0, TAU); ctx.fill(); ctx.restore();
}
function planeShape(ctx) { ctx.beginPath(); ctx.moveTo(26, 0); ctx.quadraticCurveTo(22, -3.6, 8, -3.6); ctx.lineTo(2, -26); ctx.lineTo(-4, -26); ctx.lineTo(-2, -3.6); ctx.lineTo(-16, -3.2); ctx.lineTo(-21, -11); ctx.lineTo(-25, -11); ctx.lineTo(-23, 0); ctx.lineTo(-25, 11); ctx.lineTo(-21, 11); ctx.lineTo(-16, 3.2); ctx.lineTo(-2, 3.6); ctx.lineTo(-4, 26); ctx.lineTo(2, 26); ctx.lineTo(8, 3.6); ctx.quadraticCurveTo(22, 3.6, 26, 0); ctx.closePath(); }
export function mapShot(ctx, t, K) {
  const S = mapSheet(), u = clamp((t - K.t0) / (K.out - K.t0));
  const land = eoX(clamp((t - K.t0) / .7));
  const view = { z: mix(1.02, 1.12, sm(u)), dx: mix(-260, 0, land) - 40 * u + drift(t, 4, 1), dy: drift(t, 3, 2) };
  ctx.fillStyle = '#0d0a0c'; ctx.fillRect(0, 0, W, H);
  drawDay(ctx, S, view);
  const R = routePts(S).map(([x, y]) => toView(S, view, x, y));
  const ru = qio(clamp((t - (K.t0 + .05)) / (K.arrive - K.t0 - .05)));
  ghostLine(ctx, R, { ghost: 1, u: ru, col: '#ffb35c', w: 9, dot: 13, a: .25, t, seed: 3 }); const G = ghostLine(ctx, R, { ghost: 1, u: ru, col: '#8e2f2a', w: 4, dot: 13, a: 1, t, seed: 3 });
  // the start: a small engraved ring where it left
  ring(ctx, R[0][0], R[0][1], 16, 16, { lines: 4, band: 6, wave: 10, col: '#8e2f2a', glow: null, op: 'source-over', a: .8, lw: .8 });
  // the plane at the tip of the route, banking along it
  const i = Math.max(1, Math.min(R.length - 1, Math.floor(ru * (R.length - 1)))), a0 = R[i - 1], a1 = R[i], ang = Math.atan2(a1[1] - a0[1], a1[0] - a0[0]);
  const tip = G && G.tip ? G.tip : a1;
  if (ru < .999) plane(ctx, tip[0], tip[1], ang, 2.6 * view.z);
  // the landing on the coast: engraved rings open, amber light in the middle (the carrier: the push goes in here)
  const arr = clamp((t - K.arrive) / .8);
  if (arr > 0) { const [ex, ey] = R[R.length - 1]; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gg = ctx.createRadialGradient(ex, ey, 0, ex, ey, 120); gg.addColorStop(0, `rgba(255,190,120,${.6 * sm(arr)})`); gg.addColorStop(1, 'rgba(255,190,120,0)'); ctx.fillStyle = gg; ctx.fillRect(ex - 120, ey - 120, 240, 240); ctx.restore();
    for (let k = 0; k < 2; k++) { const q = clamp(arr * 1.3 - k * .25); if (q > 0) ring(ctx, ex, ey, 18 + 70 * eoX(q), 18 + 70 * eoX(q), { lines: 4, band: 8, wave: 12, col: '#8e2f2a', glow: null, op: 'source-over', a: .8 * (1 - q * .6), lw: .9 }); }
    plane(ctx, ex + 6, ey - 6, -.2, 2.6 * view.z * (1 - .25 * eoX(arr))); }
  const vg = ctx.createRadialGradient(W * .55, H * .45, 420, W * .5, H * .5, 1250); vg.addColorStop(0, 'rgba(3,4,12,0)'); vg.addColorStop(1, 'rgba(3,4,12,.5)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  return { coast: R[R.length - 1] };
}
export function mapCoast(K, t) { const S = mapSheet(), u = clamp((t - K.t0) / (K.out - K.t0)), view = { z: mix(1.02, 1.12, sm(u)), dx: -40 * u + drift(t, 4, 1), dy: drift(t, 3, 2) }; const R = routePts(S); return toView(S, view, R[R.length - 1][0], R[R.length - 1][1]); }

// =====================================================================================================================
// 1.07 + 1.08 · the lake: dusk, two trees, the hammock, you in it. Days and nights flicker; you sit up; the wall rises.
// =====================================================================================================================
const LAKE = { hz: 560, shore: 800, slip: [760, 360] };
// time of day 0..1 → palette (0 dusk, .25 night, .5 dawn, .75 day, 1 dusk)
const TOD = [
  { top: '#1d1f45', mid: '#6a4f72', low: '#f0a070', hill: '#3a3456', hill2: '#24223e', water: '#4a3a5c', ground: '#121226', sun: 1 },
  { top: '#03040f', mid: '#0b1030', low: '#1e2448', hill: '#0e1128', hill2: '#080a1a', water: '#0c1028', ground: '#05060f', sun: 0 },
  { top: '#2a3058', mid: '#8a7090', low: '#ffc898', hill: '#4a4466', hill2: '#2e2a48', water: '#6a5878', ground: '#1a1830', sun: 1 },
  { top: '#4a6aa0', mid: '#8eb0d0', low: '#e8e0c8', hill: '#5a6a88', hill2: '#3a4664', water: '#6a88aa', ground: '#1e2436', sun: 1 },
];
function todPal(p) { p = ((p % 1) + 1) % 1; const f = p * 4, i = Math.floor(f) % 4, j = (i + 1) % 4, q = sm(f - Math.floor(f)), A = TOD[i], B = TOD[j], o = {}; for (const k of Object.keys(A)) o[k] = typeof A[k] === 'number' ? mix(A[k], B[k], q) : mixHex(A[k], B[k], q); return o; }
const HILLS = (() => { const n = vnoise(7), m = vnoise(9), a = [], b = []; for (let x = -200; x <= W + 200; x += 12) { a.push([x, LAKE.hz - 120 - 90 * fbm(n, x * .0025, 1, 4) - 40 * Math.sin(x * .002 + 1)]); b.push([x, LAKE.hz - 40 - 60 * fbm(m, x * .004, 3, 4)]); } return [a, b]; })();
const lakeFog = () => once('lakefog', () => { const [c, g] = canvas(W, H); const lg = g.createLinearGradient(0, LAKE.hz - 120, 0, LAKE.hz + 40); lg.addColorStop(0, 'rgba(255,230,210,0)'); lg.addColorStop(.7, 'rgba(255,230,210,.25)'); lg.addColorStop(1, 'rgba(255,230,210,0)'); g.fillStyle = lg; g.fillRect(0, LAKE.hz - 160, W, 220); stipple(c, { k: .8, g: 1.2, seed: 61 }); return c; });
const shorePts = (() => { const n = vnoise(13), p = []; for (let x = -300; x <= W + 300; x += 10) p.push([x, LAKE.shore - 16 * fbm(n, x * .006, 2, 3) - 30 * Math.exp(-(((x - 960) / 600) ** 2))]); return p; })();
// the paper wall: pale, engraved, rough top edge; it carries the slip
const wallTex = () => once('m1wall', () => {
  const ww = WALL.w, wh = WALL.h, [c, g] = canvas(ww, wh), n = vnoise(3), r = prng(12);
  const pg = g.createLinearGradient(0, 0, 0, wh); pg.addColorStop(0, '#efe7d3'); pg.addColorStop(1, '#d9ccad'); g.fillStyle = pg; g.fillRect(0, 0, ww, wh);
  // engraved horizontal lines that swell and bend a little (intaglio), stronger toward the bottom
  g.lineCap = 'round';
  for (let y = 6; y < wh; y += 5.2) { const tone = .18 + .5 * (y / wh) ** 1.6; g.strokeStyle = `rgba(40,52,78,${tone * .55})`; g.lineWidth = .5 + tone * 1.6; g.beginPath(); for (let x = 0; x <= ww; x += 30) { const yy = y + 3 * Math.sin(x * .004 + y * .02) + 2 * (fbm(n, x * .002, y * .01, 2) - .5); x ? g.lineTo(x, yy) : g.moveTo(x, yy); } g.stroke(); }
  // a huge faint guilloche watermark
  rosette(g, 2620, 1080, { R: 620, A: 80, B: 40, n: 40, m: 13, lines: 80, col: '#8a7a5a', w: .7, a: .12 });
  for (let i = 0; i < 12000; i++) { const x = r() * ww, y = r() * wh, L = 3 + r() * 14, a0 = r() * TAU; g.strokeStyle = r() < .5 ? `rgba(255,252,240,${.2 + r() * .3})` : `rgba(110,90,60,${.06 + r() * .12})`; g.lineWidth = .6; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a0) * L, y + Math.sin(a0) * L); g.stroke(); }
  stipple(c, { k: .25, g: 1, seed: 6, mid: false, boost: 1 });
  return c;
});
const WALL = { w: 5200, h: 2200, slip: [2000, 1000], lake: .42, top: -60 };
// draw the wall with its top edge at screen y top, the slip pinned on it (slip centre in wall px), in the current transform
function drawWall(ctx, t, x0, top, s, o = {}) {
  ctx.save(); ctx.translate(x0, top); ctx.scale(s, s);
  // rough torn top edge
  const n = vnoise(21); ctx.beginPath(); ctx.moveTo(0, 30); for (let x = 0; x <= WALL.w; x += 14) ctx.lineTo(x, 10 + 14 * fbm(n, x * .01, 1, 3)); ctx.lineTo(WALL.w, WALL.h); ctx.lineTo(0, WALL.h); ctx.closePath();
  ctx.save(); ctx.clip(); ctx.drawImage(wallTex(), 0, 0);
  // light: the slip glows on it; cool falloff toward the edges
  const [px, py] = o.slip || [WALL.w * .3, WALL.h * .35];
  { const rg = ctx.createRadialGradient(px, py, 0, px, py, 1500); rg.addColorStop(0, 'rgba(255,200,140,.0)'); rg.addColorStop(.5, 'rgba(30,34,70,.25)'); rg.addColorStop(1, 'rgba(12,14,40,.6)'); ctx.fillStyle = rg; ctx.fillRect(0, 0, WALL.w, WALL.h); }
  if (o.shade) { ctx.fillStyle = `rgba(14,16,40,${o.shade})`; ctx.fillRect(0, 0, WALL.w, WALL.h); }
  { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g2 = ctx.createRadialGradient(px, py, 0, px, py, 700); const br = .85 + .15 * Math.sin(t * 2.1); g2.addColorStop(0, `rgba(255,190,120,${.42 * br})`); g2.addColorStop(.35, `rgba(255,170,100,${.12 * br})`); g2.addColorStop(1, 'rgba(255,170,100,0)'); ctx.fillStyle = g2; ctx.fillRect(px - 700, py - 700, 1400, 1400); ctx.restore(); }
  pinnedSlip(ctx, t, px, py, 1, o.slipA ?? 1);
  if (o.after) o.after(ctx);
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,230,200,.35)'; ctx.lineWidth = 2 / s; ctx.beginPath(); for (let x = 0; x <= WALL.w; x += 14) { const y = 10 + 14 * fbm(n, x * .01, 1, 3); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
  ctx.restore();
}
// the slip pinned on the wall (wall px; slip at .5 scale = 650 wide): hangs from a brass pin, sways a hair, a shadow behind
function pinnedSlip(ctx, t, x, y, s, a) {
  if (a <= 0) return; const sw = SLIP.w * .5 * s, sh = SLIP.h * .5 * s, rot = -.035 + .006 * Math.sin(t * 1.3);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y - sh / 2 + 16 * s); ctx.rotate(rot);
  ctx.save(); ctx.translate(14 * s, 18 * s); ctx.fillStyle = 'rgba(20,16,30,.35)'; ctx.filter = 'none'; ctx.beginPath(); ctx.roundRect(-sw / 2, -16 * s, sw, sh, 6); ctx.fill(); ctx.restore();
  ctx.drawImage(slipTex(.5, { sealed: true }), -sw / 2, -16 * s, sw, sh);
  // its foil still glows (the money is fine)
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gx = (780 - 650) * .5 * s, gy = -16 * s + 300 * .5 * s, br = .8 + .2 * Math.sin(t * 2.1); const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, 260 * s); g.addColorStop(0, `rgba(255,200,130,${.28 * br})`); g.addColorStop(1, 'rgba(255,200,130,0)'); ctx.fillStyle = g; ctx.fillRect(gx - 260 * s, gy - 260 * s, 520 * s, 520 * s); ctx.restore();
  // brass pin
  const pg = ctx.createRadialGradient(-4 * s, -6 * s, 0, 0, 0, 16 * s); pg.addColorStop(0, '#fff0c8'); pg.addColorStop(.5, '#c8902e'); pg.addColorStop(1, '#5a3a10'); ctx.fillStyle = 'rgba(10,8,20,.4)'; ctx.beginPath(); ctx.arc(8 * s, 10 * s, 14 * s, 0, TAU); ctx.fill(); ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(0, 0, 14 * s, 0, TAU); ctx.fill();
  ctx.restore();
}
// you in the hammock (side view, no face): lying (sit 0) → sitting up (sit 1); x,y = hip on the cloth, s = scale
function hammockYou(ctx, x, y, s, t, sit, light) {
  const br = Math.sin(t * Math.PI * 2 / 4.6) * .8, coat = '#3a4266', pants = '#181a2c', skin = '#7a5038', hair = '#141019';
  const cap = (x1, y1, r1, x2, y2, r2) => { const a = Math.atan2(y2 - y1, x2 - x1), d = Math.hypot(x2 - x1, y2 - y1), k = Math.asin(clamp((r1 - r2) / (d || 1), -1, 1)); ctx.beginPath(); ctx.arc(x1, y1, r1, a + Math.PI / 2 + k, a + 3 * Math.PI / 2 - k); ctx.arc(x2, y2, r2, a - Math.PI / 2 - k, a + Math.PI / 2 + k); ctx.closePath(); ctx.fill(); };
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // legs along the cloth to the right, one knee up a little
  ctx.fillStyle = pants; cap(0, 0, 13, 52, -10 - 8 * sit, 11); cap(52, -10 - 8 * sit, 11, 104, -2, 9); cap(0, 2, 12, 100, 6, 9);
  ctx.fillStyle = '#0c0c14'; cap(104, -2, 8, 116, -6, 7); cap(100, 6, 8, 112, 4, 7);
  // torso: lying to the left → up; the head beyond the shoulders
  const ang = mix(Math.PI + .12, Math.PI * 1.5 - .22, eio(sit)), L = 62, sx = Math.cos(ang) * L, sy = Math.sin(ang) * L + br * (1 - sit);
  ctx.fillStyle = coat; cap(0, -4, 17, sx, sy, 19);
  // the near arm: resting on the belly while lying, then on the hammock's edge
  const ex = mix(sx * .55 + 6, 22, sit), ey = mix(sy * .55 - 14, -6, sit);
  ctx.fillStyle = mixHex(coat, '#000000', .1); cap(sx * .9, sy * .9, 9, ex, ey, 7); ctx.fillStyle = skin; cap(ex, ey, 6, ex + mix(8, 10, sit), ey + mix(4, 10, sit), 5);
  ctx.fillStyle = '#c8843a'; cap(sx * .95, sy * .95, 13, sx * .8 + 2, sy * .8 + 6, 9);   // the ochre scarf
  const hx = sx + Math.cos(ang) * 22, hy = sy + Math.sin(ang) * 22; ctx.fillStyle = mixHex(skin, '#000000', .35); ctx.beginPath(); ctx.ellipse(hx, hy, 16, 18, ang, 0, TAU); ctx.fill();
  ctx.fillStyle = hair; ctx.beginPath(); ctx.ellipse(hx + Math.cos(ang) * 3 - 2, hy + Math.sin(ang) * 3 - 4, 16, 15, ang, 0, TAU); ctx.fill();
  // rim light from the low sun on the upper edges
  if (light > 0) { ctx.strokeStyle = rgba('#ffd6a0', .55 * light); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -17); ctx.lineTo(sx + Math.cos(ang - Math.PI / 2) * 19, sy + Math.sin(ang - Math.PI / 2) * 19); ctx.stroke(); ctx.beginPath(); ctx.arc(hx, hy - 2, 16, -2.6, -.6); ctx.stroke(); }
  ctx.restore();
}
const TS = { w: 700, h: 760, ox: 350, oy: 700, res: 2 };
function treeSprite(sd, sc, ti) { return once(`m1tree${sd}_${ti}`, () => { const res = ti === 0 ? TS.res : 1, [c, g] = canvas(TS.w * res, TS.h * res); g.scale(res, res);   /* tone -1 (bucket 0) is the one the push zooms into */ tree(g, TS.ox, TS.oy, sc, 0, { seed: sd, lightDir: [.7, -.6], wind: 1, leafTone: ti / 2 - 1 }); return c; }); }
export function warmTrees() { for (const [sd, sc] of [[5, 1.05], [9, .95]]) for (let i = 0; i < 5; i++) treeSprite(sd, sc, i); }
const TB = []; function treeBuf() { if (!TB.length) TB.push(canvas()); const [c, g] = TB[0]; g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, W, H); return [c, g]; }
export function lakeTake(ctx, t, K) {
  // time: dusk at rest; from "But a few months in" the days and nights flicker (≈ 4 days), settling at a grey dusk by "wall"
  const fl = clamp((t - (K.but - .1)) / (K.wall - .2 - (K.but - .1))), cycles = 4;
  const p = fl <= 0 ? 0 : (eio(fl) * cycles) % 1 + (fl >= 1 ? 0 : 0), pal = todPal(fl >= 1 ? 0 : p);
  const sit = eio(clamp((t - (K.months - .1)) / 1.0));
  const wallU = clamp((t - (K.wall - .12)) / .55), wallE = eoX(wallU) + .03 * Math.sin(clamp((t - K.wall - .4) / .4) * Math.PI) * (t > K.wall + .4);
  // camera: a slow drift right over the lake; after the wall, a push in toward the slip pinned on it
  const pushU = qio(clamp((t - (K.wall + .45)) / (K.out + .3 - (K.wall + .45))));
  const zo = mix(1, 2.38, pushU), fx = LAKE.slip[0], fy = LAKE.slip[1];
  const camx = (t - K.t0) * 6 + drift(t, 5, 1), camy = drift(t, 3, 2);
  const tf = (p0) => { ctx.translate(mix(W / 2, 700, pushU), mix(H / 2, 520, pushU)); ctx.scale(zo * (1 + (p0 - 1) * .3 * pushU), zo * (1 + (p0 - 1) * .3 * pushU)); ctx.translate(-mix(W / 2, fx, pushU) - camx * p0, -mix(H / 2, fy, pushU) - camy * p0); };
  ctx.save(); tf(.3);
  // sky
  const sky = ctx.createLinearGradient(0, -200, 0, LAKE.hz + 40); sky.addColorStop(0, pal.top); sky.addColorStop(.6, pal.mid); sky.addColorStop(1, pal.low); ctx.fillStyle = sky; ctx.fillRect(-600, -400, W + 1200, LAKE.hz + 440);
  // stars at night
  const night = 1 - pal.sun; if (night > .02) { const r = prng(4); for (let i = 0; i < 200; i++) { ctx.fillStyle = `rgba(230,236,255,${night * (.2 + .6 * r())})`; ctx.fillRect(r() * (W + 800) - 400, r() * (LAKE.hz - 100) - 200, 1.6, 1.6); } }
  // sun and moon on arcs (each cycle the sun crosses, then the moon)
  const sunPhase = fl > 0 && fl < 1 ? p : 0, sa = sunPhase < .25 ? null : (sunPhase - .25) / .75;
  const sunAt = (q) => [mix(-100, W + 100, q), LAKE.hz + 40 - Math.sin(q * Math.PI) * 420];
  let SUN = fl <= 0 || fl >= 1 ? [1320 + 10 * (t - K.t0), LAKE.hz - 50 + 4 * (t - K.t0)] : sa != null ? sunAt(sa) : null;
  if (SUN) { putBloom(ctx, sunBloom(), SUN[0], SUN[1], .8, .9 * pal.sun + .2); ctx.fillStyle = 'rgba(255,246,226,.9)'; ctx.beginPath(); ctx.arc(SUN[0], SUN[1], 22, 0, TAU); ctx.fill(); }
  if (fl > 0 && fl < 1 && sunPhase < .3) { const q = sunPhase / .3, [mx, my] = sunAt(q); ctx.fillStyle = 'rgba(230,236,255,.9)'; ctx.beginPath(); ctx.arc(mx, my, 16, 0, TAU); ctx.fill(); ctx.fillStyle = pal.top; ctx.beginPath(); ctx.arc(mx + 7, my - 4, 14, 0, TAU); ctx.fill(); }
  ctx.restore();
  // hills (two planes) and the haze
  ctx.save(); tf(.45); poly(ctx, [...HILLS[0], [W + 200, LAKE.hz + 10], [-200, LAKE.hz + 10]]); ctx.fillStyle = pal.hill; ctx.fill(); ctx.restore();
  ctx.save(); tf(.6); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .7 * pal.sun + .1; ctx.drawImage(lakeFog(), -100, 0); ctx.restore();
  ctx.save(); tf(.6); poly(ctx, [...HILLS[1], [W + 200, LAKE.hz + 10], [-200, LAKE.hz + 10]]); ctx.fillStyle = pal.hill2; ctx.fill(); ctx.restore();
  // the water: sky colours mirrored, engraved ripple strokes, the sun's glitter path
  ctx.save(); tf(.8);
  const wg = ctx.createLinearGradient(0, LAKE.hz, 0, LAKE.shore); wg.addColorStop(0, pal.low); wg.addColorStop(.25, pal.water); wg.addColorStop(1, mixHex(pal.water, '#000000', .55)); ctx.fillStyle = wg; ctx.fillRect(-500, LAKE.hz, W + 1000, LAKE.shore - LAKE.hz + 60);
  { const r = prng(9); ctx.lineCap = 'round'; for (let i = 0; i < 260; i++) { const yq = r(), y = LAKE.hz + 4 + Math.pow(yq, 1.7) * (LAKE.shore - LAKE.hz), x = r() * (W + 600) - 300 + Math.sin(t * .8 + i) * 8 * (1 + yq * 3), L = (20 + r() * 70) * (.4 + yq * 1.5); const near = SUN && Math.abs(x - SUN[0]) < 90 + yq * 160; ctx.strokeStyle = near ? `rgba(255,220,170,${(.35 + .4 * r()) * pal.sun})` : `rgba(230,220,240,${.06 + .1 * r()})`; ctx.lineWidth = .8 + yq * 1.4; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + L, y); ctx.stroke(); } }
  ctx.restore();
  // the wall: rises out of the lake in the middle distance, fills the sky (it carries the slip)
  const wallTop = mix(LAKE.shore + 40, WALL.top, wallE);
  if (wallU > 0) {
    ctx.save(); tf(.85);
    ctx.beginPath(); ctx.rect(-600, -600, W + 1200, LAKE.shore + 610); ctx.clip();
    const s = WALL.lake, x0 = LAKE.slip[0] - WALL.slip[0] * s;
    drawWall(ctx, t, x0, wallTop, s, { slip: WALL.slip, shade: .15 * (1 - pushU) });
    // spray of the lake at its foot while it rises
    const sp2 = clamp(1 - wallU * 1.4); if (sp2 > 0) { const r = prng(3); ctx.fillStyle = `rgba(240,236,230,${.5 * sp2})`; for (let i = 0; i < 120; i++) { const x = r() * W, h = r() * 90 * (1 - sp2 * .3); ctx.fillRect(x, LAKE.shore - 10 - h * wallU * 2, 2, 2); } }
    ctx.restore();
  }
  // the shore, the trees, the hammock and you (near plane)
  ctx.save(); tf(1.15);
  poly(ctx, [...shorePts, [W + 300, H + 300], [-300, H + 300]]); ctx.fillStyle = pal.ground; ctx.fill();
  { const r = prng(2); ctx.strokeStyle = mixHex(pal.ground, '#8a9a8a', .25); ctx.lineWidth = 1.6; ctx.lineCap = 'round'; for (let i = 0; i < 160; i++) { const x = r() * (W + 400) - 200, y = LAKE.shore + 10 + r() * 300, L = 14 + r() * 30, a = -Math.PI / 2 + (r() - .5) * .6 + Math.sin(t * 1.5 + x * .01) * .12; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + Math.cos(a) * L * .5 + 4, y + Math.sin(a) * L * .5, x + Math.cos(a) * L, y + Math.sin(a) * L); ctx.stroke(); } }
  const T1 = [610, LAKE.shore + 70], T2 = [1330, LAKE.shore + 60], season = fl > 0 ? Math.sin(fl * Math.PI * 1.5) : 0;
  { const [bc, bg] = treeBuf(); bg.setTransform(ctx.getTransform()); const wind = 1 + 2 * (fl > 0 && fl < 1) * Math.sin(fl * Math.PI), tq = (clamp(season, -1, 1) + 1) * 2, ti = Math.min(3, Math.floor(tq)), tfr = tq - ti;
    for (const [tx, ty, sd, sc] of [[T1[0], T1[1], 5, 1.05], [T2[0], T2[1], 9, .95]]) {   // cached tree sprites (tone buckets cross-faded), swaying from the root
      const sk = wind * (.011 * Math.sin(t * .9 + sd) + .004 * Math.sin(t * 2.3 + sd * 2));
      bg.save(); bg.translate(tx, ty); bg.transform(1, 0, sk, 1, 0, 0);
      bg.drawImage(treeSprite(sd, sc, ti), -TS.ox, -TS.oy, TS.w, TS.h); if (tfr > .01) { bg.globalAlpha = tfr; bg.drawImage(treeSprite(sd, sc, ti + 1), -TS.ox, -TS.oy, TS.w, TS.h); }
      bg.restore(); }
    bg.setTransform(1, 0, 0, 1, 0, 0); bg.globalCompositeOperation = 'source-atop'; bg.fillStyle = rgba(mixHex(pal.ground, '#3a3050', .3), .72 - .2 * pal.sun * 0); bg.fillRect(0, 0, W, H);
    if (SUN) { const rg = bg.createLinearGradient(SUN[0] > 960 ? W : 0, 0, SUN[0] > 960 ? 0 : W, 0); rg.addColorStop(0, rgba('#ffb070', .28 * pal.sun)); rg.addColorStop(.6, 'rgba(255,176,112,0)'); bg.globalCompositeOperation = 'source-atop'; bg.fillStyle = rg; bg.fillRect(0, 0, W, H); }
    bg.globalCompositeOperation = 'source-over'; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(bc, 0, 0); ctx.restore(); }
  // hammock: two ropes, a sagging cloth with stripes, you in it
  const a1 = [T1[0] + 14, T1[1] - 190], a2 = [T2[0] - 14, T2[1] - 185], sag = 120 + 6 * Math.sin(t * .9), sway = Math.sin(t * .8) * 6;
  const hp = (q) => [mix(a1[0] + 70, a2[0] - 70, q) + sway * Math.sin(q * Math.PI), mix(a1[1] + 30, a2[1] + 30, q) + Math.sin(q * Math.PI) * sag];
  ctx.strokeStyle = '#a89470'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...a1); ctx.lineTo(...hp(0)); ctx.moveTo(...a2); ctx.lineTo(...hp(1)); ctx.stroke();
  const hipQ = .42, [hx, hy] = hp(hipQ);
  hammockYou(ctx, hx, hy - 18, 1.35, t, sit, pal.sun);
  // the cloth in front of the body
  ctx.beginPath(); for (let i = 0; i <= 30; i++) { const [x, y] = hp(i / 30); i ? ctx.lineTo(x, y + 6) : ctx.moveTo(x, y + 6); } for (let i = 30; i >= 0; i--) { const [x, y] = hp(i / 30); ctx.lineTo(x, y - 26 * Math.sin(i / 30 * Math.PI)); } ctx.closePath();
  ctx.fillStyle = '#7a4a3a'; ctx.fill(); ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(240,210,160,.45)'; ctx.lineWidth = 5; for (let k = 0; k < 6; k++) { ctx.beginPath(); for (let i = 0; i <= 30; i++) { const [x, y] = hp(i / 30); const yy = y - 4 - k * 4.5 * Math.sin(i / 30 * Math.PI); i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } ctx.stroke(); } ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(0, 0, W * 2, H * 2); ctx.restore();
  if (pal.sun > .1) { ctx.strokeStyle = rgba('#ffd6a0', .5 * pal.sun); ctx.lineWidth = 1.5; ctx.beginPath(); for (let i = 0; i <= 30; i++) { const [x, y] = hp(i / 30); const yy = y - 26 * Math.sin(i / 30 * Math.PI); i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } ctx.stroke(); }
  ctx.restore();
  // fireflies / motes over the water at dusk
  motes(ctx, t, 980, 700, 600, .35 * pal.sun * (1 - wallE));
  const vg = ctx.createRadialGradient(W * .5, H * .45, 420, W * .5, H * .5, 1250); vg.addColorStop(0, 'rgba(3,4,12,0)'); vg.addColorStop(1, 'rgba(3,4,12,.5)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
}

// =====================================================================================================================
// 1.09 · the wall up close: the slip pinned on it, still glowing; a guilloche "?" engraves itself beside it
// =====================================================================================================================
// the question mark's centre line (in its own units, about 300 × 560), hook then stem
const QM = (() => { const out = []; for (let i = 0; i <= 120; i++) { const q = i / 120, a = mix(Math.PI * 1.08, Math.PI * 2.5, q), r = 118; out.push([Math.cos(a) * r, -200 + Math.sin(a) * r * 1.02]); } const e = out[out.length - 1]; for (let i = 1; i <= 40; i++) { const q = i / 40; out.push([mix(e[0], 0, sm(q)), mix(e[1], 50, q)]); } return out; })();
function qmLines() { return once('qmlines', () => { const L = []; const d = [0]; for (let i = 1; i < QM.length; i++) d.push(d[i - 1] + Math.hypot(QM[i][0] - QM[i - 1][0], QM[i][1] - QM[i - 1][1]));
  for (let k = 0; k < 9; k++) { const pts = []; for (let i = 0; i < QM.length; i++) { const a = QM[Math.max(0, i - 1)], b = QM[Math.min(QM.length - 1, i + 1)], tx = b[0] - a[0], ty = b[1] - a[1], m = Math.hypot(tx, ty) || 1, nx = -ty / m, ny = tx / m, off = (k - 4) * 4.2 + 9 * Math.sin(d[i] * .045 + k * .7) * Math.sin(Math.min(1, d[i] / 60) * Math.PI / 2); pts.push([QM[i][0] + nx * off, QM[i][1] + ny * off]); } L.push(pts); } return L; }); }
// wallShot's camera: wall px (X, Y) → screen (ox + k·X, oy + k·Y). The lake take (lib/m1x_c01_lake.mjs) flies its camera onto exactly this.
export function wallFrame(t, K) {
  const u = clamp((t - K.t0) / (K.end - K.t0)), z = 1 + .035 * sm(u), dx = drift(t, 6, 1) - 20 * u, dy = drift(t, 4, 2), sp = WALL.slip;
  return { k: z, ox: W / 2 + dx + z * (700 - sp[0] - W / 2), oy: H / 2 + dy + z * (520 - sp[1] - H / 2) };   // the slip sits at (700, 520)
}
export const WALL_DIM = { w: 5200, h: 2200, slip: [2000, 1000] };
// the wall with the slip and the engraving "?" in wall px under the current transform (o.shade: darken, o.clipY: wall px below it hidden)
export function wallPaint(ctx, t, K, o = {}) { wallBody(ctx, t, K, 0, 0, 1, o); }
export function wallVignette(ctx, cx = W * .5, cy = H * .5, r0 = 380, r1 = 1200, a = .42) {
  const vg = ctx.createRadialGradient(cx, cy, r0, W * .5, H * .5, r1); vg.addColorStop(0, 'rgba(3,4,12,0)'); vg.addColorStop(1, `rgba(3,4,12,${a})`); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
}
export function wallShot(ctx, t, K) {
  const F = wallFrame(t, K);
  ctx.save(); ctx.translate(F.ox, F.oy); ctx.scale(F.k, F.k); wallPaint(ctx, t, K); ctx.restore();
  wallVignette(ctx);
}
function wallBody(ctx, t, K, x0, top, s, o = {}) {
  const sp = WALL.slip;
  const qu = qio(clamp((t - (K.reason - .1)) / (K.guess - .05 - (K.reason - .1)))), dotU = clamp((t - (K.guess + .02)) / .35);
  drawWall(ctx, t, x0, top, s, { slip: sp, shade: o.shade, after: qu <= 0 ? null : (g) => {
    // the "?" engraved in the wall's own ink, beside the slip (wall px)
    const qx = sp[0] + 820, qy = sp[1] - 10, Ls = qmLines();
    g.save(); g.translate(qx, qy); g.scale(1.18, 1.18);
    Ls.forEach((pts, k) => ghostLine(g, pts, { ghost: 0, burin: k === 4 ? clamp(qu * 1.06 - .03) : null, u: clamp(qu * 1.08 - k * .01), col: '#28405a', w: 2.1, a: .95, t, seed: k + 1, glow: k % 3 === 0 ? '#ffb35c' : null }));
    // the dot: a small engraved rosette landing on "guess"
    if (dotU > 0) { const e = eoX(dotU), sc = mix(2.2, 1, e); g.save(); g.globalAlpha = clamp(dotU * 3); g.translate(0, 150); g.scale(sc, sc); rosette(g, 0, 0, { R: 34, A: 10, B: 5, n: 14, m: 5, lines: 22, col: '#28405a', w: .9, a: .95, rot: t * .2 }); g.restore();
      if (dotU < 1) { g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = `rgba(255,200,140,${.5 * (1 - dotU)})`; g.lineWidth = 2; g.beginPath(); g.arc(0, 150, 40 + 90 * eoX(dotU), 0, TAU); g.stroke(); g.restore(); } }
    g.restore();
  } });
}
