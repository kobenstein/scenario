// Film 15 · B2 · c10 (306.24 – 331.00) · Station 7a: hepatitis C, curable since 2015, only 1 in 5 treated, "It's reach".
//   10.01  (the box from c09, INFECTIONS glowing) "Then what's holding back the cures we already have?": push back into the
//          compartment, into the room, to the bedside table: a blister pack of light; it lights up on "already have"
//   10.02  the pack, close: HEPATITIS C · CURABLE SINCE 2015 · WHO · 2026; on "pills" one pill presses out of the blister
//   10.03★ the pill drops to the floor and rolls right, out of the room along the floor line, to five plain figures (indigo);
//          it reaches the first, who turns warm: 1 IN 5 · TREATED SINCE 2015 · WHO GLOBAL HEPATITIS REPORT 2026. Four wait.
//   10.04  pull back: dark between the pack and the four who wait; on "reach" a road of light pushes out from the pack along the
//          floor, under the four and on → c11
// The room is c09's room (lib/f15_b2_c09.mjs drawRoom, design space of the room, floor 860), its right wall ends at ROOM.wallX
// and the floor runs on into the open night. The camera is a view on the room's design space (viewCam / V from c09).
import { Path2D } from '@napi-rs/canvas';
import * as C from './f15_b2_common.mjs';
import { V, viewCam, ROOM, CELL0 } from './f15_b2_c09.mjs';
const { E, F } = C;
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, card, aim, camDrift, F0, prng } = E;

export const PACK = { x: 1392, y: 742, w: 92, h: 58 };                 // standing on the bedside table (bottom centre)
export const FIG = { x0: 2480, gap: 205, h: 390, y: ROOM.floor + 8 };   // the five figures
export const ROAD = { y: ROOM.floor + 18, x0: PACK.x, x1: 4180 };        // the road of light (c10 → c11)
const BL = [];                                                          // blister bubbles (2 rows × 4), in pack coords
for (let r = 0; r < 2; r++) for (let q = 0; q < 4; q++) BL.push([-PACK.w * .36 + q * PACK.w * .24, -PACK.h * .68 + r * PACK.h * .38]);
const POP = 6;                                                          // the bubble the pill comes out of

export const figX = (i) => FIG.x0 + i * FIG.gap + (i ? 18 * Math.sin(i * 2.1) : 0);
export function setH(T, WS) {
  const S = (w, n) => T.S('s10', w, n);
  const a = {
    T10: T.seg('s10').start, machine: S('machine'), then: S('Then'), holding: S('holding'), already: S('already'), have: S('have?'),
    hep: S('Hepatitis'), curable: S('curable'), since: S('since'), pills: S('pills'), andyet: S('And yet'), who: S('World'),
    one: S('one in five'), treated: S('treated'), most: S('Most'), waiting: S('waiting'), whats: S("What's missing"), intel: S('intelligence'),
    its: S("It's"), reach: S('reach'), T11: T.seg('s11').start,
  };
  const t0 = a.machine + .75;                                              // H takes over from c09's box view here
  // the room view that equals c09's camera at t0 (the cell's rect on screen → the room's design space)
  const c0 = WS.camW(t0), m0 = E.cardM(c0, F0), sw0 = m0.k * CELL0.w;
  const R0 = V(W / 2, ROOM.floor - 300, sw0 / W, { sx: m0.e + m0.k * (CELL0.x + CELL0.w / 2), sy: m0.f + m0.k * (CELL0.y + CELL0.h / 2) });
  // the pill's path (room design coords) and timing
  const tPop = [a.pills - .25, a.pills + .35], tHop = [a.pills + .35, a.andyet + .05], tDrop = [a.andyet + .05, a.andyet + .4];
  const tRoll = [a.andyet + .4, a.one - .05];
  const popAt = [PACK.x + BL[POP][0], PACK.y + BL[POP][1]], edge = [ROOM.table.x + ROOM.table.w + 6, ROOM.table.top - 7];
  const floorAt = [edge[0] + 40, ROOM.floor + 2], rollTo = FIG.x0 - 34, PR = 7;
  function pillPos(t) {
    if (t < tPop[0]) return null;
    if (t < tPop[1]) { const u = expoOut(span(t, ...tPop)); return [popAt[0] + 6 * u, popAt[1] - 3 * u, 0, 1 + .25 * Math.sin(Math.PI * u)]; }
    if (t < tHop[1]) { const u = sineIO(span(t, ...tHop)); return [lerp(popAt[0] + 6, edge[0], u), lerp(popAt[1] - 3, edge[1], u) - 26 * Math.sin(Math.PI * u), u * 4, 1]; }
    if (t < tDrop[1]) { const u = span(t, ...tDrop); return [lerp(edge[0], floorAt[0], u), lerp(edge[1], floorAt[1] - PR, u * u), 4 + u * 3, 1]; }
    const u = span(t, ...tRoll), e = 1 - (1 - u) ** 2.4, x = lerp(floorAt[0], rollTo, e), hop = 10 * Math.abs(Math.sin(Math.PI * clamp(u * 3))) * (1 - clamp(u * 3)) ;
    return [x, floorAt[1] - PR - hop, 7 + (x - floorAt[0]) / PR, 1];
  }
  // camera keys (room design space)
  const PK = [PACK.x - 10, PACK.y - PACK.h * .55];
  const K = [
    [t0, R0],
    [a.already + .45, V(PK[0], PK[1], 2.5, { sx: 640, sy: 560, e: 's' })],
    [a.hep + .4, V(PK[0], PK[1], 4.1, { sx: 650, sy: 560, e: 'o' })],
    [a.pills - .2, V(PK[0], PK[1], 4.4, { sx: 660, sy: 560 })],
    [a.andyet + .45, V(edge[0] + 30, ROOM.floor - 80, 2.6, { sx: 900, sy: 620 })],
    [a.one - .1, V(FIG.x0 + 2 * FIG.gap - 40, ROOM.floor - 210, 1.08, { sx: 1120, sy: 520 })],
    [a.whats - .1, V(FIG.x0 + 2 * FIG.gap - 20, ROOM.floor - 210, 1.13, { sx: 1120, sy: 520 })],
    [a.reach - .2, V(2420, ROOM.floor - 250, .5, { sy: 520 })],
    [a.T11, V(2900, ROOM.floor - 240, .56, { sy: 520 })],
  ];
  const DRIFT = 1.2;
  const camH = (t) => camDrift(viewCam(t, K), t, DRIFT * smooth(span(t, t0, t0 + 1.5)) * (1 - .7 * Math.sin(Math.PI * clamp(span(t, t0, a.already + .4)))));
  const roomWarm = WS.roomWarm;

  // -------------------------------------------------------------------------------------------- things in the room
  const pk = smoothPack();
  function smoothPack() { const p = new Path2D(); p.roundRect(-PACK.w / 2, -PACK.h, PACK.w, PACK.h, 5); return p; }
  function pack(ctx, t, k) {
    const lit = smooth(span(t, a.already - .3, a.already + .6)), br = 1 + .03 * Math.sin(t * 1.6);
    ctx.save(); ctx.translate(PACK.x, PACK.y); ctx.rotate(-.04);
    // foil card: dim cool before, warm light on "already have"
    E.glowFill(ctx, pk, 26, .35 + .35 * lit, mixHex(P.blue0, P.halo1, lit));
    ctx.fillStyle = E.lin(ctx, 0, -PACK.h, 0, 0, [[0, mixHex(mixHex(P.ind2, P.blue1, .6), P.core1, lit)], [1, mixHex(P.ind1, P.halo1, lit)]]); ctx.fill(pk);
    ctx.strokeStyle = rgba(mixHex(P.blue0, P.halo0, lit), .8); ctx.lineWidth = 1.2; ctx.stroke(pk);
    BL.forEach(([bx, by], i) => {
      const gone = i === POP && t > tPop[0] + .05;
      const bp = new Path2D(); bp.roundRect(bx - 8, by - 3.6, 16, 7.2, 3.6);
      if (gone) { ctx.fillStyle = rgba(P.night1, .7); ctx.fill(bp); ctx.strokeStyle = rgba(P.halo2, .6); ctx.lineWidth = .6; ctx.stroke(bp); return; }
      C.lightBody(ctx, bp, t, { g: { x: bx - 2, y: by - 2, R: 11 * br }, lit: lit > .5 ? 1 : 0, glow: .5 * (.3 + lit), blurR: 10, edge: false, a: .55 + .45 * lit });
    });
    ctx.restore();
  }
  function pill(ctx, t) {
    const p = pillPos(t); if (!p) return;
    const [x, y, rot, sc] = p;
    E.halo(ctx, x, y, 34, .3, P.halo1, P.core1);
    F.pill(ctx, x, y, 2 * PR * 2.2 * sc, t, { rot, lit: [1, 1] });
  }
  function figures(ctx, t, k) {
    for (let i = 0; i < 5; i++) {
      const x = FIG.x0 + i * FIG.gap + (i ? 18 * Math.sin(i * 2.1) : 0), h = FIG.h * (1 + .05 * Math.sin(i * 1.7 + .4));
      const warm = i === 0 ? sineIO(span(t, a.one - .05, a.treated + .2)) : (WS.extras.figWarm ? WS.extras.figWarm(i, t) : 0);
      if (WS.extras.figRing) WS.extras.figRing(ctx, i, x, FIG.y, h, t);
      if (warm > 0) E.halo(ctx, x, FIG.y - h * .5, h * .9, .32 * warm, P.halo1, P.core1);
      C.person(ctx, x, FIG.y, h, t, { warm, dir: -1 });
    }
  }
  function road(ctx, t, k) {
    const u = sineIO(span(t, a.reach - .25, a.T11 - .1));
    if (u <= 0) return;
    const x1 = lerp(ROAD.x0, ROAD.x1, u);
    // the light on the floor round the road, then the road itself (a thin warm band with a bright core)
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = E.lin(ctx, 0, ROAD.y - 60, 0, ROAD.y + 60, [[0, rgba(P.halo1, 0)], [.5, rgba(P.halo1, .2)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(ROAD.x0, ROAD.y - 60, x1 - ROAD.x0, 120);
    ctx.restore();
    F.trailSpan(ctx, [[ROAD.x0, ROAD.y], [ROAD.x1, ROAD.y]], 0, u, { w: 7, spark: u < 1 });
  }
  WS.extras.room = (ctx, t, k) => { pack(ctx, t, k); figures(ctx, t, k); road(ctx, t, k); pill(ctx, t); };

  // -------------------------------------------------------------------------------------------- draw
  function draw(ctx, t) {
    const c = camH(t), m = E.cardM(c, F0), sw = m.k * W;               // the room's width on screen
    // while the cell does not yet cover the frame, the box (c09) is the world and the room is inside its first compartment
    const cellH = sw * CELL0.h / CELL0.w, cx = m.e + m.k * W / 2, cy = m.f + m.k * (ROOM.floor - 300);
    if (t < a.already && (sw < W * 1.02 || cellH < H * 1.02 || Math.abs(cx - W / 2) > (sw - W) / 2 || Math.abs(cy - H / 2) > (cellH - H) / 2)) {
      const sb = sw / CELL0.w, bc = aim(F0, CELL0.x + CELL0.w / 2, CELL0.y + CELL0.h / 2, sb, cx, cy, Math.max(F0, 80 * sb));
      WS.boxWorld(ctx, t, bc, { litK: 1 - smooth(span(sw, W * .2, W * .95)) });
    } else WS.drawRoom(ctx, t, c, { warm: roomWarm(t), extra: (cx2, k) => WS.extras.room(cx2, t, k) });
    text(ctx, t);
  }
  function text(ctx, t) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const o1 = span(t, a.andyet - .2, a.andyet + .3), u1 = smooth(span(t, a.hep - .15, a.hep + 1.1)) * (1 - expoIn(o1));
    if (u1 > 0) F.numberBlock(ctx, { x: 1130, y: 470, num: 'Hepatitis C', label: 'curable since 2015', src: 'WHO · 2026', u: u1, size: 118 });
    const o2 = span(t, a.whats - .2, a.whats + .3), u2 = smooth(span(t, a.one - .2, a.one + 1.0)) * (1 - expoIn(o2));
    if (u2 > 0) F.numberBlock(ctx, { x: 150, y: 290, num: '1 in 5', label: 'treated since 2015', src: 'WHO Global Hepatitis Report 2026', u: u2, warm: 1 });
    ctx.restore();
  }
  return { draw, t0, a, camH, K };
}
