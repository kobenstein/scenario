// Chapter 03, second half: Sweden, the word, the question, Suleyman (shots.md §6 3.26–3.37 + CLIP S, G2, G3).
// Window: T.S('03b','Researchers in Sweden') - .5  →  T.seg('04a').start - 1.0 (chapter 04 opens on the lit courtyard window).
//
// CARRIER CHAIN (shot → carrier → next shot, type)
//  in   confetti of 3.25 (first-half builder) keeps falling and turns into snow                         (a, match)
//  3.26 snowy Swedish street, walker in amber coat, followed for years → push into the lit VERKSTAD window (b, zoom)
//  3.27 workshop, planing; shavings curl on "working" → one shaving flies up onto the frosted pane       (a, zoom on the pane)
//  3.28 [G2] lottery graphic seen through the frosted pane: the shaving straightens into the winners'
//       line, rising on "more" → the line keeps running out of frame right                              (c, left)
//  3.29 the empty park bench at noon, the line lands as light along the top slat → push into the slats (b, zoom)
//  3.30 [G3a] the slats become the ruled lines of a form; UNEMPLOYED stamped on "word"; the age line runs
//       to 65 → push into the snapshot clipped to the form                                                (b, zoom)
//  3.31 the snapshot is the bench: grey, "the same days" → identical framing, only the light changes  (match)
//  3.32 the same bench, warm; he looks up; "noticeably happier" → pull back, the panel shrinks into
//  3.33 [G3b] the diptych: UNEMPLOYED fades letter by letter, "retired" written by hand → pull back further,
//       the diptych is one card among thousands                                                          (out)
//  3.34 field of forms: on "Nobody is unemployed" every stamp fades outward; "gone" → pages lift as a flock (a, up)
//  3.36 dawn bridge: the pages wheel down as birds; the crowd slows and stops on "run"; one walks on → (c, left)
//  3.37 dark kitchen at night, figure at the window → push into the pane (b, zoom); the reflection sharpens on
//       "job"; push into the reflection, the pane edges become the hairline clip frame
//  S    Suleyman in the pane-frame over the dim courtyard → the frame drops out of the bottom while the
//       window across the courtyard lights amber at screen centre (hand-over to chapter 04)
import { W, H, C, rgba, clamp, lin, mix, sm, eio, eout, ein, sine, prng, drift, text, addGlow } from '../engine.mjs';
import { once, plate, inPlate, toScreen, sprite, walker, snowField, drawSnow, integ } from '../lib/s03b_kit.mjs';
import { streetPlates, ST, workshopPlates, WS, lotteryPlates, LT, road } from '../lib/s03b_sweden.mjs';
import { roughLine, roughPath, hatch, layer, vnoise, mixHex } from '../lib/art.mjs';
import { source } from '../lib/kit.mjs';

const AMBER = { coat: '#e59a3a', coatDark: '#9a5420', pants: '#1a1830', shoes: '#0d0c1c', skin: '#e9c3a0', hair: '#2a1a14' };

export default async function (T) {
  const S = (p) => T.S('03b', p), E = (p) => T.E('03b', p), Sc = (p) => T.S('03c', p), Ec = (p) => T.E('03c', p);
  const t0 = S('Researchers in Sweden') - .5, tEnd = T.seg('04a').start - 1.0, clip = T.clip('S');
  const tCut1 = S('for years') + .16 + .75;                       // push through the workshop window lands here
  const shots = [];

  // ===================================================================================== 3.26 street
  {
    const P = streetPlates(), snow = snowField(7, 260), tYears = S('for years') + .16, tA = t0;
    const wk = walker('st-walk', .8, AMBER, { lightRel: [700, -160, { col: '#ffd59a', a: .55 }], rim: '#ffd59a', rimSide: 1, rimW: 1.8 }, 8, { hood: true, coat: .8 });
    const tPush = tYears - .15;
    const cam = (t) => { const e = eio(lin(tPush, tCut1 + .3, t)), [fx, fy] = ST.shopWin; return { x: drift(t, 16) - (t - tA) * 6 + (W / 2 - fx) * e * .2, y: drift(t, 6, 2) + (H / 2 - fy) * e * .3, z: (1.06 + (t - tA) * .012) * Math.pow(6.5, e), fx, fy }; };
    const X0w = 430, X1w = 1150, wpath = (t) => { const u = lin(tA - .5, tYears + .9, t), x = mix(X0w, X1w, u); return { x, y: mix(900, 812, u), k: mix(.92, .66, u), d: x - X0w }; };
    shots.push({
      t: t0, tr: 'match', d: .9,   // the first-half builder's confetti keeps falling into this shot and turns to snow
      draw(ctx, t) {
        const c = cam(t);
        plate(ctx, P.sky, c, .25); plate(ctx, P.gnd, c, .8); plate(ctx, P.town, c, .7);
        inPlate(ctx, c, .82, (g) => {
          const w = wpath(t);
          // footprints behind the walker: the trail of the years
          for (let i = 1; i < 40; i++) { const dd = w.d - i * 30; if (dd < 0) break; const u = dd / (X1w - X0w), x = X0w + dd, k = mix(.92, .66, u), y = mix(900, 812, u) + 88 * .8 * k + (i % 2 ? 5 : -5) * k;
            g.fillStyle = rgba('#3e5a7c', .6 * (1 - i / 40)); g.beginPath(); g.ellipse(x, y, 9 * k, 3.5 * k, -.1, 0, 7); g.fill(); }
          g.fillStyle = rgba('#2c3e58', .4); g.beginPath(); g.ellipse(w.x - 60 * w.k, w.y + 70 * w.k, 90 * w.k, 9 * w.k, -.08, 0, 7); g.fill();
          wk.draw(g, w.x, w.y, w.d / 120, w.k);
        });
        drawSnow(ctx, snow.slice(0, 160), t, { a: .8, wind: 24, speed: 50, confetti: 1 - sm(lin(t0 - .3, t0 + .9, t)) });
        plate(ctx, P.fg, c, 1.25);
        drawSnow(ctx, snow.slice(160), t, { a: .9, wind: 34, speed: 80, sizeK: 1.6, confetti: 1 - sm(lin(t0 - .3, t0 + .9, t)) });
        // labels: place + "followed for years" riding with the walker's trail
        const a = eout(lin(S('Sweden'), S('Sweden') + .6, t)) * (1 - lin(tPush, tPush + .4, t));
        if (a > 0) { ctx.fillStyle = rgba(C.amber, a); ctx.fillRect(110, 96, 28, 2); text(ctx, 'SWEDEN', 110, 128, { size: 17, weight: 600, color: '#c9d6e6', spacing: 6, alpha: a }); text(ctx, 'lottery winners, followed for years', 110, 168, { size: 30, font: 'Instrument Serif Italic', color: '#eef2f8', alpha: a * eout(lin(S('followed'), S('followed') + .6, t)) }); }
      },
    });
  }

  // ===================================================================================== 3.27 workshop
  const tWork = S('kept working') + .24;
  const flyEnd = tWork + .95;
  const wsCam = (t) => { const e = eio(lin(tWork + .25, flyEnd + .3, t)), [fx, fy] = WS.win; return { x: drift(t, 10, 1) + (t - tWork) * -8 + (W / 2 - fx) * e, y: drift(t, 5, 3) + (H / 2 - fy) * e, z: (1.05 + (t - tWork) * .015) * Math.pow(6, e), fx, fy }; };
  {
    const P = workshopPlates(), period = 1.15, push = .62;
    const sOff = tWork - push;                                     // a push stroke ends exactly on "working"
    const N = 7, frames = [];
    for (let i = 0; i < N; i++) { const u = i / (N - 1); frames.push(sprite('ws-plane' + i, 2.6, { lean: mix(.2, .44, u), head: .3, sh: [mix(.7, 1.45, u), mix(.62, 1.36, u)], el: [mix(1.25, .22, u), mix(1.32, .3, u)], hip: [.12, -.12], kn: [.05, .05], hair: 'short' },
      { dress: Object.assign({}, AMBER, { coat: '#d98a34' }), lightRel: [100, -500, { col: '#ffd59a', a: .6 }], rim: '#ffe3b0', rimSide: 1, rimW: 2.4 })); }
    const strokeU = (t) => { const ph = ((t - sOff) / period % 1 + 1) % 1; return ph < push / period ? sine(ph * period / push) : 1 - sine((ph - push / period) / (1 - push / period)); };
    const boardY = (x) => 700 - (x - 440) * .01875;
    const curlAt = (n) => sOff + n * period + push;                // stroke n ends (shaving released)
    shots.push({
      t: tCut1, tr: 'match', d: .5,
      draw(ctx, t) {
        const c = wsCam(t), u = strokeU(t), fi = Math.round(u * (N - 1)), fr = frames[fi];
        plate(ctx, P.back, c, .6);
        inPlate(ctx, c, .9, (g) => {
          const h0 = fr.hand(0), px = 600 + u * 260, py = boardY(px) - 2, hipX = px - h0[0] - 8, hipY = py - 12 - h0[1];
          fr.draw(g, hipX, hipY + Math.sin(t * 2.1) * 1.2);
          g.drawImage(P.bench, 0, 0);
          // the plane in the hands
          g.save(); g.translate(px - 10, py); g.rotate(-.025); g.fillStyle = '#4a2410'; g.beginPath(); g.roundRect(-10, -26, 92, 26, 5); g.fill(); g.fillStyle = '#7a4420'; g.fillRect(-6, -24, 84, 5); g.fillStyle = '#2a1408'; g.beginPath(); g.ellipse(4, -30, 10, 12, -.3, 0, 7); g.fill(); g.fillStyle = '#c8c8d0'; g.fillRect(40, -34, 6, 10); g.restore();
          // the shaving rising out of the plane mouth during a push: a curl that grows
          const ph = ((t - sOff) / period % 1 + 1) % 1, grow = ph < push / period ? ph * period / push : 0;
          if (grow > .05) curl(g, px + 72, py - 22, 4 + grow * 16, grow * 4.2, '#f2c48a');
          // released shavings fall onto the floor pile; the one on "working" flies to the frosted window
          for (let n = -3; n <= 3; n++) {
            const tr = curlAt(n), age = t - tr; if (age < 0 || age > 1.6) continue;
            const big = Math.abs(tr - tWork) < .05, sx0 = 600 + 260 + 72, sy0 = boardY(sx0) - 26;
            if (big) {
              const v = clamp(age / (flyEnd - tWork)), e = eio(v), [ex, ey] = WS.win;
              const x = mix(sx0, ex, e) + Math.sin(v * Math.PI) * -60, y = mix(sy0, ey, e) - Math.sin(v * Math.PI) * 140;
              curl(g, x, y, 26 + v * 6, 1.6, '#ffd59a', t * 5);
              addGlow(g, x, y, 50, .18 * v, C.amber, '#fff1d6');
            } else { const x = sx0 + age * 90, y = sy0 + 260 * age * age; curl(g, x, Math.min(y, 1000), 14, 4.2, '#e8b878', age * 5); }
          }
        });
        plate(ctx, P.lampL, c, 1.05);
      },
    });
  }

  // ===================================================================================== 3.28 [G2] lottery chart
  const tChart = flyEnd + .1;
  const chartCam = (t) => ({ x: drift(t, 10, 5) - (t - tChart) * 7, y: drift(t, 5, 6), z: 1.04 + (t - tChart) * .008 + 1.4 * Math.pow(1 - eout(lin(tChart - .3, tChart + 1.1, t)), 2), fx: W / 2, fy: H / 2 });
  {
    const P = lotteryPlates(), { T: TK, GOLD, HOT } = LT;
    const dress = [['#3a5070', '#1a1f30'], ['#6a3a50', '#202030'], ['#2f5a4a', '#1b2228'], ['#7a5a3a', '#22202a'], ['#4a4a6a', '#18182a'], ['#8a3a2a', '#1d1b26'], ['#e59a3a', '#14141e']];
    const hairs = ['short', 'long', 'bun', 'curly', 'cap'];
    const cyc = dress.map((d, i) => walker('lt-w' + i, .6, { coat: d[0], pants: d[1], shoes: '#0b0a12', skin: '#d9a77e', hair: ['#2a1a14', '#5a3a20', '#1a1010', '#c9b8a0'][i % 4] }, { lightRel: [-500, -700, { col: HOT, a: .45 }], rim: HOT, rimSide: -1, rimW: 1.6, shadeA: .1 }, 8, { hair: hairs[i % 5], coat: i % 3 === 0 ? .8 : 0 }));
    const r = prng(21), walkers = [];
    for (let i = 0; i < 26; i++) { const q = .14 + Math.pow(i / 26, .9) * .78, side = (r() - .5) * 1.4; walkers.push({ q, side, i, ph: r() }); }
    // chart geometry (as approved in g1)
    const X0 = 1300, X1 = 1820, Y0 = 520, Y1 = 260, n = vnoise(3), base = (x) => Y0 - 90 + (n(x * .02, 1) - .5) * 6, xw = X0 + 130;
    const win = (x) => x < xw ? base(x) : base(x) - 70 * (1 - Math.exp(-(x - xw) / 60)) + (n(x * .05, 4) - .5) * 4;
    const pts = []; for (let x = X0; x <= X1; x += 4) pts.push([x, win(x)]);
    const fill = once('lt-fill', () => { const [c, g] = layer(); g.beginPath(); g.moveTo(...pts[0]); for (const p of pts) g.lineTo(...p); for (const [x] of [...pts].reverse()) g.lineTo(x, base(x)); g.closePath(); g.clip(); hatch(g, [X0, Y1, X1 - X0, Y0 - Y1], { angle: -.8, gap: 6, w: 1.2, col: GOLD, a: .45, seed: 9, broken: .2 }); return c; });
    const tMore = S('more satisfied'), tLine0 = tChart + .45, tRise = tMore - .3, tRun = E('not less') - .1;
    const rev = (t) => t < tRise ? mix(X0, xw, eio(lin(tLine0, tRise, t))) : mix(xw, X1, eout(lin(tRise, tRun - .2, t)));
    shots.push({
      t: tChart, tr: 'match', d: .5,
      draw(ctx, t) {
        const c = chartCam(t);
        plate(ctx, P.far, c, .3);
        inPlate(ctx, c, .35, (g) => { g.save(); g.translate(TK.x + Math.sin(t * .5) * 6, TK.y + Math.sin(t * .7) * 5); g.rotate(Math.sin(t * .4) * .01); g.drawImage(P.tk, -380, -260); g.restore(); });
        plate(ctx, P.near, c, .7);
        inPlate(ctx, c, .72, (g) => {
          const list = walkers.map((w) => { const q = w.q + (t - tChart) * .006 * (1.2 - w.q), [lx, ly] = road(q, -1), [rx, ry] = road(q, 1); return { x: mix(lx, rx, .5 + w.side * .35), y: mix(ly, ry, .5), s: .9 * Math.pow(1 - q, 1.25) + .07, w }; }).sort((a, b) => a.y - b.y);
          for (const p of list) { g.fillStyle = rgba('#070a18', .35); g.beginPath(); g.ellipse(p.x + 50 * p.s, p.y + 2, 70 * p.s, 7 * p.s, .15, 0, 7); g.fill();
            cyc[p.w.i % 7].draw(g, p.x, p.y - 88 * p.s, (t - tChart) * 1.3 + p.w.ph, p.s / .6); }
        });
        // annotation on the picture
        const aK = eout(lin(tChart + .3, tChart + 1, t));
        if (aK > 0) { ctx.save(); ctx.globalAlpha = aK; ctx.strokeStyle = rgba('#e8e2f6', .6); ctx.lineWidth = 1.3; ctx.setLineDash([2, 5]); ctx.beginPath(); ctx.moveTo(700, 880); ctx.lineTo(mix(700, 1030, aK), 880); ctx.lineTo(1080, 860); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = '#e8e2f6'; ctx.beginPath(); ctx.arc(700, 880, 3, 0, 7); ctx.fill(); ctx.restore();
          text(ctx, 'Most kept working.', 1095, 868, { size: 38, font: 'Instrument Serif', color: '#f3efe2', alpha: aK }); text(ctx, 'The effect of the win on work was small.', 1095, 900, { size: 16, weight: 400, color: '#b9c0dc', alpha: aK }); }
        // the pane: frost, then the chart drawn on the glass
        plate(ctx, P.frost, c, 1.15, mix(.95, .7, lin(tChart, tChart + 2, t)));
        inPlate(ctx, c, 1.1, (g) => {
          const hA = eout(lin(tChart + .2, tChart + .9, t)), dy = (1 - hA) * 14;
          g.fillStyle = rgba(GOLD, hA); g.fillRect(X0, 110 + dy, 28, 2);
          text(g, 'SWEDISH LOTTERY WINNERS', X0, 142 + dy, { size: 16, weight: 600, color: '#a9b0d0', spacing: 5, alpha: hA });
          const h2 = eout(lin(S('And years later'), S('And years later') + .7, t));
          text(g, 'Years later, more satisfied', X0, 200 + (1 - h2) * 14, { size: 44, font: 'Instrument Serif', color: '#f3efe2', alpha: h2 });
          text(g, 'with their lives, not less.', X0, 244 + (1 - h2) * 14, { size: 44, font: 'Instrument Serif Italic', color: HOT, alpha: eout(lin(S('their lives'), S('their lives') + .6, t)) });
          text(g, 'LIFE SATISFACTION · SCHEMATIC', X0, Y1 + 26, { size: 13, weight: 600, color: '#8f96b8', spacing: 4, alpha: hA });
          // axis + comparison line (did not win): dotted, draws in with the baseline
          const xr = rev(t), bA = lin(tLine0 - .1, tLine0 + .3, t);
          g.strokeStyle = rgba('#d6d1ea', .35 * bA); g.lineWidth = 1.2; g.beginPath(); g.moveTo(X0, Y0 - 40); g.lineTo(mix(X0, X1, eout(lin(tLine0, tLine0 + 1.2, t))), Y0 - 40); g.stroke();
          g.setLineDash([3, 6]); g.strokeStyle = rgba('#c9c4e0', .7 * bA); g.lineWidth = 2; g.beginPath(); for (let x = X0; x <= Math.max(X0 + 1, xr); x += 6) g.lineTo(x, base(x)); g.stroke(); g.setLineDash([]);
          // winners: hatch fill + line up to the reveal point, glowing head
          g.save(); g.beginPath(); g.rect(X0, 0, xr - X0, H); g.clip(); g.drawImage(fill, 0, 0); g.restore();
          const vis = pts.filter((p) => p[0] <= xr); if (vis.length > 1) roughLine(g, vis, { w: 4, col: GOLD, seed: 7, amp: .3 });
          if (xr > X0 + 2 && t < tRun + .2) { const hy = win(xr); addGlow(g, xr, hy, 30 + 30 * Math.exp(-Math.pow((t - tMore) / .25, 2)), .8, C.amber, '#fff3dd'); }
          const wA = eout(lin(tRise - .2, tRise + .2, t));
          if (wA > 0) { g.fillStyle = rgba(HOT, wA); g.beginPath(); g.arc(xw, base(xw), 6, 0, 7); g.fill(); text(g, 'the win', xw - 30, Y0 - 12, { size: 15, weight: 600, color: '#a9b0d0', spacing: 2, alpha: wA }); }
          text(g, 'years later →', X1, Y0 - 12, { size: 15, weight: 600, color: '#a9b0d0', spacing: 2, align: 'right', alpha: bA });
          const lA = eout(lin(tMore + .3, tMore + 1, t));
          text(g, 'winners', X1, win(X1) - 14, { size: 22, font: 'Instrument Serif Italic', color: HOT, align: 'right', alpha: lA });
          text(g, 'similar people who didn’t win', X1, base(X1) + 22, { size: 15, weight: 400, color: '#c9c4e0', align: 'right', alpha: lA });
          // the line runs on out of the frame to the right (motion carrier into the bench)
          const ru = ein(lin(tRun, tRun + .7, t));
          if (ru > 0) { const xe = mix(X1, X1 + 1400, ru), y = win(X1); roughLine(g, [[X1, y], [xe, y + (xe - X1) * .02]], { w: 4, col: GOLD, seed: 8, amp: .2 }); addGlow(g, xe, y + (xe - X1) * .02, 60, .9, C.amber, '#fff3dd'); }
        });
        // the shaving arrives at the centre of the pane and unrolls into the start of the line
        const v = lin(tChart - .4, tLine0 + .1, t);
        if (v < 1) { const [sx, sy] = toScreen(chartCam(t), 1.1, X0, base(X0)), e = eio(v), x = mix(W / 2, sx, e), y = mix(H / 2, sy, e); curl(ctx, x, y, 34 * (1 - e) + 3, 1.6 * (1 - e) + .2, '#ffd59a', t * 4); addGlow(ctx, x, y, 50, .25, C.amber, '#fff1d6'); }
        source(ctx, t, tChart + .6, 1e9, 'Cesarini, Lindqvist, Notowidigdo & Östling (2017), AER · Lindqvist, Östling & Cesarini (2020), REStud', { x: 110, y: 1030 });
      },
    });
  }

  // ===================================================================================== placeholders for the rest (filled below)
  const rest = await (await import('../lib/s03b_rest.mjs')).default(T, { curl });
  shots.push(...rest);
  return shots;
}

// a wood shaving: an Archimedean curl of `turns` turns, outer radius r, drawn as a ribbon
function curl(g, x, y, r, turns, col, rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot); g.lineCap = 'round';
  const n = Math.max(8, Math.round(turns * 18));
  g.beginPath(); for (let i = 0; i <= n; i++) { const q = i / n, a = q * turns * Math.PI * 2, rr = r * (1 - q * .85); i ? g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : g.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  g.strokeStyle = rgba('#7a4a20', .8); g.lineWidth = 4.2; g.stroke(); g.strokeStyle = col; g.lineWidth = 2.6; g.stroke(); g.restore();
}
