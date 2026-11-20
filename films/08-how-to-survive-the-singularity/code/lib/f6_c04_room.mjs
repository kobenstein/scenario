// Film 6 · c04 · the morning room: a dim hall at first light, a stone platform on still dark water, a long bench with the sitter and the
// candle on it, a tall dark window at the right (the pane the teachers appear in), dust motes, and the lotus on the water (4.10).
// World coordinates (1920×1080 at camera z 1, the hall extends beyond). Pure functions of t. Owned by c04.
import { W, H, rgba, clamp, lin, mix, sm, eout, prng, drift } from '../engine.mjs';
import { stipple, vnoise } from './art.mjs';
import { fibreFill } from './print.mjs';
import { figure, POSES } from './figure.mjs';
import { layer, once, F6, ember, breathe, clipPane, reveal } from './f6_kit.mjs';
import { clipFrame } from './kit.mjs';
import { text } from '../engine.mjs';
import { EXPO_OUT, QUART } from './f6_c04_mind.mjs';

const TAU = Math.PI * 2;
export const FLOOR_Y = 990;                                   // the platform's top; the water lies beyond its front edge
export const SLAB = { x0: 120, x1: 880, edge: 26 };
export const FIG = { x: 330, y: 803, s: 2.0, seed: 4 };
export const BENCH = { x0: 220, x1: 640, y: 803 };
export const CANDLE = { x: 575, y: 803, s: .75 };
export const FLAME = [CANDLE.x, CANDLE.y - 118 * CANDLE.s];   // the kit's candle flame sits 118·s above the base
export const WIN = { x: 1540, y: 470, w: 700, h: 394 };        // the window pane (clip panes ≥ 1100 px on screen: the camera pushes in)
export const LOTUS = { x: 1250, y: 1130, L: 60 };

// ---------------------------------------------------------------- the wall (cached: base + a separate morning wash that brightens)
const WX = -300, WY = -200, WW = 2600, WH = 1300;
function wallBase() {
  return layer('c04wall', WW, WH, (g, c) => {
    const bg = g.createLinearGradient(0, 0, 0, WH); bg.addColorStop(0, '#201d26'); bg.addColorStop(.55, '#1b1a22'); bg.addColorStop(1, '#121018'); g.fillStyle = bg; g.fillRect(0, 0, WW, WH);
    // plaster: a faint fine grain of lighter flecks (no large patches)
    const r = prng(21); g.fillStyle = 'rgba(255,240,220,.05)'; for (let i = 0; i < 9000; i++) { g.fillRect(r() * WW, r() * WH, 1.5, 1.5); }
    g.beginPath(); g.rect(0, 0, WW, WH); fibreFill(g, .07);
    stipple(c, { k: .22, g: 1, seed: 6, mid: false, boost: 1 });
  });
}
function wallWash() {
  return layer('c04wash', WW, WH, (g, c) => {
    // the first light of morning: grey-gold from the high left (a window out of frame) and a faint halo round the dark window
    const a = g.createRadialGradient(80 - WX, 120 - WY, 0, 80 - WX, 120 - WY, 1500); a.addColorStop(0, 'rgba(241,217,168,.30)'); a.addColorStop(.45, 'rgba(241,217,168,.10)'); a.addColorStop(1, 'rgba(241,217,168,0)'); g.fillStyle = a; g.fillRect(0, 0, WW, WH);
    const b = g.createRadialGradient(WIN.x - WX, WIN.y - WY, 200, WIN.x - WX, WIN.y - WY, 900); b.addColorStop(0, 'rgba(200,205,225,.10)'); b.addColorStop(1, 'rgba(200,205,225,0)'); g.fillStyle = b; g.fillRect(0, 0, WW, WH);
    // a shaft of the first light from a high window out of frame, falling across the wall behind the sitter
    g.save(); g.translate(-WX, -WY); g.beginPath(); g.moveTo(-320, -220); g.lineTo(520, -220); g.lineTo(1500, FLOOR_Y); g.lineTo(420, FLOOR_Y); g.closePath();
    const sh = g.createLinearGradient(100, -200, 1100, FLOOR_Y); sh.addColorStop(0, 'rgba(241,217,168,.16)'); sh.addColorStop(.6, 'rgba(241,217,168,.06)'); sh.addColorStop(1, 'rgba(241,217,168,0)'); g.fillStyle = sh; g.fill();
    const sx = g.createLinearGradient(-320, 0, 520, 0); sx.addColorStop(0, 'rgba(27,26,34,.9)'); sx.addColorStop(.3, 'rgba(27,26,34,0)'); sx.addColorStop(.7, 'rgba(27,26,34,0)'); sx.addColorStop(1, 'rgba(27,26,34,.9)');
    g.globalCompositeOperation = 'destination-out'; g.fillStyle = sx; g.beginPath(); g.moveTo(-320, -220); g.lineTo(520, -220); g.lineTo(1500, FLOOR_Y); g.lineTo(420, FLOOR_Y); g.closePath(); g.restore();
    stipple(c, { k: .35, g: 1.1, seed: 8, mid: false, boost: 1.2 });
  });
}
// morning 0..1: how far the first light has come (continuous colour, never a strobe)
export function wall(ctx, t, morning = 0) {
  ctx.drawImage(wallBase(), WX, WY);
  ctx.save(); ctx.globalAlpha = mix(.55, 1, clamp(morning)); ctx.drawImage(wallWash(), WX, WY); ctx.restore();
  // the wall meets the water: a thin lit edge
  ctx.fillStyle = 'rgba(241,217,168,.10)'; ctx.fillRect(WX, FLOOR_Y - 2, WW, 2);
}

// ---------------------------------------------------------------- the water: the dark glass plate itself, clipped to the region beyond the floor line
// plate(ctx, t) is the c04>c05 glass plate; it resets the transform inside, so the clip (set in world space) is what shapes it.
export function water(ctx, t, plate) {
  ctx.save(); ctx.beginPath(); ctx.rect(-8000, FLOOR_Y, 20000, 8000); ctx.clip(); plate(ctx, t); ctx.restore();
}
// a light's reflection on the still water: a soft vertical smear under (x, FLOOR_Y)
export function waterGlow(ctx, x, w, len, col, a) {
  if (a <= .002) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, FLOOR_Y); ctx.scale(w / 100, len / 100);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 100); g.addColorStop(0, rgba(col, a)); g.addColorStop(.5, rgba(col, a * .35)); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 100, 0, TAU); ctx.fill(); ctx.restore();
}
// the stone platform: its top strip and front face
export function slab(ctx) {
  const { x0, x1, edge } = SLAB;
  ctx.fillStyle = '#2b2730'; ctx.fillRect(x0, FLOOR_Y - 14, x1 - x0, 14);
  ctx.fillStyle = 'rgba(241,217,168,.14)'; ctx.fillRect(x0, FLOOR_Y - 14, x1 - x0, 1.5);
  const f = ctx.createLinearGradient(0, FLOOR_Y, 0, FLOOR_Y + edge); f.addColorStop(0, '#1d1a22'); f.addColorStop(1, '#0f0d14'); ctx.fillStyle = f; ctx.fillRect(x0, FLOOR_Y, x1 - x0, edge);
  ctx.fillStyle = 'rgba(241,217,168,.08)'; ctx.fillRect(x0, FLOOR_Y, x1 - x0, 1);
  // the platform's reflection edge in the water
  ctx.fillStyle = 'rgba(30,28,40,.5)'; ctx.fillRect(x0, FLOOR_Y + edge, x1 - x0, 8);
}
// the long wooden bench (the sitter at its left end, the candle at its right end)
export function bench(ctx) {
  const { x0, x1, y } = BENCH, legY = FLOOR_Y - 10;
  ctx.fillStyle = 'rgba(4,4,10,.45)'; ctx.beginPath(); ctx.ellipse((x0 + x1) / 2, FLOOR_Y - 6, (x1 - x0) * .55, 10, 0, 0, TAU); ctx.fill();
  const wg = ctx.createLinearGradient(0, y, 0, y + 16); wg.addColorStop(0, '#4a3828'); wg.addColorStop(1, '#2a1f16'); ctx.fillStyle = wg; ctx.fillRect(x0, y, x1 - x0, 16);
  ctx.fillStyle = 'rgba(241,217,168,.35)'; ctx.fillRect(x0, y, x1 - x0, 2);
  ctx.fillStyle = '#241a14'; for (const lx of [x0 + 26, x1 - 40]) { ctx.fillRect(lx, y + 16, 14, legY - y - 16); ctx.fillStyle = '#2e2419'; ctx.fillRect(lx + 2, y + 16, 3, legY - y - 16); ctx.fillStyle = '#241a14'; }
  ctx.fillStyle = '#1c1410'; ctx.fillRect(x0 + 26, y + 60, x1 - x0 - 52, 6);   // the stretcher
}
// the sitter (POSES.sit like K0's mirror still), lit by the candle on his right; breathing, blinking, shifting on his own rhythm
export function sitter(ctx, t, flame) {
  figure(ctx, FIG.x, FIG.y, FIG.s, { ...POSES.sit, head: .08, sh: [.5, .42], el: [.95, 1] },
    { t, seed: FIG.seed, accent: '#8a5a3a', dress: { pants: '#2a2128' }, light: { x: flame[0], y: flame[1], col: F6.amberCore, a: .6 }, rim: rgba(F6.amber, .8), rimSide: 1, shadow: false });
}
export function candle(ctx, t) { return ember(ctx, t, { x: CANDLE.x, y: CANDLE.y, kind: 'candle', s: CANDLE.s, r: 190 }); }

// ---------------------------------------------------------------- the window: the dark pane the clips play on (clipPane draws the pane itself)
// before and after a clip the glass holds a faint pre-dawn grey-gold at its foot (a light that goes out when the screen turns on)
// Kit workaround: during the switch-off ramp clipPane asks clipFrame() for a frame past the clip's last one (frames = dur·30, the ramp
// runs to end + .5 s) and gets the placeholder silhouette; so while the screen is closing we hand it a time clamped to the last frame
// and pass the real on/off value ourselves.
// `last` = { C2: Image, C3: Image } (the clips' last frames, preloaded by the scene): drawn into the closing screen when the kit's
// frame cache has nothing for that moment (isolated snapshots / a render that starts inside the ramp).
export function windowPane(ctx, t, T, id, morning, last = {}) {
  const x = WIN.x - WIN.w / 2, y = WIN.y - WIN.h / 2, c = T.clip(id), ramp = .5;
  const onReal = c ? sm(lin(c.start - ramp, c.start, t)) * (1 - sm(lin(c.end, c.end + ramp, t))) : 1;
  const closing = c && t > c.end - 1 / 30 && onReal > 0, tf = closing ? c.end - 1 / 30 : t;
  const r = clipPane(ctx, tf, T, id, x, y, WIN.w, WIN.h, { frame: 'window', edge: .8, spill: true, on: onReal });
  if (closing && last[id] && !clipFrame(id, Math.floor((c.end - c.start - 1 / 30) * 30) + 1)) {
    const fr = last[id], sc = Math.max(WIN.w / fr.width, WIN.h / fr.height), dw = fr.width * sc, dh = fr.height * sc;
    ctx.save(); ctx.beginPath(); ctx.rect(x + 2, r.line[0], WIN.w - 4, r.line[1] - r.line[0]); ctx.clip(); ctx.drawImage(fr, x + (WIN.w - dw) / 2, y + (WIN.h - dh) / 2, dw, dh);
    ctx.globalAlpha = .05; ctx.fillStyle = '#000'; for (let yy = y; yy < y + WIN.h; yy += 4) ctx.fillRect(x, yy, WIN.w, 1.5); ctx.restore();
  }
  const a = (1 - r.on) * (.16 + .14 * clamp(morning)); if (a > .003) {
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, WIN.w, WIN.h); ctx.clip(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(0, y + WIN.h * .35, 0, y + WIN.h); g.addColorStop(0, 'rgba(120,130,160,0)'); g.addColorStop(.6, `rgba(170,165,160,${a * .5})`); g.addColorStop(1, `rgba(241,217,168,${a})`); ctx.fillStyle = g; ctx.fillRect(x, y, WIN.w, WIN.h);
    ctx.restore();
  }
  return r;
}

// ---------------------------------------------------------------- dust motes in the candle's light (near plane)
const MOTES = once('c04motes', () => { const r = prng(404); return Array.from({ length: 26 }, () => ({ x: 380 + r() * 560, y: 470 + r() * 500, s: .8 + r() * 1.4, ph: r() * TAU, v: 4 + r() * 7 })); });
export function motes(ctx, t, flame) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const m of MOTES) {
    const y = m.y - ((t * m.v + m.ph * 40) % 500), x = m.x + 14 * Math.sin(t * .5 + m.ph) + 6 * Math.sin(t * 1.3 + m.ph * 2), d = Math.hypot(x - flame[0], y - flame[1]);
    const a = clamp(1 - d / 420) * (.35 + .35 * Math.sin(t * 2 + m.ph)); if (a <= .02) continue;
    ctx.fillStyle = rgba(F6.amberCore, a * .55); ctx.beginPath(); ctx.arc(x, y, m.s, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the lotus on the still water (4.10): opens petal by petal, ember-coloured
// open: [u per petal 0..1] in the order OUTER(8) INNER(6) CORE(4); glow 0..1; drawn with the origin at the receptacle, world units (L = petal length)
const PETALS = (() => {
  const P = [];
  for (let i = 0; i < 8; i++) P.push({ ring: 0, phi: i / 8 * TAU + Math.PI / 8, L: 1, wmax: .42, aMax: 1.35, c0: '#c4512e', c1: '#ffb35c', c2: '#ffd9a0' });
  for (let i = 0; i < 6; i++) P.push({ ring: 1, phi: i / 6 * TAU, L: .82, wmax: .38, aMax: .95, c0: '#e07a3a', c1: '#ffc477', c2: '#fff1d6' });
  for (let i = 0; i < 4; i++) P.push({ ring: 2, phi: i / 4 * TAU + Math.PI / 4, L: .6, wmax: .34, aMax: .55, c0: '#ffb35c', c1: '#ffd9a0', c2: '#fff6e2' });
  return P;
})();
export const PETAL_COUNT = PETALS.length;
export function lotus(ctx, t, { open, glow = 1, L = LOTUS.L, a = 1, maxR = 1e9 }) {
  const br = breathe(t, 60, .3, 'sine', .03), GR = Math.min(L * 1.8, maxR);
  const sorted = PETALS.map((p, i) => ({ p, i, depth: Math.sin(p.phi) })).sort((u, v) => u.depth - v.depth);
  ctx.save(); ctx.globalAlpha = a;
  // the glow in the heart of the flower (the ember of this scene), under the petals
  const gl = clamp(glow) * .9; if (gl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(0, -L * .35, 0, 0, -L * .35, GR * br); g.addColorStop(0, rgba(F6.amberCore, .55 * gl)); g.addColorStop(.35, rgba(F6.amber, .3 * gl)); g.addColorStop(1, rgba(F6.amberDeep, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, -L * .35, GR * br, 0, TAU); ctx.fill(); ctx.restore(); }
  // the receptacle (a flat dark-green cushion the petals grow from) and the pad on the water
  ctx.fillStyle = '#1f3329'; ctx.beginPath(); ctx.ellipse(0, L * .1, L * 1.55, L * .42, 0, 0, TAU); ctx.fill();   // the leaf on the water
  ctx.strokeStyle = 'rgba(120,170,140,.35)'; ctx.lineWidth = L * .03; ctx.beginPath(); ctx.ellipse(0, L * .1, L * 1.5, L * .39, 0, 0, TAU); ctx.stroke();
  ctx.fillStyle = '#2f4a3a'; ctx.beginPath(); ctx.ellipse(0, 0, L * .42, L * .16, 0, 0, TAU); ctx.fill();
  for (const { p, i } of sorted) {
    const u = clamp(open[i] ?? 0), al = .2 + u * (p.aMax - .2), len = L * p.L, d = Math.sin(al) * len, h = Math.cos(al) * len, c = Math.cos(p.phi), s = Math.sin(p.phi);
    const tip = [d * c, -h + d * s * .42], w = len * p.wmax * (.55 + .45 * Math.sin(Math.min(al + .4, Math.PI / 2))) * (.6 + .4 * Math.abs(c) + .3 * Math.max(0, s));
    // a pointed petal from the base to the tip, bulging to each side of its axis; the near face lighter toward the tip
    const ax = tip[0], ay = tip[1], nx = -ay, ny = ax, nl = Math.hypot(nx, ny) || 1, ux = nx / nl * w, uy = ny / nl * w;
    const g = ctx.createLinearGradient(0, 0, ax, ay); g.addColorStop(0, p.c0); g.addColorStop(.55, p.c1); g.addColorStop(1, p.c2);
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(ax * .45 + ux, ay * .45 + uy, ax, ay); ctx.quadraticCurveTo(ax * .45 - ux, ay * .45 - uy, 0, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba('#7a2a12', .35); ctx.lineWidth = .6; ctx.stroke();
    ctx.strokeStyle = rgba('#fff6e2', .22 * (s > 0 ? 1 : .4)); ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(ax * .1, ay * .1); ctx.quadraticCurveTo(ax * .5 + ux * .2, ay * .5 + uy * .2, ax * .92, ay * .92); ctx.stroke();   // the midrib
  }
  // the heart: a small bright core once the inner ring parts
  const inner = (open[8] ?? 0) + (open[9] ?? 0) + (open[10] ?? 0); if (inner > .3) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const k = clamp(inner / 3) * gl; const g = ctx.createRadialGradient(0, -L * .2, 0, 0, -L * .2, L * .35 * br); g.addColorStop(0, rgba('#ffffff', .8 * k)); g.addColorStop(.4, rgba(F6.amberCore, .5 * k)); g.addColorStop(1, rgba(F6.amber, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, -L * .2, L * .35 * br, 0, TAU); ctx.fill(); ctx.restore(); }
  ctx.restore();
}
// the flower's reflection on the still water: mirrored, squashed, dim (a reflection is light the water gives back)
export function lotusReflection(ctx, t, o) {
  ctx.save(); ctx.translate(0, LOTUS.L * .22); ctx.scale(1, -.55); ctx.globalAlpha = .38; lotus(ctx, t, { ...o, glow: o.glow * .5 }); ctx.restore();
}
export function karunaLabel(ctx, u, x, y, size = 7.5) {
  if (u <= 0) return;
  reveal(ctx, x - 4, y - size * 1.4, size * 22, size * 2, u, (g) => text(g, 'KARUNA  ·  COMPASSION', x, y, { size, weight: 600, color: rgba(F6.amberCore, .9), spacing: size * .36 }));
}
