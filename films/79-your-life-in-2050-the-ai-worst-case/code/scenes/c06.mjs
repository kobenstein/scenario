// Film 79 · c06 THE SEARCH, PART 1 (G.01–G.17, vo-v2, builder B2). PLAN (gates: docs/BRIEF-builders.md §5)
//   G.01–02  SUBSCRIBE 1 on THE STREET AT NOON (anchor): the NOT NEEDED counter grows out of the HUD, half full (5 of 9 carmine); a
//            subscribe sign hangs from the street lamp, pressed on "subscribe"; SO NO STREET ENDS UP LIKE THIS ONE   → lens sweep (a topiary)
//   G.03     MIX the calm street in the early afternoon, nobody out: a pale-ink ghost of an angry crowd's placards is wiped off on "calm";
//            on "Why?" a cream search ring settles on a window                                         → iris out of the ring
//   G.04     EXPL the street as a cream ink drawing, the ring searches window by window, ANGRY FACES 0 → portal through your window
//   G.05     LIVING ROOM: the grandson at his screen, you in the doorway                              → portal through the room's window
//   G.06     MIX the kerb: a bus stop sign, the pale-ink school bus is wiped off                      → iris out of the BUS disc
//   G.07     MIX the school bell in its gable, still (no reveal of the school yet)                     → iris out of the bell
//   G.08     the living room close: his screen, his small hands                                      → portal through the screen
//   G.09–11  EXPL inside the screen: answers stack up, never tired, a tally of ANSWERS (G.09) → they close into a loop around him,
//            MINUTES ON SCREEN grows (G.10) → MALICE ✗, the loop keeps turning (G.11)                  → iris out of the loop
//   G.12     the living room quiet, the boy still and content                                         → portal through the window
//   G.13     THE SCHOOL, LOCKED: chain and padlock, the last lit window goes out on "locked" (light-out 2 of 3, ≤ 3 frames, hold after)
//                                                                                                       → iris out of the padlock
//   G.14–15  EXPL ARGUMENTS: WON (a tally that never stops) · LOST 0 (G.14) → every reply carries a YES ✓ (G.15) → iris out of the last tick
//   G.16–17  EXPL the survey (Common Sense Media 2026): MORE THAN 1 IN 3 of U.S. kids who use AI talked to it about their feelings or
//            problems, an icon array of three (G.16) → a paper card unfolds from the speech bubble: the rulebook, blank pages,
//            STILL BEING DECIDED (G.17)                                                               → portal through the blank page into c07
// Wow: none (the anchor + subscribe carry the chunk's peak). Accents: the subscribe press, light-out 2 (school), the 0.
// Seams: in ← c05 N.31 (iris out of the HUD counter); out → c07 L.01 (portal through the blank page).
import * as K from '../lib/f79_kit.mjs';
import * as S from '../lib/f79_street.mjs';
import * as PL from '../lib/f79_places.mjs';
import * as B from '../lib/f79_b2.mjs';
import { hourAt } from './hud.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, cam3, aim, camK, project, CARM, AMBER, sineIO, quartIO, expoOut, expoIn } = K;
const look = (R, t) => K.hourLook(hourAt(R, t));
const { T: TX, SER, arrow, strike, struckWord, stamp, REST, SUB, PALE } = B;
const float2 = (c, t, z = 1, cx = W / 2, cy = H / 2) => { const dx = K.drift(t * .35, 3, 5.3), dy = K.drift(t * .35, 2, 2.1); c.translate(cx + dx, cy + dy); c.scale(z, z); c.translate(-cx, -cy); };
const restPal = { base: '#5a6498', lit: '#7a84b8', shade: '#2e365e', deep: '#161c3a', hem: .3 }, carmPal = { base: '#c4284c', lit: '#f0587a', shade: '#6e1030', deep: '#300818', hem: .3 };
// a reply bubble (cream, carmine edge = the machine's voice); o.yes = a YES ✓ at its end
function bubble(c, x, y, w, h, a, o = {}) { if (a <= 0) return; c.save(); c.globalAlpha *= a; c.fillStyle = o.fill || '#f4eef2'; c.beginPath(); c.roundRect(x, y, w, h, h / 2); c.fill(); c.fillStyle = CARM.body; c.fillRect(x + 18, y + h / 2 - 2, 6, 4);
  c.fillStyle = rgba('#3a2a4a', .35); for (let k = 0; k < 3; k++) c.fillRect(x + 36 + k * (w - 90) / 3, y + h / 2 - 3, (w - 110) / 3 * (k === 2 ? .6 : 1), 6);
  if (o.yes) { c.fillStyle = '#14163a'; c.font = '700 24px Inter'; c.textAlign = 'right'; c.fillText('YES', x + w - 46, y + h / 2 + 9); B.tick(c, x + w - 26, y + h / 2, 18, o.yes, CARM.body, 4); }
  c.restore(); }
export default function c06(T, R) {
  const RT = (id) => R[id];
  const G = (ph, after, nth = 0) => T.G(ph, nth, after - .05);
  // ---------------------------------------------------------------- G.01–G.02 · SUBSCRIBE 1 on the street at noon, the counter half full
  const camG01 = (t, s) => camK(t, [[s.a - 1.2, cam3({ z: -560, y: -140, x: 60 })], [s.b + 1, cam3({ z: -280, y: -90, x: 20 })]], .5);
  const G01 = {
    id: 'G.01',
    draw(ctx, t, s) {
      const L = look(R, t), c = camG01(t, s), t2 = s.r('G.02'), tsub = G('subscribe', t2), tst = s.w('street');
      const press = span(t, tsub - .05, tsub + .12) - span(t, tsub + .35, tsub + .7);
      const out = S.street(ctx, t, c, L, { lamps: true, near: (g) => {   // the sign hangs from the near street lamp's arm
        const sw = Math.sin(t * 1.1) * .025, ax = 300, ay = 466;
        g.strokeStyle = '#1a2050'; g.lineWidth = 3; g.beginPath(); g.moveTo(ax - 40, ay); g.lineTo(ax - 40, ay + 40); g.moveTo(ax + 40, ay); g.lineTo(ax + 40, ay + 40); g.stroke();
        g.save(); g.translate(ax, ay + 40); g.rotate(sw); g.translate(0, 6 * press); const u = expoOut(span(t, s.a + .4, s.a + 1.4)); g.scale(u, u);
        g.fillStyle = rgba('#060a24', .35); g.beginPath(); g.roundRect(-118, 8, 244, 78, 16); g.fill();
        g.fillStyle = mixHex('#f2b632', '#fff1cf', .15 * (1 - press)); g.beginPath(); g.roundRect(-122, 0, 244, 78, 16); g.fill();
        g.fillStyle = '#1a1430'; g.font = '800 30px Inter'; g.textAlign = 'center'; g.letterSpacing = '0.06em'; g.fillText('SUBSCRIBE', 0, 50); g.letterSpacing = '0em'; g.restore();
      } });
      B.chimes(ctx, t, c, B.streetWindows(out), () => .35, null);
      // the counter, half full: grows out of the HUD and goes back into it before G.03
      const gr = expoOut(span(t, s.a - .1, s.a + 1.0)) * (1 - quartIO(span(t, s.b - 1.1, s.b - .3)));
      if (gr > .01) K.scr(ctx, (cx) => {
        const x = lerp(285, W / 2, gr), y = lerp(128, 200, gr), k = lerp(.3, .62, gr); cx.translate(x, y); cx.scale(k, k);
        cx.fillStyle = K.rad(cx, 0, 0, 760, [[0, rgba('#060a24', .55)], [1, rgba('#060a24', 0)]]); cx.fillRect(-900, -400, 1800, 800);
        K.glowText(cx, 'NOT NEEDED IN 2050', 0, -80, { size: 36, weight: 600, align: 'center', col: '#e6d6ee', spacing: .24, glow: false });
        for (let i = 0; i < 9; i++) { const bx = (i - 4) * 104, on = i < 5;
          cx.strokeStyle = on ? CARM.hot : rgba('#e8eefc', .5); cx.lineWidth = 3; cx.beginPath(); cx.roundRect(bx - 42, -42, 84, 84, 8); cx.stroke();
          if (on) { cx.fillStyle = K.rad(cx, bx, 0, 60, [[0, CARM.hot], [1, CARM.mid]]); cx.beginPath(); cx.roundRect(bx - 36, -36, 72, 72, 6); cx.fill(); }
          K.glowText(cx, String(i + 1), bx, 16, { size: 46, serif: true, align: 'center', col: on ? CARM.core : rgba('#e8eefc', .5), glow: false }); }
        K.glowText(cx, 'HALF FULL BY NOON', 0, 110, { size: 30, weight: 600, align: 'center', col: P.cream, glow: false, spacing: .14 });
      });
      const tw = s.w('well');
      K.caps(ctx, 'SO IT GOES WELL FOR EVERYBODY', W / 2, 390, K.cardU(t, tw - .3, tst - .3) * (t < tst - .3 ? 1 : 0), { size: 30, align: 'center', col: '#ffe7a8' });
      K.caps(ctx, 'SO NO STREET ENDS UP LIKE THIS ONE', W / 2, 390, K.cardU(t, tst - .2, t2 + .3) * (t < t2 + .3 ? 1 : 0), { size: 30, align: 'center', col: '#ffe7a8' });
      K.caps(ctx, 'WANT THAT TOO?', W / 2, 390, K.cardU(t, t2 + .2, s.b - .2) * (t < s.b ? 1 : 0), { size: 30, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'sweep', dir: -1, w: 520, col: '#0e1a3a', lead: .4, dur: 1.05 },
  };
  // ---------------------------------------------------------------- G.03 · the calm street, early afternoon: the ghost of an angry crowd is wiped off
  const camG03 = (t, s) => camK(t, [[s.a - 1.2, cam3({ z: 150, y: 48, x: -260 })], [s.b + 1, cam3({ z: 200, y: 42, x: -170 })]], .3);
  const RING3 = [1150, 470];
  const G03 = {
    id: 'G.03',
    draw(ctx, t, s) {
      const L = look(R, t), c = camG03(t, s), ta = s.w('angry'), tc = s.w('calm'), tw = G('why', s.a);
      S.street(ctx, t, c, L, { lamps: true });
      // pale-ink placards of the angry crowd that never came (wiped off from left to right on "calm")
      const gh = span(t, ta - .3, ta + .3), wipe = sineIO(span(t, tc - .1, tc + .8));
      if (gh > 0 && wipe < 1) K.scr(ctx, (g) => { g.save(); g.beginPath(); g.rect(lerp(-50, W + 50, wipe), 0, W + 100, H); g.clip(); g.globalAlpha = .85 * gh; K.ink(g, PALE, 3);
        const r = K.prng(5); for (let k = 0; k < 9; k++) { const x = 300 + k * 150 + r() * 40, y = 640 + r() * 80, hh = 120 + r() * 60, tilt = (r() - .5) * .3;
          g.save(); g.translate(x, y); g.rotate(tilt + .05 * Math.sin(t * 2 + k)); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -hh); g.stroke(); g.strokeRect(-55, -hh - 70, 110, 70);
          g.beginPath(); g.moveTo(-36, -hh - 44); g.lineTo(36, -hh - 44); g.moveTo(-36, -hh - 26); g.lineTo(20, -hh - 26); g.stroke(); g.restore(); }
        g.restore(); });
      K.caps(ctx, 'PERFECTLY CALM', W / 2, 250, K.cardU(t, tc + .3, s.b + .2) * (t < s.b ? 1 : 0), { size: 26, align: 'center', col: '#dfe6ff' });
      const ru = expoOut(span(t, tw - .25, tw + .35)); if (ru > 0) K.scr(ctx, (g) => B.searchRing(g, t, RING3[0], RING3[1], 70 * ru, ru));
    },
    out: { k: 'iris', c: [RING3[0], RING3[1], 70], lead: .4, dur: 1.4, rim: '#f3efe2' },
  };
  // ---------------------------------------------------------------- G.04 · EXPL the search: the street as an ink drawing, ANGRY FACES 0
  const { x0: SX, gap: SG, base: SB, w: SW, h: SH } = B.SEARCH, myWin = [SX + 2 * SG + SW * .62, SB - SH + SH * .2, SW * .2, SH * .22];
  const G04 = {
    id: 'G.04',
    draw(ctx, t, s) {
      K.dusk(ctx, t, { glow: [900, 560] });
      K.scr(ctx, (c) => { float2(c, t, 1 + .02 * sineIO(span(t, s.a, s.b)));
        const st = B.searchStreet(c, t, { build: span(t, s.a - .6, s.a + .8), hi: 2 });
        // the ring: from the street's window (G.03) across the houses, window by window, to your window
        const path = [RING3, ...[6, 5, 4, 3].map((i) => st.wins[i][0]).filter(Boolean), [myWin[0] + myWin[2] / 2, myWin[1] + myWin[3] / 2]];
        const u = sineIO(span(t, s.a + .1, s.b - .35)) * (path.length - 1), i = Math.min(path.length - 2, Math.floor(u)), f = sineIO(u - i);
        const p = [lerp(path[i][0], path[i + 1][0], f), lerp(path[i][1], path[i + 1][1], f)];
        B.searchRing(c, t, p[0], p[1], lerp(70, 46, span(t, s.a, s.a + 1)), 1);
        B.counterTag(c, 'ANGRY FACES', 0, 1800, 240, span(t, s.a + .2, s.a + .8));
        TX(c, 'GO AND LOOK', 120, 240, { size: 24, col: SUB, a: span(t, s.a, s.a + .5) });
      });
    },
    out: { k: 'fn', fn: B.maskGrow(myWin, { r: 4, rim: '#ffe7a8' }), lead: .4, dur: 1.3 },
  };
  // ---------------------------------------------------------------- G.05 · the grandson at his screen, you in the doorway
  const camG05 = (t, s) => camK(t, [[s.a - 1.1, cam3({ z: -20, x: 60 })], [s.b + 1, cam3({ z: 40, x: 100, y: -10 })]], .3);
  const G05 = {
    id: 'G.05',
    draw(ctx, t, s) { PL.boyScreen(ctx, t, camG05(t, s), look(R, t), { a: 1 }); K.caps(ctx, 'YOUR GRANDSON', 1120, 560, K.cardU(t, s.a + .2, s.b + .3) * (t < s.b ? 1 : 0), { size: 24, align: 'center', col: '#ffd9c8' }); },
    out: { k: 'portal', win: (t, s) => { const c = camG05(t, s), a = project(c, 4200, 1300, 180), b = project(c, 4200, 1680, 600); return [a[0], a[1], b[0] - a[0], b[1] - a[1]]; }, lead: .3, dur: 1.1 },
  };
  // ---------------------------------------------------------------- G.06 · the kerb: a bus stop sign, the ink school bus is wiped off
  const camG06 = (t, s) => camK(t, [[s.a - 1.1, cam3({ z: 80, x: 270, y: 6 })], [s.b + 1, cam3({ z: 130, x: 290, y: 2 })]], .3);
  const DISC = [1380, 470];
  const G06 = {
    id: 'G.06',
    draw(ctx, t, s) {
      const L = look(R, t), c = camG06(t, s), tb = s.w('bus');
      S.street(ctx, t, c, L, { lamps: true, focus: (g) => {
        const wipe = sineIO(span(t, tb + .05, tb + .9));
                if (wipe < 1) { g.save(); g.beginPath(); g.rect(-400, 0, lerp(2300, 0, wipe) + 400, 1100); g.clip(); g.globalAlpha = .9; K.ink(g, PALE, 4);   // the ink school bus at the stop
          const bx = 900, by = 1000; g.beginPath(); g.roundRect(bx - 520, by - 300, 1000, 250, 26); g.stroke(); for (let k = 0; k < 6; k++) g.strokeRect(bx - 470 + k * 150, by - 270, 110, 90);
          for (const wx of [bx - 360, bx + 300]) { g.beginPath(); g.arc(wx, by - 40, 56, 0, 7); g.stroke(); } g.font = '700 40px Inter'; g.fillStyle = PALE; g.fillText('SCHOOL BUS', bx - 380, by - 120); g.restore(); }
        g.fillStyle = '#1a2050'; g.fillRect(DISC[0] - 7, DISC[1], 14, 1000 - DISC[1]);   // the sign
        g.fillStyle = mixHex('#c8ccdc', L.light, .15); g.beginPath(); g.arc(DISC[0], DISC[1], 62, 0, 7); g.fill(); g.strokeStyle = '#1a2050'; g.lineWidth = 5; g.stroke();
        g.fillStyle = '#1a2050'; g.font = '800 40px Inter'; g.textAlign = 'center'; g.fillText('BUS', DISC[0], DISC[1] + 14); g.textAlign = 'left';
      } });
      K.caps(ctx, 'NO SCHOOL BUS', W / 2, 250, K.cardU(t, tb + .5, s.b + .2) * (t < s.b ? 1 : 0), { size: 26, align: 'center', col: '#dfe6ff' });
    },
    out: { k: 'iris', c: (t, s) => { const p = project(camG06(t, s), 1700, ...DISC); return [p[0], p[1], 62 * p[2]]; }, lead: .3, dur: .9, rim: '#dfe6ff' },
  };
  // ---------------------------------------------------------------- G.07 · the school bell in its gable, still
  const camG07 = (t, s) => camK(t, [[s.a - 1, aim(5000, 960, 300, 3.0, W / 2, H * .5)], [s.b + 1, aim(5000, 960, 300, 3.1, W / 2, H * .5)]], .2);
  const G07 = {
    id: 'G.07',
    draw(ctx, t, s) {
      PL.school(ctx, t, camG07(t, s), look(R, t), {});
      const p = project(camG07(t, s), 5000, 960, 285), g0 = span(t, s.a - .4, s.a + .1) * (1 - span(t, s.a + .2, s.a + .8));   // the ring that does not come: pale arcs shrink back into the bell
      if (g0 > 0 && p) K.scr(ctx, (g) => { g.strokeStyle = rgba(PALE, .8 * g0); g.lineWidth = 4; for (let k = 1; k <= 3; k++) { const r = (60 + k * 40) * (1 - .6 * span(t, s.a, s.a + .8)); for (const sd of [-1, 1]) { g.beginPath(); g.arc(p[0], p[1], r, sd < 0 ? 2.6 : -.5, sd < 0 ? 3.6 : .5); g.stroke(); } } });
      K.caps(ctx, 'NO BELL', W / 2, 700, K.cardU(t, s.a + .1, s.b + .5) * (t < s.b + .5 ? 1 : 0), { size: 26, align: 'center', col: '#dfe6ff' });
    },
    out: { k: 'iris', c: (t, s) => { const p = project(camG07(t, s), 5000, 960, 290); return [p[0], p[1], 70]; }, lead: .3, dur: .9, rim: '#dfe6ff' },
  };
  // ---------------------------------------------------------------- G.08 · his screen, his small hands
  const camG08 = (t, s) => camK(t, [[s.a - 1, aim(2400, 1080, 860, 1.95, W * .51, H * .5)], [s.b + 1, aim(2400, 1080, 860, 2.05, W * .5, H * .5)]], .25);
  let scr8 = [1080, 860, 124, 84], hG08 = null;
  const G08 = {
    id: 'G.08',
    draw(ctx, t, s) { hG08 = s; const o = PL.boyScreen(ctx, t, camG08(t, s), look(R, t), { a: 1, you: false }); if (o.screen) scr8 = o.screen; },
    out: { k: 'fn', lead: .4, dur: 1.3, fn: B.maskGrow((t) => { const s = hG08 || { a: R['G.08'], b: R['G.09'] }, c = camG08(t, s), a = project(c, 2400, scr8[0] - 52, scr8[1] - 40), b = project(c, 2400, scr8[0] + 52, scr8[1] + 30); return [a[0], a[1], b[0] - a[0], b[1] - a[1]]; }, { r: 6, rim: '#ffd6de' }) },
  };
  // ---------------------------------------------------------------- G.09–G.11 · EXPL the answers that never tire, the loop, not out of malice
  const BOY = [700, 800];
  const G09 = {
    id: 'G.09',
    draw(ctx, t, s) {
      const t10 = s.r('G.10'), t11 = s.r('G.11'), tp = s.w('patient'), tk = s.w('knows'), tm = G('malice', t11), tkeep = G('keep', t10);
      const loop = quartIO(span(t, t10 - .2, t10 + 1.1));
      K.dusk(ctx, t, { glow: [lerp(1250, BOY[0], loop), 520] });
      K.scr(ctx, (c) => { float2(c, t, 1 + .02 * sineIO(span(t, s.a, s.b)));
        S.boy(c, t, BOY[0], BOY[1], 230, { dir: 1, pose: 'hold', look: .5, back: .2 });
        // the panel of answers (G.09): bubbles keep stacking up, never tired
        const pa = (1 - loop) * span(t, s.a - .4, s.a + .3);
        if (pa > 0) { c.save(); c.globalAlpha = pa; const px = 980, py = 200, pw = 560, ph = 600;
          c.fillStyle = rgba('#1a0c2a', .9); c.beginPath(); c.roundRect(px, py, pw, ph, 24); c.fill(); K.carmGlow(c, px + pw / 2, py + ph / 2, 520, .1);
          c.strokeStyle = rgba(CARM.hot, .7); c.lineWidth = 3; c.stroke(); c.save(); c.beginPath(); c.roundRect(px + 6, py + 6, pw - 12, ph - 12, 20); c.clip();
          for (let k = 0; k < 7; k++) { const u = span(t, s.a - .3 + k * .5, s.a + .05 + k * .5); bubble(c, px + (k % 2 ? 150 : 40), py + 30 + k * 80 + 12 * (1 - u), k % 2 ? 370 : 300, 56, u, { fill: k % 2 ? '#f4eef2' : '#d9c4cc' }); }   // the answers keep coming, one every .5 s
          c.restore(); c.restore();
          // the tally: ANSWERS, never tired
          TX(c, 'ANSWERS', 1600, 240, { size: 24, a: pa }); const n = Math.floor(Math.max(0, t - s.a) / .7) * 2; c.save(); c.globalAlpha = pa; c.strokeStyle = P.cream; c.lineWidth = 3;
          for (let k = 0; k < n; k++) { const g = Math.floor(k / 5), j = k % 5, gx = 1600 + (g % 4) * 70, gy = 290 + Math.floor(g / 4) * 64; c.beginPath(); if (j < 4) { c.moveTo(gx + j * 12, gy); c.lineTo(gx + j * 12, gy + 44); } else { c.moveTo(gx - 6, gy + 34); c.lineTo(gx + 46, gy + 10); } c.stroke(); }
          c.restore();
          TX(c, 'NEVER TIRED', 1600, 760, { size: 24, col: '#ffd6de', a: pa * span(t, tp - .2, tp + .3) });
          TX(c, 'KNOWS HIM BETTER THAN YOU DO', 980, 860, { size: 24, a: pa * span(t, tk - .1, tk + .4) }); }
        // G.10: a loop around him; MINUTES ON SCREEN keeps growing
        if (loop > 0) { const cx = BOY[0], cy = BOY[1] - 120, r = 230, rot = t * .6;
          c.save(); c.globalAlpha = loop; c.strokeStyle = rgba(CARM.hot, .2); c.lineWidth = 18; c.beginPath(); c.arc(cx, cy, r, 0, 7); c.stroke();
          c.strokeStyle = CARM.hot; c.lineWidth = 5; c.beginPath(); c.arc(cx, cy, r, rot, rot + Math.PI * 1.7 * loop); c.stroke();
          const ex = cx + r * Math.cos(rot + Math.PI * 1.7 * loop), ey = cy + r * Math.sin(rot + Math.PI * 1.7 * loop), ea = rot + Math.PI * 1.7 * loop + Math.PI / 2;
          c.fillStyle = CARM.hot; c.beginPath(); c.moveTo(ex + 18 * Math.cos(ea), ey + 18 * Math.sin(ea)); c.lineTo(ex + 14 * Math.cos(ea + 2.2), ey + 14 * Math.sin(ea + 2.2)); c.lineTo(ex + 14 * Math.cos(ea - 2.2), ey + 14 * Math.sin(ea - 2.2)); c.fill();
          TX(c, 'TO KEEP HIM THERE', cx, cy - r - 40, { align: 'center', size: 24, a: span(t, tkeep - .1, tkeep + .4) });
          const bw = 560 * (1 - Math.exp(-(t - t10) * .25)) + 30 * Math.sin(t * .3) * 0; TX(c, 'MINUTES ON SCREEN', 1080, 600, { size: 24, a: span(t, t10 + .5, t10 + 1) });
          c.fillStyle = CARM.body; c.beginPath(); c.roundRect(1080, 630, Math.max(4, bw * span(t, t10 + .5, t10 + .8)), 40, 4); c.fill(); c.fillStyle = REST; c.globalAlpha = loop * .35; c.fillRect(1080, 676, 700, 2);
          c.restore(); }
        // G.11: not out of malice
        struckWord(c, 'malice', 1340, 300, 96, span(t, tm - .55, tm + .25), span(t, tm + .35, tm + .65), { align: 'center' });
      });
    },
    out: { k: 'iris', c: [BOY[0], BOY[1] - 120, 230], lead: .3, dur: 1.1, rim: '#ffd6de' },
  };
  // ---------------------------------------------------------------- G.12 · the room quiet, the boy still and content
  const camG12 = (t, s) => camK(t, [[s.a - 1, aim(2400, 1120, 840, 1.5, W * .5, H * .55)], [s.b + .6, cam3({ z: 60, x: 160, y: -30 }), 's']], .3);
  const G12 = {
    id: 'G.12',
    draw(ctx, t, s) { PL.boyScreen(ctx, t, camG12(t, s), look(R, t), { a: .9, you: false }); K.caps(ctx, 'ASKS FOR NOTHING', 1120, 380, K.cardU(t, s.a + .5, s.b) * (t < s.b ? 1 : 0), { size: 24, align: 'center', col: '#dfe6ff' }); },
    out: { k: 'portal', win: (t, s) => { const c = camG12(t, s), a = project(c, 4200, 1300, 180), b = project(c, 4200, 1680, 600); return [a[0], a[1], b[0] - a[0], b[1] - a[1]]; }, lead: .45, dur: 1.4 },
  };
  // ---------------------------------------------------------------- G.13 · THE SCHOOL, LOCKED: the last lit window goes out (light-out 2)
  const camG13 = (t, s) => camK(t, [[s.a - 1.2, cam3({ z: -200, y: -32, x: 24 })], [s.b + 1, cam3({ z: -120, y: -24 })]], .3);
  const G13 = {
    id: 'G.13',
    draw(ctx, t, s) {
      const c = camG13(t, s), tl = s.w('locked'), off = t >= tl + .03 ? 1 : 0;
      const o = PL.school(ctx, t, c, look(R, t), { chain: 1 });
      // one window still lit (a teacher's lamp left on), out in 2 frames on "locked"
      const a = project(c, 5000, 990, 480), b = project(c, 5000, 1100, 570);
      if (!off && a) K.scr(ctx, (g) => { const fl = t > tl - .2 ? (Math.sin(t * 90) > 0 ? 1 : .6) : 1;
        g.fillStyle = rgba('#ffd36a', .14 * fl); g.fillRect(a[0] - 30, a[1] - 30, b[0] - a[0] + 60, b[1] - a[1] + 60);
        g.fillStyle = K.lin(g, 0, a[1], 0, b[1], [[0, '#fff0c0'], [1, '#e8a04a']]); g.globalAlpha = fl; g.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); });
      K.caps(ctx, 'LOCKED', W / 2, 250, K.cardU(t, tl + .5, s.b + .2) * (t < s.b ? 1 : 0), { size: 26, align: 'center', col: '#dfe6ff' });
    },
    out: { k: 'iris', c: (t, s) => { const p = project(camG13(t, s), 2600, 960, 830); return [p[0], p[1], 40]; }, lead: .3, dur: 1.0, rim: '#dfe6ff' },
  };
  // ---------------------------------------------------------------- G.14–G.15 · EXPL ARGUMENTS WON · LOST 0, then every reply says YES
  const G14 = {
    id: 'G.14',
    draw(ctx, t, s) {
      const t15 = s.r('G.15'), ta = s.w('argument'), tg = G('agrees', t15), mv = quartIO(span(t, t15 - .2, t15 + .9));
      K.dusk(ctx, t, { glow: [lerp(960, 600, mv), 520] });
      K.scr(ctx, (c) => { float2(c, t, 1 + .02 * sineIO(span(t, s.a, s.b)));
        c.save(); c.translate(lerp(0, -380, mv), lerp(0, -60, mv)); const k = lerp(1, .7, mv); c.translate(960, 500); c.scale(k, k); c.translate(-960, -500);
        TX(c, 'ARGUMENTS IN HIS LIFE', 960, 250, { align: 'center', size: 28, spacing: .2, a: span(t, s.a - .3, s.a + .3) });
        c.fillStyle = rgba('#e8eefc', .25); c.fillRect(958, 300, 3, 420);
        TX(c, 'WON', 700, 340, { align: 'center', size: 30, a: span(t, s.a, s.a + .4) }); TX(c, 'LOST', 1220, 340, { align: 'center', size: 30, a: span(t, s.a, s.a + .4) });
        const n = Math.floor(Math.max(0, t - s.a) * 9); c.strokeStyle = P.cream; c.lineWidth = 4;
        for (let q = 0; q < Math.min(n, 60); q++) { const g = Math.floor(q / 5), j = q % 5, gx = 560 + (g % 4) * 76, gy = 400 + Math.floor(g / 4) * 70; c.beginPath(); if (j < 4) { c.moveTo(gx + j * 13, gy); c.lineTo(gx + j * 13, gy + 48); } else { c.moveTo(gx - 6, gy + 38); c.lineTo(gx + 50, gy + 10); } c.stroke(); }
        TX(c, 'EVERY ONE', 700, 740, { align: 'center', size: 24, col: SUB, a: span(t, ta, ta + .5) });
        SER(c, '0', 1220, 640, { align: 'center', size: 240, a: span(t, ta - .2, ta + .3) });
        c.restore();
        // G.15 every reply he gets carries a YES
        if (mv > 0) { S.boy(c, t, 1020, 820, 200, { dir: 1, pose: 'hold', look: .6, back: .2 });
          for (let q = 0; q < 5; q++) { const u = span(t, t15 + .2 + q * .35, t15 + .6 + q * .35); bubble(c, 1180, 220 + q * 110, 520, 70, u * mv, { yes: span(t, tg - .2 + q * .12, tg + .2 + q * .12) }); } }
      });
    },
    out: { k: 'iris', c: [1180 + 520 - 26, 220 + 4 * 110 + 35, 24], lead: .3, dur: 1.0, rim: '#f3efe2' },
  };
  // ---------------------------------------------------------------- G.16–G.17 · EXPL the survey (Common Sense 2026) · the rulebook with blank pages
  let pageRect = [980, 330, 400, 380];
  const G16 = {
    id: 'G.16',
    draw(ctx, t, s) {
      const t17 = s.r('G.17'), tt = s.w('third'), tf = s.w('feelings'), td = G('decided', t17);
      const card = Math.pow(span(t, t17 - .45, t17 + 1.3), 2), dim = 1 - .6 * span(t, t17 - .3, t17 + .3);
      K.dusk(ctx, t, { glow: [1000, 520] });
      const zP = 1 + .02 * sineIO(span(t, s.a, s.b)) + .08 * sineIO(span(t, s.b - 2.6, s.b + .6));
      K.scr(ctx, (c) => { float2(c, t, zP, 1137, 536);   // the last push goes into the blank page
        c.save(); c.globalAlpha = dim;
        TX(c, 'IN YOUR DAY · 2026', 240, 230, { size: 24, col: '#ffe7a8', spacing: .2, a: span(t, s.a - .2, s.a + .3) });
        B.SER(c, 'More than 1 in 3', 240, 380, { size: 104, a: span(t, tt - .3, tt + .2) });
        TX(c, 'U.S. KIDS WHO USE AI', 240, 450, { size: 26, a: span(t, tt, tt + .4) });
        TX(c, 'TALKED TO IT ABOUT THEIR', 240, 520, { size: 26, a: span(t, tf - .4, tf) }); TX(c, 'FEELINGS OR PROBLEMS', 240, 558, { size: 26, a: span(t, tf - .3, tf + .1) });
        TX(c, 'SOURCE: COMMON SENSE MEDIA · AI USE BY TWEENS AND TEENS · 2026 · 1,204 KIDS AGED 9–17', 240, 840, { size: 22, col: SUB, spacing: .06, a: span(t, tt + .5, tt + 1) });
        // icon array: one in three highlighted (carmine = talked to the machine about feelings), the rest neutral
        for (let k = 0; k < 3; k++) { const x = 1220 + k * 200, u = span(t, tt - .3 + k * .1, tt + .2 + k * .1); if (u <= 0) continue; c.save(); c.globalAlpha *= u;
          K.figureRaw(c, x, 780, 280 * (1 + .006 * Math.sin(t * 1.9 + k)), { hood: false, dir: k === 0 ? 1 : -1, look: k === 0 ? .6 : .1 }, k === 0 && t > tf - .3 ? carmPal : restPal, false); c.restore(); }
        const bu = span(t, tf - .2, tf + .3); if (bu > 0) { c.save(); c.globalAlpha *= bu; c.fillStyle = '#f4eef2'; c.beginPath(); c.roundRect(1280, 380, 120, 70, 35); c.fill(); c.beginPath(); c.moveTo(1290, 440); c.lineTo(1270, 480); c.lineTo(1320, 448); c.fill();
          c.fillStyle = CARM.body; for (let q = 0; q < 3; q++) { c.beginPath(); c.arc(1316 + q * 24, 415, 6, 0, 7); c.fill(); } c.restore(); }
        c.restore();
        // G.17 the rulebook: blank pages, STILL BEING DECIDED (a paper card out of the speech bubble)
        if (card > 0) K.paper(c, t, 440, 180, 1040, 640, card, { from: [1340, 415], head: 'IN YOUR DAY · THE RULES', draw: (g, x, y, w, h) => {
          const bx = x + w / 2, by = y + h * .2, pw = w * .36, ph = h * .6; K.ink(g, K.PAPER.ink2, 3);
          g.fillStyle = '#fffaf0'; g.beginPath(); g.moveTo(bx, by + 20); g.quadraticCurveTo(bx - pw * .5, by - 10, bx - pw, by + 10); g.lineTo(bx - pw, by + ph); g.quadraticCurveTo(bx - pw * .5, by + ph - 20, bx, by + ph + 10); g.closePath(); g.fill(); g.stroke();
          g.beginPath(); g.moveTo(bx, by + 20); g.quadraticCurveTo(bx + pw * .5, by - 10, bx + pw, by + 10); g.lineTo(bx + pw, by + ph); g.quadraticCurveTo(bx + pw * .5, by + ph - 20, bx, by + ph + 10); g.closePath(); g.fill(); g.stroke();
          g.fillStyle = K.PAPER.ink; g.font = '400 40px "Instrument Serif"'; g.textAlign = 'center'; g.fillText('What a machine may want from a child', bx, y + h * .11); g.textAlign = 'left';
          g.fillStyle = rgba(K.PAPER.ink2, .35); for (let q = 0; q < 3; q++) g.fillRect(bx - pw + 30, by + 60 + q * 28, pw * (.7 - q * .15), 4);
          const nf = sineIO(span(t, s.b - 1.7, s.b - .55)); if (nf > 0) { g.fillStyle = rgba('#111a48', nf); g.fillRect(bx + 16, by + 24, pw - 32, ph - 30); }   // the blank page fills with night (the portal opens out of it)
          const r0 = [440 + bx + 16, 180 + by + 24, pw - 32, ph - 30]; pageRect = [1137 + (r0[0] - 1137) * zP, 536 + (r0[1] - 536) * zP, r0[2] * zP, r0[3] * zP];   // the card's local frame → screen (the card sits at 440,180 once open)
          const fl = ((t - t17) * .7) % 1, fe = sineIO(clamp(fl * 1.6));   // a blank page turns, and the next one is blank too
          const cyc0 = t17 + Math.floor((t - t17) * .7) / .7;
          if (cyc0 > t17 + 1 && cyc0 < td - .9) { g.save(); g.fillStyle = '#f6efdc'; g.strokeStyle = rgba(K.PAPER.ink2, .6); g.lineWidth = 2; const ex = bx + pw * Math.cos(Math.PI * fe); g.beginPath(); g.moveTo(bx, by + 20); g.lineTo(ex, by + 10 - 14 * Math.sin(Math.PI * fe)); g.lineTo(ex, by + ph - 14 * Math.sin(Math.PI * fe)); g.lineTo(bx, by + ph + 10); g.closePath(); g.fill(); g.stroke(); g.restore(); }
          const sd = span(t, td - .1, td + .4); if (sd > 0) { g.save(); g.globalAlpha = clamp(sd * 3); g.translate(bx, y + h - 30); g.rotate(-.04); g.scale(lerp(1.4, 1, expoOut(sd)), lerp(1.4, 1, expoOut(sd))); g.strokeStyle = K.PAPER.red; g.lineWidth = 4; g.strokeRect(-230, -34, 460, 56); g.fillStyle = K.PAPER.red; g.font = '800 30px Inter'; g.textAlign = 'center'; g.fillText('STILL BEING DECIDED', 0, 5); g.restore(); }
        } });
        const nc = card > 0 ? .82 * sineIO(span(t, s.b - 1.5, s.b - .45)) : 0;   // the night spreads from the blank page over the whole rulebook
        if (nc > 0) { c.fillStyle = rgba('#111a48', nc); c.beginPath(); c.roundRect(436, 176, 1048, 648, 8); c.fill(); }
      });
    },
    out: { k: 'portal', win: () => pageRect, lead: .5, dur: 1.7 },
  };
  return B.calmShots([G01, G03, G04, G05, G06, G07, G08, G09, G12, G13, G14, G16], R, { dur: 1.15 });
}
