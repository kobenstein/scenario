// c01 · Lead · the hook: the hill (thumbnail A) · a coin a month in your window · the years fly · the older you, the piggy full · in his future
// the coins turn to dust and drift down into the shop: everything, cheap · the balance: your savings against his future · up into the sky,
// down onto the hill: WHAT WOULD HAVE TO BE TRUE? · three quotes from three coins · they fold into THE TEST · line 1 already here, lines 3–5
// still a promise · the card tips away, up and down to the ON AIR window · C1 (Musk, Moonshots) · the condition line over the roofs.
// 0 → T.G('And behind that picture') · built by the lead (quality reference). Plan: docs/shots.md 1.01–1.15 · world/rules: docs/MOTION.md
// ONE entry. Places: HILL → (light door: the far window = your lamp) → STREET → (sky door) → HILL → (sky door) → STREET → plateCondition.
// One camera space for both places (lib/f26_seams.mjs): the sky doors switch the near layers while only stars + far city are in view.
//
// | ID    | anchor (phrase)                        | picture (one idea)                                                    | camera / layer        |
// |-------|----------------------------------------|-----------------------------------------------------------------------|-----------------------|
// | 1.01★ | Elon Musk says saving money            | thumbnail A: the hill, the giant cracked piggy, you; STOP SAVING MONEY | home · PIG            |
// | 1.02  | Every month                            | one coin leaves the stream, arcs over the river into a far window;    | glide left · dive · W |
// |       |                                        | into its light → out of your lamp: your hand drops it in your piggy   | pull back · SCENE     |
// | 1.03  | For later                              | push onto the wall calendar: months, then years flip                  | push · MIX            |
// | 1.04  | For the day you stop working           | 2060 lands; pull back: the older you holds the full piggy             | pull back · SCENE     |
// | 1.05  | In his future                          | the coins leave the slot as gold dust and drift out of the window     | drift · SCENE         |
// | 1.06  | Machines will make almost everything   | follow the dust down to the shop: shelves fill, tags roll to $0       | track down · MIX      |
// | 1.07  | To him, saving is a bet                | a balance in the sky: YOUR SAVINGS vs HIS FUTURE, tips to the light   | rise · EXPL           |
// | 1.08  | So what would have to be true          | the piggy rises, sky door, falls into the giant's crack; the question | up · S · down · PIG   |
// | 1.09  | He means it · The richest man          | three coins → three quote cards (Moonshots, The Economist, X)          | drift · EXPL          |
// | 1.10  | But he has also told us                | the cards fold into THE TEST (five empty lines)                        | drift · EXPL          |
// | 1.11  | Part of his future is already here     | line 1 glows: warehouse robots run through it                          | push · EXPL           |
// | 1.12  | But the part that would pay            | lines 3–5 turn to dashes (a promise)                                   | push · EXPL           |
// | 1.13  | Last winter, on a podcast              | the card tips away; up, sky door, down to the ON AIR window            | up · S · down · fly-in |
// | 1.14  | [C1] Musk, Moonshots                   | the monitor grows into the clip plate (original footage)               | creep · CLIP          |
// | 1.15  | In other words                         | back into the monitor, out over the roofs: the gold condition line     | pull back · rise      |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f26_kit.mjs';
import * as S from '../lib/f26_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, smooth } = E;
const F0 = E.F0;

export const PRINT = F.PRINT26;
export const TC_AT = [560, 500, .9];          // the test card in the hook (left of the giant piggy)

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.pointless = G('pointless'); a.every = G('Every month'); a.month = G('month', a.every); a.away = G('away', a.every);
  a.later = G('For later'); a.day = G('For the day you stop'); a.working = G('working', a.day);
  a.future = G('In his future'); a.need = G("won't need it", a.future);
  a.machines = G('Machines will make'); a.cheaply = G('cheaply', a.machines); a.matter = G("won't matter", a.machines); a.anymore = GE('anymore', a.machines);
  a.him = G('To him, saving'); a.bet = G('bet against', a.him);
  a.sowhat = G('So what would have'); a.true = G('true', a.sowhat); a.savings = G('your savings', a.sowhat); a.mattering = GE('mattering', a.sowhat);
  a.means = G('He means it'); a.earth = G('on Earth', a.means); a.again = G('again and again', a.means);
  a.told = G('But he has also told us'); a.check = G('check him', a.told);
  a.part = G('Part of his future'); a.promise = GE('only a promise', a.part);
  a.winter = G('Last winter, on a podcast'); a.podcast = G('podcast', a.winter); a.like = GE('like this', a.winter);
  a.C1 = T.clip('C1');
  a.other = G('In other words'); a.picture = G('picture of the future', a.other); a.comes = GE('comes true', a.other);
  a.end = R.b;
  return [{ t: 0, draw: scene(a, T), print: PRINT }];
};

const ROOMVIEW = E.aim(F0, 565, 530, 3.2);
const LAMP = E.aim(S.Z_ROOM, S.ROOM.lamp[0], S.ROOM.lamp[1] - 14, 6);
const SKY = (x) => E.aim(F0, x, -1700, 1);
const BAL = { x: 1000, y: -220, w: 860 };           // the balance in the sky over the street (F0 design)
const CARD_X = [96, 396, 696], CARD_Y = 404, CARD_W = 276, CARD_H = 196;   // the three quote cards (screen)
const CARD_Q = ['wontmatter', 'y2036', 'pointless'];

function scene(a, T) {
  const TT = F.testTimes(T);
  // ---------------------------------------------------------------- times (all from phrases)
  const tc0 = a.pointless - .35, tc1 = a.month + .12;        // the coin leaves the stream → lands in the far window
  const tf = a.away - 1.0;                                  // light door peak (far window → your lamp)
  const tDrop = a.away - .05, tLand = tDrop + .3;           // the coin falls from your hand into the slot
  const tFlip0 = a.later + .15, tFlip1 = a.working + .15;   // the calendar pages (months → years)
  const tOld = (a.day + .3 + tFlip1) / 2;                 // du → the older you (the camera is on the calendar)
  const tDust0 = a.future + .1, tShop0 = a.machines + .7;   // dust leaves the slot · reaches the shop
  const tFly0 = a.him + .15, tFly1 = a.him + 1.35;          // your piggy floats up to the left pan
  const tRise = a.sowhat + .1;                              // it lifts off the pan and rises
  const tS1 = a.true - .2;                                  // sky door 1 (street → hill)
  const tMerge = a.mattering + .1;                          // your piggy reaches the giant's crack
  const tCard = [a.means + .05, a.earth - .25, a.again - .1];
  const tFold = a.told - .25;
  const tS2 = a.winter + 1.35;                              // sky door 2 (hill → street); a coin from the stream carries the eye
  const tOn = a.winter + 2.85;                              // that coin lands on the ON AIR sign: it lights                               // sky door 2 (hill → street)
  const C1 = a.C1, tPlate = a.end - S.SEAM_HALF;

  // ---------------------------------------------------------------- camera
  const HILL_A = [[0, S.HILL_CAM], [tc0 + .4, E.aim(F0, 930, 560, 1.03)], [tc1, E.aim(F0, 800, 640, 1.12)]];
  const DIVE = [[tc1, HILL_A[2][1]], [tf, E.aim(S.HILL_WINDOW.Z, S.HILL_WINDOW.x, S.HILL_WINDOW.y, 70), 'i']];
  const OUT = [[tf, LAMP], [tf + 1.45, ROOMVIEW, 'o']];
  const K = [
    [tf + 1.45, ROOMVIEW],
    [a.day + .3, S.CALCAM(12)],
    [tFlip1 + .15, S.CALCAM(12.6)],
    [a.future + 1.8, E.aim(F0, 640, 548, 3.35)],
    [a.machines - .1, E.aim(F0, 650, 528, 2.95)],
    [a.machines + 1.25, E.aim(F0, 1010, 640, 1.32)],
    [a.cheaply + 1.0, E.aim(F0, 1470, 772, 1.78)],
    [a.anymore, E.aim(F0, 1456, 758, 1.84)],
    [a.him + 1.2, E.aim(F0, 1240, 420, 1.22)],
    [a.bet + 1.0, E.aim(F0, 1000, 60, .93)],
    [tRise + .25, E.aim(F0, 960, -40, .96)],
    [tS1, SKY(940)],
    [tMerge + .3, E.aim(F0, 900, 510, .95)],
    [a.earth, E.aim(F0, 862, 505, .92)],
    [a.check + .5, E.aim(F0, 872, 506, .93)],
    [a.part + 1.6, E.aim(F0, 960, 470, 1.04)],     // a slow push past the card toward the stream (the hill lives behind the card)
    [a.promise, E.aim(F0, 1010, 500, 1.1)],
    [a.winter + .1, E.aim(F0, 1016, 500, 1.11)],
    [tS2, SKY(1300)],
    [tOn + .35, E.aim(F0, 1440, 400, 1.5)],
    [C1.start - .7, E.aim(F0, 1446, 372, 3.55)],
    [C1.end, E.aim(F0, 1446, 370, 3.72)],
    [a.other + 1.1, E.aim(F0, 1330, 300, 1.7)],
    [tPlate, S.COND_CAM],
  ];
  const cam = (t) => {
    if (t < tc1) return F.camPath(t, HILL_A);
    if (t < tf) return E.camAt(t, DIVE, S.HILL_WINDOW.Z);
    if (t < tf + 1.45) return E.camAt(t, OUT, S.Z_ROOM);
    return F.camPath(t, K, S.Z_ROOM);
  };

  // ---------------------------------------------------------------- your piggy's flight (one design space for both places)
  const panL = (t) => { const tilt = tiltAt(t), c = Math.cos(tilt), s = Math.sin(tilt); return [BAL.x - c * BAL.w / 2, BAL.y - s * BAL.w / 2 + BAL.w * .26 - 2]; };
  const tiltAt = (t) => .2 * expoOut(span(t, a.bet - .1, a.bet + 1.1)) - .035 * Math.sin(Math.PI * span(t, a.bet + .6, a.bet + 2.2)) + .006 * Math.sin(t * 1.3);
  const PIG_H = S.ROOM.piggy[2];
  const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));
  const flyStart = [S.ROOM.fig[0] - 4, 652];   // the piggy in the older's hands (F0 design ≈ Z_FIG design at s ≈ 1)
  const pigPath = (t) => {   // feet position + scale of your piggy from the older's hands to the pan, up to the stars, down into the crack
    if (t < tFly1) { const u = sineIO(span(t, tFly0, tFly1)), p1 = panL(t), cx = lerp(flyStart[0], p1[0], .35), cy = Math.min(flyStart[1], p1[1]) - 260;
      return [(1 - u) ** 2 * flyStart[0] + 2 * u * (1 - u) * cx + u * u * p1[0], (1 - u) ** 2 * flyStart[1] + 2 * u * (1 - u) * cy + u * u * p1[1], lerp(1, 1.5, u)]; }
    if (t < tRise) return [...panL(t), 1.5];
    const p0 = panL(tRise), cr = S.crackOf();
    const k = F.camPath(t, [[tRise, { x: p0[0], y: p0[1], z: 0 }], [tS1, { x: 940, y: -1690, z: 0 }], [tMerge, { x: cr[0], y: cr[1] + 20, z: 0 }]]);
    return [k.x, k.y, lerp(1.5, 1.9, bump(t, tRise, tMerge - tRise)) * (1 - .85 * smooth(span(t, tMerge - 1.2, tMerge)))];
  };
  const drawFlyingPig = (ctx, t) => {
    if (t < tFly0 || t > tMerge + .05) return;
    const [x, y, s] = pigPath(t);
    const trail = [0, .12, .24, .36].map((d) => { const p = pigPath(Math.max(tFly0, t - d)); return [p[0], p[1] - PIG_H * .45]; });
    if (t > tRise) F.goldDust(ctx, t, trail.reverse(), { n: 60, seed: 41, spread: 14, a: .9, size: 2.2, speed: .5 });
    E.halo(ctx, x, y - PIG_H * .5 * s, 150 * s, .45, P.halo1, P.core1);
    F.piggy(ctx, t, x, y, PIG_H * s, { crack: 0, warm: .5, lit: 1, fill: 1, dir: 1 });
  };

  // the coin that carries the eye through sky door 2: out of the stream, up into the stars, down onto the ON AIR sign
  const SIGN = [S.ONAIR.x + S.ONAIR.w / 2, S.ONAIR.y - 34];
  const coin2 = (ctx, t) => {
    if (t < a.winter - .1 || t > tOn + .05) return;
    const cr = S.crackOf(), k = F.camPath(t, [[a.winter - .1, { x: cr[0], y: cr[1] - 30, z: 0 }], [tS2, { x: 1300, y: -1640, z: 0 }], [tOn, { x: SIGN[0], y: SIGN[1], z: 0 }]]);
    F.goldDust(ctx, t, [[k.x, k.y + 60], [k.x, k.y]], { n: 30, seed: 77, spread: 10, a: .8, size: 2.2, speed: .8 });
    F.coin(ctx, k.x, k.y, 34, { flip: t * 6, glint: 1 });
  };
  // ---------------------------------------------------------------- the dust from the slot down to the shop (F0 design)
  const DUST = [[S.ROOM.fig[0], 600], [720, 470], [800, 455], [1010, 520], [1240, 600], [1460, 700]];
  const cut = (pts, u) => {   // the first u (0..1) of a polyline
    const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const d = L[L.length - 1] * clamp(u), out = [pts[0]];
    for (let i = 1; i < pts.length; i++) { if (L[i] <= d) out.push(pts[i]); else { const f = (d - L[i - 1]) / (L[i] - L[i - 1]); out.push([lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]); break; } }
    return out.length > 1 ? out : [pts[0], pts[0]];
  };

  // ---------------------------------------------------------------- street state at t
  const street = (t) => {
    const st = {};
    const page = 35 * E.quartIO(span(t, tFlip0, tFlip1));
    const who = t < tOld ? 'du' : 'older';
    const br = .02 * Math.sin(t * 1.15);
    let fig, hold = 0, piggy = {};
    if (who === 'du') {   // the coin drop: arm out over the slot, then down
      const up = expoOut(span(t, tf + .2, tDrop - .2)) * (1 - sineIO(span(t, tLand + .2, tLand + 1.0)));
      fig = { armR: [lerp(.15, 1.22, up), lerp(.25, .62, up)], look: -.18 * up + br, lean: .04 * up };
    } else {
      const drop = smooth(span(t, tFly0 - .1, tFly0 + .5));
      fig = { armR: [lerp(-.2, .15, drop), lerp(-1.9, .3, drop)], armL: [lerp(.2, -.1, drop), lerp(1.9, -.2, drop)], look: lerp(-.22, .55, smooth(span(t, a.future + 1.6, a.machines))) * (1 - drop * .2) + br };
      hold = 1; piggy = { fill: 1 - .75 * span(t, tDust0, tShop0 + 1.5) };
      if (t >= tFly0) piggy = false;
    }
    st.room = { page, label: S.CAL_LABEL, gold: S.CAL_GOLD, who, fig, hold, piggy, lit: 1,
      extra: (ctx, c, hands) => {   // the coin in your hand → the slot; the slot glints when it lands
        if (who !== 'du' || !hands || !st.room.pig) return;
        const [sx, sy] = st.room.pig.slot, hx = hands.R[0] + 6, hy = hands.R[1] + 4;
        if (t < tLand) { const u = expoIn(span(t, tDrop, tLand)); F.coin(ctx, lerp(hx, sx + 4, u), lerp(hy, sy - 2, u), 9, { flip: 1.2 + 4 * u, a: smooth(span(t, tf + .25, tf + .7)) }); }
        else E.halo(ctx, sx + 4, sy, 60, .7 * (1 - span(t, tLand, tLand + .9)));
      } };
    st.shop = { fill: smooth(span(t, tShop0 - .2, a.cheaply + .45)), zero: span(t, a.cheaply + .2, a.anymore - .1), light: .45 + .4 * smooth(span(t, tShop0 - .3, tShop0 + 1)) - .25 * smooth(span(t, tFly0 + .2, tFly1)) };
    st.onAirA = t < tS2 ? 1 : t < tOn + .06 ? .15 : 1;   // dark until the coin hits it (60 ms: cause → effect)
    if (t >= tS2) st.room = { page: 35, label: S.CAL_LABEL, gold: S.CAL_GOLD, who: 'older', piggy: false };
    st.field = (ctx, c) => {
      if (t >= tS2) E.card(ctx, c, F0, () => S.condLine(ctx, t, span(t, a.picture - .3, a.comes + .1)));
    };
    st.front = (ctx, c) => E.card(ctx, c, F0, () => {
      // the dust: out of the slot, out of the window, down to the shop
      if (t > tDust0 && t < tS1) { const u = sineIO(span(t, tDust0, tShop0 + .4)), out = 1 - smooth(span(t, a.anymore - .4, a.him + .6));
        const pg = st.room.pig, sp = pg && E.project(c, S.Z_FIG, pg.slot[0], pg.slot[1]), s0 = sp ? S.unproject(c, F0, sp[0], sp[1]) : DUST[0];
        F.goldDust(ctx, t, cut([s0, ...DUST.slice(1)], u), { n: 260, seed: 12, spread: 34, a: out * smooth(span(t, tDust0, tDust0 + .6)), size: 2.4, speed: .32 }); }
      // the balance + the shop light rising to its right pan
      const bu = span(t, a.him - .2, a.him + 1.4) * (1 - expoIn(span(t, a.sowhat + 1.0, a.sowhat + 2.2)));
      if (bu > 0 && t < tS1) {
        const orb = (cx, x, y) => { const k = expoOut(span(t, tFly0 + .2, tFly1 + .1)), ox = lerp(1470, x, k), oy = lerp(700, y - 34, k);
          E.halo(cx, ox, oy, 120, .9 * k); cx.fillStyle = rgba(P.core0, k); cx.beginPath(); cx.arc(ox, oy, 15, 0, 6.3); cx.fill(); };
        F.balance(ctx, t, BAL.x, BAL.y, BAL.w, tiltAt(t), { u: bu, post: 270, labels: ['YOUR SAVINGS', 'HIS FUTURE'], right: orb });
      }
      drawFlyingPig(ctx, t);
      if (t >= tS2) { coin2(ctx, t); if (t > tOn) E.halo(ctx, SIGN[0], SIGN[1], 220, .8 * (1 - span(t, tOn, tOn + 1.1))); }
    });
    return st;
  };

  // ---------------------------------------------------------------- hill state at t
  const hill = (t, c) => {
    const st = {};
    const look = t < tc0 ? .75 : t < tc1 + .3 ? lerp(.75, .25, sineIO(span(t, tc0, tc1))) : .7;
    st.du = { look: look + .02 * Math.sin(t * 1.1), light: 1, back: .35 };
    st.window = expoOut(span(t, tc1 + .05, tc1 + .35));
    st.front = (ctx, cc) => E.card(ctx, cc, F0, () => {
      drawFlyingPig(ctx, t); coin2(ctx, t);
      if (t > tMerge - .1 && t < tMerge + 1.2) { const cr = S.crackOf(); E.halo(ctx, cr[0], cr[1], 260, .6 * Math.sin(Math.PI * span(t, tMerge - .05, tMerge + 1.1))); }
    });
    return st;
  };

  // ---------------------------------------------------------------- the hook coin (hill): out of the stream, over the river into the far window
  const hookCoin = (ctx, c, t) => {
    if (t < tc0 || t > tc1 + .02) return;
    const cr = S.crackOf(), p0 = E.project(c, F0, cr[0] + 10, cr[1] - 40), w = S.HILL_WINDOW, p1 = E.project(c, w.Z, w.x, w.y);
    if (!p0 || !p1) return;
    const u = sineIO(span(t, tc0, tc1)), cx = p0[0] - 120, cy = p0[1] - 520;
    const x = (1 - u) ** 2 * p0[0] + 2 * u * (1 - u) * cx + u * u * p1[0], y = (1 - u) ** 2 * p0[1] + 2 * u * (1 - u) * cy + u * u * p1[1];
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    F.coin(ctx, x, y, lerp(30, 5, Math.pow(u, .8)), { flip: t * 7, glint: 1 - u });
    ctx.restore();
  };

  // ---------------------------------------------------------------- the three quote cards (screen) → they fold into the test card
  const cards = (ctx, c, t) => {
    if (t < tCard[0] || t > TT.born + .7) return;
    const cr = S.crackOf(), p0 = E.project(c, F0, cr[0], cr[1]); if (!p0) return;
    const fold = sineIO(span(t, tFold, tFold + .55)), x0 = TC_AT[0] - F.TEST.w * TC_AT[2] / 2, top = TC_AT[1] - F.TEST.h * TC_AT[2] / 2;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (let i = 0; i < 3; i++) {
      const t0 = tCard[i], fl = span(t, t0, t0 + .75); if (fl <= 0) continue;
      const tx = CARD_X[i] + CARD_W / 2, ty = CARD_Y + CARD_H / 2;
      if (fl < 1) {   // the coin: out of the crack, arcs to its place, flips edge-on
        const u = sineIO(fl), cx = lerp(p0[0], tx, .5), cy = Math.min(p0[1], ty) - 300;
        const x = (1 - u) ** 2 * p0[0] + 2 * u * (1 - u) * cx + u * u * tx, y = (1 - u) ** 2 * p0[1] + 2 * u * (1 - u) * cy + u * u * ty;
        F.coin(ctx, x, y, lerp(22, 46, u), { flip: lerp(0, Math.PI * 4.5, u), glint: .5 });
        continue;
      }
      // the card opens out of the coin's edge (width from 0), then folds into the top edge of the test card
      const op = expoOut(span(t, t0 + .75, t0 + 1.3)), w = CARD_W * op * (1 - fold * .2), h = lerp(CARD_H, 6, fold);
      const cx = lerp(tx, lerp(x0 + 60, x0 + F.TEST.w * TC_AT[2] - 60, i / 2), fold), cy = lerp(ty, top + 3, fold);
      if (fold >= .999) continue;
      ctx.save(); ctx.translate(cx, cy); ctx.scale(Math.max(.001, w / CARD_W), h / CARD_H);
      F.qcard(ctx, t, -CARD_W / 2, -CARD_H / 2, CARD_W, CARD_H, F.QUOTES[CARD_Q[i]], span(t, t0 + .8, t0 + 1.8) * (1 - fold), { size: CARD_Q[i] === 'pointless' ? 46 : 32 });
      ctx.restore();
      if (op < 1) E.halo(ctx, cx, cy, 90, .5 * (1 - op));
    }
    ctx.restore();
  };

  // warehouse robots running through line 1 of the card (1.11), clipped to the line
  const onLine = (ctx, t) => (i, [x, y, w, h]) => {
    if (i !== 0 || TT.glow1 == null || t < TT.glow1) return;
    const u = expoOut(span(t, TT.glow1 + .2, TT.glow1 + 1.0)) * (TT.away != null ? 1 - span(t, TT.away - .2, TT.away + .3) : 1);
    if (u <= 0) return;
    ctx.beginPath(); ctx.rect(x - 20, y - 6, w + 40, h + 6); ctx.clip();
    for (let k = 0; k < 6; k++) { const ph = ((t - TT.glow1) * .09 + k / 6) % 1; ctx.save(); ctx.globalAlpha *= u; F.rover(ctx, t, x - 20 + ph * (w + 40), y + h - 4, 28, { ph: k }); ctx.restore(); }
  };

  // ---------------------------------------------------------------- draw
  return (ctx, t) => {
    if (t >= tPlate) { S.plateCondition(ctx, t, T); return; }
    const c = cam(t);
    const onHill = t < tf || (t >= tS1 && t < tS2);
    if (onHill) {
      const st = hill(t, c);
      S.hillWorld(ctx, c, t, st);
      if (t < tf) {
        hookCoin(ctx, c, t);
        F.title(ctx, t, 100, 330, 1, { out: span(t, a.every - .5, a.every + .5) });
        // the X post in full from 0:01 (faktencheck 3a: the cut "saving money is pointless" is fair only with the full wording on screen)
        const qx = F.QUOTES.x, qu = F.rise(span(t, .75, 1.6)) * (1 - expoIn(span(t, a.every - .6, a.every - .1)));
        if (qu > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
          qx.lines.forEach((l, i) => F.maskLine(ctx, [[(i ? '' : '“') + l + (i ? '”' : ''), 0]], 104, 640 + i * 44, 34, F.rise(span(t, .75 + i * .15, 1.6 + i * .15)) * (1 - expoIn(span(t, a.every - .6, a.every - .1))), {}));
          ctx.restore(); }
        F.source(ctx, t, 1.0, a.every - .1, F.SOURCES.x, { x: 104, y: 748 });
        E.lightFlood(ctx, smooth(span(t, tf - 1.0, tf)));
      } else {
        F.questionLine(ctx, t, a.savings - .3, tFold - .2, { text: 'What would have to be true?', x: 96, y: 236, size: 76, warm: 0 });
        cards(ctx, c, t);
        F.testCard(ctx, t, T, { at: TC_AT, onLine: onLine(ctx, t) });
        F.source(ctx, t, tCard[0] + 1, tFold, 'MOONSHOTS PODCAST · THE ECONOMIST · X', { x: 96, y: 680 });
      }
    } else {
      S.streetWorld(ctx, c, t, street(t));
      if (t < tf + 1.2) E.lightFlood(ctx, 1 - smooth(span(t, tf, tf + 1.2)));
      if (t >= tS2) {
        F.source(ctx, t, a.podcast + .3, C1.start - .4, F.SOURCES.moonshots);
        const m0 = E.project(c, S.Z_ROOM, S.MONITOR.x, S.MONITOR.y), m1 = E.project(c, S.Z_ROOM, S.MONITOR.x + S.MONITOR.w, S.MONITOR.y + S.MONITOR.h);
        const morph = span(t, C1.start - .65, C1.start) * (1 - span(t, C1.end, C1.end + .7));
        if (morph > 0 && m0 && m1) F.clipPlate(ctx, t, T, 'C1', { from: { x: m0[0], y: m0[1], w: m1[0] - m0[0], h: m1[1] - m0[1] }, morph });
      }
    }
  };
}
