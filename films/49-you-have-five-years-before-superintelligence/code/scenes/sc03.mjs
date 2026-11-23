// Film 49 · c03 · STEP 5 · YOU (B1). Continues the B1 camera of sc02 (group(): one camPath for c02–c05, so the seams c02/c03 and
// c03/c04 are the same frame on both sides). Stage 0 layout (land x): the place card 480 · door 1 580 · door 2 830 · tread y SY0.
//
// | beat  | phrase (VO)                          | picture                                                                                  | camera / kind     |
// |-------|--------------------------------------|------------------------------------------------------------------------------------------|-------------------|
// | 5.01  | Five years to go (STEP HIT)          | the bottom step lights (F.stepLight 0); counter 5 YEARS TO GO; you climb the carved      | descend · MIX     |
// |       | The first step is you                | stair onto tread 0 and set the place card down at the edge (blank line)                  |                   |
// | 5.02  | It comes first … much later          | you on the wide step; behind the stairs the light path of DECADES keeps running;          | breathe · MIX     |
// |       |                                      | IT TAKES THE LONGEST                                                                     |                   |
// | 5.03  | Reinvent yourself. At fifty. …       | REINVENT YOURSELF / AT FIFTY; young figures rise out of the tread around you (a start-up | push · SCENE      |
// |       |                                      | poster: cool rim light); you lean back                                                   |                   |
// | 5.04  | The data disagrees                   | they sink; a garage rises: you at the workbench under a hanging lamp                     | push · MIX        |
// | 5.05★ | Among America's fastest-growing …    | data card KNOWN 45 (AVERAGE FOUNDER AGE AT THE START); on 'Not twenty-five' a struck 25   | creep · EXPL      |
// | 5.06  | But it matters who chooses           | the garage sinks; TWO EQUAL DOORS OF LIGHT rise (thumbnail C): you walk to the first;    | pull back · MIX   |
// |       |                                      | at the second a person is shoved backwards                                               |                   |
// | 5.07  | People who switch jobs late …        | push into door 1: a bright room behind it                                                | push · MIX        |
// | 5.08  | People laid off …                    | truck to door 2: a pay slip rises; on 'a quarter' its bottom tears off and falls: −28 %; | truck · EXPL      |
// |       |                                      | source OECD                                                                              |                   |
// | 5.09  | That is a comparison … chosen/forced | both doors: A COMPARISON, NOT PROOF; CHOSEN / FORCED under the doors                     | pull back · MIX   |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f49_kit.mjs';
import * as S from '../lib/f49_world.mjs';
import { group, walk, pop, upDown, popPerson, lightDoor, cardAt, SY0, SIL } from './sc02.mjs';
const { span, clamp, lerp, smooth, sineIO, expoOut, rgba, mixHex, halo, lin, P, W, H } = E;
const { GOLD, PAPER, COOL, LAMP } = F;
const TAU = Math.PI * 2;
export const C3 = { card: 480, d1: 580, d2: 830, dw: 96, dh: 205, man: 905 };

export default async (T, R) => {
  const G = group(T);
  return [{ t: R.a, draw: scene(T, G), print: F.PRINT49 }];
};

// the bright room behind door 1 (warm wall, a window with dawn-blue sky, a lamp, a plant, a table)
export function room(ctx, t, x, y, w, h, u) {
  if (u <= 0) return;
  ctx.save(); ctx.globalAlpha *= u;
  ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, mixHex(LAMP.core, GOLD.hot, .35)], [1, mixHex(GOLD.body, GOLD.mid, .4)]]); ctx.fillRect(x, y, w, h);
  ctx.fillStyle = mixHex(P.blue0, '#9fc2ee', .55); ctx.fillRect(x + w * .18, y + h * .16, w * .38, h * .3);
  ctx.fillStyle = mixHex(GOLD.shade, GOLD.mid, .5); ctx.fillRect(x + w * .36, y + h * .16, 3, h * .3); ctx.fillRect(x + w * .18, y + h * .3, w * .38, 3);
  ctx.fillStyle = mixHex(GOLD.shade, P.night1, .35);
  ctx.fillRect(x + w * .1, y + h * .74, w * .62, 5); ctx.fillRect(x + w * .14, y + h * .74, 4, h * .26); ctx.fillRect(x + w * .66, y + h * .74, 4, h * .26);   // table
  ctx.fillRect(x + w * .78, y + h * .52, 3, h * .48); ctx.beginPath(); ctx.moveTo(x + w * .72, y + h * .52); ctx.lineTo(x + w * .9, y + h * .52); ctx.lineTo(x + w * .86, y + h * .44); ctx.lineTo(x + w * .76, y + h * .44); ctx.closePath(); ctx.fill();   // lamp
  for (let i = 0; i < 5; i++) { const a = -2.4 + i * .4 + .05 * Math.sin(t * .8 + i); ctx.beginPath(); ctx.ellipse(x + w * .28 + Math.cos(a) * 9, y + h * .66 + Math.sin(a) * 9, 9, 3.5, a, 0, TAU); ctx.fill(); }   // a plant on the table
  halo(ctx, x + w * .81, y + h * .5, w * .6, .35, GOLD.halo, GOLD.core);
  ctx.restore();
}
// the pay slip behind door 2: header, rows, a total; its bottom 28 % tears off on a zigzag and falls
export const SLIP = { x: 905, w: 128, h: 170 };
function zig(x0, x1, y, n, amp) { const pts = []; for (let i = 0; i <= n; i++) pts.push([lerp(x0, x1, i / n), y + (i % 2 ? amp : -amp)]); return pts; }
export function paySlip(ctx, t, u, tear, x, y) {
  pop(ctx, u, y, () => {
    const { w, h } = SLIP, x0 = x - w / 2, y0 = y - h - 6, cut = y0 + h * .72, Z = zig(x0, x0 + w, cut, 12, 3);
    const body = (part) => {
      ctx.save(); ctx.beginPath();
      if (part === 0) { ctx.moveTo(x0, y0); ctx.lineTo(x0 + w, y0); for (let i = Z.length - 1; i >= 0; i--) ctx.lineTo(...Z[i]); }
      else { for (const p of Z) ctx.lineTo(...p); ctx.lineTo(x0 + w, y0 + h); ctx.lineTo(x0, y0 + h); }
      ctx.closePath(); ctx.fillStyle = lin(ctx, 0, y0, 0, y0 + h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fill(); ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 1.2; ctx.stroke(); ctx.clip();
      ctx.fillStyle = rgba(PAPER.ink, .8); ctx.fillRect(x0 + 12, y0 + 14, 34, 7);
      E.glowText(ctx, 'PAY', x0 + w - 14, y0 + 23, { size: 13, weight: 700, align: 'right', col: PAPER.faint, glow: false, spacing: .1 });
      for (let i = 0; i < 6; i++) { ctx.fillStyle = rgba(PAPER.ink, .35); ctx.fillRect(x0 + 12, y0 + 40 + i * 13, 56 - (i % 3) * 9, 4); ctx.fillRect(x0 + w - 42, y0 + 40 + i * 13, 30, 4); }
      ctx.fillStyle = rgba(PAPER.ink, .7); ctx.fillRect(x0 + 12, y0 + h - 30, w - 24, 2); ctx.fillRect(x0 + w - 52, y0 + h - 22, 40, 7);
      ctx.restore();
    };
    body(0);
    // the torn quarter: it comes away (a small turn), then tips forward and lies flat on the tread at the slip's foot
    const k = expoOut(clamp(tear * 2)), fall = sineIO(clamp(tear * 1.6 - .5)), by = y0 + h;
    ctx.save(); ctx.translate(x0 + w * .5 + 16 * k + 26 * fall, by + 5 * fall); ctx.scale(1, lerp(1, .1, fall)); ctx.rotate(.1 * k * (1 - fall)); ctx.translate(-(x0 + w * .5), -by);
    body(1);
    ctx.restore();
  });
}

function scene(T, G) {
  const { a } = G, hit = a.hit[0];
  return (ctx, t) => {
    const c = G.cam(t);
    // ---- you
    const climb = smooth(span(t, a.five + .45, a.first + .9));
    const w1 = walk(t, a.first + .9, a.comes - .1, 438, 520, 0, .3);
    const w2 = walk(t, a.pays + .4, a.pays + 2.4, 520, 640, 0, .5);
    const w3 = walk(t, a.data + .1, a.data + 1.0, 640, 690, 0, .35);
    const w4 = walk(t, a.switch + .1, a.switch + 1.5, 690, C3.d1 + 60, 0, .5);
    let you;
    if (t < a.five + .45) you = { x: S.YOU.x, y: S.GY, o: { look: .8, back: .35, dir: 1 } };
    else if (climb < 1) { const p = S.climbPos(0, climb); you = { x: lerp(S.YOU.x, 438, climb), y: p.y, o: { walk: climb * 9, dir: 1, back: .3 } }; }
    else if (w1.moving) you = { x: w1.x, y: SY0, o: { walk: w1.ph, dir: 1 } };
    else if (t < a.pays + .4) { const r = F.bump(t, a.comes - .15, .9); you = { x: 520, y: SY0, o: { dir: 1, look: .4, back: .3, lean: .12 * r, armR: r > 0 ? [lerp(.2, .9, r), lerp(.1, .7, r)] : undefined } }; }
    else if (w2.moving) you = { x: w2.x, y: SY0, o: { walk: w2.ph, dir: 1 } };
    else if (t < a.data + .1) { const hes = smooth(span(t, a.sounds - .2, a.sounds + .8)); you = { x: 640, y: SY0, o: { dir: 1, look: lerp(.45, .15, hes), lean: -.07 * hes, back: .3 } }; }
    else if (w3.moving) you = { x: w3.x, y: SY0, o: { walk: w3.ph, dir: 1 } };
    else if (t < a.matters + .2) you = { x: 690, y: SY0, o: { dir: 1, pose: 'hold', look: .05 + .05 * Math.sin(t * .7), back: .3 } };
    else if (t < a.switch + .1) you = { x: 690, y: SY0, o: { dir: -1, look: .45, back: .3 } };
    else if (w4.moving) you = { x: w4.x, y: SY0, o: { walk: w4.ph, dir: -1 } };
    else you = { x: C3.d1 + 60, y: SY0, o: { dir: -1, look: .35 + .05 * Math.sin(t * .5), back: .4 } };
    // ---- the props (each rises out of the tread and sinks back)
    const young = upDown(t, a.sounds - .5, a.data - .3, .8);
    const garage = upDown(t, a.data + .05, a.matters - .2, .8);
    const doors = span(t, a.matters + .1, a.matters + 1.3);
    const inside = smooth(span(t, a.switch + 1.0, a.switch + 2.4));
    const slipU = span(t, a.laid + .3, a.laid + 1.1), tear = span(t, a.quarter + .15, a.quarter + 1.9);
    const manU = span(t, a.matters + .5, a.matters + 1.2), shove = trav(t, a.matters + 1.4, a.matters + 2.7);
    const cardDown = smooth(span(t, a.first + 1.6, a.comes + .2));
    const st = {
      old: .6, lit: G.lit(t), you,
      decades: 1 - smooth(span(t, a.reinvent - .6, a.reinvent + 1.6)),
      land: (cx, hands) => {
        cardAt(cx, t, { at: [C3.card, SY0 + 1], hand: hands?.R, k: 1 - cardDown, s: 44 });
        // 5.03 the start-up poster: four young figures (cool rim light, short jackets) rise round you
        if (young > 0) [[560, .0, -1], [745, .12, 1], [805, .2, 1], [880, .3, -1]].forEach(([x, d, dir], i) =>
          popPerson(cx, t, clamp(young * 1.4 - d), x, SY0, 150 - (i % 2) * 8, { dir, light: -dir, back: .7, rim: COOL.line, look: .35, lean: .03 * Math.sin(t * .9 + i), armR: i === 1 ? [.9, 1.9] : undefined }));
        // 5.04 the garage: roll-door frame, a hanging lamp, the workbench with tools
        if (garage > 0) pop(cx, garage, SY0, () => {
          cx.strokeStyle = SIL; cx.lineWidth = 8; cx.strokeRect(625, SY0 - 230, 240, 230);
          cx.fillStyle = rgba(P.ind1, .55); for (let i = 0; i < 6; i++) cx.fillRect(633, SY0 - 222 + i * 9, 224, 3);   // the rolled-up door
          cx.fillStyle = SIL; cx.fillRect(705, SY0 - 62, 140, 8); cx.fillRect(712, SY0 - 54, 6, 54); cx.fillRect(832, SY0 - 54, 6, 54);   // bench
          cx.fillRect(740, SY0 - 76, 30, 14); cx.fillRect(790, SY0 - 70, 4, 8); cx.fillRect(780, SY0 - 74, 24, 5);                       // a box, a vice
          cx.fillRect(772, SY0 - 222, 2, 70); cx.beginPath(); cx.moveTo(758, SY0 - 150); cx.lineTo(788, SY0 - 150); cx.lineTo(780, SY0 - 162); cx.lineTo(766, SY0 - 162); cx.closePath(); cx.fill();
          halo(cx, 773, SY0 - 140, 110, .4, GOLD.halo, LAMP.core);
        });
        // 5.06 the two doors (thumbnail C); door 1 opens onto a bright room, door 2 stays plain light
        if (doors > 0) {
          lightDoor(cx, t, C3.d1, SY0, C3.dw, C3.dh, doors, { inner: (x, y, w, h) => room(cx, t, x, y, w, h, inside) });
          lightDoor(cx, t, C3.d2, SY0, C3.dw, C3.dh, clamp(doors * 1.15 - .15));
        }
        // the shoved person at door 2: rises, then is pushed backwards toward the door
        if (manU > 0) { const x = lerp(C3.man + 60, C3.man - 18, shove), jolt = F.bump(t, a.matters + 1.4, .9);
          popPerson(cx, t, manU, x, SY0, 160, { dir: 1, light: -1, back: .6, lean: -.16 * jolt - .05 * shove, look: .3, armR: [lerp(.2, 1.6, jolt), lerp(.1, 1.9, jolt)], armL: [lerp(-.2, -1.3, jolt), lerp(-.1, -1.6, jolt)], walk: jolt > .05 ? shove * 4 : undefined }); }
        if (slipU > 0) {
          paySlip(cx, t, slipU, tear, SLIP.x + 75, SY0);
          const lu = span(t, a.quarter + .5, a.quarter + 1.3) * (1 - span(t, a.comparison + .3, a.comparison + 1.1));
          if (lu > 0) F.goldText(cx, [['−28 %', 0]], SLIP.x + 75, SY0 - SLIP.h - 24, 44, F.rise(lu), { serif: true, align: 'center', col: P.cream });
        }
        // 5.09 CHOSEN / FORCED under the doors (on the riser below the tread)
        const cu = span(t, a.chosen - .1, a.chosen + .6), fu = span(t, a.forced - .05, a.forced + .6);
        if (cu > 0) F.goldText(cx, [['CHOSEN', 1]], C3.d1, SY0 + 46, 26, F.rise(cu), { serif: false, weight: 700, spacing: .12, align: 'center' });
        if (fu > 0) F.goldText(cx, [['FORCED', 0]], C3.d2, SY0 + 46, 26, F.rise(fu), { serif: false, weight: 700, spacing: .12, align: 'center', col: P.halo2 });
      },
    };
    S.stairsWorld(ctx, c, t, st);
    // ---- words and explainers (screen space)
    const cap = (lines, t0, t1, o = {}) => { const u = span(t, t0, t0 + .9), out = span(t, t1 - .6, t1 + .1); if (u > 0 && out < 1) F.caption(ctx, t, o.x ?? 90, o.y ?? 250, lines, u, { size: o.size ?? 108, out: out > 0 ? out : null }); };
    cap(['IT TAKES THE LONGEST'], a.comes + .4, a.pays + 2.0, { size: 96, y: 300 });
    cap(['REINVENT YOURSELF', 'AT FIFTY'], a.reinvent + .05, a.data - .1, { size: 104, y: 290 });
    cap(['A COMPARISON,', 'NOT PROOF'], a.comparison + .1, a.same + .3, { size: 92, y: 285 });
    // ★ the founders card (KNOWN): the world glides on under a light veil
    const fu = span(t, a.among + .1, a.among + 1.0), fo = span(t, a.matters - .5, a.matters + .3);
    if (fu > 0 && fo < 1) {
      const k = fu * (1 - fo); F.veil(ctx, .42 * sineIO(k));
      F.dataCard(ctx, t, 1060, 180, 700, { u: fu, a: 1 - fo, kind: 'KNOWN', title: F.SOURCES.foundersLabel, big: F.SOURCES.foundersBig, bigSize: 104, small: 'FASTEST-GROWING 0.1 % OF NEW U.S. FIRMS', h: 300 });
      const nu = span(t, a.notTwenty, a.notTwenty + .6) * (1 - fo);
      if (nu > 0) { F.goldText(ctx, [['25', 0]], 1250, 366, 64, F.rise(nu), { serif: true, col: P.halo2 }); F.goldSpan(ctx, [[1242, 344], [1320, 328]], 0, smooth(span(t, a.notTwenty + .3, a.notTwenty + .8)), { w: 3, spark: false }); }
    }
    F.counter(ctx, t, T);
    F.source(ctx, t, a.among + .9, a.matters, F.SOURCES.founders);
    F.source(ctx, t, a.laid + 1.4, a.comparison + .6, F.SOURCES.laidOff);
  };
}
function trav(t, t0, t1) { return sineIO(span(t, t0, t1)); }
