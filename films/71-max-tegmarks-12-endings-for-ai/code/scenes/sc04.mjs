// Film 71 · c04 (B1): ENDING 9/12 · 1984. One continuous take (docs/shots.md 9.01 – 9.14), one world: the dawn street, THE YARD above it
// (the sky opens into the night), the ranked row further up and to the right (offset ROWO, multiples of the rail pitch):
//   SCENARIO · you walk to work · the corner camera turns, a frame snaps around your head before you reach the corner · pull back: no
//   machine light on the street; the frame turns lamp-warm and leads to the lit window at the street end: people at a monitor wall · 1984 ·
//   the lab gets taped (RESEARCH BANNED), a camera grows on every corner · the camera pans up into the night: the cameras fly up as dots
//   onto a city plan that lights dot by dot (switch tag NOV 16, 2026 · Hong Kong Police) · the plan dots become a field of 600 (1 dot =
//   100 cameras): GOAL: 60,000 CAMERAS BY 2028 · the dots link to one cool core: WITH AI, NOT AGAINST IT · the dots stream into the core,
//   the core opens into a rack, every chip gets a locator point: TO STOP AI, WATCH THE CHIPS · one chip flies out over a dot field of the
//   world and pings (switch tag MAR 2026 · U.S. CHIP SECURITY ACT) · a shield: SECURITY · the chip turns: an eye; it flies into the HUD
//   pocket · down to the row: the cameras on door 9 turn away, door 8 opens on machines only; the camera pushes in (c05 goes on from there).
import * as F from '../lib/f71_kit.mjs';
import * as S from '../lib/f71_world.mjs';
import * as B from '../lib/b1_extra.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, prng, GOLD, CREAM, CREAM2, COOL, LAMP, PAPER, TXT, DATA } = F;
const TAU = Math.PI * 2;
export const ROWO = { x: 2700, y: -1200 };   // the row's place in this world (multiples of 300: the rails line up)
export const rowV = (v) => ({ x: v.x - ROWO.x, y: v.y - ROWO.y, s: v.s });
export const D8 = { x: F.rowX(8) + ROWO.x, y: F.ROW.y + ROWO.y, w: F.ROW.w, h: F.ROW.h };
export const D8C = [D8.x, D8.y - D8.h / 2];
export const V_END = { x: D8C[0], y: D8C[1] + 6, s: 2.6 };   // the view at R.b (c05 starts here)
export const machinesInner = (t, v) => (c, box) => {   // behind door 8: only machines (agent lights), no lamp
  c.fillStyle = lin(c, 0, box.y0, 0, box.y0 + box.h, [[0, mixHex(P.night0, COOL.deep, .5)], [1, P.night0]]); c.fillRect(box.x0, box.y0, box.w, box.h);
  const r = prng(7800); for (let i = 0; i < 26; i++) { const x = box.x0 + box.w * (.12 + .76 * r()), y = box.y0 + box.h * (.08 + .84 * r()); F.agentGlyph(c, t, x + 2 * Math.sin(t * .7 + i), y, box.w * .07, { ping: .5, ph: i * .13 }); }
};
// the row with the cameras on door 9 (they turn away) and door 8 opening on machines only; shared with c05 (same frame at the boundary).
// A = { opp, why } (phrase times); o.open8 overrides door 8's opening
export function rowWorld(ctx, t, T, v, A, o = {}) {
  const now8 = span(t, A.why - .2, A.why + .8);
  S.rowScene(ctx, t, T, { n: 9, v: rowV(v), yard: false, hud: 0,
    lit: (m) => (m === 9 ? lerp(1, .6, now8) : m === 8 ? lerp(.6, 1, now8) : m > 9 ? .22 : .6),
    scale: (m) => (m === 9 ? lerp(1.06, 1, now8) : m === 8 ? lerp(1, 1.06, now8) : 1),
    beam: (m) => (m === 8 ? lerp(.3, .8, now8) : m === 9 ? lerp(.8, .3, now8) : .3),
    open: (m) => (m === 8 ? B.nz(o.open8 ?? .9 * sineIO(span(t, A.why - .1, A.why + 1.2))) : undefined), inner: (m) => (m === 8 ? (o.inner8 ?? machinesInner(t, v)) : undefined) });
  const turn = sineIO(span(t, A.opp - .1, A.opp + .7)), dx9 = F.rowX(9) + ROWO.x, ty = F.ROW.y + ROWO.y - F.ROW.h * 1.06 - 54;
  F.inView(ctx, v, () => {
    ctx.strokeStyle = rgba(CREAM, .3); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(dx9 - 70, ty + 8); ctx.lineTo(dx9 + 70, ty + 8); ctx.stroke();
    B.camGlyph(ctx, t, dx9 - 56, ty, 34, lerp(.9, Math.PI + .7, turn), { col: mixHex(COOL.body, LAMP.body, .6), glow: 1 - turn });
    B.camGlyph(ctx, t, dx9 + 56, ty, 34, lerp(Math.PI - .9, -.7, turn), { col: mixHex(COOL.body, LAMP.body, .6), glow: 1 - turn });
  });
}
export const D8BOX = { x0: D8.x - F.ROW.w * 1.06 / 2, y0: D8.y - F.ROW.h * 1.06, w: F.ROW.w * 1.06, h: F.ROW.h * 1.06 };

export default function (T, R) {
  const G = (p, n = 0) => T.G(p, n, R.a - .1), GE = (p, n = 0) => T.GE(p, n, R.a - .1);
  const A = {
    camera: G('A camera knows your face'), no: G('No machine rules you'), people: G('People do'), named: G('Tegmark named this one'), nine: G('Nineteen Eighty-Four'),
    humans: G('Humans stop superintelligence'), stop: G('stop superintelligence for good'), surv: G('with a surveillance state'), nov: G("In November, Hong Kong's police"), face: G('face recognition'),
    network: G("city's camera network"), goal: G('The goal: sixty thousand'), sixty: G('sixty thousand'), with: G("That's surveillance with AI"), notAg: G('not against it'),
    but: G('But stopping AI means'), chips: G('watching the chips'), wash: G('In Washington, a bill'), prove: G('prove where they are'), aim: G('Its aim is security'),
    tool: G("It's also a tool this ending"), some: G('And some ask the opposite'), opp: G('the opposite'), why: G('why stop the machines'),
  };
  A.sec = T.G('security', 0, A.aim);
  // ---------------------------------------------------------------- geometry (world coords)
  const PLAN = { x0: 505, y0: -1310, cw: 170, ch: 130, cols: 7, rows: 4 };
  const planPts = []; for (let r = 0; r <= PLAN.rows; r++) for (let c = 0; c <= PLAN.cols; c++) planPts.push([PLAN.x0 + c * PLAN.cw, PLAN.y0 + r * PLAN.ch]);
  const planOrder = planPts.map((p, i) => [Math.hypot(p[0] - 1100, p[1] + 1050) + (i * 37 % 11) * 9, i]).sort((a, b) => a[0] - b[0]).map((q) => q[1]);
  const camToPlan = [9, 12, 22, 27, 30, 18];   // the 5 corner cameras + the first camera → their plan dots
  const FIELD = { x0: 560, y0: -1246, step: 28, cols: 40, rows: 15 };
  const fieldPt = (k) => [FIELD.x0 + (k % FIELD.cols) * FIELD.step, FIELD.y0 + Math.floor(k / FIELD.cols) * FIELD.step];
  const CORE = [1800, -1050];
  const RACK = { x: 1590, y: -1310, w: 420, h: 520 };
  const chipPt = (c, r) => [RACK.x + 75 + c * 90, RACK.y + 70 + r * 76];
  const FLY = { c: 3, r: 3 }, WORLD = [2880, -1060];
  const WDOTS = (() => {   // a loose dot field of the world (no outline): blobs where the land roughly is
    const blobs = [[-380, -60, 150, 110], [-300, 110, 70, 120], [-20, -90, 110, 80], [20, 90, 90, 120], [220, -80, 240, 110], [340, 160, 80, 50], [130, 40, 60, 40]];
    const out = []; for (let y = -200; y <= 240; y += 16) for (let x = -560; x <= 560; x += 16) { if (blobs.some(([bx, by, rx, ry]) => ((x - bx) / rx) ** 2 + ((y - by) / ry) ** 2 < 1)) out.push([WORLD[0] - 40 + x, WORLD[1] + y]); }
    return out;
  })();
  const CHIP_DEST = [WORLD[0] + 230, WORLD[1] - 40];
  // ---------------------------------------------------------------- camera
  const VS = { x: 960, y: 540, s: 1 };
  const cam = [[R.a, VS], [A.camera + .4, { x: 1010, y: 540, s: 1.03 }], [A.no - .1, { x: 1080, y: 540, s: 1.04 }], [A.no + 1.4, { x: 1150, y: 500, s: .78 }],
    [A.people + 1.0, { x: 1300, y: 500, s: .8 }], [A.named + .8, { x: 1200, y: 480, s: .78 }], [A.nov + .1, { x: 1150, y: 500, s: .77 }],
    [A.nov + 2.1, { x: 1100, y: -1000, s: 1.0 }], [A.goal, { x: 1110, y: -1030, s: 1.0 }], [A.goal + 1.0, { x: 1150, y: -1050, s: .96 }], [A.with + 1.0, { x: 1200, y: -1050, s: .95 }],
    [A.but + 1.4, { x: 1780, y: -1050, s: 1.12 }], [A.wash + .1, { x: 1800, y: -1055, s: 1.1 }], [A.wash + 1.8, { x: 2750, y: -1080, s: 1.08 }], [A.aim + .2, { x: 2800, y: -1080, s: 1.1 }],
    [A.tool + .4, { x: 2820, y: -1070, s: 1.1 }], [A.some + 1.9, { x: 3560, y: -660, s: 1.25 }], [A.why, { x: 3500, y: -650, s: 1.45 }]]; const CAM = B.holdKeys(cam);
  const PUSH0 = A.why + .3;
  function view(t) {
    if (t < PUSH0) return F.viewPath(t, CAM);
    const v0 = F.viewPath(PUSH0, CAM), u = sineIO(span(t, PUSH0, R.b));
    return { x: lerp(v0.x, V_END.x, u), y: lerp(v0.y, V_END.y, u), s: Math.exp(lerp(Math.log(v0.s), Math.log(V_END.s), u)) };
  }
  // ---------------------------------------------------------------- you on the street
  const W0 = R.a + .22, W1 = A.no + .6;
  const youX = (t) => 330 + 760 * span(t, W0, W1);
  const youWalk = (t) => (t > W0 && t < W1 ? (t - W0) * 6.6 : undefined);
  const head = (t) => { const x = youX(t); return [x + 4, 900 - 230 * .89]; };
  const warm = (t) => span(t, A.people - .05, A.people + .5);

  function streetFx(ctx, t, v) {
    if (v.y < -700) return;
    const cornerAng = Math.PI - .35 + .25 * sineIO(span(t, A.camera - .3, A.camera + .4)) - .1 * span(t, R.a, A.camera);
    const fly = (k) => sineIO(span(t, A.nov + .1 + k * .1, A.nov + 1.7 + k * .1));
    B.street9(ctx, t, v, { tape: span(t, A.stop - .1, A.stop + .9), cams: span(t, A.surv - .2, A.surv + 2.2), monitors: lerp(.3, 1, span(t, A.people - .1, A.people + .6)),
      cornerCol: mixHex(COOL.body, LAMP.body, warm(t)), cornerAng, cornerA: 1 - span(fly(5), 0, .25), camA: (k) => 1 - span(fly(k), 0, .25) });
    F.inView(ctx, v, () => {
      // you
      const x = youX(t);
      F.du(ctx, x, 900, 230, { hood: false, dir: 1, walk: youWalk(t), view: youWalk(t) != null ? 'side' : 'back', light: 1, look: .2 + .05 * Math.sin(t * .5) + .15 * span(t, A.people, A.people + .6), back: youWalk(t) != null ? 0 : .5 });
      // the frame snaps around your head (a hard accent on "knows your face"), its line to the camera; cool → lamp warm ("people do")
      const fu = span(t, A.camera + .3, A.camera + .4), fo = span(t, A.nov - .4, A.nov + .2);
      if (fu > 0 && fo < 1) {
        const [hx, hy] = head(t), col = mixHex(COOL.core, LAMP.core, warm(t)), s = lerp(90, 46, expoOut(fu)), a = clamp(fu * 3) * (1 - fo);
        ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.lineCap = 'round';
        for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { ctx.beginPath(); ctx.moveTo(hx + sx * s, hy + sy * s - sy * 18); ctx.lineTo(hx + sx * s, hy + sy * s); ctx.lineTo(hx + sx * s - sx * 18, hy + sy * s); ctx.stroke(); }
        ctx.setLineDash([8, 10]); ctx.lineDashOffset = -t * 30; ctx.lineWidth = 2; ctx.globalAlpha *= .6;
        const lu = span(t, A.camera + .35, A.camera + .9); ctx.beginPath(); ctx.moveTo(STREETCAM[0], STREETCAM[1]); ctx.lineTo(lerp(STREETCAM[0], hx + s, lu), lerp(STREETCAM[1], hy, lu)); ctx.stroke();
        const wu = span(t, A.people, A.people + .8); if (wu > 0) { const [wx, wy] = [B.STREET.win[0] + 20, B.STREET.win[1] + 90]; ctx.beginPath(); ctx.moveTo(STREETCAM[0] + 30, STREETCAM[1]); ctx.lineTo(lerp(STREETCAM[0] + 30, wx, wu), lerp(STREETCAM[1], wy, wu)); ctx.stroke(); }
        ctx.restore();
      }
    });
  }
  const STREETCAM = [B.STREET.corner - 50, B.STREET.poleTop + 10];
  // the cameras fly up as dots to the plan
  const camStart = (k) => (k < 5 ? [B.CAMS[k][0], B.STREET.poleTop + 30] : [B.STREET.corner, B.STREET.poleTop]);
  function plan(ctx, t, v) {
    const pu = span(t, A.nov + .6, A.nov + 1.9), fieldU = sineIO(span(t, A.goal - .1, A.goal + 1.0)), gone = span(t, A.goal, A.goal + .8);
    if (pu > 0 && gone < 1) {   // the blocks of the city plan (cream hairlines)
      ctx.save(); ctx.globalAlpha *= (1 - gone); ctx.strokeStyle = rgba(CREAM, .28); ctx.lineWidth = 1.6;
      for (let r = 0; r < PLAN.rows; r++) for (let c = 0; c < PLAN.cols; c++) { const k = r * PLAN.cols + c, u = expoOut(span(pu, k / 40, k / 40 + .5)); if (u <= 0) continue; const x = PLAN.x0 + c * PLAN.cw + 22, y = PLAN.y0 + r * PLAN.ch + 22, w = PLAN.cw - 44, h = PLAN.ch - 44; ctx.strokeRect(x + w / 2 * (1 - u), y + h / 2 * (1 - u), w * u, h * u); }
      ctx.restore();
    }
    // plan dots: the camera dots fly in, the rest light one after another (face recognition switched on)
    const lightU = span(t, A.face - .2, A.network + .9);
    planOrder.forEach((i, rank) => {
      const pc = camToPlan.indexOf(i); let [x, y] = planPts[i], a;
      if (pc >= 0) { const f = sineIO(span(t, A.nov + .1 + pc * .1, A.nov + 1.7 + pc * .1)); if (f <= 0) return; const [sx, sy] = camStart(pc); x = lerp(sx, x, f); y = lerp(sy, y, f) - 160 * Math.sin(Math.PI * f); a = 1; }
      else a = span(lightU, rank / planPts.length * .8, rank / planPts.length * .8 + .15);
      if (a <= 0) return;
      if (fieldU > 0) { const [fx, fy] = fieldPt(rank); x = lerp(x, fx, fieldU); y = lerp(y, fy, fieldU); }
      dotAt(ctx, t, x, y, a, rank);
    });
    // the field of 600: GOAL 60,000 (1 dot = 100 cameras)
    const fill = span(t, A.sixty - .1, A.sixty + 2.2);
    for (let k = planPts.length; k < 600; k++) {
      const a = span(fill, (k % FIELD.cols) / FIELD.cols * .7 + Math.floor(k / FIELD.cols) * .006, (k % FIELD.cols) / FIELD.cols * .7 + .2); if (a <= 0) continue;
      const [x, y] = fieldPt(k); dotAt(ctx, t, x, y, a, k);
    }
  }
  // a camera dot; after "with AI" each dot gets a hairline to the core and then streams into it
  function dotAt(ctx, t, x, y, a, k) {
    const st = sineIO(span(t, A.but - .3 + (k % 40) * .012 + Math.floor(k / 40) * .01, A.but + .7 + (k % 40) * .012 + Math.floor(k / 40) * .01));
    if (st >= 1) return;
    const lk = span(t, A.with - .1 + (k % 40) * .01, A.with + .6 + (k % 40) * .01) * (1 - st);
    if (lk > 0) { ctx.strokeStyle = rgba(COOL.line, .09 * lk); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(lerp(x, CORE[0], expoOut(lk)), lerp(y, CORE[1], expoOut(lk))); ctx.stroke(); }
    const px = lerp(x, CORE[0], st), py = lerp(y, CORE[1], st);
    ctx.fillStyle = rgba(DATA.machine, a); ctx.beginPath(); ctx.arc(px, py, 5.5 * (1 - st * .6), 0, TAU); ctx.fill();
  }
  // the core → the rack with chips and locator points
  function core(ctx, t) {
    const cu = span(t, A.with - .3, A.with + .5), op = sineIO(span(t, A.but + .5, A.but + 1.5)), out = sineIO(span(t, A.some, A.some + .9));
    if (cu <= 0 || out >= 1) return;
    ctx.save(); if (out > 0) { ctx.translate(CORE[0], CORE[1]); ctx.scale(1 - out, 1 - out); ctx.translate(-CORE[0], -CORE[1]); ctx.globalAlpha *= 1 - out; }
    if (op < 1) B.machineDisc(ctx, t, CORE[0], CORE[1], 54 * expoOut(cu) * (1 + .6 * op), { a: 1 - op });
    if (op > 0) {
      const w = lerp(108, RACK.w, op), h = lerp(108, RACK.h, op), x = CORE[0] - w / 2, y = CORE[1] - h / 2;
      ctx.fillStyle = mixHex(P.night1, P.ind2, .6); ctx.beginPath(); ctx.roundRect(x, y, w, h, 14); ctx.fill(); ctx.strokeStyle = rgba(COOL.line, .6); ctx.lineWidth = 2.5; ctx.stroke();
      for (let r = 0; r < 6; r++) { ctx.fillStyle = rgba(COOL.line, .12 * op); ctx.fillRect(x + 20, y + 32 + r * (h - 40) / 6 + (h - 40) / 6 - 8, w - 40, 2); }
      for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) {
        if (c === FLY.c && r === FLY.r && t > A.wash) continue;
        const [cx, cy] = chipPt(c, r), u = span(op, .3 + (r * 4 + c) * .02, .6 + (r * 4 + c) * .02); if (u <= 0) continue;
        const px = lerp(CORE[0], cx, op), py = lerp(CORE[1], cy, op), ping = span(t, A.chips + (r * 4 + c) * .03, A.chips + .3 + (r * 4 + c) * .03);
        F.chip(ctx, t + c * .17 + r * .29, px, py, 46, { a: u, ping: ping * .45 });
        if (ping > 0) { ctx.fillStyle = rgba(CREAM, ping); ctx.beginPath(); ctx.arc(px + 22, py - 22, 4.5, 0, TAU); ctx.fill(); }
      }
    }
    ctx.restore();
  }
  // the one chip: out over the world, the ping, the shield, the turn (an eye), into the HUD pocket
  function oneChip(ctx, t, v) {
    if (t < A.wash) return;
    const f = sineIO(span(t, A.wash + .1, A.wash + 1.6)), [sx, sy] = chipPt(FLY.c, FLY.r);
    let x = lerp(sx, CHIP_DEST[0], f), y = lerp(sy, CHIP_DEST[1], f) - 220 * Math.sin(Math.PI * f);
    const flip = span(t, A.tool, A.tool + .5), back = span(t, A.tool + .9, A.tool + 1.3), fly = sineIO(span(t, A.tool + .75, A.tool + 1.65));
    const [hx, hy] = F.hudPocket('chip'), [X, Y] = F.toScreen(v, x, y);
    const SX = lerp(X, hx, fly), SY = lerp(Y, hy, fly) - 90 * Math.sin(Math.PI * fly), size = lerp(64 * v.s, 26, fly);
    const turn = Math.cos(Math.PI * (flip - back));   // 1 chip side, -1 eye side
    if (t > A.tool + 1.65 + .45) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    // ping rings to the world (the chip proves where it is)
    const pg = span(t, A.prove - .2, A.prove + 2.4) * (1 - fly);
    if (pg > 0) for (let k = 0; k < 3; k++) { const q = ((t - A.prove) * .7 + k / 3) % 1; if (q < 0) continue; ctx.strokeStyle = rgba(CREAM, .5 * pg * (1 - q)); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(SX, SY, size * (.7 + q * 4), 0, TAU); ctx.stroke(); }
    ctx.translate(SX, SY); ctx.scale(Math.max(.04, Math.abs(turn)), 1);
    if (turn >= 0) F.chip(ctx, t, 0, 0, size, { ping: fly > .9 ? 1 : 0 });
    else F.guardEye(ctx, t, 0, 0, size * .42, { look: [0, 0] });
    ctx.restore();
  }

  function draw(ctx, t) {
    const v = view(t); v.s *= B.seamCreep(t, R.a); const rowNear = v.x > 2400 && v.y > -1000 || t > A.some;
    F.yard(ctx, t, v, { lx: lerp(1100, D8.x, span(t, A.some, A.some + 1.5)), ly: lerp(-1000, D8.y - 100, span(t, A.some, A.some + 1.5)), pool: .8 * span(v.y, 300, -600), rails: span(v.y, 200, -500) });
    streetFx(ctx, t, v);
    if (rowNear || v.x > 2200) rowWorld(ctx, t, T, v, A);
    // above the street: the plan, the field, the core, the rack, the world, the chip
    if (v.y < 200) {
      F.inView(ctx, v, () => {
        plan(ctx, t, v); core(ctx, t);
        const wu = span(t, A.wash + .2, A.wash + 1.6) * (1 - span(t, A.some, A.some + .8));
        if (wu > 0) for (let k = 0; k < WDOTS.length; k++) { const [x, y] = WDOTS[k], a = span(wu, (x - WORLD[0] + 600) / 1400 * .6, (x - WORLD[0] + 600) / 1400 * .6 + .3); if (a > 0) { ctx.fillStyle = rgba(CREAM, .22 * a); ctx.beginPath(); ctx.arc(x, y, 2.6, 0, TAU); ctx.fill(); } }
        const sh = span(t, A.sec - .25, A.sec + .35) * (1 - span(t, A.tool + .4, A.tool + .9));
        B.shield(ctx, CHIP_DEST[0] + 120, CHIP_DEST[1], 86, sh);
      });
      oneChip(ctx, t, v);
    }
    // labels (screen px at reference views, they ride the camera)
    B.inRef(ctx, v, { x: 1200, y: 480, s: .78 }, () => {
      F.big(ctx, '1984', W / 2, 230, 150, span(t, A.nine - .1, A.nine + .6) * (1 - span(t, A.nov - .3, A.nov + .3)), { gold: 0 });
      F.label(ctx, 'NINETEEN EIGHTY-FOUR · AFTER ORWELL', W / 2, 292, span(t, A.nine + .3, A.nine + .9) * (1 - span(t, A.nov - .3, A.nov + .3)), { size: 24, col: CREAM2 });
    });
    B.inRef(ctx, v, { x: 1100, y: -1000, s: 1 }, () => {
      F.label(ctx, 'HONG KONG · FACE RECOGNITION ON', W / 2, 150, span(t, A.face, A.face + .6) * (1 - span(t, A.goal - .3, A.goal + .2)), { size: 26 });
    });
    B.inRef(ctx, v, { x: 1150, y: -1050, s: .96 }, () => {
      const out = span(t, A.with - .3, A.with + .2);
      F.big(ctx, TXT.e9.goal, W / 2, 200, 60, span(t, A.sixty, A.sixty + .7) * (1 - out), { gold: 0 });
      F.label(ctx, '1 DOT = 100 CAMERAS', W / 2, 860, span(t, A.sixty + .4, A.sixty + 1.0) * (1 - span(t, A.but - .3, A.but + .2)), { size: 24, col: CREAM2 });
      F.big(ctx, 'WITH AI, NOT AGAINST IT', W / 2, 200, 60, span(t, A.with + .3, A.with + 1.0) * (1 - span(t, A.but - .1, A.but + .4)), { gold: 0 });
    });
    B.inRef(ctx, v, { x: 1780, y: -1050, s: 1.12 }, () => F.big(ctx, TXT.e9.chips, W / 2, 140, 58, span(t, A.chips - .2, A.chips + .5) * (1 - span(t, A.wash, A.wash + .5)), { gold: 0 }));
    B.inRef(ctx, v, { x: 2800, y: -1080, s: 1.1 }, () => {
      const [cx, cy] = B.refPt({ x: 2800, y: -1080, s: 1.1 }, CHIP_DEST[0] + 120, CHIP_DEST[1]);
      F.label(ctx, 'SECURITY', cx, cy + 92, span(t, A.sec, A.sec + .5) * (1 - span(t, A.tool + .3, A.tool + .8)), { size: 26 });
    });
    // switch tags: NOV 16, 2026 (Hong Kong) → its mini tag to the counter; MAR 2026 (the chip bill)
    const t1 = span(t, A.nov + .9, A.nov + 1.5), o1 = span(t, A.goal - .4, A.goal + .2);
    if (t1 > 0 && o1 < 1) { F.switchTag(ctx, t, 1560, 300, F.END[9].tag, t1, { out: o1 }); B.tagToHud(ctx, t, T, 9, [1560, 300]); }
    const t2 = span(t, A.wash + .5, A.wash + 1.1), o2 = span(t, A.tool - .3, A.tool + .3);
    if (t2 > 0 && o2 < 1) { F.switchTag(ctx, t, 760, 200, F.END[9].tag2, t2, { out: o2 }); F.label(ctx, TXT.e9.act, 760, 262, span(t2, .4, 1) * (1 - o2), { size: 22, weight: 600, col: CREAM2 }); }
    F.source(ctx, t, A.nov + 1.0, A.with, TXT.e9.src);
    F.scenarioTag(ctx, span(t, R.a, R.a + .5) * (1 - span(t, A.named, A.named + .5)));
    const fl = span(t, A.tool + .7, A.tool + 2.2);
    F.counterHud(ctx, t, T, { parked: fl > 0 && fl < 1 ? 'chip' : undefined });
  }
  return [{ t: R.a, draw, print: F.PRINT71 }];
}
