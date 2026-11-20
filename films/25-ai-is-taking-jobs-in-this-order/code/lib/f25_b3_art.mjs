// Film 25 · builder B3 (c08–c11) · drawing helpers. Owned by B3; built on lib/f25_kit.mjs + lib/f25_seams.mjs (never edited).
//   C(u, v, s) camera on F0 · blendCam(a, b, w) · rankWorld (the rank row with per-stone extras) · stoneWindow (a lit window in a
//   stone face that the camera flies into; the scene inside is drawn through E.withOuter + camera roll) · nurseRoom (8.02) ·
//   handSil (8.04) · tinyFig (9.04 crowd) · chessBoard · rowsBoth (ROW1 + ROW2 on one plain, sorted by depth) · horizonLamps.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f25_kit.mjs';
import * as S from './f25_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, halo, lin, rad, prng } = E;
const { F0 } = F;
const TAU = Math.PI * 2;

export const C = (u, v, s) => E.aim(F0, u, v, s);
// blend two cameras (x, y linear, distance to F0 in log space): w 0 → a, 1 → b
export function blendCam(a, b, w) {
  w = clamp(w); if (w <= 0) return a; if (w >= 1) return b;
  const da = Math.max(1, F0 - a.z), db = Math.max(1, F0 - b.z);
  return E.cam3({ x: lerp(a.x, b.x, w), y: lerp(a.y, b.y, w), z: F0 - Math.exp(lerp(Math.log(da), Math.log(db), w)), roll: lerp(a.roll || 0, b.roll || 0, w) });
}
// a camera keyed by camAt but whose first key follows a moving camera (fn) until t0: velocity carries over smoothly
// a living hold on top of any cam3 (k = 1: about ±70 px truck/rise and ±8 % push on the F0 card, in screen terms at any zoom).
// Incommensurate sines, so its speed never sinks to ~0 for long: the camera never freezes (calm.py near-static < 5 %).
export function live(c, t, k = .5, s = 0) {
  if (k <= 0) return c;
  const d = Math.max(50, F0 - c.z), u = d / F0;
  return { ...c, x: c.x + k * u * (60 * Math.sin(t * .43 + s) + 30 * Math.sin(t * .97 + 1.3 * s) + 9 * Math.sin(t * 2.3 + 2.1 * s)),
    y: c.y + k * u * (26 * Math.sin(t * .37 + 2 * s) + 12 * Math.sin(t * 1.1 + s) + 5 * Math.sin(t * 2.7 + .7 * s)),
    z: c.z + k * d * (.08 * Math.sin(t * .47 + 3 * s) + .03 * Math.sin(t * 1.07 + s)) };
}
// a fly-in / fly-out in SCREEN terms: the point pt on card Z slides on screen from where c0 shows it to where c1 shows it (uPos),
// while its scale goes c0 → c1 in log space (u). Ends exactly on c0 / c1. No sideways swing of the target near the end of a dive.
export function screenLerp(Z, pt, c0, c1, u, uPos = u) {
  const m0 = E.cardM(c0, Z), m1 = E.cardM(c1, Z), P = (m) => [m.e + pt[0] * m.k, m.f + pt[1] * m.k], p0 = P(m0), p1 = P(m1);
  return E.aim(Z, pt[0], pt[1], Math.exp(lerp(Math.log(m0.k), Math.log(m1.k), u)), lerp(p0[0], p1[0], uPos), lerp(p0[1], p1[1], uPos));
}
export const follow = (t, fn, t0, K, ref) => (t <= t0 ? fn(t) : E.camAt(t, [[t0, fn(t0)], ...K], ref));

// ================================================================================================================= THE RANK ROW
// like S.rankRow, plus o.each(i) → extra stone options (face callbacks, glyphs) and o.sky: false (caller draws the sky)
export function rankWorld(ctx, c, t, o = {}) {
  if (o.sky !== false) { F.sky(ctx, c, t, { glow: S.SKY_GLOW }); F.plain(ctx, c, t); }
  const ang = S.RANKROW.stones.map((s) => (o.fall ? o.fall(s.i + 1) : S.rankLie(s.i + 1)));
  F.drawRow(ctx, c, t, S.RANKROW, ang, {
    each: (i) => ({ ...(i === 0 ? { gold: o.gold ?? 1, glyph: null, num: 1 } : { num: o.num === false ? null : i + 1, dark: ang[i] > 1 ? .3 : 0 }), ...(o.each ? o.each(i) || {} : {}) }),
  });
  return ang;
}
export const RR = S.RANKROW.stones;
// local stone point (u, v) → card coords (pivot bottom-left front corner, fall + = toppled left), same maths as F.stone
export const stonePt = (s, ang, u, v) => { const ca = Math.cos(ang), sa = Math.sin(ang); return [s.x + u * ca + v * sa, s.y - u * sa + v * ca]; };
// the face centre of a rank stone (card coords, upright): where the light doors aim
export const faceOf = (s, k = .56) => [s.x + s.w / 2, s.y - s.h * k];

// ================================================================================================================= A WINDOW IN A STONE
// The window is a 16:9 rect on the stone face (centre at v = −h·vk, width wr·w). geometry(c) → screen quad + the outer transform that
// maps the inner scene's 1920×1080 frame onto the window (k = window width / W) and the inner roll (the stone's tilt).
export function stoneWindow(s, ang, o = {}) {
  const ww = s.w * (o.wr ?? .78), wh = ww * H / W, u0 = s.w / 2, v0 = -s.h * (o.vk ?? .72);
  const centre = stonePt(s, ang, u0, v0);
  const cover = Math.cos(ang) + (W / H) * Math.abs(Math.sin(ang));   // inner scale at which the tilted window covers the screen
  return {
    ww, wh, centre, cover, roll: -ang,
    cam: (sc = 1) => E.aim(s.Z, centre[0], centre[1], W * cover * sc / ww),   // the camera at which the window fills the screen
    geom(c) {
      const m = E.cardM(c, s.Z); if (!m) return null;
      const P2 = (u, v) => { const p = stonePt(s, ang, u, v); return [m.e + p[0] * m.k, m.f + p[1] * m.k]; };
      const quad = [P2(u0 - ww / 2, v0 - wh / 2), P2(u0 + ww / 2, v0 - wh / 2), P2(u0 + ww / 2, v0 + wh / 2), P2(u0 - ww / 2, v0 + wh / 2)];
      const cs = P2(u0, v0), k = ww * m.k / W;
      return { quad, cx: cs[0], cy: cs[1], k, outer: { k, e: cs[0] - W / 2 * k, f: cs[1] - H / 2 * k }, roll: -ang };
    },
  };
}
// draw the inner scene through the window: open 0..1 (the window grows from its centre), inner(outer, roll)
export function drawWindow(ctx, g, open, inner, o = {}) {
  if (!g || open <= 0) return;
  const q = g.quad.map(([x, y]) => [lerp(g.cx, x, open), lerp(g.cy, y, open)]);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const wpx = Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]);
  halo(ctx, g.cx, g.cy, wpx * 1.6, .35 * open * (o.glow ?? 1), P.halo1, P.halo0);
  ctx.save(); ctx.beginPath(); q.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.clip();
  const sk = lerp(.6, 1, open);   // the scene grows with the window (never pops in at full size)
  E.withOuter({ k: g.k * sk, e: g.cx - W / 2 * g.k * sk, f: g.cy - H / 2 * g.k * sk }, () => inner(g.roll));
  ctx.restore();
  ctx.strokeStyle = rgba(P.halo0, .75 * open); ctx.lineWidth = Math.max(1, wpx * .012); ctx.beginPath(); q.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.stroke();
  ctx.restore();
}

// ================================================================================================================= FIGURES
// a breathing wrapper for person()/du(): scale y about the feet
export function breathe(ctx, t, x, y, seed, fn) { const br = 1 + .008 * Math.sin(t * 1.7 + seed); ctx.save(); ctx.translate(x, y); ctx.scale(1, br); ctx.translate(-x, -y); const r = fn(); ctx.restore(); return r; }
export const person = (ctx, t, x, y, h, o = {}, seed = 0) => breathe(ctx, t, x, y, seed, () => E.person(ctx, x, y, h, { ...o, look: (o.look ?? 0) + .05 * Math.sin(t * .5 + seed) }));
export const du = (ctx, t, x, y, h, o = {}, seed = 3) => breathe(ctx, t, x, y, seed, () => E.du(ctx, x, y, h, { ...o, look: (o.look ?? .2) + .04 * Math.sin(t * .47 + seed) }));
// a tiny crowd figure (head + body), warm by default; s = height
export function tinyFig(ctx, x, y, s, col = mixHex(P.halo1, P.shade0, .35), a = 1) {
  if (a <= 0 || s <= .5) return;
  ctx.globalAlpha = a; ctx.fillStyle = col;
  ctx.beginPath(); ctx.arc(x, y - s * .84, s * .15, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - s * .2, y); ctx.quadraticCurveTo(x - s * .22, y - s * .62, x, y - s * .64); ctx.quadraticCurveTo(x + s * .22, y - s * .62, x + s * .2, y); ctx.closePath(); ctx.fill();
  ctx.globalAlpha = 1;
}

// ================================================================================================================= 8.02 THE NIGHT ROOMS
// design px of the inner scene (home camera = the nurse room). Left: a patient in bed, a nurse turning them, the bedside lamp (the warm
// light). Right, through the door: a child asleep in a small bed, a carer leaning over it, a small night light.
export const ROOM = { floor: 905, lamp: [575, 640], night: [2960, 600], bed: [700, 1290, 735], cot: [2330, 2790, 800], door: [1640, 1760] };
export function nurseRoom(ctx, c, t, o = {}) {
  const turn = clamp(o.turn ?? 0), la = o.lamp ?? 1, na = o.night ?? 1, R = ROOM;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H); ctx.restore();
  // back wall (Z 3000) with two night windows (cool, dim) and a few stars in them
  E.card(ctx, c, 3000, () => {
    ctx.fillStyle = lin(ctx, 0, -400, 0, 1400, [[0, P.night0], [.6, mixHex(P.night1, P.ind0, .4)], [1, P.night1]]); ctx.fillRect(-3000, -2000, 9000, 4600);
    for (const [x0, y0, w, h, sd] of [[180, 230, 250, 330, 5], [2050, 210, 250, 330, 9]]) {
      ctx.fillStyle = lin(ctx, 0, y0, 0, y0 + h, [[0, mixHex(P.blue0, P.night1, .55)], [1, mixHex(P.ind1, P.night1, .4)]]); ctx.fillRect(x0, y0, w, h);
      ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, h); ctx.clip(); E.stars(ctx, sd, 18, t, [x0, y0, w, h], .7); ctx.restore();
      ctx.fillStyle = P.night0; ctx.fillRect(x0 + w / 2 - 4, y0, 8, h); ctx.fillRect(x0, y0 + h * .45 - 4, w, 8);
      ctx.strokeStyle = mixHex(P.ind2, P.night1, .3); ctx.lineWidth = 12; ctx.strokeRect(x0, y0, w, h);
    }
  });
  E.card(ctx, c, F0, () => {
    // floor
    ctx.fillStyle = lin(ctx, 0, R.floor, 0, R.floor + 400, [[0, mixHex(P.night1, P.ind0, .45)], [1, P.night0]]); ctx.fillRect(-2000, R.floor, 7000, 1600);
    // lamp light on wall and floor (warm hero of the left room)
    const br = 1 + .03 * Math.sin(t * 1.3);
    halo(ctx, R.lamp[0], R.lamp[1] + 10, 820 * br, .32 * la, P.halo1, P.halo0);
    F.pool(ctx, 820, R.floor + 6, 560, 70, .9 * la);
    // the door wall between the rooms
    ctx.fillStyle = lin(ctx, R.door[0], 0, R.door[1], 0, [[0, mixHex(P.ind2, P.halo1, .12 * la)], [.2, P.night1], [1, P.night0]]); ctx.fillRect(R.door[0], -400, R.door[1] - R.door[0], R.floor + 400);
    ctx.fillStyle = rgba(P.halo1, .35 * la); ctx.fillRect(R.door[0], -400, 3, R.floor + 400);
    // bedside table + lamp
    ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.fillRect(500, 760, 150, R.floor - 760); ctx.fillStyle = mixHex(P.blue1, P.halo1, .3 * la); ctx.fillRect(492, 752, 166, 12);
    ctx.fillStyle = mixHex(P.ind2, P.night1, .2); ctx.fillRect(R.lamp[0] - 5, R.lamp[1] + 10, 10, 104);
    ctx.fillStyle = lin(ctx, 0, R.lamp[1] - 40, 0, R.lamp[1] + 14, [[0, mixHex(P.halo0, P.shade0, .2)], [1, mixHex(P.halo1, P.core1, .5)]]);
    ctx.beginPath(); ctx.moveTo(R.lamp[0] - 30, R.lamp[1] - 40); ctx.lineTo(R.lamp[0] + 30, R.lamp[1] - 40); ctx.lineTo(R.lamp[0] + 48, R.lamp[1] + 14); ctx.lineTo(R.lamp[0] - 48, R.lamp[1] + 14); ctx.closePath(); ctx.fill();
    halo(ctx, R.lamp[0], R.lamp[1] + 6, 150 * br, .75 * la, P.halo0, P.core0);
    // the bed: frame, mattress, pillow, the patient under a blanket (turning toward the nurse)
    const [bx0, bx1, by] = R.bed;
    ctx.fillStyle = mixHex(P.ind2, P.night1, .2); ctx.fillRect(bx0 - 14, by - 150, 22, R.floor - by + 150); ctx.fillRect(bx1 - 10, by - 40, 20, R.floor - by + 40);
    ctx.fillStyle = mixHex(P.ind2, P.night1, .45); ctx.fillRect(bx0, by + 30, bx1 - bx0, 26);
    ctx.fillStyle = lin(ctx, bx0, 0, bx1, 0, [[0, mixHex(P.blue1, P.halo1, .45 * la)], [1, mixHex(P.blue1, P.night1, .4)]]); ctx.fillRect(bx0, by, bx1 - bx0, 32);
    ctx.fillStyle = mixHex(mixHex(P.blue1, P.cream, .25), P.halo1, .3 * la); ctx.beginPath(); ctx.ellipse(bx0 + 70, by - 12, 62, 24, 0, 0, TAU); ctx.fill();
    patient(ctx, t, bx0, bx1, by, turn, la);
    // the nurse (indigo, long tunic) at the far side, reaching over, pulling gently while the patient turns
    const pull = sineIO(clamp(turn * 1.3)), nx = 1395;
    person(ctx, t, nx, R.floor, 330, { dir: -1, light: -1, long: true, lean: .2 - .08 * pull, look: -.1, armR: [1.25 - .25 * pull, 1.7 - .3 * pull], armL: [1.05 - .2 * pull, 1.5 - .25 * pull] }, 1.1);
    // the right room: small bed, a child asleep, a carer leaning over (the night light is the warm light here)
    const [cx0, cx1, cy] = R.cot;
    halo(ctx, R.night[0], R.night[1], 520, .26 * na, P.halo1, P.halo0); halo(ctx, R.night[0], R.night[1], 70, .8 * na, P.halo0, P.core0);
    ctx.fillStyle = lin(ctx, 0, R.night[1] - 22, 0, R.night[1] + 22, [[0, P.core1], [1, P.halo1]]); ctx.beginPath(); ctx.arc(R.night[0], R.night[1], 16, 0, TAU); ctx.fill();
    F.pool(ctx, 2700, R.floor + 6, 420, 56, .7 * na);
    ctx.fillStyle = mixHex(P.ind2, P.night1, .25); ctx.fillRect(cx0 - 10, cy - 90, 18, R.floor - cy + 90); ctx.fillRect(cx1 - 8, cy - 90, 18, R.floor - cy + 90);
    ctx.fillStyle = lin(ctx, cx0, 0, cx1, 0, [[0, mixHex(P.blue1, P.night1, .35)], [1, mixHex(P.blue1, P.halo1, .35 * na)]]); ctx.fillRect(cx0, cy, cx1 - cx0, 26);
    for (let x = cx0 + 30; x < cx1 - 10; x += 34) { ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.fillRect(x, cy - 80, 6, 80); }
    ctx.fillStyle = mixHex(P.ind2, P.night1, .25); ctx.fillRect(cx0, cy - 86, cx1 - cx0, 8);
    const cb = 1 + .025 * Math.sin(t * 1.4);
    ctx.fillStyle = mixHex(P.blue1, P.cream, .2); ctx.beginPath(); ctx.ellipse(cx0 + 62, cy - 8, 44, 16, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = lin(ctx, 0, cy - 50, 0, cy, [[0, mixHex(P.blue1, P.halo1, .4 * na)], [1, mixHex(P.ind1, P.blue1, .4)]]);
    ctx.beginPath(); ctx.moveTo(cx0 + 90, cy); ctx.bezierCurveTo(cx0 + 110, cy - 40 * cb, cx0 + 250, cy - 48 * cb, cx0 + 330, cy - 22); ctx.lineTo(cx0 + 380, cy); ctx.closePath(); ctx.fill();
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(cx0 + 80, cy - 22, 22, 0, TAU); ctx.fill();
    person(ctx, t, cx1 + 120, R.floor, 300, { dir: -1, light: 1, lean: .3, look: -.25, armR: [1.0, .55], armL: [.7, .4] }, 2.3);
  });
}
function patient(ctx, t, bx0, bx1, by, turn, la) {
  const u = sineIO(turn), b = 1 + .02 * Math.sin(t * 1.2), hx = bx0 + 70 + 6 * u, hy = by - 34 - 4 * u;
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.ellipse(hx, hy, 30, 28, .3 * u, 0, TAU); ctx.fill();
  ctx.fillStyle = rgba(P.halo1, .45 * la); ctx.beginPath(); ctx.ellipse(hx - 10, hy - 6, 10, 18, .3 * u, 0, TAU); ctx.fill();
  // blanket: shoulder and hip rise as the patient rolls onto the side toward the nurse
  const sh = 48 + 26 * u, hip = 40 + 34 * u;
  ctx.fillStyle = lin(ctx, bx0, by - 90, bx1, by, [[0, mixHex(P.blue1, P.halo1, .55 * la)], [.6, mixHex(P.blue1, P.ind1, .3)], [1, P.ind1]]);
  ctx.beginPath(); ctx.moveTo(bx0 + 100, by + 4);
  ctx.bezierCurveTo(bx0 + 100, by - sh * b, bx0 + 190, by - (sh + 6) * b, bx0 + 260, by - (sh - 12) * b);
  ctx.bezierCurveTo(bx0 + 330, by - (hip - 18) * b, bx0 + 360, by - hip * b, bx0 + 420, by - hip * b);
  ctx.bezierCurveTo(bx0 + 480, by - hip * b, bx1 - 60, by - 40, bx1 - 10, by - 20); ctx.lineTo(bx1, by + 30); ctx.lineTo(bx0 + 96, by + 30); ctx.closePath(); ctx.fill();
}

// ================================================================================================================= 8.04 TWO HANDS
// a hand as a dark silhouette lit warm from a point light (lx, ly): m = E.handMatrix(...), o { pose, curl, a }
export function handSil(ctx, m, lx, ly, o = {}) {
  const p = new Path2D(); p.addPath(E.handPath({ pose: o.pose, curl: o.curl }), m);
  const L = Math.hypot(m.a, m.b);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.fillStyle = rad(ctx, lx, ly, L * 3.2, [[0, mixHex(P.halo1, P.ind2, .25)], [.22, mixHex(P.ind2, P.halo1, .35)], [.55, P.ind2], [1, P.night1]]); ctx.fill(p);
  ctx.save(); ctx.clip(p); ctx.strokeStyle = rgba(P.halo0, .5 * (o.rim ?? 1)); ctx.lineWidth = L * .06; ctx.translate((lx - m.e) * .012, (ly - m.f) * .012); ctx.stroke(p); ctx.restore();
  ctx.restore();
}
// a warm light orb (the gift): radius r
export function orb(ctx, t, x, y, r, a = 1) {
  if (a <= 0 || r <= .2) return;
  const b = 1 + .05 * Math.sin(t * 2.1);
  halo(ctx, x, y, r * 9 * b, .45 * a, P.halo1, P.halo0); halo(ctx, x, y, r * 2.6, .9 * a, P.halo0, P.core0);
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = rad(ctx, x - r * .2, y - r * .25, r * 1.1, [[0, P.core0], [.6, P.core1], [1, P.halo0]]); ctx.beginPath(); ctx.arc(x, y, r * b, 0, TAU); ctx.fill(); ctx.restore();
}

// ================================================================================================================= 9.03 CHESS
// a small board seen slightly from above (a lying slab with a faint checker): centre x, top y, width w
export function board(ctx, x, y, w, a = 1, warm = 0) {
  if (a <= 0) return;
  const d = w * .16, h = w * .07;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = lin(ctx, 0, y - d, 0, y, [[0, mixHex(STONE_TOP, P.halo1, .35 * warm)], [1, mixHex(P.blue1, P.halo1, .2 * warm)]]);
  ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x + w / 2, y); ctx.lineTo(x + w / 2 - d * .6, y - d); ctx.lineTo(x - w / 2 + d * .6, y - d); ctx.closePath(); ctx.fill();
  for (let i = 0; i < 8; i++) for (let j = 0; j < 2; j++) if ((i + j) % 2) {
    const v0 = j / 2, v1 = (j + 1) / 2, xa = (v) => lerp(x - w / 2, x - w / 2 + d * .6, v) + (w - d * 1.2 * v) * i / 8, xb = (v) => lerp(x - w / 2, x - w / 2 + d * .6, v) + (w - d * 1.2 * v) * (i + 1) / 8;
    ctx.fillStyle = rgba(P.night0, .35); ctx.beginPath(); ctx.moveTo(xa(v0), y - d * v0); ctx.lineTo(xb(v0), y - d * v0); ctx.lineTo(xb(v1), y - d * v1); ctx.lineTo(xa(v1), y - d * v1); ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, P.ind2], [1, P.night1]]); ctx.fillRect(x - w / 2, y, w, h);
  ctx.restore();
}
const STONE_TOP = F.STONE.top;

// ================================================================================================================= ROW1 + ROW2 ON ONE PLAIN
// both rows of the row world (S.rowWorld draws only one), merged and drawn far → near so they never interleave wrongly.
// o { a1, a2 angles · cool1, cool2 · gold1, gold2 · du { x, y, h, walk, look } | false · jakob { look } | false · lamps (fn) }
export function rowsBoth(ctx, c, t, o = {}) {
  F.sky(ctx, c, t, { glow: S.SKY_GLOW }); F.plain(ctx, c, t);
  if (o.under) o.under(c);
  const c2 = S.shift(c, S.JR_DX), items = [];
  const add = (R, cam, ang, cool, gold, shiftW) => R.stones.forEach((s, i) => items.push({ Z: s.Z, wx: (s.x - W / 2) * s.Z / F0 + shiftW, fn: () => {
    const a = ang ? ang[i] || 0 : 0, g = i === 0 ? gold : 0;
    E.card(ctx, cam, s.Z, () => {
      if (a < 1.2 && !g) { const len = s.h * (1.1 - a * .6); ctx.fillStyle = lin(ctx, s.x, s.y, s.x + len, s.y + len * .18, [[0, rgba(P.night0, .55)], [1, rgba(P.night0, 0)]]);
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x + s.w, s.y); ctx.lineTo(s.x + s.w + len, s.y + len * .2); ctx.lineTo(s.x + len * .9, s.y + len * .26); ctx.closePath(); ctx.fill(); }
      F.stone(ctx, t, s.x, s.y, s.h, { w: s.w, fall: a, glyph: g > .5 ? null : s.glyph, rim: 1 - .6 * clamp(a), gold: g, glyphWarm: 0, dark: .25 * clamp(cool?.[i] ?? 0) });
    });
  } }));
  add(S.ROW1, c, o.a1, o.cool1, o.gold1 ?? 1, 0);
  if (o.row2 !== false) add(S.ROW2, c2, o.a2, o.cool2, o.gold2 ?? 1, S.JR_DX);
  // figures at F0 (row 1: du; row 2: Jakob, a hair behind so a stone at F0 of row 2 stays behind him)
  if (o.du !== false) items.push({ Z: F0 - 1, fn: () => E.card(ctx, c, F0, () => {
    const d = o.du || {}, x = d.x ?? S.DU1.x;
    if (d.walk != null) E.du(ctx, x, S.DU1.y, S.DU1.h, { pose: 'walk', walk: d.walk, dir: 1, light: -1 });
    else du(ctx, t, x, S.DU1.y, S.DU1.h, { look: d.look ?? .3, light: 1 });
  }) });
  if (o.jakob) items.push({ Z: F0 * 1.01 - 1, fn: () => {
    E.card(ctx, c2, F0, () => F.pool(ctx, S.JAKOB2.x + 120, S.JAKOB2.y + 4, 330, 46, o.jakob.a ?? 1));
    E.card(ctx, c2, F0 * 1.01, () => F.jakob(ctx, t, S.JAKOB2.x, S.JAKOB2.y, S.JAKOB2.h, { look: o.jakob.look ?? .15, dir: 1, light: 1, seed: 2 }));
  } });
  items.sort((p, q) => q.Z - p.Z).forEach((it) => it.fn());
}
// tiny lamps waking on the horizon (subscribe 2 / end screen): n seeded lamps on the horizon card, each wakes at its own time in [t0, t1]
const LAMPS = (() => { const r = prng(2511), out = []; for (let i = 0; i < 46; i++) out.push({ u: r(), d: r(), w: r(), s: .6 + r() * .8 }); return out; })();
export function horizonLamps(ctx, c, t, t0, t1, o = {}) {
  const x0 = o.x0 ?? -6000, x1 = o.x1 ?? 14000;
  E.card(ctx, c, F.Z_HOR * .92, () => {
    for (const L of LAMPS) {
      const tw = lerp(t0, t1, L.w), u = expoOut(span(t, tw, tw + 1.4)); if (u <= 0) continue;
      const x = lerp(x0, x1, L.u), y = F.HOR - 4 - L.d * 10, s = L.s * (o.scale ?? 1), b = 1 + .12 * Math.sin(t * (1.3 + L.d) + L.u * 9);
      halo(ctx, x, y - s * 18, s * 120 * u * b, .32 * u, P.halo1, P.halo0);
      ctx.fillStyle = mixHex(P.halo0, P.core1, .5); ctx.fillRect(x - s * 4, y - s * 30 * u, s * 8, s * 30 * u);
    }
  });
}
