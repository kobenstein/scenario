// Film 13 · B1 · c06 (178.00–236.70): not so far. Berkeley, the desk, the juggler, the hour worth more, Hassabis, the time machine,
// you before it, and into the lower bulb (B1 → B2 seam: lib/f13_seams.mjs plateGlass). Continues lib/f13_b1_board.mjs +
// lib/f13_b1_vessel.mjs (same t); scenes/sc06.mjs draws this module only.
// Owner direction 28.10.: separate clean pictures joined by a carrier; the hourglass is an anchor (5.05 → 6.01, 6.08–6.09).
//
// | ID    | anchor                       | picture (one idea)                                                              | moves (≤ 2)         | → carrier              |
// |-------|------------------------------|---------------------------------------------------------------------------------|---------------------|------------------------|
// | 6.01  | far @178.64                  | the stalled thread falls and scatters; a crack runs through the glass           | thread falls · crack| the machine's ring     |
// | 6.02  | company · Berkeley           | tilt up with the ring: it rises over an office building whose windows light ·  | tilt · windows      | one lit window         |
// |       |                              | `UC BERKELEY` · `HARVARD BUSINESS REVIEW · 2026`                                |                     |                        |
// | 6.03  | tasks off · plates           | (the window opens to the frame) a desk at night: someone at a laptop, piles of   | cards lift away     | –                      |
// |       |                              | task cards; on "tasks off" four are lifted away in cool light                    |                     |                        |
// | 6.04  | new ones · other roles ·     | new cards drop in, then cool ones (other roles): the pile is higher than before; | cards · day bar     | –                      |
// |       | evenings                     | a day bar `9` → `17` creeps on to `22`                                           |                     |                        |
// | 6.05  | assistants · one more ball   | three small rings rise from the laptop and are juggled above the head; on "one   | rings · arms        | the cards              |
// |       |                              | more ball" a fourth                                                              |                     |                        |
// | 6.06  | Linder · worth more than ever| the gold thread draws the vessel of one hour; the cards are crammed in; on       | cards · glow · line | the vessel = a window  |
// |       |                              | "worth more" it glows ever brighter and a steep line of value rises beside it    |                     |                        |
// | 6.07★ | Hassabis · dinner · night    | the night closes round the vessel: it is a lit window of a house; inside, a      | night closes · in   | –                      |
// |       |                              | family at dinner; then one figure at a laptop (cool) deep into the night ·       | the window          |                        |
// |       |                              | `DEMIS HASSABIS` · `GOOGLE DEEPMIND`                                             |                     |                        |
// | 6.08  | greatest time machine        | pull back: the house is tiny; above it a giant hand of light holds a giant      | pull back · sand    | the hourglass          |
// |       |                              | hourglass; on "don't have time" its sand runs low                                |                     |                        |
// | 6.09  | just us · free time?         | you walk in on the ground and look up at it; a short push; the lower bulb opens  | you · push · bulb   | INSIDE THE GLASS plate |
// |       |                              | to the frame: inside the glass (plateGlass, opaque from 236.2)                   |                     | (→ B2)                 |
import { Path2D } from '@napi-rs/canvas';
import * as B from './f13_b1_kit.mjs';
import { plateGlass, SEAM_HALF } from './f13_seams.mjs';
const { E, K } = B;
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, halo, prng, rad, lin } = E;
const LW = 3;

// 6.02 (screen, after the tilt)
const RING = { x: 960, y: 300, r: 190 };
const BLD = { x: 760, y: 560, w: 400, h: 700 };
const SKY2 = [[-60, 690, 230, 41], [170, 640, 190, 42], [370, 720, 170, 43], [550, 660, 190, 44], [1180, 640, 210, 45], [1400, 700, 180, 46], [1590, 650, 220, 47], [1820, 720, 200, 48]];
const WIN = { i: 6, j: 3 };
// 6.03–6.06 (screen): the desk
const DESK = { y: 720, x0: 240, x1: 1680 };
const WORKER = { x: 560, h: 380, foot: 920 };
const LAPTOP = { x: 760, w: 120, h: 80 };
const PILES = [[920, 0], [1060, 1], [920, 2], [1060, 3], [920, 4], [1060, 5]];          // [x, slot] of the first six cards
const CARD = { w: 120, h: 74 };
const VW = { x: 1290, y: 430, w: 300, h: 380 };          // the vessel / the window
const DAY = { y: 880, x9: 520, x17: 1180, x22: 1620 };
// 6.07–6.09: the house world (k 1 = screen when the window is the vessel)
const HOUSE = { x0: 1000, x1: 1660, eave: 160, ground: 900, peak: [1330, -150] };
const GLASS = { x: 1300, base: -330, h: 1700 };
const MOON = { x: 300, y: -40, r: 46 };

const cardPath = (ctx, x, y, w, h) => { ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 8); };
function card(ctx, x, y, t, o = {}) {
  const w = CARD.w * (o.s ?? 1), h = CARD.h * (o.s ?? 1), cool = o.cool ?? 0, a = o.a ?? 1;
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(o.rot ?? 0);
  cardPath(ctx, 0, 0, w, h); ctx.fillStyle = lin(ctx, -w / 2, 0, w / 2, 0, [[0, mixHex(P.night1, cool ? B.COOL : P.halo1, .25)], [1, mixHex(P.ind2, cool ? B.COOL : P.halo0, .35)]]); ctx.fill();
  ctx.strokeStyle = cool ? rgba(B.ICE, .95) : rgba(P.core1, .95); ctx.lineWidth = 2.4; ctx.stroke();
  ctx.strokeStyle = cool ? rgba(B.ICE, .55) : rgba(P.core1, .55); ctx.lineWidth = 3; ctx.lineCap = 'round';
  for (const [yy, ww] of [[-14, .6], [4, .7], [20, .4]]) { ctx.beginPath(); ctx.moveTo(-w / 2 + 16, yy * (o.s ?? 1)); ctx.lineTo(-w / 2 + 16 + (w - 32) * ww, yy * (o.s ?? 1)); ctx.stroke(); }
  ctx.restore();
}

export function makeNight(T, board, vessel) {
  const S8 = (w, n) => T.S('s08', w, n), S9 = (w, n) => T.S('s09', w, n);
  const a = {
    s08: T.seg('s08').start, far: S8('far'), remember: S8('Remember'), company: S8('company'), researchers: S8('researchers'), berkeley: S8('Berkeley'),
    artificial: S8('Artificial'), take: S8('did take'), tasks: S8('tasks'), off: S8('off'), plates: S8('plates'), people: S8('And people'), filled: S8('filled'),
    newones: S8('new ones'), even: S8('even work'), roles: S8('roles'), crept: S8('crept'), evenings: S8('evenings'), some: S8('Some people'),
    assistants: S8('assistants'), running: S8('running'), juggler: S8('juggler'), onemore: S8('one more'), ball: S8('ball'), linder: S8('Linder'),
    coming: S8('coming'), every: S8('every hour'), worth: S8('worth'), ever: S8('ever'),
    s09: T.seg('s09').start, top: S9('top'), demis: S9('Demis'), deepmind: S9('DeepMind'), dinner: S9('dinner'), family: S9('family'), second: S9('second workday'),
    night: S9('night'), mock: S9('mock'), human: S9('human'), building: S9('building'), machine: S9('machine'), either: S9('either'), so: S9('So maybe'),
    us: S9('us'), maybe2: S9('Maybe people'), free: S9('free time'), s10: T.seg('s10').start,
  };
  const T0 = a.s10;
  // ---- 6.01: the stalled thread falls, a crack runs through the glass
  vessel.fx.fall = (t) => expoIn(span(t, a.far - .05, a.far + .75));
  const glassHook = board.hooks.glass;
  board.hooks.glass = (t, v) => { const o = glassHook(t, v); const c = expoOut(span(t, a.far - .25, a.far + .05)); if (c > 0) o.crack = c; return o; };
  // ---- 6.02: tilt up with the ring (a pan of the board's view; this layer comes in from below at the same rate)
  const tP0 = a.far + .75, tP1 = a.berkeley - .9, PAN = 1150;
  const v0 = board.view(tP0 - .001);
  board.addView(tP0, tP1, { vx: v0.vx, vy: v0.vy - PAN / v0.k, k: v0.k });   // (v0 is the end of the slow push; pure pan)
  const pan = (t) => sineIO(span(t, tP0, tP1));
  const off = (t) => PAN * (1 - pan(t));
  // the machine's ring: from round the glass up into the sky over the building
  const underHook = board.hooks.under;
  const ringAt = (t, v) => { const [nx, ny] = board.toS(v, board.GG.x, board.GG.base - board.GG.h * .52, t), r0 = 330 * v.k / .15, u = sineIO(span(t, tP0 - .4, tP1 + .2)); return [lerp(nx, RING.x, u), lerp(ny, RING.y, u), lerp(r0, RING.r, u)]; };
  board.hooks.under = (ctx, t, v) => { if (t < tP0 - .4) return underHook(ctx, t, v); };
  // ---- 6.03: the window opens to the frame
  const tI0 = a.artificial - .35, tI1 = a.intelligence = S8('intelligence') + .55;
  const iris = (t) => sineIO(span(t, tI0, tI1)) ** 1.3;
  // cards: the six that are there, four lifted away, four new, four cool, then crammed into the vessel
  const lift = (i) => [a.tasks - .25, a.off - .2, a.off + .1, a.plates - .25][i];
  const CARDS = (() => {
    const o = [];
    for (let i = 0; i < 6; i++) o.push({ x: PILES[i][0], slot: Math.floor(i / 2), side: i % 2, t0: -1, cool: 0, lift: i < 4 ? lift(i) : null });
    for (let i = 0; i < 4; i++) o.push({ x: 0, slot: 0, side: 0, t0: a.newones - .55 + i * .18, cool: 0 });
    for (let i = 0; i < 4; i++) o.push({ x: 0, slot: 0, side: 0, t0: a.even + .1 + i * .22, cool: 1 });
    // final pile slots: the two left + eight new ones → five per pile (higher than the six before)
    let n = [1, 1];
    for (let i = 6; i < o.length; i++) { const side = i % 2; o[i].side = side; o[i].slot = n[side]++; }
    o[4].slot = 0; o[5].slot = 0;
    return o;
  })();
  const pileXY = (c) => [920 + c.side * 140, DESK.y - CARD.h / 2 - 2 - c.slot * (CARD.h * .62)];
  const cramT = (i) => a.linder + .2 + i * .12;
  // the vessel of 6.06 (drawn by the thread), its fill
  const vPts = (() => { const x0 = VW.x - VW.w / 2, y0 = VW.y - VW.h / 2, x1 = VW.x + VW.w / 2, y1 = VW.y + VW.h / 2; return [[x0, y0], [x0, y1], [x1, y1], [x1, y0], [x0, y0]]; })();
  const deskZ = (t) => lerp(1.62, 1.9, sineIO(span(t, tI0 - 1, a.linder - 1.2))) * (1 - sineIO(span(t, a.linder - 1.2, a.linder + .9))) + sineIO(span(t, a.linder - 1.2, a.linder + .9));
  const vDraw = (t) => sineIO(span(t, a.linder - .5, a.linder + .4));
  const vFill = (t) => clamp(.3 * sineIO(span(t, a.coming - .6, a.coming + .6)) + .7 * sineIO(span(t, a.ever + .2, a.s09 + .6)));
  const vGlow = (t) => smooth(span(t, a.every - .3, a.ever + .4));
  // ---- 6.07: the night closes round the window
  const tN0 = a.ever + .5, tN1 = a.top - .2;
  const close = (t) => sineIO(span(t, tN0, tN1));
  // ---- the house camera (world = screen at the window); pull back for 6.07 (a little) and 6.08 (to the giant glass); 6.09 push
  const VIEWS = [
    [tN1, { vx: 960, vy: 540, k: 1 }],
    [a.demis + .6, { vx: 1170, vy: 430, k: .9 }],
    [a.dinner - .2, { vx: 1240, vy: 450, k: 1.25 }],
    [a.mock - .2, { vx: 1270, vy: 470, k: 1.5 }],
    [a.building + .6, { vx: 1150, vy: -820, k: .27 }],
    [a.us - .4, { vx: 1200, vy: -780, k: .31 }],
  ];
  const tPush0 = a.maybe2 - .2, tPush1 = T0 - .25;
  const BULB = [GLASS.x, GLASS.base - GLASS.h * .26];
  function hview(t) {
    let v = { ...VIEWS[0][1] };
    for (let i = 1; i < VIEWS.length; i++) {
      const [t1, V] = VIEWS[i], t0 = VIEWS[i - 1][0], u = sineIO(span(t, t0, t1)); if (u <= 0) break;
      const kk = Math.exp(lerp(Math.log(v.k), Math.log(V.k), u)), g = Math.abs(v.k - V.k) < 1e-9 ? u : (v.k / kk - 1) / (v.k / V.k - 1);
      v = { vx: lerp(v.vx, V.vx, g), vy: lerp(v.vy, V.vy, g), k: kk };
    }
    // the short push toward the lower bulb: a zoom about the bulb's centre (it keeps its place on screen)
    const u = sineIO(span(t, tPush0, tPush1));
    if (u > 0) { const kk = v.k * Math.exp(Math.log(1.5) * u), f = v.k / kk; v = { vx: BULB[0] - (BULB[0] - v.vx) * f, vy: BULB[1] - (BULB[1] - v.vy) * f, k: kk }; }
    return v;
  }
  const happly = (ctx, v, t) => { const dz = smooth(span(t, tN1, tN1 + 2.5)), z = 1 + .008 * Math.sin(t * .31) * dz; ctx.translate(960 + 4 * E.drift(t, 1, 24) * dz, 540 + 3 * E.drift(t, 1, 28) * dz); ctx.scale(v.k * z, v.k * z); ctx.translate(-v.vx, -v.vy); };

  // ================================================================= drawing
  function office(ctx, t, dy) {
    // 6.02: the skyline and the building rise with the tilt; windows light on "researchers" and "Berkeley"
    ctx.save(); ctx.translate(0, dy);
    for (const [x, y, w, sd] of SKY2) B.building(ctx, x, y, w, 1500 - y, t, { seed: sd, lit: .22, warm: .2, cols: Math.max(2, Math.round(w / 40)), rows: 24 });
    const b = B.building(ctx, BLD.x, BLD.y, BLD.w, BLD.h, t, { seed: 9, lit: B.keyed(t, [[a.researchers - .3, .2], [a.berkeley + .4, .8]]), warm: .15, cols: 12, rows: 18 });
    const [wx, wy, ww, wh] = b.win(WIN.i, WIN.j), wl = smooth(span(t, a.berkeley - .2, a.berkeley + .3));
    ctx.fillStyle = mixHex(P.night1, P.halo0, wl); ctx.fillRect(wx - ww / 2, wy - wh / 2, ww, wh);
    if (wl > 0) halo(ctx, wx, wy, 50, .55 * wl, P.halo1, P.core1);
    ctx.restore();
    return [wx, wy + dy, ww, wh];
  }
  function desk(ctx, t) {
    // the room: a dark wall (the same night as the kitchen)
    ctx.fillStyle = lin(ctx, 0, 0, W, 0, [[0, P.night0], [.5, P.night1], [1, P.night0]]); ctx.fillRect(0, 0, W, H);
    // the desk is seen close (lead note: the motif owns the frame) and the view pulls back for the vessel (6.06)
    const Z = deskZ(t), m = (x, y) => [900 + (x - 900) * Z, 720 + (y - 720) * Z];
    ctx.save(); ctx.translate(900, 720); ctx.scale(Z, Z); ctx.translate(-900, -720);
    const fl = Math.sin(t * 2.3) * .6 + Math.sin(t * 5.1 + 1) * .4;   // the screen's light flickers (life in the holds)
    halo(ctx, LAPTOP.x, DESK.y - 60, 420, .35 + .09 * fl, B.SCREEN, P.cream);
    // the worker behind the desk (legs hidden by its front), arms on the keys; later juggling
    const jug = smooth(span(t, a.assistants - .2, a.assistants + .4)) * (1 - smooth(span(t, a.linder - .3, a.linder + .4)));
    const ph = (t - a.assistants) * (5 + 2.5 * smooth(span(t, a.onemore, a.ball + .3)));
    const type = Math.sin(t * 13) * .05 * (1 - jug);
    const armR = [lerp(1.25 + type, 1.9 + .35 * Math.sin(ph), jug), lerp(1.75, 2.6 + .4 * Math.sin(ph + .6), jug)];
    const armL = [lerp(-1.2 - type, 1.9 + .35 * Math.sin(ph + Math.PI), jug), lerp(-1.6, 2.6 + .4 * Math.sin(ph + Math.PI + .6), jug)];
    const look = lerp(.05 + .05 * Math.sin(t * .7), .6, jug);
    E.person(ctx, WORKER.x, WORKER.foot, WORKER.h, { dir: 1, armR, armL, look, rim: mixHex(P.blue2, P.cream, .35) });
    // the desk: its front hides the legs, its top edge is a gold line
    ctx.fillStyle = lin(ctx, 0, DESK.y, 0, H, [[0, P.ind1], [.3, P.night1], [1, P.night0]]); ctx.fillRect(DESK.x0, DESK.y, DESK.x1 - DESK.x0, H);
    const dl = 1 - sineIO(span(t, a.linder - .7, a.linder - .1)) * 0;
    K.trailSpan(ctx, [[DESK.x0, DESK.y], [DESK.x1, DESK.y]], 0, dl, { w: 2.2, spark: false });
    // the laptop (cool light)
    ctx.save(); ctx.fillStyle = P.night1; ctx.beginPath(); ctx.moveTo(LAPTOP.x - 10, DESK.y - 2); ctx.lineTo(LAPTOP.x + LAPTOP.w * .5, DESK.y - LAPTOP.h); ctx.lineTo(LAPTOP.x + LAPTOP.w * .5 + 10, DESK.y - LAPTOP.h + 6); ctx.lineTo(LAPTOP.x + 8, DESK.y - 2); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(B.ICE, .9); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(LAPTOP.x - 8, DESK.y - 4); ctx.lineTo(LAPTOP.x + LAPTOP.w * .5 - 2, DESK.y - LAPTOP.h + 4); ctx.stroke(); ctx.restore();
    halo(ctx, LAPTOP.x + 20, DESK.y - 40, 90, .5 + .15 * fl, B.SCREEN, P.cream);
    ctx.restore();
    // the cards
    for (let i = 0; i < CARDS.length; i++) {
      const c = CARDS[i]; if (c.t0 > 0 && t < c.t0) continue;
      let [x, y] = pileXY(c), al = 1, rot = 0, s = 1;
      if (c.t0 > 0) { const u = span(t, c.t0, c.t0 + .7); y = lerp(-100, y, 1 - (1 - u) ** 2); rot = (1 - u) * (i % 2 ? .3 : -.3); if (u >= 1) y -= 4 * Math.exp(-(t - c.t0 - .7) * 9) * Math.sin((t - c.t0 - .7) * 30); }
      if (c.lift != null) { const u = sineIO(span(t, c.lift, c.lift + 1.2)); if (u >= 1) continue; x = lerp(x, x + 300 + i * 60, u); y = lerp(y, -160, u) - 0; rot = u * .4; if (u > 0) { const [hx, hy] = m(x, y); halo(ctx, hx, hy, 90 * Z, .5 * u, B.SCREEN, P.cream); } c.cool = u; }
      [x, y] = m(x, y); s = Z;
      const cu = sineIO(span(t, cramT(i), cramT(i) + .55));
      if (cu > 0) { const slot = i - 4; const tx = VW.x + ((slot % 2) - .5) * 120, ty = VW.y + VW.h / 2 - 50 - Math.floor(slot / 2) * 52; x = lerp(x, tx, cu); y = lerp(y, ty, cu) - 160 * Math.sin(cu * Math.PI); s = lerp(Z, .82, cu); rot = lerp(rot, (i % 3 - 1) * .08, cu); }
      card(ctx, x, y, t, { cool: c.cool || (c.t0 > a.even ? 1 : 0), rot, s, a: al });
    }
    // 6.04: the day bar 9 → 17 → 22
    const db = sineIO(span(t, a.crept - 1.0, a.crept - .2)) * (1 - sineIO(span(t, a.some - .1, a.some + .6)));
    if (db > 0) {
      const cp = span(t, a.crept - .6, a.evenings + .4), xe = lerp(DAY.x17, DAY.x22, sineIO(cp));
      const ga = .5 * db * Math.sin(Math.PI * Math.min(1, cp * 1.15));   // the creeping tip glows while it moves
      if (ga > .01) { ctx.save(); const g = ctx.createRadialGradient(xe, DAY.y, 0, xe, DAY.y, 150); g.addColorStop(0, rgba(P.halo2, ga)); g.addColorStop(1, rgba(P.halo2, 0)); ctx.fillStyle = g; ctx.fillRect(xe - 150, DAY.y - 150, 300, 300); ctx.restore(); }
      K.trailSpan(ctx, [[DAY.x9, DAY.y], [xe, DAY.y]], 0, db, { w: 5, spark: db < 1 });
      ctx.save(); ctx.strokeStyle = rgba(P.halo2, .5); ctx.lineWidth = 2; for (const x of [DAY.x9, DAY.x17]) { ctx.beginPath(); ctx.moveTo(x, DAY.y - 14); ctx.lineTo(x, DAY.y + 14); ctx.stroke(); } ctx.restore();
    }
    B.line(ctx, '9', DAY.x9, DAY.y - 36, B.inOut(t, a.crept - .9, a.some - .3), { size: 110, serif: true, align: 'center' });
    B.line(ctx, '17', DAY.x17, DAY.y - 36, B.inOut(t, a.crept - .75, a.some - .3), { size: 110, serif: true, align: 'center' });
    B.line(ctx, '22', DAY.x22, DAY.y - 36, B.inOut(t, a.evenings - .2, a.some - .25), { size: 110, serif: true, align: 'center' });
    // 6.05: the rings (AI assistants) rise from the laptop and are juggled
    for (let k = 0; k < 4; k++) {
      const t0 = k < 3 ? a.assistants - .1 + k * .3 : a.onemore + .05; if (t < t0) continue;
      const up = sineIO(span(t, t0, t0 + .7)), n = t > a.onemore ? 4 : 3, sp = 1.4 + .7 * smooth(span(t, a.onemore, a.ball + .3));
      const th = (t - a.assistants) * sp * Math.PI + k / n * Math.PI * 2;
      const hd = m(WORKER.x + 30, WORKER.foot - WORKER.h * .95), jx = hd[0] + 40 + Math.cos(th) * 190, jy = hd[1] - 170 - Math.abs(Math.sin(th)) * 130 + (Math.cos(th) > 0 ? 0 : 70);
      const lp = m(LAPTOP.x + 30, DESK.y - 60);
      const into = sineIO(span(t, a.linder - .2 + k * .15, a.linder + .6 + k * .15));
      const x = lerp(lerp(lp[0], jx, up), VW.x, into), y = lerp(lerp(lp[1], jy, up), VW.y - VW.h / 2 - 60, into);
      if (into < 1) B.ring(ctx, x, y, 42 * (1 - .6 * into), t, { w: 6, pulse: 0, a: 1 - into });
    }
    // 6.06: the vessel drawn by the thread; the hour fills and glows; the line of value
    const vd = vDraw(t);
    if (vd > 0) {
      const f = vFill(t), g = vGlow(t);
      if (f > .005) { const hgt = (VW.h - 24) * f; B.goldBar(ctx, VW.x - VW.w / 2 + 12, VW.y + VW.h / 2 - 12 - hgt, VW.w - 24, hgt, t, { r: 18, glow: .5 + g }); }
      if (g > 0) halo(ctx, VW.x, VW.y, 420, (.4 + .1 * Math.sin(t * 3.1)) * g, P.halo1, P.halo0);
      K.trailSpan(ctx, vPts, 0, vd, { w: LW, spark: vd < 1 });
      const vl = sineIO(span(t, a.worth - .3, a.ever + .3));
      if (vl > 0) { const pts = Array.from({ length: 40 }, (_, i) => { const u = i / 39; return [lerp(1520, 1800, u), lerp(800, 120, u ** 2.4)]; }); K.trailSpan(ctx, pts, 0, vl, { w: LW, spark: true }); }
    }
  }
  // ---- 6.07–6.09: the house, the night, the giant hand and glass, you
  function house(ctx, t, v) {
    ctx.save(); happly(ctx, v, t);
    // moon (it sinks deeper into the night)
    const mx = MOON.x - 260 * sineIO(span(t, a.second, a.night + 2)), my = MOON.y + 120 * sineIO(span(t, a.second, a.night + 2));
    halo(ctx, mx, my, MOON.r * 5, .35, P.ind1, P.cream); ctx.fillStyle = rad(ctx, mx - 10, my - 12, MOON.r * 1.2, [[0, P.cream], [1, mixHex(P.cream, P.blue1, .4)]]); ctx.beginPath(); ctx.arc(mx, my, MOON.r, 0, 6.29); ctx.fill();
    // 6.08: the giant glass, held from above by the hand of light
    const gs = GLASS, top = .55 - .38 * sineIO(span(t, a.either - .6, a.either + 1.4));
    const g = K.hourglass(ctx, gs.x, gs.base, gs.h, t, { top, bot: .35, flow: 1, glow: .9 });
    const HO = { pose: 'open', spread: .25, curl: .25 }, ANG = .28, HL = 1050, tipL = E.handTip(HO, 1);
    const m0 = E.handMatrix(0, 0, ANG, HL, 1), tl = E.applyM(m0, ...tipL), tg = [gs.x + 50, gs.base - gs.h * .97 - 46];
    E.lightHand(ctx, E.handMatrix(tg[0] - tl[0], tg[1] - tl[1], ANG, HL * (1 + .012 * Math.sin(t * 1.1)), 1), t, { ...HO, lum: .7, dust: 5000 });
    // the ground line, the house
    K.trailSpan(ctx, [[-3200, HOUSE.ground], [5200, HOUSE.ground]], 0, 1, { w: 2.2 / Math.max(.4, v.k), spark: false });
    ctx.fillStyle = lin(ctx, 0, HOUSE.ground, 0, HOUSE.ground + 900, [[0, P.ind1], [.3, P.night1], [1, P.night0]]); ctx.fillRect(-3200, HOUSE.ground + 1, 8400, 3000);
    ctx.restore();
    return g;
  }
  // the facade with the window cut out (the night closes round the vessel); in world coords of the house camera
  function facade(ctx, t, v, e) {
    ctx.save(); happly(ctx, v, t);
    const x0 = VW.x - VW.w / 2, y0 = VW.y - VW.h / 2;
    ctx.beginPath(); ctx.rect(x0 - e, y0 - e, VW.w + 2 * e, VW.h + 2 * e); ctx.clip();
    const fp = new Path2D(); fp.moveTo(HOUSE.x0 - 30, HOUSE.eave); fp.lineTo(HOUSE.peak[0], HOUSE.peak[1]); fp.lineTo(HOUSE.x1 + 30, HOUSE.eave); fp.lineTo(HOUSE.x1, HOUSE.eave); fp.lineTo(HOUSE.x1, HOUSE.ground); fp.lineTo(HOUSE.x0, HOUSE.ground); fp.lineTo(HOUSE.x0, HOUSE.eave); fp.closePath();
    const wp = new Path2D(); wp.rect(x0, y0, VW.w, VW.h);
    ctx.save(); ctx.beginPath(); ctx.rect(-6000, -6000, 14000, 14000); ctx.rect(x0, y0, VW.w, VW.h); ctx.clip('evenodd');
    // outside the house: the night itself (sky drawn by the caller); the house body and roof
    ctx.fillStyle = lin(ctx, HOUSE.x0, 0, HOUSE.x1, 0, [[0, P.night1], [.6, P.ind2], [1, mixHex(P.ind2, P.blue1, .35)]]); ctx.fill(fp);
    ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 3; ctx.stroke(fp);
    ctx.restore();
    ctx.restore();
  }
  function room(ctx, t) {
    // inside the window (screen = house world at the window): warm dinner, then the cool laptop late at night
    const cool = smooth(span(t, a.second - .3, a.second + .9)), x0 = VW.x - VW.w / 2, y0 = VW.y - VW.h / 2;
    ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, VW.w, VW.h); ctx.clip();
    ctx.fillStyle = lin(ctx, 0, y0, 0, y0 + VW.h, [[0, mixHex(P.halo1, B.SCREEN, cool * .8)], [1, mixHex(P.halo0, mixHex(B.SCREEN, P.blue1, .4), cool)]]);
    ctx.globalAlpha = smooth(span(t, tN1, a.dinner - .4)) * (1 - .55 * cool) * .85; ctx.fillRect(x0, y0, VW.w, VW.h); ctx.globalAlpha = 1;
    { const lw = smooth(span(t, tN1, a.dinner - .4)) * (1 - cool); if (lw > 0) halo(ctx, VW.x, y0 + 70, 230, (.35 + .08 * Math.sin(t * 3.7) + .05 * Math.sin(t * 8.1)) * lw, P.halo0, P.core0); }   // the lamp over the table
    // the family at dinner (silhouettes rise from the sill), then all but one go
    const fam = sineIO(span(t, a.dinner - .6, a.dinner + .3)), gone = sineIO(span(t, a.second - .6, a.second + .4));
    const base = y0 + VW.h + 70;
    for (const [dx, h, k] of [[-90, 250, 0], [0, 215, 1], [92, 235, 2]]) {
      const show = k === 1 ? fam : fam * (1 - gone); if (show <= 0) continue;
      ctx.save(); ctx.translate(0, (1 - show) * 200); E.person(ctx, VW.x + dx, base, h, { dir: dx < 0 ? 1 : dx > 0 ? -1 : 1, view: 'side', look: Math.sin(t * .8 + k) * .1, rim: mixHex(P.halo0, P.cream, .3) }); ctx.restore();
    }
    // the table edge and, later, the laptop's light on the one who stays
    ctx.fillStyle = P.night1; ctx.fillRect(x0, base - 130 + (1 - fam) * 220, VW.w, 140);
    if (cool > 0) { halo(ctx, VW.x + 40, base - 160, 220, (.6 + .15 * Math.sin(t * 2.7) + .1 * Math.sin(t * 6.3)) * cool, B.SCREEN, P.cream); ctx.fillStyle = rgba(mixHex(B.SCREEN, P.cream, .4), cool); ctx.fillRect(VW.x + 22, base - 178, 44, 48); }
    ctx.restore();
  }
  function du(ctx, t, v) {
    // 6.09: you walk in on the ground from the right and look up at the glass
    const tw0 = a.so - .4, x = lerp(3100, 2150, sineIO(span(t, tw0, a.maybe2 - .2))); if (t < tw0) return;
    ctx.save(); happly(ctx, v, t);
    const walking = t < a.maybe2 - .25, h = 340 / .31 * .62;   // ~ 210 px at k .31
    E.castShadow(ctx, x, HOUSE.ground + 2, 24 * h / 340, 200 * h / 340, Math.PI + .3, .4);
    E.du(ctx, x, HOUSE.ground, h, { dir: -1, light: -1, walk: walking ? x / (h * .9) * Math.PI * 2 : undefined, look: lerp(.2, 1, sineIO(span(t, a.maybe2 - .4, a.maybe2 + .8))) });
    ctx.restore();
  }

  function draw(ctx, t) {
    // ---- up to the end of the tilt: the board (glass, you, the ring) and the office coming in from below
    if (t < tI0) {
      const v = board.view(t);
      if (t < tP1 + .05) vessel.draw(ctx, t); else B.sky(ctx, null, t);
      const dy = off(t);
      const [wx, wy, ww, wh] = office(ctx, t, dy);
      const [rx, ry, rr] = ringAt(t, v);
      if (t > tP0 - .4) B.ring(ctx, rx, ry, rr, t, { u: 1, a: 1, pulse: 1 });
      B.caption(ctx, t, 1230, 300, { label: 'UC BERKELEY', src: 'HARVARD BUSINESS REVIEW · 2026', a: a.berkeley - .6, b: a.take - .3 });
      return;
    }
    // ---- 6.03: the lit window opens to the frame (a rectangle that grows from the window), inside the desk
    if (t < tI1 + .05) {
      B.sky(ctx, null, t);
      const [wx, wy, ww, wh] = office(ctx, t, 0);
      ring(ctx, t);
      B.caption(ctx, t, 1230, 300, { label: 'UC BERKELEY', src: 'HARVARD BUSINESS REVIEW · 2026', a: a.berkeley - .6, b: a.take - .3 });
      const u = iris(t), x0 = lerp(wx - ww / 2, -40, u), x1 = lerp(wx + ww / 2, W + 40, u), y0 = lerp(wy - wh / 2, -40, u), y1 = lerp(wy + wh / 2, H + 40, u);
      ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip(); desk(ctx, t); ctx.restore();
      K.trailSpan(ctx, [[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]], 0, 1, { w: 3, a: 1 - u, spark: false });
      return;
    }
    // ---- 6.03–6.06: the desk; 6.07: the night closes round the vessel
    const c = close(t);
    if (c <= 0) { desk(ctx, t); return; }
    const v = hview(t);
    if (c < 1) { desk(ctx, t); }
    // the night outside the window: drawn inside the closing frame
    const e = lerp(1500, 0, c);
    ctx.save();
    if (c < 1) { ctx.beginPath(); ctx.rect(-6000, -6000, 14000, 14000); const x0 = VW.x - VW.w / 2 - e, y0 = VW.y - VW.h / 2 - e; ctx.rect(x0, y0, VW.w + 2 * e, VW.h + 2 * e); ctx.clip('evenodd'); }
    B.sky(ctx, null, t);
    const g = house(ctx, t, v);
    facadeFull(ctx, t, v);
    ctx.restore();
    // inside the window: the vessel's light (until the night has closed), then the room
    ctx.save(); happly(ctx, v, t);
    if (c >= 1) { roomWin(ctx, t); }
    ctx.restore();
    du(ctx, t, v);
    B.caption(ctx, t, 150, 330, { label: 'DEMIS HASSABIS', src: 'GOOGLE DEEPMIND', a: a.demis - .3, b: a.mock - .4 });
    // ---- 6.09: the lower bulb opens to the frame; inside it the seam plate (opaque from T0 − SEAM_HALF)
    const ob = sineIO(span(t, T0 - 2.2, T0 - SEAM_HALF - .2));
    if (ob > 0) {
      const [bx, by] = [960 + (BULB[0] - v.vx) * v.k, 540 + (BULB[1] - v.vy) * v.k];
      ctx.save(); ctx.translate(bx, by); ctx.scale(1 + 8 * ob ** 2.5, 1 + 8 * ob ** 2.5); ctx.translate(-bx, -by);
      happly(ctx, v, t); ctx.clip(g.glassPath); ctx.beginPath(); ctx.rect(-9000, GLASS.base - GLASS.h * .5, 20000, 9000); ctx.clip();
      plateGlass(ctx, t); ctx.restore();
    }
    if (t >= T0 - SEAM_HALF) plateGlass(ctx, t);
  }
  function ring(ctx, t) { B.ring(ctx, RING.x, RING.y, RING.r, t, { u: 1, a: 1, pulse: 1 }); }
  function facadeFull(ctx, t, v) {
    ctx.save(); happly(ctx, v, t);
    const x0 = VW.x - VW.w / 2, y0 = VW.y - VW.h / 2;
    const fp = new Path2D(); fp.moveTo(HOUSE.x0 - 40, HOUSE.eave); fp.lineTo(HOUSE.peak[0], HOUSE.peak[1]); fp.lineTo(HOUSE.x1 + 40, HOUSE.eave); fp.lineTo(HOUSE.x1, HOUSE.eave); fp.lineTo(HOUSE.x1, HOUSE.ground); fp.lineTo(HOUSE.x0, HOUSE.ground); fp.lineTo(HOUSE.x0, HOUSE.eave); fp.closePath();
    ctx.beginPath(); ctx.rect(-9000, -9000, 20000, 20000); ctx.rect(x0, y0, VW.w, VW.h); ctx.clip('evenodd');
    ctx.fillStyle = lin(ctx, HOUSE.x0, 0, HOUSE.x1, 0, [[0, P.night1], [.6, P.ind2], [1, mixHex(P.ind2, P.blue1, .35)]]); ctx.fill(fp);
    ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 3 / Math.max(.3, v.k); ctx.stroke(fp);
    ctx.restore();
  }
  function roomWin(ctx, t) {
    // the full vessel of light is the lit window: the same gold, then the room appears in it
    // (at the switch the night covers everything outside the window rect: so first only what is inside it, then the frame's glow)
    ctx.save(); ctx.beginPath(); ctx.rect(VW.x - VW.w / 2, VW.y - VW.h / 2, VW.w, VW.h); ctx.clip();
    B.goldBar(ctx, VW.x - VW.w / 2 + 12, VW.y - VW.h / 2 + 12, VW.w - 24, VW.h - 24, t, { r: 18, glow: 1.5 });
    halo(ctx, VW.x, VW.y, 420, .4, P.halo1, P.halo0);
    room(ctx, t);
    K.trailSpan(ctx, vPts, 0, 1, { w: LW, spark: false });
    ctx.restore();
    const fg = smooth(span(t, tN1, tN1 + 1.2));
    if (fg > 0) { ctx.save(); ctx.beginPath(); ctx.rect(-9000, -9000, 20000, 20000); ctx.rect(VW.x - VW.w / 2, VW.y - VW.h / 2, VW.w, VW.h); ctx.clip('evenodd'); K.trailSpan(ctx, vPts, 0, 1, { w: LW, a: fg, spark: false }); ctx.restore(); }
  }
  return { draw, a };
}
