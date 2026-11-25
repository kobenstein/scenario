// c03 · B1 · 'Money first' → 'But why does it matter'. Part 1 THE MONEY: the HUD disc grows, piece 1 lifts out like a door and we push
// through it into one kitchen window · ★ the pull back over thousands of identical lit windows (€10 TRILLION) · your window · the windows
// pour into the vault · the start-up's string does not give · founders fly (US vs Europe bars) · two paths, one widens · dashed (not law) ·
// it sags over a drop (critics) · +62% (dashed projection) · the bar becomes the fund's vessel · the line to Mistral · ★ the machine
// clicks into Mistral · the disc again: HALFWAY → the Mistral block on the sheet (c04).
// One draw function, no cuts (no W in this chunk).
//
// | ID    | anchor (phrase)                  | zeigt wörtlich                                                     | kind  | carrier out              |
// |-------|----------------------------------|--------------------------------------------------------------------|-------|--------------------------|
// | 2.01  | Money first                      | the HUD disc grows, piece 1 lifts out like a door; we push through | EXPL  | piece 1 = the opening    |
// | 2.02★ | In the European Union            | one kitchen window (savings book, phone balance) → pull back over thousands: €10 TRILLION | MIX | one window |
// | 2.03  | If you live there                | one window warms: you at your table                                | SCENE | the windows              |
// | 2.04  | A young AI company               | the windows pour into the vault; a start-up's string does not give | MIX   | the block                |
// | 2.05  | So its founders fly              | a plane lifts off right; US $285.9 BN vs EUROPE $20.9 BN           | EXPL  | the bars                 |
// | 2.06  | The plan isn't to take           | a second path from the full vault widens towards the start-up      | EXPL  | the wide path            |
// | 2.07  | Most of it isn't law yet         | the wide path falls into dashes: MOSTLY NOT LAW YET                 | EXPL  | the dashed path          |
// | 2.08  | Critics warn                     | the path sags over a drop, coins roll off: CRITICS: MORE RISK      | EXPL  | the block                |
// | 2.09  | But the money going into         | 2025 vs 2026 bars, the top dashed (projection): +62%               | EXPL  | the 2026 bar             |
// | 2.10  | Europe now has its own fund      | the bar becomes a vessel (€5 BN target); the block grows in place  | EXPL  | a gold line              |
// | 2.11  | One of its first bets            | a gold line from the vessel to the block: MISTRAL AI · PARIS       | EXPL  | the machine slides in    |
// | 2.12★ | A year earlier, Mistral          | the chip machine slides in and clicks into Mistral (gold knob)     | EXPL  | the disc                 |
// | 2.13  | So, the money: halfway           | the plan disc big: THE MONEY seats half: HALFWAY → back to the HUD | EXPL  | the Mistral block        |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f69_kit.mjs';
import * as X from '../lib/f69_explain.mjs';
import { initSeams, lab, plainView, hud, block, vault, coins, hbar, vbar, vessel } from './sc02.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin } = E;
const { GOLD, COOL, CREAM, CREAM2, LAMP, PAPER, SOURCES: SRC } = F;
const PR = F.PRINT69, TAU = Math.PI * 2;

// ---------------------------------------------------------------- the seam to c04 (both files draw it): the Mistral block on the sheet
export const GB = 790, BK = { x: 1450, w: 180, h0: 300, h1: 480 }, SHIFT = 500;
export const viewB = (t, off = SHIFT) => { const v = plainView(t); return { ...v, x: v.x + off }; };
export function mistralBlock(ctx, t, h, o = {}) { return block(ctx, t, BK.x, GB, BK.w, h, { cols: 3, lit: .75, top: true, ...o }); }
export function groundB(ctx, u = 1) { X.lightLine(ctx, [[BK.x, GB], [BK.x - 3200, GB]], u, { a: .42, w: 3 }); X.lightLine(ctx, [[BK.x, GB], [BK.x + 2600, GB]], u, { a: .42, w: 3 }); }
export function seam34(ctx, t, T) {
  const v = viewB(t); X.sheet(ctx, t, v, { lx: BK.x, ly: 520 });
  X.inView(ctx, v, () => { groundB(ctx); mistralBlock(ctx, t, BK.h1); });
  hud(ctx, t, T);
}

export default async (T, R) => {
  initSeams(T);
  const G = (p, n = 0) => T.G(p, n, R.a - .01);
  const A = {
    a: R.a, short: G("Europe isn't short"), eu: G('In the European Union, households'), trillion: G('ten trillion'), accounts: G('bank accounts'),
    live: G('If you live there'), yours: G('part of that is yours'), young: G('A young AI company'), paris: G('Paris or Munich'), barely: G('barely sees'),
    fly: G('So its founders fly'), calif: G('California'), take: G("The plan isn't to take"), invest: G('make investing'), easier: G('Europe easier'),
    law: G("Most of it isn't law yet"), critics: G('Critics warn'), risk: G('into risk'), money: G('But the money going into'), half: G('more than half'),
    fund: G('Europe now has its own fund'), grow: G('grow without leaving'), bets: G('One of its first bets'), mistral: G('Mistral, Europe'),
    earlier: G('A year earlier, Mistral'), lead: G('lead investor'), machines: G('those chip machines'), conn: G("That's what connected"),
    halfway: G('So, the money'), end: R.b,
  };
  const KT = F.kitTimes(T), A0 = F.PIECE_ANG[0];

  // ---------------------------------------------------------------- phase A: the disc → the door → one window → thousands
  const D0 = { x: 960, y: 520, r: 250 }, tBig = [A.a + .15, A.a + 1.3], tDoor = [A.short - .1, A.short + .9], tPush = [A.short + .2, A.eu - .2];
  const pc0 = F.pieceCentre(0, D0.x, D0.y, D0.r);
  const pushR = (t) => D0.r * Math.exp(Math.log(4200 / D0.r) * sineIO(span(t, tPush[0], tPush[1])));
  const pushC = (t) => { const k = sineIO(span(t, tPush[0], tPush[1])), r = pushR(t), px = lerp(pc0[0], 960, k), py = lerp(pc0[1], 540, k); return { r, px, py, cx: px - Math.cos(A0) * .56 * r, cy: py - Math.sin(A0) * .56 * r }; };
  // the windows: cell 1800 × 1100 units, a window 1100 × 650; buildings of 3–6 columns, seeded heights; the kitchen = (0, 0), yours = (3, -3)
  const CW = 1800, CHh = 1100, WW = 1100, WH = 650, GROW = 10;
  const BLD = []; { let i = -34; let k = 0; while (i < 34) { const w = 3 + ((k * 7) % 4), h = i <= 0 && i + w > 0 ? 16 : 7 + ((k * 11 + 5) % 15); BLD.push([i, w, h]); i += w + 1; k++; } }
  const WINS = []; for (const [i0, w, h] of BLD) for (let i = i0; i < i0 + w; i++) for (let j = GROW; j > GROW - h; j--) WINS.push([i, j]);
  const MINE = [3, -3]; if (!WINS.some(([i, j]) => i === 3 && j === -3)) WINS.push(MINE);
  const VW = [
    [tPush[1], { x: 0, y: 0, s: 1.05 }], [A.eu + .5, { x: 0, y: 10, s: 1.08 }], [A.live - .8, { x: 1450, y: -2620, s: .021 }],
    [A.yours + .9, { x: MINE[0] * CW, y: MINE[1] * CHh + 40, s: .3 }], [A.young + .1, { x: MINE[0] * CW, y: MINE[1] * CHh + 40, s: .31 }],
    [A.paris + 1.2, { x: 1600, y: -2300, s: .03 }], [A.barely + 1, { x: 1650, y: -2300, s: .029 }],
  ];
  const vw = (t) => (t < tPush[1] ? null : X.viewPath(t, VW));
  const winScreen = (t) => { const c = pushC(t), s = .29 * c.r / WW; return { x: -c.px / s + 0, s, ox: c.px, oy: c.py }; };
  // one window's interior (window units, centre 0,0): the kitchen (savings book + phone) or yours (you at the table)
  function interior(ctx, t, mine, warm) {
    ctx.fillStyle = lin(ctx, 0, -WH / 2, 0, WH / 2, [[0, mixHex(LAMP.body, GOLD.hot, .25 * warm)], [.65, mixHex(LAMP.deep, LAMP.body, .55)], [1, LAMP.deep]]); ctx.fillRect(-WW / 2, -WH / 2, WW, WH);
    halo(ctx, mine ? 140 : -60, -WH * .22, 420, .45 + .2 * warm, LAMP.body, LAMP.core);
    ctx.fillStyle = mixHex(P.night1, LAMP.deep, .45); ctx.fillRect(-80, -WH / 2, 6, 90); ctx.beginPath(); ctx.ellipse(-77, -WH / 2 + 104, 46, 22, 0, Math.PI, 0); ctx.fill();   // the lamp
    ctx.fillStyle = mixHex(P.night1, LAMP.deep, .3); ctx.fillRect(-330, 110, 760, 22); ctx.fillRect(-300, 132, 18, 200); ctx.fillRect(395, 132, 18, 200);   // the table
    if (mine) { E.du(ctx, -420, WH / 2 + 40, 560, { dir: 1, light: 1, look: .2 + .1 * Math.sin(t * .7), armR: [1.2, 1.9] }); }
    // the savings book + the phone with its balance
    ctx.save(); ctx.translate(mine ? 120 : -150, 110); ctx.rotate(-.04); ctx.fillStyle = PAPER.lit; ctx.fillRect(-70, -26, 140, 26); ctx.fillStyle = mixHex(GOLD.mid, P.ind1, .3); ctx.fillRect(-70, -26, 140, 6); ctx.restore();
    ctx.save(); ctx.translate(mine ? 300 : 120, 108); ctx.fillStyle = P.night0; ctx.beginPath(); ctx.roundRect(-36, -12, 72, 12, 3); ctx.fill();
    ctx.fillStyle = rgba(GOLD.hot, .9); ctx.fillRect(-28, -10, 40, 3); ctx.restore();
    ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(-WW / 2, -WH / 2, WW, 12); ctx.fillRect(-WW / 2, WH / 2 - 12, WW, 12); ctx.fillRect(-WW / 2, -WH / 2, 12, WH); ctx.fillRect(WW / 2 - 12, -WH / 2, 12, WH);
  }
  function windowAt(ctx, t, i, j, s, warm) {
    const x = i * CW, y = j * CHh, mine = i === MINE[0] && j === MINE[1];
    if (s * WW < 70) { ctx.fillStyle = mixHex(LAMP.body, GOLD.hot, warm); ctx.globalAlpha = .62 + .1 * Math.sin(t * .5 + i * 1.3 + j * 2.1); ctx.fillRect(x - WW / 2, y - WH / 2, WW, WH); ctx.globalAlpha = 1;
      ctx.fillStyle = rgba(LAMP.deep, .7); ctx.fillRect(x - WW * .3, y + WH * .17, WW * .6, WH * .1); return; }
    ctx.save(); ctx.translate(x, y); ctx.beginPath(); ctx.rect(-WW / 2, -WH / 2, WW, WH); ctx.clip(); interior(ctx, t, mine, warm); ctx.restore();
  }
  // the vault, the start-up block (sheet coordinates of the B view)
  const VA = { x: 470, y: 590, r: 170 }, BKx = BK.x, pourT = [A.young + 1.0, A.paris + .8];
  function phaseA(ctx, t) {
    if (t < tPush[1]) {   // the disc grows (HUD → big), the door lifts, we push through it
      X.sheet(ctx, t, plainView(t));
      const c = pushC(t), door = span(t, tDoor[0], tDoor[1]), big = span(t, tBig[0], tBig[1]);
      const parts = F.kitParts(T, t).parts.map((p, i) => (i === 0 && door > 0 ? { ...p, fade: 0 } : p));
      const pushing = t > tPush[0];
      hud(ctx, t, T, { big, bx: pushing ? c.cx : D0.x, by: pushing ? c.cy : D0.y, br: pushing ? c.r : D0.r, parts, lab: span(big, .55, 1) * (1 - span(t, tPush[0] - .2, tPush[0] + .25)) });
      if (door > 0) {   // the kitchen window behind the door (in piece 1's place)
        const s = .29 * c.r / WW; ctx.save(); ctx.translate(c.px, c.py); ctx.scale(s, s); ctx.beginPath(); ctx.rect(-WW / 2, -WH / 2, WW, WH); ctx.clip(); interior(ctx, t, false, 0); ctx.restore();
        halo(ctx, c.px, c.py, 160 * c.r / 250, .3 * (1 - span(t, tPush[0], tPush[1])), LAMP.body, LAMP.core);
        const k = expoIn(door);   // the door: piece 1 lifts out towards us and falls away down-left
        if (door < 1) F.loosePiece(ctx, t, 0, pc0[0] - k * 500, pc0[1] + k * 700 - Math.sin(Math.PI * door) * 60, D0.r * (1 + .5 * sineIO(door)), { kind: 'blank', lit: 1, rot: -k * .9, glow: 0 });
      }
      return;
    }
    X.sheet(ctx, t, plainView(t));
    const v = vw(t), pour = span(t, pourT[0], pourT[1]), vB = viewB(t, 0);
    const warm = sineIO(span(t, A.yours - .1, A.yours + .6));
    X.inView(ctx, v, (s) => {
      if (s < .9) for (const [i0, w, h] of BLD) {   // building bodies (they fold down into the ground as the windows pour out)
        const x0 = i0 * CW - 350, x1 = (i0 + w - 1) * CW + 350 + 350, top = (GROW - h + 1) * CHh - 700, base = GROW * CHh + 700, k = 1 - sineIO(clamp(pour * 1.3 - .2));
        if (k <= 0) continue;
        ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.fillRect(x0, base - (base - top) * k, x1 - x0 - 350, (base - top) * k);
      }
      if (pour <= 0) for (const [i, j] of WINS) {
        const sx = W / 2 + (i * CW - v.x) * s, sy = H / 2 + (j * CHh - v.y) * s, hw = WW * s; if (sx < -hw || sx > W + hw || sy < -hw || sy > H + hw) continue;
        windowAt(ctx, t, i, j, s, i === MINE[0] && j === MINE[1] ? warm : 0);
      }
    });
    if (pour > 0) {   // every window flies into the vault and becomes a coin of light
      const [vx, vy] = X.toScreen(vB, VA.x, VA.y);
      for (const [i, j] of WINS) {
        const [sx, sy] = X.toScreen(v, i * CW, j * CHh), q = ((i * 31 + j * 17 + 999) % 97) / 97, u = sineIO(clamp(pour * 1.5 - q * .5)); if (u >= 1) continue;
        const ang = q * TAU, rr = VA.r * .6 * Math.sqrt(q), x = lerp(sx, vx + Math.cos(ang) * rr, u), y = lerp(sy, vy + Math.sin(ang) * rr * .6 + VA.r * .3, u) - Math.sin(Math.PI * u) * 120, sh = sineIO(clamp(u * 3)), w = lerp(WW * v.s, 9, sh), h = lerp(WH * v.s, 9, sh);
        ctx.fillStyle = mixHex(LAMP.body, GOLD.hot, u); ctx.fillRect(x - w / 2, y - h / 2, w, h);
      }
    }
    // texts: €10 TRILLION (on a dark band so it reads over the lit windows)
    const tl = lab(t, A.trillion - .1, A.live + .2);
    if (tl > 0) { ctx.save(); ctx.fillStyle = lin(ctx, 0, 330, 0, 640, [[0, rgba(P.night0, 0)], [.3, rgba(P.night0, .72 * tl)], [.7, rgba(P.night0, .72 * tl)], [1, rgba(P.night0, 0)]]); ctx.fillRect(0, 330, W, 310); ctx.restore(); }
    const [n10, w10] = SRC.savings.split(' IN ');
    X.big(ctx, n10, W / 2, 500, 120, tl, { gold: 1 }); X.label(ctx, 'IN ' + w10, W / 2, 568, tl, { size: 30, spacing: .16 });
    if (t > A.trillion && t < A.live + .6) F.source(ctx, t, A.trillion + .2, A.live + .2, SRC.savingsSrc);
  }

  // ---------------------------------------------------------------- phase B: the money diagram (sheet coordinates, view viewB)
  const tFly = A.fly + .4, PATH = (sag) => { const a = [VA.x + VA.r * .7, VA.y - VA.r * .7], b = [BKx - BK.w / 2, GB - 170], c = [(a[0] + b[0]) / 2, lerp(330, 1060, sag)]; return [a, c, b]; };
  const quad = ([a, c, b], u) => [(1 - u) ** 2 * a[0] + 2 * u * (1 - u) * c[0] + u * u * b[0], (1 - u) ** 2 * a[1] + 2 * u * (1 - u) * c[1] + u * u * b[1]];
  const MCH = { x: 860, L: 440 };
  const shiftT = [A.halfway - .7, A.halfway + .5];
  function phaseB(ctx, t) {
    const off = SHIFT * sineIO(span(t, shiftT[0], shiftT[1])), v = viewB(t, off);
    X.sheet(ctx, t, v, { lx: lerp(VA.x + 300, BK.x, span(t, A.money, A.money + 2)), ly: 520 });
    const sinkV = expoIn(span(t, A.money, A.money + 1.1)) * 600, gu = span(t, A.young + 1.2, A.paris + 1);
    const bu = span(t, A.paris - .2, A.paris + .9), bh = lerp(BK.h0, BK.h1, sineIO(span(t, A.grow - .2, A.grow + .9)));
    const tug = Math.sin(Math.PI * span(t, A.barely + .1, A.barely + .8)) * .5 + Math.sin(Math.PI * span(t, A.barely + .8, A.barely + 1.3)) * .25;
    const fill = 1;
    X.inView(ctx, v, () => {
      groundB(ctx, gu);
      // the vault (the windows poured into it), sinks at 2.09
      if (sinkV < 600) { ctx.save(); ctx.beginPath(); ctx.rect(-4000, -4000, 9000, GB + 4000); ctx.clip(); ctx.translate(0, sinkV);
        vault(ctx, t, VA.x, VA.y, VA.r, { fill: fill * span(t, pourT[0] + .2, pourT[1] + .2), door: span(t, A.young + .9, A.paris + .2) });
        ctx.restore(); }
      // the string from the start-up to the vault: it does not give
      const st = span(t, A.barely - .5, A.barely + .1) * (1 - span(t, A.take - .3, A.take + .3));
      if (st > 0) { const a = [VA.x + VA.r, VA.y], b = [BKx - BK.w / 2 - tug * 8, GB - 60]; X.lightLine(ctx, [b, [lerp(b[0], a[0], .5), lerp(b[1], a[1], .5) + 30 * (1 - tug)], a], st, { col: rgba(CREAM, .8), w: 2.5 });
        const dot = span(t, A.barely + .2, A.barely + 2.2); if (dot > 0 && dot < 1) { ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(lerp(a[0], b[0], dot * .45), lerp(a[1], b[1], dot * .45), 5, 0, TAU); ctx.fill(); } }
      // the second path: widens (2.06), falls into dashes (2.07), sags over a drop (2.08)
      const pu = span(t, A.take + .4, A.take + 1.6) * (1 - span(t, A.money - .2, A.money + .6)), wide = sineIO(span(t, A.invest - .1, A.easier + .2)), dash = sineIO(span(t, A.law - .1, A.law + .9));
      const sag = sineIO(span(t, A.critics + .2, A.critics + 1.6)) * (1 - sineIO(span(t, A.money - .3, A.money + .5))), pit = sag;
      if (pit > 0) { ctx.fillStyle = lin(ctx, 0, GB, 0, GB + 300, [[0, rgba(P.night0, .9 * pit)], [1, rgba(P.night0, 0)]]); ctx.fillRect(840, GB - 1, 300, 300 * pit);
        X.lightLine(ctx, [[840, GB], [840, GB + 220 * pit]], 1, { a: .35, w: 2 }); X.lightLine(ctx, [[1140, GB], [1140, GB + 220 * pit]], 1, { a: .35, w: 2 }); }
      if (pu > 0) {
        const pts = Array.from({ length: 41 }, (_, k) => quad(PATH(sag), k / 40));
        const bw = lerp(5, 46, wide);
        ctx.save(); ctx.lineCap = 'butt'; ctx.lineJoin = 'round'; ctx.strokeStyle = rgba(CREAM, .7); ctx.lineWidth = bw; ctx.setLineDash([42, 30 * dash + .001]); ctx.lineDashOffset = -t * 18 * dash;
        ctx.beginPath(); const n = Math.round(40 * pu); pts.slice(0, n + 1).forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.restore();
        // savers' coins roll along it and drop at the bottom of the sag (risk)
        for (let k = 0; k < 3; k++) { const c = span(t, A.critics + 1.4 + k * .45, A.risk + .2 + k * .3); if (c <= 0 || c >= 1) continue;
          const [x, y] = quad(PATH(sag), Math.min(.5, c * .7)), fall = Math.max(0, c - .7) / .3; ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(x, y - 14 + fall * fall * 260, 11, 0, TAU); ctx.fill(); }
      }
      // 2.09 the start-up money bars (2025, 2026 on track: the top part dashed), 2.10 the 2026 bar becomes the fund's vessel
      const b1 = span(t, A.money + .5, A.money + 1.4) * (1 - span(t, A.fund, A.fund + .7)), b2 = span(t, A.money + .9, A.half + .3), vm = span(t, A.fund + .1, A.fund + 1.3);
      const vOut = expoIn(span(t, A.earlier, A.earlier + .9));
      if (b1 > 0) vbar(ctx, t, 800, GB, 90, 200, b1, { col: rgba(CREAM, .8) });
      if (b2 > 0 && vm <= 0) vbar(ctx, t, 1050, GB, 90, 324, b2, { col: rgba(CREAM, .85), dashFrom: .78 });
      if (vm > 0 && vOut < 1) { ctx.save(); ctx.translate(0, vOut * 500); ctx.beginPath(); ctx.rect(0, -4000, 4000, GB + 4000 - vOut * 500); ctx.clip();
        vessel(ctx, t, 1050, GB, 230, 340, { morph: vm, barW: 90, fill: .55 * sineIO(span(t, A.fund + .9, A.fund + 2.2)), target: span(t, A.fund + 1.5, A.fund + 2.3) }); ctx.restore(); }
      // the start-up block (Mistral later): rises at 'Paris or Munich', grows in place at 'grow without leaving'
      const lean = -tug * .05;
      mistralBlock(ctx, t, bh, { u: bu, lean, pivot: -1 });
      // 2.05 the founders' plane lifts off the roof and leaves right
      const pf = span(t, tFly, tFly + 2.2); if (pf > 0 && pf < 1) { const k = pf * pf; F.jet(ctx, t, BKx + 60 + k * 1500, GB - bh - 30 - Math.sin(Math.min(1, pf * 1.6) * Math.PI / 2) * 420, 200, { rot: -.25 + .15 * pf }); }
      // 2.11 a gold line from the vessel to the block · 2.12 the machine slides in, a gold line, the knob clicks
      const gl = span(t, A.bets + .5, A.mistral) * (1 - span(t, A.earlier - .3, A.earlier + .3));
      if (gl > 0) F.goldSpan(ctx, [[1050, GB - 340], [1250, GB - 470], [BKx - BK.w / 2 - 6, GB - bh * .7]], 0, gl, { w: 4 });
      const mIn = expoOut(span(t, A.earlier + .3, A.earlier + 1.8)), mOut = expoIn(span(t, A.end - 1.7, A.end - .4)), mx = lerp(-700, MCH.x, mIn) - mOut * 1600;
      if (mIn > 0 && mOut < 1) F.chipMachine(ctx, t, mx, GB, MCH.L, { glow: 1, beam: .6, wheels: mIn < 1 || mOut > 0 });
      const ln = span(t, A.lead - .1, A.lead + .8) * (1 - span(t, A.end - 2.0, A.end - 1.4)), click = span(t, A.conn + .4, A.conn + .7);
      if (ln > 0) {
        const a = [mx + MCH.L / 2 + 10, GB - 70], b = [BKx - BK.w / 2 - 4, GB - 70], m = [(a[0] + b[0]) / 2, a[1]];
        const gap = 26 * (1 - expoOut(click));
        F.goldSpan(ctx, [a, [m[0] - gap, m[1]]], 0, ln, { w: 5 }); F.goldSpan(ctx, [b, [m[0] + gap, m[1]]], 0, ln, { w: 5 });
        if (ln >= 1) {   // the knob: a round tab on the machine's side snaps into the block's socket
          ctx.fillStyle = GOLD.body; ctx.beginPath(); ctx.arc(m[0] - gap + 12, m[1], 14, 0, TAU); ctx.fill();
          ctx.strokeStyle = GOLD.body; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(m[0] + gap + 12, m[1], 20, Math.PI * .6, Math.PI * 1.4, true); ctx.stroke();
          const fl = Math.sin(Math.PI * span(t, A.conn + .6, A.conn + 1.6)); if (fl > 0) halo(ctx, m[0], m[1], 260 * fl, .7 * fl, GOLD.halo, GOLD.core);
        }
      }
    });
    // 2.05 the two bars (US vs Europe): the plane's trail draws the long one
    const bars = span(t, A.calif - .3, A.calif + .9) * (1 - span(t, A.take + .2, A.take + .8)), sc = 880 / 285.9, BX0 = 500;
    if (bars > 0) {
      hbar(ctx, t, BX0, 200, 285.9 * sc, bars, { col: rgba(COOL.body, .75), h: 30 });
      hbar(ctx, t, BX0, 262, 20.9 * sc, clamp(bars * 1.4 - .3), { col: CREAM, h: 30 });
      X.label(ctx, SRC.aiInvest[0], BX0 + 285.9 * sc * expoOut(bars) + 22, 210, bars, { size: 26, align: 'left' });
      X.label(ctx, SRC.aiInvest[1], BX0 + 20.9 * sc * expoOut(clamp(bars * 1.4 - .3)) + 22, 272, clamp(bars * 1.4 - .3), { size: 26, align: 'left', gold: .5 });
    }
    if (t > A.calif - .4 && t < A.take + 1) F.source(ctx, t, A.calif, A.take + .6, SRC.aiInvestSrc);
    // labels
    const [bxS, byS] = X.toScreen(v, BKx, GB + 44), [vxS, vyS] = X.toScreen(v, VA.x, GB + 44);
    X.label(ctx, 'BANK ACCOUNTS', vxS, vyS, lab(t, A.paris, A.money), { size: 24, spacing: .14 });
    X.label(ctx, 'A YOUNG AI COMPANY', bxS, byS, lab(t, A.paris, A.money), { size: 24, spacing: .12 });
    X.label(ctx, 'EASIER TO INVEST IN EUROPE', W / 2 - 40, 230, lab(t, A.invest + .2, A.law), { size: 30, spacing: .12 });
    X.big(ctx, SRC.siu, W / 2 - 40, 250, 66, lab(t, A.law, A.critics), { gold: 0 });
    if (t > A.law && t < A.critics + .5) F.source(ctx, t, A.law + .2, A.critics, SRC.siuSrc);
    X.big(ctx, SRC.critics, W / 2 - 40, 250, 62, lab(t, A.critics + .1, A.money - .1), { gold: 0 });
    if (t > A.critics && t < A.money + .4) F.source(ctx, t, A.critics + .3, A.money - .1, SRC.criticsSrc);
    const [y1x, y1y] = X.toScreen(v, 800, GB + 44), [y2x, y2y] = X.toScreen(v, 1050, GB + 44);
    X.label(ctx, '2025', y1x, y1y, lab(t, A.money + .8, A.fund + .2), { size: 26 });
    X.label(ctx, '2026', y2x, y2y, lab(t, A.money + 1.1, A.fund + .2), { size: 26, gold: .6 });
    X.big(ctx, SRC.startups, W / 2 - 40, 250, 66, lab(t, A.half - .2, A.fund), { gold: .6 });
    if (t > A.half - .3 && t < A.fund + .4) F.source(ctx, t, A.half, A.fund, SRC.startupsSrc);
    const [fA, fB] = SRC.fund.split(' · ');
    X.label(ctx, fA, W / 2 - 100, 200, lab(t, A.fund + .3, A.bets + .2), { size: 34, spacing: .12 });
    X.label(ctx, fB, W / 2 - 100, 252, lab(t, A.fund + 1.1, A.bets + .2), { size: 30, spacing: .12, gold: 1, col: GOLD.text });
    if (t > A.fund && t < A.bets + .6) F.source(ctx, t, A.fund + .6, A.bets + .2, SRC.fundSrc);
    const [mxS, myS] = X.toScreen(v, BKx, GB - bh - 40);
    X.label(ctx, SRC.mistral, mxS, myS, lab(t, A.mistral - .1, A.lead - .1), { size: 28, spacing: .12, gold: .3 });
    if (t > A.mistral - .2 && t < A.earlier + .4) F.source(ctx, t, A.mistral, A.earlier, SRC.mistralSrc);
    X.big(ctx, SRC.asmlMistral, W / 2, 230, 62, lab(t, A.lead, A.halfway - .1), { gold: .8 });
    if (t > A.lead && t < A.halfway + .3) F.source(ctx, t, A.lead + .3, A.halfway - .1, SRC.asmlMistralSrc);
    // 2.13 the plan disc: THE MONEY seats half → back into the HUD
    const big = span(t, A.halfway, A.halfway + 1.1) * (1 - span(t, A.end - 1.35, A.end - .25));
    hud(ctx, t, T, { big, bx: 1520, by: 430, br: 170, lab: span(t, A.halfway + .5, A.halfway + 1.1) * (1 - span(t, A.end - 1.6, A.end - 1.15)) });
  }

  function take(ctx, t) {
    if (t < A.a + .15) { X.sheet(ctx, t, plainView(t)); hud(ctx, t, T); return; }   // the seam: as c02 hands it over
    if (t < pourT[1] + .05 && t < A.young + .9) { phaseA(ctx, t); return; }
    if (t < pourT[1]) { phaseB(ctx, t); phaseA2(ctx, t); return; }
    phaseB(ctx, t);
  }
  // during the pour, phase B (the vault, the block) is under the flying windows
  function phaseA2(ctx, t) {
    const v = vw(t), pour = span(t, pourT[0], pourT[1]), vB = viewB(t, 0), [vx, vy] = X.toScreen(vB, VA.x, VA.y);
    X.inView(ctx, v, () => {
      for (const [i0, w, h] of BLD) { const x0 = i0 * CW - 350, x1 = (i0 + w - 1) * CW + 700, top = (GROW - h + 1) * CHh - 700, base = GROW * CHh + 700, k = 1 - sineIO(clamp(pour * 1.3 - .2)); if (k <= 0) continue;
        ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.fillRect(x0, base - (base - top) * k, x1 - x0 - 350, (base - top) * k); }
    });
    for (const [i, j] of WINS) {
      const [sx, sy] = X.toScreen(v, i * CW, j * CHh), q = ((i * 31 + j * 17 + 999) % 97) / 97, u = sineIO(clamp(pour * 1.5 - q * .5)); if (u >= 1) continue;
      if (u <= 0 && (sx < -40 || sx > W + 40 || sy < -40 || sy > H + 40)) continue;
      const ang = q * TAU, rr = VA.r * .6 * Math.sqrt(q), x = lerp(sx, vx + Math.cos(ang) * rr, u), y = lerp(sy, vy + Math.sin(ang) * rr * .6 + VA.r * .3, u) - Math.sin(Math.PI * u) * 120, sh = sineIO(clamp(u * 3)), w = lerp(WW * v.s, 9, sh), h = lerp(WH * v.s, 9, sh);
      ctx.fillStyle = mixHex(LAMP.body, GOLD.hot, u); ctx.fillRect(x - w / 2, y - h / 2, w, h);
    }
  }
  return [{ t: R.a, draw: take, print: PR }];
};
