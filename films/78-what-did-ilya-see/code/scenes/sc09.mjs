// Film 78 · c09 (B2) · 'He wants more than a machine that obeys' (446.48) → 'So what do you do?' (529.55) · ONE take in the Leitbild space:
// out of the light under the lab door up into the sky above the building, then along the sky to the right, into the hall.
//   8.01  the light seam lifts off the floor and bends into the machine ring; command arrows push at it: OBEYS
//   8.02  the arrows fall away, the ring turns warm and bends its light round small figures like a shelter: CARES
//   8.03  quote "care about sentient life" · PODCAST, NOV 2025 (grows out of the ring, folds back into it)
//   8.04  a circle of small lights inside the shelter        8.05 you · a child · a dog step into the light on the beats
//   8.06  the ring's own small (cool) light comes down and joins the circle
//   8.07 ★ the machine lights multiply until they fill the sky; the human lights stay few (THE INTERVIEWER'S OBJECTION)
//   8.08  they fly into one bar: HUMANS a thin sliver, MACHINES the rest
//   8.09  the man in his light column, facing us         8.10 "It's true." "It's possible it's not the best criterion."
//   8.11  the card turns over into a blueprint with large empty areas   8.12 HOW TO BUILD IT: —
//   8.13  a small warm light rises out of the unfinished ring; ONE CONDITION (the gold knot)
//   8.14  a row of machine rings, the first ones lit: THE FIRST ONES; "if those do care": the warm light goes into the first
//   8.15  C5 grows out of the first ring (slot), shrinks back into it
//   8.16  a bar AT LEAST FOR QUITE SOME TIME, its far end soft     8.17 the warm light held in a hand
//   8.18  builders' hands put light into the first rings: WHAT THE BUILDERS PUT IN
//   8.19  their paths converge on one point: A MACHINE THAT CARES   8.20 the LINE: the AFTER side warms, first dawn
//   8.21  a dashed ring (it does not exist yet), a ? in front      8.22 the ring opens into the hall: sound reaches you in the back row
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f78_kit.mjs';
import * as S from '../lib/f78_world.mjs';
import * as B from '../lib/b2_kit.mjs';
import { doorSeam, hallSeam, SEAM, HALL } from '../lib/b2_seams.mjs';
import { createCanvas } from '@napi-rs/canvas';
const { W, H, P, clamp, lerp, span, sineIO, expoOut, expoIn, rgba, halo, mixHex, prng } = E;
const { mv, land, rise, GOLD, CREAM, CREAM2, COOL, PAPER } = F;
const TAU = Math.PI * 2;

export default (T, R) => {
  const G = (p, n = 0, a = -1) => T.G(p, n, a);
  const DS = doorSeam(T), HS = hallSeam(T), tB = DS.tB;
  const tCares = G('He wants one that cares'), tWords = G('In his words, an AI'), tSent = G('care about sentient life', 0, tWords);
  const tFeel = G('Everything that can feel'), tYou = G('You. Your children'), tKids = G('Your children', 0, tYou), tDog = G('Your dog', 0, tKids);
  const tExp = G('And, he expects, the machine itself'), tItself = G('the machine itself', 0, tExp);
  const tInt = G('His own interviewer pushed back'), tFar = G('far outnumber us', 0, tInt), tMin = G('We would be a small minority');
  const tDodge = G('Ilya did not dodge'), tTrue = G("It's true, he said", 0, tDodge), tTrue2 = G("It's possible it's not the best criterion", 0, tTrue);
  const tPlan = G('So this is no finished plan'), tHow = G('And he has not said how'), tHope = G('But here is his hope'), tCond = G('its one condition', 0, tHope);
  const tFirst = G('It is about the first truly powerful'), tCare = G('If those do care', 0, tFirst);
  const C5 = T.clip('C5'), tNot = G('Not forever'), tLeast = G('At least for quite some time', 0, tNot);
  const tHonest = G('An honest hope'), tHang = G('And it hangs on one thing'), tPut = G('what the builders of those first machines', 0, tHang);
  const tBelieve = G('Ilya believes that in the end'), tMTC = G('a machine that cares', 0, tBelieve);
  const tReason = G('And there is reason for hope'), tAsked = G('The question is being asked'), tBefore = G('before the machine exists', 0, tAsked);
  const tPub = HS.tPub;

  // ---------------------------------------------------------------------------------------------- the world (Leitbild space, the sky above the building)
  const RING0 = { x: 250, y: -470, r: 90 }, FY = -60, SH = { x: 250, r: 330 }, CIRC = { x: 250, y: -215, r: 115 };
  const VIEW1 = { x: 250, y: -300, s: 1.35 };
  const MAN = { x: 2300, h: 330 };
  const BP = { x: 2700, y: -640, w: 900, h: 560 };
  const WL = { x: 3800, y: -390 };
  const ROWR = (() => { const a = []; let x = 4300; for (let i = 0; i < 10; i++) { const r = 110 * Math.pow(.84, i); if (i) x += a[i - 1].r + r + 46; a.push({ x, y: -380, r }); } return a; })();
  const BAR2 = { x0: -1000, x1: 1500, y: -600, h: 90 };
  const CP = { x: 5150, y: -600 }, DR = { x: HALL.x - 450, y: -470, r: 150 };

  // ---------------------------------------------------------------------------------------------- camera
  const DIP = .55, TA = .9, TZ = 2.0, TM = 2.9;   // zoom out of the door close-up first (to TZ), the seam travels up TA → TM (smooth.py)
  const K = [
    [tB + TM, VIEW1], [tWords + .8, { x: 430, y: -290, s: 1.3 }], [tFeel + .6, { x: 270, y: -280, s: 1.42 }], [tItself + .8, { x: 260, y: -284, s: 1.46 }],
    [tInt + 5.0, { x: 250, y: -520, s: .56 }], [tMin + .8, { x: 250, y: -560, s: .62 }],
    [tDodge + 1.6, { x: 2150, y: -250, s: 1.25 }], [tTrue2 + 2.0, { x: 2130, y: -255, s: 1.3 }],
    [tPlan + 1.3, { x: 3150, y: -350, s: 1.22 }], [tHow + 2.4, { x: 3170, y: -352, s: 1.28 }],
    [tHope + 1.3, { x: 3700, y: -330, s: 1.36 }], [tFirst + 1.5, { x: 4640, y: -390, s: 1.08 }], [tCare + .5, { x: ROWR[0].x + 120, y: -390, s: 1.3 }],
    [C5.end + 1.2, { x: ROWR[0].x + 130, y: -385, s: 1.34 }], [tLeast + 1.0, { x: 4820, y: -330, s: 1.0 }],
    [tHonest + .6, { x: 4380, y: -300, s: 1.22 }], [tHang + 2.6, { x: 4520, y: -330, s: 1.08 }],
    [tBelieve + 2.2, { x: 4860, y: -430, s: .86 }], [tReason + 1.0, { x: 5330, y: -300, s: .92 }], [tBefore + .5, { x: DR.x - 60, y: -430, s: 1.15 }],
    [tPub - .3, HS.K[0][1]],
  ];
  const camPath = (t) => S.drift2(S.camPath2(t, K), t, .7, 31);
  const mM = (t) => sineIO(span(t, tB + TA, tB + TM));                      // the seam → ring morph: the line rises and bends (travel)
  const mZ = (t) => sineIO(span(t, tB + .02, tB + TZ));                      // … after the camera has pulled out of the close-up (zoom)
  const s0 = DS.cam(tB).s;
  const cam = (t) => {
    if (t >= tPub - .3) return HS.cam(t);
    if (t < tB + TM) {
      const m = mM(t), z = mZ(t), cx = lerp(SEAM.x, RING0.x, m), cy = lerp(SEAM.y, RING0.y, m) + (VIEW1.y - RING0.y) * m;
      const mine = S.drift2({ x: cx, y: cy, s: Math.exp(lerp(Math.log(s0), Math.log(VIEW1.s), z) + Math.log(DIP) * Math.sin(Math.PI * m)) }, t, .25 + .45 * m, 31);   // the camera backs off while it travels up
      return B.lerpC(DS.cam(t), mine, sineIO(span(t, tB, tB + .5)));
    }
    return camPath(t);
  };
  // the stage dawn: the door's .12, the hope (8.20) warms it to the hall's
  const dawn = (t) => lerp(.12, HALL.dawn, mv(t, tReason - .1, 2.2));

  // ---------------------------------------------------------------------------------------------- the lights (8.04–8.08)
  const HUMAN = Array.from({ length: 11 }, (_, i) => { const a = -Math.PI / 2 + (i + 1) * TAU / 12; return { x: CIRC.x + Math.cos(a) * CIRC.r, y: CIRC.y + Math.sin(a) * CIRC.r, t0: tFeel + .05 + i * .07 }; });
  const MSLOT = { x: CIRC.x, y: CIRC.y - CIRC.r };
  const NM = 480;
  const MACH = (() => { const r = prng(909), a = [{ x: MSLOT.x, y: MSLOT.y, born: -1e9, par: -1 }];
    for (let k = 1; k < NM; k++) {
      let x, y; do { x = 250 + (r() - .5) * 3600; y = -560 + (r() - .5) * 1900; } while (Math.abs(x - 250) < 420 && y > -420 && y < 40);
      const gen = Math.floor(Math.log2(k + 1)); a.push({ x, y, born: tInt + .2 + gen * .55 + r() * .25, par: (k - 1) >> 1, q: r(), bx: lerp(BAR2.x0 + 60, BAR2.x1 - 10, r()), by: BAR2.y + (r() - .5) * BAR2.h * .7 });
    } return a; })();
  const machAt = (k, t) => { const M = MACH[k]; if (k === 0) return [M.x, M.y]; const p = expoOut(span(t, M.born, M.born + .8)); const [px, py] = machAt(M.par, M.born); return [lerp(px, M.x, p), lerp(py, M.y, p)]; };
  const toBar = (t, q) => sineIO(span(t, tMin - .25 + q * .5, tMin + .75 + q * .5));
  const dot = (ctx, x, y, r, col, core, a = 1) => { ctx.fillStyle = rgba(col, .22 * a); ctx.beginPath(); ctx.arc(x, y, r * 2.6, 0, TAU); ctx.fill(); ctx.fillStyle = rgba(core, .95 * a); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); };

  // ---------------------------------------------------------------------------------------------- cards
  const dummy = createCanvas(8, 8).getContext('2d');
  const Q1 = { text: 'care about sentient life', head: 'IN HIS WORDS', credit: 'Ilya Sutskever · Podcast, Nov 2025', x: 1010, y: 120, w: 820, size: 54 };
  const Q1t = B.litTimes(T, 4, [[0, 'care about sentient life', null, tWords]]), Q1h = B.qcard(dummy, 0, { ...Q1, u: 1 }).h;
  const Q2 = { text: '"It\'s true." "It\'s possible it\'s not the best criterion."', head: 'HIS ANSWER', credit: 'Ilya Sutskever · Podcast, Nov 2025', x: 110, y: 140, w: 860, size: 50 };
  const Q2t = B.litTimes(T, Q2.text.split(/\s+/).length, [[0, "It's true", null, tDodge], [2, "It's possible it's not the best criterion", null, tTrue]]), Q2h = B.qcard(dummy, 0, { ...Q2, u: 1 }).h;
  const cardIn = (ctx, t, Q, times, h, Rr) => { ctx.save(); ctx.translate(Rr.x, Rr.y); ctx.scale(Rr.w / Q.w, Rr.h / h); ctx.translate(-Q.x, -Q.y); B.qcard(ctx, t, { ...Q, u: 1, times, inkAll: true }); ctx.restore(); };

  const draw = (ctx, t) => {
    const c = cam(t);
    // ---------------------------------------------------------------- the boundary pictures
    if (t >= tPub - .3) { drawHall(ctx, t, c); return; }
    const m = mM(t);
    if (c.y + H / 2 / c.s > S.GY - SSI_TOP_MARGIN) DS.draw(ctx, t, { cam: c, glow: 1 - .6 * m });
    else { S.stage(ctx, t, c, { dawn: dawn(t) }); S.view(ctx, c); }
    S.view(ctx, c);

    // ---------------------------------------------------------------- 8.01 the seam lifts and bends into the ring; OBEYS
    if (m > 0 && m < 1) {
      const N = 72; ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const f = i / (N - 1), sx = SEAM.x - 76 + 152 * f, a = Math.PI / 2 + TAU * f * .985;
        const x = lerp(sx, RING0.x + Math.cos(a) * RING0.r, m), y = lerp(SEAM.y, RING0.y + Math.sin(a) * RING0.r, m) - Math.sin(Math.PI * m) * 30 * Math.sin(Math.PI * f);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      const col = mixHex(GOLD.hot, COOL.body, span(m, .3, .9));
      ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(col, .35 * (1 - span(m, .93, 1))); ctx.lineWidth = 16 / c.s; ctx.stroke(); ctx.strokeStyle = rgba(mixHex(GOLD.core, COOL.core, m), .95 * (1 - span(m, .93, 1))); ctx.lineWidth = 5 / c.s; ctx.stroke(); ctx.restore();
    }
    const warm = mv(t, tCares - .1, 1.4);
    const rA = span(m, .93, 1);
    if (rA > 0) {
      const wob = 1 + .02 * Math.sin(t * .9);
      if (warm > 0) halo(ctx, RING0.x, RING0.y, RING0.r * 3, .35 * warm, GOLD.halo, GOLD.hot);
      F.ring(ctx, t, RING0.x, RING0.y, RING0.r * wob, { a: rA, think: .7 });
      if (warm > 0) { ctx.strokeStyle = rgba(GOLD.body, .9 * warm); ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(RING0.x, RING0.y, RING0.r * wob, 0, TAU); ctx.stroke(); }
      B.arrowsIn(ctx, t, RING0.x, RING0.y, RING0.r + 34, span(t, tB + 2.15, tB + 2.85), { n: 6, fall: span(t, tCares + .25, tCares + 1.2) });
      const ou = rise(span(t, tB + 2.3, tB + 2.7)) * (1 - span(t, tCares + 1.1, tCares + 1.5));
      if (ou > 0) F.goldText(ctx, [['OBEYS', 0]], RING0.x, RING0.y - RING0.r - 72, 40, ou, { serif: false, weight: 800, spacing: .14, align: 'center', col: COOL.text });
    }
    // ---------------------------------------------------------------- 8.02 the shelter, the floor line, the figures; CARES
    const fl = mv(t, tB + 1.2, 1.6);
    if (fl > 0 && t < tDodge + 2) {
      F.goldSpan(ctx, [[SH.x - 700, FY], [SH.x + 700, FY]], .5 - .5 * fl, .5 + .5 * fl, { w: 1.6, spark: false, a: .7 });
      B.shelter(ctx, t, SH.x, FY, SH.r, mv(t, tCares, 1.5), { warm: 1 });
      const cu = rise(span(t, tCares + .5, tCares + 1.1)) * (1 - span(t, tInt - .2, tInt + .3));
      if (cu > 0) F.goldText(ctx, [['CARES', 1]], SH.x + SH.r + 40, FY - 24, 40, cu, { serif: false, weight: 800, spacing: .14 });
      // the two figures that walk in under it (8.02), you · a child · a dog (8.05)
      const fig = [[tCares - 1.0, -260, 70, 'p', 104, 1], [tCares - .8, 760, 135, 'p', 96, -1], [tYou - .75, -300, 215, 'you', 100, 1], [tKids - .7, 760, 300, 'kid', 62, -1], [tDog - .7, 820, 372, 'dog', 44, -1]];
      for (const [t0, xa, xb, kind, h, d] of fig) {
        const p = span(t, t0, t0 + 1.1); if (p <= 0) continue;
        const x = lerp(xa, xb, sineIO(p)), walking = p < 1, ph = (t - t0) * 6.5;
        halo(ctx, x, FY - h * .6, h * 1.1, .2, GOLD.halo, GOLD.hot);
        if (kind === 'you') E.du(ctx, x, FY, h, { light: 1, dir: walking ? d : 1, look: .5, walk: walking ? ph : undefined });
        else if (kind === 'dog') B.dog(ctx, x, FY, h, { dir: d, walk: walking ? ph * 1.5 : 0 });
        else E.person(ctx, x, FY, h, { dir: walking ? d : (x < SH.x ? 1 : -1), look: .55, light: .7, rim: GOLD.line, walk: walking ? ph : undefined, breath: true });
      }
    }
    // ---------------------------------------------------------------- 8.04 – 8.08 the lights; ★ they multiply; the bar
    if (t > tFeel - .2 && t < tDodge + 2) {
      const barU = mv(t, tMin + .55, 1.1);
      for (const L of HUMAN) {
        const p = span(t, L.t0, L.t0 + .7); if (p <= 0) continue;
        const e = expoOut(p), x0 = lerp(RING0.x, L.x, e), y0 = lerp(RING0.y + RING0.r, L.y, e), b = toBar(t, .1 + (L.x % 7) / 70);
        const x = lerp(x0, BAR2.x0 + 6 + ((L.y + 300) % 20), b), y = lerp(y0, BAR2.y + ((L.x % 60) - 30), b);
        if (barU < 1) dot(ctx, x, y, 6, GOLD.halo, GOLD.core, 1 - barU);
      }
      // the machine's own light joins (8.06): from the ring down to the top of the circle
      const jp = span(t, tItself - .3, tItself + .8);
      if (jp > 0) {
        const e = sineIO(jp), x = lerp(RING0.x, MSLOT.x, e), y = lerp(RING0.y, MSLOT.y, e);
        if (t < tInt + .2) dot(ctx, x, y, 7, COOL.halo, COOL.core);
      }
      if (t >= tInt + .2) {
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        for (let k = 0; k < NM; k++) {
          const M = MACH[k]; if (t < M.born) continue;
          const [x0, y0] = machAt(k, t), b = toBar(t, M.q ?? 0), x = lerp(x0, M.bx ?? BAR2.x1 - 40, b), y = lerp(y0, M.by ?? BAR2.y, b);
          const a = (k ? clamp((t - M.born) * 4) : 1) * (1 - barU);
          if (a > 0) dot(ctx, x, y, k ? 4.5 + 1.5 * (M.q ?? .5) : 7, COOL.halo, COOL.core, a);
        }
        ctx.restore();
      }
      if (t > tMin - .3) {   // 8.08 the bar
        const fu = barU, bw = BAR2.x1 - BAR2.x0, hx = BAR2.x0 + bw * .012;
        ctx.strokeStyle = rgba(CREAM2, .6 * clamp((t - tMin + .3) * 3)); ctx.lineWidth = 2.5; ctx.setLineDash([10, 8]); ctx.strokeRect(BAR2.x0, BAR2.y - BAR2.h / 2, bw, BAR2.h); ctx.setLineDash([]);
        if (fu > 0) {
          ctx.fillStyle = rgba(GOLD.body, fu); ctx.fillRect(BAR2.x0, BAR2.y - BAR2.h / 2, hx - BAR2.x0, BAR2.h);
          ctx.fillStyle = rgba(COOL.body, .85 * fu); ctx.fillRect(hx + 3, BAR2.y - BAR2.h / 2, BAR2.x1 - hx - 3, BAR2.h);
        }
        const lu = rise(span(t, tMin + .5, tMin + 1.1));
        if (lu > 0) {
          F.goldSpan(ctx, [[BAR2.x0 + 15, BAR2.y - BAR2.h / 2 - 8], [BAR2.x0 + 15, BAR2.y - BAR2.h / 2 - 90]], 0, lu, { w: 2, spark: false });
          F.goldText(ctx, [['HUMANS', 1]], BAR2.x0, BAR2.y - BAR2.h / 2 - 110, 54, lu, { serif: false, weight: 800, spacing: .1 });
          F.goldText(ctx, [['MACHINES', 0]], (hx + BAR2.x1) / 2, BAR2.y - BAR2.h / 2 - 34, 64, lu, { serif: false, weight: 800, spacing: .1, align: 'center', col: COOL.text });
        }
      }
    }
    // ---------------------------------------------------------------- 8.09 the man in his light column, facing us
    const mu = mv(t, tDodge - .4, 1.6);
    if (mu > 0 && t < tPlan + 2.5) {
      const bx = MAN.x;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = E.lin(ctx, 0, -1400, 0, FY, [[0, rgba(GOLD.halo, 0)], [1, rgba(GOLD.halo, .2 * mu)]]);
      ctx.beginPath(); ctx.moveTo(bx - 90, -1400); ctx.lineTo(bx + 90, -1400); ctx.lineTo(bx + 230, FY); ctx.lineTo(bx - 230, FY); ctx.closePath(); ctx.fill(); ctx.restore();
      ctx.fillStyle = E.rad(ctx, bx, FY, 330, [[0, rgba(GOLD.hot, .35 * mu)], [1, rgba(GOLD.halo, 0)]]); ctx.beginPath(); ctx.ellipse(bx, FY, 330, 50, 0, 0, TAU); ctx.fill();
      F.goldSpan(ctx, [[bx - 500, FY], [bx + 500, FY]], .5 - .5 * mu, .5 + .5 * mu, { w: 1.4, spark: false, a: .6 });
      halo(ctx, bx, FY - MAN.h * .6, MAN.h * .9, .3 * mu, GOLD.halo, GOLD.hot);
      const rs = sineIO(span(t, tDodge - .4, tDodge + .8));
      ctx.save(); ctx.beginPath(); ctx.rect(bx - 400, -2000, 800, 2000 + FY); ctx.clip(); ctx.translate(0, (1 - rs) * MAN.h * 1.05);
      F.ilya(ctx, t, bx, FY, MAN.h, { view: 'back', dir: 1, look: .12, lightX: bx, glow: 1.4, shadow: 0 });
      ctx.restore();
    }
    // ---------------------------------------------------------------- 8.11 / 8.12 the blueprint, HOW TO BUILD IT: —
    const flipP = span(t, tPlan - .15, tPlan + 1.0);
    if (flipP >= 1 && t < tFirst + 3) {
      B.blueprint(ctx, t, BP, 1, { draw: 1 });
      const hu = rise(span(t, tHow + .5, tHow + 1.2));
      if (hu > 0) F.goldText(ctx, [['HOW TO BUILD IT:  —', 0]], BP.x + BP.w * .5, BP.y + BP.h * .45, 40, hu, { serif: false, weight: 800, spacing: .06, col: '#eef4ff' });
    }
    // ---------------------------------------------------------------- 8.13 the warm light, ONE CONDITION
    const wl = span(t, tHope - .2, tHope + 1.4);
    let WLp = null;
    if (wl > 0) {
      const sx = BP.x + BP.w * .24, sy = BP.y + BP.h * .42, e = sineIO(wl);
      let x = lerp(sx, WL.x, e), y = lerp(sy, WL.y, e) - Math.sin(Math.PI * e) * 120;
      const into = sineIO(span(t, tCare - .3, tCare + .9));          // 8.14 "if those do care": into the first ring
      x = lerp(x, ROWR[0].x, into); y = lerp(y, ROWR[0].y, into);
      if (into < 1) { B.warmLight(ctx, x, y, 22, clamp(wl * 3), { t }); WLp = [x, y]; }
      const ku = span(t, tCond - .1, tCond + .9) * (1 - span(t, tFirst + 1.5, tFirst + 2.3));
      if (ku > 0) { B.knot(ctx, WL.x, WL.y + 90, ku, 24); F.goldText(ctx, [['ONE CONDITION', 1]], WL.x, WL.y + 190, 40, rise(span(t, tCond + .2, tCond + .8)) * (1 - span(t, tFirst + 1.5, tFirst + 2)), { serif: false, weight: 800, spacing: .1, align: 'center' }); }
    }
    // ---------------------------------------------------------------- 8.14 – 8.19 the row of rings, the bar, the hand(s), the paths
    const rowU = span(t, tFirst - .6, tFirst + 1.4);
    if (rowU > 0) {
      ROWR.forEach((Q, i) => {
        const k = expoOut(clamp(rowU * 1.8 - i * .09)); if (k <= 0) return;
        const first = i < 3, lit = first ? span(t, tFirst + .9 + i * .2, tFirst + 1.5 + i * .2) : 0, care = i === 0 ? span(t, tCare + .4, tCare + 1.2) : 0;
        if (care > 0) halo(ctx, Q.x, Q.y, Q.r * 3, .4 * care, GOLD.halo, GOLD.hot);
        F.ring(ctx, t, Q.x, Q.y, Q.r * lerp(.4, 1, k), { a: clamp(k * 2) * (.35 + .65 * lit), think: .4 + .6 * lit });
        if (care > 0) { ctx.strokeStyle = rgba(GOLD.body, .9 * care); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(Q.x, Q.y, Q.r, 0, TAU); ctx.stroke(); }
      });
      const fu = rise(span(t, tFirst + 1.6, tFirst + 2.3)) * (1 - span(t, tCare + .2, tCare + .6));
      if (fu > 0) {
        const xa = ROWR[0].x - ROWR[0].r, xb = ROWR[2].x + ROWR[2].r, yb = ROWR[0].y - ROWR[0].r - 40;
        F.goldSpan(ctx, [[xa, yb + 16], [xa, yb], [xb, yb], [xb, yb + 16]], 0, fu, { w: 2, spark: false });
        F.goldText(ctx, [['THE FIRST ONES', 1]], (xa + xb) / 2, yb - 22, 40, fu, { serif: false, weight: 800, spacing: .1, align: 'center' });
      }
      // 8.16 the bar: AT LEAST FOR QUITE SOME TIME, the far end soft
      const bu = mv(t, tNot - .1, 2.4);
      if (bu > 0 && t < tBelieve + 1) {
        const x0 = ROWR[0].x, y0 = ROWR[0].y + ROWR[0].r + 120, L = 1500 * bu;
        ctx.fillStyle = E.lin(ctx, x0, 0, x0 + L, 0, [[0, rgba(GOLD.body, .95)], [.65, rgba(GOLD.mid, .7)], [1, rgba(GOLD.halo, 0)]]); ctx.fillRect(x0, y0 - 14, L, 28);
        halo(ctx, x0, y0, 60, .4, GOLD.halo, GOLD.core);
        const lu = rise(span(t, tLeast - .1, tLeast + .6)) * (1 - span(t, tHang + .5, tHang + 1));
        if (lu > 0) F.goldText(ctx, [['AT LEAST FOR QUITE SOME TIME', .3]], x0, y0 + 76, 40, lu, { serif: false, weight: 800, spacing: .08, col: CREAM });
        const nu = rise(span(t, tNot - .05, tNot + .5)) * (1 - span(t, tLeast - .3, tLeast + .1));
        if (nu > 0) F.goldText(ctx, [['NOT FOREVER', 0]], x0, y0 + 76, 40, nu, { serif: false, weight: 800, spacing: .08, col: CREAM2 });
      }
      // 8.17 / 8.18 the hands: one holds the warm light (out of the first ring); then three put light into the first ones
      const H0 = { x: ROWR[0].x - 60, y: ROWR[0].y + 330 };
      const hands = [[tHonest - .4, H0.x, H0.y, -1.25, 0], [tPut - .6, ROWR[1].x - 30, ROWR[1].y + 320, -1.4, 1], [tPut - .35, ROWR[2].x - 20, ROWR[2].y + 300, -1.5, 2]];
      for (const [t0, hx, hy, ang, ri] of hands) {
        const up = sineIO(span(t, t0, t0 + 1.2)), go = sineIO(span(t, tPut - .2 + ri * .25, tPut + 1.2 + ri * .25)), out = sineIO(span(t, tBelieve + .2, tBelieve + 1.8));
        if (up <= 0) continue;
        const Q = ROWR[ri], tx = lerp(hx, Q.x - 70, go), ty = lerp(hy + (1 - up) * 300, Q.y + Q.r * .2 + 60, go);
        const mtx = E.handMatrix(tx, ty, ang + .3 * go, 72, 1);
        ctx.save(); ctx.globalAlpha *= 1 - out * .0;
        E.lightHand(ctx, mtx, t, { a: 1, curl: .35, lum: .9 });
        ctx.restore();
        const [lx, ly] = E.applyM(mtx, 1.05, -.6), into = span(go, .85, 1);
        if (ri === 0 && t < tPut - .2 + .0) {   // the warm light comes out of ring 1 into the hand
          const drop = sineIO(span(t, tHonest - .4, tHonest + .6));
          B.warmLight(ctx, lerp(Q.x, lx, drop), lerp(Q.y, ly, drop), 18, 1, { t });
        } else if (into < 1) B.warmLight(ctx, lerp(lx, Q.x, into), lerp(ly, Q.y, into), 16 * (1 - .5 * into), 1, { t });
        // 8.19 each builder's path to the one point
        const pu = span(t, tBelieve + .4 + ri * .25, tBelieve + 2.2 + ri * .25);
        if (pu > 0) F.goldSpan(ctx, [[Q.x, Q.y - Q.r], [lerp(Q.x, CP.x, .5), lerp(Q.y - Q.r, CP.y, .2) - 120], [CP.x, CP.y]], 0, sineIO(pu), { w: 2.4, spark: pu < 1 });
      }
      const wu = rise(span(t, tPut + .2, tPut + .9)) * (1 - span(t, tBelieve, tBelieve + .5));
      if (wu > 0) F.goldText(ctx, [['WHAT THE BUILDERS PUT IN', .3]], ROWR[1].x, ROWR[0].y - ROWR[0].r - 52, 40, wu, { serif: false, weight: 800, spacing: .08, align: 'center', col: CREAM });
      // more builders' paths from far below, converging too
      for (let i = 0; i < 3; i++) {
        const pu = span(t, tBelieve + 1 + i * .3, tBelieve + 3 + i * .3); if (pu <= 0) continue;
        const sx = 4500 + i * 420, sy = 400;
        F.goldSpan(ctx, [[sx, sy], [lerp(sx, CP.x, .6), lerp(sy, CP.y, .5)], [CP.x, CP.y]], 0, sineIO(pu), { w: 2, spark: pu < 1, a: .8 });
      }
      const cu = span(t, tMTC - .4, tMTC + .5);
      if (t > tBelieve + 2) { halo(ctx, CP.x, CP.y, 120, .5, GOLD.halo, GOLD.core); B.warmLight(ctx, CP.x, CP.y, 16, 1, { t }); }
      if (cu > 0) F.goldText(ctx, [['A MACHINE THAT CARES', 1]], CP.x, CP.y - 70, 46, rise(cu), { serif: false, weight: 800, spacing: .08, align: 'center' });
    }
    // ---------------------------------------------------------------- 8.20 the LINE out of the point; the AFTER side warms
    const lnU = mv(t, tReason - .3, 1.5);
    if (lnU > 0) {
      const y0 = CP.y + 30, y1 = 380;
      F.goldSpan(ctx, [[CP.x, y0], [CP.x, y1]], 0, lnU, { w: 2.6 });
      const dw = mv(t, tReason + .1, 2.2);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.lin(ctx, CP.x, 0, CP.x + 700, 0, [[0, rgba(GOLD.halo, .16 * dw)], [1, rgba(GOLD.halo, 0)]]); ctx.fillRect(CP.x, -1400, 700, 1800); ctx.restore();
      B.sunrise(ctx, CP.x + 380, 40, 50, dw);
      F.goldText(ctx, [['BEFORE', .3]], CP.x - 30, y0 + 80, 32, rise(span(t, tReason + .1, tReason + .8)), { serif: false, weight: 800, spacing: .12, align: 'right' });
      F.goldText(ctx, [['AFTER', .3]], CP.x + 30, y0 + 80, 32, rise(span(t, tReason + .3, tReason + 1)), { serif: false, weight: 800, spacing: .12, col: CREAM });
    }
    // ---------------------------------------------------------------- 8.21 the dashed ring, a ? in front
    const du = mv(t, tAsked - .2, 1.4);
    if (du > 0) drawDashed(ctx, t, du, 0);

    // ---------------------------------------------------------------- screen space: cards, tags
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // 8.03 out of the ring and back into it
    const c1 = expoOut(span(t, tWords - .1, tWords + .7)), c1b = sineIO(span(t, tFeel - .5, tFeel + .2));
    if (c1 > 0 && c1b < 1) {
      const [rx, ry] = S.toScreen(c, RING0.x, RING0.y), rr = RING0.r * c.s * .6, from = { x: rx - rr, y: ry - rr * .5, w: rr * 2, h: rr };
      const Rr = B.lerpR(B.lerpR(from, { x: Q1.x, y: Q1.y, w: Q1.w, h: Q1h }, c1), from, c1b);
      cardIn(ctx, t, Q1, Q1t, Q1h, Rr);
    }
    const pt = rise(span(t, tWords + .6, tWords + 1.3)) * (1 - span(t, tFeel - .4, tFeel));
    if (pt > 0) F.dateTag(ctx, 110, 150, F.SOURCES.podcast, pt, { size: 26 });
    const it = rise(span(t, tInt + .3, tInt + 1)) * (1 - span(t, tMin + 1.2, tMin + 1.7));
    if (it > 0) F.dateTag(ctx, 110, 150, "THE INTERVIEWER'S OBJECTION", it, { size: 26 });
    // 8.10 the answer card (out of the man), 8.11 it turns over into the blueprint
    const c2 = expoOut(span(t, tTrue - .2, tTrue + .6));
    if (c2 > 0 && flipP < 1) {
      const [mx, my] = S.toScreen(c, MAN.x, FY - MAN.h * .8), from = { x: mx - 30, y: my - 15, w: 60, h: 30 };
      let Rr = B.lerpR(from, { x: Q2.x, y: Q2.y, w: Q2.w, h: Q2h }, c2);
      const e = sineIO(flipP);
      if (e > 0) { const bs = S.rectToScreen(c, BP); Rr = B.lerpR(Rr, bs, e); }
      const sy = Math.abs(Math.cos(Math.PI * e)), cy = Rr.y + Rr.h / 2;
      ctx.save(); ctx.translate(0, cy); ctx.scale(1, Math.max(.02, sy)); ctx.translate(0, -cy);
      if (e < .5) cardIn(ctx, t, Q2, Q2t, Q2h, Rr);
      else { ctx.translate(Rr.x, Rr.y); ctx.scale(Rr.w / BP.w, Rr.h / BP.h); B.blueprint(ctx, t, { x: 0, y: 0, w: BP.w, h: BP.h }, 1, { draw: 1 }); }
      ctx.restore();
    }
    const p2 = rise(span(t, tTrue + .5, tTrue + 1.2)) * (1 - span(t, tPlan - .3, tPlan + .1));
    if (p2 > 0) F.dateTag(ctx, 110, 106, F.SOURCES.podcast, p2, { size: 26 });
    // 8.15 the clip C5 out of the first ring and back into it
    const mIn = span(t, C5.start - 2.0, C5.start), mOut = span(t, C5.end, C5.end + 2.0);
    if (mIn > 0 && mOut < 1) {
      const Q = ROWR[0], [sx, sy] = S.toScreen(c, Q.x, Q.y);
      F.clipPlate(ctx, t, T, 'C5', { from: [sx, sy, Q.r * c.s], morph: mIn * (1 - mOut) });
    }
  };
  const SSI_TOP_MARGIN = 640;   // the door picture (ground, building) is drawn while any of it can be in view
  // the dashed ring of 8.21 (u draws it), opening into the hall's dome (o = 0..1)
  const drawDashed = (ctx, t, u, open) => {
    const cx = lerp(DR.x, HALL.x, open), cy = lerp(DR.y, HALL.floor, open), rx = lerp(DR.r, HALL.dome, open), ry = lerp(DR.r, HALL.dome * .78, open);
    const a0 = open > 0 ? Math.PI * open : -Math.PI / 2, a1 = open > 0 ? TAU - Math.PI * open : -Math.PI / 2 + TAU * Math.min(.9995, sineIO(u));
    ctx.save(); ctx.strokeStyle = rgba(CREAM, .85 * (1 - open)); ctx.lineWidth = 4; ctx.setLineDash([18, 14]); ctx.lineDashOffset = -t * 12;
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, a0, a1); ctx.stroke(); ctx.restore();
    const qu = rise(span(t, tAsked + .3, tAsked + 1)) * (1 - span(open, 0, .3));
    if (qu > 0) F.goldText(ctx, [['?', 0]], DR.x, DR.y + 62, 180, qu, { serif: true, align: 'center', col: CREAM });
  };
  const drawHall = (ctx, t, c) => {
    const op = sineIO(span(t, tPub - .3, tPub + 1.6));
    HS.draw(ctx, t, { cam: c, dome: span(op, .5, 1), lectern: span(t, tPub, tPub + 1.2) });
    S.view(ctx, c);
    if (op < 1) drawDashed(ctx, t, 1, op);
    // the LINE and the light of the AFTER side stay left of the hall while it is still in view
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  return [{ t: R.a, draw, print: F.PRINT78 }];
};
