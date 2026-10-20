// Chunk C2 · §0 caveats and §1 inheritance up to Paine · shots 0.05–1.13 (19) · R.first → C3's cut · ★ 0.10, ★ 1.06
// Builder C2. Every accent is anchored to a VO word (T.S / T.W), never to seconds; the chunk range comes from R and carry().
//
// PLAN (MOTION.md gate 1) — hero onset (word) · carrier into the next shot · transition · accent
// | shot  | words                                        | hero onset                                          | carrier → next                                 | type        | acc |
// |-------|----------------------------------------------|-----------------------------------------------------|------------------------------------------------|-------------|-----|
// | 0.05  | Both are promises, not contracts.            | Anthropic's sheet joins Musk's (camera rises);      | the empty signature line under Anthropic's     | (b) zoom    | ▲   |
// |       |                                              | "PROMISE" punched through both on "contracts"       | sheet                                          |             |     |
// | 0.05a | For now, the pledged shares sit in a fund …  | the line becomes the fund box; the foil slice glides| the closed guilloche ring                      | (b) iris    |     |
// |       |                                              | in on "shares"; the ring closes on "wholly owns"    |                                                |             |     |
// | 0.08  | And the pledge comes just before … public.   | brass bell from below; "IPO PLANNED" punched on     | the bell's highlight                           | (b) iris    |     |
// |       |                                              | "plans"; the clapper trembles on "public", no ring  |                                                |             |     |
// | 0.10  | But whatever the motives, imagine every …    | 7 medallions turn restless on "motives"; a glint    | the wedges sink, the camera tilts down after   | (a) down    | ★   |
// |       |                                              | sweeps each face and 50 ms later its foil wedge pops| them on "did the same"                         |             |     |
// |       |                                              | toward us: front→back, 60 ms apart, "every company" |                                                |             |     |
// | 0.11  | And imagine your share grew every time …     | wedges rain into the coin; rosettes grow on "grew"  | the coin                                       | (b) iris    |     |
// |       |                                              | ×2, the coin swells 80 ms after each                |                                                |             |     |
// | 1.01a | Why would any of it be yours?                | a hand reaches up, the coin evades, hovers on "yours"| the coin rises                                 | (a) up      |     |
// | 1.01b | They built it.                               | the beam sets down on "built", a lamp flickers on   | the hauled beam                                | (b) zoom    |     |
// | 1.05  | But look at what they built it from.         | macro glide along the paper beam, faster on "from"  | a page comes loose                             | (a) up      |     |
// | 1.06  | So much of what people ever wrote down.      | fragments rise and whirl; outline of a building on  | three fragments fly at the camera              | (a) push    | ★   |
// |       |                                              | "wrote down"                                        |                                                |             |     |
// | 1.07a | Books and letters.                           | the book riffles on "Books"; envelopes on "letters" | a letter flies right                           | (a) left    |     |
// | 1.07b | Songs and research.                          | staff lines flow into the lab grid; data on         | the flow to the right                          | (c) whipL   |     |
// |       |                                              | "research"                                          |                                                |             |     |
// | 1.07c | Code.                                        | one listing line lights on "Code"                   | the paper folds                                | (a) down    |     |
// | 1.08  | A grandmother's recipe, shared online.       | the old hand smooths the card; a young hand's phone | the photo flies up                             | (a) up      |     |
// |       |                                              | photographs it, flash on "shared"                   |                                                |             |     |
// | 1.09  | A forum answer, written for a stranger.      | the answer peels off, folds into a plane; caught on | the plane circles up                           | (a) up      |     |
// |       |                                              | "stranger"                                          |                                                |             |     |
// | 1.10a | That's what AI is learning from.             | all fragments flow into the scaffold, it glows      | the crane keeps rising                         | plan seq.   |     |
// | 1.10b | All of us.                                   | the crowd; every sheet lights on "us"               | one sheet in a hand                            | (b) zoom    | ▲   |
// | 1.11  | So a share of what it makes isn't charity.   | coin into the tin cup; the sheet tears on "charity" | the halves fall away, 1.12 lies beneath        | reveal/cut  |     |
// | 1.12  | It's an inheritance.                         | engraved chest; lid swings open on "inheritance"    | the light from the chest opening               | (b) zoom    |     |
// | 1.13  | Thomas Paine put it this way: "not charity … | the spoken words ink in; "right" turns foil         | carry('c02>c03') light: the page sinks, the    | (a) cut     |     |
// |       |                                              |                                                     | word stays as a point of light                 |             |     |
// Carriers in: carry('c01>c02') own (Musk's sheet at C.pos(t)); out: carry('c02>c03') light ("right" at (1150, 600) at C.t − 1 s).
import { W, H, rgba, clamp, lin, mix, eout, eio, ein, sm, prng, drift, canvas, text, addGlow } from '../engine.mjs';
import { carry } from '../lib/carry.mjs';
import { plateBG, umberBG, vignette, anthSheet, muskSheet, emptySeal, plateSigLine, medal, wedge, wedgeCentre, coin, once, PAL0, PAL1, TAU, ANTH } from '../lib/sc02_kit.mjs';
import { bell } from '../lib/sc02_bell.mjs';
import { book, envelope, songLabBand, dataSeries, BAND, listingSheet, LISTING, recipeCard, plane, inheritancePrint, inheritanceBase, IPRINT, charityPrint, quadImage } from '../lib/sc02_objects.mjs';
import { scaffold } from '../lib/scaffold.mjs';
import { paperSwarm, drawFragment } from '../lib/paperswarm.mjs';
import { perforateText } from '../lib/perforate.mjs';
import { guilloche, rosette, microRing, microtext, gBorder, FOIL } from '../lib/certificate.mjs';
import { ghostLine } from '../lib/ghost.mjs';
import { hand, palmPos, handTip } from '../lib/hand.mjs';
import { heldPhone, phone } from '../lib/phone.mjs';
import { figure, POSES, handPos } from '../lib/figure.mjs';
import { shareLight } from '../lib/share.mjs';
import { pen } from '../lib/paper.mjs';
import { cone as artCone, fog as artFog } from '../lib/art.mjs';
// Musk's card is C1's own muskCard at the cut (identical object); if C1's file ever fails to load, our copy (same quoteCard2 options) stands in
const SC01 = await import('../lib/sc01_sheets.mjs').catch(() => null);

export default (T, R) => {
  const wd = (seg, phrase, k = 0) => { const ws = T.W(seg, phrase, phrase); return ws[k < 0 ? ws.length + k : k]; };
  const S0 = (p) => T.S('00a', p), S1 = (p) => T.S('01a', p), E0 = (p) => T.E('00a', p), E1 = (p) => T.E('01a', p);
  const C1 = carry('c01>c02', T, R), C3 = carry('c02>c03', T, R);
  const K = {
    cut: C1.t, both: S0('Both are promises'), promises: wd('00a', 'Both are promises', 2).s, contracts: wd('00a', 'not contracts', 1).s, contractsE: E0('not contracts'),
    forNow: S0('For now'), now: wd('00a', 'For now', 1).s, pledged: S0('pledged shares'), shares: wd('00a', 'pledged shares', 1).s, sit: S0('sit in a fund'), fund: wd('00a', 'sit in a fund', 3).s,
    wholly: S0('wholly owns'), owns: wd('00a', 'wholly owns', 1).s, ownsE: E0('wholly owns'),
    andPledge: S0('And the pledge'), pledge: wd('00a', 'And the pledge', 2).s, plans: S0('plans to go'), public: wd('00a', 'plans to go public', 3).s, publicE: E0('plans to go public'),
    but: S0('But whatever'), motives: wd('00a', 'whatever the motives', 2).s, motivesE: E0('whatever the motives'), every: S0('every company building'), company: wd('00a', 'every company building', 1).s,
    same: wd('00a', 'did the same', 2).s, sameE: E0('did the same'),
    andImagine: S0('And imagine your'), share: wd('00a', 'imagine your share', 2).s, grew1: wd('00a', 'share grew every', 1).s, grew2: wd('00a', 'they grew', 1).s, grewE: E0('they grew'),
    why: S1('Why would'), yours: wd('01a', 'be yours', 1).s, yoursE: E1('be yours'),
    they: S1('They built it'), built: wd('01a', 'They built it', 1).s, builtE: E1('They built it'),
    look: S1('But look at'), from: wd('01a', 'built it from', 2).s, fromE: E1('built it from'),
    so: S1('So much of'), wrote: wd('01a', 'ever wrote down', 1).s, down: wd('01a', 'ever wrote down', 2).s, downE: E1('ever wrote down'),
    books: S1('Books and'), letters: wd('01a', 'Books and letters', 2).s, songs: S1('Songs and'), research: wd('01a', 'Songs and research', 2).s,
    code: S1('Code'), codeE: E1('Code'), recipe: S1("A grandmother's recipe"), recipeW: wd('01a', "A grandmother's recipe", 2).s, shared: wd('01a', 'recipe, shared online', 1).s, onlineE: E1('shared online'),
    forum: S1('A forum answer'), answer: wd('01a', 'A forum answer', 2).s, written: S1('written for a'), stranger: wd('01a', 'for a stranger', 2).s, strangerE: E1('for a stranger'),
    thats: S1("That's what AI"), learning: wd('01a', 'AI is learning', 2).s, learnE: E1('is learning from'),
    all: S1('All of us'), us: wd('01a', 'All of us', 2).s, usE: E1('All of us'),
    so2: S1('So a share'), share2: wd('01a', 'So a share', 2).s, makes: wd('01a', 'what it makes', 2).s, charity: wd('01a', "isn't charity", 1).s, charityE: E1("isn't charity"),
    its: S1("It's an inheritance"), inheritance: wd('01a', "It's an inheritance", 2).s, inhE: E1("It's an inheritance"),
    thomas: S1('Thomas Paine'), way: wd('01a', 'it this way', 2).s, right: wd('01a', 'but a right', 2).s, rightE: E1('but a right'), out: C3.t,
  };
  const muskWords = T.W('00a', 'This will', 'many');
  const shots = [];

  // ================= 0.05 · two sheets, two promises: PROMISE punched through both =================
  const cam05 = (t) => { const u = eio(clamp((t - K.cut) / (K.forNow - K.cut))); return { k: 1 - .06 * u, dy: 30 * u }; };
  const camPt = (c, x, y) => [960 + (x - 960) * c.k, 540 + c.dy + (y - 540) * c.k];
  const A05 = { x: 600, y: 520, s: .64, rot: -.024 };
  const anthAt = (t) => ({ ...A05, x: mix(-560, A05.x, eout(lin(K.cut - .05, K.cut + 1.05, t))) });
  const line05 = (t) => { const a = anthAt(t); return { x: a.x - 236, y: a.y + 222, w: 270 }; };
  const draw05 = (ctx, t) => {
    const sober = sm(lin(K.cut + .4, K.contractsE, t));
    plateBG(ctx, t, { warm: mix(1, .4, sober), cool: sober });
    const c = cam05(t); ctx.save(); ctx.translate(960, 540 + c.dy); ctx.scale(c.k, c.k); ctx.translate(-960, -540);
    const p = C1.pos(t), a = anthAt(t), L = line05(t), ap = sm(lin(K.promises - .2, K.promises + .5, t));
    // the empty signature lines and seal rings on the plate under each sheet
    plateSigLine(ctx, L.x, L.y, L.w, t, { a: ap }); emptySeal(ctx, a.x + 196, a.y + 222, 40, t, { a: ap });
    plateSigLine(ctx, p.x - 250, p.y + 150, 250, t, { a: ap }); emptySeal(ctx, p.x + 180, p.y + 150, 36, t, { a: ap });
    anthSheet(ctx, t, a.x, a.y, a.s, a.rot);
    let drawn = false; if (SC01?.muskCard) { ctx.save(); try { SC01.muskCard(ctx, t, p.x, p.y, p.s, p.r, muskWords, { hi: ['many'] }); drawn = true; } catch { /* C1's helper changed: our copy stands in */ } ctx.restore(); }
    if (!drawn) muskSheet(ctx, t, p.x, p.y, p.s, p.r, muskWords);
    // "PROMISE" punched through both sheets on "contracts" (pinholes, light through them)
    const u = lin(K.contracts - .02, K.contracts + .42, t);
    if (u > 0) {
      perforateText(ctx, 'PROMISE', a.x + 10, a.y + 40, { size: 64, pitch: 6, hole: 1.6, u, t, rot: a.rot, onPaper: true, spacing: 9 });
      perforateText(ctx, 'PROMISE', p.x + 4, p.y - 6, { size: 56, pitch: 6, hole: 1.5, u: lin(K.contracts + .05, K.contracts + .47, t), t, rot: p.r, onPaper: true, spacing: 8 });
    }
    ctx.restore();
    vignette(ctx, .45);
  };
  shots.push({ t: C1.into.t, tr: C1.into.tr, x: C1.into.x, y: C1.into.y, d: C1.into.d, draw: draw05, print: { riso: .2 },
    sound: [{ f: 'paper_pop', t: K.contractsE + .05, v: .2 }] });

  // ================= 0.05a · the fund box inside Anthropic's rosette; the ring closes =================
  const t05a = K.forNow - .25, c05a = cam05(t05a), Lz = line05(t05a), lz = camPt(c05a, Lz.x + Lz.w / 2, Lz.y);
  const BOX = { x: 960, y: 520, w: 330, h: 150 }, RING = { x: 960, y: 520, r: 252 };
  const ringPts = (rr, ph, waves, band, u) => { const out = [], N = Math.max(2, Math.round(360 * u)); for (let i = 0; i <= N; i++) { const a = -Math.PI / 2 + i / 360 * TAU, d = band * .42 * (Math.sin(a * waves + ph) * .75 + Math.sin(a * waves * 2.03 - ph * 1.5) * .25); out.push([RING.x + Math.cos(a) * (rr + d), RING.y + Math.sin(a) * (rr + d)]); } return out; };
  const draw05a = (ctx, t) => {
    plateBG(ctx, t, { warm: .45, cool: .8 });
    const pull = eout(lin(t05a + .15, t05a + 1.6, t)), k = mix(1.12, 1, pull);
    ctx.save(); ctx.translate(960, 540); ctx.scale(k, k); ctx.translate(-960, -540 + 20 * (1 - pull));
    // Anthropic's rosette draws in around the box
    const ru = eout(lin(t05a + .02, t05a + 1.5, t));
    if (ru > 0) { if (ru >= 1) rosette(ctx, 960, 520, { R: 330, A: 46, B: 18, n: 20, m: 7, lines: 36, col: PAL0.cream, w: .9, a: .38, cache: true, rot: t * .01 }); else rosette(ctx, 960, 520, { R: 330, A: 46, B: 18, n: 20, m: 7, lines: 36, col: PAL0.cream, w: .9, a: .38, u: ru, rot: t * .01 }); }
    // the line (arriving from 0.05, 1300 px wide at the screen centre) shortens and becomes the box's top edge, the sides draw down
    const lu = eio(lin(t05a + .1, t05a + .85, t)), half = mix(650, BOX.w / 2, lu), ly = mix(540, BOX.y - BOX.h / 2, lu);
    ctx.strokeStyle = rgba(PAL0.cream, .92); ctx.lineWidth = mix(1.8, 2.2, lu); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(960 - half, ly); ctx.lineTo(960 + half, ly); ctx.stroke();
    const su = eout(lin(t05a + .7, t05a + 1.3, t));
    if (su > 0) { const x0 = BOX.x - BOX.w / 2, x1 = BOX.x + BOX.w / 2, y0 = BOX.y - BOX.h / 2, y1 = BOX.y + BOX.h / 2;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, mix(y0, y1, su)); ctx.moveTo(x1, y0); ctx.lineTo(x1, mix(y0, y1, su)); if (su > .98) { ctx.moveTo(x0, y1); ctx.lineTo(x1, y1); } ctx.stroke();
      ctx.save(); ctx.globalAlpha = su * .6; ctx.lineWidth = 1; ctx.strokeRect(x0 + 8, y0 + 8, BOX.w - 16, BOX.h - 16); ctx.restore();
      microtext(ctx, x0 + 12, y1 - 16, BOX.w - 24, 'FUND · HELD IN TRUST FOR NOW ', { size: 8, col: PAL0.cream, a: .55 * su }); }
    // label FUND on "fund"
    const fu = sm(lin(K.fund - .05, K.fund + .35, t)); if (fu > 0) text(ctx, 'FUND', BOX.x, BOX.y - BOX.h / 2 - 22, { size: 18, weight: 700, color: rgba(PAL0.cream, .85 * fu), spacing: 8, align: 'center' });
    // the pledged foil slice glides in on "shares" and settles in the box
    const gu = eio(lin(K.shares - .15, K.sit + .25, t));
    if (gu > 0) { const wx = mix(1500, BOX.x + 20, gu), wy = mix(160, BOX.y + 22, gu), rot = mix(-.9, .62, gu);
      wedge(ctx, wx, wy, 210, rot, t, { v: 1, glint: lin(K.sit + .2, K.sit + .75, t) > 0 && lin(K.sit + .2, K.sit + .75, t) < 1 ? lin(K.sit + .2, K.sit + .75, t) : -1 });
      if (gu >= 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, BOX.x + 20, BOX.y + 10, 160, .12 + .04 * Math.sin(t * 2), '#ffb35c', '#fff1d6'); ctx.restore(); } }
    // the outer guilloche ring closes around the box like a fence on "wholly owns"
    const cu = eout(lin(K.wholly - .05, K.owns + .35, t));
    if (cu > 0) { ctx.save(); ctx.strokeStyle = rgba(PAL0.cream, .8); ctx.lineWidth = 1.1;
      for (let i = 0; i < 5; i++) { const P = ringPts(RING.r, i / 5 * TAU, 72, 30, cu); ctx.beginPath(); P.forEach(([x, y], j) => (j ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); }
      ctx.lineWidth = 1.6; for (const off of [-15, 15]) { const P = ringPts(RING.r + off, 0, 0, 0, cu); ctx.beginPath(); P.forEach(([x, y], j) => (j ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); }
      // the closing point flares once
      if (cu < 1) { const P = ringPts(RING.r, 0, 0, 0, cu), e = P[P.length - 1]; ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, e[0], e[1], 50, .5, '#ffb35c', '#fff1d6'); }
      ctx.restore();
      const mu = sm(lin(K.owns, K.owns + .5, t)); if (mu > 0) microRing(ctx, RING.x, RING.y, RING.r + 34, 'WHOLLY OWNED BY ANTHROPIC', { size: 10, col: PAL0.cream, a: .75 * mu, rot: t * .05 });
    }
    const pu = lin(K.owns - .05, K.owns + .4, t); if (pu > 0) perforateText(ctx, 'WHOLLY OWNED', 960, 860, { size: 40, pitch: 5.5, hole: 1.4, u: pu, t, spacing: 6, light: '#ffe2b0' });
    ctx.restore();
    vignette(ctx, .45);
  };
  shots.push({ t: t05a, tr: 'zoom', x: lz[0], y: lz[1], depth: 5, d: .8, draw: draw05a, print: { riso: .2 } });

  // ================= 0.08 · the brass bell, IPO planned, the clapper trembles on "public" =================
  const t08 = K.andPledge - .3, BELL = { x: 1150, y: 250, s: 1.05 };
  const bellCam = (t) => { const u = eio(lin(t08 + .05, t08 + 1.5, t)); return { u, s: mix(1.42, BELL.s, u), x: mix(960, BELL.x, u), y: mix(520 - 1.42 * 300, BELL.y, u) }; };
  const coneLayer = () => once('bellcone', () => { const [c, g] = canvas(W, H); artCone(g, 760, -140, { dir: Math.PI / 2 - .42, spread: .3, len: 1350, col: '#ffd59a', a: .42, k: .6, seed: 4, soft: .45 }); return c; });
  const ipoSheet = () => once('iposheet', () => { const [c, g] = canvas(560, 760); g.translate(40, 40); g.save(); g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 24; g.shadowOffsetX = 12; g.shadowOffsetY = 16; g.fillStyle = '#e9dcbc'; g.fillRect(0, 0, 480, 680); g.restore();
    const pg = g.createLinearGradient(0, 0, 480, 680); pg.addColorStop(0, '#f1e6cb'); pg.addColorStop(1, '#d8c7a2'); g.fillStyle = pg; g.fillRect(0, 0, 480, 680); gBorder(g, 14, 14, 452, 652, { band: 18, lines: 5, waves: 110, col: '#2a3550', a: .45, w: .7, radius: 8 });
    const r = prng(9); g.fillStyle = 'rgba(31,42,58,.28)'; for (let i = 0; i < 14; i++) { let x = 60; const y = 120 + i * 24, end = 420 - r() * 60; while (x < end) { const ww = 12 + r() * 40; g.fillRect(x, y, Math.min(ww, end - x), 6); x += ww + 8; } } return c; });
  let hi08 = [BELL.x - 70, BELL.y + 130];
  const draw08 = (ctx, t) => {
    ctx.fillStyle = '#0c0c22'; ctx.fillRect(0, 0, W, H); plateBG(ctx, t, { warm: .25, cool: .3 });
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .85; ctx.drawImage(coneLayer(), 0, 0); ctx.restore();
    // the sheet with the third perforation slides in at the left edge
    const si = eout(lin(K.pledge - .1, K.pledge + .7, t)), sx = mix(-560, -50, si) + drift(t, 4, 5);
    if (si > 0) { ctx.save(); ctx.translate(sx, 170); ctx.rotate(.05); ctx.drawImage(ipoSheet(), 0, 0);
      const pu = lin(K.plans - .05, K.plans + .5, t); if (pu > 0) perforateText(ctx, 'IPO PLANNED', 262, 470, { size: 33, pitch: 5.6, hole: 1.5, u: pu, t, spacing: 5, onPaper: true });
      ctx.restore(); }
    // the bell: a slow breath of a sway; on "public" the clapper trembles but never reaches the lip
    const c = bellCam(t), dt = t - K.public, trem = dt > 0 ? .06 * Math.sin(dt * 34) * Math.exp(-dt * 2.6) * sm(clamp(dt / .05)) : 0;
    const sway = .018 * Math.sin(t * 1.1) + (dt > 0 ? .012 * Math.sin(dt * 9) * Math.exp(-dt * 2) : 0);
    const B = bell(ctx, c.x, c.y, c.s, t, { sway, clapper: trem, mouth: .34, glint: lin(K.public - .3, K.public + .6, t) > 0 && t < K.public + .6 ? lin(K.public - .3, K.public + .6, t) : -1 });
    hi08 = B.hi;
    // the hero highlight (carrier into 0.10)
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, B.hi[0], B.hi[1], 46 * c.s, .5 + .12 * Math.sin(t * 2.4), '#ffb35c', '#fff1d6'); ctx.restore();
    // dust in the cone
    const r = prng(3); ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 70; i++) { const x0 = 700 + r() * 700, y0 = r() * 900, x = x0 + Math.sin(t * .4 + i) * 20 + (t * 8 * (r() - .5)), y = (y0 + t * (6 + r() * 10)) % 1000; ctx.fillStyle = rgba('#ffe2b0', .1 + .25 * r()); ctx.fillRect(x, y, 1.6, 1.6); } ctx.restore();
    const lu = sm(lin(K.public - .3, K.public + .3, t)); if (lu > 0) text(ctx, 'STOCK MARKET DEBUT PLANNED', 1150, 880, { size: 20, weight: 600, color: rgba(PAL0.cream, .8 * lu), spacing: 5, align: 'center' });
    vignette(ctx, .55);
  };
  shots.push({ t: t08, tr: 'iris', x: RING.x, y: RING.y, r: RING.r, d: .8, draw: draw08, print: { riso: .25 } });

  // ================= 0.10 ★ · seven medallions, the foil cascade =================
  const t10 = K.but - .25;
  const HI = [BELL.x - .635 * 300 * BELL.s * .34, BELL.y + 300 * BELL.s * .42];   // the bell's highlight at rest = the hero light at the back
  const MEDS = Array.from({ length: 7 }, (_, i) => ({ i, Z: 1.24 + i * .6, X: -.86 + .05 * (i % 2), Y: .52 - .04 * (i % 3), R0: 330, v: i % 4, yaw: .5 + .03 * i, ph: i * 1.7 }));
  const fogL = (k) => once('fog10' + k, () => { const [c, g] = canvas(W, H); artFog(g, { y0: 250 + k * 60, y1: 900 + k * 40, col: '#7d86b8', a: .5, seed: 4 + k, sx: .003, sy: .012, cover: .55, soft: .4, k: .5 }); return c; });
  const med10 = (t) => {
    const cu = eio(lin(t10 - .2, K.sameE + .4, t)), cx = mix(-.12, .1, cu), cz = mix(0, .24, cu), f = 760;
    const env = Math.exp(-Math.pow((t - K.motives - .35) / .55, 2));   // "motives": restless
    return MEDS.map((m) => {
      const z = m.Z - cz, X = m.X - cx, sx = HI[0] + X * f / z, sy = HI[1] + m.Y * f / z, R = m.R0 / z * .95;
      const tr = K.every + .06 * m.i, rel = clamp((t - tr) / .45), fall = Math.max(0, t - tr - .5);
      const rot = .15 + ((m.i % 3) - 1) * .12 + .05 * (t - t10) * (m.i % 2 ? 1 : -1) + .38 * env * Math.sin((t - K.motives) * 6.5 + m.ph), ring = -t * .25 - 1.6 * env * Math.sin((t - K.motives) * 4 + m.ph);
      const yaw = m.yaw + .18 * env * Math.sin((t - K.motives) * 5 + m.ph * 1.3) + .03 * Math.sin(t * .7 + m.ph);
      return { ...m, x: sx, y: sy, R, z, tr, rel, fall, rot, ring, yaw };
    }).sort((a, b) => b.z - a.z);
  };
  // the camera starts to tilt down on "did the same" (the 'down' cut into 0.11 continues that move)
  const tilt10 = (t) => -170 * ein(lin(K.same - .25, K.andImagine - .3 + .35, t));
  const wedgeState = (m, t) => {   // where the released segment is (screen): it pops toward the camera on the light's hit, tumbles and sinks
    const [wx, wy] = wedgeCentre(m.R, m.rot), sq0 = Math.max(.08, Math.cos(m.yaw)), pz = Math.pow(1.24 / m.z, .6);
    const pop = eout(clamp((t - m.tr) / .38)), mid = (-.95 - .55) / 2 + m.rot, out = pop * m.R * .3;
    // out of its slot, then toward the camera (away from the vanishing point, larger)
    const bx = m.x + wx * sq0 + Math.cos(mid) * out * sq0, by = m.y + wy + Math.sin(mid) * out, near = .55 * pop;
    const f = Math.max(0, t - m.tr - .32), fy = (125 * f * f + 26 * f) * pz, fx = (-30 * f + 26 * Math.sin(f * 2.3 + m.ph)) * pz;
    const th = f * (3.4 + .6 * (m.i % 3)) * (m.i % 2 ? 1 : -1), sq = sq0 * Math.cos(th);       // tumbling: the face turns away and back
    const flash = Math.exp(-Math.pow((t - m.tr - .05) / .1, 2)) + (f > 0 ? .8 * Math.pow(Math.max(0, Math.cos(th)), 16) * sm(clamp(f / .4)) : 0);
    return { x: bx + (bx - HI[0]) * near + fx, y: by + (by - HI[1]) * near + fy, rot: m.rot + f * (.5 + .12 * m.i) * (m.i % 2 ? 1 : -1), sq, k: 1 + near, flash, glint: clamp((t - m.tr) / .5) };
  };
  const draw10 = (ctx, t) => {
    ctx.fillStyle = '#0a0a1e'; ctx.fillRect(0, 0, W, H); plateBG(ctx, t, { warm: .15, cool: .2 });
    // the hero light at the back (the bell's highlight, opened by the iris)
    const ty = tilt10(t);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, HI[0], HI[1] + ty * .5, 520, .34, '#ffb35c', '#fff1d6'); addGlow(ctx, HI[0], HI[1] + ty * .5, 70, .7, '#ffb35c', '#fff1d6'); ctx.restore();
    const M = med10(t), freed = [];
    M.forEach((m, j) => {
      m.y += ty * Math.pow(1.24 / m.z, .5);
      // fog between the depth planes (five planes: 7 medallions, fog after the 2nd, 4th and 6th from the back)
      if (j === 2 || j === 4 || j === 6) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .22; ctx.drawImage(fogL(j), -60 + 40 * Math.sin(t * .2 + j) - (j * 12) * (t - t10), ty * .3, W * 1.1, H); ctx.restore(); }
      const shade = clamp(.45 + .55 * (1.25 / m.z));
      medal(ctx, m.x, m.y, m.R, t, { v: m.v, rot: m.rot, ring: m.ring, yaw: m.yaw, out: t > m.tr ? 1 : 0, edge: 12, light: .9, a: shade });
      // the wave of foil glint: light sweeps across each face (cause), 50 ms after it reaches the segment the segment pops (effect)
      const q = lin(m.tr - .3, m.tr + .12, t);
      if (q > 0 && q < 1) { const sq = Math.max(.08, Math.cos(m.yaw)), R = m.R, gx = mix(-1.3, 1.3, eio(q)) * R;
        ctx.save(); ctx.translate(m.x, m.y); ctx.scale(sq, 1); ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.clip(); ctx.rotate(-.75 + m.rot);
        const g = ctx.createLinearGradient(gx - R * .45, 0, gx + R * .45, 0); g.addColorStop(0, 'rgba(255,190,110,0)'); g.addColorStop(.5, `rgba(255,236,200,${.42 * Math.sin(Math.PI * q) * shade})`); g.addColorStop(1, 'rgba(255,190,110,0)');
        ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(-R * 1.5, -R * 1.5, R * 3, R * 3); ctx.restore(); }
      if (t > m.tr) freed.push([m, shade]);
    });
    // the freed segments come toward us, in front of every medallion (back ones first)
    for (const [m, shade] of freed) { const w = wedgeState(m, t);
      wedge(ctx, w.x, w.y, m.R * w.k, w.rot, t, { v: m.v, sq: w.sq, glint: w.glint < 1 ? w.glint : -1, a: Math.min(1, shade + .45) });
      if (w.flash > .02) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, w.x, w.y, m.R * w.k * .7, .45 * Math.min(1, w.flash), '#ffb35c', '#fff1d6'); ctx.restore(); } }
    vignette(ctx, .5);
  };
  shots.push({ t: t10, tr: 'iris', x: HI[0], y: HI[1], r: 18, d: .8, draw: draw10, print: { riso: .25 }, sound: [{ f: 'shimmer_rings', t: K.motivesE + .04, v: .12 }] });

  // ================= 0.11 · the segments rain into your coin; it grows each time they grow =================
  const t11 = K.andImagine - .3, COIN = { x: 960, y: 470, R: 128 };
  const grow = (t, w0) => eout(lin(w0, w0 + .45, t));
  const coinR = (t) => COIN.R * (1 + .14 * grow(t, K.grew1 + .08) + .14 * grow(t, K.grew2 + .08)) * (1 + .015 * Math.sin(t * 2.1) * sm(lin(K.grewE, K.grewE + .4, t)));
  const draw11 = (ctx, t) => {
    ctx.fillStyle = '#0a0a1e'; ctx.fillRect(0, 0, W, H); plateBG(ctx, t, { warm: .2, cool: .2 });
    // the seven rosettes stand behind in an arc and grow on each "grew"
    const gs = 1 + .16 * grow(t, K.grew1) + .16 * grow(t, K.grew2);
    for (let i = 0; i < 7; i++) { const a = Math.PI * (1.08 + i / 6 * .84), rr = 560, x = 960 + Math.cos(a) * rr * 1.1, y = 640 + Math.sin(a) * rr * .62, R = (52 + (i % 3) * 8) * gs;
      medal(ctx, x, y, R, t, { v: i % 4, rot: t * .04 * (i % 2 ? 1 : -1), ring: -t * .2, yaw: .2 * Math.sin(i), out: 1, edge: 8, light: .6, a: .5 }); }
    // the wedges fall in from above (continuing the cascade) and vanish into the coin with a flash each
    const R = coinR(t);
    for (let i = 0; i < 7; i++) { const ta = t11 + .25 + i * .11, q = clamp((t - (ta - .7)) / .7); if (q <= 0 || q >= 1) continue; const e = ein(q);
      const x0 = 300 + i * 220, y0 = -160; wedge(ctx, mix(x0, COIN.x, e), mix(y0, COIN.y, e), 120 * (1 - .6 * e), i * .9 + q * 2, t, { v: i % 4, a: 1 - sm(clamp((q - .85) / .15)) }); }
    let flash = 0; for (let i = 0; i < 7; i++) { const ta = t11 + .25 + i * .11; flash += Math.exp(-Math.pow((t - ta) / .08, 2)); }
    const gl = (w0) => lin(w0 + .1, w0 + .7, t);
    const glint = [gl(K.grew1 + .08), gl(K.grew2 + .08), lin(K.grewE + .7, K.grewE + 1.5, t)].find((v) => v > 0 && v < 1) ?? -1;
    coin(ctx, COIN.x, COIN.y, R, t, { glint, rot: t * .03, light: 1 });
    if (flash > .01) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, COIN.x, COIN.y, R * 1.8, .35 * Math.min(1, flash), '#ffb35c', '#fff1d6'); ctx.restore(); }
    const lu = sm(lin(K.share - .1, K.share + .4, t)); if (lu > 0) text(ctx, 'YOUR SHARE', COIN.x, COIN.y + R + 70, { size: 22, weight: 700, color: rgba(PAL0.cream, .85 * lu), spacing: 9, align: 'center' });
    vignette(ctx, .5);
  };
  shots.push({ t: t11, tr: 'down', d: .7, draw: draw11, print: { riso: .25 }, sound: [{ f: 'coin', t: K.grewE + .12, v: .2 }] });

  // ================= 1.01a · the coin hovers over your open hand =================
  const t01a = K.why - .45, R11end = coinR(t01a);
  const HAND1 = { x: 600, y: 1030, s: 2.4, ang: -.72 };
  const coin01 = (t) => {
    const pull = eout(lin(t01a + .3, t01a + 1.3, t)), base = { x: mix(COIN.x, 800, pull), y: mix(COIN.y, 470, pull), R: mix(R11end, 62, pull) };
    const h = hand01(t), pp = palmPos(h.x, h.y, h.s, { pose: 'open', ang: HAND1.ang }), goal = [pp[0] + 70, pp[1] - 210];
    const ev = eio(lin(K.yours - .8, K.yours - .3, t)), set = eio(lin(K.yours - .3, K.yours + .1, t)), rise = ein(lin(K.yoursE + .05, K.they + .3, t));
    const ex = base.x + 40 * ev, ey = base.y - 50 * ev;
    return { x: mix(ex, goal[0], set), y: mix(ey, goal[1], set) - 760 * rise + 3 * Math.sin(t * 2.3) * set, R: base.R };
  };
  const hand01 = (t) => { const up = eout(lin(K.why - .1, K.yours - .1, t)); return { x: HAND1.x + 40 * up, y: HAND1.y - 130 * up, s: HAND1.s }; };
  const draw01a = (ctx, t) => {
    const c = coin01(t); umberBG(ctx, t, { lx: c.x, ly: c.y, r: 760, warm: .9 });
    const h = hand01(t), o = { pose: 'open', ang: HAND1.ang, skin: '#c99a74', sleeve: PAL1.ochre, sleeveLen: 300, rim: '#ffd59a', light: [c.x - h.x, c.y - h.y], t, seed: 3, spread: .9 };
    hand(ctx, h.x, h.y, h.s, o);
    // warm light from the coin on the palm
    const pp = palmPos(h.x, h.y, h.s, o); ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, pp[0], pp[1] - 20, 220, .16 * clamp(1 - (pp[1] - c.y - 100) / 500), '#ffb35c', '#fff1d6'); ctx.restore();
    coin(ctx, c.x, c.y, c.R, t, { rot: t * .2, tilt: .15, light: 1, glint: lin(K.yours, K.yours + .7, t) > 0 && t < K.yours + .7 ? lin(K.yours, K.yours + .7, t) : -1 });
    vignette(ctx, .55);
  };
  shots.push({ t: t01a, tr: 'iris', x: COIN.x, y: COIN.y, r: R11end, d: .9, draw: draw01a, print: { riso: .25 } });

  // ================= 1.01b · the scaffold: the beam sets down on "built", a lamp flickers on =================
  const t01b = K.they - .2;
  const scafB = (ctx, t) => scaffold(ctx, t, { view: 'far', workers: 1, hoist: mix(.55, 1, eout(lin(t01b - .3, K.built + .05, t))), flick: { i: 2, t0: K.builtE - .1 }, lights: .85, cam: { z: 1 + .05 * eio(lin(t01b, K.look + .3, t)) } });
  const beamB = (() => { const [c, g] = canvas(W, H); return scafB(g, K.look - .15).beam; })();
  shots.push({ t: t01b, tr: 'up', d: .5, draw: (ctx, t) => { scafB(ctx, t); }, print: { riso: .25 }, sound: [{ f: 'lamp', t: K.builtE - .05, v: .22 }] });

  // ================= 1.05 · macro: the beam is pressed pages; a page comes loose =================
  const t05 = K.look - .15;
  const draw105 = (ctx, t) => {
    const gl = 1.2 * (t - t05) + 2.4 * eio(lin(K.from - .2, K.fromE + .3, t));
    const S = scaffold(ctx, t, { view: 'macro', glide: gl });
    // a page lifts off the beam's side face and flies up (carrier into 1.06)
    const q = lin(K.fromE - .2, K.so + .25, t);
    if (q > 0) { const e = ein(q), x = mix(1180, 1320, e), y = mix(640, -200, e), w = mix(150, 260, e); drawFragment(ctx, 'hand', x, y, w, mix(-.2, .5, e), { flip: Math.cos(q * 3), back: .35, seed: 2 }); }
    vignette(ctx, .4);
  };
  shots.push({ t: t05, tr: 'zoom', x: beamB.x, y: beamB.y, depth: 5, d: .55, draw: draw105, print: { riso: .25 } });

  // ================= 1.06 ★ · thousands of fragments whirl round the scaffold; a building's outline on "wrote down" =================
  const t06 = K.so - .25;
  const draw106 = (ctx, t) => {
    const yaw = -.55 + .05 * eio(lin(t06, K.downE + .5, t)), crane = 3 * eio(lin(t06, K.downE + .5, t));
    const rise = eout(lin(K.so, K.so + 1.15, t)), u = eio(lin(K.wrote - .05, K.downE - .05, t));
    let outline = null;
    const swarm = (side) => (c2, A) => { if (A.outline && u > 0) outline = A.outline(1300); paperSwarm(c2, t, { x: A.base.x, y: A.base.y - 10, R: 470, n: 1300, rise, u, shape: outline, side, back: .75, height: 1.45, kinds: ['hand', 'print', 'notes', 'grid'], trail: .6, seed: 4 }); };
    const S = scaffold(ctx, t, { view: 'mid', back: 1, lights: .9, yaw, crane, under: swarm('back') });
    swarm('front')(ctx, { base: S.base });
    // three fragments break away toward the camera (exit into 1.07a)
    const q = lin(K.downE - .15, K.books + .25, t);
    if (q > 0) for (let i = 0; i < 3; i++) { const e = ein(clamp(q * 1.15 - i * .08)); const x = mix([820, 1080, 960][i], [-300, 2200, 980][i], e), y = mix([520, 470, 380][i], [300, 260, 1400][i], e), w = mix(40, 1100, e * e);
      drawFragment(ctx, ['letter', 'notes', 'hand'][i], x, y, w, mix(.2 * i, 1.2 - i * .5, e), { flip: Math.cos(e * 2 + i), back: .4, seed: i + 1 }); }
    vignette(ctx, .4);
  };
  shots.push({ t: t06, tr: 'up', d: .6, draw: draw106, print: { riso: .25 }, sound: [{ f: 'pages', t: K.downE + .08, v: .18 }] });

  // ================= 1.07a · books and letters =================
  const t07a = K.books - .2;
  const ENV = Array.from({ length: 11 }, (_, i) => { const r = prng(70 + i); return { t0: K.letters - .22 + i * .045, vx: 1500 + r() * 1100, vy: -700 + r() * 760, g: 260 + r() * 300, rot: (r() - .5) * 2, sp: (r() - .5) * 6, w: 110 + r() * 90, fl: 4 + r() * 6, y0: 470 + r() * 160 }; });
  const draw07a = (ctx, t) => {
    umberBG(ctx, t, { lx: 620, ly: 300, r: 1100, warm: 1 });
    const qs = Array.from({ length: 12 }, (_, i) => clamp((t - (K.books - .05) - i * .085) / .42));
    book(ctx, 760 - 30 * eio(lin(t07a, K.songs, t)), 600, 1.02, t, { qs });
    for (const e of ENV) { const dt = t - e.t0; if (dt <= 0) continue; const x = 900 + e.vx * dt, y = e.y0 + e.vy * dt + e.g * dt * dt; if (x > W + 260) continue;
      envelope(ctx, x, y, e.w * (1 + dt * .6), e.rot + e.sp * dt, { flip: Math.cos(dt * e.fl) }); }
    // the last, biggest letter crosses toward the right edge (carrier into 1.07b)
    const lq = lin(K.letters + .1, K.songs + .25, t); if (lq > 0) { const e = ein(lq); envelope(ctx, mix(900, 2300, e), mix(520, 470, e), mix(150, 420, e), mix(-.3, .08, e), { flip: Math.cos(lq * 4) }); }
    vignette(ctx, .5);
  };
  shots.push({ t: t07a, tr: 'push', d: .5, draw: draw07a, print: { riso: .25 } });

  // ================= 1.07b · songs and research: staff lines flow into the lab grid =================
  const t07b = K.songs - .15;
  const draw07b = (ctx, t) => {
    umberBG(ctx, t, { lx: 900, ly: 200, r: 1300, warm: .9 });
    const ox = 120 - (t - t07b) * 1000 - 260 * eout(lin(t07b - .25, t07b + .5, t)), oy = 540 - BAND.h / 2, B = songLabBand();
    ctx.save(); ctx.translate(0, 12 * Math.sin(t * 1.3)); ctx.rotate(-.02);
    ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(ox + 14, oy + 22, BAND.w, BAND.h);
    ctx.drawImage(B, ox, oy);
    const du = eio(lin(K.research - .05, K.code - .1, t)); if (du > 0) { const e = dataSeries(ctx, ox, oy, du, t); if (du < 1) pen(ctx, e[0], e[1], .55, { ang: -2.3, t, lift: .05 }); }
    ctx.restore();
    vignette(ctx, .5);
  };
  shots.push({ t: t07b, tr: 'left', d: .45, draw: draw07b, print: { riso: .2 } });

  // ================= 1.07c · code: a tractor-feed listing, one line lights =================
  const t07c = K.code - .12;
  const draw07c = (ctx, t) => {
    umberBG(ctx, t, { lx: 960, ly: 260, r: 1100, warm: .8 });
    const Ls = listingSheet(), sy = 150 - (t - t07c) * 150, x0 = 960 - LISTING.w / 2, foldY = 760;
    const fq = eio(lin(K.codeE - .25, K.recipe + .2, t)), fa = fq * Math.PI * .46;
    ctx.save(); ctx.translate(960, 540); ctx.rotate(-.035); ctx.translate(-960, -540);
    // above the fold the paper runs flat; below it the next page folds away (fanfold)
    ctx.save(); ctx.beginPath(); ctx.rect(0, -200, W, foldY + 200); ctx.clip(); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(x0 + 14, sy + 20, LISTING.w, Ls.height); ctx.drawImage(Ls, x0, sy);
    // the hot line on "Code"
    const hu = sm(lin(K.code - .05, K.code + .25, t)), hy = sy + LISTING.top + LISTING.hot * LISTING.line + 24;
    if (hu > 0) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = rgba('#ffb35c', .55 * hu); ctx.fillRect(x0 + 80, hy - 26, LISTING.w - 160, 36); ctx.restore(); ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, x0 + 420, hy - 8, 340, .16 * hu, '#ffb35c', '#fff1d6'); ctx.restore(); }
    ctx.restore();
    if (foldY - sy < Ls.height) { ctx.save(); ctx.translate(0, foldY); ctx.scale(1, Math.max(.02, Math.cos(fa))); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip(); ctx.drawImage(Ls, x0, sy - foldY); ctx.fillStyle = `rgba(20,12,8,${.5 * Math.sin(fa)})`; ctx.fillRect(x0, 0, LISTING.w, H); ctx.restore(); }
    ctx.restore();
    vignette(ctx, .5);
  };
  shots.push({ t: t07c, tr: 'whipL', d: .3, draw: draw07c, print: { riso: .2 } });

  // ================= 1.08 · a grandmother's recipe, shared online =================
  const t08b = K.recipe - .12, CARD = { x: 840, y: 610, rot: -.07 };
  const draw108 = (ctx, t) => {
    umberBG(ctx, t, { lx: 760, ly: 420, r: 1000, warm: .85 });
    const flash = t > K.shared ? Math.exp(-(t - K.shared) * 7) : 0;
    const RC = recipeCard(); ctx.save(); ctx.translate(CARD.x + drift(t, 3, 9), CARD.y); ctx.rotate(CARD.rot); ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(-300 + 14, -200 + 20, 600, 400); ctx.restore(); ctx.drawImage(RC, -330, -230);
    if (flash > 0) { ctx.fillStyle = `rgba(255,252,240,${.55 * flash})`; ctx.fillRect(-300, -200, 600, 400); }
    ctx.restore();
    // the old hand smooths the card twice, then withdraws
    const s1 = eio(lin(t08b + .05, K.recipeW + .55, t)), s2 = eio(lin(K.recipeW + .55, K.shared - .2, t)), away = ein(lin(K.shared - .25, K.shared + .35, t));
    const hx = mix(470, 640, s1) + 60 * s2 - 420 * away, hy = mix(960, 880, s1) - 24 * Math.sin(s2 * Math.PI) + 420 * away;
    hand(ctx, hx, hy, 2.0, { pose: 'open', ang: -.52, skin: '#e3bf9e', sleeve: '#c89a98', sleeveLen: 330, rim: '#ffe0b0', light: [-.4, -1], t, seed: 8, spread: .7, close: .05 });
    // the phone above the card takes the picture; flash on "shared"
    const pi = eout(lin(K.recipeW - .2, K.recipeW + .5, t)), px = mix(1700, 1370, pi), py = mix(150, 330, pi);
    const screen = (g, w, h) => { g.fillStyle = '#1a1410'; g.fillRect(0, 0, w, h); g.save(); g.translate(w / 2, h * .45); g.rotate(CARD.rot + .07); g.drawImage(RC, -w * .46, -w * .32, w * .92, w * .64); g.restore(); g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 2; g.beginPath(); g.arc(w / 2, h * .86, 14, 0, TAU); g.stroke(); };
    if (pi > 0) { heldPhone(ctx, px, py, 1.05, { t, ang: .16, lit: 1, screen, skin: '#a8754f', warm: .7, rim: '#ffe0b0', rimA: .35 });   // a younger hand holds the phone over the card
      // the forearm in a denim sleeve continues out of frame (the cuff covers the wrist)
      ctx.save(); ctx.translate(px, py); ctx.rotate(.16); ctx.scale(1.05, 1.05 * Math.cos(.22));
      const sg = ctx.createLinearGradient(-40, 0, 190, 0); sg.addColorStop(0, '#4a5d74'); sg.addColorStop(.35, '#2c3a4c'); sg.addColorStop(1, '#141b25'); ctx.fillStyle = sg;
      ctx.beginPath(); ctx.moveTo(-26, 268); ctx.bezierCurveTo(20, 258, 104, 256, 150, 270); ctx.lineTo(200, 1100); ctx.lineTo(-74, 1100); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(255,224,176,.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-26, 270); ctx.lineTo(-74, 1100); ctx.stroke();
      ctx.strokeStyle = 'rgba(10,14,20,.6)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-24, 300); ctx.bezierCurveTo(20, 290, 104, 290, 154, 302); ctx.stroke(); ctx.restore();
      if (flash > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, px - 40, py - 120, 620, .9 * flash, '#fff4e0', '#ffffff'); ctx.fillStyle = `rgba(255,248,236,${.16 * flash})`; ctx.fillRect(0, 0, W, H); ctx.restore(); } }
    // the photo leaves the phone as a small rectangle and flies up
    const fq = lin(K.shared + .2, K.forum + .2, t);
    if (fq > 0) { const e = ein(fq), x = mix(px, 1240, e), y = mix(py, -260, e), w = mix(130, 80, e); ctx.save(); ctx.translate(x, y); ctx.rotate(mix(.16, -.25, e)); ctx.fillStyle = '#f6efe0'; ctx.fillRect(-w / 2 - 6, -w * .38 - 6, w + 12, w * .76 + 12); ctx.drawImage(RC, -w / 2, -w * .35, w, w * .68); ctx.restore(); ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, x, y, 90, .25, '#ffb35c', '#fff1d6'); ctx.restore(); }
    vignette(ctx, .5);
  };
  shots.push({ t: t08b, tr: 'down', d: .4, draw: draw108, print: { riso: .25 } });

  // ================= 1.09 · a forum answer flies as a paper plane to a stranger's hand =================
  const t09 = K.forum - .12, PH = { x: 640, y: 620 }, ST = { x: 2700, y: 880, s: 2.0 };
  const fly09 = (t) => eio(lin(K.written - .15, K.stranger + .06, t));
  const planePath = (q) => [mix(PH.x + 30, ST.x + 40, q), PH.y - 150 - Math.sin(q * Math.PI) * 170 + q * 300];
  const camX09 = (t) => clamp(planePath(fly09(t))[0] - 820, 0, ST.x - 1150);
  const stHand = (t) => { const c = eout(lin(K.stranger - .02, K.stranger + .35, t)), lv = ein(lin(K.strangerE - .1, K.thats + .3, t)); return { x: ST.x, y: ST.y - 16 * c, s: ST.s, o: { pose: 'open', ang: -.4, skin: '#5a3a26', sleeve: '#c4512e', sleeveLen: 420, rim: '#8fd6e6', light: [1, -.6], t, seed: 11, close: .28 * c * (1 - lv) } }; };
  const draw109 = (ctx, t) => {
    const cx = camX09(t);
    umberBG(ctx, t, { night: true, lx: PH.x - cx * .6, ly: 560, r: 760, warm: .75, col: '#9fb6cf', dx: -cx * .2 });
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, ST.x - cx + 60, ST.y - 240, 760, .15, '#5fb3c8', '#c9eef5'); ctx.restore();
    ctx.save(); ctx.translate(-cx, 0);
    // the phone in your hand; the other hand (petrol sleeve) types the answer
    const typed = clamp(lin(t09 + .05, K.answer + .3, t)), peel = lin(K.answer + .25, K.answer + .6, t);
    const screen = (g, w, h) => { g.fillStyle = '#121624'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(200,210,230,.16)'; g.fillRect(10, 24, w - 20, 74); g.fillStyle = 'rgba(200,210,230,.34)'; for (let i = 0; i < 3; i++) g.fillRect(18, 36 + i * 17, (w - 50) * (i === 2 ? .5 : .9), 6);
      if (peel < .35) { g.fillStyle = '#efe4cc'; g.fillRect(10, 116, w - 20, 92 * clamp(typed * 1.25)); g.fillStyle = 'rgba(40,40,60,.6)'; const n = Math.floor(typed * 12); for (let i = 0; i < n; i++) g.fillRect(18 + (i % 3) * 40, 126 + Math.floor(i / 3) * 18, 34, 6); } };
    const P = heldPhone(ctx, PH.x, PH.y, 1.25, { t, screen, skin: '#c99a74', rim: '#9fb6cf', warm: .8 });
    const tap = typed < 1 ? Math.max(0, Math.sin(t * 21)) : 0, away = ein(lin(K.answer + .25, K.answer + .75, t));
    hand(ctx, PH.x + 250 + 240 * away - 10 * tap, PH.y + 330 + 240 * away - 12 * tap, 2.0, { pose: 'reach', ang: -2.2, skin: '#c99a74', sleeve: '#1f6f78', sleeveLen: 420, rim: '#9fb6cf', light: [-1, -.5], t, seed: 5, close: .45 });
    // the stranger's open hand, in a cooler light
    const S9 = stHand(t); hand(ctx, S9.x, S9.y, S9.s, S9.o);
    // the answer peels off the display as a paper strip, folds into a plane, glides to the stranger and is caught on "stranger"
    if (peel > 0) {
      const q = fly09(t), fold = eio(lin(K.answer + .5, K.written + .05, t)), pp = palmPos(S9.x, S9.y, S9.s, S9.o), lift = eout(clamp(peel));
      const catchQ = eout(lin(K.stranger - .02, K.stranger + .3, t)), leave = lin(K.stranger + .32, K.thats + .25, t);
      let x, y, rot, sc = 1;
      if (q <= 0) { const sp = P.map ? P.map(0, -20) : [PH.x, PH.y - 40]; x = sp[0]; y = sp[1] - 150 * lift; rot = -.05 * lift; }
      else { const [ax, ay] = planePath(q), [bx, by] = planePath(Math.min(1, q + .02)); x = ax; y = ay; rot = Math.atan2(by - ay, bx - ax); }
      if (catchQ > 0) { x = mix(x, pp[0], catchQ); y = mix(y, pp[1] - 30, catchQ); rot = mix(rot, -.25, catchQ); }
      if (leave > 0) { const a = leave * 3; x = pp[0] + Math.sin(a) * 170 * leave + 60 * leave; y = pp[1] - 30 - 1300 * Math.pow(leave, 1.5) - 50 * Math.sin(a); rot = mix(-.25, -1.3, leave); sc = 1 - .3 * leave; }
      plane(ctx, x, y, 1.2 * sc, rot, { fold, bank: Math.sin(q * 7) * .4, light: '#9fb6cf' });
      if (q > 0 && q < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(200,220,255,.12)'; ctx.lineWidth = 2; ctx.beginPath(); for (let k = 0; k <= 20; k++) { const [px, py] = planePath(Math.max(0, q - k * .012)); k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); ctx.restore(); }
    }
    ctx.restore();
    vignette(ctx, .55);
  };
  shots.push({ t: t09, tr: 'up', d: .5, draw: draw109, print: { riso: .25 }, sound: [{ f: 'phone_tap', t: K.onlineE + .05, v: .14 }] });

  // ================= 1.10a + 1.10b · everything flows into the scaffold; the crowd, every sheet lights on "us" =================
  const t10a = K.thats - .15, t10b = K.all - .05;
  const HERO = { x: 1290, y: 930, s: 1.35 };
  const crane10 = (t) => 34 * eio(lin(t10a - .2, K.usE + .4, t));
  const heroY = (t) => HERO.y + 260 * (1 - eout(lin(K.all - .3, K.all + .4, t)));
  const sheetAt = (t) => { const p = handPos(HERO.x, heroY(t), HERO.s, POSES.hold, 0, true); return [p[0], p[1] - 10]; };
  const draw110 = (ctx, t) => {
    const crane = crane10(t), inflow = eio(lin(K.thats - .1, K.learnE - .1, t)), glow = sm(lin(K.thats + .2, K.learnE + .3, t));
    const crowd = eout(lin(K.all - .35, K.us + .1, t)), sheets = eout(lin(K.us - .05, K.us + .45, t));
    let base = null;
    const S = scaffold(ctx, t, { view: 'mid', crane, glow, crowd, sheets, lights: .8, back: .5 * (1 - glow), under: (c2, A) => { base = A; paperSwarm(c2, t, { x: A.base.x, y: A.base.y - 10, R: 520, n: 900, inflow, sink: { x: A.base.x, y: (A.base.y + A.top.y) / 2 }, side: 'back', kinds: ['hand', 'print', 'notes', 'grid', 'recipe', 'letter', 'code'], back: .7, seed: 7, trail: .4 }); } });
    paperSwarm(ctx, t, { x: S.base.x, y: S.base.y - 10, R: 520, n: 900, inflow, sink: { x: S.base.x, y: (S.base.y + S.top.y) / 2 }, side: 'front', kinds: ['hand', 'print', 'notes', 'grid', 'recipe', 'letter', 'code'], back: .7, seed: 7, trail: .4 });
    // one of us in the foreground, holding a sheet (the push-in target)
    const fi = eout(lin(K.all - .3, K.all + .4, t));
    if (fi > 0) { const y = heroY(t); const sh = sheetAt(t);
      figure(ctx, HERO.x, y, HERO.s, POSES.hold, { t, seed: 3, flip: true, accent: '#6a4a3a', rim: '#ffcf8a', rimSide: -1, shade: .7, light: { x: 960, y: 500, col: '#ffcf8a', a: .5 } });
      { const g = ctx; g.save(); g.translate(sh[0], sh[1]); g.rotate(-.08); g.fillStyle = sheets > 0 ? `rgb(${Math.round(mix(150, 255, sheets))},${Math.round(mix(138, 238, sheets))},${Math.round(mix(118, 205, sheets))})` : '#8a8072'; g.fillRect(-24 * HERO.s / 2, -32 * HERO.s / 2, 24 * HERO.s, 32 * HERO.s); g.restore(); }
      if (sheets > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, sh[0], sh[1], 160, .45 * sheets, '#ffb35c', '#fff1d6'); ctx.restore(); } }
    vignette(ctx, .4);
  };
  shots.push({ t: t10a, tr: 'up', d: .55, draw: draw110, print: { riso: .25 } });
  shots.push({ t: t10b, tr: 'cut', d: .08, draw: draw110, print: { riso: .25 } });

  // ================= 1.11 · the sheet's print: a coin into a tin cup; it tears on "charity" =================
  const t11b = K.so2 - .15, tear0 = K.charity, tear1 = K.charityE - .02;
  const SHEET = { w: 1640, h: 1000 };
  const tearPts = once('tearpts', () => { const r = prng(77), out = []; for (let i = 0; i <= 40; i++) out.push([(r() - .5) * 26 + Math.sin(i * .7) * 14, -SHEET.h / 2 - 20 + i * (SHEET.h + 40) / 40]); return out; });
  const sheetLayer = () => once('sheet111', () => { const [c, g] = canvas(SHEET.w, SHEET.h); const pg = g.createRadialGradient(SHEET.w * .4, SHEET.h * .3, 0, SHEET.w / 2, SHEET.h / 2, SHEET.w * .7); pg.addColorStop(0, '#f6ecd4'); pg.addColorStop(1, '#d9c7a0'); g.fillStyle = pg; g.fillRect(0, 0, SHEET.w, SHEET.h);
    const P = charityPrint(); g.drawImage(P, SHEET.w / 2 - P.width * .75, SHEET.h / 2 - P.height * .75 - 30, P.width * 1.5, P.height * 1.5); return c; });
  const drawSheet111 = (ctx, t, side) => {   // side: 0 whole, -1 left half, +1 right half (after the tear)
    const L = sheetLayer();
    ctx.save(); ctx.beginPath();
    if (side === 0) ctx.rect(-SHEET.w / 2, -SHEET.h / 2, SHEET.w, SHEET.h);
    else { const TP = tearPts; ctx.moveTo(side < 0 ? -SHEET.w / 2 - 10 : SHEET.w / 2 + 10, -SHEET.h / 2 - 30); for (const [x, y] of TP) ctx.lineTo(x, y); ctx.lineTo(side < 0 ? -SHEET.w / 2 - 10 : SHEET.w / 2 + 10, SHEET.h / 2 + 30); ctx.closePath(); }
    ctx.clip(); ctx.drawImage(L, -SHEET.w / 2, -SHEET.h / 2);
    // the falling coin, engraved: drops into the cup during "a share of what it makes"
    const cq = lin(K.share2 - .1, K.makes + .2, t);
    if (cq > 0 && cq < 1) { const e = ein(cq), cx = -57, cy0 = -470, cy1 = -52; const y = mix(cy0, cy1, e);
      ctx.save(); ctx.translate(cx, y); ctx.rotate(e * 5); ctx.scale(1, .35 + .65 * Math.abs(Math.cos(e * 7))); ctx.fillStyle = '#efe4cc'; ctx.strokeStyle = '#2a2230'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 26, 0, TAU); ctx.fill(); ctx.stroke(); ctx.lineWidth = 1.2; for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(-18, k * 7); ctx.lineTo(18, k * 7); ctx.stroke(); } ctx.restore(); }
    ctx.restore();
  };
  // the torn edges lift a little off the plate below and shade it (drawn under the halves, so only the crack shows it)
  const tornShadow = (ctx, gap, a) => { ctx.save(); ctx.lineJoin = 'round'; for (const [lw, al] of [[2 * gap + 46, .1], [2 * gap + 22, .16], [2 * gap + 8, .22]]) { ctx.strokeStyle = `rgba(28,18,12,${al * a})`; ctx.lineWidth = lw; ctx.beginPath(); tearPts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); } ctx.restore(); };
  const draw111 = (ctx, t) => {
    const fall = lin(tear1, tear1 + .55, t), tq = eio(lin(tear0, tear1, t));
    if (tq > 0) draw112(ctx, t, true); else { ctx.fillStyle = '#120c09'; ctx.fillRect(0, 0, W, H); }   // the next plate lies underneath
    const k = 1 + .05 * eio(lin(t11b - .3, tear0, t));
    ctx.save(); ctx.translate(960, 540); ctx.scale(k, k);
    if (tq > 0 && fall < .25) tornShadow(ctx, 6 + 10 * tq, 1 - fall * 4);
    if (tq <= 0) drawSheet111(ctx, t, 0);
    else { const e = ein(fall); for (const side of [-1, 1]) { ctx.save(); const gap = 6 + 10 * tq; ctx.translate(side * (gap + 1300 * e), 900 * e * e); ctx.rotate(side * (.04 * tq + .6 * e)); drawSheet111(ctx, t, side); ctx.restore(); }
      // the torn fibres glowing at the edge
      if (fall <= 0) { ctx.save(); ctx.strokeStyle = 'rgba(255,248,230,.8)'; ctx.lineWidth = 2; ctx.beginPath(); const n = Math.floor(tearPts.length * tq); tearPts.slice(0, n).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.restore(); } }
    ctx.restore();
    vignette(ctx, .45);
  };
  shots.push({ t: t11b, tr: 'zoom', x: sheetAt(t11b)[0], y: sheetAt(t11b)[1], depth: 6, d: .6, draw: draw111, print: { riso: .2 }, sound: [{ f: 'tear', t: tear1 - .05, v: .22 }] });

  // ================= 1.12 · the next plate of the same book: an engraved heirloom chest; the lid swings open on "inheritance" =================
  // The tear of 1.11 reveals it underneath (same paper, ink, line gap and border as the charity print): closed at first, light leaking
  // at the seam; "an" lifts the lid a crack, "inheritance" swings it open (expo-out) and the beams, rays and warm glow come up; then a
  // loose letter lifts in the warm air, dust drifts in the light and the camera creeps toward the opening (the carrier into 1.13).
  const t12 = K.its - .1, PL = { k: 1.03, rot: -.006, ox: 250, oy: 65, s: 1.5 };   // the plate: a hair smaller and askew under the charity sheet
  const PR = 1.25;   // the plate is cached a little above screen size (the push-in magnifies it)
  const plate112 = () => once('plate112', () => { const [c, g] = canvas(SHEET.w * PR, SHEET.h * PR); g.scale(PR, PR); const pg = g.createRadialGradient(SHEET.w * .42, SHEET.h * .3, 0, SHEET.w / 2, SHEET.h / 2, SHEET.w * .7); pg.addColorStop(0, '#f6ecd4'); pg.addColorStop(1, '#d9c7a0'); g.fillStyle = pg; g.fillRect(0, 0, SHEET.w, SHEET.h);
    g.drawImage(inheritanceBase(), PL.ox, PL.oy, IPRINT.w * PL.s, IPRINT.h * PL.s); return c; });
  const plateXY = ([px, py]) => { const x = (PL.ox + px * PL.s - SHEET.w / 2) * PL.k, y = (PL.oy + py * PL.s - SHEET.h / 2) * PL.k, c = Math.cos(PL.rot), s = Math.sin(PL.rot); return [960 + x * c - y * s, 540 + x * s + y * c]; };
  const M112 = plateXY(IPRINT.mouth);   // the opening's resting screen point: the slow push-in scales about it
  const tZoom = K.thomas - .15;   // 1.13's zoom into the opening is centred here (it starts .35 s earlier)
  const lid112 = (t) => .045 * eout(lin(K.inheritance - .3, K.inheritance - .08, t)) + .955 * eout(lin(K.inheritance - .08, K.inheritance + .72, t));
  const draw112 = (ctx, t, under = false) => {
    ctx.fillStyle = '#1a110c'; ctx.fillRect(0, 0, W, H);   // the dark table round the plate (only a thin margin shows)
    const open = lid112(t), light = eout(lin(K.inheritance - .04, K.inheritance + .75, t)), draft = sm(lin(K.inheritance + .25, K.inheritance + 1, t));
    const seam = sm(lin(tear0 + .25, tear1, t)) * (.55 + .45 * sm(lin(K.its + .15, K.inheritance - .1, t))), push = 1 + .1 * sm(lin(tear1 - .4, tZoom + .3, t));
    const dive = sm(lin(tZoom - .28, tZoom + .2, t));   // as 1.13's zoom dives in, the opening floods with light
    ctx.save(); ctx.translate(M112[0], M112[1]); ctx.scale(push, push); ctx.translate(-M112[0], -M112[1]);
    ctx.translate(960, 540); ctx.rotate(PL.rot); ctx.scale(PL.k, PL.k);
    ctx.drawImage(plate112(), -SHEET.w / 2, -SHEET.h / 2, SHEET.w, SHEET.h);
    ctx.translate(PL.ox - SHEET.w / 2, PL.oy - SHEET.h / 2); ctx.scale(PL.s, PL.s);
    const B = inheritancePrint(ctx, t, { open, light, seam, draft, base: false }), m = ctx.getTransform();
    ctx.restore();
    const mouth = [m.a * B.mouth[0] + m.c * B.mouth[1] + m.e, m.b * B.mouth[0] + m.d * B.mouth[1] + m.f];
    if (dive > 0) {   // the light swells and turns to warm paper, so the zoom lands in it and the Paine page grows out of it
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, mouth[0], mouth[1], 140 + 520 * dive, .75 * dive, '#ffb35c', '#fff4e0'); ctx.restore();
      const gr = ctx.createRadialGradient(mouth[0], mouth[1], 0, mouth[0], mouth[1], 90 + 430 * dive); gr.addColorStop(0, rgba('#fcf2dc', dive)); gr.addColorStop(.55, rgba('#f7e8c9', .85 * dive)); gr.addColorStop(1, rgba('#f2dfba', 0)); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
    }
    if (!under) vignette(ctx, .45);
    return { mouth };
  };
  const box112 = (() => { const [c, g] = canvas(W, H); return draw112(g, tZoom, true); })();   // where the opening is when 1.13's zoom is centred
  const draw112f = (ctx, t) => {
    draw112(ctx, t, true);
    // the torn halves of 1.11 still falling out of frame
    const fall = lin(tear1, tear1 + .55, t);
    if (fall < 1) { const e = ein(fall); ctx.save(); ctx.translate(960, 540); ctx.scale(1.05, 1.05); if (fall < .25) tornShadow(ctx, 16, 1 - fall * 4); for (const side of [-1, 1]) { ctx.save(); ctx.translate(side * (16 + 1300 * e), 900 * e * e); ctx.rotate(side * (.04 + .6 * e)); drawSheet111(ctx, t, side); ctx.restore(); } ctx.restore(); }
    vignette(ctx, .45);
  };
  shots.push({ t: t12, tr: 'cut', d: .08, draw: draw112f, print: { riso: .25 } });

  // ================= 1.13 · Paine: "not charity but a right." — "right" turns foil and stays as a point of light =================
  const t13 = tZoom;
  const QL = ['It is not charity but a right,', 'not bounty but justice,', 'that I am pleading for.'];
  const spoken = T.W('01a', 'not charity but', 'a right'), FS = 64, LH = 86;
  const [, MX] = canvas(8, 8); MX.font = `${FS}px "Instrument Serif"`;
  const sp = MX.measureText(' ').width, line0 = QL[0].split(' '), xs = []; { let x = 0; for (const w of line0) { xs.push(x); x += MX.measureText(w).width + sp; } }
  const wRight = MX.measureText('right').width, lineW = QL.map((l) => MX.measureText(l).width);
  // page layout in page units: text block starts at (PX, PY) for the first baseline; "right" centre = (PX + xs[6] + wRight/2, PY - FS*.3)
  const PG = { w: 1400, h: 700, PY: 372 }, lx0 = PG.w / 2 - lineW[0] / 2;
  const rightLocal = [lx0 + xs[6] + wRight / 2 - PG.w / 2, PG.PY - FS * .32 - PG.h / 2];
  const tGoal = C3.t - 1, goal = [1150, 600];   // where "right" must be at C.t − 1 s (the register)
  const pageCam = (t) => { const k = 1 + .07 * eio(lin(t13, tGoal, t)); return k; };
  const pageLayer = () => once('paine', () => { const [c, g] = canvas(PG.w + 80, PG.h + 80); g.translate(40, 40);
    g.save(); g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 30; g.shadowOffsetY = 18; g.fillStyle = '#d9c49a'; g.fillRect(0, 0, PG.w, PG.h); g.restore();
    const pg = g.createRadialGradient(PG.w * .35, PG.h * .3, 0, PG.w / 2, PG.h / 2, PG.w * .75); pg.addColorStop(0, '#f1e3c2'); pg.addColorStop(.7, '#e3cfa6'); pg.addColorStop(1, '#c9b083'); g.fillStyle = pg; g.fillRect(0, 0, PG.w, PG.h);
    // foxing and age
    const r = prng(19); for (let i = 0; i < 26; i++) { const x = r() * PG.w, y = r() * PG.h, R = 6 + r() * 30, gg = g.createRadialGradient(x, y, 0, x, y, R); gg.addColorStop(0, `rgba(150,100,50,${.05 + r() * .08})`); gg.addColorStop(1, 'rgba(150,100,50,0)'); g.fillStyle = gg; g.fillRect(x - R, y - R, R * 2, R * 2); }
    gBorder(g, 22, 22, PG.w - 44, PG.h - 44, { band: 30, lines: 8, waves: 170, col: '#3a3040', a: .5, w: .8, radius: 10 });
    // attribution above, then the whole sentence in letterpress (unspoken words stay printed but pale; spoken ones are inked live)
    text(g, 'Thomas Paine', PG.w / 2, 168, { size: 40, font: 'Instrument Serif', color: 'rgba(40,32,46,.92)', align: 'center' });
    text(g, 'AGRARIAN JUSTICE  ·  1797', PG.w / 2, 204, { size: 16, weight: 600, color: 'rgba(40,32,46,.66)', spacing: 3, align: 'center' });
    g.strokeStyle = 'rgba(58,48,64,.55)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(PG.w / 2 - 28, 240); g.lineTo(PG.w / 2 + 28, 240); g.stroke();
    QL.forEach((l, i) => { const x = PG.w / 2 - lineW[i] / 2; text(g, l, x + .8, PG.PY + i * LH + 1.2, { size: FS, font: 'Instrument Serif', color: 'rgba(255,248,230,.3)' }); text(g, l, x, PG.PY + i * LH, { size: FS, font: 'Instrument Serif', color: 'rgba(58,48,64,.3)' }); });
    stipple2(c); return c; });
  const stipple2 = (c) => { /* fibres come from the print finish; keep the page clean for legibility */ };
  const draw113 = (ctx, t) => {
    umberBG(ctx, t, { lx: 1100, ly: 420, r: 1000, warm: .55 });
    // page position: its local "right" lands on the goal at tGoal under the push-in (scaled about the goal point)
    const k = pageCam(t), sink = ein(lin(K.rightE - .02, C3.t, t)), px = goal[0] - rightLocal[0], py = goal[1] - rightLocal[1] + 1250 * sink;
    const enter = eout(lin(t13 - .3, t13 + .6, t));
    ctx.save(); ctx.translate(goal[0], goal[1]); ctx.scale(k, k); ctx.translate(-goal[0], -goal[1]); ctx.translate(px, py + 30 * (1 - enter)); ctx.rotate(-.006);
    ctx.drawImage(pageLayer(), -PG.w / 2 - 40, -PG.h / 2 - 40);
    // the spoken words fill with ink with the voice; "right" becomes foil
    ctx.translate(-PG.w / 2, -PG.h / 2);
    for (let i = 0; i < spoken.length; i++) { const w = spoken[i], j = 2 + i, x = lx0 + xs[j], lit = sm(lin(w.s - .06, w.s + .24, t)); if (lit <= 0) continue; const word = line0[j].replace(/[,.]/g, '');
      if (word === 'right') { const fq = sm(lin(w.s + .05, w.s + .4, t)); text(ctx, word, x, PG.PY, { size: FS, font: 'Instrument Serif', color: rgba('#2a2230', lit * (1 - fq)) });
        if (fq > 0) { ctx.save(); ctx.font = `${FS}px "Instrument Serif"`; const g = ctx.createLinearGradient(x, PG.PY - FS, x + wRight, PG.PY); ['#4a2008', '#9a561a', '#d08430', '#eaa94e', '#9a561a'].forEach((cc, q) => g.addColorStop(q / 4, cc)); ctx.globalAlpha = fq * (1 - sm(lin(K.rightE, K.rightE + .5, t)));
          ctx.fillStyle = 'rgba(60,30,10,.55)'; ctx.fillText(word, x + 1.2, PG.PY + 1.8); ctx.fillStyle = g; ctx.fillText(word, x, PG.PY);   // debossed foil: a hairline of shadow under the leaf
          const gx = mix(x - 40, x + wRight + 40, lin(w.s + .06, w.s + .3, t)), gg = ctx.createLinearGradient(gx - 30, 0, gx + 30, 0); gg.addColorStop(0, 'rgba(255,240,210,0)'); gg.addColorStop(.5, 'rgba(255,250,235,.75)'); gg.addColorStop(1, 'rgba(255,240,210,0)'); ctx.globalCompositeOperation = 'source-atop'; ctx.fillStyle = gg; ctx.fillRect(x - 10, PG.PY - FS, wRight + 20, FS * 1.3); ctx.restore();
          ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, x + wRight / 2, PG.PY - FS * .32, 120, .16 * fq, '#ffb35c', '#fff1d6'); ctx.restore(); } }
      else text(ctx, line0[j], x, PG.PY, { size: FS, font: 'Instrument Serif', color: rgba('#2a2230', lit) }); }
    ctx.restore();
    // the word stays as a point of light and travels on (carry c02>c03, kind 'light')
    if (t >= tGoal - .05) { const a = sm(lin(tGoal - .05, tGoal + .2, t)); C3.draw(ctx, t, { a }); }
    vignette(ctx, .5);
  };
  shots.push({ t: t13, tr: 'zoom', x: box112.mouth[0], y: box112.mouth[1] - 10, depth: 5, d: .7, draw: draw113, print: { riso: .15 }, sound: [{ f: 'foil_glint', t: K.rightE + .06, v: .3 }] });

  return shots;
};
