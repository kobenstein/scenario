// Film 71 · c02 (B1): ENDING 11/12 SELF-DESTRUCTION. One continuous take (docs/shots.md 11.01 – 11.07):
//   the seam plate plateRow(11) → door 11 opens on an empty place · NO MACHINE (a dashed ring where a machine would be) · the ring glides to
//   the end of a line of people's lamps that come out of door 11; the lamps go out before the ring ever forms (BEFORE SUPERINTELLIGENCE) ·
//   the line becomes a NUMBER LINE to MIDNIGHT (no dial): the marker slides from 89 past every old mark to 85 SECONDS, THE CLOSEST EVER,
//   switch tag JAN 27, 2026 · the list of reasons, AI lights · everything folds back into door 11 · door 10 opens a crack (warm light behind
//   a pane) · the camera flies into the crack: at R.b the zoo room fills the frame (c03 starts on the same picture).
import * as F from '../lib/f71_kit.mjs';
import * as S from '../lib/f71_world.mjs';
import * as B from '../lib/b1_extra.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, GOLD, CREAM, CREAM2, COOL, LAMP, TXT } = F;
const TAU = Math.PI * 2;

export default function (T, R) {
  const G = (p, n = 0) => T.G(p, n, R.a - .5), GE = (p, n = 0) => T.GE(p, n, R.a - .5);
  const A = {
    a: R.a, nomach: G('And no machine to blame'), self: G('Tegmark calls it Self-Destruction'), wipes: G('wipes itself out'), before: G('before superintelligence'),
    built: GE('is ever built'), jan: G('In January, atomic scientists'), clock: G('Doomsday Clock'), e85: G('eighty-five seconds'), closest: G('the closest ever'),
    reason: G('One reason on their list'), after: G('In the one after that'), survive: G('you survive'), asWhat: G('But as what'),
  };
  A.ai = T.G('AI', 0, A.reason);
  const K = F.counterTimes(T);
  const D11 = { x: F.rowX(11), y: F.ROW.y }, D10 = { x: F.rowX(10), y: F.ROW.y, w: F.ROW.w, h: F.ROW.h };
  const D11C = [D11.x, D11.y - F.ROW.h * 1.06 / 2], D10C = [D10.x, D10.y - D10.h / 2];
  const LY = 300, RING0 = [480, 330], RING1 = [1560, 268], RR = 46;
  const AX = (sec) => 1560 - sec * 9;
  const ZE = 34;
  // ---------------------------------------------------------------- camera
  const VD = { x: 480, y: 470, s: 1.45 }, VL = { x: 1000, y: 360, s: 1.1 }, VN = { x: 1000, y: 330, s: 1.3 }, VR = { x: 1000, y: 360, s: 1.22 }, VC = { x: 560, y: 560, s: 1.75 };
  const P0 = S.plateView(A.a + S.SEAM_HALF, T, 11);
  const cam = [[A.a + S.SEAM_HALF, P0], [A.a + 2.4, VD], [A.self - .1, { ...VD, x: 500, s: 1.5 }], [A.self + 2.0, VL], [A.jan - .3, { ...VL, x: 1010, s: 1.13 }],
    [A.jan + 1.6, VN], [A.closest + .4, { ...VN, x: 990, s: 1.34 }], [A.reason + 1.1, VR], [A.after - .15, { ...VR, x: 980 }], [A.after + 1.7, VC], [A.asWhat + .15, { x: 530, y: 568, s: 2.05 }]];
  const FLY0 = A.asWhat + .15, CAM = B.holdKeys(cam);
  function view(t) {
    if (t < A.a + S.SEAM_HALF) return S.plateView(t, T, 11);
    if (t < FLY0) return F.viewPath(t, CAM);
    const v0 = cam[cam.length - 1][1], u = span(t, FLY0, R.b), e = sineIO(u), es = u * u * (3 - 2 * u);
    return { x: lerp(v0.x, D10C[0], e), y: lerp(v0.y, D10C[1], e), s: Math.exp(lerp(Math.log(v0.s), Math.log(ZE), es)) };
  }
  // ---------------------------------------------------------------- timing helpers
  const fold = (t) => sineIO(span(t, A.after - .25, A.after + .75));   // the explainer folds back into door 11
  const open11 = (t) => .85 * span(t, A.a + .9, A.a + 2.0) * (1 - sineIO(span(t, A.after + .4, A.after + 1.2)));
  const open10 = (t) => Math.max(.16 * sineIO(span(t, A.after + .5, A.after + 1.4)), lerp(.16, 1, sineIO(span(t, A.asWhat + .35, R.b - .55))));
  const ringPos = (t) => { const u = sineIO(span(t, A.self + .2, A.self + 2.2)); return [lerp(RING0[0], RING1[0], u), lerp(RING0[1], RING1[1], u) - 120 * Math.sin(Math.PI * u)]; };
  const PEOPLE = 10, px = (i) => 560 + i * 92;
  const zooOpts = { blinds: .12, cup: 0, lamp: 0, wake: 0, reach: 0, fed: 0, you: 1, grid: 0, glass: 0, keeper: 0 };

  function explainer(ctx, t, v) {
    const f = fold(t); if (f >= 1) return;
    ctx.save(); ctx.translate(D11C[0], D11C[1]); ctx.scale(1 - f, 1 - f); ctx.translate(-D11C[0], -D11C[1]); ctx.globalAlpha *= 1 - f * .6;
    // the dashed ring: where a machine would be (and never is)
    const ru = span(t, A.nomach + .1, A.nomach + .9), [rx, ry] = ringPos(t), toTick = sineIO(span(t, A.jan + .1, A.jan + 1.1));
    const form = Math.sin(Math.PI * span(t, A.before - .1, A.before + 1.5)) * (1 - toTick);
    if (ru > 0 && toTick < 1) {
      const r = lerp(RR, 6, toTick);
      if (form > 0) { ctx.save(); ctx.globalAlpha *= .35 * form; ctx.strokeStyle = COOL.body; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(rx, ry, r * .78, -Math.PI / 2, -Math.PI / 2 + TAU * .7 * form); ctx.stroke(); ctx.restore(); }
      B.dashedRing(ctx, rx, ry, r, ru, { spin: t * 6, a: 1 - toTick });
    }
    // the line of people's lamps (they come out of door 11), going out before the ring ever forms
    const lineU = span(t, A.self + 1.0, A.self + 3.2), outU = (i) => sineIO(span(t, A.wipes + i * .14, A.wipes + .8 + i * .14)), sink = sineIO(span(t, A.jan + .1, A.jan + 1.0));
    for (let i = 0; i < PEOPLE; i++) {
      const u = sineIO(span(lineU, i * .06, .45 + i * .06)); if (u <= 0 || sink >= 1) continue;
      const x = lerp(D11C[0], px(i), u), y = lerp(D11C[1] + 40, LY, u) - 90 * Math.sin(Math.PI * u), h = lerp(24, 74, u) * (1 - sink), off = outU(i);
      if (1 - off > .01) halo(ctx, x, y - h * .9, 46, .55 * (1 - off) * (1 - sink), LAMP.body, LAMP.core);
      ctx.save(); ctx.globalAlpha *= clamp(u * 3); F.person(ctx, x, y, h, { dir: 1, light: lerp(1, .15, off), look: .3 + .1 * Math.sin(t * .6 + i) }); ctx.restore();
    }
    // the floor line under them → the number line to midnight
    const lu = span(t, A.self + 1.2, A.self + 2.6);
    if (lu > 0) F.lightLine(ctx, [[px(0) - 70, LY + 2], [lerp(px(0) - 70, RING1[0], expoOut(lu)), LY + 2]], 1, { w: 2.5, a: lerp(.35, .85, toTick), glow: toTick > .5 });
    if (toTick > 0) {
      // MIDNIGHT: the ring became the end tick
      const mt = toTick; ctx.fillStyle = rgba(CREAM, .95 * mt); ctx.fillRect(RING1[0] - 2.5, LY - 34 * mt, 5, 34 * mt + 12);
      F.label(ctx, 'MIDNIGHT', RING1[0], LY - 52, span(t, A.jan + .6, A.jan + 1.3), { size: 26 });
      // the old marks (seconds to midnight): 1953 2 min, 2020 100 s, 2025 89 s
      [[120, '1953: 2 MIN'], [100, '2020: 100 S'], [89, TXT.e11.prev]].forEach(([sec, s], k) => {
        const a = span(t, A.jan + .5 + k * .12, A.jan + 1.1 + k * .12); if (a <= 0) return;
        const x = AX(sec), passed = span(t, A.e85 + .1, A.e85 + .5);
        ctx.fillStyle = rgba(CREAM, .7 * a); ctx.fillRect(x - 1.5, LY - 12, 3, 24);
        F.label(ctx, s, x, sec === 100 ? LY - 26 : LY + 46, a, { size: 22, weight: 600, col: CREAM2, a: 1 - .35 * passed });
      });
      // the marker: from 89 past every old mark to 85
      const mu = span(t, A.clock - .1, A.clock + .5), slide = expoOut(span(t, A.e85, A.e85 + 1.1)), sec = lerp(89, 85, slide), mx = AX(sec);
      if (mu > 0) {
        halo(ctx, mx, LY, 70, .5 * mu, LAMP.body, LAMP.core);
        ctx.fillStyle = rgba(CREAM, mu); ctx.beginPath(); ctx.moveTo(mx, LY - 10); ctx.lineTo(mx - 11, LY - 30); ctx.lineTo(mx + 11, LY - 30); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.arc(mx, LY, 7, 0, TAU); ctx.fill();
        F.label(ctx, `${Math.round(sec)} S`, mx, LY - 44, span(t, A.e85 + .2, A.e85 + .8), { size: 24 });
      }
      // the reasons on their list; AI lights (cool: the machine)
      const ru2 = span(t, A.reason, A.reason + .8), aiU = span(t, A.ai - .05, A.ai + .4);
      TXT.e11.reasons.forEach((s, k) => {
        const x = 760 + k * 230, a = span(ru2, k * .12, .5 + k * .12), isAI = s === 'AI';
        if (isAI && aiU > 0) { halo(ctx, x, 396, 120, .5 * aiU, COOL.halo, COOL.core); F.agentGlyph(ctx, t, x, 438, 13, { a: aiU, ping: .8 }); }
        F.label(ctx, s, x, 410, a, { size: isAI ? lerp(26, 32, aiU) : 26, col: isAI ? mixHex(CREAM, COOL.core, aiU) : CREAM, a: isAI ? 1 : 1 - .45 * aiU });
      });
    }
    ctx.restore();
  }

  function draw(ctx, t) {
    const v = view(t), Z = v.s;
    const doorNow = span(t, A.after + .3, A.after + 1.3);
    S.rowScene(ctx, t, T, {
      n: 11, v,
      lit: (m) => (m === 11 ? lerp(1, .22, doorNow) : m === 10 ? lerp(.6, 1, doorNow) : m > 11 ? .22 : .6),
      scale: (m) => (m === 11 ? lerp(1.06, 1, doorNow) : 1),
      beam: (m) => (m === 11 ? lerp(.8, .3, doorNow) : m === 10 ? lerp(.3, .8, doorNow) : .3),
      open: (m) => (m === 11 ? nzr(open11(t)) : m === 10 ? nzr(open10(t)) : undefined),
      inner: (m) => (m === 11 ? (c, box) => { c.fillStyle = lin(c, 0, box.y0, 0, box.y0 + box.h, [[0, P.night0], [.7, mixHex(P.night0, F.EMBER.deep, .25)], [1, P.night0]]); c.fillRect(box.x0, box.y0, box.w, box.h); c.fillStyle = rgba(CREAM, .12); c.fillRect(box.x0, box.y0 + box.h * .7, box.w, 1.5); }
        : m === 10 ? (c, box) => {
          const [x0, y0] = F.toScreen(v, box.x0, box.y0), sb = { x0, y0, w: box.w * v.s, h: box.h * v.s };
          c.setTransform(1, 0, 0, 1, 0, 0);
          B.through(c, t, sb, Z, ZE, { ...B.ZOO_FULL, s: B.ZOO_FULL.s * B.seamCreep(t, R.b) }, (cc, tt, rv) => B.zooWorld(cc, tt, rv, zooOpts));
          const pa = 1 - span(Z, 3, 12);   // the pane in the crack: cool streaks close to the door (they pass the camera first)
          if (pa > 0) { c.save(); c.beginPath(); c.rect(sb.x0, sb.y0, sb.w, sb.h); c.clip(); c.fillStyle = rgba(COOL.deep, .22 * pa); c.fillRect(sb.x0, sb.y0, sb.w, sb.h);
            c.strokeStyle = rgba(COOL.core, .22 * pa); c.lineWidth = sb.w * .25; for (let q = -1; q < 4; q++) { const xx = sb.x0 + sb.w * (q * .7 + .1 * Math.sin(t * .3)); c.beginPath(); c.moveTo(xx, sb.y0); c.lineTo(xx + sb.w * 1.2, sb.y0 + sb.h); c.stroke(); } c.restore(); }
        } : undefined),
      hud: 1,
    });
    // the explainer on the yard
    if (t > A.nomach - .2 && t < A.after + 1) F.inView(ctx, v, () => explainer(ctx, t, v));
    // labels in screen px at reference views (they ride the camera)
    B.inRef(ctx, v, VD, () => F.label(ctx, 'NO MACHINE', 960, 470, span(t, A.nomach + .3, A.nomach + .9) * (1 - span(t, A.self, A.self + .5)), { size: 28 }));
    B.inRef(ctx, v, VL, () => {
      const out = span(t, A.jan - .2, A.jan + .4);
      F.big(ctx, 'SELF-DESTRUCTION', W / 2, 190, 70, span(t, A.self + .35, A.self + 1.0) * (1 - out), { gold: 0 });
      const [bx, by] = B.refPt(VL, RING1[0], RING1[1]);
      F.label(ctx, 'BEFORE SUPERINTELLIGENCE', bx - 40, by + 100, span(t, A.before, A.before + .6) * (1 - out), { size: 24, col: CREAM2 });
    });
    B.inRef(ctx, v, VN, () => {
      const out = span(t, A.after - .5, A.after + .2);
      F.big(ctx, TXT.e11.clock, W / 2, 190, 64, span(t, A.e85 + .1, A.e85 + .8) * (1 - out), { gold: 0 });
      F.label(ctx, TXT.e11.closest, W / 2, 252, span(t, A.closest, A.closest + .6) * (1 - out), { size: 28, col: CREAM2 });
    });
    // the switch tag (the Bulletin's decision) and its mini tag to the counter
    const tg = span(t, A.jan + .15, A.jan + .7), tOut = span(t, A.after - .4, A.after + .2);
    if (tg > 0 && tOut < 1) { const [tx, ty] = [470, 330]; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.switchTag(ctx, t, tx, ty, F.END[11].tag, tg, { out: tOut }); ctx.restore(); B.tagToHud(ctx, t, T, 11, [tx, ty]); }
    F.source(ctx, t, A.jan + .5, A.after, TXT.e11.src);
  }
  const nzr = (x) => (x > .002 ? x : undefined);
  return [{ t: R.a, draw, print: F.PRINT71 }];
}
