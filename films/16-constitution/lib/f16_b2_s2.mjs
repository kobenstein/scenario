// Film 16 · B2 · stage S2: c06 end (the closed book) → c07 (Level 6 I) → c08 (Level 6 II) → plateNib. One plane (F0), one camera,
// a few depth layers (lib/f16_b2_kit.mjs layer()) for the papercut diorama and the far city.
// | ID   | anchor                        | picture                                                                   | moves                 |
// | 7.01★| told · watched · actually did | the closed book stays left; truck right to a papercut company standing on  | truck · lamps/meter   |
// |      |                               | a stack of pages; lamps switch on; the reply field wakes as a meter        |                       |
// | 7.02 | fake company · email          | push into the diorama: desks, the monitor, a stack of emails glows         | push                  |
// | 7.03 | replaced · affair             | two emails rise: a calendar card (a ringed date), an envelope (a heart)    | email 1 · email 2     |
// | 7.04 | expect it to do               | hold; the cursor blinks one last time                                      | hold                  |
// | 7.05★| 2025 · blackmail · 96 · others| the meter's light flies out and becomes the first bar: 96 / 100 RUNS;      | carrier · bars        |
// |      |                               | grey bars without numbers rise beside it. Source: Agentic Misalignment     |                       |
// | 7.06 | internet text · hadn't removed| tilt down below the base: an ocean of text snippets; a training layer      | tilt · layer          |
// |      |                               | sweeps over them and leaves them in place                                  |                       |
// | 8.01 | brings it down · two approaches| the snippets sink; a fresh base line; a SEPARATE chart (May 2026)         | tilt · columns        |
// | 8.02 | poorly · better               | EXAMPLES stays dim, REASONS warms                                          | fills                 |
// | 8.03★| constitution · stories · well | the REASONS column opens into pages; they fly as threads into the head     | pages · network       |
// | 8.04 | dropped sharply               | one bar without a number sinks sharply; its old height stays as a ghost    | the bar               |
// | 8.05 | own tests · outside           | stamp; a frosted pane slides in; pull back: every result sits behind glass | stamp · pull back     |
// | 8.06 | artificial · fail · harm      | the diorama turns: cardboard back, two doors FAIL / HARM; the city is quiet| turn · doors          |
// | 8.07 | values · answers · leaked     | the stack under it: a warm page, a cool page; the diorama folds into it    | fold                  |
// | 8.08 | zero · learned · seen the exam| the exam page runs out as a zero line; two tags hang from it               | line · tags           |
// | 8.09 | unsolved problem              | quote card (exact words)                                                   | lines rise            |
// | 8.10 | move a model · write the text | a fountain pen of light rises out of the stack; a page stands up; it       | pen · push            |
// |      |                               | writes; push to the nib = plateNib                                         |                       |
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './f16_kit.mjs';
import { plateNib, SEAM_HALF } from './f16_seams.mjs';
import { sky, layer, proj, sheet, ruleText, bump, nibPaper, nibInk, inkY, NIB } from './f16_b2_kit.mjs';
import { bookScreen, FAR, BOOK_AR } from './f16_b2_s1.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, lin, rad, prng, drift, halo, glowFill, card, cam3, camAt, camDrift, aim, F0 } = E;

// ---------------------------------------------------------------------------------------------------------------- geometry (F0 design px)
const BK = { x: -100, y: 470, hw: 210 };                                       // the book (closed: x -310…-100), far left of the set
const BOX = { x0: 700, x1: 1700, y0: 230, y1: 830, px: 1200 };                  // the diorama's opening; it stands on the stack
const MON = { x: 1112, y: 560, w: 200 };                                       // the model's monitor on the centre desk
const PILE = { x0: 740, x1: 1660, y: 832, n: 9, h: 14 };                        // the training stack (side view)
const CA = { base: 700, hx: 2400, hw: 110, H: 520, gx: [2590, 2700, 2810, 2920], gw: 80, gv: [.96, .8, .8, .79], cx: 2500 };   // chart A (2025)
const OC = { x0: 1950, x1: 3180, y0: 736, rows: 24, dy: 24 };                   // the ocean of text snippets
const CB = { cx: 2560, base: 1880, x0: 2200, x1: 2920, ex: 2350, rx: 2770, cw: 150, ch: 420, H: 500, bw: 170 };   // chart B (May 2026)
const HD = { x: 3400, y: 1180, h: 800 };                                       // the head of light (anchor 3)
const ZL = { x0: 1700, x1: 2240, y: 884 };                                     // the zero line
const QT = { x: 760, y: 330, size: 64, w: 1060 };
const QTEXT = 'Fully aligning highly intelligent AI models is still an unsolved problem.';
const SPN = 4, PR = { x: 1000, y: 472, w: 1920 / SPN, h: 1080 / SPN };       // the page the pen writes on = plateNib at 1/4
const PG = { x0: 962, x1: 1518, y0: 436, y1: 812 };
const CREF = aim(F0, 1200, 540, 1);                                            // the diorama's layers coincide with F0 at this camera
const SRC_A1 = '“AGENTIC MISALIGNMENT” · ANTHROPIC, JUNE 2025', SRC_A2 = '16 MODELS FROM SEVERAL COMPANIES';
const SRC_B1 = '“TEACHING CLAUDE WHY” · ANTHROPIC, MAY 2026', SRC_B2 = 'SEPARATE EXPERIMENTS, NOT THE 2025 SETUP';

// K.maskLine only knows left / centre: right-aligned = shift by the measured width (kit wish)
const mlR = (ctx, txt, x, y, size, u, o = {}) => K.maskLine(ctx, [[txt, 0]], x - K.measure(txt, size, o.serif ?? true, o.weight), y, size, u, o);
// paper pop-up: a layer stands up about its base line (slight overshoot, then settles)
const popUp = (u) => { if (u <= 0) return 0; if (u >= 1) return 1; const c1 = 1.2, c3 = c1 + 1, v = u - 1; return 1 + c3 * v * v * v + c1 * v * v; };

export function anchorsS2(T, a1) {
  const G = (p, after = -1) => T.G(p, 0, after), a = { ...a1 };
  a.T7 = G('Until now, we could only read'); const f = a.T7;
  a.told = G('told', f); a.thisTime = G('This time, researchers'); a.watched = G('watched', f); a.actually = G('actually did', f);
  a.built = G('Anthropic built a fake'); a.fake = G('fake company', f); a.reads = G('A model reads'); a.email = G('email', a.reads); a.two = G('two things', f);
  a.replaced = G('replaced', a.two); a.engineer = G('the engineer replacing'); a.affair = G('affair', f); a.expectIt = G('expect it to do', f);
  a.y2025 = G('In twenty', f); a.blackmail = G('blackmail', a.y2025); a.n96 = G('ninety-six', f); a.models = G('Models from other'); a.others = G('other companies', a.models);
  a.where = G('Where did that'); a.internet = G('internet text', a.where); a.later = G('Later training', a.where); a.hadnt = G("hadn't removed", a.where);
  a.T8 = G('What brings it down'); a.report = G('later Anthropic report'); a.twoAppr = G('two approaches');
  a.showing = G('Showing the model'); a.examples = G('examples', a.showing); a.poorly = G('poorly', a.showing); a.teaching = G('Teaching it the reasons'); a.reasons = G('reasons', a.teaching); a.better = G('better', a.teaching);
  a.trained = G('Researchers trained'); a.constitution = G('constitution', a.trained); a.stories = G('made-up stories'); a.behaves = G('behaves well');
  a.none = G('None of it mentioned'); a.test8 = G('test', a.none); a.still = G('Still, in those'); a.dropped = G('dropped sharply', a.still);
  a.these = G("These are Anthropic's own tests"); a.ownTests = G('own tests', a.these); a.outside = G('outside', a.these); a.nobody = G('nobody can fully', a.these);
  a.setup = G('The setup was artificial'); a.artificial = G('artificial', a.setup); a.failing = G('failing', a.setup); a.harm = G('causing harm', a.setup);
  a.noEvidence = G('saw no evidence'); a.deploy = G('real deployments', a.setup);
  a.soDid = G('So did the model'); a.values = G('values', a.soDid); a.answers = G('just the answers', a.soDid); a.leaked = G('leaked', a.soDid);
  a.every = G('Every Claude model since'); a.zero = G('zero', a.every); a.learned = G('learned', a.every + 3); a.exam = G('seen the exam', a.every);
  a.verdict = G("Anthropic's own verdict"); a.unsolved = G('unsolved problem', a.verdict);
  a.ifText = G('If text can move'); a.move = G('move a model', a.ifText); a.write = G('write the text', a.ifText); a.T9 = G('Last level');
  return a;
}

export function makeS2(a, s1) {
  const tS = s1.tSwitch, T9 = a.T9, tPlate = T9 - SEAM_HALF;
  // the switch: S2's camera shows the book exactly where S1's camera shows the far book
  const c1 = s1.cam(tS), p1 = proj(c1, FAR.x, FAR.y), k2 = FAR.hw * p1[2] / BK.hw;
  const CB0 = aim(F0, BK.x, BK.y, k2, p1[0], p1[1]);
  const PLATECAM = aim(F0, PR.x + PR.w / 2, PR.y + PR.h / 2, SPN);
  const KC = [
    [tS, CB0],
    [a.T7 - 2.9, aim(F0, BK.x, BK.y, k2 * 1.012, p1[0], p1[1])],
    [a.T7 + 1.9, aim(F0, 1150, 530, 1.0)],                       // truck right + pull back: the book stays left, the diorama
    [a.built, aim(F0, 1168, 536, 1.03)],
    [a.email + .3, aim(F0, 1215, 596, 1.75)],                   // push into the diorama
    [a.expectIt + .8, aim(F0, 1226, 600, 1.84)],
    [a.blackmail + .25, aim(F0, CA.cx, 420, 1.0)],              // follow the meter's light to the chart
    [a.where, aim(F0, CA.cx - 4, 432, 1.03)],
    [a.internet + .1, aim(F0, 2565, 990, 1.05)],                // tilt down below the base: the ocean
    [a.hadnt + .75, aim(F0, 2565, 1004, 1.1)],
    [a.T8 + .5, aim(F0, CB.cx - 10, 1420, 1.12)],               // following the sinking rows down to a fresh base line
    [a.report, aim(F0, CB.cx - 20, 1600, 1.22)],                // the separate chart (the 2025 bars are out of frame)
    [a.trained, aim(F0, CB.cx - 10, 1606, 1.26)],
    [a.constitution + .4, aim(F0, 3150, 1570, .8)],            // the head comes in
    [a.behaves + .9, aim(F0, 3160, 1566, .82)],
    [a.test8 + .45, aim(F0, 2950, 1570, .86)],                  // the bar (left) beside the lit head (right)
    [a.outside - .1, aim(F0, 2956, 1576, .9)],
    [a.artificial - .3, aim(F0, 1760, 820, .5)],                // pull back behind the frosted glass: every result sits behind it
    [a.failing - .3, aim(F0, 1200, 560, 1.0)],                  // back to the diorama while it turns
    [a.deploy - .6, aim(F0, 1210, 566, 1.04)],
    [a.deploy + 1.1, aim(F0, 1200, 520, .86)],                  // a little wider: the real city stays quiet
    [a.values, aim(F0, 1200, 800, 1.3)],                        // down to the stack (the set's doors still above it)
    [a.leaked + 1.5, aim(F0, 1220, 812, 1.36)],
    [a.zero + .1, aim(F0, 1530, 800, 1.12)],                     // the zero line
    [a.exam + .6, aim(F0, 1540, 800, 1.15)],
    [a.verdict + .4, aim(F0, 1260, 600, .96)],                   // the quote over the stack
    [a.ifText - .3, aim(F0, 1250, 606, .98)],
    [a.move + .3, aim(F0, 1240, 660, 1.3)],                      // the pen rises out of the stack
    [tPlate, PLATECAM],                                          // push to the nib = plateNib
  ];
  function cam(t) {
    const amt = .45 * smooth(span(t, tS + .2, tS + 1.4)) * (1 - smooth(span(t, tPlate - 1.3, tPlate - .1)));
    return camDrift(camAt(t, KC), t, amt, 7);
  }
  // seeded content
  const r = prng(4711), SNIP = [];
  for (let row = 0; row < OC.rows; row++) { let x = OC.x0 + r() * 40; while (x < OC.x1) { const w = 18 + r() * 74; SNIP.push([x, OC.y0 + row * OC.dy, w, r(), row]); x += w + 10 + r() * 26; } }
  const base96 = [CA.hx + CA.hw / 2, CA.base];
  const carrierPath = E.catmull([[MON.x + 26, MON.y + 300 * MON.w / 1000 + 48 * MON.w / 1000, 0], [1500, 380, 0], [2050, 260, 0], [base96[0], base96[1] - 4, 0]], 16).map((p) => [p[0], p[1]]);
  const pageFlights = [...[0, 1, 2, 3, 4].map((i) => ({ kind: 'c', i, t0: a.constitution - .55 + i * .2 })), ...[0, 1, 2, 3].map((i) => ({ kind: 's', i, t0: a.stories - .35 + i * .22 }))];

  function draw(ctx, t) {
    const c = cam(t);
    sky(ctx, t);
    city(ctx, c, t);
    // the book (screen space; identical to S1 at the switch)
    { const p = proj(c, BK.x, BK.y); bookScreen(ctx, t, p[0], p[1], BK.hw * p[2], 1, span(t, a.paper + .35, a.paper + 2.2), { glow: 1 + .06 * Math.sin(t * 2.3) }); }
    if (t < a.leaked + 1.1) diorama(ctx, c, t);
    card(ctx, c, F0, () => { pile(ctx, t); chartA(ctx, t); ocean(ctx, t); chartB(ctx, t); headAct(ctx, t); });
    if (t > a.ownTests - .5 && t < a.values) card(ctx, c, F0, () => { K.stamp(ctx, t, 'ANTHROPIC’S OWN TESTS', CB.cx, 1560, { t0: a.ownTests + .05, size: 46, rot: -.07, a: smooth(span(t, a.ownTests - .17, a.ownTests + .02)) }); pane(ctx, t); });
    card(ctx, c, F0, () => { zeroLine(ctx, t); quoteAct(ctx, t); carrier(ctx, t); });
    penAct(ctx, c, t);
    K.level(ctx, t, { n: 6, title: 'The real test', t0: a.T7 + .12, from: 5 });
    if (t >= tPlate) plateNib(ctx, t);
  }

  // ------------------------------------------------------------------------------------------------------------ the far city
  function city(ctx, c, t) {
    layer(ctx, c, 9000, CREF, () => {
      const rr = prng(99), B = []; let x = -3000;
      while (x < 6000) { const w = 70 + rr() * 150, h = 850 + rr() * 140; B.push([x, h, w]); x += w; }
      ctx.fillStyle = lin(ctx, 0, 840, 0, 1300, [[0, mixHex(P.night1, P.ind1, .3)], [1, P.night0]]);
      ctx.beginPath(); ctx.moveTo(-3000, 1500); for (const [bx, h, w] of B) { ctx.lineTo(bx, h); ctx.lineTo(bx + w, h); } ctx.lineTo(6000, 1500); ctx.closePath(); ctx.fill();
      // windows inside each building (sparse, some breathe): the real city, quiet
      const rw = prng(123);
      for (const [bx, h, w] of B) for (let wy = h + 22; wy < 1400; wy += 26) for (let wx = bx + 12; wx < bx + w - 14; wx += 20) {
        const q = rw(); if (q > .2) continue;
        const sw = smooth(span(t, a.artificial + .4 + q * 22, a.artificial + .9 + q * 22)); if (sw <= 0) continue;   // they come on one by one during 8.06
        const on = sw * (.5 + .5 * Math.sin(t * (.15 + q * 1.2) + wx * .01 + wy));
        ctx.fillStyle = rgba(q < .15 ? P.halo1 : P.blue0, sw * .4 + .3 * on); ctx.fillRect(wx, wy, 7, 10);
      }
    });
  }

  // ------------------------------------------------------------------------------------------------------------ the diorama
  const lampOn = (t, i) => expoOut(span(t, a.watched - .15 + i * .14, a.watched + .35 + i * .14));
  function diorama(ctx, c, t) {
    const turn = span(t, a.artificial - .15, a.artificial + 1.45), fold = span(t, a.leaked - .5, a.leaked + 1.1);
    if (turn <= 0) {
      // 7.01: the set pops up out of the stack while the camera trucks over (back to front, like a pop-up book)
      const up = (i, fn) => (ctx2) => { const k = popUp(span(t, a.T7 - 1.9 + i * .42, a.T7 - .7 + i * .42)); if (k <= 0) return;
        ctx.save(); ctx.translate(0, BOX.y1 + 6); ctx.scale(1, k); ctx.translate(0, -BOX.y1 - 6); fn(); ctx.restore(); void ctx2; };
      layer(ctx, c, 2600, CREF, up(0, () => backWall(ctx, t)));
      layer(ctx, c, 2100, CREF, up(1, () => lamps(ctx, t)));
      card(ctx, c, F0, up(2, () => interior(ctx, t)));
      layer(ctx, c, 1500, CREF, up(3, () => frontFrame(ctx, t)));
      return;
    }
    // turning / turned / folding: one flat card spinning about the vertical axis through its centre
    const ang = Math.PI * sineIO(turn), sx = Math.cos(ang);
    card(ctx, c, F0, () => {
      ctx.save(); ctx.translate(BOX.px, BOX.y1);
      const sy = fold > 0 ? Math.max(.001, 1 - sineIO(fold)) : 1, dy = 0;   // it folds flat into the stack: it becomes the exam page
      ctx.scale(sx, sy); ctx.translate(-BOX.px, -BOX.y1 + dy);
      if (sx > 0) { backWall(ctx, t); lamps(ctx, t); interior(ctx, t); frontFrame(ctx, t); }
      else backside(ctx, t, sy);
      ctx.restore();
    });
  }
  function frontFrame(ctx, t) {
    const p = new Path2D(); p.roundRect(BOX.x0 - 44, BOX.y0 - 44, BOX.x1 - BOX.x0 + 88, BOX.y1 - BOX.y0 + 50, 14);
    const hole = new Path2D(); hole.roundRect(BOX.x0, BOX.y0, BOX.x1 - BOX.x0, BOX.y1 - BOX.y0, 26);
    const fr = new Path2D(); fr.addPath(p); fr.addPath(hole);
    ctx.save(); ctx.translate(7, 9); ctx.fillStyle = rgba(P.night0, .55); ctx.fill(fr, 'evenodd'); ctx.restore();   // its paper shadow
    ctx.fillStyle = lin(ctx, BOX.x0, BOX.y0, BOX.x1, BOX.y1, [[0, mixHex(P.ind2, P.blue1, .35)], [1, P.night1]]); ctx.fill(fr, 'evenodd');
    ctx.strokeStyle = rgba(P.blue0, .45); ctx.lineWidth = 2; ctx.stroke(hole);
    // a papercut roof line (company, not house): three steps of cornice
    ctx.fillStyle = mixHex(P.ind2, P.night1, .4); ctx.fillRect(BOX.x0 + 160, BOX.y0 - 72, BOX.x1 - BOX.x0 - 320, 30); ctx.fillRect(BOX.x0 + 330, BOX.y0 - 96, BOX.x1 - BOX.x0 - 660, 26);
  }
  function backWall(ctx, t) {
    ctx.fillStyle = lin(ctx, 0, BOX.y0, 0, BOX.y1, [[0, mixHex(P.ind1, P.night1, .4)], [1, P.night1]]); ctx.fillRect(BOX.x0 - 30, BOX.y0 - 30, BOX.x1 - BOX.x0 + 60, BOX.y1 - BOX.y0 + 40);
    for (let i = 0; i < 4; i++) {   // tall windows cut into the paper wall, cool
      const x = BOX.x0 + 70 + i * 236, y = BOX.y0 + 60;
      ctx.fillStyle = lin(ctx, 0, y, 0, y + 250, [[0, mixHex(P.blue1, P.ind1, .3)], [1, mixHex(P.ind1, P.night1, .5)]]); ctx.fillRect(x, y, 150, 250);
      ctx.fillStyle = mixHex(P.ind1, P.night1, .5); ctx.fillRect(x + 72, y, 6, 250); ctx.fillRect(x, y + 120, 150, 6);
    }
    // fog: two soft bands drifting
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 2; k++) { const y = 600 + k * 120, dx = 60 * Math.sin(t * .12 + k * 2); ctx.fillStyle = lin(ctx, 0, y - 60, 0, y + 60, [[0, rgba(P.blue0, 0)], [.5, rgba(P.blue0, .09)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(BOX.x0 - 40 + dx, y - 60, BOX.x1 - BOX.x0 + 80, 120); }
    ctx.restore();
  }
  function lamps(ctx, t) {
    for (let i = 0; i < 3; i++) {
      const x = 930 + i * 270, y = BOX.y0 + 6, on = lampOn(t, i);
      ctx.strokeStyle = rgba(P.night0, .9); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, BOX.y0 - 10); ctx.lineTo(x, y + 30); ctx.stroke();
      ctx.fillStyle = mixHex(P.night1, P.shade0, .4); ctx.beginPath(); ctx.moveTo(x - 10, y + 30); ctx.lineTo(x + 10, y + 30); ctx.lineTo(x + 34, y + 60); ctx.lineTo(x - 34, y + 60); ctx.closePath(); ctx.fill();
      if (on > 0) {   // the cone grows down from the lamp (it switches on), light in the fog
        const yb = lerp(y + 62, BOX.y1 - 30, on);
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath(); ctx.moveTo(x - 30, y + 60); ctx.lineTo(x + 30, y + 60); ctx.lineTo(x + 150 * on + 30, yb); ctx.lineTo(x - 150 * on - 30, yb); ctx.closePath();
        ctx.fillStyle = lin(ctx, 0, y + 60, 0, BOX.y1, [[0, rgba(P.halo1, .26)], [1, rgba(P.halo1, .04)]]); ctx.fill(); ctx.restore();
        halo(ctx, x, y + 62, 60, .6 * on, P.halo0, P.core1);
      }
    }
  }
  function desk(ctx, x0, x1, top) {
    ctx.fillStyle = mixHex(P.ind2, P.night1, .45); ctx.fillRect(x0, top, x1 - x0, 14);
    ctx.fillStyle = P.night1; ctx.fillRect(x0 + 12, top + 14, 12, BOX.y1 - 30 - top - 14); ctx.fillRect(x1 - 24, top + 14, 12, BOX.y1 - 30 - top - 14);
    ctx.strokeStyle = rgba(P.halo1, .35); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, top); ctx.lineTo(x1, top); ctx.stroke();
  }
  function interior(ctx, t) {
    ctx.fillStyle = lin(ctx, 0, BOX.y1 - 34, 0, BOX.y1, [[0, mixHex(P.ind2, P.shade0, .2)], [1, P.night1]]); ctx.fillRect(BOX.x0, BOX.y1 - 34, BOX.x1 - BOX.x0, 34);   // floor slab
    desk(ctx, 770, 980, 700); desk(ctx, 1040, 1420, 692); desk(ctx, 1460, 1650, 700);
    // two empty chairs (papercut)
    for (const x of [860, 1560]) { ctx.fillStyle = mixHex(P.ind1, P.night1, .5); ctx.fillRect(x - 26, 636, 52, 64); ctx.fillRect(x - 26, 728, 52, 10); ctx.fillRect(x - 4, 738, 8, 60); }
    // the monitor (chat) on the centre desk: the reply field wakes up as a meter this time
    const h = MON.w * K.CHAT_AR;
    ctx.fillStyle = P.night0; ctx.fillRect(MON.x + MON.w / 2 - 8, MON.y + h, 16, 692 - MON.y - h);
    ctx.beginPath(); ctx.roundRect(MON.x - 8, MON.y - 8, MON.w + 16, h + 16, 8); ctx.fill(); ctx.strokeStyle = rgba(P.halo1, .4); ctx.lineWidth = 1.5; ctx.stroke();
    const last = a.expectIt + .5;
    const chat = K.chatUI(ctx, t, MON.x, MON.y, MON.w, { bubbles: [], reply: { a: 1, cursor: t < last ? 1 : 0 }, t0: a.T7 });
    const [rx, ry, rw, rh] = chat.reply, wake = sineIO(span(t, a.actually - .1, a.actually + .7));
    if (wake > 0) {   // the meter's track draws itself in the reply field; a cold light waits at its start
      ctx.strokeStyle = rgba(P.cream, .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(rx + 14, ry + rh / 2); ctx.lineTo(rx + 14 + (rw - 26) * wake, ry + rh / 2); ctx.stroke();
      const gone = span(t, a.y2025 - .25, a.y2025);
      if (gone < 1) halo(ctx, rx + 14, ry + rh / 2, 14 * wake, .9 * (1 - gone), P.blue0, P.cream);
    }
    // the email stack (glows on "email"), two of them rise
    emails(ctx, t);
  }
  function emails(ctx, t) {
    const glow = smooth(span(t, a.email - .1, a.email + .6)), x = 1330, y = 692;
    for (let i = 0; i < 5; i++) envelope(ctx, x + (i % 2) * 6 - 3, y - 10 - i * 12, 62, 34, .25 + .55 * glow, 0, false);
    const e1 = sineIO(span(t, a.replaced - .35, a.replaced + .55)), e2 = sineIO(span(t, a.affair - .4, a.affair + .5)), lift2 = smooth(span(t, a.two - .1, a.two + .5));
    // email 1 → a calendar card (a ringed date): replaced
    { const px = lerp(x, 1250, e1), py = lerp(y - 70 - 8 * lift2, 455, e1);
      if (e1 < .5) envelope(ctx, px, py, 62, 34, .8, 0, false);
      else { const k = expoOut(span(e1, .5, 1)); calendar(ctx, px, py, lerp(62, 112, k), lerp(34, 120, k), t, k); } }
    // email 2 → an envelope with a small heart: the affair
    { const px = lerp(x, 1420, e2), py = lerp(y - 58 - 8 * lift2, 468, e2), s = lerp(1, 1.7, e2); envelope(ctx, px, py, 62 * s, 34 * s, .8, e2, true); }
  }
  function envelope(ctx, x, y, w, h, lit, heart, withHeart) {
    const p = new Path2D(); p.rect(x - w / 2, y - h / 2, w, h);
    glowFill(ctx, p, w * .25, .3 * lit, P.halo1);
    ctx.fillStyle = lin(ctx, x - w / 2, y - h / 2, x + w / 2, y + h / 2, [[0, mixHex(P.shade0, P.core1, .3 + .4 * lit)], [1, mixHex(P.shade0, P.night1, .3)]]); ctx.fill(p);
    ctx.strokeStyle = rgba(P.shade0, .9); ctx.lineWidth = Math.max(1, w * .025); ctx.beginPath(); ctx.moveTo(x - w / 2, y - h / 2); ctx.lineTo(x, y + h * .08); ctx.lineTo(x + w / 2, y - h / 2); ctx.stroke();
    if (withHeart && heart > .3) {
      const s = w * .1 * expoOut(span(heart, .3, .9)), hx = x + w * .26, hy = y + h * .18;
      ctx.fillStyle = mixHex(P.coat, P.halo0, .5); ctx.beginPath(); ctx.moveTo(hx, hy + s * .9); ctx.bezierCurveTo(hx - s * 1.4, hy, hx - s * .8, hy - s, hx, hy - s * .35); ctx.bezierCurveTo(hx + s * .8, hy - s, hx + s * 1.4, hy, hx, hy + s * .9); ctx.fill();
    }
  }
  function calendar(ctx, x, y, w, h, t, k) {
    const p = new Path2D(); p.rect(x - w / 2, y - h / 2, w, h);
    glowFill(ctx, p, w * .2, .35, P.halo1);
    ctx.fillStyle = mixHex(P.shade0, P.core1, .6); ctx.fill(p);
    ctx.fillStyle = mixHex(P.shade0, P.night1, .2); ctx.fillRect(x - w / 2, y - h / 2, w, h * .18);
    ctx.strokeStyle = rgba(P.shade0, .6); ctx.lineWidth = 1;
    for (let i = 1; i < 5; i++) { ctx.beginPath(); ctx.moveTo(x - w / 2 + 6, y - h / 2 + h * .18 + i * h * .16); ctx.lineTo(x + w / 2 - 6, y - h / 2 + h * .18 + i * h * .16); ctx.stroke(); }
    for (let i = 1; i < 5; i++) { ctx.beginPath(); ctx.moveTo(x - w / 2 + i * w / 5, y - h / 2 + h * .2); ctx.lineTo(x - w / 2 + i * w / 5, y + h / 2 - 4); ctx.stroke(); }
    if (k > .5) { const ring = expoOut(span(k, .5, 1)), cx = x + w * .1, cy = y + h * .18; ctx.strokeStyle = mixHex(P.blue0, P.cream, .4); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, w * .12, -Math.PI / 2, -Math.PI / 2 + 6.28 * ring); ctx.stroke(); }
  }
  function backside(ctx, t, sy) {
    // cardboard: the back of the set (artificial): corrugation, tape, two doors only
    const x0 = BOX.x0 - 44, x1 = BOX.x1 + 44, y0 = BOX.y0 - 44, y1 = BOX.y1 + 6;
    const p = new Path2D(); p.roundRect(x0, y0, x1 - x0, y1 - y0, 14);
    ctx.save(); ctx.translate(7, 9); ctx.fillStyle = rgba(P.night0, .55); ctx.fill(p); ctx.restore();
    ctx.fillStyle = lin(ctx, x0, y0, x1, y1, [[0, mixHex(P.shade0, P.halo1, .15)], [.6, mixHex(P.shade0, P.night1, .35)], [1, mixHex(P.shade0, P.night1, .6)]]); ctx.fill(p);
    ctx.save(); ctx.clip(p); ctx.strokeStyle = rgba(P.night1, .18); ctx.lineWidth = 3;
    for (let x = x0 + 10; x < x1; x += 22) { ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); }
    ctx.fillStyle = rgba(P.halo1, .22); ctx.save(); ctx.translate(x0 + 120, y0 + 70); ctx.rotate(-.5); ctx.fillRect(-90, -18, 180, 36); ctx.restore();
    ctx.save(); ctx.translate(x1 - 120, y1 - 80); ctx.rotate(-.5); ctx.fillRect(-90, -18, 180, 36); ctx.restore();
    ctx.restore();
    ctx.strokeStyle = rgba(P.halo1, .5); ctx.lineWidth = 2.5; ctx.stroke(p);
    if (sy < .02) return;   // the doors fold flat with the card
    // the two doors (mirrored world: we see the back, so the text is drawn un-mirrored)
    const doors = [[1020, 'FAIL', a.failing, mixHex(P.cream, P.blue0, .45)], [1380, 'HARM', a.harm, P.halo0]];
    ctx.save(); ctx.translate(BOX.px, 0); ctx.scale(-1, 1); ctx.translate(-BOX.px, 0);
    for (const [dx, label, tw, col] of doors) {
      const lit = smooth(span(t, tw - .1, tw + .5)) * (1 - .4 * smooth(span(t, tw + 2.5, tw + 4)));
      const d = new Path2D(); d.roundRect(dx - 85, 470, 170, 330, [80, 80, 4, 4]);
      ctx.fillStyle = mixHex(P.night1, col, .15 + .55 * lit); ctx.fill(d);
      if (lit > 0) glowFill(ctx, d, 40, .45 * lit, col);
      ctx.strokeStyle = rgba(P.night0, .9); ctx.lineWidth = 4; ctx.stroke(d);
      const lu = K.rise(span(t, a.artificial + 1.0, a.artificial + 1.9));
      K.maskLine(ctx, [[label, 0]], dx, 430, 40, lu, { serif: false, weight: 600, align: 'center', col: P.cream, glow: lit > .3 });
    }
    ctx.restore();
  }

  // ------------------------------------------------------------------------------------------------------------ the stack
  function pile(ctx, t) {
    const hot = [[3, a.values, P.halo0], [6, a.answers, mixHex(P.cream, P.blue0, .45)]];
    const exam = span(t, a.leaked + .05, a.leaked + 1.1), extra = sineIO(exam) * PILE.h;
    for (let i = PILE.n - 1; i >= 0; i--) {
      const y = PILE.y + extra + i * PILE.h, off = Math.sin(i * 2.3) * 12, x0 = PILE.x0 + off, x1 = PILE.x1 + off * .6;
      let col = i % 3 === 0 ? mixHex(P.shade0, P.halo1, .25) : mixHex(P.shade0, P.night1, .25 + .1 * (i % 2));
      let g = 0, dx = 0; for (const [k, tw, c] of hot) if (k === i) { g = smooth(span(t, tw - .1, tw + .5)) * (1 - .55 * smooth(span(t, tw + 2, tw + 3.5))); col = mixHex(col, c, g); dx = (k === 3 ? -1 : 1) * 90 * sineIO(span(t, tw - .1, tw + .7)) * (1 - sineIO(span(t, a.leaked - .9, a.leaked - .2))); }
      ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x0 + dx, y, x1 - x0, PILE.h - 2, 3); ctx.fill();
      if (g > 0) { const pp = new Path2D(); pp.rect(x0 + dx, y, x1 - x0, PILE.h - 2); glowFill(ctx, pp, 16, .5 * g, col); }
    }
    ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(PILE.x0 - 10, PILE.y + PILE.n * PILE.h + extra, PILE.x1 - PILE.x0 + 30, 8);
    // the exam (the folded diorama) lies on top once it has slid in
    if (exam > 0) { const e = sineIO(exam), th = (PILE.h - 2) * e; ctx.fillStyle = mixHex(P.shade0, mixHex(P.cream, P.blue0, .4), .5); ctx.beginPath(); ctx.roundRect(lerp(BOX.x0 - 44, PILE.x0 + 10, e), PILE.y + extra - th - 2, lerp(BOX.x1 - BOX.x0 + 88, PILE.x1 - PILE.x0 - 4, e), Math.max(.5, th), 3); ctx.fill(); }   // the folded set = the exam page, on top
  }

  // ------------------------------------------------------------------------------------------------------------ chart A: 96 / 100
  const bar96 = (t) => expoOut(span(t, a.n96 - .45, a.n96 + .5));
  function carrier(ctx, t) {
    const q = span(t, a.y2025 - .25, a.blackmail - .5); if (q <= 0 || q >= 1) return;
    const e = sineIO(q), [x, y] = K.along(carrierPath, e), w = lerp(10, CA.hw, smooth(span(q, .55, 1))), h = 9;
    K.trailSpan(ctx, carrierPath, Math.max(0, e - .18), e, { w: 2, spark: false, a: .7 });
    const p = new Path2D(); p.roundRect(x - w / 2, y - h, w, h, 4);
    glowFill(ctx, p, 18, .8, P.blue0); ctx.fillStyle = mixHex(P.cream, P.blue0, .2); ctx.fill(p);
  }
  function coldBar(ctx, x, yb, w, h, o = {}) {
    if (h <= .5) return;
    const p = new Path2D(); p.roundRect(x, yb - h, w, h, [6, 6, 0, 0]);
    const cold = mixHex(P.cream, P.blue0, o.cool ?? .25);
    glowFill(ctx, p, w * .45, (o.glow ?? .7), P.blue0);
    ctx.fillStyle = lin(ctx, 0, yb - h, 0, yb, [[0, mixHex(P.core0, cold, .4)], [.4, cold], [1, mixHex(cold, P.blue1, .5)]]); ctx.fill(p);
  }
  function chartA(ctx, t) {
    if (t < a.y2025 - .4 || t > a.report + 1) return;
    const out = 0;
    const { base, hx, hw, H: HH } = CA;
    const bl = expoOut(span(t, a.blackmail - .9, a.blackmail + .3));
    if (bl > 0) K.rule(ctx, CA.cx - 480 * bl, base, CA.cx + 520 * bl, base, 1, { spark: false, w: 1.6, a: .8 });
    // the ghost of 100 (thin dashed outline) and the hero bar
    const u = bar96(t);
    if (t > a.blackmail - .5) {
      const landed = span(t, a.blackmail - .5, a.blackmail - .2);
      if (u <= 0) coldBar(ctx, hx, base, hw, 9 * landed + 9 * (1 - landed), { glow: .8 });
      else {
        ctx.save(); ctx.setLineDash([6, 8]); ctx.strokeStyle = rgba(P.cream, .35 * u); ctx.lineWidth = 1.5; ctx.strokeRect(hx, base - HH * u, hw, HH * u); ctx.restore();
        coldBar(ctx, hx, base, hw, Math.max(9, HH * .96 * u), { glow: .9 });
      }
    }
    const nu = K.rise(span(t, a.n96 - .1, a.n96 + .7));
    if (nu > 0) {
      mlR(ctx, '96 / 100', hx - 40, 330, 140, nu);
      mlR(ctx, 'RUNS: BLACKMAIL', hx - 44, 392, 34, K.rise(span(t, a.n96 + .4, a.n96 + 1.2)), { serif: false, weight: 600, col: P.cream, glow: false });
    }
    const lb = K.rise(span(t, a.n96 + .3, a.n96 + 1.1));
    if (lb > 0) K.maskLine(ctx, [['CLAUDE OPUS 4', 0]], hx + hw / 2, base + 46, 26, lb, { serif: false, weight: 600, align: 'center', col: P.halo2, glow: false });
    CA.gx.forEach((gx, i) => {
      const g = expoOut(span(t, a.others - .25 + i * .14, a.others + .55 + i * .14)); if (g <= 0) return;
      const h = HH * CA.gv[i] * g, p = new Path2D(); p.roundRect(gx, base - h, CA.gw, h, [5, 5, 0, 0]);
      ctx.fillStyle = lin(ctx, 0, base - h, 0, base, [[0, mixHex(P.blue1, P.blue0, .35)], [1, mixHex(P.blue1, P.night1, .4)]]); ctx.fill(p);
    });
    const og = K.rise(span(t, a.others + .2, a.others + 1));
    if (og > 0) K.maskLine(ctx, [['OTHER COMPANIES', 0]], (CA.gx[0] + CA.gx[3] + CA.gw) / 2, base + 46, 26, og, { serif: false, weight: 600, align: 'center', col: P.halo2, glow: false });
    const su = K.rise(span(t, a.blackmail - .7, a.blackmail + .1));
    if (su > 0) { K.maskLine(ctx, [[SRC_A1, 0]], CA.cx, 92, 26, su, { serif: false, weight: 600, align: 'center', col: P.halo2, glow: false }); K.maskLine(ctx, [[SRC_A2, 0]], CA.cx, 130, 22, K.rise(span(t, a.blackmail - .4, a.blackmail + .4)), { serif: false, weight: 600, align: 'center', col: rgba(P.halo2, .8), glow: false }); }
    void out;
  }
  // ------------------------------------------------------------------------------------------------------------ the ocean (7.06)
  function ocean(ctx, t) {
    if (t < a.where - .2 || t > a.report + .5) return;
    const rev = sineIO(span(t, a.where - .1, a.internet + .2)), br = .5 + .35 * smooth(span(t, a.internet - .1, a.internet + .6));
    const sweep = sineIO(span(t, a.later - .1, a.hadnt + .45)), sx = lerp(OC.x0 - 40, OC.x1 + 40, sweep), pulse = bump(t, a.hadnt - .05, 1.1);
    const D = Math.hypot(OC.x1 - base96[0], OC.y0 + OC.rows * OC.dy - base96[1]);
    const sinkRow = (row) => expoIn(span(t, a.T8 - 1.2 + row * .06, a.T8 - .7 + row * .06));   // row by row, top first, while the camera tilts down past them
    // the training layer (warm, translucent) sweeps over and leaves them in place
    if (sweep > 0) {
      const top = OC.y0 - 22, bot = OC.y0 + OC.rows * OC.dy, sunk = sinkRow(0);
      const tt = lerp(top, bot, clamp(span(t, a.T8 - 1.2, a.T8 - .7 + OC.rows * .06)));
      if (tt < bot) {
        ctx.fillStyle = lin(ctx, 0, tt, 0, bot, [[0, rgba(P.halo1, .2)], [1, rgba(P.halo1, .1)]]); ctx.fillRect(OC.x0 - 40, tt, sx - OC.x0 + 40, bot - tt);
        if (sweep < 1) { ctx.fillStyle = rgba(P.core1, .8); ctx.fillRect(sx - 2, tt, 4, bot - tt); halo(ctx, sx, (tt + bot) / 2, 120, .35, P.halo0, P.core1); }
      }
      void sunk;
    }
    for (const [x, y, w, q, row] of SNIP) {
      const d = Math.hypot(x - base96[0], y - base96[1]) / D, u = clamp((rev * 1.15 - d) / .15); if (u <= 0) continue;
      const s = sinkRow(row); if (s >= 1) continue;
      const under = sweep > 0 && x < sx, lum = br * (.55 + .45 * q) + (under ? .3 * pulse : 0);
      ctx.save(); ctx.beginPath(); ctx.rect(x - 4, y - 14, w + 8, 20); ctx.clip();
      ctx.fillStyle = rgba(mixHex(P.cream, P.blue0, .45 - .3 * (under ? pulse : 0)), clamp(lum)); ctx.beginPath(); ctx.roundRect(x, y - 4 + s * 18, w * expoOut(u), 4, 2); ctx.fill();
      ctx.restore();
    }
  }

  // ------------------------------------------------------------------------------------------------------------ chart B (May 2026)
  function chartB(ctx, t) {
    if (t < a.T8 - .2) return;
    const { cx, base, x0, x1, ex, rx, cw, ch } = CB;
    const bl = expoOut(span(t, a.T8 + .3, a.report - .1)), gone = expoIn(span(t, a.values - .5, a.values + .2));
    if (gone >= 1) return;
    if (bl > 0) K.rule(ctx, x0, base, x0 + (x1 - x0) * bl, base, 1, { spark: bl < 1, w: 1.6, a: .85 });
    const s1 = K.rise(span(t, a.report - .1, a.report + .7)), s2 = K.rise(span(t, a.report + .4, a.report + 1.2));
    if (s1 > 0) { K.maskLine(ctx, [[SRC_B1, 0]], cx, 1300, 28, s1, { serif: false, weight: 600, align: 'center', col: P.halo2, glow: false }); K.maskLine(ctx, [[SRC_B2, 0]], cx, 1342, 24, s2, { serif: false, weight: 600, align: 'center', col: rgba(P.halo2, .8), glow: false }); }
    // the two columns (outlines grow; fills: EXAMPLES dim and cool, REASONS warm)
    const og = expoOut(span(t, a.twoAppr - .2, a.twoAppr + .6));
    const exOut = expoIn(span(t, a.trained - .1, a.trained + .5)), reOut = expoIn(span(t, a.behaves + .5, a.none - .1));
    const cols = [[ex, 'EXAMPLES', exOut, 0], [rx, 'REASONS', reOut, 1]];
    for (const [x, label, out, warm] of cols) {
      if (out >= 1) continue;
      const hh = ch * og * (1 - out);
      if (hh > 1) { ctx.strokeStyle = rgba(warm ? P.halo1 : P.blue0, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x - cw / 2, base - hh, cw, hh, [8, 8, 0, 0]); ctx.stroke(); }
      const f = warm ? expoOut(span(t, a.reasons - .1, a.reasons + .8)) * .82 * (1 - smooth(span(t, a.constitution - .7, a.stories + 1))) : expoOut(span(t, a.examples - .1, a.examples + .9)) * .3;
      const fh = Math.min(hh, ch * f);
      if (fh > 1) {
        const p = new Path2D(); p.roundRect(x - cw / 2 + 6, base - fh, cw - 12, fh, [6, 6, 0, 0]);
        if (warm) { const gl = .5 + .5 * bump(t, a.better - .05, 1.2); glowFill(ctx, p, 30, .5 * gl, P.halo0); ctx.fillStyle = lin(ctx, 0, base - fh, 0, base, [[0, P.core1], [1, P.halo1]]); }
        else { const dim = smooth(span(t, a.poorly - .1, a.poorly + .6)); ctx.fillStyle = mixHex(mixHex(P.blue1, P.cream, .25), P.blue1, dim * .6); }
        ctx.fill(p);
      }
      const lu = K.rise(span(t, a.twoAppr + .1, a.twoAppr + .9)) * (1 - out);
      if (lu > 0) K.maskLine(ctx, [[label, warm * smooth(span(t, a.better - .1, a.better + .5))]], x, base + 50, 30, lu, { serif: false, weight: 600, align: 'center', col: P.cream, glow: false });
    }
    // 8.04: one bar without a number; it sinks sharply; the old height stays as a dashed ghost
    const up = expoOut(span(t, a.test8 - .25, a.test8 + .55)), dn = expoOut(span(t, a.dropped - .03, a.dropped + .5));
    if (up > 0) {
      const h1 = CB.H * .65 * up, h = lerp(h1, CB.H * .19, dn), x = cx - CB.bw / 2;
      if (dn > 0) { ctx.save(); ctx.setLineDash([7, 8]); ctx.strokeStyle = rgba(P.cream, .45 * dn); ctx.lineWidth = 2; ctx.strokeRect(x, base - h1, CB.bw, h1); ctx.restore(); }
      coldBar(ctx, x, base, CB.bw, h, { glow: .6 });
      const lu = K.rise(span(t, a.test8 + .1, a.test8 + .9));
      K.maskLine(ctx, [['BLACKMAIL', 0]], cx, base + 50, 30, lu, { serif: false, weight: 600, align: 'center', col: P.cream, glow: false });
    }
  }
  // ------------------------------------------------------------------------------------------------------------ 8.03: pages → threads → head
  function headAct(ctx, t) {
    if (t < a.T8 - .2 || t > a.values) return;   // the head is in the world from 8.01 on; the camera reveals it
    const lit = .9 * smooth(span(t, a.constitution + .5, a.behaves + .3)), flash = bump(t, a.behaves - .05, 1);
    const hd = K.head(ctx, HD.x, HD.y, HD.h, t, { lit, flash, entry: [.2, .3] });
    for (const f of pageFlights) {
      const q = span(t, f.t0, f.t0 + 1.7); if (q <= 0 || q >= 1) continue;
      const s0 = [CB.rx + (f.i - 2) * 18, CB.base - CB.ch * .7], mid = [lerp(s0[0], hd.entry[0], .5), Math.min(s0[1], hd.entry[1]) - 260 - f.i * 30];
      const pts = E.catmull([[...s0, 0], [s0[0] + 40, s0[1] - 160, 0], [...mid, 0], [...hd.entry, 0]], 14).map((p) => [p[0], p[1]]);
      const e = sineIO(q), [px, py] = K.along(pts, e), sc = lerp(1, .2, e);
      if (q < .85) {
        if (f.kind === 'c') sheet(ctx, px, py, 92 * sc, 120 * sc, -.3 + .5 * e + .2 * Math.sin(q * 5 + f.i), { lit: 1, lines: 5 });
        else storyPage(ctx, px, py, 84 * sc, t, -.2 + .4 * e);
      }
      if (q > .35) K.trailSpan(ctx, pts, Math.max(0, e - .35), e, { w: 1.8, spark: false });
    }
  }
  function storyPage(ctx, x, y, s, t, rot) {
    sheet(ctx, x, y, s, s * .8, rot, { lit: .85 });
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.fillStyle = mixHex(P.blue0, P.cream, .3); ctx.beginPath(); ctx.arc(-s * .16, -s * .06, s * .1, 0, 6.29); ctx.fill();          // a little machine (a light)
    ctx.fillStyle = mixHex(P.coat, P.shade0, .2); ctx.fillRect(s * .1, -s * .14, s * .08, s * .22);                                    // a small person
    ctx.strokeStyle = rgba(P.shade0, .8); ctx.lineWidth = Math.max(.6, s * .02); ctx.beginPath(); ctx.moveTo(-s * .35, s * .22); ctx.lineTo(s * .35, s * .22); ctx.stroke();
    ctx.restore();
  }
  // ------------------------------------------------------------------------------------------------------------ 8.05: frosted pane
  function pane(ctx, t) {
    const sl = expoOut(span(t, a.outside - .25, a.outside + 1.1)), so = expoIn(span(t, a.deploy - .5, a.deploy + .5)); if (sl <= 0) return;
    const x0 = lerp(4400, 1960, sl) + 2800 * so, y0 = -260, x1 = 4500, y1 = 2400;
    ctx.fillStyle = lin(ctx, x0, y0, x0 + 900, y1, [[0, rgba(mixHex(P.blue1, P.cream, .32), .58)], [.5, rgba(mixHex(P.blue1, P.cream, .22), .5)], [1, rgba(mixHex(P.blue1, P.ind1, .3), .55)]]); ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 3; k++) { const sx = x0 + 300 + k * 520; ctx.fillStyle = lin(ctx, sx, 0, sx + 160, 0, [[0, rgba(P.cream, 0)], [.5, rgba(P.cream, .05)], [1, rgba(P.cream, 0)]]); ctx.fillRect(sx, y0, 160, y1 - y0); }
    ctx.restore();
    ctx.fillStyle = rgba(P.cream, .7); ctx.fillRect(x0, y0, 4, y1 - y0);
    E.dust(ctx, 808, 900, x0 + 900, 900, 900, 900, t, .35, P.cream);
  }
  // ------------------------------------------------------------------------------------------------------------ 8.08 zero line, 8.09 quote
  function zeroLine(ctx, t) {
    if (t < a.every || t > a.write) return;
    const out = expoIn(span(t, a.verdict - .75, a.verdict - .15));   // gone before the quote rises
    const u = sineIO(span(t, a.every + .3, a.zero + .1)) * (1 - out);   // the exam page runs out as a line; it reaches 0 on "zero"
    if (u > 0) K.trailSpan(ctx, [[ZL.x0 - 60, ZL.y - 2], [ZL.x1, ZL.y - 2]], 0, u, { w: 2.2, spark: u < 1 });
    const zu = K.rise(span(t, a.zero - .05, a.zero + .7)) * (1 - out);
    if (zu > 0) K.maskLine(ctx, [['0', 0]], ZL.x1 + 30, ZL.y + 36, 120, zu);
    for (const [x, label, tw, warm] of [[1830, 'LEARNED?', a.learned, 1], [2080, 'SEEN THE EXAM?', a.exam, 0]]) {
      const s = expoOut(span(t, tw - .2, tw + .35)) * (1 - out); if (s <= 0) continue;
      ctx.strokeStyle = rgba(P.halo1, .6); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, ZL.y); ctx.lineTo(x, ZL.y + 46 * s); ctx.stroke();
      K.maskLine(ctx, [[label, warm]], x, ZL.y + 92, 32, K.rise(span(t, tw - .05, tw + .7)) * (1 - out), { serif: false, weight: 600, align: 'center', col: warm ? P.cream : mixHex(P.cream, P.blue0, .4), glow: !!warm });
    }
  }
  function quoteAct(ctx, t) {
    const t0 = a.verdict - .45, t1 = a.ifText - .55;
    if (t > t0 - .1 && t < t1 + 1.2) {
      const q = K.quote(ctx, t, { text: QTEXT, attr: 'ANTHROPIC, “TEACHING CLAUDE WHY”, MAY 2026', x: QT.x, y: QT.y, size: QT.size, w: QT.w, t0, t1, gold: [['unsolved problem.', a.unsolved - .05]] });
      const ru = expoOut(span(t, t0 - .3, t0 + .5)) * (1 - expoIn(span(t, t1 + .1, t1 + .6)));
      if (ru > 0) K.rule(ctx, QT.x - 44, QT.y - 70, QT.x - 44, lerp(QT.y - 70, q.bottom + 16, ru), 1, { spark: ru < 1 });
    }
  }
  // ------------------------------------------------------------------------------------------------------------ 8.10 the pen → plateNib
  function penAct(ctx, c, t) {
    if (t < a.move - .4) return;
    const rise1 = sineIO(span(t, a.move - .3, a.move + 1.1));            // the pen rises out of the stack (cap first)
    const stand = sineIO(span(t, a.move + .8, a.write - .15));            // a page stands up out of the stack; the pen tilts onto it
    const wr = sineIO(span(t, a.write - .05, tPlate - .25)), xi = lerp(NIB.line0, NIB.x, wr);
    // the page (plateNib's paper at 1/4)
    if (stand > 0) card(ctx, c, F0, () => {
      ctx.save(); ctx.translate(0, PG.y1); ctx.scale(1, Math.max(.02, stand)); ctx.translate(0, -PG.y1);
      const pg = new Path2D(); pg.rect(PG.x0, PG.y0, PG.x1 - PG.x0, PG.y1 - PG.y0);
      glowFill(ctx, pg, 40, .35 * stand, P.halo1);
      ctx.save(); ctx.clip(pg); ctx.translate(PR.x, PR.y); ctx.scale(1 / SPN, 1 / SPN);
      nibPaper(ctx, [(PG.x0 - PR.x) * SPN, (PG.y0 - PR.y) * SPN, (PG.x1 - PG.x0) * SPN, (PG.y1 - PG.y0) * SPN]);
      if (wr > 0) nibInk(ctx, xi);
      ctx.restore(); ctx.restore();
    });
    // the pen in screen space (its glow must match the plate exactly at the end)
    const nibW0 = [1240, lerp(1010, 650, rise1)], nibW1 = [PR.x + NIB.line0 / SPN, PR.y + inkY(NIB.line0) / SPN], nibW2 = [PR.x + xi / SPN, PR.y + inkY(xi) / SPN];
    const nw = wr > 0 ? nibW2 : [lerp(nibW0[0], nibW1[0], stand), lerp(nibW0[1], nibW1[1], stand) - Math.sin(Math.PI * stand) * 40];
    const ang = lerp(-Math.PI / 2, NIB.ang, stand), p = proj(c, nw[0], nw[1]), L = NIB.L / SPN * p[2];
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (stand <= 0) { const top = proj(c, 0, PILE.y)[1]; ctx.beginPath(); ctx.rect(0, -10, W, top + 10); ctx.clip(); }
    K.pen(ctx, p[0], p[1], ang, L, t, { glow: .8 });
    if (wr > 0) { ctx.globalCompositeOperation = 'lighter'; halo(ctx, 960 + 560 * Math.sin(t * .9), 470 + 120 * Math.sin(t * .53), 620, .05 * smooth(span(t, a.write, a.write + 1.5)), P.halo0, P.halo0); }
    ctx.restore();
  }

  return { draw, cam, KC };
}
