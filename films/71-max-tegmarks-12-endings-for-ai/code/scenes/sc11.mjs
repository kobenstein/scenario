// Film 71 · c11 (B2): ENDING 2/12 PROTECTOR GOD. One continuous take, no cut (docs/shots.md 2.01 – 2.15):
//   (c10 flew through the garden gate) SCENARIO, the morning street: you walk to the crossing, a car brakes by itself, the walk light
//   switches; you cross and stand in the sun → tilt up: a faint ring in the sky ducks behind a cloud: PROTECTOR GOD; faint threads reach down
//   to the street and pull back, the ring dims ("doubt it exists") → a small cloud buds off the big one and becomes a chat window ("a small
//   version"): the chat's patterns flow into an estimate AGE: ? · switch tag JAN 20, 2026 · OpenAI → AGE: NOT SURE → UNDER-18 SETTINGS → the
//   lever under it; a hand pushes it the other way → a sign flips open over the chat: I AM A MACHINE · SWITCH PUSHED BACK: AUG 2, 2026 ·
//   EU AI ACT, ARTICLE 50 → back to the cloud: the ring peeks out behind it → ★ a hand pulls the cloud away, the ring stands lit in the open →
//   tilt up into the night: the row, eleven doors tagged, one not (the gold door) → it brightens at rank 1: RANKING: OURS → the reader
//   survey (top line covered; LIBERTARIAN UTOPIA visible) → the covered line flies into door 1's mini tag → plateRow(1).
// One coordinate system: the street (ground line GY 700) with its sky above; the row (standard row coords) sits above the sky: street =
// row + O11. The yard is drawn in row coords everywhere, so the plate's yard is the same yard.
import * as F from '../lib/f71_kit.mjs';
import * as S from '../lib/f71_world.mjs';
import * as B from '../lib/b2_extra.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, GOLD, CREAM, COOL, PAPER, LAMP, TXT } = F;
const TAU = Math.PI * 2;

export const O11 = { x: 0, y: -2400 };
const GY = 700;
const RING0 = [1480, -610], RING = [1200, -565], RING_R = 130, CLOUD = [1190, -380], CLOUD_S = 200;
const CHAT = { x: 1820, y: -640, w: 560, h: 380 }, CHC = [CHAT.x + CHAT.w / 2, CHAT.y + CHAT.h / 2];
const PLATE = { x: 2620, y: -612, w: 480 }, LEV = [2700, -290], SIGN = { x: CHC[0], y: -812, w: 460 }, TAGP = [2350, -760], TAGB = [2650, -735];
const SKYINK = mixHex(COOL.halo, P.blue1, .72);
const SURV = { x: 180, y: 150, w: 640 };
const rowS = (vL) => ({ x: vL.x + O11.x, y: vL.y + O11.y, s: vL.s });

export function anchors11(T) {
  const a = T.G('You wake up, and things just work out');
  const G = (p, n = 0, af = a - .1) => T.G(p, n, af);
  return {
    a, acc: G("The accident doesn't happen"), luck: G('You call it luck'), never: G('You never find out why'),
    teg: G('Tegmark calls it the Protector'), god: G('Protector God'), looks: G('looks after us'), hides: G('and hides so well'), doubt: G('doubt it exists'),
    small: G('A small version is already'), jan: G('Since January, ChatGPT'), age: G('estimates your age'), behave: G('how you behave'),
    unsure: G("If it's unsure"), teen: G('like a teenager'), eu: G('Europe pushed the switch'), aug: G('Since August, its law'),
    talks: G('a machine that talks'), say: G("has to say it's a machine"), hide: G("Tegmark's protector must hide"), illegal: G('Europe just made hiding illegal'),
    hiding: G('hiding illegal'), one: G('One ending left'), best: G('The best, by our count'), readers: G("And the one Tegmark's readers"), picked: G('picked most often'),
    b: T.G('Egalitarian Utopia', 0, a),
  };
}

// the whole c11 world as a function of time (c10 draws it through the garden gate and over the seam)
export function street11(T) {
  const A = anchors11(T), PL = A.b - S.SEAM_HALF;
  // ---------------------------------------------------------------- the street (2.01 – 2.03)
  const W0 = A.a - .3, W1 = A.acc - .2, C0 = A.acc - .1, C1 = A.luck - .1;
  const youAt = (t) => {
    const x = lerp(690, 1110, sineIO(span(t, W0, W1))), cu = sineIO(span(t, C0, C1)), y = lerp(GY + 330, GY + 50, cu), h = lerp(330, 235, cu);
    const walk = t > W0 && t < W1 ? (x - 690) / 250 * TAU : t > C0 && t < C1 ? (GY + 330 - y) / 120 * TAU : undefined;
    const look = .2 + .25 * span(t, A.luck, A.luck + .6);
    return { x, y: y - 6 * Math.sin(Math.PI * span(t, A.luck + .05, A.luck + .45)), h, walk, view: t > (W1 + C0) / 2 && t < C1 ? 'back' : undefined, dir: 1, look };
  };
  const BR0 = A.acc - .3, BR1 = A.acc + .25, VC = 900, XS = 985;
  const carX = (t) => { if (t >= BR1) return XS; const dB = BR1 - BR0; if (t >= BR0) { const q = t - BR0; return XS - VC * dB / 2 + VC * (q - q * q / (2 * dB)); } return XS - VC * dB / 2 - VC * (BR0 - t); };
  // ---------------------------------------------------------------- the sky (2.04 – 2.05, 2.11 – 2.12)
  const pullU = (t) => span(t, A.hiding - .05, A.hiding + .5);
  const ringAt = (t) => {
    const d = sineIO(span(t, A.never + .9, A.never + 1.8)), pk = Math.sin(Math.PI * span(t, A.hide + .4, A.hide + 2.2)), lit = expoOut(span(t, A.hiding + .1, A.hiding + 1.0));
    const x = lerp(lerp(RING0[0], RING[0], d), 1220, lit), y = lerp(lerp(RING0[1], RING[1], d), -480, lit) - 26 * pk;
    const a = (.95 - .35 * sineIO(span(t, A.doubt, A.doubt + .9)) + .35 * sineIO(span(t, A.hide, A.hide + .8))) * (1 - lit) + lit;
    return { x, y, r: lerp(RING_R, 158, lit), a, lit };
  };
  function sky(ctx, t) {
    ctx.fillStyle = F.lin(ctx, 0, -1200, 0, -560, [[0, mixHex(P.night0, P.night1, .5)], [1, rgba(mixHex(P.night0, P.night1, .5), 0)]]); ctx.fillRect(-2000, -1201, 6000, 642);
    // faint threads from behind the cloud down to the street ("looks after us"), pulled back ("and hides")
    const th = span(t, A.looks - .1, A.looks + .8) - span(t, A.hides, A.hides + .7);
    if (th > 0) for (const [x0, x1] of [[1060, 860], [1190, 1110], [1330, 1500]]) F.lightLine(ctx, [[x0, -300], [lerp(x0, x1, .5), 100], [x1, 520]], th, { w: 3, col: rgba(SKYINK, .75), dash: [6, 10], glow: false });
    const rg = ringAt(t); B.ring(ctx, t, rg.x, rg.y, rg.r, { a: rg.a, lit: rg.lit, ink: SKYINK });
    // the cloud (pulled away on 'hiding'); the hand that pulls it
    const pu = pullU(t), dx = 40 * Math.sin(Math.PI * span(t, A.hiding - .45, A.hiding - .05)) - 2200 * expoIn(pu);
    if (pu < 1) B.cloud(ctx, t, CLOUD[0] + dx, CLOUD[1], CLOUD_S);
    const hin = sineIO(span(t, A.hiding - 1.0, A.hiding - .3));
    if (hin > 0 && pu < 1) F.hand(ctx, lerp(CLOUD[0] - 1100, CLOUD[0] - 395, hin) + Math.min(0, dx), CLOUD[1] + 10, -.05, 110, { pose: t > A.hiding - .45 ? 'hold' : 'open', rim: LAMP.body });
    // the small cloud buds off and becomes the chat window (2.06)
    const sc = span(t, A.small - .1, A.small + 1.0), sg = span(t, A.small + .75, A.small + 1.35);
    if (sc > 0 && sg < 1) { const e = sineIO(sc); B.cloud(ctx, t, lerp(CLOUD[0] + 230, CHC[0], e), lerp(CLOUD[1] - 30, CHC[1], e) - 70 * Math.sin(Math.PI * e), lerp(46, 60, e) * (1 - sineIO(sg))); }
    if (sg > 0) chatWorld(ctx, t, expoOut(sg));
    F.big(ctx, F.END[2].name, 1190, -700, 64, span(t, A.god - .1, A.god + .5) * (1 - span(t, A.small - .2, A.small + .3)), { gold: 0 });
  }
  // ---------------------------------------------------------------- the chat world (2.06 – 2.10)
  const bubbleEnds = [[1, .5], [0, .68], [1, .42], [0, .6]].map(([you, f], i) => [you ? CHAT.x + CHAT.w - 28 : CHAT.x + 28 + CHAT.w * f, CHAT.y + 84 + i * 74 + 27]);
  function chatWorld(ctx, t, g) {
    ctx.save(); ctx.translate(CHC[0], CHC[1]); ctx.scale(lerp(.12, 1, g), lerp(.12, 1, g)); ctx.translate(-CHC[0], -CHC[1]);
    F.chatWindow(ctx, t, CHAT.x, CHAT.y, CHAT.w, CHAT.h, { u: 1, bubbles: [['you', .5, span(t, A.small + 1.25, A.small + 1.6)], ['ai', .68, span(t, A.small + 1.65, A.small + 2.0)], ['you', .42, span(t, A.jan + .3, A.jan + .65)], ['ai', .6, span(t, A.jan + .8, A.jan + 1.15)]] });
    ctx.restore();
    // usage patterns flow out of the chat into the estimate (2.07)
    const fl = span(t, A.age - .2, A.behave + .5);
    if (fl > 0 && fl < 1) for (let j = 0; j < 14; j++) {
      const q = span(fl, j * .05, j * .05 + .3); if (q <= 0 || q >= 1) continue;
      const [bx, by] = bubbleEnds[j % 4], e = sineIO(q), tx = PLATE.x - PLATE.w / 2 + 10, ty = PLATE.y + 60;
      const x = lerp(bx, tx, e), y = lerp(by, ty, e) - 90 * Math.sin(Math.PI * e);
      ctx.fillStyle = rgba(j % 2 ? COOL.core : CREAM, .9); ctx.beginPath(); ctx.arc(x, y, 6 * (1 - .6 * e), 0, TAU); ctx.fill();
    }
    // the estimate plate: AGE: ? → (flips) AGE: NOT SURE → UNDER-18 SETTINGS (2.08)
    const pu = span(t, A.age + .1, A.age + .6), fp = span(t, A.unsure - .15, A.unsure + .45);
    if (pu > 0) {
      const second = fp >= .5, ky = Math.abs(Math.cos(Math.PI * fp)), [l1, l2] = TXT.e2.age.split(' → ');
      const o = second ? { main: [l1, '→ ' + l2], size: 34 } : { main: ['AGE: ?'], size: 44 };
      const h = 52 + o.size * 1.25 * o.main.length + 20;
      ctx.save(); ctx.translate(0, PLATE.y + h / 2); ctx.scale(1, Math.max(.02, ky)); ctx.translate(0, -(PLATE.y + h / 2));
      F.signCard(ctx, t, PLATE.x, PLATE.y, { ...o, w: PLATE.w, u: pu }); ctx.restore();
    }
    // the lever (touched with the JAN tag; a hand pushes it back on 'Europe pushed the switch') (2.09)
    const lu = span(t, A.jan + .3, A.jan + .9);
    if (lu > 0) {
      const back = sineIO(span(t, A.eu + .35, A.eu + .85)), ang = lerp(lerp(0, -.55, sineIO(lu)), .55, back);
      ctx.strokeStyle = rgba(CREAM, .35); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(LEV[0] - 120, LEV[1] + 12); ctx.lineTo(LEV[0] + 120, LEV[1] + 12); ctx.stroke();
      const [kx, ky] = F.lever(ctx, t, LEV[0], LEV[1], ang, 110 * expoOut(lu), { knob: Math.sin(Math.PI * span(t, A.eu + .3, A.eu + 1.2)) });
      const hi = sineIO(span(t, A.eu - .2, A.eu + .35)) * (1 - sineIO(span(t, A.eu + 1.0, A.eu + 1.6)));
      if (hi > 0) F.hand(ctx, lerp(kx - 100, kx - 40, hi), lerp(ky + 210, ky + 50, hi), -1.0, 58, { pose: 'point', a: clamp(hi * 4), rim: LAMP.body });
    }
    // the sign flips open over the chat window (hinge at its lower edge) (2.10)
    const su = span(t, A.talks - .05, A.talks + .6);
    if (su > 0) {
      const h = 52 + 44 * 1.25 + 20, hy = SIGN.y + h, k = sineIO(su);
      ctx.save(); ctx.translate(0, hy); ctx.scale(1, Math.max(.02, k)); ctx.translate(0, -hy);
      F.signCard(ctx, t, SIGN.x, SIGN.y, { main: [TXT.e2.machine], size: 44, w: SIGN.w, u: 1 }); ctx.restore();
      ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(SIGN.x - 120, hy); ctx.lineTo(SIGN.x - 120, CHAT.y); ctx.moveTo(SIGN.x + 120, hy); ctx.lineTo(SIGN.x + 120, CHAT.y); ctx.stroke();
    }
  }
  // ---------------------------------------------------------------- the row (2.13 – 2.15)
  const rowLit2 = (t) => {
    const u = sineIO(span(t, A.best - .1, A.best + .7));
    const st = (m, n) => (m === n ? 1 : m > n ? .22 : .6), sc = (m, n) => (m === n ? 1.06 : 1), bm = (m, n) => (m === n ? .8 : .3);
    return { lit: (m) => lerp(st(m, 2), st(m, 1), u), scale: (m) => lerp(sc(m, 2), sc(m, 1), u), beam: (m) => lerp(bm(m, 2), bm(m, 1), u), u };
  };
  const LIFT0 = A.picked + .2, LAND = LIFT0 + 1.2, TAG1 = [F.rowX(1), F.ROW.y - F.ROW.h * 1.06 - 26];
  function row(ctx, t, vL) {
    const rl = rowLit2(t);
    S.rowScene(ctx, t, T, { n: rl.u < .5 ? 2 : 1, v: vL, yard: false, lit: rl.lit, scale: rl.scale, beam: rl.beam, tags: (m) => (m >= 2 || t >= LAND + .25 ? 1 : 0), hud: 0 });
    F.inView(ctx, vL, () => {
      const bh = Math.sin(Math.PI * span(t, A.best, A.best + 1.6)); if (bh > 0) halo(ctx, F.rowX(1), F.ROW.y - 100, 260, .35 * bh, GOLD.halo, GOLD.core);
      // the empty place for door 1's tag (2.13)
      const eu = span(t, A.one + .7, A.one + 1.2) * (t < LAND ? 1 : 0);
      if (eu > 0) { const k = lerp(.6, 1, expoOut(eu)); ctx.save(); ctx.globalAlpha *= clamp(eu * 3); ctx.translate(TAG1[0], TAG1[1]); ctx.scale(k, k); ctx.strokeStyle = rgba(GOLD.line, .8); ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.roundRect(-17, -10, 34, 20, 4); ctx.stroke(); ctx.restore(); }
      F.label(ctx, TXT.e12.ranking, 1480, 330, span(t, A.best + .2, A.best + .8) * (1 - span(t, A.readers - .2, A.readers + .3)), { size: 28 });
      // the reader survey (2.15): the covered top line lifts off and lands as door 1's mini tag
      const su = Math.min(span(t, A.readers - .1, A.readers + 1.6), 1 - span(t, PL - 1.05, PL - .2));
      const cov = B.survey(ctx, t, SURV.x, SURV.y, SURV.w, su, { lift: t >= LIFT0 });
      const fu = span(t, LIFT0, LAND);
      if (fu > 0 && fu < 1) {
        const c0 = cov ? [cov.x + SURV.w / 2, cov.y + 22] : [SURV.x + SURV.w / 2, SURV.y + 62], e = sineIO(fu);
        const x = lerp(c0[0], TAG1[0], e), y = lerp(c0[1], TAG1[1], e) - 150 * Math.sin(Math.PI * e), w = lerp(SURV.w, 34, e), h = lerp(44, 20, e);
        ctx.fillStyle = mixHex(mixHex(PAPER.lit, LAMP.body, .2), PAPER.lit, e); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, lerp(6, 4, e)); ctx.fill();
      }
      const gk = span(t, LAND, LAND + .25);
      if (gk > 0 && gk < 1) {   // the landed plate: its lever glyph clicks on (then rowScene draws the tag)
        ctx.save(); ctx.translate(TAG1[0], TAG1[1]); ctx.fillStyle = PAPER.lit; ctx.beginPath(); ctx.roundRect(-17, -10, 34, 20, 4); ctx.fill();
        const k = expoOut(gk); ctx.scale(k, k); ctx.strokeStyle = PAPER.ink; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-8, 6); ctx.lineTo(8, 6); ctx.moveTo(0, 6); ctx.lineTo(6, -4); ctx.stroke();
        ctx.fillStyle = PAPER.ink; ctx.beginPath(); ctx.arc(6, -4, 3, 0, TAU); ctx.fill(); ctx.restore();
        halo(ctx, TAG1[0], TAG1[1], 50, .3 * Math.sin(Math.PI * gk), LAMP.body, LAMP.core);
      }
    });
  }
  // ---------------------------------------------------------------- camera (street coords)
  const R = (x, y, s) => rowS({ x, y, s });
  const CAM = [[A.a - 1.6, { x: 700, y: 760, s: 1.0 }], [A.a + .3, { x: 706, y: 760, s: 1.0 }], [A.acc - .2, { x: 940, y: 770, s: 1.0 }],
    [A.luck - .1, { x: 1095, y: 715, s: 1.15 }], [A.luck + .5, { x: 1102, y: 680, s: 1.12 }], [A.never + .5, { x: 1150, y: 180, s: .78 }], [A.never + 1.55, { x: 1200, y: -360, s: .9 }],
    [A.god + .5, { x: 1195, y: -420, s: 1.0 }], [A.small - .3, { x: 1215, y: -445, s: 1.08 }], [A.small + 1.3, { x: 2050, y: -470, s: 1.15 }],
    [A.jan + .4, { x: 2290, y: -500, s: 1.3 }], [A.unsure + .6, { x: 2340, y: -490, s: 1.32 }], [A.eu + .4, { x: 2300, y: -440, s: 1.3 }],
    [A.aug + .5, { x: 2260, y: -520, s: 1.28 }], [A.hide - .2, { x: 2250, y: -520, s: 1.25 }], [A.hide + 1.1, { x: 1235, y: -450, s: 1.12 }],
    [A.hiding + .4, { x: 1215, y: -455, s: 1.2 }], [A.one - .45, { x: 1215, y: -470, s: 1.24 }], [A.one + 1.15, R(1150, 560, .95)],
    [A.best + .7, R(1330, 545, 1.05)], [A.readers + .6, R(1010, 520, .97)], [A.picked + .9, R(975, 552, .995)], [PL, R(960, 560, 1)]];
  const vAt = (t) => F.viewPath(t, CAM);
  // ---------------------------------------------------------------- one frame of the world (no screen overlays)
  function frame(ctx, t, v) {
    const vL = { x: v.x - O11.x, y: v.y - O11.y, s: v.s }, ru = sineIO(span(t, A.best - .1, A.best + .7));
    F.yard(ctx, t, vL, { lx: lerp(F.rowX(2), F.rowX(1), ru), ly: 560, pool: .8, rails: 1 });
    if (v.y + H / 2 / v.s > -1250) {
      const y = youAt(t), pu = span(t, BR0, BR0 + .9);
      B.roomStreet2(ctx, t, v, { sky: (c) => sky(c, t), go: span(t, A.acc + .35, A.acc + .55), carX: carX(t), dip: Math.sin(Math.PI * span(t, BR0, BR1 + .45)), you: y,
        front: (c) => { if (pu > 0 && pu < 1) { c.strokeStyle = rgba(COOL.core, .35 * (1 - pu)); c.lineWidth = 3; c.beginPath(); c.arc(carX(t) + 10, GY + 150, 20 + 150 * expoOut(pu), 0, TAU); c.stroke(); } } });
    }
    if (vL.y + H / 2 / vL.s > 280) row(ctx, t, vL);
  }
  // screen overlays: switch tags, source lines, the counter, SCENARIO
  function overlay(ctx, t, v) {
    const tu = span(t, A.jan + .05, A.jan + .6), tOut = span(t, A.aug - .35, A.aug + .05);
    const [tx, ty] = F.toScreen(v, TAGP[0], TAGP[1]);
    if (tu > 0 && tOut < 1) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.switchTag(ctx, t, tx, ty, F.END[2].tag, tu, { out: tOut }); ctx.restore(); B.tagToHud(ctx, t, T, 2, [tx, ty]); }
    const bu = span(t, A.aug + .05, A.aug + .6), bOut = span(t, A.hide + .3, A.hide + .8), [bx, by] = F.toScreen(v, TAGB[0], TAGB[1]);
    if (bu > 0 && bOut < 1) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.switchTag(ctx, t, bx, by, F.END[2].back, bu, { kind: 'back', lines: TXT.e2.act, out: bOut }); ctx.restore(); B.tagToHud(ctx, t, T, 2, [bx, by], A.aug + .05); }
    const su = span(t, A.jan + .6, A.jan + 1.3) * (1 - span(t, A.eu - .6, A.eu - .1));   // a dark backing: the source sits on the day sky
    if (su > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const w = F.measure(TXT.e2.src.toUpperCase(), 22, false, 600) * 1.06 + 36; ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.roundRect(92, 850, w * expoOut(su), 44, 22); ctx.fill(); ctx.restore(); }
    F.source(ctx, t, A.jan + .6, A.eu - .1, TXT.e2.src);
    F.source(ctx, t, A.readers + .8, PL - .1, TXT.e2.surveySrc);
    F.counterHud(ctx, t, T);
    F.scenarioTag(ctx, tagU(t));
  }
  const tagU = (t) => span(t, A.a - .3, A.a + .3) * (1 - span(t, A.never + .3, A.never + .8));
  return { A, vAt, frame, overlay, tagU, PL };
}

export default function (T, R) {
  const st = street11(T);
  const draw = (ctx, t) => { const v = st.vAt(t); st.frame(ctx, t, v); st.overlay(ctx, t, v); };
  return [{ t: R.a, draw, print: F.PRINT71 }, { t: R.b - S.SEAM_HALF, draw: (ctx, t) => S.plateRow(ctx, t, T, 1), print: F.PRINT71 }];
}
