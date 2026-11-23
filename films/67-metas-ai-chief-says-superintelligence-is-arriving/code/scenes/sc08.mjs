// c08 · B3 · SCENARIO: the town hall · 'Not like a coup' → 'But look at what the mathematicians'
// Out of plateHandover (HANDOVER over your town hall) the camera flies INTO the hall through its middle window (the window's room grows
// until it fills the frame); inside: folding chairs, paper cups, you in the third row; the plan of a new, unusually slender bridge draws
// itself on the wall and its own gold card CORRECT grows out of its corner (never a stamp); pages pour onto the table (the paper tower
// again), the engineers leaf, look at each other, shrug; ★ wide from behind: arm after arm goes up, last the yellow sleeve; then out the
// same window: HANDOVER again over the hall, a thousand small yeses light the town's windows outward from the hall (YOUR LOAN · YOUR
// CONTRACT · YOUR TOWN'S BUDGET), and on 'a little less yours' they cool from warm to machine-cool.
// One take with c09–c11 (lib/b3_extra.mjs stitches the keys); this file: camera keys + the frame for [coup, look).
//
// | ID   | anchor                         | picture (one idea)                                                       | camera                    |
// |------|--------------------------------|--------------------------------------------------------------------------|---------------------------|
// | 7.01 | Not like a coup                | plateHandover → HANDOVER sinks, fly into the hall's window; SCENARIO     | push through window · SCENE |
// | 7.02 | The old bridge                 | the plan draws itself; CORRECT grows out of the plan's corner (gold card) | room push to the plan · MIX |
// | 7.03 | The reasoning runs longer      | pages pour onto the table, the tower; engineers leaf, shrug; you look up | room pan to table · MIX   |
// | 7.04★| But the system has never       | wide from behind: arm after arm, the yellow sleeve last                  | room pull-back · SCENE    |
// | 7.05 | That is a handover             | out the window, HANDOVER again; yeses light the town; warm → cool        | pull out + wide · EXPL    |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f67_kit.mjs';
import * as S from '../lib/f67_world.mjs';
import * as B from '../lib/b3_extra.mjs';
const { W, H, P, clamp, lerp, span, sineIO, smooth } = E;
const { GY, WC, WIN, S_IN } = B;

export default async (T, R) => [{ t: R.a, draw: await B.b3(T), print: F.PRINT67 }];

const inside = (A) => [A.townhall + .45, A.handover + .45];   // the land camera sits in the window (the room fills the frame)
export const part = {
  keys: (A) => {
    const [i0, i1] = inside(A), sIn = S_IN * 1.04, k0 = A.coup + .9;
    return [
      [k0, ...B.plateUVS(k0, A)], [A.ordinary + 1.1, WC.u + 12, WC.v - 14, 7.5], [i0, WC.u, WC.v, sIn], [i1, WC.u, WC.v, sIn],
      [A.robots + .7, WC.u + 40, WC.v - 50, 5.2], [A.thousand + .2, S.HALL.x + 40, GY - 175, 1.75], [A.less + 2.0, S.HALL.x - 260, GY - 200, 1.08],
    ];
  },
  draw: frame,
};

// the room camera (room design px; 1 = the room exactly fills the frame)
const roomKeys = (A) => {
  const [i0, i1] = inside(A);
  return [[i0, 960, 540, 1], [A.oldBridge + 1.4, 960, 450, 1.18], [A.sys + .6, 960, 360, 1.48], [A.correct1 + 1.0, 990, 370, 1.56],
    [A.reasoning + 1.3, 1330, 560, 1.34], [A.neither + .2, 1120, 650, 1.14], [A.never + .3, 1080, 640, 1.1], [A.hands - .1, 960, 600, .9],
    [A.yours + 1.0, 930, 615, .93], [i1 - .1, 960, 540, 1]];
};
export function roomState(t, A) {
  return {
    plan: span(t, A.sys - .1, A.sys + 2.4), card: span(t, A.correct1 - .25, A.correct1 + .5), tower: span(t, A.reasoning - .1, A.reasoning + 1.9),
    pour: span(t, A.reasoning + .1, A.reasoning + .7) * (1 - span(t, A.neither, A.neither + 1.2)),
    eng: { leaf: span(t, A.reasoning + 1.0, A.engineers), shrug: Math.sin(Math.PI * span(t, A.engineers + .2, A.engineers + 1.7)) },
    youLook: lerp(.2, .85, span(t, A.neither - .1, A.neither + .8)), hands: span(t, A.hands - .1, A.hands + 1.5), yours: span(t, A.yours - .1, A.yours + .6),
  };
}
export const scenarioLabel = (ctx, u) => { if (u > 0) F.goldText(ctx, [[F.SOURCES.scenario, .35]], 70, 74, 24, F.rise(u), { serif: false, weight: 700, spacing: .1 }); };

function frame(ctx, t, A, c) {
  const T = A.T;
  if (t < A.coup + S.SEAM_HALF) { S.plateHandover(ctx, t, T); return; }
  const [, , s] = A.uvs(t), rc = B.pathRoom(t, roomKeys(A)), st = roomState(t, A), [i0, i1] = inside(A);
  const roomA = clamp((t - (A.coup + S.SEAM_HALF)) / .4);
  const p0 = S.landPt(c, WIN.x, WIN.y), p1 = S.landPt(c, WIN.x + WIN.w, WIN.y + WIN.h);
  const covered = p0 && p1 && p0[0] <= 0 && p0[1] <= 0 && p1[0] >= W && p1[1] >= H;
  const drawRoom = (cx) => { cx.save(); cx.beginPath(); cx.rect(WIN.x, WIN.y, WIN.w, WIN.h); cx.clip(); cx.globalAlpha *= roomA; B.roomToLand(cx); B.roomCam(cx, t > i0 - .2 && t < i1 + .2 ? rc : { x: 960, y: 540, z: 1 }); B.room(cx, t, st); cx.restore(); B.hallWindowFrame(cx, 1 - span(s, 5, 12)); };
  if (covered) { E.card(ctx, c, S.Z_LAND, () => drawRoom(ctx)); }
  else {
    const hoU = 1 - span(t, A.coup + .9, A.coup + 2.0) + span(t, A.handover + 1.3, A.handover + 2.3) - span(t, A.thousand + .1, A.thousand + 1.1);
    const yesU = span(t, A.thousand - .2, A.thousand + 2.6), cool = span(t, A.less, A.less + 1.9);
    S.landWorld(ctx, c, t, { head: { dim: .85 }, hall: 1, windows: .3, you: false,
      land: (cx) => {
        B.yesWindows(cx, t, yesU, cool);
        drawRoom(cx);
        if (hoU > 0) F.goldText(cx, [['HANDOVER', 1]], S.HALL.x + 60, GY - 330, 74, clamp(hoU), { serif: true, align: 'center', glow: true });
      } });
    // three of the thousand yeses, named on the words (screen space, ≥ 22 px)
    const win = B.townWindows().slice().sort((a, b) => a.d - b.d);
    const picks = [[A.loan, 'YOUR LOAN', win.find((w) => w.x < WC.u - 300 && w.y < GY - 80), -60, -80], [A.contract, 'YOUR CONTRACT', win.find((w) => w.x > WC.u + 260), 50, -110], [A.budget, "YOUR TOWN'S BUDGET", win.find((w) => w.x < WC.u - 700 && w.y < GY - 60), -40, -150]];
    for (const [ta, l1, w, dx, dy] of picks) {
      if (!w) continue; const u = span(t, ta - .1, ta + .7) * (1 - span(t, A.less + .9, A.less + 1.8)); if (u <= 0) continue;
      const p = S.landPt(c, w.x + w.w / 2, w.y); if (p) F.goldLabel(ctx, p[0], p[1], l1, 'YES', u, { dx, dy, size: 26 });
    }
  }
  scenarioLabel(ctx, span(t, A.ordinary + .3, A.ordinary + 1.3));
  F.checklist(ctx, t, T);
}
