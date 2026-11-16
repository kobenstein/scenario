// c01 · Hook · THE CITY UNDER THE CRYSTAL · thumbnail A (the crystal, a facet falls into your hand, AI GOES PUBLIC) · the shard's face
// becomes the banking app: a new name, ANT · the names you could already buy (CHIP MAKER, TECH GIANT) dim: this is different, AN AI LAB · a price (not yet set), BUY · the warning label drops
// from the crystal on a gold thread, THE SELLER stamps it · it unfolds into the quote card (prospectus, risk factors) · the card becomes
// the top page of a thick document · it opens: A PIECE ✓ | A SAY (the wheel of light behind glass) · the wheel flies into the tower
// window: the room, the dinner table, 7 + 4 · → plateWindow (lib/f59_world.mjs) at 'The seller is Anthropic'.
// 0 → T.G('The seller is Anthropic') · built by the lead (quality reference). Plan: docs/shots.md H.01–H.09 · world: docs/MOTION.md
// ONE entry, one world, one continuous camera (the explainers float over a night veil; the camera keeps gliding behind it).
//
// | ID    | anchor (phrase)              | picture (one idea)                                                          | camera                 |
// |-------|------------------------------|-----------------------------------------------------------------------------|------------------------|
// | H.01★ | This week, A.I. goes public  | THUMBNAIL A: the crystal, the shard falls into your hand on "goes public"; title | slow push · SCENE      |
// | H.02  | Picture this coming Thursday | push to the hand; the shard's face lights and grows into the phone screen   | push · MIX             |
// | H.03  | And between names            | the list; the new row ANT slides in; A · N · T light                        | creep · EXPL           |
// | H.04  | You could already buy chip makers | known rows labelled CHIP MAKER · TECH GIANT; "different": they dim, ANT gold-edged; tag AN AI LAB | creep · EXPL           |
// | H.05  | You tap it                   | the ANT page: the price rolls (NOT YET SET), the BUY button, a ? over it    | creep · EXPL           |
// | H.06  | It comes with a warning      | the phone sinks into the shard; pull back: a tag drops from the crystal on a gold thread; THE SELLER stamps it | pull back · MIX |
// | H.07  | Advanced A.I.                | the tag unfolds into the quote card; the words light as spoken              | glide left · EXPL      |
// | H.08  | That is printed              | the card becomes the top page of the thick PROSPECTUS; it opens: A PIECE ✓ | A SAY (the wheel behind glass) | glide · EXPL |
// | H.09  | That stays with a group      | the wheel flies into the tower window; the veil lifts: the room, the table, 7 + 4 → plateWindow | push in · SCENE |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f59_kit.mjs';
import * as S from '../lib/f59_world.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, smooth, halo, mixHex } = E;
const { rise, GOLD, PAPER, F0 } = F;

export const PRINT = F.PRINT59;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.pub = G('goes public'); a.picture = G('Picture this'); a.open = G('You open your banking'); a.between = G('And between names'); a.appears = G('a new name appears');
  a.three = G('Three letters'); a.ant = T.GW('A, N, T', null, a.three).map((w) => w.s);
  a.chips = G('chip makers'); a.giants = G('tech giants', a.chips); a.diff = G('This is different', a.chips); a.lab = G('A lab that builds', a.chips); a.nothing = G('and nothing else', a.lab);
  a.tap = G('You tap it'); a.price = G('A price appears'); a.button = G('And a button'); a.buy = G('buy', a.button + .3); a.what = G('So what exactly');
  a.warn = G('It comes with a warning'); a.label = G('warning label', a.warn); a.critic = G('Not from a critic'); a.seller = G('From the seller');
  a.adv = G('Advanced A.I.'); a.cat = G('catastrophic', a.adv); a.hum = GE('humanity', a.adv);
  a.printed = G('That is printed'); a.sales = G('sales document', a.printed); a.limit = G('And the same document');
  a.youbuy = G('You can buy a piece', a.limit); a.say = G("You can't buy a say"); a.goes = G('where it goes', a.say);
  a.stays = G('That stays with a group'); a.table = G('dinner table', a.stays); a.end = R.b;
  return [{ t: 0, draw: scene(a, T), print: PRINT }];
};

const CF = (u, v, s, sx, sy) => E.aim(F0, u, v, s, sx, sy);                 // the rooftop card
const CW = (s, du = 0, dv = 0) => E.aim(S.Z_CITY, S.WIN.x + S.WIN.w / 2 + du, S.WIN.y + S.WIN.h / 2 + 6 + dv, s);   // the tower window
const PH = { x: 690, y: 76, w: 540, h: 780 };                                    // the phone panel (screen)
const QC = { x: 300, y: 170, w: 1320, size: 50 };                                // the quote card
const DOC = { s: 400, y: 168 };                                                   // the prospectus (cover width, top)

function scene(a, T) {
  const tPlate = a.end - S.SEAM_HALF, tCreep = tPlate - 2.5;
  // ---------------------------------------------------------------- the camera (one take; behind the veil it glides to the tower)
  const K = [
    [0, CF(960, 540, 1.0)], [a.picture, CF(1000, 570, 1.07)], [a.open + .6, CF(1420, 770, 2.2)], [a.open + 1.8, CF(1440, 785, 2.9)],
    [a.what + 1.2, CF(1446, 788, 3.2)], [a.warn + 1.6, CF(1330, 560, 1.12)], [a.seller + 1.2, CF(1300, 540, 1.16)],
    [a.printed, CF(800, 520, .95)], [a.say, CW(1.5, 40)], [a.stays + .3, CW(1.8, 10)],
  ];
  const creepCam = (t) => { const k = 1 + S.CREEP * (t - tPlate); return S.WIN_CAM(k, S.trk(k) / 2.6 * .2); };
  const KALL = [...K, [tCreep, creepCam(tCreep)]];
  const camRaw = (t) => (t < tCreep ? F.camPath(t, KALL) : creepCam(t));
  const cam = (t) => { const c = camRaw(t), s = (F.REF - 0) / (F.REF - c.z); return E.camDrift(c, t, 8 / Math.max(1, s) * (1 - smooth(span(t, tPlate - 2.2, tPlate))), 5); };

  // ---------------------------------------------------------------- you and the shard
  const catchT = a.pub + .35;   // the shard lands on "goes public"
  const pose = (t) => {
    const down = sineIO(span(t, catchT + .2, a.open + .2)), up = sineIO(span(t, a.warn + .3, a.warn + 1.6)) * (1 - sineIO(span(t, a.adv - .2, a.adv + 1)));
    return { armR: [lerp(2.78, 1.05, down), lerp(2.98, 2.25, down)], armL: [-.18, -.12], look: lerp(lerp(.9, .3, down), .8, up) };
  };
  const fall = (t) => sineIO(span(t, -1.6, catchT));                            // the shard's fall (mid-air at frame 0, like the thumbnail)
  const GAPW = [1497, 551];                                                      // the gap (crystal card) = rooftop design px at home
  let HAND = [YOUHAND()[0], YOUHAND()[1]];
  function YOUHAND() { return [S.YOU.x + 60, S.YOU.y - 190]; }

  // ---------------------------------------------------------------- the app panel grows out of the shard's face
  const grow = (t) => sineIO(span(t, a.open - .1, a.open + 1.2)), shrink = (t) => sineIO(span(t, a.warn - .1, a.warn + 1.0));
  const panelM = (t) => grow(t) * (1 - shrink(t));
  function app(ctx, t, from) {
    const m = panelM(t); if (m <= 0) return;
    const r = { x: lerp(from.x, PH.x, m), y: lerp(from.y, PH.y, m), w: lerp(from.w, PH.w, m), h: lerp(from.h, PH.h, m) };
    ctx.save(); F.float(ctx, t, m);
    if (m < .999) { ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 40 * m); ctx.clip(); }
    const sc = r.w / PH.w; ctx.translate(r.x, r.y); ctx.scale(sc, sc); ctx.translate(-PH.x, -PH.y);
    const L = a.ant.map((s) => span(t, s - .1, s + .35));
    F.appScreen(ctx, t, PH, {
      rows: span(t, a.open + .7, a.between + .6), ant: span(t, a.appears - .05, a.appears + .75), letters: L,
      // the names you could already buy: rows 0–1 CHIP MAKER, rows 2–3 TECH GIANT (labels on the known rows) · "This is different": they dim,
      // the ANT row gets its gold edge · then its one tag AN AI LAB (gold on "and nothing else")
      kinds: [['CHIP MAKER', span(t, a.chips - .15, a.chips + .6), [0, 1]], ['TECH GIANT', span(t, a.giants - .15, a.giants + .6), [2, 3]]],
      diff: span(t, a.diff - .1, a.diff + .9),
      tags: [['AN AI LAB', span(t, a.lab, a.lab + .6), 0, span(t, a.nothing - .2, a.nothing + .5)]],
      tap: span(t, a.tap + .15, a.tap + 1.1), detail: span(t, a.tap + .35, a.tap + 1.35), price: span(t, a.price - .05, a.price + .8),
      buy: span(t, a.button, a.button + .7), press: span(t, a.buy - .05, a.buy + .55), q: span(t, a.what + .7, a.what + 1.5), a: clamp(m * 4),
    });
    ctx.restore();
  }

  // ---------------------------------------------------------------- the warning tag (on the crystal card), the quote card, the document
  const tagU = (t) => span(t, a.label - .25, a.label + .9);
  const unfold = (t) => sineIO(span(t, a.adv - .45, a.adv + 1.7));   // 2.15 s: a big area change, kept under the LURCH line
  let TAGBOX = null;   // the tag's screen box (for the unfold)
  function warnTag(ctx, t, r, c) {
    const u = tagU(t); if (u <= 0 || unfold(t) >= 1) return;
    const box = F.priceTag(ctx, t, r.gap[0], r.gap[1] + 18, 'WARNING', u, { len: 330, size: 30, swing: .04 * Math.sin(t * .8) });
    if (box) {
      F.stamp(ctx, t, 'THE SELLER', box.x, box.y + box.h * .78 + 10, { t0: a.seller + .1, size: 18, rot: -.08, ink: GOLD.deep });
      const p0 = E.project(c, S.Z_CRY, box.x - box.w / 2, box.y), p1 = E.project(c, S.Z_CRY, box.x + box.w / 2, box.y + box.h + 30);
      if (p0 && p1) TAGBOX = { x: p0[0], y: p0[1], w: p1[0] - p0[0], h: p1[1] - p0[1] };
    }
  }
  const toDoc = (t) => sineIO(span(t, a.printed - .05, a.printed + 1.1)), thick = (t) => expoOut(span(t, a.printed + .3, a.sales + .9));
  const openU = (t) => span(t, a.limit + .2, a.limit + 1.4);
  const docOut = (t) => sineIO(span(t, a.stays + .1, a.stays + 1.9));
  const docX = (t) => lerp(W / 2 - DOC.s / 2, W / 2, sineIO(openU(t)));
  let QH = 300;
  function quote(ctx, t) {
    const uf = unfold(t); if (uf <= 0) return;
    const td = toDoc(t), op = sineIO(openU(t)); if (op >= 1) return;
    const from = TAGBOX ?? { x: W / 2 - 60, y: 300, w: 120, h: 80 };
    // the card's rect: tag → full card → the document's cover (then it turns with the cover)
    const full = { x: QC.x, y: QC.y, w: QC.w, h: QH }, cov = { x: docX(t), y: DOC.y + DOC.s * 1.3 * .46, w: DOC.s, h: DOC.s * QH / QC.w };
    let r = { x: lerp(from.x, full.x, uf), y: lerp(from.y, full.y, uf), w: lerp(from.w, full.w, uf), h: lerp(from.h, full.h, uf) };
    if (td > 0) r = { x: lerp(full.x, cov.x, td), y: lerp(full.y, cov.y, td), w: lerp(full.w, cov.w, td), h: lerp(full.h, cov.h, td) };
    const k = r.w / QC.w;
    ctx.save(); F.float(ctx, t, 1); ctx.translate(r.x, r.y); ctx.scale(k * (1 - op), k); ctx.translate(-QC.x, -QC.y);
    const box = F.quoteCard(ctx, t, T, { text: F.SOURCES.s1riskText, mode: 'hi', x: QC.x, y: QC.y, w: QC.w, size: QC.size, head: 'RISK FACTORS',
      credit: F.SOURCES.s1risk, spoken: ['catastrophic', 'humanity'], after: a.adv, u: span(uf, .35, 1) });
    if (box) QH = box.h;
    ctx.restore();
  }
  // the open page: A PIECE ✓ (left) | A SAY: the wheel behind glass (right)
  const wheelFly = (t) => sineIO(span(t, a.stays + .05, a.stays + 2.1));
  const pieceU = (t) => span(t, a.youbuy, a.youbuy + .8), sayU = (t) => span(t, a.say, a.say + .8), glassU = (t) => span(t, a.goes - .1, a.goes + .7);
  const WHEEL_ON_PAGE = (x) => [x + DOC.s / 2, DOC.y + DOC.s * .5];
  function doc(ctx, t) {
    const td = toDoc(t); if (td <= 0) return;
    const out = docOut(t); if (out >= 1) return;
    ctx.save(); F.float(ctx, t, 1); ctx.translate(0, out * 900);
    const x = docX(t);
    F.prospectus(ctx, t, x, DOC.y, DOC.s, { u: 1, a: span(td, .55, .8), thick: thick(t), tabs: 0, open: openU(t), cover: 'PROSPECTUS', sub: 'FORM S-1',
      page: (cx, w, h) => {
        // left page (x < 0): A PIECE · the shard · ✓
        const pu = pieceU(t);
        F.shard(cx, t, -w / 2, h * .38, 120 * rise(pu), { glow: .5 * pu });
        F.goldText(cx, [['A PIECE', .2]], -w / 2, h * .66, 44, rise(span(pu, .2, 1)), { serif: false, weight: 600, align: 'center', col: PAPER.ink });
        if (pu > 0) { cx.strokeStyle = rgba(GOLD.deep, .95); cx.lineWidth = 7; cx.lineCap = 'round'; const q = expoOut(span(pu, .4, 1)); cx.beginPath(); cx.moveTo(-w / 2 - 34, h * .8); cx.lineTo(-w / 2 - 34 + 22 * Math.min(1, q * 2), h * .8 + 22 * Math.min(1, q * 2)); if (q > .5) cx.lineTo(-w / 2 - 12 + 50 * (q - .5) * 2, h * .8 + 22 - 50 * (q - .5) * 2); cx.stroke(); }
        // right page: A SAY · the wheel (until it flies) behind a pane that slides in on "where it goes"
        const su = sayU(t);
        cx.fillStyle = mixHex(P.night1, P.ind1, .5); cx.beginPath(); cx.roundRect(w * .14, h * .14, w * .72, h * .5 * expoOut(su), 12); cx.fill();
        if (wheelFly(t) <= 0) F.wheel(cx, t, w / 2, h * .39, 78 * rise(su), { glass: glassU(t), glow: .6 });
        F.goldText(cx, [['A SAY', 0]], w / 2, h * .8, 44, rise(span(su, .2, 1)), { serif: false, weight: 600, align: 'center', col: PAPER.ink });
      } });
    ctx.restore();
  }
  // the wheel flies from the page into the tower window, where the room's wheel takes over
  function flyingWheel(ctx, t, c) {
    const f = wheelFly(t); if (f <= 0 || f >= 1) return;
    const wr = S.winRect(c); if (!wr) return;
    const x0 = docX(t) + DOC.s / 2, y0 = DOC.y + DOC.s * 1.3 * .39, r0 = 78;
    const x1 = wr.x + wr.w * .5, y1 = wr.y + wr.h * .27, r1 = wr.h * .12;
    ctx.save(); F.float(ctx, t, 1 - f);
    F.wheel(ctx, t, lerp(x0, x1, f), lerp(y0, y1, f) - 60 * Math.sin(Math.PI * f), lerp(r0, r1, f), { glass: 1, glow: .6 + .2 * Math.sin(Math.PI * f) });
    ctx.restore();
  }
  // the veil: up while the phone, the card and the document speak; low while the tag drops from the crystal; gone into the room
  const veilA = (t) => .85 * grow(t) * (1 - shrink(t)) + .8 * unfold(t) * (1 - smooth(span(t, a.stays + .2, a.stays + 2.2)));

  // ---------------------------------------------------------------- one frame
  return (ctx, t) => {
    if (t >= tPlate) { S.plateWindow(ctx, t, T); return; }
    const c = cam(t), ps = pose(t), f = fall(t);
    const roomLit = lerp(.25, 1, smooth(span(t, a.stays + .2, a.stays + 2.0)));
    const out = S.cityWorld(ctx, c, t, {
      crystal: { gap: 1, glow: 1 },
      tag: (cx, r) => warnTag(cx, t, r, c),
      room: { lit: roomLit, seated: 1, wheel: { a: wheelFly(t) >= 1 ? 1 : 0, glass: 1 } },
      win: { lit: roomLit },
      you: { o: ps },
      beam: 1 - span(t, catchT, catchT + 1.5),
      extra: (cx, hands) => {
        if (hands?.R) HAND = hands.R;
        // the shard: falling from the gap (frame 0 = mid-air), then in your hand
        const inHand = t >= catchT, x = inHand ? HAND[0] + 4 : lerp(GAPW[0], HAND[0] + 4, f), y = inHand ? HAND[1] - 30 : lerp(GAPW[1], HAND[1] - 30, f) + 0;
        const s = 64, face = span(t, a.picture + .4, a.open) * (1 - span(t, a.warn + .6, a.warn + 1.4));
        if (panelM(t) < .98) F.shard(cx, t, x, y, s, { rot: inHand ? -.12 + .04 * Math.sin(t * .7) : lerp(.5, -.12, f), glow: 1 - .4 * span(t, catchT, catchT + 1), face });
        // the light that fell with it: a soft cone from the gap to the shard (dims after the catch)
        const bm = 1 - span(t, catchT, catchT + 1.6);
        if (bm > 0) { cx.save(); cx.globalCompositeOperation = 'lighter'; cx.fillStyle = E.lin(cx, GAPW[0], GAPW[1], x, y, [[0, rgba(GOLD.hot, .2 * bm)], [1, rgba(GOLD.halo, .02)]]);
          cx.beginPath(); cx.moveTo(GAPW[0] - 50, GAPW[1]); cx.lineTo(GAPW[0] + 50, GAPW[1]); cx.lineTo(x + 26, y); cx.lineTo(x - 26, y); cx.closePath(); cx.fill(); cx.restore(); }
      },
    });
    F.veil(ctx, veilA(t));
    // the phone grows out of the shard's face (its screen rect), the quote, the document, the flying wheel
    const sp = E.project(c, F0, HAND[0] + 4, HAND[1] - 30), sw = sp ? 64 * sp[2] : 40;
    app(ctx, t, sp ? { x: sp[0] - sw * .45, y: sp[1] - sw * .4, w: sw * .9, h: sw * 1.0 } : PH);
    doc(ctx, t);
    quote(ctx, t);
    flyingWheel(ctx, t, c);
    // H.01: the title (frame 0 = thumbnail A) and its small line
    F.title(ctx, t, 1, { out: span(t, a.picture - .1, a.picture + 1.8), sub: F.SOURCES.hookLine });
  };
}
