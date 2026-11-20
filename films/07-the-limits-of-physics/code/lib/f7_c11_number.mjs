// Film 7 · c11 · the number, enough, a share (06d + 06e): the orbit-world pieces. Builder: c11. Pure functions of t, deterministic (prng only).
// The world is c07's lens world (lib/f7_c11_fork.mjs, a 1:1 copy of f7_c07_fork.mjs): we stand at the dark table on the stage at dusk and look
// up; ONE Earth (the ring Earth) hangs in the dusk sky at SP.C. Every Earth piece below is drawn in kit world units through m = camO(localCam(lens, E)).
//
//   POINTS / points(ctx, t, m, st)      "ten billion points of light": ~6200 tiny warm points on the land of the whole disc, born in a wave
//                                       from six seed cities (st: { born 0..1 (wave front), a 1, wave (t of a brightening wave) , dim 0..1 })
//   GAUGE / gauge(ctx, t, st)           the energy gauge (screen space): an engraved glass tube with ticks, an amber light column (today's world
//                                       energy = 100 %), it drops below the 40 % mark. st: { draw 0..1, fill 0..1 (level), mark 0..1, half 0..1, out 0..1 }
//   slip(ctx, t, x, y, s, rot, flipX, flipY, side)  card IV's "?" note (c08's slipOn, same paper and tape) as a free object: front "?", back "< 40 %"
//   ringHalves(ctx, t, m, st)           the ring opened into two halves: the upper one carries engraved technology (solar, turbine, train, clinic,
//                                       pylon, library), the lower one the word ENOUGH; they close (st: { sep px, tech(i) 0..1, enough 0..1, flash 0..1, a })
//   arcText(ctx, s, cx, cy, rr, thC, o) text set along an arc (top: letters upright, tops outward; bottom: tops inward), mask reveal left → right
//   BEADS / beads(ctx, t, m, st)        the countries: beads that rise from the land and stop below the floor or shoot past the ceiling
//   band(ctx, t, m, st)                 the ring opened wide as a diagram: floor (warm inner edge) and ceiling (soft outer edge) + labels
//   site(ctx, t, m, st)                 the empty building site in the band: scaffold towers, a crane, ONE work lamp
//   shareRing(ctx, t, m, st)            the ring split into equal shares, each held by a thread from its own point of light (or by a few owners)
//   dawnPlate(ctx, t, A) / dawnCover(ctx, t, k, cx, cy)   handoff4's 'light' plate (tone dawn) copied 1:1; the light grows over the frame (k 1 → plate)
//   label(ctx, t, big, small, x, y, t0, t1, o)  big Instrument Serif value + small Inter caps source, wipe in / out (c06's label)
import { W, H, rgba, clamp, lin, mix, sm, prng, drift, text } from '../engine.mjs';
import { vnoise, fbm } from './art.mjs';
import { F7, EARTH, CURVE, onSphere, curve, glowAt, ease, mod, ring as kitRing } from './f7_kit.mjs';

const TAU = Math.PI * 2;
const bump = (t, a, b, c, d) => sm(lin(a, b, t)) * (1 - sm(lin(c, d, t)));
export const RING_R = EARTH.R * 1.045;

// ---------------------------------------------------------------- the Earth's land model (kit's, same seeds → same coasts)
const RC = Math.cos(EARTH.tilt), RS = Math.sin(EARTH.tilt);
const latlon = (nx, ny, nz) => [Math.atan2(nx, ny * RS + nz * RC), Math.asin(clamp(ny * RC - nz * RS, -1, 1))];
const gauss = (x, y, cx, cy, r) => Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (r * r));
const NL = vnoise(101); vnoise(202); vnoise(303); const NT = vnoise(404);
export function landAt(x, y) {
  const v = onSphere(x, y); if (!v) return -1;
  const [lon, lat] = latlon(...v);
  let f = fbm(NL, lon * 2.1 + 7.3, lat * 3.0 + 2.2, 5) - .5;
  f += .32 * gauss(x, y, CURVE.S[0], CURVE.S[1], 520) + .12 * gauss(x, y, -600, -2950, 500) - .3 * gauss(x, y, 780, -2860, 420) - .18 * gauss(x, y, 1250, -2700, 380);
  return f;
}

// ---------------------------------------------------------------- ten billion points of light
// seeds: the hero city and five more big lights; the wave of new lights spreads from them over all the land
export const SEEDS = [[CURVE.S[0], CURVE.S[1]], [-1500, -2100], [1300, -1900], [-400, -900], [900, -300], [-1900, 300]];
export const POINTS = (() => {
  const r = prng(1111), out = [];
  for (let i = 0; i < 90000 && out.length < 9000; i++) {
    const a = r() * TAU, d = Math.sqrt(r()) * EARTH.R * .985, x = Math.cos(a) * d, y = Math.sin(a) * d, v = onSphere(x, y); if (!v || v[2] < .06) continue;
    const f = landAt(x, y); if (f < .0) continue;
    const de = SEEDS.reduce((m, s) => Math.min(m, Math.hypot(x - s[0], y - s[1])), 1e9) / 3200;
    out.push({ x, y, d: clamp(de + .12 * (r() - .5)), b: Math.floor(r() * 6), ph: r() * TAU, s: .8 + r() * r() * 1.4, f: .5 + r() * 1.5 });
  }
  return out;
})();
// the point closest to a world location (for the dive / the return)
export function pointNear(x, y) { let best = POINTS[0], bd = 1e9; for (const p of POINTS) { const d = Math.hypot(p.x - x, p.y - y); if (d < bd) { bd = d; best = p; } } return best; }
// st: { born 0..1 (front of the wave, in units of seed distance), a 1, waveT (t of a brightening wave from the seeds), dim 0..1, sc (dot scale) }
export function points(ctx, t, m, st = {}) {
  const born = st.born ?? 1, A = (st.a ?? 1) * (1 - .82 * (st.dim ?? 0)); if (born <= 0 || A <= 0) return;
  const k = m.k, sc = (st.sc ?? 1) * clamp(1.6 * Math.sqrt(k / .12), 1.3, 3.2), R = EARTH.R * k, cx = m.X(0), cy = m.Y(0);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  // per twinkle bucket one fill style
  const lv = []; for (let b = 0; b < 6; b++) lv.push(.55 + .45 * Math.sin(t * (.9 + b * .37) + b * 1.7));
  const wv = st.waveT != null ? t - st.waveT : -9;
  const pop = [];
  for (let b = 0; b < 6; b++) {
    ctx.fillStyle = rgba('#ffd9a0', clamp(.85 * lv[b] * A));
    for (const p of POINTS) {
      if (p.b !== b || p.d > born) continue;
      const X = cx + p.x * k, Y = cy + p.y * k; if (X < -4 || X > W + 4 || Y < -4 || Y > H + 4) continue;
      const age = (born - p.d) * 6;              // ~ seconds-ish after birth in wave units
      if (age < 1) pop.push([X, Y, age, p.s]);
      const s = p.s * sc; ctx.fillRect(X - s / 2, Y - s / 2, s, s);
    }
  }
  // a soft halo around every fourth light (they read as lights, not dust)
  ctx.fillStyle = rgba('#ffb35c', clamp(.15 * A));
  for (let i = 0; i < POINTS.length; i += 5) { const p = POINTS[i]; if (p.d > born) continue; const X = cx + p.x * k, Y = cy + p.y * k; if (X < -9 || X > W + 9 || Y < -9 || Y > H + 9) continue; const s = p.s * sc * 3.2; ctx.beginPath(); ctx.arc(X, Y, s, 0, TAU); ctx.fill(); }
  // the moment of birth: a small bright pop (cause: the wave front passes)
  for (const [X, Y, age, s] of pop) { const q = 1 - age; ctx.fillStyle = rgba('#fff6e0', .7 * q * A); const ss = s * sc * (1 + 2.2 * q); ctx.fillRect(X - ss / 2, Y - ss / 2, ss, ss); }
  // the brightening wave ("for everyone"): a ring of light running out from the seeds over the points
  if (wv > 0 && wv < 1.6) {
    const front = wv / 1.2;
    ctx.fillStyle = rgba('#fff1d6', .55 * A);
    for (const p of POINTS) { const dd = Math.abs(p.d - front); if (dd > .08 || p.d > born) continue; const X = cx + p.x * k, Y = cy + p.y * k; const s = p.s * sc * (2.6 - dd * 20); ctx.fillRect(X - s / 2, Y - s / 2, s, s); }
  }
  ctx.restore();
  return { cx, cy, R };
}

// ---------------------------------------------------------------- the gauge (screen space)
export const GAUGE = { x: 1372, y0: 818, y1: 262, w: 30 };
export const gaugeY = (u) => mix(GAUGE.y0, GAUGE.y1, u);
// st: { draw 0..1 (the tube draws itself bottom → top), fill 0..1 (level), mark 0..1 (the red 40 % line), half 0..1 (the 50 % tick glints), out 0..1 (erase top → down) }
export function gauge(ctx, t, st) {
  const dr = st.draw ?? 0, out = st.out ?? 0; if (dr <= 0 || out >= 1) return;
  const { x, y0, y1, w } = GAUGE, top = mix(y0, y1 - 14, ease.out(dr)), cut = mix(y1 - 30, y0 + 20, ease.inn(out));   // visible part: y ≥ cut
  const yTop = Math.max(top, cut);
  ctx.save(); ctx.lineCap = 'round';
  // the glass tube: dark glass, a cool rim, an inner highlight
  const g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0); g.addColorStop(0, 'rgba(20,26,60,.85)'); g.addColorStop(.5, 'rgba(10,14,40,.7)'); g.addColorStop(1, 'rgba(26,30,70,.85)');
  ctx.fillStyle = g; ctx.fillRect(x - w / 2, yTop, w, y0 - yTop);
  // the light column (amber, today's world energy) and its glow
  const lev = clamp(st.fill ?? 0), yF = Math.max(yTop, gaugeY(lev));
  if (lev > 0 && yF < y0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const fg = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0); fg.addColorStop(0, rgba('#e0782e', .75)); fg.addColorStop(.45, rgba('#ffd9a0', .95)); fg.addColorStop(.6, rgba('#fff1d6', .95)); fg.addColorStop(1, rgba('#ff9a40', .7));
    ctx.fillStyle = fg; ctx.fillRect(x - w / 2 + 4, yF, w - 8, y0 - 4 - yF);
    const hg = ctx.createLinearGradient(x - 70, 0, x + 70, 0); hg.addColorStop(0, rgba(F7.amber, 0)); hg.addColorStop(.5, rgba(F7.amber, .16)); hg.addColorStop(1, rgba(F7.amber, 0));
    ctx.fillStyle = hg; ctx.fillRect(x - 70, yF, 140, y0 - yF);
    // the surface: a hot meniscus with heat shimmer above it
    glowAt(ctx, x, yF, 46, .55, F7.amber, F7.amberCore);
    ctx.strokeStyle = rgba('#ffcf96', .3); ctx.lineWidth = 1; ctx.beginPath();
    for (let q = 0; q <= 12; q++) { const xx = x - w / 2 + 4 + (w - 8) * q / 12; ctx[q ? 'lineTo' : 'moveTo'](xx, yF - 6 - 2.2 * Math.sin(q * 1.1 + t * 7)); } ctx.stroke();
    ctx.restore();
  }
  // the rim lines (engraved glass)
  ctx.strokeStyle = rgba('#cfe6ff', .55); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x - w / 2, y0); ctx.lineTo(x - w / 2, yTop); ctx.moveTo(x + w / 2, y0); ctx.lineTo(x + w / 2, yTop); ctx.stroke();
  ctx.strokeStyle = rgba('#eef8ff', .3); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - w / 2 + 5, y0 - 6); ctx.lineTo(x - w / 2 + 5, yTop + 6); ctx.stroke();
  ctx.strokeStyle = rgba('#cfe6ff', .55); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x - w / 2 - 8, y0); ctx.lineTo(x + w / 2 + 8, y0); ctx.stroke();
  if (top <= y1 - 13 && cut <= y1 - 13) { ctx.beginPath(); ctx.moveTo(x - w / 2, y1 - 14); ctx.quadraticCurveTo(x, y1 - 30, x + w / 2, y1 - 14); ctx.stroke(); }
  // ticks every 10 %, long at 50 and 100, their numbers
  for (let k = 1; k <= 10; k++) {
    const yy = gaugeY(k / 10); if (yy < yTop) continue;
    const big = k === 5 || k === 10, hl = k === 5 ? (st.half ?? 0) : 0;
    ctx.strokeStyle = rgba(hl > 0 ? '#fff1d6' : '#cfe6ff', (big ? .75 : .45) + .25 * hl); ctx.lineWidth = big ? 1.6 : 1.1;
    ctx.beginPath(); ctx.moveTo(x - w / 2 - (big ? 24 : 12), yy); ctx.lineTo(x - w / 2 - 3, yy); ctx.stroke();
    if (big) text(ctx, k === 10 ? '100 %' : '50 %', x - w / 2 - 32, yy + 7, { size: 20, weight: 600, color: rgba(hl > 0 ? '#fff1d6' : '#cfd6ee', .8 + .2 * hl), align: 'right', spacing: 2 });
    if (hl > 0) glowAt(ctx, x - w / 2 - 14, yy, 40, .5 * hl, '#ffd9a0', '#ffffff');
  }
  // the 40 % mark: a red inked line across the tube to the slip
  const mk = st.mark ?? 0;
  if (mk > 0) { const yy = gaugeY(.4); if (yy >= yTop) { ctx.strokeStyle = rgba(F7.stamp, .95); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - w / 2 - 14, yy); ctx.lineTo(x - w / 2 - 14 + (w + 44) * ease.out(mk), yy); ctx.stroke(); } }
  ctx.restore();
}

// ---------------------------------------------------------------- the slip ("?" over the number; c08's slipOn, both sides)
const SLIP = (() => {
  const r = prng(4040), pts = [], sw = 330, sh = 238;
  for (let i = 0; i <= 24; i++) pts.push([-sw / 2 + sw * i / 24, -sh / 2 + (r() - .5) * 2]);
  for (let i = 1; i <= 10; i++) pts.push([sw / 2 + (r() - .5) * 2.4, -sh / 2 + sh * i / 10]);
  for (let i = 1; i <= 24; i++) pts.push([sw / 2 - sw * i / 24, sh / 2 + (r() - .5) * 7]);
  for (let i = 1; i < 10; i++) pts.push([-sw / 2 + (r() - .5) * 2.4, sh / 2 - sh * i / 10]);
  return { pts, sw, sh };
})();
// x, y centre (screen), s scale (1 → 330 × 238 px), rot, fx/fy ∈ [-1, 1] the foreshortening of a 3D turn (cos), side 'front' | 'back'
export function slip(ctx, t, x, y, s, rot, fx, fy, side, o = {}) {
  if (s <= 0) return;
  const { pts, sw, sh } = SLIP;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  // the soft shadow it throws on the sky glow (a dark veil offset down-right)
  ctx.save(); ctx.scale(s * Math.abs(fx), s * Math.abs(fy)); ctx.fillStyle = `rgba(4,6,20,${.28 * (o.shadow ?? 1)})`; ctx.beginPath(); pts.forEach(([px, py], i) => (i ? ctx.lineTo(px + 10, py + 14) : ctx.moveTo(px + 10, py + 14))); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.scale(s * fx, s * fy);
  ctx.beginPath(); pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.closePath();
  const lit = o.lit ?? 1, gr = ctx.createLinearGradient(-sw / 2, -sh / 2, sw / 2, sh / 2);
  gr.addColorStop(0, side === 'front' ? '#fbf5e6' : '#f6eedb'); gr.addColorStop(1, side === 'front' ? '#ece0c4' : '#e6d8b8'); ctx.fillStyle = gr; ctx.fill();
  ctx.strokeStyle = rgba(F7.ink, .18); ctx.lineWidth = 1 / Math.max(.2, s); ctx.stroke();
  ctx.save(); ctx.clip();
  ctx.strokeStyle = 'rgba(120,140,170,.18)'; ctx.lineWidth = 1 / Math.max(.2, s); ctx.beginPath(); for (let yy = -sh / 2 + 34; yy < sh / 2 - 8; yy += 26) { ctx.moveTo(-sw / 2 + 8, yy); ctx.lineTo(sw / 2 - 8, yy); } ctx.stroke();
  if (side === 'front') text(ctx, '?', 0, 72, { size: 200, font: 'Instrument Serif', color: rgba(F7.stamp, .9), align: 'center' });
  else {
    // the back: the number, written in the same red ink (mirror the turn so it reads)
    ctx.save(); ctx.scale(-1, 1);
    text(ctx, '< 40 %', 0, 46, { size: 112, font: 'Instrument Serif', color: rgba(F7.stamp, .92), align: 'center' });
    text(ctx, "OF TODAY'S ENERGY", 0, 92, { size: 19, weight: 600, color: rgba(F7.ink, .7), align: 'center', spacing: 3 });
    ctx.restore();
  }
  // the light falls on it from the gauge's amber column (left) and the cold sky (right)
  const lg = ctx.createLinearGradient(-sw / 2, 0, sw / 2, 0); lg.addColorStop(0, `rgba(255,190,120,${.16 * lit})`); lg.addColorStop(.5, 'rgba(255,190,120,0)'); lg.addColorStop(1, `rgba(20,24,70,${.22})`);
  ctx.fillStyle = lg; ctx.fillRect(-sw / 2, -sh / 2 - 10, sw, sh + 20);
  ctx.restore();
  // the tape
  ctx.save(); ctx.translate(0, -sh / 2 - 2); ctx.rotate(.06); ctx.fillStyle = 'rgba(236,226,196,.86)'; ctx.fillRect(-46, -14, 92, 28); ctx.strokeStyle = 'rgba(160,140,100,.25)'; ctx.lineWidth = 1 / Math.max(.2, s); ctx.strokeRect(-46, -14, 92, 28); ctx.restore();
  ctx.restore();
}

// ---------------------------------------------------------------- text along an arc
// side 'top': letters upright with their tops pointing away from the centre (reads left → right over the top);
// side 'bottom': tops toward the centre (reads left → right under the bottom). reveal 0..1: letters appear left → right (each rises 6 px).
export function arcText(ctx, s, cx, cy, rr, thC, o = {}) {
  const size = o.size ?? 36, font = o.font ?? 'Inter', weight = o.weight ?? 600, sp = o.spacing ?? size * .25, side = o.side ?? 'top', rev = o.reveal ?? 1, a = o.a ?? 1;
  if (rev <= 0 || a <= 0) return;
  ctx.save(); ctx.font = `${font.startsWith('Instrument') ? '' : weight + ' '}${size}px "${font}"`;
  const ws = [...s].map((ch) => ctx.measureText(ch).width), L = ws.reduce((p, q) => p + q, 0) + sp * (s.length - 1);
  const dir = side === 'top' ? 1 : -1;
  let off = 0; const n = s.length;
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = o.blur ?? 14; }
  for (let i = 0; i < n; i++) {
    const c = off + ws[i] / 2, th = thC + dir * (c - L / 2) / rr, u = clamp(rev * (n + 2) - i * 1.0, 0, 1); off += ws[i] + sp;
    if (u <= 0 || s[i] === ' ') continue;
    const px = cx + Math.cos(th) * rr, py = cy + Math.sin(th) * rr;
    ctx.save(); ctx.translate(px, py); ctx.rotate(side === 'top' ? th + Math.PI / 2 : th - Math.PI / 2);
    ctx.globalAlpha = a * ease.out(u); ctx.fillStyle = o.color ?? '#f6efdc'; ctx.fillText(s[i], 0, (side === 'top' ? 0 : size * .72) + 6 * (1 - ease.out(u)));
    ctx.restore();
  }
  ctx.restore();
  return L;
}

// ---------------------------------------------------------------- engraved technology icons (local frame: base at 0, up = -y, height s)
function icon(ctx, t, kind, s, lit, seed) {
  const body = '#121838', rim = rgba('#ffd9a0', .55 + .3 * lit), win = rgba('#ffcf8a', .85 * lit);
  ctx.fillStyle = body; ctx.strokeStyle = rim; ctx.lineWidth = Math.max(.8, s * .04); ctx.lineJoin = 'round';
  if (kind === 'solar') {
    for (const dx of [-.42, .18]) { ctx.beginPath(); ctx.moveTo(s * dx, -s * .12); ctx.lineTo(s * (dx + .08), -s * .55); ctx.lineTo(s * (dx + .5), -s * .62); ctx.lineTo(s * (dx + .44), -s * .2); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.save(); ctx.strokeStyle = rgba('#a8c8ff', .45 + .3 * lit); ctx.lineWidth = Math.max(.5, s * .02); ctx.beginPath(); for (let q = 1; q < 3; q++) { const u = q / 3; ctx.moveTo(s * (dx + .04 * (1 - u) + .08 * u), -s * mix(.12, .55, u) * 1); ctx.lineTo(s * (dx + .44 + .06 * u), -s * mix(.2, .62, u)); } ctx.stroke(); ctx.restore();
      ctx.fillRect(s * (dx + .22), -s * .2, s * .05, s * .2); }
  } else if (kind === 'turbine') {
    ctx.beginPath(); ctx.moveTo(-s * .04, 0); ctx.lineTo(-s * .015, -s * .78); ctx.lineTo(s * .015, -s * .78); ctx.lineTo(s * .04, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.save(); ctx.translate(0, -s * .78); ctx.rotate(t * 1.3 + seed); for (let i = 0; i < 3; i++) { ctx.rotate(TAU / 3); ctx.beginPath(); ctx.moveTo(-s * .025, 0); ctx.quadraticCurveTo(s * .07, -s * .2, s * .01, -s * .4); ctx.quadraticCurveTo(-s * .012, -s * .2, -s * .025, 0); ctx.fill(); ctx.stroke(); } ctx.restore();
  } else if (kind === 'train') {
    for (let c = 0; c < 3; c++) { const x0 = -s * .9 + c * s * .62; ctx.beginPath(); if (c === 0) { ctx.moveTo(x0, -s * .06); ctx.lineTo(x0 + s * .06, -s * .4); ctx.lineTo(x0 + s * .56, -s * .4); ctx.lineTo(x0 + s * .56, -s * .06); } else ctx.rect(x0, -s * .4, s * .56, s * .34); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = win; for (let k = 0; k < 3; k++) ctx.fillRect(x0 + s * (.12 + k * .14), -s * .33, s * .08, s * .1); ctx.fillStyle = body; }
    ctx.strokeStyle = rgba('#cfd6ee', .6); ctx.beginPath(); ctx.moveTo(-s * 1, -s * .02); ctx.lineTo(s * 1, -s * .02); ctx.stroke();
  } else if (kind === 'clinic') {
    ctx.beginPath(); ctx.rect(-s * .42, -s * .5, s * .84, s * .5); ctx.fill(); ctx.stroke();
    ctx.fillStyle = win; ctx.fillRect(-s * .3, -s * .36, s * .22, s * .16); ctx.fillRect(s * .08, -s * .36, s * .22, s * .16);
    ctx.fillStyle = '#f3ecda'; ctx.beginPath(); ctx.arc(0, -s * .72, s * .16, 0, TAU); ctx.fill();
    ctx.fillStyle = '#4f8f62'; ctx.fillRect(-s * .035, -s * .84, s * .07, s * .24); ctx.fillRect(-s * .12, -s * .755, s * .24, s * .07);
  } else if (kind === 'pylon') {
    ctx.beginPath(); ctx.moveTo(-s * .2, 0); ctx.lineTo(-s * .05, -s * .9); ctx.lineTo(s * .05, -s * .9); ctx.lineTo(s * .2, 0); ctx.stroke();
    ctx.beginPath(); for (let k = 0; k < 5; k++) { const y0 = -s * .18 * k, y1 = -s * .18 * (k + 1), w0 = .2 - .15 * k / 5, w1 = .2 - .15 * (k + 1) / 5; ctx.moveTo(-s * w0, y0); ctx.lineTo(s * w1, y1); ctx.moveTo(s * w0, y0); ctx.lineTo(-s * w1, y1); } ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s * .32, -s * .72); ctx.lineTo(s * .32, -s * .72); ctx.moveTo(-s * .24, -s * .55); ctx.lineTo(s * .24, -s * .55); ctx.stroke();
  } else if (kind === 'library') {
    const w = s * .9; ctx.beginPath(); ctx.rect(-w / 2, -s * .42, w, s * .42); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-w / 2 - s * .05, -s * .42); ctx.lineTo(0, -s * .66); ctx.lineTo(w / 2 + s * .05, -s * .42); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = win; for (let k = 0; k < 4; k++) ctx.fillRect(-w / 2 + w * (.1 + k * .22), -s * .34, w * .1, s * .26);
  }
}
const TECH = ['solar', 'turbine', 'clinic', 'train', 'pylon', 'library', 'solar', 'turbine', 'train', 'clinic', 'solar', 'pylon', 'turbine'];
// st: { sep (px the halves part), tech(i) → 0..1, enough 0..1, flash 0..1 (the joints lock), a 1, line 1 (the amber line in the ring) }
export function ringHalves(ctx, t, m, st) {
  const cx = m.X(0), cy = m.Y(0), k = m.k, w = 46 * k + 9, r = RING_R * k - w * .35, sep = st.sep ?? 0, a = st.a ?? 1;
  // the two halves (kit ring arcs), the upper lifted by sep, the lower lowered by sep
  kitRing(ctx, t, { cx, cy: cy - sep, r, w, a: .6 * a, from: Math.PI, to: TAU, line: st.line ?? 1, seed: 6 });
  kitRing(ctx, t, { cx, cy: cy + sep, r, w, a: .6 * a, from: 0, to: Math.PI, line: st.line ?? 1, seed: 7 });
  // technology on the upper half (icons stand radially on its outer edge)
  const n = TECH.length;
  for (let i = 0; i < n; i++) {
    const u = st.tech ? st.tech(i) : 0; if (u <= 0) continue;
    const th = Math.PI + .32 + (TAU - Math.PI - .64) * i / (n - 1), s = (i % 3 === 1 ? 46 : 36) * clamp(k / .1, .7, 1.6), R0 = r + w * .55;
    ctx.save(); ctx.translate(cx + Math.cos(th) * R0, cy - sep + Math.sin(th) * R0); ctx.rotate(th + Math.PI / 2); ctx.scale(1, ease.out(u));
    icon(ctx, t, TECH[i], s, clamp(u * 1.4 - .2), i); ctx.restore();
    if (u < 1) glowAt(ctx, cx + Math.cos(th) * R0, cy - sep + Math.sin(th) * R0, 30, .5 * Math.sin(Math.PI * u), '#ffd9a0', '#ffffff');
  }
  // ENOUGH along the lower half (outside, tops toward the centre)
  if ((st.enough ?? 0) > 0) arcText(ctx, 'ENOUGH', cx, cy + sep, r + w + 12, Math.PI / 2, { size: 40, weight: 600, spacing: 16, side: 'bottom', reveal: st.enough, color: '#f6e6c8', glow: 'rgba(255,190,120,.45)' });
  // the joints lock: two flashes at 9 and 3 o'clock
  const fl = st.flash ?? 0;
  if (fl > 0) for (const th of [0, Math.PI]) { const X = cx + Math.cos(th) * (r + w * .3), Y = cy + Math.sin(th) * (r + w * .3); glowAt(ctx, X, Y, 90, .8 * fl, F7.amber, '#ffffff'); glowAt(ctx, X, Y, 26, fl, '#fff1d6', '#ffffff'); }
}

// ---------------------------------------------------------------- the ring as a diagram: floor, ceiling, the countries
export const BAND = { f0: 1.10, c0: 1.32 };   // the opened band (× EARTH.R): floor and ceiling
// st: { open 0..1 (kit ring → the wide band), fill 0..1 (the band fills with light), a 1, lab 0..1 (floor / ceiling labels), dash 0..1 (construction dashes) }
export function bandGeom(m, open) {
  const k = m.k, w0 = 46 * k + 9, r0 = RING_R * k - w0 * .35, r1 = BAND.f0 * EARTH.R * k, w1 = (BAND.c0 - BAND.f0) * EARTH.R * k, u = ease.io(clamp(open));
  return { cx: m.X(0), cy: m.Y(0), r: mix(r0, r1, u), w: mix(w0, w1, u) };
}
export function band(ctx, t, m, st) {
  const g = bandGeom(m, st.open ?? 0), a = st.a ?? 1, fill = st.fill ?? 0;
  kitRing(ctx, t, { cx: g.cx, cy: g.cy, r: g.r, w: g.w, a: (.5 + .5 * fill) * a, line: st.line ?? 1, seed: 6 });
  // the filled band: an even warm light between the edges (the ring built)
  if (fill > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const gr = ctx.createRadialGradient(g.cx, g.cy, g.r, g.cx, g.cy, g.r + g.w); gr.addColorStop(0, rgba('#fff1d6', .32 * fill * a)); gr.addColorStop(.35, rgba('#ffcf8a', .2 * fill * a)); gr.addColorStop(1, rgba('#f1d9a8', .04 * fill * a));
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(g.cx, g.cy, g.r + g.w, 0, TAU); ctx.arc(g.cx, g.cy, g.r, 0, TAU, true); ctx.fill('evenodd'); ctx.restore();
  }
  // the edges: the floor (warm, sharp) and the ceiling (cool, dashed while the band is empty)
  const op = ease.io(clamp(st.open ?? 0));
  if (op > 0) {
    ctx.save(); ctx.lineWidth = 1.6; ctx.strokeStyle = rgba('#ffe2b0', .8 * op * a); ctx.beginPath(); ctx.arc(g.cx, g.cy, g.r, 0, TAU); ctx.stroke();
    ctx.setLineDash([10, 9]); ctx.lineDashOffset = -t * 6; ctx.strokeStyle = rgba('#cfe6ff', .65 * op * a * (1 - .5 * fill)); ctx.beginPath(); ctx.arc(g.cx, g.cy, g.r + g.w, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
    ctx.restore();
  }
  return g;
}
// labels of the two edges, at the right side of the band, with short leader lines
export function edgeLabels(ctx, t, g, u, a = 1) {
  if (u <= 0) return;
  const th = -.42, items = [[g.r, 'FLOOR · WHAT EVERYONE NEEDS', '#ffe2b0', 46], [g.r + g.w, "CEILING · THE PLANET'S LIMITS", '#cfe6ff', -46]];
  items.forEach(([rr, s, col, dy], i) => {
    const q = ease.out(clamp(u * 1.6 - i * .35)); if (q <= 0) return;
    const px = g.cx + Math.cos(th) * rr, py = g.cy + Math.sin(th) * rr, lx = px + 70, ly = py + dy;
    ctx.save(); ctx.strokeStyle = rgba(col, .7 * q * a); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(mix(px, lx, q), mix(py, ly, q)); ctx.lineTo(mix(px, lx + 26, q), mix(py, ly, q)); ctx.stroke();
    ctx.fillStyle = rgba(col, q * a); ctx.beginPath(); ctx.arc(px, py, 3, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.rect(lx + 32, ly - 24, 460 * q, 36); ctx.clip();
    text(ctx, s, lx + 34, ly + 7, { size: 19, weight: 600, color: rgba(col, .95 * a), spacing: 4 }); ctx.restore();
  });
}
export const BEADS = (() => {
  const r = prng(2024), out = [];
  for (let i = 0; i < 84; i++) {
    const th = -Math.PI + TAU * (i + r() * .7) / 84, over = r() < .42;
    out.push({ th, over, r0: .7 + .25 * r(), rT: over ? 1.36 + .17 * r() : 1.015 + .055 * r(), rIn: BAND.f0 + .03 + (BAND.c0 - BAND.f0 - .06) * r(), d: r(), s: .75 + .5 * r(), ph: r() * TAU });
  }
  return out;
})();
// st: { rise 0..1 (staggered by d), into 0..1 (all move into the band), merge 0..1 (into the kit ring radius, shrinking away), a 1 }
export function beads(ctx, t, m, st) {
  const cx = m.X(0), cy = m.Y(0), k = m.k, R = EARTH.R * k, a = st.a ?? 1; if (a <= 0) return;
  ctx.save();
  for (const b of BEADS) {
    const u = ease.out(clamp((st.rise ?? 0) * 1.6 - b.d * .6)); if (u <= 0) continue;
    const iu = ease.io(clamp((st.into ?? 0) * 1.4 - b.d * .4)), mg = ease.io(clamp(st.merge ?? 0));
    let rr = mix(b.r0, b.rT, u); rr = mix(rr, b.rIn, iu); rr = mix(rr, RING_R / EARTH.R + .01, mg);
    const X = cx + Math.cos(b.th) * rr * R, Y = cy + Math.sin(b.th) * rr * R; if (X < -20 || X > W + 20 || Y < -20 || Y > H + 20) continue;
    const s = (3.4 + 2.2 * b.s) * clamp(k / .1, .8, 3) * (1 - .85 * mg), col = iu > .5 ? '#fff1d6' : b.over ? F7.amber : '#cfd6ee', core = b.over && iu < .5 ? F7.amberCore : '#ffffff';
    const tw = .8 + .2 * Math.sin(t * 2.1 + b.ph), al = a * (b.over ? 1 : .8 - .25 * (1 - iu)) * tw * (1 - mg * .6);
    glowAt(ctx, X, Y, s * 3.2, .35 * al, col, core);
    ctx.fillStyle = rgba(core, .95 * al); ctx.beginPath(); ctx.arc(X, Y, s * .5, 0, TAU); ctx.fill();
    // the trail while it rises
    if (u > 0 && u < 1 && iu <= 0) { const r1 = mix(b.r0, b.rT, Math.max(0, u - .25)); ctx.strokeStyle = rgba(col, .35 * a * (1 - u)); ctx.lineWidth = s * .5; ctx.beginPath(); ctx.moveTo(cx + Math.cos(b.th) * r1 * R, cy + Math.sin(b.th) * r1 * R); ctx.lineTo(X, Y); ctx.stroke(); }
  }
  ctx.restore();
}
// the scan: a light that runs once round the empty band and finds nothing (u 0..1)
export function scan(ctx, t, g, u) {
  if (u <= 0 || u >= 1) return;
  const th = -Math.PI / 2 + TAU * ease.io(u), q = Math.sin(Math.PI * u);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 14; i++) { const tt = th - i * .035, X = g.cx + Math.cos(tt) * (g.r + g.w / 2), Y = g.cy + Math.sin(tt) * (g.r + g.w / 2); glowAt(ctx, X, Y, g.w * .9, .2 * q * (1 - i / 14), '#eef8ff', '#ffffff'); }
  ctx.restore();
}

// ---------------------------------------------------------------- the empty building site in the band (top of the ring)
// st: { rise 0..1 (the scaffolds rise from the floor), lamp 0..1, sink 0..1 (they sink back into the floor), swayT (t of a gust) }
export function site(ctx, t, m, g, st) {
  const rise = ease.out(clamp(st.rise ?? 0)) * (1 - ease.io(clamp(st.sink ?? 0))); if (rise <= 0 && (st.lamp ?? 0) <= 0) return;
  const { cx, cy, r, w } = g;
  const at = (th, rr) => [cx + Math.cos(th) * rr, cy + Math.sin(th) * rr];
  const th0 = -Math.PI / 2;
  // dashed construction outlines (where the ring should stand): radial ticks along the floor
  ctx.save(); ctx.lineCap = 'round';
  // scaffold towers: two poles, cross braces, platforms; standing on the floor, reaching to the ceiling
  const towers = [-.15, -.09, .03, .11];
  towers.forEach((d, i) => {
    const th = th0 + d, hh = w * (.95 - .12 * (i % 2)) * clamp(rise * 1.2 - i * .08), tw = w * .34; if (hh <= 1) return;
    const [bx, by] = at(th, r);
    ctx.save(); ctx.translate(bx, by); ctx.rotate(th + Math.PI / 2);
    ctx.strokeStyle = rgba('#cfd6ee', .75); ctx.lineWidth = Math.max(1, w * .018);
    ctx.beginPath(); ctx.moveTo(-tw / 2, 0); ctx.lineTo(-tw / 2, -hh); ctx.moveTo(tw / 2, 0); ctx.lineTo(tw / 2, -hh); ctx.stroke();
    ctx.lineWidth = Math.max(.7, w * .011); ctx.beginPath(); const nf = 4; for (let k = 0; k < nf; k++) { const y0 = -hh * k / nf, y1 = -hh * (k + 1) / nf; if (y1 < -hh) break; ctx.moveTo(-tw / 2, y0); ctx.lineTo(tw / 2, y1); ctx.moveTo(-tw / 2 - w * .03, y1); ctx.lineTo(tw / 2 + w * .03, y1); } ctx.stroke();
    ctx.restore();
  });
  // the crane: a lattice tower, a jib along the band, a cable and the work lamp
  const thC = th0 + .06, ch = w * 1.25 * clamp(rise * 1.3 - .2), [bx, by] = at(thC, r);
  if (ch > 2) {
    ctx.save(); ctx.translate(bx, by); ctx.rotate(thC + Math.PI / 2);
    const cw = w * .1; ctx.strokeStyle = rgba('#e8dcc0', .85); ctx.lineWidth = Math.max(1, w * .02);
    ctx.beginPath(); ctx.moveTo(-cw / 2, 0); ctx.lineTo(-cw / 2, -ch); ctx.moveTo(cw / 2, 0); ctx.lineTo(cw / 2, -ch); ctx.stroke();
    ctx.lineWidth = Math.max(.6, w * .01); ctx.beginPath(); for (let k = 0; k < 10; k++) { const y0 = -ch * k / 10, y1 = -ch * (k + 1) / 10; ctx.moveTo(-cw / 2, y0); ctx.lineTo(cw / 2, y1); } ctx.stroke();
    const jl = w * 1.6 * clamp(rise * 1.5 - .4), jr = w * .45 * clamp(rise * 1.5 - .4);
    ctx.lineWidth = Math.max(1, w * .02); ctx.beginPath(); ctx.moveTo(-jl, -ch); ctx.lineTo(jr, -ch); ctx.moveTo(-jl, -ch); ctx.lineTo(0, -ch - w * .16); ctx.lineTo(jr, -ch); ctx.stroke();
    ctx.fillStyle = rgba('#141a36', 1); ctx.fillRect(jr - w * .12, -ch - w * .02, w * .14, w * .1);
    // the cable and the lamp (it swings a little)
    const lamp = st.lamp ?? 0;
    if (jl > w * .5) {
      const hx = -jl * .78, sw = .05 * Math.sin(t * 1.7) + .12 * bump(t, st.swayT ?? -9, (st.swayT ?? -9) + .3, (st.swayT ?? -9) + .6, (st.swayT ?? -9) + 2.4) * Math.sin((t - (st.swayT ?? 0)) * 5), L = w * .62;
      const lx = hx + Math.sin(sw) * L, ly = -ch + Math.cos(sw) * L;
      ctx.strokeStyle = rgba('#e8dcc0', .7); ctx.lineWidth = Math.max(.6, w * .008); ctx.beginPath(); ctx.moveTo(hx, -ch); ctx.lineTo(lx, ly); ctx.stroke();
      ctx.fillStyle = '#1a1a2c'; ctx.beginPath(); ctx.moveTo(lx - w * .05, ly); ctx.lineTo(lx + w * .05, ly); ctx.lineTo(lx + w * .03, ly - w * .05); ctx.lineTo(lx - w * .03, ly - w * .05); ctx.closePath(); ctx.fill();
      if (lamp > 0) { const br = 1 + .03 * Math.sin(t * 3.1); glowAt(ctx, lx, ly + w * .02, w * 2.6 * br, .3 * lamp, '#ffb35c', '#fff1d6'); glowAt(ctx, lx, ly + w * .02, w * .5, .9 * lamp, '#fff1d6', '#ffffff');
        // the cone of light the lamp throws down onto the empty floor
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; const cg = ctx.createLinearGradient(lx, ly, lx, 0); cg.addColorStop(0, rgba('#ffd9a0', .28 * lamp)); cg.addColorStop(1, rgba('#ffd9a0', .04 * lamp));
        ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(lx - w * .03, ly); ctx.lineTo(lx + w * .03, ly); ctx.lineTo(lx + w * .5, 0); ctx.lineTo(lx - w * .5, 0); ctx.closePath(); ctx.fill(); ctx.restore(); }
    }
    ctx.restore();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the shared ring: equal shares, each held by its own point of light
export const NSEG = 72;
const OWN = [[-560, -2620], [1150, -2350], [-1650, -1400], [700, -900]];
export const HOLD = (() => {
  // each share's holder: a land point spread over the disc, roughly below its angle (so the threads run out like rays)
  const r = prng(77), out = [];
  for (let j = 0; j < NSEG; j++) {
    const th = -Math.PI + TAU * (j + .5) / NSEG; let best = null, bd = 1e9;
    for (let tries = 0; tries < 60; tries++) { const p = POINTS[Math.floor(r() * POINTS.length)], a = Math.atan2(p.y, p.x), da = Math.abs(mod(a - th + Math.PI, TAU) - Math.PI), d = da * 3 + Math.abs(Math.hypot(p.x, p.y) / EARTH.R - .78) * .8; if (d < bd) { bd = d; best = p; } }
    out.push({ th, p: best, own: OWN[Math.min(3, Math.floor(mod(th + Math.PI * .75, TAU) / (TAU / 4)))], d: r() });
  }
  return out;
})();
// st: { seg 0..1 (the ring splits into shares), few 0..1 (a few owners hold all), dim 0..1 (not abundance), all 0..1 (everyone holds a share), a 1 }
export function shareRing(ctx, t, m, st) {
  const cx = m.X(0), cy = m.Y(0), k = m.k, w = 46 * k + 9, r = RING_R * k - w * .35, a = st.a ?? 1, seg = ease.io(clamp(st.seg ?? 0)), few = clamp(st.few ?? 0), dim = clamp(st.dim ?? 0), all = clamp(st.all ?? 0);
  const glowR = 1 - .6 * dim * (1 - all);
  // threads (behind the ring): from the holder to the share
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (const hd of HOLD) {
    const au = ease.io(clamp(all * 1.5 - hd.d * .5)), fu = few * (1 - au); if (fu + au <= 0) continue;
    const ox = mix(hd.own[0], hd.p.x, au), oy = mix(hd.own[1], hd.p.y, au), X0 = m.X(ox), Y0 = m.Y(oy);
    const X1 = cx + Math.cos(hd.th) * (r + w * .3), Y1 = cy + Math.sin(hd.th) * (r + w * .3);
    const mx = (X0 + X1) / 2 + (Y1 - Y0) * .08, my = (Y0 + Y1) / 2 - (X1 - X0) * .08;
    ctx.strokeStyle = rgba(au > .5 ? '#ffe2b0' : '#ffb35c', (.1 + .14 * au) * a * (fu + au)); ctx.lineWidth = mix(2.2, 1, au);
    ctx.beginPath(); ctx.moveTo(X0, Y0); ctx.quadraticCurveTo(mx, my, X1, Y1); ctx.stroke();
    // the holder: a point of light (a person) — big for the few owners, one each for all
    if (au > 0) { ctx.fillStyle = rgba('#fff1d6', .9 * au * a); ctx.fillRect(X0 - 1.6, Y0 - 1.6, 3.2, 3.2); glowAt(ctx, X0, Y0, 10, .4 * au * a, '#ffd9a0', '#ffffff'); }
  }
  // the few owners: four big lights
  if (few > 0) for (const [x, y] of OWN) { const X = m.X(x), Y = m.Y(y), q = few * (1 - ease.io(all)); glowAt(ctx, X, Y, 70, .55 * q * a, F7.amber, F7.amberCore); glowAt(ctx, X, Y, 18, .95 * q * a, '#fff1d6', '#ffffff'); }
  ctx.restore();
  // the band of shares: one gradient, NSEG annular sectors with small gaps
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const gr = ctx.createRadialGradient(cx, cy, r - 3, cx, cy, r + w);
  const A = a * glowR * (1 + .25 * all);
  gr.addColorStop(0, rgba('#ffe2a8', 0)); gr.addColorStop(.04, rgba('#fff1d6', .75 * A)); gr.addColorStop(.12, rgba('#ffcf8a', .42 * A)); gr.addColorStop(.45, rgba(F7.amber, .14 * A)); gr.addColorStop(.85, rgba('#e9a0a8', .05 * A)); gr.addColorStop(1, 'rgba(200,140,160,0)');
  ctx.fillStyle = gr;
  const gap = seg * Math.min(.012, 2.2 / Math.max(1, r)) + seg * .006;
  ctx.beginPath();
  for (let j = 0; j < NSEG; j++) { const a0 = -Math.PI + TAU * j / NSEG + gap / 2, a1 = -Math.PI + TAU * (j + 1) / NSEG - gap / 2; ctx.moveTo(cx + Math.cos(a0) * (r + w), cy + Math.sin(a0) * (r + w)); ctx.arc(cx, cy, r + w, a0, a1); ctx.arc(cx, cy, r - 3, a1, a0, true); ctx.closePath(); }
  ctx.fill();
  // each share's sharp inner edge (the floor), lit by its holder; flickering while few own it
  for (let j = 0; j < NSEG; j++) {
    const hd = HOLD[j], a0 = -Math.PI + TAU * j / NSEG + gap / 2, a1 = -Math.PI + TAU * (j + 1) / NSEG - gap / 2;
    const fl = dim * (1 - all) * (.5 + .5 * Math.sin(t * 7 + j * 2.3)), br = clamp((.6 + .4 * all) * (1 - .55 * fl) * glowR);
    ctx.strokeStyle = rgba('#fff6e0', .62 * br * a); ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(cx, cy, r, a0, a1); ctx.stroke();
  }
  ctx.restore();
  // the amber line lying calmly in the ring (it stays whole: appetite inside the limits)
  const pts = []; for (let i = 0; i <= 220; i++) { const q = -Math.PI + TAU * i / 220; pts.push([cx + Math.cos(q) * (r + w * .35), cy + Math.sin(q) * (r + w * .35)]); }
  curve(ctx, t, pts, { w: .7, br: .8 * glowR, sparks: 0, tip: false, shimmer: .4, ticks: false });
  return { cx, cy, r, w };
}

// ---------------------------------------------------------------- the dawn plate (copy of handoff4 lightPlate, tone dawn) and the cover
const DOTS = (() => { const r = prng(901), d = []; for (let i = 0; i < 2600; i++) d.push([r(), r(), r()]); return d; })();
export function dawnPlate(ctx, t, A = 1) {
  if (A <= 0) return;
  const c0 = '#fff6e2', c1 = '#ffd9a0', c2 = '#f4a77a', br = 1 + .03 * Math.sin(t * 1.7) + .015 * Math.sin(t * 4.3);
  const cx = W / 2 + 18 * drift(t, 1, 3), cy = H / 2 + 12 * drift(t, 1, 7);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = clamp(A);
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 1150 * br); g.addColorStop(0, c0); g.addColorStop(.42, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const r = prng(31 + Math.floor(t * 12)); ctx.fillStyle = rgba(c2, .32);
  for (const [u, v, k] of DOTS) {
    const x = u * W, y = v * H, d = Math.hypot(x - cx, y - cy) / 1100; if (d < .35) continue;
    if (k > (d - .35) * 1.4) continue; const s = .8 + r() * 1.1; ctx.fillRect(x + (r() - .5) * 2, y + (r() - .5) * 2, s, s);
  }
  ctx.restore();
}
// fly into the sunrise: a warm light grows from (cx, cy); the plate lies over it, reaching full strength at k = 1 (exactly the plate)
export function dawnCover(ctx, t, k, cx, cy) {
  if (k <= 0) return;
  const kk = clamp(k);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
  const R = mix(80, 2600, Math.pow(kk, 1.25)), g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
  g.addColorStop(0, rgba('#fff6e2', clamp(.55 + .45 * kk))); g.addColorStop(.28, rgba('#ffd9a0', clamp(.25 + .5 * kk))); g.addColorStop(1, rgba('#f4a77a', 0));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
  dawnPlate(ctx, t, kk >= .999 ? 1 : sm(lin(.35, 1, kk)));
}

// ---------------------------------------------------------------- labels (c06's: big value + small caps source, wipe in from the left, out to the right)
export function label(ctx, t, big, small, x, y, t0, t1, o = {}) {
  const a = ease.out(lin(t0, t0 + .6, t)), b = ease.inn(lin(t1 - .4, t1, t)); if (a <= 0 || b >= 1) return;
  const bs = o.size ?? 76, al = o.align ?? 'left';
  ctx.save(); ctx.font = `${bs}px "Instrument Serif"`; const bw = big ? ctx.measureText(big).width : 0; ctx.restore();
  const wv = Math.max(bw, small.length * 15.5) + 40, x0 = al === 'center' ? x - wv / 2 + 10 : x;
  ctx.save(); ctx.beginPath(); ctx.rect(x0 - 10 + wv * b, y - bs * 1.2, wv * (a - b), bs * 1.2 + 70); ctx.clip();
  if (big) text(ctx, big, al === 'center' ? x : x0, y, { size: bs, font: 'Instrument Serif', color: o.color ?? '#f6efdc', align: al });
  text(ctx, small, al === 'center' ? x : x0 + 2, y + (big ? 42 : 0), { size: 18, weight: 600, color: rgba('#cfd6ee', .9), spacing: 4, align: al });
  ctx.restore();
  if (o.bar !== false && al !== 'center') { ctx.fillStyle = rgba(o.bar || F7.amber, .9); ctx.fillRect(x0 - 24, y - (big ? bs * .82 : 20), 3, ((big ? bs * .82 : 20) + 50) * (a - b)); }
}
