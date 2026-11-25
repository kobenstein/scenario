// Film 41 · c06 · the last stop (B2) · 'That leaves the last stop' → 'His fix' (docs/shots.md 5.01–5.13)
//   5.01 your dot on the timeline: the timeline grows big into the centre, the third stop pulses (WORRIES HIM MOST) · 5.02 ★ the third
//        stop stretches into the 20 YEARS band; twenty year-ticks light as the band's head passes them (computed from the band) · 5.03
//        the band grows into the C3 plate (HOW LONG?) · 5.04 C3 · 5.05 the plate shrinks back into the band; tiles grow out of it and
//        split: winners rise gold, losers sink cold · 5.06 the tiles fold back; YOUR WORKING LIFE draws as a lit path, you walk at its
//        middle, the band lands exactly on the rest of the path (THE REST OF IT) · 5.07 the band lifts into the plan card, two slots ·
//        5.08 FAR FEWER JOBS returns in the type and place of H.03 · 5.09 an asterisk drops on FEWER, the footnote writes · 5.10 slot 1
//        the list, slot 2 a coin (MONEY) · 5.11 the coin rolls out and becomes the pivot of THE TAX SCALE in a factory yard; the tax
//        system tilts it the wrong way (COST TO THE COMPANY) · 5.12 a worker walks out of the lit gate onto the left pan, wage-tax coins
//        drop in, the pan sinks · 5.13 a robot crate comes down on a cable onto the right pan with its price on top; the price flies off
//        the books (written off right away), the scale tips further · → the crate lifts off and becomes the big cyan tile (c07 opens a
//        coin slot in it).
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f41_kit.mjs';
import * as S from '../lib/f41_world.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, lin } = E;
const { GOLD, CREAM, CREAM2, MACH, AMBER, SOURCES: SRC } = F;
const TAU = Math.PI * 2;
const bumpT = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));
const lerpP = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
const lerpR = (a, b, u) => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), w: lerp(a.w, b.w, u), h: lerp(a.h, b.h, u) });
const settle = (u) => { u = clamp(u); return 1 - (1 - u) ** 3 + .16 * Math.sin(Math.PI * u) * (1 - u); };   // a landing with a little give
// the big cyan tile c07 starts from (both files draw it with the same breath)
export const MTILE = (t) => ({ x: 960, y: 470 + 3 * Math.sin(t * .9), s: 220 * (1 + .01 * Math.sin(t * .7)) });

function lab(ctx, s, x, y, u, o = {}) {   // spaced caps that rise behind their mask (width counts the letter spacing)
  u = clamp(u); const out = clamp(o.out ?? 0); if (u <= 0 || out >= 1) return null;
  const size = o.size ?? 24, sp = o.spacing ?? .12;
  ctx.save(); ctx.font = `${o.weight ?? 600} ${size}px Inter`; ctx.letterSpacing = `${sp}em`; const w = ctx.measureText(s).width; ctx.restore();
  const x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.beginPath(); ctx.rect(x0 - size * .3, y - size * 1.3, w + size * .6, size * 1.64); ctx.clip();
  ctx.font = `${o.weight ?? 600} ${size}px Inter`; ctx.letterSpacing = `${sp}em`; ctx.textBaseline = 'alphabetic';
  const g = clamp(o.gold ?? 0); if (g > 0) { ctx.shadowColor = rgba(GOLD.halo, .6 * g); ctx.shadowBlur = size * .3; }
  ctx.fillStyle = mixHex(o.col ?? CREAM2, GOLD.body, g); ctx.fillText(s, x0, y + (1 - expoOut(u)) * size * 1.1 + expoIn(out) * size * 1.1);
  ctx.restore();
  return { x0, x1: x0 + w, w };
}
// a coin: a gold disc with a rim (spin 0..1 turns it edge-on)
export function coin(ctx, x, y, r, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || r <= .3) return;
  const sx = Math.max(.08, Math.abs(Math.cos((o.spin ?? 0) * Math.PI)));
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(sx, 1);
  ctx.fillStyle = GOLD.shade; ctx.beginPath(); ctx.arc(0, r * .12, r, 0, TAU); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, -r, 0, r, [[0, GOLD.hot], [.55, GOLD.body], [1, GOLD.mid]]); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba(GOLD.shade, .8); ctx.lineWidth = Math.max(1, r * .1); ctx.beginPath(); ctx.arc(0, 0, r * .72, 0, TAU); ctx.stroke();
  ctx.restore();
}
function band(ctx, r, a = 1) {   // the 20-year band (as the kit's timeline draws it), at any rect
  if (a <= 0 || r.w <= 1) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = lin(ctx, r.x, 0, r.x + r.w, 0, [[0, rgba(GOLD.body, .92)], [1, rgba(GOLD.mid, .45)]]);
  ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, Math.min(r.h, r.w) / 2); ctx.fill();
  ctx.restore();
  halo(ctx, r.x + r.w / 2, r.y + r.h / 2, 60 + r.w * .35, .22 * a, GOLD.halo, GOLD.core);
}
function dashRect(ctx, r, u, a = 1) {
  if (u <= 0) return; const per = 2 * (r.w + r.h);
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = rgba(CREAM, .55); ctx.lineWidth = 2; ctx.setLineDash([10, 9]);
  ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 10); ctx.setLineDash([10, 9]); ctx.lineDashOffset = 0;
  ctx.save(); ctx.beginPath(); ctx.rect(r.x - 4, r.y - 4, (r.w + 8) * clamp(u * 1.05), r.h + 8); ctx.clip(); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 10); ctx.stroke(); ctx.restore();
  void per; ctx.restore();
}
function asterisk(ctx, x, y, s, a = 1) {
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = GOLD.line; ctx.lineWidth = s * .2; ctx.lineCap = 'round';
  ctx.shadowColor = rgba(GOLD.halo, .7); ctx.shadowBlur = s * .5;
  for (let i = 0; i < 3; i++) { const an = i * Math.PI / 3 + Math.PI / 2; ctx.beginPath(); ctx.moveTo(x - Math.cos(an) * s * .5, y - Math.sin(an) * s * .5); ctx.lineTo(x + Math.cos(an) * s * .5, y + Math.sin(an) * s * .5); ctx.stroke(); }
  ctx.restore();
}

export default (T, R) => {
  const G = (p, after = R.a - .5) => T.G(p, 0, after);
  const k = {};
  k.last = G('last stop'); k.tlW = G('timeline', k.last); k.worries = G('worries him most'); k.him = G('him', k.worries); k.most = G('most', k.worries);
  k.isnt = G("It isn't a date"); k.isntW = G("isn't", k.isnt); k.date = G('date', k.isnt);
  k.stretch = G("It's a stretch of time"); k.stretchW = G('stretch', k.stretch); k.timeW = G('time', k.stretch);
  k.pod = G('On that same podcast'); k.how = G('how long', k.pod); k.long = G('long', k.how);
  const C3 = T.clip('C3');
  k.twenty = G('Twenty years of winners'); k.winners = G('winners', k.twenty); k.losers = G('losers', k.winners);
  k.middle0 = G("If you're in the middle"); k.middle = G('middle', k.middle0); k.your = G('your working life', k.middle0); k.working = G('working', k.your); k.life = G('life', k.working);
  k.notT = G('not a transition', k.middle0); k.transition = G('transition', k.notT);
  k.rest0 = G("That's the rest of it"); k.rest = G('rest', k.rest0); k.it = G('it', k.rest);
  k.plan0 = G('That stretch is what his plan'); k.plan = G('plan', k.plan0);
  k.remember = G('Remember the warning'); k.far = G('Far fewer jobs', k.remember); k.fewer = G('fewer', k.far); k.jobs = G('jobs', k.fewer);
  k.essay = G('His essay adds a condition'); k.condition = G('condition', k.essay); k.without = G('without the right policies', k.essay);
  k.theW = G('the right', k.without); k.right = G('right', k.without); k.policies = G('policies', k.without);
  k.list1 = G('The list is one of them'); k.listW = G('list', k.list1); k.another = G('Another is about money'); k.money = G('money', k.another);
  k.today = G('Today, he argues'); k.taxSys = G('tax system', k.today); k.system = G('system', k.taxSys); k.pushes = G('pushes', k.taxSys); k.wrong = G('wrong way', k.pushes); k.way = G('way', k.wrong);
  k.hire = G('Hire a person'); k.person = G('person', k.hire); k.pays = G('pays taxes', k.hire); k.taxes = G('taxes', k.pays); k.wage = G('wage', k.taxes);
  k.buy = G('Buy a robot instead'); k.robot = G('robot', k.buy); k.usually = G('usually', k.buy); k.written = G('written off', k.usually); k.away = G('right away', k.written);

  // ------------------------------------------------------------------ the timeline, big (5.01–5.03)
  const bigU = (t) => (t < C3.start ? quartIO(span(t, R.a, R.a + 1.3)) : 0);
  const tlDx = (t) => -190 * sineIO(span(t, k.stretch, k.stretch + 1.9));
  const tlO = (t) => { const b = bigU(t); return { big: b, dy: 300 * b, dx: tlDx(t) * b, lit: t > k.worries - .4 && t < k.isnt + .2 ? 2 : undefined }; };
  const tlGeom = (t) => { const o = tlO(t), sc = lerp(1, 1.9, sineIO(o.big)), x0 = lerp(W - 720, W / 2 - 640 / 2 * 1.9, sineIO(o.big)) + o.dx, y = lerp(92, 150, sineIO(o.big)) + o.dy; return { sc, x0, y }; };
  function bandWow(ctx, t, A = 1) {   // ★ 5.02: the band's head lights twenty year-ticks as it passes them (computed from the kit's band state)
    if (t < k.stretch - .2 || t > C3.start) return;
    const st = F.timelineState(T, t), b = st.band * st.on; if (b <= 0) return;
    const { sc, x0, y } = tlGeom(t), xa = x0 + sc * 470, head = xa + sc * 170 * st.band;
    for (let j = 0; j < 20; j++) {
      const xj = xa + sc * 170 * (j + .5) / 20, lit = smooth(clamp((head - xj) / 30));
      if (lit <= 0) continue;
      ctx.save(); ctx.globalAlpha = A * st.on * lit; ctx.strokeStyle = j % 5 === 4 ? GOLD.core : GOLD.line; ctx.lineWidth = j % 5 === 4 ? 3 : 2;
      const hh = j % 5 === 4 ? 26 : 16; ctx.beginPath(); ctx.moveTo(xj, y - 22); ctx.lineTo(xj, y - 22 - hh * lit); ctx.stroke(); ctx.restore();
    }
    if (st.band < 1) halo(ctx, head, y, 90, .7 * st.on * A, GOLD.halo, GOLD.core);
    halo(ctx, (xa + head) / 2, y, 140 + (head - xa) * .5, .18 * b * A, GOLD.halo, GOLD.core);
  }
  const bandScreen = (t) => { const { sc, x0, y } = tlGeom(t); return { x: x0 + sc * 463, y: y - sc * 7, w: sc * 184, h: sc * 14 }; };
  // the centre band after the clip, and its moves (5.05–5.07)
  const BAND = { x: 560, y: 457, w: 800, h: 26 };
  const PX0 = 200, PX1 = 1720, PY = 700, age = (a) => PX0 + (a - 20) / 45 * (PX1 - PX0);
  const REST = { x: age(45) - 6, y: PY - 13, w: age(65) - age(45) + 12, h: 26 };
  const CARDP = { x: 610, y: 150, w: 700, h: 410 }, SL1 = { x: 650, y: 230, w: 300, h: 290 }, SL2 = { x: 970, y: 230, w: 300, h: 290 };
  const toRest = (t) => quartIO(span(t, k.rest0 - .2, k.rest + .55)), toCard = (t) => quartIO(span(t, k.plan0 - .05, k.plan0 + 1.05));
  const cardOut = (t) => expoIn(span(t, k.today - .2, k.today + .65));
  function plate(ctx, t) {
    if (t < k.pod + .15 || t > C3.end + .75) return;
    const grow = quartIO(span(t, k.pod + .2, k.pod + 1.7)), shrink = quartIO(span(t, C3.end - .55, C3.end + .65));
    const from = shrink > 0 ? BAND : bandScreen(k.pod + .15), morph = shrink > 0 ? 1 - shrink : grow;
    const dark = Math.max(1 - span(t, C3.start - .35, C3.start + .05), span(t, C3.end - .4, C3.end + .3));
    F.clipPlate(ctx, t, T, 'C3', { from, morph, dark: dark * (t < C3.start ? lerp(1, .75, grow) : 1), label: span(t, k.pod + 1, k.pod + 1.6) * (1 - span(t, C3.end - .7, C3.end - .2)) });
  }
  function centreBand(ctx, t) {
    if (t < C3.end + .55 || t > k.plan0 + 1.2) return;
    const r1 = lerpR(BAND, REST, toRest(t)), m = toCard(t), r = lerpR(r1, CARDP, m);
    if (m <= 0) { band(ctx, r, 1); return; }
    // the band lifts and opens into the plan card (night card, gold edge)
    ctx.save(); ctx.fillStyle = mixHex(mixHex(GOLD.body, P.night1, .0), mixHex(P.night1, P.ind2, .55), span(m, 0, .6)); ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, lerp(13, 14, m)); ctx.fill(); ctx.restore();
    F.goldSpan(ctx, [[r.x, r.y], [r.x + r.w, r.y], [r.x + r.w, r.y + r.h], [r.x, r.y + r.h], [r.x, r.y]], 0, 1, { w: lerp(3, 1.6, m), spark: false, a: lerp(1, .7, m) });
  }
  function planCard(ctx, t) {
    if (t < k.plan0 + 1.05) return;
    const out = cardOut(t); if (out >= 1) return;
    ctx.save(); ctx.translate(0, 760 * out);
    const r = CARDP;
    ctx.fillStyle = rgba(P.night0, .35); ctx.beginPath(); ctx.roundRect(r.x + 6, r.y + 10, r.w, r.h, 14); ctx.fill();
    ctx.fillStyle = mixHex(P.night1, P.ind2, .55); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 14); ctx.fill();
    F.goldSpan(ctx, [[r.x, r.y], [r.x + r.w, r.y], [r.x + r.w, r.y + r.h], [r.x, r.y + r.h], [r.x, r.y]], 0, 1, { w: 1.6, spark: false, a: .7 });
    lab(ctx, 'HIS PLAN', r.x + 40, r.y + 52, span(t, k.plan - .2, k.plan + .4), { size: 24, col: GOLD.text });
    const su = span(t, k.plan0 + .95, k.plan + .5);
    [SL1, SL2].forEach((sl, i) => {
      dashRect(ctx, sl, sineIO(span(su, i * .2, .8 + i * .2)));
      lab(ctx, SRC.plans[i], sl.x + sl.w / 2, sl.y + 44, span(su, .3 + i * .2, .9 + i * .2), { size: 22, align: 'center', col: CREAM });
    });
    // 5.10: the list in slot 1, the coin in slot 2
    const lu = span(t, k.listW - .15, k.listW + .7);
    if (lu > 0) F.list(ctx, t, SL1.x + 70, SL1.y + 70, 160, 170, { n: 4, u: lu, head: 0, glow: .6 });
    lab(ctx, 'THE LIST', SL1.x + SL1.w / 2, SL1.y + SL1.h - 18, span(t, k.listW + .1, k.listW + .7), { size: 22, align: 'center', col: GOLD.text });
    lab(ctx, 'MONEY', SL2.x + SL2.w / 2, SL2.y + SL2.h - 18, span(t, k.money - .1, k.money + .5), { size: 22, align: 'center', col: GOLD.text });
    ctx.restore();
  }
  // the coin: drops into slot 2 on "money", rolls out to become the scale's pivot (5.11)
  const SCX = 1000, SCY = 410, HW = 380;
  function coinPart(ctx, t) {
    if (t < k.money - .5) return null;
    const fall = span(t, k.money - .45, k.money + .05), land = settle(span(t, k.money + .05, k.money + .5));
    const c2 = [SL2.x + SL2.w / 2, SL2.y + SL2.h / 2 + 10];
    let p = [c2[0], lerp(SL2.y - 140, c2[1], expoIn(fall)) - (fall >= 1 ? 14 * (1 - land) * Math.sin(Math.PI * clamp(land * 1.4)) : 0)], r = 46;
    const a = span(t, k.money - .5, k.money - .3);
    const roll = quartIO(span(t, k.today - .1, k.today + .9));
    p = [lerp(p[0], SCX, roll), lerp(p[1] + 760 * 0, SCY, roll) - 120 * Math.sin(Math.PI * roll)]; r = lerp(46, 22, roll);
    if (t > k.today + .9) return [SCX, SCY];
    coin(ctx, p[0], p[1], r, { spin: fall < 1 ? fall * 2.5 : roll * 2, a });
    halo(ctx, p[0], p[1], r * 2.5, .35 * a, GOLD.halo, GOLD.core);
    return null;
  }
  // ------------------------------------------------------------------ the factory yard + the scale (5.11–5.13)
  const yardU = (t) => quartIO(span(t, k.today - .1, k.today + 1.2)), yardOut = (t) => expoIn(span(t, R.b - 1.25, R.b - .35));
  const GY = 830, GATE = { x: 150, y: 660, w: 120, h: 170 };
  function yard(ctx, t) {
    const u = yardU(t), out = yardOut(t); if (u <= 0 || out >= 1) return;
    ctx.save(); ctx.translate(0, 340 * (1 - u) + 360 * out);
    // the factory: a long saw-tooth roof, a chimney, a few lit windows; the lit gate on the left
    ctx.fillStyle = mixHex(P.night1, P.ind1, .45);
    ctx.beginPath(); ctx.moveTo(60, GY); ctx.lineTo(60, 600);
    for (let i = 0; i < 7; i++) { const x = 60 + i * 110; ctx.lineTo(x + 80, 540); ctx.lineTo(x + 110, 600); }
    ctx.lineTo(830, 600); ctx.lineTo(830, GY); ctx.closePath(); ctx.fill();
    ctx.fillRect(700, 470, 40, 140);
    const r = E.prng(4601);
    for (let i = 0; i < 6; i++) { const x = 330 + i * 80, y = 616, on = .55 + .45 * Math.sin(t * (.3 + r() * .4) + i); ctx.fillStyle = rgba(AMBER.body, .18 + .22 * on * (r() > .3 ? 1 : .2)); ctx.fillRect(x, y, 34, 22); }
    halo(ctx, GATE.x + GATE.w / 2, GATE.y + GATE.h * .6, 220, .45, AMBER.body, AMBER.core);
    ctx.fillStyle = lin(ctx, 0, GATE.y, 0, GATE.y + GATE.h, [[0, AMBER.hot], [1, AMBER.shade]]); ctx.fillRect(GATE.x, GATE.y, GATE.w, GATE.h);
    // crates at the right, the yard floor
    ctx.fillStyle = mixHex(P.night1, P.ind2, .5);
    [[1490, 740, 110, 90], [1610, 760, 90, 70], [1540, 680, 80, 60], [1720, 780, 120, 50]].forEach(([x, y, w, h]) => { ctx.fillRect(x, y, w, h); ctx.strokeStyle = rgba(P.blue1, .5); ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h); });
    ctx.fillStyle = lin(ctx, 0, GY, 0, H, [[0, mixHex(P.night1, P.ind1, .3)], [1, P.night0]]); ctx.fillRect(0, GY, W, H - GY);
    ctx.strokeStyle = rgba(AMBER.body, .25); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, GY); ctx.lineTo(W, GY); ctx.stroke();
    ctx.restore();
  }
  // tilt (+ = right pan down; left = the person, right = the machine; heavier = costs the company more)
  const COINS_T = [0, 1, 2, 3].map((i) => k.taxes + .05 + i * .24);
  const crateLand = () => k.robot + .45;
  function tilt(t) {
    let v = -.18 * settle(span(t, k.wrong, k.wrong + .7));
    COINS_T.forEach((c) => { v -= .075 * settle(span(t, c + .32, c + .7)); });
    v += .34 * settle(span(t, crateLand(), crateLand() + .6));
    v -= .42 * settle(span(t, k.written + .25, k.away + .5));
    return v;
  }
  const panPos = (t, side, u = 1) => { const ang = tilt(t) * .32 + .01 * Math.sin(t * 1.3), ex = Math.cos(ang) * HW, ey = Math.sin(ang) * HW, d = HW * .55 * span(u, .4, 1); return side < 0 ? [SCX - ex, SCY - ey + d] : [SCX + ex, SCY + ey + d]; };
  function worker(ctx, t, floor) {   // walks out of the lit gate, steps up onto the left pan
    const w0 = k.hire - .5, w1 = k.person + .2; if (t < w0) return;
    const gx = GATE.x + GATE.w / 2, walkU = span(t, w0, w1), step = quartIO(span(t, w1, w1 + .55));
    const approach = [floor[0] - 150, GY];
    let x = lerp(gx, approach[0], sineIO(walkU)), y = GY;
    x = lerp(x, floor[0] - 26, step); y = lerp(y, floor[1], step) - 70 * Math.sin(Math.PI * step);
    const walking = walkU < 1 && walkU > 0;
    E.person(ctx, x, y, 140, { walk: walking ? (t - w0) * 7.5 : undefined, view: walking ? 'side' : undefined, rim: AMBER.body, light: -1, a: span(t, w0, w0 + .3) });
  }
  function crateAt(t) {   // the robot crate on its cable: down onto the right pan; at the end it lifts off into the big cyan tile
    const fl = panPos(t, 1), drop = span(t, k.robot - .55, crateLand()), land = settle(span(t, crateLand(), crateLand() + .5));
    let x = fl[0], y = lerp(-140, fl[1] - 62, expoIn(drop)) + (drop >= 1 ? 10 * Math.sin(Math.PI * clamp(land * 1.3)) * (1 - land) : 0), s = 120;
    const lift = quartIO(span(t, R.b - 1.15, R.b - .15)), M = MTILE(t);
    return { x: lerp(x, M.x, lift), y: lerp(y, M.y, lift), s: lerp(s, M.s, lift), lift, a: span(t, k.robot - .55, k.robot - .35) };
  }
  function crate(ctx, t) {
    if (t < k.robot - .6) return;
    const c = crateAt(t), fl = panPos(t, 1);
    if (c.lift < .05) { ctx.save(); ctx.strokeStyle = rgba(CREAM2, .5 * c.a * (1 - span(t, crateLand() + .3, crateLand() + .9))); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(c.x, -10); ctx.lineTo(c.x, c.y - c.s / 2); ctx.stroke(); ctx.restore(); }
    F.tile(ctx, t, c.x, c.y, c.s, { cold: 1, lift: .3 + .3 * c.lift, a: c.a, v: 1 });
    if (c.lift < 1) {   // slats: a crate, not a tile, until it lifts off
      ctx.save(); ctx.globalAlpha *= c.a * (1 - c.lift); ctx.strokeStyle = rgba(MACH.deep, .55); ctx.lineWidth = 3;
      for (let i = 1; i < 4; i++) { const yy = c.y - c.s / 2 + c.s * i / 4; ctx.beginPath(); ctx.moveTo(c.x - c.s * .42, yy); ctx.lineTo(c.x + c.s * .42, yy); ctx.stroke(); }
      ctx.restore();
      lab(ctx, 'A ROBOT', c.x + c.s / 2 + 18, c.y + 8, span(t, k.robot, k.robot + .5) * (1 - c.lift * 2), { size: 22, col: CREAM });
    }
    // its price: four coins on top of the crate, written off: they fly off the books (up and away), staggered
    for (let i = 0; i < 4; i++) {
      const off = expoIn(span(t, k.written + .1 + i * .12, k.written + .9 + i * .12)); if (off >= 1) continue;
      const bx = c.x - 30 + (i % 2) * 34, by = c.y - c.s / 2 - 12 - Math.floor(i / 2) * 16;
      coin(ctx, bx + 420 * off, by - 520 * off, 15, { a: c.a * (1 - off), spin: off * 3 });
    }
    void fl;
  }
  function scale(ctx, t) {
    const u = span(t, k.today + .7, k.taxSys + .2), out = yardOut(t); if (u <= 0 || out >= 1) return;
    ctx.save(); ctx.translate(0, 360 * out);
    const tl = tilt(t);
    F.balance(ctx, t, SCX, SCY, HW, { u, tilt: tl,
      left: (c, px, py) => {
        // the wage-tax coins drop into the left pan (one by one), stacked beside the worker
        COINS_T.forEach((c0, i) => {
          const f = span(t, c0, c0 + .32); if (f <= 0) return;
          const y = lerp(py - 520, py - 9 - i * 12, expoIn(f));
          coin(ctx, px + 44, y, 17, { spin: f < 1 ? f * 2 : 0 });
        });
      } });
    halo(ctx, SCX, SCY, 50, .5 * u, GOLD.halo, GOLD.core); if (t > k.today + .9) coin(ctx, SCX, SCY, 22);
    ctx.restore();
  }

  // ------------------------------------------------------------------ the frame
  const draw = (ctx, t) => {
    F.stage(ctx, t);
    // 5.05 tiles grow out of the band and split; 5.06 they fold back
    yard(ctx, t);
    if (t > C3.end + .5 && t < k.middle0 + 1) {
      const r = E.prng(4602), N = 16;
      for (let i = 0; i < N; i++) {
        const kind = [1, 0, 2, 0, 1, 2, 0, 1, 2, 0, 0, 1, 2, 1, 0, 2][i], v = .6 + .4 * r();
        const x = BAND.x + 25 + i * 50, born = expoOut(span(t, k.twenty - .05 + i * .03, k.twenty + .45 + i * .03));
        const up = kind === 1 ? expoOut(span(t, k.winners - .1 + i * .02, k.winners + .6 + i * .02)) : 0, dn = kind === 2 ? expoOut(span(t, k.losers - .1 + i * .02, k.losers + .6 + i * .02)) : 0;
        const back = quartIO(span(t, k.middle0 - .3 + i * .015, k.middle0 + .4 + i * .015));
        const y = lerp(BAND.y - 32 - 170 * up + 150 * dn, BAND.y + 13, back), s = 40 * born * (1 - back);
        F.tile(ctx, t, x, y, s, { v, gold: up, cold: .7 * dn, dim: .5 * dn, lift: .5 * up });
      }
    }
    centreBand(ctx, t);
    // 5.06 your working life: the lit path, you walking at its middle
    if (t > k.middle0 && t < k.plan0 + 1.2) {
      const pu = sineIO(span(t, k.middle0 + .3, k.life + .3)), out = expoIn(span(t, k.plan0 - .1, k.plan0 + .6));
      ctx.save(); ctx.translate(0, 160 * out); ctx.globalAlpha *= 1 - out;
      ctx.strokeStyle = rgba(CREAM, .75); ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(PX0, PY); ctx.lineTo(lerp(PX0, PX1, pu), PY); ctx.stroke();
      ctx.fillStyle = lin(ctx, PX0, 0, PX1, 0, [[0, rgba(AMBER.body, .0)], [.5, rgba(AMBER.body, .12)], [1, rgba(AMBER.body, .0)]]); ctx.fillRect(PX0, PY - 40, (PX1 - PX0) * pu, 40);
      for (const [x, s, al] of [[PX0, 'FIRST JOB', 'left'], [PX1, 'RETIREMENT', 'right']]) {
        const on = smooth(clamp((lerp(PX0, PX1, pu) - x + 40) / 60));
        ctx.fillStyle = rgba(CREAM, .8 * on); ctx.beginPath(); ctx.arc(x, PY, 7, 0, TAU); ctx.fill();
        lab(ctx, s, x, PY + 48, on, { size: 24, align: al, col: CREAM2 });
      }
      ctx.restore();
      // you: rise out of the path at its middle, then walk slowly on
      const yu = expoOut(span(t, k.middle - .15, k.middle + .55)); if (yu > 0) {
        const x = age(45) - 26 + 10 * Math.max(0, t - k.middle);
        ctx.save(); ctx.translate(0, 160 * out); ctx.globalAlpha *= 1 - out; ctx.beginPath(); ctx.rect(x - 120, PY - 200, 240, 200); ctx.clip();
        halo(ctx, x, PY - 50, 110, .35 * yu, AMBER.body, AMBER.core);
        E.du(ctx, x, PY + 130 * (1 - yu), 120, { walk: (t - k.middle) * 5.2, view: 'side' }); ctx.restore();
      }
    }
    const tlUnder = t > k.pod + .15 && t < C3.end + 1.2;
    if (tlUnder) F.timeline(ctx, t, T, tlO(t));
    plate(ctx, t);
    if (!tlUnder) bandWow(ctx, t);
    else if (t < k.pod + 1) bandWow(ctx, t, 1 - sineIO(span(t, k.pod + .15, k.pod + .95)));   // the lit ticks fade over the growing plate
    planCard(ctx, t);
    // 5.08 FAR FEWER JOBS, exactly as H.03 (type, size, place); 5.09 the asterisk, the footnote
    const fw = F.say(ctx, t, [['FAR', k.far], ['FEWER', k.fewer], ['JOBS', k.jobs]], W / 2, 790, { size: 150, align: 'center', out: k.list1 - .3 });
    if (t > k.condition - .5 && t < k.list1 + .2) {
      const fx = fw.xs[1] + fw.ws[1] + 26, fy = 790 - 128, f = span(t, k.condition - .42, k.condition), land = settle(span(t, k.condition, k.condition + .45));
      const y = lerp(fy - 420, fy, expoIn(f)) - (f >= 1 ? 14 * Math.sin(Math.PI * clamp(land * 1.3)) * (1 - land) : 0);
      const out = expoIn(span(t, k.list1 - .3, k.list1 + .1));
      asterisk(ctx, fx, y + 160 * out, 46, (1 - out) * span(t, k.condition - .42, k.condition - .3));
    }
    F.say(ctx, t, [['*', k.without - .15], ['WITHOUT', k.without], ['THE', k.theW], ['RIGHT', k.right], ['POLICIES', k.policies]], W / 2, 872, { size: 40, weight: 700, spacing: .06, col: CREAM, align: 'center', gold: [0, 4], out: k.list1 - .25 });
    lab(ctx, 'GATESNOTES · AUG 26, 2026', W / 2, 912, span(t, k.policies + .3, k.policies + .9), { size: 20, align: 'center', out: span(t, k.list1 - .3, k.list1) });
    const piv = coinPart(ctx, t);
    scale(ctx, t);
    if (t > k.hire - .6 && yardOut(t) < 1) { ctx.save(); ctx.translate(0, 360 * yardOut(t)); worker(ctx, t, panPos(t, -1)); ctx.restore(); }
    crate(ctx, t);
    void piv;
    // the scale's words
    const so = span(t, R.b - 1.3, R.b - .8);
    lab(ctx, 'COST TO THE COMPANY', SCX, SCY - 60, span(t, k.taxSys - .2, k.taxSys + .5), { size: 24, align: 'center', out: so });
    F.say(ctx, t, [['THE', k.taxSys - .1], ['TAX', k.taxSys], ['SYSTEM', k.system]], W / 2, 236, { size: 60, align: 'center', out: k.hire - .3 });
    F.say(ctx, t, [['PUSHES', k.pushes], ['THE', k.wrong - .1], ['WRONG', k.wrong], ['WAY', k.way]], W / 2, 306, { size: 60, align: 'center', gold: [2, 3], out: k.hire - .25 });
    F.say(ctx, t, [['HIRE', k.hire], ['A', k.hire + .3], ['PERSON', k.person]], W / 2, 270, { size: 64, align: 'center', out: k.buy - .3 });
    F.say(ctx, t, [['BUY', k.buy], ['A', k.buy + .16], ['ROBOT', k.robot]], W / 2, 270, { size: 64, align: 'center', out: R.b - 1.3 });
    const lp = panPos(t, -1), rp = panPos(t, 1);
    lab(ctx, 'TAX ON THE WAGE', lp[0], lp[1] + 64, span(t, k.taxes - .1, k.taxes + .5), { size: 26, align: 'center', col: GOLD.text, out: so });
    lab(ctx, 'USUALLY', rp[0], rp[1] + 54, span(t, k.usually - .1, k.usually + .4), { size: 20, align: 'center', out: so });
    lab(ctx, SRC.writtenOff, rp[0], rp[1] + 88, span(t, k.written - .1, k.written + .5), { size: 26, align: 'center', col: MACH.hot, out: so });
    // 5.01 / 5.02 words under the big timeline
    F.say(ctx, t, [['WORRIES', k.worries], ['HIM', k.him], ['MOST', k.most]], W / 2, 720, { size: 64, align: 'center', gold: [2], out: k.isnt - .2 });
    F.say(ctx, t, [['NOT', k.isntW], ['A', k.date - .08], ['DATE', k.date]], W / 2, 720, { size: 64, align: 'center', out: k.stretch - .15 });
    F.say(ctx, t, [['A', k.stretch + .1], ['STRETCH', k.stretchW], ['OF', k.timeW - .15], ['TIME', k.timeW]], W / 2, 720, { size: 64, align: 'center', gold: [1], out: k.pod + .1 });
    F.say(ctx, t, [['HOW', k.how], ['LONG?', k.long]], W / 2, 760, { size: 110, align: 'center', out: C3.start - .45 });
    // 5.05 / 5.06
    F.say(ctx, t, [['WINNERS', k.winners]], W / 2, 210, { size: 60, align: 'center', gold: [0], out: k.middle0 - .3 });
    F.say(ctx, t, [['LOSERS', k.losers]], W / 2, 780, { size: 60, align: 'center', col: CREAM2, out: k.middle0 - .25 });
    F.say(ctx, t, [['YOUR', k.your], ['WORKING', k.working], ['LIFE', k.life]], PX0, PY - 70, { size: 48, out: k.plan0 - .2 });
    F.say(ctx, t, [['NOT', k.notT], ['A', k.notT + .2], ['TRANSITION', k.transition]], W / 2, 330, { size: 70, align: 'center', out: k.rest0 - .1 });
    F.say(ctx, t, [['THE', k.rest - .2], ['REST', k.rest], ['OF', k.it - .1], ['IT', k.it]], W / 2, 330, { size: 70, align: 'center', gold: [1, 2, 3], out: k.plan0 - .2 });
    if (!tlUnder) F.timeline(ctx, t, T, tlO(t));
  };
  return [{ t: R.a, draw, print: F.PRINT41 }];
};
