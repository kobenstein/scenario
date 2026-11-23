// Film 49 · c02 · THE WEDDING (B1). One continuous take out of plateFoot ('Picture a wedding') to the foot of the stairs at
// 'Five years to go' (c03 continues the same camera: one camPath for the whole B1 group c02–c05, see group() below).
// This file also exports the B1 group helpers (camera, walks, pop-ups, local props) that sc03–sc05 import.
//
// | beat  | phrase (VO)                         | picture                                                                                    | camera / kind      |
// |-------|-------------------------------------|--------------------------------------------------------------------------------------------|--------------------|
// | K.01  | Picture a wedding                   | out of plateFoot: the string lights light right → left (nearest bulb first); you turn and  | glide left · SCENE |
// |       |                                     | walk down the carved stair to the table (the carrier)                                      |                    |
// | K.02  | A stranger at your table asks…      | the neighbour rises behind the table and turns to you; THE PLACE CARD unfolds on the cloth | glide · SCENE      |
// |       | You have the answer ready…          | you arrive at your seat; the card: a name you cannot read, a worn answer line              |                    |
// | K.03  | Now picture giving a different one  | close on the place card: the answer line fades and leaves a blank                          | push · MIX         |
// | K.04  | The historian Yuval Noah Harari …   | a paper card pinned to the light pole: YUVAL NOAH HARARI / HISTORIAN · AUTHOR OF “SAPIENS”; | truck · EXPL       |
// |       | … warnings like his sell books      | on 'sell books': 25 MILLION COPIES SOLD                                                    |                    |
// | K.05  | But hear him out: (C13)             | C13 grows out of the paper card (1.8 s) and goes back into it                              | creep · CLIP       |
// | K.06  | He calls it the end of lifetime …   | the card now carries “THE END OF LIFETIME CAREERS”; the place card's line fills and fades  | glide · EXPL       |
// |       |                                     | twice; source line                                                                         |                    |
// | K.07★ | And he expects the change … decades | pull back wide: behind the stairs the light path runs from the landing into the distance:  | pull back · MIX    |
// |       |                                     | DECADES                                                                                    |                    |
// | K.08  | So start the countdown / One step … | 5 4 3 2 1 rise on the risers; the countdown builds top left; you take the card and walk to | glide · MIX        |
// |       |                                     | the foot (the string lights go out behind you)                                             |                    |
// | K.09  | And the hardest question waits …    | rise to the landing in back light; the numbers sink, the steps dim to the night of the     | rise → descend     |
// |       |                                     | countdown; the camera comes down the stairs to the bottom step (carrier: the step edges)   | · MIX              |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f49_kit.mjs';
import * as S from '../lib/f49_world.mjs';
const { span, clamp, lerp, smooth, sineIO, expoOut, rgba, mixHex, halo, lin, P, W, H } = E;
const { GOLD, PAPER, COOL, LAMP } = F;
const TAU = Math.PI * 2;

// ================================================================================================================ B1 GROUP HELPERS
export const A = (u, v, s, sx = W / 2, sy = H / 2) => E.aim(S.Z_LAND, u, v, s, sx, sy);
export const SY0 = S.stageY(0), SY1 = S.stageY(1);
export const SIL = mixHex(P.night0, P.ind1, .22);
// progress 0..1 with constant acceleration at both ends and a constant speed between (a walk, a truck)
export function trav(t, t0, t1, ramp = .6) {
  if (t <= t0) return 0; if (t >= t1) return 1;
  const d = t1 - t0, r = Math.min(ramp, d / 2), v = 1 / (d - r), u = t - t0;
  if (u < r) return v * u * u / (2 * r);
  if (u < d - r) return v * (r / 2 + (u - r));
  return 1 - v * (d - u) * (d - u) / (2 * r);
}
// feet height at x on the ground / carved stair of block 0 / tread 0 / carved stair of block 1 / tread 1
export function floorY(x, level = 0) {
  if (level >= 1) { const c = S.STEPS[1].L - 84; if (x >= c + 110) return SY1; if (x <= c) return SY0; return S.climbPos(1, (x - c) / 110).y; }
  if (x >= 438) return SY0; if (x <= 328) return S.GY; return S.climbPos(0, (x - 328) / 110).y;
}
// a walk from x0 to x1 between t0 and t1: you (or a person) with the walk phase from the distance
export function walk(t, t0, t1, x0, x1, level = 0, ramp = .6) {
  const u = trav(t, t0, t1, ramp), x = lerp(x0, x1, u), moving = t > t0 && t < t1;
  const tot = Math.max(1, Math.round(Math.abs(x1 - x0) / 105)) * Math.PI;   // whole half-strides: the arms and the hem land at rest
  return { x, y: floorY(x, level), moving, dir: x1 >= x0 ? 1 : -1, ph: u * tot, u };
}
// the pop-up book: a set rises out of the tread (scale y from the floor line y)
export function pop(ctx, u, y, fn) { const k = expoOut(clamp(u)); if (k <= .002) return; ctx.save(); ctx.translate(0, y); ctx.scale(1, k); ctx.translate(0, -y); fn(); ctx.restore(); }
// up on [a, a+d], down on [b, b+d] (0..1, use with pop)
export const upDown = (t, a, b, d = .7) => span(t, a, a + d) * (1 - span(t, b, b + d));
// a person standing on a tread who rises out of it (and sinks back)
export function popPerson(ctx, t, u, x, y, h, o = {}) { pop(ctx, u, y, () => E.person(ctx, x, y, h, { light: 1, ...o })); }
// a free-standing door of light on a tread (thumbnail C): gold frame light, cream core, dark posts; o.inner(x, y, w, h) draws inside
export function lightDoor(ctx, t, x, y, w, h, u, o = {}) {
  pop(ctx, u, y, () => {
    const g = (o.glow ?? 1) * (.97 + .03 * Math.sin(t * .9 + x * .01));
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    halo(ctx, x, y - h * .55, h * .95, .2 * g, GOLD.halo, GOLD.core);
    ctx.fillStyle = E.rad(ctx, x, y, w * 1.6, [[0, rgba(GOLD.hot, .32 * g)], [1, rgba(GOLD.halo, 0)]]); ctx.beginPath(); ctx.ellipse(x, y + 2, w * 1.6, 12, 0, 0, TAU); ctx.fill();
    ctx.restore();
    ctx.fillStyle = lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, GOLD.body], [.16, GOLD.hot], [.5, '#fff1c2'], [.84, GOLD.hot], [1, GOLD.mid]]); ctx.fillRect(x - w / 2, y - h, w, h);
    if (o.inner) { ctx.save(); ctx.beginPath(); ctx.rect(x - w / 2, y - h, w, h); ctx.clip(); o.inner(x - w / 2, y - h, w, h); ctx.restore(); }
    const p = Math.max(5, w * .08);
    ctx.fillStyle = SIL; ctx.fillRect(x - w / 2 - p, y - h - p, p, h + p); ctx.fillRect(x + w / 2, y - h - p, p, h + p); ctx.fillRect(x - w / 2 - p, y - h - p, w + 2 * p, p);
    ctx.fillStyle = rgba(GOLD.core, .6 * g); ctx.fillRect(x - w / 2, y - 2, w, 2);
  });
}
// the place card drawn on the land card. o.hand = [x, y] (in the hand) · o.at = [x, y] (standing) · o.k (0 = at, 1 = in the hand)
export function cardAt(ctx, t, o) {
  const k = clamp(o.k ?? 0), p = o.hand && k > 0 ? [lerp(o.at[0], o.hand[0] + 4, k), lerp(o.at[1], o.hand[1] + 10, sineIO(k))] : o.at;
  const s = lerp(o.s ?? 44, 26, k);
  return F.placeCard(ctx, t, p[0], p[1], s, { answer: o.answer ?? 0, gold: o.gold ?? 0, glow: (o.glow ?? .4) * (1 - k), rot: lerp(0, -.12, k) + (o.rot ?? 0), u: o.u ?? 1, face: o.face });
}

// the B1 phrase anchors (all looked up after the start of c02, so repeats earlier in the film do not matter)
const MEMO = new WeakMap();
export function group(T) {
  if (MEMO.has(T)) return MEMO.get(T);
  const wed = T.G('Picture a wedding'), g = (p, d = 0) => T.G(p, 0, wed - .01) + d, ge = (p, d = 0) => T.GE(p, 0, wed - .01) + d;
  const a = {
    wed, stranger: g('A stranger at your table'), asks: ge('asks what you do'), ready: g('You have the answer ready'), given: g('You have given it for decades'),
    diff: g('Now picture giving'), age: g('At your age'), harari: g('The historian Yuval'), engineer: g('He is no engineer'), sell: g('sell books'),
    hear: g('But hear him out'), again: g('Again and again'), careers: g('He calls it the end'), decades: g('And he expects the change'),
    count: g('So start the countdown'), each: g('One step for each year'), hardest: g('And the hardest question'),
    // c03
    five: g('Five years to go'), first: g('The first step is you'), comes: g('It comes first'), pays: g('And it pays off'), reinvent: g('Reinvent yourself'),
    fifty: g('At fifty'), sounds: g('It sounds like a young'), data: g('The data disagrees'), among: g("Among America's"), notTwenty: g('Not twenty-five'),
    matters: g('But it matters who'), switch: g('People who switch'), laid: g('People laid off'), quarter: g('more than a quarter'), comparison: g('That is a comparison'),
    same: g('But the same change'), chosen: g('chosen or forced'), forced: g('forced'),
    // c04
    fresh: g('What the next generation always'), choose: g('So choose your own'), nothing: g('while nothing depends'), beginner: g('Become a beginner'),
    awkward: g('stay with the awkward'), role: g('At work, take on'), anyone: g('before anyone asks'), group: g('Join one group'), title: g('If the title goes'),
    resil: g('Resilience is partly'), bigChange: g('So when the big change'), half: g('But starting over'), minute: g('If a machine can do your task'), worth: g('what is your experience'),
    // c05
    four: g('Four years to go'), work: g('This step is your work'), evidence: g('And here, there is evidence'), oneAI: g('One A.I.'), experts: g('Experts succeeded'),
    same2: g('With the same tool'), level: g('In that study'), rewarded: g('It rewarded the people'), safe: g('Does that make you safe'), notQuite: g('Not quite'),
    watched: g('The study watched'), late: g('And when people in their late'), weeks: g('thirty-four weeks'), edge: g('So experience is an edge'), guarantee: g('Not a guarantee'),
    counts: g('And an edge only counts'), learn: g('Learn the machine'), guard: g('That is your guard'), end: g('But you can only do so much'),
  };
  a.p0 = a.wed + S.SEAM_HALF; a.p1 = a.end - S.SEAM_HALF;
  a.hit = [0, 1, 2, 3, 4].map((i) => F.stepHit(T, i));
  const c13 = T.clip('C13'); a.c13 = { start: c13.start, end: c13.end };
  const footC = (t) => { const k = S.creep(t, T, 'Picture a wedding'); return S.FOOT_CAM(k, S.trk(k)); };
  const workC = (t) => { const k = 1 + S.CREEP * (t - a.p1); return S.WORK_CAM(k, S.trk(k)); };
  // ONE camera for c02–c05 (keys on phrases; F.camPath glides through them)
  const K = [
    [a.p0, footC(a.p0)],
    [a.wed + 2.6, A(-40, 820, 1.12, 960, 560)],
    [a.asks + .6, A(-430, 858, 1.7, 960, 560)],
    [a.given + .5, A(-470, 862, 2.15, 960, 560)],
    [a.diff + .4, A(-490, 870, 3.9, 960, 560)],
    [a.age + 1.2, A(-484, 868, 4.05, 960, 560)],
    [a.harari + 1.4, A(-250, 770, 2.15, 960, 520)],
    [a.sell + .4, A(-240, 764, 2.25, 960, 520)],
    [a.again + .9, A(-236, 760, 2.32, 960, 520)],
    [a.careers + .9, A(-330, 800, 1.85, 960, 520)],
    [a.decades - .1, A(-338, 802, 1.9, 960, 520)],
    [a.decades + 3.0, A(1650, 440, .44, 600, 600)],
    [a.count + 2.6, A(1040, 610, .6, 960, 560)],
    [a.hardest + .3, A(1080, 590, .68, 960, 560)],
    [a.hardest + 2.6, A(1560, 420, 1.12, 960, 620)],
    // c03
    [a.five + 1.7, A(560, 760, 1.45, 860, 600)],
    [a.comes + .2, A(600, 745, 1.55, 880, 600)],
    [a.pays + 2.2, A(660, 720, 1.4, 900, 600)],
    [a.reinvent + .2, A(660, 740, 1.85, 960, 600)],
    [a.sounds + 1.2, A(670, 736, 1.95, 960, 600)],
    [a.data + .8, A(720, 740, 2.15, 960, 600)],
    [a.notTwenty + .8, A(730, 736, 2.12, 960, 600)],
    [a.matters + 1.4, A(705, 730, 1.85, 960, 590)],
    [a.switch + 1.4, A(610, 722, 2.55, 960, 560)],
    [a.switch + 5.0, A(604, 718, 2.62, 960, 560)],
    [a.laid + 1.0, A(870, 722, 2.4, 960, 560)],
    [a.laid + 5.2, A(876, 718, 2.5, 960, 560)],
    [a.comparison + 1.2, A(720, 730, 1.8, 960, 590)],
    [a.same + 3.0, A(706, 734, 1.84, 960, 590)],
    // c04
    [a.fresh + 2.8, A(-380, 870, .62, 960, 640)],
    [a.choose + .1, A(-330, 866, .64, 960, 640)],
    [a.choose + 2.6, A(560, 758, 2.2, 960, 580)],
    [a.beginner + .5, A(580, 756, 2.25, 960, 580)],
    [a.beginner + 3.2, A(690, 748, 2.35, 960, 580)],
    [a.role + 1.2, A(790, 746, 2.35, 960, 580)],
    [a.group + 1.4, A(600, 746, 2.3, 960, 580)],
    [a.title + 2.0, A(590, 748, 2.36, 960, 580)],
    [a.resil + 1.6, A(760, 742, 2.0, 960, 580)],
    [a.bigChange + 2.8, A(800, 740, 2.08, 960, 580)],
    [a.half + 1.0, A(790, 744, 2.2, 960, 580)],
    [a.minute + 1.6, A(770, 742, 2.3, 960, 580)],
    [a.worth + .8, A(700, 706, 1.95, 960, 620)],
    [a.four + 1.4, A(720, 670, 1.95, 960, 640)],
    // c05
    [a.work + .8, A(860, 640, 1.85, 960, 620)],
    [a.evidence + 1.2, A(900, 638, 1.8, 960, 620)],
    [a.oneAI + 1.4, A(970, 630, 1.95, 960, 620)],
    [a.experts + .1, A(1090, 560, 1.42, 960, 580)],
    [a.same2 + 1.0, A(1100, 562, 1.46, 960, 580)],
    [a.rewarded + .4, A(990, 600, 1.62, 960, 580)],
    [a.watched + .2, A(1100, 560, 1.5, 960, 580)],
    [a.late + .6, A(1070, 616, 2.3, 960, 560)],
    [a.late + 5.6, A(1076, 612, 2.36, 960, 560)],
    [a.edge + .8, A(990, 618, 2.15, 960, 580)],
    [a.learn + .4, A(975, 612, 2.22, 960, 590)],
  ];
  const mixC = (p, q, w) => E.cam3({ x: lerp(p.x, q.x, w), y: lerp(p.y, q.y, w), z: lerp(p.z, q.z, w) });
  const base = (t) => {
    let c = F.camPath(t, K);
    const w0 = 1 - smooth(span(t, a.p0, a.p0 + 1.6)); if (w0 > 0) c = mixC(c, footC(t), w0);
    const w1 = smooth(span(t, a.p1 - 2.6, a.p1 - 1.5)); if (w1 > 0) c = mixC(c, workC(t), w1);
    return c;
  };
  const bw = (t) => smooth(span(t, a.p0, a.p0 + 2.6)) * (1 - smooth(span(t, a.p1 - 2.6, a.p1)));
  // the breath table (screen px at the land card), a speed floor: where the base camera is slower than VMIN, the frame keeps
  // travelling at VMIN along the base move's own direction (never against it); with no keyed move it holds its heading, and past
  // LIM px from the keyed framing it turns home on an arc (≤ 1.1 rad/s). Fast keyed moves take the offset back (relax).
  const BR = (() => {
    const dt = 1 / 30, n = Math.ceil((a.p1 - a.p0) / dt) + 2, ox = new Float32Array(n), oy = new Float32Array(n), LIM = 90;
    let x = 0, y = 0, th = 0;
    for (let i = 0; i < n; i++) {
      ox[i] = x; oy[i] = y;
      const t = a.p0 + i * dt, q0 = base(t - dt), q1 = base(t + dt), kq = q0.f / (S.Z_LAND - q0.z);
      const vx = (q1.x - q0.x) * kq / (2 * dt), vy = (q1.y - q0.y) * kq / (2 * dt), vz = 480 * Math.log((S.Z_LAND - q0.z) / (S.Z_LAND - q1.z)) / (2 * dt);
      const v = Math.hypot(vx, vy, .5 * vz), vp = Math.hypot(vx, vy), r = Math.hypot(x, y);
      let tgt = vp > 6 ? Math.atan2(vy, vx) : r > LIM ? Math.atan2(-y, -x) : th;
      if (vp > 6 && r > LIM && Math.cos(tgt - Math.atan2(y, x)) > 0) tgt = Math.atan2(-y, -x);   // keyed move points outward: go home
      let d = tgt - th; d = Math.atan2(Math.sin(d), Math.cos(d)); th += clamp(d, -1.1 * dt, 1.1 * dt);
      const clipOff = span(t, a.c13.start - 1.2, a.c13.start) * (1 - span(t, a.c13.end, a.c13.end + 1.2));
      const VMIN = 42 - 3 * span(t, a.four, a.four + 2) + 10 * span(t, a.first - .5, a.first + .5) * (1 - span(t, a.matters + .5, a.matters + 1.5)) + 20 * span(t, a.among - .5, a.among + .5) * (1 - span(t, a.matters - .5, a.matters + .5));   // + in the c03 holds, more under the veil of the founders card
      const push = Math.max(0, VMIN - v) * (1 - clipOff) * bw(t), relax = .9 * v / (v + 60) + .5 * clipOff;
      x += dt * (Math.cos(th) * push - x * relax); y += dt * (Math.sin(th) * push * .45 - y * relax);
    }
    return (t) => { const f = clamp((t - a.p0) / dt, 0, n - 1), i = Math.min(n - 2, Math.floor(f)), r = f - i; return [lerp(ox[i], ox[i + 1], r), lerp(oy[i], oy[i + 1], r)]; };
  })();
  const cam = (t) => {
    let c = base(t);
    const amt = .8 * Math.min(1, Math.max(0, (t - a.p0) / 1.2)) * (1 - span(t, a.p1 - 1.2, a.p1));
    c = E.camDrift(c, t, amt);
    // breathing floor (nothing ever stops): BR(t), the speed floor above, plus a slow zoom breath; both scale with b (0 on both seam
    // plates, so the plates stay exact)
    const b = bw(t); if (b <= 0) return c;
    const o = BR(t), dz = S.Z_LAND - c.z, k = c.f / dz, m = 1 + .03 * Math.sin(t * .27 + 1.3) * b;
    return { ...c, x: c.x + o[0] * b / k, y: c.y + o[1] * b / k, z: S.Z_LAND - dz / m };
  };
  // the lit steps: all lit until the descent of 'the hardest question'; then the night of the countdown (.3), each step lights on its hit
  const lit = (t) => {
    const dim = sineIO(span(t, a.hardest + 1.4, a.hardest + 3.6));
    const v = [0, 1, 2, 3, 4].map(() => lerp(1, .3, dim));
    for (let i = 0; i < 2; i++) if (t >= a.hit[i] - .05) v[i] = .3 + .7 * F.stepLight(T, t, i);
    if (t > a.hit[1] - .05) v[0] = lerp(v[0], .6, smooth(span(t, a.hit[1], a.hit[1] + 1.2)));
    return v;
  };
  const r = { a, K, cam, lit, footC, workC };
  MEMO.set(T, r); return r;
}

// ================================================================================================================ c02
export default async (T, R) => {
  const G = group(T);
  return [{ t: R.a, draw: scene(T, G), print: F.PRINT49 }];
};

const TABLE = S.WEDDING, YOU_SEAT = -400, NB = -650, CARD = [-500, S.WEDDING.top], POLE = S.WEDDING.x1 + 80;
const HCARD = { x: POLE + 4, y: 640, w: 480, h: 300, sc: .5 };   // the Harari card (card units × sc = land units), pinned to the right pole
function harariCard(ctx, t, a, u, quote) {
  if (u <= 0) return null;
  ctx.save(); ctx.translate(HCARD.x, HCARD.y + 6 * Math.sin(t * .5)); ctx.rotate(.012 * Math.sin(t * .37)); ctx.scale(HCARD.sc, HCARD.sc);
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(14, 14, 7, 0, TAU); ctx.fill();   // the pin
  if (!quote) {
    F.paperCard(ctx, t, 0, 0, HCARD.w, HCARD.h, { u, rot: -.01, head: 'THE HISTORIAN', headSize: 24,
      lines: [['Yuval Noah Harari', 52, 0, true], ['HISTORIAN · AUTHOR OF “SAPIENS”', 24, 0, false]] });
    const su = span(t, a.sell - .1, a.sell + .7);
    if (su > 0) F.maskLine(ctx, [['25 MILLION COPIES SOLD', 0]], 34, 240, 30, F.rise(su), { serif: false, weight: 700, col: GOLD.deep, glow: false });
  } else {
    F.paperCard(ctx, t, 0, 0, HCARD.w, HCARD.h, { u: 1, rot: -.01, head: 'YUVAL NOAH HARARI · 1 AUG 2026', headSize: 22,
      lines: [['“The end of', 50, .5, true], ['lifetime careers”', 50, .5, true]] });
  }
  ctx.restore();
  return { x: HCARD.x, y: HCARD.y, w: HCARD.w * HCARD.sc, h: HCARD.h * HCARD.sc };
}
// the neighbour and his part of the cloth (he stands behind the table: drawn on the land card, then the cloth in front of him again)
function neighbour(ctx, t, a, lights) {
  const up = sineIO(span(t, a.stranger - .1, a.stranger + .8)); if (up <= 0) return;
  const turn = smooth(span(t, a.stranger + .5, a.asks));
  ctx.save(); ctx.beginPath(); ctx.rect(NB - 120, 600, 240, TABLE.top + 58 - 600); ctx.clip();
  E.person(ctx, NB, S.GY + (1 - up) * 100, 162, { dir: 1, light: -1, back: .55, look: lerp(.1, .3, turn), lean: .07 * turn - .03 * (1 - turn), armR: [lerp(.2, .9, turn * F.bump(t, a.stranger + .6, 2.6)), lerp(.1, 1.4, turn * F.bump(t, a.stranger + .6, 2.6))] });
  ctx.restore();
  // the cloth again over him (same paint as S.weddingTable)
  const y = TABLE.top, x0 = TABLE.x0, x1 = TABLE.x1, warm = lights;
  ctx.fillStyle = lin(ctx, 0, y, 0, y + 60, [[0, mixHex(mixHex(P.ind2, PAPER.shade, .22), LAMP.body, .25 * warm)], [1, mixHex(P.night1, PAPER.shade, .1)]]);
  ctx.beginPath(); ctx.moveTo(NB - 110, y); ctx.lineTo(NB + 110, y); ctx.lineTo(NB + 110, y + 58); ctx.lineTo(NB - 110, y + 58); ctx.closePath(); ctx.fill();
  for (let i = 0; i < 4; i++) { const cx = lerp(x0 + 60, x1 - 60, i / 3); if (Math.abs(cx - NB) > 110) continue; ctx.fillStyle = rgba(PAPER.lit, .6); ctx.fillRect(cx - 2, y - 22, 4, 22); if (warm > 0) { ctx.fillStyle = rgba(GOLD.core, warm); ctx.fillRect(cx - 2, y - 30, 4, 7); halo(ctx, cx, y - 28, 40, .3 * warm * (.85 + .15 * Math.sin(t * 5 + i)), GOLD.halo, LAMP.core); } }
}

function scene(T, G) {
  const { a } = G;
  return (ctx, t) => {
    if (t < a.p0) { S.plateFoot(ctx, t, T); return; }
    const c = G.cam(t);
    // ---- you: the plate pose → walk down to the table → at your seat → take the card → walk to the foot → look up
    const w1 = walk(t, a.wed + .55, a.given + .6, S.PLATE_FOOT.youX, YOU_SEAT, 0, .9);
    const w2 = walk(t, a.count + .6, a.hardest - .4, YOU_SEAT, S.YOU.x, 0, .9);
    let you;
    if (t < a.wed + .55) you = { x: S.PLATE_FOOT.youX, y: SY0, o: { look: .3, back: .2, dir: 1 } };
    else if (w1.moving) you = { x: w1.x, y: w1.y, o: { walk: w1.ph, dir: -1, back: .25 } };
    else if (t < a.count + .6) {
      const look = t < a.diff ? .25 : t < a.harari ? lerp(.25, .02, smooth(span(t, a.diff, a.diff + 1))) : lerp(.02, .35, smooth(span(t, a.harari, a.harari + 1)));
      const reach = F.bump(t, a.count - .2, .9);
      you = { x: YOU_SEAT, y: S.GY, o: { dir: t < a.harari + .2 || t > a.careers ? -1 : 1, look, back: .3, armR: reach > 0 ? [lerp(.2, 1.3, reach), lerp(.1, 1.1, reach)] : undefined } };
    } else if (w2.moving) you = { x: w2.x, y: w2.y, o: { walk: w2.ph, dir: 1, back: .3 } };
    else you = { x: S.YOU.x, y: S.GY, o: { look: lerp(.3, .8, smooth(span(t, a.hardest - .4, a.hardest + .8))), back: .35, dir: 1 } };
    // ---- the table: string lights on (right → left), off again when you leave
    const lightsOn = smooth(span(t, a.wed + .4, a.wed + 2.2)), lightsOff = smooth(span(t, a.count + 1.2, a.count + 3.4));
    const lights = lightsOn * (1 - lightsOff);
    const cardU = sineIO(span(t, a.asks - .3, a.asks + .5));
    const take = smooth(span(t, a.count + .05, a.count + .55));
    // answer line: worn and present → fades on 'Now picture giving a different one' → (K.06) fills and fades twice → blank
    const fade = 1 - smooth(span(t, a.diff + .6, a.age + .5));
    const cyc = t > a.careers + .3 && t < a.decades ? .75 * Math.sin(Math.PI * clamp((t - a.careers - .3) / 1.35)) ** 2 : 0;
    const answer = Math.max(fade, cyc);
    const clipM = sineIO(span(t, a.c13.start - 1.8, a.c13.start)) * (1 - sineIO(span(t, a.c13.end, a.c13.end + 1.8)));
    const hcU = smooth(span(t, a.harari + .3, a.harari + 1.3));
    const quote = t > (a.c13.start + a.c13.end) / 2;
    let hBox = null;
    const st = {
      old: .6, lit: G.lit(t), wedding: { a: 1, lights, warm: lights },
      decades: smooth(span(t, a.decades + .4, a.decades + 3.4)),
      nums: smooth(span(t, a.count + .25, a.count + 2.4)) * (1 - span(t, a.hardest + 1.2, a.hardest + 3.2)),
      laptop: t < a.wed + 1.6 ? { x: S.PLATE_FOOT.laptopX, on: 0 } : undefined,
      you,
      land: (cx, hands) => {
        // the dark laptop (no longer needed): it folds shut and sinks into the tread during the wide shot
        if (t >= a.wed + 1.6) pop(cx, 1 - span(t, a.count + .4, a.count + 1.3), SY0, () => S.laptop(cx, t, S.PLATE_FOOT.laptopX, SY0, 62, { on: 0, open: 1 - smooth(span(t, a.count, a.count + .5)) }));
        neighbour(cx, t, a, lights);
        if (cardU > 0) cardAt(cx, t, { at: CARD, hand: hands?.R, k: take, s: 56, answer: answer * (1 - take), u: cardU, glow: .5 * lights });
        hBox = harariCard(cx, t, a, hcU, quote);
      },
    };
    S.stairsWorld(ctx, c, t, st);
    // ---- the clip C13 grows out of the paper card and goes back into it
    if (clipM > 0 && hBox) {
      const p0 = E.project(c, S.Z_LAND, hBox.x, hBox.y), p1 = E.project(c, S.Z_LAND, hBox.x + hBox.w, hBox.y + hBox.h);
      // the footage opens in the paper like an iris from the card's centre (and closes the same way), never a one-frame swap
      const iris = smooth(span(clipM, 0, .14)), fx = (p0[0] + p1[0]) / 2, fy = (p0[1] + p1[1]) / 2, fr = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) / 2 + 4;
      ctx.save(); if (iris < 1) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.arc(fx, fy, Math.max(.5, fr * iris), 0, TAU); ctx.clip(); }
      F.clipPlate(ctx, t, T, 'C13', { from: { x: p0[0], y: p0[1], w: p1[0] - p0[0], h: p1[1] - p0[1] }, morph: clipM });
      ctx.restore();
    }
    // ---- DECADES: the word stands at the far end of the light path (screen space, projected from the path card)
    const du = span(t, a.decades + 1.4, a.decades + 2.4) * (1 - span(t, a.count + 1.0, a.count + 1.8));
    if (du > 0) { const q = E.project(c, S.Z_PATH, 4300, 300); if (q) F.goldText(ctx, [['DECADES', 1]], Math.min(1640, q[0]), Math.max(170, q[1] - 50), 64, F.rise(du), { serif: false, weight: 700, spacing: .14, align: 'center' }); }
    F.counter(ctx, t, T);
    F.source(ctx, t, a.careers + .3, a.decades + 1.6, F.SOURCES.careers);
  };
}
