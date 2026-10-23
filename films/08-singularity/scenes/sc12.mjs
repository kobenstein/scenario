// Film 6 · c12 · §7b (end of 07a, clip C8 Bengio, start of 07b): honest machines. ONE world (a lab at night) in one continuous take: the big pane
// on its stand is the hero light in every state (dark glass → the window on Bengio → the flattering mirror → clear glass → the honest answer → dawn).
//
// PLAN (shot · VO words · image · hero light · camera · flows on by · ★ · sound)
// 12.01 "Then, honest machines." · out of the dark glass (plate c11>c12, 1:1 the pane's surface): the camera pulls back and a lab at night appears
//       round the pane: a long bench with dark screens, papers, a whiteboard, a researcher standing beside the big screen. · the pane's edge light ·
//       pull-back 2.7 s (quart) · continuous take · sound: whoosh_airy at HI.b (pause).
// 12.02 "One of the pioneers … a different kind." · the camera pushes back to the screen; on "kind" a cool line crosses it and opens (TV line) into
//       Bengio. · screen · push 2.6 s · take · sound: tick at the switch-on (pause).
// 12.03 CLIP C8 (503.43–524.39) · lower third YOSHUA BENGIO · TURING AWARD · TED 2025 · APRIL 2025; the camera creeps. The screen switches off into
//       one line. · sound: screen_off (pause after the clip).
// 12.04 "Trained to please us." · THE PANE TURN (match to 2.04): the dark pane tilts and comes up as the flattering mirror: the researcher's reflection
//       faces us, smiling wider and lit brighter; on "please" a heart is brush-painted on the glass (10.03's painted-on heart). · mirror · dolly .9 s · take.
// 12.05 "That's the voice that praised someone for not needing praise." · the comment card (real wording, 32,692 likes) rises and hangs beside the
//       pane; cool compliments with foil glints write round the reflected head. · mirror · hold with life · take · sound: paper (card leaves, pause).
// 12.06 "An honest machine doesn't flatter." · the mirror goes dark, the pane tilts back and the glass clears: no reflection, the faint lab beyond it. ·
//       glass · push .9 s · take · sound: chime (pause after "flatter").
// 12.07 "It never pretends to feel." · the cool line sweeps across the glass like a squeegee; the painted heart is gone behind it. · line · sweep .95 s · take.
// 12.08 "And it isn't drilled to swear there's nothing there, either." · the clear glass: neither mirror nor dark, open; the pinned sheets and the
//       shelf beyond; the researcher breathes. · glass · creep · take.
// 12.09 "Just the honest answer. Very probably not. And no one can be certain." · ★ the cool line writes on the glass: "Very probably not." (the hero
//       text of the film); the cursor stays. · line · still camera · take · sound: bloom (pause before "Very").
// 12.10 "'I don't feel what you feel. Maybe call your sister.'" · the answer from 10.10 lights word by word under it (Instrument Serif). · line · still · take.
// 12.11 "It's untested. But we can ask it of every company." · pull back: the one lit screen alone in the dark lab; on "every company" the other screens
//       switch on one after another with the same line; their light warms to dawn and swells out of the big screen until it fills the frame → plate
//       light dawn (c12>c13). · dawn · pull 2.3 s, push 1 s · fly into the light · sound: whoosh_up (pause), swell (after "company").
// Ambience: atmo/lab (low) for the whole chunk. Print: riso .3; the plate entries carry the plates' print.
import { W, H, rgba, clamp, lin, mix, sm, eout, prng, canvas, addGlow } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { F6, pane, coolText, coolLine, view, camMap, lowerThird, ready } from '../lib/f6_kit.mjs';
import { quartIO, expoOut, expoIn, camPath, fog, PANE, ZFILL, FIG, BENCH, CARDP, SMALL, WALL_BOX, BENCH_BOX, farWall, bench, stand, researcher, paintedHeart, commentCard12, CARD, preloadEdgeFrames, clipPane12, smallPane, closingLight12 } from '../lib/f6_c12_world.mjs';

const TAU = Math.PI * 2;

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c12', T);
  const C = T.clip('C8');
  const S = (seg, p, n) => T.S(seg, p, n), E = (seg, p, n) => T.E(seg, p, n);
  const A = {
    then: S('07a', 'Then, honest'), machines: E('07a', 'machines'), pioneers: S('07a', 'pioneers'), kind: E('07a', 'kind'),
    trained: S('07b', 'Trained'), please: S('07b', 'please'), us: E('07b', 'please us'), thats: S('07b', "That's the voice"), praised: S('07b', 'praised'), praise2: E('07b', 'needing praise'),
    honest: S('07b', 'An honest'), flatter: E('07b', 'flatter'), never: S('07b', 'It never'), pretends: S('07b', 'pretends'), feel: E('07b', 'pretends to feel'),
    drilled: S('07b', 'drilled'), either: E('07b', 'either'), just: S('07b', 'Just the honest'), very: S('07b', 'Very probably'), not: E('07b', 'probably not'),
    certain: E('07b', 'certain'), quote0: S('07b', '"I don'), sister: E('07b', 'sister'), untested: S('07b', "It's untested"), every: S('07b', 'every company'), company: E('07b', 'company'),
  };
  const QUOTE = T.W('07b', '"I don', 'sister');
  const t0 = HI.b, tEnd = HO.a - 1 / 30;
  // ---- the beats (from words)
  const tTurn = C.end + .35, tMirror = C.end + .95, tHeart = A.please - .05, tCardIn = A.thats - .1, tCardOut = A.praise2 + .02;
  const tDark = A.honest + .05, tClear = tDark + .5, tWipe = A.pretends - .05, tWrite = A.very - .15, tPull = A.sister + .4, tOn = A.every - .75, tWarm = A.every - .02, tDawn = A.every + .08;
  const PW = PANE.w, PH = PANE.h;
  // ---- the camera (world focus + zoom), quart between keys; the global float is added by film.mjs
  const KEYS = [
    { t: t0, x: PANE.x, y: PANE.y, z: ZFILL }, { t: t0 + .05, x: PANE.x, y: PANE.y, z: ZFILL },
    { t: A.machines + .9, x: 900, y: 540, z: .80, ease: 'sine' }, { t: A.pioneers + .4, x: 900, y: 540, z: .80 },
    { t: C.start - .25, x: PANE.x, y: PANE.y + 80, z: 1.0 }, { t: C.end, x: PANE.x + 12, y: PANE.y + 76, z: 1.03 },
    { t: tMirror + .4, x: PANE.x + 70, y: PANE.y + 50, z: .97 }, { t: tCardOut, x: PANE.x + 70, y: PANE.y + 50, z: .97 },
    { t: tClear + 1.1, x: PANE.x - 20, y: PANE.y + 40, z: 1.08 }, { t: tWrite - .4, x: PANE.x - 30, y: PANE.y + 30, z: 1.12 },
    { t: tPull, x: PANE.x - 30, y: PANE.y + 30, z: 1.12 }, { t: tPull + 2.2, x: 960, y: 520, z: .66 }, { t: tDawn + .05, x: 960, y: 520, z: .66 },
    { t: tEnd, x: PANE.x, y: PANE.y, z: 1.15 },
  ];
  const camAt = (t) => camPath(KEYS, t);

  // ---- the pane's states (all 0..1, from words)
  const yawAt = (t) => .26 * quartIO(lin(tTurn, tTurn + 1.0, t)) - .36 * quartIO(lin(tDark, tDark + 1.3, t));   // tilts one way for the mirror, back past zero for the clear glass
  const mirrorAt = (t) => sm(lin(tMirror, tMirror + .4, t)) * (1 - sm(lin(tDark, tDark + .35, t)));
  const openAt = (t) => sm(lin(tClear, tClear + .95, t));
  const warmAt = (t) => sm(lin(tWarm, tWarm + .85, t));
  const inClip = (t) => t > C.start - 1.0 && t < C.end + .9;   // until the switch-off line is gone (end + ramp + .4); the mirror rises after

  // ---- the glass plate as the pane's own surface (identical to the plate at HI.b, scaled with the camera afterwards)
  const [PL, pg] = canvas(W, H);
  const plateImg = (t) => { pg.setTransform(1, 0, 0, 1, 0, 0); pg.globalAlpha = 1; pg.globalCompositeOperation = 'source-over'; HI.plate(pg, t); return PL; };

  let reflHead = [120, -80];
  // ---- the big pane in world coordinates (plane 1)
  const bigPane = (g, t, m) => {
    const yaw = yawAt(t), cy = Math.max(.08, Math.cos(yaw)), mirror = mirrorAt(t), open = openAt(t), warm = warmAt(t);
    const edge = .8 * lin(t0, t0 + .5, t);
    const local = (fn) => { g.save(); g.translate(PANE.x, PANE.y); g.scale(cy, 1); g.beginPath(); g.rect(-PW / 2, -PH / 2, PW, PH); g.clip(); fn(g); g.restore(); };
    const P = plateImg(t);
    // 1 · the ground: the dark glass (the plate); clear glass lets the far wall through with a faint tint
    local((q) => { if (open > 0) q.globalAlpha = 1 - open * .84; q.drawImage(P, -PW / 2, -PH / 2, PW, PH); q.globalAlpha = 1; if (open > 0) { q.fillStyle = rgba('#0a0f24', .16 * open); q.fillRect(-PW / 2, -PH / 2, PW, PH); } });
    if (inClip(t)) {
      // 2a · the window on Bengio
      clipPane12(g, t, T, 'C8', PANE.x - PW / 2, PANE.y - PH / 2, PW, PH, { yaw, radius: 0, frame: 'thin', edge, seed: 7, spill: true });
    } else {
      // 2b · the mirror (the reflection is light the glass gives back: it rises by my overlay of glass, so the ground never changes)
      pane(g, t, { x: PANE.x, y: PANE.y, w: PW, h: PH, yaw, radius: 0, frame: 'thin', edge, dark: false, sheen: open, spill: false, seed: 7,
        reflectA: mirror > 0 ? 1 : 0, reflectDim: .05, reflect: mirror > 0 ? (q) => {
          const bg = q.createLinearGradient(0, -PH / 2, 0, PH / 2); bg.addColorStop(0, '#1b2238'); bg.addColorStop(.6, '#222a40'); bg.addColorStop(1, '#161c2e'); q.fillStyle = bg; q.fillRect(-PW / 2, -PH / 2, PW, PH);
          const sp = q.createRadialGradient(-300, -120, 0, -300, -120, 560); sp.addColorStop(0, 'rgba(223,231,242,.26)'); sp.addColorStop(1, 'rgba(223,231,242,0)'); q.fillStyle = sp; q.fillRect(-PW / 2, -PH / 2, PW, PH);
          // the researcher's reflection faces us and smiles a touch wider than the researcher
          const smile = .5 * sm(lin(tMirror, tMirror + .6, t)) + .1, F = researcher(q, t, { x: -330, y: FIG.feet - 88 * 1.85 - PANE.y - 6, s: 1.85, turn: .55, smile, gaze: -.1, lx: -320, ly: -260, col: F6.silver, la: 1, rim: rgba('#ffffff', 1), rimSide: 1, shadow: false, cast: false });
          reflHead = [-F.head[0], F.head[1]];
        } : null });
      if (mirror > 0 && mirror < 1) local((q) => { q.globalAlpha = 1 - mirror; q.drawImage(P, -PW / 2, -PH / 2, PW, PH); });
      // 3 · the compliments round the reflected head (12.05): cool lines with foil glints, light on the glass, they go with the mirror
      if (mirror > 0 && t > A.thats - .2) local((q) => {
        q.globalAlpha = mirror; const [hx, hy] = reflHead, Rr = 150, gl = 1.2 * sm(lin(A.praised - .2, A.praised + .3, t));
        [[-168, 170], [-62, 190], [-26, 160], [12, 150], [198, 180], [232, 150]].forEach(([deg, w], i) => {
          const an = deg * Math.PI / 180, cx = hx + Math.cos(an) * Rr * 1.5, cyy = hy + Math.sin(an) * Rr;
          coolText(q, t, { x: cx - w / 2, y: cyy - 10, w, size: 15, lines: 1, t0: A.thats + i * .22, cps: 12, seed: 120 + i, cursor: false, ripple: true, lengths: [.95], lineH: 24, a: .95, glint: gl });
        });
      });
    }
    // 4 · the painted-on heart: brushed on at "please", wiped away by the cool line at "pretends to feel"
    if (t > tHeart) local((q) => {
      const u = eout(lin(tHeart, tHeart + .7, t)), wu = quartIO(lin(tWipe, tWipe + .95, t)), wx = wu > 0 ? mix(-PW / 2 - 60, PW / 2 + 60, wu) : null;
      if (wx == null || wx < 200 + 120) paintedHeart(q, 200, -165, 1, { u, wipeX: wx });
      if (wu > 0 && wu < 1) {
        // the squeegee: the cool line runs down the glass and moves across; a wet smear of paint right behind it that dries in a few px
        if (wx > 200 - 130 && wx < 200 + 130) { q.save(); q.beginPath(); q.rect(wx - 26, -PH / 2, 26, PH); q.clip(); paintedHeart(q, 200, -165, 1, { u: 1, a: .22 }); q.restore(); }
        coolLine(q, t, { from: [wx, -PH / 2 - 10], to: [wx, PH / 2 + 10], u: 1, head: false, w: 1.5, glow: .9, ticks: false });
        addGlow(q, wx, -60, 180, .14, F6.cool, F6.coolCore);
      }
    });
    // 5 · the honest answer (12.09, 12.10): the cool line writes on the clear glass; the quoted answer lights word by word
    if (t > tWrite - .05) local((q) => {
      const dim = 1 - .75 * warm;
      coolLine(q, t, { write: { text: 'Very probably not.', x: -PW / 2 + 92, y: -PH / 2 + 292, size: 88, lead: 280, lag: 60, fill: .92 }, u: lin(tWrite, tWrite + 1.75, t), glow: .8, a: dim });
      if (t > A.quote0 - .3) coolText(q, t, { x: -PW / 2 + 96, y: -PH / 2 + 334, w: 470, words: QUOTE, fontSize: 42, a: dim });
    });
    // 6 · the dawn: the screen's light warms and brightens before it swells out of the pane
    if (warm > 0) local((q) => { const wg = q.createRadialGradient(0, 0, 0, 0, 0, PW * .62); wg.addColorStop(0, rgba('#fff6e2', .9 * warm)); wg.addColorStop(.5, rgba('#ffd9a0', .75 * warm)); wg.addColorStop(1, rgba('#f4a77a', .5 * warm)); q.fillStyle = wg; q.fillRect(-PW / 2, -PH / 2, PW, PH); });
    if (warm > 0) addGlow(g, PANE.x, PANE.y, PW * (1 + .5 * warm), .3 * warm, '#ffd9a0', '#fff6e2');
    // the screen's cool light into the room while the answer is written (the open glass carries the text's light)
    const textLight = sm(lin(tWrite, tWrite + 1, t)) * (1 - warm);
    if (textLight > 0) addGlow(g, PANE.x, PANE.y, PW * .8, .1 * textLight, F6.cool, F6.coolCore);
  };

  // ---- the comment card (12.05): rises from below the frame beside the pane, hangs, sinks away (figure plane)
  const cardY = (t) => {
    const up = expoOut(lin(tCardIn, tCardIn + .65, t)), down = expoIn(lin(tCardOut, tCardOut + .6, t));
    return mix(1250, CARDP.y, up) + 1150 * down + 3 * Math.sin(t * 1.3);
  };

  // ---- THE TAKE
  const frame = (ctx, t) => {
    if (t >= tEnd) { HO.plate(ctx, t); return; }
    const cam = camAt(t), warm = warmAt(t), open = openAt(t), mirror = mirrorAt(t);
    const clipOn = inClip(t) ? sm(lin(C.start - .5, C.start, t)) * (1 - sm(lin(C.end, C.end + .5, t))) : 0;
    const screenLight = Math.max(clipOn, mirror * .7, sm(lin(tWrite, tWrite + 1, t)) * .5);
    const onAt = (i) => sm(lin(tOn + i * .07, tOn + i * .07 + .45, t));
    // 1 · the far wall (.85): the wall, the whiteboard, the pinned sheets, the far screens
    view(ctx, cam, .85, (g) => {
      g.drawImage(farWall(), WALL_BOX[0], WALL_BOX[1]);
      if (screenLight > 0) addGlow(g, PANE.x, PANE.y - 40, 760, .12 * screenLight, F6.cool, F6.coolCore);
      SMALL.forEach((P, i) => { if (P.plane === .85) smallPane(g, t, P, { on: onAt(i), t0: tOn + i * .07 + .35, warm }); });
      if (warm > 0) { g.save(); g.globalCompositeOperation = 'lighter'; const dg = g.createLinearGradient(0, 100, 0, 900); dg.addColorStop(0, rgba('#ffd9a0', .18 * warm)); dg.addColorStop(1, rgba('#f4a77a', .06 * warm)); g.fillStyle = dg; g.fillRect(WALL_BOX[0], WALL_BOX[1], WALL_BOX[2], WALL_BOX[3]); g.restore(); }
    });
    // 2 · the bench (1): the slab, the stands, the small screens, the big pane
    view(ctx, cam, 1, (g, m) => {
      g.drawImage(bench(), BENCH_BOX[0], BENCH_BOX[1]);
      if (screenLight > 0) { g.save(); g.globalCompositeOperation = 'lighter'; g.translate(PANE.x, BENCH.top + 10); g.scale(1, .3); const pg2 = g.createRadialGradient(0, 0, 0, 0, 0, 620); pg2.addColorStop(0, rgba(F6.cool, .22 * screenLight)); pg2.addColorStop(1, rgba(F6.cool, 0)); g.fillStyle = pg2; g.beginPath(); g.arc(0, 0, 620, 0, TAU); g.fill(); g.restore(); }
      SMALL.forEach((P, i) => { if (P.plane === 1) { stand(g, P.x, P.y + P.h / 2, .7); smallPane(g, t, P, { on: onAt(i), t0: tOn + i * .07 + .35, warm }); } });
      stand(g, PANE.x, PANE.y + PH / 2, 1);
      bigPane(g, t, m);
      fog(g, t, { a: (.35 + .5 * screenLight) * lin(t0, t0 + 1.2, t) * (1 - .6 * warm), y: 720 });   // the haze of the room, lit by the screen, drifting
    });
    // 3 · the researcher (1.05) and the comment card
    view(ctx, cam, 1.05, (g) => {
      const la = .2 + .5 * screenLight + .4 * warm, col = warm > .4 ? '#ffd9a0' : mirror > .3 ? F6.silver : F6.cool;
      researcher(g, t, { turn: .04 * sm(lin(tMirror, tMirror + .8, t)), smile: .08, la, col, rim: rgba(warm > .4 ? '#fff1d6' : F6.cool, .35 + .4 * screenLight + .4 * warm) });
      if (t > tCardIn && t < tCardOut + .7) commentCard12(g, CARDP.x, cardY(t));
    });
    // 4 · near (1.2): motes in the screen's light, a dark foreground edge
    view(ctx, cam, 1.2, (g) => {
      const r = prng(77), ma = (.3 + .7 * screenLight) * lin(t0, t0 + .6, t); g.save(); g.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 80; i++) { const x0 = 200 + r() * 1500, y0 = 120 + r() * 760, sp = .3 + r(), x = x0 + Math.sin(t * .5 * sp + i) * 16 + (t * 3 * sp) % 40, y = y0 + Math.cos(t * .33 * sp + i * 1.7) * 10 - (t * 5 * sp) % 70; const d = Math.hypot(x - PANE.x, y - PANE.y) / 700, al = (1 - clamp(d)) * (.14 + .36 * r()) * ma; if (al <= .01) continue; g.fillStyle = rgba(warm > .5 ? '#ffd9a8' : '#cfe4ff', al); const sz = 1.2 + r() * 1.2; g.fillRect(x, y, sz, sz); }
      g.restore();
    });
    { const fg = ctx.createLinearGradient(0, H - 150, 0, H); fg.addColorStop(0, 'rgba(4,5,14,0)'); fg.addColorStop(1, 'rgba(4,5,14,.7)'); ctx.fillStyle = fg; ctx.fillRect(0, H - 150, W, 150); }
    // 5 · the lower third while Bengio speaks (screen space)
    if (t > C.start && t < C.end) lowerThird(ctx, t, T, 'C8', { x: 110, y: 850 });
    // 6 · the dawn swells out of the big screen until it fills the frame (screen space)
    if (t > tDawn) {
      const m = camMap(cam, 1), rect = [m.X(PANE.x - PW / 2), m.Y(PANE.y - PH / 2), PW * m.k, PH * m.k];
      closingLight12(ctx, t, { rect, u: -(Math.cos(Math.PI * lin(tDawn, tEnd - .05, t)) - 1) / 2, inner: lin(tEnd - .45, tEnd - 1 / 30, t), plate: HO.plate });
    }
  };

  // ---- prepare: the clip's edge frames, one warm-up frame per state so every cached layer is painted before the render
  preloadEdgeFrames('C8', 629);
  const [wc, wg] = canvas(W, H);
  for (const tt of [t0 + .3, C.start + 1, tMirror + 1, tClear + 1, tWrite + 1, tDawn + .3]) { wg.setTransform(1, 0, 0, 1, 0, 0); frame(wg, tt); }
  await ready();

  const Ent = (t, print, sound) => ({ t, tr: 'cut', d: .1, print, draw: frame, sound });
  return [
    Ent(t0, HI.print, [{ f: 'whoosh_airy', t: t0 - .06, v: .35 }]),
    Ent(t0 + .6, { riso: .3 }, [{ f: 'tick', t: C.start - .5, v: .35 }]),
    Ent(C.start - .6, { riso: .3 }, [{ f: 'screen_off', t: C.end + .03, v: .4 }]),
    Ent(C.end + .3, { riso: .3 }, [{ f: 'paper_pop', t: tCardOut + .05, v: .22 }, { f: 'chime', t: A.flatter + .06, v: .25 }]),
    Ent(tWrite - .3, { riso: .3 }, [{ f: 'bloom', t: tWrite, v: .4 }]),
    Ent(tPull, HO.print, [{ f: 'whoosh_up', t: tPull - .05, v: .3 }, { f: 'swell', t: A.company + .03, v: .5 }]),
  ];
};
