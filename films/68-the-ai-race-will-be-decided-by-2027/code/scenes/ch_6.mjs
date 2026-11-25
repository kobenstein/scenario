// Film 68 · 6 A WAY OUT (w1–w5, C5, w6–w8). Numbers: faktencheck.md K62–K72, ampel-zweitpruefer.md #7, #8.
// No Amodei quote card (wording unverified); the Bessent line is shown as Washington's statement only.
import * as K from '../lib/f68_kit.mjs';
const { W, H, P, clamp, lerp, span, sineIO, expoOut, rise, halo, rgba, mixHex, TAU, US, CN, AI, GOLD, CREAM, MUTED } = K;
const NEU = { body: '#d8d2c4', line: '#f3efe2', deep: '#5a5560', text: CREAM };
const RACE = (t, ph0 = 0, k = 8) => t * k + ph0;
const WASH = { body: US.body, line: US.line, deep: US.deep }, BEIJ = { body: CN.body, line: CN.line, deep: CN.deep };

// a speed-limit sign of light: post + disc. u rises it
function limitSign(ctx, t, x, y, r, u, o = {}) {
  if (u <= 0) return; const k = expoOut(clamp(u)), yy = y + (1 - k) * 120;
  ctx.save(); ctx.globalAlpha *= clamp(u * 2) * (o.a ?? 1);
  ctx.fillStyle = rgba(CREAM, .6); ctx.fillRect(x - 5, yy + r, 10, 260);
  halo(ctx, x, yy, r * 2.2, .35, GOLD.halo, GOLD.core);
  ctx.fillStyle = mixHex(CREAM, GOLD.hot, .15); ctx.beginPath(); ctx.arc(x, yy, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = mixHex(CN.body, GOLD.mid, .35); ctx.lineWidth = r * .16; ctx.beginPath(); ctx.arc(x, yy, r * .9, 0, TAU); ctx.stroke();
  ctx.restore();
  K.cap(ctx, 'SPEED', x, yy - 4, u, { size: r * .28, align: 'center', col: P.night0 });
  K.cap(ctx, 'LIMIT', x, yy + r * .34, u, { size: r * .28, align: 'center', col: P.night0 });
}
// a node that can turn away (squash in x through 0 to a mirrored, dimmed state)
function node(ctx, kind, x, y, s, u, col, label, away = 0) {
  if (u <= 0) return; const sx = Math.cos(Math.PI * clamp(away)) * (away > .5 ? -.82 : 1);
  ctx.save(); ctx.translate(x, y); ctx.scale(Math.max(.04, Math.abs(sx)) * Math.sign(sx || 1), 1);
  halo(ctx, 0, 0, s * 1.2, .3 * u * (1 - .7 * away), col.line, '#fff');
  K.icon(ctx, kind, 0, 0, s, u, { col, a: 1 - .45 * away }); ctx.restore();
  K.cap(ctx, label, x, y + s * .5 + 52, u, { size: 28, align: 'center', col: col === WASH ? US.text : CN.text });
}

export default {
  // ---------------------------------------------------------------- w1 the trap as a diagram, a door-shaped gap
  w1(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 540, ga: .26 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.06, fx: 960, fy: 560 });
    K.cap(ctx, 'THE TRAP', 960, 220, IN(.6), { size: 30, align: 'center', col: MUTED });
    const a = IN(.8, .1), b = IN(.8, .5);
    K.cap(ctx, 'SLOW DOWN ALONE', 420, 420, a, { size: 32, align: 'center', col: CREAM });
    K.lightLine(ctx, [[420, 450], [420, 610]], 0, a, CN, { w: 3, arrow: true });
    K.cap(ctx, 'RIVAL TAKES THE LEAD', 420, 680, rise(span(a, .5, 1)), { size: 28, align: 'center', col: CN.text });
    K.cap(ctx, 'RACE ALL OUT', 1500, 420, b, { size: 32, align: 'center', col: CREAM });
    K.lightLine(ctx, [[1500, 450], [1500, 610]], 0, b, AI, { w: 3, arrow: true });
    K.cap(ctx, 'LOSE CONTROL', 1500, 680, rise(span(b, .5, 1)), { size: 28, align: 'center', col: AI.text });
    // the door between them
    const d = U('way out', .9, -.4);
    if (d > 0) { ctx.save(); ctx.globalAlpha *= d; halo(ctx, 960, 560, 260, .3, GOLD.halo, GOLD.core); ctx.setLineDash([12, 10]); ctx.strokeStyle = GOLD.line; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(870, 760); ctx.lineTo(870, 460); ctx.arc(960, 460, 90, Math.PI, 0); ctx.lineTo(1050, 760); ctx.stroke(); ctx.restore();
      K.big(ctx, '?', 960, 640, 150, d); K.cap(ctx, 'A WAY OUT?', 960, 830, d, { size: 30, align: 'center', col: GOLD.text }); }
    ctx.restore();
  },
  // ---------------------------------------------------------------- w2 Amodei's essay: slow down on purpose; a speed limit together with China
  w2(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 1300, gy: 520, ga: .26 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.02, z1: 1.0, fx: 1300, fy: 560 });
    K.doc(ctx, t, 110, 220, 600, 330, { u: U('In September, the head', .9, -.3), style: 'night', head: 'ESSAY · 12 SEP 2026', lines: [['We Must Pace', 64, 1], ['the Frontier', 64, 1], ['Dario Amodei, Anthropic', 30, 0]] });
    K.cap(ctx, 'ONE OF THE RUNNERS ASKS FOR ONE', 960, 140, IN(.8) * (1 - U('In September, the head', .6, .4)), { size: 28, align: 'center', col: MUTED });
    // two lanes; the American runner eases off on purpose, the sign rises over both lanes
    K.track(ctx, t, { x0: 800, x1: 1820, y0: 640, pitch: 150, u: IN(.9), lanes: [{ col: US, label: 'AMERICA', glow: .2 }, { col: CN, label: 'CHINA', glow: .2 }] });
    const slow = U('slow down on purpose', 1.4, -.3), tog = U('together with China', 1.0, -.4);
    const sp = lerp(9, 4.5, slow), x = 1000 + 90 * Math.sin(t * .4) * (1 - slow) - 120 * slow;
    K.runner(ctx, x, 692, 120, t * sp, { col: US });
    K.runner(ctx, x - 40 + 120 * slow * (1 - tog) - 120 * tog * 0, 842, 120, t * lerp(9, sp, tog), { col: CN });
    K.cap(ctx, 'SLOW DOWN ON PURPOSE', 640, 700, slow, { size: 24, align: 'right', col: US.text });
    limitSign(ctx, t, 1560, 380, 90, U('speed limit', .9, -.4));
    if (tog > 0) { ctx.save(); ctx.globalAlpha *= tog; ctx.strokeStyle = GOLD.line; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(1700, 590); ctx.lineTo(1730, 590); ctx.lineTo(1730, 870); ctx.lineTo(1700, 870); ctx.stroke(); ctx.restore();
      K.cap(ctx, 'TOGETHER WITH CHINA', 1250, 515, tog, { size: 30, align: 'center', col: GOLD.text }); }
    K.src(ctx, t, S.a + 1, S.b + 1, 'Dario Amodei, We Must Pace the Frontier, 12 Sep 2026');
    ctx.restore();
  },
  // ---------------------------------------------------------------- w3 may not work; neither capital welcomed it
  w3(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 470, ga: .24 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.03, z1: 1.0, fx: 960, fy: 480 });
    limitSign(ctx, t, 960, 330, 100, 1, { a: 1 - .4 * U('neither capital', 1, 0) });
    K.tag(ctx, 'MAY NOT WORK', 960, 520, U('may not work', .7, -.2), { size: 26, col: MUTED, fill: P.night0 });
    const nu = U('several reports', .9, -.3), aw = U('welcomed the idea', 1.2, -.6);
    node(ctx, 'capitol', 430, 560, 170, nu, WASH, 'WASHINGTON', aw);
    node(ctx, 'gate', 1490, 560, 170, nu, BEIJ, 'BEIJING', aw);
    K.cap(ctx, 'NOT WELCOMED', 960, 860, aw, { size: 34, align: 'center', col: GOLD.text });
    K.src(ctx, t, S.a + 2, S.b + 1, 'Al Jazeera, 14 Sep 2026 · Rest of World, Sep 2026');
    ctx.restore();
  },
  // ---------------------------------------------------------------- w4 the counter-argument: stop running and your rival writes the rules
  w4(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 1300, gy: 470, ga: .24 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.05, fx: 1300, fy: 520 });
    K.cap(ctx, 'THE COUNTER-ARGUMENT', 960, 170, IN(.7), { size: 28, align: 'center', col: MUTED });
    K.track(ctx, t, { x0: 120, x1: 1100, y0: 560, pitch: 150, u: IN(.7), lanes: [{ col: NEU, label: '' }, { col: NEU, label: '' }] });
    const st = G('Stop running'), stop = span(t, st, st + .8);
    const xa = 300 + (t - S.a) * 60 * (1 - stop) + Math.min(t - S.a, st - S.a) * 0, xb = 360 + (t - S.a) * 90;
    K.runner(ctx, Math.min(xa, 300 + (st - S.a) * 60 + 20 * stop), 612, 120, stop < 1 ? RACE(t) : 1.2, { col: NEU, lean: lerp(.16, .02, stop), a: 1 - .3 * stop });
    K.cap(ctx, 'STOPS', 300 + (st - S.a) * 60, 520, stop, { size: 22, align: 'center', col: MUTED });
    const rw = U('writes the rules', 1.2, -.5);
    K.runner(ctx, xb, 762, 120, RACE(t, 2), { col: { ...NEU, body: mixHex(NEU.body, GOLD.hot, .35 * rw) } });
    K.cap(ctx, 'THE RIVAL', xb, 860, U('your rival', .7, -.2), { size: 22, align: 'center', col: GOLD.text });
    K.doc(ctx, t, 1240, 260, 520, 560, { u: IN(1, .4), head: 'THE RULES', lines: [] });
    for (let i = 0; i < 7; i++) { const e = expoOut(clamp(rw * 7 - i)); if (e <= 0) continue; ctx.fillStyle = mixHex(GOLD.mid, GOLD.hot, .3); ctx.fillRect(1280, 370 + i * 60, (420 - (i % 3) * 60) * e, 12); }
    ctx.restore();
  },
  // ---------------------------------------------------------------- w5 a different event: one road to one super-mind vs. many roads at once
  w5(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 500, ga: .24 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.03, z1: 1.0, fx: 1380, fy: 560 });
    // first: the two runners on one track; on 'different event' they split to their own grounds
    const sep = sineIO(U('different event', 1.6, -.2)), tv = 1 - span(sep, .2, .8);
    K.track(ctx, t, { x0: 360, x1: 1560, y0: 470, pitch: 150, u: IN(.8), a: tv, lanes: [{ col: US, label: '' }, { col: CN, label: '' }] });
    if (sep < 1) { const k = 1 - span(sep, .7, 1);
      K.runner(ctx, lerp(900 + 40 * Math.sin(t * .7), 500, sep), lerp(522, 850, sep), lerp(130, 80, sep), RACE(t), { col: US, a: k });
      K.runner(ctx, lerp(880 + 40 * Math.sin(t * .6 + 1), 1380, sep), lerp(672, 850, sep), lerp(130, 80, sep), RACE(t, 2), { col: CN, a: k }); }
    K.cap(ctx, 'THE SAME RACE?', 960, 140, IN(.7) * (1 - U('different event', .6, .2)), { size: 30, align: 'center', col: MUTED });
    K.cap(ctx, 'A DIFFERENT EVENT', 960, 140, U('different event', .8, -.2), { size: 30, align: 'center', col: GOLD.text });
    // America: one straight road to one giant disc
    const a = U('Less one giant', 1.4, -.4);
    K.cap(ctx, 'AMERICA', 500, 905, span(sep, .5, 1), { size: 30, align: 'center', col: US.text });
    K.lightLine(ctx, [[500, 850], [500, 470]], 0, Math.max(a, span(sep, .6, 1) * .3), US, { w: 5, arrow: false });
    K.orb(ctx, t, 500, 330, lerp(20, 120, expoOut(a)), { rings: 3, a: clamp(a * 3 + .2) });
    K.cap(ctx, 'ONE GIANT SUPER-MIND', 500, 210, a, { size: 28, align: 'center', col: AI.text });
    // China: many roads fanning out
    const m = U('More roads at once', 1.6, -.4), rb = U('like those robots', .9, -.3);
    K.cap(ctx, 'CHINA', 1380, 905, span(sep, .5, 1), { size: 30, align: 'center', col: CN.text });
    const ends = [[1020, 430, 'factory'], [1220, 340, 'phone'], [1420, 320, 'robot'], [1620, 360, 'datacenter'], [1780, 470, 'laptop']];
    ends.forEach(([ex, ey, kind], i) => { const e = span(m, i * .1, i * .1 + .55); if (e <= 0) return;
      K.lightLine(ctx, [[1380, 850], [lerp(1380, ex, .4), 680], [ex, ey + 80]], 0, e, CN, { w: 3, head: true });
      const iu = span(e, .8, 1);
      if (kind === 'robot') { const ru = Math.max(iu, rb); if (ru > 0) K.runner(ctx, ex, ey + 70, 100 * (1 + .15 * rb), RACE(t, 0, 7) * rb + 1.2 * (1 - rb), { col: { body: '#9fb3c8', line: '#d6e6f2', deep: '#3c4c63' }, robot: true, a: ru, lean: .16 * rb }); }
      else K.icon(ctx, kind, ex, ey + 20, 84, iu, { col: { body: CN.body, line: CN.line, deep: CN.deep } }); });
    K.cap(ctx, 'MORE ROADS AT ONCE', 1380, 210, m, { size: 28, align: 'center', col: CN.text });
    K.src(ctx, t, G('Researchers who study') - .5, S.b + 1, "CSET, China's Embodied AI: A Path to AGI, Dec 2025 · Kyle Chan, Brookings");
    ctx.restore();
  },
  C5: K.clipShot('C5'),
  // ---------------------------------------------------------------- w6 the two rivals talk: a channel for AI incidents, Sep 2026
  w6(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 400, ga: .26 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.02, z1: 1.0, fx: 960, fy: 460 });
    const nu = IN(.9);
    node(ctx, 'capitol', 470, 520, 180, nu, WASH, 'WASHINGTON');
    node(ctx, 'gate', 1450, 520, 180, nu, BEIJ, 'BEIJING');
    const talk = U('started to talk', 1.0, -.2);
    for (let k = 0; k < 3; k++) { const ph = (t * .6 + k / 3) % 1, a = talk * Math.sin(Math.PI * ph) * .6; if (a <= 0) continue;
      ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = CREAM; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(600 + ph * 120, 520, 40 + ph * 40, -.6, .6); ctx.stroke(); ctx.beginPath(); ctx.arc(1320 - ph * 120, 520, 40 + ph * 40, Math.PI - .6, Math.PI + .6); ctx.stroke(); ctx.restore(); }
    const ch = U('channel for', 1.4, -.6);
    K.lightLine(ctx, [[600, 500], [960, 460], [1320, 500]], 0, ch, GOLD, { w: 5, head: true });
    if (ch > .95) halo(ctx, 960, 462, 120, .3 + .1 * Math.sin(t * 3), GOLD.halo, GOLD.core);
    K.cap(ctx, 'A CHANNEL FOR AI INCIDENTS', 960, 380, ch, { size: 34, align: 'center', col: GOLD.text, glow: true });
    K.cap(ctx, 'AGREED SEP 2026', 960, 560, rise(span(ch, .5, 1)), { size: 24, align: 'center', col: MUTED });
    K.src(ctx, t, S.a + 2, S.b + 1, 'White House, 25 Sep 2026 · Chinese state media, 26 Sep 2026');
    ctx.restore();
  },
  // ---------------------------------------------------------------- w7 Shenzhen, 19 Nov 2026: no AI treaty
  w7(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 700, gy: 300, ga: .24 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.06, z1: 1.0, fx: 600, fy: 480 });
    // a dark coast
    ctx.save(); ctx.globalAlpha *= IN(.8); ctx.fillStyle = mixHex(P.ind1, P.night1, .4); ctx.beginPath(); ctx.moveTo(0, 300); ctx.bezierCurveTo(300, 330, 420, 520, 640, 500); ctx.bezierCurveTo(820, 480, 900, 640, 1100, 700); ctx.lineTo(1100, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
    const r = K.prng(41); for (let k = 0; k < 160; k++) { const px = r() * 900, py = 420 + r() * 600; if (py < 300 + px * .3) continue; ctx.fillStyle = rgba(GOLD.hot, .3 + .3 * r()); ctx.fillRect(px, py, 3, 3); } ctx.restore();
    const pu = U('met in Shenzhen', .9, -.4);
    if (pu > 0) { const py = lerp(380, 500, expoOut(pu)); halo(ctx, 640, 500, 90, .5 * pu, GOLD.halo, GOLD.core); ctx.save(); ctx.globalAlpha *= clamp(pu * 2); ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(640, py - 40, 22, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(622, py - 30); ctx.lineTo(640, py); ctx.lineTo(658, py - 30); ctx.fill(); ctx.restore();
      K.cap(ctx, 'SHENZHEN · 19 NOV 2026', 640, py - 90, pu, { size: 30, align: 'center', col: GOLD.text }); }
    K.cap(ctx, 'THE PRESIDENTS MEET', 640, 200, U('their presidents', .8, -.2), { size: 26, align: 'center', col: MUTED });
    // the treaty page with empty signature lines
    const tu = U('They signed no', .9, -.3);
    K.doc(ctx, t, 1150, 230, 560, 600, { u: tu, head: 'AI TREATY', lines: [] });
    if (tu > 0) { ctx.save(); ctx.globalAlpha *= tu; ctx.fillStyle = rgba(K.PAPER.faint, .35); for (let i = 0; i < 5; i++) ctx.fillRect(1190, 330 + i * 46, 470 - (i % 2) * 120, 10);
      ctx.strokeStyle = rgba(K.PAPER.ink, .7); ctx.lineWidth = 2; for (const sx of [1190, 1450]) { ctx.beginPath(); ctx.moveTo(sx, 720); ctx.lineTo(sx + 220, 720); ctx.stroke(); } ctx.restore();
      K.cap(ctx, 'WASHINGTON', 1300, 755, tu, { size: 18, align: 'center', col: K.PAPER.faint }); K.cap(ctx, 'BEIJING', 1560, 755, tu, { size: 18, align: 'center', col: K.PAPER.faint }); }
    const st = U('They signed no', .5, .6);
    if (st > 0) { ctx.save(); ctx.translate(1430, 560); ctx.rotate(-.12); ctx.scale(lerp(1.6, 1, expoOut(st)), lerp(1.6, 1, expoOut(st))); ctx.globalAlpha *= clamp(st * 2); ctx.strokeStyle = CN.line; ctx.lineWidth = 5; ctx.strokeRect(-200, -46, 400, 92); ctx.restore();
      ctx.save(); ctx.translate(1430, 560); ctx.rotate(-.12); K.cap(ctx, 'NO AI TREATY', 0, 14, st, { size: 40, align: 'center', col: CN.line }); ctx.restore(); }
    K.cap(ctx, 'NOT MUCH ELSE AGREED', 1430, 900, U('not much else', .8, -.2), { size: 26, align: 'center', col: MUTED });
    K.src(ctx, t, S.a + 1.5, S.b + 1, 'China MFA readout, 19 Nov 2026 · China Briefing, Nov 2026');
    ctx.restore();
  },
  // ---------------------------------------------------------------- w8 one line, as stated by Washington: humans stay involved; a human in the loop
  w8(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 470, ga: .26 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.04, fx: 960, fy: 470 });
    const loop = U('human stays in the loop', 1.4, -.8), up = 1 - .5 * sineIO(span(t, G('Two rivals') - .3, G('Two rivals') + 1.2));
    K.cap(ctx, 'ONE LINE', 960, 140, U('they did agree on one line', .8, -.3), { size: 28, align: 'center', col: GOLD.text });
    // the sentence writes itself
    const line = 'Humans stay involved when military AI makes decisions.', wu = span(t, G('Humans stay involved') - .2, G('Humans stay involved') + 2.6);
    const n = Math.round(line.length * wu), ly = lerp(300, 230, 1 - up);
    if (n > 0) { ctx.save(); ctx.translate(960, ly); ctx.scale(lerp(.7, 1, up), lerp(.7, 1, up)); K.serif(ctx, line.slice(0, n), 0, 0, 58, 1, { align: 'center' }); ctx.restore(); }
    K.tag(ctx, 'AS STATED BY WASHINGTON', 960, lerp(400, 300, 1 - up), U('according to Washington', .8, -.2), { size: 22, col: US.text, fill: P.night0 });
    // two rivals who agree on very little, and the loop with a human inside
    const rv = U('Two rivals', .9, -.2);
    node(ctx, 'capitol', 380, 620, 140, rv, WASH, 'WASHINGTON');
    node(ctx, 'gate', 1540, 620, 140, rv, BEIJ, 'BEIJING');
    if (loop > 0) { const k = expoOut(loop), a0 = -Math.PI / 2;
      ctx.save(); ctx.lineCap = 'round';
      ctx.strokeStyle = rgba(GOLD.line, .9); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(960, 640, 170, a0 + t * .5, a0 + t * .5 + TAU * .92 * k); ctx.stroke();
      const ea = a0 + t * .5 + TAU * .92 * k; ctx.fillStyle = GOLD.line; ctx.beginPath(); ctx.moveTo(960 + Math.cos(ea) * 156, 640 + Math.sin(ea) * 156); ctx.lineTo(960 + Math.cos(ea + .16) * 170, 640 + Math.sin(ea + .16) * 170); ctx.lineTo(960 + Math.cos(ea) * 184, 640 + Math.sin(ea) * 184); ctx.fill();
      ctx.restore(); halo(ctx, 960, 640, 210, .2 * loop, GOLD.halo, GOLD.core);
      K.lightLine(ctx, [[470, 620], [790, 640]], 0, loop, US, { w: 2 }); K.lightLine(ctx, [[1450, 620], [1130, 640]], 0, loop, CN, { w: 2 });
      K.du(ctx, 960, 735, 170, { pose: 'look', look: .6 });
      K.cap(ctx, 'A HUMAN IN THE LOOP', 960, 415, loop, { size: 34, align: 'center', col: GOLD.text, glow: true }); }
    K.src(ctx, t, G('according to Washington'), S.b + 1, 'Reuters, 20 Nov 2026 (Bessent) · China readout: "human control"');
    ctx.restore();
  },
};
