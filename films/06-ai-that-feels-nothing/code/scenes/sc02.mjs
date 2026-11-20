// Film 6 · c02 · §1a (01a + clip C1 Harari): the praise comment, the voice in the mirror, the shrug, the dog, the Turing test, the wall of
// talking panes, Harari. ONE world in two rooms, drawn by one continuous take(): the slate mirror room and, inside its pane, the glass world.
//
// PLAN (shot · VO words · image · hero light · camera · flows on by · ★ · sound)
// 2.01 "Someone once asked an AI to stop praising them." · we pull back out of the dark glass (plate c01>c02): it is a tall standing pane in a slate
//      room; a plain cream line types on it (the request), then the machine's answer builds in cool lines and SPARKLES (foil glints = praise).
//      To the right, in the dark: you, from the side, and a dog sitting at your heel. · the screen · pull-back 3.3 s (quart) · continuous take.
// 2.02 "It told them how special they were…" · the comment card (cream paper, the real wording) rises from below and lands beside the pane
//      (expo-out) in the pause before the sentence. · screen + card · creep · take · sound: card 51.9.
// 2.03 "Thousands of people liked that comment." · the heart on the card beats, the number runs up to 32,692 (real, YouTube API 20 Oct 2026),
//      small hearts rise as stipple and vanish. · card · creep · take.
// 2.04 "We laugh, because we know that voice." · THE PANE TURN: the screen switches off into a line (old TV), a dark moment, the glass tilts a few
//      degrees and comes up as a mirror: your reflection faces us, smiling wider and lit brighter than you. · the mirror · dolly left 1.6 s · take ·
//      sound: whoosh_airy 58.2 (pause).
// 2.05 "It always knows what you want to hear." · cool lines of text write themselves on the glass round the reflected head, a halo of
//      compliments (unreadable glyphs, 12/s). · mirror · hold with life · take.
// 2.06 "So most of us shrug. No one in there. Just a tool." · you shrug (forearms out, shoulders up, 0.4 s), the mirror goes dark on "No one in
//      there" (the glass gives nothing back), on "Just a tool" the pane's edge light dims and the camera leaves it. · mirror → dark · dolly right
//      2 s · take · sound: drop 66.2 (pause).
// 2.07 "Until now, we had a simple rule." · the dog, sitting, listening: the ember glows up softly in its eye (the one warm light), its ear perks;
//      you turn your head to it. · ember (the dog's eye) · hold with life · take.
// 2.08 "If something talks back, someone is there." · you speak (a nod); the dog answers on "back": head tilt, ear, a small yap; you react 100 ms
//      later (turn, chin up). · ember · hold · take · sound: dog_wuff 72.4 (new, quiet).
// 2.09 "Now it's the other way round." · the camera swings back and pushes INTO the dark pane; inside the glass two chat windows switch on (a warm
//      one = the human, a cool one = the machine), `HUMAN?` over each; the mark jumps to the cool one (the judge picks the machine). On screen:
//      JONES & BERGEN · UC SAN DIEGO · 2025 · TURING TEST. · screens · push 2.8 s into the surface · fly-into: at 76.42 the pane fills the frame
//      and we are inside the glass world · sound: tick 76.25 (pause), whoosh_up 76.1.
// 2.10 "Machines talk better than ever." · the camera pulls back and sideways: a wall of panes switches on one after another (TV lines), all
//      talking in cool lines, three parallax planes + a dark foreground. · screens · dolly 2.3 s · take.
// 2.11 "And as far as we can tell, they feel nothing." · the wall: not one ember anywhere; the camera finds the one dark pane and pushes to it;
//      a cool line appears on it and opens into Harari. · screens · dolly 3.1 s · take · sound: chime 81.75 (pause).
// 2.12 CLIP C1 (82.30–103.07) · lower third YUVAL NOAH HARARI · HISTORIAN · YOUTUBE · JULY 2024. In the last 2 s the camera pushes in until the pane
//      fills the frame; the screen's light collapses to one horizontal cool line (0.2 s) → plate line (c02>c03). · sound: screen_off 103.0.
// ★: the pane turn (2.04): the voice is your own reflection, nicer than you.
import { W, H, rgba, clamp, lin, mix, sm, eout, prng, drift, text, addGlow } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { clipFrame } from '../lib/kit.mjs';
import { F6, ready, once, pane, coolText, coolLine, ember, view, camMap, clipPane, lowerThird, reveal, breathe } from '../lib/f6_kit.mjs';
import { figure, POSES } from '../lib/figure.mjs';
import { fibreFill } from '../lib/print.mjs';
import { quart, expo, camPath, glassGround, roomGround, FLOOR, GROUND, commentCard, CARD, dog, switchOn, wallWorld, CHAT, HARARI, clipPaneC02, preloadFirstFrame } from '../lib/f6_c02_world.mjs';

const TAU = Math.PI * 2;
const mixHex = (a, b, u) => { const A = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)], B = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)]; return '#' + A.map((v, i) => Math.round(mix(v, B[i], u)).toString(16).padStart(2, '0')).join(''); };

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c02', T);
  const S = (p, n) => T.S('01a', p, n), E = (p, n) => T.E('01a', p, n);
  const A = {
    asked: S('asked'), stop: S('stop'), praising: S('praising'), told: S('It told'), special: S('special'), thousands: S('Thousands'), liked: S('liked'),
    comment: E('comment'), laugh: S('We laugh'), always: S('It always'), hear: E('hear'), shrug: S('shrug'), noone: S('No one'), tool: S('Just a tool'),
    until: S('Until'), ifs: S('If something'), back: S('back'), there: E('is there'), now: S('Now it'), round: S('round'), machines: S('Machines'),
    ever: E('ever'), and: S('And as far'), nothing: E('nothing'),
  };
  const C = T.clip('C1');
  // ---- the room (world coordinates at cam z 1)
  const PANE = { x: 700, y: 540, w: 760, h: 640 }, KF = PANE.w / W, ZFILL = W / PANE.w;   // the pane fills the frame at z = ZFILL (1:1 with the plate)
  const FIG = { x: 1180, feet: 892, s: 2.0 }, DOG = { x: 1560, y: 893, s: 2.3 }, CARDP = { x: 1180, y: 100 };
  // ---- the beats (all from words)
  const tCard = A.told - .55, tTurn = A.comment + .2, tDark = A.noone - .1, tShrug = A.shrug - .15, tLook = A.until, tNod = A.ifs, tAns = A.back + .1;
  const tBack = A.there - .15, tFill = A.round + .9, tChat = A.now - .1, tJump = A.round + .74, tWallOn = A.machines - .1, tPush = C.end - 2.05;
  const ROOMCAM = [
    { t: HI.b, x: PANE.x, y: PANE.y, z: ZFILL }, { t: A.stop, x: 900, y: 540, z: 1.04 }, { t: A.told, x: 935, y: 535, z: 1.045 }, { t: A.comment, x: 990, y: 525, z: 1.06 },
    { t: tTurn + 1.6, x: 930, y: 560, z: 1.12 }, { t: A.hear, x: 920, y: 562, z: 1.14 }, { t: A.tool, x: 915, y: 566, z: 1.14 }, { t: A.until + .7, x: 1390, y: 590, z: 1.3 },
    { t: tBack, x: 1400, y: 592, z: 1.3 }, { t: tFill, x: PANE.x, y: PANE.y, z: ZFILL * 1.02 },
  ];
  const WALLCAM = [
    { t: tFill, x: W / 2, y: H / 2, z: 1.02 }, { t: A.ever + .4, x: 1250, y: 560, z: .64 }, { t: C.start - .5, x: HARARI.x, y: HARARI.y + 88, z: 1 },
    { t: tPush, x: HARARI.x, y: HARARI.y + 88, z: 1 }, { t: C.end - .02, x: HARARI.x, y: HARARI.y, z: 1.66 },
  ];

  // ---- you: one pose timeline for the real figure and its reflection
  const figPose = (t, refl) => {
    const shr = sm(lin(tShrug, tShrug + .4, t)) * (1 - sm(lin(tShrug + 1.0, tShrug + 1.5, t)));
    const look = eout(lin(tLook, tLook + .6, t)), react = eout(lin(tAns + .1, tAns + .4, t));
    const nu = clamp((t - tNod) / .9), nod = nu > 0 && nu < 1 ? Math.sin(nu * TAU) * Math.sin(Math.PI * nu) : 0;
    const smile = .35 * sm(lin(A.laugh, A.laugh + .5, t)) * (1 - sm(lin(tShrug, tShrug + .4, t)));
    return { ...POSES.stand, head: .05 + nod * .06 + shr * .06 - react * .04, lean: .02 - shr * .02 - react * .015, sh: [mix(.25, .78, shr), mix(.18, .66, shr)], el: [mix(.45, 1.35, shr), mix(.4, 1.3, shr)],
      dy: -3 * shr, turn: refl ? .55 : .6 * look + .3 * react, smile: refl ? smile + .45 : smile, gaze: refl ? -.1 : .1 };
  };
  const emberA = (t) => sm(lin(tLook - .3, tLook + .4, t));
  let reflHead = [0, 0];

  // ---- the glass world as seen through the room pane (pane-local coords, origin = the pane's centre): wall space scaled by KF
  const wallOpts = (t, cam) => ({ T, cam, chatOn: sm(lin(tChat, tChat + .5, t)), jump: lin(tJump, tJump + .28, t), jumpT: t - tJump - .28, t0: tChat, wallOn: tWallOn,
    harari: (g) => { const on = sm(lin(tWallOn + 1.1, tWallOn + 1.55, t)); switchOn(g, t, on, HARARI.x - HARARI.w / 2, HARARI.y - HARARI.h / 2, HARARI.w, HARARI.h, (q) => clipPaneC02(q, t, T, 'C1', HARARI.x - HARARI.w / 2, HARARI.y - HARARI.h / 2, HARARI.w, HARARI.h, { frame: 'thin', on: t >= C.end ? 1 : undefined })); } });
  const throughPane = (g, t, fn) => { g.save(); g.translate(-W / 2 * KF, -H / 2 * KF); g.scale(KF, KF); fn(g); g.restore(); };

  // ---- the standing pane in the room: glass (= the plate), the chat, the mirror, the halo, the glass world
  const drawPane = (g, t, m) => {
    const yaw = .3 * sm(lin(tTurn, tTurn + 1.2, t)) * (1 - sm(lin(tBack, tBack + 1.3, t))), cy = Math.cos(yaw);
    const screenOn = 1 - sm(lin(tTurn + .2, tTurn + .5, t)), haze = sm(lin(A.praising + .1, A.praising + .6, t)) * screenOn;
    const mirror = sm(lin(tTurn + .62, tTurn + 1.0, t)) * (1 - sm(lin(tDark, tDark + .45, t)));
    const edge = .8 * lin(HI.b, HI.b + .4, t) * (1 - .65 * sm(lin(A.tool, A.tool + .5, t)) * (1 - sm(lin(tChat, tChat + .4, t))));
    const local = (fn) => { g.save(); g.translate(PANE.x, PANE.y); g.scale(cy, 1); g.beginPath(); g.roundRect(-PANE.w / 2, -PANE.h / 2, PANE.w, PANE.h, 3); g.clip(); fn(g); g.restore(); };
    // 1 · the glass: the plate's ground seen through the pane (at HI.b it is the plate itself, 1:1)
    local((q) => throughPane(q, t, (w) => glassGround(w, t)));
    // 2 · the mirror (pane() draws the reflection; its strength is my overlay of glass over it, so it ends in the same glass texture)
    const P = pane(g, t, { x: PANE.x, y: PANE.y, w: PANE.w, h: PANE.h, yaw, frame: 'mirror', edge, radius: 3, dark: false, sheen: 0, spill: false,
      reflectA: mirror > 0 ? 1 : 0, reflectDim: .04, reflect: mirror > 0 ? (q) => {
        const bg = q.createLinearGradient(0, -PANE.h / 2, 0, PANE.h / 2); bg.addColorStop(0, '#1a2034'); bg.addColorStop(.6, '#20273c'); bg.addColorStop(1, '#141a2a'); q.fillStyle = bg; q.fillRect(-PANE.w / 2, -PANE.h / 2, PANE.w, PANE.h);
        const sp = q.createRadialGradient(-120, -60, 0, -120, -60, 520); sp.addColorStop(0, 'rgba(223,231,242,.22)'); sp.addColorStop(1, 'rgba(223,231,242,0)'); q.fillStyle = sp; q.fillRect(-PANE.w / 2, -PANE.h / 2, PANE.w, PANE.h);
        q.beginPath(); q.rect(-PANE.w / 2, -PANE.h / 2, PANE.w, PANE.h); fibreFill(q, .05);
        const F = figure(q, -(FIG.x - PANE.x) + 300, FIG.feet - 88 * 1.8 - PANE.y - 8, 1.8, figPose(t, true), { t, seed: 7, accent: '#4a6aa0', dress: { pants: '#1a1a30' }, flip: true, light: { x: -300, y: -260, col: F6.silver, a: 1 }, rim: rgba('#ffffff', 1), rimSide: 1, shadow: false });
        reflHead = [-F.head[0], F.head[1]];
      } : null });
    if (mirror > 0 && mirror < 1) local((q) => { q.globalAlpha = 1 - mirror; throughPane(q, t, (w) => glassGround(w, t)); });
    // 3 · the screen (the chat): the haze of the screen's light, the typed request, the sparkling answer; switches off into a line at the turn
    if (screenOn > 0) local((q) => {
      q.translate(-PANE.w / 2, -PANE.h / 2);
      switchOn(q, t, screenOn, 0, 0, PANE.w, PANE.h, (s) => {
        if (haze > 0) { const hz = s.createRadialGradient(PANE.w / 2, PANE.h / 2, 0, PANE.w / 2, PANE.h / 2, PANE.w * .7); hz.addColorStop(0, rgba('#17264a', .95 * haze)); hz.addColorStop(1, rgba('#0a0f24', .5 * haze)); s.fillStyle = hz; s.fillRect(0, 0, PANE.w, PANE.h); }
        if (t > A.asked - .2) coolText(s, t, { x: 74, y: 150, w: 560, size: 17, lines: 1, t0: A.asked, cps: 13, seed: 21, col: '#f1d9a8', core: '#fff6e2', cursor: t < A.told - .5, ripple: false, lengths: [.6] });
        if (t > A.told - .45) coolText(s, t, { x: 74, y: 236, w: 620, size: 17, lines: 4, t0: A.told - .4, cps: 30, gap: .2, seed: 22, glint: 1.3 * sm(lin(A.special - .1, A.special + .4, t)), lengths: [.92, .96, .86, .5], accent: [{ i: 0, at: A.special, d: .45 }] });
      });
    });
    // 4 · the halo of compliments round the reflected head (2.05): light on the glass, it goes with the mirror
    if (mirror > 0 && t > A.always - .1) local((q) => {
      q.globalAlpha = mirror; const [hx, hy] = reflHead, Rr = 130;
      [[-160, 150], [-128, 190], [-96, 170], [-62, 200], [-28, 160], [8, 150], [196, 170], [228, 140]].forEach(([deg, w], i) => {
        const an = deg * Math.PI / 180, cx = hx + Math.cos(an) * Rr * 1.5, cyy = hy + Math.sin(an) * Rr;
        coolText(q, t, { x: cx - w / 2, y: cyy - 10, w, size: 15, lines: 1, t0: A.always + i * .26, cps: 12, seed: 90 + i, cursor: false, ripple: true, lengths: [.95], lineH: 24, a: .95 });
      });
    });
    // 5 · the glass world inside the pane (from 2.09): the chat windows switch on, later the wall
    if (t >= tChat) local((q) => throughPane(q, t, (w) => wallWorld(w, t, wallOpts(t, null))));
    return P;
  };

  // ---- the room
  const drawRoom = (ctx, t) => {
    const cam0 = camPath(ROOMCAM, t), cam = { x: cam0.x + 7 * drift(t, 1, 5), y: cam0.y + 5 * drift(t, 1, 9), z: cam0.z * (1 + .004 * drift(t, 1, 13)) }, eA = emberA(t), mirrorLit = sm(lin(tTurn + .62, tTurn + 1.0, t)) * (1 - sm(lin(tDark, tDark + .45, t)));
    const screenLit = sm(lin(A.praising + .1, A.praising + .6, t)) * (1 - sm(lin(tTurn + .2, tTurn + .5, t))), chatLit = sm(lin(tChat, tChat + .6, t));
    view(ctx, cam, .85, (g) => g.drawImage(roomGround(), GROUND[0], 0));
    view(ctx, cam, 1, (g, m) => {
      // the pane's light on the floor
      const pl = .5 * screenLit + .35 * mirrorLit + .5 * chatLit; if (pl > 0) { g.save(); g.globalCompositeOperation = 'lighter'; g.translate(PANE.x, FLOOR + 8); g.scale(1, .1); const fg = g.createRadialGradient(0, 0, 0, 0, 0, 520); fg.addColorStop(0, rgba(F6.cool, .32 * pl)); fg.addColorStop(1, rgba(F6.cool, 0)); g.fillStyle = fg; g.beginPath(); g.arc(0, 0, 520, 0, TAU); g.fill(); g.restore(); }
      drawPane(g, t, m);
      // the comment card rises from below and lands (expo-out); the count runs on 2.03
      if (t >= tCard && t < tTurn + 2.2) { const u = expo(lin(tCard, tCard + .55, t)), u2 = quart(lin(tTurn + .3, tTurn + 2.0, t)), cy = mix(mix(FLOOR + 320, CARDP.y, u), -CARD.h - 420, u2), rot = -.03 + .05 * (1 - u) - .04 * u2; g.save(); g.translate(CARDP.x + CARD.w / 2, cy + CARD.h / 2); g.rotate(rot); g.translate(-CARD.w / 2, -CARD.h / 2); commentCard(g, t, 0, 0, { count: lin(A.thousands, A.liked + .5, t), hearts: t - A.thousands, pulse: 0 }); g.restore(); }
      // you, from the side, facing the pane; lit by the screen / mirror from the left, later warmed by the dog's ember from the right
      const lit = Math.max(screenLit, mirrorLit, chatLit), warm = eA * (1 - lit * .5);
      const lightCol = mixHex(F6.cool, F6.amberCore, warm), rimA = .3 + .45 * lit, rimCol = rgba(mixHex(F6.cool, F6.amber, warm * .6), rimA);
      figure(g, FIG.x, FIG.feet - 88 * FIG.s, FIG.s, figPose(t, false), { t, seed: 7, accent: '#2c4470', dress: { pants: '#13122a' }, flip: true, light: { x: warm > .5 ? DOG.x : PANE.x, y: warm > .5 ? DOG.y - 200 : PANE.y, col: lightCol, a: .22 + .3 * Math.max(lit, warm) }, rim: rimCol, rimSide: -1, cast: { x: PANE.x, y: PANE.y - 100, a: .22 * lit } });
      // the dog, sitting at your heel, listening; the ember in its eye is the warm light of 2.07 / 2.08
      const tilt = .32 * eout(lin(tAns, tAns + .28, t)) * (1 - .6 * sm(lin(tAns + 1.2, tAns + 1.9, t))), jaw = Math.sin(Math.PI * lin(tAns + .04, tAns + .32, t)), ear = .35 + .65 * sm(lin(tLook + .85, tLook + 1.2, t));
      const D = dog(g, t, DOG.x, DOG.y, DOG.s, { seed: 5, tilt, jaw, ear });
      if (eA > 0) { ember(g, t, { x: D.head[0], y: D.head[1] - 10, kind: 'glow', r: 190, a: .28 * eA }); ember(g, t, { x: D.eye[0], y: D.eye[1], kind: 'glow', r: 30, a: eA }); g.fillStyle = rgba(F6.amberCore, .95 * eA); g.beginPath(); g.arc(D.eye[0], D.eye[1], 2.6 * DOG.s * (.97 + .03 * breathe(t)), 0, TAU); g.fill(); }
    });
    // motes in the pane's light, a dark foreground edge
    view(ctx, cam, 1.2, (g) => {
      const r = prng(21), a0 = .25 + .5 * Math.max(screenLit, mirrorLit, chatLit); g.save(); g.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 46; i++) { const x0 = 380 + r() * 760, y0 = 240 + r() * 600, sp = .3 + r(), x = x0 + Math.sin(t * .4 * sp + i) * 16, y = y0 + Math.cos(t * .3 * sp + i * 1.7) * 12 - (t * 3 * sp) % 70; g.fillStyle = rgba('#cfe3ff', a0 * (.15 + .4 * r())); g.fillRect(x, y, 1.4, 1.4); }
      g.restore();
      const fg = g.createLinearGradient(0, H - 120, 0, H); fg.addColorStop(0, 'rgba(4,5,14,0)'); fg.addColorStop(1, 'rgba(4,5,14,.7)'); g.fillStyle = fg; g.fillRect(0, H - 120, W, 120);
    });
  };

  // ---- inside the glass (from tFill): the wall world under its own camera; at the end the clip screen collapses to the plate's line
  const drawWall = (ctx, t) => {
    const cam0 = camPath(WALLCAM, t), cam = { x: cam0.x + 7 * drift(t, 1, 5), y: cam0.y + 5 * drift(t, 1, 9), z: cam0.z * (1 + .004 * drift(t, 1, 13)) };
    const world = () => view(ctx, cam, 1, (g) => wallWorld(g, t, wallOpts(t, cam)));
    if (t < C.end) { world(); return; }
    const k = sm(lin(C.end, C.end + .2, t)), hv = H * (1 - eout(k));
    HO.plate(ctx, t);
    if (hv > 2) { ctx.save(); ctx.beginPath(); ctx.rect(0, H / 2 - hv / 2, W, hv); ctx.clip(); ctx.translate(0, H / 2); ctx.scale(1, Math.max(hv / H, .04)); ctx.translate(0, -H / 2); world(); ctx.restore();   // the old-TV switch-off: the picture squeezes into the band, the band into the line
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; for (const yy of [H / 2 - hv / 2, H / 2 + hv / 2]) { for (const [lw, al] of [[18, .07], [6, .22], [1.6, .9]]) { ctx.strokeStyle = rgba(lw < 2 ? F6.coolCore : F6.cool, al * (1 - k) * (.4 + .6 * k)); ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(-10, yy); ctx.lineTo(W + 10, yy); ctx.stroke(); } } ctx.restore(); }
  };

  // ---- screen-fixed text: the study label of 2.09, the lower third of the clip
  const overlays = (ctx, t) => {
    const la = sm(lin(tChat + .6, tChat + 1.0, t)) * (1 - sm(lin(tWallOn + .25, tWallOn + .55, t)));
    if (la > 0) reveal(ctx, 460, 858, 1000, 40, la, (g) => text(g, 'JONES & BERGEN · UC SAN DIEGO · 2025 · TURING TEST', W / 2, 886, { size: 17, weight: 600, color: rgba(F6.cool, .85), align: 'center', spacing: 4 }), la < 1 && t > tWallOn ? -1 : 1);
    if (t > C.start && t < tPush) { // a soft shadow on the wall behind the name, so the far panes' text does not run through it
      const sa = sm(lin(C.start + .1, C.start + .6, t)) * (1 - sm(lin(tPush - .75, tPush - .2, t)));
      if (sa > 0) { const bg = ctx.createRadialGradient(430, 868, 0, 430, 868, 640); bg.addColorStop(0, rgba(F6.glassBot, .78 * sa)); bg.addColorStop(.55, rgba(F6.glassBot, .5 * sa)); bg.addColorStop(1, rgba(F6.glassBot, 0)); ctx.save(); ctx.beginPath(); ctx.ellipse(430, 868, 640, 120, 0, 0, Math.PI * 2); ctx.fillStyle = bg; ctx.fill(); ctx.restore(); }
    }
    if (t > C.start && t < tPush) lowerThird(ctx, t, T, 'C1', { y: 850, a: sm(lin(C.start + .15, C.start + .75, t)) * (1 - sm(lin(tPush - .7, tPush - .15, t))) });
  };
  const take = (ctx, t) => { if (t < tFill) drawRoom(ctx, t); else drawWall(ctx, t); overlays(ctx, t); };

  // ---- warm-up (layers are painted on first use)
  preloadFirstFrame('C1', 5);   // C1 f00001–f00004 are a captioned teaser of the source; the pre-roll and the first 4 frames show f00005
  { const [c0, g0] = (await import('../engine.mjs')).canvas(); for (const tt of [HI.b + 1, tTurn + 1.5, tLook + 1, tFill + 1, C.start + 1]) take(g0, tt); await ready(); }

  const E_ = (t, o = {}) => ({ t, tr: 'cut', d: .1, draw: take, print: { riso: .3 }, ...o });
  return [
    E_(HI.b, { print: HI.print, sound: [{ f: 'card', t: tCard + .5, v: .55 }] }),
    E_(A.thousands, { sound: [{ f: 'whoosh_airy', t: tTurn - .1, v: .5 }] }),
    E_(tShrug, { sound: [{ f: 'drop', t: tDark + .05, v: .45 }] }),
    E_(tLook - .3, { sound: [{ f: 'dog_wuff', t: tAns, v: .35 }] }),
    E_(tBack, { sound: [{ f: 'whoosh_up', t: tFill - .35, v: .4 }, { f: 'tick', t: tJump - .02, v: .5 }] }),
    E_(A.and, { sound: [{ f: 'chime', t: C.start - .55, v: .45 }] }),
    E_(C.start, { print: { riso: .25 } }),
    E_(tPush, { print: HO.print, sound: [{ f: 'screen_off', t: C.end - .04, v: .55 }] }),
  ];
};
