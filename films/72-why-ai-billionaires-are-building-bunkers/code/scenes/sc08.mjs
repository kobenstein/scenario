// c08 · B2 · THE FLOOR PLANS · 'But look at what gets planned' → 'But follow the trail' (S.plateBoard, B3).
// One continuous take on THE GROUND LINE, view fixed at the board's framing { 960, 500, 1 } (only the breath moves it): objects move, the
// camera rests. Carriers: the dividing line of c07 slides left and becomes the first plan's wall → ★ the doors of plan 1 lock one by one
// (a gold dot runs room to room) → plan 2 draws beside it (the barred room) → the investors' question writes across both plans → the plans
// fold into the line, the AI company's glass room rises with its whiteboard → the day-after timeline → the public and the politicians turn
// to the building → the building sinks, two bars rise (Gallup) → the bars sink, the ground opens on a bunker; a policy card is pinned
// (where the board's 3rd card will hang) → the bunker's rooms fill (a hobby) → the two owners' cards are pinned at the 1st and 2nd places →
// NOT PEOPLE → card 3 turns over: the drills, PRACTICE, NOT A PREDICTION → the cut closes, the three cards turn over: GUARDS · LOCKS ·
// MUTINY PLANS, the 4th pin → plateBoard.
//
// | ID    | anchor (phrase)                  | zeigt wörtlich                                       | picture                                                                    | layer |
// |-------|----------------------------------|------------------------------------------------------|----------------------------------------------------------------------------|-------|
// | 4.18  | But look at what gets planned    | what gets planned today                              | the room box closes into the line, the glass room sinks; the dividing line becomes the wall of a floor plan (cream lines, no grid): PLANNED TODAY | EXPL |
// | 4.19★ | Some new bunker projects         | "anti-mutiny": guards or anyone can't take over      | in the plan the doors lock one by one (a gold dot runs room to room, cream bars close the doors): “ANTI-MUTINY” PROCEDURES (+ source) | EXPL |
// | 4.20  | Others are designed              | "detention areas"                                    | plan 1 moves left; a second plan draws: one room gets bars: “DETENTION AREAS” (+ source) | EXPL |
// | 4.21  | The question from that room      | the question from that room is in the floor plans    | the investors' question (the words of C3) writes itself across both plans  | EXPL  |
// | 4.22  | The companies that build         | the AI companies prepare too                         | the plans fold into the line; a glass room rises: three people, a whiteboard | MIX |
// | 4.23  | This fall, they were reported    | rehearsing a day of their own                        | the whiteboard: “DAY AFTER” SCENARIOS AT LEADING AI COMPANIES (+ Axios)     | EXPL  |
// | 4.24  | The day after an                 | the day after an AI disaster                         | a short timeline on the board: AI DISASTER → THE DAY AFTER                  | EXPL  |
// | 4.25  | The day the public               | the public and the politicians turn against them     | two groups rise and turn to the building: THE PUBLIC · POLITICIANS, arrows of attention (no torches, no crowd) | MIX |
// | 4.26  | Already, more Americans          | more oppose a data center than a nuclear plant       | two bars: AI DATA CENTER 71% · NUCLEAR PLANT 53% · OPPOSE NEARBY (Gallup, KB5) | EXPL |
// | 4.27  | To be fair                       | for some, just insurance                             | the ground opens on a bunker; a policy card is pinned: INSURANCE            | EXPL  |
// | 4.28  | Or a very expensive hobby        | or an expensive hobby                                | its rooms light: SPAS · ROCK WALLS · GO-KART TRACKS, calm figures (+ source) | MIX |
// | 4.29  | The two owners you heard         | the two owners say storms and bombs                  | two cards pinned: MARK ZUCKERBERG: STORMS · SAM ALTMAN: BOMBS               | EXPL  |
// | 4.30  | Not people                       | not people                                           | under them: NOT PEOPLE                                                      | EXPL  |
// | 4.31  | And one A.I. company             | drills are practice, not a prediction                | card 3 turns: “PREPAREDNESS EXERCISES”, the badge PRACTICE, NOT A PREDICTION; the cards turn: GUARDS · LOCKS · MUTINY PLANS → plateBoard | EXPL |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f72_kit.mjs';
import * as S from '../lib/f72_world.mjs';
import * as X from '../lib/f72_stage.mjs';
import * as B from '../lib/b2_parts.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, expoIn, halo } = E;
const { GOLD, COOL, CREAM, PAPER, CONCRETE, SOURCES: SRC } = F;
const PR = F.PRINT72, LY = X.LINE_Y, TAU = Math.PI * 2;
const PHRASE78 = 'But look at what gets planned';
const P1 = { x: 560, y: 150, w: 800, h: 420 }, P1L = { x: 150, y: 190, s: .68 }, P2 = { x: 1060, y: 170, w: 700, h: 400 };
const ROOMS1 = [{ x: 0, y: 0, w: .34, h: .5 }, { x: .34, y: 0, w: .33, h: .5 }, { x: .67, y: 0, w: .33, h: .5 }, { x: 0, y: .5, w: .34, h: .5 }, { x: .34, y: .5, w: .33, h: .5 }, { x: .67, y: .5, w: .33, h: .5 }];
const DOORS1 = [[.34, .25], [.67, .25], [.835, .5], [.67, .75], [.34, .75]];
const PATH1 = [[.17, .25], [.34, .25], [.5, .25], [.67, .25], [.835, .25], [.835, .5], [.835, .75], [.67, .75], [.5, .75], [.34, .75], [.17, .75]];
const ROOMS2 = [{ x: 0, y: 0, w: .55, h: .55 }, { x: .55, y: 0, w: .45, h: .55 }, { x: 0, y: .55, w: .4, h: .45 }, { x: .4, y: .55, w: .6, h: .45 }];
const GALLUP = SRC.gallup.map((s) => { const m = s.match(/^(.*?)\s+(\d+)%$/); return { name: m[1], pct: Number(m[2]), txt: m[2] + '%' }; });
const OWNERS = [[SRC.zuckerberg.credit.split(' · ')[0].toUpperCase(), SRC.ownersSay[0]], [SRC.altman23.credit.split(' · ')[0].toUpperCase(), SRC.ownersSay[1]]];
const CARD3 = S.PBOARD.cards[2];
const BK = { x: 670, room: { x0: 620, x1: 1280, h: 160 }, depth: 56, cut: { x0: 530, x1: 1370, depth: 300 } };   // right of the source line's reach

export default async (T, R) => {
  const G = (p, n = 0, after = R.a - 1) => T.G(p, n, after);
  const A = {
    look: R.a, planned: G('gets planned'), some: G('Some new bunker'), anti: G('anti-mutiny'), so: G('so that guards'), take: G("can't take over"),
    others: G('Others are designed'), det: G('detention areas'), question: G('The question from that room'), plans: G('floor plans'),
    companies: G('The companies that build'), fall: G('This fall'), rehearse: G('rehearsing'), dayAfter: G('The day after an'), disaster: G('disaster'),
    public: G('The day the public'), pol: G('politicians'), turn: G('turn against them'), already: G('Already, more Americans'), dc: G('data center'),
    nuclear: G('nuclear power plant'), fair: G('To be fair'), insurance: G('insurance'), hobby: G('Or a very expensive'), owners: G('The two owners'),
    storms: G('storms'), bombs: G('bombs', 0, G('storms')), notp: G('Not people'), drills: G('drills'), practice: G('practice, not a prediction'), end: R.b,
  };
  A.oneAI = G('And one', 0, A.notp);
  const t0 = R.a + S.SEAM_HALF, tP = A.end - S.SEAM_HALF;

  const view = (t) => { const k = 1 + S.CREEP * clamp(t - (R.a - .5), 0, 1) * (1 - sineIO(span(t, t0, t0 + 1.6))) ; const b = S.breathe(t); return { x: 960 + b.dx, y: 500 + b.dy, s: k }; };
  const pool = (t) => B.seq(t, [[t0, [980, 420, .85]], [A.some, [960, 360, .85]], [A.companies + 1, [960, 380, .85]], [A.already + .5, [960, 420, .8]], [A.fair + 1, [960, 640, .85]], [A.owners, [820, 440, .85]], [tP - .2, [960, 420, .85]], [A.end, [960, 420, .85]]]);

  // ---------------------------------------------------------------- 4.18: out of the split
  const splitOut = (t) => sineIO(span(t, t0, t0 + 1.2));
  const divX = (t) => lerp(B.SPLIT.div, P1.x, sineIO(span(t, t0 + .3, t0 + 1.7)));
  const plan1U = (t) => span(t, t0 + .5, A.some + .5);
  const move1 = (t) => sineIO(span(t, A.others - .3, A.others + 1.3));
  const plan2U = (t) => span(t, A.others + .6, A.det + .6);
  const plansOut = (t) => sineIO(span(t, A.companies - .5, A.companies + .7));
  const lockAt = (i) => A.anti + .4 + i * ((A.take + .3 - A.anti - .4) / (DOORS1.length - 1));
  const dotU = (t) => span(t, A.anti - .1, A.take + .3);

  function plan1(ctx, t, s) {
    const u = plan1U(t); if (u <= 0) return;
    const m = move1(t), sc = lerp(1, P1L.s, m), x = lerp(P1.x, P1L.x, m), y = lerp(P1.y, P1L.y, m);
    ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
    F.floorPlan(ctx, t, 0, 0, P1.w, P1.h, { u, s: s * sc, rooms: ROOMS1.map((r, i) => ({ ...r, door: i < 3 })) });
    const iw = P1.w - 20, ih = P1.h - 20, at = ([fx, fy]) => [10 + fx * iw, 10 + fy * ih];
    // calm figures in four rooms (anyone inside)
    for (const [ri, d] of [[1, 1], [3, -1], [4, 1], [5, -1]]) { const r = ROOMS1[ri], k = span(u, .5 + ri * .05, .9 + ri * .05); if (k <= 0) continue;
      ctx.save(); ctx.globalAlpha *= k; F.person(ctx, 10 + (r.x + r.w * .5) * iw, 10 + (r.y + r.h) * ih - 14, 92, { pose: 'stand', dir: d, light: -1, rim: GOLD.line }); ctx.restore(); }
    // ★ the doors lock in sequence: a gold dot runs along the path, a cream bar closes each door as it passes
    const du = dotU(t);
    if (du > 0) { const pts = PATH1.map(at), k = sineIO(du);
      F.goldSpan(ctx, pts, Math.max(0, k - .12), k, { w: 3, spark: du < 1, a: 1 - span(t, A.take + .3, A.take + 1.0) });
      DOORS1.forEach((dp, i) => { const lu = span(t, lockAt(i) - .05, lockAt(i) + .2); if (lu <= 0) return; const [dx, dy] = at(dp), vert = dp[1] !== .5;
        ctx.save(); ctx.fillStyle = CREAM; ctx.globalAlpha *= clamp(lu * 2); const L = 46 * expoOut(lu);
        if (vert) ctx.fillRect(dx - 5, dy - L / 2, 10, L); else ctx.fillRect(dx - L / 2, dy - 5, L, 10);
        if (lu < 1) halo(ctx, dx, dy, 40, .5 * (1 - lu), GOLD.halo, GOLD.core); ctx.restore(); }); }
    X.label(ctx, SRC.antiMutiny, P1.w / 2, -34, B.lab(t, A.anti - .2, A.plans + .4), { size: 34 / Math.max(.7, sc) * .9 + 4, spacing: .1 });
    ctx.restore();
  }
  function plan2(ctx, t, s) {
    const u = plan2U(t); if (u <= 0) return;
    F.floorPlan(ctx, t, P2.x, P2.y, P2.w, P2.h, { u, s, rooms: ROOMS2.map((r, i) => ({ ...r, bars: i === 1 ? span(t, A.det - .1, A.det + 1.0) : 0, gold: i === 1 ? .6 * span(t, A.det, A.det + .8) : 0, door: i !== 1 })) });
    const r = ROOMS2[0], iw = P2.w - 20, ih = P2.h - 20;
    ctx.save(); ctx.globalAlpha *= span(u, .6, 1); F.person(ctx, P2.x + 10 + .3 * iw, P2.y + 10 + .55 * ih - 14, 92, { pose: 'stand', dir: 1, light: -1, rim: GOLD.line }); ctx.restore();
    X.label(ctx, SRC.detention, P2.x + P2.w / 2, P2.y - 34, B.lab(t, A.det - .3, A.plans + .4), { size: 34, spacing: .1 });
  }
  // 4.21 the question across both plans (words write in)
  const qWords = (B.C3Q || '').split(' ');
  function question(ctx, t) {
    const qu = span(t, A.question + .2, A.plans + .2), out = span(t, A.companies - .6, A.companies + .1); if (qu <= 0 || out >= 1 || !qWords.length) return;
    const size = 50, lines = [], mid = Math.ceil(qWords.length / 2); lines.push(qWords.slice(0, mid)); lines.push(qWords.slice(mid));
    ctx.save(); ctx.globalAlpha *= 1 - out;
    ctx.fillStyle = E.lin(ctx, 0, 270, 0, 470, [[0, rgba(P.night0, 0)], [.25, rgba(P.night0, .7)], [.75, rgba(P.night0, .7)], [1, rgba(P.night0, 0)]]); ctx.fillRect(80, 270, 1760, 200);
    let k = 0; const n = qWords.length;
    lines.forEach((ln, li) => { const tw = F.measure(ln.join(' '), size, true); let x = 960 - tw / 2; const y = 352 + li * 66;
      for (const w of ln) { const wu = span(qu, k / n * .85, k / n * .85 + .2); F.maskLine(ctx, [[w, 0]], x, y, size, F.rise(wu), { serif: true, col: mixHex(CREAM, GOLD.text, .35), glow: true }); x += F.measure(w + ' ', size, true) + size * .26; k++; } });
    ctx.restore();
  }

  // ---------------------------------------------------------------- 4.22–4.26: the AI company's room, the day after, the public, the bars
  const CR = { x: 560, w: 800, h: 380 }, WB = { x: 690, y: 262, w: 540, h: 190 };
  const crU = (t) => B.riseSink(span(t, A.companies + .1, A.companies + 1.3), span(t, A.already - .3, A.already + .6));
  const groupsU = (t) => B.riseSink(span(t, A.public + .2, A.pol + .5), span(t, A.already - .4, A.already + .4));
  function companyRoom(ctx, t, s) {
    const u = crU(t); if (u <= 0) return;
    B.riseFrom(ctx, LY, CR.h + 20, u, () => {
      halo(ctx, CR.x + CR.w / 2, LY - CR.h * .5, CR.w * .8, .16, COOL.halo, COOL.core);
      ctx.fillStyle = E.lin(ctx, 0, LY - CR.h, 0, LY, [[0, rgba(mixHex(P.ind1, COOL.deep, .5), .75)], [1, rgba(mixHex(P.night1, COOL.deep, .4), .85)]]); ctx.fillRect(CR.x, LY - CR.h, CR.w, CR.h);
      // the whiteboard on two legs
      ctx.strokeStyle = rgba(CREAM, .45); ctx.lineWidth = 3 / s; ctx.beginPath(); ctx.moveTo(WB.x + 40, WB.y + WB.h); ctx.lineTo(WB.x + 30, LY); ctx.moveTo(WB.x + WB.w - 40, WB.y + WB.h); ctx.lineTo(WB.x + WB.w - 30, LY); ctx.stroke();
      halo(ctx, WB.x + WB.w / 2, WB.y + WB.h / 2, WB.w * .7, .22, F.LAMP.body, P.cream);
      ctx.fillStyle = E.lin(ctx, 0, WB.y, 0, WB.y + WB.h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(WB.x, WB.y, WB.w, WB.h); ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2 / s; ctx.strokeRect(WB.x, WB.y, WB.w, WB.h);
      // “DAY AFTER” SCENARIOS … (two lines), then the timeline
      // marker sketches while they prepare (wiped as the headline writes)
      const mk = span(t, A.companies + 1.0, A.fall - .2) * (1 - span(t, A.fall - .3, A.fall + .3));
      if (mk > 0) { ctx.save(); ctx.strokeStyle = rgba(mixHex(PAPER.ink, COOL.deep, .4), .45); ctx.lineWidth = 3; ctx.lineCap = 'round';
        [[WB.x + 40, WB.y + 50, 300], [WB.x + 40, WB.y + 92, 220], [WB.x + 40, WB.y + 134, 260]].forEach(([x, y, w], i) => { const k = span(mk, i * .25, .35 + i * .25); if (k <= 0) return;
          ctx.beginPath(); for (let j = 0; j <= 20 * k; j++) { const xx = x + w * j / 20; ctx.lineTo(xx, y + 4 * Math.sin(j * 1.7 + i)); } ctx.stroke(); });
        const k4 = span(mk, .6, 1); if (k4 > 0) { ctx.beginPath(); ctx.arc(WB.x + WB.w - 100, WB.y + WB.h / 2, 46, -Math.PI / 2, -Math.PI / 2 + TAU * k4); ctx.stroke(); }
        ctx.restore(); }
      const L = B.wrap(SRC.dayAfter, 30, WB.w - 60), wu = span(t, A.fall - .1, A.fall + .9);
      L.forEach((ln, i) => F.maskLine(ctx, [[ln, 0]], WB.x + 30, WB.y + 52 + i * 38, 30, F.rise(span(wu, i * .2, .6 + i * .2)), { serif: false, weight: 700, col: PAPER.ink, glow: false }));
      const tl = span(t, A.dayAfter - .1, A.disaster + .5), ty = WB.y + WB.h - 44;
      if (tl > 0) { F.maskLine(ctx, [[B.LOCAL.disaster, 0]], WB.x + 30, ty + 9, 26, F.rise(span(tl, 0, .4)), { serif: false, weight: 700, col: mixHex(PAPER.ink, COOL.deep, .5), glow: false });
        const ax0 = WB.x + 30 + F.measure(B.LOCAL.disaster, 26, false, 700) + 40, ax1 = WB.x + WB.w - 30 - F.measure(B.LOCAL.dayAfter, 26, false, 700) - 30;
        X.arrow(ctx, [[ax0, ty], [ax1, ty]], span(tl, .3, .7), { col: PAPER.ink, w: 3, glow: 0, head: 12 });
        F.maskLine(ctx, [[B.LOCAL.dayAfter, 0]], ax1 + 20, ty + 9, 26, F.rise(span(tl, .6, 1)), { serif: false, weight: 700, col: mixHex(PAPER.ink, GOLD.deep, .6), glow: false }); }
      // three people at work, cool rim
      for (const [x, d, h] of [[CR.x + 70, 1, 170], [CR.x + CR.w - 90, -1, 176], [CR.x + CR.w - 30, -1, 160]]) F.person(ctx, x, LY - 2, h, { pose: 'stand', dir: d, rim: COOL.line, light: -d });
      ctx.strokeStyle = rgba(CREAM, .75); ctx.lineWidth = 2.2 / s; ctx.strokeRect(CR.x, LY - CR.h, CR.w, CR.h);
      ctx.strokeStyle = rgba(CREAM, .25); ctx.lineWidth = 1.2 / s; ctx.beginPath(); for (const f of [.25, .75]) { ctx.moveTo(CR.x + CR.w * f, LY - CR.h); ctx.lineTo(CR.x + CR.w * f, WB.y - 6); } ctx.stroke();
    });
  }
  function groups(ctx, t, s) {
    const u = groupsU(t); if (u <= 0) return;
    const turn = sineIO(span(t, A.turn - .2, A.turn + .9));
    const G1 = [[150, 128], [215, 140], [275, 120], [335, 134], [395, 126]], G2 = [[1560, 150], [1640, 144], [1720, 152]];
    B.riseFrom(ctx, LY, 170, span(u, 0, .7), () => G1.forEach(([x, h], i) => B.turned(ctx, x, turn * (i % 2 ? 1 : 0), () => F.person(ctx, x, LY, h, { pose: 'stand', dir: i % 2 ? -1 : 1, light: -1, rim: mixHex(CREAM, GOLD.line, .5) }))));
    B.riseFrom(ctx, LY, 170, span(u, .3, 1), () => G2.forEach(([x, h], i) => B.turned(ctx, x, turn * (i === 1 ? 0 : 1), () => F.person(ctx, x, LY, h, { pose: 'stand', dir: i === 1 ? -1 : 1, long: true, light: -1, rim: mixHex(CREAM, GOLD.line, .5) }))));
    X.label(ctx, SRC.publicPol[0], 275, LY + 54, B.lab(t, A.public + .3, A.already), { size: 30, gold: .4 });
    X.label(ctx, SRC.publicPol[1], 1640, LY + 54, B.lab(t, A.pol - .1, A.already), { size: 30, gold: .4 });
    const au = span(t, A.turn, A.turn + .9) * (1 - span(t, A.already - .4, A.already));
    if (au > 0) { X.arrow(ctx, [[440, LY - 90], [500, LY - 120], [CR.x - 20, LY - 150]], au, { col: rgba(CREAM, .8), w: 2.4, glow: 0 }); X.arrow(ctx, [[1520, LY - 100], [1460, LY - 130], [CR.x + CR.w + 20, LY - 150]], au, { col: rgba(CREAM, .8), w: 2.4, glow: 0 }); }
  }
  const barsU = (i) => (t) => B.riseSink(span(t, (i ? A.nuclear - .2 : A.dc - 1.1), (i ? A.nuclear : A.dc) + 1.0), span(t, A.fair - .3, A.fair + .5));
  function bars(ctx, t, s) {
    GALLUP.forEach((g, i) => { const u = barsU(i)(t); if (u <= 0) return; const x = 780 + i * 360, h = g.pct * 3.6;
      X.bar(ctx, x, LY, 110, h, u, { col: i ? 'concrete' : 'cool' });
      F.goldText(ctx, [[g.txt, i ? 0 : .15]], x, LY - h * expoOut(u) - 26, 76, F.rise(span(u, .4, 1)), { serif: true, align: 'center', col: i ? CREAM : COOL.text });
      X.label(ctx, g.name, x, LY + 52, span(u, .2, .9), { size: 28, col: i ? CREAM : COOL.text }); });
    X.label(ctx, SRC.gallupHead, 960, 150, B.lab(t, A.already + .3, A.fair + .2), { size: 34, spacing: .16 });
  }

  // ---------------------------------------------------------------- 4.27–4.31: the bunker, the cards → the board
  const cutU = (t) => span(t, A.fair + .1, A.fair + 1.3) * (1 - span(t, A.end - 2.3, A.end - .8));
  const hobbyU = (t) => span(t, A.hobby + .1, A.hobby + 1.2);
  const card3In = (t) => span(t, A.insurance - .6, A.insurance + .2);
  const flip3 = (t) => quartIO(span(t, A.drills - .5, A.drills + .2));
  const ownerU = (i) => (t) => span(t, (i ? A.bombs : A.storms) - .4, (i ? A.bombs : A.storms) + .3);
  const finalFlip = (i) => (t) => quartIO(span(t, A.end - 1.2 + i * .1, A.end - .75 + i * .1));
  function paper(ctx, x, y, rot, lines, sub, u = 1) {   // the evidence card's paper with own text lines (same geometry as F.evidenceCard)
    const w = 300, h = 150, k = expoOut(u);
    ctx.save(); ctx.globalAlpha *= clamp(u * 3); ctx.translate(x, y + (1 - k) * 30); ctx.rotate(rot);
    ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-w / 2 + 6, -h / 2 + 8, w, h);
    ctx.fillStyle = E.lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.strokeRect(-w / 2, -h / 2, w, h);
    lines.forEach(([txt, size], i) => { const tw = F.measure(txt, size, false, 700) + txt.length * size * .06; F.maskLine(ctx, [[txt, 0]], -tw / 2, (i - (lines.length - 1) / 2) * size * 1.2 + size * .36 - (sub ? 10 : 0), size, F.rise(span(u, .3 + i * .1, 1)), { serif: false, weight: 700, col: PAPER.ink, glow: false }); });
    if (sub) F.maskLine(ctx, [[sub, 0]], -w / 2 + 18, h / 2 - 18, 22, F.rise(span(u, .5, 1)), { serif: false, weight: 600, col: PAPER.faint, glow: false });
    ctx.fillStyle = mixHex(CREAM, CONCRETE.lit, .3); ctx.beginPath(); ctx.arc(0, -h / 2 + 4, 9, 0, TAU); ctx.fill(); ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.arc(2, -h / 2 + 6, 3, 0, TAU); ctx.fill();
    ctx.restore();
  }
  const flipDraw = (ctx, x, y, f, front, back) => { const c = Math.cos(Math.PI * f); ctx.save(); ctx.translate(x, y); ctx.scale(Math.max(.03, Math.abs(c)), 1); ctx.translate(-x, -y); (f < .5 ? front : back)(); ctx.restore(); };
  function bunkerPart(ctx, t, s) {
    const cu = cutU(t); if (cu <= 0) return;
    ctx.save(); ctx.beginPath(); ctx.rect(BK.cut.x0, LY - 200, BK.cut.x1 - BK.cut.x0, 200 + BK.cut.depth * sineIO(cu)); ctx.clip();
    F.hatch(ctx, t, BK.x, LY, 130, { tilt: .075, open: 0, glow: .3, s, a: cu });
    const hu = hobbyU(t), ry0 = LY + BK.depth, rh = BK.room.h;
    F.bunker(ctx, t, BK.x, LY, { s, draw: span(cu, .1, .8), fill: span(cu, .3, 1), depth: BK.depth, room: BK.room, light: .35 + .5 * hu });
    // insurance: stacked supply crates along the back wall, packed in as the policy card is pinned; they give way to the hobby
    const su = span(t, A.fair + .9, A.insurance + .4) * (1 - span(t, A.hobby, A.hobby + .9));
    if (su > 0) { ctx.save(); const r = E.prng(808);
      for (let i = 0; i < 14; i++) { const col = i % 7, row = Math.floor(i / 7), k = expoOut(span(su, i * .045, i * .045 + .35)); if (k <= 0) continue;
        const bw = 56 + r() * 14, bx = BK.room.x0 + 200 + col * 64, by = ry0 + rh - 6 - (row + 1) * 44;
        ctx.globalAlpha = k * (1 - .4 * hu); ctx.fillStyle = mixHex(CONCRETE.lit, GOLD.shade, .25 + .1 * r()); ctx.fillRect(bx, by - (1 - k) * 20, bw, 40);
        ctx.strokeStyle = rgba(CREAM, .35); ctx.lineWidth = 1.2 / s; ctx.strokeRect(bx, by - (1 - k) * 20, bw, 40); }
      ctx.restore(); }
    if (hu > 0) { ctx.save(); ctx.globalAlpha *= hu;
      const z = [[BK.room.x0 + 100, BK.room.x0 + 270], [BK.room.x0 + 280, BK.room.x0 + 450], [BK.room.x0 + 460, BK.room.x0 + 640]], zl = [[BK.room.x0 + 150, 34], [BK.room.x0 + 345, 34], [BK.room.x0 + 560, 64]];
      // spa: warm water + steam, two figures
      ctx.fillStyle = E.lin(ctx, 0, ry0 + rh - 40, 0, ry0 + rh, [[0, mixHex(COOL.body, GOLD.line, .35)], [1, mixHex(COOL.deep, P.night0, .3)]]); ctx.fillRect(z[0][0], ry0 + rh - 34, z[0][1] - z[0][0] - 20, 34);
      ctx.strokeStyle = rgba(CREAM, .35); ctx.lineWidth = 1.5 / s; ctx.beginPath(); for (let i = 0; i < 3; i++) { const sx = z[0][0] + 40 + i * 50; ctx.moveTo(sx, ry0 + rh - 40); ctx.bezierCurveTo(sx - 8, ry0 + rh - 60, sx + 8, ry0 + rh - 70, sx, ry0 + rh - 88 - 4 * Math.sin(t * 2 + i)); } ctx.stroke();
      F.lanternPerson(ctx, t, z[0][0] + 60, ry0 + rh - 10, 60, { lamp: 0, dir: 1, col: mixHex(P.night1, GOLD.deep, .25) }); F.lanternPerson(ctx, t, z[0][0] + 120, ry0 + rh - 10, 56, { lamp: 0, dir: -1, ph: 2, col: mixHex(P.night1, GOLD.deep, .25) });
      // rock wall: holds + a climber
      ctx.fillStyle = mixHex(CONCRETE.shade, GOLD.shade, .3); ctx.fillRect(z[1][0] + 40, ry0 + 8, 90, rh - 8); ctx.fillStyle = GOLD.body; const r = E.prng(812); for (let i = 0; i < 14; i++) { ctx.beginPath(); ctx.arc(z[1][0] + 48 + r() * 74, ry0 + 16 + r() * (rh - 30), 3.5, 0, TAU); ctx.fill(); }
      F.person(ctx, z[1][0] + 140, ry0 + rh - 34, 80, { pose: 'reach', dir: -1, light: 1, rim: GOLD.line });
      // go-kart track: an oval line and a small kart running round
      X.drawPath(ctx, F.arcPts((z[2][0] + z[2][1]) / 2, ry0 + rh - 40, 76, 24, 0, TAU, 40), 1, { col: rgba(CREAM, .6), w: 2 / s });
      const ka = t * 1.6, kx = (z[2][0] + z[2][1]) / 2 + Math.cos(ka) * 76, ky = ry0 + rh - 40 + Math.sin(ka) * 24; ctx.fillStyle = GOLD.body; ctx.beginPath(); ctx.roundRect(kx - 9, ky - 7, 18, 10, 3); ctx.fill();
      SRC.hobby.forEach((txt, i) => X.label(ctx, txt, zl[i][0], ry0 + zl[i][1], span(hu, .2 + i * .15, .7 + i * .15) * (1 - span(t, A.owners, A.owners + .5)), { size: 22, gold: .3 }));
      ctx.restore(); }
    ctx.restore();
  }
  function cardsPart(ctx, t, s) {
    // card 3: INSURANCE → (turns) the drills → (turns) MUTINY PLANS
    const c3 = card3In(t);
    if (c3 > 0) { const [x, y, r] = CARD3, f3 = flip3(t), ff = finalFlip(2)(t);
      const front = () => paper(ctx, x, y, r, [[SRC.insurance, 36]], null, c3);
      const back = () => paper(ctx, x, y, r, [[SRC.drills.split(' ')[0], 26], [SRC.drills.split(' ').slice(1).join(' '), 26]], null, 1);
      if (ff <= 0) flipDraw(ctx, x, y, f3, front, back);
      else flipDraw(ctx, x, y, ff, back, () => F.evidenceCard(ctx, t, x, y, SRC.trail[2], { rot: r })); }
    // the owners' cards (1, 2) → GUARDS, LOCKS
    [0, 1].forEach((i) => { const u = ownerU(i)(t); if (u <= 0) return; const [x, y, r] = S.PBOARD.cards[i], ff = finalFlip(i)(t);
      const front = () => paper(ctx, x, y, r, [[OWNERS[i][1], 40]], OWNERS[i][0], u);
      if (ff <= 0) front(); else flipDraw(ctx, x, y, ff, front, () => F.evidenceCard(ctx, t, x, y, SRC.trail[i], { rot: r })); });
    X.label(ctx, B.LOCAL.notPeople, 620, 548, B.lab(t, A.notp - .1, A.end - 1.3), { size: 34, spacing: .14 });
    // the badge under card 3 (4.31)
    const bu = B.lab(t, A.practice - .2, A.end - 1.0, .7, .5); if (bu > 0) F.badge(ctx, t, CARD3[0], 548, SRC.practice, bu, { size: 24 });
    // the 4th pin
    const pu = span(t, A.end - 1.0, A.end - .6); if (pu > 0) { const [px, py] = S.PBOARD.pin4; ctx.fillStyle = mixHex(CREAM, CONCRETE.lit, .3); ctx.beginPath(); ctx.arc(px, py, 9 * expoOut(pu), 0, TAU); ctx.fill(); }
  }

  // ---------------------------------------------------------------- the take
  function draw(ctx, t) {
    const v = view(t), [lx, ly, pl] = pool(t), so = splitOut(t);
    if (so < 1) {   // 4.18: the split picture closes (the room box folds into the line like a blind, the glass room sinks)
      const v0 = v, [bx, by] = X.toScreen(v0, B.SPLIT.box.x, B.SPLIT.box.y), bw = B.SPLIT.box.w * v0.s, bh = B.SPLIT.box.h * v0.s;
      B.drawSplit(ctx, t, v0, { box: { x: bx, y: by + bh * so, w: bw, h: Math.max(1, bh * (1 - so)) }, boxU: so < .999 ? 1 : 0, glass: 1 - so, div: 0, labels: 1 - span(t, t0, t0 + .5), onTable: B.nameCards(1), frame: 1 - so, lx, ly, pool: pl });
    } else X.ground(ctx, t, v, { lx, ly, pool: pl, cut: cutU(t) > 0 ? { ...BK.cut, u: cutU(t) } : null });
    X.inView(ctx, v, (s) => {
      // the dividing line slides left and becomes the plan's wall
      const dl = 1 - plan1U(t) * 2; if (t >= t0 && dl > 0) X.drawPath(ctx, [[divX(t), LY], [divX(t), LY - 460]], 1, { col: rgba(CREAM, .8 * clamp(dl + .3)), w: 2.4 / s, dash: [12 / s, 9 / s] });
      const po = plansOut(t);
      if (po < 1) { ctx.save(); ctx.translate(0, LY); ctx.scale(1, 1 - po); ctx.translate(0, -LY); plan1(ctx, t, s); plan2(ctx, t, s); ctx.restore(); }
      companyRoom(ctx, t, s); groups(ctx, t, s); bars(ctx, t, s);
      bunkerPart(ctx, t, s); cardsPart(ctx, t, s);
      X.dateTag(ctx, B.LOCAL.planned, 960, 92, B.lab(t, A.planned - .3, A.some + .2));
    });
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    question(ctx, t);
    ctx.restore();
    if (t > A.anti - .3 && t < A.others + 1) F.source(ctx, t, A.anti, A.others + .5, SRC.antiMutinySrc);
    if (t > A.det - .3 && t < A.companies) F.source(ctx, t, A.det, A.companies - .3, SRC.detentionSrc);
    if (t > A.fall && t < A.public + .5) F.source(ctx, t, A.fall + .3, A.public + .2, SRC.dayAfterSrc);
    if (t > A.already && t < A.fair + .3) F.source(ctx, t, A.already + .4, A.fair, SRC.kb.gallupSrc);   // KB5
    if (t > A.hobby && t < A.owners + .5) F.source(ctx, t, A.hobby + .3, A.owners + .3, SRC.hobbySrc);
  }
  const marks = [A.some, A.others, A.question, A.companies, A.fall, A.public, A.already, A.fair, A.hobby, A.owners, A.oneAI];
  return [{ t: R.a, draw: (ctx, t) => B.plateSplit(ctx, t, T, PHRASE78), print: PR }, { t: t0, draw, print: PR }, ...marks.map((t) => ({ t, draw, print: PR })), { t: tP, draw: (ctx, t) => S.plateBoard(ctx, t, T), print: PR }];
};
