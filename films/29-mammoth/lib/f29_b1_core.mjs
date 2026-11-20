// Film 29 · builder B1 · c02–c06 as ONE continuous take ('The mice belong' → 'Then it turned to the dodo').
// Every chunk file (scenes/sc02.mjs … sc06.mjs) returns the same draw function from here, so the inner boundaries match frame for frame.
//   in:  plateFence at T.G('The mice belong') (drawn for [T0, T0 + .5), then the camera leaves the creep and glides left to the hut)
//   out: plateDodo at T.G('Then it turned to the dodo') (drawn for [T1 − .5, T1); the stage before it settles onto the plate's state)
// Plan: docs/shots.md 1.01–1.25. ONE world: the fence, the hut, the sky over the tundra. Explainers hang in the far sky (skyPin: they ride
// with the horizon, a pan moves them a little) or open out of the snow (the cutaway portal from a slit), out of the hut window (the lab),
// and at the end out of a strand (the night stage of the dodo). The machine is the cyan comb that leaves the mast. Calm: one thing moves
// at a time, the camera follows it; long holds breathe (drift, snow, glints, breath).
import { createCanvas } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f29_kit.mjs';
import * as S from './f29_seams.mjs';
import * as A from './f29_b1_art.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, mixHex, halo, prng } = E;
const { rise, maskLine, GOLD, MACH, LAMP, bump } = F;
const C = (x, y, z, hz) => E.cam3({ x, y, z, f: F.F0, hz });
const WD = S.WORLD, HU = WD.hut, EL = { x: -4450, z: WD.elephant.z, h: WD.elephant.h };

// ================================================================================================================= anchors (phrases only)
function anchors(T, R) {
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after), a = {};
  a.T0 = G('The mice belong'); a.colossal = G('called Colossal', a.T0); a.plan = G('And its plan is not'); a.thaw = G('thaw out', a.plan);
  a.frozen = G('frozen mammoth', a.plan); a.frozenE = GE('frozen mammoth', a.plan);
  a.take = G('The plan is to take'); a.cousin = G('living cousin', a.take); a.asian = G('Asian elephant', a.take); a.rewrite = G('rewrite its DNA', a.take); a.cold = G('for the cold', a.rewrite);
  a.part = G("And the machine's part"); a.reported = G('As reported this year', a.part); a.combs = G('through mammoth and elephant', a.part) - .7; a.flags = G('differences most likely', a.part); a.trait = G('build a trait', a.part);
  a.fur = G('The thick fur'); a.fat = G('The layer of fat'); a.ears = G('The small ears');
  a.gene = G("It doesn't change a single gene"); a.writes = G('It writes the list');
  // c03
  a.read = G('And it has plenty to read'); a.ground = G('Frozen ground kept'); a.holds = G('and Colossal says it now holds'); a.hundred = G('about a hundred mammoth genomes'); a.sets = G('A hundred full sets');
  a.why = G('So why is there still no mammoth'); a.because = G('Because reading was never'); a.knowing = G('Knowing what it means');
  a.count = G('Start the count at'); a.million = G('1.4 million', a.count); a.most = G('Most of those differences'); a.nothing = G('change nothing you', a.most);
  a.some = G('Only some of them change'); a.study = G('One study found'); a.sixteen = G('sixteen hundred genes', a.study);
  // c04
  a.still = G('Still far too many'); a.ranking = G("This is where the machine's ranking"); a.drops = G('the count drops again'); a.own = G("Colossal's own list");
  a.about150 = G('About a hundred and fifty genes'); a.rising = G('and rising', a.about150);
  a.tested = G('And tested in a living animal'); a.onlyMice = G('Only in those mice'); a.seven = G('Seven genes, changed');
  a.critics = G('Critics add a caution'); a.known = G('Genes like these were already'); a.prove = G('So the mice prove the editing'); a.notList = G('not the list', a.prove);
  // c05
  a.from7 = G('From seven genes in a mouse'); a.to150 = G('to about a hundred and fifty in an elephant'); a.man = G('And the man who runs Colossal'); a.close = G('close that gap overnight'); a.doesnt = G("He doesn't", a.close);
  const c1 = T.clip('C1'); a.c1 = c1 ? c1.start : a.doesnt + 1.4; a.c1e = c1 ? c1.end : a.c1 + 10;
  a.magic = G('No magic'); a.overnight = G('Nothing overnight', a.magic); a.handM = G("The machine doesn't hand over"); a.short = G('It hands over a short list'); a.somebody = G('somebody has to test it');
  a.how = G('But how would a machine even know'); a.pub = G('For the mammoth, Colossal has not shown'); a.october = G('This October, it did'); a.bird = G('A bird. The dodo', a.october); a.theDodo = G('The dodo', a.bird + .1);
  // c06
  a.harder = G('And the dodo is the harder'); a.g100 = G('there are about a hundred genomes', a.harder); a.forDodo = G('For the dodo, there is exactly one', a.harder); a.one = G('exactly one', a.forDodo);
  a.oneBird = G('One bird. Nothing to compare'); a.where = G('So where does a machine begin');
  a.living = G('With the living'); a.model = G('Colossal says its model', a.living); a.seventy = G('more than seventy living bird', a.living); a.theirDNA = G('their DNA, and', a.living); a.skulls = G('shape of their skulls', a.living);
  a.learned = G('That is how it learned'); a.beak = G('shape a beak', a.learned);
  a.T1 = G('Then it turned to the dodo');
  return a;
}

// ================================================================================================================= cameras
// world cameras: height above the snow = EYE − y; hz = horizon on screen (big hz: tilted up into the sky)
const CAM = {
  hut: C(-4250, -170, 7400, 500),        // the field station: hut, window, mast, the elephant in its light
  cut: C(-4400, -260, 7200, 330),        // tilted down to the snow in front of the hut (the cutaway opens here)
  el: C(-4330, -120, 8350, 640),         // the elephant at the hut, the sky above it for the strands
  elIn: C(-4360, -110, 8700, 620),       // pushed in (FUR · FAT · EARS)
  stack: C(-4200, -160, 7300, 960),      // tilted up: the stack of mammoth genomes in the sky
  fence: C(160, -30, 1950, 720),         // back at the fence: the empty snow where the animal stood
  read: C(160, -30, 2000, 725),         // tilted up from the fence: the stack, one strand read
  plain: C(-900, -650, 1250, 470),       // over the fence: the glittering plain
  blocks: C(-1000, -600, 1350, 1080),    // tilted up: the gene blocks gather in the sky
  big: C(-3700, -360, 5300, 830),       // panned left: the huge field of blocks over the small hut and elephant
  win: C(-5000, -180, 8900, 600),        // the hut window up close (the list beside it, the lab behind it)
  two: C(-4500, -250, 6600, 760),        // the hut and the elephant small, two lists in the sky
  card: C(-4520, -250, 6500, 1900),      // tilted up into the sky: the quote card
  strand: C(-4700, -260, 7000, 1500),    // tilted up from the mast: the strand the comb writes
};
const keysOf = (a) => [
  [a.T0 + .5, null],                                                                     // filled with the creep camera (see camAt)
  [a.T0 + 2.1, { x: -380, y: -430, z: 2620, hz: 545 }],                                  // rise over the family and the fence (no fly-through)
  [a.plan + .35, CAM.hut], [a.thaw + .1, CAM.cut], [a.frozenE + .9, { ...CAM.cut, z: CAM.cut.z + 120 }],
  [a.asian + .2, CAM.el], [a.part + .6, { ...CAM.el, z: CAM.el.z + 80 }], [a.fur - .2, CAM.elIn], [a.writes + .8, { ...CAM.elIn, z: CAM.elIn.z + 90 }],
  // c03
  [a.read + .1, { ...CAM.elIn, z: CAM.elIn.z + 100 }], [a.ground + .2, { ...CAM.cut, z: CAM.cut.z + 60 }], [a.holds + .1, { ...CAM.cut, z: CAM.cut.z + 160 }], [a.hundred, CAM.stack], [a.why - 1.7, { ...CAM.stack, z: CAM.stack.z + 100 }],
  [a.why + .45, { x: -420, y: -460, z: 2780, hz: 700 }], [a.why + 1.6, CAM.fence], [a.because + .1, { ...CAM.fence, z: CAM.fence.z + 50 }], [a.because + 1.95, CAM.read], [a.count - .6, { ...CAM.read, z: CAM.read.z + 60 }],
  [a.million + .5, CAM.plain], [a.study - 1.2, { ...CAM.plain, z: CAM.plain.z + 150 }], [a.study + .3, CAM.blocks], [a.sixteen + 1.4, { ...CAM.blocks, z: CAM.blocks.z + 80 }],
  // c04
  [a.ranking + .2, CAM.big], [a.about150 + 1, { ...CAM.big, z: CAM.big.z + 160 }], [a.tested + 2.0, CAM.win], [a.critics + .3, { ...CAM.win, z: CAM.win.z + 60 }], [a.notList + 1.4, { ...CAM.win, z: CAM.win.z + 140 }],
  // c05
  [a.from7 + 2.0, CAM.two], [a.doesnt + .2, { ...CAM.two, z: CAM.two.z + 120 }], [a.c1 + .9, CAM.card], [a.overnight + 1.3, { ...CAM.card, z: CAM.card.z + 140 }],
  [a.short + .1, { ...CAM.two, z: CAM.two.z + 300 }], [a.somebody + 1.0, { ...CAM.two, z: CAM.two.z + 420 }], [a.pub + .3, CAM.strand], [a.october + 2.4, { ...CAM.strand, z: CAM.strand.z + 120 }],
];

// ================================================================================================================= layout (screen px at the design camera)
const MSTR = { x: 440, w: 880, n: 60, h: 40 };   // the two strands over the hut: mammoth (y 250) over elephant (y 380)
const isD = (k) => k % 7 === 3, COLDK = [10, 31, 45];
const STK = { x: 520, y: 330, w: 880, n: 60, h: 24, pitch: 34, rows: 10 };   // the stack of mammoth genomes
const BL = { x: 520, y: 250, cols: 80, cell: 11, rowX: 260, rowY: 640, rowW: 1400, rowH: 190 };   // the gene blocks
const LIST7 = { x: 1180, y: 330, w: 300 }, LROWS = 9;
const DSTR = S.DODO_PLATE.strand;   // the strand of the dodo (x 560, y 740, w 800)

// ================================================================================================================= helpers
const lit = (t, t0, d = .6) => rise(span(t, t0 - .1, t0 + d));
const inOut = (t, a0, a1, d0 = .6, d1 = .5) => rise(span(t, a0, a0 + d0)) * (1 - expoIn(span(t, a1 - d1, a1)));
function txt(ctx, s, x, y, size, u, o = {}) { if (u <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); maskLine(ctx, [[s, 0]], x, y, size, u, { serif: false, weight: 600, col: o.col ?? P.core0, glow: o.glow ?? true, align: o.align }); ctx.restore(); }
// the tally with its label drawn separately (so a label can sink while the next rises); identical pixels to F.tally once a label is alone
function tally(ctx, t, o) {
  const r = F.tally(ctx, t, { ...o, label: o.labels && o.labels.length === 1 && o.labels[0][1] >= 1 ? o.labels[0][0] : null, lrise: 1 });
  if (!r || !o.labels) return;
  if (o.labels.length === 1 && o.labels[0][1] >= 1) return;
  const size = o.size ?? F.TALLY.size, x = o.x ?? F.TALLY.x, y = o.y ?? F.TALLY.y;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= o.a ?? 1;
  for (const [l, u] of o.labels) if (u > 0) maskLine(ctx, [[l, 0]], x + 4, y + size * .42, Math.round(size * .19), u, { serif: false, weight: 600, col: P.halo2, glow: false });
  ctx.restore();
}
// a strand drawn as a piece: the part [−frac/2, frac/2] of a full strand of length L centred at (cx, cy), rotated (shards; it completes)
function strandPiece(ctx, t, cx, cy, L, frac, rot, o) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.beginPath(); ctx.rect(-L * frac / 2, -o.h, L * frac, o.h * 2); ctx.clip();
  F.strand(ctx, t, -L / 2, 0, L, o); ctx.restore();
}
// points inside the dodo (module level, once): local units of F.dodo (s = 1), as drawn with dir −1
const DODO_PTS = (() => {
  const S0 = 300, cv = createCanvas(S0 * 2, S0 * 1.4), g = cv.getContext('2d');
  F.dodo(g, 0, S0, S0 * 1.25, S0, { dir: -1, light: 0, rim: '#ffffff' });
  const d = g.getImageData(0, 0, cv.width, cv.height).data, r = prng(2913), out = [];
  for (let tries = 0; out.length < 420 && tries < 60000; tries++) { const px = Math.floor(r() * cv.width), py = Math.floor(r() * cv.height); if (d[(py * cv.width + px) * 4 + 3] > 150) out.push([(px - S0) / S0, (py - S0 * 1.25) / S0, r()]); }
  return out;
})();
// the living birds of GenoMorph: 72 around the dodo (two blocks of 6 × 6), each with its own beak
const BIRDS = (() => {
  const r = prng(2955), out = [];
  for (let s = 0; s < 2; s++) for (let row = 0; row < 6; row++) for (let col = 0; col < 6; col++) {
    const x = s ? 1380 + col * 84 : 120 + col * 84, y = 336 + row * 76;
    out.push({ x: x + (r() - .5) * 12, y, s: 40 + r() * 12, side: s, col, row, beak: { len: r(), curve: r() * r(), depth: r() }, ph: r(), tone: r(), gold: [Math.floor(r() * 9), Math.floor(r() * 9), Math.floor(r() * 9)] });
  }
  return out;
})();

// ================================================================================================================= the take
const CACHE = new WeakMap();
export function b1(T) {
  if (CACHE.has(T)) return CACHE.get(T);
  const a = anchors(T), K = keysOf(a);
  const out = { a, K, draw: (ctx, t) => frame(ctx, t, T, a, K) };
  CACHE.set(T, out); return out;
}

export const camProbe = (T, t) => { const o = b1(T); return camAt(t, T, o.a, o.K); };   // review tool only

// the camera: the plate's creep for [T0, T0 + .5), then a blend from the creep into the path (no velocity step), drift fades in
function camAt(t, T, a, K) {
  const creep = S.creepCam(S.FENCE_C0, S.creep(t, T, 'The mice belong'), S.FENCE_ZF);
  K[0][1] = S.creepCam(S.FENCE_C0, S.creep(a.T0 + .5, T, 'The mice belong'), S.FENCE_ZF);
  let c = S.camPath(t, K);
  const b = sineIO(span(t, a.T0 + .5, a.T0 + 1.6));
  if (b < 1) c = E.cam3({ x: lerp(creep.x, c.x, b), y: lerp(creep.y, c.y, b), z: lerp(creep.z, c.z, b), hz: lerp(creep.hz, c.hz, b) });
  const dA = sineIO(span(t, a.T0 + .6, a.T0 + 3));
  return S.drift(c, t, 2600, .95 * dA, 31);   // calm (was 1.3)
}

function frame(ctx, t, T, a, K) {
  if (t < a.T0 + S.SEAM_HALF) { S.plateFence(ctx, t, T); return; }   // the seam in: exactly what c01 draws
  if (t >= a.T1 - S.SEAM_HALF) { S.plateDodo(ctx, t, T); return; }   // the seam out: exactly what c07 draws
  const portal = a.october + .5, full = portal + 2.3;              // the strand opens into the night stage of the dodo
  if (t >= full) { stageFrame(ctx, t, T, a); return; }
  const c = camAt(t, T, a, K);
  world(ctx, t, T, a, c);
  if (t > portal) {
    const m = sineIO(span(t, portal, full));
    const pin = A.skyPin(CAM.strand, DSTR.x, DSTR.y), [sx, sy] = A.skyPos(c, pin), dx = sx - DSTR.x, dy = sy - DSTR.y;
    const from = { x: DSTR.x + dx, y: DSTR.y + dy - 30, w: DSTR.w, h: 60 };
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const r = { x: lerp(from.x, 0, m), y: lerp(from.y, 0, m), w: lerp(from.w, W, m), h: lerp(from.h, H, m) };
    ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 18 * (1 - m)); ctx.clip();
    stageFrame(ctx, t, T, a, m);
    ctx.restore();
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); writtenStrand(ctx, t, a, sx, sy); ctx.restore();   // the strand stays on top while the stage opens around it
  }
}

// ================================================================================================================= THE WORLD (c02 – c05)
function world(ctx, t, T, a, c) {
  const elP = () => S.proj(c, EL.x, 0, EL.z);
  // ---- the elephant: FUR · FAT · EARS light on their words and the body changes a little, then relaxes ("doesn't change a single gene")
  const relax = sineIO(span(t, a.gene + .2, a.gene + 1.8));
  const gFur = lit(t, a.fur + .1) * (1 - relax), gFat = lit(t, a.fat + .1) * (1 - relax), gEar = lit(t, a.ears + .1) * (1 - relax);
  const fur = .32 * gFur, ears = 1 - .4 * gEar;
  const elephant = { x: EL.x, dir: -1, walk: null, fur, ears, dome: .12 * gFur, glowTrait: { fur: gFur, fat: gFat, ears: gEar },
    flick: bump(t, a.asian + .3, .9) + bump(t, a.ears + .2, .8) + bump(t, a.ranking + 2, .9) + bump(t, a.somebody - 1, .9), lift: .08 + .06 * Math.sin(t * .23), trunk: .04 * Math.sin(t * .5),
    breath: Math.max(span(t, a.take + 1, a.take + 3.6), span(t, a.trait - .5, a.trait + 2.1), span(t, a.still, a.still + 2.6), span(t, a.man, a.man + 2.6)) };
  // ---- the snow of differences (c03): all gold at 1.4 million, most go grey, the rest rise into the gene blocks
  const gl = { a: .45 };
  const goldOn = sineIO(span(t, a.count + .6, a.million + .9)), greyW = (g) => span(t, a.most + .6 + (1 - (g.z - 3500) / 22500) * 1.8, a.most + 1.2 + (1 - (g.z - 3500) / 22500) * 1.8);
  const pinB = A.skyPin(CAM.big, BL.x, BL.y);
  const keepG = (k) => (k * 2654435761 >>> 0) % 100 < 6;
  const flyT = (k) => a.some + .8 + ((k * 37) % 100) / 100 * 2.2;
  if (t > a.count && t < a.study + 4) {
    gl.pos = (k, g, sx, sy) => {
      let gold = goldOn, al = 1;
      if (!keepG(k)) { const w = greyW(g); gold *= 1 - w; al = 1 - .35 * w; return [sx, sy, al, gold]; }
      const u = sineIO(span(t, flyT(k), flyT(k) + 1.5)); if (u >= 1) return null;
      if (u > 0) { const [bx, by] = A.skyPos(c, pinB), b = (k * 131) % A.NB, tx = bx + (b % BL.cols) * BL.cell, ty = by + Math.floor(b / BL.cols) * BL.cell; return [lerp(sx, tx, u) + 40 * Math.sin(k) * Math.sin(Math.PI * u), lerp(sy, ty, u) - 90 * Math.sin(Math.PI * u), 1, 1]; }
      return [sx, sy, 1, gold];
    };
  }
  // ---- the hut: the window flares when the list goes in / the lab opens, the mast flares when the comb leaves it
  const winB = 1 + .7 * bump(t, a.short + 1.6, 2.2) + .5 * bump(t, a.critics, 1.4);
  const mastB = 1 + 1.6 * (bump(t, a.part + .1, 1.6) + bump(t, a.ranking + .1, 1.6) + bump(t, a.how + .2, 1.6));
  const st = {
    ...S.FENCE_ST, glint: gl, elephant, hut: { win: winB, mast: mastB },
    child: { look: lerp(.45, .2, sineIO(span(t, a.why + 1.8, a.why + 3.2))) },
  };
  S.fenceWorld(ctx, c, t, st);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  c02(ctx, t, a, c, elP);
  c03(ctx, t, a, c);
  c04(ctx, t, a, c, T);
  c05(ctx, t, a, c, T);
  ctx.restore();
}

// the slit in the snow in front of the hut and the cutaway that grows out of it (1.02, 1.07)
const SLIT = { x: -4380, z: 9050, w: 900 };
function slitAt(c) { const p = S.proj(c, SLIT.x, 0, SLIT.z); return p ? { x: p[0], y: p[1], w: SLIT.w * p[2] } : null; }
function cutPortal(ctx, t, c, m, o) {
  const s = slitAt(c); if (!s || m <= 0) return null;
  const to = { x: -20, y: s.y, w: W + 40, h: Math.max(10, H + 40 - s.y) };
  const from = { x: s.x - s.w / 2, y: s.y - 2, w: s.w, h: 4 };
  return F.portal(ctx, from, to, m, (cx, w, h) => A.cutaway(cx, t, w, h, o), { rim: F.FROST, r: 4, glow: false, rimA: .25 });
}

// ---------------------------------------------------------------------------------------------------------------- c02
function c02(ctx, t, a, c, elP) {
  if (t > a.read + 3) return;
  // 1.01 the company: a plate on the hut
  const hl = inOut(t, a.colossal + .1, a.thaw + .2, .7, .6);
  if (hl > 0) { const p = S.proj(c, HU.x + 160, HU.h + HU.roof * .6, HU.z); if (p) F.label(ctx, p[0], p[1], 'COLOSSAL', 'DALLAS', hl, { dx: 70, dy: -70, size: 30, col: LAMP }); }
  // 1.02 the cutaway: a frozen mammoth in the ice — NOT THIS
  const cutM = sineIO(span(t, a.thaw - .3, a.frozen + .2)) * (1 - sineIO(span(t, a.take + .9, a.take + 2.0)));
  const sl = slitAt(c);
  if (sl && t < a.take + 2.4) A.slit(ctx, sl.x, sl.y, sl.w, span(t, a.thaw - .7, a.thaw - .2) * (1 - span(t, a.take + 2.0, a.take + 2.4)));
  const r = cutPortal(ctx, t, c, cutM, { ice: 1 });
  if (r && cutM > .3) {
    const bx = 960, by = r.y + r.h * .52, u = span(t, a.frozen + .25, a.frozen + .9) * (1 - span(t, a.take + .6, a.take + 1.1));
    F.crossMark(ctx, bx, by - 20, 260, u, { w: 11 });
    const tu = inOut(t, a.frozen + .45, a.take + 1.2, .6, .5);
    txt(ctx, 'NOT THIS', bx + 260, by + 10, 64, tu);
  }
  const eL = inOut(t, a.asian + .1, a.rewrite + 1.6, .7, .6), pE = elP();
  if (eL > 0 && pE) F.label(ctx, pE[0] + EL.h * pE[2] * .62, pE[1] - EL.h * pE[2] * .7, 'ASIAN ELEPHANT', 'LIVING COUSIN', eL, { dx: 90, dy: -40, size: 32, col: LAMP });
  // 1.03 the mammoth's strand rises out of the snow where it lay; the elephant's strand grows out of the elephant; three rungs for the cold
  const pin = A.skyPin(CAM.el, MSTR.x, 250);
  const strOut = sineIO(span(t, a.ground - 1.4, a.ground + .2));   // c03: the camera tilts down, the strands leave at the top
  A.atSky(ctx, c, pin, (ox, oy) => {
    const mU = sineIO(span(t, a.take + 1.6, a.asian + .4));
    if (mU > 0 && strOut < 1) {
      // from the slit (screen) up to its place: it widens as it rises
      const s0 = slitAt(c), y0 = s0 ? s0.y - oy : 900, x0 = s0 ? s0.x - ox : 960;
      const cy = lerp(y0, 250, mU), cx = lerp(x0, MSTR.x + MSTR.w / 2, mU), fr = lerp(.12, 1, sineIO(span(mU, .3, 1)));
      const flagged = (k) => (isD(k) ? span(t, a.combs + .2 + (k / MSTR.n) * 3.6, a.combs + .5 + (k / MSTR.n) * 3.6) * (COLDK.includes(k) ? 1 : .55) : 0);
      strandPiece(ctx, t, cx, cy, MSTR.w, fr, 0, { n: MSTR.n, h: MSTR.h, seed: 41, diff: flagged, col: mixHex(F.FUR.tip, P.cream, .35) });
      if (mU > .9) txt(ctx, 'MAMMOTH', MSTR.x + ox, 250 - MSTR.h / 2 - 16 + oy, 20, span(mU, .9, 1) * (1 - strOut), { glow: false, col: P.halo2 });
    }
    // the elephant's strand: points rise from its back and become the rungs
    const eU = span(t, a.rewrite - .1, a.rewrite + 1.4);
    if (eU > 0 && strOut < 1) {
      const coldD = (k) => (COLDK.includes(k) ? lit(t, a.cold + .1 + COLDK.indexOf(k) * .22, .5) : 0) + (isD(k) && !COLDK.includes(k) ? .55 * span(t, a.combs + .2 + (k / MSTR.n) * 3.6, a.combs + .5 + (k / MSTR.n) * 3.6) : 0);
      F.strand(ctx, t, MSTR.x, 380, MSTR.w, { n: MSTR.n, h: MSTR.h, seed: 43, u: eU, diff: coldD, col: mixHex(P.blue1, P.cream, .35) });
      txt(ctx, 'ASIAN ELEPHANT', MSTR.x + ox, 380 - MSTR.h / 2 - 16 + oy, 20, span(eU, .3, .8) * (1 - strOut), { glow: false, col: P.halo2 });
      const p = elP();
      if (p && eU < 1) {
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        for (let k = 0; k < MSTR.n; k++) {
          const u = span(eU, k / MSTR.n * .85 - .2, k / MSTR.n * .85 + .02); if (u <= 0 || u >= 1) continue;
          const sx = p[0] - ox + (.3 - .5 * ((k * 7) % 10) / 10) * EL.h * p[2] * -1, sy = p[1] - oy - EL.h * p[2] * (.75 + .2 * ((k * 3) % 5) / 5), tx = MSTR.x + (k + .5) * MSTR.w / MSTR.n;
          const e = sineIO(u), x = lerp(sx, tx, e), y = lerp(sy, 380, e) - 60 * Math.sin(Math.PI * u);
          ctx.fillStyle = rgba(GOLD.core, .85 * Math.sin(Math.PI * u) + .15); ctx.fillRect(x - 2, y - 2, 4, 4);
        }
        ctx.restore();
      }
    }
    // 1.04 the comb leaves the mast and runs along the two strands (it reads, it flags)
    const mp = S.proj(c, HU.x + HU.mast.x, HU.mast.h + 10, HU.z);
    const go = span(t, a.part + .5, a.reported + .2), run = sineIO(span(t, a.combs + .2, a.combs + 4.0)), back = sineIO(span(t, a.gene + .3, a.gene + 1.9));
    const combA = rise(span(t, a.part + .4, a.part + .8)) * (1 - expoIn(span(t, a.writes + 1.2, a.writes + 1.8)));
    if (combA > 0 && mp) {
      const top = 250 - 46, bot = 380 + 46;
      let x = MSTR.x - 30;
      if (go < 1) {   // a cyan point travels from the mast light to the left end of the strands, then stands up as the comb
        const e = sineIO(go), px = lerp(mp[0] - ox, MSTR.x - 30, e), py = lerp(mp[1] - oy, (top + bot) / 2, e) - 80 * Math.sin(Math.PI * e);
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; halo(ctx, px, py, 26, .9, MACH.halo, MACH.core); ctx.restore();
        if (e > .8) A.vComb(ctx, px, lerp(py, top, span(e, .8, 1)), lerp(py, bot, span(e, .8, 1)), { a: span(e, .8, 1) });
      } else {
        x = lerp(MSTR.x - 30, MSTR.x + MSTR.w + 20, run) - (MSTR.w + 50) * .55 * back;
        A.vComb(ctx, x, top, bot, { a: combA, dir: back > 0 && back < 1 ? -1 : 1 });
      }
    }
    // 1.06 THE LIST unfolds out of the comb and writes itself
    const lu = sineIO(span(t, a.writes - .1, a.writes + .9));
    if (lu > 0 && t < a.ground + .5) {
      const top = 250 - 46, bot = 380 + 46, x = lerp(MSTR.x - 30, MSTR.x + MSTR.w + 20, run) - (MSTR.w + 50) * .55 * back;
      const rows = [['FUR', span(t, a.writes + .7, a.writes + 1.3), 1], ['FAT', span(t, a.writes + 1.1, a.writes + 1.7), 1], ['EARS', span(t, a.writes + 1.5, a.writes + 2.1), 1]];
      listFrom(ctx, t, { x: x - 2, y: top, w: 4, h: bot - top }, LIST_EL, lu, rows, 'THE LIST', listOut(t, a, c, ox, oy));
    }
  });
  // 1.04 the source line
  F.source(ctx, t, a.reported, a.fur - .2, F.SOURCES.aiRole, { y: 870 });
  // 1.05 three flags jump from the strands to the elephant's body: FUR · FAT · EARS
  const p = elP();
  if (p && t > a.fur - .6 && t < a.gene + 2.6) {
    const h = EL.h * p[2], [ox, oy] = (() => { const q = A.skyPos(c, pin); return [q[0] - pin.px, q[1] - pin.py]; })();
    const parts = [[a.fur, [.1, -.42], 'FUR', [-90, 60]], [a.fat, [-.2, -1.0], 'FAT', [-40, -80]], [a.ears, [.47, -.84], 'EARS', [-110, -70]]];
    parts.forEach(([t0, [u, v], lb, [dx, dy]], i) => {
      const k = COLDK[i], sx = MSTR.x + (k + .5) * MSTR.w / MSTR.n + ox, sy = 380 + oy, tx = p[0] - u * h, ty = p[1] + v * h;
      const f = sineIO(span(t, t0 - .5, t0 + .15));
      if (f > 0 && f < 1) { const x = lerp(sx, tx, f), y = lerp(sy, ty, f) - 120 * Math.sin(Math.PI * f); ctx.save(); ctx.globalCompositeOperation = 'lighter'; halo(ctx, x, y, 30, .9, GOLD.halo, GOLD.core); ctx.restore(); }
      const lu = lit(t, t0 + .15, .5) * (1 - expoIn(span(t, a.gene + 1.4, a.gene + 2.2)));
      if (lu > 0) F.label(ctx, tx, ty, lb, null, lu, { dx, dy, size: 30, col: GOLD });
    });
  }
}
const LIST_EL = { x: 1420, y: 150, w: 330 };
// the list's card from a source rect (the comb) to its place; rows written in cyan. out: { x, y, s } where it goes next (c03: into the snow)
function listFrom(ctx, t, from, to, u, rows, title, out) {
  const h = 70 + rows.length * 58 + 20, rx = lerp(from.x, to.x, u), ry = lerp(from.y, to.y, u), rw = lerp(from.w, to.w, u), rh = lerp(from.h, h, u);
  ctx.save();
  if (out) { ctx.translate(out.x, out.y); if (out.clip != null) { ctx.beginPath(); ctx.rect(-4000, -4000, 8000, out.clip + 4000); ctx.clip(); } }
  ctx.translate(rx, ry); ctx.scale(rw / to.w, rh / h);
  F.list(ctx, t, 0, 0, to.w, { rows: u < .98 ? rows.map(([s]) => [s, 0, 0]) : rows, title });
  ctx.restore();
}
// c03 1.07: the list slides down into the snow (into the slit): returns an offset in the sky group's frame, and a clip line
function listOut(t, a, c, ox, oy) {
  const u = sineIO(span(t, a.read + .2, a.ground - .1)); if (u <= 0) return null;
  const s = slitAt(c); if (!s) return null;
  const tx = s.x - ox - (LIST_EL.x + LIST_EL.w / 2), ty = s.y - oy - LIST_EL.y + 30;
  return { x: tx * u, y: ty * u, clip: s.y - oy - (LIST_EL.y + ty * u) + LIST_EL.y };
}

// ---------------------------------------------------------------------------------------------------------------- c03
function c03(ctx, t, a, c) {
  if (t < a.read - .2 || t > a.still + 3) return;
  // 1.07 the frozen ground: bones and short broken strands; 1.08 the pieces rise and complete into a stack of genomes
  const sl = slitAt(c);
  if (sl && t < a.holds + 2) A.slit(ctx, sl.x, sl.y, sl.w, span(t, a.read + .6, a.read + 1.1) * (1 - span(t, a.holds + 1.2, a.holds + 1.6)));
  const cutM = sineIO(span(t, a.ground - .4, a.ground + 1.0)) * (1 - sineIO(span(t, a.holds + .3, a.holds + 1.5)));
  const r = cutPortal(ctx, t, c, cutM, { bones: 1, shards: 0 });
  const pinS = A.skyPin(CAM.stack, STK.x, STK.y);
  const [psx, psy] = A.skyPos(c, pinS), ox = psx - pinS.px, oy = psy - pinS.py;
  const stOut = 0;
  const so = { n: STK.n, h: STK.h, seed: 0, col: mixHex(F.FUR.tip, P.cream, .45) };
  let gR = r; if (!gR && sl) gR = { x: -20, y: sl.y, w: W + 40, h: H + 40 - sl.y };
  const panDim = 1 - .8 * inOut(t, a.why - 1.9, a.because + .7, .9, 1.0);   // the stack sleeps while we fly back to the empty snow (calm)
  for (let k = 0; k < STK.rows; k++) {
    const t0 = a.holds + .1 + k * .12, u = sineIO(span(t, t0, t0 + 1.7)), comp = sineIO(span(t, a.hundred + .1 + k * .07, a.hundred + 1.0 + k * .07));
    const q = A.SHARDS7[k], tx = STK.x + STK.w / 2 + ox, ty = STK.y + k * STK.pitch + oy;
    const show = (t > a.ground + .3 && cutM > .3) || u > 0;
    const dis = span(t, a.count - .1 + k * .05, a.count + .7 + k * .05);   // 1.11 the genomes rain down: the snow lights gold
    if (!show || dis >= 1) continue;
    const g = gR ? [gR.x + q.x * gR.w, gR.y + q.y * gR.h] : [tx, ty];
    const x = lerp(g[0], tx, u), y = lerp(g[1], ty, u) - 50 * Math.sin(Math.PI * u), fr = lerp(q.w * 1420 / STK.w, 1, comp), rot = q.rot * (1 - u);
    const a1 = u > 0 ? 1 : cutM;
    // the top strand (k 0) is the one the comb reads in 1.10: its difference rungs light gold, one stays (READING ≠ KNOWING)
    const readU = span(t, a.because + 1.7, a.because + 2.7), stop = k === 0 ? lit(t, a.knowing + .1) : 0;
    const diff = k === 0 ? (j) => (j === 37 ? Math.max(stop, isD(j) && j / STK.n < readU ? .6 * (1 - span(t, a.knowing - .2, a.knowing + .4)) : 0) : (isD(j) && j / STK.n < readU ? .6 * (1 - span(t, a.knowing - .2, a.knowing + .4)) : 0)) : null;
    ctx.save(); ctx.globalAlpha *= a1 * (1 - dis) * panDim;
    strandPiece(ctx, t, x, y, STK.w, fr, rot, { ...so, seed: 300 + k, diff, a: lerp(.85, 1, comp) * (k === 0 ? 1 : 1 - .35 * span(t, a.because + .3, a.because + 1)) });
    ctx.restore();
  }
  // the rain: every third rung of the stack falls as a gold point onto a glint of the plain
  if (t > a.count - .2 && t < a.million + 1.6) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let k = 0; k < STK.rows; k++) for (let j = 1; j < STK.n; j += 3) {
      const t0 = a.count - .1 + k * .05 + (j / STK.n) * .5, u = span(t, t0, t0 + 1.3); if (u <= 0 || u >= 1) continue;
      const g = S.GLINTS[(k * 613 + j * 71) % S.GLINTS.length], q = S.proj(c, g.x, 0, g.z); if (!q) continue;
      const x0 = STK.x + (j + .5) * STK.w / STK.n + ox, y0 = STK.y + k * STK.pitch + oy, e = sineIO(u);
      const x = lerp(x0, q[0], e), y = lerp(y0, q[1], e * e);
      ctx.fillStyle = rgba(GOLD.core, .9 * Math.sin(Math.PI * Math.min(1, u * 1.2)) + .1); ctx.fillRect(x - 1.8, y - 1.8, 3.6, 3.6);
    }
    ctx.restore();
  }
  // the tally: ~100 MAMMOTH GENOMES
  const tU = inOut(t, a.hundred, a.why - .9, .6, .6);
  if (tU > 0) tally(ctx, t, { v: 100, pre: '~', rise: tU, labels: [['MAMMOTH GENOMES · PER COLOSSAL', tU]] });
  // 1.10 the comb reads the top strand end to end, then stops at one gold rung: READING ≠ KNOWING
  const rc = inOut(t, a.because + 1.5, a.count + .2, .25, .4);
  if (rc > 0) {
    const readU = sineIO(span(t, a.because + 1.7, a.because + 2.7)), backU = sineIO(span(t, a.knowing - .4, a.knowing + .4));
    const x0 = STK.x - 24, x1 = STK.x + STK.w + 24, xs = STK.x + (37 + .5) * STK.w / STK.n;
    const x = backU > 0 ? lerp(x1, xs + 14, backU) : lerp(x0, x1, readU);
    A.vComb(ctx, x + ox, STK.y - 30 + oy, STK.y + 30 + oy, { a: rc, dir: backU > 0 ? -1 : 1 });
    txt(ctx, 'READING ≠ KNOWING', 960 + ox, STK.y + (STK.rows - 1) * STK.pitch + STK.h + 80 + oy, 64, inOut(t, a.knowing + .2, a.count + .6, .6, .5), { align: 'center' });
  }
  // 1.11–1.13 the tally: 1,400,000 differences → 1,600 genes (the glints rise into the blocks)
  const t2 = inOut(t, a.million - .15, a.still + 3, .6, .6);
  if (t2 > 0) {
    const roll = span(t, a.sixteen - .1, a.sixteen + 1.1), sw = span(t, a.sixteen - .1, a.sixteen + .5), rk = c04Roll(t, a);
    if (t < a.still + .1) tally(ctx, t, { v: 1600, from: 1400000, u: roll, rise: t2, labels: [['DIFFERENCES IN THE DNA', 1 - sw], ['GENES', sw]] });
  }
  F.source(ctx, t, a.sixteen + .2, a.still + 2.4, F.SOURCES.genes1600, { y: 870 });
}
const c04Roll = () => 0;

// ---------------------------------------------------------------------------------------------------------------- c04
function c04(ctx, t, a, c, T) {
  if (t < a.some || t > a.from7 + 4) return;
  const pin = A.skyPin(CAM.big, BL.x, BL.y), [px, py] = A.skyPos(c, pin), ox = px - BL.x, oy = py - BL.y;
  // the blocks: they fill as the gold glints arrive (1.13), the comb from the mast ranks them into a row (1.15), the low end greys
  const fillT = (k) => a.some + 2.0 + (((k * 131) % A.NB) / A.NB) * .2 + ((k * 37) % 100) / 100 * 2.2;
  const combX = (u) => lerp(BL.x - 40, BL.x + BL.cols * BL.cell + 40, u);
  const sweep = sineIO(span(t, a.ranking + 1.5, a.drops + .4));
  const head = 150 + 14 * sineIO(span(t, a.rising - .1, a.rising + 1.4));
  const greyU = (i) => span(t, a.drops + .5 + (i / A.NB) * 1.2, a.drops + .9 + (i / A.NB) * 1.2);
  const toList = sineIO(span(t, a.tested + .2, a.tested + 2.2));
  const blkA = 1 - span(t, a.tested + .2, a.tested + 1.6);
  if (blkA > 0 && t < a.tested + 2) {
    ctx.save(); ctx.translate(ox, oy);
    A.blocks(ctx, t, { ...BL, u: (k) => span(t, fillT(k), fillT(k) + .35), rank: sweep, gold: (k, i) => (sweep < 1 ? 1 - .45 * sweep : (i < head ? 1 : 1 - greyU(i))), grey: (k, i) => (i >= head ? greyU(i) : 0), a: 1,
      hide: null });
    ctx.restore();
  }
  // the comb: up from the mast to the field, then across it (it ranks)
  const mp = S.proj(c, HU.x + HU.mast.x, HU.mast.h + 10, HU.z);
  const go = span(t, a.ranking + .3, a.ranking + 1.5), cA = rise(span(t, a.ranking + .2, a.ranking + .6)) * (1 - expoIn(span(t, a.drops + .4, a.drops + 1.0)));
  if (cA > 0 && mp) {
    const top = BL.y - 30 + oy, bot = BL.rowY + 20 + oy;
    if (go < 1) {
      const e = sineIO(go), x = lerp(mp[0], combX(0) + ox, e), y = lerp(mp[1], (top + bot) / 2, e);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; halo(ctx, x, y, 28, .9, MACH.halo, MACH.core); ctx.restore();
      if (e > .8) A.vComb(ctx, x, lerp(y, top, span(e, .8, 1)), lerp(y, bot, span(e, .8, 1)), { a: span(e, .8, 1) });
    } else A.vComb(ctx, combX(sweep) + ox, top, bot, { a: cA });
  }
  // the tally: 1,600 → ~150 → 7
  const sw1 = span(t, a.drops + .2, a.drops + .8), r1 = span(t, a.drops + .2, a.drops + 1.6);
  const sw2 = span(t, a.seven - .1, a.seven + .5), r2 = span(t, a.seven - .1, a.seven + 1.0), tOut = 1 - expoIn(span(t, a.from7 + .2, a.from7 + .8));
  if (t >= a.still + .1 && tOut > 0) {
    if (t < a.seven - .1) tally(ctx, t, { v: 150, from: 1600, u: r1, pre: r1 > .5 ? '~' : '', rise: 1, labels: [['GENES', 1 - sw1], ['GENES ON THE LIST', sw1]] });
    else tally(ctx, t, { v: 7, from: 150, u: r2, pre: r2 < .25 ? '~' : '', rise: tOut, labels: [['GENES ON THE LIST', 1 - sw2], ['GENES · TESTED IN MICE', sw2 * tOut]] });
  }
  F.source(ctx, t, a.own, a.tested + .6, F.SOURCES.genes150, { y: 870 });
  // 1.16 the gold head of the row flies down to the hut window and becomes THE LIST (seven rows lit)
  const lo = listPose(t, a, c);
  if (toList > 0 && lo && t < a.from7 + 1.4) {   // from here c05 carries the same card on
    const from = { x: BL.rowX + ox, y: BL.rowY - BL.rowH + oy, w: (head / A.NB) * BL.rowW, h: BL.rowH };
    drawList7(ctx, t, a, from, lo, toList);
  }
  // 1.17 the lab opens out of the window: the woolly mouse; THE EDITING ✓ · THE LIST ?
  const lOpen = sineIO(span(t, a.critics - .1, a.critics + 1.3)), lShut = sineIO(span(t, a.from7 + .1, a.from7 + 1.4)), lm = lOpen * (1 - lShut);
  if (lm > 0) {
    const from = S.winRect(c), mx = lerp(.34, .86, span(t, a.critics, a.from7 + 1));
    F.portal(ctx, from, { x: 0, y: 0, w: W, h: H }, lm, (cx, w, h) => {
      const z = 1 + .02 * (t - a.critics); cx.save(); cx.translate(w / 2, h / 2); cx.scale(z, z); cx.translate(-w / 2, -h / 2);
      S.lab(cx, t, w, h, { mouse: { x: mx, walk: t * 8, fur: 1 }, screen: { comb: (t * .2) % 1 } });
      cx.restore();
    }, { rim: LAMP, r: 14 * (1 - lm), glow: lm < .98 });
    if (lo) drawList7(ctx, t, a, null, lo, 1);   // the list stays in front of the lab
    const eu = inOut(t, a.prove + .3, a.from7 + .6, .6, .5), lu = inOut(t, a.notList - .1, a.from7 + .6, .6, .5);
    const ex = 1110, ew = F.measure('THE EDITING', 54, false, 600), lw = F.measure('THE LIST', 54, false, 600);
    if (eu > 0) { txt(ctx, 'THE EDITING', ex, 560, 54, eu); F.checkMark(ctx, ex + ew + 50, 542, 60, span(t, a.prove + .8, a.prove + 1.4), { a: eu }); }
    if (lu > 0) { txt(ctx, 'THE LIST', ex, 642, 54, lu); F.questionMark(ctx, t, ex + lw + 46, 648, 66, lu, { col: GOLD }); }
    F.source(ctx, t, a.critics + .3, a.from7 + .6, F.SOURCES.critics, { y: 870 });
  }
}
// where the list of seven sits: beside the hut window (screen, follows the camera), and in the lab: right of the glass box
function listPose(t, a, c) {
  const wr = S.winRect(c); if (!wr) return null;
  const side = { x: wr.x - 560, y: wr.y - 470, w: 270 };
  const inLab = { x: 90, y: 110, w: 300 };
  const m = sineIO(span(t, a.critics + .1, a.critics + 1.3)) * (1 - sineIO(span(t, a.from7 + .1, a.from7 + 1.4)));
  return { x: lerp(side.x, inLab.x, m), y: lerp(side.y, inLab.y, m), w: lerp(side.w, inLab.w, m) };
}
function list7Rows(t, a) {
  const rows = []; for (let k = 0; k < LROWS; k++) rows.push(['', 1, k < 7 ? lit(t, a.seven + k * .09, .4) : 0]);
  return rows;
}
function drawList7(ctx, t, a, from, to, u) {
  const rows = list7Rows(t, a), pitch = 40, h = 70 + rows.length * pitch + 20;
  const f = from || to, rx = lerp(f.x, to.x, u), ry = lerp(f.y, to.y, u), rw = lerp(f.w, to.w, u), rh = lerp(f.h ?? h * to.w / 300, h * to.w / 300, u);
  ctx.save(); ctx.translate(rx, ry); ctx.scale(rw / 300, rh / h);
  if (u < 1) { ctx.globalAlpha *= span(u, 0, .35); }
  F.list(ctx, t, 0, 0, 300, { rows, title: 'THE LIST', pitch, size: 22 });
  ctx.restore();
  // the tag on the seven rows: already known coat genes
  const tu = inOut(t, a.known + .3, a.from7 + .5, .9, .5);
  const tw = F.measure('ALREADY KNOWN COAT GENES', 22, false, 600) + 22 * 2.4 + 44;
  if (tu > 0) F.tag(ctx, t, rx + rw + tw / 2 + 6, ry + (70 + 3.5 * pitch) * rh / h, 'ALREADY KNOWN COAT GENES', tu, { size: 22, swing: -.04, len: 16 });
}

// ---------------------------------------------------------------------------------------------------------------- c05
const L1 = { x: 470, y: 230, w: 280 }, L2 = { x: 1150, y: 170, w: 280 }, L2ROWS = 34;
function c05(ctx, t, a, c, T) {
  if (t < a.from7 + 1.4) return;
  // 1.18 two lists in the sky: 7 (the mouse) → ~150 (the elephant); the gap between them
  const pin = A.skyPin(CAM.two, 0, 0), [px, py] = A.skyPos(c, pin), ox = px, oy = py;
  const wr = S.winRect(c);
  const up = sineIO(span(t, a.from7 + 1.4, a.from7 + 2.8));   // the list of seven rises from the window into the sky
  const side = listPose(t, a, c) || { x: L1.x + ox, y: L1.y + oy, w: L1.w };   // exactly where c04 left the card
  const p1 = { x: lerp(side.x, L1.x + ox, up), y: lerp(side.y, L1.y + oy, up), w: lerp(side.w, L1.w, up) };
  // the tilt up to the strand ('But how would'): the card sinks out of frame; it fades as it sinks so it never sits behind the subtitles (y > 880)
  const sink = 1 - sineIO(span(p1.y, L1.y + 120, L1.y + 380));
  if (t < a.how + 4 && sink > 0) { ctx.save(); ctx.globalAlpha *= sink; drawCard(ctx, t, p1.x, p1.y, p1.w, list7Rows(t, a), 40, 22, 'THE LIST'); ctx.restore(); }
  const cl = sineIO(span(t, a.to150 - .1, a.to150 + 1.5)), grow = sineIO(span(t, a.to150 + .6, a.to150 + 2.6));
  const into = sineIO(span(t, a.short + .5, a.short + 2.2));   // 1.20 it folds short and goes into the hut window
  if (cl > 0 && into < 1) {
    const rows = []; for (let k = 0; k < L2ROWS; k++) rows.push(['', k < LROWS ? 1 : clamp(grow * L2ROWS - k), 0]);   // the clone starts as a copy of the seven-card
    const x = lerp(p1.x, L2.x + ox, cl), y = lerp(p1.y, L2.y + oy, cl), pitch = lerp(40, 13, grow), shown = Math.max(LROWS, Math.round(lerp(LROWS, L2ROWS, grow)));
    const fold = sineIO(span(t, a.short + .1, a.short + .9)), tgt = wr ? { x: wr.x + wr.w * .5 - 60, y: wr.y + wr.h * .5 - 40, w: 120 } : { x, y, w: 280 };
    const fx = lerp(x, tgt.x, into), fy = lerp(y, tgt.y, into), fw = lerp(280, tgt.w, into) * (1 - .6 * into);
    ctx.save(); ctx.globalAlpha *= 1 - span(into, .75, 1);
    drawCard(ctx, t, fx, fy, fw, rows.slice(0, Math.round(lerp(shown, 6, fold))), lerp(pitch, 30, fold), 18, 'THE LIST');
    ctx.restore();
  }
  // the numbers over the two cards and the gap between them
  const nA = inOut(t, a.from7 + 1.6, a.c1 + .4, .7, .5), nB = inOut(t, a.to150 + 1.2, a.c1 + .4, .7, .5);
  if (nA > 0) { ctx.save(); maskLine(ctx, [['7', 0]], L1.x + ox + 4, L1.y + oy - 24, 96, nA, { serif: true, col: P.core0, glow: true }); ctx.restore(); }
  if (nB > 0) { ctx.save(); maskLine(ctx, [['~150', 0]], L2.x + ox + 4, L2.y + oy - 24, 96, nB, { serif: true, col: P.core0, glow: true }); ctx.restore(); }
  const gU = span(t, a.close - .2, a.close + .8) * (1 - span(t, a.c1, a.c1 + .5));
  if (gU > 0) {
    const y = L1.y + oy + 200, x0 = L1.x + ox + L1.w + 30, x1 = L2.x + ox - 30;
    ctx.save(); ctx.fillStyle = rgba(P.halo2, .8); for (let x = x0; x < lerp(x0, x1, expoOut(gU)); x += 18) ctx.fillRect(x, y - 1.5, 9, 3); ctx.restore();
  }
  // 1.19 C1: the quote card hangs in the sky (no footage, no photo)
  const cpin = A.skyPin(CAM.card, 0, 0), [qx, qy] = A.skyPos(c, cpin);
  const qa = rise(span(t, a.c1 - .3, a.c1 + .4)) * (1 - expoIn(span(t, a.magic - .4, a.magic + .2)));
  if (qa > 0) { ctx.save(); ctx.translate(qx, qy + 30 * span(t, a.magic - .4, a.magic + .2)); F.quoteCard(ctx, t, T, { id: 'C1', a: qa, credit: span(t, a.c1 + .6, a.c1 + 1.6), x: 300, y: 300, size: 62 }); ctx.restore(); }
  // 1.20 NO MAGIC. NOTHING OVERNIGHT. — then the short list goes into the window: SOMEBODY HAS TO TEST IT
  const m1 = inOut(t, a.magic, a.short, .6, .5), m2 = inOut(t, a.overnight, a.short, .6, .5);
  if (m1 > 0) { txt(ctx, 'NO MAGIC.', 960 + qx, 470 + qy, 92, m1, { align: 'center' }); txt(ctx, 'NOTHING OVERNIGHT.', 960 + qx, 580 + qy, 92, m2, { align: 'center' }); }
  const sb = inOut(t, a.somebody + .1, a.how + 1.2, .7, .6);
  if (sb > 0) txt(ctx, 'SOMEBODY HAS TO TEST IT', L2.x + ox + 120, L2.y + oy + 300, 56, sb, { align: 'center' });
  // 1.21 the comb leaves the mast and writes a strand into the sky; its middle stays blank (the step not shown); "it did": it fills
  const mp = S.proj(c, HU.x + HU.mast.x, HU.mast.h + 10, HU.z), spin = A.skyPin(CAM.strand, DSTR.x, DSTR.y), [sx, sy] = A.skyPos(c, spin);
  const go = span(t, a.how + .3, a.pub + .3);
  if (go > 0 && go < 1 && mp) { const e = sineIO(go), x = lerp(mp[0], sx - 24, e), y = lerp(mp[1], sy, e); ctx.save(); ctx.globalCompositeOperation = 'lighter'; halo(ctx, x, y, 28, .9, MACH.halo, MACH.core); ctx.restore(); }
  if (t > a.pub) writtenStrand(ctx, t, a, sx, sy);
}
function drawCard(ctx, t, x, y, w, rows, pitch, size, title) {
  ctx.save(); ctx.translate(x, y); ctx.scale(w / 300, w / 300); F.list(ctx, t, 0, 0, 300, { rows, title, pitch, size }); ctx.restore();
}
// the strand the comb writes (1.21) — the same strand the dodo stands over on the plate (n 70, h 40, seed 29)
const GAP = [27, 44];
function writtenStrand(ctx, t, a, x, y) {
  const n = 70, w = DSTR.w, pitch = w / n, wr = sineIO(span(t, a.pub + .2, a.pub + 3.0)), fill = sineIO(span(t, a.october + .2, a.october + 1.6));
  const xw = x + w * wr, g0 = x + GAP[0] * pitch, g1 = x + GAP[1] * pitch;
  const o = { n, h: 40, seed: 29 };
  const part = (l, r) => { if (r <= l) return; ctx.save(); ctx.beginPath(); ctx.rect(l, y - 40, r - l, 80); ctx.clip(); F.strand(ctx, t, x, y, w, o); ctx.restore(); };
  if (fill >= 1) part(x - 4, xw + 4);
  else {
    part(x - 4, Math.min(xw, g0)); part(g1, xw + (wr >= 1 ? 4 : 0)); part(g0, lerp(g0, g1, fill));
    if (xw > g0) {   // the blank middle: only a dashed outline where the rails would be
      ctx.save(); ctx.fillStyle = rgba(P.halo2, .45 * (1 - fill)); for (let xx = lerp(g0, g1, fill); xx < Math.min(xw, g1); xx += 14) { ctx.fillRect(xx, y - 22, 7, 2); ctx.fillRect(xx, y + 20, 7, 2); } ctx.restore();
    }
  }
  const q = inOut(t, a.pub + 2.6, a.october + .5, .6, .5);
  if (q > 0) F.questionMark(ctx, t, (g0 + g1) / 2, y + 26, 76, q, { col: GOLD });
  // the comb writing it, then sweeping the gap
  const cw = rise(span(t, a.pub, a.pub + .3)) * (1 - expoIn(span(t, a.october + 1.6, a.october + 2.1)));
  if (cw > 0) { const cx = fill > 0 ? lerp(g0, g1, fill) : xw; A.vComb(ctx, cx, y - 34, y + 34, { a: cw * (fill > 0 || wr < 1 ? 1 : .6) }); }
}

// ================================================================================================================= THE STAGE (the dodo)
function stageFrame(ctx, t, T, a, m = 1) {
  S.stage(ctx, t, { px: 0 });
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const d = S.DODO_PLATE;
  if (m >= 1) writtenStrand(ctx, t, a, DSTR.x, DSTR.y);
  // the dodo grows out of its strand: gold points rise from the rungs and build it (1.21 "A bird. The dodo.")
  const bU = (i) => span(t, a.bird - .2 + DODO_PTS[i][2] * 1.1, a.bird + .6 + DODO_PTS[i][2] * 1.1);
  const dA = sineIO(span(t, a.bird + .5, a.bird + 1.6));
  if (t > a.bird - .3 && dA < 1) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < DODO_PTS.length; i++) {
      const u = bU(i); if (u <= 0 || u >= 1) continue;
      const [px, py] = DODO_PTS[i], k = Math.floor(DODO_PTS[i][2] * 70), sx = DSTR.x + (k + .5) * DSTR.w / 70, e = sineIO(u);
      const x = lerp(sx, d.x + px * d.s, e) + 30 * Math.sin(i) * Math.sin(Math.PI * u), y = lerp(DSTR.y, d.y + py * d.s, e);
      ctx.fillStyle = rgba(GOLD.core, .9 * (1 - span(u, .8, 1))); ctx.fillRect(x - 1.8, y - 1.8, 3.6, 3.6);
    }
    ctx.restore();
  }
  if (dA > 0) F.dodo(ctx, t, d.x, d.y, d.s, { light: 1, dir: -1, a: dA });
  txt(ctx, 'THE DODO', 960, 850, 48, inOut(t, a.theDodo + .1, a.g100 - .6, .6, .5), { align: 'center' });
  F.source(ctx, t, a.october + 1, a.harder + 1, F.SOURCES.dodo, { y: 870 });
  // c06 1.22 ~100 mammoth genomes slide in from the left; the dodo has one
  const sIn = sineIO(span(t, a.g100 - 1.2, a.g100 + .6)) * (1 - sineIO(span(t, a.oneBird + .3, a.oneBird + 2.2)));
  if (sIn > 0) {
    const dx = lerp(-720, 0, sIn);
    for (let k = 0; k < 10; k++) F.strand(ctx, t, 110 + dx, 400 + k * 30, 460, { n: 34, h: 18, seed: 300 + k, col: mixHex(F.FUR.tip, P.cream, .45) });
    txt(ctx, 'MAMMOTH · ~100', 110 + dx, 740, 34, sIn > .95 ? 1 : 0, { glow: false });
  }
  const one = bump(t, a.one + .1, 1.6);
  if (one > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(GOLD.halo, .18 * one); ctx.fillRect(DSTR.x - 10, DSTR.y - 26, DSTR.w + 20, 52); ctx.restore(); }
  // the tally: 1 DODO GENOME → 70+ LIVING BIRD SPECIES
  const tr = rise(span(t, a.one, a.one + .6)), roll = span(t, a.seventy + .3, a.seventy + 1.5), sw = span(t, a.seventy + .3, a.seventy + .9);
  if (tr > 0) tally(ctx, t, { v: 70, from: 1, u: roll, plus: roll > .6 ? '+' : '', rise: tr, labels: [['DODO GENOME', 1 - sw], ['LIVING BIRD SPECIES', sw]] });
  F.source(ctx, t, a.model + .2, a.learned + 3.4, F.SOURCES.genomorph, { y: 870 });
  // 1.24★ the living birds hop in around the dodo: each with its strand and its skull; 1.25 the comb learns which rungs go with which beak
  if (t > a.living - .1) birds(ctx, t, a);
  ctx.restore();
}
function birds(ctx, t, a) {
  const L = a.learned, sweepL = sineIO(span(t, L + .1, L + 1.1)), sweepR = sineIO(span(t, L + 1.1, L + 2.1)), ex = Math.min(L + 2.2, a.T1 - 2.1);
  const bxL = [90, 580], bxR = [1350, 1840], combX = sweepR > 0 ? lerp(bxR[0], bxR[1], sweepR) : lerp(bxL[0], bxL[1], sweepL);
  for (let i = 0; i < BIRDS.length; i++) {
    const b = BIRDS[i], inner = b.side ? b.col : 5 - b.col, order = (inner * 6 + b.row) / 36;   // inner columns first in, outer first out
    const tin = a.living + .1 + order * 2.4, inU = span(t, tin, tin + 1.1);
    const tout = ex + (1 - order) * .6, outU = span(t, tout, tout + .85);
    if (inU <= 0 || outU >= 1) continue;
    const edge = b.side ? W + 80 : -80;
    let x = b.x, y = b.y, hop = 0;
    if (inU < 1) { const e = sineIO(inU); x = lerp(edge, b.x, e); hop = Math.abs(Math.sin(Math.PI * 3 * inU)); }
    else if (outU > 0) { const e = sineIO(outU); x = lerp(b.x, edge, e); hop = Math.abs(Math.sin(Math.PI * 3 * outU)); }
    y -= hop * 26;
    const passed = clamp((b.side ? (sweepR > 0 ? 1 : 0) : 1) * (b.side ? span(combX, b.x - 30, b.x + 10) : span(combX, b.x - 30, b.x + 10)));
    const learn = b.side ? (sweepR > 0 ? passed : 0) : (sweepL > 0 ? passed : 0);
    const col = mixHex(P.blue1, P.halo2, .2 + .25 * b.tone);
    A.birdSil(ctx, t, x, y, b.s, { beak: b.beak, col, learn, dir: b.side ? -1 : 1, skull: span(t, a.skulls + .1 + order * .8, a.skulls + .6 + order * .8) });
    const su = span(t, a.theirDNA + order * .9, a.theirDNA + .5 + order * .9);
    if (su > 0) F.strand(ctx, t, x - 28, y + 16, 56, { n: 9, h: 9, seed: 500 + i, u: su, diff: (k) => (b.gold.includes(k) ? learn : 0), col: mixHex(P.blue1, P.cream, .3) });
  }
  const cA = rise(span(t, L, L + .3)) * (1 - expoIn(span(t, L + 2.0, L + 2.4)));
  if (cA > 0) A.vComb(ctx, combX, 270, 790, { a: cA });
}
