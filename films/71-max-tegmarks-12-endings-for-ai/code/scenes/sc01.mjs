// Film 71 · c01 (lead): HOOK + ENDING 12/12 CONQUERORS. One continuous take, no cut (docs/shots.md H.01 – 12.28):
//   A  THE LEITBILD (thumbnail A, frame 0) → you walk up the gold beam → the camera flies through the gold door into the MORNINGS
//      (kitchen: no bills, every window across lit · fed, safe, behind glass · the empty bedroom) → back out: WHICH ENDING?
//   B  THE YARD: the doors line up, you walk to NOW; Tegmark's name; the doors far right (THE FAR FUTURE) jolt to 2026, a tag on every door;
//      a law / a test gone wrong / half its work to AI; the rearview mirror → C1 → DECIDED THIS YEAR
//   C  ENDING 12: the doors re-sort into OUR ranking, the row parks in the counter, door 12 stays: the 3-step mechanism, no morning, the door
//      opening becomes the OpenAI test box, the breakout into Hugging Face, the message, EVERYONE ELSE IS DOING IT, two signs, Tegmark's
//      institute, superintelligence; folded back into the door; THE SWITCH (track, fork, lever, the hand, SWITCH TOUCHED), all twelve, both
//      ways; HOW LIKELY? Tegmark vs Ball → C2 → 1 in 10,000 vs over 90 %, made up on the spot, NOT A MEASUREMENT; the agents were spotted:
//      the guard eye + ? park in the counter at door 4 → the seam plate plateRow(11) at R.b − SEAM_HALF.
// Anchors are phrases only (T.G). Overlays are designed in screen px at a reference view and live on the yard (ref()), so they move with the
// camera and never float.
import * as F from '../lib/f71_kit.mjs';
import * as S from '../lib/f71_world.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, rad, prng, GOLD, CREAM, CREAM2, COOL, PAPER, TXT } = F;
const TAU = Math.PI * 2;
const ref = (ctx, vd) => ctx.transform(1 / vd.s, 0, 0, 1 / vd.s, vd.x - W / 2 / vd.s, vd.y - H / 2 / vd.s);   // inside inView: draw in screen px of view vd
// (napi canvas: a globalAlpha of exactly 0 is ignored, so a faded group is skipped instead of drawn at alpha 0)
const inRef = (ctx, v, vd, fn, a = 1) => { if (a <= .002) return; F.inView(ctx, v, () => { ref(ctx, vd); ctx.globalAlpha *= a; fn(); }); };
const refPt = (vd, x, y) => [W / 2 + (x - vd.x) * vd.s, H / 2 + (y - vd.y) * vd.s];   // yard → reference screen
const nz = (x) => (x > .002 ? x : undefined);
const jolt = (u) => (u < .7 ? expoIn(u / .7) : 1 + .05 * Math.sin(Math.PI * (u - .7) / .3) * (1 - (u - .7) / .3));

export default function (T, R) {
  const G = (p, n = 0, after = -1) => T.G(p, n, after), GE = (p, n = 0, after = -1) => T.GE(p, n, after);
  // ---------------------------------------------------------------- anchors (phrases only)
  const A = {
    wake: G('You will wake up'), oneOf: GE('in one of them'), anyone: G('For anyone'), fed: G('wake up fed'), glass: G('behind glass'),
    nobody: G('Maybe nobody wakes up'), which: G('So which ending'), phys: G('Tegmark is a physicist'), endings: G('His endings sound'),
    far: G('the far future'), thisYear: G('But this year'), every: G('every single ending'), law: G('A law'), test: G('A test gone wrong'),
    gov: G('A government deciding'), half: G('half its work'), today: G('And when Tegmark talks'), ahead: G("he doesn't point ahead"),
    wait: G("The ending isn't waiting"), decided: G("It's being decided this year"),
    worst: G('Start with the worst'), ours: G('The order is ours'), oursE: GE("not Tegmark's"), conq: G('He calls it Conquerors'),
    ctrl: G('takes control'), way: G("decides we're in the way"), rid: G('gets rid of us'), noMorn: G('No morning here'),
    july: G('In July, a test at OpenAI'), agents: G('Hundreds of AI agents'), broke: G('broke out'), attack: G('They attacked another company'),
    hf: G('Hugging Face'), hunt: G('hunting for test answers'), wrote: G('One agent wrote'), reason: G('Its reason'), els: G('everyone else is doing'),
    here: G('Is this ending here'), one: G("It was one company's test"), reading: G('That companies lost control'), inst: G('His institute campaigns'),
    smart: G('AI smarter than all'), notHere: G("So this ending isn't here"), track: G('But the track toward it'), touched: G('someone touched it'),
    all: G('That goes for all twelve'), both: G('And a switch moves both ways'), likely: G('How likely is this ending'), debated: G('Tegmark debated Dean Ball'),
    odds: G("Ball's odds of doom"), tenK: G('One in ten thousand'), answer: G("Tegmark's answer"), ninety: G('ninety percent'), strict: G('without strict rules'),
    later: G('Ball later wrote'), neither: G('Neither number is a measurement'), spotted: G('But those agents were spotted'), byWhat: G('By what'),
    better: G('That belongs to a better ending'),
  };
  const C1 = T.clip('C1'), C2 = T.clip('C2'), PLATE = R.b - S.SEAM_HALF;
  const K = F.counterTimes(T), VB = { x: 960, y: 515, s: 1.06 };

  // ---------------------------------------------------------------- A · the Leitbild and the mornings
  // text-v2: the GOLD door stays shut in the hook (it opens only at ending 1, on the same kitchen): we fly through slot 4, its neighbour
  const HOOK = 4, ZE = S.ZEND * 1.05, GD = S.slotDoor(HOOK), GC = [GD.x, GD.y - GD.h / 2];
  const hookIn = [[0, { x: 960, y: 540, s: 1 }], [A.wake, { x: 952, y: 548, s: 1.05 }], [A.oneOf + .1, { x: GC[0] + 70, y: 556, s: 1.4 }], [A.oneOf + 1.05, { x: GC[0], y: GC[1], s: ZE }]];
  const hookOut = [[A.which, { x: GC[0], y: GC[1], s: ZE }], [A.which + 1.7, { x: GC[0] + 120, y: 590, s: 1.16 }], [A.phys - .5, { x: GC[0] + 140, y: 585, s: 1.12 }]];
  const bView = [[A.phys - .5, { x: GC[0] + 140, y: 585, s: 1.12 }], [A.phys + 1.6, { x: 960, y: 540, s: 1 }], [A.worst, VB]];
  const hookView = (t) => (t < A.which ? F.viewPath(t, hookIn) : F.viewPath(t, hookOut));
  const roomCam = [[A.oneOf + .6, { x: 960, y: 560, s: 1 }], [A.anyone - .3, { x: 1010, y: 540, s: 1.05 }], [A.anyone + .8, { x: 1330, y: 440, s: 1.55 }],
    [A.fed - .1, { x: 1300, y: 455, s: 1.45 }], [A.fed + .9, { x: 980, y: 560, s: 1.03 }], [A.glass + .9, { x: 960, y: 560, s: 1.0 }],
    [A.nobody - .05, { x: 720, y: 560, s: .98 }], [A.nobody + 1.05, { x: -1160, y: 600, s: 1.0 }], [A.which + .3, { x: -1185, y: 600, s: 1.04 }]];
  const roomOpts = (t) => ({ fed: span(t, A.fed + .15, A.fed + .8), anyone: span(t, A.anyone, A.anyone + 1), glass: span(t, A.glass - .25, A.glass + .85), dim: .5 * span(t, A.nobody, A.nobody + 1) });
  const youHook = (t) => {
    const u = sineIO(span(t, A.wake, A.oneOf + .7));
    if (t < A.which) return { x: lerp(S.YOU0.x, GD.x + 14, u), y: lerp(S.YOU0.y, 806, u), h: lerp(S.YOU0.h, 118, u), walk: u > 0 && u < 1 ? t * 7 : undefined, look: .1 };
    return { x: GD.x + 14, y: 806, h: 118, pose: 'look', look: .25 + .15 * span(t, A.which, A.which + 1) };
  };
  function drawHook(ctx, t) {
    const v = hookView(t), Z = v.s;
    const open = t < A.which ? span(t, A.oneOf - .55, A.oneOf + .45) : 1 - span(t, A.which + .55, A.which + 1.35);
    const inner = (c, box) => {
      const [x0, y0] = F.toScreen(v, box.x0, box.y0);
      c.setTransform(1, 0, 0, 1, 0, 0);
      S.roomThroughDoor(c, t, { x0, y0, w: box.w * v.s, h: box.h * v.s }, Z, F.viewPath(t, roomCam), roomOpts(t));
    };
    S.leitbild(ctx, t, { v, title: 1, titleOut: span(t, A.wake - .2, A.wake + .6), you: Z < 6 ? youHook(t) : null,
      slots: (i) => (i === HOOK ? { open: open > 0 ? open : undefined, inner: open > 0 ? inner : undefined } : null),
      which: span(t, A.which + .9, A.which + 1.6) });
    F.scenarioTag(ctx, span(t, A.oneOf + .8, A.oneOf + 1.4) * (1 - span(t, A.which, A.which + .4)));
  }

  // ---------------------------------------------------------------- B · the yard: the time axis
  const AX = { x0: 250, x1: 1800, y: 738 }, FLOOR = 712;
  const P0 = (i) => ({ x: 420 + i * 110, y: FLOOR, w: 50, h: 136 });
  const PF = (i) => ({ x: 1432 + i * 26, y: FLOOR, w: 18, h: 50 });
  const PN = (i) => ({ x: 330 + i * 106, y: FLOOR, w: 54, h: 140 });
  const SLOT = Object.fromEntries(F.THUMB_ORDER.map((r, i) => [r, i]));   // rank → thumbnail slot
  const mix = (a, b, u) => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), w: lerp(a.w, b.w, u), h: lerp(a.h, b.h, u) });
  const mB = (t) => sineIO(span(t, A.phys - .5, A.phys + 1.2));
  const HUDP = (n, v) => { const [x, y] = F.fromScreen(v, F.hudDoorX(n), F.HUD.y + 44); return { x, y, w: F.HUD.gw / v.s, h: F.HUD.gh / v.s }; };
  // where door of rank r stands at t (null = in its row slot, the default)
  function doorPos(r, t, v) {
    const i = SLOT[r];
    if (t < A.worst) {
      let p = mix(S.thumbSlot(i), P0(i), sineIO(span(t, A.phys - .5 + Math.abs(i - 5) * .03, A.phys + 1.1 + Math.abs(i - 5) * .03)));
      p = mix(p, PF(i), sineIO(span(t, A.far - .55 + (11 - i) * .025, A.far + .35 + (11 - i) * .025)));
      p = mix(p, PN(i), jolt(span(t, A.thisYear + i * .012, A.thisYear + .5 + i * .012)));
      return p;
    }
    const u = sineIO(span(t, A.worst + .05 * i, A.worst + 1.2 + .05 * i));
    const rk = { x: F.rowX(r), y: F.ROW.y, w: F.ROW.w, h: F.ROW.h };
    if (u < 1) { const p = mix(PN(i), rk, u); p.y += (i % 2 ? -1 : 1) * 70 * Math.sin(Math.PI * u); return p; }
    if (r === 12) return null;
    const go = sineIO(span(t, A.oursE + .15 + (11 - r) * .05, A.oursE + .9 + (11 - r) * .05)), back = sineIO(span(t, A.all + .1 + (11 - r) * .05, A.all + .9 + (11 - r) * .05));
    if (go <= 0 || back >= 1) return null;
    const hp = HUDP(r, v), q = go < 1 ? go : 1 - back;
    const p = mix(rk, hp, q); p.y -= 60 * Math.sin(Math.PI * q); return p;
  }
  const doorA = (r, t) => { if (r === 12 || t < A.oursE) return 1; const go = span(t, A.oursE + .15 + (11 - r) * .05, A.oursE + .9 + (11 - r) * .05), back = span(t, A.all + .1 + (11 - r) * .05, A.all + .9 + (11 - r) * .05); return go >= 1 && back <= 0 ? 0 : 1; };
  const doorCol = (r, t) => mixHex(F.THUMB_COL[SLOT[r]], F.END[r].col, span(t, A.worst + .2, A.worst + 1.4));
  const tagU = (r, t) => (t < A.worst ? span(t, A.every - .1 + SLOT[r] * .1, A.every + .4 + SLOT[r] * .1) : 0);
  const glowAll = (t) => span(t, A.decided + .2, A.decided + .9) * (1 - span(t, A.worst, A.worst + .6));

  // mirror (rearview): drops on its stem at "he doesn't point ahead", the C1 plate grows out of it
  const MIR = { x: 700, y: 70, w: 520, h: 200 };
  const mirrorY = (t) => -280 * (1 - expoOut(span(t, A.ahead - .25, A.ahead + .45))) - 300 * expoIn(span(t, C1.end + .45, C1.end + 1.1));
  function mirror(ctx, t) {
    const dy = mirrorY(t); if (dy <= -279) return;
    ctx.save(); ctx.translate(0, dy);
    ctx.fillStyle = mixHex(P.night1, P.blue1, .5); ctx.fillRect(952, -10, 16, MIR.y + 12);
    ctx.fillStyle = mixHex(P.night0, COOL.deep, .55); ctx.beginPath(); ctx.roundRect(MIR.x, MIR.y, MIR.w, MIR.h, 44); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.roundRect(MIR.x, MIR.y, MIR.w, MIR.h, 44); ctx.clip();
    for (let i = 0; i < 12; i++) { const x = MIR.x + MIR.w - 50 - i * 38, h = 70; ctx.fillStyle = rgba(F.THUMB_COL[i], .75); ctx.fillRect(x - 9, MIR.y + MIR.h - 40 - h, 18, h); }
    ctx.fillStyle = rgba(CREAM, .5); ctx.fillRect(MIR.x, MIR.y + MIR.h - 38, MIR.w, 2);
    ctx.strokeStyle = rgba(COOL.core, .14); ctx.lineWidth = 30; ctx.beginPath(); ctx.moveTo(MIR.x + 80 + 30 * Math.sin(t * .4), MIR.y - 20); ctx.lineTo(MIR.x + 220, MIR.y + MIR.h + 20); ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = CREAM; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(MIR.x, MIR.y, MIR.w, MIR.h, 44); ctx.stroke();
    ctx.restore();
  }
  // the three pictograms over three doors (slot 9 = rank 2 the law, slot 2 = rank 12 the test, slot 0 = rank 5 the government)
  function pictos(ctx, t) {
    const fold = sineIO(span(t, A.wait, A.wait + .8)); if (fold >= 1) return;
    const items = [[9, A.law, 'law'], [2, A.test, 'test'], [0, A.gov, 'gov']];
    for (const [i, t0, kind] of items) {
      const u = span(t, t0 - .15, t0 + .55); if (u <= 0) continue;
      const p = PN(i), cx = p.x, top = p.y - p.h;
      ctx.save(); ctx.globalAlpha *= 1 - fold; ctx.translate(cx, top); ctx.scale(1 - fold * .9, 1 - fold * .9); ctx.translate(-cx, -top);
      if (kind === 'law') { F.signCard(ctx, t, cx, 300, { main: ['§'], size: 84, w: 150, u }); F.label(ctx, TXT.hook.law, cx, 510, span(u, .3, 1), { size: 24 }); }
      if (kind === 'test') { F.boxField(ctx, t, cx - 95, 352, 190, 120, { u, n: 30, seed: 5, escape: span(t, A.test + .4, A.test + 2.6), escFrac: .14, to: { x: cx + 105, y: 300, w: 80, h: 90 } }); F.label(ctx, TXT.hook.test, cx, 510, span(u, .3, 1), { size: 24 }); }
      if (kind === 'gov') { F.building(ctx, t, cx, 470, 6, 4, 18, { share: .5, sw: span(t, A.half, A.half + 1.3), a: clamp(u * 2) }); F.label(ctx, TXT.hook.gov, cx + 40, 268, span(u, .3, 1), { size: 24 }); }
      ctx.restore();
    }
  }
  function axis(ctx, t) {
    const off = sineIO(span(t, A.worst + .1, A.worst + .9)), u = span(t, A.endings, A.endings + 1.1);
    if (u <= 0 || off >= 1) return;
    const x1 = lerp(AX.x1, AX.x0, off);
    F.lightLine(ctx, [[AX.x0, AX.y], [Math.min(x1, lerp(AX.x0, AX.x1, expoOut(u))), AX.y]], 1, { w: 3, a: .8 });
    const ah = span(u, .8, 1) * (1 - off);
    if (ah > 0) {
      const pt = span(t, A.today, A.today + .5) * (1 - span(t, A.ahead, A.ahead + .6)), dim = 1 - .6 * span(t, A.ahead, A.ahead + .6);
      ctx.save(); ctx.globalAlpha *= ah * dim; ctx.strokeStyle = CREAM; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(AX.x1 - 26, AX.y - 18); ctx.lineTo(AX.x1, AX.y); ctx.lineTo(AX.x1 - 26, AX.y + 18); ctx.stroke(); ctx.restore();
      if (pt > 0) halo(ctx, AX.x1, AX.y, 120, .5 * pt, F.LAMP.body, F.LAMP.core);
    }
    ctx.fillStyle = rgba(CREAM, .8 * (1 - off)); ctx.fillRect(AX.x0 - 1.5, AX.y - 14, 3, 28);
    F.label(ctx, TXT.hook.far, 1575, AX.y + 58, span(t, A.far, A.far + .6) * (1 - off), { size: 24, a: 1 - .55 * span(t, A.thisYear, A.thisYear + .5) - .3 * span(t, A.wait, A.wait + .8) });
    F.label(ctx, TXT.hook.now, AX.x0, AX.y + 58, span(t, A.thisYear + .3, A.thisYear + .9) * (1 - off), { size: 26, gold: .35 });
  }
  const youB = (t) => {
    const u = sineIO(span(t, A.phys - .4, A.phys + 2.2)), w = span(t, A.worst + .2, A.worst + 1.6);
    if (w > 0) { const k = sineIO(w); return { x: lerp(205, S.ROW_YOU.x, k), y: lerp(FLOOR, S.ROW_YOU.y, k), h: lerp(76, S.ROW_YOU.h, k), walk: w < 1 ? t * 7 : undefined, view: w < 1 ? 'side' : undefined, dir: w < 1 ? -1 : 1 }; }
    return { x: lerp(GD.x + 14, 205, u), y: lerp(806, FLOOR, u), h: lerp(118, 76, u), walk: u > 0 && u < 1 ? t * 7 : undefined, view: u > 0 && u < 1 ? 'side' : 'back', dir: u > 0 && u < 1 ? -1 : 1, pose: u >= 1 ? 'stand' : undefined };
  };

  // ---------------------------------------------------------------- C · ending 12 on the yard
  const VBOX = { x: 650, y: 330, s: 1.5 }, VTWO = { x: 940, y: 320, s: 1.15 }, VCARD = { x: 1290, y: 420, s: 1.5 }, VSIGN = { x: 720, y: 400, s: .98 },
    VTRACK = { x: 640, y: 640, s: 1.15 }, VROW = { x: 960, y: 600, s: 1 }, VDEB = { x: 960, y: -330, s: 1.15 }, VSPOT = { x: 560, y: 470, s: 1.35 }, VEND = { x: 960, y: 560, s: 1 };
  const yardCam = [[A.worst, VB], [A.oursE + .2, { x: 960, y: 540, s: 1 }], [A.conq + .5, { x: 600, y: 520, s: 1.4 }], [A.rid + .8, { x: 640, y: 530, s: 1.42 }],
    [A.noMorn + .2, { x: 300, y: 600, s: 2.15 }], [A.july + .15, { x: 320, y: 585, s: 2.05 }], [A.july + 1.2, VBOX], [A.attack - .1, { ...VBOX, x: 670 }],
    [A.attack + 1.3, VTWO], [A.wrote - .1, { ...VTWO, x: 955 }], [A.wrote + 1.0, VCARD], [A.here - .35, { ...VCARD, x: 1270 }], [A.here + .9, VSIGN],
    [A.notHere - .15, { ...VSIGN, x: 700 }], [A.notHere + 1.3, VTRACK], [A.all - .1, { ...VTRACK, x: 660 }], [A.all + 1.1, VROW], [A.likely - .1, { ...VROW, x: 960, y: 590 }],
    [A.likely + 1.4, VDEB], [A.spotted - .2, { ...VDEB, y: -320 }], [A.spotted + 1.25, VSPOT], [A.better + .15, { ...VSPOT, x: 575 }], [PLATE - .35, VEND], [PLATE, VEND]];
  const D12 = { x: F.rowX(12), y: F.ROW.y, w: F.ROW.w, h: F.ROW.h }, D12C = [D12.x, D12.y - D12.h / 2];
  const OPEN12 = { x0: D12.x - D12.w / 2, y0: D12.y - D12.h, w: D12.w, h: D12.h };
  const BOX1 = { x: 380, y: 150, w: 520, h: 300 }, BOX2 = { x: 1080, y: 150, w: 420, h: 300 }, BOX3 = { x: 330, y: 215, w: 380, h: 240 };
  const FORK = { x0: 1500, y: 830, xs: 820, x1: 40, ux: 250, uy: 786 }, LEV = { x: 820, y: 905, L: 64 };
  const fold = (t) => sineIO(span(t, A.notHere, A.notHere + .9));
  const foldIn = (ctx, f) => { ctx.translate(D12C[0], D12C[1]); ctx.scale(1 - f, 1 - f); ctx.translate(-D12C[0], -D12C[1]); ctx.globalAlpha *= 1 - f; };
  const rectMix = (a, b, u) => ({ x: lerp(a.x0 ?? a.x, b.x, u), y: lerp(a.y0 ?? a.y, b.y, u), w: lerp(a.w, b.w, u), h: lerp(a.h, b.h, u) });
  // the 3-step mechanism (yard coords, right of door 12)
  function mechanism(ctx, t, v) {
    const out = sineIO(span(t, A.noMorn - .35, A.noMorn + .45)); if (out >= 1 || t < A.conq) return;
    ctx.save(); ctx.translate(D12C[0], D12C[1]); ctx.scale(1 - out, 1 - out); ctx.translate(-D12C[0], -D12C[1]); ctx.globalAlpha *= 1 - out;
    const st = [[560, A.ctrl], [840, A.way], [1120, A.rid]], y = 520;
    st.forEach(([x, t0], k) => {
      const u = span(t, t0 - .1, t0 + .5); if (u <= 0) return;
      if (k) F.lightLine(ctx, [[st[k - 1][0] + 70, y], [x - 70, y]], span(u, 0, .6), { w: 2.5, a: .55, glow: false });
      if (k === 0) { for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) { ctx.fillStyle = mixHex(P.ind2, COOL.deep, span(u, .3 + (a + b) * .08, .6 + (a + b) * .08)); ctx.fillRect(x - 42 + a * 30, y + 6 + b * 22, 24, 16); } }
      if (k > 0) { halo(ctx, x, y + 40, 110, .28 * u * (k === 2 ? lerp(1, .2, span(t, t0 + .2, t0 + 1.1)) : 1), F.LAMP.body, F.LAMP.core); for (let j = 0; j < 3; j++) { ctx.save(); ctx.globalAlpha *= clamp(u * 2) * (k === 2 ? lerp(1, .1, span(t, t0 + .2, t0 + 1.1)) : 1); F.person(ctx, x - 40 + j * 40, y + 84, 72, { dir: 1, light: 1, back: .3 }); ctx.restore(); } }
      if (k === 1) F.lightLine(ctx, [[x, y - 30], [x, y + 8]], span(u, .4, 1), { w: 2, col: rgba(COOL.line, .8), glow: false });
      F.agentGlyph(ctx, t, x, y - (k ? 48 : 22), 28 * expoOut(u), { ping: .7, ph: k * .3 });
    });
    ctx.restore();
  }
  function mechLabels(ctx, t, v) {
    const out = span(t, A.noMorn - .35, A.noMorn + .1); if (out >= 1 || t < A.conq) return;
    [[560, A.ctrl, 'TAKES CONTROL'], [840, A.way, "DECIDES WE'RE IN THE WAY"], [1120, A.rid, 'GETS RID OF US']].forEach(([x, t0, s]) => {
      const [X, Y] = F.toScreen(v, x, 640); F.label(ctx, s, X, Y, span(t, t0, t0 + .5) * (1 - out), { size: 24 });
    });
    const [X, Y] = F.toScreen(v, D12.x, D12.y - D12.h - 40); F.label(ctx, 'CONQUERORS', X, Y, span(t, A.conq + .5, A.conq + 1.1) * (1 - span(t, A.july, A.july + .4)), { size: 30, spacing: .16 });
  }
  // the 10,000-cell field (Ball 1 cell · Tegmark over 90 %), drawn in the debate reference view
  const GRID = { x: 710, y: 214, n: 100, c: 4, p: 5 }, JIT = (() => { const r = prng(7131); return Float32Array.from({ length: 20000 }, () => r() * 2 - 1); })();
  const ballDot = [GRID.x + 2, GRID.y + 99 * GRID.p + 2];
  function grid(ctx, t) {
    const u = span(t, C2.end - .1, C2.end + .7); if (u <= 0) return;
    const rows = 90 * sineIO(span(t, A.ninety - .3, A.ninety + 1.3)), jit = 7 * sineIO(span(t, A.neither + .1, A.neither + 1.2));
    for (let r = 0; r < 100; r++) for (let c = 0; c < 100; c++) {
      const k = r * 100 + c, a = clamp(u * 2.2 - (r / 100) * 1.2); if (a <= 0) continue;
      const on = r < Math.floor(rows) ? 1 : r < rows ? rows - Math.floor(rows) : 0;
      ctx.fillStyle = on > 0 ? rgba(CREAM, (.08 + .74 * on) * a) : rgba(CREAM, .08 * a);
      ctx.fillRect(GRID.x + c * GRID.p + JIT[2 * k] * jit, GRID.y + r * GRID.p + JIT[2 * k + 1] * jit, GRID.c, GRID.c);
    }
    halo(ctx, ballDot[0], ballDot[1], 60, .8 * u, CREAM, '#ffffff'); ctx.fillStyle = '#ffffff'; ctx.fillRect(ballDot[0] - 4, ballDot[1] - 4, 8, 8);
  }

  function drawYard(ctx, t) {
    const v = t < A.worst ? F.viewPath(t, bView) : F.viewPath(t, yardCam), m = mB(t), endRamp = span(t, A.better + .6, PLATE - .3);
    // ground: the yard; the plain of the Leitbild over it until the doors have lined up (light only, no shape pops)
    F.yard(ctx, t, v, { lx: lerp(960, F.rowX(11), endRamp), ly: 560, pool: .8, rails: m });
    if (m < 1) { ctx.save(); ctx.globalAlpha = 1 - m; S.plain(ctx, t, v, { stars: 1 }); ctx.restore(); }
    if (m < 1) F.inView(ctx, v, () => { for (let i = 0; i < 12; i++) { const p = doorPos(F.THUMB_ORDER[i], t, v); S.beam(ctx, p.x, p.y, p.w, F.THUMB_COL[i], (1 - m) * (i === S.GOLD_SLOT ? 1.55 : .9) * (i === S.GOLD_SLOT ? 1 : .82)); } });
    const levOn = (r) => (r === 12 ? span(t, A.likely + .6, A.likely + 1.2) : span(t, A.all + .7 + (11 - r) * .05, A.all + 1.2 + (11 - r) * .05));
    const youIn = t >= A.worst + 1.6;
    S.rowScene(ctx, t, T, {
      n: 12, v, yard: false, scale: (r) => (r === 12 ? lerp(1.06, 1, endRamp) : r === 11 ? lerp(1, 1.06, endRamp) : 1), beam: t < A.worst + 1.5 ? undefined : (r) => (r === 12 ? lerp(.8, .3, endRamp) : r === 11 ? lerp(.3, .8, endRamp) : .3), hud: t >= K.on - .2 ? 1 : 0, parked: t > A.better && t < A.better + .9 ? false : undefined,
      pos: (r) => doorPos(r, t, v), a: (r) => doorA(r, t), col: t < A.worst + 1.5 ? (r) => doorCol(r, t) : undefined,
      lit: (r) => { if (t < A.worst) return SLOT[r] === S.GOLD_SLOT ? 1 : .82; if (r === 12) return lerp(1, .22, endRamp); if (r === 11) return lerp(.6, 1, endRamp); return .6; },
      doorOpts: (r) => { if (t >= A.worst + 1.5) return {}; const g = SLOT[r] === S.GOLD_SLOT; return { beam: lerp(0, .3, m), halo: lerp(g ? 1.3 : .8, 1, m), frame: m < 1 ? lerp(0, 3, m) : undefined }; },
      open: (r) => (r === 12 ? (t > A.conq ? nz(Math.max(.9 * span(t, A.noMorn - .2, A.noMorn + .5) * (1 - span(t, A.july + .7, A.july + 1.3)), .85 * Math.sin(Math.PI * span(t, A.notHere - .1, A.notHere + 1.2)), .85 * Math.sin(Math.PI * span(t, A.spotted, A.spotted + 1.3)), .85 * Math.sin(Math.PI * span(t, A.better + .15, A.better + 1.35)))) : undefined) : undefined),
      inner: (r) => (r === 12 ? (c, box) => { c.fillStyle = lin(c, 0, box.y0, 0, box.y0 + box.h, [[0, P.night0], [.7, mixHex(P.night0, F.EMBER.deep, .25)], [1, P.night0]]); c.fillRect(box.x0, box.y0, box.w, box.h); c.fillStyle = rgba(CREAM, .12); c.fillRect(box.x0, box.y0 + box.h * .7, box.w, 1.5); } : undefined),
      levers: (r) => levOn(r), knob: (r) => (r === 12 ? 0 : 0),
      leverAng: (r) => { const w0 = A.both + .25 + (12 - r) * .06; return .45 - .9 * Math.sin(Math.PI * span(t, w0, w0 + .9)); },
      tags: (r) => (t < A.worst ? (doorPos(r, t, v) ? 0 : 0) : r === 12 ? span(t, A.all + .5, A.all + 1.1) : span(t, A.all + .8 + (11 - r) * .05, A.all + 1.3 + (11 - r) * .05)),
      you: youIn ? 1 : 0, youAt: S.ROW_YOU,
    });
    // B: the time axis, the yard figure, the tags over the doors in thumbnail order, the pictograms, the mirror
    if (t < A.worst + 1.6) {
      F.inView(ctx, v, () => axis(ctx, t));
      F.inView(ctx, v, () => {
        for (let i = 0; i < 12; i++) { const r = F.THUMB_ORDER[i], tg = tagU(r, t); if (tg <= 0) continue; const p = doorPos(r, t, v); F.miniTag(ctx, p.x, p.y - p.h - 26, tg * (1 - span(t, A.worst, A.worst + .5)), r);
          const gl = glowAll(t); if (gl > 0) halo(ctx, p.x, p.y - p.h - 26, 46, .5 * gl, F.LAMP.body, F.LAMP.core); }
        if (t >= A.phys - .5 && !youIn) { const y = youB(t); F.du(ctx, y.x, y.y, y.h, { hood: false, pose: y.pose ?? 'stand', walk: y.walk, view: y.view, dir: y.dir, look: .15, light: 1, back: y.view === 'back' ? .6 : 0 }); }
      });
      F.inView(ctx, v, () => pictos(ctx, t));
      F.namePlate(ctx, t, 330, 150, TXT.hook.physicist[0], [TXT.hook.physicist[1]], span(t, A.phys, A.phys + .6) * (1 - span(t, A.endings + .4, A.endings + 1)));
      F.inView(ctx, v, () => F.big(ctx, TXT.hook.decided, W / 2, 300, 72, span(t, A.decided + .25, A.decided + .95) * (1 - span(t, A.worst - .1, A.worst + .4)), { gold: .55 }));
      if (t < C1.start || t > C1.end) F.inView(ctx, v, () => mirror(ctx, t));
      if (t < A.phys + .2) F.big(ctx, TXT.hook.which, W / 2, 250, 74, 1 - span(t, A.phys - .5, A.phys + .1), { gold: .25 });
    }
    // C: door 12's stations
    if (t >= A.conq - .1 && t < A.spotted + 6) {
      F.inView(ctx, v, () => mechanism(ctx, t, v));
      mechLabels(ctx, t, v);
      const f = fold(t);
      // the test box grows out of the door opening, the breakout, Hugging Face
      if (t > A.july && f < 1) {
        const mu = sineIO(span(t, A.july + .05, A.july + .8));
        const esc = span(t, A.broke + .15, A.broke + 5.8), sync = span(t, A.els - .2, A.els + .4) * (1 - span(t, A.here, A.here + .6));
        const dimB = 1 - .65 * span(t, A.one - .3, A.one + .4);
        let pts = null;
        F.inView(ctx, v, () => {
          ctx.save(); if (f > 0) foldIn(ctx, f); ctx.globalAlpha *= dimB;
          if (mu < 1 || t < A.july + 1.6) { const r = rectMix(OPEN12, BOX1, mu); ctx.strokeStyle = rgba(CREAM, .75); ctx.lineWidth = 2.5; ctx.strokeRect(r.x, r.y, r.w, r.h); }
          const b2 = span(t, A.hf - .25, A.hf + .6);
          if (b2 > 0) F.boxField(ctx, t, BOX2.x, BOX2.y, BOX2.w, BOX2.h, { u: b2, n: 0, title: 'HUGGING FACE' });
          const bf = F.boxField(ctx, t, BOX1.x, BOX1.y, BOX1.w, BOX1.h, { u: span(t, A.july + .7, A.july + 1.6), n: 140, seed: 3, title: TXT.e12.box1, titleSize: 22, escape: esc, to: BOX2, hot: 17, ring: span(t, A.wrote + .2, A.wrote + .8) * (1 - span(t, A.here, A.here + .5)) });
          pts = bf?.pts;
          if (pts && sync > 0) { const q = (t * 1.15) % 1; ctx.strokeStyle = rgba(COOL.core, .7 * sync * (1 - q)); ctx.lineWidth = 1.6; for (const [x, y] of pts) if (x > BOX2.x && x < BOX2.x + BOX2.w && y > BOX2.y && y < BOX2.y + BOX2.h) { ctx.beginPath(); ctx.arc(x, y, 5 + q * 12, 0, TAU); ctx.stroke(); } }
          ctx.restore();
        });
        // labels on the yard (screen px at their reference views)
        inRef(ctx, v, VBOX, () => { F.dateTag(ctx, F.END[12].tag, 430, 290, span(t, A.july + .5, A.july + 1.1)); F.label(ctx, TXT.e12.agents, 945, 790, span(t, A.agents, A.agents + .6), { size: 26 }); }, (1 - f) * dimB * (1 - span(t, A.wrote, A.wrote + .5)));
        inRef(ctx, v, VTWO, () => { F.label(ctx, TXT.e12.hunt, 1362, 742, span(t, A.hunt, A.hunt + .6), { size: 26 }); }, (1 - f) * dimB * (1 - span(t, A.wrote, A.wrote + .5)));
        F.source(ctx, t, A.hf, A.wrote + .2, TXT.e12.src);
        // the message card grows out of the agent that wrote it, and goes back into it
        const hot = pts ? pts[17] : [0, 0], cu = span(t, A.wrote + .7, A.wrote + 1.5) * (1 - span(t, A.reason - .1, A.reason + .5));
        if (cu > 0) inRef(ctx, v, VCARD, () => {
          const [hx, hy] = refPt(VCARD, hot[0], hot[1]), k = expoOut(cu);
          ctx.save(); ctx.translate(hx, hy); ctx.scale(k, k); ctx.translate(-hx, -hy);
          F.msgCard(ctx, t, T, 360, 596, { text: TXT.e12.msg, head: TXT.e12.msgSrc.toUpperCase(), size: 40, w: 1200, spoken: ['Task impossible', 'should continue'], reveal: span(t, A.wrote + 1.2, GE('outside its task')) * .48, hi: ['We', 'should', 'continue.'], u: 1 });
          ctx.restore();
        });
        inRef(ctx, v, VCARD, () => { F.big(ctx, TXT.e12.reason, W / 2, 790, 64, span(t, A.els, A.els + .7), { gold: .2 }); }, 1 - span(t, A.here - .2, A.here + .4));
        // is this ending here? two signs, the institute, superintelligence
        inRef(ctx, v, VSIGN, () => {
          const [dx, dy] = refPt(VSIGN, D12C[0], D12C[1]);
          ctx.translate(dx, dy); ctx.scale(1 - f, 1 - f); ctx.translate(-dx, -dy); ctx.globalAlpha *= 1 - f;
          F.big(ctx, TXT.e12.here, W / 2, 150, 60, span(t, A.here, A.here + .6) * (1 - span(t, A.inst - .2, A.inst + .3)), { gold: 0 });
          const sOut = expoIn(span(t, A.inst - .3, A.inst + .3));
          ctx.save(); ctx.translate(0, -sOut * 120); ctx.globalAlpha *= 1 - sOut;
          F.signCard(ctx, t, 1350, 245, { main: TXT.e12.sign1, size: 40, w: 600, u: span(t, A.one, A.one + .6) });
          F.signCard(ctx, t, 1350, 500, { main: TXT.e12.sign2, size: 40, w: 600, u: span(t, A.reading, A.reading + .6) });
          ctx.restore();
          F.signCard(ctx, t, 1330, 170, { head: TXT.e12.fli[0], sub: TXT.e12.fli[1], w: 820, u: span(t, A.inst, A.inst + .6) });
          const si = span(t, A.smart - .2, A.smart + .9);
          if (si > 0) {
            for (let j = 0; j < 18; j++) { ctx.save(); ctx.globalAlpha *= clamp(si * 3 - j * .06); F.person(ctx, 1030 + j * 36, 790, 46, { dir: j % 2 ? 1 : -1, light: 1, look: .6 }); ctx.restore(); }
            const r = 150 * expoOut(si); halo(ctx, 1336, 520, r * 1.8, .35 * si, COOL.halo, COOL.core);
            ctx.strokeStyle = COOL.body; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(1336, 520, r, 0, TAU); ctx.stroke();
            ctx.fillStyle = mixHex(COOL.body, '#ffffff', .4); ctx.beginPath(); ctx.arc(1336, 520, r * .36, 0, TAU); ctx.fill();
            F.label(ctx, TXT.e12.si, 1336, 860, span(si, .4, 1), { size: 24 });
          }
        });
      }
      // THE SWITCH: track + fork toward door 12, the lever, the hand, SWITCH TOUCHED
      const tu = span(t, A.track, A.track + 1.4) * (1 - span(t, A.likely + .4, A.likely + 1.1));
      if (tu > 0) {
        const tt = A.touched + .55, sw = sineIO(span(t, tt + .1, tt + .55)), w0 = A.both + .25, both = Math.sin(Math.PI * span(t, w0, w0 + .9));
        const ang = lerp(-.5, .5, sw) - both, blade = lerp(-1, 1, sw) - 2 * both;
        F.inView(ctx, v, () => {
          F.fork(ctx, t, FORK.x0, FORK.y, FORK.xs, FORK.x1, FORK.ux, FORK.uy, { u: tu, blade, gap: 20, a: .9 });
          ctx.save(); ctx.globalAlpha *= span(tu, .5, 1); F.lightLine(ctx, [[FORK.xs, FORK.y + 14], [LEV.x, LEV.y - 4]], 1, { w: 2, a: .4, glow: false });
          F.lever(ctx, t, LEV.x, LEV.y, ang, LEV.L, { knob: Math.sin(Math.PI * span(t, tt - .1, tt + 1.1)) }); ctx.restore();
          const hu = span(t, tt - .7, tt) * (1 - span(t, tt + .7, tt + 1.4));
          if (hu > 0) { const kx = LEV.x + Math.sin(lerp(-.5, .5, sw)) * LEV.L, ky = LEV.y - Math.cos(lerp(-.5, .5, sw)) * LEV.L; const e = sineIO(hu); F.hand(ctx, lerp(kx + 200, kx + 78, e), lerp(ky + 200, ky + 64, e), -2.45, 84, { pose: 'point', a: clamp(hu * 3) }); }
        });
        inRef(ctx, v, VTRACK, () => {
          const tg = span(t, tt + .35, tt + .9), sh = sineIO(span(t, A.all + .2, A.all + .9));
          if (tg > 0 && sh < 1) { const [mx, my] = refPt(VTRACK, D12.x, D12.y - D12.h - 26); ctx.save(); ctx.translate(lerp(520, mx, sh), lerp(300, my, sh)); ctx.scale(1 - sh * .9, 1 - sh * .9); F.switchTag(ctx, t, 0, 0, F.END[12].tag, tg); ctx.restore(); }
        });
      }
      // HOW LIKELY? the debate, P(DOOM), C2 out of Ball's plate, the 10,000 cells
      const du = span(t, A.likely + .3, A.likely + 1.3) * (1 - span(t, A.spotted, A.spotted + 1));
      let ballBox = null;
      if (du > 0) inRef(ctx, v, VDEB, () => {
        F.big(ctx, TXT.e12.likely, W / 2, 150, 64, span(t, A.likely + .5, A.likely + 1.1) * (1 - span(t, C2.start - .6, C2.start)), { gold: 0 });
        const pu = span(t, A.debated, A.debated + .7), pa = 1 - span(t, C2.start - .2, C2.start + .3);
        ctx.save(); ctx.globalAlpha *= pa;
        ctx.fillStyle = rgba(CREAM, .35 * pu); ctx.fillRect(420, 470, 1080 * expoOut(pu), 2);
        F.namePlate(ctx, t, 640, 330, TXT.e12.tegmark[0], [TXT.e12.tegmark[1]], pu, { w: 420 });
        ballBox = F.namePlate(ctx, t, 1280, 300, TXT.e12.ball[0], [TXT.e12.ball[1], TXT.e12.ball[2]], span(t, A.debated + .4, A.debated + 1.1), { w: 460 });
        F.dateTag(ctx, TXT.e12.debate, W / 2, 540, span(t, A.debated + .9, A.debated + 1.5));
        F.label(ctx, TXT.e12.pdoom, W / 2, 680, span(t, A.odds, A.odds + .6), { size: 30, spacing: .12 });
        F.label(ctx, TXT.e12.pdoomSub, W / 2, 724, span(t, A.odds + .3, A.odds + .9), { size: 22, weight: 600, col: CREAM2 });
        ctx.restore();
        grid(ctx, t);
        const gu = span(t, C2.end + .3, C2.end + 1);
        F.big(ctx, '1 in 10,000', W / 2, 178, 52, gu * (1 - .6 * span(t, A.answer, A.answer + .5)), { gold: .3 });
        F.label(ctx, TXT.e12.ballDot, GRID.x - 28, ballDot[1] + 9, gu, { align: 'right', size: 26, a: 1 - .5 * span(t, A.neither, A.neither + .6) });
        const tu2 = span(t, A.ninety, A.ninety + .7), ty = GRID.y + 90 * GRID.p;
        if (tu2 > 0) { ctx.fillStyle = rgba(CREAM, .6 * tu2); ctx.fillRect(GRID.x + 505, ty - 1, 26 * expoOut(tu2), 2); }
        F.label(ctx, TXT.e12.tegDot, GRID.x + 548, ty + 9, tu2, { align: 'left', size: 26, a: 1 - .5 * span(t, A.neither, A.neither + .6) });
        F.goldText(ctx, [[TXT.e12.tegQuote, 0]], GRID.x + 548, ty + 60, 30, F.rise(span(t, A.ninety + .4, A.ninety + 1.1)), { serif: true, col: CREAM2 });
        F.label(ctx, TXT.e12.tegCond, GRID.x + 548, ty + 100, span(t, A.strict, A.strict + .6), { align: 'left', size: 22, weight: 600, col: CREAM2 });
        F.goldText(ctx, [[TXT.e12.spot, .2]], 420, 560, 44, F.rise(span(t, A.later + .6, A.later + 1.3)), { serif: true, align: 'center', glow: true, a: 1 - .4 * span(t, A.neither, A.neither + .6) });
        F.big(ctx, TXT.e12.notm, W / 2, 840, 56, span(t, A.neither + .1, A.neither + .8), { gold: .2 });
      });
      F.source(ctx, t, A.debated + .5, C2.start - .3, TXT.e12.debateSrc);
      F.source(ctx, t, A.later + .3, A.neither, TXT.e12.spotSrc);
      // the clip plate C2 grows out of Ball's plate and goes back into Ball's one cell
      if (t > C2.start - .6 && t < C2.end + .6) {
        const box = ballBox ? { x: ballBox.x, y: ballBox.y, w: ballBox.w, h: ballBox.h } : { x: 1050, y: 300, w: 460, h: 170 };
        const into = span(t, C2.start - .55, C2.start + .05), back = span(t, C2.end - .05, C2.end + .5);
        F.clipPlate(ctx, t, T, 'C2', back > 0 ? { from: [ballDot[0], ballDot[1], 4], morph: 1 - back } : { from: box, morph: into });
      }
      // spotted: the Hugging Face box slides out of door 12 again, the guard eye opens, ?, both fly to the counter (door 4)
      const s3 = sineIO(span(t, A.spotted + .2, A.spotted + .95)), s3b = sineIO(span(t, A.better + .25, A.better + 1.05));
      const eyeYard = [BOX3.x + BOX3.w - 48, BOX3.y + 46];
      if (s3 > 0 && s3b < 1) {
        F.inView(ctx, v, () => {
          const r = rectMix(OPEN12, BOX3, s3 * (1 - s3b));
          const bf = F.boxField(ctx, t, r.x, r.y, r.w, r.h, { u: 1, n: 46, seed: 9, title: s3 > .9 && s3b < .1 ? 'HUGGING FACE' : null, a: 1 - s3b * .5 });
          const sp = span(t, A.spotted + 1.0, A.spotted + 1.6) * (1 - s3b);
          if (bf && sp > 0) bf.pts.forEach(([x, y], j) => { const a = clamp(sp * 3 - (j % 9) * .25); if (a <= 0) return; ctx.strokeStyle = rgba(COOL.core, .75 * a); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 11, 0, TAU); ctx.stroke(); });
        });
      }
      const eo = span(t, A.spotted + .7, A.spotted + 1.3), fly = sineIO(span(t, A.better, A.better + .9)), ea = 1 - span(t, A.better + .9, A.better + 1.3);
      if (eo > 0 && ea > 0) {
        const [ex, ey] = F.toScreen(v, eyeYard[0], eyeYard[1]), [px, py] = F.hudPocket('eye');
        const x = lerp(ex, px - 9, fly), y = lerp(ey, py, fly) - 140 * Math.sin(Math.PI * fly), r = lerp(22 * v.s / 1.35, 9, fly);
        F.guardEye(ctx, t, x, y, r, { open: eo, a: ea });
        F.qmark(ctx, x + r * 2.2 + lerp(6, 3, fly), y + r * .9, lerp(62, 26, fly), span(t, A.byWhat, A.byWhat + .5), { col: CREAM, a: ea });
      }
    }
    // the clip C1 (the mirror grows into its plate and the plate goes back)
    if (t > C1.start - .6 && t < C1.end + .6) {
      const into = span(t, C1.start - .55, C1.start + .05), back = span(t, C1.end - .05, C1.end + .5);
      const v = F.viewPath(t, bView), [mx, my] = F.toScreen(v, MIR.x, MIR.y + mirrorY(t));
      F.clipPlate(ctx, t, T, 'C1', { from: { x: mx, y: my, w: MIR.w * v.s, h: MIR.h * v.s, r: 44 * v.s }, morph: back > 0 ? 1 - back : into });
    }
  }

  const draw = (ctx, t) => (t < A.phys - .5 ? drawHook(ctx, t) : drawYard(ctx, t));
  return [
    { t: 0, draw, print: F.PRINT71 },
    { t: PLATE, draw: (ctx, t) => S.plateRow(ctx, t, T, 11), print: F.PRINT71 },
  ];
}
