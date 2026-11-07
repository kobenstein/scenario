// c06 · B2 · 239.02 – 305.88 · 16:00 Dad on the balcony · translation, hearing · the flat that keeps an eye on him · ★ the same earbuds for
// everyone · the price ladder · subscribe line 1 (the rise over the city at dusk) · down into your lit kitchen (→ c07).
// ONE plan sequence along the street in section (docs/shots.md 6.01–6.06):
//   6.01 from plateWindow (Dad's lit window, B1 → B2): pull back and truck down to the street: you walk the last stretch to Dad's
//        building (low gold sun right); crane up the facade to the side balcony: Dad among the tomatoes, the neighbour on the balcony above,
//        both arguing; 'doesn't speak a word': Dad throws up a hand.
//   6.02 the neighbour's speech leaves him as a cool bubble of wave-glyphs, runs down into the cool dot at Dad's ear and comes out on his
//        side as a warm bubble; 'hear it': a faint ragged waveform swells into a full clear one (cards E3 + E4 top-left, HUD).
//   6.03 'nodded along': Dad nods slowly while pale waves die before they reach him; 'interrupts': he leans in, both arms talking; you
//        step out of the balcony door; 'Including you': he turns to you mid-gesture; 'tell him about the scan': your hand rises, drops.
//   6.04 pull back, the facade slides down: Dad's flat in section; 'grew up in': gold height marks glow on the door frame; 'keeps an eye':
//        cool points in the corners, a thin cool line along the floor; 'into a home': a dotted path from his door toward a far care home
//        stops short.
//   6.05 ★ pull back to the whole building in section: the neighbour's flat lights the earbud badge, then the student's (mattress, an
//        empty wallet), then 'everyone in the building': every flat, a wave from the top floor down.
//   6.06 the floors become a ladder (the bright pair only on the top step, price tags); 'Not here': it folds flat, every step bright;
//        'Why not?': the line drops to the street and lights the street lamps; subscribe line 1: a slow rise over the whole city at
//        sunset (the HUD draws the channel mark); the kitchen lamp switches on and the camera comes down into it (shared with c07).
import * as E from '../lib/f10_editorial.mjs';
import * as K from '../lib/f23_kit.mjs';
import { seamT, plateWindow, WINDOW_PLATE } from '../lib/f23_seams.mjs';
import * as B from '../lib/f23_b2.mjs';
const { W, H, P, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, quartIO, rgba, mixHex, rad, lin, camAt, camDrift, halo } = E;
const { ZS, ZB, STREET, floorY, look, wp } = K;
const D = STREET.dad;

export default (T, R) => {
  const A = B.homeAnchors(T);
  const G = (p, after = R.a - .01) => T.G(p, 0, after);
  const T0 = seamT(T, 'window');
  const tTwo = G('two streets away'), tBalc = G('balcony'), tTom = G('tomatoes'), tArab = G('In Arabic'), tWord = G("doesn't speak a word");
  const tTrans = G('translate every sentence'), tHear = G('hear it', tTrans), tNod = G('nodded along'), tInter = G('interrupts people again');
  const tInc = G('Including you'), tTell = G('tell him about the scan'), tGet = G('get a word in'), tEighty = G('eighty-two');
  const tGrew = G('grew up in'), tEye = G('keeps an eye on him'), tHome = G('into a home'), tWay = G('On your way out');
  const tSame = G('same earbuds'), tStud = G('student downstairs'), tBroke = G('always broke'), tEvery = G('everyone in the building');
  const tBest = G('The best version'), tPays = G('whoever pays the most'), tNot = A.tNot, tWhy = A.tWhy, tSub = A.tSub, tSubE = A.tSubE;

  // ---------------------------------------------------------------- the camera (keys on words; ref = the section plane)
  const WIN = look(4748, -1820, ZS, 1.65, WINDOW_PLATE.x, WINDOW_PLATE.y);     // = plateWindow: Dad's lit window
  const STREETW = look(4900, -350, ZS, .3, 900, 760);                          // the street, Dad's building, the low sun, you walking
  const STREETW_IN = look(4912, -352, ZS, .308, 902, 760);
  const BALC = look(6770, -1640, ZS, 1.5, 1180, 640);                          // Dad's balcony and the neighbour's terrace (cards: top-left)
  const BALC_IN = look(6772, -1640, ZS, 1.56, 1182, 642);
  const BALC2 = look(6560, -1655, ZS, 1.75, 1080, 650);                        // Dad and you on his balcony
  const BALC2_IN = look(6562, -1655, ZS, 1.82, 1082, 652);
  const SECT = look(5880, -1790, ZS, .95, 980, 560);                           // Dad's flat in section (room b) + the balcony
  const BLDG = look(5420, -1300, ZS, .345, 1010, 560);                         // the whole building: the diagram
  const BLDG_IN = look(5420, -1300, ZS, .358, 1010, 556);
  const KEYS = [
    [T0 + .55, WIN],
    [tTwo + .4, STREETW, 'l'],           // pull back + truck (3.1 s): the building, the low sun, you on the street
    [tBalc - .3, STREETW_IN],
    [tTom + .7, BALC, 'l'],              // push up the facade onto the balcony (2.5 s)
    [tNod + 1.2, BALC_IN],
    [tInter + .7, BALC2, 'l'],           // closer: Dad and the door you come out of
    [tEighty - .2, BALC2_IN],
    [tGrew - .1, SECT, 'l'],             // 6.04 pull back, the section opens
    [tWay, look(5530, -1764, ZS, .615, 1010, 520)],
    [tSame - .2, BLDG, 'l'],             // 6.05 the whole building
    [tSub - .3, BLDG_IN],
    ...B.homeKeys(A).map((k, i) => i ? k : [k[0], B.HIGH, 'l']),   // subscribe: the rise (≈ 9 s), then down into the kitchen
  ];
  const camOf = (t) => {
    if (t < T0 + .55) return WIN;
    const c = t > A.tSubE + .3 ? B.homeCam(t, A) : camAt(t, KEYS, ZS);   // the descent: shared with c07
    return camDrift(c, t, .45 * span(t, T0 + .6, T0 + 2.5), 23);
  };

  // ---------------------------------------------------------------- you
  const WALK0 = 4260, SPEED = 92;                      // on the near pavement (Z 1800), toward Dad's door
  const youStreet = (ctx, c, t) => {
    if (t > tTom + 1) return;
    const ph = (t - T0) * 2 * Math.PI * .95, x = WALK0 + SPEED * (t - T0);
    K.atZ(ctx, c, 1200, () => K.you(ctx, x, 0, 140, t, { out: true, pose: 'walk', walk: ph, dir: 1, seed: 1, light: 1 }));
  };
  // you come out of the balcony door (6.03), stand by Dad; in 6.05 you go back in and stand in the room under the marks
  const DOOR_X = B.DOOR.x0 + 70, BAL_X = 6455;
  const youBalc = (t) => {
    const out = span(t, tInter - .2, tInc - .25);        // walking out
    const back = span(t, tWay + .1, tWay + 2.2);          // walking back in (room b)
    if (out <= 0) return null;
    const x = back > 0 ? lerp(BAL_X, 6020, sineIO(back)) : lerp(DOOR_X, BAL_X, sineIO(out));
    const walking = (out > 0 && out < 1) || (back > 0 && back < 1);
    const dir = back > 0 ? -1 : 1;
    const raise = Math.min(expoOut(span(t, tTell - .05, tTell + .45)), 1 - quartIO(span(t, tGet, tGet + .6)));
    const look = back >= 1 ? lerp(.15, 1.1, smooth(span(t, tSame - .3, tSame + .3))) * (1 - smooth(span(t, tStud - .2, tStud + .4))) : .35;
    const armR = [lerp(.2, 2.3, raise), lerp(.1, 2.7, raise)];
    return { x, dir, walk: walking ? (t - tInter) * 2 * Math.PI * .95 : undefined, pose: walking ? 'walk' : 'stand', look, armR, inRoom: back > .35 };
  };

  // ---------------------------------------------------------------- Dad and the neighbour
  const talkArm = (t, f, ph) => .5 + .5 * Math.sin(t * f + ph);
  const dadPose = (t) => {
    let armR = [.25, .35], armL = [-.15, -.05], look = .2, lean = 0;
    const argue = span(t, tBalc - .3, tBalc + .3) * (1 - span(t, tTrans - .6, tTrans));
    if (argue > 0) { const a = talkArm(t, 5.3, 0), b = talkArm(t, 4.1, 1.7); armR = [lerp(.25, 1.6 + .5 * a, argue), lerp(.35, 2.0 + .4 * a, argue)]; armL = [lerp(-.15, .9 * b, argue), lerp(-.05, 1.3 * b, argue)]; look = lerp(.2, .3, argue); }
    const up = Math.min(expoOut(span(t, tWord, tWord + .3)), 1 - quartIO(span(t, tWord + 1.1, tWord + 1.8)));   // throws up a hand
    if (up > 0) { armR = [lerp(armR[0], 2.85, up), lerp(armR[1], 3.0, up)]; }
    const nod = span(t, tNod - .2, tNod + .3) * (1 - span(t, tInter - .4, tInter));
    if (nod > 0) look = lerp(look, .12 + .22 * Math.sin((t - tNod) * 2.6), nod);
    const talk = span(t, tInter - .1, tInter + .3) * (1 - span(t, tGet + .4, tGet + 1.2));
    if (talk > 0) { const a = talkArm(t, 6.1, .4), b = talkArm(t, 4.7, 2.2); armR = [lerp(armR[0], 1.3 + .6 * a, talk), lerp(armR[1], 1.8 + .6 * a, talk)]; armL = [lerp(armL[0], 1.0 + .5 * b, talk), lerp(armL[1], 1.5 + .5 * b, talk)]; lean = .12 * talk; look = lerp(look, .3, talk); }
    return { armR, armL, look, lean, eyes: true };
  };
  const nbPose = (t) => {
    const argue = span(t, tBalc - .3, tBalc + .3) * (1 - span(t, tHear, tHear + .8));
    const a = talkArm(t, 4.6, 1), b = talkArm(t, 5.7, 0);
    return argue > 0 ? { armR: [lerp(.3, 1.5 + .6 * a, argue), lerp(.5, 2.1 + .4 * a, argue)], armL: [lerp(.2, .8 + .6 * b, argue), lerp(.4, 1.5 + .5 * b, argue)], lean: .06 + .05 * argue, look: .15 } : {};
  };

  // ---------------------------------------------------------------- the plate window painted on the closed facade (so the plate lands)
  const s0 = 1.65, WP = WINDOW_PLATE;
  const paintWindows = (ctx, fh) => {
    ctx.save(); ctx.beginPath(); ctx.rect(D.x0 - 60, -fh, D.x1 - D.x0 + 120, fh); ctx.clip();
    {   // the plate's dark neighbours' windows (screen (300|1620, 120|760) in plateWindow), so the switch at T0 + .5 matches
      const cx = D.x0 + 180 + 368, cy = floorY(3) - 260;
      ctx.fillStyle = rgba(P.night0, .35);
      for (const [x, y] of [[300, 120], [1620, 120], [300, 760], [1620, 760]]) ctx.fillRect(cx + (x - 110 - WP.x) / s0, cy + (y - WP.y) / s0, 220 / s0, 280 / s0);
    }
    for (const i of [0, 2]) {   // his flat's other two windows stay dark (unlit, as in the plate): the facade's own gradient, then a dark pane
      const cx = D.x0 + 180 + i * 368, cy = floorY(3) - 260, L16 = K.hourLook(16);
      ctx.fillStyle = lin(ctx, 0, floorY(D.floors), 0, 0, [[0, mixHex(P.ind2, L16.top, .25)], [1, mixHex(P.night1, P.night0, .4)]]); ctx.fillRect(cx - 92, cy - 122, 184, 244);
      ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(cx - 85, cy - 115, 170, 230);
    }
    for (let i = 1; i < 2; i++) {   // only Dad's lit window
      const cx = D.x0 + 180 + i * 368, cy = floorY(3) - 260, w = WP.w / s0, h = WP.h / s0, x0 = cx - w / 2, y0 = cy - h / 2;
      ctx.fillStyle = rad(ctx, cx, cy, h * 1.1, [[0, rgba(K.WARM.mid, .45)], [1, rgba(K.WARM.deep, 0)]]); ctx.fillRect(cx - h * 1.1, cy - h * 1.1, h * 2.2, h * 2.2);
      ctx.fillStyle = lin(ctx, 0, y0, 0, y0 + h, [[0, K.WARM.hi], [1, K.WARM.mid]]); ctx.fillRect(x0, y0, w, h);
      ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.fillRect(cx - 5 / s0, y0, 10 / s0, h); ctx.fillRect(x0, y0 + h * .42, w, 10 / s0); ctx.fillRect(x0 - 16 / s0, y0 + h, w + 32 / s0, 16 / s0);
      if (i === 1) { ctx.fillStyle = rgba(K.WARM.deep, .55); ctx.beginPath(); ctx.ellipse(x0 + 60 / s0, y0 + h - 40 / s0, 40 / s0, 70 / s0, 0, 0, 6.29); ctx.fill(); }
    }
    ctx.restore();
  };

  // ---------------------------------------------------------------- 6.04: height marks, the flat's cool watch, the path that stops short
  const MARK_X = 6150;
  const flatItems = (t) => ({
    l3b: [[ZB - 30, (cx) => {
      const y0 = floorY(3), fx = MARK_X;   // a doorframe on the back wall (to the balcony side), the marks on its left jamb
      cx.fillStyle = mixHex(P.night1, P.ind0, .4); cx.fillRect(fx, y0 - 300, 150, 300);
      cx.strokeStyle = mixHex(P.ind2, P.blue1, .5); cx.lineWidth = 12; cx.strokeRect(fx, y0 - 300, 150, 300);
      for (let i = 0; i < 6; i++) {
        const u = expoOut(span(t, tGrew + .05 + i * .16, tGrew + .45 + i * .16)); if (u <= 0) continue;
        const y = y0 - 70 - i * 32, w = 44 * u;
        cx.fillStyle = rgba(P.halo0, .4 * u); cx.fillRect(fx - 10 - w, y - 6, w + 12, 12);
        cx.fillStyle = rgba(P.core1, u); cx.fillRect(fx - 8 - w, y - 2.5, w + 8, 5);
      }
      halo(cx, fx - 30, y0 - 70 - 5 * 32, 30, .6 * expoOut(span(t, tGrew + .9, tGrew + 1.4)) * (1 - span(t, tSame, tSame + 1)));
    }]],
  });
  const watch = (ctx, t) => {   // ZS plane: cool points in the upper corners of both rooms, a thin cool line along the floor
    const u = span(t, tEye, tEye + .5), y0 = floorY(3), yc = floorY(4) + K.SLAB;
    if (u <= 0) return;
    [[D.x0 + 50, yc + 45], [5300 - 40, yc + 45], [5300 + 50, yc + 45], [D.x1 - 50, yc + 45]].forEach(([x, y], i) => K.coolPoint(ctx, x, y, 7, expoOut(span(t, tEye + i * .1, tEye + .4 + i * .1)) * (.7 + .3 * Math.sin(t * 1.7 + i))));
    const L = sineIO(span(t, tEye + .2, tEye + 1.6)), x1 = lerp(D.x0 + 40, D.x1 - 40, L);
    const fade = 1 - span(t, tWay, tWay + 1.2);
    if (fade <= 0) return;
    ctx.strokeStyle = rgba(K.COOL.edge, .35 * fade); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(D.x0 + 40, y0 - 4); ctx.lineTo(x1, y0 - 4); ctx.stroke();
    ctx.strokeStyle = rgba(K.COOL.core, .8 * fade); ctx.lineWidth = 2.5; ctx.stroke();
    if (L < 1) halo(ctx, x1, y0 - 4, 18, .7, K.COOL.mid, K.COOL.core);
  };
  // the care home: a far dark house outline drawn by a cool line; the gold dotted path from Dad's door never reaches it (screen space)
  const careHome = (ctx, c, t) => {
    const u = span(t, tHome - .1, tHome + 1.1), out = span(t, tWay + .2, tWay + .9); if (u <= 0 || out >= 1) return;
    const a = wp(c, D.x1 + 40, floorY(3) - 20, ZS), hb = wp(c, 8100, -2350, 6200); if (!a || !hb) return;
    // the house: a small dark box + roof, its outline drawn on (cool, dim)
    const s = hb[2], hw = 260 * s, hh = 200 * s, hx = hb[0], hy = hb[1];
    const pts = [[hx - hw, hy + hh], [hx - hw, hy], [hx, hy - hh * .8], [hx + hw, hy], [hx + hw, hy + hh]];
    const k = expoOut(span(t, tHome + .1, tHome + 1.0)) * (1 - expoIn(out));
    ctx.save();
    ctx.fillStyle = rgba(P.night0, .85 * Math.min(1, k * 3)); ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
    ctx.save(); ctx.clip(); ctx.fillRect(hx - hw, hy - hh, hw * 2, hh * 2 * k + 1); ctx.restore();
    E.trail(ctx, pts, k, { w: 2, spark: k < 1, a: .55 });
    ctx.restore();
    if (k > .6) K.coolPoint(ctx, hx + hw * .4, hy + hh * .45, 3.5, .5 * span(k, .6, 1));
    // the path: dots along a low arc from Dad's door toward the house; it stops at ~55 % and its last dots shrink
    const n = 26, reach = .55 * sineIO(span(t, tHome + .05, tHome + 1.2)) * (1 - expoIn(out));
    for (let i = 0; i < n; i++) {
      const v = i / n; if (v > reach) break;
      const x = lerp(a[0], hx - hw * 1.3, v), y = lerp(a[1], hy + hh, v) + Math.sin(Math.PI * v) * 60;
      const end = clamp((reach - v) / .12), r = 3.2 * (.4 + .6 * end);
      ctx.fillStyle = rgba(P.core1, .9 * end); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill();
    }
  };

  // ---------------------------------------------------------------- 6.05 ★ the badges, 6.06 the ladder (world units on ZS)
  const FLATS = [];
  for (let l = 4; l >= 0; l--) for (const k of ['a', 'b']) FLATS.push({ l, k, x: k === 'a' ? 4750 : 5850, y: floorY(l) - 300 });
  const firstOn = (f) => (f.l === 4 && f.k === 'b') ? tSame + .05 : (f.l === 1 && f.k === 'a') ? tStud + .1 : tEvery + .05 + (4 - f.l) * .2 + (f.k === 'b' ? .07 : 0);
  // the ladder: step l centred at LX(l), y floorY(l) (stairs to the right) → flat on floorY(2) → down to the street
  const LX = (l) => 4430 + l * 430;
  const ladder = (t) => {
    const merge = quartIO(span(t, tBest + .1, tBest + 1.3));          // the two badges of a floor slide together onto the floor's bar
    const bar = expoOut(span(t, tBest + .2, tBest + 1.2));            // the floors light as bars
    const step = quartIO(span(t, tPays - .3, tPays + .9));            // the bars become steps
    const flat = quartIO(span(t, tNot - .05, tNot + .9));             // 'Not here': fold flat
    const drop = sineIO(span(t, tWhy + .45, tWhy + 1.45));            // the line drops to the street
    return { merge, bar, step, flat, drop };
  };
  const tags = (t, l) => Math.min(expoOut(span(t, tPays + .35 + (4 - l) * .09, tPays + .9 + (4 - l) * .09)), 1 - expoIn(span(t, tNot - .05 + l * .04, tNot + .3 + l * .04)));
  const NB_BADGE = [B.NB_AT[0], B.NB_AT[1] - 250];
  const diagram = (ctx, t) => {
    const Lg = ladder(t);
    // the building recedes while it is a diagram (a night veil over the section, lifted as the line drops)
    const veil = .62 * Lg.bar * (1 - Lg.drop);
    if (veil > 0) { ctx.fillStyle = rgba(P.night0, veil); ctx.fillRect(D.x0 - 50, floorY(5) - 80, D.x1 - D.x0 + 100, -floorY(5) + 80); }
    // the neighbour (next door) first, then the flats
    { const a = span(t, tSame + .05, tSame + .5), out = expoIn(span(t, tBest + .1, tBest + .7)); if (a > 0 && out < 1) B.budBadge(ctx, NB_BADGE[0], NB_BADGE[1], 34, t, a * (1 - out)); }
    for (const f of FLATS) {
      if (f.l === 4 && f.k === 'b') continue;
      const a = span(t, firstOn(f), firstOn(f) + .45); if (a <= 0 || Lg.bar > 0) continue;
      B.budBadge(ctx, f.x, f.y, 34, t, a);
      if (f.l === 1 && f.k === 'a') {   // the student: an empty wallet on 'always broke'
        const w = expoOut(span(t, tBroke, tBroke + .5)); if (w > 0) { ctx.save(); ctx.translate(f.x + 190, f.y + 200); ctx.scale(1, w); ctx.strokeStyle = rgba(P.halo0, .9); ctx.lineWidth = 7; ctx.strokeRect(-50, -32, 100, 64); ctx.beginPath(); ctx.moveTo(-50, -8); ctx.lineTo(50, -8); ctx.stroke(); ctx.restore(); }
      }
    }
    if (Lg.bar <= 0) return;
    const land = span(t, tWhy + 1.35, tWhy + 1.75);      // the dropped line reaches the street: its badges become the street lamps
    if (land >= 1) return;
    for (let l = 0; l < 5; l++) {
      const yFloor = floorY(l), yFlat = floorY(2);
      let y = lerp(yFloor, yFlat, Lg.flat); y = lerp(y, -8, Lg.drop);
      const cxFull = (D.x0 + D.x1) / 2, wFull = D.x1 - D.x0 - 60, wStep = 400;
      const cx = lerp(cxFull, LX(l), Math.max(Lg.step, Lg.flat)), w = lerp(wFull, wStep, Math.max(Lg.step, Lg.flat)) * Lg.bar * (1 - expoIn(land));
      const dim = Lg.step * (1 - Lg.flat) * (1 - l / 4) * .85;     // the usual way: dimmer each step down
      const lit = 1 - dim;
      ctx.fillStyle = rgba(P.halo0, .3 * lit); ctx.fillRect(cx - w / 2, y - 26, w, 34);
      ctx.fillStyle = rgba(mixHex(P.blue1, P.core1, lit), .95); ctx.fillRect(cx - w / 2, y - 14, w, 14);
      const bx = cx, by = y - 120;
      const fa = FLATS.find((f) => f.l === l && f.k === 'a'), fb = FLATS.find((f) => f.l === l && f.k === 'b');
      if (Lg.merge < 1) { for (const f of l === 4 ? [fa] : [fa, fb]) B.budBadge(ctx, lerp(f.x, bx, Lg.merge), lerp(f.y, by, Lg.merge), 34, t, 1); }
      else B.budBadge(ctx, bx, by + 60 * Lg.drop, 34 * (1 + .3 * Lg.step * (1 - Lg.flat) * (l / 4)) * (1 - expoIn(land)), t, 1, dim);
      const tg = tags(t, l); if (tg > 0) K.priceTag(ctx, cx - w / 2 + 50, y + 2, 80 + l * 26, tg);
    }
  };

  // ---------------------------------------------------------------- the world state over time
  const dadOpen = (t) => smooth(span(t, tEighty - .2, tGrew - .2));     // the facade slides down (heavy, ≈ 2.3 s)
  const stateAt = (t) => {
    const hour = B.hourAt(t, A), open = dadOpen(t), k = span(t, tBest + .1, tBest + 1);
    const dimRooms = 1 - .7 * k * (1 - span(t, tWhy + .5, tWhy + 2.5));
    const rooms = Object.fromEntries(Object.entries(B.dadRooms(span(t, tWay, tWay + 1.5))).map(([kk, v]) => [kk, v * dimRooms]));
    return { hour, open, rooms, lampDad: .85 * dimRooms };
  };
  const draw = (ctx, t) => {
    if (t < T0 + .5) { plateWindow(ctx, t); return; }
    if (t >= A.tSubE + .3) { B.homeWorld(ctx, camOf(t), t, A); return; }
    const c = camOf(t), S = stateAt(t);
    const yb = youBalc(t), turn = sineIO(span(t, tInc - .25, tInc + .2));
    const fh = -floorY(D.floors) * (1 - smooth(S.open)) + 70;
    const street = expoOut(span(t, tWhy + 1.45, tWhy + 1.85));
    K.world(ctx, c, t, {
      hour: S.hour,
      lamps: Math.max(street, clamp((S.hour - 17.6) / .6)),
      you: { hallLamp: 0, rooms: B.YOUR_ROOMS, kid: { asleep: false, lamp: 0 }, kitchen: { lamp: 0, wall: 0, scan: null, phone: null } },
      dad: { open: S.open, lamp: S.lampDad, rooms: S.rooms, items: flatItems(t) },
      over: (cx) => {
        if (S.open < 1) { paintWindows(cx, fh); cx.save(); cx.beginPath(); cx.rect(D.x0 - 60, -fh, D.x1 - D.x0 + 120, fh); cx.clip(); B.balconyDoor(cx, span(t, tInter - .5, tInter)); cx.restore(); }
        const youIn = (q) => K.you(cx, q.x, floorY(3), 140, t, { pose: q.pose, walk: q.walk, dir: q.dir, look: q.look, armR: q.armR, seed: 1 });
        B.dadBalconies(cx, t, {
          dad: dadPose(t), nb: nbPose(t), dadTurn: turn,
          before: (q2) => { if (yb && yb.inRoom) youIn(yb); },
          after: (q2) => { if (yb && !yb.inRoom) { if (S.open < 1 && yb.x < B.DOOR.x1) { q2.save(); q2.beginPath(); q2.rect(B.DOOR.x0, floorY(3) - 400, 1000, 400); q2.clip(); youIn(yb); q2.restore(); } else youIn(yb); } },
        });
        watch(cx, t);
        diagram(cx, t);
      },
    });
    youStreet(ctx, c, t);
    // 6.02: the neighbour's speech → cool bubble → the earbud dot at Dad's ear → a warm bubble on his side; the waveform swells
    const ear = wp(c, DAD_EAR()[0], DAD_EAR()[1], ZS), mouth = wp(c, B.NB_AT[0] - 18, B.NB_AT[1] - 122, ZS);
    if (ear && mouth && t > tTrans - .9 && t < tNod + .8) {
      const s = ear[2], gone = expoIn(span(t, tNod - .2, tNod + .6));
      const go = sineIO(span(t, tTrans - .7, tTrans + .5));                          // the cool bubble leaves him and runs to the ear
      const bx = lerp(mouth[0] - 70 * s, ear[0] + 40 * s, go), by = lerp(mouth[1] - 10 * s, ear[1] - 40 * s, go) - Math.sin(Math.PI * go) * 40 * s;
      const shrink = 1 - expoIn(span(t, tTrans + .35, tTrans + .7));
      if (shrink > 0) K.bubble(ctx, bx, by, 34 * s * shrink, t, { u: span(t, tTrans - .8, tTrans - .4), cool: true, tail: -1 });
      const warm = span(t, tTrans + .55, tTrans + 1.0) * (1 - gone);
      if (warm > 0) K.bubble(ctx, ear[0] - 95 * s, ear[1] - 55 * s, 40 * s, t, { u: warm, tail: -1 });
      const wv = expoOut(span(t, tHear - .1, tHear + .9)), wa = span(t, tHear - .6, tHear - .3) * (1 - gone);
      if (wa > 0) B.waveform(ctx, ear[0] - 230 * s, ear[0] - 30 * s, ear[1] + 30 * s, lerp(5, 22, wv) * s, t, wv, P.core1, lerp(1.5, 3.2, wv));
      halo(ctx, ear[0], ear[1], 18 * s, .7 * span(t, tTrans + .2, tTrans + .45) * (1 - span(t, tTrans + .6, tTrans + 1.2)), K.COOL.mid, K.COOL.core);
    }
    // 6.03: the years he couldn't hear: pale waves from the neighbour that die before they reach Dad
    if (ear && mouth && t > tNod - .3 && t < tInter + .6) {
      const fade = span(t, tNod - .3, tNod + .2) * (1 - span(t, tInter, tInter + .6)), s = ear[2];
      for (let i = 0; i < 4; i++) {
        const ph = ((t - tNod) * .55 + i / 4) % 1; if (ph < 0) continue;
        const x = lerp(mouth[0] - 30 * s, ear[0] + 10 * s, ph * .7), y = lerp(mouth[1] + 20 * s, ear[1] - 20 * s, ph * .7), r = (24 + 70 * ph) * s;
        ctx.strokeStyle = rgba(P.halo2, .5 * fade * (1 - ph) ** 1.5); ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(x, y, r, Math.PI * .78, Math.PI * 1.22); ctx.stroke();
      }
    }
    careHome(ctx, c, t);
  };
  const DAD_EAR = () => [B.DAD_AT[0] + 145 * .05, B.DAD_AT[1] - 145 * .88];
  return [{ t: R.a, draw }];
};
