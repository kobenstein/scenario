// c08 · 07a scale, the savings, Shopify turned around, the board + 08a the World Bank, ★ the orchestra in a handset, market / farm / workshop
// (shots 7.12–8.06), 391.53 → 443.89. Owner: B2.
// Two takes joined by one fly-into surface:
//   P (perspective, the c07 world at dusk, lib/f8_c07_world.mjs + lib/f8_c08_world.mjs): tilt down from the dusk plate over the land of pairs →
//     the firm and its gold stream → the learning room → the memo falls → top-down onto it (7.17–7.19) → pull back into the ghost land →
//     the weir and the board → the trained figure with empty hands → the firefly from the horizon lands on the report → push into its plate
//   F (flat engraving, camera on a plane, lib/f8_c06_world.mjs): the plate in the report IS the first frame of F (exact) → the market grows
//     out of the page → ★ the orchestra from the handset → sideways pan: market town, farm, workshop → its roofline becomes the line plate.
//
// | shot | VO (accent)                         | image                                                                  | camera                                 | flow into next                    | ★ | sound          |
// | 7.12 | Now imagine that at **scale**       | dusk plate → the land, two lights before every workshop; far pairs light | tilt down from the sky, rise            | sinks to a larger firm            |   | shimmer_rings  |
// | 7.13 | spend the savings … **cuts**        | gold stream from the firm's door splits: broad arm → learning room,     | sink, pan right to the cold narrow arm  | push into the learning room       |   | pour           |
// |      |                                     | narrow cold arm bends away                                              |                                        |                                   |   |                |
// | 7.14 | First **one agent**                 | one firefly follows the raised hand, circles it                         | push-in ends, drift                     | plan sequence                     |   |                |
// | 7.15 | Then **five**                       | five follow the hand                                                    | drift                                  | plan sequence                     |   |                |
// | 7.16 | Then a whole **orchestra**          | rows of fireflies sweep with the hand; a sheet falls into the frame     | tilt down after the sheet               | top-down onto the sheet           |   | wings, paper   |
// | 7.17 | Shopify's rule, **turned around**   | the memo of 4.10 on the floor; it turns over                            | top-down, slow push                     | plan sequence                     |   | card           |
// | 7.18 | … **instead** of people             | engraving A (firefly in a figure's place); an ink line strikes it       | slow push                               | plan sequence                     |   |                |
// | 7.19 | … do **with it**                    | engraving B, the arch turns gold                                        | pull back up out of the paper           | (b) backwards                     |   |                |
// | 7.20 | at scale? / **Nobody** …            | the land of pairs again, most only dotted ghost lights                  | high, hold                              | down onto the gold stream         |   |                |
// | 7.21 | Boards **decide** …                 | engraved weir, the board on the wall at the wheel; the stream turns     | descend, hold                           | follow the left arm to a figure   |   | lever_switch   |
// | 7.22 | trained conductor … **instruments** | a trained figure raises its hand into empty air, grasps the void        | follow, hold                            | plan sequence                     |   |                |
// | 7.23 | **Who** gets them?                  | one firefly from the horizon, pauses on Who, comes close                | tilt down after it                      | (a) it lands on the report        |   |                |
// | 8.01 | one **answer**                      | WORLD DEVELOPMENT REPORT 2026 at the figure's feet, opens               | top-down, push into the plate           | fly into the plate (exact)        |   | pages          |
// | 8.02 | small, cheap … **simple phone**     | the market grows out of the page, a figure holds a keypad phone; label  | flat, gentle push                       | plan sequence                     |   |                |
// | 8.03 | orchestra … **basic handset**       | dusk; the phone is raised, an orchestra streams out into rows           | pull back                               | (c) sideways pan                  | ★ | bloom          |
// | 8.04 | In a **market** town                | engraved town, a small orchestra draws an arc over a stall              | pan                                    | (c) pan                           |   |                |
// | 8.05 | On a **farm**                       | field in farm green, fireflies lift off the plants                      | pan                                    | (c) pan                           |   |                |
// | 8.06 | **one person** in it                | one figure in a workshop raises its hand; the roofline → the gold line  | dive onto the roof                      | line plate (c08>c09)              |   |                |
import { W, H, rgba, clamp, mix, sm, prng, canvas } from '../engine.mjs';
import { loadImage } from '@napi-rs/canvas';
import { handsOf } from '../lib/handoff4.mjs';
import { ready, conductor, qio, eoutX, einX } from '../lib/f8_kit.mjs';
import { figureFlat } from '../lib/figure.mjs';
import { paperGround, INK, chartReady, reportCover, inkText } from '../lib/f8_chart.mjs';
import { paperMemo, memoReady } from '../lib/f8_memo.mjs';
import { dayFly, stallDetail, vendorDraw, lineOnly, nightOver, inkWorkshop, camKeys, toPlane, S } from '../lib/f8_c06_world.mjs';
import { c07Ready, pcamKeys, mkCam, horizonHills, hedges, houses, HOUSES, glow, DAY, facade, dayHouse, skyDayDusk, CRANE_PITCH } from '../lib/f8_c07_world.mjs';
import { ribbon, learnRoom, weirWall, companyHall, quad3 } from '../lib/f8_c08_world.mjs';

const TAU = Math.PI * 2, PD = Math.PI / 2 - 1e-4;

export default async (T, R) => {
  await ready(); await c07Ready(); await chartReady(); await memoReady();
  // the warm light of a pair on paper (cached sprite): bright core, orange halo
  const LAMP = await (async () => { const [cv, g] = canvas(96, 96), gr = g.createRadialGradient(48, 48, 0, 48, 48, 48); gr.addColorStop(0, 'rgba(255,248,220,1)'); gr.addColorStop(.18, 'rgba(255,210,120,1)'); gr.addColorStop(.34, 'rgba(240,140,50,.6)'); gr.addColorStop(.65, 'rgba(230,130,50,.16)'); gr.addColorStop(1, 'rgba(230,130,50,0)'); g.fillStyle = gr; g.fillRect(0, 0, 96, 96); return loadImage(cv.toBuffer('image/png')); })();
  const { in: HI, out: HO } = handsOf('c08', T);
  const s7 = (p) => T.S('07a', p), s8 = (p) => T.S('08a', p);
  const A = {
    hb: HI.b, now: s7('Now imagine'), scale: s7('scale'), companies: s7('Companies'), savings: s7('savings'), learn: s7('time to learn') + .48, cuts: s7('cuts'),
    first: s7('First one'), one: s7('one agent'), thenFive: s7('Then five'), five: s7('five'), thenOrch: s7('Then a whole'), orch: s7('orchestra'),
    its: s7('It\'s Shopify'), turned: s7('turned around'), notWhat: s7('Not what'), instead: s7('instead'), butWhat: s7('But what can'), withIt: s7('with it'),
    does: s7('Does that'), nobody: s7('Nobody has'), boards: s7('Boards'), decide: s7('decide'), butEven: s7('But even'), trained: s7('trained'), instr: s7('instruments'),
    who: s7('Who gets'), wb: s8('The World Bank'), answer: s8('answer'), inits: s8('In its new'), small: s8('small, cheap'), text: s8('text message'), simple: s8('simple phone'),
    picture: s8('Picture'), orch8: s8('orchestra'), basic: s8('basic handset'), inMarket: s8('In a market'), market: s8('market'), onFarm: s8('On a farm'), farm: s8('farm'),
    inWork: s8('In a workshop'), workshop: s8('workshop'), oneP: s8('one person'), ha: HO.a,
  };
  // ================================================================ P: the perspective take
  const C1 = { X: -880, Z: 5150, u: 1.3 }, ROOM = { X: -1060, Zf: 4640, Zb: 4672, u: .8 }, PF = { X: -1040, Z: 4656 };
  const C2 = { X: -700, Z: 7300, u: 1.3 }, WEIR = { X: -570, Z: 6820, u: .55 }, TF = { X: -1200, Z: 6120 };
  const SH = { X: -1028, Z: 4648.6, w: 2.46, h: 3.18, rot: .06 };                       // the memo (820 × 1060 at .003)
  const CV = { X: -1182, Z: 6098, w: 2.28, h: 2.94 }, CV0 = { X: CV.X - 1.14, Z: CV.Z + 1.47 };   // the report (760 × 980 at .003), far-left corner
  const PL = { x: 100, y: 300, w: 600, h: 337.5 };                                          // the plate in the report's page (local units)
  const SW = 428.55;                                                                        // the plate fills the frame: P → F
  const IL = { X: CV0.X + (PL.x + PL.w / 2) * .003, Z: CV0.Z - (PL.y + PL.h / 2) * .003, h: 1500 * PL.w * .003 / W };
  const camK = pcamKeys([
    { t: A.hb, x: -596, z: 2150, h: 330, yaw: 0, pitch: CRANE_PITCH, roll: 0, F: 1500, oy: 0 },
    { t: A.scale + .65, x: -700, z: 1500, h: 1500, pitch: .42 },
    { t: A.savings + 1.0, x: -900, z: 3900, h: 210, yaw: -.04, pitch: .15 },
    { t: A.cuts + .45, x: -820, z: 3960, h: 200, yaw: .42, pitch: .17 },
    { t: A.first + 1.5, x: -1028, z: 4576, h: 13, yaw: 0, pitch: .02 },
    { t: A.orch + .3, x: -1027, z: 4579, h: 13.2 },
    { t: A.its + 1.3, x: SH.X, z: SH.Z, h: 5.3, pitch: PD },
    { t: A.withIt + .5, x: SH.X, z: SH.Z + .08, h: 4.75 },
    { t: A.does + 1.7, x: -900, z: 3500, h: 1700, pitch: .5 },
    { t: A.nobody + .38, x: -905, z: 3510, h: 1690 },
    { t: A.boards + .3, x: -560, z: 6480, h: 62, yaw: 0, pitch: .1 },
    { t: A.decide + .9, x: -562, z: 6488, h: 61 },
    { t: A.butEven + .9, x: -1160, z: 6020, h: 16, yaw: -.1, pitch: .03 },
    { t: A.who + .75, x: -1158, z: 6024, h: 16.2 },
    { t: A.wb + .25, x: CV.X, z: CV.Z, h: 5.6, yaw: 0, pitch: PD },
    { t: A.answer + .45, x: CV.X, z: CV.Z - .02, h: 5.5 },
    { t: SW, x: IL.X, z: IL.Z, h: IL.h },
  ]);
  // the two dives onto a sheet on the floor: the camera keeps looking at a point that slides from where it looked onto the sheet,
  // while its distance shrinks (log) and its pitch turns to straight down
  const dive = (t, t0, t1, tgt, D1, rev) => {
    const k0 = camK(rev ? t1 : t0), u0 = clamp((t - t0) / (t1 - t0)), u = .5 - .5 * Math.cos(Math.PI * (rev ? 1 - u0 : u0)), dirOf = (yw, p) => [Math.sin(yw) * Math.cos(p), -Math.sin(p), Math.cos(yw) * Math.cos(p)];
    const D0 = Math.hypot(tgt[0] - k0.x, tgt[1] - k0.h, tgt[2] - k0.z), d0 = dirOf(k0.yaw, k0.pitch), T0 = [k0.x + D0 * d0[0], k0.h + D0 * d0[1], k0.z + D0 * d0[2]];
    const uT = 1 - Math.pow(1 - u, 5), Tt = [mix(T0[0], tgt[0], uT), mix(T0[1], tgt[1], uT), mix(T0[2], tgt[2], uT)], yw = mix(k0.yaw, 0, u), el = mix(k0.pitch, PD, rev ? sm(clamp(u / .5)) : u), D = Math.exp(mix(Math.log(D0), Math.log(D1), u)), d = dirOf(yw, el);
    return { ...k0, x: Tt[0] - D * d[0], h: Tt[1] - D * d[1], z: Tt[2] - D * d[2], yaw: yw, pitch: el };
  };
  const camP = (t) => {
    if (t > A.orch + .3 && t < A.its + 1.3) return dive(t, A.orch + .3, A.its + 1.3, [SH.X, 0, SH.Z], 5.3);
    if (t > A.withIt + .5 && t < A.does + 1.7) return dive(t, A.withIt + .5, A.does + 1.7, [SH.X, 0, SH.Z + .08], 4.75, true);
    if (t > A.who + .75 && t < A.wb + .25) return dive(t, A.who + .75, A.wb + .25, [CV.X, 0, CV.Z], 5.6);
    return camK(t);
  };
  // ---- the land: c07's workshops plus more toward the horizon; the two sites keep clear
  const clear = (x, z) => !(x > -1450 && x < -250 && z > 3650 && z < 5650) && !(x > -1550 && x < 50 && z > 5750 && z < 7750) && !(x > -1300 && x < -300 && z > 1300 && z < 3900 && Math.abs(x + 800) < 300);
  const EXTRA = (() => { const r = prng(818), L = []; for (let i = 0; i < 900; i++) { const v = r(), Z = 2600 + 46000 * v * v, X = -700 + (r() - .5) * (1.5 * (Z - 1500) + 2600); L.push({ i: 20000 + i, X, Z, u: .55 * (.8 + .45 * r()), seed: r(), yaw: (r() - .5) * .5, rank: r() }); } return L; })();
  const LAND = HOUSES.concat(EXTRA).filter((h) => clear(h.X, h.Z));
  const K1 = [-700, 1500];
  const pairOn = (h) => { const d = Math.hypot(h.X - K1[0], h.Z - K1[1]); return d < 5200 ? -1 : A.scale + .05 + .75 * clamp((d - 5200) / 26000) + .08 * h.rank; };
  const GHOST0 = A.withIt + .45;
  const ghostOf = (h, t) => t > GHOST0 && h.rank >= .12;
  // a pair (mentor + learner) before a workshop: two lights at hand height (and two small figures when near)
  const pairDraw = (g, c, h, t, kf = 1) => {
    const px = h.X + 62 * h.u, pz = h.Z - 30 * h.u, p = c.P(px, 14, pz); if (!p) return;
    const ps = c.F / p[2]; if (p[0] < -40 || p[0] > W + 40 || p[1] < -40 || p[1] > H + 40) return;
    const on = t >= pairOn(h) ? clamp((t - pairOn(h)) / .1) : 0, ghost = ghostOf(h, t), dx = 6.5 * ps;
    if (ps * 20 > 15) { const f0 = c.P(px - 6.5, 0, pz), f1 = c.P(px + 6.5, 0, pz); if (f0 && f1) { miniFig(g, f0[0], f0[1], ps * 19, .5, false); miniFig(g, f1[0], f1[1], ps * 16, .45, true); } }
    const R0 = clamp(ps * 10, 11, 64) * kf; if (R0 < .8) return;
    for (const sd of [-1, 1]) {
      const x = p[0] + sd * Math.max(dx, R0 * .3), y = p[1] + (sd > 0 ? 1.2 * ps : 0);
      if (ghost) { g.save(); g.strokeStyle = rgba('#a8642c', .85); g.lineWidth = Math.max(1.3, R0 * .07); g.setLineDash([Math.max(1.6, R0 * .12), Math.max(1.6, R0 * .12)]); g.beginPath(); g.arc(x, y, R0 * .42, 0, TAU); g.stroke(); g.restore(); continue; }
      if (on <= 0) { g.fillStyle = rgba(DAY.ink, .55); g.fillRect(x - .8, y - .8, 1.6, 1.6); continue; }
      const R = R0 * (.5 + .5 * on); g.drawImage(LAMP, x - R, y - R, 2 * R, 2 * R);
    }
  };
  // ---- streams (world [X,Z] polylines)
  const S1 = [[C1.X, C1.Z - 2], [-878, 5040], [-872, 4930]];
  const B1 = [[-872, 4930], [-900, 4850], [-950, 4770], [-985, 4720], [-1000, 4690], [-1005, 4662]];
  const N1 = [[-872, 4930], [-830, 4890], [-740, 4860], [-600, 4870], [-380, 4930], [-100, 5050], [300, 5250], [900, 5600], [1800, 6200]];
  const S2 = [[C2.X, C2.Z - 2], [-650, 7100], [-592, 6950], [-581, 6830]];
  const R2 = [[-581, 6812], [-560, 6700], [-450, 6560], [-250, 6450], [100, 6350], [700, 6250]];
  const L2 = [[-581, 6812], [-610, 6700], [-720, 6560], [-900, 6400], [-1080, 6250], [-1165, 6165]];
  const GOLD = { col: '#f0c063', edge: '#a8742c', core: '#fff4d2' }, COLD = { col: '#9fb3c8', edge: '#5f7590', core: '#eef4fa' };
  const swing = (t) => sm(clamp((t - A.decide - .1) / 1.6));        // the stream turns from the right arm to the left
  // ---- the learning room's practising figure and its fireflies (screen space at its hand)
  const handOf = (t) => {
    if (t < A.first + .05) return { pose: 'stand', from: 'stand', u: 1 };
    if (t < A.thenOrch + .45) return { pose: 'handHalf', from: 'stand', u: eoutX(clamp((t - A.first - .05) / .5)) };
    const r = sm(clamp((t - A.thenOrch - .45) / .4)); if (r < 1) return { pose: 'handRaised', from: 'handHalf', u: r };
    const sw = clamp((t - A.orch) / .3) * .5 * (1 + Math.sin((t - A.orch) * 4.2 - Math.PI / 2));
    return { pose: 'handFlat', from: 'handRaised', u: sw };
  };
  const ROOMF = (() => { const r = prng(4411), L = []; for (let i = 0; i < 45; i++) L.push({ i, ph: r() * TAU, sp: .8 + r() * .6, d: r(), row: i < 5 ? -1 : Math.floor((i - 5) / 10), col: i < 5 ? i : (i - 5) % 10 }); return L; })();
  const arriveAt = (f) => f.i === 0 ? A.first + .02 : f.i < 5 ? A.thenFive + .02 + (f.i - 1) * .07 : A.thenOrch + .05 + (f.i - 5) * .016;
  const roomFlies = (ctx, t, c, hand, fu) => {
    if (!hand || t > A.its + 2.5) return;
    const sweep = clamp((t - A.orch) / .3) * Math.sin((t - A.orch) * 4.2) * 2.6 * fu;
    for (const f of ROOMF) {
      const t0 = arriveAt(f); if (t < t0) continue;
      const a = eoutX(clamp((t - t0) / .55));
      let tx, ty;
      if (f.i === 0 && t < A.thenFive + .3) { const an = (t - A.one) * TAU / .9, orb = clamp((t - A.one + .05) / .2); tx = hand[0] + 5 * fu + Math.cos(an) * 4 * fu * orb; ty = hand[1] - 5 * fu + Math.sin(an) * 2.6 * fu * orb; }
      else if (f.row < 0 && t < A.thenOrch + .3) { tx = hand[0] + (6 + f.col * 3.4) * fu; ty = hand[1] - (5 + 2.2 * Math.sin(f.col * 1.3)) * fu + Math.sin(t * 2.4 + f.ph) * .8 * fu; }
      else { const row = f.row < 0 ? 0 : f.row + 1, col = f.row < 0 ? f.col * 2 : f.col; tx = hand[0] + (9 + col * 3.3) * fu + sweep * (1 - .15 * row); ty = hand[1] + (-9 + row * 4.2) * fu + Math.abs(col - 4.5) * .45 * fu + Math.sin(t * 2 + f.ph) * .5 * fu; }
      const sx = mix(W + 120 + 300 * f.d, tx, a), sy = mix(-80 + 300 * f.d, ty, a);
      dayFly(ctx, t, { x: sx, y: sy, s: clamp(fu * .085, .6, 2.1), seed: 60 + f.i, glow: .9, trail: a < 1 ? [[mix(sx, W + 200, .12), mix(sy, -100, .12)], [sx, sy]] : null });
    }
  };
  // ---- the falling sheet → the memo on the floor
  const sheetPose = (t) => {
    const u = clamp((t - A.orch - .3) / .65), e = 1 - (1 - u) * (1 - u);
    const r = SH.rot + .4 * Math.sin(u * 7) * (1 - u), th = u >= 1 ? 0 : mix(1.2, 0, sm(u)) + .22 * Math.sin(u * 9) * (1 - u);
    const C = [SH.X + 3 * Math.sin(u * 8) * (1 - u), mix(30, .03, e), SH.Z];
    const ex = [Math.cos(r), 0, Math.sin(r)], ez = [-Math.sin(r), 0, Math.cos(r)], ey = [-Math.cos(th) * ez[0], -Math.sin(th), -Math.cos(th) * ez[2]];
    return { C, ex, ey, on: t > A.orch + .3 };
  };
  const memoState = (t) => {
    const flip = sm(clamp((t - A.turned) / .75));
    return { x: 410, y: 530, s: 1, type: 1, underline: 1, source: 1, flip, lift: Math.sin(Math.PI * flip) * 40, backA: clamp((t - A.notWhat - .05) / .9), strike: clamp((t - A.instead - .02) / .45),
      backB: clamp((t - A.butWhat - .05) / .8), gold: clamp((t - A.withIt - .02) / .5) };
  };
  // ---- the firefly from the horizon (7.23) → the corner of the report (8.01)
  const CORNER = [CV0.X + 2.25, CV0.Z - .03];
  const ffPos = (t) => {
    const p0 = [-420, 110, 12500], p1 = [-760, 80, 9000], p2 = [-1150, 26, 6260], p3 = [CORNER[0], .12, CORNER[1]], p4 = [CORNER[0] + .3, 1.6, CORNER[1] - .2];
    const L = (a, b, u) => [mix(a[0], b[0], u), mix(a[1], b[1], u), mix(a[2], b[2], u)];
    if (t < A.who) return L(p0, p1, sm(clamp((t - (A.who - .55)) / .55)));
    if (t < A.who + .3) return [p1[0] + Math.sin(t * 5) * 4, p1[1] + Math.cos(t * 4) * 3, p1[2]];
    if (t < A.wb - .6) return L(p1, p2, sm(clamp((t - A.who - .3) / (A.wb - .6 - A.who - .3))));
    if (t < A.answer - .1) { const u = sm(clamp((t - (A.wb - .6)) / .95)); const q = L(p2, p3, u); q[1] += Math.sin(Math.PI * u) * 6; return q; }
    return L(p3, p4, sm(clamp((t - A.answer + .1) / .8)));
  };
  // ---- figures in the world: screen position, scale, foreshortening
  const figAt = (c, X, Z, Hw) => { const f = c.P(X, 0, Z), hd = c.P(X, Hw, Z); if (!f || !hd) return null; const s = c.F * Hw / f[2] / 185; return [f[0], f[1], s, clamp((f[1] - hd[1]) / (s * 185), .05, 1.2)]; };
  // standing figures: drawn upright (foreshortened); in steep views they fold down into a small top view (shoulders + head)
  const upright = (g, f, fn, cam) => {
    const kp = 1 - sm(clamp(((cam ? cam.pitch : 0) - .95) / .3));
    if (kp > .02) { g.save(); g.translate(f[0], f[1]); g.scale(1, f[3] * kp); g.translate(-f[0], -f[1]); fn(); g.restore(); }
    if (kp < 1) { const u = f[2] * 185 / 18 * (1 - kp); g.save(); g.fillStyle = '#1c2034'; g.beginPath(); g.ellipse(f[0], f[1], 2.7 * u, 1.5 * u, 0, 0, TAU); g.fill(); g.fillStyle = '#17111a'; g.beginPath(); g.arc(f[0] + .3 * u, f[1] - .2 * u, 1 * u, 0, TAU); g.fill(); g.restore(); }
  };
  let PFP = null, TFP = null;
  const extras = (t, c) => {
    const L = [];
    L.push({ X: C1.X, Z: C1.Z, draw: (g, cam) => facade(g, cam, C1.X, C1.Z, C1.u, (gg, sc) => companyHall(gg, 1.1 / sc, t, { door: clamp((t - A.companies + .1) / .3) }), { r: 200, L: 120 }) });
    L.push({ X: C2.X, Z: C2.Z, draw: (g, cam) => facade(g, cam, C2.X, C2.Z, C2.u, (gg, sc) => companyHall(gg, 1.1 / sc, t, { door: 1 }), { r: 200, L: 120 }) });
    L.push({ X: ROOM.X, Z: ROOM.Zb, draw: (g, cam) => facade(g, cam, ROOM.X, ROOM.Zb, ROOM.u, (gg, sc) => learnRoom(gg, 1.1 / sc, { part: 'back' }), { r: 150 }) });
    L.push({ X: ROOM.X, Z: ROOM.Zf, near: 2, draw: (g, cam) => facade(g, cam, ROOM.X, ROOM.Zf, ROOM.u, (gg, sc) => learnRoom(gg, 1.1 / sc, { part: 'front' }), { r: 150 }) });
    L.push({ X: WEIR.X, Z: WEIR.Z, draw: (g, cam) => facade(g, cam, WEIR.X, WEIR.Z, WEIR.u, (gg, sc) => {
      const wa = 2.6 * sm(clamp((t - A.decide - .04) / 1.0)), lw = 1.1 / sc; weirWall(gg, lw, t, { wheel: wa, gate: sm(clamp((t - A.decide) / 1.0)) });
      [-110, -80, -48, -16].forEach((x, i) => figureFlat(gg, x, -46 - 92 * .17, .17, { head: .05 * Math.sin(i * 2), sh: [.2 + .1 * i % .3, .1], el: [.4, .3], hair: ['short', 'bun', 'grey', 'short'][i] }, { t, seed: 90 + i, col: '#2a2420', fast: true, shadow: false, flip: i % 2 === 1 }));
      const tw = sm(clamp((t - A.decide - .04) / 1.0)); figureFlat(gg, 40, -46 - 92 * .17, .17, { lean: .08, sh: [1.45 + .25 * Math.sin(tw * Math.PI * 2), .3], el: [.2, .3] }, { t, seed: 95, col: '#2a2420', fast: true, shadow: false });
    }, { r: 170 }) });
    // the practising figure + two more at the back (each with a small swarm)
    L.push({ X: PF.X, Z: PF.Z, draw: (g, cam) => { const f = figAt(cam, PF.X, PF.Z, 20); if (!f || f[2] * 185 < 6 || f[0] < -300 || f[0] > W + 300) { PFP = null; return; } const hp = handOf(t);
      upright(g, f, () => { PFP = conductor(g, t, f[0], f[1], f[2], { view: 'profile', pose: hp.pose, from: hp.from, u: hp.u, flip: false, seed: 51, glow: 0 }); }, cam); PFP = { ...PFP, fu: f[2] * 185 / 20 }; } });
    for (const [X, Z, fl, sd] of [[-1100, 4664, false, 52], [-1128, 4660, true, 53]]) L.push({ X, Z, draw: (g, cam) => { const f = figAt(cam, X, Z, 19); if (!f || f[2] * 185 < 6 || f[0] < -300 || f[0] > W + 300) return;
      upright(g, f, () => { const r = conductor(g, t, f[0], f[1], f[2], { view: 'profile', pose: 'handHalf', flip: fl, seed: sd, glow: 0 }); const fu = f[2] * 185 / 19;
        for (let k = 0; k < 3; k++) { const ph = t * (1.2 + k * .2) + k * 2 + sd; dayFly(g, t, { x: r.hand[0] + (fl ? -1 : 1) * (3 + 1.5 * Math.sin(ph)) * fu, y: r.hand[1] - (2.5 + Math.cos(ph * 1.3)) * fu, s: clamp(fu * .07, .5, 1.6), seed: k + sd, glow: .8 }); } }, cam); } });
    // the trained figure (7.22): sure hand up, empty air; on "instruments" it grasps the void
    L.push({ X: TF.X, Z: TF.Z, draw: (g, cam) => { const f = figAt(cam, TF.X, TF.Z, 19.5); if (!f || f[2] * 185 < 6 || f[0] < -300 || f[0] > W + 300) return;
      const up = eoutX(clamp((t - A.trained) / .55)), gr = clamp((t - A.instr - .02) / .28), back = sm(clamp((t - A.instr - .35) / .6));
      const P = gr <= 0 ? { pose: up > 0 ? 'handRaised' : 'stand', from: 'stand', u: up } : back <= 0 ? { pose: 'point', from: 'handRaised', u: eoutX(gr) } : { pose: 'handHalf', from: 'point', u: back };
      upright(g, f, () => { TFP = conductor(g, t, f[0], f[1], f[2], { view: 'profile', pose: P.pose, from: P.from, u: P.u, flip: false, seed: 57, glow: 0 }); }, cam); } });
    return L;
  };
  const after = (t, c) => (h, sx, sy, s) => { if (s * 240 >= 7) pairDraw(CTX, c, h, t); };
  const DRAWN = new Set(); let CTX = null;

  const drawP = (ctx, t) => {
    const c = mkCam(camP(t)); CTX = ctx; DRAWN.clear(); PFP = null;
    // ground, sky
    ctx.save(); paperGround(ctx, 0, 0, W, H, { tone: DAY.paper, light: [W * .3, Math.max(0, c.horizon)], grain: .8 }); ctx.restore();
    if (c.horizon > -30) { skyDayDusk(ctx, t, c, { sun: [.19, 620, .7] }); horizonHills(ctx, c, '#e6cf9f', { edge: rgba(DAY.ink, .45) }); }
    hedges(ctx, c, rgba(DAY.ink, .16));
    // the streams
    if (t > A.companies) {
      ribbon(ctx, t, c, S1, { w: 40, ...GOLD, u: eoutX(clamp((t - A.companies - .15) / 1.0)) });
      ribbon(ctx, t, c, B1, { w: (f) => mix(34, 22, f), ...GOLD, u: clamp((t - A.savings + .1) / (A.learn - A.savings + .1)) });
      ribbon(ctx, t, c, N1, { w: 7, ...COLD, coreW: 1.6, flow: 60, u: clamp((t - A.savings - .2) / 2.2) });
    }
    if (t > A.does) {
      const sw = swing(t);
      ribbon(ctx, t, c, S2, { w: 40, ...GOLD });
      ribbon(ctx, t, c, R2, { w: (f) => mix(30, 5, clamp((sw * 1.3 - f) / .3)), ...GOLD });
      ribbon(ctx, t, c, L2, { w: (f) => mix(5, 30, clamp((sw * 1.3 - f) / .3)), ...GOLD });
    }
    // the land (houses depth-sorted with the sites and their figures), the pairs
    houses(ctx, t, c, { list: LAND, day: true, lit: () => .4, after: after(t, c), extra: extras(t, c) });
    const kf = sm(clamp((c.h - 30) / 150));
    if (kf > 0) for (const h of LAND) { const q = c.toC(h.X, 0, h.Z); if (q[2] >= 30 && c.F * h.u / q[2] * 240 < 7) pairDraw(ctx, c, h, t, kf); }   // the far pairs (only from high up: nothing near to hide them)
    // the memo (falls 7.16, lies on the floor 7.17–7.19)
    if (t > A.orch + .3 && t < A.nobody + 1) { const sp = sheetPose(t), st = memoState(t); quad3(ctx, c, sp.C, sp.ex, sp.ey, SH.w, SH.h, (g) => { g.scale(.003, .003); paperMemo(g, t, st); }); }
    // the report at the trained figure's feet; opens on "answer"; its plate shows the first frame of F
    if (t > A.boards) quad3(ctx, c, [CV.X, .02, CV.Z], [1, 0, 0], [0, 0, -1], CV.w, CV.h, (g) => { g.scale(.003, .003);
      reportCover(g, t, { x: 0, y: 0, w: 760, h: 980, open: clamp((t - A.answer - .02) / .75), seed: 12, page: (pg) => { pg.save(); pg.beginPath(); pg.rect(PL.x, PL.y, PL.w, PL.h); pg.clip(); pg.translate(PL.x, PL.y); pg.scale(PL.w / W, PL.h / H); drawF(pg, t, true); pg.restore();
        pg.strokeStyle = rgba(INK.ink, .7); pg.lineWidth = 2; pg.strokeRect(PL.x - 6, PL.y - 6, PL.w + 12, PL.h + 12); pg.lineWidth = .8; pg.strokeRect(PL.x - 11, PL.y - 11, PL.w + 22, PL.h + 22); } });
      if (t < A.answer + 1.5) inkText(g, 'WORLD BANK, WORLD DEVELOPMENT REPORT 2026', 0, 980 + 44, { size: 22, font: 'caps', u: clamp((t - A.wb - .3) / .6), color: rgba(INK.ink, .75) });
    });
    // the room's fireflies
    if (t > A.first - .1 && PFP) roomFlies(ctx, t, c, PFP.hand, PFP.fu);
    // the firefly from the horizon
    if (t > A.who - .55 && t < SW) { const q = ffPos(t), p = c.P(q[0], q[1], q[2]); if (p) { const tr = []; for (let k = 6; k >= 0; k--) { const qq = ffPos(t - .04 * k), pp = c.P(qq[0], qq[1], qq[2]); if (pp) tr.push([pp[0], pp[1]]); } dayFly(ctx, t, { x: p[0], y: p[1], s: clamp(c.F * .3 / p[2], 1.0, 2.4), seed: 77, glow: 1.2, trail: tr.length > 2 ? tr : null }); } }
  };

  // ================================================================ F: the flat engraving (camera on a plane; ground y = 0)
  const PH = { x: 30, s: .95 };
  const STALLS = [{ x: -470, seed: .21 }, { x: -300, seed: .47 }, { x: 260, seed: .63 }, { x: 430, seed: .88 }].map((b, i) => ({ ...b, y: 0, s: 3.0, t0: SW + .35 + [2, 0, 1, 3][i] * .17 }));
  const popAt = (t, t0) => { const u = (t - t0) / .34; if (u <= 0) return 0; return Math.min(1.04, eoutX(u) * 1.04) - .04 * clamp((u - 1) / .5); };
  // pan: Hermite through (t, x, v)
  const PK = [[A.basic + .35, 40, 0], [A.market + .25, 1250, 1000], [A.farm + .2, 2600, 900], [A.workshop + .3, 3800, 500], [A.ha - .05, 4250, 0]];
  const panX = (t) => { if (t <= PK[0][0]) return PK[0][1]; for (let i = 1; i < PK.length; i++) { const [t0, p0, v0] = PK[i - 1], [t1, p1, v1] = PK[i]; if (t > t1) continue; const h = t1 - t0, s = (t - t0) / h, s2 = s * s, s3 = s2 * s; return (2 * s3 - 3 * s2 + 1) * p0 + (s3 - 2 * s2 + s) * h * v0 + (-2 * s3 + 3 * s2) * p1 + (s3 - s2) * h * v1; } return PK[PK.length - 1][1]; };
  const MT = { x: 1250 }, FA = { x: 2600 }, WS = { x: 4000, s: 1.6 }, ROOF = { x: WS.x, y: -87 * WS.s };
  const camA = camKeys([
    { t: SW, x: 0, y: -173, k: 1.5 },
    { t: A.small + 1.0, x: 20, y: -160, k: 1.6 },
    { t: A.picture - .1, x: 30, y: -150, k: 1.66 },
    { t: A.basic + .2, x: 40, y: -333, k: .9 },
  ]);
  const Z0 = A.inWork - .45, Z1 = A.ha - .12, KEND = 2.6;
  const cam2 = (t) => {
    if (t <= A.basic + .35) return camA(Math.max(t, SW));
    const pan = { x: panX(t), y: -333, k: .9 }; if (t <= Z0) return pan;
    const e = sm(clamp((t - Z0) / (Z1 - Z0))), k = Math.exp(mix(Math.log(.9), Math.log(KEND), e));
    const sp = S(pan, ROOF.x, ROOF.y), sx = mix(sp[0], W / 2, e), sy = mix(sp[1], 600, e);
    return { x: ROOF.x - (sx - W / 2) / k, y: ROOF.y - (sy - H / 2) / k, k };
  };
  const duskF = (t) => sm(clamp((t - A.picture + .1) / 1.0));
  // the orchestra slots (world) around the raised phone
  const ORCH = (() => { const L = [], cnt = [9, 12, 14, 16, 18], r = prng(919); cnt.forEach((n, ri) => { for (let j = 0; j < n; j++) { const a = -Math.PI + .2 + (Math.PI - .4) * (j + .5) / n; L.push({ ri, a, R: 240 + ri * 70, d: r(), ph: r() * TAU }); } }); return L; })();
  const TOWN = [{ x: -330, y: -46, s: .55 }, { x: -120, y: -52, s: .48 }, { x: 290, y: -48, s: .52 }, { x: 470, y: -54, s: .45 }, { x: -480, y: -8, s: .72 }, { x: 360, y: -6, s: .75 }];
  const FARMF = (() => { const r = prng(515), L = []; for (let i = 0; i < 14; i++) L.push({ x: (r() - .5) * 760, y: -40 - r() * 60, ph: r() * TAU, d: r() }); return L; })();
  const WSF = (() => { const r = prng(616), L = []; for (let i = 0; i < 7; i++) L.push({ a: r() * TAU, sp: .9 + r() * .8, rr: .6 + r() * .4 }); return L; })();

  // inside the report (inPage) the same drawing is mapped onto the plate; nothing here may reset the transform
  const drawF = (ctx, t, inPage) => {
    const cm = cam2(t), k = cm.k, du = inPage ? 0 : duskF(t);
    const hw = W / 2 / k + 40, hh = H / 2 / k + 40;
    // paper, far hills (parallax), the ground line
    ctx.save(); toPlane(ctx, cm);
    paperGround(ctx, cm.x - hw, cm.y - hh, hw * 2, hh * 2, { tone: '#f1eadb', light: [cm.x - hw * .4, cm.y - hh], grain: .9 });
    ctx.strokeStyle = rgba(INK.ink, .28); ctx.lineWidth = 1.1 / k; ctx.beginPath();
    for (let x = Math.floor((cm.x - hw) / 20) * 20; x <= cm.x + hw; x += 20) { const xx = x + cm.x * .45, y = -38 - 22 * Math.sin(xx * .004) - 14 * Math.sin(xx * .011 + 1); x === Math.floor((cm.x - hw) / 20) * 20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.stroke();
    ctx.strokeStyle = rgba(INK.ink, .8); ctx.lineWidth = 1.6 / k; ctx.beginPath(); ctx.moveTo(cm.x - hw, 0); ctx.lineTo(cm.x + hw, 0); ctx.stroke();
    ctx.strokeStyle = rgba(INK.ink, .3); ctx.lineWidth = 1 / k; ctx.beginPath(); for (let x = Math.floor((cm.x - hw) / 9) * 9; x < cm.x + hw; x += 9) { ctx.moveTo(x, 4); ctx.lineTo(x - 6, 12); } ctx.stroke();
    // 8.02 the market: dashed sketches on the page, then the stalls stand up
    for (const b of STALLS) {
      const p = popAt(t, b.t0);
      if (p <= 0) { ctx.save(); ctx.setLineDash([6 / k, 5 / k]); ctx.strokeStyle = rgba(INK.ink, .5); ctx.lineWidth = 1.2 / k; ctx.strokeRect(b.x - 26 * b.s, -40 * b.s, 52 * b.s, 40 * b.s); ctx.beginPath(); ctx.moveTo(b.x - 29 * b.s, -36 * b.s); ctx.lineTo(b.x + 29 * b.s, -46 * b.s); ctx.stroke(); ctx.restore(); continue; }
      stallDetail(ctx, t, b, p, k, { sway: 1 });
    }
    // 8.04 the market town
    if (cm.x + hw > MT.x - 700) {
      for (const hs of TOWN) { const x = MT.x + hs.x; ctx.save(); ctx.translate(x, hs.y); ctx.scale(hs.s, hs.s); dayHouse(ctx, t, .7, { lw: 1.1 / (k * hs.s), detail: k * hs.s > .3 }); ctx.restore(); }
      stallDetail(ctx, t, { x: MT.x, y: 0, s: 2.6, seed: .33 }, 1, k, { sway: 1 });
    }
    // 8.05 the farm: rows receding up the page, farm green
    if (cm.x + hw > FA.x - 500 && cm.x - hw < FA.x + 500) {
      for (let ri = 5; ri >= 0; ri--) { const y = -ri * 17, s = Math.pow(.88, ri), x0 = FA.x - 460, x1 = FA.x + 460;
        ctx.strokeStyle = rgba('#7a5a3a', .55); ctx.lineWidth = 1.2 / k; ctx.beginPath(); ctx.moveTo(x0, y + 2); ctx.lineTo(x1, y + 2); ctx.stroke();
        ctx.fillStyle = '#5f8f6a'; ctx.strokeStyle = rgba(INK.ink, .7); ctx.lineWidth = .9 / k;
        ctx.beginPath(); for (let x = x0 + (ri % 2) * 14; x < x1; x += 30 * s) { for (let q = 0; q < 3; q++) { const an = -Math.PI / 2 + (q - 1) * .55 + .1 * Math.sin(t * 1.5 + x * .05); const ex = x + Math.cos(an) * 11 * s, ey = y + Math.sin(an) * 11 * s; ctx.moveTo(ex + 13 * s * Math.cos(an), ey + 13 * s * Math.sin(an)); ctx.ellipse(ex, ey, 13 * s, 4.6 * s, an, 0, TAU); } } ctx.fill(); ctx.stroke(); }
    }
    // 8.06 the workshop, open at the front
    if (cm.x + hw > WS.x - 400) {
      inkWorkshop(ctx, WS.x, 0, WS.s);
      const ox = WS.x - 70 * WS.s, oy = -62 * WS.s, ow = 120 * WS.s, oh = 56 * WS.s;
      const g = ctx.createLinearGradient(0, oy, 0, 0); g.addColorStop(0, '#f6dfae'); g.addColorStop(1, '#e9c27e'); ctx.fillStyle = g; ctx.fillRect(ox, oy, ow, oh);
      ctx.strokeStyle = INK.ink; ctx.lineWidth = 1.4 / k; ctx.strokeRect(ox, oy, ow, oh);
      ctx.fillStyle = '#c9a46a'; ctx.fillRect(WS.x - 30 * WS.s, -22 * WS.s, 60 * WS.s, 4 * WS.s); ctx.strokeRect(WS.x - 30 * WS.s, -22 * WS.s, 60 * WS.s, 4 * WS.s);
      ctx.beginPath(); ctx.moveTo(WS.x - 26 * WS.s, -18 * WS.s); ctx.lineTo(WS.x - 26 * WS.s, 0); ctx.moveTo(WS.x + 26 * WS.s, -18 * WS.s); ctx.lineTo(WS.x + 26 * WS.s, 0); ctx.stroke();
    }
    ctx.restore();
    // ---- screen-space figures and lights (frame coordinates)
    const at = (x, y) => S(cm, x, y);
    // the vendors at two stalls and the figure with the phone
    for (const [b, fl, sd] of [[STALLS[1], true, 4], [STALLS[3], false, 9]]) { const p = popAt(t, b.t0 + .12); if (p <= 0) continue; const [sx, sy] = at(b.x + (fl ? 70 : -70), 0), s = .82 * k;
      ctx.save(); ctx.translate(sx, sy); ctx.scale(1, p); ctx.translate(-sx, -sy); vendorDraw(ctx, t, sx, sy - 92 * s, s, { seed: sd, flip: fl, phone: false }); ctx.restore(); }
    let phone = null;
    { const p = popAt(t, SW + 1.25); if (p > 0) { const [sx, sy] = at(PH.x, 0), s = PH.s * k, ru = eoutX(clamp((t - A.picture - .05) / .55));
      const pose = { sh: [mix(.62, 2.45, ru), .5], el: [mix(1.15, .35, ru), 1.2], head: mix(.28, -.3, ru), hair: 'short' };
      ctx.save(); ctx.translate(sx, sy); ctx.scale(1, p); ctx.translate(-sx, -sy); const r = vendorDraw(ctx, t, sx, sy - 92 * s, s, { seed: 7, flip: false, pose, accent: '#c9893f' }); ctx.restore(); if (p >= 1) phone = r.phone; } }
    // 8.04 the town's little orchestra over its stall; on "market" it draws an arc
    if (t > A.inMarket - 1.6 && t < A.farm + 1) {
      const c0 = at(MT.x, -130), R = 150 * k, au = clamp((t - A.market) / .8);
      if (au > 0) { ctx.save(); ctx.strokeStyle = rgba('#e9b85a', .85); ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(c0[0], c0[1], R, Math.PI, Math.PI + Math.PI * eoutX(au)); ctx.stroke(); ctx.restore(); }
      for (let i = 0; i < 8; i++) { const a = Math.PI + Math.PI * clamp(eoutX(au) - i * .04, 0, 1), hov = au <= 0 ? [Math.cos(t * 1.4 + i) * 40 * k, Math.sin(t * 1.9 + i * 2) * 14 * k] : [0, 0];
        const x = au <= 0 ? c0[0] + (i - 3.5) * 22 * k + hov[0] : c0[0] + Math.cos(a) * R, y = au <= 0 ? c0[1] + 60 * k + hov[1] : c0[1] + Math.sin(a) * R;
        dayFly(ctx, t, { x, y, s: 1.3 * k / .9, seed: 120 + i, glow: 1, night: du * .7 }); }
    }
    // 8.05 the farm's fireflies lift on "farm"
    if (t > A.onFarm - 1.6 && t < A.oneP + 1) { const lu = eoutX(clamp((t - A.farm - .02) / .9)); for (const f of FARMF) { const [x, y] = at(FA.x + f.x + Math.sin(t * 1.3 + f.ph) * 16, f.y - 150 * lu * (.7 + .5 * f.d) + Math.cos(t * 1.7 + f.ph) * 6); dayFly(ctx, t, { x, y, s: 1.2 * k / .9, seed: 140 + f.ph, glow: 1, night: du * .7 }); } }
    if (t > A.onFarm - 1.6 && t < A.oneP + 1) { const [sx, sy] = at(FA.x - 60, -26), s = .78 * k; figureFlat(ctx, sx, sy - 92 * s, s, { lean: .1, sh: [.9, .3], el: [.6, .5], hair: 'curly' }, { t, seed: 33, col: '#2c2522', accent: '#5f8f6a', accentPart: 'sweater', fast: true }); }
    // 8.06 the one person at the bench, fireflies around it
    if (t > A.inWork - 1.6) {
      const ox = WS.x - 70 * WS.s, oy = -62 * WS.s, a0 = at(ox, oy), a1 = at(ox + 120 * WS.s, 0);
      ctx.save(); ctx.beginPath(); ctx.rect(a0[0], a0[1], a1[0] - a0[0], a1[1] - a0[1]); ctx.clip();
      const [fx, fy] = at(WS.x - 46 * WS.s, 0), s = .29 * k, ru = sm(clamp((t - A.oneP) / .5));
      conductor(ctx, t, fx, fy, s, { view: 'profile', pose: ru > 0 ? 'handRaised' : 'handHalf', from: 'handHalf', u: ru, flip: false, seed: 66, glow: 0 });
      const bc = at(WS.x, -34 * WS.s);
      for (const f of WSF) { const an = f.a + t * f.sp; dayFly(ctx, t, { x: bc[0] + Math.cos(an) * 38 * WS.s * k * f.rr, y: bc[1] + Math.sin(an) * 12 * WS.s * k * f.rr - 6 * k, s: clamp(1.1 * k / .9, .6, 2.4), seed: 150 + f.a, glow: 1, night: du * .6 }); }
      ctx.restore();
    }
    // dusk (8.03 on): the light over the page turns
    if (du > 0) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, rgba('#2c2550', .5 * du)); g.addColorStop(.45, rgba('#a86a80', .26 * du)); g.addColorStop(1, rgba('#3a2a3a', .2 * du)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    // the small firefly rising from the phone (8.02) and the orchestra (8.03)
    if (phone && t > A.simple - .05) {
      const head = at(PH.x, -120), ou = (i) => eoutX(clamp((t - (A.picture + .5 + i * .022)) / .75));
      if (du > 0) glow(ctx, 'dawn', head[0], head[1] - 230 * k, 620 * k, .2 * du * eoutX(clamp((t - A.orch8) / 1.2)), 'lighter');
      ORCH.forEach((f, i) => {
        const slot = at(PH.x + Math.cos(f.a) * f.R, -120 + Math.sin(f.a) * f.R * .8);
        if (i === 0) { const rise = eoutX(clamp((t - A.simple - .05) / .8)), base = [phone[0] + 6 * k * Math.sin(t * 2.1), phone[1] - mix(4, 70, rise) * k + 4 * Math.cos(t * 1.7)];
          const u = ou(0), x = mix(base[0], slot[0], u), y = mix(base[1], slot[1], u); dayFly(ctx, t, { x, y, s: mix(.5, 1.5, clamp((t - A.simple) / .25)) * k, seed: 200, glow: 1.2, night: du * .8 }); return; }
        const u = ou(i); if (u <= 0) return;
        const P = (uu) => { const c1 = [phone[0] + (slot[0] - phone[0]) * .2, phone[1] - 260 * k]; const v = 1 - uu; return [v * v * phone[0] + 2 * v * uu * c1[0] + uu * uu * slot[0], v * v * phone[1] + 2 * v * uu * c1[1] + uu * uu * slot[1]]; };
        const p = P(u), w = u >= 1 ? [Math.sin(t * 2 + f.ph) * 3, Math.cos(t * 1.6 + f.ph) * 3] : [0, 0];
        dayFly(ctx, t, { x: p[0] + w[0], y: p[1] + w[1], s: (1.1 + .3 * f.d) * k / .9 * .9, seed: 200 + i, glow: 1.1, night: du * .85, trail: u < 1 ? [P(Math.max(0, u - .08)), p] : null });
      });
    }
    // the label (8.02)
    if (!inPage && t > A.small - .1 && t < A.picture + 1) {
      const wipe = 1 - clamp((t - A.picture - .25) / .35), parts = [['SMALL, CHEAP AI', A.small], [' · TEXT MESSAGE', A.text], [' · SIMPLE PHONE', A.simple]];
      let x = 96; for (const [s, t0] of parts) { const w = inkText(ctx, s, x, 150, { size: 34, font: 'caps', alpha: 0 }); inkText(ctx, s, x, 150, { size: 34, font: 'caps', u: clamp((t - t0 + .05) / .5) * wipe }); x += w; }
      inkText(ctx, 'WORLD BANK, WDR 2026', 96, 192, { size: 18, font: 'caps', u: clamp((t - A.small - .35) / .6) * wipe, color: rgba(INK.ink, .7) });
    }
    if (inPage) return;
    // night falls, the roofline becomes the gold line (the c08>c09 plate)
    const front = mix(-480, H + 40, sm(clamp((t - (A.oneP - .6)) / (A.ha - .07 - A.oneP + .6))));
    if (t > A.oneP - .65) nightOver(ctx, t, front, { y: 600 });
    if (t > A.oneP + .05) {
      const mu = sm(clamp((t - A.oneP - .2) / (A.ha - .1 - A.oneP - .2))), gu = eoutX(clamp((t - A.oneP - .05) / .3));
      if (mu >= 1) lineOnly(ctx, t, { y: 600, tone: 'gold' }, 1400);
      else {
        const R = [[-122, -70], [-122, -104], [-61, -70], [-61, -104], [0, -70], [0, -104], [61, -70], [61, -104], [122, -70]], N = 64, pts = [];
        const len = [0]; for (let i = 1; i < R.length; i++) len.push(len[i - 1] + Math.hypot(R[i][0] - R[i - 1][0], R[i][1] - R[i - 1][1]));
        for (let i = 0; i < N; i++) { const q = i / (N - 1), d = q * len[len.length - 1]; let j = 1; while (j < R.length - 1 && len[j] < d) j++; const f = (d - len[j - 1]) / (len[j] - len[j - 1]);
          const lx = mix(R[j - 1][0], R[j][0], f), ly = mix(R[j - 1][1], R[j][1], f), sp = at(WS.x + lx * WS.s, ly * WS.s), tg = [W / 2 - 1400 + 2800 * q, 600 + 2 * Math.sin(t * .9)];
          pts.push([mix(sp[0], tg[0], mu), mix(sp[1], tg[1], mu)]); }
        const n0 = Math.floor((N - 1) / 2 * (1 - gu)), n1 = N - 1 - n0, br = .9 + .1 * Math.sin(t * 2.1);
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        for (const [w, al, cc] of [[26, .05, '#f3d9a0'], [10, .14, '#f3d9a0'], [3.2, .55 * br, '#f3d9a0'], [1.4, .95, '#fff8e6']]) { ctx.strokeStyle = rgba(cc, al); ctx.lineWidth = w; ctx.beginPath(); for (let i = n0; i <= n1; i++) i === n0 ? ctx.moveTo(pts[i][0], pts[i][1]) : ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke(); }
        ctx.restore();
      }
    }
  };

  const draw = (ctx, t) => { if (t < SW) drawP(ctx, t); else drawF(ctx, t, false); };
  const SND = {
    [A.hb]: [{ f: 'shimmer_rings', t: A.scale + .1, v: .25 }],
    [A.companies]: [{ f: 'pour', t: A.companies + .2, v: .25 }],
    [A.first]: [{ f: 'wings', t: A.orch + .05, v: .3 }, { f: 'paper_slide', t: A.orch + .4, v: .3 }],
    [A.its]: [{ f: 'card', t: A.turned + .05, v: .3 }],
    [A.boards]: [{ f: 'lever_switch', t: A.decide + .05, v: .3 }],
    [A.wb]: [{ f: 'pages', t: A.answer + .05, v: .35 }],
    [A.picture]: [{ f: 'bloom', t: A.picture + .55, v: .35 }],
  };
  const PR = HI.print;
  const starts = [A.hb, A.companies, A.first, A.its, A.does, A.boards, A.butEven, A.who, A.wb, A.inits, A.picture, A.inMarket, A.onFarm, A.inWork];
  return starts.map((t0, i) => ({ t: t0, tr: 'cut', d: .1, draw, print: i === starts.length - 1 ? HO.print : PR, sound: SND[t0] }));
};

// a small ink figure (far): head, coat, the arm half raised
function miniFig(ctx, x, y, h, hand, flip) {
  const f = flip ? -1 : 1, s = h / 100; ctx.save(); ctx.translate(x, y); ctx.scale(f * s, s);
  ctx.fillStyle = DAY.ink; ctx.beginPath(); ctx.ellipse(0, -90, 6.5, 7.5, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-8, -80); ctx.lineTo(8, -80); ctx.lineTo(11, -22); ctx.lineTo(-11, -22); ctx.closePath(); ctx.fill();
  ctx.fillRect(-7, -24, 5, 24); ctx.fillRect(2, -24, 5, 24);
  ctx.strokeStyle = DAY.ink; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(6, -76); const a = mix(.25, 2.3, hand), b = a + .5; const ex = 6 + Math.sin(a) * 22, ey = -76 + Math.cos(a) * 22; ctx.lineTo(ex, ey); ctx.lineTo(ex + Math.sin(b) * 20, ey + Math.cos(b) * 20); ctx.stroke();
  ctx.restore();
}
