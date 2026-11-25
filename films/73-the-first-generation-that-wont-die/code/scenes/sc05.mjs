// c05 · B1 · 'And still' → 'Which brings back' · A CRUMB OF A BRAIN, THE COPY OF YOU, THE QUESTION AGAIN
// One continuous take: out of screenPlate the camera backs out of the computer (the loop map → body → map), the quote card with its gold
// weight and the founder at his pitch screen, the weight drops and becomes the gold cube in a human brain (the camera looks up into the
// night), ★ the cube unfolds into a wall of data, the blocks fly together into a cool head, the head becomes the copy of you on the line;
// your line ends, the copy's dashed line runs on, lifts into THE ANSWER (cool), your gold line lifts into the gold one → plateTwoAnswers (B2).
// Fact check 25.11. (MB4, iMac): the quote is Andregg's verified sentence (lib/b1_kit.mjs FC.uploads), never "five years".
//
// | ID   | anchor (phrase)              | zeigt wörtlich                                                                    | layer | carrier out      |
// |------|------------------------------|-----------------------------------------------------------------------------------|-------|------------------|
// | 2.14 | And still                    | in the screen: the virtual fly walks on, quietly                                  | MIX   | the fly          |
// | 2.15 | A map of a brain, switched on| back out: the computer on the night stage; in its screen a loop of light map → body → map, the fly turns at each pulse | MIX | the loop |
// | 2.16 | The same executive says      | quote card “Optimistically, I think we are a few years away, not a few decades.” (Andregg) | EXPL | the card |
// | 2.17 | He also has a startup        | the card tilts on a small gold weight; behind it a founder at a pitch screen      | MIX   | the weight       |
// | 2.18 | Yet of a human brain         | the camera looks up; the weight becomes a tiny gold cube in a human brain (side view): 1 MM³ MAPPED + source | EXPL | the cube |
// | 2.19 | A crumb                      | the cube pulses, tiny against the whole brain                                     | EXPL  | the cube         |
// | 2.20★| Its data filled              | the cube unfolds into a wall of data blocks that fills the frame: 1,400,000 GIGABYTES | EXPL | the blocks     |
// | 2.21 | But suppose it worked        | the blocks fly back together into a whole head (cool)                             | MIX   | the head         |
// | 2.22 | A copy wakes up              | the head comes down onto the line beside you: a cool copy of you lights up        | SCENE | the two figures  |
// | 2.23 | Is that you                  | IS THAT YOU? between the two                                                      | MIX   | your line        |
// | 2.24 | Or did you die               | your line shrinks back to you and gets its end tick; the copy walks on along its cool dashed line | MIX | the dashed line |
// | 2.25 | So ask it again              | the dashed line lifts into THE ANSWER, cool: COPY                                 | EXPL  | the bead         |
// | 2.26 | If the only way              | your gold line lifts into the gold answer above: REPAIR → plateTwoAnswers         | EXPL  | plateTwoAnswers  |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f73_kit.mjs';
import * as S from '../lib/f73_world.mjs';
import * as X from '../lib/f73_stage.mjs';
import * as B from '../lib/b1_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, expoIn, halo, prng } = E;
const { GOLD, COOL, CREAM, AGE, SOURCES: SRC } = F;
const { LY, X0, XEND, XAGE, LATE, SCR, FC, lab } = B;
const PR = F.PRINT73;
const big = (c, txt, x, y, sz, u, o) => { if (u > 0) X.big(c, txt, x, y, sz, u, o); };
const label = (c, txt, x, y, u, o) => { if (u > 0) X.label(c, txt, x, y, u, o); };
const TAU = Math.PI * 2;
const Q2 = S.PTWO;
const pGold = (t) => .02 * Math.sin(t * .9), pCool = (t) => -.03 + .02 * Math.sin(t * .8 + 1);   // = plateTwoAnswers

// the wall of data (screen px): blocks on a grid, and for each a target point inside a head profile (the copy's head)
const BLK = 46, GAP = 10, STEP = BLK + GAP, COLS = Math.ceil(W / STEP) + 1, ROWS = 15;
const HEADC = { x: 960, y: 760, s: 520 };
const TARGETS = (() => {
  const poly = B.headPts(HEADC.x, HEADC.y, HEADC.s), inside = (x, y) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const pts = []; for (let y = HEADC.y - HEADC.s; y < HEADC.y; y += 22) for (let x = HEADC.x - HEADC.s * .42; x < HEADC.x + HEADC.s * .46; x += 22) if (inside(x, y)) pts.push([x, y]);
  const r = prng(7351); for (let i = pts.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [pts[i], pts[j]] = [pts[j], pts[i]]; }
  return pts;
})();

export default async (T, R) => {
  const G = (p, n = 0) => T.G(p, n, R.a - .01);
  const A = {
    still: R.a, map: G('A map of a brain'), same: G('The same executive'), startup: G('He also has a startup'), yet: G('Yet of a human brain'),
    mm: G('one cubic'), crumb: G('A crumb'), data: G('Its data filled'), gig: G('a million gigabytes'), suppose: G('But suppose it worked'), wakes: G('A copy wakes up'),
    isyou: G('Is that you'), die: G('Or did you die'), remembers: G('something else remembers'), ask: G('So ask it again'), only: G('If the only way'),
    would: G('would you', 0), end: R.b,
  };
  const tP = R.b - S.SEAM_HALF;
  const cx = SCR.cx, cy = SCR.cy;
  const YOU2 = 1000, COPY2 = 1180, END2 = 1060;   // after the look into the sky: you, the copy, your end tick
  const BRAIN = { x: 2080, y: 40, s: 250 }, CUBE = [BRAIN.x + .3 * BRAIN.s, BRAIN.y - .3 * BRAIN.s];
  const FOUNDER = 2330, PITCH = [2420, LY - 300, 230, 140];

  // ---------------------------------------------------------------- view
  const VD = [
    [R.a, { x: SCR.cx, y: SCR.cy, s: SCR.s }], [A.still + .7, { x: cx - 4, y: cy, s: 5.2 }], [A.map + 1.6, { x: 1960, y: 664, s: 1.45 }], [A.same, { x: 1990, y: 648, s: 1.38 }],
    [A.startup, { x: 2080, y: 640, s: 1.24 }], [A.yet + .2, { x: 2080, y: 610, s: 1.2 }], [A.yet + 1.9, { x: 2080, y: 70, s: 1.2 }], [A.crumb, { x: 2080, y: 60, s: 1.3 }],
    [A.data, { x: 2080, y: 60, s: 1.34 }], [A.suppose + 1.2, { x: 2080, y: 70, s: 1.28 }], [A.wakes + 1.7, { x: 1090, y: 700, s: 1.25 }], [A.isyou + .3, { x: 1100, y: 690, s: 1.3 }],
    [A.die + 1.6, { x: 1240, y: 716, s: 1.08 }], [A.ask + .1, { x: 1180, y: 700, s: 1.0 }], [A.ask + 1.8, { x: 960, y: 560, s: 1 }], [tP, { x: 960, y: 540, s: 1 }], [R.b, { x: 960, y: 540, s: 1 }],
  ];
  const view = (t) => { const v = X.viewPath(t, VD); return B.withBreath(t, v, t < A.map + 1.6 ? lerp(.25, 1, span(t, R.a, A.map + 1.6)) : 1); };
  const vsN = (t) => X.viewPath(t, VD).s;
  const PK = [[R.a, [cx, cy, 1]], [A.map + 1.6, [1960, 660, 1]], [A.yet + 1.9, [2080, 40, .9]], [A.wakes + 1.7, [1090, 700, 1]], [A.ask + 1.8, [960, 540, 1]], [tP, [960, 540, 1]]];
  const pool = (t) => { let i = 0; while (i < PK.length - 2 && t > PK[i + 1][0]) i++; const [a0, a] = PK[i], [a1, b] = PK[i + 1], u = sineIO(span(t, a0, a1)); return a.map((x, j) => lerp(x, b[j], u)); };

  // ---------------------------------------------------------------- states
  const hidden = (t) => t > A.yet + 2.0;                                       // the stage is out of frame (the camera looks up): reset it for the copy
  const loopU = (t) => span(t, A.map - .2, A.map + 1.2) * (1 - span(t, A.yet - .4, A.yet + .4));
  const MAPL = { x: cx - 64, y: cy - 2, s: 26 }, FLYL = { x: cx + 58, y: cy + 4 };
  const PULSE = 1.6;   // seconds per round of the loop
  const loopPos = (q) => { const a = q * TAU + Math.PI, rx = (FLYL.x - MAPL.x) / 2, mx = (FLYL.x + MAPL.x) / 2; return [mx + Math.cos(a) * rx, cy + 2 + Math.sin(a) * 34]; };
  const flyPos = (t) => {
    const w = B.flyWalk(t), k = sineIO(span(t, A.still + .4, A.map + .8));
    const turns = Math.floor(Math.max(0, t - A.map) / PULSE), ph = Math.max(0, t - A.map) / PULSE - turns, turn = sineIO(span(ph, .5, .72));
    const rot = (turns + turn) * Math.PI * .5 * loopU(t);
    return { x: lerp(w.x, FLYL.x, k), y: lerp(w.y, FLYL.y, k), rot: w.rot + rot, walk: w.walk };
  };
  const cardU = (t) => span(t, A.same - .3, A.same + .5) * (1 - span(t, A.yet - .1, A.yet + .5));
  const tilt = (t) => sineIO(span(t, A.startup + .1, A.startup + 1.2));
  const weightU = (t) => span(t, A.startup + .4, A.startup + 1.2);
  const drop = (t) => sineIO(span(t, A.yet + .1, A.yet + 1.9));
  const founderU = (t) => span(t, A.startup - .2, A.startup + 1.0) * (1 - span(t, A.yet + .2, A.yet + 1.0));
  const brainU = (t) => span(t, A.yet + 1.2, A.mm + 1.4);
  const wall = (t) => span(t, A.data - .2, A.data + 1.6);                      // the wave of blocks
  const gather = (t) => sineIO(span(t, A.suppose - .3, A.suppose + 1.8));      // the blocks fly into the head
  const headDown = (t) => sineIO(span(t, A.wakes - .3, A.wakes + 1.6));        // the head comes down onto the copy
  const copyA = (t) => span(t, A.wakes + .9, A.wakes + 1.8);
  const lineBack = (t) => sineIO(span(t, A.die - .1, A.die + 1.2));             // your line shrinks back to you
  const endDrop = (t) => 1 - expoIn(span(t, A.die + 1.0, A.die + 1.5));
  const runC = (t) => sineIO(span(t, A.remembers - .6, A.remembers + 1.6));     // the copy's dashed line runs on
  const copyWalk = (t) => span(t, A.remembers - .2, A.ask);
  const coolLift = (t) => sineIO(span(t, A.ask + .1, A.ask + 1.6));
  const goldLift = (t) => sineIO(span(t, A.only - .1, A.only + 1.6));
  const figSink = (t) => span(t, A.ask, A.ask + 1.2);

  // ---------------------------------------------------------------- the stage (sheet units)
  function under(c, t, s) {
    if (!hidden(t)) {
      X.lifeline(c, t, X0, XEND, LY, s, { age: XAGE, ageU: 1, end: 1, glow: 1 });
      B.marks(c, t, LATE.marks, LY, 1, s);
      F.du(c, LATE.you, LY - 2, 92, { pose: 'look', dir: 1 });
      // the founder at his pitch screen (2.17): grow out of the line, sink when the camera looks up
      const fu = founderU(t);
      if (fu > 0) B.sink(c, LY, 1 - fu, 320, () => {
        const [px, py, pw, ph] = PITCH; c.fillStyle = mixHex(P.night1, COOL.deep, .5); c.fillRect(px + pw / 2 - 3, py + ph, 6, LY - py - ph);
        c.fillStyle = E.rad(c, px + pw / 2, py + ph / 2, pw * .7, [[0, rgba(COOL.body, .45)], [1, rgba(COOL.deep, .25)]]); c.strokeStyle = rgba(COOL.line, .9); c.lineWidth = 2 / s;
        c.beginPath(); c.roundRect(px, py, pw, ph, 6); c.fill(); c.stroke();
        X.arrow(c, [[px + 30, py + ph - 30], [px + 90, py + ph - 60], [px + 130, py + ph - 52], [px + 196, py + 34]], span(t, A.startup + .3, A.startup + 1.4), { col: rgba(COOL.core, .9), w: 2.4 / s, glow: 6 / s, head: 12 });
        F.person(c, FOUNDER, LY - 2, 150, { pose: 'point', dir: 1 });
      });
      return;
    }
    // after the look into the sky: your line (open), you, the copy's line
    const lb = lineBack(t), x1 = lerp(1700, END2, lb), gl = goldLift(t);
    if (gl <= 0) X.lifeline(c, t, X0, x1, LY, s, { open: 1 - lb, openTo: 2600, end: 1, lift: endDrop(t), glow: 1 });
    else { const y = lerp(LY, Q2.y1, gl), xa = lerp(X0, Q2.x - Q2.w / 2, gl), xb = lerp(END2, Q2.x + Q2.w / 2, gl);
      if (gl < 1) X.lifeline(c, t, xa, xb, y, s, { end: 1, lift: span(gl, 0, .5), glow: 1 }); }
    const rc = runC(t), cl = coolLift(t);
    if (rc > 0 && cl < 1) { const y = lerp(LY, Q2.y2, cl), xa = lerp(COPY2 - 30, Q2.x - Q2.w / 2, cl), xb = lerp(lerp(COPY2 - 30, 2600, rc), Q2.x + Q2.w / 2, cl);
      X.drawPath(c, [[xa, y], [xb, y]], 1, { col: COOL.body, w: 4 / s, dash: [14 / s, 9 / s], glow: 10 / s, glowCol: COOL.halo }); }
    const fs = figSink(t);
    if (fs < 1) B.sink(c, LY, fs, 120, () => F.du(c, YOU2, LY - 2, 92, { pose: 'look', dir: 1 }));
    // the two answers (2.25, 2.26) = plateTwoAnswers when they are up
    const ac = span(cl, .97, 1) > 0 ? lerp(.7, 1, span(t, A.ask + 1.55, A.ask + 2.2)) : 0, ag = span(gl, .97, 1) > 0 ? lerp(.7, 1, span(t, A.only + 1.55, A.only + 2.2)) : 0;
    if (ac > 0) F.answer(c, t, Q2.x, Q2.y2, Q2.w, pCool(t), { cool: true, tremble: 6, u: ac });
    if (ag > 0) F.answer(c, t, Q2.x, Q2.y1, Q2.w, pGold(t), { tremble: 6, u: ag });
    X.label(c, SRC.repair, Q2.x, Q2.y1 - 62, span(t, A.only + 1.3, A.only + 2.1), { size: 26, gold: .7 });
    X.label(c, SRC.copy, Q2.x, Q2.y2 - 62, span(t, A.ask + 1.3, A.ask + 2.1), { size: 26, col: COOL.text });
  }
  function inScreen(c, t, s) {   // 2.15: the loop of light map → body → map
    const lu = loopU(t); if (lu <= 0) return;
    c.save(); c.globalAlpha *= lu;
    F.flyBrain(c, t, MAPL.x, MAPL.y, MAPL.s, { u: 1, s, col: 'cool', fire: .6 });
    const pts = Array.from({ length: 61 }, (_, i) => loopPos(i / 60));
    X.drawPath(c, pts, lu, { col: rgba(COOL.line, .6), w: 1.6 / s, glow: 6 / s, glowCol: COOL.halo });
    const q = (Math.max(0, t - A.map) / PULSE) % 1, p = loopPos(q); halo(c, p[0], p[1], 9, .9, COOL.halo, COOL.core);
    c.restore();
  }
  function cardAndWeight(c, t, v) {   // 2.16–2.18 (screen px)
    const cu = cardU(t), dr = drop(t);
    let hang = null;
    if (cu > 0) { const box = F.quoteCard(c, t, T, { text: FC.uploads.text, credit: FC.uploads.credit, spoken: ['The same executive', 'not decades'], after: R.a, mode: 'hi', u: cu, size: 50, w: 1240, y: 150, rot: -.006 - .045 * tilt(t) });
      if (box) hang = [box.x + box.w - 150, box.y + box.h + 10 - 20 * tilt(t)]; }
    const wu = weightU(t); if (wu <= 0 || dr >= 1) return;
    if (!hang) hang = [W / 2 + 470, 470];
    const [kx, ky] = X.toScreen(v, CUBE[0], CUBE[1]);
    if (dr <= 0) { B.weight(c, hang[0], hang[1], 70, wu); return; }
    // the weight falls free of its thread and glides into the place of the cube
    const p = [lerp(hang[0], kx, dr), lerp(hang[1] + 82, ky, dr) - Math.sin(Math.PI * dr) * 120], r = lerp(1, .35, dr);
    halo(c, p[0], p[1], 50 * r, .7, GOLD.halo, GOLD.core); c.fillStyle = GOLD.body; c.beginPath(); c.arc(p[0], p[1], 9 * r, 0, TAU); c.fill();
  }
  function sky(c, t, s) {   // the brain with its cube (2.18–2.19)
    const bu = brainU(t), gu = gather(t); if (bu <= 0 || gu >= 1) return;
    c.save(); c.globalAlpha *= 1 - span(t, A.data + .4, A.data + 1.4);
    F.brainSide(c, t, BRAIN.x, BRAIN.y, BRAIN.s, { u: bu, s, cube: span(t, A.yet + 1.7, A.yet + 2.1), cubeSize: 6 + 3 * F.bump(t, A.crumb - .1, .9) });
    c.restore();
  }
  function wallAndHead(c, t, v) {   // ★ 2.20 the wall, 2.21 the head, 2.22 the head comes down onto the copy (screen px)
    const wu = wall(t), gu = gather(t), hd = headDown(t); if (wu <= 0) return;
    const [kx, ky] = X.toScreen(v, CUBE[0], CUBE[1]), maxD = Math.hypot(W, H);
    // where the copy's head is (2.22): the head shrinks onto it
    const [qx, qy] = X.toScreen(v, COPY2, LY - 2), fh = 92 * v.s, tgt = { x: qx - fh * .02, y: qy - fh * .86, s: fh * .2 };
    const hs = lerp(1, tgt.s / HEADC.s * 2.4, hd), hx = lerp(HEADC.x, tgt.x, hd), hy = lerp(HEADC.y - HEADC.s * .5, tgt.y, hd);
    const ha = 1 - span(hd, .75, 1); if (ha <= 0) return;
    c.save();
    let n = 0;
    for (let r = 0; r < ROWS; r++) for (let col = 0; col < COLS; col++) {
      const bx = col * STEP - 8, by = r * STEP + 18, d = Math.hypot(bx + BLK / 2 - kx, by + BLK / 2 - ky) / maxD;
      const k = expoOut(clamp((wu * 1.25 - d) * 4)); if (k <= 0) { n++; continue; }
      const tg = TARGETS[n % TARGETS.length], g = clamp(gu * 1.15 - (n % 7) * .02), gx = lerp(bx + BLK / 2, hx + (tg[0] - HEADC.x) * hs, g), gy = lerp(by + BLK / 2, hy + (tg[1] - (HEADC.y - HEADC.s * .5)) * hs, g);
      const sz = lerp(BLK * k, 10 * hs, g), a = (.32 + .18 * Math.sin(n * 1.7 + t * 2)) * (1 - g * .2) * ha;
      c.fillStyle = rgba(mixHex(COOL.deep, COOL.body, .5 + .4 * g), a); c.fillRect(gx - sz / 2, gy - sz / 2, sz, sz);
      if (k < 1 && g === 0) { c.strokeStyle = rgba(COOL.line, .5 * (1 - k)); c.lineWidth = 1.2; c.strokeRect(gx - sz / 2, gy - sz / 2, sz, sz); }
      n++;
    }
    // the head's outline draws as the blocks arrive
    if (gu > .3 && ha > 0) { c.save(); c.translate(hx, hy); c.scale(hs, hs); c.translate(-HEADC.x, -(HEADC.y - HEADC.s * .5)); B.headCool(c, HEADC.x, HEADC.y, HEADC.s, span(gu, .3, 1), hs, ha); c.restore(); }
    c.restore();
    const lift = F.bump(t, A.data - .2, .6); if (lift > 0) halo(c, kx, ky, 160, .7 * lift, GOLD.halo, GOLD.core);
  }

  // ---------------------------------------------------------------- the take
  function take(ctx, t) {
    const v = view(t);
    B.screenPlate(ctx, t, v, {
      pool: pool(t), on: 1, comp: hidden(t) ? 0 : 1, fly: hidden(t) ? 0 : 1, flyPos: flyPos(t), flySize: lerp(44, 30, sineIO(span(t, A.still + .4, A.map + .8))),
      under: (c, s) => { under(c, t, s); sky(c, t, s); },
      inScreen: (c, s) => inScreen(c, t, s),
      top: (c) => {
        cardAndWeight(c, t, v);
        wallAndHead(c, t, v);
        words(c, t, v);
      },
    });
    // the copy of you (2.22 →): the same figure in cool light, beside you on the line
    const ca = copyA(t), fs = figSink(t);
    if (ca > 0 && fs < 1) { const wk = copyWalk(t), x = COPY2 + 110 * sineIO(wk), [sx, sy] = X.toScreen(v, x, LY - 2 + 120 * sineIO(fs));
      ctx.save(); const [, ly] = X.toScreen(v, 0, LY); ctx.beginPath(); ctx.rect(0, 0, W, ly); ctx.clip();
      B.coolYou(ctx, sx, sy, 92 * v.s, { a: ca, dir: wk > 0 && wk < 1 ? 1 : -1, pose: 'look', walk: wk > 0 && wk < 1 ? t * 6 : undefined, glow: 1 + F.bump(t, A.wakes + .9, 1.2) });
      ctx.restore(); ctx.beginPath(); }
  }
  // the screen-space words
  function words(ctx, t, v) {
    const [bx, by] = X.toScreen(v, BRAIN.x, BRAIN.y + BRAIN.s * .5);
    label(ctx, SRC.mm3, bx, Math.min(by + 70, 820), lab(t, A.mm - .2, A.data + .2), { size: 34, gold: .6, spacing: .12 });
    if (t > A.mm - .2 && t < A.data + .2) F.source(ctx, t, A.mm - .1, A.data + .1, SRC.mm3Src);
    big(ctx, SRC.pb, W / 2, 560, 104, lab(t, A.gig - .3, A.suppose - .3), { gold: .7 });
    // IS THAT YOU? between the two
    const [ax, ay] = X.toScreen(v, (YOU2 + COPY2) / 2, LY - 210);
    big(ctx, SRC.isYou, ax, ay, 72, lab(t, A.isyou - .1, A.die + .9), { gold: .15 });
  }
  const draw = (ctx, t) => take(ctx, t);
  return [{ t: R.a, draw, print: PR }, { t: tP, draw: (ctx, t) => S.plateTwoAnswers(ctx, t, T), print: PR }];
};
