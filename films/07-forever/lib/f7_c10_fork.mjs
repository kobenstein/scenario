// Film 7 · c10's COPY of lib/f7_c07_fork.mjs (c07's dusk-sky world: S plane, lens, duskSky, ground, earthDisc), copied 1:1 per the brief. Original header:
// Film 7 · c07 · the fork in twenty sixty: drawing pieces for scenes/sc07.mjs. Pure functions of t, deterministic (prng only). Builder: c07.
//
// THE WORLD OF c07: we stand at the dark table on the empty stage (c04's table, lib/f7_c07_table.mjs) and look up into the dusk sky; two Earths
// hang in it like two moons. The sky is ONE flat picture at infinity, the "S plane" (px of the wide view, 1920 × 1080 around the frame), seen
// through a LENS (zoom + pan, no parallax): the camera flies into an Earth by zooming the lens until its limb is the low-orbit view of c01.
//   SP                        the S-plane layout: the c06>c07 dusk plate sits at S y 0 … H (P = 0); the camera keeps c06's tilt UP out of it,
//                             so the Earths hang above it (L / R / C: left = the furnace, right = the ring, C = the one Earth before the split),
//                             the horizon HZ lies below it (seen only in the final tip down); k0 = Earth px per world unit at lens z 1
//   lensOf({ cx, cy, z, dy }) → { z, X(sx), Y(sy), dy }   S → screen (dy: extra screen shift for the final tilt down to the table)
//   localCam(lens, E)         the kit camera (Earth world units, Earth centre at the origin) that draws the Earth at S point E through the lens
//   duskSky(ctx, t, lens)     the sky: handoff4's 'sky' plate (tone dusk) copied 1:1 and mapped through the lens (lens = plate view → the
//                             IDENTICAL plate), the night above it with its own stars, its rose bottom continued down to the horizon glow
//   ground(ctx, t, lens)      the far ridge, the near ridge with warm windows, the horizon haze, the stage floor below the horizon
//   earthDisc(ctx, t, lens, E, o)   one Earth: kit earthHorizon + a polar ice cap (hides the texture's pole) + dusk form light → m (kit camO)
// THE FURNACE (path A, the left Earth; the dome becomes the vault of a kiln: heat and smoke trapped under the glass)
//   furnaceBack(ctx, t, m, F)       the red-orange heat in the vault between the limb and the dome, the smoke ceiling (smoke instead of stars)
//   furnaceDisc(ctx, t, m, F)       the land glows red-orange (ember tint, limb glow), dims to embers
//   FURN / furnaceProps(ctx, t, m, F)   factories that multiply, mine headframes + terraced pits, the forest edge that retreats, chimney smoke
//   DIALS / dials(ctx, t, m, F)     nine gauges riveted along the dome rim (the nine planetary limits); their needles tip into the red one by one
// THE RING (path B, the right Earth at dawn)
//   sunrise / sunriseLimb (copied from lib/f7_c03_wall.mjs with the sun's angle as a parameter), ringDisc (dawn wash, teal sea, glitter)
//   RINGW / ringProps(ctx, t, m, G)  library (Knowledge), clinic (Health), solar fields (Power from the sun), forests, the town, people, birds
//   bendTo(CW, iS, u)               the amber curve bends over and lies down into the ring (polar morph, after lib/f7_c06_orbit.mjs bendPts)
// TEXT   title(ctx, t, s, x, y, t0, t1, o)  Instrument Serif title with a mask reveal and a short coloured rule (still while read)
// SETUP  await forkPrepare()  (smoke puff sprites as Images)
import { loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, prng, canvas, text } from '../engine.mjs';
import { F7, EARTH, CURVE, camO, earthHorizon, limbY, onSphere, curve, glowAt, ease, mod, n1, limbProp } from './f7_kit.mjs';
import { TSHIFT } from './handoff4.mjs';
import { figureFlat, POSES } from './figure.mjs';

const TAU = Math.PI * 2;
const bump = (t, a, b, c, d) => sm(lin(a, b, t)) * (1 - sm(lin(c, d, t)));

// ================================================================ the S plane and the lens
export const SP = { P: 0, HZ: 1170, k0: 245 / 3000, L: [640, -300], R: [1280, -300], C: [960, -300] };
export function lensOf(c) {
  const z = c.z, dy = c.dy || 0;
  return { z, cx: c.cx, cy: c.cy, dy, X: (sx) => W / 2 + (sx - c.cx) * z, Y: (sy) => H / 2 + (sy - c.cy) * z + dy, sx: (X) => c.cx + (X - W / 2) / z, sy: (Y) => c.cy + (Y - H / 2 - dy) / z };
}
export function localCam(lens, E) { const k = SP.k0; return { x: (lens.cx - E[0]) / k, y: (lens.cy - E[1]) / k - lens.dy / (k * lens.z), z: lens.z * k }; }
// the S-plane camera that shows an Earth-local kit camera {x, y, z} of the Earth at E
export function lensFor(E, lc) { const k = SP.k0; return { cx: E[0] + lc.x * k, cy: E[1] + lc.y * k, z: lc.z / k }; }

// ================================================================ the sky: handoff4 skyPlate (tone dusk) copied 1:1, mapped through the lens
const STARS = (() => { const r = prng(4242), s = []; for (let i = 0; i < 520; i++) { const m = r(); s.push([r() * W, r() * H, m < .9 ? .5 + r() * .9 : 1.2 + r() * 1.4, r() * TAU, .4 + r() * 1.6]); } return s; })();
const DUSK = ['#0b0f2a', '#3b2f6e', '#c77a8a'], HORIZ = '#dc9a8c';
// the night above the plate (S y < −16, never inside the plate view): the plate's star density, a few warm and cool ones
const XST = (() => { const r = prng(4343), s = []; for (let i = 0; i < 1500; i++) { const m = r(); s.push([-700 + r() * 3320, -1700 + r() * 1684, m < .9 ? .5 + r() * .9 : 1.2 + r() * 1.5, r() * TAU, .4 + r() * 1.6, r() < .12 ? '255,222,190' : r() < .2 ? '206,224,255' : '243,239,226']); } return s; })();
export function duskSky(ctx, t, lens, o = {}) {
  t += TSHIFT;
  const a = lens.z, e = W / 2 - lens.cx * a, f = H / 2 + (-SP.P - lens.cy) * a + lens.dy;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  const g = ctx.createLinearGradient(0, f, 0, f + H * a); g.addColorStop(0, DUSK[0]); g.addColorStop(.62, DUSK[1]); g.addColorStop(1, DUSK[2]); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // below the plate: the rose continues and warms toward the horizon
  const yb = f + H * a, yh = lens.Y(SP.HZ);
  if (yb < H && yh > yb + 1) { const h2 = ctx.createLinearGradient(0, yb, 0, yh); h2.addColorStop(0, DUSK[2]); h2.addColorStop(1, HORIZ); ctx.fillStyle = h2; ctx.fillRect(0, Math.max(0, yb), W, H - Math.max(0, yb)); }
  // the band (same dots, same drift; positions follow the lens, the dots keep their size)
  if (o.stars !== 0) {
    ctx.save(); ctx.translate(W / 2 * a + e, H / 2 * a + f); ctx.rotate(-.42); const r = prng(55), ca = Math.cos(-.42), sa = Math.sin(-.42);
    for (let i = 0; i < 900; i++) {
      const x = (r() - .5) * W * 1.5, y = (r() + r() + r() - 1.5) * 150, al = .05 + .1 * r(), X = (x + t * 1.5) * a, Y = y * a;
      if (a !== 1) { const sx = W / 2 * a + e + X * ca - Y * sa, sy = H / 2 * a + f + X * sa + Y * ca; if (sx < -4 || sx > W + 4 || sy < -4 || sy > H + 4) continue; }
      ctx.fillStyle = `rgba(216,230,255,${al})`; ctx.fillRect(X, Y, 1.3, 1.3);
    }
    ctx.restore();
    const dx = t * 2.2, dy = t * .6;
    for (const [x, y, s, ph, fr] of STARS) {
      const tw = .55 + .45 * Math.sin(t * fr + ph), X0 = ((x + dx) % W + W) % W, Y0 = ((y + dy) % H + H) % H;
      if (Y0 > H * .7) continue;
      const X = X0 * a + e, Y = Y0 * a + f; if (X < -12 || X > W + 12 || Y < -12 || Y > H + 12) continue;
      ctx.fillStyle = `rgba(243,239,226,${(.35 + .65 * tw) * (s > 1.2 ? 1 : .8)})`; ctx.beginPath(); ctx.arc(X, Y, s, 0, TAU); ctx.fill();
      if (s > 2) { ctx.fillStyle = `rgba(255,241,214,${.07 * tw})`; ctx.beginPath(); ctx.arc(X, Y, s * 5, 0, TAU); ctx.fill(); }
    }
    const sz = Math.min(1.5, Math.sqrt(a));
    for (const [x, y, s, ph, fr, col] of XST) {
      const X = lens.X(x + t * 2.2), Y = lens.Y(y); if (X < -12 || X > W + 12 || Y < -12 || Y > H + 12) continue;
      const tw = .55 + .45 * Math.sin(t * fr + ph);
      ctx.fillStyle = `rgba(${col},${(.35 + .65 * tw) * (s > 1.2 ? 1 : .8)})`; ctx.beginPath(); ctx.arc(X, Y, s * sz, 0, TAU); ctx.fill();
      if (s > 2) { ctx.fillStyle = `rgba(255,241,214,${.07 * tw})`; ctx.beginPath(); ctx.arc(X, Y, s * 5, 0, TAU); ctx.fill(); }
    }
  }
  ctx.restore();
}

// ================================================================ the ground: ridges, warm windows, haze, the stage floor
const RIDGE_F = (() => { const o = []; for (let i = 0; i <= 160; i++) o.push(22 + 30 * Math.abs(n1(i * .17 + 9)) + 12 * Math.sin(i * .29 + 1)); return o; })();
const RIDGE_N = (() => { const o = []; for (let i = 0; i <= 120; i++) o.push(8 + 22 * Math.abs(n1(i * .21 + 3)) + 9 * Math.sin(i * .37)); return o; })();
const WIN = (() => { const r = prng(405), o = []; for (let i = 0; i < 46; i++) o.push([r(), r() * .55, .5 + r(), r() * TAU]); return o; })();
export function ground(ctx, t, lens) {
  const hz = lens.Y(SP.HZ); if (hz > H + 80) return hz;
  const X0 = lens.X(-700), X1 = lens.X(2620), z = lens.z;
  // the horizon haze (warm, then violet above)
  { const hg = ctx.createLinearGradient(0, hz - 85 * z, 0, hz); hg.addColorStop(0, 'rgba(232,170,150,0)'); hg.addColorStop(1, 'rgba(240,186,160,.35)'); ctx.fillStyle = hg; ctx.fillRect(0, hz - 85 * z, W, 85 * z); }
  // the far ridge (violet, lit rim)
  ctx.beginPath(); ctx.moveTo(X0, hz + 4);
  RIDGE_F.forEach((v, i) => ctx.lineTo(mix(X0, X1, i / (RIDGE_F.length - 1)), hz - (v + 8) * z));
  ctx.lineTo(X1, hz + 4); ctx.closePath(); ctx.fillStyle = '#4a3a70'; ctx.fill(); ctx.strokeStyle = 'rgba(255,200,190,.35)'; ctx.lineWidth = 1.2; ctx.stroke();
  // a band of mist in front of it
  { const mg = ctx.createLinearGradient(0, hz - 40 * z, 0, hz + 6); mg.addColorStop(0, 'rgba(200,150,170,0)'); mg.addColorStop(1, 'rgba(200,150,170,.28)'); ctx.fillStyle = mg; ctx.fillRect(0, hz - 40 * z, W, 46 * z); }
  // the near ridge (dark) with warm windows
  const N0 = lens.X(-500), N1 = lens.X(2420);
  ctx.beginPath(); ctx.moveTo(N0, hz + 30);
  RIDGE_N.forEach((v, i) => ctx.lineTo(mix(N0, N1, i / (RIDGE_N.length - 1)), hz - v * z * .9));
  ctx.lineTo(N1, hz + 30); ctx.closePath(); ctx.fillStyle = '#17122e'; ctx.fill(); ctx.strokeStyle = 'rgba(190,150,220,.3)'; ctx.lineWidth = 1; ctx.stroke();
  for (const [u, v, s, ph] of WIN) { const X = mix(N0, N1, u), Y = hz - 3 - v * 10 * z; ctx.fillStyle = rgba('#ffb35c', .5 + .2 * Math.sin(t * .7 + ph)); ctx.fillRect(X, Y, 2 * s * Math.max(1, z * .7), 2 * s * Math.max(1, z * .7)); }
  // the stage floor (lacquer black, as c04's)
  const fl = ctx.createLinearGradient(0, hz, 0, hz + 420); fl.addColorStop(0, '#120f22'); fl.addColorStop(1, '#0b0b10'); ctx.fillStyle = fl; ctx.fillRect(0, hz, W, Math.max(0, H - hz));
  // a cool stage-front line far out on the floor
  ctx.strokeStyle = 'rgba(207,230,255,.12)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, hz + 34 * z); ctx.lineTo(W, hz + 34 * z); ctx.stroke();
  return hz;
}

// ================================================================ an Earth in the sky
export function earthDisc(ctx, t, lens, E, o = {}) {
  const lc = localCam(lens, E), m = camO(lc), cx = m.X(0), cy = m.Y(0), r = EARTH.R * m.k;
  if (cx + r * 1.3 < 0 || cx - r * 1.3 > W || cy + r * 1.3 < 0 || cy - r * 1.3 > H) return { m, lc, cx, cy, r, off: true };
  if (o.under) o.under(m);
  earthHorizon(ctx, t, lc, { heat: o.heat ?? 0, city: o.city ?? 1, atmo: o.atmo ?? 1 });
  // the polar cap (moonlit ice; it also hides the texture's pole)
  const pc = [m.X(0), m.Y(EARTH.R * .71)];
  if (pc[1] - .3 * r < H && pc[1] + .3 * r > 0 && r > 40) {
    ctx.save(); ctx.translate(pc[0], pc[1]); ctx.scale(1, .62);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, .34 * r); g.addColorStop(0, 'rgba(188,198,236,.62)'); g.addColorStop(.45, 'rgba(160,172,226,.42)'); g.addColorStop(.8, 'rgba(120,130,200,.12)'); g.addColorStop(1, 'rgba(110,120,190,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, .34 * r, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(220,226,255,.18)'; ctx.lineWidth = Math.max(.6, r * .003);
    ctx.beginPath(); for (let k = -6; k <= 6; k++) { const yy = k * .04 * r, hw = Math.sqrt(Math.max(0, .06 - (k * .04) ** 2)) * r * .95; ctx.moveTo(-hw, yy); ctx.lineTo(hw, yy); } ctx.stroke();
    ctx.restore();
  }
  // dusk form light: the upper right limb catches the last light, the lower left turns away (only when the whole disc is in view)
  if (r < 2200) {
    const lx = cx + .45 * r, ly = cy - .5 * r, sh = ctx.createRadialGradient(lx, ly, r * .2, lx, ly, r * 1.75);
    sh.addColorStop(0, 'rgba(6,6,20,0)'); sh.addColorStop(.55, 'rgba(6,6,20,.12)'); sh.addColorStop(1, 'rgba(6,6,20,.55)');
    ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();
    const cg = ctx.createConicGradient(0, cx, cy), A = (o.rim ?? 1) * .55;
    for (let i = 0; i <= 8; i++) { const ang = i / 8 * TAU, d = Math.abs(mod(ang - 5.4 + Math.PI, TAU) - Math.PI); cg.addColorStop(i / 8, `rgba(255,196,170,${A * Math.max(0, 1 - d / 1.5) ** 2})`); }
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = cg; ctx.lineWidth = Math.max(2, r * .02); ctx.beginPath(); ctx.arc(cx, cy, r - Math.max(1, r * .008), 0, TAU); ctx.stroke(); ctx.restore();
  }
  return { m, lc, cx, cy, r };
}

// ================================================================ smoke sprites
let PUFF = null;
export async function forkPrepare() {
  if (PUFF) return;
  // a billow: overlapping soft discs, a denser core, a slightly lit underside (tone) — engraved by a few fine curls
  const mk = (tone, under, seed, core) => {
    const [c, g] = canvas(192, 192), r = prng(seed);
    for (let i = 0; i < 18; i++) {
      const a = r() * TAU, d = Math.sqrt(r()) * 46, x = 96 + Math.cos(a) * d, y = 100 + Math.sin(a) * d * .75, rad = 26 + r() * 30;
      const gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, rgba(tone, core)); gr.addColorStop(.55, rgba(tone, core * .7)); gr.addColorStop(1, rgba(tone, 0)); g.fillStyle = gr; g.fillRect(0, 0, 192, 192);
    }
    if (under) { g.globalCompositeOperation = 'source-atop'; const ug = g.createLinearGradient(0, 70, 0, 170); ug.addColorStop(0, rgba(under, 0)); ug.addColorStop(1, rgba(under, .55)); g.fillStyle = ug; g.fillRect(0, 0, 192, 192); g.globalCompositeOperation = 'source-over'; }
    g.strokeStyle = 'rgba(255,170,120,.10)'; g.lineWidth = 1.1;
    for (let i = 0; i < 9; i++) { const x = 50 + r() * 92, y = 60 + r() * 70, rr = 8 + r() * 16; g.beginPath(); g.arc(x, y, rr, Math.PI * (1 + r() * .3), Math.PI * (1.7 + r() * .3)); g.stroke(); }
    return c;
  };
  PUFF = [];
  for (const [tone, under, seed, core] of [['#2e2220', '#c4512e', 11, .5], ['#3a2a28', '#e2552c', 12, .45], ['#241a1a', '#a8381c', 13, .55], ['#ff8a48', null, 14, .22]]) PUFF.push(await loadImage(mk(tone, under, seed, core).toBuffer('image/png')));
}

// ================================================================ THE FURNACE
const RD = EARTH.RD, R0 = EARTH.R;
const polar = (th, r) => [r * Math.sin(th), -r * Math.cos(th)];
// the vault: heat glow between the limb and the dome; dark smoke beyond it (no stars); the vault's rim glows like the mouth of a kiln
export function furnaceBack(ctx, t, m, F) {
  const I = clamp(F.I); if (I <= 0) return;
  const cx = m.X(0), cy = m.Y(0), r = R0 * m.k, rd = RD * m.k, hot = F.hot ?? 1;
  ctx.save();
  { const s = ctx.createRadialGradient(cx, cy, rd * .9, cx, cy, rd * 1.75); s.addColorStop(0, rgba('#1a1210', .92 * I)); s.addColorStop(.45, rgba('#201616', .65 * I)); s.addColorStop(1, 'rgba(32,22,22,0)');
    const x0 = Math.max(0, cx - rd * 1.75), y0 = Math.max(0, cy - rd * 1.75); ctx.fillStyle = s; ctx.fillRect(x0, y0, Math.min(W, cx + rd * 1.75) - x0, Math.min(H, cy + rd * 1.75) - y0); }
  const g = ctx.createRadialGradient(cx, cy, r, cx, cy, rd);
  g.addColorStop(0, rgba('#ffc890', .95 * I * Math.min(1, hot))); g.addColorStop(.05, rgba('#ff8a48', .95 * I)); g.addColorStop(.18, rgba('#e2552c', .93 * I)); g.addColorStop(.42, rgba('#9a3418', .92 * I));
  g.addColorStop(.7, rgba('#4e2016', .92 * I)); g.addColorStop(.9, rgba('#2c1814', .94 * I)); g.addColorStop(1, rgba('#3a2420', .9 * I));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, rd, 0, TAU); ctx.arc(cx, cy, r, 0, TAU, true); ctx.fill('evenodd');
  if (hot > 1) { ctx.globalCompositeOperation = 'lighter'; const h2 = ctx.createRadialGradient(cx, cy, r, cx, cy, r + (rd - r) * .5); h2.addColorStop(0, rgba('#ffb070', .35 * (hot - 1) * I)); h2.addColorStop(1, 'rgba(255,120,60,0)'); ctx.fillStyle = h2; ctx.beginPath(); ctx.arc(cx, cy, r + (rd - r) * .5, 0, TAU); ctx.arc(cx, cy, r, 0, TAU, true); ctx.fill('evenodd'); }
  ctx.globalCompositeOperation = 'lighter';
  for (const [lw, al] of [[Math.max(8, 46 * m.k), .12], [Math.max(2, 7 * m.k), .32], [1.4, .6]]) { ctx.strokeStyle = rgba('#ff9a50', al * I * Math.min(1.3, hot)); ctx.lineWidth = lw; ctx.beginPath(); ctx.arc(cx, cy, rd, 0, TAU); ctx.stroke(); }
  ctx.restore();
}
// the land glows like coals
export function furnaceDisc(ctx, t, m, F) {
  const I = clamp(F.I); if (I <= 0) return;
  const cx = m.X(0), cy = m.Y(0), r = R0 * m.k;
  ctx.save();
  ctx.fillStyle = rgba('#3a120c', .35 * I); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();
  const g = ctx.createRadialGradient(cx, cy, r * .86, cx, cy, r);
  g.addColorStop(0, rgba('#e2552c', .12 * I)); g.addColorStop(.75, rgba('#e2552c', .3 * I)); g.addColorStop(.97, rgba('#ff8a48', .55 * I * Math.min(1.3, F.hot ?? 1))); g.addColorStop(1, rgba('#ffc890', .7 * I));
  ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill(); ctx.globalCompositeOperation = 'source-over';
  if ((F.ember ?? 0) > 0) { ctx.fillStyle = rgba('#120606', .4 * F.ember); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill(); }
  ctx.restore();
}
// the props of the furnace world (world x on the limb, h world units; k 0 = with "make more", k ≥ 1 = with "More things")
export const FURN = (() => {
  const fac = [], mines = [], r = prng(707);
  for (const [x, h, k, n] of [[60, 132, 0, 3], [480, 118, 0, 2], [820, 140, 0, 3], [-300, 104, 1, 2], [-110, 86, 2, 1], [250, 124, 3, 3], [650, 96, 4, 2], [990, 122, 5, 2], [1180, 104, 6, 3], [-480, 84, 7, 2], [360, 82, 8, 1], [1330, 110, 9, 2]]) fac.push({ x, h, k, n, seed: fac.length });
  for (const [x, d, s, hx] of [[-180, 120, 1.1, -210], [175, 175, .9, 160], [560, 140, 1.2, 545], [880, 200, 1.0, 880], [-560, 190, .8, -620]]) mines.push({ x, d, s, hx });
  return { fac, mines };
})();
function atLimb(ctx, m, x, lift = 0) {
  const ang = Math.asin(clamp(x / R0, -1, 1)), y = limbY(x) + 2 - lift;
  ctx.translate(m.X(x), m.Y(y)); ctx.rotate(ang);
}
function factory(ctx, t, s, p, lit, red) {
  // an engraved works: a long hall with a sawtooth roof, a taller block, n chimneys; dark body, red-orange rim from the glow, warm windows
  const w = s * 1.3, hh = s * .3, body = '#1c0f12', rim = rgba('#ff8a48', .3 + .5 * red);
  ctx.fillStyle = body; ctx.strokeStyle = rim; ctx.lineWidth = Math.max(.8, s * .018); ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(-w / 2, -hh);
  for (let i = 0; i < 5; i++) { const x0 = -w / 2 + w * .62 * i / 5; ctx.lineTo(x0 + w * .62 / 5 * .72, -hh - s * .12); ctx.lineTo(x0 + w * .62 / 5, -hh); }
  ctx.lineTo(w * .12, -hh); ctx.lineTo(w * .12, -hh * 1.55); ctx.lineTo(w / 2, -hh * 1.55); ctx.lineTo(w / 2, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  // hatching on the hall (the engraving)
  ctx.save(); ctx.strokeStyle = rgba('#ff9a60', .12 + .1 * red); ctx.lineWidth = Math.max(.5, s * .008); ctx.beginPath(); for (let x = -w / 2 + s * .04; x < w / 2; x += s * .045) { ctx.moveTo(x, -s * .02); ctx.lineTo(x + s * .03, -hh * .55); } ctx.stroke(); ctx.restore();
  const tops = [];
  for (let i = 0; i < p.n; i++) {
    const x = -w / 2 + w * (.16 + .22 * i), ht = s * (1.1 - .16 * i), cw = s * .085;
    ctx.fillStyle = body; ctx.beginPath(); ctx.moveTo(x - cw / 2, -hh + 1); ctx.lineTo(x - cw * .36, -ht); ctx.lineTo(x + cw * .36, -ht); ctx.lineTo(x + cw / 2, -hh + 1); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = rgba('#ff9a60', .25); ctx.beginPath(); for (let k = 1; k < 4; k++) { const yy = mix(-hh, -ht, k / 4); ctx.moveTo(x - cw * .42, yy); ctx.lineTo(x + cw * .42, yy); } ctx.stroke(); ctx.strokeStyle = rim;
    ctx.fillStyle = rgba('#ffb35c', .7 * lit * red); ctx.fillRect(x - cw * .36, -ht, cw * .72, Math.max(1, s * .022));
    tops.push([x, -ht]);
  }
  if (lit > 0) { ctx.fillStyle = rgba('#ffb35c', .9 * lit); for (let i = 0; i < 6; i++) ctx.fillRect(-w / 2 + w * (.05 + .1 * i), -hh * .7, Math.max(1, s * .05), Math.max(1, s * .08)); for (let i = 0; i < 4; i++) ctx.fillRect(w * (.16 + .08 * i), -hh * 1.3, Math.max(1, s * .04), Math.max(1, s * .1)); }
  return tops;
}
function headframe(ctx, t, s, red, seed) {
  // a mine headframe: an A-frame of steel over the shaft, the wheel turning, a dark spoil heap beside it
  ctx.fillStyle = '#1c0f12'; ctx.strokeStyle = rgba('#ff8a48', .3 + .5 * red); ctx.lineWidth = Math.max(.9, s * .03); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(s * .2, 0); ctx.quadraticCurveTo(s * .6, -s * .5, s * 1.2, 0); ctx.closePath(); ctx.fill(); ctx.stroke();   // spoil heap
  ctx.beginPath(); ctx.moveTo(-s * .3, 0); ctx.lineTo(-s * .03, -s * .95); ctx.moveTo(s * .2, 0); ctx.lineTo(s * .03, -s * .95); ctx.moveTo(-s * .55, 0); ctx.lineTo(-s * .05, -s * .8);
  ctx.moveTo(-s * .22, -s * .3); ctx.lineTo(s * .14, -s * .3); ctx.moveTo(-s * .13, -s * .62); ctx.lineTo(s * .08, -s * .62);
  ctx.moveTo(s * .2, 0); ctx.lineTo(-s * .22, -s * .3); ctx.moveTo(-s * .22, -s * .3); ctx.lineTo(s * .08, -s * .62); ctx.stroke();
  const wr = s * .14; ctx.save(); ctx.translate(0, -s * .98); ctx.rotate(t * 1.4 + seed);
  ctx.beginPath(); ctx.arc(0, 0, wr, 0, TAU); ctx.stroke(); for (let i = 0; i < 4; i++) { ctx.rotate(Math.PI / 4); ctx.beginPath(); ctx.moveTo(-wr, 0); ctx.lineTo(wr, 0); ctx.stroke(); }
  ctx.restore();
  glowAt(ctx, 0, -s * .5, s * .45, .3 * red, '#ff7a3c', '#ffd9a8');
}
// a terraced open pit cut into the land in front of the limb (foreshortened, irregular), its floor glowing
const PITR = Array.from({ length: 5 }, (_, i) => { const r = prng(90 + i); return Array.from({ length: 24 }, () => .82 + .36 * r()); });
function pit(ctx, t, m, p, i, u, red) {
  if (u <= 0) return;
  const x = p.x, y = limbY(x) + p.d, v = onSphere(x, y); if (!v) return;
  const X = m.X(x), Y = m.Y(y), rx = 120 * p.s * m.k * ease.out(u), sq = clamp(v[2] * 1.15, .14, .6);
  if (rx < 1.5) return;
  ctx.save(); ctx.translate(X, Y); ctx.scale(1, sq);
  const shape = (q) => { ctx.beginPath(); const P = PITR[i % 5]; for (let k = 0; k <= 24; k++) { const a = k / 24 * TAU, rr = rx * q * P[k % 24]; k ? ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); };
  for (let k = 0; k < 6; k++) {
    const q = 1 - k * .15;
    ctx.save(); ctx.translate(0, k * rx * .06); shape(q);
    ctx.fillStyle = k % 2 ? '#3a1612' : '#24100e'; ctx.fill();
    ctx.strokeStyle = rgba('#ff9a60', (.16 + .1 * k) * red); ctx.lineWidth = Math.max(.6, rx * .01) / sq; ctx.stroke();
    ctx.restore();
  }
  const gl = ctx.createRadialGradient(0, rx * .4, 0, 0, rx * .4, rx * .3); gl.addColorStop(0, rgba('#ffb070', .8 * red)); gl.addColorStop(1, rgba('#e2552c', 0));
  ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(0, rx * .4, rx * .3, 0, TAU); ctx.fill();
  ctx.restore();
}
// a forest seen on the limb: a band of round crowns (engraved: dark mass, a rim of light on top, a few hatch strokes)
export function forest(ctx, t, m, x0, x1, o = {}) {
  const r = prng(o.seed ?? 5), n = Math.round((x1 - x0) / 15), rim = o.rim || 'rgba(255,140,90,.5)', body = o.col || '#120c12';
  ctx.save(); ctx.fillStyle = body; ctx.strokeStyle = rim; ctx.lineWidth = Math.max(.6, 1.6 * m.k);
  for (let i = 0; i < n; i++) {
    const x = x0 + (i + r()) * (x1 - x0) / n, h = (o.h ?? 34) * (.7 + .6 * r()), g = o.grow ? o.grow(x) : 1; if (g <= 0) { r(); continue; }
    const s = h * m.k * g; if (s < 1.2) { r(); continue; }
    ctx.save(); atLimb(ctx, m, x, -2); const sway = .02 * Math.sin(t * .8 + i);
    ctx.rotate(sway); ctx.fillRect(-s * .04, -s * .45, s * .08, s * .45);
    ctx.beginPath(); ctx.arc(0, -s * .62, s * .34, 0, TAU); ctx.arc(-s * .2, -s * .48, s * .24, 0, TAU); ctx.arc(s * .22, -s * .5, s * .25, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -s * .62, s * .34, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    ctx.restore();
    r();
  }
  ctx.restore();
}
// F: { I (heat 0..1), hot, ember 0..1, t0 (factories of "make more"), things, mines, land (times of the words), out0 (the windows go dark) }
export function furnaceProps(ctx, t, m, F) {
  const red = clamp(F.I * 1.2), tops = [];
  FURN.mines.forEach((p, i) => pit(ctx, t, m, p, i, lin(F.mines - .1 + i * .08, F.mines + .55 + i * .08, t), red));
  // the forest on the left; "More land": its edge retreats (right to left, each crown sinks back into the ground)
  forest(ctx, t, m, -1180, -420, { seed: 5, rim: rgba('#ff8a48', .25 + .4 * red), grow: (x) => { if (x < -900) return 1; const d = F.land - .05 + (-420 - x) / 480; return 1 - ease.inn(lin(d, d + .35, t)); } });
  FURN.mines.forEach((p, i) => {
    const u = ease.out(lin(F.mines - .05 + i * .08, F.mines + .45 + i * .08, t)); if (u <= 0) return;
    const s = 62 * p.s * m.k; if (s < 1.5) return;
    ctx.save(); atLimb(ctx, m, p.hx); ctx.scale(1, u); headframe(ctx, t, s, red, i); ctx.restore();
  });
  FURN.fac.forEach((p, i) => {
    const t0 = p.k === 0 ? F.t0 + i * .3 : F.things - .1 + (p.k - 1) * .065, u = ease.out(lin(t0, t0 + .55, t)); if (u <= 0) return;
    const s = p.h * m.k; if (s < 1.5) return;
    const lit = (.75 + .25 * Math.sin(t * 1.3 + i)) * (1 - .92 * lin(F.out0 + (i % 6) * .14, F.out0 + .35 + (i % 6) * .14, t));
    ctx.save(); atLimb(ctx, m, p.x); ctx.scale(1, u); const tp = factory(ctx, t, s, p, lit, red); ctx.restore();
    if (u > .9) for (const q of tp.slice(0, 1)) tops.push({ th: Math.asin(clamp(p.x / R0, -1, 1)) + q[0] / m.k / R0, lift: -q[1] / m.k, t0: t0 + .35, i: i * 3 + tops.length });
  });
  return tops;
}
// chimney smoke: engraved ribbons that rise, lean, widen and flatten under the glass (world polar coords round the Earth's centre);
// billows travel up the ribbon (a puffy edge), the underside catches the glow
export function smoke(ctx, t, m, tops, F) {
  if (!tops.length) return;
  const cx = m.X(0), cy = m.Y(0), N = 22, I = clamp(F.I);
  ctx.save(); ctx.lineJoin = 'round';
  for (const s of tops) {
    const grow = clamp((t - s.t0) / 2.2); if (grow <= 0) continue;
    const dir = s.i % 2 ? 1 : -1, r0 = R0 + s.lift, top = mix(r0, RD * .93, ease.out(grow)), P = [], Wd = [];
    for (let j = 0; j <= N; j++) {
      const q = j / N, rr = mix(r0, top, Math.pow(q, .9)), lean = dir * (.004 * q + .018 * Math.pow(clamp((rr - r0) / (RD * .93 - r0) * 1.3 - .3), 1.6));
      const th = s.th + lean + .0035 * Math.sin(q * 7 - t * 1.6 + s.i) * q;
      P.push([cx + rr * Math.sin(th) * m.k, cy - rr * Math.cos(th) * m.k]);
      Wd.push((6 + 46 * Math.pow(q, 1.1) + 110 * Math.pow(q, 6)) * ease.out(grow) ** .5 * 1 * (1 + .22 * Math.sin(q * 13 - t * 2.4 + s.i * 1.3)) * m.k);
    }
    const xs = P.map((p) => p[0]), ys = P.map((p) => p[1]); if (Math.max(...xs) < -80 || Math.min(...xs) > W + 80 || Math.max(...ys) < -80 || Math.min(...ys) > H + 80) continue;
    const Nn = P.map((p, j) => { const a = P[Math.max(0, j - 1)], b = P[Math.min(N, j + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1; return [-dy / d, dx / d]; });
    const rib = (k, off = 0) => { ctx.beginPath(); for (let j = 0; j <= N; j++) { const w = Wd[j] * k / 2; ctx[j ? 'lineTo' : 'moveTo'](P[j][0] + Nn[j][0] * (w + off * Wd[j]), P[j][1] + Nn[j][1] * (w + off * Wd[j])); } for (let j = N; j >= 0; j--) { const w = Wd[j] * k / 2; ctx.lineTo(P[j][0] - Nn[j][0] * (w - off * Wd[j]), P[j][1] - Nn[j][1] * (w - off * Wd[j])); } ctx.closePath(); };
    ctx.fillStyle = rgba('#2a1c1a', .32); rib(1.35); ctx.fill();
    ctx.fillStyle = rgba('#241816', .55); rib(.9); ctx.fill();
    ctx.fillStyle = rgba('#e2552c', .16 * I * Math.min(1.4, F.hot ?? 1)); rib(.45, .18); ctx.fill();
    // engraved curls along the ribbon
    ctx.strokeStyle = rgba('#ff9a60', .14 * I); ctx.lineWidth = Math.max(.5, .9 * m.k); ctx.beginPath();
    for (let j = 3; j < N; j += 3) { const w = Wd[j] * .45, ph = (j / N * 9 - t * 1.6 + s.i) % TAU; ctx.moveTo(P[j][0] + Nn[j][0] * w, P[j][1] + Nn[j][1] * w); ctx.quadraticCurveTo(P[j][0] + Nn[j][0] * w * .2 + Math.cos(ph) * 3, P[j][1] + Nn[j][1] * w * .2 - 4 * m.k, P[j][0] - Nn[j][0] * w * .6, P[j][1] - Nn[j][1] * w * .6); }
    ctx.stroke();
  }
  ctx.restore();
}
// the smoke ceiling: a dark pall pooled under the glass, engraved billow lines drifting slowly through it
export function smokeCeiling(ctx, t, m, F) {
  if (F.I <= 0) return;
  const cx = m.X(0), cy = m.Y(0), a0 = clamp(F.pall ?? 0); if (a0 <= 0) return;
  const r1 = RD * m.k, r0 = RD * (.8 - .06 * a0) * m.k;
  ctx.save();
  const g = ctx.createRadialGradient(cx, cy, r0, cx, cy, r1); g.addColorStop(0, 'rgba(30,20,20,0)'); g.addColorStop(.45, rgba('#2a1a18', .45 * a0)); g.addColorStop(.85, rgba('#1c1212', .78 * a0)); g.addColorStop(1, rgba('#2a1a18', .6 * a0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r1, 0, TAU); ctx.arc(cx, cy, r0, 0, TAU, true); ctx.fill('evenodd');
  ctx.strokeStyle = rgba('#ff9a60', .1 * a0 * clamp(F.I * 1.3)); ctx.lineWidth = Math.max(.6, 1.1 * m.k);
  for (let i = 0; i < 26; i++) {
    const rr = RD * (.84 + .14 * ((i * 7) % 13) / 13), th0 = -.62 + ((i * 37) % 26) / 26 * 1.3 + t * .006 * (i % 2 ? 1 : -1), L = .08 + .05 * ((i * 3) % 5) / 5;
    ctx.beginPath(); for (let k = 0; k <= 16; k++) { const th = th0 + L * k / 16, wob = 18 * Math.sin(k * .9 + i + t * .4); const X = cx + (rr + wob) * Math.sin(th) * m.k, Y = cy - (rr + wob) * Math.cos(th) * m.k; k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke();
  }
  ctx.restore();
}
// nine gauges along the dome rim (the nine planetary limits); F.dial[i] 0..1: the needle swings into the red
export const DIALS = [-.215, -.16, -.105, -.05, .005, .135, .19, .245, .3];
export function dials(ctx, t, m, F) {
  const cx = m.X(0), cy = m.Y(0), rr = RD * m.k, R = 40 * m.k;
  if (R < 4) return;
  DIALS.forEach((th, i) => {
    const X = cx + (rr + R * .1) * Math.sin(th), Y = cy - (rr + R * .1) * Math.cos(th); if (X < -R * 2 || X > W + R * 2 || Y < -R * 2 || Y > H + R * 2) return;
    gauge(ctx, t, X, Y, R, th, F.dial[i] ?? 0, i, clamp(F.I));
  });
}
// a half-round gauge (a meter, not a clock): iron bezel with rivets, cream scale, red zone at the right end, a needle from the pivot
function gauge(ctx, t, X, Y, R, rot, u, i, I) {
  ctx.save(); ctx.translate(X, Y); ctx.rotate(rot);
  const a0 = Math.PI * 1.06, a1 = Math.PI * 1.94;
  ctx.fillStyle = '#20141a'; ctx.beginPath(); ctx.arc(0, R * .25, R, Math.PI, TAU); ctx.lineTo(R, R * .45); ctx.lineTo(-R, R * .45); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba('#ff9a50', .35 + .35 * I); ctx.lineWidth = Math.max(1, R * .05); ctx.stroke();
  ctx.fillStyle = rgba('#ffb070', .55); for (const q of [-.9, -.5, .5, .9]) ctx.fillRect(q * R * .92 - 1, R * .35 - 1, 2, 2);
  const fr = R * .84; ctx.fillStyle = '#efe2c8'; ctx.beginPath(); ctx.arc(0, R * .25, fr, Math.PI, TAU); ctx.closePath(); ctx.fill();
  const zone = mix(a0, a1, .7);
  ctx.strokeStyle = F7.stamp; ctx.lineWidth = fr * .18; ctx.beginPath(); ctx.arc(0, R * .25, fr * .74, zone, a1); ctx.stroke();
  ctx.strokeStyle = rgba(F7.ink, .8); ctx.lineWidth = Math.max(.6, fr * .04); ctx.beginPath();
  for (let k = 0; k <= 6; k++) { const q = mix(a0, a1, k / 6), l = k % 2 ? .8 : .64; ctx.moveTo(Math.cos(q) * fr * .9, R * .25 + Math.sin(q) * fr * .9); ctx.lineTo(Math.cos(q) * fr * l, R * .25 + Math.sin(q) * fr * l); }
  ctx.stroke();
  const e = ease.out(u) * (1 + .045 * Math.sin(Math.PI * clamp(u))), q = mix(a0 + .25, a1 - .1, e) + (u >= 1 ? .035 : .012) * Math.sin(t * 8 + i * 2.1);
  ctx.strokeStyle = F7.ink; ctx.lineWidth = Math.max(1, fr * .07); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, R * .25); ctx.lineTo(Math.cos(q) * fr * .86, R * .25 + Math.sin(q) * fr * .86); ctx.stroke();
  ctx.fillStyle = F7.ink; ctx.beginPath(); ctx.arc(0, R * .25, fr * .1, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = Math.max(.6, fr * .045); ctx.beginPath(); ctx.arc(0, R * .25, fr * .8, Math.PI * 1.15, Math.PI * 1.4); ctx.stroke();
  ctx.restore();
  const fl = u > 0 ? Math.sin(Math.PI * clamp(u * 1.4)) : 0; if (fl > 0) glowAt(ctx, X, Y, R * 2.4, .45 * fl, '#e2552c', '#ffd9a8');
}

// ================================================================ THE RING: the sunrise (copied from lib/f7_c03_wall.mjs, sun angle as a parameter)
export const SUN = { th: .2, rs: 30 };
export function sunrise(ctx, t, m, o = {}) {
  const u = o.u ?? 0; if (u <= 0) return null;
  const h = o.h ?? mix(-70, 58, ease.out(u)), [wx, wy] = polar(SUN.th, EARTH.R + h), X = m.X(wx), Y = m.Y(wy), k = m.k * (o.k ?? 1), br = (o.br ?? 1) * (1 + .03 * Math.sin(t * 2.3));
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  glowAt(ctx, X, Y, 1500 * k * br, .3 * clamp(u * 1.5), '#ffb35c', '#fff1d6');
  glowAt(ctx, X, Y, 420 * k * br, .7 * clamp(u * 1.5), '#ffd08e', '#ffffff');
  glowAt(ctx, X, Y, 90 * k * br, .95, '#fff1d6', '#ffffff');
  ctx.fillStyle = rgba('#fffaf0', 1); ctx.beginPath(); ctx.arc(X, Y, SUN.rs * k, 0, TAU); ctx.fill();
  ctx.lineCap = 'round';
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * TAU + t * .03 + (i % 2) * .1, L = (i % 3 === 0 ? 620 : 300) * k * br * clamp(u * 1.3), w = i % 3 === 0 ? 1.8 : 1.1;
    const gr = ctx.createLinearGradient(X, Y, X + Math.cos(a) * L, Y + Math.sin(a) * L); gr.addColorStop(0, rgba('#fff1d6', .55)); gr.addColorStop(1, rgba('#ffb35c', 0));
    ctx.strokeStyle = gr; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(X, Y); ctx.lineTo(X + Math.cos(a) * L, Y + Math.sin(a) * L); ctx.stroke();
  }
  ctx.restore();
  return [X, Y];
}
export function sunriseLimb(ctx, t, m, o = {}) {
  const u = o.u ?? 0; if (u <= 0) return;
  const cx = m.X(0), cy = m.Y(0), r = EARTH.R * m.k, thC = SUN.th - Math.PI / 2, a = clamp(u * 1.4) * (o.br ?? 1);
  const prof = (spread, amp) => { const cg = ctx.createConicGradient(0, cx, cy); for (let i = 0; i <= 120; i++) { const ang = i / 120 * TAU, dd = Math.abs(mod(ang - thC + Math.PI, TAU) - Math.PI); cg.addColorStop(i / 120, rgba('#ffcf8a', clamp(amp * Math.exp(-dd * dd / spread)))); } return cg; };
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [lw, sp, amp, dr] of [[Math.max(14, 60 * m.k), .05, .22 * a, 6], [Math.max(4, 14 * m.k), .03, .55 * a, 2], [1.6, .02, .95 * a, 0]]) {
    ctx.strokeStyle = prof(sp, amp); ctx.lineWidth = lw; ctx.beginPath(); ctx.arc(cx, cy, r + dr * m.k, 0, TAU); ctx.stroke();
  }
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip();
  ctx.strokeStyle = prof(.04, .3 * a); ctx.lineWidth = Math.max(6, 70 * m.k); ctx.beginPath(); ctx.arc(cx, cy, r - 35 * m.k, 0, TAU); ctx.stroke();
  ctx.restore();
  ctx.restore();
}
// the dawn over the right Earth: a warm sky behind the limb (before the disc), the land washed in dawn light and teal sea (after it)
export function dawnSky(ctx, t, m, u) {
  if (u <= 0) return;
  // in orbit the sky stays dark at sunrise: the dawn is a warm band hugging the limb, strongest toward the sun, and a glow round the sun
  const cx = m.X(0), cy = m.Y(0), r = EARTH.R * m.k, [wx, wy] = polar(SUN.th, EARTH.R + 40), X = m.X(wx), Y = m.Y(wy);
  const b = ctx.createRadialGradient(cx, cy, r, cx, cy, r * 1.16);
  b.addColorStop(0, rgba('#f1d9a8', .55 * u)); b.addColorStop(.1, rgba('#e7b893', .42 * u)); b.addColorStop(.35, rgba('#b47e98', .24 * u)); b.addColorStop(.7, rgba('#5a4c8a', .1 * u)); b.addColorStop(1, 'rgba(60,50,120,0)');
  ctx.fillStyle = b; ctx.beginPath(); ctx.arc(cx, cy, r * 1.16, 0, TAU); ctx.arc(cx, cy, r, 0, TAU, true); ctx.fill('evenodd');
  const g = ctx.createRadialGradient(X, Y, 0, X, Y, 1500 * m.k);
  g.addColorStop(0, rgba('#fff1d0', .7 * u)); g.addColorStop(.2, rgba('#f1d9a8', .4 * u)); g.addColorStop(.5, rgba('#d49a8a', .16 * u)); g.addColorStop(1, 'rgba(160,110,140,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
export function ringDisc(ctx, t, m, u) {
  if (u <= 0) return;
  const cx = m.X(0), cy = m.Y(0), r = EARTH.R * m.k, [wx, wy] = polar(SUN.th, EARTH.R), X = m.X(wx), Y = m.Y(wy);
  ctx.save();
  // teal sea and green land in the first light (a cool wash over the whole disc, warm toward the sun)
  ctx.fillStyle = rgba('#1f5a60', .28 * u); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();
  const g = ctx.createRadialGradient(X, Y, 0, X, Y, 1600 * m.k); g.addColorStop(0, rgba('#f1d9a8', .45 * u)); g.addColorStop(.3, rgba('#c99a6e', .2 * u)); g.addColorStop(.7, rgba('#4f7f6a', .08 * u)); g.addColorStop(1, 'rgba(60,120,100,0)');
  ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();
  // the glitter path on the bay below the sun
  const rr = prng(23); ctx.fillStyle = rgba('#fff1d6', .8 * u);
  for (let i = 0; i < 70; i++) {
    const q = rr(), x = wx - 60 + (rr() - .5) * 120 * (1 + q * 2.4), y = wy + 25 + q * 330, v = onSphere(x, y); if (!v) continue;
    const tw = .5 + .5 * Math.sin(t * (2 + rr() * 3) + i), sx = m.X(x), sy = m.Y(y), L = (3 + 8 * rr()) * m.k * (1 + q);
    ctx.globalAlpha = tw * (1 - q * .6); ctx.fillRect(sx - L / 2, sy, L, Math.max(.8, 1.4 * m.k * v[2] * 2));
  }
  ctx.restore();
}
// ---------------------------------------------------------------- the ring world's props
export const RINGW = {
  library: { x: -330, h: 70 }, clinic: { x: 160, h: 46 }, solar: [{ x: 290, h: 22, n: 4 }, { x: 395, h: 21, n: 4 }, { x: 495, h: 19, n: 4 }],
  houses: (() => { const r = prng(91), o = []; for (let i = 0; i < 11; i++) o.push({ x: -250 + i * 22 + 7 * r(), h: 15 + 12 * r(), w: .9 + .5 * r(), seed: i }); return o; })(),
  people: [{ x: 18, s: 0, pose: 'look' }, { x: 30, s: 1, pose: 'stand', kid: true }, { x: 42, s: 2, pose: 'look' }, { x: 84, s: 3, pose: 'stand' }, { x: 95, s: 4, pose: 'look' }],
};
function library(ctx, t, s, lit) {
  const w = s * 1.5, body = '#151a2e', rim = 'rgba(255,214,160,.6)';
  ctx.fillStyle = body; ctx.strokeStyle = rim; ctx.lineWidth = Math.max(.8, s * .02); ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.rect(-w / 2 - s * .04, -s * .06, w + s * .08, s * .06); ctx.fill(); ctx.stroke();               // steps
  ctx.beginPath(); ctx.rect(-w / 2, -s * .62, w, s * .56); ctx.fill(); ctx.stroke();                                     // hall
  ctx.beginPath(); ctx.moveTo(-w / 2 - s * .05, -s * .62); ctx.lineTo(0, -s * .92); ctx.lineTo(w / 2 + s * .05, -s * .62); ctx.closePath(); ctx.fill(); ctx.stroke();   // pediment
  // tall lit windows between the columns, with the spines of books in them
  for (let i = 0; i < 4; i++) {
    const x = -w / 2 + w * (.08 + .235 * i), ww = w * .14, y0 = -s * .55, hh = s * .42;
    ctx.fillStyle = rgba('#ffcf8a', .9 * lit); ctx.fillRect(x, y0, ww, hh);
    if (lit > .1) { const r = prng(i + 3); for (let row = 0; row < 3; row++) for (let k = 0; k < 6; k++) { const bx = x + ww * (.06 + k * .15), by = y0 + hh * (.1 + row * .31); ctx.fillStyle = ['#7a3a2a', '#2f5a5e', '#8a6a2a', '#5a2f4a'][Math.floor(r() * 4)]; ctx.globalAlpha = lit; ctx.fillRect(bx, by, ww * .1, hh * (.18 + .06 * r())); } ctx.globalAlpha = 1; }
    ctx.fillStyle = body; ctx.fillRect(x + ww + w * .03, -s * .6, w * .05, s * .54);   // a column
  }
  if (lit > 0) glowAt(ctx, 0, -s * .3, s * 1.2, .35 * lit, '#ffb35c', '#fff1d6');
}
function clinic(ctx, t, s, lit) {
  const w = s * 1.6, body = '#d9dee6', ink = '#2a3446';
  ctx.fillStyle = body; ctx.strokeStyle = 'rgba(42,52,70,.8)'; ctx.lineWidth = Math.max(.8, s * .025);
  ctx.beginPath(); ctx.rect(-w / 2, -s * .55, w, s * .55); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#c4cbd6'; ctx.beginPath(); ctx.rect(-w / 2 - s * .05, -s * .62, w + s * .1, s * .08); ctx.fill(); ctx.stroke();
  // the big window, lit warm
  ctx.fillStyle = rgba('#ffd59a', .25 + .7 * lit); ctx.fillRect(-w * .38, -s * .42, w * .5, s * .26);
  ctx.strokeStyle = rgba(ink, .7); ctx.strokeRect(-w * .38, -s * .42, w * .5, s * .26); ctx.beginPath(); ctx.moveTo(-w * .13, -s * .42); ctx.lineTo(-w * .13, -s * .16); ctx.stroke();
  ctx.fillStyle = rgba(ink, .9); ctx.fillRect(w * .2, -s * .4, w * .16, s * .4);   // the door
  // the sign: a green cross on a disc above the roof
  const cy = -s * .9, cr = s * .2; ctx.fillStyle = '#f3ecda'; ctx.beginPath(); ctx.arc(0, cy, cr, 0, TAU); ctx.fill(); ctx.strokeStyle = rgba(ink, .6); ctx.stroke();
  ctx.fillStyle = '#4f8f62'; ctx.fillRect(-cr * .2, cy - cr * .62, cr * .4, cr * 1.24); ctx.fillRect(-cr * .62, cy - cr * .2, cr * 1.24, cr * .4);
  ctx.fillStyle = rgba(ink, .8); ctx.fillRect(-s * .015, cy + cr, s * .03, -cy - cr - s * .62);
  if (lit > 0) glowAt(ctx, -w * .13, -s * .3, s * 1.0, .3 * lit, '#ffcf8a', '#fff6e0');
}
function house(ctx, s, w, lit, seed) {
  const hw = s * .5 * w, body = '#1a1a2c';
  ctx.fillStyle = body; ctx.strokeStyle = 'rgba(255,214,160,.5)'; ctx.lineWidth = Math.max(.6, s * .04);
  ctx.beginPath(); ctx.moveTo(-hw, 0); ctx.lineTo(-hw, -s * .6); ctx.lineTo(0, -s); ctx.lineTo(hw, -s * .6); ctx.lineTo(hw, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = rgba('#ffc878', lit); ctx.fillRect(-hw * .55, -s * .48, hw * .4, s * .22); if (seed % 2) ctx.fillRect(hw * .15, -s * .48, hw * .4, s * .22);
}
function birds(ctx, t, m, t0) {
  const age = t - t0; if (age < 0 || age > 7) return;
  const r = prng(61); ctx.save(); ctx.strokeStyle = 'rgba(30,24,40,.85)'; ctx.lineCap = 'round';
  for (let i = 0; i < 14; i++) {
    const d0 = r() * .5, a2 = age - d0; if (a2 < 0) continue;
    const x = -820 + r() * 260 + a2 * (40 + 20 * r()), y = limbY(-820) - 20 - a2 * (34 + 16 * r()) - r() * 30, X = m.X(x), Y = m.Y(y), s = (5 + 3 * r()) * m.k, fl = Math.sin(t * 9 + i * 1.7) * .6;
    ctx.lineWidth = Math.max(.8, s * .18); ctx.beginPath(); ctx.moveTo(X - s, Y - s * fl * .6); ctx.quadraticCurveTo(X - s * .4, Y - s * .4 * (1 + fl), X, Y); ctx.quadraticCurveTo(X + s * .4, Y - s * .4 * (1 + fl), X + s, Y - s * fl * .6); ctx.stroke();
  }
  ctx.restore();
}
// G: { dawn 0..1, know (t of "Knowledge"), health, sun, rich 0..1, wild (t of "wild places") }
export function ringProps(ctx, t, m, G) {
  const gold = (a) => rgba('#ffd9a0', a);
  // forests on both sides (they stay)
  forest(ctx, t, m, -900, -400, { seed: 5, col: '#0f1e1a', rim: gold(.2 + .3 * G.dawn) });
  forest(ctx, t, m, 560, 1100, { seed: 8, col: '#0f1e1a', rim: gold(.25 + .55 * G.dawn) });
  // the town: houses with warm windows; "richer": every window glows, a few lanterns
  RINGW.houses.forEach((p) => { const s = p.h * m.k; if (s < 1.2) return; ctx.save(); atLimb(ctx, m, p.x); house(ctx, s, p.w, .55 + .45 * G.rich + .08 * Math.sin(t * 1.1 + p.seed), p.seed); ctx.restore(); });
  // the library ("Knowledge"): it rises, its windows light up
  { const p = RINGW.library, u = ease.out(lin(G.know - .1, G.know + .45, t)), s = p.h * m.k; if (u > 0 && s > 1.5) { ctx.save(); atLimb(ctx, m, p.x); ctx.scale(1, u); library(ctx, t, s, lin(G.know, G.know + .4, t)); ctx.restore(); } }
  // the clinic ("Health")
  { const p = RINGW.clinic, u = ease.out(lin(G.health - .1, G.health + .45, t)), s = p.h * m.k; if (u > 0 && s > 1.5) { ctx.save(); atLimb(ctx, m, p.x); ctx.scale(1, u); clinic(ctx, t, s, lin(G.health, G.health + .4, t)); ctx.restore(); } }
  // solar fields ("Power from the sun"): they tilt up out of the land and catch the light
  RINGW.solar.forEach((p, i) => {
    const u = ease.out(lin(G.sun - .25 + i * .07, G.sun + .3 + i * .07, t)); if (u <= 0) return;
    limbProp(ctx, t, m, { kind: 'solar', x: p.x, h: p.h, n: p.n, grow: u, col: '#1a2440', rim: gold(.4 + .5 * G.dawn) });
    const sh = lin(G.sun + .1 + i * .1, G.sun + .9 + i * .1, t); if (sh > 0) { const ph = mod(t * .35 + i * .3, 1), x = p.x - p.n * p.h * .6 + ph * p.n * p.h * 1.3, y = limbY(x) - p.h * .3; glowAt(ctx, m.X(x), m.Y(y), 26 * m.k, .5 * sh, '#ffd08e', '#ffffff'); }
  });
  // people at figure scale on the rise beside the town, watching the sunrise
  RINGW.people.forEach((p, i) => {
    const s = (p.kid ? .1 : .14) * 1.5 * m.k; if (s * 185 < 6) return;
    ctx.save(); atLimb(ctx, m, p.x); const hip = (p.kid ? .3 : .47) * 185 * s;
    figureFlat(ctx, 0, -hip, s, POSES[p.pose], { t, seed: 40 + p.s * 7, col: '#141428', rim: gold(.7), rimSide: 1, fast: true, shadow: false, hatch: false, shade: 0 });
    ctx.restore();
  });
  birds(ctx, t, m, G.wild);
}
// the amber curve bends over and lies down along the ring (after c06's bendPts: the top first, the base last; it keeps its length)
export const RING_R = EARTH.R * 1.045;
const pol = (x, y) => [Math.atan2(x, -y), Math.hypot(x, y)];
export function bendTo(CW, iS, u, S = CURVE.S) {
  if (u <= 0) return CW;
  const N = CW.length - 1, [thS, rS] = pol(S[0], S[1]);
  const L = [0]; for (let i = iS + 1; i <= N; i++) L.push(L[L.length - 1] + Math.hypot(CW[i][0] - CW[i - 1][0], CW[i][1] - CW[i - 1][1]));
  return CW.map((p, i) => {
    if (i < iS) return p;
    const s = (i - iS) / (N - iS), lag = .55, b = ease.io(clamp((u - (1 - s) * lag) / (1 - lag)));
    if (b <= 0) return p;
    const [th0, r0] = pol(p[0], p[1]), len = L[i - iS];
    const rise = clamp(len / 160), rT = mix(rS, RING_R, ease.sine(rise)), thT = thS + len / RING_R * .98;
    return [...polar(mix(th0, thT, b), mix(r0, rT, b)), p[2]];
  });
}

// ================================================================ text
export function title(ctx, t, s, x, y, t0, t1, o = {}) {
  const a = ease.out(lin(t0, t0 + .6, t)), b = ease.inn(lin(t1 - .45, t1, t)); if (a <= 0 || b >= 1) return;
  const size = o.size ?? 84, align = o.align ?? 'left';
  ctx.save(); ctx.font = `${size}px "Instrument Serif"`; try { ctx.letterSpacing = `${o.spacing ?? size * .06}px`; } catch { } const tw = ctx.measureText(s).width; try { ctx.letterSpacing = '0px'; } catch { } ctx.restore();
  const x0 = align === 'center' ? x - tw / 2 : x;
  ctx.save(); ctx.beginPath(); ctx.rect(x0 - 12 + (tw + 30) * b, y - size * 1.05, (tw + 30) * (a - b), size * 1.5); ctx.clip();
  ctx.shadowColor = o.shadow ?? 'rgba(0,0,0,.35)'; ctx.shadowBlur = 16;
  text(ctx, s, x0, y, { size, font: 'Instrument Serif', color: o.color ?? '#f6efdc', spacing: o.spacing ?? size * .06 });
  if (o.sub) { ctx.shadowBlur = 0; text(ctx, o.sub, x0 + 2, y + 40, { size: 18, weight: 600, color: rgba('#e8dcc8', .85), spacing: 5 }); }
  ctx.restore();
  if (o.bar) { ctx.fillStyle = o.bar; if (align === 'center') ctx.fillRect(x - 40 * (a - b), y + 22, 80 * (a - b), 2.5); else ctx.fillRect(x0 - 26, y - size * .74, 3, size * .92 * (a - b)); }
}
