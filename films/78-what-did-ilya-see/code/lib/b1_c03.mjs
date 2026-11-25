// Film 78 · B1 · c03 'Then it fell apart' → 'And yet, something bigger' (88.9–121.7 s). Rows 2.01–2.09 (docs/shots.md):
//   2.01 the call grid comes apart: the tiles (each with its own piece of the window) slide away from each other
//   2.02 Ilya's tile unfolds into his post (ILYA SUTSKEVER · NOV 20, 2023, no logo): "I deeply regret my participation in the board's actions."
//   2.03 the post folds back, the tiles regroup; FRI 17 → TUE 21 light cell by cell; on day five the boss tile slides back: BACK IN CHARGE
//   2.04–2.06 the grid sinks into the report LAW FIRM REVIEW · MARCH 2024 (for the new board): BREAKDOWN OF TRUST · NOT ABOUT SAFETY ·
//        THE OLD BOARD ACTED WITHIN ITS DISCRETION · CONDUCT DID NOT MANDATE REMOVAL (both sides of the finding)
//   2.07 the report lies on an empty judge's bench: WHO WAS RIGHT: — (the slot stays empty)
//   2.08 the man (plain silhouette) looks at the tiles, threads between them
//   2.09 two tiles sink into two desk monitors: an ordinary office at night, two colleagues turned away, the thread snaps; you at the next desk
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f78_kit.mjs';
import * as B from './b1_kit.mjs';
import { GRID, gridTile, TILES } from './b1_c02.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin } = E;
const { GOLD, CREAM, CREAM2, PAPER, COOL, INK, mv, land, rise } = F;
const TAU = Math.PI * 2;
const lerpR = (a, b, u) => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), w: lerp(a.w, b.w, u), h: lerp(a.h, b.h, u) });

// ---------------------------------------------------------------------------------------------- the office (2.09, the outer of c04's 3.01)
export const OFFICE = { floor: 790, wall: { x: 110, y: 80, w: 1700, h: 710 }, win: { x: 690, y: 140, w: 540, h: 304 }, A: 600, Bx: 1320, Y: 1650 };
export const MON = { A: { x: 330, y: 500, w: 190, h: 118 }, B: { x: 1400, y: 500, w: 190, h: 118 } };
export function office(ctx, t, o = {}) {
  const O = OFFICE, wu = clamp(o.wall ?? 1), fl = O.floor, Wl = O.wall, Wn = O.win;
  if (wu > 0) {   // the back wall unfolds upward from the floor line, the window in it (the night shows through)
    const hh = Wl.h * sineIO(wu), top = fl - hh;
    ctx.save(); ctx.beginPath(); ctx.rect(Wl.x, top, Wl.w, hh); ctx.clip();
    const p = new Path2D(); p.rect(Wl.x, Wl.y, Wl.w, Wl.h); p.rect(Wn.x, Wn.y, Wn.w, Wn.h);
    ctx.fillStyle = lin(ctx, 0, Wl.y, 0, fl, [[0, mixHex(P.ind1, P.blue1, .3)], [1, mixHex(P.night1, P.ind2, .8)]]); ctx.fill(p, 'evenodd');
    ctx.strokeStyle = rgba(CREAM2, .14); ctx.lineWidth = 2; for (let x = Wl.x + 170; x < Wl.x + Wl.w; x += 340) { if (x > Wn.x - 10 && x < Wn.x + Wn.w + 10) continue; ctx.beginPath(); ctx.moveTo(x, Wl.y + 40); ctx.lineTo(x, fl); ctx.stroke(); }
    // the window: frame, mullion, half-raised blinds
    ctx.strokeStyle = rgba(CREAM, .7); ctx.lineWidth = 4; ctx.strokeRect(Wn.x, Wn.y, Wn.w, Wn.h);
    ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(Wn.x + Wn.w / 2, Wn.y); ctx.lineTo(Wn.x + Wn.w / 2, Wn.y + Wn.h); ctx.stroke();
    ctx.fillStyle = rgba(CREAM2, .35); for (let i = 0; i < 5; i++) ctx.fillRect(Wn.x + 4, Wn.y + 6 + i * 9, Wn.w - 8, 4);
    ctx.fillStyle = rgba(CREAM, .5); ctx.fillRect(Wn.x - 14, Wn.y + Wn.h, Wn.w + 28, 7);   // the sill
    ctx.restore();
    // the floor
    ctx.fillStyle = lin(ctx, 0, fl, 0, fl + 300, [[0, mixHex(P.night1, P.ind1, .35)], [1, P.night0]]); ctx.fillRect(Wl.x - 400, fl, Wl.w + 800, 400 * sineIO(clamp(wu * 3)));
    F.goldSpan(ctx, [[Wl.x - 200, fl], [Wl.x + Wl.w + 200, fl]], 0, 1, { w: 1, spark: false, a: .3 * clamp(wu * 3) });
  }
  // the desks (dark slabs with a lit edge) rise with the people
  const desk = (x, w, u) => { if (u <= 0) return; const y = 640 + (1 - expoOut(u)) * 200; ctx.save(); ctx.beginPath(); ctx.rect(x - 20, 0, w + 40, fl); ctx.clip(); ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.fillRect(x, y, w, fl - y + 4); ctx.fillStyle = mixHex(P.night1, P.blue1, .5); ctx.fillRect(x - 10, y - 8, w + 20, 12); ctx.restore(); };
  const pu = clamp(o.people ?? 1), you = clamp(o.you ?? 1), brk = clamp(o.brk ?? 0);
  // the monitors (cool) on the two desks (the tiles landed there: drawn by the caller while they fly), the lamp at your desk (amber)
  if (pu > 0) for (const M of [MON.A, MON.B]) { halo(ctx, M.x + M.w / 2, M.y + M.h / 2, 330, .34 * pu, COOL.halo, COOL.core); }
  // the two colleagues, back to back (turned away from each other)
  const hA = B.figure(ctx, t, O.A, fl, 390, { u: pu, glow: .28, top: .55, topCol: COOL, fig: { dir: -1, look: .15, armR: [.6, 1.4], back: .4 } });
  const hB = B.figure(ctx, t, O.Bx, fl, 390, { u: clamp(pu * 1.1 - .05), glow: .28, top: .55, topCol: COOL, fig: { dir: 1, look: .15, armR: [.6, 1.4], back: .4 } });
  desk(250, 460, pu); desk(1210, 460, pu);
  if (o.mon !== false) for (const M of [MON.A, MON.B]) { if (pu <= 0) break; ctx.save(); ctx.globalAlpha *= clamp(pu * 2); B.tile(ctx, t, M, { kind: 'person' }); ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.fillRect(M.x + M.w / 2 - 6, M.y + M.h, 12, 30); ctx.restore(); }
  // the thread between them (shoulder to shoulder), snapping
  const tu = clamp(o.thread ?? 1);
  if (tu > 0 && pu > .5) B.thread(ctx, t, [O.A + 40, fl - 390 * .74], [O.Bx - 40, fl - 390 * .74], tu, { brk, a: .9, w: 3, sag: .05, col: GOLD.line, flicker: clamp(o.flick ?? 0) });
  // you, at the next desk, in your lamp's light
  if (you > 0) {
    B.lamp(ctx, 1700, 560, 260, you);
    B.figure(ctx, t, O.Y, fl, 300, { u: you, du: true, glow: .25, glowCol: { halo: P.coat, core: P.core1 }, fig: { dir: -1, look: .35, armR: [.5, 1.2] } });
    desk(1560, 240, you);
    ctx.fillStyle = rgba(GOLD.hot, .9 * you); ctx.beginPath(); ctx.moveTo(1690, 600); ctx.lineTo(1740, 600); ctx.lineTo(1725, 575); ctx.lineTo(1705, 575); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.fillRect(1712, 600, 6, 40);
  }
}

export default function c03({ T, G }) {
  const tEnd0 = G('Then it fell apart'), tFell = G('fell apart', 0, tEnd0);
  const tWrote = G('Ilya himself wrote'), tRegret = G('I deeply regret'), tActions = G("actions", 0, tRegret);
  const tFive = G('Five days after'), tCall = G('video call', 0, tFive), tBack = G('back in charge');
  const tLaw = G('A law firm'), tNew = G("new board", 0, tLaw), tTrust = G('breakdown of trust'), tSafety = G('Not a safety problem');
  const tNothing = G('And nothing that demanded'), tDemanded = G('demanded', 0, tNothing);
  const tCourt = G('No court has ever ruled'), tRight = G('who was right');
  const tSaw = G('So that is what Ilya saw', 0, tCourt), tWork = G('A problem you know'), tPlace = G('workplace'), tStopped = G('stopped trusting');
  const tNext = G('And yet, something bigger');
  const qReg = B.words(T.GW('I deeply regret', 'actions', tRegret - .1));
  qReg[0].w = '“' + qReg[0].w; qReg[qReg.length - 1].w = qReg[qReg.length - 1].w.replace(/[.”"]+$/, '') + '.”';

  const GC = [GRID.x + GRID.w / 2, GRID.y + GRID.h / 2];
  const GRID2 = { x: 530, y: 150, w: 860, h: 520 }, GC2 = [GRID2.x + GRID2.w / 2, GRID2.y + GRID2.h / 2];
  const PC = { x: 330, y: 270, w: 1260, h: 300 };                         // Ilya's post
  const REP = { x: 440, y: 96, w: 1040, h: 700 };                         // the law-firm report
  const BENCH = { x: 560, y: 520, w: 800, h: 280 }, GFL = 800;            // the judge's bench
  const ON_BENCH = { x: 1070, y: 408, w: 150, h: 101 };                   // the report lying on it
  const FLOAT = [[1000, 250], [1290, 200], [1580, 260], [1060, 520], [1360, 470], [1650, 540]];   // 2.08: the tiles in the air
  const TW = 230, TH = 150;

  const keys = [
    [tEnd0 + .2, { x: 990, y: 530, s: 1.03 }], [tFell + 1.4, { x: 960, y: 540, s: .98 }], [tWrote + .5, { x: 960, y: 470, s: 1.04 }],
    [tActions + .3, { x: 960, y: 450, s: 1.07 }], [tFive + 1.2, { x: 960, y: 470, s: 1.0 }], [tBack + .2, { x: 960, y: 470, s: 1.03 }],
    [tLaw + 1.1, { x: 960, y: 440, s: 1.06 }], [tDemanded + .6, { x: 960, y: 440, s: 1.1 }], [tCourt + 1.0, { x: 960, y: 520, s: 1.0 }],
    [tRight + .5, { x: 960, y: 500, s: 1.04 }], [tSaw + 1.2, { x: 1000, y: 520, s: 1.0 }], [tWork + 1.6, { x: 960, y: 470, s: 1.0 }],
    [tStopped + .5, { x: 960, y: 470, s: 1.03 }], [tNext, { x: 960, y: 480, s: 1.022 }],
  ];

  // tile i: where it is at t (the grid at the end of c02 → apart → (Ilya: the post) → regrouped → the report's corner → the air → monitors)
  const spread = (t) => mv(t, tEnd0 + .05, 1.9) + .55 * mv(t, tWrote - .3, 1.6) - 1.55 * mv(t, tFive - .2, 1.9);
  const shift = (t) => mv(t, tFive - .2, 1.9);
  function tileAt(t, i) {
    const r0 = gridTile(GRID, i), r2 = gridTile(GRID2, i), sh = shift(t), sp = spread(t);
    const c0 = [lerp(GC[0], GC2[0], sh), lerp(GC[1], GC2[1], sh)], base = lerpR(r0, r2, sh), bc = [base.x + base.w / 2, base.y + base.h / 2];
    const k = 1 + .75 * sp, cx = c0[0] + (bc[0] - c0[0]) * k, cy = c0[1] + (bc[1] - c0[1]) * k + (i < 3 ? -1 : 1) * 30 * sp;
    return { x: cx - base.w / 2, y: cy - base.h / 2, w: base.w, h: base.h, rot: (i - 2.5) * .035 * sp };
  }

  const draw = (ctx, t, cam) => {
    if (t < tEnd0 || t >= tNext) return;
    const intoRep = mv(t, tLaw - .1, 1.7);                                  // 2.04: the grid shrinks into the report's corner
    const repOut = mv(t, tCourt - .2, 1.6);                                 // 2.07: the report goes onto the bench
    const rIn = mv(t, tLaw - .25, 1.5), bIn = mv(t, tCourt - .3, 1.5), bOut = mv(t, tSaw - .2, 1.2);
    const repRect = (t) => { const R = repOut > 0 ? lerpR(REP, ON_BENCH, repOut) : { ...REP, y: REP.y + (1 - rIn) * 1100 }; return { ...R, y: R.y + (1 - bIn) * 600 * repOut + 700 * bOut }; };
    // ============================================================== 2.07 · the empty bench: WHO WAS RIGHT: —
    if (bIn > 0 && bOut < 1) {
      const dy = (1 - bIn) * 600 + 700 * bOut;
      B.ground(ctx, GFL, bIn * (1 - bOut));
      ctx.save(); ctx.beginPath(); ctx.rect(0, -400, W, GFL + 400); ctx.clip(); ctx.translate(0, dy);
      B.topLight(ctx, 960, BENCH.y + 10, 260, .9, { hot: CREAM, halo: CREAM2, core: CREAM }, 1.6);
      // the empty chair behind it
      ctx.fillStyle = mixHex(P.night1, GOLD.deep, .25); ctx.beginPath(); ctx.roundRect(880, 300, 160, 240, [30, 30, 6, 6]); ctx.fill();
      ctx.strokeStyle = rgba(GOLD.line, .55); ctx.lineWidth = 2; ctx.stroke();
      // the bench: a raised panelled front with a ledge
      ctx.fillStyle = mixHex(P.night0, GOLD.deep, .28); ctx.fillRect(BENCH.x, BENCH.y, BENCH.w, BENCH.h);
      ctx.fillStyle = mixHex(P.night1, GOLD.shade, .35); ctx.fillRect(BENCH.x - 30, BENCH.y - 14, BENCH.w + 60, 22);
      ctx.strokeStyle = rgba(GOLD.line, .4); ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) ctx.strokeRect(BENCH.x + 40 + i * 250, BENCH.y + 50, 220, BENCH.h - 90);
      ctx.restore();
      const vu = span(t, tRight - .35, tRight + .3) * (1 - expoIn(bOut));
      const v = B.caps(ctx, 'WHO WAS RIGHT:', 880, 200, 44, vu, { align: 'center' });
      if (vu > 0 && v) {   // the answer slot: an empty dash that blinks like a cursor, never filled
        const bl = .55 + .45 * Math.sin(t * 5.5); ctx.fillStyle = rgba(CREAM, bl * rise(span(vu, .4, 1))); ctx.fillRect(v.x0 + v.w + 30, 186, 90, 5);
      }
    }
    // ============================================================== 2.04–2.06 · the report (both sides of the finding)
    if (rIn > 0 && bOut < 1) {
      const R = repRect(t), s = R.w / REP.w;
      ctx.save(); ctx.translate(R.x, R.y); ctx.scale(s, s); ctx.rotate(-.01 - .05 * repOut);
      ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(12, 16, REP.w, REP.h);
      ctx.fillStyle = lin(ctx, 0, 0, REP.w, REP.h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(0, 0, REP.w, REP.h);
      ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.strokeRect(0, 0, REP.w, REP.h);
      ctx.fillStyle = mixHex(PAPER.ink, GOLD.deep, .3); ctx.fillRect(0, 0, 14, REP.h);
      B.caps(ctx, 'LAW FIRM REVIEW · MARCH 2024', 60, 92, 31, span(t, tLaw, tLaw + .7), { col: PAPER.ink });
      B.caps(ctx, 'FOR THE NEW BOARD', 60, 136, 24, span(t, tNew - .2, tNew + .5), { col: PAPER.faint });
      ctx.fillStyle = rgba(PAPER.edge, .9); ctx.fillRect(60, 170, (REP.w - 120) * sineIO(span(t, tLaw + .2, tLaw + 1.2)), 2);
      const L = F.SOURCES.lawFirm, at = [tTrust - .25, tSafety - .05, tSafety + .75, tDemanded - .15];
      L.forEach((txt, i) => {
        const u = span(t, at[i], at[i] + .7), y = 280 + i * 104; if (u <= 0) return;
        B.tick(ctx, 92, y - 12, 34, span(u, 0, .6), { col: { halo: GOLD.halo, body: GOLD.deep, core: GOLD.mid } });
        B.caps(ctx, txt, 140, y, i === 2 ? 30 : 36, u, { col: PAPER.ink, spacing: .06 });
      });
      ctx.restore();
    }
    // ============================================================== 2.01–2.03 · the grid apart, the post, regrouped, BACK IN CHARGE
    const postU = mv(t, tWrote - .25, 1.5) * (1 - mv(t, tFive - .45, 1.3));
    const back = mv(t, tBack - .55, 1.0);
    if (bOut < 1) {
      const RR = repRect(t), rs = RR.w / REP.w, CORNER = { x: RR.x + (REP.w - 280) * rs, y: RR.y + 40 * rs, w: 240 * rs, h: 146 * rs }, sc = CORNER.w / GRID2.w;
      const toCorner = (r) => intoRep <= 0 ? r : lerpR(r, { x: CORNER.x + (r.x - GRID2.x) * sc, y: CORNER.y + (r.y - GRID2.y) * sc, w: r.w * sc, h: r.h * sc }, intoRep);
      // the window chrome: the date strip travels with the top row; at the end it is whole again
      const chrome = (() => { const a = tileAt(t, 0), c = tileAt(t, 2); return toCorner({ x: a.x - 12, y: a.y - 60, w: c.x + c.w - a.x + 24, h: 48 }); })();
      const sp = spread(t);
      if (sp < .2 && intoRep <= 0) { ctx.save(); ctx.globalAlpha *= 1 - span(sp, 0, .12); const a = tileAt(t, 0), c = tileAt(t, 5); B.callFrame(ctx, { x: a.x - 12, y: a.y - 60, w: c.x + c.w - a.x + 24, h: c.y + c.h - a.y + 72 }, null); ctx.restore(); }
      // each tile with its own piece of the window behind it
      for (let i = 0; i < 6; i++) {
        const r = toCorner(tileAt(t, i)), rot = tileAt(t, i).rot * (1 - intoRep), pad = 12 * r.w / 272;
        if (i === 1 && postU > 0) continue;   // Ilya's tile is the post now (drawn below)
        ctx.save(); ctx.translate(r.x + r.w / 2, r.y + r.h / 2); ctx.rotate(rot); ctx.translate(-r.x - r.w / 2, -r.y - r.h / 2);
        ctx.fillStyle = mixHex(P.night0, P.ind1, .35); ctx.beginPath(); ctx.roundRect(r.x - pad, r.y - pad, r.w + pad * 2, r.h + pad * 2, 8 * r.w / 272); ctx.fill();
        ctx.strokeStyle = rgba(COOL.line, .4 * clamp(sp * 3)); ctx.lineWidth = 1.5; ctx.stroke();
        if (i === 3) {   // the boss slot: empty (FIRED) until he slides back in on day five
          ctx.strokeStyle = rgba(CREAM2, .45); ctx.lineWidth = 1.5; ctx.setLineDash([8, 8]); ctx.strokeRect(r.x, r.y, r.w, r.h); ctx.setLineDash([]);
          if (back < 1) B.caps(ctx, 'FIRED', r.x + r.w / 2, r.y + r.h * .58, 30 * r.w / 272, 1 - span(back, 0, .4), { align: 'center', col: CREAM2 });
          if (back > 0) { ctx.save(); ctx.beginPath(); ctx.rect(r.x - 4, r.y - 4, r.w + 8, r.h + 8); ctx.clip(); B.tile(ctx, t, { ...r, x: r.x + (1 - back) * r.w * 1.1 }, { kind: 'boss', label: 'THE BOSS', sub: 'HEAD OF OPENAI' }); ctx.restore(); }
        } else B.tile(ctx, t, r, { kind: TILES[i].kind, label: r.w > 150 ? TILES[i].label : null, sub: TILES[i].sub });
        ctx.restore();
      }
      // the chrome strip with the date (it was the window's top)
      ctx.save(); ctx.fillStyle = mixHex(P.night0, P.ind1, .35); ctx.beginPath(); ctx.roundRect(chrome.x, chrome.y, chrome.w, chrome.h, 10 * chrome.w / 860); ctx.fill();
      if (chrome.w > 300) F.goldText(ctx, [[F.SOURCES.call, .6]], chrome.x + chrome.w / 2, chrome.y + chrome.h * .7, 22 * (intoRep > 0 ? lerp(1, sc, intoRep) : 1), 1, { serif: false, weight: 700, spacing: .1, align: 'center' });
      ctx.restore();
      // Ilya's post: his tile becomes the avatar, the card grows out from behind it
      if (postU > 0) {
        const r = tileAt(t, 1), AV = { x: PC.x + 40, y: PC.y + 36, w: 120, h: 92 }, av = lerpR(r, AV, postU), pc = lerpR(r, PC, postU);
        ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.roundRect(pc.x + 10, pc.y + 14, pc.w, pc.h, 16); ctx.fill();
        ctx.fillStyle = mixHex(P.night1, P.ind1, .65); ctx.beginPath(); ctx.roundRect(pc.x, pc.y, pc.w, pc.h, 16); ctx.fill();
        ctx.strokeStyle = rgba(COOL.line, .7); ctx.lineWidth = 2; ctx.stroke();
        B.tile(ctx, t, av, { kind: 'ilya' });
        const tu = span(postU, .6, 1);
        if (tu > 0) {
          B.caps(ctx, 'ILYA SUTSKEVER', PC.x + 190, PC.y + 72, 30, tu, { g: .6 });
          B.caps(ctx, 'POST · NOV 20, 2023', PC.x + 190, PC.y + 112, 22, span(tu, .2, 1), { col: CREAM2 });
          B.spokenQuote(ctx, t, qReg, PC.x + 50, PC.y + 215, 56, span(t, tRegret - .5, tRegret + .3) * span(postU, .8, 1), { maxW: PC.w - 100 });
        }
      }
      // FRI 17 → TUE 21 (2.03) under the regrouped grid; BACK IN CHARGE
      const dIn = mv(t, tFive - .3, 1.0), dOut = mv(t, tLaw - .3, 1.2);
      if (dIn > 0 && dOut < 1) {
        const days = ['FRI 17', 'SAT 18', 'SUN 19', 'MON 20', 'TUE 21'], cw = 150, x0 = 960 - cw * 2.5, y = 720 + (1 - expoOut(dIn)) * 160 + 400 * expoIn(dOut);
        days.forEach((d, i) => {
          const lit = span(t, tFive + .1 + i * .36, tFive + .35 + i * .36);
          ctx.fillStyle = mixHex(mixHex(P.night1, P.ind1, .6), GOLD.body, lit * .8); ctx.beginPath(); ctx.roundRect(x0 + i * cw + 6, y, cw - 12, 56, 8); ctx.fill();
          ctx.strokeStyle = rgba(lit > 0 ? GOLD.line : CREAM2, .7); ctx.lineWidth = 1.5; ctx.stroke();
          E.glowText(ctx, d, x0 + i * cw + cw / 2, y + 37, { size: 22, weight: 700, spacing: .08, align: 'center', col: lit > .5 ? GOLD.deep : CREAM, glow: false });
        });
        B.caps(ctx, 'FIVE DAYS', 960, y + 100, 26, span(t, tFive, tFive + .6) * (1 - expoIn(dOut)), { align: 'center', col: CREAM2 });
      }
      if (back > 0 && intoRep < 1) { const r = tileAt(t, 3); B.caps(ctx, 'BACK IN CHARGE', r.x - 40, r.y + r.h / 2 + 12, 32, span(t, tBack - .1, tBack + .5) * (1 - span(intoRep, 0, .2)), { align: 'right', g: 1 }); }
    }
    // ============================================================== 2.08 · the man looks at the tiles, threads between them
    const fIn = mv(t, tSaw + .2, 1.5), toMon = mv(t, tWork - .15, 1.9);
    const offU = mv(t, tWork + .3, 1.8);                                  // 2.09: the office unfolds
    if (fIn > 0) {
      const R = (i) => { const [x, y] = FLOAT[i], u = clamp(fIn * 1.3 - i * .06); return { x: x - TW / 2, y: y - TH / 2 + (1 - expoOut(u)) * 600 + E.drift(t, 6, i), w: TW, h: TH, u }; };
      const tgt = (i) => (i === 1 ? MON.A : i === 4 ? MON.B : null);
      const rect = (i) => { const r = R(i), m = tgt(i); if (m) return lerpR(r, m, toMon); const out = (i < 3 ? -1 : 1) * 0 + 1; const c = [r.x + r.w / 2, r.y + r.h / 2], d0 = [c[0] - 1250, c[1] - 380], dl = Math.hypot(d0[0], d0[1]) || 1, k = 1700 * expoIn(toMon); return { ...r, x: r.x + d0[0] / dl * k, y: r.y + d0[1] / dl * k }; };
      // the threads between neighbours
      if (toMon < 1) {
        const pairs = [[0, 1], [1, 2], [3, 4], [4, 5], [0, 3], [1, 4], [2, 5]];
        for (const [a, b] of pairs) { if (a === 1 && b === 4) continue; const ra = rect(a), rb = rect(b); const u = span(fIn, .5 + a * .04, 1) * (1 - span(toMon, 0, .4)); B.thread(ctx, t, [ra.x + ra.w / 2, ra.y + ra.h / 2], [rb.x + rb.w / 2, rb.y + rb.h / 2], u, { a: .6, w: 2, sag: .06 }); }
      }
      // the man (a plain silhouette, gold rim): rises left, looks up at them; sinks when the office comes
      const mu = clamp(fIn * 1.2), ms = expoIn(clamp(toMon * 1.3));
      if (ms < 1) { B.ground(ctx, 860, fIn * (1 - toMon)); B.figure(ctx, t, 430, 860, 440, { u: mu, sink: ms, top: .8, glow: .25, glowCol: GOLD, fig: { dir: 1, look: .7, long: true, rim: GOLD.line, back: .3 } }); }
      // the office (2.09) unfolds behind; the two linked tiles become the colleagues' monitors
      const people = mv(t, tWork + .9, 1.5), you = mv(t, tPlace - .2, 1.4);
      if (toMon > 0) office(ctx, t, { wall: offU, people, you, mon: toMon >= 1, thread: 0 });
      for (let i = 0; i < 6; i++) { const r = rect(i); if (r.y > 1400 || r.x < -800 || r.x > 2700) continue; if (tgt(i) && toMon >= 1) continue; B.tile(ctx, t, r, { kind: i === 1 || i === 4 ? 'person' : TILES[i].kind === 'boss' ? 'boss' : TILES[i].kind }); }
      // the thread between the two linked tiles stays: it becomes the thread between the colleagues' shoulders, then snaps
      const ra = rect(1), rb = rect(4), sA = [OFFICE.A + 40, OFFICE.floor - 390 * .74], sB = [OFFICE.Bx - 40, OFFICE.floor - 390 * .74], k = sineIO(span(t, tWork + .6, tWork + 2.4));
      const brk = mv(t, tStopped - .05, .5), flick = span(t, tStopped - .8, tStopped - .1) * (1 - brk);
      B.thread(ctx, t, [lerp(ra.x + ra.w / 2, sA[0], k), lerp(ra.y + ra.h / 2, sA[1], k)], [lerp(rb.x + rb.w / 2, sB[0], k), lerp(rb.y + rb.h / 2, sB[1], k)], fIn, { brk, flicker: flick, a: .9, w: 3, sag: .05, col: GOLD.line });
    }
  };
  return { keys, draw };
}
