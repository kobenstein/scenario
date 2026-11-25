// c11 · B3 · THE VERDICT · "So that's where the plan stands" → 'Europe was never too small' (then the finale take of sc12).
// One continuous take, no cut: the plan board of 9.05 falls away and its disc stays as the puzzle moon over the sea (ANCHOR 3/4); the plan
// sheet slides back up over the sea for the two races; the disc rides up into the HUD; the second lane leads into the interview desk; the
// CV flips into the Draghi report, which grows into the clip plate and takes it back; the report draws the budget timeline out of its
// spine; the timeline becomes the ground line of the harvest; the sheet falls away again into thumbnail A (sc12 finale).
//
// | ID    | anchor (phrase)                     | zeigt wörtlich                                                        | kind   | carrier out                 |
// |-------|-------------------------------------|-----------------------------------------------------------------------|--------|-----------------------------|
// | 10.01 | So that's where the plan stands     | the plan sheet falls away: the disc is the moon over the sea; every piece labelled on its words: 2 HALFWAY · 2 ON PAPER · 1 OPEN | ANCHOR | the pieces |
// | 10.02 | None is finished                    | a date tag lights at each piece: FUND FOUNDED AUG 2026 …              | MIX    | the labels sink             |
// | 10.03 | Can Europe still win                | CAN EUROPE STILL WIN? on the sea; the plan sheet slides up over it; the two lanes draw out of the disc rim again: THE MOST COMPUTERS: NO (the compute dims) | EXPL | the disc → HUD |
// | 10.04 | The race to put AI to work          | a runner on lane B, the workshops light up as he passes: PUTTING AI TO WORK: YES (gold, underlined) | EXPL | lane B → the desk |
// | 10.05 | And with it, a voice of its own     | lane B runs on into the interview desk (callback H.05): A VOICE OF ITS OWN · YOUR JOB INTERVIEW, the screen gets a gold edge | MIX | the CV |
// | 10.06 | Mario Draghi, who wrote the plan    | the CV flips into the Draghi report (1.07), it lifts and grows        | MIX    | the report → the plate      |
// | 10.07 | slot:C1b                            | C1b · MARIO DRAGHI (centre crop), the plate shrinks back into the report | CLIP | the report                  |
// | 10.08 | An option. With a clock on it.      | AN OPTION.; the report draws the timeline: NOW · SPECIAL SUMMIT 26–27 NOV 2026 · AGREEMENT SOUGHT BY THE END OF 2026 · EU BUDGET 2028–2034, time runs gold from NOW | EXPL | the line |
// | 10.09 | Europe builds the machines          | the line is the ground: the machine, the kitchen window, the two letters rise one per sentence | MIX | the sheet falls (sc12) |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f69_kit.mjs';
import * as S from '../lib/f69_world.mjs';
import * as X from '../lib/f69_explain.mjs';
import * as B from './sc12.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo } = E;
const { GOLD, COOL, CREAM, CREAM2, SOURCES: SRC } = F;
const PR = F.PRINT69;
const TAU = Math.PI * 2;

// ------------------------------------------------------------------------------------------------ the 9.05 plan board (shared with sc10)
export const PLAN = { x: 960, y: 520, w: 900 };
export const PLAN_DISC = [PLAN.x - PLAN.w * .12, PLAN.y, PLAN.w * .66 * .32];
export const BALLOT = { x: PLAN.x + PLAN.w * .33, y: PLAN.y + PLAN.w * .66 * .3, w: 120 };
export const V9 = { x: 960, y: 540, s: 1 };
const memo = new WeakMap();
export function anchors11(T) {
  if (memo.has(T)) return memo.get(T);
  const a = T.G("So that's where the plan stands"), G = (p) => T.G(p, 0, a);
  const A = { a, two: G('two parts halfway'), paper: G('two on paper'), one: G('one still to be won'), none: G('None is finished'), every: G('But every one of them'),
    can: G('Can Europe still win'), race1: G('The race for the most computers'), noE: T.GE('computers no', 0, a), race2: G('The race to put AI to work'), yesE: T.GE('to work yes', 0, a),
    that: G('That one, Europe can still win'), voice: G('And with it, a voice'), say: G('A say in which AI'), draghi: G('Mario Draghi, who wrote'),
    option: G('An option'), clock: G('With a clock on it'), winter: G('This winter'), budget: G('negotiating the budget'), builds: G('Europe builds the machines'),
    savings: G('It has the savings'), minds: G('It trains the minds'), never: G('Europe was never too small'), C1b: T.clip('C1b') };
  A.push0 = a - 1.5;
  memo.set(T, A); return A;
}
// the push into the plan's disc (end of 9.05): at 'So that's where the plan stands' the disc sits exactly on B.VD (the verdict moon)
export function planView(t, T) {
  const A = anchors11(T), e = sineIO(span(t, A.push0, A.a)), s1 = B.VD.r / PLAN_DISC[2], s = Math.pow(s1, e);
  const sp0 = X.toScreen(V9, PLAN_DISC[0], PLAN_DISC[1]), sx = lerp(sp0[0], B.VD.x, e), sy = lerp(sp0[1], B.VD.y, e);
  return { x: PLAN_DISC[0] - (sx - W / 2) / s, y: PLAN_DISC[1] - (sy - H / 2) / s, s };
}
// the plan layer: the sheet ground + the board + the ballot, the whole layer shifted down by dy (screen px)
export function planLayer(ctx, t, v, dy = 0, o = {}) {
  const vv = B.shiftView(v, dy);
  B.sheetFrom(ctx, t, vv, dy, { lx: PLAN.x, ly: PLAN.y });
  X.inView(ctx, vv, () => {
    const bu = clamp(o.board ?? 1); if (bu <= 0) return;
    ctx.save(); ctx.translate(0, (1 - expoOut(bu)) * 700); B.planBoard(ctx, t, PLAN.x, PLAN.y, PLAN.w); ctx.restore();
    const bl = clamp(o.ballot ?? 1); if (bl > 0) B.ballot(ctx, t, BALLOT.x + (1 - expoOut(bl)) * 160, BALLOT.y - (1 - expoOut(bl)) * 60, BALLOT.w, { rot: -.12 + (1 - bl) * .3 });
  });
}
// the disc on the plan in screen space at view v (+ dy)
export const planDiscScreen = (v, dy = 0) => { const p = X.toScreen(v, PLAN_DISC[0], PLAN_DISC[1]); return [p[0], p[1] + dy, PLAN_DISC[2] * v.s]; };

// ------------------------------------------------------------------------------------------------ c11
export function makeDraw11(T) {
  const A = anchors11(T), C = A.C1b;
  const parts = (t) => S.momentParts(T, t);
  const VS = { x: 960, y: 560, s: 1 };   // the sheet view of the races (sheet = screen + (0, 20))
  const DL = { x: 250, y: 570, r: 100 }; // the disc at the lanes' start (sheet units)
  const DESK_X = 2700, VDESK = { x: DESK_X, y: 600, s: 1.12 }, LY = 560;
  const T_UP = [A.race1 - .9, A.race1 + .7], T_GO = [A.race1 + .2, A.race1 + 1.5], T_HUD = [A.race1 + 3.0, A.race1 + 4.4];
  const uAof = (t) => span(t, A.race1 + .9, A.race1 + 2.0), uBof = (t) => span(t, A.race1 + 1.1, A.race1 + 2.2);
  // the disc between the moon place (VD) and the lanes' start, in sheet units of VS
  const discSheet = (t) => { const go = sineIO(span(t, ...T_GO)); return { x: lerp(B.VD.x, DL.x, go), y: lerp(B.VD.y + 20, DL.y, go), r: Math.exp(lerp(Math.log(B.VD.r), Math.log(DL.r), go)), go }; };
  // the runner on lane B: in from the left edge, slows down, stops at the lane's end
  const runX = (t) => { const p = span(t, A.race2 - .3, A.voice + .4); return -90 + 1770 * (1 - Math.pow(1 - p, 1.7)); };
  const raceView = (t) => ({ x: 960 + 70 * sineIO(span(t, A.race2, A.voice)), y: 560, s: 1 });
  const viewAt = (t) => {
    let v = B.mixView(raceView(t), VDESK, sineIO(span(t, A.voice - .3, A.voice + 1.9)));
    const back = sineIO(span(t, C.start + 1.0, C.start + 2.2));   // under the full plate: back to the plain sheet (only the frame strips see it)
    if (back > 0) v = B.mixView(v, { x: 960, y: 540, s: 1 }, back);
    return v;
  };

  // ---------------------------------------------------------------- stage V: the verdict over the sea (10.01–10.03 first half)
  function verdictStage(ctx, t) {
    const cam = E.camDrift(E.cam3({ x: 20 * sineIO(span(t, A.a, A.race1)), z: 90 * sineIO(span(t, A.a, A.race1)) }), t, .4);
    S.seaWorld(ctx, cam, t, { moon: false, lit: .85, away: .2, you: { o: { look: .9 } } });
    const ps = parts(t), fall = sineIO(span(t, A.a, A.a + 1.6)), dy = fall * (H + 160), up = sineIO(span(t, ...T_UP));
    B.moonPath(ctx, t, B.VD.x, B.VD.r, B.goldOf(ps), span(t, A.a + .4, A.a + 1.6) * (1 - up));
    X.big(ctx, 'CAN EUROPE STILL WIN?', W / 2, 752, 62, span(t, A.can - .05, A.can + .7), { gold: .45 });   // on the sea; the sheet covers it
    if (fall < 1) planLayer(ctx, t, planView(t, T), dy);
    if (up > 0) B.sheetFrom(ctx, t, VS, (1 - up) * (H + 120), { lx: 960, ly: LY });
    const lab = [span(t, A.two + .1, A.two + .9), span(t, A.paper + .5, A.paper + 1.3), span(t, A.two + .5, A.two + 1.3), span(t, A.paper + .8, A.paper + 1.6), span(t, A.one + .1, A.one + .9)];
    const tags = [0, 1, 2, 3, 4].map((i) => span(t, A.every + .05 + i * .28, A.every + .85 + i * .28));
    const out = span(t, A.can - .5, A.can + .2), pulse = Math.sin(Math.PI * span(t, A.none - .1, A.none + 1.2));
    const d = discSheet(t), [cx, cy] = X.toScreen(VS, d.x, d.y);
    if (pulse > 0) halo(ctx, cx, cy, d.r * 1.9, .2 * pulse, GOLD.halo, GOLD.core);
    B.verdictDisc(ctx, t, ps, cx, cy, d.r, { lab, tags, out, stars: span(t, A.a + .5, A.a + 1.8) * (1 - up), glow: lerp(1, .8, d.go), loose: B.LOOSE(cx, cy, d.r) });
  }

  // ---------------------------------------------------------------- stage R: the two races again (10.03–10.04), the desk (10.05–10.06)
  function racesStage(ctx, t, v) {
    const hud = span(t, ...T_HUD), uA = uAof(t), uB = uBof(t), dimA = span(t, A.noE - .15, A.noE + 1.1), d = discSheet(t);
    X.inView(ctx, v, () => {
      B.leadIns(ctx, t, d.x, d.y, d.r, uA, uB, hud);
      B.lane(ctx, t, B.TR.yA, uA, { a: 1 - .45 * dimA });
      B.lane(ctx, t, B.TR.yB, uB, {});
      const deskLine = span(t, A.voice - .3, A.voice + 1.0);   // lane B runs on and becomes the desk top
      if (deskLine > 0) X.lightLine(ctx, [[B.TR.x1, B.TR.yB], [DESK_X - X.DESK.w / 2, X.DESK.y]], deskLine, { a: .62, w: 2.2 });
      B.chatBubble(ctx, t, 600, B.TR.yA - B.TR.half - 96, 200, { u: span(t, A.race1 + 1.2, A.race1 + 2.2), a: 1 - .6 * dimA, glow: 1 - .7 * dimA });
      B.computeStacks(ctx, t, span(t, A.race1 + 1.2, A.race1 + 2.5), { dim: dimA });
      const rx = runX(t);
      for (let i = 0; i < 10; i++) B.workshop(ctx, t, i, { u: span(t, A.race1 + 1.4 + i * .06, A.race1 + 2.4 + i * .06), lit: .7, ai: span(rx, B.shopX(i) - 40, B.shopX(i) + 10) });
      if (t > A.race2 - .4) {   // the runner (indigo, a gold rim): Europe in the second race
        const sp = 1 - span(t, A.voice - .7, A.voice + .4);
        E.person(ctx, rx, B.TR.yB + 12, 118, { dir: 1, light: .9, view: 'side', walk: sp > .02 ? t * 12 * (.4 + .6 * sp) : undefined, lean: .14 * sp, rim: GOLD.line, look: .2 });
      }
      if (t > A.voice - .5) {   // the desk (callback H.05): you, the other person, the AI screen, now with a gold edge (a European screen)
        X.deskScene(ctx, t, DESK_X, { you: { look: .25 + .1 * Math.sin(t * .7) }, other: { a: 1, look: .15 }, screen: { a: 1 } });
        const g = span(t, A.voice + .5, A.voice + 2.0), sw = 230, sh = sw * .66, x0 = DESK_X - sw / 2, y0 = X.DESK.y - sh;
        if (g > 0) { halo(ctx, DESK_X, y0 + sh / 2, 260, .22 * g, GOLD.halo, GOLD.core); F.goldSpan(ctx, [[DESK_X, y0], [x0 + sw, y0], [x0 + sw, y0 + sh], [x0, y0 + sh], [x0, y0], [DESK_X, y0]], 0, sineIO(g), { w: 2.2, spark: g < 1 }); }
        const docU = span(t, A.say - .2, A.say + .3), flipT = span(t, A.draghi + .05, A.draghi + .45), lift = span(t, A.draghi + .5, A.draghi + 2.2);
        if (docU > 0 && lift <= 0) {   // the CV slides to the screen (it reads it), then flips into the Draghi report
          const du = sineIO(span(t, A.say - .1, A.say + 1.0)), dx = lerp(DESK_X - X.DESK.w / 2 + 110, DESK_X - 175, du), dy = X.DESK.y - 92;
          const k = Math.abs(Math.cos(Math.PI * flipT)), scan = du >= 1 && flipT <= 0 ? ((t - A.say - 1.0) % 2.1) / 1.6 : -1;
          ctx.save(); ctx.translate(dx, dy); ctx.scale(Math.max(.02, k), 1);
          if (flipT < .5) X.doc(ctx, t, 0, 0, 118, { kind: 'cv', u: docU, scan }); else B.report(ctx, t, 0, 0, 118);
          ctx.restore();
        }
      }
    });
  }
  // the report (screen space): from the desk to the centre, flips into the dark card the plate grows from, and back; then the timeline
  const RPT = { x: 960, y: 560, w: 330 };
  const reportAt = (t) => {
    const lift = sineIO(span(t, A.draghi + .5, A.draghi + 2.2)), p0 = X.toScreen(VDESK, DESK_X - 175, X.DESK.y - 92), left = sineIO(span(t, A.clock - .1, A.clock + 1.3));
    let x = lerp(p0[0], RPT.x, lift), y = lerp(p0[1], RPT.y, lift) - Math.sin(Math.PI * lift) * 120, w = lerp(118 * VDESK.s, RPT.w, lift);
    x = lerp(x, 220, left); y = lerp(y, 560, left); w = lerp(w, 150, left);
    return { x, y, w, h: w * 1.32 };
  };
  function reportStage(ctx, t) {
    const lift = span(t, A.draghi + .5, A.draghi + 2.2), fall = span(t, A.builds - .6, A.builds + .4); if (lift <= 0 || fall >= 1) return;
    const r = reportAt(t), box = { x: r.x - r.w / 2, y: r.y - r.h / 2, w: r.w, h: r.h };
    const f1 = span(t, C.start - 1.25, C.start - .85), f2 = span(t, C.end + 1.0, C.end + 1.4);   // report → dark card, dark card → report
    const morph = Math.min(span(t, C.start - .85, C.start + .9), 1 - span(t, C.end - .1, C.end + 1.0));
    const dark = 1 - Math.min(span(t, C.start - .3, C.start + .6), 1 - span(t, C.end - .2, C.end + .6));
    const inCard = t >= C.start - 1.05 && t < C.end + 1.2;
    if (!inCard) {
      const k = t < C.start ? Math.abs(Math.cos(Math.PI * f1)) : Math.abs(Math.cos(Math.PI * f2));
      ctx.save(); ctx.translate(0, expoIn(fall) * 700); ctx.translate(r.x, r.y); ctx.rotate(fall * .5 + .03 * Math.sin(t * .6)); ctx.scale(Math.max(.02, k), 1); ctx.translate(-r.x, -r.y);
      B.report(ctx, t, r.x, r.y, r.w); ctx.restore();
    } else if (morph <= 0) B.darkCard(ctx, box, t < C.start ? Math.cos(Math.PI * f1) : Math.cos(Math.PI * f2));
    if (morph > 0) F.clipPlate(ctx, t, T, 'C1b', { from: box, morph, dark });
    const lab = span(t, A.draghi + 1.4, A.draghi + 2.0) * (1 - span(t, C.start - 1.6, C.start - 1.1));
    X.label(ctx, SRC.draghi, W / 2, RPT.y + RPT.w * .66 + 56, lab, { size: 26, spacing: .14 });
  }
  // the budget timeline (10.08) and the harvest (10.09); screen space (the view is the plain sheet here)
  const TL = { y: 560, x0: 300, x1: 1760, now: 380, summit: 440, agree: 1000, brk: 1070, b0: 1150, b1: 1720 };
  function timelineStage(ctx, t, dy = 0) {
    const line = span(t, A.clock + .4, A.clock + 1.8); if (line <= 0) return;
    ctx.save(); ctx.translate(0, dy);
    const shrink = span(t, A.builds - .6, A.builds + .2), tk = 1 - shrink;
    X.lightLine(ctx, [[TL.x0, TL.y], [TL.x1, TL.y]], line, { a: .75, w: 2.6 });
    const tick = (x, u) => { if (u > 0) X.lightLine(ctx, [[x, TL.y - 12], [x, TL.y + 12]], u, { a: .8, w: 2.4 }); };
    tick(TL.summit, span(t, A.winter + .2, A.winter + .6) * tk); tick(TL.agree, span(t, A.winter + .9, A.winter + 1.3) * tk);
    if (tk > 0) {   // the break, and the budget bar 2028–2034 (collapses into the line for the harvest)
      ctx.save(); ctx.strokeStyle = rgba(CREAM, .8 * span(t, A.clock + 1.2, A.clock + 1.6) * tk); ctx.lineWidth = 2.4;
      for (const dx of [0, 14]) { ctx.beginPath(); ctx.moveTo(TL.brk + dx - 8, TL.y + 14 * tk); ctx.lineTo(TL.brk + dx + 8, TL.y - 14 * tk); ctx.stroke(); }
      ctx.restore();
      const bu = span(t, A.budget, A.budget + 1.0); if (bu > 0) { const bx1 = lerp(TL.b0, TL.b1, sineIO(bu)), bh = 11 * tk; ctx.fillStyle = rgba(CREAM, .2); ctx.fillRect(TL.b0, TL.y - bh, bx1 - TL.b0, bh * 2); ctx.strokeStyle = rgba(CREAM, .7); ctx.lineWidth = 2; ctx.strokeRect(TL.b0, TL.y - bh, bx1 - TL.b0, bh * 2); }
    }
    // NOW: a gold light; from it time runs (a gold fill) toward the agreement tick: the clock on the option, never a clock face
    const nowU = span(t, A.clock + .6, A.clock + 1.2) * tk;
    if (nowU > 0) {
      const run = sineIO(span(t, A.winter + .2, A.builds - .4)) * .62, xr = lerp(TL.now, TL.agree, run);
      F.goldSpan(ctx, [[TL.now, TL.y], [TL.agree, TL.y]], 0, Math.max(.001, run), { w: 3, a: nowU, spark: false });
      halo(ctx, xr, TL.y, 46, .55 * nowU * (.85 + .15 * Math.sin(t * 2.4)), GOLD.halo, GOLD.core); ctx.fillStyle = rgba(GOLD.hot, nowU); ctx.beginPath(); ctx.arc(xr, TL.y, 8, 0, TAU); ctx.fill();
    }
    const out = 1 - span(t, A.builds - .9, A.builds - .3);
    X.label(ctx, 'NOW', TL.now, TL.y + 54, span(t, A.clock + .8, A.clock + 1.4) * out, { size: 24, gold: .8, col: GOLD.text });
    X.dateTag(ctx, SRC.clock[1], TL.summit + 150, TL.y - 62, span(t, A.winter + .3, A.winter + 1.0) * out);
    X.dateTag(ctx, SRC.clock[2], TL.agree, TL.y + 64, span(t, A.winter + 1.0, A.winter + 1.7) * out);
    X.dateTag(ctx, SRC.clock[0], (TL.b0 + TL.b1) / 2, TL.y - 62, span(t, A.budget + .3, A.budget + 1.0) * out);
    if (t > A.builds - .3) {   // 10.09: three pictures rise out of the line, one per sentence
      const hu = [span(t, A.builds - .1, A.builds + 1.0), span(t, A.savings - .1, A.savings + 1.0), span(t, A.minds - .1, A.minds + 1.0)];
      ctx.save(); ctx.beginPath(); ctx.rect(0, -1200, W, TL.y + 1200 - 1); ctx.clip();
      if (hu[0] > 0) { const k = expoOut(hu[0]); F.chipMachine(ctx, t, 500, TL.y + (1 - k) * 260, 360, { glow: 1, beam: span(t, A.builds + .6, A.builds + 1.4) }); }
      if (hu[1] > 0) B.kitchenWindow(ctx, t, 960, TL.y - 150, 250, { u: hu[1], clipY: 150 });
      if (hu[2] > 0) { F.letter(ctx, t, 1390, TL.y - 128 + (1 - expoOut(hu[2])) * 300, 118, { head: SRC.offers[0], rot: -.08 }); F.letter(ctx, t, 1495, TL.y - 118 + (1 - expoOut(clamp(hu[2] * 1.3 - .3))) * 300, 118, { head: SRC.offers[1], rot: .07 }); }
      ctx.restore();
      SRC.harvest.forEach((s, i) => X.label(ctx, s, [500, 960, 1442][i], TL.y + 62, hu[i], { size: 28, spacing: .14 }));
    }
    ctx.restore();
  }

  function draw(ctx, t) {
    if (t >= A.never - .4) {   // the finale take (sc12): the sheet with the harvest falls away into thumbnail A
      B.finale(ctx, t, T, { sheet: (c, tt, dy) => { B.sheetFrom(c, tt, B.shiftView({ x: 960, y: 540, s: 1 }, dy), dy, { lx: 960, ly: LY }); timelineStage(c, tt, dy); F.kitHud(c, tt, T, { dy }); } });
      return;
    }
    if (t < T_UP[1] + .05) { verdictStage(ctx, t); if (t < T_UP[0] + .6) return; }
    const v = viewAt(t);
    if (t >= T_UP[1] + .05) X.sheet(ctx, t, v, { lx: 960, ly: LY });
    if (t < C.start + .95) racesStage(ctx, t, v);
    if (t < T_UP[1] + .05) return;
    // the disc rides up into the HUD (and stays the HUD)
    const d = discSheet(t), hud = span(t, ...T_HUD), [dx, dy] = X.toScreen(v, d.x, d.y);
    if (d.go < 1) B.verdictDisc(ctx, t, parts(t), dx, dy, d.r * v.s, { glow: lerp(1, .8, d.go), loose: B.LOOSE(dx, dy, d.r * v.s) });
    else B.discToHud(ctx, t, T, { x: dx, y: dy, r: d.r * v.s, glow: .8, lx: 1.56, ly: .52 }, hud);
    // the race labels: NO (cream, the compute dims) · YES (the gold verdict, underlined)
    const [lx, lyA] = X.toScreen(v, B.TR.x0, B.TR.yA + B.TR.half + 50), [, lyB] = X.toScreen(v, B.TR.x0, B.TR.yB + B.TR.half + 50), lo = 1 - span(t, A.voice - .4, A.voice + .1);
    X.label(ctx, SRC.verdictNo, lx, lyA, span(t, A.noE - .3, A.noE + .4) * lo, { align: 'left', size: 30, spacing: .1, col: CREAM2 });
    if (t < A.voice + .2) F.verdict(ctx, t, lx, lyB, SRC.verdictYes, span(t, A.yesE - .3, A.yesE + .6) * lo, { size: 34, align: 'left' });
    X.label(ctx, 'A VOICE OF ITS OWN', W / 2, 200, span(t, A.voice + .4, A.voice + 1.1) * (1 - span(t, A.say - .5, A.say)), { size: 34, spacing: .14, gold: .6, col: GOLD.text });
    X.label(ctx, SRC.scenes[1], W / 2, 200, span(t, A.say + .1, A.say + .8) * (1 - span(t, A.draghi + .3, A.draghi + .8)), { size: 34, spacing: .14 });
    if (t > C.end) {
      X.big(ctx, 'An option.', W / 2, 250, 84, span(t, A.option - .05, A.option + .6) * (1 - span(t, A.clock + .9, A.clock + 1.5)), { gold: .3 });
      timelineStage(ctx, t);
      F.source(ctx, t, A.winter + .4, A.builds - .3, SRC.clockSrc);
    }
    reportStage(ctx, t);
  }
  return { draw, A };
}

export default async (T, R) => {
  const { draw, A } = makeDraw11(T);
  const marks = [R.a, A.none, A.can, A.race1, A.race2, A.voice, A.draghi, A.option, A.builds, A.never].filter((x) => x >= R.a && x < R.b);
  return marks.map((t) => ({ t, draw, print: PR }));
};
