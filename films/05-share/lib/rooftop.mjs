// Rooftop set, owner C1 (H.04, H.05, H.10); also used by C6 (3.14–3.16) and C10 (7.02a, 7.07–7.10). First real version by C1.
// rooftop(ctx, t, { state = 'blue' | 'night' | 'dawn', dawn = 0..1 (sunrise progress in 'dawn'), cam = { x: 0, y: 0, z: 1 } (lateral glide px,
//   vertical px, zoom), seats = 0 | 1 | 2 }) draws the whole frame: sky, skyline in 4 parallax planes with fog bands, roof, parapet, water tanks,
//   antennas (template: ref/k0 hookRooftop). Figures are drawn by the caller at the returned anchors.
//   → { horizon, parapet: { y, x0, x1 }, seats: [{ x, y, s }] (feet point + figure scale), light: { x, y, col } (key light) }
// The owner may add options; the signature and the anchors stay.
//
// Added options (C1):
//   cam.fx, cam.fy        the screen point that stays put while zooming (default 960, 540); near planes zoom more than far ones (dolly)
//   onSky(ctx, A)         drawn right after the sky (behind every building): the rising rosette, a sun, a light (screen space)
//   onCity(ctx, A)        drawn after the far + mid city and their fog (before the near towers): light cones, rings over the city
//   parapetY 650          parapet top in set px (cam 0, z 1); the deck runs from its foot (parapetY + 70) to the bottom
//   deck true             draw the roof deck (gravel, last night's rain: a puddle that mirrors the key light)
//   glowA 1               strength of the key light's glow on the far skyline (blue/dawn) or the sodium glow (night)
//   windows 1             multiplier for lit windows (night defaults to more)
// Extra anchors (C1): map(p) → (X, Y) → [sx, sy] (set px of a plane with parallax p → screen), k(p) → zoom of that plane,
//   deckY (screen y of the parapet foot), seatsSide: seats[i].side (+1 = she faces left, -1 = faces right), seats[i].hip [x, y] (hip on the
//   parapet top, for POSES.sit), seats[i].knee (where a napkin sits).
// Sitting figures: use figure(ctx, seat.hip[0], seat.hip[1], seat.s, POSES.sit, { flip: seat.side < 0, … }) from figure.mjs, or
//   rooftopFriends(ctx, t, A, o) below (the two friends of H.10 / 3.14–3.16, you in the ochre scarf, she in petrol).
import { W, H, rgba, clamp, mix, prng, canvas, sm, eio } from '../engine.mjs';
import { stipple, fog as artFog, vnoise, fbm, hatch as artHatch } from './art.mjs';
import { cityLayer, skyGradient } from './city.mjs';

const CACHE = new Map(); const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const PAD = 360;                       // layers are W + 2·PAD wide so the camera can glide
const LW = W + 2 * PAD;
export const ROOF = { horizon: 520, parapetY: 650, light: { x: 1260, y: 470 } };

// ---------- palettes per state ----------
const PAL = {
  blue: { top: '#0a1134', mid: '#1b2b5c', low: '#5d78a6', warm: '#f2cfa6', warmA: .5, far: ['#3d5584', '#364d7c'], farHaze: '#8aa2c8', mid2: ['#1f2d54', '#27375f'], midHaze: '#56709e',
    near: '#121a35', rim: '#ffe6c4', fog1: '#a8bcd8', fog2: '#6f88b8', deck: ['#141a30', '#070a16'], par: '#0b1024', parTop: '#4a5677', stars: 70, win: .08, winM: .13 },
  night: { top: '#05071a', mid: '#0d1230', low: '#2b2a4a', warm: '#ff9a3c', warmA: .28, far: ['#1c2346', '#1a2142'], farHaze: '#c86a3a', mid2: ['#121834', '#161c3a'], midHaze: '#b0582c',
    near: '#0a0e22', rim: '#ffb070', fog1: '#c27a4a', fog2: '#8a5a50', deck: ['#100f22', '#06060f'], par: '#0a0b1c', parTop: '#3a3550', stars: 140, win: .16, winM: .2 },
  dawn: { top: '#1d2a44', mid: '#6a5a7a', low: '#ffcf8a', warm: '#ffd08a', warmA: .75, far: ['#6a6488', '#625c80'], farHaze: '#f6c08a', mid2: ['#3a3a60', '#423f66'], midHaze: '#c69078',
    near: '#2a2440', rim: '#ffe2a8', fog1: '#ffd9b0', fog2: '#d8a890', deck: ['#2a2238', '#120f1c'], par: '#1e1a30', parTop: '#8a7a8a', stars: 0, win: .04, winM: .05 },
};

function sky(st) {
  const P = PAL[st], L = ROOF.light;
  return skyGradient({ key: 'rt-sky-' + st, w: LW, top: P.top, mid: P.mid, low: P.low, horizon: ROOF.horizon + 140, warm: { x: L.x + PAD, y: st === 'night' ? H + 200 : ROOF.horizon + 60, r: st === 'night' ? 1300 : 1100, col: P.warm, a: P.warmA }, stars: P.stars, seed: 12, strands: st === 'night' ? 1 : 3 });
}
function farCity(st) {
  const P = PAL[st], L = ROOF.light;
  return cityLayer({ key: 'rt-far-' + st, seed: 21, w: LW, ground: ROOF.horizon + 90, hMin: 30, hMax: 150, wMin: 16, wMax: 58, col: P.far[0], col2: P.far[1], haze: P.farHaze, hazeH: 110, hazeA: st === 'night' ? .9 : .8,
    win: { p: P.win, size: [1.6, 2.2], gap: [4, 5.5], a: .7, warm: st === 'night' ? .9 : .7 }, rim: { x: L.x + PAD, y: st === 'night' ? H + 300 : L.y, col: P.rim, a: st === 'night' ? .35 : .65, reach: 620 }, antennas: .14, tanks: .05 });
}
function midCity(st) {
  const P = PAL[st], L = ROOF.light;
  return cityLayer({ key: 'rt-mid-' + st, seed: 33, w: LW, ground: ROOF.parapetY + 60, hMin: 60, hMax: 250, wMin: 40, wMax: 120, col: P.mid2[0], col2: P.mid2[1], haze: P.midHaze, hazeH: 150, hazeA: st === 'night' ? .95 : .8,
    win: { p: P.winM, size: [2.6, 3.4], gap: [7, 9], warm: st === 'night' ? .92 : .75 }, rim: { x: L.x + PAD, y: st === 'night' ? H + 300 : L.y, col: P.rim, a: st === 'night' ? .45 : .7, reach: 1000 }, hatch: .5, tanks: .16, antennas: .14 });
}
function fogBand(st, k, y0, y1, a, seed) {
  const P = PAL[st];
  return once(`rt-fog${k}-${st}`, () => { const [c, g] = canvas(LW, H); const [tc, tx] = canvas(W, H); artFog(tx, { y0, y1, col: k === 1 ? P.fog1 : P.fog2, a, seed, sx: .0022, sy: .012, cover: .6, soft: .35, k: .55 }); g.drawImage(tc, 0, 0); g.save(); g.translate(LW, 0); g.scale(-1, 1); g.globalAlpha = .9; g.drawImage(tc, 0, 0); g.restore(); g.drawImage(tc, PAD * 2, 0); return c; });
}
// near towers left and right (the frame's dark edges), a water tank on stilts and antennas on the right one
function nearTowers(st) {
  const P = PAL[st], L = ROOF.light;
  return once('rt-near-' + st, () => {
    const [c, g] = canvas(LW, H), r = prng(5);
    const tower = (x0, x1, top, col, rimSide) => {
      g.fillStyle = col; g.fillRect(x0, top, x1 - x0, H - top);
      g.save(); g.beginPath(); g.rect(x0, top, x1 - x0, H - top); g.clip();
      for (let y = top + 24; y < H; y += 28) for (let x = x0 + 12; x < x1 - 14; x += 23) { const on = r() < (st === 'night' ? .22 : .14); g.fillStyle = on ? (r() < .75 ? `rgba(255,${200 + (r() * 30 | 0)},140,${.45 + r() * .4})` : `rgba(200,220,255,${.35 + r() * .3})`) : 'rgba(6,8,20,.55)'; g.fillRect(x, y, 9, 14); }
      g.strokeStyle = 'rgba(3,4,12,.35)'; g.lineWidth = .8; g.beginPath(); for (let x = x0; x < x1; x += 3.2) { g.moveTo(x, top); g.lineTo(x + (r() - .5) * 2, H); } g.stroke();
      const lg = g.createLinearGradient(0, top, 0, H); lg.addColorStop(0, 'rgba(255,226,190,0)'); lg.addColorStop(1, 'rgba(4,5,14,.6)'); g.fillStyle = lg; g.fillRect(x0, top, x1 - x0, H - top);
      g.restore();
      const ex = rimSide > 0 ? x1 : x0, rg = g.createLinearGradient(0, top, 0, top + 520); rg.addColorStop(0, rgba(P.rim, st === 'night' ? .35 : .75)); rg.addColorStop(1, rgba(P.rim, 0)); g.fillStyle = rg; g.fillRect(ex - (rimSide > 0 ? 2 : 0), top, 2, 520);
      g.fillStyle = rgba(P.rim, st === 'night' ? .25 : .5); g.fillRect(x0, top, x1 - x0, 1.5);
    };
    tower(-10, PAD + 70, 60, P.near, 1); g.fillStyle = P.near; g.fillRect(PAD + 70, 330, 50, H - 330); g.fillStyle = rgba(P.rim, .35); g.fillRect(PAD + 118, 330, 2, 260);
    tower(PAD + W - 150, LW + 10, 400, mixHex(P.near, '#000000', -.08), -1);
    // water tank on stilts (cedar staves, conical lid), rimmed toward the light
    const tx = PAD + W - 70, ty = 300;
    g.fillStyle = mixHex(P.near, '#000000', .2);
    for (const dx of [-30, -4, 22]) g.fillRect(tx + dx, ty + 58, 4, 44);
    g.fillRect(tx - 36, ty + 96, 66, 4); g.beginPath(); g.moveTo(tx - 32, ty + 70); g.lineTo(tx + 28, ty + 96); g.lineTo(tx + 24, ty + 99); g.lineTo(tx - 34, ty + 74); g.fill();
    g.fillStyle = mixHex(P.near, '#000000', .05); g.beginPath(); g.ellipse(tx - 3, ty + 58, 40, 7, 0, 0, Math.PI); g.lineTo(tx - 43, ty); g.lineTo(tx + 37, ty); g.closePath(); g.fill();
    g.fillRect(tx - 43, ty, 80, 58);
    g.beginPath(); g.moveTo(tx - 48, ty + 2); g.lineTo(tx - 3, ty - 34); g.lineTo(tx + 42, ty + 2); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = 1; for (let k = 0; k < 9; k++) { g.beginPath(); g.moveTo(tx - 40 + k * 9.5, ty); g.lineTo(tx - 40 + k * 9.5, ty + 58); g.stroke(); }
    for (const hy of [ty + 12, ty + 30, ty + 48]) { g.strokeStyle = rgba(P.rim, .22); g.beginPath(); g.moveTo(tx - 43, hy); g.lineTo(tx + 37, hy); g.stroke(); }
    g.fillStyle = rgba(P.rim, .6); g.fillRect(tx - 43, ty, 2, 58); g.beginPath(); g.moveTo(tx - 48, ty + 2); g.lineTo(tx - 3, ty - 34); g.lineTo(tx - 3, ty - 31); g.lineTo(tx - 44, ty + 2); g.fill();
    // antennas
    g.strokeStyle = mixHex(P.near, '#000000', .25); g.lineWidth = 2.2; for (const [ax, ah] of [[PAD + W - 120, 120], [PAD + 40, 150]]) { const top0 = ax < PAD + 200 ? 60 : 400; g.beginPath(); g.moveTo(ax, top0); g.lineTo(ax, top0 - ah); g.stroke(); g.lineWidth = 1.2; for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(ax - 12 + k * 2, top0 - ah * k / 4); g.lineTo(ax + 12 - k * 2, top0 - ah * k / 4); g.stroke(); } g.lineWidth = 2.2; }
    stipple(c, { k: .3, g: 1, seed: 7, mid: false, boost: 1 });
    return c;
  });
}
// parapet (concrete coping you can sit on) + roof deck with gravel, a vent, last night's rain
function deck(st, py) {
  const P = PAL[st], L = ROOF.light;
  return once(`rt-deck-${st}-${py}`, () => {
    const [c, g] = canvas(LW, H), r = prng(8), foot = py + 70;
    // inner face of the parapet (toward us), concrete blocks
    const fg0 = g.createLinearGradient(0, py, 0, foot); fg0.addColorStop(0, mixHex(P.par, '#ffffff', -.02)); fg0.addColorStop(1, mixHex(P.par, '#000000', .3)); g.fillStyle = fg0; g.fillRect(0, py + 10, LW, foot - py - 10);
    g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1; g.beginPath(); for (let x = 30; x < LW; x += 170 + r() * 20) { g.moveTo(x, py + 12); g.lineTo(x, foot); } g.moveTo(0, py + 40); g.lineTo(LW, py + 40); g.stroke();
    g.save(); g.beginPath(); g.rect(0, py + 10, LW, foot - py - 10); g.clip(); artHatch(g, [0, py + 10, LW, foot - py - 10], { angle: -1.2, gap: 3.4, w: .6, col: '#000000', a: .28, wobble: .6, seed: 4, broken: .3 }); g.restore();
    // coping stone: a lit top surface and a thin front lip
    g.fillStyle = P.parTop; g.fillRect(0, py, LW, 11); g.fillStyle = mixHex(P.parTop, '#000000', .45); g.fillRect(0, py + 9, LW, 4);
    const tg = g.createLinearGradient(L.x + PAD - 900, 0, L.x + PAD + 600, 0); tg.addColorStop(0, rgba(P.rim, .12)); tg.addColorStop(.6, rgba(P.rim, .6)); tg.addColorStop(1, rgba(P.rim, .2)); g.fillStyle = tg; g.fillRect(0, py, LW, 2);
    // roof deck: dark membrane receding, seams, gravel tooth
    const dg = g.createLinearGradient(0, foot, 0, H); dg.addColorStop(0, P.deck[0]); dg.addColorStop(1, P.deck[1]); g.fillStyle = dg; g.fillRect(0, foot, LW, H - foot);
    g.strokeStyle = 'rgba(120,140,190,.07)'; g.lineWidth = 1; g.beginPath(); const vx = PAD + 960; for (let i = -16; i < 30; i++) { g.moveTo(vx + i * 26, foot); g.lineTo(vx + i * 170, H + 200); } for (let k = 0; k < 6; k++) { const y = foot + Math.pow(k / 6, 1.8) * (H - foot) + 8; g.moveTo(0, y); g.lineTo(LW, y); } g.stroke();
    for (let i = 0; i < 4200; i++) { const x = r() * LW, y = foot + Math.pow(r(), .8) * (H - foot); g.fillStyle = r() < .5 ? 'rgba(170,180,220,.07)' : 'rgba(0,0,0,.28)'; const z = 1 + (y - foot) / (H - foot) * 1.4; g.fillRect(x, y, z, z); }
    // shadow line at the parapet foot
    const sg = g.createLinearGradient(0, foot, 0, foot + 40); sg.addColorStop(0, 'rgba(0,0,0,.55)'); sg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = sg; g.fillRect(0, foot, LW, 40);
    // a vent pipe with a cap (right of centre) and a roof hatch box (far right)
    const px0 = PAD + 1450; g.fillStyle = mixHex(P.par, '#000000', .1); g.fillRect(px0, foot - 46, 22, 66); g.fillRect(px0 - 6, foot - 52, 34, 8); g.fillStyle = rgba(P.rim, .45); g.fillRect(px0, foot - 46, 2, 60);
    g.fillStyle = mixHex(P.par, '#000000', .2); g.fillRect(PAD + 1640, foot - 30, 210, 70); g.fillStyle = rgba(P.rim, .3); g.fillRect(PAD + 1640, foot - 30, 210, 2);
    stipple(c, { k: .3, g: 1, seed: 9, mid: false, boost: 1 });
    return c;
  });
}
// the puddle mirrors the key light (cheap: drawn per frame with a few strokes)
function puddle(ctx, st, x, y, k, t, glowA) {
  const P = PAL[st]; ctx.save(); ctx.translate(x, y); ctx.scale(k, k * .12);
  const pg = ctx.createRadialGradient(0, 0, 0, 0, 0, 330); pg.addColorStop(0, rgba(P.warm, .22 * glowA)); pg.addColorStop(.6, rgba('#a0aad2', .06)); pg.addColorStop(1, 'rgba(160,170,210,0)'); ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(0, 0, 330, 0, 7); ctx.fill(); ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(P.warm, .1 * glowA); ctx.lineWidth = 1;
  for (let i = 0; i < 6; i++) { const ph = (t * .35 + i / 6) % 1; ctx.beginPath(); ctx.ellipse(x, y, (60 + ph * 260) * k, (3 + ph * 9) * k, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.globalAlpha = 1 - ph; ctx.stroke(); }
  ctx.restore();
}
function mixHex(a, b, u) { if (u < 0) { b = '#ffffff'; u = -u; } const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const m = (s) => Math.round(mix((A >> s) & 255, (B >> s) & 255, clamp(u))); return '#' + [m(16), m(8), m(0)].map((v) => v.toString(16).padStart(2, '0')).join(''); }

// sodium glow from the streets below (night): a warm haze rising between the planes, breathing slowly
function sodium() { return once('rt-sodium', () => { const [c, g] = canvas(LW, H); const lg = g.createLinearGradient(0, ROOF.horizon - 80, 0, ROOF.parapetY + 80); lg.addColorStop(0, 'rgba(255,154,60,0)'); lg.addColorStop(.6, 'rgba(255,140,50,.22)'); lg.addColorStop(1, 'rgba(255,120,40,.4)'); g.fillStyle = lg; g.fillRect(0, ROOF.horizon - 80, LW, ROOF.parapetY + 160 - ROOF.horizon); stipple(c, { k: .7, g: 1.2, seed: 61 }); return c; }); }
function keyGlow(st) { return once('rt-key-' + st, () => { const R = 900, [c, g] = canvas(R * 2, R); const P = PAL[st], rg = g.createRadialGradient(R, R, 0, R, R, R); rg.addColorStop(0, rgba(P.warm, .32)); rg.addColorStop(.35, rgba(P.warm, .1)); rg.addColorStop(1, rgba(P.warm, 0)); g.fillStyle = rg; g.fillRect(0, 0, R * 2, R); stipple(c, { k: .8, g: 1.2, seed: 70 }); return c; }); }

export function rooftop(ctx, t, o = {}) {
  const st = PAL[o.state] ? o.state : 'blue', cam = o.cam || {}, z = cam.z ?? 1, cx = cam.x ?? 0, cy = cam.y ?? 0, fx = cam.fx ?? W / 2, fy = cam.fy ?? H / 2;
  const py = o.parapetY ?? ROOF.parapetY, glowA = o.glowA ?? 1, dawn = clamp(o.dawn ?? 0);
  const kz = (p) => 1 + (z - 1) * (.35 + .65 * p);
  const map = (p) => (X, Y) => { const k = kz(p); return [fx + (X - cx * p - fx) * k, fy + (Y - cy * p - fy) * k]; };
  const plane = (p, img, op, a = 1, dx = 0) => { const k = kz(p); ctx.save(); ctx.translate(fx, fy); ctx.scale(k, k); ctx.translate(-fx - cx * p + dx, -fy - cy * p); if (op) ctx.globalCompositeOperation = op; ctx.globalAlpha = a; ctx.drawImage(img, -PAD, 0); ctx.restore(); };
  // dawn: the blue set underneath at full strength, the gold set over it (opaque layers never cross-fade into see-through)
  const both = (p, f, op, a = 1, dx = 0) => { if (st !== 'dawn') return plane(p, f(st), op, a, dx); if (dawn < 1) plane(p, f('blue'), op, op === 'lighter' ? a * (1 - dawn) : a, dx); if (dawn > 0) plane(p, f('dawn'), op, a * dawn, dx); };
  const L = ROOF.light, [lx, ly] = map(.12)(L.x, st === 'night' ? H + 100 : L.y + (st === 'dawn' ? (1 - dawn) * 160 : 0));
  const A = { horizon: map(.2)(0, ROOF.horizon)[1], parapet: { y: map(1)(0, py)[1], x0: map(1)(-PAD, 0)[0], x1: map(1)(W + PAD, 0)[0] }, light: { x: lx, y: ly, col: st === 'night' ? '#ff9a3c' : st === 'dawn' ? '#ffd08a' : '#ffe2b8' },
    map, k: kz, deckY: map(1)(0, py + 70)[1], state: st };
  // seats: two places on the parapet top, a little apart, facing each other (feet point on the coping, hip on the edge)
  const seatX = o.seatX || [820, 1080], ks = kz(1);
  A.seats = (o.seats ? seatX.slice(0, o.seats) : []).map((X, i) => { const [sx, sy] = map(1)(X, py); return { x: sx, y: sy + 4 * ks, s: (o.seatS ?? 1.7) * ks, side: i ? 1 : -1, hip: [sx, sy - 2 * ks], knee: [sx + (i ? -1 : 1) * 70 * ks * (o.seatS ?? 1.7) / 1.7, sy - 26 * ks] }; });
  // sky (dawn: blue → gold), the caller's sky layer, the far skyline
  both(.05, sky);
  if (st === 'night') { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const S = sodium(); plane(.18, S, 'lighter', .55 * glowA * (.92 + .08 * Math.sin(t * .7))); ctx.restore(); }
  if (o.onSky) { ctx.save(); o.onSky(ctx, A); ctx.restore(); }
  if (st !== 'night') { const G = keyGlow(st === 'dawn' && dawn > .5 ? 'dawn' : 'blue'), k = kz(.12); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .9 * glowA; ctx.drawImage(G, lx - G.width / 2 * k, ly - G.height * k, G.width * k, G.height * k); ctx.restore(); }
  both(.18, farCity);
  both(.28, (s) => fogBand(s, 1, ROOF.horizon - 40, ROOF.horizon + 140, .3, 3), 'lighter', .9, (t * 4) % 200);
  both(.42, midCity);
  if (st === 'night') plane(.42, sodium(), 'lighter', .35 * glowA);
  both(.55, (s) => fogBand(s, 2, ROOF.parapetY - 140, ROOF.parapetY + 60, .22, 6), 'lighter', .8, -(t * 7) % 300);
  if (o.onCity) { ctx.save(); o.onCity(ctx, A); ctx.restore(); }
  both(.8, nearTowers);
  if (o.deck !== false) {
    both(1, (s) => deck(s, py));
    const [qx, qy] = map(1)(1180, Math.min(H - 40, py + 70 + (H - py - 70) * .45)); puddle(ctx, st === 'dawn' && dawn > .5 ? 'dawn' : st, qx, qy, kz(1), t, glowA);
  }
  return A;
}

// ---------- the two friends on the parapet (H.10; reusable for 3.14–3.16 and the close) ----------
// rooftopFriends(ctx, t, A, o)   A = anchors from rooftop(…, { seats: 2 }); o: { you: { accent '#c8843a', lean, nod (0..1), up (0..1 head lifts from the napkin), pen (0..1 writing hand down at the knee), write (0..1 pen moving),
//   napkin(ctx, x, y, s) callback at your knee }, friend: { accent '#1f6a6e', lean, nod }, light: { x, y, col, a } (default: the sodium glow below) }
//   → { you: { hand: [x, y] (writing hand), knee: [x, y] }, friend: { hand } }
import { figure, POSES, handPos } from './figure.mjs';
export function rooftopFriends(ctx, t, A, o = {}) {
  const S = A.seats; if (!S || S.length < 2) return {};
  const L = o.light || { x: (S[0].x + S[1].x) / 2 + 300, y: A.parapet.y + 160, col: A.state === 'night' ? '#ff9a3c' : '#ffd08a', a: .3 };
  const Y = o.you || {}, F = o.friend || {};
  const nodF = (F.nod ?? 0), lean = (F.lean ?? 0);
  // she: on the right seat, facing left (toward you); you: on the left seat, facing right, head bowed to the napkin on your knee
  const poseYou = { ...POSES.sit, lean: .1 + (Y.lean ?? 0), head: .32 + .05 * Math.sin(t * 1.3) * (Y.write ?? 0) + .18 * (Y.nod ?? 0) - .26 * (Y.up ?? 0), sh: [0.85 - .47 * (Y.pen ?? 0), 0.7], el: [1.05 + .05 * (Y.pen ?? 0), 1.25], hair: 'short', kn: [1.35, 1.45] };
  const poseHer = { ...POSES.sit, lean: .06 + lean * .14, head: .12 + nodF * .22, sh: [0.62, 0.45], el: [0.95, 1.05], hair: 'long', kn: [1.4, 1.5] };
  const out = { you: {}, friend: {} };
  figure(ctx, S[1].hip[0], S[1].hip[1], S[1].s, poseHer, { t, seed: 3, flip: true, accent: F.accent || '#1f6a6e', dress: { coat: F.accent || '#1f6a6e', pants: '#1b1a2e', skin: '#8d5f40', hair: '#1a1214' }, light: L, rim: L.col, rimSide: 1, rimW: 2 });
  out.friend.hand = handPos(S[1].hip[0], S[1].hip[1], S[1].s, poseHer, 0, true, { t, seed: 3 });
  figure(ctx, S[0].hip[0], S[0].hip[1], S[0].s, poseYou, { t, seed: 7, accent: Y.accent || '#c8843a', accentPart: 'scarf', dress: { coat: '#2a3350', pants: '#17162a', skin: '#b98262', hair: '#16111a' }, light: L, rim: L.col, rimSide: -1, rimW: 2,
    prop: Y.napkin ? (g, fa) => { } : undefined });
  out.you.hand = handPos(S[0].hip[0], S[0].hip[1], S[0].s, poseYou, 0, false, { t, seed: 7 });
  out.you.knee = S[0].knee;
  return out;
}
