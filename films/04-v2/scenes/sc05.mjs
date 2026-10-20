// Chunk C05 · Film 4 v2 · "The honeymoon" (02a, 71.78–106.98) · shots 5.01–5.15 · ★ 5.13
// Builder c05. ONE continuous flight through ONE day: your room → the shop → your room → over the city → the coast → grandmother → your
// street → the hill (H1). Entries only split the take for print and sound. Every accent is anchored to a VO word (T.S / T.E).
// (plan table: see the bottom of this comment block once complete)
import { handsOf } from '../lib/handoff4.mjs';
import { ready, clamp, mix, path, camOf, plateCentre, ramp, pulse, qio, cio, sio, smo, eo } from '../lib/v2_c05_kit.mjs';
import { sun } from '../lib/v2_c05_city.mjs';
import { drawRoom } from '../lib/v2_c05_room.mjs';

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c05', T);
  const S = (p, k = 0) => T.S('2', p, k), E = (p, k = 0) => T.E('2', p, k);
  const A = {
    t0: HI.b, everything: S('everything'), hoped: S('hoped'), sleep: S('You sleep'), wakes: S('wakes'), wakesE: E('wakes you'),
    stop: S('You stop'), maths: S('maths'), checkout: S('checkout'), knot: S('knot'), sunday: S('Sunday'), gone: S('gone'), goneE: E('gone'),
    finally: S('Finally'), no: S('say no') + .24, noE: E('say no'), boss: S('boss'), commute: S('commute'), job: S('job'), down: S('down'),
    move: S('You can move'), love: S('love'), grandmother: S('grandmother'), tuesday: S('Tuesday'), because: S('because'),
    notJust: S("And it's not"), street: S('street is'), home: S('home'), have: S("don't have") + .24, anymore: S('anymore'), HOa: HO.a,
  };

  // ------------------------------------------------------------------ time of day (one slow day: morning gold → afternoon → dusk)
  const TOD = [[A.t0, 7.0], [A.wakesE, 7.6], [A.checkout, 8.6], [A.sunday, 9.8], [A.noE, 10.6], [A.down, 13.0], [A.love, 15.0], [A.because, 16.6], [A.home, 19.0]];
  const tod = (t) => { if (t <= TOD[0][0]) return TOD[0][1]; for (let i = 1; i < TOD.length; i++) if (t <= TOD[i][0]) return mix(TOD[i - 1][1], TOD[i][1], sio((t - TOD[i - 1][0]) / (TOD[i][0] - TOD[i - 1][0]))); return TOD[TOD.length - 1][1]; };

  // ------------------------------------------------------------------ 5.01: the pull-back out of the sun (the sun stays pinned on screen)
  const PB0 = HI.b, PB1 = A.hoped + .15, SUN_END = [742, 318];
  const pullBack = (t) => {
    const u = clamp((t - PB0) / (PB1 - PB0)), e = qio(u), ek = qio(clamp(u * 1.08));
    const s = sun(tod(t)), pc = plateCentre(t);
    const x = mix(-2.2, -2.0, e), y = mix(-1.42, -1.75, e), z = mix(1.6, -5.6, e), f = Math.exp(mix(Math.log(6500), Math.log(1150), e));
    const sx = mix(pc[0], SUN_END[0], e), sy = mix(pc[1], SUN_END[1], e);
    const px = sx - f * s.az, py = sy + f * s.el;
    return { cam: { x, y, z, f, lx: (960 - px) / f, ly: (540 - py) / f }, k: Math.exp(mix(0, Math.log(.12), ek)), sunXY: [sx, sy] };
  };
  const camEnd = pullBack(PB1).cam;
  // 5.02 → the swoop to the shop (keys: t, camera, ease of the segment that ends there)
  const KEYS = [
    [PB1, camEnd],
    [A.sleep + .55, { x: -2.3, y: -1.85, z: -5.75, f: 1150, lx: -.065, ly: .58 }, cio],
    [A.wakes, { x: -2.3, y: -1.88, z: -5.66, f: 1150, lx: -.06, ly: .56 }, sio],
    [A.wakesE + .02, { x: -2.3, y: -2.02, z: -5.4, f: 1150, lx: -.05, ly: .46 }, sio],
  ];
  const camAt = (t) => (t < PB1 ? pullBack(t).cam : path(t, KEYS));

  // ------------------------------------------------------------------ the room state
  const roomState = (t) => {
    const td = tod(t), pb = t < PB1 ? pullBack(t) : null;
    const plateOn = t <= PB0 + 1 / 60 ? 1 : 0;
    return {
      tod: td,
      out: { k: pb ? pb.k : .12, sunXY: pb ? pb.sunXY : null, plate: plateOn, office: { chair: 0, lamp: 1 } },
      curtain: ramp(t, A.everything - .06, A.everything + .9, cio), gust: pulse(t, A.everything - .15, A.everything + .35, A.hoped + .3, A.hoped + 1.6, sio),
      flood: mix(.28, 1, ramp(t, A.everything, A.everything + .8, cio)), patchA: 1, beamA: 1,
      sleeper: { up: ramp(t, A.wakes, A.wakesE + .1, cio), arms: ramp(t, A.wakes + .3, A.wakesE + .5, sio) },
      clock: { h: mix(7.0, 9.0, ramp(t, A.sleep + .3, A.wakes - .05, qio)) },
      tie: { u: 0 },
    };
  };
  const take = (ctx, t) => { const cam = camOf(camAt(t)); drawRoom(ctx, t, cam, roomState(t)); };

  await ready();
  return [
    { t: HI.b, tr: 'cut', d: .1, print: HI.print, draw: take, sound: [{ f: 'whoosh_airy', t: A.everything - .2, v: .3 }] },
    { t: A.sleep, tr: 'cut', d: .1, print: { riso: .25 }, draw: take },
  ];
};
