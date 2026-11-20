// Film 54 · builder B1 · c02–c05 as ONE continuous take: "He didn't invent it" → 'The third disease answers fast' (plateMind).
// One draw function for the whole group (scenes/sc02…sc05.mjs each return one entry that calls it), so the inner chunk
// boundaries c02|c03, c03|c04, c04|c05 are the same picture frame for frame by construction. Pure in t (no state between frames).
// Plan: docs/shots.md 1.01–M.02 · world: docs/MOTION.md · kit: lib/f54_kit.mjs · hall + plates: lib/f54_seams.mjs.
//
// | ID    | anchor (phrase)                 | picture (one idea)                                                         | camera / carrier        |
// |-------|---------------------------------|----------------------------------------------------------------------------|-------------------------|
// | 1.01  | He didn't invent it             | out of plateRoadshow; glide to the lectern, the essay opens, its label     | glide + push · MIX      |
// | 1.02  | With small print                | the magnifier over the small print: even magnified, unreadable             | creep · EXPL            |
// | 1.03  | And his reasoning               | two trial lanes grow out of the page: lane 1 trembles near zero, endless   | essay up · EXPL         |
// | 1.04  | When something works really well| lane 2 jumps steeply, the proof line is reached after a few: a mint stamp  | creep · EXPL            |
// | 1.05  | Earlier this year, on a podcast | the lanes go back into the page; glide to the kiosk, the screen wakes      | truck + push · MIX      |
// | 1.06  | [C3]                            | the screen grows into the clip plate (original footage)                    | creep · CLIP            |
// | 1.07  | So even in his view             | the plate shrinks into the screen; NOT INSTANT, NOT INFINITELY FAST stays  | pull back · EXPL        |
// | 2.00  | Less than a decade that's       | the mint line glides top left and THE BOARD grows out of it                | pull back · EXPL        |
// | 2.01  | Four diseases                   | wide: the four vitrines, each glows as it is counted                       | wide truck · MIX        |
// | 2.02  | When a medicine really works    | a mint ? in each empty answer slot of the board                            | drift · EXPL            |
// | 2.03  | The fastest clear answer        | CANCER row lights; push to vitrine 1                                       | push · HALL             |
// | 2.04  | In the lab, the day             | through the glass: the cell sinks into a dish, a lab at night rises; the   | dive · SCENE            |
// |       |                                 | CANCER label rises from its plaque, FOUND fills a little                   |                         |
// | 2.05  | Doctors can rebuild             | an immune cell grows hooks and swims to the cancer cell                    | push into dish · EXPL   |
// | 2.06  | Artificial intelligence now     | the lab screen: variants of the inner part (tip unchanged), one wins;      | pull back · EXPL        |
// |       |                                 | the cell then carries ~10× the hooks (MB1 wording)                         |                         |
// | 2.07  | All still in the lab            | the lid closes over the dish · LAB TESTS ONLY                              | creep · SCENE           |
// | 2.08  | Then the body answers           | the round lid lifts out and becomes a scan; a second scan: the tumour      | out of the glass · EXPL |
// |       |                                 | shrinks · WEEKS                                                            |                         |
// | 2.09★ | That's how one pill             | the two scans fold into a capsule; 55 patients in 12 groups, 41 light mint;| creep · EXPL            |
// |       |                                 | the steep lane flashes                                                     |                         |
// | 2.10  | But cancer isn't one disease    | the cell lifts out of vitrine 1 and splits into 100+ shapes that dodge     | truck under veil · EXPL |
// | 2.11  | His own essay said so           | the magnifier makes the small print readable: most cancer · K5 sentence    | push · EXPL             |
// | 2.12  | The line in the sales video     | "most" flies to the wall text, which unfolds from the frame: cancer (mint) | glide · EXPL            |
// | 2.13  | So cancer, by the deadline      | the wall text folds back; wide hall; board ✓ MANY KINDS, vitrine 1 glows   | truck · MIX             |
// | 2.14  | But is a fast answer            | HEART row lights; push to vitrine 2                                        | push · HALL             |
// | 3.01  | Heart disease answers twice     | vitrine 2: the heart moves aside, a liver grows from its vessel            | push · HALL             |
// | 3.02  | First, the blood                | the bag lowers, ONE drop runs to the liver, a gene switch flips · CTX310   | dive · EXPL             |
// | 3.03  | At the highest dose             | an LDL column sinks to half · LDL ≈ −50 %                                  | creep · EXPL            |
// | 3.04  | One treatment, meant to last    | a life band runs on from the liver, no second drop                         | pull back · EXPL        |
// | 3.05  | But a change to your DNA        | the band twists into DNA with a lasting mark, then a path: two walk 15 years| creep · EXPL           |
// | 3.06★ | And whether the heart attacks   | the path becomes the track of a stadium, thousands fill it, seasons as light| pull back · EXPL       |
// | 3.07  | So heart disease, by the        | the stadium folds into the heart; HEART label: FOUND stamped, PROVEN waits | creep · MIX             |
// | M.01  | This channel exists             | the lit doorway opens: a hospital corridor, a room, a bed, you beside it   | push · SCENE (QR quiet) |
// | M.02  | Want that too                   | the door light breathes and dims; drift right to vitrine 3 → plateMind     | glide · HALL            |
import { Path2D, createCanvas } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f54_kit.mjs';
import * as S from './f54_seams.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, halo, mixHex, smooth, rad, lin, prng } = E;
const { rise, maskLine, mintText, measure, F0, MINT, COOL, LAMP, RELIC } = F;
const TAU = Math.PI * 2;
const bump = F.bump;

export const PRINT = F.PRINT54;
const SCENES = new WeakMap();
export function b1Scene(T) { E.prepareEditorial(); if (!SCENES.has(T)) SCENES.set(T, build(T)); return SCENES.get(T); }

// ================================================================================================================= anchors (phrases only)
function anchors(T) {
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.T0 = G("He didn't invent it"); a.years = G('Years ago', a.T0); a.essay = G('essay called', a.T0); a.grace = GE('Loving Grace', a.T0);
  a.small = G('With small print', a.T0); a.reason = G('And his reasoning', a.T0); a.slow = G('Trials are slow', a.reason); a.barely = G('barely work', a.reason);
  a.works = G('When something works really well', a.reason); a.proof = G('the proof comes fast', a.works);
  a.earlier = G('Earlier this year, on a podcast', a.works); a.limit = G('set his own limit', a.earlier); a.C3 = T.clip('C3');
  a.view = G('So even in his view', a.earlier); a.takes = G('proof takes time', a.view);
  a.less = G("Less than a decade that's", a.view); a.t2036 = G('twenty thirty-six', a.less); a.four = G('Four diseases', a.less);
  a.medicine = G('When a medicine really works', a.four); a.fastest = G('The fastest clear answer', a.medicine);
  a.lab = G('In the lab, the day', a.fastest); a.found = G('found', a.lab); a.closer = G('getting closer', a.lab);
  a.rebuild = G('Doctors can rebuild', a.lab); a.hunt = G('to hunt cancer', a.rebuild); a.receptor = G('with a receptor', a.rebuild); a.hook = G('like a hook', a.rebuild);
  a.ai = G('Artificial intelligence now helps', a.rebuild); a.oneNew = G('One new design', a.ai); a.better = G('works better', a.oneNew);
  a.still = G('All still in the lab', a.ai);
  a.then = G('Then the body answers', a.still); a.scan = G('on a scan', a.then); a.weeks = G('within weeks', a.then); a.shrinks = G('it shrinks', a.then);
  a.pill = G("That's how one pill", a.then); a.approval = G('won approval', a.pill); a.p55 = G('fifty-five patients', a.pill); a.many = G('many different cancers', a.pill);
  a.most = G('Most of them responded', a.pill);
  a.notOne = G("But cancer isn't one disease", a.most); a.hundred = G('more than a hundred', a.notOne); a.fight = G('they fight back', a.notOne);
  a.own = G('His own essay said so', a.fight); a.mostC = G('most cancer', a.own); a.some = G('Some rare', a.own); a.persist = GE('may persist', a.own);
  a.line = G('The line in the sales video', a.own); a.cancerW = G('cancer', G('just says', a.line));
  a.soCancer = G('So cancer, by the deadline', a.line); a.forMany = G('for many kinds', a.soCancer); a.notEvery = G('Not for every kind', a.soCancer);
  a.butFast = G('But is a fast answer', a.notEvery);
  a.heart = G('Heart disease answers twice', a.butFast); a.blood = G('First, the blood', a.heart); a.recent = G('In a recent trial', a.blood);
  a.infusion = G('single infusion', a.blood); a.switched = G('switched off a gene', a.blood);
  a.dose = G('At the highest dose', a.switched); a.half = G('cut roughly in half', a.dose);
  a.oneT = G('One treatment, meant to last', a.dose); a.dna = G('But a change to your DNA', a.oneT); a.forLife = G('is for life', a.dna);
  a.regulators = G('So regulators ask', a.dna); a.fifteen = G('fifteen years', a.regulators);
  a.whether = G('And whether the heart attacks', a.regulators); a.stadium = G('a stadium full', a.whether);
  a.soHeart = G('So heart disease, by the deadline', a.whether); a.halfway = G('only halfway', a.soHeart);
  a.tool = G('The tool can be ready', a.soHeart); a.inTime = G('in time', a.tool); a.proofSafe = G("The proof that it's safe", a.tool); a.lifetime = G('a lifetime', a.proofSafe);
  a.cant = GE("can't", a.lifetime);
  a.chan = G('This channel exists', a.cant); a.bed = G('hospital bed', a.chan); a.forYou = G('one day for you', a.chan);
  a.want = G('Want that too', a.chan); a.subscribe = G('Then subscribe', a.want);
  a.end = G('The third disease answers fast', a.subscribe);
  return a;
}

// ================================================================================================================= geometry (design px, F0 card)
const C = (u, v, s, sx, sy) => E.aim(F0, u, v, s, sx, sy);
const LT = S.HALL.lectern, LTY = LT.y - LT.s * .78, LTW = LT.s * .62;
const ES = { x: LT.x, y: LTY - LT.s * .05 - LTW * .8 * .2, w: LTW * .8 };   // the open essay on the lectern (centre, spread width)
ES.h = ES.w * .62;
const KS = S.kioskScreen(), KSC = [KS.x + KS.w / 2, KS.y + KS.h / 2];
const V1 = S.glassOf(0), V2 = S.glassOf(1), PQ = [0, 1, 2, 3].map(S.plaqueOf);
const DX = S.hallX(S.Z_WALL, S.HALL.door);                                      // the doorway on the wall card
// the lab inside vitrine 1 (local px of the glass, 660 × 690) · the heart room inside vitrine 2
const LAB = { bench: 440, dish: { x: 440, y: 330, r: 82 }, scr: { x: 52, y: 274, w: 190, h: 116 }, sci: { x: 292, h: 205 }, lid: { x: 590, y: 434 } };
const CANC = { x: 18, y: -6, r: 27 };                                           // the cancer cell in the dish (dish-local)
const HR = { heart: [190, 372, 84], liver: [455, 382], bag: [528, 96], col: { x: 598, y0: 300, y1: 520 } };
const KITHEART = [330, 690 * .47, 660 * .26];
const toV1 = (lx, ly) => [V1.x + lx, V1.y + ly], toV2 = (lx, ly) => [V2.x + lx, V2.y + ly];
const proj = (c, u, v) => E.project(c, F0, u, v);
const projRect = (c, r) => { const p = proj(c, r.x, r.y), q = proj(c, r.x + r.w, r.y + r.h); return p && q ? { x: p[0], y: p[1], w: q[0] - p[0], h: q[1] - p[1] } : null; };
const BOARDBOX = { x0: 50, y0: 36, x1: 510, y1: 376 };

// screen-space explainers float a little (never a frozen frame): slow drift and breath about the centre, scaled by k (sc01)
const float = (ctx, t, k = 1) => { ctx.setTransform(1, 0, 0, 1, 0, 0); const z = 1 + .012 * k * Math.sin(t * .37 + 1), dx = E.drift(t * 1.1, 10 * k, 11), dy = E.drift(t * 1.1, 6 * k, 17);
  ctx.translate(W / 2 + dx, H / 2 + dy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); };
const screen = (ctx) => ctx.setTransform(1, 0, 0, 1, 0, 0);
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
const lineR = (ctx, txt, xr, y, size, u, o = {}) => maskLine(ctx, [[txt, 0]], xr - measure(txt, size, o.serif ?? true, o.weight), y, size, u, o);

// ================================================================================================================= small drawn things
// a tiny patient (head + shoulders), indigo; lit 0..1 turns the rim and body mint (responded). (x, y) = feet, h = height
function patient(ctx, x, y, h, lit = 0, a = 1, tone = .4) {
  if (a <= 0 || h < 2) return;
  ctx.save(); ctx.globalAlpha *= a;
  if (lit > 0) halo(ctx, x, y - h * .55, h * .9, .22 * lit, MINT.halo, MINT.body);
  const body = mixHex(mixHex(P.ind2, P.cream, tone * .55), mixHex(MINT.deep, MINT.body, .35), lit), rim = mixHex(mixHex(P.blue1, P.cream, tone), MINT.line, lit);
  ctx.fillStyle = body; ctx.beginPath(); ctx.moveTo(x - h * .2, y); ctx.bezierCurveTo(x - h * .21, y - h * .5, x - h * .18, y - h * .68, x, y - h * .7); ctx.bezierCurveTo(x + h * .18, y - h * .68, x + h * .21, y - h * .5, x + h * .2, y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mixHex(P.night1, MINT.deep, .6 * lit); ctx.beginPath(); ctx.arc(x, y - h * .84, h * .13, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba(rim, .75); ctx.lineWidth = Math.max(1, h * .03); ctx.beginPath(); ctx.arc(x, y - h * .84, h * .13, -2.2, -.4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - h * .17, y - h * .45); ctx.bezierCurveTo(x - h * .16, y - h * .62, x - h * .1, y - h * .68, x, y - h * .7); ctx.stroke();
  ctx.restore();
}
// a lumpy little cell (cached unit shape per variant): cheap enough for a hundred of them
const BLOBS = new Map();
function blobPath(v) {
  if (BLOBS.has(v)) return BLOBS.get(v);
  const r = prng(900 + v * 13), lobes = []; for (let k = 0; k < 4; k++) lobes.push([2 + Math.floor(r() * 6), r() * TAU, .05 + r() * .12]);
  const p = new Path2D(), n = 36; for (let i = 0; i <= n; i++) { const a = i / n * TAU; let q = 1; for (const [f, ph, am] of lobes) q += am * Math.sin(a * f + ph); i ? p.lineTo(Math.cos(a) * q, Math.sin(a) * q) : p.moveTo(Math.cos(a) * q, Math.sin(a) * q); }
  p.closePath(); BLOBS.set(v, p); return p;
}
function blob(ctx, x, y, r, v, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || r < .5) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.scale(r * (o.sx ?? 1), r * (o.sy ?? 1));
  const p = blobPath(v), col = o.col ?? RELIC.body;
  ctx.fillStyle = rgba(col, .78); ctx.fill(p);
  ctx.fillStyle = rgba(mixHex(col, P.night0, .55), .85); ctx.beginPath(); ctx.arc(.08, .05, .36, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba(mixHex(col, P.cream, .5), .8); ctx.lineWidth = 1.4 / Math.max(1, r); ctx.stroke(p);
  ctx.restore();
}
// a hook (the receptor): a stalk through the membrane (the inner part) and a J tip outside. (x, y) on the membrane, ang outward, L length
function hookGlyph(ctx, x, y, ang, L, u = 1, col = MINT.core) {
  if (u <= 0) return; const e = expoOut(u), c = Math.cos(ang), s = Math.sin(ang), L2 = L * e;
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = Math.max(.8, L * .16); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - c * L * .3, y - s * L * .3); ctx.lineTo(x + c * L2, y + s * L2);
  const hx = x + c * L2, hy = y + s * L2, rr2 = L * .28 * e; ctx.arc(hx - s * rr2, hy + c * rr2, rr2, ang - Math.PI / 2, ang + Math.PI * .6, false); ctx.stroke(); ctx.restore();
}
// the immune cell (the cure, mint) with n hooks (sprout 0..1 each by index)
function immuneCell(ctx, t, x, y, r, n, sprout, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  halo(ctx, x, y, r * 2.6, .3, MINT.halo, MINT.body);
  for (let j = 0; j < n; j++) { const ang = (j / n) * TAU + (o.rot ?? 0) + .13 * Math.sin(j * 2.3), u = sprout(j); if (u > 0) hookGlyph(ctx, x + Math.cos(ang) * r, y + Math.sin(ang) * r, ang, r * .42, u, MINT.core); }
  ctx.fillStyle = rad(ctx, x - r * .25, y - r * .3, r * 1.1, [[0, MINT.core], [.6, MINT.body], [1, mixHex(MINT.body, MINT.deep, .5)]]); ctx.beginPath(); ctx.arc(x, y, r * (1 + .025 * Math.sin(t * 1.3)), 0, TAU); ctx.fill();
  ctx.fillStyle = rgba(MINT.deep, .75); ctx.beginPath(); ctx.ellipse(x + r * .1, y + r * .05, r * .42, r * .36, .4, 0, TAU); ctx.fill();
  ctx.restore();
}
// a scan card (cream-grey tumour; the body slice in cool lines). (cx, cy) centre, w width (h = .8 w), tumor 0..1, a. Rounded-rect morph via rr0.
function scanCard(ctx, t, cx, cy, w, h, rad0, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  rr(ctx, cx - w / 2, cy - h / 2, w, h, Math.min(rad0, w / 2, h / 2));
  ctx.fillStyle = o.fill ?? mixHex(P.night0, P.ind0, .45); ctx.fill(); ctx.strokeStyle = rgba(P.cream, .5); ctx.lineWidth = 2; ctx.stroke();
  const ia = o.inner ?? 1;
  if (ia > 0) {
    ctx.save(); ctx.clip(); ctx.globalAlpha *= ia;
    ctx.strokeStyle = rgba(COOL.line, .5); ctx.lineWidth = Math.max(1, w * .008);
    ctx.beginPath(); ctx.ellipse(cx, cy + h * .04, w * .36, h * .38, 0, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx - w * .14, cy + h * .02, w * .1, h * .24, .2, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx + w * .14, cy + h * .02, w * .1, h * .24, -.2, 0, TAU); ctx.stroke();
    ctx.strokeStyle = rgba(COOL.line, .25); ctx.beginPath(); ctx.moveTo(cx, cy - h * .3); ctx.lineTo(cx, cy + h * .38); ctx.stroke();
    const tr = w * .085 * clamp(o.tumor ?? 1), tx = cx + w * .1, ty = cy - h * .07;
    if (tr > .5) { halo(ctx, tx, ty, tr * 3, .25, LAMP.body, LAMP.core); ctx.fillStyle = mixHex(RELIC.body, P.cream, .35); ctx.beginPath(); ctx.arc(tx, ty, tr, 0, TAU); ctx.fill(); }
    if (o.ghost) { ctx.setLineDash([4, 4]); ctx.strokeStyle = rgba(P.cream, .35); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(tx, ty, w * .085, 0, TAU); ctx.stroke(); ctx.setLineDash([]); }
    ctx.restore();
  }
  ctx.restore();
}
// rounded rect with per-corner radii (tl, tr, br, bl)
function rr4(ctx, x, y, w, h, [a, b, c, d]) { ctx.beginPath(); ctx.moveTo(x + a, y); ctx.lineTo(x + w - b, y); ctx.arcTo(x + w, y, x + w, y + b, b); ctx.lineTo(x + w, y + h - c); ctx.arcTo(x + w, y + h, x + w - c, y + h, c); ctx.lineTo(x + d, y + h); ctx.arcTo(x, y + h, x, y + h - d, d); ctx.lineTo(x, y + a); ctx.arcTo(x, y, x + a, y, a); ctx.closePath(); }
// the liver (a broad right lobe, a small left lobe): (x, y) centre, s width
const LIVER = (() => { const p = new Path2D(); p.moveTo(-.5, -.05); p.bezierCurveTo(-.46, -.32, -.1, -.42, .3, -.36); p.bezierCurveTo(.5, -.32, .56, -.12, .44, .06); p.bezierCurveTo(.3, .26, .02, .3, -.18, .2); p.bezierCurveTo(-.32, .14, -.52, .12, -.5, -.05); p.closePath(); return p; })();

// ================================================================================================================= the scene
function build(T) {
  const a = anchors(T), c3 = a.C3, tPlate = a.end - S.SEAM_HALF, tCreep = tPlate - 2.5;
  const BT = F.boardTimesOf(T);
  // ---------------------------------------------------------------- the camera (one take)
  const rsCam = (t) => C(6120 + S.TRUCK * (t - (a.T0 - S.SEAM_HALF)), 560, .9 * (1 + S.CREEP * (t - (a.T0 - S.SEAM_HALF))));
  const mindCam = (t) => C(3440 + S.TRUCK * (t - tPlate), 500, 1.15 * (1 + S.CREEP * (t - tPlate)), 860, 560);
  const EC = (s, sx = 960, sy = 540) => C(ES.x, ES.y, s, sx, sy);
  const LABC = (s) => C(...toV1(355, 332), s), DISHC = (s) => C(...toV1(LAB.dish.x - 10, LAB.dish.y), s);
  const V2C = (s, sy = 540, lx = 360) => C(...toV2(lx, 300), s, 960, sy);
  const DOOR = (s, sx) => E.aim(S.Z_WALL, DX, 410, s, sx, 540);
  const K = [
    [a.T0 - .5, rsCam(a.T0 - .5)], [a.T0 + .5, rsCam(a.T0 + .5)], [a.T0 + 1.2, rsCam(a.T0 + 1.2)],
    [a.years + .6, C(6500, 560, 1.45)], [a.essay + .4, EC(3.0, 960, 560)], [a.grace + .6, EC(4.4, 960, 560)],
    [a.reason + .2, EC(4.6, 960, 545)], [a.reason + 1.7, EC(3.3, 960, 300)], [a.earlier, EC(3.62, 960, 318)],
    [a.earlier + 2.0, C(7000, 500, 1.55)], [a.limit - .2, C(...KSC, 2.3)], [c3.start - .1, C(...KSC, 2.6)], [c3.end, C(KSC[0], KSC[1] + 4, 2.72)],
    [a.view + 1.5, C(7300, 480, 1.6)], [a.less + .6, C(7180, 492, 1.4)], [a.four, C(5100, 510, .62)], [a.four + 2.3, C(2950, 520, .42)],
    [a.fastest + .1, C(2700, 522, .5)], [a.lab - .2, C(1440, 470, 1.25)], [a.lab + 1.7, LABC(2.85)], [a.rebuild + .3, LABC(3.12)],
    [a.receptor, DISHC(3.8)], [a.hook + .6, DISHC(3.95)], [a.ai + 1.2, LABC(2.4)], [a.still, LABC(2.64)], [a.still + 1.1, DISHC(2.8)],
    [a.then + .2, DISHC(2.85)], [a.then + 2.6, C(1470, 480, 1.02)], [a.pill, C(1430, 482, 1.12)], [a.notOne + 1.0, C(1390, 480, 1.25)],
    [a.hundred + .8, C(3900, 520, .32)], [a.own + .5, EC(3.35, 1060, 372)], [a.persist - .4, EC(3.9, 1060, 385)],
    [a.line + 2.4, C(5400, 476, 1.0)], [a.soCancer + .3, C(5390, 478, 1.03)], [a.forMany + .6, C(4300, 505, .55)],
    [a.notEvery + .4, C(2950, 520, .43)], [a.butFast + .2, C(2880, 520, .45)], [a.heart - .1, C(2440, 470, 1.3)],
    [a.blood + .2, C(2440, 455, 1.45)], [a.recent + 1.0, V2C(2.35)], [a.dose + .3, V2C(2.5, 540, 420)], [a.oneT + .2, V2C(2.0, 430, 390)],
    [a.oneT + 1.8, V2C(1.85, 400)], [a.whether, V2C(1.64, 384, 410)], [a.stadium, C(2440, 470, 1.0, 960, 560)], [a.soHeart + .2, C(2440, 470, 1.03)],
    [a.tool + .4, C(2440, 470, 1.05, 760, 540)], [a.cant + .6, C(2470, 474, 1.14, 760, 540)],
    [a.chan + 2.2, DOOR(1.3, 760)], [a.bed + .8, DOOR(1.62, 780)], [tCreep, mindCam(tCreep)], [tCreep + 1, mindCam(tCreep + 1)],
  ];
  const camRaw = (t) => (t < a.T0 + .5 ? rsCam(t) : t < tCreep ? F.camPath(t, K) : mindCam(t));
  const cam = (t) => { const c = camRaw(t), s = F0 / Math.max(60, F0 - c.z), fade = smooth(span(t, a.T0 + .5, a.T0 + 2.5)) * (1 - smooth(span(t, tPlate - 2.2, tPlate)));
    return E.camDrift(c, t * 2.2, 11 / Math.max(1, s) * fade, 5); };

  // ---------------------------------------------------------------- 1.01–1.04 the essay, the magnifier, the two lanes
  const essayOpen = (t) => span(t, a.essay - .1, a.grace + .25);
  const lensOf = (t) => {
    const u1 = span(t, a.small - .35, a.small + .4) * (1 - span(t, a.reason + .1, a.reason + .7));
    if (u1 > 0) return { x: lerp(.06, .3, sineIO(span(t, a.small - .35, a.reason + .4))), y: -.02, r: .17, u: u1, size: .17,
      text: ['—— ——— — ———— ——', '——— —— ———— — ——', '— ———— —— ——— ———', '———— — ——— ——'] };   // small print, still unreadable (no invented quote)
    const u2 = span(t, a.own + .15, a.own + .85) * (1 - span(t, a.line + .15, a.line + .75));
    if (u2 > 0) return { x: lerp(.36, .25, sineIO(span(t, a.own + .15, a.mostC - .2))), y: .02, r: .21, u: u2, size: 1, text: ['…elimination of', 'most cancer…'], hi: ['most'] };
    return null;
  };
  const LANES = [{ x: 580, y: 556, w: 1000, h: 118 }, { x: 580, y: 708, w: 1000, h: 118 }];
  const LANECAP = [['BARELY WORKS', 'THOUSANDS OF PATIENTS, YEARS'], ['WORKS REALLY WELL', 'A FEW PATIENTS, FAST']];
  const laneGrow = (k, t) => sineIO(span(t, k ? a.works - .55 : a.reason + .35, k ? a.works + .45 : a.reason + 1.45)) * (1 - sineIO(span(t, a.earlier - .3 + k * .1, a.earlier + .8 + k * .1)));
  const L2 = { t0: () => a.works + .62, dt: .33, h: [6, 19, 40, 70, 74, 76] };
  function lanes(ctx, t, c) {
    const eb = projRect(c, { x: ES.x - ES.w / 2, y: ES.y - ES.h / 2, w: ES.w, h: ES.h }); if (!eb) return;
    for (let k = 0; k < 2; k++) {
      const g = laneGrow(k, t); if (g <= 0) continue;
      const L = LANES[k], r = { x: lerp(eb.x + eb.w * .1, L.x, g), y: lerp(eb.y + eb.h * .9, L.y, g), w: lerp(eb.w * .8, L.w, g), h: lerp(4, L.h, g) };
      ctx.save(); ctx.globalAlpha *= k === 0 ? lerp(1, .55, span(t, a.works - .3, a.works + .6)) : 1;
      rr(ctx, r.x, r.y, r.w, r.h, 10); ctx.fillStyle = rgba(mixHex(P.night1, P.ind2, .55), .93); ctx.fill(); ctx.strokeStyle = rgba(P.cream, .3); ctx.lineWidth = 1.5; ctx.stroke();
      if (g < .85) { ctx.restore(); continue; }
      const ia = span(g, .85, 1); ctx.globalAlpha *= ia;
      lineR(ctx, LANECAP[k][0], r.x - 22, r.y + 50, 26, ia, { serif: false, weight: 600, col: k ? MINT.text : P.cream, glow: false });
      lineR(ctx, LANECAP[k][1], r.x - 22, r.y + 82, 18, rise(span(g, .9, 1)), { serif: false, weight: 600, col: P.halo2, glow: false });
      ctx.save(); rr(ctx, r.x, r.y, r.w, r.h, 10); ctx.clip();
      const base = r.y + r.h - 22, py = r.y + 28, x0 = r.x + 46;
      ctx.setLineDash([9, 8]); ctx.strokeStyle = rgba(P.cream, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(r.x + 20, py); ctx.lineTo(r.x + r.w - 20, py); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = rgba(P.blue1, .6); ctx.fillRect(r.x + 20, base + 2, r.w - 40, 1.5);
      const pts = [];
      if (k === 0) {   // barely works: an endless row of patients, the effect trembles just above zero
        const nf = Math.max(0, (t - a.slow + .3) / .3), cap = (r.w - 110) / 30, off = Math.max(0, nf - cap) * 30;
        for (let j = Math.max(0, Math.floor((off - 40) / 30)); j < Math.ceil(nf); j++) {
          const x = x0 + j * 30 - off, e = rise(span(nf, j, j + .8)); if (x < r.x - 20) continue;
          patient(ctx, x, base, 30 * e, 0, e);
          pts.push([x, base - 34 - (5 + 3.5 * Math.sin(j * 1.9 + t * 1.6) + j * .04)]);
        }
        if (pts.length > 1) F.mintSpan(ctx, pts, 0, 1, { w: 2.2, a: .8, spark: false });
      } else {         // works really well: a few patients, the effect jumps, the proof line is reached → a mint stamp
        const t0 = L2.t0();
        for (let j = 0; j < L2.h.length; j++) {
          const tj = t0 + j * L2.dt, e = rise(span(t, tj, tj + .3)); if (e <= 0) break;
          const x = x0 + j * 84; patient(ctx, x, base, 30 * e, span(t, a.proof + .1, a.proof + .7), e);
          pts.push([x, base - 34 - (L2.h[j] / 76) * (base - 34 - py) * smooth(span(t, tj, tj + .35))]);
        }
        if (pts.length > 1) F.mintSpan(ctx, pts, 0, 1, { w: 3.4, spark: true });
        const hx = x0 + 3 * 84, su = span(t, a.proof - .05, a.proof + .55);
        if (su > 0) F.stampMark(ctx, t, hx - 64, py - 19, 128, 38, su, { text: 'PROVEN' });
      }
      ctx.restore(); ctx.restore();
    }
  }

  // ---------------------------------------------------------------- 1.05–1.07 the kiosk, C3, the mint line → 2.00 the board
  const kioskGlow = (t) => .45 + .55 * smooth(span(t, a.earlier + 1.4, a.limit)) - .35 * smooth(span(t, a.view + .8, a.less + .5));
  const clipM = (t) => sineIO(span(t, c3.start - 1.4, c3.start - .05)) * (1 - sineIO(span(t, c3.end + .05, c3.end + 1.45)));
  let OFF = null;   // the plate's soft ends (clipPlate resets globalAlpha inside, so it is faded through an offscreen layer)
  const MLINE = 'NOT INSTANT, NOT INFINITELY FAST';
  const mlW = (size) => measure(MLINE, size, false, 600) + MLINE.length * size * .1;
  function mintLine(ctx, t, c) {
    const u = rise(span(t, c3.end + .55, c3.end + 1.35)), out = span(t, a.t2036 + .05, a.t2036 + .75);
    if (u <= 0 || out >= 1) return;
    const sr = projRect(c, KS), g = sineIO(span(t, a.less - .35, a.t2036 - .05)), size = lerp(34, 19, g);
    const x0 = sr ? sr.x + sr.w / 2 - mlW(34) / 2 : 400, y0 = sr ? sr.y - 34 : 300;
    const x = lerp(x0, BOARDLINE.x, g), y = lerp(y0, BOARDLINE.y, g);
    ctx.save(); float(ctx, t, .7 * (1 - g)); ctx.globalAlpha *= 1 - out;
    F.mintText(ctx, [[MLINE, 1]], x, y, size, u, { serif: false, weight: 600, spacing: .1 });
    ctx.restore();
  }
  const BOARDLINE = { x: 70, y: 84 };

  // ---------------------------------------------------------------- 2.01–2.02 the four vitrines counted, the ? slots
  function questionSlots(ctx, t) {
    for (let k = 0; k < 4; k++) {
      const u = rise(span(t, a.medicine + .3 + k * .14, a.medicine + 1.0 + k * .14)) * (1 - expoIn(span(t, a.fastest + .4 + k * .06, a.fastest + 1.0 + k * .06)));
      if (u > 0) { ctx.save(); screen(ctx); F.mintText(ctx, [['?', 1]], F.BOARD.x + 176, F.BOARD.y + 106 + k * 52, 30, u, {}); ctx.restore(); }
    }
  }

  // ---------------------------------------------------------------- 2.04–2.07 the CANCER label + the lab inside vitrine 1
  const labMix = (t) => smooth(span(t, a.lab - .3, a.lab + 1.3)) * (1 - smooth(span(t, a.then + 1.0, a.then + 2.4)));
  const cellSink = (t) => sineIO(span(t, a.lab + .1, a.lab + 1.9));                  // the vitrine cell sinks into the dish
  const immuneIn = (t) => sineIO(span(t, a.rebuild - .2, a.rebuild + 1.0));
  const immunePos = (t) => { const u = sineIO(span(t, a.hunt - .3, a.hook + .15)); const dx = CANC.x - (CANC.r + 21 + 8), dy = CANC.y + 4;
    return [lerp(-74, dx, u) + 2 * Math.sin(t * 1.3), lerp(30, dy, u) + 3 * Math.sin(t * 1.1 + 1) * (1 - u) + 1.2 * Math.sin(t * .9)]; };
  const hooksN = (t) => (t < a.better - .2 ? 7 : 40);
  const sproutOf = (t) => (j) => { if (j < 7 && t < a.better - .2) return span(t, a.receptor - .2 + j * .16, a.receptor + .3 + j * .16);
    if (t >= a.better - .2) { const old = j % 6 === 0; return old ? 1 : span(t, a.better - .2 + (j % 17) * .045, a.better + .3 + (j % 17) * .045); } return 0; };
  const lidU = (t) => sineIO(span(t, a.still - .2, a.still + .9));
  const lidLift = (t) => sineIO(span(t, a.then + .05, a.then + 1.6));
  function variants(ctx, t, w, h) {
    // the lab screen: four designs of the receptor's INNER part (below the membrane); the hook tip above stays the same (faktencheck MB1)
    const k = span(t, a.ai - .2, a.ai + .4); if (k <= 0) return;
    ctx.fillStyle = rgba(COOL.deep, .55 * k); ctx.fillRect(0, 0, w, h);
    const my = h * .42; ctx.fillStyle = rgba(COOL.line, .45 * k); ctx.fillRect(8, my, w - 16, 1.6);
    const win = span(t, a.oneNew - .1, a.oneNew + .5);
    for (let j = 0; j < 4; j++) {
      const tj = a.ai + .25 + j * .55, u = rise(span(t, tj, tj + .5)); if (u <= 0) continue;
      const cx = w * (.16 + j * .225), dim = j === 2 ? 1 : 1 - .6 * win;
      ctx.save(); ctx.globalAlpha *= u * k * dim;
      hookGlyph(ctx, cx, my, -Math.PI / 2, 22, 1, COOL.core);
      const r = prng(31 + j * 7), nb = j === 2 ? 2 : 3 + Math.floor(r() * 2);
      for (let b = 0; b < nb; b++) { const bw = 10 + r() * 14, bh = 9; ctx.fillStyle = j === 2 ? mixHex(COOL.body, MINT.body, win) : COOL.body; rr(ctx, cx - bw / 2 + (r() - .5) * 6, my + 6 + b * (bh + 3), bw, bh, 3); ctx.fill(); }
      ctx.restore();
      if (j === 2 && win > 0) { ctx.strokeStyle = rgba(MINT.ink, win); ctx.lineWidth = 2.2; rr(ctx, cx - 22, 8, 44, h - 16, 6); ctx.stroke(); }
      const sp = 1 - span(t, tj, tj + .5); if (sp > 0 && sp < 1) F.spark(ctx, t, cx, my - 26, 2.2 * sp, { a: sp });
    }
  }
  function labRoom(ctx, t, w, h) {
    const k = labMix(t), d = LAB.dish, B = LAB.bench;
    // the cell exhibit: it sinks and shrinks into the dish (the carrier into the lab), dimming toward a specimen tone
    const cs = cellSink(t), [kx, ky, kr] = KITHEART.map((v, i) => (i === 2 ? 660 * .27 : v)), cx = lerp(kx, d.x + CANC.x, cs), cy = lerp(ky, d.y + CANC.y, cs), cr = lerp(kr, CANC.r, cs);
    if (k > 0) {
      ctx.save(); ctx.globalAlpha *= clamp(k * 3);   // the dark room settles over the glass first (no one-frame swap)
      // the room (opaque), then darkness lifting from it (objects rise from dark, never translucent)
      ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, P.night0], [.5, mixHex(P.night1, MINT.deep, .2)], [.66, mixHex(P.night1, MINT.deep, .28)], [1, P.night0]]); ctx.fillRect(0, 0, w, h);
      halo(ctx, d.x - 10, 150, 330, .3, MINT.halo, MINT.body);
      ctx.fillStyle = mixHex(P.night0, P.ind2, .55); ctx.fillRect(60, 196, 560, 7);   // shelf + flasks
      for (let j = 0; j < 9; j++) { const fx = 80 + j * 60 + (j % 3) * 7, fh = 26 + (j % 4) * 9; ctx.fillStyle = mixHex(P.ind1, MINT.deep, .25 + .1 * (j % 2)); ctx.beginPath(); ctx.moveTo(fx - 4, 196 - fh); ctx.lineTo(fx + 4, 196 - fh); ctx.lineTo(fx + 4, 196 - fh * .55); ctx.lineTo(fx + 12, 196); ctx.lineTo(fx - 12, 196); ctx.lineTo(fx - 4, 196 - fh * .55); ctx.closePath(); ctx.fill(); }
      ctx.strokeStyle = mixHex(P.night0, P.ind2, .7); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(d.x - 10, 0); ctx.lineTo(d.x - 10, 92); ctx.stroke();   // the lamp
      ctx.fillStyle = mixHex(P.night0, P.ind2, .7); ctx.beginPath(); ctx.moveTo(d.x - 44, 120); ctx.lineTo(d.x + 24, 120); ctx.lineTo(d.x + 2, 92); ctx.lineTo(d.x - 22, 92); ctx.closePath(); ctx.fill();
      ctx.fillStyle = rgba(MINT.core, .8); ctx.fillRect(d.x - 40, 119, 60, 3);
      // the scientist (indigo, faces the screen), breathing; leans in when the designs appear
      const lean = .05 * smooth(span(t, a.ai, a.ai + 1.2)) - .03 * smooth(span(t, a.oneNew + .4, a.better + .8));
      E.person(ctx, LAB.sci.x, B + 90, LAB.sci.h, { dir: -1, long: true, look: .15 + .05 * Math.sin(t * .6), lean: lean + .01 * Math.sin(t * .8), light: -1, back: .55, rim: MINT.line, armR: [.5, .9], armL: [-.3, -.4] });
      // the screen on its arm (cool: the machine proposes)
      const sc = LAB.scr;
      ctx.fillStyle = mixHex(P.night0, P.ind2, .6); ctx.fillRect(sc.x + sc.w / 2 - 4, sc.y + sc.h, 8, B - sc.y - sc.h); rr(ctx, sc.x - 6, sc.y - 6, sc.w + 12, sc.h + 12, 6); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.rect(sc.x, sc.y, sc.w, sc.h); ctx.clip(); ctx.fillStyle = lin(ctx, 0, sc.y, 0, sc.y + sc.h, [[0, mixHex(P.ind1, COOL.deep, .6)], [1, P.night1]]); ctx.fillRect(sc.x, sc.y, sc.w, sc.h);
      ctx.translate(sc.x, sc.y); variants(ctx, t, sc.w, sc.h); ctx.restore();
      halo(ctx, sc.x + sc.w / 2, sc.y + sc.h / 2, 160, .14, COOL.halo, COOL.body);
      // the bench
      ctx.fillStyle = lin(ctx, 0, B, 0, B + 12, [[0, mixHex(P.ind2, MINT.deep, .35)], [1, P.night1]]); ctx.fillRect(0, B, w, 12);
      ctx.fillStyle = lin(ctx, 0, B + 12, 0, h, [[0, mixHex(P.night1, P.ind1, .4)], [1, P.night0]]); ctx.fillRect(0, B + 12, w, h - B - 12);
      ctx.fillStyle = rgba(MINT.line, .35); ctx.fillRect(0, B, w, 1.5);
      // the dish on its light stand (round, upright: a lit stage)
      ctx.fillStyle = mixHex(P.night0, P.ind2, .6); ctx.fillRect(d.x - 10, d.y + d.r - 4, 20, B - d.y - d.r + 4); ctx.fillRect(d.x - 40, B - 6, 80, 6);
      ctx.fillStyle = rad(ctx, d.x, d.y, d.r, [[0, mixHex(P.night1, MINT.deep, .6)], [.8, mixHex(P.night1, MINT.deep, .4)], [1, mixHex(P.night1, MINT.body, .45)]]); ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, TAU); ctx.fill();
      ctx.strokeStyle = rgba(MINT.line, .7); ctx.lineWidth = 2; ctx.stroke();
      // the lid waits on the bench (edge-on); later it rises and closes over the dish
      const lu = lidU(t), ll = lidLift(t);
      if (ll < .3) {
        ctx.save(); ctx.globalAlpha *= 1 - span(ll, 0, .3);
        const lx = lerp(LAB.lid.x, d.x, lu), ly = lerp(LAB.lid.y, d.y, lu), ry = lerp(5, d.r + 4, lu);
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(P.cream, .07 + .03 * lu); ctx.beginPath(); ctx.ellipse(lx, ly, d.r + 4, ry, 0, 0, TAU); ctx.fill(); ctx.restore();
        ctx.strokeStyle = rgba(P.cream, .55); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(lx, ly, d.r + 4, ry, 0, 0, TAU); ctx.stroke();
        if (lu > .5) { ctx.strokeStyle = rgba(P.cream, .5 * span(lu, .5, 1)); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(lx, ly, d.r - 6, ry - 10, 0, -2.6, -1.7); ctx.stroke(); }
        ctx.restore();
      }
      ctx.fillStyle = rgba(P.night0, .96 * (1 - k)); ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }
    // the cells (above the dark: the cell is the carrier, it is never hidden)
    ctx.save(); if (k > 0) { ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip(); }
    F.cell(ctx, t, cx, cy, cr, { seed: 54, relic: .55 * cs, breath: .02 });
    const im = immuneIn(t);
    if (im > 0 && lidLift(t) < 1) {
      const [ix, iy] = immunePos(t);
      ctx.save(); ctx.beginPath(); ctx.arc(d.x, d.y, d.r - 1, 0, TAU); ctx.clip();
      immuneCell(ctx, t, d.x + ix + (1 - im) * -30, d.y + iy, 19, hooksN(t), sproutOf(t), { a: im, rot: .25 * Math.sin(t * .4) });
      const touch = bump(t, a.hook + .05, .9); if (touch > 0) halo(ctx, d.x + CANC.x - CANC.r, d.y + CANC.y, 26, .5 * touch, MINT.halo, MINT.core);
      ctx.restore();
    }
    ctx.restore();
  }
  const cancerLabel = (t) => ({ in: sineIO(span(t, a.lab + .2, a.lab + 1.4)), home: sineIO(span(t, a.then + .2, a.then + 1.5)) });
  const LBL1 = { x: 1440, y: 64, s: .5 };
  function labelFromPlaque(ctx, t, c, i, tgt, u, home, o) {
    if (u <= 0 || home >= 1) return;
    const p = proj(c, PQ[i].x - PQ[i].s / 2, PQ[i].y - PQ[i].h / 2); if (!p) return;
    const s0 = PQ[i].s * p[2] / F.DATES.w, m = u * (1 - home);
    const x = lerp(p[0], tgt.x, m), y = lerp(p[1], tgt.y, m), s = lerp(s0, tgt.s, m);
    ctx.save(); screen(ctx); ctx.globalAlpha *= span(m, 0, .25);
    const r = F.twoDates(ctx, t, x, y, s, o);
    if (r && o.fill > 0) {   // FOUND fills a little (the first date gets closer, still in the lab)
      const sl = r.slot, fw = sl.w * clamp(o.fill);
      ctx.fillStyle = rgba(MINT.deep, .75); rr(ctx, sl.x, sl.r1 - sl.h / 2, fw, sl.h, 6 * s); ctx.fill();
      ctx.fillStyle = rgba(MINT.ink, .9); ctx.fillRect(sl.x + fw - 2 * s, sl.r1 - sl.h / 2 + 4 * s, 3 * s, sl.h - 8 * s);
    }
    ctx.restore();
  }
  const foundFill = (t) => .3 * smooth(span(t, a.found - .1, a.closer + .4)) + .28 * smooth(span(t, a.better - .1, a.better + .9));

  // ---------------------------------------------------------------- 2.08–2.09 the scans, the capsule, 55 patients
  const SA = { x: 740, y: 586, w: 420, h: 336 }, SB = { x: 1240, y: 586 };
  const capM = (t) => sineIO(span(t, a.pill - .25, a.pill + 1.0));
  const CAP = { y: 312, hw: 116, h: 92 };
  const GROUPS = [7, 6, 5, 5, 4, 4, 5, 4, 4, 4, 4, 3];   // 55 patients in 12 cancer types (FDA, larotrectinib)
  const PEOPLE = (() => {
    const out = []; let g0 = 0;
    GROUPS.forEach((n, g) => { const gx = 360 + g * 109; for (let m = 0; m < n; m++) { const row = m < Math.ceil(n / 2) ? 0 : 1, col = row ? m - Math.ceil(n / 2) : m, nr = row ? n - Math.ceil(n / 2) : Math.ceil(n / 2);
      out.push({ x: gx + (col - (nr - 1) / 2) * 24 + row * 6, y: 760 - row * 30, h: row ? 42 : 48, g, k: g0 + m }); } g0 += n; });
    const r = prng(5555), idx = out.map((_, i) => i); for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    idx.slice(0, 41).forEach((i) => { out[i].lit = true; });   // 75 % responded = 41 of 55
    return out.sort((p, q) => p.y - q.y);
  })();
  const out209 = (t) => smooth(span(t, a.notOne - .7, a.notOne + .25));
  function scansAndPill(ctx, t, c) {
    const ll = lidLift(t), cm = capM(t), o9 = out209(t); if (ll <= 0 || o9 >= 1) return;
    // A: the lid (projected) → scan A → left half of the capsule
    const dp = proj(c, ...toV1(LAB.dish.x, LAB.dish.y)), r0 = (LAB.dish.r + 4) * (dp ? dp[2] : 1);
    const ax = lerp(dp ? dp[0] : SA.x, SA.x, ll), ay = lerp(dp ? dp[1] : SA.y, SA.y, ll), aw = lerp(2 * r0, SA.w, ll), ah = lerp(2 * r0, SA.h, ll), arr = lerp(r0, 14, ll);
    const bs = sineIO(span(t, a.scan - .25, a.scan + .9)), tb = lerp(1, .3, sineIO(span(t, a.shrinks - .15, a.shrinks + 1.0)));
    ctx.save(); float(ctx, t, 1.6 * ll * (1 - cm) + 1.1 * cm);
    // WEEKS: a mint arc from scan A over to scan B (it fades as the scans fold)
    const wu = span(t, a.weeks - .1, a.weeks + .8), wa = 1 - span(cm, 0, .35);
    if (wu > 0 && bs > .9 && wa > 0) { const pts = []; for (let i = 0; i <= 24; i++) { const v = i / 24; pts.push([lerp(SA.x + 60, SB.x - 60, v), SA.y - SA.h / 2 - 14 - 70 * Math.sin(Math.PI * v)]); }
      ctx.save(); ctx.globalAlpha *= wa; F.mintSpan(ctx, pts, 0, sineIO(wu), { w: 2.6 }); ctx.restore();
      maskLine(ctx, [['WEEKS', 0]], (SA.x + SB.x) / 2, SA.y - SA.h / 2 - 100, 24, rise(span(wu, .4, 1)) * wa, { serif: false, weight: 600, align: 'center', col: MINT.text, glow: false }); }
    if (cm <= 0) {
      if (bs > 0) scanCard(ctx, t, lerp(SA.x, SB.x, bs), SB.y, SA.w, SA.h, 14, { tumor: tb, ghost: tb < .99, a: span(bs, 0, .2) });
      const lidLook = 1 - span(ll, .3, .8);
      scanCard(ctx, t, ax, ay, aw, ah, arr, { a: span(ll, 0, .3), tumor: 1, inner: span(ll, .5, 1), fill: mixHex(mixHex(P.night1, MINT.deep, .3), mixHex(P.night0, P.ind0, .45), 1 - lidLook) });
    } else {
      // the two scans fold into one capsule (left half cream, right half mint)
      const hwid = lerp(SA.w, CAP.hw, cm), hh = lerp(SA.h, CAP.h, cm), rad0 = lerp(14, CAP.h / 2, cm);
      const lx = lerp(SA.x, W / 2 - CAP.hw / 2, cm), rx = lerp(SB.x, W / 2 + CAP.hw / 2, cm), y = lerp(SA.y, CAP.y, cm) - 30 * o9;
      ctx.globalAlpha *= 1 - o9;
      if (cm > .6) halo(ctx, W / 2, y, 260, .3 * span(cm, .6, 1) + .12 * bump(t, a.most, 1.6), MINT.halo, MINT.body);
      rr4(ctx, lx - hwid / 2, y - hh / 2, hwid, hh, [rad0, lerp(14, 0, cm), lerp(14, 0, cm), rad0]); ctx.fillStyle = mixHex(mixHex(P.night0, P.ind0, .45), mixHex(P.cream, '#e3dcc0', .45), cm); ctx.fill();
      rr4(ctx, rx - hwid / 2, y - hh / 2, hwid, hh, [lerp(14, 0, cm), rad0, rad0, lerp(14, 0, cm)]); ctx.fillStyle = mixHex(mixHex(P.night0, P.ind0, .45), MINT.body, cm); ctx.fill();
      ctx.strokeStyle = rgba(P.cream, .5); ctx.lineWidth = 2; rr(ctx, W / 2 - hwid, y - hh / 2, hwid * 2, hh, rad0); ctx.stroke();
      if (cm > .7) { ctx.strokeStyle = rgba(P.cream, .6 * span(cm, .7, 1)); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(W / 2 - CAP.hw * .7, y - CAP.h * .28); ctx.lineTo(W / 2 + CAP.hw * .5, y - CAP.h * .28); ctx.stroke(); }
      if (cm < .5) { const f0 = mixHex(P.night0, P.ind0, .45);
        scanCard(ctx, t, lx, y, hwid, hh, rad0, { tumor: 1, inner: 1 - cm * 2, fill: mixHex(f0, mixHex(P.cream, '#e3dcc0', .45), cm) });
        scanCard(ctx, t, rx, y, hwid, hh, rad0, { tumor: tb, ghost: true, inner: 1 - cm * 2, fill: mixHex(f0, MINT.body, cm) }); }
      maskLine(ctx, [['LAROTRECTINIB', 0]], W / 2, y - CAP.h / 2 - 36, 34, rise(span(t, a.pill + .7, a.pill + 1.4)), { serif: false, weight: 600, align: 'center', col: P.cream, glow: false, spacing: .14 });
      // the steep lane from 1.04, small, beside the capsule: it flashes on "Most of them responded"
      const lu = rise(span(t, a.approval, a.approval + .7)), lr = { x: 1196, y: 262, w: 300, h: 100 };
      if (lu > 0) { ctx.save(); ctx.globalAlpha *= lu; rr(ctx, lr.x, lr.y, lr.w, lr.h, 8); ctx.fillStyle = rgba(mixHex(P.night1, P.ind2, .55), .9); ctx.fill(); ctx.strokeStyle = rgba(P.cream, .3); ctx.lineWidth = 1.5; ctx.stroke();
        const py = lr.y + 24, base = lr.y + lr.h - 18; ctx.setLineDash([6, 6]); ctx.strokeStyle = rgba(P.cream, .5); ctx.beginPath(); ctx.moveTo(lr.x + 14, py); ctx.lineTo(lr.x + lr.w - 14, py); ctx.stroke(); ctx.setLineDash([]);
        const pts = [0, .2, .5, .95, 1].map((v, j) => [lr.x + 36 + j * 40, base - v * (base - py)]); F.mintSpan(ctx, pts, 0, sineIO(span(t, a.approval + .2, a.approval + 1.2)), { w: 2.6 });
        const fl = bump(t, a.most - .05, 1.4); if (fl > 0) halo(ctx, pts[3][0], py, 90, .7 * fl, MINT.halo, MINT.core);
        F.stampMark(ctx, t, pts[3][0] - 22, py - 13, 44, 26, span(t, a.approval + 1.0, a.approval + 1.5)); ctx.restore(); }
      // 55 patients in 12 groups, rising from a floor line; 41 light mint in a wave on "Most of them responded"
      const fu = span(t, a.p55 - .45, a.p55 + .3); if (fu > 0) { ctx.fillStyle = rgba(P.cream, .22); ctx.fillRect(W / 2 - 640 * fu, 762 + 30 * o9, 1280 * fu, 1.5); }
      for (const pp of PEOPLE) {
        const tk = a.p55 - .1 + pp.g * .07 + (pp.k % 7) * .025, e = rise(span(t, tk, tk + .45)); if (e <= 0) continue;
        const lit = pp.lit ? smooth(span(t, a.most + .05 + (pp.x - 300) / 1300 * .7, a.most + .45 + (pp.x - 300) / 1300 * .7)) : 0;
        patient(ctx, pp.x, pp.y + (1 - e) * 16 + 30 * o9, pp.h, lit, e, .3);
      }
      for (let g = 0; g < 12; g++) { const e = rise(span(t, a.many - .2 + g * .05, a.many + .4 + g * .05)); if (e > 0) { ctx.fillStyle = rgba(P.halo2, .55 * e); ctx.fillRect(360 + g * 109 - 26, 772 + 30 * o9, 52 * e, 2); } }
      const ty = 838 + 30 * o9;
      const m1 = maskLine(ctx, [['55 PATIENTS', 0]], 334, ty, 27, rise(span(t, a.p55 + .2, a.p55 + .9)), { serif: false, weight: 600, col: P.cream, glow: false, spacing: .12 });
      maskLine(ctx, [['·  12 CANCER TYPES', 0]], 334 + (m1?.w ?? 230) + 20, ty, 27, rise(span(t, a.many + .1, a.many + .8)), { serif: false, weight: 600, col: P.cream, glow: false, spacing: .12 });
      F.mintText(ctx, [['75 % RESPONDED', 1]], 1590, ty, 27, rise(span(t, a.most + .5, a.most + 1.2)), { serif: false, weight: 600, align: 'right', spacing: .12 });
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------- 2.10 more than a hundred
  const lift210 = (t) => sineIO(span(t, a.notOne - .05, a.notOne + 1.2));
  const SPLIT = a.hundred - .9;
  const CELLS = (() => { const r = prng(1001), out = []; let guard = 0;
    while (out.length < 112 && guard++ < 5000) { const u = r() * 2 - 1, v = r() * 2 - 1; if (u * u + v * v > 1) continue; const x = 1010 + u * 800, y = 540 + v * 300;
      if (x < 560 && y < 400) continue; if (y > 815 || y < 120 || x < 120 || x > 1820) continue; if (out.some((p) => Math.hypot(p.x - x, p.y - y) < 54)) continue;
      out.push({ x, y, r: 13 + r() * 15, v: Math.floor(r() * 24), tone: r(), rot: r() * TAU, sx: .75 + r() * .5, d: Math.hypot(x - 980, y - 540) / 900 * .7, ph: r() * TAU }); }
    return out; })();
  const HOOKS = CELLS.filter((_, i) => i % 9 === 4).slice(0, 11).map((p, j) => { const ang = Math.atan2(p.y - 540, p.x - 980) + (j % 2 ? .5 : -.5); return { p, ang, t0: j * .07 }; });
  function hundred(ctx, t, c) {
    const lf = lift210(t), gone = span(t, a.own - .7, a.own + .3); if (lf <= 0 || gone >= 1) return;
    ctx.save(); float(ctx, t, lf);
    const sp = span(t, SPLIT, SPLIT + .6);
    // the one cell: out of vitrine 1 into the middle, then it splits
    if (sp < 1) {
      const p = proj(c, V1.cx, V1.y + 690 * .47), R0 = 660 * .27 * (p ? p[2] : 1);
      const x = lerp(p ? p[0] : 960, 980, lf), y = lerp(p ? p[1] : 500, 540, lf), R = lerp(R0, 150, lf) * (1 - .8 * sp);
      F.cell(ctx, t, x, y, R, { seed: 54, a: smooth(clamp(lf * 2.5)) * (1 - sp), breath: .03 });
    }
    // more than a hundred kinds (a different shape each), they fly out from the middle
    const fb = span(t, a.fight - .45, a.fight + 1.4);
    for (const [i, q] of CELLS.entries()) {
      const u = expoOut(span(t, SPLIT + q.d, SPLIT + q.d + 1.0)); if (u <= 0) continue;
      let x = lerp(980, q.x, u) + 4 * Math.sin(t * .5 + q.ph), y = lerp(540, q.y, u) + 4 * Math.cos(t * .4 + q.ph), sx = q.sx, sy = 1 / q.sx;
      const hk = HOOKS.find((h) => h.p === q);
      if (hk) { const dg = smooth(span(fb, .25 + hk.t0, .6 + hk.t0)); x += Math.cos(hk.ang + Math.PI / 2) * 34 * dg; y += Math.sin(hk.ang + Math.PI / 2) * 34 * dg; sx *= 1 + .35 * bump(fb, .25 + hk.t0, .5); sy *= 1 - .25 * bump(fb, .25 + hk.t0, .5); }
      const sh = 1 - gone * (.6 + .4 * ((i % 5) / 5));
      blob(ctx, x, y, q.r * lerp(.3, 1, u) * sh, q.v, { rot: q.rot + t * .05 * (i % 2 ? 1 : -1), sx, sy, col: mixHex(RELIC.body, MINT.body, q.tone * .6), a: (1 - gone) });
    }
    // they fight back: hooks fly at a few of them and miss
    if (fb > 0 && fb < 1) for (const h of HOOKS) {
      const u = span(fb, h.t0, h.t0 + .75); if (u <= 0 || u >= 1) continue;
      const tx = h.p.x, ty = h.p.y, sx0 = tx - Math.cos(h.ang) * 420, sy0 = ty - Math.sin(h.ang) * 420, e = sineIO(u);
      const x = lerp(sx0, tx + Math.cos(h.ang) * 120, e), y = lerp(sy0, ty + Math.sin(h.ang) * 120, e);
      ctx.save(); ctx.globalAlpha *= Math.sin(Math.PI * u); immuneCell(ctx, t, x, y, 8, 6, () => 1, { rot: h.ang }); ctx.restore();
    }
    maskLine(ctx, [['100+ TYPES OF CANCER', 0]], 980, 846, 34, rise(span(t, a.hundred - .1, a.hundred + .6)) * (1 - expoIn(span(t, a.own - .7, a.own))), { serif: false, weight: 600, align: 'center', col: P.cream, glow: false, spacing: .12 });
    ctx.restore();
  }

  // ---------------------------------------------------------------- 2.11–2.13 the readable small print, "most", the wall text
  const K5 = ['“It would not be surprising if an assortment', 'of rare, difficult malignancies persists.”'];
  function k5(ctx, t) {
    const out = expoIn(span(t, a.line, a.line + .55));
    for (let i = 0; i < 2; i++) { const u = rise(span(t, a.some - .45 + i * .35, a.some + .3 + i * .35)) * (1 - out); if (u <= 0) continue;
      ctx.save(); float(ctx, t, .8); maskLine(ctx, [[K5[i], 0]], 600, 712 + i * 56, 44, u, { glow: false, col: P.cream }); ctx.restore(); }
  }
  const unfold = (t) => sineIO(span(t, a.line + .8, a.line + 1.9)) * (1 - sineIO(span(t, a.soCancer + .35, a.soCancer + 1.6)));
  const WT = { x: 4990, y: 360, w: 1260, size: 76 }, FR = S.frameRect();
  const caretX = WT.x + measure('“', WT.size, true);
  function wall(ctx, t) {
    const w = unfold(t); if (w <= 0) return;
    const bc = [WT.x + WT.w / 2, WT.y + 90], fc = [FR.x + FR.w / 2, FR.y + FR.h / 2], k = lerp(.42, 1, w);
    ctx.save(); ctx.translate(lerp(fc[0], bc[0], w), lerp(fc[1], bc[1], w)); ctx.scale(k, k); ctx.translate(-bc[0], -bc[1]); ctx.globalAlpha *= span(w, .15, .7);
    F.wallText(ctx, t, T, { id: 'C1', x: WT.x, y: WT.y, w: WT.w, size: WT.size, read: false, credit: 1, hi: [['Cancer', a.cancerW - .25]] });
    const cu = span(t, a.line + 1.85, a.line + 2.25);   // the gap: a thin mint caret before "Cancer"
    if (cu > 0) { ctx.fillStyle = rgba(MINT.ink, .9 * cu); ctx.fillRect(caretX - 6, WT.y - WT.size * .78, 3, WT.size * .92 * cu); }
    ctx.restore();
  }
  // the lens shows "most" in the kit's light mint (low contrast on paper): re-ink it deep mint, where the kit sets it
  function lensMost(ctx, t, c) {
    const L = lensOf(t); if (!L || !L.hi || essayOpen(t) <= .5) return;
    const lr = L.r * ES.w * expoOut(clamp(L.u)), fs = lr * .26 * (L.size ?? 1), lx = ES.x + L.x * ES.w, ly = ES.y + L.y * ES.w;
    const y = ly + .5 * fs * 1.25 + fs * .35, x = lx - measure(L.text[1], fs, true) / 2, p = proj(c, x, y); if (!p) return;
    ctx.save(); screen(ctx); ctx.globalAlpha *= clamp(L.u * 1.5) * (1 - sineIO(span(t, a.line + .8, a.line + 1.1)));
    E.glowText(ctx, 'most', p[0], p[1], { size: fs * p[2], serif: true, col: MINT.deep, glow: false }); ctx.restore();
  }
  function mostWord(ctx, t, c) {
    const fl = sineIO(span(t, a.line + .8, a.line + 2.0)), w = unfold(t); if (fl <= 0 || w <= .02) return;
    const L = lensOf(a.line + .1) || { x: .25, y: .02 }, lp = proj(c, ES.x + L.x * ES.w, ES.y + L.y * ES.w + 12), gp = proj(c, caretX - 2, WT.y - WT.size - 18);
    if (!lp || !gp) return;
    const x = lerp(lp[0], gp[0], fl), y = lerp(lp[1], gp[1], fl) - 120 * Math.sin(Math.PI * fl), size = lerp(40, 46 * gp[2], fl), arrived = span(fl, .85, 1);
    ctx.save(); screen(ctx); ctx.globalAlpha *= span(w, .5, .9);
    if (arrived > 0) { ctx.setLineDash([5, 5]); ctx.strokeStyle = rgba(MINT.line, .6 * arrived); ctx.lineWidth = 1.6; const mw = measure('most', size, true); rr(ctx, x - mw / 2 - 10, y - size * .82, mw + 20, size * 1.1, 6); ctx.stroke(); ctx.setLineDash([]); }
    F.mintText(ctx, [['most', 1 - .5 * arrived]], x, y, size, 1, { align: 'center' });
    ctx.restore();
  }

  // ---------------------------------------------------------------- 3.01–3.05 the heart room inside vitrine 2, the band, DNA, the path
  const heartMix = (t) => smooth(span(t, a.heart - .4, a.heart + .9));
  const heartBack = (t) => sineIO(span(t, a.soHeart + .15, a.soHeart + 1.7));          // the heart returns to its place in the vitrine
  const heartLift = (t) => sineIO(span(t, a.whether + .1, a.whether + 1.5)) * (1 - heartBack(t));
  const roomA = (t) => heartMix(t) * (1 - smooth(span(t, a.soHeart - .2, a.soHeart + 1.0)));
  const bagDown = (t) => sineIO(span(t, a.recent - .1, a.infusion + .3));
  const dropU = (t) => span(t, a.infusion + .4, a.switched + .1);
  const switchU = (t) => sineIO(span(t, a.switched + .15, a.switched + .6));
  const ldl = (t) => ({ u: rise(span(t, a.dose - .35, a.dose + .4)), lvl: lerp(1, .5, sineIO(span(t, a.half - .1, a.half + 1.1))) });
  function heartRoom(ctx, t, w, h) {
    const m = heartMix(t), ra = roomA(t), hb = heartBack(t), hl = heartLift(t);
    const [hx, hy, hs] = [lerp(KITHEART[0], HR.heart[0], m), lerp(KITHEART[1], HR.heart[1], m), lerp(KITHEART[2], HR.heart[2], m)];
    const [kx, ky, ks] = KITHEART, x = lerp(hx, kx, hb), y = lerp(hy, ky, hb), s = lerp(hs, ks, hb);
    if (ra > 0) {
      ctx.save(); ctx.globalAlpha *= ra;
      const [lx, ly] = HR.liver, lg = sineIO(span(t, a.heart + .3, a.heart + 1.5));
      // the vessel heart → liver, a slow pulse running along it
      const vp = [[hx + hs * .55, hy + hs * .2], [hx + hs * 1.3, hy + hs * .9], [lx - 120, ly + 40], [lx - 70, ly + 10]];
      F.mintSpan(ctx, E.catmull(vp, 8), 0, lg, { w: 4, a: .7, spark: false });
      const pu = ((t * .35) % 1); if (lg >= 1) { const q = E.catmull(vp, 8), i = Math.floor(pu * (q.length - 1)); halo(ctx, q[i][0], q[i][1], 14, .4, MINT.halo, MINT.core); }
      if (lg > 0) { ctx.save(); ctx.translate(lx, ly); ctx.scale(200 * lg, 200 * lg); halo(ctx, 0, 0, .9, .22, MINT.halo, MINT.body);
        ctx.fillStyle = rad(ctx, -.15, -.15, .7, [[0, rgba(MINT.core, .85)], [.6, rgba(MINT.body, .7)], [1, rgba(MINT.deep, .6)]]); ctx.fill(LIVER); ctx.strokeStyle = rgba(MINT.core, .6); ctx.lineWidth = .01; ctx.stroke(LIVER); ctx.restore(); }
      // the gene switch in the liver: a short strand and a toggle that flips OFF
      const gs = span(t, a.recent, a.recent + .8);
      if (gs > 0) {
        const sx = lx - 8, sy = ly - 6, sw = switchU(t);
        ctx.save(); ctx.globalAlpha *= gs;
        for (let j = 0; j < 2; j++) { ctx.strokeStyle = rgba(mixHex(P.night1, j ? MINT.deep : P.ind2, .3 + .4 * sw), .9); ctx.lineWidth = 2.4; ctx.beginPath(); for (let i = 0; i <= 20; i++) { const v = i / 20; ctx.lineTo(sx - 36 + v * 50, sy - 26 + (j ? -1 : 1) * 6 * Math.sin(v * TAU * 1.5 + t * .6)); } ctx.stroke(); }
        rr(ctx, sx + 22, sy - 34, 34, 16, 8); ctx.fillStyle = mixHex(P.night1, P.ind2, .5); ctx.fill(); ctx.strokeStyle = rgba(P.cream, .7); ctx.lineWidth = 1.4; ctx.stroke();
        ctx.fillStyle = mixHex(P.cream, P.blue1, sw); ctx.beginPath(); ctx.arc(lerp(sx + 48, sx + 30, sw), sy - 26, 6, 0, TAU); ctx.fill();
        const fl = bump(t, a.switched + .4, 1.0); if (fl > 0) halo(ctx, sx + 39, sy - 26, 40, .6 * fl, MINT.halo, MINT.core);
        ctx.restore();
      }
      // the infusion bag lowers from above the glass; ONE drop runs down its line into the liver
      const bd = bagDown(t);
      if (bd > 0) {
        const [bx, by0] = HR.bag, by = lerp(-150, by0, bd);
        ctx.strokeStyle = rgba(P.cream, .45); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(bx, -20); ctx.lineTo(bx, by - 46); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx, by + 52); ctx.bezierCurveTo(bx, by + 140, lx + 40, ly - 120, lx + 18, ly - 40); ctx.stroke();
        rr(ctx, bx - 32, by - 46, 64, 98, 18); ctx.fillStyle = rgba(mixHex(P.cream, MINT.line, .3), .16); ctx.fill(); ctx.strokeStyle = rgba(P.cream, .7); ctx.lineWidth = 1.8; ctx.stroke();
        ctx.fillStyle = rgba(MINT.body, .45); rr(ctx, bx - 26, by - 6 - 30 * (1 - span(dropU(t), 0, .3) * .3), 52, 52, 12); ctx.fill();
        const du = dropU(t);
        if (du > 0 && du < 1) { const q = [[bx, by + 54], [bx, by + 110], [lx + 40, ly - 110], [lx + 18, ly - 40]], cc = E.catmull(q, 10), i = Math.min(cc.length - 1, Math.floor(sineIO(du) * (cc.length - 1)));
          halo(ctx, cc[i][0], cc[i][1], 20, .6, MINT.halo, MINT.core); ctx.fillStyle = MINT.core; ctx.beginPath(); ctx.arc(cc[i][0], cc[i][1], 4.5, 0, TAU); ctx.fill(); }
      }
      // the LDL column: a glass tube, cream-grey (bad cholesterol), sinks to half; the old level stays as a dashed mark
      const L = ldl(t), lf = 1 - smooth(span(t, a.oneT + .3, a.oneT + 1.4));
      if (L.u > 0 && lf > 0) { ctx.save(); ctx.globalAlpha *= lf;
        const cx = HR.col.x, y0 = HR.col.y0, y1 = HR.col.y1, hh = (y1 - y0) * L.u;
        ctx.strokeStyle = rgba(P.cream, .6); ctx.lineWidth = 2; rr(ctx, cx - 22, y1 - hh, 44, hh, [22, 22, 6, 6]); ctx.stroke();
        const lv = (y1 - y0 - 16) * L.lvl * L.u; ctx.fillStyle = mixHex(RELIC.body, P.blue1, .35); rr(ctx, cx - 18, y1 - 4 - lv, 36, lv, 5); ctx.fill();
        if (L.lvl < .99) { ctx.setLineDash([5, 4]); ctx.strokeStyle = rgba(P.cream, .55); ctx.beginPath(); ctx.moveTo(cx - 30, y0 + 12); ctx.lineTo(cx + 30, y0 + 12); ctx.stroke(); ctx.setLineDash([]); }
        ctx.restore();
      }
      ctx.restore();
    }
    if (hl < .999) F.specimen(ctx, t, 'heart', x, y, s, { seed: 55, a: 1 - hl });
  }
  // screen-space band (3.04) → DNA (3.05) → path → the stadium track (3.06)
  const bandU = (t) => sineIO(span(t, a.oneT - .1, a.oneT + 1.5));
  const twist = (t) => smooth(span(t, a.dna - .1, a.dna + 1.0)) * (1 - smooth(span(t, a.regulators - .1, a.regulators + .9)));
  const widen = (t) => smooth(span(t, a.regulators, a.regulators + 1.0));
  const toTrack = (t) => sineIO(span(t, a.whether - .15, a.whether + 1.3));
  const BY = 792, BX0 = 580, BX1 = 1860, ST = { x: 1080, y: 540 };
  function band(ctx, t, c) {
    const u = bandU(t), tt = toTrack(t), col = span(t, a.soHeart - .2, a.soHeart + 1.2); if (u <= 0 || col >= 1) return;
    const lp = proj(c, ...toV2(HR.liver[0], HR.liver[1] + 40)); if (!lp) return;
    ctx.save(); float(ctx, t, .9 * (1 - tt) + stK(t) * tt);
    const tw = twist(t), wd = widen(t);
    // the band: down from the liver, then right (it runs on); its points morph onto the stadium track
    const N = 90, pts = [], pts2 = [];
    const trackR = (1 - col) * 320, trackRy = trackR * .37;
    for (let i = 0; i <= N; i++) {
      const v = i / N, bx = lerp(BX0, BX1, v), by = BY;
      const ang = Math.PI / 2 + v * TAU, ex = ST.x + Math.cos(ang) * trackR, ey = ST.y + Math.sin(ang) * trackRy;
      const off = tw * 20 * Math.sin(v * TAU * 6 - t * .8) * span(v, .08, .2) * (1 - span(v, .75, .9));
      pts.push([lerp(bx, ex, tt), lerp(by + off, ey, tt)]); pts2.push([lerp(bx, ex, tt), lerp(by - off, ey, tt)]);
    }
    const lead = [[lp[0], lp[1]], [lp[0], lerp(lp[1], BY, .6)], [BX0, BY]];
    if (tt < .5) F.mintSpan(ctx, lead, 0, clamp(u * 2.5), { w: 4, a: 1 - tt * 2, spark: false });
    const ua = clamp(u * 1.35 - .35);
    if (wd > 0 && tt < 1) { ctx.fillStyle = rgba(mixHex(P.blue1, MINT.deep, .4), .35 * wd * (1 - tt)); ctx.fillRect(BX0, BY - 18 * wd, (BX1 - BX0) * ua, 36 * wd); }
    if (ua > 0) F.mintSpan(ctx, pts, 0, ua, { w: lerp(4, 3, tt), a: 1 - col, spark: ua < 1 });
    if (tw > 0) { F.mintSpan(ctx, pts2, 0, ua, { w: 3, a: tw, spark: false });
      ctx.strokeStyle = rgba(MINT.line, .45 * tw); ctx.lineWidth = 1.5; for (let i = 8; i < 70; i += 2) { ctx.beginPath(); ctx.moveTo(...pts[i]); ctx.lineTo(...pts2[i]); ctx.stroke(); } }
    // the lasting mark on the DNA (stays through the path, becomes a tick on it)
    const mk = span(t, a.forLife - .1, a.forLife + .6) * (1 - tt);
    if (mk > 0) { const p = pts[31]; halo(ctx, p[0], p[1], 34, .6 * mk, MINT.halo, MINT.core); ctx.fillStyle = rgba(MINT.core, mk); ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, TAU); ctx.fill(); }
    // years along the path: 15 ticks light up as the pair walks (no clock, a ruler of light)
    if (wd > 0 && tt < 1) {
      const walk = sineIO(span(t, a.regulators + .4, a.whether + .2)) * .92;
      for (let j = 0; j < 15; j++) { const v = .1 + j * .055, x = lerp(BX0, BX1, v), on = walk > v - .05 ? 1 : 0; ctx.fillStyle = rgba(on ? MINT.ink : P.blue1, (.5 + .5 * on) * wd * (1 - tt)); ctx.fillRect(x - 1.5, BY + 20, 3, 12); }
      const px = lerp(BX0, BX1, .06 + walk), ph = (t - a.regulators) * 4.2, pa = wd * (1 - span(tt, 0, .4));
      E.person(ctx, px, BY + 8 - 6 * tt, 74, { pose: 'walk', walk: ph, dir: 1, look: .1, light: 1, back: .6, rim: MINT.line, a: pa });
      E.person(ctx, px + 46, BY + 8 - 6 * tt, 84, { pose: 'walk', walk: ph + 1.4, dir: 1, long: true, look: -.05, light: 1, back: .6, rim: LAMP.body, a: pa });
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------- 3.06 the stadium ★ (thousands, seasons as light, one calm heart)
  const RINGS = (() => { const out = []; const r = prng(2756); for (let k = 0; k < 26; k++) { const rx = 350 + k * 14.5, ry = rx * .37, n = Math.floor(TAU * Math.sqrt((rx * rx + ry * ry) / 2) / 10.5), xs = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const ang = i / n * TAU + (k % 2) * .02; xs[i * 3] = Math.cos(ang) * rx; xs[i * 3 + 1] = Math.sin(ang) * ry; xs[i * 3 + 2] = r(); } out.push({ k, rx, ry, xs }); } return out; })();
  const fill306 = (t) => span(t, a.stadium - .9, a.stadium + 1.1);
  const fold307 = (t) => smooth(span(t, a.soHeart - .3, a.soHeart + 1.2));
  const stK = (t) => 1.2 * smooth(span(t, a.whether, a.stadium)) * (1 - fold307(t));
  const SEASON = [COOL.halo, MINT.halo, LAMP.body, mixHex(LAMP.deep, P.halo2, .5)];
  function stadium(ctx, t, c) {
    const f = fill306(t), fo = fold307(t); if (f <= 0 || fo >= 1) return;
    ctx.save(); float(ctx, t, stK(t));
    const cx = ST.x, cy = ST.y, sc = 1 - .85 * fo;
    // the bowl (dark terraces)
    ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc); ctx.globalAlpha *= (1 - fo) * span(f, 0, .3);
    ctx.fillStyle = rgba(mixHex(P.night1, P.ind2, .55), .9); ctx.beginPath(); ctx.ellipse(0, 0, 740, 740 * .37, 0, 0, TAU); ctx.ellipse(0, 0, 336, 336 * .37, 0, 0, TAU, true); ctx.fill('evenodd');
    ctx.fillStyle = rgba(mixHex(P.night1, MINT.deep, .25), .8); ctx.beginPath(); ctx.ellipse(0, 0, 300, 111, 0, 0, TAU); ctx.fill();
    // the crowd: thousands of small people (dots with a head) filling ring after ring
    const ph = (t - a.stadium) / 7;   // one turn of the seasons
    for (const R of RINGS) {
      const fk = span(f, R.k / 26 * .6, R.k / 26 * .6 + .4), n = R.xs.length / 3; if (fk <= 0) continue;
      for (let b = 0; b < 3; b++) {
        ctx.fillStyle = mixHex(P.blue1, mixHex(P.cream, P.halo2, .4), .15 + b * .22); ctx.beginPath();
        for (let i = 0; i < n; i++) { const r2 = R.xs[i * 3 + 2]; if ((r2 * 3 | 0) !== b || i / n > fk) continue; const x = R.xs[i * 3], y = R.xs[i * 3 + 1] - 1.5 * Math.max(0, Math.sin(t * 2 + r2 * 40)) * .4;
          ctx.rect(x - 1.3, y - 3.2, 2.6, 3.6); ctx.rect(x - .9, y - 5.4, 1.8, 1.8); }
        ctx.fill();
      }
    }
    // the seasons pass over them as light: a soft wash that moves round the bowl and changes its tone
    const sa = (Math.PI / 2 + ph * TAU), si = ((ph % 1) + 1) % 1 * 4, sc0 = SEASON[Math.floor(si) % 4], sc1 = SEASON[(Math.floor(si) + 1) % 4], scol = mixHex(sc0, sc1, si % 1);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.beginPath(); ctx.ellipse(0, 0, 745, 276, 0, 0, TAU); ctx.clip();
    ctx.fillStyle = rad(ctx, Math.cos(sa) * 520, Math.sin(sa) * 190, 520, [[0, rgba(scol, .2 * span(f, .3, 1))], [1, rgba(scol, 0)]]); ctx.fillRect(-760, -300, 1520, 600); ctx.restore();
    ctx.restore();
    // the heart (lifted out of vitrine 2) beats calmly in the middle of them
    ctx.restore();
  }
  function liftedHeart(ctx, t, c) {
    const hl = heartLift(t); if (hl <= 0) return;
    const hb = heartBack(t), p = proj(c, ...toV2(HR.heart[0], HR.heart[1])), q = proj(c, ...toV2(KITHEART[0], KITHEART[1]));
    const up = sineIO(span(t, a.whether + .1, a.whether + 1.5));
    let x = lerp(p ? p[0] : 960, ST.x, up), y = lerp(p ? p[1] : 540, ST.y - 10, up), s = lerp(HR.heart[2] * (p ? p[2] : 1), 74, up);
    if (hb > 0 && q) { x = lerp(ST.x, q[0], hb); y = lerp(ST.y - 10, q[1], hb); s = lerp(74, KITHEART[2] * q[2], hb); }
    ctx.save(); float(ctx, t, stK(t)); F.specimen(ctx, t, 'heart', x, y, s, { seed: 55 }); ctx.restore();
  }

  // ---------------------------------------------------------------- M.01 the doorway: a hospital corridor at night, a room, a bed, you
  const doorOpen = (t) => sineIO(span(t, a.chan - .2, a.chan + 1.8));
  const doorLit = (t) => smooth(span(t, a.chan - .9, a.chan + .7)) * (1 - smooth(span(t, a.subscribe + .1, tPlate - .35))) * (1 + .1 * Math.sin((t - a.want) * 2.2) * span(t, a.want - .5, a.want + .5));
  function corridor(ctx, t) {
    const op = doorOpen(t), lit = clamp(doorLit(t)); if (lit <= 0 && op <= 0) return;
    const x0 = DX - 120, y0 = 140, w = 240, hh = 500, ap = new Path2D(); ap.moveTo(x0, y0 + hh); ap.lineTo(x0, y0 + w / 2); ap.arc(x0 + w / 2, y0 + w / 2, w / 2, Math.PI, 0); ap.lineTo(x0 + w, y0 + hh); ap.closePath();
    ctx.save(); ctx.clip(ap);
    const Ex = DX - 64, Ey = 296, Ew = 128, Eh = 262, Eb = Ey + Eh;
    // the corridor (night): ceiling, walls, a floor with the room's warm light spilling out
    ctx.fillStyle = mixHex(P.night0, P.ind1, .35); ctx.fillRect(x0, y0, w, hh);
    ctx.fillStyle = mixHex(P.night1, P.ind2, .55); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(Ex, Ey); ctx.lineTo(Ex, Eb); ctx.lineTo(x0, y0 + hh); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mixHex(P.night1, P.ind2, .4); ctx.beginPath(); ctx.moveTo(x0 + w, y0); ctx.lineTo(Ex + Ew, Ey); ctx.lineTo(Ex + Ew, Eb); ctx.lineTo(x0 + w, y0 + hh); ctx.closePath(); ctx.fill();
    ctx.fillStyle = lin(ctx, 0, Eb, 0, y0 + hh, [[0, mixHex(LAMP.deep, P.night1, .3)], [1, mixHex(P.night1, LAMP.deep, .25)]]); ctx.beginPath(); ctx.moveTo(Ex, Eb); ctx.lineTo(Ex + Ew, Eb); ctx.lineTo(x0 + w, y0 + hh); ctx.lineTo(x0, y0 + hh); ctx.closePath(); ctx.fill();
    for (const k of [.35, .7]) { const yy = lerp(y0 + 20, Ey, k), xx = DX, ww2 = lerp(70, 26, k); ctx.fillStyle = rgba(COOL.line, .35); ctx.beginPath(); ctx.ellipse(xx, yy + 6, ww2, 3, 0, 0, TAU); ctx.fill(); }
    ctx.fillStyle = rgba(P.night0, .6); ctx.fillRect(x0 + 18, y0 + 210, 22, 230);   // a closed side door (depth)
    // the open room at the end: warm lamp, a bed, someone lying, you beside them
    ctx.fillStyle = lin(ctx, 0, Ey, 0, Eb, [[0, mixHex(LAMP.deep, P.ind1, .35)], [.6, mixHex(LAMP.body, LAMP.deep, .45)], [1, LAMP.deep]]); ctx.fillRect(Ex, Ey, Ew, Eh);
    ctx.fillStyle = rgba(mixHex(P.ind0, P.blue0, .4), .9); ctx.fillRect(Ex + 74, Ey + 30, 38, 52); ctx.strokeStyle = rgba(P.night0, .6); ctx.lineWidth = 2; ctx.strokeRect(Ex + 74, Ey + 30, 38, 52);
    halo(ctx, Ex + 30, Ey + 150, 70, .45 * lit, LAMP.body, LAMP.core);
    ctx.fillStyle = mixHex(P.night0, P.ind2, .5); ctx.fillRect(Ex + 28, Ey + 150, 3, 70); ctx.beginPath(); ctx.moveTo(Ex + 20, Ey + 150); ctx.lineTo(Ex + 40, Ey + 150); ctx.lineTo(Ex + 34, Ey + 138); ctx.lineTo(Ex + 26, Ey + 138); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(LAMP.core, .9 * lit); ctx.fillRect(Ex + 22, Ey + 149, 16, 2);
    ctx.strokeStyle = mixHex(P.night0, P.ind2, .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(Ex + 10, Eb - 6); ctx.lineTo(Ex + 10, Ey + 70); ctx.lineTo(Ex + 20, Ey + 70); ctx.stroke();   // the drip stand
    rr(ctx, Ex + 12, Ey + 74, 12, 18, 4); ctx.fillStyle = rgba(P.cream, .3); ctx.fill();
    const bedY = Eb - 50, br = Math.sin(t * 1.3) * .8;
    ctx.fillStyle = mixHex(P.night1, P.ind2, .6); ctx.fillRect(Ex + 14, bedY + 10, 82, 7); ctx.fillRect(Ex + 14, bedY - 18, 4, 46); ctx.fillRect(Ex + 92, bedY - 6, 4, 34);
    ctx.fillStyle = mixHex(P.cream, LAMP.body, .4); rr(ctx, Ex + 18, bedY - 4, 76, 14, 4); ctx.fill();
    ctx.fillStyle = mixHex(P.cream, '#e3dcc0', .5); rr(ctx, Ex + 20, bedY - 12, 20, 10, 4); ctx.fill();
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .4); ctx.beginPath(); ctx.arc(Ex + 32, bedY - 13, 6.5, 0, TAU); ctx.fill();
    ctx.fillStyle = mixHex(P.blue1, LAMP.body, .35); ctx.beginPath(); ctx.moveTo(Ex + 38, bedY - 4); ctx.bezierCurveTo(Ex + 46, bedY - 15 - br, Ex + 76, bedY - 13 - br, Ex + 92, bedY - 4); ctx.closePath(); ctx.fill();
    const sx = Ex + 108, seat = bedY + 6;
    ctx.save(); ctx.beginPath(); ctx.rect(Ex, Ey, Ew, seat - Ey); ctx.clip();
    E.du(ctx, sx, seat + 66 * .44, 66, { dir: -1, look: .05 + .03 * Math.sin(t * .6), light: 1, back: .5, armR: [1.15 + .03 * Math.sin(t * .7), 1.55] });
    ctx.restore();
    ctx.fillStyle = mixHex(P.night0, P.ind1, .4); rr(ctx, sx - 12, seat - 2, 26, Eb - seat + 2, 3); ctx.fill();
    ctx.strokeStyle = rgba(P.night0, .7); ctx.lineWidth = 3; ctx.strokeRect(Ex, Ey, Ew, Eh);
    // darkness lifting (the room lights up as the door opens) and dimming again (M.02)
    ctx.fillStyle = rgba(P.night0, .9 * (1 - lit)); ctx.fillRect(x0, y0, w, hh);
    // the two door leaves swing open (anticipation: a crack of light first)
    for (const sd of [-1, 1]) { const hinge = sd < 0 ? x0 : x0 + w, lw = (w / 2) * Math.cos(op * Math.PI * .46), tip = hinge - sd * lw;
      ctx.fillStyle = mixHex(P.night0, P.ind2, .55 + .1 * (1 - op)); ctx.beginPath(); ctx.moveTo(hinge, y0 - 10); ctx.lineTo(tip, y0 - 10 + op * 14); ctx.lineTo(tip, y0 + hh - op * 10); ctx.lineTo(hinge, y0 + hh); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = rgba(LAMP.body, .25 + .3 * (1 - op)); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(tip, y0 - 10 + op * 14); ctx.lineTo(tip, y0 + hh - op * 10); ctx.stroke(); }
    ctx.restore();
  }

  // ---------------------------------------------------------------- the veil over the hall while screen explainers speak
  const veilA = (t) => Math.max(
    .3 * smooth(span(t, a.reason + .2, a.reason + 1.2)) * (1 - smooth(span(t, a.earlier, a.earlier + 1.2))),
    .62 * smooth(span(t, a.then + .3, a.then + 1.7)) * (1 - smooth(span(t, a.own - .5, a.own + .7))) + .12 * bump(t, a.notOne + .8, 4.6),
    .5 * smooth(span(t, a.oneT + .3, a.oneT + 1.3)) * (1 - smooth(span(t, a.soHeart + .2, a.soHeart + 1.6))) + .25 * smooth(span(t, a.whether, a.whether + 1.2)) * (1 - smooth(span(t, a.soHeart - .2, a.soHeart + 1.2))));

  // ---------------------------------------------------------------- one frame
  const quietV3 = (t) => smooth(span(t, a.chan - 2.4, a.chan - .6)) * (1 - smooth(span(t, a.subscribe, tPlate - .45)));
  return (ctx, t) => {
    if (t < a.T0 + S.SEAM_HALF) { S.plateRoadshow(ctx, t, T); return; }
    if (t >= tPlate) { S.plateMind(ctx, t, T); return; }
    const c = cam(t);
    const verdict0 = BT.rows[0].verdict, cl = cancerLabel(t);
    S.hallWorld(ctx, c, t, {
      moon: .75 - .15 * smooth(span(t, a.cant, a.chan - .5)),
      door: clamp(doorLit(t)), du: false,
      v: (i) => {
        const cnt = .45 * bump(t, a.four + .25 + i * .32, 1.3) + .08 * Math.sin(t * 1.9 + i * 1.3);   // the glass breathes
        if (i === 0) return { glow: 1 + cnt + .4 * bump(t, verdict0, 2.2), inside: (cx, w, h) => labRoom(cx, t, w, h), spec: { a: 1 - lift210(t) * (t < a.own + .5 ? 1 : 0) } };
        if (i === 1) return { glow: .82 + cnt, inside: (cx, w, h) => heartRoom(cx, t, w, h) };
        if (i === 2) return { glow: .82 + cnt - .55 * quietV3(t), spec: { a: 1 - .6 * quietV3(t) } };
        return { glow: .82 + cnt - .47 * smooth(span(t, a.cant, a.chan)) };
      },
      frame: { u: 1, cap: 1, a: 1 - span(unfold(t), 0, .55) },
      lectern: { lamp: 1 + .1 * Math.sin(t * 2.1), open: essayOpen(t), lens: lensOf(t) },
      kiosk: { glow: kioskGlow(t) },
      panel: (cx) => wall(cx, t),
      back: (cx) => corridor(cx, t),
      extra: (cx) => { const lm = labMix(t); if (lm > 0) S.motes(cx, t, V1.x + 40, V1.y + 60, V1.w - 80, V1.h - 140, .8 * lm); },
    });
    const va = veilA(t); if (va > 0) { ctx.save(); screen(ctx); ctx.fillStyle = rgba(P.night0, va); ctx.fillRect(0, 0, W, H); ctx.restore(); }
    // c02: the essay label, the lanes, the clip, the mint line
    const eu = span(t, a.essay + .3, a.essay + 1.3) * (1 - span(t, a.reason - .4, a.reason + .2));
    if (eu > 0) { const p = proj(c, ES.x - ES.w / 2, ES.y - ES.h / 2); if (p) { ctx.save(); screen(ctx); F.label(ctx, p[0] + 4, p[1] + 2, F.ESSAY.title, F.ESSAY.sub, eu, { dx: 46, dy: -64, size: 40 }); ctx.restore(); } }
    ctx.save(); float(ctx, t, .9); lanes(ctx, t, c); ctx.restore();
    const m = clipM(t); if (m > 0) { const sr = projRect(c, KS), pa = span(m, 0, .22), po = { from: sr ? { x: sr.x, y: sr.y, w: sr.w, h: sr.h } : undefined, morph: m, dark: 1 - span(m, .15, .7) };
      if (pa >= 1) F.clipPlate(ctx, t, T, 'C3', po);
      else { OFF ??= createCanvas(W, H); const ox = OFF.getContext('2d'); ox.setTransform(1, 0, 0, 1, 0, 0); ox.clearRect(0, 0, W, H); F.clipPlate(ox, t, T, 'C3', po);
        ctx.save(); screen(ctx); ctx.globalAlpha = pa; ctx.drawImage(OFF, 0, 0); ctx.restore(); } }
    mintLine(ctx, t, c);
    // c03: the ? slots, the label of CANCER (FOUND fills a little), the MB1 lines
    if (cl.in > 0 && cl.home < 1) labelFromPlaque(ctx, t, c, 0, LBL1, cl.in, cl.home, { name: 'CANCER', blink: .5, fill: foundFill(t) });
    labTexts(ctx, t, c);
    // c04: scans → capsule → 55 · a hundred kinds · the readable print · "most"
    scansAndPill(ctx, t, c);
    hundred(ctx, t, c);
    k5(ctx, t);
    lensMost(ctx, t, c);
    mostWord(ctx, t, c);
    // c05: the heart: CTX310, LDL, the band, DNA, the path, the stadium, the HEART label
    heartTexts(ctx, t, c);
    stadium(ctx, t, c);
    band(ctx, t, c);
    liftedHeart(ctx, t, c);
    const hl = { in: sineIO(span(t, a.halfway - .4, a.halfway + .8)), home: sineIO(span(t, a.cant + .2, a.cant + 1.4)) };
    if (hl.in > 0 && hl.home < 1) labelFromPlaque(ctx, t, c, 1, { x: 1190, y: 300, s: .62 }, hl.in, hl.home,
      { name: 'HEART DISEASE', found: span(t, a.inTime - .35, a.inTime + .45), blink: span(t, a.proofSafe - .2, a.proofSafe + .4), wait: .22 * smooth(span(t, a.proofSafe, a.cant + .6)), waitTag: 'YEARS', waitTagA: rise(span(t, a.lifetime - .2, a.lifetime + .5)) });
    // the board (top left, from "twenty thirty-six": it grows out of the mint line) and the ? slots in its answer column
    F.board(ctx, t, T, t < a.t2036 + 1.5 ? { from: { x: BOARDLINE.x, y: BOARDLINE.y - 40, s: .42 } } : {});
    questionSlots(ctx, t);
    // source lines (left, above the subtitles)
    F.source(ctx, t, a.essay + .6, a.reason - .2, F.SOURCES.essay);
    F.source(ctx, t, a.ai + .8, a.then + .7, 'GENERATE BIOMEDICINES / ANTHROPIC, OCT 2026');
    F.source(ctx, t, a.pill + .6, a.notOne, F.SOURCES.larotrectinib);
    F.source(ctx, t, a.hundred, a.own - .3, F.SOURCES.nci);
    F.source(ctx, t, a.own + .5, a.line + .6, F.SOURCES.essay);
    F.source(ctx, t, a.recent + .6, a.oneT, F.SOURCES.ctx310);
    F.source(ctx, t, a.regulators + .3, a.whether, F.SOURCES.fdaGene);
    F.source(ctx, t, a.stadium, a.soHeart + .4, F.SOURCES.fourier);
  };

  // ---------------------------------------------------------------- pinned lines (screen space, ≤ 6 words each)
  function labTexts(ctx, t, c) {
    ctx.save(); screen(ctx);
    const su = rise(span(t, a.oneNew + .1, a.oneNew + .8)) * (1 - span(t, a.then - .2, a.then + .4));
    const sp = proj(c, ...toV1(LAB.scr.x + LAB.scr.w * .61, LAB.scr.y + LAB.scr.h));
    if (su > 0 && sp) F.label(ctx, sp[0], sp[1] + 4, 'ONE AI-PROPOSED DESIGN', '', su, { dx: 30, dy: 74, size: 28 });
    const mu = rise(span(t, a.better + .3, a.better + 1.0)) * (1 - span(t, a.then - .2, a.then + .4));
    const dp = proj(c, ...toV1(LAB.dish.x + 60, LAB.dish.y + 56));
    if (mu > 0 && dp) F.label(ctx, dp[0], dp[1], '≈ 10× MORE RECEPTORS', 'ON THE CELLS', mu, { dx: 44, dy: 60, size: 28 });
    const bu = span(t, a.still + .05, a.still + .8) * (1 - span(t, a.then + .1, a.then + .7)), d0 = proj(c, ...toV1(LAB.dish.x - LAB.dish.r, LAB.dish.y - LAB.dish.r)), d1 = proj(c, ...toV1(LAB.dish.x + LAB.dish.r, LAB.dish.y));
    if (bu > 0 && d0 && d1) F.bracket(ctx, d0[0], d1[0], d0[1] - 26, bu, 'LAB TESTS ONLY', { size: 26 });
    ctx.restore();
  }
  function heartTexts(ctx, t, c) {
    ctx.save(); screen(ctx);
    const bu = rise(span(t, a.infusion - .2, a.infusion + .6)) * (1 - span(t, a.oneT + .2, a.oneT + .8));
    const bp = proj(c, ...toV2(HR.bag[0] - 34, HR.bag[1] + 20));
    if (bu > 0 && bp) { F.label(ctx, bp[0], bp[1], 'CTX310', '15 PEOPLE · ONE INFUSION', bu, { dx: -70, dy: 70, size: 34 }); }
    const lu = rise(span(t, a.half - .2, a.half + .5)) * (1 - span(t, a.oneT + .4, a.oneT + 1.0)), lp = proj(c, ...toV2(HR.col.x + 30, HR.col.y0 + 120));
    if (lu > 0 && lp) { F.mintText(ctx, [['LDL ≈ −50 %', 1]], lp[0] + 30, lp[1], 48, lu, { serif: false, weight: 600 });
      maskLine(ctx, [['HIGHEST DOSE · DAY 60', 0]], lp[0] + 32, lp[1] + 40, 22, rise(span(t, a.half + .2, a.half + .9)) * (1 - span(t, a.oneT + .4, a.oneT + 1.0)), { serif: false, weight: 600, col: P.halo2, glow: false, spacing: .12 }); }
    const fu = rise(span(t, a.fifteen - .5, a.fifteen + .3)) * (1 - expoIn(span(t, a.whether - .2, a.whether + .5)));
    if (fu > 0) lineR(ctx, 'FDA: UP TO 15 YEARS FOLLOW-UP', BX1, BY - 104, 32, fu, { serif: false, weight: 600, col: P.cream, glow: false });
    const s1 = rise(span(t, a.stadium + .2, a.stadium + .9)) * (1 - expoIn(span(t, a.soHeart + .2, a.soHeart + .8))), s2 = rise(span(t, a.stadium + .7, a.stadium + 1.4)) * (1 - expoIn(span(t, a.soHeart + .2, a.soHeart + .8)));
    if (s1 > 0) lineR(ctx, 'E.G. FOURIER: 27,564 PATIENTS', 1830, 132, 32, s1, { serif: false, weight: 600, col: P.cream, glow: false });
    if (s2 > 0) F.mintText(ctx, [['MEDIAN 2.2 YEARS', 1]], 1830, 176, 26, s2, { serif: false, weight: 600, spacing: .12, align: 'right' });
    ctx.restore();
  }
}
