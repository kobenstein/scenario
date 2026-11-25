// Film 68 · ROUND 1 THE MACHINES + ROUND 2 THE CHIPS (r1a–r1g, C1, r2a–r2f). Numbers: faktencheck.md K15–K33 + ampel-zweitpruefer.md.
import * as K from '../lib/f68_kit.mjs';
const { W, H, P, clamp, lerp, span, sineIO, expoOut, rise, halo, rgba, mixHex, TAU, US, CN, EU, AI, GOLD, CREAM, MUTED } = K;

export default {
  // ---------------------------------------------------------------- r1a round 1: America leads, but not by a generation
  r1a(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 300, ga: .28 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1, z1: 1.04, fy: 500 });
    K.roundTitle(ctx, t, 0, IN(.8), 170);
    K.cap(ctx, 'THE BEST AI MODELS', 960, 300, U('the machines', .7, -.1), { size: 30, align: 'center', col: MUTED });
    const lu = U('America leads', 1.0, -.3);
    K.bar(ctx, 560, 470, 860, lu, US, { th: 56, label: 'AMERICA', lsize: 30 });
    K.bar(ctx, 560, 600, 790, U('America leads', 1.0, -.1), CN, { th: 56, label: 'CHINA', lsize: 30 });
    const ng = U('not by a generation', .8, -.2);
    if (ng > 0) { K.bracket(ctx, 1350, 1420, 400, ng, ''); K.tag(ctx, 'MONTHS, NOT A GENERATION', 1385, 780, ng, { size: 28, col: GOLD.text }); K.lightLine(ctx, [[1385, 740], [1385, 640]], 0, ng, GOLD, { w: 1.5, arrow: true }); }
    K.src(ctx, t, S.a + 1.5, S.b + 1, 'Epoch AI Capabilities Index · CAISI / NIST (2026)');
    ctx.restore();
  },
  // ---------------------------------------------------------------- r1b May → November: six months; free to download
  r1b(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 1200, gy: 500, ga: .25 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.02, z1: 1, fx: 1100, fy: 520 });
    const X = (m) => 300 + m * 190, Y0 = 800, f = (m) => Y0 - 60 - Math.pow(Math.max(0, m), 1.25) * 52;   // m = months from Jan 2026
    // axis
    K.lightLine(ctx, [[X(0), Y0], [X(7.4), Y0]], 0, expoOut(IN(.9)), { body: P.blue1, line: mixHex(P.blue1, CREAM, .3) }, { w: 2.5 });
    for (const [m, lab] of [[0, 'JAN'], [2, 'MAR'], [4, 'MAY'], [6, 'JUL']]) K.cap(ctx, lab, X(m), Y0 + 48, IN(.8), { size: 24, align: 'center', col: lab === 'MAY' ? US.text : MUTED });
    const usF = (x) => f((x - 300) / 190);
    const uc = IN(1.6, .1);
    K.lightLine(ctx, K.curvePts(usF, X(0), X(7.2)), 0, uc, US, { w: 4, head: true });
    // China's curve: the same shape, six months later (drawn on a second axis segment that slides in)
    const sh = sineIO(U("China's best can do", 1.4, -.2));
    const cnPts = K.curvePts(usF, X(0), X(7.2)).map(([x, y]) => [x + lerp(0, 6 * 190 * .5, sh), y]).filter(([x]) => x <= X(7.4));
    K.lightLine(ctx, cnPts, 0, uc, CN, { w: 4, head: true });
    // the level reached in May, reached by China half a year later
    const mu = U('could do in May', .8, -.3), yM = usF(X(4));
    if (mu > 0) { K.halo(ctx, X(4), yM, 40, .6 * mu, US.line, '#fff'); ctx.save(); ctx.globalAlpha *= mu; ctx.setLineDash([8, 8]); ctx.strokeStyle = rgba(CREAM, .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(4), yM); ctx.lineTo(X(4) + 6 * 190 * .5 * expoOut(sh), yM); ctx.stroke(); ctx.beginPath(); ctx.moveTo(X(4), yM); ctx.lineTo(X(4), Y0); ctx.stroke(); ctx.restore(); }
    if (sh > .7) { const xN = X(4) + 6 * 190 * .5; K.halo(ctx, xN, yM, 40, .6, CN.line, '#fff'); K.cap(ctx, 'NOV', xN, Y0 + 48, span(sh, .7, 1), { size: 24, align: 'center', col: CN.text });
      K.bracket(ctx, X(4), xN, yM - 60, span(sh, .7, 1), ''); K.cap(ctx, '~6 MONTHS BEHIND', (X(4) + xN) / 2, yM - 84, span(sh, .75, 1), { size: 30, align: 'center', col: GOLD.text }); }
    K.cap(ctx, 'AMERICA', X(7.2) + 20, usF(X(7.2)) + 8, uc, { size: 24, col: US.text });
    // free to download
    const fd = U('free to download', 1.0, -.4);
    if (fd > 0) { for (let i = 0; i < 3; i++) { const e = span(fd, i * .15, i * .15 + .6), x = 640 + i * 110, y = 400 + ((t * 120 + i * 60) % 120); ctx.save(); ctx.globalAlpha *= e * (1 - ((t * 120 + i * 60) % 120) / 140); K.lightLine(ctx, [[x, y], [x, y + 50]], 0, 1, CN, { w: 3, arrow: true }); ctx.restore(); }
      K.tag(ctx, 'CHINESE MODELS: OPEN WEIGHTS · FREE TO DOWNLOAD', 750, 340, fd, { size: 24, col: CN.text }); }
    K.src(ctx, t, S.a + 1.5, S.b + 1, 'Epoch AI (~6–7 months, Nov 2026) · CAISI / NIST (~8 months, May 2026) · schematic');
    ctx.restore();
  },
  // ---------------------------------------------------------------- r1c this man used to run Google
  r1c(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 540, ga: .3 });
    const u = IN(.7), out = span(t, T.clip('C1').start - .6, T.clip('C1').start);
    ctx.save(); ctx.globalAlpha *= 1 - out;
    K.serif(ctx, 'Eric Schmidt', 960, 540, 110, u, { align: 'center' });
    K.cap(ctx, 'CEO OF GOOGLE, 2001–2011', 960, 620, IN(.7, .3), { size: 30, align: 'center', col: GOLD.text });
    ctx.restore();
  },
  C1: K.clipShot('C1'),
  // ---------------------------------------------------------------- r1d other trackers; long tasks by itself
  r1d(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 400, ga: .25 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1, z1: 1.03, fy: 500 });
    const lt = sineIO(U('According to', 1.0, -.1));
    const c1 = IN(.8), c2 = U('much the same', .8, -.3);
    ctx.save(); ctx.translate(0, -lt * 120); ctx.globalAlpha *= 1 - .55 * lt;
    K.dataCard(ctx, t, 380, 260, 540, { u: c1, kind: 'ESTIMATE', title: 'EPOCH AI', big: '~7 months', small: 'US lead, average since 2023' });
    K.dataCard(ctx, t, 1000, 260, 540, { u: c2, kind: 'ESTIMATE', title: 'US GOVERNMENT TESTERS (CAISI)', big: '~8 months', small: 'May 2026' });
    ctx.restore();
    const bu = U('long tasks', 1.0, -.6);
    if (bu > 0) {
      K.cap(ctx, 'LONG SOFTWARE-AGENT TASKS (CAISI TEST)', 960, 600, bu, { size: 28, align: 'center', col: CREAM });
      K.bar(ctx, 620, 690, 900 * .78, bu, US, { th: 50, label: 'BEST US MODEL', value: '78 %' });
      K.bar(ctx, 620, 790, 900 * .44, U('long tasks', 1.0, -.4), CN, { th: 50, label: 'DEEPSEEK V4 PRO', value: '44 %' });
      K.cap(ctx, 'WIDEST GAP HERE', 960, 520, U('by itself', .7, -.2), { size: 30, align: 'center', col: GOLD.text });
    }
    K.src(ctx, t, S.a + 2, S.b + 1, 'CAISI / NIST, Evaluation of DeepSeek V4 Pro, May 2026 · Epoch AI');
    ctx.restore();
  },
  // ---------------------------------------------------------------- r1e the lab's own numbers; coding tests: close
  r1e(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 400, ga: .25 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.02, z1: 1, fy: 500 });
    const sw = sineIO(U('coding tests', 1.0, -.4));
    ctx.save(); ctx.translate(0, -sw * 330); ctx.globalAlpha *= 1 - .6 * sw;
    K.cap(ctx, 'LONG SOFTWARE-AGENT TASKS (CAISI TEST)', 960, 330, 1, { size: 26, align: 'center', col: MUTED });
    K.bar(ctx, 620, 420, 900 * .78, 1, US, { th: 46, label: 'BEST US MODEL', value: '78 %' });
    K.bar(ctx, 620, 510, 900 * .44, 1, CN, { th: 46, label: 'DEEPSEEK V4 PRO' });
    const ow = U('own numbers', 1.0, -.2);
    if (ow > 0) { ctx.save(); ctx.globalAlpha *= ow; ctx.setLineDash([10, 8]); ctx.strokeStyle = CN.line; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(620 + 900 * .44, 487, 900 * .22 * expoOut(ow), 46, 8); ctx.stroke(); ctx.restore();
      K.cap(ctx, "DEEPSEEK'S OWN SCORES ARE HIGHER", 1200, 590, ow, { size: 26, align: 'center', col: CN.text }); }
    ctx.restore();
    if (sw > 0) {
      K.cap(ctx, 'COMMON CODING TEST · SWE-BENCH VERIFIED (CAISI)', 960, 560, sw, { size: 28, align: 'center' });
      K.bar(ctx, 620, 660, 900 * .81, U('coding tests', 1.0, 0), US, { th: 50, label: 'BEST US MODEL', value: '81 %' });
      K.bar(ctx, 620, 760, 900 * .74, U('coding tests', 1.0, .2), CN, { th: 50, label: 'DEEPSEEK V4 PRO', value: '74 %' });
      K.tag(ctx, 'CLOSE', 1500, 880, U('are close', .7, -.1), { size: 30, col: GOLD.text });
    }
    K.src(ctx, t, S.a + 1, S.b + 1, 'CAISI / NIST, May 2026 · DeepSeek technical report');
    ctx.restore();
  },
  r1f: K.pointShot(0),
  // ---------------------------------------------------------------- r1g a model can be copied; the chips are another story
  r1g(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 500, ga: .25 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1, z1: 1.04, fy: 500 });
    const cp = U('can be copied', 1.4, -.3);
    for (let i = 4; i >= 0; i--) { const e = i === 0 ? IN(.6) : sineIO(span(cp, (i - 1) * .15, (i - 1) * .15 + .5)); if (e <= 0) continue; K.modelCard(ctx, t, 560 + i * 70 * e, 470 - i * 18 * e, 190, { col: CN, label: i === 0 ? 'AI MODEL' : 'COPY', rot: -.04 + i * .02 * e, a: i === 0 ? 1 : .55 + .45 * e }); }
    K.cap(ctx, 'A MODEL CAN BE COPIED', 700, 760, cp, { size: 30, align: 'center' });
    const ch = U('The chips', 1.0, -.2);
    if (ch > 0) { K.chip(ctx, t, 1350, 470 + (1 - expoOut(ch)) * 60, 230, { a: ch }); K.cap(ctx, 'THE CHIPS: ANOTHER STORY', 1350, 760, U('another story', .7, -.3), { size: 30, align: 'center', col: GOLD.text }); }
    ctx.restore();
  },
  // ---------------------------------------------------------------- r2a round 2: AI runs on chips; it isn't close
  r2a(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 540, ga: .3 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.05, z1: 1, fy: 540 });
    K.roundTitle(ctx, t, 1, IN(.8), 170);
    K.chip(ctx, t, 960, 560, 300 * expoOut(IN(.9)), { a: IN(.6) });
    K.tag(ctx, "ISN'T CLOSE", 960, 880, U("isn't close", .7, -.1), { size: 34, col: GOLD.text });
    ctx.restore();
  },
  // ---------------------------------------------------------------- r2b compute delivered: 72 / ~10 / ~5; Europe: a lane without a runner
  r2b(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 600, gy: 500, ga: .25 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1, z1: 1.03, fx: 800, fy: 540 });
    K.cap(ctx, 'AI COMPUTING POWER DELIVERED WORLDWIDE, 2022 – JUN 2026', 960, 190, IN(.8), { size: 30, align: 'center', col: CREAM });
    const lanes = [{ col: US, label: 'AMERICA' }, { col: CN, label: 'CHINA', a: 1 }, { col: EU, label: 'EUROPE', a: U('Europe', .6, -.1) }];
    K.track(ctx, t, { x0: 360, x1: 1760, y0: 380, pitch: 190, u: IN(.8), lanes });
    const L = 1300;
    K.bar(ctx, 380, 380, L * .72, U('seven tenths', 1.0, -.3), US, { th: 70, value: '72 %', vsize: 54 });
    K.bar(ctx, 380, 570, L * .10, U('small slice', 1.0, -.4), CN, { th: 70, value: '~10 %', vsize: 54 });
    K.bar(ctx, 380, 760, L * .05, U('even less', 1.0, -.4), EU, { th: 70, value: '~5 %', vsize: 54 });
    const nr = U('no runner', .8, -.3);
    if (nr > 0) { ctx.save(); ctx.globalAlpha *= nr * .8; ctx.setLineDash([8, 8]); ctx.strokeStyle = EU.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(1100, 760, 40, 62, 0, 0, TAU); ctx.stroke(); ctx.restore(); K.cap(ctx, 'NO RUNNER', 1160, 770, nr, { size: 26, col: EU.text }); }
    K.src(ctx, t, S.a + 2, S.b + 1, 'Epoch AI chip imports explorer (Oct 2026) · Europe: Dealroom after Epoch · share of H100-equivalents');
    ctx.restore();
  },
  // ---------------------------------------------------------------- r2c Huawei ships under 4 % of Nvidia's computing power
  r2c(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 500, ga: .25 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.03, z1: 1, fy: 520 });
    K.cap(ctx, 'AI COMPUTING POWER SHIPPED IN 2026', 960, 170, IN(.8), { size: 30, align: 'center' });
    const a = U("America's leading chipmaker", 1.6, -.6), c = U("China's own chip champion", 1.0, -.1);
    K.dots(ctx, t, 260, 330, 260, 20, 26, 9, a, () => US);
    K.cap(ctx, "AMERICA'S LEADING CHIPMAKER", 507, 720, a, { size: 26, align: 'center', col: US.text });
    K.dots(ctx, t, 1300, 330, 10, 5, 26, 9, c, () => CN);
    K.cap(ctx, "CHINA'S CHIP CHAMPION", 1352, 720, c, { size: 26, align: 'center', col: CN.text });
    const fp = U('few percent', .8, -.1); if (fp > 0) K.big(ctx, 'UNDER 4 %', 1352, 560, 90, fp);
    K.src(ctx, t, S.a + 1.5, S.b + 1, 'Epoch AI, Huawei roadmap (Sept 2026): 0.88 M vs ~23 M H100-equivalents · 1 dot ≈ 90,000');
    ctx.restore();
  },
  // ---------------------------------------------------------------- r2d the ban; an older generation case by case
  r2d(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 540, ga: .25 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1, z1: 1.03, fy: 540 });
    const bu = IN(.9);
    K.lightLine(ctx, [[1100, 220], [1100, 900]], 0, bu, { body: MUTED, line: CREAM }, { w: 2, dash: [3, 4] });
    K.cap(ctx, 'AMERICA', 600, 220, bu, { size: 32, align: 'center', col: US.text }); K.cap(ctx, 'CHINA', 1500, 220, bu, { size: 32, align: 'center', col: CN.text });
    // the best chip runs into the barrier
    const bc = U('very best chips', 1.2, -.6), xb = lerp(500, 990, sineIO(bc)), hit = span(bc, .95, 1);
    K.chip(ctx, t, xb + Math.sin(t * 40) * 4 * hit * (1 - span(t, S.t0 + 3, S.t0 + 3.4)), 430, 170, { a: IN(.6) });
    K.cap(ctx, 'THE VERY BEST CHIPS', 600, 600, IN(.7, .2), { size: 24, align: 'center', col: GOLD.text });
    if (bc > .6) { const k = span(bc, .6, 1); ctx.save(); ctx.globalAlpha *= k; ctx.fillStyle = K.lin(ctx, 1080, 0, 1120, 0, [[0, US.deep], [1, US.line]]); ctx.fillRect(1086, 300 + (1 - expoOut(k)) * -100, 28, 260); ctx.restore(); K.tag(ctx, 'BANNED', 1100, 280, k, { size: 26, col: US.text }); }
    // an older generation: through a narrow gate, case by case
    const og = U('older generation', 1.0, -.2), cb = U('case by case', 2.0, -.4);
    if (og > 0) { ctx.save(); ctx.globalAlpha *= og; ctx.fillStyle = US.deep; ctx.fillRect(1086, 640, 28, 60); ctx.fillRect(1086, 800, 28, 60); ctx.restore();
      const xs = lerp(560, 1480, sineIO(cb)); K.chip(ctx, t, xs, 750, 90, { a: og, col: { body: mixHex(GOLD.body, MUTED, .5), line: MUTED, deep: P.blue1, halo: MUTED, core: CREAM } });
      K.cap(ctx, 'AN OLDER GENERATION', 600, 860, og, { size: 24, align: 'center', col: MUTED }); K.tag(ctx, 'CASE BY CASE', 1100, 900, cb, { size: 24 }); }
    K.src(ctx, t, S.a + 2, S.b + 1, 'US Commerce Dept. (BIS), Jan 2026: H200 exports reviewed case by case');
    ctx.restore();
  },
  // ---------------------------------------------------------------- r2e ~600,000 sat in Hong Kong: held up by Beijing
  r2e(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 1300, gy: 540, ga: .25 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.03, z1: 1, fx: 1200, fy: 540 });
    const hk = IN(.9);
    K.cap(ctx, 'BY ONE REPORT', 1300, 210, U('by one report', .7, -.1), { size: 24, align: 'center', col: MUTED });
    K.cap(ctx, 'HONG KONG', 1300, 270, hk, { size: 40, align: 'center', col: CREAM, glow: true });
    const pile = U('six hundred thousand', 1.6, -.4);
    ctx.save(); ctx.globalAlpha *= hk; ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 2; ctx.strokeRect(1060, 310, 480, 330); ctx.restore();
    K.dots(ctx, t, 1085, 335, 200, 20, 23, 7, pile, () => GOLD);
    if (pile > 0) K.counter(ctx, t, 1300, 730, 90, 0, 600000, pile, (v) => '~' + (Math.round(v / 1000) * 1000).toLocaleString('en-US'), { col: GOLD.text });
    K.cap(ctx, 'CHIPS WAITING', 1300, 790, pile, { size: 26, align: 'center', col: GOLD.text });
    // the two barriers
    const nw = U('Not held up by Washington', .8, -.1), bj = U('Held up by Beijing', .8, -.1);
    if (nw > 0) { ctx.save(); ctx.globalAlpha *= nw; ctx.strokeStyle = US.line; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(700, 470); ctx.lineTo(700 + Math.cos(-1.3 * nw) * 220, 470 + Math.sin(-1.3 * nw) * 220); ctx.stroke(); ctx.restore(); K.cap(ctx, 'WASHINGTON: OPEN', 700, 560, nw, { size: 26, align: 'center', col: US.text }); }
    if (bj > 0) { ctx.save(); ctx.globalAlpha *= bj; ctx.fillStyle = CN.body; ctx.fillRect(1600, 310 + 330 * (1 - expoOut(bj)) * 0, 26, 330 * expoOut(bj)); ctx.restore(); K.tag(ctx, 'HELD UP BY BEIJING', 1613, 900, bj, { size: 26, col: CN.text }); }
    K.src(ctx, t, S.a + 2, S.b + 1, 'Reuters, 5 Nov 2026 (two sources)');
    ctx.restore();
  },
  r2f: K.pointShot(1),
};
