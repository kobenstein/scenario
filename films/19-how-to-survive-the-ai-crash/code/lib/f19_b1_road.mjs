// Film 19 · builder B1 · the road and the town at the roadside (c05 + c06, and the night plain behind your window in c04).
// ONE draw function for 180.5 → 257.6 s: sc05 and sc06 both return it, so the c05|c06 seam is the same picture on both sides; c04 draws
// roadBg() behind its window with the same t, so the glide over the table edge lands on exactly this road.
//   roadState(T)     the walk (rc.z(t)), the sign, the windows, the town (cached per T)
//   roadBg(ctx, t, T)          the road world in screen space (sky, plain, road, sign, you, the small lit rect in the mist)
//   roadScene(T)     → draw(ctx, t) for c05 + c06 (5.01–6.08), ending in plateLine
import { Path2D, createCanvas } from '@napi-rs/canvas';
let LAYER = null;
import * as E from './f10_editorial.mjs';
import * as F from './f19_kit.mjs';
import * as PR from './f19_props.mjs';
import * as K16 from './f16_kit.mjs';
import { plateLine, seamWindow, SEAM_HALF, LINE_PLATE } from './f19_seams.mjs';
import { riseText, SRC, LBL, huds, night, tableWorld, camEdge, edgeTimes, clipVeil, clipWin, vWin } from './f19_b1_set.mjs';
import { pressStage } from '../scenes/sc03.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, lin, rad, halo, prng } = E;
// E.glowFill sets globalAlpha absolutely; this local one respects the alpha already in effect (fades fade the glow too)
const glowFill = (ctx, p, b, a, col) => E.glowFill(ctx, p, b, a * ctx.globalAlpha, col);
const { RED, COOL, ROADSET } = F;

const memo = new WeakMap();
export function roadState(T) {
  let m = memo.get(T); if (m) return m;
  const G = (p, after = 170, n = 0) => T.G(p, n, after);
  const a = {};
  a.b = G('Day forty-eight'); a.tariff = G('tariff crash', a.b); a.wave = G('wave after wave'); a.world = G('around the world', a.wave);
  a.stopped = G('fall stopped'); a.hold = G('on hold'); a.best = G('best day'); a.yet = G("don't know yet"); a.chair = G('new chair');
  a.warsh = G('Kevin Warsh'); a.choosier = G('choosier'); a.c1b = T.clip('C1b'); a.keep = G('keep walking');
  a.c06 = G('But what if the fall'); a.doesnt = G("doesn't stop", a.c06); a.never = G('never owned'); a.share = G('single share');
  a.you = G('you', G('Maybe that')); a.pension = G('pension'); a.whole = G('whole market'); a.piece = G('piece of this boom');
  a.memory = G('two memory-chip'); a.sixth = G('a sixth'); a.know = G('know what you own'); a.holds = G('fund holds'); a.boom = G('this one boom');
  a.notmove = G("Knowing isn't a move"); a.cant = G("can't see"); a.end = G('And if the fall keeps going');
  a.edge = edgeTimes(T);
  // the walk: speed 0..1 (× 270 units/s), integrated once
  const V = (t) => {
    if (t < a.b + .2) return 0;
    if (t < a.tariff + 1.0) return smooth(span(t, a.b + .2, a.b + 1.2));                       // 5.01 you walk, the sign comes
    if (t < a.wave) return 1 - smooth(span(t, a.tariff + 1.0, a.wave - .2));                    // you stop under the sign
    if (t < a.yet) return 0;
    if (t < a.chair + .2) return 1.5 * smooth(span(t, a.yet, a.yet + .6));                      // 5.06 the sign passes you
    if (t < a.keep - .6) return 1.5 * (1 - smooth(span(t, a.chair + .2, a.chair + 1.4)));        // the window ahead grows: you stop
    if (t < a.doesnt) return smooth(span(t, a.keep - .6, a.keep + .4));                          // 5.07 keep walking
    return 1 - smooth(span(t, a.doesnt, a.doesnt + 1.0));                                        // 6.01 you turn off the road to the town
  };
  const Z = [], PH = []; { let z = 0, ph = 0; for (let t = 170; t <= 260; t += 1 / 60) { Z.push(z); PH.push(ph); const v = V(t); z += v * 270 / 60; ph += v * 5.5 / 60; } }
  const look = (arr, t) => { const f = (t - 170) * 60, i = Math.max(0, Math.min(arr.length - 2, Math.floor(f))), g = clamp(f - i); return lerp(arr[i], arr[i + 1], g); };
  a.z = (t) => look(Z, t); a.phase = (t) => look(PH, t); a.v = V;
  a.signZ = a.z(a.wave) + 1950;                              // the exit sign stands where you stop under it
  a.townZ = a.z(a.doesnt + 1.2) + ROADSET.you.dz;             // your depth when you leave the road (the town stands just behind it)
  memo.set(T, a); return a;
}

// ------------------------------------------------------------------------------------------------------------- the town (cards on the roadside)
const TOWN = { bus: 760, shop: 1080, office: 1430, mail: 1760, house: 1900 };
function house(ctx, t, w, h, o = {}) {
  ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(-w / 2, -h); ctx.lineTo(0, -h - w * .32); ctx.lineTo(w / 2, -h); ctx.lineTo(w / 2, 0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(P.blue0, .4); ctx.lineWidth = 2; ctx.stroke();
  for (const [x, y, lit] of o.win || []) { ctx.fillStyle = lit ? mixHex(P.halo1, P.core1, .3) : mixHex(P.ind1, P.blue1, .3); ctx.fillRect(x - 22, y - 30, 44, 40); if (lit) halo(ctx, x, y - 10, 70, .3); }
}
function busStop(ctx, t) {
  ctx.fillStyle = mixHex(P.ind1, P.blue1, .3); ctx.fillRect(-150, -250, 300, 14); ctx.fillRect(-150, -250, 10, 250); ctx.fillRect(140, -250, 10, 250);
  ctx.fillStyle = rgba(COOL.mid, .12); ctx.fillRect(-140, -236, 280, 200);
  ctx.fillStyle = mixHex(P.halo1, P.core1, .2); ctx.fillRect(110, -330, 40, 60); ctx.fillStyle = P.night1; ctx.font = '600 22px Inter'; ctx.textAlign = 'center'; ctx.fillText('BUS', 130, -292);
  // two people waiting, looking at their phones (alive: weight shifts, the phone glow on the face side)
  for (const [x, ph] of [[-60, 0], [40, 1.7]]) {
    const lean = .03 * Math.sin(t * .8 + ph);
    const hd = E.person(ctx, x, 0, 200, { lean, armR: [.9, 2.6], look: -.2, dir: ph ? -1 : 1, light: 1 });
    if (hd?.R) halo(ctx, hd.R[0], hd.R[1] - 6, 18, .5, COOL.edge, COOL.core);
  }
}
function shop(ctx, t) {
  const w = 380, h = 330;
  ctx.fillStyle = mixHex(P.night1, P.ind1, .45); ctx.fillRect(-w / 2, -h, w, h);
  const win = new Path2D(); win.rect(-w / 2 + 30, -h + 90, w - 60, 190);
  glowFill(ctx, win, 40, .45, P.halo0);
  ctx.fillStyle = lin(ctx, 0, -h + 90, 0, -h + 280, [[0, mixHex(P.halo0, P.core1, .4)], [1, P.halo1]]); ctx.fill(win);
  ctx.fillStyle = P.night1; ctx.font = '600 30px Inter'; ctx.textAlign = 'center'; ctx.letterSpacing = '0.2em'; ctx.fillText('SHOP', 0, -h + 56); ctx.letterSpacing = '0px';
  // someone inside, behind the counter (silhouette)
  E.person(ctx, 60 + 14 * Math.sin(t * .4), -h + 280, 150, { armR: [1.3, 1.6], dir: -1, light: -1 });
}
function office(ctx, t) {
  const w = 340, h = 420;
  ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.fillRect(-w / 2, -h, w, h);
  ctx.fillStyle = mixHex(P.ind1, P.blue1, .3); for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) ctx.fillRect(-w / 2 + 30 + c * 75, -h + 30 + r * 70, 46, 40);
  const door = new Path2D(); door.rect(-60, -170, 120, 170);
  glowFill(ctx, door, 26, .4, COOL.edge); ctx.fillStyle = lin(ctx, 0, -170, 0, 0, [[0, rgba(COOL.core, .7)], [1, rgba(COOL.mid, .45)]]); ctx.fill(door);
  ctx.strokeStyle = rgba(P.night1, .9); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -170); ctx.lineTo(0, 0); ctx.stroke();
  E.person(ctx, 120, 0, 205, { armR: [.6, 2.4], cup: 'R', lean: .02 * Math.sin(t * .7), dir: -1 });
}
function closedUmbrella(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = mixHex(P.halo1, P.shade0, .3); ctx.beginPath(); ctx.moveTo(-6, 6); ctx.lineTo(6, 6); ctx.lineTo(2, 96); ctx.lineTo(-2, 96); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = mixHex(P.shade0, P.ind1, .2); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(-6, 2, 6, 0, Math.PI, true); ctx.stroke();
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------------------- the road world
// st: { rcx (truck right), youX, youDir, youLook, youArm, line: [u0, u1] along the red path, statementOut 0..1 }
export function roadBg(ctx, t, T, st = {}) {
  const a = roadState(T), z = a.z(t), rc = F.roadSetCam(z, { x: st.rcx ?? 0, vx: 960 - (st.rcx ?? 0) * 0 });
  F.road(ctx, t, rc, { mist: ROADSET.mist, lit: 0 });
  // the small lit rect in the mist (5.065): it is there from the moment the sign has passed you
  const lr = st.mistRect; if (lr && lr.a > 0) { ctx.save(); ctx.globalAlpha *= lr.a; const p = new Path2D(); p.roundRect(lr.r.x, lr.r.y, lr.r.w, lr.r.h, 3); glowFill(ctx, p, 24, .5, P.halo0); ctx.fillStyle = mixHex(P.halo1, P.core1, .4); ctx.fill(p); ctx.restore(); }
  // the exit sign (DAY 48)
  // (the kit's sign glow ignores lit and alpha, so the lit sign is drawn once more on a layer and laid over by signLit: no one-frame pop)
  const SO = { day: 48, name: 'THE TARIFF CRASH', year: 2025, glyph: 'container', lit: 0 }, sL = clamp(st.signLit ?? 0);
  const sign = F.exitSign(ctx, t, rc, ROADSET.signX, a.signZ, SO);
  if (sL > 0) {
    const cv = ctx.canvas; if (!LAYER || LAYER.width !== cv.width || LAYER.height !== cv.height) LAYER = createCanvas(cv.width, cv.height);
    const lx = LAYER.getContext('2d'); lx.setTransform(1, 0, 0, 1, 0, 0); lx.clearRect(0, 0, LAYER.width, LAYER.height); lx.setTransform(ctx.getTransform());
    F.exitSign(lx, t, rc, ROADSET.signX, a.signZ, { ...SO, lit: 1 });
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= sL; ctx.drawImage(LAYER, 0, 0); ctx.restore();
  }
  // the town at the roadside, standing behind your path once you turn to it
  const ZT = a.townZ + 420;
  const items = [[TOWN.bus, busStop], [TOWN.shop, shop], [TOWN.office, office]];
  F.rStand(ctx, rc, 600, ZT + 300, () => house(ctx, t, 300, 300, { win: [[-60, -170, 1], [60, -170, 0]] }));
  F.rStand(ctx, rc, TOWN.house, ZT + 160, () => house(ctx, t, 420, 330, { win: [[-90, -190, 1], [90, -190, 1], [0, -80, 0]] }));
  F.rStand(ctx, rc, 2400, ZT + 260, () => house(ctx, t, 360, 300, { win: [[-70, -160, 0], [70, -160, 1]] }));
  for (const [X, fn] of items) F.rStand(ctx, rc, X, ZT, () => fn(ctx, t));
  // the red line (6.01–6.03): from the road's right verge behind you, along the pavement in front of the town, to your mailbox
  if (st.line && st.line[1] > 0) redPath(ctx, t, rc, a, st.line);
  // your mailbox
  const mb = F.rStand(ctx, rc, TOWN.mail, a.townZ + 120, () => {
    PR.mailbox(ctx, t, 0, 0, 200, { flag: st.flag ?? 0, lit: st.mailLit ?? 0 });
    if ((st.slip ?? 0) > 0) { ctx.save(); ctx.beginPath(); ctx.rect(-60, -330, 120, 168); ctx.clip(); PR.payslip(ctx, t, 0, -160 - 50 * st.slip, 80, { lit: .6, net: 0, red: [0, st.slipRed ?? 0] }); ctx.restore(); }
  });
  // you
  const yz = z + ROADSET.you.dz;
  const youX = st.youX ?? ROADSET.you.X;
  const p = t < a.b ? null : F.rStand(ctx, rc, youX, yz, () => {
    const walking = (st.youWalk ?? a.v(t)) > .02;
    const o = { view: walking && (st.youDir ?? 0) === 0 ? 'back' : st.youDir ? 'side' : 'back', dir: st.youDir || 1, look: st.youLook ?? 0, lean: st.youLean ?? 0 };
    if (walking) o.walk = st.youPhase ?? a.phase(t);
    if (st.youArm) o.armR = st.youArm;
    const hands = E.du(ctx, 0, 0, ROADSET.you.h, o);
    if (!st.noUmb && hands?.L) closedUmbrella(ctx, hands.L[0], hands.L[1], 1.05);
  });
  return { rc, sign, mb, you: p };
}
function redPath(ctx, t, rc, a, [u0, u1]) {
  // the path in road coordinates: along the right verge from behind you, then off the road and along the pavement to the mailbox
  const ZT = a.townZ;
  const pts = [[300, ZT - 1300], [300, ZT - 500], [420, ZT - 60], [700, ZT + 40], [TOWN.mail - 60, ZT + 40]];
  const P2 = []; for (let i = 0; i < pts.length - 1; i++) for (let k = 0; k < 20; k++) { const s = k / 20; P2.push([lerp(pts[i][0], pts[i + 1][0], s), lerp(pts[i][1], pts[i + 1][1], s)]); }
  P2.push(pts[pts.length - 1]);
  const n = P2.length - 1, i0 = Math.floor(clamp(u0) * n), i1 = clamp(u1) * n;
  ctx.save(); ctx.strokeStyle = RED.line; ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.shadowColor = rgba(RED.deep, .9); ctx.shadowBlur = 12;
  ctx.beginPath(); let started = false, tip = null;
  for (let i = i0; i <= Math.min(n, Math.ceil(i1)); i++) {
    const q = i > i1 ? [lerp(P2[i - 1][0], P2[i][0], i1 - (i - 1)), lerp(P2[i - 1][1], P2[i][1], i1 - (i - 1))] : P2[i];
    const s = F.rpt(rc, q[0], q[1]); if (!s) continue; const wig = Math.sin(i * 1.7) * 3;
    if (!started) { ctx.moveTo(s[0], s[1] + wig); started = true; } else ctx.lineTo(s[0], s[1] + wig); tip = s;
  }
  ctx.stroke();
  if (tip && u1 < 1) { ctx.fillStyle = RED.hot; ctx.beginPath(); ctx.arc(tip[0], tip[1], 6, 0, 7); ctx.fill(); }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------------------- the exit window content (5.02–5.05)
const WINR = { x: 330, y: 100, w: 1260, h: 690 };
function containers(ctx, t, r, a) {
  const base = r.y + r.h * .9, cw = r.w * .1, ch = cw * .42;
  for (let s = 0; s < 3; s++) {
    const t0 = a.wave + s * .62, k = expoIn(span(t, t0, t0 + .55)) * .8 + .2 * expoOut(span(t, t0 + .55, t0 + 1.2));
    const ang = -1.2 * k * (s % 2 ? 1 : .85), px = r.x + r.w * (.1 + s * .13) + cw;
    ctx.save(); ctx.translate(px, base); ctx.rotate(ang * (s === 1 ? -.9 : 1) * (s === 1 ? -1 : 1));
    for (let i = 0; i < 3; i++) {
      const y = -(i + 1) * ch, cx0 = -cw;
      ctx.fillStyle = [mixHex(P.blue1, P.ind1, .2), mixHex(P.ind2, P.blue1, .5), mixHex(P.blue0, P.ind1, .55)][(i + s) % 3];
      ctx.fillRect(cx0, y, cw, ch - 3);
      ctx.strokeStyle = rgba(P.night0, .5); ctx.lineWidth = 2; for (let x = cx0 + 10; x < 0; x += 12) { ctx.beginPath(); ctx.moveTo(x, y + 4); ctx.lineTo(x, y + ch - 7); ctx.stroke(); }
      if (i === 1) { ctx.font = `600 ${Math.round(ch * .42)}px Inter`; ctx.fillStyle = P.cream; ctx.textAlign = 'center'; ctx.letterSpacing = '0.12em'; ctx.fillText('TARIFF', cx0 + cw / 2, y + ch * .64); ctx.letterSpacing = '0px'; }
    }
    ctx.restore();
  }
}
function exitWindow(ctx, t, r, a) {
  ctx.fillStyle = rad(ctx, r.x + r.w * .5, r.y + r.h * .3, r.w * .8, [[0, mixHex(P.ind1, P.blue1, .35)], [1, P.night0]]); ctx.fillRect(r.x, r.y, r.w, r.h);
  const sx = r.w / WINR.w;
  riseText(ctx, 'THE TARIFF CRASH · 2025', r.x + 40 * sx, r.y + 62 * sx, t, a.wave - .9, { ...LBL, size: Math.round(34 * sx) });
  containers(ctx, t, r, a);
  const lr = { x: r.x + r.w * .36, y: r.y + r.h * .2, w: r.w * .52, h: r.h * .62 };
  const lu = sineIO(span(t, a.wave + .2, a.world + 1.2));
  const L = F.lossLine(ctx, t, lr, 'tariff', lu, { scale: 22, gold: smooth(span(t, a.stopped, a.stopped + .5)), w: 5 * sx });
  if (lu > 0) riseText(ctx, 'FEB 19 · RECORD', lr.x, lr.y - 16 * sx, t, a.wave + .3, { ...SRC, size: Math.round(20 * sx) });
  // 5.03 the bottom: gold
  riseText(ctx, 'APR 8, 2025 · −19 % · DAY 48', L.low[0] - 20 * sx, L.low[1] + 46 * sx, t, a.stopped + .15, { ...LBL, size: Math.round(30 * sx), align: 'right', out: a.yet - .2 });
  // 5.04 ON HOLD lands on the containers
  if (t > a.hold - .3) K16.stamp(ctx, t, 'ON HOLD', r.x + r.w * .22, r.y + r.h * .55, { t0: a.hold, size: Math.round(44 * sx), rot: -.08, out: a.yet - .3 });
  // 5.05 the best day: a gold day bar shoots up right after the low
  const bu = expoOut(span(t, a.best - .1, a.best + .45)), bh = (L.low[1] - lr.y) * 9.5 / 19;
  if (bu > 0) {
    const bx = L.low[0] + 30 * sx, p = new Path2D(); p.roundRect(bx - 12 * sx, L.low[1] - bh * bu, 24 * sx, bh * bu, 6);
    glowFill(ctx, p, 26, .6, P.halo0); ctx.fillStyle = lin(ctx, 0, L.low[1] - bh, 0, L.low[1], [[0, P.core0], [1, P.halo1]]); ctx.fill(p);
    riseText(ctx, 'APR 9, 2025 · S&P 500 +9.5 %', r.x + r.w - 34 * sx, r.y + 62 * sx, t, a.best + .15, { ...LBL, size: Math.round(30 * sx), align: 'right', out: a.yet - .2 });
    riseText(ctx, 'BEST DAY SINCE THE FINANCIAL CRISIS', r.x + r.w - 34 * sx, r.y + 98 * sx, t, a.best + .45, { ...LBL, size: Math.round(24 * sx), col: P.halo2, align: 'right', out: a.yet - .2 });
  }
  riseText(ctx, 'S&P 500', r.x + r.w - 30 * sx, r.y + r.h - 24 * sx, t, a.wave + .5, { ...SRC, size: Math.round(20 * sx), align: 'right' });
}

// ------------------------------------------------------------------------------------------------------------- the whole c05 + c06 picture
const STAGE = { x: 300, y: 96, w: 1320, h: 742 };
export function roadScene(T) {
  const a = roadState(T);
  const T7 = a.end;
  const stageOpen = (t) => sineIO(span(t, a.chair - .1, a.chair + 1.9)) * (1 - sineIO(span(t, a.c1b.end + .62, a.c1b.end + 2.2)));
  const mistRect = (t) => ({ x: 948, y: ROADSET.hy - 26, w: 24, h: 14 });
  const backdrop = (r) => ({ x: r.x + r.w * .33, y: r.y + r.h * .16, w: r.w * .34, h: r.h * .3 });
  // c06 picture: you walk right off the road into the town; the camera trucks with you
  const walkR = (t) => smooth(span(t, a.doesnt + .2, a.doesnt + 2.4));                                    // 0..1 along the town
  const youXAt = (t) => lerp(ROADSET.you.X, TOWN.mail - 230, walkR(t));
    const rcxAt = (t) => lerp(0, TOWN.mail - 560, sineIO(span(t, a.doesnt + .1, a.doesnt + 2.6)));
  // the push into the statement / the payslip (2D zoom about a screen point on top of the road world)
  const zoomAt = (t) => {
    const z1 = 2.0, inU = sineIO(span(t, a.pension - .8, a.whole + .2)), outU = sineIO(span(t, a.notmove - .5, a.notmove + 1.1));
    return lerp(1, lerp(z1, 1.35, outU), inU);
  };
  const dotsN = 900, R0 = prng(606), DOTS = Array.from({ length: dotsN }, (_, i) => ({ sx: R0(), sy: R0(), fx: R0(), fy: R0(), tech: i % 9 === 0, th: Math.acos(1 - 2 * (i + .5) / dotsN), ph: i * Math.PI * (3 - Math.sqrt(5)) }));
  const GLOBE = { x: 1080, y: 440, r: 250 };
  const STM = { x: 420, y: 560, w: 340 };

  return (ctx, t) => {
    if (seamWindow(t, T7)) { plateLine(ctx, t); huds(ctx, t, T); return; }
    // ---------------------------------------------------------------------------------- c04 tail → c05 head: the glide over the table edge
    if (t < a.edge.t1) {
      tableWorld(ctx, t, T, camEdge(t, T), { face: 0, bg: (c, tt) => roadBg(c, tt, T) });
      huds(ctx, t, T); return;
    }
    const tc6 = t >= a.c06 - 1;
    const st = { signLit: smooth(span(t, a.tariff, a.tariff + .6)) * (1 - smooth(span(t, a.yet + .4, a.yet + 1.4))) };
    if (tc6) {
      st.rcx = rcxAt(t); st.youX = youXAt(t);
      const wr = walkR(t), walking = wr > 0 && wr < 1;
      st.youWalk = walking ? 1 : 0; st.youDir = t > a.doesnt + .1 ? 1 : 0; st.youPhase = (t - a.doesnt) * 5.5;
      st.youLook = t > a.you - .1 ? -.6 * smooth(span(t, a.you - .1, a.you + .5)) : 0;
      st.line = [smooth(span(t, a.never + .4, a.you + .2)) * .35, sineIO(span(t, a.c06 + .1, a.doesnt + 2.45))];
      st.flag = smooth(span(t, a.pension - .4, a.pension + .1));
      st.mailLit = smooth(span(t, a.you, a.you + .4)) * .6 + .4 * smooth(span(t, a.notmove, a.cant));
      // 6.07/6.08: you hold the phone up, then lower it (shoulders drop)
      const up = smooth(span(t, a.holds - .4, a.holds + .3)) * (1 - smooth(span(t, a.notmove + .1, a.notmove + 1.3)));
      if (up > 0 || t > a.holds) st.youArm = [lerp(.2, 2.2, up), lerp(.1, 2.9, up)];
      st.youLean = .04 * smooth(span(t, a.notmove + .2, a.notmove + 1.2));
      st.slip = smooth(span(t, a.notmove + .6, a.notmove + 1.3)); st.slipRed = smooth(span(t, a.notmove + .9, a.cant - .2));
    }
    if (t >= a.yet && t < a.c1b.end + 2.2) st.mistRect = { r: mistRect(t), a: smooth(span(t, a.yet + .6, a.chair - .2)) * (1 - smooth(span(t, a.c1b.end + 1.3, a.c1b.end + 2.1))) };
    // the push: everything of the road world under one 2D zoom about your mailbox's slot (it moves to Ft on screen)
    const z = tc6 ? zoomAt(t) : 1;
    const tilt = tc6 ? sineIO(span(t, a.cant + .05, T7 - SEAM_HALF)) : 0;
    let R, focus = [960, 540], Ft = [960, 540];
    ctx.save();
    if (tc6) {
      const mb = F.rpt(F.roadSetCam(a.z(t), { x: st.rcx }), TOWN.mail, a.townZ + 120);
      focus = [mb[0], mb[1] - 162 * mb[2]];
      const inU = sineIO(span(t, a.pension - .8, a.whole + .2)), outU = sineIO(span(t, a.notmove - .5, a.notmove + 1.1));
      Ft = [lerp(focus[0], lerp(420, 1100, outU), inU), lerp(focus[1], lerp(940, 700, outU), inU) + tilt * 1300];
      ctx.translate(Ft[0], Ft[1]); ctx.scale(z, z); ctx.translate(-focus[0], -focus[1]);
      st.mbS = mb[2];
    }
    R = roadBg(ctx, t, T, st);
    ctx.restore();
    // ---------------------------------------------------------------------------------- 5.02–5.06 the exit window (from the sign's face)
    const wo = quartIO(span(t, a.tariff + .9, a.wave - .2)) * (1 - quartIO(span(t, a.yet, a.yet + .9)));
    if (wo > 0 && R.sign.panel) vWin(ctx, t, WINR, wo, (cx, r) => exitWindow(cx, t, r, a), { from: R.sign.panel, mat: .6, fromCol: mixHex(P.ind1, P.blue1, .2) });
    // ---------------------------------------------------------------------------------- 5.065–5.066 the Fed window in the mist, Warsh inside
    const so = stageOpen(t);
    let clipOpen = 0;
    if (so > 0) {
      vWin(ctx, t, STAGE, so, (cx, r) => pressStage(cx, t, r, 'FEDERAL RESERVE · OCT 28, 2026', { slips: (c2, lx, ly) => {
        const su = expoOut(span(t, a.choosier - .9, a.choosier - .2)), push = quartIO(span(t, a.choosier, a.choosier + .7));
        if (su <= 0) return; const k = r.w / STAGE.w;
        for (let i = 0; i < 5; i++) { const off = (i - 2) * 64 * k, aside = (i === 1 || i === 3) ? push : 0; PR.iouSlip(c2, t, lx + off + (i === 1 ? -1 : 1) * aside * 120 * k, ly - 22 * k - (1 - su) * 30 * k + aside * 40 * k, 56 * k, { tilt: (i - 2) * .05 + aside * (i === 1 ? -.5 : .5), cool: .4, a: su }); }
      } }), { from: mistRect(t), mat: .7 });
      clipOpen = smooth(span(t, a.c1b.start - .6, a.c1b.start)) * (1 - smooth(span(t, a.c1b.end, a.c1b.end + .6)));
      if (clipOpen > 0) { const k = 1 + .035 * sineIO(span(t, a.c1b.start, a.c1b.end)); clipWin(ctx, t, T, 'C1b', { x: W / 2 - STAGE.w * k / 2, y: STAGE.y + STAGE.h / 2 - STAGE.h * k / 2, w: STAGE.w * k, h: STAGE.h * k }, { from: backdrop(STAGE) }); }
    }
    // ---------------------------------------------------------------------------------- 6.04–6.06 the statement, the dots, the globe, the magnifier
    if (tc6) explain6(ctx, t, z, Ft);
    // the payslip rises out of the letterbox flap onto the plate (6.08)
    if (tc6 && tilt > 0) {
      const e = tilt, sx0 = Ft[0], sy0 = Ft[1] + (2 - 50 * (st.slip ?? 1)) * st.mbS * z, w0 = 80 * st.mbS * z;
      nightOver(ctx, t, smooth(span(e, .55, 1)));
      halo(ctx, 960, lerp(1400, 1160, e), 900, .35 * smooth(span(e, .2, 1)));
      PR.payslip(ctx, t, lerp(sx0, LINE_PLATE.x, e), lerp(sy0, LINE_PLATE.y, e), lerp(w0, LINE_PLATE.w, e), { tilt: lerp(0, LINE_PLATE.tilt, e), lit: .9, net: .6 * e, red: [0, lerp(st.slipRed ?? 1, 1, e)] });
    }
    // HUDs (hidden only inside the clip window); 5.07 gore 1 glows once; 6.08 gores 1 and 2 glow side by side
    huds(ctx, t, T, { umb: 1 - clipOpen, day: 1 - clipOpen });
    for (const [i, t0] of [[0, a.keep + .3], [0, a.notmove + .5], [1, a.notmove + .7]]) { const k = span(t, t0, t0 + 1.2); if (k > 0 && k < 1) { const [gx, gy] = F.hudGoreCenter(i); halo(ctx, gx, gy, 46, .5 * Math.sin(Math.PI * k)); } }
  };

  function nightOver(ctx, t, k) { if (k <= 0) return; ctx.save(); ctx.globalAlpha = k; night(ctx, t); ctx.restore(); }

  function explain6(ctx, t, z, Ft) {
    const sOut = sineIO(span(t, a.holds - .9, a.holds + .2));     // 6.07: statement, globe and text leave (down) as the phone comes up
    const so = sineIO(span(t, a.pension - .7, a.whole + .15));
    if (so <= 0) return;
    // the statement slid out of the mailbox: in screen space beside the zoomed mailbox
    const sy = lerp(Ft[1] - 60, STM.y, so) + sOut * 900, sx = lerp(Ft[0], STM.x, so);
    PR.statement(ctx, t, sx, sy, lerp(60, STM.w, so), [['WORLD INDEX FUND', ''], ['US', '64 %'], ['TECH', '33 %'], ['COMPANIES', '2,500+'], ['FEES', '0.2 %']], { title: 'YOUR PENSION', u: span(t, a.pension, a.pension + .9) });
    // the dots: out of the statement's rows into the night, then into the globe
    const out = span(t, a.whole - .2, a.whole + 1.2), glob = quartIO(span(t, a.piece + .4, a.memory - .1));
    if (out > 0 && sOut < 1) {
      const rot = t * .25;
      ctx.save();
      for (let i = 0; i < DOTS.length; i++) {
        const d = DOTS[i], k = expoOut(clamp(out * 1.6 - (i % 37) / 37 * .6)); if (k <= 0) continue;
        const x0 = STM.x - STM.w * .35 + d.sx * STM.w * .7, y0 = sy - STM.w * .3 + d.sy * STM.w * .7;
        const fx = 700 + d.fx * 900, fy = 140 + d.fy * 560;
        const th = d.th, ph = d.ph + rot, gx = GLOBE.x + GLOBE.r * Math.sin(th) * Math.cos(ph), gy = GLOBE.y + GLOBE.r * Math.cos(th), front = Math.sin(th) * Math.sin(ph);
        let x = lerp(x0, fx, k), y = lerp(y0, fy, k); x = lerp(x, gx, glob); y = lerp(y, gy, glob);
        y += sOut * 900;
        const back = glob * (front < 0 ? .7 : 0), tech = d.tech ? smooth(span(t, a.piece, a.piece + .6)) : 0;
        ctx.fillStyle = d.tech && tech > 0 ? rgba(mixHex(P.halo2, COOL.core, tech), (1 - back) * .95) : rgba(P.halo2, (1 - back) * .7);
        ctx.fillRect(x - 1.6, y - 1.6, 3.2, 3.2);
      }
      ctx.restore();
    }
    if (glob > 0 && sOut < 1) {
      const dy = sOut * 900, gu = glob;
      // the two memory-chip dots, the ring sixth
      const two = smooth(span(t, a.memory, a.memory + .5));
      for (const [ox, oy] of [[-60, -40], [-28, 10]]) if (two > 0) { halo(ctx, GLOBE.x + ox, GLOBE.y + oy + dy, 40, .7 * two, COOL.edge, COOL.core); ctx.fillStyle = rgba(COOL.core, two); ctx.beginPath(); ctx.arc(GLOBE.x + ox, GLOBE.y + oy + dy, 6, 0, 7); ctx.fill(); }
      ctx.save(); ctx.strokeStyle = rgba(P.halo2, .35 * gu); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(GLOBE.x, GLOBE.y + dy, GLOBE.r + 46, 0, 7); ctx.stroke();
      const six = quartIO(span(t, a.sixth, a.sixth + .9));
      if (six > 0) { ctx.strokeStyle = COOL.core; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.shadowColor = rgba(COOL.edge, .9); ctx.shadowBlur = 24; ctx.beginPath(); ctx.arc(GLOBE.x, GLOBE.y + dy, GLOBE.r + 46, -Math.PI / 2, -Math.PI / 2 + six * Math.PI / 3); ctx.stroke(); }
      ctx.restore();
      const tx = 1420, o6 = a.holds - .6;
      riseText(ctx, '≈', tx, 400 + dy, t, a.sixth + .2, { size: 70, weight: 600, out: o6 });
      riseText(ctx, '1/6', tx + 64, 400 + dy, t, a.sixth + .25, { size: 130, serif: true, out: o6 });
      riseText(ctx, 'OF THE WORLD', tx, 462 + dy, t, a.sixth + .5, { ...LBL, size: 32, out: o6 });
      riseText(ctx, "MARKET'S GAINS", tx, 502 + dy, t, a.sixth + .6, { ...LBL, size: 32, out: o6 });
      riseText(ctx, 'MICRON + SK HYNIX', tx, 568 + dy, t, a.memory + .3, { ...LBL, size: 28, col: COOL.mid, out: o6 });
      riseText(ctx, 'MAY 2026', tx, 606 + dy, t, a.memory + .45, { ...LBL, size: 26, col: P.halo2, out: o6 });
      riseText(ctx, 'ACADIAN · MSCI ACWI', tx, 650 + dy, t, a.sixth + .8, { ...SRC, out: o6 });
    }
    // 6.06 the magnifier glides over the statement, then flies into gore 2
    const g = F.goreFlight(T, 1), mu = sineIO(span(t, g.t0 - 1.7, g.t0));
    if (mu > 0 && t < g.t1) {
      const from = [lerp(GLOBE.x, STM.x + 40, mu), lerp(GLOBE.y + 140, sy - 40, mu) + Math.sin(Math.PI * mu) * -80];
      if (t < g.t0) F.goreIcon(ctx, 1, from[0], from[1], 1.8 * expoOut(span(t, g.t0 - 1.7, g.t0 - 1.2)));
      else { const f = F.flyToGore(t, T, 1, [STM.x + 40, sy - 40], { s0: 1.8 }); F.goreIcon(ctx, 1, f.x, f.y, f.s); }
    }
    riseText(ctx, F.GORE_TEXT[1], 960, 800, t, g.t0 + .5, { ...LBL, size: 40, align: 'center', out: a.holds - .5 });
    // 6.07 your phone comes up into the frame (close on your hands): the fund's top holdings
    const pu = sineIO(span(t, a.holds - .5, a.holds + .7)) * (1 - quartIO(span(t, a.notmove - .1, a.notmove + 1.1)));
    if (pu > 0) {
      const px = 980, py = lerp(1500, 520, pu), ph = 760;
      PR.hand(ctx, px - 150, py + 300, 1.5, { ang: .25 });
      PR.phone(ctx, t, px, py, ph, { screen: (cx, r) => holdings(cx, t, r) });
      PR.hand(ctx, px + 120, py + 330, 1.4, { ang: -.3 });
    }
  }
  function holdings(cx, t, r) {
    cx.fillStyle = lin(cx, 0, r.y, 0, r.y + r.h, [[0, P.night0], [1, P.night1]]); cx.fillRect(r.x, r.y, r.w, r.h);
    cx.font = '600 26px Inter'; cx.fillStyle = P.halo2; cx.letterSpacing = '0.1em'; cx.fillText('TOP HOLDINGS', r.x + 26, r.y + 60); cx.letterSpacing = '0px';
    const scroll = 52 * sineIO(span(t, a.holds + .2, a.notmove - .4));
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'], boom = [0, 2, 3, 5];
    rows.forEach((l, i) => {
      const y = r.y + 110 + i * 82 - scroll; if (y < r.y + 80 || y > r.y + r.h - 20) return;
      const gl = boom.includes(i) ? smooth(span(t, a.boom + i * .08, a.boom + i * .08 + .4)) : 0;
      cx.fillStyle = rgba(mixHex(P.ind1, COOL.deep, gl), 1); cx.beginPath(); cx.roundRect(r.x + 16, y, r.w - 32, 66, 10); cx.fill();
      if (gl > 0) { cx.strokeStyle = rgba(COOL.core, .8 * gl); cx.lineWidth = 3; cx.stroke(); }
      cx.font = '600 28px Inter'; cx.fillStyle = mixHex(P.cream, COOL.core, gl); cx.fillText(`COMPANY ${l}`, r.x + 34, y + 43);
      cx.textAlign = 'right'; cx.fillText(`${(7.2 - i * .8).toFixed(1)} %`, r.x + r.w - 34, y + 43); cx.textAlign = 'left';
    });
  }
}
