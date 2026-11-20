// c01 · Hook · THE NIGHT FOUNDRY · thumbnail A (the ladder of light rises into the core, SUPERHUMAN AI: 2027, you tiny at its foot) ·
// SOME INSIDERS' FORECAST · your lamp goes OFF, the foundry keeps building · the thread from the A.I. you use to the next one · 9 OF 10 ·
// people steer, the machine builds · HOW CLOSE? · the forecast moves to 2027, all six · ≈ 30,000 agents, a town of windows →
// plateLadder (lib/f31_world.mjs) at 'Picture a ladder'.
// 0 → T.G('Picture a ladder') · built by the lead (quality reference). Plan: docs/shots.md H.01–H.09 · world: docs/MOTION.md
// ONE entry, one world, one continuous camera (the explainers float over a night veil; the camera keeps gliding behind it).
//
// | ID    | anchor (phrase)              | picture (one idea)                                                          | camera                 |
// |-------|------------------------------|-----------------------------------------------------------------------------|------------------------|
// | H.01★ | You may be using             | THUMBNAIL A: the ladder of gold light into the core; you at its foot; title | slow push up · SCENE   |
// | H.02  | Some insiders now forecast   | SOME INSIDERS' FORECAST under the title; the core swells on "superhuman"     | push · MIX             |
// | H.03  | When you turn off the light  | title sinks; the lamp flickers and goes OFF on "off"; pull back: the foundry | pull back 2.6 s · WORLD|
// | H.04  | Because A.I. is now building | the thread lights; THE A.I. YOU USE · THE NEXT A.I.                         | truck left · MIX       |
// | H.05  | At one leading lab           | veil; ten change cards, nine turn gold: 9 OF 10                             | creep · EXPL           |
// | H.06  | People steer                 | the cream card lifts (PEOPLE STEER), the nine pulse (THE MACHINE BUILDS)    | creep · EXPL           |
// | H.07  | So how close is              | veil lifts; glide up the ladder to the ring; the tag HOW CLOSE? drops       | glide up · MIX         |
// | H.08★ | Close enough that last week  | the tag's thread draws the rail; six dots slide from 2028–30 into 2027      | creep · EXPL           |
// | H.09  | Inside that same lab         | the night town of agents, ≈ 30,000; its windows become the hall windows     | to LADDER_CAM · EXPL   |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f31_kit.mjs';
import * as S from '../lib/f31_world.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, smooth } = E;
const { rise, FORGE, F0 } = F;

export const PRINT = F.PRINT31;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.ins = G('Some insiders'); a.sup = G('superhuman', a.ins); a.next = G('next year', a.ins);
  a.turn = G('When you turn off'); a.off = G('off', a.turn + .2); a.because = G('Because A.I. is now'); a.nextAI = G('the next A.I.', a.because);
  a.lab = G('At one leading lab'); a.nine = G('nine out of', a.lab); a.written = G('written by its own', a.lab); a.ownAI = GE('A.I.', a.written);
  a.steer = G('People steer'); a.builds = G('The machine builds');
  a.how = G('So how close is'); a.ctrl = G('no one at the controls', a.how);
  a.close = G('Close enough'); a.moved = G('moved their date', a.close); a.notLater = G('Not later', a.close); a.earlier = G('Earlier', a.notLater);
  a.y2027 = G('To twenty twenty-seven', a.earlier); a.y2027e = GE('twenty twenty-seven', a.earlier); a.all = G('All of them', a.earlier);
  a.inside = G('Inside that same lab'); a.thirty = G('thirty thousand', a.inside); a.town = G('A small town', a.inside); a.none = G('None of them human', a.inside);
  a.end = R.b;
  return [{ t: 0, draw: scene(a, T), print: PRINT }];
};

const HALL = (u, v, s) => E.aim(S.Z_HALL, u, v, s);
const MACHC = (u, v, s) => E.aim(S.Z_MACH, u, v, s);
const CS = { x: 300, y: 420, w: 1320 };                  // the code-share row (screen)
const TL = { x: 230, y: 560, w: 1460 };                  // the timeline (screen)
const SW = { x: 330, y: 560, w: 1260, h: 290 };          // the swarm (screen)
const DOTS = [[2028.45, 2027.36, 110], [2028.95, 2027.46, 160], [2029.35, 2027.58, 85], [2029.8, 2027.7, 140], [2028.7, 2027.8, 60], [2030.2, 2027.9, 190]];

function scene(a, T) {
  const tPlate = a.end - S.SEAM_HALF, tCreep = tPlate - 2.6;
  // ---------------------------------------------------------------- the camera (one take)
  const K = [
    [0, S.HOOK_CAM(1)], [a.turn - .2, S.HOOK_CAM(1.07, 12)], [a.off + .45, S.HOOK_CAM(1.085, 16)],
    [a.off + 3.2, HALL(1010, 480, .76)], [a.because + 2.8, HALL(900, 470, .8)], [a.how - .1, HALL(930, 455, .83)],
    [a.how + 3.2, HALL(1060, 330, .9)], [a.close + 1.5, HALL(1070, 320, .92)],
    [a.inside, HALL(980, 500, .82)],
  ];
  const creepCam = (t) => { const k = 1 + S.CREEP * (t - tPlate); return S.LADDER_CAM(k, S.trk(k) * .4); };
  const KALL = [...K, [tCreep, creepCam(tCreep)]];
  const camRaw = (t) => (t < tCreep ? F.camPath(t, KALL) : creepCam(t));
  const cam = (t) => E.camDrift(camRaw(t), t, 1 - smooth(span(t, tPlate - 2.2, tPlate)), 5);

  // ---------------------------------------------------------------- the light: lamp, core, ladder
  // the lamp: on → a short flicker (anticipation) → OFF on "off" (a hard accent: 2 frames)
  const tOff = a.off + .12;
  const lamp = (t) => (t < tOff - .42 ? 1 : t < tOff ? .55 + .45 * Math.abs(Math.sin((t - tOff) * 40)) : t < tOff + .07 ? .25 : 0);
  const coreGlow = (t) => 1 + .35 * F.bump(t, a.sup - .1, 1.3) + .15 * F.bump(t, a.nextAI - .2, 1.4);
  const hall = (t) => lerp(.35, .7, smooth(span(t, a.off + .4, a.off + 3)));
  const youPose = (t) => ({ look: lerp(.85, .35, sineIO(span(t, a.off - .6, a.off + .3))) + .45 * sineIO(span(t, a.off + 1.2, a.off + 2.4)) });

  // ---------------------------------------------------------------- explainer phases (veil, cards, timeline, swarm)
  const vCode = (t) => sineIO(span(t, a.lab - .2, a.lab + .9)) * (1 - sineIO(span(t, a.how - .1, a.how + 1.1)));
  const vTime = (t) => sineIO(span(t, a.close - .1, a.close + 1.0)) * (1 - sineIO(span(t, tPlate - 1.8, tPlate - .1)));
  const veilA = (t) => .84 * Math.max(vCode(t), vTime(t));
  const codeU = (t) => span(t, a.lab + .1, a.lab + 1.4) * (1 - sineIO(span(t, a.how - .2, a.how + .6)));
  const codeP = (t) => sineIO(span(t, a.nine - .1, a.ownAI + .1));
  const tagU = (t) => span(t, a.how + 1.6, a.how + 2.7);
  const railU = (t) => span(t, a.close + .1, a.close + 1.6);
  const slide = (t) => sineIO(span(t, a.earlier - .05, a.y2027e + .1));
  const tlOut = (t) => sineIO(span(t, a.inside - .3, a.inside + .9));
  const swU = (t) => span(t, a.inside + .2, a.inside + 2.0);
  const swOut = (t) => sineIO(span(t, tPlate - 2.9, tPlate - 1.7));   // the town sinks first, then the veil lifts

  // ---------------------------------------------------------------- one frame
  return (ctx, t) => {
    if (t >= tPlate) { S.plateLadder(ctx, t, T); return; }
    const c = cam(t);
    const hookGlow = 1;   // the ladder stays pure light through the hook; B1 cools it
    const out = S.foundry(ctx, c, t, {
      lamp: lamp(t), hall: hall(t), carts: .4 + .4 * span(t, a.off, a.off + 3),
      machine: { glow: coreGlow(t), build: .72 },
      builders: { work: .6 + .4 * span(t, a.off, a.off + 1.5) },
      old: { a: lerp(.45, 1, span(t, a.turn, a.off + 2)), thread: span(t, a.because + .2, a.nextAI + .6), glow: .6 },
      ladder: { glow: hookGlow },
      you: { o: youPose(t) },
      front: (cx) => {   // H.07: the tag HOW CLOSE? drops from the ring on a gold thread (machine card coordinates)
        const u = tagU(t) * (1 - span(t, a.close + .2, a.close + .9)); if (u <= 0) return;
        F.priceTag(cx, t, S.MACH.x + S.MACH.r * .62, S.MACH.y + S.MACH.r * .8, 'HOW CLOSE?', u, { len: 210, size: 34 });
      },
    });
    // H.04: the two labels (screen space, pinned to the two machines)
    const lu = span(t, a.because + .5, a.because + 1.4) * (1 - span(t, a.lab - .3, a.lab + .2));
    if (lu > 0) {
      const o = S.oldAt(c), m = S.machineAt(c);
      if (o) F.goldLabel(ctx, o[0] + o[2] * .7, o[1] - o[2] * .7, 'THE A.I. YOU USE', '', lu, { dx: 40, dy: -60, size: 26 });
      if (m) F.goldLabel(ctx, m[0] - m[2] * 1.02, m[1] + m[2] * .55, 'THE NEXT A.I.', '', span(t, a.nextAI - .2, a.nextAI + .7) * (lu > 0 ? 1 : 0), { dx: -50, dy: 60, size: 26 });
    }
    // the veil and the explainers
    F.veil(ctx, veilA(t));
    // H.05 / H.06: nine of ten
    const cu = codeU(t);
    if (cu > 0) {
      ctx.save(); F.float(ctx, t, 1); ctx.translate(0, (1 - expoOut(clamp(cu * 1.4))) * 40);
      const box = F.codeShare(ctx, t, CS.x, CS.y, CS.w, { u: cu, p: codeP(t), big: '9 OF 10', sub: 'CHANGES TO THE LAB\'S CODE, WRITTEN BY ITS OWN A.I.' });
      if (box) {   // the human card lifts on "People steer", the nine pulse on "The machine builds"
        const cw = (CS.w - CS.w * .018 * 9) / 10, hx = CS.x + 9 * (cw + CS.w * .018) + cw / 2;
        const su = span(t, a.steer - .1, a.steer + .6), bu = span(t, a.builds - .1, a.builds + .6);
        if (su > 0) { E.halo(ctx, hx, CS.y + box.h / 2, cw * 1.3, .35 * su * (1 - .5 * bu), P.halo2, P.cream); F.goldText(ctx, [['PEOPLE STEER', 0]], hx + cw / 2, CS.y + box.h + 120, 30, rise(su), { serif: false, weight: 600, align: 'right', spacing: .1 }); }
        if (bu > 0) { for (let i = 0; i < 9; i++) E.halo(ctx, CS.x + i * (cw + CS.w * .018) + cw / 2, CS.y + box.h / 2, cw * .9, .25 * F.bump(t, a.builds + i * .06, .9), FORGE.halo, FORGE.hot);
          F.goldText(ctx, [['THE MACHINE BUILDS', 1]], CS.x, CS.y + box.h + 120, 30, rise(bu), { serif: false, weight: 600, spacing: .1 }); }
      }
      ctx.restore();
      F.source(ctx, t, a.nine, a.how, F.SOURCES.code);
    }
    // H.08: the forecast: six dots slide from 2028–30 into the 2027 band
    const ru = railU(t), to = tlOut(t);
    if (ru > 0 && to < 1) {
      const nudge = .14 * F.bump(t, a.notLater, .9);   // "Not later": a small move the wrong way (anticipation) before "Earlier"
      ctx.save(); F.float(ctx, t, 1); ctx.beginPath(); ctx.rect(0, 0, W, 880); ctx.clip(); ctx.translate(0, to * 700);
      F.forecast(ctx, t, TL.x, TL.y, TL.w, {
        u: ru, title: 'A.I. THAT DOES THE RESEARCH ITSELF · WHEN?', now: 2026.88, band: [2027.0, 2027.99], bandU: span(t, a.y2027 - .1, a.y2027 + .9),
        marks: DOTS.map(([f, tt, dy], i) => ({ from: f + nudge, to: tt, p: clamp(slide(t) * 1.3 - i * .06), dy })),
      });
      const al = span(t, a.all - .1, a.all + .7);
      if (al > 0) F.goldText(ctx, [['ALL SIX FORECASTERS', 1]], TL.x + TL.w * .3, TL.y + 150, 34, rise(al), { serif: false, weight: 600, spacing: .1, align: 'center' });
      ctx.restore();
      F.source(ctx, t, a.y2027, a.inside, F.SOURCES.forecast6);
    }
    // H.09: the town of agents (it sinks into the floor as the veil lifts: its windows hand over to the hall's windows)
    const su = swU(t), so = swOut(t);
    if (su > 0 && so < 1) {
      ctx.save(); F.float(ctx, t, 1); ctx.beginPath(); ctx.rect(0, 0, W, 880); ctx.clip(); ctx.translate(0, so * 520);
      F.swarm(ctx, t, SW.x, SW.y, SW.w, SW.h, { u: su, count: span(t, a.thirty - .3, a.thirty + 1.6), sub: 'A.I. AGENTS AT WORK, AT ANY MOMENT', seed: 3000 });
      const nu = span(t, a.none - .05, a.none + .7);
      if (nu > 0) F.goldText(ctx, [['NONE OF THEM HUMAN', 0]], SW.x + SW.w, SW.y - 150, 30, rise(nu), { serif: false, weight: 600, spacing: .1, align: 'right' });
      ctx.restore();
      F.source(ctx, t, a.thirty, tPlate - .6, F.SOURCES.agents);
    }
    // H.01 / H.02: the title (frame 0 = thumbnail A) and the forecast line under it
    F.title(ctx, t, 1, { lines: ['SUPERHUMAN', 'AI: 2027'], y: 430, maxW: 760, out: span(t, a.turn - .1, a.turn + 1.7), sub: F.SOURCES.insiders, subU: rise(span(t, a.ins - .1, a.ins + .8)) * (1 - E.expoIn(span(t, a.turn - .1, a.turn + .6))) });
  };
}
