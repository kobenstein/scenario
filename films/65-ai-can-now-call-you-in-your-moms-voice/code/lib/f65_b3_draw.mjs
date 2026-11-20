// Film 65 · B3 (c12–c16) · own drawings: the bank hall behind the counter window (one or two counter windows, the teller, her savings,
// the transfer path, her at the counter), the blue copy of pole 5 that cannot form, the three tiles over the town (a recording, a photo,
// a life posted online), the study panel on her phone (AI · HUMAN). Builder module (B3 only): lib/f65_kit.mjs and lib/f65_seams.mjs stay untouched.
import * as E from './f10_editorial.mjs';
import * as F from './f65_kit.mjs';
import * as S from './f65_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, halo, lin, rad, sineIO, expoOut, expoIn } = E;
const { GOLD, COPY, NEUTRAL, LAMP, INK, WOOD, rise, maskLine, measure } = F;
const TAU = Math.PI * 2;

// ================================================================================================================= THE BANK HALL
// Hall coordinates: the 1920 × 1080 frame of the first view through the counter window (window A = HER bank, centred). Window B (the
// broker / the second state) stands 1400 px to the left on the same counter. A hall camera { fx, fy, z } maps hall point p to the screen:
// W/2 + (p.x − fx)·z, H/2 + (p.y − fy)·z. Everything in the hall is drawn in hall coordinates, so a camera move is a real move through the room.
export const HALL = {
  A: { x: 960, glass: { x: 560, y: 150, w: 800, h: 470 } },
  B: { x: -440, glass: { x: -840, y: 150, w: 800, h: 470 } },
  ledge: 620,
  stack: [1250, 560],      // her savings on the shelf behind the teller (window A, hall coords: the bottom coin)
  teller: [1000, 1150, 820],
  mom: [420, 1460, 1180],
  slot: [835, 566],        // where a note leans on the glass at the counter (window A)
};
export const hallCam = (fx, fy, z) => ({ fx, fy, z });
export const hallPt = (c, x, y) => [W / 2 + (x - c.fx) * c.z, H / 2 + (y - c.fy) * c.z];
export const hallRect = (c, r) => { const p = hallPt(c, r.x, r.y); return { x: p[0], y: p[1], w: r.w * c.z, h: r.h * c.z }; };
export const lerpHall = (a, b, u) => ({ fx: lerp(a.fx, b.fx, u), fy: lerp(a.fy, b.fy, u), z: Math.exp(lerp(Math.log(a.z), Math.log(b.z), u)) });

function coinStack(ctx, t, x, y, n, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  halo(ctx, x, y - n * 7, 150, .22 * (o.glow ?? 1), GOLD.halo, GOLD.core);
  for (let k = 0; k < n; k++) {
    const yy = y - k * 14, dx = 2.5 * Math.sin(k * 2.1);
    ctx.fillStyle = GOLD.deep; ctx.beginPath(); ctx.ellipse(x + dx, yy + 4, 46, 12, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = lin(ctx, x - 46, 0, x + 46, 0, [[0, mixHex(GOLD.halo, GOLD.deep, .2)], [.45, GOLD.body], [1, mixHex(GOLD.core, GOLD.body, .4)]]);
    ctx.beginPath(); ctx.ellipse(x + dx, yy, 46, 11, 0, 0, TAU); ctx.fill();
  }
  ctx.strokeStyle = rgba(GOLD.deep, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x + 2.5 * Math.sin((n - 1) * 2.1), y - (n - 1) * 14, 32, 7, 0, 0, TAU); ctx.stroke();
  ctx.restore();
}

// one counter window (glass rect g, hall coords): the back office behind it (warm lamp light), the teller, the shelf, the frame
function counterWindow(ctx, t, g, o = {}) {
  const lit = o.lit ?? 1, a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.save(); ctx.beginPath(); ctx.rect(g.x, g.y, g.w, g.h); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, g.y, 0, g.y + g.h, [[0, mixHex(LAMP.deep, P.night1, .35)], [.55, mixHex(LAMP.halo, LAMP.deep, .55)], [1, mixHex(LAMP.deep, P.night0, .3)]]);
  ctx.fillRect(g.x, g.y, g.w, g.h);
  ctx.fillStyle = rad(ctx, g.x + g.w * .5, g.y + 40, g.w * .75, [[0, rgba(LAMP.core, .32 * lit)], [.5, rgba(LAMP.body, .1 * lit)], [1, rgba(LAMP.body, 0)]]); ctx.fillRect(g.x, g.y, g.w, g.h);
  // dust in the lamp light (secondary action: the room is never frozen)
  for (let k = 0; k < 16; k++) {
    const sx = g.x + ((k * 197.3) % g.w), yy = g.y + g.h - (((t * (9 + (k % 5) * 3) + k * 61) % (g.h + 40))), x = sx + 14 * Math.sin(t * .4 + k * 1.7);
    const r = 1.6 + (k % 3) * .8, al = .22 * lit * (.5 + .5 * Math.sin(t * .9 + k * 2.3));
    if (al > 0) { ctx.fillStyle = rgba(LAMP.core, al); ctx.beginPath(); ctx.arc(x, yy, r, 0, TAU); ctx.fill(); }
  }
  // the back wall: a dark door and a shelf behind the teller
  ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(g.x + 60, g.y + 120, 120, g.h - 120);
  ctx.fillStyle = mixHex(WOOD.body, LAMP.deep, .5); ctx.fillRect(g.x + g.w - 250, g.y + 412, 220, 14);
  if (o.stack) coinStack(ctx, t, g.x + g.w - 140, g.y + 405, o.stack, { glow: o.stackGlow ?? 1 });
  if (o.back) o.back(ctx);
  // the teller (a real person: step 5), seen across the counter, facing her
  if ((o.teller ?? 1) > 0) {
    const tx = g.x + g.w * .55 + (o.tellerDx ?? 0), ty = g.y + g.h + 440, th = 820;
    E.person(ctx, tx, ty, th, { dir: -1, look: o.look ?? (.08 + .04 * Math.sin(t * .5)), lean: o.lean ?? .03, light: -1, a: o.teller ?? 1, armR: o.armR, armL: o.armL });
    if (o.tellerLit) halo(ctx, tx - 20, ty - th * .78, 240, .3 * o.tellerLit, GOLD.halo, GOLD.core);
  }
  if (o.front) o.front(ctx);
  // the glass: a faint diagonal sheen
  ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(P.cream, .035);
  ctx.beginPath(); ctx.moveTo(g.x + g.w * .62, g.y); ctx.lineTo(g.x + g.w * .78, g.y); ctx.lineTo(g.x + g.w * .5, g.y + g.h); ctx.lineTo(g.x + g.w * .34, g.y + g.h); ctx.closePath(); ctx.fill();
  ctx.restore();
  // the frame and the small speaking slot
  ctx.strokeStyle = mixHex(WOOD.lit, P.cream, .25); ctx.lineWidth = 14; ctx.strokeRect(g.x, g.y, g.w, g.h);
  ctx.fillStyle = rgba(P.night0, .55); ctx.fillRect(g.x + g.w * .35, g.y + g.h - 14, g.w * .3, 14);
  ctx.restore();
}

// hall(ctx, t, w, h, o): o.cam { fx, fy, z } · o.A, o.B (counterWindow options; o.B.a = 0 hides window B) · o.mom { a, look, lean, armR, armL } | false
//   o.over(ctx) (hall coords, after the counter, before her) · o.top(ctx) (hall coords, last)
export function hall(ctx, t, w, h, o = {}) {
  const c = o.cam ?? hallCam(W / 2, H / 2, 1);
  ctx.save(); ctx.scale(w / W, h / H);
  // the hall wall (pale stone in lamp light), fills the whole frame whatever the camera
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, mixHex(P.night1, LAMP.deep, .2)], [.6, mixHex(P.night1, LAMP.deep, .3)], [1, mixHex(P.night0, LAMP.deep, .12)]]); ctx.fillRect(-10, -10, W + 20, H + 20);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(c.z, c.z); ctx.translate(-c.fx, -c.fy);
  // lamps over the windows, pilasters between them
  for (const X of [HALL.A.x, HALL.B.x]) { ctx.fillStyle = rad(ctx, X, 60, 760, [[0, rgba(LAMP.body, .2)], [.5, rgba(LAMP.halo, .06)], [1, rgba(LAMP.halo, 0)]]); ctx.fillRect(X - 800, -300, 1600, 1400); }
  for (const X of [-1500, 260, 1660]) { ctx.fillStyle = lin(ctx, X - 60, 0, X + 60, 0, [[0, mixHex(P.night1, LAMP.deep, .32)], [1, mixHex(P.night1, LAMP.deep, .2)]]); ctx.fillRect(X - 60, -400, 120, 1100); }
  ctx.restore();
  F.paper(ctx, t, { a: .8, x: -c.fx * c.z * .5 });
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(c.z, c.z); ctx.translate(-c.fx, -c.fy);
  if ((o.B?.a ?? 1) > 0) counterWindow(ctx, t, HALL.B.glass, o.B || {});
  counterWindow(ctx, t, HALL.A.glass, o.A || {});
  // the counter: a ledge and the panelled front, across the whole hall
  ctx.fillStyle = lin(ctx, 0, HALL.ledge, 0, HALL.ledge + 34, [[0, mixHex(WOOD.lit, LAMP.body, .25)], [1, mixHex(WOOD.body, LAMP.deep, .4)]]); ctx.fillRect(-2600, HALL.ledge, 6000, 34);
  ctx.fillStyle = lin(ctx, 0, HALL.ledge + 34, 0, 1400, [[0, mixHex(WOOD.body, LAMP.deep, .45)], [1, mixHex(WOOD.shade, LAMP.deep, .15)]]); ctx.fillRect(-2600, HALL.ledge + 34, 6000, 1400);
  ctx.strokeStyle = rgba(P.night0, .35); ctx.lineWidth = 4; for (let x = -2500; x < 3400; x += 280) { ctx.strokeRect(x, HALL.ledge + 80, 220, 330); }
  if (o.over) o.over(ctx);
  // her (from behind, at the counter of window A)
  const mo = o.mom;
  if (mo && (mo.a ?? 1) > 0) {
    const [mx, my, mh] = HALL.mom;
    o.momOut = F.mom(ctx, mx + (mo.dx ?? 0), my, mh, { dir: 1, back: .8, look: mo.look ?? 0, lean: mo.lean ?? .05, light: 1, armR: mo.armR, armL: mo.armL ?? [-.1, -.05], a: mo.a ?? 1 });
  }
  if (o.top) o.top(ctx, o.momOut || {});
  ctx.restore();
  ctx.restore();
  return o.momOut;
}

// a note lying / leaning at the counter (hall coords) and a transfer path (a gold line with travelling dots)
export function transferPath(ctx, t, pts, u, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || u <= 0) return;
  F.accentSpan(ctx, pts, 0, u, { col: GOLD, w: o.w ?? 3, a: a * (o.line ?? .55), spark: u < 1 });
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const tot = L[L.length - 1], at = (d) => { let i = 1; while (i < pts.length - 1 && L[i] < d) i++; const f = clamp((d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1])); return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]; };
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const n = o.n ?? 9, sp = o.speed ?? 120, hold = o.hold;   // hold: dots stop at fraction hold (0..1) of the path
  for (let k = 0; k < n; k++) {
    let d = ((t * sp + k * tot / n) % tot);
    if (hold != null) d = Math.min(d, hold * tot - k * 10);
    if (d > u * tot || d < 0) continue;
    const [x, y] = at(d), fade = clamp(d / 60) * clamp((tot - d) / 80);
    halo(ctx, x, y, 22, .55 * a * fade, GOLD.halo, GOLD.core);
    ctx.fillStyle = rgba(GOLD.core, .95 * a * fade); ctx.fillRect(x - 4, y - 4, 8, 8);
  }
  ctx.restore();
}

// ================================================================================================================= THE COPY OF POLE 5
// (world) a blue copy of pole 5 tries to form beside it and slides off: there is nothing to copy. u 0..1 forms it, off 0..1 slides it away.
export function ghostPole5(ctx, c, t, u, off) {
  if (u <= 0 || off >= 1) return;
  const p = S.WORLD.poles[4], y0 = S.herY(p.x), e = sineIO(off);
  const dx = 40 + 50 * sineIO(u) + 420 * e, dy = -60 * e * e;
  const pr = S.proj(c, p.x + dx, y0 + dy, p.z + 30); if (!pr) return;
  ctx.save(); ctx.globalAlpha = clamp(u * 1.6) * (1 - e) * (.72 + .28 * Math.sin(t * 2.3 + 5) * (1 - e));
  ctx.setTransform(pr[2], 0, 0, pr[2], pr[0], pr[1]); ctx.rotate(.22 * e + .025 * Math.sin(t * 3.1) * u);
  const h = p.h * (.35 + .65 * sineIO(clamp(u * 1.3))), col = rgba(COPY.body, .72);
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-11, 0); ctx.lineTo(-7, -h); ctx.lineTo(7, -h); ctx.lineTo(11, 0); ctx.closePath(); ctx.fill();
  ctx.fillRect(-58, -h + 26, 116, 12);
  ctx.fillStyle = rgba(COPY.core, .6); for (const ix of [-46, 46]) ctx.fillRect(ix - 4, -h + 14, 8, 13);
  ctx.strokeStyle = rgba(COPY.line, .35); ctx.lineWidth = 2; ctx.strokeRect(-12, -h, 24, h);
  // the empty tag place: a dashed outline (there is no step 5 to copy)
  ctx.setLineDash([8, 6]); ctx.strokeStyle = rgba(COPY.line, .7); ctx.strokeRect(-37, -250 * h / p.h - 46, 74, 92); ctx.setLineDash([]);
  ctx.restore();
}

// ================================================================================================================= THE THREE TILES (c14)
// a small tile over the town (centre x, y; s = width px): 'rec' (a gold voice snippet), 'photo' (a framed picture: a person under a sun),
// 'life' (a feed of posts). Night paper, a cream rim. u grows it out of its window (from: [x, y]).
export function tile(ctx, t, kind, x, y, s, u, o = {}) {
  u = clamp(u); if (u <= 0) return null;
  const e = expoOut(u), from = o.from ?? [x, y + 200], cx = lerp(from[0], x, e), cy = lerp(from[1], y, e), w = s * lerp(.12, 1, e), h = w * .72;
  ctx.save(); ctx.globalAlpha *= clamp(u * 3) * (o.a ?? 1);
  halo(ctx, cx, cy, w * .9, .16, LAMP.halo, LAMP.core);
  ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, w * .05); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, w * .05); ctx.clip(); ctx.translate(cx - w / 2, cy - h / 2); const k = w / 100; ctx.scale(k, k);
  if (kind === 'rec') {
    F.voiceWave(ctx, t, [[10, 36], [90, 36]], { amp: 16, col: GOLD, seed: 11, speed: 30, taper: .2 });
  } else if (kind === 'photo') {
    ctx.fillStyle = mixHex(P.blue0, P.ind1, .3); ctx.fillRect(8, 8, 84, 56);
    ctx.fillStyle = rgba(LAMP.core, .8); ctx.beginPath(); ctx.arc(72, 22, 7, 0, TAU); ctx.fill();
    ctx.fillStyle = mixHex(P.ind1, P.night1, .4); ctx.beginPath(); ctx.moveTo(8, 64); ctx.lineTo(36, 40); ctx.lineTo(58, 56); ctx.lineTo(70, 48); ctx.lineTo(92, 64); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mixHex(P.halo2, LAMP.body, .3); ctx.beginPath(); ctx.ellipse(46, 62, 10, 8, 0, Math.PI, 0); ctx.fill(); ctx.beginPath(); ctx.arc(46, 46, 6, 0, TAU); ctx.fill();
  } else {
    for (let r = 0; r < 3; r++) { const yy = 10 + r * 20 - ((t * 4) % 20); ctx.fillStyle = rgba(LAMP.body, .55); ctx.fillRect(10, yy, 16, 14); ctx.fillStyle = rgba(P.halo2, .45); ctx.fillRect(32, yy + 2, 50 - r * 8, 4); ctx.fillRect(32, yy + 9, 34 + r * 6, 3); }
  }
  ctx.restore();
  ctx.strokeStyle = rgba(P.cream, .55); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, w * .05); ctx.stroke();
  ctx.restore();
  return { x: cx, y: cy, w, h };
}

// ================================================================================================================= THE STUDY (c15, on her phone)
// panel inside the phone portal (pw × ph local px): ONE SMALL STUDY · two chat bubbles AI · HUMAN · then who got the yes: AI bar (blue) vs HUMAN (gold)
export function studyPanel(ctx, t, pw, ph, o) {
  ctx.fillStyle = lin(ctx, 0, 0, 0, ph, [[0, mixHex(P.ind1, P.blue0, .35)], [1, P.night1]]); ctx.fillRect(0, 0, pw, ph);
  ctx.fillStyle = rad(ctx, pw * .3, ph * .3, pw * .7, [[0, rgba(P.blue1, .18)], [1, rgba(P.blue1, 0)]]); ctx.fillRect(0, 0, pw, ph);
  // ONE SMALL STUDY (bracket over the chat)
  F.bracket(ctx, 90, 590, 120, o.study, 'ONE SMALL STUDY', { size: 30 });
  // the chat: two bubbles, each typing (three dots that breathe)
  const bub = (y, label, col, u, glow, side) => {
    if (u <= 0) return;
    const e = expoOut(u), bw = 380, bh = 96, x = 100 + (1 - e) * -30 * side;
    ctx.save(); ctx.globalAlpha *= clamp(u * 2);
    if (glow > 0) halo(ctx, x + bw / 2, y + bh / 2, 260, .4 * glow, col.halo, col.core);
    ctx.fillStyle = rgba(mixHex(col.body, P.night1, .55), .95); ctx.beginPath(); ctx.roundRect(x, y, bw, bh, 30); ctx.fill();
    ctx.strokeStyle = rgba(col.line, .8 + .2 * glow); ctx.lineWidth = 2.5; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + 40, y + bh - 2); ctx.lineTo(x + 22, y + bh + 22); ctx.lineTo(x + 70, y + bh - 2); ctx.closePath(); ctx.fillStyle = rgba(mixHex(col.body, P.night1, .55), .95); ctx.fill();
    E.glowText(ctx, label, x + 36, y + 62, { size: 36, weight: 600, col: col.text, glow: false, spacing: .08 });
    for (let k = 0; k < 3; k++) { ctx.fillStyle = rgba(col.core, .45 + .45 * Math.max(0, Math.sin(t * 4 - k * .9))); ctx.beginPath(); ctx.arc(x + bw - 110 + k * 30, y + bh / 2, 7, 0, TAU); ctx.fill(); }
    ctx.restore();
  };
  bub(190, 'AI', COPY, o.chat, o.aiGlow, 1);
  bub(350, 'HUMAN', GOLD, rise(span(o.chat, .25, 1)), 0, 1);
  // who got the yes: two bars (AI longer: more than twice as often; true proportion 46 : 18)
  const bu = o.bars; if (bu > 0) {
    const x0 = 640, L = 470;
    maskLine(ctx, [['AGREED TO ITS REQUEST', 0]], x0, 200, 26, rise(span(bu, 0, .5)), { serif: false, weight: 600, col: P.halo2, glow: false });
    const bar = (y, v, col, label, val, uu) => {
      if (uu <= 0) return; const len = Math.max(4, L * v * expoOut(uu));
      halo(ctx, x0 + len / 2, y, len * .6, .14, col.halo, col.body);
      ctx.fillStyle = lin(ctx, 0, y - 24, 0, y + 24, [[0, col.core], [.35, col.body], [1, mixHex(col.halo, col.deep, .4)]]); ctx.beginPath(); ctx.roundRect(x0, y - 24, len, 48, 6); ctx.fill();
      maskLine(ctx, [[label, 0]], x0, y - 40, 24, rise(uu), { serif: false, weight: 600, col: col.text, glow: false });
      if (val) maskLine(ctx, [[val, 0]], x0 + len - measure(val, 34, true), y + 76, 34, rise(span(uu, .5, 1)), { serif: true, col: P.cream, glow: false });
    };
    bar(290, 1, COPY, 'AI', 'more than 2×', span(bu, .15, .8));
    bar(450, 18 / 46, GOLD, 'HUMAN', '', span(bu, .3, .95));
  }
}
