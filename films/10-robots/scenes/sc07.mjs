// Film 10 · c07 · "Für wen? / Weinberg" (03a + 03b start) · 360.82–409.00 s · deepest night → dawn → sunrise · ★ 7.02 (for whom?)
// Still the small planet of c06 (lib/f10_c06_planet.mjs): the planet turns, so new places come to its top; the sun rises behind its rim.
//
// PLAN (word → picture · hero light · ≤2 moves · carrier)                                                       [EXPL] = explainer
// 360.82 robots, yes or no?         the horizon of c06; the planet turns back a little: at the foot of the e-waste mountain the robot
//                                   stands at a fork (you beside it). A hill with ONE warm window rises over the rim. Two paths of light:
//                                   warm up to the window, cool along the ground to the tower. On "yes … no" the robot turns.
// 364.58 ★ robots for whom?         the robot turns to the window; the camera pushes slowly toward it.
// 367.78 somewhere … not in a lab   the planet turns (stars run: time-lapse): the cold tower passes ("lab"); light on the east rim.
// 372.18 in a vineyard              the sun rises behind the vineyard hill (the sky warms only here), the rows catch the light.
// 374.20 France · one in two        [EXPL] the rows tilt up into a map of light: FRANCE, farms (warm points), shared halls; ~1 IN 2 FARMERS
//        shares its machines        [EXPL] threads run from every farm to its hall. CUMA · ~10,000 GROUPS · ~195,000 MEMBERS
// 380.44 one tractor, many farms    [EXPL] a warm point leaves a hall and loops from farm to farm; then the map lies down again.
// 382.88 bought robots that way     the co-op hall's gate opens (warm), a vine robot rolls out into the row, growers walk in.
// 386.76 belongs to the growers     [EXPL] three growers lay a hand on its frame (staggered): warm prints; on "growers" the prints jump
//                                   into a ring of three equal shares (1/3 each); then they sink back onto the frame.
// 391.40 the same way?              [EXPL] the camera rises: a warm trace runs from the vineyard hall to the cold tower; its windows warm.
// 395.24 Freeman · Harvard · title  [EXPL] lateral drift through the morning haze; the quote is written left of the sun, the source under it.
// 403.56 all of us … a share        [EXPL] the quote condenses into warm lights that settle on the growers' hands (one share each).
// 407.00 → c08                      one light leaves a hand and runs down into the glowing hall gate; flight into it (flood = 1 at 409.00)
import { Path2D, createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import { run, wipe, writeOn, mark, env, COOLC } from '../lib/f10_c04_b2.mjs';
import { initPot } from '../lib/f10_c05_pot.mjs';
import { initPlanet, planetWorld, planetCam, planetKeys, limbPt, limbFrame, groundY, onGround, ALPHA, GC, R as PR, BKZ, TWR, setRobot2, setTowerWarm, setRoll7, setMinesA } from '../lib/f10_c06_planet.mjs';
const { P, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, rgba, mixHex, lin, rad, prng } = E;
const MEASC = createCanvas(8, 8).getContext('2d');
const textW = (s0, size = 40, sp = .14) => { const c = MEASC; c.font = `700 ${size}px Inter`; c.letterSpacing = `${sp}em`; return c.measureText(s0).width; };

export default async function (T, R) {
  E.prepareEditorial();
  initPot(T); initPlanet(T);
  const a = (ph, n) => T.S('03a', ph, n), b = (ph, n) => T.S('03b', ph, n);
  const A = {
    s: R.a, robots: a('robots, yes'), yes: a('yes or'), no: a('or no') + .2, its: a("It's this"), whom: a('for whom') + .16, answer: a('The answer'), expect: a('expect'),
    lab: a('in a lab') + .2, vineyard: a('a vineyard') + .1, france: b('France'), one: b('one in two'), farmers: b('farmers'), coop: b('to a co-op'), shares: b('and shares'),
    tractor: b('One tractor') + .24, many: b('many farms'), wine: b('And some wine'), bought: b('already bought'), robotsB: b('bought robots') + .24, way: b('that way.'),
    tech: b('tech company'), belongs: b('It belongs'), growers: b('the growers.') + .12, whatif: b('What if'), learn: b('that learn'), same: b('same way') + .2,
    freeman: b('Richard Freeman'), harvard: b('at Harvard') + .16, title: b('blunt title'), who: b('"Who owns', 0), rules: b('rules the'), world: b('the world') + .1,
    his: b('His answer'), all: b('all of us'), share: b('a share') + .16, compete: b('compete with'), work: b('for work') + .16, end: R.b,
  };
  const KZ = 26, RK = PR * KZ, aR = ALPHA.robot, aW = ALPHA.vine;
  // the planet turns: a little back to the robot (push), then on to the vineyard (the time-lapse pan)
  setRoll7((t) => (t < A.s ? 0 : (ALPHA.bank - aR) * sineIO(span(t, A.s + .1, A.s + 2.6)) - (aW - aR) * sineIO(span(t, A.answer + .1, A.vineyard + .2))));
  const rot = (t) => .16 * sineIO(span(t, A.answer, A.vineyard + .6));      // stars in time-lapse
  // the robot at the fork (the one standing beside you since c06): turns on "yes", "no", and toward the window before "whom"
  const turns = [A.yes - .05, A.no - .05, A.whom - .55];
  setRobot2((t) => {
    if (t < A.s) return null;
    let dir = -1, sx = 1;
    turns.forEach((t0, i) => { const k = span(t, t0, t0 + .45); if (k > 0) { if (k >= .5) dir = i % 2 ? -1 : 1; sx = k < 1 ? Math.max(.08, Math.abs(Math.cos(Math.PI * k))) : 1; } });
    return { sx, o: { dir } };
  });
  // the trace reaches the tower at "same way": then its windows warm, one after the other
  setTowerWarm((t) => smooth(span(t, A.same + .2, A.same + 2.2)));
  // the open pits of c06 fade with the dawn (they would sit in the foreground of the vineyard shots)
  setMinesA((t) => 1 - smooth(span(t, A.lab - .6, A.vineyard + .6)));

  // ---------- geometry of the vineyard frame (α vine, KZ 26: local px = screen px at camera s 26) ----------
  const HALL = { x: -400, w: 500, h: 340 }, GATE = { x: -400, w: 280, h: 290 };
  const VX = (t) => lerp(HALL.x - 30, 120, sineIO(span(t, A.bought - .5, A.way + .4)));   // the vine robot's x (rolls out of the gate)
  const ridgeH = (x) => { const d = (x - 1180) / 940; return Math.abs(d) >= 1 ? 0 : 280 * Math.pow(Math.cos(Math.PI / 2 * d), 1.25); };
  const hillH = (x) => { const d = (x - 690) / 360; return Math.abs(d) >= 1 ? 0 : 232 * Math.pow(Math.cos(Math.PI / 2 * d), 1.4); };

  // ---------- camera ----------
  const rp = (lx, ly) => limbPt(aR, KZ, lx, ly, -aR), wp = (lx, ly) => limbPt(aW, KZ, lx, ly, -aW), top = (ly, s) => limbPt(0, s, 0, ly, 0);
  const K6 = planetKeys(), last = K6[K6.length - 1];
  const gateY = -GATE.h * .5 + groundY(GATE.x, RK);
  const K7 = [
    last,
    [A.s + 2.4, ...rp(260, -270), 24, 's'],
    [A.its, ...rp(280, -280), 25],
    [A.whom + 1.0, ...rp(560, -300), 33, 's'],
    [A.answer + .2, ...rp(580, -305), 34],
    [A.lab - .2, ...top(-300 * 26 / 25, 25), 25, 's'],
    [A.vineyard + .5, ...wp(160, -280), 24, 's'],
    [A.france - .1, ...wp(170, -290), 24.5],
    [A.france + 1.1, ...wp(200, -540), 23, 's'],
    [A.many + .4, ...wp(205, -545), 23.5],
    [A.robotsB + .5, ...wp(-120, -220), 27.2, 's'],
    [A.tech, ...wp(40, -330), 26.5, 's'],
    [A.whatif, ...wp(50, -390), 25.5],
    [A.same + .3, ...wp(-560, -420), 15, 's'],
    [A.freeman + 1.3, ...wp(-200, -470), 18, 's'],
    [A.world + .6, ...wp(-90, -470), 18.5],
    [A.his + .8, ...wp(-80, -465), 18.7],
    [A.share + .5, ...wp(-60, -260), 24.5, 's'],
    [A.end - .55, ...wp(GATE.x, gateY), 32, 's'],
    [A.end, ...wp(GATE.x, gateY), 520, 'i'],
  ];

  // ---------- the sky behind the planet: dawn, the sun rises behind the vineyard hill ----------
  const sunLy = (t) => lerp(160, -380, sineIO(span(t, A.lab - .4, A.france + 1.5)));
  const dawn = (t) => smooth(span(t, A.lab - .6, A.france + .8));
  function before(ctx, t, s) {
    const d = dawn(t); if (d <= 0) return;
    const [sx, sy] = limbPt(aW, KZ, 760, sunLy(t), -aW);
    const k = 1 / s;
    ctx.save(); ctx.fillStyle = rad(ctx, sx, sy + 160 * k, 1700 * k, [[0, rgba(P.halo0, .55 * d)], [.25, rgba(P.halo1, .3 * d)], [.6, rgba(P.blue0, .22 * d)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(sx - 3000 * k, sy - 3000 * k, 6000 * k, 6000 * k); ctx.restore();
    ctx.save(); ctx.translate(sx, sy); ctx.scale(k, k); E.lightForm(ctx, 'disc', -95, -95, 190, 190, t, { dust: 3000, seed: 71, breath: .02, a: d }); E.rays(ctx, 0, 0, 120, 900, 14, .12 * d, t * .01); ctx.restore();
  }
  function outsideGlobe(ctx) { ctx.beginPath(); ctx.rect(-1e5, -1e5, 2e5, 2e5); ctx.arc(GC[0], GC[1], PR, 0, 6.29); ctx.clip('evenodd'); }

  // ---------- the fork at night: a hill with one warm window; a warm path up to it, a cool line on along the ground ----------
  const housePart = (ctx, t, psi) => limbFrame(ctx, aR, KZ, psi, () => {
    const rise = smooth(span(t, A.s + .4, A.s + 2.6));
    const pu = span(t, A.robots - .3, A.no + .2) * (1 - smooth(span(t, A.lab - .4, A.lab + .4)));
    // the cool line first (the hill hides its middle): on along the ground, toward the tower
    if (pu > 0) {
      const cool = []; for (let x = 40; x <= 1300; x += 30) cool.push([x, groundY(x, RK) - 5]);
      ctx.save(); ctx.shadowColor = rgba(COOLC, .8); ctx.shadowBlur = 10; ctx.strokeStyle = rgba(COOLC, .95); ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); const m = Math.max(2, Math.floor(cool.length * clamp(pu * 1.6 - .2))); cool.slice(0, m).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.restore();
    }
    ctx.save(); ctx.translate(0, 520 * (1 - rise));
    const hp = new Path2D(); hp.moveTo(320, groundY(320, RK) + 40); for (let x = 330; x <= 1050; x += 10) hp.lineTo(x, groundY(x, RK) - hillH(x)); hp.lineTo(1060, groundY(1060, RK) + 40); hp.closePath();
    ctx.fillStyle = lin(ctx, 0, -240, 0, 60, [[0, mixHex(P.night1, P.ind0, .4)], [1, P.night0]]); ctx.fill(hp);
    ctx.strokeStyle = rgba(P.blue0, .7); ctx.lineWidth = 2.5; ctx.beginPath(); for (let x = 330; x <= 1050; x += 10) { const y = groundY(x, RK) - hillH(x); x === 330 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
    // the house on the hill: one warm window (the hero of the night)
    onGround(ctx, 690, RK, () => {
      const HT = -232;
      ctx.fillStyle = mixHex(P.night1, P.ind0, .3); ctx.fillRect(-56, HT - 70, 112, 78);
      ctx.beginPath(); ctx.moveTo(-68, HT - 68); ctx.lineTo(0, HT - 114); ctx.lineTo(68, HT - 68); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = rgba(P.blue0, .85); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-56, HT + 2); ctx.lineTo(-56, HT - 68); ctx.lineTo(-68, HT - 68); ctx.lineTo(0, HT - 114); ctx.lineTo(68, HT - 68); ctx.lineTo(56, HT - 68); ctx.lineTo(56, HT + 2); ctx.stroke();
      E.lightForm(ctx, 'window', -16, HT - 54, 32, 26, t, { mullions: [2, 2], dust: 700, seed: 74, breath: .02 });
      E.halo(ctx, 0, HT - 41, 220, .28, P.halo1, P.halo2);
    });
    ctx.restore();
    // the warm path: from the robot's feet over the ground and up the hill to the door
    if (pu > 0) {
      const warm = []; for (let x = 40; x <= 640; x += 12) warm.push([x, groundY(x, RK) - hillH(x) - 24 + 520 * (1 - rise)]);
      ctx.save(); ctx.setLineDash([2, 17]); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(P.halo0, .95); ctx.lineWidth = 8; ctx.beginPath(); const n = Math.max(2, Math.floor(warm.length * Math.min(1, pu * 1.6))); warm.slice(0, n).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.restore();
    }
  });

  // ---------- the vine robot (side view: a body on four tall legs; the row of vines runs between its wheels) ----------
  const VB = (() => {
    const U = (a0, b0) => a0.op(b0, 2);
    let p = new Path2D(); p.roundRect(-136, -286, 272, 58, 14);                       // body: a long low box
    const cab = new Path2D(); cab.roundRect(-40, -318, 120, 40, 10); p = U(p, cab);   // the top housing
    const mast = new Path2D(); mast.rect(-96, -330, 6, 50); p = U(p, mast);
    for (const sx of [-1, 1]) { const l = new Path2D(); l.moveTo(sx * 122, -232); l.lineTo(sx * 96, -232); l.lineTo(sx * 100, -40); l.lineTo(sx * 122, -40); l.closePath(); p = U(p, l);
      const hub = new Path2D(); hub.roundRect(sx * 110 - 20, -60, 40, 28, 7); p = U(p, hub); }
    const arm = new Path2D(); arm.moveTo(98, -176); arm.lineTo(62, -116); arm.lineTo(50, -122); arm.lineTo(90, -186); arm.closePath(); p = U(p, arm);
    return p;
  })();
  function vineRobot(ctx, t, x, sun) {
    ctx.save();
    const body = mixHex(P.night1, P.ind0, .5);
    ctx.fillStyle = body; ctx.fill(VB);
    // warm rim on the edges that face the sun (up and right): the body minus itself shifted down-left
    const sh = new Path2D(); sh.addPath(VB, { a: 1, b: 0, c: 0, d: 1, e: -4, f: 4 }); ctx.fillStyle = rgba(P.halo0, .85 * sun); ctx.fill(new Path2D(VB).op(sh, 0));
    ctx.strokeStyle = rgba(P.blue0, .55); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-118, -250); ctx.lineTo(118, -250); ctx.stroke();
    // the weeding tool (a small disc) and the sensor lamp (cool: the machine's own light)
    ctx.fillStyle = body; ctx.beginPath(); ctx.arc(56, -114, 14, 0, 6.29); ctx.fill();
    E.halo(ctx, -93, -334, 40, .5, COOLC, COOLC); ctx.fillStyle = COOLC; ctx.beginPath(); ctx.arc(-93, -334, 5, 0, 6.29); ctx.fill();
    // wheels turn with the distance rolled
    for (const sx of [-1, 1]) {
      const wx = sx * 110, wy = -38, rr = 36, ang = x / rr;
      ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(wx, wy, rr, 0, 6.29); ctx.fill();
      ctx.strokeStyle = rgba(mixHex(P.blue0, P.halo0, sun * .6), .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(wx, wy, rr - 7, 0, 6.29); ctx.stroke();
      ctx.lineWidth = 3; for (let k = 0; k < 3; k++) { const q = ang + k * 2.094; ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx + Math.cos(q) * (rr - 9), wy + Math.sin(q) * (rr - 9)); ctx.stroke(); }
      ctx.fillStyle = rgba(mixHex(P.blue0, P.halo0, sun * .6), .9); ctx.beginPath(); ctx.arc(wx, wy, 6, 0, 6.29); ctx.fill();
    }
    ctx.restore();
  }
  // the row in front: a low hedge of vines on short trunks (warm rim toward the sun)
  const VRND = prng(311), HEDGE = []; for (let x = -70; x <= 720; x += 17) HEDGE.push([x, -96 - VRND() * 22, 15 + VRND() * 9]);
  function hedge(ctx, sun) {
    const g = (x) => groundY(x, RK);
    ctx.fillStyle = P.night1; for (let x = -50; x <= 700; x += 56) ctx.fillRect(x - 3, g(x) - 52, 6, 54);
    ctx.strokeStyle = rgba(P.blue0, .5); ctx.lineWidth = 2; ctx.beginPath(); for (let x = -70; x <= 720; x += 20) (x === -70 ? ctx.moveTo(x, g(x) - 58) : ctx.lineTo(x, g(x) - 58)); ctx.stroke();
    const leaf = new Path2D(); leaf.moveTo(-62, g(-62) - 54); for (let x = -62; x <= 712; x += 20) leaf.lineTo(x, g(x) - 86); for (let x = 712; x >= -62; x -= 20) leaf.lineTo(x, g(x) - 54); leaf.closePath();
    HEDGE.forEach(([x, y, r]) => { leaf.moveTo(x + r, g(x) + y); leaf.arc(x, g(x) + y, r, 0, 6.29); });
    ctx.fillStyle = mixHex(P.night1, P.ind0, .55); ctx.fill(leaf);
    if (sun > 0) { ctx.strokeStyle = rgba(P.halo0, .5 * sun); ctx.lineWidth = 2.2; HEDGE.forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, g(x) + y, r - 1, -1.7, -.35); ctx.stroke(); }); }
  }
  // the growers (indigo silhouettes): two at the legs, one between them reaching up to the body
  const GROW = [
    { x: -40, h: 196, dir: 1, arm: [1.42, 1.62], at: () => A.tech + .45 },
    { x: 330, h: 204, dir: -1, arm: [1.4, 1.6], at: () => A.tech + .8 },
    { x: 196, h: 190, dir: -1, arm: [2.55, 2.75], at: () => A.belongs + .15 },
  ];
  const toFrame = (gx, [hx, hy]) => { const th = Math.asin(clamp(gx / RK, -1, 1)), c = Math.cos(th), s = Math.sin(th); return [gx + c * hx - s * hy, groundY(gx, RK) + s * hx + c * hy]; };
  const hallM = (() => { const th = Math.asin(HALL.x / RK); return { a: Math.cos(th), b: Math.sin(th), c: -Math.sin(th), d: Math.cos(th), e: HALL.x, f: groundY(HALL.x, RK) }; })();
  const vinePart = (ctx, t, psi) => limbFrame(ctx, aW, KZ, psi, () => {
    const sunA = dawn(t);
    // the vineyard hill: rows fan down from the ridge, each a line of small vines (backlit by the low sun)
    const hp = new Path2D(); hp.moveTo(230, groundY(230, RK) + 60); for (let x = 240; x <= 2120; x += 16) hp.lineTo(x, groundY(x, RK) - ridgeH(x)); hp.lineTo(2130, groundY(2130, RK) + 60); hp.closePath();
    ctx.fillStyle = lin(ctx, 0, -280, 0, 60, [[0, mixHex(P.night1, P.ind0, .5)], [1, P.night0]]); ctx.fill(hp);
    ctx.save(); ctx.clip(hp);
    const rowC = mixHex(P.night1, P.ind0, .75);
    for (let i = 0; i < 19; i++) {
      const xt = 330 + i * 95, yt = groundY(xt, RK) - ridgeH(xt), xb = xt + (xt - 1180) * .55, yb = groundY(xb, RK) + 10;
      ctx.strokeStyle = rgba(mixHex(P.blue0, P.halo1, sunA), .12 + .22 * sunA); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xt, yt); ctx.quadraticCurveTo((xt + xb) / 2 + 18, (yt + yb) / 2, xb, yb); ctx.stroke();
      for (let j = 1; j <= 11; j++) {
        const u = j / 11, mx = (xt + xb) / 2 + 18, my = (yt + yb) / 2, x = (1 - u) * (1 - u) * xt + 2 * u * (1 - u) * mx + u * u * xb, y = (1 - u) * (1 - u) * yt + 2 * u * (1 - u) * my + u * u * yb, r = lerp(4, 12, u);
        ctx.fillStyle = rowC; ctx.beginPath(); ctx.arc(x, y - r * .6, r, 0, 6.29); ctx.fill();
        if (sunA > 0) { ctx.strokeStyle = rgba(P.halo0, (.25 + .4 * (1 - u)) * sunA); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(x, y - r * .6, r, -1.9, -.2); ctx.stroke(); }
      }
    }
    ctx.restore();
    ctx.strokeStyle = rgba(mixHex(P.blue0, P.halo0, sunA), .9); ctx.lineWidth = 3; ctx.beginPath(); for (let x = 240; x <= 2120; x += 16) { const y = groundY(x, RK) - ridgeH(x); x === 240 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
    // the co-op hall; its gate opens (warm light inside), later the light runs into it
    const op = smooth(span(t, A.wine - .2, A.bought - .2));
    onGround(ctx, HALL.x, RK, () => {
      const hw = HALL.w / 2;
      ctx.fillStyle = mixHex(P.night1, P.ind0, .3); ctx.fillRect(-hw, -HALL.h, HALL.w, HALL.h + 6); ctx.beginPath(); ctx.moveTo(-hw - 20, -HALL.h); ctx.lineTo(0, -HALL.h - 96); ctx.lineTo(hw + 20, -HALL.h); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = rgba(mixHex(P.blue0, P.halo0, sunA), .85); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-hw - 20, -HALL.h); ctx.lineTo(0, -HALL.h - 96); ctx.lineTo(hw + 20, -HALL.h); ctx.stroke();
      ctx.strokeStyle = rgba(P.blue0, .45); ctx.lineWidth = 2; ctx.strokeRect(-hw, -HALL.h, HALL.w, HALL.h);
      if (op > 0) E.lightForm(ctx, 'gate', -GATE.w / 2, -GATE.h, GATE.w, GATE.h, t, { mullions: [1, 1], dust: 1800, seed: 76, breath: .015, a: op });
      // the doors: two dark leaves that slide apart
      ctx.fillStyle = mixHex(P.night0, P.night1, .5); const dw = GATE.w / 2 * (1 - op); ctx.fillRect(-GATE.w / 2, -GATE.h, dw, GATE.h); ctx.fillRect(GATE.w / 2 - dw, -GATE.h, dw, GATE.h);
      ctx.strokeStyle = rgba(P.blue0, .5); ctx.lineWidth = 2; ctx.strokeRect(-GATE.w / 2, -GATE.h, GATE.w, GATE.h);
    });
    // the row in front: vines along the ground (the robot will straddle them)
    hedge(ctx, sunA);
    // the vine robot rolls out of the gate: hidden by the hall's wall, visible in the gate opening
    if (t > A.wine) {
      ctx.save();
      const cl = new Path2D(); cl.rect(-1e4, -1e4, 2e4, 2e4);
      const hr = new Path2D(); hr.rect(-HALL.w / 2, -HALL.h - 100, HALL.w, HALL.h + 110); cl.addPath(hr, hallM);
      const gr = new Path2D(); gr.rect(-GATE.w / 2, -GATE.h, GATE.w, GATE.h + 10); cl.addPath(gr, hallM);
      ctx.clip(cl, 'evenodd');
      const x = VX(t); onGround(ctx, x, RK, () => vineRobot(ctx, t, x, sunA));
      ctx.restore();
    }
    GROW.forEach((g, i) => {
      const wk = span(t, A.robotsB - .5 + i * .3, A.tech + .1 + i * .3); if (wk <= 0) { g.handF = null; return; }
      const x = lerp(g.x + 760, g.x, sineIO(wk));
      const reach = smooth(span(t, g.at() - .35, g.at() + .1)) * (1 - smooth(span(t, A.whatif - .2, A.whatif + .4)));
      const hold = smooth(span(t, A.all + .2 + i * .3, A.share + i * .3));
      const r = Math.max(reach, hold * .85);
      onGround(ctx, x, RK, () => {
        const o = wk < 1 ? { pose: 'walk', walk: -x / g.h * 4.2, dir: -1, light: -1 }
          : { dir: g.dir, light: -g.dir, look: .1 + .2 * (i === 2) * r, armR: [lerp(.15, g.arm[0], r), lerp(.08, g.arm[1], r)] };
        const hd = E.person(ctx, 0, 0, g.h, { ...o, rim: mixHex(P.blue0, P.halo0, sunA * .8) });
        g.handF = toFrame(x, hd.R);
      });
    });
  });

  // ---------- explainer: the map of France (tilts up out of the rows) ----------
  const MAP = { x0: -580, w: 1640, d: 960 };
  const FR = [[.38, 0], [.62, .08], [.86, .12], [.83, .33], [.94, .5], [.8, .7], [.86, .9], [.62, .98], [.4, .92], [.16, .86], [.19, .62], [.07, .44], [0, .28], [.22, .22]];
  const inPoly = (x, y, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const rnd = prng(907), FARMS = [], HALLS = [[.3, .3], [.55, .22], [.75, .3], [.45, .5], [.7, .55], [.3, .7], [.55, .78], [.78, .8], [.15, .45]];
  while (FARMS.length < 170) { const x = rnd(), y = rnd(); if (inPoly(x, y, FR)) FARMS.push([x, y, rnd()]); }
  const hallOf = (p) => { let b = 0, bd = 9; HALLS.forEach((h, i) => { const d = Math.hypot(h[0] - p[0], h[1] - p[1]); if (d < bd) { bd = d; b = i; } }); return b; };
  const FH = FARMS.map(hallOf);
  // the tractor's round: a smooth loop around hall 3, passing its farms
  const TH = HALLS[3], TLOOP = (u) => { const q = -Math.PI / 2 + u * 6.283, r = .085 + .025 * Math.sin(3 * q + 1); return [TH[0] + Math.cos(q) * r * 1.1, TH[1] + Math.sin(q) * r]; };
  const TFARMS = FARMS.map((f, i) => i).filter((i) => FH[i] === 3);
  function mapPart(ctx, t, psi) {
    const up = smooth(span(t, A.france - .3, A.france + 1.1)) * (1 - smooth(span(t, A.many + .5, A.wine + .3)));
    if (up <= 0) return;
    const sp = Math.sin(up * Math.PI / 2);
    limbFrame(ctx, aW, KZ, psi, () => {
      ctx.save(); ctx.translate(MAP.x0, 20); ctx.transform(1, 0, 0, -sp, 0, 0);   // map plane: x right, y = depth (up when tilted)
      const card = new Path2D(); card.roundRect(0, 0, MAP.w, MAP.d, 30);
      E.glowFill(ctx, card, 60, .6, P.blue0); ctx.fillStyle = lin(ctx, 0, 0, 0, MAP.d, [[0, P.night0], [1, mixHex(P.night1, P.ind0, .3)]]); ctx.fill(card);
      ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 2; ctx.stroke(card);
      // map space: (u, v) with v = 0 at the north; the plane's y grows upward on screen
      const M = (u, v) => [80 + u * 820, MAP.d - (40 + v * 880)];
      const fu = span(t, A.france - .1, A.france + .9);
      ctx.save(); ctx.setLineDash([2, 11]); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(P.halo0, .8); ctx.lineWidth = 4; ctx.beginPath(); const nn = Math.ceil(fu * FR.length); FR.slice(0, nn).concat(fu >= 1 ? [FR[0]] : []).forEach(([u, v], i) => (i ? ctx.lineTo(...M(u, v)) : ctx.moveTo(...M(u, v)))); ctx.stroke(); ctx.restore();
      const th = span(t, A.shares - .4, A.shares + .9), tu = span(t, A.tractor - .1, A.many + .6), tp = TLOOP(sineIO(tu));
      FARMS.forEach(([u, v, r], i) => {
        const k = span(t, A.one - .2 + r * .8, A.one + .2 + r * .8); if (k <= 0) return; const [x, y] = M(u, v);
        if (th > 0) { const [hx, hy] = M(...HALLS[FH[i]]), q = clamp(th * 1.4 - r * .4); if (q > 0) { ctx.strokeStyle = rgba(P.halo1, .45); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(lerp(x, hx, q), lerp(y, hy, q)); ctx.stroke(); } }
        // a farm flares when the tractor passes it
        const near = tu > 0 && tu < 1 && FH[i] === 3 ? Math.max(0, 1 - Math.hypot(u - tp[0], v - tp[1]) / .05) : 0;
        E.halo(ctx, x, y, 16 + 20 * near, (.4 + .5 * near) * k, P.halo1, P.halo0); ctx.fillStyle = P.core1; ctx.fillRect(x - 3, y - 3, 6, 6);
      });
      HALLS.forEach((h, i) => { const k = span(t, A.coop - .3 + i * .05, A.coop + .3 + i * .05); if (k <= 0) return; const [x, y] = M(...h); const p = new Path2D(); p.arc(x, y, 15 * expoOut(k), 0, 6.29); E.lightShape(ctx, p.stroke({ width: 7, cap: 0, join: 1 }), t, { lit: 1, dust: 0, glow: .8 }); });
      // the tractor: a warm point on its round, a short tail behind it
      if (tu > 0 && tu < 1) {
        const e = sineIO(tu), tail = []; for (let k = 0; k <= 14; k++) { const uu = Math.max(0, e - .2 + k / 14 * .2); tail.push([...M(...TLOOP(uu)), 3]); }
        E.trail(ctx, tail, 1, { w: 3, a: .9 });
      }
      void TFARMS;
      // text: drawn upright (the plane is flipped)
      const ta = smooth(span(up, .85, 1));
      const txt = (fn, x, yTop) => { ctx.save(); ctx.translate(x, MAP.d - yTop); ctx.scale(1, -1); fn(); ctx.restore(); };
      txt(() => wipe(ctx, 'FRANCE', 0, 0, span(t, A.france, A.france + .6) * ta, { size: 52, glow: false, col: P.halo2, spacing: .3, weight: 700 }), 80, MAP.d - 46);
      txt(() => writeOn(ctx, '~1 IN 2', 0, 0, span(t, A.one - .1, A.one + .5) * ta, { serif: true, size: 160 }), 950, 420);
      txt(() => wipe(ctx, 'FARMERS', 0, 0, span(t, A.farmers, A.farmers + .5) * ta, { size: 48, glow: false, col: P.halo2, spacing: .16, weight: 700 }), 956, 492);
      txt(() => wipe(ctx, 'CUMA · ~10,000 GROUPS', 0, 0, span(t, A.coop + .2, A.coop + .8) * ta, { size: 40, glow: false, col: P.halo2, spacing: .08, weight: 700 }), 956, 610);
      txt(() => wipe(ctx, '~195,000 MEMBERS', 0, 0, span(t, A.coop + .4, A.coop + 1.0) * ta, { size: 40, glow: false, col: P.halo2, spacing: .08, weight: 700 }), 956, 666);
      txt(() => wipe(ctx, 'FNCUMA · ASSEMBLÉE NATIONALE, 2023', 0, 0, span(t, A.coop + .6, A.coop + 1.2) * ta, { size: 28, glow: false, col: P.halo2, spacing: .06 }), 956, 716);
      ctx.restore();
    });
  }
  // ---------- explainer: prints of hands on the frame → a ring of three equal shares → back onto the frame ----------
  function sharesPart(ctx, t, psi) {
    if (t < A.tech) return;
    limbFrame(ctx, aW, KZ, psi, () => {
      const C = [VX(t) + 10, groundY(VX(t), RK) - 600], jump = smooth(span(t, A.growers - .25, A.growers + .45)), sink = smooth(span(t, A.whatif - .2, A.whatif + .6));
      GROW.forEach((g, i) => {
        if (!g.handF) return;
        const k = span(t, g.at(), g.at() + .35); if (k <= 0) return;
        const am = -Math.PI / 2 + i / 3 * 6.283, tgt = [C[0] + Math.cos(am) * 130, C[1] + Math.sin(am) * 130], e = quartIO(jump * (1 - sink));
        const x = lerp(g.handF[0], tgt[0], e), y = lerp(g.handF[1], tgt[1], e) - Math.sin(Math.PI * e) * 60;
        mark(ctx, 'hand', x, y, 50 * (1 - .3 * e), t, { lit: 1, u: k, glow: .8, dust: 0 });
      });
      const pu = jump * (1 - sink);
      if (pu > .3) E.pie(ctx, t, { x: C[0], y: C[1], r: 130, start: -Math.PI / 2 - Math.PI / 3, parts: [{ v: 1 }, { v: 1 }, { v: 1 }], u: smooth(span(pu, .3, 1)) });
      const la = smooth(span(t, A.growers + .2, A.growers + .7)) * (1 - sink);
      if (la > 0) for (let i = 0; i < 3; i++) { const am = -Math.PI / 2 + i / 3 * 6.283, rr = 130 + 92; wipe(ctx, '1/3', C[0] + Math.cos(am) * rr, C[1] + Math.sin(am) * rr + 16, span(la, i * .15, i * .15 + .6), { size: 44, align: 'center', glow: false, col: P.halo2, weight: 700 }); }
    });
  }
  // ---------- explainer: the warm trace from the vineyard hall to the cold tower (what if … the same way?) ----------
  const RKB = PR * BKZ, thB = Math.asin(TWR.x / RKB), TOWERTOP = [TWR.x + Math.sin(thB) * (TWR.h + 60), groundY(TWR.x, RKB) - Math.cos(thB) * (TWR.h + 60)];
  function tracePart(ctx, t, psi) {
    const u = span(t, A.learn - .2, A.same + .3), out = 1 - smooth(span(t, A.freeman + .2, A.harvard));
    if (u <= 0 || out <= 0) return;
    const a0 = limbPt(aW, KZ, HALL.x, groundY(HALL.x, RK) - HALL.h - 110, psi), a1 = limbPt(ALPHA.bank, BKZ, ...TOWERTOP, psi);
    const mid = [(a0[0] + a1[0]) / 2, Math.min(a0[1], a1[1]) - Math.hypot(a1[0] - a0[0], a1[1] - a0[1]) * .3];
    E.trail(ctx, E.catmull([[...a0, .3], [...mid, .3], [...a1, .3]], 16), u, { w: .28, a: out });
  }
  // ---------- explainer: the quote, written into the morning haze left of the sun; the source under it ----------
  const QX = -1290, QY = -640, QS = 26 / 18;   // drawn for the camera at s 18 (screen px), inside the 26-frame
  function quotePart(ctx, t, psi) {
    if (t < A.freeman - .3) return;
    limbFrame(ctx, aW, KZ, psi, () => {
      const hz = env(t, A.freeman - .3, A.freeman + 1.2, A.all, A.share);
      if (hz > 0) for (let i = 0; i < 4; i++) { const y = -340 - i * 120, x = -400 + Math.sin(t * .15 + i) * 120; ctx.fillStyle = lin(ctx, x - 1400, 0, x + 1400, 0, [[0, rgba(P.halo1, 0)], [.5, rgba(P.halo1, .07 * hz)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(x - 1400, y - 30, 2800, 60); }
      const out = 1 - smooth(span(t, A.his + .05, A.his + .85));
      if (out <= 0) return;
      ctx.save(); ctx.translate(QX, QY); ctx.scale(QS, QS);
      writeOn(ctx, 'RICHARD FREEMAN', 0, -170, span(t, A.freeman, A.freeman + .5) * out, { size: 40, spacing: .14, weight: 700, col: P.halo2, glow: false });
      writeOn(ctx, '· HARVARD', textW('RICHARD FREEMAN') + 18, -170, span(t, A.harvard - .2, A.harvard + .3) * out, { size: 40, spacing: .14, weight: 700, col: P.halo2, glow: false });
      writeOn(ctx, '“Who owns the robots', 0, -60, span(t, A.who - .1, A.rules - .1) * out, { serif: true, size: 96 });
      writeOn(ctx, 'rules the world.”', 0, 40, span(t, A.rules - .1, A.world) * out, { serif: true, size: 96 });
      wipe(ctx, 'RICHARD FREEMAN, HARVARD · IZA WORLD OF LABOR, 2015', 2, 104, span(t, A.world + .1, A.world + .6) * out, { size: 26, glow: false, col: P.halo2, spacing: .1 });
      ctx.restore();
    });
  }
  // ---------- lights: from the quote down onto the growers' hands (one share each); the middle one runs into the gate (→ c08) ----------
  function lightsPart(ctx, t, psi) {
    if (t < A.his) return;
    limbFrame(ctx, aW, KZ, psi, () => {
      GROW.forEach((g, i) => {
        if (!g.handF) return;
        const k = span(t, A.his + .35 + i * .3, A.share + .1 + i * .3); if (k <= 0) return;
        const [hx, hy] = [g.handF[0], g.handF[1] - 10];
        const src = [QX + (220 + i * 330) * QS, QY - 20 * QS], e = quartIO(k);
        let x = lerp(src[0], hx, e), y = lerp(src[1], hy, e) - Math.sin(Math.PI * e) * 60;
        const born = smooth(span(k, 0, .25));
        if (i === 1) {
          const r = span(t, A.work - .9, A.end - .32), q = sineIO(r);
          if (r > 0) { const gx = GATE.x, gy = gateY; x = lerp(hx, gx, q); y = lerp(hy, gy, q) - Math.sin(Math.PI * q) * 120;
            if (r < 1) { const pts = []; for (let j = 0; j <= 12; j++) { const qq = Math.max(0, q - .35 + j / 12 * .35); pts.push([lerp(hx, gx, qq), lerp(hy, gy, qq) - Math.sin(Math.PI * qq) * 120, 3]); } E.trail(ctx, pts, 1, { w: 3, spark: false, a: .7 }); } }
        }
        E.halo(ctx, x, y, 70, .9 * born); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(x, y, 7 * born, 0, 6.29); ctx.fill();
      });
    });
  }
  function extra(ctx, t, s, psi) {
    ctx.save(); outsideGlobe(ctx);
    housePart(ctx, t, psi); if (t > A.s + 2.6) vinePart(ctx, t, psi);   // the vineyard only once it is far off-screen (no pop at the c06 seam)
    ctx.restore();
    mapPart(ctx, t, psi); sharesPart(ctx, t, psi); tracePart(ctx, t, psi); quotePart(ctx, t, psi); lightsPart(ctx, t, psi);
  }
  const draw = run([[R.a, (ctx, t) => {
    const cam = planetCam(t, K7);
    planetWorld(ctx, t, { cam, before, extra, starRot: rot(t), starA: 1 - .7 * dawn(t) });
    E.lightFlood(ctx, smooth(span(t, A.end - 1.0, A.end)));   // a little longer than the fly-in (408.45–409.00): gentler brightening
  }]]);
  return [{ t: R.a, draw, print: { editorial: true } }];
}
