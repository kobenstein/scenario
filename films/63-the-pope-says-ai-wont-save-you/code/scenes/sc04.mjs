// c04 · B1 · 'For the Pope, the catch' → 'His picture for that power' · shots 3.01–3.11. One entry, one draw function, motifs on the voice,
// carriers between them (never a fade, never a cut).
//
// | ID      | anchor (phrase)              | motif                                                                                   | type  | carrier → next        |
// |---------|------------------------------|-----------------------------------------------------------------------------------------|-------|-----------------------|
// | 3.01    | For the Pope, the catch      | the question drops off its hook, the camera dives into the empty right pan: you stand in it; a gold scan line measures you: OUTPUT · SPEED · COST | MIX | the scan line |
// | 3.02    | A person as a project        | the scan line floods the frame into a blueprint: you as a drawing, dimension lines, v1.0 → v2.0 · §112 | EXPL | the grid lines |
// | 3.03    | Picture the day              | pull back: the grid lines become the workshop's wall; at every bench a glowing helper, you without one · OUR EXAMPLE | SCENE | your bench lamp |
// | 3.04    | You are the same             | your tag: YESTERDAY 12 · TODAY 12 (theirs: 38)                                          | SCENE | THE MEASURE mark      |
// | 3.05    | And suddenly                 | THE MEASURE slides up above your head                                                    | MIX   | the mark              |
// | 3.06–08 | That is the trap …           | the camera follows the mark up into the diagram: THE MACHINE WORKS → THE MEASURE MOVES · THE MACHINE FAILS YOU struck · the mark jumps | EXPL | the boxes |
// | 3.09    | If a human being             | the boxes fold into the §117 card (words light as spoken)                                | EXPL  | the card              |
// | 3.10    | That some lives              | a row of people; three get LESS USEFUL · LESS DESIRABLE · LESS WORTHY and sink a step    | MIX   | the card              |
// | 3.11    | And who gets to decide       | the card closes into the question card WHO DECIDES?                                     | EXPL  | the card → Babel's base tier (c05) |
import * as F from '../lib/f63_kit.mjs';
import * as S from '../lib/f63_seams.mjs';
import * as B from '../lib/f63_b1_kit.mjs';
import { anchorsScale, drawScaleStage, drawScale, drawCatch, SC, scaleTilt } from './sc03.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, rise, GOLD, CREAM, PAPER } = F;
export const PRINT = F.PRINT63;

// ---------------------------------------------------------------- WHO DECIDES? (shared with c05: the card becomes Babel's base tier)
export const QW = { x: W / 2, y: 470, w: 900, h: 220 };
export function anchorsWho(T) { const who = T.G('And who gets to decide'); return { who, qwts: (() => { const w = F.wordTimes(T, 'who gets to decide', null, who - .1); return w ? [w[0], w[3]] : [who + .4, who + 1]; })() }; }
export function drawWhoCard(ctx, t, A, o = {}) {   // o.rect = { x, y, w, h, r, col } overrides (c05 morphs it), o.text 0..1, o.live 0..1
  const r = o.rect ?? { ...QW, r: 16, col: mixHex(P.night1, P.ind2, .55), edge: .75 };
  const lv = o.live ?? 1, ks = 1 + lv * .012 * Math.sin(t * .8), dy = lv * 5 * Math.sin(t * .63 + .4);   // the card breathes: never still
  ctx.save(); ctx.translate(QW.x, QW.y + dy); ctx.scale(ks, ks); ctx.translate(-QW.x, -QW.y);
  ctx.save();
  ctx.fillStyle = rgba(P.night0, .45 * (r.shadow ?? 1)); ctx.beginPath(); ctx.roundRect(r.x - r.w / 2 + 8, r.y - r.h / 2 + 12, r.w, r.h, r.r); ctx.fill();
  ctx.fillStyle = r.col; ctx.beginPath(); ctx.roundRect(r.x - r.w / 2, r.y - r.h / 2, r.w, r.h, r.r); ctx.fill();
  ctx.strokeStyle = rgba(GOLD.line, r.edge); ctx.lineWidth = 2.5; ctx.stroke();
  ctx.restore();
  const out = clamp(o.out ?? 0);
  if (out < 1) F.question(ctx, t, 'WHO DECIDES?', QW.x, QW.y + 40, 120, { ts: A.qwts, out });
  ctx.restore();
}

export default async (T, R) => {
  const G = (p, after = R.a - .3) => T.G(p, 0, after);
  const a = { start: R.a, end: R.b, ...anchorsScale(T), ...anchorsWho(T) };
  a.catchW = G('the catch is'); a.promiseW = G('the promise sees'); a.sees = G('sees you'); a.person = G('A person as a project'); a.project = G('project to be'); a.optim = G('optimized');
  a.picture = G('Picture the day'); a.everyone = G('everyone around you'); a.works = G('works with a'); a.help = G('help', a.works);
  a.same = G('You are the same'); a.yest = G('yesterday'); a.sudden = G('And suddenly'); a.slow = G('the slow one');
  a.trap = G('That is the trap'); a.trapW = G('trap he sees'); a.notThat = G('Not that the machine'); a.fails = G('fails you'); a.itWorks = G('That it works'); a.measure = G('the measure moves'); a.moves = G('moves', a.measure);
  a.ifH = G('If a human being'); a.easier = G('it gets easier'); a.some = G('That some lives'); a.useful = G('less useful'); a.desirable = G('less desirable'); a.worthy = G('less worthy');
  return [{ t: R.a, draw: scene(a, T), print: PRINT }];
};

// ---------------------------------------------------------------- layout
const YOU_H = 120, YS = { x: 960, feet: 750, h: 312 };     // you in the pan (world h) and on screen during the blueprint
const ZOOM = YS.h / YOU_H;
const WS = { y: 780, benches: [240, 600, 960, 1320, 1680], you: 2, feet: 820, h: 208 };   // the workshop (world, z 1 = screen)
const BOX = { y: 600, w: 600, h: 150, L: 540, R: 1380 }, GHOST = { x: 960, y: 360, w: 700, h: 120 };
const ROW = { y: 820, x0: 360, dx: 150, n: 9, h: 230, low: [1, 4, 7] };

function scene(a, T) {
  // the right pan's centre at the end of c03 (tilted scale) → the dive
  const panR = (t) => { const tilt = scaleTilt(t, a) * .16 + .006 * Math.sin(t * .8), hw = SC.s; return [SC.x + hw * Math.cos(tilt), SC.y - hw * Math.sin(tilt) + SC.s * .62]; };
  const P0 = panR(a.start);   // the dive target (fixed: the camera aims at where the pan is now)
  const dive0 = a.start + .05, dive1 = a.catchW + .7;   // a long, soft dive (no lurch)
  const camDive = (t) => { const u = sineIO(span(t, dive0, dive1)); const cx = lerp(W / 2, P0[0], u), cy = lerp(H / 2, P0[1] - 2 - (YS.feet - H / 2) / ZOOM, u), z = Math.exp(lerp(0, Math.log(ZOOM), u)); return [cx + F.drift(t, 2 * u, 3), cy, z]; };
  const youRise = (t) => expoOut(span(t, a.catchW - .5, a.catchW + .4));
  const scans = [[a.promiseW - .35, a.promiseW + .5, 1], [a.sees - .1, a.sees + .6, -1]];
  const flood0 = a.person - .25, flood1 = a.person + .45;             // the scan line sweeps the frame: above it, the blueprint
  const pull0 = a.picture - .2, pull1 = a.picture + 1.3;               // pull back into the workshop
  const lamp0 = a.picture + .2, lamp1 = a.picture + 1.2;               // your bench lamp gives you your colour back
  const up0 = a.trap - .7, up1 = a.trap + .6, UPD = 1800, WALLTOP = -700;                        // the camera tilts up after the mark
  const fold0 = a.ifH - .3, fold1 = a.ifH + .5;                        // the boxes fold into the card
  const card0 = a.ifH - .15;
  const close0 = a.who - .35, close1 = a.who + .35;                   // the §117 card closes into WHO DECIDES?

  // ---------------------------------------------------------------- you (yellow) and the blueprint you
  const drawYouAt = (ctx, t, x, feet, h, o = {}) => {
    const br = 1 + .006 * Math.sin(t * 2.1);
    ctx.save(); ctx.translate(x, feet); ctx.scale(1, br); ctx.translate(-x, -feet);
    F.du(ctx, x, feet, h, { look: o.look ?? .35 + .05 * Math.sin(t * .6), light: 1, back: .3, armR: o.armR, armL: o.armL, lean: o.lean });
    ctx.restore();
  };
  const BPCOL = mixHex(P.cream, '#9fc2ee', .55);
  const drawBlueprintYou = (ctx, t, x, feet, h, a1 = 1) => {
    B.tinted(ctx, (g) => F.du(g, x, feet, h, { look: .35, light: 1, back: .3 }), BPCOL, .32 * a1);
    ctx.save(); ctx.globalAlpha *= a1; ctx.strokeStyle = rgba(BPCOL, .9); ctx.setLineDash([10, 8]); ctx.lineWidth = 2;
    ctx.strokeRect(x - h * .22, feet - h * 1.0, h * .44, h * 1.0); ctx.setLineDash([]); ctx.restore();
  };

  // ---------------------------------------------------------------- 3.01 the dive, the scan
  const drawDive = (ctx, t) => {
    const [cx, cy, z] = camDive(t);
    const drop = span(t, a.start + .1, a.start + .95) ** 2;
    F.night(ctx, t, { glow: [W / 2, 420, 1000, S.breathe(t, .8)] });
    F.look(ctx, cx, cy, z, () => {
      drawScale(ctx, t, a, { labelK: 1 - span(t, a.start + .05, a.start + .6), right: (c, px, py) => {   // you rise up out of the empty pan (the pan's lip is the mask)
        const u = youRise(t); if (u <= 0) return;
        c.save(); c.beginPath(); c.rect(px - 400, py - 400, 800, 400 + 1); c.clip();
        drawYouAt(c, t, px, py - 2 + (1 - u) * YOU_H * 1.1, YOU_H);
        c.restore();
      } });
      ctx.save(); ctx.translate(0, drop * 1100); drawCatch(ctx, t, a); ctx.restore();
    });
  };
  // screen position of you (after the dive) — the scan and the readouts live in screen space
  const scanY = (t) => { for (const [s0, s1, d] of scans) { const u = span(t, s0, s1); if (u > 0 && u < 1) { const e = sineIO(u); return lerp(d > 0 ? YS.feet - YS.h - 30 : YS.feet + 10, d > 0 ? YS.feet + 10 : YS.feet - YS.h - 30, e); } } return null; };
  const READ = [['OUTPUT', '12 / DAY', .25], ['SPEED', '1.0×', .5], ['COST', '$ / HOUR', .75]];
  const drawScan = (ctx, t) => {
    if (t < scans[0][0] || t > flood1) return;
    const y = t < flood0 ? scanY(t) : lerp(-40, H + 40, sineIO(span(t, flood0, flood1)));
    if (y != null) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = lin(ctx, 0, y - 80, 0, y, [[0, rgba(GOLD.halo, 0)], [1, rgba(GOLD.halo, .3)]]); ctx.fillRect(0, y - 80, W, 80);
      ctx.restore();
      F.goldSpan(ctx, [[t < flood0 ? YS.x - 320 : -20, y], [t < flood0 ? YS.x + 320 : W + 20, y]], 0, 1, { w: 2.4, spark: false });
    }
    // readouts pinned to your body
    const ro = span(t, flood0 - .1, flood0 + .3);
    READ.forEach(([k, v, f], i) => {
      const u = span(t, a.promiseW - .1 + i * .25, a.promiseW + .4 + i * .25) * (1 - ro); if (u <= 0) return;
      const py = YS.feet - YS.h * (1 - f) + 30, px = YS.x + 70, lx = YS.x + 260;
      F.goldSpan(ctx, [[px, py], [lx - 12, py]], 0, smooth(u), { w: 1.4, spark: false });
      ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(px, py, 5 * u, 0, B.TAU); ctx.fill();
      F.capsLabel(ctx, k, lx, py - 6, u, { size: 24, col: CREAM, align: 'left' });
      F.maskLine(ctx, [[v, 1]], lx, py + 34, 34, rise(span(u, .3, 1)), { serif: true, col: GOLD.text, glow: false });
    });
    F.capsLabel(ctx, 'HOW THE PROMISE SEES YOU', W / 2, 140, span(t, a.promiseW - .2, a.promiseW + .4) * (1 - ro), { size: 28, col: CREAM });
  };

  // ---------------------------------------------------------------- 3.02 the blueprint (screen space), 3.03 the workshop (its own world)
  const BPG = mixHex(P.ind0, P.blue0, .35);
  const gridStep = 60;
  const drawBlueprint = (ctx, t, cut) => {   // cut = the flood line (blueprint above it)
    ctx.save(); ctx.beginPath(); ctx.rect(-W, -H, W * 3, cut + H); ctx.clip();
    ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, mixHex(BPG, P.night1, .35)], [1, mixHex(BPG, P.night0, .3)]]); ctx.fillRect(-W, -H, W * 3, H * 3);
    ctx.strokeStyle = rgba(BPCOL, .16); ctx.lineWidth = 1.2;
    for (let x = 0; x <= W; x += gridStep) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += gridStep) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    drawBlueprintYou(ctx, t, YS.x, YS.feet, YS.h);
    // dimension line (height), upgrade arrows, the version tag
    const dk = 1 - sineIO(span(t, pull0 - .45, pull0)), du = span(t, a.person + .1, a.person + .7) * dk;
    if (du > 0) {
      const x = YS.x - YS.h * .36, y0 = YS.feet, y1 = YS.feet - YS.h;
      F.trailCream(ctx, [[x, y0], [x, lerp(y0, y1, du)]], 0, 1, { w: 2, col: BPCOL });
      for (const yy of [y0, y1]) { ctx.fillStyle = rgba(BPCOL, du); ctx.fillRect(x - 14, yy - 1, 28, 2); }
      F.capsLabel(ctx, '1.68 M', x - 24, (y0 + y1) / 2, du, { size: 22, col: BPCOL, align: 'right' });
    }
    const au = span(t, a.project - .1, a.project + .6);
    for (let i = 0; i < 3; i++) {
      const u = span(au, i * .15, .6 + i * .15) * dk; if (u <= 0) continue;
      const x = YS.x + YS.h * .4, y = YS.feet - YS.h * (.3 + i * .25) - expoOut(u) * 24 - 10 * ((t * 1.2 + i * .3) % 1);
      ctx.save(); ctx.globalAlpha *= u; ctx.strokeStyle = GOLD.line; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 18, y + 12); ctx.lineTo(x, y - 6); ctx.lineTo(x + 18, y + 12); ctx.stroke(); ctx.restore();
    }
    const vu = span(t, a.project - .2, a.project + .3);
    if (vu > 0) {
      const tx = YS.x + YS.h * .62, ty = YS.feet - YS.h * .85;
      ctx.save(); ctx.translate(0, (1 - dk) * 0); ctx.beginPath(); ctx.rect(-W, -H, W * 3, ty + 26 + H); ctx.clip(); ctx.translate(0, (1 - dk) * 90);
      ctx.save(); ctx.globalAlpha *= clamp(vu * 3); ctx.strokeStyle = GOLD.line; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(tx - 10, ty - 52, 190, 70, 10); ctx.stroke(); ctx.restore();
      B.rollText(ctx, 'v1.0', 'v2.0', tx + 18, ty, 52, span(t, a.optim - .1, a.optim + .35), (s, xx, yy) => F.glowText(ctx, s, xx, yy, { size: 52, serif: true, col: GOLD.text, glow: s === 'v2.0' }));
      ctx.restore();
    }
    const qu = span(t, a.person + .2, a.person + .9), qo = span(t, pull0 - .5, pull0);
    if (qu > 0 && qo < 1) {
      F.maskLine(ctx, [['“…human beings are tempted to see themselves as a project to be optimized', 0]], W / 2, 150, 42, rise(qu) * (1 - sineIO(qo)), { serif: true, col: CREAM, glow: false, align: 'center' });
      F.maskLine(ctx, [['rather than as persons called to relationship and communion.”', 0]], W / 2, 202, 42, rise(span(qu, .15, 1)) * (1 - sineIO(qo)), { serif: true, col: CREAM, glow: false, align: 'center' });
      F.capsLabel(ctx, 'MAGNIFICA HUMANITAS · §112', W / 2, 250, qu * (1 - qo), { size: 24 });
    }
    ctx.restore();
  };
  // the workshop world: look (cx, cy, z); at pull0 it maps your bench spot onto the blueprint you exactly
  const camWS = (t) => { const u = sineIO(span(t, pull0, pull1)), up = sineIO(span(t, up0, up1)); const z = Math.exp(lerp(Math.log(YS.h / WS.h), 0, u)), cy0 = WS.feet - (YS.feet - H / 2) / (YS.h / WS.h); return [W / 2 + F.drift(t, 4, 5) * u, lerp(cy0, H / 2, u) - up * UPD, z]; };
  const count = (t, i) => (i === WS.you ? 12 : Math.round(lerp(12, 38, sineIO(span(t, a.works - .1 + i * .05, a.help + .3 + i * .05)))));
  const markY = (t) => WS.feet - WS.h - 14 - 150 * expoOut(span(t, a.sudden + .05, a.sudden + .7));
  const drawWorkshop = (ctx, t) => {
    const [cx, cy, z] = camWS(t), pu = sineIO(span(t, pull0, pull1));
    const lamp = span(t, lamp0, lamp1);
    F.look(ctx, cx, cy, z, () => {
      // the wall: the blueprint's horizontal lines stay as plank joints, the vertical ones fold away; warm light comes with the lamps
      const warm = lamp;
      // the blueprint's own gradient and grid, placed in this world so that at pull0 they sit exactly where the screen-space blueprint was
      const z0 = YS.h / WS.h, cy0 = WS.feet - (YS.feet - H / 2) / z0, gy0 = cy0 - H / 2 / z0, gy1 = cy0 + H / 2 / z0, gs = gridStep / z0;
      ctx.fillStyle = lin(ctx, 0, gy0, 0, gy1, [[0, mixHex(mixHex(BPG, P.night1, .35), mixHex(P.night1, P.shade0, .12), warm)], [1, mixHex(mixHex(BPG, P.night0, .3), mixHex(P.ind0, P.shade0, .1), warm)]]); ctx.fillRect(-W * 2, WALLTOP, W * 5, WS.y - WALLTOP);
      ctx.strokeStyle = rgba(mixHex(BPCOL, P.blue1, warm), lerp(.16, .5, warm)); ctx.lineWidth = lerp(1.2 / z0, 2, warm);
      for (let k = -40; k < 40; k++) { const y = gy0 + k * gs; if (y < WALLTOP || y > WS.y) continue; ctx.beginPath(); ctx.moveTo(-W * 2, y); ctx.lineTo(W * 3, y); ctx.stroke(); }
      const vk = 1 - sineIO(span(t, pull0, pull0 + .9));
      if (vk > 0) { ctx.strokeStyle = rgba(BPCOL, .16); ctx.lineWidth = 1.2 / z0; const gx0 = W / 2 - W / 2 / z0; for (let k = -60; k < 80; k++) { const x = gx0 + k * gs; const yb = Math.min(WS.y, gy1); ctx.beginPath(); ctx.moveTo(x, lerp(yb, gy0, vk)); ctx.lineTo(x, yb); ctx.stroke(); } }
      // floor
      ctx.fillStyle = lin(ctx, 0, WS.y, 0, WS.y + 400, [[0, mixHex(P.ind1, P.shade0, .15 * warm)], [1, P.night0]]); ctx.fillRect(-W * 2, WS.y, W * 5, 1200);
      ctx.fillStyle = rgba(P.blue1, .6); ctx.fillRect(-W * 2, WS.y - 1, W * 5, 2);
      // THE MEASURE: a gold mark on the wall, at your head first, then above it
      const mu = span(t, a.same - .2, a.same + .4);
      if (mu > 0) {
        const y = markY(t);
        F.goldSpan(ctx, [[WS.benches[0] - 140, y], [WS.benches[4] + 140, y]], 0, smooth(mu), { w: 2.6, spark: mu < 1 });
        F.capsLabel(ctx, 'THE MEASURE', WS.benches[4] + 140, y - 14, mu, { size: 24, col: GOLD.text, align: 'right' });
      }
      // benches, people, helpers
      WS.benches.forEach((bx, i) => {
        const me = i === WS.you, show = me ? 1 : span(t, pull0 + .2 + Math.abs(i - 2) * .12, pull0 + .9 + Math.abs(i - 2) * .12);
        if (show <= 0) return;
        ctx.save(); ctx.globalAlpha *= me ? 1 : clamp(show * 2);
        // the lamp over each bench
        const la = me ? lamp : 1;
        F.halo(ctx, bx, WS.y - 330, 190 * la, .45 * la, P.halo0, P.core0);
        ctx.strokeStyle = P.night0; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx, -1200); ctx.lineTo(bx, WS.y - 340); ctx.stroke();
        ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.beginPath(); ctx.moveTo(bx - 34, WS.y - 330); ctx.lineTo(bx + 34, WS.y - 330); ctx.lineTo(bx + 18, WS.y - 350); ctx.lineTo(bx - 18, WS.y - 350); ctx.closePath(); ctx.fill();
        // the worker (you: yellow; the others: indigo), working at the bench
        const bob = Math.sin(t * (me ? 2.2 : 4.4) + i) * .08, fx = me ? bx : bx - 10, feet = WS.feet;
        if (me) {
          if (t < lamp1) drawBlueprintYou(ctx, t, fx, feet, WS.h, 1);
          ctx.save(); if (t < lamp1) { ctx.beginPath(); ctx.arc(bx, WS.y - 330, 40 + 600 * sineIO(lamp), 0, B.TAU); ctx.clip(); }
          if (lamp > 0) drawYouAt(ctx, t, fx, feet, WS.h, { look: -.2, lean: lerp(0, .18, pu), armR: [1.35 + bob, 1.9 + bob], armL: [1.1, 1.6] });
          ctx.restore();
        } else F.person(ctx, fx, feet, WS.h, { dir: 1, lean: .2, armR: [1.35 + bob, 1.9 + bob], armL: [1.1, 1.6 + bob * .5], look: -.2, light: 1 });
        // the bench (in front of the worker)
        ctx.fillStyle = mixHex(P.shade0, P.night1, .45); ctx.fillRect(bx - 130, WS.feet - WS.h * .42, 260, 16);
        ctx.fillStyle = P.night1; ctx.fillRect(bx - 120, WS.feet - WS.h * .42 + 16, 14, WS.h * .42 - 16); ctx.fillRect(bx + 106, WS.feet - WS.h * .42 + 16, 14, WS.h * .42 - 16);
        // the helper: a small gold disc with a ring, hovering over the bench (not at yours)
        if (!me) {
          const hu = span(t, a.everyone - .2 + Math.abs(i - 2) * .1, a.works + Math.abs(i - 2) * .1), hx = bx + 70, hy = WS.feet - WS.h * .62 + 6 * Math.sin(t * 2 + i);
          if (hu > 0) { F.halo(ctx, hx, hy, 70 * hu, .8, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(hx, hy, 12 * expoOut(hu), 0, B.TAU); ctx.fill(); ctx.strokeStyle = rgba(GOLD.line, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(hx, hy, 24 * hu, 8 * hu, Math.sin(t * 1.5 + i) * .4, 0, B.TAU); ctx.stroke(); }
        }
        // output tags
        const tu = span(t, a.picture + .6, a.picture + 1.2);
        if (tu > 0) {
          const ty = WS.feet - WS.h - 60;
          if (me && t > a.same - .2) {
            const su = span(t, a.same - .2, a.same + .3);
            F.capsLabel(ctx, 'YESTERDAY 12', bx, ty - 40, su, { size: 22, col: CREAM });
            F.maskLine(ctx, [['TODAY 12', 0]], bx, ty, 30, rise(span(t, a.yest - .1, a.yest + .4)), { serif: false, weight: 700, col: CREAM, glow: false, align: 'center' });
          } else if (!me) F.maskLine(ctx, [[`TODAY ${count(t, i)}`, count(t, i) > 12 ? 1 : 0]], bx, ty, 30, rise(tu), { serif: false, weight: 700, col: count(t, i) > 12 ? GOLD.text : CREAM, glow: false, align: 'center' });
          else F.maskLine(ctx, [['TODAY 12', 0]], bx, ty, 30, rise(tu), { serif: false, weight: 700, col: CREAM, glow: false, align: 'center' });
        }
        ctx.restore();
      });
      F.capsLabel(ctx, 'OUR EXAMPLE', WS.benches[0] - 140, 260, span(t, a.picture + .3, a.picture + .9), { size: 22, align: 'left' });
      const sl = span(t, a.slow - .1, a.slow + .4);
      if (sl > 0) F.maskLine(ctx, [['the slow one', 0]], WS.benches[2], WS.feet + 70, 40, rise(sl), { serif: true, col: CREAM, glow: false, align: 'center' });
    });
  };

  // ---------------------------------------------------------------- 3.06–3.08 the trap diagram (screen space; the camera tilted up into it)
  const boxRect = (t, side) => { const f = sineIO(span(t, fold0, fold1)), cr = cardRect(); const x = side ? BOX.R : BOX.L; return { x: lerp(x, cr.x + cr.w / 2, f), y: lerp(BOX.y, cr.y + cr.h / 2, f), w: lerp(BOX.w, 60, f), h: lerp(BOX.h, 40, f), f }; };
  const box = (ctx, r, text, lit, u, o = {}) => {
    if (u <= 0 || r.f >= 1) return;
    const k = expoOut(u), w = r.w * lerp(.6, 1, k);
    ctx.save(); ctx.globalAlpha *= clamp(u * 3);
    if (lit > 0) F.halo(ctx, r.x, r.y, r.w * .6, .35 * lit, GOLD.halo, GOLD.core);
    ctx.fillStyle = mixHex(mixHex(P.night1, P.ind2, .55), GOLD.deep, .5 * lit); ctx.beginPath(); ctx.roundRect(r.x - w / 2, r.y - r.h / 2, w, r.h, 14); ctx.fill();
    ctx.strokeStyle = mixHex(CREAM, GOLD.line, lit); ctx.lineWidth = 2.5; if (o.dash) ctx.setLineDash([14, 10]); ctx.stroke(); ctx.setLineDash([]);
    if (r.f < .5) F.maskLine(ctx, [[text, 0]], r.x, r.y + 14, 40 * (1 - r.f), rise(span(u, .2, 1)), { serif: true, col: mixHex(CREAM, GOLD.text, lit), glow: lit > .5, align: 'center' });
    ctx.restore();
  };
  const drawTrap = (ctx, t) => {
    if (t < up0 + .2 || t > fold1) return;
    const off = (1 - sineIO(span(t, up0, up1))) * UPD;   // the diagram comes down with the camera tilt
    ctx.save(); ctx.translate(0, -off);
    const tu = span(t, a.trapW - .2, a.trapW + .4), fo = span(t, fold0, fold0 + .3);
    F.maskLine(ctx, [['THE TRAP', 1]], W / 2, 200, 64, rise(tu) * (1 - fo), { serif: false, weight: 700, col: GOLD.text, glow: true, align: 'center' });
    const L = boxRect(t, 0), R = boxRect(t, 1);
    box(ctx, L, 'The machine works', sineIO(span(t, a.itWorks - .05, a.itWorks + .4)), span(t, up0 + .25, up0 + .85));   // the boxes build while the camera tilts up to them
    box(ctx, R, 'The measure moves', sineIO(span(t, a.moves - .2, a.moves + .3)), span(t, up0 + .4, up0 + 1.0));
    // the arrow between them: the measure mark that flew up lands as the arrow
    const au = span(t, up1 - .3, up1 + .3) * (1 - fo);
    if (au > 0) F.arrow(ctx, [L.x + BOX.w / 2 + 14, BOX.y], [R.x - BOX.w / 2 - 14, BOX.y], au, { arc: 30, w: 3 });
    // the mark inside the right box jumps on 'moves'
    if (R.f < .5) { const my = BOX.y + 40 - 70 * expoOut(span(t, a.moves - .1, a.moves + .3)) - 35 * expoOut(span(t, a.trapW + .5, a.trapW + .9)); ctx.save(); ctx.beginPath(); ctx.rect(R.x - BOX.w / 2, BOX.y - BOX.h / 2, BOX.w, BOX.h); ctx.clip(); F.goldSpan(ctx, [[R.x + BOX.w / 2 - 70, my], [R.x + BOX.w / 2 - 20, my]], 0, 1, { w: 3, spark: false }); ctx.restore(); }
    // the ghost box: THE MACHINE FAILS YOU, struck
    const gu = span(t, a.notThat - .15, a.notThat + .4), go = expoIn(span(t, a.itWorks - .1, a.itWorks + .5));
    if (gu > 0 && go < 1) {
      ctx.save(); ctx.translate(0, -go * 500);
      box(ctx, { x: GHOST.x, y: GHOST.y, w: GHOST.w, h: GHOST.h, f: 0 }, 'The machine fails you', 0, gu, { dash: true });
      const tw = F.measure('The machine fails you', 40, true); F.strike(ctx, GHOST.x - tw / 2 - 20, GHOST.y + 2, GHOST.x + tw / 2 + 20, span(t, a.fails, a.fails + .45), { w: 7 });
      ctx.restore();
    }
    ctx.restore();
  };
  // the measure mark flies up (with the camera) and becomes the arrow
  const drawMarkFlight = (ctx, t) => {
    const u = span(t, up0, up1); if (u <= 0 || u >= 1) return;
    const [cx, cy, z] = camWS(up0), p0 = F.lookPt(cx, cy, z, WS.benches[2] - 140, markY(up0));
    const e = sineIO(u), x0 = lerp(p0[0], BOX.L + BOX.w / 2 + 14, e), y0 = lerp(p0[1], BOX.y, e) - Math.sin(Math.PI * e) * 120;
    F.goldSpan(ctx, [[x0, y0], [x0 + lerp(280 * z, R_ARROW, e), y0]], 0, 1, { w: 2.6, spark: true });
  };
  const R_ARROW = BOX.R - BOX.L - BOX.w - 28;

  // ---------------------------------------------------------------- 3.09–3.11 the §117 card, the row, WHO DECIDES?
  const Q = '“If the human being is treated as something to be perfected or surpassed, it becomes easier to accept that some lives are less useful, less desirable or less worthy.”';
  const CARD = { x: 210, y: 110, w: 1500, size: 46 };
  let CR = null; const cardRect = () => CR ?? (CR = (() => { const c = B.qcard(createCanvas(8, 8).getContext('2d'), 0, null, { text: Q, ...CARD, head: 'x', u: 1 }); return { x: c.x, y: c.y, w: c.w, h: c.h }; })());
  const drawCard = (ctx, t) => {
    if (t < card0) return;
    const cl = sineIO(span(t, close0, close1));
    if (cl >= 1) return;
    const u = span(t, card0, card0 + .6), cr = cardRect();
    if (cl <= 0) { B.qcard(ctx, t, T, { text: Q, ...CARD, head: 'MAGNIFICA HUMANITAS · §117', u, spoken: ['If a human being', 'less worthy'], after: a.ifH - .1 }); return; }
    // closing: the text sinks, the paper turns into the night question card and moves to its place
    ctx.save(); ctx.globalAlpha *= 1 - span(cl, 0, .25);
    B.qcard(ctx, t, T, { text: Q, ...CARD, head: 'MAGNIFICA HUMANITAS · §117', u: 1, spoken: ['If a human being', 'less worthy'], after: a.ifH - .1, out: span(cl, 0, .2) });
    ctx.restore();
    const r = { x: lerp(cr.x + cr.w / 2, QW.x, cl), y: lerp(cr.y + cr.h / 2, QW.y, cl), w: lerp(cr.w, QW.w, cl), h: lerp(cr.h, QW.h, cl), r: lerp(6, 16, cl), col: mixHex(PAPER.body, mixHex(P.night1, P.ind2, .55), span(cl, 0, .5)), edge: .75, shadow: 1 };
    drawWhoCard(ctx, t, a, { rect: r, out: 1 - span(cl, .5, 1), live: cl });
  };
  const drawRow = (ctx, t) => {
    const ru = span(t, a.easier - .2, a.some), out = expoIn(span(t, close0 - .2, close1));
    if (ru <= 0 || out >= 1) return;
    ctx.save(); ctx.translate(0, out * 500);
    F.land(ctx, ROW.y + (1 - sineIO(ru)) * 300);
    const lab = [['LESS USEFUL', a.useful], ['LESS DESIRABLE', a.desirable], ['LESS WORTHY', a.worthy]];
    for (let i = 0; i < ROW.n; i++) {
      const x = ROW.x0 + i * ROW.dx, li = ROW.low.indexOf(i), d = Math.abs(i - 4);
      const up = expoOut(span(t, a.easier - .2 + d * .07, a.easier + .5 + d * .07));
      const sink = li >= 0 ? expoOut(span(t, lab[li][1] + .2, lab[li][1] + .7)) * 70 : 0;
      if (li >= 0 && sink > 0) { ctx.fillStyle = mixHex(P.ind0, P.night0, .45); ctx.fillRect(x - 56, ROW.y, 112, sink); ctx.fillStyle = rgba(P.blue1, .6); ctx.fillRect(x - 60, ROW.y + sink - 1, 120, 2); }
      ctx.save(); ctx.beginPath(); ctx.rect(x - 100, -H, 200, ROW.y + sink + H); ctx.clip();
      F.person(ctx, x, ROW.y + sink + (1 - up) * ROW.h * 1.1, ROW.h, { dir: i < 4 ? 1 : -1, look: li >= 0 ? lerp(0, -.6, span(sink, 0, 70)) : .1 + .05 * Math.sin(t * .7 + i), light: 1, lean: li >= 0 ? .08 * span(sink, 0, 70) : 0 });
      ctx.restore();
      if (li >= 0) F.capsLabel(ctx, lab[li][0], x, ROW.y - ROW.h - 36 + sink, span(t, lab[li][1] - .1, lab[li][1] + .35), { size: 24, col: CREAM });
    }
    ctx.restore();
  };

  // ---------------------------------------------------------------- one frame
  return (ctx, t) => {
    if (t < flood0) { drawDive(ctx, t); drawScan(ctx, t); return; }
    if (t < pull0) {
      const cut = lerp(-40, H + 40, sineIO(span(t, flood0, flood1)));
      if (cut < H + 40) { ctx.save(); ctx.beginPath(); ctx.rect(-W, cut, W * 3, H * 3); ctx.clip(); drawDive(ctx, t); ctx.restore(); }
      drawBlueprint(ctx, t, cut);
      drawScan(ctx, t);
      return;
    }
    if (t < up1 + .05) {
      F.night(ctx, t, { glow: [W / 2, 420, 1000, .6] });
      drawWorkshop(ctx, t);
    } else F.night(ctx, t, { glow: [W / 2, 470, 1000, .6] });
    drawMarkFlight(ctx, t);
    drawTrap(ctx, t);
    drawRow(ctx, t);
    drawCard(ctx, t);
    if (t >= close1) drawWhoCard(ctx, t, a);
  };
}
import { createCanvas } from '@napi-rs/canvas';
const lin = F.lin;
