// Film 7 · c01 · the hook (00a + C1 + 00b), 0 → the c01>c02 line plate (~73.95). Builder: c01 (also lib/f7_kit.mjs).
// Three continuous takes, two in-world transitions, every accent anchored to a word (T.S / T.E), never to seconds.
//
// | shot | VO words (anchor)                         | image                                                                                   | hero light        | camera                                   | flows on by                                   | ★ / sound            |
// |------|-------------------------------------------|-----------------------------------------------------------------------------------------|-------------------|------------------------------------------|-----------------------------------------------|----------------------|
// | 1.01 | Can superintelligence grow forever?       | THE THUMBNAIL: night Earth from low orbit, violet limb, city stipple, Milky Way; the     | the curve's tip   | still, a slow push                       | take O1 continues                              | glass_hum (new) at   |
// |      |                                           | amber curve rises from the hero city and touches the dome (ring of refracted light);     | at the contact    |                                          |                                               | the end of "forever?"|
// |      |                                           | the title writes itself per word into the sky (Instrument Serif)                          |                   |                                          |                                               |                      |
// | 1.02 | Not smarter. Bigger.                      | "smarter": a cool silver line glints along the curve and goes out; "Bigger": the curve    | curve             | push up to the contact, then dives DOWN  | fly INTO the hero city's light (lightCover)  | whoosh_up (dive)     |
// |      |                                           | thickens + brightens in one snap, sparks burst at the tip                                 |                   | along the curve into the city light       | → the ground world grows out of the same light|                      |
// | 1.03 | More chips. More power plants. More robots| ground world: the curve's foot runs along a night plain from a town of light; one thing  | the line on the   | pull out of the light, lateral dolly     | continuous take G                              |                      |
// |      |                                           | per word grows out of the ground beside it: chip wafers on stems, cooling towers that    | ground            | right along the line                     |                                               |                      |
// |      |                                           | breathe steam, seven small robot silhouettes that step forward in unison                  |                   |                                          |                                               |                      |
// | 1.04 | For everyone.                             | the camera rises: homes on the hills light up in a wave; people on a rise (from behind)  | warm windows      | crane up + pull back 1.2 s               | continuous                                     |                      |
// |      |                                           | look up at the curve                                                                      |                   |                                          |                                               |                      |
// | 1.05 | That's the promise… made out loud.        | a vast dark stage in the landscape (truss, light towers, speaker in a spotlight, robots   | the screen        | push toward the screen 3.4 s             | continuous                                     |                      |
// |      |                                           | at the flanks, the audience); the screen says SUSTAINABLE ABUNDANCE; the curve rises      |                   |                                          |                                               |                      |
// |      |                                           | behind the stage                                                                          |                   |                                          |                                               |                      |
// | 1.06 | CLIP C1 (Musk, 12 s)                      | the stage screen opens (TV line) into the real footage, 1120+ px wide; lower third        | the clip          | slow push                                | the screen closes back to its words            | bloom (screen on)    |
// | 1.07 | Tesla calls it sustainable abundance.     | the words again; source TESLA · MASTER PLAN PART IV · 2025; on "No limit named" the      | curve             | tilt up along the curve 1.5 s            | MATCH CUT on sky + curve (same stars, same     | whoosh_airy (pause)  |
// |      | No limit named.                           | camera tilts up the curve: it climbs on and on, no end, no ceiling                        |                   |                                          | line, morphed into the orbit curve over .9 s) |                      |
// | 1.08★| But there is a limit. Not money. Not      | orbit again: the tip reaches the dome; on "limit" the rim light runs along the whole     | the dome rim      | settles back to the thumbnail framing    | continuous take O2                             | glass_hum on contact |
// |      | politics. Physics.                        | edge, stars refract; a coin and a parliament on the far limb stay dark; on "Physics"     |                   |                                          |                                               | shimmer_rings Physics|
// |      |                                           | lines of light spread over the glass (never a crack)                                     |                   |                                          |                                               |                      |
// | 1.09 | So here's the real question … expiry date?| pull back to the whole hemisphere over the Earth; sparks slide down the glass like rain; | dome              | pull back 2.2 s, then a slow push        | continuous                                     |                      |
// |      |                                           | "expiry date": the curve's glow dims by a breath and recovers                             |                   |                                          |                                               |                      |
// | 1.10 | In the next ten minutes: wall · promise · | "wall" the rim flares · "promise" four cream cards flicked out of the dark land face     | each beat         | holds wide                               | continuous                                     | card (flick)         |
// |      | what it would really take                 | down in a row · "really take" a warm ring glimmers round the Earth and sinks back         |                   |                                          |                                               |                      |
// | 1.11 | First, the wall. Imagine our appetite …   | the cards slide off; in: the curve as a calm chart line, year ticks run up it,            | curve             | move in 2 s, slow push                   | continuous                                     |                      |
// |      | a little every year.                      | +2.3 % / YEAR (TOM MURPHY · DO THE MATH)                                                  |                   |                                          |                                               |                      |
// | 1.12 | In about four hundred years … boiling     | land and sea shimmer, steam wisps rise from the sea, the dome's inside glows warm;        | warm haze         | drift right, hold with life              | continuous                                     |                      |
// |      | water.                                    | ~400 YEARS · THOUGHT EXPERIMENT · TOM MURPHY · UC SAN DIEGO                               |                   |                                          |                                               |                      |
// | 1.13 | Not from carbon. From waste heat alone.   | wind turbines and solar rows grow on the limb; heat rises from them in fine lines, hits  | the curve         | then FOLLOWS THE CURVE DOWN (1.5 s) to   | the world dims, a band opens from the line     | whoosh (follow-down) |
// |      | Even if every watt were clean.            | the glass and comes back down                                                             |                   | its foot: one line across the frame      | until it is the c01>c02 LINE PLATE             |                      |
import { W, H, rgba, clamp, lin, mix, sm, prng, text } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { lowerThird } from '../lib/f6_kit.mjs';
import { F7, EARTH, CURVE, f7Prepare, skyWarm, sky, camO, earthHorizon, curveO, curve, dome, ring, card, cardPrepare, lightCover, limbY, seaSpots, onSphere, ease, keys, mod, n1, glowAt } from '../lib/f7_kit.mjs';
import { ground, groundPrepare, gmap, GCURVE, STAGE, RISE_X } from '../lib/f7_c01_ground.mjs';

const TAU = Math.PI * 2;
const PRINT = { riso: .25 };
const bump = (t, a, b, c, d) => sm(lin(a, b, t)) * (1 - sm(lin(c, d, t)));
// Catmull-Rom through timed keys [[t, [x, y, z, tilt]]] (velocity stays continuous through the keys); ends held
function path(t, K) {
  if (t <= K[0][0]) return K[0][1]; if (t >= K[K.length - 1][0]) return K[K.length - 1][1];
  let i = 0; while (t > K[i + 1][0]) i++;
  const k0 = K[Math.max(0, i - 1)], k1 = K[i], k2 = K[i + 1], k3 = K[Math.min(K.length - 1, i + 2)], u = (t - k1[0]) / (k2[0] - k1[0]);
  const d1 = (k2[0] - k1[0]);
  return k1[1].map((v, j) => {
    const m1 = i > 0 ? (k2[1][j] - k0[1][j]) / (k2[0] - k0[0]) * d1 : 0, m2 = i + 2 < K.length ? (k3[1][j] - k1[1][j]) / (k3[0] - k1[0]) * d1 : 0;
    const u2 = u * u, u3 = u2 * u; return (2 * u3 - 3 * u2 + 1) * v + (u3 - 2 * u2 + u) * m1 + (-2 * u3 + 3 * u2) * k2[1][j] + (u3 - u2) * m2;
  });
}

export default async (T, R) => {
  await f7Prepare(); await groundPrepare();
  const cards = [1, 2, 3, 4].map((num) => ({ num }));
  await cardPrepare(cards);
  const { out: HO } = handsOf('c01', T);
  const S = (ph, n, seg = '00b') => T.S(seg, ph, n), E = (ph, n, seg = '00b') => T.E(seg, ph, n);
  const A = {
    can: T.S('00a', 'Can'), forever: T.S('00a', 'forever'), foreverE: T.E('00a', 'forever'), not: T.S('00a', 'Not smarter'), smarter: T.S('00a', 'smarter'), bigger: T.S('00a', 'Bigger'), biggerE: T.E('00a', 'Bigger'),
    chips: T.S('00a', 'chips'), plants: T.S('00a', 'power plants'), robots: T.S('00a', 'robots'), robotsE: T.E('00a', 'robots'), everyone: T.S('00a', 'everyone'), forE: T.S('00a', 'For everyone'),
    promise: T.S('00a', "That's the promise"), loud: T.E('00a', 'loud'),
    tesla: S('Tesla'), sustainable: S('sustainable'), abundanceE: E('sustainable abundance'), noLimit: S('No limit'), named: E('named'), but: S('But there'), limit: S('limit', 1),
    money: S('money'), politics: S('politics'), physics: S('Physics'), so: S("So here's"), expiry: S('expiry'), dateE: E('date'), inNext: S('In the next'), wall: S('wall'), promise2: S('promise misses'), take: S('really take'), takeE: E('really take'),
    first: S('First'), imagine: S('Imagine'), growing: S('growing'), yearE: E('every year'), four: S('four hundred'), boiling: S('boiling'), waterE: E('boiling water'), carbon: S('Not from carbon'), waste: S('waste heat'), even: S('Even if'), clean: E('were clean'),
  };
  const C1 = T.clip('C1');
  const tD = 7.0;                                // the light cut O1 → G (frame-aligned)
  const tC = Math.round((A.named + .12) * 30) / 30;   // the sky match cut G → O2, in the pause after "named."
  const HA = HO.a;                               // the plate takes over here (film.mjs draws it from HA)

  // ============================================================== O1: the thumbnail, the glint, Bigger, the dive into the city
  const CW = curveO();                           // world points of THE curve (foot, then exponential to the contact)
  const iS = 30;                                 // index of the hero city S in CW
  const skyO1 = { ox: 700, oy: 430, ang: -1.12 };
  const title = [['Can', 'Superintelligence'], ['Grow', 'Forever?']];
  const titleT = (() => { const t0 = .12, t1 = A.forever - .45, lens = [3, 17, 4, 8], tot = lens.reduce((a, b) => a + b, 0) + 6; let acc = 0; return lens.map((l) => { const a = t0 + (t1 - t0) * acc / tot; acc += l + 1.5; return [a, t0 + (t1 - t0) * Math.min(tot, acc) / tot]; }); })();
  function drawTitle(ctx, t, m) {
    // written into the sky (it belongs to the world: it leaves with the camera's dive)
    const size = 104 * m.k, x0 = m.X(-777), ys = [m.Y(-3463), m.Y(-3335)];
    ctx.save(); ctx.font = `${size}px "Instrument Serif"`;
    let wi = 0;
    title.forEach((line, li) => {
      let x = x0;
      for (const wd of line) {
        const [a, b] = titleT[wi++], u = ease.out(lin(a, b, t)), ww = ctx.measureText(wd).width;
        if (u > 0) {
          ctx.save(); ctx.beginPath(); ctx.rect(x - 4, ys[li] - size, (ww + 12) * u, size * 1.35); ctx.clip();
          ctx.shadowColor = 'rgba(255,214,160,.35)'; ctx.shadowBlur = 18 * m.k;
          text(ctx, wd, x, ys[li], { size, font: 'Instrument Serif', color: '#f6efdc' });
          ctx.restore();
          if (u < 1) glowAt(ctx, x + (ww + 8) * u, ys[li] - size * .32, 40 * m.k, .5, F7.amber, F7.amberCore);
        }
        ctx.font = `${size}px "Instrument Serif"`; x += ww + size * .26;
      }
    });
    ctx.restore();
  }
  const camO1 = (t) => {
    if (t < A.not - .05) return keys(t, [[0, [200, -3230, .86]], [A.not - .05, [218, -3248, .9], ease.sine]]);
    const tp = A.bigger + .1;   // the push up to the contact ends just after "Bigger"
    if (t < tp) return keys(t, [[A.not - .05, [218, -3248, .9]], [tp, [300, -3440, 1.5]]]);
    // the dive: ride the curve from near the top down into the city, zoom in exponentially
    const u = ease.inn(lin(tp, tD - .02, t)) * .985 + .015 * lin(tp, tD, t), q = 1 - u, fi = iS + (CW.length - 1 - iS) * q * .93, i0 = Math.min(CW.length - 2, Math.floor(fi));
    const a = [300, -3440], b = [mix(CW[i0][0], CW[i0 + 1][0], fi - i0), mix(CW[i0][1], CW[i0 + 1][1], fi - i0)], bl = sm(lin(tp, tp + .25, t));
    return [mix(a[0], b[0], bl), mix(a[1], b[1], bl), 1.5 * Math.pow(7, ease.inn(lin(tp, tD, t)))];
  };
  function O1(ctx, t) {
    const [x, y, z] = camO1(t), cam = { x, y, z }, m = camO(cam);
    const sO = { ...skyO1, ox: skyO1.ox - (x - 200) * .05, oy: skyO1.oy - (y + 3230) * .05 };
    sky(ctx, t, sO);
    drawTitle(ctx, t, m);
    earthHorizon(ctx, t, cam, {});
    const snap = ease.out(lin(A.bigger, A.bigger + .3, t));
    dome(ctx, t, cam, { touch: .55 + .25 * Math.sin(t * 1.3) ** 2 + .3 * bump(t, A.foreverE - .05, A.foreverE + .15, A.foreverE + .5, A.foreverE + 1.2) + .4 * snap, lines: .035 + .02 * snap, linesA: .8, glass: .6, skyO: sO });
    const pts = CW.map(([px, py, w]) => [m.X(px), m.Y(py), w]);
    // "smarter": a faint cool line glints along the curve for a moment and goes out (dismissed)
    const ga = bump(t, A.smarter - .05, A.smarter + .1, A.smarter + .38, A.smarter + .62);
    if (ga > 0) curve(ctx, t, pts.slice(iS).map(([px, py]) => [px - 9, py + 3, .8]), { tone: 'cool', a: ga * .9, w: .8, glint: 1, tip: false, seed: 3 });
    curve(ctx, t, pts, { w: 1.12 + .5 * snap, br: 1 + .45 * snap, sparks: 2 + 10 * snap, burst: t > A.bigger ? A.bigger + .02 : null, seed: 1 });
    lightCover(ctx, t, t < tD - .5 ? .5 * ease.inn(lin(tD - 1.0, tD - .5, t)) : .5 + .5 * lin(tD - .5, tD - 1 / 30, t), { cx: m.X(CURVE.S[0]), cy: m.Y(CURVE.S[1]) });
  }

  // ============================================================== G: the ground world, the stage, the clip, the tilt up
  const KG = [
    [tD, [-10, 790, 6.0, 0]], [tD + .55, [620, 668, 1.34, 0]], [A.plants, [1420, 640, 1.3, 0]], [A.robots + .1, [2260, 632, 1.3, 0]], [A.forE, [2860, 622, 1.24, 0]],
    [A.everyone + .7, [3330, 575, 1.1, 0]], [A.promise + .5, [3700, 492, .9, 0]], [C1.start - .55, [STAGE.sx, 430, 2.55, 0]], [C1.end + .2, [STAGE.sx + 6, 432, 2.68, 0]],
    [A.noLimit - .15, [STAGE.sx + 14, 432, 2.72, 0]], [tC, [RISE_X + 14, 330, 2.2, 1300]],
  ];
  const camG = (t) => {
    // the pull out of the light is expo-out; the dolly is one smooth spline; push and tilt are quart in-out
    if (t < KG[1][0]) { const u = ease.out(lin(KG[0][0], KG[1][0], t)), a = KG[0][1], b = KG[1][1]; return [mix(a[0], b[0], u), mix(a[1], b[1], u), Math.exp(mix(Math.log(a[2]), Math.log(b[2]), u)), 0]; }
    if (t < KG[7][0]) return path(t, KG.slice(1, 8));
    if (t < KG[9][0]) return keys(t, [KG[7], KG[8], KG[9]], ease.sine);
    return keys(t, [KG[9], KG[10]], (x) => ease.io(x) * .8 + x * .2);
  };
  const stG = (t) => ({
    chips: lin(A.chips - .12, A.chips + 1.1, t), plant: lin(A.plants - .1, A.plants + 1.0, t), robots: lin(A.robots - .12, A.robots + .6, t), step: lin(A.robots + .35, A.robots + .95, t),
    homes: lin(A.everyone - .05, A.everyone + 1.4, t) * 1.45, people: 1, spot: .4 + .6 * sm(lin(A.promise - .3, A.promise + .4, t)),
    clipOn: sm(lin(C1.start - .5, C1.start, t)) * (1 - sm(lin(C1.end, C1.end + .5, t))), words: 1,
    curveW: 1, curveBr: 1 + .25 * bump(t, A.promise, A.promise + .4, A.loud, A.loud + .8), sparks: 2,
  });
  const gAt = (t) => { const [x, y, z, tilt] = camG(t); return { x, y, z, tilt }; };
  function G(ctx, t) {
    const cam = gAt(t), st = stG(t);
    const out = ground(ctx, t, T, cam, st);
    // the source label near the screen while "Tesla calls it sustainable abundance" (still while it is read; leaves with the tilt)
    const la = bump(t, A.tesla + .1, A.tesla + .5, A.noLimit + .2, A.noLimit + .6);
    if (la > 0) { const sc = out.screen, y = Math.min(890, sc.y + sc.h + 52); text(ctx, 'TESLA · MASTER PLAN PART IV · 2025', sc.x, y, { size: 19, weight: 600, color: rgba('#cfd6ee', .9 * la), spacing: 4 }); }
    // lower third while the clip plays
    lowerThird(ctx, t, T, 'C1', { x: 120, y: 850, info: { name: 'Elon Musk', role: '', source: 'Tesla shareholder meeting', date: 'Nov 2025' } });
    lightCover(ctx, t, 1 - lin(tD, tD + 1.05, t), { cx: out.m.X(0), cy: out.m.Y(790) });
  }
  // what G shows at the match cut: the curve's screen points and the sky (O2 starts from exactly this)
  const gEnd = (() => { const cam = gAt(tC), m = gmap(cam, 1); return { pts: GCURVE.map(([x, y, d]) => [m.X(x), m.Y(y), clamp(d * Math.min(1.6, .55 + .45 * m.k), .25, 1.8)]), skyO: { ox: -(cam.x) * .05 + 600, oy: cam.tilt * .95 - (cam.y - 540) * .06 - 260, ang: -.62 } }; })();
  const resampleY = (P, n = 90) => { const vis = P.filter(([, y]) => y > -260 && y < H + 260).sort((a, b) => b[1] - a[1]); if (vis.length < 2) return null; const out = []; for (let i = 0; i < n; i++) { const yy = H + 240 - (H + 480) * i / (n - 1); let j = 0; while (j < vis.length - 2 && vis[j + 1][1] > yy) j++; const a = vis[j], b = vis[j + 1], q = clamp((yy - a[1]) / ((b[1] - a[1]) || 1)); out.push([mix(a[0], b[0], q), yy, mix(a[2] ?? 1, b[2] ?? 1, q)]); } return out; };
  const gEndY = resampleY(gEnd.pts);

  // ============================================================== O2: the limit, the dome, the question, the road map, the wall, the heat, the follow-down
  const KO = [
    [tC, [330, -3300, 2.0]], [A.limit + .02, [300, -3410, 1.55]], [A.limit + 1.5, [205, -3238, .88]], [A.so, [195, -3234, .9]], [A.so + 2.3, [0, -2085, .26]],
    [A.inNext, [40, -2120, .29]], [A.first - .3, [70, -2150, .315]], [A.first + 1.7, [150, -3250, 1.0]], [A.four - .2, [215, -3262, 1.1]], [A.carbon - .2, [430, -3252, 1.14]], [A.clean + .6, [650, -3268, 1.2]],
  ];
  const fd0 = A.clean + .02, fd1 = HA - 1 / 30;     // the follow-down
  const camO2 = (t) => {
    if (t < KO[1][0]) return keys(t, [KO[0], KO[1]], (x) => 1.3 * x - .3 * x * x * x);
    if (t < KO[2][0]) return keys(t, [KO[1], KO[2]], (x) => ease.io(x) * .85 + x * .15);
    if (t < KO[3][0]) return keys(t, [KO[2], KO[3]], ease.sine);
    if (t < KO[4][0]) { const u = ease.io(lin(KO[3][0], KO[4][0], t)) * .9 + .1 * lin(KO[3][0], KO[4][0], t), a = KO[3][1], b = KO[4][1]; return [mix(a[0], b[0], u), mix(a[1], b[1], u), Math.exp(mix(Math.log(a[2]), Math.log(b[2]), u))]; }
    if (t < KO[6][0]) return keys(t, [KO[4], KO[5], KO[6]], (x) => x);   // a constant slow push while the wide image is read
    if (t < KO[7][0]) { const u = ease.io(lin(KO[6][0], KO[7][0], t)), a = KO[6][1], b = KO[7][1]; return [mix(a[0], b[0], u), mix(a[1], b[1], u), Math.exp(mix(Math.log(a[2]), Math.log(b[2]), u))]; }
    if (t < fd0) return path(t, KO.slice(7));
    // follow the curve down: from the top of the curve down its length to the foot; zoom in until the foot is one line across the frame
    const u = lin(fd0, fd1, t), a = path(t, KO.slice(7)), top = CW.length - 1, footC = -395;
    const qa = ease.io(clamp(u / .6)), fi = top - (top - iS) * qa, i0 = Math.min(top - 1, Math.floor(fi)), p = [mix(CW[i0][0], CW[i0 + 1][0], fi - i0), mix(CW[i0][1], CW[i0 + 1][1], fi - i0)];
    const fx = mix(p[0], footC, ease.io(clamp((u - .3) / .7))), z = Math.exp(mix(Math.log(a[2]), Math.log(6.2), Math.pow(ease.io(u), 1.15)));
    const yl = 560 + 2 * Math.sin(t * .9), fy = CURVE.S[1] - (yl - H / 2) / z;   // keep the foot on the plate's line height
    const bl = sm(lin(0, .15, u));
    return [mix(a[0], fx, bl), mix(a[1], mix(p[1], fy, ease.io(clamp((u - .2) / .4))), bl), z];
  };
  const camC = camO2(tC);
  // the sky keeps the tilt's momentum across the match cut (it glides to a stop over ~.3 s instead of stopping dead)
  const skyV = (() => { const a = gAt(tC - 1 / 30), b = gAt(tC), f = (c) => [-(c.x) * .05 + 600, c.tilt * .95 - (c.y - 540) * .06 - 260], p = f(a), q = f(b); return [(q[0] - p[0]) * 30, (q[1] - p[1]) * 30]; })();
  const mom = (t) => .28 * (1 - Math.exp(-Math.max(0, t - tC) / .28));
  const skyO2 = (cam, t) => ({ ox: gEnd.skyO.ox - (cam[0] - camC[0]) * .03 + skyV[0] * mom(t), oy: gEnd.skyO.oy - (cam[1] - camC[1]) * .04 + skyV[1] * mom(t), ang: gEnd.skyO.ang });
  const sparkTimes = []; { const r = prng(808); for (let t = A.limit + .4; t < HA; t += .22 + r() * .35) sparkTimes.push(t); }
  const PROPS = [
    { kind: 'coin', x: -600, h: 92, t0: A.money - .1 }, { kind: 'parliament', x: -330, h: 86, t0: A.politics - .1 },
    { kind: 'turbine', x: 470, h: 74, t0: A.carbon + .05 }, { kind: 'turbine', x: 540, h: 62, t0: A.carbon + .12, seed: 2 }, { kind: 'solar', x: 640, h: 26, n: 4, t0: A.carbon + .2 },
    { kind: 'turbine', x: 760, h: 70, t0: A.carbon + .26, seed: 4 }, { kind: 'solar', x: 880, h: 24, n: 5, t0: A.carbon + .32 }, { kind: 'turbine', x: 1010, h: 66, t0: A.carbon + .4, seed: 5 },
    { kind: 'solar', x: 1130, h: 22, n: 4, t0: A.carbon + .46 },
  ];
  const ticksOn = (t) => lin(A.imagine - .3, A.yearE + .1, t);
  const sea = seaSpots().filter(([x, y]) => x > -300 && x < 1500 && y < -2780).slice(0, 34);
  function heatLines(ctx, t, m, a) {
    if (a <= 0) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    PROPS.slice(2).forEach((p, i) => {
      const x0 = p.x, y0 = limbY(p.x) - p.h * .8, yd = limbY(p.x + 20, EARTH.RD) + 8, x2 = p.x + 160 + 40 * (i % 3), y2 = limbY(x2) - 6;
      for (let k = 0; k < (p.kind === 'turbine' ? 2 : 1); k++) {
        const ph = mod((t - A.waste) / 2.4 + i * .29 + k * .5, 1), L1 = Math.abs(y0 - yd), L2 = Math.hypot(x2 - x0, y2 - yd), Lt = L1 + L2, head = ph * Lt, seg = Lt * .14;
        const at = (s) => { let X, Y; if (s < L1) { X = x0; Y = y0 - s; } else { const q = (s - L1) / L2; X = mix(x0, x2, q); Y = mix(yd, y2, q); } const wv = Math.sin(s * .06 - t * 6 + i) * 2.2 * clamp(s / 40); return [m.X(X + wv), m.Y(Y)]; };
        for (let piece = 0; piece < 6; piece++) {
          const s0 = head - seg * (1 - piece / 6), s1 = head - seg * (1 - (piece + 1) / 6); if (s1 < 0) continue;
          ctx.beginPath(); for (let s = Math.max(0, s0); s <= s1 + .1; s += 5) { const [sx, sy] = at(s); s === Math.max(0, s0) ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy); }
          const w = (piece + 1) / 6;
          ctx.strokeStyle = rgba('#ffd9a8', .5 * a * w * w); ctx.lineWidth = .6 + .6 * w; ctx.stroke();
          ctx.strokeStyle = rgba('#ff9a50', .07 * a * w); ctx.lineWidth = 5; ctx.stroke();
        }
        // the touch on the glass: a small ring of light where the heat meets the dome and turns back
        const hit = head - L1; if (hit > -20 && hit < 90) { const al = a * (1 - Math.abs(hit - 10) / 80); const X = m.X(x0), Y = m.Y(yd); ctx.strokeStyle = rgba(F7.rim, .5 * al); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(X, Y, (10 + hit * .3) * m.k, (3 + hit * .08) * m.k, 0, 0, TAU); ctx.stroke(); glowAt(ctx, X, Y, 26 * m.k, .35 * al, '#ffc890', '#fff1d6'); }
      }
    });
    ctx.restore();
  }
  function steam(ctx, t, m, a) {
    if (a <= 0) return;
    ctx.save(); ctx.lineCap = 'round';
    sea.forEach(([x, y], i) => {
      const v = onSphere(x, y); if (!v) return;
      for (let k = 0; k < 2; k++) {
        const life = 4.5, ph = mod(t / life + i * .37 + k * .5, 1), X = m.X(x), Y = m.Y(y), Lh = (40 + 50 * ph) * m.k;
        ctx.beginPath(); for (let q = 0; q <= 12; q++) { const f = q / 12; ctx[q ? 'lineTo' : 'moveTo'](X + Math.sin(f * 5 + t * 1.3 + i) * 6 * m.k * f + f * 12 * m.k, Y - f * Lh - ph * 20 * m.k); }
        const al = a * Math.sin(Math.PI * ph);
        ctx.strokeStyle = rgba('#b8b0e8', .035 * al); ctx.lineWidth = (10 + 16 * ph) * m.k; ctx.stroke();
        ctx.strokeStyle = rgba('#d8d4f4', .06 * al); ctx.lineWidth = (4 + 6 * ph) * m.k; ctx.stroke();
      }
    });
    ctx.restore();
  }
  function label(ctx, t, big, small, x, y, t0, t1) {
    const a = ease.out(lin(t0, t0 + .6, t)), b = ease.inn(lin(t1 - .4, t1, t)); if (a <= 0 || b >= 1) return;
    ctx.save(); ctx.font = '76px "Instrument Serif"'; const bw = ctx.measureText(big).width; ctx.restore();
    const wv = Math.max(bw, small.length * 15.5) + 40;
    ctx.save(); ctx.beginPath(); ctx.rect(x - 10 + wv * b, y - 90, wv * (a - b), 160); ctx.clip();
    text(ctx, big, x, y, { size: 76, font: 'Instrument Serif', color: '#f6efdc' });
    text(ctx, small, x + 2, y + 44, { size: 18, weight: 600, color: rgba('#cfd6ee', .9), spacing: 4 });
    ctx.restore();
    ctx.fillStyle = rgba(F7.amber, .9); ctx.fillRect(x - 24, y - 62 + 0 * a, 3, 116 * (a - b));
  }
  function O2(ctx, t) {
    const cz = camO2(t), cam = { x: cz[0], y: cz[1], z: cz[2] }, m = camO(cam), sO = skyO2(cz, t);
    sky(ctx, t, sO);
    const heat = sm(lin(A.four, A.waterE, t));
    const props = PROPS.map((p, i) => ({ ...p, grow: ease.out(lin(p.t0, p.t0 + .6, t)) * (i < 2 ? 1 - ease.io(lin(A.first - .2, A.first + .7, t)) : 1), rim: p.kind === 'coin' || p.kind === 'parliament' ? rgba('#9a92d8', .25 + .35 * bump(t, p.t0 + .2, p.t0 + .45, p.t0 + .6, p.t0 + 1.1)) : 'rgba(255,200,150,.55)' }));
    earthHorizon(ctx, t, cam, { heat, props });
    steam(ctx, t, m, heat);
    // the ring glimpse ("what it would really take"): a warm band glimmers round the Earth and sinks back into the atmosphere
    const ra = bump(t, A.take - .2, A.take + .25, A.takeE + .35, A.takeE + 1.0);
    if (ra > 0) ring(ctx, t, { cx: m.X(0), cy: m.Y(0), r: EARTH.R * m.k * mix(1.004, 1.045, sm(lin(A.take - .2, A.take + .4, t)) * (1 - .9 * sm(lin(A.takeE + .2, A.takeE + 1.0, t)))), w: 30 * m.k + 8, a: ra * .9 });
    // the dome
    const touch = sm(lin(A.limit - .08, A.limit + .12, t)), reveal = ease.io(lin(A.limit, A.limit + 1.1, t)), lines = ease.out(lin(A.physics - .02, A.physics + 1.8, t));
    dome(ctx, t, cam, { touch: touch * (1 + .25 * bump(t, A.physics - .05, A.physics + .1, A.physics + .4, A.physics + 1.2)), reveal, lines, linesA: .85 - .35 * lin(A.physics + 3, A.physics + 7, t), flare: bump(t, A.wall - .05, A.wall + .1, A.wall + .35, A.wall + .9), warm: sm(lin(A.four + .2, A.waterE, t)), glass: touch, skyO: sO, sparks: sparkTimes.filter((s) => s > A.so - 1.2 && s < fd0) });
    heatLines(ctx, t, m, sm(lin(A.waste - .2, A.waste + .5, t)) * (1 - lin(fd0 + .3, fd0 + .9, t)));
    // the follow-down: the world's light settles toward the plate's night (the line keeps its light), then the line opens into the plate
    const dk = sm(lin(fd0 + .2, HA - .3, t));
    if (dk > 0) { ctx.fillStyle = rgba('#0a0c22', .8 * dk); ctx.fillRect(0, 0, W, H); }
    const pg = lin(HA - .6, HA - 1 / 30 - .01, t);
    if (pg > 0) {
      // the line opens into the plate: a band around the line widens until it is the frame (its edges carry a faint violet line)
      const e = ease.inn(pg), yl = 560 + 2 * Math.sin(t * .9), up = mix(2, yl + 4, e), dn = mix(2, H - yl + 4, e);
      ctx.save(); ctx.beginPath(); ctx.rect(-2, yl - up, W + 4, up + dn); ctx.clip(); HO.plate(ctx, t); ctx.restore();
      if (e < .98) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (const yy of [yl - up, yl + dn]) for (const [lw, al] of [[14, .05], [2, .3]]) { ctx.strokeStyle = rgba('#a89cf0', al * (1 - e)); ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke(); } ctx.restore(); }
    }
    // the curve (morphed out of the ground world's line for the first .9 s; thins to the plate's line in the follow-down)
    const thin = ease.io(lin(fd0, HA - .12, t));
    const dim = 1 - .42 * bump(t, A.expiry - .05, A.expiry + .3, A.expiry + .55, A.expiry + 1.1);
    const u = mix(.986, 1, ease.out(lin(tC, A.limit, t)));
    let pts = CW.map(([px, py, w]) => [m.X(px), m.Y(py), w]);
    const mo = ease.io(lin(tC, tC + .9, t));
    if (mo < 1 && gEndY) { const oy = resampleY(curveCut(pts, u)); if (oy) pts = gEndY.map((p, i) => [mix(p[0], oy[i][0], mo), p[1], mix(p[2], oy[i][2], mo)]); }
    const cw = mix(.95, 1.25, ease.io(lin(tC, A.limit + 1.2, t)));
    const cv = curve(ctx, t, pts, { u: mo < 1 ? 1 : u, w: cw * mix(1, .4, thin), br: dim * (1 + .2 * touch) * mix(1, .75, thin), a: 1 - .5 * sm(lin(HA - .4, HA - 1 / 30, t)), sparks: (3 + 5 * touch) * (1 - thin), tipA: sm(lin(tC + .2, tC + .8, t)) * (1 - thin), seed: 1 });
    // year ticks: the curve as a calm chart line (1.11)
    const tk = ticksOn(t) * (1 - lin(A.four + .2, A.four + .9, t));
    if (tk > 0) yearTicks(ctx, t, m, tk);
    // labels (screen space, still while read)
    label(ctx, t, '+2.3 % / YEAR', 'TOM MURPHY · DO THE MATH', 150, 300, A.growing - .1, A.four - .15);
    label(ctx, t, '~400 YEARS', 'THOUGHT EXPERIMENT · TOM MURPHY · UC SAN DIEGO', 150, 300, A.four + .05, A.carbon + 1.6);
    // the four cards (1.10): flicked out of the dark on "promise", face down in a row; slide off on "First"
    for (let i = 0; i < 4; i++) {
      const t0 = A.promise2 - .05 + i * .07, u1 = ease.out(lin(t0, t0 + .55, t)), out = ease.inn(lin(A.first - .55 + i * .06, A.first + .05 + i * .06, t));
      if (u1 <= 0 || out >= 1) continue;
      const x = mix(-180 + i * 40, 960 + (i - 1.5) * 196, u1) + out * 1500, y = mix(1260, 778, u1) - Math.sin(Math.PI * u1) * 60, rot = mix(-1.1 + i * .2, (i - 1.5) * .025, ease.out(lin(t0, t0 + .62, t))) + .05 * Math.sin(Math.PI * clamp((t - t0 - .45) / .2)) * (1 - u1 * 0) + out * .3;
      card(ctx, t, { x, y, s: .58, rot, side: 'back', num: i + 1, lift: mix(.9, .12, u1) + .03 * Math.sin(t * 1.4 + i), light: [960, 120] });
    }
    void cv;
  }
  function curveCut(P, u) { const L = [0]; for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1])); const cut = u * L[L.length - 1], out = []; for (let i = 0; i < P.length; i++) { if (L[i] <= cut) out.push(P[i]); else { const q = (cut - L[i - 1]) / (L[i] - L[i - 1]); out.push([mix(P[i - 1][0], P[i][0], q), mix(P[i - 1][1], P[i][1], q), P[i][2]]); break; } } return out; }
  function yearTicks(ctx, t, m, f) {
    const n = 64, sh = Math.floor(n * f + 1e-6);
    ctx.save(); ctx.lineCap = 'round';
    for (let i = 1; i <= n; i++) {
      const s = i / (n + 1), j = Math.round(iS + (CW.length - 1 - iS) * s), a = CW[Math.max(0, j - 1)], b = CW[Math.min(CW.length - 1, j + 1)], p = CW[j];
      const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) + Math.PI / 2, big = i % 10 === 0, L = (big ? 26 : 13) * Math.max(.7, m.k);
      const vis = clamp(n * f - i + 1); if (vis <= 0) break;
      const X = m.X(p[0]), Y = m.Y(p[1]), dx = Math.cos(ang) * L * vis, dy = Math.sin(ang) * L * vis;
      ctx.strokeStyle = rgba('#fff1d6', (big ? .9 : .6) * Math.min(1, f * 3)); ctx.lineWidth = big ? 2 : 1.3; ctx.beginPath(); ctx.moveTo(X + 4 * Math.cos(ang), Y + 4 * Math.sin(ang)); ctx.lineTo(X + 4 * Math.cos(ang) + dx, Y + 4 * Math.sin(ang) + dy); ctx.stroke();
    }
    ctx.restore();
    void sh;
  }

  // pre-build the rotated sky for every offset the three takes will use (sky() then only translates an image)
  { const o1 = [], g = []; for (let f = 0; f * 1 / 30 < HA + .1; f++) { const t = f / 30;
      if (t < tD) { const [x, y] = camO1(t); o1.push([skyO1.ox - (x - 200) * .05, skyO1.oy - (y + 3230) * .05]); }
      else if (t < tC) { const c = gAt(t); g.push([-(c.x) * .05 + 600, c.tilt * .95 - (c.y - 540) * .06 - 260]); }
      else { const s2 = skyO2(camO2(Math.min(t, HA)), t); g.push([s2.ox, s2.oy]); } }
    await skyWarm(skyO1.ang, o1); await skyWarm(gEnd.skyO.ang, g); }

  return [
    { t: 0, draw: O1, print: PRINT, sound: [{ f: 'glass_hum', t: A.foreverE + .05, v: .5 }] },
    { t: A.bigger + .2, draw: O1, print: PRINT, sound: [{ f: 'whoosh_up', t: tD - .45, v: .5 }] },
    { t: tD, draw: G, print: PRINT },
    { t: C1.start - .8, draw: G, print: PRINT, sound: [{ f: 'bloom', t: C1.start - .55, v: .35 }] },
    { t: C1.end + 1, draw: G, print: PRINT, sound: [{ f: 'whoosh_airy', t: tC - .15, v: .3 }] },
    { t: tC, draw: O2, print: PRINT, sound: [{ f: 'glass_hum', t: A.limit, v: .6 }, { f: 'shimmer_rings', t: A.physics, v: .6 }] },
    { t: A.inNext, draw: O2, print: PRINT, sound: [{ f: 'card', t: A.promise2 + .25, v: .35 }] },
    { t: A.clean - .5, draw: O2, print: HO.print, sound: [{ f: 'whoosh', t: A.clean + .05, v: .4 }] },
  ];
};
