// Film 13 · B1 · the street, the ring, the lunch table, the giant hourglass, the working year (end of c01, all of c02, first second
// of c03). Shared by scenes/sc01.mjs, sc02.mjs and sc03.mjs, so the chunk seams at 33.44 and 63.48 are the same picture on both sides.
// Owner direction 28.10. (binding): no camera journey through one world. Each picture is its own clean image; one carrier object
// turns into the next (lights → ring → wall clock → porthole outline; the small hourglass → the giant one → bars → one line). The
// camera only pulls back once (out of the phone's light), cranes once (street → ring) and otherwise breathes. The hourglass is an
// anchor here (the question "a lie? → No."), not a space to travel through.
//
// | ID    | anchor                 | picture (one idea)                                                                  | moves (≤ 2)            | → carrier            |
// |-------|------------------------|-------------------------------------------------------------------------------------|------------------------|----------------------|
// | 1.11  | So why @29.44 · busier | from X1 (sc01 hands over: same sky, ledge, you, hourglass = core()): the city rises  | city rises · crowd     | their phone lights   |
// |       |                        | behind the ledge, building by building from the middle; indigo people with cool      |                        | rise → ring          |
// |       |                        | phone lights hurry along the street below; on "busier" they speed up (streaks); you  |                        |                      |
// |       |                        | and the hourglass (the only warm light) stand still on the ledge                     |                        |                      |
// | 2.01  | artificial · already   | crane up: the twelve phone lights rise over the skyline and close into ONE ring      | lights → ring · crane  | –                    |
// | 2.02  | company · year         | under the ring the office building lights up; 8 of 12 month arcs fill with gold;     | months · windows       | –                    |
// |       |                        | `8 months` · `ONE COMPANY` · `UC BERKELEY · 2025`                                        |                        |                      |
// | 2.03  | no time @43.60         | in the ring: `TIME FREED UP`, the digit rolls up … and back to 0 (cool)              | digit                  | ring → wall clock    |
// | 2.04  | prompts · lunch        | the city sinks; the ring becomes the wall clock at 12; a lamp is lowered and lights  | lamp · typing          | the small hourglass  |
// |       |                        | a lunch table: someone types at a laptop (cursor), half a sandwich, a small hourglass |                        | on the table         |
// | 2.05★ | lie @50.16             | the room sinks, the small hourglass rises and grows into the giant one over the city;| glass grows · sand     | –                    |
// |       |                        | the clock becomes the porthole outline, envelope and phone are drawn beside it; on    | holds                  |                      |
// |       |                        | "lie?" the falling sand stops in mid-air (1.2 s)                                      |                        |                      |
// | 2.06  | No @51.38 · true       | it falls on; on "true" it lands (a small burst of light)                             | sand                   | pile → bar           |
// | 2.07  | Germany · half         | the hourglass steps aside, its sand runs out as a bar `1870` `~3,300`; on "half" more | bar · crumble          | –                    |
// |       |                        | than half crumbles: `TODAY` `~1,350` · `GERMANY · HOURS WORKED PER YEAR`              |                        |                      |
// | 2.08  | similar @61.78         | four more bars (no names) grow and crumble in a cascade · `OUR WORLD IN DATA ·        | cascade                | bars → one line      |
// |       |                        | HUBERMAN & MINNS`; then the bars sink into one gold line and the hourglass sets       |                        | (LINE plate → sc03)  |
// |       |                        | behind it like a sun: only the night and the line are left (LINE_T)                   |                        |                      |
import { createCanvas } from '@napi-rs/canvas';
import * as B from './f13_b1_kit.mjs';
const { E, K } = B;
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, card, cam3, camAt, camDrift, F0, halo, prng, rad, lin } = E;

export const Z4 = 4000, ZB = 2600;
// the hand-off to sc03: the night (B.sky) and one gold line across the frame at screen y LINE_Y, nothing else
export const LINE_Y = 700;
// a glint of light runs along the line while it is the only thing left (c02 end → c03 horizon; water.mjs draws the same)
export function lineGlint(ctx, t, LT, screen = true) {
  const env = smooth(span(t, LT - 1.1, LT - .45)) * (1 - smooth(span(t, LT + 1.6, LT + 2.4))); if (env <= 0) return;
  if (screen) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); }
  for (const k of [0, .5]) { const x = lerp(-200, W + 200, ((t - LT + 1.9) / 2.6 + k) % 1); halo(ctx, x, LINE_Y, 110, .5 * env, P.halo1, P.halo0); }
  if (screen) ctx.restore();
}
export const drawLine = (ctx, u0 = 0, u1 = 1) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); K.trailSpan(ctx, [[-80, LINE_Y], [W + 80, LINE_Y]], u0, u1, { w: 2.4, spark: false }); ctx.restore(); };

// the hook's last picture (scenes/sc01.mjs: LEDGE, DU, HG; same numbers): the street keeps it and builds the city behind it
const LEDGE = [-600, 912, 2600, 870], DU = { x: 640, h: 178 }, HG = { x: 1020, h: 330 };
const ly = (x) => K.ledgeY(...LEDGE, x);
const POCKET = [DU.x + .07 * DU.h, ly(DU.x) - .4 * DU.h];
const STREET_Y = 772;                                        // the street below the ledge (ZB design y)
// the ledge, you and the hourglass exactly as the hook draws them after 1.06 (pool and contact done); o { look, armR, top, bot,
// glow, pocket (0..1: the phone's light through your coat) }. sc01 calls it from 21.8 s, the street from X1: identical pixels.
export function core(ctx, t, o = {}) {
  const bx = HG.x, by = ly(HG.x) - 1;
  K.ledge(ctx, ...LEDGE);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(bx, by + 6); ctx.scale(1, .14);
  ctx.fillStyle = rad(ctx, 0, 0, 380, [[0, rgba(P.halo1, .4)], [.5, rgba(P.halo1, .12)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 380, 0, 6.29); ctx.fill(); ctx.restore();
  E.castShadow(ctx, DU.x, ly(DU.x) + 2, 26, 280, Math.PI - .3, .5);
  E.castShadow(ctx, bx - 60, by + 2, 50, 150, Math.PI - .22, .28);
  E.du(ctx, DU.x, ly(DU.x) + 1, DU.h, { dir: 1, look: clamp(o.look ?? .875), light: 1, armR: o.armR ?? [.72, .57], armL: o.armL ?? [-.2, -.1], rim: mixHex(mixHex(P.coat, P.core1, .75), P.core0, .4) });
  const pk = o.pocket ?? 0;
  if (pk > 0) { halo(ctx, POCKET[0], POCKET[1], 34, .55 * pk, B.SCREEN, P.cream); ctx.save(); ctx.globalAlpha = pk; ctx.fillStyle = mixHex(B.SCREEN, P.cream, .4); ctx.fillRect(POCKET[0] - 4, POCKET[1] - 8, 8, 13); ctx.restore(); }
  K.hourglass(ctx, bx, by, HG.h, t, { top: o.top ?? .89, bot: o.bot ?? .2, flow: 1, light: 1, glow: o.glow ?? 1.15 });
  // the gold thread has wound back into the glass (at o.pulseT): it breathes out once, a warm flare across the hand-off
  const x = o.pulseT == null ? -1 : t - o.pulseT, fl = x <= 0 || x > 4 ? 0 : (1 - Math.exp(-x / .12)) * Math.exp(-x / .8);
  if (fl > .002) halo(ctx, bx, by - HG.h * .55, 360, .6 * fl, P.halo1, P.core1);
}
// you, across the hand-off (both sides use these): after the phone lands you look down at the street and lower your arm
// a slow push that starts in the hook's tail and goes on in the street (z offset of the hook camera)
export const creep = (t, pocket) => 25 * B.rampInt(t, pocket - .4, pocket + .8);
export const lookDown = (t, pocket) => .875 - .45 * sineIO(span(t, pocket + .15, pocket + 1.9));
export const armDown = (t, pocket) => { const u = sineIO(span(t, pocket + .05, pocket + 1.6)); return [lerp(.72, .22, u), lerp(.57, .12, u)]; };
const sweep = (ctx) => { ctx.beginPath(); ctx.moveTo(-600, 360); ctx.bezierCurveTo(200, 330, 560, 640, 640, 1500); ctx.lineTo(-600, 1500); ctx.closePath(); ctx.fillStyle = lin(ctx, 480, 600, 40, 1000, [[0, rgba(P.ind1, 0)], [.35, rgba(P.ind1, .62)], [1, rgba(P.ind0, 1)]]); ctx.fill(); };
const OY = 330;                                             // after the crane the city card is drawn in screen coordinates (+OY)
const RING = { x: 960, y: 400, r: 170 };                    // screen
const CLOCK = { x: 1500, y: 250, r: 62 };
const PORT = { x: 470, y: 330, r: 70 };
const BLD = { x: 800, y: 270, w: 320, h: 1500 };            // design (city card)
const TABLE = 760;
const GL = { x: 960, base: 690, h: 600 };                    // the giant hourglass (screen)
const GL2 = { x: 330, base: 700, h: 440 };                   // … stepped aside for the bars
const BAR = { x0: 560, y: 380, h: 30, len: 900, keep: 1350 / 3300 };
const LOW = [[520, .43], [556, .47], [592, .40], [628, .45]];   // four more rich countries (no names, as planned), h 16

const CROWD = (() => { const r = prng(4242), out = []; for (let i = 0; i < 12; i++) { const back = i % 2 === 1, dir = r() < .5 ? -1 : 1, x0 = dir > 0 ? -60 - r() * 300 : 1980 + r() * 300; out.push({ Z: ZB, y: STREET_Y + (back ? -8 : 6), h: back ? 136 : 156, x0, dir, v: 115 + r() * 50, ph: r() * 6, long: r() < .4, i }); } return out; })();   // they walk in from both sides
const SCR = createCanvas(8, 8).getContext('2d');           // scratch context: person() returns hand positions
const wrap = (x, a, b) => a + ((((x - a) % (b - a)) + (b - a)) % (b - a));
const SKY = (() => { const r = prng(77), out = []; let x = -1600; while (x < 3600) { const w = 120 + r() * 160; if (x + w < BLD.x - 6 || x > BLD.x + BLD.w + 6) out.push([x, 380 + r() * 260, w - 8, Math.floor(r() * 1000)]); x += w; } return out; })();

export function makeCity(T) {
  const S = (s, w, n) => T.S(s, w, n);
  const a = {
    phone: S('s01', 'phone'), pocket: S('s01', 'pocket'), so: S('s01', 'So why'), everyone: S('s01', 'everyone'), busier: S('s01', 'busier'), ever: S('s01', 'ever'),
    s02: T.seg('s02').start, artificial: S('s02', 'artificial'), already: S('s02', 'already'), researchers: S('s02', 'Researchers'),
    watched: S('s02', 'watched'), company: S('s02', 'company'), year: S('s02', 'year'),
    their: S('s02', 'Their early'), it: S('s02', 'It freed'), notime: S('s02', 'no time'), people: S('s02', 'People were'),
    prompts: S('s02', 'prompts'), lunch: S('s02', 'lunch'), so2: S('s02', 'So was'), every: S('s02', 'every one'), lie: S('s02', 'lie'),
    no: S('s03', 'No'), true: S('s03', 'true'), germany: S('s03', 'Germany'), half: S('s03', 'half'), most: S('s03', 'Most rich'),
    similar: S('s03', 'similar'), s04: T.seg('s04').start,
  };
  const X1 = a.pocket + 1.12, LINE_T = a.s04 + 1.1;
  const CRANE = E.aim(Z4, RING.x, RING.y - OY, 1, RING.x, RING.y);
  // the street: the hook's camera (= B.skyCam) with a slow push; then the crane up to the ring (from tC0), then breathing holds
  const tC0 = a.ever + .4, tC1 = a.already + .35;
  const streetCam = (t) => camDrift(cam3({ x: 74, y: 30, z: -330 + creep(t, a.pocket) }), t, .8);
  const KEYS = [
    [tC1, CRANE],
    [a.so2 + .2, E.aim(Z4, 960, 540 - OY, 1.03, 960, 540)],                          // slow push (no dead holds) …
    [a.true + .25, E.aim(Z4, GL.x, GL.base - GL.h * .5 - OY, 1.14, 960, 400)],      // … toward the glass through "a lie? … No."
    [a.germany + 1.3, E.aim(Z4, 960, 540 - OY, 1.0, 960, 540)],                      // back as it steps aside for the bars
    [LINE_T, E.aim(Z4, 960, 540 - OY, 1.07, 960, 540)],
  ];
  const camOf = (t) => { if (t < tC0) return streetCam(t); const cc = camDrift(camAt(t, KEYS, Z4), t, 2.2, 31); return t >= tC1 ? cc : B.camMix(streetCam(t), cc, sineIO(span(t, tC0, tC1))); };
  // crowd
  const fast = (t) => 1.2 * B.rampInt(t, a.busier - .3, a.busier + .45);
  const crowdX = (p, t) => wrap(p.x0 + p.dir * p.v * (t - X1 - .6 + fast(t)), -700, 2700);
  // the city rises behind the ledge, building by building from the middle outwards; the street with it
  const riseDY = (x, top, t) => { const d = .8 * Math.min(1, Math.abs(x - 960) / 1300); return (870 - top) * (1 - span(t, X1 + d, X1 + 1.9 + d)) ** 2; };   // quad out: they push up from behind the ledge and settle   // each starts just hidden behind the ledge
  const speed = (t) => 1 + 1.2 * smooth(span(t, a.busier - .3, a.busier + .45));
  const pose = (p, t) => { const x = crowdX(p, t); return { x, o: { dir: p.dir, walk: x / (p.h * .9) * Math.PI * 2 * p.dir + p.ph, light: -p.dir, long: p.long, armR: [1.2, 1.9] } }; };
  const tRel = (p) => a.s02 - .15 + p.i * .1;
  const REL = CROWD.map((p) => { const q = pose(p, tRel(p)); return E.person(SCR, q.x, p.y, p.h, q.o).R; });
  const ringPt = (i) => { const th = -Math.PI / 2 + (i * 5 % 12) / 12 * Math.PI * 2; return [RING.x + Math.cos(th) * RING.r, RING.y + Math.sin(th) * RING.r]; };
  const flight = 2.1;
  // the city sinks (lunch), comes back lower under the giant hourglass, sinks for good before the bars
  const cityDY = (t) => 860 * expoIn(span(t, a.notime + .9, a.notime + 1.7)) - (860 - 130) * sineIO(span(t, a.so2 + .45, a.so2 + 1.6)) + (900 - 130) * expoIn(span(t, a.true + .15, a.true + .95));
  // ring → clock → porthole outline
  const tRC = [a.people + .2, a.people + 1.0], tCP = [a.so2 - .1, a.so2 + 1.0];
  const ringPos = (t) => {
    const u = quartIO(span(t, ...tRC)), v = quartIO(span(t, ...tCP));
    const p = { x: lerp(RING.x, CLOCK.x, u), y: lerp(RING.y, CLOCK.y, u), r: lerp(RING.r, CLOCK.r, u) };
    return { x: lerp(p.x, PORT.x, v), y: lerp(p.y, PORT.y, v), r: lerp(p.r, PORT.r, v), clock: u * (1 - v), port: v };
  };
  // the lunch room builds after the ring has left, unbuilds on "So was …"
  const rIn = (t, d, len = .6) => rise(span(t, a.people + .35 + d, a.people + .35 + d + len));
  const rOut = (t, d) => 1 - expoIn(span(t, a.so2 - .2 + d, a.so2 + .4 + d));
  // the small hourglass on the table → the giant one → steps aside → sets behind the line
  const tG = [a.so2 - .2, a.every + .75], tA = [a.true + .15, a.true + 1.25];
  const glassAt = (t) => {
    const u = sineIO(span(t, ...tG)), v = sineIO(span(t, ...tA));
    const small = { x: 1350, base: TABLE + 4, h: 110 };
    let x = lerp(small.x, GL.x, u), base = lerp(small.base, GL.base, u), h = Math.exp(lerp(Math.log(small.h), Math.log(GL.h), u));
    x = lerp(x, GL2.x, v); base = lerp(base, GL2.base, v); h = lerp(h, GL2.h, v);
    return { x, base, h };
  };
  const tt = (t) => (t < a.lie ? t : t < a.no ? a.lie : t - (a.no - a.lie));
  const col = (t) => {
    const t0 = a.every - .1; if (t < t0) return null;
    const q = Math.min(t, a.lie);
    let yb = .55 * span(q, t0, a.lie) ** 1.4, yt = .2 * span(q, t0 + .55, a.lie) ** 1.4;
    if (t > a.no) { yb = lerp(.55, 1, span(t, a.no, a.no + 1.05) ** 1.7); yt = lerp(.2, 1, span(t, a.no + .15, a.true) ** 1.9); }
    return yt >= 1 ? null : [yt, yb];
  };
  // bars
  const half0 = a.half - .2, half1 = a.half + .85, END = BAR.x0 + BAR.len, KEEP = BAR.x0 + BAR.len * BAR.keep;
  const mainW = (t) => BAR.len * expoOut(span(t, a.germany - .05, a.germany + 1.15)) - (BAR.len - BAR.len * BAR.keep) * sineIO(span(t, half0, half1));
  const relAt = (x0, x1, t0, t1) => (gx) => t0 + Math.acos(clamp(1 - 2 * clamp((x1 - gx) / (x1 - x0)), -1, 1)) / Math.PI * (t1 - t0);
  const lowT = (i) => [a.most + .05 + i * .14, a.similar - .05 + i * .08];
  const tS0 = a.s04 - .65, tS1 = LINE_T - .5;

  function draw(ctx, t) {
    const c = camOf(t);
    B.sky(ctx, c, t, t < tC0 ? c : t < tC1 ? B.camMix(streetCam(t), B.skyCam(t), sineIO(span(t, tC0, tC1)), 40000) : null);
    if (t < tC1) card(ctx, c, 6000, () => sweep(ctx));
    card(ctx, c, Z4, (k) => {
      // the skyline and the office building (design coordinates), sinking / rising as a group
      const dy = cityDY(t);
      if (dy < 1000) {
        ctx.save(); ctx.translate(0, dy);
        for (const [x, y, w, sd] of SKY) { const ry = riseDY(x + w / 2, y, t); ctx.save(); ctx.translate(0, ry); B.building(ctx, x, y, w, 1500 - y + 600, t, { seed: sd, lit: .24, warm: .18, cols: Math.max(2, Math.round(w / 40)), rows: 26 }); ctx.restore(); }
        const rb = riseDY(BLD.x + BLD.w / 2, BLD.y, t);
        { ctx.save(); ctx.translate(0, rb); B.building(ctx, BLD.x, BLD.y, BLD.w, BLD.h, t, { seed: 5, lit: B.keyed(t, [[a.researchers - .2, .2], [a.company + .45, .75]]), cols: 8, rows: 34, warm: .08 }); ctx.restore(); }
        ctx.restore();
      }
      // everything after the crane: screen coordinates
      ctx.translate(0, -OY);
      if (t > a.s02 + 1.5 && t < a.true + 1.5) ringAct(ctx, t);
      if (t > a.people && t < a.so2 + 1.2) roomAct(ctx, t);
      if (t > a.so2 - .5 && t < tS1 + .4) glassAct(ctx, t);
      if (t > a.germany - .3) barsAct(ctx, t);
    });
    if (t < tC1 + .6) {
      card(ctx, c, ZB, () => {
        ctx.save(); ctx.translate(0, 110 * (1 - sineIO(span(t, X1, X1 + 1.2))));
        E.ground(ctx, [[-1400, STREET_Y], [3400, STREET_Y]], { rim: rgba(B.COOL, .55), rimW: 3, stops: [[0, P.ind1], [1, P.night0]] });
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, STREET_Y - 120, 0, STREET_Y, [[0, rgba(P.blue1, 0)], [1, rgba(P.blue1, .22)]]); ctx.fillRect(-1400, STREET_Y - 120, 4800, 120); ctx.restore();   // the street's own light (people read against it)
        ctx.restore();
        for (const p of CROWD) walker(ctx, p, t);
      });
      card(ctx, c, F0, () => core(ctx, t, { pulseT: a.pocket + 1.08, pocket: 1, look: you(t), armR: armDown(t, a.pocket) }));
    }
    // the twelve lights rise and close into the ring (screen space, between the two depths)
    for (const p of CROWD) {
      const tr = tRel(p); if (t < tr || t > tr + flight + .05) continue;
      const [rx, ry] = ringPt(p.i), ps = E.project(c, p.Z, ...REL[p.i]), pe = E.project(c, Z4, rx, ry - OY); if (!ps || !pe) continue;
      const mx = (ps[0] + pe[0]) / 2 + (p.i % 2 ? 140 : -140), my = (ps[1] + pe[1]) / 2 + 60;
      const at = (tq) => { const u = sineIO(clamp((tq - tr) / flight)); return [lerp(lerp(ps[0], mx, u), lerp(mx, pe[0], u), u), lerp(lerp(ps[1], my, u), lerp(my, pe[1], u), u)]; };
      const [x, y] = at(t), sz = 1 + .6 * Math.sin(Math.PI * clamp((t - tr) / flight));
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
      for (let k = 1; k <= 6; k++) { const [x0, y0] = at(t - (k - 1) * .045), [x1, y1] = at(t - k * .045); ctx.strokeStyle = rgba(B.ICE, .5 * (1 - k / 7)); ctx.lineWidth = 5 * sz * (1 - k / 8); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); }
      ctx.restore();
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); halo(ctx, x, y, 64 * sz, .7, B.SCREEN, P.cream); ctx.fillStyle = P.cream; ctx.beginPath(); ctx.arc(x, y, 4.5 * sz, 0, 6.29); ctx.fill(); ctx.restore();
    }
    const lu = sineIO(span(t, tS0 + .25, LINE_T - .05));                            // the line (hand-off to sc03)
    if (lu > 0) drawLine(ctx, .5 - .5 * lu, .5 + .5 * lu);
    lineGlint(ctx, t, LINE_T);
  }

  // ---- 1.11: you look down to the street, then up at the lights that rise ----
  function you(t) { return lookDown(t, a.pocket) + .55 * sineIO(span(t, a.s02 + .2, a.already)); }
  function walker(ctx, p, t) {
    const q = pose(p, t), hand = E.person(ctx, q.x, p.y, p.h, q.o).R;
    if (t < tRel(p)) {
      const sp = speed(t);
      if (sp > 1.05) {
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = lin(ctx, hand[0], 0, hand[0] - p.dir * 140 * (sp - 1), 0, [[0, rgba(B.SCREEN, .5)], [1, rgba(B.SCREEN, 0)]]);
        ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(hand[0], hand[1]); ctx.lineTo(hand[0] - p.dir * 140 * (sp - 1), hand[1] + 2); ctx.stroke(); ctx.restore();
      }
      B.phoneLight(ctx, hand[0], hand[1] - 4, 4.2);
    }
  }

  // ---- 2.01–2.03: ring, months, counter; then the ring travels and becomes the clock, later the porthole outline ----
  function ringAct(ctx, t) {
    const rp = ringPos(t), close = smooth(span(t, a.already - .55, a.already + .1));
    if (close > 0) {
      B.ring(ctx, rp.x, rp.y, rp.r, t, { u: close, pulse: smooth(span(t, a.already, a.already + 1)) * (1 - rp.clock) * (1 - rp.port), a: 1 - .45 * rp.port, w: lerp(RING.r * .07, 5, Math.max(rp.clock, rp.port)) });
      if (rp.port > 0) { ctx.save(); ctx.strokeStyle = rgba(B.COOL, .8 * rp.port); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r * .76 * rp.port, 0, 6.29); ctx.stroke(); ctx.restore(); }
    }
    if (rp.clock > .5) {   // the clock's hands grow from the centre: 12 o'clock
      const hk = smooth(span(t, tRC[1] - .2, tRC[1] + .3)) * (1 - smooth(span(t, tCP[0], tCP[0] + .4)));
      ctx.save(); ctx.strokeStyle = P.cream; ctx.lineCap = 'round'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(rp.x, rp.y); ctx.lineTo(rp.x, rp.y - 44 * hk); ctx.stroke();
      ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(rp.x, rp.y); ctx.lineTo(rp.x + 2, rp.y - 32 * hk); ctx.stroke();
      const sa = t * .9; ctx.strokeStyle = rgba(P.halo1, .8 * hk); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(rp.x, rp.y); ctx.lineTo(rp.x + Math.sin(sa) * 50 * hk, rp.y - Math.cos(sa) * 50 * hk); ctx.stroke(); ctx.restore();
    }
    for (const p of CROWD) if (t >= tRel(p) + flight && rp.clock < .2 && rp.port < .01) { const [x, y] = ringPt(p.i); halo(ctx, x, y, 20, .5 * (1 - rp.clock * 5), B.ICE, P.cream); }
    const tm = a.watched, retract = smooth(span(t, a.notime + .5, a.notime + .95));
    if (t > tm - .3 && retract < 1) B.monthArcs(ctx, RING.x, RING.y, RING.r + 44, t, (i) => (i < 8 ? span(t, tm + i * .28, tm + i * .28 + .32) * (1 - retract) : 0), { w: 14, a: smooth(span(t, tm - .3, tm + .2)) * (1 - retract) });
    B.caption(ctx, t, RING.x + RING.r + 110, RING.y - 40, { num: '8 months', label: 'ONE COMPANY', src: 'UC BERKELEY · 2025', a: tm + .15, b: a.their - .15 });
    const v = B.keyed(t, [[a.it - .05, 0], [a.it + .5, 6.4], [a.notime, 0]]);
    const uIn = B.inOut(t, a.their + .1, a.people - .05);
    if (uIn > 0) {
      const colN = mixHex(P.cream, B.COOL, smooth(span(t, a.notime - .05, a.notime + .35)));
      ctx.save(); ctx.beginPath(); ctx.rect(RING.x - 120, RING.y - 120, 240, 160); ctx.clip();
      B.rollDigits(ctx, v, RING.x, RING.y + 40 + (1 - expoOut(uIn)) * 150, { size: 130, align: 'center', col: colN }); ctx.restore();
      B.line(ctx, 'TIME FREED UP', RING.x + RING.r + 110, RING.y + 20, B.inOut(t, a.their + .45, a.people - .05), { size: 56 });
    }
  }
  // ---- 2.04: the lunch table (a vignette in the dark, built up from the table line) ----
  function roomAct(ctx, t) {
    const lampY = lerp(-140, 262, expoOut(span(t, a.people + .3, a.people + 1.1))) - 520 * expoIn(span(t, a.so2 - .1, a.so2 + .75));
    const flick = span(t, a.people + .9, a.people + 1.6), on = smooth(flick) * (1 - .3 * Math.sin(flick * Math.PI * 2) ** 2 * (1 - flick));   // warms up with one soft stutter
    const lx = 700, tbl = smooth(span(t, a.people + .4, a.people + 1.1)) * (1 - expoIn(span(t, a.so2 + .25, a.so2 + .85)));
    const lit = on * (1 - smooth(span(t, a.so2 - .1, a.so2 + .6)));
    if (lit > 0) {   // the lamp's light: on the dark around it, a cone onto the table
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = rad(ctx, lx, lampY + 60, 820, [[0, rgba(P.halo0, .42 * lit)], [.3, rgba(P.halo1, .16 * lit)], [1, rgba(P.shade0, 0)]]); ctx.fillRect(lx - 900, lampY - 400, 1800, 1400);
      ctx.fillStyle = lin(ctx, 0, lampY, 0, TABLE, [[0, rgba(P.halo0, .2 * lit)], [1, rgba(P.halo1, .05 * lit)]]); ctx.beginPath(); ctx.moveTo(lx - 80, lampY + 10); ctx.lineTo(lx + 80, lampY + 10); ctx.lineTo(lx + 560, TABLE); ctx.lineTo(lx - 560, TABLE); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    // above the table line: person, laptop, sandwich (they rise from behind the table, sink back on "So was")
    ctx.save(); ctx.beginPath(); ctx.rect(-500, -500, 3000, TABLE - 2 + 500); ctx.clip();
    const up = (d, len) => (1 - rIn(t, d, len)) * 520 + (1 - rOut(t, d * .3)) * 520;
    const ty = Math.sin(t * 15) * .07, ty2 = Math.sin(t * 13 + 1.3) * .07;
    E.person(ctx, 560, 1040 + up(.45, .7), 560, { dir: 1, view: 'side', light: 1, lean: .16, armR: [1.42, 1.72 + ty], armL: [1.3, 1.86 + ty2], rim: P.halo1 });
    const ly = up(.7, .5), scrOn = smooth(span(t, a.prompts - .2, a.prompts + .15));
    ctx.save(); ctx.translate(0, ly);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, 1000, 640, 380, [[0, rgba(B.SCREEN, .3 * scrOn)], [1, rgba(B.SCREEN, 0)]]); ctx.fillRect(600, 260, 800, 600); ctx.restore();
    ctx.fillStyle = mixHex(P.night1, mixHex(B.SCREEN, P.cream, .3), scrOn); B.poly(ctx, [[860, TABLE - 4], [1130, TABLE - 4], [1150, 560], [880, 552]]); ctx.fill();
    ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 2; ctx.stroke();
    if (scrOn > .5) {
      ctx.fillStyle = rgba(P.blue1, .65); for (const [yy, x1] of [[592, 1040], [622, 1090], [652, 990]]) ctx.fillRect(910, yy, x1 - 910, 12);
      ctx.fillStyle = rgba(P.night0, .3); ctx.fillRect(900, 694, 220, 30);
      if (Math.floor(t * 2.2) % 2 === 0) { ctx.fillStyle = P.night0; ctx.fillRect(914, 699, 5, 20); }
    }
    ctx.restore();
    ctx.save(); ctx.translate(0, up(1.0, .5));
    ctx.fillStyle = rgba(P.cream, .5); ctx.beginPath(); ctx.ellipse(1230, TABLE - 3, 84, 11, 0, 0, 6.29); ctx.fill();
    ctx.fillStyle = mixHex(P.shade1, P.halo1, .35); B.poly(ctx, [[1170, TABLE - 7], [1290, TABLE - 7], [1186, TABLE - 66]]); ctx.fill();
    ctx.fillStyle = rgba(P.shade0, .9); ctx.fillRect(1180, TABLE - 36, 70, 6);
    ctx.restore();
    ctx.restore();
    // the table: its top is a line of light that runs out from the middle; the body grows down from it
    if (tbl > 0) {
      const half = 520 * tbl;
      ctx.save(); ctx.beginPath(); ctx.rect(960 - half - 10, TABLE - 10, 2 * half + 20, 360 * tbl + 10); ctx.clip();
      ctx.fillStyle = lin(ctx, 0, TABLE, 0, 1100, [[0, P.ind2], [1, P.night0]]); ctx.fillRect(440, TABLE + 4, 1040, 28); ctx.fillRect(500, TABLE + 30, 24, 320); ctx.fillRect(1400, TABLE + 30, 24, 320); ctx.restore();
      K.trailSpan(ctx, [[960 - half, TABLE], [960 + half, TABLE]], 0, 1, { w: 2.2, spark: false, a: .9 });
    }
    // the lamp (lowered on its cord, the hero of the room)
    ctx.strokeStyle = P.night0; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(lx, -400); ctx.lineTo(lx, lampY - 70); ctx.stroke();
    ctx.fillStyle = mixHex(P.night1, P.ind2, .5); B.poly(ctx, [[lx - 54, lampY - 72], [lx + 54, lampY - 72], [lx + 100, lampY], [lx - 100, lampY]]); ctx.fill();
    ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = rad(ctx, lx, lampY, 110, [[0, mixHex(P.night1, P.core0, on)], [.35, mixHex(P.night1, P.core1, on)], [.7, rgba(P.halo0, .6 * on)], [1, rgba(P.halo0, 0)]]); ctx.beginPath(); ctx.ellipse(lx, lampY, 104, 30, 0, 0, Math.PI); ctx.fill();
    if (on > 0) halo(ctx, lx, lampY + 8, 160, .45 * on, P.halo0, P.core0);
  }
  // ---- 2.05–2.08: the giant hourglass, then the bars ----
  function glassAct(ctx, t) {
    const gp = glassAt(t), set = sineIO(span(t, tS0, tS1));
    // the three promises beside it: the clock became the porthole (ringAct); envelope and phone are drawn by a cool line
    const dr = smooth(span(t, a.so2 + .5, a.so2 + 1.4)), gone = expoIn(span(t, a.true + .1, a.true + .8));
    if (dr > 0 && gone < 1) {
      const pull = (x, y) => [lerp(x, gp.x, gone), lerp(y, gp.base - gp.h * .5, gone)], sc = 1 - gone;
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(B.COOL, .85); ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.shadowColor = rgba(P.blue0, .9); ctx.shadowBlur = 14;
      const [ex, ey] = pull(1440, 250), [qx, qy] = pull(1460, 520);
      const env = [[ex - 76 * sc, ey - 50 * sc], [ex + 76 * sc, ey - 50 * sc], [ex + 76 * sc, ey + 50 * sc], [ex - 76 * sc, ey + 50 * sc], [ex - 76 * sc, ey - 50 * sc], [ex, ey + 6 * sc], [ex + 76 * sc, ey - 50 * sc]];
      const phn = [[qx - 30 * sc, qy - 54 * sc], [qx + 30 * sc, qy - 54 * sc], [qx + 30 * sc, qy + 54 * sc], [qx - 30 * sc, qy + 54 * sc], [qx - 30 * sc, qy - 54 * sc]];
      for (const pts of [env, phn]) { const n = Math.max(2, Math.ceil(pts.length * dr)); B.poly(ctx, pts.slice(0, n), false); ctx.stroke(); }
      ctx.restore();
    }
    if (set >= 1) return;
    ctx.save();
    if (set > 0) { ctx.beginPath(); ctx.rect(-500, -500, 3000, LINE_Y + OY - OY + 500 - 1); ctx.clip(); }
    const base = gp.base + 520 * set;
    const cl = col(t), landed = smooth(span(t, a.no + .9, a.true + .2));
    const g = K.hourglass(ctx, gp.x, base, gp.h, tt(t), { top: .55, bot: .26 + .06 * landed, flow: smooth(span(t, a.true + .4, a.true + 1.4)), light: 1, glow: 1 });   // after it lands, time runs again
    if (cl) {
      const yN = g.neck[1], yP = g.botPeak[1] + 4, L = yP - yN, y0 = yN + cl[0] * L, y1 = Math.min(yP, yN + cl[1] * L);
      if (y1 - y0 > 1) {
        K.trailSpan(ctx, [[gp.x, y0], [gp.x, y1]], 0, 1, { w: Math.max(1.6, gp.h * .005), spark: false });
        const r = prng(9), tq = tt(t); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = P.core1;
        for (let i = 0; i < 22; i++) { const ph = (r() + tq * .6) % 1, gy = lerp(y0, y1, ph); ctx.globalAlpha = .5 + .5 * r(); ctx.fillRect(gp.x - 4 + r() * 8, gy, 2.4, 3.4); }
        ctx.restore();
      }
      if (t > a.lie - .05 && t < a.no) halo(ctx, gp.x, y1, 26, .5, P.halo0, P.core0);
    }
    const burst = span(t, a.true, a.true + .7);
    if (burst > 0 && burst < 1) { halo(ctx, gp.x, g.botPeak[1], 60 + 220 * expoOut(burst), .7 * (1 - burst), P.halo0, P.core0); E.dust(ctx, 515, 300, gp.x, g.botPeak[1], 40 + 120 * expoOut(burst), 26, t, .9 * (1 - burst)); }
    // the sand runs out of the lower bulb into the bar
    const run = span(t, a.germany - .15, a.germany + .25) * (1 - smooth(span(t, a.germany + 1.2, a.germany + 2)));
    if (run > 0) {
      const p0 = [gp.x + gp.h * .05, base - gp.h * .03], p1 = [BAR.x0 - 30, base - gp.h * .03], p2 = [BAR.x0 + 4, BAR.y + BAR.h / 2];
      const pts = Array.from({ length: 24 }, (_, i) => { const u = i / 23; return [lerp(lerp(p0[0], p1[0], u), lerp(p1[0], p2[0], u), u), lerp(lerp(p0[1], p1[1], u), lerp(p1[1], p2[1], u), u)]; });
      K.trailSpan(ctx, pts, 0, run, { w: 2, spark: false });
    }
    ctx.restore();
  }
  function barsAct(ctx, t) {
    const sink = sineIO(span(t, tS0, tS1)), toY = (y, h) => lerp(y, LINE_Y - h / 2, sink);
    if (t < LINE_T - .05) {
      // the 1870 length stays as a dashed ghost after the crumble: the half that went is still readable
      const gh = smooth(span(t, half0 + .3, half1 + .3)) * (1 - smooth(span(t, tS0 - .3, tS0 + .2)));
      if (gh > 0) { ctx.save(); ctx.setLineDash([7, 9]); ctx.strokeStyle = rgba(B.COOL, .5 * gh); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(KEEP + 6, BAR.y, END - KEEP - 6, BAR.h, 10); ctx.stroke(); ctx.restore(); }
      const w = mainW(t), hb = lerp(BAR.h, 2, sink);
      if (w > 1 && sink < 1) {
        const bp = B.goldBar(ctx, BAR.x0, toY(BAR.y, hb), w, hb, t, { glow: .45 });
        // a slow sheen runs along the bar, like sand sliding inside it (life while it is read)
        const sx = BAR.x0 - 160 + ((t - a.germany) * 210) % (BAR.len + 320);
        ctx.save(); ctx.clip(bp); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, sx - 140, 0, sx + 140, 0, [[0, rgba(P.core0, 0)], [.5, rgba(P.core0, .55)], [1, rgba(P.core0, 0)]]); ctx.fillRect(sx - 140, toY(BAR.y, hb) - 4, 280, hb + 8); ctx.restore();
      }
      B.crumble(ctx, KEEP, END, BAR.y, BAR.h, t, relAt(KEEP, END, half0, half1), { seed: 21, n: 260, fall: 560 });
      LOW.forEach(([y, keep], i) => {
        const [tg, tc] = lowT(i), x1 = BAR.x0 + BAR.len, xk = BAR.x0 + BAR.len * keep, hh = lerp(16, 2, sink);
        const wv = BAR.len * expoOut(span(t, tg, tg + .9)) - (BAR.len - BAR.len * keep) * sineIO(span(t, tc, tc + .5));
        if (wv > 1 && sink < 1) B.goldBar(ctx, BAR.x0, toY(y, hh), wv, hh, t, { cheap: true, a: .9 });
        B.crumble(ctx, xk, x1, y, 16, t, relAt(xk, x1, tc, tc + .5), { seed: 40 + i, n: 150, fall: 760 });
      });
    }
    // numbers stand over the bar's ends (then: dimmed, now: bright); the title sits under the bar
    const dim = 1 - .55 * smooth(span(t, half0, half1));
    // phone-readable: years 56 px, numbers 110 px, one label; the source stays one small line
    B.line(ctx, '1870', END, BAR.y - 128, B.inOut(t, a.germany + .8, tS0 - .3), { size: 56, align: 'right', a: dim });
    B.line(ctx, '~3,300 h', END, BAR.y - 24, B.inOut(t, a.germany + .95, tS0 - .3), { size: 110, serif: true, align: 'right', a: dim });
    B.line(ctx, 'TODAY', KEEP, BAR.y - 128, B.inOut(t, half1 - .1, tS0 - .3), { size: 56, align: 'right' });
    B.line(ctx, '~1,350 h', KEEP, BAR.y - 24, B.inOut(t, half1, tS0 - .3), { size: 110, serif: true, align: 'right' });
    B.line(ctx, 'GERMANY', BAR.x0, BAR.y + BAR.h + 76, B.inOut(t, a.germany + .25, tS0 - .25), { size: 56 });
    B.line(ctx, 'OUR WORLD IN DATA · HUBERMAN & MINNS', BAR.x0, LOW[3][0] + 70, B.inOut(t, a.most + .6, tS0 - .3), { size: 30, col: rgba(P.halo2, .85) });
  }
  return { X1, LINE_T, draw, a };
}
const rise = B.rise;
