// Film 4 v2 · c11 "Who you are" (Maslow 3) · VO 05a "But people aren't enough." … "And most people don't stop working."
// One continuous take, no blends: the c10>c11 night sky → tilt down onto the long table → you at its head → someone raises a glass →
// over your shoulder down to your business card (the job title smokes away) → the card flips on its pin: its back is an engraved
// vignette of you building a boat, its window shows the night over the Maslow hill → through the window onto the hill (H3) →
// the esteem street: on "hands" the house fronts lift away (cut-away street) → potter ★ → dancer → violin → grandfather's craft →
// the office dissolves into dotted smoke, the gap becomes the way to the notice board → the board → a blank notice → c11>c12 paper plate.
//
// PLAN (shot · VO words · image · hero light · camera move · flow · ★ · sound)
// 11.01 · "But people aren't enough." · from the sky plate down onto the long table in a lantern-lit terrace street, people on both
//        benches, you at the head; on "enough" you turn your head to the dark valley · the lantern above you · tilt down + crane
//        toward you · continuous from the plate · — · whoosh_airy in the pause before "But"
// 11.02 · "Sooner or later, someone at the table asks you what you do." · crane down to eye level behind you; across the table a woman
//        raises her glass toward you on "asks"; you turn back to her; a held pause on "do" · the head lantern · crane down, slow push ·
//        continuous · — · glass clink in the pause after "do"
// 11.03 · "And for once, the honest answer isn't a job title." · over your right shoulder down to your business card in its brass
//        holder: name (a pen line) + SENIOR ACCOUNT MANAGER; on "title" the title's letters lift off as dotted smoke, the name stays ·
//        lantern light on the paper · swoop + slow push · continuous · — · card whoosh after "title"
// 11.04 · "It's whatever you'd do even if nobody paid you." · the card flips on its pin; its back: an engraved vignette, you at
//        a workbench building a small wooden boat, a lamp, a big window with the night in it; the vignette grows as the camera nears ·
//        the vignette's lamp · card flip, push · continuous · — · whoosh on the flip, whoosh_airy into the window
// 11.05 ★ · "Something made by human hands becomes precious, because someone chose to make it." · through the vignette's window: the
//        night over the Maslow hill (H3), ESTEEM + SELF-ACTUALIZATION written on; push onto the esteem street; on "hands" the house
//        fronts lift away: a potter at her wheel, a bowl rising under her hands · the potter's lamp · push in · continuous · ★ · wood lift
// 11.06–11.08 · "…for the joy of it." / "The violin at forty." / "The craft your grandfather knew." · truck right along the cut-away
//        street: a dancer turning slowly, a violinist of forty (staff lines drift out of the window), an old man guiding a child's
//        hands on a plane, shavings curl · each room's own lamp · truck · continuous · — · (music of the street: ambience)
// 11.09 · "The jobs that never made sense quietly disappear." · the office next door: paper stacks, empty desks; its lines turn to
//        dotted ghost lines and smoke, room and all; the gap opens onto the stair up the hill and the notice board · cold office light
//        goes out · truck + push · continuous · — · gust as the smoke goes
// 11.10 · "Now a project has to win you with meaning, not with a salary." · the notice board: a notice with a big money sign and coin
//        stacks (nobody there), a notice engraved with a river being cleaned and a school roof going up; people gather at the second ·
//        the lantern over the board · push · continuous · — · —
// 11.11 · "And most people don't stop working." · pull back along the street, every room busy; a new blank notice is pinned; push into
//        its paper until it IS the warm paper plate (c11>c12) · lantern · pull back, push in · continuous into the plate · — · paper pop
// Ambience: city_night_hill (street murmur, a far violin) — lead's mix.
import { handsOf } from '../lib/handoff4.mjs';
import { W, H, rgba, clamp, mix, lin, sm, camera, keys, spline, hermite, qio, eoX, eiX, cio, qo, u01, ready, shifted, glowSprite } from '../lib/v2_c11_kit.mjs';
import { tableWorld, tableState, clearLanterns, CARD, YOU } from '../lib/v2_c11_table.mjs';
import { drawCard, paneHill, winCentre, backNormal, WIN } from '../lib/v2_c11_card.mjs';
import { drawStreet, streetView, streetLayout, FOC, H3 } from '../lib/v2_c11_street.mjs';
import { boardGeo } from '../lib/v2_c11_acts2.mjs';

const PI = Math.PI;

export default async function (T, R) {
  const HI = handsOf('c11', T).in, HO = handsOf('c11', T).out;
  const S = (p, n) => T.S('05a', p, n), E = (p, n) => T.E('05a', p, n);
  const A = {
    hb: HI.b, but: S('But people'), enough: S("aren't enough"), sooner: S('Sooner or later'), table: S('at the table'), asks: S('asks you'),
    do: S('what you do') + .32, and: S('And for once'), honest: S('honest answer'), title: S('job title') + .24, its: S("It's whatever"), paid: S('nobody paid'),
    something: S('Something made'), hands: S('human hands') + .4, precious: S('becomes precious') + .48, chose: S('someone chose'), make: S('to make it') + .08,
    people: S('People master'), joy: S('the joy'), violin: S('The violin'), forty: S('at forty') + .2, craft: S('The craft'), grand: S('your grandfather') + .16,
    jobs: S('The jobs that'), never: S('never made'), quietly: S('quietly disappear'), disappear: S('quietly disappear') + .56,
    now: S('Now a project'), meaning: S('with meaning'), salary: S('a salary') + .08, most: S('And most people'), working: S('stop working') + .32, ha: HO.a,
  };
  // phase boundaries
  const tSwoop0 = A.and - .3, tSwoop1 = A.and + 1.0, tF0 = A.its - .22, tF1 = A.its + .42, tP0 = A.its + .08, tWin = A.something - .32;
  Object.assign(A, { tSwoop0, tF0, tF1, tP0, tWin });

  // ---------------------------------------------------------------- the camera of the table take
  // keys: [t, [x, y, z, yaw, pitch]]; a key can aim instead: [t, pos, worldPoint, screenX, screenY] puts that point at that place in frame.
  // One Catmull-Rom spline through all keys (time-warped at the start so the tilt leaves the plate from rest).
  const aimYP = (p, q, sx, sy) => {
    const dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2], hd = Math.hypot(dx, dz);
    let yaw = Math.atan2(dx, -dz) - Math.atan((sx - W / 2) / 1400); while (yaw > PI / 2) yaw -= 2 * PI; while (yaw < -3 * PI / 2) yaw += 2 * PI;
    return [yaw, Math.atan2(dy, hd) + Math.atan((sy - H / 2) / 1400)];
  };
  const YOUH = [YOU.x, 1.05, YOU.z], ASKH = [-.55, 1.27, -.8];
  const RAW = [
    [A.hb, [5.8, 12.0, .05, -PI / 2, .62]],
    [A.hb + .85, [5.42, 10.5, .1, -PI / 2, .08]],
    [A.hb + 1.75, [4.45, 6.9, .2], [-4, .76, 0], 960, 430],
    [A.enough + .62, [3.5, 4.4, .3], YOUH, 930, 800],
    [A.sooner + .06, [3.0, 3.25, .2], YOUH, 905, 790],
    [A.sooner + 1.45, [2.62, 1.38, -.42], [-6, 1.0, 0], 960, 470],
    [A.asks + .33, [2.45, 1.33, -.72], ASKH, 1330, 470],
    [tSwoop0, [2.38, 1.32, -.75], ASKH, 1335, 482],
  ];
  const WARP = .8, KEYS = RAW.map(([tk, p, q, sx, sy], i) => [i ? tk - WARP / 2 : tk, q ? [...p, ...aimYP(p, q, sx, sy)] : p]);
  const warp = (t) => (t - A.hb < WARP ? A.hb + (t - A.hb) ** 2 / (2 * WARP) : t - WARP / 2);
  const CLOSE = [CARD.x + .14, CARD.y + .03, CARD.z - .004], CLOSE2 = [CLOSE[0] - .022, CLOSE[1], CLOSE[2]];
  const K7 = KEYS[KEYS.length - 1][1], SW = [[tSwoop0, K7.slice(0, 3)], [tSwoop0 + .55, [1.25, 1.06, -.5]], [tSwoop1, CLOSE]];
  const fwd = (yaw, p) => [Math.sin(yaw) * Math.cos(p), Math.sin(p), -Math.cos(yaw) * Math.cos(p)];
  const F0 = (() => { const f = fwd(K7[3], K7[4]); return [K7[0] + 3 * f[0], K7[1] + 3 * f[1], K7[2] + 3 * f[2]]; })();
  // the push into the vignette's window: the window ends 6 % wider than the frame, centred, seen square-on; the camera does not stop
  // there (the hill inside keeps growing at the same rate and the street phase takes that rate over)
  const CC = [CARD.x, CARD.y, CARD.z], WINC = winCentre(PI), BN = backNormal(PI), R1 = 1400 * (WIN.y1 - WIN.y0) / 1000 / (H * 1.06), WWEND = 1400 * (WIN.x1 - WIN.x0) / 1000 / R1;
  const R0 = Math.hypot(CLOSE2[0] - CC[0], CLOSE2[1] - CC[1], CLOSE2[2] - CC[2]), DIR0 = CLOSE2.map((v, i) => (v - CC[i]) / R0);
  const SIG = .6, PUSH = (u) => (-2 * u ** 3 + 3 * u * u) + SIG * (u ** 3 - u * u);   // Hermite: from rest, ends with slope SIG
  const RATE = .85 * Math.log(R0 / R1) * SIG / (tWin - tP0);                          // d log(zoom)/dt of the hill at tWin
  function camAt(t) {
    if (t <= tSwoop0) { const v = spline(warp(t), KEYS); return { x: v[0], y: v[1], z: v[2], yaw: v[3], pitch: v[4], f: 1400 }; }
    if (t <= tP0) {   // swoop over your right shoulder down to the card (the look point slides from the asker onto the card), then a slow push
      const u = qio(u01(t, tSwoop0, tSwoop1)), p = t <= tSwoop1 ? spline(tSwoop0 + u * (tSwoop1 - tSwoop0), SW) : CLOSE.map((v, i) => v + (i === 0 ? -.022 : 0) * sm(u01(t, tSwoop1, tP0)));
      const uL = qio(u01(t, tSwoop0, tSwoop1 - .05));
      return look(p, [mix(F0[0], CC[0], uL), mix(F0[1], CC[1], uL), mix(F0[2], CC[2], uL)], -PI / 2);
    }
    const u = u01(t, tP0, tWin), ua = qio(Math.min(1, u * 1.35)), ud = qio(Math.min(1, u * 1.15));
    const aim = CC.map((v, i) => mix(v, WINC[i], ua)), dv = DIR0.map((v, i) => mix(v, BN[i], ud)), dl = Math.hypot(...dv);
    const r = Math.exp(mix(Math.log(R0), Math.log(R1), PUSH(u)));
    return { ...look(aim.map((v, i) => v + dv[i] / dl * r), aim, -PI / 2), near: .003 };   // the camera ends 18 mm from the card
  }
  function look(p, at, yawHint) {
    const dx = at[0] - p[0], dy = at[1] - p[1], dz = at[2] - p[2], hd = Math.hypot(dx, dz);
    // yaw convention: forward = (sin(yaw)·cos(p), sin(p), -cos(yaw)·cos(p)) → yaw = atan2(dx, -dz)
    let yaw = hd > 1e-5 ? Math.atan2(dx, -dz) : yawHint; while (yaw - yawHint > PI) yaw -= 2 * PI; while (yaw - yawHint < -PI) yaw += 2 * PI;
    return { x: p[0], y: p[1], z: p[2], yaw, pitch: Math.atan2(dy, hd), f: 1400 };
  }
  const spinAt = (t) => PI * qio(u01(t, tF0, tF1));
  // the sky plate, shifted up as the camera tilts down (drawn by handoff4 itself, unchanged)
  const p0 = .62;
  const platePass = (ctx, t, C) => {
    const dy = -1400 * Math.tan(p0 - C.o.pitch); if (dy < -H - 4) return;
    HI.plate(shifted(ctx, 0, dy), t);
  };
  // no lantern hangs in the path of the camera (they would fill the frame for a moment)
  { const pts = []; for (let t = A.hb; t < tSwoop1; t += .04) { const c = camAt(t); pts.push([c.x, c.y, c.z]); } clearLanterns(pts, .95); }
  const HILLST = (t) => ({ night: .85, lit: [1, 1, eoX(u01(t, A.something - .05, A.something + .9)), 0, 0], labels: 0, title: 0, focus: -1, people: .4 });
  const pane = paneHill(H3, HILLST(tWin - .5), WWEND);

  // ---------------------------------------------------------------- the street (hill units; see lib/v2_c11_street.mjs)
  const LY = streetLayout(), SHOP = LY.shops, mid = (i) => (SHOP[i].x0 + SHOP[i].x1) / 2, yb = SHOP[0].yb, YM = yb - 6.6;
  const D0 = FOC / H3.z, L = Math.log, BG = boardGeo(SHOP[4]);
  const SK = [
    [tWin, [H3.x, H3.y, L(D0)], [0, 0, -RATE]],
    [A.something + .55, [948, 458, L(900)], null],
    [A.hands - .05, [(SHOP[0].x0 + SHOP[5].x1) / 2 - 3, yb - 19, L(222)], [-12, 1.5, -.22]],
    [A.hands + .62, [mid(1) - 16, yb - 14, L(150)], null],
    [A.precious - .1, [mid(0) + 1.5, YM + .5, L(13.6)], [-2, .4, -.16]],
    [A.make + .3, [mid(0) + 1.8, YM + .7, L(12.4)], [.4, 0, -.03]],
    // 11.06 the dancer: truck right, the camera breathes out and in
    [A.people + .45, [mid(0) + 22, YM, L(30)], null],
    [A.joy - .45, [mid(1) + 1, YM - .2, L(21)], null],
    [A.joy + .7, [mid(1) + 3, YM - .2, L(19.5)], null],
    // 11.07 violin
    [A.violin + .1, [mid(1) + 24, YM, L(28)], null],
    [A.forty, [mid(2) - 1, YM - .2, L(21)], null],
    [A.craft - .15, [mid(2) + 2, YM - .2, L(19.5)], null],
    // 11.08 grandfather
    [A.craft + .55, [mid(2) + 24, YM, L(28)], null],
    [A.grand + .2, [mid(3) - 1, YM - .2, L(21)], null],
    [A.jobs - .2, [mid(3) + 2, YM - .2, L(19.5)], null],
    // 11.09 the office, it goes; the passage behind it
    [A.jobs + .55, [mid(3) + 26, YM, L(28)], null],
    [A.quietly, [mid(4), YM, L(25)], null],
    [A.disappear + .5, [mid(4), YM + .3, L(16)], null],
    // 11.10 the notice board at the mouth of the passage
    [A.now + .9, [BG.xb + .4, BG.fl - 4.4, L(10.2)], null],
    [A.salary + .2, [BG.xb + .2, BG.fl - 4.5, L(9.8)], null],
    [A.most + .05, [BG.xb + 0, BG.fl - 4.6, L(9.6)], null],
    // 11.11 pull back: the street at work around the passage; a woman pins a new blank notice; into its paper (= the c11>c12 plate)
    [A.most + .9, [BG.xb - 3, BG.fl - 9, L(42)], [0, 0, 0]],
    [HO.a - .07, [(BG.B.x0 + BG.B.x1) / 2, (BG.B.y0 + BG.B.y1) / 2, L(.31)], [0, 0, -7]],
  ];
  const streetAt = (t) => { const v = hermite(t, SK); return streetView(v[0], v[1], Math.exp(v[2])); };
  const STB = { potter: A.precious - .2, dancer: A.people + .2, violin: A.violin, office: A.quietly, gather: A.meaning - .4, pin: A.most + .3 };
  const lab = (t, a) => eoX(u01(t, a, a + .6)) - eiX(u01(t, A.hands - .62, A.hands - .3));   // written on with the words, unwritten as the push begins
  const streetState = (t) => ({ hill: HILLST(t), labels: { es: lab(t, A.something - .1), sa: lab(t, A.something + .14) }, open: A.hands, busy: STB, plate: HO.plate });

  // ---------------------------------------------------------------- frames
  function frame(ctx, t) {
    if (t < tWin) {
      const C = camera(camAt(t)), St = tableState(t, A), spin = spinAt(t);
      tableWorld(ctx, t, C, St, {
        plate: t < A.hb + 1.6 ? platePass : null,
        card: (c2, tt, C2) => drawCard(c2, tt, C2, A, { pane, spin }),
      });
      return;
    }
    drawStreet(ctx, t, streetAt(t), streetState(t));
  }
  // warm up the cached sprites so frames use decoded Images
  for (const c of ['#ffb35c', '#fff1d6', '#ffcf8a', '#cfe6ff', '#ff8a3a']) glowSprite(c, 128, null);
  await ready();

  const Dr = (ctx, t) => frame(ctx, t);
  return [
    { t: HI.b, tr: 'cut', d: .1, print: HI.print, draw: Dr, sound: [{ f: 'whoosh_airy', t: HI.b + .12, v: .35 }] },
    { t: A.sooner - .2, tr: 'cut', d: .1, draw: Dr },
    { t: A.and - .3, tr: 'cut', d: .1, draw: Dr, sound: [{ f: 'clink', t: A.do + .35, v: .4 }] },
    { t: A.its - .3, tr: 'cut', d: .1, draw: Dr, sound: [{ f: 'whoosh', t: A.its - .12, v: .3 }, { f: 'whoosh_airy', t: tWin - .15, v: .3 }] },
    { t: tWin, tr: 'cut', d: .1, draw: Dr, sound: [{ f: 'gust', t: A.disappear + .65, v: .3 }] },
    { t: HO.a - .6, tr: 'cut', d: .1, print: HO.print, draw: Dr, sound: [{ f: 'paper_pop', t: HO.a - .2, v: .35 }] },
  ];
}
