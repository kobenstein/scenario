// c12 · No. 2 · the conspiracy chatbot: C5b David Rand · a fifth, months later · errors corrected · flipped: same tool, opposite aim ·
// the big question (B3). T.G('Everyone knows') → T.G('Flash floods are the deadliest').
// ONE entry, one continuous take in the mind space of c11 (same camera: lib/f28_b3_kit.mjs camMind), then W 2.10: the warm beam's light
// door → the tree at the question (lanterns 12 … 2 lit, the thread, the ?, first rain) → c13 goes on from it.
//
// | ID   | anchor                          | picture (one idea)                                                          | camera              |
// |------|---------------------------------|-----------------------------------------------------------------------------|---------------------|
// | 2.01 | Everyone knows                  | a person and the knot of belief, close                                       | push in             |
// | 2.02 | Just an ordinary chatbot        | the bead unfolds into a plain chat window · tag THE KIND THAT WRITES EMAILS  | pull back           |
// | 2.03 | It answered each person's own   | bot rows send thin beams to the knot; it loosens strand by strand · REAL     | breathe             |
// | 2.04 | David Rand, one of the          | the chat window grows into the clip plate                                    | toward the window   |
// | 2.05 | [C5b]                           | DAVID RAND · ORIGINAL FOOTAGE (placeholder until the frames come)            | CLIP                |
// | 2.06 | After one short conversation    | the plate shrinks back; the loose fifth falls off the knot; BELIEF slab −20 % · 2 MONTHS LATER · lamp 2 | breathe |
// | 2.07 | The authors later found errors  | the slabs tremble; stamp CORRECTED · THE EFFECT HELD                         | breathe             |
// | 2.08 | In a newer study                | NOT YET PEER-REVIEWED; the window flips (mirror); a second person; its knot tightens | pull back   |
// | 2.09★| Same tool. Opposite aim.        | the window folds into the bead: two beams, warm (left) and cool (right)      | settle              |
// | 2.10 | What do all these tools (W)     | into the warm beam's light → the tree: lanterns 12 … 2 lit, 1 dark; the thread and the ? return; rain | door → pull back |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f28_kit.mjs';
import * as S from '../lib/f28_seams.mjs';
import * as B from '../lib/f28_b3_kit.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, halo, mixHex } = E;

export default async (T, R) => {
  E.prepareEditorial();
  const a = B.anchors(T);
  return [{ t: R.a, draw: scene(a, T, R), print: F.PRINT28 }];
};

const CL = (u, v, s) => E.aim(E.F0, u, v, s);
const WIN = { x: 40, y: 260, w: 580 };                   // the chat window (F0 design px), centred on the bead
const NK = 113;

function scene(a, T, R) {
  const tf = B.mindDoor(a), td = tf - 1.4, C5 = a.C5;
  const [kx, ky, kr] = B.MIND.knot, [mx, my] = B.MIRROR.knot;
  // ---------------------------------------------------------------- camera: the mind space, then the dive into the warm hit (door)
  const camM = (t) => B.drifted(B.camMind(t, a), E.F0, t, 2.2, 7);
  const camDoor = (t) => E.camAt(t, [[td, B.camMind(td, a)], [tf, CL(kx, ky, 30), 'i']]);
  const camD = (t) => B.drifted(camDoor(t), E.F0, t, 2.2, 7);
  const camT = (t) => B.drifted(B.camTreeQ(t, a), E.F0, t, 2.6, 3);
  // ---------------------------------------------------------------- states
  const openAt = (t) => expoOut(span(t, a.ordinary - .05, a.ordinary + .9)) * (1 - sineIO(span(t, a.same - .15, a.same + .55)));
  const flipAt = (t) => Math.cos(Math.PI * sineIO(span(t, a.flipped - .1, a.flipped + .8)));
  const ROWS1 = [['p', a.ordinary + 1.2, .7], ['b', a.answered, .85], ['p', a.reasons, .55], ['b', a.evidence, .8], ['p', a.evidence + .8, .6], ['b', a.rand - .2, .75]];
  const ROWS2 = [['b', a.argued - .1, .8], ['p', a.argued + .9, .5], ['b', a.wentup - .3, .85], ['p', a.wentup + .7, .6], ['b', a.strongly, .7]];
  const rowsAt = (t) => {
    const sc = sineIO(span(t, a.flipped - .3, a.flipped + .5));   // the old conversation rolls away under the flip
    if (sc < 1) return ROWS1.map(([s, t0, l]) => [s, span(t, t0, t0 + .45) * (1 - sc), l]);
    return ROWS2.map(([s, t0, l]) => [s === 'b' ? 'p' : 'b', span(t, t0, t0 + .45), l]);   // mirrored: the flip swaps the sides back on screen
  };
  // the left knot loosens by a fifth (the answers), the loose strand falls away when belief drops
  const looseAt = (t) => .2 * sineIO(span(t, a.answered + .3, a.rand - .1));
  const fallAt = (t) => expoIn(span(t, a.dropped - .1, a.dropped + 1.3));
  function leftKnot(t) {
    const pts = B.knotPts(t, kx, ky, kr, NK), f = looseAt(t), cut = Math.floor((NK - 1) * (1 - f));
    const body = pts.slice(0, cut + 1), Ps = pts[cut], L = f * 900, fa = fallAt(t);
    const strand = [];
    for (let i = 0; i <= 24; i++) { const q = i / 24; strand.push([Ps[0] + q * L * .55 + 10 * Math.sin(t * 1.2 + q * 4) * q, Ps[1] + q * q * L * .7 + fa * 520 + 30 * fa * q]); }
    return { body, strand: f > .005 ? strand : null, fa };
  }
  const rkAt = (t) => lerp(46, 92, sineIO(span(t, a.argued, a.strongly + .8)));
  // ---------------------------------------------------------------- the mind space content
  function front(ctx, t, c) {
    const flip = flipAt(t), op = openAt(t);
    // the people: left (the believer of the study), right (the mirror: revealed when the window flips)
    const [px, py, ph] = B.MIND.person; E.person(ctx, px, py, ph, { look: .15 + .05 * Math.sin(t * .6), light: 1, dir: 1, back: .25, lean: .01 * Math.sin(t * .5) });
    const [qx, qy, qh] = B.MIRROR.person, qa = span(t, a.flipped - .4, a.flipped + 1.2);
    E.person(ctx, qx, qy, qh, { look: .12 + .05 * Math.sin(t * .55 + 1), light: -1, dir: -1, back: .1 + .2 * qa, lean: .01 * Math.sin(t * .45 + 2) });
    // the knots
    const lk = leftKnot(t);
    B.thread(ctx, lk.body, { w: 4.4, col: 'dim' });
    if (lk.strand && lk.fa < 1) B.thread(ctx, lk.strand, { w: 3.4, col: 'warm', a: 1 - lk.fa });
    B.thread(ctx, B.knotPts(t + 3, mx, my, rkAt(t), NK), { w: 4.4, col: 'dim', a: .1 + .9 * qa });
    // the chat window (grown out of the bead; it hands over to the clip plate and takes it back)
    const rows = rowsAt(t);
    if (op > 0) {
      const r = B.chatWin(ctx, t, WIN.x, WIN.y, WIN.w, { open: op, flip, rows });
      // each answer of the bot sends a thin beam to a strand of the knot: warm where it lands (left), cool into the right knot (flipped)
      const rowY = (k) => WIN.y + 52 + k * 46 + 17;
      ROWS1.forEach(([s, t0], k) => { if (s !== 'b') return; const u = span(t, t0 + .25, t0 + .8) * (1 - span(t, t0 + 1.4, t0 + 2.0)) * (1 - span(t, a.flipped - .4, a.flipped)); if (u > 0) F.beam(ctx, t, WIN.x + 40, rowY(k), kx + 60, ky + 20 * Math.sin(k), u, { w: 2.2, hit: u, warm: .35 }); });
      ROWS2.forEach(([s, t0], k) => { if (s !== 'b') return; const u = span(t, t0 + .25, t0 + .8) * (1 - span(t, t0 + 1.4, t0 + 2.0)); if (u > 0) F.beam(ctx, t, WIN.x + WIN.w - 40, rowY(k), mx - 50, my + 20 * Math.sin(k), u, { w: 2.2 }); });
      // the tag of the gallery: the kind that writes emails
      const tu = span(t, a.writes - .5, a.writes + .5), tout = expoIn(span(t, a.reasons, a.reasons + .7));
      if (tu > 0 && tout < 1) { ctx.save(); ctx.globalAlpha *= 1 - tout; F.tag(ctx, t, WIN.x + WIN.w / 2, WIN.y + WIN.w * B.CHAT_H - 2 - tout * 60, 'THE KIND THAT WRITES EMAILS', tu, { size: 20 }); ctx.restore(); }
    }
    // the bead: before the window it hovers; it becomes the window; after "Same tool" it is the bead again with its two beams
    const bx = WIN.x + WIN.w / 2 + 5 * Math.sin(t * 1.3), by = WIN.y + WIN.w * B.CHAT_H / 2 + 4 * Math.sin(t * 1.7);
    const br = B.MIND.bead[2] * (1 - expoOut(span(t, a.ordinary - .1, a.ordinary + .4))) + 11 * sineIO(span(t, a.same + .2, a.same + .7));
    if (br > .3) F.agent(ctx, t, bx, by, br, { think: span(t, a.tried, a.argueAI) * (1 - span(t, a.ordinary - .3, a.ordinary)) });
    const b1 = sineIO(span(t, a.opposite - .05, a.opposite + .55)), b2 = sineIO(span(t, a.opposite + .15, a.opposite + .75));
    if (b1 > 0) F.beam(ctx, t, bx, by, kx + 20, ky + 10, b1, { w: 3.4, hit: span(t, a.opposite + .4, a.opposite + .9), warm: .85 });
    if (b2 > 0) F.beam(ctx, t, bx, by, mx - 20, my + 10, b2, { w: 3.4 });
    // BELIEF: a slab, the cut fifth, two months later
    belief(ctx, t);
  }
  function belief(ctx, t) {
    const u = span(t, a.after + .2, a.after + 1.2), out = expoIn(span(t, a.newer - .3, a.newer + .6)); if (u <= 0 || out >= 1) return;
    const x = 120, y = 724, L = 470, th = 30, tr = 3 * Math.sin(t * 31) * F.bump(t, a.errors - .1, 1.4);
    ctx.save(); ctx.translate(tr, out * 360); ctx.globalAlpha *= 1 - out;
    const cut = .2 * sineIO(span(t, a.fifth - .25, a.fifth + .45));
    bar(ctx, x, y, L * (1 - cut) * expoOut(u), th); F.maskLine(ctx, [['BELIEF', 0]], x - 22 - F.measure('BELIEF', 24, false, 600), y + 9, 24, F.rise(u), { serif: false, weight: 600, col: P.cream, glow: false });
    if (cut > 0) { ctx.save(); ctx.setLineDash([6, 6]); ctx.strokeStyle = rgba(P.halo2, .6 * span(cut, 0, .2)); ctx.lineWidth = 2; ctx.strokeRect(x + L * (1 - cut), y - th / 2, L * cut, th); ctx.restore();
      F.maskLine(ctx, [['−20 %', 0]], x + L + 26, y + 12, 44, F.rise(span(t, a.fifth, a.fifth + .7)), { glow: true }); }
    const u2 = span(t, a.months - .05, a.months + 1.0);
    if (u2 > 0) { bar(ctx, x, y + 74, L * .8 * expoOut(u2), th); F.maskLine(ctx, [['2 MONTHS LATER', 0]], x + L * .8 + 26, y + 74 + 9, 22, F.rise(span(u2, .4, 1)), { serif: false, weight: 600, col: P.halo2, glow: false }); }
    if (t > a.corrected - .25) F.stamp(ctx, t, 'CORRECTED', x + 250, y + 30, { t0: a.corrected, size: 30, rot: -.05, ink: P.halo0 });
    const hu = F.rise(span(t, a.held - .1, a.held + .7)); if (hu > 0) F.maskLine(ctx, [['THE EFFECT HELD', 0]], x, y + 150, 24, hu, { serif: false, weight: 600, col: P.cream, glow: false });
    ctx.restore();
  }
  function bar(ctx, x, y, len, th) {
    if (len <= 1) return; ctx.save();
    ctx.fillStyle = E.lin(ctx, 0, y - th / 2, 0, y + th / 2, [[0, mixHex(P.halo2, P.blue1, .35)], [1, mixHex(P.blue1, P.night1, .3)]]); ctx.beginPath(); ctx.roundRect(x, y - th / 2, len, th, 5); ctx.fill();
    ctx.fillStyle = rgba(P.cream, .5); ctx.fillRect(x + 4, y - th / 2 + 3, Math.max(0, len - 8), 2); ctx.restore();
  }
  function mind(ctx, t, c) {
    const qa = span(t, a.flipped - .4, a.flipped + 1.2);
    B.labWorld(ctx, c, t, { glow: [...B.MIND.glow.slice(0, 3), 1], cool: [WIN.x + WIN.w / 2 + (mx - 330) * .6 * qa, 445, 420 + 200 * qa, span(t, a.ordinary - .3, a.ordinary + .6) + .3 * qa], front: (cx) => front(cx, t, c) });
  }

  // ---------------------------------------------------------------- one frame
  return (ctx, t) => {
    let c;
    if (t < tf) {
      c = t < td ? camM(t) : camD(t);
      mind(ctx, t, c);
      // the clip plate grows out of the chat window and shrinks back into it
      if (t > a.rand + .3 && t < C5.end + .8) {
        const p0 = E.project(c, E.F0, WIN.x, WIN.y), p1 = E.project(c, E.F0, WIN.x + WIN.w, WIN.y + WIN.w * B.CHAT_H);
        const m = sineIO(span(t, a.rand + .5, a.rand + 2.0)) * (1 - sineIO(span(t, C5.end - .1, C5.end + .6)));
        const fade = span(t, a.rand + .5, a.rand + .8) * (1 - span(t, C5.end + .35, C5.end + .6));
        if (m > 0 && fade > 0) { ctx.save(); ctx.globalAlpha = fade; F.clipPlate(ctx, t, T, 'C5b', { from: { x: p0[0], y: p0[1], w: p1[0] - p0[0], h: p1[1] - p0[1] }, morph: m }); ctx.restore(); }
      }
    } else {
      c = camT(t);
      B.treeQ(ctx, c, t, a);
      B.rain(ctx, t, .55 * span(t, tf + 1.2, tf + 3.2));
    }
    F.realStamp(ctx, t, a.answered + .3, a.rand - .1, 'debunk');
    F.source(ctx, t, a.after + .6, a.newer - .1, F.SOURCES.debunk);
    F.source(ctx, t, a.notyet, a.same - .2, 'COSTELLO ET AL., PREPRINT JAN 2026');
    B.caveat(ctx, 110, 820, ['NOT YET PEER-REVIEWED'], span(t, a.notyet - .1, a.notyet + .7) * (1 - span(t, a.same - .5, a.same)), { t, size: 24 });
    const cm = sineIO(span(t, a.rand + .5, a.rand + 2.0)) * (1 - sineIO(span(t, C5.end - .1, C5.end + .6)));
    F.lampRail(ctx, t, T, { a: 1 - .8 * span(cm, .8, 1) });   // the rail steps back while the clip's credit line sits under it
    const fl = t < tf ? E.smooth(span(t, td, tf)) : 1 - E.smooth(span(t, tf, tf + 1.4));
    E.lightFlood(ctx, fl);
  };
}
