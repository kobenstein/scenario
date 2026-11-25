// Film 76 "Your Kids Will Grow Up With Superintelligence" (Leitbild = thumbnail C: parent and child walk hand in hand up a ramp to a giant
// gate of gold light). ONE sequencer: scenes/plan.mjs (the shot list, also the source of docs/shots.md) resolved on the VO timing
// (scenes/resolve.mjs); the draw functions live in scenes/ch_*.mjs keyed by shot id (one file per package: ch_hook = lead, ch_b1/b2/b3).
// Carrier at a boundary (tr 'plane', the default): THE PAPER PLANE (the child's question, folded at the kitchen table in h5). It leaves
// shot A at A.out, flies an arc (FLY s) to B.in, banks, and B unfolds there as a soft-edged disc (REV s, expo-out) with a thin paper rim.
// tr 'match': the shot continues the last frame of the one before by itself (same object, same place): no plane, no reveal.
// tr 'cut': a hard cut (counted in shots.md). Each draw(ctx, t, S, T) gets S = { id, a, b, t0 (its phrase), seed, in, out, pk } and may
// draw past S.b (it keeps running under the next reveal).
// Timing: $TIMING, else <ROOT>audio/timing.json (the real VO), else data/provisional_timing.json (tools/provisional_timing.py).
import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import { W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish, P } from './lib/f10_editorial.mjs';
import { prepareClipFrames } from './lib/f68_kit.mjs';
import { paperPlane, PAPER76 } from './lib/f76_kit.mjs';
import { resolve } from './scenes/resolve.mjs';
import { errorCard } from './lib/stub.mjs';

export { ROOT };
const PROV = new URL('./data/provisional_timing.json', import.meta.url).pathname;
export const TIMING = process.env.TIMING || (fs.existsSync(ROOT + 'audio/timing.json') ? ROOT + 'audio/timing.json' : PROV);
export const FLY = .55, REV = .7;
const PRINT = { grain: 14, floor: 4, vig: .5 };
const CHAPTERS = ['ch_hook', 'ch_b1', 'ch_b2', 'ch_b3'];
export function cameraFloat(t) {
  const z = 1.012 + .003 * Math.sin(t * .19 + .7), m = (z - 1) / 2 * .6;
  return { z, x: Math.max(-1, Math.min(1, drift(t * .6, 1, 11))) * W * m, y: Math.max(-1, Math.min(1, drift(t * .6, 1, 23))) * H * m };
}
const ease = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
const sio = (x) => -(Math.cos(Math.PI * Math.min(1, Math.max(0, x))) - 1) / 2;
// the plane's flight from A.out to B.in: a lifted arc; returns position + heading + bank at k (0..1)
export function planePath(x0, y0, x1, y1, k) {
  const lift = Math.min(300, Math.hypot(x1 - x0, y1 - y0) * .38 + 80), p = (q) => [x0 + (x1 - x0) * q, y0 + (y1 - y0) * q - Math.sin(Math.PI * q) * lift];
  const [px, py] = p(k), [qx, qy] = p(Math.min(1, k + .01)), [rx, ry] = p(Math.max(0, k - .01));
  return { x: px, y: py, ang: Math.atan2(qy - ry, qx - rx), bank: Math.sin(Math.PI * k) * .5 * Math.sign(x1 - x0 || 1) };
}

class Seq {
  constructor(shots, T) {
    this.shots = shots; this.T = T;
    this.c = [0, 1, 2, 3].map(() => { const c = createCanvas(W, H); return [c, c.getContext('2d')]; });
  }
  get duration() { return this.T.duration; }
  idx(t) { let i = 0; while (i + 1 < this.shots.length && this.shots[i + 1].a <= t) i++; return i; }
  draw(x, s, t) {
    x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.filter = 'none';
    x.fillStyle = P.night0; x.fillRect(0, 0, W, H);
    try { s.draw(x, t, s, this.T); } catch (e) { if (!s._err) { s._err = 1; console.error(`[film] ${s.id} @${t.toFixed(2)}: ${e.stack}`); } errorCard(s.id, { a: s.a, b: s.b, name: s.id, first: s.a }, e)(x, t); }
    x.restore();
  }
  frame(t) {
    const i = this.idx(t), cur = this.shots[i], prev = this.shots[i - 1], next = this.shots[i + 1];
    const [A, ax] = this.c[0], [B, bx] = this.c[1], [G, gx] = this.c[2], [F, fx] = this.c[3];
    const rev = prev && (cur.tr ?? 'plane') === 'plane' ? (t - cur.a) / REV : 1;
    if (rev < 1) {
      this.draw(ax, prev, t); this.draw(bx, cur, t);
      const [cx, cy] = cur.in, Rmax = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) + 140, R = Rmax * ease(rev), fe = 120;
      bx.save(); bx.setTransform(1, 0, 0, 1, 0, 0); bx.globalCompositeOperation = 'destination-in';
      const g = bx.createRadialGradient(cx, cy, Math.max(0, R - fe), cx, cy, Math.max(1, R)); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      bx.fillStyle = g; bx.fillRect(0, 0, W, H); bx.restore();
      gx.save(); gx.setTransform(1, 0, 0, 1, 0, 0); gx.globalAlpha = 1; gx.globalCompositeOperation = 'source-over'; gx.drawImage(A, 0, 0); gx.drawImage(B, 0, 0);
      // the rim of the unfolding disc carries a thin paper-cream light (the plane's sheet opening out)
      const ra = .5 * Math.sin(Math.PI * Math.min(1, rev * 1.2));
      if (ra > 0 && R > 4) { gx.globalCompositeOperation = 'lighter'; const rg = gx.createRadialGradient(cx, cy, Math.max(0, R - fe * .9), cx, cy, R); rg.addColorStop(0, 'rgba(246,238,214,0)'); rg.addColorStop(.75, `rgba(246,238,214,${.14 * ra})`); rg.addColorStop(1, 'rgba(246,238,214,0)'); gx.fillStyle = rg; gx.fillRect(0, 0, W, H); }
      gx.restore();
      // the plane lands: it settles, flattens and opens into the disc's centre during the first part of the reveal
      if (rev < .4) { const k = rev / .4; gx.save(); paperPlane(gx, cx, cy, 30 * (1 - .6 * k), -.15 * (1 - k), { open: k, a: 1 - k * k, t }); gx.restore(); }
    } else this.draw(gx, cur, t);
    if (next && (next.tr ?? 'plane') === 'plane' && t > next.a - FLY) {
      const v = sio((t - (next.a - FLY)) / FLY), [x0, y0] = cur.out, [x1, y1] = next.in;
      gx.save(); gx.setTransform(1, 0, 0, 1, 0, 0);
      // a faint dotted trail (pencil dots) behind the plane
      for (let k = 1; k <= 8; k++) { const q = Math.max(0, v - k * .03), p = planePath(x0, y0, x1, y1, q); gx.globalAlpha = .45 * (1 - k / 9); gx.fillStyle = PAPER76.lit; gx.beginPath(); gx.arc(p.x, p.y, 2.6, 0, 6.2832); gx.fill(); }
      gx.globalAlpha = 1; const p = planePath(x0, y0, x1, y1, v); paperPlane(gx, p.x, p.y, 30 + Math.sin(Math.PI * v) * 6, p.ang, { bank: p.bank, t }); gx.restore();
    }
    const f = cameraFloat(t);
    fx.save(); fx.setTransform(1, 0, 0, 1, 0, 0); fx.globalAlpha = 1; fx.globalCompositeOperation = 'source-over';
    fx.translate(W / 2 + f.x, H / 2 + f.y); fx.scale(f.z, f.z); fx.drawImage(G, -W / 2, -H / 2); fx.restore();
    edFinish(fx, t, PRINT);
    return F;
  }
}

// render chunks = the builder packages (lead hook L, B1, B2, B3): { id, a, b } in seconds, contiguous, last one to the end of the film
export function chunkRanges(T) {
  const S = resolve(T), out = {};
  for (const s of S) { const id = s.pk || 'L'; if (!out[id]) out[id] = { id, a: s.a, b: s.b }; else out[id].b = s.b; }
  const L = Object.values(out); L.forEach((r, i) => { if (i + 1 < L.length) r.b = L[i + 1].a; }); L[L.length - 1].b = T.duration; L[0].a = 0;
  return out;
}

export async function build({ timingFile = TIMING } = {}) {
  const T = timing(timingFile);
  if (T.provisional && !build._warned) { build._warned = 1; console.error(`[film] PROVISIONAL timing ${timingFile}`); }
  const DRAW = {};
  for (const ch of CHAPTERS) {
    const f = new URL(`./scenes/${ch}.mjs`, import.meta.url);
    if (!fs.existsSync(f)) continue;
    Object.assign(DRAW, (await import(f.href)).default);
  }
  const shots = resolve(T).map((s) => ({ ...s, draw: DRAW[s.id] || ((ctx, t, S) => errorCard(S.id, { a: S.a, b: S.b, name: S.id + ' (not built)', first: S.a }, new Error('not built'))(ctx, t)) }));
  const film = new Seq(shots, T);
  film.prepare = (t) => prepareClipFrames(T, t);
  film.list = shots;
  return film;
}
