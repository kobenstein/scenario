// Film 6 · c14 · the end: clip C9 (Tolle) and segment 08a "Maybe. Nobody knows." … "The second is still ours.", then the city, the end card,
// the night (plate light lamp c13>c14 → film end). ONE continuous take over the whole chunk: one draw function, one camera path through the
// hook room of c01 (f6_kit nightRoom; the window pane is c14's own overlay, lib/f6_c14_room.mjs; the city behind it lib/f6_c14_city.mjs).
// Entries only split it for sound and the plate's print. No cut anywhere inside the chunk; the camera leaves the film through the window glass.
//
// shot  · VO words (anchor) · image · hero light · camera · flows on · ★ / sound
// 14.01 · CLIP C9 Tolle (593.9–605.1) · out of the lamp light (the plate shrinks into the lamp's bulb) the hook's room: you at the desk, not typing,
//         watching; on the laptop's pane a video window opens out of one cool line over your chat (as if you had searched): Tolle; the room darkens
//         a little around the screen; lower third ECKHART TOLLE · SPIRITUAL TEACHER · … · MAY 2026 at y 850 · screen · pull out of the lamp (expo),
//         a 1 % creep during the clip · take · whoosh_airy at the pull-out.
// 14.02 · "Maybe. Nobody knows." · the video closes to a line and goes out: the chat with the perfect answer is there again; the camera eases back
//         so the window on the right comes in, reflecting the room · lamp · ease back (z 3.4 → 1.4) · take · screen_off after the clip.
// 14.03 · "Our view, and we're not researchers, is this." · the whole room, plain: you from behind, the lamp, the desk, the window (as 1.01) ·
//         lamp · ease to the wide view, hold with life · take.
// 14.04 · "Today, very probably, no one is there." · the camera moves to the window (1.4 s, the move of 1.05): the room in the glass, the lamp's
//         reflection the brightest thing, the EMPTY chair opposite (exact match of 1.06); a breath of fog blooms on the glass over the chair on
//         "there" and clears · lamp (reflected) · move, hold · take.
// 14.05 · "And that's exactly why the good in it has to come from us." · in the glass an ember glows in the chest of you at the desk (its warmth
//         spills around the silhouette), a thread of warm light leaves the chest and runs up to the reflected laptop screen, where cool lines take
//         it and write · ember · slow push into the glass (z 1.85 → 2.6) · take.
// 14.06 · "Can a mind without feeling be made good? It's still open." · the pane turn: the glass tilts a few degrees, the reflection deepens into
//         the dark, a dark moment, then the city of lit windows comes THROUGH the glass: the window is open onto the world; hold · the windows ·
//         ease back (z 2.6 → 1.9) · take · shimmer_rings in the pause after "open."
// 14.07 · "So the next time the answer is perfect, and you wonder whether anyone is there," · the camera pans back to the laptop (1.15 s, in the
//         pause); you type a line, it is sent, the chat scrolls up, the cool line draws the rule and the perfect answer builds line by line (as
//         1.03, accent on "perfect"); on "and you wonder" the camera moves to the window again (the move of 1.05) · screen, then lamp · take.
// 14.08 · "there's one person you can be sure of." · ★ the pane turn: the glass tilts, the reflection deepens, a dark moment, and the reflection
//         returns with the chair opposite TAKEN: you, facing us; the witness point grows above the head; 2 s in which nothing moves but the
//         ember's breath (and yours) · lamp + witness · hold · take · swell in the pause after "sure of."
// 14.09 · "Intelligence and consciousness are two different things." · the camera pushes into the dark upper glass; the cool line writes itself
//         across the glass, on "consciousness" a warm ember tears itself off and rises; INTELLIGENCE / CONSCIOUSNESS (the split of 3.01, short) ·
//         both · push (z 1.85 → 4.2) · take · bloom in the pause after "things."
// 14.10 · "We built the first." · the labels un-write; the line sinks and shrinks into the reflected laptop screen and settles as its lit top edge;
//         the screen takes its light and writes; the camera tilts down with it · line → screen · tilt (z 4.2 → 3.2) · take.
// 14.11 · "The second is still ours." · the ember floats down to you in the chair and settles into the chest (the figure's rim answers 80 ms later);
//         the reflection deepens into the glass for the last time, the ember stays; the city comes through, and the ember's light IS one of its
//         windows (the couple holding hands); the camera pushes on through the glass, the frame leaves, the glass's tint falls away: the city of
//         lit windows at night, alive (a couple holding hands, someone laughing into a phone, someone reading; a window lights up); hold ~3.5 s;
//         the end card is written by a warm line: "Who is the person you'd call?"; the windows dim to the night (the card stays) ·
//         ember → the windows · push through (z 3.2 → 7.5), then the city's own slow drift · whoosh_airy through the glass, chime on the card.
// Plates: in = light lamp (c13>c14): the plate masked by a glow-shaped falloff that shrinks into the lamp's bulb as the camera pulls out (c04/c09/c11 pattern).
//         out = none (film end): the windows dim before 647.0; the last frame is the night with the card (never black).
// Ambience: atmo/nightsky very low for the room; atmo/city_night_hill rising from the moment the camera is through the glass (640.5) to the end.
// Print: riso .3 (= c01) throughout; the first entry carries the plate's print.
import { W, H, rgba, clamp, lin, mix, sm, eout, canvas } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { F6, nightRoom, ready, coolText, coolLine, lowerThird, camMap, ROOM, ember } from '../lib/f6_kit.mjs';
import { camPath, piecewise, darkAround } from '../lib/f6_c01_room.mjs';
import { QUART, GLASS, windowC14, clipOnLaptop, splitC14, openingLight, glassVeil } from '../lib/f6_c14_room.mjs';
import { city, EW, endCard } from '../lib/f6_c14_city.mjs';

export default async (T, R) => {
  const { in: HI } = handsOf('c14', T);
  const C = T.clip('C9'), S = (p, n) => T.S('8', p, n), E = (p, n) => T.E('8', p, n), END = T.duration;
  // ---- anchors (words, never seconds)
  const tMaybe = S('Maybe'), tOur = S('Our view'), tThisE = E('this.'), tToday = S('Today'), tThereE = E('there.');
  const tAnd = S('And that'), tUsE = E('us.'), tCan = S('Can a mind'), tOpenE = E('open.');
  const tSo = S('So the next'), tAnswer = S('answer'), tPerfect = S('perfect'), tAndYou = S('and you wonder'), tTheres = S("there's"), tSureE = E('sure of');
  const tIntel = S('Intelligence'), tCons = S('consciousness'), tTwo = S('two different'), tThingsE = E('things'), tWe = S('We built'), tSecond = S('The second'), tOursE = E('ours');
  // ---- derived moments
  const tType0 = tSo - .9, tSend = tAnswer - .45;                       // 14.07: you type, send; the rule line; the answer builds from tAnswer
  const tSwitch = tOursE + .02;                                         // 14.11: the city is through, the ember becomes a window
  const tCard = END - 4.15, tDim = END - 1.95;                          // the end card writes; the windows dim to the night
  // ---- the camera (world coords of the hook room; the window pane is on the .85 plane)
  const LAMPTIP = [1099, 490];                                          // the lamp's opening (f6_kit ember 'lamp' at ROOM.lamp, s 1.05, dir .42)
  const CLIP = { x: 905, y: 465, z: 3.4 }, MID = { x: 1090, y: 505, z: 1.4 }, WIDE = { x: 960, y: 560, z: 1.0 }, WIN = { x: 1487, y: 375, z: 1.85 };
  const onWall = (wx, wy, z) => ({ x: 960 + (wx - 960) / .85, y: 540 + (wy - 540) / .85, z });   // aim at a point of the window's plane (parallax .85)
  const NEAR = onWall(1500, 445, 2.6), STAR = onWall(1560, 478, 2.45), WIN2 = { x: 1487, y: 390, z: 1.9 }, LAP = { x: 840, y: 475, z: 2.9 }, SPLIT = onWall(1565, 262, 4.2), LOW = onWall(1565, 400, 3.2), OUT = onWall(1565, 400, 7.5);
  const KEYS = [
    { t: HI.b, x: LAMPTIP[0], y: LAMPTIP[1], z: 5.5 },
    { t: C.start + .15, ...CLIP, e: 'io' },                            // 14.01 out of the lamp to the screen (slow start: the light shrinks first)
    { t: C.end + .15, x: CLIP.x + 3, y: CLIP.y + 2, z: 3.44, e: 'lin' },   // the creep during the clip
    { t: tMaybe + 1.4, ...MID, e: 'io' },                              // 14.02 ease back: the window comes in
    { t: tOur - .3, x: MID.x - 2, y: MID.y + 1, z: 1.39, e: 'lin' },
    { t: tOur + 1.1, ...WIDE, e: 'io' },                               // 14.03 the plain room
    { t: tThisE - .4, x: 963, y: 558, z: 1.012, e: 'lin' },
    { t: tThisE + 1.0, ...WIN, e: 'io' },                              // 14.04 to the window (the move of 1.05)
    { t: tAnd - .1, x: WIN.x - 2, y: WIN.y + 2, z: 1.86, e: 'lin' },
    { t: tAnd + 1.9, ...NEAR, e: 'io' },                               // 14.05 into the glass, to the figure
    { t: tCan + 1.4, x: NEAR.x + 2, y: NEAR.y - 2, z: 2.62, e: 'lin' },
    { t: tOpenE + .3, ...WIN2, e: 'io' },                              // 14.06 ease back: the window open onto the city
    { t: tSo + .4, ...LAP, e: 'io' },                                  // 14.07 to the laptop (in the pause)
    { t: tAndYou, x: LAP.x - 3, y: LAP.y + 2, z: 2.93, e: 'lin' },
    { t: tAndYou + 1.35, ...STAR, e: 'io' },                           // "and you wonder": to the window again, closer on the reflection (the taken chair near centre)
    { t: tSureE + .1, x: STAR.x + 2, y: STAR.y + 2, z: STAR.z + .02, e: 'lin' },  // 14.08 ★ holds
    { t: tIntel + .15, ...SPLIT, e: 'io' },                            // 14.09 into the upper glass
    { t: tWe - .2, x: SPLIT.x, y: SPLIT.y + 3, z: 4.25, e: 'lin' },
    { t: tWe + 1.3, ...LOW, e: 'io' },                                 // 14.10 the tilt down with the line
    { t: tSwitch - .1, x: LOW.x, y: LOW.y + 2, z: 3.25, e: 'lin' },
    { t: tSwitch + 2.3, ...OUT, e: 'io' },                             // 14.11 through the glass
  ];
  const Wd = ROOM.window;
  // ---- the window's states: the reflection (light the glass gives back), the city through it, the pane's turn
  const rA = (t) => {
    if (t < tCan - .25) return 1;
    if (t < tCan + .85) return 1 - Math.pow(lin(tCan - .25, tCan + .85, t), 2.2);          // 14.06 the reflection deepens into the glass
    if (t < tSo + 1.05) return 0;
    if (t < tSo + 2.05) return eout(lin(tSo + 1.05, tSo + 2.05, t));                       // returns while the window is out of frame
    if (t < tAndYou + 1.3) return 1;
    if (t < tAndYou + 1.8) return 1 - Math.pow(lin(tAndYou + 1.3, tAndYou + 1.8, t), 2);    // 14.08 the turn: dark …
    if (t < tAndYou + 2.1) return 0;
    if (t < tAndYou + 2.6) return eout(lin(tAndYou + 2.1, tAndYou + 2.6, t));              // … and back, the chair taken
    if (t < tOursE - .8) return 1;
    return 1 - Math.pow(lin(tOursE - .8, tOursE + .02, t), 2);                              // 14.11 the last deepening
  };
  const tA = (t) => sm(lin(tCan + .95, tCan + 1.85, t)) * (1 - sm(lin(tSo + .25, tSo + 1.25, t))) + sm(lin(tOursE - .3, tOursE + .4, t));
  const yaw = (t) => .07 * sm(lin(tCan - .3, tCan + .9, t)) * (1 - sm(lin(tCan + .9, tCan + 2.4, t))) + .06 * sm(lin(tAndYou + 1.25, tAndYou + 1.85, t)) * (1 - sm(lin(tAndYou + 1.85, tAndYou + 2.8, t)));
  const chairTaken = (t) => t >= tAndYou + 2.0;
  const witnessA = (t) => lin(tTheres + .3, tTheres + 1.1, t);
  const fogA = (t) => { const t0 = tThereE - .7; return sm(lin(t0, t0 + .6, t)) * (1 - sm(lin(t0 + 1.0, t0 + 2.0, t))); };
  const chest = (t) => sm(lin(tAnd, tAnd + .6, t)) * (1 - sm(lin(tCan - .3, tCan + .3, t)));
  const thread = (t) => lin(tAnd + .45, tAnd + 1.4, t);
  const kDark = (t) => .8 * sm(lin(C.start - .4, C.start + .3, t)) * (1 - sm(lin(C.end - .2, C.end + .6, t)));
  const typing = (t) => t >= tType0 && t < tAnswer - .2;
  const kOpen = (t) => 1 - lin(HI.b + .03, HI.b + .98, t);                                 // the light is back in the lamp before the clip opens (linear: the edge crosses the frame at an even speed)
  // ---- the split in the glass (14.09), the line's settling (14.10), the ember's way to the chest (14.11): glass coordinates
  const uSplit = (t) => lin(tCons - .1, tCons + 1.1, t);
  const uLine = (t) => lin(tIntel - .05, tIntel + .8, t);
  const labelA = (t) => sm(lin(tTwo - .1, tTwo + .5, t)) * (1 - sm(lin(tThingsE + .2, tThingsE + .6, t)));
  const sSettle = (t) => QUART(lin(tWe - .15, tWe + 1.25, t));
  const lineA = (t) => 1 - sm(lin(tWe + 1.15, tWe + 1.6, t));
  const screenBoost = (t) => sm(lin(tWe + 1.1, tWe + 1.45, t)) * (1 - sm(lin(tWe + 2.0, tWe + 2.9, t)));
  const eChest = (t) => QUART(lin(tSecond - .15, tSecond + 1.2, t));
  const sitterGlow = (t) => sm(lin(tSecond + 1.28, tSecond + 1.6, t));
  const hand = (t) => sm(lin(tSwitch, tSwitch + 1.3, t));                                   // the ember's light becomes the window's
  // ---- the chat on the laptop (screen-local 330 × 212): the old exchange of c01, then the new one of 14.07; the clip as a window over it
  const elNew = (t) => Math.max(0, Math.min(t, tSend - .05) - tType0);
  const chatScreen = (q, t, w, h) => {
    const sc = QUART(lin(tSo - .35, tSo + .35, t)); q.save(); q.translate(0, -196 * sc);
    coolText(q, t, { x: 24, y: 16, w: 150, size: 10, lines: 2, lineH: 19, cps: 9, gap: .25, seed: 21, lengths: [1, .85], t0: -1e4, a: .65, cursor: false, ripple: false });
    coolLine(q, t, { from: [24, 62], to: [174, 62], u: 1, w: .8, glow: .4, head: false, a: .55, ticks: false });
    coolText(q, t, { x: 24, y: 70, w: 150, size: 10, lines: 6, lineH: 19, cps: 28, gap: .22, seed: 5, t0: -1e4, cursor: false, ripple: false });
    if (t >= tType0) {
      const sent = sm(lin(tSend, tSend + .3, t));
      coolText(q, t, { x: 24, y: 16 + 196, w: 150, size: 10, lines: 1, lineH: 19, cps: 9, gap: .25, seed: 23, lengths: [.72], t0: t - elNew(t), a: 1 - .35 * sent, cursor: t < tSend });
      const ru = lin(tAnswer - .3, tAnswer, t); if (ru > 0) coolLine(q, t, { from: [24, 62 + 196], to: [174, 62 + 196], u: ru, w: .8, glow: .4, head: false, a: .55, ticks: false });
      if (t >= tAnswer) coolText(q, t, { x: 24, y: 70 + 196, w: 150, size: 10, lines: 6, lineH: 19, cps: 28, gap: .22, seed: 5, t0: tAnswer, accent: [{ i: 0, at: tPerfect, d: .45 }] });
    }
    q.restore();
    clipOnLaptop(q, t, T, 'C9', w, h);
  };
  // ---- the city behind the glass: its camera is set so that the couple's window lies exactly where the ember sits in the chest at tSwitch
  const chestAt = (t) => { const m = camMap(camPath(KEYS, t), .85); return [m.X(Wd.x + GLASS.chest[0]), m.Y(Wd.y + GLASS.chest[1])]; };
  const P0 = chestAt(tSwitch), OFF = [P0[0] - EW[0], P0[1] - EW[1]];
  const cityCam = (t) => { const u = lin(tSwitch, END, t), v = lin(tCan, END, t); return { x: 960 - OFF[0] + 26 * u + 4 * v, y: 540 - OFF[1] - 8 * u, z: 1 + .07 * u + .006 * v }; };
  const cityOpts = (t) => ({ dim: sm(lin(tDim, END - .35, t)), lightOn: lin(tSwitch + 1.6, tSwitch + 2.4, t), emberA: .5 * hand(t) });
  const drawCity = (q, t) => city(q, t, cityCam(t), cityOpts(t));
  const ewAt = (t) => { const m = camMap(cityCam(t), 1); return [m.X(EW[0]), m.Y(EW[1])]; };
  // the moment the pane covers the whole frame (then the city is drawn directly and the glass's tint falls away)
  const covers = (t) => { const m = camMap(camPath(KEYS, t), .85); return m.X(Wd.x - Wd.w / 2) <= -40 && m.X(Wd.x + Wd.w / 2) >= W + 40 && m.Y(Wd.y - Wd.h / 2) <= -40 && m.Y(Wd.y + Wd.h / 2) >= H + 40; };
  let tCover = tSwitch + 2.3; for (let tt = tSwitch; tt < tSwitch + 2.4; tt += 1 / 60) if (covers(tt)) { tCover = tt; break; }
  // ---- what lies in the glass but is not the reflection: the split, the settling line, the travelling ember (screen space, clipped to the pane)
  const glassLights = (ctx, t, Wn) => {
    if (t < tIntel - .3) return;
    const X = Wn.X, Y = Wn.Y, k = Wn.m.k, s = sSettle(t);
    const S = GLASS.screen, LY = -118, x0 = mix(-180, S.x0, s), x1 = mix(180, S.x1, s), ly = mix(LY, S.y0, s);
    const u = uSplit(t), e = eout(u), riseG = 78;
    let ex = mix(0, -30, s), ey = mix(LY - riseG * e, -140, s);
    const ec = eChest(t); if (ec > 0) { ex = mix(ex, GLASS.chest[0], ec); ey = mix(ey, GLASS.chest[1], ec); }
    const arrive = sm(lin(tSecond + 1.0, tSecond + 1.3, t)) * (1 - sm(lin(tSecond + 1.3, tSecond + 1.9, t)));
    const hd = hand(t); let sx, sy, rr, ea, fa;
    if (t >= tSwitch) { const p = ewAt(t); sx = p[0]; sy = p[1]; rr = mix(72, 170, hd); ea = 1 - hd; fa = (1 - hd) * .6; }
    else { sx = X(ex); sy = Y(ey); rr = mix(120, 72, ec) * (1 + .22 * arrive); ea = 1; fa = 1 - .4 * ec; }
    ctx.save(); Wn.path(); ctx.clip();
    const lu = uLine(t), lx1 = mix(X(x0), X(x1), lu), free = s > 0 || ec > 0 || t >= tSwitch;   // once the ember leaves the split, its place is its own
    splitC14(ctx, t, { x: X(0), y: Y(ly), x0: X(x0), x1: lx1, lineA: lineA(t), u, ex: free ? sx : undefined, ey: free ? sy : undefined, rise: riseG * k, emberR: rr, emberA: ea, flameA: fa, labelA: labelA(t) });
    if (lu < 1 && lu > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const hg = ctx.createRadialGradient(lx1, Y(ly), 0, lx1, Y(ly), 26); hg.addColorStop(0, rgba('#ffffff', .95)); hg.addColorStop(.3, rgba(F6.cool, .5)); hg.addColorStop(1, rgba(F6.cool, 0)); ctx.fillStyle = hg; ctx.fillRect(lx1 - 26, Y(ly) - 26, 52, 52); ctx.restore(); }
    ctx.restore();
  };
  // ---- the take
  const draw = (ctx, t) => {
    const cam = camPath(KEYS, t), kd = kDark(t), lampA = 1 - .25 * kd;
    if (t < tCover) {
      const room = nightRoom(ctx, t, { cam, typing: typing(t), lampA, screen: (q, w, h) => chatScreen(q, t, w, h), window: { reflectA: 0 } });
      const ta = tA(t);
      const Wn = windowC14(ctx, t, cam, { reflectA: rA(t), throughA: ta, yaw: yaw(t), through: ta > 0 ? drawCity : null, fog: { x: 10, y: 105, rx: 150, ry: 115, a: fogA(t) },
        lampA, typing: typing(t), screenOn: true, seed: 3, chairTaken: chairTaken(t), witnessA: witnessA(t), chest: chest(t), thread: thread(t),
        screenText: t > tAnd + 1.2 && t < tCan + .9 ? { t0: tAnd + 1.2, a: 1 } : t > tWe + 1.35 ? { t0: tWe + 1.35, a: 1 } : null, screenBoost: screenBoost(t), sitterGlow: sitterGlow(t) });
      glassLights(ctx, t, Wn);
      darkAround(ctx, room.screen.x + room.screen.w * .5, room.screen.y + room.screen.h * .5, kd);
      if (t > C.start - .2 && t < C.end + .9) lowerThird(ctx, t, T, 'C9', { y: 850 });
      openingLight(ctx, t, HI, room.lamp[0], room.lamp[1], kOpen(t));
    } else {
      drawCity(ctx, t);
      glassVeil(ctx, t, camMap(cam, .85), 1 - sm(lin(tCover, tCover + .7, t)));
      const hd = hand(t); if (hd < 1) { const p = ewAt(t); ember(ctx, t, { x: p[0], y: p[1], kind: 'heart', r: mix(72, 170, hd), a: 1 - hd }); }
    }
    endCard(ctx, t, lin(tCard, tCard + 1.1, t), { y: 505, size: 76, shade: sm(lin(tCard - .15, tCard + .7, t)) });
  };
  // ---- warm-up (layers are painted on first use), then the entries
  const [, g0] = canvas(); for (const tt of [HI.b + .3, C.start + 2, tMaybe + 1, tToday + 1, tAnd + 1.5, tCan + 2.5, tSo + 1.5, tTheres + 1, tCons + 1, tWe + 1, tSecond + 1, tSwitch + 1, tCover + .5, tCard + 1.5, END - .5]) { g0.setTransform(1, 0, 0, 1, 0, 0); draw(g0, tt); }
  await ready();
  const P = { riso: .3 };
  return [
    { t: HI.b, tr: 'cut', d: .1, print: HI.print, draw, sound: [{ f: 'whoosh_airy', t: HI.b - .05, v: .35 }] },
    { t: C.start - .2, tr: 'cut', d: .1, print: P, draw },
    { t: tMaybe - .3, tr: 'cut', d: .1, print: P, draw, sound: [{ f: 'screen_off', t: C.end + .2, v: .3 }] },
    { t: tOur, tr: 'cut', d: .1, print: P, draw },
    { t: tToday, tr: 'cut', d: .1, print: P, draw },
    { t: tAnd, tr: 'cut', d: .1, print: P, draw },
    { t: tCan, tr: 'cut', d: .1, print: P, draw, sound: [{ f: 'shimmer_rings', t: tOpenE + .25, v: .22 }] },
    { t: tSo, tr: 'cut', d: .1, print: P, draw },
    { t: tTheres, tr: 'cut', d: .1, print: P, draw, sound: [{ f: 'swell', t: tSureE + .2, v: .4 }] },
    { t: tIntel, tr: 'cut', d: .1, print: P, draw, sound: [{ f: 'bloom', t: tThingsE + .15, v: .35 }] },
    { t: tWe, tr: 'cut', d: .1, print: P, draw },
    { t: tSecond, tr: 'cut', d: .1, print: P, draw, sound: [{ f: 'whoosh_airy', t: tOursE + .1, v: .4 }] },
    { t: tSwitch + 1.5, tr: 'cut', d: .1, print: P, draw, sound: [{ f: 'chime', t: tCard + .1, v: .25 }] },
  ];
};
