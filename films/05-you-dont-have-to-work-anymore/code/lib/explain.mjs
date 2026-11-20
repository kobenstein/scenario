// Explainer overlays for film 02 v2: small animated diagrams laid over a plate so each shot shows what the line says.
// Each export returns fx(ctx, t, cam). Screen-space unless noted; world-space ones take plate coords and use mapper(cam).
import { W, H, C, rgba, clamp, lin, mix, eio, eout, prng, addGlow, text, mapper } from '../engine.mjs';

function rrect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
const panel = (ctx, x, y, w, h, a) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(7,9,24,.72)'; rrect(ctx, x, y, w, h, 18); ctx.fill(); ctx.strokeStyle = rgba(C.cream, .14); ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); };
const life = (t, t0, t1) => eout(lin(t0, t0 + .6, t)) * (1 - lin(t1, t1 + .6, t));
const fmtH = (h) => h >= 1 ? `${Math.round(h)} h` : `${Math.round(h * 60)} min`;

// one bar that collapses from `from` to `to` (e.g. a report: a whole working day -> under an hour), with a running clock
export const shrinkBar = ({ t0, t1, tShrink, title, from = 9, to = .8, fromLabel, toLabel, x = 1060, y = 700, w = 720 }) => (ctx, t) => {
  const a = life(t, t0, t1); if (a <= 0) return;
  panel(ctx, x - 40, y - 110, w + 80, 260, a);
  text(ctx, title.toUpperCase(), x, y - 56, { size: 20, weight: 600, color: C.muted, spacing: 6, alpha: a });
  const grow = eout(lin(t0 + .3, t0 + 1.6, t)), sh = eio(lin(tShrink, tShrink + 1.6, t));
  const hrs = mix(from * grow, to, sh), bw = w * hrs / from;
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = rgba(C.cream, .1); rrect(ctx, x, y - 20, w, 46, 10); ctx.fill();
  ctx.fillStyle = sh > .5 ? C.cyan : C.amber; rrect(ctx, x, y - 20, Math.max(12, bw), 46, 10); ctx.fill(); ctx.restore();
  if (sh > .3) addGlow(ctx, x + bw, y + 3, 60, .5 * a * (1 - Math.abs(sh - .65)), C.cyan, C.cyanWhite);
  text(ctx, sh < .5 ? (fromLabel ?? fmtH(hrs)) : (toLabel ?? fmtH(hrs)), x, y + 92, { size: 54, font: 'Instrument Serif', color: sh < .5 ? C.amber : C.cyan, alpha: a });
  text(ctx, fmtH(hrs), x + w, y + 92, { size: 34, font: 'Instrument Serif', color: C.muted, align: 'right', alpha: a });
};

// bars compared side by side, each grows at its own time; value text counts up
export const bars = ({ t0, t1, title, rows, x = 1080, y = 600, w = 640, note }) => (ctx, t) => {
  const a = life(t, t0, t1); if (a <= 0) return;
  const hh = 120 + rows.length * 110 + (note ? 50 : 0);
  panel(ctx, x - 40, y - 100, w + 80, hh, a);
  text(ctx, title.toUpperCase(), x, y - 48, { size: 20, weight: 600, color: C.muted, spacing: 6, alpha: a });
  const max = Math.max(...rows.map((r) => r.v));
  rows.forEach((r, i) => {
    const g = eout(lin(r.t, r.t + 1.4, t)), yy = y + i * 110;
    text(ctx, r.label, x, yy + 10, { size: 28, color: C.cream, alpha: a * clamp(g * 3 + .3) });
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = rgba(C.cream, .08); rrect(ctx, x, yy + 26, w, 36, 8); ctx.fill();
    ctx.fillStyle = r.col ?? C.amber; rrect(ctx, x, yy + 26, Math.max(8, w * r.v / max * g), 36, 8); ctx.fill(); ctx.restore();
    text(ctx, r.fmt ? r.fmt(r.v * g) : String(Math.round(r.v * g)), x + w, yy + 10, { size: 40, font: 'Instrument Serif', color: r.col ?? C.amber, align: 'right', alpha: a * clamp(g * 3) });
  });
  if (note) text(ctx, note, x, y + rows.length * 110 + 30, { size: 30, font: 'Instrument Serif Italic', color: C.cyan, alpha: a * lin(rows[rows.length - 1].t + 1, rows[rows.length - 1].t + 1.6, t) });
};

// a proof scrolling past a scan line: every step that passes gets a check mark; counter of checked steps
const PROOF = ['theorem bound (n : ℕ) : packing n ≤ B n', 'intro n', 'have h₁ := lattice_cover n', 'apply le_trans h₁', 'rw [density_eq]', 'exact cube_bound n', 'have h₂ : 0 < r := by positivity', 'nlinarith [h₂, sq_nonneg r]', 'simp [volume_ball]', 'refine ⟨_, rfl⟩', 'norm_num', 'exact h₂.le', 'linarith', 'ring_nf', 'qed'];
export const proof = ({ t0, t1, x = 1120, y = 160, w = 660, h = 720, rate = 2.2, label = 'steps a computer has checked', fail }) => (ctx, t) => {
  const a = life(t, t0, t1); if (a <= 0) return;
  panel(ctx, x, y, w, h, a);
  const lh = 46, scan = y + h * .62, off = (t - t0) * rate * lh;
  ctx.save(); rrect(ctx, x, y, w, h - 90, 18); ctx.clip();
  for (let i = 0; i < 80; i++) {
    const ly = y + h - 120 + i * lh - off; if (ly < y - lh || ly > y + h) continue;
    const s = PROOF[i % PROOF.length], passed = ly < scan, bad = fail && i === fail;
    text(ctx, s, x + 40 + (i % 3 ? 26 : 0), ly, { size: 26, font: 'Inter', weight: 400, color: passed ? (bad ? C.rose : C.cream) : C.muted, alpha: a * (passed ? .95 : .55) });
    if (passed) { const ca = eout(lin(0, lh * .6, scan - ly)); text(ctx, bad ? '✗' : '✓', x + w - 50, ly, { size: 30, color: bad ? C.rose : '#9be8a8', alpha: a * ca }); }
  }
  ctx.restore();
  ctx.save(); ctx.globalAlpha = a * .7; ctx.strokeStyle = C.cyan; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 20, scan + 12); ctx.lineTo(x + w - 20, scan + 12); ctx.stroke(); ctx.restore();
  const n = Math.max(0, Math.floor(((t - t0) * rate * lh - (y + h - 120 - scan)) / lh) + 1);
  text(ctx, label.toUpperCase(), x + 40, y + h - 48, { size: 18, weight: 600, color: C.muted, spacing: 5, alpha: a });
  text(ctx, String(n), x + w - 40, y + h - 36, { size: 52, font: 'Instrument Serif', color: '#9be8a8', align: 'right', alpha: a });
};

// a clock face whose hand races through `hours`; big running hour count
export const clock = ({ t0, t1, tRun0, tRun1, hours = 18, x = 1560, y = 330, r = 130, label = 'still working' }) => (ctx, t) => {
  const a = life(t, t0, t1); if (a <= 0) return;
  const u = eio(lin(tRun0, tRun1, t)), hr = u * hours;
  ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = 'rgba(7,9,24,.7)'; ctx.beginPath(); ctx.arc(x, y, r + 30, 0, 7); ctx.fill();
  ctx.strokeStyle = rgba(C.cream, .5); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke();
  for (let i = 0; i < 12; i++) { const an = i / 12 * 6.283; ctx.beginPath(); ctx.moveTo(x + Math.sin(an) * r * .86, y - Math.cos(an) * r * .86); ctx.lineTo(x + Math.sin(an) * r * .96, y - Math.cos(an) * r * .96); ctx.stroke(); }
  // elapsed arc
  ctx.strokeStyle = C.amber; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(x, y, r + 16, -Math.PI / 2, -Math.PI / 2 + hr / 12 * 6.283 % 6.2831 + (hr >= 12 ? 0 : 0)); ctx.stroke();
  const mh = hr * 6.283, hh = hr / 12 * 6.283;
  ctx.strokeStyle = C.cream; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(mh) * r * .8, y - Math.cos(mh) * r * .8); ctx.stroke();
  ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(hh) * r * .5, y - Math.cos(hh) * r * .5); ctx.stroke();
  ctx.restore();
  text(ctx, `${Math.floor(hr)} h`, x, y + r + 100, { size: 68, font: 'Instrument Serif', color: C.amber, align: 'center', alpha: a });
  text(ctx, label.toUpperCase(), x, y + r + 140, { size: 18, weight: 600, color: C.muted, align: 'center', spacing: 5, alpha: a * lin(tRun1 - 1, tRun1, t) });
};

// world-space: pins pop onto a wall map one after another, with ripples; lines link them; an hourly "updated" stamp
export const pins = ({ t0, t1, pts, step = .35, p = 1, hourly }) => (ctx, t, cam) => {
  const a = life(t, t0, t1); if (a <= 0) return;
  const m = mapper(cam, p, { dolly: .1 });
  const on = pts.map((q, i) => ({ X: m.X(q[0]), Y: m.Y(q[1]), u: lin(t0 + i * step, t0 + i * step + .4, t), tt: t0 + i * step }));
  ctx.save(); ctx.globalAlpha = a * .6; ctx.strokeStyle = C.cyan; ctx.lineWidth = 2;
  for (let i = 1; i < on.length; i++) if (on[i].u > 0) { const A = on[i - 1], B = on[i]; ctx.beginPath(); ctx.moveTo(A.X, A.Y); ctx.lineTo(mix(A.X, B.X, eout(on[i].u)), mix(A.Y, B.Y, eout(on[i].u))); ctx.stroke(); }
  ctx.restore();
  for (const q of on) {
    if (q.u <= 0) continue;
    const rip = lin(q.tt, q.tt + 1.2, t);
    ctx.save(); ctx.globalAlpha = a * (1 - rip) * .8; ctx.strokeStyle = C.amber; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(q.X, q.Y, 10 + 60 * rip * m.k, 0, 7); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = C.amber; ctx.beginPath(); ctx.arc(q.X, q.Y, 9 * eout(q.u) * Math.max(.8, m.k), 0, 7); ctx.fill(); ctx.restore();
  }
  if (hourly) { const n = Math.floor(clamp((t - t0) / hourly.every, 0, 9)); text(ctx, `UPDATED ${String(hourly.from + n).padStart(2, '0')}:00`, hourly.x ?? 100, hourly.y ?? 96, { size: 22, weight: 600, color: C.cyan, spacing: 6, alpha: a }); }
};

// line icons that appear in a row with labels: check / whistle (referee) / phone / lock
function icon(ctx, kind, x, y, s, col) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 5 / s * s; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.arc(0, 0, 58, 0, 7); ctx.stroke();
  ctx.beginPath();
  if (kind === 'check') { ctx.moveTo(-26, 2); ctx.lineTo(-6, 22); ctx.lineTo(28, -20); }
  else if (kind === 'eye') { ctx.moveTo(-34, 0); ctx.quadraticCurveTo(0, -30, 34, 0); ctx.quadraticCurveTo(0, 30, -34, 0); ctx.moveTo(10, 0); ctx.arc(0, 0, 10, 0, 7); }
  else if (kind === 'phone') { ctx.moveTo(-26, -8); ctx.quadraticCurveTo(-26, -24, -12, -24); ctx.lineTo(12, -24); ctx.quadraticCurveTo(26, -24, 26, -8); ctx.moveTo(-18, -4); ctx.lineTo(-24, 22); ctx.lineTo(24, 22); ctx.lineTo(18, -4); ctx.closePath(); }
  else if (kind === 'target') { ctx.arc(0, 0, 30, 0, 7); ctx.moveTo(14, 0); ctx.arc(0, 0, 14, 0, 7); ctx.moveTo(0, -42); ctx.lineTo(0, 42); }
  else if (kind === 'brake') { ctx.rect(-26, -20, 52, 40); ctx.moveTo(-10, -20); ctx.lineTo(-10, 20); ctx.moveTo(10, -20); ctx.lineTo(10, 20); }
  ctx.stroke(); ctx.restore();
}
export const icons = ({ items, t1, y = 860, x0, gap = 330, col = C.cream }) => (ctx, t) => {
  const n = items.length, start = x0 ?? W / 2 - (n - 1) * gap / 2;
  items.forEach((it, i) => {
    const a = eout(lin(it.t, it.t + .6, t)) * (1 - lin(t1, t1 + .6, t)); if (a <= 0) return;
    const x = start + i * gap, pop = 1 + .15 * Math.sin(Math.PI * lin(it.t, it.t + .5, t));
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(7,9,24,.6)'; ctx.beginPath(); ctx.arc(x, y, 76, 0, 7); ctx.fill(); ctx.restore();
    ctx.save(); ctx.globalAlpha = a; icon(ctx, it.kind, x, y, .9 * pop, it.col ?? col); ctx.restore();
    addGlow(ctx, x, y, 110, .3 * a * Math.exp(-Math.max(0, t - it.t) * 2), C.amber, '#fff3dd');
    text(ctx, it.label, x, y + 128, { size: 40, font: 'Instrument Serif', align: 'center', color: C.cream, alpha: a });
  });
};

// world-space: particles stream from the frame edges into one point (cheap intelligence flowing toward a use)
export const flow = ({ t0, t1, tx, ty, p = 1, n = 160, col = C.cyan }) => (ctx, t, cam) => {
  const a = life(t, t0, t1); if (a <= 0) return;
  const m = mapper(cam, p, { dolly: .1 }), X = m.X(tx), Y = m.Y(ty), r = prng(41);
  for (let i = 0; i < n; i++) {
    const ang = r() * 6.283, sp = .25 + r() * .35, ph = r();
    const u = ((t - t0) * sp + ph) % 1, d = (1 - eio(u)) * (900 + r() * 500);
    const x = X + Math.cos(ang) * d, y = Y + Math.sin(ang) * d * .6;
    ctx.fillStyle = rgba(col, a * .8 * Math.sin(Math.PI * u)); ctx.fillRect(x - 2, y - 2, 4, 4);
  }
  addGlow(ctx, X, Y, 120 * m.k, .35 * a, col, C.cyanWhite);
};

// short lines that appear one under another (e.g. the limits of a solution), each struck at its own time
export const chips = ({ items, t1, x = 100, y = 760, size = 50, col = C.cream }) => (ctx, t) => {
  items.forEach((it, i) => {
    const a = eout(lin(it.t, it.t + .5, t)) * (1 - lin(t1, t1 + .6, t)); if (a <= 0) return;
    const yy = y + i * (size * 1.5), dx = (1 - a) * -30;
    ctx.save(); ctx.globalAlpha = a * .75; ctx.fillStyle = 'rgba(7,9,24,.7)'; ctx.fillRect(x - 24 + dx, yy - size * 1.05, it.w ?? size * it.text.length * .5 + 60, size * 1.4); ctx.restore();
    text(ctx, it.text, x + dx, yy, { size, font: 'Instrument Serif', color: it.col ?? col, alpha: a });
  });
};

// world-space ring + label marking one spot in a plate ("never seen before")
export const mark = ({ t0, t1, x, y, r = 90, p = .4, top, big }) => (ctx, t, cam) => {
  const a = life(t, t0, t1); if (a <= 0) return;
  const m = mapper(cam, p, { dolly: .1 }), X = m.X(x), Y = m.Y(y), g = eout(lin(t0, t0 + 1, t));
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = C.amber; ctx.lineWidth = 3; ctx.setLineDash([10, 8]); ctx.lineDashOffset = -t * 20;
  ctx.beginPath(); ctx.arc(X, Y, r * m.k * mix(1.6, 1, g), 0, 7); ctx.stroke(); ctx.restore();
  const lx = X + r * m.k + 40, ly = Y - r * m.k - 20;
  ctx.save(); ctx.globalAlpha = a * .8; ctx.strokeStyle = C.amber; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X + r * m.k * .7, Y - r * m.k * .7); ctx.lineTo(lx, ly); ctx.lineTo(lx + 40, ly); ctx.stroke(); ctx.restore();
  if (top) text(ctx, top.toUpperCase(), lx + 52, ly - 30, { size: 18, weight: 600, color: C.muted, spacing: 5, alpha: a });
  if (big) text(ctx, big, lx + 52, ly + 14, { size: 48, font: 'Instrument Serif', color: C.amber, alpha: a });
};
