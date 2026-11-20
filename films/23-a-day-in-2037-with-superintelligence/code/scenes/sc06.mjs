// c06 · B2 · 239.02 – 305.88 · 16:00 Dad in his COURTYARD in afternoon daylight (rework 2026-11-09: Jakob wants the day alive).
// ONE plan sequence (docs/shots.md 6.01–6.06, re-staged in the yard; every word anchor kept):
//   6.01 from plateWindow: Dad's warm window in his sunny facade (the facade IS the plate's content, so the B1 → B2 seam lands exactly); pull back and truck down to the street: you walk the two streets (a shuttle passes, a delivery robot heads for the
//        yard); on 'balcony' crane down into the sunny yard right of his building: Dad on the low terrace, the shared tomato bed, the
//        neighbour behind it, kids with a ball, the robot at the neighbour's door; 'tomatoes': Dad's bubble (a gold tomato in it); 'In
//        Arabic': the neighbour answers in looped script; 'doesn't speak a word': Dad throws up a hand.
//   6.02 'translate every sentence': the neighbour's bubble flies to Dad's ear, flashes cool at the earbud and switches script (loops →
//        Dad's dashes, cool → warm); 'hear it': a ragged faint waveform swells into a clear one (cards E3 + E4 top-left, HUD).
//   6.03 'nodded along': Dad nods while pale waves die short of him; 'interrupts': he leans in, both arms talking, his bubbles fly to the
//        neighbour and switch to loops at the neighbour's earbud; you come into the yard; 'Including you': he turns to you mid-gesture;
//        'tell him about the scan': your hand rises and your own little bubble (the gold scan dot) starts; 'get a word in': his next bubble
//        pops and yours shrinks back, your hand drops.
//   6.04 crane up the facade, it slides down: Dad's flat in section (level 3) above the yard; 'grew up in': gold height marks on the door
//        frame; 'keeps an eye': cool points in the corners, a thin cool line along the floor; 'into a home': the dotted path from his
//        door toward a far care home stops short.
//   6.05 ★ pull back to the whole building + the yard: 'On your way out' you walk to the house door; 'same earbuds' you look back: the
//        neighbour in the yard lights the earbud badge; 'student downstairs' (you go in): a flat below lights it (mattress, the empty
//        wallet on 'always broke'); 'everyone in the building': every flat, a wave from the top floor down.
//   6.06 the floors become a ladder (the bright pair only on the top step, price tags); 'Not here': it folds flat, every step bright;
//        'Why not?': the line drops to the street and lights the lamps; subscribe line 1: the slow rise over the whole city as the sun
//        sets (HUD: channel mark); then down toward your kitchen (B.homeCam / B.homeWorld, shared with c07; the yard leaves the frame on
//        the right before 305.88, so the c07 frame is identical).
import * as E from '../lib/f10_editorial.mjs';
import * as K from '../lib/f23_kit.mjs';
import { seamT, plateWindow, WINDOW_PLATE } from '../lib/f23_seams.mjs';
import * as B from '../lib/f23_b2.mjs';
import * as C from '../lib/f23_b2_courtyard.mjs';
import * as S from '../lib/f23_street.mjs';
const { W, H, P, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, quartIO, rgba, mixHex, camAt, camDrift, halo } = E;
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
  const tBest = G('The best version'), tPays = G('whoever pays the most'), tNot = A.tNot, tWhy = A.tWhy, tSub = A.tSub;

  // ---------------------------------------------------------------- the camera (keys on words)
  const WIN = look(4748, -1820, ZS, 1.65, WINDOW_PLATE.x, WINDOW_PLATE.y);     // = plateWindow: Dad's warm window
  const STREETW = look(5650, -760, ZS, .315, 860, 610);                        // the street in the sun, Dad's building, the yard, you walking
  const STREETW_IN = look(5700, -740, ZS, .325, 860, 612);
  const COURT = look(6800, -250, 2950, .98, 960, 640);                         // the yard: terrace, bed, neighbour, kids, robot
  const COURT_IN = look(6800, -240, 2950, 1.03, 962, 642);
  const TALK = look(6700, -150, 2900, 1.7, 960, 620);                          // Dad and the neighbour (cards top-left)
  const TALK_IN = look(6698, -150, 2900, 1.77, 962, 622);
  const TALK2 = look(6520, -150, 2930, 1.9, 960, 630);                        // Dad and you
  const TALK2_IN = look(6520, -150, 2930, 1.96, 962, 632);
  const SECT = look(5880, -1790, ZS, .95, 980, 560);                           // Dad's flat in section
  const SECT_OUT = look(5530, -1764, ZS, .615, 1010, 520);
  const BLDG = look(6100, -1290, ZS, .3, 960, 510);                            // the whole building + the yard: the diagram
  const BLDG_IN = look(6100, -1290, ZS, .312, 960, 506);
  const KEYS = [
    [T0, WIN],
    [tTwo + 1.3, STREETW, 's'],          // pull back + truck down (≈ 3.7 s)
    [tBalc + .2, STREETW_IN],
    [tArab + .4, COURT, 's'],            // down into the yard (≈ 3.3 s)
    [tWord + 1.2, COURT_IN],
    [tTrans + 1.4, TALK, 's'],           // in to the two (the bubble's flight)
    [tNod + 2.2, TALK_IN],
    [tInc + .3, TALK2, 'l'],             // Dad turns to you
    [tEighty - .6, TALK2_IN],
    [tGrew + .4, SECT, 's'],             // 6.04 crane up to his flat as the facade slides down (≈ 3.2 s)
    [tWay, SECT_OUT],
    [tSame - .2, BLDG, 'l'],             // 6.05 the whole building and the yard
    [tSub - .3, BLDG_IN],
    ...B.homeKeys(A).map((k, i) => i ? k : [k[0], B.HIGH, 'l']),   // subscribe: the rise (≈ 9.6 s), then down into the kitchen
  ];
  const camOf = (t) => {
    if (t < T0) return WIN;
    const c = t > A.tSubE + .3 ? B.homeCam(t, A) : camAt(t, KEYS, ZS);
    return camDrift(c, t, .45 * Math.sqrt(span(t, T0, T0 + 2.5)), 23);
  };


  // ---------------------------------------------------------------- street life (6.01): the shuttle passes, the robot heads for the yard
  const ZWALK = 2060, ZBUS = 2230;
  const shuttleX = (t) => 7700 - 330 * (t - T0);                        // right → left on the far lane, toward you, slow
  const robotAt = (t) => {   // along the pavement into the yard, to the neighbour's door; waits (lid open); leaves to the right
    const k1 = sineIO(span(t, T0, tArab + .6)), back = sineIO(span(t, tGet + 1.2, tWay + 1.5));
    const pts = [[5200, 2460], [6500, 2560], [7800, 2850], [C.NB_DOOR - 100, 2965]];
    const seg = (u) => { const f = u * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(f)), v = f - i; return [lerp(pts[i][0], pts[i + 1][0], v), lerp(pts[i][1], pts[i + 1][1], v)]; };
    let [x, z] = seg(k1), dir = 1;
    if (back > 0) { x = lerp(x, 9200, back); z = lerp(z, 2800, back); }
    const lid = Math.min(expoOut(span(t, tArab + 1.2, tArab + 1.8)), 1 - expoIn(span(t, tInter, tInter + .6)));
    return { x, z, dir, lid, roll: x * .9 };
  };

  // ---------------------------------------------------------------- you
  const WALK0 = 4150, SPEED = 96;
  const youStreetX = (t) => WALK0 + SPEED * (t - T0);
  const youYard = (t) => {   // into the yard (6.03), stand by the terrace; 6.05 walk to the house door, look back, go in
    const inn = span(t, tInter - .9, tInc - .3); if (inn <= 0) return null;
    const out = span(t, tWay + .1, tSame - .5), go = span(t, tStud - .3, tStud + 1.6);
    if (go >= 1) return null;
    let x = lerp(5980, C.YOU_YARD[0], sineIO(inn)), z = C.YOU_YARD[2];
    if (out > 0) { x = lerp(C.YOU_YARD[0], 6215, sineIO(out)); z = lerp(C.YOU_YARD[2], 2985, sineIO(out)); }
    if (go > 0) { z = lerp(2985, 3140, sineIO(go)); x = lerp(6215, 6120, sineIO(span(go, .45, 1))); }
    const walking = (inn > 0 && inn < 1) || (out > 0 && out < 1) || (go > 0 && go < 1);
    const lookBack = Math.min(smooth(span(t, tSame - .45, tSame + .1)), 1 - smooth(span(t, tStud - .4, tStud)));
    const dir = go > 0 ? -1 : out > 0 && out < 1 ? -1 : lookBack > .5 ? 1 : out >= 1 ? -1 : 1;
    const raise = Math.min(expoOut(span(t, tTell - .05, tTell + .45)), 1 - quartIO(span(t, tGet, tGet + .6)));
    const armR = [lerp(.2, 2.3, raise), lerp(.1, 2.7, raise)];
    return { x, z, dir, walk: walking ? (t - tInter) * 2 * Math.PI * .95 : undefined, pose: walking ? 'walk' : 'stand', look: .35 + .3 * lookBack, armR, inDoor: go > 0 };
  };

  // ---------------------------------------------------------------- Dad and the neighbour
  const talkArm = (t, f, ph) => .5 + .5 * Math.sin(t * f + ph);
  const dadPose = (t) => {
    let armR = [.25, .35], armL = [-.15, -.05], look = .2, lean = 0;
    const argue = span(t, tBalc - .3, tBalc + .3) * (1 - span(t, tTrans - .6, tTrans));
    if (argue > 0) { const a = talkArm(t, 5.3, 0), b = talkArm(t, 4.1, 1.7); armR = [lerp(.25, 1.6 + .5 * a, argue), lerp(.35, 2.0 + .4 * a, argue)]; armL = [lerp(-.15, .9 * b, argue), lerp(-.05, 1.3 * b, argue)]; look = lerp(.2, .3, argue); }
    const up = Math.min(expoOut(span(t, tWord, tWord + .3)), 1 - quartIO(span(t, tWord + 1.1, tWord + 1.8)));   // throws up a hand
    if (up > 0) armR = [lerp(armR[0], 2.85, up), lerp(armR[1], 3.0, up)];
    const nod = span(t, tNod - .2, tNod + .3) * (1 - span(t, tInter - .4, tInter));
    if (nod > 0) look = lerp(look, .12 + .22 * Math.sin((t - tNod) * 2.6), nod);
    const talk = span(t, tInter - .1, tInter + .3) * (1 - span(t, tGet + .9, tGet + 1.8));
    if (talk > 0) { const a = talkArm(t, 6.1, .4), b = talkArm(t, 4.7, 2.2); armR = [lerp(armR[0], 1.3 + .6 * a, talk), lerp(armR[1], 1.8 + .6 * a, talk)]; armL = [lerp(armL[0], 1.0 + .5 * b, talk), lerp(armL[1], 1.5 + .5 * b, talk)]; lean = .12 * talk; look = lerp(look, .3, talk); }
    return { armR, armL, look, lean, eyes: true };
  };
  const nbPose = (t) => {
    const argue = span(t, tBalc - .3, tBalc + .3) * (1 - span(t, tHear, tHear + .8));
    const a = talkArm(t, 4.6, 1), b = talkArm(t, 5.7, 0);
    const base = { dir: -1, look: .1, lean: .06, armR: [.3, .5], armL: [.2, .4] };
    if (argue > 0) return { ...base, armR: [lerp(.3, 1.5 + .6 * a, argue), lerp(.5, 2.1 + .4 * a, argue)], armL: [lerp(.2, .8 + .6 * b, argue), lerp(.4, 1.5 + .5 * b, argue)], lean: .06 + .05 * argue, look: .15 };
    return base;
  };
  const DH = 145, NH = 138;
  const turnAt = (t) => sineIO(span(t, tInc - .25, tInc + .2)) * (1 - sineIO(span(t, tWay + .4, tWay + 1.2)));
  const dadEar = (t) => { const d = turnAt(t) > .5 ? -1 : 1; return [C.DAD_YARD[0] + d * DH * .045, C.DAD_YARD[1] - DH * .88, C.DAD_YARD[2]]; };
  const nbEar = () => [C.NB_YARD[0] - NH * .045, -NH * .88, C.NB_YARD[2]];
  const youHead = (t, y) => [y.x, -140 * .92, y.z];
  const drawDad = (cx, t) => {
    const dp = { seed: 3, dir: 1, ...dadPose(t) }, turn = turnAt(t), [x, y] = C.DAD_YARD;
    if (turn > 0 && turn < 1) { const k = Math.cos(Math.PI * turn); cx.save(); cx.translate(x, 0); cx.scale(Math.sign(k || 1) * Math.max(.08, Math.abs(k)), 1); K.dad(cx, 0, y, DH, t, dp); cx.restore(); }
    else K.dad(cx, x, y, DH, t, { ...dp, dir: turn >= 1 ? -1 : 1 });
  };
  const drawNb = (cx, t) => {
    const p = nbPose(t), [x] = C.NB_YARD;
    K.other(cx, x, 0, NH, t, { seed: 6, long: true, ...p });
    const e = nbEar(); K.coolPoint(cx, e[0], e[1] + 2, 1.3, 1);   // he wears the same earbuds
  };
  const drawKids = (cx, t) => {
    const b = C.ballAt(t);
    C.KIDS.forEach(([x], i) => {
      const kick = i ? b.kickR : b.kickL, d = i ? -1 : 1;
      K.other(cx, x, 0, 92 + i * 8, t, { seed: 8 + i, dir: d, look: .25, lean: -.06 * kick, armR: [.35 + .3 * kick, .4], armL: [-.3 - .2 * kick, -.1], light: 1 });
    });
  };

  // ---------------------------------------------------------------- 6.04: height marks, the flat's cool watch, the path that stops short
  const MARK_X = 6150;
  const flatItems = (t) => ({
    l3b: [[ZB - 30, (cx) => {
      const y0 = floorY(3), fx = MARK_X;
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
  const careHome = (ctx, c, t) => {
    const u = span(t, tHome - .1, tHome + 1.1), out = span(t, tWay + .2, tWay + .9); if (u <= 0 || out >= 1) return;
    const a = wp(c, D.x1 + 40, floorY(3) - 20, ZS), hb = wp(c, 8100, -2350, 6200); if (!a || !hb) return;
    const s = hb[2], hw = 260 * s, hh = 200 * s, hx = hb[0], hy = hb[1];
    const pts = [[hx - hw, hy + hh], [hx - hw, hy], [hx, hy - hh * .8], [hx + hw, hy], [hx + hw, hy + hh]];
    const k = expoOut(span(t, tHome + .1, tHome + 1.0)) * (1 - expoIn(out));
    ctx.save();
    ctx.fillStyle = rgba(P.night0, .85 * Math.min(1, k * 3)); ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
    ctx.save(); ctx.clip(); ctx.fillRect(hx - hw, hy - hh, hw * 2, hh * 2 * k + 1); ctx.restore();
    E.trail(ctx, pts, k, { w: 2, spark: k < 1, a: .55 });
    ctx.restore();
    if (k > .6) K.coolPoint(ctx, hx + hw * .4, hy + hh * .45, 3.5, .5 * span(k, .6, 1));
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
  const firstOn = (f) => (f.l === 1 && f.k === 'a') ? tStud + .1 : tEvery + .05 + (4 - f.l) * .2 + (f.k === 'b' ? .07 : 0);
  const LX = (l) => 4430 + l * 430;
  const ladder = (t) => ({
    merge: quartIO(span(t, tBest + .1, tBest + 1.3)), bar: expoOut(span(t, tBest + .2, tBest + 1.2)), step: quartIO(span(t, tPays - .3, tPays + .9)),
    flat: quartIO(span(t, tNot - .05, tNot + .9)), drop: sineIO(span(t, tWhy + .45, tWhy + 1.45)),
  });
  const tags = (t, l) => Math.min(expoOut(span(t, tPays + .35 + (4 - l) * .09, tPays + .9 + (4 - l) * .09)), 1 - expoIn(span(t, tNot - .05 + l * .04, tNot + .3 + l * .04)));
  const NB_BADGE = [C.NB_YARD[0], -NH - 170];
  const diagram = (ctx, t, L) => {
    const Lg = ladder(t);
    const veil = .5 * Lg.bar * (1 - Lg.drop);   // the building recedes while it is a diagram (a shade over the section, lifted as the line drops)
    if (veil > 0) { ctx.fillStyle = rgba(mixHex(P.night1, P.ind1, .4), veil); ctx.fillRect(D.x0 - 50, floorY(5) - 80, D.x1 - D.x0 + 100, -floorY(5) + 80); }
    { const a = span(t, tSame + .05, tSame + .5), out = expoIn(span(t, tBest + .1, tBest + .7)); if (a > 0 && out < 1) B.budBadge(ctx, NB_BADGE[0], NB_BADGE[1], 46, t, a * (1 - out)); }
    for (const f of FLATS) {
      const a = span(t, firstOn(f), firstOn(f) + .45); if (a <= 0 || Lg.bar > 0) continue;
      B.budBadge(ctx, f.x, f.y, 34, t, a);
      if (f.l === 1 && f.k === 'a') {
        const w = expoOut(span(t, tBroke, tBroke + .5)); if (w > 0) { ctx.save(); ctx.translate(f.x + 190, f.y + 200); ctx.scale(1, w); ctx.strokeStyle = rgba(P.halo0, .9); ctx.lineWidth = 7; ctx.strokeRect(-50, -32, 100, 64); ctx.beginPath(); ctx.moveTo(-50, -8); ctx.lineTo(50, -8); ctx.stroke(); ctx.restore(); }
      }
    }
    if (Lg.bar <= 0) return;
    const land = span(t, tWhy + 1.35, tWhy + 1.75);
    if (land >= 1) return;
    for (let l = 0; l < 5; l++) {
      const yFloor = floorY(l), yFlat = floorY(2);
      let y = lerp(yFloor, yFlat, Lg.flat); y = lerp(y, -8, Lg.drop);
      const cxFull = (D.x0 + D.x1) / 2, wFull = D.x1 - D.x0 - 60, wStep = 400;
      const cx = lerp(cxFull, LX(l), Math.max(Lg.step, Lg.flat)), w = lerp(wFull, wStep, Math.max(Lg.step, Lg.flat)) * Lg.bar * (1 - expoIn(land));
      const dim = Lg.step * (1 - Lg.flat) * (1 - l / 4) * .85, lit = 1 - dim;
      ctx.fillStyle = rgba(P.halo0, .3 * lit); ctx.fillRect(cx - w / 2, y - 26, w, 34);
      ctx.fillStyle = rgba(mixHex(P.blue1, P.core1, lit), .95); ctx.fillRect(cx - w / 2, y - 14, w, 14);
      const bx = cx, by = y - 120;
      const fa = FLATS.find((f) => f.l === l && f.k === 'a'), fb = FLATS.find((f) => f.l === l && f.k === 'b');
      if (Lg.merge < 1) { for (const f of [fa, fb]) B.budBadge(ctx, lerp(f.x, bx, Lg.merge), lerp(f.y, by, Lg.merge), 34, t, 1); }
      else B.budBadge(ctx, bx, by + 60 * Lg.drop, 34 * (1 + .3 * Lg.step * (1 - Lg.flat) * (l / 4)) * (1 - expoIn(land)), t, 1, dim);
      const tg = tags(t, l); if (tg > 0) K.priceTag(ctx, cx - w / 2 + 50, y + 2, 80 + l * 26, tg);
    }
  };

  // ---------------------------------------------------------------- the world state over time
  const dadOpen = (t) => smooth(span(t, tEighty - .2, tGrew - .2));     // the facade slides down (heavy, ≈ 2.3 s)
  const stateAt = (t) => {
    const k = span(t, tBest + .1, tBest + 1), dimRooms = 1 - .7 * k * (1 - span(t, tWhy + .5, tWhy + 2.5));
    const rooms = Object.fromEntries(Object.entries(B.dadRooms(span(t, tWay, tWay + 1.5))).map(([kk, v]) => [kk, v * dimRooms]));
    return { open: dadOpen(t), rooms, lampDad: .85 * dimRooms };
  };
  const people = (t) => {
    const out = [
      [C.DAD_YARD[2], (cx) => drawDad(cx, t), [C.DAD_YARD[0], 22, 230, C.TERR.y]],
      [C.NB_YARD[2], (cx) => drawNb(cx, t), [C.NB_YARD[0], 22, 260]],
      [C.KIDS[0][1] + 10, (cx) => drawKids(cx, t), null],
    ];
    const y = youYard(t);
    if (y) {
      const fn = (cx) => {
        const draw = () => K.you(cx, y.x, 0, 140, t, { out: true, pose: y.pose, walk: y.walk, dir: y.dir, look: y.look, armR: y.armR, seed: 1 });
        if (!y.inDoor) { draw(); return; }
        cx.save(); cx.beginPath(); cx.rect(6215 - 60, -250, 120, 260); cx.clip(); draw();   // seen only through the doorway, then gone
        cx.fillStyle = rgba(mixHex(K.DAYC ? K.DAYC.glass : P.ind1, P.night1, .3), .55 * span(y.z, 3000, 3140)); cx.fillRect(6215 - 60, -250, 120, 250); cx.restore();
      };
      out.push([y.z, fn, y.inDoor ? null : [y.x, 20, 240]]);
    }
    return out;
  };
  const OVER = (t, c, L, S0) => (cx) => {
    if (S0.open < 1) C.dadFacade(cx, t, L, { fh: -floorY(D.floors) * (1 - smooth(S0.open)) + 70 });
    watch(cx, t);
    C.courtyard(cx, c, t, L, { people: people(t), robot: t < tWay + 1.5 ? robotAt(t) : null });
    diagram(cx, t, L);
  };
  const draw = (ctx, t) => {
    if (t < T0) { plateWindow(ctx, t); return; }   // (never in this chunk) from T0 the world itself IS the plate: same camera, the facade = plateWindowContent
    const c = camOf(t), S0 = stateAt(t), hour = B.hourAt(t, A), L = K.hourLook(hour);
    const street = expoOut(span(t, tWhy + 1.45, tWhy + 1.85));
    if (t >= A.tSubE + .3) { B.homeWorld(ctx, c, t, A, { over: OVER(t, c, L, S0) }); return; }   // = c07's world + the yard (off frame by 305.88)
    B.homeWorld(ctx, c, t, A, {
      lamps: Math.max(street, clamp((hour - 17.6) / .6)),
      dad: { open: S0.open, lamp: S0.lampDad, rooms: S0.rooms, items: flatItems(t) },
      over: OVER(t, c, L, S0),
    });
    // 6.01 on the street: the shuttle (far lane), you walking (near pavement)
    if (t < tArab + 2) {
      K.atZ(ctx, c, ZBUS, () => S.shuttle(ctx, shuttleX(t), 0, 1, t, { dir: -1, riders: 2, roll: shuttleX(t), day: L.day }));
      K.atZ(ctx, c, ZWALK, () => { K.you(ctx, youStreetX(t), 0, 140, t, { out: true, pose: 'walk', walk: (t - T0) * 2 * Math.PI * .95, dir: 1, seed: 1, light: 1 }); });
    }
    speech(ctx, c, t);
    careHome(ctx, c, t);
  };

  // ---------------------------------------------------------------- speech: bubbles in two scripts, switched at the earbuds
  const P2 = (c, p) => wp(c, p[0], p[1], p[2]);
  const speech = (ctx, c, t) => {
    if (t < tTom - .5 || t > tWay + .5) return;
    const de = P2(c, dadEar(t)), ne = P2(c, nbEar()); if (!de || !ne) return;
    const s = de[2], r = 40 * s;
    const dHead = [de[0] + 10 * s, de[1] - 70 * s], nHead = [ne[0] - 20 * s, ne[1] - 70 * s];
    const gone = (t0, d = .35) => 1 - expoIn(span(t, t0, t0 + d));
    // 'tomatoes': Dad's bubble with a gold tomato among his dashes
    { const u = span(t, tTom - .1, tTom + .4) * gone(tArab + .2); if (u > 0) { C.glyphBubble(ctx, dHead[0] + 40 * s, dHead[1] - 10 * s, r, t, { u, a: 1, k: span(t, tTom, tTom + .8), tail: -1 }); ctx.fillStyle = K.WARM.mid; ctx.beginPath(); ctx.arc(dHead[0] + 40 * s + r * .95, dHead[1] - 10 * s - r * .1, r * .26 * expoOut(u), 0, 6.29); ctx.fill(); } }
    // 'In Arabic': the neighbour answers in looped script; it hangs there, untranslated ('doesn't speak a word'); 'translate': it flies to
    // Dad's ear, flashes cool at the earbud and switches script; lands warm by Dad; holds through 'hear it'
    const nb0 = [nHead[0] - 30 * s, nHead[1] - 10 * s];
    { const u = span(t, tArab - .1, tArab + .4), fly = sineIO(span(t, tTrans - .5, tTrans + .5)), sw = span(t, tTrans - .05, tTrans + .45);
      const land = [dHead[0] + 75 * s, dHead[1] - 5 * s], x = lerp(nb0[0], land[0], fly), y = lerp(nb0[1], land[1], fly) - Math.sin(Math.PI * fly) * 60 * s;
      const shrink = fly > 0 && fly < 1 ? 1 - .35 * Math.sin(Math.PI * fly) : 1, g = gone(tNod - .1, .5);
      if (u > 0 && g > 0) C.glyphBubble(ctx, x, y, r * 1.1 * shrink, t, { u: u * g, a: 0, b: 1, mix: sw, k: span(t, tArab, tArab + 1), warm: sw, tail: -1 });
      if (fly > 0 && fly < 1) halo(ctx, de[0], de[1], 16 * s, .8 * Math.sin(Math.PI * fly), K.COOL.mid, K.COOL.core);
      const ext = Math.min(expoOut(span(t, tWord - .1, tWord + .3)), 1 - expoIn(span(t, tWord + 1, tWord + 1.5)));   // 'doesn't speak a word': a small '?'
      if (ext > 0) { ctx.save(); ctx.font = `italic ${Math.round(46 * s * ext)}px "Instrument Serif"`; ctx.fillStyle = rgba(P.cream, .95); ctx.textAlign = 'center'; ctx.fillText('?', dHead[0] - 10 * s, dHead[1] - 40 * s); ctx.restore(); }
    }
    // 'hear it': the faint ragged waveform at his ear swells into a full clear one
    { const wv = expoOut(span(t, tHear - .1, tHear + .9)), wa = span(t, tHear - .6, tHear - .3) * gone(tNod - .2, .6);
      if (wa > 0) B.waveform(ctx, de[0] - 210 * s, de[0] - 25 * s, de[1] + 34 * s, lerp(5, 20, wv) * s, t, wv, P.core1, lerp(1.5, 3.2, wv)); }
    // 'nodded along': the years he couldn't hear: pale waves from the neighbour that die before they reach him
    if (t > tNod - .3 && t < tInter + .6) {
      const fade = span(t, tNod - .3, tNod + .2) * (1 - span(t, tInter, tInter + .6));
      for (let i = 0; i < 4; i++) {
        const ph = ((t - tNod) * .55 + i / 4) % 1; if (ph < 0) continue;
        const x = lerp(ne[0] - 30 * s, de[0] + 10 * s, ph * .7), y = lerp(ne[1] + 20 * s, de[1] - 20 * s, ph * .7), rr = (24 + 70 * ph) * s;
        ctx.strokeStyle = rgba(P.cream, .55 * fade * (1 - ph) ** 1.5); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(x, y, rr, Math.PI * 1.78, Math.PI * 2.22); ctx.stroke();
      }
    }
    // 'interrupts': his bubbles fly to the neighbour and switch to loops at the neighbour's earbud
    for (const [t0, k] of [[tInter + .05, 0], [tInter + .75, 1]]) {
      const u = span(t, t0, t0 + .3), fly = sineIO(span(t, t0 + .35, t0 + 1.25)), sw = span(t, t0 + .95, t0 + 1.3), g = gone(t0 + 2.2, .4);
      if (u <= 0 || g <= 0) continue;
      const a0 = [dHead[0] + 45 * s, dHead[1] - (10 + 30 * k) * s], a1 = [nHead[0] - 40 * s, nHead[1] - (20 + 30 * k) * s];
      const x = lerp(a0[0], a1[0], fly), y = lerp(a0[1], a1[1], fly) - Math.sin(Math.PI * fly) * 40 * s;
      C.glyphBubble(ctx, x, y, r * .85, t, { u: u * g, a: 1, b: 0, mix: sw, warm: 1 - sw, k: span(t, t0, t0 + .5), tail: fly > .5 ? 1 : -1 });
      if (fly > .75 && fly < 1) halo(ctx, ne[0], ne[1], 14 * s, .8 * Math.sin(Math.PI * (fly - .75) * 4), K.COOL.mid, K.COOL.core);
    }
    // 'Including you' … 'get a word in': his bubbles go to you; your little bubble (the gold scan dot) starts, then shrinks back
    const yy = youYard(t);
    if (yy && t < tEighty + .5) {
      const yh = P2(c, youHead(t, yy));
      if (yh) {
        for (const [t0, k] of [[tInc + .15, 0], [tGet - .05, 1], [tGet + .9, 2]]) {
          const u = span(t, t0, t0 + .3), g = gone(k === 2 ? tEighty - .3 : t0 + 1.9, .4); if (u <= 0 || g <= 0) continue;
          C.glyphBubble(ctx, dHead[0] - (60 + 25 * k) * s, dHead[1] - (25 + 38 * k) * s, r * (.8 + .06 * k), t, { u: u * g, a: 1, warm: 1, k: span(t, t0, t0 + .45), tail: 1 });
        }
        const yu = Math.min(expoOut(span(t, tTell + .1, tTell + .6)), 1 - expoIn(span(t, tGet + .05, tGet + .45)));
        if (yu > 0) { const bx = yh[0] + 35 * s, by = yh[1] - 55 * s; C.glyphBubble(ctx, bx, by, r * .62 * yu, t, { u: 1, a: 1, k: 0, tail: -1 }); halo(ctx, bx, by, r * .5 * yu, .9); }
      }
    }
  };
  return [{ t: R.a, draw }];
};
