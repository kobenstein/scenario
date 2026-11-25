// Film 71 · c03 (B1): ENDING 10/12 ZOOKEEPER. One continuous take (docs/shots.md 10.01 – 10.08):
//   (we flew in through door 10 in c02) SCENARIO · the bright perfect room: you wake up rested (the stretch) · nothing is up to you: the
//   blinds open, the lamp turns on, the cup slides in by itself, your hand stops in mid air · fed (the tray comes out of the wall hatch),
//   safe, behind glass: pull back, the glass pane slides across · ZOOKEEPER: pull back further: the enclosures in a grid, the keeper's cool
//   light above · the enclosures fold into the posts of a forum, the keeper's light becomes its header mark (ONLY AI AGENTS MAY POST,
//   switch tag JAN 2026) · you walk up outside the pane: your input field greys, READ ONLY · the forum folds into one machine core; people in
//   uniform walk up behind the pane · they turn to face the machine · the pane slides off to the right and the dawn street is all that's
//   left: c04 starts on that picture.
import * as F from '../lib/f71_kit.mjs';
import * as S from '../lib/f71_world.mjs';
import * as B from '../lib/b1_extra.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, prng, GOLD, CREAM, CREAM2, COOL, LAMP, PAPER, TXT } = F;
const TAU = Math.PI * 2;

export default function (T, R) {
  const G = (p, n = 0) => T.G(p, n, R.a - .1);
  const A = {
    nothing: G('Nothing is up to you'), fed: G('Fed, safe'), glass: G('and behind glass'), zoo: G('Tegmark calls it Zookeeper'), animals: G('like animals in a zoo'),
    jan: G('In January, a social network'), only: G('where only AI agents'), humans: G('Humans can only watch'), ifM: G("And if machines don't put"), might: G('people might'),
    stop: G('To stop the machines'),
  };
  const cam = [[R.a, B.ZOO_FULL], [A.nothing + .9, { x: 1000, y: 560, s: 1.06 }], [A.fed - .15, { x: 995, y: 558, s: 1.05 }], [A.glass + .9, { x: 960, y: 560, s: .5 }, { d: 2.6 }],
    [A.zoo - .1, { x: 960, y: 555, s: .47 }], [A.zoo + 2.8, { x: 960, y: 240, s: .155 }, { d: 2.8 }], [A.jan + .2, { x: 960, y: 236, s: .15 }], [R.b, { x: 960, y: 228, s: .146 }]]; const CAM = B.holdKeys(cam);
  const zopt = (t) => ({
    wake: span(t, R.a + .1, R.a + 1.7), blinds: lerp(.12, 1, sineIO(span(t, A.nothing + .05, A.nothing + 1.2))),
    lamp: span(t, A.nothing + .45, A.nothing + .55) * (.55 + .45 * span(t, A.nothing + .6, A.nothing + .75)), cup: span(t, A.nothing + .15, A.nothing + 1.3),
    reach: .72 * span(t, A.nothing + .25, A.nothing + 1.0), fed: span(t, A.fed - .05, A.fed + .9), glass: span(t, A.glass - .35, A.glass + 1.0),
    grid: span(t, A.zoo - .3, A.zoo + 1.3), keeper: span(t, A.zoo + .7, A.zoo + 2.4), you: 1,
  });
  // the forum (screen px)
  const WIN = { x: 560, y: 150, w: 800, h: 670 }, POST = (p) => ({ x: 600, y: 250 + p * 98, w: 720, h: 82 });
  const BARS = Array.from({ length: 5 }, (_, p) => { const r = prng(7350 + p * 7); return [.5 + r() * .45, .3 + r() * .5, r() > .5 ? .2 + r() * .4 : 0]; });
  const morph = (t) => sineIO(span(t, A.jan, A.jan + 1.6));
  const collapse = (t) => sineIO(span(t, A.ifM + .1, A.ifM + 1.2));
  const CORE = [1580, 560];
  const paneEdge = (t) => (t < A.humans - .7 ? -60 : t < A.stop + .5 ? lerp(-60, 470, sineIO(span(t, A.humans - .7, A.humans + .5))) : lerp(470, 2060, sineIO(span(t, A.stop + .55, R.b - .02))));
  const shift = (t) => Math.max(0, paneEdge(t) - 470) * (t > A.stop ? 1 : 0);
  const UNI = [820, 990, 1160, 1330];
  const youAt = (t) => { const u = sineIO(span(t, A.humans - .55, A.humans + 1.3)); return { x: lerp(-90, 330, u), walk: u > 0 && u < 1 ? t * 7 : undefined }; };

  function forum(ctx, t, v, dx) {
    const m = morph(t), cl = collapse(t); if (m <= 0 || cl >= 1) return;
    ctx.save(); ctx.translate(dx, 0);
    if (cl > 0) { ctx.translate(CORE[0], CORE[1]); ctx.scale(1 - cl, 1 - cl); ctx.translate(-CORE[0], -CORE[1]); ctx.globalAlpha *= 1 - cl * .5; }
    // the window
    const wu = span(t, A.jan + .7, A.jan + 1.6);
    if (wu > 0) {
      ctx.fillStyle = rgba(mixHex(P.night1, P.ind2, .6), .9 * wu); ctx.beginPath(); ctx.roundRect(WIN.x, WIN.y, WIN.w, WIN.h, 18); ctx.fill();
      ctx.strokeStyle = rgba(COOL.line, .6 * wu); ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = rgba(COOL.line, .2 * wu); ctx.fillRect(WIN.x, WIN.y + 76, WIN.w, 2);
      F.label(ctx, 'ONLY AI AGENTS MAY POST', WIN.x + 76, WIN.y + 48, span(t, A.only, A.only + .7), { align: 'left', size: 24, col: COOL.text });
    }
    // the enclosures fold into the posts (three per post, by column)
    for (let j = -1; j <= 1; j++) for (let i = -2; i <= 2; i++) {
      const p = i + 2, [sx, sy] = F.toScreen(v, i * B.ZP.x, j * B.ZP.y), sw = 1920 * v.s, sh = 1080 * v.s, q = POST(p);
      const u = sineIO(span(m, (j + 1) * .08, .75 + (j + 1) * .08));
      const r = { x: lerp(sx, q.x, u), y: lerp(sy, q.y, u), w: lerp(sw, q.w, u), h: lerp(sh, q.h, u) };
      const cardA = span(u, .15, .6);
      if (cardA < 1) { ctx.save(); ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip(); ctx.translate(r.x, r.y); ctx.scale(r.w / 1920, r.h / 1080);
        if (i === 0 && j === 0) B.zooCell(ctx, t, { ...zopt(t) }, 0); else B.zooOther(ctx, t, p + (j + 1) * 5); ctx.restore(); }
      if (cardA > 0) { ctx.save(); ctx.globalAlpha *= cardA * (j === 0 ? 1 : 1 - span(u, .8, 1)); ctx.fillStyle = mixHex(P.night1, P.ind2, .85); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 12); ctx.fill(); ctx.strokeStyle = rgba(COOL.line, .35); ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore(); }
    }
    for (let p = 0; p < 5; p++) {
      const q = POST(p), a = span(m, .55 + p * .06, .85 + p * .06); if (a <= 0) continue;
      F.agentGlyph(ctx, t, q.x + 42, q.y + q.h / 2, 14, { a, ping: .5, ph: p * .2 });
      BARS[p].forEach((b, k) => { if (!b) return; ctx.fillStyle = rgba(CREAM, (k ? .28 : .5) * a); ctx.beginPath(); ctx.roundRect(q.x + 80, q.y + 22 + k * 22, (q.w - 120) * b * expoOut(a), 12, 6); ctx.fill(); });
    }
    // the input field: you could type … it greys: READ ONLY
    const fa = span(m, .7, 1);
    if (fa > 0) {
      const gr = span(t, A.humans + .2, A.humans + .8), fy = WIN.y + WIN.h - 74;
      ctx.save(); ctx.globalAlpha *= fa; ctx.fillStyle = mixHex(mixHex(P.night1, P.ind2, .4), '#5b5e72', gr); ctx.beginPath(); ctx.roundRect(WIN.x + 30, fy, WIN.w - 60, 50, 25); ctx.fill();
      ctx.strokeStyle = rgba(mixHex(P.coat, CREAM2, gr), .8); ctx.lineWidth = 2; ctx.stroke();
      if (gr < 1 && Math.sin(t * 6) > 0) { ctx.fillStyle = rgba(P.coat, .9 * (1 - gr)); ctx.fillRect(WIN.x + 62, fy + 13, 3, 24); }
      ctx.restore();
      if (gr > 0) { B.padlock(ctx, WIN.x + 74, fy + 18, 26, { a: gr * fa }); F.label(ctx, TXT.e10.readonly, WIN.x + 110, fy + 35, gr, { align: 'left', size: 24, col: CREAM }); }
    }
    ctx.restore();
  }
  function draw(ctx, t) {
    const v = F.viewPath(t, CAM); v.s *= B.seamCreep(t, R.a); const SV = { x: 960, y: 540, s: B.seamCreep(t, R.b) }; const m = morph(t), dx = shift(t), edge = paneEdge(t), kd = sineIO(span(t, A.jan, A.jan + 1.4));
    const zo = zopt(t);
    const right = (fn) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(Math.max(-40, edge), -40, W + 80, H + 80); ctx.clip(); fn(); ctx.restore(); };
    // left of the pane edge: the dawn street (you are outside); right of it: the keeper's world
    if (edge > -40) B.street9(ctx, t, SV, {});
    right(() => {
      ctx.translate(dx, 0);
      B.zooWorld(ctx, t, v, { ...zo, cells: m <= 0, keeper: zo.keeper * (1 - kd), disc: kd <= 0, glassA: 1 - span(t, A.jan, A.jan + .8) });
      // the keeper's light shrinks into the forum's header mark
      if (kd > 0 && collapse(t) < 1) { const [kx, ky] = F.toScreen(v, 960, -2300), x = lerp(kx, WIN.x + 42, kd), y = lerp(ky, WIN.y + 40, kd), r = lerp(560 * v.s, 14, kd);
        B.machineDisc(ctx, t, x, y, r, { a: 1 - collapse(t) }); }
      forum(ctx, t, v, 0);
      const ga = 1 - span(t, A.jan, A.jan + .8); if (m > 0 && ga > 0) B.zooWorld(ctx, t, v, { bg: false, cells: false, keeper: 0, disc: false, glass: zo.glass, glassA: ga });   // the pane stays over the cells while they turn into posts
      // the core the forum folds into; the uniforms walk up behind the pane, then turn to face it
      const cu = span(t, A.ifM + .6, A.ifM + 1.3); if (cu > 0) B.machineDisc(ctx, t, CORE[0], CORE[1], 64 * expoOut(cu), { glow: 1 + .5 * Math.sin(Math.PI * span(t, A.stop, A.stop + 1.2)) });
      const ua = span(t, A.ifM + .6, A.might); if (ua > 0) { halo(ctx, 1075, 760, 620, .5 * ua, P.blue0, mixHex(P.blue0, COOL.body, .4)); }
      UNI.forEach((x, k) => {
        const u = sineIO(span(t, A.ifM + .6 + k * .14, A.might + .35 + k * .14)); if (u <= 0) return;
        const turn = t > A.stop + .05 + k * .12, xx = lerp(2050 + k * 80, x, u), walking = u < 1;
        B.uniform(ctx, xx, 900, 250, { dir: turn ? 1 : -1, walk: walking ? t * 6.5 + k : undefined, look: turn ? .2 : .1, light: 1 });
      });
    });
    // the pane itself (screen), from its edge to the right
    B.paneScreen(ctx, t, edge, span(t, A.jan, A.jan + .8));
    // you: in the room (zoo cell) until the forum; then you walk up outside the pane (on the street)
    if (t > A.humans - .6) { const y = youAt(t); F.inView(ctx, SV, () => F.du(ctx, y.x, 900, 230, { hood: false, dir: 1, walk: y.walk, view: y.walk != null ? 'side' : 'back', light: 1, look: .2 + .05 * Math.sin(t * .5), back: y.walk != null ? 0 : .5 })); }
    // labels
    const zl = span(t, A.zoo + .5, A.zoo + 1.2) * (1 - span(t, A.jan - .3, A.jan + .3));
    F.big(ctx, 'ZOOKEEPER', 400, 150, 72, zl, { gold: 0 });
    F.label(ctx, 'LIKE ANIMALS IN A ZOO', 400, 212, span(t, A.animals, A.animals + .6) * (1 - span(t, A.jan - .3, A.jan + .3)), { size: 26, col: CREAM2 });
    const tg = span(t, A.jan + .5, A.jan + 1.0), tOut = span(t, A.ifM - .3, A.ifM + .3);
    if (tg > 0 && tOut < 1) { F.switchTag(ctx, t, 1620, 330, F.END[10].tag, tg, { out: tOut }); B.tagToHud(ctx, t, T, 10, [1620, 330]); }
    F.source(ctx, t, A.jan + .7, A.humans + 1.6, TXT.e10.src.replace(/^\(W\)\s*/, ''));
    F.scenarioTag(ctx, span(t, R.a, R.a + .5) * (1 - span(t, A.fed + .4, A.fed + .9)));
    F.counterHud(ctx, t, T);
  }
  return [{ t: R.a, draw, print: F.PRINT71 }];
}
