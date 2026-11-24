// Film 41 · the recurring SCENES (anchors only, REGELN §13) + the seam plates between the builder groups + the end screen
// (owned by the lead; builders import, never edit — wishes go in the report).
// This film is NOT one world the camera flies through. Most sentences are their own explainer graphic on THE STAGE (F.stage). A few
// designed scenes come back as anchors (each a new composition, never the same background zoomed):
//   THE SKY (sky): Gates' verdict as a giant hand of warm light over the night, you tiny at your desk below (thumbnail A). H.01 · 1.07 ·
//     4.09 (behind the verdict card) · 9.09 (final picture, the list standing beside your desk).
//   YOUR WINDOW (F.yourWindow): your lit window, you at your desk inside. H.07–H.09 · M.01 · 6.08 · 8.05 · 8.09.
//   Scenes the builders design themselves (one each): the bus stop NOW (c03), the night office (c03), the site and field (c04), the
//   factory yard with the tax scale (c06), the typewriter (c07), the jury box (c08), the tower of 100 windows (c08/c09), the far end (c10).
//
// A plate is the EXACT picture at a group boundary. The handing side converges onto the plate and draws it for t in [T0 − .5, T0); the
// receiving side draws the same plate for t in [T0, T0 + .5) and grows its next graphic out of it. Plates creep (CREEP 4 %/s push from
// T0 − .5, about the plate's own centre); the receiving side continues the creep until its first move takes over.
//   Lead → B1 at T.G('What changed is his picture') (c01 → c02): plateMachine  the C1 plate shrunk to a cream frame, inside it a small
//            cyan disc (the machine) and an amber person dot side by side on a cream line. B1 (1.01) grows the disc.
//   B1 → B2  at T.G('Then the numbers') (c04 → c05): plateNumbers  the −19 % chart small at the left (two lines, the gap), a gold
//            baseline across the frame; the timeline top right (NOW and 2–8 YEARS lit). B2 (4.01) frames the chart's corner.
//   B2 → B3  at T.G('Take the jury') (c07 → c08): plateJury  THE LIST centred: HUMAN RESERVED, lines CHILD CARE · JURY · ART · TEACHING ·
//            A PERSON IN CHARGE, the JURY line glowing; timeline top right. B3 (7.01) lifts the JURY line.
import * as E from './f10_editorial.mjs';
import * as F from './f41_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, halo, lin } = E;
const { GOLD, CREAM, CREAM2, MACH, AMBER } = F;
const TAU = Math.PI * 2;

export const SEAM_HALF = .5;
export const CREEP = .04;
export const creep = (t, T, phrase, nth = 0) => 1 + CREEP * Math.max(0, t - (T.G(phrase, nth) - SEAM_HALF));
// scale the whole frame about (cx, cy) by k (a plate's creep; the receiving side keeps calling it until its own move takes over)
export function zoomAbout(ctx, k, cx = W / 2, cy = H / 2) { ctx.translate(cx, cy); ctx.scale(k, k); ctx.translate(-cx, -cy); }

// ======================================================================================================================== THE SKY
// sky(ctx, t, o): the stage + the hand of light + you at your desk. o: { turn 0..1 (0 thumb up, 1 down), lum (hand light, 1 = hero),
// ghost, arrow, drop (px: the ground and you sink out), hand { x, y, L } (wrist; default the thumbnail: the arm from the top right, fist upper middle), you { x, y, h, look } |
// false, ground 0..1 (the ground line and the far lit windows), a }. Returns the hand's points (tip, fist) for carriers.
export const SKY_HAND = { x: 1600, y: 330, L: 300 };
export const SKY_YOU = { x: 960, y: 900, h: 130 };
export const skyFist = (hd = SKY_HAND) => [hd.x + Math.cos(2.55) * .5 * hd.L, hd.y + Math.sin(2.55) * .5 * hd.L];   // the fist centre (carriers)
export function sky(ctx, t, o = {}) {
  const hd = { ...SKY_HAND, ...(o.hand || {}) }, g = clamp(o.ground ?? 1);
  F.stage(ctx, t, { n: 110, a: .6 });
  // the ground: a low dark band with far lit windows (other people's jobs), you at your desk on it
  if (g > 0) {
    ctx.save(); ctx.globalAlpha *= g; ctx.translate(0, o.drop ?? 0);
    const gy = SKY_YOU.y;
    ctx.fillStyle = lin(ctx, 0, gy - 60, 0, H, [[0, mixHex(P.night1, P.ind1, .4)], [1, P.night0]]);
    ctx.beginPath(); ctx.moveTo(0, gy - 30); ctx.bezierCurveTo(W * .3, gy - 50, W * .7, gy - 20, W, gy - 44); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
    const r = E.prng(4141);
    for (let i = 0; i < 26; i++) { const x = r() * W, y = gy - 36 - r() * 18, s = 5 + r() * 5, on = .5 + .5 * Math.sin(t * (.3 + r() * .4) + i); if (Math.abs(x - SKY_YOU.x) < 180) continue;
      ctx.fillStyle = rgba(AMBER.body, .35 + .3 * on); ctx.fillRect(x, y, s, s * 1.2); }
    ctx.restore();
  }
  const h = o.hand === false ? null : F.hand(ctx, t, hd.x, hd.y, hd.L, { turn: o.turn ?? 1, lum: o.lum ?? 1, ghost: o.ghost ?? 0, arrow: o.arrow ?? 0, a: o.a ?? 1, dust: o.dust ?? .6 });
  if (o.you !== false && g > 0) { const y = { ...SKY_YOU, ...(o.you || {}) }; F.desk(ctx, t, y.x, y.y + (o.drop ?? 0), y.h, { look: y.look ?? 0, a: g }); }
  return h;
}

// ======================================================================================================================== THE PLATES
export const MACH_FRAME = { x: 580, y: 250, w: 760, h: 520 };          // plateMachine's frame (= the C1 plate shrunk)
export function machinePic(ctx, t, box, o = {}) {   // inside the frame: a cream line, the cyan disc and the amber person dot, same size
  const { x, y, w, h } = box, gy = y + h * .66, r = h * .1, a = o.a ?? 1;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.strokeStyle = rgba(CREAM, .45); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + w * .14, gy); ctx.lineTo(x + w * .86, gy); ctx.stroke();
  const mx = x + w * .38, px = x + w * .62, br = 1 + .04 * Math.sin(t * 1.3), by = h * .035 * Math.sin(t * 1.1), py = h * .035 * Math.sin(t * 1.1 + 1.6);
  halo(ctx, mx, gy - r, r * 3, .35, MACH.halo, MACH.core);
  ctx.fillStyle = lin(ctx, 0, gy - r * 2, 0, gy, [[0, MACH.hot], [1, MACH.mid]]); ctx.beginPath(); ctx.arc(mx, gy - r * br + by, r * br, 0, TAU); ctx.fill();
  halo(ctx, px, gy - r, r * 3, .35, AMBER.body, AMBER.core);
  ctx.fillStyle = lin(ctx, 0, gy - r * 2, 0, gy, [[0, AMBER.hot], [1, AMBER.shade]]); ctx.beginPath(); ctx.arc(px, gy - r + py, r, 0, TAU); ctx.fill();
  ctx.restore();
}
export function plateMachine(ctx, t, T) {
  const k = creep(t, T, 'What changed is his picture'), B = MACH_FRAME;
  F.stage(ctx, t);
  ctx.save(); zoomAbout(ctx, k, B.x + B.w / 2, B.y + B.h / 2);
  ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.beginPath(); ctx.roundRect(B.x, B.y, B.w, B.h, 8); ctx.fill();
  ctx.strokeStyle = P.cream; ctx.lineWidth = 2; ctx.stroke();
  machinePic(ctx, t, B);
  ctx.restore();
}
// the −19 % gap chart (small): two lines from the left, peers flat, young in exposed jobs falling; the gap in gold. box = { x, y, w, h }
export function gapChart(ctx, t, box, o = {}) {
  const { x, y, w, h } = box, u = clamp(o.u ?? 1), a = o.a ?? 1;
  const top = (q) => [x + w * q, y + h * (.32 - .02 * q)], low = (q) => [x + w * q, y + h * (.32 + .42 * q * q)];
  ctx.save(); ctx.globalAlpha *= a;
  ctx.strokeStyle = rgba(CREAM2, .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.stroke();
  const N = 40, pts = (f) => Array.from({ length: N + 1 }, (_, i) => f(i / N * u));
  ctx.strokeStyle = CREAM; ctx.lineWidth = 3; ctx.beginPath(); pts(top).forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.stroke();
  ctx.strokeStyle = AMBER.body; ctx.beginPath(); pts(low).forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.stroke();
  const [ex, ey0] = top(u), [, ey1] = low(u);
  F.goldSpan(ctx, [[ex, ey0], [ex, ey1]], 0, 1, { w: 2.5, spark: false });
  F.heavy(ctx, '−19%', ex + 18, (ey0 + ey1) / 2 + h * .08, h * .26, 1, { gold: 1 });
  ctx.restore();
}
export const NUM_CHART = { x: 150, y: 330, w: 560, h: 300 };
export function plateNumbers(ctx, t, T) {
  const k = creep(t, T, 'Then the numbers');
  F.stage(ctx, t);
  ctx.save(); zoomAbout(ctx, k, NUM_CHART.x + NUM_CHART.w / 2, NUM_CHART.y + NUM_CHART.h / 2);
  gapChart(ctx, t, NUM_CHART);
  F.goldSpan(ctx, [[NUM_CHART.x + NUM_CHART.w + 60, NUM_CHART.y + NUM_CHART.h], [W - 140, NUM_CHART.y + NUM_CHART.h]], 0, 1, { w: 2, spark: false, a: .8 });
  ctx.restore();
  F.timeline(ctx, t, T);
}
export const JURY_LIST = { x: 720, y: 120, w: 480, h: 720 };
export const JURY_LINES = ['CHILD CARE', 'JURY', 'ART', 'TEACHING · A PERSON IN CHARGE'];
export function juryList(ctx, t, o = {}) {
  const L = JURY_LIST;
  return F.list(ctx, t, L.x, L.y, L.w, L.h, { n: 7, lines: JURY_LINES.map((s) => ({ text: s, gold: .8 })), lit: o.lit ?? 1, ...o });
}
export function plateJury(ctx, t, T) {
  const k = creep(t, T, 'Take the jury');
  F.stage(ctx, t);
  ctx.save(); zoomAbout(ctx, k, JURY_LIST.x + JURY_LIST.w / 2, JURY_LIST.y + JURY_LIST.h * .4);
  juryList(ctx, t);
  ctx.restore();
  F.timeline(ctx, t, T);
}

// ======================================================================================================================== THE END SCREEN
// The last 15 s: the list stands in the night, you at your desk at its foot, small lights in windows around; two calm free areas left
// and right for the YouTube video tiles; the subscribe pill below the centre. Nothing important in the tiles' areas or the bottom 15 %.
export const END_TILES = { left: { x: 80, y: 300, w: 640, h: 360 }, right: { x: 1200, y: 300, w: 640, h: 360 }, sub: { x: 960, y: 830 } };
export function endScreen(ctx, t, T) {
  const t0 = T.duration - 15, u = span(t, t0, t0 + 1.2);
  F.stage(ctx, t, { n: 90 });
  const r = E.prng(4242);
  for (let i = 0; i < 40; i++) { const x = r() * W, y = 700 + r() * 120, s = 4 + r() * 4; if (x > 760 && x < 1160) continue;
    ctx.fillStyle = rgba(AMBER.body, (.25 + .2 * Math.sin(t * (.3 + r() * .3) + i)) * u); ctx.fillRect(x, y, s, s * 1.2); }
  F.list(ctx, t, 810, 140, 300, 470, { n: 6, lit: 2, a: 1, head: 1 });
  F.desk(ctx, t, 960, 790, 70, { look: .6 });
  F.subscribe(ctx, t, END_TILES.sub.x, END_TILES.sub.y, span(t, t0 + .4, t0 + 1.4), { size: .9 });
}
