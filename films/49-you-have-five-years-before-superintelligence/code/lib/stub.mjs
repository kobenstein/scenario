// Placeholder shots so the whole film renders end to end from day one: one card per spoken sentence of a chunk,
// showing chunk, section, the sentence (words light up with the voice) and the palette of that section (konzept.md §3).
// Builders replace scenes/scNN.mjs step by step; anything not yet built keeps rendering as a stub.
import { W, H, C, rgba, clamp, lin, eout, drift, text } from '../engine.mjs';

export const PAL = { // ground, middle, accent per VO level (audio/timing.json levels): night blue, cream, gold
  H: ['#0c1b4a', '#fefcde', '#f6c95c'], 1: ['#1a1230', '#f7f0d8', '#ffb35c'], 2: ['#0c1b4a', '#fefcde', '#f6c95c'], 3: ['#0d1a3a', '#dfe8f2', '#f6c95c'],
  M: ['#0d1530', '#f5b08a', '#f0a04b'], 4: ['#0c1b33', '#dfe8f2', '#9fc2ee'], 5: ['#0a1334', '#dfe8f2', '#9fc2ee'], 6: ['#141a3c', '#fefcde', '#f6c95c'],
  7: ['#1e1a3a', '#ffe9a6', '#ffb35c'], A2: ['#0d1530', '#f5b08a', '#f0a04b'],
};
const SECNAME = { H: 'Hook · five years', 1: 'The wedding · the countdown', 2: 'Step 5 · you', 3: 'Step 4 · your work', M: 'Subscribe 1', 4: 'Step 3 · your family', 5: 'Step 2 · the machine', 6: 'Step 1 · your say', 7: 'The top · the hardest question', A2: 'Subscribe 2 · end' };

function wrapWords(ctx, words, size, maxW) {
  ctx.font = `${size}px "Instrument Serif"`; const sp = ctx.measureText(' ').width, lines = []; let cur = [], w = 0;
  for (const o of words) { const ww = ctx.measureText(o.w).width; if (cur.length && w + sp + ww > maxW) { lines.push(cur); cur = []; w = 0; } w += (cur.length ? sp : 0) + ww; cur.push(o); }
  if (cur.length) lines.push(cur); return lines;
}
export const stubShot = (R, line) => (ctx, t, s) => {
  const [g, m, acc] = PAL[line.sec] || PAL.H;
  const bg = ctx.createLinearGradient(0, 0, W * .3, H); bg.addColorStop(0, g); bg.addColorStop(1, '#070918'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  // a slow light so even the stub never stands still
  const lx = W * (.72 + .05 * Math.sin(t * .21)), ly = H * .2, gr = ctx.createRadialGradient(lx, ly, 0, lx, ly, 900);
  gr.addColorStop(0, rgba(acc, .22)); gr.addColorStop(1, rgba(acc, 0)); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
  const dx = drift(t, 6, 1), dy = drift(t, 4, 2);
  text(ctx, `${R.id.toUpperCase()} · STUB · shots ${R.shots}`, 120 + dx, 150 + dy, { size: 22, weight: 600, color: rgba(m, .75), spacing: 6 });
  text(ctx, SECNAME[line.sec] || line.sec, 120 + dx, 210 + dy, { size: 46, font: 'Instrument Serif', color: m });
  const lines = wrapWords(ctx, line.words, 72, W - 300);
  lines.forEach((ln, li) => {
    let x = 120 + dx; const y = 470 + li * 92 + dy;
    for (const o of ln) {
      const on = eout(lin(o.s - .05, o.s + .2, t)); ctx.font = '72px "Instrument Serif"';
      text(ctx, o.w, x, y, { size: 72, font: 'Instrument Serif', color: on > .5 ? '#f3efe2' : m, alpha: .28 + .72 * on });
      x += ctx.measureText(o.w + ' ').width;
    }
  });
  const u = clamp((t - line.s) / Math.max(.1, line.e - line.s));
  ctx.fillStyle = rgba(m, .25); ctx.fillRect(120, H - 130, W - 240, 3); ctx.fillStyle = acc; ctx.fillRect(120, H - 130, (W - 240) * u, 3);
  text(ctx, `${t.toFixed(2)} s`, W - 120, H - 150, { size: 20, weight: 500, color: rgba(m, .6), align: 'right' });
};
// stub entries for a chunk: one per sentence in [R.a, R.b)
export function stubChunk(T, R) {
  const out = [];
  for (const sec of T.secs) for (const l of T.lines(sec)) if (l.s >= R.first - .01 && l.s < R.b - .01) out.push({ t: Math.max(0, l.s - .3), draw: stubShot(R, l), tr: 'cut', d: .35 });
  if (!out.length) out.push({ t: R.first, draw: stubShot(R, { sec: T.secs[0], words: [], s: R.a, e: R.b }), tr: 'cut', d: .1 });
  return out;
}
export const errorCard = (id, R, err) => (ctx, t) => {
  ctx.fillStyle = '#3a0d12'; ctx.fillRect(0, 0, W, H);
  text(ctx, `${id.toUpperCase()} FAILED TO BUILD`, 120, 300, { size: 64, font: 'Instrument Serif', color: '#ffd0c8' });
  String(err?.message || err).match(/.{1,90}(\s|$)/g)?.slice(0, 6).forEach((s, i) => text(ctx, s, 120, 400 + i * 44, { size: 28, color: '#ffd0c8' }));
};

// ------------------------------------------------------------------------------------------------ WORLD STUBS (Film 49)
// A world stub renders its chunk INSIDE the stairs world, so the film plays end to end in the right space from day one:
//   · the seam plates at the group boundaries are already exact (plateFoot / plateWork / plateMachine, ±SEAM_HALF), so seam.mjs passes;
//   · in between, the camera glides along o.keys (phrases, never seconds) with the world state o.state(t, T);
//   · top right a small STUB label and the sentence being spoken (cream, 26 px, never in the bottom 170 px).
// Builders replace scenes/scNN.mjs completely; keep the plate entries and exits (docs/BRIEF-builders.md §2).
//   worldStub(T, R, { from: 'plateFoot'|'plateWork'|'plateMachine', to: 'plateWork'|'plateMachine'|'end', keys: [[phrase|null, cam, dt]], state })
export async function worldStub(T, R, o = {}) {
  const S = await import('./f49_world.mjs'), F = await import('./f49_kit.mjs');
  const PL = { plateFoot: S.plateFoot, plateWork: S.plateWork, plateMachine: S.plateMachine };
  const endT = T.duration - 15;
  const a0 = R.a + (o.from ? S.SEAM_HALF : 0), b0 = o.to && o.to !== 'end' ? R.b - S.SEAM_HALF : R.b;
  const K = (o.keys ?? []).map(([ph, cam, dt = 0]) => [ph === null ? (dt < 0 ? b0 + dt : a0 + dt) : T.G(ph) + dt, cam]).sort((p, q) => p[0] - q[0]);
  const PH = { plateFoot: ['Picture a wedding', S.FOOT_CAM], plateWork: ['But you can only do so much', S.WORK_CAM], plateMachine: ['That is what the experts know', S.MACHINE_CAM] };
  const plateCam = (id, t) => { const [ph, cam] = PH[id], k = S.creep(t, T, ph); return cam(k, S.trk(k)); };
  if (o.from) K.unshift([a0, plateCam(o.from, a0)]);           // the camera leaves the plate where the plate left it
  if (o.to && o.to !== 'end') K.push([b0, plateCam(o.to, b0)]); // and lands on the next plate exactly
  if (o.to === 'end') K.push([endT, S.END_CAM]);
  const draw = (ctx, t) => {
    if (o.from && t < a0) return PL[o.from](ctx, t, T);
    if (o.to && o.to !== 'end' && t >= b0) return PL[o.to](ctx, t, T);
    if (o.to === 'end' && t >= endT) return S.endScreen(ctx, t, T);
    const amt = Math.min(1, (t - a0) / 1.2, ((o.to ? (o.to === 'end' ? endT : b0) : R.b) - t) / 1.2);   // no drift on the plate frames
    const c = F.camDrift(K.length ? F.camPath(t, K) : S.HOME(), t, Math.max(0, amt) * .5);
    const hits = [0, 1, 2, 3, 4].map((i) => F.stepHit(T, i)), cur = hits.filter((h) => t >= h).length - 1;
    const lit = cur < 0 ? [1, 1, 1, 1, 1] : [0, 1, 2, 3, 4].map((i) => (i < cur ? .6 : i === cur ? .3 + .7 * F.stepLight(T, t, i) : .3));
    S.stairsWorld(ctx, c, t, o.state ? o.state(t, T, { cur, lit }) : { lit });
    F.counter(ctx, t, T);
    const ln = T.lineAt(t);
    text(ctx, `${R.id.toUpperCase()} · WORLD STUB`, W - 80, 70, { size: 22, weight: 700, color: 'rgba(243,239,226,.55)', align: 'right', spacing: 4 });
    if (ln && t <= ln.e + .6) text(ctx, ln.text.length > 92 ? ln.text.slice(0, 90) + '…' : ln.text, W - 80, 110, { size: 26, weight: 500, color: 'rgba(243,239,226,.8)', align: 'right' });
  };
  return [{ t: R.a, draw, print: F.PRINT49 }];
}
