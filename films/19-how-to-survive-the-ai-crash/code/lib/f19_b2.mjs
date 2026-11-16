// Film 19 · B2 · c07–c10 (257.61–418.70 s) as ONE continuous take: makeB2(T) → draw(ctx, t). The four scene files share it, so every
// chunk boundary (c07|c08, c08|c09, c09|c10) is identical by construction. Anchored only on words (T.G / T.GE / goreFlight).
//
// PLAN (motion DNA: calm + soft editorial; camera sine-S on words; one main motion at a time; carriers from shots.md):
//   c07  plateLine → the payslip dims on "paychecks" → folds into a money stack (accordion) → "halved": the stack sags, its old
//        height stays as a dotted outline → the outline trucks right and becomes the glass door of the town (you there) → HIRING
//        PAUSED swings down · the whiteboard is wiped · the inbox stays empty → the inbox card folds into an envelope → gore 3 →
//        a $400 bill drifts into your hands → ten figures rise out of it, six fill gold → the bill flips to RENT and stands wobbling,
//        an envelope leans on it and holds it → an hourglass drifts down and turns → the HUD counter clones out and fills the frame.
//   c08  the big counter's flaps fold onto their split line = the route line; stops grow; the dot runs (dayAt) → window 282 (price
//        tag climbs, dial shoots up, the 2022 line lands gold) folds into its stop → window 517 (house of cards, LEHMAN tips, frost)
//        → the frost fogs the pane and clears from the centre into the 2009 memory → the photo shrinks into the 517 exit sign on the
//        road in winter light; you walk past it.
//   c09  sign 929 comes to you → its www glyph swells into a bubble, ours floats in → push into the www bubble: empty shops, tags,
//        neon dies → pull back, the film becomes the exit window: the long fall, gold bottom, dotted creep back → folds into the sign →
//        a window opens in the mist and grows into the 2001 office (one lamp) → a spark from the lamp: the Google bar over the zero
//        line → the zero line becomes the 2001–2007 timeline with five start points → the lamp light widens: three people → push
//        into the CRT: the price tag walks down the ÷10 stairs → gore 4 → ★ pull back while a warm time front sweeps the room:
//        2001 → today (CRT → laptop, the typist → you, poster → TV) → the HUD umbrella clones into your hand, four gores lit →
//        the lamp goes out, only your umbrella glows → pull back: many roads, each figure alone under a small umbrella.
//   c10  push in on your road (mist takes the others) → ★ the camera sinks below the road: three nets between named pillars →
//        push to the 1933 pillar, a window opens from its stone: the bank, CLOSED, the empty passbook → DEPOSITS INSURED, the first
//        net knots itself under the bank → a cent falls into it and stays → the cent flies out onto your phone, becomes the net icon
//        beside the balance ($250,000 / €100,000) → the window folds back into the pillar, pull back → plateNet.
import * as E from './f10_editorial.mjs';
import * as F from './f19_kit.mjs';
import * as PR from './f19_props.mjs';
import { plateLine, plateNet, seamWindow, SEAM_HALF, LINE_PLATE, NET_PLATE, HALL } from './f19_seams.mjs';
import { hourglass } from './f13_kit.mjs';
import { tag as tag18, stamp, coin } from './f18_kit.mjs';
import * as B from './f19_b2_props.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, lin, rad, drift, glowFill } = E;
const { RED, COOL } = F;
const { rise, riseText, cam, camK, view, toS, nightBg } = B;

// ================================================================================================================== anchors
export function anchors(T) {
  const G = (p, f) => T.G(p, 0, f ?? -1), GE = (p, f) => T.GE(p, 0, f ?? -1);
  const A = {};
  A.T0 = G('And if the fall keeps going');
  A.pay = G('paychecks', A.T0); A.when = G('When the dot-com', A.T0); A.dot = G('dot-com bubble', A.when); A.halved = G('halved', A.when);
  A.ifThat = G('If that happens again', A.T0); A.freeze = G('hiring freeze', A.ifThat); A.cancel = G('canceled project', A.ifThat); A.never = G('never comes', A.ifThat);
  A.third = G('So the third protection', A.T0); A.buffer = F.goreFlight(T, 2);
  A.picture = G('Picture a surprise bill', A.T0); A.f400 = G('four hundred dollars', A.picture);
  A.inAm = G('In America, only', A.picture); A.six = G('six in ten', A.inAm);
  A.fam = G('Families with even', A.inAm); A.few = G('few hundred dollars', A.fam); A.rent = G('fall behind on rent', A.fam);
  A.noStop = G("A buffer doesn't stop", A.fam); A.think = G('time to think', A.noStop);
  A.c08 = G('Day two hundred eighty-two'); A.c08e = GE('Day two hundred eighty-two');
  A.rate = G('rate shock', A.c08); A.prices = G('prices rose', A.c08); A.forty = G('forty years', A.c08); A.shot = G('shot up', A.c08);
  A.stopped = G('stopped here', A.c08); A.d517 = G('Day five hundred seventeen'); A.d517e = GE('Day five hundred seventeen');
  A.fin = G('financial crisis', A.d517); A.banks = G('Banks had piled', A.d517); A.risky = G('risky home loans', A.d517); A.when2 = G('When one giant bank', A.d517);
  A.collapsed = G('collapsed', A.d517); A.froze = G('froze', A.d517); A.hit = G('It hit bottom here', A.d517); A.bottom = G('bottom here', A.hit);
  A.ifYou = G('If you were working', A.d517); A.backThen = G('back then', A.ifYou); A.remember = G('remember this exit', A.ifYou);
  A.c09 = G('Day nine hundred twenty-nine'); A.dotcom = G('dot-com bubble', A.c09); A.compared = G('compared to most', A.c09);
  A.backThen2 = G('Back then, the market', A.c09); A.billions = G('billions', A.backThen2); A.noProfit = G('never made a profit', A.backThen2);
  A.oct = G('In October two thousand two', A.c09); A.finally = G('finally stopped', A.oct); A.five = G('five more years', A.oct);
  A.whether = G('Whether ours runs', A.c09); A.dontKnow = G("don't know yet", A.whether);
  A.look = G('But look at what grew', A.c09); A.hang1 = G('hangover', A.look);
  A.y2001 = G('In two thousand one', A.look); A.google = G('Google', A.y2001); A.profit = G('first full-year profit', A.y2001);
  A.wiki = G('Wikipedia', A.y2001); A.linked = G('LinkedIn', A.wiki); A.skype = G('Skype', A.wiki); A.face = G('Facebook', A.wiki); A.yt = G('YouTube', A.wiki);
  A.climbed = G('climbed back', A.wiki); A.notBoom = G('Not in the boom', A.wiki); A.inHang = G('In the hangover', A.notBoom); A.hang2 = G('hangover', A.inHang);
  A.today = G('Today, the price', A.c09); A.falling = G('keeps falling', A.today); A.tenx = G('ten times cheaper', A.today);
  A.fourth = G('So the fourth protection', A.today); A.cheap = F.goreFlight(T, 3);
  A.isnt = G("This isn't about stocks", A.fourth); A.stocks = G('stocks', A.isnt); A.tools = G('tools', A.isnt);
  A.learn = G('Learn one of them', A.isnt); A.red = G('headlines are still red', A.learn);
  A.fourP = G('Four protections', A.learn); A.yours = G('all of them yours', A.fourP);
  A.isEnough = G('But is it enough', A.fourP); A.themselves = G('protects themselves', A.isEnough);
  A.c10 = G('On a road this long'); A.enough = G('stops being enough', A.c10);
  A.great = G('But the great crashes', A.c10); A.nets = G('safety nets', A.great);
  A.early = G('In the early', A.great); A.failed = G('banks failed', A.early); A.savings = G('savings', A.failed);
  A.y1933 = G('So in nineteen', A.early); A.insure = G('insure bank deposits', A.y1933);
  A.since = G('Since then', A.y1933); A.cent = G('single cent', A.since);
  A.ifBank = G('If your bank failed', A.since); A.k250 = G('two hundred fifty thousand', A.ifBank);
  A.T1 = G('On Black Monday');
  return A;
}

// ================================================================================================================== small helpers
const pend = (t, t0, amp, f = 2.4, k = 1.6) => (t < t0 ? 0 : amp * Math.exp(-(t - t0) * k) * Math.sin((t - t0) * f * Math.PI * 2));
const arc2 = (a, b, lift, e) => { const cx = (a[0] + b[0]) / 2, cy = Math.min(a[1], b[1]) - lift; return [(1 - e) ** 2 * a[0] + 2 * (1 - e) * e * cx + e * e * b[0], (1 - e) ** 2 * a[1] + 2 * (1 - e) * e * cy + e * e * b[1]]; };
const lerpR = (a, b, e) => ({ x: lerp(a.x, b.x, e), y: lerp(a.y, b.y, e), w: lerp(a.w, b.w, e), h: lerp(a.h, b.h, e) });
function goreLine(ctx, t, T, i, y = 800) {   // the protection's line rises after its landing and sinks after 2.4 s
  const { t1 } = F.goreFlight(T, i);
  riseText(ctx, F.GORE_TEXT[i], W / 2, y, span(t, t1 - .1, t1 + .5), { size: 38, align: 'center', spacing: .1, out: span(t, t1 + 2.6, t1 + 3.1) });
}
function source(ctx, s, x, y, u, o = {}) { riseText(ctx, s, x, y, u, { size: 22, weight: 600, col: P.halo2, glow: false, spacing: .12, ...o }); }

// ================================================================================================================== C07
// layout (design space of the town; camera trucks right by TR)
const STK = { x: 700, yb: 800, w: 380, h: 440 };          // the venture-money stack (2001 = 41)
const DOOR = { x: 1700, y: 300, w: 300, h: 500 };          // the glass door of the town (design)
const YOU7 = { x: 1600, y: 800, h: 250 };
function c07(ctx, t, T, A) {
  const fold0 = A.when - .25, fold1 = fold0 + 1.6, trk0 = A.ifThat - .1, trk1 = trk0 + 1.9;
  // ---------- camera (design → screen). Truck right onto the door, then close on you.
  const K = [[A.T0, cam(1, 960, 540)], [trk0, cam(1, 960, 540)], [trk1, cam(1, 1660, 540)], [A.never - 1.6, cam(1, 1660, 540)],
    [A.third + .2, cam(1.7, 1790, 600)], [A.picture + 1.2, cam(1.7, 1790, 600)], [A.noStop, cam(1.78, 1800, 600)], [A.c08, cam(1.82, 1806, 600)]];
  const c = B.camDrift2(camK(t, K), t, .6);
  // ---------- night ground (screen) + the mailbox light from below (the plate's), which becomes the door's light
  nightBg(ctx, t);
  const mbox = 1 - smooth(span(t, trk0, trk1));
  if (mbox > 0) halo(ctx, 960, 1160, 900, .35 * mbox);
  // ---------- 7.01 the payslip (= plate at T0+.5), 7.02 the fold into the stack, the sag, the outline
  const pushE = 1 - (1 - span(t, A.T0 + SEAM_HALF, fold0)) ** 2, fu = sineIO(span(t, fold0, fold0 + 1.0)), au = expoOut(span(t, fold0 + .75, fold1));
  const sag = quartIO(span(t, A.halved - .2, A.halved + .9)), hNow = STK.h * lerp(1, 21 / 41, sag);
  const sink = expoIn(span(t, trk0 + .1, trk0 + 1.0));
  const tsh = 900 * (1 - sineIO(span(t, trk0, trk1 + .3)));   // the town is foreground: it slides in from the right faster than the truck (parallax)
  view(ctx, c, () => {
    if (t < fold0 + 1.02) {
      // the payslip: pushes in a little, the net line dims on "paychecks"; then squashes (accordion) into the top bill of the stack
      const net = lerp(.6, .08, smooth(span(t, A.pay - .1, A.pay + .5)));
      const w0 = LINE_PLATE.w * (1 + .06 * pushE), x0 = LINE_PLATE.x, y0 = LINE_PLATE.y - 8 * pushE;
      const topY = STK.yb - STK.h + 10;
      const x = lerp(x0, STK.x, fu), y = lerp(y0, topY, fu), sx = lerp(1, STK.w / w0, fu), sy = lerp(1, 20 / (w0 * .62), fu), tilt = lerp(LINE_PLATE.tilt, 0, fu);
      ctx.save(); ctx.translate(x, y); ctx.scale(sx, sy); PR.payslip(ctx, t, 0, 0, w0, { tilt, lit: lerp(.9, .6, fu), net, red: [0, 1] }); ctx.restore();
    }
    if (t >= fold0 + .75) {
      // the stack unfolds downward from the top bill, sags on "halved", then sinks below the floor line
      const h = lerp(20, hNow, au), yb = lerp(STK.yb - STK.h + 20, STK.yb, au);
      ctx.save(); ctx.beginPath(); ctx.rect(-2000, -2000, 6000, 2000 + STK.yb); ctx.clip();
      B.moneyStack(ctx, t, STK.x, yb + sink * (hNow + 30), STK.w, h, { n: 22 });
      ctx.restore();
    }
    // the floor line under the stack; it grows outward into the pavement edge during the truck
    const fl = expoOut(span(t, fold0 + .6, fold1)), ext = smooth(span(t, trk0 + .2, trk1));
    if (fl > 0) { ctx.fillStyle = rgba(P.halo0, .55 * fl); ctx.fillRect(lerp(STK.x, -400, ext) - STK.w * .7 * fl, STK.yb, STK.w * 1.4 * fl + lerp(0, 3600, ext), 2); }
    // the dotted outline: left behind by the sag (sides grow down with the falling top), then trucks right and becomes the door frame
    if (sag > 0) {
      const m = quartIO(span(t, trk0 + .3, trk1 - .1)), o0 = { x: STK.x - STK.w / 2 - 10, y: STK.yb - STK.h - 10, w: STK.w + 20, h: STK.h + 10 };
      const r = lerpR(o0, { ...DOOR, x: DOOR.x + tsh }, m), topNow = STK.yb - hNow;
      ctx.save(); ctx.strokeStyle = rgba(P.halo0, .85); ctx.lineWidth = lerp(3, 4, m); ctx.setLineDash([lerp(4, 40, m), lerp(12, 0.01, m)]);
      ctx.shadowColor = rgba(P.halo0, .8); ctx.shadowBlur = 10;
      if (m <= 0) { ctx.beginPath(); ctx.moveTo(r.x, Math.min(topNow, r.y + r.h)); ctx.lineTo(r.x, r.y); ctx.lineTo(r.x + r.w, r.y); ctx.lineTo(r.x + r.w, Math.min(topNow, r.y + r.h)); ctx.stroke(); }
      else ctx.strokeRect(r.x, r.y, r.w, r.h);
      ctx.restore();
    }
    // ---------- the town (enters from the right with the truck): facade, the glass door lights up, you
    if (t > trk0) {
      ctx.save(); ctx.translate(tsh, 0);
      const light = smooth(span(t, trk1 - .5, trk1 + .2)) * (1 + .06 * Math.sin(t * 2.3) * 0) * (1 - .35 * smooth(span(t, A.inAm, A.inAm + .6)) * (1 - smooth(span(t, A.fam, A.fam + .8))));
      B.facade(ctx, t, 1300, 3200, 120, 800);
      const wipe = smooth(span(t, A.cancel - .1, A.cancel + .9));
      B.glassDoor(ctx, t, DOOR.x, DOOR.y, DOOR.w, DOOR.h, { light, wipe, person: (cx) => {
        const arm = Math.sin(clamp((t - (A.cancel - .2)) / 1.1) * Math.PI);
        E.person(cx, DOOR.x + 220 - 40 * wipe, DOOR.y + 470, 250, { dir: -1, armR: [lerp(.3, 2.3, arm), lerp(.2, 2.5, arm)], light: 1, lean: .02 * Math.sin(t * .7) });
      } });
      // HIRING PAUSED swings down on its string
      const sw = A.freeze - .25, drop = span(t, sw, sw + .35);
      B.hangSign(ctx, t, DOOR.x + DOOR.w / 2, DOOR.y + 24, 'HIRING PAUSED', pend(t, sw + .3, .16, .7, 1.1) + .01 * Math.sin(t * 1.3), drop, { w: 230, h: 62, L: 60 });
      ctx.restore();
      ctx.save(); ctx.globalAlpha *= 1 - mbox;   // the pavement darkens in as the mailbox light below dies away
      ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.fillRect(-500, 800, 4000, 600); ctx.restore();   // pavement
      ctx.fillStyle = rgba(P.halo0, .5); ctx.fillRect(-500, 800, 4000, 2);
    }
  });
  // ---------- you (design space via the camera): walk in? no: you stand at the door, look; the phone; the bill; the envelope
  let hands = null;
  if (t > trk0) {
    view(ctx, c, () => {
      const phoneUp = smooth(span(t, A.never - 1.2, A.never - .5)) * (1 - smooth(span(t, A.third + .3, A.third + .9)));
      const hold = smooth(span(t, A.f400 - .5, A.f400 + .1)) * (1 - smooth(span(t, A.fam + .3, A.fam + .8)));
      const pock = smooth(span(t, A.few - .9, A.few - .4)) * (1 - smooth(span(t, A.few + .4, A.few + .9)));
      const armR = [lerp(lerp(.2, 1.2, phoneUp), 1.0, hold), lerp(lerp(.1, 2.15, phoneUp), 2.1, hold)];
      const armL = [lerp(lerp(-.2, -.2, 0), lerp(-1.0, .55, pock), Math.max(hold, pock)), lerp(-.1, lerp(-2.0, .3, pock), Math.max(hold, pock))];
      const look = lerp(.15, -.2, Math.max(phoneUp, hold)) + .05 * Math.sin(t * .8);
      hands = E.du(ctx, YOU7.x + tsh, YOU7.y, YOU7.h, { dir: 1, armR, armL, look, light: 1, lean: .015 * Math.sin(t * .5) });
    });
  }
  const sp = (x, y) => toS(c, x, y);
  // ---------- 7.01–7.02 text (screen, right side)
  {
    const out = span(t, trk0 - .4, trk0 + .1);
    riseText(ctx, 'THE DOT-COM BUBBLE · 2001', 1110, 330, span(t, A.dot - .1, A.dot + .5), { size: 34, spacing: .06, out });
    riseText(ctx, 'US VENTURE CAPITAL · 2001 → 2002', 1110, 395, span(t, fold1 - .3, fold1 + .3), { size: 24, weight: 600, col: P.halo2, glow: false, spacing: .1, out: span(t, trk0 - .3, trk0 + .2) });
    const v = Math.round(lerp(41, 21, sag));
    riseText(ctx, `$${v}B`, 1100, 560, span(t, fold1 - .1, fold1 + .5), { size: 150, serif: true, out: span(t, trk0 - .2, trk0 + .3) });
    source(ctx, 'PWC / NVCA MONEYTREE', 1112, 640, span(t, fold1 + .3, fold1 + .9), { out: span(t, trk0 - .1, trk0 + .4) });
  }
  // ---------- 7.03 the phone: its inbox lifts off as a card; 7.04 folds into an envelope → gore 3
  if (hands) {
    const hR = sp(...hands.R), up = smooth(span(t, A.never - 1.2, A.never - .5)), z = c.z;
    const env0 = A.buffer.t0 - 1.1, card = smooth(span(t, A.never - .9, A.never - .1)), fold = quartIO(span(t, env0, env0 + .7));
    if (up > 0 && t < A.buffer.t0 + .02) {
      // phone in your right hand
      ctx.save(); ctx.globalAlpha *= 1; PR.phone(ctx, t, hR[0] + 6 * z, hR[1] - 22 * z, 54 * z, { face: 1, a: up, screen: (cx, r) => B.inbox(cx, r, t) }); ctx.restore();
    }
    // the inbox card: grows out of the phone screen beside your head
    const cardR0 = { x: hR[0] - 12 * z, y: hR[1] - 44 * z, w: 24 * z, h: 42 * z }, cardR1 = { x: hR[0] + 70, y: hR[1] - 330, w: 200, h: 260 };
    const pos = F.flyToGore(t, T, 2, [cardR1.x + 100, cardR1.y + 130]);
    if (card > 0 && !pos.landed) {
      if (fold <= 0) {
        const r = lerpR(cardR0, cardR1, card);
        ctx.save();
        ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 12); ctx.save(); ctx.clip(); B.inbox(ctx, r, t); ctx.restore();
        const pap = smooth(span(t, env0 - .45, env0));   // the card turns to paper just before it folds (the envelope's material)
        ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 12);
        ctx.strokeStyle = rgba(P.halo0, .7); ctx.lineWidth = 2; ctx.stroke(); halo(ctx, r.x + r.w / 2, r.y + r.h / 2, r.w * .9, .15 * (1 - pap));
        // the envelope's paper (exactly its first fold frame) comes up through the card
        if (pap > 0) { ctx.save(); ctx.globalAlpha *= pap; ctx.translate(pos.x, pos.y); ctx.scale(1, 260 / 200 / .64); PR.envelope(ctx, t, 0, 0, 200 * pos.s, { open: 1, lit: .8 }); ctx.restore(); }
        ctx.restore();
      } else {
        // fold: the card flattens into an envelope (flap closes), then flies into the umbrella
        const w = lerp(200, 190, fold) * pos.s, open = 1 - fold;
        const sq = lerp(1, .64 * 190 / 260, fold);
        if (fold < 1 && pos.u <= 0) { ctx.save(); ctx.translate(pos.x, pos.y); ctx.scale(1, lerp(260 / 200 / .64, 1, fold)); PR.envelope(ctx, t, 0, 0, w, { open, lit: .8 }); ctx.restore(); void sq; }
        else PR.envelope(ctx, t, pos.x, pos.y, w, { open: 0, lit: .9 });
      }
    }
    goreLine(ctx, t, T, 2);
  }
  // ---------- 7.05 the $400 bill drifts down into your hands; 7.06 ten figures rise out of it; 7.07 it flips to RENT and stands
  if (hands && t > A.picture - .2) {
    const hR = sp(...hands.R), hL = sp(...hands.L), mid = [(hR[0] + hL[0]) / 2, (hR[1] + hL[1]) / 2 - 40];
    const land = A.f400, d0 = A.picture + .1, du = span(t, d0, land);
    const fallP = [lerp(mid[0] + 160, mid[0], sineIO(du)) + Math.sin(du * 5) * 40 * (1 - du), lerp(-180, mid[1], 1 - (1 - du) ** 2)];
    const standT0 = A.fam + .2, sU = quartIO(span(t, standT0, standT0 + 1.2));
    const RENT = [1535, 735];
    // wobble grows until the envelope leans on it ("fall behind on rent"), then it holds
    const lean = smooth(span(t, A.rent - .25, A.rent + .1));
    const wob = (t > standT0 + 1.2 ? smooth(span(t, standT0 + 1.2, A.rent - .3)) : 0) * (1 - lean) * .14 * Math.sin((t - standT0) * 5.2) - lean * .035 + pend(t, A.rent, .03, 1.6, 2.5);
    let bp = du < 1 ? fallP : mid, tilt = du < 1 ? Math.sin(du * 6) * .25 * (1 - du) : .02 * Math.sin(t * 1.1);
    let flip = 1, head = 'REPAIR', amount = '$400';
    if (sU > 0) { bp = arc2(mid, RENT, 120, sU); flip = Math.cos(Math.PI * sU); if (sU > .5) { head = 'RENT'; amount = 'DUE'; } tilt = lerp(tilt, 0, sU); }
    if (t > standT0 + 1.2) { tilt = wob; }
    const bw = lerp(190, 210, sU);
    if (t > standT0 + 1.2) { ctx.save(); ctx.translate(RENT[0], RENT[1] + bw * 1.25 / 2); ctx.rotate(tilt); B.bill(ctx, t, 0, -bw * 1.25 / 2, bw, { head, amount, lit: .7 }); ctx.restore(); }
    else B.bill(ctx, t, bp[0], bp[1], bw, { head, amount, tilt, flip, lit: .7 });
    // ten figures out of the bill: rise in turn to a row; six fill gold on "six in ten"; they sink back into the bill on "Families"
    const rowY = 335, back = quartIO(span(t, A.fam - .1, A.fam + .6));
    for (let i = 0; i < 10; i++) {
      const u = expoOut(span(t, A.inAm + .15 + i * .07, A.inAm + .95 + i * .07)); if (u <= 0 || back >= 1) continue;
      const to = [1330 + i * 58, rowY], p = arc2([mid[0], mid[1] - 40], to, 60, u * (1 - back));
      B.figIcon(ctx, p[0], p[1], 74 * lerp(.4, 1, u * (1 - back)), i < 6 ? smooth(span(t, A.six - .05 + i * .06, A.six + .35 + i * .06)) : 0);
    }
    riseText(ctx, '63 %', 1500, 520, span(t, A.six + .2, A.six + .8), { size: 140, serif: true, out: span(t, A.fam - .3, A.fam + .2) });
    source(ctx, 'FEDERAL RESERVE, SHED 2025', 1500, 575, span(t, A.six + .5, A.six + 1.1), { out: span(t, A.fam - .3, A.fam + .2) });
    // the thin envelope: out of your left hand, glides to lean against the rent bill
    const eu = quartIO(span(t, A.few + .1, A.rent - .2));
    if (t > A.few - .5) {
      const from = [hL[0], hL[1] - 10], to = [RENT[0] - bw * .62, RENT[1] + 70];
      const p = eu > 0 ? arc2(from, to, 90, eu) : from;
      PR.envelope(ctx, t, p[0], p[1], 120, { tilt: lerp(0, -1.25, eu), lit: .9, a: smooth(span(t, A.few - .5, A.few - .2)) > 0 ? 1 : 0 });
    }
    riseText(ctx, '$250–749 IN SAVINGS', RENT[0] + 10, 470, span(t, A.rent - .2, A.rent + .4), { size: 32, align: 'center', spacing: .04, out: span(t, A.think - .2, A.think + .3) });
    source(ctx, 'URBAN INSTITUTE', RENT[0] + 10, 512, span(t, A.rent, A.rent + .6), { align: 'center', out: span(t, A.think - .2, A.think + .3) });
    // 7.08 the hourglass drifts down beside the envelope and turns on "time to think"
    const hg = span(t, A.noStop + .1, A.noStop + 1.1);
    if (hg > 0) {
      const hx = 1760, hb = lerp(-60, 860, 1 - (1 - hg) ** 3), turn = quartIO(span(t, A.think - .1, A.think + .6));
      ctx.save(); ctx.translate(hx, hb - 110); ctx.rotate(Math.PI * turn + Math.sin(hg * 7) * .15 * (1 - hg));
      hourglass(ctx, 0, 110, 220, t, { top: turn < .5 ? .15 : lerp(.85, .7, span(t, A.think + .6, A.c08 + 1)), bot: turn < .5 ? .8 : lerp(.1, .25, span(t, A.think + .6, A.c08 + 1)), flow: turn >= 1 ? 1 : 0 });
      ctx.restore();
    }
  }
}
// the counter clone: grows out of the HUD from "time to think" and fills the frame (c07 end); folds onto the route line (c08 start)
const BIG = { h: 380, y: F.ROUTE.y };
function bigCounter(ctx, t, T, A) {
  const g = quartIO(span(t, A.think + .35, A.c08 - .25)), fold = quartIO(span(t, A.c08 + .25, A.c08 + 1.05));
  if (g <= 0 || fold >= 1) return;
  const h = lerp(F.HUD_DAY.h, BIG.h, g), x = lerp(F.HUD_DAY.x, W / 2, g), y = lerp(F.HUD_DAY.y, BIG.y - BIG.h / 2, g);
  ctx.save(); ctx.translate(0, BIG.y); ctx.scale(1, 1 - fold); ctx.translate(0, -BIG.y);
  F.flap(ctx, t, x, y, h, { value: F.dayAt(t, T), align: g < .5 ? 'right' : 'center', glow: 1 });
  ctx.restore();
}
// the mat behind the growing counter: the town recedes into the night of the route map (a light going down, not a blend of pictures)
function counterMat(ctx, t, A) {
  const m = smooth(span(t, A.think + .6, A.c08 - .1)); if (m <= 0) return;
  ctx.save(); ctx.globalAlpha = m; nightBg(ctx, t); ctx.restore();
}

// ================================================================================================================== C08 · the route map
const WIN8 = { x: 330, y: 92, w: 1260, h: 392 };
function glyphRect(i) { const x = F.ROUTE.X(F.EXITS[i].day), y = F.ROUTE.y - 118; return { x: x - 50, y: y - 1, w: 100, h: 3 }; }
function routeMapAt(ctx, t, T, A) {
  const fold = quartIO(span(t, A.c08 + .25, A.c08 + 1.05)), ext = smooth(span(t, A.c08 + .3, A.c08 + 1.3));
  const day = F.dayAt(t, T), g = (i) => expoOut(span(t, A.c08 + .9 + i * .14, A.c08 + 1.6 + i * .14));
  const lit = [0, span(t, A.c08e - .2, A.c08e + .3), span(t, A.d517e - .2, A.d517e + .3), 0];
  ctx.save(); ctx.beginPath(); const half = lerp(0, 1000, ext); ctx.rect(W / 2 - half, 0, half * 2, H); ctx.clip();
  const rm = F.routeMap(ctx, t, { u: 1, stops: [g(0), g(1), g(2), g(3)], names: [g(0), g(1), g(2), g(3)], lit, run: day * smooth(span(t, A.c08 + .9, A.c08 + 1.5)), end: g(4) });
  ctx.restore();
  // today's dot (grows out of the line)
  const dg = expoOut(span(t, A.c08 + .8, A.c08 + 1.4));
  if (dg > 0) { const x = rm.X(day); halo(ctx, x, F.ROUTE.y, 60 * dg, .55); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(x, F.ROUTE.y, 11 * dg, 0, 7); ctx.fill(); }
  void fold; return rm;
}
function c08(ctx, t, T, A) {
  // ---------- 8.02–8.03 the rate-shock window
  nightBg(ctx, t);
  // between the two windows the camera leans in toward the 517 stop while the dot travels there, and eases back as its window opens
  const lean = Math.sin(Math.PI * sineIO(span(t, A.stopped + 1.25, A.banks - .15))), gr = glyphRect(2), lz = 1 + .09 * lean;
  ctx.save(); if (lean > 0) { const fx = gr.x + 50, fy = gr.y + 60; ctx.translate(fx, fy); ctx.scale(lz, lz); ctx.translate(-fx, -fy); }
  routeMapAt(ctx, t, T, A);
  ctx.restore();
  const o1 = smooth(span(t, A.c08e + .1, A.prices - .3)) * (1 - quartIO(span(t, A.stopped + .55, A.stopped + 1.2)));
  if (o1 > 0) F.vWindow(ctx, t, WIN8, o1, (cx, r) => {
    const k = r.w / WIN8.w, X = (x) => r.x + x * k, Y = (y) => r.y + y * k;
    cx.save(); cx.translate(r.x, r.y); cx.scale(k, k);
    cx.fillStyle = lin(cx, 0, 0, 0, WIN8.h, [[0, P.night1], [1, mixHex(P.ind0, P.blue1, .2)]]); cx.fillRect(0, 0, WIN8.w, WIN8.h);
    const lu = span(t, A.prices - .5, A.stopped);
    const L = F.lossLine(cx, t, { x: 70, y: 70, w: WIN8.w - 160, h: 260 }, 'rate', lu, { scale: 30, gold: smooth(span(t, A.stopped - .05, A.stopped + .4)) });
    // the price tag climbs on its thread; the dial shoots up
    const up = quartIO(span(t, A.prices - .2, A.prices + 1.1)) + .25 * quartIO(span(t, A.forty - .1, A.forty + .9));
    tag18(cx, t, 300, lerp(250, 70, up / 1.25), 80, { text: '$', swing: .05 * Math.sin(t * 1.4) + pend(t, A.prices + .9, .08, .8), u: 1, size: .5 });
    B.dial(cx, t, 1010, 190, 92, quartIO(span(t, A.shot - .25, A.shot + .7)) * .9 + .08);
    if (L.low) { riseText(cx, 'OCT 12, 2022 · −25 % · DAY 282', L.low[0] - 24, L.low[1] - 36, span(t, A.stopped + .05, A.stopped + .6), { size: 26, align: 'right', spacing: .06 }); }
    cx.restore(); void X; void Y;
  }, { from: glyphRect(1), mat: .5 });
  // ---------- 8.05–8.06 the financial-crisis window, 8.07 the frost fogs it and clears into the 2009 memory
  const op2 = smooth(span(t, A.banks - .1, A.banks + .55));
  const grow = sineIO(span(t, A.ifYou + .1, A.backThen + .6));
  const shrink = quartIO(span(t, A.remember + .25, A.remember + 1.05));
  if (op2 > 0 && t < A.remember + .25) {
    const full = { x: -60, y: -40, w: 2040, h: 1160 };
    const rect = lerpR(WIN8, full, grow);
    F.vWindow(ctx, t, rect, op2, (cx, r) => win517(cx, t, T, A, r), { from: glyphRect(2), mat: .5 });
  }
  return shrink;
}
function win517(cx, t, T, A, r) {
  // inside drawn in the WIN8 design box scaled to the rect; the memory photo in full-frame design (revealed by the clearing frost)
  const k = r.w / WIN8.w;
  cx.save(); cx.translate(r.x, r.y); cx.scale(k, k);
  cx.fillStyle = lin(cx, 0, 0, 0, WIN8.h, [[0, P.night1], [1, mixHex(P.ind0, P.blue1, .2)]]); cx.fillRect(-200, -200, WIN8.w + 400, WIN8.h + 400);
  // the money lines (lending between banks): gold arcs with flow dots, freezing on "froze"
  const fz = smooth(span(t, A.froze - .1, A.froze + 1.2)), nodes = [[90, 120], [300, 60], [520, 140], [760, 70], [980, 150], [1180, 80], [400, 250], [860, 260]];
  cx.lineWidth = 2;
  for (let i = 0; i < nodes.length; i++) for (const j of [(i + 1) % nodes.length, (i + 3) % nodes.length]) {
    const a = nodes[i], b = nodes[j]; cx.strokeStyle = rgba(mixHex(P.halo1, COOL.mid, fz), .22); cx.beginPath(); cx.moveTo(a[0], a[1]); cx.quadraticCurveTo((a[0] + b[0]) / 2, Math.min(a[1], b[1]) - 50, b[0], b[1]); cx.stroke();
    const f = ((t * .35 * (1 - fz) + i * .17) % 1), q = arc2(a, b, 50, f); cx.fillStyle = rgba(P.halo0, .7 * (1 - fz)); cx.beginPath(); cx.arc(q[0], q[1], 3, 0, 7); cx.fill();
  }
  // the house of cards (home-loan contracts) and the bank tower that tips
  const hu = span(t, A.banks + .2, A.risky + .35), tipT = A.collapsed - .25, tip = quartIO(span(t, tipT, tipT + 1.6));
  B.houseOfCards(cx, t, 300, 372, 1, hu, { shake: smooth(span(t, A.risky, A.risky + .5)) * (1 - tip), slump: 0 });
  const tw = smooth(span(t, A.when2 - .2, A.when2 + .6));
  cx.save(); cx.beginPath(); cx.rect(-100, -100, WIN8.w + 200, 372 + 100); cx.clip();
  B.bankTower(cx, t, 760, 372 + (1 - tw) * 300 + tip * 340, 150, 300, -tip * .45);
  cx.restore();
  riseText(cx, 'LEHMAN BROTHERS · SEPT 15, 2008', 940, 54, span(t, A.collapsed - .05, A.collapsed + .5), { size: 24, spacing: .08, out: span(t, A.ifYou - .1, A.ifYou + .3) });
  cx.fillStyle = rgba(P.halo0, .4); cx.fillRect(40, 372, WIN8.w - 80, 2);
  const L = F.lossLine(cx, t, { x: 70, y: 40, w: WIN8.w - 140, h: 330 }, 'gfc', span(t, A.banks, A.bottom), { scale: 60, gold: smooth(span(t, A.bottom - .05, A.bottom + .4)) });
  if (L.low) riseText(cx, 'MAR 9, 2009 · −57 % · DAY 517', L.low[0] - 24, L.low[1] - 26, span(t, A.bottom + .05, A.bottom + .55), { size: 26, align: 'right', spacing: .06, out: span(t, A.ifYou + .2, A.ifYou + .6) });
  // frost: from the falling tower's foot over the pane on "froze"; it fogs everything on "If you were working" and clears into the memory
  const fogU = smooth(span(t, A.froze - .05, A.froze + 1.3)) * .75 + smooth(span(t, A.ifYou - .1, A.ifYou + .6)) * .6;
  const clear = sineIO(span(t, A.backThen - .35, A.backThen + .55));
  cx.restore();
  if (clear > 0) {   // the memory under the frost: full-frame design mapped so that it fills the grown window
    cx.save(); const R = clear * Math.hypot(W, H) * .62; cx.beginPath(); cx.arc(W / 2, H / 2, R, 0, 7); cx.clip();
    const s = r.w / 2040; cx.translate(r.x + 60 * s, r.y + 40 * s); cx.scale(s, s); B.memory2009(cx, t, { z: 1 + .012 * Math.max(0, t - A.backThen + .4) }); cx.restore();
  }
  // the frost lies on the glass (screen-space pane = the window rect)
  const fx = r.x + 850 * k, fy = r.y + 372 * k;
  if (fogU > 0) {
    cx.save();
    if (clear > 0) { const R = clear * Math.hypot(W, H) * .62; cx.beginPath(); cx.rect(-10, -10, W + 20, H + 20); cx.moveTo(W / 2 + R, H / 2); cx.arc(W / 2, H / 2, R, 0, Math.PI * 2, true); cx.clip('evenodd'); }
    B.frost(cx, t, r, fx, fy, Math.min(1.2, fogU), { a: lerp(1, 1.6, smooth(span(t, A.ifYou, A.ifYou + .6))) * (1 - clear) ** 2 });
    cx.restore();
  }
}

// ================================================================================================================== the road in winter light (c08 end → c09)
function roadZ(t, A) {   // distance walked: 260 u/s, slowing to a stop beside sign 929
  const t0 = A.remember + .1, s0 = A.dotcom + .2, s1 = s0 + 1.4;
  const v = (x) => 260 * clamp((x - t0) / .6) * (1 - smooth(clamp((x - s0) / (s1 - s0))));
  // integrate (closed form is fussy; a fixed 60-step sum is exact enough and deterministic)
  const tt = Math.min(t, s1 + 1); if (tt <= t0) return 0; let z = 0; const n = 80, dt = (tt - t0) / n; for (let i = 0; i < n; i++) z += v(t0 + (i + .5) * dt) * dt; return z + roadCreep(t, A);
}
// after your stop the camera keeps dollying toward you very slowly (8 u/s, eased in): nothing stands still; you stay put in the world
function roadCreep(t, A) { const s1 = A.dotcom + 1.6, c0 = s1 - .4; return t <= c0 ? 0 : 8 * (t - c0 - .6 * (1 - Math.exp(-(t - c0) / .6))); }
const SIGN517 = 1970, SIGN929 = 4000;
function roadScene(ctx, t, T, A, o = {}) {
  const z = roadZ(t, A), zoom = o.zoom ?? { z: 1, px: W / 2, py: H / 2 }, hyBase = lerp(560, 520, sineIO(span(t, A.c09, A.dotcom + 1.2))) - (o.sink ?? 0);
  const rc0 = F.roadSetCam(z, { hy: hyBase });
  const rc = { ...rc0, vx: W / 2 + (rc0.vx - zoom.px) * zoom.z, hy: H / 2 + (rc0.hy - zoom.py) * zoom.z, f: rc0.f * zoom.z };
  F.road(ctx, t, rc, { mist: o.mist ?? .75, warm: 0 });
  snow(ctx, t, o.snow ?? 1);
  const s517 = F.exitSign(ctx, t, rc, F.ROADSET.signX, SIGN517, { day: 517, name: 'THE FINANCIAL CRISIS', year: 2008, glyph: 'bank', lit: .4 });
  const s929 = F.exitSign(ctx, t, rc, F.ROADSET.signX, SIGN929, { day: 929, name: 'THE DOT-COM BUBBLE', year: 2000, glyph: o.www === false ? null : 'www', lit: smooth(span(t, A.dotcom - .3, A.dotcom + .4)) });
  // you: walking (back view), then standing beside the sign looking at it
  const cr = roadCreep(t, A), ph = (z - cr) / 260 * 5.5;
  const yp = F.rpt(rc, F.ROADSET.you.X, rc.z + F.ROADSET.you.dz - cr);
  if (o.you !== false) E.du(ctx, yp[0], yp[1], F.ROADSET.you.h * yp[2], { walk: ph, view: 'back', look: o.look ?? (.2 + .5 * smooth(span(t, A.compared - .6, A.compared + .4))), light: 1 });
  return { rc, s517, s929, you: yp };
}
const SNOW = (() => { const r = E.prng(909), a = []; for (let i = 0; i < 140; i++) a.push([r(), r(), .6 + r() * 1.6, r() * 6.28, .3 + r() * .6]); return a; })();
function snow(ctx, t, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.fillStyle = COOL.core;
  for (const [u, v, s, ph, sp] of SNOW) { const y = ((v * H + t * 22 * sp) % H), x = (u * W + Math.sin(t * .4 + ph) * 18) % W; ctx.globalAlpha = a * .35 * (.6 + .4 * Math.sin(t + ph)); ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.fill(); }
  ctx.restore();
}


// ================================================================================================================== C08 end: the photo lands in sign 517 on the road
function memoryToSign(ctx, t, T, A, R) {
  const shrink = quartIO(span(t, A.remember + .25, A.remember + 1.05)), slide = quartIO(span(t, A.remember + 1.1, A.remember + 1.8));
  if (slide >= 1 || !R.s517.panel) return;
  const full = { x: -60, y: -40, w: 2040, h: 1160 }, pn = R.s517.panel, r = lerpR(full, pn, shrink);
  ctx.save(); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 10); ctx.clip();
  const s = r.w / 2040; ctx.translate(r.x + 60 * s, r.y + 40 * s + slide * r.h * 1.05); ctx.scale(s, s); B.memory2009(ctx, t, { z: 1 + .012 * Math.max(0, t - A.backThen + .4) });
  ctx.restore();
  if (shrink < 1) { ctx.save(); ctx.strokeStyle = P.halo0; ctx.lineWidth = 4; ctx.shadowColor = rgba(P.halo0, .9); ctx.shadowBlur = 18; ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 10); ctx.stroke(); ctx.restore(); }
}

// ================================================================================================================== C09
const WWW = { x: 700, y: 380, r: 190 }, OURS = { x: 1210, y: 390, r: 170 }, WR = { x: 300, y: 96, w: 1320, h: 590 };
function zoomCam(t, A) {   // 9.03 push into the www bubble, 9.04 pull back
  const zin = WWW.r * 0 + 1180 / WWW.r;
  return camK(t, [[A.backThen2 - .1, cam(1)], [A.backThen2 + 1.3, cam(zin, WWW.x, WWW.y), 's'], [A.oct - .1, cam(zin, WWW.x, WWW.y)], [A.oct + 1.3, cam(1), 's']]);
}
function lossWindow(ctx, t, A, r, k) {   // inside the exit window (WR design box scaled by k into r)
  ctx.save(); ctx.translate(r.x, r.y); ctx.scale(k, k);
  const L = F.lossLine(ctx, t, { x: 80, y: 70, w: WR.w - 150, h: 420 }, 'dotcom', span(t, A.oct - .2, A.finally), { scale: 60, back: smooth(span(t, A.five - .7, A.five + 1.2)), backW: .38, gold: smooth(span(t, A.finally - .05, A.finally + .4)) });
  if (L.low) {
    riseText(ctx, 'OCT 9, 2002 · −49 % · DAY 929', L.low[0] - 20, L.low[1] + 46, span(t, A.finally + .05, A.finally + .6), { size: 26, align: 'center', spacing: .06 });
    riseText(ctx, 'BACK AT RECORD: MAY 30, 2007', WR.w - 60, 52, span(t, A.five + .9, A.five + 1.5), { size: 24, align: 'right', spacing: .06 });
    ctx.fillStyle = rgba(P.halo0, .35); ctx.setLineDash([3, 10]); ctx.strokeStyle = rgba(P.halo0, .45); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(80, 70); ctx.lineTo(80 + (WR.w - 150) * smooth(span(t, A.five - .7, A.five + .3)), 70); ctx.stroke(); ctx.setLineDash([]);
  }
  ctx.restore();
}
function c09road(ctx, t, T, A) {
  // the road (zoomed for 9.03) + both bubbles + the www window morph
  const c = zoomCam(t, A);
  const R = roadScene(ctx, t, T, A, { zoom: c, www: t < A.compared - .95 ? true : false, mist: lerp(.75, .95, smooth(span(t, A.whether, A.look))), look: lerp(.2, .7, smooth(span(t, A.compared - .6, A.compared + .4))) - .5 * smooth(span(t, A.whether, A.dontKnow)) });
  // the www bubble swells off the sign
  const sw = quartIO(span(t, A.compared - .95, A.compared + .3)), p0 = R.s929.panel;
  let g0 = WWW;
  if (p0) { const s = p0.w / 470; g0 = { x: p0.x + p0.w / 2 + (235 - 64) * s, y: p0.y + 58 * s, r: 30 * s }; }
  const bx = lerp(g0.x, WWW.x, sw), by = lerp(g0.y, WWW.y, sw) - Math.sin(sw * Math.PI) * 50, br = lerp(g0.r, WWW.r, sw);
  const [sx, sy] = toS(c, bx, by), sr = br * c.z;
  const morph = quartIO(span(t, A.oct + .2, A.oct + 1.3)), fold = quartIO(span(t, A.whether + .5, A.whether + 1.4));
  if (t >= A.compared - .95 && fold < 1) {
    // our bubble floats in from the right and keeps drifting up and out
    const ou = sineIO(span(t, A.compared - .7, A.compared + 1.0)), dr = Math.max(0, t - (A.compared + 1.0));
    const ox = lerp(2200, OURS.x, ou) + dr * 30, oy = OURS.y - dr * 22 + Math.sin(t * .8) * 6;
    const [osx, osy] = toS(c, ox, oy);
    if (morph < .05) {
      ctx.save(); ctx.beginPath(); ctx.arc(osx, osy, OURS.r * c.z, 0, 7); ctx.clip(); ctx.translate(osx, osy); ctx.scale(OURS.r * c.z / 1180, OURS.r * c.z / 1180); ctx.translate(-960, -540);
      ctx.fillStyle = mixHex(P.night0, COOL.deep, .3); ctx.fillRect(-300, -300, 2600, 1700); halo(ctx, 960, 540, 900, .2, COOL.mid, COOL.core); hallRowsLocal(ctx, t); ctx.restore();
      F.bubble(ctx, t, osx, osy, OURS.r * c.z, { tremble: .15 });
    }
    // the www bubble (contents: the shops), morphing into the exit window, folding into the sign
    const fr = { x: sx - sr, y: sy - sr, w: 2 * sr, h: 2 * sr, rad: sr };
    let r = { x: lerp(fr.x, WR.x, morph), y: lerp(fr.y, WR.y, morph), w: lerp(fr.w, WR.w, morph), h: lerp(fr.h, WR.h, morph) }, rr = lerp(sr, 12, morph);
    if (fold > 0 && p0) { const to = { x: p0.x + 10, y: p0.y + p0.h / 2, w: p0.w - 20, h: 3 }; r = lerpR(r, to, fold); rr = lerp(12, 2, fold); }
    if (morph > 0) { ctx.save(); ctx.fillStyle = rgba(P.night0, .5 * morph * (1 - fold)); ctx.fillRect(0, 0, W, H); ctx.restore(); }
    ctx.save(); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, Math.min(rr, r.w / 2, r.h / 2)); ctx.clip();
    // shops (full-frame design) mapped to the frame: circle → k = sr / 1180 about its centre; rect → width fit
    const kC = sr / 1180, kR = WR.w / 1920, k = lerp(kC, kR, morph) * lerp(1, r.w / WR.w, fold * 0) , cxm = r.x + r.w / 2, cym = r.y + r.h / 2;
    ctx.save(); ctx.translate(cxm, cym); ctx.scale(k * (fold > 0 ? r.w / WR.w : 1), k * (fold > 0 ? r.w / WR.w : 1)); ctx.translate(-960, -540);
    const nz = (i) => 1 - smooth(span(t, A.noProfit - .1 + i * .25, A.noProfit + .15 + i * .25)) * (1 - .25 * (i === 1)) + (t > A.noProfit - .1 + i * .25 && t < A.noProfit + .15 + i * .25 ? .3 * Math.sin(t * 60) : 0);
    B.shops(ctx, t, { neon: [nz(0), nz(1), nz(2)].map((v) => clamp(v * (1 - smooth(span(t, A.oct, A.oct + .6))))) });
    // price tags in billions drop in on their threads on "billions"
    for (let i = 0; i < 3; i++) {
      const d = expoOut(span(t, A.billions - .2 + i * .12, A.billions + .6 + i * .12)); if (d <= 0) continue;
      tag18(ctx, t, 450 + i * 520, lerp(300, 470, d), 110, { text: '$1B', size: .3, swing: pend(t, A.billions + .5 + i * .12, .14, .55, .7) + .03 * Math.sin(t * 1.1 + i), u: 1, a: 1 - smooth(span(t, A.oct + .2, A.oct + .9)) });
    }
    ctx.restore();
    if (morph > 0) { ctx.save(); ctx.fillStyle = rgba(P.night0, .55 * morph); ctx.fillRect(r.x, r.y, r.w, r.h); ctx.restore(); lossWindow(ctx, t, A, r, r.w / WR.w); }
    ctx.restore();
    // the skin (film) while it is a bubble; the gold rim once it is a window
    if (morph < 1) F.bubble(ctx, t, sx, sy, sr, { tremble: .12, a: 1 - morph });
    if (morph > 0) { ctx.save(); ctx.strokeStyle = rgba(P.halo0, morph); ctx.lineWidth = 4; ctx.shadowColor = rgba(P.halo0, .9); ctx.shadowBlur = 18; ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, Math.min(rr, r.w / 2, r.h / 2)); ctx.stroke(); ctx.restore(); }
  }
  // 9.06 a window opens in the mist and grows into the 2001 office
  return R;
}
function hallRowsLocal(ctx, t) { HALL.rows.forEach((y, r) => { for (let x = HALL.x0, k = 0; x < HALL.x1; x += HALL.step, k++) { ctx.fillStyle = rgba(COOL.mid, .5 * (.7 + .3 * Math.sin(t * 1.3 + k * 1.7 + r))); ctx.fillRect(x, y, HALL.w, HALL.h); } }); }

// ------------------------------------------------------------------ the office (full-frame design): 2001 right of the time front, today left of it
const LAMP = [1150, 486];
function office(ctx, t, A, o = {}) {
  const xf = o.front ?? -9999;   // design x of the time front: x < xf is today
  const era = (fn2001, fnToday) => { ctx.save(); ctx.beginPath(); ctx.rect(xf, -3000, 30000, 8000); ctx.clip(); fn2001(); ctx.restore(); if (xf > -1000) { ctx.save(); ctx.beginPath(); ctx.rect(-6000, -2000, 6000 + xf, 6000); ctx.clip(); fnToday(); ctx.restore(); } };
  ctx.fillStyle = lin(ctx, 0, -600, 0, 820, [[0, P.night0], [1, mixHex(P.ind0, P.ind1, .4)]]); ctx.fillRect(-1200, -1200, 4400, 2020);
  ctx.fillStyle = lin(ctx, 0, 820, 0, 1200, [[0, mixHex(P.night1, P.ind0, .6)], [1, P.night0]]); ctx.fillRect(-1200, 820, 4400, 900);
  // back wall: poster (2001) / TV with red headlines (today)
  era(() => {
    const curl = .18 + .06 * Math.sin(t * .5) + .2 * smooth(span(t, A.hang1, A.hang1 + 2));
    ctx.fillStyle = mixHex(P.ind1, COOL.deep, .3); ctx.beginPath(); ctx.moveTo(1480, 180); ctx.lineTo(1720 - 60 * curl, 180); ctx.lineTo(1720, 180 + 80 * curl); ctx.lineTo(1720, 500); ctx.lineTo(1480, 500); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mixHex(P.ind2, P.cream, .15); ctx.beginPath(); ctx.moveTo(1720 - 60 * curl, 180); ctx.lineTo(1720 - 80 * curl, 180 + 100 * curl); ctx.lineTo(1720, 180 + 80 * curl); ctx.fill();
    E.glowText(ctx, 'www.', 1600, 330, { size: 54, align: 'center', col: mixHex(COOL.mid, P.ind2, .3), glow: false });
    ctx.fillStyle = rgba(COOL.mid, .25); ctx.fillRect(1510, 380, 180, 8); ctx.fillRect(1510, 400, 120, 8);
  }, () => {
    ctx.fillStyle = mixHex(P.night1, P.blue2, .3); ctx.beginPath(); ctx.roundRect(1440, 200, 340, 210, 10); ctx.fill();
    const fl = .75 + .25 * Math.sin(t * 7) * Math.sin(t * 2.3) + .25 * smooth(span(t, A.red - .2, A.red + .3)) * (Math.sin(t * 11) > 0 ? 1 : .6);
    ctx.fillStyle = mixHex(P.ind1, RED.ink, .5); ctx.fillRect(1454, 214, 312, 182);
    ctx.fillStyle = rgba(RED.line, .55 * fl); ctx.fillRect(1470, 236, 220, 22); ctx.fillRect(1470, 272, 160, 14);
    ctx.fillStyle = rgba(RED.hot, .6 * fl); ctx.fillRect(1454, 362, 312, 22);
    ctx.fillStyle = rgba(P.cream, .3); for (let k = 0; k < 6; k++) ctx.fillRect(1462 + ((k * 70 - t * 60) % 320 + 320) % 320, 368, 40, 8);
  });
  // left: stacked chairs (2001) / a shelf with a plant (today)
  era(() => { ctx.fillStyle = mixHex(P.night1, P.ind1, .5); for (let k = 0; k < 4; k++) { ctx.fillRect(150 + k * 8, 820 - (k + 1) * 95, 200, 14); ctx.fillRect(160 + k * 8, 820 - (k + 1) * 95, 12, 90); ctx.fillRect(330 + k * 8, 820 - (k + 1) * 95, 12, 90); } },
    () => { ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fillRect(140, 380, 260, 12); ctx.fillRect(140, 540, 260, 12); ctx.fillStyle = mixHex(P.ind2, '#2f6a4a', .35); ctx.beginPath(); ctx.ellipse(220, 345, 40, 36, 0, 0, 7); ctx.fill(); ctx.fillStyle = mixHex(P.shade1, P.ind1, .5); ctx.fillRect(200, 352, 40, 28); ctx.fillStyle = rgba(P.halo1, .3); ctx.fillRect(280, 500, 30, 40); ctx.fillRect(320, 490, 26, 50); });
  // the people (2001) and you (today): the typist at the left end of the desk turns into you
  const typ = (k) => .25 * Math.sin(t * 9 + k) * (o.typing ?? 1);
  const umbArm = o.umbArm ?? 0;
  const hands = {};
  era(() => {
    if ((o.people ?? 0) > 0) {
      E.person(ctx, 520, 860, 420, { dir: 1, armR: [1.45 + typ(0), 1.95], armL: [1.35 + typ(2), 2.0], look: .05, light: 1 });
      const sip = Math.max(0, Math.sin(t * .8 + 1)) ** 3;
      E.person(ctx, 1600, 860, 400, { dir: -1, lean: -.05, cup: 'R', armR: [lerp(.75, 1.2, sip), lerp(2.35, 2.95, sip)], light: 1, look: .1 * sip });
      E.person(ctx, 1795, 862, 410, { dir: -1, armR: [.55, 2.3], armL: [-.5, -2.2], lean: .015 * Math.sin(t * .6), light: 1 });
    }
  }, () => {
    const h = E.du(ctx, 520, 860, 420, { dir: 1, armR: [lerp(1.45 + typ(0), 2.55, umbArm), lerp(1.95, 2.7, umbArm)], armL: [1.35 + typ(2), 2.0], look: .05 + .12 * Math.sin(t * .7) * 0 + .06 * Math.sin(t * .9), light: 1 });
    hands.R = h.R; hands.L = h.L;
  });
  // desk, screen (CRT 2001 / laptop today), lamp (the hero in both)
  ctx.fillStyle = mixHex(P.night1, P.shade1, .3); ctx.fillRect(600, 640, 780, 18); ctx.fillRect(630, 658, 16, 170); ctx.fillRect(1334, 658, 16, 170);
  era(() => {
    ctx.fillStyle = mixHex(P.ind1, P.blue1, .25); ctx.beginPath(); ctx.roundRect(700, 440, 230, 196, 16); ctx.fill(); ctx.fillRect(780, 630, 70, 12);
    ctx.fillStyle = mixHex(P.night0, COOL.deep, .5); ctx.fillRect(716, 456, 198, 150);
    if (o.crt) o.crt(ctx, { x: 716, y: 456, w: 198, h: 150 }); else { halo(ctx, 815, 531, 120, .12, COOL.mid, COOL.mid); }
    ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fillRect(650, 632, 120, 8);
  }, () => {
    ctx.fillStyle = mixHex(P.night1, P.blue2, .35); ctx.beginPath(); ctx.moveTo(690, 640); ctx.lineTo(940, 640); ctx.lineTo(925, 628); ctx.lineTo(705, 628); ctx.fill();
    ctx.fillStyle = mixHex(P.ind1, P.blue1, .25); ctx.beginPath(); ctx.roundRect(706, 452, 218, 176, 8); ctx.fill();
    const scr = { x: 716, y: 462, w: 198, h: 150 };
    ctx.fillStyle = mixHex(P.night1, COOL.deep, .55); ctx.fillRect(scr.x, scr.y, scr.w, scr.h);
    if (o.laptop) o.laptop(ctx, scr);
  });
  const lampA = o.lamp ?? 1;
  ctx.strokeStyle = mixHex(P.night1, P.shade0, .4); ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(1230, 640); ctx.lineTo(1250, 540); ctx.lineTo(LAMP[0] + 10, LAMP[1] - 30); ctx.stroke();
  ctx.fillStyle = mixHex(P.night1, P.shade0, .4); ctx.beginPath(); ctx.ellipse(1230, 636, 48, 10, 0, 0, 7); ctx.fill();
  if (lampA > 0) { halo(ctx, LAMP[0], LAMP[1] + 30, 420 * lampA, .55 * lampA); E.lightPool(ctx, 900, 1300, 641, 120, 90, .8 * lampA); halo(ctx, LAMP[0], LAMP[1] + 10, 110, .9 * lampA, P.halo0, P.core0); }
  ctx.fillStyle = mixHex(P.ind1, P.shade0, .3); ctx.beginPath(); ctx.moveTo(LAMP[0] - 64, LAMP[1] + 6); ctx.lineTo(LAMP[0] - 26, LAMP[1] - 48); ctx.lineTo(LAMP[0] + 30, LAMP[1] - 48); ctx.lineTo(LAMP[0] + 64, LAMP[1] + 6); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(P.core0, lampA); ctx.beginPath(); ctx.ellipse(LAMP[0], LAMP[1] + 6, 56, 8, 0, 0, 7); ctx.fill();
  // darkness outside the lamp light (it widens on "hangover"; today the room is lit)
  const R = o.R ?? 430, cxL = o.lc ?? [LAMP[0] - 120, LAMP[1] + 140];
  ctx.fillStyle = rad(ctx, cxL[0], cxL[1], R * 1.6, [[0, rgba(P.night0, 0)], [.42, rgba(P.night0, 0)], [1, rgba(P.night0, o.dark ?? .9)]]); ctx.fillRect(-1200, -1200, 4400, 3000);
  // the time front: a band of warm light
  if (xf > -400 && xf < 2400) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, xf - 140, 0, xf + 40, 0, [[0, rgba(P.halo0, 0)], [.8, rgba(P.halo0, .35)], [1, rgba(P.core0, .0)]]); ctx.fillRect(xf - 140, -1200, 180, 3000); ctx.fillStyle = rgba(P.core0, .55); ctx.fillRect(xf - 2, -1200, 3, 3000); ctx.restore(); }
  return hands;
}
// the many roads (9.15 → 10.01): your road (the shared road set) + parallel roads, each figure alone under a small umbrella
const UMB_R = 64;
function manyRoads(ctx, t, T, A, o = {}) {
  const zoom = o.zoom ?? { z: 1, px: W / 2, py: H / 2 }, sink = o.sink ?? 0;
  const rc0 = F.roadSetCam(9000 + (t - A.isEnough) * 0, { hy: 560 - sink });
  const rc = { ...rc0, vx: W / 2 + (rc0.vx - zoom.px) * zoom.z, hy: H / 2 + (rc0.hy - zoom.py) * zoom.z, f: rc0.f * zoom.z };
  F.road(ctx, t, rc, { mist: o.mist ?? .6, warm: 0 });
  const away = o.away ?? 0;
  for (let k = -3; k <= 3; k++) {
    if (!k) continue;
    const X = k * 900, A0 = F.rpt(rc, X - 220, rc.z + 600), A1 = F.rpt(rc, X + 220, rc.z + 600), B0 = F.rpt(rc, X - 220, rc.z + 90000), B1 = F.rpt(rc, X + 220, rc.z + 90000);
    ctx.fillStyle = lin(ctx, 0, rc.hy, 0, H, [[0, mixHex(P.blue2, P.ind1, .45)], [1, mixHex(P.night2, P.ind2, .5)]]);
    ctx.beginPath(); ctx.moveTo(A0[0], A0[1]); ctx.lineTo(A1[0], A1[1]); ctx.lineTo(B1[0], B1[1]); ctx.lineTo(B0[0], B0[1]); ctx.closePath(); ctx.fill();
  }
  // re-lay the mist over the side roads
  ctx.fillStyle = lin(ctx, 0, rc.hy - 90, 0, rc.hy + 110, [[0, rgba(P.blue2, 0)], [.45, rgba(P.blue2, .5 * (o.mist ?? .6))], [1, rgba(P.blue2, 0)]]); ctx.fillRect(0, rc.hy - 90, W, 200);
  const r = E.prng(31);
  for (let k = -3; k <= 3; k++) {
    if (!k) continue;
    const Z = rc.z + 1900 + Math.abs(k) * 1100 + r() * 700 + away * (2600 + r() * 1200), X = k * 900 + 40;
    F.rStand(ctx, rc, X, Z, (s) => { E.person(ctx, 0, 0, 230, { walk: t * 5.5 + k * 1.3, view: 'back', armR: [2.5, 2.62], light: 1 }); F.umbrella(ctx, t, 18, -300, UMB_R, { lit: [1, 1, 1, 1, 0].map((v, i) => (i < 2 + (k + 3) % 3 ? 1 : 0)), glow: .8 }); });
  }
  // you, under your umbrella
  const yp = F.rpt(rc, F.ROADSET.you.X, rc.z + F.ROADSET.you.dz), h = F.ROADSET.you.h * yp[2];
  const hd = E.du(ctx, yp[0], yp[1], h, { dir: 1, armR: [2.55, 2.7], armL: [-.2, -.1], look: .1, light: 1 });
  const ug = F.umbrella(ctx, t, 0, 0, UMB_R * yp[2], { a: 0 });
  const umb = () => F.umbrella(ctx, t, hd.R[0] - ug.handle[0], hd.R[1] - ug.handle[1], UMB_R * yp[2], { lit: F.goresAt(t, T), outline: .45 + .25 * Math.sin(t * 4), glow: 1 });
  if (!o.lateUmb) umb();
  return { rc, you: yp, umb };
}
// the view under the road: a copy of the kit's underRoad that respects the current transform (the camera sinks and pushes)
function underWorld(ctx, t, o = {}) {
  const dy = o.deckY ?? NET_PLATE.deckY;
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.5, P.night1], [1, mixHex(P.ind0, P.blue1, .25)]]); ctx.fillRect(-2000, 0, W + 4000, H + 1000);
  ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.fillRect(-2000, -1000, W + 4000, dy + 1000);
  ctx.strokeStyle = rgba(P.blue2, .55); ctx.lineWidth = 2;
  for (let x = 40; x < W; x += 160) { ctx.beginPath(); ctx.moveTo(x, -1000); ctx.lineTo(x, dy); ctx.stroke(); }
  ctx.fillStyle = rgba(COOL.mid, .35); ctx.fillRect(-2000, dy - 3, W + 4000, 3);
  ctx.fillStyle = lin(ctx, 0, dy, 0, dy + 120, [[0, rgba(COOL.edge, .18)], [1, rgba(COOL.edge, 0)]]); ctx.fillRect(-2000, dy, W + 4000, 120);
  const L = o.lit ?? [.25, .25, .55], pl = o.plit ?? [.4, 1, .4];
  NET_PLATE.pillars.forEach(([x, l, s], i) => F.pillar(ctx, t, x, NET_PLATE.deckY, H + (o.extra ?? 0), x === 960 ? 150 : 110, { label: l, sub: s, lit: pl[i], plateY: 80, size: x === 960 ? 22 : 17 }));
  F.netSpan(ctx, t, [330, 520], [960, 520], { sag: 70, rows: 3, lit: L[0], a: .7 });
  F.netSpan(ctx, t, [960, 520], [1590, 520], { sag: 70, rows: 3, lit: L[1], a: .7 });
  F.netSpan(ctx, t, [-80, NET_PLATE.netY], [2000, NET_PLATE.netY], { sag: 90, rows: 4, lit: L[2], depth: 34 });
}

// ================================================================================================================== the master take
export function makeB2(T) {
  const A = anchors(T);
  const hangFull = A.hang1 + .95;
  return (ctx, t) => {
    if (t < A.c08) {
      c07(ctx, t, T, A); counterMat(ctx, t, A); bigCounter(ctx, t, T, A);
      if (seamWindow(t, A.T0)) plateLine(ctx, t);
    } else if (t < A.remember + .25) {
      c08(ctx, t, T, A); bigCounter(ctx, t, T, A);
    } else if (t < A.look + .2) {
      // road in winter light: the photo lands in sign 517, you walk past it; sign 929; bubbles; the www window
      let R;
      if (t < A.compared - 1.2) { R = roadScene(ctx, t, T, A, {}); memoryToSign(ctx, t, T, A, R); }
      else R = c09road(ctx, t, T, A);
    } else if (t < hangFull) {
      // 9.06 the window in the mist opens and grows to full frame: the office
      roadScene(ctx, t, T, A, { www: false, mist: .95, look: .3 });
      const lamp0 = A.look + .2, open = quartIO(span(t, lamp0 + .15, lamp0 + 1.0)), grow = sineIO(span(t, A.hang1 - .25, hangFull));
      const small = { x: 760, y: 300, w: 400, h: 225 }, full = { x: -60, y: -33.75, w: 2040, h: 1147.5 };
      halo(ctx, 960, 520, 90, .35 * smooth(span(t, A.look - .3, lamp0 + .2)));
      F.vWindow(ctx, t, lerpR(small, full, grow), open, (cx, r) => { cx.save(); cx.translate(r.x, r.y); const k = r.w / 1920; cx.scale(k, k); office(cx, t, A, { R: 430 }); cx.restore(); }, { from: { x: 940, y: 519, w: 40, h: 3 } });
    } else if (t < A.isEnough + .7) {
      officeTake(ctx, t, T, A, hangFull);
    } else if (t < A.c10) {
      // 9.15 the roads: pull back from your umbrella (darkness lifts)
      const R = manyRoads(ctx, t, T, A, { zoom: roadsZZ(t, A), lateUmb: true });
      darkness(ctx, R, lerp(260, 3000, smooth(span(t, A.isEnough + .9, A.themselves + .8))) * umbBreath(t, A));
      R.umb();
    } else {
      c10(ctx, t, T, A);
      if (seamWindow(t, A.T1)) plateNet(ctx, t);
    }
    // the HUDs, every frame (the plates are already under them)
    F.hudUmbrella(ctx, t, T);
    F.hudDay(ctx, t, T);
  };
}
// after the lamp goes out, the only light is your umbrella: its pool breathes slowly (the office and the roads share it, so the swap matches)
const umbBreath = (t, A) => 1 + .06 * Math.sin(2.2 * (t - A.isEnough));
function darkness(ctx, R, rad0) {
  const y = R.you, cx = y[0], cy = y[1] - 230 * y[2] * .9;
  ctx.save(); ctx.fillStyle = rad(ctx, cx, cy, rad0, [[0, rgba(P.night0, 0)], [.45, rgba(P.night0, 0)], [1, rgba(P.night0, .94)]]); ctx.fillRect(0, 0, W, H); ctx.restore();
}

// ================================================================================================================== C09 office take (9.06 → 9.15)
const STEPS = [[180, 380], [470, 530], [760, 680], [1050, 830]];   // monitor content (1440×1080): step tops
const CRT = { x: 716, y: 456, w: 198, h: 150 };
function officeCam(t, A, hangFull) {
  return camK(t, [[hangFull, cam(1.0625, 960, 540)], [A.y2001 + .7, cam(1.12, 960, 470)], [A.wiki - .2, cam(1.15, 960, 340)], [A.notBoom + .2, cam(1.15, 960, 335)],
    [A.hang2 + .3, cam(1.15, 940, 520)], [A.today - .25, cam(1.16, 930, 525)], [A.today + 1.7, cam(1080 / CRT.h * 1.0, CRT.x + CRT.w / 2, CRT.y + CRT.h / 2), 's'],
    [A.isnt - .1, cam(1080 / CRT.h * 1.14, CRT.x + CRT.w / 2 + 3, CRT.y + CRT.h / 2 - 4)], [A.isnt + 1.4, cam(1.15, 900, 560), 'o'], [A.isEnough + .7, cam(1.15, 900, 560)]]);
}
function tagStep(t, A) {   // the price tag's position on the stairs (monitor content coords) + squash
  const hops = [A.falling - .4, A.falling + 1.05, A.tenx - .4];
  let i = 0, fi = 0, p = [STEPS[0][0] + 145, STEPS[0][1]], sq = 0;
  for (let k = 0; k < 3; k++) {
    const u = span(t, hops[k], hops[k] + .55);
    if (u <= 0) break;
    const a = [STEPS[k][0] + 145, STEPS[k][1]], b = [STEPS[k + 1][0] + 145, STEPS[k + 1][1]];
    p = u < 1 ? arc2(a, b, 110, quartIO(u)) : b; i = k + 1; fi = k + quartIO(u); sq = Math.max(0, Math.sin(Math.PI * span(t, hops[k] + .55, hops[k] + .8))) * .12;
  }
  // anticipation: the tag crouches before each hop
  for (const h of hops) sq = Math.max(sq, Math.sin(Math.PI * span(t, h - .35, h + .05)) * .1);
  return { p, i, sq, w: 150 * Math.pow(.9, fi) };   // the tag shrinks continuously along each hop
}
function officeTake(ctx, t, T, A, hangFull) {
  const c = B.camDrift2(officeCam(t, A, hangFull), t, .5);
  const xf = lerp(-400, 2300, sineIO(span(t, A.isnt + .05, A.isnt + 1.95)));
  const front = t < A.isnt ? -9999 : xf, today = smooth(span(t, A.isnt + .2, A.isnt + 1.9));
  const lampOff = smooth(span(t, A.isEnough - .05, A.isEnough + .35)), flick = 1 - .3 * Math.sin(Math.PI * span(t, A.isEnough - .45, A.isEnough - .05)) * (.6 + .4 * Math.sin(t * 21));
  const R = lerp(lerp(lerp(330, 900, smooth(span(t, A.hang2 - .3, A.hang2 + .7))), 1250, today), 141, lampOff) * lerp(1, umbBreath(t, A), lampOff);
  const lc = [lerp(LAMP[0] - 120, 520, lampOff), lerp(LAMP[1] + 140, 482, lampOff)];
  const umbArm = smooth(span(t, A.yours - .55, A.yours + .1));
  const content = (cx, r) => {   // the CRT: dark until the push; the stairs of the falling price
    const k = r.w / 1440; cx.save(); cx.translate(r.x, r.y); cx.scale(k, k);
    cx.fillStyle = lin(cx, 0, 0, 0, 1080, [[0, mixHex(P.night1, COOL.deep, .45)], [1, mixHex(P.night0, COOL.deep, .3)]]); cx.fillRect(0, 0, 1440, 1080);
    const st = span(t, A.today - .2, A.today + 1.2);
    STEPS.forEach(([x, y], i) => { const g = expoOut(span(t, A.today + .2 + i * .15, A.today + .9 + i * .15)); if (g <= 0) return; cx.fillStyle = rgba(P.halo0, .55 * g); cx.fillRect(x, y, 290 * g, 5); cx.fillStyle = rgba(P.halo1, .14 * g); cx.fillRect(x, y + 5, 290 * g, 1000 - y); if (i > 0) riseText(cx, '÷10', x + 145, y + 90, span(t, [0, A.falling + .15, A.falling + 1.6, A.tenx + .15][i], [0, A.falling + .15, A.falling + 1.6, A.tenx + .15][i] + .5), { size: 60, serif: true, align: 'center', col: P.halo0 }); });
    riseText(cx, 'ROUGHLY 10× CHEAPER PER YEAR', 720, 165, span(t, A.tenx + .1, A.tenx + .7), { size: 64, align: 'center', spacing: .04, out: span(t, A.isnt - .2, A.isnt + .2) });
    riseText(cx, 'EPOCH AI · A16Z · STANFORD AI INDEX', 720, 245, span(t, A.tenx + .4, A.tenx + 1.0), { size: 36, align: 'center', col: P.halo2, glow: false, spacing: .1, out: span(t, A.isnt - .2, A.isnt + .2) });
    cx.restore(); void st;
  };
  const laptop = (cx, r) => {   // today: a stock list (red) flicks away on "stocks"; a tool window opens on "tools"
    const k = r.w / 1440; cx.save(); cx.beginPath(); cx.rect(r.x, r.y, r.w, r.h); cx.clip(); cx.translate(r.x, r.y); cx.scale(k, k);
    const fl = expoIn(span(t, A.stocks - .1, A.stocks + .35));
    cx.save(); cx.translate(0, -fl * 1200);
    for (let i = 0; i < 7; i++) { cx.fillStyle = rgba(P.cream, .35); cx.fillRect(120, 150 + i * 120, 300, 40); cx.fillStyle = rgba(RED.line, .85); cx.fillRect(900, 150 + i * 120, 260 - (i * 37) % 120, 40); }
    cx.restore();
    const tw = quartIO(span(t, A.tools - .2, A.tools + .5));
    if (tw > 0) {
      const ww = 1100 * tw, wh = 760 * tw, wx = 720 - ww / 2, wy = 560 - wh / 2;
      cx.fillStyle = mixHex(P.ind1, P.blue1, .45); cx.beginPath(); cx.roundRect(wx, wy, ww, wh, 30); cx.fill(); cx.strokeStyle = rgba(P.halo0, .8); cx.lineWidth = 8; cx.stroke();
      const g = (i) => expoOut(span(t, A.tools + .2 + i * .15, A.tools + .8 + i * .15));
      E.glowText(cx, 'A → 文', 400, 600, { size: 120 * g(0), align: 'center', a: g(0) });
      cx.save(); cx.globalAlpha *= g(1); cx.strokeStyle = P.core1; cx.lineWidth = 14; cx.lineCap = 'round'; for (let j = 0; j < 3; j++) { cx.beginPath(); cx.moveTo(620, 470 + j * 70); cx.lineTo(620 + [200, 160, 110][j] * g(1), 470 + j * 70); cx.stroke(); } cx.restore();
      E.glowText(cx, '</>', 1060, 600, { size: 120 * g(2), align: 'center', a: g(2) });
    }
    cx.restore();
  };
  let hands = {};
  view(ctx, c, () => {
    hands = office(ctx, t, A, { front, people: 1, R, lc, dark: lerp(lerp(.9, .6, today), .94, lampOff), lamp: (1 - lampOff) * flick, crt: content, laptop, umbArm, typing: 1 - umbArm });
    // 9.07 a spark leaps from the lamp onto the wall: the zero line, the Google bar; 9.08 the zero line becomes the timeline
    timeline(ctx, t, A);
  });
  // the price tag (screen space so it can fly into the umbrella)
  if (t > A.today && t < A.cheap.t1 + .1) {
    const ts = tagStep(t, A), toScreen = (p) => toS(c, CRT.x + p[0] * CRT.w / 1440, CRT.y + p[1] * CRT.w / 1440), kz = c.z * CRT.w / 1440;
    const g = expoOut(span(t, A.today + .5, A.today + 1.3));
    const base = toScreen(ts.p), w = ts.w * kz * g, h = w * 1.32, from = [base[0], base[1] - h * .55];
    const fly = F.flyToGore(t, T, 3, from, { lift: 220 });
    const pos = fly.u > 0 ? [fly.x, fly.y] : from, s = fly.u > 0 ? lerp(1, .26 * 60 / Math.max(1, w), quartIO(fly.u)) : 1;
    if (!fly.landed) {
      tag18(ctx, t, pos[0], pos[1] - h * .55 * s, w * s, { thread: 0, text: '$', size: .5, swing: .04 * Math.sin(t * 2) });
      if (fly.u <= 0) riseText(ctx, 'COST PER TASK', pos[0], pos[1] - h * .7, span(t, A.today + 1.0, A.today + 1.6), { size: 30, align: 'center', spacing: .08 });
    }
  }
  goreLine(ctx, t, T, 3);
  // 9.14 the HUD umbrella clones out and lands in your raised hand
  const gu = quartIO(span(t, A.fourP + .15, A.yours + .1));
  if (gu > 0 && hands.R) {
    const hR = toS(c, ...hands.R), r1 = UMB_R * 1.133 * 1.86 * c.z / 1.15, geo = F.umbrella(ctx, t, 0, 0, r1, { a: 0 });
    const to = [hR[0] - geo.handle[0], hR[1] - geo.handle[1]], from = [F.HUD_UMB.x, F.HUD_UMB.y];
    const p = arc2(from, to, 80, gu), r = lerp(F.HUD_UMB.r, r1, gu);
    F.umbrella(ctx, t, p[0], p[1], r, { lit: F.goresAt(t, T), outline: .45 + .25 * Math.sin(t * 4), glow: lerp(.7, 1, gu) });
  }
}
function timeline(ctx, t, A) {
  const L = LAMP, land = [960, 300], sp = quartIO(span(t, A.y2001 + .25, A.y2001 + .9));
  const out = quartIO(span(t, A.notBoom + .05, A.notBoom + .9));
  if (sp > 0 && sp < 1) { const q = arc2([L[0] - 20, L[1] - 30], land, 90, sp); halo(ctx, q[0], q[1], 40, .8); }
  if (out >= 1 || t < A.y2001 + .85) return;
  // the zero line (Google), then the time axis (lowered to y 360)
  const zl = expoOut(span(t, A.y2001 + .85, A.y2001 + 1.5)), ax = quartIO(span(t, A.wiki - .45, A.wiki + .35));
  const yA = lerp(300, 360, ax), x0 = lerp(960 - 200 * zl, 380, ax), x1 = lerp(960 + 200 * zl, 1540, ax);
  const shr = 1 - out, cxm = 960;
  ctx.save(); ctx.lineCap = 'round';
  ctx.strokeStyle = rgba(P.cream, .55); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(lerp(cxm, x0, shr), yA); ctx.lineTo(lerp(cxm, x1, shr), yA); ctx.stroke();
  // the Google bar: a small red stub below the line (2000) jumps over it, gold (2001)
  const gb = 1 - ax, jump = quartIO(span(t, A.profit - .15, A.profit + .3));
  if (gb > 0) {
    const bx = 1010, hDown = 34 * expoOut(span(t, A.google - .1, A.google + .3)) * (1 - jump), hUp = 80 * jump;
    if (hDown > 0) { ctx.fillStyle = rgba(RED.line, gb); ctx.fillRect(bx - 18, yA, 36, hDown); }
    if (hUp > 0) { ctx.save(); ctx.globalAlpha *= gb; ctx.shadowColor = rgba(P.halo0, .8); ctx.shadowBlur = 16; ctx.fillStyle = P.core1; ctx.fillRect(bx - 18, yA - hUp, 36, hUp); ctx.restore(); }
    riseText(ctx, 'GOOGLE · 2001 · FIRST FULL-YEAR PROFIT', 960, 200, span(t, A.google - .1, A.google + .5), { size: 30, align: 'center', spacing: .06, out: span(t, A.wiki - .6, A.wiki - .2) });
  }
  if (ax > 0) {
    const Y = (yr) => lerp(380, 1540, (yr - 2001) / 6.5);
    E.glowText(ctx, '2001', lerp(cxm, 380, shr) - 16, yA + 8, { size: 22, align: 'right', col: P.halo2, glow: false, a: ax * shr });
    E.glowText(ctx, '2007', lerp(cxm, 1540, shr) + 16, yA + 8, { size: 22, col: P.halo2, glow: false, a: ax * shr });
    // the dotted old record, and the market line crawling under it
    const rl = smooth(span(t, A.wiki - .1, A.wiki + .7)) * shr;
    ctx.setLineDash([4, 12]); ctx.strokeStyle = rgba(P.halo0, .7); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(lerp(cxm, 380, rl), 130); ctx.lineTo(lerp(cxm, 1540, rl), 130); ctx.stroke(); ctx.setLineDash([]);
    const names = [['WIKIPEDIA 2001', 2001.05, A.wiki], ['LINKEDIN 2003', 2003.35, A.linked], ['SKYPE 2003', 2003.62, A.skype], ['FACEBOOK 2004', 2004.1, A.face], ['YOUTUBE 2005', 2005.12, A.yt]];
    // year reached by the line: through the names' words, 2006.0 on "climbed back"
    const kt = [[A.wiki - .1, 2001.0], ...names.map(([, y, w]) => [w, y]), [A.climbed, 2006.0], [A.notBoom, 2006.3]];
    let yr = 2001; for (let i = 0; i < kt.length - 1; i++) if (t >= kt[i][0]) yr = lerp(kt[i][1], kt[i + 1][1], clamp((t - kt[i][0]) / (kt[i + 1][0] - kt[i][0])));
    yr = lerp(2001, yr, shr);
    const lvl = (y) => { const K = [[2001, .45], [2001.7, .62], [2002.78, 1], [2003.5, .62], [2004.5, .42], [2005.5, .3], [2006.5, .14], [2007.4, 0]]; for (let i = 0; i < K.length - 1; i++) if (y <= K[i + 1][0]) return lerp(K[i][1], K[i + 1][1], (y - K[i][0]) / (K[i + 1][0] - K[i][0])) + .02 * Math.sin(y * 17); return 0; };
    if (yr > 2001.01) { ctx.strokeStyle = COOL.mid; ctx.lineWidth = 4; ctx.shadowColor = rgba(COOL.edge, .8); ctx.shadowBlur = 10; ctx.beginPath(); for (let y = 2001; y <= yr; y += .04) { const px = Y(y), py = 130 + lvl(y) * 200; y === 2001 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); } ctx.stroke(); ctx.shadowBlur = 0; ctx.fillStyle = P.core1; ctx.beginPath(); ctx.arc(Y(yr), 130 + lvl(yr) * 200, 6, 0, 7); ctx.fill(); }
    names.forEach(([nm, y, w], i) => {
      const g = expoOut(span(t, w - .1, w + .4)) * shr; if (g <= 0) return;
      const px = Y(y); halo(ctx, px, yA, 50 * g, .6); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(px, yA, 9 * g, 0, 7); ctx.fill();
      riseText(ctx, nm, px, yA + 44 + [0, 0, 1, 2, 0][i] * 30, span(t, w - .05, w + .45), { size: 24, align: 'center', spacing: .06, out: out });
    });
  }
  ctx.restore();
}

// ================================================================================================================== C10
const WB = { x: 300, y: 100, w: 1060, h: 640 };
// 9.15 → 10.01 one camera over the roads: the pull-back from your umbrella eases out while the slow push toward the road's edge
// eases in (they overlap, so the camera never stops across the c09|c10 boundary)
function roadsZZ(t, A) {
  const z0 = { z: 1.86, px: 1297, py: 714.5 };
  const u1 = sineIO(span(t, A.isEnough + .7, A.c10 + .4)), u2 = sineIO(span(t, A.themselves + 1.2, A.enough + 1.4));
  return { z: Math.exp(lerp(Math.log(z0.z), 0, u1) + Math.log(1.12) * u2), px: lerp(z0.px, W / 2, u1) + (1062 - W / 2) * u2, py: lerp(z0.py, H / 2, u1) + (700 - H / 2) * u2 };
}
function underCam(t, A) {
  return camK(t, [[A.nets + .3, cam(1)], [A.early, cam(1)], [A.early + 2.1, cam(1.6, 667.5, 540)], [A.k250 + 2.4, cam(1.6, 667.5, 540)], [A.T1 - SEAM_HALF, cam(1)]]);
}
function c10(ctx, t, T, A) {
  const sinkU = sineIO(span(t, A.great + .9, A.nets - .15)), s = H * sinkU, dy = H - s;
  const zz = roadsZZ(t, A);
  const away = smooth(span(t, A.c10, A.great + .5)), mist = lerp(.6, .9, away);
  const boost = (i) => .5 * smooth(span(t, A.nets - .25 + i * .18, A.nets + .35 + i * .18)) * (1 - smooth(span(t, A.early - .2, A.early + 1.2)));
  const back = smooth(span(t, A.k250 + 2.4, A.T1 - SEAM_HALF - .1));
  const plit = [lerp(.4, 1, smooth(span(t, A.early, A.early + .8)) * (1 - back)), 1, .4];
  if (s <= 0) { manyRoads(ctx, t, T, A, { zoom: zz, away, mist }); return; }
  const c = B.camDrift2(underCam(t, A), t, .4 * (1 - back * 0));
  const c2 = sinkU < 1 ? cam(1) : c;
  view(ctx, c2, () => { ctx.translate(0, dy); underWorld(ctx, t, { lit: [.25 + boost(0), .25 + boost(1), .55 + boost(2) * .7], plit, extra: 400 }); });
  if (dy > 0) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, dy); ctx.clip(); manyRoads(ctx, t, T, A, { zoom: zz, away, mist, sink: s / zz.z }); ctx.restore(); }
  if (sinkU < 1) return;
  // 10.03 the 1933 bank opens out of the pillar's stone; 10.04 the first net; 10.05 the cent
  const pTop = toS(c, 330 - 55, NET_PLATE.deckY), pBot = toS(c, 330 + 55, H);
  const pillarR = { x: pTop[0], y: Math.max(0, pTop[1]), w: pBot[0] - pTop[0], h: Math.min(H, pBot[1]) - Math.max(0, pTop[1]) };
  const open = sineIO(span(t, A.early + 1.0, A.early + 2.7)) * (1 - sineIO(span(t, A.ifBank - .15, A.ifBank + 1.15)));
  const k = WB.w / 1920, catchD = t < A.cent ? 0 : 34 * Math.exp(-(t - A.cent) * 3) * Math.cos((t - A.cent) * 9) * 0 + lerp(36, 16, smooth(span(t, A.cent, A.cent + .8)));
  const centFall = expoIn(span(t, A.cent - .95, A.cent));
  const centIn = [960, lerp(-80, 968 + catchD, centFall)];
  if (open > 0) F.vWindow(ctx, t, WB, open, (cx, r) => {
    const kk = r.w / 1920; cx.save(); cx.translate(r.x, r.y); cx.scale(kk, kk);
    B.bank1933(cx, t, { inner: (q) => {
      const sh = (i) => .03 * Math.sin(t * (.6 + i * .13) + i * 2);
      [[560, 1], [690, 1], [1250, -1], [1390, -1], [1120, -1]].forEach(([x, d], i) => E.person(q, x, 905, 300, { dir: d, lean: sh(i), light: d, look: .2 }));
      const lift = smooth(span(t, A.savings - .45, A.savings + .15));
      const hd = E.person(q, 830, 912, 310, { dir: 1, armR: [lerp(.3, 2.55, lift), lerp(.2, 2.7, lift)], look: .2 + .4 * lift, light: 1, lean: sh(7) });
      if (lift > 0) { q.save(); q.translate(hd.R[0], hd.R[1] - 18); q.rotate(-.1); q.fillStyle = mixHex(P.cream, P.shade1, .4); q.fillRect(-34, -22, 32, 40); q.fillRect(2, -22, 32, 40); q.fillStyle = rgba(P.ind1, .4); q.fillRect(-1, -22, 2, 40); q.restore(); }
      stamp(q, t, 'CLOSED', 960, 610, { t0: A.failed, size: 46, rot: -.07, out: A.y1933 + .2 });
      const pl = expoOut(span(t, A.y1933 + .55, A.y1933 + 1.0));
      if (pl > 0) { q.save(); q.beginPath(); q.rect(820, 470, 280, 350); q.clip(); PR.paperCard(q, 960, lerp(860, 610, pl), 260, 70, { lit: .9 }); B.ink(q, 'DEPOSITS INSURED', 960, lerp(860, 610, pl) + 9, 22, { align: 'center', sp: .1 }); q.restore();
        for (const sx of [845, 1075]) { q.save(); q.translate(sx, lerp(860, 610, pl)); q.rotate(t * 8 * (1 - smooth(span(t, A.y1933 + 1.0, A.y1933 + 1.5)))); q.strokeStyle = P.shade0; q.lineWidth = 3; q.beginPath(); q.moveTo(-6, 0); q.lineTo(6, 0); q.stroke(); q.restore(); } }
      const nh = smooth(span(t, A.insure - .7, A.insure + .5));
      if (nh > 0) F.netSpan(q, t, [60, 960], [1860, 960], { sag: 46, rows: 3, lit: .9, depth: 22, half: nh, catch: t > A.cent - .05 && t < A.ifBank + .3 ? { u: .5, depth: catchD } : null });
      if (centFall > 0 && t < A.ifBank + .15) B.cent(q, centIn[0], centIn[1], 26, t * 5 * (1 - smooth(span(t, A.cent, A.cent + .3))));
    } });
    cx.restore();
  }, { from: pillarR, mat: .35 });
  riseText(ctx, 'BANKING ACT 1933 · FDIC · INSURED FROM JAN 1, 1934', WB.x + WB.w / 2, WB.y + WB.h + 52, span(t, A.insure + .2, A.insure + .8), { size: 26, align: 'center', spacing: .06, out: span(t, A.ifBank - .2, A.ifBank + .3) });
  // 10.06 the cent flies out onto your phone and becomes the net icon beside the balance
  const ph = sineIO(span(t, A.ifBank + .05, A.ifBank + 1.55)) - expoIn(span(t, A.k250 + 2.6, A.k250 + 3.4));
  const PX = 1210, PY = lerp(1560, 540, Math.max(0, ph)), PH = 440;
  const slot = [PX + PH * .5 * .28, PY - PH * .12];
  if (ph > 0) {
    B.sleeveBack(ctx, PX + 4, PY + PH * .3, PH * .5, -.06);
    PR.phone(ctx, t, PX, PY, PH, { face: 1, screen: (cx, r) => {
      cx.fillStyle = mixHex(P.ind1, P.blue1, .5); cx.fillRect(r.x, r.y, r.w, r.h);
      B.ink(cx, 'BANK', r.x + r.w * .1, r.y + r.h * .1, r.w * .1, { col: P.cream, sp: .12 });
      cx.fillStyle = rgba(P.cream, .14); cx.fillRect(r.x + r.w * .08, r.y + r.h * .26, r.w * .84, r.h * .16);
      B.ink(cx, 'BALANCE', r.x + r.w * .13, r.y + r.h * .32, r.w * .065, { col: P.halo2, sp: .1 });
      cx.fillStyle = rgba(P.cream, .7); cx.fillRect(r.x + r.w * .13, r.y + r.h * .36, r.w * .4, r.h * .025);
      for (let i = 0; i < 4; i++) { cx.fillStyle = rgba(P.cream, .12); cx.fillRect(r.x + r.w * .08, r.y + r.h * (.5 + i * .1), r.w * .84, r.h * .07); }
    } });
    B.sleeveFront(ctx, PX + 4, PY + PH * .3, PH * .5, -.06);
  }
  const cf = span(t, A.ifBank + .15, A.k250 - .05), morph = smooth(span(t, A.k250 - .15, A.k250 + .25));
  if (t > A.ifBank + .15 && ph > 0) {
    const from = [WB.x + 960 * k, WB.y + (968 + 16) * k], p = arc2(from, slot, 160, quartIO(cf));
    if (morph < 1) B.cent(ctx, p[0], p[1], lerp(26 * k * 1.2, 14, quartIO(cf)) * (1 - morph), t * 6);
    if (morph > 0) F.goreIcon(ctx, 4, slot[0], slot[1], .34 * expoOut(morph), { lit: 1 });
  }
  const lo = span(t, A.k250 + 2.3, A.k250 + 2.8);
  riseText(ctx, 'US: $250,000', 1480, 470, span(t, A.k250 + .05, A.k250 + .6), { size: 76, serif: true, out: lo });
  riseText(ctx, 'PER DEPOSITOR, PER BANK', 1484, 515, span(t, A.k250 + .35, A.k250 + .9), { size: 24, weight: 600, col: P.halo2, glow: false, spacing: .1, out: lo });
  riseText(ctx, 'EU: €100,000', 1482, 605, span(t, A.k250 + .9, A.k250 + 1.4), { size: 44, serif: true, out: lo });
  source(ctx, 'FDIC', 1484, 650, span(t, A.k250 + 1.2, A.k250 + 1.7), { out: lo });
}
