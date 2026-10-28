// Film 14 · B3 · c08 "the glass box" (shots 8.01–8.10) · mountains in the first light, the open glass box (Apertus), vault vs glass,
// the scales. Coordinates: the F0 card IS the plate (plateScale) at the home camera; the near ridge (where the box, the people, the
// vault stand) is a nearer card ZN that drops out of the frame below when the camera cranes home at the end (8.09).
//
// | ID     | anchor (word)                      | picture (one idea)                                                          | moves              | → carrier                |
// |--------|------------------------------------|-----------------------------------------------------------------------------|--------------------|--------------------------|
// | 8.01   | September · Switzerland            | the line from 7.11 draws the near ridge and arrives at a box of light edges: | line · trace       | plan sequence            |
// |        |                                    | the glass box; stamp SEPTEMBER 2025 / SWITZERLAND; the far ridge at dawn     |                    |                          |
// | 8.02   | supercomputing · Apertus           | card: ETH ZURICH · EPFL · CSCS / Apertus, beside the box                     | card rises         | plan sequence            |
// | 8.03 ★ | weights · training data · snapshots| the lid opens; the public file list rises out of the box line by line:       | lid · rows rise    | plan sequence            |
// |        | · public                           | WEIGHTS (the file) · TRAINING DATA · CHECKPOINTS; on "public" it stands lit   |                    |                          |
// | 8.04   | student · journalist · rival lab   | people step up to the box (indigo), you among them (yellow); labels          | people step in     | plan sequence            |
// | 8.05   | thousand · English                 | TRAINING DATA sprays into a map of light points; 1,000+ LANGUAGES; one point | tilt up · count    | the points pour back     |
// |        |                                    | is ENGLISH                                                                  |                    |                          |
// | 8.06   | vault · opposite · glass box       | the vault door rolls in on the left (dark, light in its joints); halves of   | vault rolls in     | plan sequence            |
// |        |                                    | light: closed / open                                                        |                    |                          |
// | 8.07   | checking · sleeper                 | many small lenses circle the box; one stops on the planted flaw (warm)       | lenses circle      | plan sequence            |
// | 8.08   | misuse · change                    | a cool hand lifts a COPY of the file out and bends its lines                 | hand · copy        | plan sequence            |
// | 8.09   | wrong hands · every eye · everyone | crane home: a scale of light grows from the far ridge; vault and box rise    | crane · beam tilts | plan sequence            |
// |        |                                    | onto its pans; eyes: few over the vault, many over the glass; it never rests |                    |                          |
// | 8.10   | argue · right one                  | the eyes close; the scale settles into plateScale (exact at T1 − .5)        | hold with drift    | plate → lead (9.01)      |
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './f13_kit.mjs';
import * as X from './f14_kit.mjs';
import { glassBox, vaultMark, eye, scaleRig, plateAngle } from './f14_b3_glass.mjs';
import { PLATE_SCALE } from './f14_seams.mjs';
import { OA, WB } from './f14_b3_lab.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, rad, lin, drift, prng, card, cardM, project, cam3, F0 } = E;
const rise = (x) => 1 - (1 - clamp(x)) ** 3;

export const ZN = 1300;
const U0 = -300;   // the near ridge starts here (never on screen in c08); the line lands on it here
// the plate's ridge (same seed and formula as lib/f14_seams.mjs), extended off-frame on both sides
const RIDGE = (() => {
  const r = prng(1914), p = []; for (let x = -40; x <= W + 40; x += 60) p.push([x, 860 + 50 * Math.sin(x * .004) + 26 * (r() - .5)]);
  const r2 = prng(77), L = [], R = [];
  for (let x = -100; x >= -1700; x -= 60) L.unshift([x, 860 + 50 * Math.sin(x * .004) + 26 * (r2() - .5) - 60 * Math.exp(-(((x + 900) / 500) ** 2))]);
  for (let x = W + 100; x <= W + 4000; x += 60) R.push([x, 860 + 50 * Math.sin(x * .004) + 26 * (r2() - .5)]);
  return { plate: p, all: [...L, ...p, ...R] };
})();
// the near ridge (card ZN): a gentle rim with a flat shoulder where the box stands
const NR = (() => {
  const r = prng(4242), p = [];
  for (let u = -1400; u <= 3400; u += 40) {
    const flat = 1 - Math.exp(-(((u - 1150) / 230) ** 2));
    p.push([u, 1172 - 80 * Math.exp(-(((u - 250) / 330) ** 2)) - 46 * Math.exp(-(((u - 2000) / 420) ** 2)) + flat * (14 * Math.sin(u * .011) + 10 * (r() - .5))]);
  }
  return p;
})();
export const rimV = (u) => { const i = clamp(Math.floor((u + 1400) / 40), 0, NR.length - 2), f = clamp((u - NR[i][0]) / 40); return lerp(NR[i][1], NR[i + 1][1], f); };
const BOX = { u: 1150, s: 240 }; BOX.v = rimV(BOX.u) + 4;
const VAULT = { u: 420, r: 170 }; VAULT.v = rimV(VAULT.u) - VAULT.r + 6;
const ROWS = ['WEIGHTS', 'TRAINING DATA', 'CHECKPOINTS'];
const PEOPLE = [{ u: 700, kind: 'student', from: -260 }, { u: 870, kind: 'journalist', from: -240 }, { u: 1430, kind: 'lab', from: 260 }, { u: 1610, kind: 'du', from: 280 }];
// the map of light points (8.05): loose continents, ~1,000 points (cached)
const MAP = (() => {
  const r = prng(1000), pts = [], blobs = [[-.62, -.25, .2, .2, 120], [-.52, .3, .1, .26, 90], [-.06, -.36, .1, .08, 70], [.02, .12, .14, .3, 150], [.38, -.25, .34, .2, 260], [.5, .16, .1, .1, 50], [.72, .42, .12, .07, 50], [-.3, -.55, .1, .06, 30], [.2, -.05, .05, .1, 40]];
  for (const [bx, by, rx, ry, n] of blobs) for (let i = 0; i < n; i++) { const q = r() * 6.283, d = Math.sqrt(r()); pts.push([bx + Math.cos(q) * rx * d, by + Math.sin(q) * ry * d, r(), r()]); }
  return pts;
})();
const MAPC = { u: 960, v: 395, w: 820, h: 300 }, ENGLISH = [-.02, .02];

// camera keys for 7.11 → c08 (world coords; c08 is at x 0, the plate at home)
export function C8(a) {
  return [
    [a.september + 3.8, cam3({ x: 40, y: 300, z: 0 })],                          // 7.11 → 8.01 one long truck along the line, settling over the near ridge
    [a.switzerland + 1.8, cam3({ x: 80, y: 272, z: 120 })],
    [a.apertus + 1.2, cam3({ x: 120, y: 262, z: 220 })],
    [a.public + .8, cam3({ x: 140, y: 262, z: 262 })],                           // 8.03 the list over the box
    [a.anyone2 + .6, cam3({ x: 120, y: 250, z: 40 })],                           // 8.04 the people
    [a.english + .5, cam3({ x: 100, y: 40, z: 60 })],                            // 8.05 up to the map
    [a.opposite + .3, cam3({ x: -126, y: 280, z: 120 })],                        // 8.06 vault | glass
    [a.isGlass + .6, cam3({ x: -110, y: 276, z: 150 })],
    [a.sleeper + .6, cam3({ x: 40, y: 270, z: 330 })],                           // 8.07 lenses
    [a.change + .8, cam3({ x: 50, y: 268, z: 360 })],
    [a.everyEye + .3, cam3({ x: 0, y: 0, z: 0 })],                               // 8.09 crane home: the scale
    [a.s19, cam3({ x: 0, y: 0, z: 0 })],
  ];
}

export function alps(a) {
  const T1 = a.s19;
  // --- timing ---
  const tLine = [a.anyone - .05, a.september + 1.4], tTrace = [a.september + 1.35, a.september + 3.0];
  const tStamp = [a.september, a.switzerland], tStampOut = a.supercomputing + .6;
  const tKick = [a.universities - .1, a.supercomputing], tTitle = a.apertus, tCardOut = a.opened + .3;
  const tLid = [a.opened - .1, a.opened + 1.3], tRow = [a.weights, a.trainingData, a.snapshots], tPub = a.public;
  const tPeople = [a.student, a.journalist, a.rivalLab, a.anyone2];
  const tSpray = [a.spans - .4, a.thousand + .4], tCount = [a.spans + .3, a.thousand + .5], tEng = a.english;
  const tPour = [a.vault - 1.0, a.vault + .5], tRowsBack = [a.vault - .7, a.vault + .6];
  const tVault = [a.vault - .1, a.vault + 1.7], tHalves = [a.vault + .3, a.opposite + .8], tGlassLit = a.glassBox, tPlain = a.plainView;
  const tLens = [a.isGlass + .2, a.checking + .4], tFound = a.sleeper;
  const tHand = [a.but - .2, a.misuse + .3], tCopy = [a.misuse + .3, a.misuse + 1.6], tBend = a.change, tHandOut = [a.change + .6, a.wrongHands - .1];
  const tPost = [a.change + .7, a.change + 1.8], tBeam = [a.change + 1.5, a.change + 2.5], tPans = [a.change + 2.2, a.change + 3.0];
  const tVLift = [a.change + 1.9, a.wrongHands + .25], tBLift = [a.wrongHands, a.glass2 + .35];
  const tEyesG = a.everyEye, tEyesV = a.fewPeople, tEyesG2 = a.everyone, tRather = a.rather, tClose = a.argue;
  // the line (7.11 → 8.01): bridge end at window B (F0) → down onto the near ridge rim (ZN) → to the box's left foot
  // (the step F0 → ZN is drawn as a screen-space S-curve; U0 is chosen so that the near part always lies right of the far part)
  const LINE = [{ Z: F0, u: WB.cx + WB.r + 24 + OA, v: WB.cy }, { Z: F0, u: -420, v: WB.cy + 6 }];
  for (const [u, v] of NR) if (u >= U0 && u <= BOX.u - BOX.s / 2) LINE.push({ Z: ZN, u, v });
  LINE.push({ Z: ZN, u: BOX.u - BOX.s / 2, v: BOX.v });
  const LLEN = [0]; for (let i = 1; i < LINE.length; i++) LLEN.push(LLEN[i - 1] + Math.hypot(LINE[i].u - LINE[i - 1].u, LINE[i].v - LINE[i - 1].v) * (LINE[i].Z !== LINE[i - 1].Z ? .5 : 1));
  const headU = (t) => sineIO(span(t, ...tLine)) * LLEN[LLEN.length - 1];
  // beam angle: plate angle + the weighing (words → tilts), settling to exactly the plate angle before T1 − .5
  const TILT = [[tVLift[1], -.05], [tBLift[1], .012], [tEyesG + .1, .045], [tEyesV + .1, -.032], [tEyesG2 + .1, .034], [tRather + .2, -.016], [tClose + .3, .008], [a.rightOne, 0]];
  const tiltAt = (t) => { let cur = 0; for (const [tt, val] of TILT) cur = lerp(cur, val, sineIO(span(t, tt - .2, tt + 1.2))); return cur; };

  return { back, front };
  function back(ctx, t, c, dawn) {
    // ---------------- far ridge (the plate's), dawn rim: behind the labs ----------------
    card(ctx, c, F0, () => {
      ctx.fillStyle = P.night1; ctx.beginPath(); ctx.moveTo(RIDGE.all[0][0], 4000); RIDGE.all.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(RIDGE.all[RIDGE.all.length - 1][0], 4000); ctx.closePath(); ctx.fill();
      ctx.save(); ctx.lineCap = 'round';
      ctx.strokeStyle = rgba(P.halo1, .45 * dawn); ctx.lineWidth = 2; ctx.beginPath(); RIDGE.all.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
      ctx.restore();
    });
  }
  function front(ctx, t, c, dawn) {
    const N = (u, v) => project(c, ZN, u, v);
    // ---------------- the scale (8.09–8.10), on the plate card ----------------
    const post = sineIO(span(t, ...tPost));
    let rig = null;
    if (post > 0) card(ctx, c, F0, () => { rig = scaleRig(ctx, t, { ang: plateAngle(t) + tiltAt(t), post, beam: sineIO(span(t, ...tBeam)), pans: [smooth(span(t, ...tPans)), smooth(span(t, tPans[0] + .15, tPans[1] + .15))] }); });
    // ---------------- the near ridge and everything on it ----------------
    const hu = headU(t);
    // once vault and box are on the pans, the near ridge (with the people) sinks out of the frame below (the plate has no near ridge)
    const drop = 340 * sineIO(span(t, tBLift[1] + .1, a.everyEye + 1.4));
    const nearOn = !!cardM(c, ZN) && N(0, 1080 + drop)[1] < H + 60;
    let boxG = null, lidU = 0;
    if (nearOn) card(ctx, c, ZN, () => {
      ctx.translate(0, drop);
      // the ridge fill, revealed behind the line's head (u up to the head), its rim lit by dawn
      // feathered in vertical strips: it fades in from U0 and fades out just behind the head (no hard edges)
      const hx = headX(hu);
      if (hx > U0) {
        const fillP = new Path2D(); fillP.moveTo(NR[0][0], 4000); NR.forEach(([u, v]) => fillP.lineTo(u, v)); fillP.lineTo(NR[NR.length - 1][0], 4000); fillP.closePath();
        ctx.fillStyle = lin(ctx, 0, 1040, 0, 1700, [[0, mixHex(P.night1, P.ind1, .25)], [1, mixHex(P.night1, P.night0, .35)]]);
        const SW = 30, FL = 330, FR = 260;
        for (let u = U0; u < Math.min(hx, 3400); u += SW) {
          const al = Math.min(smooth(clamp((u - U0) / FL)), hx >= 9000 ? 1 : smooth(clamp((hx - u) / FR)));
          if (al <= .004) continue;
          ctx.save(); ctx.beginPath(); ctx.rect(u, -9000, SW + .5, 20000); ctx.clip(); ctx.globalAlpha = al; ctx.fill(fillP); ctx.restore();
        }
        if (hx >= 9000) { ctx.save(); ctx.beginPath(); ctx.rect(3400, -9000, 9000, 20000); ctx.clip(); ctx.fill(fillP); ctx.restore(); }
        ctx.save(); ctx.beginPath(); ctx.rect(U0, -9000, Math.max(0, Math.min(hx, 20000) - U0), 20000); ctx.clip();
        ctx.strokeStyle = rgba(P.halo1, .2 + .45 * dawn); ctx.lineWidth = 2.6; ctx.beginPath(); NR.forEach(([u, v], i) => (i ? ctx.lineTo(u, v) : ctx.moveTo(u, v))); ctx.stroke();
        ctx.restore();
      }
      // the stamp (8.01) and the card (8.02)
      stampCard(ctx, t);   // (the card beside the box; the stamp itself is drawn in screen space below)
      // the vault rolls in (8.06) — until it lifts onto the scale (then it is drawn in screen space)
      const vIn = span(t, ...tVault);
      if (vIn > 0 && t < tVLift[0]) vaultNear(ctx, t, vIn);
      // the people (8.04)
      people(ctx, t);
      // the box (traced by the line, then glass), the list
      lidU = smooth(span(t, ...tLid)) * (1 - smooth(span(t, tVLift[0] - .6, tBLift[0])));
      if (t < tBLift[0]) boxG = boxNear(ctx, t, lidU);
      // the map of languages (8.05)
      langMap(ctx, t);
    });
    // the stamp (8.01): top left of the frame, as every Scenario stamp
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); stamp(ctx, t); ctx.restore();
    // light halves (8.06): the vault's side stays night, the glass side takes the dawn
    const hv = smooth(span(t, ...tHalves)) * (1 - smooth(span(t, tLens[0], tLens[1] + 2)));
    if (hv > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = lin(ctx, 0, 0, W, 0, [[0, rgba(P.night0, .32 * hv)], [.42, rgba(P.night0, .1 * hv)], [.5, rgba(P.night0, 0)]]); ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, W * .5, 0, W, 0, [[0, rgba(P.halo1, 0)], [1, rgba(P.halo1, .06 * hv)]]); ctx.fillRect(W * .5, 0, W * .5, H); ctx.restore(); }
    // ---------------- lenses (8.07 → 8.09 eyes), the hand and the copy (8.08) ----------------
    const boxScr = boxScreen(t, c, rig);
    lensesAndEyes(ctx, t, c, boxScr, rig);
    handCopy(ctx, t, c);
    // ---------------- the vault and the box lifted onto the pans (screen space; at home exactly the plate) ----------------
    if (rig && t >= tVLift[0]) {
      const f = sineIO(span(t, ...tVLift)), v0 = N(VAULT.u, VAULT.v), p = project(c, F0, ...rig.vault);
      const r = lerp(VAULT.r * v0[2], 84 * p[2], f), x = lerp(v0[0], p[0], f), y = lerp(v0[1], p[1], f) - Math.sin(f * Math.PI) * 60;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); vaultMark(ctx, t, { x, y, r, detail: 1 - smooth(span(f, .4, 1)) }); ctx.restore();
    }
    if (rig && t >= tBLift[0]) {
      const g = boxScr;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); glassBox(ctx, t, { x: g.x, y: g.y, s: g.s, detail: g.det, lid: 0 }); ctx.restore();
    }
    // ---------------- the line (7.11 → 8.01): drawn last, the brightest thing while it runs ----------------
    if (t > tLine[0] && t < tTrace[1] + .3) lineDraw(ctx, t, c, hu);
  }

  // ------------------------------------------------------------------ helpers
  function headX(hu) {   // the near-card u reached by the line's head (for revealing the ridge)
    for (let i = 1; i < LLEN.length; i++) if (LLEN[i] >= hu) { const p = LINE[i - 1], q = LINE[i]; if (q.Z !== ZN) return -9000; return lerp(p.Z === ZN ? p.u : q.u - 40, q.u, (hu - LLEN[i - 1]) / Math.max(1e-6, LLEN[i] - LLEN[i - 1])); }
    return 9000;
  }
  function lineDraw(ctx, t, c, hu) {
    const pts = []; let head = null;
    const seg = (sq, s, f) => (f <= 0 ? [sq[0], sq[1]] : [lerp(sq[0], s[0], f), lerp(sq[1], s[1], smooth(f))]);   // leaves level, lands level
    for (let i = 0; i < LINE.length; i++) {
      const p = LINE[i], s = project(c, p.Z, p.u, p.v); if (!s) continue;
      const q = i ? LINE[i - 1] : null, step = q && q.Z !== p.Z, sq = q ? project(c, q.Z, q.u, q.v) : null;
      const f = LLEN[i] <= hu ? 1 : (hu - LLEN[i - 1]) / (LLEN[i] - LLEN[i - 1]);
      if (step && sq) for (let k = 1; k < 16; k++) { if (k / 16 > f) break; pts.push(seg(sq, s, k / 16)); }
      if (f >= 1) pts.push([s[0], s[1]]);
      else { head = step && sq ? seg(sq, s, f) : [lerp(sq[0], s[0], f), lerp(sq[1], s[1], f)]; pts.push(head); break; }
    }
    if (pts.length < 2) return;
    // the line is solid light; once the box is traced, its tail retracts into the ridge rim (the rim keeps the light)
    const tail = smooth(span(t, tTrace[0], tTrace[1] + .3));
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    K.trailSpan(ctx, pts, tail, 1, { w: 2.8, spark: hu < LLEN[LLEN.length - 1] - 1 });
    // trace the box outline after arrival
    const tr = span(t, ...tTrace);
    if (tr > 0 && tr < 1) {
      const b = boxOutline(c);
      K.trailSpan(ctx, b, Math.max(0, tr - .45), tr, { w: 2.6 });
    }
    ctx.restore();
  }
  function boxOutline(c) {   // left foot → up → over the lid → down the right side → back along the floor (screen space)
    const x0 = BOX.u - BOX.s / 2, y1 = BOX.v, y0 = y1 - BOX.s, dx = 34 * BOX.s / 150, dy = -46 * BOX.s / 150;
    return [[x0, y1], [x0, y0], [x0 + dx, y0 + dy], [x0 + BOX.s + dx, y0 + dy], [x0 + BOX.s, y0], [x0 + BOX.s, y1], [x0, y1]].map(([u, v]) => project(c, ZN, u, v).slice(0, 2));
  }
  function boxNear(ctx, t, lid) {
    const tr = span(t, ...tTrace); if (tr <= 0) return null;
    const a = smooth(span(tr, .35, 1));
    const glow = 1 + .4 * smooth(span(t, tGlassLit - .1, tGlassLit + .6)) * (1 - smooth(span(t, tGlassLit + 1.5, tGlassLit + 3)));
    const rowsOut = ROWS.map((_, i) => rowU(t, i));
    const plain = smooth(span(t, tPlain - .2, tPlain + .8));
    const g = glassBox(ctx, t, { x: BOX.u, y: BOX.v, s: BOX.s, a, detail: 1, lid, glow, lines: a, lineA: [1 - rowsOut[0], 1 - rowsOut[1], 1 - rowsOut[2], 1].map((v) => clamp(v + plain * 0)), spot: smooth(span(t, tLens[0], tLens[0] + 1)), found: smooth(span(t, tFound - .05, tFound + .5)) });
    // the list rises out of the open box (8.03), stays lit over it, sinks back in (8.06)
    rows(ctx, t, g);
    return g;
  }
  function rowU(t, i) { return sineIO(span(t, tRow[i] - .25, tRow[i] + .9)) * (1 - sineIO(span(t, tRowsBack[0] + i * .12, tRowsBack[1] + i * .12))); }
  function rows(ctx, t, g) {
    const pub = smooth(span(t, tPub - .1, tPub + .7));
    for (let i = 0; i < 3; i++) {
      const u = rowU(t, i); if (u <= 0) continue;
      const [lx, ly, lw] = g.lines[i];
      const ty = g.y0 - 330 + i * 76, tx = BOX.u - 230;
      const x = lerp(lx, tx, u), y = lerp(ly, ty, u) - Math.sin(u * Math.PI) * 30, w = lerp(lw, 460, u), h = lerp(4, 60, smooth(span(u, .1, .8)));
      const p = new Path2D(); p.roundRect(x, y - h / 2, w, h, Math.min(h / 2, 12));
      E.glowFill(ctx, p, 16, .25 + .25 * pub, mixHex(P.blue0, P.halo1, pub));
      ctx.fillStyle = rgba(mixHex(P.ind2, P.halo1, .18 + .2 * pub), .9); ctx.fill(p);
      ctx.strokeStyle = rgba(mixHex(P.halo0, P.cream, .3), .55 + .45 * pub); ctx.lineWidth = 2; ctx.stroke(p);
      const tu = smooth(span(u, .65, 1));
      if (tu > 0) {
        ctx.save(); ctx.globalAlpha = tu; icon(ctx, i, x + 36, y, t); ctx.restore();
        K.maskLine(ctx, [[ROWS[i], 0]], x + 76, y + 12, 34, tu, { serif: false, col: P.cream, glow: false });
      }
    }
    const pu = rise(span(t, tPub - .05, tPub + .8)) * (1 - expoIn(span(t, tRowsBack[0] - .3, tRowsBack[0] + .2)));
    if (pu > 0) K.maskLine(ctx, [['ALL PUBLIC', 1]], BOX.u - 228, g.y0 - 390, 40, pu, { serif: false, glow: false });
  }
  function icon(ctx, i, x, y, t) {
    ctx.save(); ctx.strokeStyle = P.halo0; ctx.fillStyle = P.halo0; ctx.lineWidth = 2; ctx.lineCap = 'round';
    if (i === 0) { const f = X.fileShape(x, y, 26, 34, 8); ctx.fillStyle = rgba(P.halo1, .35); ctx.fill(f.path); ctx.stroke(f.path); ctx.lineWidth = 1.4; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(x - 7, y - 3 + k * 6); ctx.lineTo(x + 7, y - 3 + k * 6); ctx.stroke(); } }
    else if (i === 1) { for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(x - 14, y - 11 + k * 7); ctx.lineTo(x + [14, 9, 12, 5][k], y - 11 + k * 7); ctx.stroke(); } }
    else { ctx.beginPath(); ctx.moveTo(x - 16, y); ctx.lineTo(x + 16, y); ctx.stroke(); for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.arc(x - 15 + k * 10, y, 3.4, 0, 6.29); ctx.fill(); } }
    ctx.restore();
  }
  function stampCard(ctx, t) {
    // card beside the box: kicker ETH ZURICH · EPFL · CSCS, then the name
    const cx = BOX.u + 250, cy = BOX.v - 290, cout = (i) => 1 - sineIO(span(t, tCardOut + i * .1, tCardOut + .8 + i * .1));
    const rr = sineIO(span(t, tKick[0] - .3, tKick[0] + .6)) * cout(0);
    if (rr > 0) K.trailSpan(ctx, [[cx - 24, cy - 70], [cx - 24, cy + 120]], 0, rr, { w: 2.2, spark: false });
    const k1 = rise(span(t, tKick[0], tKick[0] + .9)) * cout(0), k2 = rise(span(t, tKick[1] - .1, tKick[1] + .8)) * cout(0);
    if (k1 > 0) { const r1 = K.maskLine(ctx, [['ETH ZURICH · EPFL', 0]], cx, cy - 20, 32, k1, { serif: false, col: P.halo2, glow: false }); if (k2 > 0) K.maskLine(ctx, [[' · CSCS', 0]], cx + r1.w, cy - 20, 32, k2, { serif: false, col: P.halo2, glow: false }); }
    const ti = rise(span(t, tTitle - .1, tTitle + .9)) * cout(1);
    if (ti > 0) K.maskLine(ctx, [['Apertus', 1]], cx - 4, cy + 100, 124, ti);
  }
  function stamp(ctx, t) {   // SEPTEMBER 2025 / SWITZERLAND (screen space, top left), a short rule
    const out = (i) => 1 - expoIn(span(t, tStampOut + i * .1, tStampOut + .5 + i * .1));
    const sx = 150, sy = 150;
    const r0 = sineIO(span(t, tStamp[0] - .3, tStamp[0] + .5)) * out(0);
    if (r0 > 0) K.trailSpan(ctx, [[sx - 24, sy - 40], [sx - 24, sy + 52]], 0, r0, { w: 2.2, spark: false });
    const u1 = rise(span(t, tStamp[0], tStamp[0] + .9)) * out(0), u2 = rise(span(t, tStamp[1] - .1, tStamp[1] + .8)) * out(1);
    if (u1 > 0) K.maskLine(ctx, [['SEPTEMBER 2025', 0]], sx, sy, 36, u1, { serif: false, col: P.cream, glow: false });
    if (u2 > 0) K.maskLine(ctx, [['SWITZERLAND', 1]], sx, sy + 46, 28, u2, { serif: false, col: P.halo2, glow: false });
  }
  function vaultNear(ctx, t, vIn) {
    // it rolls in from the left on its rim (heavy: slow start, long settle), the slit of light glows on "opposite"
    const f = 1 - (1 - sineIO(vIn)) ** 2, x = lerp(VAULT.u - 900, VAULT.u, f), rot = (x - VAULT.u) / VAULT.r;
    const y = rimV(x) - VAULT.r + 6;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.translate(-x, -y);
    vaultMark(ctx, t, { x, y, r: VAULT.r, detail: 1, crack: .6 * smooth(span(t, a.opposite - .2, a.opposite + .8)) });
    ctx.restore();
  }
  function people(ctx, t) {
    PEOPLE.forEach((pp, i) => {
      const w = span(t, tPeople[i] - .35, tPeople[i] + .75); if (w <= 0) return;
      const x = lerp(pp.u + pp.from, pp.u, sineIO(w)), y = rimV(x) + 2, dir = pp.from < 0 ? 1 : -1, walking = w < 1;
      const o = walking ? { walk: w * 10, dir, light: dir } : { dir, light: dir, look: .2 + .05 * Math.sin(t * .7 + i) };
      if (pp.kind === 'du') E.du(ctx, x, y, 150, o);
      else {
        E.person(ctx, x, y, 156, { ...o, long: pp.kind === 'lab', ...(pp.kind === 'journalist' && !walking ? { armR: [.9, 2.0] } : {}) });
        if (pp.kind === 'student') { ctx.fillStyle = P.night0; ctx.beginPath(); ctx.roundRect(x - dir * 22 - 9, y - 128, 18, 40, 6); ctx.fill(); ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 1.5; ctx.stroke(); }
        if (pp.kind === 'journalist' && !walking) { ctx.fillStyle = P.cream; ctx.fillRect(x + dir * 30 - 6, y - 100, 12, 16); }
      }
      const lu = rise(span(t, tPeople[i], tPeople[i] + .8)) * (1 - expoIn(span(t, a.spans - .3, a.spans + .2)));
      if (lu > 0) K.maskLine(ctx, [[['STUDENT', 'JOURNALIST', 'RIVAL LAB', 'ANYONE'][i], pp.kind === 'du' ? 1 : 0]], pp.u, rimV(pp.u) + 56 + (i % 2) * 36, 26, lu, { serif: false, align: 'center', col: rgba(P.cream, .85), glow: false });
    });
  }
  function langMap(ctx, t) {
    const sp = span(t, ...tSpray), pour = span(t, ...tPour); if (sp <= 0 || pour >= 1) return;
    const src = [BOX.u - 230 + 230, BOX.v - BOX.s - 330 + 76];   // the TRAINING DATA row
    const eng = smooth(span(t, tEng - .1, tEng + .5));
    ctx.save();
    MAP.forEach(([mx, my, r1, r2], i) => {
      const d = clamp((sp - r1 * .5) / .5), f = sineIO(d); if (f <= 0) return;
      const pf = sineIO(clamp((pour - r2 * .4) / .6));
      const tx = MAPC.u + mx * MAPC.w, ty = MAPC.v + my * MAPC.h * 1.6;
      let x = lerp(src[0] + (r2 - .5) * 300, tx, f) + drift(t, 1.5, i), y = lerp(src[1], ty, f) - Math.sin(f * Math.PI) * 80 * r1;
      x = lerp(x, BOX.u + (r1 - .5) * 120, pf); y = lerp(y, BOX.v - BOX.s * .5, pf);
      ctx.globalAlpha = (.55 + .45 * Math.sin(t * (1 + r1) + r2 * 9)) * (1 - .5 * pf);
      ctx.fillStyle = r1 < .5 ? mixHex(P.halo1, P.cream, .4) : mixHex(P.blue1, P.cream, .6);
      ctx.fillRect(x - 2, y - 2, 4, 4);
    });
    ctx.restore();
    // English: one point, warm, labelled
    const ex = MAPC.u + ENGLISH[0] * MAPC.w, ey = MAPC.v + ENGLISH[1] * MAPC.h * 1.6, pout = 1 - expoIn(span(t, tPour[0], tPour[0] + .4));
    if (eng > 0) { E.halo(ctx, ex, ey, 60, .55 * eng * pout, P.halo1, P.core0); const lu = rise(span(t, tEng, tEng + .7)) * pout; if (lu > 0) K.maskLine(ctx, [['ENGLISH', 1]], ex + 18, ey - 14, 26, lu, { serif: false, glow: false }); }
    // the counter
    const cu = span(t, ...tCount), cout = 1 - expoIn(span(t, tPour[0] - .2, tPour[0] + .3));
    if (cu > 0 && cout > 0) {
      const n = Math.round(1000 * expoOut(cu) / 10) * 10, s = (n >= 1000 ? '1,000+' : n.toLocaleString('en-US'));
      K.maskLine(ctx, [[s, 0]], MAPC.u + MAPC.w * .5 + 140, MAPC.v + 20, 132, rise(span(cu, 0, .3)) * cout);
      K.maskLine(ctx, [['LANGUAGES', 0]], MAPC.u + MAPC.w * .5 + 146, MAPC.v + 74, 34, rise(span(cu, .1, .45)) * cout, { serif: false, col: P.halo2, glow: false });
    }
  }
  // where the box is on screen (for the lenses, and for its lift onto the pan): { x, y (bottom), s, det, cx, cy }
  function boxScreen(t, c, rig) {
    const n = project(c, ZN, BOX.u, BOX.v), k = n[2];
    let x = n[0], y = n[1], s = BOX.s * k, det = 1;
    if (rig && t >= tBLift[0]) {
      const f = sineIO(span(t, ...tBLift)), p = project(c, F0, ...rig.box);
      x = lerp(x, p[0], f); y = lerp(y, p[1], f) - Math.sin(f * Math.PI) * 70; s = lerp(s, 150 * p[2], f); det = 1 - smooth(span(f, .4, 1));
    }
    return { x, y, s, det, cx: x + s * .11, cy: y - s * .55 };
  }
  // 8.07 lenses circle the box; one finds the flaw · 8.09 they fly to the right pan and open as eyes; 3 eyes over the vault
  function lensesAndEyes(ctx, t, c, b, rig) {
    const L0 = span(t, ...tLens); if (L0 <= 0) return;
    const toEye = (i) => sineIO(span(t, tEyesG - .15 + i * .1, tEyesG + .75 + i * .1));
    const close = (i) => smooth(span(t, tClose + i * .07, tClose + .5 + i * .07));
    const slots = (side, n) => {   // eye positions over a pan object (screen), from the rig
      if (!rig) return [];
      const out = [];
      if (side === 'R') { const p = project(c, F0, rig.box[0], rig.box[1] - 150 - 90); for (let i = 0; i < n; i++) { const row = i < 6 ? 0 : 1, j = row ? i - 6 : i; out.push([p[0] + (j - 2.5) * 46 * p[2] + row * 23 * p[2], p[1] - row * 40 * p[2]]); } }
      else { const p = project(c, F0, rig.vault[0], rig.vault[1] - 84 - 46); for (let i = 0; i < n; i++) out.push([p[0] + (i - 1) * 50 * p[2], p[1]]); }
      return out;
    };
    const sR = slots('R', 12), sL = slots('L', 3);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (let i = 0; i < 6; i++) {
      const enter = sineIO(clamp((L0 - i * .1) / .5)); if (enter <= 0) continue;
      const q = t * .55 + i * 1.047, rx = b.s * .95, ry = b.s * .26;
      let x = b.cx + Math.cos(q) * rx, y = b.cy + Math.sin(q) * ry;
      x = lerp(b.cx + b.s * 2.4 + i * 30, x, enter); y = lerp(b.cy - b.s * .6, y, enter);
      if (i === 2) { const f = sineIO(span(t, tFound - 1.1, tFound)); const g = boxG2(b); x = lerp(x, g[0], f); y = lerp(y, g[1], f); }
      const e = toEye(i), fin = sR[i];
      if (e > 0 && fin) { x = lerp(x, fin[0], e); y = lerp(y, fin[1], e); }
      const r = lerp(Math.max(10, b.s * .1), 0, 0), w = lerp(r * 2, 34 * (rig ? 1 : 1), e);
      const cl = close(i);
      if (e < 1) {   // a lens: ring of cool light (warm when it found the flaw)
        const warm = i === 2 ? smooth(span(t, tFound - .05, tFound + .4)) : 0;
        ctx.save(); ctx.globalAlpha = (1 - e); ctx.strokeStyle = mixHex(mixHex(P.blue1, P.cream, .6), P.halo0, warm); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, y, r * (1 - e * .5), r * (1 - e), 0, 0, 6.29); ctx.stroke(); ctx.restore();
        if (warm > 0) E.halo(ctx, x, y, r * 3, .4 * warm * (1 - e), P.halo1, P.halo0);
      }
      if (e > 0) eye(ctx, x, y, 30, lerp(e, 0, cl), { look: [Math.sin(t * .8 + i), 0] });
    }
    // more eyes on the glass side ("everyone"), a few over the vault ("a few people"); one turns cool ("people you'd rather didn't")
    for (let i = 6; i < 12 && sR[i]; i++) { const o = smooth(span(t, tEyesG2 + (i - 6) * .1, tEyesG2 + .5 + (i - 6) * .1)) * (1 - close(i)); eye(ctx, sR[i][0], sR[i][1], 30, o, { cool: i === 9 ? smooth(span(t, tRather, tRather + .6)) : 0, look: [Math.sin(t * .7 + i), 0] }); }
    for (let i = 0; i < 3 && sL[i]; i++) { const o = smooth(span(t, tEyesV + i * .12, tEyesV + .5 + i * .12)) * (1 - close(i + 12)); eye(ctx, sL[i][0], sL[i][1], 30, o, { look: [Math.sin(t * .6 + i), 0] }); }
    ctx.restore();
    function boxG2(b) { const k = b.s / 150; return [b.x - b.s / 2 + 24 * k + 100 * k + 16 * k, b.y - b.s + 30 * k + 60 * k]; }
  }
  function handCopy(ctx, t, c) {
    const h = sineIO(span(t, ...tHand)) * (1 - sineIO(span(t, ...tHandOut))); if (h <= 0) return;
    const cp = sineIO(span(t, ...tCopy)), bend = smooth(span(t, tBend - .1, tBend + .7)), out = sineIO(span(t, ...tHandOut));
    // in near-card coords: the hand comes from the lower right, dips into the open top, lifts the copy out and up to the right
    const top = [BOX.u + 30, BOX.v - BOX.s - 30];
    const fx = lerp(top[0], BOX.u + 300, cp) + out * 500, fy = lerp(top[1] + 40, top[1] - 170, cp) - out * 120;
    card(ctx, c, ZN, () => {
      const hx = lerp(BOX.u + 760, fx + 40, h * (1 - out) + out), hy = lerp(BOX.v + 260, fy + 90, h * (1 - out) + out);
      X.darkHand(ctx, E.handMatrix(hx + 30, hy + 40, -2.2, 96, -1), { pose: 'hold', curl: lerp(.1, .55, smooth(span(t, tCopy[0] - .2, tCopy[0] + .2))), warm: 0 });
      // the copy (cool, the echo of 2.03): a file whose lines bend on "change", held in front of the hand
      if (cp > 0) {
        const F = X.fileShape(fx, fy, 132, 168, 30);
        E.glowFill(ctx, F.path, 18, .35 * cp, P.blue0);
        ctx.save(); ctx.fillStyle = rgba(mixHex(P.blue1, P.ind2, .3), .75); ctx.fill(F.path); ctx.strokeStyle = rgba(mixHex(P.cream, P.blue1, .3), .95); ctx.lineWidth = 2.6; ctx.stroke(F.path);
        ctx.strokeStyle = mixHex(P.cream, P.blue1, .35 + .4 * bend); ctx.lineWidth = 3; ctx.lineCap = 'round';
        for (let k = 0; k < 6; k++) { const yy = fy - 52 + k * 21; ctx.beginPath(); for (let s = 0; s <= 10; s++) { const xx = fx - 44 + s * 8.6, wv = Math.sin(s * .9 + k * 1.3 + t * 2) * 7 * bend; s ? ctx.lineTo(xx, yy + wv) : ctx.moveTo(xx, yy + wv); } ctx.stroke(); }
        ctx.font = '600 20px Inter'; ctx.textAlign = 'center'; ctx.fillStyle = rgba(P.cream, .9 * smooth(span(cp, .5, 1))); ctx.fillText('COPY', fx, fy + 104);
        ctx.restore();
      }
    });
  }
}
