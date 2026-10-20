// Chunk C7 · §4 babies and seeds, §5 grow up to the cheering · shots 4.12–5.15 · R.first 329.50 → R.b 379.60 (all times from T / R)
//
// PLAN (shot · hero onset on the word · carrier into the next shot · transition)
//   4.12  armchair at night, floor lamp, baby asleep in a basket; the dotted idea card of c06 lands on the parent's knee and becomes
//         the form; tick on "thousand", $1,000 label + source, index line draws on "invested"   → the form lifts and exits the TOP   [cut]
//   4.13  flat world map on a table: the form rises in from the bottom, lands on the US and folds into the third seed;
//         three seeds glow (Santa Clara, Washington, Seoul), the rest stays dark ("everyone")      → camera drifts in (plan sequence)
//   4.14  (same shot) roots run from the seeds and stop at the US border, the border flares ("borders"); a stack of
//         blank forms slides in, APPLY is punched through the top one ("apply")                    → a border segment flickers   [zoom]
//   4.15  each seed becomes an engraved printing plate; prints are pulled ("copied") and hop in rings over the borders
//                                                                                                   → the prints stream right   [whipR]
//   4.16  night wind carries the prints; a strip of four engraved vignettes glides by: hammock, basket, crib, mat, a newborn
//         girl in each, a print settles beside every one ("anywhere")                              → the crib            [zoom]
//   4.17★ macro: a newborn hand closes around a seed of light; the paper tag on it gets her name as unreadable scribble ("name")
//                                                                                                   → the seed            [zoom]
//   4.18  the seed in the soil (cut face under a dawn field): shell cracks, root probes, time-lapse shoot → little tree; two small
//         bare feet toddle in ("walk"); a leaf unfolds ("growing")                                → the top shoot stays while the
//         field slides up and the plan sheet arrives under it                                                             [down]
//   5.01  the shoot settles into the GROW coupon, foil runs on "grow" and it becomes the engraving; a real shoot lifts out again
//                                                                                                   → push into it        [zoom]
//   5.04  the glass fund with the young tree, a coupon sheet at its plinth; each year a ring glows up the trunk, a row of
//         coupons tears at the perforation and flies to a long row of open hands ("every year")   → one coupon flies at the
//         camera and turns: its back is the front page                                                                    [zoom]
//   5.05★ the front page: "AI company doubles its value" lands word by word; on "doubles" the engraved tree in the vignette
//         doubles with a jolt and bursts out of its oval, the coupons at the plinth double         → the camera falls down the
//         page, rain streaks begin                                                                                        [whipU]
//   5.13  rain, sodium light, a pedestrian crossing: people from behind with phones, the same headline on every display, a thumb
//         swipes it away ("scroll past"); the huge board opposite lights only itself, shoulders pulled up ("left behind")
//   5.14  (same shot) the headline returns, under it the engraved foil line "your share ↑" on every display; on "raise" the
//         warm light reaches everyone                                                               → the near display    [zoom]
//   5.06▲ macro on the wet display: "your share ↑" engraves itself, no thumb, rain drops roll over it → pull back      [out]
//   5.15  closer on the heads: shoulders drop, a fist rises quietly, a nudge ("cheering"); sparks rise from the phones
//                                                                                                   → whip up into c08   [whipU]
// Carriers: c06>c07 'own' = the dotted card → the form (drawn at C.pos(t), compensated for the 'down' slide so it stays put on
//   screen) · form (4.12 exit top → 4.13 entry bottom) · seed light (4.13–4.15) · prints (4.15 → 4.16) · crib (4.16 → 4.17) ·
//   seed (4.17 → 4.18) · top shoot (4.18 → 5.01, own track, compensated) · shoot (5.01 → 5.04) · coupon (5.04 → 5.05) ·
//   tree/page fall (5.05 → 5.13) · display (5.14 → 5.06 → 5.15) · rising sparks (5.15 → c08 whipU, drawn until C.t + d/2).
import { W, H, rgba, clamp, lin, mix, eio, eout, ein, sine, prng, drift, canvas, addGlow, text } from '../engine.mjs';
import { fog as artFog, stipple, vnoise } from '../lib/art.mjs';
import { Path2D } from '@napi-rs/canvas';
import { carry, track, drawCarrier } from '../lib/carry.mjs';
import { shareLight } from '../lib/share.mjs';
import { scribble, pen } from '../lib/paper.mjs';
import { figure, POSES, babyBed, smallFeetSide, breath } from '../lib/figure.mjs';
import { hand, palmPos, SKINS } from '../lib/hand.mjs';
import { worldMap, project, country } from '../lib/map.mjs';
import { ring, foilGlint, microtext, seal } from '../lib/certificate.mjs';
import { perforateText } from '../lib/perforate.mjs';
import { field } from '../lib/field.mjs';
import { planSheet } from '../lib/plansheet.mjs';
import { glassFund } from '../lib/glassfund.mjs';
import { heldPhone } from '../lib/phone.mjs';
import { tree } from '../lib/tree.mjs';
import { coupon, couponSheet, flight, ideaForm } from '../lib/sc07_coupons.mjs';
import { street, rain, ripples, backFig, SODIUM } from '../lib/sc07_rain.mjs';

const CACHE = new Map(); const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const TAU = Math.PI * 2, AMB = '#ffb35c', CORE = '#fff1d6', CREAM = '#f3efe2', INK = '#1f2a3a';
const expo = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));          // expo-out entrance
const expoIn = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, 10 * x - 10));        // expo-in exit
const quart = (x) => (x < .5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2); // quart in-out moves
const E = (t0, d, t) => expo(lin(t0, t0 + d, t));
const pop = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : 1 - Math.exp(-u * 7) * Math.cos(u * 9.5));  // ≤4 % overshoot
// slide compensation: progress of an up/down transition into a shot that starts at Bt
const slideE = (Bt, d, t) => eio(lin(Bt - d / 2, Bt + d / 2, t));
function vign(ctx, a = .55, col = '#05060f') { const g = ctx.createRadialGradient(960, 560, 380, 960, 560, 1250); g.addColorStop(0, rgba(col, 0)); g.addColorStop(1, rgba(col, a)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
function motes(ctx, t, box, n, col, seed, a = .5, rise = 6) {
  const r = prng(seed); const [bx, by, bw, bh] = box; ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) { const x = bx + ((r() * bw + Math.sin(t * .3 + i) * 18) % bw), y = by + (((r() * bh - t * rise * (.5 + r())) % bh) + bh) % bh, s = .8 + r() * 1.8, al = a * (.3 + .7 * Math.abs(Math.sin(t * .7 + i * 1.3)));
    ctx.fillStyle = rgba(col, al); ctx.beginPath(); ctx.arc(x, y, s, 0, TAU); ctx.fill(); }
  ctx.restore();
}
const cap = (ctx, s, x, y, o = {}) => text(ctx, s, x, y, { size: 20, weight: 600, spacing: 4, color: CREAM, ...o });
function blurred(key, w, h, px, paint) { return once(key, () => { const [a, ga] = canvas(w, h); paint(ga); const [b, gb] = canvas(w, h); gb.filter = `blur(${px}px)`; gb.drawImage(a, 0, 0); return b; }); }

export default (T, R) => {
  const S = (p, id = '04b', n) => T.S(id, p, n), Q = (p, n) => T.S('05a', p, n);
  const CI = carry('c06>c07', T, R), CO = carry('c07>c08', T, R);
  const A = {
    thousand: S('thousand'), invested: S('invested'), market: T.E('04b', 'stock market'), none: S('None of this'), everyone: S('everyone'),
    stops: S('It stops'), borders: S('borders'), parents: S('parents'), apply: S('apply'), but: S('But every piece'), copied: S('copied'),
    picture: S('Picture a girl'), anywhere: S('anywhere'), seed: S('A seed with'), name: S('name on'), by: S('By the time'), walk: S('walk'),
    growing: S('growing'), grEnd: T.E('04b', 'already growing'),
    step: Q('Step two'), grow: Q('grow'), imagine: Q('Imagine our'), fund: Q('fund paying'), every: Q('every person'), fixed: Q('fixed slice'), year: Q('every year'),
    now: Q('Now picture'), headline: Q('headline'), doubles: Q('doubles'), hlEnd: T.E('05a', 'doubles its value'),
    today: Q('Today, most'), scroll: Q('scroll past'), left: Q('left behind'), withA: Q('With a share'), win: Q('their win'), raise: Q('raise'),
    auto: Q('Automatically'), autoE: T.E('05a', 'Automatically'), envy: Q('Envy turns'), closer: Q('closer'), cheering: Q('cheering'),
  };
  const HLw = T.line('05a', 'Now picture').words, HL = HLw.slice(HLw.findIndex((w) => /AI/.test(w.w)));   // the headline words
  // shot starts (the transition INTO the shot is centred on t)
  const t412 = CI.into.t, t413 = A.none - .2, t415 = A.but - .25, t416 = A.picture - .15, t417 = A.seed - .2, t418 = A.by - .2,
    t501 = A.step - .35, t504 = A.imagine - .3, t505 = A.now - .2, t513 = A.today - .12, t506 = A.auto - .18, t515 = A.envy - .15;
  const d418 = .7;   // 4.18 → 5.01 slide

  // ================================================================ 4.12 the armchair under the floor lamp
  const LAMP = [536, 214];
  const room = () => once('room', () => {
    const [c, g] = canvas(W + 240, H + 140); g.translate(120, 70); const r = prng(12), n = vnoise(3);
    const wg = g.createLinearGradient(0, -70, 0, 860); wg.addColorStop(0, '#0e0a10'); wg.addColorStop(1, '#1d1418'); g.fillStyle = wg; g.fillRect(-120, -70, W + 240, 940);
    // wallpaper: faint engraved vertical pattern
    g.strokeStyle = 'rgba(255,220,180,.025)'; g.lineWidth = 1; for (let x = -120; x < W + 120; x += 22) { g.beginPath(); for (let y = -70; y < 860; y += 10) g.lineTo(x + Math.sin(y * .05 + x) * 2, y); g.stroke(); }
    // lamp-lit wall: warm falloff with stipple
    const lg = g.createRadialGradient(LAMP[0], LAMP[1] + 60, 0, LAMP[0], LAMP[1] + 60, 900); lg.addColorStop(0, 'rgba(255,170,100,.34)'); lg.addColorStop(.4, 'rgba(200,110,70,.12)'); lg.addColorStop(1, 'rgba(120,60,50,0)');
    g.fillStyle = lg; g.fillRect(-120, -70, W + 240, 940);
    // a shelf with books far right (cool, in shadow)
    g.fillStyle = '#0b080b'; g.fillRect(1500, 120, 360, 640); for (let s = 0; s < 4; s++) { g.fillStyle = '#16100f'; g.fillRect(1500, 120 + s * 160 + 150, 360, 10); let bx = 1512; while (bx < 1840) { const bw = 12 + r() * 20, bh = 90 + r() * 50; g.fillStyle = `rgba(${60 + r() * 50},${40 + r() * 30},${40 + r() * 30},.55)`; g.fillRect(bx, 120 + s * 160 + 150 - bh, bw, bh); bx += bw + 2; } }
    // floor boards in perspective, warm near the lamp
    const fy = 850, fg = g.createLinearGradient(0, fy, 0, H + 70); fg.addColorStop(0, '#2b1c15'); fg.addColorStop(1, '#120b08'); g.fillStyle = fg; g.fillRect(-120, fy, W + 240, H + 70 - fy);
    g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1.2; for (let i = -14; i < 26; i++) { g.beginPath(); g.moveTo(900 + i * 40, fy); g.lineTo(900 + i * 160, H + 70); g.stroke(); }
    const fl = g.createRadialGradient(700, 930, 0, 700, 930, 700); fl.addColorStop(0, 'rgba(255,160,90,.22)'); fl.addColorStop(1, 'rgba(255,160,90,0)'); g.save(); g.translate(700, 930); g.scale(1, .3); g.translate(-700, -930); g.fillStyle = fl; g.fillRect(0, 300, 1600, 1300); g.restore();
    g.fillStyle = '#0d0809'; g.fillRect(-120, fy - 16, W + 240, 16);
    // rug under the chair: an engraved oval with a border band
    g.save(); g.translate(930, 948); g.scale(1, .17); g.fillStyle = '#4a2524'; g.beginPath(); g.arc(0, 0, 640, 0, TAU); g.fill(); g.strokeStyle = 'rgba(240,190,150,.22)'; g.lineWidth = 8; for (const rr of [600, 560, 420]) { g.beginPath(); g.arc(0, 0, rr, 0, TAU); g.stroke(); } g.restore();
    // floor lamp: base, pole, shade
    g.fillStyle = '#0a0708'; g.beginPath(); g.ellipse(LAMP[0] - 40, 935, 70, 13, 0, 0, TAU); g.fill(); g.fillRect(LAMP[0] - 44, 280, 7, 655);
    g.beginPath(); g.moveTo(LAMP[0] - 40, 300); g.quadraticCurveTo(LAMP[0] - 40, 240, LAMP[0], LAMP[1] + 40); g.lineWidth = 6; g.strokeStyle = '#0a0708'; g.stroke();
    // light cone downward (stippled falloff)
    const [cc, cg] = canvas(W + 240, H + 140); cg.translate(120, 70);
    const cgr = cg.createLinearGradient(0, LAMP[1] + 40, 0, 940); cgr.addColorStop(0, 'rgba(255,190,120,.28)'); cgr.addColorStop(1, 'rgba(255,170,100,.03)');
    cg.fillStyle = cgr; cg.beginPath(); cg.moveTo(LAMP[0] - 70, LAMP[1] + 50); cg.lineTo(LAMP[0] + 70, LAMP[1] + 50); cg.lineTo(LAMP[0] + 640, 940); cg.lineTo(LAMP[0] - 420, 940); cg.closePath(); cg.fill();
    cg.setTransform(1, 0, 0, 1, 0, 0); stipple(cc, { k: .55, seed: 5 });
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'lighter'; g.drawImage(cc, 0, 0); g.restore();
    return c;
  });
  const chair = () => once('chair', () => {
    const [c, g] = canvas(820, 760); const ox = 60, oy = 40, r = prng(4);
    const vel = (x0, y0, x1, y1) => { const gg = g.createLinearGradient(x0, y0, x1, y1); gg.addColorStop(0, '#3f6a5e'); gg.addColorStop(.45, '#24443c'); gg.addColorStop(1, '#0f1f1b'); return gg; };
    g.translate(ox, oy);
    // back of the wingback (behind the sitter), seat, front arm, legs
    g.fillStyle = vel(0, 0, 360, 560); g.beginPath(); g.moveTo(40, 560); g.bezierCurveTo(10, 380, 20, 140, 70, 60); g.bezierCurveTo(120, 0, 260, 0, 300, 60); g.bezierCurveTo(330, 120, 320, 330, 330, 560); g.closePath(); g.fill();
    g.fillStyle = vel(300, 380, 560, 640); g.beginPath(); g.moveTo(60, 520); g.lineTo(560, 520); g.quadraticCurveTo(600, 530, 600, 580); g.lineTo(600, 640); g.lineTo(60, 640); g.closePath(); g.fill();
    // front armrest (rolled), in front of the sitter's hip side
    g.fillStyle = vel(380, 420, 640, 640); g.beginPath(); g.moveTo(330, 470); g.quadraticCurveTo(470, 440, 600, 470); g.quadraticCurveTo(650, 490, 640, 540); g.lineTo(630, 650); g.lineTo(340, 650); g.closePath();
    // (the arm is drawn later over the sitter; keep only the seat block here)
    g.fillStyle = '#0a1210'; for (const lx of [90, 560]) { g.beginPath(); g.moveTo(lx, 640); g.lineTo(lx + 14, 700); g.lineTo(lx + 26, 700); g.lineTo(lx + 30, 640); g.closePath(); g.fill(); }
    // velvet nap: engraved hatch on the shadow side, rim toward the lamp (upper left)
    g.strokeStyle = 'rgba(0,0,0,.28)'; g.lineWidth = 1; for (let i = 0; i < 70; i++) { const x = 120 + i * 8; g.beginPath(); g.moveTo(x, 80 + (i % 5) * 4); g.lineTo(x - 40, 640); g.stroke(); }
    g.globalCompositeOperation = 'source-atop'; const rim = g.createLinearGradient(0, 0, 220, 220); rim.addColorStop(0, 'rgba(255,200,140,.42)'); rim.addColorStop(.3, 'rgba(255,200,140,0)'); g.fillStyle = rim; g.fillRect(-60, -40, 900, 800);
    g.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 1600; i++) { g.fillStyle = r() < .5 ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.08)'; g.fillRect(r() * 700, r() * 680, 1.4, 1.4); }
    return c;
  });
  const armFront = (g, t) => { // the near armrest of the chair, drawn over the sitter's hip
    const gg = g.createLinearGradient(0, 470, 0, 650); gg.addColorStop(0, '#2f5248'); gg.addColorStop(1, '#0d1a17');
    g.fillStyle = gg; g.beginPath(); g.moveTo(-20, 0); g.quadraticCurveTo(80, -26, 200, -6); g.quadraticCurveTo(250, 10, 244, 52); g.lineTo(236, 170); g.lineTo(-10, 170); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(255,205,150,.5)'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(-10, -2); g.quadraticCurveTo(80, -27, 196, -8); g.stroke();
  };
  const fg412 = () => blurred('fg412', 700, 560, 14, (g) => { g.fillStyle = '#060406'; for (let i = 0; i < 7; i++) { g.save(); g.translate(560, 560); g.rotate(-1.9 + i * .22); g.beginPath(); g.ellipse(0, -260, 50, 240, 0, 0, TAU); g.fill(); g.restore(); } });
  const FORM_LAND = 330.45;
  const formLift = (t) => expoIn(lin(A.none - 1.05, A.none - .1, t));   // the form rises off the knee and out of the top
  function draw412(ctx, t) {
    const e0 = t < CI.t + .26 ? slideE(CI.t, CI.into.d, t) : 1;   // compensation while the shot slides in from below
    const k = quart(lin(FORM_LAND, A.none, t)), z = 1 + .055 * k, cxp = 980, cyp = 700;
    const par = (p) => { ctx.translate(cxp, cyp); ctx.scale(1 + (z - 1) * p, 1 + (z - 1) * p); ctx.translate(-cxp + drift(t, 3, 1) * p * k, -cyp + drift(t, 2, 2) * p * k); };
    ctx.save(); par(.55); ctx.drawImage(room(), -120, -70);
    // the lamp shade glows (breathing very slightly)
    const sh = LAMP, gl = .92 + .04 * Math.sin(t * 1.3);
    addGlow(ctx, sh[0], sh[1] + 40, 360, .32 * gl, AMB, CORE);
    const sg = ctx.createLinearGradient(sh[0] - 90, 0, sh[0] + 90, 0); sg.addColorStop(0, '#b86a34'); sg.addColorStop(.5, '#ffe2b0'); sg.addColorStop(1, '#c47a40');
    ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(sh[0] - 62, sh[1] - 52); ctx.lineTo(sh[0] + 62, sh[1] - 52); ctx.lineTo(sh[0] + 98, sh[1] + 48); ctx.lineTo(sh[0] - 98, sh[1] + 48); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(120,60,20,.35)'; ctx.lineWidth = 1; for (let i = -9; i <= 9; i++) { ctx.beginPath(); ctx.moveTo(sh[0] + i * 6.6, sh[1] - 52); ctx.lineTo(sh[0] + i * 10.4, sh[1] + 48); ctx.stroke(); }
    ctx.fillStyle = '#fff4dc'; ctx.beginPath(); ctx.ellipse(sh[0], sh[1] + 48, 98, 12, 0, 0, TAU); ctx.fill();
    ctx.restore();
    // mid plane: chair, parent, form
    ctx.save(); par(1);
    ctx.drawImage(chair(), 560, 300);
    const hip = [818, 742], s = 4.3, wr = E(A.thousand - .45, .4, t) * (1 - E(A.thousand + .55, .6, t)), pose = { ...POSES.sit, sh: [mix(.62, .85, wr), .35], el: [mix(.45, .05, wr), 0], head: .48 + .03 * Math.sin(t * .8), lean: .14 + .08 * wr };
    // the tick on "thousand": the pen hand moves to the box
    const tick = clamp((t - A.thousand - .02) / .38), lift = formLift(t);
    const FIG = figure(ctx, hip[0], hip[1], s, pose, { t, seed: 2, accent: '#e8a3a0', accentPart: 'coat', dress: { coat: '#6a4a52', pants: '#2a2230', shoes: '#120d10', skin: '#c99a74', hair: '#2a1c18' },
      light: { x: LAMP[0], y: LAMP[1], col: '#ffcf8a', a: .95 }, rim: '#ffd9a0', rimSide: -1, shadow: false });
    ctx.save(); ctx.translate(720, 772); armFront(ctx, t); ctx.restore();
    ctx.restore();
    // the form: the carrier lands (screen space, compensated for the slide), then rests on the knee and moves with the camera
    if (lift < 1) {
      let p = CI.pos(t), ghost = 1 - E(CI.t + .1, .9, t);
      ctx.save();
      if (t > FORM_LAND) { par(1); }
      const fx = p.x + (t > FORM_LAND ? 0 : 0), fy = p.y - (1 - e0) * H;
      const ly = -lift * 1150, lx = lift * 60, lr = p.r - lift * .5 + Math.sin(t * 7) * .06 * lift;
      ideaForm(ctx, fx + lx, fy + ly, p.s * .84 * (1 + lift * .15), lr, t, { ghost, check: tick, name: E(CI.t + .2, 1.2, t), light: .8 });
      // the pen: rests near the box, writes the tick, lifts away
      if (lift < .35 && t > FORM_LAND) { // the pen in the front hand: its nib writes the tick into the box
        const hp = FIG.hand(0), bx = fx + 50, by = fy - 12, tu = clamp(tick), tx = bx + (tu < .35 ? tu / .35 * 5 : 5 + (tu - .35) / .65 * 17), ty = by + (tu < .35 ? tu / .35 * 7 : 7 - (tu - .35) / .65 * 22);
        const nx = mix(hp[0] + 30, tx, wr), ny = mix(hp[1] + 40, ty, wr);
        pen(ctx, nx, ny, .6, { ang: Math.atan2(hp[1] - ny, hp[0] - nx) - .25, t, lift: tick > 0 && tick < 1 ? 0 : .6 });
      }
      ctx.restore();
    }
    // the baby asleep in the basket (front right), breathing
    ctx.save(); par(1.25); babyBed(ctx, 1290, 938, 3.6, 'basket', { t, light: { x: LAMP[0], y: LAMP[1] }, rim: '#ffd9a0', blanket: '#efe2cf' }); ctx.restore();
    // the label: $1,000 · born 2025–2028 · US citizens · must be claimed (+ source); index line on "invested"
    const la = E(A.thousand + .05, .6, t), lb = E(A.thousand + .45, .6, t), lc = E(A.invested - .05, 1.1, t);
    if (la > 0) {
      const x0 = 1250, y0 = 268;
      { const bg = ctx.createRadialGradient(x0 + 260, y0 + 40, 40, x0 + 260, y0 + 40, 520); bg.addColorStop(0, `rgba(10,7,10,${.55 * la})`); bg.addColorStop(1, 'rgba(10,7,10,0)'); ctx.fillStyle = bg; ctx.fillRect(x0 - 300, y0 - 300, 1100, 700); }
      ctx.save(); ctx.globalAlpha = la; ctx.translate(0, (1 - la) * 26);
      text(ctx, '$1,000', x0, y0, { size: 122, font: 'Instrument Serif', color: '#ffd9a0' });
      ctx.globalAlpha = lb; cap(ctx, 'BORN 2025–2028 · US CITIZENS', x0 + 4, y0 + 56, { size: 21 }); cap(ctx, 'MUST BE CLAIMED', x0 + 4, y0 + 90, { size: 21, color: '#e8a3a0' });
      ctx.globalAlpha = lb * .7; cap(ctx, 'SOURCE: US TREASURY · ABC7, 2026', x0 + 4, y0 + 124, { size: 13, spacing: 2.5, weight: 500 });
      ctx.restore();
      if (lc > 0) { // a thin engraved index line climbs on "invested in the stock market"
        const pts = []; const r = prng(3); let y = 0; for (let i = 0; i <= 40; i++) { y += (r() - .62) * 9; pts.push([x0 + i * 13, y0 + 210 + y]); }
        const n = Math.floor(lc * 40); ctx.save(); ctx.lineJoin = 'round';
        for (const [w, al, col] of [[7, .12, AMB], [2, .9, '#ffd9a0']]) { ctx.strokeStyle = rgba(col, al); ctx.lineWidth = w; ctx.beginPath(); for (let i = 0; i <= n; i++) i ? ctx.lineTo(...pts[i]) : ctx.moveTo(...pts[i]); ctx.stroke(); }
        addGlow(ctx, pts[n][0], pts[n][1], 26, .6, AMB, CORE);
        ctx.globalAlpha = E(A.invested + .3, .5, t) * .85; cap(ctx, 'US STOCK INDEX FUNDS', x0 + 4, y0 + 268, { size: 14, spacing: 3, color: '#d9c7b0' }); ctx.restore();
      }
    }
    // dust in the cone, foreground shape, vignette
    motes(ctx, t, [380, 280, 700, 600], 40, '#ffd9a0', 7, .5);
    ctx.drawImage(fg412(), -260 - k * 30, 620);
    vign(ctx, .62);
  }

  // ================================================================ 4.13 / 4.14 the map: three seeds, roots stop at the border, apply
  const SEEDS = [{ lon: -121.96, lat: 37.35, born: null }, { lon: 127.0, lat: 37.55, born: null }, { lon: -77.04, lat: 38.9, born: 'form' }];
  const camAt = (t) => {
    const u = quart(lin(A.none + .5, A.borders - .1, t)), v = quart(lin(A.apply - .6, t415 + .3, t));
    return { cx: mix(.05, -1.12, u), cy: mix(.08, .6, u), z: mix(1.02, 2.75, u) * (1 + .12 * v), tilt: .42, rot: -.04 + .02 * u, x: 960 + v * 60, y: 560 };
  };
  // ll units: find the US centre to steer the camera (Equal Earth units: about -2..2 wide); computed once from project at cam 0
  const usRing = () => once('usring', () => { const c = country('USA'); let best = null, n = 0; for (const p of c.polys) for (const ring of p) if (ring.length > n) { n = ring.length; best = ring; } return best; });
  const inside = (ring, lon, lat) => { let c = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, yi] = ring[i], [xj, yj] = ring[j]; if ((yi > lat) !== (yj > lat) && lon < (xj - xi) * (lat - yi) / (yj - yi) + xi) c = !c; } return c; };
  const roots = () => once('roots', () => { // root walks in lon/lat from the two US seeds; each stops where it would cross the border
    const ring = usRing(), r = prng(21), out = [];
    for (const sd of [SEEDS[0], SEEDS[2]]) for (let k = 0; k < 9; k++) {
      let a = k / 9 * TAU + r() * .5, lon = sd.lon, lat = sd.lat; const pts = [[lon, lat]]; let hit = null;
      for (let i = 0; i < 160; i++) { a += (r() - .5) * .5; const nl = lon + Math.cos(a) * .45, nt = lat + Math.sin(a) * .3; if (!inside(ring, nl, nt)) { hit = [nl, nt]; break; } lon = nl; lat = nt; pts.push([lon, lat]); }
      out.push({ pts, hit, d: k * .06 + r() * .2 });
    }
    return out;
  });
  function stackForms(ctx, x, y, t, u, punch) {
    if (u <= 0) return;
    for (let i = 4; i >= 0; i--) { ideaForm(ctx, x + i * 7 + (1 - u) * 420, y - i * 6 + (1 - u) * 60, .78, -.06 + i * .02, t, { ghost: 0, name: 0, check: 0, a: u }); }
    if (punch > 0) perforateText(ctx, 'APPLY', x + 10 + (1 - u) * 420, y + 10, { size: 64, pitch: 6, hole: 1.6, u: punch, t, rot: -.06, onPaper: true, a: u });
  }
  function draw413(ctx, t) {
    const cam = camAt(t);
    ctx.fillStyle = '#120d12'; ctx.fillRect(0, 0, W, H);
    const dim = .55 + .25 * E(A.everyone - .1, .8, t), bg = E(A.borders - .15, .3, t) * (1 - .6 * E(A.borders + .5, 1.2, t));
    worldMap(ctx, cam, { t, highlight: ['USA', 'KOR'], dim, borderGlow: bg > .02 ? ['USA'] : [], glowCol: AMB, light: [960, 300] });
    // seeds
    const formLand = A.none + .55;
    for (const sd of SEEDS) {
      const [sx, sy, sc] = project(cam, sd.lon, sd.lat);
      const rr = 9 + 3 * cam.z, on = sd.born === 'form' ? E(formLand - .05, .5, t) : 1; if (on <= 0) continue;
      addGlow(ctx, sx, sy, rr * 5, .35 * on, AMB, CORE);
      shareLight(ctx, sx, sy, rr, t, sd.born === 'form' ? { mode: 'seed', born: formLand - .05, shadow: true } : { mode: 'seed', shadow: true });
    }
    // the form arrives from the bottom (it left 4.12 through the top), glides over the map and folds into the seed
    if (t < formLand + .1) {
      const [tx, ty] = project(cam, SEEDS[2].lon, SEEDS[2].lat), u = clamp((t - t413) / (formLand - t413)), e = 1 - Math.pow(1 - u, 3);
      const x = mix(1060, tx, e), y = mix(1300, ty, e), sc = mix(1.2, .05, Math.pow(e, 1.4));
      ctx.save(); ctx.translate(x, y); ctx.scale(1, mix(1, .55, e)); ideaForm(ctx, 0, 0, sc, mix(-.3, -.04, e), t, { ghost: 0, check: 1, name: 1 }); ctx.restore();
      if (u > .85) addGlow(ctx, tx, ty, 90, (u - .85) / .15 * .8, AMB, CORE);
    }
    // 4.14: roots run from the US seeds and stop at the border (sparks where they hit)
    const ru = lin(A.stops - .1, A.borders + .05, t);
    if (ru > 0) {
      ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (const rt of roots()) {
        const u = clamp((ru - rt.d) / (1 - rt.d * .8)), n = Math.floor(u * (rt.pts.length - 1)); if (n < 1) continue;
        const P = rt.pts.slice(0, n + 1).map(([lo, la]) => project(cam, lo, la));
        for (const [w, al, col] of [[7, .5, '#3a1d0c'], [9, .1, AMB], [2.2, .95, '#fff1d6']]) { ctx.strokeStyle = rgba(col, al); ctx.lineWidth = w; ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); }
        if (u >= 1 && rt.hit) { const [hx, hy] = project(cam, rt.hit[0], rt.hit[1]), since = t - (A.stops - .1 + (rt.d + (1 - rt.d * .8)) * (A.borders + .15 - A.stops)); const fl = Math.exp(-Math.max(0, since) * 2.2);
          addGlow(ctx, hx, hy, 30, .25 + .5 * fl, AMB, CORE); ctx.strokeStyle = rgba('#fff1d6', .8); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(hx - 6, hy - 6); ctx.lineTo(hx + 6, hy + 6); ctx.moveTo(hx + 6, hy - 6); ctx.lineTo(hx - 6, hy + 6); ctx.stroke(); }
      }
      ctx.restore();
    }
    // "apply": a stack of blank forms slides in, APPLY punched through the top one
    const su = E(A.parents - .1, .7, t);
    if (su > 0) stackForms(ctx, 1420, 780, t, su, lin(A.apply - .1, A.apply + .55, t));
    // the flicker on one border segment (the zoom goes into it)
    if (t > t415 - .6) { const [bx, by] = project(cam, -100.5, 28.6); const f = .5 + .5 * Math.sin(t * 40); addGlow(ctx, bx, by, 60, .5 * f * E(t415 - .6, .2, t), AMB, CORE); }
    vign(ctx, .5);
  }

  // ================================================================ 4.15 seeds become printing plates; prints hop in rings over borders
  const cam415 = (t) => ({ cx: -1.02, cy: .58, z: mix(3.3, 2.2, quart(lin(t415, A.picture, t))), tilt: .4, rot: -.02, x: 960, y: 560 });
  function plate(ctx, x, y, s, t, u) { // the copper plate with an engraved seed
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s * .62);
    const g = ctx.createLinearGradient(-90, -60, 90, 60); g.addColorStop(0, '#e0a070'); g.addColorStop(.5, '#a8603a'); g.addColorStop(1, '#5a2e1c');
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.roundRect(-86, -54, 180, 120, 8); ctx.fill();
    ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-90, -60, 180, 120, 8); ctx.fill();
    ctx.strokeStyle = 'rgba(255,230,200,.55)'; ctx.lineWidth = 1.5; ctx.stroke();
    ring(ctx, 0, 0, 62 * u, 44 * u, { lines: 5, band: 10, wave: 14, col: '#3a1a0c', glow: null, op: 'source-over', a: .8, lw: .8 });
    ctx.restore();
    shareLight(ctx, x, y, 12 * s, t, { mode: 'seed', a: .9 });
  }
  function printSheet(ctx, x, y, s, rot, t, a = 1, glow = .6) {
    ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(-34, -22, 72, 48);
    ctx.fillStyle = '#efe6cf'; ctx.fillRect(-36, -25, 72, 50);
    ctx.strokeStyle = 'rgba(122,59,23,.85)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(0, 0, 22, 15, 0, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, 0, 17, 11, 0, 0, TAU); ctx.stroke();
    ctx.restore();
    shareLight(ctx, x, y, 5 * s, t, { mode: 'seed', a: a * glow });
  }
  const RINGS = [{ n: 6, r: 230, t: .0 }, { n: 10, r: 470, t: .38 }, { n: 15, r: 760, t: .74 }];
  function draw415(ctx, t) {
    const cam = cam415(t);
    ctx.fillStyle = '#120d12'; ctx.fillRect(0, 0, W, H);
    worldMap(ctx, cam, { t, highlight: ['USA'], dim: .55, borderGlow: [], light: [960, 300] });
    const pu = E(t415 + .1, .6, t);
    const centres = [SEEDS[2], SEEDS[0]].map((sd) => project(cam, sd.lon, sd.lat));
    centres.forEach(([x, y, sc], i) => plate(ctx, x, y, (.8 + .3 * sc) * (i ? .7 : 1) * pu, t, pu));
    // the pull on "copied": a sheet presses onto the main plate and lifts with the print
    const [mx, my] = centres[0], pull = lin(A.copied - .25, A.copied + .25, t), hop0 = A.copied + .2;
    if (pull > 0 && pull < 1) { const d = Math.sin(pull * Math.PI); printSheet(ctx, mx, my - 30 * (1 - d) - 4, 2.1, -.03, t, 1, .3 + d * .5); }
    // prints hop out in rings, each crossing borders; small ring where they land
    let flying = 0;
    RINGS.forEach((Rg, ri) => {
      for (let i = 0; i < Rg.n; i++) {
        const t0 = hop0 + Rg.t + i * .025, u = clamp((t - t0) / .55); if (u <= 0) continue;
        const a = i / Rg.n * TAU + ri * .3, tx = mx + Math.cos(a) * Rg.r * 1.25, ty = my + Math.sin(a) * Rg.r * .62;
        const fromR = ri ? RINGS[ri - 1].r : 0, fx = mx + Math.cos(a) * fromR * 1.25, fy = my + Math.sin(a) * fromR * .62, e = eout(u);
        const x = mix(fx, tx, e), y = mix(fy, ty, e) - Math.sin(u * Math.PI) * 90, s = 1.1 + Math.sin(u * Math.PI) * .4;
        // leave right at the end (into the whip)
        const out = expoIn(lin(A.picture - .55 + i * .01, A.picture + .1, t));
        if (u >= 1) { ripplesAt(ctx, tx, ty, t - t0 - .55); }
        printSheet(ctx, x + out * 1500, y - out * 40, s, Math.sin(a * 3 + t) * .2, t); flying++;
      }
    });
    vign(ctx, .5);
  }
  function ripplesAt(ctx, x, y, dt) { if (dt < 0 || dt > 1.2) return; const k = dt / 1.2; ctx.save(); ctx.strokeStyle = rgba(AMB, .5 * (1 - k)); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.ellipse(x, y, 10 + k * 46, (10 + k * 46) * .5, 0, 0, TAU); ctx.stroke(); ctx.restore(); }

  // ================================================================ 4.16 night wind, the strip of four sleeping places
  const KINDS = [{ k: 'mat', bg: ['#141a3a', '#2a2a55'], light: '#9fb6cf', seed: 1 }, { k: 'crib', bg: ['#1a1430', '#3a2a40'], light: '#ffcf8a', seed: 2 }, { k: 'basket', bg: ['#2a1a14', '#5a3422'], light: '#ffb878', seed: 3 }, { k: 'hammock', bg: ['#0f2030', '#1f3c4a'], light: '#cfe3ff', seed: 4 }];
  const VW = 470, VH = 340;
  const vigBG = (i) => once('vig' + i, () => { // the world around each sleeping place (static, cached)
    const K = KINDS[i], [c, g] = canvas(VW, VH), r = prng(50 + i), lg = g.createLinearGradient(0, 0, 0, VH); lg.addColorStop(0, K.bg[0]); lg.addColorStop(1, K.bg[1]); g.fillStyle = lg; g.fillRect(0, 0, VW, VH);
    if (K.k === 'hammock') { addGlow(g, 300, 70, 70, .5, '#cfe3ff', '#ffffff'); g.fillStyle = '#e8eef8'; g.beginPath(); g.arc(300, 70, 22, 0, TAU); g.fill(); g.fillStyle = '#05080c'; for (const px of [60, 345]) { g.beginPath(); g.moveTo(px, VH); g.quadraticCurveTo(px + 10, 140, px + 24, 40); g.lineTo(px + 34, 44); g.quadraticCurveTo(px + 22, 140, px + 22, VH); g.fill(); for (let f = 0; f < 6; f++) { g.save(); g.translate(px + 28, 42); g.rotate(-2.6 + f * .9); g.beginPath(); g.ellipse(40, 0, 44, 7, 0, 0, TAU); g.fill(); g.restore(); } } }
    if (K.k === 'basket') { g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 210, VW, 80); addGlow(g, 90, 120, 120, .6, '#ffb878', '#fff1d6'); g.fillStyle = '#ffe2b0'; g.beginPath(); g.ellipse(90, 128, 6, 10, 0, 0, TAU); g.fill(); g.strokeStyle = 'rgba(255,200,140,.12)'; for (let y = 10; y < 210; y += 9) { g.beginPath(); g.moveTo(0, y); g.lineTo(VW, y + r() * 4); g.stroke(); } }
    if (K.k === 'crib') { for (let i2 = 0; i2 < 18; i2++) { addGlow(g, r() * VW, 40 + r() * 120, 10 + r() * 14, .25, r() < .5 ? '#ffcf8a' : '#9fb6cf', '#fff'); } g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(0, 222, VW, 70); addGlow(g, 330, 200, 60, .5, '#ffcf8a', '#fff1d6'); }
    if (K.k === 'mat') { g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(0, 200, VW, 90); g.strokeStyle = 'rgba(220,230,255,.18)'; g.lineWidth = 1; for (let j = 0; j < 22; j++) { g.beginPath(); g.moveTo(200, 18); g.quadraticCurveTo(200 + (j - 11) * 9, 120, 200 + (j - 11) * 16, 232); g.stroke(); } addGlow(g, 200, 30, 50, .3, '#cfe3ff', '#fff'); }
    return c;
  });
  const STRIP = (t) => { const u = expo(lin(t416 - .3, t417 + .2, t) * .85) * 1.0; return mix(-640, 0, u); };
  const vigX = (i, t) => 262 + i * 470 + STRIP(t), VY = 560;
  function draw416(ctx, t) {
    const bg = once('bg416', () => { const [c, g] = canvas(W, H), r = prng(9); const lg = g.createLinearGradient(0, 0, 0, H); lg.addColorStop(0, '#060818'); lg.addColorStop(1, '#141a3c'); g.fillStyle = lg; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(230,236,255,${.15 + r() * .5})`; g.beginPath(); g.arc(r() * W, r() * H * .7, r() * 1.3, 0, TAU); g.fill(); }
      artFog(g, { y0: 600, y1: H, col: '#3a4680', a: .35, seed: 3, cover: .5 }); return c; });
    ctx.drawImage(bg, 0, 0);
    // cloud bands drift right with the wind
    ctx.save(); ctx.globalAlpha = .35; for (let i = 0; i < 3; i++) { const y = 230 + i * 260, x = ((t * (40 + i * 30) + i * 500) % (W + 900)) - 900; const g = ctx.createLinearGradient(x, 0, x + 900, 0); g.addColorStop(0, 'rgba(90,100,160,0)'); g.addColorStop(.5, 'rgba(90,100,160,.35)'); g.addColorStop(1, 'rgba(90,100,160,0)'); ctx.fillStyle = g; ctx.fillRect(x, y, 900, 22 + i * 8); } ctx.restore();
    // the vignettes
    for (let i = 0; i < 4; i++) {
      const x = vigX(i, t), y = VY + Math.sin(t * .6 + i) * 6, K = KINDS[i];
      if (x < -260 || x > W + 260) continue;
      ctx.save(); ctx.beginPath(); ctx.ellipse(x, y, VW / 2, VH / 2, 0, 0, TAU); ctx.clip();
      ctx.drawImage(vigBG(i), x - VW / 2, y - VH / 2);
      const bs = K.k === 'hammock' ? 2.9 : 3.1, by = K.k === 'hammock' ? y + 22 : y + 118;
      babyBed(ctx, x, by, bs, K.k, { t: t + i, light: { x: x - 100, y: y - 120 }, rim: rgba(K.light, .9), blanket: ['#efe2cf', '#f2d8d0', '#e9e0cc', '#e8dcc4'][i] });
      // a print settles beside her
      const st = A.picture + .35 + i * .45, su = E(st, .7, t);
      if (su > 0) { const px = x + 70 - (1 - su) * 260, py = by - 40 - (1 - su) * 120; shareLight(ctx, px, py, 7, t, { mode: 'seed', born: st }); }
      ctx.restore();
      ring(ctx, x, y, VW / 2 + 6, VH / 2 + 6, { lines: 6, band: 12, wave: 26, col: '#f3e6c4', glow: AMB, a: .75, lw: .8 });
      ctx.strokeStyle = rgba(CREAM, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, VW / 2, VH / 2, 0, 0, TAU); ctx.stroke();
    }
    // prints fly with the wind across the frame
    const r = prng(33);
    for (let i = 0; i < 16; i++) { const sp = 260 + r() * 340, y0 = r() < .5 ? 90 + r() * 230 : 820 + r() * 170, ph = r() * 3000, s = .45 + r() * .6; const x = ((t - t416) * sp + ph * .4 - 300) % (W + 400) - 100 + (t < t416 + .5 ? 0 : 0);
      printSheet(ctx, x, y0 + Math.sin(t * 1.3 + i) * 30, s, Math.sin(t * 2 + i) * .5, t, .9, .5); }
    vign(ctx, .55);
  }

  // ================================================================ 4.17 ★ the newborn hand closes around the seed; her name on the tag
  const SEEDP = [1010, 560];
  const bg417 = () => blurred('bg417', W + 200, H + 200, 26, (g) => {
    const lg = g.createLinearGradient(0, 0, W, H); lg.addColorStop(0, '#3a2620'); lg.addColorStop(1, '#120a0c'); g.fillStyle = lg; g.fillRect(0, 0, W + 200, H + 200);
    // blanket folds (soft cream and rose)
    const r = prng(17); for (let i = 0; i < 14; i++) { g.fillStyle = i % 2 ? 'rgba(239,226,207,.18)' : 'rgba(232,163,160,.12)'; g.beginPath(); g.ellipse(200 + r() * 1800, 700 + r() * 600, 300 + r() * 300, 60 + r() * 50, -.3 + r() * .4, 0, TAU); g.fill(); }
    // bokeh
    for (let i = 0; i < 9; i++) { const x = r() * (W + 200), y = r() * 500, rr = 40 + r() * 60; const gg = g.createRadialGradient(x, y, 0, x, y, rr); gg.addColorStop(0, i % 3 ? 'rgba(255,190,120,.35)' : 'rgba(232,163,160,.3)'); gg.addColorStop(.8, 'rgba(255,190,120,.12)'); gg.addColorStop(1, 'rgba(255,190,120,0)'); g.fillStyle = gg; g.beginPath(); g.arc(x, y, rr, 0, TAU); g.fill(); }
  });
  const chest = () => blurred('chest417', 2200, 760, 22, (g) => { g.save(); g.beginPath(); g.ellipse(1100, 160, 1150, 470, 0, 0, TAU); g.clip(); const gg = g.createLinearGradient(0, 0, 0, 640); gg.addColorStop(0, '#d9bfae'); gg.addColorStop(1, '#8a6a60'); g.fillStyle = gg; g.fillRect(0, 0, 2200, 760);
    for (let i = 0; i < 9; i++) { g.fillStyle = i % 2 ? 'rgba(232,163,160,.45)' : 'rgba(243,239,226,.35)'; g.beginPath(); g.ellipse(1100, 60 + i * 40, 1200, 26, 0, 0, TAU); g.fill(); } g.restore(); });
  function tag(ctx, x, y, ang, t, wu) { // the paper tag on a thread, name as scribble written on "name"
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
    ctx.fillStyle = 'rgba(10,5,4,.35)'; ctx.beginPath(); ctx.roundRect(-4, 14, 210, 120, 10); ctx.fill();
    const pg = ctx.createLinearGradient(0, 0, 200, 120); pg.addColorStop(0, '#f8f0dc'); pg.addColorStop(1, '#e2d2b0'); ctx.fillStyle = pg;
    ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(200, 0); ctx.lineTo(200, 118); ctx.lineTo(30, 118); ctx.lineTo(0, 59); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(122,59,23,.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(36, 8); ctx.lineTo(192, 8); ctx.lineTo(192, 110); ctx.lineTo(36, 110); ctx.lineTo(9, 59); ctx.closePath(); ctx.stroke();
    microtext(ctx, 40, 102, 148, 'A SEED FOR EVERY CHILD', { size: 5, col: '#7a3b17', a: .6 });
    ctx.fillStyle = '#d8c7a4'; ctx.beginPath(); ctx.arc(24, 59, 9, 0, TAU); ctx.fill(); ctx.fillStyle = '#2a1c18'; ctx.beginPath(); ctx.arc(24, 59, 4.5, 0, TAU); ctx.fill();
    scribble(ctx, 48, 62, 132, 30, { seed: 8, u: wu, ink: '#1a2440', lw: 2.6 });
    // the light of the seed warms the tag's near edge
    ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createLinearGradient(0, 0, 120, 0); lg.addColorStop(0, rgba(AMB, .3)); lg.addColorStop(1, rgba(AMB, 0)); ctx.fillStyle = lg; ctx.fillRect(0, 0, 200, 120);
    ctx.restore();
  }
  // the newborn hand (macro): the open palm faces us, the seed of light lies in it below the finger roots; the four short fingers
  // fold toward the camera over it (projected lengths shrink with the curl, folded segments show their backs with tiny nails),
  // the thumb tucks in; the light glows through the skin (warm translucency) and leaks between the fingers
  function babyHand(ctx, x, y, s, ang, close, t, seedL) {
    const skin = '#f0c6a6', b = breath(t * 2.6, 1) * .01, SEED = [2, -50];
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s * (1 + b), s * (1 - b));
    const cap2 = (x1, y1, r1, x2, y2, r2) => { const a = Math.atan2(y2 - y1, x2 - x1), d = Math.hypot(x2 - x1, y2 - y1) || .01, k = Math.asin(clamp((r1 - r2) / d, -1, 1)); ctx.moveTo(x1 + Math.cos(a + Math.PI / 2 + k) * r1, y1 + Math.sin(a + Math.PI / 2 + k) * r1); ctx.arc(x1, y1, r1, a + Math.PI / 2 + k, a + 3 * Math.PI / 2 - k); ctx.arc(x2, y2, r2, a - Math.PI / 2 - k, a + Math.PI / 2 + k); ctx.closePath(); };
    const shadeOf = (th) => { const f = clamp(Math.cos(th - Math.PI * .55) * .5 + .5); return mixC('#b9785e', '#f6d2b6', f); };
    // wrist + knit cuff (lower left), palm, heel and thumb mount
    ctx.beginPath(); cap2(0, 120, 70, -40, 300, 78); ctx.fillStyle = skin; ctx.fill();
    ctx.beginPath(); cap2(-30, 250, 86, -70, 420, 96); ctx.fillStyle = '#efe2cf'; ctx.fill();
    ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(150,120,100,.4)'; ctx.lineWidth = 3; for (let i = -6; i < 8; i++) { ctx.beginPath(); ctx.moveTo(-160 + i * 22, 200); ctx.lineTo(-120 + i * 22, 470); ctx.stroke(); } ctx.restore();
    ctx.strokeStyle = 'rgba(160,90,70,.45)'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(-58, 168); ctx.quadraticCurveTo(0, 186, 62, 160); ctx.stroke();   // the chubby wrist fold
    ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(0, -6, 92, 104, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-46, 52, 52, 58, -.4, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(44, 62, 46, 46, .3, 0, TAU); ctx.fill();
    // palm creases
    ctx.strokeStyle = 'rgba(165,95,72,.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-70, -10); ctx.quadraticCurveTo(-10, -2, 66, -34); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-64, 30); ctx.quadraticCurveTo(-30, 0, 4, 18); ctx.quadraticCurveTo(28, 40, 70, 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-40, 96); ctx.quadraticCurveTo(-34, 30, -6, -6); ctx.stroke();
    // finger chains: bases on the top edge, curl folds them toward us (projected), k segments
    const F = [{ x: -60, L: [36, 24, 19], r: [17, 15.5, 13.5], d: 0 }, { x: -20, L: [41, 27, 20], r: [17.5, 16, 14], d: .05 }, { x: 20, L: [39, 26, 20], r: [17, 15.5, 13.5], d: .1 }, { x: 57, L: [31, 21, 17], r: [15, 13.5, 12], d: .16 }];
    const seg = F.map((f) => { const c = clamp(close * 1.08 - f.d), th = [c * 1.05, c * 1.35, c * 1.0]; let px = f.x, py = -96, T0 = 0; const P = [[px, py, 0]];
      for (let k = 0; k < 3; k++) { T0 += th[k]; px += (SEED[0] - f.x) * .06 * Math.sin(T0); py -= f.L[k] * Math.cos(T0); P.push([px, py, T0]); } return { f, P }; });
    const drawSeg = (f, P, k) => { ctx.beginPath(); cap2(P[k][0], P[k][1], f.r[k], P[k + 1][0], P[k + 1][1], k < 2 ? f.r[k + 1] : f.r[k] * .9); ctx.fillStyle = shadeOf(P[k + 1][2]); ctx.fill(); };
    // segments that still point up (behind the seed) first
    for (const { f, P } of seg) for (let k = 0; k < 3; k++) if (P[k + 1][2] < Math.PI / 2) drawSeg(f, P, k);
    ctx.restore();
    const sp = toScr(x, y, s, ang, SEED[0], SEED[1]); seedL(sp[0], sp[1]);
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s * (1 + b), s * (1 - b));
    // folded segments (over the seed, toward us), with nails on the backs of the tips
    for (const { f, P } of seg) for (let k = 0; k < 3; k++) if (P[k + 1][2] >= Math.PI / 2) drawSeg(f, P, k);
    for (const { f, P } of seg) { const th = P[3][2]; if (th > Math.PI * .55) { ctx.save(); ctx.translate(P[3][0], P[3][1] - 4); ctx.fillStyle = 'rgba(255,226,214,.85)'; ctx.beginPath(); ctx.ellipse(0, 0, f.r[2] * .55, f.r[2] * .42, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(190,120,100,.5)'; ctx.lineWidth = 1; ctx.stroke(); ctx.restore(); }
      for (let k = 1; k < 3; k++) { const [px, py] = P[k]; ctx.strokeStyle = 'rgba(160,90,70,.42)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(px - f.r[k] * .7, py); ctx.quadraticCurveTo(px, py + 3, px + f.r[k] * .7, py); ctx.stroke(); } }
    // the thumb tucks in from the lower left
    const tc = clamp(close * 1.1), tx = mix(-104, -62, tc), ty = mix(-30, -40, tc);
    ctx.beginPath(); cap2(-70, 40, 26, -96, -2, 20); cap2(-96, -2, 20, tx, ty, 16); ctx.fillStyle = '#f4ccae'; ctx.fill();
    ctx.fillStyle = 'rgba(255,226,214,.8)'; ctx.beginPath(); ctx.ellipse(tx + 4, ty - 6, 8, 6, -.6, 0, TAU); ctx.fill();
    // warm translucency where the light of the seed passes through thin skin; shade away from it; rim from the key (upper left)
    ctx.save(); ctx.globalCompositeOperation = 'source-atop';
    const tg = ctx.createRadialGradient(SEED[0], SEED[1], 0, SEED[0], SEED[1], 150); tg.addColorStop(0, 'rgba(255,120,70,.8)'); tg.addColorStop(.45, 'rgba(255,150,100,.35)'); tg.addColorStop(1, 'rgba(255,150,100,0)'); ctx.fillStyle = tg; ctx.fillRect(-400, -400, 800, 900);
    const sg = ctx.createLinearGradient(-120, -140, 120, 200); sg.addColorStop(0, 'rgba(255,240,220,.14)'); sg.addColorStop(1, 'rgba(80,36,26,.4)'); ctx.fillStyle = sg; ctx.fillRect(-400, -400, 800, 900);
    ctx.restore();
    ctx.restore();
    return sp;
  }
  const mixC = (a, b, f) => { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16), m = (s) => Math.round(mix((A >> s) & 255, (B >> s) & 255, f)); return `rgb(${m(16)},${m(8)},${m(0)})`; };
  const toScr = (x, y, s, ang, px, py) => [x + (px * Math.cos(ang) - py * Math.sin(ang)) * s, y + (px * Math.sin(ang) + py * Math.cos(ang)) * s];
  function draw417(ctx, t) {
    const k = lin(t417, t418 + .3, t), z = 1 + .07 * sine(k);
    const HX = 905, HY = 700, HS = 2.3, HA = -.42, close = .06 + .66 * E(t417 + .15, 1.3, t);
    const sp = toScr(HX, HY, HS, HA, 2, -50);
    ctx.save(); ctx.translate(sp[0], sp[1]); ctx.scale(z, z); ctx.rotate(-.015 * k); ctx.translate(-sp[0], -sp[1]);
    ctx.drawImage(bg417(), -100 + drift(t, 8, 1), -100 + drift(t, 6, 2));
    // the baby's body under the striped blanket, out of focus, breathing (top of frame)
    const b = breath(t * 2.6, 1); ctx.save(); ctx.translate(960, 40); ctx.scale(1, 1 + .02 * b); ctx.drawImage(chest(), -1100, -520); ctx.restore();
    // thread from the seed out between the fingers to the tag, which sways below right
    const sw = Math.sin(t * 1.9) * .05 + Math.sin(t * .7) * .03, tx = sp[0] + 330 + Math.sin(t * 1.9) * 8, ty = sp[1] + 250;
    babyHand(ctx, HX, HY, HS, HA, close, t, (x, y) => { addGlow(ctx, x, y, 280, .38, AMB, CORE); shareLight(ctx, x, y, 50, t, { mode: 'seed' }); });
    ctx.strokeStyle = 'rgba(240,220,180,.9)'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(sp[0] + 70, sp[1] - 10); ctx.quadraticCurveTo(sp[0] + 230, sp[1] + 60, tx + 8, ty - 22); ctx.stroke();
    tag(ctx, tx, ty - 40, .26 + sw, t, lin(A.name - .05, A.name + .55, t));
    // light leaking out between the fingers
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(sp[0], sp[1], 0, sp[0], sp[1], 230); g.addColorStop(0, rgba('#ffd9a0', .18)); g.addColorStop(1, rgba('#ff9a5c', 0)); ctx.fillStyle = g; ctx.fillRect(sp[0] - 230, sp[1] - 230, 460, 460); ctx.restore();
    ctx.restore();
    motes(ctx, t, [500, 150, 1000, 750], 26, '#ffd9a0', 4, .45, 4);
    vign(ctx, .6, '#0a0506');
  }

  // ================================================================ 4.18 the seed in the soil, the little tree, small feet
  const GY = 640, SX = 900;
  const soil = () => once('soil418', () => {
    const [c, g] = canvas(W + 200, H - GY + 120), r = prng(77), n = vnoise(12);
    const lg = g.createLinearGradient(0, 0, 0, c.height); lg.addColorStop(0, '#3b291f'); lg.addColorStop(1, '#140c08'); g.fillStyle = lg; g.fillRect(0, 0, c.width, c.height);
    for (let i = 0; i < 7; i++) { g.strokeStyle = `rgba(${90 + r() * 40},${64 + r() * 30},${44 + r() * 20},.25)`; g.lineWidth = 2 + r() * 5; g.beginPath(); const y = 60 + i * 60 + r() * 30; for (let x = 0; x <= c.width; x += 30) g.lineTo(x, y + 14 * (n(x * .004, i) - .5)); g.stroke(); }
    for (let i = 0; i < 4200; i++) { const x = r() * c.width, y = r() * c.height, s = .6 + r() * 2.6; g.fillStyle = r() < .55 ? `rgba(130,96,66,${.15 + r() * .35})` : `rgba(8,5,3,${.3 + r() * .4})`; g.beginPath(); g.ellipse(x, y, s * 1.3, s, r() * 3, 0, TAU); g.fill(); }
    for (let i = 0; i < 26; i++) { const x = r() * c.width, y = 40 + r() * (c.height - 60), s = 6 + r() * 16; const sg = g.createRadialGradient(x - s * .3, y - s * .3, 0, x, y, s); sg.addColorStop(0, '#7a6a5a'); sg.addColorStop(1, '#2a2018'); g.fillStyle = sg; g.beginPath(); g.ellipse(x, y, s * 1.3, s, r() * 3, 0, TAU); g.fill(); }
    // top edge: crumbly line with a lit crest
    g.fillStyle = '#5d4232'; g.beginPath(); g.moveTo(0, 0); for (let x = 0; x <= c.width; x += 8) g.lineTo(x, 4 + 5 * n(x * .02, 1)); g.lineTo(c.width, 0); g.closePath(); g.fill();
    g.fillStyle = 'rgba(244,180,124,.45)'; for (let x = 0; x <= c.width; x += 3) g.fillRect(x, 2 + 5 * n(x * .02, 1), 3, 1.4);
    return c;
  });
  const feetL = () => once('feetL', () => canvas(600, 620));
  const growAt = (t) => { const a = lin(A.walk - .5, A.grEnd + .2, t), b = lin(A.grEnd + .2, t501 + .4, t); return .05 + .36 * sine(a) + .08 * b; };
  const camY418 = (t) => 0;   // the camera rises to the top shoot before the slide
  // the top shoot carrier (4.18 → 5.01): own track, screen space
  const shootKeys = (sheet) => track([{ dt: -1.1, x: SX, y: GY + 2 - 600 * 1.4 * growAt(t501 - 1.1) + 20, s: 1.3 }, { dt: -d418 / 2, x: 960, y: 360, s: 2.4 }, { dt: d418 / 2, x: sheet.x, y: sheet.y + 18, s: 1.25 }], t501);
  const sheetAt = () => once('sheetpos', () => { const [c, g] = canvas(8, 8); const P = planSheet(g, 960, 560, 1.75, 0, { a: 0 }); return P.emblem(1); });
  function draw418(ctx, t) {
    const cy = camY418(t), lift = cy * 560, k = lin(t418, t501, t);
    // dawn field above the ground (the camera sits low at the cut face of the field)
    ctx.save(); ctx.translate(0, lift);
    field(ctx, t, { cam: { x: 40 * k, y: -230 + cy * 60, z: 1 }, mist: .65, light: 'dawn' });
    ctx.restore();
    // the cut face of the soil
    ctx.save(); ctx.translate(0, lift); ctx.drawImage(soil(), -100 + drift(t, 4, 1), GY - 6);
    const sy = GY + 190, crack = E(A.by + .05, .5, t), root = lin(A.by + .2, A.grEnd, t);
    // roots probing down and out
    if (root > 0) { ctx.save(); ctx.lineCap = 'round'; const r = prng(5);
      for (let i = 0; i < 7; i++) { const a0 = Math.PI / 2 + (i - 3) * .32, L = (120 + r() * 160) * clamp(root * 1.4 - i * .08); if (L <= 0) continue; ctx.strokeStyle = rgba('#e9dcc0', .75 - i * .05); ctx.lineWidth = 3 - i * .25;
        ctx.beginPath(); ctx.moveTo(SX, sy + 10); let x = SX, y = sy + 10, a = a0; for (let s = 0; s < L; s += 8) { a += Math.sin(s * .05 + i) * .12; x += Math.cos(a) * 8; y += Math.sin(a) * 8; ctx.lineTo(x, y); } ctx.stroke(); }
      ctx.restore(); }
    // the seed and its cracked shell
    shareLight(ctx, SX, sy, 20, t, { mode: 'seed', shadow: true, a: 1 - .5 * root });
    if (crack > 0) { ctx.strokeStyle = 'rgba(40,20,10,.9)'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(SX - 4, sy - 18); ctx.lineTo(SX + 3, sy - 6 * crack); ctx.lineTo(SX - 2, sy + 6 * crack); ctx.stroke(); addGlow(ctx, SX, sy, 60, .5 * crack * (1 - root), AMB, CORE); }
    // the stem from the seed to the surface (below ground)
    const g = growAt(t), up = lin(A.by + .45, A.walk, t);
    if (up > 0) { ctx.strokeStyle = '#a7c46e'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(SX, sy - 14); ctx.quadraticCurveTo(SX + 8, mix(sy, GY, .5), SX, mix(sy - 14, GY + 2, up)); ctx.stroke(); }
    ctx.restore();
    // above ground: the shoot grows into a little tree (time-lapse), lit from the low sun
    ctx.save(); ctx.translate(0, lift);
    let T0 = null; if (up >= 1) T0 = tree(ctx, SX, GY + 2, 1.4, t, { grow: g, seed: 7, light: '#ffcf8a', lightDir: [.7, -.7], wind: .6, leafTone: .2, nFruit: 0 });
    // the leaf that unfolds on "growing"
    const lu = E(A.growing - .05, .9, t);
    if (lu > 0 && T0) { const lx = T0.top.x + 18, ly = T0.top.y + 26; ctx.save(); ctx.translate(lx, ly); ctx.rotate(-.9 + .6 * lu); ctx.scale(lu * 1.4, lu * 1.4 * (0.35 + .65 * lu));
      const lg2 = ctx.createLinearGradient(0, -12, 46, 12); lg2.addColorStop(0, '#d9f2a0'); lg2.addColorStop(1, '#6fae5a'); ctx.fillStyle = lg2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(22, -20, 50, 0); ctx.quadraticCurveTo(22, 18, 0, 0); ctx.fill();
      ctx.strokeStyle = 'rgba(60,90,40,.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(48, 0); ctx.stroke(); ctx.restore(); addGlow(ctx, lx + 30, ly - 10, 70, .25 * lu * (1 - lin(A.growing + 1, A.growing + 2, t)), '#d9f2a0', '#ffffff'); }
    // the small feet toddle in from the right on "walk"
    const fw = lin(A.walk - .15, A.walk + 1.3, t);
    if (fw > 0) { // toddler feet, legs fading up into the dawn haze (a ground-level macro)
      const x = mix(2300, 1330, eout(fw)), ph = fw * 3, [fc, fg] = feetL();
      fg.setTransform(1, 0, 0, 1, 0, 0); fg.globalCompositeOperation = 'source-over'; fg.clearRect(0, 0, fc.width, fc.height);
      smallFeetSide(fg, 300, 560, 1.0, { t, dir: -1, step: fw < 1 ? [Math.max(0, Math.sin(ph * Math.PI)), Math.max(0, -Math.sin(ph * Math.PI))] : [0, 0], light: { x: 300 + 500, y: 560 - 400 }, soil: false });
      fg.setTransform(1, 0, 0, 1, 0, 0); fg.globalCompositeOperation = 'destination-in'; const mg = fg.createLinearGradient(0, 160, 0, 400); mg.addColorStop(0, 'rgba(0,0,0,0)'); mg.addColorStop(1, 'rgba(0,0,0,1)'); fg.fillStyle = mg; fg.fillRect(0, 0, fc.width, fc.height);
      ctx.drawImage(fc, x - 300, GY + 6 - 560); addGlow(ctx, x - 10, GY - 330, 220, .25, '#ffd9b0', '#fff4e6'); }
    ctx.restore();
    // the top shoot: stays while the field slides up (carrier into 5.01)
    if (t > t501 - 1.1) { const P = shootKeys(sheetAt())(t), e = slideE(t501, d418, t); drawCarrier(ctx, 'sprout', P.x, P.y + e * H, P.s, 0, t, { a: E(t501 - 1.1, .3, t) }); }
    motes(ctx, t, [0, 200, W, 420], 30, '#ffe2b8', 12, .35, 5);
    vign(ctx, .45);
  }

  // ================================================================ 5.01 Step two: grow
  function draw501(ctx, t) {
    const e = t < t501 + d418 / 2 + .01 ? slideE(t501, d418, t) : 1, bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#1e4a3a'); bg.addColorStop(1, '#0d241c'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    addGlow(ctx, 700, 300, 900, .22, '#e9c46a', '#fff1d6');
    const hiU = lin(A.grow - .05, A.grow + .5, t), z = 1 + .04 * lin(t501, t504, t);
    ctx.save(); ctx.translate(960, 560); ctx.scale(z, z); ctx.translate(-960, -560);
    const P = planSheet(ctx, 960, 560, 1.75, t, { u: 1, hi: 1, hiU, dim: [.55, 0, .55], light: [600, 200] });
    const em = P.emblem(1);
    ctx.restore();
    // the real shoot settles into the emblem (carrier), presses in on "grow" (foil), then a real shoot lifts out again
    const cs = shootKeys(sheetAt())(t), sink = E(A.grow - .05, .35, t), rise = E(A.grow + .55, .6, t);
    const ex = (em.x - 960) * z + 960, ey = (em.y - 560) * z + 560;
    if (sink < 1) drawCarrier(ctx, 'sprout', t < t501 + d418 / 2 ? cs.x : ex, (t < t501 + d418 / 2 ? cs.y - (1 - e) * H : ey + 18), cs.s * (1 - .2 * sink), 0, t, { a: 1 - sink });
    if (hiU > 0 && hiU < 1) addGlow(ctx, ex, ey, 140, .6 * Math.sin(hiU * Math.PI), AMB, CORE);
    if (rise > 0) { const yy = ey + 18 - rise * 120; drawCarrier(ctx, 'sprout', ex, yy, 1.25 + rise * .6, 0, t, { a: rise }); }
    vign(ctx, .5);
  }
  const shootOut = () => { const em = sheetAt(); const z = 1 + .04; return [(em.x - 960) * z + 960, (em.y - 560) * z + 560 + 18 - 120 - 20]; };

  // ================================================================ 5.04 the fund pays a slice to every person, every year
  const FUND = [620, 900];
  const YEARS = [A.fund + .1, A.every + .1, A.fixed + .25, A.year];
  const HANDS = Array.from({ length: 10 }, (_, i) => { const q = i / 9, d = Math.pow(q, .75); return { x: mix(1130, 1790, d), y: mix(1060, 610, d), s: mix(1.5, .32, d), skin: SKINS[(i * 3) % 6], sleeve: ['#e8a3a0', '#5fe0a8', '#e9c46a', '#9fb6cf', '#c4512e'][i % 5] }; });
  const fog504 = () => once('fog504', () => { const [c, g] = canvas(W, H); const fl = g.createLinearGradient(0, 760, 0, H); fl.addColorStop(0, 'rgba(10,30,22,0)'); fl.addColorStop(1, 'rgba(6,18,14,.75)'); g.fillStyle = fl; g.fillRect(0, 700, W, 380);
    artFog(g, { y0: 420, y1: 980, col: '#9fbf7a', a: .22, seed: 6, cover: .5, x0: 900, x1: W }); artFog(g, { y0: 120, y1: 520, col: '#e9c46a', a: .12, seed: 8, cover: .45 }); return c; });
  const palm = (h) => [h.x - 40 * h.s, h.y - 120 * h.s];
  function draw504(ctx, t) {
    const bg = ctx.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#24543f'); bg.addColorStop(1, '#0c1f18'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    addGlow(ctx, 640, 380, 820, .3, '#e9c46a', '#fff1d6');
    ctx.drawImage(fog504(), 0, 0);
    // depth haze toward the far hands
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const hz = ctx.createLinearGradient(1100, 0, 1920, 0); hz.addColorStop(0, 'rgba(183,194,90,0)'); hz.addColorStop(1, 'rgba(183,194,90,.12)'); ctx.fillStyle = hz; ctx.fillRect(1000, 300, 920, 600); ctx.restore();
    const z = 1 + .035 * lin(t504, t505, t); ctx.save(); ctx.translate(800, 600); ctx.scale(z, z); ctx.translate(-800, -600);
    // the fund, the young tree inside (a ring glows up the trunk each year), the coupon sheet at the plinth
    glassFund(ctx, FUND[0], FUND[1], 1.2, t, { fill: .12, seal: 1, label: 'fund', glow: .5, inner: (g, box) => tree(g, box.x + box.w / 2, box.y + box.h - 4, box.h * .9 / (600 * .64), t, { grow: .64, seed: 7, pulse: YEARS, fruit: .4, nFruit: 4, light: '#ffcf8a', leafTone: .3 }) });
    const gone = YEARS.map((y) => lin(y + .2, y + .6, t));
    const SH = couponSheet(ctx, FUND[0], FUND[1] + 62, .5, t, { rows: 4, cols: 10, gone: gone.slice().reverse(), glow: .2 });
    // the hands (back to front), each catching the same coupon every year
    for (let i = HANDS.length - 1; i >= 0; i--) { const h = HANDS[i], dip = YEARS.reduce((m, y) => m + Math.exp(-Math.pow((t - (y + 1.15 + i * .05)) / .12, 2)), 0);
      hand(ctx, h.x, h.y + dip * 8 * h.s, h.s * 1.25, { pose: 'cup', ang: -1.95, flip: false, skin: h.skin, sleeve: h.sleeve, rim: '#ffe2a8', light: [-.8, -.6], t: t + i, seed: i }); }
    // flying coupons: row r tears at YEARS[r], its 10 coupons fly to the 10 palms, they stay there (stack)
    for (let yI = 0; yI < 4; yI++) {
      const row = 3 - yI;
      for (let i = 0; i < 10; i++) {
        const t0 = YEARS[yI] + .45 + i * .05, u = clamp((t - t0) / .75); if (u <= 0) continue;
        const cell = SH.cell(row, i), h = HANDS[i], [px, py] = palm(h);
        const f = flight({ x: cell.x, y: cell.y, s: .5 * .96, rot: 0 }, { x: px, y: py - yI * 3 * h.s, s: h.s * .62, rot: -.25 }, u, { arc: 140 + i * 12, seed: i + yI });
        // the last year: one coupon (the nearest hand's) flies at the camera instead and turns over
        if (yI === 3 && i === 0) continue;
        coupon(ctx, f.x, f.y, 120 * f.s, t, { n: row * 10 + i + 1, rot: f.rot, turn: f.turn, glow: u < 1 ? .5 : .15, lift: (1 - u) * 20 });
      }
    }
    ctx.restore();
    // the coupon at the camera: its back is the front page of 5.05
    const cu = lin(A.year + .55, t505 + .25, t);
    if (cu > 0) { const c0 = SH.cell(0, 0), e = Math.pow(cu, 1.7), x = mix(c0.x, 960, e), y = mix(c0.y, 540, e) - Math.sin(cu * Math.PI) * 220, w = mix(70, 1500, Math.pow(cu, 2.4));
      coupon(ctx, x, y, w, t, { n: 31, rot: mix(0, -.06, e) + Math.sin(cu * 6) * .1 * (1 - cu), turn: clamp(cu * 1.2), glow: .3 }); }
    vign(ctx, .5);
  }

  // ================================================================ 5.05 ★ the headline, the tree doubles
  const page = () => once('page505', () => {
    const [c, g] = canvas(W + 200, H + 200), r = prng(61); g.translate(100, 100);
    const pg = g.createLinearGradient(0, 0, W, H); pg.addColorStop(0, '#efe7d2'); pg.addColorStop(1, '#ddd0b2'); g.fillStyle = pg; g.fillRect(-100, -100, W + 200, H + 200);
    for (let i = 0; i < 9000; i++) { g.fillStyle = r() < .5 ? 'rgba(110,90,60,.06)' : 'rgba(255,255,255,.1)'; g.fillRect(r() * W, r() * H, 1 + r() * 2, .6); }
    // masthead: rules, two rosettes, LATE EDITION (no brand)
    g.fillStyle = 'rgba(25,25,35,.9)'; g.fillRect(90, 64, W - 180, 4); g.fillRect(90, 74, W - 180, 1.2); g.fillRect(90, 176, W - 180, 1.2); g.fillRect(90, 182, W - 180, 4);
    for (const x of [190, W - 190]) { g.strokeStyle = 'rgba(31,42,58,.6)'; g.lineWidth = .8; for (let k = 0; k < 10; k++) { g.beginPath(); for (let i = 0; i <= 200; i++) { const a = i / 200 * TAU, rr = 40 * (.62 + .3 * Math.sin(7 * a + k * .09) * Math.cos(2 * a - k)); i ? g.lineTo(x + Math.cos(a) * rr, 125 + Math.sin(a) * rr) : g.moveTo(x + Math.cos(a) * rr, 125 + Math.sin(a) * rr); } g.closePath(); g.stroke(); } }
    g.strokeStyle = 'rgba(31,42,58,.45)'; for (let k = 0; k < 5; k++) { g.beginPath(); for (let x = 260; x <= W - 260; x += 4) g.lineTo(x, 125 + Math.sin(x * .035 + k * 1.2) * 18 * Math.cos(x * .004 + k)); g.stroke(); }
    g.fillStyle = '#efe7d2'; g.fillRect(W / 2 - 180, 100, 360, 50); g.font = '600 22px "Inter"'; try { g.letterSpacing = '9px'; } catch { } g.fillStyle = 'rgba(25,25,35,.85)'; g.textAlign = 'center'; g.fillText('LATE EDITION', W / 2, 134);
    // article columns (unreadable grey lines), below the headline zone
    g.textAlign = 'left'; for (let col = 0; col < 3; col++) for (let ln = 0; ln < 22; ln++) { const x = 100 + col * 360, y = 700 + ln * 14; if (y > 1010) break; g.fillStyle = 'rgba(40,40,50,.28)'; g.fillRect(x, y, (ln % 6 === 5 ? 150 : 310) - r() * 20, 4); }
    g.fillStyle = 'rgba(40,40,50,.55)'; g.fillRect(100, 660, 700, 9);
    return c;
  });
  // the engraved glass vessel for the newspaper vignette (ink lines, not the colour fund)
  function inkFund(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = 'rgba(31,42,58,.85)'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(-150, 0); ctx.lineTo(-150, -330); ctx.quadraticCurveTo(-150, -370, -110, -372); ctx.lineTo(110, -372); ctx.quadraticCurveTo(150, -370, 150, -330); ctx.lineTo(150, 0); ctx.stroke();
    ctx.lineWidth = .7; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(-138 + i * 3, -20); ctx.lineTo(-138 + i * 3, -340); ctx.globalAlpha = .5 - i * .05; ctx.stroke(); } ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(31,42,58,.85)'; ctx.fillRect(-176, 0, 352, 16); ctx.lineWidth = 1; ctx.strokeRect(-186, 16, 372, 26);
    for (let i = -180; i < 180; i += 5) { ctx.beginPath(); ctx.moveTo(i, 18); ctx.lineTo(i + 4, 40); ctx.stroke(); }
    ctx.restore();
  }
  const VC = [1480, 560], VR = [300, 350];
  function draw505(ctx, t) {
    const fall = expoIn(lin(A.hlEnd - .35, t513 + .2, t));      // the camera starts to fall before the whip
    const z = 1.0 + .02 * lin(t505, t513, t);
    ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.rotate(-.012); ctx.translate(-960, -540 - fall * 260);
    ctx.drawImage(page(), -100, -100);
    // the vignette: engraved oval frame, glass fund, tree (ink), coupons at the plinth
    const dbl = A.doubles + .02;
    ctx.save(); ctx.beginPath(); ctx.ellipse(VC[0], VC[1], VR[0], VR[1], 0, 0, TAU); ctx.fillStyle = '#e7dcc2'; ctx.fill(); ctx.restore();
    ring(ctx, VC[0], VC[1], VR[0] + 8, VR[1] + 8, { lines: 7, band: 14, wave: 24, col: '#1f2a3a', glow: null, op: 'source-over', a: .7, lw: .7 });
    inkFund(ctx, VC[0], VC[1] + 262, .95, t);
    const jolt = clamp((t - dbl) / .5);
    tree(ctx, VC[0], VC[1] + 248, .62, t, { grow: .7, seed: 7, doubleAt: dbl, dbl: 2, ink: '#1f2a3a', fruit: .6, nFruit: 5, shake: 1 });
    couponSheet(ctx, VC[0], VC[1] + 318, .42, t, { rows: 1, cols: 6, big: pop(lin(dbl + .08, dbl + .6, t)) });
    // the flash of the doubling
    if (t > dbl) { const f = Math.exp(-(t - dbl) * 3.2); ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, VC[0], VC[1] - 100, 520, .45 * f, AMB, CORE); ctx.restore(); }
    // the headline, word by word, each word flashes as it lands
    const lines = [[0, 1], [2, 3, 4]], X0 = 110, Y0 = [392, 560];
    ctx.font = '168px "Instrument Serif"'; const sp = ctx.measureText(' ').width;
    lines.forEach((ln, li) => { let x = X0; for (const wi of ln) { const w = HL[wi]; if (!w) continue; const s = w.w.replace(/["“”.]/g, ''), u = lin(w.s - .04, w.s + .22, t);
      ctx.font = '168px "Instrument Serif"'; const ww = ctx.measureText(s).width;
      if (u > 0) { const k = pop(u); ctx.save(); ctx.translate(x, Y0[li]); ctx.scale(.94 + .06 * k, .94 + .06 * k); ctx.globalAlpha = clamp(u * 3);
        text(ctx, s, 0, 0, { size: 168, font: 'Instrument Serif', color: '#151822' });
        const fl = Math.exp(-Math.max(0, t - w.s - .05) * 5); if (fl > .02) { ctx.globalCompositeOperation = 'lighter'; text(ctx, s, 0, 0, { size: 168, font: 'Instrument Serif', color: rgba('#ffb35c', .8 * fl) }); }
        ctx.restore(); }
      x += ww + sp; } });
    // the foil glint runs once over the whole headline when it is complete
    { const gu = lin(HL[HL.length - 1].s + .25, HL[HL.length - 1].s + 1.05, t); if (gu > 0 && gu < 1) { const pp = new Path2D(); pp.rect(X0 - 20, Y0[0] - 150, 1200, Y0[1] - Y0[0] + 190); ctx.save(); ctx.globalAlpha = .55; foilGlint(ctx, pp, 0, { x: X0 - 300 + gu * 1500 / 1.6 * 1.6, y: 470, span: 0, width: 160, a: .9 }); ctx.restore(); } }
    ctx.restore();
    // rain streaks begin as the camera falls (the match into 5.13)
    if (fall > 0) rain(ctx, t, { L: () => fall * .8, n: 300, seed: 3 });
    vign(ctx, .4);
  }

  // ================================================================ 5.13 / 5.14 the crossing in the rain
  const PEOPLE = [{ x: 1500, y: 1470, s: 5.6, c: '#2a3350', a: '#c8843a', seed: 1 }, { x: 330, y: 1300, s: 3.6, c: '#33304a', a: '#5fe0a8', seed: 2 }, { x: 720, y: 1250, s: 3.2, c: '#2a2f3c', a: '#e8a3a0', seed: 3 },
    { x: 1030, y: 1260, s: 3.0, c: '#3a3046', a: '#e9c46a', seed: 4 }];
  const cam513 = (t) => { const u = sine(lin(t513, t506, t)); return { x: mix(-30, 60, u), y: mix(30, 0, u), z: mix(1.0, 1.08, u) }; };
  const PH = [1318, 650];   // the near phone (over the shoulder)
  function phoneScreen(warmU, swipe, back, foil, t) {
    return (g, w, h) => {
      g.fillStyle = '#0b0e18'; g.fillRect(0, 0, w, h);
      const card = (dx, a, withFoil) => { g.save(); g.globalAlpha = a; g.translate(dx, 0); g.fillStyle = '#f2efe6'; g.beginPath(); g.roundRect(10, 60, w - 20, 150, 12); g.fill();
        g.fillStyle = '#151822'; g.font = '25px "Instrument Serif"'; g.fillText('AI company', 22, 100); g.fillText('doubles its value', 22, 128);
        g.strokeStyle = '#c4512e'; g.lineWidth = 3; g.beginPath(); g.moveTo(24, 190); g.lineTo(60, 184); g.lineTo(90, 180); g.lineTo(110, 162); g.lineTo(128, 140); g.stroke();
        if (withFoil > 0) { g.fillStyle = '#e9c46a'; g.font = '600 13px "Inter"'; try { g.letterSpacing = '2px'; } catch { } g.save(); g.beginPath(); g.rect(14, 214, (w - 28) * withFoil, 40); g.clip();
          g.fillStyle = '#2a1a08'; g.beginPath(); g.roundRect(14, 218, w - 28, 34, 8); g.fill(); const fg = g.createLinearGradient(14, 0, w - 14, 0); fg.addColorStop(0, '#c87a2c'); fg.addColorStop(.5, '#ffe2a8'); fg.addColorStop(1, '#c87a2c'); g.fillStyle = fg; g.fillText('YOUR SHARE ↑', 26, 241); g.restore(); try { g.letterSpacing = '0px'; } catch { } }
        g.restore(); };
      if (back < 1) card(-swipe * w * 1.1, 1 - back, 0);
      if (back > 0) card((1 - back) * w * 1.1, back, foil);
      if (warmU > 0) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = rgba('#ffb35c', .12 * warmU); g.fillRect(0, 0, w, h); g.restore(); }
    };
  }
  function draw513(ctx, t) {
    const cam = cam513(t), board = .8 + .2 * E(A.left - .1, .4, t), warm = E(A.raise - .05, .9, t);
    const st = street(ctx, t, { cam, board, ped: 'red', warm });
    ripples(ctx, t, { box: [260, 640, 900, 200], n: 28, col: SODIUM, a: .8 });
    rain(ctx, t, { L: st.L, n: 520, seed: 1, warm: warm > .5 ? 1 : 0 });
    // the waiting people: shoulders pulled up on "left behind", in shadow; phones glow (cool → warm on "raise")
    const shUp = E(A.left - .05, .6, t) * (1 - E(A.raise, .8, t)), glowCol = warm > .3 ? '#ffb35c' : '#cfe0ff';
    ctx.save(); ctx.translate(960, 540); ctx.scale(cam.z, cam.z); ctx.translate(-960 - cam.x * 1.25, -540 - cam.y * 1.25);
    for (let i = PEOPLE.length - 1; i >= 1; i--) { const P = PEOPLE[i];
      const r = backFig(ctx, P.x, P.y, P.s, { t, seed: P.seed, dress: { coat: P.c }, accent: P.a, shUp, light: { x: 1400, y: 200, col: '#cfdcff', a: .7 - warm * .3 }, light2: { x: 300, y: 80, col: warm > .3 ? AMB : SODIUM, a: .45 + .45 * warm }, glow: { col: glowCol, a: .55 + .4 * warm }, shade: .25 * (1 - warm) });
      // a small display peeks past the right shoulder: the same headline card (then the foil line)
      const [px, py] = r.phone, sw = 13 * P.s, shh = 22 * P.s; ctx.save(); ctx.translate(px + 10 * P.s, py - 6 * P.s); ctx.rotate(.25);
      ctx.fillStyle = '#0b0e18'; ctx.fillRect(-sw / 2, -shh / 2, sw, shh); const back = E(A.withA + .1 + i * .08, .5, t), sc = lin(A.scroll + i * .1, A.scroll + .35 + i * .1, t);
      ctx.fillStyle = rgba('#f2efe6', (1 - sc) * (1 - back) + back); ctx.fillRect(-sw / 2 + 1.5 - sc * sw * (1 - back), -shh / 2 + 5, sw - 3, shh * .42);
      if (back > 0) { ctx.fillStyle = rgba('#e9c46a', back * E(A.win, .5, t)); ctx.fillRect(-sw / 2 + 1.5, -shh / 2 + 5 + shh * .48, sw - 3, shh * .14); }
      addGlow(ctx, 0, 0, sw * 1.6, .3, glowCol, '#ffffff'); ctx.restore(); }
    ctx.restore();
    // the near person (over the shoulder) and their phone: the thumb swipes the headline away ("scroll past"); it returns with the foil line
    const P = PEOPLE[0];
    ctx.save(); ctx.translate(960, 540); ctx.scale(cam.z, cam.z); ctx.translate(-960 - cam.x * 1.6, -540 - cam.y * 1.6);
    const swipe = expo(lin(A.scroll + .05, A.scroll + .5, t)), back = E(A.withA + .05, .6, t), foil = lin(A.win - .1, A.win + .7, t);
    const ph = heldPhone(ctx, PH[0], PH[1], .8, { t, pitch: .3, ang: -.16, skin: '#a8734f', lit: 1, warm: .4 + warm * .6, rim: SODIUM, rimA: .35, screen: phoneScreen(warm, swipe, back, foil, t) });
    if (foil > 0 && foil < 1.2) { const [fx, fy] = ph.map(-40 + 120 * clamp(foil), 50); addGlow(ctx, fx, fy, 40, .5, AMB, CORE); }
    backFig(ctx, P.x, P.y, P.s, { t, seed: P.seed, dress: { coat: P.c }, accent: P.a, shUp, hold: 'phone', light: { x: 1500, y: 150, col: '#cfdcff', a: .6 }, light2: { x: 300, y: 80, col: warm > .3 ? AMB : SODIUM, a: .5 + .4 * warm }, glow: { col: warm > .3 ? AMB : '#cfe0ff', a: .5 + .4 * warm }, shade: .3 * (1 - warm) });
    ctx.restore();
    if (warm > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(PH[0], PH[1], 0, PH[0], PH[1], 1500); g.addColorStop(0, rgba('#ffb35c', .26 * warm)); g.addColorStop(.6, rgba('#ff9a3c', .1 * warm)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const fl = Math.exp(-Math.max(0, t - A.raise - .05) * 2.5) * warm; if (fl > .02) { ctx.fillStyle = rgba('#ffd9a0', .12 * fl); ctx.fillRect(0, 0, W, H); } ctx.restore(); }
    rain(ctx, t, { L: () => .5, n: 60, seed: 7, near: 1, a: .5 });
    vign(ctx, .55);
  }
  const display513 = (t) => { const cam = cam513(t); return [(PH[0] - 960 - cam.x * 1.6) * cam.z + 960, (PH[1] - 540 - cam.y * 1.6) * cam.z + 540 - 20]; };

  // ================================================================ 5.06 ▲ Automatically: the line engraves itself on the wet display
  const drops = () => once('drops506', () => { const r = prng(5); return Array.from({ length: 22 }, () => ({ x: r() * W, y0: r() * H, r: 10 + r() * 26, v: 60 + r() * 220, ph: r() })); });
  function draw506(ctx, t) {
    const k = lin(t506, t515, t), z = 1 + .05 * k;
    ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
    const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#141826'); bg.addColorStop(1, '#0a0c14'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    // the card (top) and the foil line that engraves itself, left to right, with a burin point
    ctx.fillStyle = '#f2efe6'; ctx.beginPath(); ctx.roundRect(160, -200, 1600, 560, 40); ctx.fill();
    text(ctx, 'AI company doubles its value', 240, 180, { size: 92, font: 'Instrument Serif', color: '#151822' });
    const u = lin(A.auto - .05, A.autoE - .05, t);
    ctx.fillStyle = '#2a1a08'; ctx.beginPath(); ctx.roundRect(160, 440, 1600, 230, 34); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.rect(160, 430, 1600 * u + 40, 260); ctx.clip();
    const fg = ctx.createLinearGradient(200, 0, 1700, 0); fg.addColorStop(0, '#c87a2c'); fg.addColorStop(.5, '#ffe2a8'); fg.addColorStop(1, '#c87a2c');
    ctx.font = '600 120px "Inter"'; try { ctx.letterSpacing = '14px'; } catch { } ctx.fillStyle = fg; ctx.fillText('YOUR SHARE ↑', 260, 600); try { ctx.letterSpacing = '0px'; } catch { }
    ctx.restore();
    if (u > 0 && u < 1) { const bx = 160 + 1600 * u + 20; addGlow(ctx, bx, 560, 90, .8, AMB, CORE); ctx.fillStyle = '#fff8e8'; ctx.beginPath(); ctx.arc(bx, 560, 6, 0, TAU); ctx.fill(); }
    if (u > .6) { const pp = new Path2D(); pp.rect(160, 440, 1600, 230); foilGlint(ctx, pp, t, { x: 300, y: 560, span: 1800, width: 260, speed: .9, phase: -A.autoE * .9 + .2 }); }
    // a glass sheen across the display
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const sh = ctx.createLinearGradient(0, 0, W, H); sh.addColorStop(.25, 'rgba(200,220,255,0)'); sh.addColorStop(.42, 'rgba(200,220,255,.07)'); sh.addColorStop(.5, 'rgba(200,220,255,0)'); ctx.fillStyle = sh; ctx.fillRect(0, 0, W, H); ctx.restore();
    // raindrops on the glass: lenses (dark rim, bright cap, warm refraction of the foil) that roll down and leave wet trails
    for (const d of drops()) { const y = (d.y0 + (t - t506) * d.v) % (H + 100) - 50, x = d.x + Math.sin(y * .01 + d.ph * 9) * 6, r = d.r;
      const tr = ctx.createLinearGradient(x, y - d.v * 1.2, x, y); tr.addColorStop(0, 'rgba(210,225,255,0)'); tr.addColorStop(1, 'rgba(210,225,255,.12)'); ctx.strokeStyle = tr; ctx.lineWidth = r * .55; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y - d.v * 1.2); ctx.lineTo(x, y - r * .5); ctx.stroke();
      ctx.fillStyle = 'rgba(5,6,12,.28)'; ctx.beginPath(); ctx.ellipse(x + r * .12, y + r * .14, r, r * 1.08, 0, 0, TAU); ctx.fill();
      const g = ctx.createRadialGradient(x - r * .25, y - r * .35, 0, x, y, r); g.addColorStop(0, 'rgba(255,255,255,.75)'); g.addColorStop(.18, 'rgba(255,240,220,.25)'); g.addColorStop(.6, rgba(y > 440 && y < 680 ? '#ffb35c' : '#cfe0ff', .16)); g.addColorStop(1, 'rgba(255,255,255,.22)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, r * .94, r, 0, 0, TAU); ctx.fill(); }
    ctx.restore();
    vign(ctx, .55);
  }

  // ================================================================ 5.15 envy turns into cheering
  const HEADS = [{ x: 330, y: 560 + 167 * 5.0, s: 5.0, c: '#2a3350', a: '#c8843a', seed: 1 }, { x: 880, y: 600 + 167 * 4.4, s: 4.4, c: '#33304a', a: '#5fe0a8', seed: 2 }, { x: 1380, y: 590 + 167 * 4.6, s: 4.6, c: '#2a2f3c', a: '#e8a3a0', seed: 3 }, { x: 1830, y: 540 + 167 * 5.1, s: 5.1, c: '#3a3046', a: '#e9c46a', seed: 4 }];
  const OUTPT = [880 + 19 * 4.4, 600 + 167 * 4.4 - 130 * 4.4];
  function draw515(ctx, t) {
    const st = street(ctx, t, { cam: { x: 60 + 30 * lin(t515, R.b, t), y: 90, z: 1.32 }, board: .7, ped: 'red', warm: 1, words: false });
    ctx.fillStyle = 'rgba(8,10,22,.28)'; ctx.fillRect(0, 0, W, H);
    rain(ctx, t, { L: st.L, n: 420, seed: 2, warm: 1 });
    const relax = E(A.envy + .3, .9, t), fist = lin(A.closer, A.cheering + .2, t), nudge = Math.sin(clamp(lin(A.cheering - .2, A.cheering + .7, t)) * Math.PI);
    for (let i = 0; i < HEADS.length; i++) { const P = HEADS[i];
      const r = backFig(ctx, P.x + (i === 2 ? -nudge * 26 : 0) + (i === 1 ? -nudge * 10 : 0), P.y, P.s, { t, seed: P.seed, dress: { coat: P.c }, accent: P.a, shUp: 1 - relax, fist: i === 1 ? eio(fist) : 0, nudge: i === 2 ? nudge : 0,
        light: { x: 1300, y: 100, col: '#ffcf8a', a: .8 }, light2: { x: 300, y: 80, col: SODIUM, a: .5 }, glow: { col: AMB, a: .9 }, shade: .1 });
      if (i !== 1 || fist < .1) { const [px, py] = r.phone, sw = 13 * P.s, shh = 22 * P.s; ctx.save(); ctx.translate(px + 10 * P.s, py - 6 * P.s); ctx.rotate(.25); ctx.fillStyle = '#0b0e18'; ctx.fillRect(-sw / 2, -shh / 2, sw, shh);
        ctx.fillStyle = '#f2efe6'; ctx.fillRect(-sw / 2 + 2, -shh / 2 + 5, sw - 4, shh * .42); ctx.fillStyle = '#e9c46a'; ctx.fillRect(-sw / 2 + 2, -shh / 2 + 5 + shh * .48, sw - 4, shh * .14); addGlow(ctx, 0, 0, sw * 1.8, .35, AMB, CORE); ctx.restore(); }
    }
    // sparks of the share light rise from the phones and speed up into the whip
    const r = prng(71), acc = expoIn(lin(A.cheering + .4, CO.t + .15, t));
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 40; i++) { const P = HEADS[i % 4], t0 = A.envy + .6 + r() * 2.2; if (t < t0) continue; const age = t - t0, x = P.x + 50 + (r() - .5) * 160 + Math.sin(age * 2 + i) * 14, y = P.y - 124 * P.s - age * (60 + r() * 60) - acc * 900;
      const a = clamp(1 - age / 3.5) * .8; if (y < -40 || a <= 0) continue; addGlow(ctx, x, y, 14, a * .6, AMB, CORE); ctx.fillStyle = rgba(CORE, a); ctx.beginPath(); ctx.arc(x, y, 2.2, 0, TAU); ctx.fill(); }
    ctx.restore();
    vign(ctx, .5);
  }

  return [
    { t: t412, tr: CI.into.tr, x: CI.into.x, y: CI.into.y, d: CI.into.d, draw: draw412 },
    { t: t413, tr: 'cut', d: .12, draw: draw413 },
    { t: t415, tr: 'zoom', d: .6, depth: 3, ...(() => { const c = camAt(t415); const [x, y] = project(c, -100.5, 28.6); return { x, y }; })(), draw: draw415 },
    { t: t416, tr: 'whipR', d: .35, draw: draw416 },
    { t: t417, tr: 'zoom', d: .6, depth: 4, x: vigX(1, t417), y: VY + 40, draw: draw417 },
    { t: t418, tr: 'zoom', d: .6, depth: 4, ...(() => { const [x, y] = toScr(905, 700, 2.3, -.42, 2, -50); return { x, y }; })(), draw: draw418, sound: [{ f: 'swell', t: A.grEnd + .1, v: .2 }] },
    { t: t501, tr: 'down', d: d418, draw: draw501, sound: [{ f: 'foil_glint', t: T.E('05a', 'grow') + .03, v: .3 }] },
    { t: t504, tr: 'zoom', d: .6, depth: 4, x: shootOut()[0], y: shootOut()[1], draw: draw504 },
    { t: t505, tr: 'zoom', d: .45, depth: 3, x: 960, y: 540, draw: draw505 },
    { t: t513, tr: 'whipU', d: .4, draw: draw513, print: { riso: .25 }, sound: [{ f: 'amb_rain', t: t513 - .05, v: .16, d: R.b - t513 + .1 }] },
    { t: t506, tr: 'zoom', d: .4, depth: 4, x: display513(t506)[0], y: display513(t506)[1], draw: draw506, print: { riso: .25 }, sound: [{ f: 'foil_glint', t: A.autoE + .02, v: .25 }] },
    { t: t515, tr: 'out', d: .5, depth: 4, x: OUTPT[0], y: OUTPT[1], draw: draw515, print: { riso: .25 } },
  ];
};
