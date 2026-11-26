// Film 41 · c03 · stop 1, the screen (B1) · 'For Gates, the first work' → "That's the usual comfort" (docs/shots.md 2.01–2.12)
// The c02 draw hands over to this draw at k.from (107.95 s, the timeline already in its corner) so the c02 → c03 cut is between two
// identical frames; this draw hands over to the c04 draw (sc04.mjs) at k.hand (the timeline big, before 2.12).
//   2.01 a gold line drops from NOW into the night office, runs along the front desks, the screens switch on outward from the impact:
//   SCREEN WORK · 2.02 a slow push; PHONE SALES / PHONE SUPPORT / ACCOUNTING type onto the three front screens · 2.03 cyan floods
//   them, their people lean back (hands behind the head): CHEAPER · FASTER · MORE ACCURATE · 2.04 the office sinks, the three cold
//   screens fall into the panes of a bus shelter; the NOW dot flies down from the timeline and becomes the stop sign; young people
//   with folders rise at the curb · 2.05 ★ the pole becomes the y axis, the curb the x axis, the sign the NOW end; the line falls and
//   the gap counts to −19 % · 2.06 2025 −13 % → 2026 −19 % · 2.07 the axes fold back into the stop, the end dot becomes you; the
//   timeline's you-dot drops onto your shoulder · 2.08 the chart returns and splits into two lanes · 2.09 REPLACING / ALONGSIDE
//   · 2.10 the lane rules become the baselines of THE MACHINE ALONE DOESN'T DECIDE / HOW IT'S USED DOES · 2.11 the timeline big,
//   SCREEN WORK under NOW → the c04 draw.
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f41_kit.mjs';
import * as S from '../lib/f41_world.mjs';
import { buildC04 } from './sc04.mjs';
import { lab, gs } from './sc04.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, lin } = E;
const { GOLD, CREAM, CREAM2, MACH, AMBER, SOURCES: SRC } = F;
const TAU = Math.PI * 2;
const bumpT = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));

const CACHE = new WeakMap();
export function buildC03(T) {
  if (CACHE.has(T)) return CACHE.get(T);
  const G = (p, after = -1) => T.G(p, 0, after);
  const k = {};
  k.start = G('For Gates, the first work'); k.from = k.start - .46; k.firstW = G('first work', k.start); k.toGo = G('to go', k.start); k.screenW = G('screen', k.start);
  k.names = G('He names it'); k.sales = G('Phone sales'); k.support = G('Phone support'); k.acc = G('Accounting', k.support);
  k.ai = G('Artificial intelligence, he says'); k.cheaper = G('cheaper', k.ai); k.faster = G('faster', k.cheaper); k.more = G('more accurately', k.faster);
  k.group = G('For one group'); k.thisStop = G('this stop is already', k.group); k.already = G('already', k.thisStop); k.data = G('data', k.already);
  k.young = G('Young people, looking'); k.peopleW = G('people', k.young); k.first = G('first job', k.young); k.job = G('job', k.first + .1);
  k.inThe = G('In the jobs most exposed'); k.exposed = G('exposed', k.inThe); k.employment = G('employment has fallen', k.inThe); k.fallen = G('fallen', k.employment);
  k.nineteen = G('nineteen percent', k.inThe); k.percent = G('percent', k.nineteen); k.behind = G('behind people', k.inThe); k.sameAge = G('same age', k.behind); k.less = G('less exposed', k.sameAge);
  k.gapS = G('And the gap is still'); k.gapW = G('gap', k.gapS); k.still = G('still', k.gapW); k.growing = G('growing', k.still);
  k.ifYou = G("If that's you"); k.you = G('you', k.ifYou + .2); k.stopW = G('stop', k.you); k.isnt = G("isn't", k.stopW); k.ahead = G('ahead', k.isnt);
  k.standing = G("You're standing in it"); k.standW = G('standing', k.standing); k.inIt = G('in it', k.standW); k.itW = G('it', k.inIt + .05);
  k.sameData = G('But the same data'); k.data2 = G('data', k.sameData); k.shows = G('shows', k.data2); k.else = G('something else', k.sameData);
  k.where = G('Where the technology works'); k.works = G('works', k.where); k.alongside = G('alongside', k.where); k.replacing = G('replacing', k.alongside); k.holds = G('holds steady', k.replacing); k.steady = G('steady', k.holds); k.grows = G('grows', k.steady);
  k.alone = G('So the machine alone'); k.machW = G('machine', k.alone); k.aloneW = G('alone', k.machW); k.doesnt = G("doesn't decide", k.aloneW); k.decide = G('decide', k.doesnt);
  k.how = G("How it's used does"); k.its = G("it's", k.how); k.used = G('used', k.its); k.does = G('does', k.used);
  k.fs = G('So the first stop is the screen'); k.screen2 = G('screen', k.fs);
  k.hand = G('Which sounds like good news') - .4;
  const c04 = buildC04(T).draw;

  // ------------------------------------------------------------------ THE NIGHT OFFICE (2.01–2.03)
  const ROWS = [
    { y: 462, s: .42, xs: Array.from({ length: 9 }, (_, i) => 250 + i * 177), who: [1, 4, 6] },
    { y: 556, s: .62, xs: Array.from({ length: 6 }, (_, i) => 330 + i * 252), who: [0, 3, 5] },
    { y: 724, s: 1, xs: [480, 960, 1440], who: [0, 1, 2] },
  ];
  const DROP = F.timelinePt(0), IMP = [DROP[0], 724];
  const onAt = (x, y) => k.start + .12 + Math.hypot(x - IMP[0], (y - IMP[1]) * 2.4) / 1500;   // a screen switches on as the impact reaches it
  const push = (t) => 1 + .07 * sineIO(span(t, k.names - .2, k.ai + 4.6));
  const PUSHC = [960, 640];
  const scr = (x, y, s) => ({ x: x - 115 * s, y: y - 16 * s - 140 * s, w: 230 * s, h: 140 * s });
  const coldOf = (t, i) => sineIO(span(t, k.ai + .25 + i * .2, k.ai + 1.05 + i * .2));
  const leaveOff = (t) => sineIO(span(t, k.group - .7, k.group + .9));   // the room sinks away (slower: no lurch)
  const FRONT_WORDS = [[SRC.screenJobs[0], 'sales'], [SRC.screenJobs[1], 'support'], [SRC.screenJobs[2], 'acc']];
  function office(ctx, t) {
    if (t < k.from || t > k.group + .9) return;
    const z = push(t), off = leaveOff(t);
    ctx.save(); ctx.globalAlpha *= span(t, k.from - .01, k.from + .7) * (1 - .75 * off);   // the dark room comes up after the cut (no pop); its lights go down as it sinks
    ctx.translate(PUSHC[0], PUSHC[1]); ctx.scale(z, z); ctx.translate(-PUSHC[0], -PUSHC[1]);
    // the floor: a faint perspective of the room (dark), lit by the screens
    const lit = span(t, k.start + .1, k.start + 1.4);
    ctx.fillStyle = lin(ctx, 0, 420, 0, H, [[0, rgba(P.ind1, 0)], [.3, rgba(mixHex(P.night1, P.ind1, .5), .7 * lit)], [1, rgba(P.night0, .9 * lit)]]); ctx.fillRect(-100, 420 + off * 700, W + 200, H);
    ROWS.forEach((row, ri) => {
      const dy = off * (700 - ri * 60);
      row.xs.forEach((x, i) => {
        const s = row.s, y = row.y + dy, on = expoOut(span(t, onAt(x, row.y), onAt(x, row.y) + .45)), front = ri === 2, cold = front ? coldOf(t, i) : 0;
        const flying = front && t >= k.group - .1;   // from here the three front screens are drawn by fallScreens() (desk and person sink with the room)
        const b = scr(x, front ? row.y : y, s);
        // the screen's glow on the room
        if (on > 0 && !flying) halo(ctx, x, b.y + b.h / 2, 240 * s, .28 * on, cold > .5 ? MACH.halo : AMBER.body, cold > .5 ? MACH.core : AMBER.core);
        // desk slab + stand
        ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.fillRect(x - 175 * s, y, 350 * s, 18 * s);
        ctx.fillStyle = rgba(mixHex(AMBER.body, MACH.body, cold), .55 * on); ctx.fillRect(x - 175 * s, y, 350 * s, 2.5 * s);
        ctx.fillStyle = mixHex(P.night1, P.ind2, .5); ctx.fillRect(x - 8 * s, b.y + b.h, 16 * s, 16 * s);
        if (!flying) screen(ctx, t, b, on, cold, front ? FRONT_WORDS[i] : null);
        // a person at it (from behind): chair back hides the lower body
        if (row.who.includes(i)) {
          const px = x - 14 * s, fy = y + 172 * s, back = front ? cold : 0, lean = sineIO(back);
          ctx.save(); ctx.globalAlpha *= .35 + .65 * on;
          E.person(ctx, px, fy - 10 * s * lean, 236 * s, { rim: mixHex(AMBER.body, MACH.body, cold), light: -1, armR: [lerp(.2, 2.45, lean), lerp(.1, -2.25, lean)], armL: [lerp(-.2, -2.45, lean), lerp(-.1, 2.25, lean)], look: .2 * lean });
          ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.beginPath(); ctx.roundRect(px - 52 * s, y + 26 * s, 104 * s, 140 * s, 14 * s); ctx.fill();
          ctx.strokeStyle = rgba(P.blue1, .6); ctx.lineWidth = 2 * s; ctx.stroke();
          ctx.restore();
        }
      });
    });
    ctx.restore();
  }
  function screen(ctx, t, b, on, cold, word) {   // on: switches on from a bright middle line (an old monitor) · cold: cyan floods from below
    ctx.save();
    ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.beginPath(); ctx.roundRect(b.x - 4, b.y - 4, b.w + 8, b.h + 8, 6); ctx.fill();
    if (on > 0) {
      const hh = b.h * Math.max(.04, on), yy = b.y + (b.h - hh) / 2;
      ctx.beginPath(); ctx.rect(b.x, yy, b.w, hh); ctx.clip();
      ctx.fillStyle = lin(ctx, 0, b.y, 0, b.y + b.h, [[0, mixHex(AMBER.core, AMBER.hot, .3)], [1, mixHex(AMBER.body, AMBER.shade, .35)]]); ctx.fillRect(b.x, b.y, b.w, b.h);
      if (cold > 0) { const ch = b.h * cold; ctx.fillStyle = lin(ctx, 0, b.y + b.h - ch, 0, b.y + b.h, [[0, MACH.core], [.3, MACH.hot], [1, MACH.mid]]); ctx.fillRect(b.x, b.y + b.h - ch, b.w, ch);
        ctx.fillStyle = rgba(MACH.core, .9); ctx.fillRect(b.x, b.y + b.h - ch, b.w, 2); }
      if (!word) {   // a few lines of work on the screen
        ctx.fillStyle = rgba(AMBER.shade, .45); for (let j = 0; j < 3; j++) ctx.fillRect(b.x + b.w * .12, b.y + b.h * (.25 + j * .2), b.w * (.5 + .25 * ((j * 7) % 3) / 2), Math.max(1.5, b.h * .05));
      } else {
        const tw = k[word[1]], u = span(t, tw - .2, tw + .45);
        ctx.fillStyle = rgba(AMBER.shade, .4 * (1 - u)); for (let j = 0; j < 3; j++) ctx.fillRect(b.x + b.w * .12, b.y + b.h * (.25 + j * .2), b.w * .6, Math.max(1.5, b.h * .05));
        if (u > 0) F.heavy(ctx, word[0], b.x + b.w / 2, b.y + b.h * .62, Math.min(34, b.w / (word[0].length * .62)), u, { align: 'center', col: mixHex(P.night1, MACH.deep, cold), glow: false, out: span(t, k.group - .75, k.group - .2) });   // the job names drop before the glass flies
        if (u > 0) { const fl = bumpT(t, tw - .05, .5); if (fl > 0) halo(ctx, b.x + b.w / 2, b.y + b.h / 2, b.w * .8, .35 * fl, GOLD.halo, GOLD.core); }
      }
    }
    ctx.restore();
  }
  function dropLine(ctx, t) {   // the gold line from NOW down to the front desks, then along them
    const d = span(t, k.from - .4, k.start + .06) ** 1.5, sp = expoOut(span(t, k.start + .06, k.start + .9)), fade = 1 - span(t, k.start + .9, k.start + 1.8);
    if (d <= 0 || fade <= 0) return;
    const y = lerp(DROP[1] + 20, IMP[1], d);
    gs(ctx, [[DROP[0], DROP[1] + 20], [DROP[0], y]], 0, 1, { w: 2.4, a: fade * (1 - sp * .7), spark: d < 1 });
    if (d < 1) halo(ctx, DROP[0], y, 70, .5 * Math.min(1, d * 8) * (1 - d * d), GOLD.halo, GOLD.core);   // lead: the falling head glows (the drop reads as moving through the seam)
    if (sp > 0) { gs(ctx, [[IMP[0], IMP[1]], [lerp(IMP[0], 110, sp), IMP[1]]], 0, 1, { w: 2.4, a: fade, spark: false }); gs(ctx, [[IMP[0], IMP[1]], [lerp(IMP[0], W - 110, sp), IMP[1]]], 0, 1, { w: 2.4, a: fade, spark: false });
      halo(ctx, IMP[0], IMP[1], 120, .7 * bumpT(t, k.start + .04, .5), GOLD.halo, GOLD.core); }
  }

  // ------------------------------------------------------------------ THE BUS STOP (2.04, 2.07) and the chart (2.05, 2.06, 2.08)
  const PANES = [0, 1, 2].map((i) => ({ x: 545 + i * 162, y: 540, w: 150, h: 228 })), CURB = 790, POLE = [1330, 452], SIGN_R = 48;
  const YOUNG = [{ x: 640, h: 194 }, { x: 772, h: 206 }, { x: 896, h: 186 }, { x: 1112, h: 200 }];
  const YOU = { x: 1214, h: 196 };
  // the chart (honest: the gap to same-age peers in less exposed jobs, 0 = the peers; three known points: late 2022, 2025, 2026)
  const CH = { x0: 300, x1: 1560, y0: 300, ya: 760, yr0: 2022, yr1: 2026.85 };
  const cx = (yr) => CH.x0 + (yr - CH.yr0) / (CH.yr1 - CH.yr0) * (CH.x1 - CH.x0), cy = (v) => CH.y0 + (-v) / 20 * 440;
  const PTS = [[2022.9, 0], [2025.6, -13], [2026.6, -19]];
  const lineAt = (u) => { const L = [0]; for (let i = 1; i < PTS.length; i++) L.push(L[i - 1] + Math.hypot(cx(PTS[i][0]) - cx(PTS[i - 1][0]), cy(PTS[i][1]) - cy(PTS[i - 1][1]))); const d = u * L[L.length - 1]; let i = 1; while (i < PTS.length - 1 && L[i] < d) i++; const f = clamp((d - L[i - 1]) / (L[i] - L[i - 1])); return [lerp(PTS[i - 1][0], PTS[i][0], f), lerp(PTS[i - 1][1], PTS[i][1], f)]; };
  const END = [cx(2026.6), cy(-19)];
  // phases: 0 bus (2.04) → 1 chart (2.05/2.06) → 0 bus (2.07) → 1 chart (2.08) → lanes
  const toChart = (t) => quartIO(span(t, k.inThe - .35, k.inThe + .65)) * (1 - quartIO(span(t, k.ifYou - .3, k.ifYou + .7))) + quartIO(span(t, k.sameData - .3, k.sameData + .6));
  const busOn = (t) => {   // how much of the bus stop stands (rises from the curb / sinks into it); 1st time the panes arrive by falling
    const a = (t >= k.group - .1 ? 1 : 0) * (1 - expoIn(span(t, k.inThe - .4, k.inThe + .3)));
    const b = expoOut(span(t, k.ifYou - .1, k.ifYou + .8)) * (1 - expoIn(span(t, k.sameData - .4, k.sameData + .3)));
    return Math.max(a, b);
  };
  function fallScreens(ctx, t) {   // the three cold front screens fall into the shelter's panes (2.04) and stay its glass
    const off = leaveOff(t); if (t < k.group - .1 || t > k.sameData + .5) return;
    const m = quartIO(span(t, k.group - .1, k.group + .9)), z = push(Math.min(t, k.group - .1)), sink = busOn(t);
    PANES.forEach((pn, i) => {
      const b0 = scr(ROWS[2].xs[i], ROWS[2].y, 1), zb = { x: (b0.x - PUSHC[0]) * z + PUSHC[0], y: (b0.y - PUSHC[1]) * z + PUSHC[1], w: b0.w * z, h: b0.h * z };
      let x = lerp(zb.x, pn.x, m), y = lerp(zb.y, pn.y, m) + 60 * Math.sin(Math.PI * m), w = lerp(zb.w, pn.w, m), h = lerp(zb.h, pn.h, m);
      if (m >= 1) { const hh = pn.h * sink; y = CURB - 22 - hh; h = hh; }
      if (h <= 1) return;
      halo(ctx, x + w / 2, y + h / 2, 220, .25 * Math.min(1, h / 80), MACH.halo, MACH.core);
      ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, rgba(MACH.hot, .85)], [1, rgba(MACH.mid, .75)]]); ctx.beginPath(); ctx.roundRect(x, y, w, h, 4); ctx.fill();
      ctx.strokeStyle = rgba(MACH.core, .8); ctx.lineWidth = 2; ctx.stroke();
    });
  }
  function busStop(ctx, t) {
    const on = busOn(t); if (on <= 0) return;
    ctx.save(); ctx.beginPath(); ctx.rect(-50, -50, W + 100, CURB + 50); ctx.clip();
    // roof and bench (they rise from the curb with the panes)
    // the roof grows out sideways from the landed panes (1st time) / rises with them (2nd time)
    const rw = t < k.ifYou - .5 ? expoOut(span(t, k.group + .8, k.group + 1.4)) : 1, rc = (PANES[0].x + PANES[2].x + PANES[2].w) / 2, hw = (PANES[2].x + PANES[2].w - PANES[0].x) / 2 + 30;
    const rx0 = rc - hw * rw, rx1 = rc + hw * rw, ry = CURB - 22 - 228 * on - 22;
    if (rw > 0) {
      ctx.fillStyle = mixHex(P.night1, P.blue1, .35); ctx.beginPath(); ctx.roundRect(rx0, ry, rx1 - rx0, 16, 6); ctx.fill();
      ctx.fillStyle = rgba(MACH.core, .5); ctx.fillRect(rx0, ry + 14, rx1 - rx0, 2);
      ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fillRect(rx0 + 10, ry, 10, CURB - ry); ctx.fillRect(rx1 - 20, ry, 10, CURB - ry);
    }
    // the young people with folders, rising from the curb (staggered), rim-lit warm
    const yo = (i) => {
      const a = expoOut(span(t, k.young - .2 + i * .12, k.young + .5 + i * .12)) * (1 - expoIn(span(t, k.inThe - .45, k.inThe + .25)));
      const b = expoOut(span(t, k.ifYou + .1 + i * .1, k.ifYou + .8 + i * .1)) * (1 - expoIn(span(t, k.sameData - .45, k.sameData + .25)));
      return Math.max(a, b);
    };
    YOUNG.forEach((p, i) => {
      const u = yo(i); if (u <= 0) return;
      const y = CURB + (1 - u) * (p.h + 20), sway = .02 * Math.sin(t * .8 + i * 1.7);
      halo(ctx, p.x, y - p.h * .5, p.h, .15 * u, AMBER.body, AMBER.core);
      const hd = E.person(ctx, p.x, y, p.h, { rim: AMBER.body, armR: [.55, -.2], armL: [-.15 - sway, -.08], look: .1 + sway * 3, dir: i % 2 ? -1 : 1 });
      const [fx, fy] = hd.R; ctx.save(); ctx.translate(fx, fy); ctx.rotate(.15 * (i % 2 ? -1 : 1)); ctx.fillStyle = mixHex(CREAM, AMBER.hot, .25); ctx.fillRect(-14, -30, 28, 36); ctx.fillStyle = rgba(AMBER.shade, .5); ctx.fillRect(-9, -22, 18, 2); ctx.fillRect(-9, -15, 14, 2); ctx.restore();
    });
    ctx.restore();
  }
  // the pole / y axis, the curb / x axis, the sign / the NOW end (one set of lines that morphs between the two pictures)
  function frame(ctx, t) {
    const tc = toChart(t), inBus = busOn(t), lanes = quartIO(span(t, k.else - .2, k.else + .8));
    if (t < k.group + .2 || t > k.alone + .8) return;
    // the sign arrives from the timeline's NOW (2.04), later sits at the chart's end
    const fly = quartIO(span(t, k.group + .5, k.thisStop + .45)), tp = F.timelinePt(0);
    let sx = lerp(tp[0], POLE[0], fly), sy = lerp(tp[1], POLE[1], fly) - 160 * Math.sin(Math.PI * fly), sr = lerp(7, SIGN_R, fly);
    const sx2 = lerp(sx, END[0] + 0, tc), sy2 = lerp(sy, CH.ya, tc); sr = lerp(sr, 9, tc);
    // pole → y axis
    const pu = sineIO(span(t, k.thisStop + .3, k.thisStop + .9));
    const p0 = [lerp(POLE[0], CH.x0, tc), lerp(POLE[1] + SIGN_R, CH.y0 - 40, tc)], p1 = [lerp(POLE[0], CH.x0, tc), lerp(CURB, CH.ya, tc)];
    const lan = 1 - lanes;
    ctx.save(); ctx.globalAlpha *= lan;
    if (pu > 0) { ctx.strokeStyle = rgba(CREAM, lerp(.75, .6, tc)); ctx.lineWidth = lerp(6, 2, tc); ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p0[0], lerp(p0[1], p1[1], pu)); ctx.stroke(); }
    // curb → x axis
    const cu = sineIO(span(t, k.thisStop + .6, k.thisStop + 1.5)), cxa = lerp(POLE[0], CH.x0, tc), x0 = lerp(lerp(cxa, 60, cu), CH.x0, tc), x1 = lerp(lerp(cxa, W - 60, cu), CH.x1, tc), yy = lerp(CURB, CH.ya, tc);
    if (cu > 0) { ctx.strokeStyle = rgba(CREAM, lerp(.35, .6, tc)); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(x1, yy); ctx.stroke();
      if (tc < 1) { ctx.fillStyle = lin(ctx, 0, yy, 0, H, [[0, rgba(P.night0, .5 * (1 - tc) * cu)], [1, rgba(P.night0, .8 * (1 - tc) * cu)]]); ctx.fillRect(-60, yy + 1, W + 120, H); } }
    ctx.restore();
    // the sign (NOW): gold rim, lights on 'stop' in 2.07
    if (fly > 0 && lan > 0) {
      const lit = bumpT(t, k.stopW - .1, 1.2) + .3 * span(t, k.thisStop, k.thisStop + .5);
      ctx.save(); ctx.globalAlpha *= lan; halo(ctx, sx2, sy2, sr * 3.4, .4 + .5 * lit, GOLD.halo, GOLD.core);
      ctx.fillStyle = mixHex(P.night1, GOLD.deep, .35 * (1 - tc)); ctx.beginPath(); ctx.arc(sx2, sy2, sr, 0, TAU); ctx.fill();
      ctx.strokeStyle = GOLD.line; ctx.lineWidth = lerp(2, 4, fly) * (1 - tc) + 2 * tc; ctx.stroke();
      if (tc > .5) { ctx.fillStyle = GOLD.core; ctx.beginPath(); ctx.arc(sx2, sy2, sr * .5, 0, TAU); ctx.fill(); }
      ctx.restore();
      if (sr > 30) F.heavy(ctx, 'NOW', sx2, sy2 + 11, 30 * span(sr, 30, SIGN_R), 1, { align: 'center', col: GOLD.text, gold: .6 * lit, glow: false });
      if (tc > .6 && lan > 0) lab(ctx, 'NOW', sx2, CH.ya + 40, span(tc, .7, 1) * lan, { size: 22, col: GOLD.text, align: 'center' });
    }
    return { tc };
  }
  function chart(ctx, t) {   // 2.05/2.06 (and its return in 2.08 before it folds into the lanes)
    const tc = toChart(t), lanes = quartIO(span(t, k.else - .2, k.else + .8)); if (tc <= .02 || lanes >= 1) return;
    const a = span(tc, .5, 1) * (1 - lanes);
    ctx.save(); ctx.globalAlpha *= a;
    // y ticks + labels (honest axis: 0 to −20 percentage points)
    for (const v of [0, -10, -20]) { ctx.strokeStyle = rgba(CREAM2, v ? .18 : 0); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(CH.x0, cy(v)); ctx.lineTo(CH.x1, cy(v)); ctx.stroke();
      lab(ctx, v ? `${v}%`.replace('-', '−') : '0', CH.x0 - 18, cy(v) + 8, 1, { size: 22, align: 'right' }); }
    for (let yr = 2023; yr <= 2026; yr++) { const x = cx(yr); ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, CH.ya); ctx.lineTo(x, CH.ya + 10); ctx.stroke(); lab(ctx, String(yr), x, CH.ya + 40, 1, { size: 22, align: 'center' }); }
    lab(ctx, 'EMPLOYMENT GAP, AGES 22–25 · PERCENT', CH.x0, CH.y0 - 58, span(t, k.inThe + .2, k.inThe + .8), { size: 22, col: CREAM });
    ctx.restore();
    // the peers: the 0 line (cream)
    const second = t > k.sameData - .5, pu = second ? 1 : sineIO(span(t, k.inThe + .3, k.inThe + 1.2));
    ctx.save(); ctx.globalAlpha *= a;
    ctx.strokeStyle = CREAM; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx(2022.9), cy(0)); ctx.lineTo(lerp(cx(2022.9), END[0], pu), cy(0)); ctx.stroke();
    lab(ctx, 'SAME AGE · LESS EXPOSED JOBS', END[0], cy(0) - 20, second ? 1 : span(t, k.sameAge - .3, k.sameAge + .3), { size: 22, col: CREAM, align: 'right' });
    // the young in the most exposed jobs (amber): falls on "employment has fallen … nineteen percent"
    const lu = second ? sineIO(span(t, k.sameData + .2, k.sameData + 1.1)) : sineIO(span(t, k.employment - .1, k.percent + .1));
    lab(ctx, SRC.gapSub, cx(2022.9) + 16, cy(0) + 44, second ? 1 : span(t, k.exposed - .2, k.exposed + .4), { size: 22, col: AMBER.hot });
    if (lu > 0) {
      const n = 60, pts = []; for (let i = 0; i <= n; i++) { const [yr, v] = lineAt(lu * i / n); pts.push([cx(yr), cy(v)]); }
      // the gap (gold, faint) between the two lines
      ctx.fillStyle = rgba(GOLD.body, .12 * span(lu, .2, 1)); ctx.beginPath(); ctx.moveTo(pts[0][0], cy(0)); pts.forEach((p) => ctx.lineTo(p[0], p[1])); ctx.lineTo(pts[n][0], cy(0)); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = AMBER.body; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
      const [hx, hy] = pts[n], [, hv] = lineAt(lu);
      halo(ctx, hx, hy, 40, .6, AMBER.body, AMBER.core); ctx.fillStyle = AMBER.hot; ctx.beginPath(); ctx.arc(hx, hy, 7, 0, TAU); ctx.fill();
      // ★ the gap counts: a gold span from the peers' line down to the head, the number beside it
      gs(ctx, [[hx, cy(0)], [hx, hy]], 0, 1, { w: 3, spark: false, a: span(lu, .1, .3) });
      const big = second ? 1 : span(t, k.nineteen - .15, k.percent + .2), val = Math.round(-hv);
      if (lu > .05 && !second) F.heavy(ctx, `−${val}%`, hx + 34, (cy(0) + hy) / 2 + 20 + 40 * big, lerp(46, 120, sineIO(big)), 1, { gold: .4 + .6 * big });
      if (second && lu > .6) F.heavy(ctx, SRC.gap, hx + 34, (cy(0) + hy) / 2 + 60, 120 * (1 - lanes), span(lu, .6, 1), { gold: 1 });   // the number waits for the line
    }
    // 2.06: 2025 −13 % → 2026 −19 % (still growing)
    if (!second) {
      const g25 = span(t, k.gapW - .2, k.gapW + .4), x25 = cx(2025.6);
      if (g25 > 0) { gs(ctx, [[x25, cy(0)], [x25, cy(-13)]], 0, sineIO(g25), { w: 2, spark: false, a: .8 });
        lab(ctx, SRC.gap2025, x25 - 18, cy(-13) + 46, g25, { size: 24, col: GOLD.text, align: 'right' }); }
      const gr = bumpT(t, k.growing - .15, .8); if (gr > 0) halo(ctx, END[0], (cy(0) + END[1]) / 2, 260, .4 * gr, GOLD.halo, GOLD.core);
    }
    ctx.restore();
    F.source(ctx, t, k.inThe + .4, k.ifYou - .2, SRC.gapSrc);
  }
  function chartToYou(ctx, t) {   // 2.07: the end dot becomes you (you rise from the curb where it lands); the you-dot drops onto your shoulder
    const m = quartIO(span(t, k.ifYou - .3, k.you - .05)); if (t < k.ifYou - .3 || t > k.sameData + .5) return;
    const rise = expoOut(span(t, k.you - .15, k.you + .7)) * (1 - expoIn(span(t, k.sameData - .45, k.sameData + .25)));
    if (rise < 1 && t < k.sameData - .45) {
      const x = lerp(END[0], YOU.x, m), y = lerp(END[1], CURB - 4, m) - 120 * Math.sin(Math.PI * m);
      ctx.save(); ctx.globalAlpha *= 1 - rise; halo(ctx, x, y, 40, .6, AMBER.body, AMBER.core); ctx.fillStyle = AMBER.hot; ctx.beginPath(); ctx.arc(x, y, 8, 0, TAU); ctx.fill(); ctx.restore();
    }
    if (rise > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(-50, -50, W + 100, CURB + 50); ctx.clip();
      const y = CURB + (1 - rise) * (YOU.h + 20);
      halo(ctx, YOU.x, y - YOU.h * .55, YOU.h * 1.2, .3, AMBER.body, AMBER.core);
      E.du(ctx, YOU.x, y, YOU.h, { look: .25 + .2 * Math.sin(t * .7) * .3, dir: -1 });
      ctx.restore();
      // the you-dot from the timeline drops onto your shoulder ("You're standing in it")
      const d = quartIO(span(t, k.standing - .5, k.standW + .05)), tp = F.timelinePt(0), sh = [YOU.x + 8, y - YOU.h * .8];
      if (d > 0) {
        const x = lerp(tp[0], sh[0], d), yy = lerp(tp[1] - 20, sh[1], d) - 90 * Math.sin(Math.PI * d), ring = bumpT(t, k.standW + .05, .7);
        halo(ctx, x, yy, 30 + 60 * ring, .6 + .4 * ring, AMBER.body, AMBER.core); ctx.fillStyle = AMBER.body; ctx.beginPath(); ctx.arc(x, yy, 6, 0, TAU); ctx.fill();
      }
    }
  }

  // ------------------------------------------------------------------ THE LANES (2.08–2.10)
  const LANE = [{ y: 330, label: 'REPLACING', t: () => k.replacing }, { y: 680, label: 'ALONGSIDE', t: () => k.alongside }];
  const TILE_X = Array.from({ length: 6 }, (_, i) => 560 + i * 150), RULE_Y = [430, 780], TYPE_Y = [430, 660];
  const lanesOn = (t) => quartIO(span(t, k.else - .2, k.else + .8));
  const lanesOff = (t) => expoIn(span(t, k.fs - .55, k.fs + .1));   // the lanes stay under THE MACHINE ALONE … and drop on 'So the first stop'
  const lanesZ = (t) => quartIO(span(t, k.alone - .45, k.alone + .45));   // 2.10: they step back (scale .72) to make room for the sentence
  function lanes(ctx, t) {
    const on = lanesOn(t); if (on <= 0 || t > k.fs + 1) return;
    const off = lanesOff(t), z = lanesZ(t), typeOut = off;
    ctx.save(); const zk = lerp(1, .72, z); ctx.translate(960, lerp(600, 680, z)); ctx.scale(zk, zk); ctx.translate(-960, -600);
    // the rules (from the chart's x axis: it splits into two)
    LANE.forEach((L, li) => {
      const y = lerp(CH.ya, RULE_Y[li], on) + off * 300, x0 = lerp(CH.x0, 140, on), x1 = lerp(CH.x1, W - 140, on);
      ctx.save(); ctx.globalAlpha *= 1 - typeOut; ctx.strokeStyle = rgba(CREAM, .45); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lerp(x0, W / 2, typeOut), y); ctx.lineTo(lerp(x1, W / 2, typeOut), y); ctx.stroke(); ctx.restore();
    });
    if (off >= 1) { ctx.restore(); return; }
    ctx.translate(0, off * 300);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, RULE_Y[0] - 1); ctx.rect(0, RULE_Y[0] + 30, W, RULE_Y[1] - RULE_Y[0] - 31); ctx.clip();
    LANE.forEach((L, li) => {
      const tw = L.t(), base = RULE_Y[li];
      const usedLit = bumpT(t, k.used - .1 + li * .12, 1.1);   // 'how it's used': the two uses light up
      F.say(ctx, t, [[L.label, tw]], 140, L.y + 24, { size: 56, out: k.fs - .6, col: mixHex(CREAM, GOLD.body, usedLit) });
      TILE_X.forEach((x, i) => {
        const rise = expoOut(span(t, (li ? k.where : k.else + .3) + i * .05, (li ? k.where : k.else + .3) + i * .05 + .6)) * (1 - off);
        if (rise <= 0) return;
        const y = L.y + (1 - rise) * 200, cold = li === 0 ? sineIO(span(t, tw + i * .1, tw + .5 + i * .1)) : 0;
        F.tile(ctx, t, x, y, 96, { cold, dim: .3 * cold, glyph: 'person', ga: 1 - cold, v: .8 + .2 * ((i * 5) % 3) / 2 });
        if (li === 1) {   // a small machine docks beside each person: they work together
          const d = expoOut(span(t, tw - .2 + i * .07, tw + .4 + i * .07)); if (d > 0) {
            const mx = x + 60, my = y - 52 + (1 - d) * -60; halo(ctx, mx, my, 40 + 30 * bumpT(t, k.machW - .1 + i * .04, .8), .4 * d, MACH.halo, MACH.core);
            ctx.save(); ctx.globalAlpha *= d; ctx.fillStyle = lin(ctx, 0, my - 18, 0, my + 18, [[0, MACH.hot], [1, MACH.mid]]); ctx.beginPath(); ctx.arc(mx, my, 18, 0, TAU); ctx.fill(); ctx.restore(); }
        }
      });
      // the trend at the lane's right end: lane 0 the chart's line, shrunk; lane 1 its clone that holds and rises
      const tx0 = 1560, tx1 = 1760, ty = L.y - 30;
      const pts = []; for (let i = 0; i <= 30; i++) { const q = i / 30; pts.push([lerp(tx0, tx1, q), li === 0 ? ty + 70 * q * q : ty + 18 - 30 * sineIO(span(t, k.holds, k.grows + .3)) * q * q]); }
      const tu = li === 0 ? on : sineIO(span(t, k.where + .2, k.where + 1)) ;
      ctx.save(); ctx.globalAlpha *= 1 - off; ctx.strokeStyle = AMBER.body; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); pts.slice(0, Math.max(2, Math.round(31 * tu))).forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
      ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tx0, ty); ctx.lineTo(tx1, ty); ctx.stroke(); ctx.restore();
    });
    lab(ctx, SRC.alongside, 1760, LANE[1].y + 84, span(t, k.holds - .3, k.holds + .3) * (1 - off), { size: 24, col: CREAM, align: 'right' });
    ctx.restore();
    ctx.restore();
  }

  // ------------------------------------------------------------------ words
  function words(ctx, t) {
    F.say(ctx, t, [['FIRST', k.firstW], ['TO', k.toGo - .05], ['GO', k.toGo + .05]], 140, 196, { size: 40, weight: 700, spacing: .08, col: CREAM2, out: k.ai - .3, glow: false });
    F.say(ctx, t, [['SCREEN', k.screenW - .1], ['WORK', k.screenW + .1]], 140, 290, { size: 100, gold: [0], out: k.ai - .25 });
    F.say(ctx, t, [['CHEAPER', k.cheaper], ['·', k.faster - .15], ['FASTER', k.faster], ['·', k.more - .15], ['MORE', k.more], ['ACCURATE', k.more + .2]], 140, 270, { size: 78, out: k.group - .25 });
    F.source(ctx, t, k.ai + .3, k.group, SRC.decoderSrc);
    F.say(ctx, t, [['THIS', k.thisStop], ['STOP', k.thisStop + .2], ['IS', k.already - .1], ['IN', k.data - .1], ['THE', k.data - .05], ['DATA', k.data]], 140, 270, { size: 64, gold: [5], out: k.young - .62 });
    F.say(ctx, t, [['YOUNG', k.young + .12], ['PEOPLE', k.peopleW]], 140, 270, { size: 88, out: k.inThe - .3 });
    F.say(ctx, t, [['LOOKING', k.young + .85], ['FOR', k.first - .25], ['A', k.first - .12], ['FIRST', k.first], ['JOB', k.job]], 140, 350, { size: 50, gold: [3, 4], out: k.inThe - .25 });
    F.say(ctx, t, [['STILL', k.still], ['GROWING', k.growing]], CH.x1, 900 - 30, { size: 56, align: 'right', out: k.ifYou - .3 });
    F.say(ctx, t, [['THIS', k.isnt - .55], ['STOP', k.stopW], ["ISN'T", k.isnt], ['AHEAD', k.ahead]], 140, 260, { size: 64, out: k.standing - .25 });
    F.say(ctx, t, [["YOU'RE", k.standing], ['STANDING', k.standW], ['IN', k.inIt], ['IT', k.itW]], 140, 360, { size: 92, gold: [1], out: k.sameData - .3 });
    F.say(ctx, t, [['THE', k.sameData + .07], ['SAME', k.sameData + .14], ['DATA', k.data2], ['SHOWS', k.shows], ['MORE', k.else]], W / 2, 180, { size: 56, align: 'center', gold: [4], out: k.where - .1 });
    // 2.10: the type stands on the lane rules
    F.say(ctx, t, [['THE', k.alone + .07], ['MACHINE', k.machW], ['ALONE', k.aloneW], ["DOESN'T", k.doesnt], ['DECIDE', k.decide]], W / 2, 252, { size: 72, align: 'center', out: k.fs - .5 });
    F.say(ctx, t, [['HOW', k.how], ["IT'S", k.its], ['USED', k.used], ['DOES', k.does]], W / 2, 352, { size: 88, align: 'center', gold: [2], out: k.fs - .45 });
  }

  const tlBig = (t) => quartIO(span(t, k.fs - .4, k.hand));   // grows until the c04 draw takes over (and shrinks it at once)
  const draw = (ctx, t) => {
    if (t >= k.hand) return c04(ctx, t);
    F.stage(ctx, t);
    office(ctx, t);
    dropLine(ctx, t);
    busStop(ctx, t);
    fallScreens(ctx, t);
    frame(ctx, t);
    chart(ctx, t);
    chartToYou(ctx, t);
    lanes(ctx, t);
    F.timeline(ctx, t, T, { big: tlBig(t), dy: 200 * tlBig(t) });
    words(ctx, t);
  };
  const out = { k, draw, dropLine };
  CACHE.set(T, out);
  return out;
}
export default (T, R) => [{ t: R.a, draw: buildC03(T).draw, print: F.PRINT41 }];
