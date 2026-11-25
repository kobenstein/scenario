// c08 · PART 5 THE MINDS (builder B2) · 'And a lab is an empty' (inner B2 plate B.plateLab) → 'So suppose all five' (plateFour, B3).
// Carriers: the plan steps aside, the lab rises dark and empty · the minds piece lifts out and we fly into it: a round warm window opens on
// her desk in Paris · two letters slide in from both sides (Europe left, America right) · their pay bars rise out of them · her hand goes
// right · the Europe letter flips into the stock-option certificate · 27 copies fan out · a pull back: it sits inside the "EU INC" paper ·
// the paper folds down into a ground line: the walk-out to the right (2023 vs 2025, ★ half the stream) · a few walk back right → left ·
// the HUD comes down into the plan: OPEN · a rule booklet cannot fill the slot · one person walks up to the loose piece → plateFour.
//
// | ID   | anchor (phrase)                    | zeigt wörtlich                                                    | kind  | carrier out              |
// |------|------------------------------------|-------------------------------------------------------------------|-------|--------------------------|
// | 7.01 | And a lab is an empty              | the lab dark and empty; the minds slot lit: THE MINDS               | EXPL  | the minds piece → window |
// | 7.02 | Picture a researcher in Paris      | her desk at night in Paris, two offer letters EUROPE · AMERICA       | SCENE | the right letter         |
// | 7.03 | The other, in America              | pay bars out of the letters: UP TO +70% (before stock options)       | MIX   | her hand                 |
// | 7.04 | Many take it                       | her hand reaches for the America letter                             | SCENE | the Europe letter flips  |
// | 7.05 | Part of Europe's answer            | STOCK OPTIONS, TAXED ON SALE: same card in every country, tax at SELL | EXPL | the certificate          |
// | 7.06 | But look where that answer sits    | pull back: it sits inside the "EU INC" paper: STILL ON PAPER        | EXPL  | the paper folds down     |
// | 7.07★| And yet, something has shifted     | the walk-out right: 2023 stream vs 2025 half: −45% IN TWO YEARS     | EXPL  | the lanes                |
// | 7.08 | A few are even moving              | a few walk right → left: “CHOOSE EUROPE FOR SCIENCE”                 | EXPL  | the HUD                  |
// | 7.09 | So the fifth part stays open       | the plan: OPEN, a law cannot fill the slot, one person at a time     | EXPL  | plateFour                |
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
    a: R.a, empty: G('an empty building'), fifth: G('without the fifth part'), cant: G("The one that can't be built"), picture: G('Picture a researcher'),
    paris: G('in Paris'), doct: G('just finished her doctorate'), two: G('Two offers'), keeps: G('One keeps her in Europe'), other: G('The other, in America'),
    seventy: G('seventy percent more'), before: G('Before stock options'), many: G('Many take it'), answer: G("Part of Europe's answer"), same: G('the same in every country'),
    options: G('stock options that work'), taxed: G('taxed only when'), sell: G('when you sell'), look: G('But look where'), inside: G('Inside that new'), still: G("The one that's still on paper"),
    shifted: G('And yet, something has shifted'), leaving: G('Researchers leaving'), half: G('by almost half'), few: G('A few are even'), open: G('So the fifth part stays open'),
    brussels: G("It can't be passed"), won: G('It has to be won'), person: G('one person at a time'), end: R.b,
  };
  A.minds = T.G('minds', 0, A.cant);
  const D = S.PLATE_DISC, t0 = R.a + S.SEAM_HALF, tP = R.b - S.SEAM_HALF, PI5 = 4;
  const lab = (t, a, b) => span(t, a, a + .7) * (1 - span(t, b - .45, b + .1));

  // ---------------------------------------------------------------- the camera: the plate's creep, settling; back to s 1 for plateFour
  const creep = (t) => { const d = Math.max(0, t - (R.a - S.SEAM_HALF)); return d <= 1 ? 1 + .04 * d : 1.04 + .12 * (1 - Math.exp(-(d - 1) / 3)); };
  const view = (t) => { const back = sineIO(span(t, A.open - .4, A.open + 2.2)), f = 1 - span(t, tP - 3, tP), late = t - t0;
    return { x: 960 + 8 * Math.sin(late * .2) * f * span(late, 0, 3), y: 540 + 5 * Math.sin(late * .16 + 1) * f * span(late, 0, 3), s: lerp(creep(t), 1, back) }; };

  // ---------------------------------------------------------------- 7.01 the plan steps aside, the dark lab
  const DL = { x: 600, y: 470, r: 205 }, LABB = { x: 1340, y: 720, w: 560 };
  const slide = (t) => sineIO(span(t, A.empty - .4, A.empty + 1.3));
  const discAt = (t, v) => { const [x, y] = X.toScreen(v, D.x, D.y), k = slide(t); return { x: lerp(x, DL.x, k), y: lerp(y, DL.y, k), r: lerp(D.r * v.s, DL.r, k) }; };
  // the minds piece lifts out and grows until we are inside it (a round warm window opens in it: her room)
  const push = (t) => span(t, A.picture - .4, A.picture + 2.5);
  const MP = (t, v) => { const d = discAt(t, v), [px, py] = F.pieceCentre(PI5, d.x, d.y, d.r), u = sineIO(push(t)), rot = (-Math.PI / 2 - F.PIECE_ANG[PI5]) * u;
    return { x: lerp(px, 960, u), y: lerp(py, 640, u), r: Math.exp(lerp(Math.log(d.r), Math.log(4200), u)), rot }; };
  const hudParts = (t) => F.kitParts(T, t).parts.map((p, i) => (i === PI5 && t >= A.picture - .3 && t < A.open - .3 ? { ...p, fade: 0 } : p));

  // ---------------------------------------------------------------- 7.02–7.04 her room in Paris
  const DESK = { y: 730, x0: 330, x1: 1590 }, LET = [{ x: 1020, from: -260 }, { x: 1330, from: 2180 }], LW = 200, LH = LW * 1.3;
  function room(ctx, t, k) {   // k: 0..1 how far the room is there (it sinks away on 'Part of Europe's answer')
    const sinkY = span(t, A.answer, A.answer + 1.55) ** 2.2 * 1200;
    if (sinkY >= 1100) return sinkY;
    ctx.save(); ctx.translate(0, sinkY);
    ctx.fillStyle = E.lin(ctx, 0, 0, 0, H, [[0, mixHex(P.night0, P.ind1, .35)], [1, mixHex(P.night1, P.ind1, .5)]]); ctx.fillRect(-20, -20, W + 40, H + 1200);
    // the window at the back: Paris roofs at night (mansards, chimneys, a few warm windows)
    const wx = 230, wy = 150, ww = 520, wh = 470;
    ctx.fillStyle = mixHex(P.night0, P.blue0, .35); ctx.fillRect(wx, wy, ww, wh);
    ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip();
    E.stars(ctx, 77, 26, t, [wx, wy, ww, wh * .5], .7);
    const r = prng(5); ctx.fillStyle = mixHex(P.night0, P.ind2, .4);
    for (let i = 0; i < 7; i++) { const bx = wx - 20 + i * 86 + r() * 20, bh = 140 + r() * 120, top = wy + wh - bh;
      ctx.beginPath(); ctx.moveTo(bx, wy + wh); ctx.lineTo(bx, top + 30); ctx.lineTo(bx + 14, top); ctx.lineTo(bx + 76, top); ctx.lineTo(bx + 90, top + 30); ctx.lineTo(bx + 90, wy + wh); ctx.fill();
      ctx.fillRect(bx + 20 + r() * 40, top - 26, 12, 28);
      for (let j = 0; j < 3; j++) if (r() > .55) { ctx.fillStyle = rgba(LAMP.body, .7); ctx.fillRect(bx + 14 + j * 22, top + 50 + r() * 60, 10, 16); ctx.fillStyle = mixHex(P.night0, P.ind2, .4); } }
    ctx.restore();
    ctx.strokeStyle = mixHex(P.night0, P.ind1, .2); ctx.lineWidth = 10; ctx.strokeRect(wx, wy, ww, wh); ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.moveTo(wx, wy + wh * .45); ctx.lineTo(wx + ww, wy + wh * .45); ctx.stroke();
    // the desk lamp (her light)
    halo(ctx, 520, 610, 520, .5, LAMP.body, LAMP.core);
    // her: she stands at the desk, looks down at the two letters; on 'Many take it' her hand goes to the right letter
    const reach = sineIO(span(t, A.many - .2, A.many + 1.0));
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, DESK.y + 4); ctx.clip();
    E.person(ctx, 760, DESK.y + 250, 600, { dir: 1, light: .9, long: true, look: .35 + .05 * Math.sin(t * .7) - .25 * reach, lean: .02 + .05 * reach,
      armR: [lerp(.6, 1.75, reach), lerp(1.2, 1.9, reach)], armL: [-.15, -.05], rim: mixHex(LAMP.body, P.blue1, .3) });
    ctx.restore();
    ctx.fillStyle = mixHex(P.night1, P.blue1, .32); ctx.fillRect(DESK.x0, DESK.y, DESK.x1 - DESK.x0, 26); ctx.fillRect(DESK.x0 + 40, DESK.y + 26, 16, 300); ctx.fillRect(DESK.x1 - 56, DESK.y + 26, 16, 300);
    ctx.fillStyle = rgba(mixHex(GOLD.line, P.blue1, .5), .4); ctx.fillRect(DESK.x0, DESK.y, DESK.x1 - DESK.x0, 2);
    ctx.fillStyle = mixHex(P.night0, P.blue1, .45); ctx.fillRect(516, 610, 8, 120); ctx.fillRect(480, 722, 80, 10);
    ctx.fillStyle = mixHex(CREAM, LAMP.body, .4); ctx.beginPath(); ctx.moveTo(470, 616); ctx.lineTo(570, 616); ctx.lineTo(548, 560); ctx.lineTo(492, 560); ctx.closePath(); ctx.fill();
    ctx.restore();
    return sinkY;
  }
  const letterPos = (t, i) => { const L = LET[i], u = expoOut(span(t, A.two - .1 + i * .25, A.two + 1.0 + i * .25)), lift = i === 0 ? 14 * sineIO(span(t, A.keeps, A.keeps + .8)) : 14 * sineIO(span(t, A.other, A.other + .8));
    return { x: lerp(L.from, L.x, u), y: DESK.y - LH / 2 - 4 - lift, u }; };

  // ---------------------------------------------------------------- 7.05–7.06 the certificate and the "EU INC" paper
  const CERT = { x: 960, y: 470, w: 520, h: 330 };
  const zoomK = (t) => sineIO(span(t, A.look - .1, A.look + 1.8));            // 0: the certificate big · 1: inside the EU INC sheet
  const certBox = (t) => { const z = lerp(1, .42, zoomK(t)); return { x: 960, y: lerp(470, 540, zoomK(t)), w: CERT.w * z, h: CERT.h * z, z }; };
  const COPIES = Array.from({ length: 27 }, (_, i) => [300 + (i % 14) * 101 + (i >= 14 ? 50 : 0), 735 + (i >= 14 ? 58 : 0)]);

  // ---------------------------------------------------------------- 7.07–7.08 the lanes (the walk-out right)
  const LANES = [{ y: 520, sp: 120, label: '2023', at: A.shifted + .7, x0: 780 }, { y: 770, sp: 120 / .55, label: '2025', at: A.half - .3, x0: 780 }];
  const SPEED = 150;

  function draw(ctx, t) {
    const v = view(t);
    X.sheet(ctx, t, v, { lx: D.x, ly: D.y });

    // ---- 7.01 the dark, empty lab rises at the right
    const lr = span(t, A.empty - .2, A.empty + 1.1), ls = span(t, A.picture - .3, A.picture + .9);
    if (lr > 0 && ls < 1) {
      X.lightLine(ctx, [[LABB.x - 340, LABB.y], [LABB.x + 340, LABB.y]], lr * (1 - ls), { a: .45, w: 2.5 });
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, LABB.y + 1); ctx.clip(); B.labBuilding(ctx, t, LABB.x, LABB.y + expoIn(ls) * 300, LABB.w, { rise: lr, lit: 0 }); ctx.restore();
    }
    X.label(ctx, 'AN EMPTY BUILDING', LABB.x, 330, lab(t, A.empty + .3, A.picture), { size: 32 });

    // ---- the plan: big (plate) → aside → its minds piece lifts (we fly in) and the disc flies up into the HUD → down again for OPEN
    const hudOut = span(t, A.picture - .2, A.picture + 1.6), kOpen = span(t, A.open - .4, A.open + 1.2);
    const plan = () => {
      if (t < A.picture - .2) { const d = discAt(t, v); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.kitDisc(ctx, t, d.x, d.y, d.r, hudParts(t), { glow: .8, stars: 0, loose: { x: d.x + d.r * 1.32, y: d.y + d.r * 1.06, rot: .35 } }); ctx.restore(); }
      else if (t < A.open - .4) { const d = discAt(t, v); B.hudDisc(ctx, t, T, 1 - hudOut, d, { parts: hudParts(t) }); }
      else B.hudDisc(ctx, t, T, Math.min(1, kOpen), { x: D.x, y: D.y, r: D.r }, { parts: S.momentParts(T, t) });   // screen space: the view reaches s 1 by tP
    };
    if (t < A.picture - .2) plan();
    const ml = lab(t, A.fifth + .2, A.picture - .1), d1 = discAt(t, v), [mx, my] = F.pieceCentre(PI5, d1.x, d1.y, d1.r);
    if (ml > 0) X.lightLine(ctx, [[mx + 40, my + 40], [mx + 120, my + 150]], ml, { a: .6, w: 1.5 });
    X.label(ctx, 'THE FIFTH PART', mx + 130, my + 180, lab(t, A.fifth + .3, A.minds), { size: 28, align: 'left' });
    X.big(ctx, 'MINDS', mx + 130, my + 196, 64, lab(t, A.minds - .1, A.picture - .1), { gold: .8, align: 'left' });

    // ---- 7.02 we fly into the minds piece: a round warm window opens in it on her room
    const pu = push(t);
    let sinkY = 0;
    if (pu > 0) {
      const p = MP(t, v), win = span(pu, .25, 1) ** 2.2, rr = lerp(p.r * .12, 1500, win);
      if (pu < 1) F.loosePiece(ctx, t, PI5, p.x, p.y, p.r, { kind: 'blank', lit: 1, rot: p.rot });
      if (rr > 0 && t < A.answer + 1.6) {
        ctx.save(); if (win < 1) { ctx.beginPath(); ctx.arc(p.x, p.y, rr, 0, Math.PI * 2); ctx.clip(); halo(ctx, p.x, p.y, rr * 1.2, .3 * (1 - win), LAMP.body, LAMP.core); }
        sinkY = room(ctx, t, win);
        // the two letters (Europe from the left, America from the right) and their pay bars (7.03)
        ctx.save(); ctx.translate(0, sinkY);
        const flip = span(t, A.answer - .1, A.answer + .7);
        for (let i = 0; i < 2; i++) {
          const L = letterPos(t, i); if (L.u <= 0) continue;
          if (i === 0 && flip > 0) continue;   // the Europe letter becomes the certificate (drawn below, outside the room)
          F.letter(ctx, t, L.x, L.y, LW, { head: SRC.offers[i], u: 1, rot: (i ? .02 : -.02) });
          const bu = sineIO(span(t, (i ? A.seventy : A.other + .6) - .3, (i ? A.seventy : A.other + .6) + .9)) * (1 - expoIn(span(t, A.many - .2, A.many + .5)));
          if (bu > 0) { const bh = (i ? 1.7 : 1) * 150 * bu, bx = L.x - 46, by = L.y - LH / 2 - 10;
            if (i) halo(ctx, bx + 46, by - bh, 160, .25 * bu, COOL.halo, COOL.core);
            ctx.fillStyle = i ? rgba(mixHex(COOL.body, P.night1, .2), .95) : mixHex(LAMP.body, GOLD.mid, .25); ctx.beginPath(); ctx.roundRect(bx, by - bh, 92, bh, [6, 6, 0, 0]); ctx.fill();
            const ex = span(t, A.before - .1, A.before + .8) * (1 - expoIn(span(t, A.many - .2, A.many + .5)));
            if (i && ex > 0) { ctx.setLineDash([9, 7]); ctx.strokeStyle = rgba(CREAM, .8 * ex); ctx.lineWidth = 2; ctx.strokeRect(bx + 3, by - bh - 70 * ex, 86, 70 * ex - 3); ctx.setLineDash([]); } }
        }
        ctx.restore();
        ctx.restore();
      }
    }
    if (t >= A.picture - .2) plan();   // the HUD stays above her room
    X.label(ctx, 'PARIS', 490, 120, lab(t, A.paris, A.two) * (sinkY < 1 ? 1 : 0), { size: 30, spacing: .2 });
    X.label(ctx, 'PHD, JUST FINISHED', 960, 160, lab(t, A.doct, A.two + .2), { size: 28, col: CREAM2 });
    X.big(ctx, SRC.pay70, 1330, 170, 64, lab(t, A.seventy - .1, A.many), { gold: .3 });
    X.label(ctx, 'BEFORE STOCK OPTIONS', 1450, 290, lab(t, A.before + .2, A.many), { size: 22, align: 'left', col: CREAM2 });
    F.source(ctx, t, A.seventy, A.many + .3, SRC.pay70Src);

    // ---- 7.05 the Europe letter flips into the certificate: STOCK OPTIONS, TAXED ON SALE · the same in every country · tax at SELL
    const flip = span(t, A.answer - .1, A.answer + .7), come = sineIO(span(t, A.answer + .2, A.answer + 1.6)), fold = sineIO(span(t, A.shifted - .1, A.shifted + 1.3));
    if (flip > 0 && fold < 1) {
      const L = letterPos(t, 0), cb = certBox(t), x = lerp(L.x, cb.x, come), y = lerp(L.y, cb.y, come), sw = flip < .5 ? Math.cos(Math.PI * flip) : -Math.cos(Math.PI * flip);
      // 7.06 the EU INC paper around it (revealed by the pull back), it folds down into a ground line on 'something has shifted'
      const z = zoomK(t);
      if (z > 0) euInc(ctx, t, z, fold);
      ctx.save(); ctx.translate(x, y + fold * (LANES[0].y - 540)); ctx.scale(Math.max(.02, Math.abs(sw)), 1 - fold);
      if (flip < .5) F.letter(ctx, t, 0, 0, LW, { head: SRC.offers[0], u: 1, rot: -.02 });
      else cert(ctx, t, lerp(LW, cb.w, come), lerp(LH, cb.h, come), cb.z * come + (1 - come) * .4);
      ctx.restore();
    }
    const cu = span(t, A.same - .2, A.same + 1.1) * (1 - sineIO(span(t, A.look - .2, A.look + .8)));
    if (cu > 0) COPIES.forEach(([cx, cy], i) => { const u = sineIO(clamp(cu * 1.6 - (i % 14) / 14 * .6)), x = lerp(960, cx, u), y = lerp(560, cy, u);
      ctx.save(); ctx.translate(x, y); ctx.fillStyle = mixHex(PAPER.lit, PAPER.body, .3); ctx.fillRect(-26, -17, 52, 34); ctx.strokeStyle = rgba(GOLD.mid, .8); ctx.lineWidth = 1.5; ctx.strokeRect(-22, -13, 44, 26); ctx.restore(); });
    X.big(ctx, SRC.options, 960, 230, 60, lab(t, A.options - .1, A.look), { gold: .5 });
    X.label(ctx, 'THE SAME IN EVERY COUNTRY', 960, 880 - 40, lab(t, A.same + .4, A.look), { size: 26, col: CREAM2 });
    F.source(ctx, t, A.answer + 1.0, A.same + .2, SRC.optionsSrc);
    X.big(ctx, SRC.euInc, 960, 205, 64, lab(t, A.inside - .1, A.shifted), { gold: .1 });
    X.label(ctx, 'STILL ON PAPER', 960, 860, lab(t, A.still + .3, A.shifted), { size: 30, spacing: .14 });
    // the minds piece tries to click into the paper and finds only paper (it slides out of the HUD, touches, slides back)
    const tr = span(t, A.still + .2, A.still + 2.4);
    if (tr > 0 && tr < 1) { const hp = F.pieceCentre(PI5, F.HUD.x, F.HUD.y, F.HUD.r), k = Math.sin(Math.PI * tr), e = sineIO(k);
      F.loosePiece(ctx, t, PI5, lerp(hp[0], 1420, e), lerp(hp[1], 300, e), lerp(F.HUD.r, 150, e), { kind: 'blank', lit: 1, rot: -.2 * e }); }

    // ---- 7.07 ★ the walk-out right: 2023 vs 2025 (half the stream) · 7.08 a few walk back right → left
    const sinkL = span(t, A.open - .9, A.open + .3);
    LANES.forEach((ln, li) => {
      const lu = span(t, ln.at, ln.at + 1.0), ret = sineIO(span(t, A.open - .3, A.open + .5)); if (lu <= 0 || ret >= 1) return;
      const y = ln.y, rise = (1 - expoOut(lu)) * 190 + expoIn(sinkL) * 190, ll = lu * (1 - ret);
      // a low light band behind the walkers (they read as silhouettes against it)
      if (ll > 0) { ctx.save(); ctx.globalAlpha = ll * (1 - sinkL); ctx.fillStyle = E.lin(ctx, 0, y - 210, 0, y, [[0, rgba(COOL.halo, 0)], [1, rgba(li ? LAMP.body : COOL.halo, .16)]]); const g0 = ctx.globalAlpha; for (let i = 0; i < 42; i++) { const xx = 120 + i * 40; ctx.globalAlpha = g0 * Math.sin(Math.PI * (i + .5) / 42) ** .7; ctx.fillRect(xx, y - 210, 40.5, 210); } ctx.restore(); }
      X.lightLine(ctx, [[960, y], [120, y]], ll, { a: .55, w: 2.5 }); X.lightLine(ctx, [[960, y], [1800, y]], ll, { a: .55, w: 2.5 });
      X.label(ctx, ln.label, 150, y + 44, lab(t, ln.at + .4, A.open), { size: 28, align: 'left', gold: li ? .6 : 0, col: li ? GOLD.text : CREAM });
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, y + 1); ctx.clip();
      for (let k = 0; k < 40; k++) { const x = ln.x0 + (t - ln.at) * SPEED - k * ln.sp; if (x < -80 || x > 2000) continue; B.walker(ctx, t, x, y + rise, 150, 1, k * 1.7, { rim: CREAM }); }
      if (li === 1) for (let k = 0; k < 3; k++) { const x = 2000 - (t - A.few + .2) * SPEED * .9 - k * 230; if (x > 2000 || x < -80 || t < A.few - .2) continue;
        B.walker(ctx, t, x, y + rise, 150, -1, k * 2.1, { rim: mixHex(LAMP.body, GOLD.line, .3) }); }
      ctx.restore();
    });
    const pf = span(t, A.shifted + .2, A.shifted + 1.4) * (1 - sinkL);
    if (pf > 0) X.label(ctx, 'EU → AMERICA', 1800, 440, lab(t, A.leaving + .3, A.open), { size: 26, align: 'right', col: CREAM2 });
    X.big(ctx, SRC.brain45, 960, 250, 84, lab(t, A.half + .3, A.open), { gold: .8 });
    F.source(ctx, t, A.leaving + .5, A.few + .1, SRC.brain45Src);
    X.label(ctx, SRC.chooseEurope, 960, 834, lab(t, A.few + .5, A.open + .2), { size: 30, gold: .5, col: GOLD.text });
    F.source(ctx, t, A.few + .5, A.open + .6, SRC.chooseEuropeSrc);

    // ---- 7.09 the plan: OPEN · a rule booklet cannot fill the slot · one person walks up to the loose piece
    const vu = span(t, A.open + .5, A.open + 1.3) * (1 - span(t, tP - 1.2, tP - .5));
    if (vu > 0) F.verdict(ctx, t, D.x - 330, D.y + 40, F.KIT.parts[PI5].verdict, vu, { size: 34 });
    const bk = span(t, A.brussels - .1, A.brussels + 1.8);
    if (bk > 0 && bk < 1) { const [sx, sy] = F.pieceCentre(PI5, D.x, D.y, D.r), k1 = sineIO(clamp(bk * 1.8)), fall = expoIn(span(bk, .6, 1));
      F.ruleBook(ctx, t, lerp(-80, sx - 30, k1) + fall * 40, lerp(sy + 40, sy + 30, k1) + fall * 700, 92, { u: 1, rot: fall * .8 - .05 }); }
    const pw = span(t, A.person - .4, A.person + 2.0), out = span(t, tP - 1.4, tP - .6);
    if (pw > 0 && out < 1) {
      const GY = 852 + expoIn(out) * 260, x = lerp(1980, 1330, sineIO(pw));
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 853); ctx.clip();
      X.lightLine(ctx, [[1900, GY], [1150, GY]], span(t, A.person - .5, A.person + .5), { a: .4, w: 2 });
      B.walker(ctx, pw < 1 ? t : A.person + 2.0, x, GY, 110, -1, 0, { rim: mixHex(LAMP.body, GOLD.line, .4) });
      if (pw >= 1) halo(ctx, x, GY - 120, 120, .25, LAMP.body, LAMP.core);
      ctx.restore();
    }
  }
  function cert(ctx, t, w, h, z) {   // the stock-option certificate (paper, a fine gold border, a tiny GRANT → SELL line where the tax falls)
    ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-w / 2 + 8, -h / 2 + 10, w, h);
    ctx.fillStyle = E.lin(ctx, 0, -h / 2, 0, h / 2, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.strokeStyle = rgba(GOLD.mid, .9); ctx.lineWidth = Math.max(1, w * .006); ctx.strokeRect(-w / 2 + w * .04, -h / 2 + w * .04, w * .92, h - w * .08);
    ctx.strokeRect(-w / 2 + w * .055, -h / 2 + w * .055, w * .89, h - w * .11);
    ctx.fillStyle = rgba(PAPER.faint, .5); for (let j = 0; j < 3; j++) ctx.fillRect(-w * .3, -h * .18 + j * h * .1, w * (.6 - j * .12), Math.max(1, h * .02));
    if (w > 300) {   // GRANT → SELL, the tax tag drops on SELL ('taxed only when you sell')
      const a = clamp((w - 300) / 120), yl = h * .26, x0 = -w * .3, x1 = w * .3;
      ctx.save(); ctx.globalAlpha *= a;
      ctx.strokeStyle = rgba(PAPER.ink, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, yl); ctx.lineTo(x1, yl); ctx.stroke();
      for (const xx of [x0, x1]) { ctx.beginPath(); ctx.arc(xx, yl, 6, 0, Math.PI * 2); ctx.fillStyle = PAPER.ink; ctx.fill(); }
      E.glowText(ctx, 'GRANT', x0, yl + 34, { size: 22, weight: 700, col: PAPER.ink, glow: false, align: 'center', spacing: .08 });
      E.glowText(ctx, 'SELL', x1, yl + 34, { size: 22, weight: 700, col: PAPER.ink, glow: false, align: 'center', spacing: .08 });
      const tg = expoOut(span(t, A.sell - .1, A.sell + .5));
      if (tg > 0) { ctx.globalAlpha *= clamp(tg * 3); ctx.fillStyle = GOLD.deep; ctx.beginPath(); ctx.roundRect(x1 - 34, yl - 58 + (1 - tg) * -30, 68, 32, 16); ctx.fill();
        E.glowText(ctx, 'TAX', x1, yl - 35 + (1 - tg) * -30, { size: 22, weight: 700, col: PAPER.lit, glow: false, align: 'center', spacing: .1 }); }
      ctx.restore();
    }
  }
  function euInc(ctx, t, z, fold) {   // the "EU INC" paper (cream, ruled, dashed edge = on paper), z 0..1 the pull back, fold 0..1 folds down
    const cb = certBox(t), s = 1, w = lerp(cb.w, 1000, z), h = lerp(cb.h, 600, z) * (1 - fold), cx = 960, cy = lerp(cb.y, 540, z) + fold * (LANES[0].y - 540);
    if (h < 1) { X.lightLine(ctx, [[cx - w / 2, cy], [cx + w / 2, cy]], 1, { a: .5, w: 2.5 }); return; }
    ctx.save(); ctx.translate(cx, cy);
    ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-w / 2 + 10, -h / 2 + 14, w, h);
    ctx.fillStyle = E.lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, mixHex(P.night1, PAPER.shade, .2)], [1, mixHex(P.night1, PAPER.shade, .1)]]); ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.strokeStyle = rgba(PAPER.lit, .14); ctx.lineWidth = 1.2; for (let y = -h / 2 + 40 * s; y < h / 2; y += 34 * s) { ctx.beginPath(); ctx.moveTo(-w / 2 + 30, y); ctx.lineTo(w / 2 - 30, y); ctx.stroke(); }
    ctx.setLineDash([14, 10]); ctx.lineDashOffset = -t * 10; ctx.strokeStyle = rgba(PAPER.lit, .8); ctx.lineWidth = 3; ctx.strokeRect(-w / 2 + 12, -h / 2 + 12, w - 24, h - 24); ctx.setLineDash([]);
    ctx.restore();
  }

  const marks = [A.empty, A.picture, A.two, A.other, A.many, A.answer, A.look, A.shifted, A.half, A.few, A.open, A.person];
  return [{ t: R.a, draw: (ctx, t) => B.plateLab(ctx, t, T), print: PR }, { t: t0, draw, print: PR }, ...marks.map((t) => ({ t, draw, print: PR })),
    { t: tP, draw: (ctx, t) => S.plateFour(ctx, t, T), print: PR }];
};
