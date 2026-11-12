// c01 · Hook · THE HALL OF RELICS · thumbnail A (vitrine 1, the mint cell, you small in front; DEADLINE: 2036 slams onto the glass) ·
// the diorama A DOCTOR'S OFFICE · 2026: the doctor sits down, you beside someone you love, four word cards fall onto the desk ·
// the grandkids walk past (the room becomes a relic) to the plague mask · the four cards fly to vitrine 1: ? · the machine finds fast,
// the body answers slowly · EVERY CURE HAS TWO DATES (FOUND · PROVEN) · four labels: weeks … decades · the labels go home to their
// plaques, the camera trucks to the wall panel · C1 read word by word · it folds into the roadshow frame · NOT INVESTMENT ADVICE ·
// → plateRoadshow (lib/f54_seams.mjs) at "He didn't invent it".
// 0 → T.G("He didn't invent it") · built by the lead (quality reference). Plan: docs/shots.md H.01–H.13 · world: docs/MOTION.md
// ONE entry, one world, one continuous camera (the diorama is entered by a push through its glass, never a cut).
//
// | ID    | anchor (phrase)                      | picture (one idea)                                                     | camera                |
// |-------|--------------------------------------|------------------------------------------------------------------------|-----------------------|
// | H.01★ | Artificial intelligence just gave    | thumbnail A; DEADLINE: 2036 slams onto the glass on "deadline"         | slow push · HALL      |
// | H.02  | Think of the last time a doctor      | you turn left; glide to the diorama, push through its glass; he sits   | glide + dive · SCENE  |
// | H.03  | like cancer / Or Alzheimer's         | CANCER, ALZHEIMER'S, HEART DISEASE, DEPRESSION fall onto the desk      | creep · SCENE         |
// | H.04  | Now picture your grandkids           | out of the glass: the office ages into a relic; two kids walk past     | pull back · HALL      |
// | H.05  | the word plague / history book       | the kids stop at the plague mask                                       | truck left · HALL     |
// | H.06  | So which of these                    | the four cards fly to vitrine 1, each with a mint ?; they go to plaques| glide right · MIX     |
// | H.07  | The machines can find cures faster   | the plaque grows into a panel: FINDING (fast) | THE BODY (a slow breath)| push · EXPL         |
// | H.08  | Every cure has two dates             | the panel becomes the label: FOUND stamped, PROVEN blinks              | creep · EXPL          |
// | H.09  | And for each of these diseases       | four labels: CANCER proven in WEEKS · ALZHEIMER'S: DECADES, the room breathes | pull back · EXPL |
// | H.10  | That deadline comes from             | the labels shrink into their plaques; truck right to the wall panel    | truck · MIX           |
// | H.11  | [C1 card]                            | the quote lights word by word, the credit                              | creep · EXPL          |
// | H.12  | He runs Anthropic                    | the quote folds into the frame IPO ROADSHOW VIDEO · MADE TO SELL SHARES| glide · MIX           |
// | H.13  | This isn't about whether             | bracket NOT INVESTMENT ADVICE → plateRoadshow                          | creep · MIX           |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f54_kit.mjs';
import * as S from '../lib/f54_seams.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, halo, mixHex, smooth } = E;
const { rise, maskLine, F0, MINT, COOL } = F;

export const PRINT = F.PRINT54;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.dl = G('deadline'); a.think = G('Think of the last time'); a.sat = G('sat down', a.think); a.love = G('someone you love', a.think);
  a.cancer = G('cancer', a.think); a.alz = G("Alzheimer's", a.cancer); a.heart = G('Heart disease', a.cancer); a.dep = G('Depression', a.cancer);
  a.now = G('Now picture your grandkids'); a.plague = G('plague', a.now); a.history = G('Something from a history book'); a.book = GE('history book', a.now);
  a.which = G('So which of these'); a.histDl = G('be history by the', a.which); a.dl2 = G('deadline', a.which);
  a.mach = G('The machines can find'); a.faster = G('cures faster', a.mach); a.rush = G("They can't rush", a.mach); a.bodyW = G('human body', a.mach);
  a.every = G('Every cure has two dates'); a.found = G('found', a.every); a.proven = G('proven', a.every);
  a.each = G('And for each of these diseases'); a.speed = G('at its own speed', a.each); a.fastest = G('The fastest', a.each); a.weeks = G('weeks', a.each);
  a.slowest = G('The slowest', a.each); a.decades = G('decades', a.each);
  a.comes = G('That deadline comes from'); a.dario = G('Dario Amodei', a.comes); a.words = G('In his words', a.comes);
  a.C1 = T.clip('C1');
  a.runs = G('He runs Anthropic'); a.video = G('the video made', a.runs); a.sell = G('sell its shares', a.runs);
  a.stock = G("This isn't about whether"); a.end = R.b;
  return [{ t: 0, draw: scene(a, T), print: PRINT }];
};

const C = (u, v, s, sx, sy) => E.aim(F0, u, v, s, sx, sy);          // the hall (design px on the F0 card)
const DG = S.dioramaGlass(), OF = S.OFFICE;
const toWorld = (lx, ly) => [DG.x + lx, DG.y + ly];                  // diorama-local → hall px
const V1 = S.glassOf(0), PQ = [0, 1, 2, 3].map(S.plaqueOf), FR = S.frameRect();
const WORDS = ['CANCER', "ALZHEIMER'S", 'HEART DISEASE', 'DEPRESSION'];
const NAMES = S.HALL.V.map((v) => v.name);
const KID = [{ h: 136, off: 0, ph: 0 }, { h: 114, off: 84, ph: 1 }];
const PANEL = { x: 380, y: 236, w: 1160, h: 560 };                     // H.07 explainer panel (screen)
const BIG = { x: 540, y: 280, s: 1.5 };                                // H.08 the label (screen, top-left + scale)
const GRID = [[396, 196], [988, 196], [396, 548], [988, 548]], GS = .96;  // H.09 the four labels
const TEXT = { x: 4990, y: 360, w: 1260, size: 76 };                  // the wall text (hall px)

// screen-space explainers float a little (never a frozen frame): a slow drift and breath about the centre, scaled by k
const float = (ctx, t, k = 1) => { ctx.setTransform(1, 0, 0, 1, 0, 0); const z = 1 + .016 * k * Math.sin(t * .37 + 1), dx = E.drift(t * 1.1, 14 * k, 11), dy = E.drift(t * 1.1, 8 * k, 17);
  ctx.translate(W / 2 + dx, H / 2 + dy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); };
// a walk that accelerates, glides, and settles (u 0..1 → 0..1, mostly linear)
const trap = (u, ea = .12, eb = .18) => { u = clamp(u); const v = 1 / (1 - ea / 2 - eb / 2); if (u < ea) return v * u * u / (2 * ea); if (u > 1 - eb) return 1 - v * (1 - u) ** 2 / (2 * eb); return v * (u - ea / 2); };

function scene(a, T) {
  const c1 = a.C1, tPlate = a.end - S.SEAM_HALF, tCreep = tPlate - 2.5;
  // ---------------------------------------------------------------- the camera (one take)
  const DIVE = 2.72, IN = [-230, 600];                                  // inside the diorama: the glass fills the frame
  const KH = [
    [-1, C(1000, 534, .99)], [0, C(990, 535, 1.0)], [a.think + .1, C(895, 550, 1.1)],
    [a.think + 1.5, C(240, 570, 1.25)], [a.sat - .2, C(-140, 590, 1.85)], [a.sat + 1.0, C(IN[0], IN[1], DIVE)],
    [a.now, C(IN[0] + 150, IN[1] + 8, DIVE * 1.1)],
  ];
  const KO = [   // out of the glass, the kids, the plague, back to vitrine 1
    [a.now, KH[KH.length - 1][1]], [a.now + 1.6, C(-230, 640, 1.22)], [a.plague - .2, C(-450, 650, 1.2)], [a.book + .4, C(-640, 655, 1.3)],
    [a.which + .2, C(-630, 650, 1.31)], [a.which + 1.5, C(200, 540, .82)], [a.dl2 + .1, C(985, 522, .99)], [a.mach + .2, C(1010, 540, 1.04)],
    [a.mach + 1.2, C(1360, 905, 1.95)], [a.every + .3, C(1520, 900, 2.05)], [a.each + .5, C(1700, 640, 1.2)], [a.speed, C(2500, 480, .57)],
    [a.comes, C(3100, 470, .52)], [a.comes + 1.2, C(4000, 490, .62)], [a.words + .7, C(5600, 500, 1.0)], [c1.end, C(5600, 506, 1.055)],
    [a.runs + 1.6, C(5640, 510, 1.07)], [a.sell, C(5880, 548, .78)],
  ];
  const creepCam = (t) => C(6120 + S.TRUCK * (t - tPlate), 560, .9 * (1 + S.CREEP * (t - tPlate)));
  const KALL = [...KH.slice(0, 6), [a.now, KH[6][1]], ...KO.slice(1), [tCreep, creepCam(tCreep)]];
  const camRaw = (t) => (t < tCreep ? F.camPath(t, KALL) : creepCam(t));
  // "the camera never stops": a slow drift, smaller when magnified, gone into the plate
  const cam = (t) => { const c = camRaw(t), s = F0 / (F0 - c.z); return E.camDrift(c, t, 5.5 / Math.max(1, s) * (1 - smooth(span(t, tPlate - 2.2, tPlate))), 5); };

  // ---------------------------------------------------------------- you (outside): facing vitrine 1 → turn left → turn back
  const duFlip = (t) => Math.cos(Math.PI * (sineIO(span(t, a.think + .1, a.think + .5)) - sineIO(span(t, a.dl2 - .3, a.dl2 + .1))));
  const duLook = (t) => lerp(lerp(.72, .18, span(t, a.think, a.think + .6)), .66, span(t, a.dl2 - .2, a.dl2 + .8));
  function you(ctx, t) {
    const f = duFlip(t), x = S.HALL.du.x;
    ctx.save(); ctx.translate(x, S.FLOOR); ctx.scale(Math.abs(f) < .06 ? .06 * Math.sign(f || 1) : f, 1);
    E.du(ctx, 0, 0, S.HALL.du.h, { look: duLook(t), light: 1, back: .45, dir: 1 }); ctx.restore();
  }
  // ---------------------------------------------------------------- the kids (indigo, smaller): past the diorama to the plague mask
  const kidX = (t, k) => lerp(520 + k.off, -630 + k.off, trap(span(t, a.now - .2, a.book + 1.4)));
  const kids = (t) => (t < a.now - .4 ? [] : KID.map((k) => { const x = kidX(t, k), d = 520 + k.off - x; return { x, h: k.h, walk: (d / 50 + k.ph) * Math.PI, dir: -1, look: lerp(.15, .45, span(t, a.plague, a.book)) }; }));

  // ---------------------------------------------------------------- the diorama (the office) over time
  const docSit = (t) => span(t, a.sat - .1, a.sat + 1.3);
  const cardU = (k, t) => span(t, [a.cancer, a.alz, a.heart, a.dep][k] - .42, [a.cancer, a.alz, a.heart, a.dep][k] + .5);
  const age = (t) => smooth(span(t, a.now + .3, a.now + 3.2));
  const flyU = (k, t) => span(t, a.which + .15 + k * .12, a.which + 2.25 + k * .12);   // H.06: cards lift out of the diorama to vitrine 1
  function office(ctx, t, w, h) {
    const cards = WORDS.map((wd, k) => [wd, flyU(k, t) > 0 ? 0 : cardU(k, t), age(t), k]);
    S.officeRoom(ctx, t, w, h, { lit: lerp(.15, 1, smooth(span(t, a.think - .2, a.think + 1.2))) * (1 - .55 * age(t)), relic: age(t), doctor: docSit(t),
      you: { a: 1, hand: sineIO(span(t, a.love - .2, a.love + .9)) }, cards });
  }
  // H.06: the four aged cards fly from the desk to a row above vitrine 1, a mint ? rises after each; then each goes to its plaque
  const ROW = (k) => [V1.cx + (k - 1.5) * 168, 44];
  const homeU = (k, t) => span(t, a.dl2 + .35 + k * .1, a.dl2 + 1.45 + k * .1);
  function flyingCards(ctx, t) {
    WORDS.forEach((wd, k) => {
      const u = flyU(k, t); if (u <= 0) return; const h = homeU(k, t); if (h >= 1) return;
      const [x0, y0] = toWorld(OF.desk.x0 + 70 + k * 110, OF.desk.y - 6), [x1, y1] = ROW(k), e = sineIO(u);
      let x = lerp(x0, x1, e), y = lerp(y0, y1, e) - 260 * Math.sin(Math.PI * e), s = lerp(104, 150, e), rot = .25 * Math.sin(Math.PI * e) * (k % 2 ? 1 : -1);
      const q = rise(span(t, a.histDl + k * .12, a.histDl + .7 + k * .12)) * (1 - span(h, 0, .3));
      if (h > 0) { const p = PQ[k], eh = sineIO(h); x = lerp(x, p.x, eh); y = lerp(y, p.y, eh) - 120 * Math.sin(Math.PI * eh); s = lerp(s, p.s * .55, eh); }
      F.wordCard(ctx, t, x, y, s, wd, { rot: rot + (k - 1.5) * .05 * (1 - e), flat: 1 - smooth(span(u, 0, .3)), old: 1, a: 1 - span(h, .8, 1) });
      if (q > 0) F.mintText(ctx, [['?', 1]], x + s * .56, y + s * .16, s * .42, q, { align: 'left' });
    });
  }
  const plaqueOpt = (i, t) => { const named = homeU(i, t) >= .85, q = named ? smooth(span(homeU(i, t), .85, 1)) * (1 - smooth(span(t, a.comes + .5 + i * .1, a.comes + 1.2 + i * .1))) : 0; return { name: named ? NAMES[i] : '', q }; };

  // ---------------------------------------------------------------- H.07 the panel: FINDING (fast) | THE BODY (slow)
  const panelM = (t) => sineIO(span(t, a.mach + .25, a.mach + 1.15));
  const panelOut = (t) => span(t, a.every - .15, a.every + .35);
  const bigM = (t) => sineIO(span(t, a.every + .05, a.every + 1.0));
  const MOLS = (() => { const out = []; for (let k = 0; k < 12; k++) out.push({ c: k % 4, r: Math.floor(k / 4), seed: 3 + k * 7 }); return out; })();
  function panelBox(ctx, x, y, w, h, al = 1) {
    ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = rgba(mixHex(P.night1, P.ind2, .5), .96); ctx.beginPath(); ctx.roundRect(x, y, w, h, Math.min(14, w * .03)); ctx.fill();
    ctx.strokeStyle = rgba(P.cream, .45); ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
  }
  function machinePanel(ctx, t, c) {
    const m = panelM(t); if (m <= 0 || t > a.every + 1.1) return;
    const p = E.project(c, F0, PQ[0].x - PQ[0].s / 2, PQ[0].y - PQ[0].h / 2), k = p ? p[2] : 1;
    const from = { x: p[0], y: p[1], w: PQ[0].s * k, h: PQ[0].h * k };
    const bm = bigM(t), to = bm > 0 ? { x: BIG.x, y: BIG.y, w: F.DATES.w * BIG.s, h: F.DATES.h * BIG.s } : PANEL;
    const r0 = { x: lerp(from.x, PANEL.x, m), y: lerp(from.y, PANEL.y, m), w: lerp(from.w, PANEL.w, m), h: lerp(from.h, PANEL.h, m) };
    const r = bm > 0 ? { x: lerp(PANEL.x, to.x, bm), y: lerp(PANEL.y, to.y, bm), w: lerp(PANEL.w, to.w, bm), h: lerp(PANEL.h, to.h, bm) } : r0;
    ctx.save(); float(ctx, t, m);
    panelBox(ctx, r.x, r.y, r.w, r.h, 1 - span(bm, .75, 1));
    const ca = span(m, .75, 1) * (1 - panelOut(t)); if (ca > 0) { ctx.globalAlpha = ca; panelContent(ctx, t, r); }
    ctx.restore();
  }
  function panelContent(ctx, t, r) {
    const { x, y, w, h } = r, mid = x + w / 2;
    maskLine(ctx, [['FINDING', 0]], x + 56, y + 74, 26, rise(span(t, a.mach + .9, a.mach + 1.6)), { serif: false, weight: 600, col: COOL.text, glow: false });
    maskLine(ctx, [['THE BODY', 0]], mid + 56, y + 74, 26, rise(span(t, a.rush - .1, a.rush + .6)), { serif: false, weight: 600, col: MINT.text, glow: false });
    ctx.fillStyle = rgba(P.cream, .18); ctx.fillRect(mid - 1, y + 50, 2, h - 100);
    // the machine: molecules appear one after another, fast (each with a cool spark), then bob
    const t0 = a.mach + 1.0, gx = x + 110, gy = y + 170, cw = (w / 2 - 190) / 3, rh = (h - 260) / 2;
    for (const [k, mo] of MOLS.entries()) {
      const tb = t0 + k * .2, e = expoOut(span(t, tb, tb + .35)); if (e <= 0) continue;
      const mx = gx + mo.c * cw + 9 * Math.sin(t * 1.6 + k), my = gy + mo.r * rh + 9 * Math.cos(t * 1.4 + k * 1.7);
      F.molecule(ctx, t, mx, my, 104 * e, mo.seed, { col: COOL, a: .95 });
      const sp = 1 - span(t, tb, tb + .45); if (sp > 0) F.spark(ctx, t, mx, my, 3 * sp, { a: sp });
    }
    // the body: a person lying in a scanner ring; one slow breath every 4.5 s (nothing speeds up)
    const ru = sineIO(span(t, a.rush - .3, a.rush + .9)), bx = mid + w / 4, by = y + h * .58;
    if (ru > 0) {
      const br = Math.sin(Math.PI * 2 * (t - a.rush) / 4.5), inh = Math.max(0, br);
      ctx.save(); ctx.globalAlpha *= ru;
      ctx.fillStyle = E.rad(ctx, bx, by, 300, [[0, rgba(MINT.deep, .55 + .15 * inh)], [.6, rgba(MINT.deep, .22)], [1, rgba(MINT.deep, 0)]]); ctx.fillRect(bx - 300, by - 300, 600, 600);
      ctx.fillStyle = rgba(MINT.line, .5); ctx.fillRect(bx - 230, by + 46, 460, 4);
      ctx.save(); ctx.translate(bx - 170, by + 10); ctx.scale(1, 1 + .03 * br); ctx.rotate(Math.PI / 2); E.person(ctx, 0, 0, 330, { look: 0, light: 1, back: .9, rim: MINT.line }); ctx.restore();
      halo(ctx, bx + 60, by, 220, .14 + .16 * inh, MINT.halo, MINT.body);
      ctx.strokeStyle = rgba(MINT.line, .55 + .35 * inh); ctx.lineWidth = 10; ctx.beginPath(); ctx.ellipse(bx + 60, by, 70, 150, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ru); ctx.stroke();
      ctx.strokeStyle = rgba(MINT.core, .5 * inh); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(bx + 60, by, 82, 164, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
  }
  // ---------------------------------------------------------------- H.08 / H.09 / H.10 the label(s)
  const nameAt = (k, t) => rise(span(t, a.each + .7 + k * .1, a.each + 1.4 + k * .1));
  const cloneU = (k, t) => expoOut(span(t, a.each + .05 + k * .08, a.each + 1.05 + k * .08));
  const backU = (k, t) => sineIO(span(t, a.comes + .1 + k * .12, a.comes + 1.2 + k * .12));
  function labels(ctx, t, c) {
    if (t < a.every + .5 || t > a.comes + 1.7) return;
    ctx.save(); float(ctx, t, 1 - backU(0, t));
    const lab = (x, y, s, o, nm, nu) => {
      const r = F.twoDates(ctx, t, x, y, s, { name: ' ', ...o });
      if (nu > 0) maskLine(ctx, [[nm, 0]], x + 40 * s, y + 56 * s, 26 * s, nu, { serif: false, weight: 600, col: P.cream, glow: false });
      return r;
    };
    const al = span(t, a.every + .5, a.every + 1.0);
    if (t < a.each + .05) {   // H.08: one label (EVERY CURE)
      ctx.globalAlpha = al;
      lab(BIG.x, BIG.y, BIG.s, { found: span(t, a.found - .32, a.found + .5), blink: span(t, a.proven - .15, a.proven + .3) }, 'EVERY CURE', rise(span(t, a.every + .7, a.every + 1.4)));
    } else {
      const roomT = t;
      for (let k = 3; k >= 0; k--) {
        const u = cloneU(k, t), [gx, gy] = GRID[k];
        let x = lerp(BIG.x, gx, u), y = lerp(BIG.y, gy, u), s = lerp(BIG.s, GS, u), al2 = 1;
        const b = backU(k, t);
        if (b > 0) { const p = E.project(c, F0, PQ[k].x - PQ[k].s / 2, PQ[k].y - PQ[k].h / 2); if (p) { x = lerp(x, p[0], b); y = lerp(y, p[1], b); s = lerp(s, PQ[k].s * p[2] / F.DATES.w, b); } al2 = 1 - span(b, .7, 1); }
        ctx.globalAlpha = al2;
        const o = { found: 1, wait: null, blink: k === 0 ? .7 * (1 - span(t, a.weeks - .35, a.weeks)) : .7 };
        if (t > a.speed - .2) {
          o.wait = k === 0 ? sineIO(span(roomT, a.fastest, a.weeks)) : k === 3 ? .1 * span(roomT, a.speed, a.comes) : (k === 1 ? .42 : .3) * smooth(span(roomT, a.speed + .3, a.comes));
          o.waitTag = k === 0 ? 'WEEKS' : k === 3 ? 'DECADES' : ''; o.waitTagA = k === 0 ? rise(span(t, a.weeks, a.weeks + .6)) : k === 3 ? rise(span(t, a.decades, a.decades + .6)) : 0;
        }
        if (k === 0) o.proven = span(t, a.weeks - .35, a.weeks + .45);
        lab(x, y, s, o, NAMES[k], nameAt(k, t) * (1 - span(b, 0, .4)));
        if (u < 1 && k === 0) maskLine(ctx, [['EVERY CURE', 0]], x + 40 * s, y + 56 * s, 26 * s, 1 - span(t, a.each, a.each + .5), { serif: false, weight: 600, col: P.cream, glow: false });
      }
    }
    ctx.restore();
  }
  // the room breathes darker and lighter on "decades" (years pass, no clock): moon light + a veil
  const yearsDip = (t) => { const u = span(t, a.slowest, a.slowest + 3.4); return u > 0 && u < 1 ? Math.sin(Math.PI * 2 * u) ** 2 * (1 - u * .3) : 0; };
  const veilA = (t) => (.58 - .18 * smooth(span(t, a.each, a.each + 1.2))) * smooth(span(t, a.mach + .2, a.mach + 1.1)) * (1 - smooth(span(t, a.comes + .3, a.comes + 1.6))) + .12 * yearsDip(t);

  // ---------------------------------------------------------------- H.10–H.13 the wall panel: C1, the fold, the frame
  const fold = (t) => sineIO(span(t, a.runs + .15, a.runs + 1.7));
  let TB = null;   // the wall text's block (from its first draw)
  function wall(ctx, t) {
    const f = fold(t);
    if (f < 1) {
      const credit = rise(span(t, a.dario - .1, a.dario + .7));
      ctx.save();
      if (f > 0 && TB) {   // the block shrinks into the frame (uniform scale about the block's centre → the frame's centre)
        const bw = TEXT.w, bh = TB.bottom - (TEXT.y - TEXT.size), cx0 = TEXT.x + bw / 2, cy0 = TEXT.y - TEXT.size + bh / 2, k = lerp(1, Math.min(FR.w / bw, FR.h / bh) * .8, f);
        ctx.translate(lerp(cx0, FR.x + FR.w / 2, f), lerp(cy0, FR.y + FR.h / 2, f)); ctx.scale(k, k); ctx.translate(-cx0, -cy0); ctx.globalAlpha *= 1 - span(f, .55, 1);
      }
      const r = F.wallText(ctx, t, T, { id: 'C1', x: TEXT.x, y: TEXT.y, w: TEXT.w, size: TEXT.size, credit, a: rise(span(t, a.comes + .6, a.comes + 1.8)) });
      if (r && !TB) TB = r;
      ctx.restore();
    }
    // MADE TO SELL SHARES (mint), then NOT INVESTMENT ADVICE: both sink before the plate
    const mx = FR.x + FR.w / 2;
    const su = rise(span(t, a.sell - .1, a.sell + .6)) * (1 - expoIn(span(t, a.stock - .1, a.stock + .4)));
    if (su > 0) F.mintText(ctx, [['MADE TO SELL SHARES', .7]], mx, FR.y + FR.h + 74, 30, su, { serif: false, weight: 600, align: 'center', spacing: .12 });
    const nu = span(t, a.stock + .1, a.stock + .9) * (1 - span(t, tPlate - .8, tPlate - .1));
    if (nu > 0) F.bracket(ctx, FR.x + 60, FR.x + FR.w - 60, FR.y + FR.h + 104, nu, 'NOT INVESTMENT ADVICE', { size: 28 });
  }

  // ---------------------------------------------------------------- one frame
  return (ctx, t) => {
    if (t >= tPlate) { S.plateRoadshow(ctx, t, T); return; }
    const c = cam(t), dive = clamp(span(t, a.sat - .3, a.sat + .9) * (1 - span(t, a.now, a.now + 1.3)));
    S.hallWorld(ctx, c, t, {
      moon: .75 - .32 * yearsDip(t),
      du: false, kids: kids(t),
      diorama: { lit: lerp(.15, 1, smooth(span(t, a.think - .2, a.think + 1.2))) * (1 - .5 * age(t)), relic: age(t), inside: (cx, w, h) => office(cx, t, w, h), plaque: 1 },
      plaque: (i) => plaqueOpt(i, t),
      v: (i) => (i === 0 ? { glow: 1 - .25 * dive } : {}),
      frame: { u: span(t, a.runs + .5, a.runs + 2.0), cap: span(t, a.runs + 1.6, a.runs + 2.4) },
      lectern: { lamp: 1, open: 0 },
      panel: (cx) => wall(cx, t),
      extra: (cx) => {
        // the hero light's dust, you, the DEADLINE stamp on the glass, the flying cards
        S.motes(cx, t, V1.x + 40, V1.y + 60, V1.w - 80, V1.h - 120, 1.2);
        you(cx, t);
        F.stamp(cx, t, 'DEADLINE: 2036', V1.x + 210, V1.y + 120, { t0: a.dl + .08, size: 46, rot: -.07, ink: MINT.ink, out: a.think + .15 });
        flyingCards(cx, t);
      },
    });
    // the veil over the hall while the explainers speak (screen space), then the explainers
    const va = veilA(t); if (va > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = rgba(P.night0, va); ctx.fillRect(0, 0, W, H); ctx.restore(); }
    machinePanel(ctx, t, c);
    labels(ctx, t, c);
    // H.01: the thesis (frame 0 = thumbnail A) and the silent proof line · H.06: the question
    F.thesis(ctx, t, 104, 318, 1, { lines: ['AI GAVE DISEASE', 'A DEADLINE'], size: 108, out: span(t, a.think - .35, a.think + .45) });
    F.source(ctx, t, .9, a.alz, F.SOURCES.hook);
    F.thesis(ctx, t, 104, 318, span(t, a.histDl - .2, a.histDl + .8), { lines: ['HISTORY BY', 'THE DEADLINE?'], size: 96, out: span(t, a.mach - .3, a.mach + .4) });
  };
}
