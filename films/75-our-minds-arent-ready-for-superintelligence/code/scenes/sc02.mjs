// c02 · B1 · 'To see what it is' → 'Companies have it too' · REFLEX 1 FEAR and REFLEX 2 GRAB. One take with c03–c05 (lib/b1_take.mjs).
//
// | ID    | anchor (phrase)              | zeigt wörtlich                                                    | layer | carrier out                       |
// |-------|------------------------------|-------------------------------------------------------------------|-------|-----------------------------------|
// | 1.01  | To see what it is            | out of plateSofa: push into the phone; the headline runs back (rewind) and lands again, slowly | MIX | the headline |
// | 1.02  | Why did your pulse           | pull back: a time line above you draws; the ochre pulse spikes at PULSE first, the eye line reaches READING later | EXPL | the ochre node |
// | 1.03  | Because the alarm            | the node runs far left along the line (zoom out): the stone head with the node; READING · ~5,000 YEARS a sliver at the right end | EXPL | the node |
// | 1.04  | Every mammal carries         | the head becomes the hunter; a wolf, a mouse rise, each node lights; source LEDOUX                  | EXPL | the nodes |
// | 1.05  | That is the first of three   | three niches cut into the wall over them; the nodes fly up into the first: FEAR                    | EXPL | niche 1 |
// | 1.06  | Fear, before thought         | the node drops out of FEAR and pulses, then a small cool "thought" screen lights: FEAR, BEFORE THOUGHT | EXPL | the thought screen |
// | 1.07  | And bad news pulls           | the thought grows into a headline card, two bars turn ochre and pull a thread down to your thumb    | MIX | the card |
// | 1.08★ | In a huge test               | the card clones into four versions (0–3 negative words); per word the click bar grows one step: +2.3% CLICKS PER NEGATIVE WORD + source | EXPL | niche 2 |
// | 1.09  | The second reflex            | back to the niches: GRAB warms to gold                                                             | EXPL | niche 2 |
// | 1.10  | Somebody near you            | the office under the niches: you at your desk, the next desk's screen turns gold, their bar runs ahead | SCENE | your hand |
// | 1.11  | A colleague                  | A COLLEAGUE under the figure at the next desk                                                      | SCENE | — |
// | 1.12  | A competitor                 | a glass wall rises, a second figure behind it with a gold screen: A COMPETITOR                      | SCENE | — |
// | 1.13  | And something in you says    | your hand moves to the keyboard; in niche 2 the hand closes: GRAB IT                                | MIX | the hand (→ c03) |
import { L, SRC, XS, F, S, X, E, GOLD, COOL, CREAM, OCHRE, COAT, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, halo, smooth, lab, ease, bump, ground, hlCard, take } from '../lib/b1_take.mjs';

export function part(K) {
  const { A } = K, beats = [];
  const SKIN = mixHex(P.shade0, P.core1, .4);
  // ------------------------------------------------------------------ camera + light
  const keys = [
    [A.goBack + .95, { x: 866, y: 1984, s: 2.1 }],
    [A.why - .2, { x: 869, y: 1983, s: 2.16 }],
    [A.jump + .35, { x: 1010, y: 1800, s: 1.5 }],
    [A.because + .3, { x: 1000, y: 1795, s: 1.45 }],
    [A.reading + .25, { x: -430, y: 1650, s: .5 }],
    [A.every - .1, { x: -470, y: 1648, s: .5 }],
    [A.version + .3, { x: -500, y: 1646, s: .5 }],
    [A.three + .95, { x: -1990, y: 1335, s: 1.05 }],
    [A.fear + .6, { x: -1640, y: 1300, s: 1.02 }],
    [A.bad - .1, { x: -1630, y: 1298, s: 1.02 }],
    [A.bad + 1.5, { x: -840, y: 1168, s: .95 }],
    [A.headlines + .1, { x: -836, y: 1158, s: .95 }],
    [A.second - .05, { x: -830, y: 1148, s: .94 }],
    [A.feels + .8, { x: -2060, y: 1500, s: 1.0 }],
    [A.ahead + .35, { x: -2080, y: 1560, s: 1.0 }],
    [A.competitor + .45, { x: -2020, y: 1565, s: .98 }],
    [A.grab + .1, { x: -1995, y: 1500, s: .96 }],
  ];
  const lights = [[A.a0, 1000, 2000], [A.goBack - .5, 840, 1980], [A.why, 1000, 1850], [A.because + .5, -700, 1650, 2.2], [A.every, -1950, 1600],
    [A.first + .5, -1960, 1250], [A.bad + .5, -950, 1180], [A.headlines, -850, 1150], [A.second, -1950, 1180], [A.somebody + .6, -1950, 1720], [A.something + .5, -1900, 1450]];

  // ------------------------------------------------------------------ 1.01–1.02 the evening: rewind the headline, the pulse first, reading later
  const AX = L.AX;
  const playSpeed = (AX.read - AX.pulse) / (A.readW - A.jump), playT0 = A.jump - (AX.pulse - AX.x0) / playSpeed;   // the playhead: PULSE on 'jump', READING on 'read'
  const playX = (t) => clamp(AX.x0 + (t - playT0) * playSpeed, AX.x0, AX.x1);
  const hl = (t) => {   // the headline on the phone: the hook's state, rewound (bad, big, then it lifts away), then it lands again in slow motion
    const bad = 1 - ease(t, A.goBack - 1.05, A.goBack - .35), big = 1 - ease(t, A.goBack - .7, A.goBack + .05);
    const u = t < A.headlineW - .05 ? 1 - ease(t, A.goBack + .05, A.goBack + .6) : span(t, A.headlineW - .05, A.headlineW + 1.25);
    return { u, big, bad };
  };
  beats.push({
    a: A.a0, b: A.three + 1.2, z: 0,   // drawn until the camera has left the wide view (no pop)
    wall(ctx, t, v) {
      if (v.y + 540 / v.s < 1500) return;
      const h = hl(t), eye = span(t, A.readW - .35, A.readW + .2);
      const geo = S.sofaScene(ctx, t, { phone: { on: 1, draw: (c2, r) => {
        F.headline(c2, t, r.x + r.w * .1, r.y + r.h * .16, r.w * .8, { u: h.u, big: h.big, bad: h.bad, a: .85 });
        if (h.u < 1 && h.u > 0 && t < A.headlineW) {   // rewind: two thin cool chevrons on the screen while it runs back
          const a = Math.sin(Math.PI * span(t, A.goBack - 1.05, A.goBack + .6)); c2.fillStyle = rgba(COOL.core, .55 * a);
          for (let k = 0; k < 2; k++) { const cx = r.x + r.w * (.42 + k * .2), cy = r.y + r.h * .75, s = r.w * .12; c2.beginPath(); c2.moveTo(cx + s, cy - s); c2.lineTo(cx - s * .2, cy); c2.lineTo(cx + s, cy + s); c2.closePath(); c2.fill(); }
        } } } });
      // the heart: an ochre node on your chest jumps on 'jump' (before any word is read)
      const hn = bump(t, A.jump - .25, 1.3);
      if (hn > 0) { halo(ctx, L.CHEST[0], L.CHEST[1], 80, .7 * hn, OCHRE.mid, OCHRE.hot); ctx.fillStyle = rgba(OCHRE.hot, hn); ctx.beginPath(); ctx.arc(L.CHEST[0], L.CHEST[1], 8, 0, Math.PI * 2); ctx.fill(); }
      // the eye line: from your face to the first word (cool, dashed), only on 'read'
      if (eye > 0) { const a0 = [geo.head[0] - 22, geo.head[1] + 2], b0 = [L.PH.rx + L.PH.w * .3, L.PH.ry + L.PH.h * .22];
        X.lightLine(ctx, [a0, b0], sineIO(eye) * (1 - span(t, A.because + 1.5, A.because + 2.2)), { col: rgba(COOL.line, .85), w: 2.2, dash: [7, 6], glowCol: COOL.halo }); }
    },
  });
  // the time line above you: drawn by the playhead; the pulse spike at PULSE, the cool tick at READING; then it runs far left (1.03)
  const nodeTop = [AX.pulse, AX.y - 92];
  const farU = (t) => ease(t, A.because + .1, A.older + .3);   // the line grows to the far left
  const HEAD = { x: L.ANI.hunter, y: AX.y, h: 300 };
  const headNode = [HEAD.x + .06 * HEAD.h, HEAD.y - .6 * HEAD.h];
  beats.push({
    a: A.why + .3, b: A.three + 1.6, z: 2,
    wall(ctx, t, v) {
      const px = playX(t), out = 1 - span(t, A.first + .6, A.three + 1.3);   // 1.05: the line sinks with the animals
      const fu = farU(t), xl = lerp(AX.x0, L.AX.far, fu);
      X.lightLine(ctx, [[AX.x0, AX.y], [px, AX.y]], 1, { a: .65 * out, w: 3 });
      if (fu > 0) X.lightLine(ctx, [[AX.x0, AX.y], [xl, AX.y]], 1, { a: .65 * out, w: 3 });
      if (fu > .5) { const bx = -150, a = span(fu, .5, .8) * out; ctx.save(); ctx.strokeStyle = rgba(CREAM, .8 * a); ctx.lineWidth = 5; ctx.lineCap = 'round';   // a break: the line is far longer than drawn
        for (const dx of [-14, 14]) { ctx.beginPath(); ctx.moveTo(bx + dx - 14, AX.y + 26); ctx.lineTo(bx + dx + 14, AX.y - 26); ctx.stroke(); } ctx.restore(); }
      // the pulse on the line: an ochre beat that spikes as the playhead passes PULSE
      const sp = span(px, AX.pulse - 40, AX.pulse + 30), drain = span(t, A.because - .1, A.because + .7);
      if (px > AX.x0 + 2 && drain < 1) F.pulseLine(ctx, t, AX.x0, Math.max(AX.x0 + 4, px), AX.y, [[AX.pulse, 1, sp]], { h: 120, w: 3.2, a: 1 - drain });
      X.label(ctx, XS.pulse, AX.pulse, AX.y - 165, lab(t, A.jump - .05, A.because + .6), { size: 34, spacing: .14, col: OCHRE.text });
      // READING: a cool tick when the playhead reaches it; then (1.03) the cool sliver at the right end of the long line
      const ru = span(px, AX.read - 10, AX.read + 30);
      if (ru > 0) { X.lightLine(ctx, [[AX.read, AX.y - 26], [AX.read, AX.y + 26]], ru * out, { col: rgba(COOL.line, .95), w: 3.5, glowCol: COOL.halo });
        X.label(ctx, XS.reading, AX.read, AX.y - 60, lab(t, A.readW, A.because + .8), { size: 34, spacing: .14, col: COOL.text }); }
      const sl = span(t, A.reading - .55, A.reading + .1) * out;
      if (sl > 0) { X.lightLine(ctx, [[AX.read, AX.y], [lerp(AX.read, AX.x1, sl), AX.y]], 1, { col: rgba(COOL.core, .95), w: 14, glowCol: COOL.halo, blur: 18 });
        X.label(ctx, XS.readingSpan, AX.x1, AX.y - 70, lab(t, A.reading - .3, A.every + .25), { size: 56, spacing: .12, col: COOL.text, align: 'right' }); }
    },
  });
  // the node: from the spike's top it runs left along the line into the stone head (1.03); the head becomes the hunter (1.04)
  const nodePos = (t) => {
    const u = ease(t, A.because + .05, A.older + .35);
    const x = lerp(nodeTop[0], headNode[0], u), y = lerp(nodeTop[1], headNode[1], u) - Math.sin(Math.PI * u) * 120;
    return [x, y, u];
  };
  const ANI = [['hunter', L.ANI.hunter, 250, A.every - .05], ['wolf', L.ANI.wolf, 165, A.mammal + .05], ['mouse', L.ANI.mouse, 88, A.carries + .05]];
  const toNiche = (t, i) => ease(t, A.first + .15 + i * .12, A.three + .45 + i * .08);   // 1.05: the three nodes fly up into FEAR
  beats.push({
    a: A.because - .1, b: A.three + 1.6, z: 3,
    wall(ctx, t, v) {
      const [nx, ny, nu] = nodePos(t);
      // the stone head rises out of the line as the node arrives; it sinks again as the hunter rises in its place
      const hu = span(t, A.older - .5, A.older + .35) * (1 - span(t, A.every - .15, A.every + .35));
      ground(ctx, hu, HEAD.x - 220, HEAD.x + 220, HEAD.y, HEAD.h * 1.05, () => F.stoneHead(ctx, t, HEAD.x, HEAD.y, HEAD.h, { node: span(nu, .96, 1) }));
      if (nu < 1 && t < A.older + .4) { halo(ctx, nx, ny, 130, .75, OCHRE.mid, OCHRE.hot); ctx.fillStyle = OCHRE.core; ctx.beginPath(); ctx.arc(nx, ny, 16, 0, Math.PI * 2); ctx.fill(); }
      // the mammals: rise out of the line one by one, each node lights; they sink when the nodes have flown into FEAR
      const sinkA = span(t, A.three - .2, A.three + 1.1);
      ANI.forEach(([k, x, h, t0], i) => {
        const ru = span(t, t0, t0 + .6) * (1 - sinkA);
        const nd = span(t, t0 + .25, t0 + .55) * (1 - span(toNiche(t, i), 0, .15));
        ground(ctx, ru, x - h * 1.6, x + h * 1.6, L.ANI.y, h * 1.15, () => F.mammal(ctx, t, k, x, L.ANI.y, h, { dir: 1, node: nd }));
      });
      // 1.05: the three nodes fly up into niche 1 (they converge, arcing)
      for (let i = 0; i < 3; i++) {
        const u = toNiche(t, i); if (u <= 0 || u >= 1) continue;
        const [, x0, h] = ANI[i], n0 = i === 0 ? [x0 + .02 * h, L.ANI.y - .86 * h] : i === 1 ? [x0 + .72 * h, L.ANI.y - .82 * h] : [x0 + .4 * h, L.ANI.y - .55 * h];
        const x = lerp(n0[0], L.NI.xs[0], u) + Math.sin(Math.PI * u) * (i - 1) * 60, y = lerp(n0[1], L.NI.icy, u) - Math.sin(Math.PI * u) * 90;
        halo(ctx, x, y, 70, .6, OCHRE.mid, OCHRE.hot); ctx.fillStyle = OCHRE.core; ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill();
      }
    },
    screen(ctx, t) { F.source(ctx, t, A.mammal, A.three + 1.2, SRC.mammalsSrc); },
  });

  // ------------------------------------------------------------------ 1.06 FEAR, BEFORE THOUGHT · 1.07 bad news pulls · 1.08 ★ clicks
  const FB = { node: [-2120, 1460], th: [-1790, 1460], thW: 120 };
  const CARD = { x: -1250, y: 1235, w: 430 };
  const ROW = { xs: [-1360, -1010, -660, -310], y: 990, w: 290, base: 1520, h0: 96, step: 92 };
  const grow = (t) => ease(t, A.bad - .15, A.bad + .95);   // the thought screen → the headline card
  const clone = (t, k) => ease(t, A.test + .05 + k * .1, A.test + 1.25 + k * .1);
  const exitRow = (t) => span(t, A.second + .1, A.second + 1.1);
  const mainCard = (t) => { const g = grow(t), cl = clone(t, 0);
    const x = lerp(FB.th[0], CARD.x, g), y = lerp(FB.th[1], CARD.y, g) - Math.sin(Math.PI * g) * 80, w = lerp(FB.thW, CARD.w, g);
    return [lerp(x, ROW.xs[0], cl), lerp(y, ROW.y, cl), lerp(w, ROW.w, cl)]; };
  beats.push({
    a: A.fear - .4, b: A.second + 1.3, z: 4,
    wall(ctx, t, v) {
      // the node drops out of niche 1 and pulses first
      const dn = ease(t, A.fear - .35, A.fear + .1), gone = span(t, A.bad - .2, A.bad + .5);
      if (dn > 0 && gone < 1) { const x = lerp(L.NI.xs[0], FB.node[0], dn), y = lerp(L.NI.icy, FB.node[1], dn) - Math.sin(Math.PI * dn) * 40;
        const p = bump(t, A.fear + .05, .7); halo(ctx, x, y, 90 + 80 * p, (.6 + .4 * p) * (1 - gone), OCHRE.mid, OCHRE.hot);
        ctx.fillStyle = rgba(OCHRE.core, 1 - gone); ctx.beginPath(); ctx.arc(x, y, 12 * (1 + .5 * p), 0, Math.PI * 2); ctx.fill();
        if (p > 0) { ctx.strokeStyle = rgba(OCHRE.hot, .8 * p); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 30 + 60 * (1 - p), 0, Math.PI * 2); ctx.stroke(); } }
      // the arrow from the node to the thought (order), then the thought lights
      const ar = span(t, A.beforeT - .2, A.beforeT + .3) * (1 - gone);
      if (ar > 0) X.lightLine(ctx, [[FB.node[0] + 40, FB.node[1]], [FB.th[0] - FB.thW / 2 - 24, FB.node[1]]], ar, { a: .6, w: 2.5 });
      const th = span(t, A.thought - .15, A.thought + .35);
      if (th > 0) {   // the thought: a small cool screen; on 'bad news' it grows into the headline card, then it becomes version 0 of the row
        const [x2, y2, w2] = mainCard(t), ex = exitRow(t), e = ease(t, A.bad + .15, A.bad + .5) * (1 - clone(t, 0));
        ground(ctx, 1 - ex, x2 - w2, x2 + w2, ROW.base + 20, 700, () => hlCard(ctx, t, x2, y2, w2, { u: th, neg: [0, e, 0, 0, e], seed: 11, glow: .6 + .4 * th }));
        // the thread: from the ochre bars down to your thumb (it pulls)
        const pu = span(t, A.pulls - .35, A.pulls + .25) * (1 - span(t, A.test + .1, A.test + .6));
        if (pu > 0) { const tx = CARD.x + 210, ty = CARD.y + 205 - 40 * ease(t, A.pulls, A.pulls + .5);
          X.lightLine(ctx, [[CARD.x - 30, CARD.y - 40], [CARD.x + 120, CARD.y + 120], [tx - 20, ty - 34]], smooth(pu), { col: rgba(OCHRE.body, .9), w: 3.2, glowCol: OCHRE.mid });
          ctx.save(); ctx.beginPath(); ctx.rect(tx - 200, ty - 120, 400, 330); ctx.clip(); ctx.translate(tx, ty + (1 - expoOut(clamp(pu * 1.5))) * 200); ctx.rotate(-.45);
          ctx.fillStyle = SKIN; ctx.beginPath(); ctx.roundRect(-38, -46, 76, 260, 38); ctx.fill();
          ctx.fillStyle = mixHex(SKIN, P.core1, .45); ctx.beginPath(); ctx.roundRect(-24, -36, 48, 56, 20); ctx.fill();
          ctx.fillStyle = rgba(P.night0, .25); ctx.fillRect(-38, 60, 76, 5); ctx.restore(); }
      }
      X.label(ctx, SRC.fearFirst, (FB.node[0] + FB.th[0]) / 2, FB.node[1] + 120, lab(t, A.fear + .15, A.bad + .6), { size: 42, spacing: .12, col: OCHRE.text });
      // ★ 1.08: four versions of one headline (0–3 negative words); under each a click bar, one step per negative word
      const ex = exitRow(t);
      if (t > A.test) {
        ground(ctx, 1 - ex, -1600, 0, ROW.base + 20, 900, () => {
          X.lightLine(ctx, [[ROW.xs[0] - 190, ROW.base], [ROW.xs[3] + 190, ROW.base]], span(t, A.test + .4, A.test + 1.4), { a: .55, w: 2.5 });
          for (let k = 1; k < 4; k++) { const cl = clone(t, k); if (cl <= 0) continue;
            const [mx, my] = mainCard(A.test + .05 + k * .1), x = lerp(mx, ROW.xs[k], cl), y = lerp(my, ROW.y, cl), neg = [0, 1, 2].map((j) => (j < k ? ease(t, A.negative - .1 + j * .2 + k * .06, A.negative + .3 + j * .2 + k * .06) : 0));
            hlCard(ctx, t, x, y, ROW.w, { u: clamp(cl * 4), neg: [0, ...neg], seed: 11, glow: .6 }); }
          for (let k = 0; k < 4; k++) {   // the click bars: a cool base, then one ochre step per negative word, landing on 'more clicks'
            const bu = expoOut(span(t, A.headlines + .2 + k * .06, A.headlines + 1 + k * .06)), x = ROW.xs[k], bw = 70;
            if (bu <= 0) continue;
            ctx.fillStyle = rgba(COOL.body, .85); ctx.fillRect(x - bw / 2, ROW.base - ROW.h0 * bu, bw, ROW.h0 * bu);
            for (let j = 0; j < k; j++) { const su = expoOut(span(t, A.brought + .12 + (k - 1) * .2 + j * .07, A.brought + .5 + (k - 1) * .2 + j * .07)); if (su <= 0) continue;
              const y0 = ROW.base - ROW.h0 - j * ROW.step, hh = (ROW.step - 6) * su, fl = bump(t, A.brought + .12 + (k - 1) * .2 + j * .07, .7);
              if (fl > 0) halo(ctx, x, y0 - hh / 2, 90, .45 * fl, OCHRE.mid, OCHRE.hot);
              ctx.fillStyle = mixHex(OCHRE.body, OCHRE.core, .3 * fl); ctx.fillRect(x - bw / 2, y0 - 6 - hh, bw, hh); }
          }
        });
      }
      X.big(ctx, SRC.clicks, (ROW.xs[0] + ROW.xs[3]) / 2, 790, 66, lab(t, A.clicks - .35, A.second + 1.0, .8), { gold: .35 });
    },
    screen(ctx, t) { F.source(ctx, t, A.clicks - .3, A.feels + .6, SRC.clicksSrc); },
  });

  // ------------------------------------------------------------------ 1.10–1.13 the office under the niches
  const O = L.OFF;
  const desk = (ctx, t, x, scr) => {   // a desk (front panel hides the legs) with a screen on its right, seen at 3/4
    ctx.fillStyle = mixHex(P.night0, P.night1, .6); ctx.beginPath(); ctx.roundRect(x - 170, O.desk, 340, O.floor - O.desk, 8); ctx.fill();
    ctx.fillStyle = rgba(P.blue1, .5); ctx.fillRect(x - 170, O.desk, 340, 5);
    const sx = x + 95, sy = O.desk - 118, g = clamp(scr.gold ?? 0);
    if (g > 0) halo(ctx, sx, sy + 40, 260, .5 * g, GOLD.halo, GOLD.hot);
    else halo(ctx, sx, sy + 40, 160, .2, COOL.halo, COOL.core);
    ctx.save(); ctx.translate(sx, sy); ctx.transform(1, -.18, 0, 1, 0, 0);
    ctx.fillStyle = mixHex(mixHex(COOL.deep, COOL.body, .55), GOLD.hot, g * .85); ctx.strokeStyle = rgba(g > .5 ? GOLD.line : COOL.line, .9); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.roundRect(-62, -10, 124, 92, 8); ctx.fill(); ctx.stroke();
    ctx.fillStyle = rgba(g > .5 ? GOLD.deep : COOL.core, .6); for (let j = 0; j < 3; j++) ctx.fillRect(-46, 8 + j * 20, j === 2 ? 50 : 88, 8);
    ctx.restore();
    ctx.fillStyle = mixHex(P.night0, P.ind2, .5); ctx.fillRect(sx - 5, sy + 80, 10, 40);
  };
  const track = (ctx, x, y, f, col, u) => { if (u <= 0) return; ctx.fillStyle = rgba(CREAM, .14 * u); ctx.fillRect(x - 130, y, 260 * expoOut(u), 10); ctx.fillStyle = col; ctx.fillRect(x - 130, y, 260 * f * expoOut(u), 10); };
  beats.push({
    a: A.somebody - .5, b: A.companies + 1.3, z: 5,
    wall(ctx, t) {
      const out = span(t, A.companies - .1, A.companies + 1.0);
      const r1 = span(t, A.somebody - .45, A.somebody + .45) * (1 - out), r2 = span(t, A.somebody - .3, A.somebody + .6) * (1 - out);
      const gold = ease(t, A.ahead - .55, A.ahead + .1), arm = ease(t, A.something + .2, A.grab + .15);
      ground(ctx, r1, O.you - 260, O.you + 260, O.floor, 420, () => {
        E.du(ctx, O.you - 40, O.floor - 40, 380, { dir: 1, look: .1 + .15 * arm, lean: .05 + .08 * arm, armR: [lerp(.15, 1.25, arm), lerp(.1, 1.95, arm)], armL: [-.1, -.05], light: 1 });
        desk(ctx, t, O.you, { gold: 0 });
        track(ctx, O.you, O.desk - 330, .24 + .03 * Math.sin(t * .8), rgba(CREAM, .85), span(t, A.somebody + .2, A.somebody + .9));
      });
      ground(ctx, r2, O.col - 260, O.col + 260, O.floor, 420, () => {
        E.person(ctx, O.col - 40, O.floor - 40, 380, { dir: 1, look: .15, armR: [1.1, 1.8], light: 1, rim: gold > .3 ? GOLD.line : undefined });
        desk(ctx, t, O.col, { gold });
        track(ctx, O.col, O.desk - 330, lerp(.24, .96, ease(t, A.ahead - .3, A.withAI + .4)), GOLD.body, span(t, A.somebody + .3, A.somebody + 1));
      });
      // 1.12 the glass wall and the competitor behind it
      const gw = span(t, A.competitor - .35, A.competitor + .45) * (1 - out);
      ground(ctx, gw, O.glass - 40, O.comp + 280, O.floor, 470, () => {
        E.person(ctx, O.comp - 40, O.floor - 40, 360, { dir: 1, look: .15, armR: [1.1, 1.8], light: 1, rim: GOLD.line });
        desk(ctx, t, O.comp, { gold: 1 });
        ctx.fillStyle = rgba(COOL.body, .13); ctx.fillRect(O.glass - 14, O.floor - 430, 28, 430);
        ctx.fillStyle = rgba(COOL.core, .35); ctx.fillRect(O.glass - 14, O.floor - 430, 3, 430); ctx.fillRect(O.glass + 11, O.floor - 430, 2, 430);
        for (let k = 0; k < 3; k++) { ctx.fillStyle = rgba(COOL.core, .12); ctx.save(); ctx.translate(O.glass, O.floor - 330 + k * 110); ctx.rotate(-.5); ctx.fillRect(-40, -3, 80, 4); ctx.restore(); }
      });
      X.lightLine(ctx, [[O.you - 300, O.floor], [O.comp + 280, O.floor]], span(t, A.somebody - .5, A.somebody + .4) * (1 - out), { a: .4, w: 2.5 });
      X.label(ctx, SRC.colleague, O.col, O.desk + 72, lab(t, A.colleague - .05, A.companies + .2), { size: 34, spacing: .14 });
      X.label(ctx, SRC.competitor, O.comp, O.desk + 72, lab(t, A.competitor - .05, A.companies + .3), { size: 34, spacing: .14 });
      // 1.13 GRAB IT between the niches and the desks (niche 2 closes its hand: lib/b1_take.mjs nicheBeat)
      X.big(ctx, SRC.grab, L.NI.x, 1352, 58, lab(t, A.grab - .1, A.companies + .75, .6), { gold: .5, col: OCHRE.text });
    },
  });
  return { keys, lights, beats };
}

export default async (T, R) => (await take(T)).entries(R);
