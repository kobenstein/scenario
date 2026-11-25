// Film 41 · c07 · his fix (B2) · 'His fix' → 'Take the jury' (docs/shots.md 6.01–6.12)
//   6.01 the big cyan tile (the robot crate from c06): a coin slot opens in it (TAX THE MACHINE'S WORK) · 6.02 the tile clones into
//        AI and ROBOTS; each has a usage meter, and every step of the meter drops a coin out of its slot into the TAX BY USAGE tray
//        (computed from the meter) · 6.03 the tray pays out in two streams: RETRAINING (a lit workbench) and a STRONGER SAFETY NET (a
//        gold mesh strung under small figures) · 6.04 one coin rises, spins and unfolds into Etzioni's quote card (nameplate: founding
//        CEO, Allen Institute for AI), the spoken words turn gold; DIAGNOSIS ✓ · PRESCRIPTION ? · 6.05 the card shrinks into the sheet
//        of a typewriter: every keystroke drops a coin · 6.06 the counter on the sheet races; an empty office chair in its own light,
//        LOST A JOB? — no reading · 6.07 the coins become a paycheck that slides into slot 1; slot 2 stays empty (A GAP) · 6.08 ★ your
//        desk at night: the paycheck on the desk, the chair empty, the empty slot hangs on the wall: BEING NEEDED · 6.09 the empty slot
//        grows into THE LIST · 6.10 HUMAN RESERVED, his words beside it · 6.11/6.12 CHILD CARE · JURY · ART · TEACHING on their words,
//        a small cyan tool beside teaching → plateJury (the JURY line glowing).
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f41_kit.mjs';
import * as S from '../lib/f41_world.mjs';
import { MTILE, coin } from './sc06.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, lin } = E;
const { GOLD, CREAM, CREAM2, MACH, AMBER, PAPER, SOURCES: SRC } = F;
const TAU = Math.PI * 2;
const bumpT = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));
const lerpP = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
const lerpR = (a, b, u) => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), w: lerp(a.w, b.w, u), h: lerp(a.h, b.h, u) });
const settle = (u) => { u = clamp(u); return 1 - (1 - u) ** 3 + .16 * Math.sin(Math.PI * u) * (1 - u); };
const quad = (p0, c, p1, q) => [(1 - q) ** 2 * p0[0] + 2 * q * (1 - q) * c[0] + q * q * p1[0], (1 - q) ** 2 * p0[1] + 2 * q * (1 - q) * c[1] + q * q * p1[1]];

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
function dashRect(ctx, r, u, a = 1, col = CREAM) {
  if (u <= 0 || a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.rect(r.x - 6, r.y - 6, (r.w + 12) * clamp(u * 1.02), r.h + 12); ctx.clip();
  ctx.strokeStyle = rgba(col, .6); ctx.lineWidth = 2.2; ctx.setLineDash([10, 9]); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 10); ctx.stroke(); ctx.restore();
}
// words on the stage that light as spoken: [[text, t|null]] → unlit cream-2, lit cream with a gold flash; gold: indices that stay gold
function litWords(ctx, t, words, x, y, size, u, o = {}) {
  let xx = x; const tot = words.reduce((s, [w]) => s + F.measure(w, size, true) + size * .26, -size * .26);
  if (o.align === 'center') xx = x - tot / 2;
  words.forEach(([w, ts], i) => {
    const lit = ts == null ? 0 : clamp((t - ts + .05) / .25), flash = ts == null ? 0 : Math.max(0, 1 - Math.abs(t - ts - .1) / .5), keep = o.gold?.includes(i) ? lit : 0;
    const col = mixHex(mixHex(CREAM2, CREAM, lit), GOLD.body, clamp(Math.max(keep, flash * .8)));
    F.maskLine(ctx, [[w, 0]], xx, y, size, u, { serif: true, col, glow: false });
    xx += F.measure(w, size, true) + size * .26;
  });
}
function paperRect(ctx, r, rot = 0) {
  ctx.save(); ctx.translate(r.x + r.w / 2, r.y + r.h / 2); ctx.rotate(rot); ctx.translate(-r.w / 2, -r.h / 2);
  const rr = Math.min(6, r.w / 2, r.h / 2);
  ctx.fillStyle = rgba(P.night0, .35); ctx.beginPath(); ctx.roundRect(6, 10, r.w, r.h, rr); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, 0, r.w, r.h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(0, 0, r.w, r.h, rr); ctx.fill();
  ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
}
function chair(ctx, x, y, s, a = 1) {   // an empty office chair (x = centre, y = floor): back, seat, stem, star base
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  const c1 = mixHex(P.ind2, P.blue1, .35), c2 = mixHex(P.night1, P.ind2, .5), rim = rgba(AMBER.body, .55);
  ctx.fillStyle = c2; ctx.strokeStyle = c2; ctx.lineCap = 'round';
  ctx.lineWidth = 7; for (const dx of [-46, -20, 20, 46]) { ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(dx, -4); ctx.stroke(); ctx.beginPath(); ctx.arc(dx, -2, 5, 0, TAU); ctx.fill(); }
  ctx.fillRect(-5, -78, 10, 62);
  ctx.fillStyle = c1; ctx.beginPath(); ctx.roundRect(-58, -96, 116, 22, 9); ctx.fill();
  ctx.fillRect(-6, -150, 12, 56);
  ctx.beginPath(); ctx.roundRect(-46, -236, 92, 96, 16); ctx.fill();
  ctx.strokeStyle = rim; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(46, -226); ctx.lineTo(46, -150); ctx.stroke(); ctx.beginPath(); ctx.moveTo(56, -94); ctx.lineTo(56, -78); ctx.stroke();
  ctx.restore();
}
function envelope(ctx, x, y, w, rot = 0, a = 1) {   // the paycheck: a cream envelope with a gold band
  if (a <= 0) return; const h = w * .5;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot);
  ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-w / 2 + 4, -h / 2 + 6, w, h);
  ctx.fillStyle = lin(ctx, 0, -h / 2, 0, h / 2, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 1.5; ctx.strokeRect(-w / 2, -h / 2, w, h);
  ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(0, h * .05); ctx.lineTo(w / 2, -h / 2); ctx.stroke();
  ctx.fillStyle = GOLD.body; ctx.fillRect(-w * .38, h * .22, w * .5, Math.max(2, h * .08));
  ctx.restore();
}

export default (T, R) => {
  const G = (p, after = R.a - .5) => T.G(p, 0, after);
  const k = {};
  k.fix = G('His fix'); k.tax = G('tax the machine', k.fix); k.the1 = G('the machine', k.tax); k.mach = G("machine's", k.tax); k.work = G('work', k.mach);
  k.taxAI = G('Tax artificial intelligence and robots'); k.robots = G('robots', k.taxAI); k.by = G('by how much', k.robots); k.how = G('how much', k.by); k.used = G('used', k.how);
  k.money = G('The money goes into retraining'); k.retr = G('retraining', k.money); k.stronger = G('stronger safety net', k.retr); k.safety = G('safety', k.stronger); k.net = G('net', k.safety);
  k.res = G('The artificial intelligence researcher'); k.oren = G('Oren Etzioni', k.res); k.says = G('says Gates', k.oren);
  k.diag = G('diagnosis right', k.says); k.right = G('right', k.diag); k.presc = G('prescription wrong', k.right); k.wrong = G('wrong', k.presc); k.places = G('places', k.wrong);
  k.taxing = G("Taxing the machine's work"); k.isLike = G('is like taxing', k.taxing); k.like = G('like', k.isLike); k.taxing2 = G('taxing keystrokes', k.isLike); k.keys = G('keystrokes', k.taxing2);
  k.on = G('on a typewriter', k.keys); k.a = G('a typewriter', k.keys); k.typew = G('typewriter', k.keys);
  k.counts = G('It counts how hard'); k.works = G('works', k.counts); k.notW = G('Not whether anyone lost', k.counts); k.lost = G('lost a job', k.notW); k.job = G('job', k.lost);
  k.even = G('And even a perfect tax'); k.perfect = G('perfect', k.even); k.leaves = G('leaves a gap', k.even); k.gap = G('gap', k.leaves);
  k.moneyC = G('Money can replace a paycheck'); k.paycheck = G('paycheck', k.moneyC); k.cant = G("It can't replace being", k.paycheck); k.replace2 = G('replace being', k.cant); k.being = G('being needed', k.cant); k.needed = G('needed', k.being);
  k.second = G("That's where his second idea"); k.secW = G('second', k.second); k.idea = G('idea', k.secW); k.theList = G('The list', k.second); k.listW = G('list', k.theList);
  k.hr = G('Human Reserved', k.theList); k.reserved = G('Reserved', k.hr); k.inWords = G('In his words', k.hr);
  k.q = {}; { let a = G('as artificial intelligence and robots improve', k.inWords); k.q.as = a;
    for (const w of ['artificial', 'and', 'robots', 'improve', "we'll", 'set', 'aside', 'certain', 'things', 'for', 'only', 'people', 'to', 'do']) { a = G(w, a + .01); k.q[w] = a; } }
  k.cand = G('The candidates named so far'); k.candW = G('candidates', k.cand); k.soFar = G('so far', k.candW); k.far = G('far', k.soFar);
  k.children = G('looking after children', k.cand); k.childW = G('children', k.children); k.jury0 = G('Sitting on a jury', k.cand); k.jury = G('jury', k.jury0);
  k.art0 = G('Making art', k.jury0); k.art = G('art', k.art0);
  k.teach0 = G('And in teaching', k.art0); k.teach = G('teaching', k.teach0); k.person = G('a person stays in charge', k.teach); k.charge = G('charge', k.person);
  k.uses = G('uses the machine as a tool', k.charge); k.machine = G('machine', k.uses); k.tool = G('tool', k.machine);
  const SEAM = R.b - S.SEAM_HALF;

  // ------------------------------------------------------------------ 6.01–6.03 the machine tile, its clones, the meters, the coins
  const AIP = [600, 360], RBP = [1320, 360], TS = 190;
  const split = (t) => quartIO(span(t, k.taxAI - .1, k.taxAI + .9));
  const tilesOut = (t) => expoIn(span(t, k.res - .45, k.res + .3));
  const tileAt = (t, side) => { const m = MTILE(t), u = split(t), p = side < 0 ? AIP : RBP; return { x: lerp(m.x, p[0], u), y: lerp(m.y, p[1], u) - 30 * Math.sin(Math.PI * u) - 420 * tilesOut(t), s: lerp(m.s, TS, u) }; };
  const slotU = (t) => expoOut(span(t, k.tax - .1, k.tax + .45));
  // the meters: steps (each step = one coin of tax); the AI meter runs faster than the robots' meter
  const EMIT = (() => {
    const out = [], end = k.res - .5;
    for (let te = k.taxAI + .9; te < end; te += .3) out.push({ side: -1, te });
    for (let te = k.robots + .45; te < end; te += .62) out.push({ side: 1, te });
    return out.sort((p, q) => p.te - q.te).map((e, i) => ({ ...e, dest: i % 2 ? 1 : -1 }));
  })();
  const steps = (t, side) => EMIT.filter((e) => e.side === side && e.te <= t).length;
  const TRAY = { x0: 760, x1: 1160, y: 640 };
  const BENCH = [470, 830], NET = { x0: 1240, x1: 1660, y: 800 };
  const destU = (t) => expoOut(span(t, k.money - .1, k.money + .7)), destOut = (t) => expoIn(span(t, k.res - .5, k.res + .3));
  function machineTiles(ctx, t) {
    if (t > k.res + .4) return;
    const u = split(t), su = slotU(t);
    for (const side of u > 0 ? [-1, 1] : [-1]) {
      const p = tileAt(t, side);
      F.tile(ctx, t, p.x, p.y, p.s, { cold: 1, lift: .6, v: 1, glyph: side < 0 ? 'screen' : null, ga: span(t, k.taxAI + .2, k.taxAI + .8) });
      if (side > 0 && u > .5) { ctx.save(); ctx.beginPath(); ctx.roundRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s, p.s * .16); ctx.clip(); E.robot(ctx, p.x, p.y + p.s * .42, p.s * .62, { rim: MACH.hot, body: MACH.deep, alpha: span(u, .5, 1) * .9 }); ctx.restore(); }
      if (su > 0) {   // the coin slot
        const sw = p.s * .5 * su, sy = p.y - p.s * .5 + p.s * .14;
        ctx.save(); ctx.fillStyle = mixHex(P.night0, MACH.deep, .3); ctx.beginPath(); ctx.roundRect(p.x - sw / 2, sy - 7, sw, 14, 7); ctx.fill(); ctx.restore();
        F.goldSpan(ctx, [[p.x - sw / 2, sy + 9], [p.x + sw / 2, sy + 9]], 0, 1, { w: 1.6, spark: false, a: su * (1 - tilesOut(t)) });
      }
      // the meter under the tile (a counter, steps of use)
      const mu = span(t, side < 0 ? k.taxAI + .5 : k.robots, side < 0 ? k.taxAI + 1.1 : k.robots + .6) * (1 - tilesOut(t));
      if (mu > 0) {
        const n = steps(t, side), v = side < 0 ? n * 48211 + Math.floor(clamp(t - k.taxAI - .9, 0, 99) * 31337) : n * 3 + Math.floor(clamp(t - k.robots, 0, 99) * 2);
        lab(ctx, side < 0 ? 'AI' : 'ROBOTS', p.x, p.y + p.s / 2 + 52, mu, { size: 30, align: 'center', col: CREAM, weight: 700 });
        lab(ctx, `${v.toLocaleString('en-US')} ${side < 0 ? 'TOKENS' : 'UNITS OF USE'}`, p.x, p.y + p.s / 2 + 88, mu, { size: 22, align: 'center', col: MACH.hot, spacing: .08 });
      }
    }
  }
  function coinsAndTray(ctx, t) {
    if (t < k.taxAI + .8 || t > k.res + .6) return;
    const tu = sineIO(span(t, k.by - .3, k.by + .5)), tout = destOut(t);
    if (tu > 0) {
      F.goldSpan(ctx, [[TRAY.x0, TRAY.y], [TRAY.x1, TRAY.y]], .5 - .5 * tu, .5 + .5 * tu, { w: 3, spark: false, a: 1 - tout });
      lab(ctx, SRC.byUse, 960, TRAY.y + 52, span(t, k.by, k.by + .6), { size: 28, align: 'center', col: GOLD.text, gold: .4, out: tout });
    }
    for (const e of EMIT) {
      if (t < e.te) continue;
      const p = tileAt(e.te, e.side), q1 = span(t, e.te, e.te + .75);
      const start = [p.x, p.y - p.s * .36], land = [lerp(TRAY.x0 + 40, TRAY.x1 - 40, e.side < 0 ? .25 : .75) + ((e.te * 37) % 1) * 40 - 20, TRAY.y - 12];
      let pos, r = 13, a = 1;
      if (q1 < 1) pos = quad(start, [lerp(start[0], land[0], .5), start[1] - 120], land, sineIO(q1));
      else if (t < k.money + .2 || e.te < k.money - 1.2 && t < e.te + .9) { pos = land; a = 1 - span(t, e.te + .75, e.te + .9); if (a <= 0) continue; }
      else {   // 6.03: paid out from the tray, alternately to retraining and the safety net
        const t2 = Math.max(e.te + .75, k.money + .1 + (EMIT.indexOf(e) % 7) * .05), q2 = span(t, t2, t2 + .9);
        const dst = e.dest < 0 ? [BENCH[0] + 40, BENCH[1] - 60] : [(NET.x0 + NET.x1) / 2, NET.y - 40];
        if (q2 >= 1) continue;
        pos = quad(land, [lerp(land[0], dst[0], .5), land[1] - 80], dst, sineIO(q2)); a = 1 - span(q2, .8, 1); r = lerp(13, 10, q2);
      }
      coin(ctx, pos[0], pos[1] - 300 * tout, r, { a, spin: q1 < 1 ? q1 * 3 : 0 });
    }
  }
  function destinations(ctx, t) {
    const u = destU(t), out = destOut(t); if (u <= 0 || out >= 1) return;
    ctx.save(); ctx.translate(0, 260 * (1 - u) + 300 * out);
    // RETRAINING: a lit workbench, a person learning at it
    const [bx, by] = BENCH;
    halo(ctx, bx + 40, by - 90, 260, .38, AMBER.body, AMBER.core);
    ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.fillRect(bx - 150, by - 70, 300, 22); ctx.fillRect(bx - 140, by - 48, 14, 48); ctx.fillRect(bx + 126, by - 48, 14, 48);
    ctx.fillStyle = rgba(AMBER.body, .85); ctx.fillRect(bx - 150, by - 72, 300, 4);
    ctx.strokeStyle = mixHex(P.night1, P.ind2, .5); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(bx + 110, by - 72); ctx.lineTo(bx + 90, by - 150); ctx.lineTo(bx + 40, by - 170); ctx.stroke();
    halo(ctx, bx + 40, by - 160, 60, .8, AMBER.body, AMBER.core);
    F.tile(ctx, t, bx + 10, by - 98, 46, { glyph: 'screen', ga: 1, v: .9 });
    E.person(ctx, bx - 70, by, 140, { pose: 'reach', rim: AMBER.body, light: 1 });
    // A STRONGER SAFETY NET: small figures on a line, a gold mesh strung under them (draws on "safety net")
    const mu = sineIO(span(t, k.stronger - .1, k.net + .5)), x0 = NET.x0, x1 = NET.x1, y = NET.y;
    ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0, y - 120); ctx.lineTo(x1, y - 120); ctx.stroke();
    for (let i = 0; i < 5; i++) E.person(ctx, x0 + 50 + i * 80 + 6 * Math.sin(t * .8 + i), y - 120, 70, { walk: t * 3 + i * 1.3, view: 'side', rim: AMBER.body });
    for (let j = 0; j < 4; j++) {
      const sag = 26 + j * 6, pts = Array.from({ length: 21 }, (_, i) => { const q = i / 20; return [lerp(x0, x1, q), y - 20 + j * 16 + sag * Math.sin(Math.PI * q) * (1 + .03 * Math.sin(t * 1.4 + j))]; });
      F.goldSpan(ctx, pts, 0, mu, { w: 1.4, spark: mu < 1 && j === 0 });
    }
    for (let i = 0; i <= 8; i++) { const x = lerp(x0, x1, i / 8), q = i / 8, s = Math.sin(Math.PI * q); F.goldSpan(ctx, [[x, y - 20 + 26 * s], [x, y + 28 + 44 * s]], 0, span(mu, i / 10, i / 10 + .3), { w: 1.1, spark: false, a: .7 }); }
    ctx.fillStyle = mixHex(P.night1, P.ind2, .6); ctx.fillRect(x0 - 8, y - 130, 8, 170); ctx.fillRect(x1, y - 130, 8, 170);
    ctx.restore();
    lab(ctx, SRC.taxUses[0], bx, 920 - 28, span(t, k.retr - .1, k.retr + .5), { size: 28, align: 'center', col: CREAM, out: out });
    lab(ctx, SRC.taxUses[1], (x0 + x1) / 2, 920 - 28, span(t, k.stronger - .1, k.stronger + .5), { size: 28, align: 'center', col: GOLD.text, out: out });
  }

  // ------------------------------------------------------------------ 6.04 Etzioni: a coin unfolds into his quote card
  const QSIZE = 54, QW = 1100, QX = (W - QW) / 2, QY = 300;
  const QH = (() => { const words = SRC.etzioni.split(/\s+/), lines = []; let cur = []; for (const wd of words) { const nx = [...cur, wd]; if (cur.length && F.measure(nx.join(' '), QSIZE, true) > QW - 108) { lines.push(cur); cur = [wd]; } else cur = nx; } if (cur.length) lines.push(cur); return 24 + lines.length * QSIZE * 1.22 + 92; })();
  const QBOX = { x: QX, y: QY, w: QW, h: QH };
  const COIN0 = [960, 470];
  const unfold = (t) => quartIO(span(t, k.res + .35, k.res + 1.3));
  const toPaper = (t) => quartIO(span(t, k.taxing - .2, k.taxing + .85));
  const TW = { cx: 960, top: 560 };   // the typewriter
  const twShift = (t) => -210 * quartIO(span(t, k.counts - .1, k.counts + .9));
  const twUp = (t) => quartIO(span(t, k.taxing - .2, k.taxing + .8)), twOut = (t) => expoIn(span(t, k.even - .25, k.even + .55));
  const PAPERR = (t) => ({ x: TW.cx - 180 + twShift(t) + carriage(t), y: 330 + 400 * (1 - twUp(t)) + 500 * twOut(t), w: 360, h: 250 });
  const KEYT = (() => { const r = E.prng(4701), out = []; let te = k.taxing + 1.0; while (te < k.even - .3) { out.push({ te, key: Math.floor(r() * 30) }); te += te < k.counts ? .15 + r() * .1 : .07 + r() * .04; } return out; })();
  const presses = (t) => { let n = 0; for (const p of KEYT) if (p.te <= t) n++; else break; return n; };
  const carriage = (t) => {   // steps 7 px a key; the return at the line's end glides back (.35 s) instead of snapping
    const n = presses(t), w = Math.floor(n / 22) * 22, back = w > 0 ? 154 * (1 - sineIO(span(t, KEYT[w - 1].te, KEYT[w - 1].te + .35))) : 0;
    return -((n % 22) * 7) - back;
  };
  function etzioni(ctx, t) {
    if (t < k.res + .2 || t > k.taxing + 1) return;
    const uf = unfold(t), tp = toPaper(t);
    if (uf < 1) {   // the coin rises from the tray, spins edge-on and opens into the card
      const rise = quartIO(span(t, k.res + .0, k.res + .5)), p = lerpP([960, TRAY.y - 12], COIN0, rise);
      if (uf <= 0) { coin(ctx, p[0], p[1], lerp(13, 40, rise), { spin: rise * 1.5 }); halo(ctx, p[0], p[1], 90, .4, GOLD.halo, GOLD.core); return; }
      const r = lerpR({ x: COIN0[0] - 40 * Math.max(.1, 1 - uf * 3), y: COIN0[1] - 40, w: 80 * Math.max(.1, 1 - uf * 3), h: 80 }, QBOX, span(uf, .15, 1));
      paperRect(ctx, r, -.006 * uf);
      return;
    }
    const pr = PAPERR(t), rr = lerpR(QBOX, pr, tp);
    ctx.save(); ctx.translate(rr.x, rr.y); ctx.scale(rr.w / QBOX.w, rr.h / QBOX.h); ctx.translate(-QBOX.x, -QBOX.y);
    F.quoteCard(ctx, t, T, { text: SRC.etzioni, w: QW, size: QSIZE, x: QX, y: QY, u: lerp(.4, 1, span(t, k.res + 1.3, k.res + 2.4)), spoken: ['has the diagnosis', 'some places'], after: k.says, mode: 'hi', credit: 'OREN ETZIONI · ABC NEWS · AUG 2026' });
    const blank = Math.max(sineIO(span(tp, .35, 1)), 1 - sineIO(span(t, k.res + 1.3, k.res + 1.75)));   // blank paper → the printed quote surfaces → wipes off again into the typewriter's blank sheet   // the printed quote wipes off as the card becomes the blank sheet in the typewriter
    if (blank > 0) { ctx.save(); ctx.globalAlpha *= blank; paperRect(ctx, QBOX, -.006 * (1 - tp)); ctx.restore(); }
    ctx.restore();
    // the nameplate (his role, as the fact check has it) and the two verdict tags
    const out = span(t, k.taxing - .35, k.taxing + .1);
    if (out < 1) {
      ctx.save(); ctx.globalAlpha *= 1 - out;
      F.nameplate(ctx, t, QX + 18, QY - 78, span(t, k.oren - .1, k.oren + .6) * (1 - out), 'OREN ETZIONI', 'FOUNDING CEO, ALLEN INSTITUTE FOR AI');
      ctx.restore();
      const ty = QY + QH + 86, d = span(t, k.right - .1, k.right + .45), q = span(t, k.wrong - .1, k.wrong + .45);
      lab(ctx, 'DIAGNOSIS', 700, ty, d, { size: 32, col: GOLD.text, gold: .5, weight: 700, align: 'right', out });
      if (d > 0 && out < 1) F.goldSpan(ctx, [[722, ty - 14], [736, ty - 1], [764, ty - 32]], 0, sineIO(span(t, k.right + .15, k.right + .55)), { w: 3.6, spark: false, a: 1 - out });
      lab(ctx, 'PRESCRIPTION', 1150, ty, q, { size: 32, col: CREAM, weight: 700, align: 'right', out });
      lab(ctx, '?', 1172, ty, span(t, k.wrong + .1, k.wrong + .5), { size: 40, col: CREAM, weight: 700, out });
      lab(ctx, 'AT LEAST IN SOME PLACES', 1150, ty + 40, span(t, k.places - .3, k.places + .3), { size: 22, align: 'right', out });
    }
  }
  // ------------------------------------------------------------------ 6.05/6.06 the typewriter, the counter, the empty chair
  const KEYS = (() => { const out = []; [11, 10, 9].forEach((n, row) => { for (let i = 0; i < n; i++) out.push([(i - (n - 1) / 2) * 54 + row * 10, 106 + row * 50]); }); return out; })();
  const PILE = [1470, 820];
  function typewriter(ctx, t) {
    const up = twUp(t), out = twOut(t); if (up <= 0 || out >= 1) return;
    const cx = TW.cx + twShift(t), dy = 420 * (1 - up) + 500 * out, top = TW.top + dy;
    ctx.save();
    // body
    ctx.fillStyle = lin(ctx, 0, top, 0, top + 250, [[0, mixHex(P.ind2, P.blue1, .4)], [1, mixHex(P.night1, P.ind1, .5)]]);
    ctx.beginPath(); ctx.moveTo(cx - 330, top + 30); ctx.lineTo(cx + 330, top + 30); ctx.lineTo(cx + 380, top + 250); ctx.lineTo(cx - 380, top + 250); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(P.blue1, .8); ctx.lineWidth = 2; ctx.stroke();
    // platen roller + knobs (the paper comes out from behind it)
    ctx.fillStyle = mixHex(P.night0, P.ind2, .4); ctx.beginPath(); ctx.roundRect(cx - 320 + carriage(t), top - 10, 640, 40, 20); ctx.fill();
    ctx.fillStyle = rgba(P.blue1, .9); ctx.fillRect(cx - 316 + carriage(t), top - 4, 632, 5);
    for (const sx of [-1, 1]) { ctx.fillStyle = mixHex(P.ind2, P.blue1, .5); ctx.beginPath(); ctx.arc(cx + sx * 344 + carriage(t), top + 10, 22, 0, TAU); ctx.fill(); }
    // keys: each press dips a key and warms it
    KEYS.forEach(([kx, ky], i) => {
      let p = 0; for (const e of KEYT) { if (e.key === i % 30 && t >= e.te && t < e.te + .14) p = Math.max(p, Math.sin(Math.PI * (t - e.te) / .14)); }
      ctx.fillStyle = mixHex(mixHex(P.night1, P.ind2, .4), AMBER.body, .7 * p); ctx.beginPath(); ctx.arc(cx + kx, top + ky + 4 * p, 19, 0, TAU); ctx.fill();
      ctx.strokeStyle = rgba(CREAM2, .45); ctx.lineWidth = 2; ctx.stroke();
    });
    ctx.restore();
  }
  function typedSheet(ctx, t) {   // the paper in the typewriter after the card has become it: typed lines + the counter
    if (t < k.taxing + .85 || twOut(t) >= 1) return;
    const r = PAPERR(t), n = presses(t);
    ctx.save(); ctx.beginPath(); ctx.rect(r.x - 20, 0, r.w + 40, TW.top + 420 * (1 - twUp(t)) + 500 * twOut(t) + 2); ctx.clip();
    paperRect(ctx, r, 0);
    // typed marks: one per keystroke, in lines
    ctx.fillStyle = rgba(PAPER.ink, .55);
    const i0 = Math.max(0, (Math.floor(n / 22) - 3) * 22);
    for (let i = i0; i < n; i++) { const ln = Math.floor((i - i0) / 22), c = i % 22; ctx.fillRect(r.x + 36 + c * 13, r.y + 176 + ln * 22, 8, 10); }
    const cu = span(t, k.counts - .1, k.counts + .5);
    if (cu > 0) {
      ctx.fillStyle = lin(ctx, 0, r.y, 0, r.y + 150, [[0, rgba(PAPER.lit, .96)], [1, rgba(PAPER.lit, .9)]]); ctx.fillRect(r.x + 10, r.y + 12, r.w - 20, 140 * cu);
      F.maskLine(ctx, [['KEYSTROKES COUNTED', 0]], r.x + 30, r.y + 50, 20, F.rise(cu), { serif: false, weight: 600, col: PAPER.faint, glow: false });
      F.maskLine(ctx, [[(n * 41).toLocaleString('en-US'), 0]], r.x + 28, r.y + 128, 76, F.rise(cu), { serif: true, col: mixHex(PAPER.ink, GOLD.deep, .5), glow: false });
    }
    ctx.restore();
  }
  function keyCoins(ctx, t) {   // every keystroke drops a coin: out of the typewriter's side, onto a pile
    if (t < k.taxing + 1 || t > k.moneyC + 1.2) return;
    const out = twOut(t), gather = quartIO(span(t, k.even + .1, k.perfect + .6));
    const cx = TW.cx + twShift(t) + 370, cy = TW.top + 120;
    let piled = 0;
    for (const e of KEYT) {
      if (t < e.te) break;
      const q = span(t, e.te, e.te + .55), j = KEYT.indexOf(e), land = [PILE[0] + ((j * 53) % 90) - 45, PILE[1] - 6 - Math.min(14, Math.floor(j / 6)) * 7];
      if (q < 1) { const p = quad([cx, cy], [cx + 60, cy - 120], land, q); coin(ctx, p[0], p[1], 12 * expoOut(span(q, 0, .18)), { spin: q * 3 }); }
      else piled++;
    }
    // the pile: drawn coins stacked; gathers into the paycheck (6.07)
    const shown = Math.min(piled, 60);
    for (let j = 0; j < shown; j++) {
      const land = [PILE[0] + ((j * 53) % 90) - 45, PILE[1] - 6 - Math.min(14, Math.floor(j / 6)) * 7], to = lerpP(land, [PILE[0], PILE[1] - 40], gather);
      coin(ctx, to[0], to[1] - 220 * gather * gather, 12 * (1 - .7 * gather), { a: 1 - span(gather, .7, 1) });
    }
    void out;
  }
  const CH0 = [1500, 800];
  const chairPos = (t) => { const m = quartIO(span(t, k.moneyC - .1, k.moneyC + 1.0)); return { p: lerpP(CH0, [930, 790], m), s: lerp(1, 1.3, m), m }; };
  function chairScene(ctx, t) {
    const u = expoOut(span(t, k.notW - .3, k.notW + .5)), sinkL = expoIn(span(t, k.second - .1, k.second + .7));
    if (u <= 0 || sinkL >= 1) return;
    const { p, s, m } = chairPos(t);
    ctx.save(); ctx.translate(0, 420 * sinkL);
    halo(ctx, p[0], p[1] - 150, 220 * (1 - m * .5), .25 * u * (1 - m), P.halo2, CREAM);
    ctx.fillStyle = rgba(P.halo2, .08 * u * (1 - m)); ctx.beginPath(); ctx.ellipse(p[0], p[1], 150, 22, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.rect(0, 0, W, p[1] + 2); ctx.clip();
    chair(ctx, p[0], p[1] + 260 * (1 - u), s, 1);
    ctx.restore();
    // LOST A JOB? — the readout that never moves
    const lu = span(t, k.lost - .2, k.lost + .4), lout = span(t, k.even - .2, k.even + .2);
    if (lu > 0 && lout < 1) {
      lab(ctx, 'LOST A JOB?', CH0[0], 440, lu, { size: 32, col: CREAM, weight: 700, align: 'center', out: lout });
      const b = { x: CH0[0] - 100, y: 466, w: 200, h: 64 };
      ctx.save(); ctx.globalAlpha *= lu * (1 - lout); ctx.strokeStyle = rgba(CREAM2, .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(b.x, b.y, b.w, b.h, 10); ctx.stroke();
      ctx.globalAlpha *= .55 + .3 * Math.sin(t * 2.2); E.glowText(ctx, '— —', CH0[0], b.y + 44, { size: 32, align: 'center', col: CREAM2, glow: false }); ctx.restore();
      lab(ctx, 'NO READING', CH0[0], 566, span(t, k.job, k.job + .5), { size: 22, align: 'center', out: lout });
    }
  }
  // ------------------------------------------------------------------ 6.07 two slots · 6.08 ★ your desk · 6.09 the slot grows into the list
  const SA = { x: 560, y: 300, w: 340, h: 230 }, SB = { x: 1020, y: 300, w: 340, h: 230 };
  const FRAME = { x: 820, y: 170, w: 500, h: 340 }, L = S.JURY_LIST;
  const slotsU = (t) => span(t, k.even - .1, k.perfect + .4);
  const toDesk = (t) => quartIO(span(t, k.moneyC - .15, k.moneyC + 1.05));
  const toList = (t) => quartIO(span(t, k.second + .1, k.idea + .9));
  const listU = (t) => sineIO(span(t, k.idea + .45, k.listW + .35));
  const deskOut = (t) => expoIn(span(t, k.second - .05, k.second + .75));
  const DESK = { cx: 1070, top: 760, w: 760 };
  function payAt(t) {   // the paycheck: out of the coin pile, into slot A, onto the desk
    const g = quartIO(span(t, k.perfect + .3, k.leaves + .1)), d = toDesk(t);
    let p = lerpP([PILE[0], PILE[1] - 260], [SA.x + SA.w / 2, SA.y + SA.h / 2], g); p[1] -= 90 * Math.sin(Math.PI * g);
    p = lerpP(p, [DESK.cx + 70, DESK.top - 14], d);
    return { p, w: lerp(lerp(30, 220, span(g, 0, .6)), 150, d), rot: lerp(0, -.05, d), a: span(t, k.perfect + .25, k.perfect + .5) };
  }
  function slots(ctx, t) {
    const u = slotsU(t); if (u <= 0) return;
    const d = toDesk(t), lst = toList(t), so = deskOut(t);
    // slot A: dashed, it goes away with the desk scene (sinks); slot B: the empty one → the wall frame → the list
    if (d < 1) dashRect(ctx, SA, sineIO(u), 1 - d);
    lab(ctx, 'MONEY', SA.x + SA.w / 2, SA.y + SA.h + 44, span(t, k.leaves - .5, k.leaves), { size: 26, align: 'center', col: GOLD.text, out: d });
    const rb = lerpR(lerpR(SB, FRAME, d), { x: L.x, y: L.y, w: L.w, h: L.h }, lst);
    if (lst < 1) {
      const gapPulse = bumpT(t, k.gap - .1, 1.2);
      if (d < 1) dashRect(ctx, rb, sineIO(span(u, .15, 1)), 1 - d, mixHex(CREAM, GOLD.line, gapPulse));
      if (d > 0) {   // the empty frame on the wall: dark inside, a thin cream rim → gold as it becomes the list
        ctx.save(); ctx.fillStyle = rgba(P.night0, .5 * d * (1 - lst)); ctx.fillRect(rb.x, rb.y, rb.w, rb.h);
        ctx.strokeStyle = rgba(mixHex(CREAM, GOLD.line, lst), (.55 + .3 * lst) * d); ctx.lineWidth = 2.5; ctx.strokeRect(rb.x, rb.y, rb.w, rb.h); ctx.restore();
      }
      halo(ctx, rb.x + rb.w / 2, rb.y + rb.h / 2, 160, .25 * gapPulse, P.halo2, CREAM);
    }
    // the gold rim holds until the list has fully risen inside it, then hands over to the list's own rule
    const lu = listU(t), rimA = lst * (1 - span(lu, .75, 1));
    if (lst > 0 && rimA > 0) F.goldSpan(ctx, [[rb.x, rb.y], [rb.x + rb.w, rb.y], [rb.x + rb.w, rb.y + rb.h], [rb.x, rb.y + rb.h], [rb.x, rb.y]], 0, 1, { w: 1.6, spark: false, a: rimA });
    void so;
  }
  function desk(ctx, t) {
    const d = toDesk(t), out = deskOut(t); if (d <= 0 || out >= 1) return;
    const { cx, top, w } = DESK;
    ctx.save(); ctx.translate(0, 300 * (1 - d) + 420 * out);
    const lx = cx + w * .32, ly = top;
    halo(ctx, lx, ly - 120, 520, .38 * d, AMBER.body, AMBER.core);
    ctx.fillStyle = rgba(P.night0, .55); ctx.beginPath(); ctx.ellipse(cx, 900, w * .7, 22, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = mixHex(P.night1, P.ind1, .35); ctx.fillRect(cx - w / 2, top, w, 22); ctx.fillRect(cx - w / 2 + 20, top + 22, 22, 900 - top - 22); ctx.fillRect(cx + w / 2 - 42, top + 22, 22, 900 - top - 22);
    ctx.fillStyle = lin(ctx, cx - w / 2, 0, cx + w / 2, 0, [[0, rgba(AMBER.shade, .5)], [.7, rgba(AMBER.body, .9)], [1, rgba(AMBER.shade, .6)]]); ctx.fillRect(cx - w / 2, top, w, 4);
    ctx.strokeStyle = mixHex(P.night1, P.ind2, .5); ctx.lineWidth = 7; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx - 26, ly - 110); ctx.lineTo(lx + 36, ly - 160); ctx.stroke();
    ctx.fillStyle = lin(ctx, 0, ly - 170, 0, ly, [[0, rgba(AMBER.core, .34)], [1, rgba(AMBER.body, 0)]]); ctx.beginPath(); ctx.moveTo(lx + 24, ly - 150); ctx.lineTo(lx - 90, ly); ctx.lineTo(lx + 120, ly); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mixHex(AMBER.body, P.night1, .25); ctx.beginPath(); ctx.moveTo(lx + 8, ly - 178); ctx.lineTo(lx + 70, ly - 172); ctx.lineTo(lx + 50, ly - 136); ctx.lineTo(lx - 6, ly - 142); ctx.closePath(); ctx.fill();
    halo(ctx, lx + 30, ly - 146, 90, .75, AMBER.body, AMBER.core);
    ctx.restore();
  }
  // the list (6.09–6.12), converging onto plateJury
  const LINE_T = [[k.children - .1, k.childW + .3], [k.jury - .25, k.jury + .35], [k.art0, k.art + .3], [k.teach - .2, k.teach + .5]];
  function theList(ctx, t) {
    const lu = listU(t); if (lu <= 0) return;
    const lines = S.JURY_LINES.map((s, i) => ({ text: s, gold: .8, u: span(t, LINE_T[i][0], LINE_T[i][1]) }));
    F.list(ctx, t, L.x, L.y, L.w, L.h, { n: 7, u: lu, head: span(t, k.hr - .15, k.reserved + .6), lines, lit: t > k.jury - .1 ? 1 : undefined });
    // 6.12: a small cyan tool grows out of the teaching line's end ("uses the machine as a tool"), goes back into it before the seam
    const ln = F.list(ctx, t, L.x, L.y, L.w, L.h, { n: 7, u: 0 }).line(3), tu = expoOut(span(t, k.machine - .1, k.tool + .2)) * (1 - expoIn(span(t, SEAM - .75, SEAM - .2)));
    if (tu > 0) { const x = lerp(ln.x1, ln.x1 + 64, tu); F.tile(ctx, t, x, ln.y - 14, 40 * tu, { cold: 1, glyph: 'screen', ga: 1, lift: .4 }); }
  }

  // ------------------------------------------------------------------ the words
  function words(ctx, t) {
    F.say(ctx, t, [['TAX', k.tax], ['THE', k.the1], ['MACHINE’S', k.mach], ['WORK', k.work]], W / 2, 800, { size: 64, align: 'center', gold: [0], out: k.taxAI - .2 });
    F.say(ctx, t, [['TAX', k.taxAI], ['AI', k.taxAI + .5], ['AND', k.robots - .16], ['ROBOTS', k.robots]], W / 2, 222, { size: 60, align: 'center', out: k.money - .2 });
    F.say(ctx, t, [['RETRAINING', k.retr], ['+', k.retr + .5], ['A', k.stronger - .05], ['SAFETY', k.safety], ['NET', k.net]], W / 2, 222, { size: 60, align: 'center', gold: [0, 3, 4], out: k.res - .3 });
    // 6.05 the keystroke quote (Etzioni, ABC News), lit as the narrator says it
    if (t > k.taxing - .3 && t < k.counts + .5) {
      const u = F.rise(span(t, k.taxing - .2, k.taxing + .5)) * (1 - span(t, k.counts - .75, k.counts - .3));
      litWords(ctx, t, [['“taxing', k.taxing], ['tokens', null], ['is', k.isLike], ['like', k.like], ['taxing', k.taxing2], ['keystrokes', k.keys], ['on', k.on], ['a', k.a], ['typewriter”', k.typew]], 740, 180, 42, u, { align: 'center', gold: [5, 8] });
      lab(ctx, 'OREN ETZIONI · ABC NEWS · AUG 2026', 740, 226, span(t, k.taxing + .3, k.taxing + .9), { size: 20, align: 'center', out: span(t, k.counts - .75, k.counts - .35) });
    }
    F.say(ctx, t, [['IT', k.counts], ['COUNTS', k.counts + .16], ['HOW', k.counts + .45], ['HARD', k.counts + .68], ['IT', k.works - .2], ['WORKS', k.works]], W / 2 - 210, 190, { size: 56, align: 'center', gold: [3], out: k.even - .3 });
    F.say(ctx, t, [['EVEN', k.even + .4], ['A', k.perfect - .1], ['PERFECT', k.perfect], ['TAX', k.perfect + .6]], W / 2, 236, { size: 60, align: 'center', out: k.moneyC - .2 });
    F.say(ctx, t, [['LEAVES', k.leaves], ['A', k.leaves + .22], ['GAP', k.gap]], W / 2, 700, { size: 80, align: 'center', gold: [2], out: k.moneyC - .15 });
    // 6.08 ★
    F.say(ctx, t, [['MONEY', k.moneyC], ['CAN', k.moneyC + .27], ['REPLACE', k.moneyC + .44], ['A', k.paycheck - .1], ['PAYCHECK', k.paycheck]].slice(0, 3), 110, 400, { size: 56, out: k.cant - .15 });
    F.say(ctx, t, [['A', k.paycheck - .1], ['PAYCHECK', k.paycheck]], 110, 468, { size: 56, gold: [1], out: k.cant - .1 });
    F.say(ctx, t, [['IT', k.cant], ['CAN’T', k.cant + .07], ['REPLACE', k.replace2]], 110, 400, { size: 56, out: k.second - .1 });
    if (t > k.being - .4 && t < k.second + .6) {
      const d = toDesk(t), r = lerpR(SB, FRAME, d);
      halo(ctx, r.x + r.w / 2, r.y + r.h / 2, 220, .16 * span(t, k.being, k.needed + .5) * (1 - span(t, k.second - .1, k.second + .3)), P.halo2, CREAM);
      F.say(ctx, t, [['BEING', k.being]], r.x + r.w / 2, r.y + r.h / 2 - 6, { size: 84, align: 'center', out: k.second - .1 });
      F.say(ctx, t, [['NEEDED', k.needed]], r.x + r.w / 2, r.y + r.h / 2 + 82, { size: 84, align: 'center', out: k.second - .05 });
    }
    // 6.09–6.12 beside the list (left)
    F.say(ctx, t, [['HIS', k.secW - .2], ['SECOND', k.secW], ['IDEA', k.idea]], 120, 500, { size: 60, out: k.theList - .8 });
    F.say(ctx, t, [['THE', Math.max(k.theList, k.listW - .2)], ['LIST', k.listW]], 120, 500, { size: 60, gold: [1], out: k.inWords - .3 });
    if (t > k.inWords - .4 && t < k.cand + .3) {
      const qo = span(t, k.cand - .5, k.cand), u = (i) => F.rise(span(t, k.inWords + i * .1, k.inWords + .7 + i * .1)) * (1 - expoIn(qo));
      const q = k.q, Q = [
        [['“…as', q.as], ['AI', q.artificial], ['and', q.and], ['robots', q.robots]],
        [['improve,', q.improve], ['we’ll', q["we'll"]], ['set', q.set], ['aside', q.aside]],
        [['certain', q.certain], ['things', q.things], ['for', q.for], ['only', q.only]],
        [['people', q.people], ['to', q.to], ['do.', q.do], ['I’ve', null], ['started', null]],
        [['calling', null], ['this', null], ['domain', null]],
        [['Human', null], ['Reserved.”', null]]];
      Q.forEach((ln, i) => litWords(ctx, t, ln, 100, 290 + i * 62, 50, u(i), { gold: i === 1 ? [2, 3] : i === 3 ? [0] : [] }));
      lab(ctx, SRC.hrSrc, 102, 290 + 6 * 62 + 4, F.rise(span(t, k.inWords + .7, k.inWords + 1.3)) * (1 - qo), { size: 20 });
    }
    F.say(ctx, t, [['THE', k.candW - .1], ['CANDIDATES', k.candW]], 120, 470, { size: 56, out: k.teach - .3 });
    F.say(ctx, t, [['SO', k.soFar], ['FAR', k.far]], 120, 540, { size: 56, gold: [0, 1], out: k.teach - .25 });
    F.say(ctx, t, [['A', k.person], ['PERSON', k.person + .08], ['IN', k.charge - .14], ['CHARGE', k.charge]], 120, 470, { size: 56, gold: [1], out: SEAM - .7 });
    F.say(ctx, t, [['THE', k.machine - .07], ['MACHINE', k.machine], ['AS', k.tool - .2], ['A', k.tool - .1], ['TOOL', k.tool]], 120, 540, { size: 56, col: MACH.hot, out: SEAM - .65 });
  }

  // ------------------------------------------------------------------ the frame
  const draw = (ctx, t) => {
    F.stage(ctx, t);
    destinations(ctx, t);
    machineTiles(ctx, t);
    coinsAndTray(ctx, t);
    desk(ctx, t);
    chairScene(ctx, t);
    slots(ctx, t);
    if (t > k.perfect + .25 && deskOut(t) < 1) { const pc = payAt(t); ctx.save(); ctx.translate(0, 420 * deskOut(t)); envelope(ctx, pc.p[0], pc.p[1], pc.w, pc.rot, pc.a); ctx.restore();
      lab(ctx, 'PAYCHECK', pc.p[0], pc.p[1] - pc.w * .25 - 22 + 420 * deskOut(t), span(t, k.paycheck - .2, k.paycheck + .4), { size: 22, align: 'center', col: GOLD.text, out: span(t, k.cant, k.cant + .4) }); }
    typewriter(ctx, t);
    typedSheet(ctx, t);
    etzioni(ctx, t);
    keyCoins(ctx, t);
    theList(ctx, t);
    words(ctx, t);
    F.timeline(ctx, t, T);
  };
  return [
    { t: R.a, draw, print: F.PRINT41 },
    { t: SEAM, draw: (ctx, t) => S.plateJury(ctx, t, T), print: F.PRINT41 },
  ];
};
