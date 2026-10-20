// Film 6 · chunk handoffs WITHOUT any blend (machinery from Film 4 v2) (Jakob 2026-10-20 on the minute: "man sieht das bild doppelt weil du überblendest …
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

const TAU = Math.PI * 2;

// ---------------------------------------------------------------- the boundary table (lead owns it; builders ask, never edit)
// at: the cut centre relative to the incoming chunk's first spoken word (R.first) in seconds; w: plate window (s)
export const HAND = {
  'c01>c02': { kind: 'glass', at: -.7, w: .3, o: {},
    note: 'c01 pushes into the dark window pane that reflects the night room (the empty chair); c02 pulls back out of the same dark glass: it is the mirror pane that returns your smile.' },
  'c02>c03': { kind: 'line', at: -.26, w: .22, o: { y: 540, ang: 0, tone: 'cool' },
    note: 'the Harari clip ends, its screen light collapses to one horizontal cool line (old TV switch-off); c03 starts on that line: the ember separates from it (the split).' },
  'c03>c04': { kind: 'light', at: -.6, w: .3, o: { tone: 'ember' },
    note: 'c03 pushes into the candle flame in front of the seated figure; c04 pulls back out of the flame: the candle in the first light of morning.' },
  'c04>c05': { kind: 'glass', at: -.5, w: .3, o: {},
    note: 'the lotus has opened on still dark water; c04 pushes into that water (dark glass); c05 pulls back: the surface is the mirror of the mind.' },
  'c05>c06': { kind: 'line', at: -.6, w: .26, o: { y: 560, ang: 0, tone: 'amber' },
    note: 'a heartbeat trembles the great mirror, the ripple settles into one flat amber pulse line; c06 starts on that line and makes it beat (the pulse).' },
  'c06>c07': { kind: 'paper', at: -.3, w: .26, o: { tone: 'cream' },
    note: 'c06 pushes into the cream study page lying on the nursery floor; c07 pulls back: the page is one of several cards on a dark table that turn over.' },
  'c07>c08': { kind: 'line', at: -.6, w: .26, o: { y: 620, ang: 0, tone: 'cream' },
    note: 'the pulse line along the lower edge of the mirror straightens, goes cream and fills the frame; c08: the line is the kerb line of a night street.' },
  'c08>c09': { kind: 'light', at: -.4, w: .3, o: { tone: 'lamp' },
    note: 'the Hinton clip ends, the glow of its screen swells and fills the frame; c09 pulls back out of that light: it is the backlight behind the mother.' },
  'c09>c10': { kind: 'paper', at: -.6, w: .3, o: { tone: 'warm' },
    note: 'c09 pushes into a page of values on a lab desk; c10 pulls back: the page fans into two paths.' },
  'c10>c11': { kind: 'light', at: -.6, w: .3, o: { tone: 'lamp' },
    note: 'in a window across the street a light goes on, c10 pushes into it; c11 pulls back out of the lamp over the big empty sheet.' },
  'c11>c12': { kind: 'glass', at: -.3, w: .26, o: {},
    note: 'c11 pushes into the dark pane that reads "Help them, honestly."; c12 pulls back out of a dark screen in a lab at night.' },
  'c12>c13': { kind: 'light', at: -.6, w: .3, o: { tone: 'dawn' },
    note: 'the honest screens warm into dawn light that fills the frame; c13 pulls back out of the dawn: the seated figure practising, breath like mist.' },
  'c13>c14': { kind: 'light', at: -.5, w: .3, o: { tone: 'lamp' },
    note: 'c13 pushes into the night light on the ward; c14 pulls back out of the desk lamp of the hook room (same evening, Tolle on the pane).' },
};
const PRINT = { light: { riso: .2, halftone: .6 }, paper: { riso: .25 }, sky: { riso: .3 }, line: { riso: .25 }, glass: { riso: .3 } };

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
  ctx.restore();
}

// a light that fills the frame: warm core, falloff to the tone's edge colour, a slow breathing, stippled grain in the falloff
const LIGHT = { dawn: ['#fff6e2', '#ffd9a0', '#f4a77a'], fire: ['#fff1d6', '#ffb35c', '#c4512e'], lamp: ['#fff1d6', '#ffcf8a', '#e08a3c'], ember: ['#fff1d6', '#ff9a3c', '#7a2a12'] };
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
  const col = o.tone === 'amber' ? ['#ffb35c', '#fff1d6'] : o.tone === 'cool' ? ['#bfe3ff', '#eef8ff'] : ['#e9dcc0', '#fffaf0'], y = o.y ?? H / 2, a = o.ang || 0, L = 1400;
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
