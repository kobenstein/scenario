// Film 8 · chunk handoffs WITHOUT any blend (machinery from Film 4 v2 / Film 6) (Jakob 2026-10-20: "keine Blende … durchgehende Animation").
//
// At every chunk boundary both neighbours meet in the SAME full-frame plate: the outgoing chunk's camera flies into an in-world surface
// (a light, a sheet of lamp-lit paper, the night sky, a dark pane, one engraved line) until that surface fills the frame, and the incoming
// chunk's camera leaves the same surface. film.mjs itself draws the plate from H.a to H.b (it inserts one entry per boundary and drops
// chunk entries inside that window), so the cut between two chunk files sits inside one identical image and nobody can see it.
//
//   hand(key, T, RANGES?) → { key, kind, t (centre), a, b, plate(ctx, t), print, o, note }      key = 'c05>c06' …
//   handsOf(id, T) → { in: hand | null, out: hand | null }  for chunk id
//   plate(ctx, t, kind, o)  draws one plate kind (screen space, full frame, deterministic, ~5–25 ms)
//   Film 8 helpers (so a chunk can draw the plate's surface INSIDE its own world and fly into it):
//   skyCam(o) → the s8 camera of a 'sky' plate (o = HAND[key].o): drawSky(ctx, t, skyCam(o)) IS the sky plate (one sky for the film:
//              tilt your own camera to { yaw, pitch, F } = o and the frame equals the plate; camera position does not matter for the sky).
//   paperLamp(ctx, t, o)  the 'paper' lamp surface in PLATE SPACE (1920×1080 = the full frame at the handoff). Draw a sheet in your world
//              with ctx.transform(plate space → screen) and call paperLamp(ctx, t, { rect: [x, y, w, h] } in plate space): at identity it
//              is the plate. Fibre and lamp falloff live in plate space, so the sheet keeps them while the camera moves.
//   lineGround(ctx, t, o) the ground of a 'line' plate (o.ground 'sky': the s8 sky at skyCam(o) with the Milky Way at 40 %, as the quote
//              cards (s8_card) draw it; 'dark': the Film 6 hatched indigo); lineStroke(ctx, t, o) the engraved line alone.
//
// CONTRACT for builders (m1/BRIEF-builders.md, shots.md §9):
//   outgoing chunk: at t = H.a your frame must already BE plate(ctx, H.a, …): the surface you fly into covers the whole frame at
//     H.a - 1/30 at the latest. Use print: H.print on your last entry (the finish must match too).
//   incoming chunk: your first entry is { t: H.b, tr: 'cut', d: .1, draw, print: H.print }; at t = H.b your frame must still BE the plate,
//     then your camera leaves it.
//   Between H.a and H.b film.mjs draws the plate; your own entries in that window are ignored.
// Check: SECS=c02,c03 node render.mjs --snap <H.a-1/30>,<H.a>,<H.b>,<H.b+1/30> … the four stills must be identical apart from motion.
import { W, H, rgba, clamp, mix, sm, prng, drift } from '../engine.mjs';
import { chunkRanges } from '../film.mjs';
import { camera } from './s8_kit.mjs';
import { drawSky } from './s8_sky.mjs';

const TAU = Math.PI * 2;

// ---------------------------------------------------------------- the boundary table (shots.md §9; B1 keeps it, others ask in bild/requests.md)
// at: the cut centre relative to the incoming chunk's first spoken word (R.first) in seconds; w: plate window (s)
export const SKY0 = { yaw: .3, pitch: -.58, F: 1100 };   // the one sky view for the 'sky' plates: the Milky Way across the left half
export const HAND = {
  'c01>c02': { kind: 'sky', at: -.25, w: .3, o: { tone: 'deep', ...SKY0 },
    note: 'after "build" c01 cranes up from the star compass and tilts into the Milky Way (skyCam); c02 tilts down out of the same sky onto the horizon light.' },
  'c02>c03': { kind: 'paper', at: -.6, w: .3, o: { tone: 'lamp' },
    note: 'c02 pushes into the coast chart held up at the window (blank paper, ink out of frame); c03 pulls back off the chart lying on the table.' },
  'c03>c04': { kind: 'glass', at: -.6, w: .3, o: {},
    note: 'c03 pushes into the dark window with your reflection (ring at its chest); c04 pulls back out of the window onto the sheet.' },
  'c04>c05': { kind: 'line', at: -.4, w: .3, o: { y: 600, ang: 0, tone: 'cream', ground: 'sky', ...SKY0 },
    note: 'Q2: the quote lifts out, the kite-string line stays on the card sky; c05: the line is the sheet\'s lamp-lit edge seen edge-on, crane up (as 3.01).' },
  'c05>c06': { kind: 'paper', at: -.4, w: .3, o: { tone: 'lamp' },
    note: 'c05 pushes into the sheet with four lit points (blank paper between them); c06 pulls back off the same sheet.' },
  'c06>c07': { kind: 'sky', at: -.6, w: .3, o: { tone: 'dusk', ...SKY0 },
    note: 'c06 cranes up over Papeete into the morning sky; c07 tilts down onto the grey-blue sea.' },
  'c07>c08': { kind: 'light', at: -.6, w: .3, o: { tone: 'fire' },
    note: 'c07 pushes into Hōkūleʻa\'s fire box; c08 pulls back out of the same fire box, crane up to the rose.' },
  'c08>c09': { kind: 'sky', at: -.4, w: .3, o: { tone: 'deep', ...SKY0 },
    note: 'c08 tilts up from your note through the window into the night sky; c09 tilts down onto the rose\'s south.' },
  'c09>c10': { kind: 'line', at: -.6, w: .3, o: { y: 540, ang: Math.PI / 2, tone: 'cream', ground: 'dark' },
    note: 'c09 pushes into the crease of the folded headline sheet; c10: the vertical line is the seam between the two worlds.' },
  'c10>c11': { kind: 'light', at: -.6, w: .3, o: { tone: 'fire' },
    note: 'c10 pushes into a lantern in the right-hand world; c11 pulls back out of Mau\'s beach fire.' },
};
const PRINT = { light: { riso: .2, halftone: .6 }, paper: { riso: .3 }, sky: { riso: .35 }, line: { riso: .35 }, glass: { riso: .3 } };

// F6_TSHIFT (s): only when a re-rendered head is spliced onto parts rendered on a later time base (Fassung 3: the new hook is 14 s
// shorter, the parts after the c01>c02 plate are the Fassung 2 files, so F6_TSHIFT=14 for the new head). The slow absolute-time life
// (the plates here, cameraFloat in film.mjs) then runs on the old clock and the frame at the splice equals the old part's first frame.
export const TSHIFT = +(process.env.F6_TSHIFT || 0);
let _R = null;
export function hand(key, T, RANGES) {
  const Hd = HAND[key]; if (!Hd) throw new Error('hand: unknown boundary ' + key);
  const R = RANGES || (_R && _R.T === T ? _R.R : (_R = { T, R: chunkRanges(T) }).R);
  const inc = key.split('>')[1], t = R[inc].first + Hd.at, a = t - Hd.w / 2, b = t + Hd.w / 2;
  return { key, kind: Hd.kind, t, a, b, o: Hd.o, note: Hd.note, print: Hd.print || PRINT[Hd.kind] || { riso: .3 },
    plate: (ctx, tt) => plate(ctx, tt + TSHIFT, Hd.kind, Hd.o) };
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
  else if (kind === 'paper') (o.tone === 'lamp' ? paperLamp(ctx, t, o) : paperPlate(ctx, t, o));
  else if (kind === 'sky') drawSky(ctx, t, skyCam(o), skyOpts(o));
  else if (kind === 'line') { lineGround(ctx, t, o); lineStroke(ctx, t, o); }
  else if (kind === 'glass') glassPlate(ctx, t, o);
  ctx.restore();
}

// ---------------------------------------------------------------- Film 8 plates
// the one sky: an s8 camera that looks up into the Milky Way (position is irrelevant for the sky at infinity)
export const skyCam = (o = {}) => camera({ x: 0, y: 0, z: 0, yaw: o.yaw ?? SKY0.yaw, pitch: o.pitch ?? SKY0.pitch, F: o.F ?? SKY0.F });
export const skyOpts = (o = {}) => (o.tone === 'dusk' ? { dawn: .55, dawnAz: o.yaw ?? SKY0.yaw } : {});
// paper in a dark lamp-lit room (shots.md §7 / §9): warm cream at the lamp, falling off to #c9a874 and dark brown #3a2a1c, fibre, no watermark.
// Plate space = the full frame at the handoff; o.rect [x, y, w, h] (plate space) limits the sheet (default: the frame). The lamp breathes (~60 bpm).
export const LAMP = { x: 930, y: 470, R: 1180 };
const FIBL = (() => { const r = prng(707), f = []; for (let i = 0; i < 1600; i++) f.push([-1400 + r() * 4720, -1400 + r() * 3880, (r() - .5) * 2.2, 5 + r() * 24, r()]); return f; })();
const SPECK = (() => { const r = prng(708), f = []; for (let i = 0; i < 700; i++) f.push([-1400 + r() * 4720, -1400 + r() * 3880, r()]); return f; })();
export function paperLamp(ctx, t, o = {}) {
  const [x, y, w, h] = o.rect || [0, 0, W, H], br = 1 + .012 * Math.sin(t * 6.28) + .006 * Math.sin(t * 13.1 + 1);
  const lx = LAMP.x + 6 * drift(t, 1, 4), ly = LAMP.y + 4 * drift(t, 1, 9), R = LAMP.R * br;
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, R);
  g.addColorStop(0, '#f8f1e0'); g.addColorStop(.3, '#f3ecda'); g.addColorStop(.55, '#e2cfa4'); g.addColorStop(.72, '#c9a874'); g.addColorStop(.88, '#6e5236'); g.addColorStop(1, '#3a2a1c');
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  // fibre (light and dark), then a few specks; culled to the sheet
  ctx.lineCap = 'round';
  for (const [fx, fy, a, L, k] of FIBL) {
    if (fx < x - 30 || fx > x + w + 30 || fy < y - 30 || fy > y + h + 30) continue;
    ctx.strokeStyle = k < .55 ? `rgba(110,82,48,${.06 + .07 * k})` : `rgba(255,248,232,${.05 + .08 * k})`; ctx.lineWidth = .7 + k * .7;
    ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx + Math.cos(a) * L, fy + Math.sin(a) * L); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(70,48,28,.16)';
  for (const [fx, fy, k] of SPECK) { if (fx < x || fx > x + w || fy < y || fy > y + h) continue; ctx.fillRect(fx, fy, .8 + k * 1.4, .8 + k * 1.2); }
  // the cool window rim on the far edge (top of plate space) and the lamp's slightly warmer core
  const c = ctx.createLinearGradient(0, -1400, 0, 260); c.addColorStop(0, 'rgba(70,80,150,.35)'); c.addColorStop(1, 'rgba(70,80,150,0)');
  ctx.fillStyle = c; ctx.fillRect(x, y, w, h);
  ctx.restore();
}
// the ground of a line plate: the card sky (s8 sky at skyCam(o), Milky Way at 40 %) or the Film 6 hatched dark
export function lineGround(ctx, t, o = {}) {
  if (o.ground === 'sky') { drawSky(ctx, t, skyCam(o), { mw: .4 }); return; }
  ctx.fillStyle = '#0a0c22'; ctx.fillRect(0, 0, W, H);
  const v = ctx.createRadialGradient(W / 2, o.y ?? H / 2, 0, W / 2, o.y ?? H / 2, W * .7); v.addColorStop(0, 'rgba(40,36,90,.55)'); v.addColorStop(1, 'rgba(10,12,34,0)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(160,150,220,.05)'; ctx.lineWidth = 1; ctx.beginPath(); for (let k = -40; k < 80; k++) { const x = k * 34 + (t * 6) % 34; ctx.moveTo(x, 0); ctx.lineTo(x - 520, H); } ctx.stroke();
}
// the engraved line through (W/2, o.y) at angle o.ang; o.u 0..1 = how much of it is drawn (from the centre out), o.x0/o.x1 = its ends
// (screen x, default the full width) so a card can grow it from one end
export function lineStroke(ctx, t, o = {}) {
  const col = o.tone === 'amber' ? ['#ffb35c', '#fff1d6'] : o.tone === 'cool' ? ['#bfe3ff', '#eef8ff'] : ['#e9dcc0', '#fffaf0'], y = o.y ?? H / 2, a = o.ang || 0, L = 1400;
  const x0 = o.x0 ?? -L, x1 = o.x1 ?? L;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(W / 2, y + 2 * Math.sin(t * .9)); ctx.rotate(a); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  const br = .9 + .1 * Math.sin(t * 2.1);
  for (const [w, al, c] of [[26, .05, col[0]], [10, .14, col[0]], [3.2, .55 * br, col[0]], [1.4, .95, col[1]]]) { ctx.strokeStyle = rgba(c, al); ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x1, 0); ctx.stroke(); }
  ctx.strokeStyle = rgba(col[1], .35); ctx.lineWidth = 1; ctx.beginPath(); for (let x = -L; x < L; x += 9) { if (x < x0 || x > x1) continue; const h = 2 + 1.5 * Math.sin(x * .07 + t); ctx.moveTo(x, -h); ctx.lineTo(x + 3, h); } ctx.stroke();
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
// a dark pane of glass: deep blue-black, a faint diagonal reflection that slides slowly, a few specks of dust in the light
export function glassPlate(ctx, t, o = {}) {
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#0a0f24'); g.addColorStop(1, '#05060f'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const x = W * (.3 + .04 * Math.sin(t * .4)); ctx.save(); ctx.translate(x, H / 2); ctx.rotate(.5);
  const s = ctx.createLinearGradient(-260, 0, 260, 0); s.addColorStop(0, 'rgba(216,247,255,0)'); s.addColorStop(.5, 'rgba(216,247,255,.06)'); s.addColorStop(1, 'rgba(216,247,255,0)');
  ctx.fillStyle = s; ctx.fillRect(-260, -1400, 520, 2800); ctx.restore();
  const r = prng(12); for (let i = 0; i < 70; i++) { const px = r() * W, py = (r() * H + t * 8 * (r() + .3)) % H; ctx.fillStyle = `rgba(216,247,255,${.05 + .08 * r()})`; ctx.fillRect(px, py, 1.6, 1.6); }
}
