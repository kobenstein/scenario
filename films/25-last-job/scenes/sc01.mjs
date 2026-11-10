// c01 · Hook · the row of task stones (thumbnail A) · an email, a report, a translation · the machine takes them in seconds · one job =
// a row of tasks · they fall · which falls last? · up into the sky: not the factory, the desk · Stanford: the young at the desk fall
// behind · the cool line comes down onto Jakob's row · into the light of TOPIC → the studio (15 years by hand, the last four years) ·
// J1 · every step himself · out of the lamp → Jakob's row falls, TOPIC stands, Jakob beside it = plateJakobRow (lib/f25_seams.mjs).
// 0 → T.G('Ten kinds of work') · built by the lead (quality reference). Plan: docs/shots.md 1.01–1.19 · world/rules: docs/MOTION.md
// ONE entry, two worlds joined by two light doors (the warm light of TOPIC ↔ the desk lamp), continuous camera inside each world.
//
// | ID    | anchor (phrase)                         | picture (one idea)                                               | camera / layer       |
// |-------|-----------------------------------------|------------------------------------------------------------------|----------------------|
// | 1.01★ | There will be a last human job          | the row, the stone of light, you; THE LAST HUMAN JOB (thumbnail) | home · ROW           |
// | 1.02  | Think of something you did at work      | the title sinks; glide right along the stone faces               | glide · ROW          |
// | 1.03  | An email. A report. A translation.      | the glyphs on stones 1–3 light warm on their words               | glide · ROW          |
// | 1.04  | A machine can now do it in seconds      | a cool bead drops from the sky and drains the three glyphs        | follow bead · ROW    |
// | 1.05  | Every job is a row of tasks like that   | pull back: the whole row, bracket ONE JOB                        | pull back · EXPL     |
// | 1.06  | And they're starting to fall · dominoes | the cascade, far → near, every stone leans on the next           | drift · ROW          |
// | 1.07  | So which human job falls last? · not … | the stone of light stands, you look up at it                     | push · ROW           |
// | 1.08  | not in the factory · at the desk        | tilt up into the sky: FACTORY, DESK; the bead swerves to the desk | tilt up · EXPL       |
// | 1.09  | Among young people … a fifth behind     | the Stanford lines grow from the desk: −19 %                     | truck right · EXPL   |
// | 1.10  | The creator … his whole row · his job   | the cool line comes down onto Jakob's row (TOPIC of light near)  | tilt down · ROW      |
// | 1.11  | His name is Jakob                       | push into TOPIC's light → flood → out of the desk lamp           | dive · door          |
// | 1.12  | For fifteen years … video producer      | the studio: the year ruler, the playhead fills the lanes by hand | pull back · STUDIO   |
// | 1.13  | Concepts, shoots, edits, animation      | the lane headers light on their words                            | drift · STUDIO       |
// | 1.14  | … as fast as the last four years        | the last four years of the ruler stretch and turn cool           | rise · STUDIO        |
// | 1.15  | [J1] Topic, idea, script …              | lower third JAKOB · CREATOR; headers light top → bottom          | tilt down · STUDIO   |
// | 1.16  | A few years ago … every step himself    | the whole studio, every lane his                                 | pull back · STUDIO   |
// | 1.17  | Today, a machine does almost all of them | into the lamp → out of TOPIC's light: his row falls, beads lift | dive · door · ROW    |
// | 1.18  | And yet, he's still here.               | Jakob stands beside the stone of light → plateJakobRow            | settle · ROW         |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f25_kit.mjs';
import * as S from '../lib/f25_seams.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn } = E;
const { rise, maskLine, F0 } = F;

export const PRINT = F.PRINT25;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.think = G('Think of something'); a.email = G('An email'); a.report = G('A report'); a.transl = G('A translation');
  a.machine = G('A machine can now'); a.secondsE = GE('in seconds', a.machine);
  a.every = G('Every job is a row'); a.fall = G("And they're starting to fall"); a.dom = G('Like dominoes');
  a.which = G('So which human job'); a.notone = G("It's not the one");
  a.factory = G('in the factory'); a.desk = G('They started at the desk'); a.deskW = G('desk', a.desk);
  a.young = G('Among young people'); a.fifth = G('a fifth behind'); a.youngE = GE('a fifth behind');
  a.creator = G('The creator of this channel'); a.whole = G('his whole row fall'); a.inside = G('Inside his own job');
  a.name = G('His name is Jakob'); a.nameE = GE('His name is Jakob');
  a.fifteen = G('For fifteen years'); a.producer = G('video producer', a.fifteen);
  a.concepts = G('Concepts', a.producer); a.shoots = G('shoots', a.concepts); a.edits = G('edits', a.concepts); a.anim = G('animation', a.concepts);
  a.inall = G('And in all that time'); a.four = G('the last four years', a.inall);
  a.J1 = T.clip('J1'); a.few = G('A few years ago'); a.today = G('Today, a machine does'); a.yet = G("And yet, he's still here");
  a.end = R.b;
  return [{ t: 0, draw: scene(a, T), print: PRINT }];
};

const C = (u, v, s) => E.aim(F0, u, v, s);
const R1 = S.ROW1.stones, R2 = S.ROW2.stones, DX = S.JR_DX;
// the sky field (row-world design px on the F0 card): FACTORY and DESK, the Stanford chart grows from the desk
const FACT = [1800, -600], DESK = [2400, -600], ICON = 220;
const CH = { x: 2500, y: -840, w: 880, h: 480, xr: [0, 1], yr: [-14, 14] };
const WARM_D = [[0, 0], [.25, .6], [.5, 2.6], [.75, 5.8], [1, 10]], COOL_D = [[0, 0], [.25, -.8], [.5, -4], [.75, -7.6], [1, -11]];
// J1: when he names each step (s after the slot start, from the o-ton) → lane index (LANES bottom → top: MUSIC … TOPIC)
const J1_WORDS = [[4.85, 8], [5.5, 7], [6.1, 6], [6.75, 5], [7.5, 4], [8.0, 3], [8.6, 1], [8.95, 2], [9.5, 0]];
// the face centre of stone 0 of ROW2 (TOPIC, the light) in row-world coordinates: the door into the studio
const TOPIC = [R2[0].x + R2[0].w / 2 + DX, R2[0].y - R2[0].h * .56];

function scene(a, T) {
  const tf1 = a.nameE + .25;                 // flood peak 1: into TOPIC's light → the studio (before "For fifteen years")
  const tf2 = a.today - .1;                  // flood peak 2: into the lamp → back to Jakob's row ("Today, a machine …")
  const tc1 = a.fall + .25;                  // ROW1 cascade starts (far end)
  const tc2 = tf2 + .55;                     // ROW2 cascade starts (the bead on MUSIC pushes)
  const tRows = a.young + 1.2;               // switch ROW1 → ROW2 while the camera is up in the sky (both rows out of frame)
  const tPlate = a.end - S.SEAM_HALF;
  // bead path 1 (1.04): from the sky through glyphs 1–3, then up to its parking place; 1.08: factory → desk → chart origin
  const touch = [a.machine + .55, a.machine + 1.0, a.machine + 1.45];
  const gpos = (i) => [R1[i].x + R1[i].w / 2, R1[i].y - R1[i].h * .74];   // glyph centres (each on its own card; projected below)
  const PARK = [1660, -140];

  // ---------------------------------------------------------------- row-world camera (row-world design coordinates)
  const KA = [
    [-3, C(925, 534, .95)], [0, C(960, 540, 1)], [a.think, C(1050, 552, 1.11)], [a.email - .2, C(1330, 500, 1.2)], [a.machine + 1.2, C(1470, 470, 1.3)],
    [a.every + .3, C(1420, 450, 1.08)], [a.fall + .3, C(1600, 390, .74)], [a.dom + .7, C(1250, 430, .7)], [a.which + .5, C(880, 560, 1.06)],
    [a.factory - .8, C(960, 520, 1.32)], [a.factory + .6, C(1850, -560, 1.0)], [a.deskW + .5, C(2150, -580, 1.03)],
    [a.young + 1.6, C(2700, -600, .98)], [a.youngE + .3, C(2980, -540, 1.1)], [a.whole + .2, C(3300, -120, .96)],
    [a.inside + .2, C(DX + 1000, 520, .98)], [a.name - .25, C(DX + 900, 495, 1.24)],
  ];
  // the last seconds already ride the plate's creep line (push 3 %/s + truck 16 px/s), extended backwards from tPlate
  const creepCam = (t) => C(DX + 1010 + S.TRUCK * (t - tPlate), 560, 1.06 * (1 + S.CREEP * (t - tPlate)));
  const tCreep = Math.max(a.yet - .6, tf2 + 2.4 + 1.6);   // real timing: 'And yet' comes sooner after 'Today, a machine …'; the lamp dive (ends tf2 + 2.4) must finish first, then glide onto the creep line
  const KC = [[tf2 + 2.4, C(DX + 1150, 470, .84)], [tCreep, creepCam(tCreep)]];
  // studio camera (studio design coordinates)
  const j1s = a.J1.start;
  const KB = [
    [tf1 + .95, C(600, 700, 2.0)], [a.producer + .3, C(860, 540, .96)], [a.concepts + .3, C(910, 520, .99)],
    [a.four + .4, C(1000, 485, 1.04)], [j1s + 1.2, C(1060, 460, 1.08)], [j1s + 4.0, C(1120, 300, 1.32)], [j1s + 5.0, C(1150, 260, 1.42)], [j1s + 9.9, C(1150, 700, 1.42)],
    [a.few + .6, C(960, 540, 1.0)], [tf2 - 1.7, C(880, 600, 1.12)],
  ];
  const camRow = (t) => {
    if (t < tf2) {
      if (t <= a.name - .25) return F.camPath(t, KA);
      return E.camAt(t, [[a.name - .25, KA[KA.length - 1][1]], [tf1, C(TOPIC[0], TOPIC[1], 18), 'i']]);
    }
    if (t < tf2 + 2.4) return E.camAt(t, [[tf2, C(TOPIC[0], TOPIC[1], 18)], [tf2 + 2.4, KC[0][1], 'o']]);
    return t < tCreep ? F.camPath(t, KC) : creepCam(t);
  };
  const camStudio = (t) => {
    if (t < tf1 + .95) return E.camAt(t, [[tf1, F.STUDIO_CAM.lamp(18)], [tf1 + .95, KB[0][1], 'o']]);
    if (t < tf2 - 1.7) return F.camPath(t, KB);
    return E.camAt(t, [[tf2 - 1.7, KB[KB.length - 1][1]], [tf2, F.STUDIO_CAM.lamp(18), 'i']]);
  };

  // ---------------------------------------------------------------- the row world
  function rows(ctx, t) {
    const c = E.camDrift(camRow(t), t, .6, 3);
    const which = t < tRows ? 1 : 2;
    if (which === 1) {
      const cs = F.cascade(t, S.ROW1, tc1, { stopAt: 0, nudge: .45 });
      const cool1 = R1.map((s, i) => Math.max(i >= 1 && i <= 3 ? span(t, touch[i - 1] - .05, touch[i - 1] + .3) : 0, i ? span(t, cs.start[i], cs.hit[i]) : 0));
      const lit1 = R1.map((s, i) => (i === 1 ? span(t, a.email, a.email + .35) : i === 2 ? span(t, a.report, a.report + .35) : i === 3 ? span(t, a.transl, a.transl + .35) : 0));
      S.rowWorld(ctx, c, t, { rows: 1, a1: cs.a, cool1, lit1, du: { look: .3 + .25 * sineIO(span(t, a.which, a.which + 1.2)) } });
      oneJob(ctx, t, c);
    } else {
      const fallen = t >= tf2, cs = F.cascade(t, S.ROW2, tc2, { stopAt: 0, nudge: .45 });
      const cool2 = R2.map((s, i) => (i && fallen ? span(t, cs.start[i], cs.hit[i]) : 0));
      S.rowWorld(ctx, c, t, { rows: 2, a2: fallen ? cs.a : null, cool2, jakob: fallen ? { look: .12 } : false });
      if (fallen) lifting(ctx, t, c, cs);
    }
    sky(ctx, t, c);
    return c;
  }
  // bracket ONE JOB over the row (screen space, following the projected stone tops)
  function oneJob(ctx, t, c) {
    const u = expoOut(span(t, a.every + .35, a.every + 1.3)) * (1 - expoIn(span(t, a.dom + .2, a.dom + .9)));
    if (u <= 0) return;
    const p1 = E.project(c, R1[1].Z, R1[1].x, R1[1].y - R1[1].h), pn = E.project(c, R1[13].Z, R1[13].x + R1[13].w, R1[13].y - R1[13].h);
    if (!p1 || !pn) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.bracket(ctx, p1[0], pn[0], p1[1] - 46, u, 'ONE JOB', { size: 30 }); ctx.restore();
  }
  // things in the sky field (F0 card, row-world coordinates): the bead, FACTORY / DESK, the Stanford chart, the cool line down
  function sky(ctx, t, c) {
    const cool = span(t, a.deskW + .45, a.deskW + .8);
    E.card(ctx, c, F0, () => {
      // FACTORY and DESK: they grow out of two stars (scale from a point) as the camera tilts up
      const ef = expoOut(span(t, a.factory - .5, a.factory + .4)), ed = expoOut(span(t, a.desk - .2, a.desk + .7));
      if (ef > 0) { F.glyph(ctx, 'factory', FACT[0], FACT[1], ICON * ef, { lit: 0, col: 'cream', glow: .6 }); F.label(ctx, FACT[0] - 30, FACT[1] + 120, 'FACTORY', null, rise(span(t, a.factory, a.factory + .7)), { dx: 0, dy: 0 }); }
      if (ed > 0) {
        F.glyph(ctx, 'desk', DESK[0], DESK[1], ICON * ed, { lit: 0, col: cool > .5 ? 'cool' : 'cream', glow: .6 + cool });
        F.label(ctx, DESK[0] - 22, DESK[1] + 120, 'DESK', null, rise(span(t, a.deskW, a.deskW + .7)), { dx: 0, dy: 0, col: cool > .5 ? 'cool' : undefined });
      }
      // Stanford: two lines grow from the desk
      const uw = sineIO(span(t, a.young + .2, a.young + 2.6)), uc = span(t, a.young + .5, a.fifth + .3);
      if (uw > 0 || uc > 0) {
        const ch = F.chartLines(ctx, t, { ...CH, base: 0, axisU: span(t, a.young, a.young + 1), xTicks: [[0, '2022'], [1, '2026']],
          series: [{ data: WARM_D, col: 'warm', u: uw, label: 'LEAST EXPOSED' }, { data: COOL_D, col: 'cool', u: t < a.creator - .2 ? Math.min(uc, .999) : 1, label: 'MOST EXPOSED', labelDy: 4 }] });
        const vu = rise(span(t, a.fifth - .1, a.fifth + .6));
        if (vu > 0 && ch.heads[0] && ch.heads[1]) {
          const x = ch.heads[1][0] + 4, y0 = ch.heads[0][1] + 10, y1 = ch.heads[1][1] - 10;
          ctx.strokeStyle = rgba(F.COOL.line, .8 * vu); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, lerp(y0, y1, expoOut(vu))); ctx.stroke();
          maskLine(ctx, [['19 %', 0]], x - 26, (y0 + y1) / 2 + 22, 74, vu, { align: 'right', col: P.cream });
          maskLine(ctx, [['BEHIND · AGES 22–25', 0]], x - 26, (y0 + y1) / 2 + 62, 22, rise(span(t, a.fifth + .3, a.fifth + 1)), { serif: false, weight: 600, align: 'right', col: F.COOL.text, glow: false });
        }
      }
    });
    // the bead (the carrier): row 1 glyphs → park → factory → desk → it IS the head of the cool line → down onto Jakob's row
    const bead = beadAt(t, c);
    if (bead) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.agent(ctx, t, bead[0], bead[1], bead[2], { ring: bead[3] ?? 1, think: bead[4] ?? 0 }); ctx.restore(); }
  }
  // screen position of the bead: [x, y, r, ring, think] or null
  const scr = (c, Z, u, v) => E.project(c, Z, u, v);
  function downPath(c) {   // the cool line from the chart's cool head down onto the far stone of Jakob's row (F0-card coords, per frame)
    const m = E.cardM(c, F0), far = R2[8], p = scr(S.shift(c, DX), far.Z, far.x + far.w * .5, far.y - far.h - 18);
    if (!m || !p) return null;
    const tgt = [(p[0] - m.e) / m.k, (p[1] - m.f) / m.k], h = [CH.x + CH.w, CH.y + CH.h - (-11 - CH.yr[0]) / (CH.yr[1] - CH.yr[0]) * CH.h];
    return E.catmull([[...h, 5], [h[0] + 120, h[1] + 160, 5], [lerp(h[0], tgt[0], .6) + 80, lerp(h[1], tgt[1], .55), 5], [tgt[0], tgt[1], 5]], 16);
  }
  function beadAt(t, c) {
    const t0 = a.machine - .45;
    if (t < t0) return null;
    if (t < tRows) {
      // key points on the F0 card; glyph touches projected from each stone's card onto F0 so the bead meets the glyph on screen
      const m = E.cardM(c, F0); if (!m) return null;
      const onF0 = (Z, u, v) => { const p = scr(c, Z, u, v); return [(p[0] - m.e) / m.k, (p[1] - m.f) / m.k]; };
      const g = [1, 2, 3].map((i) => onF0(R1[i].Z, ...gpos(i)));
      const keys = [[t0, [1500, -260]], [touch[0], g[0]], [touch[1], g[1]], [touch[2], g[2]], [touch[2] + 1.6, PARK],
        [a.factory - .9, [PARK[0] + 20, PARK[1] - 30]], [a.factory + .25, [FACT[0] + 40, FACT[1] - 130]], [a.deskW - .25, [FACT[0] + 160, FACT[1] - 150]],
        [a.deskW + .45, [DESK[0], DESK[1] - 40]], [a.young + .5, [CH.x, CH.y + CH.h / 2]]];
      let p;
      if (t >= keys[keys.length - 1][0]) p = keys[keys.length - 1][1];
      else { let i = 0; while (t > keys[i + 1][0]) i++; const u = sineIO((t - keys[i][0]) / (keys[i + 1][0] - keys[i][0])); p = [lerp(keys[i][1][0], keys[i + 1][1][0], u), lerp(keys[i][1][1], keys[i + 1][1][1], u)];
        if (i >= 5 && i <= 6) { const w = Math.sin(Math.PI * u); p[0] += 60 * w * (i === 5 ? 1 : -1); p[1] -= 40 * w; } }
      if (t >= a.young + .5) return null;   // from here the chart's cool line carries its own bead at its head
      const hov = t > touch[2] + 1.6 ? [5 * Math.sin(t * 1.3), 4 * Math.sin(t * 1.7)] : [0, 0];
      const s = scr(c, F0, p[0] + hov[0], p[1] + hov[1]);
      return [s[0], s[1], 14 * s[2], 1, t > touch[2] + 1.6 && t < a.factory - .9 ? .5 : 0];
    }
    // ROW2 phase: the cool line comes down onto Jakob's far stone; the bead sits there until it pushes the cascade
    if (t < tf2) {
      const pts = downPath(c); if (!pts) return null;
      const u = sineIO(span(t, a.creator - .2, a.inside + .4));
      let hp;
      E.card(ctx_, c, F0, () => { hp = F.coolPath(ctx_, pts, Math.max(0, u - .35), u, 5, 1 - span(t, a.inside + .4, a.inside + 1.2)); });
      if (u <= 0 || !hp) return null;
      const s = scr(c, F0, hp[0], hp[1] + (u >= 1 ? 3 * Math.sin(t * 2) : 0));
      return [s[0], s[1], 14 * s[2], 1, u >= 1 ? .6 : 0];
    }
    return null;
  }
  // beads lift off Jakob's falling stones (the machine takes each step) and shrink away into the sky
  function lifting(ctx, t, c, cs) {
    const c2 = S.shift(c, DX);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (let i = 1; i < R2.length; i++) {
      const u = span(t, cs.hit[i] - .15, cs.hit[i] + 3.2); if (u <= 0 || u >= 1) continue;
      const s = R2[i], ang = cs.a[i], gx = s.x + s.w * .5 * Math.cos(ang) - s.h * .74 * Math.sin(ang), gy = s.y - s.h * .74 * Math.cos(ang) - s.w * .5 * Math.sin(ang);
      const p = scr(c2, s.Z, gx, gy); if (!p) continue;
      F.agent(ctx, t, p[0] + 30 * sineIO(u) * p[2], p[1] - 420 * sineIO(u) * p[2], 10 * p[2] * (1 - u * u), { ring: 1 - u });
    }
    // the first bead (sat on MUSIC since 1.10): it rocks the far stone, then lifts with the others
    const s = R2[8], pu = span(t, tc2 - .6, tc2 + .2), lift = span(t, tc2 + .2, tc2 + 2.2);
    if (lift < 1) { const p = scr(c2, s.Z, s.x + s.w * .5 + 14 * Math.sin(Math.PI * pu), s.y - s.h - 18 - 300 * sineIO(lift));
      if (p) F.agent(ctx, t, p[0], p[1], 11 * p[2] * (1 - lift * lift), { ring: 1 - lift, think: .6 * (1 - lift) }); }
    ctx.restore();
  }

  // ---------------------------------------------------------------- the studio
  function room(ctx, t) {
    const c = E.camDrift(camStudio(t), t, .6, 7);
    const ph = sineIO(span(t, a.fifteen + .1, a.inall + .6));
    const lit = new Array(9).fill(0);
    for (const [w, i] of [[a.concepts, 7], [a.shoots, 4], [a.edits, 3], [a.anim, 2]]) lit[i] = Math.max(lit[i], rise(span(t, w - .05, w + .3)) * (1 - .6 * span(t, w + 1.2, w + 2.2)));
    for (const [d, i] of J1_WORDS) lit[i] = Math.max(lit[i], rise(span(t, j1(d) - .05, j1(d) + .3)) * (1 - .45 * span(t, j1(d) + 1.4, j1(d) + 2.4)));
    const all = rise(span(t, a.few + .3, a.few + 1.2));
    for (let i = 0; i < 9; i++) lit[i] = Math.max(lit[i], .75 * all * (.75 + .25 * Math.sin(t * 2.1 + i * .7)));
    F.studio(ctx, c, t, {
      hand: new Array(9).fill(ph), playhead: .002 + ph * .996, lit, work: 1, level: 0,
      ruler: { u: span(t, a.fifteen - .1, a.fifteen + 2.4), hot: sineIO(span(t, a.four, a.four + 1.5)) },
    });
    return c;
  }
  const j1 = (d) => a.J1.start + d;

  let ctx_ = null;
  return (ctx, t) => {
    ctx_ = ctx;
    if (t >= tPlate) { S.plateJakobRow(ctx, t, T); return; }
    const inStudio = t >= tf1 && t < tf2;
    if (inStudio) room(ctx, t); else rows(ctx, t);
    // screen-space layer: the title (1.01), the source line (1.09), the lower third (J1)
    F.title(ctx, t, 96, 330, 1, { size: 112, out: span(t, a.think - .5, a.think + .45) });
    F.source(ctx, t, a.young + .8, a.whole, F.SOURCES.stanford);
    if (inStudio) F.lowerThird(ctx, t, T, 'J1', { y: 170 });   // top left: the room is empty there, Jakob stands bottom left
    // the light doors: both sides of each flood peak draw the full flood
    const fl = (tp) => (t < tp ? E.smooth(span(t, tp - 1.4, tp)) : 1 - E.smooth(span(t, tp, tp + 1.4)));   // slow enough for smooth.py (< 12/frame)
    E.lightFlood(ctx, Math.max(fl(tf1), fl(tf2)));
  };
}
