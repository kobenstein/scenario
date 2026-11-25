// Film 74 · c10 THE CLOCK RINGS (E.01–END): the bench on the square, she sits down with the old clock and holds it to her ear, "What else did you worry
// about?", the nine GONE lines curl into the border of an old sea chart and the worries become sea monsters, the core sentence over the square,
// the timeline back to NOW, WHO IS THIS FOR? (four TODAY cards), LABS · GOVERNMENTS · VOTERS, the empty ANSWER that fills: EVERYBODY, subscribe 2,
// and the leitbild: your street at the square at dusk, she winds the clock, it rings, nobody flinches, the children dance · end screen (no words).
import * as K from '../lib/f79_kit.mjs';
import * as S from '../lib/f79_street.mjs';
import * as PL from '../lib/f79_places.mjs';
import { hourAt, GONE_LINES } from './hud.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, cam3, aim, camK, project, lin, rad, prng } = K;
const look = (R, t) => K.hourLook(hourAt(R, t));
const backOut = (x) => { const c = 1.7, y = x - 1; return 1 + (c + 1) * y * y * y + c * y * y; };
// the spoken words from t0 on (for word-by-word type)
const wordsFrom = (T, t0, n) => { const i = T.words.findIndex((w) => w.s >= t0 - .05); return T.words.slice(i, i + n).map((w) => [w.w, w.s]); };
function bench(g, x, y, w, L) {   // a park bench seen from behind: two backrest slats, the seat behind them
  g.fillStyle = mixHex('#4a3428', L.shade, .3); g.fillRect(x + 20, y - 90, 16, 200); g.fillRect(x + w - 36, y - 90, 16, 200); g.fillRect(x + w / 2 - 8, y - 90, 16, 200);
  g.fillStyle = mixHex('#8a6040', L.light, .12); g.fillRect(x, y - 80, w, 26); g.fillRect(x, y - 40, w, 26);
  g.fillStyle = rgba('#ffffff', .08); g.fillRect(x, y - 80, w, 4); g.fillRect(x, y - 40, w, 4);
  g.fillStyle = mixHex('#6a4a30', L.shade, .25); g.fillRect(x - 10, y + 2, w + 20, 18);
}
// a sea monster (blue ink on the chart): kind 0 letter with fins · 1 bill with teeth · 2 headlights · 3 empty chair
function monster(q, t, kind, x, y, u) {
  if (u <= 0) return; const e = K.expoOut(clamp(u)), bob = 6 * Math.sin(t * 1.4 + kind);
  q.save(); q.translate(x, y + bob + (1 - e) * 40); q.globalAlpha *= clamp(u * 2); K.ink(q, K.PAPER.ink, 3);
  // the water it swims in
  q.beginPath(); for (let k = 0; k < 6; k++) { const xx = -120 + k * 48; q.moveTo(xx, 60); q.quadraticCurveTo(xx + 12, 50, xx + 24, 60); q.quadraticCurveTo(xx + 36, 70, xx + 48, 60); } q.stroke();
  if (kind === 0) { q.strokeRect(-70, -40, 140, 90); q.beginPath(); q.moveTo(-70, -40); q.lineTo(0, 10); q.lineTo(70, -40); q.stroke();
    q.beginPath(); q.moveTo(-20, -40); q.lineTo(-4, -84); q.lineTo(20, -40); q.stroke(); q.beginPath(); q.moveTo(70, 10); q.quadraticCurveTo(110, -10 + 10 * Math.sin(t * 3), 120, -30); q.lineTo(100, 20); q.closePath(); q.stroke();
    q.font = '700 18px Inter'; q.fillStyle = K.PAPER.red; q.textAlign = 'center'; q.fillText('NOTICE', 0, 34); }
  if (kind === 1) { q.beginPath(); q.moveTo(-60, -80); q.lineTo(60, -80); q.lineTo(60, 40); for (let k = 0; k < 6; k++) q.lineTo(60 - k * 20 - 10, k % 2 ? 40 : 24); q.lineTo(-60, 40); q.closePath(); q.stroke();
    for (let k = 0; k < 4; k++) { q.beginPath(); q.moveTo(-44, -58 + k * 18); q.lineTo(30 - k * 10, -58 + k * 18); q.stroke(); }
    const jaw = 10 + 8 * Math.sin(t * 4); q.beginPath(); for (let k = 0; k < 7; k++) { q.moveTo(-60 + k * 20, 40); q.lineTo(-50 + k * 20, 40 + jaw); q.lineTo(-40 + k * 20, 40); } q.stroke();
    q.font = '800 22px Inter'; q.fillStyle = K.PAPER.red; q.textAlign = 'center'; q.fillText('DUE', 0, 30); }
  if (kind === 2) { q.beginPath(); q.moveTo(-120, 40); q.quadraticCurveTo(-110, -40, 0, -50); q.quadraticCurveTo(110, -40, 120, 40); q.stroke();
    for (const sx of [-1, 1]) { q.fillStyle = rad(q, sx * 50, 0, 60, [[0, rgba('#ffe27a', .9)], [1, rgba('#ffe27a', 0)]]); q.fillRect(sx * 50 - 60, -60, 120, 120); q.beginPath(); q.arc(sx * 50, 0, 18, 0, 7); q.stroke(); } }
  if (kind === 3) { q.save(); q.rotate(.12 * Math.sin(t)); q.strokeRect(-40, -10, 80, 10); q.beginPath(); q.moveTo(-36, 0); q.lineTo(-36, 50); q.moveTo(36, 0); q.lineTo(36, 50); q.moveTo(-36, -10); q.lineTo(-36, -100); q.moveTo(36, -10); q.lineTo(36, -100); q.moveTo(-36, -96); q.lineTo(36, -96); q.moveTo(-36, -66); q.lineTo(36, -66); q.stroke(); q.restore();
    q.beginPath(); q.moveTo(50, 40); q.quadraticCurveTo(90, 0, 120, 30); q.quadraticCurveTo(140, 50, 160, 20); q.stroke(); }
  q.restore();
}
export default function c10(T, R) {
  const RT = (id) => R[id];
  // ---------------------------------------------------------------- E.01–E.04 · the bench on the square: she sits down beside you, the clock in her hand · to her ear · she looks up · "What else did you worry about?"
  const BX = 640, BY = 900, BW = 640;
  const camE = (t) => camK(t, [[RT('E.01') - 1, cam3({ z: -520, y: -60 })], [RT('E.02'), cam3({ z: -330, y: -50 })], [RT('E.04') - .2, aim(1150, 1060, 700, 1.35)], [RT('E.04') + .9, aim(1150, 1080, 660, 1.75), 'q'], [RT('E.05') + .6, aim(1150, 1080, 660, 1.8)]], .5);
  const S_E01 = {
    id: 'E.01',
    draw(ctx, t, s) {
      const L = look(R, t), c = camE(t), t2 = s.r('E.02'), t3 = s.r('E.03'), t4 = s.r('E.04');
      PL.square(ctx, t, c, L, { people: 7, tables: 1, lanterns: 1 });
      K.stage(ctx, c, [[1150, () => {
        // you, from behind, on the bench
        K.you(ctx, t, BX + 200, BY + 150, 380, { look: lerp(.1, .6, span(t, t3, t3 + 1)), back: .5 });
        // she comes in from the right and sits down (lowers), the clock in her hand; on E.02 she holds it to her ear; on E.03 she looks up at you
        const come = K.sineIO(span(t, s.a - .3, s.a + 2.2)), sitD = K.expoOut(span(t, s.a + 1.8, s.a + 2.8)), x = lerp(1500, BX + 430, come), y = lerp(BY + 30, BY + 120, sitD);
        const ear = K.sineIO(span(t, t2 - .1, t2 + .6)) * (1 - K.sineIO(span(t, t3 - .2, t3 + .4))), up = span(t, t3, t3 + .8);
        const hands = K.girl(ctx, t, x, y, 280, { walk: come < 1 ? K.walkPh(t, .6) : undefined, dir: -1, back: .4, look: -lerp(0, .9, up), armR: [lerp(.6, 2.7, ear), lerp(1.4, 3.3, ear)] });
        S.alarmClock(ctx, t, hands.R[0], hands.R[1] - 10, .42, { rot: -.2 * ear });
        bench(ctx, BX, BY, BW, L);
        if (ear > .6) { ctx.strokeStyle = rgba('#ffe7a8', .5 * (ear - .6) * 2.5); ctx.lineWidth = 2; ctx.setLineDash([4, 8]); for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(hands.R[0], hands.R[1], 40 + k * 22, -1.2, .2); ctx.stroke(); } ctx.setLineDash([]); }
      }]]);
      K.caps(ctx, 'SILENT', W * .64, 300, K.cardU(t, t2 + .5, t3 + .3), { size: 28, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'iris', c: [1100, 520, 120], lead: .4, dur: 1.0 },
  };
  // ---------------------------------------------------------------- E.05–E.10 · the nine GONE lines curl into the border of an old sea chart; the worries become sea monsters; she listens
  const MON = [['E.06', 'LOSING THE JOB', 0, [520, 420]], ['E.07', 'THE BILL', 1, [1360, 400]], ['E.08', 'A CAR YOU NEVER SAW', 2, [560, 720]], ['E.09', 'A PLACE FOR YOU?', 3, [1360, 720]]];
  const S_E05 = {
    id: 'E.05',
    draw(ctx, t, s) {
      const L = look(R, t), t10 = s.r('E.10');
      PL.square(ctx, t, camE(t), L, { people: 7, tables: 1, lanterns: 1 });
      K.scr(ctx, (g) => {
        g.fillStyle = rgba('#0b1440', .5 * clamp(span(t, s.a - .4, s.a + .4))); g.fillRect(0, 0, W, H);
        const cu = span(t, s.a + .5, s.a + 1.3), X0 = 230, Y0 = 150, CW = 1460, CHh = 760;
        // the chart
        if (cu > 0) { g.save(); g.globalAlpha = K.expoOut(cu); g.fillStyle = rgba('#0a1030', .3); g.beginPath(); g.roundRect(X0 + 14, Y0 + 18, CW, CHh, 8); g.fill();
          g.fillStyle = lin(g, X0, Y0, X0 + CW, Y0 + CHh, [[0, '#f4ead2'], [1, '#e6d6b0']]); g.beginPath(); g.roundRect(X0, Y0, CW, CHh, 8); g.fill();
          K.ink(g, rgba(K.PAPER.ink2, .5), 2); for (let k = 0; k < 9; k++) { const yy = Y0 + 120 + k * 70; g.beginPath(); for (let x = X0 + 60; x < X0 + CW - 60; x += 60) { g.moveTo(x, yy); g.quadraticCurveTo(x + 15, yy - 8, x + 30, yy); g.quadraticCurveTo(x + 45, yy + 8, x + 60, yy); } g.stroke(); }
          K.ink(g, K.PAPER.ink, 3); g.beginPath(); g.moveTo(X0 + 640, Y0 + 40); g.bezierCurveTo(X0 + 700, Y0 + 200, X0 + 820, Y0 + 260, X0 + 760, Y0 + 400); g.bezierCurveTo(X0 + 700, Y0 + 520, X0 + 860, Y0 + 640, X0 + 820, Y0 + CHh - 40); g.stroke();   // a coast
          g.save(); g.translate(X0 + CW - 130, Y0 + 130); g.rotate(t * .05); for (let k = 0; k < 8; k++) { g.rotate(Math.PI / 4); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, k % 2 ? -40 : -70); g.stroke(); } g.restore();
          g.font = 'italic 30px "Instrument Serif"'; g.fillStyle = K.PAPER.ink; g.fillText('Here be worries', X0 + 60, Y0 + 70); g.restore(); }
        // the GONE lines fly to the border and become its rope: one segment each, round the chart
        const per = 2 * (CW + CHh) / 9;
        GONE_LINES.forEach((line, i) => { const u = span(t, s.a + .1 + i * .08, s.a + 1.2 + i * .08); if (u >= 1 && cu >= 1) return;
          const sx = 120, sy = 220 + i * 52; g.globalAlpha = 1 - span(u, .5, 1); K.glowText(g, line, lerp(sx, X0 + 40, u), lerp(sy, Y0 + 20 + (i / 9) * CHh, u), { size: 26, weight: 700, col: P.cream, glow: false }); g.globalAlpha = 1; });
        if (cu > 0) { g.strokeStyle = '#8a5a24'; g.lineWidth = 8; g.setLineDash([18, 6]); for (let i = 0; i < 9; i++) { const u = span(t, s.a + .7 + i * .08, s.a + 1.5 + i * .08); if (u <= 0) continue; let d0 = i * per, d1 = d0 + per * u;
            const P2 = (d) => { d = d % (2 * (CW + CHh)); if (d < CW) return [X0 + d, Y0]; d -= CW; if (d < CHh) return [X0 + CW, Y0 + d]; d -= CHh; if (d < CW) return [X0 + CW - d, Y0 + CHh]; d -= CW; return [X0, Y0 + CHh - d]; };
            g.beginPath(); g.moveTo(...P2(d0)); for (let d = d0; d <= d1; d += 20) g.lineTo(...P2(d)); g.stroke(); } g.setLineDash([]); }
        // the monsters, one per worry, each with its name in ink
        MON.forEach(([row, label, kind, [x, y]]) => { const tr = s.r(row), u = span(t, tr - .1, tr + .7); if (u <= 0) return; monster(g, t, kind, x, y, u);
          g.globalAlpha = clamp(u * 2); g.font = '700 24px Inter'; g.fillStyle = K.PAPER.ink; g.textAlign = 'center'; g.letterSpacing = '0.08em'; g.fillText(label, x, y + 120); g.letterSpacing = '0em'; g.textAlign = 'left'; g.globalAlpha = 1; });
        // E.10: she listens, chin on her hands, at the bottom edge of the chart
        const lu = span(t, t10 - .2, t10 + .8); if (lu > 0) { const gy = lerp(1300, 1200, K.expoOut(lu)); K.girl(g, t, 960, gy, 560, { armR: [.5, 3.0], armL: [-.5, -3.0], look: 0, back: .3 }); }
      });
    },
    out: { k: 'sweep', dir: -1, w: 520, lead: .4, dur: 1.0 },
  };
  // ---------------------------------------------------------------- E.11 · THE CORE SENTENCE word by word over the square at dusk
  const S_E11 = {
    id: 'E.11',
    draw(ctx, t, s) {
      const L = look(R, t), c = camK(t, [[s.a - 1, cam3({ z: -300, y: -120 })], [s.b + .6, cam3({ z: -520, y: -160 })]], .5);
      PL.square(ctx, t, c, L, { people: 8, tables: 1, lanterns: 1 });
      K.scrim(ctx, 260, 280, 1400, 420, .55);
      const ws = wordsFrom(T, s.a, 15).map(([w, ts]) => [w.replace(/^twenty$/i, '20').replace(/^fifty,?$/i, '50,'), ts]);
      const l1 = ws.slice(0, 8), l2 = ws.slice(8), hot = (w) => (/worry/i.test(w) ? 1 : 0);
      // 'In twenty fifty' is shown as 'In 2050,' (merge the two number tokens)
      const merged = []; for (const [w, ts] of l1) { if (w === '50,' && merged.length && merged[merged.length - 1][0] === '20') merged[merged.length - 1][0] = '2050,'; else merged.push([w, ts]); }
      K.wordRun(ctx, t, merged, W / 2, 440, 72, { align: 'center' });
      K.wordRun(ctx, t, l2.map(([w, ts]) => [w, ts, hot(w)]), W / 2, 560, 72, { align: 'center' });
    },
    out: { k: 'iris', c: [1300, 540, 80], lead: .3, dur: 1.0 },
  };
  // ---------------------------------------------------------------- E.12–E.16 · the timeline back to NOW · WHO IS THIS FOR? four TODAY cards · LABS · GOVERNMENTS · VOTERS · NOW blinks · ANSWER: empty
  const CARDS = [['PARIS', ['500 MORE CAR-FREE', 'STREETS · VOTE 2025']], ['AUSTRALIA', ['3 FREE HOURS OF', 'POWER A DAY · 2026']], ['CALIFORNIA', ['ROBOTAXIS ORDERED', 'OFF FREEWAYS · 2026']], ['TAIWAN', ['AN "AI DIVIDEND"', 'PLANNED · 2026']]];
  const S_E12 = {
    id: 'E.12',
    draw(ctx, t, s) {
      const t13 = s.r('E.13'), t14 = s.r('E.14'), t15 = s.r('E.15'), t16 = s.r('E.16');
      K.dusk(ctx, t, { glow: [960, 480] });
      K.scr(ctx, (g) => {
        const z = 1 + .02 * span(t, s.a, s.b + 1); g.translate(960, 540); g.scale(z, z); g.translate(-960, -540);
        // the timeline runs back from 2050 (right) to NOW (left)
        const back = K.quartIO(span(t, s.a, s.a + 1.8)), lx0 = 200, lx1 = 1720, ly = 900, nowX = lx0 + 60, dot = lerp(lx1, nowX, back);
        g.strokeStyle = rgba(P.cream, .45); g.lineWidth = 3; g.beginPath(); g.moveTo(lx0, ly); g.lineTo(lx1, ly); g.stroke();
        K.goldLine(g, [[lx1, ly], [dot, ly]], 1, { w: 6 });
        K.glowText(g, '2050', lx1, ly + 46, { size: 30, serif: true, align: 'center', col: P.cream, glow: false });
        const blink = span(t, t15 - .1, t15 + .2) * (.55 + .45 * Math.cos((t - t15) * 9)) + (1 - span(t, t15 - .1, t15 + .2));
        g.fillStyle = K.GOLD.core; g.beginPath(); g.arc(dot, ly, 12 + 6 * span(t, t15, t15 + 1.6) * Math.abs(Math.sin((t - t15) * 4)), 0, 7); g.fill(); K.halo(g, dot, ly, 90, .5);
        if (back > .9) K.glowText(g, 'NOW', nowX, ly + 50, { size: 34, weight: 800, align: 'center', col: '#ffe7a8', glow: false, a: clamp(blink) });
        // WHO IS THIS FOR? and the four cards of today
        const qu = span(t, t13 - .1, t13 + .6); if (qu > 0) K.glowText(g, 'Who is this for?', 960, 150 + 20 * (1 - K.expoOut(qu)), { size: 76, serif: true, align: 'center', col: P.cream, a: qu });
        CARDS.forEach(([head, lines], i) => { const u = span(t, t13 + .6 + i * .35, t13 + 1.3 + i * .35), sh = K.quartIO(span(t, t14 - .2, t14 + .6)); if (u <= 0) return;
          const cx = 330 + i * 420, cy = lerp(300, 230, sh), sc = lerp(1, .88, sh);
          g.save(); g.translate(cx, cy); g.scale(sc, sc); K.paper(g, t, -180, 0, 360, 190, u, { head, headCol: K.PAPER.red, lines, serif: false, lineSize: 24, from: [0, 95] }); g.restore(); });
        // LABS · GOVERNMENTS · VOTERS: lines from the question down to three addressees, then the ANSWER field
        ['LABS', 'GOVERNMENTS', 'VOTERS'].forEach((w, i) => { const u = span(t, t14 + i * .35, t14 + .6 + i * .35); if (u <= 0) return; const x = 560 + i * 400, y = 560;
          g.globalAlpha = u; g.strokeStyle = rgba('#ffe7a8', .6); g.lineWidth = 2; g.beginPath(); g.moveTo(960, 420); g.lineTo(x, y - 46); g.stroke();
          g.strokeStyle = rgba(P.cream, .8); g.beginPath(); g.roundRect(x - 150, y - 40, 300, 70, 10); g.stroke(); K.glowText(g, w, x, y + 8, { size: 30, weight: 800, align: 'center', col: P.cream, glow: false, spacing: .1 }); g.globalAlpha = 1; });
        const au = span(t, t16 - .2, t16 + .5); if (au > 0) { g.globalAlpha = au; K.glowText(g, 'ANSWER:', 620, 740, { size: 32, weight: 700, col: '#ffe7a8', glow: false, spacing: .12 }); g.strokeStyle = rgba(P.cream, .85); g.lineWidth = 3; g.setLineDash([12, 10]); g.beginPath(); g.roundRect(800, 690, 520, 76, 10); g.stroke(); g.setLineDash([]);
          if (Math.sin(t * 6) > 0) { g.fillStyle = P.cream; g.fillRect(824, 706, 4, 44); } g.globalAlpha = 1; }
      });
    },
    out: { k: 'fn', lead: .1, dur: .6, fn: (ctx, u, dA, dB) => (u < .5 ? dA(ctx) : dB(ctx)) },
  };
  // ---------------------------------------------------------------- E.17–E.18 · the field fills: EVERYBODY, over the square at dusk · subscribe 2 over the square
  const S_E17 = {
    id: 'E.17',
    draw(ctx, t, s) {
      const L = look(R, t), t18 = s.r('E.18'), fill = span(t, s.w('everybody') - .1, s.w('everybody') + .5), sq = K.expoOut(span(t, s.a - .2, s.a + 1.6));
      const c = camK(t, [[s.a - 1, cam3({ z: -600, y: -120 })], [s.b + .6, cam3({ z: -420, y: -80 })]], .5);
      K.dusk(ctx, t, { glow: [960, 480] });
      // the empty field opens into the square: the square lives inside the field's rect and fills the frame
      ctx.save(); { const x = lerp(800, -40, sq), y = lerp(690, -40, sq), w = lerp(520, W + 80, sq), h = lerp(76, H + 80, sq); ctx.beginPath(); ctx.roundRect(x, y, w, h, 10 * (1 - sq)); ctx.clip(); }
      PL.square(ctx, t, c, L, { people: 10, tables: 1, lanterns: 1 }); ctx.restore();
      K.scrim(ctx, 460, 300, 1000, 260, .5 * clamp(fill * 2));
      if (fill > 0) K.scr(ctx, (g) => { const e = backOut(clamp(fill)); g.save(); g.translate(960, 440); g.scale(e, e); K.glowText(g, 'everybody.', 0, 0, { size: 140, serif: true, align: 'center', base: 'middle', col: '#ffe7a8' }); g.restore(); });
      K.caps(ctx, 'THE ANSWER', W / 2, 320, K.cardU(t, s.a + .8, t18 + .2), { size: 28, align: 'center', col: P.cream });
      // subscribe 2: the button hangs over the square from the lantern string, pressed once
      const bu = span(t, t18 - .1, t18 + .6), press = span(t, t18 + 1.6, t18 + 1.8) - span(t, t18 + 2.0, t18 + 2.4);
      if (bu > 0) K.scr(ctx, (g) => { const y = lerp(-120, 620, K.expoOut(bu)) + 8 * press, sw = Math.sin(t * 1.1) * .03; g.save(); g.translate(960, y); g.rotate(sw);
        g.strokeStyle = rgba('#1a1a3a', .8); g.lineWidth = 3; g.beginPath(); g.moveTo(-90, 0); g.lineTo(-90, -200); g.moveTo(90, 0); g.lineTo(90, -200); g.stroke();
        g.fillStyle = mixHex('#d8352a', '#fff', .1 * (1 - press)); g.beginPath(); g.roundRect(-170, 0, 340, 104, 20); g.fill(); g.fillStyle = '#fff'; g.font = '800 38px Inter'; g.textAlign = 'center'; g.fillText('SUBSCRIBE', 0, 66);
        K.halo(g, 0, 52, 300, .35 + .25 * press); g.restore(); });
    },
    out: { k: 'iris', c: [960, 680, 90], lead: .35, dur: 1.1 },
  };
  // ---------------------------------------------------------------- E.19–END · YOUR STREET at the square, dusk (leitbild): she winds the clock, it rings · nobody flinches · the children dance · end screen
  const camZ = (t) => camK(t, [[RT('E.19') - 1, cam3({ z: -200, y: -50 })], [RT('E.21'), cam3({ z: -320, y: -60 })], [RT('END'), cam3({ z: -560, y: -110 })], [RT('END') + 15, cam3({ z: -760, y: -140, x: 40 })]], .6);
  const S_E19 = {
    id: 'E.19',
    draw(ctx, t, s) {
      const L = look(R, t), t20 = s.r('E.20'), t21 = s.r('E.21'), wind = span(t, s.a + .2, s.a + 1.6), ring = span(t, s.a + 1.7, s.a + 1.9);
      S.street(ctx, t, camZ(t), L, { apples: 1, bayTrees: 1, solar: 1, walkers: 1, lanterns: 1, fore: false, hl: (i) => .45 + .15 * Math.sin(t * .7 + i), chalk: 1,
        focus: (g) => {
          // she winds the clock (the key turns), then holds it up; it rings
          const hands = K.girl(g, t, 980, 1000, 230, { armR: [lerp(1.6, 2.7, ring), lerp(2.2, 3.1, ring)], armL: [-1.4 - .3 * Math.sin(t * 8) * (1 - ring) * wind, -2.0], look: .3 + .3 * ring, dir: -1 });
          S.alarmClock(g, t, hands.R[0], hands.R[1] - 20, .55, { ring, hh: -1.9, mm: -1.57 + .9 + wind * 2 });
          if (ring > 0) K.halo(g, hands.R[0], hands.R[1] - 30, 200, .35 * ring);
          // you beside her, nobody flinches: people keep talking at the tables
          K.you(g, t, 1220, 1010, 280, { pose: 'look', look: -.5 + .1 * Math.sin(t * .6), dir: -1 });
          K.folk(g, t, 3, 1500, 1000, 250, { armR: [1.7 + .3 * Math.sin(t * 2), 2.1], look: -.4, dir: -1 }); K.folk(g, t, 5, 1660, 1004, 240, { look: .5, dir: -1, armR: [.6 + .2 * Math.sin(t * 2.4 + 1), 1.2] });
          // the children dance to the ringing
          const dn = span(t, t21 - .3, t21 + .8);
          for (let k = 0; k < 4; k++) { const bx = 360 + k * 130, ph = t * 4.4 + k * 1.3, hop = dn * Math.max(0, Math.sin(ph)) * 26;
            const o = dn > 0 ? { armR: [2.4 + .5 * Math.sin(ph), 2.8], armL: [-2.4 - .5 * Math.sin(ph + 1), -2.8], dir: k % 2 ? 1 : -1, lean: .1 * Math.sin(ph) * dn } : { pose: 'look', look: .4, dir: k % 2 ? 1 : -1 };
            (k === 1 ? K.girl : (gg, tt, x, y, h, oo) => K.folk(gg, tt, 6 + k, x, y, h, oo))(g, t, bx, 1010 - hop, 150 + (k % 2) * 16, o); }
        } });
      K.caps(ctx, 'NOBODY FLINCHES', W / 2, 220, K.cardU(t, t20 + .1, t21 + .4), { size: 30, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'cut' },
  };
  return [S_E01, S_E05, S_E11, S_E12, S_E17, S_E19];
}
