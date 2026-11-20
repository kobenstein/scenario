// c08 · Round 3 everything else · final score · pairing · is anyone in there?
// T.G('Round three') → T.G('First, how big') · builder B2. Plan: docs/shots.md 8.01–8.04 · kit: lib/f19_kit.mjs · seam out: plateNet
// (lib/f19_seams.mjs) · shared B2 set and THE SCOREBOARD: lib/f19_b2_world.mjs (c07's last frame = this chunk's first).
// ONE entry, ONE continuous camera: the dish field with the board (2 : 0) → round 3: from the dish a six-month line draws, it turns
// into a wave of good and bad days that calms ("teams help"); a cool block of fast math draws itself (a chatbot's bubble) → it
// shrinks into the A.I. point token and flies to A.I.; "a big one": the token grows giant → final score (ladder 2 : 1 · WITH CATCHES)
// → the board sinks, the tokens fall, the camera swings up out of the dish into the aisle: drawers of the alive rack turn into cool
// servers, gold and cool side by side (pairing) → the camera dives back down into the dish and on into the net, macro, until one soma
// flickers in the centre (IS ANYONE IN THERE?) = plateNet.
//
// | ID   | anchor (word)                           | picture (one idea)                                                | 1–2 moves         | layer      |
// |------|-----------------------------------------|-------------------------------------------------------------------|-------------------|------------|
// | 8.01 | six months · good days · fast math      | lamp 3; a six-month line → a wave of good/bad days; a cool block  | line/wave · block | EXPL       |
// | 8.02 | A big one                               | the block becomes the A.I. token; it grows giant                  | token grows       | EXPL       |
// | 8.03 | Two small points · giant one · pairing  | 2 : 1; up into the aisle: gold drawers and cool servers interlock | score · interlock | EXPL>SCENE |
// | 8.04 | anyone in there                         | fly down into the dish and the net: one soma flickers             | fly down          | SCENE>EXPL |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f19_kit.mjs';
import { plateNet, netPlateMap, NET_PLATE, SEAM_HALF } from '../lib/f19_seams.mjs';
import { fieldNight, topCam, camLerp, fieldOf, tiltCam, aisleDive, AISLE_HOLD, FIELD_DRIFT, FIELD_DISH, FIELD_NET, matchAnchors, board, polyTo, program } from '../lib/f19_b2_world.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, lin, halo } = E;
const { cam, camDrift, view, COOL, bump, NET } = F;

export const PRINT = F.PRINT19;

export default async (T, R) => {
  E.prepareEditorial();
  const a = matchAnchors(T);
  return [{ t: R.a, draw: scene(a, T, R), print: PRINT }];
};

const R1 = [480, 740, 190];                               // = sc07's R1: the dish where c07 left it
const R1C = topCam(...R1);
const C_PAIR = cam({ tx: 700, ty: 1600, tz: 0, d: 4700, p: -.1 });     // the alive rack big enough to read the interlock, you on the right
const C_PAIR1 = cam({ tx: 680, ty: 1580, tz: 0, d: 4250, p: -.11 });  // a slow push while the rack pairs up
const R_N = 560, TOPN = topCam(960, 540, R_N);                       // straight above the dish, centred (then on into the net in 2D)
const LINE = { y: 740, x1: 1185 }, BLOCK = { x: 1450, y: 740, s: 150 };
// an even zoom: accelerate over the first 22 %, glide, settle over the last 22 % (a trapezoid speed, no peak)
const trap = (u, q = .22) => { const v = 1 / (1 - q); return u < q ? .5 * v * u * u / q : u > 1 - q ? 1 - .5 * v * (1 - u) ** 2 / q : v * (u - q / 2); };
const PAIR_ORDER = []; for (let i = 0; i < F.RACK.n; i += 2) if (i !== F.OPEN) PAIR_ORDER.push(i);

function scene(a, T, R) {
  const T0 = R.b, tPlate = T0 - SEAM_HALF;
  const tUp0 = a.goalNot - .1, tUp1 = a.goalNot + 2.7;            // up out of the dish into the aisle
  const tDn0 = a.cellsThat - 2.7, tDn1 = a.cellsThat + .55;       // down into the dish
  const tZ0 = tDn1, tZ1 = tPlate - .4;                           // on into the net (2D), then hold the plate's map
  const somaC = NET.somas[NET.centre];

  return (ctx, t) => {
    if (t < tUp0) field(ctx, t, fieldOf(camDrift(R1C, t, FIELD_DRIFT)));
    else if (t < tUp1) { const u = span(t, tUp0, tUp1); aisleDive(ctx, t, view(camDrift(tiltCam(1 - u, C_PAIR, R1C), t, lerp(FIELD_DRIFT, AISLE_HOLD.drift, smooth(span(u, .2, .8))))), 1 - u, pairO(t)); }
    else if (t < tDn0) aisleDive(ctx, t, view(camDrift(camLerp(C_PAIR, C_PAIR1, sineIO(span(t, tUp1, tDn0))), t, AISLE_HOLD.drift)), 0, pairO(t));
    else if (t < tDn1) { const u = span(t, tDn0, tDn1); aisleDive(ctx, t, view(camDrift(tiltCam(u, C_PAIR1, TOPN), t, AISLE_HOLD.drift * (1 - smooth(span(u, .2, .8))))), u, pairO(t)); }
    else macro(ctx, t);
    board(ctx, t, a);
    F.ladder(ctx, t, T);
    if (t >= tPlate) plateNet(ctx, t);
  };

  // pairing: drawers of the alive rack flip into cool servers, bottom up; you look up at it
  function pairO(t) {
    const look = AISLE_HOLD.look + .2 * sineIO(span(t, a.pairing - .3, a.pairing + 1.2));
    return { look, pair: (i) => { const k = PAIR_ORDER.indexOf(i); return span(t, a.pairing - .1 + k * .07, a.pairing + .55 + k * .07); } };
  }

  // ---------------------------------------------------------------------------------------------------------------- round 3 (field)
  function field(ctx, t, FM) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    fieldNight(ctx);
    F.dish(ctx, t, FM, { ...FIELD_DISH, net: FIELD_NET });
    const back = span(t, a.ptAI - .2, a.ptAI + .9);                     // line/wave withdraw into the dish as the point goes to A.I.
    // the six-month line: draws out of the dish (the cells live about six months), then becomes a wave (good days, bad days) that calms
    const lu = smooth(span(t, a.last - .1, a.six + .4)) * (1 - expoIn(back));
    if (lu > 0) {
      const x0 = FM.c[0] + FM.r * 1.02, y0 = FM.c[1], amp = 44 * smooth(span(t, a.good - .3, a.good + .6)) * (1 - .7 * smooth(span(t, a.teams - .2, a.teams + 1.2)));
      const n = 90, pts = [];
      for (let k = 0; k <= n; k++) { const u = k / n, x = lerp(x0, LINE.x1, u); pts.push([x, y0 - amp * Math.sin(u * 6 * Math.PI * 2 / 2 + t * .8) * Math.min(1, u * 6)]); }
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(P.halo0, .22); ctx.lineWidth = 16; polyTo(ctx, pts, lu); ctx.restore();
      ctx.strokeStyle = lin(ctx, x0, 0, LINE.x1, 0, [[0, P.core1], [.75, P.halo1], [1, rgba(P.halo1, .25)]]); ctx.lineWidth = 5; polyTo(ctx, pts, lu);
      // six month ticks: each appears as the line passes it
      for (let m = 1; m <= 6; m++) { const u = m / 6; if (lu < u - .01) continue; const x = lerp(x0, LINE.x1, u); ctx.fillStyle = rgba(P.halo2, .7 * (1 - expoIn(back))); ctx.fillRect(x - 1.5, y0 + 22, 3, 14); }
      const mu = F.rise(span(t, a.six - .15, a.six + .6)) * (1 - expoIn(back));
      if (mu > 0) F.maskLine(ctx, [['~6 MONTHS', 0]], lerp(x0, LINE.x1, .5), y0 + 84, 30, mu, { serif: false, weight: 600, align: 'center', col: P.cream, glow: false });
      // good days / bad days: the crests glow gold, a small word for each on its phrase
      const gu = F.rise(span(t, a.good - .1, a.good + .6)) * (1 - expoIn(span(t, a.teams + 1.2, a.teams + 1.7)));
      const bu = F.rise(span(t, a.bad - .1, a.bad + .6)) * (1 - expoIn(span(t, a.teams + 1.2, a.teams + 1.7)));
      if (gu > 0) F.maskLine(ctx, [['GOOD DAYS', 0]], lerp(x0, LINE.x1, .3), y0 - 70, 22, gu, { serif: false, weight: 600, align: 'center', col: P.halo0, glow: false });
      if (bu > 0) F.maskLine(ctx, [['BAD DAYS', 0]], lerp(x0, LINE.x1, .72), y0 - 70, 22, bu, { serif: false, weight: 600, align: 'center', col: P.halo2, glow: false });
    }
    // the cool block of fast math: draws itself on "chips win", flickers fast; a chatbot's bubble rises from it; it shrinks into the token
    const bu = span(t, a.chips - .2, a.chips + .9), shrink = expoIn(span(t, a.ptAI - .2, a.ptAI + .2));
    if (bu > 0 && shrink < 1) {
      program(ctx, t * (1 + 2.5 * smooth(span(t, a.fast - .2, a.fast + .4))), BLOCK.x, BLOCK.y, BLOCK.s, bu, { scale: 1 - shrink });
      const sc = smooth(span(t, a.fast - .2, a.fast + .4)) * (1 - shrink);
      if (sc > 0) { const yy = BLOCK.y - BLOCK.s * .42 + ((t * 2.6) % 1) * BLOCK.s * .84; ctx.strokeStyle = rgba(COOL.core, .55 * sc); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(BLOCK.x - BLOCK.s * .44, yy); ctx.lineTo(BLOCK.x + BLOCK.s * .44, yy); ctx.stroke(); }
      const cb = expoOut(span(t, a.chatbots - .2, a.chatbots + .6)) * (1 - shrink);
      if (cb > 0) {
        const x = BLOCK.x + 40, y = BLOCK.y - BLOCK.s * .5 - 30 - 40 * cb, s = cb;
        ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
        ctx.strokeStyle = rgba(COOL.mid, .9); ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(-46, -30, 92, 52, 16); ctx.moveTo(-18, 22); ctx.lineTo(-30, 40); ctx.lineTo(-4, 22); ctx.stroke();
        for (let k = 0; k < 3; k++) { const f = .5 + .5 * Math.sin(t * 6 - k * .9); ctx.fillStyle = rgba(COOL.core, .4 + .6 * f); ctx.beginPath(); ctx.arc(-22 + k * 22, -4, 5, 0, 6.2832); ctx.fill(); }
        ctx.restore();
      }
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------------------------------------------------------- into the net (2D)
  // from straight above the dish (TOPN = fieldMap(960, 540, R_N)) on into the net around its centre soma, onto netPlateMap(); the net
  // and dish settle on the plate's options; the centre soma takes over the plate's flicker
  function macro(ctx, t) {
    const e = trap(span(t, tZ0, tZ1), .15), k = smooth(span(t, tZ0 + 1.2, tZ1));
    const r = Math.exp(lerp(Math.log(R_N), Math.log(NET_PLATE.r), e));
    const px = lerp(960 + somaC[0] * R_N, 960, e), py = lerp(540 - somaC[1] * R_N, 540, e);
    const fin = netPlateMap(), M = e >= 1 ? fin : F.fieldMap(px - somaC[0] * r, py + somaC[1] * r, r);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    fieldNight(ctx);
    const fire = (i) => (i === NET.centre ? k * NET_PLATE.fire(t) : 0);
    F.dish(ctx, t, M, { glow: lerp(FIELD_DISH.glow, .7, k), chip: .5, electrodes: lerp(FIELD_DISH.electrodes, .2, k), rim: lerp(FIELD_DISH.rim, .5, k), net: false });
    // the kit's net switches the dimmed somas to their dim stroke once dim > .5: cross that step in two weighted passes of the same net
    const nb = { lit: 1, focus: NET.centre, ambient: lerp(1, NET_PLATE.ambient, k), w: lerp(FIELD_NET.w, .45, e), fire }, q = smooth(span(k, .55, .92));
    if (q < 1) F.net(ctx, t, M, { ...nb, dim: Math.min(.5, NET_PLATE.dim * k), a: 1 - q });
    if (q > 0) F.net(ctx, t, M, { ...nb, dim: NET_PLATE.dim, a: q });
    ctx.restore();
  }
}
