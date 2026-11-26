// c05 · B1 · SAFETY over both doors · the glimpse through the gap again: the code line of the hook, APR 7 · it pulls back into a dark
// plain of small screens: a stranger's light comes from far away, one screen goes dark · MYTHOS over the door; the lab's list slides
// out of the gap, rows ticked, row 5 (you) empty · mark 2: the government, EO 14409, VOLUNTARY · mark 3: four towers rise on the
// horizon, one name per word · NOT YOU. NOT YET. (you, far back).
// 'Ask either lab' → 'But safety is not all'. Part of ONE take c02–c06 (lib/f55_b1_take.mjs). Plan: docs/shots.md 2.01–2.05.
//
// | ID    | anchor (phrase)              | picture (one idea)                                                            | camera                 |
// |-------|------------------------------|-------------------------------------------------------------------------------|------------------------|
// | 2.01  | Ask either lab               | both signs turn SAFETY; push to the gap: the glimpse, the hot code line, APR 7 | pull back · push · MIX |
// | 2.02  | It let a stranger crash      | the glimpse pulls back: a plain of small screens; a light from far, one goes dark | creep · EXPL       |
// | 2.03  | The A.I. that found it       | MYTHOS over the door; "WE DO NOT PLAN TO MAKE …"; the list out of the gap       | pull back · MIX        |
// | 2.04  | Second in line               | mark 2 lights, the government looks up; EO 14409 rises, VOLUNTARY; 30 DAYS     | travel back · EXPL     |
// | 2.05  | Third come the giants        | mark 3; four towers rise on the horizon, one name each; NOT YOU. NOT YET.      | travel · pull up · LINE|
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f55_kit.mjs';
import * as S from '../lib/f55_seams.mjs';
import { entry, say, win } from '../lib/f55_b1_take.mjs';
import { tapeRect } from './sc02.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, mixHex, halo, lin, prng } = E;
const { rise, maskLine, GOLD, CHECK, LAMP } = F;
const TAU = Math.PI * 2;

export default entry;

// ---------------------------------------------------------------------------------------------------------------- the plain of screens
const PANEL = { x: 250, y: 110, w: 1420, h: 720 };
const PW = PANEL.w, PH = PANEL.h, AR = PW / PH;
const SCREENS = (() => {
  const out = [];
  for (let j = 0; j < 7; j++) {
    const v = Math.pow(j / 6, 1.5), y = PH * (.3 + .6 * v), sc = .14 + .86 * v, sp = 250 * sc, n = Math.ceil(PW / sp) + 2;
    for (let i = 0; i < n; i++) { const x = PW / 2 + (i - n / 2 + .5 + (j % 2) * .5) * sp, w = 150 * sc, h = w / AR; out.push({ x: x - w / 2, y: y - h, w, h, j, sc }); }
  }
  let best = null; for (const s of out) if (s.j === 5 && (!best || Math.abs(s.x + s.w / 2 - PW * .56) < Math.abs(best.x + best.w / 2 - PW * .56))) best = s;
  best.T = true; return out;
})();
const TGT = SCREENS.find((s) => s.T);
const STRANGER = LAMP && { halo: mixHex(LAMP.body, P.cream, .3), body: LAMP.body, core: P.cream };
function glimpse(cx, t, a, w, h, m) {
  cx.fillStyle = lin(cx, 0, 0, 0, h, [[0, P.night0], [.3, mixHex(P.night1, P.ind1, .4)], [1, P.night1]]); cx.fillRect(0, 0, w, h);
  const zu = sineIO(span(t, a.stranger + .1, a.crash + 1.2)), Zf = w / TGT.w, Z = Math.exp(lerp(Math.log(Zf), 0, zu)), k = (Zf - Z) / (Zf - 1);
  const ccx = lerp(TGT.x + TGT.w / 2, w / 2, k), ccy = lerp(TGT.y + TGT.h / 2, h / 2, k);
  cx.save(); cx.translate(w / 2, h / 2); cx.scale(Z, Z); cx.translate(-ccx, -ccy);
  // the plain: a faint horizon and the small screens (each a lit face on a dark stand)
  cx.fillStyle = rgba(P.blue1, .25); cx.fillRect(-w, h * .28, w * 3, 2);
  const dark = span(t, a.connecting - .05, a.connecting + .45), flick = dark > 0 && dark < 1 ? .5 + .5 * Math.sin(t * 60) : 1;
  for (const s of SCREENS) {
    cx.fillStyle = mixHex(P.night0, P.ind1, .4); cx.fillRect(s.x + s.w * .44, s.y + s.h, s.w * .12, s.h * .35); cx.fillRect(s.x - s.w * .04, s.y - s.w * .04, s.w * 1.08, s.h + s.w * .08);
    if (s.T) {
      cx.save(); cx.beginPath(); cx.rect(s.x, s.y, s.w, s.h); cx.clip(); cx.translate(s.x, s.y); cx.scale(s.w / w, s.h / h);
      cx.fillStyle = mixHex(P.night1, P.ind1, .35); cx.fillRect(0, 0, w, h);
      F.codeWall(cx, t, 40, 30, w - 80, h - 60, { hot: 13, hotU: span(t, a.decades + .4, a.decades + 1.6), dust: span(t, a.decades + 1, a.decades + 2.4), seed: 27 });
      cx.restore();
      if (dark > 0) { cx.fillStyle = rgba(P.night0, .9 * Math.min(1, dark * 1.4) * (dark < 1 ? flick : 1)); cx.fillRect(s.x, s.y, s.w, s.h); }
    } else {
      cx.fillStyle = mixHex(mixHex(LAMP.body, GOLD.core, .25), P.ind1, .62 - .3 * s.sc); cx.fillRect(s.x, s.y, s.w, s.h);
      cx.fillStyle = rgba(P.night1, .35); for (let r = 0; r < 3; r++) cx.fillRect(s.x + s.w * .1, s.y + s.h * (.25 + r * .22), s.w * (.6 - r * .12), Math.max(1, s.h * .06));
    }
  }
  cx.restore();
  // the stranger: a light from far away (left, on the horizon) along an arc to the screen; it connects, the screen goes dark
  const su = sineIO(span(t, a.across - .5, a.connecting + .05));
  if (su > 0 && zu > .98) {
    const p0 = [w * .05, h * .29], p2 = [TGT.x + TGT.w / 2, TGT.y + TGT.h / 2], p1 = [w * .3, h * .02], pts = [];
    for (let i = 0; i <= 40; i++) { const u = i / 40, v = 1 - u; pts.push([v * v * p0[0] + 2 * v * u * p1[0] + u * u * p2[0], v * v * p0[1] + 2 * v * u * p1[1] + u * u * p2[1]]); }
    F.accentTrail(cx, pts, su, { col: STRANGER, w: 2.4, a: 1 - span(t, a.connecting + .6, a.found - .2) });
  }
  // APR 7: a calendar sheet falls into the corner of the glimpse
  const cu = expoOut(span(t, a.decades + .6, a.decades + 1.5));
  if (cu > 0) F.calSheet(cx, t, w - 150, lerp(-320, 46, cu), 190, 'APR 7', '2026', { rot: (1 - cu) * .4 + .05 });
}

// ---------------------------------------------------------------------------------------------------------------- the lab's list
const LIST = ['1  THE LAB', '2  GOVERNMENT', '3  BIG COMPANIES', '4  DEFENDERS', '5  YOU'];
function list(ctx, t, a, r, u) {
  const len = r.len * .82 * u, pitch = r.len * .82 / 5.4, size = Math.min(35, pitch * .4);
  ctx.save();
  ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(r.x + r.w * .04, r.y + 6, r.w, len);
  ctx.fillStyle = lin(ctx, 0, r.y, 0, r.y + r.len, [[0, mixHex(P.cream, '#e9e1c4', .5)], [1, mixHex(P.cream, P.halo2, .45)]]); ctx.fillRect(r.x, r.y, r.w, len);
  ctx.beginPath(); ctx.rect(r.x, r.y, r.w, len); ctx.clip();
  LIST.forEach((txt, k) => {
    const y = r.y + pitch * (k + .85), bs = size * .9, bx = r.x + r.w - bs * 2;
    E.glowText(ctx, txt, r.x + r.w * .08, y, { size, weight: 600, spacing: .06, col: k === 4 ? mixHex(P.night1, '#8a7a10', .5) : P.night1, glow: false });
    ctx.strokeStyle = rgba(P.night1, .75); ctx.lineWidth = 2.5; ctx.strokeRect(bx, y - bs * .85, bs, bs);
    if (k < 4) F.checkMark(ctx, bx + bs * .55, y - bs * .4, bs * 1.5, sineIO(span(t, a.chose + .1 + k * .28, a.chose + .5 + k * .28)), { w: bs * .12 });
    else { const bl = span(t, a.chose + 1.4, a.chose + 1.8); if (bl > 0) { ctx.fillStyle = rgba(CHECK.halo, .4 * bl * (.5 + .5 * Math.sin(t * 3.2))); ctx.fillRect(bx, y - bs * .85, bs, bs); } }
  });
  ctx.restore();
  // the cap (the roll's lip at the gap) grows in with the list instead of appearing at full size (was a POP at 'Instead' − .5)
  const ku = sineIO(clamp(u / .3)), cw = r.w * 1.06 * lerp(.15, 1, ku), cxm = r.x + r.w / 2;
  ctx.save(); ctx.globalAlpha *= ku;
  ctx.fillStyle = lin(ctx, 0, r.y - r.w * .06, 0, r.y + r.w * .06, [[0, mixHex(P.cream, P.halo2, .6)], [1, mixHex(P.halo2, P.shade1, .5)]]);
  ctx.beginPath(); ctx.roundRect(cxm - cw / 2, r.y - r.w * .06, cw, r.w * .1, r.w * .05); ctx.fill();
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- the giants
const TOWERS = [
  { x: -10200, w: 1500, h: 8600, name: 'APPLE', k: 'apple' },
  { x: -7400, w: 1300, h: 10200, name: 'GOOGLE', k: 'google' },
  { x: -4700, w: 1600, h: 9200, name: 'MICROSOFT', k: 'microsoft' },
  { x: -2000, w: 1400, h: 9800, name: 'JPMORGAN CHASE', k: 'jpm' },
];
const TZ = 36000;
const towerU = (a, t, i) => expoOut(span(t, a.giants - .3 + i * .18, a.giants + 1.3 + i * .18)) * (1 - sineIO(span(t, a.butSafety + .2 + i * .1, a.butSafety + 1.6 + i * .1)));
export function floor(ctx, t, X) {
  const { a, c } = X; if (t < a.giants - .4 || t > a.butSafety + 2) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  TOWERS.forEach((tw, i) => {
    const u = towerU(a, t, i); if (u <= 0) return;
    const b0 = S.proj(c, tw.x - tw.w / 2, 0, TZ), b1 = S.proj(c, tw.x + tw.w / 2, 0, TZ); if (!b0 || !b1) return;
    const s = b0[2], x0 = b0[0], x1 = b1[0], base = b0[1], hh = tw.h * s, top = base - hh * u, wd = x1 - x0;
    ctx.save(); ctx.beginPath(); ctx.rect(x0 - wd, -100, wd * 3, base + 100); ctx.clip();
    ctx.translate(0, hh * (1 - u));
    const y0 = base - hh;
    ctx.fillStyle = lin(ctx, x0, 0, x1, 0, [[0, mixHex(P.night0, P.ind1, .35)], [.75, mixHex(P.night1, P.ind1, .55)], [1, mixHex(P.ind2, GOLD.deep, .25)]]);
    ctx.fillRect(x0, y0 + hh * .08, wd, hh * .92); ctx.fillRect(x0 + wd * .15, y0 + hh * .02, wd * .7, hh * .07); ctx.fillRect(x0 + wd * .47, y0 - hh * .06, Math.max(1, wd * .05), hh * .08);
    ctx.fillStyle = rgba(GOLD.halo, .35); ctx.fillRect(x1 - Math.max(1, wd * .04), y0 + hh * .08, Math.max(1, wd * .04), hh * .92);
    const r = prng(77 + i);
    for (let k = 0; k < 40; k++) { const wx = x0 + wd * (.12 + r() * .7), wy = y0 + hh * (.12 + r() * .82); if (r() < .55) { ctx.fillStyle = rgba(LAMP.body, .35 + .3 * r()); ctx.fillRect(wx, wy, Math.max(1.2, wd * .06), Math.max(1.2, wd * .04)); } }
    ctx.restore();
    tw.top = [x0 + wd / 2, top];
  });
  ctx.restore();
}

export function over(ctx, t, X) {
  const { a, c } = X;
  // ---- 2.01 / 2.02 the glimpse through the gap
  const gm = sineIO(span(t, a.decades - .2, a.decades + 1.1)) * (1 - sineIO(span(t, a.found - .1, a.found + .9)));
  if (gm > 0) {
    F.veil(ctx, .4 * gm);
    F.portal(ctx, S.gapRect(c), PANEL, gm, (cx, w, h) => glimpse(cx, t, a, w, h, gm), { rim: GOLD });
  }
  F.source(ctx, t, a.stranger + .3, a.found + .4, 'OPENBSD · ANTHROPIC, APR 7, 2026');
  // ---- 2.03 "WE DO NOT PLAN TO MAKE … GENERALLY AVAILABLE" · the list out of the gap
  const qu = win(t, a.noPlan - .25, a.second2 + .3, .6, .6);
  say(ctx, '“WE DO NOT PLAN TO MAKE …', 120, 300, 66, qu, { serif: true });
  say(ctx, '… GENERALLY AVAILABLE.”', 120, 380, 66, win(t, a.noPlan + .3, a.second2 + .3, .6, .6), { serif: true });
  say(ctx, 'ANTHROPIC, APR 7, 2026', 124, 428, 24, win(t, a.noPlan + .6, a.second2 + .2), { col: P.halo2, glow: false });
  const lu = sineIO(span(t, a.instead - .5, a.instead + 1.0)) * (1 - sineIO(span(t, a.second2 - .1, a.second2 + .9)));
  if (lu > 0) { const r = tapeRect(c, .56); if (r) list(ctx, t, a, r, lu); }
  // ---- 2.04 mark 2: GOVERNMENT · UP TO 30 DAYS BEFORE RELEASE · EO 14409, VOLUNTARY
  const gl = win(t, a.gov - .1, a.third - .1);
  if (gl > 0) { const m = S.markPt(1), p = S.proj(c, m.x + 40, 0, m.z); if (p) F.label(ctx, p[0], p[1] - 6, 'GOVERNMENT', null, gl, { dx: 60, dy: -170, size: 40, col: GOLD }); }
  say(ctx, 'UP TO 30 DAYS', 120, 250, 84, win(t, a.release - .35, a.third + .1));
  say(ctx, 'BEFORE RELEASE', 120, 350, 84, win(t, a.release - .15, a.third + .1));
  const du = sineIO(span(t, a.test - .6, a.test + .6)) * (1 - sineIO(span(t, a.third - .5, a.third + .8)));
  if (du > 0) F.docSheet(ctx, t, 1500, lerp(H + 60, 200, du), 380, { title: 'EO 14409', lines: 6, band: 'VOLUNTARY', bandU: span(t, a.volunteers - .15, a.volunteers + .45), rot: .03 });
  F.source(ctx, t, a.test + .4, a.third + .2, F.SOURCES.gov);
  // ---- 2.05 the giants' names; NOT YOU. NOT YET.
  TOWERS.forEach((tw, i) => { const u = rise(span(t, a[tw.k] - .1, a[tw.k] + .5)) * (1 - sineIO(span(t, a.notYou - .7, a.notYou - .1))); if (u > 0 && tw.top) F.label(ctx, tw.top[0], tw.top[1] + 10, tw.name, null, u, { dx: 30, dy: i % 2 ? -125 : -46, size: 38, col: GOLD }); });
  say(ctx, 'NOT YOU.', 1060, 250, 112, win(t, a.notYou - .1, a.butSafety + .4));
  say(ctx, 'NOT YET.', 1060, 370, 112, win(t, a.notYet - .1, a.butSafety + .4), { col: GOLD.text });
}
