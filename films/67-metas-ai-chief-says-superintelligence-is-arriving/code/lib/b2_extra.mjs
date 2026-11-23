// Film 67 · builder B2 (c05 c06 c07) · local props + the two INNER seam plates of the group (owned by B2; nobody else imports this).
//   magnifier() Tao's lens over the ribbon · crack() the gap CORRECT ≠ UNDERSTOOD · kitchen() your table under a lamp · tree() the seasons
//   · road() the road to SUPERINTELLIGENCE (milestone, the chat lane, the wall, the sign) · chatBubble() · slip() the betting slip ·
//   tape() the measuring tape · sketchAlarm() the pale cliché of a loud arrival (searchlights) · plate56 / plate67 (c05→c06, c06→c07).
import * as E from './f10_editorial.mjs';
import * as F from './f67_kit.mjs';
import * as S from './f67_world.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, smooth, halo, lin, prng } = E;
const { GOLD, CREAM, CREAM2, PAPER, COOL, LAMP } = F;
const TAU = Math.PI * 2, GY = S.GY;

// ------------------------------------------------------------------------------------------------ Tao's magnifier
// lens centre (x, y), radius r; inside: the ribbon's code, magnified (gold dashes streaming); a handle down-left to the hand
export function magnifier(ctx, t, x, y, r, o = {}) {
  const a = clamp(o.a ?? 1); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  const [hx, hy] = o.hand ?? [x - r * 1.7, y - r * 1.7], ang = Math.atan2(hy - y, hx - x);
  ctx.strokeStyle = mixHex(P.night1, P.blue2, .5); ctx.lineCap = 'round'; ctx.lineWidth = r * .22;
  ctx.beginPath(); ctx.moveTo(x + Math.cos(ang) * r * 1.05, y + Math.sin(ang) * r * 1.05); ctx.lineTo(hx, hy); ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip();
  ctx.fillStyle = lin(ctx, x - r, y - r, x + r, y + r, [[0, GOLD.mid], [1, GOLD.shade]]); ctx.fillRect(x - r, y - r, r * 2, r * 2);
  const rr = prng(911);
  for (let i = 0; i < 7; i++) {   // magnified code lines (still unreadable): dashes streaming right
    const ly = y - r * .75 + i * r * .25; let lx = x - r - ((t * r * .35 + rr() * r) % (r * .6));
    while (lx < x + r) { const dw = r * (.12 + .3 * rr()); ctx.fillStyle = rgba(GOLD.deep, .7); ctx.fillRect(lx, ly, dw, r * .08); lx += dw + r * .1; }
  }
  halo(ctx, x - r * .35, y - r * .35, r * .9, .35, GOLD.halo, GOLD.core);
  ctx.restore();
  ctx.strokeStyle = rgba(CREAM, .85); ctx.lineWidth = Math.max(1.5, r * .09); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  ctx.restore();
  return [hx, hy];
}

// ------------------------------------------------------------------------------------------------ the crack
// a jagged crack from p0 to p1 (any space), grown to u; w = max width. Dark gap with cream lips (the gap between CORRECT and UNDERSTOOD)
const CRK = new Map();
function crackPts(seed, n) { const k = seed + ':' + n; if (!CRK.has(k)) { const r = prng(seed), a = []; for (let i = 0; i <= n; i++) a.push([(r() - .5) * 2, .5 + r() * .7]); CRK.set(k, a); } return CRK.get(k); }
export function crack(ctx, p0, p1, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const n = o.n ?? 14, J = crackPts(o.seed ?? 7, n), dx = p1[0] - p0[0], dy = p1[1] - p0[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  const w = o.w ?? 14, jit = o.jit ?? L * .035, m = Math.max(1, Math.ceil(n * u));
  const L1 = [], L2 = [];
  for (let i = 0; i <= m; i++) {
    const f = Math.min(i / n, u), j = J[i][0] * jit * (i === 0 ? 0 : 1), ww = w * J[i][1] * Math.sin(Math.PI * clamp(f / Math.max(u, .001) * .5 + .5 * (1 - (i === m ? 1 : 0)))) * (o.open ?? 1);
    const cx = p0[0] + dx * f + nx * j, cy = p0[1] + dy * f + ny * j, hw = i === m ? 0 : Math.max(0, ww) / 2;
    L1.push([cx + nx * hw, cy + ny * hw]); L2.push([cx - nx * hw, cy - ny * hw]);
  }
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.beginPath(); L1.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); for (let i = L2.length - 1; i >= 0; i--) ctx.lineTo(L2[i][0], L2[i][1]); ctx.closePath();
  ctx.fillStyle = o.fill ?? P.night0; ctx.fill();
  ctx.strokeStyle = rgba(o.lip ?? CREAM, .75); ctx.lineWidth = o.lw ?? 2; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.restore();
  return L1[L1.length - 1];
}

// ------------------------------------------------------------------------------------------------ your kitchen table (screen space explainer)
// (x, y) = centre of the table top; w = width; lamp 0..1 (the lamp above lights the table), crack 0..1 (the gap runs through the top)
export function kitchen(ctx, t, x, y, w, o = {}) {
  const lamp = clamp(o.lamp ?? 1), rise = expoOut(clamp(o.u ?? 1)); if (rise <= 0) return;
  const th = w * .05, yy = y + (1 - rise) * 260;
  ctx.save(); ctx.globalAlpha *= clamp(rise * 3);
  // the lamp: a cord from the top, a shade, a pool of light on the table
  const lx = x, ly = yy - w * .42;
  ctx.strokeStyle = rgba(P.halo2, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx, -10); ctx.lineTo(lx, ly - 30); ctx.stroke();
  halo(ctx, lx, yy - 10, w * .55, .45 * lamp, GOLD.halo, LAMP.core);
  ctx.fillStyle = mixHex(P.night1, P.ind2, .5); ctx.beginPath(); ctx.moveTo(lx - 54, ly + 14); ctx.lineTo(lx - 22, ly - 32); ctx.lineTo(lx + 22, ly - 32); ctx.lineTo(lx + 54, ly + 14); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mixHex(P.night1, LAMP.core, lamp * .9); ctx.beginPath(); ctx.ellipse(lx, ly + 14, 52, 7, 0, 0, TAU); ctx.fill();
  // table top + legs (wood in the lamp light)
  const top = mixHex(mixHex('#3a2a22', P.night1, .35), '#8a6a4a', .55 * lamp), leg = mixHex('#2a1d18', P.night1, .4);
  ctx.fillStyle = leg; ctx.fillRect(x - w * .44, yy + th, w * .035, w * .3); ctx.fillRect(x + w * .405, yy + th, w * .035, w * .3);
  ctx.fillStyle = lin(ctx, x - w / 2, yy, x + w / 2, yy, [[0, mixHex(top, P.night1, .5)], [.5, top], [1, mixHex(top, P.night1, .5)]]); ctx.fillRect(x - w / 2, yy, w, th);
  ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(x - w / 2, yy + th * .8, w, th * .2);
  // two chairs' backs (people live here), a cup
  ctx.fillStyle = leg; ctx.fillRect(x - w * .62, yy - w * .12, w * .03, w * .42); ctx.fillRect(x + w * .59, yy - w * .12, w * .03, w * .42);
  ctx.fillStyle = mixHex(P.ind2, CREAM, .35 * lamp); ctx.fillRect(x - w * .3, yy - 26, 22, 26); ctx.fillRect(x - w * .3 + 22, yy - 20, 6, 12);
  if ((o.crack ?? 0) > 0) crack(ctx, [x + w * .06, yy - 2], [x + w * .02, yy + th + w * .3], o.crack, { w: 12, seed: 23, n: 10 });
  ctx.restore();
  return { y: yy, th };
}

// ------------------------------------------------------------------------------------------------ the seasons tree (land card)
// x, base = foot; h = height; season s (0 summer … 1 autumn … 2 winter … 3 spring … 4 summer), wraps
const TREE = (() => { const r = prng(4242), a = []; for (let i = 0; i < 46; i++) a.push([r() * 2 - 1, r(), .5 + r() * .5, r()]); return a; })();
export function tree(ctx, t, x, base, h, s) {
  const q = ((s % 4) + 4) % 4;
  const leaf = q < 1 ? mixHex('#3f6b4a', '#c98a3a', q) : q < 2 ? mixHex('#c98a3a', '#6a5a4a', q - 1) : q < 3 ? mixHex('#6a5a4a', '#e8d7e0', q - 2) : mixHex('#e8d7e0', '#3f6b4a', q - 3);
  const dens = q < 1 ? 1 - .2 * q : q < 2 ? .8 - .75 * (q - 1) : q < 3 ? .05 : .05 + .95 * (q - 3);
  const snow = q >= 1.7 && q < 3 ? Math.sin(Math.PI * (q - 1.7) / 1.3) : 0;
  ctx.save();
  ctx.strokeStyle = mixHex(P.night1, '#3a2a22', .5); ctx.lineCap = 'round';
  ctx.lineWidth = h * .06; ctx.beginPath(); ctx.moveTo(x, base); ctx.lineTo(x + h * .02, base - h * .55); ctx.stroke();
  ctx.lineWidth = h * .025; for (const [a, b] of [[-.22, -.8], [.2, -.85], [-.05, -.95], [.32, -.68], [-.3, -.66]]) { ctx.beginPath(); ctx.moveTo(x + h * .02, base - h * .5); ctx.lineTo(x + a * h, base + b * h); ctx.stroke(); }
  for (const [u, v, sz, ph] of TREE) {
    if (ph > dens) continue;
    const px = x + u * h * .36, py = base - h * (.6 + v * .36), rr = h * .07 * sz;
    ctx.fillStyle = rgba(mixHex(leaf, P.night1, .45), .9); ctx.beginPath(); ctx.arc(px, py, rr, 0, TAU); ctx.fill();
  }
  if (snow > 0) { ctx.fillStyle = rgba(CREAM, .55 * snow); for (const [a, b] of [[-.22, -.8], [.2, -.85], [-.05, -.95], [.32, -.68], [-.3, -.66]]) ctx.fillRect(x + a * h - 6, base + b * h - 3, 12, 3); }
  // falling: leaves in autumn, snow in winter, petals in spring
  const fall = q >= .6 && q < 1.6 ? 1 : 0, sn = snow, pet = q >= 3 && q < 3.6 ? 1 : 0;
  const r = prng(77);
  for (let i = 0; i < 26; i++) {
    const ph = (t * .25 + r()) % 1, px = x + (r() - .5) * h * 1.6 + Math.sin(t * 1.3 + i) * 12, py = base - h * (1 - ph) - 10, k = r();
    if (fall && k < .6) { ctx.fillStyle = rgba('#c98a3a', .7 * (1 - ph * .5)); ctx.fillRect(px, py, 5, 3); }
    else if (sn && k >= .3) { ctx.fillStyle = rgba(CREAM, .6 * sn); ctx.fillRect(px, py, 3, 3); }
    else if (pet && k < .5) { ctx.fillStyle = rgba('#e8d7e0', .6); ctx.fillRect(px, py, 4, 3); }
  }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ the road (land card, right of the referee)
// a pale lane along the ground from x0 to the horizon; milestone (gold 0..1) · chat windows rolling on the lane to the wall · the wall ·
// the sign SUPERINTELLIGENCE beyond it
export const ROAD = { x0: 3640, mile: 3990, wall: 6050, sign: 6420, y: GY - 6 };
export function road(ctx, t, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const x1 = lerp(ROAD.x0, 9200, u);
  ctx.save();
  ctx.fillStyle = mixHex(P.night1, P.blue2, .32); ctx.fillRect(ROAD.x0, ROAD.y - 4, x1 - ROAD.x0, 7);
  ctx.fillStyle = rgba(CREAM2, .35); for (let x = ROAD.x0 + 20; x < x1; x += 70) ctx.fillRect(x, ROAD.y - 1, 30, 2);
  // the milestone (a rounded stone, a number), turns gold
  const g = clamp(o.mile ?? 0), mx = ROAD.mile;
  ctx.fillStyle = mixHex(mixHex(P.ind2, P.blue2, .4), GOLD.body, g); ctx.beginPath(); ctx.roundRect(mx - 16, ROAD.y - 50, 32, 50, [16, 16, 2, 2]); ctx.fill();
  if (g > 0) halo(ctx, mx, ROAD.y - 30, 90, .55 * g, GOLD.halo, GOLD.core);
  ctx.fillStyle = mixHex(P.night1, GOLD.deep, g); ctx.fillRect(mx - 9, ROAD.y - 34, 18, 3); ctx.fillRect(mx - 6, ROAD.y - 26, 12, 3);
  // the wall across the lane
  const wa = clamp(o.wall ?? 0);
  if (wa > 0) {
    const wh = 170 * expoOut(wa), wx = ROAD.wall;
    ctx.fillStyle = mixHex(P.night1, P.ind2, .6); ctx.fillRect(wx, ROAD.y - wh, 60, wh);
    ctx.fillStyle = rgba(P.night0, .45); for (let j = 0; j * 20 < wh; j++) for (let i = 0; i < 2; i++) ctx.fillRect(wx + (j % 2 ? 0 : 15) + i * 30, ROAD.y - 20 * (j + 1), 28, 2);
  }
  // the sign beyond the wall (a post, a plate pointing right)
  const sg = clamp(o.sign ?? 0);
  if (sg > 0) {
    const sx = ROAD.sign, k = expoOut(sg);
    ctx.fillStyle = mixHex(P.night1, P.blue2, .5); ctx.fillRect(sx - 4, ROAD.y - 190 * k, 8, 190 * k);
    if (k > .5) { ctx.save(); ctx.globalAlpha *= span(k, .5, 1); ctx.fillStyle = mixHex(P.ind2, CREAM, .12); ctx.beginPath(); ctx.moveTo(sx - 30, ROAD.y - 230); ctx.lineTo(sx + 330, ROAD.y - 230); ctx.lineTo(sx + 360, ROAD.y - 205); ctx.lineTo(sx + 330, ROAD.y - 180); ctx.lineTo(sx - 30, ROAD.y - 180); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = rgba(CREAM, .6); ctx.lineWidth = 2; ctx.stroke();
      E.glowText(ctx, 'SUPERINTELLIGENCE', sx + 160, ROAD.y - 195, { size: 30, weight: 700, spacing: .06, align: 'center', col: CREAM, glow: false }); ctx.restore(); }
  }
  // chat windows rolling right on the lane, piling up at the wall
  const ch = clamp(o.chats ?? 0);
  if (ch > 0) {
    const r = prng(515);
    for (let i = 0; i < 16; i++) {
      const born = i / 16 * .75, f = clamp((ch - born) / .25); if (f <= 0) continue;
      const stop = ROAD.wall - 46 - (i % 8) * 4, x = lerp(ROAD.x0 + 900 + r() * 600, stop, sineIO(f)), lvl = Math.floor(i / 4), y = ROAD.y - 22 - (f >= 1 ? lvl * 34 + (i % 4) * 0 : 0) - (f < 1 ? Math.abs(Math.sin(f * 12)) * 8 : 0);
      chatBubble(ctx, t, x - (f >= 1 ? (i % 4) * 46 : 0), y, 40, { seed: i });
    }
  }
  ctx.restore();
}
export function chatBubble(ctx, t, x, y, w, o = {}) {
  const h = w * .72;
  ctx.fillStyle = mixHex(P.blue1, COOL.body, .45); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, w * .2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - w * .25, y + h / 2 - 1); ctx.lineTo(x - w * .38, y + h / 2 + w * .16); ctx.lineTo(x - w * .05, y + h / 2 - 1); ctx.fill();
  ctx.fillStyle = rgba(P.night1, .55); for (let i = 0; i < 3; i++) ctx.fillRect(x - w * .32, y - h * .25 + i * h * .22, w * (.64 - .18 * ((i + (o.seed ?? 0)) % 2)), Math.max(1, h * .08));
}

// ------------------------------------------------------------------------------------------------ the betting slip (screen space, paper)
export function slip(ctx, t, x, y, w, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const h = w * .62, k = expoOut(u);
  ctx.save(); ctx.globalAlpha *= clamp(u * 3); ctx.translate(x + w / 2, y + h / 2 + (1 - k) * 60); ctx.rotate((o.rot ?? .05) + (1 - k) * .12 + .006 * Math.sin(t * .7));
  ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-w / 2 + 8, -h / 2 + 12, w, h);
  ctx.fillStyle = lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.fillStyle = PAPER.lit; for (let i = 0; i < 14; i++) { ctx.beginPath(); ctx.arc(-w / 2 + (i + .5) * w / 14, h / 2, w / 28, 0, Math.PI); ctx.fill(); }   // torn bottom edge
  ctx.strokeStyle = rgba(PAPER.edge, .8); ctx.setLineDash([4, 5]); ctx.beginPath(); ctx.moveTo(-w / 2 + 20, -h / 2 + 62); ctx.lineTo(w / 2 - 20, -h / 2 + 62); ctx.stroke(); ctx.setLineDash([]);
  E.glowText(ctx, 'BET SLIP', -w / 2 + 26, -h / 2 + 44, { size: 24, weight: 700, spacing: .14, col: PAPER.faint, glow: false });
  E.glowText(ctx, 'Superintelligence', -w / 2 + 26, -h / 2 + 118, { size: 46, serif: true, col: PAPER.ink, glow: false });
  E.glowText(ctx, 'is arriving', -w / 2 + 26, -h / 2 + 166, { size: 46, serif: true, col: PAPER.ink, glow: false });
  E.glowText(ctx, 'PLACED BY: ALEXANDR WANG', -w / 2 + 26, h / 2 - 34, { size: 22, weight: 700, spacing: .06, col: GOLD.deep, glow: false });
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ the measuring tape (screen space)
// from (x, y) to the right: a gold band with ticks; unit = px per unit; len = how many units are out; the case at x
export function tape(ctx, t, x, y, unit, len, o = {}) {
  const a = clamp(o.a ?? 1); if (a <= 0 || len <= 0) return x;
  const L = unit * len, x1 = x + L;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = lin(ctx, 0, y - 9, 0, y + 9, [[0, GOLD.hot], [1, GOLD.mid]]); ctx.fillRect(x, y - 9, Math.min(L, W * 3), 18);
  ctx.fillStyle = rgba(GOLD.deep, .8);
  const step = unit >= 30 ? unit : unit * Math.ceil(30 / unit);
  for (let k = 0, xx = x; xx < Math.min(x1, W + 40); k++, xx = x + k * step / 4) ctx.fillRect(xx, y - 9, 2, k % 4 ? 6 : 12);
  ctx.fillStyle = mixHex(P.night1, P.ind2, .6); ctx.beginPath(); ctx.roundRect(x - 40, y - 26, 46, 46, 10); ctx.fill(); ctx.strokeStyle = rgba(GOLD.line, .6); ctx.lineWidth = 2; ctx.stroke();
  if (x1 < W) halo(ctx, x1, y, 34, .6, GOLD.halo, GOLD.core);
  ctx.restore();
  return x1;
}

// ------------------------------------------------------------------------------------------------ the cliché of a loud arrival (land card)
// pale chalk sketch: searchlight beams sweeping from the labs + a siren on a pole; u draws it, off retracts the beams to their lamps
export function sketchAlarm(ctx, t, u, off) {
  u = clamp(u); off = clamp(off); if (u <= 0 || off >= 1) return;
  ctx.save(); ctx.strokeStyle = rgba(CREAM, .38 * (1 - off * .6)); ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.setLineDash([14, 9]);
  const L = 1500 * sineIO(u) * (1 - sineIO(off));
  for (const [x, ph] of [[4360, 0], [4840, 1.7], [5300, 3.1], [3980, 4.4]]) {
    const ang = -Math.PI / 2 + .45 * Math.sin(t * .7 + ph);
    for (const d of [-.07, .07]) { ctx.beginPath(); ctx.moveTo(x, GY - 280); ctx.lineTo(x + Math.cos(ang + d) * L, GY - 280 + Math.sin(ang + d) * L); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(x, GY - 280, 18, 0, TAU); ctx.stroke();
  }
  ctx.setLineDash([]);
  // the siren on a pole (sketch) at the labs' gate, its sound rings
  const sx = 4980, sy = GY - 260;
  ctx.beginPath(); ctx.moveTo(sx, GY - 70); ctx.lineTo(sx, sy + 26); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(sx - 22, sy + 26); ctx.lineTo(sx - 16, sy); ctx.arc(sx, sy, 16, Math.PI, 0); ctx.lineTo(sx + 22, sy + 26); ctx.closePath(); ctx.stroke();
  for (let i = 0; i < 3; i++) { const ph = (t * .9 + i / 3) % 1, rr = 30 + ph * 90; ctx.globalAlpha = (1 - ph) * (1 - off); ctx.beginPath(); ctx.arc(sx, sy + 8, rr, -2.4, -.7); ctx.stroke(); }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ INNER SEAM c05 → c06 ('This channel exists')
// THE FILE IN YOUR HAND: you at the paper tower's foot hold the small gold file up; the headline above; the ribbon dim to the right.
export const YOU56 = { x: 1830, y: GY };
export const CAM56 = (k = 1, tr = 0) => E.aim(S.Z_LAND, 1480 + tr, 560, 1.15 * k, 960, 600);
// the referee drawn by B2 (same call as the world's chair(), so it can shrug): o { card, look, armL }
export const refereeAt = (ctx, t, o = {}) => F.referee(ctx, t, S.CHAIR.x - 6, GY - S.CHAIR.h + 4, 86, { card: 0, look: .1, dir: -1, ...o });
// you, drawn by B2 (same call as landWorld's): returns the hands
export const youAt = (ctx, x, o = {}) => E.du(ctx, x, GY, S.YOU.h, { light: 1, back: .3, dir: 1, look: .9, ...o });
export const YOU56O = { armR: [2.2, 2.45], look: .9 };
export const state56 = () => ({ head: { dim: 0 }, post: 1, tower: { u: 1, dark: .55 }, ribbon: { u: 1, glow: .45, a: .8 }, chair: { referee: 0 }, board: { chalk: 1, spot: 1 }, you: false });
export function land56(cx, t, o = {}) {   // the referee (card down), you with the small gold file held up (o overrides for the converging side)
  refereeAt(cx, t, o.ref ?? {});
  const hd = youAt(cx, o.x ?? YOU56.x, o.you ?? YOU56O);
  return hd;
}
export function fileInHand(cx, t, hd, o = {}) { if (hd?.R) F.file(cx, t, hd.R[0] + 2, hd.R[1] - 15, 22, { glow: 1, seed: 5, ...o }); }
export function plate56(ctx, t, T) {
  const k = S.creep(t, T, 'This channel exists'), c = CAM56(k, S.trk(k) * .3);
  S.landWorld(ctx, c, t, { ...state56(), land: (cx) => fileInHand(cx, t, land56(cx, t)) });
  F.checklist(ctx, t, T);
}

// ------------------------------------------------------------------------------------------------ INNER SEAM c06 → c07 ('And behind that headline')
// THE GAP IS HERE: over a veil, CORRECT (gold) | crack | UNDERSTOOD (cream) on a strip of ground, you at the crack's edge; behind the veil
// the headline with Wang's post header pinned under it (c07 unrolls the 1000x crop out of it).
export const CAM67 = (k = 1, tr = 0) => E.aim(S.Z_HEAD, 900 + tr, 560, 1.12 * k);
export const GAP = { y: 820, x: 960, veil: .66 };
export function gapScene(ctx, t, o = {}) {
  const u = clamp(o.u ?? 1), cu = clamp(o.crack ?? 1), close = clamp(o.close ?? 0), you = o.you ?? 1, wu = clamp(o.words ?? 1);
  if (u <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const gy = GAP.y + (1 - expoOut(u)) * 80, gx = GAP.x;
  ctx.globalAlpha *= clamp(u * 3);
  // ground strip
  ctx.fillStyle = lin(ctx, 0, gy, 0, gy + 90, [[0, mixHex(P.night1, P.ind1, .5)], [1, rgba(P.night0, 0)]]); ctx.fillRect(220, gy, 1480, 90);
  ctx.fillStyle = rgba(CREAM, .3); ctx.fillRect(220, gy, 1480, 2);
  ctx.restore();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= clamp(u * 3);
  F.goldText(ctx, [[F.SOURCES.correct, 1]], gx - 90, gy - 120, 58, F.rise(span(u, .2, 1)) * wu, { serif: false, weight: 700, spacing: .06, align: 'right', glow: true });
  F.goldText(ctx, [['UNDERSTOOD', 0]], gx + 90, gy - 120, 58, F.rise(span(u, .3, 1)) * wu, { serif: false, weight: 700, spacing: .06, col: CREAM });
  ctx.restore();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  crack(ctx, [gx, gy - 230], [gx + 10, gy + 70], cu, { w: 30 * (1 - close), seed: 9, n: 12, a: clamp(u * 3) });
  if (you > 0) E.du(ctx, gx - 46 + (o.youDx ?? 0), gy + (1 - expoOut(u)) * 0, 74, { look: o.look ?? .6, dir: 1, light: 1, back: 0, lean: .04, armR: [.4, .3] });
  ctx.restore();
}
export function plate67(ctx, t, T) {
  const k = S.creep(t, T, 'And behind that headline'), c = CAM67(k, S.trk(k) * .3);
  S.landWorld(ctx, c, t, { head: { dim: .3 }, post: 1, windows: .3, tower: { u: 1, dark: .8 }, you: false });
  F.veil(ctx, GAP.veil);
  gapScene(ctx, t, {});
  F.checklist(ctx, t, T, { lit: 3 });
}
