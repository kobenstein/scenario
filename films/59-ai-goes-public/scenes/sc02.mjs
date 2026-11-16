// c02 · Out of the window: the city, the crystal = ANTHROPIC · NASDAQ: ANT, first trade expected · the card turns: $70–78, 825M shares ·
// 2nd-largest IPO by money raised (a ranked list; its gold ANT row becomes the BUY button) · "what sits behind the button" · you, the jar,
// a slice drifts down from the crystal (it does not land yet).
// T.G('The seller is Anthropic') → T.G('So before the opening bell') · builder B1. Plan: docs/shots.md 1.01–1.06 · world: docs/MOTION.md
//
// B1 (c02–c05) is ONE continuous take: this file is the hub. It owns the camera of the whole group, the world state and the two seam
// plates (plateWindow at the start, plateCrystal at the end); every chunk file (sc02 … sc05) adds its shots as a part
// { keys (camera keys), world(t, st, c), veil(t), over(ctx, t, c, out) } and returns the same draw function, so the boundaries
// c02|c03|c04|c05 are continuous by construction (the film cuts between two identical frames).
//
// | ID   | anchor (phrase)               | picture (one idea)                                                              | camera / layer       | carrier → next |
// |------|-------------------------------|---------------------------------------------------------------------------------|----------------------|----------------|
// | 1.01 | The seller is Anthropic       | out of plateWindow: pull back out of the window: the tower, the city, the crystal; gold label ANTHROPIC / THE LAB BEHIND CLAUDE | pull back · MIX | the crystal |
// | 1.02 | Its shares are expected       | a night card grows from a crystal facet: NASDAQ: ANT · FIRST TRADE EXPECTED NOV 19 (…); bracket NOT INVESTMENT ADVICE … | creep · EXPL | the card |
// | 1.03 | Expected price                | the card turns: EXPECTED RANGE $70–78 · 825 MILLION SHARES                       | creep · EXPL         | the card       |
// | 1.04 | That would make it the second | the card rises; a ranked list: 1 SPACEX (JUNE 2026) · 2 ANT (gold) · WOULD BE THE 2ND-LARGEST IPO EVER | creep · EXPL | the gold ANT row |
// | 1.05 | Whether to buy is not         | the ANT row shrinks into the BUY button, in front of the crystal; the camera pushes past it ("behind the button") | push · MIX | the button |
// | 1.06 | And that matters even if      | tilt down: you, the jar; the button sinks out unpressed; a tiny gold slice drifts down from the crystal toward the jar | glide · SCENE | the slice |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f59_kit.mjs';
import * as S from '../lib/f59_world.mjs';
import { part03 } from './sc03.mjs';
import { part04 } from './sc04.mjs';
import { part05 } from './sc05.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, smooth, halo, mixHex } = E;
const { rise, GOLD, PAPER, COOL, F0 } = F;

export const PRINT = F.PRINT59;
export default async (T, R) => { E.prepareEditorial(); return [{ t: R.a, draw: b1(T), print: PRINT }]; };

// ================================================================================================================ shared helpers (B1)
export function CF(u, v, s, sx, sy) { return E.aim(F0, u, v, s, sx, sy); }                 // a camera on the rooftop card
export function CC(u, v, s, sx, sy) { return E.aim(S.Z_CRY, u, v, s, sx, sy); }            // … on the crystal card
export function CW(u, v, s, sx, sy) { return E.aim(S.Z_CITY, u, v, s, sx, sy); }           // … on the city card (the tower)
export function CB(u, v, s, sx, sy) { return E.aim(S.Z_BELL, u, v, s, sx, sy); }           // … on the exchange (the bell)
// mix two cameras (x, y linear; z in log distance to the crystal, like camPath)
export function camMix(a, b, w) {
  if (w <= 0) return a; if (w >= 1) return b;
  const la = Math.log(F.REF - a.z), lb = Math.log(F.REF - b.z);
  return E.cam3({ x: lerp(a.x, b.x, w), y: lerp(a.y, b.y, w), z: F.REF - Math.exp(lerp(la, lb, w)) });
}
export function rectMix(a, b, m) { return { x: lerp(a.x, b.x, m), y: lerp(a.y, b.y, m), w: lerp(a.w, b.w, m), h: lerp(a.h, b.h, m) }; }
// draw fn (designed for rect R) into the screen rect r (uniform scale by width, centred vertically); floats with the explainers
export function inRect(ctx, t, R, r, fn, k = 1) {
  ctx.save(); F.float(ctx, t, k);
  const s = r.w / R.w; ctx.translate(r.x, r.y + (r.h - R.h * s) / 2); ctx.scale(s, s); ctx.translate(-R.x, -R.y);
  fn(); ctx.restore();
}
// a card body: 'night' (indigo, gold edge) or 'paper' (cream); opaque at once (it grows out of a thing, never fades in)
export function panel(ctx, R, o = {}) {
  const night = o.style !== 'paper', rr = night ? 14 : 8;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.fillStyle = rgba(P.night0, .35); ctx.beginPath(); ctx.roundRect(R.x + 6, R.y + 10, R.w, R.h, rr); ctx.fill();
  ctx.fillStyle = night ? mixHex(P.night1, P.ind2, .55) : E.lin(ctx, R.x, R.y, R.x + R.w, R.y + R.h, [[0, PAPER.lit], [1, PAPER.body]]);
  ctx.beginPath(); ctx.roundRect(R.x, R.y, R.w, R.h, rr); ctx.fill();
  ctx.strokeStyle = o.edge ?? (night ? rgba(GOLD.line, .55) : rgba(PAPER.edge, .9)); ctx.lineWidth = o.edgeW ?? 2; ctx.stroke();
  ctx.restore();
}
// one line of text that rises out of its baseline mask (u 0..1); o { serif, size, col, align, spacing, weight }
export function line(ctx, s, x, y, size, u, o = {}) {
  if (u <= 0) return 0;
  return F.maskLine(ctx, [[s, 0]], x, y, size, rise(u), { serif: o.serif ?? false, weight: o.weight ?? 600, col: o.col ?? P.cream, glow: false, align: o.align }).w ?? 0;
}
export const gline = (ctx, s, x, y, size, u, o = {}) => (u > 0 ? F.goldText(ctx, [[s, o.gold ?? 1]], x, y, size, rise(u), { serif: o.serif ?? true, weight: o.weight, align: o.align, spacing: o.spacing, col: o.col }) : null);
// the crystal's facets in screen space (the kit's geometry, mirrored here: lib/f59_kit.mjs crystal())
const CO = [[-.76, -.52], [.05, -.9], [.98, -.38], [.93, .57], [.48, .9], [-.14, .8], [-1, 0]];
const CI = [[-.15, -.38], [.45, .03], [-.32, .33], [.2, .55]];
const PT = (k) => (k < 7 ? CO[k] : CI[k - 7]);
export function facet(c, t, ids = [7, 8, 9]) {
  const p = E.project(c, S.Z_CRY, S.CRY.x, S.CRY.y); if (!p) return null;
  const R = S.CRY.r * p[2] * (1 + .012 * Math.sin(t * .8)), rot = .015 * Math.sin(t * .23), cs = Math.cos(rot), sn = Math.sin(rot);
  const pts = ids.map((k) => { const [u, v] = PT(k); return [p[0] + (u * cs - v * sn) * R, p[1] + (u * sn + v * cs) * R]; });
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  const box = { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
  return { pts, box, cx: (pts[0][0] + pts[1][0] + pts[2][0]) / 3, cy: (pts[0][1] + pts[1][1] + pts[2][1]) / 3, R, c: [p[0], p[1]] };
}
// a facet that turns flat: its light goes out into a screen (u 0..1), with a cool rim
export function flatFacet(ctx, f, u, glow = 1) {
  if (!f || u <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.beginPath(); f.pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath();
  ctx.fillStyle = rgba(mixHex(P.night1, P.blue1, .35), .95 * sineIO(u)); ctx.fill();
  ctx.strokeStyle = rgba(COOL.core, .8 * u); ctx.lineWidth = 2.5; ctx.stroke();
  ctx.restore();
  halo(ctx, f.cx, f.cy, f.R * .5, .18 * u * glow, COOL.halo, COOL.core);
}
// a chair (the 7 + 4 seats and the board's seats), front view; lit 0..1 rims it in col; open 0..1 = a dashed, empty seat
export function chair(ctx, x, y, s, o = {}) {
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  const lit = clamp(o.lit ?? 0), col = o.col ?? GOLD.body;
  if (o.open) {
    ctx.strokeStyle = rgba(P.cream, .55); ctx.lineWidth = Math.max(1.5, s * .045); ctx.setLineDash([s * .12, s * .1]);
    ctx.beginPath(); ctx.roundRect(x, y - s, s, s * .62, s * .14); ctx.stroke(); ctx.beginPath(); ctx.rect(x, y - s * .4, s, s * .14); ctx.stroke(); ctx.setLineDash([]);
  } else {
    ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.beginPath(); ctx.roundRect(x, y - s, s, s * .62, s * .14); ctx.fill();
    ctx.fillRect(x, y - s * .4, s, s * .14); ctx.fillRect(x + s * .06, y - s * .3, s * .1, s * .3); ctx.fillRect(x + s * .84, y - s * .3, s * .1, s * .3);
    if (lit > 0) { ctx.strokeStyle = rgba(col, .9 * lit); ctx.lineWidth = Math.max(2, s * .05); ctx.beginPath(); ctx.roundRect(x, y - s, s, s * .62, s * .14); ctx.stroke(); halo(ctx, x + s / 2, y - s * .7, s * .9, .25 * lit, col === GOLD.body ? GOLD.halo : F.LAMP.body, P.cream); }
  }
  ctx.restore();
}
// the gold BUY pill (the hook's button)
export function buyButton(ctx, x, y, w, h, o = {}) {
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.fillStyle = E.lin(ctx, x, y, x, y + h, [[0, mixHex(GOLD.hot, P.night1, o.dim ?? 0)], [1, mixHex(GOLD.mid, P.night1, o.dim ?? 0)]]); ctx.beginPath(); ctx.roundRect(x, y, w, h, h / 2); ctx.fill();
  if ((o.text ?? 1) > 0 && h > 20) E.glowText(ctx, 'BUY', x + w / 2, y + h * .64, { size: h * .4, weight: 600, align: 'center', spacing: .25, col: P.night1, glow: false, a: o.text ?? 1 });
  ctx.restore();
  if ((o.glow ?? 0) > 0) halo(ctx, x + w / 2, y + h / 2, w * .7, .3 * o.glow, GOLD.halo, GOLD.core);
}

// ================================================================================================================ the take (c02–c05)
const B1 = new WeakMap();
export function b1(T) {
  if (B1.has(T)) return B1.get(T);
  E.prepareEditorial();
  const T0 = T.G('The seller is Anthropic'), T1 = T.G('Many doubt it');
  const tA = T0 + S.SEAM_HALF, tPlate = T1 - S.SEAM_HALF, tCreep = tPlate - 2.5;
  const parts = [part02(T), part03(T), part04(T), part05(T)];
  // the camera: plateWindow's creep → the parts' keys (one monotone path) → plateCrystal's creep (from tCreep on, exactly the plate's)
  const creepA = (t) => { const k = 1 + S.CREEP * (t - (T0 - S.SEAM_HALF)); return S.WIN_CAM(k, S.trk(k) / 2.6 * .2); };
  const creepB = (t) => { const k = 1 + S.CREEP * (t - tPlate); return S.CRY_CAM(k, S.trk(k) * .3); };
  const K = parts.flatMap((p) => p.keys).filter((k) => k[0] > tA + .3 && k[0] < tCreep - .3).sort((a, b) => a[0] - b[0]);
  const KALL = [[tA, creepA(tA)], ...K, [tCreep, creepB(tCreep)]];
  const camRaw = (t) => (t >= tCreep ? creepB(t) : camMix(creepA(t), F.camPath(t, KALL), smooth(span(t, tA, tA + 1.6))));
  const cam = (t) => {
    const c = camRaw(t), s = F.REF / (F.REF - c.z);
    return E.camDrift(c, t, 8 / Math.max(1, s) * smooth(span(t, tA, tA + 2.4)) * (1 - smooth(span(t, tPlate - 2.2, tPlate))), 5);
  };
  // you: holding the shard low (as at the end of the hook); a part may change the pose (thumbnail C: the shard held up)
  const draw = (ctx, t) => {
    if (t < tA) { S.plateWindow(ctx, t, T); return; }
    if (t >= tPlate) { S.plateCrystal(ctx, t, T); return; }
    const c = cam(t);
    const st = {
      crystal: { gap: 1, glow: 1 }, room: { lit: 1, seated: 1, wheel: { a: 1, glass: 1 } },
      you: { o: { armR: [1.05 + .03 * Math.sin(t * .5), 2.25], armL: [-.18, -.12], look: .3 + .1 * Math.sin(t * .21) } },
      shardHeld: 1,
    };
    for (const p of parts) p.world?.(t, st, c);
    if (st.you !== false && st.shardHeld) {
      const prev = st.extra;
      st.extra = (cx, hands) => {
        if (hands?.R) F.shard(cx, t, hands.R[0] + 4, hands.R[1] - 30, 64, { rot: -.12 + .04 * Math.sin(t * .7), glow: st.shardGlow ?? .6 });
        prev?.(cx, hands);
      };
    }
    if (t >= tCreep) { st.you = false; delete st.extra; delete st.jar; }   // exactly the plate's world from here on
    const out = S.cityWorld(ctx, c, t, st);
    F.veil(ctx, Math.max(0, ...parts.map((p) => (p.veil ? p.veil(t) : 0))));
    for (const p of parts) p.over?.(ctx, t, c, out);
    parts[1].board(ctx, t);
  };
  B1.set(T, draw);
  return draw;
}

// ================================================================================================================ c02 · shots 1.01–1.06
const CARD = { x: 360, y: 300, w: 1200, h: 330 };                  // the night card (first trade / range)
const LIST = { x: 360, y: 430, w: 1200, row: 104 };                 // the ranked list (2nd-largest IPO)
const BTN = { sx: 420, sy: 560, w: 300, h: 96 };                    // the BUY button: screen place at its landing, size on the near card Z_BTN
const Z_BTN = 2600;
function part02(T) {
  const T0 = T.G('The seller is Anthropic'), G = (p) => T.G(p, 0, T0 - .5), GE = (p) => T.GE(p, 0, T0 - .5);
  const a = {
    lab: G('the lab behind'), named: G('named Claude'), its: G('Its shares are expected'), trading: G('start trading'), nasdaq: G('on the Nasdaq'),
    exp: G('Expected price'), seventy: G('seventy to'), share: G('a share.'), second: G('That would make it'), largest: G('second-largest'), money: G('by money raised'),
    whether: G('Whether to buy'), subject: G("film's subject"), sits: G('What sits behind'), button: G('the button is'), matters: G('And that matters even'),
    press: G('press it'), slice: G('A slice of this company'), land: G('may land in'), savings: GE('savings anyway'), next: T.G('So before the opening bell'),
  };
  // camera keys (B1 path): pull back out of the window to the wide city; behind the veil a slow glide to the crystal; the button view,
  // a push past the button; tilt down to the rooftop (you, the jar)
  const BTN_CAM = CC(1440, 330, 1.02, 1260, 460), bm = E.cardM(BTN_CAM, Z_BTN);   // the button lands at screen (BTN.sx, BTN.sy) under this camera
  const BU = (BTN.sx - bm.e) / bm.k, BV = (BTN.sy - bm.f) / bm.k;
  const keys = [
    [a.lab + .2, CW(-380, 520, .85, 640, 560)], [a.named + .9, CW(-200, 520, .56, 600, 560)],
    [a.exp, CC(1300, 380, .78, 1250, 470)], [a.second + 1.2, CC(1360, 360, .86, 1220, 480)],
    [a.whether + 1.6, BTN_CAM], [a.button + .5, CC(1440, 380, 1.24, 1180, 470)],
    [a.matters + 2.4, CF(1490, 740, 1.06, 960, 610)], [a.next + .2, CF(1500, 730, 1.12, 940, 600)],
  ];
  // the night card: grows from the crystal's centre facet on "Its shares", turns on "Expected price", rises and shrinks on "That would make it"
  const grow = (t) => sineIO(span(t, a.its - .15, a.its + 1.65));
  const turn = (t) => span(t, a.exp - .25, a.exp + .95);
  const up = (t) => sineIO(span(t, a.second - .3, a.second + 1.6));
  const away = (t) => sineIO(span(t, a.whether - .2, a.whether + 1.7));
  const veilA = (t) => .82 * grow(t) * (1 - sineIO(span(t, a.whether + .2, a.whether + 2.2)));
  let FROM = null;
  const CARD_UP = { x: 610, y: 96, w: 700, h: 192 };
  function card(ctx, t, c) {
    const g = grow(t); if (g <= 0) return;
    const ay = away(t); if (ay >= 1) return;
    const f = facet(c, t); if (f && g < 1) FROM = f.box;
    const from = FROM ?? { x: 1300, y: 300, w: 120, h: 120 };
    let r = rectMix(from, CARD, g); const u = up(t);
    if (u > 0) r = rectMix(CARD, CARD_UP, u);
    if (ay > 0) r = { ...rectMix(r, { x: r.x + r.w / 2, y: r.y - 120, w: 0, h: 0 }, expoIn(ay)) };
    const tu = turn(t), sx = Math.abs(Math.cos(Math.PI * tu)), back = tu >= .5;
    ctx.save(); F.float(ctx, t, 1);
    const k = r.w / CARD.w; ctx.translate(r.x + r.w / 2, r.y + r.h / 2); ctx.scale(k * Math.max(.02, sx), r.h / CARD.h); ctx.translate(-(CARD.x + CARD.w / 2), -(CARD.y + CARD.h / 2));
    panel(ctx, CARD);
    const tx = CARD.x + 48;
    if (!back) {
      line(ctx, 'NASDAQ: ANT', tx, CARD.y + 66, 28, span(t, a.its + .9, a.its + 1.7) * span(g, .8, 1), { col: GOLD.text });
      gline(ctx, 'FIRST TRADE EXPECTED NOV 19', tx, CARD.y + 178, 72, span(t, a.trading - .1, a.trading + .7));
      line(ctx, '(COMPANY TIMETABLE, SUBJECT TO REGULATORY CLEARANCE)', tx, CARD.y + 240, 24, span(t, a.trading + .5, a.trading + 1.3), { col: P.cream });
    } else {
      line(ctx, 'EXPECTED RANGE', tx, CARD.y + 66, 28, span(tu, .6, 1), { col: GOLD.text });
      gline(ctx, '$70–78', tx, CARD.y + 196, 120, span(t, a.seventy - .1, a.seventy + .6));
      line(ctx, '825 MILLION SHARES', tx + 470, CARD.y + 186, 34, span(t, a.share - .2, a.share + .6), { col: P.cream });
      line(ctx, F.SOURCES.range, tx, CARD.y + CARD.h - 34, 18, span(t, a.seventy + .4, a.seventy + 1.2), { col: P.halo2 });
    }
    ctx.restore();
  }
  // the bracket over the card: NOT INVESTMENT ADVICE · AS OF … · FINAL PRICE NOT YET SET (from "Its shares" until the list takes over)
  function note(ctx, t) {
    const u = span(t, a.its + .8, a.its + 1.8) * (1 - span(t, a.second - .3, a.second + .3)); if (u <= 0) return;
    ctx.save(); F.float(ctx, t, 1); F.bracket(ctx, CARD.x, CARD.x + CARD.w, CARD.y - 28, u, F.SOURCES.asOf, { size: 22 }); ctx.restore();
  }
  // the ranked list: WOULD BE THE 2ND-LARGEST IPO EVER · 1 SPACEX (JUNE 2026) · 2 ANT (gold) · BY MONEY RAISED
  const listU = (t) => span(t, a.largest - .2, a.largest + .9);
  const antRow = (t) => ({ x: LIST.x, y: LIST.y + LIST.row * 1.15, w: LIST.w, h: LIST.row * .9 });
  const toBtn = (t) => sineIO(span(t, a.whether - .1, a.whether + 1.9));
  function list(ctx, t) {
    const lu = listU(t); if (lu <= 0) return;
    const out = away(t);
    ctx.save(); F.float(ctx, t, 1);
    // headline + qualifier (sink on "Whether")
    const hu = lu * (1 - out);
    gline(ctx, 'WOULD BE THE 2ND-LARGEST IPO EVER', W / 2, LIST.y - 50, 56, hu, { align: 'center' });
    line(ctx, 'BY MONEY RAISED', W / 2, LIST.y + 2, 24, span(t, a.money - .1, a.money + .7) * (1 - out), { align: 'center', col: P.halo2 });
    // row 1: SPACEX (cool) — a night row that slides out of the headline's baseline
    const r1 = span(t, a.largest + .5, a.largest + 1.3) * (1 - out);
    if (r1 > 0) {
      const y = LIST.y + 34, k = expoOut(r1);
      ctx.save(); ctx.beginPath(); ctx.rect(LIST.x - 20, y, LIST.w + 40, LIST.row); ctx.clip(); ctx.translate(0, (1 - k) * -LIST.row);
      panel(ctx, { x: LIST.x, y: y + 6, w: LIST.w, h: LIST.row * .82 }, { edge: rgba(COOL.line, .6) });
      E.glowText(ctx, '1', LIST.x + 46, y + 76, { size: 54, serif: true, col: COOL.text, glow: false });
      E.glowText(ctx, 'SPACEX (JUNE 2026)', LIST.x + 120, y + 66, { size: 32, weight: 600, spacing: .1, col: COOL.text, glow: false });
      ctx.restore();
    }
    // row 2: ANT (gold) — becomes the BUY button
    const r2 = span(t, a.largest + .9, a.largest + 1.7);
    const m = toBtn(t);
    if (r2 > 0 && m < 1) {
      const R = antRow(t), y = R.y, k = expoOut(r2);
      ctx.save(); ctx.beginPath(); ctx.rect(LIST.x - 20, y - 8, LIST.w + 40, LIST.row + 30); ctx.clip(); ctx.translate(0, (1 - k) * -LIST.row);
      if (m <= 0) {
        ctx.fillStyle = rgba(GOLD.deep, .55); ctx.beginPath(); ctx.roundRect(R.x, y, R.w, R.h, 16); ctx.fill();
        ctx.strokeStyle = rgba(GOLD.line, .9); ctx.lineWidth = 3; ctx.stroke(); halo(ctx, R.x + R.w / 2, y + R.h / 2, R.w * .4, .14, GOLD.halo, GOLD.core);
        E.glowText(ctx, '2', LIST.x + 46, y + 70, { size: 54, serif: true, col: GOLD.hot, glow: false });
        F.shard(ctx, t, LIST.x + 150, y + R.h / 2, 46, { glow: .5 });
        gline(ctx, 'ANT', LIST.x + 200, y + 62, 40, 1, { serif: false, weight: 600, spacing: .2 });
      }
      ctx.restore();
    }
    ctx.restore();
    F.source(ctx, t, a.largest + 1.2, a.whether + .4, 'SOURCES: ANTHROPIC S-1/A, NOV 10, 2026 · BLOOMBERG, NOV 10, 2026');
  }
  // the button: the ANT row's gold shape shrinks into the pill (screen) and lands on a near card (Z_BTN), so the camera pushes past it
  function button(ctx, t, c) {
    const m = toBtn(t); if (m <= 0) return;
    const p = E.project(c, Z_BTN, BU, BV); if (!p) return;
    const sink = sineIO(span(t, a.sits + .2, a.sits + 2.6)); if (sink >= 1) return;   // pushed past: it slides away below the frame and stays gone
    const B = { x: p[0], y: p[1] + sink * 900, w: BTN.w * p[2], h: BTN.h * p[2] };
    const R0 = antRow(t), r = rectMix(R0, B, m);
    if (r.y > H + 40) return;
    ctx.save(); F.float(ctx, t, 1 - m);
    if (m < 1) {   // the row's other marks leave first (they sink behind the row's mask)
      const k = 1 - span(m, 0, .35);
      if (k > 0) { ctx.save(); ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip(); ctx.translate(0, (1 - k) * r.h);
        E.glowText(ctx, '2', r.x + 46, r.y + r.h * .74, { size: 54, serif: true, col: GOLD.hot, glow: false }); gline(ctx, 'ANT', r.x + 200, r.y + r.h * .66, 40, 1, { serif: false, weight: 600, spacing: .2 }); ctx.restore(); }
    }
    buyButton(ctx, r.x, r.y, r.w, r.h, { text: span(m, .6, 1), dim: .35 * sink, glow: .5 * span(m, .7, 1) * (1 - sink) });
    ctx.restore();
  }
  // the gold label on the crystal: ANTHROPIC / THE LAB BEHIND CLAUDE
  function label(ctx, t, c) {
    const u = span(t, a.lab + .2, a.lab + 1.3) * (1 - span(t, a.its - .2, a.its + .5)); if (u <= 0) return;
    const p = S.crystalAt(c); if (!p) return;
    F.goldLabel(ctx, p[0] - p[2] * .78, p[1] + p[2] * .42, 'ANTHROPIC', 'THE LAB BEHIND CLAUDE', u, { dx: -70, dy: 90, size: 34 });
  }
  // the slice: a tiny gold piece leaves the crystal's gap and drifts down toward the jar (it does not land yet)
  const sliceU = (t) => span(t, a.slice - .1, a.slice + 7.5), tGone = T.G('Its chief executive') + 1;   // off frame from there (c05 on the crystal)
  function slice(ctx, t, c, out) {
    const u = sliceU(t); if (u <= 0 || !out.cr || t > tGone) return;
    const g = E.project(c, S.Z_CRY, out.cr.gap[0], out.cr.gap[1]), j = E.project(c, F0, S.JAR.x, S.JAR.y - S.JAR.s * 1.35); if (!g || !j) return;
    const k = sineIO(u) * .86, x = lerp(g[0], j[0], k) + 60 * Math.sin(Math.PI * k) * Math.sin(t * .6), y = lerp(g[1], j[1], k);
    F.shard(ctx, t, x, y, 22 * lerp(g[2], j[2], k) + 6, { rot: .4 + t * .25, glow: .7 });
  }
  return {
    keys,
    world: (t, st) => {
      // the jar beside you (on "retirement savings" it glows a little); the room stays as the plate had it
      if (t > a.matters - 2) st.jar = { fill: .42, slice: 0 };
    },
    veil: veilA,
    over: (ctx, t, c, out) => { label(ctx, t, c); slice(ctx, t, c, out); card(ctx, t, c); note(ctx, t); list(ctx, t); button(ctx, t, c); },
  };
}
