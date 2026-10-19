// Film 04 · every appearance of the labelled Maslow hill (the film's visual spine). Built once (lib/hill_world.mjs, port of
// the approved art test ref/kunst/a1.mjs) and driven by a 2.5D camera; plates for the push-ins live in lib/hill_*.mjs.
//
// CARRIER CHAIN (incoming → my shots → outgoing; a = exit/land, b = push-in/morph, c = motion match)
//  HILL 1  02a "And it's not just you" −0.6 … 03a −1.2
//    in   grandmother's kitchen (s02) → tr 'out' (b, reversed): the kitchen shrinks into HER WINDOW at (960, 500) of my
//         first frame; the steam keeps curling out of that window.
//    1.1  crane up + out along the base street: doors swing open from her house outward on "you", neighbours at thresholds
//    1.2  continuous pull-back to the full labelled hill (dusk), labels fade in pale; on "home" the base (Physiological ·
//         Safety) lights house by house from the centre outward, reflections bloom, base label turns cream, title types in
//    1.3  "You don't have to. / Not anymore." long pull-back; the last rose daylight slides off the frame top (a) → 03 (dim room)
//  HILL 2 in  04a "First, to people" −0.5 … "Time for the ones" −0.4
//    in   walker steps off the G4 curve onto a string of lights (s04) → tr 'match' at the string (960, 470): the string hangs
//         between two Belonging houses; push-in, Belonging label grows; one window detaches, grows to the frame (ghost
//         rectangles) and becomes the kitchen (you + your mother, she starts pouring) → s04 continues inside that kitchen (match)
//  HILL 2 out 04a "Now there's time" −0.5 … "Streets full" −0.5
//    in   lift doors open (s04) → tr 'zoom' into the gap: a night street, neighbours carry tables out and join them end to end
//    2.1  pull back past roofs to the labelled hill: the joined tables become one amber line around the Belonging terrace,
//         the line closes on "tribe", the terrace lights from it, label turns cream → s04 "Streets full" (b, down into a street)
//  HILL 3  05a "Something made by human" −0.5 … "When people in Kenya" −0.5
//    in   brush stroke whips right (s05) → tr 'right' (c): the hill lands moving right with smear + ease-out, two levels lit
//    3.1  push-in onto the Esteem / Self-actualization street; on "hands" the house fronts lift away (cut-away street);
//         truck right: potter · juggler (joy) · violin at forty · grandfather + child at the plane · office whose paper stacks
//         lift off like doves through the opened roof (disappear) · sign painter finishes "Open" on "meaning", neighbours
//         look in · pull back: the whole street busy ("working")
//    out  the sign painter's brush stroke sweeps across at mid-height, left → right (c) → G5 coastline (s05)
//  HILL 3 out 05b "It means" −0.4 … CLIP A −0.6
//    in   the potter's hands at rest (s05) → tr 'out' (b reversed) into the potter's room
//    3.2  pull back out of the cut-away street to the labelled hill; Esteem then Self-actualization light in one sweep L→R
//         on "wanting"; the sweep whips right (c) → CLIP A (frame slides in from the left)
//  HILL 4  07d "What is this life" −0.6 … "It's a question you only" −0.5
//    in   tilt up from the procession (s07) → tr 'up' (c): night sky; the labelled hill rises into frame from below,
//         four levels lit; push-in to three people on the summit; summit label lights on "for"; Self-transcendence lets go
//         of its lights: a slow, wide drift up into the sky, amber cooling to star-white (no column)
//    4.1  "No job can answer that for you. / Not this film either." pull-back: the whole hill, all five lit, small under
//         an open sky full of its released lights; the hill dims, the labels fade last → s07 night sky (dissolve/match)
import { C, rgba, clamp, mix, prng, mixHex } from '../lib/art.mjs';
import { drawHill, drawLabels, skyPal, layers, prepareHill, cx, apexY, baseY, hw, BANDS, half, edge, arcY, levelMid } from '../lib/hill_world.mjs';
import { camKeys, proj, fig, drift, paper, sineE, quartIO, cubicOut, cubicIn, lerpPose, q, vig, smear } from '../lib/hill_art.mjs';
import { drawStreet, prepareStreet, ROOMS, FL, brushStroke } from '../lib/hill_street.mjs';
import { drawTable, prepareTable } from '../lib/hill_table.mjs';
import { kitchen } from '../lib/hill_kitchen.mjs';

const sm = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
const lin = (a, b, t) => clamp((t - a) / (b - a));
const on = (t, t0, d = .3) => sm((t - t0) / d);

// a neighbour / figure placed in world space (feet at wx, wy; worldH = standing height in world units)
function npc(ctx, M, key, wx, wy, worldH, pose, o, t, { ph = 0, alpha = 1, maxK = 4.5 } = {}) {
  const sW = worldH / 180, sR = Math.min(1.6, sW * maxK), sc = sW * M.k / sR;
  if (sc * sR < .02) return;
  const hipY = M.Y(wy) - 88 * sW * M.k;
  return fig(ctx, key, M.X(wx), hipY, sR, pose, o, { t, ph, alpha, sc });
}
const DR = {
  warm1: { coat: '#6a3a2e', pants: '#24182a', shoes: '#120c16', skin: '#e2b48e', hair: '#2a1a14' },
  warm2: { coat: '#3e3550', pants: '#1a1626', shoes: '#0d0b14', skin: '#c99a76', hair: '#151018' },
  warm3: { coat: '#7a5a3a', pants: '#2a2230', shoes: '#120e14', skin: '#efc39d', hair: '#3a2214' },
  grey: { coat: '#4a4658', pants: '#24222e', shoes: '#0e0d14', skin: '#dcb291', hair: '#cfc8bc' },
  amber: { coat: '#e59a3a', pants: '#1a1830', shoes: '#0d0c1c', skin: '#e9c3a0', hair: '#2a1a14' },
  night: { coat: '#2a2440', pants: '#16142a', shoes: '#0a0912', skin: '#b89078', hair: '#120e18' },
};
const RIM = '#ffd9a0';

// ------------------------------------------------------------------------------------------------ HILL 1
function hill1(T) {
  const A = T.S('02a', "And it's not just you") - .6, B = T.seg('03a').start - 1.2;
  const tYou = T.S('02a', 'just you') + .5, tHome = T.S('02a', 'home'), tNot = T.S('02a', 'Not anymore');
  let G = null;
  const geo = () => {
    if (G) return G;
    const Ly = layers();
    const front = Ly.houses.filter((h) => h.b === 0 && h.gy > 740);
    // her house: front row, right of centre, with an upper window
    const gh = front.filter((h) => h.hx > cx - 40 && h.hx < cx + 260 && h.win.some((w) => !w.door && w.y < h.gy - h.h * .55)).sort((p, q2) => Math.abs(p.hx - cx - 90) - Math.abs(q2.hx - cx - 90))[0] || front[0];
    const gw = gh.win.filter((w) => !w.door).sort((p, q2) => p.y - q2.y)[0];
    const doors = [];
    for (const h of Ly.houses.filter((h2) => h2.b === 0)) for (const w of h.win) if (w.door && Math.abs(w.x - gh.hx) < 620) doors.push({ ...w, house: h, d: Math.abs(w.x - gh.hx) });
    doors.sort((p, q2) => p.d - q2.d);
    G = { gh, gw: { x: gw.x, y: gw.y + gw.h * .5, w: gw.w, h: gw.h }, doors: doors.slice(0, 12) };
    return G;
  };
  const poses = [
    { lean: .02, head: .15, sh: [.25, -.1], el: [.6, .9], hip: [.05, -.05], kn: [0, .05], hair: 'bun', skirt: true },
    { lean: -.03, head: -.1, sh: [.45, .35], el: [1.5, 1.4], hip: [.08, -.1], kn: [.02, .08], hair: 'short', coat: .4 },
    { lean: .05, head: .25, sh: [.1, 2.4], el: [.3, .5], hip: [.06, -.04], kn: [0, .04], hair: 'grey' },
    { lean: 0, head: .05, sh: [.3, -.2], el: [.4, .6], hip: [.04, -.06], kn: [0, .06], hair: 'curly', bulk: .85 },
    { lean: -.06, head: -.2, sh: [.2, .15], el: [.3, .3], hip: [.1, -.08], kn: [.02, .1], hair: 'long', skirt: true },
  ];
  const dress = [DR.warm1, DR.warm2, DR.grey, DR.warm3, DR.night];
  const draw = (ctx, t) => {
    const g = geo();
    const wx = g.gw.x, wy = g.gw.y;
    let cam = camKeys(t, [
      { t: A, x: wx, y: wy + 25, z: 4.4 },
      { t: A + 2.4, x: wx - 30, y: wy - 25, z: 2.25, e: (x) => 1 - Math.pow(1 - x, 2.2) },
      { t: tHome - 1.4, x: 800, y: 500, z: 1.16, e: quartIO },
      { t: tHome + .4, x: 790, y: 492, z: 1.08 },
      { t: B + .7, x: 735, y: 452, z: .82, e: sineE },
    ]);
    cam = { x: cam.x + drift(t, 3 / cam.z, 1), y: cam.y + drift(t, 2 / cam.z, 2), z: cam.z * (1 + .003 * Math.sin(t * .5)) };
    const night = sm(lin(A, B + .5, t)) * .85;
    const dayOff = sm(lin(tNot - 1.4, B + .3, t));
    const lit0 = (h) => {
      if (h === g.gh) return 1;
      if (h.b !== 0) return 0;
      return on(t, tHome + h.o * 1.25 + (h.row ? .1 : 0), .22) * (h.o < .9 ? 1 : .8);
    };
    const doorOpen = (d, i) => on(t, tYou - .5 + i * .09, .45);
    const M = drawHill(ctx, t, {
      cam, sky: skyPal('dusk', 'night', night), stars: .25 + .75 * night,
      house: lit0, jetty: sm(lin(1.5, 1.2, cam.z)), glowMul: 1,
      skyFx: (c, M2, Ms) => {   // the last daylight: a rose band with lit cloud strata, sliding off the frame top
        const y = Ms.Y(-120) - dayOff * 760, a = .55 * (1 - dayOff * .8);
        const gr = c.createLinearGradient(0, y - 360, 0, y + 260); gr.addColorStop(0, rgba('#f2a98a', 0)); gr.addColorStop(.55, rgba('#f2a98a', a * .55)); gr.addColorStop(.75, rgba('#ffcf9a', a * .35)); gr.addColorStop(1, rgba('#ffcf9a', 0));
        c.fillStyle = gr; c.fillRect(0, y - 360, 1920, 620);
        c.save(); c.globalAlpha = a; const r = prng(3);
        for (let i = 0; i < 6; i++) { const yy = y - 200 + i * 52 + drift(t, 4, i), x0 = -200 + r() * 900 + t * 6 * (1 + i * .2), x1 = x0 + 700 + r() * 900, th = 6 + r() * 10;
          const g2 = c.createLinearGradient(0, yy - th, 0, yy + th); g2.addColorStop(0, rgba('#ffd2b0', .0)); g2.addColorStop(.5, rgba('#ffc9a8', .45)); g2.addColorStop(1, rgba('#d98a8a', 0));
          c.fillStyle = g2; c.beginPath(); c.moveTo(x0, yy); for (let x = x0; x <= x1; x += 40) { const qq = (x - x0) / (x1 - x0); c.lineTo(x, yy - th * Math.pow(Math.sin(Math.PI * qq), .6)); } for (let x = x1; x >= x0; x -= 40) { const qq = (x - x0) / (x1 - x0); c.lineTo(x, yy + th * .4 * Math.sin(Math.PI * qq)); } c.closePath(); c.fill(); }
        c.restore();
      },
      after: (c, M2) => {
        { const y0 = M2.Y(baseY + 30), a = .22 * (1 - night); if (a > .01) { c.save(); c.globalCompositeOperation = 'screen'; const gr = c.createLinearGradient(0, y0, 0, y0 + 420 * M2.k); gr.addColorStop(0, rgba('#c98a9a', a)); gr.addColorStop(1, rgba('#c98a9a', 0)); c.fillStyle = gr; c.fillRect(0, y0, 1920, 420 * M2.k); c.restore(); } }
        // open doors with warm spill + neighbours at the thresholds
        g.doors.forEach((d, i) => {
          const o = doorOpen(d, i); if (o <= 0) return;
          const X0 = M2.X(d.x - d.w / 2), Y0 = M2.Y(d.y), Wd = d.w * M2.k, Hd = d.h * M2.k;
          if (X0 > 1950 || X0 + Wd < -30) return;
          const gr = c.createLinearGradient(0, Y0, 0, Y0 + Hd); gr.addColorStop(0, rgba('#ffcf8a', .95 * o)); gr.addColorStop(1, rgba('#ff9f4a', .95 * o));
          c.fillStyle = gr; c.fillRect(X0, Y0, Wd, Hd);
          // the door leaf swinging inward (a narrowing dark panel)
          c.fillStyle = 'rgba(14,10,24,.92)'; c.fillRect(X0, Y0, Wd * (1 - o * .82), Hd);
          // spill onto the quay
          c.save(); c.globalCompositeOperation = 'lighter'; const sp = c.createRadialGradient(X0 + Wd / 2, Y0 + Hd, 0, X0 + Wd / 2, Y0 + Hd, Wd * 3.2);
          sp.addColorStop(0, rgba(C.amber, .35 * o)); sp.addColorStop(1, rgba(C.amber, 0)); c.fillStyle = sp; c.translate(0, Y0 + Hd); c.scale(1, .35); c.translate(0, -(Y0 + Hd)); c.fillRect(X0 - Wd * 3, Y0 + Hd - Wd * 3.2, Wd * 7, Wd * 6.4); c.restore();
          // the neighbour: steps into the threshold as the door opens; after "home" a few step out onto the quay
          if (i % 4 === 3) return;
          const k = i % poses.length, step = on(t, tHome + .5 + i * .2, 1.4) * (i % 2 ? 1 : 0);
          const fx0 = d.x + (i % 2 ? .18 : -.12) * d.w, fy = d.y + d.h + .5 + step * 8;
          npc(c, M2, 'h1n' + i + ':' + q(Math.sin(t * .6 + i) * .5 + .5, 6), fx0, fy, d.h * 1.02, { ...poses[k], head: poses[k].head + (Math.sin(t * .6 + i) - .3) * .12 },
            { dress: dress[k], rim: RIM, rimSide: i % 2 ? 1 : -1, rimW: 1.4 }, t, { ph: i, alpha: sm(o * 1.6) });
        });
        // steam curling out of her window (the carrier from the kitchen)
        { c.save(); c.lineCap = 'round';
          for (let s = 0; s < 6; s++) { const ph = (t * .32 + s / 6) % 1, X = M2.X(wx + g.gw.w * .1), Y = M2.Y(wy - g.gw.h * .2), k = M2.k;
            c.strokeStyle = rgba('#f3e6d6', .26 * Math.sin(Math.PI * ph) * (1 - on(t, A + 4, 2) * .7)); c.lineWidth = (2.5 + 5 * ph) * k / 4.4 * 1.6; c.beginPath();
            for (let j = 0; j <= 14; j++) { const qq = j / 14, yy = Y - (ph * 46 + qq * 26) * k / 2.2, xx = X + Math.sin(qq * 4 + t * 1.3 + s) * (6 + ph * 16) * k / 2.2 + ph * 22 * k / 2.2; j ? c.lineTo(xx, yy) : c.moveTo(xx, yy); }
            c.stroke(); }
          c.restore(); }
        // a warm glow in her window
        { c.save(); c.globalCompositeOperation = 'lighter'; const X = M2.X(wx), Y = M2.Y(wy), R = 30 * M2.k; const gg = c.createRadialGradient(X, Y, 0, X, Y, R); gg.addColorStop(0, rgba(C.amberHot, .3)); gg.addColorStop(1, rgba(C.amber, 0)); c.fillStyle = gg; c.fillRect(X - R, Y - R, 2 * R, 2 * R); c.restore(); }
      },
    });
    // you, on the jetty, looking up (foreground, parallax 1.5)
    if (cam.z < 1.5) { const Mj = proj(cam, 1.5); npc(ctx, Mj, 'h1you' + q(sm(lin(tHome, tHome + 1, t)), 4), 330, 933, 132, { lean: -.06, head: mix(-.2, -.42, sm(lin(tHome - .4, tHome + 1, t))), sh: [.18, -.12], el: [.35, .45], hip: [.05, -.08], kn: [.02, .06], hair: 'short', hood: true, coat: 1 },
      { dress: DR.amber, light: { x: 800, y: 600, col: C.amberHot, a: .5 }, rim: '#ffd9a0', rimSide: 1, rimW: 1.6 }, t, { maxK: 1.8, alpha: sm(lin(1.5, 1.2, cam.z)) }); }
    const labA = sm(lin(tHome - 2.6, tHome - 1.2, t));
    drawLabels(ctx, M, t, { a: labA, title: lin(tHome + .05, tHome + 1.5, t), lit: [on(t, tHome + .2, 1), 0, 0, 0, 0], cur: 0, curA: .15 * on(t, tHome + .2, 1) });
    paper(ctx, .06, t);
  };
  return [{ t: A, draw, tr: 'out', x: 960, y: 500, depth: 5, d: .8 }];
}

// ------------------------------------------------------------------------------------------------ HILL 4
function hill4(T) {
  const A = T.S('07d', 'What is this life') - .6, B = T.S('07d', "It's a question you only") - .5;
  const tFor = T.S('07d', 'for', 1), tUnder = T.S('07d', 'underneath', 1), tNo = T.S('07d', 'No job'), tFilm = T.S('07d', 'Not this film');
  let P = null;
  const parts = () => {
    if (P) return P;
    const Ly = layers(), r = prng(77); P = [];
    const src = [];
    for (const h of Ly.houses) if (h.b >= 3) for (const w of h.win) src.push({ x: w.x, y: w.y + w.h / 2, b: h.b });
    const top = src.filter((s) => s.b === 4), sa = src.filter((s) => s.b === 3);
    for (let i = 0; i < 340; i++) {
      const fromTop = r() < .78, pool = fromTop ? top : sa, s = pool[Math.floor(r() * pool.length)] || { x: cx, y: apexY + 40 };
      const birth = tFor + .9 + Math.pow(r(), .8) * (fromTop ? 3.4 : 4.4) + (fromTop ? 0 : .8);
      const dir = r() < .5 ? -1 : 1, span = 120 + Math.pow(r(), .7) * 880, rise = 160 + Math.pow(r(), .8) * 760;
      P.push({ x0: s.x + (r() - .5) * 3, y0: s.y, birth, dur: 5.5 + r() * 4.5, dir, span, rise, ph: r() * 7, sz: .7 + r() * .6, a: .45 + r() * .55, cool: .8 + r() * .5 });
    }
    return P;
  };
  const people = [
    [-14, { lean: -.04, head: -.42, sh: [.25, -.15], el: [.3, .4], hip: [.05, -.06], kn: [0, .05], hair: 'long', skirt: true }, DR.warm1, 1],
    [1, { lean: -.06, head: -.5, sh: [2.5, .15], el: [.25, .3], hip: [.06, -.05], kn: [0, .05], hair: 'short' }, DR.warm2, 1],
    [15, { lean: -.02, head: -.38, sh: [.35, .5], el: [.6, .5], hip: [.08, -.06], kn: [0, .06], hair: 'grey', coat: .5 }, DR.grey, -1],
  ];
  const draw = (ctx, t) => {
    let cam = camKeys(t, [
      { t: A, x: 640, y: -720, z: .64 },
      { t: A + 1.55, x: 640, y: 380, z: .7, e: (x) => 1 - Math.pow(1 - x, 2.6) },
      { t: tFor + 1.9, x: cx, y: 175, z: 2.7, e: quartIO },
      { t: tNo - .3, x: cx + 12, y: 70, z: 2.45, e: sineE },
      { t: tFilm + .5, x: 690, y: 330, z: .57, e: quartIO },
      { t: B + 1, x: 700, y: 300, z: .53, e: sineE },
    ]);
    cam = { x: cam.x + drift(t, 3 / cam.z, 3), y: cam.y + drift(t, 2 / cam.z, 4), z: cam.z * (1 + .003 * Math.sin(t * .45)) };
    const dim = sm(lin(B - .5, B + .5, t));
    const letGo = sm(lin(tFor + 1, tUnder + 1.2, t)), relight = sm(lin(tNo + .6, tFilm + .4, t));
    const house = (h) => {
      if (h.b < 4) return (1 - dim * .55);
      const o = on(t, tFor + (h.hx - cx + 40) / 80 * .35, .25);
      return o * (1 - letGo * .65 + relight * .45) * (1 - dim * .55);
    };
    const pp = parts();
    const M = drawHill(ctx, t, {
      cam, sky: skyPal('deep'), stars: 1, house, jetty: 0, fogA: .8,
      after: (c, M2) => {
        // the three on the summit
        people.forEach(([dx, pose, dr, side], i) => {
          const hh = q(Math.sin(t * .4 + i * 2) * .5 + .5, 6), ps = { ...pose, head: pose.head + (hh - .5) * .14 };
          npc(c, M2, 'h4p' + i + ':' + hh, cx + dx, apexY - 1.5, 21, ps, { dress: dr, rim: RIM, rimSide: side, rimW: 1.3, light: { x: 0, y: 2000, col: C.amberHot, a: .35 } }, t, { ph: i * 1.3, maxK: 4.5 });
        });
        // the released lights: slow, wide drift, amber cooling to star-white, they stay as stars
        c.save(); c.globalCompositeOperation = 'lighter';
        const kk = Math.min(M2.k, 3.5);
        for (const p of pp) {
          const life = (t - p.birth) / p.dur; if (life <= 0) continue;
          const L = Math.min(life, 1), e = 1 - Math.pow(1 - L, 1.7);
          const x = p.x0 + p.dir * p.span * Math.pow(L, .85) + Math.sin(L * 5 + p.ph) * 14 * L + Math.sin(t * .3 + p.ph) * 4 * L;
          const y = p.y0 - p.rise * e - Math.max(0, life - 1) * 4;
          const X = M2.X(x), Y = M2.Y(y); if (X < -20 || X > 1940 || Y < -20 || Y > 1100) continue;
          const coolU = clamp(L * 1.5 * p.cool), col = mixHex(C.amberHot, '#eef3ff', coolU);
          const a = p.a * sm(life / .06) * (life > 1 ? (.55 + .45 * Math.sin(t * (1 + p.sz) + p.ph)) : 1) * (1 - dim * .2);
          const rad = mix(2.6, 1.15, coolU) * p.sz * (.65 + .35 * kk / 3.5);
          if (rad > 1.4) { const g2 = c.createRadialGradient(X, Y, 0, X, Y, rad * 4); g2.addColorStop(0, rgba(col, a * .35)); g2.addColorStop(1, rgba(col, 0)); c.fillStyle = g2; c.fillRect(X - rad * 4, Y - rad * 4, rad * 8, rad * 8); }
          c.fillStyle = rgba(col, a); c.beginPath(); c.arc(X, Y, rad, 0, 6.283); c.fill();
        }
        c.restore();
      },
    });
    // the night closes in on the hill at the end (labels last)
    if (dim > 0) { ctx.fillStyle = rgba('#04051a', .55 * dim); ctx.fillRect(0, 0, 1920, 1080); }
    const sumLit = on(t, tFor, .5);
    drawLabels(ctx, M, t, { a: 1 - sm(lin(B - .1, B + .7, t)), title: 1, lit: [1, 1, 1, 1, sumLit], cur: 4, curA: sm(lin(tFor - .6, tFor + .8, t)) * (1 - sm(lin(tNo, tFilm, t))) });
    paper(ctx, .06, t);
  };
  return [{ t: A, draw, tr: 'up', d: .9 }];
}


// lit state helpers: base lit since HILL 1, Belonging since HILL 2, Esteem + SA since HILL 3
const litUpTo = (n) => (h) => h.b < n ? 1 : 0;
function camAdd(cam, t, ph = 0) { return { x: cam.x + drift(t, 3 / cam.z, 1 + ph), y: cam.y + drift(t, 2 / cam.z, 2 + ph), z: cam.z * (1 + .003 * Math.sin(t * .5 + ph)) }; }

// ------------------------------------------------------------------------------------------------ HILL 2 in
function hill2in(T) {
  const A = T.S('04a', 'First, to people') - .5, B = T.S('04a', 'Time for the ones') - .4, tPeople = T.S('04a', 'to people') + .12;
  let G = null;
  const geo = () => {
    if (G) return G;
    const hs = layers().byLevel[1].filter((h) => h.row === 0).sort((a, b) => Math.abs(a.hx - cx - 60) - Math.abs(b.hx - cx - 60));
    const h1 = hs[0], h2 = hs.find((h) => Math.abs(h.hx - h1.hx) > 110 && Math.abs(h.hx - h1.hx) < 220) || hs[1];
    const [a, b] = h1.hx < h2.hx ? [h1, h2] : [h2, h1];
    const p0 = [a.hx + a.w * .35, a.gy - a.h * .7], p1 = [b.hx - b.w * .35, b.gy - b.h * .75];
    const win = b.win.filter((w) => !w.door).sort((u, v) => Math.abs(u.y - b.gy + b.h * .45) - Math.abs(v.y - b.gy + b.h * .45))[0] || a.win[0];
    G = { a, b, p0, p1, win, mid: [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 + 6] };
    return G;
  };
  const draw = (ctx, t) => {
    const g = geo(), [mx, my] = g.mid, wcx = g.win.x, wcy = g.win.y + g.win.h / 2;
    let cam = camKeys(t, [{ t: A, x: mx, y: my - 10, z: 2.3 }, { t: B + .4, x: mix(mx, wcx, .6), y: mix(my, wcy, .6), z: 3.6, e: sineE }]);
    cam = camAdd(cam, t);
    const M = drawHill(ctx, t, {
      cam, sky: skyPal('night'), stars: 1, house: (h) => h.b === 0 ? 1 : (h === g.b ? 1 : (h.b === 1 ? .25 * on(t, tPeople, 1) : 0)),
      after: (c, M2) => {
        // the string of lights the walker stepped onto, hanging between two Belonging houses
        const pts = []; for (let i = 0; i <= 24; i++) { const u2 = i / 24; pts.push([mix(g.p0[0], g.p1[0], u2), mix(g.p0[1], g.p1[1], u2) + Math.sin(Math.PI * u2) * 16 + Math.sin(t * 1.5) * .6 * Math.sin(Math.PI * u2)]); }
        c.strokeStyle = '#0a0a18'; c.lineWidth = Math.max(1, .5 * M2.k); c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(M2.X(x), M2.Y(y)) : c.moveTo(M2.X(x), M2.Y(y))); c.stroke();
        c.save(); c.globalCompositeOperation = 'lighter';
        for (let i = 1; i < 24; i += 2) { const [x, y] = pts[i], X = M2.X(x), Y = M2.Y(y + 1.2), a = .8 + .2 * Math.sin(t * 3 + i), R = 7 * M2.k; c.fillStyle = rgba('#fff1d0', a); c.beginPath(); c.arc(X, Y, 1.1 * M2.k, 0, 7); c.fill(); const gg = c.createRadialGradient(X, Y, 0, X, Y, R); gg.addColorStop(0, rgba(C.amberHot, a)); gg.addColorStop(.3, rgba(C.amber, .35 * a)); gg.addColorStop(1, rgba(C.amber, 0)); c.fillStyle = gg; c.fillRect(X - R, Y - R, 2 * R, 2 * R); }
        c.restore();
      },
    });
    drawLabels(ctx, M, t, { a: 1, title: 1, lit: [1, 0, 0, 0, 0], cur: 1, curA: sm(lin(tPeople - .5, tPeople + .4, t)) });
    // one window detaches, grows toward the lens (ghost rectangles) and becomes the kitchen
    const gu = sm(lin(tPeople + .05, B + .15, t));
    if (gu > 0) {
      const wx0 = M.X(g.win.x - g.win.w / 2), wy0 = M.Y(g.win.y), ww = g.win.w * M.k, wh = g.win.h * M.k;
      const ease = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
      const rect = (u2) => { const e = ease(u2); return [mix(wx0, 0, e), mix(wy0, 0, e), mix(ww, 1920, e), mix(wh, 1080, e)]; };
      for (let j = 1; j <= 5; j++) { const [x, y, w, h] = rect(gu * j / 6); ctx.strokeStyle = rgba('#ffe2b8', .22 * (1 - gu * .7)); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(x, y, w, h, 6); ctx.stroke(); }
      const [x, y, w, h] = rect(gu);
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30; ctx.fillStyle = '#3b2a4e'; ctx.beginPath(); ctx.roundRect(x, y, w, h, 10 * (1 - gu)); ctx.fill(); ctx.restore();
      kitchen(ctx, x, y, w, h, t, { pour: sm(lin(B - .3, B + .45, t)) });
      ctx.save(); ctx.globalAlpha = 1 - sm(lin(.15, .6, gu)); ctx.fillStyle = C.amberHot; ctx.beginPath(); ctx.roundRect(x, y, w, h, 10 * (1 - gu)); ctx.fill(); ctx.restore();
      ctx.strokeStyle = rgba('#ffe2b8', .7 * (1 - gu)); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x, y, w, h, 10 * (1 - gu)); ctx.stroke();
    }
    paper(ctx, .06, t);
  };
  return [{ t: A, draw, tr: 'match', d: .5 }];
}

// ------------------------------------------------------------------------------------------------ HILL 2 out
function hill2out(T) {
  const A = T.S('04a', "Now there's time") - .5, B = T.S('04a', 'Streets full') - .5, tTribe = T.S('04a', 'tribe');
  const A2 = A + 1.15;
  const street = (ctx, t) => {
    const cam = camKeys(t, [{ t: A, x: 960, y: 640, z: 1.12 }, { t: A2 + .5, x: 960, y: 520, z: .82, e: (x) => x * x }]);
    drawTable(ctx, t, camAdd(cam, t), A + .3, A2 + .2);
    paper(ctx, .06, t);
  };
  // the ring path around the Belonging terrace: centre front → flanks → up → back along the upper ledge to centre
  const yb = BANDS[1], yt = BANDS[2];
  const half_ = (s) => { const pts = []; const h = half(yb) - 6;
    for (let i = 0; i <= 30; i++) { const x = cx + s * h * i / 30; pts.push([x, arcY(yb, x) - 3]); }
    for (let i = 1; i <= 14; i++) { const y = mix(yb - 3, yt + 2, i / 14); pts.push([edge(y, s) - s * 8, y]); }
    const ht = half(yt) - 6; for (let i = 0; i <= 24; i++) { const x = cx + s * ht * (1 - i / 24); pts.push([x, arcY(yt, x) + 4]); }
    return pts; };
  const RING = [half_(-1), half_(1)];
  const hill = (ctx, t) => {
    let cam = camKeys(t, [{ t: A2 - .4, x: cx, y: arcY(yb, cx) - 30, z: 3.2 }, { t: tTribe + .1, x: 760, y: 470, z: 1.22, e: quartIO }, { t: B + 1, x: 760, y: 465, z: 1.12, e: sineE }]);
    cam = camAdd(cam, t);
    const ru = sm(lin(A2 - .3, tTribe, t));
    const M = drawHill(ctx, t, {
      cam, sky: skyPal('night'), stars: 1,
      house: (h) => h.b === 0 ? 1 : h.b === 1 ? on(t, tTribe - .35 + (h.row ? .25 : 0) + h.o * .45, .3) : 0,
      after: (c, M2) => {
        c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round'; c.lineJoin = 'round';
        for (const P of RING) { const n = Math.max(2, Math.floor(P.length * ru)); c.beginPath(); for (let i = 0; i < n; i++) i ? c.lineTo(M2.X(P[i][0]), M2.Y(P[i][1])) : c.moveTo(M2.X(P[i][0]), M2.Y(P[i][1]));
          c.strokeStyle = rgba(C.amber, .22); c.lineWidth = 9; c.stroke(); c.strokeStyle = rgba('#ffe2b0', .9); c.lineWidth = 2; c.stroke();
          if (ru < 1) { const [x, y] = P[n - 1], X = M2.X(x), Y = M2.Y(y), g2 = c.createRadialGradient(X, Y, 0, X, Y, 26); g2.addColorStop(0, rgba(C.amberHot, .8)); g2.addColorStop(1, rgba(C.amber, 0)); c.fillStyle = g2; c.fillRect(X - 26, Y - 26, 52, 52); } }
        // the close on "tribe": a soft pulse around the ring
        const pulse = Math.sin(Math.PI * clamp((t - tTribe) / .9));
        if (pulse > 0) { const X = M2.X(cx), Y = M2.Y(mix(yb, yt, .5)), R = half(yb) * M2.k * 1.2; const g3 = c.createRadialGradient(X, Y, 0, X, Y, R); g3.addColorStop(0, rgba(C.amber, .16 * pulse)); g3.addColorStop(1, rgba(C.amber, 0)); c.fillStyle = g3; c.save(); c.translate(X, Y); c.scale(1, .45); c.translate(-X, -Y); c.fillRect(X - R, Y - R, 2 * R, 2 * R); c.restore(); }
        c.restore();
      },
    });
    drawLabels(ctx, M, t, { a: 1, title: 1, lit: [1, on(t, tTribe, .6), 0, 0, 0], cur: 1, curA: .6 * (1 - sm(lin(tTribe + .3, B, t))) + .2 });
    paper(ctx, .06, t);
  };
  return [{ t: A, draw: street, tr: 'zoom', x: 960, y: 540, depth: 5, d: .7 }, { t: A2, draw: hill, tr: 'out', x: 960, y: 560, depth: 3.4, d: .75 }];
}

// ------------------------------------------------------------------------------------------------ HILL 3 (cut-away street)
function streetTimes(T) {
  return { lift: T.S('05a', 'hands'), joy: T.S('05a', 'joy'), violin: T.S('05a', 'violin'), grand: T.S('05a', 'grandfather'), disappear: T.S('05a', 'disappear'),
    meaning: T.S('05a', 'meaning'), look: T.S('05a', 'meaning') + .3, working: T.S('05a', 'working'), end: T.S('05a', 'When people in Kenya') - .5 };
}
function hill3(T) {
  const A = T.S('05a', 'Something made by human') - .5, tm = streetTimes(T), B = tm.end, A2 = tm.lift - .45;
  const E = [cx - 10, 296];
  const hillShot = (ctx, t) => {
    const land = 1 - Math.pow(1 - clamp((t - A + .35) / 1.1), 3);
    let cam = camKeys(t, [{ t: A - .35, x: 960, y: 520, z: 1.04 }, { t: A + .9, x: 700, y: 470, z: 1.06, e: (x) => 1 - Math.pow(1 - x, 3) }, { t: A2 + .45, x: E[0], y: E[1], z: 3.3, e: (x) => x * x * x }]);
    cam = camAdd(cam, t, 3);
    const M = drawHill(ctx, t, { cam, sky: skyPal('night'), stars: 1, house: litUpTo(2) });
    drawLabels(ctx, M, t, { a: 1, title: 1, lit: [1, 1, 0, 0, 0], cur: 2, curA: sm(lin(A + .8, A2, t)) });
    paper(ctx, .06, t);
    const v = (1 - land) * 60; if (v > 2) smear(ctx, ctx.canvas, v, 0, 4);
  };
  const keys = [
    { t: A2 - .2, x: 640, y: 600, z: .92 },
    { t: tm.lift + 3.2, x: 660, y: 610, z: 1.08, e: sineE },
    { t: tm.joy - .5, x: 1490, y: 360, z: 1.12, e: quartIO },
    { t: tm.joy + .7, x: 1500, y: 380, z: 1.12, e: sineE },
    { t: tm.violin + .05, x: 1500, y: 610, z: 1.04, e: quartIO },
    { t: tm.grand - .7, x: 1530, y: 610, z: 1.04, e: sineE },
    { t: tm.grand - .05, x: 2400, y: 610, z: 1.06, e: quartIO },
    { t: tm.disappear - 2.2, x: 2440, y: 610, z: 1.06, e: sineE },
    { t: tm.disappear - 1.2, x: 3260, y: 560, z: .95, e: quartIO },
    { t: tm.disappear + .8, x: 3280, y: 260, z: .82, e: sineE },
    { t: tm.meaning - 1.7, x: 4130, y: 600, z: 1.04, e: quartIO },
    { t: tm.working - 1.4, x: 4100, y: 610, z: 1.02, e: sineE },
    { t: tm.working + .2, x: 2900, y: 560, z: .54, e: quartIO },
    { t: B + 1, x: 2980, y: 560, z: .51, e: sineE },
  ];
  const streetShot = (ctx, t) => {
    const cam = camAdd(camKeys(t, keys), t, 5);
    drawStreet(ctx, t, cam, tm, { strokeU: lin(tm.working + .1, B + .45, t) });
    paper(ctx, .06, t);
  };
  return [{ t: A, draw: hillShot, tr: 'right', d: .6 }, { t: A2, draw: streetShot, tr: 'zoom', x: 960, y: 540, depth: 4, d: .7 }];
}

// ------------------------------------------------------------------------------------------------ HILL 3 out
function hill3out(T) {
  const A = T.S('05b', 'It means') - .4, B = T.clip('A').start - .6, tWant = T.S('05b', 'wanting'), tm = { ...streetTimes(T), lift: -1e9, meaning: -1e9, look: -1e9, disappear: -1e9, end: 1e9 };
  const A2 = A + .5, E = [cx - 10, 296];
  const streetShot = (ctx, t) => {
    const cam = camKeys(t, [{ t: A, x: 610, y: 610, z: 1.05 }, { t: A2 + .5, x: 640, y: 600, z: .62, e: (x) => x * x }]);
    drawStreet(ctx, t, camAdd(cam, t), tm, {});
    paper(ctx, .06, t);
  };
  const hillShot = (ctx, t) => {
    const whip = clamp((t - (B - .3)) / .75);
    let cam = camKeys(t, [{ t: A2 - .3, x: E[0], y: E[1], z: 3.2 }, { t: tWant + .45, x: 760, y: 450, z: 1.12, e: (x) => 1 - Math.pow(1 - x, 3) }, { t: B + 1, x: 740, y: 450, z: 1.08 }]);
    cam = camAdd(cam, t, 7); cam.x -= Math.pow(whip, 2.2) * 900;
    const sw = (h) => (h.hx - (cx - half(h.gy))) / (2 * half(h.gy));
    const M = drawHill(ctx, t, { cam, sky: skyPal('night'), stars: 1,
      house: (h) => h.b < 2 ? 1 : h.b === 2 ? on(t, tWant - .3 + sw(h) * .45, .2) : h.b === 3 ? on(t, tWant + .05 + sw(h) * .35, .2) : 0,
      after: (c, M2) => {   // the sweep: a band of warm light crossing the two terraces left → right, then shooting off right
        const su = lin(tWant - .35, tWant + .55, t), X = mix(M2.X(cx - 330), M2.X(cx + 330), su) + Math.pow(whip, 1.6) * 2400;
        const a = Math.sin(Math.PI * Math.min(1, su * 1.1)) * .7 + whip * .6; if (a <= .01 || su <= 0) return;
        const y0 = M2.Y(BANDS[4]), y1 = M2.Y(BANDS[2] + 10);
        c.save(); c.globalCompositeOperation = 'lighter'; const w = 120 + whip * 900; const g2 = c.createLinearGradient(X - w, 0, X + 40, 0); g2.addColorStop(0, rgba(C.amber, 0)); g2.addColorStop(.8, rgba(C.amber, .35 * a)); g2.addColorStop(1, rgba(C.amberHot, 0)); c.fillStyle = g2; c.fillRect(X - w, y0, w + 40, y1 - y0); c.restore();
      } });
    drawLabels(ctx, M, t, { a: 1, title: 1, lit: [1, 1, on(t, tWant - .1, .5), on(t, tWant + .25, .5), 0], cur: 2, curA: .4 * (1 - sm(lin(A2, tWant, t))) });
    paper(ctx, .06, t);
    if (whip > 0) smear(ctx, ctx.canvas, -Math.pow(whip, 2) * 120, 0, 4);
  };
  return [{ t: A, draw: streetShot, tr: 'out', x: 860, y: 640, depth: 3, d: .6 }, { t: A2, draw: hillShot, tr: 'out', x: 960, y: 540, depth: 3.2, d: .6 }];
}

// ------------------------------------------------------------------------------------------------ build
function wants(T, wins) {
  if (process.env.HILL_PREP === '1') return true;
  if (process.env.HILL_PREP === '0') return false;
  const argv = process.argv, arg = (k) => { const i = argv.indexOf('--' + k); return i > 0 ? argv[i + 1] : null; };
  const snap = arg('snap'), from = arg('from'), to = arg('to');
  if (!snap && from == null && to == null) return true;          // unknown runner: be ready
  const hit = (a, b) => wins.some(([p, q2]) => a <= q2 + 1.5 && b >= p - 1.5);
  if (snap) return snap.split(',').map(Number).some((s) => hit(s, s));
  return hit(Number(from ?? 0), Number(to ?? 1e9));
}
export default async function (T) {
  const shots = [...hill1(T), ...hill2in(T), ...hill2out(T), ...hill3(T), ...hill3out(T), ...hill4(T)];
  const W1 = [T.S('02a', "And it's not just you") - 1, T.seg('03a').start], W2 = [T.S('04a', 'First, to people') - 1, T.S('04a', 'Time for the ones')],
    W3 = [T.S('04a', "Now there's time") - 1, T.S('04a', 'Streets full')], W4 = [T.S('05a', 'Something made by human') - 1, T.S('05a', 'When people in Kenya')],
    W5 = [T.S('05b', 'It means') - 1, T.clip('A').start], W6 = [T.S('07d', 'What is this life') - 1, T.S('07d', "It's a question you only")];
  if (wants(T, [W1, W2, W3, W4, W5, W6])) await prepareHill();
  if (wants(T, [W4, W5])) await prepareStreet();
  if (wants(T, [W3])) await prepareTable();
  return shots;
}
