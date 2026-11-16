// c03 · No. 11 Apate: the A.I. that wastes a scammer's time · the call line · it wins by being slow → Over Wyoming (the prairie).
// T.G('That machine was built to listen') → T.G('Wind turbines make') · builder B1 · plan: docs/shots.md 11.01–11.09
// ONE continuous take: the station world (the bead's listening ring stretches into a line west across the sea) → a window fly-in on
// the far coast (a portal: the window becomes the screen) → the call stage → the slow wave flattens into a horizon that opens
// (a mask, not a door) onto the prairie of No. 10 (lib/f28_b1_prairie.mjs, continued by c04).
//
// | ID    | anchor (phrase)                    | picture (one idea)                                                          | camera                    |
// |-------|------------------------------------|-----------------------------------------------------------------------------|---------------------------|
// | 11.01 | That machine was built to listen   | the bead in the ring listens (cool rings); its ring stretches into a line west across the sea | ride → follow the head |
// | 11.02 | In Australia, another A.I.         | the line ends at a warm window on the far coast; into it: an empty armchair, a cool bead in it chattering | window fly-in (portal) |
// | 11.03 | Not yours                          | the line runs back to a dark call room: headsets, cool screens; lamp 11 lights | pull back left          |
// | 11.04 | A researcher there once kept       | the line swings down to a family picnic; under it a ruler fills: ≈ 40 MIN · REAL | follow the line         |
// | 11.05 | All that time, the scammer         | his other lines to the houses stay dark; their windows stay warm           | settle                    |
// | 11.06★| Now his company does it all day    | the line swings back to the bead; it clones into four armchairs: every scammer talks to a bot | pull back       |
// | 11.07 | One of Australia's big phone networks | calls as dots switched at a junction straight into the bots: ≈ 590,000 CALLS | hold                   |
// | 11.08 | Here, the A.I. wins by being slow  | one voice slows and stretches into a long flat line                        | push to the voice         |
// | 11.09 | Over Wyoming, it has to be fast    | the line opens as a horizon: the prairie at the end of the night, turbines; an eagle crosses fast | ride             |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f28_kit.mjs';
import * as S from '../lib/f28_seams.mjs';
import * as B from '../lib/f28_b1_kit.mjs';
import * as PR from '../lib/f28_b1_prairie.mjs';
import { anchors02, ride23, ringAt, RING_C } from './sc02.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, halo, mixHex, lin } = E;

export const ride34 = (T) => { const t0 = T.G('Wind turbines make') - .6; return { t0, cam: B.ride(PR.Z_TURB, 820, 470, 1.0, t0) }; };

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = { ...anchors02(T) };
  a.listen = G('That machine was built to listen'); a.listenE = GE('built to listen');
  a.aus = G('In Australia'); a.waste = G('waste time'); a.purpose = G('On purpose');
  a.notyours = G('Not yours'); a.scammer = G("A phone scammer's"); a.research = G('A researcher there');
  a.forty = G('about forty minutes'); a.picnic = G('family picnic'); a.alltime = G('All that time');
  a.robbing = G("wasn't robbing"); a.now = G('Now his company'); a.victims = G('victims'); a.chatty = G('chatty strangers');
  a.tpg = G("One of Australia's big phone"); a.straight = G('straight to these bots'); a.here = G('Here, the A.I.');
  a.slow = G('wins by being slow'); a.wyo = G('Over Wyoming'); a.fast = G('has to be fast'); a.end = R.b;
  return [{ t: R.a, draw: scene(a, T), print: F.PRINT28 }];
};

// ---------------------------------------------------------------- geometry
const CS = (u, v, s, sx, sy) => E.aim(S.Z_ST, u, v, s, sx, sy);
const CI = (u, v, s, sx, sy) => E.aim(E.F0, u, v, s, sx, sy);
const WIN = { x: -2150, y: 668, w: 32, h: 18 };                 // the warm window on the far coast (Z_ST card), 16:9
const LINE_ST = [[RING_C[0], RING_C[1]], [930, 520], [700, 612], [200, 626], [-600, 630], [-1300, 640], [-1800, 664], [WIN.x - WIN.w / 2 - 1, WIN.y + 2]];
// inner (call stage) design px, main card F0
const PHONE = [900, 676], BEAD = [1120, 724], VOICE = [1120, 650];
const DESKS = [-640, -470, -300, -130].map((x, k) => ({ x, y: 790, head: [x + 4, 640], k }));
const TARGET = 2;
const Z_FAR = 3200, HOUSES = [80, 420, 760, 1100].map((x, k) => ({ x, y: 690 + (k % 2) * 14, k }));
const Z_NEAR = 1250, PICNIC = { x: 360, y: 950 };
const JUNC = [280, 560];

function scene(a, T) {
  const R23 = ride23(T), R34 = ride34(T);
  const tSw = a.purpose + .2;                       // the window has become the screen
  const tDive0 = a.aus + 1.0;
  const tOpen0 = a.wyo - .25, tOpen1 = a.wyo + 1.25; // the horizon opens onto the prairie
  // ---------------------------------------------------------------- station part: follow the line's head west, then into the window
  const headU = (t) => sineIO(span(t, a.listen + 1.1, tDive0 + .4));
  const KS = [[R23.t0 + 1.2, R23.cam(R23.t0 + 1.2)], [a.listen + 2.2, CS(860, 560, .95)], [a.aus + .2, CS(-500, 610, .62)], [tDive0, CS(WIN.x, WIN.y, 1.1)]];
  const camSt = (t) => (t < R23.t0 + 1.2 ? R23.cam(t) : t < tDive0 ? F.camPath(t, KS) : E.camAt(t, [[tDive0, KS[KS.length - 1][1]], [tSw, CS(WIN.x, WIN.y, W / WIN.w)]], S.Z_ST));
  const driftSt = (t) => 1 - sineIO(span(t, tDive0, tSw - .4));
  // ---------------------------------------------------------------- inner part (the call stage), then the prairie
  const KI = [[tSw, CI(960, 540, 1)], [a.notyours - .1, CI(1080, 560, 1.12)], [a.scammer + .9, CI(340, 650, .84)], [a.research + 1.2, CI(380, 700, .86)], [a.picnic + .8, CI(400, 720, .9)],
    [a.alltime + 1.6, CI(420, 640, .84)], [a.victims + .6, CI(400, 640, .8)], [a.tpg + 1.4, CI(410, 620, .8)], [a.straight + .8, CI(440, 630, .83)],
    [a.here + .2, CI(700, 640, .9)], [a.slow + .7, CI(VOICE[0], VOICE[1], 2.2, W / 2, 600)], [tOpen0, CI(VOICE[0] + 30, VOICE[1], 2.5, W / 2, 600)]];
  const camIn = (t) => (t < tOpen0 ? F.camPath(t, KI) : CI(VOICE[0] + 30 + 40 * (t - tOpen0), VOICE[1], 2.5 * (1 + .03 * (t - tOpen0)), W / 2, 600));
  const driftIn = (t) => sineIO(span(t, tSw, tSw + 1.4));
  const KP = [[tOpen0, PR_CAM0(0)], [tOpen1 + .6, PR_CAM0(.6)], [a.fast + .6, E.aim(PR.Z_TURB, 900, 500, 1.04)], [R34.t0, R34.cam(R34.t0)]];
  function PR_CAM0(dt) { return E.aim(PR.Z_FAR, 960 + 6 * dt, 600, 1 + .02 * dt, W / 2, 600); }
  const camPr = (t) => (t >= R34.t0 ? R34.cam(t) : F.camPath(t, KP));

  // ---------------------------------------------------------------- the station world with the line and the far coast
  function stationPart(ctx, t) {
    const c = B.drifted(camSt(t), S.Z_ST, t, driftSt(t)), rg = ringAt(a, t), hu = headU(t);
    S.stationWorld(ctx, c, t, {
      window: 1, ring: 0, towers: .5,
      voices: (cx) => {
        // the far coast: low land, one small house with a warm 16:9 window (a portal into the call stage)
        F.hills(cx, [[-3900, 708], [-3000, 690], [-2500, 682], [-2150, 684], [-1950, 698], [-1820, 760], [-1760, 900]], { top: mixHex(P.night1, P.ind1, .55), bottom: P.night0, rimA: .3, depth: 120 });
        cx.fillStyle = mixHex(P.night0, P.ind1, .45); cx.fillRect(WIN.x - 52, WIN.y - 22, 104, 40);
        cx.fillStyle = mixHex(P.night0, P.ind0, .3); cx.beginPath(); cx.moveTo(WIN.x - 62, WIN.y - 20); cx.lineTo(WIN.x - 10, WIN.y - 54); cx.lineTo(WIN.x + 62, WIN.y - 20); cx.fill();
        halo(cx, WIN.x, WIN.y, 80, .6, P.halo0, P.core0);
        cx.fillStyle = P.core1; cx.fillRect(WIN.x - WIN.w / 2, WIN.y - WIN.h / 2, WIN.w, WIN.h);
        B.voiceRing(cx, t, rg.cx, rg.cy, rg.rx, rg.ry, 1, { s: rg.s, spin: rg.spin, n: 16 });
        F.agent(cx, t, RING_C[0] + 3 * Math.sin(t * 1.2), RING_C[1] + 2.5 * Math.sin(t * 1.6), 7.5, { think: .6 });
        const lr = span(t, a.listen + .1, a.listen + .7) * (1 - span(t, a.listenE + .4, a.listenE + 1.2));
        if (lr > 0) F.radioRings(cx, t, RING_C[0], RING_C[1], 130, { a: lr, col: F.COOL.line, arc: [0, Math.PI * 2] });
        // the line: the bead's ring unrolls into it; it runs west across the sea to the window
        if (hu > 0) { const pts = E.catmull(LINE_ST, 12); F.coolPath(cx, pts, 0, hu, 2.4 / Math.max(1, cx.getTransform().a * .8), 1); const i = Math.max(0, Math.floor(hu * (pts.length - 1))); if (hu < 1) F.agent(cx, t, pts[i][0], pts[i][1], 4.5, { ring: 0 }); }
      },
    });
    const g = E.project(c, S.Z_ST, WIN.x - WIN.w / 2, WIN.y - WIN.h / 2), g1 = E.project(c, S.Z_ST, WIN.x + WIN.w / 2, WIN.y + WIN.h / 2);
    if (g && g1) {
      const r = { x: g[0], y: g[1], w: g1[0] - g[0], h: g1[1] - g[1] };
      if (r.w > 6) B.portal(ctx, r, (cx) => { const ci = CI(960, 540, 1); innerWorld(cx, ci, t); cx.save(); cx.translate(r.x, r.y); cx.scale(r.w / W, r.w / W); innerTop(cx, ci, t); cx.restore(); });
      const glass = 1 - span(r.w, 120, 900); if (glass > 0) { ctx.save(); ctx.fillStyle = rgba(P.core1, .85 * glass); ctx.fillRect(r.x, r.y, r.w, r.h); ctx.restore(); }
    }
    return c;
  }

  // ---------------------------------------------------------------- the call stage (inner world): cards on its own camera
  const swingDown = (t) => sineIO(span(t, a.research + .2, a.research + 1.4)) * (1 - sineIO(span(t, a.now + .1, a.now + 1.3)));
  const cloneU = (k, t) => sineIO(span(t, a.victims - .3 + k * .22, a.victims + 1.1 + k * .22));
  function innerWorld(ctx, c, t) {
    E.card(ctx, c, 12000, () => B.fillView(ctx, lin(ctx, 0, -600, 0, 900, [[0, P.night0], [.7, P.night1], [1, mixHex(P.night1, P.ind0, .6)]])));
    // far: the houses of the people the scammer would call, then the armchairs the bots sit in
    E.card(ctx, c, Z_FAR, () => {
      ctx.fillStyle = lin(ctx, 0, 690, 0, 1400, [[0, mixHex(P.night1, P.ind0, .4)], [1, P.night0]]); ctx.fillRect(-3000, 700, 8000, 2000);
      ctx.strokeStyle = rgba(P.blue0, .4); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-3000, 700); ctx.lineTo(5000, 700); ctx.stroke();
      for (const h of HOUSES) {
        const x = h.x, y = h.y;
        ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.fillRect(x - 34, y - 40, 68, 42); ctx.beginPath(); ctx.moveTo(x - 42, y - 38); ctx.lineTo(x, y - 70); ctx.lineTo(x + 42, y - 38); ctx.fill();
        const safe = .8 + .2 * F.bump(t, a.robbing + h.k * .15, 1.2); halo(ctx, x + 12, y - 20, 50, .45 * safe, P.halo0, P.core1); ctx.fillStyle = P.core1; ctx.fillRect(x + 4, y - 30, 16, 16);
        const cu = cloneU(h.k, t);
        if (cu > 0) { const ly = sineIO(span(cu, .6, 1)); B.floorLamp(ctx, t, x - 70, y + 70, 150, ly, { a: ly }); B.armchair(ctx, x - 10, y + 70, 100, { a: ly, rim: P.halo1 }); }
      }
    });
    // main card: the call room (left), the side table with the old telephone, the armchair, the lamp
    E.card(ctx, c, E.F0, () => {
      ctx.fillStyle = lin(ctx, 0, 790, 0, 1300, [[0, mixHex(P.night1, P.ind0, .5)], [1, P.night0]]); ctx.fillRect(-4000, 790, 9000, 2000);
      // call room: a dark low room with cool screens and headset figures
      const room = span(t, a.notyours - .3, a.notyours + .9);
      ctx.fillStyle = mixHex(P.night0, P.ind0, .25); ctx.fillRect(-780, 470, 780, 322);
      ctx.strokeStyle = rgba(P.blue1, .35); ctx.lineWidth = 2; ctx.strokeRect(-780, 470, 780, 322);
      for (const d of DESKS) {
        const on = room * (d.k === TARGET ? 1 : .55) * (1 - .4 * span(t, a.alltime, a.alltime + .8) * (d.k !== TARGET ? 1 - span(t, a.victims, a.victims + 1.5) : 0));
        halo(ctx, d.x + 54, d.y - 120, 150, .35 * on, F.COOL.halo, F.COOL.body);
        E.person(ctx, d.x, d.y + 30, 210, { headset: true, look: .05, light: 1, rim: mixHex(P.blue0, F.COOL.body, on), dir: 1 });
        ctx.fillStyle = mixHex(P.night0, P.ind1, .35); ctx.fillRect(d.x - 20, d.y - 52, 130, 14); ctx.fillRect(d.x + 90, d.y - 40, 10, 40);   // desk
        ctx.fillStyle = lin(ctx, 0, d.y - 150, 0, d.y - 70, [[0, mixHex(F.COOL.body, P.cream, .3 * on)], [1, mixHex(F.COOL.deep, P.night1, 1 - on)]]); ctx.fillRect(d.x + 30, d.y - 150, 64, 46);
        ctx.fillStyle = P.night0; ctx.fillRect(d.x + 58, d.y - 104, 8, 52);
      }
      // side table + the old telephone (the rail's handset comes from here)
      ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.fillRect(PHONE[0] - 50, 704, 100, 12); ctx.fillRect(PHONE[0] - 6, 716, 12, 76); ctx.fillRect(PHONE[0] - 34, 786, 68, 6);
      ctx.fillStyle = mixHex(P.night1, P.shade0, .35); ctx.beginPath(); ctx.moveTo(PHONE[0] - 30, 704); ctx.lineTo(PHONE[0] + 30, 704); ctx.lineTo(PHONE[0] + 20, 684); ctx.lineTo(PHONE[0] - 20, 684); ctx.closePath(); ctx.fill();
      F.tool(ctx, 'handset', PHONE[0], PHONE[1] + 2, 54, { lit: .3, glow: .4 });
      B.floorLamp(ctx, t, 1330, 800, 340, 1);
      B.armchair(ctx, BEAD[0], 800, 240, { rim: P.halo1 });
      // the junction of the phone network (11.07)
      const ju = span(t, a.tpg + .2, a.tpg + 1.2);
      if (ju > 0) { ctx.save(); ctx.globalAlpha = ju; ctx.fillStyle = mixHex(P.night1, F.COOL.deep, .6); ctx.beginPath(); ctx.roundRect(JUNC[0] - 26, JUNC[1] - 26, 52, 52, 8); ctx.fill(); ctx.strokeStyle = F.COOL.line; ctx.lineWidth = 2; ctx.stroke(); halo(ctx, JUNC[0], JUNC[1], 90, .3, F.COOL.halo, F.COOL.body); ctx.restore(); }
    });
    // near: the family picnic in the dark (a small warm lantern on the blanket)
    E.card(ctx, c, Z_NEAR, () => {
      const pk = span(t, a.research - .1, a.research + 1.0) * (1 - .6 * span(t, a.now, a.now + 1.5));
      if (pk <= 0) return;
      const { x, y } = PICNIC;
      halo(ctx, x + 40, y - 30, 260 * (.6 + .4 * pk), .55 * pk, P.halo0, P.core1);
      ctx.fillStyle = mixHex(P.night1, P.shade0, .45 * pk); ctx.beginPath(); ctx.moveTo(x - 190, y + 10); ctx.lineTo(x + 170, y + 4); ctx.lineTo(x + 230, y + 60); ctx.lineTo(x - 170, y + 70); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = rgba(P.halo1, .4 * pk); ctx.lineWidth = 2; for (let k = 1; k < 5; k++) { ctx.beginPath(); ctx.moveTo(x - 190 + k * 72, y + 10 - k); ctx.lineTo(x - 170 + k * 80, y + 70 - k * 2); ctx.stroke(); }
      ctx.save(); ctx.globalAlpha = pk;
      E.person(ctx, x - 90, y + 36, 150, { pose: 'sit', light: 1, rim: P.halo1 });
      E.person(ctx, x + 10, y + 40, 110, { pose: 'sit', light: 1, rim: P.halo1, dir: -1 });
      E.person(ctx, x + 120, y + 44, 130, { pose: 'sit', light: -1, rim: P.halo1, dir: -1 });
      ctx.fillStyle = P.shade0; ctx.fillRect(x + 32, y - 6, 26, 26); ctx.fillStyle = P.core1; ctx.fillRect(x + 38, y - 2, 14, 12);
      ctx.restore();
    });
  }
  // screen-space parts of the call stage: the lines (they join cards), the bead and its voices, the ruler, the calls, the counter
  function innerTop(ctx, c, t) {
    const pr = (Z, u, v) => E.project(c, Z, u, v);
    const room = span(t, a.notyours - .3, a.notyours + .9), sw = swingDown(t);
    const head = DESKS[TARGET].head, h0 = pr(E.F0, head[0] + 10, head[1] + 6), ph = pr(E.F0, PHONE[0] - 18, PHONE[1] - 6), pk = pr(Z_NEAR, PICNIC.x - 90, PICNIC.y - 70);
    const curve = (p0, p1, sag) => { const m = [(p0[0] + p1[0]) / 2, Math.max(p0[1], p1[1]) + sag]; return E.catmull([p0, [lerp(p0[0], m[0], .5), lerp(p0[1], m[1], .8)], m, [lerp(m[0], p1[0], .5), lerp(m[1], p1[1], .2)], p1], 8); };
    // the other lines of the call room to the houses: dashed, dark (11.05) → the bots' armchairs, solid (11.06)
    for (const d of DESKS) for (const hs of HOUSES) {
      if (hs.k !== d.k && !(d.k === TARGET)) continue;
      const cu = cloneU(hs.k, t), dark = span(t, a.alltime - .2, a.alltime + .9) * (1 - span(t, a.victims + .4, a.victims + 1.2));
      const isBot = d.k === hs.k && cu > .6, aD = d.k === TARGET ? dark : 0;
      const p0 = pr(E.F0, d.head[0] + 10, d.head[1] + 6), p1 = pr(Z_FAR, isBot ? hs.x - 10 : hs.x, isBot ? hs.y + 18 : hs.y - 20);
      if (!p0 || !p1) continue;
      if (aD > 0 && !isBot) { ctx.save(); ctx.setLineDash([6, 10]); ctx.strokeStyle = rgba(P.blue1, .7 * aD); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.quadraticCurveTo((p0[0] + p1[0]) / 2, Math.min(p0[1], p1[1]) - 30, p1[0], p1[1]); ctx.stroke(); ctx.restore(); }
      if (isBot) { const u = span(cu, .6, 1); const pts = curve(p0, p1, 40); F.coolPath(ctx, pts, 0, u, 1.8, .9); }
    }
    // the one busy line: scammer → the phone by the armchair; on 'A researcher' its end swings down to the picnic, then back
    if (h0 && ph && pk && room > 0) {
      const end = [lerp(ph[0], pk[0], sw), lerp(ph[1], pk[1], sw)], pts = curve(h0, end, 60 * c.z / 1000 + 50);
      F.coolPath(ctx, pts, 0, room, 2.6, 1);
      // ≈ 40 MIN: a ruler under the line fills warm while the researcher talks
      const ru = span(t, a.research + .9, a.research + 1.8) * (1 - span(t, a.alltime + 1.2, a.alltime + 2.0));
      if (ru > 0) { const y = Math.max(h0[1], end[1]) + 70, x0 = h0[0] + 40, w = end[0] - x0 - 40;
        F.ruler(ctx, t, { x: x0, y, w, u: ru, fill: E.smooth(span(t, a.research + 1.4, a.picnic + .6)), ticks: [[0, '0'], [1, '≈ 40 MIN']], minor: 8, col: 'warm', a: ru }); }
    }
    // the bead in the armchair: chatters (11.02); clones fly to the far armchairs (11.06); one voice slows to a line (11.08)
    const bp = pr(E.F0, BEAD[0], BEAD[1]), vp = pr(E.F0, VOICE[0], VOICE[1]), kk = c && bp ? E.project(c, E.F0, 0, 0)[2] : 1;
    if (bp) {
      F.agent(ctx, t, bp[0] + 2 * Math.sin(t * 1.4), bp[1] + 2 * Math.sin(t * 1.9), 11 * kk, { think: .4 });
      const stretch = sineIO(span(t, a.here + .4, a.slow + 1.6)), calm = span(t, a.here + .2, a.wyo - .4);
      const vlen = lerp(110, 2600, stretch) * kk, amp = lerp(.22, .0, calm), sp = lerp(9, .6, calm);
      B.coolVoice(ctx, t, vp[0], vp[1], 110 * kk, { len: vlen, amp, speed: sp, cyc: lerp(2.5, 9, stretch), n: 90, lw: .045 * Math.max(1, 1 / kk) });
    }
    for (const hs of HOUSES) {
      const cu = cloneU(hs.k, t); if (cu <= 0) continue;
      const tp = pr(Z_FAR, hs.x - 10, hs.y + 30); if (!tp || !bp) continue;
      const e = sineIO(cu), x = lerp(bp[0], tp[0], e), y = lerp(bp[1], tp[1], e) - 120 * Math.sin(Math.PI * e) * kk;
      F.agent(ctx, t, x, y, lerp(11 * kk, 6 * tp[2], e), { ring: .5 });
      if (cu > .8) B.coolVoice(ctx, t, x, y - 40 * tp[2], 70 * tp[2], { a: span(cu, .8, 1), ph: hs.k * 1.7, cyc: 1.5 + hs.k * .6, amp: .15 + .05 * hs.k, speed: 7 + 2 * hs.k });
    }
    // 11.07: calls as dots from the room into the junction, switched straight to the bots
    const flow = span(t, a.tpg + .6, a.tpg + 1.4) * (1 - span(t, a.here - .2, a.here + .6));
    if (flow > 0) {
      const src = pr(E.F0, -800, 600), j = pr(E.F0, JUNC[0], JUNC[1]);
      for (let k = 0; k < 26; k++) {
        const u = ((t * .42 + k / 26) % 1), hs = HOUSES[k % 4], dst = pr(Z_FAR, hs.x - 10, hs.y + 20);
        let x, y; if (u < .5) { const e = u / .5; x = lerp(src[0], j[0], e); y = lerp(src[1], j[1], e) + 12 * Math.sin(k * 2.3) * (1 - e); } else { const e = (u - .5) / .5; x = lerp(j[0], dst[0], e); y = lerp(j[1], dst[1], e) - 40 * Math.sin(Math.PI * e); }
        ctx.fillStyle = rgba(F.COOL.core, .85 * flow * Math.sin(Math.PI * u) ** .3); ctx.beginPath(); ctx.arc(x, y, 3.2, 0, Math.PI * 2); ctx.fill();
      }
      const lu = span(t, a.tpg + 1.0, a.tpg + 1.8) * (1 - span(t, a.here - .3, a.here + .3));
      if (lu > 0 && j) { F.maskLine(ctx, [['≈ 590,000', 0]], j[0], j[1] - 150, 56, F.rise(lu), { align: 'center', serif: false, weight: 600 }); F.maskLine(ctx, [['SCAM CALLS SENT TO THE BOTS', 0]], j[0], j[1] - 96, 22, F.rise(span(lu, .2, 1)), { serif: false, weight: 600, align: 'center', col: P.halo2, glow: false }); }
    }
  }

  // ---------------------------------------------------------------- the prairie (11.09): the eagle crosses fast
  function prairiePart(ctx, t) {
    const c = B.drifted(camPr(t), PR.Z_TURB, t, sineIO(span(t, tOpen0, tOpen1 + 1)));
    PR.prairie(ctx, c, t, { dawn: .5 });
    const u = span(t, a.wyo + .35, a.fast + .55);
    if (u > 0 && u < 1) { const e = u, x = lerp(W + 160, -200, e), y = 300 + 60 * Math.sin(Math.PI * e) - 40 * e; B.eagle(ctx, t, x, y, 150, { dir: -1, flap: .8, ph: t * 11, bank: -.05 }); }
    return c;
  }

  return (ctx, t) => {
    if (t < tSw) stationPart(ctx, t);
    else {
      const ci = B.drifted(camIn(t), E.F0, t, driftIn(t) * (1 - span(t, a.slow, tOpen0)));
      if (t < tOpen1) { innerWorld(ctx, ci, t); innerTop(ctx, ci, t); }
      if (t >= tOpen0) {
        // the flat line opens like an eye: the prairie lies between its two edges, its horizon exactly on the line (screen y 600)
        const o = sineIO(span(t, tOpen0, tOpen1)), y0 = 600 - 620 * o, y1 = 600 + 500 * o;
        ctx.save(); if (o < 1) { ctx.beginPath(); ctx.rect(0, y0, W, y1 - y0); ctx.clip(); }
        prairiePart(ctx, t); ctx.restore();
        if (o < 1) { ctx.save(); ctx.strokeStyle = rgba(F.COOL.line, .8 * (1 - o)); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(W, y0); ctx.moveTo(0, y1); ctx.lineTo(W, y1); ctx.stroke(); ctx.restore(); }
      }
    }
    F.realStamp(ctx, t, a.research + .4, a.alltime - .3, 'apate');
    F.source(ctx, t, a.tpg + 1.2, a.here, F.SOURCES.apate);
    F.lampRail(ctx, t, T);
  };
}
