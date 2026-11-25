// Film 41 · c05 · the numbers (B2) · 'Then the numbers' → 'That leaves the last stop' (docs/shots.md 4.01–4.10, M.01)
// One locked-frame motion-design sequence; every graphic grows out of the one before (carrier in brackets):
//   4.01 out of plateNumbers: the gold baseline slides along and wraps the chart's corner into a gold frame (the thread): YOUNGEST
//        WORKERS · MOST EXPOSED JOBS · 4.02 the framed corner shrinks into ONE tile, the whole U.S. job market grows out round it
//        (centre-out), YALE BUDGET LAB · 4.03 the tile opens into the Yale paper (the title lights word by word as spoken, NOT YET
//        underlined gold) · 4.04 the underline drops to TODAY: finding (solid, today's numbers) vs forecast (dashed, his hand rides
//        it) · 4.05–4.08 the axis straightens into the top rule of THE VERDICT CARD, three rows on their words · 4.09 the hand
//        parked at the card grows into the dim hand of light behind it and turns its thumb once more · 4.10 the card's rule shrinks
//        to a point and a dashed forecast cone opens (no date anywhere) · M.01 the cone narrows into YOUR WINDOW; the building of
//        other lit windows grows out of it; a gold thread ties your window to your dot on the timeline; SUBSCRIBE rises, its ring
//        closes on "subscribe" · → your window flies into your dot on the timeline (c06 grows the timeline from there).
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f41_kit.mjs';
import * as S from '../lib/f41_world.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, lin } = E;
const { GOLD, CREAM, CREAM2, MACH, AMBER, PAPER, SOURCES: SRC } = F;
const TAU = Math.PI * 2;
const ANG = 2.55;
const fistToWrist = (x, y, L) => [x - Math.cos(ANG) * .5 * L, y - Math.sin(ANG) * .5 * L];
const lerpL = (a, b, u) => Math.exp(lerp(Math.log(a), Math.log(b), u));
const bumpT = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));
const lerpP = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
const lerpR = (a, b, u) => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), w: lerp(a.w, b.w, u), h: lerp(a.h, b.h, u) });
const rectPts = (r) => [[r.x, r.y], [r.x + r.w, r.y], [r.x + r.w, r.y + r.h], [r.x, r.y + r.h], [r.x, r.y]];

// a sheet of paper (the quote-card look of the kit, drawn at any rect so it can morph out of a tile)
function paper(ctx, r, a = 1, rot = 0) {
  if (a <= 0 || r.w < 1 || r.h < 1) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(r.x + r.w / 2, r.y + r.h / 2); ctx.rotate(rot); ctx.translate(-r.w / 2, -r.h / 2);
  const rr = Math.min(6, r.w / 2, r.h / 2);
  ctx.fillStyle = rgba(P.night0, .35); ctx.beginPath(); ctx.roundRect(6, 10, r.w, r.h, rr); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, 0, r.w, r.h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(0, 0, r.w, r.h, rr); ctx.fill();
  ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();
}
// words on paper that light as they are spoken: [[text, tSpoken|null, gold]] → faint ink, then ink (gold-deep if gold)
function inkWords(ctx, t, words, x, y, size, u, o = {}) {
  let xx = x; const xs = [];
  for (const [w, ts, g] of words) {
    const lit = ts == null ? 1 : clamp((t - ts + .05) / .25), col = mixHex(mixHex(PAPER.faint, PAPER.ink, .3 + .7 * lit), GOLD.deep, g ? .9 * lit : 0);
    F.maskLine(ctx, [[w, 0]], xx, y, size, u, { serif: true, col, glow: false });
    xs.push([xx, xx + F.measure(w, size, true)]); xx += F.measure(w, size, true) + size * .26;
  }
  return xs;
}
function dashed(ctx, pts, u, o = {}) {   // a dashed gold line drawn to u (forecasts: never solid)
  if (u <= 0) return null;
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = len[len.length - 1] * clamp(u); let head = pts[0];
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.strokeStyle = o.col ?? GOLD.line; ctx.lineWidth = o.w ?? 3; ctx.lineCap = 'round'; ctx.setLineDash(o.dash ?? [14, 12]); ctx.lineDashOffset = o.off ?? 0;
  ctx.beginPath(); ctx.moveTo(...pts[0]);
  for (let i = 1; i < pts.length; i++) { if (len[i] <= L) { ctx.lineTo(...pts[i]); head = pts[i]; } else { const f = (L - len[i - 1]) / (len[i] - len[i - 1]); head = lerpP(pts[i - 1], pts[i], f); ctx.lineTo(...head); break; } }
  ctx.stroke(); ctx.restore();
  return head;
}

// a spaced caps label that rises behind its own mask; its width counts the letter spacing (F.label's mask clips the last letters)
function lab(ctx, s, x, y, u, o = {}) {
  u = clamp(u); const out = clamp(o.out ?? 0); if (u <= 0 || out >= 1) return null;
  const size = o.size ?? 24, sp = o.spacing ?? .12;
  ctx.save(); ctx.font = `${o.weight ?? 600} ${size}px Inter`; ctx.letterSpacing = `${sp}em`; const w = ctx.measureText(s).width; ctx.restore();
  const x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.beginPath(); ctx.rect(x0 - size * .3, y - size * 1.3, w + size * .6, size * 1.64); ctx.clip();
  ctx.font = `${o.weight ?? 600} ${size}px Inter`; ctx.letterSpacing = `${sp}em`; ctx.textBaseline = 'alphabetic';
  const g = clamp(o.gold ?? 0); if (g > 0) { ctx.shadowColor = rgba(GOLD.halo, .6 * g); ctx.shadowBlur = size * .3; }
  ctx.fillStyle = mixHex(o.col ?? CREAM2, GOLD.body, g); ctx.fillText(s, x0, y + (1 - expoOut(u)) * size * 1.1 + expoIn(out) * size * 1.1);
  ctx.restore();
  return { x0, x1: x0 + w, w };
}

export default (T, R) => {
  const G = (p, after = R.a - 1) => T.G(p, 0, after);
  const k = {};
  k.T0 = R.a;                                                                   // 'Then the numbers'
  k.nineteen = G('nineteen percent'); k.gap = G('gap', k.nineteen); k.youngest = G('youngest workers'); k.workers = G('workers', k.youngest);
  k.most = G('most exposed', k.youngest); k.exposed = G('exposed', k.most); k.jobs = G('jobs', k.exposed);
  k.across = G('Across the whole American'); k.whole = G('whole', k.across); k.american = G('American', k.across); k.job = G('job market', k.across); k.market = G('market', k.job);
  k.yale = G('Yale', k.across); k.else = G('something else', k.yale);
  k.spring = G('As of this spring'); k.verdict = G('their verdict', k.spring); k.where = G('where the job market', k.spring);
  k.wJob = G('job', k.where); k.wMarket = G('market', k.wJob); k.weak = G('weakening', k.where);
  k.ai = G('artificial intelligence is probably', k.where); k.is = G('is probably', k.ai); k.prob = G('probably', k.ai); k.not = G('not the reason', k.ai);
  k.the = G('the reason', k.not); k.reason = G('reason', k.not); k.notyet = G('Not yet', k.reason); k.yet = G('yet', k.notyet);
  k.claim = G("And Gates doesn't claim"); k.account = G('By his own account', k.claim); k.warning = G('his warning', k.account); k.forecast = G('forecast', k.warning);
  k.notF = G('Not a finding', k.forecast); k.finding = G('finding', k.notF); k.today = G("today's numbers", k.notF);
  k.evid = G('So here is what the evidence'); k.evidW = G('evidence', k.evid);
  k.dir = G('The direction'); k.dirW = G('direction', k.dir); k.plaus = G('plausible', k.dir);
  k.start = G('At the start of careers'); k.meas = G('measurable', k.start); k.already = G('already', k.start);
  k.speed = G('The speed and the size'); k.size = G('size', k.speed); k.open = G('open', k.size);
  k.man = G('A forecast from a well-informed'); k.fc2 = G('forecast', k.man); k.changed = G('changed his mind', k.man); k.public = G('public', k.changed);
  k.date = G('Not a date in your calendar'); k.dateW = G('date', k.date); k.cal = G('calendar', k.date);
  k.chan = G('This channel exists'); k.goes = G('goes well', k.chan); k.well = G('well', k.goes); k.forE = G('for everybody', k.goes); k.every = G('everybody', k.forE);
  k.wherever = G('Wherever your job sits', k.chan); k.tl = G('timeline', k.wherever); k.want = G('Want that too', k.chan); k.sub = G('subscribe', k.want);
  const T1 = R.a + S.SEAM_HALF;

  // ------------------------------------------------------------------ 4.01 the chart's corner (chart-local coords = plateNumbers)
  const NC = S.NUM_CHART, NCC = [NC.x + NC.w / 2, NC.y + NC.h / 2];
  const FR = { x: 560, y: 380, w: 420, h: 250 };                                // the corner frame (local), its bottom on the baseline y 630
  const FRC = [FR.x + FR.w / 2, FR.y + FR.h / 2];
  const BY = NC.y + NC.h, BX0 = NC.x + NC.w + 60, BX1 = W - 140;
  const THREAD = [[BX1, BY], [FR.x, BY], [FR.x, FR.y], [FR.x + FR.w, FR.y], [FR.x + FR.w, BY]];
  const tLen = (() => { let s = 0; for (let i = 1; i < THREAD.length; i++) s += Math.hypot(THREAD[i][0] - THREAD[i - 1][0], THREAD[i][1] - THREAD[i - 1][1]); return s; })();
  const uBase1 = (BX1 - BX0) / tLen, uFrame0 = (BX1 - (FR.x + FR.w)) / tLen;
  // chart camera: screen = C + s (p − pivot); starts exactly as the plate's creep (zoom 4 %/s about the chart centre), then glides on
  function chartCam(t) {
    const tc = t - (k.T0 - S.SEAM_HALF), kc = 1 + S.CREEP * Math.min(tc, 1) + S.CREEP * 1.5 * (1 - Math.exp(-Math.max(0, tc - 1) / 1.5));
    const m = quartIO(span(t, T1 + .15, k.gap + .7));
    const piv = lerpP(NCC, FRC, m), C = lerpP(NCC, [960, 470], m), s = kc * lerpL(1, 1.38, m);
    return { piv, C, s };
  }
  // a glint wakes on the plate's baseline at the seam and drifts toward the corner where the thread will rise (keeps the
  // handover alive; it is 0 at R.a, so the plate frame there is untouched, and it is gone once the thread itself moves)
  function glint(ctx, t) {
    const a = sineIO(span(t, R.a, R.a + .6)) * (1 - span(t, k.nineteen, k.nineteen + .4)); if (a <= 0) return;
    const cam = chartCam(t), u = sineIO(span(t, R.a, k.nineteen + .2));
    const p = toScr(cam, [lerp(BX1 - 40, FR.x + FR.w + 30, u), BY]), r = 46 * cam.s;
    halo(ctx, p[0], p[1], r * 2.6, .3 * a, GOLD.halo, GOLD.body);
    halo(ctx, p[0], p[1], r * .8, .8 * a, GOLD.body, CREAM);
    const q = toScr(cam, [lerp(BX1 - 40, FR.x + FR.w + 30, Math.max(0, u - .06)), BY]);
    ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = CREAM; ctx.lineWidth = 3.2 * cam.s; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); ctx.restore();
  }
  const toScr = (cam, p) => [cam.C[0] + cam.s * (p[0] - cam.piv[0]), cam.C[1] + cam.s * (p[1] - cam.piv[1])];
  const applyCam = (ctx, cam) => { ctx.translate(cam.C[0], cam.C[1]); ctx.scale(cam.s, cam.s); ctx.translate(-cam.piv[0], -cam.piv[1]); };

  // ------------------------------------------------------------------ 4.02 the whole job market (screen)
  const FC = 31, FRW = 11, FS = 34, FG = 10, FCX = 960, FCY = 500, CI = 5 * FC + 15;
  const FLD = F.field(FC, FRW, FS, FG, FCX, FCY);
  const VAR = (() => { const r = E.prng(4501); return Array.from({ length: FLD.n }, () => .45 + .55 * r()); })();
  const fieldScale = (t) => lerpL(1.32, 1, sineIO(span(t, k.across + .3, k.yale - .1)));
  const tileRect = (t) => { const s = FS * fieldScale(t); return { x: FCX - s / 2, y: FCY - s / 2, w: s, h: s }; };
  const frameMorph = (t) => quartIO(span(t, k.across - .15, k.across + .95));
  const CARD = { x: 360, y: 318, w: 1200, h: 376 };
  const yaleOut = (t) => sineIO(span(t, k.claim - .4, k.claim + .45));
  const cardOpen = (t) => quartIO(span(t, k.spring - .05, k.spring + .9));

  function chartPart(ctx, t) {
    if (t >= k.across + 1) return;
    const cam = chartCam(t), m = frameMorph(t), dim = span(t, k.gap - .4, k.gap + .6);
    // the thread: the plate's baseline slides along and wraps the corner
    const w = quartIO(span(t, k.nineteen + .1, k.gap + .9));
    ctx.save(); applyCam(ctx, cam);
    if (m <= 0) {
      ctx.save(); ctx.globalAlpha *= 1 - .7 * dim; S.gapChart(ctx, t, NC); ctx.restore();
      if (dim > 0) { ctx.save(); ctx.beginPath(); ctx.rect(FR.x, FR.y, FR.w, FR.h); ctx.clip(); ctx.globalAlpha *= .7 * dim; S.gapChart(ctx, t, NC); ctx.restore(); }
      if (w <= 0) F.goldSpan(ctx, [[BX0, BY], [BX1, BY]], 0, 1, { w: 2, spark: false, a: .8 });
      else F.goldSpan(ctx, THREAD, lerp(0, uFrame0, w), lerp(uBase1, 1, w), { w: lerp(2, 2.6, w), spark: w < 1, a: .8 + .2 * w });
    }
    ctx.restore();
    if (m > 0) {   // the framed corner shrinks into one tile (the chart shrinks with it and dims out)
      const a = toScr(cam, [FR.x, FR.y]), b = toScr(cam, [FR.x + FR.w, FR.y + FR.h]);
      const r0 = { x: a[0], y: a[1], w: b[0] - a[0], h: b[1] - a[1] }, r = lerpR(r0, tileRect(t), m);
      F.tile(ctx, t, r.x + r.w / 2, r.y + r.h / 2, Math.min(r.w, r.h), { a: span(m, .45, .95), v: 1 });
      ctx.save(); ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip(); ctx.globalAlpha *= 1 - span(m, .2, .7);
      ctx.translate(r.x, r.y); ctx.scale(r.w / FR.w, r.h / FR.h); ctx.translate(-FR.x, -FR.y); S.gapChart(ctx, t, NC); ctx.restore();
      F.goldSpan(ctx, rectPts(r), 0, 1, { w: lerp(2.6 * cam.s, 1.8, m), spark: false });
    }
  }
  function fieldPart(ctx, t) {
    if (t < k.across + .1 || t > k.claim + .8) return;
    const fs = fieldScale(t), born = k.across + .55, dim = .55 * span(t, k.spring, k.spring + .7), sink = sineIO(span(t, k.claim - .45, k.claim + .6));
    const weakT = k.weak - .1;
    for (let i = 0; i < FLD.n; i++) {
      if (i === CI) continue;
      const c = FLD.col(i), rr = FLD.row(i), d = Math.hypot(c - 15, rr - 5), u = expoOut(span(t, born + d * .03, born + d * .03 + .5)); if (u <= 0) continue;
      const [gx, gy] = FLD.pos(i), x = FCX + (gx - FCX) * fs, y = FCY + (gy - FCY) * fs + 40 * sink;
      const wv = bumpT(t, weakT + (c / FC) * .8, .9);   // "where the job market is weakening": a slow dim wave across the market
      F.tile(ctx, t, x, y, FS * fs * u, { v: VAR[i], dim: clamp(dim + .35 * wv), a: 1 - sink });
    }
    // the corner tile (gold rim = the thread) stays until the paper opens out of it
    const op = cardOpen(t);
    if (op <= 0) { const r = tileRect(t); F.tile(ctx, t, FCX, FCY, r.w, { v: 1, lift: .4 * span(t, k.yale, k.spring) }); F.goldSpan(ctx, rectPts(r), 0, 1, { w: 1.8, spark: false }); }
  }
  function yaleCard(ctx, t) {
    const op = cardOpen(t); if (op <= 0 || t > k.claim + .7) return;
    const out = yaleOut(t);
    const r = lerpR(tileRect(t), CARD, op);
    ctx.save(); ctx.translate(0, 90 * out); ctx.globalAlpha *= 1 - out;
    paper(ctx, r, 1, -.004 * op);
    const u = (dt) => F.rise(span(t, k.spring + .6 + dt, k.spring + 1.3 + dt));
    if (op > .6) {
      F.maskLine(ctx, [['THEIR VERDICT', 0]], CARD.x + 54, CARD.y + 62, 22, F.rise(span(t, k.verdict - .2, k.verdict + .5)), { serif: false, weight: 600, col: PAPER.faint, glow: false });
      const l1 = [['“AI', k.ai], ['Is', k.is], ['Probably', k.prob], ['Not', k.not, 1], ['(Yet)', k.yet, 1], ['the', k.the], ['Reason', k.reason]];
      const l2 = [['for', k.where], ['Labor', k.wJob], ['Market', k.wMarket], ['Weakening”', k.weak]];
      const xs = inkWords(ctx, t, l1, CARD.x + 54, CARD.y + 160, 66, u(0));
      inkWords(ctx, t, l2, CARD.x + 54, CARD.y + 244, 66, u(.08));
      F.maskLine(ctx, [[SRC.yaleSrc, 0]], CARD.x + 54, CARD.y + CARD.h - 36, 20, u(.25), { serif: false, weight: 600, col: PAPER.faint, glow: false });
      // NOT YET: a gold underline draws under "Not (Yet)" on "Not yet"
      const ul = sineIO(span(t, k.notyet - .05, k.yet + .35)), x0 = xs[3][0], x1 = xs[4][1];
      if (ul > 0 && t < k.claim - .1) F.goldSpan(ctx, [[x0, CARD.y + 178], [x1, CARD.y + 178]], 0, ul, { w: 3.2, spark: ul < 1 });
      ctx.restore();
      return { ul: [[x0, CARD.y + 178], [x1, CARD.y + 178]] };
    }
    ctx.restore();
    return null;
  }

  // ------------------------------------------------------------------ 4.04 forecast vs finding (the underline drops to TODAY)
  const AX_Y = 560, NOW = [960, AX_Y], FIND0 = 300;
  const FC_PTS = Array.from({ length: 25 }, (_, i) => { const q = i / 24; return [960 + q * 660, AX_Y + 150 * q * q]; });
  const DATA = (() => { const r = E.prng(4502); return Array.from({ length: 11 }, (_, i) => [FIND0 + i * 66, AX_Y - 6 + (r() - .5) * 26]); })();
  DATA[10] = [NOW[0], AX_Y];
  const ulCache = { pts: [[CARD.x + 520, CARD.y + 178], [CARD.x + 760, CARD.y + 178]] };
  const dropM = (t) => quartIO(span(t, k.claim - .1, k.claim + .85));
  const fcU = (t) => sineIO(span(t, k.warning + .1, k.forecast + .55));
  const toRule = (t) => quartIO(span(t, k.evid - .2, k.evid + .7));          // 4.05: the axis straightens into the card's top rule
  const VC = { x: 520, y: 300, w: 880, h: 420 };
  const cardShift = (t) => -130 * quartIO(span(t, k.man - .1, k.man + 1.3));
  function axisPart(ctx, t) {
    if (t < k.claim - .1 || t > k.evid + 1) return;
    const m = dropM(t), tr = toRule(t);
    if (m < 1) {   // the underline falls and shrinks into the gold TODAY point
      const dy = 90 * yaleOut(t) * (1 - m), [a, b] = ulCache.pts.map(([x, y]) => [x, y + dy]), a2 = lerpP(a, NOW, m), b2 = lerpP(b, NOW, m);
      F.goldSpan(ctx, [a2, b2], 0, 1, { w: 3.2, spark: false, a: Math.max(1 - yaleOut(t), m) });
    }
    const dotA = span(m, .7, 1) * (1 - tr);
    if (dotA > 0) { halo(ctx, NOW[0], NOW[1], 46, .7 * dotA, GOLD.halo, GOLD.core); ctx.fillStyle = rgba(GOLD.core, dotA); ctx.beginPath(); ctx.arc(NOW[0], NOW[1], 8, 0, TAU); ctx.fill(); }
    // finding: the solid line of today's numbers, drawn leftward from TODAY
    const fu = sineIO(span(t, k.claim + .3, k.account + .2)), fdim = 1 - .62 * span(t, k.finding - .1, k.finding + .5);
    const ruleY = VC.y, cx0 = VC.x + cardShift(t), cx1 = VC.x + VC.w + cardShift(t);
    if (fu > 0) {
      const pts = DATA.slice().reverse().map((p) => [lerp(p[0], lerp(cx0, cx1, (p[0] - FIND0) / (NOW[0] - FIND0) * .5), tr), lerp(p[1], ruleY, tr)]);
      const L = pts.length - 1, n = fu * L, head = Math.floor(n);
      ctx.save(); ctx.globalAlpha *= fdim * (1 - span(tr, .6, 1)); ctx.strokeStyle = CREAM; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(...pts[0]);
      for (let i = 1; i <= head; i++) ctx.lineTo(...pts[i]);
      if (head < L) ctx.lineTo(...lerpP(pts[head], pts[head + 1], n - head));
      ctx.stroke();
      for (let i = 1; i <= head; i++) { ctx.fillStyle = CREAM; ctx.beginPath(); ctx.arc(pts[i][0], pts[i][1], 5 * (1 - tr), 0, TAU); ctx.fill(); }
      ctx.restore();
      const out = span(tr, 0, .4);
      lab(ctx, 'FINDING', FIND0, AX_Y - 76, span(t, k.claim + .9, k.claim + 1.5), { size: 30, col: CREAM, a: fdim, out });
      lab(ctx, 'TODAY’S NUMBERS', FIND0, AX_Y - 44, span(t, k.claim + 1.1, k.claim + 1.7), { size: 22, a: fdim, out });
      lab(ctx, 'TODAY', NOW[0], AX_Y + 50, span(t, k.claim + .9, k.claim + 1.5), { size: 22, align: 'center', out });
    }
    // forecast: dashed, curving down into the future
    const fc = fcU(t);
    if (fc > 0) {
      const pts = FC_PTS.map((p, i) => [lerp(p[0], lerp(cx0, cx1, .5 + .5 * i / 24), tr), lerp(p[1], ruleY, tr)]);
      dashed(ctx, pts, fc, { w: 3.2, a: 1 - span(tr, .6, 1), off: -t * 10 });
      const out = span(tr, 0, .4);
      lab(ctx, 'FORECAST', 1090, AX_Y - 76, span(t, k.forecast - .1, k.forecast + .5), { size: 30, col: GOLD.text, gold: .6, out });
      lab(ctx, 'NOT IN TODAY’S NUMBERS', 1090, AX_Y - 44, span(t, k.today - .2, k.today + .5), { size: 22, col: CREAM, out });
    }
    if (tr > 0) F.goldSpan(ctx, [[lerp(FIND0, cx0, tr), lerp(AX_Y, ruleY, tr)], [lerp(FC_PTS[24][0], cx1, tr), lerp(FC_PTS[24][1], ruleY, tr)]], 0, 1, { w: 2.4, spark: false, a: span(tr, .3, 1) });
  }
  // the hand icon: grows out of the TODAY point, rides the forecast's head, parks beside the verdict card, grows into the sky (4.09)
  const PARK = [VC.x + VC.w + 78, VC.y - 34];
  function handPart(ctx, t) {
    if (t < k.warning - .1) return;
    const g = expoOut(span(t, k.warning - .05, k.warning + .6)); if (g <= 0) return;
    const fc = fcU(t), hi = Math.min(24, fc * 24), i0 = Math.floor(hi), head = i0 >= 24 ? FC_PTS[24] : lerpP(FC_PTS[i0], FC_PTS[i0 + 1], hi - i0);
    let fist = [head[0] + 10, head[1] - 46 * g], L = lerp(8, 56, g);
    const mp = quartIO(span(t, k.evid - .2, k.evid + 1.1));
    fist = lerpP(fist, PARK, mp); fist[1] -= 70 * Math.sin(Math.PI * mp);
    const mg = quartIO(span(t, k.man - .1, k.man + 1.6));
    const SKY = [1560, 500];
    fist = lerpP(fist, SKY, mg); L = lerpL(L, 300, mg);
    const ex = expoIn(span(t, k.date - .25, k.date + .9)); fist = [fist[0] + 520 * ex, fist[1] - 520 * ex];
    if (ex >= 1) return;
    let turn = 1;
    turn = 1 - sineIO(span(t, k.changed - 1.4, k.changed - .5));                 // rewinds to thumb-up while "well-informed"…
    turn = Math.max(turn, span(t, k.changed - .1, k.public + .3));               // …and turns down again on "changed his mind in public"
    if (t < k.changed - 1.4) turn = 1;
    const lum = lerp(.9, .34, mg), w = fistToWrist(fist[0], fist[1], L);
    F.hand(ctx, t, w[0], w[1], L, { turn, lum, arm: lerp(1.1, 3.79, mg), dust: .45 * mg, a: 1 });
  }
  // the verdict card (4.05–4.09)
  function verdictCard(ctx, t) {
    if (t < k.evid - .1 || t > k.date + 1) return null;
    const open = sineIO(span(t, k.evid + .35, k.evid + 1.25)) * (1 - sineIO(span(t, k.date - .4, k.date + .2)));   // unrolls down from the rule, rolls back up into it
    const dx = cardShift(t), x = VC.x + dx, y = VC.y, w = VC.w, h = VC.h * open;
    if (open <= 0) return null;
    ctx.save(); ctx.beginPath(); ctx.rect(x - 10, y - 30, w + 30, h + 40); ctx.clip();
    ctx.save();
    ctx.fillStyle = rgba(P.night0, .35); ctx.beginPath(); ctx.roundRect(x + 6, y + 10, w, VC.h, 12); ctx.fill();
    ctx.fillStyle = mixHex(P.night1, P.ind2, .55); ctx.beginPath(); ctx.roundRect(x, y, w, VC.h, 12); ctx.fill();
    ctx.strokeStyle = rgba(GOLD.line, .55); ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();
    if (t < k.date - .25) F.goldSpan(ctx, [[x, y], [x + w, y]], 0, 1, { w: 2.4, spark: false });
    lab(ctx, 'WHAT THE EVIDENCE SUPPORTS', x + 48, y + 72, span(t, k.evidW - .3, k.evidW + .4), { size: 24, col: GOLD.text });
    const rows = SRC.verdicts.map((s) => s.split(': '));
    const tk = [[k.dirW, k.plaus], [k.start, k.meas], [k.speed, k.open]];
    rows.forEach(([key, val], i) => {
      const ry = y + 120 + i * 100, du = sineIO(span(t, k.evid + .9 + i * .12, k.evid + 1.6 + i * .12));
      ctx.save(); ctx.globalAlpha *= .5; F.goldSpan(ctx, [[x + 40, ry], [x + w - 40, ry]], 0, du, { w: 1.2, spark: false }); ctx.restore();
      lab(ctx, key, x + 48, ry + 64, span(t, tk[i][0] - .1, tk[i][0] + .5), { size: 28, col: CREAM2 });
      const vu = span(t, tk[i][1] - .15, tk[i][1] + .45);
      if (i < 2) F.verdict(ctx, t, x + 470, ry + 64, val, vu, { size: 38, align: 'left' });
      else if (vu > 0) {
        const pul = .5 + .5 * Math.sin((t - tk[i][1]) * 3.2);
        halo(ctx, x + 540, ry + 50, 120, .12 * vu * (.5 + .5 * pul), P.halo2, CREAM);
        F.heavy(ctx, val, x + 470, ry + 64, 38, F.rise(vu), { weight: 700, spacing: .08, col: CREAM, a: .78 + .22 * pul });
      }
    });
    ctx.restore();
    return { x, y, w };
  }
  // 4.10 the forecast cone (no date anywhere) → M.01 it narrows into your window
  const APEX = [420, 520], TE = [1560, 290], BE = [1560, 750], WIN = { x: 760, y: 280, w: 400, h: 300 };
  const coneOpen = (t) => sineIO(span(t, k.date + .4, k.dateW + 1.1));
  const coneWin = (t) => quartIO(span(t, k.cal + .2, k.chan - .05));
  function quadPath(ctx, pts, r) {
    const n = pts.length; ctx.beginPath();
    const mid = (i) => lerpP(pts[i], pts[(i + 1) % n], .5);
    ctx.moveTo(...mid(n - 1));
    for (let i = 0; i < n; i++) ctx.arcTo(pts[i][0], pts[i][1], mid(i)[0], mid(i)[1], r);
    ctx.closePath();
  }
  function conePart(ctx, t) {
    if (t < k.date - .3) return;
    const sh = quartIO(span(t, k.date + .05, k.date + .45)), co = coneOpen(t), q = coneWin(t);
    if (t > k.chan + .2) return;
    if (co <= 0) {   // the card's top rule shrinks to the apex
      const x0 = VC.x + cardShift(t), x1 = x0 + VC.w;
      F.goldSpan(ctx, [lerpP([x0, VC.y], APEX, sh), lerpP([x1, VC.y], APEX, sh)], 0, 1, { w: 2.4, spark: false });
      return;
    }
    const te = lerpP(APEX, TE, co), be = lerpP(APEX, BE, co);
    const pts = [lerpP(APEX, [WIN.x, WIN.y], q), lerpP(te, [WIN.x + WIN.w, WIN.y], q), lerpP(be, [WIN.x + WIN.w, WIN.y + WIN.h], q), lerpP(APEX, [WIN.x, WIN.y + WIN.h], q)];
    const r = 48 * q;
    // fill: the cone's soft gold light → the lit amber of a window
    ctx.save();
    quadPath(ctx, pts, r);
    ctx.fillStyle = lin(ctx, APEX[0], 0, TE[0], 0, [[0, rgba(GOLD.body, .2 * (1 - q))], [1, rgba(GOLD.mid, .02 * (1 - q))]]); ctx.fill();
    if (q > 0) { ctx.globalAlpha = q; ctx.fillStyle = lin(ctx, 0, WIN.y, 0, WIN.y + WIN.h, [[0, AMBER.hot], [1, AMBER.shade]]); ctx.fill(); ctx.globalAlpha = 1; }
    // inside the cone: blank ticks where a calendar would put dates (none is pinned)
    if (q < 1) {
      ctx.globalAlpha = (1 - q) * co;
      for (let i = 1; i < 12; i++) { const x = APEX[0] + (TE[0] - APEX[0]) * i / 12 * co, hh = 10 + 4 * (i % 3 === 0); ctx.strokeStyle = rgba(CREAM2, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, APEX[1] - hh); ctx.lineTo(x, APEX[1] + hh); ctx.stroke(); }
      ctx.strokeStyle = rgba(CREAM2, .35); ctx.beginPath(); ctx.moveTo(...APEX); ctx.lineTo(APEX[0] + (TE[0] - APEX[0]) * co, APEX[1]); ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    // edges: dashed gold (a forecast) → the window's cream rim
    if (q < 1) { dashed(ctx, [pts[0], pts[1]], 1, { w: 3, a: 1 - q, off: -t * 12 }); dashed(ctx, [pts[3], pts[2]], 1, { w: 3, a: 1 - q, off: -t * 12 }); }
    ctx.save(); quadPath(ctx, pts, r); ctx.strokeStyle = rgba(CREAM, .35 * q); ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
    halo(ctx, APEX[0], APEX[1], 50, .6 * (1 - q) * co, GOLD.halo, GOLD.core);
  }

  // ------------------------------------------------------------------ M.01 your window, the building of lit windows, SUBSCRIBE
  const WCOLS = 22, WROWS = 10, WW = 46, WH = 58, WGX = 34, WGY = 26;
  const WIN0 = (() => {
    const r = E.prng(4503), out = [], gw = WCOLS * WW + (WCOLS - 1) * WGX, x0 = (W - gw) / 2, y0 = 196;
    for (let j = 0; j < WROWS; j++) for (let i = 0; i < WCOLS; i++) {
      const x = x0 + i * (WW + WGX), y = y0 + j * (WH + WGY);
      if (x + WW > WIN.x - 40 && x < WIN.x + WIN.w + 40 && y + WH > WIN.y - 30 && y < WIN.y + WIN.h + 210) continue;   // your window + the pill
      const d = Math.hypot(x + WW / 2 - (WIN.x + WIN.w / 2), y + WH / 2 - (WIN.y + WIN.h / 2));
      if (x + WW > 1150 && y < 230) continue;   // keep the clock clear
      out.push({ x, y, d, late: r() < .62, early: r() < .42, v: .5 + .5 * r(), ph: r() * TAU, f: .2 + .4 * r() });
    }
    return out;
  })();
  const winFly = (t) => sineIO(span(t, R.b - 1.25, R.b - .12));   // lead: sine, so the window is still travelling into the seam
  function building(ctx, t) {
    if (t < k.chan - .1) return;
    const grow = (t - k.chan) * 900, sink = sineIO(span(t, R.b - 2, R.b - .45)), every = (t - k.every + .3) * 1100;
    if (sink >= 1) return;
    ctx.save(); ctx.translate(0, 200 * sink); ctx.globalAlpha *= 1 - sink;
    // the facade grows out from your window (a widening clip)
    ctx.save(); ctx.beginPath(); ctx.arc(WIN.x + WIN.w / 2, WIN.y + WIN.h / 2, Math.max(1, grow), 0, TAU); ctx.clip();
    ctx.fillStyle = lin(ctx, 0, 80, 0, H, [[0, mixHex(P.night1, P.ind1, .55)], [1, mixHex(P.night0, P.ind0, .5)]]); ctx.fillRect(60, 166, W - 120, H);
    ctx.strokeStyle = rgba(P.blue1, .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(60, 166); ctx.lineTo(W - 60, 166); ctx.stroke();
    ctx.restore();
    for (const w of WIN0) {
      const on1 = w.early ? smooth(clamp((grow - w.d) / 160)) : 0, on2 = w.late ? smooth(clamp((every - w.d) / 200)) : 0, on = Math.max(on1, on2);
      const seen = smooth(clamp((grow - w.d + 60) / 120)); if (seen <= 0) continue;
      const br = on * (.8 + .2 * Math.sin(t * w.f + w.ph)) * w.v;
      ctx.fillStyle = mixHex(mixHex(P.night1, P.ind2, .6), AMBER.body, br * .7); ctx.globalAlpha = seen * (1 - sink);
      ctx.beginPath(); ctx.roundRect(w.x, w.y, WW, WH, 4); ctx.fill();
      if (br > .3) { ctx.fillStyle = rgba(AMBER.hot, .35 * br); ctx.fillRect(w.x + 3, w.y + 3, WW - 6, WH * .45); }
      ctx.globalAlpha = 1 - sink;
    }
    ctx.restore();
  }
  function yourWin(ctx, t) {
    if (t < k.chan - .1) return;
    const f = winFly(t), dot = [F.timelinePt(1)[0], F.timelinePt(1)[1] - 20];
    const tl = F.timelineState(T, t);
    const dotX = F.timelinePt(0)[0] + lerp(0, 270, sineIO(tl.lit[1]));
    const tgt = { x: dotX - 5, y: dot[1] - 5, w: 10, h: 10 }, b = lerpR(WIN, tgt, f);
    S.seamRing(ctx, t, R.b, dotX, dot[1]);   // lead: the dot receives the window with a ripple that runs on through the seam (sc06 draws its tail)
    if (f >= 1) { halo(ctx, dotX, dot[1], 40, .6 * (1 - span(t, R.b - .2, R.b)), AMBER.body, AMBER.core); return; }
    F.yourWindow(ctx, t, b, { u: sineIO(span(t, k.chan - .05, k.chan + 1.1)) * (1 - span(f, 0, .5)), look: span(t, k.wherever, k.wherever + .8) * (1 - span(t, k.want, k.want + .8)) });
  }
  function threadToClock(ctx, t) {   // "wherever your job sits on that timeline": a gold thread from your window to your dot
    const u = sineIO(span(t, k.wherever + .2, k.tl + .3)), back = sineIO(span(t, k.want - .3, k.want + .6)); if (u <= 0 || back >= 1) return;
    const tl = F.timelineState(T, t), dot = [F.timelinePt(0)[0] + 270 * sineIO(tl.lit[1]), F.timelinePt(1)[1] - 20];
    const p0 = [WIN.x + WIN.w, WIN.y + 18], c = [p0[0] + 180, p0[1] - 40];
    const pts = Array.from({ length: 20 }, (_, i) => { const q = i / 19; return [(1 - q) ** 2 * p0[0] + 2 * q * (1 - q) * c[0] + q * q * dot[0], (1 - q) ** 2 * p0[1] + 2 * q * (1 - q) * (c[1] - 120) + q * q * (dot[1] + 12)]; });
    F.goldSpan(ctx, pts, back, u, { w: 2.2, spark: u < 1 && back <= 0 });
    if (u >= 1) halo(ctx, dot[0], dot[1], 34, .5 * bumpT(t, k.tl + .2, 1) * (1 - back), GOLD.halo, GOLD.core);
  }

  // ------------------------------------------------------------------ the words
  function words(ctx, t) {
    // 4.01
    F.say(ctx, t, [['YOUNGEST', k.youngest], ['WORKERS', k.workers]], 640, 236, { size: 56, out: k.across - .35 });
    F.say(ctx, t, [['MOST', k.most], ['EXPOSED', k.exposed], ['JOBS', k.jobs]], 640, 742, { size: 56, gold: [1], out: k.across - .3 });
    lab(ctx, SRC.gapSrc, 640, 788, span(t, k.jobs + .2, k.jobs + .8), { size: 22, out: span(t, k.across - .4, k.across) });
    // 4.02
    F.say(ctx, t, [['THE', k.whole - .1], ['WHOLE', k.whole], ['U.S.', k.american], ['JOB', k.job], ['MARKET', k.market]], 283, 150, { size: 64, gold: [1], out: k.spring - .1 });
    lab(ctx, 'YALE BUDGET LAB', 960, 846, span(t, k.yale - .1, k.yale + .5), { size: 30, col: CREAM, align: 'center', out: span(t, k.spring + .1, k.spring + .5) });
    // 4.09 / 4.10
    F.say(ctx, t, [['A', k.man], ['FORECAST', k.fc2], ['FROM', k.fc2 + .65], ['A', k.fc2 + .85], ['WELL-INFORMED', k.fc2 + .95], ['MAN', k.fc2 + 1.75]], 960 - 130, 830, { size: 50, align: 'center', gold: [1], out: k.changed - .45 });
    F.say(ctx, t, [['CHANGED', k.changed], ['HIS', k.changed + .4], ['MIND', k.changed + .56], ['IN', k.changed + .88], ['PUBLIC', k.public]], 960 - 130, 830, { size: 50, align: 'center', gold: [0], out: k.date - .3 });
    F.say(ctx, t, [['NOT', k.date], ['A', k.date + .13], ['DATE', k.dateW]], 960, 880, { size: 60, align: 'center', gold: [2], out: k.cal + .3 });
    // M.01
    F.say(ctx, t, [['GOES', k.goes], ['WELL', k.well], ['FOR', k.forE], ['EVERYBODY', k.every]], WIN.x + WIN.w / 2, WIN.y - 52, { size: 46, align: 'center', gold: [3], out: k.wherever + .2 });
  }

  // ------------------------------------------------------------------ the frame
  const draw = (ctx, t) => {
    F.stage(ctx, t);
    chartPart(ctx, t); glint(ctx, t);
    fieldPart(ctx, t);
    handPart(ctx, t);
    const yc = yaleCard(ctx, t); if (yc) ulCache.pts = yc.ul;
    axisPart(ctx, t);
    verdictCard(ctx, t);
    conePart(ctx, t);
    building(ctx, t);
    yourWin(ctx, t);
    threadToClock(ctx, t);
    const su = span(t, k.want - .15, k.want + .65) * (1 - span(t, R.b - 1.45, R.b - .85));
    if (su > 0) F.subscribe(ctx, t, 960, WIN.y + WIN.h + 118, su, { ring: span(t, k.sub - .15, k.sub + .55) });
    words(ctx, t);
    F.timeline(ctx, t, T, { lit: 1, litA: span(t, k.tl - .2, k.tl + .4) * (1 - span(t, k.want + .2, k.want + .8)) });   // lead: the pulse eases in and out
  };
  return [
    { t: R.a, draw: (ctx, t) => { S.plateNumbers(ctx, t, T); glint(ctx, t); }, print: F.PRINT41 },
    { t: T1, draw, print: F.PRINT41 },
  ];
};
