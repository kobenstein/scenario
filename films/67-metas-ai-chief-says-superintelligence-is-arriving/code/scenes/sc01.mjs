// c01 · Hook · THE NIGHT OF THE HEADLINE · thumbnail A (the headline SUPERINTELLIGENCE IS ARRIVING in the sky, you tiny on the quay) ·
// Wang's X post header unrolls under it · a cream ? falls next to it · your street turns gold · THE FILE leaves the headline and sinks to
// your hand · it flies to the chalkboard's empty spot (RIEMANN HYPOTHESIS · UNSOLVED) · a light scans it line by line → the gold card
// CORRECT · ★ the file opens, pages pour, the paper tower rises out of frame (250,000+ PAGES), you and the author look up · the X quote
// crops unroll out of the post header (alien mind · homework problem, gold highlighter) · the balance · the chalk robot of our fears is
// wiped, AN ANSWER WE CAN'T READ writes in gold · the ? flies into the checklist IS HE RIGHT? (five boxes) → plateWang at 'The man is'.
// 0 → T.G('The man is Alexandr Wang') · built by the lead (quality reference). Plan: docs/shots.md H.01–H.12 · world: docs/MOTION.md
// ONE entry, one world, one continuous camera.
//
// | ID    | anchor (phrase)              | picture (one idea)                                                                   | camera              |
// |-------|------------------------------|--------------------------------------------------------------------------------------|---------------------|
// | H.01  | Superintelligence is arriving| THUMBNAIL A: the headline in the sky, you tiny on the quay                           | slow push · SCENE   |
// | H.02  | That's what Meta's           | Wang's X post header unrolls under the headline                                      | creep · MIX         |
// | H.03  | Is he right?                 | a cream ? falls next to IS ARRIVING; you look up                                     | creep · SCENE       |
// | H.04  | Because if he is             | drop to you: the windows of your street turn gold, outward from you                  | drop · SCENE        |
// | H.05  | His evidence is a single file| the file leaves the headline and sinks to your raised hand; PROOF CLAIMED · NOV 20   | pull up · MIX       |
// | H.06  | In it, a mathematician       | you walk right; the file flies to the chalkboard's empty spot: RIEMANN HYPOTHESIS     | travel right · MIX  |
// | H.07  | A separate program           | a light scans the file line by line, checks behind it; the gold card CORRECT rises    | push in · MIX       |
// | H.08★ | But written out              | the file opens, pages pour, the tower rises out of frame; 250,000+ PAGES; both look up| pull back · SCENE   |
// | H.09  | Meta's A.I. chief says       | the tower darkens; the alien-mind crop unrolls out of the post header, highlighter    | glide left · EXPL   |
// | H.10  | Many physicists              | the homework crop under it; the balance: HOMEWORK light, the file heavy              | creep · EXPL        |
// | H.11  | If he's right                | crops roll back; the chalk robot is wiped; AN ANSWER WE CAN'T READ in gold            | glide right · MIX   |
// | H.12  | So test his claim            | the ? flies into the checklist IS HE RIGHT? (five cream boxes) → plateWang            | glide home · LAND   |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f67_kit.mjs';
import * as S from '../lib/f67_world.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, smooth } = E;
const { GOLD, CREAM, rise } = F;

export const PRINT = F.PRINT67;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.meta = G("That's what Meta's"); a.right = G('Is he right'); a.because = G('Because if he is'); a.change = G('biggest change', a.because);
  a.file = G('His evidence is'); a.single = G('a single file', a.file); a.inIt = G('In it, a mathematician'); a.riemann = G('Riemann hypothesis', a.inIt);
  a.sep = G('A separate program'); a.step = G('step by step', a.sep); a.verdict = G('Its verdict', a.sep); a.correct = G('correct', a.verdict);
  a.but = G('But written out'); a.pages = G('million pages', a.but); a.noHuman = G('no human fully', a.but); a.notEven = G('Not even the mathematician', a.but);
  a.says = G("Meta's A.I. chief says"); a.alien = G('alien mind', a.says); a.alienE = GE("don't understand", a.says);
  a.phys = G('Many physicists'); a.bomb = G('atomic bomb', a.phys); a.hw = G('homework problem', a.phys); a.hwE = GE('next to this', a.phys);
  a.ifRight = G("If he's right"); a.machine = G('a machine we fear', a.ifRight); a.fear = G('fear', a.machine); a.answer = G('an answer we', a.ifRight); a.read = GE("can't read", a.ifRight);
  a.test = G('So test his claim'); a.five = G('Five checks', a.test); a.pass = G("He doesn't pass", a.test); a.end = R.b;
  return [{ t: 0, draw: scene(a, T), print: PRINT }];
};

const L = (u, v, s = 1) => S.landCam(u, v, s);
const SP = S.BOARD.spot, FS = 40;                       // the file on the board's spot (land px, width)
const HAND = [1012, S.GY - 50];                         // where the file meets your raised hand (land px, you at the quay)
const WALK = [S.YOU.x, 1760];                           // you walk from the quay to the board's foot (H.06)
const AUTHOR = 1905;

function scene(a, T) {
  const tPlate = a.end - S.SEAM_HALF, tCreep = tPlate - 2.4;
  // ---------------------------------------------------------------- the camera (one take)
  const K = [
    [0, L(960, 540, 1.0)], [a.meta, L(960, 548, 1.025)], [a.right + .3, L(960, 560, 1.045)],
    [a.change + .6, L(980, 712, 2.25)], [a.file + .1, L(990, 700, 2.1)], [a.single + 1.2, L(1010, 650, 1.55)],
    [a.inIt + .6, L(1150, 660, 1.6)], [a.riemann - .2, L(2050, 610, 1.38)], [a.sep - .2, L(2150, 590, 1.45)],
    [a.step + .4, L(SP.x, 500, 2.5)], [a.correct + .9, L(SP.x + 10, 492, 2.7)], [a.but + .6, L(2400, 520, 2.2)],
    [a.pages + .2, L(2040, 520, .95)], [a.notEven + .4, L(2010, 530, .98)],
    [a.alien - .9, L(1500, 640, 1.0)], [a.hwE, L(1470, 640, 1.03)],
    [a.machine - .1, L(2280, 560, 1.28)], [a.read + .3, L(2320, 566, 1.36)],
  ];
  const creepCam = (t) => { const k = 1 + S.CREEP * (t - tPlate); return S.WANG_CAM(k, S.trk(k)); };
  const KALL = [...K, [tCreep, creepCam(tCreep)]];
  const camRaw = (t) => (t < tCreep ? F.camPath(t, KALL) : creepCam(t));
  const cam = (t) => E.camDrift(camRaw(t), t, 5 * (1 - smooth(span(t, tPlate - 2, tPlate))), 4);

  // ---------------------------------------------------------------- timings of the pieces
  const postU = (t) => span(t, a.meta + .1, a.meta + 1.7);
  const qFall = (t) => span(t, a.right - .35, a.right + .55);                       // the ? falls (lands on "right")
  const qFly = (t) => sineIO(span(t, a.test, a.test + 1.3));                        // … and flies into the checklist title
  const windows = (t) => span(t, a.change - .3, a.file + .4);
  const fileA = (t) => sineIO(span(t, a.file + .2, a.single + .8));                  // headline → your hand (screen-space flight)
  const fileB = (t) => sineIO(span(t, a.inIt + .3, a.riemann - .7));                 // your hand → the board's spot (land arc)
  const walk = (t) => span(t, a.inIt + .2, a.riemann + .4);
  const scan = (t) => span(t, a.sep + .3, a.verdict - .1);
  const card = (t) => span(t, a.correct - .25, a.correct + .45) * (1 - expoIn(span(t, a.but + .2, a.but + 1.0)));
  const open = (t) => span(t, a.but + .3, a.but + 1.3);
  const tower = (t) => span(t, a.but + 1.0, a.pages + .6);
  const dark = (t) => .8 * span(t, a.says - .4, a.says + 1.0) * (1 - .15 * span(t, a.machine, a.machine + 2));
  const veil = (t) => .5 * sineIO(span(t, a.says - .2, a.alien - .6)) * (1 - sineIO(span(t, a.ifRight + .1, a.ifRight + 1.3)));
  const crop1 = (t) => span(t, a.says + .1, a.says + 1.4) * (1 - span(t, a.ifRight, a.ifRight + 1.0));
  const crop2 = (t) => span(t, a.phys - .1, a.phys + 1.1) * (1 - span(t, a.ifRight - .1, a.ifRight + .8));
  const bal = (t) => span(t, a.bomb - .1, a.hw + .3) * (1 - span(t, a.ifRight - .2, a.ifRight + .7));
  const robot = (t) => span(t, a.machine - .7, a.machine + .5), robotGone = (t) => span(t, a.fear - .05, a.fear + 1.3);
  const answerU = (t) => span(t, a.answer - .1, a.answer + .8) * (1 - expoIn(span(t, a.five, a.five + 1.0)));
  const fileBig = (t) => sineIO(span(t, a.answer - .3, a.answer + 1.2)) * (1 - sineIO(span(t, a.test + .5, a.pass + .5)));
  const label = (t) => span(t, a.single - .1, a.single + .6) * (1 - span(t, a.riemann - 1.2, a.riemann - .6));

  // the file on the land (after the screen-space flight): at your hand, flying to the board, then on the spot
  const fileLand = (t) => {
    const b = fileB(t);
    const x = lerp(HAND[0], SP.x, b) + (walk(t) > 0 && b < 1 ? 0 : 0), y = lerp(HAND[1], SP.y, b) - 260 * Math.sin(Math.PI * b);
    return { x, y, s: lerp(22, FS, b) * (1 + .45 * fileBig(t)) };
  };
  const youX = (t) => lerp(WALK[0], WALK[1], sineIO(walk(t)));
  const youO = (t) => {
    const w = walk(t), reach = span(t, a.file + .4, a.single + .4) * (1 - span(t, a.inIt + .1, a.inIt + .6));
    const look = .9 - .5 * reach + .1 * span(t, a.notEven, a.notEven + .8) - .4 * span(t, a.says, a.says + 1) + .3 * span(t, a.machine, a.machine + 1);
    return w > 0 && w < 1 ? { walk: (youX(t) - WALK[0]) / 12, view: 'side', look: .2 } : { armR: [lerp(.2, 2.4, reach), lerp(.1, 2.55, reach)], look };
  };

  // ---------------------------------------------------------------- one frame
  return (ctx, t) => {
    if (t >= tPlate) { S.plateWang(ctx, t, T); return; }
    const c = cam(t), fA = fileA(t), fB = fileB(t);
    const onLand = fA >= 1;                                // the file lives on the land card once it reached your hand
    S.landWorld(ctx, c, t, {
      head: { dim: .45 * span(t, a.inIt, a.inIt + 2) * (1 - span(t, a.test, a.test + 2)) },
      headExtra: (cx) => {   // the ? on the headline card (behind the land) until it flies
        const qf = qFall(t); if (qf <= 0 || qFly(t) > 0) return;
        E.glowText(cx, '?', 1560, 545 - (1 - expoOut(qf)) * 700 + 10 * F.bump(t, a.right + .2, .5), { size: 300, serif: true, col: CREAM, a: 1 - .45 * span(t, a.file, a.file + 1.5), align: 'center' });
      },
      post: postU(t), windows: windows(t),
      board: { chalk: 1, spot: span(t, a.riemann - .2, a.riemann + .8), robot: robot(t), robotGone: robotGone(t) },
      tower: tower(t) > 0 ? { u: tower(t), dark: dark(t), pour: span(t, a.but + .8, a.but + 1.4) * (1 - .7 * span(t, a.pages + 1, a.pages + 3)), from: [SP.x, SP.y] } : null,
      author: { x: AUTHOR, o: { look: lerp(-.3, .9, span(t, a.notEven, a.notEven + .9)), armR: [1.2, 1.9] } },
      you: { x: youX(t), o: youO(t) },
      land: (cx) => {
        if (onLand) {
          const f = fileLand(t);
          F.file(cx, t, f.x, f.y, f.s, { scan: scan(t) > 0 ? scan(t) : undefined, open: open(t) * (1 - span(t, a.ifRight, a.ifRight + 1)), glow: 1, seed: 5, rot: fB < 1 ? .2 * Math.sin(Math.PI * fB) : 0 });
          const cu = card(t); if (cu > 0) F.goldCard(cx, t, f.x + f.s * .55, f.y - f.s * .5, 34, { u: cu, text: 'CORRECT' });
        }
        const tu = tower(t);
        if (tu > .55) F.goldText(cx, [[F.SOURCES.pages, 1]], S.TOWER.x + 130, S.GY - 330, 46, rise(span(tu, .55, 1)) * (1 - span(t, a.says - .3, a.says + .3)), { serif: true, glow: true });
        const au = answerU(t); if (au > 0) F.goldText(cx, [[F.SOURCES.unreadable, 1]], S.BOARD.x - 210, S.GY - 300, 34, rise(au), { serif: false, weight: 700, spacing: .06, align: 'center', glow: true });
      },
    });
    // the file's first flight: out of the headline (the line IS ARRIVING) down to your hand, in screen space between the two cards
    if (!onLand && fA > 0) {
      const p0 = S.headPt(c, 960, 520), p1 = S.landPt(c, HAND[0], HAND[1]);
      if (p0 && p1) { const x = lerp(p0[0], p1[0], fA) + 60 * Math.sin(Math.PI * fA) * p1[2], y = lerp(p0[1], p1[1], fA); F.file(ctx, t, x, y, lerp(26 * p0[2], 22 * p1[2], fA), { glow: 1, rot: .3 * Math.sin(Math.PI * fA * 2), seed: 5 }); }
    }
    // PROOF CLAIMED · NOV 20, 2026 (beside the file in your hand)
    const lu = label(t); if (lu > 0) { const p = S.landPt(c, HAND[0], HAND[1] - 30); if (p) F.goldLabel(ctx, p[0] + 26, p[1] - 10, 'PROOF CLAIMED', 'NOV 20, 2026', lu, { dx: 70, dy: -70, size: 26 }); }
    // H.09 / H.10: the veil, the quote crops unroll out of the post header (screen space), the highlighter on the spoken words
    const va = veil(t);
    if (va > 0) {
      F.veil(ctx, va);
      const pr = S.postRect(c);
      const w = 1240, x = clamp(pr ? pr.x - 60 : 200, 80, W - w - 340), y1 = (pr ? pr.y + pr.h : 600) + 14;
      const q1 = F.xQuote(ctx, t, 'alien', x, y1, w, { u: crop1(t), hiU: span(t, a.alien - .05, a.alien + .9) });
      if (crop2(t) > 0) F.xQuote(ctx, t, 'homework', x, y1 + (q1 ? q1.full : 110) + 16, w, { u: crop2(t), hiU: span(t, a.hw - .05, a.hw + .9) });
      const bu = bal(t);
      if (bu > 0) F.balance(ctx, t, 1640, 560, 190, { u: bu, tilt: .85 * sineIO(span(t, a.hw + .2, a.hwE + .4)),
        left: (cx, px, py) => F.notebook(cx, t, px, py, 120, { a: clamp(span(t, a.hw - .2, a.hw + .3) * 3) }),
        right: (cx, px, py) => F.file(cx, t, px, py - 34, 50, { glow: 1, a: clamp(span(t, a.bomb, a.bomb + .4) * 3) }) });
    }
    // H.03 → H.12: the cream question mark (falls next to IS ARRIVING on "right"; flies into the checklist title on "So test his claim")
    const qf = qFall(t), qy = qFly(t);
    if (qf > 0 && qy > 0 && qy < 1) {
      const p = S.headPt(c, 1560, 545); if (p) {
        const k = p[2], x0 = p[0], y0 = p[1];
        const tx = W - 70 - (5 * 44 + 4 * 16) + 150, ty = 54;   // the checklist title's '?'
        const x = lerp(x0, tx, qy), y = lerp(y0, ty, qy) - 120 * Math.sin(Math.PI * qy), size = lerp(300 * k, 24, qy);
        E.glowText(ctx, '?', x, y, { size, serif: true, col: CREAM, a: (1 - .45 * span(t, a.file, a.file + 1.5) + .45 * qy) * (1 - span(qy, .82, 1)), align: 'center' });
      }
    }
    F.checklist(ctx, t, T);
  };
}
