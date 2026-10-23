// c07 · 06a the fork + 07a learning to conduct (shots 6.01–7.11), 332.75 → 391.23. Owner: B2.
// One perspective take over one ground plane (lib/f8_c07_world.mjs): night → the fork → fog → "We do." → dawn opens from the horizon →
// the warm land of small workshops → the Kenya street (paper) → the mentor → the chart on the stall's board → the path → the crane into dusk.
import { W, H, rgba, clamp, mix, sm, prng } from '../engine.mjs';
import { handsOf, TSHIFT } from '../lib/handoff4.mjs';
import { ready, F8, firefly, conductor, qio, eoutX, einX } from '../lib/f8_kit.mjs';
import { figureFlat, POSES, walk } from '../lib/figure.mjs';
import { paperGround, INK, chartCard, chartReady } from '../lib/f8_chart.mjs';
import { dayFly, stallDetail, vendorDraw, VEND } from '../lib/f8_c06_world.mjs';
import { lineGround, lineOnly } from '../lib/f8_c06_world.mjs';
import { c07Ready, pcamKeys, mkCam, withRoll, rolled, skyCopy, horizonHills, hedges, roadEdges, thread, houses, tower, ROAD, HOUSES, TOWER, fogBand, glow, ease, groundPath, DAY, facade, dayHouse, skyDayDusk, CRANE_PITCH, STREET, PATH, along, squareVignette, guildHall, mixHex } from '../lib/f8_c07_world.mjs';

const TAU = Math.PI * 2;

export default async (T, R) => {
  await ready(); await c07Ready(); await chartReady();
  const { in: HI, out: HO } = handsOf('c07', T);
  const s6 = (p) => T.S('06a', p), s7 = (p) => T.S('07a', p);
  const A = {
    hb: HI.b, so: s6('So here'), real: s6('real question'), ifany: s6('If anyone'), many: s6('many people'), or: s6('Or will'), outside: s6('outside'),
    ifyou: s6('If you could'), build: s6('build'), idk: s6('I don\'t know'), nobody: s6('Nobody'), but: s6('But the technology'), doesnt: s6('doesn\'t choose'),
    we: s6('We do'), doW: s6('We do') + .36, so7: s7('So how'), learn: s7('learn'), notAlone: s7('Not alone'), alone: s7('alone.'), remember: s7('Remember Kenya'), kenya: s7('Kenya?'),
    older: s7('An older study'), simpler: s7('simpler'), women: s7('Women running'), mentor: s7('mentor'), their: s7('Their profits'), twenty: s7('twenty percent'),
    effect: s7('The effect faded'), faded: s7('faded'), butP: s7('But it points'), points: s7('points'), maybe: s7('Maybe what'), smarter: s7('smarter machine'),
    its: s7('It\'s a person'), walked: s7('walked the road'), any: s7('Any company'), guild: s7('guild'), ha: HO.a,
  };
  // ---------------------------------------------------------------- camera (one take)
  const cam = pcamKeys([
    { t: A.hb, x: -20, z: -3200, h: 1500, yaw: 0, pitch: Math.PI / 2, roll: Math.PI / 2, F: 1500, oy: 0 },
    { t: A.real + .35, x: 0, z: 800, h: 10500, roll: 0 },
    { t: A.ifany - .1, x: -120, z: 900, h: 9800 },
    { t: A.many + .1, x: -900, z: -300, h: 1500, yaw: -.42, pitch: .5 },
    { t: A.or - .4, x: -1400, z: 500, h: 900, yaw: -.5, pitch: .3 },
    { t: A.or + 2.4, x: 1330, z: 4300, h: 17, yaw: .16, pitch: -.1, oy: 70 },
    { t: A.outside - .05, x: 1342, z: 4335, h: 17, yaw: .15, pitch: -.13 },
    { t: A.ifyou + 1.0, x: 0, z: -150, h: 55, yaw: 0, pitch: 0, oy: -210, F: 1355 },
    { t: A.idk, x: 0, z: -143, h: 55 },
    { t: A.doW + .2, x: 0, z: -128, h: 54 },
    { t: A.so7 + .4, x: -1500, z: 700, h: 170, yaw: -.32, pitch: .1, oy: -180, F: 1450 },
    { t: A.learn + .2, x: -1650, z: 1100, h: 120, yaw: -.22, pitch: .07, oy: -160 },
    { t: A.notAlone - .05, x: -1452, z: 2400, h: 15, yaw: 0, pitch: 0, oy: 40, F: 1500 },
    { t: A.remember - .1, x: -1448, z: 2404, h: 15 },
    { t: A.older - .2, x: -1440, z: 2300, h: 16 },
    { t: A.simpler, x: -1400, z: 2296, h: 16 },
    { t: A.women + .5, x: -1305, z: 2482, h: 11 },
    { t: A.their - .25, x: -1303, z: 2488, h: 11 },
    { t: A.their + 1.35, x: -1305, z: 2562, h: 24.5 },
    { t: A.butP - .6, x: -1305, z: 2560, h: 24.5 },
    { t: A.points + .55, x: -1292, z: 2390, h: 17, pitch: .02, oy: -20, F: 1600, e: 'in' },
    { t: A.maybe + .95, x: -1126, z: 2392, h: 30, pitch: .1, oy: -60, F: 1700, e: 'out' },
    { t: A.its, x: -1123, z: 2397, h: 30 },
    { t: A.any - .3, x: -1121, z: 2396, h: 30 },
    { t: A.guild, x: -604, z: 2262, h: 36, pitch: .04, F: 1400 },
    { t: A.guild + .25, x: -600, z: 2260, h: 37 },
    { t: A.ha, x: -596, z: 2150, h: 330, pitch: CRANE_PITCH, oy: 0, F: 1500 },
  ]);
  const yawSwing = (t) => .045 * Math.sin(TAU * (t - A.idk) / 1.9) * sm(clamp((t - A.idk) / .3)) * (1 - sm(clamp((t - A.nobody + .2) / .4)));
  const CON = { X: 0, Z: 0, Hw: 28 };   // the conductor on the fork (hero scale)
  // the question firefly: along the trunk to the fork, then ahead along the left branch
  const qfly = (t) => {
    if (t < A.real) { const u = sm(clamp((t - A.hb - .1) / (A.real - A.hb - .1))); return [0, 26, mix(-5200, 0, u)]; }
    if (t < A.ifany + .2) return [6 * Math.sin(t * 2.3), 26 + 4 * Math.sin(t * 3.1), 4 * Math.cos(t * 1.7)];
    const u = clamp((t - A.ifany - .2) / 4.8), L = ROAD.left, i = u * (L.length - 2), k = Math.floor(i), f = i - k;
    const p = [mix(L[k][0], L[k + 1][0], f), mix(L[k][1], L[k + 1][1], f)]; return [p[0], 26 + 40 * u, p[1]];
  };
  // the row of workshops we come down to (7.01–7.02); the land's other houses keep clear of it
  const ROWZ = 2600, ROW = []; for (let k = 0; k < 9; k++) ROW.push({ i: 9000 + k, X: -1310 - k * 190, Z: ROWZ + 4 + (k % 2) * 10, u: .62, seed: k * .13 % 1, yaw: 0, rank: (k * .37) % 1, row: k });
  const segD = (px, pz, ax, az, bx, bz) => { const vx = bx - ax, vz = bz - az, k = clamp(((px - ax) * vx + (pz - az) * vz) / (vx * vx + vz * vz)); return Math.hypot(px - ax - vx * k, pz - az - vz * k); };
  const pathD = (x, z) => { let m = 1e9; for (let i = 1; i < PATH.length; i++) m = Math.min(m, segD(x, z, PATH[i - 1][0], PATH[i - 1][1], PATH[i][0], PATH[i][1])); return m; };
  const LAND = HOUSES.filter((h) => !(Math.abs(h.Z - ROWZ) < 420 && h.X > -3200 && h.X < -400) && !(h.X > -1700 && h.X < 400 && h.Z > 1700 && h.Z < 3300) && segD(h.X, h.Z, -1500, 700, -1452, 2400) > 380 && segD(h.X, h.Z, -1650, 1100, -1452, 2400) > 380 && pathD(h.X, h.Z) > 420 && segD(h.X, h.Z, 0, -128, -1500, 700) > 480).concat(ROW);
  const HERO = ROW[1];   // the figure we come to (it drops its hand on "learn")
  // houses switch on: those near the left branch one after another as the firefly passes, then hundreds at once on "many"
  const onAt = new Map();
  for (const h of LAND) {
    const near = h.Z < 6500 && Math.abs(h.X - (h.Z < 5200 ? -2600 * (h.Z / 5200) : -2600)) < 1100;
    onAt.set(h.i, near ? A.ifany + .6 + clamp((h.Z - 1300) / 5200) * 2.0 + .15 * h.rank : A.many + .02 + .3 * h.rank * h.rank);
  }
  const litOf = (h, t) => clamp((t - onAt.get(h.i)) / .12);
  // the crowd at the foot of the tower (backs to us); CROWD[0] turns into profile on "outside"
  const CROWD = (() => { const r = prng(808), L = [{ X: 1398, Z: 4545, s: 1, seed: 3 }]; for (let i = 0; i < 46; i++) L.push({ X: TOWER.X + (r() - .5) * 900, Z: TOWER.Z - TOWER.d / 2 - 90 - r() * 620, s: .92 + .16 * r(), seed: 10 + i }); return L.filter((p, i) => i === 0 || Math.hypot(p.X - 1398, p.Z - 4545) > 50); })();
  // the swarm above the fork (6.07–6.08): 24 fireflies, screen space around the conductor's head
  const SW = (() => { const r = prng(4040), L = []; for (let i = 0; i < 24; i++) L.push({ side: i % 2 ? 1 : -1, a: r() * TAU, rr: r(), ph: r() * TAU, sp: .7 + r() * .8, d: r() }); return L; })();
  // ---------------------------------------------------------------- 07a, by day
  const HX = HERO.X + 70 * HERO.u, HZ = 2586;                                  // the hero (drops its hand on "learn")
  const NEW = (t) => { const u = clamp((t - (A.so7 + .5)) / (A.alone + .3 - A.so7 - .5)), e = 1 - (1 - u) * (1 - u); return { X: mix(-1290, HX + 29, e), walking: u < 1, ph: (mix(-1290, HX + 29, e) - -1290) / -26 * TAU }; };
  const foldAt = (h) => A.remember + .02 + Math.abs(h.X - HERO.X) / 1700 * .35;
  const phOf = (h, t) => h.row == null ? 1 : 1 - eioQ(clamp((t - foldAt(h)) / .35));
  const K0 = 3, popAt = (st) => A.kenya - .16 + Math.abs(st.k - K0) * .028;
  const popS = (st, t) => { const u = (t - popAt(st)) / .34; if (u <= 0) return 0; return Math.min(1.04, eoutX(u) * 1.04) - .04 * clamp((u - 1) / .5); };
  const M = STREET[0], WOLD = { X: M.X - 27, Z: 2589 }, WYNG = { X: M.X + 27, Z: 2589 };       // the mentor stall and the two women
  const SHEET = { x0: -21, y0: -35.5, w: 42, h: 21 };                                       // the ledger sheet on its back board (stall local units)
  const CH = { w: 1000, h: 500, plot: [.09, .2, .9, .8] }, BASEV = .28;
  const rise = (t) => sm(clamp((t - A.their - .75) / (A.twenty - A.their - .75))) * (1 - sm(clamp((t - A.effect - .05) / (A.faded + .05 - A.effect))));
  const profit = (u, r) => BASEV + .38 * r * sm(clamp((u - .25) / .75));
  // plot (u,v) on the sheet → world
  const sheetW = (u, v) => { const lx = SHEET.x0 + (CH.plot[0] + u * (CH.plot[2] - CH.plot[0])) * SHEET.w, ly = SHEET.y0 + (CH.plot[1] + (1 - v) * (CH.plot[3] - CH.plot[1])) * SHEET.h; return [M.X + lx, -ly, M.Z]; };
  // the arrow → path: the line on the sheet tilts up, runs past the edge, lies down as the path to the horizon
  const ARROW = (t, n = 70) => {
    const tilt = sm(clamp((t - A.butP + .05) / .45)), ext = eoutX(clamp((t - A.butP - .15) / .6)), lie = sm(clamp((t - A.points - .1) / 1.1));
    const out = [];
    for (let i = 0; i <= n; i++) {
      const q = i / n, uu = q * (1 + 1.6 * ext);
      const a = sheetW(uu, BASEV + .12 * tilt * uu); if (uu > 1.02) a[2] -= (uu - 1) * 6;
      const g = along(PATH, q * (.06 + .94 * lie)), b = [g[0], 0, g[1]];
      out.push([mix(a[0], b[0], lie), mix(a[1], b[1], lie), mix(a[2], b[2], lie)]);
    }
    return { pts: out, lie };
  };
  const AF = { X: -1150, Z: 2560 }, BSTOP = -1121, BZ = 2550;                               // the struggling conductor, where the older one stops
  const PL = (() => { let L = 0; for (let i = 1; i < PATH.length; i++) L += Math.hypot(PATH[i][0] - PATH[i - 1][0], PATH[i][1] - PATH[i - 1][1]); return L; })();
  const S_STOP = 175 / PL, S_START = 330 / PL;   // path fractions: where B stops (beside A) and where it starts walking
  const BPOS = (t) => { const u = clamp((t - A.maybe - .2) / (A.walked - .35 - A.maybe - .2)), e = u < 1 ? u * (2 - u) * .5 + u * .5 : 1, sf = mix(S_START, S_STOP, e), p = along(PATH, sf); return { X: p[0], Z: p[1] + 4, walking: u < 1, ph: (S_START - sf) * PL / 22 * TAU }; };
  const VIG = [{ k: 'shop', X: -890, Z: 2585 }, { k: 'square', X: -755, Z: 2572 }, { k: 'guild', X: -600, Z: 2600 }];
  const BIG = (() => { const r = prng(5150), L = []; for (let i = 0; i < 30; i++) L.push({ a: r() * TAU, rr: .3 + r() * .7, sp: .8 + r() * 1.4, ph: r() * TAU, d: r(), row: i % 3, col: Math.floor(i / 3) }); return L; })();
  const PR = HI.print;
  // dawn: a front opens from the horizon, up the sky and down the land
  const DAWN0 = A.doW + 1.15, DAWN1 = A.so7 + .3;
  const dawnU = (t) => sm(clamp((t - DAWN0) / (DAWN1 - DAWN0)));

  const drawWorld = (ctx, t, c, day) => {
    withRoll(ctx, c, (g) => {
      if (c.horizon > -30) {
        if (day) skyDayDusk(g, t, c, { sun: [SUNAZ, 620, .7] }); else { skyCopy(g, t, 'night', -c.yaw * c.F, c.horizon - H, { clipY: c.horizon + 1 }); }
        horizonHills(g, c, day ? '#e6cf9f' : '#0e1030', { edge: day ? rgba(DAY.ink, .45) : rgba('#8a80d0', .25) });
      }
      hedges(g, c, day ? rgba(DAY.ink, .16) : rgba('#a096dc', .07));
      if (!day || t < A.their + 1.5) roadEdges(g, c, sm(clamp((t - A.so) / 1.2)), day ? rgba(DAY.ink, .55) : rgba('#a096dc', .3), 1.1);
      if (day && t > A.points) { const ar = ARROW(t); if (ar.lie >= 1) pathInk(g, c, ar.pts); }
    });
  };

  const draw = (ctx, t) => {
    const cc = cam(t); cc.yaw += yawSwing(t); const c = mkCam(cc);
    const du = dawnU(t), hz = c.horizon, fGround = mix(hz, H + 260, du), fSky = mix(hz, -260, du);
    // ---- ground (screen space): the line plate's ground, its glow following the fork
    const fork = rolled(c, c.P(0, 0, 0));
    const gu = clamp((t - A.hb) / 1.6), gx = fork ? mix(W / 2, clamp(fork[0], 0, W), sm(gu)) : W / 2, gy = fork ? mix(560, clamp(fork[1], 0, H), sm(gu)) : 560;
    if (du < 1) { groundNight(ctx, t, gx, gy); drawWorld(ctx, t, c, false); }
    if (du > 0) { ctx.save(); if (du < 1) { ctx.beginPath(); ctx.rect(0, fSky, W, fGround - fSky); ctx.clip(); } groundDay(ctx, t, c); drawWorld(ctx, t, c, true); ctx.restore(); }
    // the thread (the plate's line): trunk + both branches growing from the fork (night only)
    if (du < 1) {
      const bob = 2 * Math.sin(t * .9) * (1 - sm(clamp((t - A.hb) / 1.0)));
      ctx.save(); ctx.translate(0, bob); if (du > 0) { ctx.beginPath(); ctx.rect(0, 0, W, fSky); ctx.rect(0, fGround, W, H); ctx.clip(); }
      withRoll(ctx, c, (g) => {
        const anchor = c.P(0, 0, -3200);
        thread(g, t, c, ROAD.trunk, { tone: 'gold', anchor });
        const bl = sm(clamp((t - A.so - .2) / 1.3));
        if (bl > 0) { thread(g, t, c, partN(ROAD.left, bl), { tone: 'gold', anchor }); thread(g, t, c, partN(ROAD.right, bl), { tone: 'gold', anchor }); }
      });
      ctx.restore();
    }
    if (du > 0 && t < A.their + 1.5) { ctx.save(); if (du < 1) { ctx.beginPath(); ctx.rect(0, fSky, W, fGround - fSky); ctx.clip(); } withRoll(ctx, c, (g) => { g.strokeStyle = rgba(DAY.ochre, .8); g.lineWidth = 1.6; g.setLineDash([10, 9]); for (const pth of [ROAD.trunk, ROAD.left, ROAD.right]) { g.beginPath(); groundPath(g, c, pth); g.stroke(); } g.setLineDash([]); }); ctx.restore(); }
    // ---- houses, tower, crowd (night below the fronts / day between them)
    const glowA = 1 + .7 * sm(clamp((t - A.doW - .1) / .8));
    const people = (g, day) => {
      // figures before the row's workshops (7.01–7.02): conductors in profile, half-raised hands, hesitant little swarms
      return (h, sx, sy, s, d) => {
        if (!day) return;
        const fx = h.X + 70 * h.u, fz = h.Z - 26, fp = c.P(fx, 0, fz); if (!fp) return; const fs = c.F * 20 / fp[2] / 185; if (fs * 185 < 5) return;
        if (h.row != null) { if (h === HERO) return; const ph = phOf(h, t); if (ph <= .02) return; g.save(); g.translate(fp[0], fp[1]); g.scale(1, ph); g.translate(-fp[0], -fp[1]); if (fs * 185 < 40) miniFig(g, fp[0], fp[1], fs * 185, .55, h.row % 2 === 1); else conductor(g, t, fp[0], fp[1], fs, { view: 'profile', pose: 'handHalf', flip: h.row % 2 === 1, seed: 30 + h.row, glow: 0 }); g.restore(); return; }
        if (fs * 185 < 40) { miniFig(g, fp[0], fp[1], fs * 185, .55 + .1 * Math.sin(t * 1.3 + h.i), (h.i % 2) === 1); if (fs * 185 > 14) for (let k = 0; k < 3; k++) { const ph = t * (1.2 + k * .2) + k * 2 + h.i; dayFly(g, t, { x: fp[0] + ((h.i % 2) ? -1 : 1) * (.3 + .12 * Math.sin(ph)) * fs * 185, y: fp[1] - (.95 + .1 * Math.cos(ph * 1.3)) * fs * 185, s: clamp(fs * 2, .4, 1.4), seed: k + h.i, glow: .6 }); } return; }
        const fl = (h.i % 2) === 1, r = conductor(g, t, fp[0], fp[1], fs, { view: 'profile', pose: 'handHalf', flip: fl, seed: 30 + (h.i % 20), glow: 0 });
        for (let k = 0; k < 4; k++) { const ph = t * (1.1 + k * .17) + k * 2.1 + h.i; dayFly(g, t, { x: r.hand[0] + (fl ? -1 : 1) * (40 + 22 * Math.sin(ph)) * fs, y: r.hand[1] - 20 * fs + Math.sin(ph) * 12 * fs, s: clamp(fs * 2.2, .5, 2.2), seed: k + h.i, glow: .8 }); }
      };
    };
    const housesPass = (day) => withRoll(ctx, c, (g) => {
      houses(g, t, c, { list: LAND, day, lit: litOf, fig: (h, tt) => litOf(h, tt), hand: (h, tt) => .6 + .4 * clamp((tt - onAt.get(h.i) - .3) / .5), glowA, after: people(g, day), ph: day ? phOf : null, extra: day ? dayExtras(t, c) : null });
      if (!day) tower(g, t, c);
      // the crowd at the tower's foot
      if (!day && Math.hypot(c.x - TOWER.X, c.z - TOWER.Z) < 3000) {
        const vis = CROWD.map((p) => [p, c.P(p.X, 0, p.Z)]).filter((q) => q[1]).sort((a, b) => b[1][2] - a[1][2]);
        for (const [p, fp] of vis) {
          const fs = c.F * 18 * p.s / fp[2] / 185; if (fs * 185 < 4 || fp[0] < -200 || fp[0] > W + 200) continue;
          if (p === CROWD[0]) { const u = clamp((t - A.outside + .05) / .36), sq = Math.abs(Math.cos(Math.PI * u));
            g.save(); g.translate(fp[0], fp[1]); g.scale(Math.max(.02, sq), 1); g.translate(-fp[0], -fp[1]);
            if (u < .5) conductor(g, t, fp[0], fp[1], fs, { view: 'back', pose: 'stand', seed: p.seed, rim: .25, glow: 0, light: { x: fp[0] + 300, y: fp[1] - 900, col: F8.amber, a: .4 } });
            else figureFlat(g, fp[0], fp[1] - 92 * fs, fs, { ...POSES.look, head: -.42, coat: true }, { t, seed: 3, col: '#141830', rim: '#cfdcf4', rimSide: 1, fast: true, shadow: false });
            g.restore(); continue; }
          conductor(g, t, fp[0], fp[1], fs, { view: 'back', pose: 'stand', seed: p.seed, rim: .2, glow: 0, light: { x: fp[0] + 200, y: fp[1] - 900, col: F8.amber, a: .3 } });
        }
      }
    });
    if (du < 1) { ctx.save(); if (du > 0) { ctx.beginPath(); ctx.rect(0, 0, W, fSky); ctx.rect(0, fGround, W, H); ctx.clip(); } housesPass(false); ctx.restore(); }
    if (du > 0) { ctx.save(); if (du < 1) { ctx.beginPath(); ctx.rect(0, fSky, W, fGround - fSky); ctx.clip(); } housesPass(true); ctx.restore(); }
    // the dawn's two edges: warm light bands
    if (du > 0 && du < 1) { const ba = .32 * sm(clamp(du / .12)) * sm(clamp((1 - du) / .12)); for (const [y, dir] of [[fSky, -1], [fGround, 1]]) { const g = ctx.createLinearGradient(0, y - 160 * dir, 0, y + 30 * dir); g.addColorStop(0, 'rgba(255,214,150,0)'); g.addColorStop(.8, `rgba(255,200,130,${ba.toFixed(4)})`); g.addColorStop(1, 'rgba(255,240,210,.0)'); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(0, Math.min(y - 160 * dir, y + 30 * dir), W, 190); ctx.restore(); } }
    if (t > A.so7) dayOverlays(ctx, t, c);
    // ---- fog (6.05–6.08): rises from below, covers both branches, tears open on "We do"
    const fogUp = sm(clamp((t - A.idk + .1) / (A.nobody + .35 - A.idk + .1))), tear = sm(clamp((t - A.doW - .05) / 1.3));
    const fogTop = mix(H + 120, 120, fogUp) + tear * 900, spread = tear * 1500;
    const fogLayer = (y0, a, tone, seed, sp) => {
      if (fogUp <= 0 || y0 > H || tear >= 1) return;
      for (const side of [-1, 1]) { ctx.save(); ctx.beginPath(); ctx.rect(side < 0 ? -2000 : W / 2, -10, W / 2 + 2000, H + 20); ctx.clip(); ctx.translate(side * spread, 0);
        fogBand(ctx, t, y0, y0 + 520, { tone, a, seed, speed: sp }); const fc = tone === 'pale' ? '#8e8ac2' : '#5e5a92', gg = ctx.createLinearGradient(0, y0 + 150, 0, y0 + 420); gg.addColorStop(0, rgba(fc, 0)); gg.addColorStop(1, rgba(fc, a * .96)); ctx.fillStyle = gg; ctx.fillRect(-2000, y0 + 150, W + 4000, H + 400); ctx.restore(); }
    };
    fogLayer(fogTop, .92, 'night', 1, 18); fogLayer(fogTop + 140, .9, 'pale', 2, -11);
    // ---- the conductor on the fork, back to us; its light pool
    {
      const fp = c.P(CON.X, 0, CON.Z);
      if (fp) {
        const s = c.F * CON.Hw / fp[2] / 185, fr = rolled(c, fp);
        if (fogUp > 0) glow(ctx, 'pool', fr[0], fr[1] - 10 * s, 260 * s * (.6 + .4 * fogUp), .9 * fogUp * (1 - tear * .6));
        if (s * 185 > 5) {
          const half = clamp((t - A.build + .15) / .45), full = clamp((t - A.we - .05) / .4);
          const pose = full > 0 ? 'handRaised' : half > 0 ? 'handHalf' : 'stand', from = full > 0 ? 'handHalf' : 'stand', u = full > 0 ? eoutX(full) : eoutX(half);
          withRoll(ctx, c, (g) => { CONP = conductor(g, t, fp[0], fp[1], s, { view: 'back', pose, from, u, seed: 8, light: { x: fp[0] - 700, y: fp[1] - 300, col: F8.amber, a: .9 }, glow: full > 0 ? .8 * full : 0 }); });
        }
      }
    }
    // ---- the question firefly (6.01–6.02)
    withRoll(ctx, c, (g) => { const q = qfly(t), qp = c.P(q[0], q[1], q[2]); if (qp && t < A.or + .5) firefly(g, t, { x: qp[0], y: qp[1], s: clamp(c.F * 3 / qp[2], .5, 2.2), seed: 21, glow: 1.2 }); });
    // ---- the swarm (6.07 rises out of the fog, splits in two, hangs; 6.08 turns left 100 ms after the hand and flows over the left branch)
    if (t > A.but - .3 && CONP) {
      const hd = CONP.head, cx = hd[0], cy = hd[1] - 150, rise = sm(clamp((t - A.but + .3) / .9)), split = sm(clamp((t - A.but - .45) / (A.doesnt - A.but - .35)));
      const go = clamp((t - A.doW - .1) / 2.6), goE = go * go * (3 - 2 * go);
      const night = 1 - du;
      for (let i = 0; i < SW.length; i++) {
        const f = SW[i], hov = (1 - .85 * split * (1 - go)) ;
        let x = cx + Math.cos(f.a + t * f.sp * hov) * 90 * f.rr + f.side * 260 * split, y = cy + Math.sin(f.a * 1.7 + t * f.sp * .8 * hov) * 46 * f.rr + mix(420, 0, rise);
        if (go > 0) { // flow: left and away along the left branch (screen), staggered
          const gi = clamp((t - A.doW - .1 - f.d * .25) / 2.4), e = gi * gi * (3 - 2 * gi);
          const tx = mix(x, 260 + 120 * f.rr - 140 * e, e), ty = mix(y, c.horizon + 30 + 40 * f.rr, e);
          x = mix(x, tx, e) + Math.sin(t * 3 + f.ph) * 8; y = mix(y, ty, e);
        }
        const sz = mix(1.5, .7, goE);
        if (y > fogTop + 60 && go <= 0) continue;   // still inside the fog
        if (night > 0) firefly(ctx, t, { x, y, s: sz, seed: 40 + i, glow: 1, a: night });
        if (night < 1) dayFly(ctx, t, { x, y, s: sz, seed: 40 + i, a: 1 - night });
      }
    }
  };
  let CONP = null;
  // ---- the depth-sorted things of the day: stalls, vendors, the hero + newcomer, the women, A + B, the vignettes and their pairs
  const SUNAZ = .19;
  const figAt = (cam, X, Z, Hw = 17) => { const fp = cam.P(X, 0, Z); if (!fp) return null; return [fp[0], fp[1], cam.F * Hw / fp[2] / 185]; };
  const shadowOf = (g, x, y, fs, pose, o = {}) => { g.save(); g.translate(x, y); g.transform(1, 0, .95, -.32, 0, 0); figureFlat(g, 0, -92 * fs, fs, pose, { t: o.t, seed: o.seed, col: 'rgba(60,40,24,.22)', fast: true, flip: o.flip, shadow: false }); g.restore(); };
  const dayExtras = (t, c) => {
    const L = [];
    if (t > popAt(STREET[STREET.length - 1]) - 1.2 || t > A.kenya - .3) for (const st of STREET) {
      L.push({ X: st.X, Z: st.Z, draw: (g, cam) => facade(g, cam, st.X, st.Z, 1, (gg, sc) => { const p = popS(st, t); if (p <= 0) return; stallDetail(gg, t, { x: 0, y: 0, s: 1, seed: st.seed }, p, sc); if (st === M) sheetDraw(gg, t, sc, p); }, { r: 60 }) });
      if (st.k > 3) { const X = st.X + (st.flip ? 14 : -16); L.push({ X, Z: 2591, draw: (g, cam) => { const f = figAt(cam, X, 2591); if (!f || f[2] * 185 < 4 || f[0] < -100 || f[0] > W + 100) return; const p = popS(st, t); if (p <= 0) return; g.save(); g.translate(f[0], f[1]); g.scale(1, p); g.translate(-f[0], -f[1]); vendorDraw(g, t, f[0], f[1] - 92 * f[2], f[2], { seed: st.vs, flip: !st.flip, phone: false, shadow: f[2] > .3 }); g.restore(); } }); }
    }
    // the hero and the newcomer (7.01–7.04)
    if (t < A.maybe) {
      L.push({ X: HX, Z: HZ, draw: (g, cam) => { const f = figAt(cam, HX, HZ, 20); if (!f || f[2] * 185 < 5) return; const drop = sm(clamp((t - A.learn - .05) / .5)), up = sm(clamp((t - A.alone - .1) / .6));
        HEROP = conductor(g, t, f[0], f[1], f[2], { view: 'profile', pose: up > 0 ? 'handHalf' : drop > 0 ? 'stand' : 'handHalf', from: up > 0 ? 'stand' : 'handHalf', u: up > 0 ? up : drop > 0 ? drop : 1, flip: false, seed: 31, glow: 0 }); } });
      const nw = NEW(t); if (t > A.so7 + .5) L.push({ X: nw.X, Z: HZ - 3, draw: (g, cam) => { const f = figAt(cam, nw.X, HZ - 3, 20.5); if (!f || f[2] * 185 < 5) return; conductor(g, t, f[0], f[1], f[2], { view: 'profile', pose: nw.walking ? 'walk' : 'handHalf', from: 'stand', u: sm(clamp((t - A.alone - .2) / .6)), walkPhase: nw.ph, flip: true, seed: 44, glow: 0 }); } });
    }
    // the two women at the mentor stall (7.03–7.07)
    if (t > A.kenya - .2 && t < A.maybe + 1) {
      const p0 = (tt) => popS(M, tt);
      L.push({ X: WOLD.X, Z: WOLD.Z, draw: (g, cam) => { const f = figAt(cam, WOLD.X, WOLD.Z); if (!f || f[0] < -300 || f[0] > W + 300) return; const p = p0(t); if (p <= 0) return; const pt = sm(clamp((t - A.women - .6) / .6)) * (1 - sm(clamp((t - A.their - .2) / .5)));
        const pose = { lean: .05, head: .06, hair: 'bun', sh: [mix(.15, 1.45, pt), .1], el: [mix(.3, .12, pt), .3] };
        g.save(); g.translate(f[0], f[1]); g.scale(1, p); g.translate(-f[0], -f[1]); figureFlat(g, f[0], f[1] - 92 * f[2], f[2], pose, { t, seed: 61, col: '#2e2622', accent: '#c9893f', accentPart: 'scarf', fast: f[2] < .5, shadow: f[2] > .3, flip: false }); g.restore(); WOLDP = f; } });
      L.push({ X: WYNG.X, Z: WYNG.Z, draw: (g, cam) => { const f = figAt(cam, WYNG.X, WYNG.Z, 16.4); if (!f || f[0] < -300 || f[0] > W + 300) return; const p = p0(t); if (p <= 0) return; const nod = clamp((t - A.women - 1.0) / .3) * (1 - clamp((t - A.their) / .3)), hd = .04 + nod * .1 * Math.max(0, Math.sin((t - A.women) * 4.2));
        g.save(); g.translate(f[0], f[1]); g.scale(1, p); g.translate(-f[0], -f[1]); figureFlat(g, f[0], f[1] - 92 * f[2], f[2], { head: hd, hair: 'long', skirt: true, sh: [.2, .1], el: [.9, .3] }, { t, seed: 62, col: '#2a2320', accent: '#5f8f6a', accentPart: 'sweater', fast: f[2] < .5, shadow: f[2] > .3, flip: true }); g.restore(); WYNGP = f; } });
    }
    // the struggling conductor A and the older one B (7.08–7.11), long shadows toward us
    if (t > A.butP) {
      L.push({ X: AF.X, Z: AF.Z, draw: (g, cam) => { const f = figAt(cam, AF.X, AF.Z, 19); if (!f || f[0] < -300 || f[0] > W + 300) return; const wob = clamp((t - A.maybe - 1.2) / .4) * (1 - sm(clamp((t - A.walked) / .5)));
        const u = clamp(.75 + .25 * Math.sin(t * 5.3) * wob); shadowOf(g, f[0], f[1], f[2], { coat: true, sh: [1.1, .1], el: [.5, .3] }, { t, seed: 70 });
        AP = conductor(g, t, f[0], f[1], f[2], { view: 'profile', pose: 'handHalf', from: 'stand', u, flip: false, seed: 70, glow: 0, light: { x: f[0] + 900, y: f[1] - 200, col: F8.amber, a: .9 } }); } });
      const b = BPOS(t);
      L.push({ X: b.X, Z: b.Z, draw: (g, cam) => { const f = figAt(cam, b.X, b.Z, 17.6); if (!f || f[0] < -300 || f[0] > W + 300) return; const hu = sm(clamp((t - A.walked + .3) / .55));
        const pose = b.walking ? { ...walk(b.ph), lean: .07, hair: 'bun' } : { lean: .06, hair: 'bun', head: .02, sh: [mix(.15, 1.15, hu), .1], el: [mix(.3, .55, hu), .3] };
        shadowOf(g, f[0], f[1], f[2], pose, { t, seed: 71, flip: true });
        figureFlat(g, f[0], f[1] - 92 * f[2], f[2], pose, { t, seed: 71, col: '#2b2420', accent: '#8a5a3a', accentPart: 'scarf', fast: f[2] < .5, shadow: true, flip: true, rim: '#ffd9a0', rimSide: -1 }); BP = f; } });
    }
    // the three vignettes (7.11), each with a pair (an experienced and a new figure)
    if (t > A.maybe) for (const v of VIG) {
      L.push({ X: v.X, Z: v.Z, draw: (g, cam) => facade(g, cam, v.X, v.Z, v.k === 'guild' ? .9 : v.k === 'square' ? .8 : .42, (gg, sc) => { if (v.k === 'shop') dayHouse(gg, t, .6, { lw: 1.1 / sc, detail: sc > .9 }); else if (v.k === 'square') squareVignette(gg, 1.1 / sc); else guildHall(gg, 1.1 / sc); }, { r: 160 }) });
      for (const [dx, old] of [[-11, 1], [11, 0]]) { const X = v.X + dx + (v.k === 'square' ? 12 : 0), Z = v.Z - 22; L.push({ X, Z, draw: (g, cam) => { const f = figAt(cam, X, Z, old ? 16.6 : 16); if (!f || f[0] < -200 || f[0] > W + 200) return;
        figureFlat(g, f[0], f[1] - 92 * f[2], f[2], old ? { lean: .05, hair: 'bun', sh: [1.2, .1], el: [.5, .3] } : { head: -.08, hair: v.k === 'guild' ? 'curly' : 'short', sh: [.5, .1], el: [.9, .3] }, { t, seed: 80 + dx + v.X, col: '#2c2522', accent: old ? '#8a5a3a' : VEND[(v.X | 0) % 5 < 0 ? 1 : 2], accentPart: old ? 'scarf' : 'sweater', fast: true, shadow: true, flip: !old }); } }); }
    }
    return L;
  };
  let HEROP = null, WOLDP = null, WYNGP = null, AP = null, BP = null;
  // the ledger sheet on the mentor stall's back board, and its chart (7.05–7.08); local units of the stall
  const sheetDraw = (g, t, sc, p) => {
    g.save(); g.fillStyle = '#f4ecd8'; g.fillRect(SHEET.x0, SHEET.y0, SHEET.w, SHEET.h); g.strokeStyle = rgba(INK.ink, .55); g.lineWidth = .9 / sc; g.strokeRect(SHEET.x0, SHEET.y0, SHEET.w, SHEET.h);
    for (const [px, py] of [[SHEET.x0 + 1.5, SHEET.y0 + 1.5], [SHEET.x0 + SHEET.w - 1.5, SHEET.y0 + 1.5]]) { g.fillStyle = '#9b3a2a'; g.beginPath(); g.arc(px, py, .55, 0, TAU); g.fill(); }
    // unreadable ledger rows (before the chart draws itself over them)
    const cu = clamp((t - A.their + .1) / .5);
    g.strokeStyle = rgba(INK.ink, .22 * (1 - cu)); g.lineWidth = .5 / sc; g.beginPath(); for (let k = 0; k < 7; k++) { const y = SHEET.y0 + 3.2 + k * 2.5; g.moveTo(SHEET.x0 + 3, y); g.lineTo(SHEET.x0 + 3 + (k % 3 === 2 ? 22 : 34), y); } g.stroke();
    if (t > A.their - .1) {
      g.translate(SHEET.x0, SHEET.y0); g.scale(SHEET.w / CH.w, SHEET.h / CH.h);
      const r = rise(t), line = t > A.their + .55 && t < A.butP + .02;
      chartCard(g, t, { x: 0, y: 0, w: CH.w, h: CH.h, sheet: true, frame: clamp((t - A.their) / .9), plot: CH.plot, axis: clamp((t - A.their - .1) / .6),
        lines: line ? [{ f: (u) => profit(u, r), u: 1, w: 5, dotted: sm(clamp((t - A.effect - .05) / (A.faded - A.effect + .1))), bead: false }] : [],
        texts: [
          { text: '≈ +20 %', at: [.5, .97], size: 92, u: clamp((t - A.twenty + .05) / .45), snap: t - A.twenty - .3 },
          { text: 'PROFITS', at: [.535, .8], size: 30, font: 'caps', u: clamp((t - A.twenty - .25) / .5) },
        ],
        source: 'Brooks, Donovan & Johnson', su: clamp((t - A.their - .5) / .6), sourceSize: 26 });
    }
    g.restore();
  };
  // ink path on the ground (and in the air while it lies down)
  const pathInk = (g, cam, pts, o = {}) => {
    const sp = []; for (const q of pts) { const pp = cam.P(q[0], q[1], q[2]); if (pp) sp.push(pp); }
    if (sp.length < 2) return;
    g.save(); g.strokeStyle = INK.ink; g.lineCap = 'round'; g.lineJoin = 'round';
    if (o.dash) g.setLineDash(o.dash);
    for (let i = 1; i < sp.length; i++) { g.lineWidth = clamp((o.w ?? 3.2) * 260 / Math.max(1, (sp[i][2] + sp[i - 1][2]) / 2), .7, (o.w ?? 3.2) * 1.15); g.beginPath(); g.moveTo(sp[i - 1][0], sp[i - 1][1]); g.lineTo(sp[i][0], sp[i][1]); g.stroke(); }
    g.setLineDash([]);
    if (o.head) { const e = sp[sp.length - 1], p0 = sp[Math.max(0, sp.length - 4)], an = Math.atan2(e[1] - p0[1], e[0] - p0[0]), L = o.head; g.beginPath(); g.moveTo(e[0] - Math.cos(an - .45) * L, e[1] - Math.sin(an - .45) * L); g.lineTo(e[0], e[1]); g.lineTo(e[0] - Math.cos(an + .45) * L, e[1] - Math.sin(an + .45) * L); g.stroke(); }
    g.restore();
  };
  // ---- screen-space things of the day: the little swarms (leaving before the study), the card, the strip, the big swarm, the glare
  const LIT = (() => { const r = prng(3131), L = []; for (let k = 0; k < 9; k++) for (let i = 0; i < 5; i++) L.push({ k, i, ph: r() * TAU, sp: .9 + r() * .7, go: 0, dx: r() }); L.forEach((f, j) => { f.go = mix(A.older + .1, A.simpler - .9, ((j * 7) % L.length) / (L.length - 1)); }); return L; })();
  const dayOverlays = (ctx, t, c) => {
    // the little hesitant swarms of the row's figures; from "An older study" they leave one by one, the last on "simpler"
    if (t < A.simpler + .4) for (const f of LIT) {
      const h = ROW[f.k], X = h.X + 70 * h.u + (h.row % 2 ? -1 : 1) * 9, base = c.P(X, 15, h.Z - 30); if (!base) continue;
      const fs = c.F * 20 / base[2] / 185; if (fs * 185 < 10) continue;
      const lv = clamp((t - f.go) / 1.1), e = lv * lv;
      const x = base[0] + (Math.cos(t * f.sp + f.ph) * 30 + Math.sin(t * 1.7 + f.ph) * 10) * fs + e * (300 + 500 * f.dx), y = base[1] + Math.sin(t * f.sp * 1.3 + f.ph) * 14 * fs - e * 1300;
      if (y < -60) continue;
      dayFly(ctx, t, { x, y, s: clamp(fs * 2.2, .5, 2), seed: f.k * 9 + f.i, glow: .8 });
    }
    // the study card (7.04)
    const cu = eoutX(clamp((t - A.older - .25) / .4)) * (1 - einX(clamp((t - A.women + .55) / .35)));
    if (cu > 0) { ctx.save(); ctx.translate(0, 96); ctx.scale(1, cu); ctx.translate(0, -96);
      chartCard(ctx, t, { x: 96, y: 96, w: 700, h: 168, frame: clamp((t - A.older - .4) / .8), axis: 0, plot: [.1, .2, .9, .8], tone: '#f3ecda',
        texts: [{ xy: [44, 82], text: 'OLDER STUDY · BEFORE AI TOOLS', size: 30, font: 'caps', u: clamp((t - A.older - .45) / .6) }], source: 'Brooks, Donovan & Johnson', su: clamp((t - A.older - .8) / .6), sourceSize: 18 });
      ctx.restore(); }
    // the warm light strip between the two women (7.05) → it narrows into the chart's line (7.06)
    if (t > A.mentor - .1 && t < A.their + .7 && WOLDP && WYNGP) {
      const gu = eoutX(clamp((t - A.mentor + .05) / .5)), mu = sm(clamp((t - A.their + .05) / .6));
      const a0 = c.P(WOLD.X + 6, 11.5, WOLD.Z), a1 = c.P(WYNG.X - 6, 11.5, WYNG.Z), b0 = c.P(...sheetW(0, BASEV)), b1 = c.P(...sheetW(1, BASEV));
      if (a0 && a1 && b0 && b1) {
        const m = (p, q) => [mix(p[0], q[0], mu), mix(p[1], q[1], mu)], P0 = m(a0, b0), P1 = m(a1, b1), cx = (P0[0] + P1[0]) / 2, half = (P1[0] - P0[0]) / 2 * gu;
        const x0 = cx - half, x1 = cx + half, y0 = mix(P0[1], P0[1] + (P1[1] - P0[1]) * ((x0 - P0[0]) / (P1[0] - P0[0] || 1)), 1), y1 = P0[1] + (P1[1] - P0[1]) * ((x1 - P0[0]) / (P1[0] - P0[0] || 1));
        const th = mix(26, 0, mu) * c.F / Math.max(30, a0[2]) * .12 + 1;
        ctx.save(); ctx.lineCap = 'round';
        for (const [w, col, al] of [[th * 3.2, '#ffd9a0', .28 * (1 - mu)], [th * 1.4, '#ffc978', .55 * (1 - mu)], [Math.max(2.4, th * .45), mix2('#fff3d6', INK.ink, mu), .95]]) { ctx.strokeStyle = rgba(col, al); ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); }
        ctx.restore();
      }
    }
    // the arrow (7.08) while it is still in the air
    if (t > A.butP && t < A.maybe + 1) { const ar = ARROW(t); if (ar.lie < 1) pathInk(ctx, c, ar.pts, { w: 3.6, dash: ar.lie < .02 && t < A.butP + .25 ? [6, 10] : null, head: 26 }); }
    // the struggling conductor's swarm (7.09): small, then a bigger brighter one joins, grows, is disordered; ★ on "walked the road" it orders
    const hp = c.P(AF.X + 9, 15.5, AF.Z);
    if (t > A.butP + .5 && hp && hp[0] > -900 && hp[0] < W + 900 && hp[1] > -400 && hp[1] < H + 400) {
      const hx = hp[0], hy = hp[1], grow = sm(clamp((t - A.maybe - .6) / 2.2)), ord = sm(clamp((t - A.walked + .05) / .8));
      const n = 5 + Math.round(25 * grow), sc = clamp(c.F * 17 / 300 / 185 * 2, .6, 2);
      for (let i = 0; i < n; i++) {
        const f = BIG[i], arr = i < 5 ? 1 : eoutX(clamp((t - A.maybe - .6 - (i - 5) * .07) / .7));
        const R = (60 + 120 * grow) * f.rr, cx = hx + 120 + 90 * grow, cy = hy - 60 - 40 * grow;
        let x = cx + Math.cos(t * f.sp + f.ph) * R * 1.3 + Math.sin(t * 2.3 * f.sp + f.a) * 30 * grow, y = cy + Math.sin(t * f.sp * 1.4 + f.ph) * R * .6;
        if (i >= 5) { x = mix(W + 80 + 200 * f.d, x, arr); y = mix(cy - 200 * f.d, y, arr); }
        const rx = hx + 70 + f.col * 26, ry = hy - 30 - f.row * 26 + 3 * Math.sin(t * 2 + f.ph);
        x = mix(x, rx, ord); y = mix(y, ry, ord);
        dayFly(ctx, t, { x, y, s: sc * (i < 5 ? 1 : 1.15), seed: 90 + i, glow: i < 5 ? .9 : 1.25 });
      }
      // its light dazzles on "smarter machine"
      const gl = sm(clamp((t - A.smarter - .05) / .35)) * (1 - sm(clamp((t - A.smarter - .7) / .9)));
      if (gl > 0) { const R = 500 + 1300 * gl, g = ctx.createRadialGradient(hx + 200, hy - 100, 0, hx + 200, hy - 100, R); g.addColorStop(0, rgba('#fffdf6', gl)); g.addColorStop(.3, rgba('#fff4d6', .88 * gl)); g.addColorStop(.6, rgba('#ffe9bd', .45 * gl)); g.addColorStop(1, rgba('#ffe6b0', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    }
  };

  const partN = (pts, f) => { const n = pts.length - 1, x = f * n, i = Math.floor(x), k = x - i, o = pts.slice(0, i + 1); if (i < n) o.push([mix(pts[i][0], pts[i + 1][0], k), mix(pts[i][1], pts[i + 1][1], k)]); return o; };
  const SND = {
    [A.hb]: [{ f: 'whoosh_airy', t: A.hb + .15, v: .3 }],
    [A.ifany]: [{ f: 'shimmer_rings', t: A.many + .05, v: .25 }],
    [A.or]: [{ f: 'whoosh', t: A.or + .25, v: .3 }],
    [A.we]: [{ f: 'wings', t: A.doW + .1, v: .3 }],
    [A.so7]: [{ f: 'paper_pop', t: A.kenya - .1, v: .3 }, { f: 'pencil', t: A.their + .1, v: .25 }],
    [A.ha - .5]: [{ f: 'whoosh_up', t: A.guild + .4, v: .3 }],
  };
  const starts = [A.hb, A.ifany, A.or, A.ifyou, A.idk, A.but, A.we, A.so7, A.ha - .5];
  return starts.map((t0, i) => ({ t: t0, tr: 'cut', d: .1, draw, print: i === starts.length - 1 ? HO.print : PR, sound: SND[t0] }));
};

const eioQ = (x) => qio(x);
const mix2 = (a, b, k) => mixHex(a, b, clamp(k));
// a small ink figure (far): head, coat, the arm half raised (hand 0 down … 1 up)
function miniFig(ctx, x, y, h, hand, flip) {
  const f = flip ? -1 : 1, s = h / 100; ctx.save(); ctx.translate(x, y); ctx.scale(f * s, s);
  ctx.fillStyle = DAY.ink; ctx.beginPath(); ctx.ellipse(0, -90, 6.5, 7.5, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-8, -80); ctx.lineTo(8, -80); ctx.lineTo(11, -22); ctx.lineTo(-11, -22); ctx.closePath(); ctx.fill();
  ctx.fillRect(-7, -24, 5, 24); ctx.fillRect(2, -24, 5, 24);
  ctx.strokeStyle = DAY.ink; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(6, -76); const a = mix(.25, 2.3, hand), b = a + .5; const ex = 6 + Math.sin(a) * 22, ey = -76 + Math.cos(a) * 22; ctx.lineTo(ex, ey); ctx.lineTo(ex + Math.sin(b) * 20, ey + Math.cos(b) * 20); ctx.stroke();
  ctx.restore();
}
// the warm day ground + sky (paper)
function groundDay(ctx, t, c) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  paperGround(ctx, 0, 0, W, H, { tone: DAY.paper, light: [W * .3, Math.max(0, c.horizon)], grain: .8 });
  ctx.restore();
}
function skyDay(ctx, t, c) {
  const hz = c.horizon; if (hz < 0) return;
  ctx.save(); const g = ctx.createLinearGradient(0, hz, 0, hz - 900); g.addColorStop(0, '#fbe7bf'); g.addColorStop(.35, DAY.sky); g.addColorStop(1, '#f1dcb2'); ctx.fillStyle = g; ctx.fillRect(-400, -400, W + 800, hz + 401);
  // the low sun far along the left branch
  const az = -.62 - (c.yaw || 0), sx = W / 2 + c.F * Math.tan(az); glow(ctx, 'dawn', sx, hz - 6, 520, .55, 'source-over');
  ctx.restore();
}
// the line plate's ground (handoff4 linePlate without the line), its violet glow centred at (gx, gy)
function groundNight(ctx, t, gx, gy) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#0a0c22'; ctx.fillRect(0, 0, W, H);
  const v = ctx.createRadialGradient(gx, gy, 0, gx, gy, W * .7); v.addColorStop(0, 'rgba(40,36,90,.55)'); v.addColorStop(1, 'rgba(10,12,34,0)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(160,150,220,.05)'; ctx.lineWidth = 1; ctx.beginPath(); for (let k = -40; k < 80; k++) { const x = k * 34 + ((t + TSHIFT) * 6) % 34; ctx.moveTo(x, 0); ctx.lineTo(x - 520, H); } ctx.stroke();
  ctx.restore();
}
