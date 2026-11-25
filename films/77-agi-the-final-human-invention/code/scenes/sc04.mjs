// c04 + c05 · B1 · line 1 ENERGY: your bill · IMAGINE · the test · water + electricity → hydrogen · the catalyst · the Lila line 2,942 ·
// palladium · company report, not yet confirmed │ c05: the ring over the line (FORECAST) · × 1 · ★ thousands of lines, day and night ·
// your window · the bill does not shrink · NOT YET · built / approved / plugged in · human speed · mini board ENERGY BEGUN · the plate ·
// not a power plant · A MATERIAL → row 2.  'Start with the one you pay' → 'Because energy is only as good'. Plan: docs/shots.md 2.01–2.21.
// ONE draw function for both chunks (sc05.mjs imports it): the inner seam c04 → c05 is the same function of t on both sides.
// Inner seam c03 → c04: the first frame is c03's last (night, you at 250/868, the mini board); a lamp switches on beside you and its light
// opens your room around you (iris), the camera settles on you at the side table.
//
// | ID   | anchor (phrase)              | motif                                                                                   | type | carrier → next     |
// |------|------------------------------|-----------------------------------------------------------------------------------------|------|--------------------|
// | 2.01 | Start with the one you pay   | the lamp's light opens your room; the bill on the side table, your hand takes it; ENERGY pulses on the mini board | SCENE | the bill |
// | 2.02 | Energy.                      | the bill grows into a card; ENERGY flaps off the mini board onto it: EVERY MONTH, twelve equal bars | MIX | the bill  |
// | 2.03 | Imagine heat without         | a dashed radiator glows warm, the meter dial beside it stands still · IMAGINE            | MIX  | the dial           |
// | 2.04 | Has the inventing begun?     | the test stamp drops onto the ENERGY row                                                | EXPL | the row            |
// | 2.05 | Take clean hydrogen          | the card folds into its row, the row slides out of the room (camera after it): WATER + ELECTRICITY → HYDROGEN; drop + bolt into the cell, H₂ | EXPL | the cell |
// | 2.06 | It takes a catalyst          | push in: the plate lights, bubbles only where it touches: CATALYST · MAKES THE REACTION RUN | EXPL | the plate      |
// | 2.07 | In three months              | the plate joins a lab line (DESIGNED · MADE · TESTED light on their words), a counter runs to 2,942, a person carries a tray · LILA SCIENCES · 25 SEPT 2026 | MIX | the plates |
// | 2.08 | And it found new ones        | a few plates turn gold; a grey Pd tile lights: NEW PALLADIUM-BASED FAMILIES · A METAL WRITTEN OFF | EXPL | the gold plates |
// | 2.09 | That's the company's own     | a note card drops over the line: COMPANY REPORT + PREPRINT                               | EXPL | the card           |
// | 2.10 | No outside lab               | its second line: NOT YET INDEPENDENTLY CONFIRMED + an empty box                          | EXPL | the box            |
// | 2.11 | Now imagine the machine      | the card sinks, the ring forms dashed over the line · FORECAST                           | EXPL | the line           |
// | 2.12 | Not one lab like that        | corner brackets frame the one line: × 1                                                  | EXPL | the frame          |
// | 2.13 | Thousands, running day and   | ★ the line clones into thousands of dashed lines to the horizon, sun and moon swing over: × THOUSANDS · FORECAST · DAY AND NIGHT | MIX | the field → your window |
// | 2.14 | So when does your power bill | the picture pulls back out through your window: you at the side table, the bill rises, a dashed lower line; the bars do not move | SCENE | the total |
// | 2.15 | Not yet.                     | NOT YET under the bill                                                                  | MIX  | the window         |
// | 2.16 | Even a perfect invention     | back through the window, down to a road below the lab: crane, desk, pylon, one person each; a gold box travels · BUILT · APPROVED · PLUGGED IN | MIX | the road |
// | 2.17 | And that still runs          | a long, slow clock hand sweeps over the stations: HUMAN SPEED                           | MIX  | the hand           |
// | 2.18 | But on the first line        | the mini board comes forward, ENERGY flaps WAITING → BEGUN gold, the stamp gets its tick, back to the corner | EXPL | the row |
// | 2.19 | And look at what that lab    | one plate lifts out of the line and turns to camera                                     | EXPL | the plate          |
// | 2.20 | Not a power plant.           | a power-plant outline beside it is struck: NOT A POWER PLANT                            | EXPL | the plant          |
// | 2.21 | A material.                  | A MATERIAL; the plate flies into row 2 of the mini board, MATERIALS pulses; the camera tilts up off the lab | EXPL | the plant outline → c06 |
import * as F from '../lib/f77_kit.mjs';
import * as B from '../lib/b1_extra.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, rise, GOLD, CREAM, PAPER, COOL } = F;

export const PRINT = F.PRINT77;
export function anchors(T) {
  const t0 = T.G('Start with the one you pay'), G = (p, after = t0 - .3) => T.G(p, 0, after), a = { t0 };
  a.pay = G('one you pay'); a.month = G('every month'); a.energy = G('Energy', a.month);
  a.imagine = G('Imagine heat'); a.meter = G('the meter', a.imagine);
  a.has = G('Has the inventing'); a.begun = G('begun', a.has);
  a.take = G('Take clean hydrogen'); a.hyd = G('hydrogen', a.take); a.fuel = G('fuel made', a.take); a.water = G('water and', a.take); a.elec = G('electricity', a.water);
  a.cat = G('It takes a catalyst'); a.catW = G('catalyst', a.cat); a.react = G('reaction run', a.cat);
  a.three = G('In three months'); a.lab = G('a lab run', a.three); a.designed = G('designed', a.three); a.made = G('made', a.designed); a.tested = G('tested', a.made);
  a.almost = G('almost three thousand', a.three); a.thousand = G('thousand', a.almost);
  a.found = G('And it found new'); a.work = G('that work', a.found); a.metal = G('a metal experts', a.found); a.written = G('written off', a.found);
  a.company = G("That's the company"); a.noOut = G('No outside lab'); a.yet1 = G('confirmed it yet', a.noOut);
  a.now = G('Now imagine the machine'); a.jack = G('Jack Good described', a.now);
  a.notOne = G('Not one lab'); a.thousands = G('Thousands running', a.notOne); a.day = G('day and night', a.thousands);
  a.so = G('So when does your power'); a.qW = F.wordTimes(T, 'So when', 'shrink', a.so - .3); a.notYet = G('Not yet', a.so);
  a.even = G('Even a perfect'); a.built = G('built approved', a.even); a.approved = G('approved', a.built); a.plugged = G('plugged in', a.approved);
  a.human = G('And that still runs'); a.speed = G('human speed', a.human);
  a.but = G('But on the first line'); a.hasBegun = G('has begun', a.but);
  a.look = G('And look at what'); a.plant = G('Not a power plant'); a.plantW = G('plant', a.plant); a.material = G('A material', a.plant);
  a.end = G('Because energy is only');
  return a;
}
export default async (T, R) => [{ t: R.a, draw: scene(anchors(T), T), print: PRINT }];

// ------------------------------------------------------------------------------------------------ world layout (world px)
// THE ROOM: F.room mirrored (its side table on the right), a box x 0..2200; you stand at 1300 facing right, the table 1440..1660 (top 654).
const BOX = { x: 0, y: 0, w: 2200, h: 1040 };
const YOU = { x: 1300, feet: 884, h: 330 }, Y3 = { x: 250, feet: 868, h: 200 };    // you in the room / you at the end of c03 (screen)
const TABLE = { x: 1440, top: 654, w: 220 }, LAMP = { x: 1628, top: 548 };
const WIN = { x: 1150, y: 150, w: 440, h: 247.5 };                                    // your window (16:9)
const BILLC = { x: 1490, y: 280, w: 420, h: 340 };                                    // the bill, grown into a card
const BILLC2 = { x: 1625, y: 300, w: 400, h: 324 };                                   // the next month's bill (2.14), clear of your window
const RAD = { x: 690, y: 640, w: 270, h: 160 }, DIAL = { x: 1080, y: 600, r: 50 };
const CELL = { x: 2850, y: 840, s: 380 };                                             // the hydrogen cell (bottom centre, height)
const HEAD = { x: 2440, y: 96, w: 420, h: 68 };                                       // the ENERGY row docked over the explainer
const L = B.LINE, LC = (L.x0 + L.x1) / 2;
const RING = { x: LC, y: 250, r: 230 };
const HZ = -900, ROWK = 13;                                                           // the field's horizon; clone rows
const ROAD = { y: 1150, x0: 3350, x1: 5250, st: [3900, 4300, 4700] };
const PIV = { x: 4300, y: 640, len: 660 };
const FWD = { x: 690, y: 170, s: .9 };                                                // the mini board come forward (2.18)
const PLANT = { x: 1330, y: 560, s: 130 };                                            // the power-plant outline (screen; c06 takes it over)
const z0 = Y3.h / YOU.h, K0 = [YOU.x - (Y3.x - W / 2) / z0, YOU.feet - (Y3.feet - H / 2) / z0, z0];   // c03's you = the room's you
const GLOW = (t) => [960, 470, 1000, .5 + .1 * Math.sin(t * .9)];                     // c03's night glow (kept)

export function scene(a, T) {
  const t0 = a.t0;
  // ---------------------------------------------------------------- times
  const tIris0 = t0 + .05, tIris1 = t0 + 1.15;
  const tReach0 = a.pay - .25, tGrab = a.month + .02, tHold = a.month + .55;
  const tGrow0 = a.energy - .3, tGrow1 = a.energy + .45;                                // the bill grows into the card
  const tFly0 = a.energy - .12, tFly1 = a.energy + .62;                                 // ENERGY flies off the mini board onto the card
  const tStamp = a.has + .02;
  const tFold0 = a.begun + .35, tFold1 = a.begun + .9, tTrav1 = a.take + 1.2;          // the card folds into its row; the row travels
  const tPlate0 = a.three - .1, tPlate1 = a.three + 1.1;                                // the plate leaves the cell for the line
  const tCard = a.company - .05, tCardOut = a.now + .05;
  const tRing = a.now + .2, tFrame = a.notOne - .1, tClone0 = a.thousands - .1, tClone1 = a.day + .3;
  const tWin0 = a.so - 1.05, tWin1 = a.so + .75;                                         // pull out through your window (reverse portal)
  const tPush0 = a.even - .9, tPush1 = a.even + 1.7;                                   // back in through the window
  const tFwd0 = a.but - .1, tFwd1 = a.but + .65, tBack0 = a.look - .45, tBack1 = a.look + .35;
  const tLift0 = a.look + .05, tLift1 = a.look + 1.0, tToRow0 = a.material + .45, tToRow1 = a.material + 1.25;
  // ---------------------------------------------------------------- the world camera (follows the carrier)
  const K = [
    [t0, ...K0],
    [t0 + 2.0, 1410, 560, 1.1],
    [a.imagine + .2, 1360, 540, 1.1],
    [tFold0, 1375, 535, 1.12],
    [tTrav1, CELL.x, 540, 1.0],
    [a.elec + .4, CELL.x, 555, 1.03],
    [a.cat + .55, CELL.x + 10, 650, 1.45],
    [a.react + .4, CELL.x + 20, 660, 1.47],
    [a.three + 1.5, LC, 560, .62],
    [a.yet1, LC + 20, 545, .6],
    [a.now + 1.8, LC, 470, .55],
    [a.thousands, LC + 50, 520, .52],
    [a.day + .9, LC, 120, .2],
    [a.notYet - .5, LC, 135, .21],
    [a.even - .3, LC, 1000, .62],
    [a.even + 1.2, LC, 1000, .62],
    [a.speed + .8, LC, 990, .6],
    [a.look - .1, LC + 40, 900, .66],
    [a.look + 1.0, 4620, 560, .9],
    [a.material + .55, 4625, 552, .9],
    [a.end + .9, 4620, -700, .9],
  ];
  const cam = (t) => { const c = F.lookPath(t, K), f = B.seamZ(t, t0); return f === 1 ? c : { ...c, z: c.z * f }; };   // + the seam creep (c03 does the same)
  // the room's own camera while it shows your window (2.14–2.15)
  const camA = (t) => { const k = sineIO(span(t, tWin0, tPush0)); return { cx: lerp(1400, 1385, k), cy: lerp(540, 532, k), z: lerp(1.1, 1.13, k) }; };
  const nightO = (c) => ({ ox: -(c.cx - K0[0]) * .05, oy: -(c.cy - K0[1]) * .05 });
  const night = (ctx, t, c = cam(t)) => { const g = B.seamGlow(t, t0, GLOW(t)[3]), o = nightO(c); F.night(ctx, t, { glow: g.glow, ox: o.ox + g.ox, oy: o.oy + g.oy }); };

  // ---------------------------------------------------------------- you (the room's figure; c03's pose at the start)
  const youPose = (t) => {
    const r = smooth(span(t, tReach0, tGrab)), hd = smooth(span(t, tGrab + .05, tHold)), rel = smooth(span(t, tGrow0, tGrow1 + .4));
    let armR = [lerp(1.25, 1.42, r), lerp(1.75, 1.38, r)];
    armR = [lerp(armR[0], .75, hd), lerp(armR[1], 2.3, hd)];
    armR = [lerp(armR[0], .22, rel), lerp(armR[1], .34, rel)];
    const look = lerp(lerp(lerp(.95, .2, r), .55, hd), .5, rel) + .03 * Math.sin(t * .8);
    return { armR, armL: [0, .1], look };
  };
  const drawYou = (ctx, t) => { const p = youPose(t); return F.du(ctx, YOU.x, YOU.feet, YOU.h, { dir: 1, walk: Math.PI * 2, look: p.look, armR: p.armR, armL: p.armL, light: .75 }); };

  // ---------------------------------------------------------------- THE ROOM (world space)
  const lampL = (t) => expoOut(span(t, tIris0 - .03, tIris0 + .25)) * (.94 + .06 * Math.sin(t * 1.7));
  const drawRoom = (ctx, t, o = {}) => {
    ctx.save(); ctx.beginPath(); ctx.rect(BOX.x, BOX.y, BOX.w, BOX.h); ctx.clip();
    ctx.save(); ctx.translate(1920, 0); ctx.scale(-1, 1);
    F.room(ctx, t, { bulb: .32 + .03 * Math.sin(t * 1.3), amb: .26, youDx: 4200, screen: 0, phone: 0 });
    ctx.restore();
    // your window: the night outside (the portal draws the world into it in 2.14)
    ctx.fillStyle = mixHex(P.night0, P.ind0, .3); ctx.beginPath(); ctx.roundRect(WIN.x - 16, WIN.y - 16, WIN.w + 32, WIN.h + 32, 8); ctx.fill();
    if (!o.winB) {
      ctx.fillStyle = F.lin(ctx, 0, WIN.y, 0, WIN.y + WIN.h, [[0, F.NIGHT.top], [1, F.NIGHT.mid]]); ctx.fillRect(WIN.x, WIN.y, WIN.w, WIN.h);
      const r = F.prng(31); ctx.fillStyle = P.cream; for (let i = 0; i < 18; i++) { const x = WIN.x + r() * WIN.w, y = WIN.y + r() * WIN.h, ph = r() * 6; ctx.globalAlpha = .35 + .3 * Math.sin(t * .7 + ph); ctx.beginPath(); ctx.arc(x, y, 1.3, 0, 6.29); ctx.fill(); } ctx.globalAlpha = 1;
    }
    // the side table, lit by its lamp (drawn over the room's dark layer)
    const ll = lampL(t);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = F.rad(ctx, LAMP.x, LAMP.top + 40, 520, [[0, rgba(GOLD.hot, .32 * ll)], [.4, rgba(GOLD.body, .12 * ll)], [1, rgba(GOLD.body, 0)]]); ctx.fillRect(LAMP.x - 520, LAMP.top - 480, 1040, 1040);
    ctx.restore();
    ctx.fillStyle = mixHex(mixHex(P.ind2, P.blue1, .35), GOLD.shade, .35 * ll); ctx.fillRect(TABLE.x, TABLE.top, TABLE.w, 14); ctx.fillRect(TABLE.x + 18, TABLE.top, 10, YOU.feet - TABLE.top); ctx.fillRect(TABLE.x + TABLE.w - 28, TABLE.top, 10, YOU.feet - TABLE.top);
    ctx.fillStyle = rgba(GOLD.line, .5 * ll); ctx.fillRect(TABLE.x, TABLE.top, TABLE.w, 2);
    // the lamp: base, stem, a cream shade, the bulb glow under it
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .5); ctx.fillRect(LAMP.x - 22, TABLE.top - 8, 44, 8); ctx.fillRect(LAMP.x - 3, LAMP.top + 30, 6, TABLE.top - LAMP.top - 30);
    F.halo(ctx, LAMP.x, LAMP.top + 36, 90, .8 * ll, GOLD.halo, GOLD.core);
    ctx.fillStyle = mixHex(mixHex(P.blue1, P.cream, .4), GOLD.hot, .6 * ll); F.poly(ctx, [[LAMP.x - 24, LAMP.top], [LAMP.x + 24, LAMP.top], [LAMP.x + 44, LAMP.top + 40], [LAMP.x - 44, LAMP.top + 40]]); ctx.fill();
    // 2.03 IMAGINE: a dashed radiator glows warm, the meter dial beside it stands still
    const iu = span(t, a.imagine - .1, a.imagine + .8), iOut = span(t, tFold0 - .3, tFold0 + .2);
    if (iu > 0 && iOut < 1) {
      const k = 1 - expoIn(iOut), warm = smooth(span(t, a.imagine + .4, a.imagine + 1.4)) * k;
      if (warm > 0) F.halo(ctx, RAD.x + RAD.w / 2, RAD.y + RAD.h / 2, RAD.w * 1.1, .55 * warm, GOLD.halo, GOLD.core);
      F.lineIcon(ctx, 'radiator', RAD.x + RAD.w / 2, RAD.y + RAD.h / 2, RAD.w * .62, { u: smooth(iu) * k, dashed: true, t, w: 3.4, col: mixHex(CREAM, GOLD.line, warm) });
      const du = smooth(span(t, a.imagine + .3, a.imagine + 1.0)) * k;
      if (du > 0) {
        F.outline(ctx, [F.circlePts(DIAL.x, DIAL.y, DIAL.r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * du, 40)], 1, { dashed: true, t, w: 3 });
        for (let i = 0; i <= 8; i++) { const an = Math.PI * (.8 + i * .175); ctx.strokeStyle = rgba(CREAM, .7 * du); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(DIAL.x + Math.cos(an) * DIAL.r * .72, DIAL.y + Math.sin(an) * DIAL.r * .72); ctx.lineTo(DIAL.x + Math.cos(an) * DIAL.r * .86, DIAL.y + Math.sin(an) * DIAL.r * .86); ctx.stroke(); }
        // the needle: it trembles while you watch it, then it stands still (heat without watching the meter)
        const still = smooth(span(t, a.meter - .2, a.meter + .3)), an = Math.PI * 1.55 + (1 - still) * .12 * Math.sin(t * 13);
        ctx.strokeStyle = rgba(GOLD.line, du); ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(DIAL.x, DIAL.y); ctx.lineTo(DIAL.x + Math.cos(an) * DIAL.r * .7, DIAL.y + Math.sin(an) * DIAL.r * .7); ctx.stroke();
        ctx.fillStyle = rgba(CREAM, du); ctx.beginPath(); ctx.arc(DIAL.x, DIAL.y, 5, 0, 6.29); ctx.fill();
      }
      F.capsLabel(ctx, 'IMAGINE', RAD.x + RAD.w / 2 + 120, RAD.y - 58, span(t, a.imagine - .05, a.imagine + .45) * (1 - iOut), { size: 30, col: CREAM });
    }
    // the bill on the table (2.01), in your hand, then the card
    const bill2 = span(t, a.so + .1, a.so + 1.2);   // 2.14: a new month, a new bill rises off the table
    if (t < tGrab) drawBillFlat(ctx, TABLE.x + 40, TABLE.top);
    else if (t > tWin0 && bill2 < .02) drawBillFlat(ctx, TABLE.x + 40, TABLE.top);
    const hands = drawYou(ctx, t);
    if (t >= tGrab && t < tGrow0 + .02) drawBillHand(ctx, t, hands);
    drawCard(ctx, t, hands);
    ctx.restore();
    // the cutaway: ceiling and floor slabs, the side wall (the room is a box in the night, as in c01)
    ctx.fillStyle = mixHex(P.ind2, P.night0, .3); ctx.fillRect(-14, -8, BOX.w + 28, 40); ctx.fillRect(-14, BOX.h - 40, BOX.w + 28, 48); ctx.fillRect(BOX.w - 8, -8, 22, BOX.h + 8);
    ctx.fillStyle = rgba(P.blue1, .7); ctx.fillRect(-14, -8, BOX.w + 28, 2); ctx.fillRect(-14, BOX.h + 6, BOX.w + 28, 2); ctx.fillRect(BOX.w + 12, -8, 2, BOX.h + 16);
  };
  const drawBillFlat = (ctx, x, y) => {
    ctx.fillStyle = PAPER.body; F.poly(ctx, [[x, y], [x + 104, y], [x + 94, y - 10], [x + 8, y - 10]]); ctx.fill();
    ctx.fillStyle = rgba(PAPER.ink, .35); ctx.fillRect(x + 16, y - 7, 50, 2);
  };
  const billInHand = (t, hands) => {   // the bill as a small rect at your hand (it turns up as you lift it)
    const hp = hands?.R ?? [YOU.x + 150, 640], k = smooth(span(t, tGrab, tHold));
    return { x: hp[0] + 8, y: hp[1] - lerp(4, 46, k), w: lerp(104, 86, k), h: lerp(10, 112, k), rot: lerp(0, -.1, k) };
  };
  const drawBillHand = (ctx, t, hands) => {
    const b = billInHand(t, hands);
    ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.rot);
    ctx.fillStyle = F.lin(ctx, -b.w / 2, -b.h / 2, b.w / 2, b.h / 2, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(-b.w / 2, -b.h / 2, b.w, b.h, 3); ctx.fill();
    ctx.fillStyle = rgba(PAPER.ink, .4); for (let i = 0; i < 4; i++) if (b.h > 30) ctx.fillRect(-b.w / 2 + 10, -b.h / 2 + 12 + i * b.h * .18, b.w * (i === 3 ? .3 : .6), 2.5);
    ctx.restore();
  };
  // the bill card (2.02–2.04, folds into its row 2.05; 2.14–2.15 it rises again)
  const cardRect = (t, hands) => {
    if (t >= tWin0) { const k = sineIO(span(t, a.so + .1, a.so + 1.2)); return k <= 0 ? null : { x: lerp(TABLE.x + 40, BILLC2.x, k), y: lerp(TABLE.top - 110, BILLC2.y, k), w: lerp(104, BILLC2.w, k), h: lerp(110, BILLC2.h, k), rot: lerp(-.1, 0, k), k: 1 }; }
    if (t < tGrow0) return null;
    const g = quartIO(span(t, tGrow0, tGrow1)), b = billInHand(tGrow0, hands), fold = quartIO(span(t, tFold0, tFold1));
    const r = { x: lerp(b.x - b.w / 2, BILLC.x, g), y: lerp(b.y - b.h / 2, BILLC.y, g), w: lerp(b.w, BILLC.w, g), h: lerp(b.h, BILLC.h, g), rot: lerp(b.rot, 0, g), k: g };
    if (fold > 0) r.h = lerp(r.h, 92, fold);
    return r;
  };
  const rowOnCard = (t) => {   // the ENERGY row: lands on the card's top, then it is the carrier out of the room
    const tr = sineIO(span(t, tFold1 - .1, tTrav1));
    const r0 = { x: BILLC.x + 20, y: BILLC.y - 84, w: BILLC.w - 40, h: 68 };
    return { x: lerp(r0.x, HEAD.x, tr), y: lerp(r0.y, HEAD.y, tr), w: lerp(r0.w, HEAD.w, tr), h: lerp(r0.h, HEAD.h, tr), tr };
  };
  const drawCard = (ctx, t, hands) => {
    const r = cardRect(t, hands); if (!r) return;
    if (t < tWin0 && t > tFold1 + .02) return;
    const inner = t >= tWin0, fold = inner ? 0 : span(t, tFold0, tFold1);
    ctx.save(); ctx.globalAlpha *= 1 - smooth(span(fold, .7, 1));
    B.billCard(ctx, t, r.x, r.y, r.w, r.h, { u: 1, rot: r.rot, bars: inner ? 1 : span(t, a.energy + .15, a.energy + 1.2), head: r.k > .6, wish: inner ? span(t, a.qW ? a.qW[6] : a.so + .9, (a.qW ? a.qW[6] : a.so + .9) + .7) : 0, twitch: inner ? span(t, a.so + 1.2, a.so + 1.6) : 0 });
    ctx.restore();
    if (!inner && r.k > .5 && fold < .5) F.capsLabel(ctx, 'EVERY MONTH', r.x + r.w / 2, r.y + r.h + 46, span(t, a.energy + .3, a.energy + .8) * (1 - span(t, tFold0 - .2, tFold0 + .1)), { size: 30, col: CREAM });
  };
  // ENERGY: a row flying off the mini board onto the card (screen → world), then the carrier
  const drawRow = (ctx, t, c) => {
    if (t < tFly1 || t > tPlate0 + 1.0) return;
    const r = rowOnCard(t), up = expoIn(span(t, tPlate0 + .2, tPlate0 + .95));
    const stampK = expoOut(span(t, tStamp, tStamp + .5));
    ctx.save(); ctx.translate(0, -up * 900);
    F.boardRow(ctx, t, r.x, r.y, r.w, r.h, { text: 'ENERGY', from: '', flip: 1, gold: 0, lit: .5 * Math.sin(Math.PI * span(t, tFly1 - .1, tFly1 + .6)) }, { cells: 14, size: r.h * .4 });
    if (stampK > 0) F.testStamp(ctx, t, r.x + r.w * lerp(.72, .92, r.tr), r.y + r.h * .5, lerp(88, 50, r.tr), { u: stampK, rot: -.14 + .02 * Math.sin(t * .9) });
    ctx.restore();
  };

  // ---------------------------------------------------------------- 2.05–2.06 water + electricity → hydrogen; the catalyst
  const drawCell = (ctx, t) => {
    const u = span(t, a.take - .1, a.take + 1.1), out = span(t, tPlate0 + .4, tPlate1 + .3);
    const gone = expoIn(span(t, tPlate1 + .1, tPlate1 + 1.0)); if (u <= 0 || gone >= 1) return;
    ctx.save(); ctx.translate(0, gone * 1300);
    const plate = smooth(span(t, a.catW - .1, a.catW + .5)), bub = smooth(span(t, a.elec + .3, a.elec + 1.1));
    const cr = F.catalyst(ctx, t, CELL.x, CELL.y, CELL.s, { u, plate: plate * (1 - out), bubbles: bub });
    // the formula over the cell: words rise on the VO; WATER and ELECTRICITY each send their sign into the cell
    const fy = 240, fs = 62, fOut = span(t, a.cat - .2, a.cat + .4);
    const words = [['WATER', a.water, 2420, 0], ['+', a.water + .25, 2615, 0], ['ELECTRICITY', a.elec, 2850, .45], ['→', a.elec + .3, 3085, 0], ['HYDROGEN', a.hyd, 3300, 1]];
    for (const [s, ts, x, g] of words) F.maskLine(ctx, [[s, g]], x, fy, fs, rise(span(t, ts - .08, ts + .4)) * (1 - fOut), { serif: true, col: CREAM, glow: g > .5, align: 'center' });
    F.capsLabel(ctx, 'CLEAN FUEL', 3300, fy + 52, span(t, a.fuel - .05, a.fuel + .45) * (1 - fOut), { size: 26, col: CREAM });
    // the drop and the bolt travel into the cell on their words
    const dq = sineIO(span(t, a.water + .05, a.water + .85)), bq = sineIO(span(t, a.elec + .05, a.elec + .85));
    if (dq > 0 && dq < 1) F.lineIcon(ctx, 'drop', lerp(2420, CELL.x - 60, dq), lerp(fy + 60, CELL.y - CELL.s * .45, dq) - Math.sin(Math.PI * dq) * 60, 34, { w: 3, col: COOL.line });
    if (bq > 0 && bq < 1) F.lineIcon(ctx, 'bolt', lerp(2850, CELL.x - CELL.s * .62, bq), lerp(fy + 60, CELL.y - CELL.s * 1.1, bq), 34, { gold: true, w: 3 });
    F.maskLine(ctx, [['H₂', 1]], CELL.x + 130, CELL.y - CELL.s * .95, 44, rise(span(t, a.elec + .7, a.elec + 1.2)) * (1 - out), { serif: true, col: CREAM, glow: true, align: 'left' });
    // 2.06 CATALYST, a thin gold leader from the plate
    if (cr && plate > 0) {
      const px = cr.plate.x + cr.plate.w, py = cr.plate.y + cr.plate.h / 2, lu = span(t, a.catW, a.catW + .45) * (1 - out);
      F.goldSpan(ctx, [[px + 6, py], [px + 150, py - 70], [px + 200, py - 70]], 0, smooth(lu), { w: 1.6, spark: false });
      F.verdict(ctx, t, px + 212, py - 58, 'CATALYST', lu, { size: 30, align: 'left' });
      F.capsLabel(ctx, 'MAKES THE REACTION RUN', px + 212, py - 8, span(t, a.react - .3, a.react + .2) * (1 - out), { size: 22, col: CREAM, align: 'left' });
    }
    ctx.restore();
  };
  // the plate's flight from the cell onto the line (it becomes one plate among many)
  const plateFlight = (t) => { const q = span(t, tPlate0, tPlate1); if (q <= 0 || q >= 1) return null; const e = sineIO(q); return [lerp(CELL.x - 84, L.x0 + 40, e), lerp(CELL.y - CELL.s * .14, L.belt - 13, e) - Math.sin(Math.PI * e) * 160, e]; };

  // ---------------------------------------------------------------- 2.07–2.10 the lab line
  const goldIds = new Set([2, 5, 9, 13, 17, 22]);
  const isGold = (t) => (i) => (goldIds.has(((i % 24) + 24) % 24) ? smooth(span(t, a.work - .3, a.work + .5)) : 0);
  const walker = (t) => { const k = span(t, a.three + .8, a.yet1 + .8); return { x: lerp(4420, 4860, k), ph: k * 26 }; };
  const drawLab = (ctx, t, liftId) => {
    const u = span(t, a.three - .4, a.three + 1.4); if (u <= 0) return;
    const lit = [a.designed, a.made, a.tested].map((tt) => smooth(span(t, tt - .08, tt + .3)) * (.6 + .4 * (1 - span(t, a.found, a.found + 1.5))));
    // the field (2.13): the line clones into rows of dashed lines to the horizon
    drawField(ctx, t);
    B.labLine(ctx, t, { u, lit, gold: isGold(t), hide: liftId });
    // a person carries a sample tray between two machines (indigo)
    const wk = walker(t), pu = smooth(span(t, a.three + .6, a.three + 1.4));
    if (pu > 0) {
      const hd = F.person(ctx, wk.x, L.floor, 230, { dir: 1, walk: wk.ph, armR: [1.2, 1.5], armL: [1.15, 1.45], light: .4 });
      const hp = hd?.R ?? [wk.x + 60, L.floor - 140];
      ctx.fillStyle = mixHex(P.blue1, P.cream, .3); ctx.fillRect(hp[0] - 30, hp[1] - 10, 70, 8);
      for (let i = 0; i < 3; i++) { ctx.fillStyle = mixHex(P.blue1, P.cream, .45); ctx.fillRect(hp[0] - 24 + i * 22, hp[1] - 16, 16, 6); }
    }
    // the station names on their words (DESIGNED · MADE · TESTED), under the belt
    const nOut = span(t, a.found - .2, a.found + .3);
    ['DESIGNED', 'MADE', 'TESTED'].forEach((s, i) => F.capsLabel(ctx, s, L.st[i], L.floor + 64, span(t, [a.designed, a.made, a.tested][i] - .08, [a.designed, a.made, a.tested][i] + .35) * (1 - nOut), { size: 40, col: CREAM }));
    // the counter and the source line (left), the Pd tile (right)
    const cOut = span(t, tCard - .3, tCard + .1), cu = span(t, a.lab - .15, a.lab + .35) * (1 - cOut);
    if (cu > 0) {
      const n = 2942 * sineIO(span(t, a.lab, a.thousand + .35));
      F.goldText(ctx, [[B.commas(n), 1]], 3260, 430, 168, rise(cu), { serif: true });
      F.capsLabel(ctx, 'CATALYSTS IN 3 MONTHS', 3262, 500, span(t, a.three + .1, a.three + .6) * (1 - cOut), { size: 40, col: CREAM, align: 'left' });
      F.capsLabel(ctx, 'LILA SCIENCES · 25 SEPT 2026', 3262, 250, span(t, a.lab - .1, a.lab + .4) * (1 - cOut), { size: 40, col: P.halo2, align: 'left' });
    }
    drawPd(ctx, t, cOut);
  };
  const drawPd = (ctx, t, out) => {
    const u = span(t, a.metal - .15, a.metal + .35) * (1 - out); if (u <= 0) return;
    const x = 4420, y = 230, w = 210, h = 240, g = smooth(span(t, a.written + .25, a.written + .9)), e = expoOut(u);
    ctx.save(); ctx.translate(x + w / 2, y + h / 2 + (1 - e) * 40); ctx.globalAlpha *= clamp(u * 3);
    if (g > 0) F.halo(ctx, 0, 0, w * 1.1, .6 * g, GOLD.halo, GOLD.core);
    ctx.fillStyle = mixHex(mixHex(P.ind1, '#6f7389', .55), GOLD.deep, g * .8); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 12); ctx.fill();
    ctx.strokeStyle = mixHex('#9a9eb3', GOLD.line, g); ctx.lineWidth = 3; ctx.stroke();
    const col = mixHex('#a7abbf', GOLD.text, g);
    F.glowText(ctx, '46', -w / 2 + 20, -h / 2 + 46, { size: 38, col, glow: false });
    F.glowText(ctx, 'Pd', 0, 40, { size: 118, serif: true, col, align: 'center', glow: g > .5 });
    ctx.restore();
    F.capsLabel(ctx, 'PALLADIUM', x + w / 2, y + h + 56, u, { size: 36, col: mixHex('#a7abbf', CREAM, g) });
    F.capsLabel(ctx, 'NEW PALLADIUM-BASED FAMILIES', x + w + 50, y + 90, span(t, a.written + .3, a.written + .8) * (1 - out), { size: 40, col: GOLD.text, align: 'left' });
    F.capsLabel(ctx, 'A METAL WRITTEN OFF', x + w + 50, y + 160, span(t, a.written - .1, a.written + .4) * (1 - out), { size: 40, col: CREAM, align: 'left' });
  };
  // 2.09–2.10 the note card over the line
  const drawNote = (ctx, t) => {
    const u = span(t, tCard, tCard + .55), out = quartIO(span(t, tCardOut - .4, tCardOut + .55)); if (u <= 0 || out >= 1) return;
    const w = 1500, h = 330, x = LC - w / 2, y = 250 + out * 260;
    ctx.save(); ctx.translate(0, y + h / 2); ctx.scale(1, 1 - out); ctx.translate(0, -(y + h / 2));   // it folds shut along its middle
    F.paperCard(ctx, t, x, y, w, h, { u, rot: -.008 });
    const k = (1 - expoOut(u)) * 40;
    F.maskLine(ctx, [['Company report + preprint', 0]], x + 70, y + 130 + k, 84, rise(span(t, tCard + .1, tCard + .6)), { serif: true, col: PAPER.ink, glow: false });
    const l2 = span(t, a.noOut - .05, a.noOut + .5);
    F.maskLine(ctx, [['NOT YET INDEPENDENTLY CONFIRMED', 0]], x + 70, y + 250 + k, 46, rise(l2), { serif: false, weight: 700, col: PAPER.ink, glow: false });
    const bu = smooth(span(t, a.yet1 - .2, a.yet1 + .3));
    if (bu > 0) { ctx.save(); ctx.strokeStyle = rgba(PAPER.ink, .85 * bu); ctx.lineWidth = 4; ctx.setLineDash([12, 9]); ctx.lineDashOffset = -t * 12; ctx.strokeRect(x + w - 190, y + 186 + k, 84 * bu, 84 * bu); ctx.restore(); }
    ctx.restore();
  };

  // ---------------------------------------------------------------- 2.11–2.13 the ring, × 1, the field
  const drawRing = (ctx, t) => {
    const u = span(t, tRing, tRing + 1.1), out = expoIn(span(t, a.thousands - .25, a.thousands + .5)); if (u <= 0 || out >= 1) return;
    B.ringS(ctx, t, RING.x, RING.y - out * 1600, RING.r, { u, lit: .45, dashed: true });
    const lu = span(t, a.jack - .2, a.jack + .3) * (1 - span(t, a.thousands - .4, a.thousands));
    F.capsLabel(ctx, 'FORECAST', RING.x, RING.y + RING.r + 86, lu, { size: 44, col: COOL.text });
  };
  const drawFrame = (ctx, t) => {
    const u = expoOut(span(t, tFrame, tFrame + .55)), out = span(t, a.thousands - .1, a.thousands + .4); if (u <= 0 || out >= 1) return;
    const x0 = L.x0 - 90, x1 = L.x1 + 90, y0 = 560, y1 = L.floor + 110, c = 90, k = 1 - out;
    ctx.strokeStyle = rgba(CREAM, .9 * k); ctx.lineWidth = 6; ctx.lineCap = 'round';
    const g = lerp(220, 0, u);
    for (const [cx, cy, sx, sy] of [[x0 - g, y0 - g, 1, 1], [x1 + g, y0 - g, -1, 1], [x0 - g, y1 + g, 1, -1], [x1 + g, y1 + g, -1, -1]]) { ctx.beginPath(); ctx.moveTo(cx + sx * c, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + sy * c); ctx.stroke(); }
    F.maskLine(ctx, [['× 1', 0]], x1 + 150, 860, 190, rise(span(t, a.notOne + .1, a.notOne + .55)) * k, { serif: true, col: CREAM, glow: true, align: 'left' });
  };
  const fieldU = (t) => span(t, tClone0, tClone1) * (1 - span(t, a.notYet - .5, a.even - .4));
  const drawField = (ctx, t) => {
    const fu = fieldU(t); if (fu <= 0) return;
    const sh = { ...L };
    for (let k = 0; k <= ROWK; k++) {
      const s = Math.pow(.72, k), y = HZ + (L.belt - HZ) * s, ku = span(fu, k / ROWK * .55, k / ROWK * .55 + .35); if (ku <= 0) continue;
      const span_ = 2400 * s, M = Math.ceil(5600 / span_);
      for (let m = -M; m <= M; m++) {
        if (k === 0 && m === 0) continue;
        const cx = LC + m * span_, mu = span(ku, Math.min(.6, Math.abs(m) / (M + 1) * .6), 1); if (mu <= 0) continue;
        if (s * 2100 < 160) {   // far: one dashed stroke per line (thousands of them toward the horizon)
          ctx.strokeStyle = rgba(CREAM, .55 * mu); ctx.lineWidth = 7; ctx.setLineDash([Math.max(34, 300 * s), Math.max(26, 240 * s)]); ctx.beginPath(); ctx.moveTo(cx - 1000 * s, y); ctx.lineTo(cx - 1000 * s + 2000 * s * mu, y); ctx.stroke(); ctx.setLineDash([]);
          continue;
        }
        ctx.save(); ctx.translate(cx, y); ctx.scale(s, s); ctx.translate(-LC, -L.belt);
        B.labLine(ctx, t, { u: mu, dashed: true, simple: true, w: 7 / s }, sh);
        ctx.restore();
      }
    }
  };
  // sun and moon swing over the field (screen space, clipped at the horizon)
  const drawSky = (ctx, t, c) => {
    const fu = fieldU(t); if (fu <= 0) return;
    const [hx, hy] = F.lookPt(c.cx, c.cy, c.z, LC, HZ), rx = 820, ry = Math.max(40, hy - 95);
    ctx.save(); ctx.beginPath(); ctx.rect(-40, -40, W + 80, hy + 40); ctx.clip();
    const sun = span(t, a.thousands + .25, a.day + .75), moon = span(t, a.day - .05, a.day + 1.6);
    if (sun > 0 && sun < 1) { const th = Math.PI * (1 - sun), x = hx + Math.cos(th) * rx, y = hy - Math.sin(th) * ry; F.halo(ctx, x, y, 150, .75, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(x, y, 34, 0, 6.29); ctx.fill(); }
    if (moon > 0 && moon < 1) { const th = Math.PI * (1 - moon), x = hx + Math.cos(th) * rx, y = hy - Math.sin(th) * ry; F.halo(ctx, x, y, 90, .4, COOL.halo, COOL.core); ctx.fillStyle = CREAM; ctx.beginPath(); ctx.arc(x, y, 26, 0, 6.29); ctx.fill(); ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.beginPath(); ctx.arc(x + 11, y - 7, 23, 0, 6.29); ctx.fill(); }
    ctx.restore();
    // the horizon line
    ctx.fillStyle = rgba(CREAM, .25 * fu); ctx.fillRect(0, hy, W, 1.5);
  };

  // ---------------------------------------------------------------- 2.16–2.17 the road: built, approved, plugged in; human speed
  const boxX = (t) => {
    const k1 = sineIO(span(t, a.even + 1.0, a.built - .05)), k2 = sineIO(span(t, a.built + .25, a.approved - .05)), k3 = sineIO(span(t, a.approved + .3, a.plugged - .05)), k4 = sineIO(span(t, a.plugged + .45, a.speed + 1.2));
    return ROAD.x0 + (ROAD.st[0] - ROAD.x0) * k1 + (ROAD.st[1] - ROAD.st[0]) * k2 + (ROAD.st[2] - ROAD.st[1]) * k3 + (ROAD.x1 - 120 - ROAD.st[2]) * k4;
  };
  const drawRoad = (ctx, t) => {
    const u = span(t, a.even - .5, a.even + .9); if (u <= 0) return;
    const y = ROAD.y, out = span(t, a.look - .2, a.look + .5);
    F.outline(ctx, [[[ROAD.x0, y], [ROAD.x1, y]]], smooth(u), { w: 3 });
    const sts = [[a.built, 'BUILT'], [a.approved, 'APPROVED'], [a.plugged, 'PLUGGED IN']];
    ROAD.st.forEach((x, i) => {
      const q = smooth(span(u, .2 + i * .2, .6 + i * .2)); if (q <= 0) return;
      const on = smooth(span(t, sts[i][0] - .1, sts[i][0] + .3));
      if (i === 0) {   // a building site: a crane over a frame
        F.outline(ctx, [[[x - 40, y], [x - 40, y - 330], [x - 26, y - 330], [x - 26, y]], [[x - 120, y - 320], [x + 170, y - 320]], [[x + 130, y - 320], [x + 130, y - 250 + 30 * on]], F.rectPts(x - 10, y - 130, 140, 130)], q, { w: 3, gold: on > .5 });
      } else if (i === 1) {   // a desk with a stamp
        F.outline(ctx, [[[x - 110, y - 92], [x + 110, y - 92]], [[x - 96, y - 92], [x - 96, y]], [[x + 96, y - 92], [x + 96, y]], F.rectPts(x + 20, y - 132 + 18 * Math.sin(Math.PI * span(t, a.approved - .15, a.approved + .25)), 40, 34, 4)], q, { w: 3, gold: on > .5 });
      } else F.lineIcon(ctx, 'pylon', x, y - 170, 170, { u: q, w: 3, gold: on > .5 });
      F.person(ctx, x - 140, y, 170, { dir: 1, look: .2, armR: [.5 + .15 * Math.sin(t * 1.4 + i), .8], armL: [.2, .3], light: .4 });
      F.capsLabel(ctx, sts[i][1], x, y + 100, span(t, sts[i][0] - .1, sts[i][0] + .35) * (1 - out), { size: 40, col: on > .5 ? GOLD.text : CREAM });
    });
    // the box (the perfect invention, gold) travels through
    const bu = span(t, a.even + .9, a.even + 1.3), bx = boxX(t);
    if (bu > 0) { F.halo(ctx, bx, y - 46, 120, .55 * bu, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.body; ctx.beginPath(); ctx.roundRect(bx - 40, y - 86 + (1 - expoOut(bu)) * 40, 80, 80, 8); ctx.fill(); ctx.strokeStyle = GOLD.core; ctx.lineWidth = 2.5; ctx.stroke(); }
    // the cable to the box at the pylon
    const pc = smooth(span(t, a.plugged - .05, a.plugged + .35)) * (1 - out);
    if (pc > 0) F.goldSpan(ctx, [[ROAD.st[2] + 60, y - 240], [lerp(ROAD.st[2] + 60, bx + 30, .5), y - 120], [bx + 30, y - 80]], 0, pc, { w: 2, spark: false });
    // 2.17 a long slow clock hand sweeps over the stations: HUMAN SPEED
    const hu = span(t, a.human - .1, a.human + .5) * (1 - out);
    if (hu > 0) {
      const an = Math.PI * lerp(.84, .16, span(t, a.human - .1, a.look + .6)), tx = PIV.x + Math.cos(an) * PIV.len, ty = PIV.y + Math.sin(an) * PIV.len;
      ctx.save(); ctx.globalAlpha *= clamp(hu * 2);
      ctx.strokeStyle = rgba(CREAM, .4); ctx.lineWidth = 2.5; ctx.setLineDash([14, 12]); ctx.beginPath(); ctx.arc(PIV.x, PIV.y, PIV.len, Math.PI * .84, an, true); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = CREAM; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(PIV.x - Math.cos(an) * 60, PIV.y - Math.sin(an) * 60); ctx.lineTo(tx, ty); ctx.stroke();
      ctx.fillStyle = CREAM; ctx.beginPath(); ctx.arc(PIV.x, PIV.y, 16, 0, 6.29); ctx.fill();
      ctx.restore();
      F.capsLabel(ctx, 'HUMAN SPEED', LC, ROAD.y + 230, span(t, a.speed - .1, a.speed + .4) * (1 - out), { size: 60, col: CREAM });
    }
  };

  // ---------------------------------------------------------------- 2.19 the plate lifted out of the line (world pos), its id
  const liftInfo = (() => { const ps = B.platesAt(tLift0); let best = null; for (const p of ps) if (!best || Math.abs(p.x - 4600) < Math.abs(best.x - 4600)) best = p; return best; })();
  const liftPos = (t) => { const q = sineIO(span(t, tLift0, tLift1)); const bx = liftInfo.x + (Math.min(t, tLift0) - tLift0) * 120 + 25; return [lerp(bx, 4620, q), lerp(L.belt - 7, 560, q), q]; };

  // ================================================================ the world under its camera
  const drawWorld = (ctx, t, c, o = {}) => {
    F.look(ctx, c.cx, c.cy, c.z, () => {
      if (o.room !== false && t < tFold1 + 1.4) {
        if (t < tIris1 + .02) {   // the iris: the lamp's light opens the room around you (outside it, c03's night goes on)
          drawYou(ctx, t);
          const r = 2600 * quartIO(span(t, tIris0, tIris1)) + 6 * smooth(span(t, tIris0 - .02, tIris0 + .1));
          if (r > .5) F.iris(ctx, (g) => g.arc(LAMP.x, LAMP.top + 36, r, 0, 6.29), (g) => drawRoom(g, t), { rim: rgba(GOLD.line, .55 * (1 - span(t, tIris1 - .5, tIris1))), rimW: 3 / c.z });
        } else drawRoom(ctx, t);
      }
      drawRow(ctx, t, c);
      drawCell(ctx, t);
      drawLab(ctx, t, t > tLift0 ? liftInfo.i : null);
      const pf = plateFlight(t);
      if (pf) { F.halo(ctx, pf[0] + 25, pf[1], 90, .6, GOLD.halo, GOLD.core); ctx.fillStyle = mixHex(GOLD.body, mixHex(P.blue1, P.cream, .35), smooth(span(pf[2], .7, 1))); ctx.beginPath(); ctx.roundRect(pf[0], pf[1] - 13, 50, 13, 3); ctx.fill(); }
      drawNote(ctx, t);
      drawRing(ctx, t);
      drawFrame(ctx, t);
      drawRoad(ctx, t);
    });
    drawSky(ctx, t, c);
  };
  const worldScene = (ctx, t) => { const c = cam(t); night(ctx, t, c); drawWorld(ctx, t, c, { room: false }); };
  const roomScene = (ctx, t) => { const c = camA(t); F.look(ctx, c.cx, c.cy, c.z, () => drawRoom(ctx, t, { winB: true })); };
  const winRect = (t) => { const c = camA(t), [x, y] = F.lookPt(c.cx, c.cy, c.z, WIN.x, WIN.y); return { x, y, w: WIN.w * c.z, h: WIN.h * c.z }; };

  // the plant outline drifts toward the middle while the camera tilts up off the lab (c06 continues this drift)
  const plantAt = (t) => { const k = sineIO(span(t, a.material + .6, a.end + 1.6)); return { x: PLANT.x - 260 * k, y: PLANT.y - 40 * k, s: PLANT.s }; };
  // ================================================================ screen-space layer
  const drawScreen = (ctx, t, c) => {
    // 2.13 × THOUSANDS · FORECAST · DAY AND NIGHT
    const tu = span(t, a.thousands - .05, a.thousands + .45), tOut = span(t, tWin0 + .1, tWin0 + .5);
    const bk = Math.max(rise(tu) * (1 - tOut), 0);
    if (bk > 0) { ctx.save(); ctx.globalAlpha *= bk; ctx.fillStyle = F.rad(ctx, W / 2, 175, 420, [[0, rgba(P.night0, .82)], [.6, rgba(P.night0, .55)], [1, rgba(P.night0, 0)]]); ctx.save(); ctx.translate(W / 2, 175); ctx.scale(1, .32); ctx.translate(-W / 2, -175); ctx.fillRect(W / 2 - 420, 175 - 420, 840, 840); ctx.restore(); ctx.restore(); }
    F.maskLine(ctx, [['× thousands', 0]], W / 2, 150, 84, rise(tu) * (1 - tOut), { serif: true, col: CREAM, glow: true, align: 'center' });
    F.capsLabel(ctx, 'FORECAST · DAY AND NIGHT', W / 2, 214, span(t, a.day - .1, a.day + .4) * (1 - tOut), { size: 28, col: COOL.text });
    // 2.14 the question, 2.15 NOT YET (in the room)
    if (t > tWin0 && t < tPush1) {
      const qo = span(t, a.notYet - .1, a.notYet + .4);
      if (a.qW) F.question(ctx, t, 'So when does your power bill shrink?', 96, 520, 46, { ts: a.qW, align: 'left', out: qo });
      const cA = camA(t), [bx, by] = F.lookPt(cA.cx, cA.cy, cA.z, BILLC2.x + BILLC2.w / 2, BILLC2.y + BILLC2.h);
      const nu = span(t, a.notYet - .05, a.notYet + .3), nOut = span(t, tPush0 + .15, tPush0 + .55);
      F.maskLine(ctx, [['NOT YET.', 0]], bx, by + 78, 58, rise(nu) * (1 - nOut), { serif: false, weight: 700, col: CREAM, glow: false, align: 'center' });
    }
    // 2.19–2.21 the plate (screen), the power plant, A MATERIAL
    if (t > tLift0 && t < tToRow1 + .05) {
      const [wx, wy, q] = liftPos(t), [sx, sy] = F.lookPt(c.cx, c.cy, c.z, wx, wy), m = sineIO(span(t, tToRow0, tToRow1)), rr = B.rowRect(1);
      const x = lerp(sx, rr.x + rr.w * .78, m), y = lerp(sy, rr.y + rr.h / 2, m) - Math.sin(Math.PI * m) * 120;
      const turn = Math.cos(Math.PI / 2 * (1 - smooth(span(q, .3, 1)))), wbig = lerp(50 * c.z, 190, smooth(span(q, .2, 1))), w = lerp(wbig, 30, m), h = lerp(lerp(13 * c.z, 130, turn), 10, m);
      F.halo(ctx, x, y, w * 1.2, .7 * (1 - m * .5), GOLD.halo, GOLD.core);
      ctx.fillStyle = F.lin(ctx, x - w / 2, y - h / 2, x + w / 2, y + h / 2, [[0, GOLD.hot], [.5, GOLD.body], [1, GOLD.mid]]); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 6); ctx.fill();
      if (turn > .3 && m < .5) { ctx.strokeStyle = rgba(GOLD.deep, .45 * turn); ctx.lineWidth = 1.5; for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.moveTo(x - w / 2 + w * i / 6, y - h / 2 + 6); ctx.lineTo(x - w / 2 + w * i / 6, y + h / 2 - 6); ctx.stroke(); } }
    }
    const pu = span(t, a.plant - .1, a.plant + .6), PL = plantAt(t);
    if (pu > 0) {
      F.lineIcon(ctx, 'plant', PL.x, PL.y, PL.s, { u: smooth(pu), w: 3.4 });
      const so = span(t, a.end - .7, a.end - .2);
      F.strike(ctx, PL.x - PLANT.s * 1.05, PL.y + 6 - so * 0, PL.x - PLANT.s * 1.05 + PLANT.s * 2.1, span(t, a.plantW, a.plantW + .3) * (1 - so), { w: 7 });
      F.capsLabel(ctx, 'NOT A POWER PLANT', PL.x, PL.y - PLANT.s - 30, span(t, a.plantW - .1, a.plantW + .35) * (1 - span(t, a.material + .9, a.material + 1.3)), { size: 28, col: CREAM });
    }
    F.maskLine(ctx, [['A material.', 1]], 960, 410, 66, rise(span(t, a.material - .05, a.material + .4)) * (1 - span(t, a.end - .75, a.end - .25)), { serif: true, col: GOLD.body, glow: true, align: 'center' });
    // the mini board: ENERGY pulses (2.01), the flying row (2.02), forward + BEGUN + the stamp's tick (2.18), MATERIALS pulses (2.21)
    const fw = quartIO(span(t, tFwd0, tFwd1)) * (1 - quartIO(span(t, tBack0, tBack1))), arc = -Math.sin(Math.PI * fw) * 30;
    const pose = { x: lerp(B.MINI.x, FWD.x, fw), y: lerp(B.MINI.y, FWD.y, fw) + arc, s: Math.exp(lerp(Math.log(B.MINI.s), Math.log(FWD.s), fw)) };
    const e = span(t, a.hasBegun - .55, a.hasBegun + .35);
    const ePulse = .9 * Math.sin(Math.PI * span(t, a.pay - .3, a.energy + .3)), mPulse = .9 * Math.sin(Math.PI * span(t, a.material + .9, a.end + .1));
    B.miniBoard(ctx, t, { ...pose, e, ePulse, mPulse });
    const su = span(t, a.but + .2, a.but + .7), sOut = expoIn(span(t, tBack0 - .35, tBack0 + .2));
    if (su > 0 && sOut < 1) { const r0 = B.rowRect(0, pose); F.testStamp(ctx, t, r0.x + r0.w + 70 * pose.s / .9, r0.y + r0.h / 2 - sOut * 600, 66 * pose.s / .9, { u: su, tick: smooth(span(t, a.hasBegun + .1, a.hasBegun + .6)), rot: -.12 + .02 * Math.sin(t * .9) }); }
    // ENERGY flies off the mini board onto the card (2.02)
    if (t > tFly0 && t < tFly1 + .02) {
      const q = sineIO(span(t, tFly0, tFly1)), r0 = B.rowRect(0), [tx, ty] = F.lookPt(c.cx, c.cy, c.z, BILLC.x + 20, BILLC.y - 84);
      const x = lerp(r0.x, tx, q), y = lerp(r0.y, ty, q) - Math.sin(Math.PI * q) * 60, w = lerp(r0.w, (BILLC.w - 40) * c.z, q), h = lerp(r0.h, 68 * c.z, q);
      F.boardRow(ctx, t, x, y, w, h, { text: 'ENERGY', from: '', flip: 1, lit: .7 * Math.sin(Math.PI * q) }, { cells: 14, size: h * .4 });
    }
  };

  // ======================================================================================================================== draw
  const draw = (ctx, t) => {
    if (t >= tWin0 && t < tPush1) {   // your window: the field is pulled back into it; later the camera goes back in
      const u = t < tWin1 ? 1 - span(t, tWin0, tWin1) : t < tPush0 ? 0 : span(t, tPush0, tPush1);
      F.portal(ctx, u, winRect(t), (g) => roomScene(g, t), (g) => worldScene(g, t), { ease: sineIO });
      drawScreen(ctx, t, cam(t));
      return;
    }
    const c = cam(t);
    night(ctx, t, c);
    drawWorld(ctx, t, c);
    drawScreen(ctx, t, c);
  };
  draw.cam = cam; draw.night = night; draw.PLANT = PLANT; draw.plantAt = plantAt;
  return draw;
}
