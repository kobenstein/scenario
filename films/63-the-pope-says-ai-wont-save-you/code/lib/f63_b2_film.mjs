// Film 63 · builder B2 · c07 · c08 · c09 ('This channel exists for one reason' → 'In October the Pope'). Plan: docs/shots.md M.01–6.16.
// ONE continuous draw function for the whole group (the three chunk files return one entry each and share it, so the inner seams
// c07|c08 and c08|c09 are the same frame on both sides). Motifs are scheduled on phrases; every motif hands over through a carrier.
//
// | ID        | phrase                         | motif                                                              | carrier → next                 |
// |-----------|--------------------------------|--------------------------------------------------------------------|--------------------------------|
// | M.01–02   | This channel / So that         | "yes" card tips into a lit window; the town grows round it; the few towers, then every house | the windows |
// | M.03–04   | Want that too / subscribe      | push to your dark window; your sleeve, the SUBSCRIBE switch; the window lights | portal through the window → the bulb |
// | 4.17      | And what happens to you        | the bulb; AND YOUR WORK?                                           | the bulb clones into factory lamps |
// | 5.01      | The last Pope called Leo       | factory hall 1891 in ink, belts, workers · RERUM NOVARUM · LEO XIII · 1891 | the hall shrinks into a medallion |
// | 5.02 · C3 | Ask this one                   | timeline 1891 → 2026, 135 YEARS · C3 grows out of the 2026 dot     | the 2026 dot                   |
// | 5.03–04   | Perhaps even greater / size    | the dot grows past 1891 · ×10: ten 1891 circles = one (equal area) · Hassabis | the big circle → the bulb |
// | 5.05–06   | hand over / what goes with it  | the workbench, your hand on the switch · lights off: nod, piece, walk lift away | the finished piece |
// | 5.07–08   | Work, he writes                | §149 card lights as spoken · a figure finishes a piece, looks up   | the piece → the wage band      |
// | 5.09–11   | thinner paycheck / society / Richer | the band thins · 3 of 33 desks, 30 people outside (§154) · OUTPUT up, people smaller | the arrow → the bar |
// | 5.12–15   | The share … / lowest / cause / capital | one bar fills to 53.0 % (BLS) · the floor 1947 · pale causes · two streams (§160) | the streams flow out |
// | 5.16–17   | The day the letter / kill some | Scholl's post · job icons sink and rise                            | "ploughing fields" → iris      |
// | 5.18–21   | Cling / fair point / unproven / builders | the ploughman at dusk · the furrow → the band of the past → ? UNPROVEN · DO THE BUILDERS SEE IT? | the slot → a name card |
// | 6.01–04   | The day the Pope presented     | the synod hall, the odd card · the essay · CHRIS OLAH · the card flips: ? | the card               |
// | C4 · 6.05 | (clip) / A builder             | C4 grows out of the card · the hall huge, the speaker small        | the lectern panel (portal)     |
// | 6.06–08   | Every leading lab / And your work / If these systems | four pressures on a lab box (Olah) · the bulb and AND YOUR WORK? again · the empty bench, a hand to the displaced | the window (portal) |
// | 6.09      | For sharing the gains          | the world as dots: gains in a few places, pipes that stop · NO MECHANISM | the dots fly into two cards |
// | 6.10–12   | agree / Not engineered / Grown | POPE = OLAH · a blueprint drawn part by part · ★ a plant grows      | the leaves become flaps        |
// | 6.13–15   | Three days later / November / pressures | SERIES H $65 BILLION board · Nasdaq ticker · the pressures return, applause | the board collapses into the pivot |
// | 6.16      | What is left                   | mini scale BODY · MONEY · TIME, right pan empty · WHAT STAYS YOURS? → plateStays | seam plate |
import { createCanvas } from '@napi-rs/canvas';
import * as F from './f63_kit.mjs';
import * as S from './f63_seams.mjs';
import * as D from './f63_b2_draw.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, rise, GOLD, CREAM, PAPER } = F;
const { ser, gser, caps, inOut } = D;
const TAU = Math.PI * 2;
const bump = F.bump;
// F.question with an exit that sinks each word under its own baseline mask (the kit's `out` moves the mask with the words)
function question(ctx, t, text, x, y, size, o = {}) {
  const words = text.split(/\s+/), ts = o.ts, out = clamp(o.out ?? 0);
  if (out >= 1) return;
  let xx = x - F.measure(text, size, true) / 2;
  words.forEach((wd, i) => {
    const ui = Math.min(F.rise(span(t, ts[i] - .08, ts[i] + .42)), 1 - smooth(span(out, i / words.length * .4, i / words.length * .4 + .6)));
    const q = wd.endsWith('?'), base = q ? wd.slice(0, -1) : wd;
    if (ui > 0) {
      F.maskLine(ctx, [[base, 0]], xx, y, size, ui, { glow: false, col: CREAM });
      if (q) F.maskLine(ctx, [['?', 1]], xx + F.measure(base, size, true), y, size, ui, { glow: true, col: GOLD.body });
    }
    xx += F.measure(wd + ' ', size, true);
  });
}

const CACHE = new WeakMap();
export function b2Draw(T) { if (!CACHE.has(T)) CACHE.set(T, build(T)); return CACHE.get(T); }

function anchors(T) {
  const A0 = T.G('This channel exists for one reason');
  const G = (p, after = A0) => T.G(p, 0, after), GE = (p, after = A0) => T.GE(p, 0, after);
  const a = { yes: A0 };
  a.so = G('So that the arrival'); a.every = G('everybody', a.so); a.few = G('not only for the few'); a.own = G('who own it');
  a.want = G('Want that too'); a.subs = G('Then subscribe'); a.subsW = G('subscribe', a.subs);
  a.q417 = G('And what happens to you'); a.your = G('your work', a.q417); a.workW = G('work', a.your);
  a.last = G('The last Pope called Leo'); a.leo = G('Leo wrote', a.last); a.factory = G('factory workers'); a.indus = G('industrial revolution', a.last);
  a.ask = G('Ask this one'); a.big = G('how big', a.ask); a.newM = G('new machines', a.ask);
  const c3 = T.clip('C3'); a.c3s = c3.start; a.c3e = c3.end;
  a.perhaps = G('Perhaps even greater'); a.greater = G('greater', a.perhaps); a.size = G('On the size of it'); a.agreeB = G('the builders agree');
  a.hand = G('You would hand over'); a.wears = G('wears you out'); a.asks = G('He asks what goes');
  a.work149 = G('Work he writes'); a.instr = G('not simply an instrument'); a.expr = G('It expresses and enhances'); a.dignity = G('dignity of our lives');
  a.risk = G('The risk he sees'); a.notOnly = G('not only a thinner'); a.thinner = G('thinner paycheck');
  a.soc = G('It is a society'); a.fewBusy = G('keeps a few busy'); a.everyElse = G('everybody else'); a.nobody = G('nobody asked');
  a.richer = G('Richer and smaller'); a.smaller = G('smaller', a.richer);
  a.share = G('The share of American output'); a.working = G('working people', a.share); a.fifty = G('fifty-three percent'); a.fiftyE = GE('fifty-three percent');
  a.lowest = G('The lowest on record'); a.cause = G('The cause is disputed'); a.disputed = G('disputed', a.cause);
  a.but = G('But capital income'); a.replacing = G('replacing wages'); a.warns = G('he warns about');
  a.day = G('The day the letter came out'); a.pushed = G('pushed back'); a.kill = G('Machines kill some jobs'); a.make = G('make others', a.kill);
  a.cling = G('Cling to the old ones'); a.plough = G('ploughing fields'); a.fair = G('A fair point'); a.past = G('the past', a.fair);
  a.whether = G('Whether it holds'); a.unproven = G('unproven', a.whether); a.doB = G('Do the builders see');
  a.doW = T.GW('Do the builders see any of this', null, A0).map((w) => w.s);
  a.pres = G('The day the Pope presented'); a.cardinals = G('not only cardinals'); a.one = G('One speaker came'); a.promise = G('that promise', a.one);
  a.cof = G('A co-founder of Anthropic'); a.guess = G('Guess what he asked');
  const c4 = T.clip('C4'); a.c4s = c4.start; a.c4e = c4.end;
  a.bld = G('A builder of these machines'); a.vatican = G('in the Vatican', a.bld); a.critics = G('asking for critics');
  a.everyLab = G('Every leading lab'); a.ownInc = G('his own included'); a.press = G('works inside pressures'); a.right = G('doing the right thing');
  a.yw = G('And your work'); a.your2 = G('your', a.yw); a.work2 = G('work', a.your2);
  a.ifs = G('If these systems displace'); a.supporting = G('supporting them'); a.moral = G('moral imperative');
  a.share2 = G('For sharing the gains'); a.gains = G('the gains', a.share2); a.noMech = G('no mechanism exists');
  a.agree = G('He and the Pope even agree'); a.noteng = G('Not engineered'); a.grown = G('Grown', a.noteng);
  a.three = G('Three days later'); a.sixty = G('sixty-five billion dollars'); a.sixtyE = GE('sixty-five billion dollars');
  a.nov = G('In November it went public'); a.nasdaq = G('the Nasdaq', a.nov); a.press2 = G('The pressures he named'); a.applause = G('for the applause');
  a.left = G('What is left on the other side'); a.leftW = G('left', a.left); a.scaleW = G('scale', a.left);
  a.end = T.G('In October the Pope');
  return a;
}

function build(T) {
  const a = anchors(T);
  const tPlate = a.end - S.SEAM_HALF;

  // ======================================================================== the night ground: one glow that glides from motif to motif
  const GK = [
    [a.yes, 960, 470, 800, .6], [a.want, 960, 470, 800, .6], [a.subs + .6, 960, 320, 820, .75], [a.last, 960, 320, 820, .75],
    [a.ask + .4, 1500, 470, 900, .6], [a.size + .5, 1250, 440, 1000, .6], [a.hand, 960, 320, 820, .6], [a.work149 + .3, 640, 380, 1000, .55],
    [a.risk + .3, 960, 470, 1000, .55], [a.soc + .5, 960, 380, 1000, .5], [a.share + .3, 775, 450, 900, .6], [a.day + .5, 600, 420, 1000, .55],
    [a.fair + .5, 960, 540, 1000, .5], [a.doB + .3, 960, 560, 900, .6], [a.everyLab + .5, 960, 380, 900, .6], [a.yw + .2, 960, 320, 820, .75],
    [a.share2 + .6, 960, 420, 1100, .5], [a.noteng, 960, 380, 1000, .55], [a.grown + .3, 1350, 600, 900, .85], [a.three + .6, 960, 380, 1000, .6],
    [a.left + .8, W / 2, 520, 900, .7]];
  const bulbLitQ = (t) => smooth(span(t, a.subsW + .04, a.subsW + .5));
  const ground = (ctx, t) => {
    let i = 0; while (i < GK.length - 2 && t >= GK[i + 1][0]) i++;
    const A = GK[i], B = GK[i + 1], u = t <= A[0] ? 0 : t >= B[0] ? 1 : sineIO(span(t, A[0], B[0]));
    const g = [1, 2, 3, 4].map((k) => lerp(A[k], B[k], u));
    const dim = 1 - .62 * span(t, a.yes + 2, a.yes + 3) * (1 - bulbLitQ(t));
    F.night(ctx, t, { glow: [g[0], g[1], g[2], S.breathe(t, g[3] * dim)] });
  };
  const iris = (ctx, cx, cy, r, drawB) => F.iris(ctx, (c) => c.arc(cx, cy, Math.max(.5, r), 0, TAU), drawB, { rim: rgba(P.core1, .7), rimW: 3 });
  const look = F.look;
  const portalEase = (x) => { const r = .25, v = 1 / (1 - r); x = clamp(x); return x < r ? v * x * x / (2 * r) : x > 1 - r ? 1 - v * (1 - x) ** 2 / (2 * r) : v * (x - r / 2); };   // trapezoid speed: constant zoom rate through a portal, soft ends

  // ======================================================================== S1 · the town (M.01–M.04) and the portal into your window
  const tPortal0 = a.own - .1, tPortal1 = a.subsW + .7;   // one long fly-through into your window (no separate push: no lurch)
  const townCam = (t) => {
    t = Math.min(t, tPortal0);
    const c0 = 1 + S.CREEP * (t - a.yes), k1 = sineIO(span(t, a.yes + .3, a.yes + 2.8)), k2 = sineIO(span(t, a.every + .3, tPortal0));   // a slow pan that brings your window toward the centre before the fly-through
    let cx = 960, cy = lerp(H / 2 - 20, 540, k1), z = lerp(c0, .8, k1);
    cx = lerp(cx, 1340, k2); cy = lerp(cy, 580, k2);
    return [cx + F.drift(t, 4, 1) * k1 * (1 - k2), cy + F.drift(t, 3, 2) * k1 * (1 - k2), z * (1 + .01 * Math.sin(t * .3) * k1 * (1 - k2))];
  };
  const YW = D.TOWN_YES, MINE = D.TOWN_MINE;
  const winLit = (t) => (w) => {
    const dx = w.x + w.w / 2 - 960, dy = w.y + w.h / 2 - 470, d = Math.hypot(dx, dy);
    const tl = w.kind === 'tower' ? a.yes + 1.05 + d / 420 * .8 + w.order * .12 : a.every - .15 + d / 1100 * 1.25 + w.order * .2;
    return smooth(span(t, tl, tl + .3));
  };
  const drawTownSpace = (ctx, t) => {
    const ru = expoOut(span(t, a.yes + .2, a.yes + 1.9));
    D.town(ctx, t, { rise: ru, lit: winLit(t), yes: t > a.yes + 1.45 ? 1 : 0, mineLit: 0 });
    F.land(ctx, lerp(1300, 880, ru), { top: mixHex(P.ind1, P.night1, .45) });
    // the bracket over the few towers
    const bu = span(t, a.few - .05, a.few + .6) * (1 - span(t, a.own + .1, a.own + .6));
    if (bu > 0) F.trailCream(ctx, [[728, 300], [728, 270], [1192, 270], [1192, 300]], .5 - .5 * smooth(bu), .5 + .5 * smooth(bu), { w: 2.5 });
  };
  const drawYesMorph = (ctx, t) => {   // the card tips over and becomes the gold window
    const m1x = span(t, a.yes, a.yes + .95), m1 = .2 * m1x + .8 * sineIO(m1x), m2 = sineIO(span(t, a.yes + .95, a.yes + 1.5));
    if (t > a.yes + 1.5) return;
    if (m2 <= 0) {
      const s = lerp(1, .2, m1), tip = 1 - .3 * Math.sin(Math.PI * m1), g = smooth(span(m1, .35, .95));
      ctx.save(); ctx.translate(S.YES.x, S.YES.y); ctx.rotate(-.05 * Math.sin(Math.PI * m1)); ctx.scale(s, s * tip); ctx.translate(-S.YES.x, -S.YES.y);
      S.yesCard(ctx, t, S.YES.x, S.YES.y, S.YES.w, S.YES.h);
      if (g > 0) { ctx.fillStyle = rgba(D.WARM, g); ctx.beginPath(); ctx.roundRect(S.YES.x - S.YES.w / 2, S.YES.y - S.YES.h / 2, S.YES.w, S.YES.h, 22); ctx.fill(); }
      ctx.restore();
    } else {
      const w = lerp(S.YES.w * .2, YW.w, m2), h = lerp(S.YES.h * .2 * .7, YW.h, m2);
      ctx.fillStyle = D.WARM; ctx.beginPath(); ctx.roundRect(S.YES.x - w / 2, S.YES.y - h / 2, w, h, lerp(5, 0, m2)); ctx.fill();
    }
    F.halo(ctx, S.YES.x, S.YES.y, 90, .5 * smooth(span(m1, .4, 1)), P.halo0, P.core0);
  };
  const drawTown = (ctx, t) => {   // full frame, design space = screen
    ground(ctx, t);
    const [cx, cy, z] = townCam(t);
    look(ctx, cx, cy, z, () => { drawTownSpace(ctx, t); drawYesMorph(ctx, t); });
    // type on the voice (screen space)
    const out = span(t, a.own + .1, a.own + .6);
    gser(ctx, 'FOR EVERYBODY', 110, 190, 92, span(t, a.every - .12, a.every + .5) * (1 - out), { align: 'left' });
    const [lx, ly] = F.lookPt(cx, cy, z, 960, 246);
    caps(ctx, 'NOT ONLY THE FEW WHO OWN IT', lx, ly, span(t, a.few + .1, a.few + .7) * (1 - out), { size: 26, col: CREAM });
  };
  // the room behind your window (B of the portal): the bulb, the SUBSCRIBE switch, your sleeve; AND YOUR WORK?
  const SW = [1480, 600];
  const drawBulbFrame = (ctx, t, o = {}) => {
    ground(ctx, t);
    const lit = bulbLitQ(t);
    const by = o.bulbY ?? D.BULB[1];
    if (!o.noBulb) D.bulb(ctx, t, D.BULB[0], by, clamp(lit), { shade: o.shade });
    if (t < a.q417 + .6) {   // switch, label, sleeve; they leave to the right after the light is on
      const out = expoIn(span(t, a.subs + .75, a.q417 + .45)), dx = out * 760, reach = expoOut(span(t, a.want - .15, a.subsW - .06));
      const on = span(t, a.subsW - .02, a.subsW + .08);
      ctx.save(); ctx.translate(dx, 0);
      D.wallSwitch(ctx, SW[0], SW[1], on);
      caps(ctx, 'SUBSCRIBE', SW[0], SW[1] + 100, 1, { size: 26, col: GOLD.text });
      const hx = lerp(2140, SW[0] + 26, reach), hy = lerp(880, SW[1] + (on > .5 ? 10 : -14), reach) + 10 * bump(t, a.subsW - .06, .2);
      D.sleeve(ctx, 2150, 900, hx, hy);
      ctx.restore();
    }
    if (t > a.q417 - .2) question(ctx, t, 'AND YOUR WORK?', 960, 700, 110, { ts: [a.q417, a.your, a.workW], out: o.qOut ?? 0 });
  };
  const portalE = (t) => span(t, tPortal0, tPortal1);
  const S1 = (ctx, t) => {
    if (t < tPortal0) { drawTown(ctx, t); return; }
    const [cx, cy, z] = townCam(tPortal0), [wx, wy] = F.lookPt(cx, cy, z, MINE.x, MINE.y), win = { x: wx, y: wy, w: MINE.w * z, h: MINE.h * z };
    const dof = 20 * smooth(span(portalE(t), 0, .45));   // depth of field: the lit town goes soft as you fly at your own window
    F.portal(ctx, portalE(t), win, (c) => { if (dof > .05) c.filter = `blur(${dof.toFixed(2)}px)`; drawTown(c, t); c.filter = 'none'; }, (c) => drawBulbFrame(c, t), { ease: portalEase,
      over: (c) => { c.strokeStyle = mixHex(P.night1, P.ind1, .5); c.lineWidth = 8 * z; c.strokeRect(win.x, win.y, win.w, win.h); } });
  };

  // ======================================================================== S3 · the factory hall 1891 (5.01) grows round the bulb
  const LAMPX = [-3, -2, -1, 1, 2, 3];
  const facK = (t) => sineIO(span(t, a.last - .3, a.ask));
  const facCam = (t) => [960, lerp(540, 440, sineIO(span(t, a.last - .3, a.last + 1.5))), lerp(1, .92, facK(t)) * (1 + .006 * Math.sin(t * .4))];
  const drawFactorySpace = (ctx, t, o = {}) => {
    const build = span(t, a.last - .1, a.last + 1.9), wk = span(t, a.factory - .35, a.factory + .9), run = .15 + .85 * span(t, a.indus - .3, a.indus + .8);
    if (o.bg) ctx.fillStyle = mixHex(P.night0, P.ind0, .45), ctx.fillRect(-W, -H, W * 3, H * 3);
    D.factory(ctx, t, { build, workers: wk, run, bg: false });
    for (const j of LAMPX) { const u = expoOut(span(t, a.last - .2 + Math.abs(j) * .07, a.last + .75 + Math.abs(j) * .07)); if (u <= 0) continue; D.bulb(ctx, t + j, lerp(960, 960 + j * 330, u), 320, 1, { shade: 1 }); }
    D.bulb(ctx, t, 960, 320, 1, { shade: span(t, a.last - .3, a.last + .35) });
  };
  const S3 = (ctx, t) => {
    ground(ctx, t);
    const [cx, cy, z] = facCam(t);
    look(ctx, cx, cy, z, () => drawFactorySpace(ctx, t));
    question(ctx, t, 'AND YOUR WORK?', 960, 700, 110, { ts: [a.q417, a.your, a.workW], out: span(t, a.last - .45, a.last + .2) });
    gser(ctx, 'RERUM NOVARUM', 110, 150, 78, span(t, a.leo - .15, a.leo + .45), { align: 'left' });
    caps(ctx, 'LEO XIII · 1891 · ON THE CONDITION OF FACTORY WORKERS', 114, 198, span(t, a.leo + .25, a.leo + .85), { size: 24, col: CREAM, align: 'left' });
  };

  // ======================================================================== S4 · the timeline 1891 → 2026, C3, two circles, ×10 (5.02–5.04)
  const MED = [420, 470, 110], DOT = [1500, 470];
  const medK = (t) => sineIO(span(t, a.ask - .25, a.ask + .8));
  const medCan = createCanvas(240, 240), medCtx = medCan.getContext('2d');
  let medT = null;
  const medallion = (t) => {   // the hall in miniature, rendered once per frame into a small canvas (cloned up to ten times)
    if (medT === t) return medCan; medT = t;
    medCtx.setTransform(1, 0, 0, 1, 0, 0); medCtx.clearRect(0, 0, 240, 240);
    medCtx.save(); medCtx.beginPath(); medCtx.arc(120, 120, 118, 0, TAU); medCtx.clip();
    medCtx.translate(120, 120); medCtx.scale(.17, .17); medCtx.translate(-960, -520);
    medCtx.fillStyle = mixHex(P.night0, P.ind0, .5); medCtx.fillRect(-W, -H, W * 3, H * 3);
    drawFactorySpace(medCtx, t); medCtx.restore();
    return medCan;
  };
  const drawMed = (ctx, t, x, y, r) => {
    if (r <= .5) return;
    ctx.drawImage(medallion(t), x - r * 240 / 236, y - r * 240 / 236, r * 2 * 240 / 236, r * 2 * 240 / 236);
    ctx.strokeStyle = mixHex(P.cream, P.blue1, .25); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  };
  const bigR = (t) => t < a.size ? lerp(16, 230, expoOut(span(t, a.perhaps - .15, a.greater + .5))) * smooth(span(t, a.newM - .25, a.newM + .3)) : lerp(230, 190, sineIO(span(t, a.size, a.size + .7)));
  const bigC = (t) => [lerp(DOT[0], 1440, sineIO(span(t, a.size, a.size + .7))), lerp(DOT[1], 420, sineIO(span(t, a.size, a.size + .7)))];
  const GRID = Array.from({ length: 10 }, (_, i) => [560 + (i % 5 - 2) * 132, 360 + Math.floor(i / 5) * 132]);
  const drawCircles = (ctx, t, o = {}) => {   // the timeline, the medallion(s), the big gold circle and their type
    const fly = o.fly ?? 0;   // 0..1: the grid and labels leave (into S5)
    const tu = span(t, a.ask + .25, a.big + .45), tu0 = span(t, a.perhaps, a.greater + .35);
    if (tu > tu0) F.goldSpan(ctx, [[MED[0] + MED[2] + 8, 470], [DOT[0] - 22, 470]], tu0, tu, { w: 2.4, spark: tu < 1 });
    gser(ctx, '135 YEARS', 1010, 440, 60, span(t, a.big - .2, a.big + .4) * (1 - span(t, a.perhaps - .1, a.perhaps + .35)));
    // medallion → ten
    const cl = (i) => expoOut(span(t, a.size + .05 + i * .05, a.size + .65 + i * .05));
    ctx.save(); ctx.translate(0, expoIn(fly) * 900);
    if (t < a.size + .05) drawMed(ctx, t, MED[0], MED[1], MED[2]);
    else for (let i = 9; i >= 0; i--) { const k = cl(i); drawMed(ctx, t, lerp(MED[0], GRID[i][0], k), lerp(MED[1], GRID[i][1], k), lerp(MED[2], 60, k)); }
    ctx.restore();
    const lo = 1 - span(t, a.size - .15, a.size + .25);
    ser(ctx, '1891', MED[0], 650, 60, span(t, a.ask - .05, a.ask + .55) * lo);
    caps(ctx, 'LEO XIII · RERUM NOVARUM', MED[0], 696, span(t, a.ask + .2, a.ask + .8) * lo, { size: 22, col: P.halo2 });
    gser(ctx, '2026', DOT[0], 760, 60, span(t, a.newM - .2, a.newM + .4) * lo, { glow: false });
    caps(ctx, 'LEO XIV · MAGNIFICA HUMANITAS', DOT[0], 806, span(t, a.newM, a.newM + .6) * lo, { size: 22, col: P.halo2 });
    const gu = span(t, a.size + .3, a.size + .9) * (1 - fly);
    caps(ctx, '10 × THE INDUSTRIAL REVOLUTION', 560, 608, gu, { size: 24, col: CREAM });
    gser(ctx, '=', 1075, 470, 120, span(t, a.agreeB - .3, a.agreeB + .3) * (1 - fly));
    caps(ctx, 'AI, AS ITS BUILDERS SEE IT', 1440, 690, span(t, a.agreeB - .1, a.agreeB + .5) * (1 - fly), { size: 24, col: GOLD.text });
    // the big circle (the 2026 dot grown)
    if (!o.noBig) {
      const r = bigR(t), [x, y] = bigC(t);
      if (r > .5) {
        F.halo(ctx, x, y, r * 1.6, .55, GOLD.halo, GOLD.core);
        ctx.fillStyle = F.rad(ctx, x - r * .25, y - r * .3, r * 1.3, [[0, GOLD.hot], [.55, GOLD.body], [1, GOLD.mid]]); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
        ctx.strokeStyle = rgba(GOLD.core, .9); ctx.lineWidth = 2; ctx.stroke();
      }
    }
    caps(ctx, 'PERHAPS EVEN GREATER', 1500, 196, inOut(t, a.perhaps + .1, a.perhaps + .7, a.size - .3, a.size + .1), { size: 26, col: GOLD.text });
    // Hassabis
    const qu = inOut(t, a.size + .15, a.size + .75, a.hand - .5, a.hand - .1);
    ser(ctx, '“10 times bigger than the Industrial Revolution, and maybe 10 times faster.”', 960, 790, 46, qu);
    caps(ctx, 'DEMIS HASSABIS · GOOGLE DEEPMIND · 2025', 960, 840, qu, { size: 22 });
  };
  const S4 = (ctx, t) => {
    ground(ctx, t);
    const mk = medK(t);
    if (mk < 1) {   // the hall shrinks into the 1891 medallion (a closing iris that keeps the hall inside)
      const [fx, fy, fz] = facCam(a.ask - .25), cx = lerp(W / 2, MED[0], mk), cy = lerp(H / 2, MED[1], mk), r = lerp(1150, MED[2], mk), z = Math.exp(lerp(Math.log(fz), Math.log(.17), mk));
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip();
      ctx.fillStyle = mixHex(P.night0, P.ind0, .5); ctx.fillRect(0, 0, W, H);
      ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-fx, -lerp(fy, 520, mk)); drawFactorySpace(ctx, t); ctx.restore();
      ctx.strokeStyle = mixHex(P.cream, P.blue1, .25); ctx.lineWidth = 3 * smooth(mk); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke();
      gser(ctx, 'RERUM NOVARUM', 110, 150, 78, 1 - span(t, a.ask - .3, a.ask + .2), { align: 'left' });
      caps(ctx, 'LEO XIII · 1891 · ON THE CONDITION OF FACTORY WORKERS', 114, 198, 1 - span(t, a.ask - .35, a.ask + .1), { size: 24, col: CREAM, align: 'left' });
    }
    const save = mk < 1 ? null : true;
    if (mk >= 1 || t > a.ask) drawCircles(ctx, t, { medOff: mk < 1 });
    // C3 grows out of the 2026 dot and returns into it
    const m = sineIO(span(t, a.c3s - .7, a.c3s + .55)) * (1 - sineIO(span(t, a.c3e - .7, a.c3e + .35)));
    if (t > a.c3s - .7 && t < a.c3e + .35) F.clipPlate(ctx, t, T, 'C3', { from: [DOT[0], DOT[1], 16], morph: m });
    void save;
  };

  // ======================================================================== S5 · the workbench (5.05–5.06): the big circle becomes the bulb
  const VIG = [{ k: 'nod', label: 'A COLLEAGUE’S NOD', to: [560, 245], from: [1380, 470] }, { k: 'piece', label: 'THE FINISHED PIECE', to: [960, 215], from: [980, 640] }, { k: 'walk', label: 'THE MORNING WALK', to: [1360, 245], from: [1520, 400] }];
  const vigU = (t, i) => expoOut(span(t, a.asks + .25 + i * .14, a.asks + 1.1 + i * .14));
  const roomOff = (t) => sineIO(span(t, a.work149 - .75, a.work149 + .35));   // the room sinks (the camera tilts up into the night)
  const roomState = (t) => ({ lit: 1 - smooth(span(t, a.asks + .16, a.asks + .36)) + .25 * bump(t, a.asks + .06, .1), dark: smooth(span(t, a.asks + .25, a.asks + 1.0)),
    you: 1, reach: expoOut(span(t, a.hand + .35, a.wears + .2)), switchOn: 1 - span(t, a.asks + .1, a.asks + .17), colleague: 1, nod: span(t, a.hand + .7, a.hand + 1.7),
    piece: vigU(t, 1) > 0 ? 0 : 1, walker: vigU(t, 2) > 0 ? 0 : 1 });
  const drawVigs = (ctx, t, o = {}) => {
    VIG.forEach((v, i) => {
      if (o.skip === i) return;
      const u = vigU(t, i); if (u <= 0) return;
      const up = expoIn(span(t, a.work149 - .55, a.work149 + .3)) * (i === 1 ? 0 : 1);
      const x = lerp(v.from[0], v.to[0], u), y = lerp(v.from[1], v.to[1], u) - Math.sin(Math.PI * u) * 60 - up * 560, r = lerp(10, 84, u);
      D.vignette(ctx, t, v.k, x, y, r, { glow: 1 });
      caps(ctx, v.label, x, y + r + 40, span(u, .55, 1) * (1 - span(t, a.work149 - .7, a.work149 - .35)), { size: 22, col: CREAM });
    });
  };
  const S5 = (ctx, t) => {
    ground(ctx, t);
    const sh = sineIO(span(t, a.hand - .45, a.hand + .2)), ir = quartIO(span(t, a.hand + .05, a.hand + 1.0));
    const [bx0, by0] = bigC(a.hand - .45), bx = lerp(bx0, D.BULB[0], sh), by = lerp(by0, D.BULB[1], sh), br = lerp(190, 20, sh);
    if (ir < 1) {
      drawCircles(ctx, t, { noBig: true, fly: span(t, a.hand - .45, a.hand + .3) });
      F.halo(ctx, bx, by, br * 1.6 + 40, .55, GOLD.halo, GOLD.core);
      ctx.fillStyle = F.rad(ctx, bx - br * .25, by - br * .3, br * 1.3, [[0, GOLD.hot], [.55, GOLD.body], [1, GOLD.mid]]); ctx.beginPath(); ctx.arc(bx, by, br, 0, TAU); ctx.fill();
    }
    const z = 1 + .03 * span(t, a.hand, a.work149);
    if (ir > 0) iris(ctx, D.BULB[0], D.BULB[1], 20 + ir * 2300, (c) => look(c, 960, 540, z, () => D.room(c, t, roomState(t))));
    drawVigs(ctx, t);
  };

  // ======================================================================== S6 · §149 (5.07–5.08): the piece becomes the card
  const CARD = { x: 140, y: 210, w: 1040 };
  const Q149 = 'work is not simply an instrument; it expresses and enhances the dignity of our lives.';
  const scratch = createCanvas(64, 64).getContext('2d');
  const card149H = F.quoteCard(scratch, 0, null, { text: Q149, head: 'MAGNIFICA HUMANITAS · §149', x: CARD.x, y: CARD.y, w: CARD.w, size: 54, u: 1, rot: 0 }).h;
  const cardM = (t) => sineIO(span(t, a.work149 - .4, a.work149 + .25));
  const drawCard149 = (ctx, t) => {
    const m = cardM(t); if (m <= 0) return;
    if (m < 1) {
      const v = VIG[1], [vx, vy] = v.to, x = lerp(vx - 84, CARD.x, m), y = lerp(vy - 84, CARD.y + 3.8, m), w = lerp(168, CARD.w, m), h = lerp(168, card149H, m);
      ctx.fillStyle = rgba(P.night0, .35 * m); ctx.beginPath(); ctx.roundRect(x + 6, y + 10, w, h, lerp(84, 6, m)); ctx.fill();
      ctx.fillStyle = mixHex(mixHex(P.ind1, P.shade0, .25), PAPER.lit, m); ctx.beginPath(); ctx.roundRect(x, y, w, h, lerp(84, 6, m)); ctx.fill();
      ctx.strokeStyle = mixHex(P.cream, PAPER.edge, m); ctx.lineWidth = lerp(3, 2, m); ctx.stroke();
      if (m < .5) { ctx.save(); ctx.globalAlpha *= 1; D.piece(ctx, x + w / 2 + 6, y + h / 2 + 34 * (1 - m * 2), (1 - m * 2) * .9, 1, 1); ctx.restore(); }
      return;
    }
    F.quoteCard(ctx, t, T, { text: Q149, head: 'MAGNIFICA HUMANITAS · §149', x: CARD.x, y: CARD.y, w: CARD.w, size: 54, rot: 0,
      u: lerp(.34, 1, span(t, a.work149 + .25, a.work149 + .85)), spoken: ['Work he writes', 'dignity of our lives'], after: a.yes });
  };
  const FIG = { x: 1450, y: 790, bench: [1500, 1760, 660] };
  const drawMaker = (ctx, t, o = {}) => {   // 5.08: someone finishes a piece and looks up
    const u = expoOut(span(t, a.expr - .25, a.expr + .55)); if (u <= 0) return;
    const sink = expoIn(o.sink ?? 0), up = smooth(span(t, a.dignity - .1, a.dignity + .7));
    F.goldSpan(ctx, [[1300, FIG.y], [1820, FIG.y]], .5 - .5 * smooth(u) + .5 * sink, .5 + .5 * smooth(u) - .5 * sink, { w: 2, spark: false });
    ctx.save(); ctx.beginPath(); ctx.rect(1200, 0, 720, FIG.y); ctx.clip(); ctx.translate(0, (1 - u) * 420 + sink * 460);
    if (up > 0) F.halo(ctx, FIG.x + 40, FIG.y - 280, 240, .45 * up, P.halo0, P.core0);
    ctx.fillStyle = mixHex(P.shade0, P.night1, .45); ctx.fillRect(FIG.bench[0], FIG.bench[2], FIG.bench[1] - FIG.bench[0], 20); ctx.fillStyle = P.night1; ctx.fillRect(FIG.bench[0] + 20, FIG.bench[2] + 20, 16, FIG.y - FIG.bench[2] - 20); ctx.fillRect(FIG.bench[1] - 36, FIG.bench[2] + 20, 16, FIG.y - FIG.bench[2] - 20);
    if (!o.noPiece) D.piece(ctx, 1640, FIG.bench[2], 1.1, 1, 1);
    F.person(ctx, FIG.x, FIG.y, 330, { dir: 1, lean: lerp(.3, .04, up), look: lerp(-.4, .75, up), light: 1, armR: [lerp(1.25, .5, up), lerp(1.7, .6, up)], armL: [lerp(1.0, .3, up), lerp(1.4, .4, up)] });
    ctx.restore();
  };
  const S6 = (ctx, t) => {
    ground(ctx, t);
    const off = roomOff(t);
    if (off < 1) { ctx.save(); ctx.beginPath(); ctx.rect(0, off * 1150, W, H); ctx.clip(); ctx.translate(0, off * 1150); look(ctx, 960, 540, 1.03, () => D.room(ctx, t, roomState(t))); ctx.restore(); }
    drawVigs(ctx, t, { skip: cardM(t) > 0 ? 1 : -1 });
    drawCard149(ctx, t);
    drawMaker(ctx, t);
  };

  // ======================================================================== S7 · the wage band (5.09)
  const BAND = { x0: 260, x1: 1660, y: 470, th: 45 };
  const bandM = (t) => sineIO(span(t, a.risk - .25, a.risk + .6));
  const bandThin = (t) => sineIO(span(t, a.thinner - .1, a.thinner + .8));
  const toRule = (t) => sineIO(span(t, a.soc - .3, a.soc + .45));
  const drawBand = (ctx, t) => {
    const m = bandM(t); if (m <= 0) return;
    const r = toRule(t), x0 = lerp(lerp(1585, BAND.x0, m), 300, r), x1 = lerp(lerp(1700, BAND.x1, m), 1620, r), yc = lerp(lerp(FIG.bench[2] - 34, BAND.y, m), 150, r);
    const th = lerp(lerp(34, BAND.th, m), 2.5, r), thin = bandThin(t) * (1 - r);
    const pts = [], n = 40;
    for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n), k = 1 - .75 * thin * smooth(span(x, 700, 1500)); pts.push([x, th * k]); }
    ctx.beginPath(); pts.forEach(([x, h], i) => (i ? ctx.lineTo(x, yc - h) : ctx.moveTo(x, yc - h))); for (let i = n; i >= 0; i--) ctx.lineTo(pts[i][0], yc + pts[i][1]); ctx.closePath();
    ctx.fillStyle = F.lin(ctx, 0, yc - th, 0, yc + th, [[0, GOLD.hot], [.5, GOLD.body], [1, GOLD.mid]]); ctx.fill();
    ctx.strokeStyle = rgba(GOLD.core, .8); ctx.lineWidth = 1.5; ctx.stroke();
    if (m < 1) F.halo(ctx, x0 + 40, yc, 80, .5 * (1 - m), GOLD.halo, GOLD.core);
    const lo = 1 - span(t, a.soc - .4, a.soc);
    caps(ctx, 'WAGES', BAND.x0, BAND.y - 66, span(t, a.risk + .3, a.risk + .9) * lo, { size: 24, col: GOLD.text, align: 'left' });
    caps(ctx, 'NOT ONLY', 960, 330, span(t, a.notOnly - .1, a.notOnly + .5) * lo, { size: 26, col: CREAM });
    ser(ctx, 'A THINNER PAYCHECK', BAND.x1, 600, 66, span(t, a.thinner, a.thinner + .6) * lo, { align: 'right' });
  };
  const S7 = (ctx, t) => {
    ground(ctx, t);
    const ex = expoIn(span(t, a.risk - .45, a.risk + .25));
    if (ex < 1) { ctx.save(); ctx.translate(-ex * 1400, 0); drawCard149(ctx, t); ctx.restore(); }
    drawMaker(ctx, t, { sink: span(t, a.risk - .3, a.risk + .35), noPiece: bandM(t) > 0 });
    drawBand(ctx, t);
  };

  // ======================================================================== S8 · 3 of 33 desks, 30 people outside (5.10) · richer and smaller (5.11)
  const LITD = [[1, 2], [0, 6], [2, 9]];
  const desk = (ctx, t, x, y, lit) => {
    ctx.fillStyle = mixHex(P.ind1, P.blue1, .35); ctx.fillRect(x - 46, y + 52, 92, 7); ctx.fillStyle = P.night1; ctx.fillRect(x - 42, y + 59, 6, 26); ctx.fillRect(x + 36, y + 59, 6, 26);
    ctx.strokeStyle = mixHex(P.ind2, P.blue1, .6); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 30, y + 52); ctx.lineTo(x + 30, y + 24); ctx.lineTo(x + 18, y + 18); ctx.stroke();
    ctx.fillStyle = mixHex(mixHex(P.ind2, P.blue1, .5), GOLD.hot, lit); ctx.beginPath(); ctx.moveTo(x + 8, y + 22); ctx.lineTo(x + 26, y + 12); ctx.lineTo(x + 30, y + 22); ctx.closePath(); ctx.fill();
    if (lit > 0) { F.halo(ctx, x + 18, y + 30, 46, .8 * lit, P.halo0, P.core0); F.person(ctx, x - 14, y + 86, 64 * expoOut(lit), { pose: 'sit', dir: 1, light: 1, lean: .2, armR: [1.2, 1.6] }); }
    else { ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fillRect(x - 26, y + 62, 22, 5); ctx.fillRect(x - 26, y + 40, 5, 26); }
  };
  const PEOPLE = Array.from({ length: 30 }, (_, i) => 330 + i * 43.4);
  const drawGrid = (ctx, t, o = {}) => {
    const r = toRule(t); if (r <= 0) return;
    const up = expoIn(o.up ?? 0) * 800, down = expoIn(o.down ?? 0) * 700;
    ctx.save(); ctx.translate(0, -up);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 152, W, 400); ctx.clip();
    for (let rr = 0; rr < 3; rr++) for (let c = 0; c < 11; c++) {
      const u = expoOut(span(t, a.soc + .15 + c * .035 + rr * .08, a.soc + .7 + c * .035 + rr * .08)); if (u <= 0) continue;
      const li = LITD.findIndex(([q, w]) => q === rr && w === c), lit = li < 0 ? 0 : smooth(span(t, a.fewBusy + li * .16, a.fewBusy + .3 + li * .16));
      ctx.save(); ctx.translate(0, -(1 - u) * 110); desk(ctx, t, 360 + c * 120, 160 + rr * 100, lit); ctx.restore();
    }
    ctx.restore();
    caps(ctx, '3 OF 33 DESKS', 300, 120, span(t, a.fewBusy + .2, a.fewBusy + .8) * (1 - (o.lab ?? 0)), { size: 24, col: GOLD.text, align: 'left' });
    if (r >= 1 || o.rule) F.goldSpan(ctx, [[300, 150], [1620, 150]], 0, 1, { w: 2.5, spark: false });
    ctx.restore();
    // the people outside: empty hands; smaller on "smaller"
    const sm = lerp(1, .58, sineIO(span(t, a.smaller - .15, a.smaller + .5)));
    ctx.save(); ctx.translate(0, down); ctx.beginPath(); ctx.rect(0, 0, W, 642); ctx.clip();
    PEOPLE.forEach((x, i) => {
      const u = expoOut(span(t, a.everyElse - .25 + Math.abs(i - 14.5) * .018, a.everyElse + .35 + Math.abs(i - 14.5) * .018)); if (u <= 0) return;
      F.person(ctx, x, 640 + (1 - u) * 140, 112 * sm, { dir: i % 2 ? 1 : -1, look: .1 * Math.sin(t * .6 + i), light: 1, armR: [.35, .2], armL: [.35, .2], back: .1 });
    });
    ctx.restore();
    const lab = 1 - (o.lab ?? 0);
    caps(ctx, 'EVERYBODY ELSE', 960, 694, span(t, a.everyElse, a.everyElse + .6) * lab, { size: 24, col: CREAM });
    caps(ctx, 'TIME NOBODY ASKED FOR', 960, 734, span(t, a.nobody - .1, a.nobody + .5) * lab, { size: 24, col: GOLD.text });
    const q1 = inOut(t, a.soc + 1.0, a.soc + 1.6, a.richer - .25, a.richer + .15) * lab, q2 = span(t, a.richer + .25, a.richer + .85) * lab;
    ser(ctx, '“forced inactivity, a lack of responsibility and the absence of daily tasks and stimuli”', 960, 806, 38, q1);
    ser(ctx, '“a paradox of material progress and anthropological regression”', 960, 806, 40, q2);
    caps(ctx, 'MAGNIFICA HUMANITAS · §154', 960, 850, Math.max(q1, q2), { size: 22 });
    gser(ctx, 'RICHER', 1680, 300, 64, span(t, a.richer - .05, a.richer + .5) * lab, { align: 'right' });
    ser(ctx, 'SMALLER', 960, 560, 60, span(t, a.smaller, a.smaller + .5) * lab);
  };
  const ARW = { x: 1740, y0: 640, y1: 150 };
  const S8 = (ctx, t) => {
    ground(ctx, t);
    drawBand(ctx, t);
    drawGrid(ctx, t);
    F.arrow(ctx, [ARW.x, ARW.y0], [ARW.x, ARW.y1], span(t, a.richer - .15, a.richer + .45), { arc: 0, w: 3.4 });
    caps(ctx, 'OUTPUT', ARW.x, ARW.y0 + 40, span(t, a.richer + .1, a.richer + .6), { size: 24, col: GOLD.text });
  };

  // ======================================================================== S9 · the labor share bar (5.12–5.15)
  const BAR = { x: 700, w: 150, y0: 740, h: 560 };
  const lv = (p) => BAR.y0 - BAR.h * p / 100, L53 = lv(53);
  const barK = (t) => sineIO(span(t, a.share - .45, a.share + .45));
  const fillP = (t) => 53 * sineIO(span(t, a.working - .1, a.fiftyE));
  const split = (t) => sineIO(span(t, a.but - .1, a.but + .6));
  const STR = (t) => ({ L: expoOut(span(t, a.but - .05, a.but + 1.4)) * 900, q: sineIO(span(t, a.replacing - .25, a.warns + .4)) });
  const drawBar = (ctx, t, o = {}) => {
    const k = barK(t);
    // the outline: the OUTPUT arrow widens into the 100 % frame
    const cx = lerp(ARW.x, BAR.x + BAR.w / 2, k), w = lerp(4, BAR.w, k), top = lerp(ARW.y1, BAR.y0 - BAR.h, k), bot = lerp(ARW.y0, BAR.y0, k);
    const sp = split(t), p = fillP(t);
    if (p > 0) {   // wages part (bottom 53 %): gold, turns to the wage colour when the streams start
      ctx.fillStyle = F.lin(ctx, BAR.x, 0, BAR.x + BAR.w, 0, [[0, mixHex(GOLD.mid, WAGEC, sp)], [.5, mixHex(GOLD.body, WAGEC, sp)], [1, mixHex(GOLD.mid, WAGEC, sp)]]);
      ctx.beginPath(); ctx.roundRect(BAR.x, lv(p), BAR.w, BAR.y0 - lv(p), [4, 4, 0, 0]); ctx.fill();
    }
    if (sp > 0) { ctx.fillStyle = F.lin(ctx, 0, lv(100), 0, L53, [[0, GOLD.hot], [1, GOLD.body]]); ctx.fillRect(BAR.x, lv(100), BAR.w, (L53 - lv(100)) * sp - 2); }
    ctx.strokeStyle = mixHex(GOLD.line, CREAM, k); ctx.lineWidth = lerp(3.4, 2.5, k); ctx.beginPath(); ctx.roundRect(cx - w / 2, top, w, bot - top, Math.min(6, w / 2)); ctx.stroke();
    if (k < 1) { ctx.save(); ctx.globalAlpha *= 1; F.arrow(ctx, [ARW.x, ARW.y0], [ARW.x, ARW.y1], 1 - k, { arc: 0, w: 3.4 }); ctx.restore(); }
    const lu = inOut(t, a.share + .2, a.share + .8, a.but - .3, a.but + .1);
    caps(ctx, 'U.S. LABOR SHARE · NONFARM BUSINESS · Q3 2026 (PRELIMINARY)', BAR.x, 130, lu, { size: 26, col: CREAM, align: 'left' });
    for (const q of [100, 50, 0]) caps(ctx, `${q}%`, BAR.x - 16, lv(q) + 8, lu, { size: 22, align: 'right' });
    const nu = inOut(t, a.fifty - .1, a.fifty + .5, a.but - .35, a.but + .1);
    gser(ctx, '53.0%', 905, L53 - 26, 150, nu, { align: 'left' });
    // 5.13: the floor 1947 … and the marker that drops on it
    const fl = span(t, a.lowest - .1, a.lowest + .6), flOut = span(t, a.but - .3, a.but + .3);
    if (fl > flOut) F.goldSpan(ctx, [[BAR.x + BAR.w + 6, L53], [1720, L53]], flOut, fl, { w: 2.2, spark: fl < 1 });
    const md = span(t, a.lowest + .1, a.lowest + .65), mo = expoIn(span(t, a.but - .3, a.but + .2));
    if (md > 0 && mo < 1) { const y = lerp(200, L53 - 3, md * md) + mo * 600, sq = bump(t, a.lowest + .65, .25);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, L53 - 1); ctx.clip(); ctx.translate(1700, y); ctx.scale(1 + .2 * sq, 1 - .25 * sq); ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-16, -26); ctx.lineTo(16, -26); ctx.closePath(); ctx.fill(); ctx.restore(); }
    F.verdict(ctx, t, 906, L53 + 70, 'LOWEST SINCE RECORDS BEGAN IN 1947', inOut(t, a.lowest + .3, a.lowest + .9, a.but - .3, a.but + .1), { size: 28, align: 'left' });
    F.source(ctx, t, a.share + .5, a.but + .2, 'SOURCE: U.S. BUREAU OF LABOR STATISTICS, PRODUCTIVITY AND COSTS, 5 NOV 2026');
    // 5.14: pale causes
    const CA = [['WEAKER UNIONS', 300], ['GLOBALIZATION', 440], ['?', 580]], ret = span(t, a.but - .35, a.but + .25);
    CA.forEach(([lab, y], i) => {
      const u = span(t, a.cause + .1 + i * .28, a.cause + .7 + i * .28); if (u <= ret) return;
      F.trailCream(ctx, [[200, y], [640, y]], ret, smooth(u), { w: 2, a: .65 });
      if (u > .9 && ret <= 0) { ctx.fillStyle = rgba(CREAM, .65); ctx.beginPath(); ctx.moveTo(652, y); ctx.lineTo(636, y - 9); ctx.lineTo(636, y + 9); ctx.closePath(); ctx.fill(); }
      if (lab === '?') gser(ctx, '?', 200, y - 16, 54, u * (1 - ret), { align: 'left', glow: false }); else caps(ctx, lab, 200, y - 18, u * (1 - ret), { size: 22, col: CREAM, align: 'left' });
    });
    caps(ctx, 'CAUSE NOT ESTABLISHED', 200, 690, inOut(t, a.disputed - .1, a.disputed + .5, a.but - .3, a.but + .1), { size: 26, col: CREAM, align: 'left' });
  };
  const WAGEC = mixHex(P.cream, P.blue1, .4);
  const drawStreams = (ctx, t) => {
    const { L, q } = STR(t); if (L <= 1) return;
    const x0 = BAR.x + BAR.w, x1 = x0 + L, n = 48;
    const bnd = (x) => L53 + (650 - L53) * q * smooth(clamp((x - x0) / 900)), ctop = (x) => lv(100) - 70 * q * smooth(clamp((x - x0) / 900));
    const band = (yTop, yBot) => { ctx.beginPath(); for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n); i ? ctx.lineTo(x, yTop(x)) : ctx.moveTo(x, yTop(x)); } for (let i = n; i >= 0; i--) { const x = lerp(x0, x1, i / n); ctx.lineTo(x, yBot(x)); } ctx.closePath(); };
    const flow = (col) => { ctx.save(); ctx.clip(); ctx.strokeStyle = col; ctx.lineWidth = 2; for (let x = x0 - 80 + ((t * 110) % 70); x < x1; x += 70) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 30, H); ctx.stroke(); } ctx.restore(); };
    band(ctop, (x) => bnd(x) - 2); ctx.fillStyle = F.lin(ctx, 0, 100, 0, 650, [[0, GOLD.hot], [1, GOLD.body]]); ctx.fill(); band(ctop, (x) => bnd(x) - 2); flow(rgba(GOLD.core, .22));
    band((x) => bnd(x) + 2, () => BAR.y0); ctx.fillStyle = WAGEC; ctx.fill(); band((x) => bnd(x) + 2, () => BAR.y0); flow(rgba(P.cream, .18));
    const xe = Math.min(x1 - 30, 1560), lu = span(L, 500, 900) * (1 - span(t, a.day - .45, a.day - .1));
    if (lu > 0) {
      F.glowText(ctx, 'CAPITAL', xe, (ctop(xe) + bnd(xe)) / 2 + 10, { size: 28, weight: 700, align: 'right', col: '#3b2410', glow: false, spacing: .08, a: lu });
      F.glowText(ctx, 'WAGES', xe, (bnd(xe) + BAR.y0) / 2 + 10, { size: 28, weight: 700, align: 'right', col: P.night1, glow: false, spacing: .08, a: lu });
    }
  };
  const S9 = (ctx, t) => {
    ground(ctx, t);
    const ex = span(t, a.share - .45, a.share + .3);
    if (ex < 1) { drawBand(ctx, t); drawGrid(ctx, t, { up: ex, down: ex, lab: span(t, a.share - .5, a.share - .1), rule: 1 }); }
    drawStreams(ctx, t);
    drawBar(ctx, t);
    const qu = inOut(t, a.replacing - .1, a.replacing + .5, a.day - .5, a.day - .15);
    ser(ctx, '“income from capital risks replacing income from labor”', 960, 832, 44, qu);
    caps(ctx, 'MAGNIFICA HUMANITAS · §160 · SCHEMATIC, NOT DATA', 960, 870, qu, { size: 22 });
  };

  // ======================================================================== S10 · Scholl's post (5.16) · jobs sink and rise (5.17)
  const POST = { x: 150, y: 220, w: 900, size: 38, lh: 52 };
  const POSTTXT = 'Bad take from the Pope. Tech revolutions tend to eliminate some jobs while creating others. If we cling to jobs, we’d still be ploughing fields by hand out of fear of disruption.';
  const postWords = (() => {
    const ws = POSTTXT.split(' '), out = []; let x = 0, line = 0; const maxW = POST.w - 80;
    for (const w of ws) { const ww = F.measure(w, POST.size, true); if (x > 0 && x + ww > maxW) { x = 0; line++; } out.push({ w, x, line, ww }); x += ww + POST.size * .26; }
    const hi1 = ['eliminate', 'some', 'jobs', 'while', 'creating', 'others.'], hi2 = ['cling', 'ploughing', 'fields', 'by', 'hand'];
    out.forEach((o, i) => { o.h1 = hi1.includes(o.w) && i > 4 && i < 14; o.h2 = hi2.includes(o.w) && i > 14; });
    return { words: out, lines: line + 1 };
  })();
  const POSTH = 150 + postWords.lines * POST.lh + 70;
  const ploughWord = postWords.words.find((o) => o.w === 'ploughing');
  const IRISPT = [POST.x + 40 + ploughWord.x + ploughWord.ww / 2, POST.y + 150 + ploughWord.line * POST.lh - 12];
  const drawPost = (ctx, t, o = {}) => {
    const u = 1 - (1 - span(t, a.day - .3, a.day + .7)) ** 3; if (u <= 0) return;
    const x = lerp(POST.x - 1100, POST.x, u), y = POST.y;
    ctx.save(); ctx.translate(x - POST.x, 0);
    ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(POST.x + 8, y + 12, POST.w, POSTH, 22); ctx.fill();
    ctx.fillStyle = mixHex(P.night0, P.ind0, .55); ctx.beginPath(); ctx.roundRect(POST.x, y, POST.w, POSTH, 22); ctx.fill();
    ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = mixHex(P.blue1, P.cream, .25); ctx.beginPath(); ctx.arc(POST.x + 68, y + 70, 32, 0, TAU); ctx.fill();
    F.glowText(ctx, 'BS', POST.x + 68, y + 79, { size: 24, weight: 700, align: 'center', col: P.night1, glow: false });
    F.glowText(ctx, 'Blake Scholl', POST.x + 120, y + 66, { size: 40, serif: true, col: CREAM, glow: false });
    F.glowText(ctx, 'FOUNDER, BOOM SUPERSONIC · ON X', POST.x + 122, y + 98, { size: 22, weight: 600, col: P.halo2, glow: false, spacing: .06 });
    for (const w of postWords.words) {
      const g = w.h1 ? smooth(span(t, a.kill - .1, a.kill + .4)) * (1 - smooth(span(t, a.cling - .5, a.cling - .2))) : w.h2 ? smooth(span(t, a.cling - .35, a.cling + .1)) : 0;
      F.glowText(ctx, w.w, POST.x + 40 + w.x, y + 150 + w.line * POST.lh + 14, { size: POST.size, serif: true, col: mixHex(CREAM, GOLD.body, g), glow: g > .5 });
    }
    F.glowText(ctx, '25 MAY 2026 · THE DAY THE LETTER CAME OUT', POST.x + 40, y + POSTH - 30, { size: 22, weight: 600, col: rgba(P.cream, .7), glow: false, spacing: .06 });
    ctx.restore();
  };
  const ICONS = [['typewriter', 1190, 0], ['phone', 1320, 0], ['wrench', 1450, 0], ['monitor', 1580, 1], ['headset', 1710, 1]];
  const drawJobs = (ctx, t) => {
    const lu = span(t, a.kill - .5, a.kill + .2); if (lu <= 0) return;
    F.trailCream(ctx, [[1120, 560], [1790, 560]], .5 - .5 * smooth(lu), .5 + .5 * smooth(lu), { w: 2, a: .8 });
    ctx.save(); ctx.beginPath(); ctx.rect(1000, 0, 900, 556); ctx.clip();
    ICONS.forEach(([k, x, isNew], i) => {
      const inU = isNew ? expoOut(span(t, a.make - .2 + (i - 3) * .12, a.make + .4 + (i - 3) * .12)) : expoOut(span(t, a.kill - .3 + i * .08, a.kill + .25 + i * .08));
      const sink = isNew || k === 'wrench' ? 0 : expoIn(span(t, a.kill + .55 + i * .12, a.kill + 1.1 + i * .12));
      if (inU <= 0) return;
      D.jobIcon(ctx, k, x, 500 + (1 - inU) * 140 + sink * 160, 92, { col: isNew ? GOLD.line : CREAM });
    });
    ctx.restore();
    caps(ctx, 'KILL SOME', 1255, 612, span(t, a.kill + .5, a.kill + 1.0), { size: 22, col: CREAM });
    caps(ctx, 'MAKE OTHERS', 1645, 612, span(t, a.make, a.make + .5), { size: 22, col: GOLD.text });
  };
  const S10 = (ctx, t) => {
    ground(ctx, t);
    const ex = sineIO(span(t, a.day - .45, a.day + .75));
    if (ex < 1) { ctx.save(); ctx.translate(ex * 1350, 0); drawStreams(ctx, t); drawBar(ctx, t); ctx.restore(); }
    drawPost(ctx, t);
    drawJobs(ctx, t);
  };

  // ======================================================================== S11 · the ploughman at dusk (5.18) · S12 · the band of the past (5.19–5.21)
  const ploughX = (t) => 700 + (t - a.cling) * 38;
  const fieldUp = (t) => sineIO(span(t, a.fair - .35, a.fair + .8));
  const S11 = (ctx, t) => {
    ground(ctx, t);
    drawPost(ctx, t); drawJobs(ctx, t);
    const r = quartIO(span(t, a.cling - .05, a.cling + 1.0)) * 2300;
    iris(ctx, IRISPT[0], IRISPT[1], r, (c) => { look(c, 960, 540, 1 + .01 * (t - a.cling), () => D.field(c, t, { x: ploughX(t) })); });
  };
  const PASTI = [['plough', 1950], ['loom', 2330], ['typewriter', 2710]], BANDEND = 3150;
  const scroll = (t) => 1700 * sineIO(span(t, a.fair - .3, a.unproven + .35)) + 2400 * expoIn(span(t, a.doB - .35, a.doB + .6));
  const slotX = (t) => lerp(1700, 960, sineIO(span(t, a.doB - .2, a.doB + .7)));
  const drawPast = (ctx, t) => {
    const k = fieldUp(t), s = scroll(t), yT = lerp(694, 455, k), xe = BANDEND - s;
    // the furrow: it straightens and becomes the top rail; the bottom rail runs in behind it
    const fx1 = Math.min(lerp(ploughX(Math.min(t, a.fair - .35)) - 70, 2200, k), xe);
    F.goldSpan(ctx, [[-200, yT], [fx1, yT]], 0, 1, { w: 2.2, spark: false });
    if (k > 0) F.goldSpan(ctx, [[Math.max(-200, xe - (xe + 200) * k), 625], [xe, 625]], 0, 1, { w: 2.2, spark: false });
    ctx.save(); ctx.beginPath(); ctx.rect(0, yT + 4, Math.max(0, xe), 625 - yT - 8); ctx.clip();
    for (const [kind, x] of PASTI) D.jobIcon(ctx, kind, x - s, 540, 104, { col: CREAM });
    ctx.restore();
    if (xe < W + 40) { ctx.strokeStyle = GOLD.line; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xe, yT - 14); ctx.lineTo(xe, 625 + 14); ctx.stroke(); }
    const pu = inOut(t, a.past - .2, a.past + .4, a.doB - .4, a.doB);
    caps(ctx, 'THE PAST', 200, 412, pu, { size: 30, col: CREAM, align: 'left' });
    if (pu > 0) { const g = smooth(pu); F.trailCream(ctx, [[540, 402], [420, 402]], 0, g, { w: 2 }); const hs = smooth(span(pu, .5, 1)); if (hs > 0) { ctx.fillStyle = CREAM; ctx.beginPath(); ctx.moveTo(lerp(540, 420, g) - 4, 402); ctx.lineTo(lerp(540, 420, g) + 14 * hs, 402 - 8 * hs); ctx.lineTo(lerp(540, 420, g) + 14 * hs, 402 + 8 * hs); ctx.closePath(); ctx.fill(); } }
  };
  const drawSlotQ = (ctx, t, o = {}) => {
    const su = span(t, a.whether - .15, a.whether + .5); if (su <= 0) return null;
    const x = slotX(t), y = lerp(540, 600, sineIO(span(t, a.doB - .2, a.doB + .7)));
    const rr = F.slot(ctx, t, x, y, 280, 170, { u: su });
    gser(ctx, '?', x, y + 42, 120, span(t, a.whether + .2, a.whether + .7) * (1 - (o.qOut ?? 0)), { glow: true });
    F.verdict(ctx, t, x, y + 150, 'UNPROVEN', inOut(t, a.unproven - .05, a.unproven + .5, a.doB - .3, a.doB + .1), { size: 32 });
    return rr;
  };
  const S12 = (ctx, t) => {
    ground(ctx, t);
    const k = fieldUp(t);
    if (k < 1) { ctx.save(); ctx.beginPath(); ctx.rect(0, -k * 1150, W, H); ctx.clip(); ctx.translate(0, -k * 1150); look(ctx, 960, 540, 1 + .01 * (t - a.cling), () => D.field(ctx, t, { x: ploughX(Math.min(t, a.fair - .35)) + 38 * Math.max(0, t - a.fair + .35) * (1 - k), furrow: false })); ctx.restore(); }
    drawPast(ctx, t);
    drawSlotQ(ctx, t);
    if (t > a.doB - .3) question(ctx, t, 'DO THE BUILDERS SEE IT?', 960, 360, 96, { ts: [a.doW[0], a.doW[1], a.doW[2], a.doW[3], a.doW[6]] });
  };

  // ======================================================================== S13 · the synod hall (6.01–6.05) with C4
  const BIG = { x: 560, y: 300, w: 800, h: 260 };
  const hallCam = (t) => {
    let cx = 960, cy = 520, z = .95 + .012 * Math.max(0, Math.min(t, a.one) - a.pres);
    const k = sineIO(span(t, a.one - .2, a.one + 1.8)); cx = lerp(cx, D.ODD.x + 60, k); cy = lerp(cy, D.ODD.y - 40, k); z = lerp(z, 1.7, k);
    z *= 1 + .02 * span(t, a.cof, a.c4e);
    const p = sineIO(span(t, a.bld - .35, a.bld + 1.7)); cx = lerp(cx, 900, p); cy = lerp(cy, 330, p); z = lerp(z, .64, p);
    z *= 1 + .02 * span(t, a.bld + 1.7, a.everyLab + .8);
    return [cx, cy, z];
  };
  const camRect = (cam, r) => { const [x, y] = F.lookPt(cam[0], cam[1], cam[2], r.x, r.y); return { x, y, w: r.w * cam[2], h: r.h * cam[2] }; };
  const ODDR = { x: D.ODD.x - D.ODD.w / 2, y: D.ODD.y - D.ODD.h / 2, w: D.ODD.w, h: D.ODD.h };
  const LECTR = { x: D.LECT.x - D.LECT.w / 2, y: D.LECT.y - D.LECT.h / 2, w: D.LECT.w, h: D.LECT.h };
  const lerpR = (A, B, k) => ({ x: lerp(A.x, B.x, k), y: lerp(A.y, B.y, k), w: lerp(A.w, B.w, k), h: lerp(A.h, B.h, k) });
  const drawHall = (ctx, t, o = {}) => {
    const cam = o.cam ?? hallCam(t);
    look(ctx, cam[0], cam[1], cam[2], () => D.hall(ctx, t, { oddLit: smooth(span(t, a.cardinals - .3, a.cardinals + .5)), hideOdd: t > a.cof - .3, speaker: t > a.bld - 1.5 ? 1 : 0, panelCol: o.panelCol }));
  };
  const cardFront = (ctx, r) => {   // the big name card, front (like the real one: "Christopher OLAH")
    ctx.save(); ctx.translate(r.x, r.y); ctx.scale(r.w / BIG.w, r.h / BIG.h);
    ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(8, 12, BIG.w, BIG.h);
    ctx.fillStyle = F.lin(ctx, 0, 0, 0, BIG.h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(0, 0, BIG.w, BIG.h);
    ctx.strokeStyle = GOLD.body; ctx.lineWidth = 4; ctx.strokeRect(0, 0, BIG.w, BIG.h);
    if (r.w < BIG.w * .45) { F.glowText(ctx, 'OLAH', BIG.w / 2, BIG.h * .66, { size: 22 * BIG.h / D.ODD.h, weight: 700, align: 'center', col: PAPER.ink, glow: false, spacing: .04 }); ctx.restore(); return; }   // still the table card
    F.glowText(ctx, 'Christopher OLAH', BIG.w / 2, 140, { size: 84, serif: true, align: 'center', col: PAPER.ink, glow: false });
    F.glowText(ctx, 'Co-founder of Anthropic (USA)', BIG.w / 2, 200, { size: 38, serif: true, align: 'center', col: PAPER.faint, glow: false });
    ctx.restore();
  };
  const cardBack = (ctx, t, r, q) => {   // the back: the empty slot (dark, dashed, gold corners) with a ?
    ctx.save(); ctx.fillStyle = mixHex(P.night0, P.ind0, .5); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 10); ctx.fill();
    ctx.strokeStyle = rgba(CREAM, .85); ctx.lineWidth = 2.5; ctx.setLineDash([16, 12]); ctx.lineDashOffset = -t * 18; ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = GOLD.line; ctx.lineWidth = 4; const c = Math.min(30, r.w * .1);
    for (const [cx, cy, sx, sy] of [[r.x, r.y, 1, 1], [r.x + r.w, r.y, -1, 1], [r.x, r.y + r.h, 1, -1], [r.x + r.w, r.y + r.h, -1, -1]]) { ctx.beginPath(); ctx.moveTo(cx + sx * c, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + sy * c); ctx.stroke(); }
    ctx.restore();
    if (q > 0) gser(ctx, '?', r.x + r.w / 2, r.y + r.h / 2 + 56 * r.h / BIG.h, 160 * r.h / BIG.h, q);
  };
  const S13 = (ctx, t) => {
    ground(ctx, t);
    // 6.01 entry: the slot becomes the odd card, the hall opens round it
    const k0 = sineIO(span(t, a.pres - .25, a.pres + .45)), ir = sineIO(span(t, a.pres - .05, a.pres + .85));
    if (ir < 1) {
      drawPast(ctx, t);
      question(ctx, t, 'DO THE BUILDERS SEE IT?', 960, 360, 96, { ts: [a.doW[0], a.doW[1], a.doW[2], a.doW[3], a.doW[6]], out: span(t, a.pres - .3, a.pres + .2) });
    }
    if (ir > 0) iris(ctx, ...F.lookPt(...hallCam(t), D.ODD.x, D.ODD.y), ir * 2400, (c) => drawHall(c, t));
    if (k0 < 1) {
      const target = camRect(hallCam(t), ODDR), src = { x: slotX(t) - 140, y: 600 - 85, w: 280, h: 170 }, r = lerpR(src, target, k0);
      if (k0 < .5) { cardBack(ctx, t, r, 1 - span(k0, 0, .3)); }
      else { ctx.fillStyle = mixHex(P.ind1, PAPER.lit, span(k0, .5, .8)); ctx.fillRect(r.x, r.y, r.w, r.h); ctx.strokeStyle = mixHex(CREAM, GOLD.body, k0); ctx.lineWidth = 3; ctx.strokeRect(r.x, r.y, r.w, r.h);
        F.glowText(ctx, 'OLAH', r.x + r.w / 2, r.y + r.h * .65, { size: 22 * r.h / D.ODD.h, weight: 700, align: 'center', col: PAPER.ink, glow: false, spacing: .04, a: span(k0, .7, 1) }); }
    }
    // 6.02: the essay beside the card, a gold line to it
    const eu = expoOut(span(t, a.one + .45, a.one + 1.3)), eo = expoIn(span(t, a.cof - .35, a.cof + .25));
    if (eu > 0 && eo < 1) {
      const ex = lerp(2300, 1500, eu) + eo * 900;
      F.essay(ctx, t, ex, 440, 360, { open: 0 });
      const cr = camRect(hallCam(t), ODDR), lu = span(t, a.promise - .4, a.promise + .3) * (1 - eo);
      if (lu > 0) F.goldSpan(ctx, [[cr.x + cr.w + 12, cr.y + cr.h / 2], [ex - 14, 440]], 0, smooth(lu), { w: 2, spark: lu < 1 });
      caps(ctx, 'THE PROMISE, WRITTEN DOWN BY HIS LAB’S CHIEF', ex + 90, 680, span(t, a.promise - .2, a.promise + .4) * (1 - eo), { size: 22, col: CREAM });
    }
    // 6.03 / 6.04 / C4 / 6.05: the card lifts to the front, flips to its back (?), the clip grows out of it, it flies to the lectern
    const lift = sineIO(span(t, a.cof - .3, a.cof + .35));
    if (lift > 0) {
      const toL = sineIO(span(t, a.bld - .3, a.bld + 1.2));
      const r0 = lerpR(camRect(hallCam(t), ODDR), BIG, lift), r = toL > 0 ? lerpR(BIG, camRect(hallCam(t), LECTR), toL) : r0;
      const fl = span(t, a.guess - .15, a.guess + .3), sx = Math.abs(Math.cos(Math.PI * fl)), cm = sineIO(span(t, a.c4s - .45, a.c4s + .45)) * (1 - sineIO(span(t, a.c4e - .45, a.c4e + .25)));
      if (!(t > a.c4s - .45 && t < a.c4e + .25)) {
        const rr = { x: r.x + r.w * (1 - sx) / 2, y: r.y, w: r.w * sx, h: r.h };
        if (fl < .5) cardFront(ctx, rr);
        else if (toL <= 0) cardBack(ctx, t, rr, 1 - span(t, a.c4s - .75, a.c4s - .5));
        else { ctx.fillStyle = mixHex(mixHex(P.night0, P.ind0, .5), mixHex(GOLD.mid, P.night1, .35), toL); ctx.fillRect(r.x, r.y, r.w, r.h); if (toL < .6) cardBack(ctx, t, r, 0); }
      }
      const lu = inOut(t, a.cof - .05, a.cof + .5, a.guess - .3, a.guess);
      caps(ctx, 'CHRIS OLAH · CO-FOUNDER, ANTHROPIC', 960, 196, lu, { size: 28, col: GOLD.text });
      caps(ctx, 'SPOKE AT THE VATICAN, 25 MAY 2026', 960, 240, lu, { size: 24, col: CREAM });
      if (cm > 0) F.clipPlate(ctx, t, T, 'C4', { from: BIG, morph: cm, dark: 1 - smooth(clamp(cm * 2.2)) });
    }
    // 6.05 type
    caps(ctx, 'A BUILDER OF THESE MACHINES · IN THE VATICAN', 960, 128, span(t, a.bld + .2, a.vatican + .4) * (1 - span(t, a.everyLab - .5, a.everyLab - .2)), { size: 26, col: CREAM });
    gser(ctx, 'ASKING FOR CRITICS', 960, 222, 76, span(t, a.critics - .05, a.critics + .5) * (1 - span(t, a.everyLab - .55, a.everyLab - .2)));
  };

  // ======================================================================== S14 · four pressures (6.06) · AND YOUR WORK? (6.07)
  const BOX = { x: 960, y: 380, w: 400, h: 200 };
  const PR = [[[230, 380], [748, 380], 'STAYING COMMERCIALLY VIABLE', [230, 336]], [[1690, 380], [1172, 380], 'STAYING AT THE FRONTIER', [1690, 336]],
    [[560, 120], [850, 268], 'GEOPOLITICS', [560, 90]], [[1360, 120], [1070, 268], 'PRIDE AND AMBITION', [1360, 90]]];
  const hit = (i) => a.press + .1 + i * .3;
  const drawPressure = (ctx, t, o = {}) => {
    const lift = expoIn(span(t, a.yw - .45, a.yw + .2)), ret = span(t, a.yw - .5, a.yw);
    const sq = 1 - .035 * PR.reduce((s, _, i) => s + bump(t, hit(i) + .04, .3), 0);
    if (!o.noBox) {
    ctx.save(); ctx.translate(BOX.x, BOX.y - lift * 700); ctx.scale(2 - sq, sq); ctx.translate(-BOX.x, -BOX.y);
    ctx.fillStyle = mixHex(P.night1, P.ind2, .55); ctx.beginPath(); ctx.roundRect(BOX.x - BOX.w / 2, BOX.y - BOX.h / 2, BOX.w, BOX.h, 14); ctx.fill();
    ctx.strokeStyle = rgba(GOLD.line, .75); ctx.lineWidth = 2.5; ctx.stroke();
    ctx.restore();
    }
    caps(ctx, 'EVERY FRONTIER LAB', BOX.x, BOX.y - 2 - lift * 700, span(t, a.everyLab + .2, a.everyLab + .7), { size: 30, col: CREAM });
    caps(ctx, 'INCLUDING ANTHROPIC', BOX.x, BOX.y + 44 - lift * 700, span(t, a.ownInc - .1, a.ownInc + .5), { size: 24, col: GOLD.text });
    PR.forEach(([p0, p1, lab, lp], i) => {
      const u = Math.min(span(t, hit(i) - .5, hit(i)), 1 - ret); if (u <= 0) return;
      F.arrow(ctx, p0, p1, u, { arc: 14, w: 3 });
      caps(ctx, lab, lp[0], lp[1], Math.min(span(t, hit(i) - .4, hit(i) + .2), 1 - ret), { size: 22, col: CREAM });
    });
    const qu = inOut(t, a.everyLab + .5, a.everyLab + 1.1, a.yw - .5, a.yw - .15);
    ser(ctx, '“Every frontier AI lab—including Anthropic—operates inside a set of incentives', 960, 650, 40, qu);
    ser(ctx, 'and constraints that can sometimes conflict with doing the right thing.”', 960, 702, 40, inOut(t, a.everyLab + .7, a.everyLab + 1.3, a.yw - .5, a.yw - .15));
    caps(ctx, 'CHRIS OLAH · VATICAN, 25 MAY 2026', 960, 752, qu, { size: 22 });
  };
  const drawYW = (ctx, t, o = {}) => {
    const d = expoOut(span(t, a.yw - .4, a.yw + .45)); if (d <= 0) return;
    D.bulb(ctx, t, D.BULB[0], lerp(-80, D.BULB[1], d), 1);
    question(ctx, t, 'AND YOUR WORK?', 960, 700, 110, { ts: [a.yw, a.your2, a.work2], out: o.out ?? 0 });
  };
  const S14 = (ctx, t) => {
    const p0 = a.everyLab - .5, p1 = a.everyLab + .5;
    if (t < p1) {   // the house lights go down, the spot stays: the lectern's panel lifts out and becomes the box
      ground(ctx, t);
      const d = sineIO(span(t, p0, p0 + 1.0)), m = sineIO(span(t, p0 + .1, a.everyLab + .35));
      if (d < 1) { ctx.save(); ctx.globalAlpha *= 1 - d; drawHall(ctx, t); ctx.restore(); }
      const src = camRect(hallCam(t), LECTR), dst = { x: BOX.x - BOX.w / 2, y: BOX.y - BOX.h / 2, w: BOX.w, h: BOX.h }, r = lerpR(src, dst, m);
      const yA = r.y - Math.sin(Math.PI * m) * 60;
      F.halo(ctx, r.x + r.w / 2, yA + r.h / 2, 120 + 160 * m, .35 * (1 - m), GOLD.halo, GOLD.core);
      ctx.fillStyle = mixHex(mixHex(GOLD.mid, P.night1, .35), mixHex(P.night1, P.ind2, .55), m); ctx.beginPath(); ctx.roundRect(r.x, yA, r.w, r.h, lerp(2, 14, m)); ctx.fill();
      ctx.strokeStyle = rgba(GOLD.line, .75 * m); ctx.lineWidth = 2.5; ctx.stroke();
      drawPressure(ctx, t, { noBox: true });
      return;
    }
    ground(ctx, t);
    drawPressure(ctx, t);
    drawYW(ctx, t);
  };

  // ======================================================================== S15 · the empty bench, a hand to the displaced (6.08)
  const room2 = (t) => ({ lit: 1, displaced: span(t, a.ifs + .25, a.ifs + 1.0), help: sineIO(span(t, a.supporting - .35, a.supporting + 1.0)), switchOn: 1 });
  const room2Cam = (t) => [960, 540, 1 + .012 * (Math.min(t, a.share2 - .35) - a.ifs)];
  const drawRoom2 = (ctx, t, cam = room2Cam(t)) => {
    look(ctx, cam[0], cam[1], cam[2], () => D.room(ctx, t, room2(t)));
    const qu = span(t, a.supporting - .2, a.supporting + .4);
    ser(ctx, '“…supporting those displaced will be a moral imperative of historic proportions.”', 960, 852, 40, qu);
    caps(ctx, 'CHRIS OLAH · VATICAN, 25 MAY 2026', 960, 892, 0, { size: 22 });
    caps(ctx, 'IF AI DISPLACES PEOPLE AT VERY LARGE SCALE', 960, 120, span(t, a.ifs + .4, a.ifs + 1.0), { size: 24, col: CREAM });
  };
  const S15 = (ctx, t) => {
    ground(ctx, t);
    const ir = quartIO(span(t, a.ifs - .15, a.ifs + .85));
    if (ir < 1) { drawPressure(ctx, t); drawYW(ctx, t, { out: span(t, a.ifs - .1, a.ifs + .5) }); }
    if (ir > 0) iris(ctx, D.BULB[0], D.BULB[1], 20 + ir * 2300, (c) => drawRoom2(c, t));
  };

  // ======================================================================== S16 · the world as dots (6.09)
  const PIPES = [[[31, 4], [33, 13]], [[13, 6], [20, 14]], [[32, 4], [43, 9]]];
  const pipePts = (s, d) => { const [x0, y0] = D.mapPt(...s), [x1, y1] = D.mapPt(...d), mx = (x0 + x1) / 2, my = (y0 + y1) / 2 - 60, out = []; for (let i = 0; i <= 30; i++) { const q = i / 30; out.push([(1 - q) ** 2 * x0 + 2 * (1 - q) * q * mx + q * q * x1, (1 - q) ** 2 * y0 + 2 * (1 - q) * q * my + q * q * y1]); } return out; };
  const drawMap = (ctx, t, o = {}) => {
    const gone = o.gone ?? 0;
    const lt = (d) => smooth(span(t, a.gains - .05 + Math.hypot(d.c - 22, d.r - 5) * .012, a.gains + .35 + Math.hypot(d.c - 22, d.r - 5) * .012));
    if (gone <= 0) for (const d of D.MAPDOTS) {
      const L = D.RICH(d) ? lt(d) : 0;
      ctx.fillStyle = mixHex(mixHex(P.cream, P.blue1, .45), GOLD.hot, L); ctx.globalAlpha = .55 + .45 * L; ctx.beginPath(); ctx.arc(d.x, d.y, 4.2 + 1.8 * L, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
    }
    if (gone <= 0) for (const d of D.MAPDOTS) if (D.RICH(d) && (d.c + d.r) % 3 === 0) { const L = lt(d); if (L > 0) F.halo(ctx, d.x, d.y, 26, .35 * L, P.halo0, P.core0); }
    const pg = 1 - span(t, a.agree - .45, a.agree - .1);
    PIPES.forEach(([s, dd], i) => {
      const pts = pipePts(s, dd), u = span(t, a.gains + .7 + i * .25, a.gains + 1.4 + i * .25) * .55; if (u <= 0 || pg <= 0) return;
      ctx.save(); ctx.setLineDash([12, 9]); ctx.lineDashOffset = -t * 30; F.goldSpan(ctx, pts, 0, u * pg, { w: 2.2, spark: false }); ctx.restore();
      if (u >= .54) { const e = F.along(pts, .55 * pg); ctx.strokeStyle = rgba(CREAM, .9); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(e[0], e[1], 7, 0, TAU); ctx.stroke();
        const [tx, ty] = D.mapPt(...dd); ctx.save(); ctx.setLineDash([6, 6]); ctx.strokeStyle = rgba(CREAM, .6 * pg); ctx.beginPath(); ctx.arc(tx, ty, 26, 0, TAU); ctx.stroke(); ctx.restore(); }
    });
    const nu = inOut(t, a.noMech - .1, a.noMech + .5, a.agree - .45, a.agree - .1);
    caps(ctx, 'NO MECHANISM', D.mapPt(33, 13)[0] + 160, D.mapPt(33, 13)[1] - 30, nu, { size: 26, col: GOLD.text });
    caps(ctx, 'SHARING THE GAINS GLOBALLY', 960, 104, inOut(t, a.share2 + .4, a.share2 + 1.0, a.agree - .45, a.agree - .1), { size: 26, col: CREAM });
    const qu = inOut(t, a.noMech - .25, a.noMech + .35, a.agree - .45, a.agree - .1);
    ser(ctx, '“We do not have a mechanism for this.”', 960, 812, 54, qu);
    caps(ctx, 'CHRIS OLAH · VATICAN, 25 MAY 2026', 960, 858, qu, { size: 22 });
  };
  const S16 = (ctx, t) => {
    const p0 = a.share2 - .35, p1 = a.share2 + .9;
    if (t < p1) {
      const cam = room2Cam(p0), [wx, wy] = F.lookPt(cam[0], cam[1], cam[2], D.ROOMWIN.x, D.ROOMWIN.y), win = { x: wx, y: wy, w: D.ROOMWIN.w * cam[2], h: D.ROOMWIN.h * cam[2] };
      F.portal(ctx, span(t, p0, p1), win, (c) => { ground(c, t); drawRoom2(c, t, cam); }, (c) => { ground(c, t); const sk = 1 - smooth(span(t, p0, p0 + 1.0)); if (sk > 0) { c.save(); c.globalAlpha = sk; D.windowOutside(c, t, { x: -60, y: -60, w: W + 120, h: H + 120 }); c.restore(); } drawMap(c, t); }, { ease: portalEase });
      return;
    }
    ground(ctx, t); drawMap(ctx, t);
  };

  // ======================================================================== S17 · POPE = OLAH (6.10) · not engineered / ★ grown (6.11–6.12) · Series H (6.13–6.15) · the scale (6.16)
  const CL = { x: 250, y: 110, w: 640, h: 280 }, CR = { x: 1030, y: 110, w: 640, h: 280 };
  const DOTT = D.MAPDOTS.map((d, i) => { const c = d.c < 30 ? CL : CR, f = (q) => q - Math.floor(q); return [c.x + 30 + f(i * .618034) * (c.w - 60), c.y + 30 + f(i * .3819 + .2) * (c.h - 60), Math.abs(d.x - 960) / 960 * .3]; });
  const cardU = (t) => expoOut(span(t, a.agree + .05, a.agree + .7));
  const cardsOut = (t) => sineIO(span(t, a.three - .5, a.three + .5));
  const drawCards = (ctx, t) => {
    const out = cardsOut(t) * 700;
    if (t < a.agree + 1.0) D.MAPDOTS.forEach((d, i) => {
      const [tx, ty, dl] = DOTT[i], f = sineIO(span(t, a.agree - .4 + dl, a.agree + .45 + dl)); if (f <= 0) return;
      const r = lerp(4.2, 2.6, f) * (1 - span(f, .85, 1)); if (r <= 0) return;
      const L = D.RICH(d) ? 1 : 0;
      ctx.fillStyle = L ? GOLD.hot : rgba(P.cream, .7); ctx.beginPath(); ctx.arc(lerp(d.x, tx, f), lerp(d.y, ty, f) - Math.sin(Math.PI * f) * 40, r, 0, TAU); ctx.fill();
    });
    const u = cardU(t); if (u <= 0) return;
    ctx.save(); ctx.translate(0, -out);
    for (const [c, nm, sub, q1, q2] of [[CL, 'POPE LEO XIV', 'MAGNIFICA HUMANITAS · §98', '“current AI systems are more', '‘cultivated’ than ‘built’”'], [CR, 'CHRIS OLAH', 'VATICAN, 25 MAY 2026', '“AI systems are not engineered …', '… They are grown …”']]) {
      ctx.save(); ctx.translate(c.x + c.w / 2, c.y + c.h / 2); ctx.scale(u, u); ctx.translate(-c.x - c.w / 2, -c.y - c.h / 2);
      F.paperCard(ctx, t, c.x, c.y, c.w, c.h, { u: 1, rot: 0 });
      ctx.restore();
      const tu = span(t, a.agree + .45, a.agree + 1.0);
      ser(ctx, nm, c.x + 40, c.y + 76, 50, tu, { col: PAPER.ink, align: 'left' });
      F.capsLabel(ctx, sub, c.x + 42, c.y + 116, span(tu, .2, 1), { size: 22, col: PAPER.faint, align: 'left' });
      ser(ctx, q1, c.x + 40, c.y + 186, 36, span(t, a.agree + .7, a.agree + 1.3), { col: mixHex(PAPER.ink, GOLD.deep, .35), align: 'left' });
      ser(ctx, q2, c.x + 40, c.y + 232, 36, span(t, a.agree + .85, a.agree + 1.45), { col: mixHex(PAPER.ink, GOLD.deep, .35), align: 'left' });
    }
    gser(ctx, '=', 960, 290, 130, span(t, a.agree + .5, a.agree + 1.0));
    ctx.restore();
  };
  const bpU = (t) => span(t, a.noteng - .35, a.noteng + .3);
  const drawBlue = (ctx, t) => {
    const down = sineIO(span(t, a.three - .5, a.three + .5)) * 700;
    ctx.save(); ctx.translate(0, down);
    D.blueprint(ctx, t, 250, 450, 640, 330, bpU(t), { body: span(t, a.noteng - .15, a.noteng + .35), wing: span(t, a.noteng + .15, a.noteng + .65), tail: span(t, a.noteng + .45, a.noteng + .95) });
    caps(ctx, 'NOT ENGINEERED', 570, 840, span(t, a.noteng - .05, a.noteng + .45), { size: 30, col: CREAM });
    ctx.restore();
  };
  const PL = { x: 1350, y: 790, h: 400 };
  const plantU = (t) => expoOut(span(t, a.grown - .12, a.grown + 1.5)) * (1 - expoIn(span(t, a.three - .15, a.three + .55)));
  const leafCan = createCanvas(16, 16).getContext('2d');
  const LEAF0 = D.plant(leafCan, a.three - .3, PL.x, PL.y, PL.h, expoOut(span(a.three - .3, a.grown - .12, a.grown + 1.5)), { leaves: false }).slice(0, 11);
  const ROWB = { txt: '$65 BILLION', w: 104, h: 150, gap: 8, y: 280 }, ROWA = { txt: 'SERIES H', w: 60, h: 84, gap: 8, y: 168 }, ROWC = { txt: 'AT A $965 BILLION VALUATION', w: 40, h: 58, gap: 4, y: 462 };
  const rowX = (R, i) => 960 - (R.txt.length * (R.w + R.gap) - R.gap) / 2 + i * (R.w + R.gap);
  const leafF = (t, j) => sineIO(span(t, a.three - .3 + j * .045, a.three + .45 + j * .045));
  const boardU = (t) => expoOut(span(t, a.three + .05, a.three + .7));
  const press2 = (i) => a.press2 + .1 + i * .28;
  const drawBoard = (ctx, t) => {
    const bu = boardU(t);
    if (bu > 0) {   // the board's panel unfolds from the middle row
      const h = 440 * bu, y = 352 - h / 2, sq = 1 - .02 * [0, 1, 2, 3].reduce((s, i) => s + bump(t, press2(i) + .04, .3), 0);
      ctx.save(); ctx.translate(960, 352); ctx.scale(2 - sq, sq); ctx.translate(-960, -352);
      ctx.fillStyle = mixHex(P.night0, P.ind2, .45); ctx.beginPath(); ctx.roundRect(290, y, 1340, h, 16); ctx.fill(); ctx.strokeStyle = rgba(GOLD.line, .7); ctx.lineWidth = 2.5; ctx.stroke();
      ctx.restore();
    }
    // row B: the leaves fly in and become flaps
    [...ROWB.txt].forEach((ch, j) => {
      const f = leafF(t, j); if (f <= 0) return;
      const tx = rowX(ROWB, j) + ROWB.w / 2, ty = ROWB.y + ROWB.h / 2, L = LEAF0[j] ?? LEAF0[LEAF0.length - 1];
      if (f < .55) { const k = f / .55; D.leaf(ctx, lerp(L.x, tx, k), lerp(L.y, ty, k) - Math.sin(Math.PI * k) * 80, lerp(L.ang, 0, k), lerp(L.s, 40, k)); }
      else { const k = expoOut(span(f, .55, 1)), w = lerp(40, ROWB.w, k), h = lerp(22, ROWB.h, k); D.flap(ctx, t, ch, tx - w / 2, ty - h / 2, w, h, a.sixty + .1 + j * .1); }
    });
    [...ROWA.txt].forEach((ch, j) => { const u = expoOut(span(t, a.three + .55 + j * .05, a.three + 1.0 + j * .05)); if (u > 0) D.flap(ctx, t, ch, rowX(ROWA, j), ROWA.y + (1 - u) * 30, ROWA.w, ROWA.h * u, a.three + .9 + j * .07, { col: CREAM }); });
    [...ROWC.txt].forEach((ch, j) => { const u = expoOut(span(t, a.sixty + .5 + j * .025, a.sixty + .9 + j * .025)); if (u > 0) D.flap(ctx, t, ch, rowX(ROWC, j), ROWC.y, ROWC.w, ROWC.h * u, a.sixty + .9 + j * .035, { col: CREAM }); });
    caps(ctx, 'ANTHROPIC · 28 MAY 2026 · THREE DAYS AFTER THE LETTER', 960, 612, span(t, a.three + .5, a.three + 1.1), { size: 24, col: CREAM });
    // 6.14: the ticker unfolds under the board
    const tk = sineIO(span(t, a.nov - .25, a.nov + .35)), th = 64 * tk;
    if (th > .5) {
      ctx.fillStyle = mixHex(P.night0, P.ind0, .6); ctx.fillRect(0, 662, W, th); ctx.fillStyle = rgba(GOLD.line, .7); ctx.fillRect(0, 662, W, 2); ctx.fillRect(0, 662 + th - 2, W, 2);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 662, W, th); ctx.clip();
      const msg = 'ANT  ·  NASDAQ LISTING  ·  19 NOVEMBER 2026  ·  ', mw = F.measure(msg, 30, false, 600) + msg.length * 30 * .08, off = ((t - a.nov) * 28) % mw;
      for (let x = -off; x < W; x += mw) F.glowText(ctx, msg, x, 662 + 44, { size: 30, weight: 600, col: GOLD.text, glow: false, spacing: .08 });
      ctx.restore();
    }
  };
  const PR2 = [[[60, 352], [282, 352]], [[1860, 352], [1638, 352]], [[420, 20], [560, 126]], [[1500, 20], [1360, 126]]];
  const drawPress2 = (ctx, t) => {
    const fly = expoIn(span(t, a.left - .45, a.left + .2));
    PR2.forEach(([p0, p1], i) => {
      const u = span(t, press2(i) - .45, press2(i)); if (u <= 0) return;
      const dx = (p0[0] - p1[0]), dy = (p0[1] - p1[1]), n = Math.hypot(dx, dy), m = fly * 900;
      F.arrow(ctx, [p0[0] + dx / n * m, p0[1] + dy / n * m], [p1[0] + dx / n * m, p1[1] + dy / n * m], u, { arc: 10, w: 3 });
    });
    caps(ctx, 'THE PRESSURES HE NAMED', 960, 96, inOut(t, a.press2 + .2, a.press2 + .8, a.left - .5, a.left - .1), { size: 24, col: CREAM });
    // applause below
    const sink = expoIn(span(t, a.left - .5, a.left + .2));
    for (let i = 0; i < 7; i++) { const u = expoOut(span(t, a.applause - .7 + i * .06, a.applause + .1 + i * .06)); if (u > 0) D.clap(ctx, t, 300 + i * 220, 840 + (1 - u) * 260 + sink * 300, 120, i * 1.7); }
  };
  const cardsCam = (t) => {
    const w = sineIO(span(t, a.grown - .15, a.three - .25)), b = sineIO(span(t, a.three - .35, a.three + .6));
    let cx = lerp(960, 1010, w), cy = lerp(540, 545, w), z = lerp(1, 1.025, w);
    cx = lerp(cx, 960, b); cy = lerp(cy, 520, b); z = lerp(z, 1, b);
    const t0 = S.seamT(T, 'stays'), c = sineIO(span(t, a.left - .5, a.left + .6));
    cx = lerp(cx, W / 2, c); cy = lerp(cy, H / 2 - 20, c); z = lerp(z * (1 + .004 * Math.sin(t * .4) * (1 - c)), 1 + S.CREEP * (t - t0), c);
    return [cx, cy, z];
  };
  const drawScale = (ctx, t) => {
    const su = span(t, a.left + .05, a.left + 1.0); if (su <= 0) return;
    const wu = (i) => span(t, a.left + .75 + i * .25, a.left + 1.25 + i * .25), tilt = sineIO(span(t, a.left + .95, a.left + 2.1));
    F.scale(ctx, t, S.STAYS.x, S.STAYS.y, S.STAYS.s, { u: su, tilt, mini: true, labels: ['WHAT IT GIVES YOU', 'WHAT STAYS YOURS'], labelU: span(t, a.left + 1.1, a.left + 1.7),
      left: (c, px, py, ss) => { const ws = ss * .2; F.weight(c, px - ws * 1.05, py - 2, ws, 'BODY', wu(0), { size: 22 }); F.weight(c, px, py - 2, ws, 'MONEY', wu(1), { size: 22 }); F.weight(c, px + ws * 1.05, py - 2, ws, 'TIME', wu(2), { size: 22 }); } });
    F.question(ctx, t, 'WHAT STAYS YOURS?', W / 2, 200, 64, { ts: [a.left, a.leftW, a.scaleW] });
  };
  const S17 = (ctx, t) => {
    ground(ctx, t);
    if (t < a.agree + .5) drawMap(ctx, t, { gone: span(t, a.agree - .45, a.agree - .4) });
    const cam = cardsCam(t);
    look(ctx, cam[0], cam[1], cam[2], () => {
      if (t < a.three + .5) { drawCards(ctx, t); drawBlue(ctx, t); }
      const pu = plantU(t);
      if (pu > 0) D.plant(ctx, t, PL.x, PL.y, PL.h, pu, { leaves: t < a.three - .3 });
      gser(ctx, 'GROWN', PL.x, 862, 100, inOut(t, a.grown - .05, a.grown + .45, a.three - .4, a.three));
      const col = sineIO(span(t, a.left - .7, a.left + .4));
      if (col < 1 && t > a.three - .4) {
        ctx.save(); ctx.translate(960, lerp(352, S.STAYS.y, col)); ctx.scale(1 - col, 1 - col); ctx.translate(-960, -352);
        drawBoard(ctx, t); ctx.restore();
        if (col > .5) F.halo(ctx, 960, S.STAYS.y, 90, (col - .5) * 1.6, GOLD.halo, GOLD.core);
      }
      if (t > a.press2 - .6) drawPress2(ctx, t);
      drawScale(ctx, t);
    });
  };

  // ======================================================================== one frame
  const SEC = [[tPortal1, S1], [a.last - .3, (c, t) => drawBulbFrame(c, t)], [a.ask - .25, S3], [a.hand - .45, S4], [a.work149 - .75, S5], [a.risk - .45, S6],
    [a.soc - .3, S7], [a.share - .45, S8], [a.day - .45, S9], [a.cling - .1, S10], [a.fair - .35, S11], [a.pres - .25, S12], [a.everyLab - .35, S13],
    [a.ifs - .15, S14], [a.share2 - .35, S15], [a.agree - .35, S16], [tPlate, S17]];
  const draw = (ctx, t) => {
    if (t >= tPlate) { S.plateStays(ctx, t, T); return; }
    for (const [tEnd, fn] of SEC) if (t < tEnd) { fn(ctx, t); return; }
  };
  return { draw, a };
}
