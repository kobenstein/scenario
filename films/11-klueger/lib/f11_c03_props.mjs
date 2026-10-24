// Film 11 · c03 props (sixteen programmers, the clock on the slate and its reflection, the brass balance, the Chiang card, the crate of weights,
// the big machine's shadow, the sun patch that carries the light plate). Same style as lib/f11_kit.mjs; everything a pure function of t.
//   PROG / programmers(ctx, t, V, o)        two rows of eight desks along the mirror (z 4.3…12.35), o.mirror: draw the reflections
//   clockChalk(ctx, cx, cy, r, o)           chalk clock: o.exp (dashed short arc, expected), o.meas (the long arc), o.hand angle progress
//   balance(ctx, t, V, p, o)                a brass balance on a gym box; o.tilt −1…1 (+ = "trust" pan up), labels on paper tags
//   quoteCard(ctx, lines, o)                a pinned paper card in card cm
//   crate(ctx, x, y, s, o)                  a wooden crate of six dumbbells (machine local cm, contact point at its bottom centre)
//   bigShadow(ctx, V, u)                    the shadow of a far bigger machine sliding over the floor (u 0…1 across)
//   sunPanes(i)  the floor patches of window i (world points); SUNPANE: the patch that carries the light plate (c03>c04)
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, prng } from '../engine.mjs';
import * as K from './f11_kit.mjs';
import { plate } from './handoff4.mjs';

const TAU = Math.PI * 2;
const fillP = (ctx, V, pts, col) => { if (V.poly(ctx, pts)) { ctx.fillStyle = col; ctx.fill(); return true; } return false; };
const brass = (ctx, x0, y0, x1, y1) => { const g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, K.PAL.brassDark); g.addColorStop(.4, K.PAL.brass); g.addColorStop(.6, K.PAL.brassLit); g.addColorStop(1, K.PAL.brassDark); return g; };

// ---------------------------------------------------------------- the programmers (METR): rows A (by the glass) and B, eight desks each
export const PROG = (() => { const p = []; for (const [row, x] of [['A', 9.7], ['B', 7.95]]) for (let k = 0; k < 8; k++) p.push({ row, k, x, z: 4.3 + k * 1.15, v: (k * 5 + (row === 'A' ? 2 : 7)) % 12, machine: (k + (row === 'A' ? 0 : 1)) % 2 === 0 }); return p; })();
export function programmers(ctx, t, V, o = {}) {
  const mir = !!o.mirror;
  const list = PROG.map((d) => { const p = mir ? K.mirrorPt([d.x, 0, d.z]) : [d.x, 0, d.z]; return { d, p, z: V.toCam([p[0], .8, p[2]])[2] }; }).filter((e) => e.z > .6).sort((a, b) => b.z - a.z);
  for (const { d, p } of list) {
    const dp = mir ? K.mirrorPt([d.x + .62, 0, d.z]) : [d.x + .62, 0, d.z];
    if (!mir) K.stool(ctx, V, p);
    if (mir) { const S = K.sprite(V, p); if (S.vis) { ctx.save(); ctx.translate(S.x, 0); ctx.scale(-1, 1); ctx.translate(-S.x, 0); K.student(ctx, V, p, { v: d.v, pose: (d.k + t * .0) % 3 === 1 ? 'look' : 'write' }); ctx.restore(); } }
    else K.student(ctx, V, p, { v: d.v, pose: d.k % 3 === 1 ? 'look' : 'write', live: o.live && o.live.has(d.row + d.k) ? t : null });
    K.desk3(ctx, V, dp, { sheet: 1 });
    // their own project papers: a small pile on the far half of the desk
    pile(ctx, V, [dp[0] + (mir ? -.1 : .1), .74, d.z + .28], .06 + .05 * ((d.k * 7 + (d.row === 'A' ? 3 : 0)) % 3));
    if (d.machine) { const S = K.sprite(V, [dp[0] + (mir ? -.1 : .1), .74, d.z - .3]); if (S.vis && S.z > .5) { ctx.save(); ctx.translate(S.x, S.y); ctx.scale(S.k / 100, S.k / 100); K.deskMachine(ctx, t, { core: o.lamp ?? .8, seed: d.k + 3 }); ctx.restore(); } }
  }
}
function pile(ctx, V, p, h) {
  const [x, y, z] = p, hx = .11, hz = .15;
  fillP(ctx, V, [[x - hx, y, z - hz], [x - hx, y, z + hz], [x - hx, y + h, z + hz], [x - hx, y + h, z - hz]], '#e2d6bb');
  fillP(ctx, V, [[x - hx, y, z - hz], [x + hx, y, z - hz], [x + hx, y + h, z - hz], [x - hx, y + h, z - hz]], '#cdbf9f');
  fillP(ctx, V, [[x - hx, y + h, z - hz], [x + hx, y + h, z - hz], [x + hx, y + h, z + hz], [x - hx, y + h, z + hz]], '#f6efdf');
}

// ---------------------------------------------------------------- the chalk clock
// angles from 12 o'clock clockwise (radians). o: { exp: u (dashed arc to EXP), meas: u (arc to MEAS), base: u (the usual time, a tick), label, col }
export const CLK = { base: Math.PI * 1.5, exp: Math.PI * 1.5 / 1.24, meas: Math.PI * 1.5 * 1.19, felt: Math.PI * 1.5 / 1.2 };
export function clockChalk(ctx, cx, cy, r, o = {}) {
  const u0 = clamp(o.face ?? 1); if (u0 <= 0) return;
  K.chalkLine(ctx, circ(cx, cy, r, 0, TAU * u0, 48), { lw: 2.4, a: .85 });
  if (u0 >= 1) {
    ctx.save(); ctx.strokeStyle = rgba(K.PAL.chalk, .8); ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.beginPath();
    for (let k = 0; k < 12; k++) { const a = k * TAU / 12, l = k % 3 ? .1 : .18; ctx.moveTo(cx + Math.sin(a) * r * (1 - l), cy - Math.cos(a) * r * (1 - l)); ctx.lineTo(cx + Math.sin(a) * r * .97, cy - Math.cos(a) * r * .97); }
    ctx.stroke(); ctx.restore();
  }
  // the usual time (without the machine): a small mark on the rim
  if (o.base) { const a = CLK.base; K.chalkLine(ctx, [[cx + Math.sin(a) * r * 1.05, cy - Math.cos(a) * r * 1.05], [cx + Math.sin(a) * r * 1.25, cy - Math.cos(a) * r * 1.25]], { u: o.base, lw: 2.6, a: .75 }); }
  const arc = (A, u, col, dash, rr) => { if (u <= 0) return; K.chalkLine(ctx, circ(cx, cy, r * rr, 0, A * u, 40), { lw: 3.4, col, dash, a: .95 }); };
  arc(o.expA ?? CLK.exp, o.exp ?? 0, o.expCol || '#cfe6f2', [7, 6], .78);
  arc(CLK.meas, o.meas ?? 0, o.measCol || K.PAL.effort, null, .62);
  // the hand (minute hand) at its current angle
  if (o.hand != null) {
    const a = o.hand; ctx.save(); ctx.strokeStyle = rgba(K.PAL.chalk, .95); ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(a) * r * .86, cy - Math.cos(a) * r * .86); ctx.stroke();
    ctx.fillStyle = rgba(K.PAL.chalk, .95); ctx.beginPath(); ctx.arc(cx, cy, 2.6, 0, TAU); ctx.fill(); ctx.restore();
  }
}
const circ = (cx, cy, r, a0, a1, n) => { const p = []; for (let i = 0; i <= n; i++) { const a = mix(a0, a1, i / n); p.push([cx + Math.sin(a) * r, cy - Math.cos(a) * r]); } return p; };

// ---------------------------------------------------------------- the brass balance on a gym box (the survey)
// p = floor point under the box; the beam runs along x (seen side on from the hall's front). o: { tilt: −1…1 (+ = the "trust" pan rises) }
export function balance(ctx, t, V, p, o = {}) {
  const [x, , z] = p, bh = .78;
  K.floorShadow(ctx, V, [x, 0, z], .45, .32, .25);
  // the gym box (Kasten): wooden layers with a leather top
  const hx = .42, hz = .28;
  fillP(ctx, V, [[x - hx, 0, z - hz], [x + hx, 0, z - hz], [x + hx - .04, bh, z - hz], [x - hx + .04, bh, z - hz]], '#b98a57');
  ctx.strokeStyle = 'rgba(90,60,30,.5)'; ctx.lineWidth = 1.2; ctx.beginPath(); for (let k = 1; k < 4; k++) { const yy = k * bh / 4; V.seg(ctx, [x - hx + .01 * k, yy, z - hz - .002], [x + hx - .01 * k, yy, z - hz - .002]); } ctx.stroke();
  fillP(ctx, V, [[x - hx + .04, bh, z - hz], [x + hx - .04, bh, z - hz], [x + hx - .04, bh, z + hz], [x - hx + .04, bh, z + hz]], '#8a5236');
  // the balance (local cm on a sprite standing on the box top)
  const S = K.sprite(V, [x, bh, z]); if (!S.vis) return;
  const k = S.k / 100, tilt = clamp(o.tilt ?? 0, -1, 1), ang = -.32 * tilt;
  ctx.save(); ctx.translate(S.x, S.y); ctx.scale(k, k);
  ctx.fillStyle = brass(ctx, -16, 0, 16, 0); ctx.beginPath(); ctx.ellipse(0, -2, 16, 3.5, 0, 0, TAU); ctx.fill(); ctx.fillRect(-2.2, -48, 4.4, 46);
  ctx.beginPath(); ctx.arc(0, -50, 3.6, 0, TAU); ctx.fill();
  const L = 30, ex = Math.cos(ang) * L, ey = Math.sin(ang) * L;
  ctx.strokeStyle = brass(ctx, -L, -50, L, -50); ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-ex, -50 - ey); ctx.lineTo(ex, -50 + ey); ctx.stroke();
  ctx.save(); ctx.translate(0, -50); ctx.rotate(ang); ctx.fillStyle = K.PAL.brassDark; ctx.beginPath(); ctx.moveTo(-2, -2); ctx.lineTo(0, -9); ctx.lineTo(2, -2); ctx.fill(); ctx.restore();
  const pan = (px, py, label, col) => {
    ctx.strokeStyle = rgba(K.PAL.brassDark, .9); ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - 9, py + 20); ctx.moveTo(px, py); ctx.lineTo(px + 9, py + 20); ctx.stroke();
    ctx.fillStyle = brass(ctx, px - 11, 0, px + 11, 0); ctx.beginPath(); ctx.ellipse(px, py + 21, 11, 2.6, 0, 0, Math.PI); ctx.fill();
    // a paper tag hanging below the pan
    ctx.fillStyle = '#f3ead6'; ctx.fillRect(px - 10, py + 26, 20, 7.4); ctx.strokeStyle = 'rgba(90,60,30,.4)'; ctx.lineWidth = .4; ctx.strokeRect(px - 10, py + 26, 20, 7.4);
    ctx.fillStyle = col; ctx.font = '600 3.4px Inter'; ctx.textAlign = 'center'; ctx.fillText(label, px, py + 31.2); ctx.textAlign = 'left';
  };
  pan(-ex, -50 - ey, 'TRUST', '#3f6a7a');
  pan(ex, -50 + ey, 'THINKING', '#8a5a20');
  // a cool glow sits in the trust pan (the machine), a warm one in the thinking pan (your effort), dimming as it sinks
  const g1 = ctx.createRadialGradient(-ex, -50 - ey + 18, 0, -ex, -50 - ey + 18, 9); g1.addColorStop(0, rgba(K.PAL.core, .9)); g1.addColorStop(1, rgba(K.PAL.core, 0)); ctx.fillStyle = g1; ctx.beginPath(); ctx.arc(-ex, -50 - ey + 18, 9, 0, TAU); ctx.fill();
  const wa = .9 - .5 * Math.max(0, tilt), g2 = ctx.createRadialGradient(ex, -50 + ey + 18, 0, ex, -50 + ey + 18, 8); g2.addColorStop(0, rgba(K.PAL.effort, wa)); g2.addColorStop(1, rgba(K.PAL.effort, 0)); ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(ex, -50 + ey + 18, 8, 0, TAU); ctx.fill();
  ctx.restore();
}

// ---------------------------------------------------------------- a pinned quote card (card cm, origin top left)
export function quoteCard(ctx, w, h, lines, src, o = {}) {
  ctx.save();
  ctx.fillStyle = 'rgba(40,26,18,.35)'; ctx.fillRect(3, 4, w, h);
  const g = ctx.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#f8f1e2'); g.addColorStop(1, '#eadcbf'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#3a2a22'; ctx.font = `${o.size ?? 6}px "Instrument Serif"`;
  lines.forEach((s, i) => ctx.fillText(s, o.pad ?? 7, (o.top ?? 14) + i * (o.lead ?? 8.2)));
  ctx.font = '600 2.6px Inter'; ctx.fillStyle = '#7a5a42'; let xx = o.pad ?? 7; for (const ch of src) { ctx.fillText(ch, xx, h - 6); xx += ctx.measureText(ch).width + .55; }
  for (const [px, py] of [[6, 4], [w - 6, 4]]) { ctx.fillStyle = '#b23a2a'; ctx.beginPath(); ctx.arc(px, py, 1.4, 0, TAU); ctx.fill(); }
  ctx.restore();
}

// ---------------------------------------------------------------- a wooden crate of six dumbbells of light (machine local cm, origin = bottom centre)
export function crate(ctx, t, x, y, o = {}) {
  const w = 52, h = 34;
  ctx.save(); ctx.translate(x, y);
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) K.dumbbell(ctx, t, -17 + c * 17, -9 - r * 15, { r: 8, glow: o.glow ?? .15 });
  ctx.fillStyle = '#9d6c41'; ctx.fillRect(-w / 2, -h * .45, w, h * .45);   // the front board covers the lower row half
  ctx.fillStyle = '#c99a62'; ctx.fillRect(-w / 2, -h * .45, w, 3);
  ctx.strokeStyle = 'rgba(70,45,25,.6)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(-w / 2, -h * .22); ctx.lineTo(w / 2, -h * .22); ctx.stroke();
  ctx.fillStyle = K.PAL.brass; for (const sx of [-w / 2, w / 2 - 3]) ctx.fillRect(sx, -h * .45, 3, h * .45);
  ctx.restore();
}

// ---------------------------------------------------------------- the shadow of a far bigger machine (outside the windows) sliding over the floor
// a soft silhouette (column, a huge ring of its core, a fork tine) cast along the sun; u: 0…1 its pass from the window wall across the hall
export function bigShadow(ctx, V, u, o = {}) {
  if (u <= 0 || u >= 1) return;
  const cx = mix(-14, 14, u), cz = (o.z ?? 12) + mix(-3, 3, u), a = (o.a ?? .2) * Math.sin(Math.PI * u) ** .5;
  const pts = (rx, rz, n = 28) => { const p = []; for (let i = 0; i < n; i++) { const q = TAU * i / n; p.push([cx + Math.cos(q) * rx, .004, cz + Math.sin(q) * rz]); } return p; };
  ctx.save();
  for (const [g, al] of [[1.25, .35], [1.1, .6], [1, 1]]) {
    ctx.fillStyle = rgba('#4a2e1c', a * al * .55);
    // the column: a long band along the sun direction, the core's ring, the fork: a narrow band
    if (V.poly(ctx, [[cx - .5 * g, .004, cz - 9], [cx + .5 * g, .004, cz - 9], [cx + .5 * g, .004, cz + 9], [cx - .5 * g, .004, cz + 9]])) ctx.fill();
    if (V.poly(ctx, pts(3.4 * g, 2.6 * g))) ctx.fill();
    if (V.poly(ctx, [[cx + .4, .004, cz - 5.6 * g], [cx + 7 * g, .004, cz - 5.2 * g], [cx + 7 * g, .004, cz - 4.6 * g], [cx + .4, .004, cz - 4.7]])) ctx.fill();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the sun patches (as the kit: each pane of a window cast along SUN onto the floor)
const toFloor = ([z, y]) => { const s = y / -K.SUN[1]; return [K.HALL.x0 + K.SUN[0] * s, .003, z + K.SUN[2] * s]; };
export function sunPanes(i) {
  const w = K.WINDOWS[i], panes = [], cols = 3, rows = 4, gx = .07, z0 = w.z - w.w / 2, pw = w.w / cols, ph = (w.y1 - w.y0) / rows;
  for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) {
    const a = z0 + c * pw + gx, b = z0 + (c + 1) * pw - gx, y0 = w.y0 + r * ph + gx, y1 = w.y0 + (r + 1) * ph - gx;
    panes.push({ c, r, pts: [[a, y0], [b, y0], [b, y1], [a, y1]].map(toFloor) });
  }
  return panes;
}
// the patch that carries the light plate: window 2, middle column, top row (lands on free floor at x -0.78, z 19.3, just left of the Go grid)
export const SUNPANE = sunPanes(2).find((p) => p.c === 1 && p.r === 3);
export const SUNC = (() => { const P = SUNPANE.pts; return [P.reduce((s, p) => s + p[0], 0) / 4, 0, P.reduce((s, p) => s + p[2], 0) / 4]; })();
// draw the plate into the patch (call after the hall, before the actors); it is the same light the kit lays there, at full strength
// the camera that sees only the plate: straight down over the patch (screen x along world x: the pane is 1.85 m in x, 0.73 m in z)
export const SUNCAM = { x: SUNC[0], y: .62, z: SUNC[2] - .04, yaw: 0, pitch: -1.5, f: 1700 };
export function sunPlatePatch(ctx, t, V) {
  if (!V.poly(ctx, SUNPANE.pts)) return;
  ctx.save(); ctx.clip(); plate(ctx, t, 'light', { tone: 'sun' }); ctx.restore();
}
