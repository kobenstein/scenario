// Film 78 · c01 · HOOK (lead) · 0 → 'So what was in those pages' (59.31 s) · the quality reference for B1 and B2.
// ONE continuous take (one entry) + the seam plate S.plateHook for the last .5 s. Every row of docs/shots.md (H.01–H.19) is a picture
// of its sentence; every change hands over through a carrier (column "carrier"):
//   H.01 the poster (thumbnail C, anchor A1): tower of light, the man at its foot, WHAT DID / ILYA SEE?     carrier: the man
//   H.02 label ILYA SUTSKEVER · CO-FOUNDER, OPENAI; a chat window unfolds out of a tower window            carrier: the chat window
//   H.03 the chat folds back into the tower (OPENAI · THE COMPANY BEHIND CHATGPT); he turns and walks away   carrier: the window block
//   H.04 the window block flies out of the tower and opens into the VIDEO CALL (FRI · NOV 17, 2023); the camera tilts up with it
//   H.05 the boss tile flickers, goes dark, drops out of the grid: FIRED in the empty slot                    carrier: the empty slot
//   H.06 post cards clone out of the slot in a spiral; the camera pulls back over hundreds                   carrier: the cards
//   H.07 ★ the cards swirl inward and become ONE machine ring (the grid is swallowed as its core); THE GUESS; the man rises tiny under it
//   H.08 you (yellow) in the foreground, looking up at the same ring
//   H.09 the ring flattens into a cinema screen; the marquee ARTIFICIAL · US RELEASE DEC 25, 2026 unfolds (text only)
//   H.10 the bulbs go out left → right, the screen dims; the man sinks away; the screen turns into a blank page
//   H.11 the page becomes a court transcript SWORN TESTIMONY · OCT 2025 (Q./A. lines write in), the raised hand, UNDER OATH
//   H.12 the small ring in the page's corner crumbles to dust ("never about a machine")
//   H.13 the page drops onto a pile, pages fall onto it, the counter runs 1 → 52: 52 PAGES; the camera tilts back down
//   H.14 a gold pen line writes BY ILYA SUTSKEVER · H.15 a man's profile prints itself: ABOUT ONE MAN
//   H.16 the pile slides left, the gold LINE draws down the middle, the right half stays empty (?)
//   H.17 the right half fills with working figures, row by row · H.18 one of them is you: you step forward
//   H.19 the figures sink; the man at a lectern rises in a spotlight, sound rings go out → S.plateHook
// Anchors are phrases only. Camera: S.camPath2 keys on phrase times; the stage parallax follows the same camera.
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f78_kit.mjs';
import * as S from '../lib/f78_world.mjs';
const { W, H, P, clamp, lerp, span, sineIO, expoOut, expoIn, rgba, halo, prng } = E;
const { mv, land, rise, GOLD, CREAM } = F;
const TAU = Math.PI * 2;
const lerpR = (a, b, u) => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), w: lerp(a.w, b.w, u), h: lerp(a.h, b.h, u) });
const scaleR = (R, cx, cy, k) => ({ x: cx + (R.x - cx) * k, y: cy + (R.y - cy) * k, w: R.w * k, h: R.h * k });

export default (T, R) => {
  const G = (p, n = 0, a = -1) => T.G(p, n, a);
  // ---------------------------------------------------------------------------------------------- phrase times
  const tTitle = G('What did Ilya see'), tName = G('Ilya Sutskever helped'), tAnswers = G('answers your questions');
  const tWalk = G('Then he walked away'), tWalked = G('walked away'), tOpenAI = G('from OpenAI'), tChat = G('ChatGPT');
  const tFriday = G('It began on a Friday'), tAgo = G('a few years ago'), tCall = G('a video call'), tBoss = G('his own boss'), tHead = G('the head of OpenAI');
  const tFired0 = G('And it was the boss'), tFired = G('fired', 0, tFired0);
  const tSoon = G('Soon, the whole internet'), tAsk = G('what did Ilya see', 0, tSoon);
  const tGuess = G('The guess'), tPowerful = G('so powerful'), tScared = G('scared the man');
  const tIf = G('And if it scared him'), tYou = G('it concerns you');
  const tMovie = G('Now a Hollywood movie'), tRetells = G('retells that story');
  const tBut = G('But the answer'), tInHolly = G('in Hollywood', 0, tBut);
  const tOath = G('It came out under oath'), tUnder = G('under oath');
  const tNever = G('It was never about a machine'), tAMach = G('about a machine', 0, tNever);
  const tCenter = G('At the center'), t52 = G('fifty-two pages');
  const tWrote = G('Ilya had written'), tAbout = G('And they were about a man'), tMan = G('about a man', 0, tAbout);
  const tHalf = G('But that is only half'), tOnlyHalf = G('only half'), tSaw = G('of what Ilya saw');
  const tOther = G('The other half'), tEvery = G('every job'), tYours = G('Yours included');
  const tHid = G('And he never hid it'), tHidW = G('never hid');
  const T0 = G('So what was in those pages'), tPlate = T0 - S.SEAM_HALF;

  // ---------------------------------------------------------------------------------------------- layout (screen / design px)
  const GR = { x: 140, y: 110, w: 1640, h: 740 };                       // the call grid, full
  const RC = { x: 960, y: 400 }, RR = 290;                              // the machine ring (H.07)
  const GROUND = 860;                                                   // the graphic ground line (H.07–H.10)
  const SR = { x: 560, y: 110, w: 800, h: 420 };                        // the cinema screen
  const PR = { x: 610, y: 96, w: 700, h: 760 };                         // the transcript page
  const PG = { x: 760, y: 150, w: 400, h: 520 };                        // the top page of the pile (centre)
  const HP = S.HOOK.pages, HL = S.HOOK.lectern;                         // the plate layout
  const JR = { x: 1050, y: 150, w: 820, h: 680 };                       // the jobs grid (right half)
  const CHAT = { x: 130, y: 250, w: 660, h: 400 };                      // the chat window (design space of the Leitbild)
  const BLOCK = [1, 6, 3, 7];                                           // tower cells that become the call grid (c0, r0, c1, r1)

  // the world camera (Leitbild, H.01–H.04; then only the stage's parallax): a slow push, a pull-back with the walk, the tilt up with
  // the call grid, a long hold, the tilt back down with the falling pages, HOME at the plate
  const WK = [
    [0, { x: 1010, y: 520, s: 1.05 }], [tWalk, { x: 1000, y: 525, s: 1.0 }], [tFriday + .2, { x: 980, y: 530, s: .95 }],
    [tFriday + 2.6, { x: 1080, y: -430, s: .95 }], [tCenter, { x: 1060, y: -380, s: .96 }], [tCenter + 2.8, { x: W / 2, y: H / 2, s: 1 }],
  ];
  const wcam = (t) => { const c = S.camPath2(t, WK), fade = 1 - span(t, tPlate - 3, tPlate); return S.drift2(c, t, .8 * fade, 5); };
  // the graphics camera (screen space after H.04): HOME with a little breathing, small pushes on the hero beats, exactly HOME at the plate
  const GK = [
    [tFriday, { x: W / 2, y: H / 2, s: 1 }], [tCall, { x: W / 2, y: H / 2 - 6, s: 1.02 }], [tFired0, { x: 700, y: 560, s: 1.03 }],
    [tSoon + .4, { x: 700, y: 560, s: 1.03 }], [tGuess, { x: W / 2, y: H / 2, s: 1 }], [tIf, { x: W / 2, y: H / 2 - 10, s: 1.02 }],
    [tYou + .6, { x: W / 2, y: H / 2 + 10, s: .96 }], [tBut + .4, { x: W / 2, y: H / 2, s: .97 }], [tOath, { x: W / 2, y: H / 2, s: 1.03 }],
    [tCenter, { x: W / 2, y: H / 2 - 10, s: 1.04 }], [tWrote + .6, { x: W / 2, y: H / 2, s: 1.06 }], [tHalf, { x: W / 2, y: H / 2, s: 1.04 }],
    [tOnlyHalf + 1.6, { x: W / 2, y: H / 2, s: 1 }], [tPlate, { x: W / 2, y: H / 2, s: 1 }],
  ];
  const gcam = (t) => { const c = S.camPath2(t, GK), fade = 1 - span(t, tPlate - 3, tPlate); return S.drift2(c, t, .6 * fade, 9); };

  // the man's walk (H.03): turns on "walked", walks left away from the light
  const walkX = (t) => 1250 - 270 * sineIO(span(t, tWalked + .15, tFriday + 2.2));
  // the cards (H.06): a golden-angle spiral out of the empty slot
  const N = 230, CARDS = (() => { const r = prng(78), a = []; for (let i = 0; i < N; i++) { const rr = 185 * Math.sqrt(i + 1.5), an = i * 2.39996; a.push({ dx: Math.cos(an) * rr, dy: Math.sin(an) * rr * .62, rot: (r() - .5) * .5, born: tSoon + .1 + 3.1 * Math.pow(i / N, .75), q: r(), end: .92 + .16 * r() }); } return a; })();
  // tile geometry of the call grid (as F.callGrid lays it out)
  const tileRect = (Rg, i) => { const gap = Rg.w * .014, ch = Rg.h * .085, tw = (Rg.w - gap * 4) / 3, th = (Rg.h - ch - gap * 3) / 2, c = i % 3, r = Math.floor(i / 3); return { x: Rg.x + gap + c * (tw + gap), y: Rg.y + ch + gap + r * (th + gap), w: tw, h: th }; };
  const slot0 = tileRect(GR, 3), SLOT = { x: slot0.x + slot0.w / 2, y: slot0.y + slot0.h / 2 };

  const draw = (ctx, t) => {
    const wc = wcam(t);
    S.stage(ctx, t, wc);

    // ===================================================================================== A · the Leitbild (H.01–H.04 start)
    let blockScreen = null;
    if (t < tFriday + 2.8) {
      S.view(ctx, wc);
      const walking = t >= tWalked, mx = walkX(t), dist = 1250 - mx;
      const g = S.leitbild(ctx, t, {
        tower: { glow: 1 - .35 * mv(t, tFriday + .6, 2), name: land(t, tOpenAI - .15, .8), tag: span(t, tChat - .35, tChat + .45), block: BLOCK, cells: 1 },
        man: { x: mx, dir: walking ? -1 : 1, look: walking ? .1 : .55, walk: walking ? dist / 38 : undefined, shadow: 70 + 260 * sineIO(span(t, tWalked, tFriday + 1.5)) },
      });
      // the name label pinned to him (H.02)
      const lu = rise(span(t, tName - .05, tName + .7)) * (1 - expoIn(span(t, tWalked - .2, tWalked + .4)));
      if (lu > 0) F.goldLabel(ctx, mx - 18, S.GY - 222, 'ILYA SUTSKEVER', 'CO-FOUNDER, OPENAI', lu, { dx: -70, dy: -90, size: 32 });
      // the chat window unfolds out of the tower's window block and folds back into it (H.02 → H.03)
      const B0 = g.block, cu = mv(t, tName + .75, 1.5) * (1 - mv(t, tWalk - .1, 1.3));
      if (cu > .002) {
        const r = lerpR(B0, CHAT, cu);
        ctx.save(); ctx.fillStyle = rgba(GOLD.hot, .9 * (1 - span(cu, 0, .35))); ctx.fillRect(r.x, r.y, r.w, r.h); ctx.restore();
        ctx.save(); ctx.globalAlpha *= clamp(cu * 3); F.chatWin(ctx, t, r, { q: span(t, tAnswers - .5, tAnswers + .3), answer: span(t, tAnswers + .2, tWalk + .2), question: 'Can you explain this to me?' }); ctx.restore();
        // a thin light thread from the tower window to the window (where it came from)
        F.goldSpan(ctx, [[B0.x + B0.w / 2, B0.y + B0.h / 2], [r.x + r.w, r.y + r.h * .5]], 0, 1, { w: 1, spark: false, a: .5 * cu });
      }
      blockScreen = S.rectToScreen(wc, g.block);
    }
    // the title (H.01): screen space, left; rises on the question, sinks when the name comes
    const tu = span(t, tTitle - .45, tTitle + .9), tout = span(t, tName - .25, tName + .75);
    if (tu > 0 && tout < 1) { ctx.setTransform(1, 0, 0, 1, 0, 0); F.title(ctx, t, tu, { out: tout, x: 110, y: 300 }); }

    // ===================================================================================== B..D · the call grid, FIRED, the cards
    const gc = gcam(t);
    const mG = mv(t, tFriday + .25, 2.2);                                                    // the block flies out → the full grid
    const swirl = mv(t, tGuess - .25, 1.9);                                                  // H.07: cards → ring
    const kPull = lerp(1, .3, mv(t, tSoon - .1, 3.9));                                       // H.06: the pull-back over the cards
    if (t >= tFriday && swirl < 1) {
      S.view(ctx, gc);
      const k = kPull * (1 - sineIO(span(swirl, 0, .8)));                                    // the grid is swallowed by the ring's core
      const ringPull = sineIO(span(swirl, 0, .8));
      const cx = lerp(SLOT.x, RC.x, ringPull), cy = lerp(SLOT.y, RC.y, ringPull);
      let Rg = mG < 1 && blockScreen ? lerpR(blockScreen, GR, mG) : GR;
      Rg = scaleR(Rg, SLOT.x, SLOT.y, Math.max(.001, k));
      Rg = { ...Rg, x: Rg.x + (cx - SLOT.x), y: Rg.y + (cy - SLOT.y) };
      const tiles = F.CALL_TILES();
      tiles[1].speak = span(t, tCall - .2, tCall + .4) * (1 - span(t, tFired0 - .3, tFired0));
      tiles[3].speak = span(t, tHead - .2, tHead + .3) * (1 - span(t, tFired0 - .1, tFired0 + .2));
      const fl = t > tFired0 && t < tFired - .25 ? (Math.sin((t - tFired0) * 38) > .2 ? .7 : 0) : 0;   // the flicker (anticipation)
      tiles[3].dark = Math.max(fl, span(t, tFired - .3, tFired - .1));
      tiles[3].drop = span(t, tFired - .1, tFired + .55);
      if (Rg.w > 2) {
        F.callGrid(ctx, t, Rg, { date: F.SOURCES.call, dateU: span(t, tAgo - .3, tAgo + .5), chrome: 1, tiles });
        // the gold of the tower's cells still on the tiles while they fly out (the block → the tiles)
        if (mG < 1) { ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = rgba(GOLD.hot, .85 * (1 - span(mG, .05, .55))); ctx.fillRect(Rg.x, Rg.y, Rg.w, Rg.h); ctx.restore(); }
        // FIRED in the empty slot (scales with the grid)
        const fu = span(t, tFired + .05, tFired + .6);
        if (fu > 0) { const sr = tileRect(Rg, 3); F.verdict(ctx, t, sr.x + sr.w / 2, sr.y + sr.h * .58, F.SOURCES.fired, fu, { size: Math.max(4, sr.h * .2), gold: 0, col: CREAM, lineCol: { halo: F.CREAM2, body: CREAM, core: CREAM } }); }
      }
      // the cards: born in the slot, flying out on the spiral; then swirling into the ring
      const sc = tileRect(Rg, 3), ox = sc.x + sc.w / 2, oy = sc.y + sc.h / 2;
      for (let i = 0; i < N; i++) {
        const C = CARDS[i], b = expoOut(span(t, C.born, C.born + .75)); if (b <= 0) continue;
        const k2 = kPull, fx = SLOT.x + C.dx * k2 * b, fy = SLOT.y + C.dy * k2 * b, w0 = 230 * k2 * lerp(.25, 1, b);
        let x = fx, y = fy, w = w0, rot = C.rot * b + (1 - b) * 1.2, a = clamp(b * 4);
        if (swirl > 0) {   // polar swirl around the ring centre: inward to the ring, turning, shrinking into its light
          const q = sineIO(clamp((swirl - C.q * .15) / .85)), a0 = Math.atan2(fy - RC.y, fx - RC.x), r0 = Math.hypot(fx - RC.x, fy - RC.y);
          const an = a0 + 2.6 * q, rr = lerp(r0, RR * C.end, q);
          x = RC.x + Math.cos(an) * rr; y = RC.y + Math.sin(an) * rr; w = lerp(w0, 10, q); rot += q * 2; a *= 1 - span(q, .82, 1);
        }
        if (i < 3 && b < 1) { x = lerp(ox, x, b); y = lerp(oy, y, b); }
        F.postCard(ctx, x, y, w, { a, rot });
      }
    }

    // ===================================================================================== E..H · the ring, you, the screen, the page
    const ringU = sineIO(span(t, tGuess + .55, tGuess + 1.35));
    const flat = mv(t, tMovie - .15, 1.2), scr = mv(t, tMovie + .25, 1.5);
    const pageM = mv(t, tInHolly + .05, 1.4), paper = span(pageM, .3, 1);
    const drop = mv(t, tCenter - .05, 1.0);                                                 // H.13: the page drops onto the pile
    if (t >= tGuess && drop < 1) {
      S.view(ctx, gc);
      // the ground line (gold, from the centre out) and the man rising tiny under the ring (H.07), sinking again in H.10
      const gl = sineIO(span(t, tGuess + 1.1, tGuess + 2.3)) * (1 - sineIO(span(t, tBut + .3, tBut + 1.6)));
      if (gl > 0) F.goldSpan(ctx, [[RC.x - 700 * gl, GROUND], [RC.x + 700 * gl, GROUND]], 0, 1, { w: 1.4, spark: false, a: .7 });
      const manUp = expoOut(span(t, tPowerful - .1, tPowerful + .9)) * (1 - expoIn(span(t, tBut + .2, tBut + 1.1)));
      if (manUp > 0) {
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, GROUND); ctx.clip();
        const lean = span(t, tScared - .2, tScared + .6);
        F.ilya(ctx, t, RC.x - 40, GROUND + (1 - manUp) * 150, 130, { dir: 1, look: lerp(.4, 1, lean), lean: -.07 * lean, armR: [lerp(.3, .6, lean), lerp(.2, .5, lean)] });
        ctx.restore();
      }
      // the ring (H.07–H.09): builds out of the swirl, flattens into the screen
      if (ringU > 0 && scr < 1) {
        const rr = RR * lerp(1.15, 1, ringU);
        F.ring(ctx, t, RC.x, RC.y, rr, { a: ringU * (1 - span(scr, .25, .45)), think: .6 + .4 * span(t, tPowerful, tPowerful + 1), flat });
        F.goldText(ctx, [[F.SOURCES.guess, .15]], 150, 210, 40, rise(span(t, tGuess + .1, tGuess + .9)) * (1 - span(t, tMovie - .3, tMovie + .3)), { serif: false, weight: 700, spacing: .14, col: CREAM });
      }
      // the screen (H.09) → the page (H.10 → H.11 → H.12)
      if (scr > 0) {
        const lens = { x: RC.x - RR, y: RC.y - RR * .08, w: RR * 2, h: RR * .16 };
        let r = lerpR(lens, SR, scr);
        const bulbsOff = mv(t, tBut + .05, 1.25), board = expoOut(span(t, tRetells - .6, tRetells + .5)) * (1 - sineIO(span(t, tInHolly - .45, tInHolly + .05)));
        if (pageM <= 0) F.marquee(ctx, t, r, { screen: 1 - mv(t, tBut + .4, 1.3), board, off: bulbsOff });
        else {
          r = lerpR(SR, PR, pageM);
          const dr = drop > 0 ? lerpR(PR, PG, drop) : r;
          ctx.save(); ctx.translate(dr.x + dr.w / 2, dr.y + dr.h / 2); ctx.rotate(-.015 * drop); ctx.translate(-dr.x - dr.w / 2, -dr.y - dr.h / 2);
          F.transcript(ctx, t, dr, { paper, head: span(t, tOath - .2, tOath + .6), write: span(t, tOath, tNever - .2), hand: span(t, tUnder - .1, tUnder + .5) });
          // the small ring left in the page's corner, crumbling on "never about a machine" (H.12)
          const sr = .06 * dr.w;
          if (paper > .2) F.ring(ctx, t, dr.x + dr.w - dr.w * .16, dr.y + dr.h - dr.h * .17, sr, { a: span(paper, .2, .6), crumble: mv(t, tAMach - .25, 1.5), think: .5 });
          ctx.restore();
        }
      }
      // you in the foreground (H.08): rises with the pull-back (the nearest layer), looks up; leaves downward with the push into the page
      const yu = sineIO(span(t, tIf - .3, tIf + 1.6)) * (1 - sineIO(span(t, tBut + .2, tBut + 1.7)));
      if (yu > 0) { ctx.setTransform(1, 0, 0, 1, 0, 0); E.du(ctx, 1520, 1080 + 120 + (1 - yu) * 520, 470, { light: 1, look: .95, dir: -1, back: .25 }); halo(ctx, 1520, 1080 - 330 + (1 - yu) * 520, 260, .12 * yu, P.coat, P.core1); }
    }

    // ===================================================================================== K..Q · the pages, the line, the jobs, the lectern
    if (t >= tCenter && t < tPlate + .02) {
      S.view(ctx, gc);
      const nF = 1 + 51 * sineIO(span(t, tCenter + .9, t52 + 1.2)), n = Math.floor(nF), frac = nF - n;
      const slide = mv(t, tHalf - .05, 1.5), PRr = lerpR(PG, HP, slide);
      if (drop >= 1 || t > tCenter + 1) {
        const face = n < 2 ? (c, r) => F.transcript(c, t, r, { paper: 1, head: 1, write: 1, hand: 1 }) : null;
        F.pages(ctx, t, PRr, { n, face, by: mv(t, tWrote + .05, 1.55), profile: mv(t, tAbout + .2, 1.0), about: span(t, tMan - .1, tMan + .6), lines: 1, count: span(t, t52 + 1.0, t52 + 1.7) });
        if (n < 52) {   // the next sheet falling onto the pile
          const f = expoIn(frac), yy = lerp(-PRr.h - 80, PRr.y, f), rot = (1 - f) * .09 * (n % 2 ? 1 : -1);
          if (t > tCenter + .95) F.pages(ctx, t, { x: PRr.x, y: yy, w: PRr.w, h: PRr.h }, { n: 0, lines: 1, tilt: -.015 + rot });
        }
        // the counter (H.13): beside the pile, sinks behind its mask when the pen starts
        const cu = rise(span(t, tCenter + .7, tCenter + 1.2)) * (1 - span(t, tWrote - .1, tWrote + .5));
        if (cu > 0) F.goldText(ctx, [[String(n), 1]], PRr.x + PRr.w + 70, PRr.y + PRr.h * .55, 150, cu, { serif: true });
      }
      // the LINE (H.16) and the empty right half's question
      const lineU = mv(t, tOnlyHalf - .15, 1.1);
      if (lineU > 0) F.divider(ctx, t, S.HOOK.line.x, S.HOOK.line.y0, S.HOOK.line.y1, lineU, { glow: 1 });
      const qU = rise(span(t, tSaw - .1, tSaw + .6)) * (1 - expoIn(span(t, tOther - .1, tOther + .4)));
      if (qU > 0) F.goldText(ctx, [['?', 0]], JR.x + JR.w / 2, JR.y + JR.h * .55, 160, qU, { serif: true, align: 'center', col: CREAM });
      // the jobs (H.17), you (H.18), the figures sink (H.19)
      const jl = mv(t, tOther + .25, 2.6);
      if (jl > 0) F.jobsGrid(ctx, t, JR, { cols: 4, rows: 3, lit: jl, you: 6, youStep: land(t, tYours - .1, .8), sink: mv(t, tHid - .05, 1.5) });
      // the lectern rises in its spotlight (H.19)
      const lr = mv(t, tHid + .35, 1.4);
      if (lr > 0) {
        ctx.fillStyle = rgba(GOLD.line, .18 * lr); ctx.fillRect(HL.x - 260 * lr, HL.y, 520 * lr, 3);
        F.lectern(ctx, t, HL.x, HL.y, HL.h, { rise: lr, spot: mv(t, tHid + .7, .9), rings: .8 * mv(t, tHidW + .2, 1.2) });
      }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };
  return [
    { t: 0, draw, print: F.PRINT78 },
    { t: tPlate, draw: (ctx, t) => S.plateHook(ctx, t, T), print: F.PRINT78 },
  ];
};
