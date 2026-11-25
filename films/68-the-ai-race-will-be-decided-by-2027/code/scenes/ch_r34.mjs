// Film 68 · ROUND 3 POWER + ROUND 4 BUILDERS AND BODIES + the level board (r3a–r3f, r4a–r4f). Numbers: faktencheck.md K34–K47,
// ampel-zweitpruefer.md (Ember 2025: 10,573 vs 4,536 TWh; robots: Tiangong Ultra 9.39 s; the stretcher robot is not named).
import * as K from '../lib/f68_kit.mjs';
const { W, H, P, clamp, lerp, span, sineIO, expoOut, rise, halo, rgba, mixHex, TAU, US, CN, EU, AI, GOLD, CREAM, MUTED } = K;
const ROBO = { body: '#9fb3c8', line: '#d6e6f2', deep: '#3c4c63', text: '#d6e6f2' };

function townHall(ctx, t, x, y, u) {
  if (u <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(u * 2);
  ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.fillRect(x - 230, y - 260, 460, 260); ctx.beginPath(); ctx.moveTo(x - 260, y - 260); ctx.lineTo(x, y - 380); ctx.lineTo(x + 260, y - 260); ctx.closePath(); ctx.fill();
  for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) { ctx.fillStyle = rgba(GOLD.hot, .55 + .2 * Math.sin(t * .7 + i + j)); ctx.fillRect(x - 200 + i * 70, y - 220 + j * 100, 34, 60); }
  ctx.restore();
}

export default {
  // ---------------------------------------------------------------- r3a round 3: a chip can be banned, electricity can't
  r3a(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 540, ga: .28 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1, z1: 1.04, fy: 540 });
    K.roundTitle(ctx, t, 2, IN(.8), 170);
    K.cap(ctx, 'SO HOW IS IT A TIE?', 960, 300, IN(.7, .2) * (1 - U('Because', .4)), { size: 34, align: 'center' });
    const cb = U('can be banned', .8, -.3);
    K.chip(ctx, t, 660, 560, 200, { a: U('a chip', .7, -.2) });
    if (cb > 0) { ctx.save(); ctx.globalAlpha *= cb; ctx.fillStyle = US.body; ctx.translate(660, 560); ctx.rotate(-.7); ctx.fillRect(-170 * expoOut(cb), -14, 340 * expoOut(cb), 28); ctx.restore(); K.tag(ctx, 'CAN BE BANNED', 660, 790, cb, { size: 26, col: US.text }); }
    const el = U("Electricity can't", 1.2, -.3);
    if (el > 0) { const pts = K.curvePts((x) => 560 + Math.sin((x - 900) / 120) * 40, 900, 1760); K.lightLine(ctx, pts, 0, sineIO(el), GOLD, { w: 6, head: true }); K.bolt(ctx, 1300, 560, 160, el); K.tag(ctx, "ELECTRICITY CAN'T", 1320, 790, el, { size: 26, col: GOLD.text }); }
    ctx.restore();
  },
  // ---------------------------------------------------------------- r3b chips need power; towns fight in America; in China they get built
  r3b(ctx, t, S, T) {
    const { U, IN, G } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 560, ga: .25, stars: 120 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.04, z1: 1, fy: 600 });
    const split = sineIO(U('And in America', 1.0, -.2));
    // 1: chip → cable → data center (centre), then it slides up and shrinks as the two sides open
    ctx.save(); ctx.translate(960, lerp(560, 210, split)); ctx.scale(lerp(1, .55, split), lerp(1, .55, split));
    K.chip(ctx, t, -260, 0, 140, { a: IN(.6) });
    K.lightLine(ctx, [[-180, 0], [140, 0]], 0, IN(1.2, .3), GOLD, { w: 5, head: true });
    K.icon(ctx, 'datacenter', 260, 0, 200, IN(.8, .6), { col: { body: mixHex(P.blue1, CREAM, .2), line: CREAM, deep: P.night1 } });
    K.cap(ctx, 'EVERY CHIP NEEDS POWER', 0, 170, IN(.8, .2) * (1 - split), { size: 32, align: 'center', col: GOLD.text });
    ctx.restore();
    if (split > 0) {
      ctx.save(); ctx.globalAlpha *= split; ctx.strokeStyle = rgba(CREAM, .2); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(960, 360); ctx.lineTo(960, 960); ctx.stroke(); ctx.restore();
      K.cap(ctx, 'AMERICA', 480, 400, split, { size: 32, align: 'center', col: US.text }); K.cap(ctx, 'CHINA', 1440, 400, split, { size: 32, align: 'center', col: CN.text });
      // America: a town hall at night, people with raised hands and signs
      townHall(ctx, t, 480, 830, split);
      const pu = U('towns are fighting', 1.6, -.4);
      for (let i = 0; i < 9; i++) { const e = rise(span(pu, i * .07, i * .07 + .4)); if (e <= 0) continue; const x = 190 + i * 70, lift = i % 3 !== 1;
        K.folk(ctx, x, 950, 120 + (i % 3) * 8, { a: e, pose: lift ? 'lift' : 'look', light: .5 });
        if (i % 3 === 1) { ctx.save(); ctx.globalAlpha *= e; ctx.fillStyle = rgba(CREAM, .85); ctx.fillRect(x - 30, 780 + Math.sin(t * 2 + i) * 4, 60, 40); ctx.fillStyle = P.night0; ctx.fillRect(x - 2, 820, 4, 40); ctx.restore(); } }
      K.tag(ctx, 'NEW DATA CENTERS? RISING BILLS?', 480, 560, U('power bills', .8, -.6), { size: 22, col: US.text });
      // China: data center blocks rise one after another
      const bu = U('just get built', 2.2, -.6);
      for (let i = 0; i < 8; i++) { const e = expoOut(span(bu, i * .1, i * .1 + .35)); if (e <= 0) continue; const x = 1130 + (i % 4) * 160, y = 930 - Math.floor(i / 4) * 190;
        ctx.save(); ctx.beginPath(); ctx.rect(x - 90, y - 200, 180, 200); ctx.clip(); K.icon(ctx, 'datacenter', x, y - 70 + (1 - e) * 160, 130, 1, { col: { body: mixHex(CN.deep, CREAM, .25), line: CN.line, deep: P.night1 } }); ctx.restore(); }
      K.tag(ctx, 'THEY MOSTLY JUST GET BUILT', 1440, 560, U('just get built', .8, -.3), { size: 22, col: CN.text });
    }
    K.src(ctx, t, S.a + 4, S.b + 1, 'AP, Jan 2026: local fights over data centers in up to 40 states · CNN, Oct 2026');
    ctx.restore();
  },
  // ---------------------------------------------------------------- r3c electricity 2.3×; new capacity ~6×
  r3c(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 500, ga: .25 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.02, z1: 1, fy: 560 });
    const base = 800, a = IN(.8), sx = sineIO(U('six times', 1.0, -.6));
    ctx.save(); ctx.translate(-sx * 330, 0);
    K.cap(ctx, 'ELECTRICITY GENERATED, 2025', 700, 200, a, { size: 28, align: 'center' });
    K.column(ctx, 520, base, 150, 520, U('generates', 1.2, -.2), CN, { value: '10,573 TWh', vsize: 40, label: 'CHINA' });
    K.column(ctx, 760, base, 150, 520 * 4536 / 10573, U('generates', 1.2, 0), US, { value: '4,536 TWh', vsize: 40, label: 'AMERICA' });
    K.big(ctx, '2.3×', 1060, 470, 90, U('twice as much', .8, -.1));
    ctx.restore();
    if (sx > 0) {
      K.cap(ctx, 'NEW POWER CAPACITY, COMING YEARS (ONE FORECAST)', 1340, 200, sx, { size: 26, align: 'center' });
      K.column(ctx, 1160, base, 150, 480, U('six times', 1.2, -.2), CN, { label: 'CHINA', value: '~6×', vsize: 52 });
      K.column(ctx, 1400, base, 150, 80, U('six times', 1.2, 0), US, { label: 'AMERICA', value: '1×', vsize: 40 });
    }
    K.src(ctx, t, S.a + 1.5, S.b + 1, 'Ember, Global Electricity Review 2026 · BloombergNEF via TechXplore, Feb 2026');
    ctx.restore();
  },
  // ---------------------------------------------------------------- r3d data centers: more than a third of America's growing demand; China a sliver
  r3d(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 520, ga: .25 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1, z1: 1.03, fy: 520 });
    K.cap(ctx, 'SHARE OF THE GROWTH IN POWER DEMAND FROM DATA CENTERS (FORECAST)', 960, 190, IN(.8), { size: 26, align: 'center' });
    K.donut(ctx, 640, 520, 170, .38, U('more than a third', 1.2, -.5), US, { value: '38 %', vsize: 76, label: 'AMERICA' });
    K.donut(ctx, 1280, 520, 170, .06, U('a sliver', 1.0, -.2), CN, { value: '6 %', vsize: 76, label: 'CHINA' });
    K.src(ctx, t, S.a + 1.5, S.b + 1, 'BloombergNEF, Economic Transition Scenario 2024–2030 (Feb 2026)');
    ctx.restore();
  },
  r3e: K.pointShot(2),
  // ---------------------------------------------------------------- r3f power is only muscle; into builders' hands and the physical world
  r3f(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 1200, gy: 520, ga: .25 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.03, z1: 1, fx: 1000, fy: 540 });
    K.cap(ctx, 'POWER IS ONLY MUSCLE', 960, 200, IN(.8), { size: 34, align: 'center', col: GOLD.text });
    const p0 = [[160, 560], [700, 560]];
    K.lightLine(ctx, p0, 0, IN(1.0), GOLD, { w: 6 });
    const nx = U('where A.I.', 1.0, -.2), b1 = U('hands of builders', 1.1, -.4), b2 = U('physical world', 1.1, -.4);
    K.cap(ctx, 'WHERE DOES AI GO NEXT?', 430, 500, nx, { size: 26, align: 'center' });
    const road1 = K.curvePts((x) => 560 - Math.pow((x - 700) / 700, .8) * 220, 700, 1400), road2 = K.curvePts((x) => 560 + Math.pow((x - 700) / 700, .8) * 220, 700, 1400);
    K.lightLine(ctx, road1, 0, sineIO(b1), AI, { w: 5, head: true }); K.lightLine(ctx, road2, 0, sineIO(b2), AI, { w: 5, head: true });
    if (b1 > 0) { K.icon(ctx, 'laptop', 1530, 330, 120, b1, { col: { body: mixHex(P.blue1, CREAM, .3), line: CREAM, deep: P.night1 } }); K.folk(ctx, 1660, 420, 120, { a: b1, dir: -1, light: .6 }); K.cap(ctx, 'INTO THE HANDS OF BUILDERS', 1560, 470, b1, { size: 26, align: 'center', col: AI.text }); }
    if (b2 > 0) { K.icon(ctx, 'factory', 1510, 760, 130, b2, { col: { body: mixHex(P.blue1, CREAM, .3), line: CREAM, deep: P.night1 } }); K.runner(ctx, 1680, 850, 150, 1.2, { col: ROBO, robot: true, a: b2, lean: .02 }); K.cap(ctx, 'INTO THE PHYSICAL WORLD', 1560, 900, b2, { size: 26, align: 'center', col: AI.text }); }
    ctx.restore();
  },
  // ---------------------------------------------------------------- r4a round 4: to be fair, visits: more than 9 in 10 American
  r4a(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 540, ga: .25 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1, z1: 1.03, fy: 540 });
    K.roundTitle(ctx, t, 3, IN(.8), 150);
    K.tag(ctx, 'TO BE FAIR', 960, 260, U('to be fair', .7, -.3), { size: 24, col: GOLD.text });
    const v = U('Count the visits', 2.0, -.2);
    K.cap(ctx, 'VISITS TO AMERICAN AND CHINESE AI WEBSITES', 960, 360, v, { size: 26, align: 'center' });
    K.dots(ctx, t, 735, 430, 100, 20, 24, 8.5, v, (k) => (k < 91 ? US : CN));
    const nt = U('nine in ten', .8, -.1); if (nt > 0) K.big(ctx, 'MORE THAN 9 IN 10: AMERICAN', 960, 640, 64, nt);
    K.src(ctx, t, S.a + 2, S.b + 1, 'Lowy Institute, Asia Power Snapshot, 8 Nov 2026');
    ctx.restore();
  },
  // ---------------------------------------------------------------- r4b what the world builds on: free models, builders take them
  r4b(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 600, ga: .25 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.03, z1: 1, fy: 600 });
    const nv = U("isn't about visits", .8, -.2);
    K.cap(ctx, 'NOT VISITS', 960, 220, nv * (1 - U('builds on', .4, -.1)), { size: 34, align: 'center', col: MUTED });
    const bo = U('builds on', 1.0, -.3);
    K.cap(ctx, 'WHAT THE WORLD BUILDS ON', 960, 220, bo, { size: 36, align: 'center', col: GOLD.text });
    // a foundation of model blocks under small buildings; terracotta FREE blocks slide in
    const free = U('away for free', 1.6, -.4), take = U('builders take them', 1.6, -.3);
    for (let i = 0; i < 10; i++) {
      const cn = i % 10 >= 4, e = cn ? expoOut(span(free, (i - 4) * .1, (i - 4) * .1 + .4)) : expoOut(span(bo, i * .08, i * .08 + .4)); if (e <= 0) continue;
      const x = 440 + i * 105, y = 820;
      ctx.save(); ctx.globalAlpha *= e; ctx.fillStyle = cn ? CN.body : US.body; ctx.beginPath(); ctx.roundRect(x - 48 + (cn ? (1 - e) * 300 : 0), y - 40, 96, 80, 8); ctx.fill(); ctx.restore();
      if (cn && e > .5) K.cap(ctx, 'FREE', x, y + 8, span(e, .5, 1), { size: 20, align: 'center', col: P.night0, weight: 600 });
    }
    // buildings on top grow as builders take the blocks
    for (let i = 0; i < 7; i++) { const e = expoOut(span(take, i * .1, i * .1 + .4)); if (e <= 0) continue; const x = 470 + i * 150, h = 120 + (i * 53 % 5) * 50;
      ctx.save(); ctx.fillStyle = mixHex(P.ind2, CREAM, .12); ctx.fillRect(x - 45, 780 - h * e, 90, h * e); for (let k = 0; k < h * e / 40 - 1; k++) { ctx.fillStyle = rgba(GOLD.hot, .6); ctx.fillRect(x - 25, 780 - 30 - k * 40, 18, 18); ctx.fillRect(x + 7, 780 - 30 - k * 40, 18, 18); } ctx.restore(); }
    for (let i = 0; i < 4; i++) { const e = rise(span(take, .2 + i * .1, .6 + i * .1)); if (e > 0) K.folk(ctx, 1560 - i * 70 - (1 - e) * 60, 950, 110, { a: e, dir: -1, pose: 'hold', light: .6 }); }
    K.cap(ctx, 'BUILDERS TAKE THEM', 1470, 900, take, { size: 26, align: 'center', col: CN.text });
    ctx.restore();
  },
  // ---------------------------------------------------------------- r4c downloads 41 vs 36.5 %; one week of requests 55 vs 38 %
  r4c(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 500, ga: .25 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1, z1: 1.03, fy: 520 });
    const sw = sineIO(U('in one recent week', 1.0, -.3));
    ctx.save(); ctx.translate(-sw * 330, 0); ctx.globalAlpha *= 1 - .45 * sw;
    K.cap(ctx, 'DOWNLOADS OF OPEN MODELS, FEB 2025 – FEB 2026', 800, 300, IN(.8), { size: 26, align: 'center' });
    K.bar(ctx, 600, 420, 900 * .41, U('downloaded', 1.0, -.2), CN, { th: 56, label: 'CHINESE', value: '41 %' });
    K.bar(ctx, 600, 530, 900 * .365, U('than American ones', 1.0, -.4), US, { th: 56, label: 'AMERICAN', value: '36.5 %' });
    ctx.restore();
    if (sw > 0) {
      K.cap(ctx, 'ONE WEEK OF REQUESTS ON A DEVELOPER PLATFORM', 1420, 300, sw, { size: 24, align: 'center' });
      const ru = U('more than half', 1.2, -.3);
      K.donut(ctx, 1420, 560, 170, .55, ru, CN, { value: '55 %', vsize: 70, label: 'TO CHINESE MODELS · US 38 %' });
    }
    K.src(ctx, t, S.a + 2, S.b + 1, 'Hugging Face, State of Open Source, Spring 2026 · OpenRouter week of 26 Oct 2026 via Lowy Institute');
    ctx.restore();
  },
  // ---------------------------------------------------------------- r4d THE ROBOT SPRINT (animated, no footage)
  r4d(ctx, t, S, T) {
    const { U, IN, G } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 420, ga: .3, stars: 140 });
    const go = G('ran a hundred') - .2, run = span(t, go, go + 4.2);
    // camera: wide on the stadium night, follows the leaders
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.06, fx: lerp(700, 1300, run), fy: 620 });
    // floodlights and stands
    for (const sx of [300, 1620]) for (let i = 0; i < 3; i++) halo(ctx, sx - 24 + i * 24, 150, 22, .5, GOLD.halo, GOLD.core);
    ctx.fillStyle = mixHex(P.ind0, P.night1, .4); ctx.fillRect(0, 300, W, 150);
    const r = K.prng(7); for (let k = 0; k < 120; k++) { ctx.fillStyle = rgba(GOLD.hot, .25 + .3 * r()); ctx.fillRect(r() * W, 320 + r() * 110, 4, 6); }
    // 1: into bodies — one robot stands, then the field
    const bod = U('into bodies', .9, -.3);
    K.cap(ctx, 'AI IN BODIES', 960, 250, bod * (1 - span(t, go - 2, go - 1)), { size: 34, align: 'center', col: AI.text });
    K.cap(ctx, 'BEIJING · AUGUST 2026', 960, 250, U('This August', .7, -.1) * (1 - span(t, go + 3.6, go + 4.2)), { size: 30, align: 'center', col: GOLD.text });
    const lanes = [520, 640, 760, 880], x0 = 220, x1 = 1640;
    K.track(ctx, t, { x0: 120, x1: 1800, y0: 520, pitch: 120, u: U('This August', 1.0, -.3), finish: 1, fx: .9, lanes: lanes.map(() => ({ col: ROBO, label: '' })) });
    const fin = lerp(120, 1800, .9);
    // Bolt's record as a ghost line moving at 100 m / 9.58 s (scaled: the robots' fastest heat 9.39 s = 4.0 s screen time)
    const bu = U('world-record time', .6, -.4) + (run > 0 ? 1 : 0);
    const gx = lerp(x0, fin, clamp((t - go) / (4.0 * 9.58 / 9.39)));
    if (run > 0) { ctx.save(); ctx.globalAlpha *= clamp(bu) * (1 - span(t, go + 6, go + 7)); ctx.setLineDash([10, 8]); ctx.strokeStyle = GOLD.line; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(gx, 440); ctx.lineTo(gx, 950); ctx.stroke(); ctx.restore(); K.cap(ctx, "BOLT'S RECORD PACE", gx, 425, clamp(bu) * (1 - span(t, go + 6, go + 7)), { size: 22, align: 'center', col: GOLD.text }); }
    // the robots: pace per lane (lane 2 the fastest, 9.39 s), lane 3 falls (the stretcher)
    const pace = [9.47, 9.39, 9.9, 10.2], fall = G('stretcher') - 1.2;
    lanes.forEach((y, i) => {
      const dur = 4.0 * pace[i] / 9.39, p = clamp((t - go) / dur), x = lerp(x0, fin + 40, sineIO(p * .15) * 0 + p);
      if (i === 2) {   // falls after the finish, is carried away
        const f = span(t, fall, fall + .6), off = span(t, fall + 1.6, fall + 3.6);
        if (f <= 0) K.runner(ctx, x, y + 52, 110, p > 0 && p < 1 ? (t - go) * 11 + i : 1.2, { col: ROBO, robot: true, lean: p > 0 && p < 1 ? .16 : .02 });
        else { ctx.save(); ctx.translate(x + off * 500, y + 52); ctx.rotate(-1.4 * expoOut(f)); K.runner(ctx, 0, 0, 110, 1.2, { col: ROBO, robot: true, lean: .02, a: 1 - span(off, .7, 1) }); ctx.restore();
          if (f > .5) { ctx.save(); ctx.globalAlpha *= (1 - span(off, .7, 1)); ctx.fillStyle = rgba(CREAM, .8); ctx.fillRect(x - 70 + off * 500, y + 40, 150, 10); ctx.restore(); K.folk(ctx, x - 90 + off * 500, y + 70, 90, { a: 1 - span(off, .7, 1), dir: 1 }); K.folk(ctx, x + 100 + off * 500, y + 70, 90, { a: 1 - span(off, .7, 1), dir: 1 }); } }
      } else K.runner(ctx, x, y + 52, 110, p > 0 && p < 1 ? (t - go) * 11 + i : 1.2, { col: i === 1 ? { ...ROBO, body: mixHex(ROBO.body, AI.line, .35) } : ROBO, robot: true, lean: p > 0 && p < 1 ? .16 : .02 });
    });
    // the caption (verified wording) and the honest notes
    const cu = span(t, go + 4.2, go + 5.0);
    if (cu > 0) { ctx.save(); ctx.globalAlpha *= cu; ctx.fillStyle = rgba(P.night0, .6); ctx.beginPath(); ctx.roundRect(420, 170, 1080, 70, 35); ctx.fill(); ctx.restore();
      K.cap(ctx, "FASTEST HEAT: TIANGONG ULTRA 9.39 S · BOLT'S RECORD: 9.58 S · 22 AUG 2026", 960, 216, cu, { size: 24, align: 'center', col: CREAM }); }
    K.tag(ctx, 'NOT AN OFFICIAL RECORD', 760, 350, U('not an official record', .7, -.2), { size: 22, col: MUTED });
    K.tag(ctx, 'BUT THEY RAN', 1300, 350, U('But they ran', .7, -.1), { size: 26, col: GOLD.text });
    ctx.restore();
    K.src(ctx, t, G('This August'), S.b + 1, 'World Humanoid Robot Games, Beijing · Reuters, 23 Aug 2026 · AP');
  },
  r4e: K.pointShot(3, 'Point: China'),
  // ---------------------------------------------------------------- r4f LEITBILD 2: the level board, the dark third lane
  r4f(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.08, z1: 1.0, fx: 960, fy: 420 });
    K.stadium(ctx, t, { title: 'AI RACE', us: 2, cn: 2, u: 1, third: U('third lane', .8, -.4), thirdLit: 0, thirdLabel: 'THE THIRD LANE: STILL DARK', duX: 960,
      mid(ctx, bx, by, bw, bh) {
        K.tag(ctx, 'AHEAD TODAY', bx + 200, by + bh + 130, U('ahead today', .7, -.1), { size: 22, col: US.text, fill: P.night0 });
        K.tag(ctx, 'CATCHING UP FOR TOMORROW', bx + bw - 200, by + bh + 130, U('catching up', .7, -.1), { size: 22, col: CN.text, fill: P.night0 });
        K.cap(ctx, 'LEVEL', bx + bw / 2, by + 260, U('board is level', .7, -.1), { size: 30, align: 'center', col: GOLD.text });
      } });
    ctx.restore();
  },
};
