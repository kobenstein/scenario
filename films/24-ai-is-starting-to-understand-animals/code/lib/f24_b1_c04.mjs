// Film 24 · c04 world (B1) · "The tour I · Kenya" · 4.01–4.10 of docs/shots.md. ONE plan sequence:
//   the c03 field (the crow, the docked strip) closes into the gold ESP pin while the map pulls back to the world → the pins of the other
//   teams grow (Alaska, Bahamas, Dominica, Tel Aviv, Kenya) → the stone tablet rises lower left ("each with a piece of the puzzle"); the
//   far pins sink again → flight to Kenya; the cream Kenya pin, OTHER TEAM · KENYA → its medallion opens: the savanna, an elephant cow, a
//   speaker on a jeep; the speaker calls, she answers and walks towards it → the medallion grows into the clip plate (C2) and back → NAMES
//   is engraved → the medallion closes into its pin → a short pan to the gold Amboseli pin → its medallion opens to the full frame: an
//   elephant family at dusk rumbles all at once → the gold listener rises at the edge and drinks the chorus; GREETING · CALF COMFORTED out of
//   its tip → the chorus closes into the Amboseli pin while the map pulls back onto NORTH_VIEW; WHAT'S GOING ON is engraved = plateNorth.
import * as E from './f10_editorial.mjs';
import * as F from './f24_kit.mjs';
import * as B from './f24_b1_kit.mjs';
import { anchors03, makeC03 } from './f24_b1_c03.mjs';
import { plateNorth, NORTH_VIEW, TABLET_AT, CA_CALLS, SEAM_HALF } from './f24_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo } = E;
const { rise, maskLine } = F;
const TAU = Math.PI * 2;

const ESP = F.PIN.esp, KEN = F.PIN.kenya, AMB = F.PIN.amboseli;
const WORLD = F.mapView(-22, 24, 1.15);
const KV = F.mapView(36.2, .2, 6.2), AV = F.mapView(36.7, -2.2, 7.4);
const ZOUT = B.bez(.55, 0, .25, 1);
const OTHERS = ['alaska', 'bahamas', 'dominica', 'telaviv'];
const HR_ESP = F.PIN_R * 1.25;
// the natural head of a pin (as F.pin computes it) for a head radius hr: lean splays neighbours
function headOf(p, x, y, hr, kind) { const ln = (p.lean ?? 0) * .9, st = F.STALK; return [x + ln * (st + hr), y - (st + hr * (kind === 'place' ? 0 : 1)) * (1 - .25 * Math.abs(ln))]; }

// the savanna (late afternoon): the cow walks towards the speaker on the jeep. s = scene scale on screen (zooms in when small)
function savanna(ctx, t, s, a) {
  const Z = lerp(1.7, 1.0, clamp((s - .4) / .5)) * (1 + .02 * clamp(t - a.play, 0, 14)), fx = 960, fy = 700;   // + a slow push that follows her walk
  ctx.save(); ctx.translate(fx - 9 * clamp(t - a.play, 0, 14), fy); ctx.scale(Z, Z); ctx.translate(-fx, -fy);
  B.duskSky(ctx, t, { horizon: 690, sunX: 520, sunY: 560, sunR: 62 });
  B.acacia(ctx, 1500, 694, 280); B.acacia(ctx, 260, 696, 170);
  const call = Math.max(0, Math.sin(Math.PI * span(t, a.play + .7, a.her + .55))), ans = Math.max(0, Math.sin(Math.PI * span(t, a.answers - .1, a.answers + 1.1)));
  const wk = span(t, a.heads - .3, a.clip2.start + 1.5), x = lerp(640, 860, sineIO(wk));
  const sp = B.jeep(ctx, t, 1150, 772, 360, { pulse: call });
  const el = F.elephant(ctx, t, x, 800, 250, { dir: 1, light: -1, warm: .75, seed: 3, walk: wk > 0 && wk < 1 ? (t - a.heads) * 3.2 : null, trunk: .5 * ans, ears: .25 + .45 * ans + .2 * call, open: ans });
  B.grass(ctx, t, 760, 960, 1);
  if (call > .02) F.wave(ctx, t, sp[0] - 120, sp[1], 200, 70 * call, 'rumble', { u: span(t, a.play + .7, a.her + .2), col: 'cream', seed: 61, bars: 22, live: true, head: false });
  if (ans > .02) F.wave(ctx, t, el.trunk[0] + 110, el.head[1] - 60, 200, 80 * ans, 'rumble', { u: span(t, a.answers - .1, a.answers + .8), col: 'cream', seed: 62, bars: 22, live: true, head: false });
  ctx.restore();
}
// Amboseli at dusk: a family close together, all rumbling at once (overlapping waves); s = scene scale (1 = full frame)
const FAMILY = [[520, 252, 1, 1, .2], [880, 236, 1, 3, 1.4], [690, 120, 1, 5, 2.6, true], [1090, 190, -1, 7, .8]];
function amboseli(ctx, t, s, a, o = {}) {
  const tr = Math.max(0, t - a.rumble + .55), Z = lerp(1.5, 1.0, clamp((s - .3) / .6)) * (1 + Math.min(.2, .02 * tr)), fx = 760, fy = 700;   // + a slow push and truck while the family rumbles
  ctx.save(); ctx.translate(fx, fy); ctx.scale(Z, Z); ctx.translate(-fx, -fy);
  B.duskSky(ctx, t, { horizon: 680, sunX: 1380, sunY: 640, sunR: 80, set: .12 });
  B.acacia(ctx, 1640, 684, 300); B.acacia(ctx, 120, 686, 210);
  const on = span(t, a.rumble - .3, a.rumble + 1.5) * (1 - (o.drain ?? 0) * .7);
  const heads = FAMILY.map(([x, h, dir, seed, ph, calf]) => {
    const rm = on * (.55 + .45 * Math.sin(t * 1.3 + ph));
    return F.elephant(ctx, t, x, 790 + (calf ? 4 : 0), h, { dir, light: 1, warm: .8, seed, calf, trunk: .3 * rm + (calf ? .2 : 0), ears: .25 + .3 * rm, open: rm });
  });
  B.grass(ctx, t, 760, 980, 1);
  ctx.restore();
  return heads.map((e) => [fx + (e.head[0] - fx) * Z, fy + (e.head[1] - fy) * Z]);
}

export function anchors04(T) {
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = { T0: T.G('Further than you might'), end: T.G('Now north, to Spain') };
  a.alone = G("And they're not alone", a.T0); a.teams = G('teams all over the world', a.T0); a.piece = G('each with a piece', a.T0); a.pieceE = GE('of the puzzle', a.T0);
  a.start = G('Start in Kenya'); a.found = G('Other researchers there found'); a.name = G('by name', a.found);
  a.play = G('Play an elephant a call'); a.her = G('meant for her', a.play); a.answers = G('she answers faster', a.play); a.heads = G('heads for the speaker', a.play);
  a.caught = G('They caught it on camera'); a.clip2 = T.clip('C2');
  a.names = G('If elephants have names'); a.after = G("That's what the team is after");
  a.also = G('Also in Kenya, the Earth'); a.rumble = G('Elephant families often rumble'); a.dinner = G('at dinner', a.rumble);
  a.their = G('Their A.I. listened to the whole'); a.chorus = G('whole chorus', a.their); a.room = G('read the room', a.their);
  a.greet = G('a greeting', a.their); a.calf = G('a calf being comforted', a.their); a.calfE = GE('a calf being comforted', a.their);
  a.step = G('A first step from patterns');
  return a;
}

export function scene(a, T) {
  const a3 = anchors03(T), W3 = makeC03(a3, T);
  const T0 = a.T0, tz1 = T0 + 3.2, TP = a.end - SEAM_HALF;
  // ---- the zoom out of the field into the ESP pin (mirror of c02's zoom in)
  const ZMAX = F.RF / HR_ESP;
  const PW = F.mapXY(WORLD, ESP.lon, ESP.lat);
  function zoomOut(t) {
    const e = ZOUT(span(t, T0, tz1)), zf = Math.exp(Math.log(ZMAX) * (1 - e)), z = WORLD.z * zf, k = F.kOf({ z });
    const px = lerp(W / 2, PW[0], e), py = lerp(H / 2, PW[1], e);
    const v = F.mapView(ESP.lon - (px - W / 2) / k, ESP.lat + (py - H / 2) / k, z);
    const hr = HR_ESP * zf, kk = sineIO(clamp((hr - F.RF) / (HR_ESP - F.RF) * 1.25 - .25));
    return { e, v, hr, rr: F.PIN_R * zf, head: [px, py - (F.STALK + hr) * kk] };
  }
  // ---- the map views: world → (flight) Kenya → (push while the medallion opens) → pan to Amboseli → push → pull back to NORTH
  const tf0 = a.start - .05, tf1 = a.start + 3.4;
  const tk1 = a.play + 2.4;                          // Kenya medallion open
  const tc0 = a.names + .7, tc1 = tc0 + 2.6;         // Kenya medallion closes
  const tp0 = a.also - .1, tp1 = a.also + 2.7;       // pan to Amboseli
  const ta0 = a.rumble - .55, ta1 = a.rumble + 2.3;  // Amboseli iris opens (full frame)
  const tb0 = a.step - .45, tb1 = TP;                // closes, pull back to NORTH_VIEW
  const KV2 = F.mapView(KV.lon, KV.lat, KV.z * 1.3), AV2 = F.mapView(AV.lon, AV.lat, AV.z * 1.25);
  function view0(t) {
    if (t < tz1) return zoomOut(t).v;
    if (t < tf0) return F.mapView(WORLD.lon, WORLD.lat, WORLD.z * (1 + .024 * (t - tz1)));
    const W1 = F.mapView(WORLD.lon, WORLD.lat, WORLD.z * (1 + .024 * (tf0 - tz1)));
    if (t < tf1) return F.flight(W1, KV, sineIO(span(t, tf0, tf1)));
    if (t < tp0) { const u = span(t, tf1, tp0); return F.mapView(KV.lon, KV.lat, KV.z * Math.exp(Math.log(1.3) * sineIO(u))); }
    if (t < tb0) { const A = t < ta0 ? null : 1; void A; const u = sineIO(span(t, tp0, tp1)), v0 = F.flight(KV2, AV, u); if (t < tp1) return v0; return F.mapView(AV.lon, AV.lat, AV.z * Math.exp(Math.log(1.25) * sineIO(span(t, tp1, tb0)))); }
    const A2 = F.mapView(AV2.lon, AV2.lat, AV2.z * creepK(tb0));
    return F.flight(A2, NORTH_VIEW, sineIO(span(t, tb0, tb1)));
  }
  // the map never freezes on the tour: a slow creep (≈ .9 %/s) on top of the word-keyed moves; the pull back to NORTH starts from it
  const creepK = (t) => Math.exp(.009 * (clamp(t, tf1, tb0) - tf1));
  function view(t) {
    const v = view0(t); if (t < tf1 || t >= tb0) return v;
    return F.mapView(v.lon, v.lat, v.z * creepK(t));
  }
  // ---- the medallions
  const kOpen = (t) => sineIO(span(t, a.play - .3, tk1)) * (1 - sineIO(span(t, tc0, tc1)));
  const KCEN = [960, 572], KR = 430;   // inside CLIP_RECT, so the plate covers the ring while C2 plays
  const aOpen = (t) => (t < tb0 ? sineIO(span(t, ta0, ta1)) : 1 - B.bez(.55, 0, .25, 1)(span(t, tb0, tb1 - .25)));
  const othersG = (t) => { const g = {}; OTHERS.forEach((id, i) => { g[id] = span(t, a.teams + .1 + i * .22, a.teams + .9 + i * .22) * (1 - span(t, a.pieceE + .05 + i * .1, a.pieceE + .75 + i * .1)); }); return g; };
  const kenG = (t) => span(t, a.teams + .1 + 4 * .22, a.teams + .9 + 4 * .22);
  const tabU = (t) => rise(span(t, a.piece - .1, a.piece + .9));
  const lisU = (t) => rise(span(t, a.their - .2, a.their + .8));
  const drainU = (t) => span(t, a.chorus - .6, a.chorus + 1.6);

  function tablet(ctx, t) {
    const u = tabU(t); if (u <= 0) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(TABLET_AT.x - 260, TABLET_AT.y - 120, 520, 200); ctx.clip();
    F.tablet(ctx, t, T, TABLET_AT.x, TABLET_AT.y + (1 - expoOut(u)) * 150, TABLET_AT.s, {});
    ctx.restore();
  }
  function amboseliChorus(ctx, t, s, drain) {
    const heads = amboseli(ctx, t, s, a, { drain });
    // overlapping rumbles over the family; they slide into the listener's bell
    const LI = [1290, 420], LSZ = 140, bell = [LI[0] - LSZ * .9, LI[1]];
    const on = span(t, a.rumble - .1, a.rumble + 1.2);
    heads.forEach(([hx, hy], i) => {
      const d = clamp(drain * 1.4 - i * .12), x = lerp(hx + 40, bell[0] - 20, sineIO(d)), y = lerp(hy - 110 - (i % 2) * 40, bell[1], sineIO(d)) - 60 * Math.sin(Math.PI * sineIO(d)), sc = lerp(1, .2, d * d);
      if (on > 0 && d < 1) F.wave(ctx, t, x, y, 260 * sc, 90 * sc * (.7 + .3 * Math.sin(t * 1.7 + i)), 'rumble', { u: span(t, a.rumble - .1 + i * .3, a.rumble + 1.4 + i * .3), col: 'cream', seed: 70 + i, bars: 26, live: true, head: false, a: .9 });
    });
    const lu = lisU(t);
    if (lu > 0) {
      F.listener(ctx, t, LI[0], LI[1], LSZ, { u: lu, drink: .4 * drain * (1 - drain) * 4 + F.bump(t, a.room - .3, .8) * .6 });
      const tip = [LI[0] + LSZ * 1.05, LI[1] - LSZ * .05];
      const g1 = B.riseOut(t, a.greet, a.step - .5, .8, .45), g2 = B.riseOut(t, a.calf, a.step - .45, .8, .45);
      if (g1 > 0) { F.rule(ctx, tip[0] + 6, tip[1], tip[0] + 60, tip[1] - 70, Math.min(1, g1 * 1.5), { w: 2, spark: false }); B.tag(ctx, 'GREETING', tip[0] + 190, tip[1] - 76, g1, { col: 'gold', size: 24 }); }
      if (g2 > 0) { F.rule(ctx, tip[0] + 6, tip[1] + 4, tip[0] + 60, tip[1] + 54, Math.min(1, g2 * 1.5), { w: 2, spark: false }); B.tag(ctx, 'CALF COMFORTED', tip[0] + 222, tip[1] + 56, g2, { col: 'gold', size: 24 }); }
    }
  }

  return (ctx, t) => {
    if (t >= TP) { plateNorth(ctx, t, T); return; }
    const v = view(t);
    F.map(ctx, t, v, { calls: lerp(CA_CALLS, 1, sineIO(span(t, a.teams - .5, a.start)) * (1 - sineIO(span(t, tb0, TP)))) });   // every species: the whole map alive on the tour, back to the plate's state at the seam
    // pins: the ESP medallion (the field closes into it), the other teams, Kenya, Amboseli
    let zo = null; if (t < tz1) zo = zoomOut(t);
    const grow = { ...othersG(t), kenya: kenG(t) };
    const head = {}, r = {}, inner = {};
    if (zo) { head.esp = zo.head; r.esp = zo.rr; inner.esp = () => {}; }
    // the Kenya medallion: opens to KR at KCEN (decoupled iris), closes back
    const ko = kOpen(t);
    const [kx, ky] = F.mapXY(v, KEN.lon, KEN.lat);
    if (ko > 0) { const hr = lerp(F.PIN_R, KR, ko), nh = headOf(KEN, kx, ky, hr, 'other'); head.kenya = [lerp(nh[0], KCEN[0], ko), lerp(nh[1], KCEN[1], ko)]; r.kenya = hr; inner.kenya = () => {}; }
    const ao = aOpen(t), [ax, ay] = F.mapXY(v, AMB.lon, AMB.lat);
    if (t > ta0 && ao > 0) { const hr = lerp(HR_ESP, F.RF * 1.02, ao), nh = headOf(AMB, ax, ay, hr, 'esp'); head.amboseli = [lerp(nh[0], W / 2, ao), lerp(nh[1], H / 2, ao)]; r.amboseli = hr / 1.25; inner.amboseli = () => {}; }
    const labels = { esp: 0, kenya: B.riseOut(t, a.start + .1, a.play - .7, .8, .45), amboseli: B.riseOut(t, a.also + .2, a.rumble - 1.1, .8, .45) };
    for (const id of OTHERS) labels[id] = 0;
    const hd = F.pins(ctx, t, T, v, { grow, head, r, inner, labels, pulse: { kenya: F.bump(t, a.start, 1.2) } });
    // inside the ESP medallion: the c03 field (it shrinks into the pin; its gold wave icon returns when it is small)
    if (zo && hd.esp) {
      const [cx, cy, rr] = hd.esp, s = rr / F.RF;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.arc(cx, cy, rr - (rr < F.RF * .98 ? 1 : 0), 0, TAU); ctx.clip();
      ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-W / 2, -H / 2);
      W3.field(ctx, t, W3.fcam(t));
      const dk = span(rr, 110, 34); if (dk > 0) { ctx.fillStyle = rgba(mixHex(P.night0, P.ind1, .55), dk); ctx.fillRect(-60, -60, W + 120, H + 120); F.wave(ctx, t, W / 2, H / 2 + .05 * F.RF, 1.3 * .95 * F.RF * dk, .9 * .95 * F.RF * dk, 'rumble', { col: 'gold', u: 1, bars: 9, seed: 4 }); }
      ctx.restore();
      if (rr < F.RF * .98) { ctx.save(); ctx.strokeStyle = F.GOLD.body; ctx.lineWidth = clamp(rr * .12, 2, 3.2); ctx.beginPath(); ctx.arc(cx, cy, rr, 0, TAU); ctx.stroke(); ctx.restore(); }
    }
    // inside the Kenya medallion: the savanna (and the clip grows out of it)
    const inClip = t >= a.caught && t < a.clip2.end + 1.3;
    if (hd.kenya && ko > 0 && !inClip) { const [cx, cy, rr] = hd.kenya; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); B.medal(ctx, cx, cy, rr, (q, s) => savanna(q, t, s, a), { ring: F.CREAM.core }); ctx.restore(); }
    // inside the Amboseli medallion: the family at dusk, the chorus, the listener
    if (hd.amboseli && t > ta0 && ao > 0) { const [cx, cy, rr] = hd.amboseli; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); B.medal(ctx, cx, cy, rr, (q, s) => amboseliChorus(q, t, s, drainU(t)), { ring: F.GOLD.body, rw: rr > F.RF * .98 ? 0.001 : undefined }); ctx.restore(); }
    tablet(ctx, t);
    if (inClip) {
      const from = [KCEN[0], KCEN[1], KR], C2 = a.clip2;
      if (t < C2.start) B.plateScene(ctx, from, span(t, a.caught + .05, C2.start - .05), (q, s) => savanna(q, t, s, a), { ring: F.CREAM.core });
      else if (t < C2.end) F.clipPlate(ctx, t, T, 'C2', { from, morph: 1, credits: false });
      else B.plateScene(ctx, from, 1 - span(t, C2.end, C2.end + 1.25), (q, s) => savanna(q, t, s, a), { ring: F.CREAM.core });
      B.credits(ctx, 'C2', span(t, C2.start + .2, C2.start + 1.1) * (1 - span(t, C2.end - .5, C2.end + .1)));
    }
    F.strip(ctx, t, T);
  };
}
