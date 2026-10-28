// c01 + c02 · THE HOOK (0 – 44.40), lead · one take, two sets: A = the night ledge (you, the box, the band of a hundred years),
// B = inside the first compartment (the vaccine, −42 %, the empty shelf next door). B lives INSIDE compartment 1 of A from the
// first frame on (a portal drawn into the opening), so "Is it?" is a real flight into the compartment, not a cut. c02 (sc02.mjs)
// draws the same function: the chunk boundary at 23.98 is invisible by construction. Exit: through the hole of the "0" into
// plateCell (lib/f15_seams.mjs) at 44.40 → B1.
// Plan: docs/shots.md 1.01–2.06 (source tools/shots15.py) · kit lib/f15_kit.mjs · rules docs/MOTION.md.
//
// | ID    | time        | anchor                         | picture (one idea)                                                           | 1–2 moves               | carrier → next                        |
// |-------|-------------|--------------------------------|------------------------------------------------------------------------------|-------------------------|---------------------------------------|
// | 1.01★ | 0–6.40      | hundred · progress · ten       | THUMBNAIL: you on the ledge hold the small box; the huge paper band of a     | glint runs up · marks   | plan sequence                         |
// |       |             |                                | hundred years rises out of it across the sky. "in ten": the marks slide down | slide down (compress)   |                                       |
// | 1.02  | 6.40–10.60  | medicine · arriving · you      | a vial rides the band from 2090 down to you and drops into the box           | vial rides · camera     | follows the vial                      |
// | 1.03  | 10.60–14.33 | wrote · down                   | rise along the band: ink writes itself on the blank paper                    | ink · camera rises      | the ink → a gold thread               |
// | 1.04  | 14.33–17.80 | name · compressed              | the thread lays a baseline in the sky, the quote rises from it               | thread · lines          | plan sequence                         |
// | 1.05  | 17.80–20.28 | big · checked                  | pull back (scale), then the band slides back into the box, camera follows    | band retracts · push    | box tilts to the top view             |
// | 1.06  | 20.28–23.00 | done · starting                | the ten openings; the last one cool, the first one lights (the vial inside)  | push                    | compartment 1                         |
// | 1.07  | 23.00–24.06 | Is it?                         | flight into compartment 1                                                    | flight                  | the opening fills the frame           |
// | 2.01  | 24.06–29.98 | October · one person           | inside: one vial in a cone of light, OCTOBER 2026                            | push · cone narrows     | the vial's light → the curves         |
// | 2.02  | 29.98–34.06 | risk · forty                   | EXPL two relapse curves, the gap fills gold: −42 %                           | truck · curves          | plan sequence                         |
// | 2.03  | 34.06–36.50 | computer · aim                 | the machine's ring descends onto the label and locks                         | reticle                 | truck through the wall                |
// | 2.04  | 36.50–43.53 | drugs · not a single · approved| next compartment: an empty shelf, 0, APPROVED DRUGS FOUND BY AI…             | truck · the 0 rises     | the 0                                 |
// | 2.05  | 43.53–44.40 | Why?                           | the 0 opens: its hole is a page of letters; fly through → plateCell          | ring grows              | plateCell (B1)                        |
import { createCanvas, Path2D } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f15_kit.mjs';
import { plateCell, SEAM_HALF } from '../lib/f15_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, card, cam3, camAt, camDrift, aim, project, F0 } = E;

export const PRINT = F.PRINT15;
export default async (T, R) => { E.prepareEditorial(); return [{ t: R.a, draw: hook(T), print: PRINT }]; };

let CACHE = null;
export function hook(T) {
  if (CACHE) return CACHE;
  // ---------------------------------------------------------------------------------------------------- anchors (words only)
  const last = (seg, ph) => { const ws = T.W(seg, ph, ph); return ws[ws.length - 1].s; };
  const A = (w, n) => T.S('s00', w, n), B = (w, n) => T.S('s01', w, n);
  const a = {
    sup: A('Superintelligence'), hundred: A('hundred'), progress: A('progress'), ten: last('s00', 'in ten'), medicine: A('The medicine'),
    arriving: A('arriving'), you: last('s00', 'for you'), head: A('The head'), wrote: A('wrote'), down: A('down'), name: A('name'),
    the: A('the compressed'), compressed: A('compressed'), century: A('century'), its: A("It's a big"), big: last('s00', "It's a big"), so: A('So we'),
    checked: A('checked'), done: A('done'), whether: A("Whether it's starting"), starting: A('starting'), isit: A('Is it'),
    oct: B('October'), vaccine: B('vaccine'), person: last('s01', 'one person'), cut: B('It cut'), risk: B('risk'), forty: B('forty'),
    a_comp: B('A computer'), aim: B('aim'), drugs: B('drugs'), artif: B('artificial'), asof: B('As of'), not: B('not a single'),
    approved: B('approved'), why: B('Why'), T0: T.seg('s02').start,
  };
  const tSw = a.oct - .06;                 // the frame is all compartment: from here on only set B is drawn

  // ---------------------------------------------------------------------------------------------------- set A geometry (design coords, focus card)
  const LIP = 1150, ly = (x) => lerp(926, 940, clamp((LIP - x) / (LIP + 700)));
  const DU = { x: 600, h: 255 }, ARMS = { armR: [2.92, 3.08], armL: [-2.92, -3.08] };   // the box held up over your head (thumbnail)
  const scratch = createCanvas(8, 8).getContext('2d');                    // once: where the hands are, where the box sits
  const hands = E.du(scratch, DU.x, ly(DU.x) + 1, DU.h, { dir: 1, ...ARMS });
  const BOX = { x: (hands.R[0] + hands.L[0]) / 2, y: Math.min(hands.R[1], hands.L[1]) + 3, w: 104 };
  const g35 = F.box10(scratch, BOX.x, BOX.y, BOX.w, 0, { beta: .35, lid: .56 });
  const g1 = F.box10(scratch, BOX.x, BOX.y, BOX.w, 0, { beta: 1, lid: .56 });
  const C1 = g1.cells[0], C10 = g1.cells[9];
  const root = g35.top;
  const SPINE = F.smoothPath([[root[0], root[1] + 4], [root[0] + 14, root[1] - 90], [root[0] + 120, root[1] - 215], [930, 345], [1160, 335], [1400, 300], [1610, 175], [1755, -10], [1815, -260], [1825, -560]], 16);
  const wBand = (s) => lerp(30, 250, Math.pow(s, .75));
  const mOf = (k, c) => .03 + .9 * (k / 100) * (1 - .86 * c);
  const mVial0 = mOf(64, 0);                                                // the vial waits at 2090 ("your grandchildren")
  const INK = { m0: .3, m1: .53 };
  const QUOTE = '“the compressed 21st century”', QS = 84, QX = 150, QY = 168;
  const qW = F.measure(QUOTE, QS), qPre = F.measure('“the ', QS), qWord = F.measure('compressed', QS);
  const SRC = 'Dario Amodei · “Machines of Loving Grace” · 2024';

  // camera A (keys on words). The flight into compartment 1 is a log zoom (s0 → sEnd), drift fades out so the end is exact.
  const sEnd = W / C1.w;
  const KA = [
    [0, cam3({ x: 10, y: 6, z: -40 })],
    [a.ten, cam3({ x: 4, y: 2, z: 30 })],
    [a.arriving - .5, cam3({ x: 0, y: 0, z: 40 })],
    [a.you + .6, cam3({ x: -150, y: 70, z: 360 })],
    [a.head + .4, cam3({ x: -140, y: 62, z: 372 })],
    [a.down + .2, cam3({ x: 40, y: -40, z: 120 })],
    [a.century + .7, cam3({ x: -10, y: -78, z: 70 })],          // rise with the thread into the sky where the quote stands
    [a.big + 1.0, cam3({ x: 20, y: -10, z: -260 })],
    [a.so + .15, cam3({ x: 12, y: -6, z: -250 })],
    [a.checked + 1.25, aim(F0, BOX.x, BOX.y - 30, 5.2, W / 2, H / 2 - 10)],
    [a.whether, aim(F0, BOX.x, BOX.y - 28, 5.8, W / 2, H / 2 - 10)],
    [a.isit - .3, aim(F0, C1.x + C1.w / 2, C1.y + C1.h / 2, 7.2, W / 2 + 160, H / 2 + 20)],
  ];
  const tZ = a.isit - .3;                  // the flight into compartment 1 starts just before "Is it?"
  const camA = (t) => {
    if (t <= tZ) return camDrift(camAt(t, KA), t, 1.6);
    const u = span(t, tZ, tSw), e = .9 * sineIO(u) + .1 * u;   // still pushing at the switch: set B carries on with an expo-out push                // log zoom, eased both ends: it lands in the room at rest (= camB's first key)
    const s0 = 7.2, s = Math.exp(lerp(Math.log(s0), Math.log(sEnd), e));
    const sx = lerp(W / 2 + 160, W / 2, sineIO(u)), sy = lerp(H / 2 + 20, H / 2, sineIO(u));
    return camDrift(aim(F0, C1.x + C1.w / 2, C1.y + C1.h / 2, s, sx, sy, Math.max(F0, 80 * s)), t, 1.6 * (1 - smooth(u)));
  };

  // ---------------------------------------------------------------------------------------------------- set B geometry
  const X2 = 2150;                                         // camera x that centres compartment 2 (the empty shelf)
  const ux = (Z, cx) => 960 + cx * F0 / Z;                 // design x on card Z that sits in the frame centre when the camera is at cx
  const FLOOR = 790, VIAL = { x: 960, h: 250 };
  const G = { x0: 1250, x1: 1930, y0: 350, y1: 715 };      // the relapse graph (focus card)
  const yP = (p) => G.y1 - (p - 60) / 40 * (G.y1 - G.y0);
  const MONTHS = [0, 3, 6, 9, 12, 15, 18, 21, 24];
  const WARM = [100, 97.5, 94, 91, 88.5, 86.5, 84.5, 83, 82.2], COLD = [100, 94.5, 89, 84, 80, 76.5, 73.5, 71.5, 70.0];   // 2-yr RFS 82.2 % vs 70.0 % (INTERPATH-001, ESMO 2026)
  const curvePts = (vals) => E.catmull(vals.map((v, i) => [lerp(G.x0, G.x1, MONTHS[i] / 24), yP(v), 3]), 10);
  const CW = curvePts(WARM), CC = curvePts(COLD);
  const Z2 = { x: 960 + X2, y: 520, rx: 92, ry: 128 };   // the zero (focus card)
  const LABEL0 = 'APPROVED DRUGS FOUND BY ARTIFICIAL INTELLIGENCE';
  const KB = [
    [tSw, cam3()],
    [a.person + .6, cam3({ z: 120, y: -6 }), 'o'],
    [a.risk + .55, cam3({ x: 450, z: 60, y: -10 }), 'q'],
    [a.drugs - .1, cam3({ x: 435, z: 90, y: -8 })],
    [a.drugs + 1.2, cam3({ x: 1250, z: -250, y: -20 })],
    [a.artif + 1.1, cam3({ x: X2, z: 40, y: -10 })],
    [a.why, cam3({ x: X2, z: 150, y: -12 })],
    [a.T0 - SEAM_HALF, cam3({ x: X2, z: 330, y: -12 }), 'i'],
  ];
  const camB = (t) => camDrift(camAt(t, KB), t, 1.4 * smooth(span(t, tSw, tSw + 1.5)));

  // ---------------------------------------------------------------------------------------------------- set B (compartment interior)
  // st: { cone 0..1 (the warm light from the opening), t }
  function drawB(ctx, t, c) {
    const cone = clamp(span(t, a.you + .2, a.you + 1.2) * .4 + .6 * expoOut(span(t, a.starting - .05, a.starting + .6)));
    const narrow = sineIO(span(t, a.person - .2, a.person + .9));
    // back wall (one long wall behind both compartments) with the light of each compartment on it
    card(ctx, c, 3400, () => {
      ctx.fillStyle = E.lin(ctx, 0, -300, 0, 1300, [[0, P.night0], [.45, P.night1], [1, P.ind0]]); ctx.fillRect(-1200, -900, 6200, 2800);
      const bx1 = ux(3400, 0), bx2 = ux(3400, X2);
      ctx.fillStyle = E.rad(ctx, bx1, 760, 1050, [[0, rgba(P.ind1, .95 * cone + .3)], [.5, rgba(P.ind1, .35 * cone + .1)], [1, rgba(P.ind1, 0)]]); ctx.fillRect(bx1 - 1100, -900, 2200, 2800);
      ctx.fillStyle = E.rad(ctx, bx2, 700, 900, [[0, rgba(P.blue1, .35)], [1, rgba(P.blue1, 0)]]); ctx.fillRect(bx2 - 1000, -900, 2000, 2800);
    });
    card(ctx, c, F0, () => {
      // floor: dark, its front edge catches the light (warm under the cone, cool next door)
      ctx.fillStyle = E.lin(ctx, 0, FLOOR, 0, FLOOR + 400, [[0, P.ind2], [.08, P.night1], [1, P.night0]]); ctx.fillRect(-900, FLOOR, 5200, 900);
      ctx.fillStyle = E.lin(ctx, -300, 0, 4300, 0, [[0, rgba(P.blue0, .6)], [.16, rgba(P.halo1, .2 + .7 * cone)], [.3, rgba(P.blue0, .7)], [.62, rgba(COOLW, .8)], [1, rgba(P.blue0, .5)]]); ctx.fillRect(-900, FLOOR - 1, 5200, 3);
      // compartment 1: the cone of light from the opening, the pool, the vial
      if (cone > 0) {
        const hw0 = lerp(70, 40, narrow), hw1 = lerp(250, 150, narrow);
        const cp = new Path2D(); cp.moveTo(VIAL.x - hw0, -420); cp.lineTo(VIAL.x + hw0, -420); cp.lineTo(VIAL.x + hw1, FLOOR + 6); cp.lineTo(VIAL.x - hw1, FLOOR + 6); cp.closePath();
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(16px)';
        ctx.fillStyle = E.lin(ctx, 0, -420, 0, FLOOR, [[0, rgba(P.halo1, .04 * cone)], [.6, rgba(P.halo1, .16 * cone)], [1, rgba(P.halo0, .3 * cone)]]); ctx.fill(cp); ctx.restore();
        E.dust(ctx, 2401, 700, VIAL.x, 300, hw1 * .55, 420, t, .5 * cone, P.halo2);
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(VIAL.x, FLOOR + 6); ctx.scale(1, .12);
        ctx.fillStyle = E.rad(ctx, 0, 0, hw1 * 1.6, [[0, rgba(P.halo1, .55 * cone)], [.5, rgba(P.halo1, .16 * cone)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, hw1 * 1.6, 0, 6.29); ctx.fill(); ctx.restore();
      }
      E.castShadow(ctx, VIAL.x + 30, FLOOR + 2, 50, 120 + 60 * narrow, .15, .35 * cone);
      const lock = expoOut(span(t, a.aim - .05, a.aim + .45));
      const v = F.vial(ctx, VIAL.x, FLOOR + 2, VIAL.h, t, { fill: .86, glow: .5 + .7 * cone, mark: lock });
      // OCTOBER 2026 rises from the floor edge, sinks again when the camera leaves
      const uOct = expoOut(span(t, a.oct + .15, a.oct + 1.0)) * (1 - expoIn(span(t, a.drugs - .4, a.drugs + .1)));
      F.source15(ctx, 'October 2026', VIAL.x, FLOOR + 74, uOct, { align: 'center', size: 30 });
      // 2.02 · the relapse curves: drawn out of the vial's light along the floor, then up into the graph
      const uC = sineIO(span(t, a.risk - .1, a.risk + 2.0)), out = expoIn(span(t, a.drugs - .45, a.drugs + .05));
      if (uC > 0 && out < 1) {
        const k = 1 - out;
        ctx.save(); ctx.beginPath(); ctx.rect(G.x0 - 60, -400, G.x1 - G.x0 + 400, G.y1 + 1 - -400); ctx.clip();       // the graph sinks below its baseline
        ctx.translate(0, out * (G.y1 - G.y0 + 60));
        // baseline (time) as a fine blue line, then the gap between the curves fills with gold as the curves are drawn
        ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(G.x0 - 20, G.y1); ctx.lineTo(lerp(G.x0 - 20, G.x1 + 30, expoOut(span(uC, 0, .4))), G.y1); ctx.stroke();
        const n = Math.max(2, Math.floor(uC * (CW.length - 1)));
        const gap = new Path2D(); for (let i = 0; i <= n; i++) i ? gap.lineTo(CW[i][0], CW[i][1]) : gap.moveTo(CW[0][0], CW[0][1]); for (let i = n; i >= 0; i--) gap.lineTo(CC[i][0], CC[i][1]); gap.closePath();
        const fillU = expoOut(span(t, a.forty - .15, a.forty + .7));
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.lin(ctx, G.x0, 0, G.x1, 0, [[0, rgba(P.halo1, .05)], [1, rgba(P.halo0, .1 + .4 * fillU)]]); ctx.fill(gap); ctx.restore();
        // the cold curve (without): cool cream; the warm curve (with the vaccine): gold
        ctx.strokeStyle = rgba(F.COOL, .95); ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
        for (let i = 0; i <= n; i++) i ? ctx.lineTo(CC[i][0], CC[i][1]) : ctx.moveTo(CC[0][0], CC[0][1]); ctx.stroke();
        F.trailSpan(ctx, CW, 0, Math.max(.02, uC), { w: 2.6, spark: uC < 1 });
        const tag = expoOut(span(t, a.risk + 1.6, a.risk + 2.4));
        if (tag > 0) F.maskLine(ctx, [['VACCINE', 0]], CW[CW.length - 1][0] + 18, CW[CW.length - 1][1] + 9, 24, tag, { serif: false, col: P.halo0, glow: false, weight: 600 });
        ctx.restore();
        F.numberBlock(ctx, { x: G.x0, y: 238, num: '−42 %', label: 'risk of relapse or death', u: span(t, a.forty - .1, a.forty + 1.3) * k, size: 120, warm: .3 * fillU });
        F.source15(ctx, 'Moderna & Merck · ESMO 2026', G.x0, G.y1 + 50, span(t, a.forty + .5, a.forty + 1.5) * k);
      }
      // 2.03 · the machine's ring falls from the opening onto the label and locks
      const uR = span(t, a.a_comp - .2, a.aim + .1), rOut = expoIn(span(t, a.drugs - .3, a.drugs + .3));
      if (uR > 0 && rOut < 1) {
        const ly0 = (v.label[1] + v.label[3]) / 2, yy = lerp(-240, ly0, sineIO(span(uR, 0, .85))), rr = lerp(170, 64, sineIO(uR)) * (1 + .1 * Math.sin(span(t, a.aim - .3, a.aim) * Math.PI));
        F.reticle(ctx, VIAL.x, yy - rOut * 900, rr, t, { lock, rot: .3 });
      }
      // compartment 2: a dim cool cone from its opening (nothing to light), a cool pool, the empty shelf (dashed outlines)
      {
        const cx2 = Z2.x, hw0 = 90, hw1 = 330, br = 1 + .04 * Math.sin(t * .8);
        const cp = new Path2D(); cp.moveTo(cx2 - hw0, -420); cp.lineTo(cx2 + hw0, -420); cp.lineTo(cx2 + hw1, FLOOR + 6); cp.lineTo(cx2 - hw1, FLOOR + 6); cp.closePath();
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(18px)';
        ctx.fillStyle = E.lin(ctx, 0, -420, 0, FLOOR, [[0, rgba(P.blue1, .03)], [.6, rgba(P.blue1, .1 * br)], [1, rgba(COOLW, .22 * br)]]); ctx.fill(cp); ctx.restore();
        E.dust(ctx, 2402, 380, cx2, 300, hw1 * .5, 420, t, .3, COOLW);
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(cx2, FLOOR + 6); ctx.scale(1, .12);
        ctx.fillStyle = E.rad(ctx, 0, 0, hw1 * 1.7, [[0, rgba(COOLW, .4)], [.5, rgba(COOLW, .1)], [1, rgba(COOLW, 0)]]); ctx.beginPath(); ctx.arc(0, 0, hw1 * 1.7, 0, 6.29); ctx.fill(); ctx.restore();
      }
      ctx.save(); ctx.setLineDash([12, 10]); ctx.strokeStyle = rgba(F.COOL, .8); ctx.lineWidth = 3;
      for (const dx of [-330, 330]) { ctx.beginPath(); ctx.roundRect(Z2.x + dx - 90, FLOOR - 250, 180, 248, 10); ctx.stroke(); }
      ctx.restore();
      const uL = span(t, a.artif + .55, a.artif + 1.6) * (1 - span(t, a.why - .25, a.why + .2));
      F.maskLine(ctx, [[LABEL0, 0]], Z2.x, FLOOR + 84, 34, uL, { serif: false, align: 'center', col: P.cream, glow: false, weight: 600 });
      F.source15(ctx, 'as of Oct 2026 · IntuitionLabs tracker', Z2.x, FLOOR + 134, span(t, a.asof + .1, a.asof + 1.1) * (1 - span(t, a.why - .2, a.why + .25)), { align: 'center' });
    });
    // the divider between compartment 1 and 2 (near: it slides past faster)
    card(ctx, c, 1250, () => {
      const x = ux(1250, X2 / 2);
      ctx.fillStyle = E.lin(ctx, x - 190, 0, x + 190, 0, [[0, P.night0], [.12, P.ind2], [.5, P.night1], [.88, P.ind2], [1, P.night0]]); ctx.fillRect(x - 190, -900, 380, 3000);
      ctx.fillStyle = rgba(P.halo1, .55); ctx.fillRect(x - 190, -900, 2, 3000); ctx.fillStyle = rgba(P.blue0, .8); ctx.fillRect(x + 188, -900, 2, 3000);
    });
  }
  const COOLW = mixHex(P.blue0, F.COOL, .45);

  // the "0": a ring of light drawn in screen space (so it can open into the hole of the seam), rising from its baseline
  function zero(ctx, t, c) {
    const p = project(c, F0, Z2.x, Z2.y); if (!p) return;
    const [sx, sy, k] = p, u = expoOut(span(t, a.not - .05, a.not + .75)), uo = span(t, a.why - .45, a.T0 - SEAM_HALF - .02), open = uo * uo * (3 - 2 * uo);
    if (u <= 0) return;
    const gl = (a0, a1) => Math.exp(lerp(Math.log(a0), Math.log(a1), open));   // the ring grows on a log scale (a steady flight towards it)
    const rx = gl(Z2.rx * k, 1300), ry = gl(Z2.ry * k, 1300), th = gl(36 * k, 10), ix = Math.max(1, rx - th), iy = Math.max(1, ry - th * .42);
    const base = sy + Z2.ry * k, dy = (1 - u) * (Z2.ry * 2.3 * k);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (open <= 0) { ctx.beginPath(); ctx.rect(0, 0, W, base + 2); ctx.clip(); }
    const cy = sy + dy;
    // the hole: from "Why?" on it shows the page of letters (the plate), sliding in
    if (t >= a.why - .45) { ctx.save(); ctx.beginPath(); ctx.ellipse(sx, cy, ix, iy, 0, 0, 6.29); ctx.clip(); plateCell(ctx, t, { enter: span(t, a.why - .45, a.why + .1) }); ctx.restore(); }
    const ring = new Path2D(); ring.ellipse(sx, cy, rx, ry, 0, 0, 6.29); ring.ellipse(sx, cy, ix, iy, 0, 0, 6.29);
    if (open < 1) E.glowFill(ctx, ring, 40 * k, .55 * (1 - open) ** 2, P.blue0);   // the glow would spill into the hole as the ring passes the camera
    ctx.fillStyle = E.rad(ctx, sx, cy - ry * .3, ry * 1.4, [[0, P.core0], [.6, P.cream], [1, P.halo2]]); ctx.fill(ring, 'evenodd');
    if (open < 1) E.halo(ctx, sx, cy, ry * 1.6, .16 * u * (1 - open) ** 2, P.blue0, P.blue1);
    ctx.restore();
  }

  // ---------------------------------------------------------------------------------------------------- set A (the ledge)
  function drawA(ctx, t, c) {
    const comp = sineIO(span(t, a.ten - .2, a.ten + 1.75));
    const ride = sineIO(span(t, a.arriving - .55, a.you + .05)), drop = sineIO(span(t, a.you - .02, a.you + .55));
    const glint = span(t, a.hundred - .1, a.progress + 1.1);
    const slideIn = sineIO(span(t, a.checked - .35, a.checked + 1.45));
    const beta = lerp(.35, 1, sineIO(span(t, a.checked + .1, a.checked + 1.4)));
    const look = clamp(.72 - .62 * sineIO(span(t, a.arriving - .4, a.you + .3)) + .55 * sineIO(span(t, a.head, a.down)) - .1 * sineIO(span(t, a.big, a.checked)));
    // sky, stars, two soft sweeps, the far plain beyond the cliff
    card(ctx, c, 40000, () => {
      E.nightSky(ctx, [[0, P.night0], [.55, P.night1], [1, P.ind0]], -900, H + 200);
      ctx.fillStyle = E.rad(ctx, 1450, 380, 1500, [[0, rgba(P.ind1, .95)], [.5, rgba(P.ind1, .45)], [1, rgba(P.ind0, 0)]]); ctx.fillRect(-W, -2 * H, 3 * W, 4 * H);
      E.stars(ctx, 15, 210, t, [-500, -800, W + 1000, H + 700], .8);
    });
    card(ctx, c, 7000, () => {
      ctx.beginPath(); ctx.moveTo(-900, 300); ctx.bezierCurveTo(100, 260, 520, 600, 600, 1700); ctx.lineTo(-900, 1700); ctx.closePath();
      ctx.fillStyle = E.lin(ctx, 420, 600, -100, 1100, [[0, rgba(P.ind1, 0)], [.35, rgba(P.ind1, .55)], [1, rgba(P.ind0, .95)]]); ctx.fill();
    });
    card(ctx, c, 9000, () => {
      E.ground(ctx, [[-1400, 1010], [300, 985], [1200, 995], [2400, 975], [3600, 990]], { stops: [[0, P.ind2], [.1, P.night1], [1, P.night0]], rim: rgba(P.blue0, .8), rimW: 2 });
    });
    card(ctx, c, F0, () => {
      // the ledge (lip on the right: the band spills out over the void)
      ctx.save(); ctx.translate(LIP, 0); ctx.scale(-1, 1); F.ledge(ctx, 0, 900, LIP + 700, 914, { rimStops: [[0, rgba(P.halo1, .75)], [.4, rgba(P.halo1, .5)], [1, rgba(P.blue0, .7)]] }); ctx.restore();
      // the band of a hundred years
      const marks = [];
      for (let k = 0; k <= 100; k++) {
        const major = k % 10 === 0, end = k === 0 || k === 100;
        marks.push({ m: mOf(k, comp), len: major ? .42 : k % 5 ? .15 : .27, label: major ? String(2026 + k) : null, sz: end ? 1 : 1 - smooth(span(comp, .05, .5)) });
      }
      const inkU = sineIO(span(t, a.wrote - .2, a.down + .35));
      const band = F.paperBand(ctx, SPINE, t, {
        w: wBand, slide: slideIn, glow: 1 + .08 * Math.sin(t * .9),
        twist: (s) => -.12 + .22 * Math.sin(s * 5.2) + 2.75 * smooth(span(s, .74, 1)) + .07 * Math.sin(t * .45 + s * 3.4),
        light: (s) => .55 + .45 * Math.exp(-((s - lerp(-.2, 1.2, glint)) ** 2) / .012) * (glint > 0 && glint < 1 ? 1 : 0) + .1 * s,
        marks, ink: inkU > 0 ? [{ m0: INK.m0, m1: INK.m1, u: inkU, amp: .1, off: .02, lw: 2.4 }] : [],
      });
      // after "in ten": the two ends of the century now sit on a short stretch near you
      const uTag = expoOut(span(t, a.ten + 1.3, a.ten + 2.2)) * (1 - expoIn(span(t, a.head - .2, a.head + .4)));
      if (uTag > 0) for (const [k, lab, side] of [[0, '2026', 1], [100, '2126', 1]]) {
        const q = band.atM(mOf(k, comp)); if (!q) continue;
        const off = (q.w / 2 * q.c + 34) * side, lx = q.x - q.nx * off, lyy = q.y - q.ny * off;
        F.maskLine(ctx, [[lab, 0]], lx + (k ? 10 : -10), lyy + 14, 44, uTag, { align: k ? 'left' : 'right' });
      }
      // the gold thread: from the end of the ink up into the sky, where it becomes the baseline of the quote
      const uTh = sineIO(span(t, a.name - .3, a.the + .15)), thOut = sineIO(span(t, a.big - .05, a.big + .6));
      if (uTh > 0 && thOut < 1 && slideIn <= 0) {
        const e = band.atM(INK.m1); if (e) {
          const th = E.catmull([[e.x, e.y - e.w * e.c * .02, 2.4], [e.x - 10, e.y - 90, 2.4], [QX + qW + 50, QY + 110, 2.4], [QX + qW + 10, QY + 24, 2.4], [QX + qW - 60, QY + 22, 2.4], [QX - 10, QY + 22, 2.4]], 10);
          F.trailSpan(ctx, th, 0, uTh * (1 - thOut), { w: 2.2, spark: thOut > 0 });
        }
      }
      const uQ = expoOut(span(t, a.the - .1, a.the + .9)) * (1 - expoIn(span(t, a.big - .1, a.big + .45)));
      if (uQ > 0) {
        const gold = smooth(span(t, a.compressed - .05, a.compressed + .6));
        F.maskLine(ctx, [['“the ', 0], ['compressed', gold], [' 21st century”', 0]], QX, QY, QS, uQ);
        F.source15(ctx, SRC, QX + 6, QY + 66, expoOut(span(t, a.compressed + .3, a.compressed + 1.2)) * (1 - expoIn(span(t, a.big - .2, a.big + .3))));
      }
      // the light the band throws on the ledge round you
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(DU.x + 120, ly(DU.x) + 4); ctx.scale(1, .12);
      ctx.fillStyle = E.rad(ctx, 0, 0, 520, [[0, rgba(P.halo1, .3 * (1 - slideIn * .7))], [.5, rgba(P.halo1, .08)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 520, 0, 6.29); ctx.fill(); ctx.restore();
      E.castShadow(ctx, DU.x, ly(DU.x) + 2, 26, 170, Math.PI - .35, .5 * Math.cos(span(beta, .35, 1) * Math.PI / 2));
      // you, holding the box
      // seen from above (the box tilts to the top view) you foreshorten under the box: squash round the hands
      const fs = Math.cos(span(beta, .35, 1) * Math.PI / 2), hy = BOX.y - .2 * BOX.w;   // collapses into the box's footprint (the box hides it)
      if (fs > .004) { ctx.save(); ctx.translate(0, hy); ctx.scale(1, fs); ctx.translate(0, -hy);
      E.du(ctx, DU.x, ly(DU.x) + 1, DU.h, { dir: 1, ...ARMS, look, light: 1, rim: mixHex(P.coat, P.core1, .6) });
      ctx.restore(); }
      // the vial: waits on the band at 2090, rides down to you and drops into the box (the box, drawn after it, hides it)
      const mV = lerp(mVial0, 0, ride), q = band.atM(mV) || band.at(0);
      const hv = clamp(.36 * q.w, 30, 74), up = [q.x - q.nx * q.w / 2 * q.c, q.y - q.ny * q.w / 2 * q.c];
      const bump = Math.sin(Math.PI * span(t, a.medicine - .1, a.medicine + .9));
      if (drop < 1) F.vial(ctx, up[0], up[1] + drop * hv * 1.6, hv, t, { fill: .85, glow: .8 + 1.4 * bump });
      // the box: compartment 1 shows the room of set B (portal); 10 gets a cool rim on "done"; the band root sits inside
      const coolDone = Math.sin(Math.PI * span(t, a.done - .1, a.done + 1.0)) * (1 - span(t, a.starting, a.starting + .5)) + .25 * span(t, a.done, a.done + .3);
      F.box10(ctx, BOX.x, BOX.y, BOX.w, t, {
        beta, lid: .56, lit: [(.5 * smooth(span(t, a.you + .1, a.you + 1)) + .45 * expoOut(span(t, a.starting - .05, a.starting + .6))) * (1 - sineIO(span(t, tZ - .4, tZ + .7)))],
        cool: [0, 0, 0, 0, 0, 0, 0, 0, 0, clamp(coolDone)],
        inside: (i, cell) => {
          if (i !== 0 || t < a.you) return;
          const m = ctx.getTransform(), sw = m.a * cell.w, sx = m.a * (cell.x + cell.w / 2) + m.e, sy = m.d * (cell.y + cell.h / 2) + m.f;
          if (sw < 3) return;
          drawB(ctx, t, aim(F0, W / 2, H / 2, sw / W, sx, sy));
        },
      });
    });
  }

  CACHE = (ctx, t) => {
    if (t >= a.T0 - SEAM_HALF) { plateCell(ctx, t); return; }
    if (t < tSw) drawA(ctx, t, camA(t));
    else { const c = camB(t); drawB(ctx, t, c); zero(ctx, t, c); }
  };
  return CACHE;
}
