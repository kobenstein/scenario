// Film 8 · hierarchies as engravings (owner: B1). Other builders import, never edit. Signature is FINAL.
//
//   hierarchy(ctx, t, o) → { tiers [{ kind, y0, y1, top [x,y] }], steps [{ x, y, w }], figs [[x, y]], height, top [x, y], hands (stair) }
//     o = { kind 'stack' | 'stair' | 'legion' | 'masons' | 'factory' | 'office',
//           x, y (screen: base centre of the lowest pyramid, or the foot of the stair), s 1, seed 1, a 1 (ink strength),
//           ink '#c9c0e8' (the engraved line colour on night), fill '#151838' (stone / body tone), rim '#f3d9a0', light { x, y } (rim side),
//           dissolve 0..1   (pyramids: the figures turn into gold nodes from the top down, the steps unravel into curved gold strands,
//                            and everything settles into a flat, wide network band at the base; 1 = a flat network, no figures),
//           flat { y, w } (where the flat network lies; default: at the base, 1.6 × the pyramid width),
//           only [i…] (stack: draw only these tiers, 0 legion · 1 masons · 2 factory · 3 office),
//           // stair only (2.15: the chain of managers passing envelopes):
//           steps 9, rise 74, run 96, msgs [{ t0, dir 1 up | -1 down, from (step), hop .75, wait .3, stopAt (step), stopT }] (default: a few
//           up and down from o.seed), stall { step, t } (the envelope at that step stops: it waits in the hand, nothing passes) }
//   Pyramids (s 1): each ≈ 1300 px wide at the base, 700 px tall; 'stack' piles legion, masons' lodge, factory floors and office tower
//   upward (tier i spans y − (i+1)·780·s … y − i·780·s), so a camera can travel up through them (B3: 10.07/10.08).
import { W, H, rgba, clamp, mix, sm, eio, eout, prng } from '../engine.mjs';

const TAU = Math.PI * 2;
const eoutX = (x) => (x = clamp(x), x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
const TIER = 780;
const KINDS = ['legion', 'masons', 'factory', 'office'];

// a small engraved figure (feet at x, y; h = height px): coat, head, legs, one working arm (ang: 0 down, + forward), facing dir ±1
function mini(ctx, t, x, y, h, o = {}) {
  const k = h / 100, d = o.dir ?? 1, ink = o.ink || '#c9c0e8', fill = o.fill || '#1a1d40', b = Math.sin(t * 1.5 + (o.seed || 0)) * .8;
  ctx.save(); ctx.translate(x, y); ctx.scale(k * d, k);
  ctx.fillStyle = fill; ctx.strokeStyle = ink; ctx.lineWidth = 1.6 / k; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // legs
  ctx.beginPath(); ctx.moveTo(-5, -40); ctx.lineTo(-7, 0); ctx.moveTo(5, -40); ctx.lineTo(7 + (o.step || 0), 0); ctx.lineWidth = 7; ctx.strokeStyle = fill; ctx.stroke();
  ctx.lineWidth = 1.4 / k * 1.2; ctx.strokeStyle = ink; ctx.beginPath(); ctx.moveTo(-9, 0); ctx.lineTo(-3, 0); ctx.moveTo(4 + (o.step || 0), 0); ctx.lineTo(11 + (o.step || 0), 0); ctx.stroke();
  // coat (round shoulders)
  ctx.beginPath(); ctx.moveTo(-12, -34); ctx.bezierCurveTo(-13, -55, -12, -72, -9, -78 + b); ctx.quadraticCurveTo(0, -83 + b, 9, -78 + b); ctx.bezierCurveTo(12, -72, 13, -55, 12, -34); ctx.quadraticCurveTo(0, -31, -12, -34); ctx.closePath();
  ctx.fill(); ctx.lineWidth = 1.3 / k; ctx.stroke();
  // engraved hatching on the shadow side of the coat
  ctx.save(); ctx.clip(); ctx.strokeStyle = rgba('#000000', .45); ctx.lineWidth = .9 / k; ctx.beginPath(); for (let i = -20; i < 20; i += 3.2) { ctx.moveTo(i - 14, -30); ctx.lineTo(i - 4, -84); } ctx.stroke(); ctx.restore();
  // head
  ctx.beginPath(); ctx.arc(0, -90 + b, 8.5, 0, TAU); ctx.fill(); ctx.stroke();
  // working arm
  const a = o.arm ?? .2, ex = Math.sin(a) * 15, ey = -74 + Math.cos(a) * 15, a2 = a + (o.el ?? .3), hx = ex + Math.sin(a2) * 15, hy = ey + Math.cos(a2) * 15;
  ctx.lineWidth = 6; ctx.strokeStyle = fill; ctx.beginPath(); ctx.moveTo(4, -74 + b); ctx.lineTo(4 + ex, ey + b); ctx.lineTo(4 + hx, hy + b); ctx.stroke();
  ctx.lineWidth = 1.2 / k; ctx.strokeStyle = ink; ctx.beginPath(); ctx.moveTo(8, -74 + b); ctx.lineTo(8 + ex, ey + b); ctx.lineTo(6 + hx, hy + b); ctx.stroke();
  // rim light on the lit side
  if (o.rim) { ctx.strokeStyle = rgba(o.rim, .75 * (o.rimA ?? 1)); ctx.lineWidth = 1.8 / k; ctx.beginPath(); const sd = o.rimSide ?? 1; ctx.moveTo(10 * sd, -76 + b); ctx.bezierCurveTo(13 * sd, -66, 13 * sd, -50, 12 * sd, -36); ctx.moveTo(6 * sd, -97 + b); ctx.quadraticCurveTo(9.5 * sd, -90 + b, 6 * sd, -83 + b); ctx.stroke(); }
  if (o.prop) o.prop(ctx, [4 + hx, hy + b], k);
  ctx.restore();
  return [x + (4 + hx) * k * d, y + (hy + b) * k];
}
const PROPS = {
  legion: (ctx, hp, k) => { ctx.strokeStyle = '#d8cfa8'; ctx.lineWidth = 1.4 / k; ctx.beginPath(); ctx.moveTo(hp[0], hp[1] + 30); ctx.lineTo(hp[0], hp[1] - 70); ctx.stroke(); ctx.beginPath(); ctx.moveTo(hp[0] - 3, hp[1] - 64); ctx.lineTo(hp[0], hp[1] - 78); ctx.lineTo(hp[0] + 3, hp[1] - 64); ctx.closePath(); ctx.fillStyle = '#d8cfa8'; ctx.fill();
    ctx.fillStyle = '#2a2448'; ctx.strokeStyle = '#c9c0e8'; ctx.beginPath(); ctx.ellipse(-12, -56, 9, 18, 0, 0, TAU); ctx.fill(); ctx.stroke();               // shield
    ctx.beginPath(); ctx.moveTo(-8, -99); ctx.quadraticCurveTo(0, -112, 8, -99); ctx.stroke(); },                                                          // helmet crest
  masons: (ctx, hp, k) => { ctx.strokeStyle = '#d8cfa8'; ctx.lineWidth = 1.6 / k; ctx.beginPath(); ctx.moveTo(hp[0], hp[1]); ctx.lineTo(hp[0] + 10, hp[1] - 16); ctx.stroke(); ctx.fillStyle = '#d8cfa8'; ctx.fillRect(hp[0] + 6, hp[1] - 22, 10, 6); },
  factory: (ctx, hp, k) => { ctx.strokeStyle = '#c9c0e8'; ctx.lineWidth = 1.2 / k; ctx.beginPath(); ctx.arc(hp[0] + 14, hp[1] + 4, 10, 0, TAU); for (let i = 0; i < 8; i++) { const q = i / 8 * TAU; ctx.moveTo(hp[0] + 14 + Math.cos(q) * 10, hp[1] + 4 + Math.sin(q) * 10); ctx.lineTo(hp[0] + 14 + Math.cos(q) * 14, hp[1] + 4 + Math.sin(q) * 14); } ctx.stroke(); },
  office: (ctx, hp, k) => { ctx.fillStyle = '#e9e2cc'; ctx.fillRect(hp[0] - 2, hp[1] - 8, 12, 15); ctx.strokeStyle = '#8a8296'; ctx.lineWidth = .8 / k; ctx.beginPath(); for (let i = 0; i < 3; i++) { ctx.moveTo(hp[0], hp[1] - 4 + i * 4); ctx.lineTo(hp[0] + 8, hp[1] - 4 + i * 4); } ctx.stroke(); },
};
// rows per pyramid (bottom → top) and figure height
const ROWS = { legion: [13, 11, 9, 7, 5, 3, 1], masons: [11, 9, 7, 5, 3, 1], factory: [12, 10, 8, 6, 4, 2, 1], office: [11, 9, 7, 5, 3, 1] };

function spr(ctx, x, y, r, a, core = '#fff8e6', col = '#f3d9a0') {
  if (a <= .004 || r < .5) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(core, Math.min(1, a))); g.addColorStop(.25, rgba(col, .5 * Math.min(1, a))); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
}

// one pyramid; returns its figure positions and steps (screen)
function pyramid(ctx, t, kind, x, y, s, o, tierI = 0) {
  const rows = ROWS[kind], n = rows.length, bw = 1300 * s, th = 700 * s, rh = th / n, ink = o.ink || '#c9c0e8', fill = o.fill || '#151838', A = o.a ?? 1;
  const dis = clamp(o.dissolve ?? 0), flat = o.flat || {}, fy = flat.y ?? y - 40 * s, fw = (flat.w ?? 1300 * 1.6) * s;
  const steps = [], figs = [], r = prng((o.seed ?? 1) * 37 + tierI * 11 + 3);
  // per row: the step (a stone ledge, or a floor for factory / office) and its figures
  const nodes = [];
  for (let i = 0; i < n; i++) {
    const w = bw * (1 - i / (n + .6)), sy = y - i * rh, sx = x - w / 2;
    steps.push({ x: sx, y: sy, w });
    const rowU = clamp(dis * (n + 2) / 1.0 - (n - 1 - i) * .9) ; // the top dissolves first
    const ru = eio(clamp(rowU));
    // the step itself
    if (ru < 1) {
      ctx.save(); ctx.globalAlpha = A;
      if (kind === 'office' || kind === 'factory') {   // floor slab + window frames / columns
        ctx.fillStyle = fill; ctx.fillRect(sx, sy - rh, w, rh); ctx.strokeStyle = rgba(ink, .55 * (1 - ru)); ctx.lineWidth = 1.2; ctx.strokeRect(sx, sy - rh, w, rh);
        ctx.beginPath(); const nw = Math.max(2, Math.round(w / (kind === 'office' ? 70 * s : 120 * s))); for (let j = 1; j < nw; j++) { ctx.moveTo(sx + w * j / nw, sy - rh); ctx.lineTo(sx + w * j / nw, sy); } ctx.strokeStyle = rgba(ink, .25 * (1 - ru)); ctx.stroke();
        if (kind === 'factory') { ctx.beginPath(); for (let j = 0; j < 4; j++) { const q = sx + w * (j + .5) / 4; ctx.moveTo(q - 30 * s, sy - rh); ctx.lineTo(q, sy - rh - 14 * s); ctx.lineTo(q + 30 * s, sy - rh); } ctx.strokeStyle = rgba(ink, .4 * (1 - ru)); ctx.stroke(); }
      } else {   // a stone step with engraved hatching on its face
        const hh = 16 * s; ctx.fillStyle = fill; ctx.fillRect(sx, sy, w, hh); ctx.strokeStyle = rgba(ink, .6 * (1 - ru)); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + w, sy); ctx.stroke();
        ctx.strokeStyle = rgba('#000000', .4); ctx.lineWidth = 1; ctx.beginPath(); for (let q = sx; q < sx + w; q += 6) { ctx.moveTo(q, sy + 2); ctx.lineTo(q - 5, sy + hh); } ctx.stroke();
        if (kind === 'masons' && i < n - 1) { ctx.strokeStyle = rgba(ink, .3 * (1 - ru)); ctx.beginPath(); ctx.moveTo(sx + 10 * s, sy); ctx.lineTo(sx + 10 * s, sy - rh); ctx.moveTo(sx + w - 10 * s, sy); ctx.lineTo(sx + w - 10 * s, sy - rh); ctx.stroke(); }   // scaffold poles
      }
      ctx.restore();
    }
    // the figures of this row
    const m = rows[i], fh = (i === n - 1 ? 1.25 : 1) * Math.min(rh * .82, 92 * s);
    for (let j = 0; j < m; j++) {
      const fx = sx + w * (j + .5) / m + (r() - .5) * 6 * s, seedF = tierI * 100 + i * 13 + j, fu = clamp(ru * 1.3 - (j / Math.max(1, m)) * .3);
      const top = kind === 'office' || kind === 'factory' ? sy - 2 * s : sy;
      figs.push([fx, top - fh * .6]);
      // flat-network target for this figure: spread across a wide band at the base
      const q = (figs.length * .618 + tierI * .31) % 1, tx = x - fw / 2 + q * fw, ty = fy + (r() - .5) * 120 * s;
      nodes.push({ p0: [fx, top - fh * .55], p1: [tx, ty], u: fu, i: nodes.length });
      if (fu < .5) {
        const sc = 1 - eio(clamp(fu * 2));
        ctx.save(); ctx.globalAlpha = A;
        const dir = fx < x ? 1 : -1, arm = kind === 'legion' ? 1.1 : kind === 'masons' ? .9 + .4 * Math.sin(t * 2 + j) : kind === 'factory' ? 1.2 + .2 * Math.sin(t * 1.4 + j) : 1.3;
        mini(ctx, t, fx, top, fh * sc, { dir: i === n - 1 ? 1 : dir, ink, fill: '#1a1d40', seed: seedF, arm: i === n - 1 ? .5 : arm, el: .4, rim: o.rim || '#f3d9a0', rimSide: o.light ? (o.light.x > fx ? 1 : -1) * (i === n - 1 ? 1 : dir) : 1, rimA: .7, prop: PROPS[kind] });
        ctx.restore();
      }
    }
  }
  // the dissolve: each figure collapses into a gold node, which drifts to its place in the flat network; strands grow between neighbours
  if (dis > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    const pos = nodes.map((nd) => { const g = eio(clamp((nd.u - .3) / .7)); return nd.u <= 0 ? null : [mix(nd.p0[0], nd.p1[0], g), mix(nd.p0[1], nd.p1[1], g) - Math.sin(Math.PI * g) * 60 * s, nd.u]; });
    // strands: each node to its 2 nearest (current positions), curved, tapering
    for (let i = 0; i < pos.length; i++) {
      const p = pos[i]; if (!p) continue; const near = []; for (let j = 0; j < pos.length; j++) if (j !== i && pos[j]) near.push([Math.hypot(pos[j][0] - p[0], pos[j][1] - p[1]), j]); near.sort((a, b) => a[0] - b[0]);
      for (const [dd, j] of near.slice(0, 2)) { if (j < i && near.length) continue; const q = pos[j], gr = clamp(Math.min(p[2], q[2]) * 1.6 - .2); if (gr <= 0 || dd > 400 * s) continue;
        const mx = (p[0] + q[0]) / 2 - (q[1] - p[1]) * .2, my = (p[1] + q[1]) / 2 + (q[0] - p[0]) * .2;
        ctx.strokeStyle = rgba('#f3d9a0', .45 * gr); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.quadraticCurveTo(mx, my, mix(p[0], q[0], gr) + (mx - (p[0] + q[0]) / 2) * gr * .0, mix(p[1], q[1], gr)); ctx.stroke(); }
    }
    for (const p of pos) { if (!p) continue; const fl = Math.exp(-Math.max(0, p[2] - .2) * 4) * (p[2] > 0 ? 1 : 0); spr(ctx, p[0], p[1], (10 + 26 * fl) * Math.max(.6, s), .55 + .45 * fl); }
    ctx.restore();
  }
  return { steps, figs, top: [x, y - th - 40 * s], y0: y - th - 60 * s, y1: y };
}

// the stair: a chain of managers on a tall stair, envelopes passed hand to hand, one step per hop
function stair(ctx, t, o) {
  const s = o.s ?? 1, x = o.x ?? 400, y = o.y ?? 900, n = o.steps ?? 9, rise = (o.rise ?? 74) * s, run = (o.run ?? 96) * s, ink = o.ink || '#c9c0e8', fill = o.fill || '#151838', A = o.a ?? 1;
  const steps = [], hands = [];
  ctx.save(); ctx.globalAlpha = A;
  // the stair body: one engraved mass, hatched
  ctx.beginPath(); ctx.moveTo(x - 30 * s, y); for (let i = 0; i < n; i++) { ctx.lineTo(x + i * run, y - i * rise - rise); ctx.lineTo(x + (i + 1) * run, y - i * rise - rise); } ctx.lineTo(x + n * run, y); ctx.closePath();
  ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = rgba(ink, .6); ctx.lineWidth = 1.3; ctx.stroke();
  ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.lineWidth = 1; ctx.beginPath(); for (let q = x - 400; q < x + n * run + 400; q += 7) { ctx.moveTo(q, y); ctx.lineTo(q + 300, y - 900 * s); } ctx.stroke(); ctx.restore();
  for (let i = 0; i < n; i++) steps.push({ x: x + i * run, y: y - i * rise - rise, w: run });
  // the figures: one per step, alternately facing up (receiving from below) and down
  const H0 = 86 * s;
  steps.forEach((st, i) => { const fx = st.x + st.w * .5; hands.push([fx + 16 * s, st.y - H0 * .62]); });
  ctx.restore();
  // envelopes: default traffic from the seed
  const r = prng((o.seed ?? 1) * 7 + 1), msgs = o.msgs || (() => { const m = []; for (let k = 0; k < 6; k++) m.push({ t0: (o.t0 ?? 0) + k * 1.1 + r() * .3, dir: k % 2 ? -1 : 1, from: k % 2 ? n - 1 : 0, hop: .75, wait: .3 }); return m; })();
  const env = [];
  for (const m of msgs) {
    const hop = m.hop ?? .75, wait = m.wait ?? .3, per = hop + wait, d = t - m.t0; if (d < 0) continue;
    let k = Math.floor(d / per), q = clamp((d - k * per) / hop);
    const stopAt = o.stall && m.stall !== false && (m.stopAt ?? null) == null ? null : m.stopAt;
    let i0 = m.from + m.dir * k, i1 = i0 + m.dir;
    const lim = stopAt ?? (m.dir > 0 ? n - 1 : 0);
    if ((m.dir > 0 && i0 >= lim) || (m.dir < 0 && i0 <= lim)) { i0 = lim; i1 = lim; q = 0; }
    if (m.stopT != null && t > m.stopT) { /* stalls in the hand it is in */ const ds = m.stopT - m.t0, ks = Math.floor(ds / per), done = ds - ks * per >= hop ? 1 : 0; i0 = clamp(m.from + m.dir * (ks + done), 0, n - 1); i1 = i0; q = 0; }
    if (i1 < 0 || i1 > n - 1) { i1 = i0; q = 0; }
    const a = hands[clamp(i0, 0, n - 1)], b = hands[clamp(i1, 0, n - 1)], e = eio(q);
    env.push({ p: [mix(a[0], b[0], e), mix(a[1], b[1], e) - Math.sin(Math.PI * e) * 26 * s], from: clamp(i0, 0, n - 1), to: clamp(i1, 0, n - 1), q, stalled: m.stopT != null && t > m.stopT });
  }
  // draw figures (their arm reaches toward an envelope that is coming to them or leaving them)
  steps.forEach((st, i) => {
    const fx = st.x + st.w * .5, near = env.find((e) => (e.to === i || e.from === i) && e.q > 0 && e.q < 1), reach = near ? Math.sin(Math.PI * near.q) : 0;
    const dir = near ? (near.to === i ? (near.from < i ? -1 : 1) : (near.to > i ? 1 : -1)) : (i % 2 ? -1 : 1);
    const holding = env.some((e) => e.q === 0 && e.from === i);
    mini(ctx, t, fx, st.y, H0, { dir, ink, fill: '#1a1d40', seed: i * 3, arm: .25 + 1.2 * reach + (holding ? .9 : 0), el: .3, rim: o.rim || '#f3d9a0', rimSide: dir, rimA: .6 });
  });
  for (const e of env) envelope(ctx, e.p[0], e.p[1], 1.3 * s, e.stalled ? '#e8b4a0' : '#efe4c6');
  return { steps, hands, figs: steps.map((st) => [st.x + st.w * .5, st.y - H0 * .6]), top: [x + n * run, y - n * rise - H0], height: n * rise + H0, tiers: [] };
}
function envelope(ctx, x, y, k, col) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = col; ctx.strokeStyle = '#3a3040'; ctx.lineWidth = 1 / k;
  ctx.beginPath(); ctx.rect(-9, -6, 18, 12); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-9, -6); ctx.lineTo(0, 1); ctx.lineTo(9, -6); ctx.stroke(); ctx.restore();
}

export function hierarchy(ctx, t, o = {}) {
  const kind = o.kind || 'stack', s = o.s ?? 1, x = o.x ?? W / 2, y = o.y ?? H - 120;
  if (kind === 'stair') return stair(ctx, t, o);
  if (kind !== 'stack') { const p = pyramid(ctx, t, kind, x, y, s, o, KINDS.indexOf(kind)); return { tiers: [{ kind, y0: p.y0, y1: p.y1, top: p.top }], steps: p.steps, figs: p.figs, height: p.y1 - p.y0, top: p.top }; }
  const tiers = [], steps = [], figs = [];
  KINDS.forEach((k, i) => {
    const by = y - i * TIER * s;
    if (o.only && !o.only.includes(i)) { tiers.push({ kind: k, y0: by - 700 * s, y1: by, top: [x, by - 700 * s] }); return; }
    if (by - 760 * s > H + 50 || by < -60) { tiers.push({ kind: k, y0: by - 700 * s, y1: by, top: [x, by - 700 * s] }); return; }   // off screen
    const p = pyramid(ctx, t, k, x, by, s, { ...o, flat: o.flat || { y: by - 40 * s } }, i);
    tiers.push({ kind: k, y0: p.y0, y1: p.y1, top: p.top }); steps.push(...p.steps); figs.push(...p.figs);
  });
  return { tiers, steps, figs, height: KINDS.length * TIER * s, top: [x, y - KINDS.length * TIER * s] };
}
