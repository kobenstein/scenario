// Film 8 · chunk c10 · 09a "Today, a company brain belongs to whoever owns the company" (shots 9.01–9.16, 484.53–544.01 s). Builder: B3.
// Worlds: lib/f8_c10_world.mjs (the street at morning gold, the nested world N), lib/f8_c10_civic.mjs (lectern, portico, three places,
// the people). ONE continuous take: the deed's paper of c09 is the frame; the camera pulls back to the vault with the deed on its gate,
// cranes over the roof to the bakery street, flies through a piece on the ground into N (Apertus, Read-Coop), comes out through the
// co-op seal back at the vault, follows the weave along the street to the civic end and dives into the bakery's light (c10>c11 plate).
//
// | shot  | VO (accent)                              | image                                                                   | hero light        | camera                                   | flow on                         | sound            |
// |-------|------------------------------------------|-------------------------------------------------------------------------|-------------------|------------------------------------------|---------------------------------|------------------|
// | 9.01  | whoever **owns** the company             | the deed's paper is on the gate of a high engraved vault; the weave     | the weave behind  | pull back out of the paper (fixed point) | take (paper plate in)           | whoosh_airy,     |
// |       |                                          | behind bars in its window; a bronze signet presses the wax seal         | bars              |                                          |                                 | stamp            |
// | 9.02  | Does it **have to**?                     | the seal close; a firefly taps it; the wax glints                       | the wax glint     | push to the seal                         | crane over the roof (a)         | foil_glint       |
// | 9.03★ | sharing a memory they own **together**   | the bakery street at dawn, eight bakeries, threads rise from windows    | the canopy        | crane up and over, settle wide           | take                            | whoosh_up,       |
// |       |                                          | and chimneys; canopy patches grow above each and close on together      |                   |                                          |                                 | shimmer_rings    |
// | 9.04  | remembering **as much** as a supermarket | the panorama: bakery canopy left, the supermarket halls with their own  | both nets         | pull out, drift right                    | take                            | chime            |
// |       |                                          | net right; on as much the canopy grows to the same height, a level line |                   |                                          |                                 |                  |
// | 9.05  | like that **yet**                        | the canopy turns dotted (a ghost); its threads sink back                | –                 | back left and down toward the pieces     | take                            |                  |
// | 9.06  | But the **pieces** exist                 | two glowing pieces on the street: an open frame, an engraved co-op seal | the pieces        | push in (fixed point) into the frame     | fly into the open frame (b)     | spark_tick,      |
// |       |                                          |                                                                         |                   |                                          |                                 | whoosh_airy      |
// | 9.07  | fully **open** model called Apertus      | N: the open frame with a weave, plates lift off, the last on open;      | the frame's weave | arrive, slight push                      | take                            | paper_pop        |
// |       |                                          | label APERTUS · SWISS AI · EPFL / ETH ZURICH                            |                   |                                          |                                 |                  |
// | 9.08  | see how it's built, and **use it**       | people step up and look in; one pulls out a thread, a firefly takes its | the thread        | follow the firefly right                 | take                            | whoosh           |
// |       |                                          | end and flies off on use it                                             |                   |                                          |                                 |                  |
// | 9.09  | reading old **handwriting**              | a big handwritten page on an easel, members around it; the firefly      | the read lines    | hold on the page                         | pull back out of the co-op seal | pages, chime     |
// |       |                                          | reads it line by line, a thread out of each line; label READ-COOP SCE   |                   |                                          | (b rev)                         |                  |
// | 9.10  | belong to one **owner**                  | back at the vault: the seal loosens from the deed and falls; hits the   | –                 | pull back to the gate (fixed point)      | take                            | whoosh_airy,     |
// |       |                                          | ground on owner                                                         |                   |                                          |                                 | drop             |
// | 9.11  | everyone who **feeds** it                | the weave runs out of the vault window over the street; every baker     | the canopy        | pull out over the street                 | take                            | shimmer_rings    |
// |       |                                          | raises a hand and feeds a thread                                        |                   |                                          |                                 |                  |
// | 9.12  | what **goes in**, what **stays out**     | at the canopy's edge a thread stitches in; a stranger's thread is       | the stitch        | push to the edge                         | a firefly lifts off (a)         | spark_tick,      |
// |       |                                          | stopped by a raised hand and drifts away                                |                   |                                          |                                 | whoosh           |
// | 9.13  | Who makes that **happen**?               | the firefly hovers over the street and turns                            | the firefly       | hold                                     | follow it sideways              | wings            |
// | 9.14  | Lawmakers, who write the **rules**       | a lawmaker in profile at a lectern writes a rule sheet; the seal presses| the pen           | follow right, settle                     | follow it sideways              | pencil, stamp    |
// | 9.15  | Governments, who **fund** the tools      | crates fly from the portico steps to three places; they open on fund,   | the crates        | follow right, wider                      | take                            | paper_pop        |
// |       |                                          | the fireflies go in, windows light                                      |                   |                                          |                                 |                  |
// | 9.16  | **build**, **join**, or **buy** from     | "you" (the conductor from behind) before the three places: a stone      | the bakery light  | settle, then follow the spark up         | the light rises as a spark, fly | drop, chime,     |
// |       |                                          | settles in a wall, a door opens its light, a coin lands on the counter  |                   |                                          | into it (c10>c11 light plate)   | tick, whoosh_up  |
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, prng } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { ready, F8, firefly, stitch, conductor, eoutX, einX } from '../lib/f8_kit.mjs';
import { chartReady, inkText } from '../lib/f8_chart.mjs';
import { b3Ready, camKeys, glow, sine } from '../lib/f8_c09_world.mjs';
import { waxSeal } from '../lib/f8_c09_plate.mjs';
import { glowFrom, plateCentre } from '../lib/f8_c02_world.mjs';
import { G, street, nWorld, BAKERIES, CANOPY, MARKET_NET, PIECE1, PIECE2, PORT1, PORT2, SEAL_ST, SCRIPT, NG } from '../lib/f8_c10_world.mjs';
import { LECTERN, PORTICO, SHOPS, lectern, portico, shops, people, you } from '../lib/f8_c10_civic.mjs';

export default async (T, R) => {
  await ready(); await chartReady();
  const { in: HI, out: HO } = handsOf('c10', T);
  const S = (p, n) => T.S('09a', p, n);
  const A = {
    today: S('Today'), owns: S('owns'), does: S('Does it'), have: S('have to'), imagine: S('Imagine'), together: S('together'),
    every: S('Every small'), asmuch: S('as much'), we: S("We couldn't"), yet: S('yet'), but: S('But the'), pieces: S('pieces'),
    theres: S("There's a"), open: S('open'), anyone: S('Anyone can'), useit: S('use it'), and1: S("And there's"), handwriting: S('handwriting'),
    so: S('So a'), owner: S('owner'), it: S('It can'), everyone: S('everyone'), andthen: S('And then'), goes: S('goes in'), stays: S('stays out'),
    who: S('Who makes'), happen: S('happen'), law: S('Lawmakers'), rules: S('rules'), gov: S('Governments'), fund: S('fund'),
    andyou: S('And you'), build: S('build'), join: S('join'), buy: S('buy'), end: T.E('09a'),
  };
  A.to = A.have + .24;
  const TB = HI.b, TE = HO.a, HA1 = HO.a - 1 / 30;

  // ================================================================ the camera: one key list in N units until the exit, one in street units after
  const s1 = PORT1.s, s2 = PORT2.s;
  const stToN1 = ([t, x, y, d, f]) => [t, PORT1.N[0] + (x - PORT1.St[0]) / s1, PORT1.N[1] + (y - PORT1.St[1]) / s1, d / s1, f];
  const T1 = A.open - .1, T2 = A.handwriting - .05;
  // a pure zoom (fixed point) from c0 = [x, y, k] at t0 to c1 at t1, with a middle key on the same path (a steadier rate)
  const zPath = (t0, [x0, y0, k0], t1, [x1, y1, k1]) => { const km = Math.sqrt(k0 * k1), px = (x0 * k0 - x1 * k1) / (k0 - k1), py = (y0 * k0 - y1 * k1) / (k0 - k1);
    return [[mix(t0, t1, .5), px + (x0 - px) * k0 / km, py + (y0 - py) * k0 / km, 1 / km, 'z'], [t1, x1, y1, 1 / k1, 'z']]; };                                   // inside N from T1 (≈) to T2 (exact)
  const P1C = [PIECE1.x + PIECE1.w / 2, PIECE1.y + PIECE1.h / 2];
  const keysSt1 = [
    [TB, 337, 590 + 150 * 9 / 32, 150 / W], [A.owns - .3, 380, 470, 1 / 1.25, 'z'], [A.owns + .5, 382, 472, 1 / 1.27],
    [A.does + .1, 430, 612, 1 / 3, 'z'], [A.to + .2, 432, 614, 1 / 3.04], [A.imagine + .55, 560, 210, 1 / 1.5], [A.imagine + 1.8, 1150, 296, 1 / .88], [A.imagine + 3.15, 2000, 470, 1 / .62],
    [A.every - .3, 2010, 472, 1 / .62], [A.asmuch - .3, 3370, 470, 1 / .355], [A.we - .4, 3380, 472, 1 / .355], [A.we + 1.7, 1900, 480, 1 / .6],
    [A.yet + .1, 1000, 600, 1 / 1.3], ...zPath(A.yet + .1, [1000, 600, 1.3], T1, [...P1C, 1 / s1]),
  ];
  const keysN = [
    ...keysSt1.map(stToN1),
    [A.anyone - .2, 975, 560, 1 / 1.04], [A.useit, 1010, 560, 1 / 1.04], [A.useit + .85, 2000, 480, 1 / .62], [A.and1 + .95, 3000, 540, 1],
    [A.and1 + 4.1, 2994, 546, 1 / 1.015], [T2, 3000, 540, 1],
  ];
  const camN = camKeys(keysN);
  const keysSt2 = [
    [T2, PIECE2.x, PIECE2.y, s2], ...zPath(T2, [PIECE2.x, PIECE2.y, 1 / s2], A.so + 1.65, [560, 700, 2.2]),
    ...zPath(A.so + 1.65, [560, 700, 2.2], A.everyone + 1.1, [1250, 470, .85]), [A.andthen - .15, 1253, 471, 1 / .85],
    ...zPath(A.andthen - .15, [1253, 471, .85], A.andthen + 1.95, [700, 560, 1.5]), [A.stays + .3, 704, 560, 1 / 1.5],
    ...zPath(A.stays + .3, [704, 560, 1.5], A.happen + .25, [300, 450, .9]),
    ...zPath(A.happen + .25, [300, 450, .9], A.law + 1.1, [-300, 560, 1.9]), [A.rules + .2, -305, 560, 1 / 1.9],
    ...zPath(A.rules + .2, [-305, 560, 1.9], A.fund - .05, [-1080, 640, 1.05]), [A.andyou - .1, -1085, 640, 1 / 1.05],
    [A.andyou + 1.3, -1520, 720, 1 / 1.25], [A.buy + .3, -1500, 712, 1 / 1.28],
  ];
  const camSt2k = camKeys(keysSt2);
  const nFromN = (c) => ({ x: c.x, y: c.y, k: 1 / c.d });
  const stFromN1 = (c) => ({ x: PORT1.St[0] + (c.x - PORT1.N[0]) * s1, y: PORT1.St[1] + (c.y - PORT1.N[1]) * s1, k: 1 / c.d / s1 });
  const n1FromSt = (c) => ({ x: PORT1.N[0] + (c.x - PORT1.St[0]) / s1, y: PORT1.N[1] + (c.y - PORT1.St[1]) / s1, k: c.k * s1 });
  const n2FromSt = (c) => ({ x: PORT2.N[0] + (c.x - PORT2.St[0]) / s2, y: PORT2.N[1] + (c.y - PORT2.St[1]) / s2, k: c.k * s2 });
  // the end: the spark rises out of the bakery counter (W3); the camera locks it onto the plate's centre, then the light opens
  const TSP = A.buy + .25, tOut0 = TSP + .9, TLK = TSP + 1.2;
  const spark = (t) => { const u = clamp((t - TSP) / 1.5); return [SHOPS[2] - 30 + 24 * Math.sin(u * 3), mix(G - 114, 470, sine(u)) - Math.max(0, t - TSP - 1.5) * 40]; };
  const camSt2 = (t) => {
    const c = camSt2k(t), k0 = 1 / c.d; if (t < TSP - .3) return { x: c.x, y: c.y, k: k0 };
    const w = sine((t - (TSP - .3)) / (TLK - TSP + .3)), k = Math.exp(mix(Math.log(k0), Math.log(1.4), w)), [sx, sy] = spark(t), pc = plateCentre(t);
    const lx = sx - (pc[0] - W / 2) / k, ly = sy - (pc[1] - H / 2) / k; return { x: mix(c.x, lx, w), y: mix(c.y, ly, w), k };
  };
  // T1: the first frame in which the open frame's window covers the whole frame (scanned once, deterministic)
  const covers1 = (t) => { const c = stFromN1(camN(t)), x0 = W / 2 + (PIECE1.x - c.x) * c.k, y0 = H / 2 + (PIECE1.y - c.y) * c.k; return x0 <= .5 && y0 <= .5 && x0 + PIECE1.w * c.k >= W - .5 && y0 + PIECE1.h * c.k >= H - .5; };
  let T_IN = T1; for (let tt = A.pieces; tt < T1; tt += 1 / 600) if (covers1(tt)) { T_IN = tt; break; }

  // ================================================================ N · Apertus and the Read-Coop page
  const NS = 1.5, NODE = [1250, 560], HAND = [1372, 612];
  const panelU = (i) => { const t0 = mix(A.theres - .05, A.open - .05, i / 3); return (t) => clamp((t - t0) / .6); };
  const PANEL = [0, 1, 2, 3].map(panelU);
  const walker = (t, x0, x1, t0, t1) => { const u = clamp((t - t0) / (t1 - t0)), e = sm(u); return { x: mix(x0, x1, e), moving: u > 0 && u < 1, ph: Math.abs(x1 - x0) * e / 35 }; };
  const takerX = (t) => (t < A.useit + .05 ? walker(t, 1760, 1460, A.anyone + .05, A.anyone + 1.25) : walker(t, 1460, 2100, A.useit + .1, A.useit + 2.7));
  const RD0 = A.and1 + 1.45, RD1 = A.handwriting - .1;                     // reading: 12 lines
  const LINE = (i) => SCRIPT[Math.min(11, i)];
  const readPos = (t) => {
    const r = clamp((t - RD0) / (RD1 - RD0)) * 12, i = Math.min(11, Math.floor(r)), q = r - i, L = LINE(i);
    if (r >= 12) { const L2 = LINE(11); return [L2.x1 + 8, L2.y - 16]; }
    if (q < .82 || i === 11) { const e = Math.min(1, q / .82); return [mix(L.x0, L.x1, e), L.y - 16 + 3 * Math.sin(e * 40)]; }
    const e = sine((q - .82) / .18), N2 = LINE(i + 1); return [mix(L.x1, N2.x0, e), mix(L.y, N2.y, e) - 16 - 30 * Math.sin(Math.PI * e)];
  };
  const ffN = (t) => {                                                             // the firefly of N: hovers in the frame, takes the end, flies to the page, reads
    const hov = [1150 + 34 * Math.sin(t * 1.3), 420 + 22 * Math.cos(t * 1.7)];
    const tA = A.useit - .25, tB = A.useit + .05, tC = A.and1 + .8;
    if (t < tA) return hov;
    if (t < tB) { const e = sine((t - tA) / (tB - tA)); return [mix(hov[0], HAND[0], e), mix(hov[1], HAND[1] - 10, e)]; }
    const s0 = [SCRIPT[0].x0, SCRIPT[0].y - 16];
    if (t < tC) { const e = sine((t - tB) / (tC - tB)), m = [(HAND[0] + s0[0]) / 2, 120]; return [(1 - e) ** 2 * HAND[0] + 2 * (1 - e) * e * m[0] + e * e * s0[0], (1 - e) ** 2 * (HAND[1] - 10) + 2 * (1 - e) * e * m[1] + e * e * s0[1]]; }
    if (t < RD0) return [s0[0] + 6 * Math.sin(t * 3), s0[1] + 4 * Math.cos(t * 2.6)];
    return readPos(t);
  };
  const MEMBERS = [[2470, false, 1.5, 'stand', 61], [2590, false, 1.3, 'handHalf', 62], [3420, true, 1.3, 'stand', 63], [3540, true, 1.5, 'handHalf', 64], [2350, false, 1.2, 'stand', 65]];
  const nState = (t) => ({
    panels: (i) => PANEL[i](t),
    read: clamp((t - RD0) / (RD1 - RD0)) * 12,
    last: Math.exp(-Math.pow((t - A.handwriting - .35) / .5, 2)) + .4 * sm(lin(A.handwriting, A.handwriting + .4, t)),
    figs: (ctx, P) => {
      ctx.save(); ctx.setTransform(...P.M);
      const L = { x: 960, y: 300, col: F8.amber, a: .9 };
      // the members around the page (they are there all along)
      for (const [x, fl, s, pose, seed] of MEMBERS) { const y = NG + 10 - (s < 1.4 ? 14 : 0); conductor(ctx, t, x, y, s, { view: 'profile', pose, flip: fl, glow: 0, seed, light: { x: 3000, y: 300, col: F8.amber, a: .9 } }); }
      // two visitors step up to the open frame from the left and look in
      const v1 = walker(t, 300, 520, A.anyone - .1, A.anyone + 1.0), v2 = walker(t, 150, 400, A.anyone + .1, A.anyone + 1.3);
      conductor(ctx, t, v2.x, NG + 2, 1.3, { view: 'profile', pose: v2.moving ? 'walk' : 'handHalf', from: 'stand', u: 1, walkPhase: v2.ph, glow: 0, seed: 52, light: L });
      conductor(ctx, t, v1.x, NG + 10, NS, { view: 'profile', pose: v1.moving ? 'walk' : 'stand', walkPhase: v1.ph, glow: 0, seed: 51, light: L });
      // the one who takes a thread: comes from the right, reaches into the frame, turns and walks off on "use it"
      const tk = takerX(t), back = t >= A.useit + .05, reach = clamp((t - (A.useit - 1.0)) / .3) * (1 - clamp((t - A.useit + .05) / .2));
      conductor(ctx, t, tk.x, NG + 10, NS, { view: 'profile', pose: tk.moving ? 'walk' : reach > 0 ? 'point' : 'stand', from: 'stand', u: reach > 0 ? eoutX(reach) : 1, walkPhase: tk.ph, flip: !back, glow: 0, seed: 53, light: L });
      ctx.restore();
    },
    strand: (tt) => {
      const tP = A.useit - 1.0; if (tt < tP) return null;
      const g = clamp((tt - tP) / .5), head = tt < A.useit - .05 ? [mix(NODE[0], HAND[0], eout(g)), mix(NODE[1], HAND[1], eout(g))] : ffN(tt);
      const m = [(NODE[0] + head[0]) / 2, Math.max(NODE[1], head[1]) + Math.min(260, Math.hypot(head[0] - NODE[0], head[1] - NODE[1]) * .14)], pts = [];
      for (let j = 0; j <= 40; j++) { const q = j / 40; pts.push([(1 - q) ** 2 * NODE[0] + 2 * (1 - q) * q * m[0] + q * q * head[0], (1 - q) ** 2 * NODE[1] + 2 * (1 - q) * q * m[1] + q * q * head[1]]); }
      return pts;
    },
    reader: (ctx, P) => {
      const p = ffN(t), tr = []; for (let q = 6; q >= 0; q--) { const pp = ffN(t - q * .035); tr.push([P.X(pp[0]), P.Y(pp[1])]); }
      firefly(ctx, t, { x: P.X(p[0]), y: P.Y(p[1]), trail: tr.slice(3), s: clamp(1.9 * P.k, .4, 3), seed: 71, glow: 1.1 });
    },
  });

  // ================================================================ the street state
  const SEAL0 = [SEAL_ST[0], SEAL_ST[1]], SR = SEAL_ST[2];
  const TDET = A.so + .55, TFALL = A.owner - .55;
  const sealAt = (t) => {   // the seal leaving the deed (9.10): it loosens, then falls and hits the street on "owner"
    const wob = t < TFALL ? .12 * Math.sin((t - TDET) * 18) * sm(lin(TDET, TDET + .4, t)) : 0;
    if (t < TFALL) return { x: SEAL0[0] + 2 * sm(lin(TDET, TFALL, t)), y: SEAL0[1] + 3 * sm(lin(TDET, TFALL, t)), rot: wob, sq: 1 };
    const u = clamp((t - TFALL) / (A.owner - TFALL)), yG = G + 22;
    if (u < 1) return { x: SEAL0[0] + 2 + 30 * u, y: mix(SEAL0[1] + 3, yG, u * u), rot: 1.4 * u, sq: 1 };
    const d = t - A.owner, b = Math.abs(Math.sin(d * 14)) * 10 * Math.exp(-d * 7);
    return { x: SEAL0[0] + 32 + 8 * eoutX(d / .4), y: yG - b, rot: 1.4 + .3 * eoutX(d / .4), sq: 1 - .25 * Math.exp(-d * 9) };
  };
  // the canopy over the bakery street (9.03–9.05) and again (9.10–9.11)
  const patchTop = (t) => mix(250, CANOPY.y, eio(clamp((t - A.asmuch + .1) / .7)));
  const patchStart = (i) => A.imagine + .9 + i * .14;
  const ghostU = (t) => sine((t - (A.we + .2)) / 1.4);
  const SPREAD0 = A.owner + .2, spreadU = (t) => sine((t - SPREAD0) / (A.everyone - SPREAD0));
  const canopyOf = (t) => {
    if (t < patchStart(0)) return null;
    if (t < SPREAD0) {
      const top = patchTop(t), done = t >= A.asmuch + .7, clips = BAKERIES.map((B, i) => { const hw = 160 * eio(clamp((t - patchStart(i)) / (A.together - patchStart(i)))); return [B.x - hw - (i === 0 ? 400 * (hw / 160) : 0), top, B.x + hw + (i === 7 ? 400 * (hw / 160) : 0), CANOPY.y + CANOPY.h + 400]; });
      return { clips: done ? null : clips, ghost: ghostU(t) };
    }
    const u = spreadU(t);
    return [{ ghost: 1 }, { clips: u >= 1 ? null : [[-2000, -1000, CANOPY.x + (CANOPY.w + 600) * u, 2000]], ghost: 0 }];
  };
  const threadsU = (t) => (i) => Math.min(clamp((t - (A.imagine + .5 + i * .12)) / .9), 1 - sine((t - (A.we + .2)) / 1.2));
  // the bakers (one before each bakery) and the two strangers of 9.12
  const feedT = (i) => A.it + .05 + i * .09;
  const bakers = (t) => BAKERIES.map((B, i) => {
    const raise = clamp((t - feedT(i)) / .35), low = clamp((t - A.andthen + .3) / .5), gate = i === 0 && t > A.stays - .5;
    const pose = gate ? 'handFlat' : raise > 0 && low < 1 ? 'handRaised' : raise > 0 ? 'handHalf' : 'stand';
    const from = gate ? 'handHalf' : raise > 0 && low < 1 ? 'stand' : 'handRaised';
    const u = gate ? eoutX((t - A.stays + .5) / .3) : raise > 0 && low <= 0 ? eoutX(raise) : low > 0 ? eoutX(low) : 1;
    return { x: B.x + 120, flip: true, s: .78, seed: 60 + i, pose, from, u, thread: t > feedT(i) + .1 ? { u: clamp((t - feedT(i) - .1) / .6), to: [B.x + 130, CANOPY.y + CANOPY.h - 6] } : null };
  });
  const STR = { x: 590 }, TRF = A.stays;                                   // the stranger, the refused thread
  const stranger = (t) => ({ x: STR.x, flip: false, s: .8, seed: 77, pose: t > A.goes + .2 ? 'handRaised' : 'stand', from: 'stand', u: eoutX((t - A.goes - .2) / .35) });
  // the firefly of the street (9.02 tap, 9.12–9.16 guide); positions in street units
  const ffStreet = (t) => {
    if (t < A.imagine + 1.6) {   // 9.02: out of the vault window, taps the seal, rises with the crane and leaves to the right
      const w0 = [330, 300], tap = [SEAL0[0] + 12, SEAL0[1] - 12];
      if (t < A.have - .45) { const e = sine((t - (A.owns + .6)) / (A.have - .45 - A.owns - .6)); return [mix(w0[0], tap[0] + 40, e), mix(w0[1], tap[1] - 30, e)]; }
      if (t < A.have) { const e = eio((t - A.have + .45) / .45); return [mix(tap[0] + 40, tap[0], e), mix(tap[1] - 30, tap[1], e)]; }
      if (t < A.have + .35) { const e = eoutX((t - A.have) / .35); return [tap[0] + 34 * e, tap[1] - 26 * e]; }
      const e = sine((t - A.have - .35) / (A.imagine + 1.6 - A.have - .35)); const a = [tap[0] + 34, tap[1] - 26], m = [700, 200], b = [1900, 140];
      return [(1 - e) ** 2 * a[0] + 2 * (1 - e) * e * m[0] + e * e * b[0], (1 - e) ** 2 * a[1] + 2 * (1 - e) * e * m[1] + e * e * b[1]];
    }
    return null;
  };
  const LIFT = A.stays + .4;
  const KEYF = [   // 9.12–9.16: lifts off the canopy edge, hovers, turns, leads to the lectern, the portico, the three places, into W3
    [LIFT, 880, 420], [A.who + .2, 760, 300], [A.happen + .5, 740, 296], [A.law + .55, -170, 380], [A.rules + .3, -200, 390],
    [A.gov + .5, -820, 520], [A.fund + .6, -1120, 540], [A.andyou + 1.0, -1480, 560], [A.buy + .05, -1330, 600], [A.buy + .5, SHOPS[2] - 30, G - 110],
  ];
  const ffGuide = (t) => {
    if (t < LIFT || t > KEYF[KEYF.length - 1][0]) return null;
    let i = 0; while (i < KEYF.length - 2 && KEYF[i + 1][0] <= t) i++;
    const [t0, x0, y0] = KEYF[i], [t1, x1, y1] = KEYF[i + 1], e = sine((t - t0) / (t1 - t0)), hv = Math.min(1, Math.min(t - t0, t1 - t) * 2);
    return [mix(x0, x1, e) + 10 * Math.sin(t * 2.3) * hv, mix(y0, y1, e) + 7 * Math.cos(t * 3.1) * hv];
  };
  const crates = (t) => [0, 1, 2].map((i) => ({ u: clamp((t - (A.gov + .1 + i * .18)) / .75), from: [PORTICO.x0 + 250 + (i - 1) * 60, G - 20], to: [SHOPS[i] - 70, G + 34], open: clamp((t - (A.fund + i * .07)) / .5), win: [SHOPS[i] - 20, G - 60] }));
  const shopLit = (t, i) => .35 + .65 * eoutX((t - (A.fund + .35 + i * .07)) / .5);
  const YOU = { x: -1520, y: G + 150, s: 1.25 };
  const youPose = (t) => {
    if (t < A.build - .45) return { pose: 'stand', from: 'stand', u: 1 };
    if (t < A.join - .3) return { pose: 'handHalf', from: 'stand', u: eoutX((t - A.build + .45) / .3) };
    if (t < A.buy - .4) return { pose: 'handRaised', from: 'handHalf', u: eoutX((t - A.join + .3) / .3) };
    return { pose: 'point', from: 'handRaised', u: eoutX((t - A.buy + .4) / .3) };
  };
  const HANDY = [YOU.x + 34, YOU.y - 200];

  function stState(t, cam) {
    const S = {
      press: eio(clamp((t - (A.owns - .02)) / .2)), glint: clamp((t - (A.to - .05)) / .9), sealOff: t >= TDET, thread: 1, vaultA: 1,
      canopy: canopyOf(t), threadsU: threadsU(t), marketA: 1, glimmer: A.pieces,
      nIn1: (g) => nWorld(g, t, n1FromSt(cam), nState(t)), nIn2: (g) => nWorld(g, t, n2FromSt(cam), nState(t)),
      civic: (g, P) => {
        portico(g, t, P);
        lectern(g, t, P, { sheet: Math.min((t - A.law + .2) / .6, 1 - (t - A.gov - .3) / .6), write: clamp((t - (A.law + .1)) / (A.rules - .1 - A.law)), press: clamp((t - (A.rules - .12)) / .45), glint: clamp((t - A.rules - .35) / .8) });
        shops(g, t, P, { lit: [shopLit(t, 0), shopLit(t, 1), shopLit(t, 2) + .6 * Math.exp(-Math.pow((t - A.buy - .7) / .5, 2))], crates: t > A.gov ? crates(t) : null,
          stone: clamp((t - (A.build - .35)) / .35), stoneT: Math.max(0, t - A.build), join: eoutX((t - A.join + .1) / .4), coin: clamp((t - (A.buy - .38)) / .38), coinT: Math.max(0, t - A.buy), from: HANDY });
      },
      people: (g, P) => {
        const list = bakers(t); if (t > A.andthen) list.push(stranger(t));
        const hands = people(g, t, P, list);
        // 9.12: the stranger's thread rises toward the edge, a raised hand stops it, it drifts away
        const hS = hands[8];
        if (hS && t > A.goes + .3) {
          const u = clamp((t - A.goes - .3) / .65), d = sine((t - TRF) / 1.5), off = [-700 * d, -650 * d], e = eout(u) * .86, tip = [845, 392], pts = [];
          const base = d > 0 ? [hS[0] + off[0] * .9, hS[1] + off[1] * 1.1] : hS;
          for (let j = 0; j <= 24; j++) { const q = j / 24 * e; const bend = d * Math.sin(q * Math.PI) * 160; pts.push([mix(base[0], tip[0] + off[0], q) + bend, mix(base[1], tip[1] + off[1], q) - 18 * Math.sin(q * Math.PI * 2 + t * 2)]); }
          g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; g.strokeStyle = rgba('#8fb0ff', .35); g.lineWidth = Math.max(2, 4 * P.k); g.beginPath(); pts.forEach(([x, y], j) => (j ? g.lineTo(P.X(x), P.Y(y)) : g.moveTo(P.X(x), P.Y(y)))); g.stroke();
          g.strokeStyle = rgba('#d8e4ff', .85); g.lineWidth = Math.max(.8, 1.1 * P.k); g.stroke(); const [hx, hy] = pts[pts.length - 1]; glow(g, P.X(hx), P.Y(hy), 12 * Math.max(1, P.k), '#8fb0ff', .8, '#ffffff'); g.restore();
        }
        // 9.12: a baker's second thread is accepted: it stitches into the canopy edge on "goes in"
        const h6 = hands[1];
        if (h6 && t > A.goes - .6) stitch(g, t, A.goes - .35, P.X(905), P.Y(404), 'check', { from: [P.X(h6[0]), P.Y(h6[1])], s: Math.min(2, P.k), dur: .7 });
      },
      after: (g, P) => {
        const k = P.k;
        // 9.01: the bronze signet comes down on the wax and goes back up
        { const d = clamp((t - (A.owns - .75)) / .73), up = clamp((t - (A.owns + .25)) / .7); if (d > 0 && up < 1) {
          const q = 1.7, y = SEAL0[1] - SR - mix(420, 0, eio(d)) - 520 * eio(up), x = SEAL0[0];
          g.save(); g.setTransform(...P.M); g.translate(x, y); g.scale(q, q);
          g.fillStyle = '#4a321c'; g.beginPath(); g.ellipse(0, -40, 7, 8.5, 0, 0, Math.PI * 2); g.fill(); g.fillRect(-4, -36, 8, 22); g.fillStyle = '#6a4a28'; g.fillRect(-7, -16, 14, 4);
          g.fillStyle = '#8a6a3a'; g.fillRect(-SR / q * 1.05, -13, SR / q * 2.1, 13); g.strokeStyle = rgba('#ffe0a8', .65); g.lineWidth = 1.2 / (k * q); g.strokeRect(-SR / q * 1.05, -13, SR / q * 2.1, 13);
          g.strokeStyle = rgba('#ffe0a8', .5); g.beginPath(); g.moveTo(3, -36); g.lineTo(3, -15); g.stroke(); g.strokeStyle = rgba('#2a1a0a', .7); g.beginPath(); g.moveTo(-SR / q * 1.05, -5); g.lineTo(SR / q * 1.05, -5); g.stroke(); g.restore(); } }
        if (t > A.owns - .05 && t < A.owns + .6) glow(g, P.X(SEAL0[0]), P.Y(SEAL0[1]), 90 * k / 2, '#ffd6c8', .5 * Math.exp(-(t - A.owns) * 5));
        // 9.10: the seal, loose, falling, lying on the street
        if (t >= TDET) { const s = sealAt(t); g.save(); g.setTransform(...P.M); g.translate(s.x, s.y); g.scale(1, s.sq); g.rotate(s.rot); waxSeal(g, t, 0, 0, SR, { press: 1, seed: 5 }); g.restore();
          if (t > A.owner && t < A.owner + .8) glow(g, P.X(s.x), P.Y(G + 30), 60 * k, '#e8c8a8', .4 * Math.exp(-(t - A.owner) * 5)); }
        // 9.10–9.11: the weave runs out of the vault window into the canopy
        if (t > SPREAD0 - .3) { g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
          for (let j = 0; j < 4; j++) { const u = eout(clamp((t - SPREAD0 + .3 - j * .12) / .9)); if (u <= 0) continue; const a = [300 + j * 50, 230 + j * 30], b = [CANOPY.x + 30 + j * 60, CANOPY.y + 150 + j * 30], m = [(a[0] + b[0]) / 2, a[1] - 140 + j * 20], pts = [];
            for (let q = 0; q <= 24; q++) { const s = q / 24 * u; pts.push([(1 - s) ** 2 * a[0] + 2 * (1 - s) * s * m[0] + s * s * b[0], (1 - s) ** 2 * a[1] + 2 * (1 - s) * s * m[1] + s * s * b[1]]); }
            g.strokeStyle = rgba('#f3d9a0', .35); g.lineWidth = Math.max(2, 4 * k); g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(P.X(x), P.Y(y)) : g.moveTo(P.X(x), P.Y(y)))); g.stroke(); g.strokeStyle = rgba(F8.goldCore, .9); g.lineWidth = Math.max(.8, 1.1 * k); g.stroke(); }
          g.restore(); }
        // 9.04: the level line: both nets reach the same height on "as much"
        { const u = eoutX((t - A.asmuch) / .7), o = eio(clamp((t - A.we + .3) / .5)); if (u > 0 && o < 1) {
          const x0 = CANOPY.x + (MARKET_NET.x + MARKET_NET.w - CANOPY.x) * o, x1 = mix(CANOPY.x, MARKET_NET.x + MARKET_NET.w, u), y = CANOPY.y - 14;
          g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = rgba(F8.goldCore, .85); g.lineWidth = 1.6; g.setLineDash([10, 7]); g.beginPath(); g.moveTo(P.X(x0), P.Y(y)); g.lineTo(P.X(x1), P.Y(y)); g.stroke(); g.setLineDash([]);
          for (const xx of [CANOPY.x, CANOPY.x + CANOPY.w, MARKET_NET.x, MARKET_NET.x + MARKET_NET.w]) if (xx <= x1 && xx >= x0) { g.beginPath(); g.moveTo(P.X(xx), P.Y(y) - 8); g.lineTo(P.X(xx), P.Y(y) + 8); g.stroke(); }
          if (u < 1) glow(g, P.X(x1), P.Y(y), 18, F8.gold, .9, F8.goldCore); g.restore(); } }
        // the street fireflies
        const f1 = ffStreet(t); if (f1) { const tr = []; for (let q = 6; q >= 0; q--) { const p = ffStreet(t - q * .035); if (p) tr.push([P.X(p[0]), P.Y(p[1])]); } firefly(g, t, { x: P.X(f1[0]), y: P.Y(f1[1]), trail: tr.slice(3), s: clamp(.9 * k, .5, 3), seed: 81 }); }
        const f2 = ffGuide(t); if (f2) { const tr = []; for (let q = 6; q >= 0; q--) { const p = ffGuide(t - q * .035); if (p) tr.push([P.X(p[0]), P.Y(p[1])]); }
          const turn = sine((t - A.happen + .15) / .35), head = t > A.who && t < A.happen + .6 ? mix(.05, Math.PI * .95, turn) : undefined;
          firefly(g, t, { x: P.X(f2[0]), y: P.Y(f2[1]), trail: tr.slice(3), s: clamp(1.25 * k, .5, 3), seed: 82, heading: head }); }
        // 9.16: you, in the foreground
        if (P.X(YOU.x + 200) > -50 && P.X(YOU.x - 200) < W + 50) { const yp = youPose(t); you(g, t, P, { x: YOU.x, y: YOU.y, s: YOU.s, ...yp, lx: SHOPS[1] }); }
        // the spark out of the bakery counter
        if (t > TSP - .1 && t < tOut0 + .05) { const a = clamp((t - TSP + .1) / .25); g.save(); g.globalCompositeOperation = 'lighter';
          for (let j = 9; j >= 1; j--) { const [qx, qy] = spark(t - j * .03); glow(g, P.X(qx), P.Y(qy), (30 - j * 2.2), '#ffcf8a', .22 * a * (1 - j / 10)); }
          g.restore(); const [sx, sy] = spark(t); glow(g, P.X(sx), P.Y(sy), 40, '#ffd9a0', .95 * a, '#fff8e6'); glow(g, P.X(sx), P.Y(sy), 110, '#f3d9a0', .25 * a); }
      },
    };
    return S;
  }

  // ================================================================ labels (screen space; written in, wiped out)
  function labels(ctx, t) {
    const lab = (s, t0, t1, y = 150, size = 26) => { const u = eoutX((t - t0) / .5) * (1 - einX((t - t1) / .35)); if (u > 0) inkText(ctx, s, 120, y, { size, font: 'caps', u, color: '#f6e7c9' }); };
    lab('APERTUS · SWISS AI · EPFL / ETH ZURICH', T1 + .15, A.useit - .1, 1000, 24);
    lab('READ-COOP SCE · TRANSKRIBUS', A.and1 + 1.3, A.handwriting + .05, 1000, 24);
  }

  // ================================================================ the take
  function draw(ctx, t) {
    if (t < T_IN) { const cN = camN(t); street(ctx, t, stFromN1(cN), stState(t, stFromN1(cN))); }
    else if (t <= T2) nWorld(ctx, t, nFromN(camN(t)), nState(t));
    else { const c = camSt2(t); street(ctx, t, c, stState(t, c)); }
    labels(ctx, t);
    if (t > tOut0) { const u = 1 - clamp((t - tOut0) / (HA1 - tOut0)), c = camSt2(t), [sx, sy] = spark(t); glowFrom(ctx, t, HO.plate, sine(u), [W / 2 + (sx - c.x) * c.k, H / 2 + (sy - c.y) * c.k], { kMin: .045, a: .5, follow: true, easeA: (x) => x }); }
  }
  await b3Ready();
  const PR = HI.print;
  const starts = [TB, A.does, A.imagine, A.every, A.we, A.but, A.theres, A.anyone, A.and1, A.so, A.it, A.andthen, A.who, A.law, A.gov, A.andyou, tOut0];
  const SOUND = {
    [TB]: [{ f: 'whoosh_airy', t: TB + .05, v: .3 }, { f: 'stamp', t: A.owns - .02, v: .45 }],
    [A.does]: [{ f: 'foil_glint', t: A.to, v: .3 }],
    [A.imagine]: [{ f: 'whoosh_up', t: A.imagine + .1, v: .3 }, { f: 'shimmer_rings', t: A.together - .1, v: .3 }],
    [A.every]: [{ f: 'chime', t: A.asmuch, v: .22 }],
    [A.but]: [{ f: 'spark_tick', t: A.pieces, v: .3 }, { f: 'whoosh_airy', t: A.pieces + .5, v: .3 }],
    [A.theres]: [{ f: 'paper_pop', t: A.open - .05, v: .3 }],
    [A.anyone]: [{ f: 'whoosh', t: A.useit + .1, v: .2 }],
    [A.and1]: [{ f: 'pages', t: A.and1 + 1.2, v: .3 }, { f: 'chime', t: A.handwriting, v: .25 }],
    [A.so]: [{ f: 'whoosh_airy', t: A.so - .3, v: .3 }, { f: 'drop', t: A.owner, v: .4 }],
    [A.it]: [{ f: 'shimmer_rings', t: A.everyone - .1, v: .3 }],
    [A.andthen]: [{ f: 'spark_tick', t: A.goes, v: .3 }, { f: 'whoosh', t: A.stays + .05, v: .15 }],
    [A.who]: [{ f: 'wings', t: A.happen - .1, v: .25 }],
    [A.law]: [{ f: 'pencil', t: A.law + .2, v: .3 }, { f: 'stamp', t: A.rules, v: .4 }],
    [A.gov]: [{ f: 'paper_pop', t: A.fund, v: .3 }],
    [A.andyou]: [{ f: 'drop', t: A.build, v: .25 }, { f: 'chime', t: A.join, v: .2 }, { f: 'tick', t: A.buy, v: .35 }, { f: 'whoosh_up', t: TSP + .1, v: .35 }],
  };
  return starts.map((t0, i) => ({ t: t0, tr: 'cut', d: .1, print: i === starts.length - 1 ? HO.print : PR, draw, sound: SOUND[t0] }));
};
