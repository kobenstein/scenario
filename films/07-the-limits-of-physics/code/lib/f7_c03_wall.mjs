// Film 7 · c03 · the wall: drawing pieces for scenes/sc03.mjs (orbit world from lib/f7_kit.mjs; everything here lives in the same world units).
//   plateSky(ctx, t, sh)            the c02>c03 night-sky plate (lib/handoff4.mjs skyPlate, copied 1:1) moved up by -sh px; below its lower edge it ends
//                                   in a soft 300 px band, so the kit sky (drawn first) continues it. sh = 0 → the identical plate image.
//   sunrise(ctx, t, m, o)           the sun rising over the limb (draw BEFORE earthHorizon: the disc hides it) + sunriseLimb() after it (lit limb, day crescent)
//   streams(ctx, t, m, CW, iS, o)   golden filaments: the day side's light flows along the limb into the curve's foot and up the curve
//   yearRun(ctx, t, m, CW, iS, o)   decade ticks, the runner bead (s = years / 400), century labels ×10 … ×10,000
//   ladder(ctx, t, m, o)            the Kardashev ladder: a radial rail of light from the limb; rung I sits ON the dome, II and III up in the stars; "US" dot
//   stage(ctx, t, m, o, plate)      the stage on the land at the curve's foot (truss, towers, audience); its screen is the c03>c04 glass plate with
//                                   SUSTAINABLE ABUNDANCE in light; the light switches off (CRT line) and leaves the dark glass. → screen rect (px)
import { W, H, rgba, clamp, lin, mix, sm, prng, text } from '../engine.mjs';
import { F7, EARTH, glowAt, ease, mod, n1 } from './f7_kit.mjs';

const TAU = Math.PI * 2;

// ---------------------------------------------------------------- the plate sky, movable (copy of handoff4 skyPlate, tone night)
const STARS = (() => { const r = prng(4242), s = []; for (let i = 0; i < 520; i++) { const m = r(); s.push([r() * W, r() * H, m < .9 ? .5 + r() * .9 : 1.2 + r() * 1.4, r() * TAU, .4 + r() * 1.6]); } return s; })();
const BAND = (() => { const r = prng(55), d = []; for (let i = 0; i < 900; i++) { const x = (r() - .5) * W * 1.5, y = (r() + r() + r() - 1.5) * 150, a = .05 + .1 * r(); d.push([x, y, a]); } return d; })();
export function plateSky(ctx, t, sh = 0) {
  const edge = H + 40 + sh, band = 300, mask = (Y) => (Y <= edge ? 1 : clamp(1 - (Y - edge) / band));
  if (edge + band < 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  const s0 = '#060818', s1 = '#0d1236', s2 = '#1d1a4a';
  const g = ctx.createLinearGradient(0, sh, 0, H + sh); g.addColorStop(0, s0); g.addColorStop(.62, s1); g.addColorStop(1, s2); ctx.fillStyle = g;
  if (sh === 0) ctx.fillRect(0, 0, W, H);
  else {
    ctx.fillRect(0, 0, W, Math.max(0, Math.min(H, edge)));
    if (edge < H) { const f = ctx.createLinearGradient(0, edge, 0, edge + band); f.addColorStop(0, rgba(s2, 1)); f.addColorStop(1, rgba(s2, 0)); ctx.fillStyle = f; ctx.fillRect(0, Math.max(0, edge), W, band + Math.min(0, edge)); }
  }
  // the band (same dots, same drift)
  ctx.save(); ctx.translate(W / 2, H / 2 + sh); ctx.rotate(-.42); const sa = Math.sin(-.42), ca = Math.cos(-.42);
  for (const [x, y, a] of BAND) {
    const X = x + t * 1.5, k = sh === 0 ? 1 : mask(H / 2 + sh + X * sa + y * ca); if (k <= 0) continue;
    ctx.fillStyle = `rgba(216,230,255,${a * k})`; ctx.fillRect(X, y, 1.3, 1.3);
  }
  ctx.restore();
  const dx = t * 2.2, dy = t * .6;
  for (const [x, y, s, ph, f] of STARS) {
    const tw = .55 + .45 * Math.sin(t * f + ph), X = ((x + dx) % W + W) % W, Y0 = ((y + dy) % H + H) % H;
    for (let c = 0; c < (sh === 0 ? 1 : 2); c++) {
      const Y = Y0 + sh + c * H, k = sh === 0 ? 1 : mask(Y); if (k <= 0 || Y < -12) continue;
      ctx.fillStyle = `rgba(243,239,226,${(.35 + .65 * tw) * (s > 1.2 ? 1 : .8) * k})`; ctx.beginPath(); ctx.arc(X, Y, s, 0, TAU); ctx.fill();
      if (s > 2) { ctx.fillStyle = `rgba(255,241,214,${.07 * tw * k})`; ctx.beginPath(); ctx.arc(X, Y, s * 5, 0, TAU); ctx.fill(); }
    }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the sunrise over the limb
export const SUN = { th: .7, rs: 30 };   // angle from the top of the Earth (rad, right), sun radius (world)
const polar = (th, r) => [r * Math.sin(th), -r * Math.cos(th)];
export function sunrise(ctx, t, m, o = {}) {
  const u = o.u ?? 0; if (u <= 0) return null;
  const h = mix(-70, 58, ease.out(u)), [wx, wy] = polar(SUN.th, EARTH.R + h), X = m.X(wx), Y = m.Y(wy), k = m.k, br = (o.br ?? 1) * (1 + .03 * Math.sin(t * 2.3));
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  // the great bloom and the rays (it lights the black around it, one hero light)
  glowAt(ctx, X, Y, 1500 * k * br, .3 * clamp(u * 1.5), '#ffb35c', '#fff1d6');
  glowAt(ctx, X, Y, 420 * k * br, .7 * clamp(u * 1.5), '#ffd08e', '#ffffff');
  glowAt(ctx, X, Y, 90 * k * br, .95, '#fff1d6', '#ffffff');
  ctx.fillStyle = rgba('#fffaf0', 1); ctx.beginPath(); ctx.arc(X, Y, SUN.rs * k, 0, TAU); ctx.fill();
  ctx.lineCap = 'round';
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * TAU + t * .03 + (i % 2) * .1, L = (i % 3 === 0 ? 620 : 300) * k * br * clamp(u * 1.3), w = i % 3 === 0 ? 1.8 : 1.1;
    const gr = ctx.createLinearGradient(X, Y, X + Math.cos(a) * L, Y + Math.sin(a) * L); gr.addColorStop(0, rgba('#fff1d6', .55)); gr.addColorStop(1, rgba('#ffb35c', 0));
    ctx.strokeStyle = gr; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(X, Y); ctx.lineTo(X + Math.cos(a) * L, Y + Math.sin(a) * L); ctx.stroke();
  }
  ctx.restore();
  return [X, Y];
}
// after earthHorizon: the limb near the sun burns gold, a thin day crescent on the disc's edge
export function sunriseLimb(ctx, t, m, o = {}) {
  const u = o.u ?? 0; if (u <= 0) return;
  const cx = m.X(0), cy = m.Y(0), r = EARTH.R * m.k, thC = SUN.th - Math.PI / 2, a = clamp(u * 1.4) * (o.br ?? 1);
  const prof = (spread, amp) => { const cg = ctx.createConicGradient(0, cx, cy); for (let i = 0; i <= 120; i++) { const ang = i / 120 * TAU, dd = Math.abs(mod(ang - thC + Math.PI, TAU) - Math.PI); cg.addColorStop(i / 120, rgba('#ffcf8a', clamp(amp * Math.exp(-dd * dd / spread)))); } return cg; };
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [lw, sp, amp, dr] of [[Math.max(14, 60 * m.k), .05, .22 * a, 6], [Math.max(4, 14 * m.k), .03, .55 * a, 2], [1.6, .02, .95 * a, 0]]) {
    ctx.strokeStyle = prof(sp, amp); ctx.lineWidth = lw; ctx.beginPath(); ctx.arc(cx, cy, r + dr * m.k, 0, TAU); ctx.stroke();
  }
  // the day crescent: a sliver of sunlit land just inside the limb
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip();
  ctx.strokeStyle = prof(.04, .3 * a); ctx.lineWidth = Math.max(6, 70 * m.k); ctx.beginPath(); ctx.arc(cx, cy, r - 35 * m.k, 0, TAU); ctx.stroke();
  ctx.restore();
  ctx.restore();
}

// ---------------------------------------------------------------- the light of the day side flows into the curve
let STREAMS = null;
function streamPaths(CW, iS) {
  // each thread leaves the lit limb near the sun, arcs over the atmosphere and ends ON the curve (absorbed somewhere along its rise)
  const r = prng(733), out = [];
  for (let i = 0; i < 64; i++) {
    const th0 = SUN.th + (r() - .55) * .8, r0 = EARTH.R + 8 + 110 * r() * r(), js = .3 + .68 * Math.sqrt(r()), J = ptAt(CW, iS, js), thJ = Math.atan2(J[0], -J[1]) + .012, rJ = Math.hypot(J[0], J[1]);
    const bow = 50 + 170 * r(), P = [];
    for (let q = 0; q <= 80; q++) {
      const p = q / 80, th = mix(th0, thJ, ease.sine(p)), rr = mix(r0, rJ, Math.pow(p, 1.6)) + bow * Math.sin(Math.PI * p);
      P.push(polar(th, rr));
    }
    P.push([J[0], J[1]]);
    const L = [0]; for (let j = 1; j < P.length; j++) L.push(L[j - 1] + Math.hypot(P[j][0] - P[j - 1][0], P[j][1] - P[j - 1][1]));
    out.push({ P, L, len: L[L.length - 1], ph: r(), sp: 700 + 600 * r(), w: .7 + r() * 1.1, warm: r(), J });
  }
  return out;
}
export function streams(ctx, t, m, CW, iS, o = {}) {
  const front = o.front ?? 0, a = o.a ?? 0; if (front <= 0 || a <= 0) return;
  STREAMS = STREAMS || streamPaths(CW, iS);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const s of STREAMS) {
    const lim = front * s.len, P = s.P;
    // the faint thread
    ctx.beginPath(); let started = false;
    for (let j = 0; j < P.length; j++) { if (s.L[j] > lim) break; const X = m.X(P[j][0]), Y = m.Y(P[j][1]); started ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); started = true; }
    ctx.strokeStyle = rgba('#ff9a40', .05 * a); ctx.lineWidth = 9 + 6 * s.warm; ctx.stroke();
    ctx.strokeStyle = rgba(s.warm < .5 ? '#ffcf8a' : '#ffb35c', .24 * a); ctx.lineWidth = s.w * 1.3; ctx.stroke();
    // moving packets of light along it
    for (let k = 0; k < 3; k++) {
      const head = mod(t * s.sp + (s.ph + k / 3) * s.len, s.len), seg = 140;
      if (head > lim) continue;
      ctx.beginPath(); let st2 = false;
      for (let j = 0; j < P.length; j++) { const l = s.L[j]; if (l < head - seg) continue; if (l > head) break; const X = m.X(P[j][0]), Y = m.Y(P[j][1]); st2 ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); st2 = true; }
      ctx.strokeStyle = rgba('#ffe2b0', .75 * a); ctx.lineWidth = s.w * 1.9; ctx.stroke();
    }
    // where a packet reaches the curve it is swallowed: a small flash on the line
    if (front >= 1) { const ph = mod(t * s.sp / s.len + s.ph, 1 / 3) * 3; if (ph < .12) glowAt(ctx, m.X(s.J[0]), m.Y(s.J[1]), 22, .5 * a * (1 - ph / .12), F7.amber, F7.amberCore); }
    // the front: a bright bead while it travels
    if (front < 1) { let j = 0; while (j < P.length - 1 && s.L[j + 1] < lim) j++; glowAt(ctx, m.X(P[j][0]), m.Y(P[j][1]), 18, .5 * a, F7.amber, F7.amberCore); }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the years run up the curve (decades, centuries ×10)
const CENT = [['×10', '100 YEARS'], ['×100', '200 YEARS'], ['×1,000', '300 YEARS'], ['×10,000', '400 YEARS']];
const ptAt = (CW, iS, s) => { const f = iS + (CW.length - 1 - iS) * clamp(s), i = Math.min(CW.length - 2, Math.floor(f)), q = f - i; return [mix(CW[i][0], CW[i + 1][0], q), mix(CW[i][1], CW[i + 1][1], q), Math.atan2(CW[i + 1][1] - CW[i][1], CW[i + 1][0] - CW[i][0])]; };
export function yearRun(ctx, t, m, CW, iS, o = {}) {
  const s = o.s ?? 0, a = o.a ?? 1, bead = o.bead ?? 0; if (a <= 0) return;
  ctx.save(); ctx.lineCap = 'round';
  // decade ticks behind the runner (perpendicular to the curve, on its lower-right side)
  for (let d = 1; d <= 40; d++) {
    const sd = d / 40, vis = clamp((s - sd) * 40 + 1); if (vis <= 0) break;
    const [x, y, ang] = ptAt(CW, iS, sd), big = d % 10 === 0, nx = Math.cos(ang + Math.PI / 2), ny = Math.sin(ang + Math.PI / 2), L = (big ? 24 : 11) * vis;
    const X = m.X(x), Y = m.Y(y);
    ctx.strokeStyle = rgba('#fff1d6', (big ? .95 : .6) * a); ctx.lineWidth = big ? 2 : 1.2;
    ctx.beginPath(); ctx.moveTo(X + nx * 5, Y + ny * 5); ctx.lineTo(X + nx * (5 + L), Y + ny * (5 + L)); ctx.stroke();
  }
  ctx.restore();
  // century labels (written in light beside the tick, wipe in, still while read)
  for (let c = 0; c < 4; c++) {
    const sd = (c + 1) / 4, t0 = o.cent?.[c]; if (t0 == null) continue;
    const u = ease.out(lin(t0, t0 + .45, t)), out = o.out != null ? ease.inn(lin(o.out + c * .05, o.out + .4 + c * .05, t)) : 0; if (u <= 0 || out >= 1) continue;
    // ×10 and ×100 on the upper-left of the flat part (right-aligned, on fine leaders), ×1,000 and ×10,000 right of the steep part
    const [x, y, ang] = ptAt(CW, iS, sd), side = c < 2 ? -1 : 1, nx = side * Math.cos(ang + Math.PI / 2), ny = side * Math.sin(ang + Math.PI / 2);
    const lift = c === 0 ? 40 : c === 1 ? 100 : 0, X = m.X(x) + nx * 34 + (c < 2 ? -6 - (c === 0 ? 24 : 0) : 8 + (c === 3 ? 18 : 0)), Y = m.Y(y) + ny * 34 - lift + (c === 3 ? 40 : c === 2 ? 12 : 0), wv = 230;
    if (lift) { ctx.save(); ctx.strokeStyle = rgba('#fff1d6', .45 * a * (u - out)); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(m.X(x) - 3, m.Y(y) - 8); ctx.lineTo(X + 4, Y + 30); ctx.stroke(); ctx.restore(); }
    const al = c < 2 ? 'right' : 'left';
    ctx.save(); ctx.beginPath(); if (c < 2) ctx.rect(X + 6 - wv * u, Y - 50, wv * (u - out), 86); else ctx.rect(X - 6 + wv * out, Y - 50, wv * (u - out), 86); ctx.clip();
    ctx.shadowColor = 'rgba(255,214,160,.35)'; ctx.shadowBlur = 14;
    text(ctx, CENT[c][0], X, Y, { size: c === 3 ? 52 : 40, font: 'Instrument Serif', color: rgba('#f6efdc', a), align: al });
    ctx.shadowBlur = 0;
    text(ctx, CENT[c][1], X + (c < 2 ? 0 : 2), Y + 24, { size: 15, weight: 600, color: rgba('#cfd6ee', .9 * a), spacing: 3, align: al });
    ctx.restore();
  }
  // the runner: a bead of light riding the curve, it carries the years
  if (bead > 0) {
    const [x, y] = ptAt(CW, iS, s), X = m.X(x), Y = m.Y(y), br = 1 + .08 * Math.sin(t * 7);
    glowAt(ctx, X, Y, 46 * bead * br, .55 * a, F7.amber, '#ffffff');
    glowAt(ctx, X, Y, 12 * bead, .95 * a, '#fff1d6', '#ffffff');
    // an engraved ring marks it (it must read against the city's glow)
    ctx.save(); ctx.strokeStyle = rgba('#fff6e6', .9 * a * bead); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(X, Y, 15 + 1.5 * Math.sin(t * 4), 0, TAU); ctx.stroke();
    ctx.strokeStyle = rgba('#fff6e6', .35 * a * bead); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(X, Y, 22 + 1.5 * Math.sin(t * 4 + 1), 0, TAU); ctx.stroke(); ctx.restore();
  }
}
export { ptAt };

// ---------------------------------------------------------------- the Kardashev ladder
export const LAD = { phi: -.5, r0: EARTH.R + 4, r1: 4760, rungs: [EARTH.RD, 4170, 4600], hw: 130, labels: ['TYPE I', 'TYPE II', 'TYPE III'], sub: ['PLANET', 'STAR', 'GALAXY'] };
export function ladder(ctx, t, m, o = {}) {
  const grow = o.grow ?? 0, a = o.a ?? 1; if (grow <= 0 || a <= 0) return;
  const ph = LAD.phi, dir = [Math.sin(ph), -Math.cos(ph)], nrm = [Math.cos(ph), Math.sin(ph)];
  const P = (r, s = 0) => [m.X(dir[0] * r + nrm[0] * s), m.Y(dir[1] * r + nrm[1] * s)];
  const rTop = mix(LAD.r0, LAD.r1, ease.out(grow));
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  // the rail: two fine engraved lines with cross-hatching between (a ladder of light), fading out toward the stars
  for (const sd of [-9, 9]) {
    const [x0, y0] = P(LAD.r0, sd), [x1, y1] = P(rTop, sd), gr = ctx.createLinearGradient(x0, y0, m.X(dir[0] * LAD.r1), m.Y(dir[1] * LAD.r1));
    gr.addColorStop(0, rgba(F7.rim, .95 * a)); gr.addColorStop(.75, rgba(F7.rim, .6 * a)); gr.addColorStop(1, rgba(F7.rim, .05 * a));
    ctx.strokeStyle = gr; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
  }
  ctx.strokeStyle = rgba(F7.rim, .32 * a); ctx.lineWidth = 1; ctx.beginPath();
  for (let r = LAD.r0 + 20; r < rTop; r += 34) { const [x0, y0] = P(r, -9), [x1, y1] = P(r + 17, 9); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); }
  ctx.stroke();
  // the growing tip
  if (grow < 1) { const [x, y] = P(rTop); glowAt(ctx, x, y, 30, .7 * a, F7.rim, '#ffffff'); }
  ctx.restore();
  // rungs: each lights as the tip passes it (a bar of light across the rail), a label beside it
  LAD.rungs.forEach((rr, i) => {
    const on = ease.out(clamp((rTop - rr) / 160)); if (on <= 0) return;
    const fl = (o.flare?.[i] ?? 0), hw = LAD.hw * (.25 + .75 * on) * (i === 0 ? 1 : i === 1 ? .9 : .8), al = a * (i === 0 ? 1 : i === 1 ? .8 : .62) * (1 + .8 * fl);
    const [xa, ya] = P(rr, -hw), [xb, yb] = P(rr, hw), [xc, yc] = P(rr);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    for (const [lw, aa, col] of [[12, .07, F7.rim], [3.4, .3, F7.rim], [1.4, .95, '#ffffff']]) { ctx.strokeStyle = rgba(col, clamp(aa * al)); ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(xa, ya); ctx.lineTo(xb, yb); ctx.stroke(); }
    if (fl > 0) glowAt(ctx, xc, yc, 120 * (.6 + .4 * fl), .45 * fl * a, F7.rim, '#ffffff');
    ctx.restore();
    // the label (horizontal, to the right of the rung's end), wiped in
    const lu = ease.out(lin(o.lab?.[i] ?? 0, (o.lab?.[i] ?? 0) + .5, t)); if (lu <= 0) return;
    const lx = xb + 26, ly = yb + 10;
    ctx.save(); ctx.beginPath(); ctx.rect(lx - 4, ly - 40, 260 * lu, 70); ctx.clip();
    text(ctx, LAD.labels[i], lx, ly, { size: i === 0 ? 30 : 24, weight: 600, color: rgba('#eef2ff', (i === 0 ? .98 : .8) * a), spacing: 5 });
    text(ctx, LAD.sub[i], lx + 1, ly + 22, { size: 14, weight: 600, color: rgba('#aab4d8', .85 * a), spacing: 4 });
    ctx.restore();
  });
  // "US": a small warm dot on the rail just below rung I
  const us = o.us ?? 0;
  if (us > 0) {
    const r = mix(LAD.r0 + 30, LAD.rungs[0] - 70, ease.out(clamp(us))) + (o.usLift ?? 0), [X, Y] = P(r), br = 1 + .06 * Math.sin(t * 3);
    glowAt(ctx, X, Y, 40 * br, .5 * a, F7.amber, F7.amberCore); glowAt(ctx, X, Y, 9, .95 * a, '#fff1d6', '#ffffff');
    const lu = ease.out(lin(o.usLab ?? 0, (o.usLab ?? 0) + .4, t));
    if (lu > 0) { ctx.save(); ctx.beginPath(); ctx.rect(X + 24, Y - 24, 120 * lu, 40); ctx.clip(); text(ctx, 'US', X + 30, Y + 7, { size: 20, weight: 600, color: rgba('#ffe2b8', .95 * a), spacing: 5 }); ctx.restore(); }
  }
}

// ---------------------------------------------------------------- the stage at the curve's foot; its screen is the glass plate
export const STG = { cx: -238, y: -2906, sw: 120, sh: 68, leg: 14 };   // world: ground line y, screen width/height, leg height
export function stageRect(m) { const x0 = STG.cx - STG.sw / 2, y1 = STG.y - STG.leg, y0 = y1 - STG.sh; return { x: m.X(x0), y: m.Y(y0), w: STG.sw * m.k, h: STG.sh * m.k }; }
export function stage(ctx, t, m, o = {}, plate) {
  const g = o.grow ?? 0; if (g <= 0) return null;
  const k = m.k, x0 = STG.cx - STG.sw / 2, x1 = STG.cx + STG.sw / 2, yg = STG.y, y1 = yg - STG.leg, y0 = y1 - STG.sh;
  // grows out of the ground: the whole structure rises (clipped at the ground line), solid, never transparent
  const rise = (1 - ease.out(g)) * (STG.sh + STG.leg + 16);
  const X = m.X, Y = (y) => m.Y(y + rise);
  ctx.save();
  ctx.beginPath(); ctx.rect(-10, -10, W + 20, m.Y(yg) + 10 + 1.2 * k); ctx.clip();
  // light towers with lamps
  for (const sx of [x0 - 14, x1 + 14]) {
    ctx.fillStyle = '#121030'; ctx.fillRect(X(sx) - 1.1 * k, Y(y0 - 6), 2.2 * k, (yg - y0 + 6) * k);
    for (let i = 0; i < 3; i++) { const ly = Y(y0 - 2 + i * 7); ctx.fillStyle = '#1c1a40'; ctx.beginPath(); ctx.arc(X(sx), ly, 1.8 * k, 0, TAU); ctx.fill(); }
  }
  // truss over the screen
  ctx.strokeStyle = '#1b1a3c'; ctx.lineWidth = 1.4 * k; ctx.strokeRect(X(x0 - 5), Y(y0 - 7), (STG.sw + 10) * k, (y1 - y0 + 7) * k);
  ctx.strokeStyle = rgba('#8c82dc', .45); ctx.lineWidth = Math.max(.6, .22 * k); ctx.beginPath();
  for (let x = x0 - 5; x < x1 + 5; x += 2.4) { ctx.moveTo(X(x), Y(y0 - 7.6)); ctx.lineTo(X(x + 1.2), Y(y0 - 6.4)); ctx.lineTo(X(x + 2.4), Y(y0 - 7.6)); }
  ctx.stroke();
  // legs and the platform
  ctx.fillStyle = '#0e0d24'; for (const lx of [x0 + 8, x1 - 8]) ctx.fillRect(X(lx) - 1.2 * k, Y(y1), 2.4 * k, STG.leg * k);
  ctx.fillStyle = '#100f26'; ctx.fillRect(X(x0 - 30), Y(yg - 3.5), (STG.sw + 60) * k, 4 * k);
  ctx.strokeStyle = rgba('#cfe6ff', .5); ctx.lineWidth = Math.max(.8, .25 * k); ctx.beginPath(); ctx.moveTo(X(x0 - 30), Y(yg - 3.5)); ctx.lineTo(X(x1 + 30), Y(yg - 3.5)); ctx.stroke();
  ctx.restore();
  // lamps glow (light, not objects)
  if (g > .6) for (const sx of [x0 - 14, x1 + 14]) for (let i = 0; i < 3; i++) glowAt(ctx, X(sx), Y(y0 - 2 + i * 7), 7 * k, .3 * (o.light ?? 1) * sm(lin(.6, 1, g)), '#cfe0f0', '#ffffff');
  // the screen: the glass plate (the c03>c04 surface) seen through the rect; the light of the words on top
  const sx = X(x0), sy = Y(y0), sw = STG.sw * k, shh = STG.sh * k, lit = o.lit ?? 1, off = o.off ?? 0;
  ctx.save(); ctx.beginPath(); ctx.rect(sx, Math.max(sy, -10), sw, Math.min(shh, m.Y(yg) - sy)); ctx.clip();
  plate(ctx, t);
  const L = lit * (1 - off);
  if (L > 0 || (off > 0 && off < 1)) {
    // CRT switch-off: the lit picture collapses to a bright line, the line to a point
    const vh = off <= 0 ? 1 : off < .7 ? Math.max(.004, 1 - ease.inn(off / .7)) : .004, hw = off < .7 ? 1 : Math.max(0, 1 - ease.out((off - .7) / .3));
    const cyS = sy + shh / 2, cxS = sx + sw / 2;
    ctx.save(); ctx.beginPath(); ctx.rect(cxS - sw / 2 * hw, cyS - shh / 2 * vh, sw * hw, shh * vh); ctx.clip();
    ctx.globalCompositeOperation = 'lighter';
    const gl = ctx.createLinearGradient(sx, sy, sx + sw, sy + shh); gl.addColorStop(0, rgba('#141a50', .9 * lit)); gl.addColorStop(1, rgba('#0a0c30', .7 * lit)); ctx.fillStyle = gl; ctx.fillRect(sx, sy, sw, shh);
    const bl = ctx.createRadialGradient(cxS, cyS, 0, cxS, cyS, sw * .5); bl.addColorStop(0, rgba('#b8c8ff', .2 * lit)); bl.addColorStop(1, 'rgba(184,200,255,0)'); ctx.fillStyle = bl; ctx.fillRect(sx, sy, sw, shh);
    ctx.globalCompositeOperation = 'source-over';
    const sz = shh * .15;
    ctx.save(); ctx.translate(cxS, cyS); ctx.scale(1, vh < 1 ? Math.max(.004, vh) : 1); ctx.translate(-cxS, -cyS);
    for (const [s, dy] of [['SUSTAINABLE', -.08], ['ABUNDANCE', .14]]) text(ctx, s, cxS, sy + shh * (.5 + dy) + sz * .35, { size: sz, weight: 600, color: rgba('#eef2ff', .95 * lit), align: 'center', spacing: sz * .22 });
    ctx.restore();
    ctx.globalAlpha = .06 * lit; ctx.fillStyle = '#000'; for (let yy = sy; yy < sy + shh; yy += 3 * Math.max(1, k * .25)) ctx.fillRect(sx, yy, sw, 1.2 * Math.max(1, k * .25)); ctx.globalAlpha = 1;
    ctx.restore();
    if (off > 0 && off < 1) {   // the collapsing picture brightens into a thin line (only as it gets thin), the line shrinks to a point and goes out
      const col = sm(clamp(1 - vh)), fade = 1 - sm(lin(.75, 1, off)), lh = Math.max(1.5, shh * vh);
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (const [lw, al] of [[18, .1], [5, .3]]) { ctx.strokeStyle = rgba(F7.coolCore, al * col * fade * 1.6); ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(cxS - sw / 2 * hw, cyS); ctx.lineTo(cxS + sw / 2 * hw, cyS); ctx.stroke(); }
      ctx.fillStyle = rgba('#ffffff', .8 * col * col * fade); ctx.fillRect(cxS - sw / 2 * hw, cyS - lh / 2, sw * hw, lh); ctx.restore(); }
  }
  ctx.restore();
  // the frame of the screen (outside the glass)
  ctx.strokeStyle = rgba('#cfe6ff', .35 + .1 * L); ctx.lineWidth = Math.max(1, .3 * k); ctx.strokeRect(sx, sy, sw, Math.min(shh, m.Y(yg) - sy));
  // the screen light spills into the night
  if (L > 0) { const r = sw * .95, gg = ctx.createRadialGradient(sx + sw / 2, sy + shh / 2, r * .3, sx + sw / 2, sy + shh / 2, r); gg.addColorStop(0, rgba('#cfe0f0', .08 * L)); gg.addColorStop(1, 'rgba(207,224,240,0)'); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = gg; ctx.fillRect(sx + sw / 2 - r, sy + shh / 2 - r, 2 * r, 2 * r); ctx.restore(); }
  return { x: sx, y: sy, w: sw, h: shh };
}
export { n1 };
