// Film 14 · c09 · Finale + end screen (s19–s22, shots 9.01–9.12) · KEY ANCHOR 4: the key ring. One plan sequence on one stage:
// a dawn ridge (it grows out of the seam plate plateScale, lib/f14_seams.mjs) with the explainer in the sky above you.
//
// | shot | words                         | picture                                                                  | main move              |
// |------|-------------------------------|--------------------------------------------------------------------------|------------------------|
// | 9.01 | None of them · alone          | the scale retracts into its pivot; vault door and glass box shrink into   | morph                  |
// |      |                               | the bows of two keys (iron key with the vault in its bow, a glass key)   |                        |
// | 9.02 | Can anyone … critics          | the two keys circle slowly, unordered; you climb onto the ridge, dawn    | slow orbit             |
// | 9.03 | button · single hand · ring · | a button grows, one dark hand reaches for it, it is rejected; a ring of  | ring closes            |
// |  ★   | many hands                    | light closes through the bows, microscope + rival keys arrive; hands hold |                        |
// | 9.04 | vault · microscope · rival ·  | the ring turns slowly; each key lights on its word with a label and a    | ring turns             |
// |      | glass                         | warm arc of coverage, the gaps between stay cool (blind spots)           |                        |
// | 9.05 | Each key … misses · blindly   | the arcs widen until they overlap: the ring glows closed                 | arcs widen             |
// | 9.06 | power sits · Epoch · 71 ·     | the ring unrolls into a bar of 100 cells; 71 turn warm (5 companies);    | unroll · warm cascade  |
// |      | growing                       | on growing a cool tick at 63 % (63 % → 71 %, Epoch AI 2026)               |                        |
// | 9.07 | When that · same hands        | the bar rolls back into the ring, the keys return; a different hand by   | roll back · hands      |
// |      |                               | each key                                                                 |                        |
// | 9.08 | missing · pieces · turned     | empty hooks: cool dashed outlines of missing keys; each real key turns   | outlines · turns       |
// | 9.09 | Whose hands · work · school · | three small warm places light up on the ridge (office, school, kitchen)  | lights                 |
// |      | kitchen                       |                                                                          |                        |
// | 9.10 | And which · outside · hold    | one missing key leaves the ring and floats down to you, warming          | float (camera follows) |
// | 9.11 | subscribe · single key ·      | pull back: the ring rises to a hook at the top, the keys swing to hang;  | pull back · rise       |
// |      | insist                        | on insist your key rises and hangs on, now gold                          |                        |
// | 9.12 | (end screen ~15 s)            | the key ring top centre, you tiny bottom centre, free zones left / right | pendulum, dawn grows   |
//
// Free zones in the end screen (screen px): left x 90–780 y 250–700, right x 1140–1830 y 250–700, centre x 810–1110 y 330–600.
import * as E from './f10_editorial.mjs';
import * as K from './f13_kit.mjs';
import { KEY_PATH, keyMatrix, darkHand } from './f14_kit.mjs';
import { plateScale, dawnSky, DAWN0, RIDGE, ridgeY, drawBeam, drawVault, drawGlass, scalePans, PLATE_SCALE } from './f14_seams.mjs';
import { Path2D } from '@napi-rs/canvas';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, card, cam3, camAt, camDrift, F0 } = E;
const rise = (x) => 1 - (1 - clamp(x)) ** 3;
export const PRINT = K.PRINT13;

export function finaleAnchors(T) {
  const S = (sec, w, n) => T.S(sec, w, n);
  return {
    T0: T.seg('s19').start, none: S('s19', 'None'), alone: S('s19', 'alone'), canAny: S('s19', 'Can anyone'), critics: S('s19', 'critics'),
    butOne: S('s19', 'But one'), button: S('s19', 'button'), single: S('s19', 'single hand'), presses: S('s19', 'presses'), ring: S('s19', 'ring'), many: S('s19', 'many hands'),
    vault: S('s20', 'vault'), micro: S('s20', 'microscope'), rival: S('s20', 'rival'), glass: S('s20', 'glass'), eachKey: S('s20', 'Each key'), misses: S('s20', 'misses'), together: S('s20', 'Together'), blindly: S('s20', 'blindly'),
    s21: T.seg('s21').start, power: S('s21', 'power sits'), epoch: S('s21', 'Epoch'), five: S('s21', 'five'), seventy: S('s21', 'seventy-one'), growing: S('s21', 'growing'), whenThat: S('s21', 'When that'), few: S('s21', 'few places'), same: S('s21', 'same hands'),
    s22: T.seg('s22').start, missing: S('s22', 'missing'), pieces: S('s22', 'pieces'), habit: S('s22', 'habit'), turned: S('s22', 'turned'), next: S('s22', 'So the next'), whose: S('s22', 'Whose hands'),
    work: S('s22', 'work'), school: S('s22', 'school'), kitchen: S('s22', 'kitchen'), which: S('s22', 'And which'), outside: S('s22', 'outside'), hold: S('s22', 'hold'),
    ifYou: S('s22', "If you'd"), subscribe: S('s22', 'subscribe'), insist: S('s22', 'insist'), voEnd: T.E('s22'), end: T.duration ?? (T.E('s22') + 15.9),
  };
}

// ---------------------------------------------------------------------------------------------------------------- the stage
const C = [960, 400], R = 210, KH = 150;                         // the ring (design px on the focus card = screen at the rest camera)
const END = { c: [960, 70], r: 84, h: 92 };                      // the ring on its hook in the end screen
const DU = { x: 960, h: 70 };
// the keys: kind, slot angle on the ring (radial, pointing out), the word that lights it, label
const KEYS = [
  { kind: 'vault', th: -Math.PI / 2, word: 'vault', label: 'VAULT' },
  { kind: 'micro', th: 0, word: 'micro', label: 'MICROSCOPE' },
  { kind: 'rival', th: Math.PI / 2, word: 'rival', label: 'RIVAL CHECK' },
  { kind: 'glass', th: Math.PI, word: 'glass', label: 'GLASS' },
];
const MISSING = [-Math.PI / 4, Math.PI / 4, 3 * Math.PI / 4];   // empty hooks; the last one floats to you (9.10) and comes back gold
const HANDS = [[-Math.PI / 4, 0], [Math.PI / 4, 0], [3 * Math.PI / 4, 1], [-3 * Math.PI / 4, 0]];   // [grip angle, yours?]
const HANG = (i) => Math.PI / 2 + (i - 3) * .27;                  // hanging angles on the end ring (7 keys)
const HANG_ORDER = { vault: 0, micro: 1, rival: 2, glass: 3, m0: 4, m1: 5, you: 6 };
const MOTES = (() => { const r = E.prng(5150), m = []; for (let i = 0; i < 180; i++) m.push([r() * 2400 - 240, r(), 12 + r() * 14, 1.2 + r() * 1.8]); return m; })();
const LIGHTS = [[380, 'work'], [1540, 'school'], [640, 'kitchen']];   // three small warm places on the ridge
// the ridge, widened beyond the frame (the pull-back must never show its ends); identical to the plate inside the frame
const RIDGE_W = (() => { const l = RIDGE[0], r = RIDGE[RIDGE.length - 1], out = [];
  for (let x = -2200; x < l[0]; x += 120) out.push([x, l[1] + 40 * Math.sin((x - l[0]) * .0022)]);
  out.push(...RIDGE); for (let x = r[0] + 120; x <= W + 2200; x += 120) out.push([x, r[1] + 40 * Math.sin((x - r[0]) * .0022)]); return out; })();
const DAWN1 = [[0, mixHex(P.ind0, P.blue0, .15)], [.42, mixHex(P.ind1, P.blue0, .35)], [.78, mixHex(P.ind2, P.halo1, .5)], [1, mixHex(P.halo1, P.halo0, .25)]];
const lerpStops = (A, B, u) => A.map(([o, c], i) => [o, mixHex(c, B[i][1], u)]);
const angLerp = (a, b, u) => { let d = b - a; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return a + d * u; };

// ---------------------------------------------------------------------------------------------------------------- the keys
// one key in local units (KEY_PATH, height 1): the shaft + bit in the key's material, the bow as an emblem of what it is.
// o: { lum 0.5..1, warm 0..1 (glass / missing outline warming), pieces 0..1 (microscope: only part of the lens), dash (missing) }
function drawKey(ctx, kind, x, y, h, rot, turn, o = {}) {
  const m = keyMatrix(x, y, h, rot, turn), lum = o.lum ?? 1, a = o.a ?? 1;
  if (a <= 0) return;
  const px = 1 / h;                                                 // one screen-ish px in local units
  ctx.save(); ctx.globalAlpha = a; ctx.transform(m.a, m.b, m.c, m.d, m.e, m.f);
  if (kind === 'missing') {
    const w = o.warm ?? 0;
    ctx.setLineDash([.045, .03]); ctx.lineDashOffset = -(o.dashT ?? 0) * .02;
    ctx.strokeStyle = rgba(mixHex(mixHex(P.cream, P.blue0, .25), P.halo0, w), .78 + .2 * w); ctx.lineWidth = 2.4 * px; ctx.stroke(KEY_PATH);
    ctx.restore(); return;
  }
  if (kind === 'rival' || kind === 'gold') {                        // the classic gold key of light (the second key; your key at the end)
    const k = (c) => mixHex(c, P.shade0, .7 * (1 - lum));
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.rad(ctx, 0, -.25, .9, [[0, rgba(P.halo1, .28 * lum)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(-1, -1.2, 2, 2.4); ctx.restore();
    ctx.fillStyle = E.rad(ctx, 0, -.3, .85, [[0, k(P.core0)], [.3, k(P.core1)], [.7, k(P.halo0)], [1, k(P.halo1)]]); ctx.fill(KEY_PATH);
    ctx.restore(); return;
  }
  // shaft + bit: below the bow only
  ctx.save(); ctx.beginPath(); ctx.rect(-1, -.105, 2, 1.2 * (o.grow ?? 1)); ctx.clip();
  if (kind === 'vault') { ctx.fillStyle = mixHex(P.ind2, P.night1, .4); ctx.fill(KEY_PATH); ctx.strokeStyle = rgba(P.halo0, .85 * lum); ctx.lineWidth = 2 * px; ctx.stroke(KEY_PATH); }
  else if (kind === 'glass') { ctx.fillStyle = rgba(P.cream, .08); ctx.fill(KEY_PATH); ctx.strokeStyle = rgba(mixHex(P.cream, P.blue0, .25), .9 * lum); ctx.lineWidth = 2 * px; ctx.stroke(KEY_PATH); }
  else { ctx.fillStyle = mixHex(P.ind1, P.blue0, .25); ctx.fill(KEY_PATH); ctx.strokeStyle = rgba(P.cream, .8 * lum); ctx.lineWidth = 2 * px; ctx.stroke(KEY_PATH); }
  ctx.restore();
  if (o.noBow) { ctx.restore(); return; }
  // the bow emblem, centre (0, -.3), radius .2 (same drawing as the seam plate's vault door / glass box, scaled)
  ctx.translate(0, -.3);
  if (kind === 'vault') {
    ctx.fillStyle = mixHex(P.ind2, P.night1, .4); ctx.beginPath(); ctx.arc(0, 0, .2, 0, 6.29); ctx.fill();
    ctx.strokeStyle = rgba(P.halo0, .85 * lum); ctx.lineWidth = 2.2 * px;
    for (const rr of [.2, .138, .052]) { ctx.beginPath(); ctx.arc(0, 0, rr, 0, 6.29); ctx.stroke(); }
    for (let i = 0; i < 6; i++) { const q = i * Math.PI / 3 + .2; ctx.beginPath(); ctx.moveTo(.052 * Math.cos(q), .052 * Math.sin(q)); ctx.lineTo(.138 * Math.cos(q), .138 * Math.sin(q)); ctx.stroke(); }
  } else if (kind === 'glass') {
    const s = .34, q = s / 150; ctx.fillStyle = rgba(P.cream, .07); ctx.fillRect(-s / 2, -s / 2, s, s);
    ctx.strokeStyle = rgba(mixHex(P.cream, P.blue0, .25), .9 * lum); ctx.lineWidth = 2.2 * px; ctx.strokeRect(-s / 2, -s / 2, s, s);
    ctx.beginPath(); ctx.moveTo(-s / 2, -s / 2); ctx.lineTo(-s / 2 + 34 * q, -s / 2 - 46 * q); ctx.lineTo(s / 2 + 34 * q, -s / 2 - 46 * q); ctx.lineTo(s / 2, -s / 2); ctx.stroke();
    ctx.strokeStyle = rgba(P.halo0, .8 * lum); ctx.lineWidth = 3 * px;
    for (let i = 0; i < 4; i++) { const yy = -s / 2 + (30 + i * 30) * q; ctx.beginPath(); ctx.moveTo(-s / 2 + 24 * q, yy); ctx.lineTo(-s / 2 + (24 + [92, 70, 100, 60][i]) * q, yy); ctx.stroke(); }
  } else if (kind === 'micro') {
    const pc = 1 - .55 * (o.pieces ?? 0);                            // "sees only pieces": part of the lens goes dark
    ctx.fillStyle = mixHex(P.ind1, P.blue0, .25); ctx.beginPath(); ctx.arc(0, 0, .2, 0, 6.29); ctx.fill();
    ctx.fillStyle = E.rad(ctx, -.05, -.06, .2, [[0, rgba(P.cream, .5 * lum)], [1, rgba(mixHex(P.cream, P.blue0, .5), .15)]]);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, .135, -Math.PI / 2, -Math.PI / 2 + 6.283 * pc); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(P.cream, .85 * lum); ctx.lineWidth = 2 * px; ctx.beginPath(); ctx.arc(0, 0, .2, 0, 6.29); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, .135, 0, 6.29); ctx.stroke();
    ctx.lineWidth = 1.2 * px; ctx.beginPath(); ctx.moveTo(-.1, 0); ctx.lineTo(.1, 0); ctx.moveTo(0, -.1); ctx.lineTo(0, .1); ctx.stroke();
  }
  ctx.restore();
}
// pose of a key whose bow sits on a circle (centre c, radius r) at angle th, pointing along angle dir (radial: dir = th)
const onRing = (c, r, th, h, dir) => { const bx = c[0] + r * Math.cos(th), by = c[1] + r * Math.sin(th); return { x: bx + .3 * h * Math.cos(dir), y: by + .3 * h * Math.sin(dir), rot: dir - Math.PI / 2, bow: [bx, by] }; };
const mixPose = (A, B, u) => ({ x: lerp(A.x, B.x, u), y: lerp(A.y, B.y, u), rot: angLerp(A.rot, B.rot, u) });

// the ring of light (stroke only, no blur): cool base, warm arcs = coverage
function drawRing(ctx, c, r, sweep, a0, warmArcs, lw = 1) {
  if (sweep <= 0) return;
  ctx.save(); ctx.lineCap = 'round';
  const arc = (from, to) => { ctx.beginPath(); ctx.arc(c[0], c[1], r, from, to); ctx.stroke(); };
  for (const [w, al, col] of [[16, .1, P.blue0], [6, .55, mixHex(P.cream, P.blue0, .35)], [2.2, .9, P.cream]]) { ctx.lineWidth = w * lw; ctx.strokeStyle = rgba(col, al); arc(a0, a0 + Math.min(6.2831, 6.2832 * sweep)); }   // napi: an arc a hair over 2π from a non-zero start draws nothing
  for (const [from, to, k] of warmArcs) { if (k <= 0) continue;
    for (const [w, al, col] of [[22, .18, P.halo1], [7, .7, P.halo0], [2.6, 1, P.core0]]) { ctx.lineWidth = w * lw; ctx.strokeStyle = rgba(col, al * k); arc(from, to); } }
  ctx.restore();
}
// a hand gripping the ring at angle g (from outside), u = reach 0..1; yours is yellow
function ringHand(ctx, c, r, g, u, mine) {
  if (u <= 0) return;
  // at u = 0 the hand is off-frame (it never vanishes in view)
  const L = 96, out = r + .98 * L + (1 - u) * 1500, ox = c[0] + Math.cos(g) * out, oy = c[1] + Math.sin(g) * out;   // fingers on the rim, arms outward
  const m = E.handMatrix(ox, oy, g + Math.PI, L, Math.cos(g) < 0 ? -1 : 1);
  if (!mine) { darkHand(ctx, m, { pose: 'hold', curl: .05, warm: .5, side: 1 }); return; }
  const path = new Path2D(); path.addPath(E.handPath({ pose: 'hold', curl: .05 }), m);
  const [sx, sy] = E.applyM(m, -1.5, 0), [ex, ey] = E.applyM(m, 1.3, 0);
  ctx.save(); ctx.fillStyle = E.lin(ctx, sx, sy, ex, ey, [[0, mixHex(P.coat, P.shade0, .55)], [.6, P.coat], [1, mixHex(P.coat, P.core1, .3)]]); ctx.fill(path);
  ctx.strokeStyle = rgba(P.halo0, .6); ctx.lineWidth = 2; ctx.stroke(path); ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- the draw
export function finale(a) {
  const t0 = a.T0, tP = a.T0 + .5;                                // the plate is drawn until tP (seam rule)
  const CAM = [
    [tP, cam3()],
    [a.critics + .5, cam3({ z: 110, y: 10 })],
    [a.ring + 2.5, cam3({ z: 150, y: 0 })],
    [a.blindly, cam3({ z: 175, y: -6, x: 10 })],
    [a.same, cam3({ z: 150, y: 0 })],
    [a.turned + 1.5, cam3({ z: 165, y: 10 })],
    [a.kitchen + .4, cam3({ z: 100, y: 70 })],
    [a.hold + .8, cam3({ z: 150, y: 150 })],
    [a.insist + .6, cam3({ z: -260, y: -10 })],
    [a.end, cam3({ z: -560, y: -24 })],
  ];
  // timeline helpers
  const tMorph = [tP, a.alone + .7], tBeam = [tP, a.alone + .2];
  const tOrbit0 = a.alone + .7;
  const tRing = [a.ring - .1, a.ring + 1.3], tSlot = [a.ring - .6, a.ring + 1.1];
  const tMicroIn = [a.ring + .2, a.ring + 2.1], tRivalIn = [a.ring + .5, a.ring + 2.4];
  const tHands1 = [a.many - 1, a.many + 1.4], tHands1Out = [a.vault - .4, a.vault + 2];
  const tRot = [a.vault - .2, a.blindly + .5];
  const tCover = [a.misses - .2, a.together + 1.2];
  const tLift = [a.s21 - .1, a.s21 + 1.8], tUnroll = [a.s21 + .9, a.power + .2], tCells = [a.power - .2, a.power + 1.2];
  const tBack = [a.whenThat - .3, a.whenThat + 1.2], tRoll = [a.whenThat + .6, a.few + .6], tReturn = [a.few + .1, a.few + 2.1];
  const tHands2 = [a.same - 1.8, a.same + .6], tHands2Out = [a.s22 + .3, a.s22 + 2.6];
  const tMiss = [a.missing - .2, a.missing + 1.6];
  const tFloat = [a.which + .3, a.hold + .9];
  const tUp = [a.ifYou, a.insist + .3], tHang = [a.ifYou + 2, a.insist + .8], tHome = [a.insist, a.insist + 2.8];

  return (ctx, t) => {
    if (t < tP) { plateScale(ctx, t); return; }
    const c = camDrift(camAt(t, CAM), t, .6 * smooth(span(t, tP, tP + 3)) + 1.4 * smooth(span(t, a.voEnd - 1, a.voEnd + 3)), 3);   // the end screen breathes more (never frozen)
    const dawn = smooth(span(t, a.canAny, a.end));
    // ---- sky (flat gradient: no parallax) ----
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); dawnSky(ctx, lerpStops(DAWN0, DAWN1, dawn));
    ctx.restore();
    card(ctx, c, F0, () => {
      // morning light behind the ridge (grows; never brighter than the keys)
      const sun = smooth(span(t, a.next, a.end));
      if (sun > 0) E.halo(ctx, 960, 880, 420 + 140 * sun, .16 * sun, P.halo1, P.halo0);
      // rising dust over the ridge (end screen life; stays low, below the free zones)
      const mo = smooth(span(t, a.voEnd - 6, a.voEnd));
      if (mo > 0) { ctx.save(); for (const [mx, ph, sp, sz] of MOTES) { const k = ((t * sp / 140 + ph) % 1), y = ridgeY(Math.max(-40, Math.min(W + 40, mx))) + 10 - k * 150;
        ctx.fillStyle = rgba(P.halo0, .5 * mo * Math.sin(Math.PI * k)); ctx.beginPath(); ctx.arc(mx + 8 * Math.sin(t * .3 + ph * 9), y, sz, 0, 6.28); ctx.fill(); } ctx.restore(); }
      // the three warm places on the ridge (9.09): small houses that rise from the ridge line
      for (const [lx, w] of LIGHTS) {
        const u = rise(span(t, a[w] - .2, a[w] + .9)); if (u <= 0) continue;
        const gy = ridgeY(lx) + 2, hh = 26 * u;
        ctx.fillStyle = P.night1; ctx.beginPath(); ctx.moveTo(lx - 20, gy); ctx.lineTo(lx - 20, gy - hh); ctx.lineTo(lx, gy - hh - 12 * u); ctx.lineTo(lx + 20, gy - hh); ctx.lineTo(lx + 20, gy); ctx.fill();
        ctx.fillStyle = rgba(P.halo0, .95 * u); ctx.fillRect(lx - 6, gy - hh + 9 * u, 12, 9 * u);
        E.halo(ctx, lx, gy - hh * .5, 70, .22 * u, P.halo1, P.halo0);
      }
      // you: climb onto the crest at the centre (from behind the ridge), look up at the keys
      const up = sineIO(span(t, a.canAny, a.canAny + 2.4));
      const gy = ridgeY(DU.x);
      if (up > 0) {
        const look = lerp(.5, .95, sineIO(span(t, a.butOne, a.ring))) - .3 * sineIO(span(t, a.whose, a.kitchen)) + .3 * sineIO(span(t, a.which, a.hold));
        E.du(ctx, DU.x, gy + 1 + (1 - up) * DU.h * 1.1, DU.h, { dir: 1, look: clamp(look), light: 1 });
      }
      // ridge (the plate's, widened) drawn after you, so you rise from behind it
      ctx.fillStyle = P.night1; ctx.beginPath(); ctx.moveTo(RIDGE_W[0][0], H + 2000); RIDGE_W.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(RIDGE_W[RIDGE_W.length - 1][0], H + 2000); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = rgba(P.halo1, .45 + .25 * dawn); ctx.lineWidth = 2; ctx.beginPath(); RIDGE_W.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
      if (up > 0) { ctx.save(); ctx.beginPath(); RIDGE_W.forEach(([x, y], i) => (i ? ctx.lineTo(x, y - 400) : ctx.moveTo(x, y - 400))); for (let i = RIDGE_W.length - 1; i >= 0; i--) ctx.lineTo(RIDGE_W[i][0], RIDGE_W[i][1]); ctx.clip();
        // your light pool on the crest
        ctx.restore(); }

      // ---- 9.01: the scale retracts, vault + glass become keys ----
      const beamK = 1 - sineIO(span(t, ...tBeam));
      drawBeam(ctx, t, beamK);
      const mu = sineIO(span(t, ...tMorph));
      const pans = scalePans(Math.min(t, tP));
      // orbit (9.02): two keys circle slowly, unordered
      const ot = Math.max(0, t - tOrbit0);
      const orbV = { x: C[0] + 170 * Math.cos(-2.4 + .2 * ot), y: C[1] + 120 * Math.sin(-2.4 + .2 * ot) + 6 * Math.sin(t * .8), rot: .08 * Math.sin(t * .6) };
      const orbG = { x: C[0] + 175 * Math.cos(-.5 + .14 * ot + .15 * Math.sin(ot * .3)), y: C[1] + 110 * Math.sin(-.5 + .14 * ot) + 6 * Math.sin(t * .7 + 1), rot: -.1 + .08 * Math.sin(t * .5 + 2) };
      const orbStartV = { x: C[0] + 170 * Math.cos(-2.4), y: C[1] + 120 * Math.sin(-2.4), rot: 0 }, orbStartG = { x: C[0] + 175 * Math.cos(-.5), y: C[1] + 110 * Math.sin(-.5), rot: -.1 };
      // ring state
      const rr = .35 * sineIO(span(t, ...tRot));
      const sweep = sineIO(span(t, ...tRing));
      const lift = sineIO(span(t, ...tLift)) * (1 - sineIO(span(t, ...tReturn)));
      const unroll = sineIO(span(t, ...tUnroll)) * (1 - sineIO(span(t, ...tRoll)));
      const upU = sineIO(span(t, ...tUp)), hangU = sineIO(span(t, ...tHang));
      const rc = [lerp(C[0], END.c[0], upU), lerp(C[1], END.c[1], upU)], rR = lerp(R, END.r, upU), kh = lerp(KH, END.h, upU);
      const swing = (t > tHang[0] ? .045 * Math.sin((t - tHang[0]) * 1.25) * (.4 + .6 * Math.exp(-(t - tHang[1]) * .25 * (t > tHang[1]))) : 0);
      // poses of the four real keys
      const lit = (k) => smooth(span(t, a[k.word] - .1, a[k.word] + .7));
      const cover = smooth(span(t, ...tCover));
      const poses = KEYS.map((k, i) => {
        const th = k.th + rr;
        let P0 = onRing(rc, rR, th, kh, th);
        const hang = onRing(rc, rR, HANG(HANG_ORDER[k.kind]) + swing, kh, Math.PI / 2 + swing * 1.4);
        P0 = mixPose(P0, hang, hangU);
        // lifted row above the bar (9.06)
        const row = { x: 960 + (i - 1.5) * 150, y: 175, rot: 0 };
        let p = mixPose(P0, row, lift);
        let h = lerp(kh, KH * .62, lift);
        if (k.kind === 'vault' || k.kind === 'glass') {
          const orb = k.kind === 'vault' ? orbV : orbG, s0 = k.kind === 'vault' ? orbStartV : orbStartG;
          const free = t < tOrbit0 ? s0 : orb;
          p = mixPose(free, p, sineIO(span(t, ...tSlot)));
        } else {
          const from = k.kind === 'micro' ? { x: 2250, y: 260, rot: -1.2 } : { x: 1500, y: 1450, rot: .6 };
          p = mixPose(from, p, sineIO(span(t, ...(k.kind === 'micro' ? tMicroIn : tRivalIn))));
        }
        const turn = 6.2832 * sineIO(span(t, a.turned - .1 + i * .35, a.turned + 1.1 + i * .35));
        return { ...p, h, turn, lum: (.62 + .38 * Math.max(lit(k), cover, 1 - smooth(span(t, a.vault - .6, a.vault)))) * (1 - .4 * lift), k };
      });

      // ---- 9.03: the button and the single hand (rejected) ----
      const bU = expoOut(span(t, a.button - .15, a.button + .6)) * (1 - sineIO(span(t, a.ring - .5, a.ring + .3)));
      if (bU > 0) {
        const press = .9 + .1 * (1 - Math.sin(Math.PI * clamp((t - a.presses) / .5)));
        ctx.save(); ctx.translate(C[0], C[1]); ctx.scale(bU * press, bU);
        ctx.fillStyle = mixHex(P.ind1, P.night1, .3); ctx.beginPath(); ctx.arc(0, 0, 36, 0, 6.29); ctx.fill();
        ctx.strokeStyle = rgba(P.cream, .85); ctx.lineWidth = 2.4; ctx.stroke(); ctx.fillStyle = rgba(P.halo0, .8); ctx.beginPath(); ctx.arc(0, 0, 9, 0, 6.29); ctx.fill(); ctx.restore();
      }
      const sh = sineIO(span(t, a.single - .4, a.presses + .1)) * (1 - sineIO(span(t, a.ring - .3, a.ring + 1.1)));
      if (sh > 0) { const m = E.handMatrix(C[0] + 44 + 128 + (1 - sh) * 640 + 10 * Math.sin(Math.PI * clamp((t - a.presses) / .5)), C[1] + 6, Math.PI, 128, -1); darkHand(ctx, m, { pose: 'point', curl: .05 }); }

      // ---- the ring / the bar ----
      const warmArcs = KEYS.map((k, i) => { const th = k.th + rr, w = lerp(.5, .92, cover); return [th - w, th + w, Math.max(lit(k) * smooth(span(t, a.vault - .3, a.vault + .4)), cover)]; });
      if (unroll <= 0) drawRing(ctx, rc, rR, sweep, -Math.PI / 2 + rr, warmArcs, lerp(1, .6, upU));
      else drawBar(ctx, t, a, unroll, rr, cover);
      // the hook and its line in the end (grows down from the top edge)
      const hk = sineIO(span(t, tUp[0] + 2, tUp[1]));
      if (hk > 0) { const top = rc[1] - rR; ctx.save(); ctx.strokeStyle = rgba(P.cream, .85); ctx.lineWidth = 2.4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(rc[0], -900); ctx.lineTo(rc[0], lerp(-900, top - 26, hk)); ctx.stroke();
        if (hk > .9) { ctx.beginPath(); ctx.arc(rc[0] + 9, top - 14, 12, Math.PI, Math.PI * 2.6); ctx.stroke(); } ctx.restore(); }

      // ---- missing keys (9.08) and yours (9.10/9.11) ----
      const miss = sineIO(span(t, ...tMiss));
      if (miss > 0) MISSING.forEach((th0, i) => {
        const yours = i === 2, th = th0 + rr;
        let p = onRing(rc, rR, th, kh, th);
        p = mixPose(p, onRing(rc, rR, HANG(HANG_ORDER[yours ? 'you' : 'm' + i]) + swing, kh, Math.PI / 2 + swing * 1.4), hangU);
        let h = kh, warm = 0, a1 = clamp(miss * 1.4 - i * .2);
        if (yours) {
          const fu = sineIO(span(t, ...tFloat)), home = sineIO(span(t, ...tHome));
          const hover = { x: DU.x + 58 + 10 * Math.sin(t * .9), y: ridgeY(DU.x) - DU.h - 70 + 8 * Math.sin(t * 1.1), rot: .12 * Math.sin(t * .7) };
          const mid = { x: lerp(p.x, hover.x, fu) - Math.sin(Math.PI * fu) * 120, y: lerp(p.y, hover.y, fu), rot: angLerp(p.rot, hover.rot, fu) };
          p = mixPose(mid, p, home); h = lerp(lerp(kh, 64, fu), kh, home); warm = Math.max(fu, home);
          if (home > .5) { drawKey(ctx, 'gold', p.x, p.y, h, p.rot, 0, { lum: .75 + .25 * home, a: smooth(span(home, .5, .9)) }); if (home < .9) drawKey(ctx, 'missing', p.x, p.y, h, p.rot, 0, { warm: 1, a: 1 - smooth(span(home, .5, .9)), dashT: t }); return; }
        }
        // draw the outline as it is traced (dash reveal from the bow): a1 grows
        drawKey(ctx, 'missing', p.x, p.y, h, p.rot, 0, { warm, a: a1, dashT: t });
      });
      // the four keys
      if (t < tMorph[1]) {                                            // 9.01: vault door / glass box shrink into the bows, the shafts grow
        const pans0 = scalePans(tP);
        for (const [kind, obj, s0, st] of [['vault', pans0.vault, .2 * KH / 84, orbStartV], ['glass', pans0.glass, .34 * KH / 150, orbStartG]]) {
          const bow = [lerp(obj[0], st.x, mu), lerp(obj[1], st.y - .3 * KH, mu)], sc = lerp(1, s0, mu);
          drawKey(ctx, kind, bow[0], bow[1] + .3 * KH, KH, 0, 0, { noBow: true, grow: smooth(span(mu, .3, 1)) });
          if (kind === 'vault') drawVault(ctx, bow[0], bow[1], sc); else drawGlass(ctx, bow[0], bow[1], sc);
        }
      }
      for (const p of poses) if (t >= tMorph[1] || (p.k.kind !== 'vault' && p.k.kind !== 'glass')) drawKey(ctx, p.k.kind, p.x, p.y, p.h, p.rot, p.turn, { lum: p.lum, pieces: smooth(span(t, a.pieces - .2, a.pieces + .8)) * (1 - smooth(span(t, a.turned, a.turned + 2))) });
      // the keys of the end ring sparkle
      if (t > a.voEnd - 2) E.dust(ctx, 909, 260, rc[0], rc[1] + rR * .6, rR * 1.4, rR * 1.1, t, .55 * smooth(span(t, a.voEnd - 2, a.voEnd + 2)), P.halo0);

      // ---- labels (9.04) ----
      KEYS.forEach((k, i) => {
        const u = rise(span(t, a[k.word] + .05, a[k.word] + 1.05)) * (1 - expoIn(span(t, a.s21 - .4 + i * .08, a.s21 + .2 + i * .08)));
        if (u <= 0) return;
        const th = k.th + rr, mx = rc[0] + (rR + .45 * kh) * Math.cos(th), my = rc[1] + (rR + .45 * kh) * Math.sin(th);
        const nx = -Math.sin(th), ny = Math.cos(th);                // perpendicular: labels sit beside the shaft
        const side = Math.abs(Math.cos(th)) > .7 ? 1 : -1;
        const lx = mx + (side > 0 ? 0 : 58), ly = my + (side > 0 ? 66 : 8);
        K.maskLine(ctx, [[k.label, 0]], lx, ly, 26, u, { serif: false, align: side > 0 ? 'center' : 'left', col: P.cream, glow: false, weight: 600 });
        void nx; void ny;
      });

      // ---- hands: 9.03 (many hands hold the ring) and 9.07 (a different hand by each key) ----
      const hu = Math.max(expoOut(span(t, ...tHands1)) * (1 - expoIn(span(t, ...tHands1Out))), expoOut(span(t, ...tHands2)) * (1 - expoIn(span(t, ...tHands2Out))));   // fast off-frame, slow in view
      if (hu > 0) HANDS.forEach(([g, mine], i) => ringHand(ctx, rc, rR, g + rr, clamp(hu * 1.25 - i * .08), mine));
    });
  };
}

// ---------------------------------------------------------------------------------------------------------------- 9.06 the Epoch bar
// The ring peels off from its top into a straight line (x 300 → 1620), cells grow down from it, 71 turn warm (one block: 5 companies);
// on "growing" a cool tick marks 63 % (Epoch AI, Apr 2026: 63 % → 71 %).
const BAR = { x0: 300, x1: 1620, y: 420, h: 56, n: 100 };
function drawBar(ctx, t, a, u, rr, cover) {
  const N = 120, pts = [];
  for (let i = 0; i <= N; i++) {
    const s = i / N, th = -Math.PI / 2 + rr + s * 6.2832;
    const k = sineIO(clamp((u - s * .45) / .55));                     // peels from the start of the circle
    pts.push([lerp(C[0] + R * Math.cos(th), lerp(BAR.x0, BAR.x1, s), k), lerp(C[1] + R * Math.sin(th), BAR.y, k)]);
  }
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [w, al, col] of [[18, .16, P.halo1], [6, .7, P.halo0], [2.4, 1, P.core0]]) { ctx.lineWidth = w; ctx.strokeStyle = rgba(col, al * Math.max(.4, cover)); ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.stroke(); }
  ctx.restore();
  // cells and texts only once the line is straight
  const cells = sineIO(span(t, a.power - .2, a.power + 1.2)) * (1 - expoIn(span(t, a.whenThat + .2, a.whenThat + .9)));
  if (cells <= 0 || u < .98) return;
  const pw = (BAR.x1 - BAR.x0) / BAR.n;
  for (let i = 0; i < BAR.n; i++) {
    const warmI = smooth(span(t, a.seventy - .1 + i * .009, a.seventy + .5 + i * .009)) * (i < 71 ? 1 : 0);
    const hh = BAR.h * cells;
    ctx.fillStyle = warmI > 0 ? mixHex(mixHex(P.blue0, P.ind1, .3), P.halo0, warmI) : mixHex(P.blue0, P.ind1, .3);
    ctx.fillRect(BAR.x0 + i * pw + 1, BAR.y + 4, pw - 2.2, hh);
  }
  const out = (i) => 1 - expoIn(span(t, a.whenThat - .3 + i * .08, a.whenThat + .3 + i * .08));
  const u71 = rise(span(t, a.seventy, a.seventy + 1)) * out(0);
  if (u71 > 0) K.maskLine(ctx, [['~71%', 1]], BAR.x0, BAR.y - 30, 112, u71);
  const u5 = rise(span(t, a.five - .1, a.five + .9)) * out(1);
  if (u5 > 0) K.maskLine(ctx, [['5 COMPANIES', 0]], BAR.x0 + 300, BAR.y - 84, 28, u5, { serif: false, col: P.halo0, glow: false, weight: 600 });
  const un = rise(span(t, a.five + .5, a.five + 1.5)) * out(1);
  if (un > 0) K.maskLine(ctx, [['AMAZON · GOOGLE · META · MICROSOFT · ORACLE', 0]], BAR.x0 + 300, BAR.y - 44, 22, un, { serif: false, col: rgba(P.cream, .8), glow: false, weight: 500 });
  const uo = rise(span(t, a.seventy + .8, a.seventy + 1.8)) * out(2);
  if (uo > 0) K.maskLine(ctx, [["OF THE WORLD'S AI COMPUTING POWER", 0]], BAR.x0, BAR.y + BAR.h + 52, 24, uo, { serif: false, col: P.cream, glow: false, weight: 600 });
  const us = rise(span(t, a.seventy + 1.4, a.seventy + 2.4)) * out(3);
  if (us > 0) K.maskLine(ctx, [['EPOCH AI, 2026', 0]], BAR.x1, BAR.y + BAR.h + 52, 20, us, { serif: false, align: 'right', col: rgba(P.cream, .7), glow: false, weight: 500 });
  // growing: a cool tick at 63 % and the change under it
  const ug = rise(span(t, a.growing - .1, a.growing + .8)) * out(4);
  if (ug > 0) {
    const x63 = BAR.x0 + 63 * pw;
    ctx.save(); ctx.strokeStyle = rgba(mixHex(P.cream, P.blue0, .4), .9); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(x63, BAR.y + BAR.h + 8); ctx.lineTo(x63, BAR.y + BAR.h + 8 - (BAR.h + 16) * ug); ctx.stroke(); ctx.restore();
    K.maskLine(ctx, [['63% → 71%', 0]], x63, BAR.y + BAR.h + 96, 22, ug, { serif: false, align: 'center', col: rgba(P.cream, .8), glow: false, weight: 500 });
  }
}
