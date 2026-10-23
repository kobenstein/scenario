// Film 7 · c10 · card III turned: thirty percent protected, the watchman (06c), from the c09>c10 paper plate (card III's window, back up)
// to the c10>c11 dusk sky plate. Builder: c10. ONE continuous take: the table (c09's copy of c04's table, c08's card backs), then the
// camera tilts up into c07's / c11's dusk sky (lib/f7_c10_fork.mjs = c07's fork lib: the S plane seen through a lens) where the ONE Earth
// hangs with the ring and the cool line exactly as c11 draws it; flying toward it = zooming the lens. New pieces: lib/f7_c10_watch.mjs.
// Every accent is anchored to a word (T.S / T.E).
//
// | shot  | VO words (anchor)                                 | image                                                                     | hero light        | camera                                   | flows on by                                   | sound                     |
// |-------|---------------------------------------------------|---------------------------------------------------------------------------|-------------------|------------------------------------------|-----------------------------------------------|---------------------------|
// | 10.01 | Third card. Can something watch over a whole      | out of card III's paper window: WATCHMAN, the engraved watch tower; on    | the tower's beam  | pull out (log height) 1.1 s, hover;      | continuous: the tilt carries the table out of | card (after "Third        |
// |       | planet?                                           | "watch over" its beam starts to turn in the engraving; on "whole planet"  | (in the card)     | tilt up 2.1 s (pchip, c11's keys in      | frame; the dusk sky (c07's lens world) comes  | card."); whoosh_up (after |
// |       |                                                   | we look up: the table drops away, the dusk sky, the Earth with its ring   |                   | reverse)                                 | in behind it (c07/c11's tip, reversed)        | "planet?")                |
// | 10.02 | Nearly every country on Earth has agreed to       | the lens zooms to the Earth (right of frame); "protect … land": green     | the Earth         | lens zoom ×1.63 2.2 s (quart), then a    | continuous                                    | bloom (after "twenty      |
// |       | protect thirty percent of the world's land and    | protected areas grow out of the land, "sea": dashed green zones on the    |                   | slow 4 % push                            |                                               | thirty.")                 |
// |       | sea by twenty thirty. A promise that big needs    | sea; 30 % · OF LAND AND SEA BY 2030 · KUNMING-MONTREAL · 2022; "A promise":|                   |                                          |                                               | eye_open (after "eyes.")  |
// |       | eyes.                                             | twelve satellites emerge from behind the Earth onto three orbits; "eyes": |                   |                                          |                                               |                           |
// |       |                                                   | each front satellite opens a narrow cone of cool light down to the ground |                   |                                          |                                               |                           |
// | 10.03 | Imagine superintelligence as its watchman.        | the cool line brightens; "watchman": a lighthouse beam lights at its foot | the beam          | hold (slow push)                         | continuous                                    | shimmer_rings (after      |
// |       | Reading every satellite image, every day.         | (the hero city) and turns like card III's tower; where it passes, image   |                   |                                          |                                               | "watchman.")              |
// |       |                                                   | tiles flash and stay outlined (read); "every day": the second turn        |                   |                                          |                                               |                           |
// | 10.04 | Spotting a patch of forest cleared in a week. Or  | one tile grows out of the globe into a framed satellite image (callout):  | the marker        | hold                                     | continuous                                    | (no accent: no pause)    |
// |       | a fishing fleet where it shouldn't be.            | a forest; "cleared": a scan refreshes it (WEEK 1 → WEEK 2) and reveals a  |                   |                                          |                                               |                           |
// |       |                                                   | cleared patch, a soft marker rings it; "Or": it sinks back into its tile, |                   |                                          |                                               |                           |
// |       |                                                   | a sea tile grows out: a dashed protected zone, a fleet steams into it, a  |                   |                                          |                                               |                           |
// |       |                                                   | marker rings the fleet                                                    |                   |                                          |                                               |                           |
// | 10.05 | (handoff)                                         | the inset sinks back into its tile; the lens pulls back and lowers our    | the dusk          | zoomTo(V, plate view) 1.4 s (quart)      | the sky IS the plate (lens = plate view)      | whoosh_airy (after "be.") |
// |       |                                                   | gaze: the Earth leaves at the top, the dusk sky remains = plate sky (dusk)|                   |                                          |                                               |                           |
// Changes vs shots.md: 10.01 the camera does not fly into the card's picture; it looks UP from the card into the sky (c07/c11's tilt, so the
// Earth of c10 is the same Earth c11 rises to). 10.02 the Earth is the film's night Earth (the kit has no day side): the protected areas
// are luminous green engraved zones on it. 10.03 the "lighthouse" is literal: the beam turns at the foot of the cool intelligence line
// (the watchman = superintelligence), with the same period as card III's tower. 10.04 the zoom into a tile is a callout: the tile grows out
// of the globe into a framed image (screen space, still while read), so the globe stays in view.
import { W, H, rgba, clamp, lin, mix, sm } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { f7Prepare, ease, EARTH, camO } from '../lib/f7_kit.mjs';
import { TB, ROW, tcam, camKeys, tableTop, beam as spotBeam, windowCam, apply, cardFaceM } from '../lib/f7_c09_table.mjs';
import { ANSWERS, backPrepare, turnCard, boxM, BOX } from '../lib/f7_c09_cards.mjs';
import { landInk } from '../lib/f7_c09_land.mjs';
import { label } from '../lib/f7_c09_props.mjs';
import { SP, lensOf, localCam, duskSky, ground, earthDisc } from '../lib/f7_c10_fork.mjs';
import { watchmanAt, patches, sats, beam, tiles, ringOn, coolLine, insetPrepare, inset, FOREST_TILE, SEA_TILE, BEAM } from '../lib/f7_c10_watch.mjs';

const PI2 = Math.PI / 2;
const BACKS = () => ANSWERS.map((a) => ({ num: a.num, img: a.num === 1 ? landInk : a.img, word: a.word, slip: a.slip }));   // = sc09's
const bump = (t, a, b, c, d) => sm(lin(a, b, t)) * (1 - sm(lin(c, d, t)));
const LOGI = (a, b, u) => Math.exp(mix(Math.log(a), Math.log(b), u));
// lens helpers (as c11): the lens that shows Earth E at screen (px, py) with radius r; zoom about a screen point; zoomTo (log zoom, centre in 1/z)
const K0 = EARTH.R * SP.k0;
const lensE = (E, px, py, r) => { const z = r / K0; return { cx: E[0] - (px - W / 2) / z, cy: E[1] - (py - H / 2) / z, z }; };
const about = (l, px, py, f) => { const sx = l.cx + (px - W / 2) / l.z, sy = l.cy + (py - H / 2) / l.z, z = l.z * f; return { cx: sx - (px - W / 2) / z, cy: sy - (py - H / 2) / z, z }; };
const zoomTo = (a, b, u) => { const z = LOGI(a.z, b.z, u), d = 1 / a.z - 1 / b.z, lu = Math.abs(d) < 1e-9 ? u : (1 / a.z - 1 / z) / d; return { cx: mix(a.cx, b.cx, lu), cy: mix(a.cy, b.cy, lu), z }; };

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c10', T);
  const S = (ph, n) => T.S('06c', ph, n), E = (ph, n) => T.E('06c', ph, n);
  const A = {
    third: S('Third card'), cardE: E('Third card'), can: S('Can something'), watch: S('watch over'), whole: S('whole planet'), planetE: E('whole planet'),
    nearly: S('Nearly every'), country: S('country on'), agreed: S('agreed'), protect: S('protect'), thirty: S('thirty percent'), land: S("world's land"), sea: S('and sea'),
    by: S('by twenty'), thirtyE: E('by twenty thirty'), promise: S('A promise'), eyes: S('needs eyes'), eyesE: E('needs eyes'),
    imagine: S('Imagine'), superI: S('superintelligence as'), watchman: S('watchman'), watchmanE: E('its watchman'),
    reading: S('Reading every'), satellite: S('satellite image'), everyDay: S('every day'), dayE: E('every day'),
    spotting: S('Spotting'), patch: S('patch of forest'), cleared: S('cleared'), weekE: E('in a week'),
    or: S('Or a fishing'), fleet: S('fishing fleet'), where: S('where it'), shouldnt: S("shouldn't be"), beE: E("shouldn't be"),
  };
  await f7Prepare(); await insetPrepare();
  const T0 = HI.b, HA = HO.a, tEnd = HA - 1 / 30 - .002;
  await backPrepare(BACKS(), T0);

  // ============================================================== the lens path (S plane)
  const PV = { cx: 960, cy: 540, z: 1 };
  const LA = { cx: 960, cy: -120, z: 1 };                      // the sky at the end of the tilt: the Earth (r 245) above the middle
  const V1 = lensE(SP.C, 1240, 500, 400);
  const tT = A.nearly + .05, tZ0 = tT - .35, tZ1 = A.protect - .15, tE0 = A.where + .05;
  const V1h = (t) => about(V1, 1240, 500, 1 + .04 * ease.sine(lin(tZ1, tE0, t)));
  function lensAt(t) {
    if (t < tZ0) return LA;
    if (t < tZ1) return zoomTo(LA, V1, ease.io(lin(tZ0, tZ1, t)));
    if (t < tE0) return V1h(t);
    return zoomTo(V1h(tE0), PV, ease.io(lin(tE0, tEnd, t)));
  }

  // ============================================================== the table and the tilt up (c11's tip down, reversed)
  const C3 = ROW[2], WC3 = windowCam(C3), lzA = lensOf(LA), p0 = Math.atan((lzA.Y(SP.HZ) - H / 2) / TB.f), hzOf = (p) => H / 2 + TB.f * Math.tan(p);
  const tUp = T0 + 1.1, tTilt = A.whole - .3;
  const UP = [C3.X + .25, 24, C3.Z + .9, -PI2, -C3.rot];
  const KT = [[tTilt, [UP[0], 24.5, UP[2] + .25, -PI2 + .03, UP[4]]], [tTilt + .95, [5, 72, -52, -.6, .01]], [tT, [0, 125, -115, p0, 0]]];
  const camT = (t) => {
    if (t <= tUp) {   // out of card III's window (exact at T0), lateral follows the height
      const u = ease.sine(lin(T0, tUp, t)), hu = Math.exp(mix(Math.log(WC3.y - .03), Math.log(UP[1] - .03), u)) + .03, lu = (hu - WC3.y) / (UP[1] - WC3.y);
      return [mix(WC3.x, UP[0], lu), hu, mix(WC3.z, UP[2], lu), -PI2, mix(WC3.yaw, UP[4], lu)];
    }
    if (t < tTilt) { const u = ease.sine(lin(tUp, tTilt, t)); return [UP[0], mix(UP[1], 24.5, u), mix(UP[2], UP[2] + .25, u), mix(-PI2, -PI2 + .03, u), UP[4]]; }
    return camKeys(t, KT);
  };
  const SPT = { x: 4, z: -6, r: 40, a: 1, warm: .6 };   // c09's last spotlight
  // card III's tower beam: turns from "watch over" on (one turn = BEAM.P, the globe beam's period); −.12 is the printed angle
  const cardAng = (t) => -.12 + (t > A.watch ? (2 * Math.PI / BEAM.P) * (t - A.watch) * (1 - .5 * Math.exp(-(t - A.watch) / .4)) - 0 : 0);

  // ============================================================== the lens world
  const tSat = A.promise - .1, tw = A.watchman + .05;
  const landU = (t) => lin(A.protect - .1, A.land + .3, t), seaU = (t) => lin(A.sea - .1, A.thirtyE + .25, t);
  const eyesU = (t) => ease.out(lin(A.eyes + .05, A.eyesE + .3, t)) * (1 - ease.io(lin(A.watchman - .1, A.watchman + .45, t)));
  const coolBr = (t) => .75 + .6 * bump(t, A.superI - .1, A.superI + .5, A.watchmanE, A.watchmanE + .8);
  const beamLen = (t) => ease.out(lin(tw, tw + .55, t)) * (1 - ease.inn(lin(A.beE - .1, A.beE + .45, t)));
  const beamBr = (t) => 1 - .45 * ease.io(lin(A.spotting - .3, A.spotting + .5, t));
  function lensWorld(ctx, t, lz) {
    duskSky(ctx, t, lz);
    ground(ctx, t, lz);
    const m = camO(localCam(lz, SP.C));
    sats(ctx, t, m, { t0: tSat, side: 'back' });
    const eo = earthDisc(ctx, t, lz, SP.C, {});
    if (!eo.off) {
      patches(ctx, t, m, { land: landU(t), sea: seaU(t) });
      tiles(ctx, t, m, { tw });
      beam(ctx, t, m, { tw, len: beamLen(t), br: beamBr(t) });
    }
    ringOn(ctx, t, m);
    coolLine(ctx, t, m, coolBr(t));
    sats(ctx, t, m, { t0: tSat, side: 'front', eyes: eyesU(t) });
    return m;
  }

  // ============================================================== the shots
  function table(ctx, t) {
    const c = camT(t), cam = tcam({ x: c[0], y: c[1], z: c[2], pitch: c[3], yaw: c[4] }), hz = hzOf(c[3]);
    if (hz > -40) lensWorld(ctx, t, lensOf({ ...lensAt(t), dy: hz - hzOf(p0) }));
    else { ctx.fillStyle = TB.black; ctx.fillRect(0, 0, W, H); }
    tableTop(ctx, t, cam, { spot: SPT });
    for (let i = 0; i < 4; i++) {
      const Ai = turnCard(ctx, t, cam, { ...ROW[i], phi: Math.PI, back: { ...BACKS()[i], plateT: t } });
      if (i === 2 && t > A.watch) {   // card III's engraving, live: the tower's beam turns
        const Ac = Ai || cardFaceM(cam, ROW[2]); if (Ac) {
          const M = boxM(Ac); ctx.save(); apply(ctx, M); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip(); watchmanAt(ctx, cardAng(t)); ctx.restore();
          ctx.save(); apply(ctx, Ac); ctx.strokeStyle = 'rgba(42,36,32,.75)'; ctx.lineWidth = 1.6; ctx.strokeRect(BOX.x, BOX.y, BOX.w, BOX.h); ctx.restore();
        }
      }
    }
    { const sp = SPT, M = cam.flatM(sp.x, sp.z, 0, 1, 30); if (M && cam.pitch < -.3) { ctx.save(); apply(ctx, M); const g = ctx.createRadialGradient(0, 0, sp.r * .55, 0, 0, sp.r * 1.5 + 6); g.addColorStop(0, 'rgba(8,8,14,0)'); g.addColorStop(1, 'rgba(8,8,14,.72)'); ctx.fillStyle = g; ctx.fillRect(-400, -400, 800, 800); ctx.restore(); } }
    spotBeam(ctx, t, cam, { spot: SPT, a: .9 * sm(clamp((-.5 - c[3]) / .5)) });
  }
  function sky(ctx, t) {
    const lz = lensOf(lensAt(Math.min(t, tEnd))), m = lensWorld(ctx, t, lz);
    // the label (screen space, still while read)
    label(ctx, t, '30 %', 'OF LAND AND SEA BY 2030', 130, 250, A.thirty - .1, A.promise + .55, { size: 92, small2: 'KUNMING-MONTREAL · 2022 · 30 BY 30' });
    // the two satellite images, grown out of their tiles on the globe
    const tile = (q) => [m.X(q.x), m.Y(q.y)];
    const fOpen = ease.out(lin(A.spotting - .15, A.spotting + .55, t)) * (1 - ease.inn(lin(A.or - .1, A.or + .4, t)));
    if (fOpen > 0) inset(ctx, t, { kind: 'forest', tile: tile(FOREST_TILE), open: fOpen, x: 120, y: 262, refresh: ease.io(lin(A.cleared - .5, A.cleared + .3, t)), mark: lin(A.cleared + .3, A.cleared + .95, t), label: t < A.cleared - .1 ? 'SATELLITE IMAGE · WEEK 1' : 'SATELLITE IMAGE · WEEK 2' });
    const sOpen = ease.out(lin(A.or + .2, A.or + .85, t)) * (1 - ease.io(lin(tE0 + .4, tEnd - .1, t)));
    if (sOpen > 0) inset(ctx, t, { kind: 'sea', tile: tile(SEA_TILE), open: sOpen, x: 120, y: 262, fleet: lin(A.or + .1, A.where - .1, t), mark: lin(A.where - .2, A.where + .35, t), label: 'PROTECTED SEA' });
  }
  const world = (ctx, t) => (t < tT ? table(ctx, t) : sky(ctx, t));

  const P1 = HI.print, PO = HO.print;
  return [
    { t: T0, tr: 'cut', d: .1, print: P1, draw: world, sound: [{ f: 'card', t: A.cardE + .06, v: .25 }, { f: 'whoosh_up', t: A.planetE + .05, v: .25 }] },
    { t: tT, draw: world, print: PO, sound: [{ f: 'bloom', t: A.thirtyE + .12, v: .22 }, { f: 'eye_open', t: A.eyesE + .04, v: .3 }, { f: 'shimmer_rings', t: A.watchmanE + .05, v: .3 },
      { f: 'whoosh_airy', t: A.beE + .02, v: .28 }] },
  ];
};
