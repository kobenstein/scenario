// c09 · B3 · back to today · 'But look at what the mathematicians' → 'The labs could'
// SCENARIO sinks; the camera glides out of the town along the land to the referee by the gold ribbon; the rule book opens on a stand,
// a student, a pensioner and an engineer run the same check on their own laptops (LEAN · OPEN …); ★ a gold cone of light wanders from
// the file on the board over to the referee (THE ANSWER → THE CHECK); split under a veil: left the town hall plan with its own CORRECT
// (ITS OWN REFEREE), right people building the referee's chair before the game (REFEREE BUILT FIRST); the left pane grows to fill the
// frame: back in the town hall, an empty referee's chair rises beside the plan: WHO BUILDS THE REFEREES? (c10 shrinks the pane away).
//
// | ID   | anchor                          | picture (one idea)                                                   | camera                 |
// |------|---------------------------------|----------------------------------------------------------------------|------------------------|
// | 8.01 | But look at what                | SCENARIO sinks; glide from the town to the referee at the ribbon     | travel right · LAND    |
// | 8.02 | They did not take               | the rule book opens; three people re-run the check on their laptops  | creep · MIX            |
// | 8.03★| Their trust moved               | a gold cone of light wanders from the file to the referee            | pull back · EXPL       |
// | 8.04 | In your town hall               | split: ITS OWN REFEREE · REFEREE BUILT FIRST                         | creep (veil) · EXPL    |
// | 8.05 | So who builds the referees      | the left pane fills the frame: an empty referee's chair rises        | pane grows · SCENE     |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f67_kit.mjs';
import * as S from '../lib/f67_world.mjs';
import * as B from '../lib/b3_extra.mjs';
import { scenarioLabel } from './sc08.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, smooth, expoOut, expoIn, halo, lin } = E;
const { GOLD, CREAM, CREAM2, PAPER, COOL } = F;
const { GY } = B;

export default async (T, R) => [{ t: R.a, draw: await B.b3(T), print: F.PRINT67 }];

const SP = S.BOARD.spot, REF = [S.CHAIR.x - 6, GY - S.CHAIR.h - 40];
const PEOPLE = [{ x: 3700, h: 56, o: {} }, { x: 3850, h: 60, o: { long: true, lean: .07 } }, { x: 3990, h: 62, o: {} }];
export const part = {
  keys: (A) => [
    [A.look + 1.9, 1250, GY - 250, .62], [A.didNot + 1.0, 3520, GY - 200, 1.55], [A.anyone + .3, 3800, GY - 140, 2.2],
    [A.moved + .7, 3000, GY - 300, 1.02], [A.inTown + 1.0, 3020, GY - 300, 1.06], [A.who + 1.9, 3040, GY - 300, 1.1],
  ],
  draw: frame,
};

// the pane (screen rect) holding the town hall room: rises left at 'In your town hall', fills the frame at 'So who builds', c10 shrinks it away
export function paneRect(t, A) {
  const u = span(t, A.inTown - .1, A.inTown + .8), g = sineIO(span(t, A.who - .1, A.who + 1.8)), x = sineIO(span(t, A.labs + .1, A.labs + 1.9));
  if (u <= 0) return null;
  const r0 = { x: 110, y: 170, w: 830, h: 467 }, full = { x: 0, y: 0, w: W, h: H }, out = { x: -760, y: 640, w: 560, h: 315 };
  const lr = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), w: lerp(a.w, b.w, k), h: lerp(a.h, b.h, k) });
  const r = x > 0 ? lr(full, out, x) : lr(r0, full, g);
  return { ...r, u, g, ex: x };
}
export function pane(ctx, t, A) {
  const r = paneRect(t, A); if (!r || r.ex >= 1) return r;
  const k = expoOut(r.u), dy = (1 - k) * 70;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= clamp(r.u * 3);
  ctx.translate(0, dy);
  if (r.g < 1 || r.ex > 0) { ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(r.x + 8, r.y + 12, r.w, r.h); }
  ctx.save(); ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip();
  ctx.translate(r.x, r.y); ctx.scale(r.w / W, r.h / H);
  const g = r.g, rc = { x: lerp(960, 1130, g) + E.drift(t, 4, 3), y: lerp(420, 470, g) + E.drift(t, 3, 5), z: lerp(1.3, 1.12, g) * (1 + .01 * span(t, A.who, A.labs + 2)) };
  B.roomCam(ctx, rc);
  B.room(ctx, t, { plan: 1, card: 1, tower: 1, pour: 0, hands: 1, yours: 1, youLook: .85, eng: { leaf: 0, shrug: 0 }, chair: span(t, A.who + 1.0, A.who + 2.4) });
  ctx.restore();
  ctx.strokeStyle = rgba(GOLD.line, .55 * (1 - g)); ctx.lineWidth = 2; ctx.strokeRect(r.x, r.y, r.w, r.h);
  ctx.restore();
  return r;
}
// the right pane: people build the referee's chair before the game (night card, a small land scene)
function buildPane(ctx, t, A) {
  const u = span(t, A.inMath - .1, A.inMath + .8) * (1 - expoIn(span(t, A.who, A.who + 1.2))); if (u <= 0) return;
  const x0 = 980 + 900 * expoIn(span(t, A.who, A.who + 1.2)), y0 = 170, w = 830, h = 467, k = expoOut(u);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= clamp(u * 3); ctx.translate(x0, y0 + (1 - k) * 70);
  ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(8, 12, w, h);
  ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, mixHex(P.night0, P.ind1, .5)], [1, mixHex(P.night1, P.ind1, .4)]]); ctx.fillRect(0, 0, w, h);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
  E.stars(ctx, 9, 30, t, [0, 0, w, h * .5], .5);
  const gy = 380; ctx.fillStyle = mixHex(P.night1, P.ind1, .35); ctx.fillRect(0, gy, w, h - gy);
  const b = smooth(span(t, A.inMath + .3, A.inMath + 3.2)), cx = 400, ch = 200;   // the chair, assembled piece by piece
  ctx.strokeStyle = mixHex(P.night1, P.blue2, .7); ctx.lineWidth = 9; ctx.lineCap = 'round';
  const seg = (f, x1, y1, x2, y2) => { const q = clamp(b * 4 - f); if (q > 0) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(lerp(x1, x2, q), lerp(y1, y2, q)); ctx.stroke(); } };
  seg(0, cx - 50, gy, cx - 16, gy - ch); seg(1, cx + 50, gy, cx + 16, gy - ch); seg(2, cx - 36, gy - ch * .45, cx + 36, gy - ch * .45); seg(3, cx - 34, gy - ch - 4, cx + 34, gy - ch - 4);
  const reach = (i) => .6 + .25 * Math.sin(t * 2 + i * 1.7);
  E.person(ctx, cx - 120, gy, 120, { dir: 1, light: .8, armR: [1.7 + .3 * reach(0), 1.9], look: .3 });
  E.person(ctx, cx + 130, gy, 116, { dir: -1, light: .8, armR: [1.9 + .2 * reach(1), 2.1], look: .4, long: true });
  E.person(ctx, cx - 10, gy, 104, { dir: 1, light: .8, armR: [2.4, 2.6 + .2 * reach(2)], armL: [-1.4, -1.6], look: .9 });
  F.referee(ctx, t, 650, gy, 128, { dir: -1, look: .3 });
  ctx.restore();
  ctx.strokeStyle = rgba(GOLD.line, .55); ctx.lineWidth = 2; ctx.strokeRect(0, 0, w, h);
  ctx.restore();
}

function frame(ctx, t, A, c) {
  const T = A.T, r = paneRect(t, A), full = r && r.g >= 1 && r.ex <= 0;
  if (!full) {
    const cone = sineIO(span(t, A.away - .3, A.checkE + .3)), coneA = span(t, A.moved - .3, A.moved + .4) * (1 - span(t, A.inTown + .4, A.inTown + 1.4));
    const run = span(t, A.anyone - .1, A.anyone + 2.0);
    S.landWorld(ctx, c, t, { head: { dim: lerp(.85, .5, span(t, A.look, A.look + 3)) }, hall: 1, windows: .3, ribbon: { u: 1 }, tower: { u: 1, dark: .8 },
      chair: { referee: 1, card: span(t, A.trusted, A.trusted + 1.2) }, you: false,
      land: (cx) => {
        B.yesWindows(cx, t, 1, 1);
        F.file(cx, t, SP.x, SP.y, 40, { glow: lerp(1, .35, cone * coneA + span(t, A.inTown + .4, A.inTown + 1.4) * 0), seed: 5 });
        B.ruleBook(cx, t, 3770, GY, 92, span(t, A.open - .2, A.open + .9));
        for (const [i, p] of PEOPLE.entries()) {
          const hd = E.person(cx, p.x, GY, p.h, { dir: i === 1 ? -1 : 1, light: .8, look: .35, armR: [1.25, 1.95], ...p.o });
          if (hd?.R) B.laptop(cx, t, hd.R[0], hd.R[1] + 2, 14, clamp(run * 1.15 - i * .07));
        }
        if (coneA > 0) {   // ★ the cone of trust: from above, wandering from the answer (the file) to the check (the referee)
          const tx = lerp(SP.x, REF[0], cone), ty = lerp(SP.y + 40, REF[1] + 60, cone), ax = tx - 160, ay = GY - 1500, rw = 110;
          cx.save(); cx.globalCompositeOperation = 'lighter'; cx.globalAlpha *= coneA;
          cx.fillStyle = lin(cx, ax, ay, tx, ty, [[0, rgba(GOLD.halo, 0)], [.6, rgba(GOLD.halo, .12)], [1, rgba(GOLD.hot, .28)]]);
          cx.beginPath(); cx.moveTo(ax - 14, ay); cx.lineTo(ax + 14, ay); cx.lineTo(tx + rw, ty); cx.ellipse(tx, ty, rw, rw * .22, 0, 0, Math.PI); cx.lineTo(tx - rw, ty); cx.closePath(); cx.fill();
          cx.restore(); halo(cx, tx, ty - 40, 150, .5 * coneA, GOLD.halo, GOLD.core);
        }
        const la = span(t, A.away - .1, A.away + .6) * (1 - span(t, A.inTown - .3, A.inTown + .3)), lc = span(t, A.check - .1, A.check + .6) * (1 - span(t, A.inTown - .3, A.inTown + .3));
        if (la > 0) F.goldText(cx, [['THE ANSWER', 0]], SP.x, SP.y - 100, 30, F.rise(la), { serif: false, weight: 700, spacing: .08, align: 'center', col: CREAM });
        if (lc > 0) F.goldText(cx, [['THE CHECK', 1]], REF[0], GY - S.CHAIR.h - 130, 34, F.rise(lc), { serif: false, weight: 700, spacing: .08, align: 'center', glow: true });
      } });
    F.source(ctx, t, A.open, A.moved - .2, F.SOURCES.leanOpen);
    F.veil(ctx, .62 * sineIO(span(t, A.inTown - .3, A.inTown + .9)));
    buildPane(ctx, t, A);
  }
  const pr = pane(ctx, t, A);
  if (pr && pr.g < .6) {   // captions under the two panes
    const a1 = span(t, A.ownRef ?? A.inTown + 1.4, (A.ownRef ?? A.inTown + 1.4) + .7) * (1 - span(t, A.who - .2, A.who + .4));
    const a2 = span(t, A.inMath + .6, A.inMath + 1.3) * (1 - span(t, A.who - .2, A.who + .4));
    if (a1 > 0) F.goldText(ctx, [['ITS OWN REFEREE', 0]], 110 + 415, 700, 30, F.rise(a1), { serif: false, weight: 700, spacing: .08, align: 'center', col: CREAM });
    if (a2 > 0) F.goldText(ctx, [['REFEREE BUILT FIRST', 1]], 980 + 415, 700, 30, F.rise(a2), { serif: false, weight: 700, spacing: .08, align: 'center' });
  }
  const wq = span(t, A.who + .5, A.who + 1.3) * (1 - span(t, A.labs - .2, A.labs + .5));
  if (wq > 0) F.goldText(ctx, [['WHO BUILDS THE REFEREES?', 1]], W / 2, 140, 60, F.rise(wq), { serif: true, align: 'center', glow: true });
  scenarioLabel(ctx, 1 - span(t, A.look, A.look + .8));
  F.checklist(ctx, t, T);
}
