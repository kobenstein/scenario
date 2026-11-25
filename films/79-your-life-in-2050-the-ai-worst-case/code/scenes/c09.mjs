// Film 79 · c09 THE BENCH (E.01–E.08, vo-v2) · builder B3.
// PLAN (docs/BRIEF-builders.md §5 gate 1)
//   beats  E.01 the bench at night from behind: the grandson walks in and sits down beside you, the clock in his hands → E.02 push to the clock:
//          the pale-ink rings it never rang are wiped → E.03 ink stories rise out of the clock (THE JOB · THE CROWDED SQUARE · THE PEOPLE WHO
//          WAITED) → E.04 close behind the pair: he looks up at you ("Why didn't anyone stop it?") → E.05 three empty frames on the words
//          (A RUIN · A VILLAIN · THE DAY) → E.06 they stay empty and fold to lines → E.07 the lines become a path: three gifts along it open on the
//          words (THE SAFER CAR · THE PATIENT SCREEN · THE FRIEND WHO STAYS), footsteps → E.08 THE WOW: from the end of the path into the night; the
//          camera pulls far back from the pair: rows of dark roofs, the tower huge with its band, one warm window at home; on "needed" that last lamp
//          goes out in 2 frames (light-out 3 of 3), the band stays, a long hold.
//   carriers  in: c08 pushes through the dark arch under the square's clock (portal) · clock face → iris → stories · clock → iris → bench close ·
//          lamp post sweep → frames · path's end → iris → the night (E.08) · out: the cold lamp head → iris → c10's 2050 disc (W.01).
//   wow    E.08 (scale: the pair tiny, the tower huge; light: the last human window goes out; tempo: the only hard accent of the chunk).
import * as K from '../lib/f79_kit.mjs';
import * as S from '../lib/f79_street.mjs';
import * as B from '../lib/f79_b3.mjs';
import { hourAt } from './hud.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, cam3, aim, camK, project, CARM, AMBER } = K;
const look = (R, t) => K.hourLook(hourAt(R, t));
const TH = 600, CLK = [993, 815];   // the tower on the bench's far card; the clock in his hands (2000 card, design coords)

export default function c09(T, R) {
  const r = (id) => R[id];
  // ---------------------------------------------------------------- E.01–E.02 · the bench: he sits down beside you; the clock that never rang
  const camE1 = (t, s) => camK(t, [[s.a - .8, cam3({ z: -260, y: -40, x: 40 })], [r('E.02') - .3, cam3({ z: -120, y: -20, x: 20 })], [s.b + .3, aim(2000, CLK[0], CLK[1] - 10, 2.6, W * .5, H * .52), 's']], .6);
  const E01 = {
    id: 'E.01',
    draw(ctx, t, s) {
      const c = camE1(t, s), bi = K.sineIO(span(t, s.a - .2, s.w('beside') + .5)), t2 = r('E.02'), tr = s.w('ring');
      const out = B.bench2(ctx, t, c, look(R, t), { clock: 1, towerH: TH, boyIn: bi, home: 1, boyLook: lerp(-.1, -.35, span(t, s.w('beside'), s.w('beside') + 1)) - .2 * span(t, t2, t2 + 1),
        focus2: (g, tt, o) => {   // the rings it never rang: pale ink around the bells, wiped off
          const ga = span(tt, t2 + .2, t2 + .7) * (1 - span(tt, tr + .2, tr + .9)); if (ga <= 0 || !o.clock) return;
          const [cx, cy] = o.clock; g.save(); g.globalAlpha *= ga * .85; K.ink(g, B.PALE, 2.4);
          for (const sx of [-1, 1]) for (let k = 0; k < 3; k++) { g.beginPath(); g.arc(cx + sx * 15, cy - 26, 16 + k * 11, sx < 0 ? 3.5 : 4.9, sx < 0 ? 4.5 : 5.9); g.stroke(); }
          const wp = span(tt, tr + .2, tr + .9); if (wp > 0) { g.globalAlpha = 1; g.strokeStyle = rgba(B.PALE, .7 * (1 - wp)); g.lineWidth = 3; g.beginPath(); g.moveTo(cx - 60 + 120 * wp, cy - 80); g.lineTo(cx - 60 + 120 * wp, cy + 10); g.stroke(); }
          g.restore(); } });
    },
    out: { k: 'iris', c: (t, s) => { const p = project(camE1(t, s), 2000, CLK[0], CLK[1]); return [p[0], p[1], 24 * p[2]]; }, lead: .5, dur: 1.5, pushA: .5, rim: '#ffe2b0' },
  };
  // ---------------------------------------------------------------- E.03 · ink stories rise out of the clock
  const CL3 = [960, 760];
  const E03 = {
    id: 'E.03',
    draw(ctx, t, s) {
      const tj = s.w('job'), tc = s.w('crowded'), tw = s.w('waited');
      B.expl(ctx, t, s.a - .5, s.b + 1, (c) => {
        K.halo(c, CL3[0], CL3[1], 260, .22); S.alarmClock(c, t, CL3[0], CL3[1], 1.45, { rot: .04 * Math.sin(t * .7) });
        const stories = [[480, 360, tj, 'THE JOB'], [960, 300, tc, 'THE CROWDED SQUARE'], [1440, 360, tw, 'THE PEOPLE WHO WAITED']];
        stories.forEach(([x, y, t0, lab], i) => {
          const u = span(t, t0 - .45, t0 + .5); if (u <= 0) return;
          // the trail of ink out of the clock's bells
          c.save(); c.strokeStyle = rgba(B.PALE, .45); c.lineWidth = 2.5; c.setLineDash([4, 9]);
          const p0 = [CL3[0] + (i - 1) * 50, CL3[1] - 150], cp = [lerp(p0[0], x, .2), lerp(p0[1], y, .6) + 40];
          const pts = []; for (let k = 0; k <= 30; k++) { const q = k / 30; pts.push([(1 - q) * (1 - q) * p0[0] + 2 * (1 - q) * q * cp[0] + q * q * x, (1 - q) * (1 - q) * p0[1] + 2 * (1 - q) * q * cp[1] + q * q * (y + 130)]); }
          K.strokeIn(c, pts, K.expoOut(u)); c.setLineDash([]); c.restore();
          const v = span(u, .35, 1), bob = 6 * Math.sin(t * .9 + i * 2); if (v <= 0) return;
          c.save(); c.globalAlpha *= v; c.translate(x, y + bob + (1 - K.expoOut(v)) * 60);
          c.fillStyle = K.rad(c, 0, 0, 230, [[0, rgba('#8a9ad8', .12)], [1, rgba('#8a9ad8', 0)]]); c.fillRect(-230, -230, 460, 460);
          K.ink(c, B.PALE, 2.6);
          if (i === 0) { c.strokeRect(-110, 40, 220, 14); c.beginPath(); c.moveTo(-90, 54); c.lineTo(-90, 110); c.moveTo(90, 54); c.lineTo(90, 110); c.stroke();
            for (let k = 0; k < 4; k++) { c.beginPath(); c.moveTo(-80 + k * 30, -70); c.lineTo(-80 + k * 30, -40); c.stroke(); }
            B.inkFig(c, t, 30, 110, 150, { pose: 'hold', dir: -1, look: -.2 }); }
          if (i === 1) { c.strokeRect(-16, -110, 32, 100); c.beginPath(); c.arc(0, -82, 10, 0, 7); c.stroke();
            for (let k = 0; k < 9; k++) B.inkFig(c, t + k, -120 + k * 30, 110 - (k % 2) * 10, 70 + (k % 3) * 6, { pose: ['stand', 'point', 'reach'][k % 3], dir: k % 2 ? 1 : -1 }); }
          if (i === 2) { c.strokeRect(-130, -80, 90, 190); c.beginPath(); c.arc(-60, 20, 4, 0, 7); c.stroke();
            B.inkFig(c, t, 10, 110, 130, { pose: 'reach', dir: -1, look: .2 }); B.inkFig(c, t + 1, 70, 110, 120, { pose: 'stand', dir: -1 }); B.inkFig(c, t + 2, 120, 110, 76, { pose: 'stand', dir: -1, look: .4 }); }
          c.restore();
          K.maskLine(c, [[lab, 0]], x, y + 175, 24, K.rise(span(t, t0, t0 + .6)), { serif: false, weight: 600, col: P.cream, glow: false, align: 'center' });
        });
      }, { z0: 1.0, z1: 1.05, cy0: 540, cy1: 520 });
    },
    out: { k: 'iris', c: (t, s) => { const p = B.explAt(t, s.a - .5, s.b + 1, { z0: 1, z1: 1.05, cy0: 540, cy1: 520 }, CL3[0], CL3[1]); return [p[0], p[1], 34 * p[2]]; }, lead: .5, dur: 1.6, pushA: .4, rim: '#ffe2b0' },
  };
  // ---------------------------------------------------------------- E.04 · close behind the pair: he looks up at you
  const camE4 = (t, s) => camK(t, [[s.a - .6, aim(2000, 1000, 640, 1.75, W * .5, H * .55)], [s.b + .6, aim(2000, 980, 620, 1.85, W * .5, H * .55)]], .5);
  const E04 = {
    id: 'E.04',
    draw(ctx, t, s) {
      const up = K.sineIO(span(t, s.w('Why') + .1, s.w('stop') + .2));
      B.bench2(ctx, t, camE4(t, s), look(R, t), { clock: 1, towerH: TH, home: 1, boyLook: lerp(-.3, .55, up), youLook: lerp(.25, .05, span(t, s.w('stop'), s.b)), lean: .2 * up });
    },
    out: { k: 'sweep', kind: 'post', dir: 1, w: 110, col: '#0a0e2a', lead: .5, dur: 1.3 },
  };
  // ---------------------------------------------------------------- E.05–E.07 · three empty frames, they fold, the path of gifts
  const FR = [[300, 230], [800, 230], [1300, 230]], FW = 320, FHt = 380, VP = [960, 380];
  const oE5 = (s) => ({ z0: 1.0, z1: 1.12, cy0: 540, cy1: 470 });
  const E05 = {
    id: 'E.05',
    draw(ctx, t, s) {
      const tR = s.w('ruin'), tV = s.w('villain'), tD = s.w('day'), t6 = r('E.06'), t7 = r('E.07'), fold = span(t, s.w("isn't") - .05, s.w("isn't") + .6);
      const join = K.sineIO(span(t, t7 - .3, t7 + .9));
      B.expl(ctx, t, s.a - .5, s.b + 1, (c) => {
        // you, looking for something to point at (small, amber: the only warm thing)
        const ya = 1 - span(t, t7 - .2, t7 + .4);
        if (ya > 0) { c.save(); c.globalAlpha *= ya; K.you(c, t, 150, 830, 170, { pose: 'point', dir: 1, look: .2 + .15 * Math.sin(t * .8) }); c.restore(); }
        [[tR, 'A RUIN'], [tV, 'A VILLAIN'], [tD, 'THE DAY']].forEach(([t0, lab], i) => {
          const u = span(t, t0 - .25, t0 + .45), [x, y] = FR[i];
          const sl = span(t, s.w('look') + i * .15, s.w('point') + i * .15) * (1 - u) * (1 - fold);   // where something should be: a dashed slot
          if (sl > 0) { c.save(); c.globalAlpha *= sl * .55; c.strokeStyle = B.PALE; c.lineWidth = 3; c.setLineDash([10, 12]); c.lineDashOffset = -t * 12; c.strokeRect(x, y, FW, FHt); c.restore(); }
          if (join <= 0) B.emptyFrame(c, t, x, y, FW, FHt, u, fold);
          const la = span(t, t0, t0 + .5) * (1 - span(fold, 0, .5)); if (la > 0) K.maskLine(c, [[lab, 0]], x + FW / 2, y + FHt + 60, 26, K.rise(la), { serif: false, weight: 600, col: P.cream, glow: false, align: 'center' });
          if (fold > .9 && join < 1) { c.save(); c.strokeStyle = mixHex('#e8dcc0', '#8a7a60', .25); c.lineWidth = 6; c.lineCap = 'round';   // the folded frames: three lines → one path
            const yy = y + FHt / 2, x0 = lerp(x, lerp(700, 960 - 6, i / 2), join), x1 = lerp(x + FW, lerp(960 + 6, 1220, i / 2), join);
            c.beginPath(); c.moveTo(x0, yy + (H * .78 - yy) * join); c.lineTo(x1, yy + (H * .78 - yy) * join); c.stroke(); c.restore(); }
        });
        // E.07: the path into the distance, footsteps, three gifts on the words
        const pa = span(t, t7 + .3, t7 + 1.2); if (pa <= 0) return;
        c.save(); c.globalAlpha *= pa; c.strokeStyle = mixHex('#e8dcc0', '#8a7a60', .25); c.lineWidth = 6; c.lineCap = 'round';
        c.lineWidth = 5; c.strokeStyle = K.lin(c, 0, H * .78, 0, VP[1], [[0, mixHex('#e8dcc0', '#8a7a60', .25)], [1, rgba('#e8dcc0', 0)]]);
        c.beginPath(); c.moveTo(700, H * .78); c.lineTo(VP[0] - 26, VP[1]); c.moveTo(1220, H * .78); c.lineTo(VP[0] + 26, VP[1]); c.stroke();
        c.fillStyle = K.lin(c, 0, H * .78, 0, VP[1], [[0, rgba(P.cream, .07)], [1, rgba(P.cream, 0)]]); c.beginPath(); c.moveTo(700, H * .78); c.lineTo(VP[0] - 26, VP[1]); c.lineTo(VP[0] + 26, VP[1]); c.lineTo(1220, H * .78); c.fill(); c.restore();
        const steps = span(t, t7 + .5, s.b); for (let k = 0; k < 14; k++) { const q = k / 14; if (q > steps) break; const d = 1 - q * .85, x = 960 + (k % 2 ? 30 : -30) * d, y = lerp(H * .76, VP[1] + 20, 1 - Math.pow(1 - q, 1.6));
          c.fillStyle = rgba(AMBER.body, .5 * d); c.beginPath(); c.ellipse(x, y, 11 * d, 18 * d, 0, 0, 7); c.fill(); }
        const gifts = [[s.w('safer'), 600, 780, 1.0, 'THE SAFER CAR', 0], [s.w('patient'), 1270, 650, .78, 'THE PATIENT SCREEN', 1], [s.w('friend'), 800, 530, .6, 'THE FRIEND WHO STAYS', 2]];
        for (const [t0, x, y, sc, lab, kind] of gifts) {
          const u = span(t, t0 - .45, t0 + .2), op = span(t, t0 + .05, t0 + .75);
          B.gift(c, t, x, y, sc, u, op, (g, o) => { g.translate(0, -120 - 40 * o);
            if (kind === 0) K.pod(g, 0, 20, .5, K.hourLook(19), { dir: 1, t });
            if (kind === 1) { g.fillStyle = '#0a0e2a'; g.fillRect(-56, -40, 112, 70); g.fillStyle = K.lin(g, -50, -36, 50, 26, [[0, '#ffd6e4'], [1, CARM.hot]]); g.fillRect(-50, -34, 100, 58); K.carmGlow(g, 0, -5, 120, .25); }
            if (kind === 2) K.ring(g, t, 0, -10, 34, 1); });
          const la = span(t, t0, t0 + .6); if (la > 0) K.maskLine(c, [[lab, 0]], x + (kind === 1 ? 100 : -100) * sc, y - 40 * sc, 24 / Math.max(.85, sc), K.rise(la), { serif: false, weight: 600, col: P.cream, glow: false, align: kind === 1 ? 'left' : 'right' });
        }
      }, oE5(s));
    },
    out: { k: 'iris', c: (t, s) => { const p = B.explAt(t, s.a - .5, s.b + 1, oE5(s), VP[0], VP[1]); return [p[0], p[1], 26]; }, lead: .5, dur: 1.6, pushA: .7, rim: '#dfe6ff' },
  };
  // ---------------------------------------------------------------- E.08 · THE WOW: the night, the pair tiny, the tower huge, the last lamp at home goes out
  const camE8 = (t, s) => camK(t, [[s.a - .7, cam3({ z: 420, y: 60, x: 30 })], [s.w('destroyed') + .9, cam3({ z: -2300, y: -200, x: -80 }), 's'], [s.b + 1, cam3({ z: -4000, y: -310, x: -420 })]], 1.4);
  const E08 = {
    id: 'E.08',
    draw(ctx, t, s) {
      const tn = s.w('needed') + .25, home = t < tn - .3 ? 1 : t < tn - .23 ? .78 : t < tn ? 1 : 1 - span(t, tn, tn + .066);   // a tiny dip (anticipation), then out in 2 frames
      B.bench2(ctx, t, camE8(t, s), look(R, t), { clock: 1, towerH: TH, home, fore: false, lean: .5, youLook: .3, boyLook: -.5 });
    },
    out: { k: 'iris', c: (t, s) => { const p = project(camE8(t, s), 3600, 1034, 262.8); return [p[0], p[1], 16 * p[2]]; }, lead: .55, dur: 1.6, pushA: .6, rim: '#dfe6ff' },
  };
  return [E01, E03, E04, E05, E08];
}
