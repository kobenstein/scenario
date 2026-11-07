// c05 · For sale ($35,000 · a few hundred $ a week) · Doom in a week · "doesn't know" · why a rack?
// T.G("It didn't stay in the lab") → T.G('It comes down to a number') · builder B1. Plan: docs/shots.md 5.01–5.04 · B1 module lib/f19_b1_world.mjs
// ONE entry, ONE camera: the dish field (2D) → a ring of light runs out of the dish rim: THE BOX (the product) → the aisle lights up
// around it (the box on a plinth, 3D) → an arc to the screen in the aisle (bars, the game, the quote) → pull back onto
// RACK_PLATE_CAM while the box flies into drawer 11 and the drawer slides shut (= plateRack).
//
// | ID   | anchor (word)                                   | picture (one idea)                                                     | 1–2 moves         |
// |------|-------------------------------------------------|------------------------------------------------------------------------|-------------------|
// | 5.01 | became a product · thirty-five thousand · rent one · a few hundred | the dish pulls back into THE BOX; a price tag drops down its string: $35,000; a cloud draws itself: A FEW HUNDRED $ / WEEK (never an exact weekly figure) | tag · cloud |
// | 5.02 | that game from the start? · Doom · about a week · year and a half | the aisle lights up round the box on its plinth; arc to the screen: DOOM · ABOUT A WEEK (a stub) vs PONG · 1½ YEARS (a long bar) | arc · bars |
// | 5.03 | turn, find enemies, shoot · die a lot · "doesn't actually know" | in the screen: the view turns, finds, shoots, falls; then the quote (Alon Loeffler, Cortical Labs) | game · quote |
// | 5.04 | Pong to Doom · four years · server rack           | PONG → DOOM · 4 YEARS; pull back: the box flies into drawer 11, the drawer shuts (ladder: WHY A DATA CENTER?) | pull back · box in |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f19_kit.mjs';
import * as B from '../lib/f19_b1_world.mjs';
import { plateRack, RACK_PLATE_CAM, RACK_PLATE, SEAM_HALF } from '../lib/f19_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, halo } = E;
const { cam, view, proj, bill, quad, COOL, NET, bump } = F;
const TAU = Math.PI * 2;

export const PRINT = F.PRINT19;

export default async (T, R) => {
  E.prepareEditorial();
  const a = B.anchors(T);
  a.T0 = R.a; a.end = R.b;
  return [{ t: R.a, draw: scene(a, T), print: PRINT }];
};

// ---- the set: the box on a plinth (front-left) and the screen (front-right), both far enough forward to leave RACK_PLATE_CAM's frame
const PLINTH = { X: -1500, Z: -2600, top: 900, bw: 560 };
const MON2 = { X: 1600, Y: 1240, Z: -2600, w: 760 };
const C_BOXF = cam({ tx: PLINTH.X, ty: PLINTH.top + PLINTH.bw * .62 / 2, tz: PLINTH.Z, d: 1500 * PLINTH.bw / 720, p: 0 });
const C_MON2 = cam({ tx: MON2.X, ty: MON2.Y, tz: MON2.Z, d: 1500 * MON2.w / F.CLIP_RECT.w, p: 0, f: 1500, oy: F.CLIP_RECT.y + F.CLIP_RECT.h / 2 - H / 2 });
// the 2D camera that shows the field's box exactly where C_BOXF shows the plinth box (the switch 2D → 3D is invisible)
const C_BOX2 = (() => {
  const p = proj(view(C_BOXF), PLINTH.X, PLINTH.top, PLINTH.Z), wS = PLINTH.bw * p[2];
  const g0 = B.boxFromWindow(F.fieldMap(960, 540, 470)), z = wS / g0.w;
  return B.cam2(g0.x - (p[0] - 960) / z, g0.y - (p[1] - 540) / z, z);
})();
const PANEL = { w: 2 * (F.RACK.hw - 26), h: F.RACK.dh, col: mixHex(P.night1, P.ind1, .5) };
const NET_W = { lit: 1, ambient: 1, w: 1 };

function scene(a, T) {
  const T1 = a.end, tPlate = T1 - SEAM_HALF;
  const t3 = a.gameQ;                                                  // 2D → 3D (the aisle lights up round the box)
  const tMon = a.doom - .15;                                           // the screen sits on CLIP_RECT
  const tBack0 = a.why + .15, tBack1 = tPlate - .1;                    // pull back onto RACK_PLATE_CAM
  const tFly0 = a.why + .55, tFly1 = a.rack + .7, tShut = tPlate - .2;  // the box flies into drawer 11, the drawer shuts
  const K2 = [[a.T0, B.CANON], [a.T0 + .25, B.CANON], [a.product - .1, C_BOX2]];
  const cam2 = (t) => B.cam2Drift(B.cam2At(t, K2), t, .5 * (1 - smooth(span(t, t3 - 1.2, t3 - .2))));

  return (ctx, t) => {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (t < t3) field(ctx, t, cam2(t)); else world(ctx, t);
    if (t >= tPlate) plateRack(ctx, t);
    ctx.restore();
    F.ladder(ctx, t, T);
  };

  // ------------------------------------------------------------------------------------------------ 2D: the dish → the box
  function field(ctx, t, c) {
    const m = B.mapOf(c), g = B.boxFromWindow(m), cover = B.boxCover(g);
    const iris = 1 + (cover - 1) * sineIO(span(t, a.T0 + .35, a.product + .2));
    B.night(ctx);
    if (iris > 1) halo(ctx, g.x, g.y + g.h * .05, g.w * 1.15, .2 * smooth(span(t, a.product - .3, a.product + 1)), P.halo1, P.core1);   // product light under it
    B.box(ctx, t, g, { iris, pump: .7, status: bump(t, a.product - .1, 1.2) });
    F.dish(ctx, t, m, { ...B.FIELD_DISH, net: NET_W });
    B.boxFront(ctx, t, g, { iris });
    tags(ctx, t, g);
  }
  // the price tag ($35,000) drops down its string from the box's top-right corner; the cloud (rent over the internet) draws itself
  function tags(ctx, t, g) {
    const out = sineIO(span(t, a.gameQ - .7, a.gameQ - .05));
    // string + tag
    const st = sineIO(span(t, a.thirty - .45, a.thirty)) * (1 - out);
    if (st > 0) {
      const ax = g.x + g.w / 2 - 24, ay = g.y - g.h + 14, bx = ax + 150, by = ay + 150;
      const dropU = expoOut(span(t, a.thirty - .1, a.thirty + .45)) * (1 - out);
      const sw = .22 * Math.exp(-2.2 * Math.max(0, t - a.thirty - .3)) * Math.sin((t - a.thirty) * 5.5) + .015 * Math.sin(t * 1.3);
      ctx.save(); ctx.strokeStyle = rgba(P.halo1, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(lerp(ax, bx, st), lerp(ay, by, st)); ctx.stroke(); ctx.restore();
      halo(ctx, ax, ay, 18, .5 * st, P.halo0, P.core0);
      if (dropU > 0) {
        const x = lerp(ax, bx, dropU), y = lerp(ay, by, dropU);
        ctx.save(); ctx.translate(x, y); ctx.rotate(-.5 + sw + .5 * dropU); ctx.scale(lerp(.3, 1, dropU), lerp(.3, 1, dropU));
        const tg = new Path2D(); tg.moveTo(0, 0); tg.lineTo(40, -40); tg.lineTo(300, -40); tg.lineTo(300, 40); tg.lineTo(40, 40); tg.closePath();
        E.glowFill(ctx, tg, 16, .35, P.halo0);
        ctx.fillStyle = E.lin(ctx, 0, -40, 0, 40, [[0, P.core1], [1, P.halo0]]); ctx.fill(tg);
        ctx.fillStyle = P.night1; ctx.beginPath(); ctx.arc(26, 0, 7, 0, TAU); ctx.fill();
        E.glowText(ctx, '$35,000', 172, 20, { size: 58, serif: true, align: 'center', col: P.night1, glow: false });
        ctx.restore();
      }
    }
    // the cloud: rent one over the internet, A FEW HUNDRED $ / WEEK
    const cu = sineIO(span(t, a.rent - .2, a.rent + .9)) * (1 - out);
    if (cu > 0) {
      const cx = 560, cy = 190, pts = cloudPts(cx, cy, 300, 120);
      const n = Math.max(2, Math.floor(pts.length * cu));
      ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.beginPath(); for (let k = 0; k < n; k++) k ? ctx.lineTo(pts[k][0], pts[k][1]) : ctx.moveTo(pts[k][0], pts[k][1]);
      if (cu >= 1) ctx.closePath();
      ctx.fillStyle = rgba(COOL.deep, .3 * cu); if (cu >= 1) ctx.fill();
      ctx.strokeStyle = rgba(COOL.edge, .35); ctx.lineWidth = 8; ctx.stroke(); ctx.strokeStyle = rgba(COOL.mid, .95); ctx.lineWidth = 2.6; ctx.stroke();
      ctx.restore();
      if (cu < 1) halo(ctx, pts[n - 1][0], pts[n - 1][1], 22, .7, COOL.edge, COOL.core);
      // the link cloud → box (dashed, cool)
      const lk = sineIO(span(t, a.rent + .3, a.rent + 1.0)) * (1 - out);
      if (lk > 0) { const x0 = cx + 200, y0 = cy + 56, x1 = g.x - g.w * .3, y1 = g.y - g.h - 6; ctx.save(); ctx.setLineDash([8, 10]); ctx.strokeStyle = rgba(COOL.mid, .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(lerp(x0, x1, lk), lerp(y0, y1, lk)); ctx.stroke(); ctx.restore(); }
      const wu = F.rise(span(t, a.few - .15, a.few + .6)) * (1 - expoIn(out));
      B.word(ctx, 'A FEW HUNDRED $ / WEEK', cx, cy + 34, 30, wu, { align: 'center' });
    }
  }

  // ------------------------------------------------------------------------------------------------ 3D: the aisle
  function camera(t) {
    if (t < tMon) { const u = span(t, t3, tMon), e = sineIO(u), A = C_BOXF, Bc = C_MON2, o = {};
      for (const k of ['tx', 'ty', 'tz', 'p', 'f', 'ox', 'oy']) o[k] = lerp(A[k] ?? 0, Bc[k] ?? 0, k === 'oy' ? sineIO(clamp((u - .5) / .5)) : e);
      o.d = Math.exp(lerp(Math.log(A.d), Math.log(Bc.d), e) + 1.15 * Math.sin(Math.PI * e)); return o; }
    if (t < tBack0) return C_MON2;
    const u = sineIO(span(t, tBack0, tBack1)), A = C_MON2, Bc = RACK_PLATE_CAM, o = {};
    for (const k of ['tx', 'ty', 'tz', 'p', 'f', 'ox', 'oy']) o[k] = lerp(A[k] ?? 0, Bc[k] ?? 0, u);
    o.d = Math.exp(lerp(Math.log(A.d), Math.log(Bc.d), u)); return o;
  }
  function world(ctx, t) {
    const amt = smooth(span(t, t3, t3 + 1.6)) * (1 - smooth(span(t, tMon - 1.2, tMon))) * .35 + .06 * smooth(span(t, tMon, tMon + 1)) * (1 - smooth(span(t, tBack0, tBack0 + .5)))
      + .3 * smooth(span(t, tBack0, tBack0 + 1.2)) * (1 - smooth(span(t, tBack1 - 1.4, tBack1 - .1)));
    const c = F.camDrift(camera(t), t, amt), v = view(c);
    const dark = 1 - smooth(span(t, t3 + .15, t3 + 2.3));
    const slide = 1 - sineIO(span(t, tFly1, tShut));
    const fin = smooth(span(t, tBack0, tBack1));
    F.hall(ctx, v, t, { pool: lerp(1, .25, fin) * (slide > 0 ? 1 : 1) });
    F.rack(ctx, v, t, { open: F.OPEN, slide, glow: lerp(.9, RACK_PLATE.glow, fin), net: NET_W, dishO: { glow: .9, chip: 1, electrodes: .6, rim: 1 }, seam: 1 });
    plinth(ctx, v);
    screen(ctx, t, v);
    if (dark > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = dark; B.night(ctx); ctx.restore(); }
    theBox(ctx, t, v, slide);
  }
  function plinth(ctx, v) {
    const { X, Z, top } = PLINTH;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    quad(ctx, v, [[X - 330, 2, Z - 180], [X + 330, 2, Z - 180], [X + 330, 2, Z + 260], [X - 330, 2, Z + 260]], mixHex(P.night1, P.ind2, .4));
    const f = quad(ctx, v, [[X - 300, 0, Z - 120], [X + 300, 0, Z - 120], [X + 300, top, Z - 120], [X - 300, top, Z - 120]]);
    if (f) { ctx.fillStyle = E.lin(ctx, f[0][0], 0, f[1][0], 0, [[0, P.night1], [.5, mixHex(P.night1, P.ind2, .7)], [1, P.night0]]); ctx.fill(); ctx.strokeStyle = rgba(P.blue0, .6); ctx.lineWidth = 2; ctx.stroke(); }
    quad(ctx, v, [[X - 300, top, Z - 120], [X + 300, top, Z - 120], [X + 300, top, Z + 200], [X - 300, top, Z + 200]], mixHex(P.ind2, P.blue1, .35));
    ctx.restore();
  }
  // the box: on its plinth (same drawing as the field's box), later flying into drawer 11 and squashing into its front panel
  function theBox(ctx, t, v, slide) {
    const fly = span(t, tFly0, tFly1);
    if (slide <= 0) return;
    const e = sineIO(fly), sq = sineIO(span(fly, .5, 1));
    const zf = -F.RACK.tray * slide - 4;
    const X = lerp(PLINTH.X, 0, e), Y = lerp(PLINTH.top, F.drawerY(F.OPEN), e) + 420 * Math.sin(Math.PI * e), Z = lerp(PLINTH.Z, zf, e);
    const p = proj(v, X, Y, Z); if (!p) return;
    const wW = lerp(PLINTH.bw, PANEL.w, sq), hW = lerp(PLINTH.bw * .62, PANEL.h, sq), s = p[2];
    const wS = wW * s, hS = hW * s;
    if (e < 1) halo(ctx, p[0], p[1] - hS * .45, wS * 1.15, .2 * (1 - e), P.halo1, P.core1);   // the product light (as on the field)
    if (t >= tFly1) {                                                   // it IS the drawer's front panel now (it slides in with it)
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      quad(ctx, v, [[-PANEL.w / 2, F.drawerY(F.OPEN), zf], [PANEL.w / 2, F.drawerY(F.OPEN), zf], [PANEL.w / 2, F.drawerY(F.OPEN) + PANEL.h, zf], [-PANEL.w / 2, F.drawerY(F.OPEN) + PANEL.h, zf]], PANEL.col);
      ctx.restore(); return;
    }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(p[0], p[1]); ctx.scale(1, hS / (wS * .62)); ctx.translate(-p[0], -p[1]);
    const g = B.boxGeo(p[0], p[1], wS);
    B.box(ctx, t, g, { pump: .7 });
    F.dish(ctx, t, F.fieldMap(g.wx, g.wy, g.wr * .92), { ...B.FIELD_DISH, net: NET_W });
    B.boxFront(ctx, t, g, {});
    if (sq > 0) { ctx.fillStyle = rgba(PANEL.col, sq); ctx.fillRect(g.x - g.w / 2, g.y - g.h, g.w, g.h); }
    ctx.restore();
  }
  // the screen in the aisle: powers on as the camera arrives; bars (a week vs 1½ years), the game, the quote, PONG → DOOM
  function screen(ctx, t, v) {
    const r = F.monitor(ctx, v, t, MON2.X, MON2.Y, MON2.Z, MON2.w);
    if (!r || r[2] < 8) return;
    const on = smooth(span(t, tMon - 1.6, tMon - 1.1)) * (1 + .25 * bump(t, tMon - 1.65, .2)) * (1 - smooth(span(t, a.why - .1, a.why + .5)));
    if (on <= 0) return;
    const [rx, ry, rw, rh] = r, k = rw / F.CLIP_RECT.w;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(rx, ry, rw, rh); ctx.clip();
    ctx.fillStyle = E.rad(ctx, rx + rw * .5, ry + rh * .45, rw * .8, [[0, rgba(COOL.deep, .85 * Math.min(1, on))], [1, rgba(P.night0, 0)]]); ctx.fillRect(rx, ry, rw, rh);
    const X = (u) => rx + rw * u, Y = (u) => ry + rh * u;
    // the controller (the game from the start)
    const gu = expoOut(span(t, tMon - 1.2, tMon - .3)) * (1 - expoIn(span(t, a.turn - .6, a.turn - .1)));
    if (gu > 0) F.glyph(ctx, 'controller', X(.5), Y(.24) + (1 - gu) * rh * .3, 120 * k, { a: Math.min(1, gu * 1.5) });
    // the bars: DOOM · ABOUT A WEEK (a stub) vs PONG · 1½ YEARS (78 times longer)
    const sinkB = span(t, a.turn - .5, a.turn);
    const row = (lab, yv, t0, tb, len, txt, tt) => {
      const u = F.rise(span(t, t0 - .15, t0 + .55)) * (1 - expoIn(sinkB));
      if (u > 0) F.maskLine(ctx, [[lab, 0]], X(.08), Y(yv) + 18 * k, 64 * k, u, {});
      const bu = expoOut(span(t, tb, tb + 1.4)) * (1 - expoIn(sinkB)), x0 = X(.25), L = rw * .48 * len * bu, y = Y(yv);
      if (bu > 0) { ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(P.halo0, .4); ctx.lineWidth = 34 * k; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + Math.max(2, L), y); ctx.stroke(); ctx.strokeStyle = P.core1; ctx.lineWidth = 18 * k; ctx.stroke(); ctx.restore(); halo(ctx, x0 + L, y, 40 * k, .5 * bu, P.halo0, P.core0); }
      const tu = F.rise(span(t, tt - .15, tt + .55)) * (1 - expoIn(sinkB));
      if (tu > 0) B.word(ctx, txt, x0 + Math.max(L, 0) + 34 * k, y + 11 * k, Math.round(28 * k), tu, { col: P.halo2 });
    };
    row('DOOM', .5, a.doom, a.week - .1, 1 / 78, 'ABOUT A WEEK', a.week);
    row('PONG', .72, a.pongW, a.setting + .2, 1, '1½ YEARS', a.yearHalf);
    game(ctx, t, X, Y, rw, rh, k);
    // the quote (Alon Loeffler, Cortical Labs): attribution first (on "scientists"), then the words
    const qt1 = a.still + .2;                                         // gone before "Pong" rises
    const au = F.rise(span(t, a.scientists - .1, a.scientists + .7)) * (1 - expoIn(span(t, qt1 + .1, qt1 + .6)));
    B.word(ctx, 'ALON LOEFFLER · CORTICAL LABS', X(.5), Y(.8), Math.round(26 * k), au, { align: 'center', col: P.halo2 });
    if (t > a.quote - .3 && t < qt1 + 1) F.quote(ctx, t, { text: "The system doesn't actually know it's playing Doom.", x: X(.5), y: Y(.4), size: 66 * k, w: 1000 * k, align: 'center', t0: a.quote, t1: qt1, gold: [["doesn't actually know", a.quote + .55]] });
    // PONG → DOOM · 4 YEARS
    const pu = F.rise(span(t, a.pong2 - .15, a.pong2 + .6)) * (1 - expoIn(span(t, a.why - .1, a.why + .4)));
    if (pu > 0) {                                                        // Pong ─→ Doom (the serif has no arrow glyph: the arrow is a drawn line)
      const sz = 104 * k, wP = F.measure('Pong', sz), wD = F.measure('Doom', sz), gap = 150 * k, x0 = X(.5) - (wP + gap + wD) / 2;
      F.maskLine(ctx, [['Pong', 0]], x0, Y(.5), sz, pu, {});
      F.maskLine(ctx, [['Doom', 1]], x0 + wP + gap, Y(.5), sz, F.rise(span(t, a.pong2 + .35, a.pong2 + 1.0)) * (1 - expoIn(span(t, a.why - .1, a.why + .4))), {});
      const au = sineIO(span(t, a.pong2 + .05, a.pong2 + .7)) * (1 - expoIn(span(t, a.why - .1, a.why + .4))), ay = Y(.5) - sz * .3, ax0 = x0 + wP + 28 * k, ax1 = ax0 + (gap - 56 * k) * au;
      if (au > 0) { ctx.save(); ctx.strokeStyle = rgba(P.halo0, .95); ctx.lineWidth = 5 * k; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(ax0, ay); ctx.lineTo(ax1, ay); ctx.moveTo(ax1 - 18 * k * au, ay - 14 * k * au); ctx.lineTo(ax1, ay); ctx.lineTo(ax1 - 18 * k * au, ay + 14 * k * au); ctx.stroke(); ctx.restore(); }
    }
    const yu = F.rise(span(t, a.fourY - .15, a.fourY + .55)) * (1 - expoIn(span(t, a.why - .1, a.why + .4)));
    B.word(ctx, '4 YEARS', X(.5), Y(.67), Math.round(36 * k), yu, { align: 'center', col: P.halo0 });
    ctx.restore();
  }
  // the game, abstract (cool lines): the view turns, finds an enemy, shoots it; then falls ("they die a lot"), twice
  function game(ctx, t, X, Y, rw, rh, k) {
    const up = expoOut(span(t, a.turn - .25, a.turn + .5)), down = expoIn(span(t, a.quote - .55, a.quote - .05));
    if (up <= 0 || down >= 1) return;
    const vis = up * (1 - down) * (1 - .6 * sineIO(span(t, a.oneOf - .2, a.scientists + .2)));   // respawned, it plays on, dimmed, under the attribution
    const pan = -.18 * sineIO(span(t, a.turn + .6, a.find - .05)) + .02 * Math.sin(t * .8) + .12 * sineIO(span(t, a.die + 1.9, a.quote));
    const fall1 = expoIn(span(t, a.die - .05, a.die + .4)) * (1 - sineIO(span(t, a.die + .55, a.die + 1.0)));
    const fall2 = expoIn(span(t, a.die + 1.05, a.die + 1.45)) * (1 - sineIO(span(t, a.die + 1.75, a.die + 2.4)));
    const fall = Math.max(fall1, fall2), tilt = .35 * fall, drop = rh * .35 * fall;
    ctx.save(); ctx.globalAlpha *= vis;
    ctx.translate(X(.5), Y(.6) + drop); ctx.rotate(tilt);
    ctx.strokeStyle = rgba(COOL.mid, .8); ctx.lineWidth = 3 * k; ctx.beginPath(); ctx.moveTo(-rw * .7, 0); ctx.lineTo(rw * .7, 0); ctx.stroke();
    for (const [ex, eh] of [[-.32, .1], [.22, .14], [.5, .08]]) {
      const x = (ex + pan) * rw, hit = ex === .22 ? expoOut(span(t, a.shoot + .15, a.shoot + .5)) : 0, s = rw * .022 * (1 - hit);
      if (s > .5) { ctx.fillStyle = rgba(COOL.core, .9); ctx.beginPath(); ctx.moveTo(x, -eh * rh - s * 2); ctx.lineTo(x + s, -eh * rh); ctx.lineTo(x, -eh * rh + s * 2); ctx.lineTo(x - s, -eh * rh); ctx.closePath(); ctx.fill(); }
      if (hit > 0 && hit < 1) halo(ctx, x, -eh * rh, rw * .06 * hit, .7 * (1 - hit), COOL.edge, COOL.core);
    }
    ctx.restore();
    // the crosshair (centre of the view) — locks on "find enemies"; the shot on "shoot"
    const lock = sineIO(span(t, a.find - .1, a.find + .5)), cx = X(.5) + (.22 - .18 + .02 * Math.sin(t * .8)) * rw * lock * 0, cy = Y(.6) - .14 * rh * lock;
    ctx.save(); ctx.globalAlpha *= vis * (1 - fall); ctx.strokeStyle = rgba(COOL.core, .9); ctx.lineWidth = 2.5 * k;
    const cr = 26 * k * (1 - .25 * lock); ctx.beginPath(); ctx.arc(cx, cy, cr, 0, TAU); ctx.stroke();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { ctx.beginPath(); ctx.moveTo(cx + dx * cr * .5, cy + dy * cr * .5); ctx.lineTo(cx + dx * cr * 1.5, cy + dy * cr * 1.5); ctx.stroke(); }
    const sh = span(t, a.shoot, a.shoot + .2);
    if (sh > 0 && sh < 1) { ctx.strokeStyle = rgba(COOL.core, 1 - sh); ctx.lineWidth = 5 * k; ctx.beginPath(); ctx.moveTo(X(.5), Y(1)); ctx.lineTo(lerp(X(.5), cx, expoOut(sh)), lerp(Y(1), cy, expoOut(sh))); ctx.stroke(); }
    ctx.restore();
    if (fall > 0) { ctx.fillStyle = rgba(P.night0, .35 * fall); ctx.fillRect(X(0), Y(0), rw, rh); }
  }
}

function cloudPts(cx, cy, w, h) {
  const bumps = [[-.75, .1, .38], [-.38, -.32, .48], [.12, -.45, .55], [.55, -.2, .45], [.8, .12, .32]];
  const out = [];
  // a cloud outline: arcs along the top (left → right), a flat base back (right → left)
  out.push([cx - w * .95, cy + h * .45]);
  for (const [bx, by, br] of bumps) { const R = br * h * 1.25; for (let k = 0; k <= 10; k++) { const an = Math.PI + k / 10 * Math.PI; out.push([cx + bx * w + Math.cos(an) * R, cy + by * h + Math.sin(an) * R]); } }
  out.push([cx + w * .95, cy + h * .45]);
  for (let k = 1; k < 12; k++) out.push([cx + w * .95 - k / 12 * w * 1.9, cy + h * .45]);
  return out;
}
import { Path2D } from '@napi-rs/canvas';
