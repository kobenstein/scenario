// Film 4 v2 · the Maslow hill: ONE shared, zoomable world (an engraved terraced hill town by the water, labelled like an old print).
// Jakob 2026-10-19: Maslow must be in the picture, clearly labelled ("sonst Ägypten"), the hill-town (K2) shape, houses you can fly into,
// only 3–4 appearances: H1 (c05 end/c06 start, base lights), H2 (c09 end/c10 start, belonging), H3 (c11, esteem + self-actualization),
// H4 (c14 end/c15 start, the summit). Builders draw it ONLY through this file, so all appearances are the same place.
//
// WORLD = screen space of the canonical full view: cam { x: 960, y: 540, z: 1 } shows the whole hill (1920×1080).
//   screen = (world - cam.xy) * cam.z + (960, 540).  toScreen(cam, x, y) / toWorld(cam, sx, sy) / camAt(a, b, u) (eased mix).
// GEOMETRY (fixed; the look may improve, these numbers may not change):
//   HILL.horizon = 792 (the quay / water line; the reflection is below it)
//   HILL.levels[i] = { key, label, y0 (bottom), y1 (top), hw0 (half-width at y0), hw1 (half-width at y1) }, centred on x = 960
//     0 safety  'Physiological · Safety'  792 → 652     1 belonging 'Belonging'  652 → 526     2 esteem 'Esteem'  526 → 414
//     3 self    'Self-actualization'      414 → 312     4 trans     'Self-transcendence'  312 → 214 (the summit plateau; the peak at y 196)
//   hillWindows(level) → [{ id, x, y, w, h, house }] world rects of every window on that level (deterministic)
//   hillWindow(level, id) → one window: id = number, or a named one: 'you' (level 0, your flat), 'family' (level 1), 'street' (level 2)
//   HILL.summit = { x: 960, y: 196 } the top; HILL.standY = 214 (where figures stand on the summit plateau)
// STATE st (all optional, numbers 0..1 unless said):
//   night (0 dusk … 1 deep night) · lit[5] (each level's windows lit, from the centre outward) · screens (level 0 windows flicker cyan:
//   the slump) · labels · title · focus (level index, -1 none) + focusU (its label grows from 34 to 58 px) · people (small figures on the
//   quay and terraces, standing, never walking) · summitFigs (figures on the summit) · sweep { level, u } (a light runs left→right along a
//   level) · inside { level, id, draw(ctx, sx, sy, sw, sh, t) } (you draw what is seen through that window, in screen space; use it for
//   push-ins: when the window covers the frame your scene IS the frame)
// drawHill(ctx, t, cam, st) draws the full frame (sky, far hills, water + reflection, hill, houses, windows, people, labels, title).
// VIEWS: the fixed views used as handoff plates (lib/handoff4.mjs): H1, H2, H4. Never change them without the lead.
import { W, H, C, rgba, clamp, lin, mix, sm, eio, prng, drift, text } from '../engine.mjs';

const TAU = Math.PI * 2;
export const HILL = {
  horizon: 792, cx: 960, summit: { x: 960, y: 196 }, standY: 214, labelX: 1440,
  title: "Maslow's hierarchy of needs",
  levels: [
    { key: 'safety', label: 'Physiological · Safety', y0: 792, y1: 652, hw0: 700, hw1: 574 },
    { key: 'belonging', label: 'Belonging', y0: 652, y1: 526, hw0: 548, hw1: 436 },
    { key: 'esteem', label: 'Esteem', y0: 526, y1: 414, hw0: 410, hw1: 316 },
    { key: 'self', label: 'Self-actualization', y0: 414, y1: 312, hw0: 290, hw1: 206 },
    { key: 'trans', label: 'Self-transcendence', y0: 312, y1: 214, hw0: 180, hw1: 90 },
  ],
};
export const toScreen = (cam, x, y) => [(x - cam.x) * cam.z + W / 2, (y - cam.y) * cam.z + H / 2];
export const toWorld = (cam, sx, sy) => [(sx - W / 2) / cam.z + cam.x, (sy - H / 2) / cam.z + cam.y];
// zoom eases in log space so push-ins feel even; x/y follow so that the zoom centre moves smoothly
export const camAt = (a, b, u) => { const e = eio(clamp(u)); return { x: mix(a.x, b.x, e), y: mix(a.y, b.y, e), z: Math.exp(mix(Math.log(a.z), Math.log(b.z), e)) }; };
export const hwAt = (lv, y) => { const L = HILL.levels[lv]; return mix(L.hw0, L.hw1, (L.y0 - y) / (L.y0 - L.y1)); };

// ---------------------------------------------------------------- houses and windows (deterministic per level)
const HOUSES = HILL.levels.map((L, lv) => {
  const r = prng(100 + lv * 17), out = []; const rows = lv === 0 ? 2 : lv < 3 ? 2 : 1;
  for (let row = 0; row < rows; row++) {
    const yb = mix(L.y0, L.y1, row ? .55 : .06) - 2, hw = hwAt(lv, yb) - 26; let x = HILL.cx - hw;
    while (x < HILL.cx + hw - 30) {
      const w = (lv === 0 ? 44 : lv < 3 ? 38 : 32) + r() * 26, h = (lv === 0 ? 46 : 36) + r() * (lv === 0 ? 30 : 18) - row * 6;
      if (x + w > HILL.cx + hw) break;
      out.push({ x, yb, w, h, roof: r() < .55 ? 'gable' : 'flat', seed: Math.floor(r() * 1e6), row });
      x += w + 3 + r() * 8;
    }
  }
  return out;
});
const WINDOWS = HOUSES.map((hs, lv) => {
  const out = []; let id = 0;
  for (const h of hs) {
    const r = prng(h.seed), cols = Math.max(1, Math.floor(h.w / 15)), rows = Math.max(1, Math.floor((h.h - 10) / 17));
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      if (r() < .18) continue;
      const ww = 6, wh = 9, x = h.x + (i + .5) * h.w / cols - ww / 2, y = h.yb - h.h + 8 + j * 17;
      out.push({ id: id++, x, y, w: ww, h: wh, house: h, ph: r() * TAU, k: r() });
    }
  }
  // distance from the centre decides the lighting order (centre outward)
  for (const w of out) w.d = Math.abs(w.x + w.w / 2 - HILL.cx) / (hwAt(lv, w.y) || 1);
  return out;
});
const NAMED = { you: [0, .58, 1], family: [1, .42, 0], street: [2, .5, 0] };   // level, x-fraction across the level, row
export function hillWindows(lv) { return WINDOWS[lv]; }
export function hillWindow(lv, id) {
  if (typeof id === 'number') return WINDOWS[lv][((id % WINDOWS[lv].length) + WINDOWS[lv].length) % WINDOWS[lv].length];
  const [l2, fx, row] = NAMED[id] || [lv, .5, 0], L = HILL.levels[l2], xs = HILL.cx - hwAt(l2, L.y0) + fx * 2 * hwAt(l2, L.y0);
  let best = null, bd = 1e9; for (const w of WINDOWS[l2]) { if (w.house.row !== row) continue; const d = Math.abs(w.x - xs) + (w.y < w.house.yb - w.house.h + 20 ? 0 : 4); if (d < bd) { bd = d; best = w; } }
  return best;
}

// ---------------------------------------------------------------- the views used as plates (handoff4)
export const VIEWS = {
  H1: { cam: { x: 960, y: 520, z: 1 }, st: { night: .3, lit: [1, 0, 0, 0, 0], labels: 1, title: 1, focus: 0, focusU: .35, people: 1 } },
  H2: { cam: { x: 960, y: 540, z: 1.04 }, st: { night: .75, lit: [1, 0, 0, 0, 0], labels: 1, title: 0, focus: 1, focusU: 0, people: .6 } },
  H4: { cam: { x: 960, y: 292, z: 2.1 }, st: { night: 1, lit: [1, 1, 1, 1, 0], labels: 1, title: 0, focus: 4, focusU: 1, people: .3, summitFigs: 0 } },
};

// ---------------------------------------------------------------- drawing
const SKYC = (n) => [mixC('#1d1a4a', '#04050f', n), mixC('#3b2f6e', '#0b0f2a', n), mixC('#e6927e', '#1a1840', n)];
function mixC(a, b, u) { const p = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)], A = p(a), B = p(b); return `rgb(${A.map((v, i) => Math.round(mix(v, B[i], u))).join(',')})`; }
const STARS = (() => { const r = prng(7); const s = []; for (let i = 0; i < 260; i++) s.push([r() * 3000 - 540, r() * 900 - 200, .5 + r() * 1.2, r() * TAU]); return s; })();

export function drawHill(ctx, t, cam, st = {}) {
  const n = st.night ?? .5, lit = st.lit || [0, 0, 0, 0, 0], z = cam.z, S = (x, y) => toScreen(cam, x, y);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  // sky (screen space gradient, the horizon follows the camera)
  const [, hy] = S(0, HILL.horizon), [s0, s1, s2] = SKYC(n);
  const g = ctx.createLinearGradient(0, hy - 900 * Math.min(z, 2), 0, hy); g.addColorStop(0, s0); g.addColorStop(.6, s1); g.addColorStop(1, s2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  for (const [x, y, s, ph] of STARS) { const [X, Y] = S(x + t * 1.5, y); if (X < -5 || X > W + 5 || Y < -5 || Y > hy - 30) continue; const a = n * (.4 + .4 * Math.sin(t * 1.3 + ph)); if (a <= .02) continue; ctx.fillStyle = `rgba(243,239,226,${a})`; ctx.fillRect(X, Y, s, s); }
  // world transform
  ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-cam.x, -cam.y);
  // far hills
  for (const [k, col, amp, base] of [[0, mixC('#4a3b6e', '#141436', n), 60, HILL.horizon - 40], [1, mixC('#2e2650', '#0d0f2a', n), 34, HILL.horizon - 12]]) {
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-600, HILL.horizon); for (let x = -600; x <= 2600; x += 40) ctx.lineTo(x, base - amp * (.5 + .5 * Math.sin(x * .004 + k * 2) * Math.sin(x * .0017 + 1 + k))); ctx.lineTo(2600, HILL.horizon); ctx.fill();
  }
  // water
  const wg = ctx.createLinearGradient(0, HILL.horizon, 0, HILL.horizon + 400); wg.addColorStop(0, mixC('#2a2350', '#0a0c22', n)); wg.addColorStop(1, mixC('#141238', '#05060f', n));
  ctx.fillStyle = wg; ctx.fillRect(-1200, HILL.horizon, 4400, 1400);
  // reflection: the hill mirrored, darker, broken by ripples
  ctx.save(); ctx.beginPath(); ctx.rect(-1200, HILL.horizon, 4400, 600); ctx.clip(); ctx.translate(0, HILL.horizon * 2); ctx.scale(1, -1); ctx.globalAlpha = .35; body(ctx, t, n, lit, st, true); ctx.restore();
  ctx.strokeStyle = rgba('#a8a0d8', .12); ctx.lineWidth = 1 / z; ctx.beginPath(); for (let k = 0; k < 26; k++) { const y = HILL.horizon + 8 + k * k * .9, x0 = 400 + 120 * Math.sin(k * 1.7 + t * .3); ctx.moveTo(x0, y); ctx.lineTo(x0 + 900 + 200 * Math.sin(k), y); } ctx.stroke();
  // the hill itself
  body(ctx, t, n, lit, st, false);
  // people on the quay (standing, breathing), never walking
  if ((st.people ?? 0) > 0) { const r = prng(9); ctx.fillStyle = rgba('#0a0c1e', .9 * st.people); for (let i = 0; i < 14; i++) { const x = 360 + r() * 1200, s = .9 + r() * .3, b = Math.sin(t * 1.4 + i) * .4; ctx.beginPath(); ctx.ellipse(x, HILL.horizon - 13 * s + b * .2, 2.6 * s, 3 * s, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(x - 3 * s, HILL.horizon - 10 * s + b * .2, 6 * s, 10 * s - b * .2, 2); ctx.fill(); } }
  if ((st.summitFigs ?? 0) > 0) { ctx.fillStyle = rgba('#0a0c1e', st.summitFigs); for (const dx of [-22, 4, 26]) { const x = HILL.summit.x + dx, y = HILL.standY; ctx.beginPath(); ctx.ellipse(x, y - 13, 2.6, 3, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(x - 3, y - 10, 6, 10, 2); ctx.fill(); } }
  ctx.restore();
  labels(ctx, t, cam, st);
}

function body(ctx, t, n, lit, st, refl) {
  const L = HILL.levels;
  for (let lv = 0; lv < 5; lv++) {
    const l = L[lv], y0 = l.y0, y1 = l.y1, a0 = l.hw0, a1 = l.hw1;
    // the terrace mass (earth and stone), lit from the left a little
    const g = ctx.createLinearGradient(HILL.cx - a0, 0, HILL.cx + a0, 0);
    g.addColorStop(0, mixC('#4b3d6a', '#1a1838', n)); g.addColorStop(.5, mixC('#3a2f58', '#141230', n)); g.addColorStop(1, mixC('#2a2346', '#0e0d24', n));
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(HILL.cx - a0, y0); ctx.lineTo(HILL.cx - a1, y1); ctx.lineTo(HILL.cx + a1, y1); ctx.lineTo(HILL.cx + a0, y0); ctx.closePath(); ctx.fill();
    // retaining wall at the top edge (the ledge the next level stands on)
    ctx.fillStyle = mixC('#6b5a86', '#2a2650', n); ctx.fillRect(HILL.cx - a1 - 6, y1 - 5, (a1 + 6) * 2, 7);
    // engraving: horizontal courses on the wall face
    ctx.strokeStyle = rgba('#0b0a1c', .25); ctx.lineWidth = .8; ctx.beginPath(); for (let y = y1 + 10; y < y0; y += 9) { const hw = mix(a1, a0, (y - y1) / (y0 - y1)); ctx.moveTo(HILL.cx - hw + 4, y); ctx.lineTo(HILL.cx + hw - 4, y); } ctx.stroke();
    // houses
    for (const h of HOUSES[lv]) {
      ctx.fillStyle = mixC(h.row ? '#2c2448' : '#352b54', h.row ? '#0d0c22' : '#121030', n);
      ctx.beginPath(); ctx.moveTo(h.x, h.yb); ctx.lineTo(h.x, h.yb - h.h); if (h.roof === 'gable') ctx.lineTo(h.x + h.w / 2, h.yb - h.h - h.w * .35); ctx.lineTo(h.x + h.w, h.yb - h.h); ctx.lineTo(h.x + h.w, h.yb); ctx.closePath(); ctx.fill();
    }
    // windows
    const L1 = lit[lv] ?? 0, scr = lv === 0 ? (st.screens ?? 0) : 0, sweep = st.sweep && st.sweep.level === lv ? st.sweep.u : null;
    for (const w of WINDOWS[lv]) {
      let on = sm(clamp((L1 * 1.25 - w.d) / .25));
      if (sweep != null) { const xs = (w.x - (HILL.cx - l.hw0)) / (2 * l.hw0); on = Math.max(on, sm(clamp((sweep * 1.2 - xs) / .2))); }
      const inside = st.inside && st.inside.level === lv && st.inside.id === w.id;
      if (inside && !refl) { insideWindow(ctx, t, w, st.inside); continue; }
      let col;
      if (scr > 0 && w.k < .85) { const f = .65 + .35 * Math.sin(t * (5 + w.k * 7) + w.ph) * Math.sin(t * 2.3 + w.ph * 2); col = mixC(mixC('#2a2348', '#ffcf8a', on), mixC('#5fb8d8', '#d8f7ff', f), scr); }
      else col = mixC(mixC('#2a2348', '#151330', n), '#ffcf8a', on * (.85 + .15 * Math.sin(t * .7 + w.ph)));
      ctx.fillStyle = col; ctx.fillRect(w.x, w.y, w.w, w.h);
      if (on > .3 && !refl) { ctx.fillStyle = rgba(scr > .5 ? '#8fe6ff' : '#ffb35c', .14 * on); ctx.beginPath(); ctx.arc(w.x + w.w / 2, w.y + w.h / 2, 9, 0, TAU); ctx.fill(); }
    }
  }
  // the peak above the summit plateau
  ctx.fillStyle = mixC('#3a2f58', '#141230', n); ctx.beginPath(); ctx.moveTo(HILL.cx - 90, 214); ctx.quadraticCurveTo(HILL.cx - 20, 190, HILL.cx, HILL.summit.y); ctx.quadraticCurveTo(HILL.cx + 20, 190, HILL.cx + 90, 214); ctx.fill();
}
function insideWindow(ctx, t, w, ins) {
  // the builder's scene through the window, in screen space (so a push-in ends exactly on their frame)
  const m = ctx.getTransform(), sx = m.a * w.x + m.e, sy = m.d * w.y + m.f, sw = m.a * w.w, sh = m.d * w.h;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(sx, sy, sw, sh); ctx.clip(); ins.draw(ctx, sx, sy, sw, sh, t); ctx.restore();
}
function labels(ctx, t, cam, st) {
  const la = st.labels ?? 0; if (la <= 0 && !(st.title > 0)) return;
  const fade = 1 - sm(lin(2.2, 3.2, cam.z));
  HILL.levels.forEach((L, lv) => {
    const ym = (L.y0 + L.y1) / 2, [fx, fy] = toScreen(cam, HILL.cx + hwAt(lv, ym), ym), focus = st.focus === lv;
    const a = la * (focus ? 1 : fade); if (a <= .01 || fy < 40 || fy > H - 180) return;
    const on = (st.lit?.[lv] ?? 0) > .5, size = focus ? mix(34, 58, sm(st.focusU ?? 0)) : 34;
    ctx.strokeStyle = rgba(on ? '#ffb35c' : '#a49fc4', .55 * a); ctx.lineWidth = 1.2; ctx.setLineDash([2, 6]); ctx.beginPath(); ctx.moveTo(fx + 10, fy); ctx.lineTo(HILL.labelX - 24, fy); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, L.label, HILL.labelX, fy + size * .32, { size, font: 'Instrument Serif', color: on ? '#f3efe2' : '#a49fc4', alpha: a });
  });
  if ((st.title ?? 0) > 0) { const a = st.title * fade; text(ctx, HILL.title.toUpperCase(), HILL.labelX, 96, { size: 17, weight: 600, color: '#a49fc4', alpha: a, spacing: 5 }); ctx.fillStyle = rgba('#a49fc4', .6 * a); ctx.fillRect(HILL.labelX, 70, 30 * st.title, 2); }
}
