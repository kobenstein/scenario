// Film 23 · B2 · c06 rework (2026-11-09, Jakob: the day must live): Dad's building at 16:00 in afternoon daylight, its COURTYARD.
// The courtyard is the sunny gap right of Dad's building (X 6444 … 6900, deep to Z 4300) and the paved yard in front of it and of the
// neighbour's building (X 6444 … 8300, Z 2400 … 3000). Dad stands on the low ground-floor terrace in the gap (his "balcony" down in the
// yard), the shared tomato bed in front, the neighbour behind it, kids with a ball by the neighbour's door, a delivery robot calling.
// Everything in world units; call from K.world's `over` (it runs on the section plane after the street row, before the street front).
//
//   dadFacade(ctx, t, L, o)        Dad's closed facade (ZS plane), daylight, its window grid matching plateWindow (lib/f23_seams.mjs).
//                                   o: { fh (visible height: the facade slides down) }. The facade IS lib/f23_seams.mjs plateWindowContent
//                                   laid where the plate camera sees it (so the B1 → B2 seam at 239.02 lands exactly), plus the rest of the grid.
//   courtyard(ctx, c, t, L, o)     the yard back to front. o: { people: [[Z, fn(ctx)]] (figures at their depth, drawn in world units),
//                                   robot {x, z, dir, lid, roll} | null }
//   glyphBubble(ctx, x, y, r, t, o) a speech bubble with abstract script: o.style 0 = looped right-to-left script (the neighbour's
//                                   language), 1 = blocky left-to-right dashes (Dad's); o.u grows, o.warm / o.cool tint, o.tail ±1
//   shadowOn(ctx, c, X, Z, w, len, a) a long afternoon shadow on the yard floor from a foot point (the sun is behind the row, right)
import * as E from './f10_editorial.mjs';
import * as K from './f23_kit.mjs';
import * as S from './f23_street.mjs';
import { plateWindowContent, WINDOW_GLASS } from './f23_seams.mjs';
const { P, clamp, lerp, span, smooth, sineIO, expoOut, rgba, mixHex, lin, rad, halo, prng } = E;
const { ZS, STREET, floorY } = K;
const D = STREET.dad;
const DAYC = K.DAYC || { face: '#3352a8', faceLo: '#1e367f', rim: '#6d8bd6', side: '#6383d0', glass: '#182a6b', street: '#2b4290', streetLo: '#16265f', ground: '#1b2c6c', tree: '#21418f', treeLit: '#4a6fc4', wall: '#33509f', wallLo: '#1e3378', cut: '#4c68b3' };
const dm = (night, day, L, k = 1) => mixHex(night, day, clamp((L.day ?? 0) * k));

// ---------------------------------------------------------------- layout (world units)
export const GAP = [D.x1 + 44, 6900];                                 // the open gap between Dad's building and the neighbour's
export const TERR = { x0: GAP[0] + 8, x1: GAP[1] - 10, y: -80, z0: 2790, z1: 3320 };   // the low terrace (deck top y −80)
export const BED = { x0: 6975, x1: 7420, z: 2960, h: 62 };             // the shared raised tomato bed (against the neighbour's wall)
export const DAD_YARD = [6650, TERR.y, 2990];                          // Dad on the terrace [X, Y(feet), Z]
export const NB_YARD = [7050, 0, 2800];                                // the neighbour in front of the bed
export const NB_DOOR = 7985;                                           // the neighbour building's door (ground floor)
export const YOU_YARD = [6380, 0, 2900];                               // you, at the foot of the terrace (6.03)
export const KIDS = [[7600, 2990], [7800, 3010]];                      // two kids with a ball
export const BENCH = [8180, 3010];

// the facade window grid: matches plateWindow at its camera (look(4748, −1820, ZS, 1.65) → screen (960, 520))
const PS = 1.65, PCX = 4748, PCY = -1820;   // plate px (sx, sy) ↔ world (PCX + (sx − 960)/PS, PCY + (sy − 520)/PS) on ZS
const WIN_W = 220 / PS, WIN_H = 280 / PS;
const COLS = [4348, 4748, 5148, 5548, 5948], ROWS = [-2366, -1978, -1590, -1202, -814, -426];
const facadeWins = () => { const o = []; for (const y of ROWS) for (const x of COLS) { if (x === PCX && (y === -1978 || y === -1590)) continue; o.push([x, y]); } return o; };
const WINS = facadeWins();

export function dadFacade(ctx, t, L, o = {}) {
  const top = floorY(D.floors), fh = o.fh ?? -top + 70, x0 = D.x0 - 44, x1 = D.x1 + 44;
  if (fh <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.rect(x0, Math.max(top - 10, -fh), x1 - x0, Math.min(fh, -top + 10)); ctx.clip();
  // the facade IS the seam plate's content (lib/f23_seams.mjs plateWindowContent), laid where the plate camera sees it: identical at the
  // plate camera, so the B1 → B2 seam lands with no lift; the plate's low-sun warmth (a function of x) continues outside its frame
  ctx.save(); ctx.transform(1 / PS, 0, 0, 1 / PS, PCX - 960 / PS, PCY - 520 / PS);
  plateWindowContent(ctx, t);
  ctx.beginPath(); ctx.rect(-6000, -6000, 14000, 14000); ctx.rect(0, 0, E.W, E.H); ctx.clip('evenodd');
  ctx.fillStyle = lin(ctx, E.W, 0, 0, 0, [[0, rgba(DAYC.warm || P.halo0, .22)], [.6, rgba(DAYC.warm || P.halo0, 0)]]); ctx.fillRect(-6000, -6000, 14000, 14000);
  ctx.restore();
  // the rest of the window grid in the plate's window style (the four plate windows and Dad's are drawn by the plate content)
  for (const [x, y] of WINS) {
    if ((x === 4348 || x === 5148) && (y === -1978 || y === -1590)) continue;
    const wx = x - WIN_W / 2, wy = y - WIN_H / 2;
    ctx.fillStyle = WINDOW_GLASS; ctx.fillRect(wx, wy, WIN_W, WIN_H);
    ctx.fillStyle = rgba(P.cream, .07); ctx.beginPath(); ctx.moveTo(wx, wy + WIN_H * 200 / 280); ctx.lineTo(wx + WIN_W * 120 / 220, wy); ctx.lineTo(wx + WIN_W * 180 / 220, wy); ctx.lineTo(wx, wy + WIN_H); ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = rgba(DAYC.rim, .95); ctx.fillRect(x0, top - 3, x1 - x0, 6);   // the lit roof rim
  // the ground floor: the house door (to the stairs) near the yard, a canopy; a gold sun patch slanting across the wall by the yard
  { const dx = 6215, dw = 120; ctx.fillStyle = mixHex(DAYC.glass, P.night1, .2); ctx.fillRect(dx - dw / 2, -250, dw, 250); ctx.fillStyle = rgba(P.halo0, .6); ctx.fillRect(dx + dw / 2 - 18, -140, 8, 30);
    ctx.fillStyle = DAYC.cut; ctx.fillRect(dx - dw / 2 - 30, -275, dw + 60, 16); }
  ctx.fillStyle = mixHex(DAYC.face, DAYC.warm || P.halo0, .72 * L.day); ctx.beginPath(); ctx.moveTo(x1, -470); ctx.lineTo(x1, -300); ctx.lineTo(x1 - 260, -60); ctx.lineTo(x1 - 260, -230); ctx.closePath(); ctx.fill();
  ctx.restore();
}

// ---------------------------------------------------------------- the yard
// a long shadow on the floor (Y 0 or the deck): from the foot point toward the camera and left (the sun is behind the row, right)
export function shadowOn(ctx, c, X, Z, w, len, a = .4, Y = 0) {
  const q = [[X - w, Y, Z], [X + w, Y, Z], [X + w - len * .55, Y, Z - len], [X - w - len * .55, Y, Z - len]];
  K.quad(ctx, c, q, rgba(mixHex(P.night1, P.ind1, .5), a));
}
// the screen clip of the gap (so the back yard shows only through it)
function gapClip(ctx, c, yTop) {
  const a = K.wp(c, GAP[0], yTop, ZS), b = K.wp(c, GAP[1], 40, ZS); if (!a || !b) return false;
  ctx.beginPath(); ctx.rect(a[0], a[1], b[0] - a[0], b[1] - a[1]); ctx.clip(); return true;
}
function backYard(ctx, c, t, L) {
  const ZF = 4300;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (!gapClip(ctx, c, -760)) { ctx.restore(); return; }
  // the yard floor deep into the gap, sunlit
  K.quad(ctx, c, [[GAP[0] - 300, 0, ZS], [GAP[1] + 300, 0, ZS], [GAP[1] + 300, 0, ZF], [GAP[0] - 300, 0, ZF]], (q) => lin(ctx, 0, q[2][1], 0, q[0][1], [[0, mixHex(P.halo2, DAYC.street, .35)], [1, mixHex(DAYC.street, P.halo1, .3)]]));
  K.atZ(ctx, c, ZF, () => {   // the low back house across the yard, lit gold by the low sun, a round tree in front of it
    ctx.fillStyle = lin(ctx, 0, -720, 0, 0, [[0, mixHex(DAYC.face, P.halo2, .45)], [1, mixHex(DAYC.face, P.halo1, .2)]]); ctx.fillRect(GAP[0] - 900, -720, GAP[1] - GAP[0] + 1800, 720);
    ctx.fillStyle = rgba(DAYC.glass, .8); for (let x = GAP[0] - 760; x < GAP[1] + 900; x += 240) { ctx.fillRect(x, -560, 110, 150); ctx.fillRect(x, -260, 110, 150); }
    // a line of washing across the back yard, moving in the breeze (slow life)
    ctx.strokeStyle = rgba(P.cream, .5); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(GAP[0] - 100, -380); ctx.quadraticCurveTo(6672, -330, GAP[1] + 100, -380); ctx.stroke();
    [[6520, P.cream], [6600, P.halo2], [6800, mixHex(P.cream, DAYC.rim, .4)]].forEach(([x, col], i) => { const sw = 6 * Math.sin(t * 1.3 + i * 1.7); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x - 30, -362); ctx.lineTo(x + 30, -362); ctx.lineTo(x + 30 + sw, -290); ctx.lineTo(x - 30 + sw, -290); ctx.closePath(); ctx.fill(); });
  });
  // the low sun shines through the gap: a warm haze
  const g = K.wp(c, (GAP[0] + GAP[1]) / 2, -420, ZF);
  if (g) { ctx.fillStyle = rad(ctx, g[0], g[1], 1100 * g[2], [[0, rgba(P.core0, .85 * L.day)], [.3, rgba(K.WARM.hi, .45 * L.day)], [.7, rgba(K.WARM.mid, .12 * L.day)], [1, rgba(K.WARM.mid, 0)]]); ctx.fillRect(g[0] - 1100 * g[2], g[1] - 1100 * g[2], 2200 * g[2], 2200 * g[2]); }
  ctx.restore();
}
function terraceDeck(ctx, c, t, L) {
  const { x0, x1, y, z0, z1 } = TERR, deck = mixHex(P.shade0, DAYC.face, .45), deckLit = mixHex(P.shade0, P.halo2, .35);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  K.quad(ctx, c, [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]], (q) => lin(ctx, 0, q[2][1], 0, q[0][1], [[0, deckLit], [1, deck]]));
  ctx.restore();
}
function terraceFront(ctx, t, L) {   // the deck's front face + railing (on z0), two tomato pots on the rail's right end
  const { x0, x1, y } = TERR, wood = mixHex(P.shade0, DAYC.faceLo, .55), rail = dm(P.blue1, mixHex(DAYC.rim, P.cream, .25), L);
  ctx.fillStyle = wood; ctx.fillRect(x0, y, x1 - x0, -y);
  ctx.fillStyle = rgba(P.halo2, .35); ctx.fillRect(x0, y, x1 - x0, 5);
  ctx.fillStyle = rgba(P.night1, .35); for (let x = x0 + 60; x < x1; x += 70) ctx.fillRect(x, y + 10, 3, -y - 14);
  ctx.strokeStyle = rail; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x0 + 4, y); ctx.lineTo(x0 + 4, y - 108); ctx.lineTo(x1 - 4, y - 108); ctx.lineTo(x1 - 4, y); ctx.stroke();
  ctx.lineWidth = 3; for (let x = x0 + 46; x < x1 - 20; x += 42) { ctx.beginPath(); ctx.moveTo(x, y - 108); ctx.lineTo(x, y); ctx.stroke(); }
  // the steps down to the yard on the left
  ctx.fillStyle = mixHex(wood, P.halo2, .15); ctx.fillRect(x0 - 70, y * .5, 70, -y * .5); ctx.fillRect(x0 - 35, y, 35, -y * .5);
}
function tomato(ctx, x, h, t, seed) {   // one staked plant: blue leaves, warm round fruits (no red)
  const rnd = prng(seed), sw = 3 * Math.sin(t * .9 + seed);
  ctx.strokeStyle = mixHex(P.shade0, P.halo2, .3); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + 14, 0); ctx.lineTo(x + 14, -h - 10); ctx.stroke();
  for (let i = 0; i < 7; i++) { const yy = -h * (.2 + .8 * i / 6), xx = x + (i % 2 ? 1 : -1) * (12 + 10 * rnd()) + sw * (i / 6); ctx.fillStyle = i % 3 ? DAYC.tree : mixHex(DAYC.treeLit, P.halo2, .2); ctx.beginPath(); ctx.ellipse(xx, yy, 30 - i * 2, 20 - i, (i % 2 ? .5 : -.5), 0, 6.29); ctx.fill(); }
  for (let i = 0; i < 5; i++) { const yy = -h * (.25 + .6 * rnd()), xx = x + (rnd() - .5) * 40 + sw * .5, r = 9 + 3 * rnd(); ctx.fillStyle = i % 2 ? K.WARM.mid : mixHex(K.WARM.mid, K.WARM.deep, .4); ctx.beginPath(); ctx.arc(xx, yy, r, 0, 6.29); ctx.fill(); ctx.fillStyle = rgba(P.core1, .8); ctx.beginPath(); ctx.arc(xx - r * .35, yy - r * .35, r * .3, 0, 6.29); ctx.fill(); }
}
function bed(ctx, t, L) {   // the raised bed: a wooden box, soil, four staked tomato plants
  const { x0, x1, h } = BED, wood = mixHex(P.shade0, DAYC.faceLo, .35);
  [7020, 7140, 7270, 7380].forEach((x, i) => tomato(ctx, x, [210, 250, 230, 190][i], t, 11 + i * 7));
  ctx.fillStyle = mixHex(P.night1, P.shade0, .35); ctx.fillRect(x0 + 8, -h - 6, x1 - x0 - 16, 12);
  ctx.fillStyle = wood; ctx.fillRect(x0, -h, x1 - x0, h);
  ctx.fillStyle = rgba(P.halo2, .45); ctx.fillRect(x0, -h, x1 - x0, 6);
  ctx.fillStyle = rgba(P.night1, .3); ctx.fillRect(x0, -h * .5, x1 - x0, 3);
}
function nbFront(ctx, t, L) {   // the neighbour building's ground floor: the door, a bench, a pot (ZS − 8)
  ctx.fillStyle = mixHex(DAYC.glass, P.night1, .25); ctx.fillRect(NB_DOOR - 60, -250, 120, 250);
  ctx.fillStyle = dm(P.blue1, DAYC.cut, L); ctx.fillRect(NB_DOOR - 90, -272, 180, 16);
  ctx.fillStyle = rgba(P.halo0, .5); ctx.fillRect(NB_DOOR - 50, -140, 8, 30);
}
function benchAt(ctx, x, L) {
  const c = mixHex(P.shade0, DAYC.faceLo, .4);
  ctx.fillStyle = c; ctx.fillRect(x - 110, -48, 220, 12); ctx.fillRect(x - 110, -96, 220, 10); ctx.fillRect(x - 100, -36, 10, 36); ctx.fillRect(x + 90, -36, 10, 36);
  ctx.fillStyle = rgba(P.halo2, .35); ctx.fillRect(x - 110, -48, 220, 3);
}
// the ball between the two kids: a slow kick back and forth (period 3.4 s), a hop
export function ballAt(t) {
  const ph = (t / 3.4) % 1, k = ph < .5 ? ph * 2 : 2 - ph * 2, u = sineIO(k);
  const x = lerp(KIDS[0][0] + 40, KIDS[1][0] - 40, u), z = lerp(KIDS[0][1], KIDS[1][1], u) - 20, y = -Math.abs(Math.sin(Math.PI * k * 2)) * 26 - 11;
  return { x, y, z, kickL: Math.max(0, 1 - Math.abs(ph) * 12, 1 - Math.abs(ph - 1) * 12), kickR: Math.max(0, 1 - Math.abs(ph - .5) * 12) };
}
export function courtyard(ctx, c, t, L, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  backYard(ctx, c, t, L);
  // the paved yard in front of the gap and the neighbour building (sunlit), with the light falling through the gap toward us
  K.quad(ctx, c, [[GAP[0], 0, 2400], [8900, 0, 2400], [8900, 0, ZS], [GAP[0], 0, ZS]], (q) => lin(ctx, 0, q[2][1], 0, q[0][1], [[0, mixHex(DAYC.street, P.halo2, .28)], [1, mixHex(DAYC.street, P.halo1, .12)]]));
  K.quad(ctx, c, [[GAP[0] + 20, 0, ZS], [GAP[1], 0, ZS], [GAP[1] - 380, 0, 2400], [GAP[0] - 420, 0, 2400]], rgba(DAYC.warm || K.WARM.hi, .5 * L.day));
  for (let z = 2500; z < ZS; z += 120) { const a = K.wp(c, GAP[0], 0, z), b = K.wp(c, 8900, 0, z); if (a && b) { ctx.fillStyle = rgba(P.night1, .1); ctx.fillRect(a[0], a[1], b[0] - a[0], Math.max(1, a[2] * 2)); } }   // paving joints
  // the neighbour's building foot (door, bench)
  K.atZ(ctx, c, ZS - 8, () => { nbFront(ctx, t, L); });
  K.atZ(ctx, c, BENCH[1], () => benchAt(ctx, BENCH[0], L));
  terraceDeck(ctx, c, t, L);
  // long shadows of everything standing in the yard
  shadowOn(ctx, c, (BED.x0 + BED.x1) / 2, BED.z + 20, (BED.x1 - BED.x0) / 2, 150, .3);
  for (const [Z, fn, sh] of o.people || []) if (sh) shadowOn(ctx, c, sh[0], Z, sh[1], sh[2] ?? 260, .32, sh[3] ?? 0);
  // depth-sorted things: people, robot, the terrace front (z0), the bed (BED.z)
  const items = [...(o.people || []).map(([Z, fn]) => [Z, fn]), [TERR.z0, (cx) => terraceFront(cx, t, L)], [BED.z, (cx) => bed(cx, t, L)]];
  if (o.robot) { const r = o.robot; shadowOn(ctx, c, r.x, r.z, 36, 120, .32); items.push([r.z, (cx) => S.deliveryRobot(cx, r.x, 0, 1, t, { dir: r.dir, roll: r.roll, lid: r.lid, day: L.day })]); }
  { const b = ballAt(t); items.push([b.z, (cx) => { cx.fillStyle = rgba(P.night1, .3); cx.beginPath(); cx.ellipse(b.x, 0, 14, 3, 0, 0, 6.29); cx.fill(); cx.fillStyle = P.cream; cx.beginPath(); cx.arc(b.x, b.y, 11, 0, 6.29); cx.fill(); cx.fillStyle = rgba(K.WARM.mid, .9); cx.beginPath(); cx.arc(b.x, b.y, 11, -.4, 1.2); cx.lineTo(b.x, b.y); cx.fill(); }]); }
  for (const [Z, fn] of items.sort((p, q) => q[0] - p[0])) K.atZ(ctx, c, Z, () => fn(ctx));
  ctx.restore();
}

// ---------------------------------------------------------------- speech in two languages
// style 0: the neighbour's script (loops and dots, written right → left) · style 1: Dad's (short blocky dashes, left → right).
// o: { u 0..1 grow, mix 0..1 (0 → style a, 1 → style b: the switch at the earbud), a (style at mix 0), b, warm, cool, tail ±1, k (glyph
// write-on 0..1) }
export function glyphBubble(ctx, x, y, r, t, o = {}) {
  const u = expoOut(clamp(o.u ?? 1)); if (u <= 0) return;
  const rr = r * u, cool = o.cool ?? 0, warm = o.warm ?? 0, tl = o.tail ?? 1;
  const fill = mixHex(mixHex(P.cream, K.COOL.core, cool * .6), P.core1, warm * .6), edge = mixHex(mixHex(P.blue1, K.COOL.mid, cool), K.WARM.mid, warm);
  ctx.save();
  ctx.fillStyle = rgba(P.night1, .18); ctx.beginPath(); ctx.ellipse(x + rr * .08, y + rr * .1, rr * 1.35, rr * .95, 0, 0, 6.29); ctx.fill();
  ctx.fillStyle = fill; ctx.beginPath(); ctx.ellipse(x, y, rr * 1.35, rr * .95, 0, 0, 6.29); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x + tl * rr * .25, y + rr * .8); ctx.lineTo(x + tl * rr * .75, y + rr * 1.45); ctx.lineTo(x + tl * rr * .62, y + rr * .7); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = edge; ctx.lineWidth = Math.max(1.2, rr * .06); ctx.beginPath(); ctx.ellipse(x, y, rr * 1.35, rr * .95, 0, 0, 6.29); ctx.stroke();
  // the switch (mix): the first script un-writes, then the second writes on (no blend)
  const m = clamp(o.mix ?? 0), sa = o.a ?? 0, sb = o.b ?? 1, k0 = clamp(o.k ?? 1) * clamp(u * 1.3);
  const ink = mixHex(P.ind1, edge, .25);
  for (const [st, k] of m < .5 ? [[sa, k0 * (1 - 2 * m)]] : [[sb, k0 * (2 * m - 1)]]) {
    if (k <= .01) continue;
    ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineCap = 'round'; ctx.lineWidth = Math.max(1, rr * .085);
    for (let j = 0; j < 2; j++) {
      const yy = y + (j - .5) * rr * .62, w = rr * (j ? 1.5 : 1.9), xl = x - w / 2, n = st === 0 ? 5 : 4;
      if (st === 0) {   // looped script, right → left, a dot above some loops
        const xe = xl + w * (1 - k); ctx.beginPath(); ctx.moveTo(xl + w, yy);
        for (let i = 0; i <= 28; i++) { const v = i / 28, px = xl + w - v * w; if (px < xe) break; ctx.lineTo(px, yy - Math.abs(Math.sin(v * n * Math.PI + j + t * .3)) * rr * .2); }
        ctx.stroke();
        for (let i = 0; i < n; i++) { const px = xl + w * (1 - (i + .5) / n); if (px < xe || (i + j) % 2) continue; ctx.beginPath(); ctx.arc(px, yy - rr * .34, rr * .05, 0, 6.29); ctx.fill(); }
      } else {          // blocky dashes, left → right
        let px = xl; const xe = xl + w * k;
        for (let i = 0; i < 6 && px < xe; i++) { const dw = rr * (.18 + .14 * ((i * 7 + j * 3) % 4) / 3); ctx.beginPath(); ctx.moveTo(px, yy); ctx.lineTo(Math.min(px + dw, xe), yy); ctx.stroke(); px += dw + rr * .14; }
      }
    }
  }
  ctx.restore();
}
