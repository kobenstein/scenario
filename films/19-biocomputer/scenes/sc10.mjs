// c10 · Seth · embedded ethics (Johns Hopkins) · Hartung (C3) · what now? · T.G('Still, some researchers') → T.G('At the start, the question')
// Builder B3. Plan: docs/shots.md 10.01–10.04 · kit: lib/f19_kit.mjs · B3 set: lib/f19_b3_world.mjs (same places as c01).
// ONE entry, one camera in the aisle (THE RACK, anchor): from C_AISLE (= c09's last frame) a bee flies in and lands on the open drawer
// (the box is still smaller than its brain). Anil Seth: the camera leans in over the drawer, the dish warms on "lab-grown brain
// tissue"; on "the next ChatGPT" the screen on its stand wakes with a small cool chat bubble (dimmer than the dish). Johns Hopkins:
// ethicists, scientists and the public (you among them) gather round the open drawer: EMBEDDED ETHICS. The camera trucks into the
// screen (CLIP_RECT): C3 Thomas Hartung. The screen goes dark; the camera swings back over the drawer (the bee on it, WHAT NOW? on the
// ladder) and tilts straight down into the dish: the dish field (C_TOP) = the c11 seam.
//
// | ID    | anchor (word)                         | picture (one idea)                                           | 1–2 moves           |
// |-------|---------------------------------------|--------------------------------------------------------------|---------------------|
// | 10.01 | Anil Seth · lab-grown · ChatGPT        | the alive rack, a bee lands on the drawer; dish warm vs chat bubble cool | bee · lean in |
// | 10.02 | Johns Hopkins · Ethicists · embedded   | three groups gather round the open drawer: EMBEDDED ETHICS   | people walk in      |
// | 10.03 | [C3] Here's Thomas Hartung             | ORIGINAL FOOTAGE in the screen on its stand                  | truck into screen   |
// | 10.04 | what do we do now · bee's brain        | out of the screen, over the drawer and the bee, down into the dish | swing + tilt  |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f19_kit.mjs';
import * as B from '../lib/f19_b3_world.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, halo } = E;
const { cam, camAt, view, proj, bill, COOL, bump } = F;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0, n = 0) => T.G(p, n, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.T0 = R.a; a.end = R.b;
  a.seth = G('Anil Seth', a.T0); a.worries = G('worries more', a.seth); a.lab = G('lab-grown brain', a.seth); a.chat = G('next ChatGPT', a.seth);
  a.jh = G('At Johns Hopkins', a.seth); a.start = G('from the very start', a.jh); a.ethicists = G('Ethicists, scientists', a.jh);
  a.sci = G('scientists', a.ethicists); a.pub = G('the public', a.ethicists); a.together = G('think it through', a.ethicists); a.emb = G('embedded ethics', a.jh);
  a.here = G("Here's Thomas", a.jh); a.c3 = F.clipWin(T, 'C3');
  a.what = G('So what do we do now', a.here); a.beeB = G("bee's brain", a.what);
  return [{ t: R.a, draw: scene(a, T), print: F.PRINT19 }];
};

// ===================================================================================================== cameras + the people
const C_SETH = cam({ tx: 20, ty: 1400, tz: -640, d: 1500, p: -.36 });     // leaning in over the open drawer (the bee, the dish)
const C_CHAT = cam({ tx: 330, ty: 1240, tz: -620, d: 2650, p: -.16 });     // the drawer left of centre, the screen right
const C_ETH = cam({ tx: 60, ty: 1250, tz: -1000, d: 3700, p: -.3 });       // wide: the gathering round the drawer
// the gathering (world X, Z where they stop; from: where they walk in from; long = lab coat). dir faces the drawer.
const PEOPLE = [
  { k: 'eth', x: -520, z: -1000, from: -2900, h: 1700 },
  { k: 'eth', x: -760, z: -1250, from: -3100, h: 1640 },
  { k: 'sci', x: 430, z: -980, from: 2900, h: 1760, long: true },
  { k: 'sci', x: 650, z: -1220, from: 3100, h: 1680, long: true },
  { k: 'pub', x: -1350, z: -1600, from: -3300, h: 1660 },
];

function scene(a, T) {
  const T0 = a.T0, c3 = a.c3;
  const tLand = a.T0 + 2.6;                                      // the bee lands on the drawer
  const tMon = c3.start - .15;                                   // the screen's content rect sits on CLIP_RECT
  const tOut0 = c3.end + .35, tTop = a.end;                       // swing back + tilt down into the dish
  const walkT = { eth: a.ethicists - .5, sci: a.sci - .3, pub: a.pub - .35 };
  const K = [
    [T0, B.C_AISLE], [a.worries + .6, C_SETH],
    [a.chat - .7, C_SETH, 's'], [a.jh + .2, C_CHAT],
    [a.start - 1.2, C_ETH],
  ];
  const tTr0 = a.here - .55;                                     // the truck into the screen: target first, then the push
  const camNow = (t) => {
    if (t >= tOut0) return B.camSplit(B.C_MON, B.C_TOP, span(t, tOut0, tTop), [0, .7], [.2, 1]);
    if (t >= tTr0) return B.camSplit(C_ETH, B.C_MON, span(t, tTr0, tMon), [0, .55], [.25, 1]);
    return camAt(t, K);
  };
  // breath: none at both seams and while the screen holds CLIP_RECT
  const hold = (t) => smooth(span(t, tMon - .9, tMon)) * (1 - smooth(span(t, tOut0, tOut0 + 1)));
  const dAmt = (t) => B.driftAmt(t, [tTop], .35, 1.2) * (1 - hold(t));   // full drift through the c09|c10 seam: both sides call camDrift(C_AISLE, t, .35) there

  return (ctx, t) => {
    const c = F.camDrift(B.seamGlide(camNow(t), t, T0), t, dAmt(t)), v = view(c);
    const desc = smooth(span(t, tOut0 + .6, tTop));               // the swing down: the aisle sinks into night round the dish
    const dark = smooth(span(t, tOut0 + 1.6, tTop - .45));
    const warm = bump(t, a.lab - .2, 2.6);                        // "lab-grown brain tissue": the dish warms
    const kf = smooth(span(t, tOut0 + 1, tTop - .2));
    const dishO = { glow: lerp(B.DISH_AISLE.glow, B.DISH_FIELD.glow, kf) * (1 + .5 * warm), chip: lerp(1, .5, kf), electrodes: lerp(.6, .25, kf), rim: lerp(1, .7, kf) };
    F.hall(ctx, v, t, { pool: 1 - desc });
    const out = F.rack(ctx, v, t, { open: F.OPEN, slide: 1, glow: (1 - desc) * (1 + .35 * warm), net: { ...B.NET_STD, lit: 1 + .25 * warm }, dishO, seam: 1 });
    screen(ctx, t, v);
    people(ctx, t, v);
    bee(ctx, t, v);
    labels(ctx, t, v);
    if (dark > 0) {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = dark; B.night(ctx); ctx.restore();
      const m = out.dish && out.dish.map; if (m) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.dish(ctx, t, m, { ...dishO, net: B.NET_STD }); ctx.restore(); }
    }
    F.ladder(ctx, t, T);
  };

  // ---- the bee: flies in from the right on an arc, lands on the drawer's front edge; rests (wings breathe); stays to the end
  function bee(ctx, t, v) {
    const u = span(t, T0 + .3, tLand); if (u <= 0) return;
    const e = sineIO(u), X1 = B.BEE.X, Y1 = B.FRONT.Y, Z1 = B.FRONT.Z - 12;
    const X = lerp(1900, X1, e) + Math.sin(e * Math.PI) * -120, Y = lerp(1950, Y1, e) + Math.sin(e * Math.PI) * 260 + (1 - e) * 30 * Math.sin(t * 9), Z = lerp(-1500, Z1, e);
    const settle = bump(t, tLand - .05, .35) * 6;
    B.bee(ctx, t, v, X, Y - settle, Z, { fly: 1 - smooth(span(t, tLand - .15, tLand + .2)), rot: (1 - e) * -.25 });
  }
  // ---- the screen on its stand: dark; a cool chat bubble on "the next ChatGPT"; powers on for C3; dark after
  function screen(ctx, t, v) {
    const r = F.monitor(ctx, v, t, B.MON.X, B.MON.Y, B.MON.Z, B.MON.w);
    if (!r || r[2] < 8) return;
    // the chatbot: the screen glows faintly cool, a bubble grows from its tail (dimmer than the warm dish), then the screen sleeps
    const ch = smooth(span(t, a.chat - .5, a.chat + .1)) * (1 - smooth(span(t, a.jh + .3, a.jh + 1.1)));
    if (ch > 0) {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(r[0], r[1], r[2], r[3]); ctx.clip();
      ctx.fillStyle = E.rad(ctx, r[0] + r[2] / 2, r[1] + r[3] / 2, r[2] * .7, [[0, rgba(COOL.deep, .5 * ch)], [1, rgba(P.night0, 0)]]); ctx.fillRect(r[0], r[1], r[2], r[3]);
      B.chatBubble(ctx, t, r[0] + r[2] / 2, r[1] + r[3] * .47, r[3] * .3, { u: span(t, a.chat - .25, a.chat + .5), a: ch });
      ctx.restore();
    }
    const on = smooth(span(t, c3.start - .5, c3.start + .05)) * (1 + .25 * bump(t, c3.start - .55, .2));
    if (on <= 0) return;
    const dk = smooth(span(t, c3.end - .1, c3.end + .45));
    F.clipPlate(ctx, t, T, 'C3', { rect: r, on: Math.min(1, on), dark: dk, credits: true });
  }
  // ---- the people: you (yellow, the public) stand left; ethicists walk in from the left, scientists from the right, one more of
  // the public from the back left; they stop round the open drawer, face it, breathe; on "think it through" they lean in a little
  function people(ctx, t, v) {
    const list = [];
    for (const p of PEOPLE) {
      if (t > c3.start) break;                                    // they walk off while the clip runs (off-screen)
      const t0 = walkT[p.k] + (p.from < 0 ? 0 : .15) + (p.k === 'eth' && p.x > -500 ? .35 : 0) + (p.k === 'sci' && p.x > 300 ? .3 : 0);
      const dist = Math.abs(p.from - p.x), dur = dist / 1250;    // ~1.25 m/s
      const u = span(t, t0, t0 + dur); if (u <= 0) continue;
      const e = 1 - (1 - u) * (1 - u) * .15 - .85 * (1 - u) * (1 - u) * (1 - u) * 0, X = lerp(p.from, p.x, sineIO(u) * .25 + u * .75);
      const walking = u < 1, ph = (t - t0) * 5.6 + (Math.PI - dur * 5.6) % (2 * Math.PI);   // the stride ends with the feet together; they then keep that relaxed-knee stance (no walk->stand snap)
      list.push({ z: p.z, draw: () => bill(ctx, v, X, 0, p.z, () => {
        const lean = .025 * smooth(span(t, a.together - .2, a.together + .8)) * (1 - smooth(span(t, a.emb + 1, a.emb + 2)));
        E.person(ctx, 0, 0, p.h, { dir: X < 0 ? 1 : -1, view: 'side', walk: walking ? ph : Math.PI + .04 * Math.sin(t * .9 + p.x), long: p.long, lean, look: .1 * Math.sin(t * .4 + p.x), rim: mixHex(P.blue0, P.halo1, .45) });
      }) });
    }
    // you: a step closer on "the public", then you look at the drawer
    const st = sineIO(span(t, a.pub - .3, a.pub + 1.2)), yx = lerp(B.YOU.X, -1000, st), yz = lerp(B.YOU.Z, -1200, st);   // stays behind the ethicist (no draw-order flip)
    if (t <= c3.start) list.push({ z: yz, draw: () => B.youAisle(ctx, t, v, { x: yx, z: yz, look: lerp(-.15, -.05, st), walk: st <= 0 ? undefined : st < 1 ? st * 3 * Math.PI : Math.PI + .04 * Math.sin(t * .8), on: .45 }) });
    list.sort((p, q) => q.z - p.z).forEach((p) => p.draw());
  }
  // ---- labels: ANIL SETH · NEUROSCIENTIST (top left, rises from its baseline); JOHNS HOPKINS on the rack top; EMBEDDED ETHICS
  function labels(ctx, t, v) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const su = F.rise(span(t, a.seth - .15, a.seth + .6)) * (1 - expoIn(span(t, a.lab, a.lab + .5)));
    if (su > 0) {
      const nw = F.maskLine(ctx, [['Anil Seth', 0]], 150, 190, 54, su, { glow: true });
      F.maskLine(ctx, [['NEUROSCIENTIST', 0]], 152, 232, 22, F.rise(span(t, a.seth + .1, a.seth + .8)) * (1 - expoIn(span(t, a.lab, a.lab + .5))), { serif: false, col: P.halo2, glow: false, weight: 600 });
    }
    const ju = F.rise(span(t, a.jh, a.jh + .8)) * (1 - expoIn(span(t, a.ethicists - .2, a.ethicists + .3)));
    if (ju > 0) { const p = proj(v, F.RACK.hw, 1720, 0); if (p) B.label(ctx, t, p[0] + 6, p[1] - 6, 'JOHNS HOPKINS', null, ju, { w: 270 }); }
    const eu = F.rise(span(t, a.emb - .15, a.emb + .7)) * (1 - expoIn(span(t, a.here + .2, a.here + .7)));
    if (eu > 0) F.maskLine(ctx, [['EMBEDDED ETHICS', 1]], 960, 190, 70, eu, { align: 'center' });
    ctx.restore();
  }
}
