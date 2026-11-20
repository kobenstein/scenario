// Film 11 · chapter handoffs WITHOUT any blend (machinery from Film 4 v2 / Film 7). Jakob: "keine Blende … eine durchgehende Animation".
//
// At every chapter boundary both neighbours meet in the SAME full-frame plate: the outgoing chapter's camera flies into an in-world
// surface of THE HALL (a sheet of paper, the sun on the floor, the machine's core, the mirror, the dusk sky over the city) until that
// surface fills the frame, and the incoming chapter's camera leaves the same surface. film.mjs itself draws the plate from H.a to H.b,
// so the cut between two chapter files sits inside one identical image and nobody can see it.
// Film 11 plates are BRIGHT (Ruhe + Helligkeit): never a dark glass, never night. They are near-uniform surfaces without trackable
// structure, so a builder can clip the plate to the surface it flies into (screen space) and let that region grow.
//
//   hand(key, T, RANGES?) → { key, kind, t (centre), a, b, plate(ctx, t), print, o, note }      key = 'c05>c06' …
//   handsOf(id, T) → { in: hand | null, out: hand | null }  for chapter id
//   plate(ctx, t, kind, o)  draws one plate kind (screen space, full frame, deterministic, ~5–20 ms)
//     kinds: 'paper' (o.tone: cream | exam | scroll) · 'light' (o.tone: sun | core | dusk | lamp) · 'mirror' · 'sky' (o.tone: dusk | day)
//
// CONTRACT for builders (bild/BRIEF-builders.md §2):
//   outgoing chapter: at t = H.a your frame must already BE plate(ctx, H.a, …): draw the plate as the surface you fly into (clip it to the
//     sheet / light / mirror / sky region in screen space with ctx.save(); clip; plate(ctx, t); restore) and let that region grow until it
//     covers the whole frame at H.a - 1/30 at the latest. Use print: H.print on your last entry (the finish must match too).
//   incoming chapter: your first entry is { t: H.b, tr: 'cut', d: .1, print: H.print }; at t = H.b your frame must still BE the plate, then
//     your camera leaves it (the plate stays the surface of an object in the hall).
//   Between H.a and H.b film.mjs draws the plate; your own entries in that window are ignored.
// Check: SECS=c01,c02 node tools/seam.mjs --at <H.t> … the frames around H.a and H.b must be identical apart from grain.
import { W, H, rgba, prng, drift } from '../engine.mjs';
import { chunkRanges } from '../film.mjs';

const TAU = Math.PI * 2;

// ---------------------------------------------------------------- the boundary table (lead owns it; builders ask, never edit)
// at: the cut centre relative to the incoming chapter's first spoken word (R.first) in seconds; w: plate window (s)
export const HAND = {
  'c01>c02': { kind: 'paper', at: -.5, w: .3, o: { tone: 'exam' },
    note: 'c01 pushes down into the blank margin of an exam sheet on a front desk (Turkey); c02 pulls out of the same paper: the city map grows on it (the blue dot).' },
  'c02>c03': { kind: 'mirror', at: -.6, w: .3, o: {},
    note: 'c02 ends with you stepping in front of the mirror wall ("Right?") and pushes into the glass; c03 pulls back out of the mirror: your reflection, broader than you.' },
  'c03>c04': { kind: 'light', at: -.6, w: .3, o: { tone: 'sun' },
    note: 'the big shadow passes, c03 tilts down onto the floor into a sun patch; c04 pulls out of the sun patch onto the Go grid in the floor.' },
  'c04>c05': { kind: 'light', at: -.6, w: .3, o: { tone: 'core' },
    note: 'c04 pushes into the cool core of the machine between the doctor and the Go player; c05 pulls out of it: the Go player studying the machine’s moves.' },
  'c05>c06': { kind: 'paper', at: -.45, w: .3, o: { tone: 'cream' },
    note: 'c05 pushes into the quote card pinned to the board (without guardrails …); c06 pulls out of cream paper: a test sheet of the Anthropic study.' },
  'c06>c07': { kind: 'light', at: -.6, w: .3, o: { tone: 'sun' },
    note: 'c06 rises to the oculus (round window) and pushes into its light; c07 pulls out of the same light seen from outside: the hall from above, it grows into a city.' },
  'c07>c08': { kind: 'sky', at: -.6, w: .3, o: { tone: 'dusk' },
    note: 'c07 tilts up from the city of lights into the warm dusk sky; c08 tilts down from the same sky onto two versions of the city (2035).' },
  'c08>c09': { kind: 'light', at: -.6, w: .3, o: { tone: 'dusk' },
    note: 'c08 returns to your hall in the city and pushes into one of its lit windows; c09 pulls back out of the window light inside the hall.' },
  'c09>c10': { kind: 'paper', at: -.45, w: .3, o: { tone: 'scroll' },
    note: 'c09 pushes into Plato’s scroll (papyrus); c10 pulls out of the scroll: it unrolls into libraries and the windows of the city.' },
};
const PRINT = { light: { riso: .2, halftone: .5 }, paper: { riso: .25 }, sky: { riso: .3 }, mirror: { riso: .25 } };

let _R = null;
export function hand(key, T, RANGES) {
  const Hd = HAND[key]; if (!Hd) throw new Error('hand: unknown boundary ' + key);
  const R = RANGES || (_R && _R.T === T ? _R.R : (_R = { T, R: chunkRanges(T) }).R);
  const inc = key.split('>')[1], t = R[inc].first + Hd.at, a = t - Hd.w / 2, b = t + Hd.w / 2;
  return { key, kind: Hd.kind, t, a, b, o: Hd.o, note: Hd.note, print: Hd.print || PRINT[Hd.kind] || { riso: .3 },
    plate: (ctx, tt) => plate(ctx, tt, Hd.kind, Hd.o) };
}
export function handsOf(id, T) {
  const k = Object.keys(HAND);
  const i = k.find((x) => x.endsWith('>' + id)), o = k.find((x) => x.startsWith(id + '>'));
  return { in: i ? hand(i, T) : null, out: o ? hand(o, T) : null };
}
export const TSHIFT = 0;   // kept for film.mjs (Film 6 splice tool); Film 11 does not use it

// ---------------------------------------------------------------- the plates (screen space, full frame)
// all plates are alive but calm (light breathes ±3 %, a sheen slides, grain drifts) and deterministic in t.
const STARS = (() => { const r = prng(4242), s = []; for (let i = 0; i < 520; i++) { const m = r(); s.push([r() * W, r() * H, m < .9 ? .5 + r() * .9 : 1.2 + r() * 1.4, r() * TAU, .4 + r() * 1.6]); } return s; })();
const FIB = (() => { const r = prng(77), f = []; for (let i = 0; i < 420; i++) f.push([r() * W, r() * H, (r() - .5) * 2.4, 6 + r() * 26, r()]); return f; })();
const DOTS = (() => { const r = prng(901), d = []; for (let i = 0; i < 2600; i++) d.push([r(), r(), r(), (r() - .5) * 2, (r() - .5) * 2, .8 + r() * 1.1]); return d; })();

export function plate(ctx, t, kind, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  if (kind === 'light') lightPlate(ctx, t, o);
  else if (kind === 'paper') paperPlate(ctx, t, o);
  else if (kind === 'sky') skyPlate(ctx, t, o);
  else if (kind === 'mirror') mirrorPlate(ctx, t, o);
  ctx.restore();
}

// a light that fills the frame: bright core, falloff to the tone's edge colour, a slow breathing, a calm stipple in the falloff
const LIGHT = { sun: ['#fffaf0', '#ffe9c4', '#f3c98e'], core: ['#f8fdff', '#ddeff7', '#a9cadb'], dusk: ['#fff4dc', '#ffd59a', '#e9a066'], lamp: ['#fff1d6', '#ffcf8a', '#e08a3c'] };
function lightPlate(ctx, t, o) {
  const [c0, c1, c2] = LIGHT[o.tone] || LIGHT.sun, br = 1 + .03 * Math.sin(t * 1.1) + .01 * Math.sin(t * 2.9);
  const cx = W / 2 + 18 * drift(t * .5, 1, 3), cy = H / 2 + 12 * drift(t * .5, 1, 7);
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 1250 * br); g.addColorStop(0, c0); g.addColorStop(.45, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = rgba(c2, .2);
  for (const [u, v, k, jx, jy, s] of DOTS) {
    const x = u * W + jx * 3 * Math.sin(t * .3 + k * 6), y = v * H + jy * 3 * Math.cos(t * .3 + k * 6), d = Math.hypot(x - cx, y - cy) / 1150; if (d < .4) continue;
    if (k > (d - .4) * 1.3) continue; ctx.fillRect(x, y, s, s);
  }
}
// paper filling the frame: fibre, soft light falloff from the top left. tone exam = a fresh exam sheet, scroll = papyrus with its strips
const PAPER = { cream: ['#f6efdf', '#e9dcc0', '#d6c49f'], exam: ['#f8f3e6', '#ede3cc', '#dccca8'], scroll: ['#efe0bc', '#e0c994', '#c9a96c'] };
function paperPlate(ctx, t, o) {
  const [p0, p1, p2] = PAPER[o.tone] || PAPER.cream, lx = W * .32 + 30 * drift(t * .5, 1, 2), ly = H * .25;
  const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, 1900); g.addColorStop(0, p0); g.addColorStop(.6, p1); g.addColorStop(1, p2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.lineCap = 'round';
  for (const [x, y, a, L, k] of FIB) { ctx.strokeStyle = rgba(k < .5 ? '#8a7350' : '#fffaf0', .06 + .05 * k); ctx.lineWidth = .7 + k * .6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); ctx.stroke(); }
  if (o.tone === 'scroll') { ctx.strokeStyle = 'rgba(120,90,40,.08)'; ctx.lineWidth = 2; ctx.beginPath(); for (let x = 30; x < W; x += 64) { ctx.moveTo(x, 0); ctx.lineTo(x + 6, H); } ctx.stroke(); }
  const v = ctx.createRadialGradient(W / 2, H / 2, H * .5, W / 2, H / 2, W * .8); v.addColorStop(0, 'rgba(90,60,30,0)'); v.addColorStop(1, 'rgba(90,60,30,.12)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
}
// the mirror wall filling the frame: pale warm silver, one soft diagonal sheen that slides very slowly, a few specks in the light
function mirrorPlate(ctx, t, o) {
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#e2e3dc'); g.addColorStop(.55, '#d3d6cf'); g.addColorStop(1, '#c6c9c0'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const x = W * (.35 + .03 * Math.sin(t * .3)); ctx.save(); ctx.translate(x, H / 2); ctx.rotate(.45);
  const s = ctx.createLinearGradient(-320, 0, 320, 0); s.addColorStop(0, 'rgba(255,253,245,0)'); s.addColorStop(.5, 'rgba(255,253,245,.35)'); s.addColorStop(1, 'rgba(255,253,245,0)');
  ctx.fillStyle = s; ctx.fillRect(-320, -1400, 640, 2800); ctx.restore();
  const r = prng(12); for (let i = 0; i < 60; i++) { const px = r() * W, py = (r() * H + t * 6 * (r() + .3)) % H; ctx.fillStyle = `rgba(255,250,235,${.12 + .12 * r()})`; ctx.fillRect(px, py, 1.6, 1.6); }
}
// the sky over the city: dusk = blue-violet above, rose, warm gold at the horizon (bright, never night), a few early stars high up
const SKY = { dusk: ['#5b6aa0', '#c99aa0', '#f6c48c'], day: ['#a9c2d8', '#dfe6e6', '#f7ead2'], night: ['#1d2650', '#3b3f72', '#8a6a86'] };
function skyPlate(ctx, t, o) {
  const [s0, s1, s2] = SKY[o.tone] || SKY.dusk;
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, s0); g.addColorStop(.6, s1); g.addColorStop(1, s2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const dx = t * 1.2, dy = t * .3;
  for (const [x, y, s, ph, f] of STARS) {
    const tw = .55 + .45 * Math.sin(t * f * .6 + ph), X = ((x + dx) % W + W) % W, Y = ((y + dy) % H + H) % H;
    if (o.tone !== 'night' && (Y > H * .4 || s < 1.2)) continue;
    ctx.fillStyle = `rgba(255,248,232,${(.25 + .5 * tw) * (1 - Y / (H * .45))})`; ctx.beginPath(); ctx.arc(X, Y, s * .8, 0, TAU); ctx.fill();
  }
}
