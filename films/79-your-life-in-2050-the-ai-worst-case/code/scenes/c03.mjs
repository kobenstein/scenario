// Film 79 · c03 THE DATA CENTRE, THE ECONOMIST, THE LADDER (D.01–D.17 + C2, vo-v2) · builder B1
// PLAN (docs/BRIEF-builders.md §5 gate 1)
//  beats (one picture per sentence):
//   D.01 SZENE  iris out of the plot (c02's map): across the road the windowless DATA CENTRE; the cars with crates turn in at its loading door
//   D.02 EXPL   a lamp post sweeps the lens: the night ground, your street front as a pale-ink elevation; the plot is EMPTY (dashed),
//               a calendar leaf NOVEMBER 1
//   D.03 SZENE  the dashed plot grows into the frame (the same rect in both pictures): the street again, the gantry prints the walls in
//               layers, DAY 1 … DAY 9 ticks
//   D.04 SZENE  DAY 10: finished, the gantry lifts away; nobody arrives, only cars glide in
//   D.05 MIX    the camera rises close along the smooth facade: the carmine seam, the fans, the cooling vapour
//   D.06 EXPL   the night opens out of the seam (seamWipe): the building in section, dark racks; a pale-ink window is drawn on the wall and struck
//   D.07 EXPL   STAFF 0 over the section
//   D.08 EXPL   a paper card unfolds out of the 0: BACK IN THE TWENTIES · A STANFORD ECONOMIST, a crack runs through an ink wall
//   D.09 MIX    on the card: a ladder draws itself, its bottom rung glows
//   C2  CLIP    the plate lies under the card; the card folds away at 31.08 in the file (the interviewer is covered), the plate plays
//               (Brynjolfsson, Revelio Labs, 2026); at the end the card unfolds over it again
//   D.10 EXPL   the card: ECONOMIST · STANFORD / CO-FOUNDER OF AN AI FIRM (the interest, said on screen)
//   D.11 EXPL   the card folds into a box: HIS FIRM sends carmine AI lines into five company boxes
//   D.12 EXPL   jobs in the most AI-exposed occupations by age (schematic, sourced): the older lines steady, no wave
//   D.13 EXPL * the young line (22–25) bends down, ABOUT 19 % BELOW TREND; the ladder beside it: the bottom rung drops out (the wow)
//   D.14 EXPL   the ladder stands over the data centre: every rung gone, only the rails
//   D.15 EXPL   DRIVE · BUILD · RUN: a carmine ring lands on each
//   D.16 MIX    iris out of the last ring: the street from the data centre's side, your house across; NOT NEEDED 3 · THE BUILDING SITE
//   D.17 MIX    the day clock runs to 10:00; your kitchen window, the one warm light, the camera glides to it (portal → c04 K.01)
//  wow: D.13 (the rung drops, the biggest scale push of the chunk, held ≥ 0.8 s). Accents: the strike on the window (D.06), the rung.
//  HUD: 9:30 AM at D.01, 10:00 AM at D.17; NOT NEEDED 3 · THE BUILDING SITE at D.16; hidden during C2 (hud.mjs).
// Facts (faktencheck-imac.md §2, clips.json C2): Stanford Digital Economy Lab, "Canaries in the Coal Mine", Aug 2026, ADP data: ages 22–25
// in highly AI-exposed jobs about 19 % below where they would be (a RELATIVE gap; descriptive, not causal); no economy-wide displacement.
// Brynjolfsson co-founded Workhelix (an AI consultancy): named on screen as the interest.
import * as K from '../lib/f79_kit.mjs';
import * as S from '../lib/f79_street.mjs';
import * as B from '../lib/f79_b1.mjs';
import { hourAt } from './hud.mjs';
import { CLIPS, CLIP_RECT, clipPlate } from './clips.mjs';
import { INK } from './c01.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, cam3, aim, camK, project, CARM, AMBER } = K;
const look = (R, t) => K.hourLook(hourAt(R, t));
const DC = { x: 1600, base: 800, w: 600, h: 620 };   // S.street's data centre across the road (card 2600)
const DOOR = [DC.x + DC.w * .35, DC.base - DC.h * .26, DC.w * .3, DC.h * .26];
// a car with crates turning in at the loading door (card 2600): u 0..1 along its path; clipped so it disappears into the door
function podIn(ctx, t, L, u) {
  if (u <= 0 || u >= 1) return; const e = K.sineIO(u), x = lerp(500, DOOR[0] + DOOR[2] / 2, e), y = lerp(1060, DC.base, Math.pow(e, 1.6)), s = lerp(1.1, .55, e);
  ctx.save(); ctx.beginPath(); ctx.rect(-3000, DC.base, 8000, 2000); ctx.rect(DOOR[0], DOOR[1], DOOR[2], DOOR[3] + 2); ctx.clip();
  K.pod(ctx, x, y, s, L, { dir: 1, crates: true, t }); ctx.restore();
}
const PLOT = [660, 242, 600, 620];   // the plot rect on screen in D.02 = the data centre's rect at the start of D.03 (camD3 at its first key)
export default function c03(T, R) {
  // ---------------------------------------------------------------- D.01 · across the road: the data centre, the cars turn in
  const camD1 = (t, s) => camK(t, [[s.a - .8, aim(2600, 1900, 640, .9, W / 2, H * .5)], [s.b + .8, aim(2600, 1820, 600, 1.02, W * .5, H * .52)]], .3);
  const D01 = {
    id: 'D.01',
    draw(ctx, t, s) {
      const L = look(R, t), c = camD1(t, s);
      S.street(ctx, t, c, L, { dc: 1, hedges: 1, lit: .2, near: (g) => { for (let i = 0; i < 4; i++) podIn(g, t, L, (t - s.a + 1.6 - i * 1.05) / 2.6); } });
    },
    out: { k: 'sweep', kind: 'post', dir: -1, w: 200, col: '#0b0f2e', lead: .6, dur: 1.6 },
  };
  // ---------------------------------------------------------------- D.02 · the elevation: the plot on the 1st was empty
  const D02 = {
    id: 'D.02',
    draw(ctx, t, s) {
      const u = span(t, s.a - .5, s.a + 1.2);
      K.dusk(ctx, t, { glow: [960, 560] });
      K.scr(ctx, (c) => {
        const [px, py, pw, ph] = PLOT, gy = py + ph, kp = 1 - .012 * Math.max(0, s.b - .5 - t);   // a slow push into the plot that is still moving when the plot rect opens
        c.translate(px + pw / 2, py + ph / 2); c.scale(kp, kp); c.translate(-px - pw / 2, -py - ph / 2);
        c.strokeStyle = rgba(B.PALE, .7); c.lineWidth = 3; K.strokeIn(c, [[60, gy], [W - 60, gy]], K.expoOut(span(u, 0, .5)));
        // the houses either side (pale-ink elevation)
        K.ink(c, rgba(B.PALE, .6), 2.5);
        for (const [x, w, h] of [[120, 220, 260], [360, 240, 300], [1320, 240, 280], [1580, 220, 250]]) { const a = span(u, .2, .6); c.globalAlpha = a;
          c.strokeRect(x, gy - h, w, h); c.beginPath(); c.moveTo(x - 10, gy - h); c.lineTo(x + w / 2, gy - h - w * .35); c.lineTo(x + w + 10, gy - h); c.stroke();
          for (const [wx, wy] of [[.18, .2], [.6, .2], [.18, .58]]) c.strokeRect(x + w * wx, gy - h + h * wy, w * .22, h * .2); c.strokeRect(x + w * .62, gy - h * .36, w * .2, h * .36); }
        c.globalAlpha = 1;
        // the plot: dashed, a few tufts of grass
        const pu = span(u, .35, .8); c.strokeStyle = rgba(B.PALE, .9 * pu); c.lineWidth = 3; c.setLineDash([12, 10]); c.strokeRect(px, py, pw, ph); c.setLineDash([]);
        c.strokeStyle = rgba(B.PALE, .6 * pu); c.lineWidth = 2; for (let i = 0; i < 9; i++) { const x = px + 40 + i * 64 + 10 * Math.sin(i * 3.1); for (const d of [-8, 0, 8]) { c.beginPath(); c.moveTo(x, gy); c.quadraticCurveTo(x + d * .4, gy - 14, x + d + Math.sin(t * .8 + i) * 2, gy - 26); c.stroke(); } }
        B.T(c, 'THE PLOT ACROSS THE ROAD', px + pw / 2, py + ph / 2 - 10, { align: 'center', size: 24, col: B.TXT.sub, a: pu });
        B.T(c, 'EMPTY', px + pw / 2, py + ph / 2 + 34, { align: 'center', size: 30, a: span(u, .5, .9), spacing: .3 });
        // the calendar leaf: NOVEMBER 1
        const lu = K.expoOut(span(t, s.a + .2, s.a + 1.1));
        if (lu > 0) { c.save(); c.translate(1500, 200 - 120 * (1 - lu)); c.rotate(.05 * Math.sin(t * .6) - .04); c.globalAlpha = lu;
          K.paper(c, t, -150, -100, 300, 200, 1, { head: 'NOVEMBER 2050', headCol: K.PAPER.red, lines: ['1'], lineSize: 84 }); c.restore(); }
      });
    },
    out: { k: 'fn', fn: B.rectGrow(PLOT), lead: .5, dur: 1.4 },
  };
  // ---------------------------------------------------------------- D.03–D.05 · the street: printed in nine days, nobody moves in, the facade
  const camD3 = (t, s) => { const t4 = s.r('D.04'), t5 = s.r('D.05');
    return camK(t, [[s.a - .5, aim(2600, 1900, 500, 1.0, W * .5, H * .52)], [t4 + .3, aim(2600, 1880, 540, 1.12, W * .5, H * .52)],
      [t5 + .6, aim(2600, 1820, 290, 1.62, W * .5, H * .5)], [s.b + .6, aim(2600, 2000, 280, 1.7, W * .5, H * .5)]], .3); };
  const D03 = {
    id: 'D.03',
    draw(ctx, t, s) {
      const L = look(R, t), c = camD3(t, s), t4 = s.r('D.04'), tq = Math.floor((t - 1 / 30) * 10 + 1e-6) / 10 + 1 / 30, pr = span(tq, s.a + .1, t4 - .35), u = .03 + .97 * pr;   // the layers step on frames between the grain frames (10 Hz), never on them
      S.street(ctx, t, c, L, { dc: u >= .995 ? 1 : u, hedges: 1, lit: .2, near: (g) => {
        if (u >= .995) { B.gantryAway(g, t, DC.x, DC.base, DC.w, DC.h, L, span(t, t4 - .1, t4 + 1.1)); for (let i = 0; i < 3; i++) podIn(g, t, L, (t - t4 - .6 - i * 1.0) / 2.6); } } });
      // DAY 1 … DAY 9, then DAY 10
      const dv = span(t, s.a + .1, t4) * 9, dd = Math.min(9, Math.floor(dv)), roll = dd >= 9 ? 0 : K.sineIO(span(dv - dd, .72, 1)), du = K.cardU(t, s.a + .1, s.r('D.05') + .1), p = project(c, 2600, DC.x - 40, DC.base - DC.h);
      if (du > 0 && p) { K.caps(ctx, 'DAY', p[0] - 20, p[1] + 10, du, { size: 26, align: 'right' });
        K.scr(ctx, (g) => { g.save(); g.beginPath(); g.rect(p[0] - 20 - 160, p[1] + 20, 170, 130); g.clip(); for (const [n, oy] of [[1 + dd, -130 * roll], [2 + dd, 130 - 130 * roll]]) if (n <= 10) K.glowText(g, String(n), p[0] - 20, p[1] + 120 + oy, { size: 110, serif: true, align: 'right', col: n === 10 ? '#ffd6de' : P.cream, a: du, glow: false }); g.restore(); }); }   // the days roll
      const nu = K.cardU(t, t4 + .5, s.r('D.05') - .1); if (nu > 0) K.caps(ctx, 'MOVED IN: NOBODY', W * .5, 900 - 40, nu, { size: 24, align: 'center', col: '#dfe6ff' });
    },
    out: { k: 'fn', fn: (ctx, u, dA, dB, t) => { const c = camD3(t, { r: (id) => R[id], a: R['D.03'], b: R['D.06'] }), p = project(c, 2600, 0, DC.base - DC.h * .9); B.seamWipe(p ? p[1] : 300)(ctx, u, dA, dB); }, lead: .45, dur: 1.4 },
  };
  // ---------------------------------------------------------------- D.06–D.07 · the section: nobody inside to look out · STAFF 0
  const D06 = {
    id: 'D.06',
    draw(ctx, t, s) {
      const tl = s.w('look'), t7 = s.r('D.07'), tz = s.w('zero');
      B.dcSection(ctx, t, { u: span(t, s.a - .6, s.a + 1.2), win: span(t, s.a + .3, tl - .1), strike: span(t, tl + .05, t7 + .2), zero: span(t, tz - .25, tz + .5), k: 1 + .03 * (t - R['D.06']) });
    },
    out: null,
  };
  // ---------------------------------------------------------------- D.08–D.11 · the card, the clip, the economist's interest, his firm
  const CARD = [300, 112, 1320, 760], C0 = [1060, 470];   // the card covers the clip plate exactly (+ a margin): the interviewer is hidden under it
  const D08 = {
    id: 'D.08',
    draw(ctx, t, s) {
      const t9 = s.r('D.09'), cl = T.clip('C2'), t10 = s.r('D.10'), t11 = s.r('D.11'), tc = s.w('crack');
      // under everything after the cut-in: the night section of D.07 fades into a plain night ground behind the card
      const sf = 1 - K.sineIO(span(t, s.a + 1.2, s.a + 2.4));   // the section dissolves into the ground behind the card, well before the clip
      if (sf < 1) K.dusk(ctx, t, { glow: [960, 520] });
      B.fadeLayer(ctx, sf, (g) => B.dcSection(g, t, { u: 1, win: 0, zero: 1 - span(t, s.a + .5, s.a + 1.2), k: 1 + .03 * (t - R['D.06']) }));
      // the clip plate (under the card from shortly before the clip until the card has folded away)
      const plate = t > cl.start - .5 && t < cl.end + 1.2;
      if (plate) clipPlate(ctx, t, T, 'C2', [CLIP_RECT.x, CLIP_RECT.y, CLIP_RECT.w, CLIP_RECT.h], 1);
      // the card: open out of the 0 (D.08), folds away into its corner 0.75 s into the clip, opens again over the plate at the end, folds into HIS FIRM
      const corner = [CARD[0] + 40, CARD[1] + CARD[3] - 40], firm = [520, 520];
      const u1 = B.cardS(t, s.a, cl.start + 1.3, 1.1, .6), u2 = B.cardS(t, cl.end - .25, t11 + .2), u = Math.max(u1, u2), from = t < s.a + 1 ? C0 : t < cl.end ? corner : t < t11 - .5 ? corner : firm;
      if (u > 0) K.scr(ctx, (c) => K.paper(c, t, CARD[0], CARD[1], CARD[2], CARD[3], u, { from, head: 'BACK IN THE TWENTIES', src: t > cl.end ? 'HIS INTEREST, NAMED: CO-FOUNDER OF WORKHELIX' : null, draw: (g, x, y, w, h) => {
        if (t < cl.start + 1) {
          g.fillStyle = K.PAPER.ink; g.font = '64px "Instrument Serif"'; g.fillText('A Stanford economist', x + 10, y + 80);
          g.font = '600 24px Inter'; g.letterSpacing = '0.14em'; g.fillStyle = K.PAPER.ink2; g.fillText('THE FIRST CRACK', x + 14, y + 130); g.letterSpacing = '0em';
          // an ink wall with a crack running down (D.08), the ladder beside it (D.09)
          const wx = x + w * .08, wy = y + h * .32, ww = w * .5, wh = h * .6; K.ink(g, K.PAPER.ink2, 2);
          for (let r = 0; r < 6; r++) for (let k = 0; k < 6; k++) g.strokeRect(wx + k * ww / 6 + (r % 2) * ww / 12, wy + r * wh / 6, ww / 6, wh / 6);
          K.ink(g, K.PAPER.ink, 4); K.strokeIn(g, [[wx + ww * .55, wy - 4], [wx + ww * .5, wy + wh * .2], [wx + ww * .58, wy + wh * .38], [wx + ww * .46, wy + wh * .62], [wx + ww * .52, wy + wh * .82], [wx + ww * .44, wy + wh]], K.sineIO(span(t, tc - .1, tc + 1.2)));
          const lu = span(t, t9 - .1, t9 + 1.0), lx = x + w * .8, ly0 = y + h * .14, ly1 = y + h * .98;
          if (lu > 0) { g.save(); g.globalAlpha = lu; B.ladderGfx(g, t, lx, lerp(ly1, ly0, K.expoOut(lu)), ly1, 120, 6, { col: K.PAPER.ink, lw: 6, glow: { 0: span(t, t9 + .7, t9 + 1.3) * (.75 + .25 * Math.sin(t * 3)) } }); g.restore();
            const ga = span(t, t9 + .7, t9 + 1.3); if (ga > 0) { g.fillStyle = rgba(AMBER.body, .3 * ga); g.beginPath(); g.ellipse(lx, ly1 - (ly1 - ly0) / 7, 110, 30, 0, 0, 7); g.fill(); g.fillStyle = K.PAPER.ink2; g.font = '600 22px Inter'; g.textAlign = 'center'; g.globalAlpha = ga; g.fillText('THE FIRST RUNG', lx, ly1 + 2); g.textAlign = 'left'; g.globalAlpha = 1; } }
        } else {
          const a = span(t, t10 - .2, t10 + .5); g.globalAlpha = a; g.fillStyle = K.PAPER.ink; g.font = '84px "Instrument Serif"'; g.fillText('Erik Brynjolfsson', x + 10, y + 120);
          g.font = '600 30px Inter'; g.letterSpacing = '0.14em'; g.fillStyle = K.PAPER.ink2; g.fillText('ECONOMIST · STANFORD', x + 14, y + 200);
          const b = span(t, t10 + 1.2, t10 + 1.8); g.globalAlpha = b; g.fillStyle = K.PAPER.red; g.fillText('CO-FOUNDER OF AN AI FIRM', x + 14, y + 260); g.letterSpacing = '0em'; g.globalAlpha = 1;
          // the economist as an ink figure, cheering the machines on (arm up)
          K.figureRaw(g, x + w * .78, y + h * .96, h * .62, { dir: -1, pose: 'reach', armR: [2.4 + .1 * Math.sin(t * 2.2), 2.55], look: .5 }, INK, false);
        }
      } }));
      // D.11: HIS FIRM sends carmine AI lines into five company boxes
      const fu = span(t, t11 - .1, t11 + .4), fo = K.expoIn(span(t, s.b - .5, s.b + .1));
      if (fu > 0) K.scr(ctx, (c) => {
        c.globalAlpha = 1 - fo; const [fx, fy] = firm, k = K.expoOut(fu);
        c.fillStyle = rgba(B.REST, .9); c.beginPath(); c.roundRect(fx - 110 * k, fy - 80 * k, 220 * k, 160 * k, 10); c.fill();
        B.T(c, 'HIS FIRM', fx, fy + 10, { align: 'center', size: 26, a: fu });
        for (let i = 0; i < 5; i++) { const cx = 1400, cy = 260 + i * 130, a = span(t, t11 + .5 + i * .12, t11 + .9 + i * .12); if (a <= 0) continue;
          c.globalAlpha = a * (1 - fo); c.strokeStyle = rgba('#dfe6ff', .55); c.lineWidth = 2.5; c.strokeRect(cx - 100, cy - 44, 200, 88); B.T(c, 'COMPANY', cx, cy + 8, { align: 'center', size: 22, col: B.TXT.sub, a: a * (1 - fo) });
          const lu = span(t, t11 + .9 + i * .15, t11 + 1.8 + i * .15); if (lu > 0) { c.strokeStyle = CARM.hot; c.lineWidth = 3; c.setLineDash([14, 10]); c.lineDashOffset = -t * 40; K.strokeIn(c, [[fx + 110, fy], [lerp(fx + 110, cx - 100, .5), lerp(fy, cy, .2)], [cx - 104, cy]], K.sineIO(lu)); c.setLineDash([]); } }
        c.globalAlpha = 1 - fo; B.T(c, 'HELPS COMPANIES PUT AI TO WORK', fx, fy + 140, { align: 'center', size: 24, col: '#ffd6de', a: span(t, t11 + 1.2, t11 + 1.8) * (1 - fo) });
      });
    },
    out: { k: 'iris', c: [1400, 520, 60], lead: .5, dur: 1.6, pushA: .15, rim: '#dfe6ff' },
  };
  // ---------------------------------------------------------------- D.12–D.14 · the chart by age, the rung drops (wow), the whole ladder gone
  const CH = { x0: 220, x1: 1100, y0: 300, y1: 720 }, LAD = { x: 1440, y0: 240, y1: 790, w: 170, n: 6 };
  const xs = (u) => lerp(CH.x0, CH.x1, u), ys = (v) => lerp(CH.y1, CH.y0, v);   // v: index 0.6 … 1.3
  const older = [[.02, .8, 1], [.05, .74, 2], [-.02, .7, 3], [.03, .66, 4]];   // schematic: steady lines (slope, level)
  const D12 = {
    id: 'D.12',
    draw(ctx, t, s) {
      const t13 = s.r('D.13'), t14 = s.r('D.14'), tm = s.w('missing'), wow = K.sineIO(span(t, t13 - .2, tm + .6)) * (1 - K.sineIO(span(t, t14 - .2, s.b - .2))), out = K.quartIO(span(t, t14 - .3, t14 + .9));
      K.dusk(ctx, t, { glow: [lerp(700, 1400, wow), 520] });
      K.scr(ctx, (c) => {
        // the wow: a slow push toward the ladder while the young line bends (the biggest scale move of the chunk)
        const pe = span(t, s.b - 2.5, s.b), z2 = 1 - .075 * pe * (1 - pe); c.translate(960, 520); c.scale(z2, z2); c.translate(-960, -520);   // breathes into D.15's creep (same pivot, same speed at the switch)
        const z = 1 + .12 * wow; c.translate(LAD.x, 520); c.scale(z, z); c.translate(-LAD.x, -520);
        const cu = span(t, s.a - .4, s.a + 1.4);
        c.save(); c.globalAlpha = 1 - out; c.translate(-500 * out, 0);
        B.T(c, 'JOBS IN THE MOST AI-EXPOSED OCCUPATIONS · BY AGE', CH.x0, 236, { size: 26, spacing: .14, a: span(cu, 0, .3) });
        B.T(c, 'U.S. · LATE 2022 TO MID 2026 · SCHEMATIC', CH.x0, 272, { size: 22, col: B.TXT.sub, a: span(cu, .1, .4) });
        c.fillStyle = rgba(P.cream, .45); c.fillRect(CH.x0, CH.y1, (CH.x1 - CH.x0) * K.expoOut(span(cu, 0, .4)), 2);
        B.T(c, 'LATE 2022', CH.x0, CH.y1 + 40, { size: 22, col: B.TXT.sub, a: span(cu, .2, .5) }); B.T(c, 'MID 2026', CH.x1, CH.y1 + 40, { size: 22, col: B.TXT.sub, align: 'right', a: span(cu, .2, .5) });
        const N = 40;
        older.forEach(([sl, lv, i]) => { const du = span(t, s.a + .2 + i * .15, s.a + 1.4 + i * .15); if (du <= 0) return; c.strokeStyle = B.REST; c.lineWidth = 3; c.lineCap = 'round';
          K.strokeIn(c, Array.from({ length: N + 1 }, (_, k) => [xs(k / N), ys(lv - .15 + sl * k / N + .006 * Math.sin(k * 1.7 + i))]), du); });
        const od = span(t, s.w('older') - .1, s.w('older') + .5); if (od > 0) B.T(c, 'OLDER WORKERS · DOING FINE', CH.x1, ys(.86) - 14, { size: 22, col: B.TXT.text, align: 'right', a: od });
        // the young line: on the trend at first, then it bends down (D.13); the trend stays as a dashed ghost: the gap
        const bend = K.sineIO(span(t, t13 + .2, tm + .2)), yu = span(t, s.a + .9, s.a + 2.2);
        const yv = (k) => .48 + .02 * Math.sin(k * 2.3) * 0 - (k / N > .25 ? bend * .19 * Math.pow((k / N - .25) / .75, 1.2) * 1.55 : 0);
        if (bend > 0) { c.strokeStyle = rgba(AMBER.body, .45); c.lineWidth = 2; c.setLineDash([8, 8]); K.strokeIn(c, Array.from({ length: N + 1 }, (_, k) => [xs(k / N), ys(.48)]), 1); c.setLineDash([]); }
        c.strokeStyle = AMBER.body; c.lineWidth = 5; K.strokeIn(c, Array.from({ length: N + 1 }, (_, k) => [xs(k / N), ys(yv(k))]), yu);
        if (yu > .3) B.T(c, 'AGES 22–25', xs(.02), ys(.48) - 20, { size: 24, col: AMBER.core, a: span(yu, .3, .8) });
        const gu = span(t, tm - .3, tm + .4); if (gu > 0) { const ye = ys(yv(N)); c.strokeStyle = rgba(P.cream, .7 * gu); c.lineWidth = 2; c.beginPath(); c.moveTo(CH.x1 + 14, ys(.48)); c.lineTo(CH.x1 + 14, ye); c.stroke();
          B.T(c, 'ABOUT 19 %', CH.x1 + 30, (ys(.48) + ye) / 2 - 4, { size: 30, a: gu }); B.T(c, 'BELOW TREND', CH.x1 + 30, (ys(.48) + ye) / 2 + 28, { size: 22, col: B.TXT.sub, a: gu }); }
        c.restore();
        // the ladder: draws in beside the chart; the bottom rung drops on "missing"; D.14: the whole ladder bare over the data centre
        const lu = span(t, s.a + .4, s.a + 1.6), drop = span(t, tm, tm + .9), gone = span(t, t14 + .3, t14 + 1.6);
        const dcu = K.expoOut(span(t, t14 - .1, t14 + 1.0)), ladX = lerp(LAD.x, 960, out);
        if (dcu > 0) { c.fillStyle = '#080c2a'; const dh = 380 * dcu; c.fillRect(ladX - 380, 820 - dh, 760, dh); c.strokeStyle = rgba(B.PALE, .5); c.lineWidth = 2; c.strokeRect(ladX - 380, 820 - dh, 760, dh); K.lightBand(c, t, ladX - 380, 820 - dh + 40, ladX + 380, 820 - dh + 40, 5, dcu);
          B.T(c, 'THE DATA CENTER ACROSS THE ROAD', ladX, 860 - 10, { align: 'center', size: 22, col: B.TXT.sub, a: span(t, t14 + .6, t14 + 1.2) * (1 - span(t, s.b - .7, s.b - .15)) }); }
        if (lu > 0) { c.save(); c.globalAlpha = lu; B.ladderGfx(c, t, ladX, lerp(LAD.y1, LAD.y0, K.expoOut(lu)), LAD.y1 - 0 * out, LAD.w, LAD.n, { lw: 8, drop: { 0: drop, ...Object.fromEntries([1, 2, 3, 4, 5].map((i) => [i, gone > 0 ? K.expoIn(span(gone, (i - 1) * .12, (i - 1) * .12 + .5)) * 0 : 0])) }, gone: K.sineIO(gone), ghost: true, glow: { 0: span(t, s.a + 1, t13) * (1 - drop) } }); c.restore(); }
        const ru = K.cardU(t, tm - .2, t14 - .2); if (ru > 0) B.T(c, 'THE FIRST RUNG', LAD.x + LAD.w / 2 + 24, LAD.y1 - (LAD.y1 - LAD.y0) / (LAD.n + 1) + 8, { size: 24, col: AMBER.core, a: ru });
      });
      // the source stays out of the push (always readable, never cropped)
      K.scr(ctx, (c) => { const cu = span(t, s.a - .4, s.a + 1.4); c.translate(-500 * out, 0);
        B.T(c, 'STANFORD DIGITAL ECONOMY LAB · "CANARIES IN THE COAL MINE" · AUG 2026 · ADP PAYROLL DATA · DESCRIPTIVE, NOT CAUSAL', CH.x0, 860, { size: 22, col: B.TXT.faint, spacing: .06, a: span(cu, .5, 1) * (1 - out) }); });
    },
    out: null,
  };
  // ---------------------------------------------------------------- D.15 · DRIVE · BUILD · RUN, each taken by a carmine ring
  const MARK = [['DRIVE', 560], ['BUILD', 960], ['RUN', 1360]];
  const D15 = {
    id: 'D.15',
    draw(ctx, t, s) {
      const gm = K.sineIO(span(t, s.a, s.a + 2.5)); K.dusk(ctx, t, { glow: [lerp(700, 960, gm), lerp(520, 500, gm)] });   // the glow continues from D.14
      const lad = 1 - K.expoIn(span(t, s.a - .1, s.a + .6));
      K.scr(ctx, (c) => {
        const kz = 1 + .03 * Math.max(0, t - s.a); c.translate(960, 520); c.scale(kz, kz); c.translate(-960, -520);   // a slow creep
        // the bare rails of D.14 sink into the ground as the three marks rise
        if (lad > 0) { c.save(); c.globalAlpha = lad; c.translate(0, 400 * (1 - lad)); c.fillStyle = '#080c2a'; c.fillRect(580, 440, 760, 380); c.strokeStyle = rgba(B.PALE, .5); c.lineWidth = 2; c.strokeRect(580, 440, 760, 380); K.lightBand(c, t, 580, 480, 1340, 480, 5, 1); B.ladderGfx(c, t, 960, LAD.y0, LAD.y1, LAD.w, LAD.n, { lw: 8, gone: 1, ghost: true }); c.restore(); }
        MARK.forEach(([w, x], i) => {
          const tw = s.w(w.toLowerCase()), a = span(t, s.a + i * .12, s.a + .6 + i * .12), d = span(t, tw - .35, tw + .2);
          if (a <= 0) return;
          c.globalAlpha = a; c.fillStyle = mixHex(AMBER.body, CARM.hot, span(d, .6, 1)); c.beginPath(); c.arc(x, 470, 16, 0, 7); c.fill(); c.globalAlpha = 1;
          B.T(c, w, x, 600, { align: 'center', size: 44, spacing: .22, a });
          if (d > 0) { const yy = lerp(150, 470, K.expoIn(d)), sq = 1 - .22 * K.bump(t, tw + .15, .5); c.save(); c.translate(x, yy); c.scale(1 / sq, sq); K.ring(c, t, 0, 0, 56, span(d, 0, .3)); c.restore(); }
        });
        B.T(c, 'THEMSELVES', 960, 700, { align: 'center', size: 26, col: B.TXT.sub, a: span(t, s.w('themselves') - .1, s.w('themselves') + .5) });
      });
    },
    out: { k: 'iris', c: [1360, 470, 56], lead: .5, dur: 1.8, pushA: .15, rim: '#ffd6de' },
  };
  // ---------------------------------------------------------------- D.16–D.17 · from the data centre's side: your house, the kitchen window, 10:00
  const KW = [-229, 696, 112, 94];   // your kitchen window (bottom left of your house on card 2600)
  const camD16 = (t, s) => camK(t, [[s.a - .7, aim(2600, -40, 640, .92, W * .5, H * .55)], [s.r('D.17'), aim(2600, -110, 680, 1.0, W * .5, H * .55)], [s.b + .3, aim(2600, KW[0] + KW[2] / 2, KW[1] + KW[3] / 2, 1.9, W * .5, H * .5), 'q']], .3);
  const D16 = {
    id: 'D.16',
    draw(ctx, t, s) {
      const L = look(R, t), c = camD16(t, s);
      S.street(ctx, t, c, L, { dc: 1, hedges: 1, lit: .15, near: (g) => {
        const [x, y, w, h] = KW; g.fillStyle = K.lin(g, 0, y, 0, y + h, [[0, '#fff2c4'], [1, '#f2b25e']]); g.fillRect(x, y, w, h);
        g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = K.rad(g, x + w / 2, y + h / 2, 160, [[0, rgba('#ffcf8a', .3)], [1, rgba('#ffb35c', 0)]]); g.fillRect(x - 160, y - 160, w + 320, h + 320); g.restore();
        g.fillStyle = rgba(L.ink, .5); g.fillRect(x + w / 2 - 2, y, 4, h); g.fillRect(x, y + h / 2 - 2, w, 4); } });
      const tq = K.cardU(t, s.w('left') - .2, s.r('D.17') + .3); if (tq > 0) K.words(ctx, '?', W * .5 + 300, 470, 150, tq, { serif: true, glow: false });
    },
    out: { k: 'fn', fn: B.maskGrow((t) => { const c = camD16(t, { r: (id) => R[id], a: R['D.16'], b: R['K.01'] }), a = project(c, 2600, KW[0], KW[1]), b = project(c, 2600, KW[0] + KW[2], KW[1] + KW[3]); return [a[0], a[1], b[0] - a[0], b[1] - a[1]]; }), lead: .6, dur: 1.6 },
  };
  return [D01, D02, D03, D06, D08, D12, D15, D16];
}
