// Film 19 · c12 (B3) · DAY 1,000 · ★ morning (the bubble gone, the hall stands) · Hassabis (C3) · a new price · the street of windows ·
// the harvest · the roads join · which one is missing · your table · DAY 032 · the phone turned over · end screen. 515.36 → 610.11.
// One road picture (the DAY 1,000 sign, you, the hall on the horizon) under one zoom camera; the explainers live in its morning sky;
// windows open from lit rects (a hall window → the studio → the clip; the chip → the street). The dawn light becomes your table lamp;
// the phone's screen becomes the end screen.
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f19_kit.mjs';
import * as PR from '../lib/f19_props.mjs';
import { tag } from '../lib/f18_kit.mjs';
import * as B from '../lib/f19_b3.mjs';
import { Path2D } from '@napi-rs/canvas';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, quartIO, halo, lin, prng } = B;
const { COOL } = F;

export default async (T, R) => {
  const A = R.a, g = (p, n = 0) => T.G(p, n, A - .2), ge = (p, n = 0) => T.GE(p, n, A - .2);
  const C3 = T.clip('C3');
  const S = {
    ifc: g('If this is the crash'), longest: g('longest one'), behind: g('behind you'), so: g("So what's"), standing: g('still standing'),
    demis: g('Demis'), gdm: g('Google DeepMind'), bursts: g('bursts'),
    he: g('He builds'), weigh: g('weigh his'), went: g('went that way'),
    crash: g('A crash puts'), newp: g('new price'), away: g('away'),
    last: g('If the last few'), cheaper: g('cheaper than today'), every: g('everywhere'),
    stand: g('And you can stand'), front: g('front of it'), stock: g('single stock'),
    calm: g('stayed calm'), owned: g('what you owned'), buffer: g('a buffer'), cheap: g('what got cheap'), alone: g('alone'),
    which: g('Which of these'), missing: g('missing'),
    chan: g('This channel'), honest: g('honest step'),
    d30: g('On day thirty'), hurt: g('hurt'), today: g('Today, the clock'), barely: g('barely started'),
    know: g('And you know'), carry: g('carry on'), vend: ge('the way', 0),
  };
  const END = R.b;
  // ---------------------------------------------------------------------------------------------- the road camera (zoom keys)
  const ZK = [
    [A, B.ZSTAGE],
    [S.ifc, B.ZSTAGE],
    [S.longest + .7, { k: 1.12, px: 760, py: 560 }, 's', 99],   // the long pull back out of the sign takes the whole interval
    [S.so, { k: 1.12, px: 760, py: 560 }],
    [S.standing + 1.3, { k: 1.5, px: 560, py: 540 }],
    [C3.end, { k: 1.5, px: 560, py: 540 }],
    [S.weigh + .3, { k: 1.0, px: 960, py: 540 }],
    [S.stand, { k: 1.0, px: 960, py: 540 }],
    [S.stock - .4, { k: 1.95, px: 700, py: 602 }],   // one move to you (and the umbrella to come), then it holds
    [S.calm, { k: 1.95, px: 700, py: 602 }],
    [S.alone - .3, { k: 1.95, px: 700, py: 602 }],
    [S.which + .9, { k: .74, px: 900, py: 560 }],
    [S.missing - .5, { k: 1.9, px: 700, py: 600 }],
    [S.chan + .3, { k: 1.9, px: 700, py: 600 }],
    [S.honest, { k: 1.55, px: 720, py: 610 }],
    [S.d30, { k: 26, px: 960, py: 556 }, 'i'],
  ];
  const zc = (t) => { const z = B.zkeys(t, ZK), d = smooth(span(t, A + .2, S.ifc + 1)); return { ...z, px: z.px + B.drift(t, 1 * d, 5) / z.k, py: z.py + B.drift(t, .7 * d, 9) / z.k }; };
  const dawnAt = (t) => smooth(span(t, S.so - .4, S.standing + 1.4));
  const walkZ = (t) => { const u = t - (S.chan + .2); return u <= 0 ? 0 : 260 * (u < 1 ? u * u / 2 : u - .5); };
  const walking = (t) => t > S.chan + .2;
  const STUDIO = { x: 560, y: 150, w: 900, h: 506 };
  const CLIPR = { x: 240, y: 62, w: 1440, h: 810 };
  const STREET = { x: 820, y: 132, w: 1000, h: 500 };
  const CHIP = { x: 1100, y: 290 };
  const lerpR = (a, b, e) => ({ x: lerp(a.x, b.x, e), y: lerp(a.y, b.y, e), w: lerp(a.w, b.w, e), h: lerp(a.h, b.h, e) });
  const circ = [[700, 250, 66], [900, 285, 82], [1080, 240, 58], [1290, 270, 104], [1530, 255, 88]];
  const NAMES = [['WIKIPEDIA', '2001'], ['LINKEDIN', '2003'], ['SKYPE', '2003'], ['FACEBOOK', '2004'], ['YOUTUBE', '2005']];
  const goreT = [S.calm, S.owned, S.buffer + .2, S.cheap, S.alone];

  function roadPart(ctx, t) {
    const Z = zc(t), d = dawnAt(t), umbIn = span(t, S.calm - .9, S.calm - .2);
    const lit = goreT.map((g0) => smooth(span(t, g0, g0 + .5)));
    if (t > S.missing - .1 && t < S.chan + .4) lit[2] *= .25 + .75 * (.5 + .5 * Math.cos((t - S.missing) * Math.PI * 2.4));
    const raise = smooth(span(t, S.calm - .8, S.calm - .3));
    const you = {
      dir: 1, turn: smooth(span(t, S.behind - .15, S.behind + .45)) * (1 - smooth(span(t, S.so + 1.6, S.so + 2.4))),
      look: .2 + .3 * smooth(span(t, S.so, S.standing)) - .2 * smooth(span(t, S.stock, S.stock + .6)),
      walk: walking(t) ? t * 5.5 : undefined,
      armR: raise > 0 ? [lerp(.2, 2.75, raise), lerp(.1, 3.0, raise)] : undefined,
    };
    const out = B.road12(ctx, t, T, Z, {
      z: walkZ(t), warm: .75 * d, dawn: d, glitter: smooth(span(t, S.so, S.standing)) * (1 - smooth(span(t, S.gdm, S.bursts))),
      pad: smooth(span(t, A + .55, A + 1.3)), counter: false, crowd: smooth(span(t, S.alone, S.which + .3)) * (1 - smooth(span(t, S.missing - .6, S.missing + .2))),
      you, umb: umbIn > 0 ? { open: expoOut(span(t, S.calm - .45, S.calm + .2)), lit, wide5: smooth(span(t, S.alone, S.alone + .6)), r: lerp(40, 120, expoOut(umbIn)) } : null,
    });
    // the DAY 1,000 counter on the sign face (it came out of the HUD in c11)
    if (out.panel) {
      const s = out.panel.s, h = 92 * s, hA = .25 * (1 - smooth(span(t, A + .2, A + 1.2)));
      if (hA > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const m = F.flap(ctx, t, 0, 0, h, { value: F.dayAt(t, T), digits: 4, a: 0 }); halo(ctx, out.panel.cx, out.panel.cy, m.w * .6, hA); ctx.restore(); }
      B.flapC(ctx, t, out.panel.cx, out.panel.cy, h, F.dayAt(t, T));
    }
    // gore icons on the big umbrella (one per line)
    if (out.you?.umb) {
      for (let i = 0; i < 5; i++) {
        const e = expoOut(span(t, goreT[i], goreT[i] + .5)); if (e <= 0) continue;
        const [gx, gy] = out.you.umb.gore(i);
        F.goreIcon(ctx, i, gx, gy, out.you.umbR / 300 * e * (i === 4 ? 1.2 : 1), { lit: lit[i], a: Math.min(1, lit[i] * 1.2) });
      }
    }
    return { ...out, Z };
  }

  function draw(ctx, t) {
    if (t < S.d30) return drawRoad(ctx, t);
    if (t < t0E()) return drawTable(ctx, t);
    return drawEnd(ctx, t);
  }

  // ================================================================================== 12.01–12.13 the morning road
  function drawRoad(ctx, t) {
    const out = roadPart(ctx, t);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    // 12.02 the line under the sign
    const sub = smooth(span(t, S.longest - .2, S.longest + .4)) * (1 - smooth(span(t, S.standing - .3, S.standing + .2)));
    if (sub > 0) E.glowText(ctx, 'IF IT RAN LIKE THE DOT-COM BUBBLE · NOT A FORECAST', W / 2, 238 + (1 - expoOut(sub)) * 12, { size: 26, align: 'center', spacing: .1, a: sub });
    // 12.04 the studio window grows out of a lit hall window; 12.05 the clip; 12.06 it closes back and splits into five points
    const so = smooth(span(t, S.standing + 1.0, S.gdm)), sc = span(t, S.he - .05, S.he + .75);
    if (so > 0 && sc < 1 && out.hallWin) {
      const tiny = { x: W / 2 - 3, y: 260 - 3, w: 6, h: 6 }, rect = sc > 0 ? lerpR(STUDIO, tiny, quartIO(sc)) : STUDIO;
      F.vWindow(ctx, t, rect, sc > 0 ? 1 : so, (c, r) => B.studio(c, t, r, { label: smooth(span(t, S.gdm - .2, S.gdm + .5)) }), { from: out.hallWin });
    }
    const op = C3 ? smooth(span(t, C3.start - .6, C3.start)) * (1 - smooth(span(t, C3.end, C3.end + .6))) : 0;
    if (C3 && op > 0) {
      const g2 = 1 + .025 * span(t, C3.start, C3.end), rr = { x: W / 2 - CLIPR.w * g2 / 2, y: CLIPR.y + CLIPR.h / 2 - CLIPR.h * g2 / 2, w: CLIPR.w * g2, h: CLIPR.h * g2 };
      F.clipWindow(ctx, t, T, 'C3', rr, { from: STUDIO });
      // the footage never swaps in on one frame: the studio picture inside the window sinks away to show it (a mask), and on the
      // way out rises back over it before the window shrinks into the studio window again
      const m = 1 - sineIO(span(t, C3.start - .5, C3.start + .6)) + sineIO(span(t, C3.end - .9, C3.end + .05));
      if (m > 0) {
        const r = lerpR(STUDIO, rr, quartIO(op)), p = new Path2D(); p.roundRect(r.x, r.y, r.w, r.h, 10);
        ctx.save(); ctx.clip(p); ctx.beginPath(); ctx.rect(r.x, r.y + r.h * (1 - m), r.w, r.h * m); ctx.clip();
        B.studio(ctx, t, r, { label: 1 }); ctx.restore();
      }
    }
    // 12.06 five start points → circles on "went that way"; 12.07 they gather into the chip under a price tag
    const split = span(t, S.he + .7, S.he + 1.5), grow = span(t, S.went - .1, S.went + .7), gather = span(t, S.crash, S.crash + .8);
    if (split > 0 && gather < 1) {
      circ.forEach(([cx, cy, r], i) => {
        const e = quartIO(split), x0 = lerp(W / 2, 700 + i * 210, e), y0 = lerp(260, 262, e);
        const x = lerp(x0, cx, expoOut(grow)), y = lerp(y0, cy, expoOut(grow)), rr = lerp(9, r, expoOut(grow));
        const gx = lerp(x, CHIP.x, quartIO(gather)), gy = lerp(y, CHIP.y, quartIO(gather)), gr = lerp(rr, 10, quartIO(gather));
        halo(ctx, gx, gy, gr * 2.2, .35);
        ctx.fillStyle = E.lin(ctx, 0, gy - gr, 0, gy + gr, [[0, P.core0], [1, P.halo1]]); ctx.beginPath(); ctx.arc(gx, gy, gr, 0, 7); ctx.fill();
        const la = smooth(span(t, S.he + 1.2 + i * .12, S.he + 1.8 + i * .12)) * (1 - smooth(span(t, S.crash - .1, S.crash + .3)));
        if (la > 0) {
          const ly = gy + gr + 34 + (1 - expoOut(la)) * 10;
          E.glowText(ctx, NAMES[i][0], gx, ly, { size: 22, align: 'center', spacing: .08, a: la });
          E.glowText(ctx, NAMES[i][1], gx, ly + 26, { size: 18, weight: 500, align: 'center', col: P.halo2, glow: false, a: la });
        }
      });
    }
    // the chip (gathered light) and the tag
    const chipA = smooth(span(t, S.crash + .5, S.crash + 1.0)), chipGo = span(t, S.stand + .8, S.front + .6);
    if (chipA > 0 && chipGo < 1) {
      const you = out.you, px = you ? you.x + you.h * .05 : CHIP.x, py = you ? you.y - you.h * .45 : CHIP.y;
      const e = quartIO(chipGo), x = lerp(CHIP.x, px, e), y = lerp(CHIP.y, py, e) - Math.sin(Math.PI * e) * 120, s = lerp(1.25, .12, e) * expoOut(chipA);
      const pulse = 1 + .25 * Math.sin(Math.PI * span(t, S.away, S.away + .8));
      halo(ctx, x, y, 150 * s * pulse, .5);
      F.glyph(ctx, 'chip', x, y, s, { lit: 1 });
    }
    {
      const drop = span(t, S.crash + .3, S.crash + 1.1), up = expoIn(span(t, S.last - .1, S.last + .6));
      if (drop > 0 && up < 1) {
        const y = lerp(-260, 40, expoOut(drop)) - up * 520, w = 118;
        tag(ctx, t, CHIP.x + 4, y, w, { text: '$$$$', u: 1, sink: expoIn(span(t, S.newp - .1, S.newp + .25)), size: .3, swing: .03 * Math.sin(t * 1.2) });
        const nu = span(t, S.newp + .15, S.newp + .6);
        if (nu > 0) {
          const h = w * 1.32, size = .36 * w, by = y + h * .7;
          ctx.save(); ctx.translate(CHIP.x + 4, 0); ctx.beginPath(); ctx.rect(-w * .45, by - size * 1.05, w * .9, size * 1.32); ctx.clip();
          ctx.font = `${size}px "Instrument Serif"`; ctx.textAlign = 'center'; ctx.fillStyle = mixHex(P.shade0, P.night1, .35);
          ctx.fillText('$', 0, by + (1 - expoOut(nu)) * size * 1.1); ctx.restore();
        }
      }
    }
    // 12.08 the street of windows opens from the chip
    {
      const o1 = smooth(span(t, S.last, S.last + .9)), c1 = span(t, S.stand - .1, S.stand + .7);
      const chipR = { x: CHIP.x - 60, y: CHIP.y - 60, w: 120, h: 120 };
      if (o1 > 0 && c1 < 1) F.vWindow(ctx, t, c1 > 0 ? lerpR(STREET, chipR, quartIO(c1)) : STREET, c1 > 0 ? 1 : o1, (c, r) => B.street(c, t, r, sineIO(span(t, S.last + .3, S.last + 3.4))), { from: chipR });
    }
    // 12.09 the paper stock list of day 30 flutters out of your pocket and away
    if (out.you) {
      const u = span(t, S.stock - .15, S.stock + 2.6);
      if (u > 0 && u < 1) {
        const x0 = out.you.x + out.you.h * .06, y0 = out.you.y - out.you.h * .42, e = u;
        const x = x0 + e * 1300 + Math.sin(t * 2.3) * 30 * e, y = y0 - Math.sin(e * 2.2) * 260 * Math.min(1, e * 3) + Math.sin(t * 3.1) * 14 * e;
        ctx.save(); ctx.translate(x, y); ctx.rotate(t * 2.2); ctx.scale(lerp(.4, 1, expoOut(span(u, 0, .15))), Math.cos(t * 3.4));
        PR.paperCard(ctx, 0, 0, 46, 60, { lit: .4 });
        ctx.strokeStyle = rgba('#3a3550', .6); ctx.lineWidth = 2; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(-16, -18 + k * 11); ctx.lineTo(14, -18 + k * 11); ctx.stroke(); }
        ctx.restore();
      }
    }
    // 12.10 the HUD umbrella's light drops into your hand (the big umbrella opens there)
    if (out.you) {
      const u = span(t, S.calm - 1.3, S.calm - .6);
      if (u > 0 && u < 1) { const e = quartIO(u), hx = out.you.hands.R[0], hy = out.you.hands.R[1]; const x = lerp(F.HUD_UMB.x, hx, e), y = lerp(F.HUD_UMB.y, hy - 60, e) - Math.sin(Math.PI * e) * 80; halo(ctx, x, y, 60, .6); F.glyph(ctx, 'umbrella', x, y, .5 * (1 - .4 * e), { lit: 1 }); }
    }
    // 12.10 the harvest lines, 12.12 the question
    const hl = goreT.slice(0, 4).map((g0, i) => smooth(span(t, g0 - .1, g0 + .4)) * (1 - smooth(span(t, (goreT[i + 1] ?? S.alone) - .25, (goreT[i + 1] ?? S.alone) + .1))));
    hl.forEach((a, i) => { if (a > 0) E.glowText(ctx, F.GORE_TEXT[i], W - 110, 300 + (1 - expoOut(a)) * 12, { size: 36, align: 'right', spacing: .06, a }); });
    const g5 = smooth(span(t, S.alone - .1, S.alone + .4)) * (1 - smooth(span(t, S.which - .2, S.which + .2)));
    if (g5 > 0) E.glowText(ctx, F.GORE_TEXT[4], W - 110, 300 + (1 - expoOut(g5)) * 12, { size: 36, align: 'right', spacing: .06, a: g5 });
    const q = smooth(span(t, S.which + .1, S.which + .7)) * (1 - smooth(span(t, S.chan + .2, S.chan + .7)));
    if (q > 0) E.glowText(ctx, 'WHICH ONE IS MISSING?', W - 110, 300 + (1 - expoOut(q)) * 14, { size: 52, align: 'right', spacing: .04, a: q });
    ctx.restore();
    // into the dawn light (it becomes your table lamp)
    E.lightFlood(ctx, smooth(span(t, S.d30 - .9, S.d30)));
    hud(ctx, t, op);
  }
  // the HUD counter is on the sign until the pull back has landed; then it flips back into its corner
  const hudBack = () => [S.longest + .7, S.longest + 1.3];
  function hud(ctx, t, clipOpen = 0, value) {
    const a = 1 - clipOpen, [b0, b1] = hudBack(), e = span(t, b0, b1);
    F.hudUmbrella(ctx, t, T, { a });
    if (e >= 1) F.hudDay(ctx, t, T, { a, value });
    else if (e > 0) {
      ctx.save(); ctx.setTransform(1, 0, 0, expoOut(e), 0, (1 - expoOut(e)) * (F.HUD_DAY.y + F.HUD_DAY.h / 2));
      F.flap(ctx, t, F.HUD_DAY.x, F.HUD_DAY.y, F.HUD_DAY.h, { value: F.dayAt(t, T), a, align: 'right', glow: .8 }); ctx.restore();
    }
  }

  // ================================================================================== 12.14–12.16 your table at night
  const TV = [[S.d30, { x: 960, y: 500, s: 6 }], [S.d30 + 1.8, { x: 960, y: 600, s: 1 }, 'o'], [S.know, { x: 880, y: 650, s: 1.18 }], [S.know + .8, { x: 900, y: 640, s: 1.22 }]];
  const TBL = { x: 596, y: 760, w: 1300 };
  function tableWorld(ctx, t, V) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.7, P.night1], [1, mixHex(P.ind0, P.night1, .5)]]); ctx.fillRect(0, 0, W, H);
    ctx.restore();
    ctx.save(); B.vset(ctx, V);
    // a window behind (the night outside, a few stars)
    ctx.fillStyle = mixHex(P.ind0, P.blue1, .2); ctx.fillRect(220, 160, 380, 420); ctx.strokeStyle = rgba(P.blue2, .5); ctx.lineWidth = 6; ctx.strokeRect(220, 160, 380, 420); ctx.beginPath(); ctx.moveTo(410, 160); ctx.lineTo(410, 580); ctx.stroke();
    E.stars(ctx, 32, 14, t, [230, 170, 360, 400], .7);
    const breath = 1 + .03 * Math.sin(t * 1.1);
    PR.table(ctx, t, TBL.x, TBL.y, TBL.w, { lamp: breath });
    ctx.restore();
  }
  function drawTable(ctx, t) {
    const V = B.vcam(t, TV), Vd = { x: V.x + B.drift(t, 1, 1), y: V.y + B.drift(t, .7, 4), s: V.s };
    tableWorld(ctx, t, Vd);
    // the phone: face down on the table; your hand comes and turns it over, lifts it into frame centre
    const reach = span(t, S.know, S.know + .7), lift = span(t, S.know + .6, S.carry + .25), push = span(t, S.carry + .1, t0E());
    const lyX = 760, lyY = 800;
    if (lift <= 0) {
      ctx.save(); B.vset(ctx, Vd);
      ctx.translate(lyX, lyY); ctx.scale(1, .32); ctx.rotate(Math.PI / 2);
      PR.phone(ctx, t, 0, 0, 220, { face: 0 }); ctx.restore();
      if (reach > 0) { ctx.save(); B.vset(ctx, Vd); PR.hand(ctx, lyX + 40, lerp(1250, lyY + 40, expoOut(reach)), 1, { ang: -.25 }); ctx.restore(); }
    } else phoneUp(ctx, t, Vd, lift, push, lyX, lyY);
    // out of the dawn light: the lamp
    E.lightFlood(ctx, 1 - smooth(span(t, S.d30, S.d30 + .9)));
    hud(ctx, t);
  }
  // the lifted phone in screen space: lift 0..1 (rise + turn), push 0..1 (into the screen: it becomes the end screen)
  function phoneGeo(t, Vd, lift, push, lyX, lyY) {
    const [sx, sy] = B.w2s(Vd, lyX, lyY), e = quartIO(lift);
    const h0 = 220 * Vd.s, h1 = 560, x = lerp(sx, W / 2, e), y = lerp(sy, H / 2 + 10, e) - Math.sin(Math.PI * e) * 40;
    const k = Math.exp(lerp(0, Math.log(11), sineIO(push)));
    return { x: lerp(x, W / 2, push), y: lerp(y, H / 2, push), h: lerp(h0, h1, e) * k, face: smooth(span(lift, .25, .85)), k };
  }
  function phoneUp(ctx, t, Vd, lift, push, lyX, lyY) {
    const G = phoneGeo(t, Vd, lift, push, lyX, lyY);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    PR.hand(ctx, G.x + G.h * .1, G.y + G.h * .5, G.h / 560 * 1.1, { ang: -.12 });
    PR.phone(ctx, t, G.x, G.y, G.h, { face: G.face, tilt: (1 - quartIO(lift)) * .4, screen: (c, r) => { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); endPic(c, t, { k: screenK(G.h), tx: G.x, ty: G.y }); c.restore(); } });
    ctx.restore();
  }
  // ================================================================================== 12.17 the end screen (VO end → film end)
  const ENDY = { X: 0, Z: 2600, h: 230 }, ENDHY = 640, ENDH = 400;
  const endYou = (() => { const rc = F.roadSetCam(0, { hy: ENDHY, h: ENDH }), p = F.rpt(rc, ENDY.X, ENDY.Z); return [p[0], p[1] - ENDY.h * p[2] * .75]; })();
  const screenK = (h) => h * .94 / 760;
  const t0E = () => S.carry + 1.15;   // the push into the phone takes ~1 s (smooth.py)
  function endPic(ctx, t, z) {
    const zz = 3600 + 200 * (t - S.know);
    B.road12(ctx, t, T, { k: z.k, px: endYou[0], py: endYou[1], tx: z.tx, ty: z.ty }, {
      z: zz, h: ENDH, hy: ENDHY, warm: .85, dawn: 1, glitter: .25, pad: 1, counter: true, exits: 0, crowd: 0, hall: .3, sun: .25,
      youAt: ENDY, you: { dir: 1, walk: t * 5.5, armR: [2.75, 3.0], back: .3 }, umb: { open: 1, lit: [1, 1, 1, 1, 1], wide5: 1, r: 95, glow: 1 },
      value: 32 + Math.max(0, .08 * Math.sin(t * 1.7)),
    });
  }
  function drawEnd(ctx, t) {
    // the screen has filled the frame at the end of drawTable: continue the same picture, pull back to the end screen, then on slowly
    const kFill = screenK(560 * 11), u = sineIO(span(t, t0E(), t0E() + 3.6)), drift = span(t, t0E() + 3.6, END);
    const k = Math.exp(lerp(Math.log(kFill), Math.log(1), u)) * (1 - .06 * sineIO(drift));
    const tx = lerp(W / 2, endYou[0], u), ty = lerp(H / 2, endYou[1], u);
    endPic(ctx, t, { k, tx, ty });
    hud(ctx, t, 0, 32 + Math.max(0, .07 * Math.sin(t * 1.3 - 2)));
  }
  return [{ t: R.a, draw, print: F.PRINT19 }];
};
