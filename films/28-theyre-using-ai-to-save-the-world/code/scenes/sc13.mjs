// c13 · No. 1 · flash floods: the town in the rain · almost nothing to learn · except the news (2.6 million past floods) · a week ahead ·
// Search, Maps, alerts · maybe on yours · a forecast isn't a rescue (B3). T.G('Flash floods are the deadliest') → T.G('Satellites built …', 2nd).
// ONE entry, one continuous take: out of the tree at the question (c12) the camera flies into lantern 1, whose glass shows the town in the
// rain → the valley seen from above (a map that is a place) → the ALERT panel becomes the phone in your hand → W 1.08 into its light.
//
// | ID   | anchor                          | picture (one idea)                                                                  | camera                 |
// |------|---------------------------------|-------------------------------------------------------------------------------------|------------------------|
// | 1.01 | Flash floods are the deadliest  | lantern 1's glass holds the town in the rain; through it: the creek swells into an alley · THE DEADLIEST FLOODS (WMO) | dive into lantern 1 |
// | 1.02 | They often hit places           | the machine's look runs out along the rivers: three gauges, long empty stretches    | pull back to the valley |
// | 1.03 | Except the news                 | lamp 1 lights; the newspaper flies out of the rail and whirls in                     | breathe                |
// | 1.04 | A team at Google pulled         | the page bursts into pages; behind them a dot drops for every report: 2.6 MILLION PAST FLOODS · REAL | breathe · push to the town |
// | 1.05 | For big rivers                  | a cool band runs down the big river, a tick a day: 7 DAYS AHEAD · REAL · LIVE        | truck down the river   |
// | 1.06 | The warnings show up in Search  | three panels rise from the riverside place: SEARCH · MAPS · ALERT                    | follow                 |
// | 1.07 | Maybe on yours                  | into the ALERT: it is the phone in your hand, you in the rain on the street          | dive · pull back       |
// | 1.08 | But a forecast isn't a rescue   | the sealed methane letter drifts down beside it and sinks; you turn uphill and run; the light warms → flood | push into the phone (W) |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f28_kit.mjs';
import * as B from '../lib/f28_b3_kit.mjs';
import * as V from '../lib/f28_b3_flood.mjs';
const { W, H, P, rgba, clamp, lerp, span, smooth, sineIO, expoOut, expoIn } = E;

export default async (T, R) => {
  E.prepareEditorial();
  const a = B.anchors(T);
  return [{ t: R.a, draw: scene(a, T, R), print: F.PRINT28 }];
};

const VA = (u, v, s) => E.aim(E.F0, u, v, s);
const TAU = Math.PI * 2;
const I = { k: 1, e: 0, f: 0 };
const TOWN_W = 3420;                                                     // the valley is seen 3770 px wide through lantern 1's glass (matches the dive's speed)
const TOWN_IN = { k: W * 1.04 / TOWN_W, e: W / 2 * (1 - W * 1.04 / TOWN_W), f: H / 2 * (1 - W * 1.04 / TOWN_W) };

function scene(a, T, R) {
  const g1 = B.GL(1), tA = a.flash, tIn = a.flash + 3.0;
  const tW0 = a.team + .1, tW1 = a.reports + .3;                            // the page burst's wave (report dots)
  const tD0 = a.alerts - .1, tSw = a.maybe - .1, tP1 = tSw + 4.0;          // the dive into ALERT, the switch to the street, the pull back
  const tR0 = a.acts + .1;                                                   // you start to run
  // ---------------------------------------------------------------- cameras
  const camT = (t) => B.drifted(B.camTreeQ(t, a), E.F0, t, 2.6, 3);
  const KV = [
    [tIn, VA(960, 560, 2.3)], [tIn + 1.0, VA(972, 550, 2.2)], [a.measures + 1.3, VA(968, 520, 1.9)],
    [a.nothing + .6, VA(950, 330, .52)], [a.except, VA(925, 305, .49)], [a.reports, VA(955, 330, .47)], [a.strike + .4, VA(960, 410, .6)],
    [a.forecasts + .6, VA(2250, 1180, .78)], [a.week + .4, VA(2700, 1150, .8)], [a.search, VA(3250, 960, 1.0)], [a.alerts + .2, VA(3540, 845, 1.55)],
  ];
  const camV = (t) => B.drifted(F.camPath(t, KV), E.F0, t, 2.2, 11);
  const CS0 = VA(900, 735, 1.25);
  const camSb = (t) => F.camPath(t, [[tP1 - 2.2, CS0], [tP1, CS0], [a.like, VA(872, 728, 1.33)], [tR0, VA(858, 722, 1.42)]]);
  // ---------------------------------------------------------------- the dive into lantern 1 (OUTER on the tree world)
  const glassAt = (t) => { const p = E.project(camT(t), E.F0, g1.x, g1.y); return { x: p[0], y: p[1], w: g1.w * p[2] }; };
  const zoomT = (t) => {
    const u = span(t, tA, tIn); if (u <= 0) return null;
    const g = glassAt(t), K = W * 1.04 / g.w, k = Math.exp(Math.log(K) * u ** 1.5), q = sineIO(u), qx = lerp(g.x, W / 2, q), qy = lerp(g.y, H / 2, q);
    return { k, e: qx - k * g.x, f: qy - k * g.y };
  };
  const OUTV = (t) => B.outerLerp(TOWN_IN, I, expoOut(span(t, tIn, tIn + 2.0)));
  // ---------------------------------------------------------------- the valley state
  const panelU = (t) => ({ search: span(t, a.search - .15, a.search + .75), maps: span(t, a.maps - .15, a.maps + .75), alert: span(t, a.alerts - .15, a.alerts + .75) });
  const valleyState = (t) => ({
    flood: smooth(span(t, tIn - .2, tIn + 2.2)),
    trace: span(t, a.measures + 1.0, a.nothing + 1.3), traceA: lerp(1, .4, span(t, a.except, a.team)) * (1 - .6 * span(t, a.big, a.forecasts + .6)) * (1 - span(t, a.warnings, a.maps)),
    gaugeA: 1 - .5 * span(t, a.big, a.forecasts + .6),
    dots: t > tW0 - .1 && t < a.alerts ? (d) => V.dotTime(d, tW0, tW1) : null, dotA: (1 - .7 * span(t, a.big, a.forecasts + .6)) * (1 - span(t, a.warnings, a.maps)),   // the dots step back before the dive (a dot field under a zoom flickers)
    hot: smooth(span(t, a.teach + .2, a.strike + .3)) * (1 - span(t, a.big, a.forecasts + .5)),
    band: sineIO(span(t, a.forecasts - .1, a.week + .1)), bandA: 1,
    panels: panelU(t), panelsA: 1 - span(t, tD0, tD0 + 1.3),
  });
  const valley = (ctx, t, c) => V.valleyWorld(ctx, c, t, valleyState(t));
  // the panel ALERT on screen (for the dive into it): same geometry as valleyWorld's panels
  const alertRect = (t) => {
    const u = panelU(t).alert, e = expoOut(u), [px, py] = V.PANELS.alert, x = lerp(V.PLACE[0], px, e), y = lerp(V.PLACE[1], py, e), w = V.PANELS.w * lerp(.15, 1, e);
    const p = E.project(camV(t), E.F0, x, y); return { x: p[0], y: p[1], w: w * p[2] };
  };
  const zoomA = (t) => {
    const u = span(t, tD0, tSw); if (u <= 0) return null;
    const g = alertRect(t), K = W * 1.04 / g.w, q = sineIO(u ** .7), k = Math.exp(Math.log(K) * q), qx = lerp(g.x, W / 2, q), qy = lerp(g.y, H / 2, q);
    return { k, e: qx - k * g.x, f: qy - k * g.y };
  };
  // ---------------------------------------------------------------- the street: you, the phone, the water
  const wyAt = (t) => lerp(985, 917, smooth(span(t, tSw, a.sat)));
  const runU = (t) => span(t, tR0, a.sat + .8);
  // you stand (side view) with the phone, then run uphill; the first .3 s of the run blends the two poses (the rig's walk starts mid-stride)
  const youBase = (t) => {
    const r = runU(t), lean = .1 * smooth(span(t, tR0, tR0 + .8));
    const arm = [lerp(.75, 1.35, smooth(span(t, tR0 - .3, tR0 + .5))), lerp(2.35, 1.95, smooth(span(t, tR0 - .3, tR0 + .5)))];
    return { x: 820 + 300 * r ** 1.45, dir: 1, view: 'side', look: .12 + .05 * Math.sin(t * .9), armR: arm, lean };
  };
  const youStand = (t) => ({ ...youBase(t), pose: 'hold' });
  const youRun = (t) => ({ ...youBase(t), pose: 'walk', walk: Math.PI + TAU * 1.55 * Math.max(0, t - tR0) * (.6 + .4 * span(t, tR0, tR0 + 1)) });
  const youMix = (t) => smooth(span(t, tR0, tR0 + .3));
  const youAt = (t) => (youMix(t) >= 1 ? youRun(t) : youStand(t));
  const phoneOf = (t) => { const m = youMix(t), p = V.youPose(youStand(t)).phone; if (m <= 0) return p; const q = V.youPose(youRun(t)).phone; return { x: lerp(p.x, q.x, m), y: lerp(p.y, q.y, m), w: p.w, h: p.h }; };
  const phoneC = (t) => { const r = phoneOf(t); return [r.x + r.w / 2, r.y + r.h / 2]; };
  const camS = (t) => {
    const b = camSb(t); if (t < tR0) return B.drifted(b, E.F0, t, 2.0, 13);
    const [px, py] = phoneC(t), wf = sineIO(span(t, tR0, tR0 + 2.2)), bs = E.F0 / (E.F0 - b.z);
    const s = bs * Math.exp(Math.log(34 / bs) * expoIn(span(t, a.sat - 1.4, a.sat)));
    const bc = [b.x * 1 + W / 2, b.y + H / 2];   // the base camera's centre in design px (F0 card: cam x/y are offsets of the screen centre)
    return B.drifted(VA(lerp(bc[0], px, wf), lerp(bc[1], py, wf), s), E.F0, t, 2.0, 13);
  };
  const OUTS = (t) => {
    const u = span(t, tSw, tP1); if (u >= 1) return null;
    const c = camS(t), r = phoneOf(t), p0 = E.project(c, E.F0, r.x, r.y), p1 = E.project(c, E.F0, r.x + r.w, r.y + r.h);
    const k0 = W * 1.04 / (p1[0] - p0[0]), cx = (p0[0] + p1[0]) / 2, cy = (p0[1] + p1[1]) / 2;
    return B.outerLerp({ k: k0, e: W / 2 - k0 * cx, f: H / 2 - k0 * cy }, I, 1 - sineIO((1 - u) ** .6));   // slow off the big bright screen, faster when it is small
  };
  // ---------------------------------------------------------------- the news page (from the rail's lamp 1) and its burst
  const [r1x, r1y, r1s] = F.railPos(1), RAIL1 = [r1x, r1y + F.RAIL.len + r1s * 1.2 + 21];
  function pages(ctx, t, c) {
    const t0 = a.except + .05, t1 = a.team, u = span(t, t0, t0 + 1.25);
    if (t >= t0 && t < t1 + .05) {
      const e = sineIO(u), cx = [RAIL1[0], 640, 960], cy = [RAIL1[1], 120, 470], m = 1 - e;
      const x = m * m * cx[0] + 2 * m * e * cx[1] + e * e * cx[2], y = m * m * cy[0] + 2 * m * e * cy[1] + e * e * cy[2];
      V.newsPage(ctx, x, y, lerp(22, 190, expoOut(u)), TAU * .85 * expoOut(u) - .1 + .05 * Math.sin(t * 2.1), 1);
    }
    if (t >= t1 && t < tW1 + .5) {
      const R = V.waveR(t, tW0, tW1) - 140, al = 1 - span(t, tW1 - .5, tW1 + .4), sz = lerp(190, 64, expoOut(span(t, t1, t1 + 1.4)));
      for (let k = 0; k < 9; k++) {
        const th = k / 9 * TAU + .35 + 1.4 * sineIO(span(t, t1, tW1)), p = E.project(c, E.F0, V.DOT_C[0] + Math.cos(th) * R, V.DOT_C[1] + Math.sin(th) * R * .8);
        if (p) V.newsPage(ctx, p[0], p[1], sz, th * 1.7 + 2.2 * (t - t1) + k, al);
      }
    }
  }
  // ---------------------------------------------------------------- texts (≤ 6 words, one number per explainer)
  function texts(ctx, t, c) {
    const out = (t0, t1) => 1 - span(t, t0, t1);
    const lbl = (txt, x, y, size, u, o = {}) => { if (u <= 0) return; F.maskLine(ctx, [[txt, 0]], x, y, size, u, { align: 'center', serif: o.serif ?? false, weight: 600, col: o.col ?? P.cream, glow: o.glow ?? false }); };
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    { const k = out(a.nothing - .6, a.nothing); if (k > 0) { ctx.globalAlpha = k; lbl('THE DEADLIEST FLOODS', W / 2, 196, 30, F.rise(span(t, a.deadliest + .2, a.deadliest + .9))); ctx.globalAlpha = 1; } }
    { const k = out(a.big - .3, a.big + .2); if (k > 0) { ctx.globalAlpha = k; lbl('2.6 MILLION', W / 2, 214, 72, F.rise(span(t, a.millions - .1, a.millions + .7)), { serif: true, glow: true }); lbl('PAST FLOODS', W / 2, 258, 26, F.rise(span(t, a.millions + .4, a.millions + 1.1)), { col: P.halo2 }); ctx.globalAlpha = 1; } }
    { const k = out(a.warnings + .2, a.warnings + .7), p = E.project(c, E.F0, ...V.polyAt(V.RIV.main, V.BAND.s1).slice(0, 2)); if (k > 0 && p) { ctx.globalAlpha = k; lbl('7 DAYS AHEAD', p[0], p[1] + 132, 54, F.rise(span(t, a.week - .1, a.week + .6)), { serif: true, glow: true }); lbl('BIG RIVERS', p[0], p[1] + 172, 22, F.rise(span(t, a.week + .3, a.week + 1)), { col: P.halo2 }); ctx.globalAlpha = 1; } }
    ctx.restore();
  }
  // ---------------------------------------------------------------- the sealed methane letter: out of the rail's lamp 8, beside the phone, sinks
  const [r8x, r8y, r8s] = F.railPos(8), RAIL8 = [r8x, r8y + F.RAIL.len + r8s * .7];
  function letter(ctx, t, c, M) {
    const t0 = a.like + .05, t1 = t0 + 1.1, tf0 = a.works + .2, tf1 = tf0 + .75; if (t < t0 || t > tf1 + 1.2) return;
    const scr = (x, y) => { const p = E.project(c, E.F0, x, y); return M ? [M.k * p[0] + M.e, M.k * p[1] + M.f, p[2] * M.k] : p; };
    const r = phoneOf(t), ph = scr(r.x - r.w * 2.6, r.y + r.h * .2), wy = wyAt(t), land = scr(Math.min(V.waterX(wy) - 120, 420), wy);
    const u = sineIO(span(t, t0, t1)), m = 1 - u, mid = [lerp(RAIL8[0], ph[0], .5), Math.min(RAIL8[1], ph[1]) - 30];
    let x = m * m * RAIL8[0] + 2 * m * u * mid[0] + u * u * ph[0], y = m * m * RAIL8[1] + 2 * m * u * mid[1] + u * u * ph[1] + 6 * Math.sin(t * 2.2) * u;
    const fu = expoIn(span(t, tf0, tf1)); x = lerp(x, land[0], sineIO(span(t, tf0, tf1))); y = lerp(y, land[1], fu);
    const sink = span(t, tf1, tf1 + .6), s = lerp(14, 34 * ph[2], expoOut(span(t, t0, t1)));
    if (sink < 1) V.envelope(ctx, t, x, y + s * .5 * sink, s, { a: (1 - sink) * F.rise(span(t, t0, t0 + .2)), tilt: .15 * Math.sin(t * 1.7) + .4 * fu });
    const ru = span(t, tf1 - .05, tf1 + 1.1); if (ru > 0 && ru < 1) { ctx.strokeStyle = rgba(F.COOL.line, .7 * (1 - ru)); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(land[0], land[1] + 3, 10 + 90 * expoOut(ru), (10 + 90 * expoOut(ru)) * .2, 0, 0, TAU); ctx.stroke(); }
  }
  // ---------------------------------------------------------------- one frame
  const rainAmt = (t) => lerp(lerp(lerp(lerp(.55, .3, span(t, tIn, tIn + 3)), .2, span(t, a.except, a.team)), .45, span(t, a.alerts, tSw)), .65, span(t, tSw, tSw + 2));
  return (ctx, t) => {
    let c;
    if (t < tIn) {
      c = camT(t); const z = zoomT(t);
      const l1 = {
        inside: (cx) => {
          const m = cx.getTransform(), sc = Math.hypot(m.a, m.b), hl = g1.h / (g1.w / 1000), ccx = m.a * 500 + m.c * hl / 2 + m.e, ccy = m.b * 500 + m.d * hl / 2 + m.f;
          const k = sc * 1000 / TOWN_W; E.withOuter({ k, e: ccx - k * W / 2, f: ccy - k * H / 2 }, () => valley(cx, t, camV(t)));
        },
        glass: span(t, tA, tA + .5), numA: .8 * (1 - span(t, tA, tA + .6)), swing: -.018 * Math.sin(t * .7 + 1.3) * smooth(span(t, tA, tA + 1.2)),
      };
      const draw = () => B.treeQ(ctx, c, t, a, { l1: t >= tA ? l1 : undefined, zoom: z, threadA: 1 - span(t, tA, tA + .9) });
      if (z) E.withOuter(z, draw); else draw();
    } else if (t < tSw) {
      c = camV(t);
      const z = zoomA(t), M = t < tIn + 2.0 ? OUTV(t) : null, Z = z || M;
      if (Z) E.withOuter(Z, () => valley(ctx, t, c)); else valley(ctx, t, c);
      // the glass's sheen as it was at the end of the dive into lantern 1 (it leaves with the glass)
      const sh = 1 - span(t, tIn, tIn + .8);
      if (sh > 0) { const gw = W * 1.04, gh = gw / .66, X0 = W / 2 - gw / 2, Y0 = H / 2 - gh / 2, k = OUTV(t).k / TOWN_IN.k, cx = W / 2, cy = H / 2, q = (x, y) => [cx + (x - cx) * k, cy + (y - cy) * k];
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = rgba(P.cream, .14 * sh); ctx.beginPath(); ctx.moveTo(...q(Math.max(X0, X0 + gw * .12), Y0)); ctx.lineTo(...q(X0 + gw * .3, Y0)); ctx.lineTo(...q(X0 + gw * .1, Y0 + gh)); ctx.lineTo(...q(X0, Y0 + gh)); ctx.lineTo(...q(X0, Y0 + gh * .6)); ctx.closePath(); ctx.fill(); ctx.restore(); }
      if (!z) { pages(ctx, t, c); texts(ctx, t, c); }
    } else {
      c = camS(t); const M = OUTS(t);
      const st = { wy: wyAt(t), you: youAt(t), you2: youMix(t) > 0 && youMix(t) < 1 ? youRun(t) : null, mix: youMix(t) < 1 ? youMix(t) : 0, phone: { lit: 1, warm: smooth(span(t, a.acts, a.acts + .8)) }, lamp: 1 - .25 * span(t, a.works, a.sat) };
      if (M) E.withOuter(M, () => V.streetWorld(ctx, c, t, st)); else V.streetWorld(ctx, c, t, st);
      letter(ctx, t, c, M);
    }
    B.rain(ctx, t, rainAmt(t));
    F.realStamp(ctx, t, a.team + .3, a.teach, 'groundsource');
    F.source(ctx, t, a.deadliest + .5, a.nothing - .4, F.SOURCES.wmo);
    F.source(ctx, t, a.millions + .6, a.big - .2, 'GOOGLE RESEARCH, MARCH 2026');
    F.realStamp(ctx, t, a.forecasts + .3, a.warnings + .5, 'floodhub');
    F.source(ctx, t, a.big + .7, a.warnings + .6, F.SOURCES.floodhub);
    F.lampRail(ctx, t, T);
    E.lightFlood(ctx, smooth(span(t, a.sat - 1.4, a.sat)));
  };
}
