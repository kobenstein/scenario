// Film 78 · B2 · the pictures that cross MY inner chunk boundaries (c07→c08, c08→c09, c09→c10). Both neighbouring chunks draw the same
// function of t around the boundary, so the last frame of one chunk and the first frame of the next are one continuous take.
//   leitA2(T)   6.06 → 7.05: the Leitbild (anchor A2): the card has gone into the tower; the man stands at its foot, then walks toward us
//               (thumbnail C), MAY 14, 2024; the door closes softly. Returns { cam(t), man(t), draw(ctx, t, o) }.
//   doorSeam(T) 7.18 → 8.01: the lab door RESEARCH, the push toward the light under it; the light seam becomes the machine ring.
//   hallSeam(T) 8.22 → 9.01: the open hall, sound reaches you in the back row → the graduates in Toronto.
import * as E from './f10_editorial.mjs';
import * as F from './f78_kit.mjs';
import * as S from './f78_world.mjs';
import * as B from './b2_kit.mjs';
const { W, H, P, clamp, lerp, span, sineIO, expoOut, expoIn, rgba, halo } = E;
const { GOLD, CREAM, mv, land, rise } = F;

// ------------------------------------------------------------------------------------------------ A2 (Leitbild, thumbnail C)
export function leitA2(T) {
  const G = (p, n = 0, a = -1) => T.G(p, n, a);
  const tPic = G('Picture an AI'), ts = tPic + 1.3;                       // the fly through the university window ends here (c07)
  const tByThen = G('By then, he had already'), T1 = G('Six months after that famous Friday');
  const tWalked = G('he walked away from OpenAI', 0, T1), tOwn = G('By his own decision'), tDoor = G('No slammed door');
  const tLeaving = G('He was leaving, he wrote'), tWeeks = G('Weeks later, the project');
  // the camera (Leitbild design space; the ring cascade of c07 hangs in the sky above, y ≈ −520)
  const K = [
    [ts, { x: 1000, y: -520, s: 1 }], [tByThen - .1, { x: 1000, y: -505, s: 1.02 }],
    [tByThen + 2.75, { x: 1085, y: 610, s: 1 }], [T1 + 6.4, { x: 1050, y: 640, s: 1.05 }],
    [tDoor + 1.4, { x: 1290, y: 700, s: 1.32 }], [tWeeks - .4, { x: 1250, y: 680, s: 1.22 }],
  ];
  const cam = (t) => S.drift2(S.camPath2(t, K), t, .7, 31);
  // the man: stands at the tower's foot (frontal, looking up into the light), walks toward us from "walked away"
  const w0 = tWalked - .2, w1 = tDoor + 2.4;
  const man = (t) => {
    const p = span(t, w0, w1), d = Math.max(0, t - w1), v = .7 * 1.35 / (w1 - w0);   // after w1 he walks on past the camera (same speed)
    const z = Math.max(.05, lerp(1, .3, p * p * .35 + p * .65) - v * d - .03 * d * d), k = 1 / z - 1;
    return { z, x: 1292 - k * 150, y: S.GY + k * 125, h: 230 / z, walk: t > w0 ? (t - w0) * 5.6 : undefined, look: lerp(.55, .05, span(t, w0 - .4, w0 + .6)) };
  };
  const draw = (ctx, t, o = {}) => {
    const c = o.cam ?? cam(t); S.view(ctx, c);
    const doorU = mv(t, tDoor - .05, 1.5);
    const g = S.leitbild(ctx, t, {
      tower: { glow: 1, name: o.name ?? land(t, T1 + 1.8, .9), cells: 1, block: [1, 6, 3, 7] },
      man: false,
      extra: (cx, gg) => {   // the tower door: open (warm) → closes slowly and softly; the light stays on
        const dw = 46, dh = 74, dx = gg.x - dw / 2, dy = S.GY - dh;
        cx.fillStyle = GOLD.hot; cx.fillRect(dx, dy, dw, dh); halo(cx, gg.x, S.GY - dh * .4, 120, .45 * (1 - .6 * doorU), GOLD.halo, GOLD.core);
        const pw = dw * sineIO(doorU); cx.fillStyle = E.mixHex(GOLD.deep, P.night1, .35); cx.fillRect(dx, dy, pw, dh);
        cx.fillStyle = rgba(GOLD.line, .7); cx.fillRect(dx + pw - 1, dy, 2, dh);
        if (doorU > .95) { cx.fillStyle = rgba(GOLD.core, .9); cx.fillRect(dx, S.GY - 3, dw, 3); }
      },
    });
    const m = man(t);
    if (m.z > .07) {
      if (t < w0) { halo(ctx, m.x, m.y - m.h * .6, m.h * .9, .16, GOLD.halo, GOLD.hot); F.ilya(ctx, t, m.x, m.y, m.h, { dir: 1, look: m.look, shadow: 120, lightX: 1420, armR: [.12, .05] }); }
      else B.manToward(ctx, t, m.x, m.y, m.h, { walk: m.walk });
    }
    // the date tag (his own decision): MAY 14, 2024, pinned left of the tower name
    const du = rise(span(t, T1 + .9, T1 + 1.7)) * (1 - span(t, tWeeks - .6, tWeeks));
    if (du > 0) { ctx.setTransform(1, 0, 0, 1, 0, 0); F.dateTag(ctx, 110, 150, F.SOURCES.left, du, { size: 26 }); F.goldText(ctx, [['HE LEFT OPENAI', .15]], 110, 218, 40, du, { serif: false, weight: 700, spacing: .08, col: CREAM }); }
    return { g, c, m };
  };
  return { cam, man, draw, ts, K, tByThen, T1, tWalked, tOwn, tDoor, tLeaving, tWeeks };
}

// ------------------------------------------------------------------------------------------------ the SSI world (c08 → c09), Leitbild space
// the small building left of the tower (7.05), its lab door (7.14), the record view (7.16/7.17) the door push starts from (7.18)
export const SSI = { x: 250, w: 800, h: 420 };
export const SSI_DOOR = (() => { const x0 = SSI.x - SSI.w / 2, w = SSI.w * .2, h = SSI.h * .52; return { x: x0 + SSI.w * .68 + w / 2, base: S.GY, w, h }; })();
export const SEAM = { x: SSI_DOOR.x, y: S.GY - 2.5 };
export const REC_VIEW = { x: -890, y: 566, s: .84 };
export function drawSSI(ctx, t, o = {}) {
  return B.ssiBuilding(ctx, t, SSI.x, S.GY, SSI.w, SSI.h, { rise: o.rise ?? 1, lit: o.lit ?? 1, sign: o.sign ?? 1, cut: o.cut ?? 0, inside: o.inside,
    doorDraw: (cx, d) => B.labDoor(cx, t, d.x + d.w / 2, S.GY, d.w, d.h, { wall: false, plate: o.plate ?? 1, frost: o.frost ?? 1, glow: o.glow ?? 1 }) });
}
// doorSeam(T) 7.18 → 8.01: from REC_VIEW (the camera rests there at tSo) a fly to the light under the lab door; the seam sits at screen
// centre, magnified, at 'He wants more than a machine that obeys' (c09 takes it from there: the seam lifts and bends into the ring).
export function doorSeam(T) {
  const tSo = T.G('So what is he trying to build'), tB = T.G('He wants more than a machine that obeys');
  const S1 = 7.5, t1 = tB + .9;
  const p0 = S.toScreen(REC_VIEW, SEAM.x, SEAM.y);
  const cam = (t) => {
    const e = sineIO(span(t, tSo, t1)), s = Math.exp(lerp(Math.log(REC_VIEW.s), Math.log(S1), e)) * (1 + .06 * Math.max(0, t - t1));
    const sx = lerp(p0[0], W / 2, e), sy = lerp(p0[1], H / 2, e);
    return S.drift2(B.camAt(SEAM.x, SEAM.y, sx, sy, s), t, .7 * (1 - e) + .25, 31);
  };
  const glow = () => 1;
  // the boundary picture: the stage, the ground, the building with its lab door (everything else of c08 is off-screen by then)
  const draw = (ctx, t, o = {}) => {
    const c = o.cam ?? cam(t); S.stage(ctx, t, c, { dawn: .12 }); S.view(ctx, c);
    S.leitbild(ctx, t, { tower: false, man: false });
    drawSSI(ctx, t, { glow: o.glow ?? glow(t) });
    return c;
  };
  return { cam, draw, glow, tSo, tB, t1 };
}

// ------------------------------------------------------------------------------------------------ hallSeam (c09 → c10), Leitbild space far right
// 8.22 → 9.01: an open hall seen from behind the audience (rows of heads), the dome, the lectern far off; sound rings travel out and
// reach you (yellow) in the back row. c10 puts the graduates' caps on (o.caps) and stays in this hall for 9.01.
export const HALL = { x: 7000, floor: -330, dome: 900, R: { x: 6200, y: -280, w: 1600, h: 440 }, you: [3, 4], dawn: .3 };
export function hallSeam(T) {
  const tPub = T.G('In public, where you can hear it'), tSo = T.G('So what do you do', 1);
  const K = [[tPub - .3, { x: HALL.x, y: -430, s: 1.2 }], [tPub + 2.3, { x: HALL.x, y: -60, s: .9 }], [tSo + 2.6, { x: HALL.x + 20, y: -40, s: .96 }]];
  const cam = (t) => S.drift2(S.camPath2(t, K), t, .7, 31);
  const rowsU = (t) => mv(t, tPub - .1, 1.9);
  // the sound rings out of the lectern: one every .8 s from tPub, each expanding to the back row in 1.6 s; returns how lit you are
  const sound = (ctx, t, mic) => {
    let reach = 0;
    for (let k = 0; k < 12; k++) {
      const t0 = tPub + .2 + k * .8, p = span(t, t0, t0 + 1.7); if (t < t0) break; if (p >= 1) { reach = 1; continue; }
      const r = lerp(40, 900, sineIO(p) * .6 + p * .4);
      ctx.strokeStyle = rgba(CREAM, .55 * (1 - p) + .1); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(mic[0], mic[1], r, r * .62, 0, .15, Math.PI - .15); ctx.stroke();
      if (p > .8) reach = Math.max(reach, span(p, .8, 1));
    }
    return reach;
  };
  const draw = (ctx, t, o = {}) => {
    const c = o.cam ?? cam(t); S.stage(ctx, t, c, { dawn: HALL.dawn }); S.view(ctx, c);
    // the floor of the hall: a warm pool round the lectern
    const fu = clamp(o.lectern ?? 1);   // the hall opens: floor light, floor line and the spotlight come with the lectern
    if (fu > 0) { halo(ctx, HALL.x, HALL.floor, 520, .22 * fu, GOLD.halo, GOLD.hot); F.goldSpan(ctx, [[HALL.x - 900, HALL.floor + 4], [HALL.x + 900, HALL.floor + 4]], .5 - .5 * fu, .5 + .5 * fu, { w: 1.2, spark: false, a: .45 }); }
    if ((o.dome ?? 1) > 0) B.hallDome(ctx, t, HALL.x, HALL.floor, HALL.dome, o.dome ?? 1);
    const L = fu > 0 ? F.lectern(ctx, t, HALL.x, HALL.floor, 120, { spot: fu, rings: .6 * fu, rise: fu }) : null;
    const lit = Math.max(o.youLit ?? 0, sound(ctx, t, L?.mic ?? [HALL.x, HALL.floor - 90]));
    const ru = rowsU(t);
    let you = null;
    if (ru > 0) { ctx.save(); ctx.translate(0, (1 - ru) * 520); you = B.audience(ctx, t, HALL.R, { rows: 4, cols: 9, scale: 1.2, caps: o.caps ?? 0, you: HALL.you, youLit: .35 + .65 * lit }).find((q) => q.you); ctx.restore(); }
    return { c, lit, you };
  };
  return { cam, draw, K, tPub, tSo };
}
