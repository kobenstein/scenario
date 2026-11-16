// Film 8 · c11 · Legacy and the ending (VO 07a, C7, 07b, the end screen). Owner B3.
// Binding shot list: /mnt/project-files/scenario/film-singularitaet/m1/bild/shots.md §8 c11.
//
//  act | shots        | world                                                  | in → out
//  ----+--------------+--------------------------------------------------------+-----------------------------------------------------------
//  BE  | c11.01–.02   | Mau's night beach: the fire, the stone compass, the tide| out of the fire (c10>c11 `light` fire) → push into the fire
//  CN  | c11.03–.07   | Hōkūleʻa at night → the world voyage (coasts) → dawn,   | out of the canoe's fire box; one take: stern, alongside,
//      |              | many canoes, their star rings → three generations       | crane up, down to the stern → the horizon brightens into a line
//  C7  | c11.08       | clip C7 (Krznaric quoting Salk) on the line carrier     | (or the Salk quote card if the clip is missing)
//  HZ  | c11.09–.17   | the horizon light, the cliff and your window, the room, | out of the line: the horizon light → turn to the shore, push
//      |              | the plan that burns, the envelope compass, the rose     | through the window, round behind you, the five beats; the
//      |              | outside, the end screen                                 | end screen floats out through the window toward the dawn
import fs from 'node:fs';
import { clamp } from '../engine.mjs';
import { ready, track, trackLog, camera, eoX, eiX, sio, qio, u01, pulse, settle, hash, TAU, mixHex } from '../lib/s8_kit.mjs';
import { drawSky, prepareSky } from '../lib/s8_sky.mjs';
import { drawSea } from '../lib/s8_sea.mjs';
import { lightAt, lensOf, drawLight } from '../lib/s8_light.mjs';
import { seaRose, drawFleet, ringLayout } from '../lib/s8_fleet.mjs';
import { canoe, canoeFrame, seatedNav, starRing } from '../lib/s8_nav.mjs';
import { clip, quoteCard, label } from '../lib/s8_card.mjs';
import { room, sheet, sheetCorners, DESK } from '../lib/s8_desk.mjs';
import { inkRose, needle as needleOf } from '../lib/s8_rose.mjs';
import { hand, plate } from '../lib/handoff4.mjs';
import { hand as handDraw } from '../lib/hand.mjs';
import { ROOT } from '../lib/kit.mjs';
import { iris } from '../lib/s8_c09_sea.mjs';
import { beach, stoneRing, STONES, beachFire, coasts, standFig, cliff, plan, flakes, sun } from '../lib/s8_c11_shore.mjs';

const PI = Math.PI;
function camTrack(rows) {
  const f = [1, 2, 3, 4, 5].map((c) => track(rows.map((r) => [r[0], r[c]]))), fF = trackLog(rows.map((r) => [r[0], r[6]]));
  return (t) => ({ x: f[0](t), y: f[1](t), z: f[2](t), yaw: f[3](t), pitch: f[4](t), F: fF(t) });
}
const aim = (p, q) => { const dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2]; return [Math.atan2(dx, dz), Math.atan2(-dy, Math.hypot(dx, dz))]; };
const row = (t, p, q, F = 1400, wrap = 0) => { const [y, pi] = aim(p, q); return [t, ...p, y + wrap * TAU, pi, F]; };
const lerp3 = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
const LT = { cool: ['#8fe6ff', '#eefcff'] };
function lineAt(ctx, y, a) {   // the clip carrier's line (s8_card's cool line, same strokes)
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (const [lw, al] of [[22, .07], [7, .22], [1.8, .95]]) { ctx.strokeStyle = `rgba(${lw < 3 ? '238,252,255' : '143,230,255'},${al * a})`; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(-20, y); ctx.lineTo(1940, y); ctx.stroke(); }
  ctx.restore();
}

export default async function (T, R) {
  const a = (p, n) => T.S('07a', p, n), b = (p, n) => T.S('07b', p, n);
  const HI = hand('c10>c11', T), C7 = T.clip('C7'), END = T.duration;
  const hasC7 = fs.existsSync(ROOT + 'clips/C7/f00001.jpg');
  const K = { in: HI.b, c7a: C7.start, c7b: C7.end };

  // ================================================================ BE: Mau's beach
  const FIRE = [1.0, 0, .35], MAU = [0, 0, 0], GIVE = 15;   // GIVE: the stone handed on and set back into the ring (land side, the fire beyond it)
  K.die = a('die'); K.share = a('shared'); K.be1 = a('His student') - .06; K.bePush = K.be1 - .45;
  const camBE0 = camTrack([
    row(K.in, [1.75, .55, -.45], [1.0, .3, .35], 1400),
    row(K.in + .9, [2.2, 1.4, -2.4], [.8, .3, .5], 1400),
    row(a('head') + .2, [-1.4, 2.5, -5.2], [.2, .25, 1.0], 1400),
    row(K.die + .3, [-.8, 2.4, -4.6], [.3, .1, 2.2], 1400),
    row(K.share - .25, [.3, 1.05, -4.3], [.5, .15, -1.9], 1400),
    row(K.bePush, [.35, 1.0, -4.1], [.55, .15, -1.8], 1400),
  ]);
  const camBE = (t) => {
    if (t <= K.bePush) return camera(camBE0(t));
    const c0 = camBE0(K.bePush), p0 = [c0.x, c0.y, c0.z], tgt = [FIRE[0], .35, FIRE[2]], u = trackLog([[K.bePush, 1], [K.be1, .05]])(t), p = lerp3(tgt, p0, u), [y1, p1] = aim(p, tgt), w = sio(u01(t, K.bePush, K.bePush + .35));
    return camera({ x: p[0], y: p[1], z: p[2], yaw: c0.yaw + (y1 - c0.yaw) * w, pitch: c0.pitch + (p1 - c0.pitch) * w, F: 1400 });
  };
  function goneAt(t) { return (i) => (i === 0 || i === 1 ? sio(u01(t, K.die - .2 + i * .12, K.die + .8 + i * .1)) : 0); }
  function drawBE(ctx, t) {
    const C = camBE(t);
    drawSky(ctx, t, C, {}); drawSea(ctx, t, C, {});
    const wash = pulse(t, K.die - .6, K.die + 1.2);
    beach(ctx, t, C, { fire: [FIRE[0], .4, FIRE[2]], wash, shore: 3.4 });
    const set = sio(u01(t, K.share + .42, K.share + .82));
    stoneRing(ctx, t, C, { c: [MAU[0], MAU[2]], R: 2.3, fire: [FIRE[0], .4, FIRE[2]], gone: goneAt(t), skip: (i) => i === GIVE && set < 1 && t > K.share - .5 });
    // Mau: old, seated, facing the fire
    const fp = beachFire(ctx, t, C, FIRE[0], FIRE[2], .55);
    seatedNav(ctx, t, C, { at: [MAU[0], .02, MAU[2]], face: PI / 2, light: fp || undefined, lit: .85 });
    // c11.02: Mau's old hand gives a stone into a young palm; together they set it in the ring (screen space, carried in from the sides)
    const hu = sio(u01(t, K.share - .45, K.share + .1)) * (1 - sio(u01(t, K.bePush - .1, K.bePush + .3)));
    if (hu > 0) {
      const S2 = STONES[GIVE], gp = C.P(Math.sin(S2.th) * 2.3, .05, Math.cos(S2.th) * 2.3) || [960, 700];
      const give = sio(u01(t, K.share - .1, K.share + .4)), put = set, gx = gp[0], gy = gp[1];
      // the young palm (cupped, from the bottom right) waits under the old hand, then both lower the stone into the gap
      const palm = [gx + 60 - 60 * put, gy - 150 + 110 * put], old = [gx - 280 + 170 * give - 30 * put, gy - 250 + 40 * give + 90 * put];
      handDraw(ctx, palm[0] + (1 - hu) * 500, palm[1] + 80 + (1 - hu) * 500, 2.3, { pose: 'cup', ang: -2.05, flip: true, skin: '#8d5f40', sleeve: '#2a3450', sleeveLen: 400, rim: '#ffc890', light: [.3, -1], t, seed: 2 });
      handDraw(ctx, old[0] - (1 - hu) * 500, old[1] + 60 + (1 - hu) * 500, 2.2, { pose: 'grip', ang: -1.05 + .25 * give, skin: '#5a3a26', sleeve: '#3a2a1e', sleeveLen: 400, rim: '#ffc890', light: [.3, -1], t, seed: 1, close: .7 });
      // the stone travels from the old hand to the young palm and down into the ring
      const st = give < 1 ? [old[0] + 60 + (palm[0] - 10 - old[0] - 60) * give, old[1] - 40 + (palm[1] - 30 - old[1] + 40) * give] : [palm[0] - 10 + (gx - palm[0] + 10) * put, palm[1] - 30 + (gy - palm[1] + 30) * put];
      ctx.fillStyle = '#2e2a34'; ctx.beginPath(); ctx.ellipse(st[0], st[1], 34, 22, .2, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(255,176,102,.7)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(st[0], st[1], 34, 22, .2, -1.3, .6); ctx.stroke();
    }
    if (t < K.in + .5) iris(ctx, t, fp || [960, 540], 2300 * (1 - eoX(u01(t, K.in, K.in + .5))), { tone: 'fire' });
    if (t > K.be1 - .32) iris(ctx, t, fp || [960, 540], 20 + 2300 * eiX(u01(t, K.be1 - .32, K.be1)), { tone: 'fire' });
  }

  // ================================================================ CN: Hōkūleʻa: Nainoa, the world voyage, dawn, many canoes, the rings, three generations
  K.cn0 = K.be1; K.dec = a('Decades'); K.today = a('Today'); K.one = a('One man'); K.roman = a('Roman'); K.salk = a('polio');
  K.lineA = hasC7 ? K.c7a - .3 : K.c7a;    // the frame must be the black frame + line by then
  const V = 3.2, CZ = (t) => V * (t - K.cn0);   // the canoe sails on +Z
  const KC = (t) => ({ x: 0, z: CZ(t), head: 0 });
  const FL = [[-32, 26], [30, 42], [-58, -18], [54, -12], [-22, 84], [38, 100], [-74, 58], [78, 62], [8, 140]];
  const STAR = [.42, .5];   // the star Nainoa measures (az, el)
  // camera rows relative to the canoe (canoe frame = world shifted by its Z)
  const camCN0 = camTrack([
    row(K.cn0, [1.7, 2.6, -.3], [.35, 1.45, 1.2], 1400),
    row(K.cn0 + .9, [-4.6, 3.1, -12.5], [-.2, 3.3, -4.0], 1400),
    row(a('navigate') + .2, [-5.0, 3.2, -12.0], [.2, 4.2, -3.0], 1400),
    row(K.dec - .1, [-9, 3.4, -10], [0, 3, -2], 1400),
    row(K.dec + .9, [-26, 4.2, 2], [0, 4, 3], 1400),
    row(a('whole') + .6, [-26, 4.4, 4], [0, 4.2, 4.5], 1400),
    row(K.today + .3, [-40, 14, -26], [0, 2, 20], 1400),
    row(a('again') + .2, [-62, 34, -70], [0, 0, 40], 1400),
    row(K.one + .2, [-40, 120, -90], [0, 0, 55], 1400),
    row(a('compass', 2) - .4, [-30, 150, -70], [0, 0, 60], 1400),
    row(K.roman + .35, [-2.7, 2.6, -14.6], [.9, 2.0, -9.2], 1400),
    row(a('generations') + .3, [-2.4, 2.55, -14.1], [.9, 2.0, -9.2], 1400),
    row(K.lineA - .2, [-2.1, 2.5, -13.6], [.9, 2.0, -9.0], 1400),
  ]);
  const camCN = (t) => { const r = camCN0(t); return camera({ ...r, z: r.z + CZ(t) }); };
  const coastS = (t) => u01(t, K.dec + .2, K.today + .1);
  function drawCN(ctx, t) {
    const C = camCN(t), dawn = .75 * sio(u01(t, a('world') - .6, K.today + 1.4)), zc = CZ(t);
    drawSky(ctx, t, C, { dawn, dawnAz: .6 });
    drawSea(ctx, t, C, { dawn });
    if (t > K.dec - .2 && t < K.today + .6) coasts(ctx, t, C, coastS(t), { scale: 1.5 });
    // the fleet at dawn (sailing together, the same speed): far → near with ours
    const many = t > K.today - .5;
    const list = [[0, 0, true]]; if (many) for (const [x, z] of FL) list.push([x, z, false]);
    list.map(([x, z, ours]) => [C.depth(x, 2, z + zc), x, z, ours]).sort((p, q) => q[0] - p[0]).forEach(([d, x, z, ours]) => { if (d < .5) return; canoe(ctx, t, C, { x, z: z + zc, head: 0 }); });
    // the rings: one star compass round each canoe, lighting one after the other, overlapping into one pattern
    if (t > K.one - .4 && t < K.roman) {
      const order = [[0, 0], ...FL];
      order.forEach(([x, z], i) => { const u = u01(t, K.one + .15 + i * .14, K.one + .9 + i * .14) * (1 - u01(t, a('compass', 2) - .1, a('compass', 2) + .4)); if (u > 0) starRing(ctx, t, C, { c: [x, .3, z + zc], R: 22, u, glow: 1 }); });
    }
    const F = canoeFrame(KC(t), t);
    // Nainoa, young, standing at the stern, his arm out at full length measuring the star (c03.05)
    if (t < K.dec + .8) {
      const st = C.D(...[Math.sin(STAR[0]) * Math.cos(STAR[1]), Math.sin(STAR[1]), Math.cos(STAR[0]) * Math.cos(STAR[1])]);
      const meas = sio(u01(t, a('Nainoa') - .3, a('Nainoa') + .5));
      const P = F(-.7, 1.28, -7.4), hp = C.P(...F(-.7, 2.95, -7.4));
      const tgt = st && hp ? [hp[0] + (st[0] - hp[0]) * .5 * meas + (1 - meas) * 30, hp[1] + (st[1] - hp[1]) * .5 * meas + (1 - meas) * 260] : null;
      standFig(ctx, t, C, P, { h: 1.8, seed: 12, reach: tgt, head: -.25 * meas, light: { x: (C.P(...F(.35, 1.45, 1.2)) || [0, 0])[0], y: 400, col: '#ffb35c', a: .6 }, dress: { coat: '#2a2236', pants: '#120e14', skin: '#7a4f33', hair: '#0c0a12' } });
      if (st) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(st[0], st[1], 0, st[0], st[1], 26); g.addColorStop(0, `rgba(255,250,235,${.9 * meas})`); g.addColorStop(1, 'rgba(200,220,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(st[0], st[1], 26, 0, TAU); ctx.fill(); ctx.restore(); }
      if (hp) label(ctx, t, hp[0] - 40, hp[1] - 30, u01(t, a('Nainoa') + .1, a('Thompson') + .4) * (1 - u01(t, K.dec - .5, K.dec - .1)), 'NAINOA THOMPSON', '1980', { side: 'left', len: 120, dx: 70 });
    }
    // the voyage label
    if (t > K.dec && t < K.today + .2) { const mp = C.P(...F(0, 9, 3.4)); if (mp) label(ctx, t, mp[0], mp[1], u01(t, a('sailed') - .2, a('around') + .3) * (1 - u01(t, K.today - .4, K.today)), 'MĀLAMA HONUA', '2014–2017', { len: 80 }); }
    // three generations on one steering paddle: an old navigator, a parent, a child; three hands on the shaft
    if (t > K.roman - .9) {
      const top = F(.9, 2.2, -8.2), bot = F(1.1, -.6, -10.6), on = (u) => lerp3(top, bot, u);
      const sp = (u) => { const p = C.P(...on(u)); return p ? [p[0], p[1]] : null; };
      const lt = { x: 1500, y: 300, col: '#ffcf9a', a: .8 };
      standFig(ctx, t, C, F(1.75, 1.28, -9.0), { h: 1.75, seed: 31, reach: sp(.18), flip: true, light: lt, dress: { coat: '#2a3450', pants: '#131427', skin: '#a8734f', hair: '#1c1420' } });
      standFig(ctx, t, C, F(.15, 1.28, -8.9), { h: 1.68, seed: 33, reach: sp(.08), head: .1, light: lt, dress: { coat: '#3a2a1e', pants: '#120e14', skin: '#5a3a26', hair: '#d8d4cc' } });
      standFig(ctx, t, C, F(.75, 1.28, -9.9), { h: 1.05, seed: 35, reach: sp(.32), light: lt, dress: { coat: '#40303a', pants: '#120e14', skin: '#8d5f40', hair: '#1c1420' } });
      const pp = C.P(...on(.1));
      if (pp) {
        label(ctx, t, 1250, 330, u01(t, K.roman + .1, K.roman + .9) * (1 - u01(t, a('borrows') - .2, a('borrows') + .2)), 'ROMAN KRZNARIC', 'THE GOOD ANCESTOR', { len: 100 });
        label(ctx, t, 1250, 330, u01(t, a('from the man') + .1, K.salk + .3) * (1 - u01(t, K.lineA - .7, K.lineA - .35)), 'JONAS SALK', 'POLIO VACCINE', { len: 100 });
      }
    }
    // the horizon brightens into one line; everything else sinks into the dark → the clip's line
    const dk = u01(t, K.lineA - .9, K.lineA), ln = u01(t, K.lineA - 1.6, K.lineA);
    if (ln > 0) lineAt(ctx, C.hy, ln * (1 - dk) * .7);
    if (dk > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(2,2,8,${dk})`; ctx.fillRect(0, 0, 1920, 1080); ctx.restore(); lineAt(ctx, 540, dk); }
  }

  // ================================================================ C7: the clip on the line (or the Salk quote card)
  K.c7close = K.c7b + .3;
  function drawC7(ctx, t) {
    if (hasC7) clip(ctx, t, T, 'C7', { carrier: 'line', yOpen: 540, yClose: 540, info: { name: 'Roman Krznaric', role: 'Philosopher · quoting Jonas Salk' }, zoom: (i, u) => 1.24 + (i % 2 ? .08 : 0) + .03 * u });   // 1.24: crops the source's burned-in name tag and logo
    else { quoteCard(ctx, t, T, 'C7', { lines: ['Are we being', 'good ancestors?'], name: 'JONAS SALK', source: 'QUOTED BY ROMAN KRZNARIC', line: { y: 540, style: 'cream' } }); }
  }

  // ================================================================ HZ: the horizon light, your window, the room, the five beats, the end screen
  const O = [0, 14, -40];   // the room origin in the world (your house on the cliff; the window looks out along +Z)
  const toW = (p) => [p[0] + O[0], p[1] + O[1], p[2] + O[2]], toR = (C) => camera({ x: C.x - O[0], y: C.y - O[1], z: C.z - O[2], yaw: C.yaw, pitch: C.pitch, F: C.F });
  K.hz0 = hasC7 ? K.c7close : K.c7b; K.know = b('But I know'); K.planW = b('plan'); K.yl = b("You'll"); K.cmp = b('compass'); K.yours = b('Yours'); K.ours = b('ours');
  const BEAT = [b('matters'), b('curious'), b('people'), b('steps'), b('calm')];
  K.steer = b('And steer'); K.so = b('So take'); K.ndl = b('needle'); K.last = b('point') + .45; K.endT = END;
  const ROSE = { x: 0, z: 420, R: 48 };
  const FLEET = ringLayout(26, ROSE.x, ROSE.z, ROSE.R * 1.62, 71);
  const HOK = { x: 26, z: 760, head: .1 };
  const ENV0 = { x: -.12, z: .02, w: .26, aspect: 1.6, rot: -.12 };
  // the envelope held up: corners in room coordinates (TL, TR, BR, BL)
  const held = (dy = 0) => { const c = [.1, 1.29 + dy, -.18], w = .26, h = w / 1.6, ang = .95, up = [0, Math.sin(ang), Math.cos(ang)]; const P = (sx, sy) => [c[0] + sx * w / 2, c[1] + sy * h / 2 * up[1], c[2] + sy * h / 2 * up[2]]; return [P(-1, 1), P(1, 1), P(1, -1), P(-1, -1)]; };
  const envCorners = (t) => { const s = sheetCorners({ ...ENV0, y: DESK.top + .002 }); const u = sio(u01(t, K.cmp - .05, K.yours - .1)), low = eiX(u01(t, K.last + .1, K.last + 1.3)), H = held(-.55 * low); const sw = [.011 * Math.sin(t * 1.1), .012 * Math.sin(t * 1.7 + 1), .008 * Math.sin(t * .8 + 2)].map((v) => v * u); return s.map((p, i) => lerp3(p, H[i], u)).map((p, i) => [p[0] + sw[0] + (i % 3 ? .003 : -.003) * Math.sin(t * 1.3) * u, p[1] + sw[1], p[2] + sw[2]]); };   // held in a hand: it breathes
  const RC = [
    // world coordinates (the room is at O); the camera after the line: on the sea level with the cliff top, looking out at the light
    [K.hz0, 0, 5.0, 30, 0, .01, 1400],
    [K.know - .1, 0, 8.0, 2, 0, .01, 1400],
    [K.know + 1.2, .4, 15.0, -16, 3.0, .05, 1400],
    [b('plan') - .2, 0, 15.45, -33.5, PI, .1, 1400],
    [b('breaking'), 0, 15.42, -37.6, PI, .14, 1400],
    [K.yl, 0, 15.42, -38.5, PI, .16, 1400],
    [K.cmp, ...toW([.05, 1.62, .25]), PI + .6, .9, 1400],
    [K.yours - .15, ...toW([.15, 1.45, -.78]), TAU, .1, 1400],
    [K.ours + .3, ...toW([.14, 1.44, -.72]), TAU, .1, 1400],
    [b('Stay calm') + .3, ...toW([.08, 1.42, -.6]), TAU, .12, 1400],
    [K.so - .1, ...toW([.1, 1.41, -.58]), TAU, .14, 1400],
    [K.ndl, ...toW([.1, 1.38, -.5]), TAU, .2, 1400],
    [K.last + .3, ...toW([.1, 1.37, -.48]), TAU, .2, 1400],
    [K.last + 2.6, ...toW([.06, 1.46, -.5]), TAU, .06, 1400],
    [K.last + 3.8, ...toW([.02, 1.5, .5]), TAU, .03, 1400],
    [K.last + 8, ...toW([0, -8, 20]), TAU, .015, 1400],
    [K.endT, ...toW([0, -11, 52]), TAU, .012, 1400],
  ];
  const camHZ0 = camTrack(RC), camHZ = (t) => camera(camHZ0(t));
  const LIGHT = { az: 0, el: .0025 };
  const beatAt = (t, i, d = 0) => u01(t, BEAT[i] + d - .05, BEAT[i] + d + .35);
  const turn = (t) => .9 * sio(u01(t, K.steer - .1, b('together') + .6));
  function outside(ctx, t, C) {   // the sea world as seen through C (world camera)
    const dawn = .25 + .6 * sio(u01(t, K.steer - .5, K.endT - 4)), Ls = { ...LIGHT, ign: 1, ring: .55 * (1 - .6 * dawn), size: 1 };
    const L = lightAt(C, Ls), lens = lensOf(C, Ls, L);
    drawSky(ctx, t, C, { lens: L && L.x > -300 && L.x < 2220 ? lens : null, dawn, dawnAz: 0 });
    const sa = u01(t, K.steer, K.last + 2), sp = sun(ctx, t, C, -.03 + .08 * sio(u01(t, K.last, K.endT)), sa);
    const gl = L ? [{ x: L.x, y: L.y, col: '#bfefff', a: 1, w: 3, spread: .2 }] : [];
    if (sp && sa > 0) gl.push({ x: sp[0], y: C.hy, col: '#ffcf9a', a: .9 * sa, w: 30 + 60 * sa, spread: .22 });   // the sun's glitter path (centre band)
    drawSea(ctx, t, C, { dawn, glints: gl });
    drawLight(ctx, t, C, Ls, L);
    canoe(ctx, t, C, { ...HOK, z: HOK.z + .8 * (t - K.hz0) });
    const pts = [0, 1, 2, 3].map((i) => (t < K.yours ? 0 : i === 0 && t < BEAT[0] ? .25 : beatAt(t, i, .1)));
    const lit = sio(u01(t, K.ours - .2, K.ours + .6));
    seaRose(ctx, t, C, { ...ROSE, a: lit, points: pts.map((p) => Math.max(p, .25 * lit)), icons: lit, rim: lit, needle: { ang: -.4 + turn(t), a: beatAt(t, 4, .1), n: 9 }, spin: .02 + turn(t) / Math.max(1, t) });
    const heads = FLEET.map((f) => ({ ...f, head: f.head * (1 - turn(t) / .9) + 0 }));
    drawFleet(ctx, t, C, heads, { lantern: lit, sail: t > K.steer ? 'full' : 'slack' });
    return L;
  }
  const roomOpts = (t, extra = {}) => ({ items: [{ ...ENV0, corners: envCorners(t), draw: envDraw, y: DESK.top + .002 }], person: null, open: true, outside: 1, ...extra });
  function envDraw(g, t, W, H) {
    const lit = [0, 1, 2, 3].map((i) => beatAt(t, i));
    const nd = -PI / 2 - .4 + needleOf(t, [{ t: K.ndl - .1, amp: .9 }], {}) + .25 * pulse(t, K.steer, K.steer + 1.2);
    inkRose(g, t, { x: W / 2, y: H / 2, R: H * .3, ring: 1, cross: 1, points: 1, letters: 1, icons: 1, lit, needle: nd, needleU: 1, glow: .4 * beatAt(t, 4) + .5 * u01(t, K.ndl + .2, K.ndl + 1) });
    // the envelope's flap line
    g.strokeStyle = 'rgba(80,56,32,.35)'; g.lineWidth = 4; g.beginPath(); g.moveTo(30, 30); g.lineTo(W / 2, H * .42); g.lineTo(W - 30, 30); g.stroke();
  }
  function drawHZ(ctx, t) {
    const C = camHZ(t), Cr = toR(C), thru = Cr.z > DESK.wallZ - .12 && Math.cos(C.yaw) > .5, inside = Cr.z < DESK.wallZ && !thru;   // thru: the camera is in the window opening (its frame already off screen) → just the world
    if (!inside) {
      outside(ctx, t, C);
      if (!thru && (C.z < -10 || Math.cos(C.yaw) < .3)) {
        const r = cliff(ctx, t, C, { O, z0: O[2] + 3 });
        if (r.win) {
          ctx.save(); ctx.beginPath(); r.win.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.clip();
          room(ctx, t, Cr, roomOpts(t, { fill: true }));
          plan(ctx, t, Cr, { burn: u01(t, K.planW + .2, b('breaking') + .9) });
          flakes(ctx, t, Cr, t - K.planW - .3, { side: 'in' });
          ctx.restore();
          flakes(ctx, t, Cr, t - K.planW - .3, { side: 'out' });
        }
      }
    } else {
      room(ctx, t, Cr, roomOpts(t, { outsideDraw: (g, tt, Cd) => outside(g, tt, camera({ x: Cd.x + O[0], y: Cd.y + O[1], z: Cd.z + O[2], yaw: Cd.yaw, pitch: Cd.pitch, F: Cd.F })) }));
      plan(ctx, t, Cr, { burn: u01(t, K.planW + .2, b('breaking') + .9) });
      flakes(ctx, t, Cr, t - K.planW - .3, {});
    }
    // your hand: picks the envelope up, holds it through the five beats, lowers it out of frame at the end (expo-in)
    if (t > K.cmp - .5 && t < K.last + 1.6) {
      const P = envCorners(t).map((p) => Cr.P(...p));
      if (P.every(Boolean)) {
        const bot = [(P[2][0] + P[3][0]) / 2, (P[2][1] + P[3][1]) / 2], hu = sio(u01(t, K.cmp - .5, K.cmp + .05));
        handDraw(ctx, bot[0] + 60 + (1 - hu) * 500, bot[1] + 110 + (1 - hu) * 600, 1.9, { pose: 'grip', ang: -1.75, flip: true, skin: '#c99a74', sleeve: '#2a2236', sleeveLen: 900, rim: '#ffc890', light: [-.4, -1], t, seed: 9, close: .8 });
      }
    }
    // out of the line: the world rises out of the dark round the horizon
    const dk = 1 - u01(t, K.hz0 + .05, K.hz0 + .85);
    if (dk > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(2,2,8,${dk})`; ctx.fillRect(0, 0, 1920, 1080); ctx.restore(); lineAt(ctx, 540, dk); }
  }

  // ================================================================ cut list
  const ACTS = [[K.in, drawBE], [K.cn0, drawCN], [K.lineA, drawC7], [K.hz0, drawHZ]];
  for (let i = 1; i < ACTS.length; i++) if (!(ACTS[i][0] > ACTS[i - 1][0])) throw new Error(`sc11: act ${i} starts before act ${i - 1}`);
  function frame(ctx, t) { let f = ACTS[0][1]; for (const [t0, g] of ACTS) if (t >= t0) f = g; f(ctx, t); }
  prepareSky();
  await ready();
  const PR = { riso: .35 };
  return [
    { t: K.in, tr: 'cut', d: .1, draw: frame, print: HI.print },
    { t: K.cn0 + .5, tr: 'cut', d: .1, draw: frame, print: PR },
    { t: K.c7a + .1, tr: 'cut', d: .1, draw: frame, print: hasC7 ? { riso: .15, halftone: .4, hatch: .3 } : PR },
    { t: K.c7b + .1, tr: 'cut', d: .1, draw: frame, print: PR },
  ];
}
