// Chunk c12 · "Wanting to" · 05a "When people in Kenya" → 05b → clip A · shots 12.01–12.09 · ★ 12.08. Builder c12.
// In: plate c11>c12 (paper, warm). Out: plate c12>c13 (line, y 600, amber). Every beat is anchored to a VO word (T.S / T.E).
//
// PLAN (gate 2) · one continuous take in three worlds, each change of world carried by an object the camera flies into or out of
// | shot  | words                                  | image                                                       | hero light           | camera                                  | flows on                         | ★ | sound                 |
// |-------|----------------------------------------|-------------------------------------------------------------|----------------------|-----------------------------------------|----------------------------------|---|-----------------------|
// | 12.01 | When people in Kenya received a basic  | the warm paper IS the plate; it is the sheet of an engraved | the watermark rosette| pull back (zoom about a fixed point at  | the home village's light opens   |   | foil_glint (pause     |
// |       | income, they didn't work less.         | atlas: Kenya (Natural Earth), lakes, rift, 28 village dots; | becomes the compass  | the lower right) ×0.44 until Kenya and  | into a round vignette: push into |   | after "Kenya")        |
// |       |                                        | the rosette catches foil light, a foil seal grows (the      | rose: amber foil     | the rose share the frame; slow drift    | it (exact: the vignette covers   |   |                       |
// |       |                                        | income slip's); two waves of foil lights fly in arcs to the | lights fly to the    | toward the villages; push into one      | the frame on "Many")             |   |                       |
// |       |                                        | villages, which light and keep breathing (didn't work less) | villages             | village on "less"                       |                                  |   |                       |
// | 12.02 | Many started their own businesses.     | a roadside in western Kenya: a woman rolls up the shutter   | warm morning sun     | slow push (k 1 → 1.08)                  | the tailor's thread runs out     |   | tape_measure (thread  |
// |       |                                        | of her duka (up on "businesses"), a tailor at a treadle     |                      |                                         |                                  |   | unspools, pause)      |
// |       |                                        | machine, a mechanic truing a bicycle wheel, chickens, a     |                      |                                         |                                  |   |                       |
// |       |                                        | mango tree, kites circling                                  |                      |                                         |                                  |   |                       |
// | 12.03 | That's less surprising than it sounds. | the amber thread whips out of the stall, up into the sky and| the thread (amber)   | tilt up following the thread's free end | the circle is the dial's rim     |   | tone (circle taut)    |
// |       |                                        | round: a circle, closed and pulled taut on "sounds"         |                      |                                         |                                  |   |                       |
// | 12.04 | People feel fully absorbed, fully      | a burin spirals out of the centre and cuts a 24-hour dial;  | the flow marks (amber| slow push on the dial                   | the dial tightens into a star    |   | shimmer_rings (star)  |
// |       | alive, more often at work than on the  | the hand sweeps 8 → 24 h, striking amber flow marks: dense  | diamonds), the ring  |                                         |                                  |   |                       |
// |       | couch.                                 | at work, sparse in the evening (a sofa); glint on "alive";  |                      |                                         |                                  |   |                       |
// |       |                                        | the sky and the street follow the hand into the night       |                      |                                         |                                  |   |                       |
// | 12.05 | So, those two things that sounded      | the two letterpress plates of the minute are born from the  | HAVING TO's pinholes | tilt up with the star; breathe with the | —                                |   | card (land on "alike")|
// |       | alike?                                 | star, part, and land stacked exactly on "alike" (light dims)| (dim on "alike")     | plates                                  |                                  |   |                       |
// | 12.06 | Here's the difference.                 | they split in depth: plate I sinks into cold shadow, plate  | HAVING TO bright     | follow plate II                         | fly into one pinhole's light     |   | whoosh_airy           |
// |       |                                        | II comes forward and warms                                  |                      |                                         |                                  |   |                       |
// | 12.07 | Not having to work doesn't mean not    | out of the light: it is the lamp over a potter's wheel; pull| the lamp (amber)     | pull back from the lamp (log zoom) to   | —                                |   | bloom (the light)     |
// |       | working.                               | back through her room into the cut-away esteem street of    |                      | the hill view H3 at dusk                |                                  |   |                       |
// |       |                                        | the Maslow hill (H3, dusk): every workshop busy             |                      |                                         |                                  |   |                       |
// | 12.08 | It means wanting to.                   | ESTEEM and SELF-ACTUALIZATION light in one sweep left →     | the sweep            | hold, then push to the town square      | the sweep's light ignites the    | ★ |                       |
// |       |                                        | right; their labels turn cream                              |                      |                                         | frame's bottom rule              |   |                       |
// | 12.09 | CLIP A (Altman, 350.05–371.46)         | a tall engraved frame (a lit poster column) in the town     | the screen; the rule | settle on the frame (picture ≥ 780 px), | the rule IS the line plate       |   | screen_off            |
// |       |                                        | square; the clip turns on in it; lower third; the square    | (amber) under it     | drift; at the end push onto the rule    | (c12>c13, y 600)                 |   |                       |
// |       |                                        | drifts at low brightness; the clip collapses into the rule  |                      | until it fills the frame                |                                  |   |                       |
import { W, H, rgba, clamp, lin, mix, sm, eout, eio, drift } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { ready, qio, eiq, eoq, smoother, glowAt, paperSheet, paperVignette, sourceLine } from '../lib/v2_c12_kit.mjs';
import { MAP, drawMap, drawMapLabels, drawVillageNote, drawRose, drawVillages, drawPayments, drawLandings, landT, drawMedallion } from '../lib/v2_c12_map.mjs';
import { roadGround, roadSky, prewarmRoad } from '../lib/v2_c12_road.mjs';
import { DIAL, drawThread, threadAt, drawDial, hourAt } from '../lib/v2_c12_dial.mjs';
import { plate, plateShadow, plateGlow, PW, PH, HOLE, targetHole, prewarmPlates } from '../lib/v2_c12_plates.mjs';
import { FOC, DH, LAMP0, view, drawStreet } from '../lib/v2_c12_street.mjs';
import { FR, RULE, housing, screen, spill, lowerThird, covers } from '../lib/v2_c12_frame.mjs';
import { ROOT } from '../lib/kit.mjs';
import { loadImage } from '@napi-rs/canvas';

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c12', T);
  const S = (p, n) => T.S('05a', p, n), E = (p, n) => T.E('05a', p, n), S5 = (p) => T.S('05b', p), E5 = (p) => T.E('05b', p);
  const K = {
    a: HI.b, when: S('When people'), kenya: S('Kenya'), received: S('received'), income: S('basic income'), incomeE: E('basic income'),
    they: S("they didn't"), less: S('less'), lessE: E('less'),
    many: S('Many started'), biz: S('businesses'), bizE: E('businesses'),
    thats: S("That's less"), sounds: S('sounds'), soundsE: E('sounds'),
    people: S('People feel'), alive: S('alive'), work: S('work than'), couch: S('couch'), couchE: E('couch'),
    so: S('So, those'), those: S('those two'), two: S('two things'), alike: S('alike'), alikeE: E('alike'), heres: S("Here's the"), diff: S('difference'), diffE: E('difference'),
    not: S5('Not having'), working: S5('working'), workingE: E5('working'), it: S5('It means'), wanting: S5('wanting'), toE: E5('wanting to'),
    clipA: T.clip('A').start, clipB: T.clip('A').end, end: HO.a,
  };
  // 12.01 map
  K.pullB = K.kenya + .45; K.w0 = K.received + .08; K.w1 = K.income + .3; K.pushA = K.less - .15;
  // 12.02–12.04 roadside, thread, dial
  K.shutA = K.many + .12; K.shutB = K.biz + .02; K.start = K.bizE + .18; K.close = K.sounds + .05; K.tailA = K.close + .22; K.tailB = K.close + .8;
  K.faceA = K.close + .3; K.faceB = K.people + .25; K.sweepA = K.faceB + .05; K.sweepB = K.couchE + .3;
  // 12.05–12.07 star, plates, the pinhole
  K.tightA = K.so - .2; K.tightB = K.so + .35; K.flyA = Math.max(K.diffE + .02, K.diff + .66); K.flyB = K.not - .3;

  // ======================================================================== 12.01 the map
  const KV = .40, PF = [1857, 1186], RHO = 1110, KP = 2.2, kr0 = 1.12, Q0 = [990, 615];
  const villageLit = (i, t) => sm(clamp((t - landT(i, 0, K.w0)) / .25));
  function mapCam(t) {
    const V = MAP.vil[MAP.home];
    const u = qio(lin(K.a, K.pullB, t)), k0 = Math.exp(Math.log(KV) * u);
    if (t < K.pullB) return { k: k0, e: PF[0] * (1 - k0), f: PF[1] * (1 - k0), ep: 0 };
    const Vs0 = [V.x * KV + PF[0] * (1 - KV), V.y * KV + PF[1] * (1 - KV)];
    const kd = KV * (1 + .07 * sm(lin(K.pullB, K.pushA + .4, t))), up = lin(K.pushA, K.many, t), ep = eio(up);
    const k = kd * Math.exp(Math.log(KP) * ep), vs = [mix(Vs0[0], 960, ep), mix(Vs0[1], 540, ep)];
    return { k, e: vs[0] - V.x * k, f: vs[1] - V.y * k, ep, vs, V };
  }
  function mapTake(ctx, t) {
    const c = mapCam(t), g = MAP;
    const view = [-c.e / c.k, -c.f / c.k, (W - c.e) / c.k, (H - c.f) / c.k];
    const rho = c.ep > 0 ? RHO * Math.pow(c.ep, 2.2) : 0;
    const covered = rho > 0 && Math.hypot(Math.max(c.vs[0], W - c.vs[0]), Math.max(c.vs[1], H - c.vs[1])) < rho;
    if (!covered) {
      ctx.save(); ctx.setTransform(c.k, 0, 0, c.k, c.e, c.f);
      paperSheet(ctx, t, { view });
      drawMap(ctx, t, { k: c.k });
      drawMapLabels(ctx, KV, 1);
      drawVillageNote(ctx, KV, sm(lin(K.received + .2, K.received + .7, t)));
      drawRose(ctx, t, sm(lin(K.received - .3, K.received + .25, t)));
      drawLandings(ctx, t, [K.w0, K.w1]);
      drawVillages(ctx, t, (i) => villageLit(i, t), { k: c.k });
      drawPayments(ctx, t, [K.w0, K.w1]);
      ctx.restore();
    }
    // the home village opens into the roadside vignette
    if (rho > .5) {
      const V = c.V, rm = rho / c.k;
      ctx.save(); ctx.setTransform(c.k, 0, 0, c.k, c.e, c.f);
      drawMedallion(ctx, t, V.x, V.y, rm, (cx) => {
        if (rho < 3) return;
        const s = rho / RHO * kr0; cx.setTransform(s, 0, 0, s, c.vs[0] - Q0[0] * s, c.vs[1] - Q0[1] * s);
        roadWorld(cx, t, { x: Q0[0], y: Q0[1], k: s, sx: c.vs[0], sy: c.vs[1] }, 8);
      }, { k: c.k });
      // the village's own light sits on the opening vignette until it is wide open
      const la = 1 - clamp(rho / 70); if (la > 0) glowAt(ctx, V.x, V.y, 60, .8 * la, '#ffb35c');
      ctx.restore();
    }
    // the plate's vignette belongs to the paper: it stays outside the opening vignette
    if (!covered) { ctx.save(); if (rho > .5) { ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.arc(c.vs[0], c.vs[1], rho, 0, Math.PI * 2); ctx.clip('evenodd'); } paperVignette(ctx, 1); ctx.restore(); }
    sourceLine(ctx, 'Banerjee, Faye, Krueger, Niehaus & Suri · NBER 2023', 84, 892, sm(lin(K.received - .25, K.received + .25, t)) * (1 - sm(lin(K.pushA + .3, K.pushA + .6, t))), { col: '#3a2616', shadow: 'rgba(246,231,201,.7)', blur: 6, alpha: .85 });
  }

  // ======================================================================== 12.02–12.06 the roadside world (native units)
  const shutterY = (t) => mix(704, 522, qio(lin(K.shutA, K.shutB, t)));
  const hourOf = (t) => (t < K.sweepA ? 8 : hourAt(t, K));
  // the road world under a camera {x, y, k} (centre of the screen = (sx, sy), default 960/540); hour h
  function roadWorld(ctx, t, cam, h) {
    const k = cam.k, sx = cam.sx ?? W / 2, sy = cam.sy ?? H / 2;
    const view = [cam.x - sx / k, cam.y - sy / k, cam.x + (W - sx) / k, cam.y + (H - sy) / k];
    roadSky(ctx, t, { hour: h, view });
    if (view[3] > 360) roadGround(ctx, t, { hour: h, yb: shutterY(t), letGo: sm(lin(K.bizE + .05, K.bizE + .6, t)) });
  }
  // the dial's collapse into a star that rises into the night (12.05)
  const tight = (t) => eiq(lin(K.tightA, K.tightB, t));
  const starY = (t) => DIAL.y - 220 * eio(lin(K.tightA + .1, K.tightB + .25, t));
  const O = [DIAL.x, DIAL.y - 220];
  function roadCam(t) {
    let x = Q0[0], y = Q0[1], k = kr0;
    const u1 = sm(lin(K.many, K.thats - .15, t)); x = mix(x, 1000, u1); y = mix(y, 630, u1); k = mix(k, 1.2, u1);
    const u2 = qio(lin(K.start + .2, K.start + 1.25, t)); x = mix(x, DIAL.x, u2); y = mix(y, 90, u2); k = mix(k, 1.1, u2);   // follows the thread's free end up
    k *= 1 + .05 * sm(lin(K.sweepA, K.tightA, t));
    const u4 = qio(lin(K.tightA, K.tightB + .3, t)); y = mix(y, O[1], u4); k = mix(k, 1.08, u4);
    const dr = sm(lin(K.many, K.many + 1.2, t));                      // the drift starts from rest where the vignette handed over
    return { x: x + drift(t, 5, 3) * dr * (1 - .5 * u4), y: y + drift(t, 4, 5) * dr, k };
  }
  // ---- the plates (plate units, origin = the star O; PS native units per plate unit)
  const PS = .78;
  function plates(t) {
    const born = eout(lin(K.tightB, K.tightB + .55, t)), born2 = eout(lin(K.those - .2, K.those + .3, t));
    const u1 = eio(lin(K.those - .12, K.two + .45, t)), u2 = eio(lin(K.alike - .5, K.alikeE, t)), u3 = eio(lin(K.diff - .15, K.diff + .72, t));
    let x1 = mix(0, -560, u1), y1 = mix(0, 12, u1); x1 = mix(x1, 0, u2); y1 = mix(y1, 0, u2); x1 = mix(x1, -640, u3); y1 = mix(y1, 60, u3);
    let x2 = mix(0, 560, u1), y2 = mix(0, -12, u1); x2 = mix(x2, 0, u2); y2 = mix(y2, 0, u2); x2 = mix(x2, 420, u3); y2 = mix(y2, -40, u3);
    const dim = sm(lin(K.alike - .1, K.alikeE, t)) * (1 - sm(lin(K.diff - .1, K.diff + .3, t)));
    return {
      p1: { x: x1, y: y1, s: mix(.1, 1, born) * mix(1, .64, u3), rot: -.035 * u3 + .004 * Math.sin(t * .6), lift: .2 + .3 * u1 * (1 - u2), cold: u3, born },
      p2: { x: x2, y: y2 - 14 * Math.sin(Math.PI * u1), s: mix(.6, 1, born2) * mix(1, 1.1, u3), rot: .02 * Math.sin(Math.PI * u1) - .012 * Math.sin(Math.PI * u2) + .003 * Math.sin(t * .5 + 1), lift: clamp(Math.sin(Math.PI * u1) * .9 + .25 + Math.sin(Math.PI * u2) * .6 + .4 * u3), warm: u3, born: born2 },
      glow: Math.min(1.25, (1 - .82 * dim) + .25 * u3), u1, u2, u3,
    };
  }
  const plateAt = (P, px, py) => [O[0] + (P.x + (px * Math.cos(P.rot) - py * Math.sin(P.rot)) * P.s) * PS, O[1] + (P.y + (px * Math.sin(P.rot) + py * Math.cos(P.rot)) * P.s) * PS];
  function drawPlates(ctx, t, pl, hi) {
    const one = (P, kind, o) => {
      ctx.save(); ctx.translate(O[0] + P.x * PS, starY(t) + P.y * PS); ctx.rotate(P.rot); ctx.scale(P.s * PS, P.s * PS);
      plateShadow(ctx, P.lift, clamp(P.born * 1.4));
      plate(ctx, t, { kind, cut: kind === 2 ? 1 : 0, ...o });
      if (P.born < 1) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba('#ffcf8a', .9 * (1 - P.born) ** 1.5); ctx.fillRect(-PW / 2, -PH / 2, PW, PH); }
      ctx.restore();
    };
    if (pl.p1.born > 0) one(pl.p1, 1, { cold: pl.p1.cold });
    if (pl.p2.born > 0) one(pl.p2, 2, { glow: pl.glow, warm: pl.p2.warm * .8, hi });
  }
  // the fly into plate II's pinhole (12.06 → 12.07): camera {x, y, k} in native units, the light's screen radius
  function flyCam(t, base) {
    const pl = plates(t), [hx, hy] = targetHole(), hp = plateAt(pl.p2, hx, hy);
    const u = lin(K.flyA, K.flyB, t), e = eiq(u) * .82 + .18 * qio(u), kEnd = 46 / (PS * pl.p2.s);
    const k = Math.exp(mix(Math.log(base.k), Math.log(kEnd), e)), cx = mix(base.x, hp[0], qio(clamp(u * 1.5))), cy = mix(base.y, hp[1], qio(clamp(u * 1.5)));
    return { x: cx, y: cy, k, hp, pl, u };
  }
  function roadTake(ctx, t) {
    let c = roadCam(t), fly = null;
    if (t >= K.flyA) { fly = flyCam(t, c); c = { x: fly.x, y: fly.y, k: fly.k }; }
    ctx.save(); ctx.setTransform(c.k, 0, 0, c.k, W / 2 - c.x * c.k, H / 2 - c.y * c.k);
    const h = hourOf(t), night = clamp((h - 18) / 3);
    const plateFill = fly && fly.pl.p2.s * PS * c.k * PW > W * 3;          // deep in the fly-in: plate II covers the frame
    if (!plateFill) roadWorld(ctx, t, c, h);
    // thread, dial and star
    if (t < K.tightB + .3) {
      const sc = 1 - .985 * tight(t), dy = starY(t) - DIAL.y;
      ctx.save(); ctx.translate(DIAL.x, DIAL.y + dy); ctx.scale(sc, sc); ctx.translate(-DIAL.x, -DIAL.y);
      if (t < K.tightB) drawDial(ctx, t, K, { hour: h, night });
      drawThread(ctx, t, K, clamp(.25 + night));
      ctx.restore();
      const st = tight(t); if (st > 0) { const born = eout(lin(K.tightB, K.tightB + .55, t)); glowAt(ctx, DIAL.x, DIAL.y + dy, 80 + 220 * st, clamp(st * 1.4) * (1 - born), '#ffcf8a'); glowAt(ctx, DIAL.x, DIAL.y + dy, 30 + 40 * st, clamp(st * 1.6) * (1 - born), '#fff1d6'); }
    }
    // the plates
    if (t >= K.tightB) { const pl = fly ? fly.pl : plates(t); drawPlates(ctx, t, pl, fly ? clamp((fly.k * PS * pl.p2.s - 1.6) / 2) : 0); }
    ctx.restore();
    // the pinhole's light: it grows from the hole until it is the whole frame (the light the next world is lit by)
    if (fly) {
      const sx = W / 2 + (fly.hp[0] - c.x) * c.k, sy = H / 2 + (fly.hp[1] - c.y) * c.k, r0 = HOLE.r * PS * fly.pl.p2.s * c.k;
      const b = eiq(lin(K.flyB - .55, K.flyB, t)), rc = r0 * (1 + 40 * b);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, rc * 3 + 30); g.addColorStop(0, rgba('#fff1d6', .9)); g.addColorStop(.33, rgba('#ffb35c', .35)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
      if (b > 0) { ctx.fillStyle = LIGHT; ctx.beginPath(); ctx.arc(sx, sy, rc * .9, 0, Math.PI * 2); ctx.fill(); }
    }
    // sources
  }
  const LIGHT = '#fff4e0';
  // ======================================================================== 12.07–12.09 the hill (H3): the street, the sweep, the frame, clip A
  // 12.07 out of the light: the camera starts at the bulb of the potter's lamp (it fills the frame, as the pinhole's light did) and pulls
  // back (log distance, a cubic that starts at 2.6 e-folds/s and lands at rest) through her room and out of the cut-away street to H3.
  K.h3 = K.workingE; K.swA = K.it + .17; K.swB = K.swA + .75; K.saA = K.swA + .45; K.saB = K.saA + .75;
  K.ruleOn = K.swA + .526 * .75;                                    // the esteem sweep passes the frame on the square: its rule lights
  K.hpA = K.toE; K.hpB = K.clipA + .7; K.outA = K.clipB - .66; K.offA = K.clipB - .4; K.last = K.end - 1 / 30;
  const H3V = { x: 1010, y: 450, z: 1.75 }, DIST0 = .36, DIST1 = FOC / H3V.z + LAMP0.d, DL = Math.log(DIST1 / DIST0);
  function pullView(t) {
    const T0 = K.flyB, T1 = K.h3, u = clamp((t - T0) / (T1 - T0)), m0 = 2.6 * (T1 - T0) / DL;
    const f = m0 * (u * u * u - 2 * u * u + u) + (3 * u * u - 2 * u * u * u), dist = DIST0 * Math.exp(DL * f), q = FOC / dist, q1 = FOC / DIST1;
    const Lf = [W / 2 + (LAMP0.x - H3V.x) * q1, H / 2 + (LAMP0.y - H3V.y) * q1], g = sm(Math.pow(f, 1.4));
    return view(LAMP0.x - (mix(W / 2, Lf[0], g) - W / 2) / q, LAMP0.y - (mix(H / 2, Lf[1], g) - H / 2) / q, dist - LAMP0.d);
  }
  const FC = [FR.x + FR.w / 2, FR.y + FR.h / 2], RC = [FR.x + FR.w / 2, RULE.y], ZC = 35.2, CLIPV = { x: FC[0], y: FR.y - (222 - H / 2) / ZC, z: ZC }, ZEND = 172;
  const holdCam = (t) => { const r = sm(lin(K.h3, K.h3 + 1.2, t)); return { x: H3V.x + 3 * drift(t, 1, 1) * r, y: H3V.y + 2 * drift(t, 1, 4) * r, z: H3V.z * (1 + .02 * sm(lin(K.h3, K.hpA, t))) }; };
  const clipCam = (t) => { const r = sm(lin(K.hpB, K.hpB + 1.5, t)); return { x: CLIPV.x + .09 * drift(t, 1, 2) * r, y: CLIPV.y + .05 * drift(t, 1, 5) * r, z: ZC * (1 + .006 * Math.sin((t - K.hpB) * .45) * r) }; };
  const toS = (c, p) => [(p[0] - c.x) * c.z + W / 2, (p[1] - c.y) * c.z + H / 2];
  const aimAt = (p, S, z) => ({ x: p[0] - (S[0] - W / 2) / z, y: p[1] - (S[1] - H / 2) / z, z });
  function hillCam(t) {
    if (t < K.hpA) return holdCam(t);
    if (t < K.hpB) {   // push to the frame: the frame's centre glides to its place while the zoom runs in log space
      const c0 = holdCam(K.hpA), e = sm(lin(K.hpA, K.hpB, t)), S0 = toS(c0, FC), S1 = toS(CLIPV, FC);
      return aimAt(FC, [mix(S0[0], S1[0], e), mix(S0[1], S1[1], e)], Math.exp(mix(Math.log(c0.z), Math.log(ZC), e)));
    }
    if (t < K.outA) return clipCam(t);
    // push onto the rule until it IS the line plate (y 600, full width) at H.a − 1/30, at rest
    const c0 = clipCam(K.outA), e = smoother(lin(K.outA, K.last, t)), S0 = toS(c0, RC);
    return aimAt(RC, [mix(S0[0], W / 2, e), mix(S0[1], 600, e)], Math.exp(mix(Math.log(c0.z), Math.log(ZEND), e)));
  }
  function hillState(t) {
    const st = { night: mix(.45, .78, sm(lin(K.hpA, K.hpB, t))), lit: [1, 1, 0, 0, 0], labels: 1, title: 0, focus: -1, people: .7 };
    const u2 = clamp((t - K.swA) / (K.swB - K.swA)), u3 = clamp((t - K.saA) / (K.saB - K.saA));
    if (t >= K.saB) st.lit = [1, 1, 1, 1, 0];
    else if (u3 > 0) return { st: { ...st, sweep: { level: 2, u: u2 } }, split: { y: 432, hill: { sweep: { level: 3, u: u3 } } } };
    else if (u2 > 0) st.sweep = { level: 2, u: u2 };
    return { st };
  }
  function hillTake(ctx, t) {
    let V, cam;
    if (t < K.h3) { V = pullView(t); cam = V.cam; } else { cam = hillCam(t); V = view(cam.x, cam.y, FOC / cam.z); }
    const S = hillState(t), out = V.D > DH;
    if (!(out && covers(cam))) { drawStreet(ctx, t, V, { hill: S.st, split: S.split }); if (out) housing(ctx, t, cam); }
    if (!out) return;
    // the picture grows out of the rule in a flash of the tube's light (on) and folds evenly back into it (off)
    const on = t >= K.clipA && t < K.clipB, uo = lin(K.offA, K.clipB - .02, t), pic = on ? eoq(lin(K.clipA, K.clipA + .3, t)) * (1 - sm(uo)) : 0;
    const flash = on ? (1 - lin(K.clipA, K.clipA + .35, t)) ** 2 : 0;
    const img = t < K.clipA + .07 ? IMG0 : t >= 371.41 ? IMG1 : null;
    screen(ctx, t, T, cam, { pic, flash, img, ruleA: t >= K.ruleOn ? 1 : 0, ruleGrow: eout(lin(K.ruleOn, K.ruleOn + .3, t)), wob: smoother(lin(K.outA, K.last, t)) });
    spill(ctx, cam, pic * (1 - sm(lin(K.outA, K.offA, t))));
    lowerThird(ctx, t, clamp((t - K.hpB) / .6) * (1 - clamp((t - (K.outA - .35)) / .3)));
  }
  const IMG0 = await loadImage(ROOT + 'clips/A/f00003.jpg'), IMG1 = await loadImage(ROOT + 'clips/A/f00641.jpg');

  const take = (ctx, t) => { if (t < K.many) mapTake(ctx, t); else if (t < K.flyB) roadTake(ctx, t); else hillTake(ctx, t); };

  prewarmRoad(); prewarmPlates();
  await ready();
  const P = { riso: .25 };
  return [
    { t: HI.b, tr: 'cut', d: .1, print: HI.print, draw: take, sound: [{ f: 'foil_glint', t: K.received - .2, v: .16 }] },
    { t: K.many, tr: 'cut', d: .1, print: P, draw: take, sound: [{ f: 'tape_measure', t: K.start - .05, v: .16 }, { f: 'tone', t: K.close + .3, v: .12 }] },
    { t: K.people, tr: 'cut', d: .1, print: P, draw: take, sound: [{ f: 'shimmer_rings', t: K.tightA, v: .14 }, { f: 'card', t: K.alikeE + .02, v: .18 }, { f: 'whoosh_airy', t: K.flyA - .05, v: .14 }] },
    { t: K.flyB, tr: 'cut', d: .1, print: P, draw: take, sound: [{ f: 'bloom', t: K.flyB - .2, v: .18 }, { f: 'screen_off', t: K.clipB - .04, v: .16 }] },
  ];
};
