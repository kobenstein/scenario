// c11 · All of us: right to disconnect, Keynes, who decides (s18 + s19) · 448.88–495.96 · Editorial-Nacht, pre-dawn · builder B3
// Plan: docs/shots.md c11, adapted to Jakob's direction of 28.10. (no camera journeys through one world; separate clean graphics,
// joined by a carrier shape): the evening table is a SCENE; the map and the Keynes/balance graphic are separate clean images;
// the tablecloth itself is the carrier (it morphs into France, back, then into the work-week block that becomes the scale).
//
// | ID     | time          | anchor                         | picture (one idea)                                                     | 1–2 moves               | → carrier                                   |
// |--------|---------------|--------------------------------|------------------------------------------------------------------------|-------------------------|---------------------------------------------|
// | seam   | 448.88–449.38 | France                         | plateSheet (lib/f13_seams): the sheet of light, close                  | –                       | the sheet IS the tablecloth                 |
// | 11.01  | 449.38–454.64 | After hours · don't · answer   | rise: the evening table from above under the lamp, people + you; a      | rise · phone            | push: the cloth fills the frame and morphs  |
// |        |               |                                | phone lights cool with a work message, then turns face down by itself  |                         | into France (l'Hexagone)                    |
// | 11.02  | 454.64–460.60 | Belgium · Australia · Spain …  | EXPL map of light: France (2017), Belgium, Australia (thread to an      | countries light         | France morphs back into the cloth, pull     |
// |        |               |                                | inset), Spain, Portugal, Ireland                                        |                         | back to the table on "shift"                |
// | 11.03★ | 460.60–468.18 | shift · favor · yours          | the evening goes on: a child climbs onto a lap, someone pours (gold),  | child · pour            | push: the cloth morphs into the work-week   |
// |        |               |                                | the lamp warms on "simply yours"                                        |                         | block of the Keynes graphic                 |
// | 11.04  | 468.18–476.58 | Keynes · fifteen · riches      | EXPL the work week stays high (block), the forecast falls to 15 (dotted)| forecast · income       | baseline → beam, block → sand, curve → coin |
// |        |               |                                | income climbs (cool) to a coin                                          |                         |                                             |
// | 11.05  | 476.58–484.34 | money · more time              | EXPL scale of light: coins (cool) vs sand (warm); hangs to money, then  | scale swings            | plan sequence                               |
// |        |               |                                | swings level on "more time?"                                            |                         |                                             |
// | 11.06  | 484.34–495.96 | companies · governments · all  | three signs of light pour sand on the time side: it sinks to time      | signs · scale           | a coin rises from the money pan, the camera |
// |        |               |                                |                                                                         |                         | follows it up: carried into c12 (COIN12)    |
import * as E from '../lib/f10_editorial.mjs';
import * as K from '../lib/f13_kit.mjs';
import * as B from '../lib/f13_b3_kit.mjs';
import { plateSheet, seamWindow, SEAM_HALF } from '../lib/f13_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, drift, cam3, camAt, camDrift, F0, halo } = E;
const rise = (x) => 1 - (1 - clamp(x)) ** 3;

export const SY12 = 1000;   // the tilt at the c11|c12 boundary (bgNight scroll), shared with sc12
export default async (T, R) => {
  E.prepareEditorial();
  const A = (w, n) => T.S('s18', w, n), Z = (w, n) => T.S('s19', w, n);
  const a = {
    T0: T.seg('s18').start, after: A('After hours'), dont: A("don't have"), answer: A('answer'), bel: A('Belgium'), aus: A('Australia'), spain: A('Spain'),
    port: A('Portugal'), ire: A('Ireland'), own: A('own'), thats: A("That's the"), shift: A('shift'), your: A('Your evening'), favor: A('favor'), yours: A('yours'),
    keynes: Z('Keynes'), fifteen: Z('fifteen'), riches: Z('riches'), mostly: Z('Mostly'), money: Z('money'), time: Z('time', 0), more1: Z('more money'), more2: Z('more time'),
    decides: Z('decides'), comp: Z('companies'), gov: Z('governments'), every: Z('everyone'), work: Z('work', 1), end: R.b,
  };
  return [{ t: R.a, draw: chunk(a), print: K.PRINT13 }];
};

// ------------------------------------------------------------------ the table (top view, card at F0; home camera = the plate)
const CL = B.CLOTH, CC = [(CL.x0 + CL.x1) / 2, (CL.y0 + CL.y1) / 2];
const S = 330;                                           // shoulder width
const TOP = [650, 1250, 1900].map((x) => [x, CL.y0 - 110]), BOT = [[1050, CL.y1 + 110], [1650, CL.y1 + 110], [2200, CL.y1 + 110]];
const LAMP = [1000, 280];
const PHONE = [1290, 1196];
const CTAB = E.aim(F0, CC[0], CC[1] + 260, .42),   // (the people at the near side stay above the subtitle band)
      CFILL = E.aim(F0, CC[0], CC[1], 1920 / (CL.x1 - CL.x0) * 1.005);
const GLASS_T = [1420, CL.y0 + 135], BOTTLE0 = [1300, CL.y0 + 70];

// the cloth, dimmed away from the lamp when the camera stands back (lifts again when it pushes in, so the plate and the graphics keep its full light)
function clothD(ctx, t, dim) {
  B.cloth(ctx, t);
  if (dim <= 0) return;
  ctx.fillStyle = E.rad(ctx, LAMP[0], LAMP[1] + 60, 2300, [[0, rgba(P.night1, .16 * dim)], [.14, rgba(P.night1, .32 * dim)], [.42, rgba(P.night1, .68 * dim)], [1, rgba(P.night1, .88 * dim)]]);
  ctx.fillRect(CL.x0 - 40, CL.y0, CL.x1 - CL.x0 + 80, CL.y1 - CL.y0);
}
function table(ctx, c, t, s) {
  E.card(ctx, c, F0, () => {
    clothD(ctx, t, s.dim);
    // dishes and glasses at the places (outside the home frame: they were always there, the plate only showed the middle)
    for (const [x] of TOP) { B.dish(ctx, x, CL.y0 + 110, 92, { food: P.shade0 }); }
    for (const [x] of BOT) B.dish(ctx, x, CL.y1 - 110, 92, { food: P.shade0 });
    B.glass(ctx, GLASS_T[0], GLASS_T[1], 36, s.pour2);
    B.glass(ctx, 650 + 150, CL.y0 + 140, 36, .7); B.glass(ctx, 1900 - 150, CL.y0 + 140, 36, .6);
    B.glass(ctx, 1050 + 170, CL.y1 - 70, 36, .65); B.glass(ctx, 2200 - 160, CL.y1 - 140, 36, .5);
    B.phoneTop(ctx, PHONE[0], PHONE[1], 58, -.08, t, { light: s.phone, flip: s.flip, buzz: s.buzz });
    // the people (top side faces down, bottom side faces up); the child climbs onto the lap of the second person at the bottom
    TOP.forEach(([x, y], i) => B.topPerson(ctx, x, y + (i === 1 ? -s.pourLean : 0), Math.PI / 2, S, { lamp: LAMP, armR: i === 1 ? s.pourArm : undefined }));
    B.topPerson(ctx, BOT[1][0], BOT[1][1], -Math.PI / 2, S, { lamp: LAMP, armL: [-.12 * s.hug, -.25 * s.hug], armR: [.12 * s.hug, -.25 * s.hug] });
    B.topPerson(ctx, BOT[2][0], BOT[2][1], -Math.PI / 2, S, { lamp: LAMP });
    B.topPerson(ctx, s.child[0], s.child[1], -Math.PI / 2 + s.child[2], S * .58, { lamp: LAMP, arms: .3 });
    B.topDu(ctx, BOT[0][0], BOT[0][1] + s.duBack, -Math.PI / 2, S, { lamp: LAMP, arms: 1 - .35 * s.duRelax });
    // the bottle in the hand of the person opposite: lifted and tilted on "favor", a thin gold thread into the glass
    B.bottle(ctx, lerp(BOTTLE0[0], GLASS_T[0] - 120, s.pour1), lerp(BOTTLE0[1], GLASS_T[1] - 60, s.pour1), 200, lerp(-.2, .55, s.pour1), s.pourStream, GLASS_T);
    // the lamp's light also falls on the people round the table (warm, additive, very soft); "simply yours" warms it a touch
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = E.rad(ctx, LAMP[0] + 200, LAMP[1] + 260, 1900 * (.3 + .7 * s.amt), [[0, rgba(P.halo1, (.1 + .06 * s.warm) * s.amt)], [.5, rgba(P.halo1, (.04 + .03 * s.warm) * s.amt)], [1, rgba(P.halo1, 0)]]);
    ctx.fillRect(-1200, -1400, 5200, 4200); ctx.restore();
  });
}

// ------------------------------------------------------------------ the map (screen coordinates, a clean graphic)
const PX = 760, PY = 450, PROJ = B.mapProj(PX, PY, 40), AUS = B.ausProj(1500, 690, 6.4);   // (Spain ends above the subtitle band)
const FR = B.resample(B.MAP.france.map(PROJ), 260), RECT_N = 260;
const pathOf = (k, proj = PROJ) => B.polyPath(k, B.MAP[k], proj);
const LIT = [   // name, polygon key, light source (lon/lat) the light spreads from, anchor key, label pos (screen), align
  ['BELGIUM', 'belgium', [3.4, 50.5], 'bel', PROJ([4.5, 52.25]), 'center'],
  ['SPAIN', 'spain', [.5, 42.7], 'spain', PROJ([1.2, 39.6]), 'left'],
  ['PORTUGAL', 'portugal', [-7, 40], 'port', PROJ([-10.1, 38.2]), 'right'],
  ['IRELAND', 'ireland', [-7.8, 52.6], 'ire', PROJ([-11.2, 53.1]), 'right'],
];
const AUS_ARC = (() => { const p0 = PROJ([6.6, 45.6]), p2 = AUS([116, -31]), p1 = [(p0[0] + p2[0]) / 2 + 60, Math.min(p0[1], p2[1]) - 240]; const out = []; for (let i = 0; i <= 40; i++) { const u = i / 40; out.push([lerp(lerp(p0[0], p1[0], u), lerp(p1[0], p2[0], u), u), lerp(lerp(p0[1], p1[1], u), lerp(p1[1], p2[1], u), u), 2]); } return out; })();
const IRE_ARC = (() => { const p0 = PROJ([-4.4, 48.4]), p2 = PROJ([-8.6, 52.0]), p1 = [p0[0] - 150, (p0[1] + p2[1]) / 2 + 20]; const out = []; for (let i = 0; i <= 24; i++) { const u = i / 24; out.push([lerp(lerp(p0[0], p1[0], u), lerp(p1[0], p2[0], u), u), lerp(lerp(p0[1], p1[1], u), lerp(p1[1], p2[1], u), u), 2]); } return out; })();

function mapContext(ctx, t, rr) {
  if (rr <= 0) return;
  const c0 = PROJ([2.4, 46.7]);
  ctx.save(); B.clipDisc(ctx, c0[0], c0[1], rr);
  for (const k of ['britain', 'nireland', 'sardinia', 'africa', 'rest']) {
    const p = pathOf(k);
    const fade = k === 'rest' || k === 'africa' ? E.lin(ctx, 860, 0, 1240, 0, [[0, 1], [1, 0]].map(([o, a]) => [o, rgba(P.ind1, .55 * a)])) : rgba(P.ind1, .55);
    ctx.fillStyle = fade; ctx.fill(p);
    ctx.strokeStyle = k === 'rest' || k === 'africa' ? E.lin(ctx, 860, 0, 1240, 0, [[0, rgba(P.blue0, .9)], [1, rgba(P.blue0, 0)]]) : rgba(P.blue0, .9); ctx.lineWidth = 1.6; ctx.stroke(p);
  }
  ctx.restore();
}
function litCountry(ctx, t, key, src, u, proj = PROJ, seed = 5) {
  if (u <= 0) return;
  const p = pathOf(key, proj), s = proj(src), [x0, y0, x1, y1] = p.getBounds(), R = Math.hypot(Math.max(Math.abs(x0 - s[0]), Math.abs(x1 - s[0])), Math.max(Math.abs(y0 - s[1]), Math.abs(y1 - s[1])));
  ctx.save(); B.clipDisc(ctx, s[0], s[1], R * 1.05 * u);
  E.lightShape(ctx, p, t, { lit: 1, dust: 0, glow: .55, seed });
  ctx.restore();
}

// ------------------------------------------------------------------ Keynes + the scale (screen coordinates)
const X0 = 330, X1 = 1590, YB = 800, HK = 8, yr = (y) => X0 + (y - 1930) * (X1 - X0) / 100, hy = (h) => YB - h * HK;
const HOURS = [[1930, 47], [1940, 45], [1950, 43], [1960, 42], [1970, 41], [1985, 40.6], [2000, 40.4], [2025, 40]];
const BLOCK = (() => { const top = []; for (let y = 1930; y <= 2025; y += 5) { let i = 0; while (i < HOURS.length - 2 && HOURS[i + 1][0] < y) i++; const f = (y - HOURS[i][0]) / (HOURS[i + 1][0] - HOURS[i][0]); top.push([yr(y), hy(lerp(HOURS[i][1], HOURS[i + 1][1], clamp(f)))]); } return [...top, [yr(2025), YB], [yr(1930), YB]]; })();
const FORECAST = E.catmull([[X0, hy(47), 3], [yr(1960), hy(40), 3], [yr(1990), hy(26), 3], [yr(2015), hy(17.5), 3], [X1, hy(15), 3]], 12);
const INCOME = (() => { const o = []; for (let i = 0; i <= 40; i++) { const u = i / 40; o.push([lerp(X0, yr(2025), u), lerp(762, 214, u ** 1.9), 3]); } return o; })();
const PIV = [960, 372], HALF = 470, HANG = 236;
function scaleGeom(th) {
  const L = [PIV[0] - HALF * Math.cos(th), PIV[1] - HALF * Math.sin(th)], Rr = [PIV[0] + HALF * Math.cos(th), PIV[1] + HALF * Math.sin(th)];
  return { L, R: Rr, pl: [L[0], L[1] + HANG], pr: [Rr[0], Rr[1] + HANG] };
}
const pilePts = (cx, cy, s) => { const o = []; for (let i = 0; i <= 24; i++) { const u = i / 24, x = cx + (u - .5) * 230 * Math.sqrt(s); o.push([x, cy - 4 - 112 * s * Math.exp(-((u - .5) ** 2) / .055)]); } o.push([cx + 115 * Math.sqrt(s), cy - 2], [cx - 115 * Math.sqrt(s), cy - 2]); return o; };
function coolSpan(ctx, pts, u0, u1, w = 3, a = 1) {   // the money line: cool cream, same three passes as the gold thread
  u0 = clamp(u0); u1 = clamp(u1); if (u1 <= u0) return null;
  const n = pts.length - 1, i0 = Math.floor(u0 * n), i1 = Math.ceil(u1 * n), sub = pts.slice(i0, i1 + 1);
  for (const [k, al, col, op] of [[5, .25, P.blue0, 'lighter'], [2.2, .8, B.COOL, 'source-over'], [1, 1, P.cream, 'source-over']]) {
    ctx.save(); ctx.globalCompositeOperation = op; ctx.strokeStyle = col; ctx.globalAlpha = al * a; ctx.lineWidth = w * k; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (k > 3) ctx.filter = `blur(${w * 2}px)`; ctx.beginPath(); sub.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore();
  }
  return sub[sub.length - 1];
}
const SIGNS = [['office', 'COMPANIES', 1190, 'comp'], ['dome', 'GOVERNMENTS', 1450, 'gov'], ['ballot', 'EVERYONE', 1710, 'every']];
const SIGN_Y = 236;

function chunk(a) {
  // ---- timing (all from words) ----
  const tRise0 = a.T0 + SEAM_HALF, tRise1 = tRise0 + 2.3;
  const tPhone = a.after, tFlip0 = a.dont, tFlip1 = a.dont + .55;
  const tPush0 = a.dont - .45, tPush1 = a.dont + .9, tM0 = a.dont + .95, tM1 = a.bel + .55;          // to the map
  const tBack0 = a.thats - 1.0, tBack1 = tBack0 + 1.45, tPull1 = a.shift + .55;                        // back to the table
  const tK0 = a.yours + .3, tK1 = tK0 + 1.2, tKM0 = tK1 + .02, tKM1 = tKM0 + 1.75;                   // into the Keynes block
  const tBal0 = a.mostly + .05, tBal1 = a.money + .05;                                                 // graph → scale
  const tCarry0 = a.work + .05, tCarry1 = a.end;                                                       // the coin leaves for c12
  const KEYS = [
    [tRise0, cam3()], [tRise1, CTAB], [tPush0, CTAB], [tPush1, CFILL], [tBack1, CFILL], [tPull1, CTAB], [tK0, CTAB], [tK1, CFILL],
  ];
  const theta = (t) => {   // the beam: + = the time side (right) down
    let th = -.17 * expoOut(span(t, a.money, a.money + 1.1)) - .035 * sineIO(span(t, a.more1 - .1, a.more1 + .5));
    const sw = span(t, a.more2, a.more2 + 1.6); if (sw > 0) th = lerp(th, 0, expoOut(sw)) + .012 * Math.sin(sw * 9) * (1 - sw) * (sw < 1 ? 1 : 0);
    for (const k of ['comp', 'gov', 'every']) th += .06 * expoOut(span(t, a[k] + 1.05, a[k] + 2.2));
    return th;
  };
  const pile = (t) => .55 + .15 * ['comp', 'gov', 'every'].reduce((s, k) => s + smooth(span(t, a[k] + .55, a[k] + 1.6)), 0);

  return (ctx, t) => {
    // ===== seam: the plate (identical to B2's last frames), then the cloth takes over at the home camera =====
    if (seamWindow(t, a.T0)) { plateSheet(ctx, t); return; }   // (the chunk starts at T0; the window also covers float rounding)
    const amt = smooth(span(t, tRise0, tRise0 + 1.5));
    const cam = camDrift(camAt(t, KEYS), t, .6 * amt);
    const st = {
      phone: expoOut(span(t, tPhone, tPhone + .3)) * (1 - span(t, tFlip0 + .25, tFlip0 + .3)), buzz: 3 * (span(t, tPhone - .3, tPhone - .05) > 0 && t < tPhone ? 1 : 0),
      flip: quartIO(span(t, tFlip0, tFlip1)),
      child: (() => { const u = sineIO(span(t, a.your - .1, a.your + 1.2)); return [lerp(1960, 1660, u), lerp(1600, 1330, u) - 60 * Math.sin(u * Math.PI), lerp(-.4, 0, u)]; })(),
      hug: smooth(span(t, a.your + .9, a.your + 1.7)),
      pour1: sineIO(span(t, a.favor - .3, a.favor + .5)) * (1 - sineIO(span(t, a.favor + 1.8, a.favor + 2.6))),
      pourStream: span(t, a.favor + .35, a.favor + .6) * (1 - span(t, a.favor + 1.55, a.favor + 1.75)),
      pour2: smooth(span(t, a.favor + .5, a.favor + 1.7)), pourLean: 30 * sineIO(span(t, a.favor - .3, a.favor + .5)) * (1 - sineIO(span(t, a.favor + 1.8, a.favor + 2.6))),
      pourArm: [.05, .3 * sineIO(span(t, a.favor - .3, a.favor + .5)) * (1 - sineIO(span(t, a.favor + 1.8, a.favor + 2.6)))],
      amt, dim: amt * clamp(1 - sineIO(span(t, tPush0, tPush1)) + sineIO(span(t, tBack1, tPull1)) - sineIO(span(t, tK0, tK1))),
      warm: sineIO(span(t, a.yours - .3, a.yours + 1.2)), duRelax: sineIO(span(t, a.yours - .2, a.yours + 1.0)), duBack: 26 * sineIO(span(t, a.yours - .2, a.yours + 1.0)),
    };
    const inMap = t >= tM0 && t < tBack1, inK = t >= tKM0;
    B.setView(t); B.applyView(ctx);   // the slow view over the flat graphics (identity until the Keynes graph)
    // ===== background: night for the graphics (the cloth covers it whenever the scene changes) =====
    const carry = sineIO(span(t, tCarry0, tCarry1));
    if (inMap || inK) B.bgNight(ctx, t, { dawn: .15, stars: inK ? .6 : .45, sy: SY12 * carry });
    else { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H); ctx.restore(); }

    // ===== the table scene (and the cloth as the carrier shape) =====
    const um = sineIO(span(t, tM0, tM1)) * (1 - sineIO(span(t, tBack0, tBack1)));
    const uk = sineIO(span(t, tKM0, tKM1));
    const shapeU = inMap ? um : inK ? uk : 0;
    if (shapeU <= 0) { table(ctx, cam, t, st); }
    else {
      // the cloth rectangle (as the camera sees it) morphs into the next shape; inside it, the cloth itself (its light, its writing)
      const m = E.cardM(cam, F0), rp = B.resample(B.rectPts(m.e + CL.x0 * m.k, m.f + CL.y0 * m.k, m.e + CL.x1 * m.k, m.f + CL.y1 * m.k), RECT_N);
      let target;
      if (inMap) target = FR;
      else { const bu = quartIO(span(t, tBal0 + .35, tBal1 + .1)), g = scaleGeom(theta(t)); target = bu > 0 ? B.morphPts(BLOCKR, B.resample(pilePts(g.pr[0], g.pr[1], pile(t)), RECT_N), bu) : BLOCKR; }
      const path = B.ptsPath(B.morphPts(rp, target, shapeU));
      if (inK) keynes(ctx, t, a, theta, pile, carry);
      ctx.save(); B.applyView(ctx); ctx.translate(0, SY12 * carry * (inK ? 1 : 0)); ctx.clip(path);
      table(ctx, cam, t, st);   // the whole table, clipped: dishes, glasses and hands leave with the cloth's edge, nothing pops
      if (inK) {   // the block darkens into a body of sand under its lit top (an area chart, not a panel)
        const dk = sineIO(span(t, tKM0 + .9, tKM1 + .5)) * (1 - .75 * quartIO(span(t, tBal1 - .25, tBal1 + .35)));   // stays sand-dark while it shrinks to the pile
        ctx.fillStyle = E.lin(ctx, 0, hy(47) - 10, 0, YB, [[0, rgba(P.halo1, .15 * dk)], [.1, rgba(P.ind1, .62 * dk)], [.5, rgba(P.ind0, .85 * dk)], [1, rgba(P.night1, .94 * dk)]]); ctx.fillRect(0, -300, W, H + 600);
      }
      ctx.restore();
      ctx.save(); ctx.translate(0, SY12 * carry * (inK ? 1 : 0)); E.glowFill(ctx, path, 14, (inK ? .18 : .35) * shapeU, P.halo1);
      ctx.strokeStyle = rgba(P.core1, .55 * shapeU); ctx.lineWidth = 2; ctx.stroke(path); ctx.restore();
      if (inMap) map(ctx, t, a);
      if (inK) keynesTop(ctx, t, a, theta, carry);
    }
  };
}
const BLOCKR = B.resample(BLOCK, RECT_N), BLOCKTOP = BLOCK.slice(0, -2).map(([x, y]) => [x, y, 3]);

function map(ctx, t, a) {
  const tBack0 = a.thats - 1.0, out = (k) => 1 - expoIn(span(t, tBack0 - .55 + k * .06, tBack0 + .1 + k * .06));
  mapContext(ctx, t, 1500 * sineIO(span(t, a.dont + 1.6, a.bel + 1.4)) * out(4));
  // France: the label (the year of the law)
  const fr = rise(span(t, a.bel - .25, a.bel + .55)) * out(0);
  const fl = PROJ([-5.6, 47.6]);
  B.label(ctx, 'FRANCE', fl[0], fl[1], fr, { align: 'right' });
  B.label(ctx, '2017', fl[0], fl[1] + 118, fr, { align: 'right', serif: true, size: 110 });
  // Belgium, Spain, Portugal, Ireland: light spreads from the neighbour; labels rise from their baselines
  LIT.forEach(([name, key, src, ak, lp, al], i) => {
    const t0 = a[ak] + (key === 'ireland' ? .15 : 0), u = sineIO(span(t, t0, t0 + .7)) * out(i + 1);
    if (key === 'ireland') { const th = span(t, a.ire - .35, a.ire + .2), back = span(t, tBack0 - .5, tBack0); if (th > 0 && back < 1) K.trailSpan(ctx, IRE_ARC, back, th, { w: 2, spark: th < 1 }); }
    litCountry(ctx, t, key, src, u, PROJ, 11 + i);
    B.label(ctx, name, lp[0], lp[1], rise(span(t, t0 + .1, t0 + .8)) * out(i + 1), { align: al });   // a map: the names stay (no overlaps)
  });
  // Australia: the thread runs from Europe across the dark to an inset, which lights from where the thread lands
  const th = sineIO(span(t, a.aus - .05, a.aus + .75)), back = expoIn(span(t, tBack0 - .55, tBack0 - .05));
  if (th > 0 && back < 1) K.trailSpan(ctx, AUS_ARC, back, th, { w: 2, spark: th < 1 });
  const ua = sineIO(span(t, a.aus + .65, a.aus + 1.35)) * out(5);
  if (ua > 0) {
    const pa = B.polyPath('australia', B.MAP.australia, AUS), pt = B.polyPath('tasmania', B.MAP.tasmania, AUS), s = AUS([116, -31]);
    ctx.save(); B.clipDisc(ctx, s[0], s[1], 360 * ua); E.lightShape(ctx, pa, t, { lit: 1, dust: 0, glow: .55, seed: 21 }); E.lightShape(ctx, pt, t, { lit: 1, dust: 0, glow: .5, seed: 22 }); ctx.restore();
  }
  const al = AUS([134, -42.5]);
  B.label(ctx, 'AUSTRALIA', al[0], al[1] + 30, rise(span(t, a.aus + .7, a.aus + 1.4)) * out(5));
}

// the Keynes graph and the scale: drawn UNDER the block/pile (the block is the cloth shape), the marks on top in keynesTop
function keynes(ctx, t, a, theta, pile, carry) {
  ctx.save(); ctx.translate(0, SY12 * carry);
  const bu = quartIO(span(t, a.mostly + .05, a.money + .05));            // graph → scale
  // the baseline (1930 → 2030) is drawn out of the block's foot; then it rises, shortens and becomes the beam
  const g = scaleGeom(theta(t));
  const bl = sineIO(span(t, a.keynes - 1.2, a.keynes + .2));
  const p0 = [lerp(X0 - 20, g.L[0], bu), lerp(YB, g.L[1], bu)], p1 = [lerp(lerp(yr(2025), X1 + 20, bl), g.R[0], bu), lerp(YB, g.R[1], bu)];
  K.trailSpan(ctx, [[p0[0], p0[1], 3], [p1[0], p1[1], 3]], 0, 1, { w: 2.6, spark: false });
  if (bu > 0) {
    // post and foot of the scale grow out of the beam's middle; the pans hang from the ends on threads
    const post = sineIO(span(t, a.mostly + .5, a.money - .1));
    K.trailSpan(ctx, [[PIV[0], PIV[1], 3], [PIV[0], 880, 3]], 0, post, { w: 2.4, spark: post < 1 });
    K.trailSpan(ctx, [[PIV[0] - 120, 880, 3], [PIV[0] + 120, 880, 3]], .5 - .5 * smooth(span(t, a.money - .3, a.money + .2)), .5 + .5 * smooth(span(t, a.money - .3, a.money + .2)), { w: 2.4, spark: false });
    halo(ctx, PIV[0], PIV[1], 40, .6 * bu, P.halo1, P.core0);
    const hang = sineIO(span(t, a.mostly + .7, a.money + .1));
    for (const [e, p] of [[g.L, g.pl], [g.R, g.pr]]) {
      if (hang <= 0) continue;
      for (const dx of [-128, 128]) K.trailSpan(ctx, [[e[0], e[1], 1.5], [p[0] + dx, p[1] - 6, 1.5]], 0, hang, { w: 1.3, spark: false, a: .8 });
      const k = hang, bw = 136;
      ctx.save(); ctx.strokeStyle = rgba(P.halo0, .9 * k); ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.shadowColor = rgba(P.halo1, .8); ctx.shadowBlur = 18;
      ctx.beginPath(); ctx.moveTo(p[0] - bw * k, p[1] - 6); ctx.quadraticCurveTo(p[0], p[1] + 34, p[0] + bw * k, p[1] - 6); ctx.stroke(); ctx.restore();
    }
  }
  ctx.restore();
}
function keynesTop(ctx, t, a, theta, carry) {
  const bu = quartIO(span(t, a.mostly + .05, a.money + .05)), gone = (d = 0) => 1 - expoIn(span(t, a.mostly - .25 + d, a.mostly + .25 + d));
  ctx.save(); ctx.translate(0, SY12 * carry);
  // labels of the graph
  B.label(ctx, 'KEYNES · 1930', X0, 250, rise(span(t, a.keynes - .1, a.keynes + .8)) * (1 - smooth(span(t, a.fifteen - .4, a.fifteen + .1))), { align: 'left' });
  // the real work week: a gold thread along the block's top (it draws as the block settles, retracts when the graph becomes the scale)
  const wu = sineIO(span(t, a.keynes - .9, a.keynes + .4)), wb = expoIn(span(t, a.mostly - .2, a.mostly + .35));
  if (wu > 0 && wb < 1) K.trailSpan(ctx, BLOCKTOP, wb, wu, { w: 3, spark: wu < 1 });
  // the forecast: a dotted line of gold falls to 15 hours (on "fifteen"), the number stands at its end
  const fu = sineIO(span(t, a.fifteen - .55, a.fifteen + .7)) * gone(0);
  if (fu > 0) {
    const n = Math.floor(fu * (FORECAST.length - 1));
    ctx.save(); ctx.setLineDash([2, 15]); ctx.lineCap = 'round'; ctx.strokeStyle = P.halo0; ctx.lineWidth = 5; ctx.shadowColor = rgba(P.halo1, .9); ctx.shadowBlur = 10;
    ctx.beginPath(); for (let i = 0; i <= n; i++) (i ? ctx.lineTo(FORECAST[i][0], FORECAST[i][1]) : ctx.moveTo(FORECAST[i][0], FORECAST[i][1])); ctx.stroke(); ctx.restore();
    if (fu < 1) halo(ctx, FORECAST[n][0], FORECAST[n][1], 34, .7);
  }
  const nu = rise(span(t, a.fifteen + .2, a.fifteen + 1.1)) * gone(0);
  B.label(ctx, '15', X1 + 24, hy(15) + 40, nu, { align: 'left', serif: true, size: 130 });
  B.label(ctx, 'HOURS', X1 + 28, hy(15) + 112, rise(span(t, a.fifteen + .5, a.fifteen + 1.3)) * gone(0), { align: 'left' });
  // income: a cool line climbs (right about the riches) to a coin, then shrinks back into the coin, which flies to the money pan
  const g = scaleGeom(theta(t));
  const iu = sineIO(span(t, a.riches - .45, a.riches + .75)), back = expoIn(span(t, a.mostly - .1, a.mostly + .45));
  if (iu > 0 && back < 1) coolSpan(ctx, INCOME, back, iu, 3);
  const endI = INCOME[Math.max(0, Math.round(iu * (INCOME.length - 1)))];
  const stackN = 1 + Math.floor(5 * clamp(span(t, a.money, a.money + .55) * 1.0001)), fly = quartIO(span(t, a.mostly + .35, a.money - .05));
  const carryU = span(t, a.work + .05, a.end), lift = sineIO(span(t, a.work + .05, a.end));
  if (iu > .02) {
    for (let i = 0; i < stackN; i++) {
      const top = i === stackN - 1, cy = g.pl[1] - 4 - i * 14;
      if (top && carryU > 0) continue;   // the top coin is carried (drawn below in screen space)
      const x = lerp(endI[0], g.pl[0], fly), y = i ? cy : lerp(endI[1], cy, fly) - 90 * Math.sin(fly * Math.PI);
      if (i && span(t, a.money + i * .1, a.money + i * .1 + .25) <= 0) continue;
      const dropIn = i ? expoOut(span(t, a.money + (i - 1) * .1, a.money + (i - 1) * .1 + .3)) : 1;
      B.coin(ctx, x, y - 26 * (1 - dropIn), 44, t, { tilt: lerp(0, .82, fly), glow: .5 });
    }
  }
  // the signs: each rises from a short line of light, pours sand onto the time side, its word underneath
  SIGNS.forEach(([nm, word, x, k], i) => {
    const t0 = a[k] - .3, base = sineIO(span(t, t0 - .2, t0 + .35)), up = rise(span(t, t0 + .05, t0 + .75));
    if (base <= 0) return;
    K.trailSpan(ctx, [[x - 70, SIGN_Y + 14, 2], [x + 70, SIGN_Y + 14, 2]], .5 - .5 * base, .5 + .5 * base, { w: 2, spark: false, a: .8 });
    if (up > 0) { ctx.save(); ctx.beginPath(); ctx.rect(x - 200, SIGN_Y - 220, 400, 232); ctx.clip(); B.sign(ctx, nm, x, SIGN_Y + 4 + (1 - expoOut(up)) * 150, 128, t, { seed: 30 + i, glow: .8 * smooth(span(up, 0, .6)) }); ctx.restore(); }
    const nx = i < 2 ? a[SIGNS[i + 1][3]] - .3 : a.work + .05;   // one word at a time
    B.label(ctx, word, x, SIGN_Y + 92, rise(span(t, t0 + .35, t0 + 1.0)) * (1 - smooth(span(t, nx, nx + .5))));
    // the pour: grains fall in an arc from the sign's foot into the time pan
    const pu = span(t, a[k] + .35, a[k] + 1.45);
    if (pu > 0 && pu < 1) {
      const s0 = [x, SIGN_Y + 18], s1 = [g.pr[0], g.pr[1] - 70], c1 = [(s0[0] + s1[0]) / 2 + 40, s0[1] - 30];
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const r = E.prng(40 + i);
      for (let j = 0; j < 46; j++) {
        const ph = r(), sp = .7 + .5 * r(), q = ((pu * 2.2 * sp + ph) % 1), on = q < pu * 1.6 && q > (pu - .55) * 1.6;
        if (!on) continue; const qq = q * q;
        const px = lerp(lerp(s0[0], c1[0], q), lerp(c1[0], s1[0], q), q) + (r() - .5) * 8, py = lerp(lerp(s0[1], c1[1], qq), lerp(c1[1], s1[1], qq), q) + (r() - .5) * 8;
        ctx.fillStyle = r() > .4 ? P.core1 : P.halo0; ctx.fillRect(px - 1.3, py - 1.3, 2.6, 3.4);
      }
      ctx.restore();
    }
  });
  ctx.restore();
  // the carried coin: lifts from the money pan, turns to face us; the camera follows it up (the graphic slides away below)
  if (carryU > 0) {
    const sx = g.pl[0], sy = g.pl[1] - 4 - (stackN - 1) * 14 + SY12 * carry;
    const x = lerp(sx, B.COIN12.x, sineIO(carryU)), y = lerp(sy, B.COIN12.y, lift) - 60 * Math.sin(carryU * Math.PI) + 5 * Math.sin((t - a.end) * 1.6) * smooth(span(t, a.end - 1.4, a.end));   // arrives already bobbing (c12 goes on)
    B.carriedCoin(ctx, t, x, y, lerp(44, B.COIN12.r, sineIO(carryU)), lerp(.82, 0, sineIO(carryU)));
  }
}
