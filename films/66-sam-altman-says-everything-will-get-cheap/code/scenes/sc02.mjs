// c02 · HIS STRONGEST ARGUMENT · C1 out of the promise · prices heading down · a price is other people's time · the food dollar 54¢ / 12¢ ·
// robots → the price sinks · the robot house · he sells cheap intelligence · the land wide (the film's one W) · six tags + a seventh = the
// clock ★ · the test question.
// 'This January' → 'Start where a price' · B1 (builder 1, 20.11.). Plan: docs/shots.md 1.01–1.11 · world: docs/MOTION.md · kit: lib/f66_*.
//
// THE B1 GROUP IS ONE TAKE: c02, c03 and c04 draw the SAME function b1(T).draw (one camera path, one world state from 'This January' to
// 'So far, every price'), so the inner seams c02|c03 and c03|c04 are identical frames by construction. This file owns the backbone
// (anchors, the camera, the station tags, the promise, you) and the c02 beats; scenes/sc03.mjs and sc04.mjs add their beats as layers
// (anchors03/layers03, anchors04/layers04) and import b1() from here at build time (dynamic import: no cycle at load).
// Seams: platePromise for [T0, T0 + .5) (lead → B1) · plateFactory for [T1 − .5, T1) (B1 → B2). The camera leaves the promise plate with
// its creep and lands on FACTORY_CAM with the same creep (sc01's recipe).
//
// | ID    | anchor (phrase)            | picture (one idea)                                                                        | camera / carrier      |
// |-------|----------------------------|-------------------------------------------------------------------------------------------|-----------------------|
// | 1.01  | This January               | the promise's face lights; its light grows into the C1 plate                              | creep · the face      |
// | 1.02  | slot C1                    | C1 SAM ALTMAN (clip plate), then the plate shrinks back into the face                     | creep · the plate     |
// | 1.03  | Deflationary pressure      | gold words DEFLATIONARY PRESSURE, then PRICES with a drawn ↓; the promise sways            | creep · the arrow     |
// | 1.04  | His argument is stronger   | the arrow's shaft becomes a thread; a tag slides down it and opens: tiny people at work   | creep · the tag       |
// | 1.05★ | Of every dollar            | the tag steps left; THE FOOD DOLLAR unrolls out of it: 54¢ LABOR (on "somebody's work") · 12¢ FARM | creep · the bar |
// | 1.06  | Let superintelligence      | LABOR turns cool (thinking, lifting) and shrinks ("sinks"); the tag sinks and dims          | creep · the tag       |
// | 1.07  | He even pictures a house   | the bar rolls back in; the tag becomes a house; cool robot arms rise at its walls; quote   | creep · the house     |
// | 1.08  | Then again, he runs        | the house is pulled up; tilt up the promise's thread: it hangs from a cool data glow · CHATGPT | tilt up · the thread |
// | 1.09  | But his claim can be tested| the promise is pulled up into the glow; pull back high: THE LONG LAND (the film's W)       | pull back · the land  |
// | 1.10  | Six price tags             | six tags come down left → right (a gold pulse each); a seventh, face down; the clock forms | creep · the clock     |
// | 1.11  | And for each, one question | HOW MUCH OF THIS PRICE IS WORK? writes under the clock                                     | creep · tag 1         |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f66_kit.mjs';
import * as S from '../lib/f66_world.mjs';
import { anchors03, layers03 } from './sc03.mjs';
import { anchors04, layers04 } from './sc04.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, smooth, mixHex, halo } = E;
const { rise, GOLD, COOL, LAMP, PAPER, EARTH, bump } = F;

export const PRINT = F.PRINT66;

export default async (T, R) => { E.prepareEditorial(); return [{ t: R.a, draw: b1(T).draw, print: PRINT }]; };

// ------------------------------------------------------------------------------------------------ the group: anchors, camera, world
const CACHE = new WeakMap();
export function b1(T) {
  if (CACHE.has(T)) return CACHE.get(T);
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.in = G('This January'); a.out = G('So far, every price', a.in);
  a.clip = T.clip('C1');
  a.defl = G('Deflationary pressure', a.clip.end - 1); a.prices = G('prices heading down', a.defl);
  a.arg = G('His argument is stronger', a.prices); a.time = G("other people's time", a.arg);
  a.dollar = G('Of every dollar Americans', a.time); a.half = G('more than half', a.dollar); a.work = G("somebody's work", a.half);
  a.farm = G('The farm gets', a.work); a.twelve = G('twelve cents', a.farm);
  a.let = G('Let superintelligence', a.twelve); a.thinking = G('the thinking', a.let); a.lifting = G('the lifting', a.let);
  a.sinks = G('the price sinks', a.lifting); a.machines = G('the machines cost', a.sinks);
  a.house = G('He even pictures a house', a.machines); a.built = G('built by robots', a.house); a.renting = G('renting them', a.built);
  a.then = G('Then again, he runs', a.renting); a.chat = G('ChatGPT', a.then); a.cheapI = G('Cheap intelligence', a.chat);
  a.tested = G('But his claim can be tested', a.cheapI);
  a.six = G('Six price tags', a.tested); a.thought = G('pure thought', a.six); a.ground = G('solid ground', a.six);
  a.seventh = G('Then a seventh', a.six); a.name = G('your name on it', a.seventh);
  a.each = G('And for each, one question', a.name); a.q = G('how much of this price is work', a.each); a.qE = GE('how much of this price is work', a.each);
  anchors03(T, a); anchors04(T, a);
  const L = [layers02(a, T), layers03(a, T), layers04(a, T)];
  const cam = camera(a, L);
  const draw = scene(a, T, cam, L);
  const out = { a, cam, draw };
  CACHE.set(T, out); return out;
}

// the promise (drawn by us on the promise card so it can be pulled up its thread on "can be tested"; identical to the world's own draw)
const PR = S.PROMISE, PH = PR.w * 1.42, UP = [Math.sin(PR.rot), -Math.cos(PR.rot)];   // up the thread (up-right)
const onPromise = (lx, ly) => [PR.x + lx * Math.cos(PR.rot) - ly * Math.sin(PR.rot), PR.y + lx * Math.sin(PR.rot) + ly * Math.cos(PR.rot)];
const FACE = onPromise(0, PH * .45);
const GLOW_L = 1150, GLOWP = [PR.x + UP[0] * GLOW_L, PR.y + UP[1] * GLOW_L];        // the cool data glow on the thread (promise card px)

// ------------------------------------------------------------------------------------------------ the camera (one path for c02–c04)
const PC = (k) => S.PROMISE_CAM(k, S.trk(k));
export const WIDE = (k = 1) => E.aim(S.Z_LAND, 3450 + 40 * (k - 1) / .04, 540, .27 * k, 960, 700);
function camera(a, L) {
  const k0 = (t) => 1 + S.CREEP * (t - (a.in - S.SEAM_HALF));
  const tB = a.in + 2.0;
  const kF = (t) => 1 + S.CREEP * (t - (a.out - S.SEAM_HALF)), creepF = (t) => { const k = kF(t); return S.FACTORY_CAM(k, S.trk(k) * .3); };
  const tF = a.out - S.SEAM_HALF - 2.6;
  const PA = (u, v, s, sx, sy) => E.aim(S.Z_PROMISE, u, v, s, sx, sy);
  const K = [
    [tB, PC(k0(tB))],
    [a.clip.start + 6, PA(840, 590, 1.08)],                 // behind the plate: a little left and closer (the sky left of the promise holds the explainers)
    [a.dollar, PA(860, 590, 1.09)], [a.house, PA(880, 585, 1.1)], [a.then + .25, PA(895, 580, 1.11)],
    [a.chat + 1.1, PA(1690, -330, .82)],                    // tilt up the promise's thread to the data glow
    [a.tested - .1, PA(1720, -360, .84)],
    [a.six + .45, WIDE(1)],                                  // pull back high: THE LONG LAND (W)
    [a.q + .6, WIDE(1.03)],
    ...L.flatMap((l) => l.camKeys ?? []),
    [tF, creepF(tF)],
  ].sort((p, q) => p[0] - q[0]);
  const raw = (t) => (t < tB ? PC(k0(t)) : t < tF ? F.camPath(t, K) : creepF(t));
  const tIn = a.in + S.SEAM_HALF, tOut = a.out - S.SEAM_HALF;
  return (t) => E.camDrift(raw(t), t, 6 * smooth(span(t, tIn, tIn + 2.2)) * (1 - smooth(span(t, tOut - 2.4, tOut))), 9);
}

// ------------------------------------------------------------------------------------------------ the world state (tags, promise, you)
function tagState(a, t, i) {
  const t0 = i < 6 ? a.six + .12 + i * .56 : a.seventh + .12;
  const d = span(t, t0, t0 + 1.25); if (d <= 0) return null;
  const s = { dy: -1000 * (1 - d) ** 4 + 10 * Math.sin(Math.PI * span(d, .55, 1)), glow: .35 + .55 * bump(t, t0 + .45, 1.5), seed: 20 + i, swing: .1 * (1 - expoOut(d)) * Math.sin(t * 5 + i) };
  if (i === 6) { s.back = 1; s.glow = .3; }
  s.w = S.TAG_W * lerp(1.7, 1, smooth(span(t, a.start1 - .6, a.start1 + 3.2)));
  return s;
}
export function worldTags(a, t, L) {
  const tags = []; for (let i = 0; i < 7; i++) tags.push(tagState(a, t, i));
  for (const l of L) if (l.tags) l.tags(tags, t);
  return tags;
}

// ================================================================================================ c02 beats
function layers02(a, T) {
  const tIn = a.in + S.SEAM_HALF;
  // ---- 1.01/1.02 the C1 plate grows out of the promise's face and goes back into it
  const mIn = (t) => sineIO(span(t, a.in + 1.25, a.clip.start)), mOut = (t) => sineIO(span(t, a.clip.end - .05, a.clip.end + 1.95));
  const plateM = (t) => mIn(t) * (1 - mOut(t));
  // ---- the explainer stage (screen space, on a night veil)
  const veil = (t) => .5 * smooth(span(t, a.clip.end + .3, a.defl + .6)) * (1 - smooth(span(t, a.then + .1, a.then + 1.9)));
  // 1.03 the words
  const wDefl = (t) => span(t, a.defl - .15, a.defl + .7), wPrices = (t) => span(t, a.prices - .1, a.prices + .6);
  const wOut = (t) => span(t, a.arg - .3, a.arg + .35);
  const AX = 500, AY0 = 352, AY1 = 470;          // the arrow (screen px)
  // 1.04 the tag on the arrow's thread; it opens
  const tagDown = (t) => span(t, a.arg + .35, a.arg + 1.8), open = (t) => span(t, a.arg + 1.1, a.arg + 2.4) * (1 - span(t, a.house - .1, a.house + .9));
  // 1.05 the tag steps left; the bar unrolls out of it
  const step = (t) => sineIO(span(t, a.dollar - .55, a.dollar + 1.45)) * (1 - sineIO(span(t, a.house - .2, a.house + 1.8)));
  const barU = (t) => span(t, a.dollar - .05, a.dollar + 1.4) * (1 - span(t, a.house - .3, a.house + .9));
  const labU = (t) => span(t, a.half - .1, a.work + .7), farmU = (t) => span(t, a.twelve - .25, a.twelve + .55);
  const coolU = (t) => .5 * sineIO(span(t, a.thinking - .1, a.thinking + .9)) + .5 * sineIO(span(t, a.lifting - .1, a.lifting + .9));
  const shrink = (t) => sineIO(span(t, a.sinks - .1, a.sinks + 1.8));
  const coreU = (t) => span(t, a.machines - .1, a.machines + .9) * (1 - span(t, a.house - .3, a.house + .6));
  // 1.07 the house
  const houseU = (t) => sineIO(span(t, a.house + .1, a.house + 2.0));
  const armsU = (t) => span(t, a.built - .3, a.built + 1.0) * (1 - span(t, a.then + .1, a.then + 1.0));
  const quoteU = (t) => span(t, a.built - .1, a.built + .7) * (1 - span(t, a.then + .05, a.then + .45));
  const pull = (t) => expoIn(span(t, a.then + .15, a.then + 1.9));      // 1.08 the house is pulled up its thread
  // 1.08 the data glow + CHATGPT · 1.09 the promise is pulled up into it
  const glowU = (t) => span(t, a.then + .4, a.then + 2.2) * (1 - span(t, a.six + 1, a.six + 3));
  const chatU = (t) => span(t, a.chat - .05, a.chat + .6) * (1 - span(t, a.tested + .2, a.tested + .6));
  const lift = (t) => sineIO(span(t, a.tested - .1, a.tested + 2.5));
  const promiseGlow = (t) => 1 - .35 * span(t, a.clip.end + .5, a.defl + 2) + .25 * bump(t, a.in + .5, 1.6) + .3 * bump(t, a.cheapI - .1, 1.4);

  function tagGeom(t) {   // the explainer tag's eyelet (screen px), width, extra rotation
    const st = step(t), sk = shrink(t);
    const x = lerp(AX, 280, st), y = lerp(330, 300, st) + 70 * sk * st, w = lerp(250, 180, st) * (1 - .12 * sk * st);
    const dn = tagDown(t), y0 = -420;
    return { x, y: lerp(y0, y, 1 - (1 - dn) ** 3) - 260 * pull(t), w, swing: .05 * bump(t, a.arg + 1.2, 1.2) * Math.sin(t * 4) + .04 * bump(t, a.sinks, 1.6) * Math.sin(t * 3) };
  }
  function people(ctx, t, w, h, u) {   // the inside of the opened tag: tiny people at work (silhouettes), lamp-warm
    if (u <= 0) return;
    const x0 = -w * .4, y0 = h * .14, iw = w * .8, ih = h * .7 * u;
    ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, iw, ih); ctx.clip();
    ctx.fillStyle = E.lin(ctx, 0, y0, 0, y0 + h * .7, [[0, mixHex(LAMP.deep, P.night1, .25)], [1, mixHex(LAMP.deep, P.night0, .55)]]); ctx.fillRect(x0, y0, iw, h * .7);
    halo(ctx, 0, y0 + h * .2, w * .5, .25, GOLD.halo, LAMP.core);
    const gy = y0 + h * .62, cl = coolU(t);
    ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.fillRect(x0, gy, iw, h * .2);
    const ph = h * .26;
    const walk = (t * .09) % 1;   // a carrier crosses with a box
    E.person(ctx, x0 + iw * (.1 + .8 * walk), gy, ph, { walk: t * 6, dir: 1, armR: [.9, 2.2], light: .5 });
    ctx.fillStyle = mixHex(PAPER.shade, P.night1, .3); ctx.fillRect(x0 + iw * (.1 + .8 * walk) + ph * .08, gy - ph * .66, ph * .22, ph * .16);
    E.person(ctx, x0 + iw * .22, gy, ph * .95, { pose: 'lift', dir: 1, armR: [2.6 + .3 * Math.sin(t * 2.2), 2.9], armL: [-2.6 - .3 * Math.sin(t * 2.2), -2.9], light: .5 });
    E.person(ctx, x0 + iw * .72, gy, ph, { pose: 'reach', dir: -1, armR: [2.3 + .25 * Math.sin(t * 1.7 + 1), 2.5], light: .5, lean: .05 });
    ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.fillRect(x0 + iw * .6, gy - ph * .38, iw * .3, ph * .06);   // a workbench
    if (cl > 0) { ctx.fillStyle = rgba(COOL.deep, .55 * cl); ctx.fillRect(x0, y0, iw, ih); }
    ctx.restore();
  }
  function explainerTag(ctx, t) {
    const dn = tagDown(t); if (dn <= 0 || pull(t) >= 1) return null;
    const g = tagGeom(t), hu = houseU(t), h = g.w * 1.42;
    const glow = (1 - .45 * shrink(t) * (1 - hu)) * (.85 + .15 * bump(t, a.work - .1, 1.2));
    const box = F.tag(ctx, t, g.x, g.y, g.w, { swing: g.swing, glow, house: hu, seed: 61, thread: 2400 });
    // the face opens (a shutter rolls up from the bottom edge of the face) → the people inside
    const op = open(t);
    if (op > 0 && box) {
      ctx.save(); ctx.translate(g.x, g.y); ctx.rotate(box.rot);
      people(ctx, t, g.w, h, sineIO(op));
      ctx.restore();
    }
    // the small cool core the price sinks toward (1.06), under the tag
    const cu = coreU(t);
    if (cu > 0) { const cy = g.y + h * 1.0; halo(ctx, g.x, cy, 70 * expoOut(cu), .7 * cu, COOL.halo, COOL.core); ctx.fillStyle = rgba(COOL.core, .9 * cu); ctx.beginPath(); ctx.arc(g.x, cy, 9 * expoOut(cu), 0, Math.PI * 2); ctx.fill(); }
    // 1.07 the robot arms at the house's walls (flat cool silhouettes; they rise from the house's base line)
    const ar = armsU(t);
    if (ar > 0 && hu > .5) {
      const base = g.y + h * .9;
      ctx.save(); ctx.beginPath(); ctx.rect(g.x - g.w * 2, g.y - h, g.w * 4, base - g.y + h); ctx.clip();
      for (const sd of [-1, 1]) {
        const ax = g.x + sd * (g.w * .5 + 70), up = (1 - expoOut(ar)) * 200, ph = t * 1.4 + (sd > 0 ? 1.3 : 0);
        const a1 = -Math.PI / 2 - sd * (.55 + .18 * Math.sin(ph)), a2 = sd * (1.1 + .3 * Math.sin(ph + 1.2));
        const p0 = [ax, base + up], p1 = [p0[0] + Math.cos(a1) * 110, p0[1] + Math.sin(a1) * 110], p2 = [p1[0] + Math.cos(a1 + a2) * 80, p1[1] + Math.sin(a1 + a2) * 80];
        ctx.strokeStyle = mixHex(P.night1, COOL.deep, .5); ctx.lineCap = 'round'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(...p0); ctx.lineTo(...p1); ctx.lineTo(...p2); ctx.stroke();
        ctx.strokeStyle = rgba(COOL.line, .5); ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = mixHex(P.night1, COOL.deep, .5); ctx.fillRect(ax - 26, base - 16 + up, 52, 18);
        halo(ctx, p2[0], p2[1], 34, .5 * ar, COOL.halo, COOL.core);
      }
      ctx.restore();
    }
    return { ...g, h };
  }
  // the food dollar (a local bar: shares animate; the labour part turns cool and shrinks)
  function foodBar(ctx, t, x, y) {
    const u = barU(t); if (u <= 0) return;
    const Wb = 1040, hb = 78, fr = expoOut(u), sk = shrink(t), cl = coolU(t);
    const sh = [lerp(.54, .1, sk), .34, .12], tot = sh[0] + sh[1] + sh[2], ww = Wb * fr * (tot / 1);
    ctx.save();
    F.maskLine(ctx, [[F.SOURCES.foodDollar, 0]], x, y - 30, 24, rise(span(u, .2, .8)), { serif: false, weight: 600, col: P.halo2, glow: false });
    // the bar body (unrolls out of the tag: its left end is tied to the tag)
    ctx.strokeStyle = rgba(P.cream, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x, y, ww, hb, 10); ctx.stroke();
    let xx = x;
    const seg = (share, col, su) => { const sw = Wb * share * fr; if (su > 0) { ctx.fillStyle = E.lin(ctx, xx, y, xx + sw, y, [[0, mixHex(col, P.night1, .3)], [1, col]]); ctx.beginPath(); ctx.roundRect(xx + 3, y + 3, Math.max(0, sw * expoOut(su) - 6), hb - 6, 8); ctx.fill(); } const x0 = xx; xx += sw; return [x0, sw]; };
    const lab = labU(t), labCol = mixHex(mixHex(LAMP.body, GOLD.mid, .25), COOL.body, cl);
    const [lx, lw] = seg(sh[0], labCol, lab);
    seg(sh[1], mixHex(P.blue2, P.night1, .35), span(u, .5, 1));
    const [fx] = seg(sh[2], EARTH.top, farmU(t));
    // the core the labour part shrinks to
    if (sk > 0) halo(ctx, lx + lw / 2, y + hb / 2, 40, .5 * sk, COOL.halo, COOL.core);
    // labels (54¢ LABOR rises on "somebody's work", leaves as the part shrinks; 12¢ FARM on "twelve cents")
    const [big54, lab54] = F.SOURCES.foodLabor.split(' '), [big12, lab12] = F.SOURCES.foodFarm.split(' ');
    const lo = 1 - span(sk, 0, .35);
    if (lab > 0 && lo > 0) { F.goldText(ctx, [[big54, .2]], lx + 16, y + hb + 70, 64, rise(span(lab, .3, 1)) * lo, { serif: true }); F.maskLine(ctx, [[lab54, 0]], lx + 18, y + hb + 108, 24, rise(span(lab, .45, 1)) * lo, { serif: false, weight: 700, col: P.cream, glow: false }); }
    const fu = farmU(t) * (1 - span(t, a.house - .45, a.house + .15));
    if (fu > 0) { F.goldText(ctx, [[big12, 0]], fx + 6, y + hb + 70, 64, rise(span(fu, .3, 1)), { serif: true, col: mixHex(EARTH.rim, P.cream, .4) }); F.maskLine(ctx, [[lab12, 0]], fx + 8, y + hb + 108, 24, rise(span(fu, .45, 1)), { serif: false, weight: 700, col: P.cream, glow: false }); }
    ctx.restore();
  }

  return {
    veil,
    promise(t) {   // on the promise card (instead of the world's own promise draw): dust .5 as the plate, pulled up on "tested"
      const l = lift(t) * 2600;
      return { x: PR.x + UP[0] * l, y: PR.y + UP[1] * l, o: { rot: PR.rot, seed: 6, ...S.PROMISE_HALF, glow: clamp(promiseGlow(t)), swing: .04 * bump(t, a.defl, 2.4) * Math.sin(t * 2.3) } };
    },
    promiseCard(ctx, t) {   // the cool data glow at the top of the promise's thread (machine = a circle: rings pulse inward)
      const g = glowU(t); if (g <= 0) return;
      const [x, y] = GLOWP, k = expoOut(g);
      halo(ctx, x, y, 420 * k, .55 * g, COOL.halo, COOL.core);
      for (let i = 0; i < 4; i++) { const ph = ((t * .35 + i / 4) % 1), r = 260 * (1 - ph) * k; ctx.strokeStyle = rgba(COOL.line, .45 * g * Math.sin(Math.PI * ph)); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke(); }
      const r = E.prng(661); ctx.fillStyle = rgba(COOL.core, .7 * g);
      for (let i = 0; i < 70; i++) { const an = r() * 6.283 + t * (.1 + r() * .15), rr = (60 + r() * 230) * k; ctx.fillRect(x + Math.cos(an) * rr, y + Math.sin(an) * rr * .7, 3, 3); }
      ctx.fillStyle = rgba(COOL.core, .95 * g); ctx.beginPath(); ctx.arc(x, y, 34 * k, 0, Math.PI * 2); ctx.fill();
      const cu = chatU(t);
      if (cu > 0) F.goldText(ctx, [['CHATGPT', 0]], x - 70, y + 330, 40, rise(cu), { serif: false, weight: 700, spacing: .12, col: COOL.text });
    },
    screen(ctx, t, c) {
      if (t > a.six + 1) return;
      ctx.save(); F.float(ctx, t, .6);
      // 1.03 DEFLATIONARY PRESSURE → PRICES ↓
      const wo = wOut(t);
      if (wDefl(t) > 0 && wo < 1) {
        F.goldText(ctx, [['DEFLATIONARY', .35], [' PRESSURE', .35]], 140, 250 + 60 * wo, 76, rise(wDefl(t)) * (1 - expoIn(wo)), { serif: true, glow: true });
        if (wPrices(t) > 0) {
          F.goldText(ctx, [['PRICES', 1]], 140, 450 + 60 * wo, 96, rise(wPrices(t)) * (1 - expoIn(wo)), { serif: true, glow: true });
        }
      }
      // the arrow (draws down on "heading down"); its shaft becomes the explainer tag's thread
      const au = span(t, a.prices + .5, a.prices + 1.2), dn = tagDown(t);
      if (au > 0 && dn < 1) {
        const top = lerp(AY0, -40, sineIO(span(t, a.arg + .05, a.arg + .7)));
        F.goldSpan(ctx, [[AX, top], [AX, AY1]], 0, smooth(au), { w: 4, spark: false, a: 1 - span(dn, .5, 1) });
        const hu = smooth(span(au, .6, 1)) * (1 - span(dn, 0, .4));
        if (hu > 0) { F.goldSpan(ctx, [[AX - 26 * hu, AY1 - 30 * hu], [AX, AY1], [AX + 26 * hu, AY1 - 30 * hu]], 0, 1, { w: 4, spark: false }); }
      }
      // 1.04–1.07 the explainer tag, the bar, the house
      const g = explainerTag(ctx, t);
      if (g) foodBar(ctx, t, g.x + g.w * .5 + 40, 560);
      const qu = quoteU(t);
      if (qu > 0) F.quoteCard(ctx, t, T, { u: qu, text: F.SOURCES.robotHouse, x: 1040, y: 300, w: 780, size: 40, credit: F.SOURCES.robotHouseSrc });
      ctx.restore();
    },
    land(ctx, t) {   // 1.10 PURE THOUGHT ← · → SOLID GROUND (in the earth band of the wide land, land card px)
      const lu = span(t, a.thought - .1, a.thought + .6) * (1 - span(t, a.q + .5, a.q + 1.4)), gu = span(t, a.ground - .1, a.ground + .6) * (1 - span(t, a.q + .65, a.q + 1.55));
      if (lu > 0) F.maskLine(ctx, [['PURE THOUGHT', 0]], 900, S.GY + 210, 92, rise(lu), { serif: false, weight: 700, col: mixHex(P.cream, COOL.body, .4), glow: false });
      if (gu > 0) F.maskLine(ctx, [['SOLID GROUND', 0]], 6500, S.GY + 210, 92, rise(gu), { serif: false, weight: 700, col: mixHex(P.cream, EARTH.rim, .5), glow: false, align: 'right' });
    },
    clip(ctx, t, c) {   // 1.01/1.02 the C1 plate: the promise's face lights, its light grows into the plate; back into the face after the clip
      const m = plateM(t), back = t > a.clip.start;
      const lightA = back ? span(m, 0, .25) : span(t, a.in + .5, a.in + 1.25); if (lightA <= 0) return;
      const p = E.project(c, S.Z_PROMISE, FACE[0], FACE[1]); if (!p) return;
      const fw = 170 * p[2], from = { x: p[0] - fw / 2, y: p[1] - fw / 2, w: fw, h: fw };
      let box;
      if (m >= .85) {   // final QA: the promise tag sits behind the right end of the lower third -> a soft night backing keeps ORIGINAL FOOTAGE (…) legible
        const R = F.CLIP_RECT, lu = span(t, a.clip.start + .2, a.clip.start + 1.1) * (1 - span(t, a.clip.end - .5, a.clip.end + .1)) * span(m, .85, 1);
        if (lu > 0) {
          const x1 = R.x + R.w + 36, x0 = x1 - 600, y0 = R.y - 84, y1 = R.y - 6;
          const g = ctx.createLinearGradient(x0, 0, x1, 0), col = mixHex(P.night0, P.ind0, .4);
          g.addColorStop(0, rgba(col, 0)); g.addColorStop(.22, rgba(col, .88 * lu)); g.addColorStop(.94, rgba(col, .88 * lu)); g.addColorStop(1, rgba(col, 0));
          ctx.save(); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x0, y0, x1 - x0, y1 - y0, 18); ctx.fill(); ctx.restore();
        }
      }
      if (m >= .25) box = F.clipPlate(ctx, t, T, 'C1', { from, morph: m, dark: 1 - span(m, .3, .85) });
      else { const mm = sineIO(m); box = { cx: lerp(p[0], F.CLIP_RECT.x + F.CLIP_RECT.w / 2, mm), cy: lerp(p[1], F.CLIP_RECT.y + F.CLIP_RECT.h / 2, mm), w: lerp(fw, F.CLIP_RECT.w, mm), h: lerp(fw, F.CLIP_RECT.h, mm) }; }
      const sheen = (1 - span(m, .25, .6)) * lightA;
      if (sheen > 0) { ctx.save(); ctx.fillStyle = rgba(mixHex(GOLD.hot, GOLD.body, .4), sheen * .95); ctx.beginPath(); ctx.roundRect(box.cx - box.w / 2, box.cy - box.h / 2, box.w, box.h, 14); ctx.fill(); ctx.restore(); halo(ctx, box.cx, box.cy, Math.max(box.w, box.h) * .7, .35 * sheen, GOLD.halo, GOLD.core); }
    },
    sources(ctx, t) {
      F.source(ctx, t, a.dollar + .3, a.let + 1.0, F.SOURCES.foodSrc);
      F.source(ctx, t, a.built + .2, a.then + .3, F.SOURCES.robotHouseSrc);
    },
    after(ctx, t) {   // 1.11 the test question under the clock (stays while c03 starts: "a price is nothing but work")
      const qu = span(t, a.q - .1, a.q + .9), qo = span(t, a.notLift - .1, a.notLift + .5);
      if (qu > 0 && qo < 1) F.goldText(ctx, [[F.SOURCES.testQ, .75]], 64, 296 + 30 * qo, 30, rise(qu) * (1 - expoIn(qo)), { serif: false, weight: 700, spacing: .06 });
    },
    lookYou: (t) => .7 + .12 * span(t, tIn, tIn + 2) * Math.sin(t * .4),
  };
}

// ------------------------------------------------------------------------------------------------ one frame
function scene(a, T, cam, L) {
  const tIn = a.in + S.SEAM_HALF, tOut = a.out - S.SEAM_HALF, L2 = L[0];
  return (ctx, t) => {
    if (t < tIn) { S.platePromise(ctx, t, T); return; }
    if (t >= tOut) { S.plateFactory(ctx, t, T); return; }
    const c = cam(t), pr = L2.promise(t);
    const city = Math.max(0, ...L.map((l) => (l.city ? l.city(t) : 0)));
    S.landWorld(ctx, c, t, {
      promise: false,
      promiseExtra: (cx) => { if (pr.y > -2400) F.tag(cx, t, pr.x, pr.y, PR.w, pr.o); L2.promiseCard(cx, t); },
      cool: 1, city,
      tags: worldTags(a, t, L),
      you: { o: { armR: [2.2, 2.6], look: L2.lookYou(t) } },
      roof: (cx, h) => { if (h?.R) F.paySlip(cx, t, h.R[0] + 8, h.R[1] - 16, 62, { glow: .7, rot: -.25 }); },
      land: (cx) => { for (const l of L) if (l.land) l.land(cx, t); },
    });
    F.veil(ctx, Math.max(...L.map((l) => (l.veil ? l.veil(t) : 0))));
    for (const l of L) if (l.screen) l.screen(ctx, t, c);
    L2.clip(ctx, t, c);
    if (t >= a.six - .4) F.board(ctx, t, T);
    for (const l of L) if (l.after) l.after(ctx, t, c);
    for (const l of L) if (l.sources) l.sources(ctx, t);
  };
}
