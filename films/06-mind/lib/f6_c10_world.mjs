// Film 6 · c10 (§6, the fork) · helpers owned by the c10 builder. Everything is a pure function of t (film seconds).
// ONE world, one camera, no cut: a dark plain at night. In the foreground the page of values (the c09>c10 paper plate IS its face);
// from its upper corners the cool line draws two paths. Path one ends at the left in an alcove of five standing mirrors under one warm
// bulb (the room of mirrors; every reflection is you, smiling); path two ends at the right at one plain dark pane standing on the ground,
// you before it in profile. Behind everything a low skyline; in the building at the far right three windows light up at the end, and the
// camera pushes into the last one: its light is the c10>c11 lamp plate.
//   camPath(keys, t)              camera keyframes [{ t, x, y, z, e }] → { x, y, z } (a COPY of c01's helper; quart in-out, 'out', 'lin', 'cubic')
//   sheetFaces(HI, tCache)        → (t) => [plateCanvas, bandCanvas]: the page's face is HI.plate live until tCache, then the same image cached;
//                                 the band above it (heading VALUES, a rule, two scribbled lines) continues the plate's own gradient
//   groundLayer() / skylineLayer()  cached static layers (2400 px wide: the camera runs past x 1920 at the end)
//   mirrorArc(ctx, t, m, o)       the five mirrors in SCREEN space (crisp reflections at any zoom), the bulb, the floor pool, the painted heart
//   honestPane(ctx, t, m, o)      the plain pane (screen space) with its screen: glyph answer → retreat → the readable answer
//   you(ctx, m, wx, feet, s, pose, o)   figure() in screen space (vector, crisp at any zoom), lights/cast mapped
//   paintedHeart / brush          the flat red heart painted on the centre mirror with a visible brush
//   windowPlate(ctx, t, HO, sx, sy, uP)  the push into the lit window: the light becomes the plate (c03's soft-edged growing region)
import { W, H, rgba, clamp, lin, mix, sm, eout, ein, eio, prng, drift, canvas, text, addGlow, hatch } from '../engine.mjs';
import { F6, pane, ember, coolLine, coolText, view, camMap, layer, once, breathe } from './f6_kit.mjs';
import { figure, POSES, walk, reachArm } from './figure.mjs';
import { stipple } from './art.mjs';
import { scribble } from './paper.mjs';

const TAU = Math.PI * 2;
export const quart = (u) => (u < .5 ? 8 * u * u * u * u : 1 - Math.pow(-2 * u + 2, 4) / 2);
export const expoOut = (u) => (u >= 1 ? 1 : 1 - Math.pow(2, -10 * u));
export function camPath(keys, t) {
  if (t <= keys[0].t) return { x: keys[0].x, y: keys[0].y, z: keys[0].z };
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (t <= b.t) { const u = clamp((t - a.t) / Math.max(1e-6, b.t - a.t)), e = b.e === 'lin' ? u : b.e === 'out' ? expoOut(u) : b.e === 'cubic' ? eio(u) : b.e === 'soft' ? .14 * u + .86 * quart(u) : quart(u); return { x: mix(a.x, b.x, e), y: mix(a.y, b.y, e), z: mix(a.z, b.z, e) }; }
  }
  const k = keys[keys.length - 1]; return { x: k.x, y: k.y, z: k.z };
}
const hex2 = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
export const mixHex = (a, b, u) => { const A = hex2(a), B = hex2(b); return '#' + A.map((v, i) => Math.round(mix(v, B[i], clamp(u))).toString(16).padStart(2, '0')).join(''); };
const bez = (p0, p1, p2, n = 26) => { const o = []; for (let i = 0; i <= n; i++) { const u = i / n, a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u; o.push([a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1]]); } return o; };
const cub = (p0, p1, p2, p3, n = 18) => { const o = []; for (let i = 0; i <= n; i++) { const u = i / n, a = (1 - u) ** 3, b = 3 * (1 - u) ** 2 * u, c = 3 * (1 - u) * u * u, d = u ** 3; o.push([a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]]); } return o; };

// ---------------------------------------------------------------- the world (z = 1 coordinates)
export const HOR = 500;                                                         // the horizon of the plain
export const SHEET = { x: 760, y: 760, w: 400, h: 225, band: 80 };              // the page: plate region (16:9) + the written band above it
export const BANDPX = Math.round(SHEET.band * W / SHEET.w);                     // 384 plate px
export const CAM_SHEET = { x: SHEET.x + SHEET.w / 2, y: SHEET.y + SHEET.h / 2, z: W / SHEET.w };   // the page's face fills the frame exactly
export const BULB = { x: 472, y: 404 };                                         // the warm bulb over the mirrors
export const YOU1 = { x: 470, feet: 700, s: .55 };                              // you in the room of mirrors, just right of the centre mirror's axis (its reflection and the painted heart stay visible)
export const MIRRORS = [                                                        // an alcove: the centre one farthest (smallest, highest), the sides nearest
  { x: 250, base: 692, w: 150, h: 230, off: 48, turn: .55, seed: 1 },     // off: where your reflection appears in this glass (world px from its axis)
  { x: 340, base: 666, w: 138, h: 212, off: 30, turn: .8, seed: 2 },
  { x: 430, base: 640, w: 128, h: 198, off: 0, turn: 1, seed: 3 },
  { x: 520, base: 666, w: 138, h: 212, off: 42, turn: .8, seed: 4 },
  { x: 610, base: 692, w: 150, h: 230, off: 12, turn: .55, seed: 5 },
];
export const PANE2 = { x: 1560, y: 485, w: 320, h: 350 };                       // the plain pane of path two (base y 660)
export const YOU2 = { x: 1392, feet: 690, s: .55 };                             // you before it, in profile, facing it
export const PATH1 = bez([772, 745], [560, 802], [452, 724]);
export const PATH2 = bez([1148, 745], [1330, 802], [1385, 724]);
export const RUN2 = [...PATH2, [1400, 706], [1560, PANE2.y + PANE2.h / 2 + 4]];   // the values run on from the path's end into the pane
export const DRIFTERS = [                                                       // the people who could feel with us: at the edge of the warm light, then walking away
  { x0: 128, feet: 672, s: .5, dir: -1, seed: 21, acc: '#3e4e78', v: 52 },
  { x0: 722, feet: 646, s: .5, dir: 1, seed: 22, acc: '#5a4a6a', v: 56 },
  { x0: 884, feet: 604, s: .42, dir: 1, seed: 23, acc: '#4a5a4e', v: 46 },
];
export const SKY_P = .92;                                                       // the skyline's parallax
export const SISTER = { x: 1652, w: 290, top: 236, cols: [1700, 1790, 1880], rows: [296, 366, 436], ww: 34, wh: 46 };
export const LIT = [[1700, 366], [1790, 436], [1880, 296]];                     // the three windows that light up ("Three things"), in order
export const DRESS_YOU = { coat: '#8a5a4a', pants: '#1a1420', hair: '#1c1420', skin: '#d9b08e' };

// ---------------------------------------------------------------- the page's face: the plate (live, then cached) and the written band above it
const PAPER_WARM = ['#f6e7c9', '#e8cfa2', '#d2ad74'];
function bandPaint(g, t) {
  const [p0, p1, p2] = PAPER_WARM, lx = W * .32 + 30 * drift(t, 1, 2), ly = H * .25 + BANDPX;   // the plate's own light, continued upward
  const gr = g.createRadialGradient(lx, ly, 0, lx, ly, 1700); gr.addColorStop(0, p0); gr.addColorStop(.6, p1); gr.addColorStop(1, p2); g.fillStyle = gr; g.fillRect(0, 0, W, BANDPX);
  const r = prng(78); g.lineCap = 'round';
  for (let i = 0; i < 150; i++) { const x = r() * W, y = r() * BANDPX, a = (r() - .5) * 2.4, L = 6 + r() * 26, k = r(); g.strokeStyle = rgba(k < .5 ? '#8a7350' : '#fffaf0', .07 + .06 * k); g.lineWidth = .7 + k * .6; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke(); }
  const v = g.createRadialGradient(W / 2, H / 2 + BANDPX, H * .45, W / 2, H / 2 + BANDPX, W * .75); v.addColorStop(0, 'rgba(60,40,20,0)'); v.addColorStop(1, 'rgba(60,40,20,.22)'); g.fillStyle = v; g.fillRect(0, 0, W, BANDPX);
  // the heading, a rule, two written lines (unreadable: values, written down)
  text(g, 'VALUES', 150, 132, { size: 84, weight: 600, color: rgba(F6.ink, .82), spacing: 16 });
  g.fillStyle = rgba(F6.ink, .28); g.fillRect(150, 162, 1620, 3);
  scribble(g, 150, 196, 1480, 72, { seed: 5, ink: rgba(F6.ink, .72), lw: 3.2 });
  scribble(g, 150, 282, 1180, 72, { seed: 9, ink: rgba(F6.ink, .66), lw: 3.2 });
  // the top edge of the page is its rough edge: a thin dark line
  g.fillStyle = 'rgba(90,70,50,.35)'; g.fillRect(0, 0, W, 3);
}
export function sheetFaces(HI, tCache) {
  const [pc, pg] = canvas(W, H), [bc, bg] = canvas(W, BANDPX);
  return (t) => {
    if (t < tCache) { pg.setTransform(1, 0, 0, 1, 0, 0); HI.plate(pg, t); bg.setTransform(1, 0, 0, 1, 0, 0); bandPaint(bg, t); return [pc, bc]; }
    return [layer('c10-plate-cached', W, H, (g) => HI.plate(g, tCache)), layer('c10-band-cached', W, BANDPX, (g) => bandPaint(g, tCache))];
  };
}
// the sheet's shadow on the ground (world units)
export function sheetShadow(g) {
  const x = SHEET.x, y = SHEET.y - SHEET.band, w = SHEET.w, h = SHEET.h + SHEET.band;
  for (const [o, a] of [[26, .08], [16, .12], [8, .22]]) { g.fillStyle = rgba('#000000', a); g.beginPath(); g.roundRect(x - o + 10, y - o + 14, w + 2 * o, h + 2 * o, o); g.fill(); }
}

// ---------------------------------------------------------------- the plain: sky, horizon haze, ground (static, cached; 2400 wide, origin at world (-240, -60))
export const GROUND_OFF = [-240, -60];
export function groundLayer() {
  return layer('c10-ground', 2400, 1200, (g, c) => {
    g.translate(-GROUND_OFF[0], -GROUND_OFF[1]);
    const sky = g.createLinearGradient(0, -60, 0, HOR); sky.addColorStop(0, '#05071a'); sky.addColorStop(.7, '#0a0e26'); sky.addColorStop(1, '#141a3a'); g.fillStyle = sky; g.fillRect(-240, -60, 2400, HOR + 60);
    const gr = g.createLinearGradient(0, HOR, 0, 1140); gr.addColorStop(0, '#171e3e'); gr.addColorStop(.18, '#0f1430'); gr.addColorStop(.6, '#090c20'); gr.addColorStop(1, '#05061a'); g.fillStyle = gr; g.fillRect(-240, HOR, 2400, 640);
    // a haze band on the horizon, the far light of the plain
    const hz = g.createLinearGradient(0, HOR - 70, 0, HOR + 90); hz.addColorStop(0, 'rgba(90,110,170,0)'); hz.addColorStop(.45, 'rgba(90,110,170,.13)'); hz.addColorStop(1, 'rgba(90,110,170,0)'); g.fillStyle = hz; g.fillRect(-240, HOR - 70, 2400, 160);
    // faint engraved hatch in the near dark, fibre everywhere
    hatch(g, null, -.85, 8, .05, { box: [-240, 700, 2400, 440], col: '#000000', w: .8, wobble: .6 });
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .22, g: 1, seed: 3, mid: false, boost: 1 });
  });
}
// the skyline on the horizon: low dark blocks with unlit windows; the sister's building at the far right (parallax SKY_P)
export function skylineLayer() {
  return layer('c10-skyline', 2400, 620, (g, c) => {
    g.translate(-GROUND_OFF[0], 0);
    const r = prng(41); let x = -240;
    while (x < 2160) {
      const w = 60 + r() * 150, h = 40 + r() * 150, top = HOR - h, dark = r() < .5;
      if (x > 1590 && x < 2000) { x += w; continue; }   // room for the sister's building
      g.fillStyle = dark ? '#090d22' : '#0b1028'; g.fillRect(x, top, w, h + 20);
      g.fillStyle = 'rgba(200,215,255,.05)'; g.fillRect(x, top, w, 1.5);
      g.fillStyle = '#07091c'; for (let wy = top + 14; wy < HOR - 16; wy += 30) for (let wx = x + 12; wx < x + w - 16; wx += 26) if (r() < .4) g.fillRect(wx, wy, 8, 12);
      x += w + 4 + r() * 30;
    }
    const S = SISTER; g.fillStyle = '#0d122c'; g.fillRect(S.x, S.top, S.w, HOR - S.top + 20); g.fillStyle = 'rgba(200,215,255,.07)'; g.fillRect(S.x, S.top, S.w, 2);
    g.fillStyle = '#0a0d22'; g.fillRect(S.x + 22, S.top - 26, 60, 26);   // a roof house
    g.fillStyle = '#070a1c'; for (const wy of S.rows) for (const wx of S.cols) g.fillRect(wx, wy, S.ww, S.wh);
    // the window frames: thin lighter lines
    g.strokeStyle = 'rgba(180,195,230,.08)'; g.lineWidth = 1; for (const wy of S.rows) for (const wx of S.cols) g.strokeRect(wx + .5, wy + .5, S.ww - 1, S.wh - 1);
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .2, g: 1, seed: 6, mid: false, boost: 1 });
  });
}

// ---------------------------------------------------------------- figures in screen space (vector: crisp at any zoom)
const mapL = (m, L) => (L ? { ...L, x: m.X(L.x), y: m.Y(L.y) } : undefined);
export function you(ctx, m, wx, feet, s, pose, o = {}) {
  const S = s * m.k, x = m.X(wx), y = m.Y(feet) - 88 * S;
  if (x < -300 || x > W + 300 || y < -400 || y > H + 300) return null;
  return figure(ctx, x, y, S, pose, { ...o, light: mapL(m, o.light), cast: mapL(m, o.cast) });
}
// the nod of the reflections: a dip and return on each accent word (in unison)
export const nodK = (t, times) => times.reduce((k, at) => k + Math.sin(Math.PI * lin(at, at + .6, t)), 0);
// a 4-point foil sparkle (praise)
export function sparkle(ctx, x, y, r, a) {
  if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(F6.praise, .9 * a); ctx.beginPath();
  for (let q = 0; q < 4; q++) { const an = q * Math.PI / 2; ctx.lineTo(x + Math.cos(an) * r, y + Math.sin(an) * r); ctx.lineTo(x + Math.cos(an + Math.PI / 4) * r * .18, y + Math.sin(an + Math.PI / 4) * r * .18); }
  ctx.closePath(); ctx.fill(); ctx.restore();
}

// ---------------------------------------------------------------- the room of mirrors (screen space; m = camMap(cam, 1))
//   o = { t, lampA, nod (0..2 head dip), heart: { u1, u2 } (the painted lobes 0..1), brush: { x, y, lift, a } (heart units, null = none),
//         glint (0..1 praise sparkles), heartLocal: [x, y] (heart centre in the centre mirror, pane-local world units) }
export function mirrorArc(ctx, t, m, o = {}) {
  const k = m.k, lampA = o.lampA ?? 1, br = breathe(t, 60, 0);
  const bx = m.X(BULB.x), by = m.Y(BULB.y);
  if (bx < -800 || bx > W + 800 || by < -800 || by > H + 800) return;
  // the warm pool on the floor under the bulb (the room's floor), rose
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(m.X(YOU1.x + 20), m.Y(YOU1.feet + 6)); ctx.scale(1, .3);
  const pg = ctx.createRadialGradient(0, 0, 0, 0, 0, 300 * k * br); pg.addColorStop(0, rgba('#ffb8a0', .22 * lampA)); pg.addColorStop(.5, rgba('#ff9a80', .08 * lampA)); pg.addColorStop(1, rgba('#ff9a80', 0)); ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(0, 0, 300 * k, 0, TAU); ctx.fill(); ctx.restore();
  // the mirrors, farthest first (the centre), the near sides last
  const order = [2, 1, 3, 0, 4], out = {};
  for (const i of order) {
    const M = MIRRORS[i], cy = M.base - M.h / 2, sx = m.X(M.x), sy = m.Y(cy), sw = M.w * k, sh = M.h * k;
    const P = pane(ctx, t, { x: sx, y: sy, w: sw, h: sh, frame: 'mirror', edge: .55, radius: 2, reflectA: 1, reflectDim: .22, spill: false, seed: 30 + i, sheen: .8,
      reflect: (g) => {
        // the warm room in the glass: rose-dark walls, the bulb's light high up, the floor's pool low
        const bg = g.createLinearGradient(0, -sh / 2, 0, sh / 2); bg.addColorStop(0, '#3a2430'); bg.addColorStop(.6, '#241620'); bg.addColorStop(1, '#160d12'); g.fillStyle = bg; g.fillRect(-sw / 2, -sh / 2, sw, sh);
        const lx = (M.x - BULB.x) * .5 * k, ly = (BULB.y - cy) * k;   // the bulb as this mirror sees it (pane() mirrors x)
        addGlow(g, lx, ly, 140 * k, .55 * lampA, '#ffb8a0', '#fff1d6');
        g.save(); g.globalCompositeOperation = 'lighter'; const fp = g.createRadialGradient(0, sh / 2, 0, 0, sh / 2, sw * .7); fp.addColorStop(0, rgba('#ffb8a0', .2 * lampA)); fp.addColorStop(1, rgba('#ffb8a0', 0)); g.fillStyle = fp; g.fillRect(-sw / 2, 0, sw, sh / 2); g.restore();
        // you, smiling, turned to us; the nod on the accent words
        const S = YOU1.s * k, fx = -M.off * k, fy = (YOU1.feet - cy) * k - 88 * S, nd = o.nod || 0;
        figure(g, fx, fy, S, { ...POSES.stand, turn: M.turn, smile: .85, head: .05 + .2 * nd, lean: .03 * nd, hands: ['relaxed', 'relaxed'] },
          { t, seed: 7 + i, dress: DRESS_YOU, light: { x: lx, y: ly, col: '#ffd9c0', a: .62 * (.5 + .5 * lampA) }, rim: rgba('#ffb8a0', .85 * (.4 + .6 * lampA)), rimSide: lx > fx ? 1 : -1, shadow: false });
      } });
    if (i === 2) out.centre = P;
  }
  // the painted heart on the centre mirror's glass, where the reflection's chest is
  const P = out.centre, hc = o.heartLocal || [0, 0], HX = P.x + hc[0] * k, HY = P.y + hc[1] * k;
  if (o.heart && (o.heart.u1 > 0 || o.heart.u2 > 0)) { ctx.save(); P.path(); ctx.clip(); paintedHeart(ctx, HX, HY, k, o.heart.u1, o.heart.u2); ctx.restore(); }
  if (o.brush && o.brush.a > 0) brush(ctx, HX + o.brush.x * k, HY + o.brush.y * k, k, o.brush.lift, o.brush.a);
  // praise: a few foil sparkles run over the centre mirror's frame
  if (o.glint > 0) { const r = prng(9); for (let i = 0; i < 5; i++) { const ph = r(), px = P.x + (r() - .5) * P.w * 1.05, py = P.y + (r() - .5) * P.h * 1.05, kk = Math.sin(Math.PI * clamp((o.glint - ph * .5) / .5)); sparkle(ctx, px, py, (5 + 5 * r()) * Math.max(.6, k * .5), kk); } }
  // the bulb hanging on its cord (the ember of this room), drawn over the mirrors
  ctx.save(); ctx.strokeStyle = '#1a1420'; ctx.lineWidth = Math.max(1.2, 2.2 * k); ctx.beginPath(); ctx.moveTo(bx, by - 46 * k); ctx.lineTo(bx + 2 * Math.sin(t * .4), -40); ctx.stroke(); ctx.restore();
  ember(ctx, t, { x: bx, y: by, kind: 'bulb', s: .95 * k, a: lampA, r: 92, col: '#ffb8a0', core: '#fff1d6', deep: '#a04a3a' });
  // the bulb's wide, soft light over the room (its own bloom stays small so the glass bulb reads as a bulb)
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const wg = ctx.createRadialGradient(bx, by + 40 * k, 0, bx, by + 40 * k, 520 * k * br); wg.addColorStop(0, rgba('#ffb8a0', .16 * lampA)); wg.addColorStop(.5, rgba('#ff9a80', .05 * lampA)); wg.addColorStop(1, rgba('#ff9a80', 0)); ctx.fillStyle = wg; ctx.fillRect(bx - 600 * k, by - 600 * k, 1200 * k, 1200 * k); ctx.restore();
  return out;
}

// ---------------------------------------------------------------- the painted heart (flat paint, a brush) · heart units = world px, origin = the heart's centre
const LOBE_L = (() => { const a = cub([0, 20], [-12, 10], [-26, -2], [-18, -14]), b = cub([-18, -14], [-11, -24], [0, -16], [0, -6]); return [...a, ...b.slice(1)]; })();
const LOBE_R = LOBE_L.map(([x, y]) => [-x, y]);
export const HEART = { startL: LOBE_L[0], endL: LOBE_L[LOBE_L.length - 1], startR: LOBE_R[0], endR: LOBE_R[LOBE_R.length - 1], at: (lobe, u) => { const P = lobe === 'L' ? LOBE_L : LOBE_R, s = clamp(u) * (P.length - 1), i = Math.min(P.length - 2, Math.floor(s)), q = s - i; return [mix(P[i][0], P[i + 1][0], q), mix(P[i][1], P[i + 1][1], q)]; } };
function strokePaint(ctx, pts, u, k) {
  u = clamp(u); if (u <= 0) return; const n = Math.max(1, Math.round(u * (pts.length - 1)));
  const trace = (dx, dy) => { ctx.beginPath(); ctx.moveTo(pts[0][0] * k + dx, pts[0][1] * k + dy); for (let i = 1; i <= n; i++) ctx.lineTo(pts[i][0] * k + dx, pts[i][1] * k + dy); };
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const r = prng(5);
  for (let p = 0; p < 3; p++) { ctx.strokeStyle = rgba('#e86a6a', p === 2 ? .95 : .55); ctx.lineWidth = (p === 2 ? 8 : 9.5) * k; trace((r() - .5) * 2.2 * k, (r() - .5) * 2.2 * k); ctx.stroke(); }
  ctx.strokeStyle = rgba('#c24a52', .35); ctx.lineWidth = 1.3 * k; trace(1.8 * k, -1.4 * k); ctx.stroke(); trace(-2 * k, 1.6 * k); ctx.stroke();   // bristle marks
  ctx.strokeStyle = rgba('#ffd0c8', .18); ctx.lineWidth = 1.2 * k; trace(-.6 * k, -2.4 * k); ctx.stroke();
}
export function paintedHeart(ctx, x, y, k, u1, u2) {
  ctx.save(); ctx.translate(x, y); strokePaint(ctx, LOBE_L, u1, k); strokePaint(ctx, LOBE_R, u2, k); ctx.restore();
}
// the brush at its tip (x, y screen), pointing up-right; lift 0..1 raises it off the glass
export function brush(ctx, x, y, k, lift = 0, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x - 4 * k * lift, y - 9 * k * lift); ctx.rotate(-.95); ctx.scale(k, k);
  // the shadow of the lifted brush on the glass
  if (lift > 0) { ctx.save(); ctx.translate(3 * lift, 6 * lift); ctx.fillStyle = rgba('#000000', .25 * lift); ctx.beginPath(); ctx.roundRect(-2, -14, 6, 72, 3); ctx.fill(); ctx.restore(); }
  // bristles: a tapered tuft, red at the tip
  const bg = ctx.createLinearGradient(0, 0, 0, 16); bg.addColorStop(0, '#e86a6a'); bg.addColorStop(.55, '#c99a7a'); bg.addColorStop(1, '#8a6a46');
  ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-5, 8, -4.5, 16); ctx.lineTo(4.5, 16); ctx.quadraticCurveTo(5, 8, 0, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#b8894a'; ctx.beginPath(); ctx.roundRect(-5, 16, 10, 9, 1.5); ctx.fill(); ctx.fillStyle = 'rgba(255,240,200,.35)'; ctx.fillRect(-5, 17, 10, 1.2);   // the ferrule
  const hg = ctx.createLinearGradient(-4, 0, 4, 0); hg.addColorStop(0, '#1a1418'); hg.addColorStop(.45, '#3a2c30'); hg.addColorStop(1, '#140f12'); ctx.fillStyle = hg; ctx.beginPath(); ctx.roundRect(-3.6, 25, 7.2, 62, [1, 1, 3, 3]); ctx.fill();   // the handle
  ctx.fillStyle = 'rgba(255,230,210,.22)'; ctx.fillRect(-1.6, 27, 1, 56);
  ctx.restore();
}

// ---------------------------------------------------------------- the plain pane of path two (screen space)
//   o = { t, screenA (0..1), edge (0..1 extra), screen: (g, w, h) in pane-world units (origin top-left) }
export function honestPane(ctx, t, m, o = {}) {
  const k = m.k, sx = m.X(PANE2.x), sy = m.Y(PANE2.y), sw = PANE2.w * k, sh = PANE2.h * k;
  if (sx < -sw || sx > W + sw || sy < -sh || sy > H + sh) return null;
  // its foot on the ground: a thin shadow and a cool line of its light on the floor
  ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(sx, sy + sh / 2 + 4 * k, sw * .5, 5 * k, 0, 0, TAU); ctx.fill(); ctx.restore();
  const sA = clamp(o.screenA ?? 0);
  return pane(ctx, t, { x: sx, y: sy, w: sw, h: sh, frame: 'thin', edge: .7 + (o.edge || 0), radius: 3, spill: sA > 0, seed: 12, sheen: .9, screenA: sA,
    screen: sA > 0 && o.screen ? (g) => { g.scale(k, k); o.screen(g, PANE2.w, PANE2.h); } : undefined });
}

// ---------------------------------------------------------------- the push into the lit window: the light itself becomes the plate (c10>c11)
export function windowPlate(ctx, t, HO, sx, sy, uP) {
  if (uP <= 0) return;
  const [pc, pg] = once('c10-plate-out', () => canvas(W, H)); pg.setTransform(1, 0, 0, 1, 0, 0); pg.globalCompositeOperation = 'source-over'; pg.globalAlpha = 1; pg.clearRect(0, 0, W, H);
  const rr = 40 + 1900 * uP, ko = Math.pow(1 - uP, 1.6);
  pg.fillStyle = '#e08a3c'; pg.fillRect(0, 0, W, H);
  pg.save(); pg.translate((sx - W / 2) * ko, (sy - H / 2) * ko); HO.plate(pg, t); pg.restore();
  pg.globalCompositeOperation = 'destination-in'; const mk = pg.createRadialGradient(sx, sy, rr * .62, sx, sy, rr); mk.addColorStop(0, 'rgba(0,0,0,1)'); mk.addColorStop(1, 'rgba(0,0,0,0)'); pg.fillStyle = mk; pg.fillRect(0, 0, W, H);
  ctx.drawImage(pc, 0, 0);
}
// a simple phone in the hand (figure units; drawn by figure() as a prop after the front arm)
export const phoneProp = (g, arm) => { g.save(); g.translate(arm.hx + Math.sin(arm.ang) * 3, arm.hy + Math.cos(arm.ang) * 3); g.rotate(-arm.ang + .25); g.fillStyle = '#0d0e18'; g.beginPath(); g.roundRect(-3.2, -7.5, 6.4, 15, 1.4); g.fill(); g.fillStyle = 'rgba(191,227,255,.35)'; g.fillRect(-2.2, -6, 4.4, 11.5); g.restore(); };
export { walk, reachArm, POSES };
