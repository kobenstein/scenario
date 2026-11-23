// Film 67 · builder B3 helpers (c08–c11, 'Not like a coup' → end). Owned by B3; the lead's lib files stay untouched.
// ONE continuous take over the whole group: the four chunk files (scenes/sc08–sc11.mjs) each export `part` = { keys(A), draw(ctx, t, A, c) };
// b3(T) stitches their camera keys into one path and calls the part whose range holds t. Inner chunk seams are therefore the same
// function on both sides (identical frames by construction). The group seam with B2 (plateHandover) and the end screen keep the lead's
// plates/cams: the take starts as plateHandover's creep and ends converged onto S.endScreen's camera.
//
// Camera keys: [t, u, v, s] = land-card point (u, v) at screen centre, magnification s (1 = home). Monotone cubic in u, v, log s.
// THE TOWN HALL ROOM (c08, c09): drawn in its own 1920×1080 design space, mapped into the hall's middle window on the land card (enter
// through the window, leave the same way); the camera flies until the window covers the frame, then a 2D room camera takes over.
import * as E from './f10_editorial.mjs';
import * as F from './f67_kit.mjs';
import * as S from './f67_world.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, halo, lin, prng } = E;
const { GOLD, CREAM, CREAM2, PAPER, COOL, LAMP, EARTH } = F;
const TAU = Math.PI * 2;
export const GY = S.GY;

// ------------------------------------------------------------------------------------------------ anchors (phrases only)
export function anchors(T) {
  const g = (p, after, nth = 0) => T.G(p, nth, after), ge = (p, after, nth = 0) => T.GE(p, nth, after);
  const A = {};
  const a0 = A.coup = T.G('Not like a coup');
  A.ordinary = g('More like an ordinary evening', a0); A.townhall = g('in your town hall', A.ordinary);
  A.oldBridge = g('The old bridge', a0); A.replaced = g('has to be replaced', a0); A.sys = g('A system has designed', a0); A.correct1 = g('correct', A.sys);
  A.reasoning = g('The reasoning runs longer', a0); A.engineers = g("The engineers can't follow", a0); A.neither = g('Neither can you', a0);
  A.never = g('But the system has never', a0); A.hands = g('So the hands go up', a0); A.yours = g('Yours, too', a0);
  A.handover = g('That is a handover', a0); A.robots = g('No robots in the street', a0); A.nobody = g('Nobody seizing power', a0);
  A.thousand = g('Just a thousand small yeses', a0); A.loan = g('Your loan', a0); A.contract = g('Your contract', a0); A.budget = g("Your town's budget", a0);
  A.sensible = g('Each one sensible', a0); A.less = g('Each one a little less yours', a0);
  A.look = g('But look at what the mathematicians', a0); A.didNot = g('They did not take', a0); A.trusted = g('They trusted a referee', a0);
  A.open = g('Its rules are open', a0); A.anyone = g('Anyone can run it again', a0); A.moved = g('Their trust moved', a0);
  A.away = g('away from the answer', A.moved); A.check = g('to the check', A.moved); A.checkE = ge('to the check', A.moved);
  A.inTown = g('In your town hall, the system', a0); A.inMath = g('In mathematics, humans built', a0); A.who = g('So who builds the referees', a0); A.ownRef = g('its own referee', A.inTown);
  A.labs = g('The labs could', a0); A.wang = g('Wang himself writes', a0); A.defPath = g('default path', A.wang); A.how = g("He doesn't say exactly how", a0);
  A.oneWay = g('One way: labs agree', a0); A.thenNo = g('Then no answer is its own referee', a0); A.objection = g('The objection: whoever waits', a0);
  A.falls = g('falls behind', A.objection); A.govts = g('So governments could', a0); A.rule = g('make it a rule', A.govts);
  A.town2 = g('Then your town can refuse', a0); A.checkers = g('But who checks the checkers', a0); A.mathOne = g('Mathematics has one answer', a0);
  A.nonprofits = g('carried by nonprofits', a0); A.engineer = g('The engineer in the back row', a0); A.nobodyTrust = g('nobody has to trust', a0);
  A.hardest = g('The hardest objection', a0); A.results = g('results matter more', a0); A.cross = g('You already cross bridges', a0);
  A.true = g('True', A.cross); A.until = g('But until now, some human could', a0);
  A.noneAgreed = g('None of this is agreed', a0); A.tested = g('none of it is tested', a0); A.whoChange = g('Who could change that', a0);
  A.wLabs = g('labs', A.whoChange); A.wGov = g('governments', A.whoChange); A.wInv = g('investors', A.whoChange); A.wVoters = g('and voters like you', A.whoChange);
  A.clock = g('And Wang puts a clock on it', a0); A.howHum = g('How humanity acts', a0); A.nextYear = g('next year', A.howHum); A.consequence = g('great consequence', A.howHum);
  A.si = g('Superintelligence is arriving. So', a0); A.isHe = g('is he right', A.si); A.inPart = g('In part', A.si); A.something = g('Something has arrived', A.si);
  A.holds = g('an answer that holds', A.si); A.whether = g('Whether that is superintelligence', A.si); A.box = g('And the box that is still open', A.si);
  A.aboutUs = g("It's about us", A.si); A.nextHead = g('So when the next headline', A.si); A.solved = g('solved something', A.si);
  A.follow = g('Can any human follow it', A.si); A.whoSays = g("And who says it's correct", A.si); A.mayNever = g('We may never read every answer', A.si);
  A.whoGets = g('But who gets to say', A.si); A.channel = T.G('This channel exists', 1); A.want = g('Want that too', A.channel); A.subscribe = g('Then subscribe', A.channel);
  A.end = T.duration; A.endT = T.duration - 15; A.T = T;
  return A;
}

// ------------------------------------------------------------------------------------------------ camera
export const L = (u, v, s) => E.aim(S.Z_LAND, u, v, s);
export function pathUVS(t, K) {   // K = [[t, u, v, s], …] (sorted)
  const n = K.length; if (n === 1) return [K[0][1], K[0][2], K[0][3]];
  const V = K.map((k) => [k[1], k[2], Math.log(k[3])]), T = K.map((k) => k[0]);
  if (t <= T[0]) t = T[0]; if (t >= T[n - 1]) t = T[n - 1];
  let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
  const h = T[i + 1] - T[i], u = (t - T[i]) / h, out = [];
  for (let d = 0; d < 3; d++) {
    const sec = (j) => (V[j + 1][d] - V[j][d]) / (T[j + 1] - T[j]);
    const tan = (j) => { if (j === 0 || j === n - 1) return 0; const a = sec(j - 1), b = sec(j); if (a * b <= 0) return 0; const m = (a + b) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(a), 3 * Math.abs(b)); };
    const p0 = V[i][d], p1 = V[i + 1][d], m0 = tan(i) * h, m1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
    out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
  }
  return [out[0], out[1], Math.exp(out[2])];
}
// plateHandover's camera expressed as [u, v, s] (TOWN_CAM(k, trk(k) * .3)), and the end screen's (S.endScreen) for t ≥ endT
export function plateUVS(t, A) { const k = 1 + S.CREEP * Math.max(0, t - (A.coup - S.SEAM_HALF)); return [S.HALL.x + 120 + S.trk(k) * .3, GY - 190, 1.9 * k]; }
export function endUVS(t, A) { const d = Math.max(0, t - A.endT), k = 1 - .008 * d, s = 1.25 * k; return [S.CHAIR.x + 300 + 4 * d, GY - 260 + 120 / s, s]; }

// ------------------------------------------------------------------------------------------------ the town hall window and the room
export const WIN = { x: S.HALL.x - 168 + 2 * 72, y: GY - 160, w: 40, h: 100 };   // the middle window (land px)
export const WC = { u: WIN.x + WIN.w / 2, v: WIN.y + WIN.h / 2 };
export const S_IN = 1920 / WIN.w * 1.0;                                            // magnification at which the window is 1920 px wide
// map: room design px → land px (room centre at the window centre, room width = window width)
export function roomToLand(ctx) { ctx.translate(WC.u, WC.v); ctx.scale(WIN.w / 1920, WIN.w / 1920); ctx.translate(-W / 2, -H / 2); }
export function roomCam(ctx, rc) { ctx.translate(W / 2, H / 2); ctx.scale(rc.z, rc.z); ctx.translate(-rc.x, -rc.y); }
export function pathRoom(t, K) { const [x, y, s] = pathUVS(t, K.map(([tt, a, b, z]) => [tt, a, b, z])); return { x: x + E.drift(t, 4, 3), y: y + E.drift(t, 3, 7), z: s * (1 + .004 * Math.sin(t * .5)) }; }

export const PLAN = { x: 600, y: 140, w: 720, h: 380 };
export const TABLE = { x0: 1120, x1: 1620, y: 800 };
const ROWS = [
  { y: 1000, h: 330, xs: [250, 520, 790, 1060, 1330, 1600] },
  { y: 1120, h: 390, xs: [140, 450, 1060, 1370, 1680] },
  { y: 1260, h: 460, xs: [300, 1230, 1560], you: 720 },
];
export const ROOM_YOU = { x: 720, y: 1260, h: 460 };
// st: { plan 0..1 (the drawing draws itself), card 0..1 (CORRECT), tower 0..1, pour, hands 0..1 (arm after arm), yours 0..1, eng { shrug, leaf },
//       youLook, chair 0..1 (an empty referee chair rises beside the plan), dark 0..1 }
export function room(ctx, t, st = {}) {
  const wall = mixHex(P.night1, '#5a3f5e', .55), wall2 = mixHex(P.night0, '#3a2a4a', .6), floor = mixHex(P.night0, '#2a1e2e', .7);
  ctx.fillStyle = lin(ctx, 0, -600, 0, 800, [[0, wall2], [.55, wall], [1, mixHex(wall, LAMP.deep, .35)]]); ctx.fillRect(-4000, -4000, W + 8000, 4800);
  ctx.fillStyle = lin(ctx, 0, 790, 0, 1500, [[0, mixHex(floor, LAMP.deep, .3)], [1, P.night0]]); ctx.fillRect(-4000, 790, W + 8000, 4000);
  ctx.fillStyle = rgba(LAMP.body, .08); ctx.fillRect(-4000, 786, W + 8000, 4);
  // wall panelling + two side windows (night outside, a few stars)
  ctx.fillStyle = rgba(P.night0, .18); for (let i = -6; i < 16; i++) ctx.fillRect(i * 210, 560, 6, 230);
  for (const wx of [80, 1700]) { ctx.fillStyle = mixHex(P.night0, P.blue0, .25); ctx.fillRect(wx, 170, 150, 330); ctx.fillStyle = wall2; ctx.fillRect(wx + 72, 170, 6, 330); ctx.fillRect(wx, 330, 150, 6);
    for (let k = 0; k < 5; k++) { ctx.fillStyle = rgba(CREAM, .35 + .2 * Math.sin(t * .7 + k * 2 + wx)); ctx.fillRect(wx + 14 + (k * 37 % 120), 190 + (k * 53 % 120), 2, 2); } }
  for (const lx of [360, 960, 1560]) halo(ctx, lx, 40, 340, .32, LAMP.body, LAMP.core);   // ceiling lamps
  // the plan on the wall: a new, unusually slender bridge
  const pu = clamp(st.plan ?? 1), dk = clamp(st.dark ?? 0);
  {
    const { x, y, w, h } = PLAN;
    ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(-.006); ctx.translate(-w / 2, -h / 2);
    ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(10, 14, w, h);
    ctx.fillStyle = lin(ctx, 0, 0, w, h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.strokeRect(0, 0, w, h);
    const ink = rgba(PAPER.ink, .85), k = smooth(pu);
    ctx.strokeStyle = ink; ctx.lineCap = 'round';
    ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(50, 200); ctx.lineTo(50 + (w - 100) * k, 200); ctx.stroke();   // the deck
    ctx.lineWidth = 2.4; ctx.beginPath(); const n = 40;
    for (let i = 0; i <= n * k; i++) { const f = i / n, px = 70 + (w - 140) * f, py = 290 - 120 * Math.sin(Math.PI * f); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();   // one slender arch
    ctx.lineWidth = 1.2; for (let i = 1; i < 12; i++) { const f = i / 12; if (f > k) break; const px = 70 + (w - 140) * f, py = 290 - 120 * Math.sin(Math.PI * f); ctx.beginPath(); ctx.moveTo(px, 200); ctx.lineTo(px, py); ctx.stroke(); }
    ctx.fillStyle = rgba(PAPER.ink, .5); ctx.fillRect(40, 292, 30 * k, 4); ctx.fillRect(w - 70, 292, 30 * k, 4);
    ctx.fillStyle = rgba(PAPER.faint, .7); for (let i = 0; i < 6; i++) if (i / 6 < k) ctx.fillRect(50, 320 + i * 8, 120 + (i * 37 % 160), 3);   // unreadable notes
    ctx.strokeStyle = rgba(PAPER.faint, .6); ctx.setLineDash([6, 5]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(50, 230); ctx.lineTo(50 + (w - 100) * k, 230); ctx.stroke(); ctx.setLineDash([]);
    ctx.restore();
    if (dk > 0) { ctx.fillStyle = rgba(P.night0, .45 * dk); ctx.fillRect(x - 10, y - 10, w + 30, h + 30); }
  }
  // the empty referee's chair beside the plan (c09 8.05): rises out of the floor
  const ch = clamp(st.chair ?? 0);
  if (ch > 0) { ctx.save(); ctx.beginPath(); ctx.rect(240, -400, 360, 1190); ctx.clip(); ctx.translate(0, (1 - expoOut(ch)) * 520);
    const cx = 420, base = 790, hh = 430; ctx.strokeStyle = mixHex(P.night0, P.blue2, .55); ctx.lineWidth = 14; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx - 100, base); ctx.lineTo(cx - 34, base - hh); ctx.moveTo(cx + 100, base); ctx.lineTo(cx + 34, base - hh); ctx.moveTo(cx - 74, base - hh * .45); ctx.lineTo(cx + 74, base - hh * .45); ctx.stroke();
    ctx.fillStyle = mixHex(P.night0, P.blue2, .55); ctx.fillRect(cx - 70, base - hh - 14, 140, 20); ctx.fillRect(cx + 46, base - hh - 100, 14, 92);
    halo(ctx, cx, base - hh - 40, 160, .25 * ch, P.halo2, CREAM);
    ctx.restore(); }
  // the table and the paper tower (pages pour out of the plan's corner)
  ctx.fillStyle = mixHex(EARTH.deep, P.night1, .4); ctx.fillRect(TABLE.x0, TABLE.y - 16, TABLE.x1 - TABLE.x0, 18); ctx.fillRect(TABLE.x0 + 20, TABLE.y, 12, 110); ctx.fillRect(TABLE.x1 - 32, TABLE.y, 12, 110);
  const tw = clamp(st.tower ?? 0);
  if (tw > 0) F.paperTower(ctx, t, 1370, TABLE.y - 16, 130, 660, { u: tw, seed: 8, dark: .15 * dk, pour: st.pour ?? 0, from: [PLAN.x + PLAN.w - 40, PLAN.y + PLAN.h - 20] });
  // two engineers by the table: leafing, look at each other, shrug
  const e = st.eng ?? {}, sh = clamp(e.shrug ?? 0), lf = clamp(e.leaf ?? 0);
  E.person(ctx, 1060, 930, 330, { dir: 1, light: .8, look: lerp(.3, -.1, sh), armR: [lerp(.3, 1.6 + .2 * Math.sin(t * 3), lf * (1 - sh)) + 1.2 * sh, lerp(.2, 2.3, lf * (1 - sh)) + 1.6 * sh], armL: [-.2 - .9 * sh, -.1 - 1.4 * sh], long: true });
  E.person(ctx, 1690, 930, 320, { dir: -1, light: .8, look: lerp(.4, -.1, sh), armR: [lerp(.3, 1.5, lf * (1 - sh)) + 1.2 * sh, lerp(.2, 2.2 + .2 * Math.sin(t * 2.6 + 1), lf * (1 - sh)) + 1.6 * sh], armL: [-.2 - .9 * sh, -.1 - 1.4 * sh] });
  // the gold card CORRECT: the system's own ruling, growing out of the plan's corner
  const cu = clamp(st.card ?? 0); if (cu > 0) F.goldCard(ctx, t, PLAN.x + PLAN.w - 30, PLAN.y + PLAN.h + 20, 92, { u: cu, text: 'CORRECT', rot: -.1 });
  // the audience from behind (folding chairs), you in the third row (yellow coat)
  const hu = clamp(st.hands ?? 0); let k = 0;
  for (const [ri, R] of ROWS.entries()) {
    const list = [...R.xs.map((x) => ({ x })), ...(R.you != null ? [{ x: R.you, you: true }] : [])].sort((a, b) => a.x - b.x);
    for (const p of list) {
      const order = p.you ? 1 : (k++ * 7 % 15) / 15, up = p.you ? sineIO(clamp(st.yours ?? 0)) : sineIO(clamp(hu * 1.6 - order * .6)), br = .03 * Math.sin(t * 1.1 + p.x);
      const o = { dir: p.x < 960 ? 1 : -1, light: .5, back: 1, look: (p.you ? st.youLook ?? .2 : .15) + br, armR: [lerp(.2, 2.95, up) + br, lerp(.1, 3.02, up)], armL: [-.2, -.1], view: 'back' };
      if (p.you) E.du(ctx, p.x, R.y, R.h, { ...o, dir: 1 }); else E.person(ctx, p.x, R.y, R.h, o);
      ctx.fillStyle = mixHex(P.night0, '#2a2238', .5); ctx.fillRect(p.x - R.h * .17, R.y - R.h * .36, R.h * .34, R.h * .06);   // the chair back
      ctx.fillRect(p.x - R.h * .15, R.y - R.h * .4, R.h * .025, R.h * .4); ctx.fillRect(p.x + R.h * .125, R.y - R.h * .4, R.h * .025, R.h * .4);
    }
    if (ri === 0) { ctx.fillStyle = rgba(CREAM, .7); for (const cx of [380, 930, 1460]) { ctx.beginPath(); ctx.moveTo(cx - 9, 1004); ctx.lineTo(cx + 9, 1004); ctx.lineTo(cx + 7, 1026); ctx.lineTo(cx - 7, 1026); ctx.closePath(); ctx.fill(); } }   // paper cups
  }
}

// ------------------------------------------------------------------------------------------------ the town's windows (replica of f67_world skyline(31), same seed → same windows)
let TOWNWIN = null;
export function townWindows() {
  if (TOWNWIN) return TOWNWIN;
  const r = prng(31), out = []; let x = -2600; const x1 = 700, base = GY - 6, hMin = 70, hMax = 230, wMin = 60, wMax = 150, litP = .1;
  while (x < x1) {
    const w = wMin + r() * (wMax - wMin), h = hMin + r() * (hMax - hMin); r();
    const cols = Math.max(2, Math.floor(w / 26)), rows = Math.max(2, Math.floor(h / 34)), cw = w / cols, rh = h / rows;
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { const q = r(); if (q < litP * 3) { const v = j / rows, wx = x + i / cols * w; out.push({ x: wx + cw * .28, y: base - h + v * h + rh * .3, w: cw * .44, h: rh * .42, q: r() }); } }
    x += w + r() * 18 - 4;
  }
  TOWNWIN = out.filter((o) => !(o.x > S.HALL.x - 240 && o.x < S.HALL.x + 240 && o.y > GY - 310)).map((o) => ({ ...o, d: Math.abs(o.x - WC.u) }));
  return TOWNWIN;
}
// a thousand small yeses: the windows light outward from the hall (u), warm → cool (cool 0..1: 'each one a little less yours')
export function yesWindows(ctx, t, u, cool = 0) {
  if (u <= 0) return;
  for (const w of townWindows()) {
    const on = clamp((u * 2400 - w.d) / 260 + (w.q - .5) * .3); if (on <= 0) continue;
    const c = mixHex(mixHex(LAMP.body, GOLD.hot, .45), COOL.body, clamp(cool * 1.4 - w.q * .4));
    ctx.fillStyle = rgba(c, .9 * on * (.85 + .15 * Math.sin(t * .5 + w.q * 30))); ctx.fillRect(w.x, w.y, w.w, w.h);
    if (on < 1) halo(ctx, w.x + w.w / 2, w.y + w.h / 2, 16, .5 * (1 - on), GOLD.halo, GOLD.core);
  }
}
export function hallWindowFrame(ctx, a) {   // the middle window's mullions, redrawn over the room while we fly through
  if (a <= 0) return; ctx.fillStyle = rgba(mixHex(P.night1, P.ind1, .45), a); ctx.fillRect(WIN.x + 18, WIN.y, 4, WIN.h); ctx.fillRect(WIN.x, WIN.y + 42, WIN.w, 4);
  ctx.strokeStyle = rgba(mixHex(P.night1, P.ind1, .45), a); ctx.lineWidth = 2; ctx.strokeRect(WIN.x, WIN.y, WIN.w, WIN.h);
}

// ------------------------------------------------------------------------------------------------ small world props (land px)
export function laptop(ctx, t, x, y, s, run = 0) {   // a laptop on a hand / table at (x, y): base + screen; run 0..1 = a check running (cool lines)
  ctx.fillStyle = mixHex(P.night0, P.blue2, .3); ctx.fillRect(x - s * .6, y - s * .08, s * 1.2, s * .08);
  ctx.fillStyle = rgba(COOL.body, .35 + .55 * clamp(run * 3)); ctx.fillRect(x - s * .5, y - s * .78, s, s * .66);
  if (run > 0) { ctx.fillStyle = rgba(COOL.core, .9); const n = 5; for (let i = 0; i < n; i++) { const f = clamp(run * n * 1.2 - i); if (f > 0) ctx.fillRect(x - s * .42, y - s * .7 + i * s * .11, s * .8 * f * (.5 + .5 * ((i * 37) % 10) / 10), Math.max(1, s * .04)); } }
  halo(ctx, x, y - s * .45, s * 1.4, .35 * clamp(run * 3), COOL.halo, COOL.core);
}
export function ruleBook(ctx, t, x, y, s, open = 1) {   // the referee's rule book on a stand (x, y = bottom centre); open 0..1
  ctx.fillStyle = mixHex(P.night1, P.blue2, .4); ctx.fillRect(x - 3, y - s * .9, 6, s * .9); ctx.fillRect(x - s * .3, y - 4, s * .6, 4);
  ctx.save(); ctx.translate(x, y - s * .95); ctx.rotate(-.18);
  const o = sineIO(open), w = s * .55, h = s * .4;
  ctx.fillStyle = PAPER.lit; ctx.fillRect(0, -h, w * o, h); ctx.fillStyle = PAPER.body; ctx.fillRect(-w * lerp(.15, 1, o), -h, w * lerp(.15, 1, o), h);
  ctx.fillStyle = rgba(PAPER.faint, .7 * o); for (let i = 0; i < 5; i++) { ctx.fillRect(-w * .85, -h + 8 + i * h * .17, w * .65, 2); ctx.fillRect(w * .15, -h + 8 + i * h * .17, w * .65, 2); }
  if (o < .9) { ctx.fillStyle = mixHex(P.blue1, P.night1, .3); ctx.fillRect(-w * .15, -h, w * .15 * (1 - o) + 3, h); }
  halo(ctx, 0, -h / 2, s * .9, .3 * o, P.halo2, CREAM);
  ctx.restore();
}
// THE NEW BRIDGE (c10 9.06): slender, one thin arch, rises out of the river at x (land px); nobody under the deck (a dashed outline)
export const NEWB = { x: -2160, w: 720 };
export function newBridge(ctx, t, u, empty = 1) {
  if (u <= 0) return; const x = NEWB.x, w = NEWB.w, k = expoOut(u);
  ctx.save(); ctx.beginPath(); ctx.rect(x - w, GY - 400, w * 2, 400 + 2); ctx.clip(); ctx.translate(0, (1 - k) * 160);
  ctx.strokeStyle = mixHex(P.blue2, COOL.line, .55); ctx.lineCap = 'round'; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(x - w / 2, GY - 52); ctx.lineTo(x + w / 2, GY - 52); ctx.stroke();
  ctx.lineWidth = 3.5; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const f = i / 40, px = x - w * .46 + w * .92 * f, py = GY + 30 - 92 * Math.sin(Math.PI * f); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
  ctx.lineWidth = 1.5; for (let i = 1; i < 12; i++) { const f = i / 12, px = x - w * .46 + w * .92 * f, py = GY + 30 - 92 * Math.sin(Math.PI * f); if (py > GY - 50) { ctx.beginPath(); ctx.moveTo(px, GY - 50); ctx.lineTo(px, py); ctx.stroke(); } }
  for (let i = 0; i < 4; i++) { const lx = x - w * .375 + i * w * .25; ctx.fillStyle = mixHex(P.blue2, COOL.line, .5); ctx.fillRect(lx - 1.5, GY - 100, 3, 48); halo(ctx, lx, GY - 102, 22, .45, COOL.halo, COOL.core); }
  ctx.restore();
  ctx.save(); ctx.globalAlpha *= clamp(empty) * clamp(u * 2 - 1); ctx.strokeStyle = rgba(CREAM2, .8); ctx.setLineDash([4, 4]); ctx.lineWidth = 1.6;   // where a human used to stand
  const px = x, py = GY + 50, hh = 44; ctx.beginPath(); ctx.ellipse(px, py - hh * .88, hh * .07, hh * .08, 0, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(px - hh * .13, py); ctx.lineTo(px - hh * .14, py - hh * .74); ctx.quadraticCurveTo(px, py - hh * .82, px + hh * .14, py - hh * .74); ctx.lineTo(px + hh * .13, py); ctx.stroke();
  ctx.setLineDash([]); ctx.restore();
}
export function dimOldBridge(ctx, a) {   // a night veil over the old stone bridge only (keeps the river)
  if (a <= 0) return; const b = S.BRIDGE.x, bw = 760; ctx.fillStyle = rgba(P.night0, .55 * a); ctx.fillRect(b - bw / 2 - 10, GY - 120, bw + 20, 186);
}
// THE ROAD before the labs (c10 9.01–9.04): a broad road toward you, a fork to the right (dashed: nobody says how)
export const ROAD = { x: (S.LABS.meta + S.LABS.other) / 2, y0: GY + 6, y1: GY + 300 };
export function road(ctx, t, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const { x, y0, y1 } = ROAD, yy = lerp(y0, y1, smooth(u));
  const l0 = x - 340, r0 = x + 340, l1 = x - 760, r1 = x + 760, at = (a, b, y) => lerp(a, b, (y - y0) / (y1 - y0));
  ctx.fillStyle = lin(ctx, 0, y0, 0, y1, [[0, mixHex(P.night1, P.blue1, .35)], [1, mixHex(P.night1, P.blue1, .2)]]);
  ctx.beginPath(); ctx.moveTo(l0, y0); ctx.lineTo(r0, y0); ctx.lineTo(at(r0, r1, yy), yy); ctx.lineTo(at(l0, l1, yy), yy); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(CREAM, .4); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(l0, y0); ctx.lineTo(at(l0, l1, yy), yy); ctx.moveTo(r0, y0); ctx.lineTo(at(r0, r1, yy), yy); ctx.stroke();
  for (let i = 0; i < 9; i++) { const ph = ((i + t * .35) / 9) % 1, ya = lerp(y0, y1, ph * ph), yb = Math.min(yy, ya + 6 + 26 * ph); if (ya < yy) { ctx.fillStyle = rgba(CREAM, .35); ctx.fillRect(x - 2 - 3 * ph, ya, 4 + 6 * ph, yb - ya); } }   // centre dashes stream toward you
  const fk = clamp(o.fork ?? 0);   // the branch: off the right edge at y GY+110, curving right; dashed (o.dash)
  if (fk > 0) {
    const ys = y0 + 110, xs = at(r0, r1, ys), pts = []; for (let i = 0; i <= 30; i++) { const f = i / 30 * fk; pts.push([xs + f * 820, ys + f * 150 - 40 * Math.sin(Math.PI * f)]); }
    ctx.strokeStyle = rgba(CREAM, .6); ctx.lineWidth = 3; ctx.setLineDash([14, 12]); ctx.lineDashOffset = -t * 20;
    ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1] - 34) : ctx.moveTo(p[0], p[1] - 34))); ctx.stroke();
    ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1] + 34 + f8(i)) : ctx.moveTo(p[0], p[1] + 34))); ctx.stroke(); ctx.setLineDash([]);
  }
}
const f8 = (i) => i * 1.2;

// ------------------------------------------------------------------------------------------------ the master (one take over c08–c11)
const CACHE = new WeakMap();
export async function b3(T) {
  if (CACHE.has(T)) return CACHE.get(T);
  const p = (async () => {
    E.prepareEditorial();
    const A = anchors(T);
    const parts = [];
    for (const id of ['08', '09', '10', '11']) parts.push((await import(new URL(`../scenes/sc${id}.mjs`, import.meta.url).href)).part);
    const K = parts.flatMap((pt) => pt.keys(A)).sort((a, b) => a[0] - b[0]);
    const k0 = K[0][0], kN = K[K.length - 1][0];
    // camera: plateHandover creep until the first key, the stitched path, then converged onto the end screen's camera
    A.uvs = (t) => (t < k0 ? plateUVS(t, A) : t >= A.endT ? endUVS(t, A) : t > kN ? K[K.length - 1].slice(1) : pathUVS(t, K));
    A.cam = (t) => { const [u, v, s] = A.uvs(t); const c = L(u, v, s); return t < A.coup + S.SEAM_HALF || t >= A.endT ? c : E.camDrift(c, t, Math.min(1, 2.4 / s) * smooth(span(t, k0, k0 + 1.5)) * (1 - smooth(span(t, A.endT - 2, A.endT))), 9); };
    const ranges = [[A.coup, A.look], [A.look, A.labs], [A.labs, A.si], [A.si, 1e9]];
    const draw = (ctx, t) => { const i = ranges.findIndex(([a, b]) => t >= a && t < b); parts[Math.max(0, i)].draw(ctx, t, A, A.cam(t)); };
    return draw;
  })();
  CACHE.set(T, p); return p;
}
