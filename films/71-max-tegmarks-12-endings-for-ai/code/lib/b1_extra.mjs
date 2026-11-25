// Film 71 · builder B1 (c02–c06) · additive helpers only (the shared kit stays untouched): the overlay technique of sc01 (ref / inRef /
// refPt), small explainer glyphs (dashed ring, camera, uniform, shield, padlock, cage, products, subscribe button, rack), B1's own mornings
// (the zoo room 10, the dawn street 9, the quiet room 8, the split room 7), the generic fly-through for them, and the boundary pictures
// that two of B1's chunks share (so a chunk's last frame and the next chunk's first frame are the same drawing).
import { Path2D } from '@napi-rs/canvas';
import * as F from './f71_kit.mjs';
import * as S from './f71_world.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, rad, prng, GOLD, CREAM, CREAM2, COOL, LAMP, PAPER, INK } = F;
const TAU = Math.PI * 2;

// ------------------------------------------------------------------------------------------------ overlays (as in sc01)
export const ref = (ctx, vd) => ctx.transform(1 / vd.s, 0, 0, 1 / vd.s, vd.x - W / 2 / vd.s, vd.y - H / 2 / vd.s);
export const inRef = (ctx, v, vd, fn, a = 1) => { if (a <= .002) return; F.inView(ctx, v, () => { ref(ctx, vd); ctx.globalAlpha *= a; fn(); }); };
export const refPt = (vd, x, y) => [W / 2 + (x - vd.x) * vd.s, H / 2 + (y - vd.y) * vd.s];
export const nz = (x) => (x > .002 ? x : undefined);
export const mixV = (a, b, u) => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), u)) });
export const withA = (ctx, a, fn) => { if (a <= .002) return; ctx.save(); ctx.globalAlpha *= a; fn(); ctx.restore(); };

// the big switch tag of a station sheds a mini tag that flies to its door in the counter HUD at the moment the HUD ticks the door
// (F.counterTimes(T).sign[n] + .6 … + 1.4); from = [x, y] screen point of the big tag
export function tagToHud(ctx, t, T, n, from) {
  const k = F.counterTimes(T), u = span(t, k.sign[n] + .5, k.sign[n] + 1.35); if (u <= 0 || u >= 1) return;
  const e = sineIO(u), tx = F.hudDoorX(n), ty = F.HUD.y + 44 - F.HUD.gh * 1.25 - 7;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const x = lerp(from[0], tx, e), y = lerp(from[1], ty, e) - 120 * Math.sin(Math.PI * e), s = lerp(1, .3, e);
  ctx.translate(x, y); ctx.scale(s, s); F.miniTag(ctx, 0, 0, 1, n); ctx.restore();
}

// ------------------------------------------------------------------------------------------------ glyphs
export function dashedRing(ctx, x, y, r, u, o = {}) {
  if (u <= 0) return;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.strokeStyle = o.col ?? rgba(CREAM, .8); ctx.lineWidth = o.w ?? 3; ctx.setLineDash(o.dash ?? [10, 9]); ctx.lineDashOffset = -(o.spin ?? 0);
  ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + TAU * expoOut(clamp(u))); ctx.stroke(); ctx.restore();
}
// the superintelligence: a cool disc with a ring and an inner pupil (machine = circle language); o.a, o.ring, o.pulse
export function machineDisc(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || r <= .5) return;
  ctx.save(); ctx.globalAlpha *= a;
  halo(ctx, x, y, r * 2.6, .4 * (o.glow ?? 1), COOL.halo, COOL.core);
  ctx.fillStyle = rad(ctx, x - r * .25, y - r * .25, r * 1.1, [[0, COOL.core], [.55, COOL.body], [1, mixHex(COOL.body, COOL.deep, .55)]]); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  const q = (t * .35) % 1;   // rings pulse inward when it thinks
  ctx.strokeStyle = rgba(COOL.core, .5 * (1 - q)); ctx.lineWidth = Math.max(1, r * .05); ctx.beginPath(); ctx.arc(x, y, r * (1.35 - q * .35), 0, TAU); ctx.stroke();
  ctx.fillStyle = mixHex(COOL.deep, P.night0, .3); ctx.beginPath(); ctx.arc(x, y, r * .3, 0, TAU); ctx.fill();
  ctx.restore();
}
// a security camera on a bracket: (x, y) = the mount, ang = where the lens looks (rad, 0 = right), s = size; o.col (COOL or LAMP), o.a
export function camGlyph(ctx, t, x, y, s, ang, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const col = o.col ?? COOL.body;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  ctx.fillStyle = mixHex(P.night1, P.ind2, .6); ctx.fillRect(-s * .08, -s * .1, s * .16, s * .45);
  ctx.rotate(ang);
  ctx.fillStyle = mixHex(P.ind2, P.blue1, .5); ctx.beginPath(); ctx.roundRect(-s * .15, -s * .22, s * .85, s * .44, s * .08); ctx.fill();
  ctx.strokeStyle = rgba(col, .6); ctx.lineWidth = Math.max(1, s * .04); ctx.stroke();
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(s * .7, 0, s * .13, 0, TAU); ctx.fill();
  ctx.restore();
  if ((o.glow ?? 1) > 0) halo(ctx, x + Math.cos(ang) * s * .7, y + Math.sin(ang) * s * .7, s * .8, .3 * a * (o.glow ?? 1), col, mixHex(col, '#ffffff', .5));
}
// a person in uniform: a person silhouette with a peaked cap; o as F.person (dir, light, look), o.a
export function uniform(ctx, x, y, h, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  F.person(ctx, x, y, h, { dir: o.dir ?? 1, light: o.light ?? 1, look: o.look ?? .2, walk: o.walk, view: o.view, back: o.back });
  const d = o.dir ?? 1, hx = x + (o.walk != null ? .0 : 0) * h, hy = y - h * .945;
  ctx.fillStyle = mixHex(P.night0, P.ind2, .35);
  ctx.beginPath(); ctx.roundRect(hx - h * .085, hy - h * .035, h * .17, h * .06, h * .015); ctx.fill();
  ctx.beginPath(); ctx.ellipse(hx + d * h * .04, hy + h * .024, h * .11, h * .016, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = rgba(CREAM, .75); ctx.fillRect(hx - h * .02, hy - h * .018, h * .04, h * .022);
  ctx.restore();
}
export function shield(ctx, x, y, s, u, o = {}) {
  if (u <= 0) return;
  const k = expoOut(clamp(u)); ctx.save(); ctx.globalAlpha *= clamp(u * 3) * (o.a ?? 1); ctx.translate(x, y); ctx.scale(k, k);
  const p = new Path2D(); p.moveTo(0, -s * .55); p.lineTo(s * .45, -s * .38); p.lineTo(s * .4, s * .1); p.quadraticCurveTo(s * .3, s * .42, 0, s * .58); p.quadraticCurveTo(-s * .3, s * .42, -s * .4, s * .1); p.lineTo(-s * .45, -s * .38); p.closePath();
  halo(ctx, 0, 0, s * 1.2, .3, LAMP.body, LAMP.core);
  ctx.fillStyle = mixHex(P.night1, P.ind2, .5); ctx.fill(p); ctx.strokeStyle = CREAM; ctx.lineWidth = s * .06; ctx.stroke(p);
  ctx.beginPath(); ctx.moveTo(-s * .16, 0); ctx.lineTo(-s * .03, s * .14); ctx.lineTo(s * .2, -s * .14); ctx.stroke();
  ctx.restore();
}
export function padlock(ctx, x, y, s, o = {}) {
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(x, y);
  ctx.strokeStyle = CREAM; ctx.lineWidth = s * .14; ctx.beginPath(); ctx.arc(0, -s * .1, s * .3, Math.PI, 0); ctx.lineTo(s * .3, s * .1 - (o.open ?? 0) * s * .3); ctx.moveTo(-s * .3, -s * .1); ctx.lineTo(-s * .3, s * .1); ctx.stroke();
  ctx.fillStyle = PAPER.lit; ctx.beginPath(); ctx.roundRect(-s * .48, s * .05, s * .96, s * .72, s * .1); ctx.fill();
  ctx.fillStyle = PAPER.ink; ctx.beginPath(); ctx.arc(0, s * .35, s * .09, 0, TAU); ctx.fill(); ctx.fillRect(-s * .03, s * .35, s * .06, s * .2);
  ctx.restore();
}
// a cage of bars around (cx, cy), w × h; u draws the bars on (from the top), o.a
export function cage(ctx, t, cx, cy, w, h, u, o = {}) {
  if (u <= 0) return;
  const x0 = cx - w / 2, y0 = cy - h / 2, n = o.n ?? 9;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.lineCap = 'round';
  ctx.strokeStyle = mixHex(CREAM, P.blue1, .35); ctx.lineWidth = o.lw ?? 7;
  for (let i = 0; i < n; i++) { const x = x0 + w * i / (n - 1), uu = expoOut(span(u, i * .05, .5 + i * .05)); if (uu <= 0) continue; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 + h * uu); ctx.stroke(); }
  ctx.lineWidth = (o.lw ?? 7) * 1.6; ctx.strokeStyle = mixHex(CREAM, P.blue1, .2);
  const r = expoOut(span(u, 0, .6)); ctx.beginPath(); ctx.moveTo(cx - w / 2 * r, y0); ctx.lineTo(cx + w / 2 * r, y0); ctx.stroke();
  const b = expoOut(span(u, .5, 1)); if (b > 0) { ctx.beginPath(); ctx.moveTo(cx - w / 2 * b, y0 + h); ctx.lineTo(cx + w / 2 * b, y0 + h); ctx.stroke(); }
  ctx.restore();
}
// products of the caged god (people's things: cream / lamp colours): 0 house, 1 gear, 2 pill
export function product(ctx, t, kind, x, y, s, o = {}) {
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(x, y); ctx.rotate(o.rot ?? 0);
  if (kind === 0) { ctx.fillStyle = LAMP.body; ctx.beginPath(); ctx.moveTo(-s * .45, s * .4); ctx.lineTo(-s * .45, -s * .05); ctx.lineTo(0, -s * .45); ctx.lineTo(s * .45, -s * .05); ctx.lineTo(s * .45, s * .4); ctx.closePath(); ctx.fill(); ctx.fillStyle = mixHex(LAMP.deep, P.night1, .3); ctx.fillRect(-s * .1, s * .08, s * .2, s * .32); }
  else if (kind === 1) { ctx.fillStyle = CREAM; for (let i = 0; i < 8; i++) { ctx.save(); ctx.rotate(i * TAU / 8 + t * .6); ctx.fillRect(-s * .08, -s * .48, s * .16, s * .2); ctx.restore(); } ctx.beginPath(); ctx.arc(0, 0, s * .34, 0, TAU); ctx.fill(); ctx.fillStyle = mixHex(P.night1, P.ind2, .5); ctx.beginPath(); ctx.arc(0, 0, s * .13, 0, TAU); ctx.fill(); }
  else { ctx.rotate(.7); ctx.fillStyle = CREAM; ctx.beginPath(); ctx.roundRect(-s * .45, -s * .18, s * .45, s * .36, [s * .18, 0, 0, s * .18]); ctx.fill(); ctx.fillStyle = LAMP.body; ctx.beginPath(); ctx.roundRect(0, -s * .18, s * .45, s * .36, [0, s * .18, s * .18, 0]); ctx.fill(); }
  ctx.restore();
}
// a plain subscribe button (cream plate, ink text, no logo): u grows it, o.press 0..1, o.glow 0..1
export function subButton(ctx, x, y, u, o = {}) {
  if (u <= 0) return;
  const k = expoOut(clamp(u)), pr = clamp(o.press ?? 0), s = k * (1 - .06 * Math.sin(Math.PI * pr));
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= clamp(u * 3);
  if ((o.glow ?? 0) > 0) halo(ctx, 0, 0, 260, .45 * o.glow, LAMP.body, LAMP.core);
  ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(-150 + 5, -36 + 8, 300, 72, 36); ctx.fill();
  ctx.fillStyle = mixHex(PAPER.lit, PAPER.shade, .35 * pr); ctx.beginPath(); ctx.roundRect(-150, -36, 300, 72, 36); ctx.fill();
  ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.stroke();
  F.glowText(ctx, 'SUBSCRIBE', 0, 10, { size: 28, weight: 700, align: 'center', col: PAPER.ink, glow: false, spacing: .16 });
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ fly-through for B1's rooms
// the room (drawn by fn(ctx, t, view)) behind a door opening with parallax (as S.roomThroughDoor): box = the opening on screen, Z = the
// door zoom, ZE = where the opening fills the frame, rc = the room view at full size
export function through(ctx, t, box, Z, ZE, rc, fn) {
  const rs = rc.s * Math.pow(clamp(Z / ZE, 1e-3, 1), .5), cx = box.x0 + box.w / 2, cy = box.y0 + box.h / 2;
  const f = clamp(Math.log(Math.max(Z, 1)) / Math.log(ZE));
  fn(ctx, t, { x: rc.x - (cx - W / 2) * (1 - f) / rs, y: rc.y - (cy - H / 2) * (1 - f) / rs, s: rs });
}

// ------------------------------------------------------------------------------------------------ ZOO (ending 10): one perfect room
// room coords 0..1920 × 0..1080 (cell 0, 0); the grid of enclosures: cells (i, j) i = -2..2, j = -1..1 at pitch ZP; o (for cell 0 0):
// { blinds 0..1 (open), cup 0..1 (slides in), lamp 0..1, reach 0..1 (your hand), fed 0..1, wake 0..1 (the stretch), you 0..1 }
export const ZP = { x: 2080, y: 1240 };
const ZSEED = Array.from({ length: 15 }, (_, i) => { const r = prng(7300 + i * 31); return { bx: r(), yx: r(), lit: .6 + r() * .4, pose: r() }; });
export function zooCell(ctx, t, o, k) {
  // walls (bright, perfect, a touch sterile), floor
  ctx.fillStyle = lin(ctx, 0, 0, 0, 760, [[0, mixHex(PAPER.edge, P.night1, .62)], [.3, mixHex(PAPER.body, COOL.body, .3)], [.6, mixHex(PAPER.lit, COOL.body, .18)], [1, mixHex(PAPER.body, COOL.body, .22)]]); ctx.fillRect(0, 0, 1920, 760);
  ctx.fillStyle = lin(ctx, 0, 760, 0, 1080, [[0, mixHex(PAPER.shade, P.blue1, .25)], [1, mixHex(PAPER.edge, P.night1, .45)]]); ctx.fillRect(0, 760, 1920, 320);
  // the window (the hero light) with blinds
  const wx = 1150, wy = 150, ww = 520, wh = 440, bl = clamp(o.blinds ?? 1);
  ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, wy, 0, wy + wh, [[0, mixHex(LAMP.core, '#bcd6f2', .35)], [1, LAMP.core]]); ctx.fillRect(wx, wy, ww, wh);
  halo(ctx, wx + ww * .62, wy + wh * .55, 300, .9, LAMP.body, LAMP.core);
  ctx.fillStyle = rgba(mixHex(PAPER.shade, COOL.body, .3), .55); ctx.beginPath(); ctx.ellipse(wx + ww * .3, wy + wh, 260, 70, 0, Math.PI, TAU); ctx.fill();
  const n = 9; ctx.fillStyle = mixHex(PAPER.lit, PAPER.shade, .45);
  for (let i = 0; i < n; i++) { const sh = (wh / n) * lerp(.92, .14, bl); ctx.fillRect(wx, wy + i * wh / n, ww, sh); }
  ctx.restore();
  ctx.strokeStyle = mixHex(PAPER.edge, P.night1, .25); ctx.lineWidth = 14; ctx.strokeRect(wx, wy, ww, wh);
  // the light patch on the floor (light falls as a shape)
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(LAMP.core, .12 * (.35 + .65 * bl));
  ctx.beginPath(); ctx.moveTo(wx, wy + wh); ctx.lineTo(wx + ww, wy + wh); ctx.lineTo(wx + ww - 200, 1080); ctx.lineTo(wx - 560, 1080); ctx.closePath(); ctx.fill(); ctx.restore();
  // the bed (left)
  ctx.fillStyle = mixHex(PAPER.edge, P.blue1, .3); ctx.fillRect(150, 640, 90, 250);
  ctx.fillStyle = mixHex(PAPER.lit, COOL.body, .15); ctx.beginPath(); ctx.roundRect(180, 720, 720, 120, 14); ctx.fill();
  ctx.fillStyle = mixHex(PAPER.body, COOL.body, .3); ctx.beginPath(); ctx.roundRect(400, 700, 520, 90, 18); ctx.fill();
  ctx.fillStyle = PAPER.lit; ctx.beginPath(); ctx.roundRect(210, 690, 170, 56, 24); ctx.fill();
  ctx.fillStyle = mixHex(PAPER.edge, P.blue1, .35); ctx.fillRect(180, 840, 740, 50);
  // the side table, the lamp, the cup (slides in on its own), the tray (fed)
  ctx.fillStyle = mixHex(PAPER.edge, P.blue1, .3); ctx.fillRect(960, 700, 200, 22); ctx.fillRect(980, 722, 16, 168); ctx.fillRect(1124, 722, 16, 168);
  const lp = clamp(o.lamp ?? 1);
  if (lp > 0) halo(ctx, 1010, 600, 160, .55 * lp, LAMP.body, LAMP.core);
  ctx.fillStyle = mixHex(PAPER.shade, LAMP.core, lp); ctx.beginPath(); ctx.moveTo(975, 610); ctx.lineTo(1045, 610); ctx.lineTo(1060, 650); ctx.lineTo(960, 650); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mixHex(PAPER.edge, P.blue1, .4); ctx.fillRect(1006, 650, 8, 50);
  const cu = sineIO(clamp(o.cup ?? 1)), cx = lerp(1330, 1095, cu);
  if (cu > 0) { ctx.fillStyle = PAPER.lit; ctx.beginPath(); ctx.roundRect(cx - 20, 660, 40, 40, 6); ctx.fill(); ctx.strokeStyle = PAPER.lit; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx + 22, 680, 10, -1.2, 1.2); ctx.stroke();
    ctx.strokeStyle = rgba(PAPER.lit, .7); ctx.lineWidth = 3; for (let q = 0; q < 2; q++) { ctx.beginPath(); for (let s = 0; s <= 1; s += .1) { const y = 650 - s * 60, x = cx - 6 + q * 14 + 6 * Math.sin(s * 7 + t * 2.2 + q); s ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); } }
  // the wall hatch the room serves through (right), and the tray
  ctx.fillStyle = mixHex(PAPER.shade, P.blue1, .3); ctx.fillRect(1700, 600, 180, 110); ctx.fillStyle = mixHex(PAPER.edge, P.night1, .4); ctx.fillRect(1712, 612, 156, 86);
  const fd = sineIO(clamp(o.fed ?? 0));
  if (fd > 0) { const tx = lerp(1790, 1400, fd), ty = lerp(655, 742, fd);
    ctx.fillStyle = PAPER.lit; ctx.beginPath(); ctx.roundRect(tx - 120, ty, 240, 18, 6); ctx.fill();
    [[-70, LAMP.body], [-15, mixHex(LAMP.body, '#8fd27a', .5)], [42, mixHex(LAMP.core, LAMP.body, .4)]].forEach(([dx, c]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(tx + dx, ty - 14, 24, Math.PI, TAU); ctx.fill(); }); }
  // a small round sensor on the ceiling: the keeper's eye in every enclosure (cool)
  ctx.fillStyle = COOL.body; ctx.beginPath(); ctx.arc(780, 70, 16, 0, TAU); ctx.fill(); halo(ctx, 780, 70, 60, .35, COOL.halo, COOL.core);
  // you: stretch (rested), reach for the cup, the hand stops in mid air
  const yu = o.you ?? 1;
  if (yu > 0) {
    const wk = clamp(o.wake ?? 1), rc = sineIO(clamp(o.reach ?? 0));
    const st = Math.sin(Math.PI * clamp(wk * 1.25)) * (1 - rc);
    const armR = [lerp(lerp(.12, 2.92, st), 1.5, rc), lerp(lerp(.12, 3.06, st), 1.25, rc)], armL = [lerp(-.12, -2.92, st), lerp(-.12, -3.06, st)];
    ctx.save(); ctx.globalAlpha *= yu;
    F.du(ctx, 820, 900 + 1.5 * Math.sin(t * 1.2), 420, { hood: false, dir: 1, light: 1, look: .15 + .1 * rc + .04 * Math.sin(t * .5), armR, armL, back: .1 });
    ctx.restore();
  }
}
// a neighbour enclosure: the same room, quieter (blinds half, a figure somewhere)
export function zooOther(ctx, t, k) {
  const z = ZSEED[k % ZSEED.length];
  zooCell(ctx, t, { blinds: .4 + z.bx * .6, cup: 1, lamp: z.lit, fed: 1, you: 0 }, k);
  ctx.save(); ctx.globalAlpha *= .95; F.person(ctx, 500 + z.yx * 700, 900, 400, { dir: z.pose > .5 ? 1 : -1, light: 1, look: .3 + .1 * Math.sin(t * .4 + k) }); ctx.restore();
}
// the whole zoo in zoo coords; v = the view; o: the cell-0 options + { grid 0..1 (neighbours lit), glass 0..1 (the pane slides in), keeper 0..1
// (the cool light above), dim, bg (false: only the pane, over something drawn before) }
export function zooWorld(ctx, t, v, o = {}) {
  F.inView(ctx, v, (s) => {
    const vx0 = v.x - W / 2 / s, vx1 = v.x + W / 2 / s, vy0 = v.y - H / 2 / s, vy1 = v.y + H / 2 / s;
    // the house of enclosures: a dark mass behind the cells (the keeper's building)
    if (o.bg !== false) { ctx.fillStyle = lin(ctx, 0, -3200, 0, 3000, [[0, P.night0], [.5, mixHex(P.night1, P.ind1, .4)], [1, P.night0]]); ctx.fillRect(vx0 - 10, vy0 - 10, vx1 - vx0 + 20, vy1 - vy0 + 20); }
    const kp = clamp(o.keeper ?? 0);
    if (kp > 0) { halo(ctx, 960, -2300, 5200, .45 * kp, COOL.halo, COOL.core); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, -2300, 0, 2600, [[0, rgba(COOL.halo, .22 * kp)], [1, rgba(COOL.halo, 0)]]); ctx.beginPath(); ctx.moveTo(960 - 500, -2300); ctx.lineTo(960 + 500, -2300); ctx.lineTo(960 + 6200, 2600); ctx.lineTo(960 - 6200, 2600); ctx.closePath(); ctx.fill(); ctx.restore(); }
    if (o.cells !== false) for (let j = -1; j <= 1; j++) for (let i = -2; i <= 2; i++) {
      const x = i * ZP.x, y = j * ZP.y; if (x > vx1 || x + 1920 < vx0 || y > vy1 || y + 1080 < vy0) continue;
      ctx.save(); ctx.beginPath(); ctx.rect(x, y, 1920, 1080); ctx.clip(); ctx.translate(x, y);
      if (i === 0 && j === 0) zooCell(ctx, t, o, 0); else { zooOther(ctx, t, (i + 2) + (j + 1) * 5); const g = 1 - clamp(o.grid ?? 1); if (g > 0) { ctx.fillStyle = rgba(P.night0, .85 * g); ctx.fillRect(0, 0, 1920, 1080); } }
      ctx.restore();
      ctx.strokeStyle = mixHex(P.night1, P.ind2, .5); ctx.lineWidth = 34; ctx.strokeRect(x - 17, y - 17, 1954, 1114);
    }
    if (kp > 0 && o.disc !== false) machineDisc(ctx, t, 960, -2300, 560, { a: kp });
    // the glass pane in front of all the enclosures (cool): slides in from the left, its bright edge leads
    const g = clamp(o.glass ?? 0);
    if (g > 0 && (o.glassA ?? 1) > 0) { ctx.save(); ctx.globalAlpha *= o.glassA ?? 1;
      const L = -4600, R = 6600, ex = lerp(L, R, sineIO(g));
      ctx.fillStyle = rgba(COOL.deep, .26); ctx.fillRect(L, -1600, ex - L, 4400);
      ctx.save(); ctx.beginPath(); ctx.rect(L, -1600, ex - L, 4400); ctx.clip(); ctx.strokeStyle = rgba(COOL.core, .13); ctx.lineWidth = 60;
      for (let q = -6; q < 12; q++) { const x = q * 900 + 120 * Math.sin(t * .2); ctx.beginPath(); ctx.moveTo(x, -1600); ctx.lineTo(x + 1500, 2800); ctx.stroke(); }
      ctx.restore();
      ctx.fillStyle = COOL.line; ctx.fillRect(ex - 9 / Math.max(s, .05) * .5, -1600, 9 / Math.max(s, .05), 4400);
      ctx.restore();
    }
  });
  const dm = clamp(o.dim ?? 0); if (dm > 0) { ctx.fillStyle = rgba(P.night0, .6 * dm); ctx.fillRect(0, 0, W, H); }
}
export const ZOO_FULL = { x: 960, y: 540, s: 1 };

// ------------------------------------------------------------------------------------------------ THE DAWN STREET (ending 9)
// street coords: the first view is { 960, 540, 1 } (= screen); buildings x -600 … 2620, the sidewalk from y 860, the corner (cross street)
// at x 1470–1650 with the camera pole (x 1560), the lab (1660–2040), the monitor room at the street end (2080–2620). Above y -300 the sky
// opens into the night (THE YARD lies above the street). o: { cams 0..1 (a camera on every corner), tape 0..1 (RESEARCH BANNED), monitors
// 0..1 (people at the monitor wall), cornerCol (the corner camera colour), cornerAng, cornerA, camLook (0 → 1: the corner cams turn) }
const BLD = [[-600, -380, 360], [-370, -120, 300], [-110, 160, 420], [170, 430, 330], [440, 720, 280], [730, 1000, 390], [1010, 1240, 300], [1250, 1470, 360]];
const BWIN = BLD.map((b, i) => { const r = prng(7400 + i * 17); return Array.from({ length: 40 }, () => r()); });
export const STREET = { ground: 900, corner: 1560, poleTop: 470, lab: [1660, 2040, 600], end: [2080, 2620, 340], win: [2220, 520, 340, 180] };
export const CAMS = [[200, 0], [760, .15], [1250, .3], [1990, .45], [2600, .6]];
export function street9(ctx, t, v, o = {}) {
  F.inView(ctx, v, (s) => {
    const X0 = -900, X1 = 2900;
    // sky: night above, dawn at the horizon (lamp colours, never gold)
    ctx.fillStyle = lin(ctx, 0, -900, 0, 700, [[0, rgba(P.night0, 0)], [.25, P.night0], [.55, '#141b55'], [.8, mixHex(P.ind1, LAMP.deep, .45)], [1, mixHex(LAMP.deep, P.halo2, .35)]]);
    ctx.fillRect(X0, -900, X1 - X0, 1600);
    halo(ctx, 1900, 660, 900, .35, LAMP.deep, LAMP.body);
    // the buildings
    BLD.forEach(([x0, x1, top], i) => {
      ctx.fillStyle = lin(ctx, 0, top, 0, 900, [[0, mixHex(P.ind2, P.blue1, .25)], [1, mixHex(P.night1, P.ind2, .5)]]); ctx.fillRect(x0, top, x1 - x0 - 8, 900 - top);
      ctx.fillStyle = mixHex(P.night1, P.ind2, .3); ctx.fillRect(x0 - 6, top - 14, x1 - x0 + 4, 16);
      const cols = Math.floor((x1 - x0 - 40) / 62), rows = Math.floor((860 - top - 60) / 78), r = BWIN[i];
      for (let c = 0; c < cols; c++) for (let q = 0; q < rows; q++) { const k = (c * 7 + q * 3) % 40, lit = r[k] > .72; ctx.fillStyle = lit ? mixHex(LAMP.body, LAMP.core, .5 + .1 * Math.sin(t * .4 + k)) : mixHex(P.night1, P.ind1, .5); ctx.fillRect(x0 + 26 + c * 62, top + 40 + q * 78, 30, 42); }
    });
    // the lab (sealed at 9.06)
    const [lx0, lx1, lt] = STREET.lab;
    ctx.fillStyle = mixHex(P.ind2, P.night1, .35); ctx.fillRect(lx0, lt, lx1 - lx0, 900 - lt); ctx.fillStyle = mixHex(P.night1, P.ind2, .2); ctx.fillRect(lx0 - 8, lt - 14, lx1 - lx0 + 16, 16);
    ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.fillRect(1810, 740, 90, 160);
    ctx.fillStyle = PAPER.body; ctx.fillRect(1800, 690, 110, 30); F.glowText(ctx, 'AI LAB', 1855, 713, { size: 22, weight: 700, align: 'center', col: PAPER.ink, glow: false, spacing: .12 });
    const tp = clamp(o.tape ?? 0);
    if (tp > 0) {
      for (const [k, a] of [[0, -.32], [1, .3]]) {
        const u = expoOut(span(tp, k * .3, .6 + k * .3)); if (u <= 0) continue;
        ctx.save(); ctx.translate(1855, 820); ctx.rotate(a); ctx.fillStyle = PAPER.lit; ctx.fillRect(-150, -18, 300 * u, 36);
        ctx.beginPath(); ctx.rect(-150, -18, 300 * u, 36); ctx.clip(); F.glowText(ctx, 'RESEARCH BANNED', 0, 8, { size: 22, weight: 700, align: 'center', col: PAPER.ink, glow: false, spacing: .1 }); ctx.restore();
      }
    }
    // the street end: a lit window, people at a wall of monitors
    const [ex0, ex1, et] = STREET.end, [wx, wy, ww, wh] = STREET.win, mo = clamp(o.monitors ?? 1);
    ctx.fillStyle = lin(ctx, 0, et, 0, 900, [[0, mixHex(P.ind2, P.blue1, .3)], [1, mixHex(P.night1, P.ind2, .5)]]); ctx.fillRect(ex0, et, ex1 - ex0, 900 - et);
    ctx.fillStyle = mixHex(LAMP.deep, LAMP.body, .25 + .35 * mo); ctx.fillRect(wx, wy, ww, wh);
    if (mo > 0) { halo(ctx, wx + ww / 2, wy + wh / 2, 330, .4 * mo, LAMP.body, LAMP.core);
      for (let c = 0; c < 4; c++) for (let q = 0; q < 2; q++) { ctx.fillStyle = mixHex(mixHex(COOL.deep, P.night1, .3), COOL.body, .25 + .15 * Math.sin(t * 1.3 + c + q * 2)); ctx.fillRect(wx + 30 + c * 74, wy + 22 + q * 52, 62, 42); }
      ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip(); for (let k = 0; k < 3; k++) F.person(ctx, wx + 70 + k * 100, wy + wh + 50, 150, { dir: 1, light: .4, look: .5 + .1 * Math.sin(t * .5 + k), back: .7 }); ctx.restore(); }
    ctx.strokeStyle = mixHex(P.night0, P.ind2, .3); ctx.lineWidth = 10; ctx.strokeRect(wx, wy, ww, wh);
    // the ground: sidewalk + road
    ctx.fillStyle = lin(ctx, 0, 860, 0, 1300, [[0, mixHex(P.ind2, LAMP.deep, .25)], [.3, mixHex(P.night1, P.ind2, .6)], [1, P.night0]]); ctx.fillRect(X0, 860, X1 - X0, 700);
    ctx.fillStyle = rgba(LAMP.body, .12); ctx.fillRect(X0, 896, X1 - X0, 3);
    // the corner camera (the one that knows your face) + a camera on every corner (9.06)
    const cc = o.cornerCol ?? COOL.body, ca = o.cornerA ?? 1;
    if (ca > 0) { ctx.save(); ctx.globalAlpha *= ca; ctx.fillStyle = mixHex(P.night1, P.ind2, .4); ctx.fillRect(STREET.corner - 6, STREET.poleTop, 12, 900 - STREET.poleTop); ctx.restore();
      camGlyph(ctx, t, STREET.corner, STREET.poleTop, 70, o.cornerAng ?? (Math.PI - .35), { col: cc, a: ca }); }
    const cm = clamp(o.cams ?? 0);
    CAMS.forEach(([x, d], k) => {
      const u = sineIO(span(cm, d * .8, d * .8 + .4)), a = o.camA ? o.camA(k) : 1; if (u <= 0 || a <= 0) return;
      const top = lerp(900, STREET.poleTop + 30, u); ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = mixHex(P.night1, P.ind2, .4); ctx.fillRect(x - 5, top, 10, 900 - top); ctx.restore();
      if (u > .6) camGlyph(ctx, t, x, top, 58, (k % 2 ? Math.PI - .4 : .4) + .15 * Math.sin(t * .5 + k), { col: COOL.body, a: a * span(u, .6, 1) });
    });
  });
}

// a glass pane in screen space from x = edge to the right (cool tint, diagonal streaks, a bright leading edge); a = alpha
export function paneScreen(ctx, t, edge, a = 1) {
  if (a <= 0 || edge >= W + 20) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= a;
  ctx.fillStyle = rgba(COOL.deep, .2); ctx.fillRect(edge, 0, W - edge + 40, H);
  ctx.beginPath(); ctx.rect(edge, 0, W - edge + 40, H); ctx.clip(); ctx.strokeStyle = rgba(COOL.core, .06); ctx.lineWidth = 46;
  for (let q = -2; q < 5; q++) { const x = edge + q * 520 + 40 * Math.sin(t * .2); ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 520, H); ctx.stroke(); }
  ctx.restore();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= a; ctx.fillStyle = COOL.line; ctx.fillRect(edge - 4, 0, 8, H); halo(ctx, edge, H / 2, 300, .2, COOL.halo, COOL.core); ctx.restore();
}

// ------------------------------------------------------------------------------------------------ calm camera
// camera keys → "move, then breathe": each move runs in the last D s before its key (the Hermite eases it in and out); before that the
// camera only creeps (1.5 % of the way, plus a small breath in scale). Keys closer than D + .4 s, and small drifts, stay as they are.
export function holdKeys(K, D = 1.6, breath = .008) {
  const out = [K[0]];
  for (let i = 1; i < K.length; i++) {
    const [t0, v0] = K[i - 1], [t1, v1] = K[i];
    const sm = Math.sqrt(v0.s * v1.s), big = Math.hypot(v1.x - v0.x, v1.y - v0.y) * sm > 140 || Math.abs(Math.log(v1.s / v0.s)) > .14;   // small drifts stay spread out
    const d = K[i][2]?.d ?? D;   // a key may ask for a longer move: [t, view, { d }]
    if (big && t1 - t0 > d + .4) out.push([t1 - d, { x: v0.x + (v1.x - v0.x) * .015, y: v0.y + (v1.y - v0.y) * .015, s: v0.s * Math.pow(v1.s / v0.s, .015) * (1 + breath) }]);
    out.push(K[i]);
  }
  return out;
}
// a creep through an inner seam (both chunks multiply their view scale by it): 1 at ts, slope .04/s there, back to 1 within ~3 s, so the
// two sides match in place AND speed and the seam never holds still
export const seamCreep = (t, ts) => 1 + .04 * (t - ts) * Math.exp(-Math.abs(t - ts) / 1.2);
