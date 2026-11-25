// c07 · SUBSCRIBE 1 + PART 4 ONE LAB (builder B2) · 'This channel exists' (planned W: c06's gold machine light → your warm window at the
// same spot) → 'And a lab is an empty' (inner B2 plate: B.plateLab, the disc big with piece 4 just turned paper).
// Carriers: your window → pull back: the town of warm windows · it sinks, piece 4 lifts out of the HUD and grows into the stage · the dashed
// compute outline becomes the lab · 27 streams pool into it · the lab sinks, the CERN ring draws in the ground, the Web grows out of it ★ ·
// the web pulls back in, the ring steps aside, a dashed twin ring (the promise) · it shrinks to the pilot · the small ring grows into the
// clip plate (C3) and shrinks back into a gold dot · the €500 bn dashed circle around it (area to scale) · it contracts onto the disc's rim,
// the name and the pilot fly into piece 4: ON PAPER.
//
// | ID   | anchor (phrase)                  | zeigt wörtlich                                                     | kind  | carrier out               |
// |------|----------------------------------|--------------------------------------------------------------------|-------|---------------------------|
// | M.01 | This channel exists              | your window (warm), pull back: a town of warm windows, every one lit | SCENE | the HUD (piece 4)        |
// | 6.01 | Europe does need enough          | piece 4 lifts out of the HUD: a dashed compute outline · ENOUGH FOR WHAT? | EXPL | the outline           |
// | 6.02 | For one shared lab               | the outline becomes one lab; 27 streams of light flow into it        | EXPL  | the streams               |
// | 6.03★| Europe has done this before      | the lab sinks, a ring in the ground: CERN · 1954; the Web grows out  | EXPL  | the ring                  |
// | 6.04 | It's called CERN                 | a dashed twin ring: A CERN FOR AI + source                           | EXPL  | the small ring            |
// | 6.05 | So far, that promise             | the twin shrinks: €107 MILLION PILOT · CAIRNE: "nothing of the sort" | EXPL  | the ring → plate          |
// | 6.06 | In November, she named           | the small ring grows into the clip plate                             | MIX   | the plate                 |
// | 6.07 | (C3)                             | von der Leyen: "at least 500 billion"                                | CLIP  | the plate → a gold dot    |
// | 6.08 | At least five hundred            | the dot (pilot) in a huge dashed circle (area to scale): €500 BN · AN ESTIMATE, NOT A BUDGET | EXPL | the circle |
// | 6.09 | A name and a pilot               | the circle contracts onto the disc; name + pilot into piece 4: ON PAPER | EXPL | plateLab               |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f69_kit.mjs';
import * as S from '../lib/f69_world.mjs';
import * as X from '../lib/f69_explain.mjs';
import * as B from '../lib/b2_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, prng } = E;
const { GOLD, COOL, CREAM, CREAM2, LAMP, PAPER, SOURCES: SRC } = F;
const PR = F.PRINT69;

export default async (T, R) => {
  const G = (p, n = 0) => T.G(p, n, R.a - .5);
  const A = {
    a: R.a, every: G('goes well for everybody'), wherever: G('Wherever you live'), want: G('Want that too'), sub: G('Then subscribe'),
    lab: G('Europe does need enough'), what: G('Enough for what'), shared: G('For one shared lab'), adv: G('building the most advanced'),
    before: G('Europe has done this before'), war: G('After the war'), pooled: G('pooled their money'), physics: G('one physics lab'), webW: G('The World Wide Web'),
    called: G("It's called CERN"), cernai: G('a CERN for AI'), top: G("Europe's top official"), sofar: G('So far, that promise'), pilot: G('a pilot worth'), hundred: G('a hundred million'),
    nov: G('In November, she named'), least: G('At least five hundred'), est: G('Her estimate'), notb: G('Not a budget'), name: G('A name and a pilot'),
    labp: G('The lab, too, is still'), end: R.b,
  };
  const C3 = T.clip('C3'), tP = R.b - S.SEAM_HALF, D = S.PLATE_DISC;
  const lab = (t, a, b) => span(t, a, a + .7) * (1 - span(t, b - .45, b + .1));

  // ---------------------------------------------------------------- the camera: close on your window → the town → back to the plan (s 1)
  const LAMP0 = [1060, 700];                                            // your lamp (sheet): it sits where c06's gold machine light was
  const VK = [[A.a, { x: LAMP0[0], y: LAMP0[1] - 164 / 1.6, s: 1.6 }], [A.wherever - .2, { x: 1045, y: 600, s: 1.46 }], [A.wherever + 2.4, { x: 960, y: 430, s: .52 }],
    [A.lab - .3, { x: 955, y: 425, s: .5 }], [A.lab + 2.4, { x: 960, y: 540, s: 1 }]];
  const view = (t) => { const v = X.viewPath(t, VK); { const q = Math.sin(Math.PI * span(t, A.a, A.wherever - .2)); v.s *= 1 + .09 * q; v.x -= 40 * q; v.y -= 14 * q; }   // the close-up breathes in from the first frame (no dead start after the W)
    if (t > A.lab + 2.4) { const f = 1 - span(t, tP - 3, tP); v.x += 7 * Math.sin((t - A.lab) * .19) * f; v.y += 4 * Math.sin((t - A.lab) * .15 + 1) * f; } return v; };

  // ---------------------------------------------------------------- M.01 the town of warm windows (sheet units)
  const WIN = (i, j) => ({ x: 760 + i * 520, y: 470 + j * 420, w: 400, h: 300 }), GY = 1230;
  const BLD = [[-5, -4, 3, 'gable'], [-3, -2, 4, 'flat'], [-1, -1, 2, 'dome'], [0, 0, 3, 'gable'], [1, 2, 5, 'tower'], [3, 3, 3, 'gable'], [4, 5, 2, 'flat']];
  function town(ctx, t) {
    for (const [i0, i1, n, roof] of BLD) {
      const x0 = WIN(i0, 0).x - 60, x1 = WIN(i1, 0).x + 400 + 60, top = WIN(0, 2 - n).y - 70;
      ctx.fillStyle = mixHex(P.night0, P.ind1, .5); ctx.fillRect(x0, top, x1 - x0, GY - top);
      ctx.fillStyle = rgba(mixHex(GOLD.line, P.blue1, .55), .3); ctx.fillRect(x0, top, x1 - x0, 4);
      ctx.fillStyle = mixHex(P.night0, P.ind1, .5); ctx.beginPath();
      if (roof === 'gable') { ctx.moveTo(x0 - 40, top + 2); ctx.lineTo((x0 + x1) / 2, top - (x1 - x0) * .3); ctx.lineTo(x1 + 40, top + 2); }
      else if (roof === 'dome') { ctx.ellipse((x0 + x1) / 2, top + 2, (x1 - x0) / 2 - 60, (x1 - x0) * .32, 0, Math.PI, 0); }
      else if (roof === 'tower') { ctx.rect((x0 + x1) / 2 - 160, top - 520, 320, 522); ctx.rect((x0 + x1) / 2 - 18, top - 900, 36, 400); }
      else { ctx.rect(x0 + 120, top - 140, 260, 142); }
      ctx.fill();
      for (let i = i0; i <= i1; i++) for (let j = 1; j > 1 - n; j--) windowAt(ctx, t, i, j);
    }
    ctx.fillStyle = mixHex(P.night0, P.night1, .5); ctx.fillRect(-3000, GY, 9000, 1400);
    X.lightLine(ctx, [[-3000, GY], [5000, GY]], 1, { a: .35, w: 3 });
  }
  const WARM0 = mixHex(LAMP.deep, GOLD.deep, .45), WARM1 = mixHex(mixHex(LAMP.deep, LAMP.body, .4), GOLD.shade, .3);   // the windows' warm lamp light
  function windowAt(ctx, t, i, j) {
    const w = WIN(i, j), you = i === 0 && j === 0, d = Math.hypot(i, j * 1.2);
    const on = you ? 1 : .18 + .82 * sineIO(span(t, A.every - .3 + d * .32, A.every + .5 + d * .32));
    const pulse = you ? 1 + .25 * Math.sin(Math.PI * span(t, A.sub, A.sub + 1.2)) + .12 * span(t, A.want, A.want + .8) : 1;
    ctx.save(); ctx.beginPath(); ctx.rect(w.x, w.y, w.w, w.h); ctx.clip();
    ctx.fillStyle = E.lin(ctx, w.x, w.y, w.x, w.y + w.h, [[0, mixHex(P.night1, WARM0, .12 + .5 * on)], [1, mixHex(P.night1, WARM1, .12 + .62 * on)]]); ctx.fillRect(w.x, w.y, w.w, w.h);
    const r = prng(i * 31 + j * 7 + 99), q = r();
    if (you) {
      const lx = LAMP0[0], ly = LAMP0[1];
      halo(ctx, lx, ly - 40, 380 * pulse * (1 + .04 * Math.sin((t - A.a) * 2.1)), .55 * pulse, LAMP.body, LAMP.core);
      ctx.fillStyle = mixHex(P.night0, P.blue1, .4); ctx.fillRect(lx - 4, ly - 30, 8, 90); ctx.fillRect(lx - 40, ly + 56, 80, 10);
      ctx.fillStyle = mixHex(CREAM, LAMP.body, .4); ctx.beginPath(); ctx.moveTo(lx - 46, ly - 30); ctx.lineTo(lx + 46, ly - 30); ctx.lineTo(lx + 28, ly - 80); ctx.lineTo(lx - 28, ly - 80); ctx.closePath(); ctx.fill();
      E.du(ctx, w.x + 150, w.y + w.h + 120, 330, { dir: 1, light: 1, look: lerp(.15, .9, sineIO(span(t, A.want - .2, A.want + .8))) + .05 * Math.sin(t * .8), armR: [.25, .15] });
    } else if (on > .2) {
      halo(ctx, w.x + w.w * (.3 + q * .4), w.y + w.h * .55, 220, .35 * on, LAMP.body, LAMP.core);
      const n = q > .55 ? 2 : 1;
      for (let k = 0; k < n; k++) E.person(ctx, w.x + w.w * (n === 2 ? .3 + k * .42 : .35 + q * .3), w.y + w.h + 110, 280 + r() * 40, { dir: r() > .5 ? 1 : -1, light: .5, look: .2 * Math.sin(t * .6 + i + k), long: r() > .5 });
    }
    ctx.restore();
    ctx.fillStyle = mixHex(P.night0, P.ind1, .35); ctx.fillRect(w.x - 14, w.y + w.h, w.w + 28, 14);   // the sill
  }

  // ---------------------------------------------------------------- 6.01–6.02 piece 4 lifts out of the HUD; the compute outline → the lab
  const PI4 = 3, ROT = -Math.PI / 2 - F.PIECE_ANG[PI4], HP = F.pieceCentre(PI4, F.HUD.x, F.HUD.y, F.HUD.r), PCB = { x: 960, y: 610, r: 1000 };
  const liftK = (t) => sineIO(span(t, A.lab - .1, A.lab + 1.8)) * (1 - sineIO(span(t, A.before - .4, A.before + 1.2)));
  const lifted = (t) => t >= A.lab - .1 && t < A.before + 1.2;
  const hudParts = (t) => F.kitParts(T, t).parts.map((p, i) => (i === PI4 && lifted(t) ? { ...p, fade: 0 } : p));
  const GL = 690;                                                        // the lab's ground line (screen)
  const SRCS = (() => { const r = prng(27), out = []; for (let i = 0; i < 27; i++) { const q = i / 27 * Math.PI * 2 + r() * .15, rx = 900 + r() * 60, ry = 470 + r() * 40;
    out.push([960 + Math.cos(q) * rx, 470 + Math.sin(q) * ry * (Math.sin(q) > 0 ? .78 : 1), r()]); } return out.map(([x, y, q]) => [clamp(x, 60, 1860), clamp(y, 90, 860), q]); })();
  const RING = (t) => { const k = sineIO(span(t, A.called + .6, A.called + 2.0)); return { x: lerp(960, 560, k), y: 700, rx: lerp(430, 320, k) }; };
  const RING2 = { x: 1360, y: 700 }, DOT = [700, 500], EST_R = 6 * Math.sqrt(500e9 / 107e6);   // pilot dot r 6 → the estimate's circle, area to scale

  function draw(ctx, t) {
    const v = view(t);
    X.sheet(ctx, t, v, { lx: t < A.lab ? LAMP0[0] : D.x, ly: t < A.lab ? LAMP0[1] - 100 : D.y });

    // ---- M.01 the town (sinks away on 'Europe does need enough')
    if (t < A.lab + 1.7) { const dropT = span(t, A.lab - .4, A.lab + 1.7) ** 2.2 * 2600; X.inView(ctx, v, () => { ctx.save(); ctx.translate(0, dropT); town(ctx, t); ctx.restore(); }); }

    // ---- the HUD (piece 4 is out while it is the stage) · 6.09 the HUD flies down into the plan
    const kD = span(t, A.name - .3, A.name + 1.3);
    if (t < A.name - .3) B.hudDisc(ctx, t, T, 0, D, { parts: hudParts(t) });
    else if (kD < 1) B.hudDisc(ctx, t, T, kD, D);
    else { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.kitDisc(ctx, t, D.x, D.y, D.r, S.momentParts(T, t), { glow: .8, stars: 0, loose: { x: D.x + D.r * 1.32, y: D.y + D.r * 1.06, rot: .35 } }); ctx.restore(); }

    // ---- 6.01 piece 4 lifted big (rotated so its arc is up): the stage of 'enough computers'
    const lk = liftK(t);
    if (lifted(t)) { const x = lerp(HP[0], PCB.x, lk), y = lerp(HP[1], PCB.y, lk), r = Math.exp(lerp(Math.log(F.HUD.r), Math.log(PCB.r), lk));
      F.loosePiece(ctx, t, PI4, x, y, r, { kind: 'blank', lit: 1, rot: ROT * lk }); }
    const ou = span(t, A.lab + 1.0, A.lab + 2.0), mo = sineIO(span(t, A.shared - .2, A.shared + 1.1));
    if (ou > 0 && mo < 1) {   // a dashed outline of compute (no racks): a block of cells, dashed = not there yet
      const w = lerp(460, 440, mo), h = lerp(230, 140, mo), x = 960 - w / 2, y = lerp(GL - 300, GL - h, mo);
      ctx.save(); ctx.setLineDash([14, 10]); ctx.lineDashOffset = -t * 12; ctx.strokeStyle = rgba(COOL.line, .85 * ou); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(x, y, w * ou, h, 10); ctx.stroke();
      ctx.setLineDash([]); ctx.strokeStyle = rgba(COOL.line, .22 * ou * (1 - mo)); ctx.lineWidth = 1.5;
      for (let i = 1; i < 8; i++) { ctx.beginPath(); ctx.moveTo(x + i * w / 8, y + 8); ctx.lineTo(x + i * w / 8, y + h - 8); ctx.stroke(); } for (let j = 1; j < 4; j++) { ctx.beginPath(); ctx.moveTo(x + 8, y + j * h / 4); ctx.lineTo(x + w * ou - 8, y + j * h / 4); ctx.stroke(); }
      ctx.restore();
    }
    X.label(ctx, 'ENOUGH COMPUTERS OF ITS OWN', 960, 250, lab(t, A.lab + 1.2, A.what - .1), { size: 30 });
    X.big(ctx, 'ENOUGH FOR WHAT?', 960, 300, 72, lab(t, A.what + .2, A.shared + .2), { gold: .3 });

    // ---- 6.02 one shared lab, 27 streams pool into it
    const gl = span(t, A.shared - .2, A.shared + .8) * (1 - span(t, A.called + .2, A.called + 1.4));
    if (gl > 0) { X.lightLine(ctx, [[960, GL], [960 - 760, GL]], gl, { a: .45, w: 2.5 }); X.lightLine(ctx, [[960, GL], [960 + 760, GL]], gl, { a: .45, w: 2.5 }); }
    const lr = span(t, A.shared - .1, A.shared + 1.2), ls = span(t, A.before + .1, A.before + 1.5);
    if (lr > 0 && ls < 1) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, GL + 1); ctx.clip(); B.labBuilding(ctx, t, 960, GL + expoIn(ls) * 260, 460, { rise: lr, lit: .25 * span(t, A.shared + 1.5, A.shared + 3) }); ctx.restore(); }
    X.label(ctx, 'ONE SHARED LAB', 960, 250, lab(t, A.shared + .2, A.before), { size: 36, spacing: .14 });
    X.label(ctx, 'FOR THE MOST ADVANCED AI', 960, 304, lab(t, A.adv, A.before), { size: 28, col: CREAM2 });
    const su = span(t, A.shared + .3, A.shared + 1.6), go = sineIO(span(t, A.pooled - .2, A.pooled + 1.8));
    if (su > 0 && go < 1) {
      const toRing = sineIO(span(t, A.before + .4, A.war + .6)), rg = RING(t);
      SRCS.forEach(([sx, sy, q], i) => {
        const ang = Math.PI * (1.05 + .9 * (i / 26)), tgt = B.lerpPt([960 + (q - .5) * 60, GL - 40], [rg.x + Math.cos(ang) * rg.rx, rg.y + Math.sin(ang) * rg.rx * .28], toRing);
        const s0 = B.arcPt([sx, sy], tgt, 90 * (q - .3), go), a = clamp(su * 1.6 - q * .6);
        if (a <= 0) return;
        const pts = []; for (let k = 0; k <= 12; k++) pts.push(B.arcPt(s0, tgt, 90 * (q - .3) * (1 - go), k / 12));
        X.lightLine(ctx, pts, a, { col: rgba(LAMP.body, .22), w: 1.6, blur: 4 });
        for (let k = 0; k < 3; k++) { const [bx, by] = B.along(pts, ((t * .5 + q + k / 3) % 1) * B.polyLen(pts) * a); halo(ctx, bx, by, 10, .5 * a, GOLD.halo, GOLD.core); }
        halo(ctx, s0[0], s0[1], 26, .7 * a, LAMP.body, LAMP.core); ctx.fillStyle = LAMP.core; ctx.beginPath(); ctx.arc(s0[0], s0[1], 4.5, 0, Math.PI * 2); ctx.fill();
      });
    }

    // ---- 6.03 ★ the ring in the ground: CERN · 1954, the Web grows out of it
    const wu = sineIO(span(t, A.webW + .3, A.webW + 2.8)) * (1 - sineIO(span(t, A.called + .2, A.called + 1.8)));
    if (wu > 0) { B.web(ctx, t, 960, 590, wu, { a: .9 }); X.lightLine(ctx, [[960, 615], [960, 590]], span(t, A.webW, A.webW + .4), { w: 2 }); }
    const rg = RING(t), r1 = span(t, A.war - .1, A.war + 1.6) * (1 - span(t, A.nov + .1, A.nov + 1.1));
    if (r1 > 0) B.ring(ctx, t, rg.x, rg.y, rg.rx, r1, { glow: span(t, A.physics - .3, A.physics + .8), run: span(t, A.physics, A.physics + 1), w: 4 });
    X.label(ctx, SRC.cern, rg.x, 560, lab(t, A.physics - .1, A.nov + .6), { size: 32, gold: .7, col: GOLD.text });
    X.big(ctx, SRC.web, 960, 230, 64, lab(t, A.webW + .3, A.called + .6), { gold: .4 });
    // ---- 6.04 the promise: a dashed twin ring · 6.05 it shrinks to the pilot
    const r2 = sineIO(span(t, A.top - .1, A.cernai + .6)), sh = sineIO(span(t, A.pilot - .3, A.pilot + 1.2)), r2x = lerp(320, 40, sh);
    const plateM = sineIO(span(t, A.nov + .6, C3.start - .05)), back = sineIO(span(t, C3.end - .1, C3.end + 1.2));
    if (r2 > 0 && plateM <= 0) B.ring(ctx, t, RING2.x, RING2.y, r2x, r2, { col: rgba(CREAM, .9), dash: [12, 9], w: 3, ry: r2x * .3 });
    X.big(ctx, SRC.cernForAi, RING2.x, 520, 56, lab(t, A.cernai, A.sofar + .2), { gold: .1 });
    F.source(ctx, t, A.cernai + .2, A.sofar + .4, SRC.cernForAiSrc);
    X.label(ctx, SRC.pilot, RING2.x, 620, lab(t, A.pilot + .4, A.nov + .7), { size: 32, gold: .4 });
    F.source(ctx, t, A.pilot + .4, A.hundred + 1.1, SRC.pilotSrc);
    F.source(ctx, t, A.hundred + 1.2, A.nov + 1.4, SRC.cairne);
    // ---- 6.06–6.07 the small ring grows into the clip plate (C3), then the plate shrinks into a gold dot (the pilot)
    if (plateM > 0 && back < 1) {
      const m = t < C3.end ? plateM : 1 - back, from = t < C3.end ? [RING2.x, RING2.y, 40] : [DOT[0], DOT[1], 6];
      F.clipPlate(ctx, t, T, 'C3', { from, morph: m, dark: 1 - span(t, C3.start - .35, C3.start + .1) + (t > C3.end ? span(t, C3.end - .05, C3.end + .4) : 0) });
    }
    // ---- 6.08 the €500 bn estimate: a dashed circle around the pilot dot (area to scale)
    const dotU = back >= 1 ? 1 : 0, eu = span(t, A.least - .1, A.least + 1.8), cK = sineIO(span(t, A.name - .3, A.name + 1.3)), fly = sineIO(span(t, A.name + .5, A.name + 1.7));
    const P4 = F.pieceCentre(PI4, D.x, D.y, D.r);
    if (back > .8 && fly < 1) {
      const p = B.lerpPt(DOT, P4, fly);
      halo(ctx, p[0], p[1], 40, .7, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(p[0], p[1], 6 * lerp(1, .6, fly), 0, Math.PI * 2); ctx.fill();
    }
    const ew = 1 - span(t, A.name + 1.3, A.name + 1.9);
    if (eu > 0 && ew > 0) {
      const cx = lerp(DOT[0], D.x, cK), cy = lerp(DOT[1], D.y, cK), r = lerp(EST_R, D.r + 4, cK), pts = B.ringPts(cx, cy, r, r, 120, -Math.PI / 2);
      X.lightLine(ctx, pts, eu, { col: rgba(CREAM, .85), w: 3 * ew, dash: [16, 12], blur: 8 });
    }
    X.big(ctx, SRC.b500, 1110, 450, 58, lab(t, A.least, A.name), { gold: .3, align: 'left' });
    X.label(ctx, SRC.b500Tag, 1110, 512, lab(t, A.est - .1, A.name), { size: 28, align: 'left', col: CREAM });
    X.label(ctx, SRC.pilot, DOT[0], DOT[1] + 46, lab(t, A.least + 1.2, A.name + .3) * dotU, { size: 22, col: CREAM2 });
    F.source(ctx, t, A.least + .3, A.name + .4, SRC.b500Src);
    // ---- 6.09 a name and a pilot fly into piece 4 → ON PAPER
    const nm = lab(t, A.name - .1, A.name + 1.7), np = B.lerpPt([DOT[0], DOT[1] - 40], P4, fly);
    if (fly < 1) X.label(ctx, SRC.cernForAi, np[0], np[1], nm, { size: lerp(26, 16, fly), col: CREAM });
    const vu = span(t, A.labp + .3, A.labp + 1.1) * (1 - span(t, tP - 1.0, tP - .3));
    if (vu > 0) F.verdict(ctx, t, D.x, D.y + D.r + 86, F.KIT.parts[PI4].verdict, vu, { size: 32 });
  }

  const marks = [A.every, A.wherever, A.lab, A.shared, A.before, A.webW, A.called, A.sofar, A.nov, C3.start, C3.end, A.least, A.name];
  return [{ t: R.a, draw, print: PR }, ...marks.map((t) => ({ t, draw, print: PR })), { t: tP, draw: (ctx, t) => B.plateLab(ctx, t, T), print: PR }];
};
