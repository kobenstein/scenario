// c04 · The loudest week (day 31): red everywhere · DO SOMETHING · Fidelity 2008 · protection 1: a pause
// T.G('Day thirty-one') → T.G('Day forty-eight') · builder B1 · plan docs/shots.md 4.01–4.11.
// ONE entry, one place: your table at night (lamp = hero), seen by one 2D camera. The explainers live INSIDE your phone's screen:
// the camera pushes into it (4.03) and pulls back out (4.09), so the graphics ride on the phone (lib/f19_b1_set.mjs content space).
// | ID    | anchor                       | picture                                                         | moves                 |
// | 4.01  | thirty-one                   | the flood (gore 1) shrinks into your phone's screen on the table | pull back · buzz      |
// | 4.02  | phone · news · group chat    | a slow truck along the table, the screens go red in turn        | truck · screens       |
// | 4.03  | do something                 | push into your phone: DO SOMETHING, your thumb hovers           | push · thumb          |
// | 4.04★ | financial crisis · nobody ran| the button breaks into 100 points that settle red → gold        | points                |
// | 4.05  | Fidelity · tracked           | the points become the windows of a tower; a light runs along    | points → windows      |
// | 4.06  | two in a hundred             | back to points; two walk out left                               | two points            |
// | 4.07  | half · quarter · two percent | the points line up as feet; three bars grow                     | bars in turn          |
// | 4.08  | isn't a move · pause         | the two tall bars become ‖ and fly into gore 1                  | morph · flight        |
// | 4.09  | financial advice · panic     | pull back out of the phone; your hand withdraws                 | pull back · hand      |
// | 4.10  | anything big                 | the week on the phone: JOB · MONEY · PLANS move to next week     | push · cards          |
// | 4.11  | face down                    | the phone turns face down; glide over the table edge (→ c05)    | flip · glide          |
import { Path2D } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f19_kit.mjs';
import * as PR from '../lib/f19_props.mjs';
import { cam2At, camLive, withCam, toScr, riseText, SRC, LBL, huds, screenFlood, FLOOD, tableWorld, PHONE, phoneScreenRect, phoneDeep, camEdge, edgeTimes } from '../lib/f19_b1_set.mjs';
import { roadBg } from '../lib/f19_b1_road.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, lin, halo, prng } = E;
// E.glowFill sets globalAlpha absolutely; this local one respects the alpha already in effect (fades fade the glow too)
const glowFill = (ctx, p, b, a, col) => E.glowFill(ctx, p, b, a * ctx.globalAlpha, col);
const { RED, COOL } = F;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = R.a - 1, n = 0) => T.G(p, n, after);
  const a = { T0: R.a, end: R.b };
  a.d31 = G('Day thirty-one'); a.phone = G('phone', a.d31); a.news = G('news', a.d31); a.chat = G('group chat');
  a.doSom = G('do something'); a.fc = G('financial crisis', a.doSom); a.ran = G('nobody ran'); a.fid = G('Fidelity'); a.tracked = G('tracked');
  a.twoIn = G('two in a hundred'); a.half = G('grown by about half'); a.quarter = G('a quarter', a.half); a.twoPct = G('two percent', a.quarter);
  a.notMove = G("isn't a move"); a.pause = F.goreFlight(T, 0).t0; a.advice = G('financial advice'); a.panic = G('in the panic');
  a.big = G('anything big'); a.face = G('face down'); a.edge = edgeTimes(T);
  return [{ t: R.a, draw: scene(T, a), print: F.PRINT19 }];
};

// content space of the phone = the frame when the camera is pushed into the screen (cDeep)
const D = phoneDeep();
const c2s = (c, fx, fy) => toScr(c, PHONE.x + (fx - W / 2) / D.s, PHONE.y + (fy - H / 2) / D.s);
const GRID = (i) => [726 + (i % 10) * 52, 266 + Math.floor(i / 10) * 52];
const TOWER = { x: 1250, y0: 170, y1: 850, w: 360 };
const WINP = (i) => [TOWER.x - 135 + (i % 10) * 30, 225 + Math.floor(i / 10) * 60];
const BX = [560, 960, 1360], BY = 735, BH = [440, 220, 18], BW = 180;
const BNAME = ['STAYED', 'SOLD, CAME BACK LATER', 'LEFT, STAYED OUT'], BNUM = ['+50 %', '+25 %', '+2 %'];
const PZ = { x: 960, y: 470, s: 3.5 };                   // the pause sign (goreIcon 0 at scale 3.5)
const PR0 = prng(431), P0 = Array.from({ length: 100 }, () => [960 + (PR0() - .5) * 840, 560 + (PR0() - .5) * 250]);
const LEAVE = [40, 50];
const BASE = (() => { const out = {}; let k = [0, 0, 0]; for (let i = 0; i < 100; i++) { if (LEAVE.includes(i)) continue; const col = i % 10, b = col < 3 ? 0 : col < 7 ? 1 : 2, j = k[b]++; out[i] = [BX[b] - 91 + (j % 14) * 14, BY + 10 + Math.floor(j / 14) * 14, b]; } return out; })();

function scene(T, a) {
  const T0 = a.T0;
  const Cdeep = { x: PHONE.x, y: PHONE.y, s: D.s };
  const K = [
    [T0 + .15, { x: PHONE.x, y: PHONE.y, s: 2.6 }],
    [T0 + 2.0, { x: 860, y: 610, s: 1.0 }, 's'],                               // 4.01 pull back: your table, the lamp
    [a.chat + .5, { x: 1000, y: 620, s: 1.05 }],                               // 4.02 one slow truck along the table
    [a.doSom - .1, { x: PHONE.x, y: PHONE.y, s: 6 }],                          // 4.03 push into your phone
    [a.fc - .45, { x: PHONE.x, y: PHONE.y, s: 6.5 }],
    [a.fc + .7, Cdeep, 'q'],                                                   // 4.04 into the screen: the explainer plane
    [a.advice - .6, Cdeep],
    [a.advice + 1.5, { x: 900, y: 700, s: 1.5 }],                              // 4.09 pull back out
    [a.big - 2.3, { x: 905, y: 702, s: 1.53 }],
    [a.big - .7, { x: PHONE.x, y: 790, s: 3.6 }],                              // 4.10 the week on the phone
    [a.face - .5, camEdge(a.edge.t0, T)],                                       // 4.11 back for the flip (= camEdge's start; the glide takes over)
  ];
  const deepK = (t) => smooth(span(t, a.fc + .2, a.fc + .7)) * (1 - smooth(span(t, a.advice - .6, a.advice)));

  return (ctx, t) => {
    const c = t >= a.edge.t0 ? camEdge(t, T) : camLive(cam2At(t, K), t, smooth(span(t, T0 + .15, T0 + 1.2)) * (1 - .8 * deepK(t)) * (1 - smooth(span(t, a.face - 2, a.edge.t0))));
    const brk = a.fc - .64;
    const handY = (t < a.doSom - 1.2 ? 400 : lerp(400, 0, expoOut(span(t, a.doSom - 1.2, a.doSom - .2)))) + lerp(0, 60, quartIO(span(t, brk, brk + .6))) + lerp(0, 340, quartIO(span(t, a.advice + .2, a.advice + 1.7)));
    const handY2 = lerp(340, 20, quartIO(span(t, a.face - .9, a.face - .3))) + lerp(0, 340, quartIO(span(t, a.face + .45, a.face + 1.1)));
    const st = {
      glow: 1 - smooth(span(t, T0 + 1.3, T0 + 2.4)), lock: span(t, a.phone - .1, a.phone + .7), news: smooth(span(t, a.news - .1, a.news + .4)) * (1 - smooth(span(t, a.face, a.face + .4))), chat: span(t, a.chat - .1, a.chat + .9) * (1 - smooth(span(t, a.face + .1, a.face + .5))),
      redDim: 1 - smooth(span(t, a.doSom - 1.0, a.doSom - .2)), buzz: span(t, T0 + .3, T0 + 1.6) > 0 && t < T0 + 1.6 ? 1 : 0,
      face: 1 - quartIO(span(t, a.face - .25, a.face + .35)),
      content: (cx, r) => { cx.save(); cx.scale(1 / D.s, 1 / D.s); cx.translate(-W / 2, -H / 2); content(cx, t); cx.restore(); },
      bg: (cc, tt) => roadBg(cc, tt, T),
    };
    if (st.face < .5) st.content = null;
    tableWorld(ctx, t, T, c, st);
    // your hand (yellow sleeve): hovers over the button (4.03), withdraws (4.09); reaches to turn the phone (4.11)
    withCam(ctx, c, () => {
      const tr = t > a.doSom - .4 && t < brk ? Math.sin(t * 23) * .8 : 0;
      if (handY < 380) PR.hand(ctx, PHONE.x + 10 + tr, 824 + handY, .45, { ang: -.08 });
      if (handY2 < 330) PR.hand(ctx, PHONE.x + 70, 860 + handY2, .5, { ang: -.35 });
    });
    // 4.01: the flood shrinks into the phone's screen
    if (t < T0 + 1.3) {
      const sr = phoneScreenRect(), [x0, y0] = toScr(c, sr.x, sr.y), k = smooth(span(t, T0 + .14, T0 + 1.3)), q = Math.sqrt(1 - k), e = 1 - q;
      const w = lerp(sr.w * c.s, FLOOD.w, q), h = lerp(sr.h * c.s, FLOOD.h, q), cx = lerp(FLOOD.x + FLOOD.w / 2, x0 + sr.w * c.s / 2, e), cy = lerp(FLOOD.y + FLOOD.h / 2, y0 + sr.h * c.s / 2, e);
      screenFlood(ctx, t, { x: cx - w / 2, y: cy - h / 2, w, h });
    }
    // 4.08 the pause sign flies into gore 1 (screen space, from where the ‖ stood on the phone)
    const g = F.goreFlight(T, 0);
    if (t >= g.t0 && t < g.t1) { const [fx, fy] = c2s(c, PZ.x, PZ.y), f = F.flyToGore(t, T, 0, [fx, fy], { s0: PZ.s * c.s / D.s }); F.goreIcon(ctx, 0, f.x, f.y, f.s); }
    // 4.09 the small label
    riseText(ctx, 'NOT FINANCIAL ADVICE', 960, 820, t, a.advice, { ...LBL, size: 30, align: 'center', out: a.panic + .5 });
    huds(ctx, t, T);
  };

  // ----------------------------------------------------------------------------------------- inside the phone (content space)
  function content(ctx, t) {
    const brk = a.fc - .64, fidIn = quartIO(span(t, a.fid - .15, a.fid + 1.0)), fidOut = quartIO(span(t, a.twoIn - .75, a.twoIn - .05));
    const barsIn = span(t, a.half - 3.0, a.half - 1.6), absorb = quartIO(span(t, a.notMove - .2, a.pause - .4));
    // 4.03 the red button rises on "do something"
    if (t < brk + .25) {
      const u = expoOut(span(t, a.doSom - .15, a.doSom + .4)), gone = span(t, brk, brk + .25);
      if (u > 0) { ctx.save(); ctx.translate(960, 560 + (1 - u) * 60); ctx.scale((.7 + .3 * u) * (1 - .2 * gone), (.7 + .3 * u) * (1 - .2 * gone)); ctx.globalAlpha *= u * (1 - gone); PR.button(ctx, t, 0, 0, 900, { text: 'DO SOMETHING', press: .15 + .1 * Math.sin(t * 9) }); ctx.restore(); }
    }
    // 4.05 the tower: its rim is traced up from the ground, a light runs along the windows on "tracked"
    const tw = fidIn * (1 - fidOut);
    if (tw > 0) {
      ctx.save(); const p = new Path2D(); const h = (TOWER.y1 - TOWER.y0) * expoOut(tw);
      p.rect(TOWER.x - TOWER.w / 2, TOWER.y1 - h, TOWER.w, h);
      ctx.globalAlpha *= .9; ctx.fillStyle = lin(ctx, 0, TOWER.y0, 0, TOWER.y1, [[0, mixHex(P.ind1, P.blue1, .25)], [1, P.night1]]); ctx.fill(p);
      ctx.strokeStyle = rgba(P.halo0, .7); ctx.lineWidth = 4; ctx.stroke(p); ctx.restore();
      // redraw the windows over the body (points already there; the body sits behind them)
    }
    // 4.04–4.08 the 100 points
    if (t >= brk && absorb < 1) {
      for (let i = 0; i < 100; i++) {
        const st = brk + (i % 10) * .02 + Math.floor(i / 10) * .015, u = expoOut(span(t, st, st + 1.3));
        let [x, y] = [lerp(P0[i][0], GRID(i)[0], u), lerp(P0[i][1], GRID(i)[1], u)];
        let rr = 10, w = 0;
        const col = clamp((t - a.fc + .2 - i * .009) / .9);
        if (fidIn > 0) { const k = clamp(fidIn * 1.4 - (Math.floor(i / 10)) * .04) * (1 - fidOut), [wx, wy] = WINP(i); x = lerp(x, wx, k); y = lerp(y, wy, k); w = k; }
        if (LEAVE.includes(i)) { const lu = sineIO(span(t, a.twoIn + .1, a.twoIn + 2.4)); x -= 1300 * lu; y -= Math.abs(Math.sin(lu * 18)) * 8 * (lu > 0 && lu < 1 ? 1 : 0); if (lu >= 1) continue; }
        else if (barsIn > 0) { const [bx, by, b] = BASE[i], k = quartIO(clamp(barsIn * 1.3 - (i % 10) * .03)); x = lerp(x, bx, k); y = lerp(y, by, k); rr = lerp(10, 5, k);
          if (absorb > 0) { const tx = b === 2 ? BX[2] : PZ.x + (b ? 70 : -70), ty = b === 2 ? BY : PZ.y + 120; x = lerp(x, tx, absorb); y = lerp(y, ty, absorb); rr *= 1 - absorb; } }
        const scan = t > a.tracked - .1 ? Math.exp(-(((y - lerp(900, 150, span(t, a.tracked - .1, a.tracked + 1.3))) / 60) ** 2)) : 0;
        const colr = mixHex(RED.line, mixHex(P.halo0, P.core1, .35 + .5 * scan), col);
        if (col > .3) halo(ctx, x, y, rr * 3, .35 * col * (1 + scan), P.halo0);
        ctx.fillStyle = colr; ctx.beginPath();
        if (w > 0) ctx.roundRect(x - lerp(rr, 8, w), y - lerp(rr, 14, w), lerp(2 * rr, 16, w), lerp(2 * rr, 28, w), lerp(rr, 3, w)); else ctx.arc(x, y, rr, 0, 7);
        ctx.fill();
      }
    }
    // the shards of the button: a short red flash where it broke (accent)
    if (t >= brk && t < brk + .5) { const k = 1 - span(t, brk, brk + .5); ctx.save(); ctx.globalAlpha = k * .6; ctx.strokeStyle = RED.hot; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(960 - 450 * (1 + .2 * (1 - k)), 560 - 144 * (1 + .2 * (1 - k)), 900 * (1 + .2 * (1 - k)), 288 * (1 + .2 * (1 - k)), 144); ctx.stroke(); ctx.restore(); }
    riseText(ctx, 'THE FINANCIAL CRISIS · 2008–09', 960, 175, t, a.fc + .05, { ...LBL, size: 46, align: 'center', out: a.fid - .4 });
    riseText(ctx, 'FIDELITY', 300, 480, t, a.fid + .2, { size: 110, serif: true, out: a.twoIn - .8 });
    riseText(ctx, '7.1 MILLION 401(k) ACCOUNTS', 304, 540, t, a.fid + .5, { ...LBL, size: 36, out: a.twoIn - .8 });
    riseText(ctx, 'FEWER THAN 2 IN 100', 960, 175, t, a.twoIn + .25, { ...LBL, size: 50, align: 'center', out: a.half - 3.1 });
    // 4.07 the bars
    const bu = [a.half, a.quarter, a.twoPct].map((t0) => expoOut(span(t, t0 - .1, t0 + .8)));
    const morph = quartIO(span(t, a.notMove - .3, a.pause - .25));
    for (let b = 0; b < 3; b++) {
      if (bu[b] <= 0 || t >= a.pause) continue;
      let x0 = BX[b] - BW / 2, x1 = BX[b] + BW / 2, y1 = BY, y0 = BY - BH[b] * bu[b];
      if (morph > 0) {
        if (b < 2) { const px0 = PZ.x + (b ? 10 : -30) * PZ.s, py0 = PZ.y - 40 * PZ.s; x0 = lerp(x0, px0, morph); x1 = lerp(x1, px0 + 20 * PZ.s, morph); y0 = lerp(y0, py0, morph); y1 = lerp(y1, py0 + 80 * PZ.s, morph); }
        else { y0 = lerp(y0, BY, morph); }
      }
      const p = new Path2D(); p.roundRect(x0, y0, x1 - x0, Math.max(1, y1 - y0), lerp(6, 6 * PZ.s, morph * (b < 2)));
      glowFill(ctx, p, 30, .45, P.halo0);
      ctx.fillStyle = morph > 0 && b < 2 ? mixHex(P.halo0, P.core1, morph) : lin(ctx, x0, 0, x1, 0, [[0, P.halo1], [.45, P.core1], [1, P.halo0]]); ctx.fill(p);
      riseText(ctx, BNUM[b], BX[b], BY - BH[b] - 28, t, [a.half, a.quarter, a.twoPct][b] + .45, { size: 96, serif: true, align: 'center', out: a.notMove - .5 });
      riseText(ctx, BNAME[b], BX[b], BY + 92, t, [a.half, a.quarter, a.twoPct][b] - .1, { ...LBL, size: 30, align: 'center', out: a.notMove - .5 });
    }
    riseText(ctx, 'FIDELITY · 401(k) BALANCES INCL. CONTRIBUTIONS · TO MID-2011', 960, 175, t, a.half + .6, { ...SRC, size: 24, align: 'center', out: a.notMove - .5 });
    if (bu[0] > 0) { const lu = expoOut(span(t, a.half - 1.4, a.half - .6)) * (1 - expoIn(span(t, a.notMove, a.pause - .3))); ctx.fillStyle = rgba(P.halo0, .6); ctx.fillRect(960 - 640 * lu, BY + 44, 1280 * lu, 2); }
    // 4.08 the line under the pause, after it flew
    riseText(ctx, F.GORE_TEXT[0], 960, 600, t, a.pause + .55, { ...LBL, size: 64, align: 'center', out: a.advice + .9 });
    // 4.10 the week
    calendar(ctx, t);
  }
  function calendar(ctx, t) {
    const on = span(t, a.big - 2.4, a.big - 1.4); if (on <= 0) return;
    const off = quartIO(span(t, a.face - 1.0, a.face - .3));
    ctx.save(); ctx.globalAlpha *= 1 - off;
    const box = (y, col, u, label) => {
      const p = new Path2D(); p.roundRect(80, y, 1760, 740, 40);
      ctx.save(); ctx.setLineDash([2400 * expoOut(u), 9000]); ctx.strokeStyle = col; ctx.lineWidth = 12; ctx.stroke(p); ctx.restore();
      riseText(ctx, label, 150, y + 190, t, a.big - 2.4 + (y > 900 ? .3 : 0), { size: 150, weight: 600, col: P.cream, glow: false });
    };
    box(160, RED.line, on, 'DAY 30–37');
    box(1150, rgba(P.halo0, .7), span(t, a.big - 2.1, a.big - 1.1), 'DAY 38–45');
    ['JOB', 'MONEY', 'PLANS'].forEach((s, i) => {
      const u = expoOut(span(t, a.big - 1.9 + i * .12, a.big - 1.2 + i * .12)), mv = quartIO(span(t, a.big - .1 + i * .15, a.big + .8 + i * .15));
      if (u <= 0) return;
      const x = 340 + i * 620, y = lerp(600, 1590, mv) + (1 - u) * 80;
      ctx.save(); ctx.globalAlpha *= u; PR.paperCard(ctx, x, y, 500, 300, { tilt: (i - 1) * .03 * (1 - mv), lit: .5 });
      ctx.font = '600 140px Inter'; ctx.fillStyle = '#3a3550'; ctx.textAlign = 'center'; ctx.fillText(s, x, y + 40); ctx.restore();
    });
    ctx.restore();
  }
}
