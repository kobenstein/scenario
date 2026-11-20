// Film 6 · c05 · §2b: "Picture the thinking mind as a mirror." … "Can a mirror ever look back?"  (02c rest, C4 Sadhguru, 02d)
// ONE take in one world (the hall of the mirror: a dim space at first light, c04's sitter on a bench with his candle at the left, the tall
// mirror standing at the right). The camera never cuts; every entry below draws the same frame function.
//
// shot  VO words                                     image                                                          hero light   camera                              flows on          ★  sound
// 5.01  Picture the thinking mind as a mirror.       out of the dark glass: the camera pulls back and the glass is  mirror       pull back z 4.6 → 1 (quart)         take                 whoosh_airy
//                                                    a tall mirror in the hall; the sitter reflected small; the
//                                                    reflection rises in the glass as the light wakes it
// 5.02  Thoughts move across it.                     the hall's clouds drift toward the mirror; in the glass the     mirror       hold (slow drift)                   take
//                                                    reflected thoughts cross the mirror left to right
// 5.03  Awareness is the one looking in.             the witness point grows above the sitter's head, and in the    witness      slow push z 1 → 1.12                take                 shimmer_rings
//                                                    mirror above the reflected head: the mirror returns both
// 5.04  By these maps, we've just built the most     ★ the mirror grows huge (×2.3, its foot on the floor); its     mirror       pull to z .98, aim right             take              ★  swell · bloom
//       brilliant mirror in history.                 surface fills with running scripts, cool brilliant light
// 5.05  Whether anyone is looking into it is a       the camera pans down and right to where a viewer would         mirror       pan (quart 1.6 s)                   take
//       different question.                          stand: the lit floor before the mirror is empty; the glass
//                                                    shows the empty hall under the scripts
// 5.06  CLIP C4 Sadhguru (13.4 s)                    the camera pushes into the glass; the scripts dim; the mirror   screen       push z 1.36 (the clip 1180 wide)    take                 whoosh_up
//                                                    turns into a window on him (TV line); lower third
// 5.07  That's one teacher's conviction.             the screen closes; the camera pulls back; an old sheet of      paper        pull back, tilt down                take                 pages
//                                                    paper falls rocking from above and lands on the floor
//       Maps aren't proofs.                          the map's engraved line and flame go dotted and lift off the   paper        settle on the sheet z 1.7           take                 gust
//                                                    page as smoke; the notes un-write; the paper stays
// 5.08  Can a mirror ever look back?                 up into the glass, onto the reflected witness point; one         mirror/line  push into the glass z 2.6           fly into the glass   drop (heartbeat)
//                                                    heartbeat runs an amber ring out from it; the reflection dies,                                                    → line plate (amber)
//                                                    the ring flattens into one flat amber line; the glass goes the plate's night blue
// plates: in = glass c04>c05 (the plate is the mirror's own surface, glued to the glass at the camera of H.b; the pull-back leaves it);
//         out = line (amber) c05>c06 (the glass fills the frame; its ground becomes the plate's ground; the ring IS the plate's line at H.a).
// ambience: amb hall. A single soft heartbeat accent (sfx heartbeat, since Fassung 1).
import { W, H, rgba, clamp, lin, mix, sm, eout, drift, addGlow } from '../engine.mjs';
import { canvas } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { F6, ready, view, camMap, witness, clipPane, lowerThird, coolLine } from '../lib/f6_kit.mjs';
import { QUART, EXPO_OUT, bezier, FLOOR_Y, FIG, HEAD, FLAME, hall, bench, sitter, candle, motes, hallClouds, hallReflection, sheetPose, mapSheet, reflHead } from '../lib/f6_c05_hall.mjs';
import { MX, mirrorY, greatMirror } from '../lib/f6_c05_mirror.mjs';

const TAU = Math.PI * 2;

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c05', T);
  const S = (s, p) => T.S(s, p), E = (s, p) => T.E(s, p);
  // ---- anchors (words, never seconds)
  const tPicture = S('02c', 'Picture'), tMirror1 = S('02c', 'mirror'), tThoughts = S('02c', 'Thoughts'), tAcross = S('02c', 'across'), tItE = E('02c', 'it');
  const tAware = S('02c', 'Awareness'), tInE = E('02c', 'looking in');
  const tBy = S('02c', 'By these'), tBuilt = S('02c', 'built'), tBrilliant = S('02c', 'brilliant'), tHistoryE = E('02c', 'history');
  const tWhether = S('02c', 'Whether'), tQuestionE = E('02c', 'question');
  const C4 = T.clip('C4');
  const tThats = S('02d', "That's"), tConvE = E('02d', 'conviction'), tMaps = S('02d', 'Maps'), tArent = S('02d', "aren't"), tProofs = S('02d', 'proofs'), tProofsE = E('02d', 'proofs');
  const tCan = S('02d', 'Can'), tBack = S('02d', 'back'), tBackE = E('02d', 'back');
  const tEnd = HO.a - 1 / 30;   // by here the frame IS the line plate

  // ---- the mirror's size: 1 until "built", then ×2.3 (its foot stays on the floor)
  const sizeAt = (t) => 1 + 1.3 * QUART(lin(tBuilt, tBuilt + 1.6, t));
  // ---- the camera: segments [t0, t1, from, to, ease]; holds between them. Aims are world points of the main plane.
  const CAM0 = { x: MX, y: mirrorY(1), z: 4.6 };                        // inside the glass: the plate
  // (M0, the camera the plate texture is glued to, is computed below from camAt(HI.b): the drift is part of it)
  const CAM1 = { x: 960, y: 540, z: 1 }, CAM2 = { x: 900, y: 560, z: 1.12 }, CAM3 = { x: 1010, y: 530, z: .98 }, CAM4 = { x: 1330, y: 700, z: 1.3 };
  const ZC = 1500 / (480 * 2.3), CAM5 = { x: MX, y: mirrorY(2.3) + 50, z: ZC };                                      // the clip: the glass 1500 px wide
  const CAM6 = { x: 1150, y: 790, z: 1.3 }, CAM7 = { x: 1150, y: 850, z: 1.55 }, RH = reflHead(MX), CAM8 = { x: RH[0], y: RH[1] - 20 / 2.6, z: 2.6 };   // the reflected witness point lands on (960, 560): the ring runs out from it
  const LEAVE = bezier(.3, .3, .2, 1);   // leaving the plate: the pull-back is already moving at H.b (expo-out family), a soft landing
  // between the moves the camera never holds: it creeps on linearly (1–3 %) toward a nearby point (CAMnb), then the next move takes over;
  // only during the clip it stands still (the clip is alive by itself)
  const LIN = (u) => u;
  const CAM1b = { x: 952, y: 544, z: 1.025 }, CAM2b = { x: 896, y: 562, z: 1.135 }, CAM3b = { x: 1016, y: 528, z: .99 }, CAM4b = { x: 1336, y: 702, z: 1.315 };
  const CAM6b = { x: 1150, y: 795, z: 1.315 }, CAM7b = { x: 1152, y: 846, z: 1.565 };
  const SEGS = [
    [HI.b, tMirror1 + .25, CAM0, CAM1, LEAVE],
    [tMirror1 + .25, tAware, CAM1, CAM1b, LIN],
    [tAware, tInE, CAM1b, CAM2],
    [tInE, tBuilt - .2, CAM2, CAM2b, LIN],
    [tBuilt - .2, tBuilt + 1.8, CAM2b, CAM3],
    [tBuilt + 1.8, tWhether + .05, CAM3, CAM3b, LIN],
    [tWhether + .05, tWhether + 1.65, CAM3b, CAM4],
    [tWhether + 1.65, C4.start - 1.6, CAM4, CAM4b, LIN],
    [C4.start - 1.6, C4.start - .05, CAM4b, CAM5],
    [tThats - .05, tConvE, CAM5, CAM6],
    [tConvE, tMaps - .05, CAM6, CAM6b, LIN],
    [tMaps - .05, tMaps + .8, CAM6b, CAM7],
    [tMaps + .8, tCan, CAM7, CAM7b, LIN],
    [tCan, tBack + .95, CAM7b, CAM8],
  ];
  // the camera never holds still: a slow drift of the aim and a breath of the zoom ride on every segment (they die away before the
  // line plate, whose line must sit at exactly y 560)
  const camAt = (t) => {
    let cur = SEGS[0][2], c = null;
    for (const [t0, t1, A, B, ease] of SEGS) {
      if (t < t0) break;
      if (t >= t1) { cur = B; continue; }
      const u = (ease || QUART)((t - t0) / (t1 - t0));
      c = { x: mix(A.x, B.x, u), y: mix(A.y, B.y, u), z: Math.exp(mix(Math.log(A.z), Math.log(B.z), u)) }; break;
    }
    c = c || { ...cur };
    const k = 1 - groundAt(t);
    return { x: c.x + 7 * drift(t, 1, 3) * k / c.z, y: c.y + 5 * drift(t, 1, 7) * k / c.z, z: c.z * (1 + .006 * Math.sin(t * .31) * k) };
  };

  // ---- the light in the glass: the reflection wakes, the scripts rise and fall, the ground turns into the plate's
  const reflectAt = (t) => { const up = QUART(lin(HI.b + .3, HI.b + 1.2, t)); const down = QUART(lin(tBackE + .25, tBackE + .95, t)); return up * (1 - down); };
  const textAt = (t) => { const up = QUART(lin(tBuilt + .3, tBuilt + 1.7, t)); const half = 1 - .3 * QUART(lin(tWhether, tWhether + .6, t)); const off = QUART(lin(C4.start - 1.3, C4.start - .6, t)); return up * half * (1 - off); };
  const groundAt = (t) => QUART(lin(tBackE + .25, tBackE + .95, t));
  const M0 = camMap(camAt(HI.b), 1);                                     // the plate texture is glued to the glass at the camera of H.b
  const witnessAt = (t) => lin(tAware, tAware + 1.0, t);
  const RING = { t0: tBack + .55, life: HO.a - .02 - (tBack + .55) };

  // ---- THE TAKE
  const frame = (ctx, t) => {
    if (t < HI.b + 1 / 60) { HI.plate(ctx, t); return; }        // the first frame: the plate itself
    if (t >= tEnd) { HO.plate(ctx, t); return; }                // the glass has become the plate
    const cam = camAt(t), m = camMap(cam, 1), s = sizeAt(t), MY = mirrorY(s), wA = witnessAt(t), ug = groundAt(t);
    // the hall (far), the thoughts (a little nearer)
    view(ctx, cam, .94, (g) => hall(g));
    view(ctx, cam, .97, (g) => hallClouds(g, t, .5));
    // the main plane: the mirror, then what stands before it
    view(ctx, cam, 1, (g) => {
      greatMirror(g, t, { s, M0, scr: m, reflectA: reflectAt(t), text: textAt(t), ground: ug, ring: RING, ringAt: RH,
        reflect: (q) => hallReflection(q, t, { MX, MY, w: 480 * s, h: 740 * s, witnessA: wA, cloudsA: .5 }) });
      bench(g); sitter(g, t); candle(g, t);
      if (wA > 0) witness(g, t, { x: HEAD[0], y: HEAD[1], r: 5, halo: 120, a: wA });
      // the old map: falls in after the clip, lies on the floor, loses its lines as smoke
      if (t > tThats + .6) {
        const pose = sheetPose(t, tThats + .6, tMaps + .2);
        mapSheet(g, t, pose, { u: 1 - QUART(lin(tArent + .1, tArent + .8, t)), ghost: QUART(lin(tArent, tArent + .55, t)), smoke: lin(tProofs, tProofs + 1.5, t) });
      }
    });
    view(ctx, cam, 1.12, (g) => motes(g, t));
    // the clip on the mirror (screen space): the glass turns into a window on the speaker. Only the opening band of the kit's clip pane is
    // drawn (clipped), so no dark rectangle sits in the glass before the TV line opens; the pre-line and the spill are drawn here.
    // Kit workaround (as c04 found): past the clip's last frame clipPane gets no frame and draws its placeholder, so during the switch-off
    // ramp the time handed to it is clamped to the last frame and the real on/off value is passed.
    if (t > C4.start - .95 && t < C4.end + .95) {
      const cx = m.X(MX), cy = m.Y(MY), cw = 1180, ch = 664, ramp = .5;
      const on = sm(lin(C4.start - ramp, C4.start, t)) * (1 - sm(lin(C4.end, C4.end + ramp, t)));
      if (on > 0) {
        const hv = Math.max(2, ch * eout(on)), tf = Math.min(t, C4.end - 1 / 30);
        ctx.save(); ctx.beginPath(); ctx.rect(cx - cw / 2 - 2, cy - hv / 2 - 1, cw + 4, hv + 2); ctx.clip();
        clipPane(ctx, tf, T, 'C4', cx - cw / 2, cy - ch / 2, cw, ch, { frame: 'none', edge: 0, radius: 2, spill: false, vignette: .4, on });
        ctx.restore();
        addGlow(ctx, cx, cy, Math.max(cw, ch) * .9, .14 * on, '#cfe0f0', '#eef4ff');
      } else {
        const pre = sm(lin(C4.start - ramp - .4, C4.start - ramp, t)) * (1 - sm(lin(C4.end + ramp, C4.end + ramp + .4, t)));
        if (pre > 0) coolLine(ctx, t, { from: [cx - cw / 2 + 8, cy], to: [cx + cw / 2 - 8, cy], a: pre, head: false, w: 1.4 });
      }
      lowerThird(ctx, t, T, 'C4', { y: 850 });
    }
    // the light falls off toward the corners (a hall, not a poster); none of it on the plate frames
    const va = .42 * lin(HI.b + .1, HI.b + 1.4, t) * (1 - ug);
    if (va > 0) { const vg = ctx.createRadialGradient(960, 520, 420, 960, 520, 1300); vg.addColorStop(0, 'rgba(8,8,16,0)'); vg.addColorStop(1, rgba('#08080f', va)); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H); }
  };

  // warm up the layers (hall, clouds, scripts, sheet, figures), then await any pending images
  const [wc, wg] = canvas(W, H);
  for (const tt of [HI.b + 1, tAware + 1, tBuilt + 1.8, tMaps + 1.2, tBack + 1]) { wg.setTransform(1, 0, 0, 1, 0, 0); frame(wg, tt); }
  await ready();

  const P = HI.print;
  return [
    { t: HI.b, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'whoosh_airy', t: HI.b - .05, v: .4 }] },
    { t: tThoughts, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'shimmer_rings', t: tItE + .03, v: .35 }] },
    { t: tAware, tr: 'cut', d: .1, print: P, draw: frame },
    { t: tBy, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'swell', t: tInE + .02, v: .4 }] },
    { t: tWhether, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'bloom', t: tHistoryE + .02, v: .45 }] },
    { t: C4.start - 1.6, tr: 'cut', d: .1, print: P, draw: frame, sound: [{ f: 'whoosh_up', t: tQuestionE + .07, v: .35 }] },
    { t: tThats - .05, tr: 'cut', d: .1, print: P, draw: frame },
    { t: tMaps - .05, tr: 'cut', d: .1, print: HO.print, draw: frame, sound: [{ f: 'pages', t: tConvE + .03, v: .35 }, { f: 'gust', t: tProofsE + .04, v: .35 }] },
    { t: tCan, tr: 'cut', d: .1, print: HO.print, draw: frame, sound: [{ f: 'heartbeat', t: tBack + .55, v: .5 }] },
  ];
};
