// Film 70 · THE LEITBILD: THE CHAIN OVER THE NIGHT (used ONLY at the 4 anchors: hook H.01–H.02, turn 2.17–2.22, point 6.17–6.19, end
// 9.20–E.01; Jakob 24.11.: no one-world film, no camera ride through a world) + the seam plates (on THE TRUST BOARD) + the end screen
// (owned by the lead; builders import, never edit — wishes go in the report).
//
// THE PICTURE (echoes thumbnail C and A without being either): night. You (yellow coat, small) stand on a dark hill at the left and hold
// one end of a gold chain. It hangs in a long arc over the lit city to a pale machine sphere high on the right (COOL, a slow grid of
// light: the systems that decide about your life). The chain is the one hero light (GOLD). LAMP windows in the city = people.
// Flat planes at depth (E.cam / E.plane of f10_editorial: d 0 = infinitely far, 1 = the hill): sky .02 · stars .05 · sphere .25 ·
// far city .35 · near city .6 · hill + you 1. The chain is drawn in screen space from your hand (d 1) to the sphere (d .25), its links
// shrink with depth, so any camera (push into your hand, crane, pull back) gives true parallax.
//
// chainWorld(ctx, t, C, st)   C = E.cam(z, px, py, fx, fy) (homeCam() = the full picture). st (all optional):
//   four 0..1      the four named links swell in the arc (2.17) · names [u0..u3] their names under them (MONEY · CONTRACT · LAW · TRUTH)
//   links [{ lit, crack, mend, hair }]   state of the four named links (F.chainState(T, t).links is the honest state)
//   taut 0..1      the chain pulls taut (less sag, 2.22) · sway px (default 6) · u 0..1 the chain drawn from your hand outward
//   warm 0..1      the end: the whole chain warm, the sphere answers with one warm light (answer 0..1)
//   you { h, o (du options) } | false · city 0..1 (lit windows) · sky(ctx) on the star plane · fg(ctx) on the hill plane after you
// Returns { hand: [x, y] (screen), sphere: [x, y, r] (screen), named: [[x, y, L], …] (screen, the four named links), first: [x, y, ang, L]
// (the link in your hand, screen) }.
import * as E from './f10_editorial.mjs';
import * as F from './f70_kit.mjs';
import * as X from './f70_explain.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, halo, lin, rad, prng } = E;
const { GOLD, COOL, LAMP, PAPER, CREAM } = F;
const TAU = Math.PI * 2;

// ------------------------------------------------------------------------------------------------ seams
export const SEAM_HALF = .5;
export const CREEP = .04;
export const creep = (t, T, phrase, nth = 0) => 1 + CREEP * Math.max(0, t - (T.G(phrase, nth) - SEAM_HALF));

// ------------------------------------------------------------------------------------------------ geometry (home camera = design px)
export const SPHERE = { x: 1490, y: 318, r: 214, d: .25 };
export const YOU = { x: 318, y: 846, h: 178 };
export const NAMED_F = [.2, .4, .6, .8];
export const homeCam = () => E.cam(1);
const D_SKY = .02, D_STAR = .05, D_FAR = .35, D_NEAR = .6;
const SKY = (() => { const r = prng(70); const far = [], near = [];
  for (let x = -700; x < 2700;) { const w = 40 + r() * 90, h = 50 + r() * 170; far.push([x, w, h, r()]); x += w + 4 + r() * 18; }
  for (let x = -900; x < 3000;) { const w = 70 + r() * 150, h = 90 + r() * 260; near.push([x, w, h, r()]); x += w + 10 + r() * 40; }
  return { far, near }; })();

function sphere(ctx, t, st) {
  const { x, y, r } = SPHERE, ans = clamp(st.answer ?? 0);
  halo(ctx, x, y, r * 2.4, .28, COOL.halo, COOL.core);
  ctx.fillStyle = rad(ctx, x - r * .25, y - r * .3, r * 1.1, [[0, mixHex(COOL.deep, COOL.body, .35)], [.7, mixHex(P.ind1, COOL.deep, .6)], [1, mixHex(P.night1, P.ind1, .6)]]);
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip();
  ctx.strokeStyle = rgba(COOL.line, .38); ctx.lineWidth = 1.6;
  for (let k = -3; k <= 3; k++) { const yy = y + k * r * .27, rx = Math.sqrt(Math.max(0, 1 - (k * .27) ** 2)) * r; ctx.beginPath(); ctx.ellipse(x, yy, rx, rx * .16, 0, 0, TAU); ctx.stroke(); }
  const ph = t * .022;   // slow: the globe turns, it does not spin (calm.py)
  for (let k = 0; k < 8; k++) { const a = ((k / 8 + ph) % 1) * Math.PI, rx = Math.abs(Math.cos(a)) * r; ctx.beginPath(); ctx.ellipse(x, y, Math.max(.5, rx), r, 0, 0, TAU); ctx.stroke(); }
  ctx.restore();
  ctx.strokeStyle = rgba(COOL.core, .55); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  for (let k = 0; k < 3; k++) { ctx.strokeStyle = rgba(COOL.core, .2 + .15 * k); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r * (.42 - k * .12) * (1 + .03 * Math.sin(t * .7 - k)), 0, TAU); ctx.stroke(); }
  if (ans > 0) { halo(ctx, x, y, r * 1.5 * ans, .8 * ans, LAMP.body, LAMP.core); ctx.fillStyle = rgba(LAMP.core, ans); ctx.beginPath(); ctx.arc(x, y, r * .1 * ans, 0, TAU); ctx.fill(); }
}
function city(ctx, t, rows, base, colB, lit, seed, k) {
  for (const [x, w, h, q] of rows) {
    ctx.fillStyle = colB; ctx.fillRect(x, base - h, w, h + 600);
    if (q > .55) ctx.fillRect(x + w * .3, base - h - 26 * k, w * .4, 26 * k);
    const cols = Math.max(1, Math.floor(w / (18 * k))), rws = Math.floor(h / (26 * k));
    for (let i = 0; i < cols; i++) for (let j = 0; j < rws; j++) {
      const s = Math.sin((x + i * 13.7) * 12.9898 + j * 78.233 + seed) * 43758.5453, v = s - Math.floor(s); if (v > lit * .32) continue;
      const fl = .75 + .25 * Math.sin(t * (.3 + v * .6) + v * 40);
      ctx.fillStyle = rgba(LAMP.body, .75 * fl); ctx.fillRect(x + 6 * k + i * 18 * k, base - h + 10 * k + j * 26 * k, 7 * k, 10 * k);
    }
  }
}
function hill(ctx) {
  ctx.fillStyle = mixHex(P.night0, P.ind1, .22);
  ctx.beginPath(); ctx.moveTo(-600, 1400); ctx.lineTo(-600, 900); ctx.bezierCurveTo(-200, 870, 120, 842, YOU.x, 840); ctx.bezierCurveTo(560, 838, 860, 930, 1260, 1010); ctx.lineTo(1500, 1400); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(mixHex(GOLD.line, P.blue1, .55), .45); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-600, 900); ctx.bezierCurveTo(-200, 870, 120, 842, YOU.x, 840); ctx.bezierCurveTo(560, 838, 860, 930, 1260, 1010); ctx.stroke();
}
export function chainWorld(ctx, t, C, st = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.55, mixHex(P.night1, P.ind0, .5)], [1, mixHex(P.ind1, P.blue0, .3)]]); ctx.fillRect(0, 0, W, H);
  ctx.restore();
  E.plane(ctx, C, D_STAR, () => { E.stars(ctx, 70, 220, t, [-600, -500, 3100, 1250], .75); if (st.sky) st.sky(ctx); });
  E.plane(ctx, C, SPHERE.d, () => sphere(ctx, t, st));
  const lit = st.city ?? .9;
  E.plane(ctx, C, D_FAR, (z) => { ctx.fillStyle = lin(ctx, 0, 420, 0, 900, [[0, rgba(P.ind1, 0)], [.7, rgba(mixHex(P.ind1, P.blue0, .4), .45)], [1, rgba(mixHex(P.ind1, P.blue0, .4), .3)]]); ctx.fillRect(-1400, 420, 4800, 900); city(ctx, t, SKY.far, 820, mixHex(P.night1, P.ind1, .55), lit, 1, .8); });
  E.plane(ctx, C, D_NEAR, () => city(ctx, t, SKY.near, 960, mixHex(P.night0, P.ind1, .35), lit * .8, 2, 1.1));
  // you on the hill (plane 1): the hand that holds the chain
  let hand = [YOU.x + 60, YOU.y - 150];
  E.plane(ctx, C, 1, () => {
    hill(ctx);
    if (st.you !== false) {
      const y = st.you ?? {}, hold = .06 * Math.sin(t * .8);
      const hs = E.du(ctx, YOU.x, YOU.y, y.h ?? YOU.h, { light: 1, back: .2, dir: 1, look: .55, armR: [2.08 + hold, 2.32 + hold], armL: [-.25, -.15], ...(y.o ?? {}) });
      if (hs?.R) hand = hs.R;
    }
  });
  const toS = (d, x, y) => E.toScreen(C, d, x, y);
  const hS = toS(1, hand[0], hand[1]), sp = toS(SPHERE.d, SPHERE.x, SPHERE.y), sR = SPHERE.r * sp[2];
  const end = [sp[0] - sR * .93, sp[1] + sR * .3], zN = Math.pow(C.z, 1), zF = Math.pow(C.z, SPHERE.d);
  const taut = clamp(st.taut ?? 0), four = sineIO(clamp(st.four ?? 0)), warm = clamp(st.warm ?? 0);
  const sag = (190 - 120 * taut) * Math.sqrt(zN * zF), pts = F.catenary(hS, end, sag, { sway: (st.sway ?? 6) * (1 - .7 * taut) * zN, ph: t * .7 });
  const Lat = (f) => lerp(54 * zN, 20 * zF, Math.pow(f, .8));
  const total = F.pathLen(pts), named = NAMED_F.map((f) => { const [x, y, ang] = F.pathAt(pts, f * total); return [x, y, ang, Lat(f) * (1 + 1.7 * four)]; });
  F.chain(ctx, t, pts, { Lat, u: st.u ?? 1, link: (i, f) => {
    const near = NAMED_F.some((g) => Math.abs(f - g) < .028);
    return { lit: .35 * warm + .15 * Math.sin(t * 1.1 + i * .7) * warm, a: near ? 1 - four : 1 };
  } });
  if (four > 0 || st.links) named.forEach(([x, y, ang, L], i) => {
    if ((st.u ?? 1) < NAMED_F[i]) return;
    const s = st.links?.[i] ?? {};
    F.chainLink(ctx, t, x, y, L, ang, { lit: Math.max(s.lit ?? 0, warm * .5), crack: s.crack, mend: s.mend, hair: s.hair, a: Math.max(four, st.links ? 1 : 0) });
    const nu = st.names?.[i] ?? 0;
    if (nu > 0) X.label(ctx, F.CHAIN.names[i], x, y + L * .62 + 34, nu, { size: 28, spacing: .16, gold: (s.lit ?? 0) * .8, col: CREAM });
  });
  if (warm > 0) halo(ctx, hS[0], hS[1], 120 * zN, .35 * warm, GOLD.halo, GOLD.core);
  if (st.fg) E.plane(ctx, C, 1, () => st.fg(ctx));
  const [fx0, fy0, fa0] = F.pathAt(pts, Lat(0) * .4);
  return { hand: hS, sphere: [sp[0], sp[1], sR], named: named.map(([x, y, , L]) => [x, y, L]), end, first: [fx0, fy0, fa0, Lat(0)] };
}

// ------------------------------------------------------------------------------------------------ the seam plates (on THE TRUST BOARD)
// A plate is the EXACT picture at a group boundary. The handing side steers its last move so its frame converges to the plate and draws
// the plate for t in [T0 − .5, T0); the receiving side draws the same plate for t in [T0, T0 + .5) and grows its next picture out of it.
// Plates keep a slow push (CREEP 4 %/s from T0 − .5); the receiving side continues it.
//   Lead → B1 at T.G('His word for it') (c01 → c02): plateDementia   one line of type COLLECTIVE DEMENTIA (serif, cream glow) at y 560 over
//            a thin cream rule (the folded clip frame, 900 px at y 610); the source line HARARI, ČT … rises with it. B1 (1.01) holds it,
//            1.02 slides it up.
//   B1 → B2  at T.G('Law. Rules written') (c05 → c06): plateLaw   the four links big in a row (y 470, L 230): MONEY and CONTRACT cracked,
//            LAW lit and pulsing, TRUTH plain; their names under them. B2 (5.02) pushes into LAW.
//   B2 → B3  at T.G('Three tests') (c08 → c09): plateAnvil   an anvil centred low (top at y 700), three empty ring moulds glowing on it;
//            the four cracked links small in a row above (y 240). B3 (8.02) fills mould 1.
export const DEMENTIA = { y: 560, size: 118, rule: { y: 616, w: 900 } };
export function plateDementia(ctx, t, T) {
  const T0 = T.G('His word for it'), k = creep(t, T, 'His word for it'), v = { x: W / 2, y: H / 2, s: k };
  X.board(ctx, t, v, { lx: W / 2, ly: DEMENTIA.y - 40 });
  X.inView(ctx, v, () => {
    X.lightLine(ctx, [[W / 2 - DEMENTIA.rule.w / 2, DEMENTIA.rule.y], [W / 2 + DEMENTIA.rule.w / 2, DEMENTIA.rule.y]], 1, { w: 3, a: .8 });
    X.big(ctx, F.SOURCES.dementia, W / 2, DEMENTIA.y, DEMENTIA.size, span(t, T0 - .5, T0 + .35), { gold: .35 });
  });
  F.source(ctx, t, T0 - .2, T0 + 6, F.SOURCES.dementiaSrc);
}
export const LAWROW = { y: 470, L: 230, gap: 330 };
export const lawRowX = (i) => W / 2 + (i - 1.5) * LAWROW.gap;
export function plateLaw(ctx, t, T) {
  const k = creep(t, T, 'Law. Rules written'), v = { x: W / 2, y: H / 2, s: k };
  X.board(ctx, t, v, { lx: lawRowX(2), ly: LAWROW.y });
  const s = F.chainState(T, t).links;
  X.inView(ctx, v, () => {
    for (let i = 0; i < 3; i++) F.chainLink(ctx, t, (lawRowX(i) + lawRowX(i + 1)) / 2, LAWROW.y, LAWROW.L * .55, 0, { edge: true });
    for (let i = 0; i < 4; i++) {
      F.chainLink(ctx, t, lawRowX(i), LAWROW.y, LAWROW.L, 0, { crack: i < 2 ? 1 : s[i].crack, lit: i === 2 ? .75 + .25 * Math.sin(t * 3) : 0 });
      X.label(ctx, F.CHAIN.names[i], lawRowX(i), LAWROW.y + LAWROW.L * .58 / 2 + 70, 1, { size: 30, spacing: .16, gold: i === 2 ? 1 : 0, col: i === 2 ? GOLD.text : CREAM });
    }
  });
}
export const ANVIL = { x: W / 2, top: 640, w: 780 };
export function anvil(ctx, t, x, top, w, o = {}) {
  const h = w * .42;
  ctx.fillStyle = mixHex(P.night1, P.blue1, .35);
  ctx.beginPath(); ctx.moveTo(x - w * .5, top); ctx.lineTo(x + w * .32, top); ctx.quadraticCurveTo(x + w * .56, top + h * .05, x + w * .62, top + h * .02); ctx.quadraticCurveTo(x + w * .5, top + h * .3, x + w * .3, top + h * .34);
  ctx.lineTo(x + w * .16, top + h * .62); ctx.lineTo(x + w * .3, top + h); ctx.lineTo(x - w * .3, top + h); ctx.lineTo(x - w * .16, top + h * .62); ctx.lineTo(x - w * .34, top + h * .34); ctx.lineTo(x - w * .5, top + h * .3); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(CREAM, .5); ctx.fillRect(x - w * .5, top - 1, w * .82, 3);
  // a slow glint wanders along the face (light, not motion: keeps every hold on the anvil alive)
  if (o.glint !== false) halo(ctx, x - w * .5 + w * .82 * (.5 + .45 * Math.sin(t * .8)), top + 1, 90, .4, LAMP.body, LAMP.core);
}
export const moldX = (i) => ANVIL.x + (i - 1) * 230 - 40;
// the moulds' breathing light (also used by c08's finale, so the plate continues it): a slow swell, so the held plate is never frozen
export const moldGlow = (t, i) => .2 + .09 * Math.sin(t * 2.4 + i * 2.1);
export function plateAnvil(ctx, t, T) {
  const k = creep(t, T, 'Three tests'), v = { x: W / 2, y: H / 2, s: k };
  X.board(ctx, t, v, { lx: ANVIL.x, ly: ANVIL.top - 80 });
  const s = F.chainState(T, t).links;
  X.inView(ctx, v, () => {
    anvil(ctx, t, ANVIL.x, ANVIL.top, ANVIL.w);
    for (let i = 0; i < 3; i++) { F.chainLink(ctx, t, moldX(i), ANVIL.top - 52, 170, 0, { mould: 1 }); halo(ctx, moldX(i), ANVIL.top - 52, 150, moldGlow(t, i), LAMP.body, LAMP.core); }
    for (let i = 0; i < 4; i++) { F.chainLink(ctx, t, W / 2 + (i - 1.5) * 120, 250, 90, 0, { crack: s[i].crack }); if (i < 3) F.chainLink(ctx, t, W / 2 + (i - 1) * 120, 250, 50, 0, { edge: true }); }
  });
}

// ------------------------------------------------------------------------------------------------ the end screen (last 15 s)
// The final picture: the chain warm over the night, you hold one end, the sphere answers with one warm light; a slow pull-back, the
// lower half calm for the two YouTube tiles + the subscribe circle. Nothing moves but light, the chain's sway and your breath.
export const END_TILES = { left: { x: 80, y: 600, w: 640, h: 360 }, right: { x: 1200, y: 600, w: 640, h: 360 }, sub: { x: 960, y: 900, r: 80 } };
export function endScreen(ctx, t, T) {
  const t0 = T.duration - 15, q = Math.max(0, t - t0), z = 1 - .004 * q;
  const s = F.chainState(T, t).links.map((l) => ({ ...l, lit: .4 }));
  chainWorld(ctx, t, E.cam(z, 960, 520, 960, 470), { warm: 1, answer: 1, links: s, four: .35, sway: 4 });
}
