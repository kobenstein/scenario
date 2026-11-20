// Film 29 · builder B2 · c07–c11 as ONE continuous take: T.G('Then it turned to the dodo') → T.G('Now take an American animal').
// Every scene file sc07 … sc11 returns ONE entry at its own R.a that calls the SAME draw function: inner chunk boundaries match frame
// for frame by construction (no plates inside the group). Plan: docs/shots.md 2.01–2.22 + M.01 · world: docs/MOTION.md.
//
//   c07  out of plateDodo (screen space, the night stage): the comb stands up at the strand and runs it; candidates light; the tally rolls
//        70+ → ~2,300 CANDIDATES · threads from the lit rungs to the beak, MIGHT. · the candidates drop into glass dishes on the bench,
//        each waits for its tick · living birds hop in along the bench, their light streams into the comb: IT LEARNS FROM THE LIVING ·
//        the stage folds into the hut's amber window (portal) →
//   c08  the fence, wide and calm (subscribe 1): a small list floats out of the window over the hut; the mast's light swells far away;
//        one quiet line · the list flies back into the window, the lab opens out of it: a clear printed shell in the incubator, a chick
//        hatches; the list leans on the bench, its rows tick · the lab folds back, the camera pulls back to the fence: the gate swings open:
//        IS IT A MAMMOTH?
//   c09  three white wolves walk in out of the snow to the open gate (3 ALIVE) · their names · "DIRE WOLVES" · PER COLOSSAL · a GRAY WOLF
//        strand rises out of the lead wolf, 20 edits light, guided by an old tooth out of the snow (13,000 YEARS) · the pack trots off
//        (2 YEARS · HEALTHY) · DIRE WOLVES? · the camera tilts up into the night sky: the quote cards live there (Q1 IUCN, picture only;
//        Q2 Shapiro, spoken) →
//   c10  down again: the wolves' white coats light as a trait, the species stays GRAY WOLF · ★ the elephant walks in behind the fence and
//        takes the cold traits (fur, fat, small ears light gold) · it walks away into the years: 2028 → EARLY 2030s → NO HARD DATE ·
//        up into the sky: Q3 (Lamm, picture only) · down: the empty snow, NO EMBRYO REPORTED, ~22 MONTHS · the elephant small and alone
//   c11  today's animals light behind the fence: THE BIGGER PRIZE · the horizon: Wrangel Island rises, the pyramids already stand ·
//        the last mammoth walks over the island's edge and is gone; frost closes over the picture from that point · it clears out of the
//        ice block: broken strand shards → plateIce (lib/f29_seams.mjs) at "Now take an American animal".
import * as E from './f10_editorial.mjs';
import * as F from './f29_kit.mjs';
import * as S from './f29_seams.mjs';
import * as A from './f29_b2_art.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, mixHex, halo, prng } = E;
const { rise, maskLine, GOLD, MACH, LAMP, FROST, bump } = F;

const C = (x, y, z, hz) => E.cam3({ x, y, z, f: F.F0, hz });
const WD = S.WORLD, HU = WD.hut;
const CACHE = new WeakMap();
export function take(T) { if (!CACHE.has(T)) CACHE.set(T, build(T)); return CACHE.get(T); }

// ================================================================================================================= anchors (phrases only)
function anchors(T) {
  const G = (p, after = -1, nth = 0) => T.G(p, nth, after);
  const a = {};
  a.T0 = G('Then it turned to the dodo'); a.came = G('and came back', a.T0); a.c23 = G('twenty-three hundred candidates', a.T0);
  a.places = G('Twenty-three hundred places', a.T0); a.beak = G('that famous beak', a.places); a.mightW = G('Might', a.beak);
  a.proof = G('Colossal itself says', a.places); a.every = G('Every candidate still', a.places); a.lab7 = G('in the lab', a.every);
  a.so = G('So that is how a machine', a.every); a.know = G("It doesn't know them", a.so); a.learns = G('It learns them', a.so); a.alive = G('from animals that are still alive', a.so);
  a.today = G('Today, the machine writes'); a.follow = G('The machines that follow', a.today); a.channel = G('This channel exists', a.today);
  a.want = G('Want that too', a.today); a.subscr = G('Then subscribe', a.today);
  a.notAnimal = G('A list is not an animal'); a.grow = G('Somebody still has to grow', a.notAnimal); a.egg = G('and a bird grows in an egg', a.notAnimal);
  a.spring = G('This spring, the company says', a.notAnimal); a.hatched = G('live chicks hatched', a.spring); a.glass = G('ever laid', a.hatched) + 1.2;   // vo-v3 'a shell no bird ever laid' · vo-v4 'an egg no bird ever laid'
  a.suppose = G('So suppose all of it works'); a.pick = G('Every pick, right', a.suppose); a.walks = G('Is the animal that walks out', a.suppose); a.aMam = G('a mammoth', a.walks);
  a.check = G('There is a way to check'); a.three = G('Three animals made by editing', a.check);
  a.names = G('Romulus, Remus', a.check); a.presented = G('Colossal presented them', a.names); a.cells = G('They began as gray wolf cells', a.names);
  a.edits = G('Twenty edits went in', a.cells); a.tooth = G('guided by DNA from a tooth', a.cells);
  a.oldest = G('Colossal says the oldest', a.tooth); a.pack = G('hunting as a pack', a.oldest); a.dire = G('So are they dire wolves', a.oldest);
  a.Q1 = T.clip('Q1'); a.Q2 = T.clip('Q2'); a.Q3 = T.clip('Q3');
  a.means = G('That is what', a.Q2.start - .5); a.traits = G('The traits come back', a.means); a.species = G('The species does not', a.means);
  a.tells = G('And it tells you what would', a.species); a.asian = G('An Asian elephant', a.tells); a.furW = G("with a mammoth's fur", a.asian);
  a.fat = G('fat', a.furW); a.ears = G('and small ears', a.furW); a.cold = G('An elephant built for the cold', a.asian);
  a.notSoon = G('And not soon', a.cold); a.promised = G('The first calf was once promised', a.notSoon); a.y28 = G('twenty twenty-eight', a.promised);
  a.early = G('Now Colossal says the early', a.promised); a.noDate = G('no hard date', a.early);
  a.hope = G('That is a hope', a.noDate); a.embryo = G('So far, nobody has reported', a.hope); a.pregnant = G('or a pregnant elephant', a.embryo);
  a.carries = G('And an elephant carries her calf', a.embryo); a.shaggy = G('So is one shaggy elephant', a.carries);
  a.isnt = G("It isn't", a.shaggy); a.prize = G('The bigger prize', a.isnt); a.shows = G('And the mammoth itself shows why', a.prize);
  a.last = G('The last mammoths died', a.shows); a.island = G('on a remote island', a.last); a.pyr = G('The great pyramids', a.last);
  a.nobody = G('But nobody was there', a.pyr); a.iceK = G('The ice kept only broken DNA', a.nobody); a.rebuilt = G('That is why every trait', a.iceK);
  a.dbd = G('difference by difference', a.rebuilt);
  a.T1 = G('Now take an American animal'); a.seam = a.T1 - S.SEAM_HALF;
  // derived beats
  a.fold0 = a.alive + 1.25; a.fold1 = Math.max(a.fold0 + 2.2, a.today + .45);                      // the stage folds into the hut window
  a.labOpen0 = a.grow - .45; a.labOpen1 = a.grow + 1.5; a.labShut0 = a.walks - .7; a.labShut1 = a.walks + .8;
  a.frostIn0 = a.nobody + 1.3; a.frostFull = a.iceK - .02; a.frostOut1 = a.iceK + 1.6;
  return a;
}

// ================================================================================================================= the dodo stage (c07)
const STR = { x: 560, y: 740, w: 800, n: 70 };
const CAND = (() => { const r = prng(2971), out = []; for (let k = 0; k < STR.n; k++) out.push(k > 2 && k < STR.n - 2 && r() < .3); return out; })();
const CIDX = CAND.map((c, k) => (c ? k : -1)).filter((k) => k >= 0);
const rungX = (k) => STR.x + (k + .5) * STR.w / STR.n;
const BEAK = [742, 276], BENCH = 846;
const dishX = (j) => 600 + j * (720 / Math.max(1, CIDX.length - 1));
const BIRDS = [[205, 64, 1, 0], [335, 54, 1, .35], [455, 72, 1, .7], [1470, 70, -1, .2], [1598, 56, -1, .55], [1725, 66, -1, .9]];   // [x, size, dir, delay]
const stageK = (t, a) => {   // the plate's creep (3 %/s) eases into a slow settle; then a slow pull back for the living birds
  const x = t - (a.T0 - .5), tau = 2.2;
  const k = x < 1 ? 1 + .03 * x : 1.03 + .024 * tau * (1 - Math.exp(-(x - 1) / tau)) + .006 * (x - 1);   // the creep slows to .6 %/s, never stops
  return k * lerp(1, .84, sineIO(span(t, a.so - .4, a.so + 3.4)));
};
function stageLocal(ctx, t, a) {   // in stage-local px (the plate's frame); the caller has applied the zoom
  // the bench line (grows from the strand's middle, later out to the frame edges for the birds)
  const bU = expoOut(span(t, a.every - .35, a.every + .5)), bW = expoOut(span(t, a.so - .2, a.so + 1.6));
  if (bU > 0) { const hw = 420 * bU + 1100 * bW; ctx.fillStyle = rgba(mixHex(P.blue1, P.cream, .25), .55); ctx.fillRect(960 - hw, BENCH, hw * 2, 2); }
  // the strand: lit where the comb has passed (the candidates); dimmer once their dots have gone to the dishes
  const cu = sineIO(span(t, a.T0 + .75, a.c23 + .3)), cX = STR.x + STR.w * cu;
  const fall = (j) => span(t, a.every + .15 + j * .05, a.every + 1.05 + j * .05);
  const lit = (k) => { if (!CAND[k]) return 0; const j = CIDX.indexOf(k); return clamp((cX - rungX(k)) / 26) * (1 - .55 * fall(j)) * (1 + .0 * j); };
  F.dodo(ctx, t, 960, 640, 400, { light: 1, dir: -1 });
  F.strand(ctx, t, STR.x, STR.y, STR.w, { n: STR.n, h: 40, seed: 29, diff: lit });
  // the beak lights (2,300 places that might have shaped it); thin gold threads from the candidates up to it
  const thIn = (j) => sineIO(span(t, a.places + .1 + j * .035, a.places + 1.3 + j * .035)), thOut = sineIO(span(t, a.every - .3, a.every + .5));
  const bg = rise(span(t, a.places + .7, a.places + 1.7)) * (1 - sineIO(span(t, a.every, a.every + 1.2)));
  if (bg > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; halo(ctx, BEAK[0], BEAK[1], 120, .55 * bg, GOLD.halo, GOLD.core); ctx.restore(); }
  if (t > a.places && thOut < 1) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(GOLD.line, .45); ctx.lineWidth = 1.3;
    CIDX.forEach((k, j) => {
      const u = thIn(j); if (u <= thOut) return; const x0 = rungX(k), y0 = STR.y - 22, cx = lerp(x0, BEAK[0], .35), cy = 470;
      ctx.beginPath(); for (let i = 0; i <= 20; i++) { const v = lerp(thOut, u, i / 20), q = 1 - v; const x = q * q * x0 + 2 * q * v * cx + v * v * BEAK[0], y = q * q * y0 + 2 * q * v * cy + v * v * BEAK[1]; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
    });
    ctx.restore();
  }
  // the comb: stands up at the strand's left end, runs it, then waits at the right end (the living birds' light flows into it)
  const cA = rise(span(t, a.T0 + .5, a.T0 + 1.1)), stand = expoOut(span(t, a.T0 + .5, a.T0 + 1.2)), learn = rise(span(t, a.learns, a.learns + 1.2));
  if (cA > 0) {
    A.comb(ctx, cX, STR.y - 58 * stand - 30 * learn, STR.y + 58 * stand, cA);
    if (learn > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; halo(ctx, cX, STR.y, 90 + 20 * Math.sin(t * 1.3), .35 * learn, MACH.halo, MACH.core); ctx.restore(); }
  }
  // the dishes on the bench: each candidate drops into one, waits for its tick (an empty ring)
  CIDX.forEach((k, j) => {
    const du = span(t, a.every - .1 + j * .04, a.every + .45 + j * .04), f = fall(j), ring = rise(span(t, a.lab7 + j * .03, a.lab7 + .6 + j * .03));
    A.dish(ctx, dishX(j), BENCH - 8, 15, du, { gold: rise(span(t, a.every + .95 + j * .05, a.every + 1.4 + j * .05)), ring });
    if (f > 0 && f < 1) { const e = sineIO(f), x = lerp(rungX(k), dishX(j), e), y = lerp(STR.y, BENCH - 9, e * e); halo(ctx, x, y, 14, .5, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.core; ctx.beginPath(); ctx.arc(x, y, 3.3, 0, Math.PI * 2); ctx.fill(); }
  });
  // MIGHT. (one word)
  const mU = rise(span(t, a.mightW - .05, a.mightW + .5)) * (1 - sineIO(span(t, a.every - .2, a.every + .4)));
  if (mU > 0) maskLine(ctx, [['MIGHT.', 0]], 1150, 360, 96, mU, { serif: false, weight: 600, col: P.core0, glow: true });
  // the living birds hop in along the bench from beyond the frame; their light streams into the comb
  if (t > a.so) {
    const alive = rise(span(t, a.alive - .1, a.alive + 1)), flow = rise(span(t, a.learns - .2, a.learns + .9));
    for (const [xf, s, dir, dl] of BIRDS) {
      const t0 = a.so + .3 + dl, p = sineIO(span(t, t0, t0 + 2.6)) * 5, i = Math.min(4, Math.floor(p)), fr = p >= 5 ? 1 : p - i;
      const xs = xf - dir * 760, x = lerp(xs, xf, (i + sineIO(fr)) / 5), hop = p >= 5 ? 0 : fr;
      if (alive > 0) halo(ctx, x, BENCH - s * .45, s * 1.6, .35 * alive, GOLD.halo, GOLD.body);
      F.bird(ctx, t, x, BENCH, s, { dir, hop });
      if (flow > 0 && p >= 5) {   // a stream of gold points from the bird up over the stage into the comb
        const x0 = x + dir * s * .2, y0 = BENCH - s * .75, x1 = cX, y1 = STR.y - 40, cx = lerp(x0, x1, .5), cy = 240 + (xf % 7) * 18;
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        for (let q = 0; q < 9; q++) { const v = ((t - a.learns) * .32 + q / 9 + xf * .001) % 1, w = 1 - v, px = w * w * x0 + 2 * w * v * cx + v * v * x1, py = w * w * y0 + 2 * w * v * cy + v * v * y1; ctx.fillStyle = rgba(GOLD.core, .75 * flow * Math.sin(Math.PI * v)); ctx.fillRect(px - 1.6, py - 1.6, 3.2, 3.2); }
        ctx.restore();
      }
    }
  }
  // IT LEARNS FROM THE LIVING
  const lU = rise(span(t, a.learns - .1, a.learns + .6));
  if (lU > 0) F.accentText(ctx, [['IT LEARNS FROM THE ', 0], ['LIVING', 1]], 960, 150, 54, lU, { serif: false, weight: 600, align: 'center', acc: GOLD });
}
function drawStage(ctx, t, a, portal = false) {
  const K = stageK(t, a), ramp = sineIO(span(t, a.T0 + .5, a.T0 + 3.5)), dx = (40 * Math.sin(t * .3) + E.drift(t, 8, 7)) * ramp, dy = (24 * Math.cos(t * .3) + E.drift(t, 5, 9)) * ramp;   // a slow ellipse: never still
  S.stage(ctx, t, { px: 80 * (K - 1) });
  ctx.save(); ctx.translate(960, 640); ctx.scale(K, K); ctx.translate(-960 - 40 * (K - 1) + dx, -640 + dy);
  stageLocal(ctx, t, a);
  ctx.restore();
  if (portal) return;
  // the tally (screen space): 70+ LIVING BIRD SPECIES rolls to ~2,300 CANDIDATES, then sinks
  const ru = span(t, a.c23 - .05, a.c23 + 1.25), out = 1 - sineIO(span(t, a.so - .7, a.so - .1));
  if (out > 0) {
    const TL = F.TALLY, v = ru >= 1 ? 2300 : Math.exp(lerp(Math.log(70), Math.log(2300), expoOut(ru))), roll = ru > 0 && ru < 1 ? 1 - expoOut(ru) : 0;
    const s = ru > 0 ? '~' + F.fmt(v) : '70+';
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    maskLine(ctx, [[s, 0]], TL.x, TL.y + roll * TL.size * .06, TL.size, out, { serif: true, col: P.core0, glow: true });
    const l0 = 1 - sineIO(span(t, a.c23 - .5, a.c23)), l1 = rise(span(t, a.c23 + .1, a.c23 + .7)) * out, ls = Math.round(TL.size * .19);
    if (l0 > 0) maskLine(ctx, [['LIVING BIRD SPECIES', 0]], TL.x + 4, TL.y + TL.size * .42, ls, Math.min(l0, out), { serif: false, weight: 600, col: P.halo2, glow: false });
    if (l1 > 0) maskLine(ctx, [['CANDIDATES', 0]], TL.x + 4, TL.y + TL.size * .42, ls, l1, { serif: false, weight: 600, col: P.halo2, glow: false });
    ctx.restore();
  }
  F.source(ctx, t, a.proof + .2, a.so + .4, F.SOURCES.candidates, { y: 870 });
}

// ================================================================================================================= the world (c08–c11)
// cameras: C(x, y, z, hz): height above the snow = EYE − y; hz = the horizon on screen
const SKY = 1000;   // a tilt up into the sky = the same camera with the horizon SKY px lower (the quote cards live in the sky)
const up = (c, k = 1) => ({ ...c, hz: c.hz + SKY * k });
const CAM = {
  sub: C(-560, -160, 200, 630),          // subscribe 1: the fence wide and calm, the hut left, you and the child right of centre
  sub2: C(-900, -180, 1000, 634),
  hut: C(-4250, -170, 7400, 540),        // pushed toward the hut window (the list flies in, the lab opens)
  gate: C(330, -130, 1000, 540),           // the fence with the gate (right), you and the child (left)
  gate2: C(820, -250, 1700, 470),
  wolf: C(520, -240, 1900, 480),         // the wolves mid-distance behind the open gate
  wolf2: C(430, -240, 2050, 486),
  trait: C(600, -200, 2200, 500),        // down from the sky: the wolves' coats lit
  trait2: C(540, -200, 2150, 505),
  ele: C(-820, -60, 1420, 600),          // ★ behind you: the cold elephant behind the fence
  ele2: C(-730, -75, 1820, 588),
  empty: C(-560, -120, 1200, 600),       // the snow where the calf should be; the elephant small far away
  empty2: C(-510, -145, 560, 612),
  today: C(-80, -150, 520, 600),         // today's animals behind the fence (right)
  horizon: C(500, -260, 1750, 680),       // up: the horizon in the middle, the island far right
  horizon2: C(780, -290, 2150, 694),
};
const ICE_A = S.look(S.ICE.x - 60, 260, S.ICE.z, .98, 960, 690, 540);
function worldKeys(a) {
  return [
    [a.fold0 - 2.5, C(-430, -150, -250, 628)], [a.fold0, CAM.sub], [a.notAnimal - .1, CAM.sub2],   // already moving when the stage folds in
    [a.labOpen0 + .2, CAM.hut], [a.labShut1 + .1, CAM.hut],
    [a.aMam + .3, CAM.gate], [a.names - .5, CAM.gate2],
    [a.oldest + .3, CAM.wolf], [a.dire + 1.15, CAM.wolf2],
    [a.Q1.start + .55, up(CAM.wolf2)], [a.Q1.end - 1.0, up(CAM.wolf2, 1.07)], [a.Q2.start + .2, up(CAM.wolf2, 2)], [a.Q2.end + .25, up(CAM.wolf2, 2.03)],
    [a.means + 1.7, CAM.trait], [a.tells + .2, CAM.trait2],
    [a.cold - .6, CAM.ele], [a.noDate + .1, CAM.ele2],
    [a.Q3.start + .3, up(CAM.ele2)], [a.hope + 2.3, up(CAM.ele2, 1.05)],
    [a.embryo + .9, CAM.empty], [a.shaggy + .3, CAM.empty2],
    [a.prize + 1.2, CAM.today], [a.last + 1.1, CAM.horizon], [a.frostFull, CAM.horizon2],
  ];
}
function iceKeys(a) { return [[a.frostFull, ICE_A], [a.seam, S.ICE_CAM]]; }

// the three white wolves: paths [t, x, z] (behind the fence), walk phase from the distance walked
const WOLVES = [{ dx: 0, dz: 0, h: 92, lead: 1 }, { dx: 200, dz: 230, h: 84 }, { dx: 380, dz: 90, h: 88 }];
function wolfPath(a) {
  return [[a.check + .2, 2900, 3800], [a.names - .3, 1060, 3720], [a.oldest + 1.0, 1000, 3760], [a.dire + .4, 300, 4700],
    [a.tells + 1.0, -100, 5200], [a.cold + 4, -900, 9800], [a.y28 + 6, -1700, 16000], [a.shaggy + 20, -2600, 24000]];
}
const pathAt = (P0, t) => { if (t <= P0[0][0]) return [P0[0][1], P0[0][2], 0]; for (let i = 1; i < P0.length; i++) if (t < P0[i][0]) { const [t0, x0, z0] = P0[i - 1], [t1, x1, z1] = P0[i], u = sineIO((t - t0) / (t1 - t0)); return [lerp(x0, x1, u), lerp(z0, z1, u), i]; } const l = P0[P0.length - 1]; return [l[1], l[2], P0.length]; };
// distance walked along the path up to t (for the leg phase: feet never slide)
const walked = (P0, t) => { let d = 0; for (let i = 1; i < P0.length; i++) { const [t0, x0, z0] = P0[i - 1], [t1, x1, z1] = P0[i]; if (t <= t0) break; const u = sineIO(Math.min(1, (t - t0) / (t1 - t0))); d += Math.hypot(x1 - x0, z1 - z0) * u; } return d; };
// the elephant: walks in from the left behind the fence, takes the cold traits, walks away into the years
function elePath(a) { return [[a.tells - .3, -3600, 4900], [a.asian + .4, -1450, 4900], [a.promised + .2, -1450, 4900], [a.Q3.start + .2, -820, 9400]]; }

function build(T) {
  E.prepareEditorial();
  const a = anchors(T), K = worldKeys(a), KI = iceKeys(a), WP = wolfPath(a), EP = elePath(a);
  const EDIT = (() => { const r = prng(2993), ks = []; while (ks.length < 20) { const k = 2 + Math.floor(r() * 56); if (!ks.includes(k)) ks.push(k); } return ks; })();
  return (ctx, t) => {
    if (t < a.T0 + S.SEAM_HALF) { S.plateDodo(ctx, t, T); return; }   // the seam (B1 → B2): exactly the plate
    if (t >= a.seam) { S.plateIce(ctx, t, T); return; }                // the seam (B2 → B3)
    if (t < a.fold0) { drawStage(ctx, t, a); return; }
    world(ctx, t);
  };

  // ---------------------------------------------------------------------------------------------------------------- the world pass
  function world(ctx, t) {
    const iceW = t >= a.frostFull;
    let c;
    if (!iceW) { c = S.camPath(t, K); c = S.drift(c, t, 2600, 1.0, 47); }
    else { const dA = 1 - sineIO(span(t, a.dbd - .2, a.seam - .1)); c = S.camPath(t, KI); c = S.drift(c, t, 3000, .45 * dA, 53); }
    const sky = (y) => y + (c.hz - 560);                                   // screen y of something that lives in the sky (scrolls with a tilt)
    if (iceW) {   // the ice: no fence, no people, no animals (exactly the plate's world), the block in the snow
      const sh = lerp(.35, 1, sineIO(span(t, a.iceK + .3, a.iceK + 1.6)));
      S.fenceWorld(ctx, c, t, { ...S.ICE_ST, back: (cx) => S.at(cx, c, S.ICE.x, S.ICE.z, () => S.iceBlock(cx, t, 0, 0, S.ICE.s, { shards: sh })) });
      const pb = S.proj(c, S.ICE.x, S.ICE.s * .4, S.ICE.z);
      const r = sineIO(span(t, a.frostFull + .12, a.frostOut1)) * 1500; if (r < 1499) A.frostMask(ctx, t, pb ? pb[0] : 960, pb ? pb[1] : 560, r);
      return;
    }
    // ---- the gate (opens before "a mammoth?", shuts while the camera looks at the sky for Q3)
    const open = sineIO(span(t, a.walks + 1.1, a.aMam + 1.5)) * (1 - sineIO(span(t, a.Q3.start + .5, a.Q3.start + 2.6)));
    // ---- the white wolves
    const wolvesOn = t > a.check && t < a.shaggy + 20;
    const wolvesBack = (cx) => {
      if (!wolvesOn) return;
      const [x, z] = pathAt(WP, t), d = walked(WP, t), trot = span(t, a.oldest + .8, a.oldest + 1.6) * (1 - span(t, a.dire + .2, a.dire + 1));
      const trait = rise(span(t, a.traits - .1, a.traits + .9)) * (1 - sineIO(span(t, a.cold, a.cold + 2)));
      const ws = WOLVES.map((w, j) => ({ ...w, x: x + w.dx - j * 20 * Math.sin(t * .3 + j), z: z + w.dz, j })).sort((p, q) => q.z - p.z);
      for (const w of ws) {
        const p = S.proj(c, w.x, 0, w.z); if (!p || p[0] < -200 || p[0] > W + 200) continue;
        const h = w.h * p[2]; if (trait > 0) halo(cx, p[0], p[1] - h * .6, h * 2.4, .45 * trait, GOLD.halo, GOLD.body);
        F.wolf(cx, t, p[0], p[1], h, { dir: -1, pale: 1, walk: d * (.06 + .02 * trot) + w.j * 1.9, look: .15 + .2 * Math.sin(t * .4 + w.j), rim: mixHex(P.cream, GOLD.body, trait) });
      }
    };
    // ---- the elephant behind the fence (one body: elephant → the traits of the cold)
    const eleOn = t > a.tells - .4;
    let beast = false;
    if (eleOn) {
      const [x, z] = pathAt(EP, t), d = walked(EP, t), fu = sineIO(span(t, a.furW + .2, a.furW + 1.4)), ea = sineIO(span(t, a.ears + .2, a.ears + 1.4)), fa = sineIO(span(t, a.fat, a.fat + 1.2));
      const glowOut = 1 - .65 * sineIO(span(t, a.notSoon, a.notSoon + 2.5));
      beast = { x, z, h: 300, dir: 1, ...F.ELEPHANT, fur: lerp(0, F.COLD.fur, fu), ears: lerp(1, F.COLD.ears, ea), dome: lerp(0, F.COLD.dome, fa), tusk: lerp(0, F.COLD.tusk, fu),
        walk: d * .016, shade: .12, rim: LAMP.halo, rimA: .7, lift: .25 * sineIO(span(t, a.cold - .2, a.cold + 1.2)) * (1 - span(t, a.promised, a.promised + 2)) + .03 * Math.sin(t * .5),
        glowTrait: { fur: rise(span(t, a.furW + .2, a.furW + .8)) * glowOut, fat: rise(span(t, a.fat, a.fat + .6)) * glowOut, ears: rise(span(t, a.ears + .25, a.ears + .85)) * glowOut },
        breath: span(t, a.cold + .4, a.cold + 3), flick: bump(t, a.ears + .3, .9) };
    }
    // ---- today's animals (they wait in the snow from frame 0; the wolf comes back in from the right in c11 and they light)
    const lit = (t0) => rise(span(t, t0 - .1, t0 + .7));
    const wolfIn = sineIO(span(t, a.isnt - .3, a.prize + 1.6));
    const st = {
      glint: { a: .42 }, hut: { win: 1 + .8 * bump(t, a.fold1 - 1.3, 2) + .6 * bump(t, a.notAnimal + .6, 1.8), mast: 1 },
      you: { hold: 1, look: .3 + .15 * sineIO(span(t, a.check, a.check + 1.5)) * (1 - span(t, a.cold, a.cold + 2)) }, child: { look: .45 + .15 * sineIO(span(t, a.check + .5, a.check + 2)) },
      ferret: { lit: lit(a.prize + .4) }, bird: { lit: lit(a.prize + .9), hop: span(t, a.prize + .9, a.prize + 1.4) },
      wolf: t > a.isnt - .4 ? { x: lerp(2900, WD.wolf.x, wolfIn), walk: lerp(2900, WD.wolf.x, wolfIn) * .05, lit: lit(a.prize + 1.5), look: .3 * lit(a.prize + 1.5) } : false,
      beast, back: wolvesBack,
      extra: (cx) => extra(cx, c, t),
    };
    // the horizon (c11): the island far north rises; the pyramids already stand; the last mammoths on the island
    if (t > a.last - 1) st.back = (cx) => { wolvesBack(cx); horizon(cx, c, t); };
    S.fenceWorld(ctx, c, t, st);
    if (open > .003) { A.gatePatch(ctx, c, t, st); A.gatePanel(ctx, c, t, open); }
    else if (t > a.walks) A.gatePanel(ctx, c, t, 0);
    texts(ctx, c, t, sky, open);
    // ---- the stage folding into the window (c07 → c08)
    if (t < a.fold1) {
      const m = 1 - sineIO(span(t, a.fold0, a.fold1)), from = S.winRect(c);
      F.portal(ctx, from, { x: 0, y: 0, w: W, h: H }, m, (cx) => drawStage(cx, t, a, true), { rim: LAMP, r: 14 * (1 - m), glow: m < .98, rimA: clamp((1 - m) * 6) });
    }
    // ---- the lab behind the window (2.05–2.06)
    const lm = sineIO(span(t, a.labOpen0, a.labOpen1)) * (1 - sineIO(span(t, a.labShut0, a.labShut1)));
    if (lm > 0) {
      F.portal(ctx, S.winRect(c), { x: 0, y: 0, w: W, h: H }, lm, (cx, w, h) => {
        const z = 1 + .018 * (t - a.labOpen0); cx.save(); cx.translate(w / 2, h / 2); cx.scale(z, z); cx.translate(-w / 2 + 14 * Math.sin(t * .3) + E.drift(t, 5, 3), -h / 2 + 8 * Math.cos(t * .3) + E.drift(t, 3, 5));
        S.lab(cx, t, w, h, { lamp: .85, mouse: false, screen: { comb: 1 }, extra: (lx) => labExtra(lx, t, w, h) });
        cx.restore();
      }, { rim: LAMP, r: 14 * (1 - lm), glow: lm < .98, rimA: clamp((1 - lm) * 6) });
      F.source(ctx, t, a.spring + .4, a.suppose - .1, F.SOURCES.chicks, { y: 870 });
    }
    // ---- the frost closes over the picture from the last mammoth's island (2.21)
    if (t > a.frostIn0) { const ip = islandPt(c); A.frostMask(ctx, t, ip[0] + 40, ip[1], (1 - sineIO(span(t, a.frostIn0, a.frostFull))) * 1500); }
  }

  // ---------------------------------------------------------------------------------------------------------------- the list over the hut (M.01)
  function extra(cx, c, t) {
    // the list floats out of the window, small over the hut; flies back in at "A list is not an animal"
    const outU = sineIO(span(t, a.today + .1, a.today + 1.6)), back = sineIO(span(t, a.notAnimal - .1, a.notAnimal + 1.5));
    if (outU > 0 && back < 1) {
      const wr = S.winRect(c), p = S.proj(c, HU.x + 60, HU.h + HU.roof + 330, HU.z); if (!wr || !p) return;
      const wx = wr.x + wr.w / 2, wy = wr.y + wr.h / 2, u = outU * (1 - back), sc = lerp(.03, .4, u) * p[2] / .15;
      const x = lerp(wx, p[0], u), y = lerp(wy, p[1], u) + 3 * Math.sin(t * .8) * u;
      const rows = [0, 1, 2, 3].map((k) => [null, sineIO(span(t, a.today + 1.0 + k * .4, a.today + 1.6 + k * .4)), 0]);
      cx.save(); cx.translate(x, y); cx.scale(sc, sc); cx.rotate(-.04 + .015 * Math.sin(t * .5));
      F.list(cx, t, -130, -130, 260, { rows, pitch: 52 });
      cx.restore();
    }
    // the machines that follow: the mast's light swells far away (a bigger glow, no orb: it stays the mast's light)
    const sw = bump(t, a.follow + .2, 3.4);
    if (sw > 0) { const pm = S.proj(c, HU.x + HU.mast.x, HU.mast.h + 10, HU.z); if (pm) { cx.save(); cx.globalCompositeOperation = 'lighter'; halo(cx, pm[0], pm[1], Math.max(30, 1500 * pm[2]) * (1 + sw), .3 * sw, MACH.halo, MACH.core); cx.restore(); } }
  }

  // ---------------------------------------------------------------------------------------------------------------- the lab: the clear shell, the chick, the list
  function labExtra(cx, t, w, h) {
    const by = h * .7, ex = w * .1 + w * .42 * .46, ey = by - h * .3 * .1, hatch = sineIO(span(t, a.hatched - .2, a.hatched + 1.1));
    A.egg(cx, t, ex, ey, 230, { hatch });
    if (hatch > .35) {   // the chick stands up out of the shell and steps out
      const up = rise(span(t, a.hatched + .2, a.hatched + 1.3)), step = sineIO(span(t, a.glass - .3, a.glass + 1.8));
      A.chick(cx, t, ex + 150 * step, ey - 70 * (1 - up) * (1 - step), 120, { dir: 1, look: .2 * Math.sin(t * .7), peck: bump(t, a.glass + 2.2, .5) });
    }
    // the list leans on the bench; at "Every pick, right" its rows tick
    const rows = [0, 1, 2, 3].map((k) => [null, 1, sineIO(span(t, a.pick + k * .22, a.pick + .5 + k * .22))]);
    const lx = w * .63, ly = by - 236;
    cx.save(); cx.translate(lx, ly); cx.rotate(-.05);
    F.list(cx, t, 0, 0, 300, { rows, pitch: 46 });
    rows.forEach((r, k) => F.checkMark(cx, 262, 30 + k * 46 + 46 * .62 - 8, 30, span(t, a.pick + k * .22, a.pick + .45 + k * .22)));
    cx.restore();
  }

  // ---------------------------------------------------------------------------------------------------------------- the horizon (c11)
  function islandPt(c) { const p = S.proj(c, 9800, 0, 30000); return [p ? p[0] : 1300, (c.hz ?? 560) - 2]; }
  function horizon(cx, c, t) {
    const [ix, iy] = islandPt(c), iu = span(t, a.last + .3, a.last + 2.2), s = 420;
    const top = A.island(cx, t, ix, iy, s, iu);
    // the last mammoths: three small ones on the island; the last walks over its far edge and is gone (below the horizon)
    if (iu > 0) {
      cx.save(); cx.beginPath(); cx.rect(0, 0, W, iy + 1); cx.clip();
      const hgt = (xl) => { const v = (xl + s * .5) / s; if (v <= 0 || v >= 1) return -12 * Math.min(Math.abs(v), Math.abs(v - 1)) * 8; return s * .09 * rise(iu) * Math.sin(Math.PI * v) ** .7 * (1 + .25 * Math.sin(v * 17 + 2) + .15 * Math.sin(v * 41)); };
      const herd = [[-80, 16, 0], [-30, 14, 1], [40, 17, 2]];
      for (const [x0, mh, j] of herd) {
        const go = sineIO(span(t, a.island + .6 + j * .5, a.nobody + 1.2 + j * .2)), xl = x0 + go * (340 - j * 30), base = iy + 2 - hgt(xl);
        F.beast(cx, t, ix + xl, base, mh, { ...F.MAMMOTH, dir: 1, shade: .55, rim: mixHex(GOLD.halo, FROST.body, .5), rimA: .6, walk: xl * .3, a: rise(iu) });
      }
      cx.restore();
    }
    if (top) F.label(cx, top[0] - 20, top[1] - 6, 'WRANGEL ISLAND', '~4,000 YEARS AGO', rise(span(t, a.island + .2, a.island + 1.1)) * (1 - sineIO(span(t, a.nobody + .6, a.nobody + 1.3))), { dx: -70, dy: -90, size: 28 });
    // the pyramids, far off on the same horizon: already standing
    const pu = span(t, a.pyr - .2, a.pyr + 1.4), pp = S.proj(c, -9000, 0, 30000);
    if (pu > 0 && pp) { A.pyramids(cx, pp[0], iy, 58, pu); F.label(cx, pp[0], iy - 26, 'THE PYRAMIDS', null, rise(span(t, a.pyr + .4, a.pyr + 1.2)) * (1 - sineIO(span(t, a.nobody + .6, a.nobody + 1.3))), { dx: 50, dy: -70, size: 26 }); }
  }

  // ---------------------------------------------------------------------------------------------------------------- the words (screen space)
  function texts(ctx, c, t, sky, open) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const out = (t0, t1) => 1 - sineIO(span(t, t0, t1));
    // M.01 one quiet subscribe line
    const sU = rise(span(t, a.channel + .4, a.channel + 1.2)) * out(a.notAnimal - .4, a.notAnimal + .2);
    if (sU > 0) maskLine(ctx, [['SUBSCRIBE · THE GOOD TAKEOFF', 0]], 960, sky(250), 30, sU, { serif: false, weight: 600, align: 'center', col: P.core0, glow: false });
    // 2.06 IS IT A MAMMOTH?
    const qU = rise(span(t, a.aMam - .05, a.aMam + .55)) * out(a.check - .3, a.check + .3);
    if (qU > 0) maskLine(ctx, [['IS IT A MAMMOTH?', 0]], 110, sky(250), 96, qU, { serif: false, weight: 600, col: GOLD.text, glow: true });
    // 2.07 3 ALIVE
    const aU = rise(span(t, a.three + .5, a.three + 1.2)) * out(a.cells - .4, a.cells + .1);
    if (aU > 0) maskLine(ctx, [['3 ALIVE', 0]], 110, sky(220), 64, aU, { serif: true, col: P.core0, glow: true });
    // 2.08 names, "DIRE WOLVES" (as presented)
    const [wx, wz] = pathAt(WP, t);
    const nameU = (j) => rise(span(t, a.names + j * .5, a.names + .8 + j * .5)) * out(a.cells - .5, a.cells);
    const heads = WOLVES.map((w, j) => { const x = wx + w.dx, z = wz + w.dz, p = S.proj(c, x - .55 * w.h, w.h * 1.15, z); return p; });
    ['ROMULUS', 'REMUS', 'KHALEESI'].forEach((nm, j) => { const p = heads[j]; if (p && nameU(j) > 0) F.label(ctx, p[0], p[1], nm, null, nameU(j), { dx: 34 + j * 6, dy: -64 - j * 30, size: 28, col: { halo: P.halo2, body: P.cream, core: P.core0 } }); });
    const brU = rise(span(t, a.presented, a.presented + .8)) * out(a.cells - .5, a.cells);
    if (brU > 0 && heads[0] && heads[2]) { const x0 = Math.min(...heads.map((p) => p[0])) - 10, x1 = Math.max(...heads.map((p) => p[0])) + 180, y = Math.min(...heads.map((p) => p[1])) - 150; F.bracket(ctx, x0, x1, y, brU, '“DIRE WOLVES” · PER COLOSSAL', { size: 26 }); }
    // 2.08 the GRAY WOLF strand rises out of the lead wolf; 20 edits light; the old tooth comes up out of the snow and guides them
    const sx = 560, sy = sky(330), sw = 800, gU = sineIO(span(t, a.cells + .15, a.cells + 1.5)) * (1 - sineIO(span(t, a.oldest - .1, a.oldest + .9)));
    const lead = heads[0];
    if (lead && t > a.cells - .2 && t < a.oldest + 1) {
      const th = sineIO(span(t, a.cells - .2, a.cells + .5)) * (1 - sineIO(span(t, a.oldest - .4, a.oldest + .3)));
      if (th > 0) F.accentSpan(ctx, [[lead[0] + 20, lead[1] + 40], [sx, sy]], 0, th, { w: 1.4, col: { halo: P.blue1, body: mixHex(P.blue1, P.cream, .4), core: P.cream }, spark: th < 1 });
    }
    if (gU > 0) {
      F.strand(ctx, t, sx, sy, sw, { n: 60, h: 40, u: gU, seed: 61, label: 'GRAY WOLF', lsize: 24, col: mixHex(P.cream, P.blue1, .35), diff: (k) => { const o = EDIT.indexOf(k); return o < 0 ? 0 : rise(span(t, a.edits + o * .07, a.edits + o * .07 + .3)); } });
      const eU = rise(span(t, a.edits + .3, a.edits + 1.0)) * gU;
      if (eU > 0) maskLine(ctx, [['20 EDITS', 0]], sx + sw + 40, sy + 18, 56, eU, { serif: true, col: GOLD.text, glow: true });
    }
    const tU = sineIO(span(t, a.tooth - .1, a.tooth + 1.3)) * (1 - sineIO(span(t, a.oldest - .1, a.oldest + 1.0)));
    if (tU > 0) {
      const g0 = S.proj(c, 0, 0, 5200), gy = g0 ? g0[1] : 700, tx = 420, ty = lerp(gy + 40, sy + 30, tU);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, gy); ctx.clip(); A.tooth(ctx, tx, ty, 62, { glow: tU }); ctx.restore();
      if (tU > .8) F.accentSpan(ctx, [[tx + 22, ty - 20], [sx + 4, sy]], 0, span(tU, .8, 1), { w: 1.6, col: GOLD, spark: false });
      maskLine(ctx, [['13,000 YEARS', 0]], tx - 50, ty + 110, 30, rise(span(t, a.tooth + .9, a.tooth + 1.5)) * (1 - sineIO(span(t, a.oldest - .2, a.oldest + .3))), { serif: false, weight: 600, col: P.core0, glow: false });
    }
    F.source(ctx, t, a.edits + .3, a.oldest + .2, F.SOURCES.wolves, { y: 870 });
    // 2.09 2 YEARS · HEALTHY
    const hU = rise(span(t, a.oldest + 1.0, a.oldest + 1.7)) * out(a.dire - .3, a.dire + .2);
    if (hU > 0) maskLine(ctx, [['2 YEARS · HEALTHY', 0]], 110, sky(220), 56, hU, { serif: false, weight: 600, col: P.core0, glow: false });
    F.source(ctx, t, a.oldest + 1.2, a.dire, 'PER COLOSSAL · OCT 2026', { y: 870 });
    // 2.10 DIRE WOLVES?
    const dU = rise(span(t, a.dire + .2, a.dire + .8));
    if (dU > 0 && t < a.Q1.start + 2) maskLine(ctx, [['DIRE WOLVES?', 0]], 110, sky(250), 96, dU, { serif: false, weight: 600, col: GOLD.text, glow: true });
    // Q1 · Q2 · Q3: the cards live in the sky (they scroll with the tilt; the sky is their page)
    const card = (id, k, base) => { const y = 330 + (c.hz - (base.hz + SKY * k)); if (y > -400 && y < H + 100) F.quoteCard(ctx, t, T, { id, y, x: 300 }); };
    if (t > a.Q1.start - 2 && t < a.Q2.end + 3) { if (t < a.Q2.start + .6) card('Q1', 1, CAM.wolf2); card('Q2', 2, CAM.wolf2); }
    if (t > a.Q3.start - 2 && t < a.hope + 4.5) card('Q3', 1, CAM.ele2);
    // 2.13 THE TRAITS COME BACK. THE SPECIES DOES NOT. · the label stays GRAY WOLF
    const r1 = rise(span(t, a.traits - .05, a.traits + .55)) * out(a.tells - .2, a.tells + .4), r2 = rise(span(t, a.species - .05, a.species + .55)) * out(a.tells - .1, a.tells + .5);
    if (r1 > 0) F.accentText(ctx, [['THE ', 0], ['TRAITS', 1], [' COME BACK.', 0]], 110, sky(230), 56, r1, { serif: false, weight: 600, acc: GOLD });
    if (r2 > 0) maskLine(ctx, [['THE SPECIES DOES NOT.', 0]], 110, sky(305), 56, r2, { serif: false, weight: 600, col: P.core0, glow: false });
    if (r2 > 0 && lead) F.label(ctx, lead[0], lead[1], 'GRAY WOLF', null, r2, { dx: 40, dy: -60, size: 28, col: { halo: P.halo2, body: P.cream, core: P.core0 } });
    // 2.14 ★ ASIAN ELEPHANT / BUILT FOR THE COLD (pinned to its head)
    if (t > a.asian - .2 && t < a.y28 + 1) {
      const [ex, ez] = pathAt(EP, t), hp = S.proj(c, ex + 230, 340, ez), lu = rise(span(t, a.asian + .1, a.asian + .9)) * out(a.promised - .4, a.promised + .2);
      if (hp && lu > 0) {
        F.label(ctx, hp[0], hp[1], 'ASIAN ELEPHANT', null, lu, { dx: 50, dy: -60, size: 30 });
        const cu = rise(span(t, a.cold + .1, a.cold + .8)) * out(a.promised - .4, a.promised + .2);
        if (cu > 0) maskLine(ctx, [['BUILT FOR THE COLD', 0]], hp[0] + 56, hp[1] - 60 + 28, 22, cu, { serif: false, weight: 600, col: GOLD.text, glow: false });
      }
    }
    // 2.15 2028 (struck) → EARLY 2030s → NO HARD DATE (in the sky over the walking elephant)
    const y1 = rise(span(t, a.y28 - .1, a.y28 + .5)) * out(a.Q3.start + .8, a.Q3.start + 1.4);
    if (y1 > 0) {
      const yy = sky(250), w28 = F.measure('2028', 84, true), strike = expoOut(span(t, a.early + .1, a.early + .6));
      maskLine(ctx, [['2028', 0]], 110, yy, 84, y1, { serif: true, col: mixHex(P.core0, P.halo2, strike * .5), glow: strike < .5 });
      if (strike > 0) { ctx.fillStyle = rgba(P.cream, .85); ctx.fillRect(104, yy - 30, (w28 + 12) * strike, 4); }
      const e2 = rise(span(t, a.early + .5, a.early + 1.1)) * y1; if (e2 > 0) maskLine(ctx, [['EARLY 2030s', 0]], 110 + w28 + 60, yy, 84, e2, { serif: true, col: P.core0, glow: true });
      const e3 = rise(span(t, a.noDate - .05, a.noDate + .55)) * y1; if (e3 > 0) maskLine(ctx, [['NO HARD DATE', 0]], 114, yy + 76, 40, e3, { serif: false, weight: 600, col: P.core0, glow: false });
    }
    F.source(ctx, t, a.early + .4, a.Q3.start + .9, 'PER COLOSSAL · TIME, AUG 24, 2026', { y: 870 });
    // 2.17 NO EMBRYO REPORTED · ~22 MONTHS
    const nU = rise(span(t, a.embryo + .3, a.embryo + 1.0)) * out(a.shaggy + .1, a.shaggy + 1.1);
    if (nU > 0) maskLine(ctx, [['NO EMBRYO REPORTED', 0]], 110, sky(230), 52, nU, { serif: false, weight: 600, col: P.core0, glow: false });
    F.source(ctx, t, a.embryo + .6, a.shaggy + .6, F.SOURCES.noEmbryo, { y: 870 });
    const pU = rise(span(t, a.carries + .1, a.carries + .7)) * out(a.shaggy + .2, a.shaggy + 1.2);
    if (pU > 0) {
      maskLine(ctx, [['~22 MONTHS', 0]], 110, sky(345), 64, pU, { serif: true, col: P.core0, glow: true });
      F.ruler(ctx, t, { x: 114, y: sky(395), w: 620, u: pU, fill: sineIO(span(t, a.carries + .5, a.carries + 2.6)), minor: 22, col: GOLD, a: pU });
    }
    // 2.19 THE BIGGER PRIZE
    const bU = rise(span(t, a.prize + .05, a.prize + .7)) * out(a.last - .2, a.last + .4);
    if (bU > 0) maskLine(ctx, [['THE BIGGER PRIZE', 0]], 110, sky(240), 84, bU, { serif: false, weight: 600, col: GOLD.text, glow: true });
    F.source(ctx, t, a.island + .2, a.nobody + 1.4, 'CELL, 2024', { y: 870 });
    ctx.restore();
  }
}
