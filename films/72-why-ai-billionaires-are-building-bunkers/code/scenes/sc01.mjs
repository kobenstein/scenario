// c01 · HOOK (lead, the quality reference) · 'The people building artificial' → 'There are three obvious suspects' (plateList, B1).
// One continuous take, no cut inside. A motion-design sequence, not a world ride: every sentence gets its own picture that shows exactly
// what it says; the pictures hand over through carrier objects (the slope flattens into THE GROUND LINE · the glass room's disc throws its
// beam over your life · a silhouette walks to the hatch and climbs down into the cut-open ground · the concrete door · the line lifts back
// into the slope (ANCHOR) · the view tilts into the sky where THE LIST rises · the list folds down into the researchers' board · the board
// grows into the quote card · AGI lifts off the card and becomes the disc · the disc writes row 2 · its light grows round a bunker · the list
// takes the centre → plateList). Leitbild only in H.01 and H.08 (anchor 1 of 3). ★ = the Sutskever quote (H.12).
//
// | ID    | anchor (phrase)                     | zeigt wörtlich                                              | picture                                                                        | layer  | carrier out        |
// |-------|-------------------------------------|-------------------------------------------------------------|--------------------------------------------------------------------------------|--------|--------------------|
// | H.01  | The people building artificial      | the people building AI are building bunkers                 | thumbnail A2: the lantern crowd, the hatch half open, you; title AI BILLIONAIRES / FEAR YOU | ANCHOR | the slope |
// | H.02  | Think about who they are            | who they are                                                | the slope flattens into THE GROUND LINE; a lantern row stays far left; a lit glass room rises out of the line: THE PEOPLE BUILDING AI | MIX | the glass room |
// | H.03  | They see this technology            | they see it up close, before the rest of us                 | the AI disc rises in front of the glass: UP CLOSE; pull back: a dashed distance line to the lanterns: THE REST OF US | EXPL | the beam |
// | H.04  | The same technology                 | your job, your daily life, your children's world            | the disc's beam runs left over you; a desk, a kitchen table, a child rise out of the line on the words | MIX | the line |
// | H.05  | And some of them have built         | some of them built a place to hide                          | the scenes sink; one silhouette leaves the glass room and walks to the hatch; the lid lifts a crack | MIX | the hatch |
// | H.06  | Underground                         | underground                                                 | the ground is cut open, the view tilts down: shaft, ladder, a room; the walker climbs down: UNDERGROUND | EXPL | the shaft |
// | H.07  | Behind a door filled                | behind a door filled with concrete                          | a thick slab slides across the shaft, stipple of concrete: A DOOR FILLED WITH CONCRETE | EXPL | the door |
// | H.08  | A door that only opens              | a door that only opens for a few                            | it opens for three small gold figures and shuts; the cut closes, the line lifts back into the slope: the valley, the tiny hatch against the crowd | ANCHOR | the sky |
// | H.09  | So what are they hiding from        | what are they hiding from?                                  | the view tilts up into the sky; THE LIST rises on its own plane: four empty numbered rows | EXPL | the list |
// | H.10  | One of them said it out loud        | one of them said it out loud                                | the list folds down into a lit board; the view comes down: a room of seated researchers, one standing | MIX | the board |
// | H.11  | OpenAI's chief scientist            | OpenAI's chief scientist (then), a room of new researchers  | tags: OPENAI'S CHIEF SCIENTIST (THEN) · A ROOM OF NEW RESEARCHERS · SUMMER 2023 | MIX | the board |
// | H.12★ | We're definitely going              | the quote                                                   | the board grows into the quote card (Sutskever, via Karen Hao); words light as spoken | EXPL | the word AGI |
// | H.13  | A.G.I. A machine                    | AGI = a machine as smart as us                              | AGI lifts off the card: ARTIFICIAL GENERAL INTELLIGENCE → a cool disc beside you, the same height | EXPL | the disc |
// | H.14  | So the answer seems obvious         | they're afraid of the machine                               | the list rises again; the disc flies into row 2 and writes THE MACHINE | EXPL | row 2 |
// | H.15  | But no door stops                   | no door stops it, and they know it                          | beside the list a small bunker in section, door shut; the disc's calm light grows round all of it: NO DOOR STOPS IT | EXPL | the list |
// | H.16  | They're building bunkers for a reason | a reason, maybe not the machine                           | the disc leaves; the list takes the centre: row 4 is blacked out (the reason), row 2 gets a ? → plateList | EXPL | plateList |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f72_kit.mjs';
import * as S from '../lib/f72_world.mjs';
import * as X from '../lib/f72_stage.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, expoIn, halo } = E;
const { GOLD, COOL, CREAM, PAPER, SOURCES: SRC } = F;
const PR = F.PRINT72, LY = X.LINE_Y, TAU = Math.PI * 2;
const quad = (a, c, b, u) => [(1 - u) ** 2 * a[0] + 2 * u * (1 - u) * c[0] + u * u * b[0], (1 - u) ** 2 * a[1] + 2 * u * (1 - u) * c[1] + u * u * b[1]];
const L2 = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

// stage places (sheet units)
const HX = S.HATCH_S.x;                                    // the hatch on the line (1590)
const GR = { x: 1760, w: 300, h: 190 };                    // the glass room
const DISC0 = [1800, 392], DR = 46;                        // the disc in front of the glass
const YOU = 1300;                                          // you on the line
const VIG = [['desk', 560], ['table', 850], ['child', 1160]];
const CUT = { x0: 1380, x1: 2080, depth: 440 };
const BK = { depth: 170, room: { x0: 1540, x1: 1980, h: 150 } };
const BOARD = { x: 760, w: 520, h: 290, b: LY - 44 };      // the researchers' board (room part, after the sky)
const SMART = { you: 1170, disc: 1340, h: 190 };           // AGI: you and the disc, the same height
const SKY_Y = -470, HORIZON_OUT = 270;                    // the top of the tilt; sheet y the view's bottom edge must be above (ridges ≈ 510, the open hatch lid reaches higher)
const BUNK2 = { x: 1460, cut: { x0: 1300, x1: 1820, depth: 380 }, room: { x0: 1410, x1: 1760, h: 120 }, depth: 120 };

export default async (T, R) => {
  const G = (p, n = 0, after) => T.G(p, n, after);
  const A = {
    people: G('The people building artificial'), bunkers: G('are building bunkers'), think: G('Think about who'), see: G('They see this technology'),
    close: G('up close'), before: G('before the rest'), us: G('of us'), same: G('The same technology'), job: G('your job'), life: G('daily life'),
    kids: G('your children'), some: G('And some of them'), hide: G('place to hide'), und: G('Underground'), behind: G('Behind a door'),
    concrete: G('with concrete'), door2: G('A door that only'), few: G('for a few'), so: G('So what are they'), hiding: G('hiding from'),
    one: G('One of them said'), loud: G('out loud'), chief: G("OpenAI's chief"), room: G('a room of new'), res: G('new researchers'),
    quote: G("We're definitely"), agi: G('A.G.I. A machine'), mach: G('A machine as smart'), smart: G('as smart as'), obvious: G('So the answer'),
    afraid: G("They're afraid"), mach2: G('the machine', 0, G("They're afraid")), nodoor: G('But no door'), smarter: G('smarter than you'),
    know: G('And they know'), reason: G("They're building bunkers"), reasonW: G('a reason'), not: G('might not be'), end: R.b,
  };
  const tP = A.end - S.SEAM_HALF;
  const lab = (t, a, b) => span(t, a, a + .7) * (1 - span(t, b - .45, b + .1));

  // ---------------------------------------------------------------- the view (sheet units), one path for the whole take
  const VD = [   // calm: pans ≥ 2 s, zooms ≤ ×1.25, the tilt to the sky and back each ≥ 2 s (mafd budget)
    [0, { x: 960, y: 540, s: 1 }], [A.think - .1, { x: 1000, y: 548, s: 1.035 }], [A.see + 1.4, { x: 1390, y: 500, s: .94 }],
    [A.before + .1, { x: 1380, y: 496, s: .93 }], [A.same + .4, { x: 920, y: 472, s: .7 }],
    [A.job + .3, { x: 930, y: 472, s: .84 }], [A.kids + .8, { x: 990, y: 480, s: .92 }], [A.some + 1.2, { x: 1420, y: 540, s: 1.0 }],
    [A.und + .9, { x: 1620, y: 672, s: 1.04 }], [A.door2 + .2, { x: 1615, y: 662, s: 1.12 }], [A.few + .3, { x: 1600, y: 640, s: 1.0 }], [A.so + .2, { x: 1330, y: 605, s: .82 }],
    [A.one - .1, { x: 1120, y: SKY_Y, s: .8 }], [A.chief + .4, { x: 975, y: 440, s: 1.03 }], [A.quote - .2, { x: 960, y: 420, s: 1.02 }], [A.agi - .2, { x: 960, y: 410, s: 1.06 }],
    [A.mach + .6, { x: 1210, y: 440, s: 1.0 }], [A.obvious + .3, { x: 1150, y: 480, s: 1.0 }], [A.nodoor + .2, { x: 1150, y: 520, s: 1.0 }],
    [A.know + .4, { x: 1160, y: 540, s: 1.03 }], [A.reason + .4, { x: 1080, y: 500, s: 1.01 }], [tP, S.PLIST.view],
  ];
  const view = (t) => { const v = X.viewPath(t, VD), b = S.breathe(t); return { x: v.x + b.dx, y: v.y + b.dy, s: v.s }; };
  // from here the valley is out of frame (the room part begins): the first moment of the tilt when the horizon has left the bottom edge
  let tSky = A.one - .1; for (let q = A.so; q < A.one - .1; q += 1 / 60) { const w = view(q); if (w.y + 540 / w.s < HORIZON_OUT) { tSky = q; break; } }
  // the ground's pool of light (sheet): the hatch → the glass → your life → the hatch → the sky (the list) → the board → the plate
  const PK = [[0, [1450, 700, .8]], [A.think + 1.5, [1700, 450, .8]], [A.same, [900, 520, .85]], [A.some + 1, [1600, 520, .8]], [A.so, [1300, 640, .8]],
    [A.one - .1, [1120, SKY_Y + 200, .9]], [A.chief, [800, 420, .9]], [A.quote, [960, 330, .95]], [A.obvious, [900, 300, .85]], [A.reason + .5, [S.PLIST_POOL.lx, S.PLIST_POOL.ly, S.PLIST_POOL.pool]], [tP, [S.PLIST_POOL.lx, S.PLIST_POOL.ly, S.PLIST_POOL.pool]]];
  const pool = (t) => { let i = 0; while (i < PK.length - 2 && t > PK[i + 1][0]) i++; const [t0, a] = PK[i], [t1, b] = PK[i + 1], u = sineIO(span(t, t0, t1)); return a.map((x, j) => lerp(x, b[j], u)); };

  // ---------------------------------------------------------------- states over time (valley part)
  const flat = (t) => span(t, A.think - .1, A.think + 1.9) * (1 - span(t, A.few + .45, A.so + .5));
  const lidOpen = (t) => { const f = flat(t); return lerp(.8, 0, sineIO(span(f, 0, .7))) + .26 * sineIO(span(t, A.hide - .25, A.hide + .5)) * (1 - span(t, A.und + 1.2, A.und + 1.8)) + .3 * sineIO(span(t, A.door2, A.door2 + .5)) * (1 - span(t, A.few + .1, A.few + .5)); };
  const cutU = (t) => span(t, A.und - .15, A.und + .75) * (1 - span(t, A.few + .1, A.few + .7));
  const door = (t) => span(t, A.behind + .3, A.concrete + .25) * (1 - span(t, A.door2 + .25, A.door2 + .8)) + span(t, A.few + .15, A.few + .7);
  const room = (t) => span(t, A.think + 1.0, A.think + 1.9) * (1 - span(t, A.behind, A.door2));
  const discV = (t) => {   // the disc in the valley part (sheet): rises in front of the glass, sinks back with the room
    const up = expoOut(span(t, A.see - .1, A.see + .9)), down = sineIO(span(t, A.behind, A.door2));
    return { x: DISC0[0], y: lerp(LY + 30, DISC0[1], up) + down * 260, u: up * (1 - down), think: .6 + .8 * span(t, A.same, A.same + .5) * (1 - span(t, A.kids + 1, A.some)) };
  };
  const BEAM = [[A.same - .1, YOU - 20], [A.job - .3, VIG[0][1]], [A.life - .3, VIG[1][1]], [A.kids - .3, VIG[2][1] + 20], [A.kids + 1.2, VIG[2][1] + 20]];
  const beamX = (t) => { let i = 0; while (i < BEAM.length - 2 && t > BEAM[i + 1][0]) i++; const [t0, a] = BEAM[i], [t1, b] = BEAM[i + 1]; return lerp(a, b, quartIO(span(t, t0, t0 + Math.min(.8, t1 - t0)))); };
  const beamU = (t) => span(t, A.same - .2, A.same + .4) * (1 - span(t, A.kids + 1.0, A.some + .2));
  const vigU = (t, i) => span(t, [A.job, A.life, A.kids][i] - .35, [A.job, A.life, A.kids][i] + .45) * (1 - span(t, A.some + .1 + i * .08, A.some + .9 + i * .08));
  // the walker: leaves the glass room, walks to the hatch, climbs down the shaft
  const walker = (t) => {
    const w = span(t, A.some + .15, A.hide - .25), d = span(t, A.und - .1, A.und + 1.25);
    if (t < A.some + .15) return null;
    const x = lerp(GR.x + 20, HX + 4, sineIO(w)), y = LY + quartIO(d) * (BK.depth + BK.room.h);
    return { x: d > 0 ? lerp(x, HX + 4, d) : x, y, walk: w > 0 && w < 1 ? t * 5.6 : undefined, a: 1 - span(t, A.door2 - .2, A.door2 + .3), down: d };
  };
  const FEW = [0, .28, .56].map((dt) => (t) => { const d = span(t, A.door2 + .55 + dt, A.few + .1 + dt); return d <= 0 ? null : { x: HX - 6 + dt * 30, y: LY + quartIO(d) * (BK.depth + BK.room.h) - (1 - d) * 4, d }; });

  function under(ctx, t, s) {   // the bunker in the cut (H.06 → H.08)
    const cu = cutU(t); if (cu <= 0) return;
    ctx.save(); ctx.beginPath(); ctx.rect(CUT.x0, LY, CUT.x1 - CUT.x0, CUT.depth * sineIO(cu)); ctx.clip();
    const people = [];
    const wk = walker(t); if (wk && wk.down > 0 && wk.down >= 1) people.push({ x: lerp(HX + 4, 1700, span(t, A.und + 1.3, A.behind + 1.4)), h: 104, dir: 1, a: wk.a, walk: span(t, A.und + 1.3, A.behind + 1.4) < 1 && t > A.und + 1.3 ? t * 5.6 : undefined });
    F.bunker(ctx, t, HX, LY, { s, draw: span(cu, .1, .8), fill: span(cu, .3, 1), depth: BK.depth, room: BK.room, light: .35 + .65 * span(t, A.und + .3, A.und + 1.2), door: door(t), people });
    if (wk && wk.down > 0 && wk.down < 1) { ctx.save(); ctx.beginPath(); ctx.rect(HX - 40, LY, 80, BK.depth + BK.room.h); ctx.clip(); F.person(ctx, wk.x, wk.y, 104, { pose: 'reach', dir: 1, light: -1, rim: GOLD.line }); ctx.restore(); }
    for (const f of FEW) { const q = f(t); if (!q) continue; ctx.save(); ctx.beginPath(); ctx.rect(HX - 40, LY - 120, 80, BK.depth + BK.room.h + 120); ctx.clip();
      halo(ctx, q.x, q.y - 40, 70, .35, GOLD.halo, GOLD.core); F.person(ctx, q.x, q.y, 78, { pose: 'reach', dir: 1, light: -1, rim: GOLD.line }); ctx.restore(); }
    ctx.restore();
  }
  function over(ctx, t, s) {   // stage objects on the line (H.02 → H.07)
    const r = room(t);
    if (r > 0) { F.glassRoom(ctx, t, GR.x, LY, GR.w, GR.h, { u: r, s, leave: span(t, A.some, A.some + .3) });
      X.label(ctx, SRC.peopleAI, GR.x + GR.w / 2, LY + 46, lab(t, A.think + 1.4, A.same + 1.0), { size: 24 }); }
    const d = discV(t);
    if (d.u > 0) {
      const bu = beamU(t); if (bu > 0) F.beam(ctx, d.x, d.y, beamX(t), LY - 70, bu, { s, w: 54 });
      F.aiDisc(ctx, t, d.x, d.y, DR, { u: d.u, think: d.think, s });
      // UP CLOSE: a small bracket between the disc and the glass (only a hand's breadth)
      const uc = lab(t, A.close - .1, A.before + .2);
      if (uc > 0) { X.drawPath(ctx, [[d.x + DR + 8, d.y - 34], [d.x + DR + 14, d.y - 40], [GR.x + 46, d.y - 40], [GR.x + 52, d.y - 34]], uc, { col: rgba(CREAM, .85), w: 2 / s });
        X.label(ctx, SRC.upClose, (d.x + GR.x) / 2 + 32, d.y - 58, uc, { size: 22 }); }
      // THE REST OF US: a long dashed distance line to the lantern row far left
      const ru = span(t, A.before - .1, A.us + .3) * (1 - span(t, A.same + .6, A.job));
      if (ru > 0) { X.drawPath(ctx, [[d.x - DR - 10, d.y + 10], [S.ROW_S.x1 + 30, LY - 70]], sineIO(ru), { col: rgba(CREAM, .7), w: 2.2 / s, dash: [14 / s, 10 / s] });
        X.label(ctx, SRC.restOfUs, (S.ROW_S.x0 + S.ROW_S.x1) / 2, LY + 66 / Math.max(.6, s), lab(t, A.same, A.job + .2), { size: 26 / s }); }
    }
    VIG.forEach(([k, x], i) => { const u = vigU(t, i); if (u > 0) F.vignette(ctx, t, k, x, LY, 150, { u, beam: Math.max(0, 1 - Math.abs(beamX(t) - x) / 160) * beamU(t), label: lab(t, [A.job, A.life, A.kids][i] - .1, A.some + .5), text: SRC.vignettes[i], size: 24 / s }); });
    // the walker on the line (before the shaft)
    const wk = walker(t); if (wk && wk.down <= 0) F.person(ctx, wk.x, wk.y, 104, { pose: 'stand', dir: -1, walk: wk.walk, light: -1, rim: COOL.line });
    for (const f of FEW) { const q = f(t); if (q && q.d < .12) { halo(ctx, q.x, LY - 40, 70, .4, GOLD.halo, GOLD.core); F.person(ctx, q.x + (1 - q.d / .12) * 60, LY, 78, { pose: 'stand', dir: -1, light: -1, rim: GOLD.line }); } }
    // labels of the section
    X.label(ctx, SRC.underground, CUT.x0 - 30, LY + 140, lab(t, A.und - .05, A.behind + .3), { size: 30, align: 'right', spacing: .16 });
    X.label(ctx, SRC.concreteDoor, HX - 70, LY + 74, lab(t, A.concrete - .3, A.door2 + .1), { size: 26, align: 'right' });
    X.label(ctx, SRC.onlyFew, CUT.x0 - 30, LY + 70, lab(t, A.few - .3, A.so - .2), { size: 26, align: 'right', gold: .7 });
  }
  function valley(ctx, t, v) {
    const f = flat(t), [lx, ly, pl] = pool(t), wk = walker(t);
    S.valleyWorld(ctx, t, v, {
      flat: f, open: lidOpen(t), lx, ly, pool: pl, lock: sineIO(span(t, A.so - .1, A.hiding)),
      you: { x: lerp(S.YOU_L.x, YOU, sineIO(f)), y: lerp(S.YOU_L.y, LY, sineIO(f)), h: lerp(S.YOU_L.h, 104, sineIO(f)), dir: t > A.some + .2 && t < A.so ? 1 : -1, pose: 'look' },
      cut: f >= 1 && cutU(t) > 0 ? { ...CUT, u: cutU(t) } : null,
      under: (c, s) => under(c, t, s), over: (c, s) => over(c, t, s),
    });
    F.title(ctx, t, 1, {   // frame 0 = the thumbnail (title already there)
      out: span(t, A.think - .7, A.think + .35) });
  }

  // ---------------------------------------------------------------- the room part (after the sky): the board, the researchers, AGI, the bunker
  const boardU = (t) => span(t, A.one + 1.2, A.one + 2.0);
  const boardOut = (t) => span(t, A.quote - .8, A.quote + .3);
  const seatsU = (t) => span(t, A.one + 1.4, A.one + 2.4) * (1 - span(t, A.quote + .6, A.quote + 1.6));
  function seated(ctx, x, y, h, a) {   // a researcher from behind, seated: chair back + shoulders + head
    ctx.save(); ctx.globalAlpha *= a; const ink = mixHex(P.night1, P.ind2, .55);
    ctx.fillStyle = rgba(mixHex(P.blue1, CREAM, .2), .4); ctx.beginPath(); ctx.ellipse(x, y - h * .9, h * .1, h * .11, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = ink; ctx.beginPath(); ctx.moveTo(x - h * .24, y - h * .22); ctx.quadraticCurveTo(x - h * .24, y - h * .7, x, y - h * .72); ctx.quadraticCurveTo(x + h * .24, y - h * .7, x + h * .24, y - h * .22); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x, y - h * .88, h * .1, h * .11, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = mixHex(P.night0, CONCRETE_DEEP, .4); ctx.beginPath(); ctx.roundRect(x - h * .28, y - h * .42, h * .56, h * .42, h * .04); ctx.fill();
    ctx.restore();
  }
  function roomPart(ctx, t, v) {
    const [lx, ly, pl] = pool(t);
    const bunk = span(t, A.nodoor - .1, A.nodoor + .8) * (1 - span(t, A.reason + .3, A.reason + 1.4));
    X.ground(ctx, t, v, { lx, ly, pool: pl, cut: bunk > 0 ? { ...BUNK2.cut, u: bunk } : null });
    X.inView(ctx, v, (s) => {
      // the board (a lit panel on two legs), unfolding upward from its bottom edge
      const bu = boardU(t), bo = boardOut(t);
      if (bu > 0 && bo < 1) {
        const k = expoOut(bu), h = BOARD.h * k, x0 = BOARD.x - BOARD.w / 2;
        ctx.save(); ctx.globalAlpha *= 1 - span(bo, .5, 1);
        ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 3 / s; ctx.beginPath(); ctx.moveTo(x0 + 40, BOARD.b); ctx.lineTo(x0 + 40, LY); ctx.moveTo(x0 + BOARD.w - 40, BOARD.b); ctx.lineTo(x0 + BOARD.w - 40, LY); ctx.stroke();
        halo(ctx, BOARD.x, BOARD.b - h / 2, BOARD.w * .8, .3 * bu, LAMP_BODY, P.cream);
        ctx.fillStyle = F.lin(ctx, 0, BOARD.b - h, 0, BOARD.b, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(x0, BOARD.b - h, BOARD.w, h);
        ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2 / s; ctx.strokeRect(x0, BOARD.b - h, BOARD.w, h);
        // the board fills while they listen: three lines of notes, a rising curve that ends in a small disc (the thing they are building)
        const wr = span(t, A.one + .6, A.quote - .4) * k, ink = rgba(PAPER.ink, .5), y0 = BOARD.b - h;
        if (wr > 0 && h > 120) {
          ctx.strokeStyle = ink; ctx.lineWidth = 3; ctx.lineCap = 'round';
          for (let i = 0; i < 3; i++) { const u = span(wr, i * .12, .3 + i * .12); if (u <= 0) continue; ctx.beginPath(); ctx.moveTo(x0 + 36, y0 + 52 + i * 34); ctx.lineTo(x0 + 36 + u * (150 - i * 34), y0 + 52 + i * 34); ctx.stroke(); }
          const cu = span(wr, .3, .95), N = 28; ctx.beginPath();
          for (let j = 0; j <= N * cu; j++) { const q = j / N, px = x0 + 250 + q * 220, py = BOARD.b - 40 - (Math.pow(q, 2.4) * 170); j ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
          ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x0 + 250, BOARD.b - 40); ctx.lineTo(x0 + 480, BOARD.b - 40); ctx.globalAlpha *= .6; ctx.stroke(); ctx.globalAlpha /= .6;
          const du = span(wr, .9, 1); if (du > 0) { ctx.fillStyle = rgba(COOL.deep, .85 * du); ctx.beginPath(); ctx.arc(x0 + 470, BOARD.b - 210, 11 * expoOut(du), 0, TAU); ctx.fill(); }
        }
        ctx.restore();
      }
      // the researchers (backs, seated, two rows) and the one standing at the board
      const su = seatsU(t);
      if (su > 0) { for (let i = 0; i < 7; i++) seated(ctx, 520 + i * 82 + (i % 2) * 8, LY, 96, span(su, i * .05, .5 + i * .05));
        for (let i = 0; i < 6; i++) seated(ctx, 560 + i * 90, LY + 2, 112, span(su, .2 + i * .05, .7 + i * .05));
        ctx.save(); ctx.globalAlpha *= span(su, .3, .9); F.person(ctx, BOARD.x + BOARD.w / 2 + 60, LY, 150, { pose: 'point', dir: -1, light: 1 }); ctx.restore(); }
      // H.13: you and the disc, the same height (AGI = as smart as us)
      const sm = span(t, A.mach - .1, A.mach + .7) * (1 - span(t, A.obvious, A.obvious + .8));
      if (sm > 0) { ctx.save(); ctx.globalAlpha *= sm; F.du(ctx, SMART.you, LY, SMART.h, { pose: 'look', dir: 1 }); ctx.restore();
        const hu = span(t, A.smart - .2, A.smart + .6) * (1 - span(t, A.obvious, A.obvious + .6));
        if (hu > 0) { const xx = (SMART.you + SMART.disc) / 2 + 10;
          X.drawPath(ctx, [[SMART.you - 30, LY - SMART.h], [SMART.disc + SMART.h / 2 + 30, LY - SMART.h]], hu, { col: rgba(CREAM, .6), w: 1.6 / s, dash: [8 / s, 6 / s] });
          X.label(ctx, SRC.asSmart, xx, LY + 52, hu, { size: 26 }); } }
      // H.15: a small bunker in section under the line (door shut)
      if (bunk > 0) { ctx.save(); ctx.beginPath(); ctx.rect(BUNK2.cut.x0, LY - 200, BUNK2.cut.x1 - BUNK2.cut.x0, 200 + BUNK2.cut.depth * sineIO(bunk)); ctx.clip();
        F.hatch(ctx, t, BUNK2.x, LY, 150, { tilt: .075, open: 0, glow: .3, s, a: bunk });
        F.bunker(ctx, t, BUNK2.x, LY, { s, draw: span(bunk, .1, .8), fill: span(bunk, .3, 1), depth: BUNK2.depth, room: BUNK2.room, door: 1, light: .5, a: 1 });
        ctx.restore(); }
    });
  }

  // ---------------------------------------------------------------- the screen-space parts: THE LIST, the quote card, AGI, the disc
  const listState = (t, v) => {   // { x, y, s, fold, u, rows } in SCREEN px
    const ru = span(t, A.so + .3, A.hiding + .7), fold = span(t, A.one + 1.6, A.chief + .3);
    const back = span(t, A.obvious - .5, A.obvious + .9), mid = sineIO(span(t, A.know - .2, A.reasonW + .9));
    const plate = X.toScreen(v, S.PLIST.x, S.PLIST.y), ps = S.PLIST.s * v.s;
    let x, y, s, u = 1, f = 0;
    if (t < A.obvious - .5) {   // H.09–H.10: rises in the sky on its own plane, then folds down onto the board
      const bd = X.toScreen(v, BOARD.x, BOARD.b);
      x = lerp(960, bd[0], sineIO(fold)); y = lerp(lerp(1300, 450, expoOut(ru)), bd[1] - 40, sineIO(fold)); s = lerp(.72, .62, fold); u = ru > 0 ? 1 : 0; f = fold;
      if (fold >= 1) return null;
    } else { x = lerp(640, plate[0], mid); y = lerp(lerp(1350, 410, sineIO(back)), plate[1], mid); s = lerp(.68, ps, mid); }
    const w2 = span(t, A.afraid + .2, A.mach2 + .5);
    const rows = [
      { num: .3, write: 0 },
      { num: lerp(.3, 1, span(t, A.afraid, A.afraid + .4)), write: w2, lit: span(t, A.mach2, A.mach2 + .4) * (1 - span(t, A.not - .1, A.not + .5)), q: span(t, A.not - .1, A.not + .5) },
      { num: .3, write: 0 },
      { num: lerp(.3, 1, span(t, A.reasonW - .2, A.reasonW + .3)), redact: span(t, A.reasonW - .15, A.reasonW + .5) },
    ];
    return { x, y, s, u, fold: f, rows, w2 };
  };
  const CARD = { w: 1180, y: 210 };
  function screenParts(ctx, t, v) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    // H.12 ★ the quote card, grown out of the board
    const cu = span(t, A.quote - .5, A.quote + .45), cout = span(t, A.agi - .5, A.agi + 1.0);
    if (cu > 0 && cout < 1) {   // exit: the card folds down onto its bottom edge (1.5 s), AGI rises from that edge
      const fy = CARD.y + 300, k = 1 - sineIO(cout);
      ctx.save(); ctx.translate(0, fy); ctx.scale(1, Math.max(.001, k)); ctx.translate(0, -fy); ctx.globalAlpha *= 1 - span(cout, .8, 1);
      const bd = [X.toScreen(v, BOARD.x - BOARD.w / 2, BOARD.b - BOARD.h), X.toScreen(v, BOARD.x + BOARD.w / 2, BOARD.b)];
      const g = sineIO(span(t, A.quote - .8, A.quote + .3)), cx0 = lerp(bd[0][0], (W - CARD.w) / 2, g), cy0 = lerp(bd[0][1], CARD.y, g);
      if (g < 1) { ctx.fillStyle = rgba(PAPER.lit, 1 - span(cu, .4, 1)); ctx.fillRect(cx0, cy0, lerp(bd[1][0] - bd[0][0], CARD.w, g), lerp(bd[1][1] - bd[0][1], 300, g)); }
      F.quoteCard(ctx, t, T, { text: SRC.sutskever.text, credit: SRC.sutskever.credit, u: cu, w: CARD.w, y: CARD.y, size: 58, spoken: ["We're definitely", 'release A.G.I.'] });
      ctx.restore();
    }
    if (t > A.quote && t < A.agi + 1) F.source(ctx, t, A.quote + .4, A.agi + .4, SRC.sutskever.src);
    // H.11 tags over the room
    const tg = [[SRC.sutskeverTags[0], BOARD.x + BOARD.w / 2 + 170, LY - 200, A.chief - .1], [SRC.sutskeverTags[1], 720, LY + 56, A.room - .1], [SRC.sutskeverTags[2], BOARD.x, BOARD.b - BOARD.h - 40, A.res]];
    for (const [txt, x, y, t0] of tg) { const [sx, sy] = X.toScreen(v, x, y); X.dateTag(ctx, txt, sx, sy, lab(t, t0, A.quote - .2), { gold: txt === SRC.sutskeverTags[2] }); }
    // H.13 AGI lifts off the card and unfolds
    const ag = span(t, A.agi - .1, A.agi + .5), agOut = span(t, A.smart - .1, A.smart + .6);
    if (ag > 0 && agOut < 1) { const y = lerp(470, 300, expoOut(ag)) - agOut * 60;
      ctx.save(); ctx.globalAlpha *= 1 - agOut; X.big(ctx, SRC.agi, 960, y, 210, F.rise(ag), { gold: .15 });
      X.label(ctx, SRC.agiLong, 960, y + 70, span(t, A.agi + .35, A.agi + 1.1), { size: 30, spacing: .14, col: COOL.text }); ctx.restore(); }
    // THE LIST (H.09 → H.16)
    const L = listState(t, v);
    if (L) F.list(ctx, t, L.x, L.y, { s: L.s, u: L.u, fold: L.fold, rows: L.rows });
    // the disc after the sky (H.13 → H.16), in screen px
    const dd = discRoom(t, v, L);
    if (dd && dd.u > 0) {
      if (dd.reach > 0) { halo(ctx, dd.x, dd.y + 60, 120 + 640 * expoOut(dd.reach), .32 * dd.reach, COOL.halo, COOL.core); halo(ctx, dd.x, dd.y + 200, 80 + 420 * expoOut(dd.reach), .18 * dd.reach, COOL.halo, COOL.core); }
      F.aiDisc(ctx, t, dd.x, dd.y, dd.r, { u: dd.u, think: dd.think, a: dd.a });
    }
    const nd = lab(t, A.smarter - .3, A.reason + .2);
    if (nd > 0) { const [sx, sy] = X.toScreen(v, BUNK2.x + 130, LY - 230); X.label(ctx, SRC.noDoor, sx, sy, nd, { size: 34, spacing: .14, col: COOL.text }); }
    ctx.restore();
  }
  function discRoom(t, v, L) {
    if (t < A.mach - .1) return null;
    const born = expoOut(span(t, A.mach - .05, A.mach + .7));
    const p0 = X.toScreen(v, SMART.disc + SMART.h / 2, LY - SMART.h / 2), r0 = SMART.h / 2 * v.s;
    // writes row 2: the disc shrinks and travels along the row while the name writes
    const fl = span(t, A.afraid - .5, A.afraid + .2), w2 = L ? L.w2 : 1;
    let x = p0[0], y = p0[1], r = r0 * born;
    if (fl > 0 && L) { const ry = L.y + (-(LIST_H() / 2) + F.LIST.head + F.LIST.row * 1 + F.LIST.row * .66 - 18) * L.s, rx0 = L.x + (-F.LIST.w / 2 + F.LIST.pad + 86) * L.s, rx1 = rx0 + 420 * L.s;
      const tx = lerp(rx0, rx1, sineIO(w2)), q = quartIO(fl); x = lerp(x, tx, q); y = lerp(y, ry - 6, q) - Math.sin(Math.PI * q) * 140; r = lerp(r, 22, q);
      // parks right of the list, then flies to the bunker and lets its light grow round it
      const pk = span(t, A.mach2 + .6, A.mach2 + 1.1), tb = span(t, A.nodoor + .2, A.nodoor + 1.1);
      const park = [L.x + F.LIST.w / 2 * L.s + 70, ry - 6], bunker = X.toScreen(v, BUNK2.x + 60, LY - 170);
      if (pk > 0) { const p = L2([x, y], park, sineIO(pk)); x = p[0]; y = p[1]; r = lerp(r, 30, pk); }
      if (tb > 0) { const p = quad([x, y], [lerp(x, bunker[0], .5), Math.min(y, bunker[1]) - 120], bunker, quartIO(tb)); x = p[0]; y = p[1]; r = lerp(r, 40 * v.s, tb); }
      const lv = span(t, A.not - 1.0, A.not + .9); if (lv > 0) { x += sineIO(lv) * 760; y -= sineIO(lv) * 220; } }
    const reach = span(t, A.stops ?? A.nodoor + .9, A.smarter + .9) * (1 - span(t, A.reason - .2, A.reason + .7));
    return { x, y, r, u: born * (1 - span(t, A.not + .2, A.not + .7)), reach, think: .6 + span(t, A.nodoor, A.know) };
  }
  const LIST_H = () => F.LIST.head + F.LIST.row * 4 + 36;
  A.stops = G('door stops');

  // ---------------------------------------------------------------- the take
  function hook(ctx, t) {
    const v = view(t);
    if (t < tSky) valley(ctx, t, v); else roomPart(ctx, t, v);
    screenParts(ctx, t, v);
  }
  const draw = (ctx, t) => hook(ctx, t);
  const marks = [0, A.think, A.see, A.same, A.some, A.und, A.behind, A.door2, A.so, A.one, A.chief, A.quote, A.agi, A.obvious, A.nodoor, A.reason];
  return [...marks.map((t) => ({ t, draw, print: PR })), { t: tP, draw: (ctx, t) => S.plateList(ctx, t, T), print: PR }];
};
const CONCRETE_DEEP = F.CONCRETE.deep, LAMP_BODY = F.LAMP.body;
