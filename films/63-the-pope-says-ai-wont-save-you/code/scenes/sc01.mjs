// c01 · Hook (lead, the quality reference) · 0 → T.G('In May, in Rome'). Plan: docs/shots.md H.01–H.20 + C1 · motion bible: docs/MOTION.md.
// NOT one world: eleven composed motifs, each joined to the next by a CARRIER (column "carrier"). One entry, one draw function, the
// motifs are scheduled on VO phrases; transitions are transformations (a shape becomes the next shape), never fades, never cuts.
//
// | ID      | anchor (phrase)            | motif (one idea per sentence)                                              | type  | carrier → next            |
// |---------|----------------------------|----------------------------------------------------------------------------|-------|---------------------------|
// | H.01    | Artificial intelligence    | THUMBNAIL A: city, the gold machine block, the Pope's raised hand, you; AI WON'T SAVE YOU word by word | MIX | the title type |
// | H.02    | That is Pope Leo's         | THE POPE: rolls over into POPE LEO XIV (gold line to him) · IN SHORT        | MIX   | the Pope                  |
// | H.03    | He leads                   | block + city leave, 142 figures roll out behind him (1 = 10 million), 1.4 BILLION CATHOLICS | EXPL | the number → a gold dot |
// | H.04    | Name the thing             | the dot falls into a kitchen lamp; the room opens round it; you, hands held out | SCENE | the light in your hands |
// | H.05–07 | The illness / bills / work | three lit tiles grow out of your hands, one per phrase, then hover small    | SCENE | the tiles                 |
// | H.08–11 | That is the promise …      | through the window to the block (portal); the tiles dock, CURE DISEASE · END POVERTY · TAKE THE WORK | MIX | the block |
// | H.12    | And the people building    | pull back: scaffolding, builders, a crane                                   | SCENE | one circuit trace         |
// | H.13    | The Pope agrees            | the trace leaves the chip as a heartbeat line, the camera follows it · §9   | EXPL  | the heartbeat line        |
// | H.14    | Then he refuses            | the line flattens into a baseline, SAVE rises out of it; his palm, the stroke | EXPL | the struck word         |
// | H.15    | So if all of that          | SAVE tucks up as a tag; you walk in; WHAT DOES HE MEAN?                     | EXPL  | the gold ?                |
// | H.16    | His word for               | the ? drops into an empty slot; block outline ← slot → warhead outline      | EXPL  | the slot                  |
// | C1      | slot:C1                    | the slot grows into the clip plate and shrinks back                         | CLIP  | the slot                  |
// | H.17–20 | Disarmed. / Not banned …   | DISARMED in the slot · NOT BANNED, NOT BLESSED struck and pushed off · DISARMED grows, the quote → plateDisarmed | EXPL | DISARMED |
import * as F from '../lib/f63_kit.mjs';
import * as S from '../lib/f63_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, rise, GOLD, CREAM } = F;

export const PRINT = F.PRINT63;
export default async (T, R) => {
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.ai = G('Artificial intelligence will not'); a.not = G('not save', a.ai); a.save = G('save you', a.ai); a.you = G('you', a.save);
  a.msg = G("That is Pope Leo's"); a.leo = G("Pope Leo's", a.msg); a.short = G('in short', a.msg);
  a.leads = G('He leads'); a.billion = G('billion Catholics', a.leads); a.billionE = GE('billion Catholics', a.leads);
  a.name = G('Name the thing'); a.hand = G('hand a machine', a.name);
  a.ill = G('The illness'); a.bills = G('The bills', a.ill); a.work = G('The work that wears'); a.workE = GE('wears you out', a.work);
  a.promise = G('That is the promise'); a.cure = G('Cure disease'); a.pov = G('End poverty'); a.take = G('Take the work');
  a.people = G('And the people building'); a.mean = G('mean it', a.people);
  a.agrees = G('The Pope agrees'); a.heal = G('can heal', a.agrees);
  a.then = G('Then he refuses'); a.refuses = G('refuses', a.then); a.single = G('a single word', a.then); a.singleE = GE('a single word', a.then);
  a.so = G('So if all of that'); a.saving = G('saving you', a.so); a.whatW = F.wordTimes(T, 'what does he mean', null, a.so); a.what = a.whatW?.[0] ?? a.so + 2.8;
  a.his = G('His word for'); a.machines = G('these machines', a.his); a.church = G('the Church uses', a.his); a.nuclear = G('nuclear weapons', a.his); a.nuclearE = GE('nuclear weapons', a.his);
  const c1 = T.clip('C1'); a.c1 = c1 ? c1.start : a.nuclearE + .7; a.c1e = c1 ? c1.end : a.c1 + 5.3;
  a.dis = G('Disarmed', a.c1); a.banned = G('Not banned', a.c1); a.blessed = G('Not blessed', a.c1); a.strong = G('The word is strong', a.c1); a.purpose = G('on purpose', a.c1);
  a.end = R.b;
  return [{ t: 0, draw: scene(a, T), print: PRINT }];
};

// ------------------------------------------------------------------------------------------------ layout (design px, 1920 × 1080)
const GY = 905;                                       // thumbnail ground line
const POPE = { x: 1300, h: 430 }, YOU0 = { x: 1150, h: 165 }, BLK = { x: 1585, w: 372, h: 780 };
const TTL = { x: 64, y1: 318, y2: 572, size: 200, cond: .56 };
const KYOU = { x: 520, y: 868, h: 440 };              // you in the kitchen
const SMALL = [[700, 560], [850, 515], [1000, 560]], SW = 210, SH = 136;   // the three tiles, small, over your hands
const BIG = [990, 410], BW = 800, BH = 500;
const B = { x: 1000, y: 1040, w: 600, h: 1100 };      // the block in its own space (portal B, builders, heartbeat)
const ECG_I = 16;                                     // the circuit trace that leaves the chip (left side)
const SLOT = { x: W / 2, y: 470, w: 540, h: 160 };

function scene(a, T) {
  // ---------------------------------------------------------------- timings (all on phrases)
  const tPlate = a.end - S.SEAM_HALF;
  const kIn0 = a.name - .2, kIn1 = a.name + .8;                    // the lamp iris: the kitchen opens round the falling dot
  const port0 = a.promise - .4, port1 = a.promise + 1.75;           // through the window
  const pull0 = a.people - .1, pull1 = a.agrees + .2;                // the pull-back to the builders
  const ecg0 = a.agrees + .05, ecg1 = a.then + .15;                  // the heartbeat runs
  const flat0 = a.then + .05, flat1 = a.then + .75;                  // the heartbeat flattens, SAVE rises out of it
  const tuck0 = a.saving + .1, tuck1 = a.saving + 1.1;                       // SAVE tucks up as a tag
  const qOut0 = a.his - .15, qOut1 = a.his + .55;                    // the question leaves, its ? drops into the slot

  // ---------------------------------------------------------------- M1 · thumbnail A + the faithful
  const drawThumb = (ctx, t) => {
    const leave = sineIO(span(t, a.leads - .2, a.leads + 1.3));     // block and city leave, the camera eases back
    const z = lerp(1.0, 1.035, smooth(span(t, 0, a.leads))) * lerp(1, .93, leave), cx = lerp(W / 2, 1040, leave), cy = lerp(H / 2, 520, leave);
    F.night(ctx, t, { glow: [BLK.x - 120, 380, 1100, 1 - leave * .6], n: 220 });
    F.look(ctx, cx, cy, z, () => {
      F.city(ctx, t, -60, 1180, GY, { sink: sineIO(span(t, a.leads - .1, a.leads + 1.1)), seed: 4 });
      F.land(ctx, GY);
      // the gold light pool of the block on the ground
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = F.rad(ctx, BLK.x - 80, GY + 10, 900, [[0, rgba(P.halo0, .28 * (1 - leave))], [1, rgba(P.halo0, 0)]]); ctx.fillRect(BLK.x - 1000, GY - 40, 2000, 300); ctx.restore();
      const bx = BLK.x + expoIn(span(t, a.leads - .15, a.leads + 1.2)) * 900;
      if (bx < 2800) F.block(ctx, t, bx, GY, BLK.w, BLK.h, { lit: 1, seed: 3 });
      // the faithful roll out behind him (unit chart), sink back on 'Name the thing'
      const cu = span(t, a.leads + .1, a.billion + .9), sink = span(t, a.name - .15, a.name + .6);   // the crowd stays until the iris swallows it
      if (cu > 0 && sink < 1) F.crowd(ctx, t, { x: 1060, y0: GY - 26, y1: 560, w: 2300, u: cu, sink, ox: POPE.x, oy: GY });
      // you (yellow, small) and the Pope (white): breathing, the hand rises to its stop on "not"
      const br = 1 + .006 * Math.sin(t * 2.1);
      const youOut = expoIn(span(t, a.name - .1, a.name + .55));
      if (youOut < 1) { ctx.save(); ctx.translate(YOU0.x, GY); ctx.scale(1, br); ctx.translate(-YOU0.x, -GY); ctx.beginPath(); ctx.rect(0, 0, W * 2, GY + 2); ctx.clip(); F.du(ctx, YOU0.x, GY + youOut * YOU0.h * 1.1, YOU0.h, { look: .55 + .1 * Math.sin(t * .4), light: 1, back: .3 }); ctx.restore(); }
      const popeOut = expoIn(span(t, a.name - .05, a.name + .6));
      if (popeOut < 1) {
        const raise = lerp(.6, 1, expoOut(span(t, a.ai + .3, a.not + .1))) - .06 * F.bump(t, a.ai + .1, .5) * 0;   // anticipation is in the ease
        ctx.save(); ctx.translate(POPE.x, GY); ctx.scale(1, 1 + .005 * Math.sin(t * 1.9 + 1)); ctx.translate(-POPE.x, -GY);
        ctx.beginPath(); ctx.rect(0, 0, W * 2, GY + 2); ctx.clip();
        F.pope(ctx, POPE.x, GY + popeOut * POPE.h * 1.05, POPE.h, { raise, look: .15 + .05 * Math.sin(t * .5), light: 1, back: .55, lean: -.02 * (1 - leave) });
        ctx.restore();
      }
    });
    // H.01 / H.02: the title, word by word on the voice; THE POPE: rolls over into POPE LEO XIV; IN SHORT
    const out = span(t, a.leads - .3, a.leads + .6);
    if (out < 1) {
      // THE POPE: rolls up and out, POPE LEO XIV rolls up into its place (a slot-machine roll inside the line's own mask)
      const roll = sineIO(span(t, a.leo - .15, a.leo + .45)), LH = TTL.size * 1.08;   // travel > cap height + glow: the old line is fully gone
      ctx.save(); ctx.beginPath(); ctx.rect(TTL.x - 60, TTL.y1 - TTL.size * .8, W * 2, TTL.size * .84); ctx.clip();
      if (roll < 1) { ctx.save(); ctx.translate(0, -roll * LH); F.titleWords(ctx, [[{ w: 'THE POPE:', u: 1 }]], TTL.x, TTL.y1, { size: TTL.size, cond: TTL.cond, out }); ctx.restore(); }
      if (roll > 0) { ctx.save(); ctx.translate(0, (1 - roll) * LH); F.titleWords(ctx, [[{ w: 'POPE LEO XIV', u: 1 }]], TTL.x, TTL.y1, { size: TTL.size, cond: TTL.cond, out }); ctx.restore(); }
      ctx.restore();
      // frame 0 = thumbnail A, the whole title; the voice reads it: a gold rule runs under each word as it is spoken
      F.titleWords(ctx, [[{ w: 'AI' }, { w: "WON'T" }, { w: 'SAVE' }, { w: 'YOU' }]], TTL.x, TTL.y2, { size: TTL.size, cond: TTL.cond, out });
      const WT = [a.ai, a.not, a.save, a.you, a.you + .45], WS = ['', 'AI ', "AI WON'T ", "AI WON'T SAVE ", "AI WON'T SAVE YOU"].map((q) => (q ? F.titleWidth(q, TTL.size, TTL.cond) : 0));
      let rx = 0; for (let i = 0; i < 4; i++) if (t > WT[i] - .05) rx = lerp(WS[i], WS[i + 1] - (i < 3 ? TTL.size * .2 : 0), expoOut(span(t, WT[i] - .05, Math.min(WT[i + 1], WT[i] + .6))));
      const rOut = span(t, a.msg - .2, a.msg + .5);
      if (rx > 2 && rOut < 1) F.goldSpan(ctx, [[TTL.x + lerp(0, rx, sineIO(rOut)), TTL.y2 + 26], [TTL.x + rx, TTL.y2 + 26]], 0, 1, { w: 5, spark: t < a.you + .5 });
      // the name's gold line to the Pope + IN SHORT
      const lu = span(t, a.leo + .25, a.leo + 1.0) * (1 - out);
      if (lu > 0) { const tw = F.titleWidth('POPE LEO XIV', TTL.size, TTL.cond); F.goldSpan(ctx, [[TTL.x + tw + 24, TTL.y1 - 70], [POPE.x - 70, TTL.y1 - 70], [POPE.x - 8, GY - POPE.h * 1.02]], 0, smooth(lu), { w: 1.6, spark: lu < 1 }); }
      F.capsLabel(ctx, 'THE MESSAGE, IN SHORT', TTL.x + 6, TTL.y2 + 70, span(t, a.short - .1, a.short + .5) * (1 - out), { align: 'left', size: 26 });
    }
    // H.03: 1.4 BILLION CATHOLICS (the number), the unit, the source
    const nu = span(t, a.leads + .2, a.leads + .9), nOut = span(t, a.name - .75, a.name - .3);
    if (nu > 0 && nOut < 1) {
      const sq = 1 - sineIO(nOut);   // the number collapses (towards its centre) into the gold dot
      ctx.save(); ctx.translate(380, 300); ctx.scale(Math.max(.02, sq), Math.max(.02, sq)); ctx.translate(-380, -300);
      F.goldText(ctx, [['1.4 BILLION', 1]], 380, 330, 150, rise(nu), { serif: true, glow: true, align: 'center' });
      F.capsLabel(ctx, 'CATHOLICS', 380, 400, span(t, a.billion - .1, a.billion + .5), { size: 34, col: CREAM });
      ctx.restore();
      F.capsLabel(ctx, '1 FIGURE = 10 MILLION PEOPLE', 380, 470, span(t, a.billion + .2, a.billion + .8) * (1 - nOut), { size: 24 });
    }
    F.source(ctx, t, a.leads + .5, a.name - .3, 'VATICAN STATISTICS (ANNUARIUM STATISTICUM ECCLESIAE), 2024 DATA: 1.42 BILLION');
  };
  // the gold dot: born where the number collapsed, falls on an arc into the kitchen lamp
  const dotPos = (t) => { const u = sineIO(span(t, a.name - .38, kIn0 + .5)); return [lerp(380, F.KITCHEN.lamp[0], u), lerp(300, F.KITCHEN.lamp[1] + 10, u) - 120 * Math.sin(Math.PI * u)]; };

  // ---------------------------------------------------------------- M2 · the kitchen, your hands, three tiles
  const tileState = (t) => {   // big/small position of each tile: [x, y, w, h, u, from]
    const out = [];
    const grow = [a.ill - .2, a.bills - .15, a.work - .15], shrink = [a.bills - .5, a.work - .5, a.workE + .15];   // the last one leaves before the next grows
    for (let i = 0; i < 3; i++) {
      const g = span(t, grow[i], grow[i] + .55), s = sineIO(span(t, shrink[i], shrink[i] + .6));
      if (g <= 0) { out.push(null); continue; }
      const x = lerp(BIG[0], SMALL[i][0], s), y = lerp(BIG[1], SMALL[i][1], s), w = lerp(BW, SW, s), h = lerp(BH, SH, s);
      out.push({ x, y, w, h, u: g, from: s > 0 ? null : HANDS, kind: ['ill', 'work', 'work'][i] && ['ill', 'bills', 'work'][i], lt: t - grow[i] });
    }
    return out;
  };
  const HANDS = [KYOU.x + KYOU.h * .36, KYOU.y - KYOU.h * .66];
  const drawYou = (ctx, t) => {
    const reach = expoOut(span(t, a.name + .1, a.hand + .4));
    const br = 1 + .006 * Math.sin(t * 2.1);
    ctx.save(); ctx.translate(KYOU.x, KYOU.y); ctx.scale(1, br); ctx.translate(-KYOU.x, -KYOU.y);
    F.du(ctx, KYOU.x, KYOU.y, KYOU.h, { dir: 1, look: lerp(-.1, .25, reach) + .05 * Math.sin(t * .6), light: 1, back: .25,
      armR: [lerp(.25, 1.32, reach) + .03 * Math.sin(t * 1.1), lerp(.15, 1.55, reach)], armL: [lerp(-.15, 1.18, reach), lerp(-.1, 1.45, reach) + .03 * Math.sin(t * 1.3)] });
    ctx.restore();
    // the light in your open hands (the tiles grow out of it)
    const hl = span(t, a.hand - .2, a.hand + .4) * (1 - span(t, port0, port0 + .6));
    if (hl > 0) F.halo(ctx, HANDS[0], HANDS[1] - 10, 60 + 10 * Math.sin(t * 2), .7 * hl, P.halo0, P.core0);
  };
  const drawKitchen = (ctx, t, withTiles = true) => {
    F.kitchen(ctx, t, { lamp: 1, outside: (c, win) => { const kb = Math.max(win.w / W, win.h / H); c.translate(win.x + win.w / 2, win.y + win.h / 2); c.scale(kb, kb); c.translate(-W / 2, -H / 2); drawBlockSpace(c, t, { cover: win }); }, you: (c) => drawYou(c, t) });
    if (withTiles) for (const s of tileState(t)) if (s) F.tile(ctx, t, s.kind, s.x, s.y, s.w, s.h, { u: s.u, from: s.from, lt: s.lt });
  };

  // ---------------------------------------------------------------- M3–M6 · the block's own space: close-up, builders, the heartbeat, SAVE
  const DOCK = [.43, .33, .23], WSZ = Math.min(54, 350 / F.measure('TAKE THE WORK', 1, true)), DW = 150, DH = 94;                                       // v of the three docked tiles on the face
  const camB = (t) => {   // [cx, cy, z] of the block space
    const K = [[port0, 1000, 600, .42], [port1, 1000, 560, 1.0], [pull0, 1000, 548, 1.04], [pull1 + .9, 980, 610, .52]];
    let c = K[0]; for (let i = 0; i < K.length - 1; i++) if (t >= K[i][0]) { const u = sineIO(span(t, K[i][0], K[i + 1][0])); c = [0, lerp(K[i][1], K[i + 1][1], u), lerp(K[i][2], K[i + 1][2], u), Math.exp(lerp(Math.log(K[i][3]), Math.log(K[i + 1][3]), u))]; }
    let [, cx, cy, z] = c;
    if (t > ecg0) {   // follow the heartbeat's head to the left, zoom in to the line
      const e = sineIO(span(t, ecg0, ecg1 + .35)), hx = ecgHead(t);
      cx = lerp(cx, Math.min(cx, hx + 520), smooth(span(t, ecg0, ecg0 + .6))); cy = lerp(cy, ECGY, e); z = lerp(z, 1.0, e);
      if (t > ecg1) cx = lerp(ecgHead(ecg1) + 520, ECG_END_CX, sineIO(span(t, ecg1, ecg1 + 1.2)));
    }
    return [cx + F.drift(t, 4, 3), cy + F.drift(t, 3, 5), z * (1 + .004 * Math.sin(t * .4))];
  };
  const b0 = F.block(F.NULLCTX ?? null, 0, B.x, B.y, B.w, B.h, { fill: 0, outline: 0 });   // geometry only (no drawing)
  const tr = b0.trace(ECG_I), trEnd = tr[tr.length - 1], ECGY = trEnd[1];
  const ECG_X0 = B.x - B.w / 2 - 6, ECG_X1 = -2700, ECG_END_CX = -1500;
  const ecgHead = (t) => lerp(trEnd[0], ECG_X1, expoOut(span(t, ecg0 + .1, ecg1)) * .35 + span(t, ecg0 + .1, ecg1) * .65);
  const beat = (x, amp) => {   // a heartbeat every 560 px: P wave, QRS spike, T wave
    const p = ((ECG_X0 - x) % 560 + 560) % 560; let y = 0;
    if (p > 60 && p < 120) y = -14 * Math.sin(Math.PI * (p - 60) / 60);
    else if (p >= 150 && p < 170) y = 22 * (p - 150) / 20; else if (p >= 170 && p < 196) y = lerp(22, -170, (p - 170) / 26); else if (p >= 196 && p < 222) y = lerp(-170, 60, (p - 196) / 26); else if (p >= 222 && p < 240) y = lerp(60, 0, (p - 222) / 18);
    else if (p > 300 && p < 400) y = -30 * Math.sin(Math.PI * (p - 300) / 100);
    return ECGY + y * amp;
  };
  const SAVEX = ECG_END_CX, SAVESZ = 300;
  const drawBlockSpace = (ctx, t, o = {}) => {   // o.cover: drawn into the kitchen window (static far view) — a cheap version of the same space
    const [cx, cy, z] = o.cover ? camB(port0) : camB(t); let q9 = 0;
    const pg = o.cover ? 0 : sineIO(span(t, qOut0, qOut1 + 1.2));   // from the question on, the ground eases into the DISARMED plate's own night
    F.night(ctx, t, { glow: [W / 2, lerp(360, 470, pg), lerp(1000, 900, pg), lerp(1, S.breathe(t, .8), pg)] });
    F.look(ctx, cx, cy, z, () => {
      F.land(ctx, B.y);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = F.rad(ctx, B.x, B.y + 20, 1100, [[0, rgba(P.halo0, .3)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(B.x - 1200, B.y - 60, 2400, 400); ctx.restore();
      const words = [{ text: 'THAT IS THE PROMISE', v: .53, u: span(t, a.promise + .3, a.promise + 1.1), size: 42 },
        { text: 'CURE DISEASE', v: DOCK[0] - .03, x: .37, align: 'left', u: span(t, a.cure - .05, a.cure + .45), size: WSZ },
        { text: 'END POVERTY', v: DOCK[1] - .03, x: .37, align: 'left', u: span(t, a.pov - .05, a.pov + .45), size: WSZ },
        { text: 'TAKE THE WORK', v: DOCK[2] - .03, x: .37, align: 'left', u: span(t, a.take - .05, a.take + .45), size: WSZ }];
      const pull = ecgPull(t);
      const b = F.block(ctx, t, B.x, B.y, B.w, B.h, { lit: 1, seed: 3, words: o.cover ? [] : words, trace: ECG_I, pull, rays: .9 });
      // the docked tiles (after the flight) sit on the face as small lit panels
      if (!o.cover && t > port1 - .02) for (let i = 0; i < 3; i++) { const p = dockPt(b, i); F.tile(ctx, t, ['ill', 'bills', 'work'][i], p[0], p[1], DW, DH, { u: 1, lt: t - a.ill }); }
      if (!o.cover) F.scaffold(ctx, t, b, B.x, B.y, B.w, B.h, sineIO(span(t, pull0 + .2, pull1 + .6)), { craneX: 1.05 });
      // the heartbeat: the pulled trace, then the line to the left (amplitude flattens into SAVE's baseline)
      if (pull > 0) {
        const amp = 1 - sineIO(span(t, flat0, flat1)), hx = ecgHead(t), pts = tr.map((p) => [p[0], p[1]]);
        pts.push([ECG_X0, ECGY]);
        for (let x = ECG_X0 - 6; x > Math.max(hx, ECG_X1); x -= 6) pts.push([x, beat(x, amp)]);
        const retract = sineIO(span(t, tuck0 - .5, tuck0 + .35));   // the rule pulls in from both ends to SAVE's centre and is gone as SAVE tucks
        const r = lerp(5200, 0, retract), sub = pts.filter((p) => Math.abs(p[0] - SAVEX) <= r);
        if (sub.length > 1) F.goldSpan(ctx, sub, 0, 1, { w: 3.4, spark: t < ecg1 });
      }
      // §9 under the line, SAVE rising out of the flat line, the strike
      q9 = span(t, a.heal - .5, a.heal + .3) * (1 - span(t, a.then - .1, a.then + .45));
    });
    if (!o.cover && q9 > 0) {   // §9, screen space under the line
      maskLine(ctx, [['“Technology has the power to heal …”', 0]], W / 2, 760, 66, rise(q9), { glow: false, col: CREAM, align: 'center' });
      F.capsLabel(ctx, 'MAGNIFICA HUMANITAS · §9', W / 2, 822, q9, { size: 26 });
    }
  };
  const ecgPull = (t) => span(t, ecg0, ecg0 + .4);
  const dockPt = (b, i) => [b.X(.2, DOCK[i]), b.Y(DOCK[i])];
  const dockScreen = (t, i) => { const [cx, cy, z] = camB(t), b = F.block(null, t, B.x, B.y, B.w, B.h, { fill: 0 }); const p = dockPt(b, i); return F.lookPt(cx, cy, z, p[0], p[1]).concat([z]); };

  // ---------------------------------------------------------------- SAVE, the hand, the strike, the tag; the question; the comparison
  const saveScreen = (t) => { const [cx, cy, z] = camB(t); return F.lookPt(cx, cy, z, SAVEX, ECGY).concat([z]); };
  const drawSave = (ctx, t) => {
    const su = span(t, flat0 + .1, flat1 + .2); if (su <= 0) return;
    const [sx, sy, z] = saveScreen(Math.min(t, tuck0)), tk = sineIO(span(t, tuck0, tuck1));
    const x = lerp(sx, 250, tk), y = lerp(sy, 132, tk) - 260 * expoIn(span(t, a.his - .1, a.his + .6)), size = lerp(SAVESZ * z, 64, tk);
    const tw = F.measure('SAVE', size, true);
    F.goldText(ctx, [['SAVE', 1]], x, y, size, rise(su), { serif: true, glow: true, align: 'center' });
    F.strike(ctx, x - tw / 2 - 10, y - size * .3, x + tw / 2 + 10, span(t, a.single - .1, a.singleE + .05), { w: lerp(10, 4, tk) });
  };
  const drawHand = (ctx, t) => {
    const hin = expoOut(span(t, a.refuses - .45, a.refuses + .2)), hout = expoIn(span(t, a.singleE + .25, a.singleE + .9));
    if (hin <= 0 || hout >= 1) return;
    const x = lerp(-260, 300, hin) - hout * 620, y = 760 - 40 * hin + 30 * F.bump(t, a.single - .15, .4);
    F.stopHand(ctx, x, y, 118, -1.45 + .08 * (1 - hin), {});
  };
  const qTimes = a.whatW;
  const drawQuestion = (ctx, t) => {
    const out = sineIO(span(t, qOut0, qOut1)); if (t < a.so || out >= 1) return null;
    ctx.save(); ctx.translate(0, -out * 520);
    const q = F.question(ctx, t, 'WHAT DOES HE MEAN?', W / 2, 520, 112, { ts: qTimes ?? [a.what, a.what + .3, a.what + .6, a.what + .9] });
    ctx.restore();
    return q;
  };
  const drawYouWalk = (ctx, t) => {   // you walk in on "saving you", look up at the question, walk off on "His word"
    const win = span(t, a.so + .2, a.saving + .6), wout = span(t, a.his - .2, a.his + 1.2);
    if (win <= 0 || wout >= 1) return;
    const x = lerp(2020, 1180, sineIO(win)) - lerp(0, 1400, sineIO(wout)), walking = (win > 0 && win < 1) || (wout > 0 && wout < 1);
    const ph = (2020 - x) / 34;
    F.du(ctx, x, 880, 200, walking ? { walk: ph, view: 'side', dir: -1, light: -1 } : { look: .9, dir: -1, light: -1, back: .3 });
  };
  // the comparison: block outline ← slot → warhead outline, arrows, labels; the ? of the question drops into the slot
  const slotU = (t) => span(t, qOut0 + .35, qOut1 + .25);
  const drawCompare = (ctx, t) => {
    const gone = expoIn(span(t, a.dis - .25, a.dis + .5));
    if (t < qOut0) return;
    // the ? falls from the question into the slot centre
    const qf = span(t, qOut0, qOut0 + .5);
    if (qf > 0 && qf < 1) F.glowText(ctx, '?', lerp(W / 2 + 400, SLOT.x, sineIO(qf)), lerp(520 - 0, SLOT.y + 40, sineIO(qf)), { size: lerp(112, 70, qf), serif: true, col: GOLD.body, align: 'center' });
    const aside = sineIO(span(t, a.c1 - .45, a.c1 + .35)) * (1 - sineIO(span(t, a.c1e - .4, a.c1e + .3)));   // the plate pushes both shapes out and lets them back
    ctx.save(); ctx.translate(-gone * 1000 - aside * 700, 0);
    F.block(ctx, t, 330, 860, 240, 580, { fill: 0, outline: span(t, a.machines - .45, a.machines + .8), ow: 3.5 });
    F.capsLabel(ctx, 'THESE MACHINES', 360, 930, span(t, a.machines, a.machines + .6), { size: 30, col: CREAM });
    F.arrow(ctx, [500, 560], [SLOT.x - SLOT.w / 2 - 24, SLOT.y + 10], span(t, a.machines + .5, a.machines + 1.3), { arc: 60, w: 3 });
    ctx.restore();
    ctx.save(); ctx.translate(gone * 1000 + aside * 700, 0);
    F.warhead(ctx, 1590, 300, 560, span(t, a.church - .3, a.nuclear + .35), { ang: 0, w: 3.5 });
    F.capsLabel(ctx, 'NUCLEAR WEAPONS', 1590, 930, span(t, a.nuclear, a.nuclear + .6), { size: 30, col: CREAM });
    F.arrow(ctx, [1440, 560], [SLOT.x + SLOT.w / 2 + 24, SLOT.y + 10], span(t, a.nuclear + .1, a.nuclearE + .5), { arc: 60, w: 3 });
    ctx.restore();
    F.capsLabel(ctx, 'THE SAME WORD', SLOT.x, SLOT.y - SLOT.h / 2 - 40, span(t, a.church, a.church + .6) * (1 - expoIn(span(t, a.dis - .3, a.dis + .2))), { size: 32, col: GOLD.text });
  };
  // DISARMED: in the slot after the clip, grows to the seam plate size; NOT BANNED / NOT BLESSED; the quote
  const disState = (t) => {   // [x, y, size]
    const g = sineIO(span(t, a.strong - .1, a.strong + 1.1));
    return [SLOT.x, lerp(SLOT.y + 40, S.DIS.y, g), lerp(104, S.DIS.size, g)];
  };
  const drawDisarmed = (ctx, t) => {
    const du = span(t, a.dis - .12, a.dis + .35); if (du <= 0) return;
    const [x, y, size] = disState(t), land = F.bump(t, a.strong + .95, .35);
    ctx.save(); ctx.translate(x, y); ctx.scale(1 + .02 * land, 1 - .05 * land); ctx.translate(-x, -y);   // lands heavy: a small squash
    if (du < 1) maskLine(ctx, [['DISARMED', 0]], x, y, size, rise(du), { glow: true, col: GOLD.text, align: 'center' });
    else S.disarmedWord(ctx, t, x, y, size, { rule: span(t, a.strong + .6, a.strong + 1.5) });
    ctx.restore();
  };
  const maskLine = F.maskLine;
  const drawNot = (ctx, t) => {
    for (const [txt, t0, x, dir] of [['NOT BANNED', a.banned, 560, -1], ['NOT BLESSED', a.blessed, 1360, 1]]) {
      const u = span(t, t0 - .1, t0 + .35), off = expoIn(span(t, t0 + .75, t0 + 1.35)); if (u <= 0 || off >= 1) continue;
      ctx.save(); ctx.translate(dir * off * 900, 0);
      maskLine(ctx, [[txt, 0]], x, 790, 88, rise(u), { glow: false, col: CREAM, align: 'center' });
      const tw = F.measure(txt, 88, true); F.strike(ctx, x - tw / 2, 762, x + tw / 2, span(t, t0 + .3, t0 + .7), { w: 8 });
      ctx.restore();
    }
  };
  const drawQuote = (ctx, t) => {
    const u = span(t, a.strong + .5, a.strong + 1.3), out = span(t, tPlate - 1.0, tPlate - .3); if (u <= 0 || out >= 1) return;
    maskLine(ctx, [['“The word is strong, I know, but deliberately chosen …”', 0]], W / 2, 742, 50, rise(Math.min(u, 1 - out)), { glow: false, col: CREAM, align: 'center' });   // exits by sinking behind its own mask
    F.capsLabel(ctx, 'POPE LEO XIV · PRESENTING THE ENCYCLICAL, 25 MAY 2026', W / 2, 800, span(u, .3, 1) * (1 - out), { size: 24 });
  };

  // ---------------------------------------------------------------- one frame
  return (ctx, t) => {
    if (t >= tPlate) { S.plateDisarmed(ctx, t, T); return; }
    // M1 (thumbnail + faithful) until the lamp iris has opened the kitchen
    if (t < kIn1) {
      drawThumb(ctx, t);
      const dp = dotPos(t), du = span(t, a.name - .4, a.name - .3);
      if (t < kIn0 + .5 && du > 0) F.halo(ctx, dp[0], dp[1], 56, 1, P.halo0, P.core0);
      if (t > kIn0) {   // the kitchen opens round the dot (= the lamp): an iris, its rim is the lamp's light circle
        const r = lerp(6, Math.hypot(W, H) * 1.05, quartIO(span(t, kIn0 + .1, kIn1)));
        if (t > kIn0 + .1) F.iris(ctx, (c) => c.arc(F.KITCHEN.lamp[0], F.KITCHEN.lamp[1] + 10, r, 0, 6.29), (c) => drawKitchen(c, t), { rim: rgba(P.core1, .7), rimW: 3 });
      }
      return;
    }
    if (t < port0) { drawKitchen(ctx, t); return; }
    // through the window: the kitchen pushes into its window, the block space lives inside it; the tiles fly to their docks
    if (t < port1) {
      const u = span(t, port0, port1);
      F.portal(ctx, u, F.KITCHEN.win, (c) => drawKitchen(c, t, false), (c) => drawBlockSpace(c, t), { over: (c) => F.kitchenFrame(c, sineIO(span(u, .1, .75))) });
      const ts = tileState(port0);
      for (let i = 0; i < 3; i++) {
        const s = ts[i]; if (!s) continue;
        const f = sineIO(span(t, port0 + i * .08, port1 - .02 - (2 - i) * .04)), d = dockScreen(t, i);
        const x = lerp(s.x, d[0], f) + Math.sin(Math.PI * f) * 120, y = lerp(s.y, d[1], f) - Math.sin(Math.PI * f) * 160;
        F.tile(ctx, t, s.kind, x, y, lerp(s.w, DW * d[2], f), lerp(s.h, DH * d[2], f), { u: 1, lt: t - a.ill, rot: .15 * Math.sin(Math.PI * f) });
      }
      return;
    }
    // the block space: close-up with the promises, the builders, the heartbeat, SAVE
    drawBlockSpace(ctx, t);
    drawSave(ctx, t);
    drawHand(ctx, t);
    if (t > a.so - .2) {
      drawYouWalk(ctx, t);
      drawQuestion(ctx, t);
    }
    if (t > qOut0) {
      // the question's space takes over the frame bottom-up? no: the block space is already plain night at the heartbeat end (camera far left)
      drawCompare(ctx, t);
      const su = slotU(t);
      if (su > 0 && t < a.c1 - .35) F.slot(ctx, t, SLOT.x, SLOT.y, SLOT.w, SLOT.h, { u: su });
      // the empty word: a gold caret blinks in the slot until DISARMED is typed into it
      const cu = span(t, qOut1 - .1, qOut1 + .2) * (t < a.c1 - .45 || t > a.c1e + .2 ? 1 : 0) * (t < a.dis - .1 ? 1 : 0);
      if (cu > 0) { const bl = .5 + .5 * Math.cos((t - qOut1) * Math.PI * 2 * .9); ctx.save(); ctx.globalAlpha *= cu * (.4 + .6 * bl); ctx.fillStyle = GOLD.body; ctx.shadowColor = rgba(P.halo0, .8); ctx.shadowBlur = 14; ctx.fillRect(SLOT.x - 3, SLOT.y - 46, 6, 92); ctx.restore(); }
      // C1: the slot grows into the clip plate and shrinks back into it
      const m = sineIO(span(t, a.c1 - .4, a.c1 + .45)) * (1 - sineIO(span(t, a.c1e - .45, a.c1e + .25)));
      if (t >= a.c1 - .4 && t < a.c1e + .25) F.clipPlate(ctx, t, T, 'C1', { from: { x: SLOT.x - SLOT.w / 2, y: SLOT.y - SLOT.h / 2, w: SLOT.w, h: SLOT.h }, morph: m });
      if (t >= a.c1e + .25) {
        const sOut = span(t, a.strong - .2, a.strong + .5);   // the slot's frame opens outward and leaves with the word's growth
        if (sOut < 1) { ctx.save(); ctx.translate(SLOT.x, SLOT.y); ctx.scale(1 + sineIO(sOut) * 1.6, 1 + sineIO(sOut) * 2.2); ctx.translate(-SLOT.x, -SLOT.y); F.slot(ctx, t, SLOT.x, SLOT.y, SLOT.w, SLOT.h, { u: 1 }); ctx.restore(); }
        drawNot(ctx, t);
        // DISARMED lives in the plate's creep space from here on, so the seam is exact
        const t0 = S.seamT(T, 'disarmed'), z = 1 + S.CREEP * (t - t0), k = smooth(span(t, a.strong + .3, a.strong + 1.4));
        F.look(ctx, W / 2, H / 2 - 20 * k, lerp(1, z, k), () => drawDisarmed(ctx, t));
        drawQuote(ctx, t);
      }
    }
  };
}
