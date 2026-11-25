// Film 79 · B3 kit (c08–c10): NEW pieces only, the shared libs stay untouched (docs/BRIEF-builders.md §3).
// warmLook (the other 2050, a quote of #74) · searchRing (the search for the one angry face) · marks WON / LOST / OPEN · bench2 (the bench with
// the grandson sitting down, the home window, a taller tower for the wow) · townPath (the path back into town at 6 PM) · blueprint (the street
// that has not been built yet) · clock2 (the brass clock close, with its alarm hand) · inkFig / emptyFrame / gift / subscribe · portalOut.
import * as K from './f79_kit.mjs';
import * as S from './f79_street.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, rad, lin, prng, CARM, AMBER, expoOut, expoIn, sineIO, quartIO } = K;
export const SUB = '#a9b2d8', PALE = '#b8c4f0', REST = '#6a74a8';
export const INKP = { base: '#1f3c8a', lit: '#3a5aa8', shade: '#16296a', deep: '#0e1a4a', hem: .44 };   // blue-ink figure (on paper)
export const PALEP = { base: '#8a9ad8', lit: '#b8c4f0', shade: '#6a78b8', deep: '#4a5898', hem: .44 };   // pale-ink figure (on the night ground)
export const AMBP = { base: '#d99a2a', lit: '#ffc45e', shade: '#8a5a18', deep: '#4a2e10', hem: .3 };     // a warm human (not you)
// type on the night ground (cream, Inter caps by default)
export const T = (c, s, x, y, o = {}) => K.glowText(c, s, x, y, { size: 24, weight: 600, col: P.cream, glow: false, spacing: .12, ...o });

// ---------------------------------------------------------------- the other 2050 (#74): warm light, a gold sun, apple trees, people
// h 8 morning · 12 noon · 18 evening (amber dusk, lanterns). The same material keys as K.hourLook, so every place of the kit draws with it.
export function warmLook(h = 8.4) {
  const L = K.hourLook(12), e = clamp((h - 12) / 7), m = (a, b) => mixHex(a, b, e);
  Object.assign(L, { h: 12, top: m('#4a6ac0', '#2c2a6a'), low: m('#ffd99a', '#f29a5a'), sunCol: m('#fff4cc', '#ffcf8a'), light: m('#ffe6b8', '#ffc890'), shade: m('#5a4a7a', '#4a2f5a'), haze: m('#f2cfa0', '#e8946a'), night: 0 });
  L.sun = [W * lerp(.3, .82, e), H * lerp(.24, .5, e)]; L.dir = h < 13 ? -1 : 1;
  L.ink = mixHex('#2a1a2a', L.shade, .25); L.wall = mixHex('#efd2a6', L.light, .3); L.wallS = mixHex('#a07a6a', L.shade, .5);
  L.roof = mixHex('#c0604a', L.shade, .15); L.roofS = mixHex('#7a3840', L.shade, .35);
  L.leaf = mixHex('#6f9e4c', L.light, .12); L.leafS = mixHex('#3c5e3c', L.shade, .3); L.grass = mixHex('#8fb05c', L.light, .18);
  L.road = mixHex('#9a90a0', L.light, .22); L.roadS = mixHex('#5a5070', L.shade, .4); L.walk = mixHex('#e2ccaa', L.light, .2); L.dim = 1;
  return L;
}
// warm the cold kit colours of a card (the house colours of the street are cold-tinted): a soft gold multiply + a light glaze
export function warmUp(ctx, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = .55 * a; ctx.fillStyle = '#ffb35c'; ctx.fillRect(-3000, -2000, W + 6000, H + 4000); ctx.restore(); }

// ---------------------------------------------------------------- the search ring (c06 → c08: the search for one angry face)
// a cream ring with four ticks that turns slowly, a faint inner fill; o.label (under it), o.n (the count, serif), o.r
export function searchRing(c, t, x, y, r, a = 1, o = {}) {
  if (a <= 0) return; c.save(); c.globalAlpha *= a;
  c.fillStyle = rad(c, x, y, r * 1.6, [[0, rgba('#dfe6ff', .1)], [.6, rgba('#dfe6ff', .05)], [1, rgba('#dfe6ff', 0)]]); c.fillRect(x - r * 1.6, y - r * 1.6, r * 3.2, r * 3.2);
  c.strokeStyle = rgba(P.cream, .92); c.lineWidth = Math.max(2, r * .05); c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke();
  const rot = t * .35; c.lineWidth = Math.max(2, r * .06); c.lineCap = 'round';
  for (let k = 0; k < 4; k++) { const an = rot + k * Math.PI / 2; c.beginPath(); c.moveTo(x + Math.cos(an) * r * 1.08, y + Math.sin(an) * r * 1.08); c.lineTo(x + Math.cos(an) * r * 1.26, y + Math.sin(an) * r * 1.26); c.stroke(); }
  c.strokeStyle = rgba(P.cream, .35); c.lineWidth = 1.5; c.beginPath(); c.arc(x, y, r * .72, rot * -1.3, rot * -1.3 + 4.2); c.stroke();
  if (o.label) { const lw = K.measure(o.label + ' 0', 22, false, 600); T(c, o.label, x - (o.n != null ? 18 : 0), y + r + 44, { size: 22, align: 'center', col: rgba(P.cream, .9), spacing: .14 });
    if (o.n != null) K.glowText(c, String(o.n), x + lw / 2 - 6, y + r + 48, { size: 40, serif: true, align: 'center', col: P.cream, glow: false }); }
  c.restore();
}

// ---------------------------------------------------------------- the way-out marks: WON (amber tick) · LOST (carmine line) · OPEN (an empty ring that breathes)
export function markWon(c, x, y, s, u) { if (u <= 0) return; c.save(); c.strokeStyle = AMBER.body; c.lineWidth = 6 * s; c.lineCap = 'round'; c.lineJoin = 'round';
  c.fillStyle = rad(c, x, y, 60 * s, [[0, rgba(AMBER.body, .22 * u)], [1, rgba(AMBER.body, 0)]]); c.fillRect(x - 60 * s, y - 60 * s, 120 * s, 120 * s);
  K.strokeIn(c, [[x - 20 * s, y + 2 * s], [x - 6 * s, y + 16 * s], [x + 22 * s, y - 18 * s]], expoOut(u)); c.restore(); }
export function markOpen(c, t, x, y, s, u) { if (u <= 0) return; const br = 1 + .07 * Math.sin(t * 1.6); c.save(); c.globalAlpha *= clamp(u * 1.5); c.strokeStyle = P.cream; c.lineWidth = 3.5 * s;
  c.beginPath(); c.arc(x, y, 19 * s * br * lerp(.4, 1, expoOut(u)), -1.57, -1.57 + 6.283 * expoOut(u)); c.stroke(); c.restore(); }
export function markLost(c, x0, x1, y, u, w = 5) { if (u <= 0) return; c.save(); c.strokeStyle = CARM.hot; c.lineWidth = w; c.lineCap = 'round';
  K.strokeIn(c, [[x0, y], [x1, y]], expoOut(u)); c.restore(); }
// a row of the way-out column: label (cream caps), a mark slot at the right; kind 'WON' | 'LOST' | 'OPEN' | null; u = the mark's draw-in
export function stopRow(c, t, x, y, w, label, kind, u, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return; c.save(); c.globalAlpha *= a;
  const hi = o.hi ?? 0;
  if (hi > 0) { c.fillStyle = rgba('#dfe6ff', .07 * hi); c.beginPath(); c.roundRect(x - 24, y - 40, w + 48, 64, 8); c.fill(); }
  c.fillStyle = rgba(P.cream, .9); c.beginPath(); c.arc(x, y - 8, 7, 0, 7); c.fill();
  T(c, label, x + 30, y, { size: o.size ?? 26, col: kind === 'LOST' && u > .5 ? rgba(P.cream, .6) : P.cream });
  const mx = x + w - 40, lw = K.measure(label, o.size ?? 26, false, 600) * 1.12;
  c.strokeStyle = rgba(SUB, .4); c.lineWidth = 2; c.setLineDash([3, 7]); c.beginPath(); c.moveTo(x + 44 + lw, y - 8); c.lineTo(mx - 56, y - 8); c.stroke(); c.setLineDash([]);
  if (kind === 'WON') markWon(c, mx, y - 8, 1, u);
  if (kind === 'OPEN') markOpen(c, t, mx, y - 8, 1, u);
  if (kind === 'LOST') { markLost(c, x + 22, x + 40 + lw, y - 9, u); c.save(); c.globalAlpha *= clamp(u * 2); c.strokeStyle = CARM.hot; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(mx - 18, y - 8); c.lineTo(mx + 18, y - 8); c.stroke(); c.restore(); }
  if (kind && u > 0) T(c, kind, mx + 34, y, { size: 22, col: rgba(P.cream, clamp(u * 2) * .9), spacing: .2 });
  c.restore();
}

// ---------------------------------------------------------------- figures in ink (inside cards and on the night ground)
export function inkFig(c, t, x, y, h, o = {}, pal = PALEP) { return K.figureRaw(c, x, y, h * (1 + .006 * Math.sin(t * 1.7 + x)), { hood: false, look: o.look ?? .1 * Math.sin(t * .6 + x), ...o }, pal, false); }

// ---------------------------------------------------------------- THE BENCH (c09/c10), from PL.bench with: the grandson sitting down (o.boyIn 0..1),
// a warm window at home among the dark roofs (o.home 0..1: the last lamp at home), a taller tower (o.towerH), o.youLook / o.boyLook, o.lean,
// o.holder ('boy' | 'you'), o.wind (0..1 key turns), o.hand (the alarm hand: an angle for clock2 in screen space is the scene's job). Returns anchors.
function benchBack(g, x, y, w, L) {
  g.fillStyle = mixHex('#2a2238', L.shade, .3); g.fillRect(x + 20, y - 90, 14, 200); g.fillRect(x + w - 34, y - 90, 14, 200); g.fillRect(x + w / 2 - 7, y - 90, 14, 200);
  g.fillStyle = mixHex('#4a3e52', L.light, .1); g.fillRect(x, y - 80, w, 24); g.fillRect(x, y - 42, w, 24);
  g.fillStyle = rgba('#e8eefc', .07); g.fillRect(x, y - 80, w, 3); g.fillRect(x, y - 42, w, 3);
}
function stars2(ctx, t, L) { if (L.night > .05) K.stars(ctx, 63, 140, t, [-1400, -900, W + 2800, 900], Math.min(1, L.night + .2)); }
export const HOMEI = 2;   // your home among the far roofs: house i = 2 of the 12000 card (x 300)
export function bench2(ctx, t, cam, L, o = {}) {
  const out = {}, bx = 960 + (o.gap ?? 0), BY = 900, BW = 560, tx = o.tower ?? 1380, th = o.towerH ?? 330, tw = o.towerW ?? th * .21;
  K.stage(ctx, cam, [
    [40000, () => { K.sky(ctx, t, L, { horizon: 700, sun: false, clouds: 2, seed: 51 }); stars2(ctx, t, L); }],
    [12000, () => {
      K.hills(ctx, 700, 30, null, 2, { grad: [K.hz(L.leafS, 12000, L), K.hz(L.leafS, 9000, L)], x0: -3000, x1: W + 3000 });
      out.tower = S.tower(ctx, t, tx, 706, tw, th, L); S.fence(ctx, t, tx - 420 - th * .4, tx + 420 + th * .4, 712, 16, L);
      for (let i = -4; i < 13; i++) { const x = -260 + i * 280; if (Math.abs(x + 90 - tx) < 140 + tw * .6) continue;
        const g = K.house(ctx, x, 712, 180, 150 + (((i % 3) + 3) % 3) * 20, L, { col: '#5a5a7a', lit: 0, roofH: 50, t, side: i < 4 ? 1 : -1 });
        if (i === (o.homeI ?? HOMEI) && (o.home ?? 0) > 0) { const [wx, wy, ww, wh] = g.win[1]; const a = o.home;
          ctx.fillStyle = rad(ctx, wx + ww / 2, wy + wh / 2, ww * 4, [[0, rgba('#ffcf7a', .32 * a)], [1, rgba('#ffb35c', 0)]]); ctx.fillRect(wx - ww * 4, wy - ww * 4, ww * 9, ww * 9);
          ctx.globalAlpha = a; ctx.fillStyle = lin(ctx, 0, wy, 0, wy + wh, [[0, '#fff0c4'], [1, '#f2b25e']]); ctx.fillRect(wx, wy, ww, wh); ctx.globalAlpha = 1; out.home = [wx + ww / 2, wy + wh / 2]; } }
    }],
    [3600, () => { K.band(ctx, 740, 1400, mixHex('#1c2250', L.light, .08), mixHex('#0b1030', L.shade, .2), -3000, W + 3000); ctx.fillStyle = mixHex('#0b1030', L.shade, .2); ctx.fillRect(-3000, 1399, W + 6000, 3000); S.lamp(ctx, t, bx - 40, 1000, 760, L, 1, o.lamp ?? 1); out.lamp = [bx - 40 + 760 * .15, 1000 - 760 + 760 * .03]; }],
    [2000, () => {
      const x0 = bx - BW / 2;
      // the figures sit behind the backrest: hide them inside the bench box, keep them whole outside it (so he can walk in from the right)
      ctx.save(); ctx.beginPath(); ctx.rect(-3000, -2000, W + 6000, 5000); ctx.rect(x0 - 12, BY - 56, BW + 24, 700); ctx.clip('evenodd');
      K.you(ctx, t, bx - 130, BY + 200, 400, { back: .75, look: o.youLook ?? (.25 + .08 * Math.sin(t * .35)), dir: 1, lean: -.02, armR: o.holder === 'you' ? [.9, 2.3] : undefined });
      let hd = null;
      if (o.boy !== false) {
        const bi = o.boyIn ?? 1, walk = clamp(bi / .62), sit = clamp((bi - .62) / .38), e = sineIO(sit);
        const x = lerp(lerp(bx + 760, bx + BW / 2 + 70, sineIO(walk)), bx + 140, e), y = lerp(1012, BY + 152 + 6 * (o.lean ?? 0), e);
        hd = S.boy(ctx, t, x, y, 300, { back: .75, dir: -1, look: o.boyLook ?? (-.35 - .3 * (o.lean ?? 0)), lean: -.1 * (o.lean ?? 0) + .08 * Math.sin(Math.PI * sit), walk: walk < 1 ? t * 5.2 : undefined, pose: walk < 1 ? 'walk' : undefined, view: walk < 1 ? 'side' : undefined, armR: o.holder !== 'you' ? [.8, 2.4] : undefined });
      }
      ctx.restore();
      if (o.clock) { const cx = o.holder === 'you' ? bx - 70 : (hd ? hd.R[0] - 10 : bx + 90), cy = (o.holder === 'you' ? BY - 120 : (hd ? hd.R[1] - 16 : BY - 110)) - 3 * Math.sin(t * .6);
        S.alarmClock(ctx, t, cx, cy, .38 * o.clock, { ring: o.ring ?? 0, rot: (o.wind ?? 0) * .03 * Math.sin(t * 9) });
        if (o.wind) { ctx.save(); ctx.translate(cx + 28, cy - 4); ctx.rotate(t * 3.2 * o.wind); ctx.fillStyle = '#c99a4c'; ctx.fillRect(-3, -12, 6, 24); ctx.fillRect(-11, -12, 22, 5); ctx.restore(); }
        K.halo(ctx, cx, cy, 80, .22); out.clock = [cx, cy, 26]; }
      benchBack(ctx, x0, BY, BW, L);
      if (o.focus2) o.focus2(ctx, t, out);
    }],
    [1150, () => { if (o.fore !== false) { ctx.fillStyle = mixHex('#0b1030', '#060a24', .5); ctx.beginPath(); ctx.roundRect(-300, 1040, 700, 200, 10); ctx.fill(); ctx.beginPath(); ctx.roundRect(1600, 1060, 700, 200, 10); ctx.fill(); } if (o.focus) o.focus(ctx, t, out); }],
  ]);
  return out;
}

// ---------------------------------------------------------------- THE PATH BACK INTO TOWN (6 PM): a footpath across the dark meadow to the town
// with its clock tower; tiny friend windows in the town; the tower behind the fence far right. o.you [x, y, h] on the 1700 card, o.walk phase.
export function townPath(ctx, t, cam, L, o = {}) {
  const out = {};
  K.stage(ctx, cam, [
    [40000, () => { K.sky(ctx, t, L, { horizon: 640, sun: false, clouds: 3, seed: 33 }); stars2(ctx, t, L); }],
    [14000, () => { K.hills(ctx, 640, 46, null, 6, { grad: [K.hz(L.leafS, 14000, L), K.hz(L.leafS, 9000, L)] }); out.tower = S.tower(ctx, t, 1720, 648, 90, 420, L); S.fence(ctx, t, 1350, 2200, 652, 22, L); }],
    [7000, () => {
      const col = mixHex('#1a1c48', L.shade, .3); K.townLine(ctx, 260, 1160, 668, col, L, { towerX: 700, seed: 7 });
      const r = prng(19); for (let k = 0; k < 26; k++) { const x = 280 + r() * 860, y = 640 - r() * 50; if (Math.abs(x - 700) < 30) continue; K.friendWindows(ctx, t + k, [[x, y, 7, 9]], .85); }
      out.face = [700, 668 - 160, 10];
    }],
    [3400, () => { K.band(ctx, 690, 1400, mixHex('#1c2a4a', L.light, .1), mixHex('#0c1434', L.shade, .3), -2400, W + 2400);
      ctx.fillStyle = lin(ctx, 0, 690, 0, 1000, [[0, mixHex('#4a4e7a', L.haze, .3)], [1, mixHex('#5a5e8a', L.light, .15)]]);   // the path, from the town gate down to us
      ctx.beginPath(); ctx.moveTo(690, 692); ctx.quadraticCurveTo(900, 760, 820, 860); ctx.quadraticCurveTo(700, 990, 980, 1200); ctx.lineTo(1460, 1200); ctx.quadraticCurveTo(1040, 1000, 1020, 870); ctx.quadraticCurveTo(1020, 770, 712, 692); ctx.closePath(); ctx.fill(); }],
    [1700, () => { if (o.you) K.you(ctx, t, o.you[0], o.you[1], o.you[2], { walk: o.walk, pose: o.walk != null ? 'walk' : undefined, view: o.walk != null ? 'side' : undefined, dir: -1, look: .05 }); }],
    [1150, () => { ctx.fillStyle = mixHex('#0a1030', '#060a24', .4); const r = prng(3); for (let k = 0; k < 40; k++) { const x = -200 + k * 60 + r() * 30, h = 30 + r() * 60, sw = Math.sin(t * .8 + k) * 4;
      ctx.beginPath(); ctx.moveTo(x - 10, 1120); ctx.quadraticCurveTo(x + sw, 1120 - h, x + 4 + sw * 1.5, 1110 - h); ctx.quadraticCurveTo(x + 6, 1110 - h * .5, x + 12, 1120); ctx.fill(); }
      ctx.fillRect(-400, 1090, W + 800, 200); }],
  ]);
  return out;
}

// ---------------------------------------------------------------- THE BLUEPRINT STREET (W.02–W.03): the same street, not built yet, drawn as a plan
// o.u 0..1 draws the lines (back → front), o.door 0..1 your door turns real (amber), o.light 0..1 morning light out of the door, o.wait (0..1 the
// figure waiting at the kerb, in colour), o.tower 0..1 (a dashed outline: not built either). Returns { door } (design coords on the 2600 card).
const BP = { ground: '#0c1a52', line: '#b8ccff', faint: '#5a74c0' };
function bpHouse(c, x, base, w, h, rh, u, o = {}) {
  const pts = [[x, base], [x, base - h], [x - w * .06, base - h], [x + w / 2, base - h - rh], [x + w + w * .06, base - h], [x + w, base - h], [x + w, base], [x, base]];
  K.strokeIn(c, pts, u); if (u < .6) return;
  const k = span(u, .6, 1), ww = w * .2, wh = h * .2;
  c.save(); c.globalAlpha *= k;
  for (let r = 0; r < 2; r++) for (let q = 0; q < 2; q++) { if (r === 1 && q === (o.doorCol ?? 0)) continue; const wx = x + w * (.18 + q * .64), wy = base - h + h * (.16 + r * .62); c.strokeRect(wx, wy, ww, wh); }
  const dw = w * .2, dh = h * .34, dx = x + w * (o.doorCol === 1 ? .66 : .16); c.strokeRect(dx, base - dh, dw, dh);
  c.restore(); return [dx, base - dh, dw, dh];
}
export function blueprint(ctx, t, cam, o = {}) {
  const u = o.u ?? 1, out = {}, VP = S.VP, hw = (y) => Math.max(0, (y - VP[1]) * 1.35);
  const ln = (c, Z) => { c.strokeStyle = BP.line; c.lineWidth = Math.max(1.4, 2.2 * Z / 2600); c.lineCap = 'round'; c.lineJoin = 'round'; };
  K.stage(ctx, cam, [
    [40000, () => { ctx.fillStyle = lin(ctx, 0, -600, 0, 1400, [[0, '#081240'], [1, BP.ground]]); ctx.fillRect(-3000, -2000, W + 6000, H + 4000);
      ctx.strokeStyle = rgba(BP.faint, .22); ctx.lineWidth = 2; for (let x = -3000; x < W + 3000; x += 80) { ctx.beginPath(); ctx.moveTo(x, -2000); ctx.lineTo(x, H + 2000); ctx.stroke(); } for (let y = -2000; y < H + 2000; y += 80) { ctx.beginPath(); ctx.moveTo(-3000, y); ctx.lineTo(W + 3000, y); ctx.stroke(); }
      const m = (o.morning ?? 0); if (m > 0) { ctx.fillStyle = rad(ctx, W * .2, H * .2, 1400, [[0, rgba('#ffd9a0', .16 * m)], [1, rgba('#ffd9a0', 0)]]); ctx.fillRect(-3000, -2000, W + 6000, H + 4000); } }],
    [16000, () => { ln(ctx, 16000); K.strokeIn(ctx, [[-1400, 596], [W + 1400, 596]], span(u, 0, .25));
      const ta = o.tower ?? 0; if (ta > 0) { ctx.save(); ctx.globalAlpha *= ta * .5; ctx.setLineDash([10, 12]); const T0 = S.TOWER; ctx.strokeRect(T0.x - T0.w / 2, T0.base - T0.h, T0.w, T0.h); ctx.restore(); } }],
    [7000, () => { ln(ctx, 7000); [[470, 1], [620, 1], [1170, -1], [1320, -1]].forEach(([x], i) => bpHouse(ctx, x, 600, 140, 120, 53, span(u, .12 + i * .03, .42 + i * .03)));
      for (const s of [-1, 1]) K.strokeIn(ctx, [[VP[0] + s * hw(600), 600], [VP[0] + s * hw(668), 668]], span(u, .1, .3)); }],
    [4200, () => { ln(ctx, 4200); bpHouse(ctx, 330, 668, 230, 200, 87, span(u, .25, .6)); bpHouse(ctx, 1330, 668, 230, 200, 87, span(u, .28, .62));
      for (const s of [-1, 1]) K.strokeIn(ctx, [[VP[0] + s * hw(650), 650], [VP[0] + s * hw(790), 790]], span(u, .25, .45));
      ctx.setLineDash([14, 22]); K.strokeIn(ctx, [[VP[0], 650], [VP[0], 790]], span(u, .3, .5)); ctx.setLineDash([]); }],
    [2600, () => { ln(ctx, 2600);
      const d = bpHouse(ctx, -330, 800, 560, 470, 190, span(u, .4, .85), { doorCol: 1 }); bpHouse(ctx, 1640, 800, 560, 440, 180, span(u, .45, .88), { doorCol: 1 });
      for (const s of [-1, 1]) K.strokeIn(ctx, [[VP[0] + s * hw(770), 770], [VP[0] + s * hw(1100), 1100]], span(u, .4, .7));
      ctx.setLineDash([22, 30]); K.strokeIn(ctx, [[VP[0], 770], [VP[0], 1100]], span(u, .45, .7)); ctx.setLineDash([]);
      if (d) { out.door = d; const dr = o.door ?? 0, [dx, dy, dw, dh] = d;
        if (dr > 0) { const lt = o.light ?? 0;
          if (lt > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, dy + dh, 0, dy + dh + 260, [[0, rgba('#ffd98a', .35 * lt)], [1, rgba('#ffd98a', 0)]]);
            ctx.beginPath(); ctx.moveTo(dx, dy + dh); ctx.lineTo(dx + dw, dy + dh); ctx.lineTo(dx + dw + 160, dy + dh + 260); ctx.lineTo(dx - 60, dy + dh + 260); ctx.closePath(); ctx.fill(); ctx.restore(); }
          ctx.save(); ctx.globalAlpha *= dr; ctx.fillStyle = lin(ctx, 0, dy, 0, dy + dh, [[0, '#ffd36a'], [1, '#d99a2a']]); ctx.fillRect(dx, dy, dw, dh);
          const op = lt * .55; if (op > 0) { ctx.fillStyle = lin(ctx, dx, 0, dx + dw, 0, [[0, '#fff3d0'], [1, '#ffd98a']]); ctx.fillRect(dx, dy, dw * op, dh); ctx.fillStyle = '#b07a22'; ctx.fillRect(dx + dw * op - 3, dy, 6, dh); }
          ctx.fillStyle = rgba('#4a2e10', .5); ctx.fillRect(dx + dw * .78, dy + dh * .5, 5, 5); ctx.restore(); } } }],
    [1700, () => { const wa = o.wait ?? 0; if (wa > 0) { ctx.save(); ctx.globalAlpha *= wa; K.shadowEl(ctx, 520, 1030, 70, { ink: '#000418', dir: -1 }, .4);
      K.figureRaw(ctx, 520, 1030, 250 * (1 + .006 * Math.sin(t * 1.4)), { hood: false, look: .2 + .1 * Math.sin(t * .5), dir: -1, pose: 'stand' }, AMBP, false); ctx.restore(); } if (o.focus) o.focus(ctx, t, out); }],
  ]);
  return out;
}

// ---------------------------------------------------------------- the brass clock close (W.29): face, hands, the red alarm hand at o.alarm (rad), key
export function clock2(ctx, t, x, y, s, o = {}) {
  const sh = (o.ring ?? 0) * Math.sin(t * 70) * .05;
  ctx.save(); ctx.translate(x, y); ctx.rotate(sh + (o.rot ?? 0)); ctx.scale(s, s);
  const brass = lin(ctx, -60, -60, 60, 60, [[0, '#ffe2a0'], [.5, '#d4a24c'], [1, '#8a5a24']]);
  ctx.fillStyle = brass; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 40, -58, 26, Math.PI, 0); ctx.fill(); }
  ctx.fillRect(-4, -92, 8, 20); ctx.fillStyle = '#6a4418'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 30, 52); ctx.lineTo(sx * 46, 74); ctx.lineTo(sx * 38, 74); ctx.lineTo(sx * 22, 54); ctx.fill(); }
  ctx.fillStyle = brass; ctx.beginPath(); ctx.arc(0, 0, 62, 0, 7); ctx.fill();
  ctx.fillStyle = '#fbf4e0'; ctx.beginPath(); ctx.arc(0, 0, 50, 0, 7); ctx.fill();
  ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 2.4; for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 41, Math.sin(a) * 41); ctx.lineTo(Math.cos(a) * 46, Math.sin(a) * 46); ctx.stroke(); }
  ctx.fillStyle = '#3a2a1a'; ctx.font = '600 9px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; for (const [n, a] of [[12, -1.5708], [3, 0], [6, 1.5708], [9, 3.1416]]) ctx.fillText(String(n), Math.cos(a) * 33, Math.sin(a) * 33 + .5); ctx.textBaseline = 'alphabetic';
  ctx.lineWidth = 3.4; ctx.lineCap = 'round'; const hh = o.hh ?? -1.9, mm = o.mm ?? -.67; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(hh) * 24, Math.sin(hh) * 24); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(mm) * 36, Math.sin(mm) * 36); ctx.stroke();
  const al = o.alarm ?? -2.4; ctx.strokeStyle = '#c8473a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(al) * 34, Math.sin(al) * 34); ctx.stroke(); ctx.fillStyle = '#c8473a'; ctx.beginPath(); ctx.arc(Math.cos(al) * 34, Math.sin(al) * 34, 2.4, 0, 7); ctx.fill();
  ctx.fillStyle = '#3a2a1a'; ctx.beginPath(); ctx.arc(0, 0, 3.2, 0, 7); ctx.fill();
  ctx.fillStyle = rgba('#ffffff', .35); ctx.beginPath(); ctx.ellipse(-18, -22, 14, 7, -.6, 0, 7); ctx.fill();
  if (o.key != null) { ctx.save(); ctx.translate(66, 8); ctx.rotate(o.key); ctx.fillStyle = '#c99a4c'; ctx.fillRect(-3, -14, 6, 28); ctx.fillRect(-12, -14, 24, 6); ctx.restore(); }
  ctx.restore();
  return [x, y, 62 * s];
}

// ---------------------------------------------------------------- explainer props
// an empty picture frame (E.05): cream moulding, dark inside, a faint sheen; fold 0..1 flattens it to a line
export function emptyFrame(c, t, x, y, w, h, u, fold = 0) {
  if (u <= 0) return; const e = expoOut(clamp(u)), sy = (1 - quartIO(fold)) * lerp(.2, 1, e), cy = y + h / 2;
  c.save(); c.globalAlpha *= clamp(u * 2); c.translate(x + w / 2, cy); c.scale(lerp(.8, 1, e), Math.max(.004, sy)); c.translate(-w / 2, -h / 2);
  c.fillStyle = rgba('#05081e', .75); c.fillRect(8, 8, w - 16, h - 16);
  c.fillStyle = rad(c, w * .3, h * .3, w, [[0, rgba('#8a9ad8', .07)], [1, rgba('#8a9ad8', 0)]]); c.fillRect(8, 8, w - 16, h - 16);
  c.strokeStyle = mixHex('#e8dcc0', '#8a7a60', .25); c.lineWidth = 14; c.strokeRect(0, 0, w, h); c.strokeStyle = rgba('#fff8e8', .5); c.lineWidth = 2; c.strokeRect(-6, -6, w + 12, h + 12); c.strokeRect(9, 9, w - 18, h - 18);
  c.restore();
}
// a gift box (E.07): body + ribbon; open 0..1 lifts the lid; inside(c) draws what was in it (above the box)
export function gift(c, t, x, y, s, u, open = 0, inside = null) {
  if (u <= 0) return; const e = expoOut(clamp(u)), bob = 3 * Math.sin(t * 1.3 + x);
  c.save(); c.translate(x, y + (1 - e) * 40 + bob); c.scale(s * e, s * e);
  if (open > 0 && inside) { c.save(); c.globalAlpha *= clamp(open * 1.6); inside(c, open); c.restore(); }
  c.fillStyle = lin(c, -60, -90, 60, 0, [[0, '#e9dfc6'], [1, '#b9ab8c']]); c.fillRect(-60, -90, 120, 90);
  c.fillStyle = CARM.body; c.fillRect(-9, -90, 18, 90);
  const lift = quartIO(clamp(open)) * 70, rot = -.5 * quartIO(clamp(open));
  c.save(); c.translate(-66, -96 - lift); c.rotate(rot); c.fillStyle = lin(c, 0, 0, 132, 0, [[0, '#f4ead2'], [1, '#c9bb9c']]); c.fillRect(0, 0, 132, 22); c.fillStyle = CARM.body; c.fillRect(57, 0, 18, 22);
  c.strokeStyle = CARM.hot; c.lineWidth = 6; c.beginPath(); c.ellipse(52, -10, 18, 11, -.4, 0, 7); c.stroke(); c.beginPath(); c.ellipse(80, -10, 18, 11, .4, 0, 7); c.stroke(); c.restore();
  c.restore();
}
// the subscribe pill (W.26/W.27): rises (u), pressed on the word (press 0..1 a quick dip and a fill)
export function subscribe(c, t, x, y, u, press = 0) {
  if (u <= 0) return; const e = expoOut(clamp(u)), dip = 1 - .05 * Math.sin(Math.PI * clamp(press * 2.5)), w = 300, h = 66, f = clamp(press * 3);
  c.save(); c.globalAlpha *= clamp(u * 2); c.translate(x, y + (1 - e) * 30); c.scale(dip, dip);
  c.fillStyle = rgba('#060a24', .5); c.beginPath(); c.roundRect(-w / 2 + 6, -h / 2 + 10, w, h, h / 2); c.fill();
  c.fillStyle = f > 0 ? mixHex('#fbf5e4', '#ffd98a', f * .5) : '#fbf5e4'; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, h / 2); c.fill();
  c.fillStyle = '#1f2a5a'; c.font = '700 26px Inter'; c.letterSpacing = '0.14em'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('SUBSCRIBE', 18, 2); c.letterSpacing = '0em'; c.textBaseline = 'alphabetic';
  c.save(); c.translate(-w / 2 + 44, 0); c.rotate(.25 * Math.sin(Math.PI * 4 * clamp(press)) * (1 - clamp(press)));   // a small bell
  c.fillStyle = '#d99a2a'; c.beginPath(); c.moveTo(-12, 8); c.quadraticCurveTo(-12, -14, 0, -15); c.quadraticCurveTo(12, -14, 12, 8); c.lineTo(15, 11); c.lineTo(-15, 11); c.closePath(); c.fill(); c.beginPath(); c.arc(0, 14, 4, 0, 7); c.fill(); c.restore();
  c.restore();
}
// reverse portal: A (a close view inside a window of B) shrinks back into that window while B pulls back to identity
export const portalOut = (win) => (ctx, u, dA, dB, t) => K.portal(ctx, 1 - u, typeof win === 'function' ? win(t) : win, dB, dA);
// a slow EXPL stage: night ground + the design point (cx, cy) at the screen centre, zoom z0 → z1 and pan cx0 → cx1 over [a, b] (sine), plus a small drift
// (nothing stands still). expl.at(t, …) maps a design point to the screen for carriers.
export function expl(ctx, t, a, b, fn, o = {}) {
  const u = sineIO(span(t, a, b)), z = lerp(o.z0 ?? 1, o.z1 ?? 1.05, u), cx = lerp(o.cx0 ?? W / 2, o.cx1 ?? o.cx0 ?? W / 2, u), cy = lerp(o.cy0 ?? H / 2, o.cy1 ?? o.cy0 ?? H / 2, u);
  K.dusk(ctx, t, { glow: o.glow, warm: o.warm });
  K.scr(ctx, (c) => { c.translate(W / 2 + K.drift(t, 3, 1.3), H / 2 + K.drift(t, 2, 4.1)); c.scale(z, z); c.translate(-cx, -cy); fn(c, z); });
}
export function explAt(t, a, b, o, x, y) {
  const u = sineIO(span(t, a, b)), z = lerp(o.z0 ?? 1, o.z1 ?? 1.05, u), cx = lerp(o.cx0 ?? W / 2, o.cx1 ?? o.cx0 ?? W / 2, u), cy = lerp(o.cy0 ?? H / 2, o.cy1 ?? o.cy0 ?? H / 2, u);
  return [W / 2 + K.drift(t, 3, 1.3) + (x - cx) * z, H / 2 + K.drift(t, 2, 4.1) + (y - cy) * z, z];
}

// ================================================================ c10 pieces
// a keyed EXPL stage: keys [[t, cx, cy, z]] (sine between keys) + the small drift; at(t, x, y) maps a design point to the screen
export function explKAt(t, keys) {
  let i = 0; while (i < keys.length - 2 && t > keys[i + 1][0]) i++;
  const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)], u = b[0] > a[0] ? sineIO(span(t, a[0], b[0])) : 1;
  return { cx: lerp(a[1], b[1], u), cy: lerp(a[2], b[2], u), z: Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), u)) };
}
export function explK(ctx, t, keys, fn, o = {}) {
  const { cx, cy, z } = explKAt(t, keys);
  K.dusk(ctx, t, { glow: o.glow, warm: o.warm });
  K.scr(ctx, (c) => { c.translate(W / 2 + K.drift(t, 3, 1.3), H / 2 + K.drift(t, 2, 4.1)); c.scale(z, z); c.translate(-cx, -cy); fn(c, z); });
}
export function explKP(t, keys, x, y) { const { cx, cy, z } = explKAt(t, keys); return [W / 2 + K.drift(t, 3, 1.3) + (x - cx) * z, H / 2 + K.drift(t, 2, 4.1) + (y - cy) * z, z]; }
// a whole full-frame scene (cards) drawn into a rect of the current screen space (a picture on a postcard). Call inside K.scr: it composes
// with the carrier's OUTER transform (read from the canvas), clips to the rect and covers it like K.portal shows B at u = 0.
export function inset(c, rect, drawFull) {
  const [x, y, w, h] = rect, M = c.getTransform(), k0 = M.a, k = Math.max(w / W, h / H);
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
  const ex = x + w / 2 - W / 2 * k, fy = y + h / 2 - H / 2 * k;
  K.outer({ k: k0 * k, e: M.e + k0 * ex, f: M.f + k0 * fy }, () => drawFull(c));
  c.restore();
}
// the institutions of W.04 (flat, night-blue, a cream window light): employer · government · ballot box
export function employer(c, x, y, s, a = 1) { if (a <= 0) return; c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(s, s); c.fillStyle = lin(c, -90, 0, 90, 0, [[0, '#2a3470'], [1, '#1a2054']]); c.fillRect(-90, -120, 180, 120); c.fillRect(30, -170, 34, 60);
  c.fillStyle = rgba('#e8eefc', .5); for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) c.fillRect(-72 + k * 40, -104 + r * 34, 22, 18); c.restore(); }
export function government(c, x, y, s, a = 1) { if (a <= 0) return; c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(s, s); c.fillStyle = '#2a3470'; c.beginPath(); c.moveTo(-110, -110); c.lineTo(0, -170); c.lineTo(110, -110); c.fill();
  c.fillStyle = '#1a2054'; c.fillRect(-110, -110, 220, 14); c.fillRect(-120, -12, 240, 14); c.fillStyle = rgba('#e8eefc', .55); for (let k = 0; k < 5; k++) c.fillRect(-88 + k * 42, -94, 14, 82); c.restore(); }
export function ballot(c, t, x, y, s, a = 1, drop = 0) { if (a <= 0) return; c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(s, s);
  if (drop > 0 && drop < 1) { const yy = lerp(-170, -96, expoIn(drop)); c.fillStyle = '#f3efe2'; c.save(); c.translate(0, yy); c.rotate(.08 * Math.sin(t * 3)); c.fillRect(-26, -34, 52, 40); c.fillStyle = rgba('#1f2a5a', .6); c.fillRect(-16, -24, 30, 3); c.fillRect(-16, -14, 22, 3); c.restore(); }
  c.fillStyle = lin(c, 0, -110, 0, 0, [[0, '#2f3a7a'], [1, '#1a2054']]); c.beginPath(); c.moveTo(-80, -100); c.lineTo(80, -100); c.lineTo(70, 0); c.lineTo(-70, 0); c.closePath(); c.fill();
  c.fillStyle = '#3a4688'; c.fillRect(-90, -116, 180, 18); c.fillStyle = '#0b1238'; c.fillRect(-40, -110, 80, 6); c.fillStyle = rgba('#e8eefc', .5); c.fillRect(-30, -64, 60, 6); c.restore(); }
// the other 2050: an apple tree (round crown, red apples), and a car of #74 with people in it (no crates, no carmine strip)
export function appleTree(c, t, x, base, s, L) {
  const sw = Math.sin(t * .7 + x) * 3 * s;
  c.fillStyle = mixHex('#5a3a2a', L.shade, .3); c.beginPath(); c.moveTo(x - 9 * s, base); c.lineTo(x - 5 * s, base - 120 * s); c.lineTo(x + 5 * s, base - 120 * s); c.lineTo(x + 9 * s, base); c.fill();
  const cy = base - 170 * s; c.fillStyle = rad(c, x - 30 * s, cy - 40 * s, 140 * s, [[0, mixHex(L.leaf, L.light, .35)], [.6, L.leaf], [1, L.leafS]]);
  for (const [dx, dy, r] of [[0, 0, 82], [-56, 22, 58], [58, 18, 60], [-22, -46, 56], [30, -40, 52]]) { c.beginPath(); c.arc(x + dx * s + sw, cy + dy * s, r * s, 0, 7); c.fill(); }
  c.fillStyle = mixHex('#d8402e', L.light, .15); const r = prng(Math.round(x)); for (let k = 0; k < 11; k++) { const a = r() * 6.283, d = r() * 70; c.beginPath(); c.arc(x + Math.cos(a) * d * s + sw, cy + Math.sin(a) * d * .8 * s + 8 * s, 7 * s, 0, 7); c.fill(); }
}
export function podWarm(c, t, x, base, s, L, dir = -1, n = 2) {
  K.pod(c, x, base, s, L, { dir, status: false, cyan: false, t });
  const w = 230 * s, h = 110 * s; c.save(); c.translate(x, base); c.scale(dir, 1);
  c.beginPath(); c.moveTo(-w * .32, -h * .48); c.bezierCurveTo(-w * .3, -h * .82, -w * .12, -h * .9, w * .08, -h * .9); c.bezierCurveTo(w * .28, -h * .9, w * .36, -h * .7, w * .38, -h * .48); c.closePath(); c.clip();
  c.fillStyle = rgba('#ffd98a', .25); c.fillRect(-w / 2, -h, w, h);
  const cols = ['#c4583a', '#d99a2a', '#6a86c4', '#a676a6'];
  for (let k = 0; k < n; k++) { const hx = lerp(-w * .18, w * .2, n > 1 ? k / (n - 1) : .5), hy = -h * .58 + 2 * Math.sin(t * 2 + k), hr = h * (k === n - 1 && n > 2 ? .1 : .13);
    c.fillStyle = cols[k % cols.length]; c.beginPath(); c.ellipse(hx, hy + hr * 1.9, hr * 1.3, hr * 1.1, 0, Math.PI, 0); c.fill(); c.fillStyle = mixHex('#3a2a2a', L.shade, .2); c.beginPath(); c.arc(hx, hy, hr, 0, 7); c.fill(); }
  c.restore();
}
// the #74 postcard: a warm picture (inset of a full scene), the title strip; x, y, w, h in screen space; flip 0..1 (scaleX through 0 at .5)
export function postcard(c, t, x, y, w, h, drawFull, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return null; const pic = [x + 18, y + 18, w - 36, h - 36 - (o.strip ?? 96)];
  c.save(); c.globalAlpha *= a;
  c.fillStyle = rgba('#060a24', .35); c.beginPath(); c.roundRect(x + 10, y + 16, w, h, 8); c.fill();
  c.fillStyle = lin(c, x, y, x + w, y + h, [[0, '#fbf3df'], [1, '#efdfbe']]); c.beginPath(); c.roundRect(x, y, w, h, 8); c.fill();
  c.restore();
  if (drawFull) inset(c, pic, drawFull); else { c.fillStyle = '#f2c98a'; c.fillRect(...pic); }
  c.save(); c.globalAlpha *= a; c.strokeStyle = rgba('#7a5a3a', .35); c.lineWidth = 2; c.strokeRect(...pic);
  const sy = pic[1] + pic[3], fs = o.size ?? 30;
  c.fillStyle = '#3a2a1a'; c.font = `600 ${fs}px Inter`; c.letterSpacing = '0.14em'; c.textAlign = 'left'; c.fillText('YOUR LIFE IN 2050', x + 22, sy + fs * 1.45);
  c.fillStyle = '#b0582e'; c.font = `600 ${Math.round(fs * .8)}px Inter`; c.fillText('IF WE GET AI RIGHT', x + 22, sy + fs * 2.6); c.letterSpacing = '0em';
  if (o.tag !== false) { c.fillStyle = rgba('#3a2a1a', .6); c.font = `500 ${Math.round(fs * .6)}px Inter`; c.textAlign = 'right'; c.fillText(o.tag || 'THE OTHER FILM · WATCH NEXT', x + w - 22, sy + fs * 2.6); c.textAlign = 'left'; }
  c.restore();
  return pic;
}
// soft carriers (smooth.py: the revealed AREA grows linearly in time, so a bright B never floods in one burst). For out: { k: 'fn', fn: … }.
// irisSoft: c(t) → [cx, cy, r0] (time only: fn carriers get no shot helpers); portalSoft: win(t) → [x, y, w, h]
export const irisSoft = (cf, o = {}) => (ctx, u, dA, dB, t) => {
  const [cx, cy, r0] = typeof cf === 'function' ? cf(t) : cf, e = sineIO(clamp(u)), R = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) * 1.02;
  const r = Math.sqrt(r0 * r0 + (R * R - r0 * r0) * e), zA = 1 + e * (o.pushA ?? .25);
  K.outer({ k: zA, e: cx - cx * zA, f: cy - cy * zA }, () => dA(ctx));
  const k = lerp(o.k0 ?? .72, 1, e), bx = lerp(cx, W / 2, e), by = lerp(cy, H / 2, e);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.clip();
  K.outer({ k, e: bx - W / 2 * k, f: by - H / 2 * k }, () => dB(ctx)); ctx.restore();
  if (e < .98) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = rgba(o.rim || '#fff2c4', .85 * (1 - e)); ctx.lineWidth = 4; ctx.shadowColor = rgba('#f2b632', .8); ctx.shadowBlur = 18; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke(); ctx.restore(); }
};
export const portalSoft = (wf) => (ctx, u, dA, dB, t) => {
  const win = typeof wf === 'function' ? wf(t) : wf, e = sineIO(clamp(u)), cx = win[0] + win[2] / 2, cy = win[1] + win[3] / 2, zEnd = Math.max(W / win[2], H / win[3]) * 1.04;
  const z = Math.sqrt(1 + (zEnd * zEnd - 1) * e), g = Math.log(z) / Math.log(zEnd);
  const ox = lerp(cx, W / 2, g), oy = lerp(cy, H / 2, g), mA = { k: z, e: ox - cx * z, f: oy - cy * z };
  K.outer(mA, () => dA(ctx));
  const kb0 = Math.max(win[2] / W, win[3] / H), kb = Math.exp(lerp(Math.log(kb0), Math.log(1 / zEnd), g)) * z;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(mA.e + win[0] * z, mA.f + win[1] * z, win[2] * z, win[3] * z); ctx.clip();
  K.outer({ k: kb, e: ox - W / 2 * kb, f: oy - H / 2 * kb }, () => dB(ctx)); ctx.restore();
};
