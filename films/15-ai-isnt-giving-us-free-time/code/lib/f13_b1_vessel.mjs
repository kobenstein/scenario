// Film 13 · B1 · c05 (144.20–178.00): Linder; the sand slips past you; this machine is different. Continues lib/f13_b1_board.mjs
// (same world, same stage camera: the small hourglass with the four columns in its lower bulb is the anchor; the ∞ is the carrier).
// scenes/sc05.mjs draws board.draw (sky, glass, ring) with this module's hooks and overlay; sc06 continues from the stalled thread.
//
// | ID    | anchor                     | picture (one idea)                                                                | moves (≤ 2)          | → carrier              |
// |-------|----------------------------|-----------------------------------------------------------------------------------|----------------------|------------------------|
// | 5.01  | 1970 · Linder · pattern    | the ∞ untwists into a vessel of one hour, gold sand in it · `1970` `STAFFAN LINDER`| ∞ → vessel           | the vessel             |
// |       |                            | `THE HARRIED LEISURE CLASS`                                                       |                      |                        |
// | 5.02  | valuable · cram            | on "valuable" the hour glows; on "cram" twelve things drop in and pack it full     | glow · things drop   | –                      |
// | 5.03  | free time · rushed         | last a deck chair (a phone lights on it) is pressed in on top; on "rushed" it all | chair · shake        | –                      |
// |       |                            | trembles                                                                          |                      |                        |
// | 5.04  | easier · more              | the things wind back, the vessel rounds into a cycle; a grain runs round it ·     | ring · grain         | the grain → the glass  |
// |       |                            | `EASIER` … `MORE`; you walk in on the ledge line from the right                    |                      |                        |
// | 5.05★ | handed over · slipped away | the hand of light takes the small hourglass and hands it over to you (it grows,  | hand · glass · sand  | –                      |
// |       |                            | is set down next to you); a crack, the sand leaks out and bends past your hands   |                      |                        |
// | 5.06  | machine · different        | the machine's ring rises behind the glass; the crack closes, the glass fills and  | ring · glass fills   | –                      |
// |       |                            | shines brighter                                                                   |                      |                        |
// | 5.07  | do the work · reaches you  | the columns (the work) rise out of the glass into the ring and dissolve; a thread  | columns · thread     | the stalled thread     |
// |       | Right?                     | of sand runs toward your raised hands and stops just short of them on "Right?"     |                      | (→ c06)                |
import * as B from './f13_b1_kit.mjs';
import { ICON } from './f13_b1_board.mjs';
const { E, K } = B;
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, halo, prng, rad, lin } = E;

const VS = { x: 1400, y: 500, w: 330, h: 420 };            // the vessel of one hour
const CYC = { x: 1080, y: 480, r: 200 };
const GROUND = 900;                                       // the ledge line (you and the glass stand on it)
const DUX = 1460, DUH = 330;
const GLASS_S = [860, GROUND];                            // the glass's base on screen once it is set down
const LW = 3;
const N = 120;
// a closed rounded rectangle sampled with N + 1 points, starting at the top-left corner going clockwise
function vesselPts(x, y, w, h, r = 40) {
  const segs = [], x0 = x - w / 2, y0 = y - h / 2, x1 = x + w / 2, y1 = y + h / 2, arc = (cx, cy, a0) => Array.from({ length: 9 }, (_, i) => [cx + Math.cos(a0 + i / 8 * Math.PI / 2) * r, cy + Math.sin(a0 + i / 8 * Math.PI / 2) * r]);
  const pts = [[x0 + r, y0], [x1 - r, y0], ...arc(x1 - r, y0 + r, -Math.PI / 2), [x1, y1 - r], ...arc(x1 - r, y1 - r, 0), [x0 + r, y1], ...arc(x0 + r, y1 - r, Math.PI / 2), [x0, y0 + r], ...arc(x0 + r, y0 + r, Math.PI), [x0 + r, y0]];
  return resample(pts, N);
}
// a smooth curve through the points (Catmull-Rom), sampled with n + 1 points
function smoothPts(pts, n) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < 12; k++) { const u = k / 12, u2 = u * u, u3 = u2 * u; out.push([0, 1].map((d) => .5 * (2 * p1[d] + (-p0[d] + p2[d]) * u + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * u2 + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * u3))); } }
  out.push(pts[pts.length - 1]); return resample(out, n);
}
function resample(pts, n) {
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const T = len[len.length - 1], out = []; let j = 1;
  for (let i = 0; i <= n; i++) { const d = i / n * T; while (j < pts.length - 1 && len[j] < d) j++; const f = (d - len[j - 1]) / Math.max(1e-6, len[j] - len[j - 1]); out.push([lerp(pts[j - 1][0], pts[j][0], f), lerp(pts[j - 1][1], pts[j][1], f)]); }
  return out;
}
const sc = (pts, x, y, s, sy = s) => pts.map(([px, py]) => [x + px * s, y + py * sy]);
const MORE_ICONS = {
  mail: [[-38, -24], [38, -24], [38, 24], [-38, 24], [-38, -24], [0, 4], [38, -24]],
  phone: [[-20, -36], [20, -36], [20, 36], [-20, 36], [-20, -36], [-20, -36], [-20, 24], [20, 24]],
  cup: [[-26, -20], [22, -20], [18, 30], [-22, 30], [-26, -20], [22, -20], [22, -10], [36, -10], [36, 10], [20, 12]],
  book: [[-36, -26], [0, -18], [36, -26], [36, 26], [0, 34], [-36, 26], [-36, -26], [0, -18], [0, 34]],
  chair: [[-50, 26], [-30, -6], [44, -6], [56, 26], [-30, -6], [-48, -40], [-40, -44], [-22, -6]],
};
const STUFF = ['mail', 'iron', 'phone', 'shirt', 'cup', 'book', 'loop', 'mail', 'vacuum', 'phone', 'spark', 'dryer'];

export function makeVessel(T, board) {
  const S = (w, n) => T.S('s07', w, n), S8 = (w, n) => T.S('s08', w, n);
  const a = {
    back: T.seg('s07').start, nineteen: S('nineteen'), staffan: S('Staffan'), pattern: S('pattern'), valuable: S('valuable'), cram: S('cram'),
    even: S('Even our'), free: S('free time'), rushed: S('rushed'), make: S('Make'), easier: S('easier'), more: S('more of'), every: S('Every time'),
    handed: S('handed'), over: S('over'), every2: S('And every'), slipped: S('slipped'), away: S('away'), you1: S('reached you'), but: S('But this'),
    machine: S('machine'), different: S('different'), easier2: S('work easier'), can: S('can do'), work: S('the work'), so: S('So this'),
    hour: S('the hour reaches'), reaches: S('reaches'), you2: S('reaches you'), right: S('Right'), s08: T.seg('s08').start, far: S8('far'),
  };
  const GG = board.GG, fx = {};   // fx: c06 effects (fall: the stalled thread falls, 0..1)
  // ---- the camera: the glass is carried from its place (left, small) to the ledge next to you, then a slow push in 5.07
  const VH = board.viewAt(GG.x, GG.base, GLASS_S[0], GLASS_S[1], .15);
  const tC0 = a.every + .15, tC1 = a.over + .45;
  board.addView(tC0, tC1, VH);
  board.addView(a.right - 1.2, a.far + 1.2, board.viewAt(GG.x + 1900, GG.base - 1300, 1180, 740, .15 * 1.07));   // the slow push (c06 continues it)
  // ---- the vessel / cycle outline (shares its parameter with the ∞, so the grain keeps running)
  const morphV = (t) => sineIO(span(t, a.back, a.back + 1.5));
  const morphC = (t) => sineIO(span(t, a.make - .3, a.easier + .2));
  const ringBack = (t) => sineIO(span(t, a.every - .6, a.every + .25));
  const V = vesselPts(VS.x, VS.y, VS.w, VS.h);
  const C = Array.from({ length: N + 1 }, (_, i) => { const th = -Math.PI * .75 + i / N * Math.PI * 2; return [CYC.x + Math.cos(th) * CYC.r, CYC.y + Math.sin(th) * CYC.r]; });
  const fill = (t) => (.22 * sineIO(span(t, a.staffan, a.pattern + .4)) + .1 * span(t, a.pattern + .4, a.cram - .1)) * (1 - sineIO(span(t, a.make - .4, a.make + .5)));
  const glow = (t) => smooth(span(t, a.valuable - .2, a.valuable + .6)) * (1 - smooth(span(t, a.make - .4, a.make + .4)));
  // the things that are crammed in (one every .09 s from "cram"); the deck chair last, on "free time"
  const slots = STUFF.map((k, i) => ({ k, t0: a.cram - .3 + i * .09, x: VS.x + ((i % 3) - 1) * 96, y: VS.y + VS.h / 2 - VS.h * .32 - 44 - Math.floor(i / 3) * 62 }));
  const chair = { t0: a.free - .45, x: VS.x, y: VS.y - VS.h / 2 + 52 };
  const unwind = (t) => 1 - sineIO(span(t, a.make - .45, a.make + .25));
  const shake = (t, i) => { const s = smooth(span(t, a.rushed - .3, a.rushed + .1)) * (1 - smooth(span(t, a.make - .6, a.make - .2))); return s ? [3 * s * Math.sin(t * 61 + i * 2.1), 2 * s * Math.sin(t * 47 + i * 1.3)] : [0, 0]; };

  // ---- the hand of light (5.05): from the upper left, fingertip at the glass's top
  const HO = { pose: 'open', spread: .25, curl: .2 }, ANG = Math.PI - 2.42 + .08, HL = 360;
  const tipL = E.handTip(HO, 1);
  const handIn = (t) => sineIO(span(t, a.every - 1.0, a.every + .15)), handOut = (t) => sineIO(span(t, a.over + .5, a.slipped - .1));
  // ---- you: walk in on the ledge line (5.04), turn to the glass, hands rise
  const duX = (t) => lerp(2150, DUX, sineIO(span(t, a.easier - .2, a.every - .2)));
  // ---- the leak (5.05) and the thread that reaches toward you (5.07), in screen coords at the set-down view
  const crack = (t) => expoOut(span(t, a.slipped - .35, a.slipped - .05)) * (1 - sineIO(span(t, a.different - .4, a.different + .6)));
  const leakU = (t) => sineIO(span(t, a.slipped - .1, a.you1 + .6));
  const leakTail = (t) => sineIO(span(t, a.different - .3, a.different + .7));
  const reachU = (t) => .82 * sineIO(span(t, a.so + .2, a.you2 + .2)) + .06 * sineIO(span(t, a.you2 + .1, a.right + .05));   // stalls at .88 on "Right?"

  // the glass (board world): crack, leak, the sand going and coming back, the columns rising into the ring
  board.hooks.glass = (t, v) => {
    const o = {};
    const c = crack(t); if (c > 0) o.crack = c;
    o.top = .5 - .18 * sineIO(span(t, a.slipped, a.you1 + .4)) + .45 * sineIO(span(t, a.different - .2, a.different + 1.2));
    o.glow = .6 + .7 * smooth(span(t, a.different - .3, a.different + .8));
    const lu = leakU(t), lt = leakTail(t);
    if (lu > 0 && lt < 1) o.leak = { u: lu, pts: leakPts(t, v) };
    if (lt > 0 && lu > 0) o.leak && (o.leak.u0 = lt);
    return o;
  };
  board.hooks.col = (i, t) => { const u = sineIO(span(t, a.work - .5 + i * .14, a.work + 1.2 + i * .14)); return u > 0 ? { dy: -GG.h * .5 * u, a: 1 - smooth(span(u, .55, 1)), cool: u } : null; };
  // the leak: out of the crack, an arc to the right over your hands, then down behind you
  function leakPts(t, v) {
    const c0 = [GG.x + .1 * GG.h, GG.base - .6 * GG.h];
    const s0 = board.toS(v, c0[0], c0[1], t), hx = DUX - 40, hy = GROUND - DUH * 1.05;
    const sp = [s0, [s0[0] + 70, s0[1] - 70], [lerp(s0[0], hx, .5), hy - 170], [hx - 30, hy - 75], [hx + 90, hy - 30], [hx + 190, hy + 90], [hx + 250, GROUND - 40], [hx + 270, GROUND + 160]];
    return smoothPts(sp, 80).map(([x, y]) => board.toW(v, x, y, t));
  }
  // the machine's ring behind the glass (5.06)
  board.hooks.under = (ctx, t, v) => {
    const ru = sineIO(span(t, a.machine - .3, a.machine + .9)); if (ru <= 0) return;
    const [nx, ny] = board.toS(v, GG.x, GG.base - GG.h * .52, t);
    B.ring(ctx, nx, ny, 330 * v.k / .15, t, { u: ru, a: 1, pulse: smooth(span(t, a.different - .5, a.different + .5)) });
  };

  function draw(ctx, t) {
    const v = board.view(t);
    board.draw(ctx, t);
    // ---- the ∞ → the vessel → the cycle (one outline, the grain keeps running round it)
    const rb = ringBack(t);
    if (rb < 1) {
      const R = board.ringPts(t), mv = morphV(t), mc = morphC(t);
      const pts = R.map((p, i) => { const q = [lerp(p[0], V[i][0], mv), lerp(p[1], V[i][1], mv)]; return [lerp(q[0], C[i][0], mc), lerp(q[1], C[i][1], mc)]; });
      // the vessel bulges a little while it is crammed
      const bulge = .045 * smooth(span(t, a.cram, a.cram + 1.2)) * (1 - mc);
      const P2 = pts.map(([x, y]) => [VS.x + (x - VS.x) * (1 + bulge), y]);
      board.drawRing(ctx, P2, t, { ice: 1 - mv, gold: mv, u0: rb, grain: rb < .05 });
    }
    // sand in the vessel
    const f = fill(t);
    if (f > .005) { const hgt = VS.h * f; B.goldBar(ctx, VS.x - VS.w / 2 + 14, VS.y + VS.h / 2 - 12 - hgt, VS.w - 28, hgt, t, { r: 24, glow: .5 + .6 * glow(t) }); }
    const g = glow(t); if (g > 0) halo(ctx, VS.x, VS.y + 60, 380, .35 * g, P.halo1, P.halo0);
    // the hour is poured: a stream of sand from above into the vessel (5.01–5.02)
    const ps = smooth(span(t, a.nineteen + .6, a.staffan + .2)) * (1 - smooth(span(t, a.cram - .6, a.cram - .1)));
    if (ps > 0) {
      const y0 = -20, y1 = VS.y + VS.h / 2 - 12 - VS.h * f, yh = lerp(y0, y1, smooth(span(t, a.nineteen + .6, a.staffan + .6))), yt = lerp(y0, y1, smooth(span(t, a.cram - .6, a.cram - .1)));
      K.trailSpan(ctx, [[VS.x, yt], [VS.x, yh]], 0, 1, { w: 2.4, a: ps, spark: false });
      const r = prng(61); ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 40; i++) { const q = (r() + t * (.4 + .15 * r())) % 1, y = lerp(y0, y1, q); if (y > yh || y < yt) continue; ctx.fillStyle = rgba(P.core1, .85 * ps); ctx.fillRect(VS.x - 2 + (r() - .5) * 9, y, 3.5, 3.5); }
      ctx.restore();
      if (yh >= y1 - 2) halo(ctx, VS.x, y1, 80, .7 * ps);
    }
    // the crammed things
    const uw = unwind(t);
    if (uw > 0) for (let i = 0; i < slots.length; i++) {
      const s = slots[i]; if (t < s.t0) continue;
      const u = span(t, s.t0, s.t0 + .32), y = lerp(-140, s.y, expoIn(u)) - (u >= 1 ? 8 * Math.exp(-(t - s.t0 - .32) * 9) * Math.sin((t - s.t0 - .32) * 30) : 0);
      const pr = smooth(span(t, chair.t0 + .2, chair.t0 + .5)) * 6;   // pressed down by the chair
      const [jx, jy] = shake(t, i), pts = ICON[s.k] || MORE_ICONS[s.k];
      K.trailSpan(ctx, sc(pts, s.x + jx, y + jy + pr * (Math.floor(i / 3) / 3), .78), 0, uw, { w: 2.6, spark: false });
    }
    if (uw > 0 && t > chair.t0) {
      const u = span(t, chair.t0, chair.t0 + .35), y = lerp(-140, chair.y, expoIn(u)), sq = 1 - .25 * smooth(span(t, a.rushed - .3, a.rushed + .1)) * (1 - smooth(span(t, a.make - .6, a.make - .2)));
      const [jx, jy] = shake(t, 20);
      K.trailSpan(ctx, sc(MORE_ICONS.chair, chair.x + jx, y + jy + (1 - sq) * 30, 1.05, 1.05 * sq), 0, uw, { w: 2.8, spark: false });
      // a phone lights on the chair, pinging faster and faster
      const pa = smooth(span(t, a.free, a.free + .4)) * uw, ping = .5 + .5 * Math.sin((t - a.free) * (6 + 14 * smooth(span(t, a.free, a.rushed))));
      if (pa > 0) B.phoneLight(ctx, chair.x + 18 + jx, y + jy - 16 * sq, 9, pa * (.6 + .4 * ping));
    }
    // text
    B.caption(ctx, t, 560, 330, { num: '1970', label: 'STAFFAN LINDER', src: 'THE HARRIED LEISURE CLASS', a: a.nineteen - .15, b: a.valuable + .6 });
    B.line(ctx, 'EASIER', CYC.x - CYC.r - 50, CYC.y + 20, B.inOut(t, a.easier - .25, a.every - .8), { size: 56, align: 'right' });
    B.line(ctx, 'MORE', CYC.x + CYC.r + 50, CYC.y + 20, B.inOut(t, a.more - .25, a.every - .7), { size: 56 });
    // ---- the ledge line and you
    // (you and the ledge live in the set-down frame VH: before the carry it is the screen, after it they follow the 5.07 push)
    const vv = t < tC1 ? VH : v, vk = vv.k / .15, wS = (x, y) => board.toS(vv, GG.x + (x - GLASS_S[0]) / .15, GG.base + (y - GROUND) / .15, t);
    const lg = sineIO(span(t, a.easier - .6, a.easier + .9));
    if (lg > 0) K.trailSpan(ctx, [wS(2000, GROUND), wS(-80, GROUND)], 0, lg, { w: 2.2 * vk, spark: lg < 1 });
    if (t > a.easier - .3) {
      const x = duX(t), walking = x > DUX + 1, lift = sineIO(span(t, a.handed - .2, a.over + .5)) * (1 - .55 * sineIO(span(t, a.away - .2, a.you1 + .4))) + .55 * sineIO(span(t, a.reaches - .3, a.you2 + .4)) * 1;
      const armR = [lerp(.18, 1.75, clamp(lift)), lerp(.1, 2.05, clamp(lift))], armL = [lerp(-.12, 1.45, clamp(lift)), lerp(-.06, 1.8, clamp(lift))];
      const look = lerp(.1, .5, sineIO(span(t, a.handed - .5, a.over))) - .4 * sineIO(span(t, a.away - .3, a.you1));
      ctx.save();
      const [px, py] = wS(x, GROUND);
      E.castShadow(ctx, px, py + 2, 24 * vk, 200 * vk, Math.PI + .3, .4);
      E.du(ctx, px, py, DUH * vk, { dir: -1, light: -1, walk: walking ? x / (DUH * .9) * Math.PI * 2 : undefined, look, armR, armL });
      ctx.restore();
    }
    // ---- the hand of light
    const hi = handIn(t), ho = handOut(t);
    if (hi > 0 && ho < 1) {
      const top = board.toS(v, GG.x, GG.base - GG.h * .97, t), tgt = [top[0] + 34, top[1] - 30];
      const m0 = E.handMatrix(0, 0, ANG - .2 * ho, HL, 1), tl = E.applyM(m0, ...tipL);
      const wx = tgt[0] - tl[0] + lerp(-900, 0, hi) - 1100 * ho, wy = tgt[1] - tl[1] + lerp(-700, 0, hi) - 900 * ho;
      E.lightHand(ctx, E.handMatrix(wx, wy, ANG - .2 * ho, HL * (1 + .015 * Math.sin(t * 1.2)), 1), t, { ...HO, spread: .25 + .3 * smooth(span(t, a.over - .1, a.over + .5)), curl: .2 * (1 - smooth(span(t, a.over - .1, a.over + .5))), lum: .76, dust: 4000 });
    }
    // ---- 5.07: the thread toward your hands (stops short of them)
    const ru = reachU(t);
    if (ru > 0) drawReach(ctx, t, v, ru);
  }
  // the reaching thread: from the lower bulb, up and over to your hands; returns its head
  function reachPts(t, v) {
    const s0 = board.toS(v, GG.x + .2 * GG.h, GG.base - .3 * GG.h, t), [hx, hy] = board.toS(v, GG.x + (DUX - 60 - GLASS_S[0]) / .15, GG.base - DUH * 1.18 / .15, t);   // your hands (raised)
    return smoothPts([s0, [s0[0] + 70, s0[1] - 60], [lerp(s0[0], hx, .55), hy - 150 * v.k / .15], [hx, hy]], 60);
  }
  function drawReach(ctx, t, v, u) {
    const fall = fx.fall ? fx.fall(t) : 0; if (fall >= 1) return null;
    let pts = reachPts(t, v);
    if (fall > 0) { const gy = board.toS(v, GG.x, GG.base, t)[1]; pts = pts.map(([x, y], i) => [x + 40 * fall * (i / pts.length), Math.min(gy - 2, y + 900 * fall * fall)]); }
    const head = K.trailSpan(ctx, pts, 0, u, { w: 3, spark: false, a: 1 - fall });
    if (fall > 0) { if (head) { const r = prng(8); ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 30; i++) { const ang = Math.PI + r() * Math.PI, rr = 160 * fall * r(); ctx.fillStyle = rgba(P.core1, .8 * (1 - fall)); ctx.fillRect(head[0] + Math.cos(ang) * rr, Math.min(board.toS(v, GG.x, GG.base, t)[1] - 2, head[1] + Math.sin(ang) * rr * .3), 3, 3); } ctx.restore(); } return null; }
    if (head) { const p = .5 + .5 * Math.sin(t * 5.3); halo(ctx, head[0], head[1], 46 + 10 * p, .75, P.halo0, P.core0);
      const r = prng(5); ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 14; i++) { const ang = r() * 6.28 + t * (.6 + r()), rr = 8 + 22 * r(); ctx.fillStyle = rgba(P.core1, .7 * r()); ctx.fillRect(head[0] + Math.cos(ang) * rr, head[1] + Math.sin(ang) * rr, 2.4, 2.4); } ctx.restore(); }
    return head;
  }
  return { draw, a, fx, reachU, reachPts, drawReach, DUX, DUH, GROUND, GLASS_S };
}
