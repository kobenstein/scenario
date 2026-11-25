// c04 · B1 · 'But why does it matter' → 'Because a company that wants' (c05). Why it matters where a company lives: the Mistral block on its
// home line · we push into its top window (Arthur Mensch) · the window grows into the C2 plate and shrinks back · pull back: A CLIENT STATE
// (DEFENCE and PUBLIC SERVICES cabled into one foreign plug) · push into the plug: it is the AI screen of the hook's desk (GETS A SAY dims)
// · pull back: a company grows at home; the money piece alone lifts it a little, not to its outline (MONEY ALONE WON'T DO IT) → c05.
// One draw function, no cuts (no W in this chunk).
//
// | ID    | anchor (phrase)                  | zeigt wörtlich                                                     | kind  | carrier out              |
// |-------|----------------------------------|--------------------------------------------------------------------|-------|--------------------------|
// | 3.01  | But why does it matter           | the Mistral block, its gold home line; the question beside it      | EXPL  | the block's top window   |
// | 3.02  | Arthur Mensch runs Mistral       | push into the top window: him; HE SELLS THE ALTERNATIVE · A STAKE  | MIX   | the window → the plate   |
// | 3.03  | slot:C2                          | C2 · ARTHUR MENSCH · CEO, MISTRAL AI · 2026 · ORIGINAL FOOTAGE     | CLIP  | the plate shrinks        |
// | 3.04  | A client state                   | A CLIENT STATE; DEFENCE, PUBLIC SERVICES cabled into a foreign plug | EXPL  | the plug                 |
// | 3.05  | And a client doesn't get a say   | the plug is the desk's AI screen: the beam on you, GETS A SAY dims | MIX   | the desk line            |
// | 3.06  | So Europe needs companies        | a block grows at home; the money piece lifts it, not to its outline | EXPL  | the block (→ c05)        |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f69_kit.mjs';
import * as X from '../lib/f69_explain.mjs';
import { initSeams, lab, plainView, hud, block, plug } from './sc02.mjs';
import { GB, BK, viewB, mistralBlock, groundB } from './sc03.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo } = E;
const { GOLD, COOL, CREAM, CREAM2, SOURCES: SRC } = F;
const PR = F.PRINT69, TAU = Math.PI * 2;

// ---------------------------------------------------------------- the world of c04 (sheet coordinates; c05 draws it too)
export const DEF = { x: 760, w: 230, h: 360 }, PUB = { x: 1040, w: 250, h: 280 }, PLUG = { x: 2350, y: 590, s: 120 }, BORDER = 2050;
export const HX = 1800, HB = { w: 200, h0: 210, h: 300, goal: 520 };
export const viewH = (t) => { const v = plainView(t); return { ...v, x: v.x + HX + 540 - 960 }; };
export const homeLine = (ctx, u) => { if (u <= 0) return; X.lightLine(ctx, [[HX, GB], [HX - 300, GB]], u, { col: GOLD.line, w: 5, glowCol: GOLD.halo, blur: 16 }); X.lightLine(ctx, [[HX, GB], [HX + 300, GB]], u, { col: GOLD.line, w: 5, glowCol: GOLD.halo, blur: 16 }); };
export function homeBlock(ctx, t, h, o = {}) { return block(ctx, t, HX, GB, HB.w, h, { cols: 3, lit: .85, ...o }); }
// the static part of the world: the two public buildings, the Mistral block (dimmer once the client state is told)
export function worldC4(ctx, t, o = {}) {
  block(ctx, t, DEF.x, GB, DEF.w, DEF.h, { cols: 4, lit: .6, u: o.def ?? 1 });
  block(ctx, t, PUB.x, GB, PUB.w, PUB.h, { cols: 4, lit: .6, u: o.pub ?? 1 });
  return mistralBlock(ctx, t, BK.h1, { lit: o.mlit ?? .5 });
}
// the c04 | c05 seam (both files draw it): the home block on its gold line, the HUD
export function seam45(ctx, t, T) {
  const v = viewH(t); X.sheet(ctx, t, v, { lx: HX + 200, ly: 520 });
  X.inView(ctx, v, () => { groundB(ctx); worldC4(ctx, t); homeLine(ctx, 1); homeBlock(ctx, t, HB.h); });
  hud(ctx, t, T);
}
const blendV = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), k)) });
const quad = (a, c, b, u) => [(1 - u) ** 2 * a[0] + 2 * u * (1 - u) * c[0] + u * u * b[0], (1 - u) ** 2 * a[1] + 2 * u * (1 - u) * c[1] + u * u * b[1]];

export default async (T, R) => {
  initSeams(T);
  const G = (p, n = 0) => T.G(p, n, R.a - .01);
  const A = {
    a: R.a, why: G('But why does it matter'), lives: G('a company like that lives'), mensch: G('Arthur Mensch'), sells: G('He sells the European'),
    stake: G('has a stake'), warn: G("Here's his warning"), client: G('A client state'), means: G('He means the systems'), without: G('cannot run without'),
    defence: G('its defence'), publ: G('its public services'), say0: G("And a client doesn't"), doesnt: G("doesn't get a say"), needs: G('So Europe needs companies'),
    comp: G('companies that can grow'), grow: G('grow up at home'), home: G('at home'), alone: G('Money alone'), wont: G("won't do it"), end: R.b,
  };
  const C2 = T.clip('C2');
  // the desk (the hook's picture) lives inside the plug: sub-scale .4, its AI screen centre on the plug
  const DS = .4, DESK_C = [960, X.DESK.y - 76];
  const deskTf = (ctx) => { ctx.translate(PLUG.x, PLUG.y); ctx.scale(DS, DS); ctx.translate(-DESK_C[0], -DESK_C[1]); };
  const VK = [
    [A.why + .2, { x: 1455, y: 520, s: 1.0 }], [A.lives + .6, { x: 1450, y: 470, s: 1.22 }], [A.mensch + .1, { x: 1450, y: 440, s: 1.4 }],
    [A.sells + .3, { x: 1450, y: 402, s: 2.6 }], [A.warn, { x: 1450, y: 392, s: 2.95 }], [C2.start, { x: 1450, y: 388, s: 3.15 }],
    [C2.end, { x: 1451, y: 386, s: 3.4 }], [A.client + 1.6, { x: 1500, y: 470, s: .8 }], [A.publ + .9, { x: 1540, y: 470, s: .78 }],
    [A.say0 + .9, { x: PLUG.x, y: 556.4, s: 1 / DS }], [A.needs + .1, { x: PLUG.x + 4, y: 556, s: 1.03 / DS }],
    [A.needs + 1.5, { x: 1830, y: 520, s: 1.0 }], [A.alone + 1.3, { x: 1840, y: 526, s: 1.03 }], [A.end, { x: HX + 540, y: 540, s: 1 }],
  ];
  const view = (t) => {
    let v = X.viewPath(t, VK);
    v = blendV(viewB(t), v, sineIO(span(t, A.why + .2, A.why + 1.4)));      // out of the c03 seam
    return blendV(v, viewH(t), sineIO(span(t, A.end - 1.5, A.end - .05)));   // into the c05 seam
  };
  // cables: from the two buildings over the Mistral block into the foreign plug
  const CAB = [
    [[DEF.x + DEF.w / 2 - 10, GB - DEF.h + 40], [1520, 70], [PLUG.x - PLUG.s * .62, PLUG.y - PLUG.s * .18]],
    [[PUB.x + PUB.w / 2 - 10, GB - PUB.h + 40], [1640, 190], [PLUG.x - PLUG.s * .62, PLUG.y + PLUG.s * .18]],
  ];
  const IRIS = [960, X.DESK.y - 230 * .66 * .5], YOU = [960 - X.DESK.w / 2 - 70, X.DESK.y];

  function draw(ctx, t) {
    const v = view(t);
    X.sheet(ctx, t, v, { lx: t < A.client ? 1450 : t < A.needs + 1 ? lerp(1500, PLUG.x, span(t, A.say0, A.say0 + .8)) : HX + 200, ly: 520 });
    // --- timings
    const plateIn = span(t, A.warn + .25, C2.start), plateOut = span(t, C2.end, C2.end + .95), plateOn = t > A.warn + .25 && t < C2.end + .95;
    const bu = span(t, A.means + .3, A.means + 1.3), def = span(t, A.means + .2, A.means + 1.1), pub = span(t, A.means + .55, A.means + 1.45);
    const plugIn = expoOut(span(t, A.client + .2, A.client + 1.3)), plugOut = expoIn(span(t, A.needs + .55, A.needs + 1.5));
    const cab = span(t, A.without - .2, A.without + 1.1) * (1 - span(t, A.say0 - .3, A.say0 + .45));
    const border = span(t, A.client + .4, A.client + 1.4) * (1 - span(t, A.say0 - .3, A.say0 + .45));
    const desk = span(t, A.say0 - .15, A.say0 + .55) * (1 - span(t, A.needs + .6, A.needs + 1.3));
    const hu = span(t, A.comp - .1, A.comp + 1.0), hh = lerp(0, HB.h0, expoOut(hu)) + (HB.h - HB.h0) * sineIO(span(t, A.alone + .55, A.alone + 1.2)) - 14 * Math.sin(Math.PI * span(t, A.wont, A.wont + .5));
    const goal = span(t, A.grow - .1, A.grow + .8) * (1 - span(t, A.end - 1.6, A.end - .7));
    const homeU = span(t, A.home, A.home + .8);
    let topRect = null;
    X.inView(ctx, v, () => {
      groundB(ctx);
      const hl0 = span(t, A.lives - .3, A.lives + .5) * (1 - span(t, A.mensch, A.mensch + .6));
      if (hl0 > 0) for (const d of [-1, 1]) X.lightLine(ctx, [[BK.x, GB], [BK.x + d * 220, GB]], hl0, { col: GOLD.line, w: 5, glowCol: GOLD.halo, blur: 16 });
      homeLine(ctx, homeU);
      // the two public buildings (3.04 on), the Mistral block (always), the border, the foreign plug, the cables
      const mb = worldC4(ctx, t, { def, pub, mlit: lerp(.75, .5, span(t, A.client, A.client + 1)) }); topRect = mb.top;
      if (border > 0) X.lightLine(ctx, [[BORDER, GB + 30], [BORDER, GB - 560]], border, { a: .55, w: 3, dash: [14, 12], glow: false });
      for (const [k, [a, c, b]] of CAB.entries()) {
        const u = clamp(cab * 1.25 - k * .2); if (u <= 0) continue;
        const pts = Array.from({ length: 33 }, (_, i) => quad(a, c, b, i / 32));
        X.lightLine(ctx, pts, u, { col: rgba(COOL.body, .85), w: 5, glowCol: COOL.halo, blur: 12 });
        if (u >= 1) for (let j = 0; j < 4; j++) { const f = (t * .35 + j / 4 + k * .13) % 1, [px, py] = quad(a, c, b, f); halo(ctx, px, py, 34, .5, COOL.halo, COOL.core); }
      }
      const px = lerp(PLUG.x + 900, PLUG.x, plugIn) + plugOut * 1500, pa = t < A.say0 + .6 ? plugIn * (1 - desk) : 0;
      if (pa > 0) plug(ctx, t, px, PLUG.y, PLUG.s, { a: pa, glow: 1 + .4 * cab });
      // 3.05 the hook's desk inside the plug: the beam on you
      if (desk > 0) {
        ctx.save(); deskTf(ctx); ctx.globalAlpha *= desk;
        const beam = span(t, A.say0 + .3, A.say0 + 1.0) * (1 - span(t, A.needs - .2, A.needs + .4));
        if (beam > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const sw = lerp(.5, .2, beam);
          ctx.fillStyle = E.lin(ctx, IRIS[0], IRIS[1], YOU[0], YOU[1], [[0, rgba(COOL.body, .32 * beam)], [1, rgba(COOL.body, .05 * beam)]]);
          ctx.beginPath(); ctx.moveTo(IRIS[0] - 20, IRIS[1]); ctx.lineTo(YOU[0] - 260 * sw * 2, YOU[1] + 176); ctx.lineTo(YOU[0] + 260 * sw * 2, YOU[1] + 176); ctx.lineTo(IRIS[0] + 20, IRIS[1]); ctx.fill(); ctx.restore(); }
        X.deskScene(ctx, t, 960, { other: { a: .5, look: .2 }, you: { look: beam > .3 ? .7 : .15 }, screen: { a: 1 } });
        ctx.restore();
      }
      // 3.06 the company at home: its goal outline (dashed), the block, the money piece's lift
      if (goal > 0) { const x0 = HX - HB.w / 2 - 8, x1 = HX + HB.w / 2 + 8, y1 = GB - HB.goal;
        X.lightLine(ctx, [[x0, GB], [x0, y1], [x1, y1], [x1, GB]], goal, { a: .5, w: 2.5, dash: [12, 10], glow: false }); }
      if (hu > 0) homeBlock(ctx, t, Math.max(1, hh), { u: 1 });
    });
    // --- C2: the top window grows into the plate and shrinks back
    if (plateOn && topRect) {
      const m = plateIn * (1 - plateOut), dark = Math.max(1 - span(t, A.warn + .55, C2.start - .05), span(t, C2.end + .15, C2.end + .7));
      F.clipPlate(ctx, t, T, 'C2', { from: topRect, morph: m, dark });
    }
    // him in the window (3.02), before the plate takes it
    if (topRect && t > A.mensch - .3 && t < A.warn + .6) {
      const r = topRect, u = span(t, A.mensch - .3, A.mensch + .4);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip(); ctx.globalAlpha *= u;
      E.person(ctx, r.x + r.w * .66, r.y + r.h * 1.5, r.h * 1.7, { dir: -1, light: .8, look: .1 + .05 * Math.sin(t * .8) });
      ctx.restore();
    }
    // --- texts (screen space)
    X.label(ctx, 'WHY DOES WHERE IT LIVES MATTER?', W / 2, 190, lab(t, A.why + .25, A.mensch - .1), { size: 34, spacing: .1 });
    if (topRect) {
      const r = topRect, cx = r.x + r.w / 2;
      X.label(ctx, SRC.mistral, cx, r.y - 150, lab(t, A.why + .5, A.mensch - .2), { size: 26, spacing: .12, gold: .3 });
      X.label(ctx, 'ARTHUR MENSCH', cx, r.y - 46, lab(t, A.mensch + .1, A.warn + .3), { size: 34, spacing: .1 });
      const tx = r.x + r.w + 150 * r.w / 400;
      X.label(ctx, 'HE SELLS THE ALTERNATIVE', tx, r.y + r.h * .5 - 4, lab(t, A.sells + .1, A.warn + .3), { size: 28, spacing: .12, gold: .6, col: GOLD.text, align: 'left' });
      X.label(ctx, 'SO HE HAS A STAKE', tx, r.y + r.h * .5 + 42, lab(t, A.stake, A.warn + .3), { size: 28, spacing: .12, align: 'left' });
    }
    X.big(ctx, SRC.clientState, W / 2, 200, 78, lab(t, A.client + .1, A.say0 - .2), { gold: .2 });
    const [dS, pS] = [X.toScreen(v, DEF.x, GB + 46), X.toScreen(v, PUB.x, GB + 46)];
    X.label(ctx, SRC.clientWhat[0], dS[0], dS[1], lab(t, A.defence + .1, A.say0 + .2), { size: 24, spacing: .14 });
    X.label(ctx, SRC.clientWhat[1], pS[0], pS[1], lab(t, A.publ + .1, A.say0 + .2), { size: 24, spacing: .14 });
    {   // GETS A SAY (the hook's words) dims to grey on "doesn't"
      const dim = sineIO(span(t, A.doesnt - .05, A.doesnt + .45)), u = lab(t, A.say0 + .15, A.needs + .3);
      if (u > 0) { ctx.save(); ctx.globalAlpha *= 1 - .5 * dim; X.label(ctx, 'GETS A SAY', W / 2, 270, u, { size: 34, spacing: .14, gold: 1 - dim, col: mixHex(GOLD.text, CREAM2, dim) }); ctx.restore(); }
    }
    const [hS] = [X.toScreen(v, HX, GB + 46)];
    X.label(ctx, 'AT HOME', hS[0], hS[1], lab(t, A.home + .1, A.end - .6), { size: 24, spacing: .16, gold: .8, col: GOLD.text });
    X.big(ctx, "MONEY ALONE WON'T DO IT", W / 2, 200, 66, lab(t, A.alone + .05, A.end - .5), { gold: .3 });
    // --- the money piece: out of the HUD, onto the block (it lifts it a little), back into the HUD
    const go = span(t, A.alone - .05, A.alone + .6), back = span(t, A.end - 1.9, A.end - 1.05), away = go > 0 && back < 1;
    let parts = null;
    if (away) {
      parts = F.kitParts(T, t).parts.map((p, i) => (i === 0 ? { ...p, fade: 0 } : p));
      const [hx0, hy0] = F.pieceCentre(0, F.HUD.x, F.HUD.y, F.HUD.r), [bx, by] = X.toScreen(v, HX, GB - hh - 60);
      const k = back > 0 ? 1 - sineIO(back) : sineIO(go), x = lerp(hx0, bx, k), y = lerp(hy0, by, k) - Math.sin(Math.PI * k) * 120, r = lerp(F.HUD.r, 150, k);
      if (go >= 1 && back <= 0) halo(ctx, bx, by + 40, 220, .35 * (1 - span(t, A.wont, A.wont + 1)), GOLD.halo, GOLD.core);
      F.loosePiece(ctx, t, 0, x, y, r, { kind: 'gold', rot: (1 - k) * .4, glow: .6 });
    }
    hud(ctx, t, T, { a: 1 - span(t, A.warn + .1, A.warn + .6) * (1 - span(t, C2.end + .3, C2.end + .9)), ...(parts ? { parts } : {}) });
  }
  return [{ t: R.a, draw, print: PR }];
};
