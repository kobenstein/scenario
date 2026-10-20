// C5 · "north": Alaska in the winter night (3.06 ★, 3.07a, 3.07b, 3.07c). Owner: c05. Everything code-drawn, cached by key.
//   aurora(ctx, t, o)              the aurora as engraved guilloche curtains (the certificate line in the sky): fine weaving lines,
//                                  vertical rays that flicker, a soft glow on the lower edge. o: { a, dx, dy (camera offset px), curtains }
//   auroraBase(t, o) → pts         the lowest line of the main curtain (screen px) — the coast thread lands on it (3.05 → 3.06)
//   northWide(ctx, t, o)           3.06 wide: sky, aurora, mountains, spruce line, snow field + road, log cabin, villa, trailer, their
//                                  mailboxes; o: { cam: { x, y, z } (parallax camera), same (0..1 the envelopes light up), tilt (0..1 the
//                                  landscape descends from above: the camera tilting up from the map), a } → { boxes: [{x,y}…] (screen) }
//   mailbox(ctx, x, y, s, kind, o) a rural mailbox ('cabin' | 'villa' | 'trailer') with the envelope; o: { t, env (0..1 envelope in),
//                                  glow (0..1), snow (0..1 cap), lid (0..1 open), pull (0..1 envelope pulled out), light }
//   envelope(ctx, x, y, s, o)      the small cream envelope with the engraved check peeking out; o: { t, rot, glow, open (0..1), check (0..1) }
//   seasonsMailbox(ctx, t, o)      3.07a: close on the cabin's mailbox while the seasons turn; o: { u (0..1 over the shot) }
//   twoBoxes(ctx, t, o)            3.07b: the villa's and the trailer's mailbox, a spruce trunk between them, two hands pull envelopes
//   porch(ctx, t, o)               3.07c: the cabin's porch under the lamp, a child and a grandmother open the same envelope
import { Path2D } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, eout, eio, prng, drift, canvas, text } from '../engine.mjs';
import { stipple, vnoise, fbm, fog as artFog, hatch as artHatch, roughPath, cone } from './art.mjs';
import { figure, figureKid, KIDPOSES } from './figure.mjs';
import { hand } from './hand.mjs';
import { gBorder, rosette, microtext } from './certificate.mjs';

const CACHE = new Map(); const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const TAU = Math.PI * 2;
export const NP = { sky0: '#040817', sky1: '#0c1b33', sky2: '#173556', snow: '#dfe8f2', snowMid: '#9fb3cf', snowDeep: '#3d5577', aur: '#5fe0a8', aurHi: '#b8ffe0', aurTeal: '#3fc9c0', aurTop: '#5a5fc8', amber: '#ffb35c', core: '#fff1d6' };
export function mixHex(a, b, u) { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const m = (s) => Math.round(mix((A >> s) & 255, (B >> s) & 255, clamp(u))); return '#' + [m(16), m(8), m(0)].map((v) => v.toString(16).padStart(2, '0')).join(''); }
const shade = (hex, d) => mixHex(hex, d < 0 ? '#000000' : '#ffffff', Math.abs(d));

// ---------------------------------------------------------------- aurora
// curtains: y = base line (px), h = height, x0..x1 span, A = sway amplitude, f1/f2 = waves across, w1/w2 = speed, p = parallax
export const CURTAINS = [
  { x0: -240, x1: 2160, y: 380, h: 400, A: 52, f1: 5.2, f2: 11.5, w1: .16, w2: .23, ph: 0, lines: 34, band: 9, nw: 9, wv: .5, lw: .9, a: .95, p: .25, rays: 150, col0: '#b8ffe0', col1: '#5fe0a8', col2: '#5a5fc8' },
  { x0: 300, x1: 2300, y: 250, h: 280, A: 38, f1: 4.1, f2: 9.3, w1: -.12, w2: .19, ph: 2.1, lines: 24, band: 7, nw: 7, wv: -.4, lw: .8, a: .6, p: .18, rays: 100, col0: '#9ff7d8', col1: '#3fc9c0', col2: '#5a5fc8' },
  { x0: -300, x1: 1100, y: 190, h: 220, A: 30, f1: 3.3, f2: 8.1, w1: .1, w2: -.15, ph: 4.2, lines: 20, band: 6, nw: 6, wv: .35, lw: .7, a: .42, p: .14, rays: 70, col0: '#9ff7d8', col1: '#3fc9c0', col2: '#6f62c8' },
];
function curtainGeo(c, t, dx, dy, N = 140) {
  const xs = new Float64Array(N + 1), base = new Float64Array(N + 1), hg = new Float64Array(N + 1);
  for (let i = 0; i <= N; i++) {
    const q = i / N, x = mix(c.x0, c.x1, q) + dx * c.p;
    xs[i] = x; base[i] = c.y + dy * c.p + c.A * Math.sin(q * c.f1 + t * c.w1 + c.ph) + c.A * .45 * Math.sin(q * c.f2 - t * c.w2 + c.ph * 2.3) + c.A * .2 * Math.sin(q * 23 + t * .7);
    const env = Math.pow(Math.sin(Math.PI * q), .5); hg[i] = c.h * env * (.7 + .3 * Math.sin(q * 6.3 + t * .45 + c.ph));
  }
  return { xs, base, hg, N };
}
export function auroraBase(t, o = {}) {
  const c = (o.curtains || CURTAINS)[0], G = curtainGeo(c, t, o.dx ?? 0, o.dy ?? 0, o.n ?? 140), out = [];
  for (let i = 0; i <= G.N; i++) out.push([G.xs[i], G.base[i]]); return out;
}
export function aurora(ctx, t, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const dx = o.dx ?? 0, dy = o.dy ?? 0, fan = clamp(o.fan ?? 1);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  for (const c of (o.curtains || CURTAINS)) {
    const G = curtainGeo(c, t, dx, dy), { xs, base, hg, N } = G;
    // glow along the lower edge (wide, faint strokes) and a veil above it
    for (const [w, al] of [[90, .025], [40, .05], [14, .09]]) { ctx.globalAlpha = a * c.a * al * 1.6; ctx.strokeStyle = c.col1; ctx.lineWidth = w; ctx.beginPath(); for (let i = 0; i <= N; i++) { const y = base[i] - w * .25; i ? ctx.lineTo(xs[i], y) : ctx.moveTo(xs[i], y); } ctx.stroke(); }
    // the veil: the curtain's body, bright just above the lower edge, fading upward into violet
    { let yb = -1e9, yt = 1e9; for (let i = 0; i <= N; i++) { yb = Math.max(yb, base[i]); yt = Math.min(yt, base[i] - hg[i] * fan); }
      const vg = ctx.createLinearGradient(0, yb + 10, 0, yt); vg.addColorStop(0, rgba(c.col0, 0)); vg.addColorStop(.05, rgba(c.col0, .26)); vg.addColorStop(.25, rgba(c.col1, .13)); vg.addColorStop(.6, rgba(c.col2, .05)); vg.addColorStop(1, rgba(c.col2, 0));
      ctx.globalAlpha = a * c.a; ctx.fillStyle = vg; ctx.beginPath(); for (let i = 0; i <= N; i++) i ? ctx.lineTo(xs[i], base[i] + 6) : ctx.moveTo(xs[i], base[i] + 6); for (let i = N; i >= 0; i--) ctx.lineTo(xs[i], base[i] - hg[i] * fan); ctx.closePath(); ctx.fill(); }
    // the curtain: guilloche lines weaving upward, green at the base → teal → violet at the top
    const L = Math.max(2, Math.round(c.lines * mix(.15, 1, fan)));
    for (let k = 0; k < L; k++) {
      const f = k / (c.lines - 1) * mix(.2, 1, fan), col = f < .45 ? mixHex(c.col0, c.col1, f / .45) : mixHex(c.col1, c.col2, (f - .45) / .55);
      ctx.strokeStyle = col; ctx.globalAlpha = .55 * a * c.a * Math.pow(1 - f, 1.35) * (.55 + .45 * Math.sin(k * 1.73 + 1)); ctx.lineWidth = c.lw * (1 + (1 - f) * .6);
      ctx.beginPath();
      for (let i = 0; i <= N; i++) { const q = i / N, wv = Math.sin(q * c.nw * TAU + k * .83 + t * c.wv) * c.band * (1 - f * .4) + Math.sin(q * c.nw * 2.07 * TAU - k * 1.3 + t * c.wv * .7) * c.band * .3; const y = base[i] - hg[i] * f + wv; i ? ctx.lineTo(xs[i], y) : ctx.moveTo(xs[i], y); }
      ctx.stroke();
    }
    // vertical rays: travelling brightness waves, each ray three stacked strokes (bright at the base, fading up)
    const R = Math.round(c.rays * 2 * fan);
    for (let j = 0; j < R; j++) {
      const q = (j + .5) / (c.rays * 2) + .004 * Math.sin(t * .8 + j), i = Math.min(N, Math.max(0, Math.round(q * N))), x = xs[i];
      const b = Math.pow(.5 + .5 * Math.sin(q * 41 + t * 1.1 + c.ph) * Math.sin(q * 13 - t * .63 + j * .1), 2.2); if (b < .05) continue;
      const y0 = base[i] + 4, top = hg[i] * (.55 + .45 * Math.abs(Math.sin(j * 2.31 + c.ph)));
      ctx.lineWidth = 1.2 + 2.4 * Math.abs(Math.sin(j * 3.7));
      for (let s = 0; s < 3; s++) { ctx.globalAlpha = a * c.a * b * [.6, .3, .12][s]; ctx.strokeStyle = s ? c.col1 : c.col0; ctx.beginPath(); ctx.moveTo(x, y0 - top * s / 3); ctx.lineTo(x + (s + 1) * .6, y0 - top * (s + 1) / 3); ctx.stroke(); }
    }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the wide landscape (cached layers)
const HZ = 604; // horizon (ground line far)
function northSky() {
  return once('nsky', () => {
    const [c, g] = canvas(W + 400, H + 200), r = prng(17);
    const lg = g.createLinearGradient(0, 0, 0, HZ + 120); lg.addColorStop(0, NP.sky0); lg.addColorStop(.55, NP.sky1); lg.addColorStop(1, '#1d3b5a'); g.fillStyle = lg; g.fillRect(0, 0, c.width, c.height);
    // a green breath of the aurora on the sky low down
    const gg = g.createRadialGradient(900, 420, 0, 900, 420, 1200); gg.addColorStop(0, 'rgba(95,224,168,.16)'); gg.addColorStop(.5, 'rgba(63,201,192,.05)'); gg.addColorStop(1, 'rgba(63,201,192,0)'); g.save(); g.translate(0, 420); g.scale(1, .5); g.translate(0, -420); g.fillStyle = gg; g.fillRect(0, -800, c.width, 2400); g.restore();
    for (let i = 0; i < 520; i++) { const x = r() * c.width, y = Math.pow(r(), 1.4) * (HZ + 60), m = r(); g.fillStyle = `rgba(225,236,255,${(.12 + .6 * m * m) * (1 - y / (HZ + 120))})`; const z = m > .96 ? 2.2 : 1.2; g.fillRect(x, y, z, z); }
    stipple(c, { k: .3, g: 1, seed: 18, mid: false, boost: 1 });
    return c;
  });
}
// far mountains: snowy ridges, intaglio hatch on the shadow side, the aurora's green on the snow faces
function northMountains() {
  return once('nmount', () => {
    const [c, g] = canvas(W + 400, H), n = vnoise(31);
    const ridge = (pts, fill, seed) => { g.beginPath(); roughPath(g, pts, { amp: 3, step: 9, seed }); g.fillStyle = fill; g.fill(); };
    const far = [[-20, HZ + 10]]; for (let x = -20; x <= W + 420; x += 18) far.push([x, HZ - 70 - 120 * Math.pow(Math.abs(Math.sin(x * .0042 + 1.2)), 1.6) - 40 * fbm(n, x * .008, 1, 3)]); far.push([W + 420, HZ + 10]);
    ridge(far, '#22385a', 3);
    g.save(); g.beginPath(); roughPath(g, far, { amp: 3, step: 9, seed: 3 }); g.clip();
    // snow faces lit from the upper left (aurora): pale, hatched on the right flanks
    for (let x = -20; x <= W + 420; x += 2) { const top = far.reduce((m, p) => Math.abs(p[0] - x) < 10 ? Math.min(m, p[1]) : m, 1e9); }
    const sg = g.createLinearGradient(0, HZ - 220, 0, HZ); sg.addColorStop(0, 'rgba(210,228,245,.55)'); sg.addColorStop(.5, 'rgba(150,180,215,.25)'); sg.addColorStop(1, 'rgba(60,85,120,0)'); g.fillStyle = sg; g.fillRect(0, HZ - 240, W + 400, 240);
    artHatch(g, [-20, HZ - 260, W + 440, 270], { angle: .9, gap: 3.4, w: .7, col: '#0d1a30', a: .45, wobble: .6, seed: 4, broken: .3 });
    const ag = g.createLinearGradient(0, HZ - 220, 0, HZ - 40); ag.addColorStop(0, 'rgba(95,224,168,.18)'); ag.addColorStop(1, 'rgba(95,224,168,0)'); g.globalCompositeOperation = 'lighter'; g.fillStyle = ag; g.fillRect(0, HZ - 240, W + 400, 220); g.globalCompositeOperation = 'source-over';
    g.restore();
    const near = [[-20, HZ + 10]]; for (let x = -20; x <= W + 420; x += 16) near.push([x, HZ - 18 - 46 * Math.pow(Math.abs(Math.sin(x * .0061 + .3)), 1.3) - 18 * fbm(n, x * .013, 4, 3)]); near.push([W + 420, HZ + 10]);
    ridge(near, '#1a2c48', 5);
    g.save(); g.beginPath(); roughPath(g, near, { amp: 3, step: 9, seed: 5 }); g.clip(); artHatch(g, [-20, HZ - 90, W + 440, 100], { angle: -.8, gap: 3, w: .6, col: '#08111f', a: .4, seed: 6, broken: .2 }); g.restore();
    stipple(c, { k: .3, g: 1, seed: 32, mid: false, boost: 1 });
    return c;
  });
}
function spruce(g, x, y, h, col, snowCol, seed, snowA = .8) {
  const r = prng(seed), w = h * .36, tiers = 7;
  g.fillStyle = col; g.beginPath(); g.moveTo(x, y - h);
  for (let i = 1; i <= tiers; i++) { const q = i / tiers, yy = y - h + h * q * .92, ww = w * q * (1 + (r() - .5) * .15); g.lineTo(x + ww * .55, yy - h * .05); g.lineTo(x + ww, yy); g.lineTo(x + ww * .45, yy - h * .015); }
  g.lineTo(x + w * .1, y); g.lineTo(x - w * .1, y);
  for (let i = tiers; i >= 1; i--) { const q = i / tiers, yy = y - h + h * q * .92, ww = w * q * (1 + (r() - .5) * .15); g.lineTo(x - ww * .45, yy - h * .015); g.lineTo(x - ww, yy); g.lineTo(x - ww * .55, yy - h * .05); }
  g.closePath(); g.fill();
  if (snowCol) { g.strokeStyle = rgba(snowCol, snowA); g.lineWidth = Math.max(1, h * .018); g.lineCap = 'round'; for (let i = 1; i <= tiers; i++) { const q = i / tiers, yy = y - h + h * q * .92, ww = w * q; g.beginPath(); g.moveTo(x - ww * .9, yy - h * .004); g.quadraticCurveTo(x - ww * .3, yy - h * .07, x + ww * .1, yy - h * .055); g.stroke(); } }
}
function northTrees() {
  return once('ntrees', () => {
    const [c, g] = canvas(W + 400, H), r = prng(41);
    for (let x = -30; x < W + 430; x += 7 + r() * 16) { const h = 22 + r() * 46; spruce(g, x, HZ + 8 + r() * 6, h, r() < .5 ? '#0b1626' : '#0e1b2e', '#a9c2dd', Math.floor(r() * 1e6), .35); }
    stipple(c, { k: .3, g: 1, seed: 42, mid: false, boost: 1 });
    return c;
  });
}
// the road from the near left foreground curving away to the right
export const ROAD = [[980, 1100], [820, 930], [790, 830], [880, 752], [1090, 690], [1360, 648], [1640, 622], [1980, 606]];
function roadEdge(side) { return ROAD.map(([x, y], i) => { const w = mix(130, 6, clamp((1100 - y) / 494)) * side; const a = i < ROAD.length - 1 ? Math.atan2(ROAD[i + 1][1] - y, ROAD[i + 1][0] - x) : Math.atan2(y - ROAD[i - 1][1], x - ROAD[i - 1][0]); return [x - Math.sin(a) * w, y + Math.cos(a) * w]; }); }
function northGround() {
  return once('nground', () => {
    const [c, g] = canvas(W + 400, H), r = prng(51), n = vnoise(52);
    // snow field: pale near the aurora-lit middle, blue in the near shadow
    const lg = g.createLinearGradient(0, HZ, 0, H); lg.addColorStop(0, '#9fb6d2'); lg.addColorStop(.25, '#7f98bb'); lg.addColorStop(1, '#2b3f60'); g.fillStyle = lg; g.fillRect(0, HZ, c.width, H - HZ);
    // drifts: long soft ridges with a lit top and a blue shadow
    for (let k = 0; k < 16; k++) { const y0 = HZ + 12 + Math.pow(k / 16, 1.6) * (H - HZ), amp = 4 + k * 1.6; g.beginPath(); for (let x = -20; x <= c.width + 20; x += 12) { const y = y0 + amp * Math.sin(x * (.004 + k * .0003) + k) + 6 * fbm(n, x * .01, k, 2); x < 0 ? g.moveTo(x, y) : g.lineTo(x, y); } g.lineTo(c.width + 20, y0 + 60); g.lineTo(-20, y0 + 60); g.closePath(); const dg = g.createLinearGradient(0, y0 - amp, 0, y0 + 40); dg.addColorStop(0, `rgba(225,236,250,${.18 + k * .01})`); dg.addColorStop(.3, 'rgba(120,145,185,.05)'); dg.addColorStop(1, 'rgba(30,45,75,.18)'); g.fillStyle = dg; g.fill(); }
    // the road: packed snow, two tyre ruts, banks
    const L = roadEdge(1), R = roadEdge(-1);
    g.beginPath(); L.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); for (let i = R.length - 1; i >= 0; i--) g.lineTo(R[i][0], R[i][1]); g.closePath();
    const rg = g.createLinearGradient(0, HZ, 0, H); rg.addColorStop(0, '#8ea6c4'); rg.addColorStop(1, '#55698c'); g.fillStyle = rg; g.fill();
    g.save(); g.clip(); g.strokeStyle = 'rgba(30,42,66,.35)'; g.lineCap = 'round';
    for (const off of [-.32, .32]) { g.lineWidth = 1; g.beginPath(); ROAD.forEach(([x, y], i) => { const w = mix(130, 6, clamp((1100 - y) / 494)) * off; i ? g.lineTo(x + w, y) : g.moveTo(x + w, y); }); g.lineWidth = 9; g.stroke(); g.lineWidth = 3; g.strokeStyle = 'rgba(210,225,245,.25)'; g.stroke(); g.strokeStyle = 'rgba(30,42,66,.35)'; }
    g.restore();
    for (const E of [L, R]) { g.strokeStyle = 'rgba(235,242,252,.45)'; g.lineWidth = 2; g.beginPath(); E.forEach(([x, y], i) => (i ? g.lineTo(x, y - 2) : g.moveTo(x, y - 2))); g.stroke(); }
    // snow sparkle and fine shadow stipple
    for (let i = 0; i < 2600; i++) { const x = r() * c.width, y = HZ + Math.pow(r(), .8) * (H - HZ); g.fillStyle = r() < .55 ? `rgba(240,248,255,${.12 + r() * .35})` : `rgba(20,30,55,${.08 + r() * .14})`; g.fillRect(x, y, 1.3, 1.3); }
    artHatch(g, [0, HZ + 200, c.width, H - HZ - 200], { angle: -.15, gap: 5, w: .6, col: '#16233c', a: .22, seed: 53, broken: .45 });
    stipple(c, { k: .25, g: 1, seed: 54, mid: false, boost: 1 });
    return c;
  });
}
// ---------- houses (sprites) ----------
function snowCap(g, pts, th, seed) { // a soft snow layer along a roof edge polyline
  const r = prng(seed); g.fillStyle = '#e6eef8'; g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y - th * (.7 + .3 * r())) : g.moveTo(x, y - th * .5)));
  for (let i = pts.length - 1; i >= 0; i--) g.lineTo(pts[i][0], pts[i][1] + th * .25); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(120,145,185,.6)'; g.lineWidth = 1; g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y + th * .25) : g.moveTo(x, y + th * .25))); g.stroke();
}
function warmWindow(g, x, y, w, h, a = 1, panes = 2) {
  const wg = g.createLinearGradient(x, y, x, y + h); wg.addColorStop(0, rgba('#ffd59a', a)); wg.addColorStop(1, rgba('#ff9f4a', a)); g.fillStyle = wg; g.fillRect(x, y, w, h);
  g.fillStyle = 'rgba(40,22,10,.75)'; g.fillRect(x + w / 2 - .8, y, 1.6, h); if (panes > 2) g.fillRect(x, y + h / 2 - .8, w, 1.6);
  g.strokeStyle = 'rgba(25,16,12,.9)'; g.lineWidth = 2; g.strokeRect(x, y, w, h);
}
export function cabinSprite(s = 1) {
  return once('cabin' + s, () => {
    const w = 420 * s, h = 330 * s, [c, g] = canvas(Math.ceil(w), Math.ceil(h)); g.scale(s, s);
    const gx = 40, gy = 300, cw = 300, ch = 120; // wall box
    // back roof slope shadow, wall of logs
    g.fillStyle = '#3a2618'; g.fillRect(gx, gy - ch, cw, ch);
    for (let i = 0; i < 9; i++) { const y = gy - ch + i * (ch / 9); const lg = g.createLinearGradient(0, y, 0, y + ch / 9); lg.addColorStop(0, '#6b4a30'); lg.addColorStop(.5, '#4e3420'); lg.addColorStop(1, '#2c1c12'); g.fillStyle = lg; g.fillRect(gx - 6, y + 1, cw + 12, ch / 9 - 1.5);
      for (const ex of [gx - 10, gx + cw + 4]) { g.fillStyle = '#7a5838'; g.beginPath(); g.ellipse(ex + 3, y + ch / 18, 7, ch / 18 - 1, 0, 0, TAU); g.fill(); g.strokeStyle = 'rgba(40,24,14,.8)'; g.lineWidth = .8; g.beginPath(); g.ellipse(ex + 3, y + ch / 18, 3.5, ch / 36, 0, 0, TAU); g.stroke(); } }
    artHatch(g, [gx, gy - ch, cw, ch], { angle: -.1, gap: 3, w: .5, col: '#120a06', a: .35, seed: 7, broken: .3 });
    // windows (one big warm, one small)
    warmWindow(g, gx + 46, gy - 88, 62, 50, 1, 4); warmWindow(g, gx + 200, gy - 84, 40, 40, .55, 2);
    // gable roof with overhang and a thick snow load
    const roof = [[gx - 34, gy - ch + 6], [gx + cw / 2, gy - ch - 108], [gx + cw + 34, gy - ch + 6]];
    g.fillStyle = '#20150e'; g.beginPath(); g.moveTo(roof[0][0], roof[0][1]); g.lineTo(roof[1][0], roof[1][1]); g.lineTo(roof[2][0], roof[2][1]); g.lineTo(roof[2][0], roof[2][1] + 12); g.lineTo(roof[1][0], roof[1][1] + 12); g.lineTo(roof[0][0], roof[0][1] + 12); g.closePath(); g.fill();
    g.fillStyle = '#4a3220'; g.beginPath(); g.moveTo(gx + 8, gy - ch + 2); g.lineTo(gx + cw / 2, gy - ch - 92); g.lineTo(gx + cw - 8, gy - ch + 2); g.closePath(); g.fill(); // gable
    for (let i = 0; i < 6; i++) { const y = gy - ch - 92 + i * 16; g.strokeStyle = 'rgba(30,18,10,.6)'; g.lineWidth = 1.2; const half = (y - (gy - ch - 92)) / 92 * (cw / 2 - 8); g.beginPath(); g.moveTo(gx + cw / 2 - half, y); g.lineTo(gx + cw / 2 + half, y); g.stroke(); }
    // chimney (stone)
    g.fillStyle = '#3b3a44'; g.fillRect(gx + 214, gy - ch - 96, 30, 70); g.fillStyle = '#2a2932'; g.fillRect(gx + 210, gy - ch - 102, 38, 8);
    snowCap(g, [[gx - 40, gy - ch + 8], [gx + 40, gy - ch - 40], [gx + cw / 2, gy - ch - 112], [gx + cw - 40, gy - ch - 40], [gx + cw + 40, gy - ch + 8]], 22, 9);
    snowCap(g, [[gx + 208, gy - ch - 102], [gx + 250, gy - ch - 102]], 9, 10);
    // the porch on the right: posts, a little roof, the lamp bracket
    g.fillStyle = '#2a1b11'; g.fillRect(gx + cw + 6, gy - 92, 6, 92); g.fillRect(gx + cw + 74, gy - 84, 6, 84); g.fillRect(gx + cw - 4, gy - 98, 90, 8);
    snowCap(g, [[gx + cw - 6, gy - 98], [gx + cw + 88, gy - 92]], 10, 11);
    g.fillStyle = '#1a120c'; g.fillRect(gx + cw + 4, gy - 4, 82, 6);
    // snow piled along the base, cool light on the left edge
    snowCap(g, [[gx - 30, gy + 4], [gx + 80, gy - 4], [gx + 200, gy - 2], [gx + cw + 90, gy + 4]], 14, 12);
    g.fillStyle = 'rgba(170,210,235,.25)'; g.fillRect(gx - 6, gy - ch, 3, ch);
    stipple(c, { k: .25, g: 1, seed: 13, mid: false, boost: 1 });
    return c;
  });
}
export function villaSprite(s = 1) {
  return once('villa' + s, () => {
    const w = 640 * s, h = 360 * s, [c, g] = canvas(Math.ceil(w), Math.ceil(h)); g.scale(s, s);
    const gy = 330;
    // low wing (garage) on the left, the tall main block, a glazed stair tower
    const block = (x, y, bw, bh, col) => { g.fillStyle = col; g.fillRect(x, y, bw, bh); const lg = g.createLinearGradient(x, y, x + bw, y); lg.addColorStop(0, 'rgba(160,190,225,.12)'); lg.addColorStop(1, 'rgba(0,0,10,.25)'); g.fillStyle = lg; g.fillRect(x, y, bw, bh); };
    block(30, gy - 110, 200, 110, '#2b3448'); block(210, gy - 230, 300, 230, '#323c52'); block(500, gy - 170, 110, 170, '#2a3346');
    // siding lines
    g.strokeStyle = 'rgba(10,14,24,.35)'; g.lineWidth = .8; for (let y = gy - 228; y < gy; y += 7) { g.beginPath(); g.moveTo(210, y); g.lineTo(510, y); g.stroke(); }
    // roofs: shallow gables with deep snow
    const roofTri = (x0, x1, y, rise) => { g.fillStyle = '#161b26'; g.beginPath(); g.moveTo(x0 - 16, y + 4); g.lineTo((x0 + x1) / 2, y - rise); g.lineTo(x1 + 16, y + 4); g.closePath(); g.fill(); snowCap(g, [[x0 - 20, y + 6], [(x0 + x1) / 2, y - rise - 2], [x1 + 20, y + 6]], 16, Math.round(x0)); };
    roofTri(210, 510, gy - 230, 70); roofTri(30, 230, gy - 110, 30); roofTri(500, 610, gy - 170, 30);
    // many warm windows: big glass on the main block, two lit, one dim
    for (let i = 0; i < 4; i++) warmWindow(g, 228 + i * 70, gy - 200, 50, 66, i === 1 || i === 2 ? 1 : .35, 4);
    for (let i = 0; i < 4; i++) warmWindow(g, 228 + i * 70, gy - 104, 50, 74, i === 0 || i === 3 ? .9 : .3, 4);
    g.fillStyle = 'rgba(160,180,210,.18)'; for (let i = 0; i < 3; i++) g.fillRect(48 + i * 60, gy - 80, 44, 64); // garage doors (dark panels)
    g.strokeStyle = 'rgba(10,14,24,.5)'; for (let i = 0; i < 3; i++) for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(48 + i * 60, gy - 80 + k * 16); g.lineTo(92 + i * 60, gy - 80 + k * 16); g.stroke(); }
    warmWindow(g, 520, gy - 150, 70, 120, .8, 4);
    artHatch(g, [20, gy - 300, 600, 300], { angle: -1.1, gap: 3.4, w: .6, col: '#050810', a: .3, seed: 21, broken: .35 });
    snowCap(g, [[0, gy + 6], [200, gy - 2], [420, gy], [640, gy + 6]], 14, 22);
    stipple(c, { k: .25, g: 1, seed: 23, mid: false, boost: 1 });
    return c;
  });
}
export function trailerSprite(s = 1) {
  return once('trailer' + s, () => {
    const w = 300 * s, h = 150 * s, [c, g] = canvas(Math.ceil(w), Math.ceil(h)); g.scale(s, s);
    const gy = 130, x0 = 20, x1 = 270, top = gy - 74;
    g.fillStyle = '#5b6474'; g.beginPath(); g.roundRect(x0, top, x1 - x0, 64, 10); g.fill();
    g.strokeStyle = 'rgba(20,24,34,.45)'; g.lineWidth = .8; for (let y = top + 6; y < gy - 12; y += 5) { g.beginPath(); g.moveTo(x0 + 2, y); g.lineTo(x1 - 2, y); g.stroke(); }
    g.fillStyle = 'rgba(10,12,20,.5)'; g.fillRect(x0 + 2, gy - 14, x1 - x0 - 4, 14); // skirting
    warmWindow(g, 62, top + 16, 34, 22, .9, 2); warmWindow(g, 150, top + 16, 34, 22, .18, 2); warmWindow(g, 220, top + 16, 26, 22, .25, 2);
    // a little wooden step and a propane bottle
    g.fillStyle = '#2b1e14'; g.fillRect(108, gy - 12, 26, 12); g.fillStyle = '#8c939e'; g.beginPath(); g.roundRect(254, gy - 30, 14, 30, 6); g.fill();
    const lg = g.createLinearGradient(0, top, 0, gy); lg.addColorStop(0, 'rgba(180,210,240,.15)'); lg.addColorStop(1, 'rgba(0,0,10,.35)'); g.fillStyle = lg; g.fillRect(x0, top, x1 - x0, 64);
    snowCap(g, [[x0 - 4, top + 4], [x0 + 40, top - 2], [x1 - 40, top - 2], [x1 + 4, top + 4]], 12, 31);
    snowCap(g, [[0, gy + 6], [150, gy], [300, gy + 6]], 10, 32);
    artHatch(g, [x0, top, x1 - x0, 64], { angle: -1.1, gap: 3, w: .5, col: '#050810', a: .25, seed: 33, broken: .3 });
    return c;
  });
}

// ---------- envelope + mailboxes ----------
export function envelope(ctx, x, y, s, o = {}) {
  const t = o.t ?? 0, glow = clamp(o.glow ?? 0), open = clamp(o.open ?? 0), chk = clamp(o.check ?? 0);
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.scale(s, s);
  if (glow > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gg = ctx.createRadialGradient(0, 0, 0, 0, 0, 120); gg.addColorStop(0, rgba('#ffd59a', .55 * glow)); gg.addColorStop(.3, rgba(NP.amber, .2 * glow)); gg.addColorStop(1, rgba(NP.amber, 0)); ctx.fillStyle = gg; ctx.fillRect(-120, -120, 240, 240); ctx.restore(); }
  // the check rising out of the open envelope (engraved, foil corner)
  if (chk > 0) {
    ctx.save(); ctx.translate(0, -26 * chk); ctx.fillStyle = '#efe6cf'; ctx.fillRect(-40, -22, 80, 40);
    gBorder(ctx, -40, -22, 80, 40, { band: 6, lines: 3, waves: 40, col: '#3a5a6a', w: .4, a: .8, radius: 3 });
    ctx.fillStyle = rgba('#1f2a3a', .5); ctx.fillRect(-30, -8, 34, 1.4); ctx.fillRect(-30, -2, 26, 1.4); ctx.fillRect(-30, 6, 44, 1.2);
    const fg = ctx.createLinearGradient(14, -14, 34, 6); fg.addColorStop(0, '#c87a2c'); fg.addColorStop(.5, '#ffe2a8'); fg.addColorStop(1, '#c87a2c'); ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(24, -4, 8, 0, TAU); ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = '#efe4cc'; ctx.beginPath(); ctx.rect(-46, -28, 92, 56); ctx.fill();
  ctx.strokeStyle = 'rgba(90,70,50,.6)'; ctx.lineWidth = 1.2; ctx.strokeRect(-46, -28, 92, 56);
  ctx.beginPath(); ctx.moveTo(-46, 28); ctx.lineTo(0, -2); ctx.lineTo(46, 28); ctx.stroke();
  // the flap (open = folded up)
  ctx.fillStyle = '#e6d8b8'; ctx.beginPath(); ctx.moveTo(-46, -28); ctx.lineTo(0, mix(6, -62, open)); ctx.lineTo(46, -28); ctx.closePath(); ctx.fill(); ctx.stroke();
  // a little engraved border on the front and an amber foil seal
  ctx.strokeStyle = 'rgba(58,90,106,.5)'; ctx.lineWidth = .7; ctx.strokeRect(-40, -22, 80, 44);
  if (open < .5) { const fg = ctx.createRadialGradient(-2, -2, 0, 0, 0, 9); fg.addColorStop(0, '#ffe2a8'); fg.addColorStop(1, '#b8641e'); ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(0, 2, 7.5, 0, TAU); ctx.fill(); }
  if (glow > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const ph = ((t * .35) % 1.4) - .2, gx = mix(-70, 70, ph); const gg = ctx.createLinearGradient(gx - 20, -30, gx + 20, 30); gg.addColorStop(0, 'rgba(255,240,210,0)'); gg.addColorStop(.5, rgba('#fff4dc', .5 * glow)); gg.addColorStop(1, 'rgba(255,240,210,0)'); ctx.fillStyle = gg; ctx.fillRect(-46, -28, 92, 56); ctx.restore(); }
  ctx.restore();
}
// mailbox: x,y = foot of the post on the ground, s = scale (1 → box ~70 px long)
export function mailbox(ctx, x, y, s, kind = 'cabin', o = {}) {
  const t = o.t ?? 0, env = clamp(o.env ?? 1), glow = clamp(o.glow ?? 0), snow = clamp(o.snow ?? 1), lid = clamp(o.lid ?? .35), pull = clamp(o.pull ?? 0), lean = kind === 'trailer' ? .07 : 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(lean);
  // post
  if (kind === 'villa') { // a stone pillar with a cap
    ctx.fillStyle = '#3e4250'; ctx.fillRect(-16, -78, 32, 78); ctx.strokeStyle = 'rgba(10,12,20,.45)'; ctx.lineWidth = 1; for (let yy = -70; yy < 0; yy += 10) { ctx.beginPath(); ctx.moveTo(-16, yy); ctx.lineTo(16, yy); ctx.stroke(); }
    ctx.fillStyle = '#4b505e'; ctx.fillRect(-20, -84, 40, 8);
  } else { ctx.fillStyle = kind === 'trailer' ? '#5a4a3a' : '#4a3424'; ctx.fillRect(-4.5, -66, 9, 66); ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(1.5, -66, 3, 66); }
  const by = kind === 'villa' ? -84 : -66;
  // box: side view, rounded top, the door at the front (right)
  const bw = 66, bh = 30, col = kind === 'villa' ? '#7a5a2a' : kind === 'trailer' ? '#6c7380' : '#26303f';
  ctx.save(); ctx.translate(-bw / 2 + 4, by - bh);
  const body = new Path2D(); body.moveTo(0, bh); body.lineTo(0, bh * .45); body.quadraticCurveTo(0, 0, bh * .45, 0); body.lineTo(bw - bh * .45, 0); body.quadraticCurveTo(bw, 0, bw, bh * .45); body.lineTo(bw, bh); body.closePath();
  ctx.fillStyle = col; ctx.fill(body);
  const lg = ctx.createLinearGradient(0, 0, 0, bh); lg.addColorStop(0, 'rgba(255,255,255,.22)'); lg.addColorStop(.4, 'rgba(255,255,255,0)'); lg.addColorStop(1, 'rgba(0,0,10,.35)'); ctx.fillStyle = lg; ctx.fill(body);
  if (kind === 'trailer') { ctx.strokeStyle = 'rgba(20,20,30,.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(20, 4); ctx.quadraticCurveTo(26, 12, 22, 20); ctx.stroke(); }
  if (kind === 'villa') { ctx.strokeStyle = 'rgba(255,220,150,.5)'; ctx.lineWidth = 1; ctx.stroke(body); }
  // flag (red, folded down)
  ctx.fillStyle = '#9a2f26'; ctx.fillRect(14, 4, 3, 18); ctx.fillRect(14, 4, 12, 7);
  // the door: hinged at the bottom, open by `lid`
  ctx.save(); ctx.translate(bw, bh); ctx.rotate(lid * 1.2); ctx.fillStyle = shade(col, .08); ctx.beginPath(); ctx.roundRect(-2, -bh, 5, bh, 2); ctx.fill(); ctx.restore();
  // the envelope sticking out of the door
  if (env > 0) { const ex = bw - 8 + 30 * pull + 6 * (1 - env), ey = bh * .55 - 30 * pull; ctx.save(); ctx.globalAlpha = env; envelope(ctx, ex, ey, .42, { t, glow, rot: -.08 - .4 * pull }); ctx.restore(); }
  // snow cap
  if (snow > 0) { ctx.fillStyle = rgba('#e6eef8', snow); ctx.beginPath(); ctx.moveTo(-3, bh * .3); ctx.quadraticCurveTo(0, -9 * snow, bh * .45, -8 * snow); ctx.lineTo(bw - bh * .4, -9 * snow); ctx.quadraticCurveTo(bw + 4, -6 * snow, bw + 3, bh * .35); ctx.quadraticCurveTo(bw - 6, 2, bw / 2, 1); ctx.quadraticCurveTo(6, 2, -3, bh * .3); ctx.fill(); }
  ctx.restore();
  ctx.restore();
  return { env: [x + (bw - 8 + 30 * pull - bw / 2 + 4) * s, y + (by - bh + bh * .55 - 30 * pull) * s] };
}

// the whole wide view (3.06): cam = { x, y } px offset of the camera (parallax per layer), z zoom about the screen centre
export function northWide(ctx, t, o = {}) {
  const cam = o.cam || { x: 0, y: 0, z: 1 }, z = cam.z ?? 1, tilt = clamp(o.tilt ?? 1), same = clamp(o.same ?? 0), a = o.a ?? 1;
  const drop = (p) => -(1 - tilt) * 980 * p;   // before the tilt the landscape hangs above the frame
  const L = (p) => [-200 + cam.x * p, cam.y * p];
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
  { const [dx, dy] = L(.1); ctx.drawImage(northSky(), dx, dy - 100 + drop(.55)); }
  aurora(ctx, t, { dx: cam.x, dy: cam.y + drop(.6), a: (o.auroraA ?? 1), fan: o.fan ?? 1 });
  { const [dx, dy] = L(.25); ctx.drawImage(northMountains(), dx, dy + drop(.8)); }
  // a faint green wash of the aurora on the snow and mountains (breathing with the curtains)
  { const [dx, dy] = L(.35); ctx.drawImage(northTrees(), dx, dy + drop(.9)); }
  const gd = drop(1);
  { const [dx, dy] = L(.6); ctx.drawImage(northGround(), dx, dy + gd); }
  { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const br = .5 + .5 * Math.sin(t * .4); const cyG = cam.y * .6, gg = ctx.createLinearGradient(0, HZ + gd + cyG - 40, 0, H + gd + cyG); gg.addColorStop(0, 'rgba(95,224,168,0)'); gg.addColorStop(.06, `rgba(95,224,168,${.12 + .05 * br})`); gg.addColorStop(1, 'rgba(95,224,168,0)'); ctx.fillStyle = gg; ctx.fillRect(0, HZ + gd + cyG - 40, W, H + 40); ctx.restore(); }
  // houses in depth: trailer (far right), villa (middle), cabin (near left) and their mailboxes at the road
  const P = (p, x, y) => [x + cam.x * p, y + cam.y * p + gd];
  const boxes = [];
  { const [x, y] = P(.62, 1540, 640); const S = trailerSprite(1); ctx.drawImage(S, x - 150, y - 130 * 1 + 4); }
  { const [x, y] = P(.66, 1150, 688); const S = villaSprite(1); ctx.drawImage(S, x - 320, y - 330); }
  { const [x, y] = P(.64, 1752, 672); boxes.push(mailbox(ctx, x, y, .54, 'trailer', { t, glow: same, env: 1 }).env); }
  { const [x, y] = P(.68, 960, 714); boxes.push(mailbox(ctx, x, y, .62, 'villa', { t, glow: same, env: 1 }).env); }
  // chimney smoke from the cabin (drawn before the cabin sprite)
  { const [x, y] = P(.8, 420, 812); smoke(ctx, t, x + 2, y - 318 + 26); const S = cabinSprite(1); ctx.drawImage(S, x - 210, y - 300); }
  { const [x, y] = P(.86, 700, 868); boxes.push(mailbox(ctx, x, y, 1.05, 'cabin', { t, glow: same, env: 1 }).env); }
  // porch lamp of the cabin (small warm cone)
  { const [x, y] = P(.8, 420, 812); lampGlow(ctx, x + 200, y - 210, .9, t); }
  // near foreground: two big spruces at the edges, out of focus
  { const [dx, dy] = L(1.25); ctx.drawImage(nearSpruces(), dx, dy + drop(1.2)); }
  snowfall(ctx, t, { a: .8, dy: drop(1) });
  ctx.restore();
  return { boxes };
}
function lampGlow(ctx, x, y, a, t) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const f = .92 + .08 * Math.sin(t * 7.3) * Math.sin(t * 3.1);
  const g = ctx.createRadialGradient(x, y, 0, x, y, 90); g.addColorStop(0, rgba('#fff1d6', .9 * a * f)); g.addColorStop(.12, rgba('#ffb35c', .45 * a * f)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(x - 90, y - 90, 180, 180); ctx.restore();
}
function smoke(ctx, t, x, y) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 14; i++) { const life = ((t * .22 + i / 14) % 1), px = x + life * 70 + Math.sin(life * 5 + i) * 10, py = y - life * 150, r = 8 + life * 34; const g = ctx.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, `rgba(160,190,220,${.1 * (1 - life)})`); g.addColorStop(1, 'rgba(160,190,220,0)'); ctx.fillStyle = g; ctx.fillRect(px - r, py - r, r * 2, r * 2); }
  ctx.restore();
}
function nearSpruces() {
  return once('nnear', () => {
    const [c, g] = canvas(W + 400, H + 200); g.filter = 'blur(5px)';
    spruce(g, 150, H + 160, 980, '#050a14', '#6f86a6', 7, .4); spruce(g, W + 330, H + 140, 900, '#050a14', '#6f86a6', 8, .4);
    g.filter = 'none'; return c;
  });
}
export function snowfall(ctx, t, o = {}) {
  const r = prng(o.seed ?? 77), n = o.n ?? 160, a = o.a ?? 1, wind = o.wind ?? 18, dy = o.dy ?? 0;
  ctx.save(); ctx.fillStyle = '#eef4ff';
  for (let i = 0; i < n; i++) {
    const depth = r(), sp = 30 + depth * 90, x0 = r() * (W + 200), y0 = r() * H, sz = .8 + depth * 2.6;
    const y = ((y0 + t * sp) % (H + 40)) - 20 + dy, x = ((x0 + t * wind * (.5 + depth) + Math.sin(t * .9 + i) * 14) % (W + 200)) - 100;
    ctx.globalAlpha = a * (.25 + .55 * depth); ctx.beginPath(); ctx.arc(x, y, sz, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- 3.07a · the seasons at the cabin's mailbox
// u: 0..1 over the shot; years = how many full cycles; the envelope is back each "year"
const SEASON = [ // sky, ground, foliage, snow
  { sky: ['#0b1a33', '#29466c'], ground: '#cfdcec', leaf: null, snow: 1 },
  { sky: ['#2a5a7a', '#9cc4d8'], ground: '#6b7a4a', leaf: '#9cc96b', snow: 0 },
  { sky: ['#3a78a8', '#cfe6f0'], ground: '#4f7a3a', leaf: '#4f9a4a', snow: 0 },
  { sky: ['#3a4a6a', '#e0b080'], ground: '#7a6a3a', leaf: '#e08a3a', snow: 0 },
];
function seasonAt(f) { const k = Math.floor(f) % 4, q = sm(f - Math.floor(f)), A = SEASON[k], B = SEASON[(k + 1) % 4];
  return { sky0: mixHex(A.sky[0], B.sky[0], q), sky1: mixHex(A.sky[1], B.sky[1], q), ground: mixHex(A.ground, B.ground, q), leafA: A.leaf, leafB: B.leaf, q, snow: mix(A.snow, B.snow, q), k }; }
export function seasonsMailbox(ctx, t, o = {}) {
  const u = clamp(o.u ?? 0), years = o.years ?? 2, f = u * years * 4, S = seasonAt(f), cx = o.x ?? 1020, cy = o.y ?? 760, sc = o.s ?? 3.6;
  // sky and a far treeline, day and night flickering past
  const day = .5 + .5 * Math.sin(u * years * 4 * TAU * 2.5);
  const lg = ctx.createLinearGradient(0, 0, 0, H * .7); lg.addColorStop(0, mixHex(S.sky0, '#050a18', .5 * (1 - day))); lg.addColorStop(1, mixHex(S.sky1, '#0c1b33', .45 * (1 - day))); ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = mixHex('#14243a', S.ground, .25); ctx.beginPath(); ctx.moveTo(0, 600); for (let x = 0; x <= W; x += 40) ctx.lineTo(x, 560 - 40 * Math.abs(Math.sin(x * .013)) - 20 * Math.sin(x * .05)); ctx.lineTo(W, 640); ctx.lineTo(0, 640); ctx.fill();
  // the cabin wall behind, out of focus
  ctx.drawImage(once('cabinblur', () => { const S = cabinSprite(1.6), [c, g] = canvas(S.width + 40, S.height + 40); g.filter = 'blur(4px)'; g.drawImage(S, 20, 20); g.filter = 'none'; g.globalCompositeOperation = 'destination-out'; const fg = g.createLinearGradient(c.width - 220, 0, c.width - 30, 0); fg.addColorStop(0, 'rgba(0,0,0,0)'); fg.addColorStop(1, 'rgba(0,0,0,1)'); g.fillStyle = fg; g.fillRect(c.width - 220, 0, 220, c.height); return c; }), 40, 100);
  // ground: snow ↔ grass
  const gg = ctx.createLinearGradient(0, 620, 0, H); gg.addColorStop(0, S.ground); gg.addColorStop(1, mixHex(S.ground, '#101824', .55)); ctx.fillStyle = gg; ctx.fillRect(0, 620, W, H - 620 + 200);
  const r = prng(5); for (let i = 0; i < 260; i++) { const x = r() * W, y = 640 + r() * 440, l = 6 + r() * 16; ctx.strokeStyle = S.snow > .5 ? 'rgba(150,170,200,.35)' : rgba(mixHex('#2a4a20', S.ground, .3), .6); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 2, y - l * (1 - S.snow)); ctx.stroke(); }
  // a birch branch in the foreground with leaves that come and go
  ctx.save(); ctx.strokeStyle = '#d8d2c6'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(W + 20, 120); ctx.quadraticCurveTo(1500, 160, 1300, 90); ctx.stroke(); ctx.strokeStyle = '#2a2420'; ctx.lineWidth = 2; for (let i = 0; i < 9; i++) { const x = 1340 + i * 64; ctx.beginPath(); ctx.moveTo(x, 118 + i * 3); ctx.lineTo(x + 8, 120 + i * 3); ctx.stroke(); }
  const leafCol = S.leafA && S.leafB ? mixHex(S.leafA, S.leafB, S.q) : (S.leafA || S.leafB), leafA = S.leafA && S.leafB ? 1 : S.leafA ? 1 - S.q : S.q;
  if (leafCol) { const rr = prng(9); for (let i = 0; i < 70; i++) { const q = rr(), x = mix(1320, W + 10, q) + (rr() - .5) * 60, y = 110 + 40 * Math.sin(q * 3) + (rr() - .5) * 70; ctx.globalAlpha = leafA * (.7 + .3 * rr()); ctx.fillStyle = shade(leafCol, (rr() - .5) * .3); ctx.beginPath(); ctx.ellipse(x, y, 10, 5, rr() * 3, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1; }
  // autumn: a few leaves falling
  if (S.k === 3 || (S.k === 2 && S.q > .5)) { const rr = prng(11); for (let i = 0; i < 18; i++) { const ph = (u * 9 + rr()) % 1, x = 1300 + rr() * 600 - ph * 300, y = 120 + ph * 900; ctx.fillStyle = rgba('#e08a3a', .8 * (1 - ph)); ctx.beginPath(); ctx.ellipse(x, y, 8, 4, ph * 9 + i, 0, TAU); ctx.fill(); } }
  ctx.restore();
  // the mailbox, big; the envelope pops back in each "year" (at each winter)
  const yr = f / 4, ph = yr - Math.floor(yr), env = ph < .08 ? eout(ph / .08) : ph > .9 ? 1 - sm((ph - .9) / .1) : 1, glow = Math.exp(-Math.pow((ph - .06) / .05, 2));
  mailbox(ctx, cx, cy + 300, sc, 'cabin', { t, env, glow: .3 + .7 * glow, snow: S.snow, lid: .4 });
  // snow drifting down in winter, a sparkle in summer
  if (S.snow > .1) snowfall(ctx, t, { a: S.snow, n: 120, wind: 60, seed: 3 });
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const sg = ctx.createRadialGradient(1700, 80, 0, 1700, 80, 900); sg.addColorStop(0, `rgba(255,236,190,${.25 * day * (1 - S.snow)})`); sg.addColorStop(1, 'rgba(255,236,190,0)'); ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H); ctx.restore();
}

// ---------------------------------------------------------------- 3.07b · rich or poor
export function twoBoxes(ctx, t, o = {}) {
  const pull = clamp(o.pull ?? 0), cam = o.cam || { x: 0, y: 0 }, drop = clamp(o.drop ?? 0);
  // night snow, the aurora above (far), two boxes, a spruce trunk between them in the foreground
  ctx.drawImage(northSky(), -200 + cam.x * .1, -60);
  aurora(ctx, t, { dx: cam.x - 300, dy: -60, a: .7 });
  const lg = ctx.createLinearGradient(0, 640, 0, H); lg.addColorStop(0, '#8ea6c4'); lg.addColorStop(1, '#2b3f60'); ctx.fillStyle = lg; ctx.fillRect(0, 640, W, H);
  ctx.drawImage(once('vtblur', () => { const [c, g] = canvas(W + 400, H); g.filter = 'blur(3px)'; g.drawImage(villaSprite(1.2), 80, 160); g.drawImage(trailerSprite(1.6), 1500, 400); g.filter = 'none'; return c; }), -200 + cam.x * .4, 0);
  const v = mailbox(ctx, 520 + cam.x * .8, 1010, 4.2, 'villa', { t, env: drop > 0 ? 0 : 1, glow: .5 + .5 * pull, pull, lid: .9 });
  const tr = mailbox(ctx, 1420 + cam.x * .8, 1000, 4.2, 'trailer', { t, env: drop > 0 ? 0 : 1, glow: .5 + .5 * pull, pull, lid: .9 });
  const dy = drop * 1000, vE = [v.env[0], v.env[1] + dy], tE = [tr.env[0], tr.env[1] + dy];
  if (drop > 0) { envelope(ctx, vE[0], vE[1], .42 * 4.2, { t, glow: 1, rot: -.48 }); envelope(ctx, tE[0], tE[1], .42 * 4.2, { t, glow: 1, rot: -.48 }); }
  // the hands: a cuffed hand with a signet ring (villa), a worn sleeve (trailer); they grip the envelopes and pull at once
  // both reach in the same way from the right; the villa owner's arm comes from behind the trunk (its sleeve ends there)
  const tx = 960 + cam.x * 1.4;
  const hp = (e, sleeve, skin, ringOn, seed, sleeveLen) => { hand(ctx, e[0] + 70 * (1 - pull * .2), e[1] + 40, 1.25, { pose: 'grip', ang: Math.PI + .5, flip: true, sleeve, sleeveLen, skin, rim: '#bfe8d8', t, seed, ring: ringOn, light: [0, -1] }); };
  hp(vE, '#1d2433', '#e9c2a0', true, 1, Math.max(60, (tx - (vE[0] + 70 * (1 - pull * .2))) / (Math.cos(.5) * 1.25))); hp(tE, '#6a5236', '#8d5f40', false, 2);
  // the trunk between them, sharp in the foreground
  ctx.save(); const bg = ctx.createLinearGradient(tx - 70, 0, tx + 70, 0); bg.addColorStop(0, '#0a0f18'); bg.addColorStop(.35, '#1a2230'); bg.addColorStop(1, '#05080e'); ctx.fillStyle = bg; ctx.fillRect(tx - 64, -10, 128, H + 20);
  artHatch(ctx, [tx - 64, 0, 128, H], { angle: 1.45, gap: 4, w: .8, col: '#000000', a: .45, seed: 3, broken: .3 }); ctx.fillStyle = 'rgba(190,232,216,.35)'; ctx.fillRect(tx - 64, 0, 3, H); ctx.restore();
  snowfall(ctx, t, { a: .7, n: 110, wind: 30, seed: 8 });
}

// ---------------------------------------------------------------- 3.07c · child or adult on the porch
export function porch(ctx, t, o = {}) {
  const open = clamp(o.open ?? 0), cam = o.cam || { x: 0, y: 0, z: 1 }, z = cam.z ?? 1;
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 + cam.x, -H / 2 + cam.y);
  // the log wall behind
  ctx.fillStyle = '#2a1a10'; ctx.fillRect(-200, -200, W + 400, H + 400);
  for (let i = 0; i < 14; i++) { const y = -60 + i * 72, lg = ctx.createLinearGradient(0, y, 0, y + 72); lg.addColorStop(0, '#6b4a30'); lg.addColorStop(.5, '#4a3020'); lg.addColorStop(1, '#22150c'); ctx.fillStyle = lg; ctx.fillRect(-200, y + 2, W + 400, 68); }
  // the window with warm light on the right
  ctx.save(); ctx.translate(1400, 210); ctx.fillStyle = '#1a0f08'; ctx.fillRect(-14, -14, 368, 288); const wg = ctx.createLinearGradient(0, 0, 0, 260); wg.addColorStop(0, '#ffd59a'); wg.addColorStop(1, '#ff9f4a'); ctx.fillStyle = wg; ctx.fillRect(0, 0, 340, 260); ctx.fillStyle = '#2a170c'; ctx.fillRect(166, 0, 8, 260); ctx.fillRect(0, 126, 340, 8); ctx.restore();
  artHatch(ctx, [-200, -60, W + 400, 1000], { angle: -.08, gap: 4, w: .6, col: '#0c0604', a: .25, seed: 5, broken: .35 });
  // porch floor boards and the snow beyond the rail
  ctx.fillStyle = '#3a2618'; ctx.fillRect(-200, 860, W + 400, 400); ctx.strokeStyle = 'rgba(10,6,4,.6)'; ctx.lineWidth = 2; for (let x = -200; x < W + 200; x += 70) { ctx.beginPath(); ctx.moveTo(x, 860); ctx.lineTo(x - 120, H + 200); ctx.stroke(); }
  // the lamp: warm cone from the top left, the hero light
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lx = 760, ly = 30; const cg = ctx.createRadialGradient(lx, ly, 0, lx, ly + 300, 900); cg.addColorStop(0, 'rgba(255,214,150,.55)'); cg.addColorStop(.35, 'rgba(255,170,90,.18)'); cg.addColorStop(1, 'rgba(255,170,90,0)'); ctx.fillStyle = cg; ctx.fillRect(-200, -200, W + 400, H + 400); ctx.restore();
  ctx.fillStyle = '#1a120c'; ctx.fillRect(lx - 4, -200, 8, 210); ctx.fillStyle = '#ffe2b0'; ctx.beginPath(); ctx.arc(lx, ly + 16, 16, 0, TAU); ctx.fill(); lampGlow(ctx, lx, ly + 16, 1.2, t);
  // the bench, the grandmother (seated, left) and the child (standing, right) each with the same envelope
  ctx.fillStyle = '#2b1b10'; ctx.fillRect(420, 720, 620, 26); ctx.fillRect(440, 746, 18, 120); ctx.fillRect(1000, 746, 18, 120);
  const gs = 3.1, light = { x: lx, y: ly + 40, col: '#ffd59a', a: .6 };
  const gp = { ...{ hip: [1.42, 1.5], kn: [1.42, 1.5], sh: [0.62, 0.55], el: [1.25, 1.35], lean: .08, head: .3 }, hair: 'grey' };
  const G = figure(ctx, 640, 706, gs, gp, { t, seed: 4, dress: { coat: '#5a6b7a', pants: '#2a2f3a', skin: '#e9c3a0', hair: '#c9c4c0' }, accent: '#8a3a2a', accentPart: 'scarf', light, rim: '#ffd9a0', rimSide: 1 });
  const K = figureKid(ctx, 1170, 690, gs, KIDPOSES.hold, { age: 'child', t, seed: 2, accent: '#d9824a', hair: 'beanie', light, rim: '#ffd9a0', rimSide: -1, flip: true });
  // envelopes in their hands; on "adult" both lift the check out at the same moment
  const eG = G.hand(0), eK = K.hand(0);
  envelope(ctx, eG[0] + 16, eG[1] - 30, 1.15, { t, glow: .4 + .6 * open, open: clamp(open * 2), check: clamp(open * 1.6 - .4), rot: -.12 });
  envelope(ctx, eK[0] - 10, eK[1] - 26, 1.15, { t, glow: .4 + .6 * open, open: clamp(open * 2), check: clamp(open * 1.6 - .4), rot: .1 });
  // breath vapour in the cold
  for (const [hx, hy, ph] of [[G.hand ? 640 + 70 : 0, 706 - 3.1 * 70, 0], [1170 - 30, 690 - 3.1 * 52, 1.7]]) breathVapour(ctx, t, hx, hy, ph);
  ctx.restore();
  snowfall(ctx, t, { a: .55, n: 90, wind: 20, seed: 12 });
  return { check: [] };
}
function breathVapour(ctx, t, x, y, ph) {
  const cyc = ((t + ph) % 3.2) / 3.2; if (cyc > .5) return; const q = cyc / .5;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 5; i++) { const px = x + q * 90 + i * 8, py = y - q * 20 - i * 3, r = 10 + q * 40 + i * 4; const g = ctx.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, `rgba(220,230,245,${.12 * (1 - q)})`); g.addColorStop(1, 'rgba(220,230,245,0)'); ctx.fillStyle = g; ctx.fillRect(px - r, py - r, 2 * r, 2 * r); }
  ctx.restore();
}
