// Film 79 · c08 THE SQUARE (Q.01–Q.14, vo-v2) · builder B3.
// PLAN (docs/BRIEF-builders.md §5 gate 1)
//   beats  Q.01 the search ring leaves the sold fields on the small map and runs the path to the town square (where people used to argue: an ink
//          ghost of a crowd) → Q.02 you on the footpath back into town at 6 PM (friend windows already glow in the town) → Q.03 THE EMPTY SQUARE
//          (anchor Pointe: dry fountain, shut stall, empty benches), low → Q.04 pull back and up: you are the only one, tiny → Q.05 every window
//          around the square lights with the AI friend, push to one window (ANSWERS AT ANY HOUR · REMEMBERS EVERYTHING) → Q.06 inside: arrows only
//          from the friend to the person, the lane back stays empty → Q.07 the paper card of the past comes back out of the friend's ring (the
//          computer scientist, the evening he saw coming) → Q.08 a screen inks on the card → C3 the plate grows out of it, folds back → Q.09 the card
//          folds into the search ring: the row of houses scanned, ANGRY FACES 0 · ROBBED 0 · LOOKED AFTER ALL → Q.10 one friend window close, the glow
//          steady → Q.11 back out to the square, low behind a bench: the ink ghost of the crowd that argued here is wiped → Q.12 the NOT NEEDED list,
//          one box left → Q.13 the box becomes a dial: YOUR TIME → Q.14 the square's clock tower, nobody under it (an ink ghost waiting is wiped),
//          the counter adds YOUR TIME.
//   carriers  in: c07 ends on the last offer slip on the field map (L.13) → Q.01 opens on the field map with the SOLD parcels and the search ring on
//          them (EXPL to EXPL; the carrier into Q.01 is B2's `out` of the slip shot) · ring → iris → path · lamp post sweep → square · window → portal →
//          arrows · friend ring → paper card → plate → card folds into the search ring · house window → portal → window close · portal out → square ·
//          HUD counter → iris → list · empty box → dial → iris → tower clock · the dark arch under the clock → portal → c09 bench.
//   wow    none in c08 (the film's wow of this stretch is c09's light-out 3); hard accents: none (the friend windows rise over 1.3 s).
import * as K from '../lib/f79_kit.mjs';
import * as S from '../lib/f79_street.mjs';
import * as PL from '../lib/f79_places.mjs';
import * as B from '../lib/f79_b3.mjs';
import { hourAt, COUNT } from './hud.mjs';
import { clipPlate, CLIPS } from './clips.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, cam3, aim, camK, project, CARM, AMBER } = K;
const look = (R, t) => K.hourLook(hourAt(R, t));
const FRIEND_WIN = [1426.8, 338.8, 52, 86];   // the friend window we push into (window 24 of PL.square's 5200 card, lit by K.friendWindows)

export default function c08(T, R) {
  const r = (id) => R[id];
  // ---------------------------------------------------------------- Q.01 · the small map: the search ring leaves the sold fields for the town square
  const SQ = [520, 330], PATH = [[1430, 720], [1260, 640], [1080, 600], [900, 520], [720, 440], SQ];
  const pathAt = (u) => { const n = PATH.length - 1, f = clamp(u) * n, i = Math.min(n - 1, Math.floor(f)), k = f - i; return [lerp(PATH[i][0], PATH[i + 1][0], k), lerp(PATH[i][1], PATH[i + 1][1], k)]; };
  const oQ1 = (s) => ({ z0: 1, z1: 1.14, cx0: W / 2, cx1: 840, cy0: H / 2, cy1: 490 });
  const ringQ1 = (t, s) => pathAt(K.sineIO(span(t, s.a + .2, s.w('argue') - .1)));
  const Q01 = {
    id: 'Q.01',
    draw(ctx, t, s) {
      const o = oQ1(s);
      B.expl(ctx, t, s.a - .4, s.b + .8, (c) => {
        // the fields at the end of the street: parcels, sold (carmine) one good offer at a time
        const pr = K.prng(9);
        for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) {
          const x = 1220 + i * 92 + j * 26, y = 640 + j * 58, sold = pr() < .82;
          c.fillStyle = sold ? rgba(CARM.body, .55) : rgba(B.REST, .35); c.strokeStyle = rgba(B.PALE, .5); c.lineWidth = 2;
          c.beginPath(); c.moveTo(x, y); c.lineTo(x + 84, y); c.lineTo(x + 104, y + 50); c.lineTo(x + 20, y + 50); c.closePath(); c.fill(); c.stroke();
        }
        c.strokeStyle = rgba('#8a96c8', .7); c.lineWidth = 3; c.beginPath(); c.moveTo(1180, 620); c.lineTo(1900, 620); c.stroke();   // the fence
        for (let x = 1186; x < 1900; x += 14) { c.beginPath(); c.moveTo(x, 606); c.lineTo(x, 620); c.stroke(); }
        // the road through the street (house blocks along it) to the town; the path loops back to the square
        c.strokeStyle = rgba(B.PALE, .55); c.lineWidth = 3; c.setLineDash([2, 10]); c.lineCap = 'round'; c.beginPath(); c.moveTo(...PATH[0]); for (const p of PATH.slice(1)) c.lineTo(...p); c.stroke(); c.setLineDash([]);
        c.fillStyle = rgba(B.PALE, .28); for (let k = 0; k < 9; k++) { const [x, y] = pathAt(.12 + k * .07); c.fillRect(x - 30, y - 64, 34, 26); c.fillRect(x + 12, y + 30, 34, 26); }
        // the town square: a plaza, the clock tower, the houses around it
        c.strokeStyle = rgba(B.PALE, .8); c.lineWidth = 3; c.strokeRect(SQ[0] - 90, SQ[1] - 70, 180, 140);
        c.fillStyle = rgba(B.PALE, .4); for (let k = 0; k < 10; k++) { const a = k / 10 * 6.283; c.fillRect(SQ[0] + Math.cos(a) * 150 - 18, SQ[1] + Math.sin(a) * 118 - 14, 36, 28); }
        c.fillStyle = rgba(B.PALE, .9); c.fillRect(SQ[0] - 9, SQ[1] - 60, 18, 30); c.beginPath(); c.arc(SQ[0], SQ[1] + 10, 22, 0, 7); c.strokeStyle = rgba(B.PALE, .7); c.stroke();
        const lu = K.cardU(t, s.w('one place') - .2, s.b + 2);
        if (lu > 0) K.maskLine(c, [['THE TOWN SQUARE', 0]], SQ[0], SQ[1] - 150, 24, K.rise(lu), { serif: false, weight: 600, col: P.cream, glow: false, align: 'center' });
        // where people used to argue: an ink ghost of a crowd (pale), only for a moment
        const gh = span(t, s.w('argue') - .5, s.w('argue')) * (1 - span(t, s.b - .1, s.b + .5));
        if (gh > 0) { c.save(); c.globalAlpha *= gh * .8; for (let k = 0; k < 7; k++) { const x = SQ[0] - 70 + k * 23, y = SQ[1] + 52 + (k % 2) * 8; B.inkFig(c, t, x, y, 44 + (k % 3) * 4, { pose: k % 3 === 0 ? 'point' : k % 3 === 1 ? 'reach' : 'stand', dir: k % 2 ? 1 : -1 }); } c.restore(); }
        // the search ring: from the sold fields along the path to the square
        const [rx, ry] = ringQ1(t, s);
        B.searchRing(c, t, rx, ry, 46, span(t, s.a - .6, s.a + .1), { label: 'ANGRY FACES', n: 0 });
      }, o);
    },
    out: { k: 'iris', c: (t, s) => { const o = oQ1(s), [rx, ry] = ringQ1(t, s), p = B.explAt(t, s.a - .4, s.b + .8, o, rx, ry); return [p[0], p[1], 46 * p[2]]; }, lead: .55, dur: 1.5, pushA: .15, rim: '#dfe6ff' },
  };
  // ---------------------------------------------------------------- Q.02 · the path back into town, 6 PM
  const camQ2 = (t, s) => camK(t, [[s.a - .6, cam3({ z: -20, x: 110, y: -20 })], [s.b + .5, cam3({ z: 130, x: 40, y: -30 })]], .25);
  const Q02 = {
    id: 'Q.02',
    draw(ctx, t, s) {
      const u = span(t, s.a - .6, s.b + .5), x = lerp(1200, 1020, u), y = lerp(1000, 950, u);
      B.townPath(ctx, t, camQ2(t, s), look(R, t), { you: [x, y, lerp(200, 186, u)], walk: K.walkPh(t, .55) });
    },
    out: { k: 'sweep', kind: 'post', dir: -1, w: 120, col: '#0a0e2a', lead: .5, dur: 1.3 },
  };
  // ---------------------------------------------------------------- Q.03–Q.05 · THE EMPTY SQUARE (anchor Pointe): low, pull back (you tiny), the friend windows, push to one
  const winRect = FRIEND_WIN;
  const camSq = (t, s) => { const t4 = r('Q.04'), t5 = r('Q.05'); return camK(t, [[s.a - .8, cam3({ z: 330, y: 120, x: 70 })], [t4 - .1, cam3({ z: 250, y: 95, x: 40 })],
    [t4 + 2.4, cam3({ z: -900, y: -70, x: 0 }), 's'], [t5 + 1.0, cam3({ z: -860, y: -80, x: 20 })], [s.w('remembers') - .2, aim(5200, winRect[0] + winRect[2] / 2, winRect[1] + winRect[3] / 2, 1.55, W * .55, H * .5), 's'],
    [s.b + .6, aim(5200, winRect[0] + winRect[2] / 2, winRect[1] + winRect[3] / 2, 1.65, W * .55, H * .5)]], .3); };
  const Q03 = {
    id: 'Q.03',
    draw(ctx, t, s) {
      const t5 = r('Q.05'), c = camSq(t, s), fr = K.sineIO(span(t, t5 + .1, t5 + 1.4));
      PL.square(ctx, t, c, look(R, t), { people: 0, dry: true, shut: true, benches: true, friends: fr, lit: 0,
        focus: (g, tt) => { K.you(g, tt, 760, 1012, 236, { dir: 1, look: lerp(.15, .7, span(tt, t5 - .2, t5 + 1.2)), back: .2 }); } });
      // the friend's spill on the square floor
      if (fr > 0) { const p = project(c, 2200, 960, 900); if (p) K.scr(ctx, (g) => K.carmGlow(g, p[0], p[1], 900 * p[2], .06 * fr)); }
      // two tags on the one window
      const p = project(c, 5200, winRect[0] + winRect[2], winRect[1] + winRect[3] / 2);
      if (p) { const a1 = K.cardU(t, s.w('answers') - .1, s.b - .2), a2 = K.cardU(t, s.w('remembers') - .1, s.b - .2);
        K.scr(ctx, (g) => { const x = p[0] + 30, y = p[1]; if (a1 > 0) { g.strokeStyle = rgba(P.cream, .6 * a1); g.lineWidth = 2; g.beginPath(); g.moveTo(p[0] + 6, y); g.lineTo(x + 40, y - 60); g.lineTo(x + 70, y - 60); g.stroke(); } });
        K.caps(ctx, 'ANSWERS AT ANY HOUR', p[0] + 110, p[1] - 52, a1, { size: 24 }); K.caps(ctx, 'REMEMBERS EVERYTHING', p[0] + 110, p[1] - 12, a2, { size: 24 }); }
    },
    out: { k: 'portal', win: (t, s) => { const c = camSq(t, s), a = project(c, 5200, winRect[0], winRect[1]), b = project(c, 5200, winRect[0] + winRect[2], winRect[1] + winRect[3]); return [a[0], a[1], b[0] - a[0], b[1] - a[1]]; }, lead: .6, dur: 2.0 },
  };
  // ---------------------------------------------------------------- Q.07–Q.09 · the paper card (the computer scientist), C3 on its plate, the search result
  const CARD = [560, 120, 800, 600], FRAME = [700, 300, 520, 292], RING9 = [960, 560];
  const RING6 = [640, 470];
  const oQ7 = { z0: 1.05, z1: 1.0, a: r('Q.06') - 1, b: r('Q.09') };
  const lanes = (c, t, s, k) => {   // Q.06 · inside the window: it only ever gives (k 0..1 fades the lanes and the person when the card comes)
    if (k >= 1) return; c.save(); c.globalAlpha *= 1 - k; c.translate(0, 30 * K.expoIn(k));
    B.inkFig(c, t, 1300, 700, 300, { dir: -1, look: -.1, pose: 'stand' }, K.pal(3));
    c.strokeStyle = rgba(CARM.hot, .35); c.lineWidth = 3; c.beginPath(); c.moveTo(740, 440); c.quadraticCurveTo(980, 380, 1220, 470); c.stroke();
    for (let q = 0; q < 6; q++) { const u = ((t * .55 + q / 6) % 1), x = (1 - u) * (1 - u) * 740 + 2 * (1 - u) * u * 980 + u * u * 1220, y = (1 - u) * (1 - u) * 440 + 2 * (1 - u) * u * 380 + u * u * 470;
      c.fillStyle = rgba(CARM.core, Math.sin(Math.PI * u) * .95); c.beginPath(); c.arc(x, y, 7, 0, 7); c.fill(); }
    c.fillStyle = CARM.hot; c.beginPath(); c.moveTo(1232, 474); c.lineTo(1208, 452); c.lineTo(1204, 482); c.fill();
    B.T(c, 'GIVES', 980, 350, { size: 26, align: 'center', spacing: .24 });
    const lb = span(t, s.w('gives') - .3, s.w('gives') + .4);   // the lane back: dashed, nothing moves on it
    c.globalAlpha *= lb; c.strokeStyle = rgba(B.SUB, .5); c.lineWidth = 2.5; c.setLineDash([8, 12]); c.beginPath(); c.moveTo(1220, 600); c.quadraticCurveTo(980, 660, 740, 580); c.stroke(); c.setLineDash([]);
    B.T(c, 'IN RETURN', 940, 712, { size: 24, align: 'center', col: rgba(P.cream, .75), spacing: .2 }); K.glowText(c, '0', 1070, 718, { size: 48, serif: true, align: 'center', col: P.cream, glow: false });
    c.restore();
  };
  const HOUSES = Array.from({ length: 9 }, (_, i) => 280 + i * 170), HY = 790;
  const Q06 = {
    id: 'Q.06',
    draw(ctx, t, s) {
      const c3 = T.clip('C3'), t7 = r('Q.07'), t9 = r('Q.09'), tCalm = s.w('calm'), tRob = s.w('robbed'), tLook = s.w('looked after');
      B.expl(ctx, t, oQ7.a, oQ7.b, (c) => {
        // the friend (a carmine ring): the lanes of Q.06, then the card of the past unfolds out of it (Q.07)
        const ra = 1 - span(t, t7 + .2, t7 + .9); if (ra > 0) { K.carmGlow(c, RING6[0], RING6[1], 520, .16 * ra); K.ring(c, t, RING6[0], RING6[1], 66, ra); }
        lanes(c, t, s, span(t, t7 - .2, t7 + .5));
        const closing = t > c3.end;
        const u = clamp(span(t, t7 + .05, t7 + .75) - K.sineIO(span(t, t9 - .75, t9 + .45))) * (t < t9 + .45 ? 1 : 0);
        if (u > 0) K.paper(c, t, ...CARD, u, { from: closing ? [RING9[0], 300] : RING6, head: 'BACK IN THE TWENTIES', draw: (g, x, y, w, h) => {
          // the computer scientist at a lectern (blue ink), and the evening he saw coming: an empty square, the windows lit
          B.inkFig(g, t, x + 120, y + h - 70, 230, { pose: 'point', dir: 1, look: .2 }, B.INKP);
          K.ink(g, K.PAPER.ink2, 3); g.strokeRect(x + 150, y + h - 170, 70, 100);
          g.fillStyle = K.PAPER.ink; g.font = '600 22px Inter'; g.textAlign = 'left'; g.fillText('A COMPUTER SCIENTIST · UNIVERSITY OF TORONTO', x + 10, y + h - 20);
          const ev = span(t, s.w('evening') - .2, s.w('evening') + .6) * (1 - span(t, r('Q.08') + .2, r('Q.08') + .7));
          if (ev > 0) { g.save(); g.globalAlpha *= ev; K.ink(g, K.PAPER.ink, 2.6); const sx = x + 360, sy = y + 60;
            g.strokeRect(sx + 120, sy, 50, 200); g.beginPath(); g.arc(sx + 145, sy + 40, 16, 0, 7); g.stroke();
            for (let k = 0; k < 4; k++) { g.strokeRect(sx + k * 74 - (k > 1 ? -110 : 0), sy + 70, 60, 130); g.fillStyle = rgba(CARM.body, .55); g.fillRect(sx + k * 74 - (k > 1 ? -110 : 0) + 18, sy + 92, 22, 26); }
            g.beginPath(); g.moveTo(sx - 20, sy + 200); g.lineTo(sx + 380, sy + 200); g.stroke(); g.restore(); }
          // Q.08: a screen inks on the card: the plate will grow out of it
          const fu = span(t, r('Q.08') + .3, r('Q.08') + 1.3);
          if (fu > 0) { K.ink(g, K.PAPER.ink, 3); const fx = FRAME[0] - CARD[0], fy = FRAME[1] - CARD[1];
            K.strokeIn(g, [[fx, fy], [fx + FRAME[2], fy], [fx + FRAME[2], fy + FRAME[3]], [fx, fy + FRAME[3]], [fx, fy]], fu); }
        } });
        // C3 on the plate (grows out of the inked screen, folds back into it)
        const m = span(t, c3.start - .35, c3.start + .85) * (1 - span(t, c3.end - .15, c3.end + .55));
        if (m > 0) { const a = B.explAt(t, oQ7.a, oQ7.b, oQ7, FRAME[0], FRAME[1]), b = B.explAt(t, oQ7.a, oQ7.b, oQ7, FRAME[0] + FRAME[2], FRAME[1] + FRAME[3]);
          clipPlate(ctx, t, T, 'C3', [a[0], a[1], b[0] - a[0], b[1] - a[1]], m);
          const fo = Math.max(1 - span(t, c3.start - .35, c3.start + .1), span(t, c3.end + .15, c3.end + .5)); if (fo > 0) K.scr(ctx, (g) => { g.fillStyle = rgba(K.PAPER.body, fo); g.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); }); }
        // Q.09: the card folds into the search ring; the ring scans the street's houses: the result
        if (t > t9 - .6) {
          const ha = span(t, t9 - .3, t9 + .6);
          HOUSES.forEach((x, i) => { const y = HY, hh = 120 + (i % 3) * 18, a = ha * span(t, t9 - .3 + i * .04, t9 + .4 + i * .04);
            c.save(); c.globalAlpha *= a; c.fillStyle = mixHex('#2a3270', '#0b1238', .2); c.fillRect(x - 70, y - hh, 140, hh); c.beginPath(); c.moveTo(x - 80, y - hh); c.lineTo(x, y - hh - 58); c.lineTo(x + 80, y - hh); c.fill();
            K.friendWindows(c, t + i, [[x - 48, y - hh + 26, 30, 36], [x + 18, y - hh + 26, 30, 36]], 1); c.restore(); });
          const sc = K.sineIO(span(t, t9 + .3, tLook - .2)), rx = lerp(HOUSES[0], HOUSES[8], sc), ry = HY - 70;
          const back = K.sineIO(span(t, tLook - .2, tLook + 1.2)), x = lerp(rx, RING9[0], back);
          B.searchRing(c, t, x, ry, 84, ha);
          const rows = [['ANGRY FACES', '0', tCalm], ['ROBBED', '0', tRob], ['LOOKED AFTER', 'ALL', tLook]];
          rows.forEach(([lab, n, t0], i) => { const u2 = span(t, t0 - .1, t0 + .5); if (u2 <= 0) return; const y = 250 + i * 96;
            K.maskLine(c, [[lab, 0]], 930, y, 34, K.rise(u2), { serif: false, weight: 600, col: P.cream, glow: false, align: 'right' });
            K.maskLine(c, [[n, 0]], 975, y + 10, 70, K.rise(u2), { serif: true, col: i === 2 ? CARM.core : P.cream, glow: false, align: 'left' }); });
        }
      }, oQ7);
    },
    out: { k: 'iris', c: (t, s) => { const hh = 120 + (4 % 3) * 18, p = B.explAt(t, oQ7.a, oQ7.b, oQ7, HOUSES[4] + 33, HY - hh + 44); return [p[0], p[1], 20 * p[2]]; }, lead: .6, dur: 1.8, pushA: .2, rim: '#ffd6e4' },
  };
  // ---------------------------------------------------------------- Q.10 · one friend window close: the glow steady
  const WIN10 = [520, 160, 880, 620];
  const Q10 = {
    id: 'Q.10',
    draw(ctx, t, s) {
      B.expl(ctx, t, s.a - 1.2, s.b + 1.2, (c) => {
        const [x, y, w, h] = WIN10;
        c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
        c.fillStyle = K.lin(c, x, y, x + w, y + h, [[0, '#1c0e30'], [1, '#0a0620']]); c.fillRect(x, y, w, h);
        const fl = .9 + .05 * Math.sin(t * 1.7);   // steady: it breathes, it never flickers out
        c.fillStyle = K.rad(c, x + w * .3, y + h * .45, w * .7, [[0, rgba('#e07ab8', .55 * fl)], [.5, rgba('#9a4ac8', .2 * fl)], [1, rgba('#2a1040', 0)]]); c.fillRect(x, y, w, h);
        K.ring(c, t, x + w * .3, y + h * .45, 48, .95);
        // a person in an armchair, seen from behind, turned to the light (no face)
        c.fillStyle = '#120a22'; c.beginPath(); c.roundRect(x + w * .52, y + h * .55, 260, 260, 40); c.fill();
        K.figureRaw(c, x + w * .62, y + h + 60, 420, { dir: -1, look: -.05 + .06 * Math.sin(t * .4), back: .9, hood: false }, { base: '#3a2050', lit: '#c06aa0', shade: '#1a0c2a', deep: '#0e0618', hem: .3 }, false);
        c.fillStyle = '#120a22'; c.beginPath(); c.roundRect(x + w * .5, y + h * .74, 300, 200, 30); c.fill();
        c.restore();
        // the window frame (cream mullions), the house wall around it
        c.strokeStyle = mixHex('#2a3270', '#0b1238', .1); c.lineWidth = 60; c.strokeRect(x - 30, y - 30, w + 60, h + 60);
        c.strokeStyle = rgba('#e8eefc', .5); c.lineWidth = 10; c.strokeRect(x, y, w, h); c.beginPath(); c.moveTo(x + w / 2, y); c.lineTo(x + w / 2, y + h); c.moveTo(x, y + h * .42); c.lineTo(x + w, y + h * .42); c.stroke();
      }, { z0: 1.0, z1: 1.06, cy0: 470 });
    },
    out: { k: 'fn', fn: (ctx, u, dA, dB, t) => B.portalOut(() => winQ11(t))(ctx, u, dA, dB, t), lead: .4, dur: 1.5 },
  };
  // ---------------------------------------------------------------- Q.11 · the empty square again, low behind a bench: the ink ghost of the crowd is wiped
  const camQ11 = (t) => camK(t, [[r('Q.11') - 1, cam3({ z: 150, y: 70, x: 170 })], [r('Q.12') + .6, cam3({ z: 230, y: 85, x: 130 })]], .2);
  const winQ11 = (t) => { const c = camQ11(t), a = project(c, 5200, winRect[0], winRect[1]), b = project(c, 5200, winRect[0] + winRect[2], winRect[1] + winRect[3]); return [a[0], a[1], b[0] - a[0], b[1] - a[1]]; };
  const Q11 = {
    id: 'Q.11',
    draw(ctx, t, s) {
      const tn = s.w('nobody'), wipe = span(t, tn + .25, tn + 1.4);
      PL.square(ctx, t, camQ11(t), look(R, t), { people: 0, dry: true, shut: true, benches: true, friends: 1, lit: 0,
        focus: (g, tt) => {   // what used to be: a crowd that argued (pale ink); wiped off on "nobody"
          const ga = span(tt, s.a - .2, s.a + .6); if (ga <= 0 || wipe >= 1) return;
          g.save(); g.beginPath(); g.rect(-400 + 2800 * K.sineIO(wipe), -200, 3000, 1600); g.clip(); g.globalAlpha *= ga * .75;
          g.globalAlpha *= .55; for (let k = 0; k < 11; k++) { const x = 420 + k * 104 + (k % 2) * 30, y = 930 + (k % 3) * 14; B.inkFig(g, tt, x, y, 150 + (k % 3) * 12, { pose: ['point', 'reach', 'stand', 'lift'][k % 4], dir: k % 2 ? 1 : -1, look: .3 }); }
          K.ink(g, B.PALE, 2.4); for (let k = 0; k < 5; k++) { const x = 470 + k * 230, y = 760; g.beginPath(); g.arc(x, y, 24, 3.6, 5.8); g.stroke(); g.beginPath(); g.arc(x, y, 40, 3.7, 5.7); g.stroke(); }
          g.restore(); } });
    },
    out: { k: 'iris', c: [190, 146, 30], lead: .5, dur: 1.5, pushA: .15, rim: '#ffd6de' },
  };
  // ---------------------------------------------------------------- Q.12–Q.13 · the NOT NEEDED list, one box left → the dial: YOUR TIME
  const DIAL = [1300, 470, 190];
  const Q12 = {
    id: 'Q.12',
    draw(ctx, t, s) {
      const t13 = r('Q.13'), lines = COUNT.filter(([id]) => R[id] != null && R[id] < s.a).map(([id, n, l]) => [R[id], n, l]).sort((p, q) => p[0] - q[0]);
      const nLeft = 9, used = lines.map(([, n, l]) => [n, l]), mv = K.sineIO(span(t, t13 - .1, t13 + 1.3));
      B.expl(ctx, t, s.a - .5, s.b + 1, (c) => {
        const x0 = lerp(560, 260, mv), y0 = 210, gap = Math.min(66, 560 / nLeft);
        B.T(c, 'NOT NEEDED IN 2050', x0, y0 - 20, { size: 26, col: '#c9b8d6', spacing: .24, a: span(t, s.a - .3, s.a + .4) });
        for (let i = 0; i < nLeft; i++) {
          const y = y0 + 40 + i * gap, u = span(t, s.a - .2 + i * .05, s.a + .4 + i * .05), have = used.find(([n]) => n === i + 1);
          if (u <= 0) continue; c.save(); c.globalAlpha *= u * (i === nLeft - 1 ? 1 : lerp(1, .45, mv));
          const last = i === nLeft - 1, bx = x0 + 22, by = y + 2;
          if (!last) { c.strokeStyle = have ? CARM.hot : rgba('#e8eefc', .3); c.lineWidth = 2.5; c.beginPath(); c.roundRect(bx - 22, by - 22, 44, 44, 6); c.stroke();
            if (have) { c.fillStyle = K.rad(c, bx, by, 30, [[0, CARM.hot], [1, CARM.mid]]); c.beginPath(); c.roundRect(bx - 18, by - 18, 36, 36, 5); c.fill(); }
            K.glowText(c, String(i + 1), bx, by + 11, { size: 30, serif: true, align: 'center', col: have ? CARM.core : rgba('#e8eefc', .4), glow: false });
            if (have) B.T(c, have[1], bx + 44, by + 9, { size: 22 }); }
          c.restore();
        }
        // the last box: empty, waiting (Q.12) → lifts and opens into the dial (Q.13)
        const ly = y0 + 40 + (nLeft - 1) * gap + 2, lx = x0 + 22, hi = span(t, s.w('left') - .2, s.w('left') + .4);
        const cx = lerp(lx, DIAL[0], mv), cy = lerp(ly, DIAL[1], mv), rr = lerp(22, DIAL[2], mv);
        c.save(); c.strokeStyle = mixHex('#e8eefc', AMBER.body, Math.max(hi, mv)); c.lineWidth = lerp(2.5, 5, mv);
        if (mv < .02) { c.fillStyle = K.rad(c, cx, cy, 60, [[0, rgba(AMBER.body, .25 * hi)], [1, rgba(AMBER.body, 0)]]); c.fillRect(cx - 60, cy - 60, 120, 120); c.beginPath(); c.roundRect(cx - 22, cy - 22, 44, 44, 6); c.stroke();
          K.glowText(c, '?', cx, cy + 12, { size: 34, serif: true, align: 'center', col: rgba('#e8eefc', .5 + .4 * hi), glow: false }); }
        else { const k = clamp(mv * 1.4); c.beginPath(); c.roundRect(cx - rr, cy - rr, rr * 2, rr * 2, lerp(6, rr, k)); c.stroke();
          c.fillStyle = K.rad(c, cx, cy, rr * 1.8, [[0, rgba(AMBER.body, .16 * mv)], [1, rgba(AMBER.body, 0)]]); c.fillRect(cx - rr * 1.8, cy - rr * 1.8, rr * 3.6, rr * 3.6);
          c.globalAlpha *= span(mv, .5, 1); c.strokeStyle = rgba(AMBER.core, .7); c.lineWidth = 2;
          for (let i = 0; i < 60; i++) { const a = i / 60 * 6.283, l = i % 5 ? 8 : 18; c.beginPath(); c.moveTo(cx + Math.cos(a) * (rr - 14), cy + Math.sin(a) * (rr - 14)); c.lineTo(cx + Math.cos(a) * (rr - 14 - l), cy + Math.sin(a) * (rr - 14 - l)); c.stroke(); }
          const ha = -1.5708 + t * .5; c.strokeStyle = AMBER.body; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(ha) * rr * .78, cy + Math.sin(ha) * rr * .78); c.stroke();
          c.fillStyle = AMBER.body; c.beginPath(); c.arc(cx, cy, 9, 0, 7); c.fill(); }
        c.restore();
        const yu = span(t, s.w('time') - .1, s.w('time') + .6), mu = span(t, s.w('machine') - .3, s.w('machine') + .4);
        K.maskLine(c, [['YOUR TIME', 0]], DIAL[0], DIAL[1] + DIAL[2] + 96, 72, K.rise(yu), { serif: true, col: P.cream, glow: false, align: 'center' });
        K.maskLine(c, [['THE ONE THING NO MACHINE CAN MAKE', 0]], DIAL[0], DIAL[1] + DIAL[2] + 146, 24, K.rise(mu), { serif: false, weight: 600, col: rgba(P.cream, .85), glow: false, align: 'center' });
      }, { z0: 1.0, z1: 1.04 });
    },
    out: { k: 'iris', c: (t, s) => { const p = B.explAt(t, s.a - .5, s.b + 1, { z0: 1, z1: 1.04 }, DIAL[0], DIAL[1]); return [p[0], p[1], 30 * p[2]]; }, lead: .5, dur: 1.6, pushA: .15, rim: '#ffe2b0' },
  };
  // ---------------------------------------------------------------- Q.14 · the square's clock tower, nobody under it (an ink ghost waiting is wiped)
  const camQ14 = (t, s) => camK(t, [[s.a - .6, aim(5200, 960, 430, 1.9)], [s.w('waiting') + .3, aim(5200, 960, 520, 2.05), 's'], [s.b + .8, aim(5200, 960, 600, 2.2)]], .2);   // ≤ 2.2: the camera stays clear of the 3000 side-building card (culled at dz<30 → pop)
  const Q14 = {
    id: 'Q.14',
    draw(ctx, t, s) {
      const tn = s.w('nobody'), c = camQ14(t, s);
      PL.square(ctx, t, c, look(R, t), { people: 0, dry: true, shut: true, benches: true, friends: 1, lit: 0 });
      const tw = s.w('waiting'), ga = span(t, s.a + .6, s.a + 1.3) * (1 - span(t, tw + .5, tw + 1.3));   // somebody used to wait for you under the clock
      if (ga > 0) K.card(ctx, c, 5200, () => { ctx.save(); ctx.globalAlpha *= ga * .8; B.inkFig(ctx, t, 1036, 700, 110, { pose: 'stand', dir: -1, look: .5 }); ctx.restore(); });
    },
    out: { k: 'portal', win: (t, s) => { const c = camQ14(t, s), a = project(c, 5200, 920, 552), b = project(c, 5200, 1000, 700); return [a[0], a[1], b[0] - a[0], b[1] - a[1]]; }, lead: .75, dur: 2.3 },
  };
  return [Q01, Q02, Q03, Q06, Q10, Q11, Q12, Q14];
}
