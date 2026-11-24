// Film 41 · c01 · the hook (lead) · 0 → 'What changed is his picture' (docs/shots.md H.01–H.22)
// A locked-frame motion-design sequence: one designed graphic per sentence on the stage, joined by carriers (no cut, no crossfade):
//   H.01 THE SKY (thumbnail A): the hand of light turns its thumb down, you at your desk below, GATES CHANGED / HIS MIND ON AI
//   → the hand rewinds to thumb-up and shrinks into the icon on 2023 (scale morph) · H.02 the axis 2023 → 2026, the "manageable" quote
//   · H.03 the icon slides to 2026 and turns down, FAR FEWER JOBS · H.04 the axis clones into the job field, the icon flies to the top
//   right and sends the cold ripple over every tile · H.05/06 screen / hand glyphs · H.07 one tile lifts and opens into YOUR WINDOW
//   · H.08 you look up, the icon grows into the dim hand in the sky · H.09 the quote on the glass · H.10 the underline becomes his
//   voice lane (pulses at four dates), the answer lane below · H.11 the answer stays flat · H.12 the flat lane folds into THE SWITCH
//   (stays ON, machines run below) · H.13 ★ the knob rolls out and becomes the gold thread: a ring sets a block of the field aside
//   · H.14 gold, people · H.15 cyan tiles bounce off the ring · H.16 the ringed block folds into THE LIST · H.17 HUMAN RESERVED
//   · H.18/19 your tile docks on a line, slides off · H.20 the empty lines wait · H.21 the sheet becomes the clip plate · H.22 C1
//   → the plate shrinks into plateMachine (seam Lead → B1).
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f41_kit.mjs';
import * as S from '../lib/f41_world.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo } = E;
const { GOLD, CREAM, CREAM2, MACH, AMBER, SOURCES: SRC } = F;
const TAU = Math.PI * 2;
const ANG = 2.55;                                            // the hand's arm direction (thumbnail A), kept for every size of the hand
const fistToWrist = (x, y, L) => [x - Math.cos(ANG) * .5 * L, y - Math.sin(ANG) * .5 * L];
const lerpL = (a, b, u) => Math.exp(lerp(Math.log(a), Math.log(b), u));   // sizes interpolate in log space (even perceived speed)
const bumpT = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));

export default (T, R) => {
  const G = (p, after = -1) => T.G(p, 0, after);
  const k = {};
  k.changed = G('changed his mind');
  k.three = G('Three years ago'); k.risks = G('risks', k.three); k.real = G('real', k.risks); k.but = G('but', k.real); k.manage = G('manageable', k.real);
  k.now = G('Now he warns'); k.far = G('far fewer', k.now); k.fewer = G('fewer', k.far); k.jobs = G('jobs', k.fewer);
  k.noJob = G('No job, he says'); k.job = G('job', k.noJob); k.says = G('says', k.noJob); k.untouched = G('untouched', k.noJob);
  k.screen = G('Jobs at a screen'); k.screenW = G('screen', k.screen); k.hand = G('Jobs done by hand'); k.handW = G('hand', k.hand);
  k.whatever = G('Whatever your job is'); k.means = G('means yours', k.whatever); k.yours = G('yours too', k.whatever); k.too = G('too', k.yours);
  k.see = G('So what did Bill Gates see'); k.seeW = G('see', k.see + .5);
  k.words = G('His own words'); k.this1 = G('This is crazy'); k.crazy = G('crazy', k.this1); k.this2 = G('This is insane'); k.insane = G('insane', k.this2);
  k.shocked = G("He's shocked"); k.one = G('one of the first', k.shocked); k.first = G('first saying', k.shocked);
  k.deaf = G('And deafened by the silence'); k.deafW = G('deafened', k.deaf); k.silence = G('silence', k.deaf);
  k.stop = G("But he doesn't want to stop"); k.stopW = G('stop the machines', k.stop); k.machines = G('machines', k.stopW);
  k.aside = G('He wants certain work set aside'); k.set = G('set aside', k.aside); k.asideW = G('aside', k.set);
  k.people = G('For people only'); k.peopleW = G('people only', k.people); k.only = G('only', k.peopleW);
  k.even = G('Even where a machine could'); k.machineW = G('machine could', k.even); k.could = G('could do', k.even);
  k.list = G('Think of it as a list'); k.listW = G('list', k.list);
  k.calls = G('He calls it Human Reserved'); k.human = G('Human Reserved', k.calls); k.reserved = G('Reserved', k.human);
  k.your = G('Your job could be on it'); k.on = G('on it', k.your);
  k.left = G('Or left off'); k.leftW = G('left off', k.left); k.off = G('off', k.leftW);
  k.notW = G("The list hasn't been written"); k.written = G('written yet', k.notW); k.yet = G('yet', k.written);
  k.ft = G('This month, at a Financial'); k.plainly = G('plainly', k.ft);
  const C1 = T.clip('C1'), seam = R.b - S.SEAM_HALF;

  // ------------------------------------------------------------------ layout
  const P23 = [560, 560], P26 = [1360, 560], ICON_L = 70, TOP_FIST = S.skyFist(), SKY_L = S.SKY_HAND.L, ICON2 = [1700, 190];
  const FLD = F.field(16, 6, 64, 14, 900, 480), YOU_I = 2 * 16 + 7;
  const VAR = (() => { const r = E.prng(4101); return Array.from({ length: FLD.n }, () => .55 + .45 * r()); })();
  const WIN = { x: 600, y: 220, w: 600, h: 450 };
  const LANE1 = 460, LANE2 = 650, LX0 = 160, LX1 = 1760, DATES_X = [520, 840, 1160, 1480];
  const SW = [960, 560], SWW = 380;
  const BLK = { c0: 5, c1: 10, r0: 1, r1: 4 }, inBlk = (i) => { const c = FLD.col(i), r = FLD.row(i); return c >= BLK.c0 && c <= BLK.c1 && r >= BLK.r0 && r <= BLK.r1; };
  const bx0 = FLD.pos(BLK.r0 * 16 + BLK.c0)[0] - 32 - 14, by0 = FLD.pos(BLK.r0 * 16 + BLK.c0)[1] - 32 - 14;
  const bx1 = FLD.pos(BLK.r1 * 16 + BLK.c1)[0] + 32 + 14, by1 = FLD.pos(BLK.r1 * 16 + BLK.c1)[1] + 32 + 14;
  const LIST = { x: 760, y: 140, w: 400, h: 680, n: 8 };
  const lineY = (i) => LIST.y + LIST.h * .25 + LIST.h * .7 * (i + .5) / LIST.n, LX = [LIST.x + LIST.w * .11, LIST.x + LIST.w * .89];
  const ringPts = (x0, y0, x1, y1, r) => {   // a rounded rect, clockwise from the top-left corner's end (where the thread starts)
    const pts = [], arc = (cx, cy, a0) => { for (let i = 0; i <= 6; i++) { const a = a0 + Math.PI / 2 * i / 6; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
    pts.push([x0 + r, y0]); arc(x1 - r, y0 + r, -Math.PI / 2); arc(x1 - r, y1 - r, 0); arc(x0 + r, y1 - r, Math.PI / 2); arc(x0 + r, y0 + r, Math.PI); pts.push([x0 + r, y0]);
    return pts;
  };
  // the cold ripple (H.04): from the icon's fist at k.says, 1100 px/s
  const RIP0 = ICON2, ripR = (t) => (t - k.says) * 1100;
  // the cyan tiles that try the ring (H.15): row, side, contact time
  const PUSH = [{ r: 2, side: -1 }, { r: 3, side: 1 }, { r: 1, side: 1 }, { r: 4, side: -1 }].map((p, i) => ({ ...p, tc: k.even + .55 + i * .38 }));

  // ------------------------------------------------------------------ the hand (one object all through the hook)
  function handState(t) {
    // H.01: the sky hand; → H.02 rewinds and shrinks onto 2023; H.03 slides to 2026, turns down; H.04 flies top right (the ripple's
    // origin); H.08 grows into the dim hand in the sky; H.10 withdraws up out of the frame
    const m1 = quartIO(span(t, k.three - .35, k.three + .85));
    let fist = [lerp(TOP_FIST[0], P23[0], m1), lerp(TOP_FIST[1], P23[1] - 10, m1) - 120 * Math.sin(Math.PI * m1)], L = lerpL(SKY_L, ICON_L, m1);
    let turn = span(t, k.changed - .1, k.changed + 1.5) * (1 - span(t, k.three - .35, k.three + .7));
    let lum = 1;
    const m2 = quartIO(span(t, k.now - .05, k.now + 1.0));
    fist = [lerp(fist[0], P26[0], m2), fist[1] - 60 * Math.sin(Math.PI * m2)];
    turn = Math.max(turn, span(t, k.now + .45, k.now + 1.45));
    const m3 = quartIO(span(t, k.noJob - .15, k.noJob + .75));
    fist = [lerp(fist[0], ICON2[0], m3), lerp(fist[1], ICON2[1], m3)]; L = lerpL(L, 90, m3);
    lum = lerp(1, .55, span(t, k.screen - .2, k.screen + .6));
    const m4 = quartIO(span(t, k.see - .3, k.see + 1.3));
    fist = [lerp(fist[0], TOP_FIST[0] + 60, m4), lerp(fist[1], TOP_FIST[1] - 90, m4)]; L = lerpL(L, SKY_L, m4); lum = lerp(lum, .4, m4);
    lum = lerp(lum, .22, span(t, k.words, k.words + .8));
    const m5 = expoIn(span(t, k.shocked - .4, k.shocked + .5));
    fist = [fist[0] + 520 * m5, fist[1] - 520 * m5];
    const arm = L > 160 ? 3.8 : 1.1;   // the small icon has a short cuff; the arm grows back while it grows into the sky
    return { fist, L, turn, lum, arm, gone: m5 >= 1 };
  }
  function drawHand(ctx, t) {
    const h = handState(t); if (h.gone) return null;
    const w = fistToWrist(h.fist[0], h.fist[1], h.L), early = 1 - span(t, k.three - .5, k.three + .1);
    return F.hand(ctx, t, w[0], w[1], h.L, { turn: h.turn, lum: h.lum, arm: h.arm, ghost: span(t, k.changed + .7, k.changed + 1.7) * early, arrow: span(t, k.changed - .05, k.changed + 1.3) * early, dust: h.L > 120 ? .6 : 0 });
  }

  // ------------------------------------------------------------------ the job field (H.04–H.07, H.13–H.16)
  function drawField(ctx, t) {
    const born = k.noJob + .05, back = k.aside - .55;
    const firstLife = t < k.whatever + 1.6, secondLife = t >= back - .1 && t < k.list + 1.4;
    if (!firstLife && !secondLife) return;
    const rr = ripR(t);
    for (let i = 0; i < FLD.n; i++) {
      const [gx, gy] = FLD.pos(i), c = FLD.col(i), r = FLD.row(i), s = FLD.s;
      const d0 = Math.abs(c - 7.5) * .022 + r * .03;
      let x = gx, y = gy, size = s, a = 1, dim = 0, cold = 0, gold = 0, flash = 0, glyph = null, ga = 0, lift = 0;
      if (firstLife && t < k.whatever + 1.6) {
        if (i === YOU_I && t > k.whatever) continue;            // the lifted tile is drawn by drawYou
        const u = expoOut(span(t, born + d0, born + d0 + .6));
        x = lerp(lerp(P23[0], P26[0], c / 15), gx, u); y = lerp(P23[1], gy, u); size = s * u;
        const d = Math.hypot(gx - RIP0[0], gy - RIP0[1]);
        if (t > k.says) { flash = clamp(1 - Math.abs(rr - d) / 140); cold = .22 * clamp((rr - d) / 200); }
        if (c < 8) { glyph = 'screen'; ga = expoOut(span(t, k.screen + c * .04, k.screen + c * .04 + .4)); }
        else { glyph = 'hand'; ga = expoOut(span(t, k.hand + (c - 8) * .04, k.hand + (c - 8) * .04 + .4)); }
        const dd = Math.hypot(c - FLD.col(YOU_I), r - FLD.row(YOU_I)) * .045, out = expoIn(span(t, k.whatever + .1 + dd, k.whatever + .7 + dd));
        dim = Math.max(dim, .85 * span(t, k.whatever, k.whatever + .5)); y += 70 * out; a *= 1 - out;
      } else {
        // the second life: the field rises again from below while the switch sinks (H.13), then the ring sets the block aside
        const u = expoOut(span(t, back + d0, back + d0 + .7)); y = gy + 80 * (1 - u); a = u; dim = .2;
        cold = .22;
        if (inBlk(i)) {
          const cd = Math.hypot(c - 7.5, r - 2.5) * .05;
          gold = sineIO(span(t, k.people + cd, k.people + cd + .5)); cold = .22 * (1 - gold); dim = 0;
          glyph = 'person'; ga = gold;
          const fold = quartIO(span(t, k.list, k.list + 1.0));   // H.16: each row of the block becomes one line of the list
          if (fold > 0) {
            const row = r - BLK.r0, j = c - BLK.c0, segW = (LX[1] - LX[0]) / 6;
            const tx = LX[0] + segW * (j + .5), ty = lineY(row + 1);
            x = lerp(gx, tx, fold); y = lerp(gy, ty, fold);
            const hgt = lerp(s, 4, fold), wid = lerp(s, segW + 1, fold);
            ctx.save(); ctx.globalAlpha *= 1 - span(t, k.list + .9, k.list + 1.5);
            ctx.fillStyle = mixHex(GOLD.body, GOLD.line, fold); ctx.beginPath(); ctx.roundRect(x - wid / 2, y - hgt / 2, wid, hgt, Math.min(hgt / 2, s * .16)); ctx.fill();
            if (fold < .6) F.glyph(ctx, 'person', x, y, s * .56 * (1 - fold / .6), GOLD.deep, ga * (1 - fold / .6));
            ctx.restore();
            continue;
          }
        } else {
          dim = .2 + .5 * span(t, k.people, k.people + .6);
          const dd = Math.abs(c - 7.5) * .02, out = expoIn(span(t, k.list - .15 + dd, k.list + .45 + dd)); y += 60 * out; a *= 1 - out;
        }
      }
      if (a <= 0 || size <= .5) continue;
      F.tile(ctx, t, x, y, size, { a, dim, cold, gold, flash, glyph, ga, lift, v: VAR[i] });
    }
    // the ripple ring itself (thin cyan, fading as it widens)
    if (t > k.says && t < k.says + 2.2) {
      ctx.save(); ctx.strokeStyle = rgba(MACH.core, .5 * (1 - span(t, k.says, k.says + 2.2))); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(RIP0[0], RIP0[1], Math.max(1, rr), 0, TAU); ctx.stroke(); ctx.restore();
    }
  }

  // ------------------------------------------------------------------ your tile → your window (H.07–H.10), your tile again (H.18–H.21)
  function winBox(t) {
    const [gx, gy] = FLD.pos(YOU_I);
    const m1 = quartIO(span(t, k.whatever - .05, k.whatever + .8)), m2 = quartIO(span(t, k.means - .15, k.means + .95));
    const cx1 = WIN.x + WIN.w / 2, cy1 = WIN.y + WIN.h / 2;
    const cx = lerp(lerp(gx, 900, m1), cx1, m2), cy = lerp(lerp(gy, 440, m1), cy1, m2);
    const w = lerp(lerp(64, 150, m1), WIN.w, m2), h = lerp(lerp(64, 150, m1), WIN.h, m2);
    const push = 1 + .05 * span(t, k.words, k.shocked);   // a slow push while the words are on the glass
    return { x: cx - w * push / 2, y: cy - h * push / 2, w: w * push, h: h * push, open: m2, lift: m1 };
  }
  function drawWindow(ctx, t) {
    if (t < k.whatever || t > k.shocked + 1) return;
    const b = winBox(t), out = expoIn(span(t, k.shocked - .2, k.shocked + .5));
    ctx.save(); ctx.translate(0, 260 * out); ctx.globalAlpha *= 1 - out;
    if (b.open <= 0) F.tile(ctx, t, b.x + b.w / 2, b.y + b.h / 2, b.w, { lift: b.lift, glyph: 'screen', ga: 1 - b.lift });
    else F.yourWindow(ctx, t, b, { u: b.open, look: span(t, k.see, k.see + .8), glass: span(t, k.words, k.words + .7) });
    ctx.restore();
  }
  function yourTile(t) {   // H.18: your tile comes back up from where the window sank; docks on line 2 (on it), slides off (left off)
    const dock = [LX[0] + 46, lineY(2) - 40], offP = [LIST.x + LIST.w + 90, lineY(2) - 40], from = [900, 1180];
    const u1 = quartIO(span(t, k.your - .3, k.on + .15)), u2 = quartIO(span(t, k.off - .25, k.off + .55));
    let x = lerp(from[0], dock[0], u1) - 220 * Math.sin(Math.PI * u1) * .5, y = lerp(from[1], dock[1], u1);
    x = lerp(x, offP[0], u2); y = y - 30 * Math.sin(Math.PI * u2);
    const out = expoIn(span(t, k.ft + .1, k.ft + .7));
    return { x, y: y + 300 * out, a: 1 - out, on: span(t, k.on, k.on + .3) * (1 - u2), off: u2 };
  }

  // ------------------------------------------------------------------ his voice and the silence (H.10–H.12)
  function lanes(ctx, t) {
    if (t < k.insane + .3 || t > k.aside) return;
    const ul = quartIO(span(t, k.shocked - .25, k.shocked + .75));
    // the underline under "insane" (on the glass) widens into lane 1 and lifts to LANE1
    const iw = winBox(Math.min(t, k.shocked - .25)), ux0 = iw.x + iw.w * .5 + 40, ux1 = ux0 + 250, uy = iw.y + iw.h * .5 + 92;
    const und = span(t, k.insane + .35, k.insane + .9);
    const x0 = lerp(ux0, LX0, ul), x1 = lerp(ux1, LX1, ul), y = lerp(uy, LANE1, ul);
    const back = expoIn(span(t, k.stop - .1, k.stop + .6));   // H.12: lane 1 draws back to the left
    const pts = [];
    for (let x = x0; x <= x1 + .1; x += 6) {
      let dy = 0;
      DATES_X.forEach((dx, i) => { const ti = k.shocked + .55 + i * .85; if (t < ti) return; const xc = dx + (t - ti) * 620, A = 26 * Math.exp(-(t - ti) * .55), e = Math.exp(-(((x - xc) / 70) ** 2)); dy += A * e * Math.sin((x - xc) / 22 * Math.PI); });
      pts.push([x, y + dy * ul]);
    }
    F.goldSpan(ctx, pts, 0, und * (1 - back), { w: 3, spark: false });
    DATES_X.forEach((dx, i) => {   // the four dates under lane 1
      const ti = k.shocked + .55 + i * .85, u = span(t, ti - .1, ti + .5), out = span(t, k.stop - .1 + i * .05, k.stop + .3 + i * .05);
      if (u <= 0) return;
      halo(ctx, dx, LANE1, 30, .6 * bumpT(t, ti, .6), GOLD.halo, GOLD.core);
      F.label(ctx, SRC.dates[i][0], dx, LANE1 + 58, u, { size: 32, col: CREAM, align: 'center', out });
      F.label(ctx, SRC.dates[i][1], dx, LANE1 + 92, span(u, .2, 1), { size: 24, align: 'center', out });
    });
    F.label(ctx, 'HIS WARNING', LX0, LANE1 - 34, span(t, k.shocked + .5, k.shocked + 1.1), { size: 26, col: GOLD.text, out: span(t, k.stop - .1, k.stop + .3) });
    // lane 2: the answer (cream, flat); H.12 folds it into the switch track
    const u2 = sineIO(span(t, k.shocked + .7, k.shocked + 1.8)), fold = quartIO(span(t, k.stop - .05, k.stop + .75));
    if (u2 > 0 && fold < 1) {
      const ax0 = lerp(LX0, SW[0] - SWW / 2, fold), ax1 = lerp(LX0 + (LX1 - LX0) * u2, SW[0] + SWW / 2, fold), ay = lerp(LANE2, SW[1], fold), hh = lerp(3, SWW * .42, fold);
      ctx.save(); ctx.fillStyle = rgba(CREAM, lerp(.75, .5, fold)); ctx.beginPath(); ctx.roundRect(ax0, ay - hh / 2, ax1 - ax0, hh, hh / 2); ctx.fill(); ctx.restore();
      F.label(ctx, 'THE ANSWER', LX0, LANE2 - 26, span(t, k.shocked + 1, k.shocked + 1.6), { size: 26, out: span(t, k.stop - .1, k.stop + .3) });
      if (t > k.deafW - .2 && fold <= 0) {   // H.11: a listening dot runs along the answer and finds nothing
        const q = sineIO(span(t, k.deafW - .2, k.deafW + 2.2)), dx = lerp(LX0, LX1, q);
        halo(ctx, dx, LANE2, 40, .5, P.halo2, CREAM); ctx.fillStyle = CREAM; ctx.beginPath(); ctx.arc(dx, LANE2, 6, 0, TAU); ctx.fill();
      }
    }
  }
  // the switch (H.12) and its knob that becomes the gold thread (H.13)
  function switchAndThread(ctx, t) {
    if (t < k.stop + .5 || t > k.list + 1.6) return null;
    const ring = ringPts(bx0, by0, bx1, by1, 18);
    const sink = expoIn(span(t, k.aside - .4, k.aside + .3));
    let on = expoOut(span(t, k.stop + .55, k.stop + 1.25));
    const wob = span(t, k.stopW + .1, k.stopW + 1.3); if (wob > 0 && wob < 1) on = 1 - .38 * Math.sin(Math.PI * clamp(wob * 2)) * (wob < .5 ? 1 : 0) + (wob >= .5 ? .07 * Math.exp(-(wob - .5) * 8) * Math.sin((wob - .5) * 30) : 0);
    if (sink < 1) {
      ctx.save(); ctx.translate(0, 120 * sink); ctx.globalAlpha *= 1 - sink;
      const lv = F.lever(ctx, t, SW[0], SW[1], SWW, clamp(on, 0, 1.1), { a: span(t, k.stop + .5, k.stop + .75) });
      ctx.restore();
    }
    // the knob detaches and rolls to the ring's start, shrinking into the thread's spark (H.13)
    const kn0 = [SW[0] + SWW / 2 - SWW * .21, SW[1]], kr = quartIO(span(t, k.aside - .35, k.aside + .35));
    const head = ring[0], drawU = sineIO(span(t, k.aside + .3, k.asideW + .45));
    if (t > k.aside - .35 && drawU <= 0) {
      const x = lerp(kn0[0], head[0], kr), y = lerp(kn0[1], head[1], kr) - 90 * Math.sin(Math.PI * kr), r = lerp(SWW * .42 * .4, 9, kr);
      halo(ctx, x, y, r * 3, .6, GOLD.halo, GOLD.core); ctx.fillStyle = mixHex(AMBER.core, GOLD.core, kr); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    }
    if (drawU > 0) {
      const fold = quartIO(span(t, k.list, k.list + 1.0));
      const rp = fold > 0 ? ringPts(lerp(bx0, LIST.x, fold), lerp(by0, LIST.y, fold), lerp(bx1, LIST.x + LIST.w, fold), lerp(by1, LIST.y + LIST.h, fold), lerp(18, 2, fold)) : ring;
      F.goldSpan(ctx, rp, 0, drawU, { w: lerp(4, 1.6, fold), a: 1 - .6 * span(t, k.list + .8, k.list + 1.5) });
      PUSH.forEach((p) => { const f = bumpT(t, p.tc + .06, .45); if (f > 0) halo(ctx, p.side < 0 ? bx0 : bx1, FLD.pos(p.r * 16)[1], 70, .7 * f, GOLD.halo, GOLD.core); });
    }
    return null;
  }
  function machinesRow(ctx, t) {   // H.12: the machines keep running (a slow cyan conveyor), they leave when the field returns
    const u = span(t, k.stop + .3, k.stop + 1.2), out = expoIn(span(t, k.aside - .2, k.aside + .5)); if (u <= 0 || out >= 1) return;
    ctx.save(); ctx.globalAlpha *= u * (1 - out); ctx.translate(0, 80 * out);
    for (let i = 0; i < 36; i++) { const x = ((i * 58 + (t - k.stop) * 70) % (W + 240)) - 120, e = clamp(Math.min(x + 60, W + 60 - x) / 200);
      F.tile(ctx, t, x, 790, 40, { cold: 1, a: e }); }
    ctx.restore();
  }
  function pushers(ctx, t) {   // H.15: cyan tiles slide at the ring and bounce off it (contact → recoil; the ring flashes 60 ms later)
    if (t < k.even || t > k.list + .8) return;
    const out = expoIn(span(t, k.list - .1, k.list + .5));
    PUSH.forEach((p) => {
      const y = FLD.pos(p.r * 16)[1], xc = p.side < 0 ? bx0 - 32 - 4 : bx1 + 32 + 4, D = 520;
      let x;
      if (t < p.tc) { const u = span(t, p.tc - .7, p.tc); x = xc + p.side * D * (1 - u) * (1 - u); if (u <= 0) return; }
      else { const dt = t - p.tc; x = xc + p.side * (46 * (1 - Math.exp(-9 * dt)) + 18 * Math.exp(-5 * dt) * Math.sin(18 * dt)); }
      F.tile(ctx, t, x, y + 60 * out, 64, { cold: 1, a: span(t, p.tc - .7, p.tc - .45) * (1 - out), lift: .6 });
    });
  }

  // ------------------------------------------------------------------ the list (H.16–H.21)
  function drawList(ctx, t) {
    const u = sineIO(span(t, k.list + .75, k.list + 1.45)), fade = 1 - span(t, k.ft + .15, k.ft + .9); if (u <= 0 || fade <= 0) return;
    const yt = yourTile(t);
    F.list(ctx, t, LIST.x, LIST.y, LIST.w, LIST.h, { n: LIST.n, u, a: fade, head: span(t, k.human - .15, k.reserved + .7), lit: t > k.notW - .2 ? 3 : undefined, glow: 1 });
    if (yt.on > 0) F.goldSpan(ctx, [[LX[0], lineY(2)], [LX[1], lineY(2)]], 0, yt.on, { w: 4, spark: yt.on < 1 });
  }

  // ------------------------------------------------------------------ the words
  function words(ctx, t) {
    // H.01 the title (thumbnail A)
    F.title(ctx, t, span(t, .35, 1.6), { out: span(t, k.three - .7, k.three + .1), y: 440 });
    // H.02 the 2023 quote, the axis
    if (t > k.three && t < k.noJob + 1) {
      const out = k.noJob - .3, dimQ = 1 - .55 * span(t, k.now, k.now + .6);
      F.say(ctx, t, [['“The', k.risks - .35], ['risks', k.risks], ['of', k.risks + .08], ['AI', k.risks + .14], ['are', k.risks + .2]], P23[0] - 20, 300, { serif: true, size: 66, out, a: dimQ });
      F.say(ctx, t, [['real', k.real], ['but', k.but], ['manageable”', k.manage]], P23[0] - 20, 378, { serif: true, size: 66, gold: [2], out, a: dimQ });
      F.label(ctx, SRC.manageableSrc, P23[0] - 20, 430, span(t, k.manage + .3, k.manage + .9), { size: 22, out: span(t, out, out + .4), a: dimQ });
      F.goldSpan(ctx, [P23, P26], 0, sineIO(span(t, k.three + .55, k.three + 1.7)) * (1 - span(t, k.noJob - .1, k.noJob + .3)), { w: 2.4 });
      F.label(ctx, '2023', P23[0], P23[1] + 62, span(t, k.three + .7, k.three + 1.2), { size: 30, col: CREAM, align: 'center', out: span(t, out, out + .4) });
      F.label(ctx, '2026', P26[0], P26[1] + 62, span(t, k.three + 1.5, k.three + 2), { size: 30, col: CREAM, align: 'center', out: span(t, out, out + .4) });
      // H.03
      F.say(ctx, t, [['FAR', k.far], ['FEWER', k.fewer], ['JOBS', k.jobs]], W / 2, 790, { size: 150, align: 'center', out: k.noJob - .25 });
      F.label(ctx, SRC.fewerFoot, W / 2, 846, span(t, k.jobs + .7, k.jobs + 1.3), { size: 22, align: 'center', out: span(t, k.noJob - .2, k.noJob + .2) });
    }
    // H.04–H.06 the field's words
    F.say(ctx, t, [['NO', k.noJob], ['JOB', k.job], ['UNTOUCHED', k.untouched]], FLD.x0 - 32, 200, { size: 58, out: k.screen - .1 });
    F.say(ctx, t, [['AT', k.screenW - .2], ['A', k.screenW - .1], ['SCREEN', k.screenW]], FLD.x0 - 32, 790, { size: 50, out: k.whatever });
    F.say(ctx, t, [['BY', k.handW - .15], ['HAND', k.handW]], FLD.x0 - 32 + FLD.w, 790, { size: 50, align: 'right', out: k.whatever + .05 });
    // H.07 / H.08 under your window
    F.say(ctx, t, [['YOURS', k.yours], ['TOO', k.too]], W / 2 - 60, 790, { size: 64, align: 'center', out: k.see - .2 });
    F.say(ctx, t, [['WHAT', k.see + .3], ['DID', k.see + .5], ['HE', k.seeW - .2], ['SEE?', k.seeW]], W / 2 - 60, 790, { size: 64, align: 'center', out: k.words - .1 });
    // H.09 the quote on the glass (follows the window's push)
    if (t > k.words - .3 && t < k.shocked + .8) {
      const b = winBox(t), cx = b.x + b.w * .5 + 40, cy = b.y + b.h * .5;
      const out = k.shocked - .2;
      F.say(ctx, t, [['“This', k.this1], ['is', k.this1 + .3], ['crazy.', k.crazy]], cx, cy - 10, { serif: true, size: 80, align: 'center', out });
      F.say(ctx, t, [['This', k.this2], ['is', k.this2 + .3], ['insane.”', k.insane]], cx, cy + 74, { serif: true, size: 80, align: 'center', gold: [2], out });
      F.label(ctx, SRC.crazySrc, W / 2 - 60, 750, span(t, k.insane + .2, k.insane + .8), { size: 22, align: 'center', out: span(t, out, out + .4) });
    }
    // H.10 / H.11
    F.say(ctx, t, [['ONE', k.one], ['OF', k.one + .2], ['THE', k.one + .4], ['FIRST', k.first]], W / 2, 290, { size: 58, align: 'center', out: k.deaf - .1 });
    F.say(ctx, t, [['“I’m', k.deafW - .5], ['just', k.deafW - .3], ['deafened', k.deafW], ['by', k.deafW + .3], ['the', k.deafW + .5], ['silence.”', k.silence]], W / 2, 810, { serif: true, size: 60, align: 'center', out: k.stop - .1 });
    // H.12–H.15 kickers (top left, over the field)
    F.say(ctx, t, [['NOT', k.machines - .1], ['A', k.machines], ['HALT', k.machines + .15]], W / 2, 330, { size: 58, align: 'center', out: k.aside - .3 });
    F.say(ctx, t, [['SET', k.set], ['ASIDE', k.asideW]], FLD.x0 - 32, 200, { size: 58, gold: [1], out: k.people - .15 });
    F.say(ctx, t, [['FOR', k.peopleW - .2], ['PEOPLE', k.peopleW], ['ONLY', k.only]], FLD.x0 - 32, 200, { size: 58, out: k.even - .1 });
    F.say(ctx, t, [['EVEN', k.even], ['WHERE', k.even + .3], ['A', k.machineW - .1], ['MACHINE', k.machineW], ['COULD', k.could]], FLD.x0 - 32, 200, { size: 58, out: k.list - .2 });
    // H.18–H.20 beside the list
    F.say(ctx, t, [['NOT', k.written - .3], ['WRITTEN', k.written], ['YET', k.yet]], LIST.x - 60, 520, { size: 54, align: 'right', out: k.ft + .05 });
    // H.21 over the dark plate (until the footage starts): where and when
    k.fin = k.fin ?? G('Financial Times', k.ft);
    F.say(ctx, t, [['FINANCIAL', k.fin], ['TIMES', k.fin + .3]], W / 2, 560, { size: 96, align: 'center', out: C1.start - .45 });
    F.say(ctx, t, [['FT', k.fin + .9], ['LIVE', k.fin + 1.0], ['·', k.fin + 1.1], ['NOV', k.fin + 1.2], ['4,', k.fin + 1.3], ['2026', k.fin + 1.4]], W / 2, 640, { size: 34, weight: 600, spacing: .1, col: CREAM2, align: 'center', out: C1.start - .4, glow: false });
  }

  // ------------------------------------------------------------------ the clip (H.21–H.22) and the seam
  function plate(ctx, t) {
    if (t < k.ft + .15) return;
    const grow = quartIO(span(t, k.ft + .2, k.ft + 1.7)), shrink = quartIO(span(t, C1.end - .55, seam - .02));
    const from = shrink > 0 ? S.MACH_FRAME : { x: LIST.x, y: LIST.y, w: LIST.w, h: LIST.h };
    const morph = shrink > 0 ? 1 - shrink : grow;
    const dark = Math.max(1 - span(t, C1.start - .35, C1.start + .05), span(t, C1.end - .4, seam - .2));
    F.clipPlate(ctx, t, T, 'C1', { from, morph, dark: dark * (t < C1.start ? lerp(1, .75, span(t, k.ft + .2, k.ft + 1.6)) : 1), label: span(t, k.ft + .9, k.ft + 1.5) * (1 - span(t, C1.end - .7, C1.end - .2)) });
    if (shrink > 0) S.machinePic(ctx, t, S.MACH_FRAME, { a: span(t, seam - .3, seam - .02) });
  }

  // ------------------------------------------------------------------ the frame
  const draw = (ctx, t) => {
    if (t < k.three + .9) S.sky(ctx, t, { hand: false, ground: 1 - span(t, k.three - .3, k.three + .6), drop: 260 * expoIn(span(t, k.three - .45, k.three + .6)), you: { look: span(t, k.changed + .4, k.changed + 1.6) } });
    else F.stage(ctx, t);
    drawField(ctx, t);
    machinesRow(ctx, t);
    lanes(ctx, t);
    drawWindow(ctx, t);
    switchAndThread(ctx, t);
    pushers(ctx, t);
    plate(ctx, t);
    drawList(ctx, t);
    if (t > k.your - .4 && t < k.ft + .8) {
      const y = yourTile(t);
      F.tile(ctx, t, y.x, y.y, 64, { glyph: 'you', ga: 1, a: y.a, lift: .7, dim: .35 * y.off, cold: .25 * y.off });
      F.label(ctx, 'YOUR JOB', y.x, y.y - 50, span(t, k.your, k.your + .6) * y.a, { size: 22, col: CREAM, align: 'center' });
    }
    drawHand(ctx, t);
    words(ctx, t);
  };
  return [
    { t: 0, draw, print: F.PRINT41 },
    { t: seam, draw: (ctx, t) => S.plateMachine(ctx, t, T), print: F.PRINT41 },
  ];
};
