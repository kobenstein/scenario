// Film 4 v2 · c11 "Who you are" (Maslow 3) · VO 05a "But people aren't enough." … "And most people don't stop working."
// One continuous take, no blends: the c10>c11 night sky → tilt down onto the long table → you at its head → someone raises a glass →
// over your shoulder down to your business card (the job title smokes away) → the camera swings over the card to its back: an engraved
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
// 11.04 · "It's whatever you'd do even if nobody paid you." · the camera swings over the card to its back: an engraved vignette, you at
//        a workbench building a small wooden boat, a lamp, a big window with the night in it; the vignette grows as the camera nears ·
//        the vignette's lamp · orbit over the top, push · continuous · — · whoosh_airy on the swing
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
import { W, H, rgba, clamp, mix, lin, sm, camera, keys, spline, qio, eoX, eiX, cio, qo, u01, ready, shifted, glowSprite } from '../lib/v2_c11_kit.mjs';
import { tableWorld, tableState, CARD, YOU } from '../lib/v2_c11_table.mjs';
import { drawCard, paneHill, WIN_C3, facing } from '../lib/v2_c11_card.mjs';
import { drawHill } from '../lib/maslow4.mjs';

const PI = Math.PI;
export const H3 = { x: 960, y: 452, z: 1.12 };   // the view of the hill when the vignette's window fills the frame

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
  const tSwoop0 = A.and - .3, tSwoop1 = A.and + 1.0, tOrb0 = A.its - .14, tOrb1 = A.its + .5, tWin = A.something - .32;
  A.tSwoop0 = tSwoop0; A.tOrb0 = tOrb0; A.tOrb1 = tOrb1; A.tWin = tWin;

  // ---------------------------------------------------------------- the camera of the table take
  const P0 = [5.6, 9.2, .05], CLOSE = [CARD.x + .14, CARD.y + .03, CARD.z - .004];
  const POS = [
    [A.hb, P0], [A.hb + .9, [5.1, 7.9, .1]], [A.hb + 1.75, [4.3, 5.9, .18]], [A.sooner - .05, [3.55, 4.55, .2]],
    [A.sooner + 1.45, [2.62, 1.38, -.42]], [tSwoop0, [2.36, 1.34, -.44]],
  ];
  const SW = [[tSwoop0, [2.36, 1.34, -.44]], [tSwoop0 + .55, [1.25, 1.06, -.5]], [tSwoop1, CLOSE]];
  function camAt(t) {
    if (t <= tSwoop0) {
      const p = spline(t, POS);
      const pitch = t < A.hb + 1.75 ? mix(.62, -.7, cio(u01(t, A.hb, A.hb + 1.75))) : t < A.sooner - .05 ? mix(-.7, -.74, u01(t, A.hb + 1.75, A.sooner - .05)) : mix(-.74, -.075, qio(u01(t, A.sooner - .05, A.sooner + 1.45)));
      const yaw = -PI / 2 + .07 * qio(u01(t, A.sooner - .05, A.sooner + 1.45));
      return { x: p[0], y: p[1], z: p[2], yaw, pitch, f: 1400 };
    }
    if (t <= tOrb0) {   // swoop over your right shoulder down to the card, then a slow push
      const u = qio(u01(t, tSwoop0, tSwoop1)), p = t <= tSwoop1 ? spline(tSwoop0 + u * (tSwoop1 - tSwoop0), SW) : CLOSE.map((v, i) => v + (i === 0 ? -.025 : 0) * u01(t, tSwoop1, tOrb0));
      const look = [CARD.x, CARD.y, CARD.z], dx = look[0] - p[0], dy = look[1] - p[1], dz = look[2] - p[2];
      const yawL = Math.atan2(dz, -dx) * -1, pitchL = Math.atan2(dy, Math.hypot(dx, dz));
      const yaw = mix(-PI / 2 + .07, -PI / 2 + yawL * 0, u) , pitch = mix(-.07, pitchL, u);
      return { x: p[0], y: p[1], z: p[2], yaw, pitch, f: 1400 };
    }
    // the swing over the card (azimuth half a turn, elevation up and down again) and the push into the window
    const c = [CARD.x, CARD.y, CARD.z];
    if (t <= tOrb1) {
      const u = qio(u01(t, tOrb0, tOrb1)), az = mix(0, PI, u), elv = mix(.21, .42, u) + .95 * Math.sin(PI * u), r = mix(.115, .12, u);
      const p = [c[0] + Math.cos(az) * Math.cos(elv) * r, c[1] + Math.sin(elv) * r, c[2] - Math.sin(az) * Math.cos(elv) * r];
      return look(p, c, mix(-PI / 2, PI / 2, u));
    }
    const u = u01(t, tOrb1, tWin), e = 1 - Math.pow(1 - u, 2.2), r0 = .12, r1 = 1400 * .034 / W / 1.06;
    const aim = [mix(c[0], WIN_C3[0], qio(Math.min(1, u * 1.6))), mix(c[1], WIN_C3[1], qio(Math.min(1, u * 1.6))), mix(c[2], WIN_C3[2], qio(Math.min(1, u * 1.6)))];
    const el0 = .42, elv = mix(el0, .1, qio(Math.min(1, u * 1.3))), r = Math.exp(mix(Math.log(r0), Math.log(r1), qio(u)));
    const p = [aim[0] - Math.cos(elv) * r, aim[1] + Math.sin(elv) * r, aim[2]];
    return look(p, aim, PI / 2);
  }
  function look(p, at, yawHint) {
    const dx = at[0] - p[0], dy = at[1] - p[1], dz = at[2] - p[2], hd = Math.hypot(dx, dz);
    // yaw convention: forward = (sin(yaw)·cos(p), sin(p), -cos(yaw)·cos(p)) → yaw = atan2(dx, -dz)
    let yaw = hd > 1e-5 ? Math.atan2(dx, -dz) : yawHint; while (yaw - yawHint > PI) yaw -= 2 * PI; while (yaw - yawHint < -PI) yaw += 2 * PI;
    return { x: p[0], y: p[1], z: p[2], yaw, pitch: Math.atan2(dy, hd), f: 1400 };
  }
  // the sky plate, shifted up as the camera tilts down (drawn by handoff4 itself, unchanged)
  const p0 = .62;
  const platePass = (ctx, t, C) => {
    const dy = -1400 * Math.tan(p0 - C.o.pitch); if (dy < -H - 4) return;
    HI.plate(shifted(ctx, 0, dy), t);
  };
  const pane = paneHill(H3, { night: .85, lit: [1, 1, 0, 0, 0], labels: 0, title: 0, focus: -1, people: .4 });

  // ---------------------------------------------------------------- frames
  function frame(ctx, t) {
    if (t < tWin) {
      const C = camera(camAt(t)), St = tableState(t, A);
      tableWorld(ctx, t, C, St, {
        plate: t < A.hb + 1.6 ? platePass : null,
        card: (c2, tt, CC) => drawCard(c2, tt, CC, A, { pane }),
        noYou: t > tSwoop0 + .5,
      });
      return;
    }
    // provisional: the hill phase (lib/v2_c11_street.mjs replaces this)
    drawHill(ctx, t, { ...H3 }, { night: .85, lit: [1, 1, 0, 0, 0], labels: 1, title: 0, focus: -1, people: .4 });
  }
  // warm up the cached sprites so frames use decoded Images
  for (const c of ['#ffb35c', '#fff1d6', '#ffcf8a']) glowSprite(c, 128, null);
  await ready();

  const D = (ctx, t) => frame(ctx, t);
  return [
    { t: HI.b, tr: 'cut', d: .1, print: HI.print, draw: D, sound: [{ f: 'whoosh_airy', t: HI.b + .12, v: .35 }] },
    { t: A.sooner - .2, tr: 'cut', d: .1, draw: D },
    { t: A.and - .3, tr: 'cut', d: .1, draw: D, sound: [{ f: 'glass_clink', t: A.do + .35, v: .4 }] },
    { t: A.its - .3, tr: 'cut', d: .1, draw: D, sound: [{ f: 'whoosh', t: A.its - .12, v: .3 }] },
    { t: tWin, tr: 'cut', d: .1, draw: D },
    { t: HO.a - .6, tr: 'cut', d: .1, print: HO.print, draw: D },
  ];
}
