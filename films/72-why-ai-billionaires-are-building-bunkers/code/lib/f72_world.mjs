// Film 72 · THE VALLEY — the Leitbild (thumbnail A2) + the seam plates + the Earth at night + the end screen (owned by the lead; builders
// import as S, never edit — wishes go in the report).
//
// The Leitbild: a night valley. A huge calm crowd fills it to the horizon, each person holding a small gold lantern. On the slope at the right
// a round steel hatch lies half open in the ground: gold light and a ladder inside (the hero light). You, in the yellow coat, stand beside it
// and look at the crowd. It appears ONLY at the three anchors (docs/MOTION.md §3): 1 the hook (H.01, H.08) · 2 the turn "They're hiding from
// us" (5.10–5.13) · 3 the end (E.01–E.02, E.09), where the lanterns become the lights of the Earth at night (E.10 → end screen).
// Everything else is THE GROUND LINE stage (lib/f72_stage.mjs). Both share the sheet coordinates and the night sky; the slope FLATTENS into the
// ground line (valleyWorld st.flat 0 → 1) and lifts back out of it, so world and stage hand over without a cut (H.02 / H.08 are the model).
//
//   valleyWorld(ctx, t, v, st)   v = view in sheet units (HOME = thumbnail framing); st (all optional, 0..1 unless said):
//     flat    the slope flattens into the ground line, the hills and the crowd sink away, a row of lantern people stays on the line far left
//     open    the hatch lid (default .8 = the thumbnail) · glow (the light from the shaft, default 1) · crowd (default 1) · row (the lantern row)
//     you     false | { x, y, h, pose, dir, walk, a } (default: beside the hatch, looking at the crowd) · cut (passed to X.ground at flat 1)
//     hatch   { x, y, w, tilt } overrides (sheet units) · earth (the earth below the line at flat, default 1)
//     lock    0..1: the far layers stop their parallax (a tilt into the sky takes them along, so the world can be left cleanly)
//     under(ctx, s) drawn after the earth / cut, before the line + hatch (sections, bunkers) · over(ctx, s) drawn last (stage objects)
//   lerp helpers: hatchAt(flat) · youAt(flat) · edgeY(x, flat) (the slope edge / the ground line)
//   SEAM_HALF, creep(t, T, phrase), breathe(t)   the seam rule (film 69/73): both chunks draw the same plate ±SEAM_HALF round the boundary
//   plateList · plateBunker · plateBoard · earthNight · endScreen · END_TILES
import { createCanvas } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f72_kit.mjs';
import * as X from './f72_stage.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, halo, rad, lin, prng } = E;
const { GOLD, COOL, CREAM, LAMP, SOIL, CONCRETE } = F;
const TAU = Math.PI * 2;
const LY = X.LINE_Y;

export const HOME = { x: 960, y: 540, s: 1 };
export const HATCH_L = { x: 1590, y: 812, w: 540, tilt: .24 }, HATCH_S = { x: 1590, y: LY, w: 230, tilt: .075 };
export const YOU_L = { x: 1245, y: 878, h: 196 }, YOU_S = { x: 1150, y: LY, h: 104 };
export const ROW_S = { x0: -330, x1: 430, n: 8, h: 94 };   // the lantern row on the stage (far left)
const ease = (f) => sineIO(clamp(f));
export const hatchAt = (f) => { const k = ease(f); return { x: lerp(HATCH_L.x, HATCH_S.x, k), y: lerp(HATCH_L.y, HATCH_S.y, k), w: lerp(HATCH_L.w, HATCH_S.w, k), tilt: lerp(HATCH_L.tilt, HATCH_S.tilt, k) }; };
export const youAt = (f) => { const k = ease(f); return { x: lerp(YOU_L.x, YOU_S.x, k), y: lerp(YOU_L.y, YOU_S.y, k), h: lerp(YOU_L.h, YOU_S.h, k) }; };
// the slope's edge (Leitbild) → the ground line (stage)
const EDGE = [[-2400, 2300], [-900, 1800], [-200, 1450], [300, 1190], [495, 1080], [900, 922], [1250, 776], [1500, 692], [1750, 644], [1950, 616], [2300, 600], [3400, 590], [4600, 588]];
export function edgeY(x, f = 0) {
  let i = 0; while (i < EDGE.length - 2 && x > EDGE[i + 1][0]) i++;
  const [x0, y0] = EDGE[i], [x1, y1] = EDGE[i + 1], y = lerp(y0, y1, clamp((x - x0) / (x1 - x0)));
  return lerp(y, LY, ease(f * (1.15 - .15 * clamp((x + 400) / 2400))));   // the left (low) side arrives a little later
}
const edgeX0 = (y) => { for (let i = 0; i < EDGE.length - 1; i++) { const [x0, y0] = EDGE[i], [x1, y1] = EDGE[i + 1]; if (y <= y0 && y >= y1) return lerp(x0, x1, (y0 - y) / (y0 - y1)); } return y > EDGE[0][1] ? EDGE[0][0] : 4600; };

// ------------------------------------------------------------------------------------------------ the crowd (baked once, lanterns live)
// Rows recede to the horizon (distance D: y = 626 + 560 / D, height 232 / D). Bodies and the far lanterns are baked into two canvases ONCE
// (far band, near band: own parallax depth); the near lanterns flicker live (glowDot sprites).
const HOR = 626, CR = { x0: -2000, x1: 2600, sc: 1.25 };
let CROWD = null;
function buildCrowd() {
  const r = prng(7240), rows = [];
  for (let k = 0; k < 30; k++) { const D = Math.pow(1.13, k) * .95; rows.push(D); }
  const bands = { near: { y0: 700, y1: 1700, live: [] }, far: { y0: 600, y1: 780, live: [] } };
  for (const b of Object.values(bands)) { b.c = createCanvas(Math.round((CR.x1 - CR.x0) * CR.sc), Math.round((b.y1 - b.y0) * CR.sc)); b.g = b.c.getContext('2d'); b.g.scale(CR.sc, CR.sc); b.g.translate(-CR.x0, -b.y0); }
  for (let k = rows.length - 1; k >= 0; k--) {   // far rows first
    const D = rows[k], y = HOR + 560 / D, h = 232 / D, sp = 66 / D, b = D >= 4.6 ? bands.far : bands.near, g = b.g;
    const xe = edgeX0(y) - h * .25, fog = clamp((D - 1) / 22);
    const body = mixHex(mixHex(P.night0, P.ind2, .7), mixHex(P.ind1, P.blue1, .35), fog * .8);
    for (let x = CR.x0 + r() * sp; x < xe; x += sp * (.75 + r() * .5)) {
      const yy = y + (r() - .5) * h * .12, hh = h * (.86 + r() * .26), lamp = r() < .78, ph = r() * 6.3, dir = r() < .5 ? -1 : 1;
      if (D < 9) {   // a calm silhouette: round shoulders, a head; the lantern side catches warm light, the top a faint cool rim
        const sil = () => { g.beginPath(); g.moveTo(x - hh * .15, yy); g.bezierCurveTo(x - hh * .16, yy - hh * .3, x - hh * .17, yy - hh * .62, x - hh * .13, yy - hh * .74); g.quadraticCurveTo(x - hh * .1, yy - hh * .8, x - hh * .04, yy - hh * .815); g.lineTo(x + hh * .04, yy - hh * .815); g.quadraticCurveTo(x + hh * .1, yy - hh * .8, x + hh * .13, yy - hh * .74);
          g.bezierCurveTo(x + hh * .17, yy - hh * .62, x + hh * .16, yy - hh * .3, x + hh * .15, yy); g.closePath(); g.moveTo(x + hh * .072, yy - hh * .915); g.ellipse(x, yy - hh * .915, hh * .072, hh * .082, 0, 0, TAU); };
        g.save(); g.translate(0, -hh * .012); g.fillStyle = rgba(mixHex(P.blue1, CREAM, .2), .4 * (1 - fog)); sil(); g.fill(); g.restore();
        g.fillStyle = lamp ? lin(g, x - dir * hh * .17, 0, x + dir * hh * .17, 0, [[0, body], [.6, body], [1, mixHex(body, GOLD.shade, .45 * (1 - fog))]]) : body; sil(); g.fill(); }
      if (lamp) { const lx = x + dir * hh * .105, ly = yy - hh * .465;
        if (D >= 2.2) F.glowDot(g, lx, ly, Math.max(2.5, hh * .3), clamp(.55 + .45 * (1 - fog)), 'gold');
        g.fillStyle = mixHex(GOLD.body, GOLD.core, .5); g.beginPath(); g.arc(lx, ly, Math.max(.7, hh * .03), 0, TAU); g.fill();
        if (D < 4.6) b.live.push([lx, ly, hh, ph]); }
    }
  }
  // the haze of countless lights at the horizon
  const g = bands.far.g; g.fillStyle = lin(g, 0, HOR - 8, 0, HOR + 30, [[0, rgba(GOLD.halo, 0)], [.5, rgba(GOLD.halo, .16)], [1, rgba(GOLD.halo, 0)]]); g.fillRect(CR.x0, HOR - 8, CR.x1 - CR.x0, 38);
  CROWD = bands;
}
function drawCrowd(ctx, t, v, a, sink, lock = 0) {
  if (!CROWD) buildCrowd();
  for (const [key, d0] of [['far', .82], ['near', 1]]) {
    const d = lerp(d0, 1, lock), b = CROWD[key], lv = X.layerView(v, d);
    X.inView(ctx, lv, (s) => {
      ctx.save(); ctx.globalAlpha *= a; ctx.translate(0, sink * d);
      ctx.drawImage(b.c, CR.x0, b.y0, CR.x1 - CR.x0, b.y1 - b.y0);
      if (key === 'near') { const [vx0, vy0] = X.toSheet(lv, -60, -60), [vx1, vy1] = X.toSheet(lv, W + 60, H + 60);
        for (const [lx, ly, hh, ph] of b.live) { if (lx < vx0 || lx > vx1 || ly - sink > vy1 || ly < vy0 - sink) continue;
          F.glowDot(ctx, lx, ly, hh * .34, .35 + .25 * Math.sin(t * 6.1 + ph * 3) * Math.sin(t * 2.3 + ph), 'gold'); } }
      ctx.restore();
    });
  }
}

// ------------------------------------------------------------------------------------------------ the valley world
export function valleyWorld(ctx, t, v, st = {}) {
  const f = clamp(st.flat ?? 0), k = ease(f), gone = sineIO(span(f, 0, .75));
  X.ground(ctx, t, v, { lx: lerp(1450, st.lx ?? 1500, k), ly: lerp(700, st.ly ?? 480, k), pool: lerp(.8, st.pool ?? .8, k), earth: 0, line: 0 });
  // far hills (two ridges) and the valley floor haze — sink and fade as the world flattens
  if (gone < 1) {
    const lock = clamp(st.lock ?? 0);
    for (const [d0, base, amp, col, ph] of [[.34, 560, 46, mixHex(P.night1, P.ind1, .6), 0], [.5, 598, 34, mixHex(P.night1, P.ind2, .5), 2]]) { const d = lerp(d0, 1, lock); X.inView(ctx, X.layerView(v, d), () => {
      ctx.save(); ctx.globalAlpha *= 1 - gone; ctx.translate(0, gone * 260 * d);
      ctx.fillStyle = lin(ctx, 0, base - amp, 0, base + 160, [[0, col], [1, P.night1]]);
      ctx.beginPath(); ctx.moveTo(-3000, 1400); for (let x = -3000; x <= 5000; x += 60) ctx.lineTo(x, base + Math.sin(x * .0019 + ph) * amp + Math.sin(x * .0053 + ph * 2) * amp * .3); ctx.lineTo(5000, 1400); ctx.fill();
      ctx.restore(); }); }
    drawCrowd(ctx, t, v, (1 - gone) * (st.crowd ?? 1), gone * 520, lock);
  }
  // the slope → the earth below the line (the same earth() as the stage, clipped to the morphing edge, so f = 1 is exactly X.ground)
  const ea = st.earth ?? 1;
  X.inView(ctx, v, (s) => {
    const [vx0] = X.toSheet(v, -80, 0), [vx1] = X.toSheet(v, W + 80, 0), [, vyb] = X.toSheet(v, 0, H + 80), n = 64, pts = [];
    for (let i = 0; i <= n; i++) { const x = lerp(vx0, vx1, i / n); pts.push([x, edgeY(x, f)]); }
    ctx.save(); ctx.beginPath(); ctx.moveTo(vx0, Math.max(vyb, 2400)); pts.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(vx1, Math.max(vyb, 2400)); ctx.closePath(); ctx.clip();
    if (k < 1) {   // the Leitbild slope: dark slate, gravel, the warm pool of the hatch's light
      ctx.save(); ctx.globalAlpha *= 1 - k;
      ctx.fillStyle = lin(ctx, 0, 600, 0, 1300, [[0, mixHex(P.night1, P.ind2, .45)], [.4, mixHex(P.night1, P.blue2, .2)], [1, P.night0]]); ctx.fillRect(vx0, 500, vx1 - vx0, 2000);
      E.dust(ctx, 7241, 160, 1300, 930, 700, 160, 0, .22, mixHex(P.blue2, CREAM, .25));
      ctx.restore();
    }
    ctx.save(); ctx.globalAlpha *= k * ea; X.earth(ctx, t, vx0, vx1, LY, Math.max(vyb, LY + 10), s); ctx.restore();
    ctx.restore();
    if (k >= 1 && st.cut) X.section(ctx, t, st.cut.x0, st.cut.x1, LY, st.cut.depth ?? 420, st.cut.u ?? 1, { s, ...st.cut });
    if (st.under) st.under(ctx, s);
    // the edge becomes the cream ground line
    if (k > 0) X.drawPath(ctx, pts, 1, { col: rgba(CREAM, .78 * k), w: 2.4 / s, glow: 6 / s, glowCol: GOLD.line });
    // warm light of the hatch on the ground
    const hp = { ...hatchAt(f), ...(st.hatch || {}) }, glow = st.glow ?? 1, open = st.open ?? .8;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, hp.x - hp.w * .3, hp.y + 20, hp.w * 1.6, [[0, rgba(GOLD.halo, .24 * glow * open * (1 - .5 * k))], [1, rgba(GOLD.halo, 0)]]);
    ctx.beginPath(); ctx.arc(hp.x - hp.w * .3, hp.y + 20, hp.w * 1.6, 0, TAU); ctx.fill(); ctx.restore();
    // the lantern row on the line (stage), rising as the crowd goes
    const row = st.row ?? span(f, .45, 1);
    if (row > 0) F.lanternRow(ctx, t, ROW_S.x0, ROW_S.x1, edgeY((ROW_S.x0 + ROW_S.x1) / 2, f), ROW_S.n, { h: ROW_S.h, u: row, seed: 7242 });
    // the hatch, you
    F.hatch(ctx, t, hp.x, hp.y, hp.w, { tilt: hp.tilt, open, glow, s });
    if (st.you !== false) { const y0 = youAt(f), y = { pose: 'look', dir: -1, ...y0, ...(st.you || {}) };
      if ((y.a ?? 1) > 0) { ctx.save(); ctx.globalAlpha *= y.a ?? 1; halo(ctx, y.x + 30, y.y - y.h * .55, y.h * 1.2, .16 * glow * open, GOLD.halo, GOLD.core);
        F.du(ctx, y.x, y.y, y.h, { pose: y.walk != null ? undefined : y.pose, dir: y.dir, walk: y.walk, light: -1 }); ctx.restore(); } }
    if (st.over) st.over(ctx, s);
  });
}

// ======================================================================================================================== SEAMS
// A group boundary sits on a phrase. Both chunks draw the plate function for ±SEAM_HALF around it; the view creeps in by CREEP per second
// from (phrase − SEAM_HALF): the left builder ends on it, the right builder starts on it, and the frames match.
export const SEAM_HALF = .5;
export const CREEP = .04;
export const creep = (t, T, phrase, nth = 0) => 1 + CREEP * Math.max(0, t - (T.G(phrase, nth) - SEAM_HALF));
export const breathe = (t) => ({ dx: E.drift(t, 4, 3), dy: E.drift(t, 2.5, 7) });

// Lead → B1 at 'There are three obvious suspects' (c01 → c02): plateList. THE LIST centred in the sky over a low ground line: title, row 2
// THE MACHINE with a ?, row 4 the redaction bar, rows 1 and 3 empty (their numbers faint).
export const PLIST = { x: 960, y: 350, s: .8, view: { x: 960, y: 470, s: 1 } };
export const LIST_PLATE_ROWS = [{ num: .3, write: 0 }, { num: 1, q: 1 }, { num: .3, write: 0 }, { num: 1, redact: 1 }];
export const PLIST_POOL = { lx: PLIST.x, ly: PLIST.y, pool: .9 };
export const viewList = (t, k = 1) => { const b = breathe(t), V = PLIST.view; return { x: V.x + b.dx, y: V.y + b.dy, s: V.s * k }; };
export function drawList(ctx, t, v, o = {}) {
  X.ground(ctx, t, v, PLIST_POOL);
  X.inView(ctx, v, () => F.list(ctx, t, PLIST.x, PLIST.y, { s: PLIST.s, rows: o.rows ?? LIST_PLATE_ROWS, ...o }));
}
export function plateList(ctx, t, T) { drawList(ctx, t, viewList(t, creep(t, T, 'There are three obvious suspects'))); }

// B1 → B2 at 'Ask the people who sell them' (c05 → c06): plateBunker. A schematic bunker in section under the ground line: the hatch shut,
// the shaft, the ladder, one long room with EMPTY shelves, a thin time axis under it (not yet labelled).
export const PBUNK = { x: 700, room: { x0: 640, x1: 1500, h: 170 }, depth: 150, axis: { x: 640, y: 1010, w: 860 }, cut: { x0: 540, x1: 1620, depth: 470 }, view: { x: 1040, y: 690, s: .96 } };
export const viewBunker = (t, k = 1) => { const b = breathe(t), V = PBUNK.view; return { x: V.x + b.dx, y: V.y + b.dy, s: V.s * k }; };
export function drawBunker(ctx, t, v, o = {}) {
  const Q = PBUNK;
  X.ground(ctx, t, v, { lx: 1040, ly: 700, pool: .8, cut: { ...Q.cut, u: 1 } });
  X.inView(ctx, v, (s) => {
    F.hatch(ctx, t, Q.x, LY, 150, { tilt: .075, open: 0, glow: .3, s });
    F.bunker(ctx, t, Q.x, LY, { s, depth: Q.depth, room: Q.room, shelves: o.shelves ?? 0, light: o.light ?? .55, door: o.door, people: o.people });
    F.supplyClock(ctx, t, Q.axis.x, Q.axis.y, Q.axis.w, { s, u: 1, scale: o.scale ?? [], full: o.full ?? 0, head: o.head, marks: o.marks });
    if (o.top) o.top(ctx, s);
  });
}
export function plateBunker(ctx, t, T) { drawBunker(ctx, t, viewBunker(t, creep(t, T, 'Ask the people who sell them'))); }

// B2 → B3 at 'But follow the trail' (c08 → c09): plateBoard. The evidence board over the line: three cards pinned left → right, GUARDS · LOCKS ·
// MUTINY PLANS, a fourth pin empty at the right; no thread yet.
export const PBOARD = { cards: [[420, 400, -.03], [820, 430, .02], [1220, 396, -.015]], pin4: [1580, 340], view: { x: 960, y: 500, s: 1 } };
export const viewBoard = (t, k = 1) => { const b = breathe(t), V = PBOARD.view; return { x: V.x + b.dx, y: V.y + b.dy, s: V.s * k }; };
export function drawBoard(ctx, t, v, o = {}) {
  X.ground(ctx, t, v, { lx: 960, ly: 420, pool: .85 });
  X.inView(ctx, v, () => {
    const pins = PBOARD.cards.map(([x, y, r], i) => F.evidenceCard(ctx, t, x, y, F.SOURCES.trail[i], { rot: r, lit: o.lit?.[i] ?? 0 }).pin);
    const [px, py] = PBOARD.pin4; ctx.fillStyle = mixHex(CREAM, CONCRETE.lit, .3); ctx.beginPath(); ctx.arc(px, py, 9, 0, TAU); ctx.fill();
    if (o.top) o.top(ctx, pins);
  });
}
export function plateBoard(ctx, t, T) { drawBoard(ctx, t, viewBoard(t, creep(t, T, 'But follow the trail'))); }

// ======================================================================================================================== THE EARTH AT NIGHT (the end)
// earthNight(ctx, t, o): the planet in screen space: o.cx, o.cy, o.r (a full disc, or a big curve with r ≫ H), o.rot (radians of turn),
// o.lights 0..1 (the cities: gold dots clustered like lanterns), o.dawn 0..1 (a thin first light at the right rim), o.a
let LIGHTS = null;
function buildLights() {
  const r = prng(7260), cl = [];
  for (let i = 0; i < 34; i++) cl.push([r() * TAU, (r() - .35) * 1.6 * .8, .05 + r() * .22, 20 + Math.floor(r() * 70)]);
  LIGHTS = [];
  for (const [lon, lat, sp, n] of cl) for (let j = 0; j < n; j++) { const g = () => (r() + r() + r() - 1.5) * sp; LIGHTS.push([lon + g() * 1.6, clamp(lat + g(), -1.3, 1.3), .4 + r() * .6, r() * 6.3]); }
}
export function earthNight(ctx, t, o = {}) {
  if (!LIGHTS) buildLights();
  const cx = o.cx ?? 960, cy = o.cy ?? 420, R = o.r ?? 280, rot = o.rot ?? t * .01, li = clamp(o.lights ?? 1), dawn = clamp(o.dawn ?? 0);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  halo(ctx, cx, cy, R * 1.35, .18, COOL.halo, COOL.core);
  ctx.fillStyle = rad(ctx, cx - R * .3, cy - R * .3, R * 1.3, [[0, mixHex(P.ind1, P.blue0, .4)], [.7, P.ind0], [1, P.night0]]); ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.clip();
  const big = [];
  ctx.fillStyle = mixHex(GOLD.body, GOLD.core, .4); ctx.beginPath();
  for (const [lon, lat, b, ph] of LIGHTS) {
    const x3 = Math.cos(lat) * Math.sin(lon + rot), z3 = Math.cos(lat) * Math.cos(lon + rot), y3 = Math.sin(lat); if (z3 <= 0) continue;
    const px = cx + x3 * R, py = cy - y3 * R, rr = Math.max(.6, R * .006 * b * (.5 + .5 * z3)); ctx.moveTo(px + rr, py); ctx.arc(px, py, rr, 0, TAU);
    if (b > .75 && z3 > .25) big.push([px, py, rr, b, ph, z3]);
  }
  ctx.globalAlpha *= li; ctx.fill();
  for (const [px, py, rr, b, ph, z3] of big) F.glowDot(ctx, px, py, rr * 7, li * .5 * b * z3 * (.85 + .15 * Math.sin(t * 2 + ph)), 'gold');
  ctx.restore();
  // the atmosphere rim: cool, warming at the right (first light)
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = rgba(COOL.halo, .35); ctx.lineWidth = R * .02; ctx.beginPath(); ctx.arc(cx, cy, R * 1.004, 0, TAU); ctx.stroke();
  if (dawn > 0) { ctx.strokeStyle = rgba(GOLD.line, .55 * dawn); ctx.lineWidth = R * .03; ctx.beginPath(); ctx.arc(cx, cy, R * 1.006, -1.2, .9); ctx.stroke();
    halo(ctx, cx + R * .95, cy - R * .1, R * .7, .3 * dawn, GOLD.halo, GOLD.core); }
  ctx.restore();
  ctx.restore();
}
// ======================================================================================================================== END SCREEN (last 15 s)
// The Earth at night, high and calm, the first light at its right rim; the lower half stays quiet for the two YouTube tiles + the subscribe
// circle. A slow turn, only light moves. (The deliberate exception to "no globes" of film 69: the binding concept of film 72 ends here.)
export const END_TILES = { left: { x: 80, y: 600, w: 640, h: 360 }, right: { x: 1200, y: 600, w: 640, h: 360 }, sub: { x: 960, y: 900, r: 80 } };
export const END_EARTH = { cx: 960, cy: 300, r: 230 };
export function endScreen(ctx, t, T) {
  const t0 = T.duration - 15, q = Math.max(0, t - t0), b = breathe(t), v = { x: 960 + b.dx, y: 540 + b.dy, s: 1 };
  X.ground(ctx, t, v, { lx: 960, ly: 300, pool: .7, earth: 0, line: 0 });
  earthNight(ctx, t, { ...END_EARTH, r: END_EARTH.r * (1 + .002 * q), rot: 1.1 + t * .012, lights: 1, dawn: .55 + .2 * span(q, 0, 15) });
}
