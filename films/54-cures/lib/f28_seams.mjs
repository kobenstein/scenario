// Film 28 · the shared worlds + the seam plates between the builder groups (owned by the lead; builders import, never edit).
// A plate is the EXACT picture at a group boundary. The handing side steers its last move so its frame converges to the plate and draws
// the plate for t in [T0 − .5, T0); the receiving side draws the same plate for t in [T0, T0 + .5) and grows its world out of it (the
// plate becomes a thing of the new world, never a blend). Both call it with the same (t, T): the seam is invisible by construction.
// Plates keep a slow push (CREEP 4 %/s from T0 − .5) and a slow truck right (TRUCK 30 px/s); the receiving side continues both.
// Check: SECS=c01,c02 node tools/seam.mjs --at <T0>   ·   stills: node tools/kit_sheet28.mjs <dir>
//
//   Lead → B1 at T.G('A global data company') (c01 → c02): plateStation   THE RADIO STATION AT NIGHT. The far tip of the coast,
//            the tiny wooden station with its warm window and antenna, the voices of the people circling the antenna as a warm ring,
//            the dark glass towers of the giants on the far horizon right. Rail: lamp 12 lit, the microphone under it. Camera ST_CAM.
//            Lead (12.06): settles here. B1 (12.07): a cool envelope glides in from the towers toward the door.
//   B1 → B2  at T.G('Casey Harrell knows') (c06 → c07): plateTree   THE TREE AT THE TURN. Crown half dark (glow .28), lanterns 12 … 9 lit,
//            8 half, the rest dark; lantern 7 (the kitchen of the hook) glows faintly with its window; you at the foot looking up.
//            Camera TREE_CAM_TURN (lantern 7 left of centre). B1 (8.11): comes out of the flood onto it. B2 (7.01): flies into lantern 7.
//   B2 → B3  at T.G('The snake') (c10 → c11): plateGrass   NIGHT GRASS BY THE TRACK. Tall grass in indigo layers, the rail embankment
//            behind, one dark shadow moving through the blades. Rail: lamps 12 … 4. Camera GRASS_CAM. B2 (4.09) sinks into it; B3 (3.01)
//            the shadow becomes the snake.
import * as E from './f10_editorial.mjs';
import * as F from './f28_kit.mjs';
const { P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, halo, lin, rad, prng } = E;
const TAU = Math.PI * 2;

export const SEAM_HALF = .5;
export const seamWindow = (t, T0) => t >= T0 - SEAM_HALF && t < T0 + SEAM_HALF;
export const CREEP = .04;
export const creep = (t, T, phrase, nth = 0) => 1 + CREEP * Math.max(0, t - (T.G(phrase, nth) - SEAM_HALF));
export const TRUCK = 30;
const tr = (k) => TRUCK * (k - 1) / CREEP;

// ================================================================================================================= THE TREE WORLD
// Tree-world design px; cam3() = the thumbnail view (trunk right of centre, crown upper right, you at its foot, the lake bottom left).
// st (all optional): glow (crown, default .55) · lantern(n) → lantern options (default: dark lanterns with numbers off) · du { look, pose,
//   a } or false · lights(k) → 0..1 small warm lights in the far land (k = 0 … 59) · fg (foreground leaves, default true) · rain 0..1
export const SKY_GLOW = [700, 420, 1100];
export const TREE_HOR = 760;
const FARLIGHTS = (() => { const r = prng(4711), a = []; for (let k = 0; k < 60; k++) { const x = -300 + r() * 1500, band = r(); a.push([x, 690 + band * 140 + 20 * Math.sin(x * .01), .8 + r() * 1.4, k % 3]); } return a; })();
export function treeWorld(ctx, c, t, st = {}) {
  F.sky(ctx, c, t, { glow: SKY_GLOW, hor: TREE_HOR });
  // far hills and the land of small lights
  E.card(ctx, c, 9000, () => {
    F.hills(ctx, [[-2600, 720], [-1400, 650], [-500, 690], [200, 640], [800, 700], [1500, 660], [2400, 700], [3600, 690]], { top: mixHex(P.ind0, P.blue0, .3), bottom: P.night1, rimA: .35 });
  });
  E.card(ctx, c, 4200, () => {
    F.hills(ctx, [[-2400, 800], [-1200, 740], [-300, 770], [400, 735], [1100, 780], [1900, 760], [3200, 800]], { top: mixHex(P.night1, P.ind1, .7), bottom: P.night0, rimA: .3 });
    for (const [x, y, s, g] of FARLIGHTS) { const a = clamp(st.lights ? st.lights(g, x) : .35); if (a <= .01) continue; halo(ctx, x, y, s * 9 * (.6 + .4 * a), .5 * a, P.halo0, P.core1); ctx.fillStyle = rgba(P.core1, .9 * a); ctx.fillRect(x - s / 2, y - s / 2, s, s); }
  });
  // the lake below the hill, catching the crown's light
  E.card(ctx, c, 2600, () => {
    F.water(ctx, -1800, 1300, 860, 700, t, { rx: 520, rw: 220, a: .55 * clamp((st.glow ?? .55) + .2), top: mixHex(P.ind0, P.blue0, .4) });
    F.hills(ctx, [[-1800, 880], [-900, 845], [-200, 870], [300, 862], [700, 885], [1300, 905], [2400, 900]], { top: P.night1, bottom: P.night0, rimA: .25, depth: 200 });
  });
  // the hill of the tree, the tree, you
  E.card(ctx, c, E.F0, () => {
    F.hills(ctx, [[-900, 1010], [200, 975], [800, 948], [1250, 918], [1650, 918], [2200, 945], [3200, 990]], { top: mixHex(P.night1, P.ind1, .5), bottom: P.night0, rim: mixHex(P.blue0, P.halo1, .3 * (st.glow ?? .55)), rimA: .55, depth: 260 });
    F.pool(ctx, 1460, 925, 420, 50, .55 * (st.glow ?? .55));
    F.tree(ctx, t, { glow: st.glow ?? .55, lantern: st.lantern ?? ((n) => ({ lit: 0 })), front: st.front });
    if (st.du !== false) { const d = st.du || {}; E.du(ctx, F.TREE.du.x + (d.dx ?? 0), F.TREE.du.y, F.TREE.du.h, { look: d.look ?? .55, pose: d.pose, light: 1, back: .35, a: d.a, ...d.o }); }
    if (st.extra) st.extra(ctx);
  });
  // foreground leaves (dark, big, slow sway)
  if (st.fg !== false) E.card(ctx, c, 1150, () => { leafFan(ctx, t, -60, 1130, 1, 0); leafFan(ctx, t, 1980, 1150, -1, 2); });
}
function leafFan(ctx, t, x, y, d, seed) {
  const r = prng(91 + seed);
  ctx.save(); ctx.translate(x, y); ctx.scale(d, 1);
  for (let k = 0; k < 7; k++) {
    const ang = -1.45 + k * .22 + .03 * Math.sin(t * .5 + k), L = 320 + r() * 220, w = 70 + r() * 40;
    ctx.save(); ctx.rotate(ang); ctx.fillStyle = mixHex(P.night0, P.ind0, .25 + .15 * (k % 2));
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(L * .5, -w, L, 0); ctx.quadraticCurveTo(L * .5, w * .7, 0, 0); ctx.fill();
    ctx.strokeStyle = rgba(P.blue0, .25); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(L * .92, 0); ctx.stroke(); ctx.restore();
  }
  ctx.restore();
}
// lantern n (12 … 1) of the low limb in tree-world coordinates: its glass centre, for cameras and morphs
export function lanternGlass(n) { const L = F.treeLantern(n); return { x: L.x, y: L.y + L.len + L.s * .2 + L.s / 2, w: L.s * .66, h: L.s }; }

// ================================================================================================================= HOOK VIGNETTES
// The windows in lanterns 4 (the train), 7 (the kitchen) and 9 (the desert). Local space 1000 wide, h tall (portrait ≈ 1515).
// They return to their stations later: B2 (No. 7 kitchen, No. 4 train) and B1 (No. 9 desert) may reuse them at any size.
// train: o { stop (time the train has stopped), heat 0..1, t0 } — the driver's view: rails into a night forest, cow + calf glowing.
export function vignetteTrain(ctx, t, w, h, o = {}) {
  const hz = h * .42, vx = w * .5;
  ctx.fillStyle = lin(ctx, 0, 0, 0, hz, [[0, P.night0], [1, mixHex(P.ind0, P.blue0, .3)]]); ctx.fillRect(0, 0, w, hz + 2);
  ctx.fillStyle = lin(ctx, 0, hz, 0, h, [[0, P.night1], [1, P.night0]]); ctx.fillRect(0, hz, w, h - hz);
  const r = prng(77); for (let k = 0; k < 16; k++) { const side = k % 2 ? 1 : -1, d = .1 + r() * .9, x = vx + side * (90 + d * 520), th = 60 + d * 900; ctx.fillStyle = mixHex(P.night0, P.ind1, .3 + .4 * (1 - d)); ctx.fillRect(x - 8 - d * 26, hz - th * .5, 16 + d * 52, th); }
  // the headlight cone
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, h, 0, hz, [[0, rgba(P.halo1, .28)], [1, rgba(P.halo1, .02)]]);
  ctx.beginPath(); ctx.moveTo(vx - 520, h); ctx.lineTo(vx - 40, hz); ctx.lineTo(vx + 40, hz); ctx.lineTo(vx + 520, h); ctx.fill(); ctx.restore();
  // sleepers scroll toward us and slow to a stop (the train brakes)
  const stop = o.stop ?? 1e9, v = (tt) => (tt < stop - 2.2 ? 1 : tt > stop ? 0 : sineIO((stop - tt) / 2.2));
  const dist = o.t0 != null ? (() => { let s = 0; for (let k = 0; k < 40; k++) { const a = o.t0 + (t - o.t0) * k / 40; s += v(a) * (t - o.t0) / 40; } return s; })() : t;
  for (let k = 0; k < 14; k++) { const z = ((k / 14 + dist * .35) % 1), p = z * z, y = hz + (h - hz) * p, hw = 30 + 520 * p; ctx.fillStyle = rgba(mixHex(P.blue1, P.halo2, .3), .25 + .5 * p); ctx.fillRect(vx - hw, y, hw * 2, 2 + 16 * p); }
  ctx.strokeStyle = rgba(mixHex(P.blue1, P.halo2, .5), .8); ctx.lineWidth = 7; for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(vx + s * 14, hz); ctx.lineTo(vx + s * 380, h); ctx.stroke(); }
  // cow and calf: glowing like lanterns in the heat view, crossing
  const heat = o.heat ?? 1, cross = o.cross ?? 0;
  F.elephant(ctx, t, vx - 150 + 150 * cross, hz + 70, 170, { dir: 1, heat, walk: t * 2.4 });
  F.elephant(ctx, t, vx - 330 + 150 * cross, hz + 74, 100, { dir: 1, heat, walk: t * 2.9 + 1 });
}
// kitchen: o { words 0..1 (gold word-lines rising), lamp 0..1 } — an evening kitchen, a pendant lamp over the table, a man at it.
export function vignetteKitchen(ctx, t, w, h, o = {}) {
  ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, mixHex(P.night1, P.ind1, .5)], [1, P.night0]]); ctx.fillRect(0, 0, w, h);
  // window at the back: dusk blue with one star
  ctx.fillStyle = lin(ctx, 0, h * .14, 0, h * .44, [[0, P.ind0], [1, mixHex(P.blue0, P.halo1, .25)]]); ctx.fillRect(w * .56, h * .14, w * .34, h * .3);
  ctx.strokeStyle = P.night0; ctx.lineWidth = 14; ctx.strokeRect(w * .56, h * .14, w * .34, h * .3); ctx.beginPath(); ctx.moveTo(w * .73, h * .14); ctx.lineTo(w * .73, h * .44); ctx.stroke();
  // the lamp
  const la = o.lamp ?? 1, lx = w * .42, ly = h * .38;
  ctx.strokeStyle = P.night0; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, ly - 40); ctx.stroke();
  halo(ctx, lx, ly, w * .9, .55 * la, P.halo0, P.core1);
  ctx.fillStyle = mixHex(P.night1, P.shade0, .5); ctx.beginPath(); ctx.moveTo(lx - 90, ly); ctx.lineTo(lx + 90, ly); ctx.lineTo(lx + 40, ly - 50); ctx.lineTo(lx - 40, ly - 50); ctx.fill();
  ctx.fillStyle = P.core1; ctx.beginPath(); ctx.ellipse(lx, ly + 2, 70, 12, 0, 0, TAU); ctx.fill();
  // the man at the table (indigo, no face), the table in the lamp's light
  E.person(ctx, w * .36, h * .86, h * .5, { look: .1, light: 1, dir: 1, back: .2 });
  ctx.fillStyle = lin(ctx, 0, h * .7, 0, h * .76, [[0, mixHex(P.shade0, P.halo1, .35 * la)], [1, P.night1]]); ctx.fillRect(w * .05, h * .7, w * .9, h * .05);
  ctx.fillStyle = P.night0; ctx.fillRect(w * .12, h * .75, w * .05, h * .25); ctx.fillRect(w * .82, h * .75, w * .05, h * .25);
  // gold word-lines rising from where his voice was
  const wu = clamp(o.words ?? 0);
  if (wu > 0) for (let k = 0; k < 7; k++) { const u = ((t * .16 + k / 7) % 1), x = w * .44 + 30 * Math.sin(k * 2.1 + t * .5), y = h * .5 - u * h * .42, len = 60 + (k * 37) % 90, a = wu * Math.sin(Math.PI * u);
    ctx.strokeStyle = rgba(P.halo0, .95 * a); ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + len, y); ctx.stroke(); halo(ctx, x + len / 2, y, 70, .3 * a, P.halo0, P.core1); }
}
// desert: o { fig1 0..1, fig2 0..1 (the small figure-drawings light up beside the old footpath), dusk 0..1 }
export function vignetteDesert(ctx, t, w, h, o = {}) {
  const hz = h * .3;
  ctx.fillStyle = lin(ctx, 0, 0, 0, hz, [[0, P.night1], [.7, mixHex(P.ind0, P.blue0, .5)], [1, mixHex(P.blue0, P.halo1, .45)]]); ctx.fillRect(0, 0, w, hz + 2);
  ctx.fillStyle = lin(ctx, 0, hz, 0, h, [[0, mixHex(P.ind1, P.shade0, .25)], [1, P.night1]]); ctx.fillRect(0, hz, w, h - hz);
  E.stars(ctx, 13, 30, t, [0, 0, w, hz * .8], .8);
  // the old footpath: a pale line toward the horizon
  ctx.strokeStyle = rgba(mixHex(P.halo2, P.blue1, .5), .55); ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(w * .1, h); ctx.quadraticCurveTo(w * .4, h * .55, w * .62, hz + 4); ctx.stroke();
  const fig = (u, x, y, s, kind) => { if (u <= 0) return; const pts = kind ? [[-.5, .1], [-.2, -.3], [0, .2], [.2, -.3], [.5, .1], [.2, .35], [-.2, .35], [-.5, .1]] : [[-.4, .3], [-.1, -.4], [.1, -.1], [.45, -.35], [.2, .1], [.45, .4], [-.1, .2], [-.4, .3]];
    E.trail(ctx, E.catmull(pts.map(([a, b]) => [x + a * s, y + b * s, 5]), 6), u, { w: 5 }); if (u >= 1) halo(ctx, x, y, s * 1.4, .25, P.halo0, P.core1); };
  fig(clamp(o.fig1 ?? 0), w * .5, h * .7, 260, 0);
  fig(clamp(o.fig2 ?? 0), w * .62, h * .5, 150, 1);
}

// ================================================================================================================= THE STATION WORLD (No. 12)
// Station-world design px; cam3() = the coast at night, sea horizon at y 600. Everything of the coast lives on the card Z_ST, so explainers
// placed there (the hour ruler, the voices) stay glued to it.  st: { window 0..1 (the warm window), voices(ctx) (drawn on Z_ST),
//   ring 0..1 (the warm ring of voices round the antenna), towers 0..1 (cool windows in the giants), bead: [x, y, r, o] }
export const Z_ST = 2600, ST_HOR = 600;
export const STATION = { x: 980, y: 700, antenna: [1012, 430], door: [946, 700], window: [1006, 672] };
export const HOMES = [[-520, 692], [-380, 700], [-200, 688], [-40, 698], [120, 690], [300, 702], [470, 694], [640, 700]];   // houses / marae on the coast
export const BOATS = [[160, 760], [420, 790], [690, 745]];
export function stationWorld(ctx, c, t, st = {}) {
  F.sky(ctx, c, t, { glow: SKY_GLOW, hor: TREE_HOR });   // the SAME sky as the tree world: c01 swaps the worlds while the camera sees only sky
  // the giants on the far horizon, right: dark glass towers with a few cool windows
  E.card(ctx, c, 9000, () => {
    const tw = clamp(st.towers ?? .6), r = prng(512);
    for (let k = 0; k < 7; k++) { const x = 1500 + k * 170 + (k % 2) * 40, hh = 280 + r() * 260, ww = 110 + r() * 60, y0 = ST_HOR - hh;
      ctx.fillStyle = lin(ctx, x, 0, x + ww, 0, [[0, mixHex(P.night0, P.ind0, .5)], [1, P.night0]]); ctx.fillRect(x, y0, ww, hh + 4);
      for (let i = 0; i < 26; i++) { if (r() > .35) continue; const wx = x + 10 + (i % 4) * (ww - 20) / 4, wy = y0 + 16 + Math.floor(i / 4) * hh / 8; ctx.fillStyle = rgba(COOLWIN, tw * (.4 + .3 * Math.sin(t * .4 + i))); ctx.fillRect(wx, wy, 8, 12); } }
    ctx.fillStyle = mixHex(P.ind0, P.blue0, .25); ctx.fillRect(-4000, ST_HOR, 9000, 20);
  });
  // the sea
  E.card(ctx, c, 6000, () => F.water(ctx, -4000, 6000, ST_HOR + 2, 1400, t, { top: mixHex(P.ind0, P.blue0, .45), seed: 9 }));
  // the coast, the homes, the station
  E.card(ctx, c, Z_ST, () => {
    F.hills(ctx, [[-1600, 700], [-900, 680], [-300, 688], [300, 690], [760, 705], [960, 704], [1090, 716], [1170, 742], [1260, 800], [1380, 960], [1500, 1400]], { top: mixHex(P.night1, P.ind1, .6), bottom: P.night0, rimA: .35, depth: 120 });
    for (const [x, y] of HOMES) { ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.fillRect(x - 22, y - 26, 44, 28); ctx.beginPath(); ctx.moveTo(x - 28, y - 24); ctx.lineTo(x, y - 46); ctx.lineTo(x + 28, y - 24); ctx.fill();
      halo(ctx, x + 6, y - 12, 26, .4, P.halo0, P.core1); ctx.fillStyle = P.core1; ctx.fillRect(x + 2, y - 18, 9, 9); }
    for (const [x, y] of BOATS) { ctx.fillStyle = P.night0; ctx.beginPath(); ctx.moveTo(x - 40, y); ctx.lineTo(x + 40, y); ctx.lineTo(x + 30, y + 12); ctx.lineTo(x - 30, y + 12); ctx.fill(); ctx.fillRect(x - 2, y - 46, 3, 46); halo(ctx, x, y - 48, 16, .5, P.halo0, P.core1); }
    // the station: a small wooden house with one warm window and a lattice antenna
    const S = STATION, wa = clamp(st.window ?? 1);
    F.pool(ctx, S.x, S.y + 4, 180, 22, .7 * wa);
    ctx.fillStyle = mixHex(P.night0, P.ind1, .45); ctx.fillRect(S.x - 60, S.y - 64, 120, 66);
    ctx.fillStyle = mixHex(P.night0, P.ind0, .3); ctx.beginPath(); ctx.moveTo(S.x - 72, S.y - 60); ctx.lineTo(S.x, S.y - 104); ctx.lineTo(S.x + 72, S.y - 60); ctx.fill();
    for (let k = 0; k < 5; k++) { ctx.fillStyle = rgba(P.blue1, .25); ctx.fillRect(S.x - 60, S.y - 54 + k * 12, 120, 2); }
    halo(ctx, S.window[0], S.window[1], 90, .75 * wa, P.halo0, P.core0);
    ctx.fillStyle = mixHex(P.night1, P.core1, wa); ctx.fillRect(S.window[0] - 13, S.window[1] - 16, 26, 22);
    ctx.fillStyle = P.night0; ctx.fillRect(S.door[0] - 11, S.door[1] - 34, 22, 34);
    const [ax, ay] = S.antenna; ctx.strokeStyle = mixHex(INKRIM, P.halo1, .25 * wa); ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(ax - 16, S.y - 80); ctx.lineTo(ax, ay); ctx.lineTo(ax + 16, S.y - 80); ctx.stroke();
    for (let k = 1; k < 8; k++) { const y = lerp(S.y - 80, ay, k / 8), hw = 16 * (1 - k / 8); ctx.beginPath(); ctx.moveTo(ax - hw, y); ctx.lineTo(ax + hw, y); ctx.stroke(); }
    halo(ctx, ax, ay, 26, .8, P.halo0, P.core0);
    if (st.ring) { ringOfVoices(ctx, t, ax, ay, 150, st.ring); }
    if (st.voices) st.voices(ctx);
    if (st.bead) F.agent(ctx, t, st.bead[0], st.bead[1], st.bead[2], st.bead[3] || {});
  });
}
const COOLWIN = mixHex(P.cream, '#9fc2ee', .5), INKRIM = mixHex(P.blue1, P.halo2, .35);
// the people's voices circling the antenna: a warm ring of small voice waves (n of them grown by u)
export function ringOfVoices(ctx, t, x, y, R, u) {
  const n = 14;
  for (let k = 0; k < n; k++) { const e = expoOut(span(u, k / n * .6, k / n * .6 + .4)); if (e <= 0) continue; const a = t * .35 + k / n * TAU, rr = R * (.9 + .08 * Math.sin(t * 1.3 + k));
    F.voiceWave(ctx, t, x + Math.cos(a) * rr, y + Math.sin(a) * rr * .45, 30 * e, { a: e, ph: k }); }
}
export const ST_CAM = E.aim(Z_ST, 860, 610, .78);
export function plateStation(ctx, t, T) {
  const k = creep(t, T, 'A global data company');
  stationWorld(ctx, E.aim(Z_ST, 860 + tr(k), 610, .78 * k), t, { window: 1, ring: 1, towers: .7 });
  F.lampRail(ctx, t, T);
}

// ================================================================================================================= THE TREE AT THE TURN
export const TREE_CAM_TURN = E.aim(E.F0, 980, 600, 1.35, 760, 560);
export function treeTurnState(t, T) {
  return { glow: .28, du: { look: .7 }, lantern: (n) => ({ lit: F.lampOn(T, n, t) * .9 + (n === 7 ? .25 : 0), inside: n === 7 ? (cx, w, h) => vignetteKitchen(cx, t, w, h, { words: .4, lamp: .8 }) : null, glass: n === 7 ? .6 : 0 }) };
}
export function plateTree(ctx, t, T) {
  const k = creep(t, T, 'Casey Harrell knows'), c = TREE_CAM_TURN;
  treeWorld(ctx, E.aim(E.F0, 980 + tr(k), 600, 1.35 * k, 760, 560), t, treeTurnState(t, T));
  F.lampRail(ctx, t, T);
}

// ================================================================================================================= NIGHT GRASS (No. 4 → No. 3)
export const GRASS_CAM = E.cam3();
const BLADES = (() => { const r = prng(3303), b = []; for (let L = 0; L < 3; L++) for (let k = 0; k < 120; k++) b.push([L, -100 + r() * 2120, 260 + r() * 340 + L * 120, r() * 6.3, .6 + r() * .8]); return b; })();
export function grassWorld(ctx, c, t, st = {}) {
  F.sky(ctx, c, t, { glow: [960, 300, 900], hor: 520 });
  E.card(ctx, c, 6000, () => { F.hills(ctx, [[-2000, 520], [0, 500], [960, 512], [2000, 498], [4000, 520]], { top: mixHex(P.night1, P.ind1, .5), bottom: P.night0, rimA: .3, depth: 400 });
    ctx.strokeStyle = rgba(mixHex(P.blue1, P.halo2, .4), .6); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-3000, 560); ctx.lineTo(5000, 548); ctx.stroke(); });
  const shadowX = st.shadowX ?? (600 + 140 * Math.sin(t * .4)), shadowA = clamp(st.shadow ?? 1);
  for (let L = 0; L < 3; L++) E.card(ctx, c, [3200, 2200, 1500][L], () => {
    const base = [760, 900, 1080][L], col = [mixHex(P.ind0, P.blue0, .2), mixHex(P.night1, P.ind1, .5), P.night0][L];
    ctx.fillStyle = col; ctx.fillRect(-2000, base, 6000, 800);
    for (const [l, x, hh, ph, f] of BLADES) { if (l !== L) continue; const near = Math.exp(-((x - shadowX) ** 2) / 9000) * shadowA * (L === 1 ? 1 : .3), bend = 18 * Math.sin(t * f + ph) + 60 * near * Math.sign(x - shadowX) + 40 * Math.sin(ph * 3.1);
      const h2 = hh * (.45 + .3 * Math.sin(ph * 5.3) ** 2), bw = (16 - L * 4) * (.7 + .3 * f);
      ctx.fillStyle = mixHex(col, mixHex(P.blue0, P.blue1, .3), .3 + .22 * (2 - L) / 2 + .1 * Math.sin(ph * 7));
      ctx.beginPath(); ctx.moveTo(x - bw / 2, base + 4); ctx.quadraticCurveTo(x + bend * .2 - bw * .3, base - h2 * .55, x + bend, base - h2); ctx.quadraticCurveTo(x + bend * .2 + bw * .3, base - h2 * .5, x + bw / 2, base + 4); ctx.fill(); }
    if (L === 1 && shadowA > 0) { ctx.fillStyle = rgba(P.night0, .55 * shadowA); ctx.beginPath(); ctx.ellipse(shadowX, base - 60, 160, 30, 0, 0, TAU); ctx.fill(); }
  });
}
export function plateGrass(ctx, t, T) {
  const k = creep(t, T, 'The snake');
  grassWorld(ctx, E.aim(E.F0, 960 + tr(k), 540, k), t, {});
  F.lampRail(ctx, t, T);
}
