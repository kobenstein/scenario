// Film 24 · c03 world (B1) · "A language without a dictionary" · 3.01–3.14 of docs/shots.md. ONE plan sequence (✂ in from c02 on the
// bright rectangle: the dictionary page = the kitchen window).
//   the kitchen at morning: the camera pulls back from the window: a parent talks, a baby listens; the sounds float as bubbles past its
//   head → they sort (same sounds, same colour; pairs stick) → the baby makes a sound and the bottle shows up → PULL BACK: the kitchen is
//   ONE medallion in a mountain of calls (NO LABELS) that slides into the gold listener → a call with a hidden piece; the listener fills it
//   → a phone keyboard suggests a finch, a click, a whale → clusters step out of the noise, linked → the kitchen medallion opens: the
//   baby points at the bottle · the listener gets a blindfold → a crow lands, its tiny recorder explodes into parts (MICROPHONE · MOTION
//   SENSORS · 12.5 G) → two tracks run out of it (the call; FLYING · LANDING · FEEDING) → PATTERNS → MEANING → the 2030 strip big, docks.
// c04 continues from this field (it imports makeC03 and draws the same frames, then closes the field into the ESP pin).
import * as E from './f10_editorial.mjs';
import * as F from './f24_kit.mjs';
import * as B from './f24_b1_kit.mjs';
import * as K from './f24_b1_kitchen.mjs';
import { WINDOW } from './f24_b1_c02.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, prng, halo } = E;
const { rise, maskLine } = F;
const TAU = Math.PI * 2;

export function anchors03(T) {
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = { T0: T.G('Every baby on Earth'), end: T.G('Further than you might') };
  a.never = G('A baby never gets'); a.listens = G('It just listens', a.never);
  a.notices = G('It notices which sounds'); a.back = G('coming back', a.notices); a.together = G('go together', a.notices);
  a.then = G('Then it notices what happens'); a.one = G('One sound', a.then); a.bottle = G('the bottle shows up', a.then); a.bottleE = GE('the bottle shows up', a.then);
  a.team = G("The team's A.I. does"); a.giant = G('giant scale', a.team); a.mountain = G('a mountain of animal', a.team); a.noMean = G('no meanings attached', a.team);
  a.game = G('Then it plays a guessing'); a.piece = G('piece of a sound', a.game); a.guess = G('guess what was there', a.game); a.guessE = GE('guess what was there', a.game);
  a.auto = G('Like autocomplete'); a.bird = G('birdsong', a.auto); a.whale = G('whale clicks', a.auto);
  a.after = G('Guess after guess'); a.appear = G('patterns appear', a.after); a.repeat = G('calls that repeat', a.after); a.belong = G('belong together', a.after);
  a.adv = G('But a baby has one more'); a.see = G('It can see what', a.adv); a.cant = G("The machine can't");
  a.clip = G('So the team and its partners'); a.rec = G('tiny recorders', a.clip); a.wild = G('wild animals', a.clip);
  a.record = G('They record each call'); a.doing = G('what the animal was doing', a.record); a.timeE = GE('at the time', a.record);
  a.pat = G('Patterns first'); a.mean = G('Then meaning', a.pat);
  a.tt = G('Twenty thirty is only'); a.far = G('So how far have they', a.tt); a.farE = GE('So how far have they', a.tt);
  return a;
}

// ---------------------------------------------------------------------------------------------------------------- the field set (field px)
const KM = [520, 420, 130];                 // the kitchen medallion inside the mountain of calls
const LIS = [1420, 520], LS = 172, BELL = [LIS[0] - LS * .9, LIS[1]], TIP = [LIS[0] + LS * 1.05, LIS[1] - LS * .05];
const GW = [930, 238], GWW = 560;           // the call with the hidden piece
const PH = [1900, 520], PW = 320, PHH = 640, PBOT = PH[1] + PHH / 2;
const CROW = [2160, 708], CH = 250, BRANCH = [[1880, 742], [2560, 712]];
const TRK = { x0: 2420, x1: 3150, y1: 420, y2: 590 };
const MOUND = (x) => 830 - 500 * Math.exp(-(((x - 600) / 340) ** 2));
const GROUPCOL = [P.cream, mixHex(P.halo1, P.shade0, .25), mixHex(P.blue0, P.cream, .55)];
const PILE = (() => {
  const r = prng(2471), c = [], kinds = ['rumble', 'click', 'whistle', 'caw', 'song', 'grunt', 'chirp', 'babble', 'squeal'];
  while (c.length < 230) {
    const x = 70 + r() * 1060, top = MOUND(x); if (top > 800) continue;
    const y = top + 14 + Math.pow(r(), .7) * (830 - top - 14);
    if (Math.hypot(x - KM[0], y - KM[1]) < KM[2] + 26) continue;
    c.push({ x, y, w: 46 + r() * 30, h: 18 + r() * 10, kind: kinds[Math.floor(r() * kinds.length)], a: .38 + .5 * r(), seed: c.length + 1, ph: r() * 6.3 });
  }
  return c;
})();
// the clusters: 12 chips of the pile step out into three groups (one group = one kind, one colour)
const CL = [[300, 214], [620, 150], [940, 214]];
const CLUSTER = (() => { const r = prng(2472), out = []; const top = PILE.filter((p) => p.y < MOUND(p.x) + 90 && Math.abs(p.x - 600) < 420).slice(0, 12);
  top.forEach((p, i) => { const g = i % 3, j = Math.floor(i / 3), ang = j * 1.57 + g, rr = 52; out.push({ p, g, to: [CL[g][0] + Math.cos(ang) * rr, CL[g][1] + Math.sin(ang) * rr * .7], kind: ['babble', 'whistle', 'click'][g] }); }); void r; return out; })();

export function makeC03(a, T) {
  // ---- the kitchen camera: from the window (= WINDOW on screen, the match of the cut) back to the room, then onto the baby
  const k0 = F.aim(K.Z_WALL, K.WIN.x, K.WIN.y, WINDOW.w / K.WIN.w, WINDOW.x, WINDOW.y);
  const kcam = B.cam3Path([
    [a.T0, k0, { lead: .7 }],
    [a.never + .5, F.aim(F.F0, 980, 560, .9)],
    [a.notices, F.aim(F.F0, 1000, 500, 1.0)],
    [a.together + .8, F.aim(F.F0, 1090, 430, 1.32)],
    [a.bottle + .4, F.aim(F.F0, 1120, 480, 1.28)],
    [a.team, F.aim(F.F0, 1110, 490, 1.22)],
    [a.team + 3.4, F.aim(F.F0, 1120, 500, 1.18)],
    [a.adv + .5, F.aim(F.F0, 1060, 520, 1.12)],
    [a.end + 4, F.aim(F.F0, 1080, 520, 1.16)],
  ]);
  const kc = (t) => E.camDrift(kcam(t), t, 1.4, 11);
  // ---- the bubbles: 9 sounds float from the parent's mouth to a cloud by the baby's head, then sort into 3 coloured groups
  const BUB = (() => { const r = prng(2473), kinds = [0, 1, 0, 2, 1, 0, 2, 1, 2]; return kinds.map((g, i) => ({ g, t0: a.never + .2 + i * .48, cloud: [930 + r() * 300, 220 + r() * 170], ph: r() * 6 })); })();
  const GPOS = [[800, 186], [1005, 136], [1210, 180]];
  function bubbles(t) {
    const out = [], su = sineIO(span(t, a.notices + .2, a.back + .6)), cu = span(t, a.back - .2, a.back + .7), lk = expoOut(span(t, a.together, a.together + .7));
    const cnt = [0, 0, 0];
    BUB.forEach((b, i) => {
      const fu = span(t, b.t0, b.t0 + 2.2); if (fu <= 0) return;
      const e = sineIO(fu), j = cnt[b.g]++, gp = [GPOS[b.g][0] + (j - 1) * 62, GPOS[b.g][1] + (j % 2) * 26 - 10];
      let x = lerp(K.MOUTH[0] + 30, b.cloud[0], e) + 12 * Math.sin(t * .8 + b.ph), y = lerp(K.MOUTH[1], b.cloud[1], e) - 40 * Math.sin(Math.PI * e) + 8 * Math.sin(t * 1.1 + b.ph);
      x = lerp(x, gp[0], su); y = lerp(y, gp[1], su);
      const col = E.mixHex('#c9c4b2', GROUPCOL[b.g], cu);
      out.push({ x, y, r: 30, kind: ['babble', 'whistle', 'click'][b.g], col, k: fu * 1.6 });
    });
    // pairs that go together: a link from group 0 to group 1 and from 2 to 0
    if (lk > 0 && out.length >= 9) { out[0].link = lk; out[0].lx = out[1].x; out[0].ly = out[1].y; out[3].link = lk; out[3].lx = out[2].x; out[3].ly = out[2].y; out[0].col = out[0].col; }
    // the baby's own sound
    const bu = span(t, a.one - .1, a.one + 1.6);
    if (bu > 0) out.push({ x: K.BABY.head[0] - 70 - 60 * bu, y: K.BABY.head[1] - 20 - 90 * sineIO(bu), r: 24, kind: 'babble', col: P.cream, k: bu * 2.5 });
    const fade = 1 - expoIn(span(t, a.team + 1.2, a.team + 1.9));   // they sink into the kitchen as it becomes a medallion
    for (const o of out) o.k *= fade;
    return out;
  }
  const kState = (t) => ({
    bubbles: bubbles(t), talk: span(t, a.never - .3, a.never) * (1 - span(t, a.notices + 2, a.notices + 2.5)),
    reach: span(t, a.bottle - .5, a.bottleE + .2), point: span(t, a.see - .3, a.see + .6) * (1 - span(t, a.cant + .6, a.cant + 1.4)),
    babySound: F.bump(t, a.one - .1, .7), look: span(t, a.never, a.never + 2), wave: span(t, a.see, a.see + .5),
  });
  const kitchenAt = (ctx, t) => K.kitchen(ctx, kc(t), t, kState(t));

  // ---- the field camera: the pull back out of the kitchen (the medallion is a thing of the field), then word keys
  const tz0 = a.team, tz1 = a.team + 4.0, ZE = B.bez(.55, 0, .25, 1), Z0 = F.RF / KM[2] * 1.02;
  const FK = B.camPath([
    [tz1, { x: 780, y: 500, z: 1.0 }],
    [a.noMean + .4, { x: 810, y: 490, z: 1.03 }],
    [a.guess - .4, { x: 920, y: 460, z: 1.05 }],
    [a.auto + 1.6, { x: 1320, y: 490, z: 1.0 }],     // one calm move: gap wave, listener and phone all in frame
    [a.whale + .8, { x: 1300, y: 495, z: .97 }],
    [a.appear + .9, { x: 820, y: 440, z: .94 }],
    [a.belong + 1, { x: 790, y: 430, z: .97 }],
    [a.see - .3, { x: 920, y: 465, z: .93 }],
    [a.cant + .6, { x: 980, y: 475, z: .95 }],
    [(a.cant + a.rec) / 2 + .45, { x: 1680, y: 500, z: .84 }],   // the long move to the crow rides out wide (less screen speed)
    [a.rec + .3, { x: 2260, y: 520, z: 1.0 }],
    [a.wild + .6, { x: 2250, y: 500, z: 1.06 }],
    [a.doing + .6, { x: 2600, y: 520, z: .98 }],
    [a.mean + 1, { x: 2620, y: 500, z: 1.03 }],
    [a.end + 4, { x: 2230, y: 610, z: 1.34 }],
  ]);
  function fcam(t) {
    if (t < tz1) {
      const e = ZE(span(t, tz0, tz1)), z = Math.exp(lerp(Math.log(Z0), Math.log(1), e)), end = FK(tz1);
      const [ex, ey] = B.toScr(end, KM[0], KM[1]), sx = lerp(W / 2, ex, e), sy = lerp(H / 2, ey, e);
      return { x: KM[0] - (sx - W / 2) / z, y: KM[1] - (sy - H / 2) / z, z };
    }
    return B.fieldDrift(FK(t), t, .5 + .7 * sineIO(span(t, a.tt + .5, a.tt + 1.5)), 7);   // half drift: the mountain of calls is fine texture, a big wobble reads as busy
  }
  // ---- field beats
  const kmOpen = (t) => sineIO(span(t, a.adv - .1, a.adv + 2.2));
  const kmNow = (t) => { const e = kmOpen(t); return [lerp(KM[0], 560, e), lerp(KM[1], 450, e), lerp(KM[2], 330, e)]; };
  const STREAM = []; for (let s = a.giant - .4; s < a.game + .4; s += .2) STREAM.push(s);
  const PATHS = [[1000, 610], [1120, 660], [1190, 520], [BELL[0] - 30, BELL[1] + 6]];
  const bz = (u) => { const [p0, p1, p2, p3] = PATHS, q = 1 - u; return [q * q * q * p0[0] + 3 * q * q * u * p1[0] + 3 * q * u * u * p2[0] + u * u * u * p3[0], q * q * q * p0[1] + 3 * q * q * u * p1[1] + 3 * q * u * u * p2[1] + u * u * u * p3[1]]; };
  const KINDS = ['rumble', 'click', 'whistle', 'caw', 'song', 'grunt', 'chirp', 'babble'];
  const drink = (t) => Math.max(t > a.giant && t < a.game + 1.8 ? .35 + .15 * Math.sin(t * 9) : 0, F.bump(t, a.guess, 1) * .9);
  const crowFly = (t) => span(t, a.clip + .2, a.clip + 1.7);
  const explode = (t) => span(t, a.rec - .1, a.rec + .9);
  const partsOut = (t) => expoIn(span(t, a.record - .3, a.record + .2));
  const trackU = (t) => span(t, a.record + .1, a.timeE + .2);
  const lateOut = (t) => expoIn(span(t, a.tt - .35, a.tt + .2));

  function field(ctx, t, c) {
    B.fieldBg(ctx, t, c, { glow: [lerp(700, 2500, span(c.x, 900, 2300)), 500] });
    B.withCam(ctx, c, () => {
      // the mountain of calls (no labels): chips breathe; the stream from its flank into the bell
      const clMove = (p) => { const k = CLUSTER.find((q) => q.p === p); return k; };
      for (const p of PILE) {
        const cl = clMove(p);
        if (cl) continue;
        B.twave(ctx, t, p.x, p.y + .8 * Math.sin(t * .6 + p.ph), p.w, p.h, p.kind, '#d8d2bc', { bars: 9, seed: p.seed, a: p.a * (.94 + .06 * Math.sin(t * .8 + p.ph)) });   // texture: barely breathing (calm)
      }
      const nl = B.riseOut(t, a.noMean - .1, a.game - .1, .8, .4);
      if (nl > 0) B.tag(ctx, 'NO LABELS', 800, 262, nl, { size: 28, line: mixHex(P.blue0, P.cream, .5) });
      STREAM.forEach((s0, j) => {
        const u = span(t, s0, s0 + 1.3); if (u <= 0 || u >= 1) return;
        const e = E.smooth(u), [x, y] = bz(e), sc = lerp(1, .4, e) * Math.min(1, u * 5);
        B.twave(ctx, t, x, y, 90 * sc, 34 * sc, KINDS[j % KINDS.length], '#e2dcc6', { bars: 10, seed: j + 9 });
      });
      // clusters: chips step out of the pile into three groups, recolour, link
      const cu = sineIO(span(t, a.appear - .2, a.repeat)), co = sineIO(span(t, a.adv - .6, a.adv + .4)), rc = span(t, a.repeat - .3, a.repeat + .5), lk = span(t, a.belong - .3, a.belong + .7);
      for (const q of CLUSTER) {
        const m = cu * (1 - co), x = lerp(q.p.x, q.to[0], m), y = lerp(q.p.y, q.to[1], m) - 30 * Math.sin(Math.PI * m);
        const col = mixHex('#d8d2bc', GROUPCOL[q.g], rc * (1 - co)), pulse = 1 + .12 * F.bump(((t - a.repeat) % 1.2 + 1.2) % 1.2, 0, .4) * rc * (1 - co);
        B.twave(ctx, t, x, y, q.p.w * lerp(1, 1.5, m) * pulse, q.p.h * lerp(1, 1.5, m) * pulse, rc > .3 && m > .5 ? q.kind : q.p.kind, col, { bars: 9, seed: q.p.seed, a: lerp(q.p.a, 1, m) });
      }
      if (lk > 0 && co < 1) {
        for (let g = 0; g < 3; g++) { const pts = CLUSTER.filter((q) => q.g === g).map((q) => q.to); ctx.strokeStyle = rgba(GROUPCOL[g], .55 * (1 - co)); ctx.lineWidth = 2.5; ctx.beginPath(); pts.forEach((p, i) => { const n = pts[(i + 1) % pts.length], u = clamp(lk * pts.length - i); if (u <= 0) return; ctx.moveTo(p[0], p[1]); ctx.lineTo(lerp(p[0], n[0], u), lerp(p[1], n[1], u)); }); ctx.stroke(); }
      }
      // the kitchen medallion (one of the recordings); it opens again when the baby "can see"
      const km = kmNow(t);
      if (t >= tz0) B.medal(ctx, km[0], km[1], km[2], (cx) => kitchenAt(cx, t), { ring: F.CREAM.core });
      // the listener: drinks the stream; fills the gap; gets a blindfold
      F.listener(ctx, t, LIS[0], LIS[1], LS, { drink: drink(t), blind: span(t, a.cant - .05, a.cant + .55) });
      // the call with a hidden piece: rises out of the pile, greys a piece, the listener fills it (gold)
      const gu = span(t, a.game + .1, a.game + 1.4), go = lateOut(t) + expoIn(span(t, a.after - .2, a.after + .4));
      if (gu > 0 && go < 1) {
        const gy = GW[1] + (1 - expoOut(span(t, a.game, a.game + .9))) * 260 + go * 300, gap = t >= a.piece - .1 ? [.5, .72] : null;
        ctx.save(); ctx.beginPath(); ctx.rect(GW[0] - GWW, GW[1] - 200, GWW * 2, 330); ctx.clip();
        F.wave(ctx, t, GW[0], gy, GWW, 150, 'song', { u: gu, col: 'cream', gap, fill: 0, seed: 31, bars: 48, live: true });
        const fu = span(t, a.guess - .05, a.guessE + .1);
        if (fu > 0 && gap) { ctx.save(); ctx.beginPath(); ctx.rect(GW[0] - GWW / 2 + gap[0] * GWW, gy - 120, (gap[1] - gap[0]) * GWW * fu, 240); ctx.clip(); F.wave(ctx, t, GW[0], gy, GWW, 150, 'song', { u: 1, col: 'gold', seed: 31, bars: 48, live: true, head: false }); ctx.restore(); }
        ctx.restore();
      }
      // the phone keyboard: autocomplete with animal calls
      const pu = rise(span(t, a.auto - .2, a.auto + .9)), po = expoIn(span(t, a.after - .1, a.after + .5));
      if (pu > 0 && po < 1) {
        ctx.save(); ctx.beginPath(); ctx.rect(PH[0] - 300, PH[1] - 600, 600, PBOT - PH[1] + 610); ctx.clip(); ctx.translate(0, (1 - expoOut(pu)) * (PHH + 40) + po * (PHH + 40));
        B.phone(ctx, t, PH[0], PH[1], PW, PHH, { screen: (cx, sx, sy, sw, sh) => B.keyboard(cx, t, sx, sy, sw, sh, {
          su: [rise(span(t, a.bird - .1, a.bird + .5)), rise(span(t, a.whale - .1, a.whale + .5)), rise(span(t, a.whale + .25, a.whale + .85))],
          sugg: (q, i, x, y, u) => { q.save(); q.beginPath(); q.rect(x - 60, y - 30, 120, 60); q.clip(); q.translate(0, (1 - expoOut(u)) * 40);
            if (i === 0) F.icon(q, 'finch', x, y + 2, 22, { col: 'cream', t }); else if (i === 1) B.twave(q, t, x, y, 60, 30, 'click', P.cream, { bars: 12 }); else F.icon(q, 'spermWhale', x, y, 26, { col: 'cream', t }); q.restore(); },
          line: (q, x, y, w) => { F.wave(q, t, x + 70, y, 140, 34, 'song', { col: 'cream', u: 1, seed: 31, bars: 16, gap: [.6, 1], fill: 0, head: false }); q.fillStyle = rgba(P.cream, .85 * F.blink(t)); q.fillRect(x + 150, y - 15, 3, 30); },
        }) });
        ctx.restore();
      }
      // the crow lands on a branch; its tiny recorder explodes into parts; two tracks run out of it
      const ff = crowFly(t);
      if (ff > 0) {
        const lu = 1 - expoIn(span(t, a.end + 5, a.end + 6));
        ctx.strokeStyle = mixHex(P.night0, P.ind1, .5); ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(...BRANCH[0]); ctx.quadraticCurveTo(2200, 760, BRANCH[1][0], BRANCH[1][1]); ctx.stroke();
        ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(2420, 720); ctx.lineTo(2500, 640); ctx.stroke();
        const e = sineIO(ff), x = lerp(2760, CROW[0], e), y = lerp(-160, CROW[1], e) - 120 * Math.sin(Math.PI * e) * (1 - e);
        const peck = Math.max(0, Math.sin(Math.PI * span((t - a.doing - .9) % 1.1, 0, .5))) * span(t, a.doing + .9, a.doing + 1.2) * (1 - span(t, a.pat, a.pat + .3));
        const peck2 = Math.max(0, Math.sin(Math.PI * span((t - a.farE - .2) % 1.25, 0, .5))) * span(t, a.farE + .2, a.farE + .5);
        const cr = F.crow(ctx, t, x, y, CH, { dir: -1, light: -1, warm: .55, tag: true, fly: ff < 1 ? t * 9 : null, peck: Math.max(peck, peck2), open: F.bump(t, a.record + .2, .5) + F.bump(t, a.record + 1.2, .4), seed: 4 });
        void lu;
        // the exploded recorder
        const ex = expoOut(explode(t)), po2 = partsOut(t);
        if (ex > 0 && po2 < 1) {
          const tl = cr.tail, k = ex * (1 - po2);
          const parts = [[2040, 330, 'MICROPHONE', 0], [2290, 300, 'MOTION SENSORS', 1], [2540, 330, '12.5 G', 2]];
          ctx.setLineDash([6, 8]); ctx.strokeStyle = rgba(P.halo2, .45 * k); ctx.lineWidth = 2;
          for (const [px, py] of parts) { ctx.beginPath(); ctx.moveTo(tl[0], tl[1]); ctx.lineTo(lerp(tl[0], px, k), lerp(tl[1], py + 50, k)); ctx.stroke(); }
          ctx.setLineDash([]);
          parts.forEach(([px, py, lab, i]) => {
            const pk = expoOut(span(explode(t), i * .12, .7 + i * .12)) * (1 - po2), x2 = lerp(tl[0], px, pk), y2 = lerp(tl[1], py, pk), s = lerp(.3, 1, pk);
            if (pk <= 0) return;
            ctx.save(); ctx.translate(x2, y2); ctx.scale(s, s);
            ctx.fillStyle = mixHex(P.night1, P.blue1, .5); ctx.strokeStyle = rgba(P.cream, .8); ctx.lineWidth = 3;
            if (i === 0) { ctx.beginPath(); ctx.roundRect(-26, -40, 52, 80, 24); ctx.fill(); ctx.stroke(); for (let j = 0; j < 4; j++) { ctx.beginPath(); ctx.moveTo(-14, -22 + j * 12); ctx.lineTo(14, -22 + j * 12); ctx.stroke(); } }
            else if (i === 1) { ctx.beginPath(); ctx.roundRect(-46, -36, 92, 72, 8); ctx.fill(); ctx.stroke(); ctx.fillStyle = rgba(P.halo1, .8); for (let j = 0; j < 3; j++) ctx.fillRect(-30 + j * 22, -10, 14, 20); }
            else { ctx.beginPath(); ctx.roundRect(-60, -24, 120, 48, 20); ctx.fill(); ctx.stroke(); ctx.fillStyle = rgba(P.cream, .7); ctx.fillRect(40, -6, 30, 12); }
            ctx.restore();
            const lu2 = B.riseOut(t, a.rec + .3 + i * .35, null, .7);
            if (lu2 > 0 && pk > .6) maskLine(ctx, [[lab, 0]], px, py + (i === 2 ? 108 : 92), i === 2 ? 46 : 28, lu2 * (1 - po2), { serif: i === 2, weight: 600, col: i === 2 ? P.cream : P.halo2, glow: false, align: 'center' });
          });
        }
        // the two tracks: what it heard (the call) and what it did (the motion line), out of the recorder
        const tu = trackU(t), to = lateOut(t);
        if (tu > 0 && to < 1) {
          const tl = cr.tail, x0 = TRK.x0, x1 = lerp(x0, TRK.x1, sineIO(tu));
          ctx.save(); ctx.beginPath(); ctx.rect(x0 - 120, TRK.y1 - 120, TRK.x1 - x0 + 300, 330 - to * 330); ctx.clip();
          ctx.strokeStyle = rgba(P.halo2, .4); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tl[0], tl[1]); ctx.lineTo(x0, TRK.y1); ctx.moveTo(tl[0], tl[1]); ctx.lineTo(x0, TRK.y2); ctx.stroke();
          F.wave(ctx, t, (x0 + TRK.x1) / 2, TRK.y1, TRK.x1 - x0, 110, 'caw', { u: sineIO(tu), col: 'cream', seed: 51, bars: 56, live: true });
          // the motion line: flying (waves), landing (a drop), feeding (small regular pecks)
          ctx.strokeStyle = F.CREAM.body; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.beginPath();
          const L = TRK.x1 - x0;
          for (let x = x0; x <= x1; x += 4) { const f = (x - x0) / L; let y = TRK.y2; if (f < .38) y += -22 + 18 * Math.sin(f * 60); else if (f < .55) y += lerp(-22, 30, sineIO((f - .38) / .17)); else y += 30 - 14 * Math.max(0, Math.sin(f * 90)); x === x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
          ctx.stroke();
          ctx.restore();
          const labs = [['FLYING', .19, a.record + .9], ['LANDING', .47, a.doing], ['FEEDING', .77, a.doing + .9]];
          for (const [s, f, t0] of labs) { const u = B.riseOut(t, t0, a.tt - .35, .7, .45); if (u > 0) maskLine(ctx, [[s, 0]], x0 + f * L, TRK.y2 + 92, 28, u, { serif: false, weight: 600, col: P.halo2, glow: false, align: 'center' }); }
        }
        // PATTERNS → MEANING
        const p1 = B.riseOut(t, a.pat - .05, a.tt - .35, .8, .45), p2 = B.riseOut(t, a.mean - .05, a.tt - .35, .8, .45), ar = span(t, a.pat + .5, a.mean) * (1 - lateOut(t));
        const mx = (TRK.x0 + TRK.x1) / 2, my = 250;
        if (p1 > 0) maskLine(ctx, [['PATTERNS', 0]], mx - 60 - F.measure('PATTERNS', 58, true), my, 58, p1, {});
        if (ar > 0) F.rule(ctx, mx - 40, my - 18, mx + 60, my - 18, ar, { w: 2.5 });
        if (p2 > 0) maskLine(ctx, [['MEANING', 1]], mx + 84, my, 58, p2, {});
      }
    });
  }
  // ---- the whole chunk
  const draw = (ctx, t) => {
    const c = fcam(t);
    if (t < tz0) kitchenAt(ctx, t);
    else field(ctx, t, c);
    // the 2030 strip: big at the centre on "Twenty thirty is only…", docks again before c04's zoom
    const big = sineIO(span(t, a.tt - .1, a.tt + 1.5)) * (1 - sineIO(span(t, a.farE + .3, a.end - .5)));
    F.strip(ctx, t, T, { big, at: [W / 2 + 120 - 6 * Math.max(0, t - a.tt), 470 + 2 * Math.max(0, t - a.tt)], w: 1080, s: 1.9, todayLabel: 'TODAY · NOV 2026' });
  };
  return { draw, field, fcam, kitchenAt, kc };
}
