// c05 · Why build it like this: a crystal facet turns flat into a screen · C1 grows out of it (and back) · THE SELLER · the stewards card
// grows from the facet · it shrinks into a SAFETY DECISION card on the vote bar's gold half; the cool half pushes and cannot move it ·
// the card goes into the prospectus; three warning cards come out · they stack into Z1 · the card turns: SAFETY above YOUR RETURN ·
// it flies into the crystal; the veil lifts; on "share price" the "$ ?" tag drops from the crystal; it swings on "Can it hold?" → plateCrystal.
// T.G('Why build a company') → T.G('Many doubt it') · builder B1. Part of the one B1 take (hub: scenes/sc02.mjs).
//
// | ID   | anchor (phrase)                | picture (one idea)                                                                  | camera / layer | carrier → next |
// |------|--------------------------------|-------------------------------------------------------------------------------------|----------------|----------------|
// | 4.01 | Why build a company            | tilt up from the rooftop to the crystal; the wheel goes home; one facet turns flat into a screen | glide · CITY | the facet |
// | 4.02 | slot:C1                        | C1 grows out of the facet (1.8 s) and shrinks back into it                          | creep · CLIP   | the facet      |
// | 4.03 | Remember who is speaking       | THE SELLER is stamped on the facet; the stewards quote card grows out of it          | creep · EXPL   | the card       |
// | 4.04 | If a safety decision costs     | the card shrinks into a SAFETY DECISION card on the gold half of the vote bar (it rises again); the cool half pushes, blocked; "either": it lifts off | creep · EXPL | the card |
// | 4.05 | The document warns its own     | the card slides into the prospectus; three paper cards slide out: SLOWING DOWN · HOLDING A SYSTEM BACK · TURNING BUSINESS AWAY | creep · EXPL | the cards |
// | 4.06 | slot:Z1                        | the cards stack and the top one grows into Z1 "…may not maximize stockholder value." (words light as spoken) | creep · EXPL | the card |
// | 4.07 | In plain words                 | the card turns: SAFETY (gold) · MAY COME BEFORE · YOUR RETURN (cool)                 | creep · EXPL   | the card       |
// | 4.08 | That is the promise            | the card flies into the crystal; the veil lifts; "$ ?" drops on a gold thread; it swings on "Can it hold?" | glide · MIX → plateCrystal | the tag |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f59_kit.mjs';
import * as S from '../lib/f59_world.mjs';
import { b1, PRINT, CC, line, gline, panel, facet, flatFacet, rectMix } from './sc02.mjs';
import { BAR } from './sc04.mjs';
import { DOC } from './sc03.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, smooth, halo, mixHex } = E;
const { rise, GOLD, PAPER, COOL } = F;

export default async (T, R) => { E.prepareEditorial(); return [{ t: R.a, draw: b1(T), print: PRINT }]; };

// the height quoteCard() will give a text (same wrap as the kit), so a card can grow into it exactly
function quoteH(text, size, w, head, credit) {
  const words = text.split(/\s+/); let n = 0, cur = [];
  for (const wd of words) { const nx = [...cur, wd]; if (cur.length && F.measure(nx.join(' '), size, true) > w - 108) { n++; cur = [wd]; } else cur = nx; }
  if (cur.length) n++;
  return (head ? 64 : 24) + n * size * 1.22 + (credit ? 92 : 40);
}
// a quote card (the kit's look) drawn into the screen rect r (designed for Q): the body is always opaque and stretches with r; the words
// rise on their own ramp tu (0 = a blank card), so a card can grow out of a thing and only then speak. o { text, size, credit, spoken, after }
const nz = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
function quoteIn(ctx, t, T, Q, r, tu, o) {
  ctx.save(); F.float(ctx, t, 1);
  ctx.translate(r.x, r.y); ctx.scale(r.w / Q.w, r.h / Q.h); ctx.translate(-Q.x, -Q.y);
  F.paperCard(ctx, t, Q.x, Q.y, Q.w, Q.h, { u: 1, rot: -.006 });
  if (tu > 0) {
    const size = o.size, pad = 54, words = o.text.split(/\s+/), lines = []; let cur = [];
    for (const wd of words) { const nx = [...cur, wd]; if (cur.length && F.measure(nx.join(' '), size, true) > Q.w - pad * 2) { lines.push(cur); cur = [wd]; } else cur = nx; }
    if (cur.length) lines.push(cur);
    let times = null;
    if (o.spoken) { try { const ws = T.GW(o.spoken[0], o.spoken[1], o.after ?? -1); times = []; let j = 0; for (const wd of lines.flat()) { const n = nz(wd); let hit = null; for (let q = j; q < ws.length; q++) if (nz(ws[q].w) === n && n) { hit = ws[q].s; j = q + 1; break; } times.push(hit); } } catch { times = null; } }
    ctx.translate(Q.x + Q.w / 2, Q.y + Q.h / 2); ctx.rotate(-.006); ctx.translate(-Q.w / 2, -Q.h / 2);
    let k = 0;
    lines.forEach((ln, li) => {
      let xx = pad; const yy = 24 + (li + 1) * size * 1.22;
      for (const wd of ln) {
        const tt = times ? times[k] : null, g = tt == null ? 0 : clamp((t - tt + .05) / .25);
        F.maskLine(ctx, [[wd + ' ', 0]], xx, yy, size, rise(span(tu, li * .1, .65 + li * .1)), { serif: true, col: mixHex(PAPER.ink, GOLD.deep, g * .85), glow: false });
        xx += F.measure(wd + ' ', size, true); k++;
      }
    });
    if (o.credit) F.maskLine(ctx, [[o.credit.toUpperCase(), 0]], pad, Q.h - 34, 18, rise(span(tu, .45, 1)), { serif: false, weight: 600, col: PAPER.faint, glow: false });
  }
  ctx.restore();
}

export function part05(T) {
  const A0 = T.G('Why build a company'), G = (p) => T.G(p, 0, A0 - .2), GE = (p) => T.GE(p, 0, A0 - .2);
  const C1 = T.clip('C1'), Z1 = T.clip('Z1');
  const a = {
    chief: G('Its chief executive'), un: G('told the United Nations'), stake: G('is at stake'),
    remember: G('Remember who is speaking'), selling: G('the man selling'), still: G('Still, this is the reason'), founders: G('its founders are best'),
    ifs: G('If a safety decision'), costs: G('costs money'), nob: G('no buyer can vote it down'), vote: G('vote it down'), and: G('And no buyer can outvote'),
    outvote: G('outvote the founders'), either: G('either.'), doc: G('The document warns its own'), exactly: G('exactly that'),
    slow: G('Slowing down'), hold: G('Holding a system back'), turn: G('Turning business away'), all: G('All of that, it says'),
    plain: G('In plain words'), safety: G('safety may come'), before: G('before your return'), ret: G('your return'),
    promise: G('That is the promise'), bell: G('At the bell, the promise'), price: G('share price'), can: G('Can it hold'), next: T.G('Many doubt it'),
  };
  const veilU = (t) => sineIO(span(t, a.still - .2, a.founders + .6)) * (1 - sineIO(span(t, a.promise + .2, a.promise + 2.2)));
  const keys = [
    [a.chief + .7, CC(1440, 330, 1.0, 1000, 520)], [a.stake, CC(1440, 320, 1.16, 960, 530)], [a.remember, CC(1440, 318, 1.28, 960, 540)],
    [a.founders - .8, CC(1440, 318, 1.36, 960, 540)], [a.doc, CC(1420, 360, 1.16, 960, 540)], [a.plain, CC(1460, 450, .98, 960, 540)],
    [a.bell, CC(1490, 515, .87, 960, 540)],
  ];
  // ---------------------------------------------------------------- 4.01–4.03 the facet: flat screen → C1 → THE SELLER → the stewards card
  const flatU = (t) => span(t, a.un - .2, a.stake + .2) * (1 - span(t, a.ifs, a.ifs + 1.2));   // the facet's light returns under the card
  const clipM = (t) => sineIO(span(t, C1.start - .8, C1.start + 1.6)) * (1 - sineIO(span(t, C1.end - 1.6, C1.end + .8)));   // 2.4 s each way
  const Q1 = { x: 330, y: 350, w: 1260, size: 64, text: '“…distinctly equipped to be stewards of our mission”' };
  Q1.h = quoteH(Q1.text, Q1.size, Q1.w, null, true);
  const SD = { x: BAR.x + BAR.w * .5 + 120, y: BAR.y - 112, w: 380, h: 92 };     // SAFETY DECISION, sitting on the gold half
  const q1Grow = (t) => sineIO(span(t, a.founders - .6, a.founders + .9));
  const q1Text = (t) => span(t, a.founders + .5, a.founders + 1.5) * (1 - span(t, a.ifs - .5, a.ifs + .05));
  const q1Down = (t) => sineIO(span(t, a.ifs - .1, a.ifs + 1.6));
  // the card's place on screen: facet → Q1 → SD → (lifts on "either") → into the prospectus' right edge
  const lift = (t) => sineIO(span(t, a.either - .2, a.either + .8));
  const docIn = (t) => sineIO(span(t, a.doc - .6, a.doc + 1.3)), docOut = (t) => sineIO(span(t, a.all - .1, a.all + 1.8));
  const intoDoc = (t) => sineIO(span(t, a.doc - .1, a.doc + 1.4));
  const DOCX = DOC.xl, edge = (t) => DOCX + DOC.s + 12;
  function cardRect(t, f) {
    const g = q1Grow(t), d = q1Down(t);
    let r = rectMix(f ? { x: f.cx - 30, y: f.cy - 14, w: 60, h: 28 } : Q1, Q1, g);   // out of the facet's middle
    if (d > 0) r = rectMix(Q1, SD, d);
    const l = lift(t);
    if (l > 0) r = { ...r, y: r.y - 120 * l, x: r.x + 40 * l };
    const k = intoDoc(t);
    if (k > 0) { const e = edge(t); r = rectMix(r, { x: e - SD.w * .6, y: DOC.y + 220, w: SD.w * .6, h: SD.h * .6 }, k); r.x = lerp(r.x, e - SD.w * .6 - 40, k); }
    return r;
  }
  function facetScene(ctx, t, c) {
    const f = facet(c, t, [7, 8, 10, 9]); if (!f) return;
    // the facet turns flat (a screen), C1 grows out of it and back
    flatFacet(ctx, f, flatU(t) * (1 - veilU(t)));
    const m = clipM(t);
    if (m > 0) F.clipPlate(ctx, t, T, 'C1', { from: [f.cx, f.cy, f.R * .12], morph: m, dark: .55 * (1 - sineIO(m)), label: span(t, C1.start + .6, C1.start + 1.4) * (1 - span(t, C1.end - .9, C1.end - .4)) });
    // THE SELLER, stamped on the facet (it stays under the card once the card covers it)
    if (t > a.selling - .3 && q1Grow(t) < .9) F.stamp(ctx, t, 'THE SELLER', f.cx, f.cy + 10, { t0: a.selling + .05, size: 34, rot: -.08, ink: GOLD.text });
    // the stewards card grows out of the facet; later it is the small SAFETY DECISION card
    const g = q1Grow(t); if (g <= 0) return;
    if (intoDoc(t) >= 1) return;
    const r = cardRect(t, f);
    const e = edge(t), k = intoDoc(t);
    ctx.save();
    if (k > 0) { ctx.beginPath(); ctx.rect(e, 0, W, H); ctx.clip(); }   // it slides into the document's right edge
    quoteIn(ctx, t, T, Q1, r, q1Text(t), { text: Q1.text, size: Q1.size, credit: F.SOURCES.stewards });
    const sd = span(t, a.ifs + 1.1, a.ifs + 1.8);
    if (sd > 0) {
      ctx.save(); F.float(ctx, t, 1);
      const s = r.w / SD.w; ctx.translate(r.x, r.y); ctx.scale(s, s);
      line(ctx, 'SAFETY DECISION', SD.w / 2, SD.h * .62, 30, sd, { align: 'center', col: PAPER.ink });
      ctx.restore();
    }
    ctx.restore();
  }
  // ---------------------------------------------------------------- 4.04 the vote bar returns; the cool half pushes and cannot move the card
  const barIn = (t) => sineIO(span(t, a.ifs - .3, a.ifs + 1.6)), barOut = (t) => sineIO(span(t, a.doc - .4, a.doc + 1.5));
  const pushes = () => [a.nob + .25, a.vote, a.outvote];
  const push = (t) => pushes().reduce((s, p) => s + F.bump(t, p - .12, .55), 0);
  function bar(ctx, t) {
    const i = barIn(t), o = barOut(t); if (i <= 0 || o >= 1) return;
    ctx.save(); F.float(ctx, t, 1); ctx.translate(0, (1 - i) * 760 + o * 760);
    F.voteBar(ctx, t, BAR.x, BAR.y, BAR.w, { u: 1, pub: 1, cap: 1, fnd: 1, labels: 1, fndLab: 1 });
    // the push: the cool half bulges against the dashed cap and springs back
    const p = clamp(push(t)), cx = BAR.x + BAR.w * .499;
    if (p > 0) {
      ctx.fillStyle = COOL.body; ctx.beginPath(); ctx.moveTo(cx - 6, BAR.y + 6); ctx.quadraticCurveTo(cx + 46 * p, BAR.y + 32, cx - 6, BAR.y + 58); ctx.closePath(); ctx.fill();
      halo(ctx, cx, BAR.y + 32, 70, .35 * p, COOL.halo, COOL.core);
    }
    ctx.restore();
    F.source(ctx, t, a.ifs + 1.7, a.doc - .4, F.SOURCES.votes);
  }
  // ---------------------------------------------------------------- 4.05 the prospectus; three warning cards slide out of its edge
  const WARN = [
    { text: 'SLOWING DOWN', t0: () => a.slow - .25, y: 210 },
    { text: 'HOLDING A SYSTEM BACK', t0: () => a.hold - .25, y: 390 },
    { text: 'TURNING BUSINESS AWAY', t0: () => a.turn - .25, y: 570 },
  ];
  const WC = { x: 780, w: 960, h: 150 };
  const Q2 = { x: 510, y: 270, w: 900, size: 84, text: '“…may not maximize stockholder value.”' };
  Q2.h = quoteH(Q2.text, Q2.size, Q2.w, null, true);
  const Z1Q = { text: Q2.text, size: Q2.size, credit: 'ANTHROPIC PROSPECTUS', spoken: ['may not', 'value'], after: Z1.start - .5 };
  const stackU = (t) => sineIO(span(t, a.all - .3, a.all + .6));
  const grow2 = (t) => sineIO(span(t, a.all + .6, Z1.start - .15));
  const q2Text = (t) => span(t, Z1.start - .3, Z1.start + .6);
  const flip = (t) => span(t, a.plain - .25, a.plain + .55);
  const fly = (t) => sineIO(span(t, a.promise - .1, a.promise + 1.7));
  function doc(ctx, t) {
    const i = docIn(t), o = docOut(t); if (i <= 0 || o >= 1) return;
    ctx.save(); F.float(ctx, t, 1); ctx.translate(0, (1 - i) * 900 + o * 900);
    F.prospectus(ctx, t, DOCX, DOC.y, DOC.s, { u: 1, thick: 1, tabs: 1, cover: 'PROSPECTUS', sub: 'FORM S-1' });
    ctx.restore();
  }
  function warnRect(t, i) {
    const cd = WARN[i], u = sineIO(span(t, cd.t0(), cd.t0() + 1.1)), e = edge(t);
    const r = { x: lerp(e - WC.w, WC.x, u), y: cd.y, w: WC.w, h: WC.h };
    const s = stackU(t); if (s > 0) r.y = lerp(cd.y, WARN[1].y, s);
    return r;
  }
  function warnings(ctx, t) {
    if (t < WARN[0].t0() || flip(t) > 0) return;
    const g = grow2(t), e = edge(t);
    WARN.forEach((cd, i) => {
      if (t < cd.t0()) return;
      if (g > 0 && i < 2) return;                                    // under the top card once it grows
      let r = warnRect(t, i);
      if (i === 2 && g > 0) r = rectMix(r, Q2, g);
      ctx.save();
      if (docOut(t) <= 0 && span(t, cd.t0(), cd.t0() + 1.1) < 1) { ctx.beginPath(); ctx.rect(e, 0, W, H); ctx.clip(); }
      quoteIn(ctx, t, T, Q2, r, i === 2 && g >= 1 ? q2Text(t) : 0, Z1Q);
      // the card's words (they sink as the cards stack, except on the top card until it grows)
      const tu = span(t, cd.t0() + .4, cd.t0() + 1.2) * (1 - span(t, i === 2 ? a.all + .15 : a.all - .45, i === 2 ? a.all + .55 : a.all + .05));
      if (tu > 0) { ctx.save(); F.float(ctx, t, 1); line(ctx, cd.text, r.x + 48, r.y + r.h * .64, 54, tu, { serif: true, weight: 400, col: PAPER.ink }); ctx.restore(); }
      ctx.restore();
    });
  }
  // ---------------------------------------------------------------- 4.07 the card turns: SAFETY · MAY COME BEFORE · YOUR RETURN; 4.08 into the crystal
  const NC = { x: 460, y: 260, w: 1000, h: 380 };
  function plain(ctx, t, c) {
    const fl = flip(t); if (fl <= 0) return;
    const fy = fly(t); if (fy >= 1) return;
    if (fl < .5) {   // the front (Z1) closes
      const k = Math.cos(Math.PI * fl), r = { x: Q2.x, y: Q2.y + Q2.h * (1 - k) / 2, w: Q2.w, h: Q2.h * k };
      quoteIn(ctx, t, T, Q2, r, 1, Z1Q);
      return;
    }
    const k = -Math.cos(Math.PI * fl), base = rectMix(Q2, NC, 1);
    const cr = S.crystalAt(c), tgt = cr ? { x: cr[0] - 60, y: cr[1] - 24, w: 120, h: 46 } : base;
    let r = { x: base.x, y: base.y + base.h * (1 - k) / 2, w: base.w, h: base.h * k };
    if (fy > 0) { r = rectMix(r, tgt, fy); r.y -= 120 * Math.sin(Math.PI * fy); }
    ctx.save(); F.float(ctx, t, 1); ctx.translate(r.x, r.y); ctx.scale(r.w / NC.w, r.h / NC.h); ctx.translate(-NC.x, -NC.y);
    panel(ctx, NC);
    const cx = NC.x + NC.w / 2;
    gline(ctx, 'SAFETY', cx, NC.y + 140, 112, span(t, a.safety - .1, a.safety + .6), { align: 'center' });
    line(ctx, 'MAY COME BEFORE', cx, NC.y + 210, 28, span(t, a.before - .25, a.before + .5), { align: 'center', col: P.cream });
    line(ctx, 'YOUR RETURN', cx, NC.y + 310, 80, span(t, a.ret - .1, a.ret + .6), { align: 'center', serif: true, weight: 400, col: COOL.text });
    ctx.restore();
  }
  // the landing: the crystal takes the card in (a soft glint)
  function land(ctx, t, c) {
    const g = F.bump(t, a.promise + 1.4, 1.4); if (g <= 0) return;
    const cr = S.crystalAt(c); if (cr) halo(ctx, cr[0], cr[1], cr[2] * 1.1, .4 * g, GOLD.halo, GOLD.core);
  }
  // ---------------------------------------------------------------- 4.08 the "$ ?" tag (same as S.crystalTag at u 1, swing 0 → plateCrystal)
  const tagU = (t) => span(t, a.price - .12, a.price + .95);
  const swing = (t) => { const s = t - a.can; return s <= 0 ? 0 : .16 * Math.sin(s * 5.2) * Math.exp(-s * 1.6) * (1 - span(t, a.next - 1.1, a.next - .55)); };
  return {
    keys, a,
    world: (t, st) => {
      if (t < A0 - .5) return;
      // the rooftop has left the frame (the camera is on the crystal): you and the jar stay behind, as in the plate
      if (t > a.chief + 1) { st.you = false; delete st.jar; }
      const u = tagU(t);
      if (u > 0) st.tag = (cx, r) => F.priceTag(cx, t, r.x + r.r * .48, r.y + r.r * .9, '$ ?', u, { len: 150, size: 34, swing: swing(t) });
    },
    veil: (t) => (t < A0 ? 0 : .82 * veilU(t)),
    over: (ctx, t, c) => {
      if (t < A0 - .5) return;
      bar(ctx, t); doc(ctx, t); facetScene(ctx, t, c); warnings(ctx, t); plain(ctx, t, c); land(ctx, t, c);
    },
  };
}
