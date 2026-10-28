// Film 15 · B2 · c07 (198.46 – 244.20) · Station 4b: the June quote, "below five years", the moved date, biology sets the pace,
// mid-film subscribe. One take on one explainer card (F0) in front of the plate's night:
//   7.01★ plateDivide → the cell finishes dividing, the daughters drift apart, each divides once more and sprouts a tail: the two
//         golden quotation marks of the June card (JUNE 2026 · ARTIFICIAL INTELLIGENCE & SCIENCE)
//   7.02  the quote rises line by line between the marks (word-timed), "compression" turns gold; source GLP-1 RESEARCHER …
//   7.03  the quote sinks; five year-sheets grow between the marks; on "below" the closing mark pushes, they give, stay five
//   7.04  the sheets lie down into a calendar bar 2024–2028; a sticky note FIRST TESTS IN PEOPLE · END 2025; on "moved" its pin
//         slides one year on, the note follows, 2025 is struck, 2026 written · REUTERS · JAN 2026
//   7.05  "biology, setting the pace": the calendar draws itself into its gold pin, the pin swells into a cell; it divides on "pace"
//   7.06  the cells keep dividing on a calm beat; at "all of us" they scatter as the warm lights of a wide night plain (c08 world)
// Hand-over to the plain set (lib/f15_b2_c08.mjs) at PLAIN.t0: there both draw the same lights at the home camera.
import { Path2D } from '@napi-rs/canvas';
import * as C from './f15_b2_common.mjs';
import { plateDivide, DIVIDE, SEAM_HALF } from './f15_seams.mjs';
const { E, F } = C;
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, card, cam3, camAt, camDrift, aim, F0 } = E;

// the cell clock's beat (shared with the plain set, which takes over when the cells have landed as lights)
export function clockTimes(T) {
  const pace = T.S('s06', 'pace'), BEAT = 1.15, G = 6, DUR = .95 * BEAT, tDiv = [];
  for (let g = 0, s = pace - .85; g < G; g++, s += BEAT) tDiv.push(s);
  const tScatter = tDiv[G - 1] + DUR;
  return { BEAT, G, DUR, tDiv, tScatter, tLand: tScatter + 1.55 };
}

export function setQ(T, PL) {
  const S = (w, n) => T.S('s06', w, n), S7 = (w, n) => T.S('s07', w, n);
  const a = {
    T0: T.seg('s06').start, june: S('June'), meeting: S('meeting'), artif: S('artificial'), researcher: S('researcher'),
    ithink: S('"I think'), large: S('a large'), compression: S('compression'), but: S('But we'), clinical: S('clinical'), data: S('data'),
    andthen: S('And then'), probably: S('probably'), below: S('below'), five: S('five years'), years: S('years'),
    even: S('Even'), dates: S('dates'), one: S('One of'), test: S('test its'), inpeople: S('in people'), endof: S('the end of twenty twenty-five'),
    tf: T.S('s06', 'twenty-five'), then: S('Then it'), moved: S('moved that'), tsix: S('twenty-six', 1), that: S("That isn't"), failure: S('failure'),
    biology: S('biology'), setting: S('setting'), pace: S('pace'), every: S7('Every'), allofus: S7('all of us'), subscribe: S7('subscribe'),
  };
  const t1 = a.T0 + SEAM_HALF;                         // from here on our own world grows out of the plate
  // ------------------------------------------------------------------------------------------------ layout (design coords, F0 card)
  const QS = 76, QX = 560, LY = [420, 512, 604, 696];
  const QL = [['I think we really will see', 0], ['a large ', 'compression.'], ['But we still need the', 0], ['clinical trial data.', 0]];
  const lineW = QL.map(([s, g]) => F.measure(s + (typeof g === 'string' ? g : ''), QS));
  const RB = 30;                                       // ball radius of a quotation drop
  const MK = { L: [QX - 108, 384], R: [QX + lineW[3] + 72, 668] };
  // sheets (7.03)
  const SH = { n: 5, w: 104, h: 236, gap: 40, base: 664 };
  const shX0 = 960 - (SH.n * SH.w + (SH.n - 1) * SH.gap) / 2;
  // calendar bar (7.04)
  const BAR = { x0: 360, cw: 240, y: 600, h: 44, years: ['2024', '2025', '2026', '2027', '2028'] };
  const PIN0 = BAR.x0 + 2 * BAR.cw, PIN1 = PIN0 + BAR.cw;       // end of 2025 → end of 2026
  const NOTE = { w: 300, h: 262, gapY: 64 };                     // the sticky note stands on its pin line above the bar
  // the cell clock (7.05/7.06)
  const CC = { x: PIN1, y: BAR.y, r: 74 };
  const { G, DUR, tDiv, tScatter, tLand } = clockTimes(T);       // six divisions → 64 cells; then they glide to their light on the plain

  // the cluster: a binary tree of cells; generation g divides along an axis turned 90° + a little each time
  const NODES = [];   // per generation: [{x, y, r, rot}]
  {
    let gen = [{ x: CC.x, y: CC.y, r: CC.r, rot: .25 }];
    NODES.push(gen);
    for (let g = 0; g < G; g++) {
      const nx = [];
      for (const n of gen) {
        const rc = n.r * .74, d = n.r * .84 + rc * .2, c = Math.cos(n.rot), s = Math.sin(n.rot);
        for (const sd of [-1, 1]) nx.push({ x: n.x + sd * d * c, y: n.y + sd * d * s, r: rc, rot: n.rot + Math.PI / 2 + .35 * sd });
      }
      gen = nx; NODES.push(gen);
    }
  }
  // the leaves get their place on the plain: nearest light first (keeps the scatter from crossing itself)
  const LEAF = NODES[G], LIGHTS = PL.lights.slice(0, LEAF.length);
  const order = LEAF.map((n, i) => i).sort((p, q) => Math.atan2(LEAF[p].y - CC.y, LEAF[p].x - CC.x) - Math.atan2(LEAF[q].y - CC.y, LEAF[q].x - CC.x));
  const lord = LIGHTS.map((l, i) => i).sort((p, q) => Math.atan2(LIGHTS[p][1] - CC.y - 160, LIGHTS[p][0] - CC.x) - Math.atan2(LIGHTS[q][1] - CC.y - 160, LIGHTS[q][0] - CC.x));
  const leafTo = []; order.forEach((li, k) => { leafTo[li] = lord[k]; });

  // ------------------------------------------------------------------------------------------------ camera (keys on words)
  const K = [
    [t1, cam3()],
    [a.ithink, cam3({ x: 20, y: 10, z: 80 })],
    [a.andthen, cam3({ x: 30, y: 16, z: 140 })],
    [a.below, cam3({ x: 0, y: 0, z: 90 })],
    [a.dates + .2, cam3({ x: 0, y: 40, z: 230 })],
    [a.moved - .4, cam3({ x: 40, y: 30, z: 290 })],
    [a.tsix + .5, cam3({ x: 110, y: 24, z: 320 })],
    [a.biology, aim(F0, CC.x, CC.y, 2.5, W / 2, H / 2)],
    [a.pace + .3, aim(F0, CC.x, CC.y, 2.6, W / 2, H / 2)],
    [tDiv[2], aim(F0, CC.x, CC.y + 10, 2.3, W / 2, H / 2)],
    [tDiv[4], aim(F0, CC.x, CC.y + 20, 1.75, W / 2, H / 2 - 20)],
    [PL.t0, cam3(), 's'],
  ];
  const camQ = (t) => camDrift(camAt(t, K), t, PL.DRIFT * smooth(span(t, t1, t1 + 1.6)));

  // ------------------------------------------------------------------------------------------------ the division drawing
  // one cell or a cell dividing: s 0..1 = the Cassini split (as F.cell), m 0..1 = the two lobes part and round off (sep apart, radius rc)
  // returns the two daughter centres (world). gWhole: the gradient of the undivided shape is kept until the lobes part, then each
  // lobe drifts to its own, so nothing jumps.
  function division(ctx, t, o) {
    const br = 1 + .015 * Math.sin(t * 1.3 + (o.ph ?? 9.6)), rot = o.rot ?? 0, r = o.r, m = clamp(o.m ?? 0), sep = o.sep ?? r, rc = (o.rc ?? r * .55) * br;
    const lit = o.lit ?? 1, a = o.a ?? 1, cheap = o.cheap, dA = o.dustA ?? 1;
    const up = (d) => (o.worldUp ? [-Math.sin(rot) * d, -Math.cos(rot) * d] : [0, -d]);   // gradient offset "up" (world or local)
    ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(rot);
    const out = [];
    if (m <= 0) {
      const cs = C.cassini(r, o.s ?? 0, br), path = C.poly(cs.pts);
      const [x0, y0, x1, y1] = path.getBounds(), w = x1 - x0, h = y1 - y0, R = Math.max(w, h, 8);
      const [ux, uy] = up(.15 * h), gx = (x0 + x1) / 2 + ux, gy = (y0 + y1) / 2 + uy;
      if (cheap) cheapBody(ctx, path, gx, gy, R * .75, a);
      else {
        C.lightBody(ctx, path, t, { g: { x: gx, y: gy, R: R * .75 }, blurR: R * .75, lit, a, glow: o.glow ?? 1 });
        if (o.dust && dA > 0) E.dust(ctx, o.seed ?? 57, o.dust, (x0 + x1) / 2, (y0 + y1) / 2, w * .55 + 6, h * .55 + 6, t, .8 * a * lit * dA, P.halo0);
      }
      membrane(ctx, path, r, a, cs.e, cs.c);
      const c = cs.c * .8; for (const sd of cs.e < .02 ? [0] : [-1, 1]) out.push([o.x + sd * c * Math.cos(rot), o.y + sd * c * Math.sin(rot)]);
    } else {
      const cs = C.cassini(r, 1, br), whole = C.poly(cs.pts), [X0, Y0, X1, Y1] = whole.getBounds(), R0 = Math.max(X1 - X0, Y1 - Y0);
      const u0 = up(.15 * (Y1 - Y0)), g0 = { x: u0[0], y: u0[1], R: R0 * .75 };
      for (const sd of [-1, 1]) {
        const lobe = lobeOf(cs.pts, sd), cen = lobe.cen;
        const dx = sd * (sep - Math.abs(cen[0])) * smooth(m), cx = cen[0] + dx, cy = cen[1], kr = smooth(span(m, 0, .42));
        // the round daughter is squashed 3 % along ITS own y axis (as it will be drawn as a whole cell): Δ = its rotation here
        const dR = o.kidRot ? Math.PI / 2 + .35 * sd : 0, ca = Math.cos(dR), sa = Math.sin(dR);
        const pts = lobe.polar.map(([th, rr]) => { const q = lerp(rr, rc, kr), X = Math.cos(th) * q, Y = Math.sin(th) * q;
          const lx = X * ca + Y * sa, ly = (-X * sa + Y * ca) * lerp(1, .97, kr); return [cx + lx * ca - ly * sa, cy + lx * sa + ly * ca]; });
        const ul = up(.15 * 2 * rc * .97), path = C.poly(pts), gl = { x: cx + ul[0], y: cy + ul[1], R: .75 * 2 * rc }, k = smooth(m);
        const g = { x: lerp(g0.x + dx * .5, gl.x, k), y: lerp(g0.y, gl.y, k), R: lerp(g0.R, gl.R, k) };
        if (cheap) cheapBody(ctx, path, g.x, g.y, g.R, a);
        else C.lightBody(ctx, path, t, { g, blurR: lerp(R0 * .75, gl.R, k), lit, a, glow: o.glow ?? 1 });
        const nOff = rc / br * .04 * k; membrane(ctx, path, lerp(r, rc / br, k), a, 1, 0, [cx + nOff * Math.sin(rot + dR) * 0 + nOff * sa, cy - nOff * ca + nOff], lerp(r * .16 * .82, rc / br * .16, k));
        out.push([o.x + cx * Math.cos(rot) - cy * Math.sin(rot), o.y + cx * Math.sin(rot) + cy * Math.cos(rot)]);
      }
      if (o.dust && !cheap && dA > 0) E.dust(ctx, o.seed ?? 57, o.dust, 0, 0, (X1 - X0) * .55 + 6 + sep * m, (Y1 - Y0) * .55 + 6, t, .8 * a * lit * dA, P.halo0);
    }
    ctx.restore();
    return out;
  }
  // one lobe of the pinched Cassini as a polar function around its centre (uniform angles; the waist closes with a chord)
  function lobeOf(pts, sd, N = 72) {
    const L = pts.filter(([x]) => x * sd > 0); if (L.length < 3) return { cen: [sd, 0], polar: [] };
    const sorted = L.slice().sort((p, q) => Math.atan2(p[1], p[0] * sd) - Math.atan2(q[1], q[0] * sd));
    const ring = sorted.concat([sorted[0]]), dense = [];
    for (let i = 0; i < ring.length - 1; i++) for (let k = 0; k < 6; k++) dense.push([lerp(ring[i][0], ring[i + 1][0], k / 6), lerp(ring[i][1], ring[i + 1][1], k / 6)]);
    const cen = L.reduce((s, p) => [s[0] + p[0] / L.length, s[1] + p[1] / L.length], [0, 0]);
    const pol = dense.map(([x, y]) => [Math.atan2(y - cen[1], x - cen[0]), Math.hypot(x - cen[0], y - cen[1])]).sort((p, q) => p[0] - q[0]);
    const out = [];
    for (let j = 0; j < N; j++) {
      const th = -Math.PI + (j + .5) / N * 2 * Math.PI;
      let i = pol.findIndex((p) => p[0] >= th); if (i < 0) i = 0;
      const p1 = pol[i], p0 = pol[(i - 1 + pol.length) % pol.length];
      const d0 = th - p0[0] + (p0[0] > th ? 2 * Math.PI : 0), d1 = p1[0] - th + (p1[0] < th ? 2 * Math.PI : 0);
      out.push([th, (p0[1] * d1 + p1[1] * d0) / Math.max(1e-6, d0 + d1)]);
    }
    return { cen, polar: out };
  }
  function membrane(ctx, path, r, a, e, c, cen = null, nr0 = null) {
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = rgba(P.cream, .55); ctx.lineWidth = Math.max(1.2, r * .018); ctx.stroke(path);
    const nr = nr0 ?? r * .16 * lerp(1, .82, e), list = cen ? [cen] : (e < .02 ? [[0, 0]] : [[-c * .8, 0], [c * .8, 0]]);
    for (const [nx, ny] of list) {
      ctx.fillStyle = E.rad(ctx, nx, ny - r * .04, nr, [[0, rgba(P.core0, .9)], [.75, rgba(P.core1, .5)], [1, rgba(P.halo0, .2)]]);
      ctx.beginPath(); ctx.arc(nx, ny - r * .04, nr, 0, 6.29); ctx.fill(); ctx.strokeStyle = rgba(P.shade0, .45); ctx.lineWidth = Math.max(1, r * .012); ctx.stroke();
    }
    ctx.restore();
  }
  // a cheaper body for the many small cells (no blur passes): warm gradient + a soft halo
  function cheapBody(ctx, path, gx, gy, R, a) {
    ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = E.rad(ctx, gx, gy, R, [[0, P.core0], [.18, P.core1], [.45, P.halo0], [.85, P.halo1], [1, mixHex(P.halo1, P.shade0, .45)]]); ctx.fill(path);
    ctx.restore();
  }

  // the two quotation marks: ball centres of mark side (L opening / R closing), tails grow 0..1; sink 0..1 drops it below its line
  function mark(ctx, t, cx, cy, rb, dir, grow, o = {}) {
    const gap = rb * 1.12, sink = clamp(o.sink ?? 0), br = 1 + .015 * Math.sin(t * 1.3 + 9.6), r = rb * br;
    ctx.save();
    if (sink > 0) { const top = cy - rb * 3.4, base = cy + rb * 2.6; ctx.beginPath(); ctx.rect(cx - rb * 6, top - rb * 2, rb * 12, base - top + rb * 2); ctx.clip(); ctx.translate(0, expoIn(sink) * (base - top + rb)); }
    const fadeN = 1 - clamp(grow * 1.5);
    for (const sd of [-1, 1]) {
      const bx = cx + sd * gap, path = C.dropPath(bx, cy, r, grow * .82, dir);
      // the drop's light: exactly the daughter's gradient (centre a little above the ball), so the hand-over from the cell is seamless
      C.lightBody(ctx, path, t, { g: { x: bx, y: cy - .15 * 2 * r * .97, R: .75 * 2 * r }, blurR: .75 * 2 * r, lit: 1 });
      if (fadeN > 0) {
        ctx.save(); ctx.strokeStyle = rgba(P.cream, .55 * fadeN); ctx.lineWidth = Math.max(1.2, r * .018); ctx.beginPath(); ctx.arc(bx, cy, r, 0, 6.29); ctx.stroke();
        const nr = r * .16; ctx.fillStyle = E.rad(ctx, bx, cy - r * .04, nr, [[0, rgba(P.core0, .9)], [.75, rgba(P.core1, .5 * fadeN + .5 * (1 - fadeN))], [1, rgba(P.halo0, .2 * fadeN)]]);
        ctx.beginPath(); ctx.arc(bx, cy - r * .04, nr, 0, 6.29); ctx.fill(); ctx.strokeStyle = rgba(P.shade0, .45 * fadeN); ctx.lineWidth = Math.max(1, r * .012); ctx.stroke(); ctx.restore();
      }
    }
    ctx.restore();
  }

  // ------------------------------------------------------------------------------------------------ the sticky note
  function note(ctx, t, px, o) {
    // px = pin x; the note stands above the bar on a short ink thread, unfolds upward from the thread (u), rot about the pin
    const u = smooth(clamp(o.u)), w = NOTE.w, h = NOTE.h * u, top = BAR.y - NOTE.gapY - NOTE.h;
    if (u <= 0) return;
    ctx.save(); ctx.translate(px, BAR.y); ctx.rotate(o.rot ?? 0); ctx.scale(o.sc ?? 1, o.sc ?? 1); ctx.translate(-px, -BAR.y + (o.lift ?? 0));
    // thread
    ctx.strokeStyle = rgba(F.INK, .9); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px, BAR.y - 4); ctx.lineTo(px, BAR.y - NOTE.gapY * Math.min(1, u * 1.4)); ctx.stroke();
    const y0 = BAR.y - NOTE.gapY - h;
    const p = new Path2D(); p.roundRect(px - w / 2, y0, w, h, 4);
    E.glowFill(ctx, p, 60, .45, P.blue0); E.glowFill(ctx, p, 12, .35, P.halo1);
    ctx.fillStyle = E.lin(ctx, 0, y0, 0, y0 + h, [[0, mixHex(P.core1, P.halo2, .25)], [1, mixHex(P.halo2, P.halo1, .6)]]); ctx.fill(p);
    ctx.fillStyle = rgba(P.shade0, .5); ctx.fillRect(px - w / 2, y0 + h - 2, w, 2);
    ctx.fillStyle = rgba(P.shade0, .18); ctx.fillRect(px - w / 2, y0, w, Math.min(h, 22));     // the glued strip
    if (u > .98) {
      const wr = (str, x, y, size, k, col = F.INK) => {
        if (k <= 0) return; ctx.save(); ctx.font = `600 ${size}px Inter`; const tw = ctx.measureText(str).width;
        ctx.beginPath(); ctx.rect(x - 2, y - size * 1.05, (tw + 4) * clamp(k), size * 1.4); ctx.clip(); ctx.fillStyle = col; ctx.fillText(str, x, y); ctx.restore();
      };
      const lx = px - w / 2 + 30, eW = F.measure('END ', 50, false), yW = F.measure('2025', 50, false);
      wr('FIRST TESTS', lx, top + 70, 30, o.w1);
      wr('IN PEOPLE', lx, top + 108, 30, o.w2);
      wr('END 2025', lx, top + 180, 50, o.w3);
      if (o.strike > 0) { ctx.strokeStyle = F.INK; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(lx + eW - 6, top + 163); ctx.lineTo(lx + eW - 6 + (yW + 12) * clamp(o.strike), top + 163 - 6 * clamp(o.strike)); ctx.stroke(); }
      wr('2026', lx + eW, top + 238, 50, o.w4, mixHex(F.INK, P.shade0, .2));
    }
    ctx.restore();
  }

  // ------------------------------------------------------------------------------------------------ draw
  function draw(ctx, t) {
    if (t < t1) { plateDivide(ctx, t); return; }
    const c = camQ(t);
    C.nightBg(ctx);
    // the plate's cool dust stays (far card: it parallaxes once the camera moves); it thins as the plain arrives
    card(ctx, c, 5200, () => E.dust(ctx, 198, 520, 960, 540, 900, 460, t, .45 * (1 - smooth(span(t, tScatter - 1, tLand))), F.COOL_HI));
    // the plain's world grows round the scattering cells (horizon, ground, sky glow): drawn by the plain set itself
    const grow = span(t, tDiv[4], tLand);
    if (grow > 0) PL.world(ctx, t, c, { grow, lights: 0 });
    card(ctx, c, F0, () => {
      quote(ctx, t); sheets(ctx, t); calendar(ctx, t); clock(ctx, t);
    });
  }

  // 7.01 · 7.02 · the division → the marks; the quote
  const tSplit = [t1, t1 + .85], tPart = [tSplit[1], tSplit[1] + 1.0], tTravel = [tPart[1], tPart[1] + 1.45], tSub = [tTravel[1], tTravel[1] + .9], tTail = [tSub[1] - .2, tSub[1] + .7];
  const MKpos = (t, side) => {
    // marks: until 7.03 at the quote; then they frame the sheets; the closing one pushes on "below"
    const base = MK[side];
    const fr = side === 'L' ? [shX0 - 70, 520] : [shX0 + SH.n * SH.w + (SH.n - 1) * SH.gap + 70, 520];
    const k = sineIO(span(t, a.andthen + .35, a.probably + .3));
    let x = lerp(base[0], fr[0], k), y = lerp(base[1], fr[1], k) - Math.sin(Math.PI * k) * 40 * (side === 'L' ? 1 : -1);
    if (side === 'R') x -= press(t);
    return [x, y];
  };
  // how far the closing mark has pushed the stack (px); it gives, then the five resist (a small spring back)
  const PUSH = 120;
  const press = (t) => PUSH * quartIO(span(t, a.below - .1, a.five + .1)) - 14 * Math.sin(Math.PI * span(t, a.five + .05, a.years + .9)) * (1 - span(t, a.years + .9, a.years + 1.2)) - 8 * smooth(span(t, a.five + .3, a.years + .6));
  function quote(ctx, t) {
    // the big division (from the plate) → two daughters → each splits into two drops → tails
    const sinkM = span(t, a.even - .05, a.even + .5);
    if (t < tSub[0]) {
      const s = lerp(.8, 1, sineIO(span(t, tSplit[0], tSplit[1]))), m = sineIO(span(t, tPart[0], tPart[1]));
      const tr = sineIO(span(t, tTravel[0], tTravel[1]));
      const y = DIVIDE.y + 4 * E.drift(t, 1, 5), rot = DIVIDE.rot + .01 * E.drift(t * .5, 1, 9);
      if (s < 1 && m <= 0) { F.cell(ctx, DIVIDE.x, y, DIVIDE.r, t, { split: s, rot, dust: 500 }); return; }
      if (tr <= 0) { division(ctx, t, { x: DIVIDE.x, y, r: DIVIDE.r, rot, s: 1, m, sep: 300, rc: DIVIDE.r * .55, dust: 500, dustA: 1 - m }); return; }
      // daughters travel to the mark places, shrinking (from radius rc to the radius of the drop pair)
      const rd0 = DIVIDE.r * .55, rd1 = RB * 2.05, rr = Math.exp(lerp(Math.log(rd0), Math.log(rd1), tr));
      for (const [sd, side] of [[-1, 'L'], [1, 'R']]) {
        const st = [DIVIDE.x + sd * 300 * Math.cos(rot), y + sd * 300 * Math.sin(rot)], en = MK[side];
        const x = lerp(st[0], en[0], tr), yy = lerp(st[1], en[1], tr) + Math.sin(Math.PI * tr) * (side === 'L' ? -60 : 60);
        division(ctx, t, { x, y: yy, r: rr, rot: 0, s: 0, m: 0, ph: 9.6, dust: 120, dustA: smooth(tr), seed: side === 'L' ? 61 : 62 });
      }
      return;
    }
    for (const [side, dir] of [['L', 1], ['R', -1]]) {
      const [x, y] = MKpos(t, side), ss = span(t, tSub[0], tSub[0] + .55), sm = sineIO(span(t, tSub[0] + .45, tSub[1]));
      const grow = sineIO(span(t, tTail[0], tTail[1]));
      if (sm < 1) division(ctx, t, { x, y, r: RB * 2.05, rot: 0, s: sineIO(ss), m: sm, sep: RB * 1.12, rc: RB, ph: 9.6, dust: 120, dustA: 1 - smooth(ss), seed: dir > 0 ? 61 : 62 });
      else mark(ctx, t, x, y, RB, dir, grow, { sink: sinkM });
    }
    // text: date + meeting line, the source, the quote lines (word-timed), all sink on "And then"
    const out = expoIn(span(t, a.andthen - .1, a.andthen + .45));
    const uD = smooth(span(t, a.june + .5, a.june + 1.4)) * (1 - out), uM = smooth(span(t, a.artif + .1, a.artif + 1.0)) * (1 - out);
    if (uD > 0) F.maskLine(ctx, [['JUNE 2026', 0]], QX, 296, 32, uD, { serif: false, col: P.cream, glow: false, weight: 600 });
    const dW = F.measure('JUNE 2026', 32, false);
    if (uM > 0) F.maskLine(ctx, [['  ·  ARTIFICIAL INTELLIGENCE & SCIENCE', 0]], QX + dW, 296, 32, uM, { serif: false, col: P.halo2, glow: false, weight: 600 });
    const lineT = [a.ithink, a.large, a.but, a.clinical];
    for (let i = 0; i < 4; i++) {
      const u = smooth(span(t, lineT[i] - .08, lineT[i] + .7)) * (1 - expoIn(span(t, a.andthen - .1 + i * .05, a.andthen + .4 + i * .05)));
      if (u <= 0) continue;
      const [s, g] = QL[i];
      const segs = typeof g === 'string' ? [[s, 0], [g, smooth(span(t, a.compression - .05, a.compression + .6))]] : [[s, 0]];
      F.maskLine(ctx, segs, QX, LY[i], QS, u);
    }
    F.source15(ctx, 'GLP-1 researcher · Anthropic event · June 2026', QX, 790, smooth(span(t, a.researcher + .15, a.researcher + 1.1)) * (1 - out), { size: 24 });
  }

  // 7.03 · five year-sheets between the marks
  const sheetRect = (t, i) => {
    const grow = expoOut(span(t, a.probably + .05 + i * .09, a.probably + .75 + i * .09));
    const pr = press(t), gap = lerp(SH.gap, 7, clamp(pr / PUSH)), w = lerp(SH.w, SH.w * .96, clamp(pr / PUSH));
    const right = shX0 + SH.n * SH.w + (SH.n - 1) * SH.gap - pr, x = right - (SH.n - i) * w - (SH.n - 1 - i) * gap;
    return { x: Math.max(shX0 + i * (w + 4), x), y: SH.base - SH.h * grow, w, h: SH.h * grow, lean: -.035 * clamp(pr / PUSH) * (i / 4), grow };
  };
  const cellRect = (i) => ({ x: BAR.x0 + i * BAR.cw + 3, y: BAR.y - BAR.h / 2, w: BAR.cw - 6, h: BAR.h });
  function sheets(ctx, t) {
    if (t < a.probably || t > a.dates + 1) return;
    for (let i = 0; i < SH.n; i++) {
      const s = sheetRect(t, i); if (s.grow <= 0) continue;
      const k = quartIO(span(t, a.even + .05 + i * .07, a.even + 1.25 + i * .07));
      if (k >= 1) continue;   // the calendar draws it from here
      const b = cellRect(i), x = lerp(s.x, b.x, k), w = lerp(s.w, b.w, k), h = lerp(s.h, b.h, k), y = lerp(s.y, b.y, k) - Math.sin(Math.PI * k) * 70;
      C.sheet(ctx, x, y, w, h, { rot: s.lean * (1 - k) + .12 * Math.sin(Math.PI * k) * (i - 2) / 2, cool: .4 * k, glow: 1 - .4 * k, ink: (ww, hh) => {
        if (k > .5) return;
        ctx.save(); ctx.font = `${Math.round(60 * (1 - k * 1.6))}px "Instrument Serif"`; ctx.textAlign = 'center'; ctx.fillStyle = rgba(F.INK, .9 * (1 - k * 2)); ctx.fillText(String(i + 1), ww / 2, Math.min(hh, 74)); ctx.restore();
      } });
    }
    const uB = smooth(span(t, a.five - .02, a.five + .8)) * (1 - expoIn(span(t, a.even - .1, a.even + .4)));
    if (uB > 0) F.maskLine(ctx, [['below ', 0], ['5', 1], [' years?', 0]], 960, 806, 84, uB, { align: 'center' });
  }

  // 7.04 · the calendar bar, the note; 7.05 · it draws itself into its pin
  function calendar(ctx, t) {
    if (t < a.even) return;
    const ret = sineIO(span(t, a.failure - .3, a.biology - .15));          // the bar retracts into the pin (biology)
    if (ret >= 1) return;
    const pinX = lerp(PIN0, PIN1, sineIO(span(t, a.moved - .1, a.moved + .9)));
    for (let i = 0; i < SH.n; i++) {
      const k = quartIO(span(t, a.even + .05 + i * .07, a.even + 1.25 + i * .07)); if (k < 1) continue;
      const b = cellRect(i), x0 = lerp(b.x, pinX, ret), x1 = lerp(b.x + b.w, pinX, ret);
      if (x1 - x0 < 1) continue;
      const skipped = i === 2 ? smooth(span(t, a.moved + .2, a.moved + 1.1)) : 0;   // the year the goal slid over glows a little warmer
      C.sheet(ctx, x0, b.y, x1 - x0, b.h, { cool: .4 - .35 * skipped, glow: .6 + .3 * skipped });
      const uY = smooth(span(t, a.dates - .25 + i * .07, a.dates + .5 + i * .07)) * (1 - expoIn(span(t, a.that - .1, a.that + .35)));
      if (uY > 0) F.maskLine(ctx, [[BAR.years[i], 0]], b.x + b.w / 2, BAR.y + 72, 36, uY, { serif: false, align: 'center', col: i === 2 ? P.cream : mixHex(P.cream, F.COOL, .5), glow: false, weight: 600 });
    }
    // the pin (gold) at the end of the year the tests were promised for
    const uN = span(t, a.one + .1, a.one + .8);
    if (uN > 0) {
      const pinR = 7 * expoOut(uN);
      const lift = -46 * Math.sin(Math.PI * span(t, a.moved - .2, a.moved + 1.05)), rot = .1 * Math.sin(Math.PI * span(t, a.moved - .25, a.moved + 1.1)) - .03 * Math.sin(Math.PI * 2 * span(t, a.moved + .8, a.moved + 1.6)) * (1 - span(t, a.moved + 1.6, a.moved + 2));
      const absorb = sineIO(span(t, a.failure - .2, a.biology - .3));
      note(ctx, t, pinX, {
        u: span(t, a.one + 1.15, a.one + 2.0), lift, rot: rot + absorb * .6, sc: 1 - absorb,
        w1: span(t, a.test - .1, a.test + .5), w2: span(t, a.inpeople - .05, a.inpeople + .45), w3: span(t, a.endof - .05, a.tf + .3),
        strike: span(t, a.moved + 1.0, a.moved + 1.35), w4: span(t, a.tsix - .2, a.tsix + .4),
      });
      if (ret < .98) E.halo(ctx, pinX, BAR.y, 26, .5 * expoOut(uN), P.halo1, P.core0);
      ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(pinX, BAR.y, pinR * (1 - ret * .3), 0, 6.29); ctx.fill();
    }
    F.source15(ctx, 'Reuters · Jan 2026', 960, BAR.y + 128, smooth(span(t, a.tsix + .4, a.tsix + 1.3)) * (1 - expoIn(span(t, a.that - .1, a.that + .4))), { align: 'center', size: 24 });
  }

  // 7.05 · 7.06 · the pin swells into a cell and divides on a beat; then the cells scatter onto the plain
  function clock(ctx, t) {
    if (t < a.failure) return;
    const sw = expoOut(span(t, a.failure + .3, a.biology + .2));
    if (sw <= 0) return;
    // which generation is dividing now
    let g = -1; for (let k = 0; k < G; k++) if (t >= tDiv[k]) g = k;
    const sc = span(t, tScatter, tLand);
    const nodes = g < 0 ? NODES[0] : NODES[g];
    const p = g < 0 ? 0 : span(t, tDiv[g], tDiv[g] + DUR);            // 0..1 of this division: split 0..1 then part 0..1
    const s = sineIO(span(p, 0, .5)), m = sineIO(span(p, .5, 1));
    if (g >= G - 1 && p >= 1) {   // all 64 are round: they scatter to their lights
      LEAF.forEach((n, i) => {
        const L = LIGHTS[leafTo[i]], d = Math.hypot(L[0] - CC.x, L[1] - CC.y), k = sineIO(span(sc, d / 2600 * .35, .65 + d / 2600 * .35));
        const x = lerp(n.x, L[0], k), y = lerp(n.y, L[1], k) - Math.sin(Math.PI * k) * 40, r = Math.exp(lerp(Math.log(n.r), Math.log(L[2]), k));
        PL.light(ctx, t, x, y, r, k, n.r);
      });
      return;
    }
    nodes.forEach((n, i) => {
      const r = g < 0 ? CC.r * sw : n.r;
      const cheap = g >= 3, dust = 0;
      if (g < 0 || p <= 0) division(ctx, t, { x: n.x, y: n.y, r, rot: n.rot, s: 0, m: 0, cheap, dust, seed: 70 + i, glow: cheap ? 0 : 1, worldUp: true });
      else {
        const kids = NODES[g + 1];
        const sep = Math.hypot(kids[2 * i].x - n.x, kids[2 * i].y - n.y);
        const outs = division(ctx, t, { x: n.x, y: n.y, r, rot: n.rot, s, m, sep, rc: kids[2 * i].r, cheap, dust, seed: 70 + i, glow: cheap ? 0 : 1, worldUp: true, kidRot: true });
        if (cheap) { const k = smooth(m); if (k < 1) E.halo(ctx, n.x, n.y, r * 2.4, .3 * (1 - k), P.halo1, P.core1); if (m > 0) outs.forEach(([ox, oy], j) => E.halo(ctx, ox, oy, kids[2 * i + j].r * 2.4, .3 * k, P.halo1, P.core1)); }
        return;
      }
      if (cheap) E.halo(ctx, n.x, n.y, r * 2.4, .3, P.halo1, P.core1);
    });
  }

  return { draw, a, t1, tEnd: PL.t0 };
}
