// c06 · Subscribe 1 + check 5 · out of plate56 (you hold THE FILE under the headline): the camera pulls back, you turn to us, windows
// light up round the whole land (subscribe, no QR) · the headline big: the smaller cream word PROOF lies over SUPERINTELLIGENCE, then the
// big word lights again (CHECK 5 OF 5) · down to the road: a milestone turns gold, Maynard walks past it at the same pace (quote) · LeCun
// steps out of the Meta lab (label) → C4 grows out of him and back · the road: chat windows roll out of the labs and pile at a wall, the
// sign SUPERINTELLIGENCE beyond it · ★ box 5 big, filling only halfway; the betting slip with Wang's headline · the gap is here: CORRECT |
// crack | UNDERSTOOD, you at its edge, box 4 pulses → plate67 (inner seam, lib/b2_extra.mjs).
// T.G('This channel exists') → T.G('And behind that headline') · builder B2 · plan: docs/shots.md M.01, 5.01–5.07 · ONE entry, one camera.
//
// | ID    | anchor (phrase)                  | picture (one idea)                                                    | carrier        | camera             |
// |-------|----------------------------------|-----------------------------------------------------------------------|----------------|--------------------|
// | M.01  | This channel exists              | you turn to us; windows light round the land, outward from you        | the windows    | pull back · LAND   |
// | 5.01  | But Wang's headline doesn't say  | PROOF falls over SUPERINTELLIGENCE, slides off; the big word relights  | the headline   | rise · EXPL        |
// | 5.02  | James Maynard                    | the milestone turns gold; Maynard walks past at one pace; quote        | the road       | descend · MIX      |
// | 5.03  | The sharpest doubt               | LeCun steps out of the Meta lab; YANN LECUN · LEFT META IN NOV 2025    | LeCun          | truck right · MIX  |
// | 5.04  | slot:C4                          | C4 grows out of LeCun and back                                       | LeCun          | hold               |
// | 5.05  | The kind of A.I.                 | chat windows roll out of the labs, pile at a wall; SUPERINTELLIGENCE    | the road       | glide right · EXPL |
// | 5.06★ | So the fifth box only fills      | box 5 big, filling only halfway; the betting slip                      | box 5          | creep (veil)       |
// | 5.07  | But the gap between correct      | CORRECT | crack | UNDERSTOOD, you at its edge; box 4 pulses           | the crack      | settle → plate67   |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f67_kit.mjs';
import * as S from '../lib/f67_world.mjs';
import * as B from '../lib/b2_extra.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, smooth, halo, prng } = E;
const { GOLD, CREAM, PAPER, LAMP, rise } = F;
const GY = S.GY;
export const PRINT = F.PRINT67;

export default async (T, R) => {
  E.prepareEditorial();
  const A = R.a, G = (p) => T.G(p, 0, A);
  const a = { a: A, end: R.b };
  a.want = G('Want that too'); a.subs = G('Then subscribe');
  a.but = G("But Wang's headline doesn't say"); a.proof = G('a proof is arriving'); a.says = G('It says superintelligence'); a.last = G('So the last check'); a.does = G('does one proof mean');
  a.maynard = G('James Maynard'); a.milestone = G('historic milestone'); a.little = G('But for him, little changes'); a.never = G('he never doubted');
  a.lecun = G('The sharpest doubt comes'); a.left = G('He left Meta'); a.neutral = G('No neutral witness'); a.tech = G('But his objection is technical'); a.clip = T.clip('C4');
  a.kind = G('The kind of A.I'); a.dead = G('is a dead end');
  a.fifth = G('So the fifth box only fills'); a.bet = G('Arriving is a bet'); a.stake = G('with a stake in it'); a.gapNo = G('But the gap between correct'); a.here = G('It is already here');
  return [{ t: A, draw: (ctx, t) => B.plate56(ctx, t, T), print: PRINT }, { t: A + S.SEAM_HALF, draw: scene(a, T), print: PRINT }];
};

const L = (u, v, s = 1) => S.landCam(u, v, s);
const HEADCAM = (s = 1.22, dx = 0) => E.aim(S.Z_HEAD, 960 + dx, 260, s);
const MAY = { x0: 3700, x1: 4300 }, LEC = { x0: 4560, x1: 4420 };
const BOX5 = { x: 720, y: 470, s: 340 }, SLIP = { x: 1060, y: 250, w: 560 };
const YOU6O = { armR: [.55, 1.5], look: .5 };
// small lights in windows all over the land (subscribe): seeded, cached
const LIGHTS = (() => { const r = prng(606), a = []; for (let i = 0; i < 260; i++) { const x = -2600 + r() * 11800; a.push([x, GY - 18 - r() * (x < 700 ? 200 : 70), r()]); } return a; })();

function scene(a, T) {
  const tPlate = a.end - S.SEAM_HALF, tCreep = tPlate - 2.4, t0 = a.a + S.SEAM_HALF, C4 = a.clip;
  const c56 = (t) => { const k = S.creep(t, T, 'This channel exists'); return B.CAM56(k, S.trk(k) * .3); };
  const creep67 = (t) => { const k = 1 + S.CREEP * (t - tPlate); return B.CAM67(k, S.trk(k) * .3); };
  const tA = t0 + .6;
  const K = [
    [tA, c56(tA)], [a.want, L(1250, 600, .82)], [a.but - .2, L(1200, 590, .8)],
    [a.but + 1.8, HEADCAM(1.18)], [a.last - .3, HEADCAM(1.21, 6)], [a.maynard + .3, L(2900, 560, .78)],
    [a.milestone - .1, L(3990, 690, 2.05)], [a.little, L(4060, 690, 2.1)], [a.lecun - .2, L(4140, 690, 2.08)],
    [a.left + .2, L(4440, 660, 2.0)], [a.tech + .2, L(4440, 650, 2.12)], [C4.end + .3, L(4450, 650, 2.16)],
    [a.kind + 2.2, L(5760, 620, 1.0)], [a.dead + 1.5, L(5800, 620, 1.04)],
    [a.fifth + .6, L(5780, 610, 1.02)], [tCreep, creep67(tCreep)],
  ];
  const camRaw = (t) => (t < tA ? c56(t) : t < tCreep ? F.camPath(t, K) : creep67(t));
  const cam = (t) => E.camDrift(camRaw(t), t, 4 * smooth(span(t, t0, t0 + .9)) * (1 - smooth(span(t, tPlate - 2, tPlate))), 9);

  // ------------------------------------------------------------------ timings
  const turn = (t) => sineIO(span(t, t0 + .3, t0 + 1.8));
  const lights = (t) => span(t, t0 + .8, a.subs + .6) * (1 - .75 * span(t, a.does + .6, a.maynard + 1.5));
  const windows = (t) => lerp(0, 1, span(t, t0 + .6, a.want)) * (1 - .7 * span(t, a.does + .4, a.maynard + 1.5));
  const proofIn = (t) => span(t, a.proof - .5, a.proof + .25), proofOut = (t) => span(t, a.says - .1, a.says + .9);
  const dim = (t) => .62 * sineIO(span(t, a.proof - .3, a.proof + .5)) * (1 - sineIO(span(t, a.says, a.says + 1.0))) + .3 * sineIO(span(t, a.fifth, a.fifth + 2));
  const roadU = (t) => span(t, a.does, a.maynard + 2.4);
  const mile = (t) => span(t, a.milestone - .1, a.milestone + .7);
  const may = (t) => span(t, a.maynard + .6, a.lecun + 1.2);
  const mayQ = (t) => span(t, a.milestone - .3, a.milestone + .6) * (1 - span(t, a.lecun - .3, a.lecun + .5));
  const lecWalk = (t) => span(t, a.lecun + .2, a.left + .8);
  const lecL = (t) => span(t, a.lecun + 1.0, a.lecun + 1.8) * (1 - span(t, a.tech + .4, a.tech + 1.1));
  const morph = (t) => sineIO(span(t, C4.start - 1.1, C4.start + .1)) * (1 - sineIO(span(t, C4.end - .3, C4.end + .9)));
  const sign = (t) => span(t, a.kind + .1, a.kind + 1.2), wall = (t) => span(t, a.kind + .5, a.kind + 1.4), chats = (t) => span(t, a.kind + .6, a.dead + .9);
  const veil = (t) => B.GAP.veil * sineIO(span(t, a.fifth - .4, a.fifth + 1.2));
  const box = (t) => sineIO(span(t, a.fifth - .3, a.fifth + 1.2)) * (1 - sineIO(span(t, a.gapNo - .3, a.gapNo + 1.0)));
  const fill = (t) => sineIO(span(t, a.fifth + .9, a.fifth + 2.0));
  const slipU = (t) => span(t, a.bet - .3, a.bet + .5) * (1 - sineIO(span(t, a.gapNo - .5, a.gapNo + 1.0)));
  const gap = (t) => span(t, a.gapNo - .1, a.gapNo + 1.1), crackU = (t) => span(t, a.gapNo + .6, a.gapNo + 1.9);
  const postU = (t) => Math.max(1 - span(t, a.but - .4, a.but + .6), span(t, a.fifth + 1.5, a.gapNo + .5));

  return (ctx, t) => {
    if (t >= tPlate) { B.plate67(ctx, t, T); return; }
    const c = cam(t); let lecScreen = null;
    S.landWorld(ctx, c, t, {
      head: { dim: dim(t) }, post: postU(t), windows: windows(t),
      headExtra: (cx, boxes) => {   // 5.01: the smaller word PROOF falls over SUPERINTELLIGENCE, then slides off
        const pi = proofIn(t), po = proofOut(t); if (pi <= 0 || po >= 1 || !boxes) return;
        const b = boxes[0], x = b.x + b.w / 2 + 520 * expoIn(po), y = b.y - 34 - (1 - expoOut(pi)) * 420 + 40 * expoIn(po);
        cx.save(); cx.globalAlpha *= clamp(pi * 4) * (1 - po);
        E.glowText(cx, 'PROOF', x, y, { size: b.h * 1.05, serif: true, col: CREAM, align: 'center' }); cx.restore();
      },
      tower: { u: 1, dark: lerp(.55, .8, span(t, a.but, a.but + 2)) }, ribbon: { u: 1, glow: .45, a: .8 }, chair: { referee: 0 }, board: { chalk: 1, spot: 1 }, you: false,
      land: (cx) => {
        // the lights round the land (subscribe): outward from you
        const lu = lights(t);
        if (lu > 0) for (const [x, y, q] of LIGHTS) { const d = Math.abs(x - B.YOU56.x) / 5200, on = clamp((lu * 1.25 - d) * 6 - q * .5); if (on <= 0) continue;
          cx.fillStyle = rgba(mixHex(LAMP.body, GOLD.hot, .5), on * (.7 + .3 * Math.sin(t * 1.7 + q * 30))); cx.fillRect(x, y, 6, 7); }
        B.refereeAt(cx, t, {});
        const tu = turn(t), hd = B.youAt(cx, B.YOU56.x, { look: lerp(B.YOU56O.look, YOU6O.look, tu), back: .3 * (1 - tu), armR: [lerp(B.YOU56O.armR[0], YOU6O.armR[0], tu), lerp(B.YOU56O.armR[1], YOU6O.armR[1], tu)] });
        B.fileInHand(cx, t, hd, { glow: lerp(1, .7, tu) });
        // the road: milestone, Maynard's even walk (a dotted trail: the same before and after), LeCun, the chat lane, the wall, the sign
        B.road(cx, t, { u: roadU(t), mile: mile(t), wall: wall(t), sign: sign(t), chats: chats(t) });
        const m = may(t);
        if (m > 0 && m < 1) {
          const x = lerp(MAY.x0, MAY.x1, m);
          cx.fillStyle = rgba(CREAM2(), .45); for (let px = MAY.x0; px < x - 30; px += 18) cx.fillRect(px, B.ROAD.y - 2, 8, 2);
          E.person(cx, x, B.ROAD.y, 72, { dir: 1, walk: (x - MAY.x0) / 11, view: 'side', look: .15 });
        }
        const lw = lecWalk(t);
        if (t > a.lecun - 1) {
          const x = lerp(LEC.x0, LEC.x1, sineIO(lw));
          const hdl = lw > 0 && lw < 1 ? E.person(cx, x, GY - 2, 78, { dir: -1, walk: (LEC.x0 - x) / 11, view: 'side', long: true, look: .1 })
            : E.person(cx, x, GY - 2, 78, { dir: -1, long: true, look: .25, armR: [.3, .2], armL: [-.2, -.1], a: lw > 0 ? 1 : 0 });
          lecScreen = [E.project(c, S.Z_LAND, x - 40, GY - 90), E.project(c, S.Z_LAND, x + 40, GY)];
        }
      },
    });
    // 5.02: Maynard's quote · 5.03: LeCun's label
    const mq = mayQ(t); if (mq > 0) { F.quoteCard(ctx, t, T, { u: mq, text: F.SOURCES.maynard, credit: F.SOURCES.maynardSrc, x: 140, y: 120, w: 700, size: 64 }); }
    const ll = lecL(t);
    if (ll > 0 && lecScreen?.[0]) { const [n1, n2] = F.SOURCES.lecun.split(' · '); F.goldLabel(ctx, lecScreen[0][0] + 20, lecScreen[0][1] - 10, n1, n2, ll, { dx: -90, dy: -110, size: 30 }); }
    // 5.04: C4 grows out of LeCun and back
    const mo = morph(t);
    if (mo > 0 && lecScreen?.[0] && lecScreen[1]) { const [p, q] = lecScreen; F.clipPlate(ctx, t, T, 'C4', { from: { x: p[0], y: p[1], w: q[0] - p[0], h: q[1] - p[1] }, morph: mo }); }
    // 5.06 ★: box 5 big, filling halfway; the betting slip · 5.07: the gap is here
    F.veil(ctx, veil(t));
    const bx = box(t);
    if (bx > 0) {
      const r0 = F.checkBox(4), s = lerp(r0.w, BOX5.s, bx), x = lerp(r0.x + r0.w / 2, BOX5.x, bx), y = lerp(r0.y + r0.h / 2, BOX5.y, bx), f = fill(t), lev = .5 * f;
      ctx.save(); ctx.fillStyle = rgba(P.night0, .55); ctx.fillRect(x - s / 2, y - s / 2, s, s);
      if (lev > 0) { const fh = (s - 12) * lev; ctx.fillStyle = E.lin(ctx, 0, y + s / 2 - 6 - fh, 0, y + s / 2 - 6, [[0, GOLD.hot], [1, GOLD.mid]]); ctx.fillRect(x - s / 2 + 6, y + s / 2 - 6 - fh, s - 12, fh);
        halo(ctx, x, y + s / 4, s * .9, .35 * f, GOLD.halo, GOLD.core);
        ctx.fillStyle = rgba(GOLD.core, .9); ctx.fillRect(x - s / 2 + 6, y + s / 2 - 6 - fh - 1 + 2 * Math.sin(t * 2.4), s - 12, 2); }
      ctx.strokeStyle = rgba(GOLD.core, .85); ctx.lineWidth = lerp(2, 5, bx); ctx.strokeRect(x - s / 2, y - s / 2, s, s); ctx.restore();
      if (f > .3) F.goldText(ctx, [['HALF', 1]], x, y + s / 2 + 60, 40, rise(span(f, .3, 1)) * bx, { serif: false, weight: 700, spacing: .12, align: 'center' });
    }
    B.slip(ctx, t, SLIP.x, SLIP.y, SLIP.w, slipU(t), { rot: .05 });
    const g = gap(t); if (g > 0) B.gapScene(ctx, t, { u: g, crack: crackU(t), you: 1 });
    F.checklist(ctx, t, T, { lit: t > a.gapNo ? 3 : t > a.last && t < a.fifth ? 4 : undefined });
  };
}
const CREAM2 = () => F.CREAM2;
