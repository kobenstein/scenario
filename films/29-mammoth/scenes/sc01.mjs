// c01 · Hook · THE FENCE · frame 0 = the thumbnail (the poster mammoth in gold light on the horizon, you and the child at the fence;
// AI IS BRINGING / BACK THE MAMMOTH) · the camera cranes down to the two of you, the child's hand rises into yours · over your shoulders:
// the poster's light pours down behind the fence and becomes the animal · it lifts its head, the light turns to red-brown fur, the small
// ear flicks, breath steams · "doesn't exist yet": it breaks back into points · the points become two strands, ELEPHANT / MAMMOTH, the
// tally rolls to 1,400,000 · the gold differences rain onto the tundra: the whole snow glitters, WHICH ONES? · you look over it · the
// field station · the machine's cyan comb sweeps the snow from the hut, almost everything goes grey, a few glints stay gold · they fly into
// the hut window → the lab: the woolly mouse · back out: the elephant walks into the window light · the glide back to the fence, today's
// animals light one by one → plateFence (lib/f29_seams.mjs) at "The mice belong".
// 0 → T.G('The mice belong') · built by the lead (quality reference). Plan: docs/shots.md H.01–H.15 · world: docs/MOTION.md
// ONE entry, one world, one continuous camera (S.camPath through world cameras; the strands are the animal's own points, the lab is a
// portal out of the window: never a cut, never a fade between worlds).
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f29_kit.mjs';
import * as S from '../lib/f29_seams.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, mixHex, halo } = E;
const { rise, maskLine, GOLD, MACH, LAMP, bump } = F;

export const PRINT = F.PRINT29;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.title = G('Artificial intelligence is bringing'); a.mam = G('mammoth', a.title);
  a.few = G('A few winters'); a.fence = G('fence in the snow', a.few);
  a.hand = G("There's a small hand"); a.yours = G('in yours', a.hand);
  a.behind = G('And behind the fence'); a.animal = G('the animal from the poster', a.behind); a.child = G("child's bed", a.behind);
  a.lifts = G('lifts its head'); a.fur = G('Red-brown fur'); a.ears = G('Small ears'); a.breath = G('Breath steaming');
  a.exist = G("That animal doesn't exist"); a.between = G('Between an elephant'); a.mammoth = G('a mammoth', a.between); a.million = G('1.4 million', a.between); a.dna = G('their DNA', a.between);
  a.which = G('Which ones make a mammoth'); a.human = G('No human can check'); a.lab = G('No lab can change');
  a.search = G('So the search for the few'); a.machine = G('a machine', a.search);
  a.alive = G('And the first test animals'); a.mice = G('Mice', a.alive); a.woolly = G('woolly', a.mice);
  a.rehearsal = G('The mice were the rehearsal'); a.elephant = G('The real job is an elephant');
  a.tools = G('And the same tools'); a.whichA = G('which of', a.tools); a.today = G("today's", a.tools); a.animals = G('animals that child', a.tools); a.childB = G('child still', a.tools);
  a.T0 = R.b;                                            // = T.G('The mice belong'): the seam
  a.seam = a.T0 - S.SEAM_HALF;
  return [{ t: 0, draw: scene(a, T), print: PRINT }];
};

// ---------------------------------------------------------------------------------------------------------------- cameras (world)
// C(x, y, z, hz): camera height above the snow = EYE − y (S.EYE 150); hz = where the horizon sits on screen (a lens shift: small = tilted down)
const C = (x, y, z, hz) => E.cam3({ x, y, z, f: F.F0, hz });
const WD = S.WORLD, HU = WD.hut, MA = WD.mammoth;
function keys(a) {
  return [
    [-4, C(-40, 10, 1900, 640)], [0, S.THUMB_CAM], [a.few - .2, C(-70, 4, 2140, 610)],                  // frame 0 = the thumbnail, a slow push
    [a.fence + .2, C(-165, -62, 2390, 200)], [a.hand + .1, C(-200, -92, 2540, -90)],                       // crane down to your hands: the poster leaves at the top
    [a.yours + .5, C(-204, -95, 2575, -110)],
    [a.behind + 1.3, C(60, -50, 2200, 470)], [a.lifts - .2, C(110, -55, 2280, 470)],                     // up over your shoulders: the field behind the fence
    [a.fur + 1.0, C(330, -170, 3330, 380)], [a.breath + 1.2, C(270, -175, 3440, 390)],                    // a crane over the fence: the fur, the ear, the breath
    [a.exist + .6, C(290, -190, 3380, 400)],
    [a.between + 1.6, C(40, -820, 1900, 760)], [a.which - .1, C(-120, -900, 1650, 720)],                  // pull back and up: the strands over the plain
    [a.which + 2.0, C(-300, -1150, 1050, 610)],                                                            // the whole tundra glitters (wow)
    [a.lab + .6, C(-1150, -330, 1900, 590)],                                                               // one long glide down and left, the field station comes in
    [a.search + .6, C(-2100, -440, 1750, 630)],                                                            // pan left to the field station
    [a.machine + .3, C(-700, -560, 1650, 640)],                                                            // the comb sweeps right: follow it
    [a.alive + .4, C(-1600, -480, 2400, 620)], [a.mice - .7, C(-4700, -140, 9150, 480)],                  // the picks fly into the window: push to it
    [a.rehearsal + .2, C(-4710, -145, 9220, 480)],
    [a.elephant + .8, C(-4000, -150, 6300, 560)], [a.tools - .6, C(-3850, -160, 6050, 560)],              // back out: the hut, the elephant in its light
    [a.today + .7, C(60, -20, 1800, 590)],                                                                 // the glide back over the fence (above the posts: never through them); 3.6 s (was 2.8: a 12/frame lurch)
    [a.seam, S.FENCE_C0],
  ];
}
// the poster's points (same order on poster and animal: the light pours from one to the other) and the animal's points (it breaks apart)
const PTS = () => F.beastPoints(520, 29, { ...F.MAMMOTH, lift: 0 });
const strandY = [372, 512], STRAND = { x: 330, w: 1260, n: 90 };
const isDiff = (k) => k % 7 === 3;   // the differences: the same rung index on both strands
const rungPt = (j) => { const s = j % 2, k = Math.floor(j / 2) % STRAND.n; return [STRAND.x + (k + .5) * STRAND.w / STRAND.n, strandY[s], k, s]; };

function scene(a, T) {
  const K = keys(a), pts = PTS(), n = pts.length;
  return (ctx, t) => {
    if (t >= a.seam) { S.plateFence(ctx, t, T); return; }                // the seam: exactly what c02 draws
    // camera: the path plus a drift that dies before the seam (the plate has none)
    const dA = 1 - span(t, a.childB - .4, a.seam - .15);
    let c = S.camPath(t, K); c = S.drift(c, t, 2600, 1.1 * dA, 29);   // calm: 1.1 (was 1.5)
    // ---- the animal: poured from the poster (light), turns to fur, lifts its head, breaks into points
    const pour = (i) => span(t, a.animal - .2 + 1.1 * (i / n), a.animal + .8 + 1.1 * (i / n));          // particle i: poster → animal
    const built = span(t, a.animal + .5, a.child + .7), posterA = 1 - sineIO(span(t, a.animal - .1, a.child + .5));
    const toFur = sineIO(span(t, a.lifts - .1, a.fur + .3)), lift = .72 * sineIO(span(t, a.lifts - .05, a.lifts + 1.3)) + .03 * Math.sin(t * .5);
    const brk = span(t, a.exist + .3, a.exist + 1.6);                                                     // it breaks into points
    const shade = lerp(.55, .18, sineIO(span(t, a.fur - .1, a.fur + .9)));
    const beastO = (t >= a.animal - .2 && brk < 1) ? { light: 1 - toFur, a: Math.max(built, toFur) * (1 - sineIO(brk)), lift, shade, flick: bump(t, a.ears + .05, .8), breath: span(t, a.breath + .05, a.breath + 2.6), rimA: .5 + .5 * toFur, trunk: .05 * Math.sin(t * .6) } : false;
    // ---- the snow of differences: base sparkle → the rain from the strands, all gold → combed → the picks fly into the window
    const rainT = (k) => a.which + .15 + (k % 26) * .045 + Math.floor(k / 26) * .035;
    const litWave = (g) => sineIO(span(t, a.which + .7 + (g.z - 3500) / 22500 * 1.6, a.which + 1.4 + (g.z - 3500) / 22500 * 1.6));
    const combX = lerp(HU.x, 7500, sineIO(span(t, a.search + .6, a.machine + .5))), combOn = t > a.search + .5 && t < a.mice;
    const combA = rise(span(t, a.search + .5, a.search + .9)) * (1 - expoIn(span(t, a.machine + .5, a.alive + .3)));
    const unlit = sineIO(span(t, a.rehearsal - 1, a.rehearsal));                                         // back to plain snow (hidden by the lab)
    const winC = (cc) => { const r = S.winRect(cc); return r ? [r.x + r.w / 2, r.y + r.h / 2] : [0, 0]; };
    const flyU = (g) => sineIO(span(t, a.alive + .2 + (Math.abs(g.x - HU.x) / 12000) * 1.2, a.alive + 1.4 + (Math.abs(g.x - HU.x) / 12000) * 1.2));
    const glint = {
      a: .45, comb: combOn && unlit < 1 ? combX : null, kept: 1, drop: 1 - unlit, keepNear: t > a.alive,
      pos: (k, g, sx, sy) => {
        let gold = t < a.rehearsal ? litWave(g) * (1 - unlit) : 0, x = sx, y = sy, al = 1;
        if (t > a.which && t < a.which + 3 && k < 520) {                                                  // the rain: from the gold rungs down to the snow
          const u = span(t, rainT(k), rainT(k) + 1.0); if (u <= 0) return null;
          const [rx, ry] = rungPt((Math.floor((k % 26) / 2) * 7 + 3) * 2 + (k % 2)), e = sineIO(u);
          x = lerp(rx, sx, e) + Math.sin(k) * 30 * Math.sin(Math.PI * u); y = lerp(ry, sy, e * e); gold = 1;
        }
        if (g.keep && t > a.alive) { const u = flyU(g); if (u >= 1) return null; const [wx, wy] = winC(c); x = lerp(sx, wx, u); y = lerp(sy, wy, u) - 120 * Math.sin(Math.PI * u) * (1 - u); gold = 1; al = 1 - .3 * u; }
        return [x, y, al, gold];
      },
    };
    const winBoost = 1 + .9 * bump(t, a.alive + 1.2, 2.2);
    const look = lerp(.3, .55, sineIO(span(t, a.lifts, a.lifts + 1))) * (1 - .3 * span(t, a.lab, a.lab + 1));
    const hold = sineIO(span(t, a.hand + .5, a.yours + .3)), end = sineIO(span(t, a.childB + .4, a.seam - .1));   // end: settle onto the plate's state
    const elX = lerp(-3300, -4450, sineIO(span(t, a.elephant - 1.2, a.elephant + 2.2)));
    const lit = (t0) => rise(span(t, t0 - .1, t0 + .6));
    const st = {
      poster: posterA > 0 ? { a: posterA, lift: .1 } : 0, glow: posterA,
      beast: beastO, glint, comb: combOn ? { x: combX, a: combA } : null,
      hut: { win: winBoost, mast: 1 + 1.5 * bump(t, a.search, 1.8) },
      elephant: t > a.rehearsal ? { x: elX, dir: -1, walk: elX * .012, flick: bump(t, a.elephant + 1.9, .9), a: 1 } : false,
      wolf: { lit: lit(a.whichA), look: .3 * lit(a.whichA) }, ferret: { lit: lit(a.today) }, bird: { lit: lit(a.animals), hop: span(t, a.animals, a.animals + .5) },
      you: { hold, look: lerp(look, .25, end) }, child: { look: lerp(look + .1 + .25 * rise(span(t, a.childB - .2, a.childB + .6)), .45, end) },
      extra: (cx) => {
        // the poster's light pouring down into the animal (particles in screen space between the two)
        if (t > a.animal - .3 && t < a.child + 2.3) {
          const pp = S.proj(c, WD.poster.x, 0, WD.poster.z), bb = S.beastAt(c);
          if (pp && bb) {
            const ph = WD.poster.h * pp[2];
            cx.save(); cx.globalCompositeOperation = 'lighter';
            for (let i = 0; i < n; i += 2) {
              const u = pour(i); if (u <= 0 || u >= 1) continue;
              const [px, py] = pts[i], e = sineIO(u), x0 = pp[0] - px * ph, y0 = pp[1] + py * ph, x1 = bb.x - px * bb.h, y1 = bb.y + py * bb.h;
              const x = lerp(x0, x1, e) + 60 * Math.sin(Math.PI * u) * Math.sin(i), y = lerp(y0, y1, e * e * (3 - 2 * e));
              cx.fillStyle = rgba(GOLD.core, .8 * Math.sin(Math.PI * u) + .2); cx.fillRect(x - 1.6, y - 1.6, 3.2, 3.2);
            }
            cx.restore();
          }
        }
        // the animal breaks into points, the points fly up into the two strands
        if (brk > 0 && t < a.which + .5) {
          const bb = S.beastAt(c); if (!bb) return;
          const fly = (i) => sineIO(span(t, a.between - .4 + .9 * (i / n), a.between + 1.0 + .9 * (i / n)));
          cx.save(); cx.globalCompositeOperation = 'lighter';
          for (let i = 0; i < n; i++) {
            const [px, py] = pts[i], b = sineIO(span(brk, (i % 7) / 10, (i % 7) / 10 + .4)), u = fly(i);
            const x0 = bb.x - px * bb.h + b * 18 * Math.sin(i * 1.7 + t), y0 = bb.y + py * bb.h - b * (10 + 30 * ((i * 37) % 11) / 11) * (1 + .3 * Math.sin(t + i));
            const [tx, ty] = rungPt(i);
            const x = lerp(x0, tx, u), y = lerp(y0, ty, u) - 80 * Math.sin(Math.PI * u);
            const al = (b > 0 ? .9 : 0) * (1 - span(u, .85, 1));
            if (al <= 0) continue;
            cx.fillStyle = rgba(mixHex(GOLD.core, F.FUR.tip, .3 * (1 - u)), al); cx.fillRect(x - 1.7, y - 1.7, 3.4, 3.4);
          }
          cx.restore();
        }
      },
    };
    S.fenceWorld(ctx, c, t, st);
    // ---- H.01 the title (frame 0 = the thumbnail)
    F.thesis(ctx, t, 96, 218, 1, { size: 106, gold: 1, out: span(t, a.few - 1.0, a.few - .05) });
    // ---- H.02 SCENARIO · EARLY 2030s
    F.scenario(ctx, t, a.few + .3, a.hand + .1);
    // ---- H.07 the strands (built by the arriving points), the differences light gold, the tally rolls
    const sU = span(t, a.between + .2, a.between + 1.8), sOut = span(t, a.which + .5, a.which + 1.7);
    if (sU > 0 && sOut < 1) {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      const dT = (k) => a.million + .1 + (k / STRAND.n) * 1.3, fell = (k) => t > rainT(0) - .05 + (Math.floor(k / 7)) * .09;
      const diff = (k) => (isDiff(k) && !fell(k) ? rise(span(t, dT(k), dT(k) + .4)) : 0);
      ['ELEPHANT', 'MAMMOTH'].forEach((lb, s) => F.strand(ctx, t, STRAND.x, strandY[s], STRAND.w, { n: STRAND.n, h: 50, u: sU * (1 - sOut), diff, seed: 3 + s, label: t > (s ? a.mammoth : a.between + .5) ? lb : null, lsize: 22, a: 1, col: s ? mixHex(F.FUR.tip, P.cream, .35) : mixHex(P.blue1, P.cream, .35) }));
      ctx.restore();
    }
    const tU = rise(span(t, a.million - .25, a.million + .35)) * (1 - expoIn(span(t, a.which + .1, a.which + .7)));
    if (tU > 0) F.tally(ctx, t, { v: 1400000, from: 1, u: span(t, a.million - .1, a.million + 1.1), label: 'DIFFERENCES IN THE DNA', rise: tU });
    F.source(ctx, t, a.million + .4, a.which + 1.8, F.SOURCES.diff14, { y: 870 });
    // ---- H.08★ WHICH ONES? (the whole tundra glitters)
    const qU = rise(span(t, a.which + 1.0, a.which + 1.6)) * (1 - expoIn(span(t, a.human + 1.4, a.lab - .3)));
    if (qU > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); maskLine(ctx, [['WHICH ONES?', 0]], 110, 250, 112, qU, { serif: false, weight: 600, col: GOLD.text, glow: true }); ctx.restore(); }
    // ---- H.11 the machine: one word under the comb's start
    // ---- H.12 the lab behind the window: the woolly mouse
    const lOpen = sineIO(span(t, a.alive + 1.9, a.mice - .05)), lShut = sineIO(span(t, a.rehearsal + .25, a.rehearsal + 1.7)), lm = lOpen * (1 - lShut);
    if (lm > 0) {
      const from = S.winRect(c);
      const mx = lerp(.12, .78, span(t, a.mice - .8, a.rehearsal + 1.5));
      F.portal(ctx, from, { x: 0, y: 0, w: W, h: H }, lm, (cx, w, h) => {
        const z = 1 + .03 * (t - a.mice); cx.save(); cx.translate(w / 2, h / 2); cx.scale(z, z); cx.translate(-w / 2 + E.drift(t, 10, 3), -h / 2 + E.drift(t, 6, 5));
        S.lab(cx, t, w, h, { mouse: { x: mx, walk: t * 9, fur: 1 }, screen: { comb: span(t, a.mice - .5, a.rehearsal + 1) } });
        cx.restore();
      }, { rim: LAMP, r: 14 * (1 - lm), glow: lm < .98 });
      F.source(ctx, t, a.mice + .3, a.rehearsal + .3, F.SOURCES.mice, { y: 870 });
    }
  };
}
