// c02 · Ten kinds of work · the rank row and its rail · No. 10 the first job at the desk: it falls, its face opens as the window of
// an office at night (the young desk empty, the door shut) · K1 Brynjolfsson grows from the door · seniors kept, juniors not hired
// (two rows of mini stones in the sky) · the rows become a house: the lit window (a parent inside), a closed door of light (the kid
// outside) · into the door's light → the studio lamp (W) · J2: the first bead takes a piece of ANIMATION · the header slab stands up
// and leans like a domino → cut on its fall to the leaning No. 9 (W, c03).
// Builder B1 · plan: docs/shots.md 2.01–2.15 · ONE entry. Camera in RANK coordinates (= ROW2-local: S.shift(c, −JR_DX) is the row world).
//
// | ID   | anchor (phrase)                      | picture                                                            | camera                 |
// |------|--------------------------------------|--------------------------------------------------------------------|------------------------|
// | 2.01 | Ten kinds of work                    | out of plateJakobRow: up into the sky, down onto the RANK ROW; rail | tilt up / down         |
// |      | Number one stands longest            | No. 1 turns to light                                               | overview               |
// | 2.02 | The order is a judgment call         | MEASURED (warm line over the tops), ROBOTS TODAY (cool, a hand)     | slow push right        |
// | 2.03 | Number ten. The first job at the desk | the flight along the row to No. 10, it falls; No. 10 title          | dolly (deep)           |
// | 2.04 | The junior coder …                   | code · chat · draft light on the lying face                        | breathing push         |
// | 2.05 | Most of them aren't being fired      | the face is a lit window → the office at night, the empty desk      | window fly-in ≥ 2.5 s  |
// | 2.06 | They're just not being hired         | the door stays shut, a line of light under it                      | pan to the door        |
// | 2.07 | The economist who measured           | the door frame grows into the clip plate → K1                      | still under the clip   |
// | 2.09 | And then the researchers found       | out of the window; SENIOR row full, JUNIOR row with gaps           | pull back, up          |
// | 2.10 | Companies still fight                | senior stones warm; a cool bead passes the junior gaps             | drift                  |
// | 2.11 | If you've been doing your work       | the rows become a house: lit window (parent), closed door, the kid | push                   |
// | 2.12 | For Jakob, it also started           | into the door's light → out of the studio lamp                     | dive · W               |
// | 2.13 | [J2]                                 | a bead drops into ANIMATION and takes its first piece (2022)        | follow the bead        |
// | 2.14 | A few pictures                       | cool clips in ANIMATION, the rest by hand                          | pull back              |
// | 2.15 | But the next domino                  | the ANIMATION header stands up and leans → cut to No. 9 (c03)       | push · cut on action W |
import { Path2D } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f25_kit.mjs';
import * as S from '../lib/f25_seams.mjs';
import * as B from '../lib/f25_b1_lib.mjs';
import * as SC from '../lib/f25_b1_scenes.mjs';
import { headerCut } from '../lib/f25_b1_cut.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, halo } = E;
const { rise, maskLine, F0 } = F;
const DX = S.JR_DX;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = { a0: R.a, end: R.b };
  a.n10fall = G('Number ten is falling', a.a0); a.n1 = G('Number one stands', a.a0); a.order = G('The order is a judgment', a.a0);
  a.measured = G('researchers have measured', a.order); a.robots = G('and from where', a.order); a.fly = G('where the robots actually', a.order) + 1.25;
  a.n10 = G('Number ten. The first', a.a0); a.job = G('The first job at the desk', a.n10);
  a.coder = G('The junior coder', a.n10); a.support = G('The support agent', a.coder); a.draft = G('first draft', a.support);
  a.most = G('Most of them', a.coder); a.quieter = G('Something quieter', a.most); a.hired = G("They're just not being hired", a.most);
  a.econ = G('The economist who measured', a.hired); a.K1 = T.clip('K1');
  a.research = G('And then the researchers found', a.econ); a.exp = G('People with experience', a.research); a.same = G('in the very same jobs', a.exp);
  a.fight = G('Companies still fight', a.exp); a.cut = G("They've cut back", a.fight);
  a.twenty = G("If you've been doing", a.cut); a.keep = G("the one they keep", a.twenty); a.kids = G("It's your kids", a.twenty); a.closed = G('first door closed', a.kids);
  a.jakob = G('For Jakob, it also', a.kids); a.J2 = T.clip('J2');
  a.few = G('A few pictures', a.jakob); a.hand = G('Everything else still', a.few); a.next = G('But the next domino', a.few);
  return [{ t: R.a, draw: scene(a, T), print: F.PRINT25 }];
};

const C = (u, v, s) => E.aim(F0, u, v, s);
const F10 = B.field(10);
const SH = B.STONE_H, SW = B.STONE_W;
// the window in No. 10's lying face (field frame of No. 10)
const LIE = Math.PI / 2 - .015;
const WIN = B.faceWindow(LIE);
const WIN_C = B.facePt(LIE, SW / 2, -SH / 2);
// the explainer field above No. 10 (local units = world units on No. 10's card): two rows of mini stones
const MH = 190, ROWX = -1330, PITCH = 150, YS = -660, YJ = -300, NJ = 8;
const JUNIOR_HAS = [1, 0, 1, 0, 0, 1, 0, 0];
// the house of 2.11 (same field)
const WALL = { x0: -1380, x1: -260, y0: -960, y1: YJ };
const WINDOW = { x: -1250, y: -820, w: 480, h: 250 };
const DOOR = { x: -600, y: -640, w: 170, h: 340 };

function scene(a, T) {
  const tPlate = a.a0 + S.SEAM_HALF;
  const k0 = (t) => 1 + S.CREEP * Math.max(0, t - (a.a0 - S.SEAM_HALF));
  const plateCam = (t) => C(1010 + S.TRUCK * (k0(t) - 1) / S.CREEP, 560, 1.06 * k0(t));
  const tSw = a.a0 + 1.55;                                // Jakob's row → the rank row (both out of frame, camera in the sky)
  const t10 = a.n10 + .55;                                 // No. 10 starts to fall (anticipation before)
  const winU = (t) => smooth(span(t, a.most - 1.2, a.most - .3)) * (1 - smooth(span(t, a.research + 2.4, a.research + 3.6)));
  // the window's sub-world home: in front of the face, the window fills the frame height
  const home = B.fieldCam(F10, WIN_C[0], WIN_C[1], 9.6);
  const L = (u, v, s) => B.cAdd(C(u, v, s), home);          // a local (office) camera key, in world coordinates
  const tf = a.jakob + 1.35;                               // flood peak: into the door's light → out of the studio lamp
  const cutC = headerCut(T);                               // the c02 → c03 match (shared with c03)

  // ------------------------------------------------------------------ camera (rank coordinates)
  const KA = [[a.a0 - .5, plateCam(a.a0 - .5)], [tPlate, plateCam(tPlate)], [a.a0 + 1.9, C(1180, -720, .92)], [a.n1 + .5, C(1270, 600, .72)],
    [a.order + 2, C(1370, 606, .8)], [a.fly, C(1480, 600, .82)]];
  const doorFace = B.fieldCam(F10, DOOR.x + DOOR.w / 2, DOOR.y + DOOR.h * .55, 26);
  const KB = [[a.fly, KA[KA.length - 1][1]], [a.n10 + .95, B.fieldCam(F10, -120, -290, .8)], [a.coder - .3, B.fieldCam(F10, -200, -150, 1.12)],
    [a.most - 1.3, B.fieldCam(F10, -238, -110, 1.3)]];
  const KB2 = [[a.most - 1.3, B.fieldCam(F10, -238, -110, 1.3)], [a.most + 1.0, home], [a.quieter + .4, L(905, 600, 1.16)], [a.hired - .2, L(1010, 650, 1.3)],
    [a.econ - .2, L(1450, 560, 1.2)], [a.K1.start, L(1470, 568, 1.26)], [a.K1.end + .9, L(1480, 572, 1.3)]];
  const KC = [[a.K1.end + .9, KB2[KB2.length - 1][1]], [a.research + 1.0, L(960, 540, 1.04)], [a.research + 2.2, home],
    [a.exp + 1.2, B.fieldCam(F10, -560, -560, .9)], [a.fight + .5, B.fieldCam(F10, -620, -520, .95)], [a.cut + .3, B.fieldCam(F10, -560, -470, .93)],
    [a.twenty + 1.2, B.fieldCam(F10, -760, -560, .98)], [a.kids + .3, B.fieldCam(F10, -660, -540, 1.06)], [a.jakob - .1, B.fieldCam(F10, -560, -500, 1.18)]];
  const KS = [[tf + 1.4, C(640, 690, 1.45)], [a.J2.start + 1.2, C(860, 560, 1.0)], [a.J2.start + 4.6, C(1180, 560, 1.08)], [a.J2.start + 9.5, C(1330, 640, 1.26)],
    [a.J2.end - .5, C(1300, 630, 1.2)], [a.few + .9, C(1080, 560, .98)], [a.next + .2, C(1020, 600, 1.4)], [cutC.t0, cutC.cam0]];
  const camRank = (t) => {
    if (t < tPlate) return plateCam(t);
    if (t < KA[KA.length - 1][0]) return F.camPath(t, KA);
    if (t < KB[KB.length - 1][0]) return B.camFocusPath(t, KB, F10.Z, [F10.x - 140 * F10.sc, F10.y - 120 * F10.sc]);
    if (t < KB2[KB2.length - 1][0]) return B.camPathZ(t, KB2, home.z + 1700);
    if (t < KC[KC.length - 1][0]) return B.camAimPath(t, KC, home.z + 1700);
    return E.camAt(t, [[a.jakob - .1, KC[KC.length - 1][1]], [tf, doorFace, 'i']], doorFace.z + 400);
  };
  const camStudio = (t) => {
    if (t < tf + 1.4) return E.camAt(t, [[tf, F.STUDIO_CAM.lamp(18)], [tf + 1.4, KS[0][1], 'o']]);
    if (t < cutC.t0) return F.camPath(t, KS);
    return cutC.cam(t);
  };

  // ------------------------------------------------------------------ the rank row world (+ No. 10's face, window, explainers)
  function rankPart(ctx, t) {
    const c = E.camDrift(camRank(t), t, .6, 3);
    // inside the office: the face plane is behind the camera
    if (t > a.most && !B.inFront(c, F10) && winU(t) > .5) { SC.office(ctx, B.local(c, home), t, {}); return c; }
    const w = smooth(span(t, a.a0 + .7, a.a0 + 2.6));
    const cs = { ...c, x: c.x + DX * (1 - w) };
    if (t < tSw) {   // Jakob's row (the plate's world) until the camera is up in the sky
      S.rowWorld(ctx, S.shift(c, -DX), t, S.JR_STATE);
      return c;
    }
    const gold1 = smooth(span(t, a.n1 - .2, a.n1 + 1.1));
    B.rankWorld(ctx, c, t, {
      sky: { cs }, gold: gold1,
      fall: (n) => (n === 10 ? B.fallAngle(t, t10) : 0),
      each: (n) => (n === 10 ? { glyphA: 1 - smooth(span(t, B.fallHit(t10) - .2, B.fallHit(t10) + .5)) } : null),
      after: (n, ang) => { if (n === 10) face10(ctx, t, c, ang); },
    });
    lines(ctx, t, c);
    return c;
  }
  // on No. 10's card (field frame): its three task glyphs, the window and the office behind it, the explainers in the sky above
  function face10(ctx, t, c, ang) {
    const landed = smooth(span(t, B.fallHit(t10) - .1, B.fallHit(t10) + .6));
    const wu = winU(t);
    if (landed > 0 && wu < 1) {
      const lit = (tw) => smooth(span(t, tw - .05, tw + .35));
      const ga = landed * (1 - smooth(span(t, a.most - 1.0, a.most - .4)));
      B.faceGlyphs(ctx, t, ang, [['code', .8, lit(a.coder), undefined, ga], ['chat', .5, lit(a.support), undefined, ga], ['draft', .2, lit(a.draft), undefined, ga]], { size: 78 });
    }
    if (wu > 0) {
      B.litWindow(ctx, WIN, WIN_C[0], WIN_C[1], 260, wu);
      if (wu > .02) {   // the office through the window (with the local camera), dimmed by the window light until it opens
        const m = ctx.getTransform();
        const k = smooth(span(wu, 0, .3));
        ctx.save(); ctx.clip(WIN); ctx.globalAlpha = k; SC.office(ctx, B.local(c, home), t, {}); ctx.restore(); ctx.setTransform(m);
        ctx.save(); ctx.clip(WIN); ctx.fillStyle = rgba(P.core1, .9 * smooth(span(wu, 0, .3)) * (1 - smooth(span(wu, .3, 1)))); ctx.fillRect(-600, -300, 700, 400); ctx.restore();
        if (t > a.research) { ctx.save(); ctx.clip(WIN); ctx.fillStyle = rgba(P.core1, .85 * smooth(span(t, a.research + 2.2, a.research + 3.4))); ctx.fillRect(-600, -300, 700, 400); ctx.restore(); }
      }
    }
    explainers(ctx, t);
  }

  // ------------------------------------------------------------------ 2.02 MEASURED · ROBOTS TODAY (screen space, along the row)
  function lines(ctx, t, c) {
    const out = 1 - expoIn(span(t, a.fly - .1, a.fly + .45));
    const um = sineIO(span(t, a.measured - .1, a.measured + 1.8)) * out, ur = sineIO(span(t, a.robots - .1, a.robots + 1.8)) * out;
    if (um <= 0 && ur <= 0) return;
    const top = [], base = [];
    for (let n = 2; n <= 10; n++) { const s = B.stoneOf(n), p = E.project(c, s.Z, s.x + s.w / 2, s.y - s.h - 70 * s.s), q = E.project(c, s.Z, s.x + s.w / 2, s.y + 46 * s.s); if (p) top.push([p[0], p[1], 4]); if (q) base.push([q[0], q[1], 4]); }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (um > 0 && top.length > 2) {
      const pts = E.catmull(top, 10), hd = E.trail(ctx, pts, um, { w: 3.5, spark: um < 1 });
      maskLine(ctx, [['MEASURED', 0]], top[0][0] - 40, top[0][1] - 26, 28, rise(span(t, a.measured + .2, a.measured + 1)) * out, { serif: false, weight: 600, col: F.WARM.text, glow: false });
    }
    if (ur > 0 && base.length > 2) {
      const pts = E.catmull(base, 10), hd = F.coolPath(ctx, pts, 0, ur, 3.5, 1);
      if (hd) hand(ctx, hd[0] + 6, hd[1] - 30, 46, out);
      maskLine(ctx, [['ROBOTS TODAY', 0]], base[0][0] - 40, base[0][1] + 52, 28, rise(span(t, a.robots + .2, a.robots + 1)) * out, { serif: false, weight: 600, col: F.COOL.text, glow: false });
    }
    ctx.restore();
  }
  function hand(ctx, x, y, s, a1) {
    const p = new Path2D(); p.addPath(E.handPath({ pose: 'open' }), E.handMatrix(0, .5, -Math.PI / 2, .34, 1));
    const q = new Path2D(); q.addPath(p, { a: s, b: 0, c: 0, d: s, e: x, f: y });
    halo(ctx, x, y, s, .25 * a1, F.COOL.halo, F.COOL.body);
    ctx.save(); ctx.globalAlpha = a1; ctx.fillStyle = F.COOL.body; ctx.fill(q); ctx.restore();
  }

  // ------------------------------------------------------------------ 2.09–2.11 explainers in the sky above No. 10 (field frame)
  function explainers(ctx, t) {
    const toHouse = sineIO(span(t, a.twenty + .1, a.twenty + 2.4));          // the rows become the house
    const gone = 1;
    // baselines (light rules)
    const rs = span(t, a.exp - .3, a.exp + .6), rj = span(t, a.same - .3, a.same + .6);
    if (rs > 0 && toHouse < 1) F.rule(ctx, ROWX - 40, YS, ROWX - 40 + (PITCH * 8) * expoOut(rs), YS, 1, { w: 2.5, a: .6 * (1 - toHouse) });
    if (rj > 0) F.rule(ctx, ROWX - 40, YJ, lerp(ROWX - 40 + PITCH * 8 * expoOut(rj), WALL.x1 + 200, toHouse), YJ, 1, { w: 2.5, a: .6 });
    // labels
    const lu = rise(span(t, a.exp + .1, a.exp + .9)) * (1 - expoIn(span(t, a.twenty, a.twenty + .6)));
    const lj = rise(span(t, a.same + .1, a.same + .9)) * (1 - expoIn(span(t, a.twenty, a.twenty + .6)));
    if (lu > 0) B.rightLine(ctx, [['SENIOR', 1]], ROWX - 60, YS - 70, 44, lu, { col: F.WARM.text });
    if (lj > 0) B.rightLine(ctx, [['JUNIOR', 0]], ROWX - 60, YJ - 70, 44, lj, { col: F.COOL.text });
    // the house (2.11): the wall rises from the junior baseline
    if (toHouse > 0) house(ctx, t, toHouse);
    // SENIOR: full, warm rims on "Companies still fight over the senior"; → the panes of the lit window
    for (let k = 0; k < 8; k++) {
      const e = span(t, a.exp + .2 + k * .07, a.exp + .9 + k * .07); if (e <= 0) continue;
      const warm = smooth(span(t, a.fight + .3 + k * .06, a.fight + 1.1 + k * .06));
      const x = ROWX + k * PITCH;
      if (toHouse <= 0) B.mini(ctx, t, x, YS, MH, { a: e, warm, glyph: 'person', glyphWarm: warm });
      else {   // morph: stone k → pane k of the window
        const pw = WINDOW.w / 8, px = lerp(x, WINDOW.x + k * pw, toHouse), py = lerp(YS, WINDOW.y + WINDOW.h, toHouse), pwk = lerp(MH * .3, pw - 4, toHouse), ph = lerp(MH, WINDOW.h, toHouse);
        if (toHouse < .6) B.mini(ctx, t, x, YS, MH, { a: 1, warm, glyph: 'person', glyphWarm: warm * (1 - toHouse * 1.6) });
        const pu = smooth(span(toHouse, .3, 1));
        if (pu > 0) { ctx.save(); ctx.globalAlpha = pu; ctx.fillStyle = E.lin(ctx, 0, py - ph, 0, py, [[0, P.core1], [.5, P.halo0], [1, mixHex(P.halo0, P.shade0, .5)]]); ctx.fillRect(px + 2, py - ph, pwk, ph); ctx.restore(); }
      }
    }
    if (toHouse > .5) parent(ctx, t, smooth(span(toHouse, .55, 1)));
    // JUNIOR: three stones, five gaps (cool dashed); a cool bead passes the gaps on "cut back on hiring the junior one"
    const bu = sineIO(span(t, a.cut + .1, a.cut + 2.6));
    const bx = lerp(ROWX - 120, ROWX + PITCH * 8 + 40, bu);
    for (let k = 0; k < NJ; k++) {
      const x = ROWX + k * PITCH, e = span(t, a.same + .2 + k * .07, a.same + .9 + k * .07); if (e <= 0) continue;
      const sinkH = expoIn(span(t, a.twenty + k * .05, a.twenty + .9 + k * .05));
      if (JUNIOR_HAS[k]) { if (sinkH < 1) B.mini(ctx, t, x, YJ, MH, { a: e * (1 - sinkH) }); continue; }
      const pass = bu > 0 && bu < 1 ? Math.exp(-(((bx - (x + MH * .15)) / 90) ** 2)) : 0;
      if (k === 7) {   // the last gap becomes the door
        if (toHouse <= 0) B.gapSlot(ctx, t, x, YJ, MH, e, pass);
        else door(ctx, t, x, toHouse, pass);
      } else {
        const g = toHouse > 0 ? 1 - smooth(span(toHouse, 0, .5)) : 1;   // the other gaps slide to the door and close into it
        const gx = lerp(x, DOOR.x, smooth(span(toHouse, 0, .5)));
        if (g > 0) B.gapSlot(ctx, t, gx, YJ, MH * lerp(1, .6, 1 - g), e * g, pass);
      }
    }
    if (bu > 0 && bu < 1) F.agent(ctx, t, bx, YJ - MH * .5 + 30 * Math.sin(bu * 9), 16, { ring: 1, think: .3 });
    kid(ctx, t);
  }
  // the facade: rises out of the junior baseline (2.11)
  function house(ctx, t, u) {
    const top = lerp(WALL.y1, WALL.y0, expoOut(u));
    ctx.save(); ctx.beginPath(); ctx.rect(WALL.x0 - 40, top, WALL.x1 - WALL.x0 + 80, WALL.y1 - top); ctx.clip();
    ctx.fillStyle = E.lin(ctx, WALL.x0, 0, WALL.x1, 0, [[0, mixHex(F.STONE.face, P.night1, .35)], [1, mixHex(F.STONE.face, P.night0, .45)]]); ctx.fillRect(WALL.x0, WALL.y0, WALL.x1 - WALL.x0, WALL.y1 - WALL.y0);
    ctx.fillStyle = F.STONE.top; ctx.fillRect(WALL.x0 - 20, WALL.y0 - 16, WALL.x1 - WALL.x0 + 40, 18);
    ctx.fillStyle = rgba(P.night0, .9); ctx.fillRect(WINDOW.x - 10, WINDOW.y - 10, WINDOW.w + 20, WINDOW.h + 20);
    ctx.restore();
  }
  function parent(ctx, t, u) {   // inside the lit window: the parent at work (dark against the warm light), the warm rim on the shoulders
    ctx.save(); ctx.beginPath(); ctx.rect(WINDOW.x, WINDOW.y, WINDOW.w, WINDOW.h); ctx.clip();
    ctx.translate(0, (1 - u) * 80);
    E.person(ctx, WINDOW.x + 250, WINDOW.y + WINDOW.h + 70, 250, { light: -1, dir: -1, look: -.15 + .06 * Math.sin(t * .7), armR: [1.0 + .05 * Math.sin(t * 6.2), 1.6], armL: [.8, 1.5 + .05 * Math.sin(t * 5.3)], rim: P.core1 });
    ctx.fillStyle = mixHex(P.shade0, P.night0, .6); ctx.fillRect(WINDOW.x + 40, WINDOW.y + WINDOW.h - 40, 280, 40);
    ctx.restore();
    ctx.fillStyle = rgba(P.night0, .85); for (let k = 1; k < 8; k++) ctx.fillRect(WINDOW.x + WINDOW.w * k / 8 - 2, WINDOW.y, 4, WINDOW.h);
    halo(ctx, WINDOW.x + WINDOW.w / 2, WINDOW.y + WINDOW.h / 2, 520, .28 * u, P.halo1, P.halo0);
  }
  // the closed door of light, grown from the last gap
  function door(ctx, t, x0, u, pass) {
    const g = sineIO(span(u, 0, .8));
    const x = lerp(x0, DOOR.x, g), y = lerp(YJ - MH, DOOR.y, g), w = lerp(MH * .3, DOOR.w, g), h = lerp(MH, DOOR.h, g);
    const glow = smooth(span(u, .4, 1)) * (1 + .25 * smooth(span(t, a.jakob - .2, a.jakob + 1.2)) + .05 * Math.sin(t * 1.4));
    if (glow > 0) {
      halo(ctx, x + w / 2, y + h / 2, h * .9, .3 * glow, P.halo1, P.halo0);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(P.core0, .9 * Math.min(1, glow)); ctx.lineWidth = 7; ctx.beginPath(); ctx.rect(x - 4, y - 4, w + 8, h + 4); ctx.stroke();
      ctx.fillStyle = E.lin(ctx, 0, y + h, 0, y + h + 70, [[0, rgba(P.halo1, .4 * Math.min(1, glow))], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w + 90, y + h + 70); ctx.lineTo(x - 90, y + h + 70); ctx.closePath(); ctx.fill(); ctx.restore();
    }
    ctx.fillStyle = E.lin(ctx, x, 0, x + w, 0, [[0, mixHex(P.night1, P.ind1, .4)], [1, P.night0]]); ctx.fillRect(x, y, w, h);
    if (g < 1) B.gapSlot(ctx, t, x, y + h, h, 1 - g, pass);
    ctx.fillStyle = mixHex(P.blue1, P.night1, .4); ctx.beginPath(); ctx.arc(x + w - 22, y + h * .55, 6 * g, 0, Math.PI * 2); ctx.fill();
  }
  // the kid: walks in from the left along the ground (junior baseline), stops before the closed door and looks up at it
  function kid(ctx, t) {
    const u = span(t, a.twenty + 1.2, a.kids + .6); if (u <= 0) return;
    const x = lerp(WALL.x0 - 420, DOOR.x - 150, sineIO(u)), walking = u < 1;
    const look = .55 * smooth(span(t, a.kids + .4, a.kids + 1.4));
    const rimK = mixHex(P.halo0, P.blue0, .25);
    E.person(ctx, x, YJ, 175, walking ? { walk: u * 22, dir: 1, light: 1, rim: rimK } : { dir: 1, light: 1, rim: rimK, look: look + .04 * Math.sin(t * .8) });
  }

  // ------------------------------------------------------------------ the studio (J2)
  function room(ctx, t) {
    const c = E.camDrift(camStudio(t), t, .6, 7);
    const j = a.J2.start;
    const sweep = sineIO(span(t, j + 5.2, j + 9.6));
    const part = [0, 0, .3 * sweep, 0, 0, 0, 0, 0, 0];
    const ph = 1 - .486 * sineIO(span(t, tf + .6, j + .8));                       // the playhead scrubs back to 2022
    const ru = { u: span(t, tf + .3, tf + 2.2) * (1 - span(t, a.few + .2, a.few + 1.4)), hot: 1 };
    const out = F.studio(ctx, c, t, { part, level: 0, work: 1, playhead: ph, ruler: ru, lit: [0, 0, .6 * smooth(span(t, j + 4.5, j + 6)) * (1 - span(t, a.few + 1, a.few + 2.5)), 0, 0, 0, 0, 0, 0] });
    // the first bead: drops from the dark above the wall into the ANIMATION lane, takes its first piece, then keeps working it
    E.card(ctx, c, F0, () => {
      const LN = F.STUDIO.lanes, L = LN.x1 - LN.x0, ly = F.laneMid(2), d = span(t, j + 3.6, j + 5.2);
      if (d <= 0) return;
      const x0 = LN.x0 + 20, drop = sineIO(d), loop = t > j + 9.6 ? .5 - .5 * Math.cos((t - j - 9.6) * .9) : 0;
      const bx = d < 1 ? lerp(x0 + 160, x0, drop) : lerp(x0, LN.x0 + L * .3 - 14, sweep) - (L * .3 - 34) * loop;
      const by = d < 1 ? lerp(F.laneTop(8) - 260, ly, drop) - Math.sin(Math.PI * drop) * 60 : ly;
      F.agent(ctx, t, bx, by, 10, { ring: .8, think: d < 1 ? .5 : 0 });
    });
    headerSlab(ctx, t, c);
    return c;
  }
  // 2.15 the ANIMATION header slab leaves its slot, stands up (pivot: its bottom-right corner) and leans left like a domino
  function headerSlab(ctx, t, c) {
    const st = cutC.stand(t), lean = cutC.lean(t);
    if (st <= 0) return;
    const hd = F.STUDIO.head, y = F.laneTop(2), lh = F.STUDIO.lanes.lh, [px, py] = cutC.pivot;
    E.card(ctx, c, F0, () => {
      ctx.fillStyle = P.night0; ctx.beginPath(); ctx.roundRect(hd.x0, y, hd.x1 - hd.x0, lh, 6); ctx.fill();          // the empty slot
      ctx.strokeStyle = rgba(P.blue0, .4); ctx.lineWidth = 1.5; ctx.stroke();
      ctx.save(); ctx.translate(px, py); ctx.rotate(Math.PI / 2 * st - lean); ctx.translate(-px, -py);
      halo(ctx, (hd.x0 + hd.x1) / 2, y + lh / 2, 200, .12 * st, P.blue0, F.STONE.rim);
      ctx.fillStyle = E.lin(ctx, hd.x0, 0, hd.x1, 0, [[0, mixHex(F.STONE.face, P.ind0, .2)], [1, mixHex(F.STONE.face, P.night1, .3)]]); ctx.beginPath(); ctx.roundRect(hd.x0, y, hd.x1 - hd.x0, lh, 6); ctx.fill();
      ctx.strokeStyle = rgba(F.STONE.rim, .8); ctx.lineWidth = 2; ctx.stroke();
      F.glyph(ctx, 'animation', hd.x0 + 34, y + lh / 2, 30, { lit: .55, glow: .5 });
      E.glowText(ctx, 'ANIMATION', hd.x0 + 64, y + lh / 2 + 8, { size: 22, spacing: .14, col: F.WARM.text, glow: false, a: .9 });
      ctx.restore();
    });
  }

  return (ctx, t) => {
    if (t < tPlate) { S.plateJakobRow(ctx, t, T); F.rankRail(ctx, t, T); return; }
    const inStudio = t >= tf;
    let c;
    if (inStudio) c = room(ctx, t); else c = rankPart(ctx, t);
    // screen layer: rank title, the clip plate (K1), the rail, the lower third
    const tu = rise(span(t, a.n10 + .1, a.n10 + .9)) * (1 - expoIn(span(t, a.most - 1.4, a.most - .7)));
    F.rankTitle(ctx, t, 110, 330, 10, 'THE FIRST JOB AT THE DESK', tu, { size: 120 });
    const k1 = a.K1, m = sineIO(span(t, a.econ + .2, k1.start - .2)) * (1 - sineIO(span(t, k1.end, k1.end + .9)));
    if (m > 0 && !inStudio) {
      const cl = B.local(c, home), r = SC.officeDoorRect(cl);
      if (r) { ctx.save(); ctx.globalAlpha = smooth(span(m, 0, .2)); F.clipPlate(ctx, t, T, 'K1', { from: r, morph: m }); ctx.restore(); }
    }
    F.rankRail(ctx, t, T, { a: 1 - smooth(span(m, .55, .95)) });
    if (inStudio) F.lowerThird(ctx, t, T, 'J2', { y: 170 });
    const fl = t < tf ? E.smooth(span(t, tf - 1.4, tf)) : 1 - E.smooth(span(t, tf, tf + 1.4));
    E.lightFlood(ctx, fl);
  };
}
