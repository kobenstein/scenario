// Film 4 v2 · chunk handoffs WITHOUT any blend (Jakob 2026-10-20 on the minute: "man sieht das bild doppelt weil du überblendest …
// ziel sollte sein das man hier keine blende sieht sondern das es eine durchgehende animation ist").
//
// At every chunk boundary both neighbours meet in the SAME full-frame plate: the outgoing chunk's camera flies into an in-world surface
// (a light, a sheet of paper, the night sky, a dark pane, one engraved line, the Maslow hill) until that surface fills the frame, and
// the incoming chunk's camera leaves the same surface. film.mjs itself draws the plate from H.a to H.b, so the cut between two chunk
// files sits inside one identical image and nobody can see it.
//
//   hand(key, T, RANGES?) → { key, kind, t (centre), a, b, plate(ctx, t), print, o, note }      key = 'c05>c06' …
//   handsOf(id, T) → { in: hand | null, out: hand | null }  for chunk id
//   plate(ctx, t, kind, o)  draws one plate kind (screen space, full frame, deterministic, ~5–25 ms; 'hill' delegates to maslow4)
//
// CONTRACT for builders (bild/BRIEF-builders.md §3):
//   outgoing chunk: at t = H.a your frame must already BE plate(ctx, H.a, …): draw the plate as the surface you fly into (clip it to the
//     window / sheet / sky region in screen space with ctx.save(); clip; plate(ctx, t); restore) and let that region grow until it covers
//     the whole frame at H.a - 1/30 at the latest. Use print: H.print on your last entry (the finish must match too).
//   incoming chunk: your first entry is { t: H.b, tr: 'cut', d: .1, print: H.print }; at t = H.b your frame must still BE the plate, then
//     your camera leaves it (the plate stays the surface of an object in your world: the light becomes your lamp/sun, the sheet becomes your
//     document, the sky stays your sky, the line becomes your horizon or rail, the hill is drawn by maslow4 with the same view).
//   Between H.a and H.b film.mjs draws the plate; your own entries in that window are ignored.
// Check: SECS=c05,c06 node render.mjs --snap <H.a-1/30>,<H.a>,<H.b>,<H.b+1/30> … the four stills must be identical apart from motion.
import { W, H, rgba, clamp, mix, sm, prng, drift } from '../engine.mjs';
import { chunkRanges } from '../film.mjs';
import { drawHill, VIEWS } from './maslow4.mjs';

const TAU = Math.PI * 2;

// ---------------------------------------------------------------- the boundary table (lead owns it; builders ask, never edit)
// at: the cut centre relative to the incoming chunk's first spoken word (R.first) in seconds; w: plate window (s)
export const HAND = {
  'c04>c05': { kind: 'light', at: -.48, w: .3, o: { tone: 'dawn' },
    note: 'c04 pushes into the rising sun of the pop-up dawn (its light fills the frame); c05 pulls back out of the morning sun: it is the sun in your bedroom window.' },
  'c05>c06': { kind: 'hill', at: -1.0, w: .4, o: { view: 'H1' },
    note: 'c05 ends on the full labelled hill at dusk, base lit (Maslow 1); c06 starts from exactly that view: night falls over the hill.' },
  'c06>c07': { kind: 'line', at: -.2, w: .24, o: { y: 590, ang: -.32, tone: 'cream' },
    note: 'the guilloche "?" on the wall above the sofa unwinds into one straight engraved line; c07: that line is the handrail of the escalator in the world of have-to.' },
  'c07>c08': { kind: 'paper', at: -.5, w: .3, o: { tone: 'cream' },
    note: 'the camera pushes into the blank paper of the Sweden chart sheet; c08 pulls back from paper: the park-bench vignette engraves itself at the head of an official form.' },
  'c08>c09': { kind: 'glass', at: -.3, w: .26, o: {},
    note: 'clip S ends, the screen it played on goes dark, the camera is in its dark pane; c09 pulls back out of a dark window pane into the night courtyard.' },
  'c09>c10': { kind: 'hill', at: -.3, w: .3, o: { view: 'H2' },
    note: 'the "with people / something that matters" curve becomes the flank of the hill (Maslow 2), night, BELONGING about to grow; c10 starts on that view and pushes into a window on the belonging terrace.' },
  'c10>c11': { kind: 'sky', at: -.8, w: .3, o: { tone: 'night' },
    note: 'the camera tilts up from the street full of people into the night sky; c11 tilts down from the same sky onto the long table seen from above.' },
  'c11>c12': { kind: 'paper', at: -.2, w: .26, o: { tone: 'warm' },
    note: 'push into a blank notice on the project board; c12 pulls back from paper: an engraved map of Kenya.' },
  'c12>c13': { kind: 'line', at: -.3, w: .26, o: { y: 600, ang: 0, tone: 'amber' },
    note: 'after clip A the bottom rule of its frame is the last thing left, one horizontal amber line; c13: the line is the boom of a barrier across a road.' },
  'c13>c14': { kind: 'sky', at: -.6, w: .3, o: { tone: 'dusk' },
    note: 'the splash droplets fly up, the camera follows them into the dusk sky; c14 tilts down from that sky onto a dark country of lit kitchen windows.' },
  'c14>c15': { kind: 'hill', at: -.8, w: .4, o: { view: 'H4' },
    note: 'the camera has risen up the lit terraces to the dark summit (Maslow 4); c15 starts on that view: you at the top.' },
  'c15>c16': { kind: 'sky', at: -.6, w: .3, o: { tone: 'deep' },
    note: 'from you at the summit the camera tilts up into the stars; c16: the stars slow down (let time stop) and become the four thousand weeks.' },
  'c16>c17': { kind: 'light', at: -.7, w: .3, o: { tone: 'fire' },
    note: 'the amber of a life that brought good into the world fills the frame; c17 pulls back out of firelight: people around a fire under the night sky.' },
  'c17>c18': { kind: 'sky', at: -1.56, w: .4, o: { tone: 'deep' },
    note: 'c17 holds on the open night sky (the noise stops); c18 starts in the same sky: the "if" seal rises like a moon, dawn begins.' },
};
const PRINT = { light: { riso: .2, halftone: .6 }, paper: { riso: .25 }, sky: { riso: .3 }, line: { riso: .25 }, glass: { riso: .3 }, hill: { riso: .3 } };

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

// ---------------------------------------------------------------- the plates (screen space, full frame)
// all plates are alive (grain drifts, light breathes, stars twinkle) and deterministic in t.
const STARS = (() => { const r = prng(4242), s = []; for (let i = 0; i < 520; i++) { const m = r(); s.push([r() * W, r() * H, m < .9 ? .5 + r() * .9 : 1.2 + r() * 1.4, r() * TAU, .4 + r() * 1.6]); } return s; })();
const FIB = (() => { const r = prng(77), f = []; for (let i = 0; i < 420; i++) f.push([r() * W, r() * H, (r() - .5) * 2.4, 6 + r() * 26, r()]); return f; })();
const DOTS = (() => { const r = prng(901), d = []; for (let i = 0; i < 2600; i++) d.push([r(), r(), r()]); return d; })();

export function plate(ctx, t, kind, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  if (kind === 'light') lightPlate(ctx, t, o);
  else if (kind === 'paper') paperPlate(ctx, t, o);
  else if (kind === 'sky') skyPlate(ctx, t, o);
  else if (kind === 'line') linePlate(ctx, t, o);
  else if (kind === 'glass') glassPlate(ctx, t, o);
  else if (kind === 'hill') hillPlate(ctx, t, o);
  ctx.restore();
}

// a light that fills the frame: warm core, falloff to the tone's edge colour, a slow breathing, stippled grain in the falloff
const LIGHT = { dawn: ['#fff6e2', '#ffd9a0', '#f4a77a'], fire: ['#fff1d6', '#ffb35c', '#c4512e'], lamp: ['#fff1d6', '#ffcf8a', '#e08a3c'] };
function lightPlate(ctx, t, o) {
  const [c0, c1, c2] = LIGHT[o.tone] || LIGHT.lamp, br = 1 + .03 * Math.sin(t * 1.7) + .015 * Math.sin(t * 4.3);
  const cx = W / 2 + 18 * drift(t, 1, 3), cy = H / 2 + 12 * drift(t, 1, 7);
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 1150 * br); g.addColorStop(0, c0); g.addColorStop(.42, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // stipple in the falloff (the print look of light), drifting slowly outward
  const r = prng(31 + Math.floor(t * 12)); ctx.fillStyle = rgba(c2, .32);
  for (const [u, v, k] of DOTS) {
    const x = u * W, y = v * H, d = Math.hypot(x - cx, y - cy) / 1100; if (d < .35) continue;
    if (k > (d - .35) * 1.4) continue; const s = .8 + r() * 1.1; ctx.fillRect(x + (r() - .5) * 2, y + (r() - .5) * 2, s, s);
  }
}
// cream paper filling the frame: fibre, a faint watermark rosette, soft light falloff from the top left
const PAPER = { cream: ['#f3ecda', '#e3d6b8', '#cdbb94'], warm: ['#f6e7c9', '#e8cfa2', '#d2ad74'] };
function paperPlate(ctx, t, o) {
  const [p0, p1, p2] = PAPER[o.tone] || PAPER.cream, lx = W * .32 + 30 * drift(t, 1, 2), ly = H * .25;
  const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, 1700); g.addColorStop(0, p0); g.addColorStop(.6, p1); g.addColorStop(1, p2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.lineCap = 'round';
  for (const [x, y, a, L, k] of FIB) { ctx.strokeStyle = rgba(k < .5 ? '#8a7350' : '#fffaf0', .07 + .06 * k); ctx.lineWidth = .7 + k * .6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); ctx.stroke(); }
  // watermark: a faint guilloche rosette, turning very slowly (the certificate language of Film 5)
  ctx.strokeStyle = rgba('#9c8458', .1); ctx.lineWidth = .8; const R0 = 300, rot = t * .02;
  for (let k = 0; k < 7; k++) { ctx.beginPath(); for (let i = 0; i <= 360; i++) { const q = i / 360 * TAU, rr = R0 * (.78 + .06 * k / 7) + 26 * Math.sin(q * 12 + k * .9 + rot * 4); const x = W * .72 + rr * Math.cos(q + rot), y = H * .56 + rr * Math.sin(q + rot) * .92; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
  const v = ctx.createRadialGradient(W / 2, H / 2, H * .45, W / 2, H / 2, W * .75); v.addColorStop(0, 'rgba(60,40,20,0)'); v.addColorStop(1, 'rgba(60,40,20,.22)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
}
// the night sky: indigo, stars that twinkle and drift a little, a faint band of stipple (the milky way); tone dusk adds rose at the bottom
const SKY = { night: ['#060818', '#0d1236', '#1d1a4a'], deep: ['#04050f', '#0a0d26', '#141436'], dusk: ['#0b0f2a', '#3b2f6e', '#c77a8a'] };
function skyPlate(ctx, t, o) {
  const [s0, s1, s2] = SKY[o.tone] || SKY.night;
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, s0); g.addColorStop(.62, s1); g.addColorStop(1, s2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // the band
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-.42); const r = prng(55);
  for (let i = 0; i < 900; i++) { const x = (r() - .5) * W * 1.5, y = (r() + r() + r() - 1.5) * 150, a = .05 + .1 * r(); ctx.fillStyle = `rgba(216,230,255,${a})`; ctx.fillRect(x + t * 1.5, y, 1.3, 1.3); }
  ctx.restore();
  const dx = t * 2.2, dy = t * .6;
  for (const [x, y, s, ph, f] of STARS) {
    const tw = .55 + .45 * Math.sin(t * f + ph), X = ((x + dx) % W + W) % W, Y = ((y + dy) % H + H) % H;
    if (o.tone === 'dusk' && Y > H * .7) continue;
    ctx.fillStyle = `rgba(243,239,226,${(.35 + .65 * tw) * (s > 1.2 ? 1 : .8)})`; ctx.beginPath(); ctx.arc(X, Y, s, 0, TAU); ctx.fill();
    if (s > 2) { ctx.fillStyle = `rgba(255,241,214,${.07 * tw})`; ctx.beginPath(); ctx.arc(X, Y, s * 5, 0, TAU); ctx.fill(); }
  }
}
// one engraved line across a dark ground (through (W/2, o.y) at angle o.ang), with its glow; the ground carries faint hatching
function linePlate(ctx, t, o) {
  ctx.fillStyle = '#0a0c22'; ctx.fillRect(0, 0, W, H);
  const v = ctx.createRadialGradient(W / 2, o.y ?? H / 2, 0, W / 2, o.y ?? H / 2, W * .7); v.addColorStop(0, 'rgba(40,36,90,.55)'); v.addColorStop(1, 'rgba(10,12,34,0)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(160,150,220,.05)'; ctx.lineWidth = 1; ctx.beginPath(); for (let k = -40; k < 80; k++) { const x = k * 34 + (t * 6) % 34; ctx.moveTo(x, 0); ctx.lineTo(x - 520, H); } ctx.stroke();
  const col = o.tone === 'amber' ? ['#ffb35c', '#fff1d6'] : ['#e9dcc0', '#fffaf0'], y = o.y ?? H / 2, a = o.ang || 0, L = 1400;
  ctx.save(); ctx.translate(W / 2, y + 2 * Math.sin(t * .9)); ctx.rotate(a); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  const br = .9 + .1 * Math.sin(t * 2.1);
  for (const [w, al, c] of [[26, .05, col[0]], [10, .14, col[0]], [3.2, .55 * br, col[0]], [1.4, .95, col[1]]]) { ctx.strokeStyle = rgba(c, al); ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(-L, 0); ctx.lineTo(L, 0); ctx.stroke(); }
  // the engraving texture on the line: tiny ticks
  ctx.strokeStyle = rgba(col[1], .35); ctx.lineWidth = 1; ctx.beginPath(); for (let x = -L; x < L; x += 9) { const h = 2 + 1.5 * Math.sin(x * .07 + t); ctx.moveTo(x, -h); ctx.lineTo(x + 3, h); } ctx.stroke();
  ctx.restore();
}
// a dark pane of glass: deep blue-black, a faint diagonal reflection that slides slowly, a few specks of dust in the light
function glassPlate(ctx, t, o) {
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#0a0f24'); g.addColorStop(1, '#05060f'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const x = W * (.3 + .04 * Math.sin(t * .4)); ctx.save(); ctx.translate(x, H / 2); ctx.rotate(.5);
  const s = ctx.createLinearGradient(-260, 0, 260, 0); s.addColorStop(0, 'rgba(216,247,255,0)'); s.addColorStop(.5, 'rgba(216,247,255,.06)'); s.addColorStop(1, 'rgba(216,247,255,0)');
  ctx.fillStyle = s; ctx.fillRect(-260, -1400, 520, 2800); ctx.restore();
  const r = prng(12); for (let i = 0; i < 70; i++) { const px = r() * W, py = (r() * H + t * 8 * (r() + .3)) % H; ctx.fillStyle = `rgba(216,247,255,${.05 + .08 * r()})`; ctx.fillRect(px, py, 1.6, 1.6); }
}
// the Maslow hill at a fixed view and state (lib/maslow4.mjs owns the drawing; VIEWS there)
function hillPlate(ctx, t, o) { const v = VIEWS[o.view]; drawHill(ctx, t, v.cam, v.st); }
