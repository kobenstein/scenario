// Chunk C4 · §2 PRINT and AGREE · shots 2.09–2.23 (bild/shots.md v2 §2) · builder c04
// ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
// PLAN (gate 1). Times are VO anchors (T.S/T.E on '02b'/'02c'), never seconds. ★ 2.23. Palette: indigo, cream, PRINT verdigris,
// AGREE amber (TAKE rust only as a distant path in 2.23 and as one neighbour's accent).
//  shot  │ words (accent)                                   │ hero onset                                      │ carrier into the next shot                     │ type
//  2.09  │ The second is to **print**.                       │ an uncut sheet of notes slides out of a roller  │ one note lifts and flips; cut at edge-on       │ (c) whipR in
//                                                              (continuing the whip), wet ink glint on print    │                                                 │ (a) cut
//  2.10  │ Elon Musk wants government **checks** for **everyone**. │ the flip lands as a check; it multiplies  │ the fan closes to the right, the check shrinks │ (c) match
//                                                              into a fan across the frame                     │ into the price tag                              │
//  2.10a │ He's sure AI will make so much that **prices** won't **rise**. │ the tag on a loaf tries to hop up, a   │ the cards stay, the bakery slides out left     │ plan seq.
//                                                              dotted ghost tag rises and smokes away; cards   │                                                 │
//  2.12  │ Emad Mostaque … new **digital** money … **verified** human. │ a die strikes a coin of light (pause);   │ the coin → push in                              │ (b) zoom
//                                                              a hand lays on the handprint, the coin lights    │                                                 │
//  2.14  │ The world has done this before, for **countries**. │ a giant brass tap descends over the paper map │ the stream → plan sequence                      │ plan seq.
//  2.15  │ … the IMF created reserve money … **in one go**.  │ a heap of new notes grows under the tap; one  │ the camera glides along to the buckets          │ plan seq.
//                                                              gush on "in one go"                              │                                                 │
//  2.16a │ It went out by **size** and **wealth**.           │ the stream branches into arcs; big buckets    │ the camera glides to the end of the row        │ plan seq.
//                                                              fill first                                       │                                                 │
//  2.16b │ The poorest countries got a **sliver**.           │ the smallest bucket: single notes trickle in  │ a drop falls, the camera follows it down       │ (a) down
//  2.17  │ If prices hold, printing takes **nothing** from anyone. │ the drop lands on the PRINT path; people │ a note in a hand → push in                      │ (b) zoom
//                                                              walk on with full bags; chip + check on nothing  │                                                 │
//  2.18  │ But nobody ends up **owning** anything.           │ the notes in a hand turn to dots and smoke    │ the empty hand opens and rises                 │ (a) up
//  2.19  │ And whoever controls the **tap** decides **who gets what**. │ the hand grips the wheel and turns:     │ hard whip to the right                          │ (c) whipR
//                                                              stream thick/thin, swings between buckets         │                                                 │
//  2.20  │ The third is to **agree**.                        │ the amber AGREE band runs over the meadow to  │ the sheet → push in                             │ (b) zoom
//                                                              the stake at the empty field; glint on agree     │                                                 │
//  2.21  │ Before the fortune exists, we **settle** how it will be shared. │ a pen signs dotted; on settle the│ the camera pulls back and rises                │ (b) out
//                                                              burin makes it solid; a seal embosses (pause)    │                                                 │
//  2.21a │ Like neighbors **agreeing** … before the first **seed** goes in. │ handshake, strings split the   │ steep crane up                                  │ (c) whipD
//                                                              field in equal strips, a closed seed bag         │                                                 │
//  2.23★ │ It's the quietest way, and the one I keep **coming back** to. │ the three paths from high above:   │ the amber AGREE line → push in (c04>c05)        │ (b) zoom out
//                                                              TAKE crowd + dust, PRINT stream, AGREE a quiet foil line in fog; settles on "coming back"
// Boundaries: in = carry('c03>c04') whipR d .3 (2.09 lands out of a fast move to the right, content still sliding right);
//             out = carry('c04>c05') kind 'line': the paths drawing is transformed so the AGREE line lies exactly on C.pos(t);
//             C.draw() is drawn on top until C.t + .4.
// Whips: in, 2.19→2.20, 2.21a→2.23 (3 of 15). Hard accents: the die strike (2.12), the gush (2.15). Sound only in pauses.
// ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, prng, drift, canvas, text, addGlow } from '../engine.mjs';
import { carry } from '../lib/carry.mjs';
import { paths } from '../lib/paths.mjs';
import { field, fieldSheet } from '../lib/field.mjs';
import { hand } from '../lib/hand.mjs';
import { pen } from '../lib/paper.mjs';
import { quoteCard2 } from '../lib/quote2.mjs';
import { figure, figureFlat, walk, handPos } from '../lib/figure.mjs';
import { worldMap } from '../lib/map.mjs';
import { seal, ring } from '../lib/certificate.mjs';
import { ghostLine, smokeDots } from '../lib/ghost.mjs';
import { fog as artFog, stipple } from '../lib/art.mjs';
import { once, TAU, VERD, VERD_D, VERD_L, CREAM, AMBER, RUST, easeOut, easeIn, easeIO, plate, bloomSprite, putBloom, motes, noteSprite, NW, NH, sheetSprite,
  checkSprite, CKW, CKH, chip, nameLabel, sourceLine, bigNumber, loafSprite, shelfLayer, dieSprite, coinFace, groundRibbon, mixHex } from '../lib/sc04_art.mjs';
import { drawTap, stream, arcs, bucket, heap } from '../lib/sc04_tap.mjs';

const PETROL = '#1f6f78';
const vign = (ctx, a = .55, x = W * .5, y = H * .5) => { const g = ctx.createRadialGradient(x, y, 380, x, y, 1250); g.addColorStop(0, 'rgba(3,4,12,0)'); g.addColorStop(1, `rgba(3,4,12,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); };
// art.fog only fills the first W px of any canvas, so the fog is made W wide and stretched to W + 600 (wisps stay soft);
// it scrolls by local shot time only (no modulo wrap, so no jump inside a shot)
const fogLayer = (key, col, a, seed, y0 = 0, y1 = H) => once('f4fog' + key, () => { const [f, fg] = canvas(W, H); artFog(fg, { y0, y1, col, a, seed, sx: .0016, sy: .006, cover: .55, soft: .45, k: .5 }); const [c, g] = canvas(W + 600, H); g.drawImage(f, 0, 0, W + 600, H); return c; });
const drawFog = (ctx, F, tl, sp, a, dy = 0, op = 'lighter') => { if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = op; ctx.globalAlpha = a; ctx.drawImage(F, -Math.min(600, Math.max(0, tl * sp)), dy); ctx.restore(); };
const title = (ctx, t, t0, x, y, small, big, col, t1 = 1e9) => {   // engraved chapter word, mask wipe in, never moving while read
  const u = eout(lin(t0, t0 + .7, t)) * (1 - sm(lin(t1, t1 + .4, t))); if (u <= 0) return;
  ctx.save(); ctx.globalAlpha = u; ctx.beginPath(); ctx.rect(x - 10, y - 140, 40 + 900 * eout(lin(t0, t0 + .9, t)), 220); ctx.clip();
  ctx.shadowColor = 'rgba(2,3,12,.85)'; ctx.shadowBlur = 16;
  text(ctx, small, x + 4, y - 92, { size: 18, weight: 600, color: rgba(CREAM, .85), spacing: 6 });
  text(ctx, big, x, y, { size: 104, font: 'Instrument Serif', color: col, spacing: 6 });
  ctx.restore();
};

export default (T, R) => {
  const b = (ph, n) => T.S('02b', ph, n), be = (ph, n) => T.E('02b', ph, n), c = (ph, n) => T.S('02c', ph, n), ce = (ph, n) => T.E('02c', ph, n);
  const CIN = carry('c03>c04', T, R), COUT = carry('c04>c05', T, R);
  const A = {
    in: CIN.t, print: b('print'), printE: be('print'),
    s210: b('Elon Musk'), checks: b('checks'), everyone: b('everyone'), everyoneE: be('everyone'),
    s210a: b('He\'s sure'), prices: b('prices'), wont: b('won\'t rise'), riseE: be('won\'t rise'),
    s212: b('Emad'), stability: b('Stability AI'), aiE: be('Stability AI'), newm: b('new digital'), verified: b('verified'), humanE: be('verified human'),
    s214: b('The world has'), countries: b('countries'), countriesE: be('countries'),
    s215: b('A few years'), imf: b('IMF'), onego: b('in one go'), onegoE: be('in one go'),
    s216a: b('It went out'), wealth: b('wealth'), wealthE: be('wealth'),
    s216b: b('The poorest'), sliver: b('sliver'), sliverE: be('sliver'),
    s217: b('If prices hold'), nothing: b('nothing'),
    s218: b('But nobody'), owning: b('owning'), anythingE: be('owning anything'),
    s219: b('And whoever'), tap: b('the tap'), who: b('who gets what'), whatE: be('who gets what'),
    s220: c('The third'), agree: c('agree'), agreeE: ce('agree'),
    s221: c('Before the fortune'), settle: c('settle'), sharedE: ce('be shared'),
    s221a: c('Like neighbors'), agreeing: c('agreeing'), split: c('split'), seed: c('seed'), inE: ce('goes in'),
    s223: c('It\'s the quietest'), quietest: c('quietest'), coming: c('coming back'), toE: ce('back to'),
  };
  // cut times (entry t) of every shot
  const CT = {
    s209: CIN.into.t, s210: A.printE + .02, s210a: A.s210a - .08, s212: A.s212 - .3, s214: A.s214 - .15, s215: A.s215 - .2, s216a: A.s216a - .2,
    s216b: A.s216b - .2, s217: A.s217 - .2, s218: A.s218 - .2, s219: A.s219 - .15, s220: A.s220 - .14, s221: A.s221 - .2, s221a: A.sharedE + .45,
    s223: A.s223 - .14,
  };

  // ═══════════════ 2.09 · PRINT: the uncut sheet slides out of the roller ═══════════════
  const SH = { sc: .97, x0: 300, y: 590 };                         // sheet left edge (at the roller), vertical centre
  const noteHome = () => { const S = sheetSprite(3, 2), w = S.width * SH.sc, h = S.height * SH.sc, gx = 26 * SH.sc;
    return { x: SH.x0 + gx + (NW * SH.sc + gx) * 2 + NW * SH.sc / 2, y: SH.y - h / 2 + gx + NH * SH.sc / 2, w, h }; };
  const flipEnd = { x: 1330, y: 380, s: 1.3 };                    // where the lifted note is edge-on at the cut (= where the check starts)
  function frame209(ctx, t) {
    const PL = plate('print', { light: [1380, 240], col: VERD });
    const slide = easeOut(lin(A.in - .32, A.in + 1.05, t));         // the sheet keeps the whip's momentum and settles
    const off = mix(-1150, 0, slide);
    ctx.drawImage(PL, -150 + off * .12 + drift(t, 6), -100 + drift(t, 4, 1));
    putBloom(ctx, bloomSprite('v5', VERD, 520, .45), 1360, 260, 1.2, .55);
    const S = sheetSprite(3, 2), w = S.width * SH.sc, h = S.height * SH.sc, x = SH.x0 + off, y0 = SH.y - h / 2;
    // the sheet (only the part that has left the roller)
    ctx.save(); ctx.beginPath(); ctx.rect(SH.x0 - 10, 0, W, H); ctx.clip();
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 26; ctx.shadowOffsetX = 14; ctx.fillStyle = '#efe8d4'; ctx.fillRect(x, y0, w, h); ctx.restore();
    ctx.drawImage(S, x, y0, w, h);
    // the lifted note leaves its empty slot behind
    const NHm = noteHome(), lift = lin(A.print + .2, A.printE + .02, t);
    if (lift > 0) { ctx.fillStyle = '#d8cfb6'; ctx.fillRect(NHm.x - NW * SH.sc / 2 + off, NHm.y - NH * SH.sc / 2, NW * SH.sc, NH * SH.sc); ctx.strokeStyle = 'rgba(31,42,58,.35)'; ctx.setLineDash([5, 5]); ctx.strokeRect(NHm.x - NW * SH.sc / 2 + off, NHm.y - NH * SH.sc / 2, NW * SH.sc, NH * SH.sc); ctx.setLineDash([]); }
    // wet ink: a glint sweeps across on "print", the fresh rows near the roller shine
    const sw = lin(A.print - .1, A.print + .55, t);
    ctx.save(); ctx.beginPath(); ctx.rect(x, y0, w, h); ctx.clip(); ctx.globalCompositeOperation = 'lighter';
    const wet = ctx.createLinearGradient(SH.x0, 0, SH.x0 + 420, 0); wet.addColorStop(0, 'rgba(120,230,205,.22)'); wet.addColorStop(1, 'rgba(120,230,205,0)'); ctx.fillStyle = wet; ctx.fillRect(SH.x0, y0, 420, h);
    if (sw > 0 && sw < 1) { const gx = mix(x - 300, x + w + 300, easeIO(sw)); const gg = ctx.createLinearGradient(gx - 160, 0, gx + 160, 0); gg.addColorStop(0, 'rgba(255,255,255,0)'); gg.addColorStop(.5, 'rgba(225,255,245,.55)'); gg.addColorStop(1, 'rgba(255,255,255,0)'); ctx.setTransform(1, 0, -.35, 1, 0, 0); ctx.fillStyle = gg; ctx.fillRect(gx - 160 + y0 * .35, y0, 320 + h * .35, h); ctx.setTransform(1, 0, 0, 1, 0, 0); }
    ctx.restore(); ctx.restore();
    // the roller (vertical steel cylinder, verdigris ink, engraved lines that run with the rotation)
    const rx = SH.x0 - 190, rw = 210, spin = (off * -.9 + t * 30);
    const rg = ctx.createLinearGradient(rx, 0, rx + rw, 0); rg.addColorStop(0, '#05070e'); rg.addColorStop(.35, '#2b3a44'); rg.addColorStop(.55, '#9fb8b6'); rg.addColorStop(.7, '#3c5258'); rg.addColorStop(1, '#070a12');
    ctx.fillStyle = rg; ctx.fillRect(rx, -20, rw, H + 40);
    ctx.save(); ctx.beginPath(); ctx.rect(rx, -20, rw, H + 40); ctx.clip(); ctx.strokeStyle = 'rgba(8,12,18,.55)'; ctx.lineWidth = 1.2;
    for (let i = 0; i < 70; i++) { const yy = ((i * 18 + spin) % (H + 60)) - 30; ctx.beginPath(); ctx.moveTo(rx, yy); ctx.bezierCurveTo(rx + rw * .3, yy + 5, rx + rw * .7, yy + 5, rx + rw, yy); ctx.stroke(); }
    ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(VERD, .16); ctx.fillRect(rx + rw * .5, -20, rw * .18, H + 40); ctx.restore();
    ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(rx + rw, -20, 22, H + 40);
    // the lifting note: rises toward the camera and flips about its long axis; edge-on exactly at the cut
    if (lift > 0) {
      const p = easeIn(lift), NHm2 = noteHome(), N = noteSprite();
      const nx = mix(NHm2.x + off, flipEnd.x, easeIO(lift)), ny = mix(NHm2.y, flipEnd.y, easeIO(lift)), s = mix(SH.sc, flipEnd.s, easeIO(lift)), fy = Math.cos(p * Math.PI / 2);
      ctx.save(); ctx.translate(nx, ny); ctx.rotate(mix(0, -.08, lift)); ctx.scale(s, s * Math.max(.002, fy));
      ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 30 * lift; ctx.drawImage(N, -NW / 2, -NH / 2); ctx.restore();
    }
    title(ctx, t, A.print - .05, 430, 230, 'THE SECOND WAY', 'PRINT', VERD_L);
    motes(ctx, t, 1300, 300, 600, .7, 4, '200,240,225');
    vign(ctx, .55);
  }

  // ═══════════════ 2.10 · the check, multiplied into a fan ═══════════════
  const FAN = { px: 960, py: 1420, R: 930, n: 27, amax: 1.12 };
  const tagPos = { x: 905, y: 610, rot: .12, s: .3 };              // the price tag on the loaf (2.10a) = where the closed fan ends
  function frame210(ctx, t) {
    const PL = plate('check', { light: [960, 220], col: VERD });
    ctx.drawImage(PL, -150 + drift(t, 8, 2), -100 + drift(t, 5, 3) - (t - CT.s210) * 4);
    putBloom(ctx, bloomSprite('v6', VERD, 560, .4), 960, 360, 1.4, .5 + .3 * sm(lin(A.checks, A.everyone, t)));
    const land = easeOut(lin(CT.s210, CT.s210 + .7, t)), flip = Math.sin(Math.min(1, lin(CT.s210, CT.s210 + .42, t)) * Math.PI / 2);
    const open = easeOut(lin(A.checks - .05, A.everyone + .1, t)), close = easeIn(lin(A.everyoneE - .3, CT.s210a - .12, t)), shrink = easeIO(lin(A.everyoneE - .05, CT.s210a + .02, t));
    const single = { x: mix(flipEnd.x, 960, land), y: mix(flipEnd.y, 470, land) + drift(t, 4, 1), s: mix(flipEnd.s * NW / CKW, 1.12, land) };
    const items = [];
    for (let i = 0; i < FAN.n; i++) {
      const k = (i - (FAN.n - 1) / 2) / ((FAN.n - 1) / 2), a0 = k * FAN.amax * open, a = mix(a0, .55, close);
      const fx = FAN.px + Math.sin(a) * FAN.R, fy = FAN.py - Math.cos(a) * FAN.R, sc = mix(1.12, .74, open);
      items.push({ i, k, a, x: fx, y: fy, s: sc, z: -Math.abs(k) });
    }
    items.sort((p, q) => p.z - q.z);
    const showFan = t >= A.checks - .05;
    for (const it of (showFan ? items : [{ i: (FAN.n - 1) / 2, k: 0, a: 0, x: single.x, y: single.y, s: single.s }])) {
      let { x, y, s, a } = it; const isMid = Math.abs(it.k) < 1e-6;
      if (!showFan) a = mix(-.08, 0, land);
      // closing: the stack travels into the price tag
      x = mix(x, tagPos.x, shrink); y = mix(y, tagPos.y, shrink); s = mix(s, tagPos.s, shrink); a = mix(a, tagPos.rot, shrink);
      const C = checkSprite(1 + (it.i % 5));
      ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.scale(s, s * (showFan || isMid ? (t < CT.s210 + .42 ? Math.max(.002, flip) : 1) : 1));
      ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 14;
      if (!isMid) ctx.globalAlpha = Math.min(1, open * 3) * (1 - sm(lin(.75, 1, shrink)));
      ctx.drawImage(C, -CKW / 2, -CKH / 2); ctx.restore();
    }
    nameLabel(ctx, t, A.s210 + .05, 130, 170, 'Elon Musk', 'on X · April 2026', { col: VERD, t1: A.everyoneE - .2 });
    motes(ctx, t, 960, 400, 700, .6, 6, '200,240,225');
    vign(ctx, .5);
  }

  // ═══════════════ 2.10a + 2.12 · the loaf (prices), the cards, then the mint (one plan sequence) ═══════════════
  const LOAF = { x: 560, y: 600 }, COIN = { x: 760, y: 640, r: 190 };
  const strike = A.aiE + .12;                                       // in the pause before "new digital money"
  const pan = (t) => easeIO(lin(A.s212 - .35, A.s212 + .85, t)) * W;
  function bakery(ctx, t, ox) {
    ctx.drawImage(shelfLayer(), -200 + ox + drift(t, 5, 1), 0);
    const L = loafSprite(); ctx.save(); ctx.translate(LOAF.x + ox, LOAF.y + drift(t, 1.2, 2)); ctx.drawImage(L, -L.width / 2, -L.height / 2); ctx.restore();
    // the price tag: pinned to the loaf with a string; it hops as if pushed up, then holds on "won't rise"
    const pin = [LOAF.x + 230 + ox, LOAF.y - 92];
    const tIn = t - CT.s210a, settle = easeOut(lin(A.wont - .05, A.riseE, t));
    const hop = (1 - settle) * Math.max(0, Math.sin(Math.max(0, t - A.s210a - .2) * 7.5)) * sm(lin(A.s210a + .1, A.s210a + .6, t)) * 26;
    const wob = (1 - settle) * Math.sin(t * 11) * .16 * sm(lin(A.s210a, A.s210a + .4, t)) + Math.sin(t * 1.3) * .015;
    const arrive = easeOut(lin(CT.s210a - .02, CT.s210a + .5, t));
    const tx = mix(tagPos.x, pin[0] + 60, arrive), ty = mix(tagPos.y, pin[1] + 150, arrive) - hop, rot = mix(tagPos.rot, .1 + wob, arrive), ts = mix(tagPos.s, .5, arrive);
    // the ghost tag: a dotted copy rises (the price that would go up) and smokes away on "won't rise"
    const gh = sm(lin(A.s210a + .4, A.prices + .2, t)), gone = lin(A.wont - .05, A.riseE + .2, t);
    if (gh > 0 && gone < 1) {
      const gy = ty - 40 - gh * 150, pts = []; const wq = 170 * ts / .34, hq = 100 * ts / .34;
      for (const [px, py] of [[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]]) pts.push([tx + px * wq / 2, gy + py * hq / 2]);
      ghostLine(ctx, pts, { ghost: 1, smoke: gone, col: '#fff4dc', a: gh, w: 3, dot: 9, t, wind: [.2, -1] });
      if (gone < .3) { ctx.save(); ctx.globalAlpha = .5 * gh * (1 - gone / .3); ctx.strokeStyle = CREAM; ctx.setLineDash([4, 8]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tx, ty - 50); ctx.lineTo(tx, gy + hq / 2 + 6); ctx.stroke(); ctx.setLineDash([]);
        ctx.beginPath(); ctx.moveTo(tx - 10, gy + hq / 2 + 18); ctx.lineTo(tx, gy + hq / 2 + 6); ctx.lineTo(tx + 10, gy + hq / 2 + 18); ctx.stroke(); ctx.restore(); }
    }
    ctx.save(); ctx.strokeStyle = 'rgba(60,40,24,.85)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(pin[0], pin[1]); ctx.quadraticCurveTo((pin[0] + tx) / 2 - 10, (pin[1] + ty) / 2 + 20, tx - 50 * ts / .34 * Math.cos(rot), ty - 40 * ts / .34); ctx.stroke();
    ctx.fillStyle = '#b8a27a'; ctx.beginPath(); ctx.arc(pin[0], pin[1], 4, 0, TAU); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(tx, ty); ctx.rotate(rot); ctx.scale(ts / .34, ts / .34);
    ctx.shadowColor = 'rgba(20,10,4,.5)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 8; ctx.fillStyle = '#f1e6cc';
    ctx.beginPath(); ctx.moveTo(-85, -30); ctx.lineTo(-60, -50); ctx.lineTo(85, -50); ctx.lineTo(85, 50); ctx.lineTo(-60, 50); ctx.lineTo(-85, 30); ctx.closePath(); ctx.fill();
    ctx.shadowColor = 'transparent'; ctx.fillStyle = '#5a4630'; ctx.beginPath(); ctx.arc(-62, 0, 6, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#2a2140'; ctx.lineWidth = 3.2; ctx.lineCap = 'round'; ctx.beginPath();   // a scribbled price (no number)
    for (let i = 0; i <= 26; i++) { const q = i / 26, x = -35 + q * 105, y = 6 + Math.sin(q * 19) * 13 * (1 - Math.abs(q - .5)) - Math.cos(q * 7) * 4; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
    ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-34, 34); ctx.lineTo(70, 30); ctx.stroke();
    ctx.restore();
    // morning light raking through the bakery window
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createLinearGradient(ox - 100, 0, ox + 1100, 900); lg.addColorStop(0, 'rgba(255,200,140,.32)'); lg.addColorStop(.55, 'rgba(255,190,120,.1)'); lg.addColorStop(1, 'rgba(255,190,120,0)'); ctx.fillStyle = lg; ctx.fillRect(ox, 0, W, H); ctx.restore();
    putBloom(ctx, bloomSprite('a10', AMBER, 520, .4), LOAF.x + ox - 60, LOAF.y - 120, 1.5, .55);
    motes(ctx, t, 420 + ox, 330, 520, .8, 9);
  }
  function mint(ctx, t, ox) {
    const PL = plate('mint', { light: [900, 240], col: VERD }); ctx.drawImage(PL, -150 + ox + drift(t, 6, 4), -100 + drift(t, 4, 5));
    const cx = COIN.x + ox, cy = COIN.y, hit = t - strike;
    { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const cg = ctx.createLinearGradient(0, 0, 0, cy + 60); cg.addColorStop(0, rgba(VERD, .02)); cg.addColorStop(1, rgba(VERD, .16));
      ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(cx - 140, 0); ctx.lineTo(cx + 140, 0); ctx.lineTo(cx + COIN.r * 1.6, cy + 40); ctx.lineTo(cx - COIN.r * 1.6, cy + 40); ctx.closePath(); ctx.fill(); ctx.restore(); }
    putBloom(ctx, bloomSprite('v10', VERD, 420, .4), cx, cy + 20, 1.5, .45);
    const shake = hit > 0 && hit < .3 ? Math.sin(hit * 90) * 5 * (1 - hit / .3) : 0;
    ctx.save(); ctx.translate(shake, shake * .4);
    // the coin: dotted (not yet) before the strike, struck solid after
    const lit = sm(lin(A.verified - .1, A.verified + .35, t)), glow = hit > 0 ? Math.max(.35, Math.exp(-hit * 4)) : 0;
    ctx.save(); ctx.translate(cx, cy + 40); ctx.scale(1, .3); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.arc(10, 0, COIN.r * 1.05, 0, TAU); ctx.fill(); ctx.restore();
    if (hit < 0) {
      const pts = []; for (let i = 0; i <= 90; i++) { const a = i / 90 * TAU; pts.push([cx + Math.cos(a) * COIN.r, cy + Math.sin(a) * COIN.r * .42]); }
      ghostLine(ctx, pts, { ghost: 1, col: VERD_L, a: .8, w: 2.2, dot: 9 });
      const p2 = pts.map(([x, y]) => [cx + (x - cx) * .74, cy + (y - cy) * .74]); ghostLine(ctx, p2, { ghost: 1, col: VERD_L, a: .5, w: 1.6, dot: 8 });
    } else {
      const CF = coinFace(COIN.r), sq = .42 + .04 * Math.sin(t * .8);
      ctx.save(); ctx.translate(cx, cy); ctx.scale(1, sq); ctx.drawImage(CF, -CF.width / 2, -CF.height / 2); ctx.restore();
      // the coin's edge (thickness) under the face
      ctx.save(); ctx.strokeStyle = rgba(VERD_D, .9); ctx.lineWidth = 10; ctx.beginPath(); ctx.ellipse(cx, cy + 7, COIN.r - 2, COIN.r * sq - 2, 0, 0, Math.PI); ctx.stroke(); ctx.restore();
      putBloom(ctx, bloomSprite('v7', VERD, 420, .55), cx, cy, 1 + lit * .6, glow * .7 + lit * .9);
      if (lit > 0) ring(ctx, cx, cy, COIN.r * (1.05 + lit * .9), COIN.r * .42 * (1.05 + lit * .9), { lines: 6, band: 14, wave: 30, col: '#e9fff8', glow: VERD, a: (1 - lin(A.verified + .2, A.humanE + .6, t) * .7) * lit });
      if (hit < .5) ring(ctx, cx, cy, COIN.r * (1 + hit * 3), COIN.r * .42 * (1 + hit * 3), { lines: 4, band: 10, wave: 24, col: '#e9fff8', glow: VERD, a: (1 - hit * 2) });
    }
    // the die: hangs above, drops fast in the pause, strikes, lifts again
    const D = dieSprite(), down = t < strike ? easeIn(lin(strike - .32, strike, t)) : 1 - easeOut(lin(strike + .12, strike + .95, t));
    const dy = mix(-470, 0, down) + (t < strike - .32 ? drift(t, 6, 3) - 8 * sm(lin(strike - .9, strike - .32, t)) : 0);
    ctx.save(); ctx.translate(cx, cy - 40 + dy); ctx.drawImage(D, -D.width / 2, -D.height); ctx.restore();
    if (hit > 0 && hit < .25) addGlow(ctx, cx, cy - 20, 260, (1 - hit * 4) * .6, VERD, '#ffffff');
    // the hand lays on the engraved handprint, then the coin lights up on "verified"
    const hIn = easeOut(lin(A.verified - .9, A.verified - .15, t));
    if (hIn > 0) {
      const hx = mix(cx + 760, cx + 10, hIn), hy = mix(cy + 380, cy + 120, hIn) + drift(t, 2, 6);
      hand(ctx, hx, hy, 1.55, { pose: 'open', ang: -2.55, flip: false, skin: '#c99a74', sleeve: PETROL, sleeveLen: 520, rim: '#bfe8dc', light: [-.3, -1], t, seed: 3, spread: .9 });
    }
    ctx.restore();
    motes(ctx, t, cx, cy - 60, 520, .7 + lit, 11, '200,240,225');
  }
  function frame210a(ctx, t) {
    const px = pan(t);
    if (px < W) bakery(ctx, t, -px);
    if (px > 0) mint(ctx, t, W - px);
    if (px > 0 && px < W) { ctx.fillStyle = 'rgba(4,4,12,.85)'; ctx.fillRect(W - px - 6, 0, 12, H); }
    // the cards unfold on "prices" and stay (fixed, in front) until "Stability AI", then tip away to the left
    const out = easeIn(lin(A.stability, A.stability + .5, t));
    const card = (i, o) => {
      const t0 = A.prices - .05 + i * .32, un = easeOut(lin(t0, t0 + .55, t)); if (un <= 0 || out >= 1) return;
      ctx.save(); const top = o.y - 140;
      ctx.translate(o.x - 420 * 0, top); ctx.translate(-out * 1300, out * 260); ctx.rotate(-out * .9); ctx.scale(1, Math.max(.01, un)); ctx.translate(-o.x, -top);
      quoteCard2(ctx, t, { text: o.text, name: o.name, role: o.role, source: o.source, date: o.date, t0: t0 - .3, t1: 1e9, x: o.x, y: o.y, w: 520, size: 46, rot: o.rot, seed: 3 + i, mark: true });
      ctx.restore();
    };
    card(0, { x: 1430, y: 300, text: '“He is so wrong on this”', name: 'Sanjeev Sanyal', role: 'economic adviser to India’s government', source: 'on Musk’s post', date: '2026', rot: -.02 });
    card(1, { x: 1450, y: 640, text: '“possible, but it’s naïve”', name: 'Karl Widerquist', role: 'economist', source: 'widerquist.com', date: '2026', rot: .015 });
    sourceLine(ctx, t, A.s210a + .2, A.s212 - .1, 'Elon Musk on X, April 2026: “…so there will not be inflation.”');
    nameLabel(ctx, t, A.s212 + .15, 130, 170, 'Emad Mostaque', 'founder, Stability AI · proposal, not launched', { col: VERD, t1: A.humanE + .1 });
    vign(ctx, .5, px > W * .5 ? COIN.x : LOAF.x, 520);
  }

  // ═══════════════ 2.14 – 2.16b · the tap over the paper map (one plan sequence) ═══════════════
  // world px (the map lies on a table); camera { x, y, z }: world point at screen centre and zoom
  const MAPR = 1.5, MO = [-300, -60];                              // map cache resolution and origin (world)
  const mapCanvas = () => once('c4map', () => {
    const [c2, g] = canvas(Math.round(2700 * MAPR), Math.round(1240 * MAPR));
    worldMap(g, { cx: 0, cy: .02, z: 1.18 * MAPR, rot: -.02, tilt: .5, x: (1060 - MO[0]) * MAPR, y: (640 - MO[1]) * MAPR }, { t: 0, light: [2600, 300], borders: true, hatch: true, graticule: true });
    return c2;
  });
  const TAP = { x: 560, y: 262, s: .62, ang: -.13 };
  const HEAP = { x: 560, y: 628 };
  const BK = [[930, 1012, 1], [1112, 1006, .82], [1266, 1000, .64], [1392, 996, .5], [1496, 992, .36], [1572, 989, .17]];
  const SHARE = [1, .62, .36, .2, .1, .016], FILLMAX = [1.06, .97, .82, .64, .46, .13];
  const tapPos = (t) => { const d = easeOut(lin(CT.s214 - .1, CT.s214 + 1.35, t)); return { x: mix(1900, TAP.x, d), y: mix(-760, TAP.y, d), ang: mix(-.55, TAP.ang, d) + .01 * Math.sin(t * .7) }; };
  const turnMain = (t) => 2.6 * easeOut(lin(A.countries - .25, A.countries + .5, t)) + 1.8 * easeOut(lin(A.onego - .12, A.onego + .2, t)) - 1.4 * easeIO(lin(A.onegoE, A.onegoE + .5, t));
  const openMain = (t) => (t < A.countries ? 0 : .72 * sm(lin(A.countries, A.countries + .35, t)) + .5 * sm(lin(A.onego - .1, A.onego + .15, t)) * (1 - sm(lin(A.onegoE - .1, A.onegoE + .4, t)))) * (1 - sm(lin(A.s216a - .1, A.s216a + .3, t)));
  const openArcs = (t) => sm(lin(A.s216a - .15, A.s216a + .3, t)) * (1 - .45 * sm(lin(A.s216b + 1, A.sliverE, t)));
  const heapH = (t) => 34 * sm(lin(A.countries + .25, A.countries + 1, t)) + 80 * sm(lin(A.countries + 1, A.onego - .1, t)) + 120 * easeOut(lin(A.onego, A.onegoE + .3, t)) - 40 * sm(lin(A.s216a, A.wealthE + .3, t));
  const fillK = (k, t) => FILLMAX[k] * sm(lin(A.s216a + .35 + k * .28, A.wealthE + .4 + k * .42, t)) + (k === 5 ? .04 * sm(lin(A.sliver - .3, A.sliverE, t)) : 0);
  const camTap = (t) => {
    const k1 = easeIO(lin(CT.s214, A.s215 + .4, t)), k2 = easeIO(lin(A.s215 + .4, A.onego, t)), k3 = easeIO(lin(A.s216a - .3, A.s216a + 1.6, t)), k4 = easeIO(lin(A.s216b - .3, A.s216b + 1.7, t));
    let x = mix(1000, 900, k1), y = mix(450, 470, k1), z = mix(.96, 1.04, k1);
    x = mix(x, 600, k2); y = mix(y, 470, k2); z = mix(z, 1.3, k2);
    x = mix(x, 1080, k3); y = mix(y, 640, k3); z = mix(z, 1.0, k3);
    x = mix(x, BK[5][0] + 70, k4); y = mix(y, BK[5][1] - 70, k4); z = mix(z, 3.1, k4);
    return { x: x + drift(t, 6, 1) / z, y: y + drift(t, 4, 2) / z, z: z * (1 + .004 * Math.sin(t * .5)) };
  };
  const drop = { x: 1080 };                                        // the last drop: screen x (2.16b → 2.17)
  const dropY = (t) => { // screen y of the falling drop, continuous across the 'down' composite (see frame216 / frame217)
    if (t < CT.s217 - .25) return mix(-60, 520, Math.pow(lin(A.sliverE + .45, CT.s217 - .25, t), 1.7));
    if (t < CT.s217 + .25) return mix(520, 600, lin(CT.s217 - .25, CT.s217 + .25, t));
    return mix(600, LAND.y, Math.pow(lin(CT.s217 + .25, CT.s217 + .75, t), 1.6));
  };
  const eDown = (t) => eio(clamp((t - (CT.s217 - .25)) / .5));
  function dropDraw(ctx, x, y, t, a = 1) {
    ctx.save(); ctx.translate(x, y); addGlow(ctx, 0, 0, 70, .45 * a, VERD, '#effff9');
    const g = ctx.createRadialGradient(-5, -8, 0, 0, 0, 24); g.addColorStop(0, '#f0fff9'); g.addColorStop(.45, '#7fdcc6'); g.addColorStop(1, VERD_D);
    ctx.globalAlpha = a; ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -34); ctx.bezierCurveTo(15, -12, 20, 5, 0, 18); ctx.bezierCurveTo(-20, 5, -15, -12, 0, -34); ctx.fill(); ctx.restore();
  }
  function frameTap(ctx, t) {
    const cam = camTap(t), z = cam.z;
    ctx.drawImage(plate('table', { light: [1400, 200], col: AMBER, base: '#14152e' }), -150 - (cam.x - 960) * .05, -100 - (cam.y - 540) * .05);
    ctx.save(); ctx.setTransform(z, 0, 0, z, 960 - cam.x * z, 540 - cam.y * z);
    const M = mapCanvas(); ctx.drawImage(M, MO[0], MO[1], M.width / MAPR, M.height / MAPR);
    // warm light pool on the map under the tap (the hero light) + the verdigris glow of the money
    putBloom(ctx, bloomSprite('a4', AMBER, 520, .35), 700, 420, 1.6, .5);
    const tp = tapPos(t), hh = Math.max(0, heapH(t));
    const prof = (x) => Math.exp(-Math.pow((x - HEAP.x) / (140 + 2.6 * hh) * 3.6, 2));
    // buckets (behind the heap? no: to the right) — drawn back to front
    const bOn = sm(lin(A.s215 + 2, A.s216a, t));
    for (let k = 0; k < BK.length; k++) { const [bx, by, bs] = BK[k]; bucket(ctx, bx, by, bs * .9, fillK(k, t), { t, a: bOn }); }
    heap(ctx, HEAP.x, HEAP.y, 140 + 2.6 * hh, hh, { t });
    if (hh > 2) putBloom(ctx, bloomSprite('v8', VERD, 300, .4), HEAP.x, HEAP.y - hh * .5, .9 + hh / 200, .45);
    // the stream from the mouth onto the heap
    const src = (tb) => { const p = tapPos(tb); return { x: p.x + 4, y: p.y + 10, vx: 0, vy: 240 }; };
    stream(ctx, t, { src, open: openMain, rate: 85, s: .62, floor: (x) => HEAP.y - hh * prof(x) - 6, seed: 3, spread: 30, size: 1 });
    if (t > A.onego - .2 && t < A.onegoE + 1.2) stream(ctx, t, { src, open: (tb) => (tb > A.onego - .1 && tb < A.onegoE + .2 ? 1 : 0), rate: 220, s: .62, floor: (x) => HEAP.y - hh * prof(x) - 6, seed: 9, spread: 90, size: 1.1 });
    // branching arcs into the buckets, by share
    if (openArcs(t) > 0 || t < A.s217) arcs(ctx, t, { src: { x: tp.x + 4, y: tp.y + 16 }, targets: BK.map(([x, y, s], k) => ({ x, y: y - 150 * s * .9, w: SHARE[k] })), open: openArcs, rate: 130, s: .62, flight: .95, size: 1 });
    // 2.16b: the smallest bucket only gets a thin trickle, single notes on "sliver"
    if (t > A.s216b - .5 && t < CT.s217 + .3) stream(ctx, t, { src: () => ({ x: BK[5][0] - 150, y: BK[5][1] - 330, vx: 95, vy: 40 }), open: (tb) => (tb > A.s216b - .6 && tb < A.sliverE + .4 ? .9 : 0), rate: 4.2, s: .3, g: 900, floor: () => BK[5][1] - 150 * BK[5][2] * .9 + 10, seed: 31, spread: 6, glow: false, life: 2.4 });
    // the tap (drawn last, it hangs over everything)
    const tap = drawTap(ctx, tp.x, tp.y, TAP.s, { ang: tp.ang, turn: turnMain(t), res: 2 });
    ctx.restore();
    // labels (screen space, readable, never over the bottom 170 px)
    bigNumber(ctx, t, A.imf + .1, 1180, 300, '≈ $650 bn', 'IMF · Aug 2021 · reserve money (SDRs)', { acc: VERD, size: 112, t1: A.onegoE + .2, panel: true });
    bigNumber(ctx, t, A.sliver - .2, 130, 300, '≈ $21 bn', 'to low-income countries · of ≈ $650 bn', { acc: VERD, size: 112, t1: CT.s217 - .3, panel: true });
    // the last drop (2.16b): falls, the camera follows it down
    if (t > A.sliverE + .4) { const e = eDown(t); dropDraw(ctx, drop.x, dropY(t) + e * H, t); }
    vign(ctx, .5);
  }

  // ═══════════════ 2.17 · PRINT path: the drop lands, people walk on with full bags ═══════════════
  const P17 = (t) => ({ view: 'persp', hi: 'print', cam: { x: 0, y: (t - CT.s217) * 26, z: 1.45 }, life: { take: .25, print: 1, agree: .25 }, fog: 0, fork: { x: 1010, y: 1010 }, labels: false });
  const LAND = (() => { const [c2, g] = canvas(W, H), tl = CT.s217 + .75, p = paths(g, tl, P17(tl)).along('print', .1); return { x: p.x, y: p.y }; })();
  drop.x = LAND.x;
  const PEOPLE = [ // ground X, start Y, speed (world units/s), colour accent, scale factor, carries: bag | note
    { X: -260, Y: 420, v: 55, acc: '#7aa6c8', bag: 1 }, { X: 300, Y: 260, v: -40, acc: '#c9a27a', bag: 1 }, { X: 170, Y: 90, v: 34, acc: VERD, note: 1 },
    { X: -170, Y: 160, v: -30, acc: '#b8b0d8', bag: 1 }, { X: 520, Y: 620, v: 45, acc: '#d8c49a', bag: 1 },
  ];
  let NOTEHAND = { x: 1250, y: 640 };
  const noteHandAt = (t) => { const [c2, g] = canvas(W, H), Rp = paths(g, t, P17(t)), p = PEOPLE[2], i = 2, Y = p.Y + p.v * (t - CT.s217), [x, y, k] = Rp.P(p.X, Y), s = k * 2.1;
    const ph = (t - CT.s217) * (2.2 + i * .13) * Math.PI * 2 * .5 + i, pose = walk(ph); const [hx, hy] = handPos(x, y - 92 * s, s, pose, 0, p.v < 0, { t, seed: i + 3 }); return { x: hx + 18 * s, y: hy - 6 * s }; };
  const NH18 = noteHandAt(CT.s218);
  function frame217(ctx, t) {
    const Rp = paths(ctx, t, P17(t));
    // ripple where the drop landed
    const tl = CT.s217 + .75, lp = Rp.along('print', .1);
    if (t > tl) { const q = t - tl; for (let k = 0; k < 3; k++) { const qq = q - k * .18; if (qq <= 0) continue; const r = 30 + qq * 260; ctx.save(); ctx.strokeStyle = rgba('#bff5e6', Math.max(0, .7 - qq * .5)); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(lp.x, lp.y, r, r * .28, 0, 0, TAU); ctx.stroke(); ctx.restore(); }
      addGlow(ctx, lp.x, lp.y, 140, .5 * Math.exp(-q * 2), VERD, '#effff9'); }
    // people walking on, bags full (sorted far → near)
    const ppl = PEOPLE.map((p, i) => { const Y = p.Y + p.v * (t - CT.s217), [x, y, k] = Rp.P(p.X, Y); return { ...p, i, x, y, k, Y }; }).sort((p, q) => q.Y - p.Y);
    for (const p of ppl) {
      const s = p.k * 2.1, ph = (t - CT.s217) * (2.2 + p.i * .13) * Math.PI * 2 * .5 + p.i, pose = walk(ph), flip = p.v < 0;
      if (s < .1) continue;
      figureFlat(ctx, p.x, p.y - 92 * s, s, pose, { t, seed: p.i + 3, col: '#454a86', rim: '#d6fff3', rimSide: 1, accent: p.acc, accentPart: 'sweater', skin: '#c99a74', fast: true, flip, shade: .45 });
      const [hx, hy] = handPos(p.x, p.y - 92 * s, s, pose, 0, flip, { t, seed: p.i + 3 });
      ctx.save(); ctx.translate(hx, hy);
      if (p.bag) { ctx.fillStyle = '#5a4532'; ctx.strokeStyle = '#2a1e14'; ctx.lineWidth = 1.5 * s; ctx.beginPath(); ctx.roundRect(-14 * s, 4 * s, 28 * s, 30 * s, 4 * s); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 6 * s, 8 * s, Math.PI, TAU); ctx.stroke();
        ctx.fillStyle = rgba(VERD_L, .9); ctx.fillRect(-9 * s, 6 * s, 18 * s, 4 * s); }   // a note sticks out: the bag is full
      if (p.note) { const N = noteSprite(); ctx.rotate(-.5); ctx.drawImage(N, -8 * s, -22 * s, 48 * s, 22 * s); NOTEHAND = { x: hx, y: hy }; }
      ctx.restore();
    }
    // the drop arrives from above (compensated against the 'down' composite)
    if (t < tl + .05) { const e = eDown(t); dropDraw(ctx, LAND.x, dropY(t) - (1 - e) * H, t); }
    drawFog(ctx, fogLayer('p17', '#6f86b8', .3, 61, 80, 820), t - CT.s217 + 2, 16, .7);
    chip(ctx, 120, 190, 'takes nothing · if prices hold', { check: easeOut(lin(A.nothing - .05, A.nothing + .35, t)), a: easeOut(lin(A.s217 + .3, A.s217 + .8, t)), col: VERD });
    vign(ctx, .45);
  }

  // ═══════════════ 2.18 · the notes in a hand turn to dots and smoke ═══════════════
  const HAND18 = { x: 1060, y: 820, s: 2.5 };
  const eUp = (t) => eio(clamp((t - (CT.s219 - .3)) / .6));
  const hand18 = (t) => {   // the hand's SCREEN track: grips the notes, empties, opens and rises; 2.18 draws it at y - e·H, 2.19 at y + (1 - e)·H
    const open = sm(lin(A.owning + .1, A.owning + .7, t)), rise = easeIO(lin(A.anythingE - .45, CT.s219 + .2, t));
    return { x: HAND18.x - open * 40 + drift(t, 4, 2), y: HAND18.y - open * 60 - rise * 260 + drift(t, 3, 3), ang: mix(-2.2, -1.62, open), close: mix(.55, 0, open), pose: open > .5 ? 'open' : 'grip' };
  };
  function frame218(ctx, t) {
    const PL = plate('ghost', { light: [880, 300], col: VERD }); ctx.drawImage(PL, -150 + drift(t, 6, 7), -100 + drift(t, 4, 8));
    putBloom(ctx, bloomSprite('v9', VERD, 480, .4), 900, 420, 1.3, .5);
    const hd = hand18(t); hd.y -= eUp(t) * H;
    // the notes held fanned between thumb and fingers; each one turns to dots and drifts away
    const N = noteSprite(), pv = [hd.x - 90, hd.y - 160];
    for (let k = 0; k < 3; k++) {
      const p = lin(A.s218 + .25 + k * .22, A.owning + .05 + k * .08, t); if (p >= 1) continue;
      const a = -.62 + k * .26, sc = .62, cx = pv[0] + Math.cos(a - 1.57) * 0, cy = pv[1];
      const solid = 1 - sm(lin(.05, .45, p));
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(a);
      if (solid > 0) { ctx.globalAlpha = solid; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 20; ctx.drawImage(N, -NW * sc * .15, -NH * sc * 1.0, NW * sc, NH * sc); }
      ctx.restore();
      // the ghost outline (screen coords): rectangle + oval, smoking away
      const c0 = Math.cos(a), s0 = Math.sin(a), toS = (lx, ly) => [cx + lx * c0 - ly * s0, cy + lx * s0 + ly * c0];
      const x0 = -NW * sc * .15, y0 = -NH * sc, w = NW * sc, h = NH * sc, rect = [];
      for (let i = 0; i <= 60; i++) { const q = i / 60 * 4, side = Math.floor(q) % 4, f = q - Math.floor(q); const P = [[x0 + w * f, y0], [x0 + w, y0 + h * f], [x0 + w * (1 - f), y0 + h], [x0, y0 + h * (1 - f)]][side]; rect.push(toS(...P)); }
      const oval = []; for (let i = 0; i <= 40; i++) { const q = i / 40 * TAU; oval.push(toS(x0 + w / 2 + Math.cos(q) * w * .17, y0 + h / 2 + Math.sin(q) * h * .25)); }
      const smoke = sm(lin(.35, 1, p)), ga = sm(lin(0, .2, p));
      ghostLine(ctx, rect, { ghost: 1, smoke, col: VERD_L, a: ga, w: 2, dot: 8, t, wind: [.4, -1], seed: k + 1 });
      ghostLine(ctx, oval, { ghost: 1, smoke, col: VERD_L, a: ga * .8, w: 1.6, dot: 7, t, wind: [.3, -1], seed: k + 4 });
    }
    hand(ctx, hd.x, hd.y, HAND18.s, { pose: hd.pose, close: hd.close, ang: hd.ang, skin: '#c99a74', sleeve: PETROL, sleeveLen: 600, rim: '#bfe8dc', light: [-.4, -1], t, seed: 5, spread: 1 });
    chip(ctx, 120, 190, 'owns nothing', { a: easeOut(lin(A.owning - .05, A.owning + .4, t)), col: VERD });
    motes(ctx, t, 900, 380, 640, .8, 13, '200,240,225');
    vign(ctx, .55);
  }

  // ═══════════════ 2.19 · the hand at the tap: who gets what ═══════════════
  const mapBlur = () => once('c4mapBlur', () => { const M = mapCanvas(), [c2, g] = canvas(Math.round(M.width / 6), Math.round(M.height / 6)); g.filter = 'blur(3px)'; g.drawImage(M, 0, 0, c2.width, c2.height); g.filter = 'none'; return c2; });
  const B19 = [[410, 905, .9], [690, 900, .62], [940, 896, .38]];
  const swing19 = (t) => 210 * Math.sin(lin(A.who - .25, A.whatE + .1, t) * Math.PI * 2.2) * sm(lin(A.who - .3, A.who, t)) * (1 - sm(lin(A.whatE - .1, A.whatE + .25, t)));
  const mouth19 = (t) => ({ x: 640 + swing19(t) - 110 * sm(lin(A.whatE, A.whatE + .5, t)), y: 600 });
  const turn19 = (t) => 1.5 * easeOut(lin(A.tap - .2, A.tap + .5, t)) - .8 * easeIO(lin(A.tap + .6, A.who - .2, t)) + .5 * Math.sin(lin(A.who - .2, A.whatE, t) * Math.PI * 3) - 1.25 * easeIO(lin(A.whatE, A.whatE + .5, t));
  const open19 = (t) => clamp(.25 + turn19(t) * .5, .04, 1) * sm(lin(CT.s219 - .1, CT.s219 + .2, t));
  const whip19 = (t) => easeIn(lin(CT.s220 - .4, CT.s220 + .15, t)) * 700;
  function frame219(ctx, t) {
    const sh = whip19(t);
    const PL = plate('tap19', { light: [980, 160], col: AMBER, base: '#14152e' }); ctx.drawImage(PL, -150 + drift(t, 5, 9) + sh * .4, -100);
    // the map table below, out of focus
    const MB = mapBlur(); ctx.save(); ctx.globalAlpha = .9; ctx.drawImage(MB, -420 + sh * .8, 420, MB.width * 6 * .95, MB.height * 6 * .95); ctx.restore();
    const g = ctx.createLinearGradient(0, 700, 0, 860); g.addColorStop(0, 'rgba(10,10,28,.9)'); g.addColorStop(1, 'rgba(10,10,28,0)'); ctx.fillStyle = g; ctx.fillRect(0, 700, W, 160);
    putBloom(ctx, bloomSprite('a5', AMBER, 520, .35), 900 + sh, 200, 1.4, .5);
    ctx.save(); ctx.translate(sh, 0);
    const fill19 = [.45 + .3 * sm(lin(A.who - .2, A.whatE, t)), .2 + .25 * sm(lin(A.who, A.whatE, t)), .08 + .06 * sm(lin(A.who + .3, A.whatE, t))];
    B19.forEach(([x, y, s], k) => bucket(ctx, x, y, s, fill19[k], { t }));
    const src = (tb) => { const m = mouth19(tb); return { x: m.x + 4, y: m.y + 14, vx: (mouth19(tb + .05).x - m.x) * 6, vy: 230 }; };
    stream(ctx, t, { src, open: open19, rate: 95, s: .9, floor: (x) => 862, seed: 21, spread: 30 });
    const m = mouth19(t), tap = drawTap(ctx, m.x, m.y, .92, { ang: .12, turn: turn19(t) * 2.2, res: 2 });
    // the hand: comes up from below (continuous with 2.18), grips the front of the wheel rim and turns with it
    const grip = easeOut(lin(CT.s219 + .15, CT.s219 + .8, t)), e = eUp(t);
    const wx = tap.wheel[0], wy = tap.wheel[1], th = Math.PI / 2 - .25 + .18 * Math.sin(turn19(t) * 1.3);
    const rimP = [wx + Math.cos(th) * tap.wheelR, wy + Math.sin(th) * tap.wheelR * .34];
    const h18 = hand18(t), from = [h18.x, h18.y + (1 - e) * H];
    const hx = mix(from[0], rimP[0] + 55, grip), hy = mix(from[1], rimP[1] + 70, grip);
    hand(ctx, hx, hy, 1.15, { pose: grip > .6 ? 'grip' : 'open', close: grip, ang: mix(-1.62, -2.05, grip), skin: '#c99a74', sleeve: PETROL, sleeveLen: 900, rim: '#ffd59a', light: [-.4, -1], t, seed: 5 });
    ctx.restore();
    vign(ctx, .5);
  }

  // ═══════════════ 2.20 · AGREE: the amber band to the stake at the empty field ═══════════════
  const RIB = (() => { const pts = []; for (let i = 0; i <= 40; i++) { const q = i / 40; pts.push([mix(-.75, -2.42, Math.pow(q, .9)) + Math.sin(q * 3.2) * .22, mix(1.25, 6.15, q)]); } return pts; })();
  const cam220 = (t) => ({ x: mix(300, 0, easeOut(lin(CT.s220 - .15, CT.s220 + .8, t))) + drift(t, 8, 3), y: drift(t, 4, 4), z: 1 + .1 * easeIO(lin(A.agree, CT.s221 + .3, t)), fx: 761, fy: 560 });
  let SHEET20 = { x: 761, y: 558 };
  function frame220(ctx, t) {
    const F = field(ctx, t, { cam: cam220(t), mist: .62, light: 'dawn', pegs: 0, string: 0, post: 1 });
    groundRibbon(ctx, F.P, RIB, { u: easeOut(lin(CT.s220 - .25, A.agree + .1, t)) * .999 + .001, col: AMBER, t, glint: lin(A.agree - .05, A.agreeE + .25, t), w: .2, waves: 16, lines: 6 });
    if (t > A.agreeE) { const gg = sm(lin(A.agreeE, A.agreeE + .3, t)) * (1 - sm(lin(A.agreeE + .4, CT.s221 + .4, t))); addGlow(ctx, F.sheet.x, F.sheet.y, 120, .5 * gg, AMBER, '#fff1d6'); }
    SHEET20 = F.sheet;
    title(ctx, t, A.agree - .1, 1180, 250, 'THE THIRD WAY', 'AGREE', AMBER);
  }

  // ═══════════════ 2.21 · signing at the stake ═══════════════
  const SIG = (() => { const pts = [], x0 = 812, y0 = 676, L = 300; for (let i = 0; i <= 160; i++) { const q = i / 160, lp = Math.sin(q * Math.PI * 7) * (1 - q * .4);
      pts.push([x0 + q * L + Math.sin(q * Math.PI * 14) * 9 * (1 - q), y0 - 26 * Math.abs(lp) * (q < .15 ? q / .15 : 1) + 8 * Math.sin(q * 23) + (q > .85 ? (q - .85) * 60 : 0)]); } return pts; })();
  const S21 = { x: 960, y: 520, w: 540, h: 700, ang: -.02 };
  const sigU = (t) => easeIO(lin(A.s221 + .45, A.settle - .15, t));
  const fieldBg = () => once('c4fbg', () => { const [c2, g] = canvas(W, H); field(g, 201, { cam: { x: -60, y: 30, z: 1.9, fx: 760, fy: 520 }, mist: .7, post: 0 }); const [o, og] = canvas(W, H); og.filter = 'blur(7px)'; og.drawImage(c2, 0, 0); og.filter = 'none'; return o; });
  function frame221(ctx, t) {
    ctx.drawImage(fieldBg(), drift(t, 6, 1) - 10, drift(t, 4, 2) - 8, W + 20, H + 16);
    drawFog(ctx, fogLayer('m21', '#f0d2b8', .32, 31, 500, 1080), t - CT.s221 + 2, 22, .55);
    // the stake (big, out of the frame top and bottom), lit from the low sun on the right
    const sx = 960 + drift(t, 3, 5);
    const wg = ctx.createLinearGradient(sx - 120, 0, sx + 120, 0); wg.addColorStop(0, '#1d140e'); wg.addColorStop(.55, '#5a412c'); wg.addColorStop(.85, '#b88a5c'); wg.addColorStop(1, '#3a2a1c');
    ctx.fillStyle = wg; ctx.fillRect(sx - 120, -10, 240, H + 20);
    ctx.save(); ctx.strokeStyle = 'rgba(20,12,6,.45)'; ctx.lineWidth = 1.2; const r = prng(7);
    for (let i = 0; i < 26; i++) { const x = sx - 115 + r() * 230; ctx.beginPath(); ctx.moveTo(x, -10); ctx.bezierCurveTo(x + 6, 300, x - 6, 700, x + 3, H + 10); ctx.stroke(); } ctx.restore();
    // the sheet with the empty signature line
    const S = { ...S21, y: S21.y + drift(t, 2, 6) };
    fieldSheet(ctx, S, t);
    // the twine at the top holding the sheet
    ctx.save(); ctx.strokeStyle = '#8a6a44'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(sx - 130, S.y - S.h / 2 + 30); ctx.lineTo(sx + 130, S.y - S.h / 2 + 22); ctx.stroke(); ctx.restore();
    // signature: dotted while it is written, the burin makes it solid on "settle"
    const u = sigU(t), bur = easeIO(lin(A.settle - .05, A.settle + .75, t));
    const pts = SIG.map(([x, y]) => [x, y + (S.y - S21.y)]);
    if (u > 0) ghostLine(ctx, pts, { u, ghost: 1, burin: bur > 0 ? bur : undefined, col: '#1b2a6b', w: 3.2, dot: 7, t, foil: AMBER, glow: bur > 0 ? AMBER : null, tipSize: 16 });
    // the seal embosses next to it in the pause
    const st = A.sharedE + .02, sp = lin(st - .14, st, t);
    if (sp > 0) { const s = mix(1.6, 1, easeIn(sp)), a = Math.min(1, sp * 3); ctx.save(); ctx.globalAlpha = a; ctx.translate(1120, S.y + 150); ctx.scale(s, s); seal(ctx, 0, 0, 52, t, { foil: true, label: 'AGREED · BEFORE · THE · HARVEST', emblem: 'none' }); ctx.restore();
      if (t > st) { const q = t - st; ring(ctx, 1120, S.y + 150, 60 + q * 260, 60 + q * 260, { lines: 4, band: 10, wave: 24, col: '#fff1d6', glow: AMBER, a: Math.max(0, 1 - q * 2.2) }); } }
    // the pen and the writing hand (petrol sleeve), from the upper right
    const ins = easeOut(lin(A.s221 - .1, A.s221 + .5, t)), outp = easeIn(lin(A.settle - .25, A.settle + .45, t));
    if (ins > 0 && outp < 1) {
      const n = Math.max(1, Math.floor(u * (pts.length - 1))), tip = u > 0 ? pts[n] : [pts[0][0] - 20, pts[0][1] - 40];
      const lift = u > 0 && u < 1 ? .05 + .1 * Math.max(0, Math.sin(t * 9)) : .6;
      const nx = tip[0] + (1 - ins) * 600 + outp * 520, ny = tip[1] - (1 - ins) * 400 - outp * 380, pa = -.95;
      pen(ctx, nx, ny, 1.25, { ang: pa, lift, t });
      const wr = [nx + Math.cos(pa) * 205, ny + Math.sin(pa) * 205 - 14];
      hand(ctx, wr[0], wr[1], 1.3, { pose: 'write', ang: pa + Math.PI + .12, flip: true, skin: '#c99a74', sleeve: PETROL, sleeveLen: 700, rim: '#ffd59a', light: [.6, -.8], t, seed: 8 });
    }
    // warm sun from the right
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createRadialGradient(1800, 300, 0, 1800, 300, 1100); lg.addColorStop(0, 'rgba(255,190,130,.22)'); lg.addColorStop(1, 'rgba(255,190,130,0)'); ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H); ctx.restore();
    vign(ctx, .45);
  }

  // ═══════════════ 2.21a · neighbours shake hands, strings split the field, a closed seed bag ═══════════════
  const cam21a = (t) => { const p = easeIO(lin(CT.s221a - .1, A.seed + .4, t)), up = easeIn(lin(A.inE - .35, CT.s223 + .1, t));
    return { x: mix(0, 260, p) + drift(t, 6, 2), y: mix(0, 90, p) + up * 700, z: mix(1.55, 1, easeOut(lin(CT.s221a - .45, A.split + .6, t))), fx: 761, fy: 558 }; };
  let SHEET21a = { x: 761, y: 558, w: 61 };
  function frame221a(ctx, t) {
    const cam = cam21a(t), dv = easeIn(lin(A.inE - .3, CT.s223 + .15, t)) * 900;
    ctx.fillStyle = '#6a5a6e'; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(0, dv);
    const F = field(ctx, t, { cam, mist: .58, light: 'dawn', pegs: sm(lin(A.agreeing + .3, A.split + .3, t)), string: lin(A.split - .1, A.seed + .2, t), post: 1 });
    SHEET21a = F.sheet;
    // the two neighbours at the field edge, right of the stake
    const pA = F.P(-1.45, 6.3), pB = F.P(-.35, 6.75), k = (pA[2] + pB[2]) / 2, s = 1.72 * k / 185;
    const shake = sm(lin(A.agreeing - .35, A.agreeing + .05, t)) * (1 - sm(lin(A.split - .2, A.split + .3, t)));
    const lift = easeOut(lin(A.seed - .3, A.seed + .25, t));
    const poseA = { sh: [mix(.25, 1.15, shake), .15], el: [mix(.35, .25, shake), .3], lean: .03 * shake, head: .05 };
    const poseB = { sh: [mix(.3, 1.15, shake) + lift * .6, .12], el: [mix(.5, .25, shake) + lift * .3, .3], lean: .03 * shake, head: .05 };
    const hipA = [pA[0], pA[1] - 92 * s * pA[2] / k], hipB = [pB[0], pB[1] - 92 * s * pB[2] / k];
    figure(ctx, hipB[0], hipB[1], s * pB[2] / k, poseB, { t, seed: 4, accent: PETROL, accentPart: 'coat', flip: true, light: { x: 1700, y: 380, col: '#ffcf9a', a: .5 }, rim: '#ffd59a', cast: { x: 1700, y: 380 } });
    figure(ctx, hipA[0], hipA[1], s * pA[2] / k, poseA, { t, seed: 2, accent: RUST, accentPart: 'coat', light: { x: 1700, y: 380, col: '#ffcf9a', a: .5 }, rim: '#ffd59a', cast: { x: 1700, y: 380 } });
    // clasped hands shaking on "agreeing"
    if (shake > .6) { const hA = handPos(hipA[0], hipA[1], s * pA[2] / k, poseA, 0, false, { t, seed: 2 }), hB = handPos(hipB[0], hipB[1], s * pB[2] / k, poseB, 0, true, { t, seed: 4 });
      const mx = (hA[0] + hB[0]) / 2, my = (hA[1] + hB[1]) / 2 + Math.sin((t - A.agreeing) * 16) * 5 * s * (1 - lin(A.agreeing, A.split, t));
      ctx.fillStyle = '#c99a74'; ctx.beginPath(); ctx.ellipse(mx, my, 13 * s, 9 * s, 0, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,215,160,.5)'; ctx.beginPath(); ctx.ellipse(mx + 3 * s, my - 3 * s, 6 * s, 3 * s, 0, 0, TAU); ctx.fill(); }
    // the closed seed bag in B's hand
    { const hB = handPos(hipB[0], hipB[1], s * pB[2] / k, poseB, shake > .6 ? 1 : 0, true, { t, seed: 4 }), q = s * pB[2] / k;
      ctx.save(); ctx.translate(hB[0], hB[1] + 4 * q); ctx.fillStyle = '#b89a6a'; ctx.strokeStyle = '#5a4630'; ctx.lineWidth = 1.4 * q;
      ctx.beginPath(); ctx.moveTo(-5 * q, 6 * q); ctx.bezierCurveTo(-22 * q, 14 * q, -20 * q, 40 * q, -4 * q, 42 * q); ctx.lineTo(4 * q, 42 * q); ctx.bezierCurveTo(20 * q, 40 * q, 22 * q, 14 * q, 5 * q, 6 * q); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-5 * q, 6 * q); ctx.lineTo(-9 * q, -3 * q); ctx.lineTo(-2 * q, 1 * q); ctx.lineTo(2 * q, -4 * q); ctx.lineTo(5 * q, 1 * q); ctx.lineTo(9 * q, -3 * q); ctx.lineTo(5 * q, 6 * q); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#3a2a1c'; ctx.lineWidth = 2.4 * q; ctx.beginPath(); ctx.moveTo(-6 * q, 6 * q); ctx.lineTo(6 * q, 6 * q); ctx.stroke();
      ctx.fillStyle = 'rgba(255,215,160,.35)'; ctx.beginPath(); ctx.ellipse(8 * q, 22 * q, 4 * q, 11 * q, -.2, 0, TAU); ctx.fill(); ctx.restore(); }
    ctx.restore();
  }

  // ═══════════════ 2.23 ★ · the three paths from high above, AGREE a quiet foil line in the fog ═══════════════
  const Q23 = .7, ROT23 = -.45;                                     // AGREE point the carrier grows from; world turned so AGREE runs flat
  const opt23 = (cam) => ({ view: 'top', cam, rot: ROT23, life: { take: 1, print: 1, agree: .5 }, fog: 0, labels: true, labelA: .7, glow: .8 });
  const solve23 = (q, tx, ty, z) => {   // camera that puts along('agree', q) at (tx, ty): two Newton steps on the (linear) projection
    const [c2, g] = canvas(W, H); let cam = { x: 0, y: 0, z };
    for (let it = 0; it < 2; it++) {
      const p0 = paths(g, 212, opt23(cam)).along('agree', q), px = paths(g, 212, opt23({ ...cam, x: cam.x + 20 })).along('agree', q), py = paths(g, 212, opt23({ ...cam, y: cam.y + 20 })).along('agree', q);
      const a = (px.x - p0.x) / 20, bb = (py.x - p0.x) / 20, cc = (px.y - p0.y) / 20, d = (py.y - p0.y) / 20, det = a * d - bb * cc || 1, dx = tx - p0.x, dy = ty - p0.y;
      cam = { ...cam, x: cam.x + (d * dx - bb * dy) / det, y: cam.y + (-cc * dx + a * dy) / det };
    }
    const p = paths(g, 212, opt23(cam)).along('agree', q); return { cam, ang: p.ang, x: p.x, y: p.y };
  };
  const REST23 = solve23(Q23, 900, 560, .62), START23 = solve23(.97, 1010, 520, 1.05);
  const cam23 = (t) => { const back = easeIO(lin(A.s223 + .15, A.coming + .25, t)); const S0 = START23.cam, S1 = REST23.cam;
    return { x: mix(S0.x, S1.x, back), y: mix(S0.y, S1.y, back), z: mix(S0.z, S1.z, back) }; };
  const AGREE_PTS = (Rp) => { const out = []; for (let i = 0; i <= 90; i++) { const p = Rp.along('agree', i / 90); out.push([p.x, p.y]); } return out; };
  // the engraved land far below: contour rings of low hills, a river, hatched meadows near the end of AGREE (world units, mapped with P)
  const LAND23 = (() => { const [c2, g] = canvas(64, 64), Rp = paths(g, 212, opt23(REST23.cam)), w = (n, q) => Rp.world(n, q), r = prng(23), hills = [];
    const seeds = [[w('take', .55), 1.2], [w('take', .9), 1], [w('print', .45), .9], [w('print', .85), 1.3], [w('agree', .35), .8], [w('agree', .75), 1.1], [[0, -900], 1.2], [[1400, -400], 1]];
    for (const [[X, Y], k] of seeds) { const ox = (r() - .5) * 700, oy = (r() - .5) * 700; hills.push({ X: X + ox, Y: Y + oy, n: 6 + Math.floor(r() * 5), R: (160 + r() * 140) * k, ph: r() * 9 }); }
    const river = []; const a0 = w('take', .3), a1 = w('agree', .5); for (let i = 0; i <= 60; i++) { const q = i / 60; river.push([mix(a0[0] - 1600, a1[0] + 2200, q) + Math.sin(q * 9) * 160, mix(a0[1] + 1900, a1[1] - 1300, q) + Math.cos(q * 7) * 200]); }
    const end = w('agree', 1), pre = w('agree', .93), dir = Math.atan2(end[1] - pre[1], end[0] - pre[0]);
    const meadows = [[-1, 1], [1, 1], [-1, -1], [1, -1], [0, 2.1], [0, -2.1]].map(([u, v], i) => ({ u, v, i }));
    return { hills, river, end, dir, meadows };
  })();
  function terrain(ctx, Rp, t) {
    ctx.save(); ctx.lineWidth = 1; ctx.lineJoin = 'round';
    for (const h of LAND23.hills) for (let k = 1; k <= h.n; k++) {
      const rr = h.R * k / h.n * 2.2; ctx.strokeStyle = rgba('#aab8ec', .05 + .05 * (k / h.n)); ctx.beginPath();
      for (let i = 0; i <= 64; i++) { const a = i / 64 * TAU, f = 1 + .16 * Math.sin(a * 3 + h.ph + k * .4) + .08 * Math.sin(a * 5 - h.ph * 1.3); const [x, y] = Rp.P(h.X + Math.cos(a) * rr * f, h.Y + Math.sin(a) * rr * f * .8); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke(); }
    // the river: two banks and a faint glint of the dawn on the water
    for (const [off, al] of [[-26, .16], [26, .16], [0, .05]]) { ctx.strokeStyle = rgba(off ? '#9fb7e8' : AMBER, al); ctx.lineWidth = off ? 1.2 : 6; ctx.beginPath(); LAND23.river.forEach(([X, Y], i) => { const [x, y] = Rp.P(X + off, Y); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); }
    // meadows around the empty field: lightly hatched plots
    const [EX, EY] = LAND23.end, ca = Math.cos(LAND23.dir), sa = Math.sin(LAND23.dir);
    for (const m of LAND23.meadows) {
      const cxw = EX + ca * (260 + m.u * 420) - sa * m.v * 300, cyw = EY + sa * (260 + m.u * 420) + ca * m.v * 300, hw = 190, hh = 120;
      const corner = (u, v) => Rp.P(cxw + ca * u - sa * v, cyw + sa * u + ca * v);
      ctx.strokeStyle = rgba('#b9c99a', .12); ctx.lineWidth = 1; ctx.beginPath(); const c0 = corner(-hw, -hh), c1 = corner(hw, -hh), c2 = corner(hw, hh), c3 = corner(-hw, hh); ctx.moveTo(...c0); ctx.lineTo(...c1); ctx.lineTo(...c2); ctx.lineTo(...c3); ctx.closePath(); ctx.stroke();
      for (let i = 1; i < 7; i++) { const v = -hh + i * 2 * hh / 7, p0 = corner(-hw + 10, v), p1 = corner(hw - 10, v); ctx.strokeStyle = rgba('#b9c99a', .07); ctx.beginPath(); ctx.moveTo(...p0); ctx.lineTo(...p1); ctx.stroke(); }
    }
    ctx.restore();
  }
  const OFF23 = () => once('c4off23', () => canvas(W, H));
  function frame223(ctx, t) {
    const qPush = lin(COUT.t - 1.2, COUT.t + .4, t), land = easeOut(lin(CT.s223 - .15, CT.s223 + .95, t));
    const still = 1 - sm(lin(A.toE - .3, COUT.t - 1.3, t)), dX = drift(t, 5, 3) * still, dY = drift(t, 4, 4) * still - (1 - land) * 320;
    const M = (g) => {
      if (t > COUT.t - 1.2) { const p = COUT.pos(t), k = p.s / .45; g.translate(p.x, p.y); g.rotate(p.r - (-.12)); g.scale(k, k); g.translate(-900, -560); }
      g.translate(dX, dY);
      if (Math.abs(REST23.ang + .12) > .002) { g.translate(900, 560); g.rotate(-.12 - REST23.ang); g.translate(-900, -560); }
    };
    // the bands (and everything that lies on them) are drawn into a layer, so the land can go underneath in the same projection
    const [oc, og] = OFF23(); og.setTransform(1, 0, 0, 1, 0, 0); og.clearRect(0, 0, W, H);
    og.save(); M(og);
    const Rp = paths(og, t, { ...opt23(cam23(t)), bg: false });
    const mid = Rp.along('agree', .55), end = Rp.along('agree', 1);
    { og.save(); og.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 9; i++) { const q = .25 + i * .085, p = Rp.along('take', q), fl = .5 + .5 * Math.sin(t * 2.3 + i * 1.9); putBloom(og, bloomSprite('r23', RUST, 160, .5), p.x + Math.sin(t * .7 + i) * 14, p.y - 10 - fl * 8, .5 + fl * .35, .55); }
      og.globalCompositeOperation = 'source-over';
      for (let i = 0; i < 90; i++) { const h1 = (Math.sin(i * 12.9898) * 43758.5453) % 1, h2 = (Math.sin(i * 78.233) * 12543.21) % 1, q = .18 + Math.abs(h1) * .7 + Math.sin(t * (1.5 + Math.abs(h2)) + i) * .006, p = Rp.along('take', q), off = h2 * 9 + Math.sin(t * 3 + i * 2.1) * 2;
        const x = p.x - Math.sin(p.ang) * off, y = p.y + Math.cos(p.ang) * off; og.fillStyle = 'rgba(14,10,22,.9)'; og.beginPath(); og.arc(x, y, 2.4, 0, TAU); og.fill(); og.fillStyle = rgba(i % 4 ? '#e89a7a' : CREAM, .8); og.beginPath(); og.arc(x - .6, y - .6, 1.1, 0, TAU); og.fill(); }
      og.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 80; i++) { const q = ((i / 80) + Math.max(0, t - CT.s223 + .3) * .16) % 1, p = Rp.along('print', .05 + q * .9), L = 22 + (i % 5) * 8, off = ((i * 37) % 9 - 4) * 1.6; og.strokeStyle = rgba(i % 3 ? VERD : '#e2fff6', .75 - q * .35); og.lineWidth = 2.2;
        p.x += -Math.sin(p.ang) * off; p.y += Math.cos(p.ang) * off;
        og.beginPath(); og.moveTo(p.x, p.y); og.lineTo(p.x + Math.cos(p.ang) * L, p.y + Math.sin(p.ang) * L); og.stroke(); }
      og.restore(); }
    // the empty ploughed field where AGREE arrives (furrows along the path, a stake with a tiny glint)
    { const zz = cam23(t).z / .62, L = 150 * zz, Wd = 96 * zz, ca = Math.cos(end.ang), sa = Math.sin(end.ang), cx = end.x + ca * L * .62, cy = end.y + sa * L * .62;
      og.save(); og.translate(cx, cy); og.rotate(end.ang);
      og.save(); og.shadowColor = 'rgba(255,170,90,.35)'; og.shadowBlur = 26; const sg = og.createLinearGradient(0, -Wd / 2, 0, Wd / 2); sg.addColorStop(0, '#4f3524'); sg.addColorStop(1, '#2c1d15');
      og.fillStyle = sg; og.beginPath(); og.roundRect(-L / 2, -Wd / 2, L, Wd, 6); og.fill(); og.restore();
      for (let i = 1; i < 16; i++) { const yy = -Wd / 2 + i * Wd / 16; og.strokeStyle = 'rgba(20,12,8,.55)'; og.lineWidth = 1.6; og.beginPath(); og.moveTo(-L / 2 + 4, yy + 1.2); og.lineTo(L / 2 - 4, yy + 1.2); og.stroke();
        og.strokeStyle = 'rgba(255,200,140,.32)'; og.lineWidth = .9; og.beginPath(); og.moveTo(-L / 2 + 4, yy); og.lineTo(L / 2 - 4, yy + Math.sin(i * 1.7) * .6); og.stroke(); }
      og.fillStyle = '#f3efe2'; og.fillRect(-L / 2 - 9, -Wd / 2 - 12, 6, 8); og.fillStyle = '#5a412c'; og.fillRect(-L / 2 - 7, -Wd / 2 - 4, 2, 7);
      og.restore();
      const sx = end.x + ca * 8 - sa * (Wd / 2 + 10), sy = end.y + sa * 8 + ca * (Wd / 2 + 10); addGlow(og, sx, sy, 22, .45 + .15 * Math.sin(t * 1.3), AMBER, '#fff1d6'); }
    // AGREE: only a quiet foil line in the fog, a slow glint travelling along it
    { const P = AGREE_PTS(Rp); og.save(); og.globalCompositeOperation = 'lighter'; og.lineCap = 'round'; og.lineJoin = 'round';
      for (const [lw, al, col] of [[12, .06, AMBER], [4, .22, AMBER], [1.4, .9, '#fff1d6']]) { og.strokeStyle = rgba(col, al); og.lineWidth = lw; og.beginPath(); P.forEach(([x, y], i) => (i ? og.lineTo(x, y) : og.moveTo(x, y))); og.stroke(); }
      const gq = (Math.max(0, t - CT.s223 + .3) * .11) % 1, gi = Math.floor(gq * (P.length - 1)), g0 = Math.max(0, gi - 8);
      og.strokeStyle = rgba('#fff4dc', .75); og.lineWidth = 2.4; og.beginPath(); for (let i = g0; i <= gi; i++) (i === g0 ? og.moveTo(...P[i]) : og.lineTo(...P[i])); og.stroke();
      addGlow(og, P[gi][0], P[gi][1], 26, .5, AMBER, '#fff1d6'); og.restore(); }
    og.restore();
    // the ground: night plate, the land in the same projection, the dawn lying on AGREE
    const bg = ctx.createRadialGradient(1100, 520, 0, 1000, 560, 1400); bg.addColorStop(0, '#1b2352'); bg.addColorStop(.55, '#0e1336'); bg.addColorStop(1, '#05071a'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    ctx.save(); M(ctx); terrain(ctx, Rp, t); putBloom(ctx, bloomSprite('a23', AMBER, 520, .3), mid.x, mid.y, 2.2, .45); ctx.restore();
    ctx.drawImage(oc, 0, 0);
    // fog banks at four heights: the nearest moves fastest (we are high above)
    const fa = 1 - .6 * qPush;
    { const dg = ctx.createRadialGradient(1750, 520, 0, 1750, 520, 1100); dg.addColorStop(0, rgba(AMBER, .22 * (1 - .5 * qPush))); dg.addColorStop(.5, rgba(AMBER, .06)); dg.addColorStop(1, rgba(AMBER, 0)); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = dg; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    drawFog(ctx, fogLayer('t1', '#8f9cc8', .55, 41), t - CT.s223 + .5, 12, .75 * fa, -30, 'source-over');
    drawFog(ctx, fogLayer('t2', '#ffd9b0', .22, 43, 380, 1080), t - CT.s223 + .5, 26, .55 * fa, 30);
    drawFog(ctx, fogLayer('t3', '#c9d2f2', .5, 47, 0, 560), t - CT.s223 + .5, 58, .58 * fa, -60, 'source-over');
    drawFog(ctx, fogLayer('t4', '#e8ecff', .3, 53, 640, 1080), t - CT.s223 + .5, 90, .3 * fa, 60);
    if (t > COUT.t - 1.25) COUT.draw(ctx, t, { a: sm(lin(COUT.t - 1.25, COUT.t - .75, t)) });
    vign(ctx, .62 - .15 * qPush, 900, 560);
  }

  // ─────────────────────────────── shots ───────────────────────────────
  const C = CIN.into;
  return [
    { t: C.t, tr: C.tr, x: C.x, y: C.y, d: C.d, draw: frame209 },                                                                   // 2.09
    { t: CT.s210, tr: 'cut', d: .1, draw: frame210, sound: [{ f: 'card', t: A.everyoneE + .02, v: .25 }] },                         // 2.10
    { t: CT.s210a, tr: 'cut', d: .1, draw: frame210a },                                                                             // 2.10a
    { t: CT.s212, tr: 'cut', d: .1, draw: frame210a, sound: [{ f: 'stamp', t: strike, v: .32 }] },                                  // 2.12 (plan sequence)
    { t: CT.s214, tr: 'zoom', x: COIN.x, y: COIN.y, depth: 6, d: .8, draw: frameTap, sound: [{ f: 'pages', t: A.countriesE + .05, v: .22 }] },   // 2.14
    { t: CT.s215, tr: 'cut', d: .1, draw: frameTap, sound: [{ f: 'pages', t: A.onegoE + .03, v: .3 }] },                         // 2.15
    { t: CT.s216a, tr: 'cut', d: .1, draw: frameTap },                                                                              // 2.16a
    { t: CT.s216b, tr: 'cut', d: .1, draw: frameTap, sound: [{ f: 'drop', t: A.sliverE + .5, v: .3 }] },                          // 2.16b
    { t: CT.s217, tr: 'down', d: .5, draw: frame217 },                                                                              // 2.17
    { t: CT.s218, tr: 'zoom', x: NH18.x, y: NH18.y, depth: 5, d: .8, draw: frame218 },                                                   // 2.18
    { t: CT.s219, tr: 'up', d: .6, draw: frame219, sound: [{ f: 'tick', t: A.whatE + .25, v: .25 }] },                              // 2.19
    { t: CT.s220, tr: 'whipR', d: .3, draw: frame220, sound: [{ f: 'foil_glint', t: A.agreeE + .05, v: .3 }] },                     // 2.20
    { t: CT.s221, tr: 'zoom', x: 761, y: 558, depth: 5, d: .8, draw: frame221, sound: [{ f: 'stamp', t: A.sharedE + .02, v: .35 }] },   // 2.21
    { t: CT.s221a, tr: 'out', x: 761, y: 558, depth: 5.3, d: .85, draw: frame221a },                                                // 2.21a
    { t: CT.s223, tr: 'whipD', d: .3, draw: frame223, sound: [{ f: 'foil_glint', t: A.toE + .2, v: .35 }] },                        // 2.23 ★
  ];
};
