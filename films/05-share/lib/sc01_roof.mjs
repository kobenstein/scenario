// C1 · the roof scenes of the hook: H.04 ★ (you at blue hour, the buzz rings rise as a vast engraved rosette, a second dawn),
// H.05 (the rosette breaks into dotted ghost lines and drifts away as smoke; one dotted thread leaves to the right) and
// H.10 (the same roof late at night, sodium glow, two friends on the parapet, a napkin with three pen signs, she nods).
import { W, H, rgba, clamp, lin, mix, eout, eio, ein, sm, drift, prng, canvas } from '../engine.mjs';
import { stipple } from './art.mjs';
import { rooftop, rooftopFriends, ROOF } from './rooftop.mjs';
import { youBack } from './sc01_you.mjs';
import { rosette, ring, ripple, guilloche, microRing } from './certificate.mjs';
import { ghostLine } from './ghost.mjs';
import { napkin } from './napkin.mjs';
import { pen } from './paper.mjs';

const CACHE = new Map(); const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const eoX = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));          // expo-out
const qio = (x) => (x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2);   // quart in-out

// the rosette of light: three cached guilloche layers (drawn scaled), a core bloom, rays through the fog
const RMAX = 640;
function rosLayer(i) {
  const P = [{ R: RMAX, A: 62, B: 30, n: 48, m: 13, lines: 64, col: '#fff1d6', w: 1.1, a: .5 }, { R: RMAX * .66, A: 52, B: 20, n: 30, m: 11, lines: 52, col: '#ffc887', w: 1, a: .55 }, { R: RMAX * .31, A: 32, B: 14, n: 16, m: 7, lines: 40, col: '#ffe0b0', w: .9, a: .65 }][i];
  return once('ros' + i, () => { const ext = P.R + P.A + P.B + 8, [c, g] = canvas(ext * 2, ext * 2); g.globalCompositeOperation = 'lighter'; rosette(g, ext, ext, { ...P, steps: 900 }); return c; });
}
function coreBloom() { return once('corebloom', () => { const R = 620, [c, g] = canvas(R * 2, R * 2); const rg = g.createRadialGradient(R, R, 0, R, R, R); rg.addColorStop(0, 'rgba(255,226,180,.62)'); rg.addColorStop(.18, 'rgba(255,190,120,.26)'); rg.addColorStop(.55, 'rgba(255,170,100,.06)'); rg.addColorStop(1, 'rgba(255,170,100,0)'); g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2); stipple(c, { k: .8, g: 1.2, seed: 44 }); return c; }); }
function rays() {
  return once('rays', () => {
    const S = 1600, [c, g] = canvas(S * 2, S), r = prng(31); g.filter = 'blur(12px)';
    for (let i = 0; i < 13; i++) { const a = -Math.PI * (.06 + .88 * (i + r() * .7) / 13), sp = .025 + r() * .04, L = 1700; const lg = g.createRadialGradient(S, S, 200, S, S, L); lg.addColorStop(0, 'rgba(255,236,206,.075)'); lg.addColorStop(1, 'rgba(255,236,206,0)'); g.fillStyle = lg; g.beginPath(); g.moveTo(S, S); g.lineTo(S + Math.cos(a - sp) * L, S + Math.sin(a - sp) * L); g.lineTo(S + Math.cos(a + sp) * L, S + Math.sin(a + sp) * L); g.closePath(); g.fill(); }
    g.filter = 'none'; stipple(c, { k: .85, g: 1.2, seed: 32 }); return c;
  });
}
// a ghost version of the outer rosette: fewer lines, sampled once (used while it breaks into dots and smoke)
const GH = []; function ghostRos() { if (GH.length) return GH; const G = guilloche({ R: RMAX, A: 62, B: 30, n: 48, m: 13, lines: 18, steps: 520 }); for (let k = 0; k < 18; k++) GH.push(G.line(k)); return GH; }
const GH2 = []; function ghostRos2() { if (GH2.length) return GH2; const G = guilloche({ R: RMAX * .66, A: 52, B: 20, n: 30, m: 11, lines: 12, steps: 420 }); for (let k = 0; k < 12; k++) GH2.push(G.line(k)); return GH2; }

// the motes of light drifting around the rosette
function motes(ctx, t, cx, cy, R, a) {
  const r = prng(23); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 140; i++) { const ang = r() * 6.283, d = R * (.3 + r() * 1.1), sp = .2 + r() * .5, x = cx + Math.cos(ang) * d + Math.sin(t * sp + i) * 24, y = cy + Math.sin(ang) * d * .8 + Math.cos(t * sp * .8 + i * 1.7) * 18 - t * 8; const f = Math.max(0, 1 - d / (R * 1.4)); ctx.fillStyle = `rgba(255,214,170,${(.12 + .45 * r()) * f * a})`; const z = r() < .8 ? 1.5 : 2.6; ctx.fillRect(x, y, z, z); }
  ctx.restore();
}

// ---------- H.04 + H.05: one continuous take (both shots call this with the same K) ----------
// K: { t0 (H.04 start), largest, made (end of the sentence), fantasy (start of "fantasy"), out (H.05 → H.06 cut) }
export function roofTake(ctx, t, K) {
  const pull = eoX(clamp((t - (K.t0 - .35)) / 2.2));                 // pull back from the phone
  const z = mix(2.6, 1, pull), glide = (t - K.t0) * 9 + drift(t, 5, 1);
  const youX = 560, youY = 1450, ys = 1.26;
  // phone position in set coords (for the zoom focus): from youBack's anchor at cam 0
  const PH = [youX + 116 * ys, youY - 646 * ys];
  const cam = { x: glide, y: drift(t, 3, 2) - (1 - pull) * 30, z, fx: PH[0], fy: PH[1] };
  // the rise: starts as the rings arrive, lifts over the horizon on "largest", grows past the frame edge
  const rise0 = clamp((t - (K.t0 + .2)) / (K.largest - K.t0 - .2)), rise1 = clamp((t - K.largest + .1) / 1.6);
  const RX = ROOF.light.x + 40, RY = mix(mix(860, 640, eio(rise0)), 430, eoX(rise1)) - (t - K.largest) * 2 * (t > K.largest);
  const RR = mix(mix(.35, .55, eio(rise0)), 1.25, eoX(rise1)) * (1 + .01 * Math.sin(t * .9));   // × RMAX
  const dis = clamp((t - K.fantasy - .05) / 1.0), smoke = clamp((t - K.fantasy - .45) / 1.4);    // "fantasy": lines → dots → smoke
  const glowA = mix(.55, 1, eio(rise0)) * (1 - .55 * smoke);
  let A0 = null;
  const A = rooftop(ctx, t, {
    state: 'blue', cam, glowA,
    onSky: (g, A) => {
      const [x, y] = A.map(.12)(RX, RY), k = A.k(.12), R = RR * RMAX * k;
      g.globalCompositeOperation = 'lighter';
      const ry = rays(); g.globalAlpha = .9 * eio(rise0) * (1 - .7 * smoke); g.save(); g.translate(x, y); g.rotate(t * .01); g.drawImage(ry, -ry.width / 2, -ry.height / 2); g.restore();
      const B = coreBloom(); g.globalAlpha = (.55 + .45 * eio(rise0)) * (1 - .6 * smoke); const bs = mix(.8, 1.5, eoX(rise1)) * k; g.drawImage(B, x - B.width / 2 * bs, y - B.height / 2 * bs, B.width * bs, B.height * bs);
      const solid = 1 - sm(dis);
      if (solid > 0) for (let i = 0; i < 3; i++) { const L = rosLayer(i), sc = RR * k * (1 + .06 * Math.sin(t * .5 + i)), rot = [t * .02, -t * .035, t * .05][i]; g.globalAlpha = [.2, .24, .3][i] * (.55 + .45 * eio(rise0)) * solid; g.save(); g.translate(x, y); g.rotate(rot); g.scale(sc, sc); g.drawImage(L, -L.width / 2, -L.height / 2); g.restore(); }
      g.globalAlpha = 1;
      if (dis > 0) {   // the same lines as dotted ghost engraving, then lifting away as smoke
        g.save(); g.translate(x, y); g.rotate(t * .02); g.scale(RR * k, RR * k);
        const lines = ghostRos(), dot = 9 / (RR * k), w = 1.6 / (RR * k);
        for (let i = 0; i < lines.length; i++) if (i % 3 !== 2) ghostLine(g, lines[i], { ghost: 1, smoke: clamp(smoke * 1.15 - i / lines.length * .15), col: '#fff1d6', w, dot, a: .75 * sm(dis), t, seed: i + 1, wind: [.6 / (RR * k), -1] });
        g.rotate(-t * .055); const l2 = ghostRos2(); for (let i = 0; i < l2.length; i += 2) ghostLine(g, l2[i], { ghost: 1, smoke: clamp(smoke * 1.25 - .05), col: '#ffc887', w, dot, a: .7 * sm(dis), t, seed: 40 + i });
        g.restore();
      }
      // two guilloche rings around it (the buzz rings arriving)
      ring(g, x, y, RR * RMAX * 1.12 * k, RR * RMAX * 1.12 * k, { lines: 9, band: 22 * k, wave: 28, col: '#fff1d6', glow: '#ffb35c', glowA: .08, a: .45 * eio(rise0) * (1 - dis), lw: .7, ph: t * .3 });
      A0 = { x, y, R };
    },
  });
  // the buzz keeps rising from the phone and flows into the rosette (rings drift toward it as they grow)
  const k1 = A.k(1), [fx, fy] = A.map(1)(youX, youY);
  const beats = []; for (let b = K.t0 - 1.2; b < Math.min(t, K.fantasy - .3); b += .62) beats.push(b);
  const me = youBack.bind(null);
  const look = sm(clamp((t - (K.largest - .55)) / .9)) - .25 * sm(clamp((t - K.fantasy - .2) / 1.2));
  // phone anchor (screen) for the rings: youBack returns it; draw rings first (behind you) using the predicted anchor
  const phX = fx + 116 * ys * k1 - 34 * ys * k1 * 0, phY = fy - 646 * ys * k1;
  if (A0) ripple(ctx, phX, phY, t, beats, { w0: 16 * k1, h0: 26 * k1, rings: 1, speed: 260, life: 3.2, lines: 5, band: 12 * Math.min(1.6, k1), wave: 26, col: '#fff1d6', coolCol: '#ffe2b8', glow: '#ffb35c', glowA: .07, lineA: .7, a: .85 * (1 - sm(dis)), lw: .8, to: [A0.x, A0.y], toR: A0.R * 1.05, spread: .32 });
  // the phone's glow around the chest, then you
  { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gg = ctx.createRadialGradient(phX, phY, 0, phX, phY, 260 * k1); gg.addColorStop(0, 'rgba(255,190,120,.35)'); gg.addColorStop(.3, 'rgba(255,160,90,.1)'); gg.addColorStop(1, 'rgba(255,150,80,0)'); ctx.fillStyle = gg; ctx.fillRect(phX - 260 * k1, phY - 260 * k1, 520 * k1, 520 * k1); ctx.restore(); }
  const Y = youBack(ctx, fx, fy, ys * k1, { t, look, lit: 1, light: { x: A0 ? A0.x : 1300, y: A0 ? A0.y : 500, col: '#ffe4bc', a: mix(.55, 1, eio(rise0)) * (1 - .4 * smoke) }, wind: 1 });
  if (A0) motes(ctx, t, A0.x, A0.y, Math.max(300, A0.R), .55 * eio(rise0) * (1 - smoke));
  // H.05 end: one dotted thread peels off the dissolving rosette and leaves to the right (it becomes the sheet's edge in H.06)
  if (A0 && K.out && t > K.out - 1.2) threadOut(ctx, t, K, A0);
  // soft vignette toward the corners (keeps the eye on you and the light)
  const vg = ctx.createRadialGradient(W * .5, H * .48, 420, W * .5, H * .5, 1250); vg.addColorStop(0, 'rgba(3,4,12,0)'); vg.addColorStop(1, 'rgba(3,4,12,.5)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  return { phone: Y.phone, A0 };
}
// the carrier thread at the H.05 → H.06 cut: a dotted line straightening and travelling right; THREAD(t) is shared with H.06
export function threadPts(t, cutT) {
  const u = clamp((t - (cutT - 1.2)) / 1.2), e = eio(u);
  const pts = []; const x0 = mix(1120, 760, e), x1 = mix(1380, 1980, eio(clamp(u * 1.15))), y = mix(470, 560, e);
  for (let i = 0; i <= 80; i++) { const q = i / 80; pts.push([mix(x0, x1, q), y + Math.sin(q * 9 + t * 3) * 26 * (1 - e) * (1 - q * .5) - (1 - e) * 120 * Math.sin(q * Math.PI)]); }
  return pts;
}
function threadOut(ctx, t, K, A0) {
  const P = threadPts(t, K.out), a = sm(clamp((t - (K.out - 1.2)) / .3));
  ghostLine(ctx, P, { ghost: 1, col: '#fff1d6', w: 1.8, dot: 7, a: .9 * a, t, glow: '#ffb35c' });
}

// ---------- H.10: the roof at night, two friends on the parapet, the napkin, the pen ----------
// K: { t0, plan, friend (start of "friend"), tonight, out (cut to 0.01) }
export function roofNight(ctx, t, K) {
  const u = clamp((t - K.t0) / (K.out - K.t0));
  // the camera leans in toward the napkin over the whole take (the plan is the subject)
  const cam = { x: -40 + 44 * eio(u) + drift(t, 4, 3), y: -2 + drift(t, 2, 1), z: 2.68 + .36 * eio(u), fx: 965, fy: 640 };
  const A = rooftop(ctx, t, { state: 'night', cam, seats: 2, seatX: [870, 1060], seatS: 1.55 });
  const hump = (a, d) => Math.max(0, Math.sin(clamp((t - a) / d) * Math.PI));
  const nod = Math.max(hump(K.friend - .05, .7), .8 * hump(K.tonight + .05, .7));   // she nods on "friend", and again after "tonight"
  const lean = sm(clamp((t - (K.friend - .9)) / .7));
  const writing = clamp((t - (K.plan - .2)) / ((K.friend + .3) - (K.plan - .2)));
  // in the pause after "tonight" you look up from the napkin to her, she nods, you nod back; then the pen leaves
  const up = sm(clamp((t - (K.tonight - .45)) / .5)), ynod = .8 * hump(K.tonight + .45, .6);
  const F = rooftopFriends(ctx, t, A, { you: { write: writing < 1 ? 1 : 0, up, nod: ynod, pen: 1 - sm(clamp((t - (K.out - .95)) / .5)) }, friend: { nod, lean }, light: { x: (A.seats[0].x + A.seats[1].x) / 2 + 300, y: A.parapet.y + 160, col: '#ff9a3c', a: .14 } });
  // the napkin on your knee (lies flat-ish, seen at an angle) with three signs drawn one after the other
  const S = A.seats[0], ks = S.s / 1.55;
  const nx = S.hip[0] + 64 * ks, ny = S.hip[1] - 6 * ks;
  const N = napkin(ctx, nx, ny, .23 * ks, t, { rot: -.12, tilt: .55, marks: { dot: clamp(writing * 3), sprout: clamp(writing * 3 - 1), fruit: clamp(writing * 3 - 2) }, light: 'night', glow: .4 });
  // the pen in your hand: follows the drawing, then lifts and leaves to the right (the carrier into 0.01)
  const tip = N.pen(writing < 1 / 3 ? 0 : writing < 2 / 3 ? 1 : 2) || N.mark(2);
  const lift = clamp((t - (K.out - .9)) / .9);
  const px = mix(tip.x + 2, 2100, ein(lift) * .0 + eio(lift) * 1), py = mix(tip.y - 2, 120, eio(lift));
  // while it writes the pen runs from the nib up into your hand (held, not floating); then it lifts away
  let ang = -2.2 + lift * .8, ps = .2 * ks * (1 + lift * 2.2); const hd = F && F.you && F.you.hand;
  if (hd) { const dx = hd[0] - tip.x, dy = hd[1] - tip.y, k = eio(lift); ang = mix(Math.atan2(dy, dx), ang, k); ps = mix(clamp(Math.hypot(dx, dy) / (246 * .78), .14 * ks, .3 * ks), ps, k); }
  if (lift < 1) pen(ctx, px, py, ps, { ang, t, lift: lift > 0 ? 1 : 0 });
  return A;
}
export { ROOF };
