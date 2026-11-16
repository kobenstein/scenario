// Film 8 · chunk c09 · 08a from "India went further" (shots 8.07–8.17, 444.19–484.23 s). Builder: B3.
// Worlds: lib/f8_c09_world.mjs (A, helpers), lib/f8_c09_ink.mjs (B prints + report, C ink world), lib/f8_c09_plate.mjs (D plate, deed).
// ONE continuous take: c08's roof line IS the plate line, which becomes India's skyline; India is a print on a table (pull back); the
// report's printed figure is the ink world (fly in); the ink sheet is pulled back into the anatomy plate; a thread of the memory leads to a
// deed and the camera flies into its paper (= the c09>c10 paper plate). No blends anywhere: every change is a camera move or an object.
//
// | shot  | VO (accent)                              | image                                                                   | hero light        | camera                                   | flow on                         | sound            |
// |-------|------------------------------------------|-------------------------------------------------------------------------|-------------------|------------------------------------------|---------------------------------|------------------|
// | 8.07  | India went **further**                   | the plate's gold line rises into an engraved Indian skyline at dawn,    | the low sun       | pull back to the wide city               | take                            | whoosh_up        |
// |       |                                          | label INDIA                                                             |                   |                                          |                                 |                  |
// | 8.08  | about a **dollar** per chip              | crane down to a row of small workshops; a crate of fireflies is lowered | crates (green)    | crane down, push to the hero crate's tag | take                            | drop ×3, tick    |
// |       |                                          | in front of each, windows light; the tag is stamped ≈ $1 PER CHIP·HOUR |                   |                                          |                                 | (stamp)          |
// | 8.09  | Nobody has **measured** it yet           | dotted ghost conductors before the workshops; an empty measuring tape;  | the tape's glint  | pull back a little                       | pull back (a): India is a print | chime            |
// |       |                                          | a glint runs along it and finds nothing                                 |                   |                                          |                                 |                  |
// | 8.10  | any country, any city, any **school**    | the India print lies on a dark table next to a map, a city, a school;   | the crates        | pull back, drift right along the prints  | the report slides in (a)        | whoosh ×3        |
// |       |                                          | a crate flies from India to each print (lands on each word)             |                   |                                          |                                 |                  |
// | 8.11  | adds one **warning**                     | the World Bank report opens; a red margin mark draws itself beside a    | paper             | settle on the page, push to the figure   | fly into the printed figure (b) | pages, pencil    |
// |       |                                          | printed figure (one lantern, many workshops)                            |                   |                                          |                                 |                  |
// | 8.12  | a **single provider**                    | the figure IS the ink world: every workshop hangs on threads from one   | the lantern       | arrive, hold                             | take                            |                  |
// |       |                                          | big lantern; on single provider it flickers and all windows follow      |                   |                                          |                                 |                  |
// | 8.13  | didn't **lift** the ones who struggled   | camera down the same sheet to a market street in Kenya; the red falling | –                 | tilt down onto the street                | take                            |                  |
// |       |                                          | line hovers over one stall and sinks a bit more                         |                   |                                          |                                 |                  |
// | 8.14  | the mentor comes **first**, tools second | the older mentor walks in and stops beside her (FIRST), the fireflies   | fireflies         | hold, slight drift                       | pull back (b rev) into the plate| wings            |
// |       |                                          | follow and arrive on second (SECOND)                                    |                   |                                          |                                 |                  |
// | 8.15  | only **half** of it                      | the ink sheet becomes an inset of the anatomy plate; HANDS; the left    | fireflies         | hold                                     | take                            | pages            |
// |       |                                          | half (the memory) sinks into shadow on half                             |                   |                                          |                                 |                  |
// | 8.16  | **just as much**                         | the weave lights, MEMORY; both halves equally bright                    | weave gold        | push into the weave                      | take                            | foil_glint       |
// | 8.17  | **Whose** is it?                         | the weave close; a firefly searches and stops on Whose; a thread runs   | the deed (paper)  | follow the thread right, fly into the    | c09>c10 paper plate at H.a      | whoosh_airy      |
// |       |                                          | right to a deed with a wax seal, the deed rises out of the dark         |                   | deed's paper                             |                                 |                  |
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, prng } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { ready, F8, firefly, swarm, workshop, qio, eoutX, einX } from '../lib/f8_kit.mjs';
import { chartReady, inkText, reportCover, paperGround, INK } from '../lib/f8_chart.mjs';
import { b3Ready, camKeys, worldIndia, crate, priceTag, ghostFig, glow, sine } from '../lib/f8_c09_world.mjs';
import { inkReady, PR, table, cWorld, CW, CH } from '../lib/f8_c09_ink.mjs';
import { plateD, deed, DEED, PLATE_D } from '../lib/f8_c09_plate.mjs';

export default async (T, R) => {
  await ready(); await chartReady(); await inkReady();
  const { in: HI, out: HO } = handsOf('c09', T);
  const S = (p, n) => T.S('08a', p, n);
  const A = {
    india: S('India went'), further: S('further'), its: S('Its public'), offers: S('offers'), small: S('small firms'), less: S('about a'), dollar: S('dollar'), hour: S('hour'),
    does: S('Does that'), conductors: S('conductors'), nobody: S('Nobody has'), measured: S('measured'), yet: S('it yet'),
    but: S('But any'), country: S('country'), city: S('city'), school: S('school'), same: S('the same'),
    wb: S('The World Bank adds'), warning: S('warning'), dont: S("Don't let"), single: S('single provider'), provider: S('provider'),
    kenya0: S('And remember'), kenya: S('Kenya'), didnt: S("didn't lift"), struggling: S('struggling'),
    thats: S("That's why"), mentor: S('mentor'), first: S('first'), tools: S('tools second'), second: S('second'),
    because: S('Because the'), hands: S('hands are'), half: S('half'), memory0: S('The memory'), memory: S('memory matters'), just: S('just as'),
    whose: S('Whose'), end: T.E('08a'),
  };
  const TB = HI.b, TE = HO.a, HA1 = HO.a - 1 / 30;

  // ================================================================ WORLD A · India at dawn (8.07–8.09)
  const camA = camKeys([
    [TB, 960, 540, 1], [A.india + .5, 962, 548, 1.12], [A.its + .45, 985, 640, 2.3], [A.offers + 1.6, 1000, 950, .66],
    [A.less - .15, 978, 1100, .24], [A.hour + .3, 976, 1102, .235], [A.conductors - .1, 1000, 985, .58], [A.measured + .4, 1004, 990, .6],
  ]);
  const dawn = (t) => sine(lin(TB + .15, A.its + 1.2, t));
  const WS = [{ x: 120, land: A.small + .3, seed: 3 }, { x: 560, land: A.offers + .05, seed: 5 }, { x: 1000, land: A.offers + .45, seed: 7, hero: true }, { x: 1440, land: A.offers + .85, seed: 9 }, { x: 1880, land: A.small + .6, seed: 11 }];
  const WSY = 1120, WSS = .75, CRY = 1166, TAPE = 1222;
  function rowAfter(ctx, t, c, P) {
    const k = P.s;
    for (const w of WS) {
      const x = P.RX(w.x), y = P.RY(WSY); if (x < -300 || x > W + 300) continue;
      const lit = eoutX((t - w.land - .1) / .45);
      workshop(ctx, t, x, y, WSS * k, { lit, figure: false, wall: '#2b2440', seed: w.seed, fireflies: 0, glowA: .8 });
    }
    // the crates, lowered on a gold thread from above, one per workshop; fireflies rise out of them
    for (const w of WS) {
      const u = clamp((t - w.land + .9) / .9), e = eio(u); if (u <= 0) continue;
      const cx = P.RX(w.x - 34), gy = P.RY(CRY), y = gy - (1 - e) * 760 * k, s = .9 * k; if (cx < -200 || cx > W + 200) continue;
      const top = y - 40 * s, up = clamp((t - w.land - .05) / .7);
      if (up < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const y1 = mix(top, -40, eio(up)); ctx.strokeStyle = rgba(F8.gold, .55); ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(cx, y1); ctx.lineTo(cx, -60); ctx.stroke(); ctx.restore(); }
      crate(ctx, t, cx, y, s, { seed: w.seed, lid: .25 * eoutX((t - w.land - .2) / .5) });
      if (t > w.land) { const ff = clamp((t - w.land) / .8); swarm(ctx, t, { n: 4, mode: 'orbit', cx, cy: top - 18 * s * ff - 4 * s, rx: 34 * s * ff + 4, ry: 10 * s * ff + 2, seed: w.seed + 3, s: .42 * Math.min(k, 3), trail: .25 }); }
      if (w.hero) priceTag(ctx, t, cx - 14 * s, top + 2 * s, s * 1.0, { stamp: A.less + .02 });
    }
    // the dotted ghosts of conductors that may or may not come (8.09)
    for (const [i, w] of WS.entries()) {
      const x = P.RX(w.x + 72), y = P.RY(WSY + 80); if (x < -100 || x > W + 100) continue;
      ghostFig(ctx, x, y, 150 * k, { rev: eoutX((t - A.does - .05 - i * .08) / .6), t, seed: i, pose: i % 2 ? 'stand' : 'handHalf', a: 1 });
    }
    // the measuring tape in front: unrolled on "Nobody", nothing on it to read; on "measured" a glint runs along it and finds nothing
    { const u = eio(clamp((t - A.nobody + .15) / .7)); if (u > 0) {
      const y = P.RY(TAPE), x0 = P.RX(700), x1 = mix(x0, P.RX(1290), u), h = 9 * k;
      ctx.save(); ctx.fillStyle = '#d8c48a'; ctx.fillRect(x0, y - h / 2, x1 - x0, h); ctx.strokeStyle = 'rgba(60,40,20,.8)'; ctx.lineWidth = Math.max(.8, .5 * k); ctx.strokeRect(x0, y - h / 2, x1 - x0, h);
      ctx.beginPath(); for (let q = x0 + 4 * k, i = 0; q < x1; q += 6 * k, i++) { const L = i % 5 === 0 ? h * .55 : h * .28; ctx.moveTo(q, y - h / 2); ctx.lineTo(q, y - h / 2 + L); } ctx.stroke();
      ctx.fillStyle = '#4a3a2a'; ctx.beginPath(); ctx.arc(x0 - 8 * k, y, 14 * k, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = 'rgba(255,220,170,.35)'; ctx.beginPath(); ctx.arc(x0 - 8 * k, y, 9 * k, 0, Math.PI * 2); ctx.stroke();
      const g = clamp((t - A.measured - .05) / .9); if (g > 0 && g < 1) glow(ctx, mix(x0, x1, eio(g)), y, 40 * k, '#fff1d6', .5 * Math.sin(Math.PI * g));
      ctx.restore(); } }
  }
  const SA = { dawn, after: rowAfter };
  const drawIndia = (ctx, t) => worldIndia(ctx, t, camA(t), SA);
  function labelsA(ctx, t) {
    const u = eoutX((t - A.india - .1) / .5) * (1 - einX((t - A.its - 1.2) / .4));
    if (u > 0) inkText(ctx, 'INDIA', 120, 150, { size: 30, font: 'caps', u, color: '#f6e7c9' });
    const su = eoutX((t - A.less - .4) / .5) * (1 - einX((t - A.does + .1) / .35));
    if (su > 0) inkText(ctx, 'INDIAAI MISSION', 120, 880, { size: 18, font: 'caps', u: su, color: rgba('#f3e3bf', .85) });
  }

  // ================================================================ WORLD B · prints on the table, the report (8.10–8.11)
  // the report at rest (B units), its printed figure F (page units) and the ink sheet below it; C → B is a fixed scale + offset
  const RW = 1500, RH = 1934, RX = 7650, RY = -427, F = { x: 240, y: 386.8, w: 1050 }, f = F.w / CW;
  const CB = (cx, cy) => [RX + F.x + cx * f, RY + F.y + cy * f];
  const SH = { x: RX + F.x, y: RY + F.y, w: F.w, h: CH * f };          // the ink sheet in B units
  const INSET = { x: 1440, y: 410, w: 420 };                          // where the sheet ends up in the plate (screen = plate units)
  const dIn = SH.w / INSET.w, inset = [SH.x + (W / 2 - INSET.x) * dIn, SH.y + (H / 2 - INSET.y) * dIn, dIn];
  const K = (t, c, k) => [t, ...c, f / k];
  const camB = camKeys([
    [A.nobody - .3, 960, 540, 1], [A.but + .62, 2160, 590, 1 / .45], [A.city + .4, 3900, 585, 1 / .28], [A.school + .5, 5200, 575, 1 / .22],
    [A.same + .2, 7000, 560, 1 / .27], [A.wb + .1, 8400, 560, 1 / .42], [A.wb + .95, 8412, 590, 1 / .47], [A.warning + .2, ...CB(960, 540), 1 / .62],
    K(A.dont + 1.1, CB(960, 540), 1), K(A.single + .55, CB(962, 556), 1.03), K(A.kenya + .95, CB(1140, 1738), 1.4), K(A.struggling + .2, CB(1150, 1740), 1.42),
    K(A.first + .35, CB(1172, 1736), 1.45), [A.half + .5, ...inset, 'z'],
  ]);
  const camAt = (t) => { const c = camB(t); return { x: c.x, y: c.y, k: 1 / c.d }; };
  const Bm = (c) => [c.k, 0, 0, c.k, W / 2 - c.x * c.k, H / 2 - c.y * c.k];   // B → screen as a setTransform matrix
  const crates = [[A.country, 1], [A.city, 2], [A.school, 3]].map(([tw, i], j) => ({ t0: tw - .85, t1: tw + .05, from: [1020 + j * 40, 900], to: [PR[i].x + 960 + (j - 1) * 160, PR[i].y + [700, 960, 930][j]] }));
  const rep = (t) => { const u = clamp((t - (A.same - .6)) / 1.6), e = 1 - Math.pow(1 - u, 2); return { x: RX + 4000 * (1 - e), rot: .07 * (1 - e) }; };
  const C = cWorld({ single: A.single, provider: A.provider, didnt: A.didnt, first: A.first, second: A.second, mentorIn: A.thats - .75, mentorAt: A.first });
  const pageLight = [RW * .8, -RH * .1];

  function drawB(ctx, t, cam) {
    ctx.save(); ctx.setTransform(...Bm(cam));
    table(ctx, t, { drawP0: (g) => drawIndia(g, t), cap: [0, 1, 2].map((i) => eoutX((t - [A.country, A.city, A.school][i] + .05) / .5)), crates });
    const r = rep(t);
    reportCover(ctx, t, { x: r.x, y: RY, w: RW, h: RH, rot: r.rot, open: clamp((t - A.wb) / .9), mark: clamp((t - A.warning + .2) / .65), page: (g, tt) => figureOnPage(g, tt) });
    ctx.restore();
    const su = eoutX((t - A.wb - .2) / .6) * (1 - einX((t - A.dont + .3) / .35));
    if (su > 0) inkText(ctx, 'WORLD BANK · WORLD DEVELOPMENT REPORT 2026', 120, 880, { size: 16, font: 'caps', u: su, color: rgba('#efe4c6', .85) });
  }
  // the printed figure on the report page: a clean paper field, a thin plate rule, the ink world clipped to the figure, a caption
  function figureOnPage(g, t) {
    g.save(); g.beginPath(); g.rect(F.x - 30, F.y - 30, F.w + 60, F.w * 9 / 16 + 110); g.clip(); paperGround(g, 0, 0, RW, RH, { tone: '#f1eadb', light: pageLight }); g.restore();
    g.save(); g.translate(F.x, F.y); g.scale(f, f); C(g, t, { clipTop: true, lw: 1 }); g.restore();
    g.strokeStyle = rgba(INK.ink, .7); g.lineWidth = 2; g.strokeRect(F.x, F.y, F.w, F.w * 9 / 16);
    g.strokeStyle = rgba(INK.ink, .3); g.lineWidth = 2.2; g.beginPath(); g.moveTo(F.x, F.y + F.w * 9 / 16 + 40); g.lineTo(F.x + F.w * .7, F.y + F.w * 9 / 16 + 40); g.moveTo(F.x, F.y + F.w * 9 / 16 + 64); g.lineTo(F.x + F.w * .45, F.y + F.w * 9 / 16 + 64); g.stroke();
  }
  // inside the figure (it covers the frame): the page paper and the ink world, unclipped (the sheet continues below the figure)
  function drawInside(ctx, t, cam) {
    ctx.save(); ctx.setTransform(...Bm(cam)); ctx.translate(RX, RY);
    paperGround(ctx, 0, 0, RW, RH, { tone: '#f1eadb', light: pageLight });
    ctx.translate(F.x, F.y); ctx.scale(f, f); C(ctx, t, { lower: true, lw: 1 }); ctx.restore();
  }
  // the ink sheet on its own (8.14 pull-back into the plate): the same paper in page coordinates, a deckle edge, a shadow
  function drawSheet(ctx, t, M) {
    ctx.save(); ctx.setTransform(...M); ctx.translate(RX, RY);
    const x0 = F.x, y0 = F.y, w = F.w, h = CH * f;
    ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(x0 + 10, y0 + 16, w, h);
    ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, h); ctx.clip(); paperGround(ctx, 0, 0, RW, RH, { tone: '#f1eadb', light: pageLight });
    ctx.translate(F.x, F.y); ctx.scale(f, f); C(ctx, t, { lower: true, lw: 1 }); ctx.restore();
    ctx.strokeStyle = 'rgba(90,70,50,.5)'; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, w, h);
    ctx.restore();
  }
  function labelsC(ctx, t) {
    const ku = eoutX((t - A.kenya - .1) / .5) * (1 - einX((t - A.thats + .2) / .35));
    if (ku > 0) inkText(ctx, 'KENYA', 120, 150, { size: 30, font: 'caps', u: ku, color: INK.ink });
    const fo = 1 - einX((t - A.second - .5) / .35);
    const u1 = eoutX((t - A.first + .05) / .45) * fo, u2 = eoutX((t - A.second + .05) / .45) * fo;
    if (u1 > 0) inkText(ctx, 'FIRST', 120, 880, { size: 22, font: 'caps', u: u1, color: INK.ink });
    if (u2 > 0) inkText(ctx, '·  SECOND', 248, 880, { size: 22, font: 'caps', u: u2, color: rgba(INK.ink, .8) });
  }

  // ================================================================ WORLD D · the anatomy plate, the weave, the deed (8.15–8.17)
  const RP = { x: 880, y: 548, w: 190 };  RP.h = RP.w * 9 / 16;   // the deed's paper in plate units (16:9, it becomes the frame)
  const ds = RP.w / W;
  const TD = A.whose - .12;                                                // the dive into the deed starts (≥ 2 s before H.a)
  const camD0 = camKeys([[A.memory0, 960, 540, 1], [TD, 848, 632, 1 / 3.4]]);
  const camD1 = camKeys([[TD, 848, 632, 1 / 3.4], [HA1, RP.x + RP.w / 2, RP.y + RP.h / 2, ds, 'z']]);
  const camD = (t) => (t < TD ? camD0(t) : camD1(t));
  const NODE = [826, 672], SEAL = [RP.x + DEED.seal.x * ds, RP.y + DEED.seal.y * ds];
  const thr = (q) => { const c1 = [NODE[0] + 40, NODE[1] - 30], c2 = [SEAL[0] - 60, SEAL[1] + 40]; const u = 1 - q; return [u ** 3 * NODE[0] + 3 * u * u * q * c1[0] + 3 * u * q * q * c2[0] + q ** 3 * SEAL[0], u ** 3 * NODE[1] + 3 * u * u * q * c1[1] + 3 * u * q * q * c2[1] + q ** 3 * SEAL[1]]; };
  const T0 = A.whose + .05, T1 = A.whose + .75;                          // the thread grows from the node to the seal
  const ffPos = (t) => {                                                 // the searching firefly: wanders, stops on "Whose", follows the thread
    if (t < A.whose) { const q = clamp((t - (A.memory + .9)) / (A.whose - A.memory - .9)), sp = 1 - .85 * q; const a = t * 2.1; return [mix(640, 790, eio(q)) + 46 * Math.sin(a * 1.3) * sp, mix(640, 662, eio(q)) + 22 * Math.cos(a * 1.9) * sp]; }
    if (t < T0 + .05) return [790, 662];
    const q = eio(clamp((t - T0 - .05) / (T1 + .35 - T0 - .05))); const p = thr(q); return [mix(790, p[0], clamp(q * 4)), p[1] - 4];
  };
  function drawD(ctx, t, sheetM) {
    const cd = camD(t), lab = (t0) => eoutX((t - t0) / .45);
    const memGlow = mix(-.85, 0, sm(lin(A.memory0, A.memory + .3, t))) + .6 * Math.exp(-Math.pow((t - A.memory - .45) / .45, 2)) + .15 * sm(lin(A.just, A.just + .5, t)) - .6 * sm(lin(A.whose + .1, A.whose + 1.1, t));
    const veil = sm(lin(A.half - .65, A.half + .05, t)) * (1 - sm(lin(A.memory0 - .05, A.memory + .5, t)));
    const deedU = clamp((t - (A.whose + .05)) / 1.25), fo = 1 - eio(lin(A.just + .25, A.just + .85, t));
    plateD(ctx, t, cd, {
      veil, memGlow, will: 0, seed: 1,
      leaders: { hands: lin(A.because, A.hands + .3, t) * fo, memory: lin(A.memory0 - .05, A.memory + .35, t) * fo },
      labels: { hands: lab(A.hands - .05) * fo, memory: lab(A.memory - .05) * fo },
      after: (g, P) => {
        // the ink sheet as an inset of the plate (it came from there)
        if (sheetM) { const M = sheetM; const k = P.k; drawSheet(g, t, [M[0] * k, 0, 0, M[3] * k, W / 2 + (M[4] - cd.x) * k, H / 2 + (M[5] - cd.y) * k]); }
        // 8.17: the thread (behind the deed), the deed rising out of the dark, the searching firefly
        if (t > T0) {
          const u = clamp((t - T0) / (T1 - T0)), e = eout(u), pts = []; for (let i = 0; i <= 40; i++) pts.push(thr(e * i / 40));
          g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; g.strokeStyle = rgba(F8.gold, .35); g.lineWidth = Math.max(2, 1.1 * P.k); g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(P.X(x), P.Y(y)) : g.moveTo(P.X(x), P.Y(y)))); g.stroke();
          g.strokeStyle = rgba(F8.goldCore, .95); g.lineWidth = Math.max(1, .32 * P.k); g.stroke(); const [hx, hy] = pts[pts.length - 1]; if (u < 1) glow(g, P.X(hx), P.Y(hy), 7 * P.k, F8.gold, .9, F8.goldCore); g.restore();
        }
        if (deedU > 0) { g.save(); g.setTransform(P.k * ds, 0, 0, P.k * ds, P.X(RP.x), P.Y(RP.y)); deed(g, t, { rise: deedU, seal: 0, thread: [[W, H * .57], [W + 240, H * .6]], glint: clamp((t - (T1 + .25)) / .9) }); g.restore(); }
        if (t > A.memory + .9) { const [x, y] = ffPos(t), tr = []; for (let q = 8; q >= 0; q--) { const p = ffPos(t - q * .03); tr.push([P.X(p[0]), P.Y(p[1])]); } firefly(g, t, { x: P.X(x), y: P.Y(y), trail: tr.slice(4), s: clamp(.32 * P.k, .6, 7), seed: 41, a: eoutX((t - A.memory - .9) / .4) }); }
      },
    });
  }

  // ================================================================ the take
  const SW_D = A.first + .4;                                           // into the plate (the sheet still covers the frame)
  // inside the printed figure from the first moment it covers the frame (scanned once, so every frame decides the same way)
  const covers = (t) => { const cam = camAt(t), fx0 = W / 2 + (SH.x - cam.x) * cam.k, fy0 = H / 2 + (SH.y - cam.y) * cam.k; return fx0 <= .5 && fy0 <= .5 && fx0 + SH.w * cam.k >= W - .5 && fy0 + SH.w * 9 / 16 * cam.k >= H - .5; };
  let T_IN = A.dont + 1.1; for (let tt = A.warning; tt < A.dont + 1.2; tt += 1 / 480) if (covers(tt)) { T_IN = tt; break; }
  function draw(ctx, t) {
    if (t < A.nobody - .3) { drawIndia(ctx, t); labelsA(ctx, t); return; }
    const cam = camAt(t);
    if (t >= SW_D) { drawD(ctx, t, Bm(cam)); labelsC(ctx, t); return; }
    if (t >= T_IN) { drawInside(ctx, t, cam); labelsC(ctx, t); return; }
    drawB(ctx, t, cam);
  }
  await b3Ready();
  const PRINT = HI.print;   // riso .25 on both plates of this chunk: the finish never changes
  return [
    { t: TB, tr: 'cut', d: .1, print: PRINT, draw, sound: [{ f: 'whoosh_up', t: A.further - .2, v: .35 }] },
    { t: A.its, tr: 'cut', d: .1, print: PRINT, draw, sound: [{ f: 'drop', t: A.offers + .45, v: .3 }, { f: 'tick', t: A.less + .02, v: .4 }] },
    { t: A.does, tr: 'cut', d: .1, print: PRINT, draw, sound: [{ f: 'chime', t: A.measured + .1, v: .25 }] },
    { t: A.but, tr: 'cut', d: .1, print: PRINT, draw, sound: [{ f: 'whoosh', t: A.country - .5, v: .2 }, { f: 'whoosh', t: A.school - .5, v: .2 }] },
    { t: A.wb, tr: 'cut', d: .1, print: PRINT, draw, sound: [{ f: 'pages', t: A.wb + .1, v: .45 }, { f: 'pencil', t: A.warning - .15, v: .35 }] },
    { t: A.dont, tr: 'cut', d: .1, print: PRINT, draw },
    { t: A.kenya0, tr: 'cut', d: .1, print: PRINT, draw, sound: [{ f: 'wings', t: A.second - .4, v: .3 }] },
    { t: A.because, tr: 'cut', d: .1, print: PRINT, draw, sound: [{ f: 'foil_glint', t: A.memory + .1, v: .35 }, { f: 'whoosh_airy', t: A.whose + .5, v: .4 }] },
  ];
};
