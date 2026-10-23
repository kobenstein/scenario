// Film 6 · c04 · §2a: "Try something." … "It's a skill you can grow."  (02a, C2 Sadhguru, 02b, C3 Sarvapriyananda, start of 02c)
// ONE take in one world (a dim hall at first light: the sitter on a long bench, the candle before him, a tall dark window at the right,
// still dark water beyond the stone platform). The camera never cuts; every entry below draws the same frame function.
//
// shot  VO words                                   image                                                       hero light     camera                         flows on           ★  sound
// 4.01  Try something.                             out of the flame: the candle on the bench before the sitter  candle         pull out of the flame (z 8.5→1.18)  take            whoosh_airy
// 4.02  Sit still … drift past, like clouds.       thought clouds drift right above the sitter (3 planes)      candle         hold (slow)                    take
// 4.03  A plan. A worry. A song you can't shake.   a list sheet, a knot of thread, three notes rise from clouds candle         hold                           take               paper_pop · chime
// 4.04  Now ask. Who is watching them?             ★ the witness point grows above and behind the head;        witness        pull back (z 1.18→1)           take            ★  shimmer_rings
//                                                  the clouds pass in front of it; clouds below, point above
// 4.05  Yoga draws its line exactly here.          the cool line is drawn between clouds and witness           witness        hold                           take
// 4.06  Thinking, judging, planning. All of that   three gear groups rise out of the dark under the clouds;    candle/brass   hold                           take               tick
//       is machinery.                              the clouds sink behind the gears; BUDDHI · INTELLECT;
//                                                  the line sags onto the big gear and runs with it
// 4.07  CLIP C2 Sadhguru                           the dark window turns into a window on him, lower third     screen         push into the window (z 1.69)  take               whoosh_up
// 4.08  And what watches it is something else.     the witness above, the gears turning below, the belt line   witness        pull back to the room          take
// 4.09  CLIP C3 Swami Sarvapriyananda              the window again, lower third                               screen         push into the window           take
// 4.10  And Buddhism says compassion isn't just    down to the still water: a lotus opens petal by petal,      lotus (ember)  move down to the water (z 2.4) fly into the water   whoosh_airy
//       a feeling. It's a skill you can grow.      ember-coloured; KARUNA · COMPASSION; push into the water                   push (z 2.65→12)               → glass plate      bloom
// plates: in = light (ember) c03>c04 (the candle flame fills the frame; the disc of light shrinks into the flame as the camera pulls out);
//         out = glass c04>c05 (the water IS the glass plate, clipped to the region beyond the floor line; the push makes it fill the frame).
import { W, H, rgba, clamp, lin, mix, sm, eout, ein, drift } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { F6, ready, view, camMap, riseFromDark, witness, lowerThird } from '../lib/f6_kit.mjs';
import { canvas } from '../engine.mjs';
import fs from 'node:fs';
import { loadImage } from '@napi-rs/canvas';
import { ROOT } from '../lib/kit.mjs';
import { QUART, EXPO_OUT, cloud, thought, clockwork, beltLine, buddhiLabel, GEARS, RIM_SPEED } from '../lib/f6_c04_mind.mjs';
import { wall, water, waterGlow, slab, bench, sitter, candle, windowPane, motes, lotus, lotusReflection, karunaLabel, PETAL_COUNT, FLAME, WIN, LOTUS, FLOOR_Y } from '../lib/f6_c04_room.mjs';

const TAU = Math.PI * 2;
// a camera that puts world point (px, py) of parallax plane p at the frame centre
const aimCam = (px, py, z, p) => ({ x: W / 2 + (px - W / 2) / p, y: H / 2 + (py - H / 2) / p, z });

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c04', T);
  const S = (s, p) => T.S(s, p), E = (s, p) => T.E(s, p);
  // ---- anchors (words, never seconds)
  const tSit = S('02a', 'Sit'), tPlan = S('02a', 'plan'), tWorry = S('02a', 'worry'), tSong = S('02a', 'song');
  const tNow = S('02a', 'Now ask'), tWho = S('02a', 'Who'), tYoga = S('02a', 'Yoga'), tHere = S('02a', 'here');
  const tThink = S('02a', 'Thinking'), tJudge = S('02a', 'judging'), tPlanning = S('02a', 'planning'), tAll = S('02a', 'All of that'), tMach = S('02a', 'machinery');
  const C2 = T.clip('C2'), C3 = T.clip('C3');
  const tWatch = S('02b', 'And what'), tElse = E('02b', 'else');
  const tBud = S('02c', 'And Buddhism'), tComp = S('02c', 'compassion'), tFeel = E('02c', 'feeling'), tSkill = S('02c', 'skill'), tGrow = S('02c', 'grow');
  const tEnd = HO.a - 1 / 30;   // by here the frame IS the glass plate

  // ---- the camera path: segments [t0, t1, from, to]; holds between them
  const CAM0 = aimCam(FLAME[0], FLAME[1], 8.5, 1.03), CAM1 = { x: 820, y: 600, z: 1.18 }, CAM2 = { x: 960, y: 560, z: 1 };
  const CAMW = { x: WIN.x, y: WIN.y + (540 - 452) / 1.686, z: 1.686 };   // the window lands at screen (960, 452): 1180 × 664
  const CAML = { x: LOTUS.x, y: LOTUS.y - 14, z: 2.3 }, CAML2 = { x: LOTUS.x + 40, y: LOTUS.y + 10, z: 3.3 }, CAMF = { x: LOTUS.x + 170, y: LOTUS.y + 100, z: 12 };
  const SEGS = [
    [HI.b + .05, tSit - .2, CAM0, CAM1, EXPO_OUT],
    [tNow + .3, tWho + 1.0, CAM1, CAM2],
    [tMach + .5, C2.start - .05, CAM2, CAMW],
    [C2.end + .35, tWatch + .9, CAMW, CAM2],
    [tElse - .1, C3.start + .05, CAM2, CAMW],
    [C3.end + .4, tComp, CAMW, CAML],
    [tComp, tGrow - .18, CAML, CAML2],
    [tGrow - .18, tEnd, CAML2, CAMF, ein],   // the exit: slow, then away into the water
  ];
  const camAt = (t) => {
    let cur = SEGS[0][2];
    for (const [t0, t1, A, B, ease] of SEGS) {
      if (t < t0) break;
      if (t >= t1) { cur = B; continue; }
      const u = (ease || QUART)((t - t0) / (t1 - t0));
      return { x: mix(A.x, B.x, u), y: mix(A.y, B.y, u), z: Math.exp(mix(Math.log(A.z), Math.log(B.z), u)) };
    }
    return cur;
  };

  // ---- the thoughts: six clouds drifting right on two planes; three carry an object; all sink behind the gears on "All of that is machinery"
  const CLOUDS = [
    { xr: 300, tr: tPlan, v: 40, y: 430, r: 115, k: .85, near: true, obj: 'plan', tw: tPlan, vr: 0, ph: .3 },
    { xr: 700, tr: tWorry, v: 22, y: 455, r: 125, k: 1, near: true, obj: 'worry', tw: tWorry, vr: 1, ph: 2.1 },
    { xr: 160, tr: tSong, v: 45, y: 420, r: 100, k: .7, near: true, obj: 'song', tw: tSong, vr: 2, ph: 4.0 },
    { xr: 250, tr: tSit + 2.2, v: 32, y: 345, r: 72, k: .3, near: false, vr: 1, ph: 1.2 },
    { xr: 900, tr: tSit + 2.2, v: 10, y: 400, r: 60, k: .2, near: false, vr: 0, ph: 5.1 },
    { xr: 150, tr: tThink, v: 35, y: 480, r: 90, k: .6, near: true, vr: 2, ph: 3.3 },
  ];
  const A = GEARS[0];
  // sink order: the nearest to the big gear first, 0.1 s apart
  const order = CLOUDS.map((c, i) => ({ i, d: Math.abs(c.xr + c.v * (tAll - c.tr) - A.x) })).sort((p, q) => p.d - q.d);
  order.forEach((o, j) => { CLOUDS[o.i].ts = tAll + j * .1; });
  const SINK = 1.3;
  const cloudState = (c, t) => {
    const x0 = c.xr + c.v * (t - c.tr), y0 = c.y + 8 * Math.sin(t * .35 + c.ph);
    const dip = c.tw ? 4 * Math.sin(Math.PI * lin(c.tw + .06, c.tw + .5, t)) : 0;
    const us = lin(c.ts, c.ts + SINK, t);
    if (us <= 0) return { x: x0, y: y0 + dip, s: 1, gone: false };
    if (us >= 1) return { gone: true };
    const e = QUART(us), xs = c.xr + c.v * (c.ts - c.tr), ys = c.y + 8 * Math.sin(c.ts * .35 + c.ph), cx = (xs + A.x) / 2, cy = A.y + 50;
    const q = 1 - e, x = q * q * xs + 2 * q * e * cx + e * e * A.x, y = q * q * ys + 2 * q * e * cy + e * e * A.y;
    return { x, y, s: mix(1, .4, e), gone: false };
  };
  const drawClouds = (g, t, near) => {
    for (const c of CLOUDS) {
      if (c.near !== near) continue;
      const st = cloudState(c, t); if (st.gone) continue;
      g.save(); g.translate(st.x, st.y); g.scale(st.s, st.s);
      cloud(g, 0, 0, c.r, .6 * (.6 + .4 * c.k), c.vr);
      if (c.obj) { g.save(); g.translate(0, -c.r * .52); thought(g, c.obj, lin(c.tw, c.tw + .45, t), t, c.tw + .6); g.restore(); }
      g.restore();
    }
  };

  // ---- the gears: three groups rise on Thinking / judging / planning
  const GROUPS = [{ t0: tThink, idx: [0] }, { t0: tJudge, idx: [1, 3] }, { t0: tPlanning, idx: [2] }];
  const drawGears = (ctx, t, cam, flame) => {
    const m = camMap(cam, 1);
    for (const G of GROUPS) {
      const u = lin(G.t0, G.t0 + .7, t); if (u <= 0) continue;
      const rise = [0, 0, 0, 0]; G.idx.forEach((i) => { rise[i] = u; });
      const paint = (g) => clockwork(g, t, { rise, light: { x: flame[0], y: flame[1] } });
      if (u < 1) riseFromDark(ctx, u, (g) => { g.setTransform(m.k, 0, 0, m.k, m.tx, m.ty); paint(g); }, { col: '#1b1a22' });
      else view(ctx, cam, 1, (g) => paint(g));
    }
  };

  // ---- the lotus: petal openings (outer alternating sides, then inner, then the core)
  const OUTER = [0, 4, 2, 6, 1, 5, 3, 7];
  const petalOpen = (t) => {
    const open = new Array(PETAL_COUNT).fill(0);
    OUTER.forEach((i, j) => { open[i] = QUART(lin(tComp + j * .36, tComp + j * .36 + 1.1, t)); });
    for (let j = 0; j < 6; j++) open[8 + j] = QUART(lin(tFeel - .6 + j * .3, tFeel - .6 + j * .3 + 1.1, t));
    for (let j = 0; j < 4; j++) open[14 + j] = QUART(lin(tSkill + .2 + j * .2, tSkill + .2 + j * .2 + .9, t));
    return open;
  };

  // ---- the opening plate: the candle's light fills the frame, then shrinks into the flame as the camera pulls out
  const [disc, dg] = canvas(W, H);
  const openingDisc = (ctx, t, cam) => {
    if (t > HI.b + 1.0) return;
    // the light we came out of: the plate, masked by a glow-shaped falloff (opaque core, long soft tail) that shrinks into the flame
    const k = 1 - sm(lin(HI.b + .15, HI.b + .95, t)), m = camMap(cam, 1.03), fx = m.X(FLAME[0]), fy = m.Y(FLAME[1]);
    const Rr = 5 * 142 * cam.z * k; if (Rr < 6) return;
    dg.setTransform(1, 0, 0, 1, 0, 0); dg.globalCompositeOperation = 'source-over'; dg.globalAlpha = 1; dg.clearRect(0, 0, W, H);
    HI.plate(dg, t);
    const gr = dg.createRadialGradient(fx, fy, 0, fx, fy, Rr); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(.2 * k, 'rgba(0,0,0,1)'); gr.addColorStop(.45, `rgba(0,0,0,${.45 * Math.sqrt(k)})`); gr.addColorStop(.75, `rgba(0,0,0,${.12 * k})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
    dg.globalCompositeOperation = 'destination-in'; dg.fillStyle = gr; dg.fillRect(0, 0, W, H);
    ctx.drawImage(disc, 0, 0);
  };

  // ---- THE TAKE
  const frame = (ctx, t) => {
    if (t >= tEnd) { HO.plate(ctx, t); return; }   // the water has filled the frame: the plate itself (everything else is out of frame)
    const cam = camAt(t), morning = lin(R.a, R.b, t), clipId = t < (C2.end + C3.start) / 2 ? 'C2' : 'C3';
    const brC = 1 + .03 * Math.sin(t * TAU / 1);
    // far: the wall and the water
    view(ctx, cam, .92, (g) => wall(g, t, morning));
    view(ctx, cam, 1, (g) => { water(g, t, HO.plate); waterGlow(g, FLAME[0], 70, 280, F6.amber, .13 * brC); });
    // the window (the clip's pane) on the wall
    let winOn = 0;
    view(ctx, cam, .95, (g) => { winOn = windowPane(g, t, T, clipId, morning, LAST).on; });
    if (winOn > 0) view(ctx, cam, 1, (g) => waterGlow(g, WIN.x, 360, 240, '#cfe0f0', .12 * winOn));
    // the witness: above and behind the head; the clouds pass in front of it
    view(ctx, cam, .95, (g) => witness(g, t, { x: 420, y: 112, r: 5, halo: 120, a: lin(tWho, tWho + .9, t) }));
    // thoughts on two planes
    view(ctx, cam, .97, (g) => drawClouds(g, t, false));
    view(ctx, cam, 1.03, (g) => drawClouds(g, t, true));
    // the machinery (buddhi), the line between, the label
    const flame = FLAME;
    drawGears(ctx, t, cam, flame);
    view(ctx, cam, 1, (g) => {
      const lineU = lin(tYoga, tHere + .35, t);
      if (lineU > 0) beltLine(g, t, { x0: 80, x1: 960, y: 240, u: lineU, sag: QUART(lin(tMach, tMach + .8, t)), slide: RIM_SPEED * Math.max(0, t - tMach - .8) });
      buddhiLabel(g, lin(tMach, tMach + .5, t), 820, 850);
    });
    // the lotus on the water (closed bud until §2c)
    view(ctx, cam, 1, (g) => {
      const open = petalOpen(t), glow = mix(.25, 1, lin(tComp, tGrow, t));
      const maxR = 420 / cam.z;   // the glow never reaches back into the frame once the flower has left it
      g.save(); g.translate(LOTUS.x, LOTUS.y); lotusReflection(g, t, { open, glow, maxR }); lotus(g, t, { open, glow, maxR }); g.restore();
      karunaLabel(g, lin(tSkill - .5, tSkill + .3, t), LOTUS.x + 70, LOTUS.y - 62);
    });
    // the platform, the bench, the sitter and his candle (near plane), the motes nearer still
    view(ctx, cam, 1.03, (g) => { slab(g); bench(g); sitter(g, t, flame); candle(g, t); });
    view(ctx, cam, 1.12, (g) => motes(g, t, flame));
    // the light we came out of
    openingDisc(ctx, t, cam);
    // the lower third (screen space) while a clip plays
    if (t > C2.start - .2 && t < C2.end + .2) lowerThird(ctx, t, T, 'C2', { y: 850 });
    if (t > C3.start - .2 && t < C3.end + .2) lowerThird(ctx, t, T, 'C3', { y: 850 });
  };

  // the clips' last frames (for the closing screen when the kit's cache has none), then warm up the layers, then await pending images
  const LAST = {};
  for (const c of [C2, C3]) { for (let k = Math.round((c.end - c.start) * 30) + 1; k > 0; k--) { const f = `${ROOT}clips/${c.id}/f${String(k).padStart(5, '0')}.jpg`; if (fs.existsSync(f)) { LAST[c.id] = await loadImage(f); break; } } }
  const [wc, wg] = canvas(W, H);
  for (const tt of [tSit + 1, tMach + .3, tSkill]) { wg.setTransform(1, 0, 0, 1, 0, 0); frame(wg, tt); }
  await ready();

  const P = { riso: .3 };
  return [
    { t: HI.b, tr: 'cut', d: .1, print: HI.print, draw: frame, sound: [{ f: 'whoosh_airy', t: HI.b - .08, v: .45 }] },
    { t: tSit, tr: 'cut', d: .1, print: P, draw: frame },
    { t: S('02a', 'A plan') - .05, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'paper_pop', t: tPlan - .12, v: .4 }, { f: 'chime', t: tSong - .14, v: .35 }] },
    { t: tNow, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'shimmer_rings', t: tWho - .06, v: .5 }] },
    { t: tYoga, tr: 'cut', d: .1, print: P, draw: frame },
    { t: tThink, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'tick', t: tThink - .04, v: .45 }] },
    { t: tMach + .5, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'whoosh_up', t: tMach + .52, v: .35 }] },
    { t: tWatch, tr: 'cut', d: .1, print: P, draw: frame },
    { t: tElse - .1, tr: 'cut', d: .1, print: P, draw: frame },
    { t: tBud, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'whoosh_airy', t: C3.end + .45, v: .35 }] },
    { t: tGrow - .1, tr: 'cut', d: .1, print: HO.print, draw: frame, sound: [{ f: 'bloom', t: tGrow + .15, v: .45 }] },
  ];
};
