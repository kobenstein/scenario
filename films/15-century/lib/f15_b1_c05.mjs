// Film 15 · B1 · c05 STATION 3 (129.84 – 157.32) · AlphaFold: the chain folds, the Nobel, the world map of users, the pill splits.
// Entered through the lab window (c04 flies into it: this set's first frame IS cam3(), seen through the window before that).
// One explainer stage on card F0 under the lab lamp (deep card ZL); the camera pushes in until the lamp has left the frame and the
// medal / map / pill are the only light. The last 1.8 s are platePill itself (lib/f15_seams.mjs), the pill is drawn in screen space.
//
// | ID    | time          | anchor                     | picture                                                                        | moves               | carrier → next |
// | 5.01  | 129.84–136.08 | AlphaFold · shape · machines | under the lab lamp a chain of beads of light; on "shape" it folds into a three-helix ribbon; ALPHAFOLD label | chain folds · push | plan sequence |
// | 5.02  | 136.08–138.12 | Nobel                      | the protein casts a round light that becomes a medal: NOBEL PRIZE IN CHEMISTRY · 2024 (the protein its relief) | medal forms | medal → globe |
// | 5.03★ | 138.12–145.84 | uses · million · free      | the medal turns over: a globe of dots; it presses flat into the world map; LMIC dots light warm; >1 MILLION; a pulse on "free" | turn · unroll · lights | plan sequence |
// | 5.04  | 145.84–150.24 | trickle · everywhere       | a thin thread drips onto one point and breaks; on "everywhere" light rains on the whole map | drip · rain | lights → capsule |
// | 5.05  | 150.24–157.32 | cure · splits              | the lights gather into a capsule (screen 960, 520, w 300); on "splits" it opens: warm left, cool right = platePill | gather · split | platePill |
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f15_kit.mjs';
import * as U from './f15_b1_util.mjs';
import { PILL, platePill } from './f15_seams.mjs';
import { WORLD } from './f15_b1_world.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, card, cam3, camAt, camDrift, aim, project, F0, prng, drift } = E;

export function setC05(T, a) {
  const S45 = a.S45;
  // ------------------------------------------------------------------------------------------------ layout
  const ZL = 1300;                                                   // the lab (lamp, table, glassware): a nearer card, it leaves the frame as the camera pushes in
  const LAMP = { x: 960, y: 232 }, TABLE = 940;
  const C = { x: 960, y: 600 };                                      // the explainer centre (chain, medal, globe, map)
  const SE = 1.7, D = (sx, sy) => [(sx - 960) / SE + C.x, (sy - 540) / SE + C.y], DS = (px) => px / SE;   // screen → design at the explainer camera
  // the chain: 46 beads; start = a loose living line, target = a three-helix bundle (coils drawn as loops)
  const N = 46;
  const BASE = F.smoothPath([[800, 712], [842, 664], [842, 520], [842, 476], [900, 430], [960, 470], [960, 520], [960, 664], [1018, 716], [1078, 668], [1078, 520], [1078, 470], [1130, 432]], 16);
  const BF = F.pathFrame(BASE);
  const TARGET = Array.from({ length: N }, (_, i) => {
    const s = i / (N - 1), [x, y] = BF.atU(s), [x2, y2] = BF.atU(Math.min(1, s + .01)), [x1, y1] = BF.atU(Math.max(0, s - .01));
    const tx = x2 - x1, ty = y2 - y1, l = Math.hypot(tx, ty) || 1, hel = clamp((Math.abs(ty / l) - .75) / .2);
    const ph = i * 1.745;                                            // 3.6 beads per turn
    return [x + 30 * Math.cos(ph) * hel, y + 10 * Math.sin(ph) * hel];
  });
  const START = (t) => Array.from({ length: N }, (_, i) => [lerp(590, 1330, i / (N - 1)), C.y + 26 * Math.sin(i * .42 + t * .8) + 12 * Math.sin(i * 1.27 - t * 1.1)]);
  const foldAt = (i, t) => sineIO(span(t, a.shape - .3 + i / (N - 1) * 1.0, a.shape + .9 + i / (N - 1) * 1.0));
  // the medal
  const RM = 200, DOT0 = mixHex(P.blue2, P.cream, .22);
  // the world: dots on a hex grid, u/v 0..1; flat map size (design) and the globe
  const WD = WORLD(), MW = DS(1470), MH = MW / (1440 / 540), MAPC = D(960, 545);
  const flat = (d) => [MAPC[0] + (d[0] - .5) * MW, MAPC[1] + (d[1] - .5) * MH];
  const g0 = prng(505);
  const DOTS = WD.map((d) => ({ u: d[0], v: d[1], l: d[2], lon: d[0] * 360 - 180, lat: 78 - d[1] * 134, r: g0(), r2: g0(), xy: flat(d) }));
  const TRK = DOTS.reduce((b, d) => (Math.hypot(d.lon - 36, d.lat + 1) < Math.hypot(b.lon - 36, b.lat + 1) && d.l ? d : b), DOTS[0]);   // the trickle lands here (East Africa)
  // times
  const tFlip0 = a.realNews - .25, tFlip1 = a.realNews + .6;                  // the medal turns over to the globe
  const tUn0 = a.uses - .2, tUn1 = a.uses + 1.6;                            // the globe presses flat into the map
  const tG0 = a.cure - .55, tPill = a.cure + 1.35;                          // the lights gather into the capsule
  const tSplit0 = a.splits - .05, tSplit1 = a.T6 - .5;                      // a slow opening right up to the plate; after tSplit1: platePill itself

  // ------------------------------------------------------------------------------------------------ camera
  const KEYS = [
    [S45, cam3()],
    [a.alphafold + 1.6, aim(F0, C.x, C.y, 1.12, 960, 560), 'o'],         // leaves the window flight with its speed (expo out)
    [a.machines + .4, aim(F0, C.x, C.y - 10, 1.32, 960, 550)],
    [a.nobel + .3, aim(F0, C.x, C.y, 1.58, 960, 540)],
    [a.uses + .6, aim(F0, C.x, C.y, 1.67, 960, 540)],
    [a.lmic, aim(F0, C.x, C.y, SE, 960, 540)],
  ];
  const cam = (t) => camDrift(camAt(t, KEYS), t, 1.6 * smooth(span(t, S45, S45 + 1.6)) * (1 - smooth(span(t, tG0 - .6, tG0 + .4))), 5);

  // ------------------------------------------------------------------------------------------------ draw
  // c: the camera (given by c04 while seen through the lab window; otherwise this set's own)
  function draw(ctx, t, cIn) {
    if (t >= tSplit1) { platePill(ctx, t); return; }
    const c = cIn || cam(t);
    // the night: towards the plate's numbers (cy 560, r 1200, mid .5) while the capsule forms
    const k = smooth(span(t, tG0, tSplit1 - .1));
    U.nightBg(ctx, t, { cy: lerp(540, 560, k), r: lerp(1250, 1200, k), mid: lerp(.45, .5, k), wob: 6 * drift(t, 1, 3) * (1 - k) });
    const lamp = (1 - .9 * smooth(span(t, a.nobel - .3, a.realNews + .4))) * (1 - smooth(span(t, a.everywhere, tG0)));   // fully out before the capsule (= the plate)
    if (lamp > 0) card(ctx, c, ZL, () => lab(ctx, t, lamp));
    card(ctx, c, F0, () => {
      const medal = expoOut(span(t, a.nobel - .55, a.nobel + .35));
      const flip = span(t, tFlip0, tFlip1), sx = Math.cos(Math.PI * sineIO(flip));
      if (flip < .5) {
        ctx.save(); ctx.translate(C.x, C.y); ctx.scale(Math.max(.02, Math.abs(sx)), 1); ctx.translate(-C.x, -C.y);
        if (medal > 0) drawMedal(ctx, t, medal);
        drawProtein(ctx, t, medal);
        ctx.restore();
      } else world(ctx, t, Math.max(.02, Math.abs(sx)));
    });
    // 5.05: the lights gather into the capsule (screen space: the capsule must land exactly on the plate)
    if (t >= tG0) gather(ctx, t, c);
  }

  // the lab: wall glow, the lamp (the hero light at first), its cone, the table with glassware
  function lab(ctx, t, L) {
    const fl = 1 + .015 * Math.sin(t * 7.3) * Math.sin(t * 1.9);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = E.rad(ctx, LAMP.x, LAMP.y + 120, 900, [[0, rgba(P.halo1, .2 * L * fl)], [.5, rgba(P.halo1, .06 * L)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(-600, -800, 3200, 2600);
    // the cone down to the table
    const cone = new Path2D(); cone.moveTo(LAMP.x - 100, LAMP.y); cone.lineTo(LAMP.x + 100, LAMP.y); cone.lineTo(LAMP.x + 620, TABLE); cone.lineTo(LAMP.x - 620, TABLE); cone.closePath();
    ctx.filter = 'blur(26px)'; ctx.fillStyle = E.lin(ctx, 0, LAMP.y, 0, TABLE, [[0, rgba(P.halo1, .2 * L)], [1, rgba(P.halo0, .1 * L)]]); ctx.fill(cone);
    ctx.restore();
    E.dust(ctx, 1301, 260, LAMP.x, (LAMP.y + TABLE) / 2 + 40, 360, 260, t, .4 * L, P.halo2);
    // the table: a lit top edge (warm under the lamp), a dark front
    ctx.fillStyle = E.lin(ctx, 0, TABLE, 0, TABLE + 400, [[0, P.ind2], [.06, P.night1], [1, P.night0]]); ctx.fillRect(-900, TABLE, 3700, 900);
    ctx.fillStyle = E.lin(ctx, LAMP.x - 900, 0, LAMP.x + 900, 0, [[0, rgba(P.blue0, .6)], [.3, rgba(P.blue0, .9)], [.5, rgba(P.halo1, .25 + .7 * L)], [.7, rgba(P.blue0, .9)], [1, rgba(P.blue0, .6)]]); ctx.fillRect(-900, TABLE - 1.5, 3700, 3);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(LAMP.x, TABLE + 4); ctx.scale(1, .1);
    ctx.fillStyle = E.rad(ctx, 0, 0, 760, [[0, rgba(P.halo1, .45 * L)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 760, 0, 6.29); ctx.fill(); ctx.restore();
    glass(ctx, 430, L, 'flask'); glass(ctx, 1500, L, 'tubes');
    // the lamp: cord, shade (dark, blue rim, warm inner edge), bulb
    ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(LAMP.x, -900); ctx.lineTo(LAMP.x, LAMP.y - 112); ctx.stroke();
    const sh = new Path2D(); sh.moveTo(LAMP.x - 34, LAMP.y - 112); sh.lineTo(LAMP.x + 34, LAMP.y - 112); sh.lineTo(LAMP.x + 130, LAMP.y); sh.lineTo(LAMP.x - 130, LAMP.y); sh.closePath();
    ctx.fillStyle = E.lin(ctx, LAMP.x - 130, 0, LAMP.x + 130, 0, [[0, P.night1], [.6, P.ind2], [1, mixHex(P.ind2, P.blue1, .4)]]); ctx.fill(sh);
    ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 2; ctx.stroke(sh);
    ctx.fillStyle = rgba(mixHex(P.blue1, P.halo1, L), .9); ctx.beginPath(); ctx.ellipse(LAMP.x, LAMP.y, 130, 12, 0, 0, 6.29); ctx.fill();
    if (L > .05) E.halo(ctx, LAMP.x, LAMP.y + 6, 120, .8 * L * fl, P.halo1, P.core0);
  }
  function glass(ctx, x, L, kind) {
    const p = new Path2D(), y = TABLE;
    if (kind === 'flask') { p.moveTo(x - 16, y - 170); p.lineTo(x + 16, y - 170); p.lineTo(x + 16, y - 110); p.lineTo(x + 70, y - 8); p.quadraticCurveTo(x + 74, y, x + 64, y); p.lineTo(x - 64, y); p.quadraticCurveTo(x - 74, y, x - 70, y - 8); p.lineTo(x - 16, y - 110); p.closePath(); }
    else { for (let k = 0; k < 4; k++) { const xx = x - 66 + k * 44; p.roundRect(xx - 12, y - 150 + (k % 2) * 20, 24, 150 - (k % 2) * 20, [0, 0, 12, 12]); } p.rect(x - 96, y - 70, 192, 14); }
    ctx.fillStyle = E.lin(ctx, x - 80, 0, x + 80, 0, [[0, P.night1], [1, P.ind2]]); ctx.fill(p);
    ctx.strokeStyle = rgba(mixHex(P.blue0, P.halo1, .35 * L * (x < 960 ? 1 : .8)), .9); ctx.lineWidth = 2; ctx.stroke(p);
  }

  // 5.01: the chain of beads folds into the protein; 5.02 it becomes the medal's relief
  function chainPts(t) {
    const S = START(t), rot = .025 * Math.sin(t * .45), cs = Math.cos(rot), sn = Math.sin(rot);
    return S.map((p, i) => {
      const f = foldAt(i, t); if (f <= 0) return p;
      let [tx, ty] = TARGET[i]; const dx = tx - C.x, dy = ty - 590; tx = C.x + dx * cs - dy * sn; ty = 590 + dx * sn + dy * cs;
      ty += 3 * Math.sin(t * 1.3 + i * .3);
      return U.arcPt(p, [tx, ty], f, 60 * Math.sin(i * 2.1));
    });
  }
  function drawProtein(ctx, t, medal) {
    const emb = smooth(span(t, a.nobel - .4, a.nobel + .4));
    const sc = lerp(1, .5, emb), pts = chainPts(t).map(([x, y]) => [lerp(x, C.x + (x - 965) * sc, emb), lerp(y, C.y + 6 + (y - 548) * sc, emb)]);
    const fAll = clamp((t - a.shape + .3) / 2.2), wR = lerp(2.4, 15, sineIO(fAll)) * sc;
    const path = E.catmull(pts.map((p) => [p[0], p[1], 0]), 6);
    const stroke = (w, col) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); path.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); };
    if (emb < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = `blur(${10 + wR}px)`; stroke(wR * 3, rgba(P.halo1, .35 * (1 - emb))); ctx.restore(); }
    stroke(wR, mixHex(P.halo1, P.shade0, .85 * emb));
    stroke(wR * .4, mixHex(P.core1, P.halo1, .7 * emb));
    const br = lerp(9, 4, sineIO(fAll)) * sc;
    pts.forEach(([x, y], i) => {
      ctx.fillStyle = mixHex(i % 3 ? P.core1 : P.core0, P.shade0, .7 * emb); ctx.beginPath(); ctx.arc(x, y, br, 0, 6.29); ctx.fill();
    });
    // the label (small caps under the chain)
    const uL = span(t, a.alphafold - .1, a.alphafold + .7) * (1 - span(t, a.nobel - .7, a.nobel - .3));
    U.capsLine(ctx, 'AlphaFold', C.x, 790, 30, uL, { align: 'center', col: P.halo2 });
  }
  function drawMedal(ctx, t, m) {
    const r = RM * m, disc = new Path2D(); disc.arc(C.x, C.y, r, 0, 6.29);
    E.lightShape(ctx, disc, t, { lit: 1, dust: 500, seed: 52 });
    ctx.strokeStyle = rgba(P.shade0, .55); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(C.x, C.y, r * .9, 0, 6.29); ctx.stroke();
    ctx.strokeStyle = rgba(P.core0, .7); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(C.x, C.y, r * .985, 0, 6.29); ctx.stroke();
    // NOBEL PRIZE IN CHEMISTRY round the top (stamped letter by letter), 2024 at the bottom
    const s = 'NOBEL PRIZE IN CHEMISTRY', n = s.length, span0 = 2.3, uT = span(t, a.nobel + .05, a.nobel + .95);
    ctx.save(); ctx.font = '600 21px Inter'; ctx.fillStyle = F.INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = 0; i < Math.floor(uT * (n + .99)); i++) {
      const q = -Math.PI / 2 + (i / (n - 1) - .5) * span0; ctx.save(); ctx.translate(C.x + Math.cos(q) * r * .76, C.y + Math.sin(q) * r * .76); ctx.rotate(q + Math.PI / 2); ctx.fillText(s[i], 0, 0); ctx.restore();
    }
    ctx.restore();
    const uY = span(t, a.nobel + .35, a.nobel + 1.0);
    if (uY > 0) { ctx.save(); ctx.beginPath(); ctx.rect(C.x - 80, C.y + r * .52 - 40, 160, 46 * expoOut(uY) + 4); ctx.clip(); ctx.font = '52px "Instrument Serif"'; ctx.fillStyle = F.INK; ctx.textAlign = 'center'; ctx.fillText('2024', C.x, C.y + r * .52 + 4); ctx.restore(); }
  }

  // 5.03–5.04: the globe of dots → the flat map; LMIC dots light; the pulse; the trickle; the rain
  function lon0(t) { return lerp(-35, 0, sineIO(span(t, tFlip1 - .3, tUn0 + .5))); }
  function world(ctx, t, sx) {
    const un = span(t, tUn0, tUn1), l0 = lon0(t) * Math.PI / 180, ph0 = .2, R = RM;
    // the sphere body flattens into the equator line (the map is pressed flat)
    const ry = lerp(R, 0, sineIO(span(un, 0, .8))), rx = lerp(R, MW / 2 + 30, sineIO(un));
    ctx.save(); ctx.translate(C.x, C.y); ctx.scale(sx, 1);
    if (ry > 1) {
      const body = new Path2D(); body.ellipse(0, 0, rx, ry, 0, 0, 6.29);
      E.glowFill(ctx, body, 60, .55, P.blue0);
      ctx.fillStyle = E.rad(ctx, -rx * .3, -ry * .35, Math.max(rx, ry) * 1.2, [[0, mixHex(P.ind1, P.blue1, .35)], [1, P.night1]]); ctx.fill(body);
      ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 2; ctx.stroke(body);
    }
    ctx.restore();
    const gather = t >= tG0;   // from here the dots are drawn by gather() in screen space
    if (gather) return;
    const eq = span(un, .6, 1) * (1 - span(t, a.trickle - 1, a.trickle));
    if (eq > 0) { ctx.strokeStyle = rgba(P.blue0, .5 * eq); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(MAPC[0] - MW / 2, MAPC[1] + (MH * ((78) / 134 - .5))); ctx.lineTo(MAPC[0] + MW / 2, MAPC[1] + (MH * ((78) / 134 - .5))); ctx.stroke(); }
    const pos = (d) => dotPos(d, t, un, l0, ph0, R, sx);
    ctx.save();
    for (const d of DOTS) {
      const p = pos(d); if (!p) continue;
      const w = warmth(d, t);
      ctx.fillStyle = w > .02 ? mixHex(DOT0, w > 1 ? P.core0 : P.core1, Math.min(1, w)) : DOT0;
      ctx.globalAlpha = lerp(.75, 1, Math.min(1, w)) * p[2];
      const s = lerp(2.9, 3.9, Math.min(1, w)); ctx.fillRect(p[0] - s / 2, p[1] - s / 2, s, s);
    }
    ctx.restore();
    // a soft warm glow over the lit regions (lighter)
    const glowW = span(t, a.million, a.lmic + .5);
    if (glowW > 0) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (const [lo, la, rr] of [[20, 5, 210], [78, 20, 150], [105, 10, 120], [-62, -10, 130], [-95, 18, 70]]) {
        const [x, y] = flat([(lo + 180) / 360, (78 - la) / 134]); E.halo(ctx, x, y, DS(rr * 1.2), .14 * glowW, P.halo1, P.halo0);
      }
      ctx.restore();
    }
    // >1 MILLION · users in low- and middle-income countries · Google DeepMind (in the South Pacific of the map)
    const uN = span(t, a.million - .15, a.million + 1.2) * (1 - span(t, a.trickle - .6, a.trickle - .1));
    const [nx, ny] = D(150, 790);
    U.numBlock(ctx, { x: nx, y: ny, num: '>1 million', label: ['users in low- and', 'middle-income countries'], src: 'Google DeepMind', u: uN, size: DS(118), labelSize: DS(30), srcSize: DS(22), gap: DS(50) });
    // 5.04 · the trickle: a thin thread drips onto one point and breaks off; then the rain on "everywhere"
    trickle(ctx, t); rain(ctx, t);
  }
  function dotPos(d, t, un, l0, ph0, R, sx) {
    const lam = d.lon * Math.PI / 180 - l0, phi = d.lat * Math.PI / 180;
    const cosc = Math.sin(ph0) * Math.sin(phi) + Math.cos(ph0) * Math.cos(phi) * Math.cos(lam);
    let gx, gy, vis = 1;
    if (cosc >= 0) { gx = R * Math.cos(phi) * Math.sin(lam); gy = -R * (Math.cos(ph0) * Math.sin(phi) - Math.sin(ph0) * Math.cos(phi) * Math.cos(lam)); }
    else { const s = Math.sign(Math.sin(lam)) || 1; gx = s * R * Math.cos(phi) * .999; gy = -R * Math.sin(phi) * Math.cos(ph0); vis = 0; }
    if (un <= 0 && !vis) return null;
    const dl = Math.abs(((d.lon - lon0(t)) + 540) % 360 - 180) / 180;      // 0 front … 1 back
    const e = sineIO(span(un, dl * .35, dl * .35 + .65));
    if (!vis && e <= 0) return null;
    return [lerp(C.x + gx * sx, d.xy[0], e), lerp(C.y + gy, d.xy[1], e), vis ? 1 : clamp(e * 4)];
  }
  // 0..1 warm: LMIC on "million" (wave out from Africa), all on the rain
  function warmth(d, t) {
    const dist = Math.hypot(d.lon - 20, d.lat - 5) / 180;
    let w = d.l ? smooth(span(t, a.million - .2 + dist * 1.1 + d.r * .25, a.million + .25 + dist * 1.1 + d.r * .25)) : 0;
    // the pulse on "free": a ring of brightness through the lit dots
    const pr = (t - a.free + .1) * .9; if (d.l && pr > 0 && pr < 1.4) w = Math.min(1.35, w + .35 * Math.max(0, 1 - Math.abs(pr - dist) * 9));
    if (d === TRK) w = Math.max(w, 1 + .6 * Math.max(0, 1 - Math.abs(t - a.trickle - .5) * 2));
    const tr = a.everywhere - .1 + d.r2 * .7; w = Math.max(w, smooth(span(t, tr, tr + .25)));
    return w;
  }
  function trickle(ctx, t) {
    const t0 = a.trickle - .45, tB = a.landed + .1, [x, y] = TRK.xy, yTop = D(0, -40)[1];
    if (t < t0 || t > tB + 1.2) return;
    const head = sineIO(span(t, t0, t0 + .7)), brk = span(t, tB, tB + 1.0);
    const yHead = lerp(yTop, y - 4, head), yCut = lerp(yTop, y, expoIn(brk));           // after the break the lower end falls into the dot
    const top = brk > 0 ? lerp(yTop, yTop - 400, expoIn(brk)) : yTop, bot = brk > 0 ? yCut : yHead;
    ctx.save(); ctx.lineCap = 'round';
    if (brk <= 0) { ctx.strokeStyle = rgba(P.halo1, .9); ctx.lineWidth = DS(2.6); ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bot); ctx.stroke(); }
    else {   // broken: an upper part retracting, a short lower piece falling into the point
      const mid = lerp(yTop, y, .35);
      ctx.strokeStyle = rgba(P.halo1, .9); ctx.lineWidth = DS(2.6);
      ctx.beginPath(); ctx.moveTo(x, top - 600); ctx.lineTo(x, lerp(mid, yTop - 200, expoIn(brk))); ctx.stroke();
      const lp = lerp(mid, y, expoIn(brk)); if (brk < .98) { ctx.beginPath(); ctx.moveTo(x, lp); ctx.lineTo(x, Math.min(y, lp + DS(60) * (1 - brk))); ctx.stroke(); }
    }
    // drops running down the thread
    for (let k = 0; k < 4; k++) { const u = ((t - t0) * 1.1 + k / 4) % 1, yy = lerp(yTop, y, u); if (yy < bot && brk <= 0) { ctx.fillStyle = P.core0; ctx.beginPath(); ctx.ellipse(x, yy, DS(3), DS(6), 0, 0, 6.29); ctx.fill(); } }
    ctx.restore();
    E.halo(ctx, x, y, DS(40), .7 * Math.max(0, 1 - Math.abs(t - a.trickle - .4)), P.halo1, P.core0);
  }
  const RAIN = (() => { const g = prng(149), r = []; for (let k = 0; k < 220; k++) { const d = DOTS[Math.floor(g() * DOTS.length)]; r.push({ d, t: a.everywhere - .15 + d.r2 * .7, len: 40 + 60 * g() }); } return r; })();
  function rain(ctx, t) {
    if (t < a.everywhere - .9 || t > a.everywhere + 1.6) return;
    ctx.save(); ctx.lineCap = 'round';
    for (const R of RAIN) {
      const fall = .55, u = (t - (R.t - fall)) / fall; if (u < 0 || u > 1.25) continue;
      const [x, y] = R.d.xy;
      if (u <= 1) { const yy = lerp(y - DS(700), y, u * u); ctx.strokeStyle = E.lin(ctx, 0, yy - DS(R.len), 0, yy, [[0, rgba(P.halo1, 0)], [1, rgba(P.core1, .9)]]); ctx.lineWidth = DS(2); ctx.beginPath(); ctx.moveTo(x, yy - DS(R.len)); ctx.lineTo(x, yy); ctx.stroke(); }
      else { const s = (u - 1) / .25; ctx.strokeStyle = rgba(P.core0, .7 * (1 - s)); ctx.lineWidth = DS(1.5); ctx.beginPath(); ctx.arc(x, y, DS(4 + 12 * s), 0, 6.29); ctx.stroke(); }
    }
    ctx.restore();
  }

  // 5.05 · the dots fly into the capsule (screen space), the capsule forms, then splits
  const gP = prng(9001);
  const PT = DOTS.map(() => {   // a target inside the capsule (stadium) for every dot, seeded
    const g = gP, w = PILL.w, h = w * .42;
    let x, y; do { x = (g() - .5) * w * .94; y = (g() - .5) * h * .9; } while (Math.abs(x) > w / 2 - h / 2 && Math.hypot(Math.abs(x) - (w / 2 - h / 2), y) > h * .45);
    return [x, y];
  });
  function gather(ctx, t, c) {
    const pillY = PILL.y + 5 * drift(t, 1, 7), rot = .02 * drift(t * .7, 1, 2), cr = Math.cos(rot), sr = Math.sin(rot);
    const form = smooth(span(t, tPill - .55, tPill + .1));
    const split = .55 * smooth(span(t, tSplit0, tSplit1 - .1)), litR = lerp(1, .12, smooth(span(t, a.splits + .1, a.splits + 1.3)));
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (form > 0) F.pill(ctx, PILL.x, pillY, PILL.w * lerp(.86, 1, expoOut(form)), t, { split, lit: [1, litR], rot, dust: 600 });
    if (t < tPill + .3) {
      for (let i = 0; i < DOTS.length; i++) {
        const d = DOTS[i], [px, py, pk] = project(c, F0, d.xy[0], d.xy[1]);
        const dd = Math.hypot(px - 960, py - 520) / 900, t0 = tG0 + dd * .8 + d.r * .25, u = span(t, t0, t0 + .95);
        if (u >= 1 && form > .5) continue;
        const e = sineIO(u), [qx, qy] = PT[i], tx = PILL.x + qx * cr - qy * sr, ty = pillY + qx * sr + qy * cr;
        const p = U.arcPt([px, py], [tx, ty], e, 40 * (d.r - .5) * (1 - e));
        ctx.fillStyle = mixHex(P.core1, P.core0, e); const s = lerp(3.9 * pk, 2.4, e);
        ctx.fillRect(p[0] - s / 2, p[1] - s / 2, s, s);
      }
    }
    ctx.restore();
  }

  return { draw, KEYS, cam };
}
