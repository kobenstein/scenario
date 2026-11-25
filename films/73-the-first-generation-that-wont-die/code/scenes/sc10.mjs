// c10 · B3 · 'And at the very top' → "It doesn't have to go" (plateHouses, B3 inner seam).
// Power at the top. Out of plateTop (B2) the ledge thickens into a viewing platform; a planned cut (W 5.11) rhymes the platform with the
// Beijing tribune at the same place on screen. Silhouettes only, the quotes as cards (interpreter caveat), ★ 150 rises over the tribune.
// Then the tribune splits into three ledges (any president / judge / founder), a queue grows below, a gate, the 2013 dots, THE ANSWER with
// a gold weight on YES, and the bead drops into your window: two houses, yours lit, your neighbour's dark → plateHouses.
//
// | ID   | anchor (phrase)                     | zeigt wörtlich                                              | layer | carrier out          |
// |------|-------------------------------------|-------------------------------------------------------------|-------|----------------------|
// | 5.10 | And at the very top                 | plateTop: the ledge thickens into a viewing platform (rail)  | MIX   | the platform (W)     |
// | 5.11 | Beijing, September                  | night square, parade lights, the tribune; BEIJING · 3 SEP 2025 | SCENE | the tribune        |
// | 5.12 | A military parade                   | the camera finds the microphone, its live light on          | SCENE | the microphone       |
// | 5.13 | China's president and Russia's      | two silhouettes walk up to the tribune                      | SCENE | the microphone       |
// | 5.14 | Through his interpreter             | the quote card grows out of the mic (interpreter caveat)    | EXPL  | the card             |
// | 5.15★| China's president answers           | the Xi card; 150 rises huge over the tribune                | EXPL  | the 150              |
// | 5.16 | This isn't about two countries      | the square sinks; the tribune splits into three ledges      | MIX   | the ledges           |
// | 5.17–5.19 | Any president · judge · founder | one figure per ledge, its words on the word               | MIX   | the ledges           |
// | 5.20 | Who steps aside                     | nobody steps down; a queue grows on the line: WHO STEPS ASIDE? | MIX | the queue           |
// | 5.21 | And who gets it at all              | a gate rises in the line; two pass, most wait               | MIX   | the gate             |
// | 5.22 | In that survey from twenty thirteen | the queue sinks; the 2013 dots hang over the line: ONLY THE WEALTHY | EXPL | the dots       |
// | 5.23 | Now ask yourself                    | the dots fold into THE ANSWER                               | EXPL  | the bead             |
// | 5.24 | Would you still say yes             | a heavy gold weight on YES; the bead backs away             | EXPL  | the bead             |
// | 5.25 | If you could afford it              | the bar becomes the ground, the bead your lit window; the neighbour's stays dark | SCENE | plateHouses |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f73_kit.mjs';
import * as S from '../lib/f73_world.mjs';
import * as X from '../lib/f73_stage.mjs';
import * as B from '../lib/b3_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, expoIn, halo, lin, prng } = E;
const { GOLD, COOL, CREAM, LAMP, AGE, SOURCES: SRC } = F;
const PR = F.PRINT73, Q = S.PTOP, OX = B.PH.ox, AX = 960 + OX;   // the answer / the houses sit at sheet x 1700 (= plateHouses' 960)
const N150 = (SRC.z1.xi.match(/\d+/) || ['150'])[0];

export default async (T, R) => {
  const G = (p, n = 0) => T.G(p, n, R.a - .5);
  const A = {
    top: R.a, come: G('has already come up'), beijing: G('Beijing, September'), parade: G('A military parade'), mic: G('a live microphone'),
    pres2: G("China's president and Russia's"), platform: G('the viewing platform'), through: G('Through his interpreter'), organs: G('organs'),
    answers: G("China's president answers"), h150: G('a hundred and fifty'), notAbout: G("This isn't about two countries"),
    pres: G('Any president'), judge: G('Any judge'), founder: G('Any founder'), steps: G('Who steps aside'), gets: G('And who gets it at all'),
    survey: G('In that survey from twenty thirteen'), wealthy: G('the wealthy'), ask: G('Now ask yourself'), would: G('Would you still say yes'),
    powerful: G('the powerful'), afford: G('If you could afford it'), neighbor: G('neighbor'), end: R.b,
  };
  const tA = R.a + S.SEAM_HALF, tP = R.b - S.SEAM_HALF;

  // ------------------------------------------------------------------ views
  const V1 = [[R.a - S.SEAM_HALF, { x: 960, y: 560, s: 1 }], [tA, { x: 960, y: 560, s: 1.04 }], [A.beijing - .1, { x: 970, y: 470, s: 1.5 }]];
  const view1 = (t) => { if (t < tA) { const b = S.breathe(t); return { x: 960 + b.dx, y: 560 + b.dy, s: S.creep(t, T, 'And at the very top') }; } return B.viewOf(t, V1, false); };
  const V2 = [
    [A.beijing, { x: 960, y: 540, s: 1 }], [A.parade + 1.9, { x: 760, y: 610, s: 1.12 }], [A.pres2 + 1.8, { x: 1030, y: 548, s: 1.04 }],
    [A.through + 1.6, { x: 930, y: 522, s: 1.02 }], [A.notAbout, { x: 960, y: 528, s: 1.05 }], [A.pres - .1, { x: 960, y: 560, s: .95 }],
    [A.steps + .9, { x: 1160, y: 548, s: .9 }], [A.gets + 1.0, { x: 1720, y: 590, s: 1.04 }], [A.survey + 1.3, { x: 1700, y: 572, s: .96 }],
    [A.ask + .4, { x: AX, y: 562, s: .985 }], [tP, { x: AX, y: 560, s: 1 }],
  ];
  const view2 = (t) => B.viewOf(t, V2, false);
  const PK = [[A.beijing, [960, 470]], [A.notAbout + .6, [960, 470]], [A.pres, [960, 420]], [A.steps + .5, [1300, 520]], [A.gets + .6, [1760, 600]], [A.survey + .6, [AX, 470]], [A.afford - .2, [AX, 640]]];
  const pool = (t) => { let i = 0; while (i < PK.length - 2 && t > PK[i + 1][0]) i++; const [t0, a] = PK[i], [t1, b] = PK[i + 1], u = sineIO(span(t, t0, t1)); return [lerp(a[0], b[0], u), lerp(a[1], b[1], u)]; };

  // ------------------------------------------------------------------ 5.10 · plateTop → the viewing platform
  function top(ctx, t) {
    const v = view1(t), k = B.ease(t, A.top + .7, A.beijing - .4, quartIO), sink = B.ease(t, A.top + 1.0, A.top + 3.0);
    B.ground(ctx, t, v, { lx: Q.holder, ly: Q.ledge - 80 });
    X.inView(ctx, v, (s) => {
      if (k > 0) B.ledge(ctx, t, Q.s0, Q.s1, Q.ledge, Q.y, s, { slab: 60 * k, legs: 0, a: 0 });
      F.goldSpan(ctx, S.topPath(Q), 0, 1, { w: 3.2 / s, spark: false });
      if (k > 0) B.ledge(ctx, t, Q.s0, Q.s1, Q.ledge, Q.y, s, { rail: k, legs: 0, a: 0 });
      halo(ctx, Q.holder, Q.ledge - 70, 260, .5, GOLD.halo, GOLD.core);
      F.person(ctx, Q.holder, Q.ledge - 2, 150, { pose: 'stand', dir: 1, light: 1 });
      ctx.save(); ctx.beginPath(); ctx.rect(Q.s1 + 4, 0, 2000, Q.y - 1); ctx.clip(); ctx.translate(0, quartIO(sink) * 150);
      Q.wait.forEach((x, i) => F.person(ctx, x, Q.y - 2, 112 + (i % 2) * 8, { pose: i === 0 ? 'look' : 'stand', dir: -1 }));
      ctx.restore();
    });
  }

  // ------------------------------------------------------------------ the Beijing square (sheet = screen at V0; the tribune where the ledge was)
  const TR = { x0: 645, x1: 1275, y: 480, slab: 90 };
  const MIC = { x: 400, y: 690 };
  const r7 = prng(7310), SKY = Array.from({ length: 34 }, (_, i) => ({ x: -300 + i * 78 + r7() * 30, w: 50 + r7() * 60, h: 30 + r7() * 110, win: r7() }));
  function square(ctx, t, v, ret) {
    const fade = 1 - ret, sink = 300 * ret; if (fade <= 0) return;
    X.inView(ctx, X.layerView(v, .7), () => {   // the far city behind the tribune
      ctx.save(); ctx.globalAlpha *= fade; ctx.translate(0, sink * .7);
      for (const b of SKY) { ctx.fillStyle = mixHex(P.night1, P.ind2, .45); ctx.fillRect(b.x, 478 - b.h, b.w, b.h + 4);
        if (b.win > .45) { ctx.fillStyle = rgba(LAMP.body, .35 + .15 * Math.sin(t * .6 + b.x)); ctx.fillRect(b.x + b.w * .3, 478 - b.h * .6, 4, 5); } }
      ctx.restore();
    });
    X.inView(ctx, v, (s) => {
      ctx.save(); ctx.globalAlpha *= fade; ctx.translate(0, sink);
      // the plaza
      ctx.fillStyle = lin(ctx, 0, 560, 0, 1200, [[0, mixHex(P.night1, P.ind1, .5)], [1, P.night0]]); ctx.fillRect(-600, 566, 3200, 900);
      // the walkway to the tribune stairs (lighter), and the stairs
      ctx.fillStyle = rgba(mixHex(P.ind2, CREAM, .12), .55); ctx.beginPath(); ctx.moveTo(1300, 600); ctx.lineTo(1420, 600); ctx.lineTo(2100, 1200); ctx.lineTo(1500, 1200); ctx.closePath(); ctx.fill();
      ctx.fillStyle = mixHex(P.night1, P.ind2, .6); ctx.beginPath(); ctx.moveTo(TR.x1, TR.y + 4); ctx.lineTo(1300, TR.y + 4); ctx.lineTo(1420, 600); ctx.lineTo(TR.x1, 600); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = rgba(CREAM, .25); ctx.lineWidth = 1.2 / s; ctx.beginPath(); for (let i = 1; i < 6; i++) { const y = lerp(TR.y + 4, 600, i / 6); ctx.moveTo(TR.x1, y); ctx.lineTo(lerp(1300, 1420, i / 6), y); } ctx.stroke(); ctx.beginPath();
      // the parade: rows of lights marching towards us in perspective (vanishing point behind the tribune)
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let row = 0; row < 14; row++) {
        const d = 5.8 - ((row * .34 + t * .09) % 4.76), y = 470 + 560 / d; if (y < 586) continue;
        const near = clamp((1030 - y) / 60) * clamp((y - 586) / 40);
        for (let c = -6; c <= 6; c++) { const x = 760 + c * 34 * 6 / d, r = .9 + 4.5 / d, hh = 3 + 34 / d; ctx.fillStyle = rgba(LAMP.body, .5 * near); ctx.beginPath(); ctx.roundRect(x - r, y - hh, r * 2, hh, r); ctx.fill(); }
      }
      ctx.restore();
      ctx.restore();
    });
    // the live microphone in the foreground (layer 1.12)
    X.inView(ctx, X.layerView(v, 1.12), (s) => {
      ctx.save(); ctx.globalAlpha *= fade; ctx.translate(0, sink * 1.12);
      ctx.strokeStyle = mixHex(P.night0, P.ind2, .5); ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(150, 1300); ctx.lineTo(MIC.x - 60, MIC.y + 90); ctx.stroke(); ctx.beginPath();
      ctx.save(); ctx.translate(MIC.x, MIC.y); ctx.rotate(-.6);
      ctx.fillStyle = mixHex(P.night0, P.ind2, .55); ctx.beginPath(); ctx.roundRect(-34, 40, 68, 190, 18); ctx.fill();
      ctx.fillStyle = lin(ctx, -80, 0, 80, 0, [[0, mixHex(P.night1, P.blue2, .25)], [1, mixHex(P.night1, P.blue2, .6)]]); ctx.beginPath(); ctx.ellipse(0, -20, 78, 98, 0, 0, Math.PI * 2); ctx.fill();
      E.dust(ctx, 7311, 70, 0, -20, 66, 86, 0, .22, mixHex(P.blue2, CREAM, .25));
      ctx.strokeStyle = rgba(GOLD.line, .35); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, -20, 78, 98, 0, -1.5, .8); ctx.stroke(); ctx.beginPath();
      const live = span(t, A.mic - .1, A.mic + .3) * (.75 + .25 * Math.sin(t * 3.2));
      if (live > 0) halo(ctx, 0, 110, 60, .75 * live, LAMP.body, LAMP.core);
      ctx.fillStyle = mixHex(mixHex(P.night0, P.ind1, .5), LAMP.core, live); ctx.beginPath(); ctx.arc(0, 110, 9, 0, Math.PI * 2); ctx.fill();
      ctx.restore(); ctx.restore();
    });
  }
  // the two silhouettes: walk up the walkway, the stairs, along the tribune; then ride their ledge
  const ROUTE = [[1880, 1220], [1640, 900], [1400, 610], [1270, 482]];
  function walker(t, t0, t1, xEnd) {
    const pts = [...ROUTE, [xEnd, 482]], L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const u = span(t, t0, t1), d = L[L.length - 1] * sineIO(u); let i = 1; while (i < pts.length - 1 && L[i] < d) i++;
    const f = clamp((d - L[i - 1]) / (L[i] - L[i - 1])), x = lerp(pts[i - 1][0], pts[i][0], f), y = lerp(pts[i - 1][1], pts[i][1], f);
    return { x, y: y - 2, h: lerp(112, 180, clamp((y - 482) / (900 - 482))), walk: u > 0 && u < 1 ? d * .075 : undefined, on: u > 0 };
  }
  const WA = (t) => walker(t, A.pres2 - .2, A.through + 2.8, 1160), WB = (t) => walker(t, A.pres2 + .5, A.answers - .2, 760);
  // the tribune splits into three ledges (5.16)
  const LED = [[645, 855, 480, 200, 540, 500], [855, 1065, 480, 790, 1130, 450], [1065, 1275, 480, 1380, 1720, 500]];
  const BASE = 760;
  const splitK = (t) => quartIO(span(t, A.notAbout + .3, A.notAbout + 2.0));
  const down = (t) => B.ease(t, A.survey - .3, A.survey + 1.3, quartIO);   // the ledges sink back into the line (5.22)
  const ledgeAt = (i, t) => { const k = splitK(t), [a0, a1, ay, b0, b1, by] = LED[i]; return [lerp(a0, b0, k), lerp(a1, b1, k), lerp(lerp(ay, by, k), BASE, down(t))]; };
  const QUEUE = Array.from({ length: 9 }, (_, i) => ({ x: 1880 + i * 66 + (i % 3) * 6, h: 108 + (i * 37 % 5) * 5, d: i * .26 }));

  // ------------------------------------------------------------------ 5.11 → 5.25
  function main(ctx, t) {
    const v = view2(t), ret = B.ease(t, A.notAbout - .15, A.notAbout + 1.7), k = splitK(t), pl = pool(t);
    if (t >= A.afford - .1) { houses(ctx, t, v); return; }
    B.ground(ctx, t, v, { lx: pl[0], ly: pl[1] });
    square(ctx, t, v, ret);
    X.inView(ctx, v, (s) => {
      // the line with its ledges grows out of the tribune (5.16) — drawn from the middle ledge outwards
      const L = [0, 1, 2].map((i) => ledgeAt(i, t));
      if (k > 0) {
        const pts = [[-400, BASE]]; for (const [x0, x1, y] of L) pts.push([x0, BASE], [x0, y], [x1, y], [x1, BASE]); pts.push([2900, BASE]);
        const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
        const c = (len[6] + len[7]) / 2 / len[len.length - 1];   // the middle of the middle ledge
        F.goldSpan(ctx, pts, c - c * k, c + (1 - c) * k, { w: 3.2 / s, spark: k < 1 });
      }
      for (const [x0, x1, y] of L) B.ledge(ctx, t, x0, x1, y, BASE, s, { slab: lerp(TR.slab, 0, k), legs: 0, a: 1 - k });
      const rl = 1 - span(k, 0, .25); if (rl > 0 && ret < 1) B.ledge(ctx, t, L[0][0], L[2][1], L[1][2], BASE, s, { rail: rl, railH: 39, legs: 0, a: 0 });
      // figures: the two silhouettes (B → ledge 1, A → ledge 3), the judge grows out of ledge 2
      const ride = (w, i, f) => { const [x0, x1, y] = ledgeAt(i, t); return k > 0 ? { x: lerp(w.x, lerp(x0, x1, f), k), y: y - 2, h: lerp(w.h, 120, k) } : w; };
      const fig = (p, light, extra = {}) => { ctx.save(); ctx.beginPath(); ctx.rect(p.x - 200, -2000, 400, p.y + 1.5 - -2000); ctx.clip(); ctx.translate(0, p.sink ?? 0);
        F.person(ctx, p.x, p.y, p.h, { pose: p.walk != null ? 'walk' : 'stand', walk: p.walk, dir: -1, light, ...extra }); ctx.restore(); };
      const dn = down(t);
      const pB = ride(WB(t), 0, .55), pA = ride(WA(t), 2, .45), lit = (tt) => span(t, tt - .05, tt + .5) * (1 - dn);
      for (const [p, tt, i] of [[pB, A.pres, 0], [pA, A.founder, 2]]) { if (k <= 0 && !(i ? WA(t) : WB(t)).on) continue; if (lit(tt) > 0) halo(ctx, p.x, p.y - p.h * .6, 150, .35 * lit(tt), GOLD.halo, GOLD.core); fig({ ...p, sink: dn * 160 }, 1); }
      const ju = span(t, A.judge - .25, A.judge + .5), [j0, j1, jy] = ledgeAt(1, t);
      if (ju > 0) { if (lit(A.judge) > 0) halo(ctx, (j0 + j1) / 2, jy - 72, 150, .35 * lit(A.judge), GOLD.halo, GOLD.core); fig({ x: (j0 + j1) / 2, y: jy - 2, h: 120, sink: (1 - expoOut(ju)) * 124 + dn * 160 }, 1); }
      // the seats' words under the ledges, on the word
      LED.forEach((_, i) => { const [x0, x1, y] = ledgeAt(i, t), tt = [A.pres, A.judge, A.founder][i];
        X.label(ctx, SRC.seats[i], (x0 + x1) / 2, y + 62, B.lab(t, tt - .05, A.gets + .4, .6), { size: 28, gold: .45 * span(t, tt, tt + .6) }); });
      // the queue (5.20): people walk in along the line from the right and wait; the gate (5.21): two pass
      const gu = span(t, A.gets - .1, A.gets + .9) * (1 - span(t, A.survey + .2, A.survey + 1.2)), GX = 1795;
      if (gu > 0) { halo(ctx, GX - 120, BASE - 70, 220, .4 * gu, GOLD.halo, GOLD.core); B.gate(ctx, t, GX, BASE, 175, 72, s, { u: gu }); }
      const qs = span(t, A.survey - .3, A.survey + .9);
      ctx.save(); ctx.beginPath(); ctx.rect(-4000, -2000, 9000, BASE - 1 + 2000); ctx.clip();
      QUEUE.forEach((p, i) => {
        const w = span(t, A.steps - .3 + p.d, A.steps + 2.3 + p.d); if (w <= 0) return;
        let x = p.x + (1 - sineIO(w)) * 640, walk = w < 1 ? x * .07 : undefined;
        if (i < 2) { const g = span(t, A.gets + .5 + i * .35, A.gets + 2.6 + i * .35); if (g > 0) { x = lerp(x, 1640 - i * 70, sineIO(g)); walk = g < 1 ? x * .07 : walk; } }
        ctx.save(); ctx.translate(0, quartIO(qs) * 140); F.person(ctx, x, BASE - 2, p.h, { pose: walk != null ? 'walk' : 'stand', walk, dir: -1, light: 1 }); ctx.restore();
      });
      ctx.restore();
      dotsAndAnswer(ctx, t, s);
    });
    // screen texts
    X.label(ctx, SRC.beijing, W / 2, 150, B.lab(t, A.beijing + .15, A.through + .2), { size: 32, spacing: .16 });
    cards(ctx, t, v);
    X.big(ctx, SRC.steps, W / 2, 190, 66, B.lab(t, A.steps + .1, A.gets + .2), { gold: .25 });
    if (t > A.through && t < A.notAbout + 1) F.source(ctx, t, A.through + .7, A.notAbout + .3, SRC.z1.src);
    if (t > A.survey && t < A.ask + 1) F.source(ctx, t, A.survey + 1.0, A.ask + .5, SRC.wealthySrc);
  }
  // the quote cards grow out of the microphone; ★ 150 rises over the tribune
  function cards(ctx, t, v) {
    const [mx, my] = X.toScreen(X.layerView(v, 1.12), MIC.x, MIC.y);
    const card = (u, o) => { if (u <= 0) return; const g = quartIO(span(u, 0, 1)), cx = 110 + 450, cy = 200;
      ctx.save(); ctx.translate(lerp(mx, cx, g), lerp(my, cy, g)); ctx.scale(lerp(.08, 1, g), lerp(.08, 1, g)); ctx.translate(-cx, -cy);
      F.quoteCard(ctx, t, T, { x: 110, y: 84, w: 900, size: 40, u, mode: 'hi', ...o }); ctx.restore(); };
    const pu = span(t, A.through + .25, A.through + 1.3) * (1 - span(t, A.answers - .7, A.answers + .9));
    card(pu, { text: SRC.z1.putin, credit: SRC.z1.putinCredit, spoken: ['organs', 'immortal'], after: A.through - .1 });
    const xu = span(t, A.answers + .2, A.answers + 1.2) * (1 - span(t, A.notAbout - .3, A.notAbout + 1.1));
    card(xu, { text: SRC.z1.xi, credit: SRC.z1.xiCredit, spoken: ['some predict', 'this century'], after: A.answers - .1 });
    const nu = span(t, A.h150 - .1, A.h150 + .9) * (1 - span(t, A.notAbout + .2, A.notAbout + .9));
    if (nu > 0) { const b = F.bump(t, A.h150 + .15, 1.6); halo(ctx, 1320, 360, 460, .3 * nu + .35 * b, GOLD.halo, GOLD.core); X.big(ctx, N150, 1320, 462, 290, nu, { gold: 1 }); }
  }
  // 5.22 → 5.24: the 2013 dots, THE ANSWER, the weight on YES
  function dotsAndAnswer(ctx, t, s) {
    const du = span(t, A.survey + .3, A.survey + 1.4), fold = quartIO(span(t, A.ask - .25, A.ask + .9));
    const on = 100 * 2 / 3 * .97 * sineIO(span(t, A.survey + 1.4, A.wealthy + .2));   // "almost two-thirds" (Pew 2013, F.SOURCES.wealthySrc)
    const X0 = AX - 135, Y0 = 330, AW = 560, AY = 520;
    if (du > 0 && fold < 1) for (let i = 0; i < 100; i++) {
      const d = expoOut(span(du, i / 100 * .7, i / 100 * .7 + .3)); if (d <= 0) continue;
      const gx = X0 + (i % 10) * 30, gy = Y0 + Math.floor(i / 10) * 30, lit = clamp(on - i), bx = AX - AW / 2 + i / 99 * AW, f = clamp(fold * 1.15 - (i % 10) * .015);
      const x = lerp(gx, bx, f), y = lerp(gy, AY, f), r = lerp(8.5, 3, f) * d;
      if (lit > 0 && i % 7 === 0) halo(ctx, x, y, r * 3, .25 * lit * (1 - f), GOLD.halo, GOLD.core);
      ctx.fillStyle = lit > 0 ? mixHex(CREAM, GOLD.body, lit) : rgba(CREAM, .22); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    X.label(ctx, SRC.wealthy, AX, Y0 - 44, B.lab(t, A.survey + .9, A.ask + .2), { size: 32, gold: .3 });
    // THE ANSWER
    const au = span(t, A.ask + .35, A.ask + 1.25); if (au <= 0) return;
    const wl = A.powerful + .1, wu = span(t, wl - .5, wl + .6) * (1 - span(t, A.afford - 1.0, A.afford - .15));
    const tilt = .05 * expoOut(span(t, wl, wl + .9)) * (1 - sineIO(span(t, A.afford - 1.1, A.afford - .2)));
    const p = -.4 * sineIO(span(t, wl + .1, wl + 1.6)) + .03 * Math.sin(t * 1.1);
    ctx.save(); ctx.translate(AX, AY); ctx.rotate(tilt); ctx.translate(-AX, -AY);
    F.answer(ctx, t, AX, AY, AW, p, { u: au, tremble: 4 * span(t, A.would, A.would + .6) * (1 - span(t, A.powerful, A.powerful + 1)) });
    B.weight(ctx, t, AX + AW / 2, AY + 14, 64, 21, s, wu);
    X.label(ctx, B.LOCAL.powerful, AX + AW / 2, AY + 160, B.lab(t, wl + .2, A.afford - .3), { size: 24, gold: .4 });
    ctx.restore();
  }
  // 5.25: the bar lowers into the ground line, the bead drops into your window, the houses rise → plateHouses
  function houses(ctx, t, v) {
    const f = quartIO(span(t, A.afford - .1, A.afford + 1.4)), vi = B.shift(v, OX), PH = B.PH;
    const AW = 560, AY = 520, xa = lerp(-AW / 2, PH.x0 - 960, f), xb = lerp(AW / 2, PH.x1 - 960, f), y = lerp(AY, PH.y, f);
    const land = A.afford + 2.0, bu = span(t, A.afford + .5, land), h1 = span(t, A.afford + .5, A.afford + 1.7), h2 = span(t, A.afford + .9, A.afford + 2.2);
    const duW = span(t, A.afford + .9, A.neighbor + .3);
    B.drawHouses(ctx, t, vi, { line: false, h1, h2, lit1: span(t, land - .1, land + .3), lit2: 0, du: duW >= 1 ? 1 : 0, duX: lerp(PH.x0 - 60, PH.du, sineIO(duW)),
      mid: (c, s) => {
        // main()'s full-width base line closes in to the houses' line (no pop at the switch)
        const ba = 1 - span(f, .75, 1); if (ba > 0) F.goldSpan(c, [[lerp(-400 - OX, PH.x0, f), BASE], [lerp(2900 - OX, PH.x1, f), BASE]], 0, 1, { w: 3.2 / s, spark: false, a: ba });
        // the answer's bar look (F.answer: glow, body, end ticks) hands over to the lifeline
        const ka = 1 - span(f, 0, .4);
        c.save(); c.globalAlpha *= 1 - ka; X.lifeline(c, t, 960 + xa, 960 + xb, y, s, { u: 1, spark: false }); c.restore();
        if (ka > 0) { c.save(); c.globalAlpha *= ka; c.lineCap = 'round';
          c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = rgba(GOLD.halo, .25); c.lineWidth = 14; c.beginPath(); c.moveTo(960 + xa, y); c.lineTo(960 + xb, y); c.stroke(); c.restore();
          c.strokeStyle = GOLD.body; c.lineWidth = 4; c.beginPath(); c.moveTo(960 + xa, y); c.lineTo(960 + xb, y); c.stroke();
          c.fillStyle = GOLD.body; for (const xx of [960 + xa, 960 + xb]) c.fillRect(xx - 1.5, y - 12, 3, 24); c.restore(); }
        // the answer's ends and words sink, the bead falls into your window
        const wo = 1 - span(t, A.afford - .2, A.afford + .5);
        if (wo > 0) { F.goldText(c, [['NO', .28]], 960 - AW / 2 - 26, AY + 11, 30, F.rise(wo), { serif: false, weight: 700, spacing: .12, align: 'right' }); F.goldText(c, [['YES', 0]], 960 + AW / 2 + 26, AY + 11, 30, F.rise(wo), { serif: false, weight: 700, spacing: .12, align: 'left' }); }
        if (bu < 1) { const p0 = [960 + (-.4 + .03 * Math.sin(t * 1.1)) * AW / 2, lerp(AY, PH.y, f * (1 - span(bu, 0, .01)))], win = [PH.you, PH.y - PH.w * .35], [bx, by] = B.quad(p0, [lerp(p0[0], win[0], .5), p0[1] - 140], win, sineIO(bu));
          halo(c, bx, by, 60 / s, .55, GOLD.halo, GOLD.core); c.fillStyle = GOLD.body; c.beginPath(); c.arc(bx, by, 13 / s * (1 - .5 * bu), 0, Math.PI * 2); c.fill(); }
        const dw = duW > 0 && duW < 1 ? t * 6.2 : undefined;
        if (dw != null) { c.save(); F.du(c, lerp(PH.x0 - 60, PH.du, sineIO(duW)), PH.y - 2 / s, 92, { walk: dw, dir: 1 }); c.restore(); }
      } });
  }
  const draw = (ctx, t) => (t < A.beijing ? top(ctx, t) : main(ctx, t));
  const marks = [R.a, A.beijing, A.notAbout, A.steps, A.survey, A.afford];
  return [...marks.map((t) => ({ t, draw, print: PR })), { t: tP, draw: (ctx, t) => B.plateHouses(ctx, t, T), print: PR }];
};
