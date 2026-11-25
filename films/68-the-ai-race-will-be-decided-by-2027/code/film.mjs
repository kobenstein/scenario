// Film 68 "The AI Race Will Be Decided by 2027" (thumbnail A: the stadium scoreboard AI RACE · USA 2:2 CHINA, you small on the track).
// ONE sequencer: scenes/plan.mjs (the shot list, also the source of docs/shots.md) resolved on the real VO timing (scenes/resolve.mjs);
// the draw functions live in scenes/ch_*.mjs keyed by shot id. Every boundary is the BATON transition (lib/f68_kit.mjs baton): a gold point of
// light leaves shot A at A.out, flies in an arc to B.in (FLY s), and B grows there as a soft-edged disc (REV s, expo-out). No blends.
// Each draw(ctx, t, S, T) gets S = { id, a, b, t0 (its phrase), seed, in, out } and may draw past S.b (it keeps running under the reveal).
import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import { W, H, drift } from './engine.mjs';
import { timing, ROOT } from './lib/kit.mjs';
import { finish as edFinish, P } from './lib/f10_editorial.mjs';
import { prepareClipFrames, baton, GOLD } from './lib/f68_kit.mjs';
import { resolve } from './scenes/resolve.mjs';
import { errorCard } from './lib/stub.mjs';

export { ROOT };
export const TIMING = process.env.TIMING || ROOT + 'audio/timing.json';
export const FLY = .45, REV = .7;
const PRINT = { grain: 14, floor: 4, vig: .5 };
const CHAPTERS = ['ch_hook', 'ch_1', 'ch_r12', 'ch_r34', 'ch_5', 'ch_6', 'ch_9'];
export function cameraFloat(t) {
  const z = 1.012 + .003 * Math.sin(t * .19 + .7), m = (z - 1) / 2 * .6;
  return { z, x: Math.max(-1, Math.min(1, drift(t * .6, 1, 11))) * W * m, y: Math.max(-1, Math.min(1, drift(t * .6, 1, 23))) * H * m };
}
const ease = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
const sio = (x) => -(Math.cos(Math.PI * Math.min(1, Math.max(0, x))) - 1) / 2;

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
    const rev = prev && cur.tr !== 'cut' ? (t - cur.a) / REV : 1;
    if (rev < 1) {
      this.draw(ax, prev, t); this.draw(bx, cur, t);
      const [cx, cy] = cur.in, Rmax = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) + 140, R = Rmax * ease(rev), fe = 120;
      bx.save(); bx.setTransform(1, 0, 0, 1, 0, 0); bx.globalCompositeOperation = 'destination-in';
      const g = bx.createRadialGradient(cx, cy, Math.max(0, R - fe), cx, cy, Math.max(1, R)); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      bx.fillStyle = g; bx.fillRect(0, 0, W, H); bx.restore();
      gx.save(); gx.setTransform(1, 0, 0, 1, 0, 0); gx.globalAlpha = 1; gx.globalCompositeOperation = 'source-over'; gx.drawImage(A, 0, 0); gx.drawImage(B, 0, 0);
      // the rim of the growing disc carries a thin gold light (the baton's energy spreading)
      const ra = .5 * Math.sin(Math.PI * Math.min(1, rev * 1.2));
      if (ra > 0 && R > 4) { gx.globalCompositeOperation = 'lighter'; const rg = gx.createRadialGradient(cx, cy, Math.max(0, R - fe * .9), cx, cy, R); rg.addColorStop(0, 'rgba(255,217,130,0)'); rg.addColorStop(.75, `rgba(255,217,130,${.16 * ra})`); rg.addColorStop(1, 'rgba(255,217,130,0)'); gx.fillStyle = rg; gx.fillRect(0, 0, W, H); }
      gx.restore();
      if (rev < .45) { gx.save(); baton(gx, cx, cy, 0, { a: 1 - rev / .45, r: 9 + rev * 20 }); gx.restore(); }
    } else this.draw(gx, cur, t);
    if (next && next.tr !== 'cut' && t > next.a - FLY) {
      const v = sio((t - (next.a - FLY)) / FLY), [x0, y0] = cur.out, [x1, y1] = next.in, lift = Math.min(260, Math.hypot(x1 - x0, y1 - y0) * .35 + 60);
      const bxp = (k) => [x0 + (x1 - x0) * k, y0 + (y1 - y0) * k - Math.sin(Math.PI * k) * lift];
      gx.save(); gx.setTransform(1, 0, 0, 1, 0, 0);
      for (let k = 1; k <= 6; k++) { const q = Math.max(0, v - k * .035), [px, py] = bxp(q); gx.globalAlpha = .5 * (1 - k / 7); gx.fillStyle = GOLD.line; gx.beginPath(); gx.arc(px, py, 7 * (1 - k / 8), 0, 6.29); gx.fill(); }
      gx.globalAlpha = 1; const [px, py] = bxp(v); baton(gx, px, py, v, { r: 9 + Math.sin(Math.PI * v) * 3 }); gx.restore();
    }
    const f = cameraFloat(t);
    fx.save(); fx.setTransform(1, 0, 0, 1, 0, 0); fx.globalAlpha = 1; fx.globalCompositeOperation = 'source-over';
    fx.translate(W / 2 + f.x, H / 2 + f.y); fx.scale(f.z, f.z); fx.drawImage(G, -W / 2, -H / 2); fx.restore();
    edFinish(fx, t, PRINT);
    return F;
  }
}

export async function build({ timingFile = TIMING } = {}) {
  const T = timing(timingFile);
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
