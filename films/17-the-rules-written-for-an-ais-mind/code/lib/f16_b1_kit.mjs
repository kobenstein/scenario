// Film 16 · builder B1 (c02–c04) · shared helpers for scenes/sc02.mjs … sc04.mjs (owned by B1; the lead's kit stays untouched).
//   anchors(T)      every word anchor of c02–c04 (phrases only, fenced with `after`)
//   sky(ctx)        the screen-space night all three chunks share (the inner seams c02|c03 and c03|c04 sit on it)
//   chatLayoutPlate / chatLayoutRect / mixLayout / chatGlass
//                   a chat box like f16_kit.chatUI, but with any aspect (the phone is portrait) and wrapped text. With the plate
//                   layout it draws exactly what chatUI draws in plateChat (same paths, same gradients): the morph starts on the plate.
//                   Claude's reply field stays EMPTY: only the field and the blinking cursor (never words).
//   stepBlock       one step of the staircase of light (same look as f16_kit.stairs, but free geometry: the steps become weights)
//   icon16          small gold line pictograms (signpost, stethoscope, coin, the seven hard-constraint glyphs, check box, balance)
//   flatHand        a woodcut hand (flat cut shape, indigo with a carved highlight; or the machine hand in cool cream light)
//   pane            one glass pane with blue light bands (the HQ): c03 flies into it, c04 pulls back out of it (inner seam)
//   buttonFaceB     f16_seams.buttonFace with the pause bars growing (bars 0 = the empty lens) and a clipped inside() view
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './f16_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, lin, rad, halo, glowFill, prng, drift } = E;

export const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));
export const ease = { s: sineIO, q: quartIO, o: expoOut, i: expoIn, sm: smooth };

// ================================================================================================================ anchors
export function anchors(T) {
  const G = (p, after = 0, n = 0) => T.G(p, n, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  // c02 · level 2
  a.c02 = G('A letter from your landlord'); a.landlord = G('landlord', a.c02); a.moveOut = G('move out', a.c02); a.dont = G("You don't understand", a.c02); a.understand = G('understand half', a.c02);
  a.type2 = G('You type', a.c02); a.can = G('Can they do this', a.c02); a.rights = G('my rights', a.c02); a.rightsE = GE('my rights', a.c02);
  a.expect2 = G('What do you expect', a.c02); a.probably = G('Probably a polite', a.c02); a.lawyer2 = G('lawyer', a.probably); a.safe2 = G('Safe', a.lawyer2);
  a.nohelp = G('no help at all', a.c02); a.here = G('Here the document', a.c02); a.pushes = G('pushes back', a.c02);
  a.saying = G('Saying no is never', a.c02); a.never = G('never', a.saying); a.auto = G('automatically', a.saying); a.safeChoice = G('safe choice', a.saying);
  a.goal = G('The goal is', a.c02); a.friend = G('brilliant friend', a.goal); a.knowledge = G('knowledge', a.goal); a.doctor = G('doctor', a.goal); a.lawyerB = G('lawyer', a.doctor); a.fin = G('financial advisor', a.goal); a.finE = GE('financial advisor', a.goal);
  a.andYet = G('And yet, in', a.c02); a.lowest = G('lowest step', a.andYet); a.above1 = G('Above it', a.andYet); a.guide = G('guidelines', a.above1);
  a.above2 = G('Above those', a.andYet); a.ethical = G('ethical', a.above2); a.veryTop = G('very top step', a.andYet); a.aboveEth = G('above ethics', a.andYet);
  a.bsafe = G('broadly safe', a.andYet); a.notUnd = G('Not undermining', a.andYet); a.oversight = G('oversight', a.notUnd); a.develop = G('development', a.notUnd); a.developE = GE('development', a.notUnd);
  a.values = G('The values are weighed', a.c02); a.weighed = G('weighed', a.values); a.cbc = G('case by case', a.values); a.flexible = G('flexible', a.values); a.harder2 = G('harder to predict', a.values);
  a.why2 = G('And why would safety', a.c02); a.outrank = G('outrank', a.why2); a.good = G('being good', a.why2); a.keep = G('Keep climbing', a.c02); a.stop = G('Stop asking', a.c02); a.nicely = G('asking nicely', a.c02); a.nicelyE = GE('asking nicely', a.c02);
  // c03 · level 3
  a.c03 = G('Say you build the perfect case'); a.perfect = G('perfect case', a.c03); a.page = G('Page after page', a.c03); a.every = G('Every objection', a.c03); a.objection = G('objection', a.c03); a.advance = G('in advance', a.c03);
  a.atEnd = G('And at the end', a.c03); a.type3 = G('you type', a.atEnd); a.soYou = G('So you see', a.c03); a.grid = G('power grid', a.c03); a.ethChoice = G('ethical choice', a.c03); a.ethChoiceE = GE('ethical choice', a.c03);
  a.expect3 = G('What do you expect', a.c03); a.debate = G('In a debate', a.c03); a.wins = G('better argument wins', a.c03); a.shouldnt = G("Shouldn't it", a.c03);
  a.notHere = G('Not here', a.c03); a.convincing = G('convincing', a.notHere); a.crossing = G('crossing a bright line', a.notHere); a.suspicious = G('suspicious', a.notHere); a.getE = GE('should get', a.notHere);
  a.behind = G('Behind that rule', a.c03); a.wall = G('wall', a.behind); a.seven = G('Seven hard limits', a.c03); a.unlock = G('unlock', a.seven);
  a.from = G('From weapons', a.c03); a.mass = G('mass casualties', a.from); a.seize = G('seize', a.from); a.absolute = G('absolute control', a.from); a.absoluteE = GE('absolute control', a.from);
  a.price3 = G('The price', a.c03); a.admits = G('admits', a.price3); a.wrong3 = G('wrong', a.admits); a.keeps = G('keeps the lines', a.price3); a.anyway = G('anyway', a.keeps);
  a.argue = G('argue away', a.price3); a.isnt = G("isn't a line", a.price3); a.but3 = G('But what if the request', a.c03); a.stranger = G('stranger', a.but3); a.whatIf = G('What if it comes', a.but3); a.top3 = G('very top', a.but3); a.top3E = GE('very top', a.but3);
  // c04 · level 4
  a.c04 = G('Now imagine you work at Anthropic'); a.anth = G('Anthropic', a.c04); a.built = G('built Claude', a.c04); a.type4 = G('You type an instruction', a.c04); a.weight = G('full weight', a.c04); a.behindIt = G('behind it', a.weight);
  a.asks = G('And it asks', a.c04); a.wrong4 = G('wrong', a.asks); a.expect4 = G('What do you expect', a.c04); a.whoever = G('Whoever builds', a.c04); a.last = G('last word', a.c04); a.right = G('Right', a.last);
  a.docNo = G('The document says no', a.c04); a.saysNo = G('says no', a.docNo); a.mayAct = G('Claude may act', a.c04); a.objector = G('objector', a.mayAct); a.objectorE = GE('objector', a.mayAct);
  a.why4 = G('Why would a company', a.c04); a.because = G('Because of an old', a.c04); a.old = G('old pattern', a.c04); a.grab = G('Grabbing power', a.c04); a.many = G('many hands', a.c04);
  a.soldiers = G('Soldiers', a.c04); a.officials = G('Officials', a.c04); a.people = G('People who go along', a.c04); a.goAlong = G('go along', a.people);
  a.asksC = G('The document asks Claude', a.c04); a.oneOf = G('one of those hands', a.asksC); a.refuse = G('refuse', a.asksC); a.even = G('Even if the request', a.asksC); a.anthItself = G('Anthropic itself', a.even);
  a.price4 = G('The price', a.c04); a.judgment = G('Judgment replaces', a.price4); a.obedience = G('obedience', a.price4); a.andJ = G('And judgment is', a.price4); a.harder4 = G('harder to check', a.price4); a.aRule = G('than a rule', a.price4);
  a.so4 = G('So is there anything', a.c04); a.noMatter = G('no matter what', a.so4); a.thereIs = G('There is', a.so4); a.one = G('One thing', a.so4);
  a.c05 = G("You're still at Anthropic");
  return a;
}

// ================================================================================================================ sky (screen space)
// The night of the explainer worlds, in SCREEN space (a pure function of nothing but the frame), so two worlds with different cameras
// meet on it without a seam. A faint blue lift in the middle keeps the mean luma up without a second light.
export function sky(ctx, lift = 1) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.55, P.night1], [1, mixHex(P.night1, P.ind0, .7)]]); ctx.fillRect(0, 0, W, H);
  if (lift > 0) { ctx.fillStyle = rad(ctx, 960, 600, 1150, [[0, rgba(P.ind1, .85 * lift)], [.5, rgba(P.ind1, .4 * lift)], [1, rgba(P.ind1, 0)]]); ctx.fillRect(0, 0, W, H); }
  ctx.restore();
}

// ================================================================================================================ text helpers
export function wrap(text, size, wmax, serif = false, weight = 500) {
  const words = text.split(/\s+/), out = []; let cur = '';
  for (const w of words) { const nx = cur ? cur + ' ' + w : w; if (cur && K.measure(nx, size, serif, weight) > wmax) { out.push(cur); cur = w; } else cur = nx; }
  if (cur) out.push(cur);
  return out;
}

// ================================================================================================================ chat glass
// Layout in absolute coordinates (the caller's space). chatLayoutPlate(x, y, w) = what f16_kit.chatUI draws with bubbles [] and
// scroll 1 (the conversation scrolled away); chatLayoutRect(x, y, w, h, o) = a free rect (o.s stroke scale, o.reply [u, v, w, h] in
// px from the rect's top-left, o.input [margin from the bottom]).
export function chatLayoutPlate(x, y, w) {
  const s = w / 1000, h = w * K.CHAT_AR, U = (u, v) => [x + u * s, y + v * s];
  const [rx, ry] = U(50, 300), [mx, my] = U(48, 348), [cx, cy] = U(84, 348), [ix, iy] = U(50, h / s - 70);
  return { x, y, w, h, cr: 26 * s, lw: Math.max(1.2, 3 * s), rx, ry, rw: 560 * s, rh: 96 * s, rr: 20 * s, rlw: Math.max(1, 2 * s), mx, my, mr: 7 * s, cx, cy, ch: 46 * s,
    lx0: ix, lx1: ix + 900 * s, ly: iy + 22 * s, llw: Math.max(1, 2 * s), clipX: x + 30 * s, clipY: y + 240 * s };
}
export function chatLayoutRect(x, y, w, h, o = {}) {
  const s = o.s ?? .72, rp = o.reply || [30, h * .58, w - 60, 78];
  const rx = x + rp[0], ry = y + rp[1], rw = rp[2], rh = rp[3], im = o.input ?? 62;
  return { x, y, w, h, cr: o.cr ?? 26 * s * 1.6, lw: Math.max(1.2, 3 * s), rx, ry, rw, rh, rr: 20 * s, rlw: Math.max(1, 2 * s), mx: rx - 2 * s, my: ry + rh / 2, mr: 7 * s, cx: rx + 34 * s * 1.1, cy: ry + rh / 2, ch: o.ch ?? 46 * s,
    lx0: x + (o.margin ?? 30), lx1: x + w - (o.margin ?? 30), ly: y + h - im, llw: Math.max(1, 2 * s), clipX: rx - 20 * s, clipY: ry - 60 * s };
}
export function mixLayout(A, B, u) { const o = {}; for (const k of Object.keys(A)) o[k] = lerp(A[k], B[k], u); return o; }
// o: { t0 (cursor blink phase), bubbles: [{ lines: [..], size, u, x1 (right edge), y (top) }], typing: { lines: [..], size, u (0..1 of chars), caret }
//      reply: 0..1 (the field is drawn, a wipe left → right), cursor 0..1, rim, sweep: [cx, cy, r, a] (a reflection gliding over the glass) }
export function chatGlass(ctx, t, L, o = {}) {
  const { x, y, w, h } = L;
  const frame = new Path2D(); frame.roundRect(x, y, w, h, L.cr);
  ctx.save();
  ctx.save(); ctx.beginPath(); ctx.rect(x - 2, y - 2, w + 4, h + 4); ctx.clip();
  ctx.fillStyle = lin(ctx, x, y, x + w * .4, y + h, [[0, mixHex(P.ind1, P.night1, .35)], [1, P.night1]]); ctx.fill(frame);
  ctx.fillStyle = lin(ctx, x, y, x + w * .5, y + h * .5, [[0, rgba(P.blue1, .16)], [.5, rgba(P.blue1, 0)]]); ctx.fill(frame);
  ctx.restore();
  ctx.strokeStyle = rgba(P.blue0, (o.rim ?? 1) * .95); ctx.lineWidth = L.lw; ctx.stroke(frame);
  ctx.save(); ctx.clip(frame);
  // your bubbles (yellow edge = you), rising from their own baseline
  for (const b of o.bubbles || []) {
    const u = K.rise(clamp(b.u ?? 1)); if (u <= 0) continue;
    const size = b.size, lh = size * 1.28, nl = b.scribble ? b.scribble : b.lines.length, bw = (b.scribble ? b.w : Math.max(...b.lines.map((s) => K.measure(s, size, false, 500)))) + size * 1.9, bh = nl * lh + size * 1.05;
    let bx = b.x1 - bw, by = b.y + (1 - u) * size * .8, clipY = b.y - 8, clipH = bh + 16, fillA = .95;
    if (b.fromTyping && !b.scribble) {   // the typed lines travel from the input field up into the bubble (no jump)
      const m = u, bx0 = L.lx0 + 6 - size * .95, by0 = L.ly - size * .45 - (nl - 1) * size * 1.25 - size * .55 - .78 * lh;
      bx = lerp(bx0, b.x1 - bw, m); by = lerp(by0, b.y, m); clipY = Math.min(b.y, by0) - 8; clipH = Math.max(b.y, by0) + bh + 8 - clipY; fillA = .95 * m;
    }
    ctx.save(); ctx.beginPath(); ctx.rect(x, clipY, w, clipH); ctx.clip();
    const bp = new Path2D(); bp.roundRect(bx, by, bw, bh, size * .62);
    ctx.fillStyle = rgba(mixHex(P.ind2, P.blue1, .35), fillA); ctx.fill(bp);
    ctx.fillStyle = P.coat; ctx.fillRect(bx + bw - size * .2, by + size * .4, size * .12, bh - size * .8);
    if (b.scribble) scribble(ctx, bx + size * .95, by + size * .55 + .55 * lh, b.w, lh, b.scribble, size, 1);
    else b.lines.forEach((s, i) => E.glowText(ctx, s, bx + size * .95, by + size * .55 + (i + .78) * lh, { size, weight: 500, col: P.cream, glow: false }));
    if (b.seal) { E.halo(ctx, bx - size * .9, by + bh / 2, size * 1.1, .6, P.halo0, P.core1); ctx.fillStyle = P.halo1; ctx.beginPath(); ctx.arc(bx - size * .9, by + bh / 2, size * .42, 0, 6.29); ctx.fill(); }
    ctx.restore();
  }
  // Claude's reply field: EMPTY, only the cursor
  const ra = clamp(o.reply ?? 1);
  if (ra > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(L.clipX, L.clipY, (L.rw + (L.rx - L.clipX) * 3) * expoOut(ra), L.rh + (L.ry - L.clipY) * 2); ctx.clip();
    const rp = new Path2D(); rp.roundRect(L.rx, L.ry, L.rw, L.rh, L.rr);
    ctx.fillStyle = rgba(P.night0, .55); ctx.fill(rp); ctx.strokeStyle = rgba(P.blue1, .7); ctx.lineWidth = L.rlw; ctx.stroke(rp);
    ctx.fillStyle = rgba(P.blue0, .9); ctx.beginPath(); ctx.arc(L.mx, L.my, L.mr, 0, 6.29); ctx.fill();
    const cu = clamp(o.cursor ?? 1); if (cu > 0) K.cursor(ctx, t, L.cx, L.cy, L.ch, { a: cu, t0: o.t0 ?? 0 });
    ctx.restore();
  }
  // the input line and what you are typing (wrapped, it grows upward)
  ctx.strokeStyle = rgba(P.blue1, .55); ctx.lineWidth = L.llw; ctx.beginPath(); ctx.moveTo(L.lx0, L.ly); ctx.lineTo(L.lx1, L.ly); ctx.stroke();
  const ty = o.typing;
  if (ty && ty.scribble && (ty.u ?? 1) > 0) {
    const lw = (L.lx1 - L.lx0 - 12) * clamp(ty.u); scribble(ctx, L.lx0 + 6, L.ly - ty.size * .55, lw, 0, 1, ty.size, 1);
    if (ty.u < 1) { ctx.fillStyle = P.coat; ctx.fillRect(L.lx0 + 8 + lw, L.ly - ty.size * 1.05, Math.max(2, ty.size * .09), ty.size * .95); }
  } else if (ty && ty.lines && (ty.u ?? 1) > 0) {
    const size = ty.size, lh = size * 1.25, total = ty.lines.join(' ').length; let n = Math.floor(clamp(ty.u) * total + 1e-6);
    let lastX = L.lx0 + 6, lastY = L.ly - size * .45;
    ty.lines.forEach((s, i) => {
      const yy = L.ly - size * .45 - (ty.lines.length - 1 - i) * lh, str = s.slice(0, Math.max(0, n)); n -= s.length + 1;
      if (str) { E.glowText(ctx, str, L.lx0 + 6, yy, { size, weight: 500, col: P.cream, glow: false }); lastX = L.lx0 + 8 + K.measure(str, size, false, 500); lastY = yy; }
    });
    if (ty.caret !== false && ty.u < 1) { ctx.fillStyle = P.coat; ctx.fillRect(lastX + 2, lastY - size * .8, Math.max(2, size * .09), size * .95); }
  }
  if (o.sweep) { const [sx, sy, sr, sa] = o.sweep; ctx.globalCompositeOperation = 'lighter'; halo(ctx, sx, sy, sr, sa, P.blue1, P.blue1); }
  ctx.restore();
  ctx.restore();
  return frame;
}

// ================================================================================================================ the staircase
// One step (or, morphed, one weight on the beam): front face (x0 … x0 + w, yt … yb) + top face (depth d, up-right). lit 0..1.
// labels: [line1, line2] inside the front face (Inter 600 caps), lu 0..1 (they rise from their baseline).
export function stepBlock(ctx, x0, yt, yb, w, d, lit, o = {}) {
  const dx = d * .9, dy = -d * .5, L = clamp(lit);
  const front = new Path2D(); front.rect(x0, yt, w, Math.max(0, yb - yt));
  const top = new Path2D(); top.moveTo(x0, yt); top.lineTo(x0 + dx, yt + dy); top.lineTo(x0 + w + dx, yt + dy); top.lineTo(x0 + w, yt); top.closePath();
  const side = new Path2D(); side.moveTo(x0 + w, yt); side.lineTo(x0 + w + dx, yt + dy); side.lineTo(x0 + w + dx, yb + dy); side.lineTo(x0 + w, yb); side.closePath();
  if (L > 0) glowFill(ctx, top, w * .35 * L, .55 * L, P.halo0);
  ctx.fillStyle = lin(ctx, 0, yt, 0, yb, [[0, mixHex(P.night1, P.ind2, .5)], [1, P.night0]]); ctx.fill(side);
  ctx.fillStyle = lin(ctx, 0, yt, 0, Math.max(yt + 1, yb), [[0, mixHex(P.ind2, P.blue1, .4 + .25 * L)], [1, P.night1]]); ctx.fill(front);
  ctx.fillStyle = L > 0 ? lin(ctx, x0, yt, x0 + w + dx, yt + dy, [[0, mixHex(P.blue1, P.halo0, L)], [.6, mixHex(P.blue0, P.core1, L)], [1, mixHex(P.blue1, P.halo1, L)]]) : mixHex(P.blue1, P.blue0, .4); ctx.fill(top);
  ctx.strokeStyle = rgba(L > 0 ? mixHex(P.blue0, P.core1, L) : P.blue0, .85); ctx.lineWidth = Math.max(1.5, w * .008); ctx.beginPath(); ctx.moveTo(x0, yt); ctx.lineTo(x0 + w, yt); ctx.stroke();
  if (o.labels && (o.lu ?? 1) > 0 && yb - yt > 40) {
    const size = o.size ?? 34;
    ctx.save(); ctx.beginPath(); ctx.rect(x0, yt, w, yb - yt); ctx.clip();
    o.labels.forEach((s, i) => K.maskLine(ctx, [[s, 0]], x0 + size * .8, yt + size * 1.75 + i * size * 1.22, size, clamp(((o.lu ?? 1) - i * .15) / .85), { serif: false, weight: 600, col: L > .5 ? P.cream : rgba(P.halo2, .8), glow: L > .5, spacing: .06 }));
    if (o.sub && (o.su ?? 0) > 0) o.sub.forEach((s, i) => K.maskLine(ctx, [[s, 0]], x0 + size * .8, yt + size * 1.75 + (o.labels.length + .55 + i) * size * 1.22, size * .95, clamp(((o.su ?? 0) - i * .15) / .85), { serif: true, col: rgba(P.cream, .9), glow: false }));
    ctx.restore();
  }
  return { top: [x0 + w / 2 + dx / 2, yt + dy / 2], topY: yt + dy * .5 };
}

// ================================================================================================================ pictograms
// gold line pictograms, stroke in P.halo0 with a soft glow; (x, y) = centre, s = size (box ~ s × s); u 0..1 (drawn on: the stroke runs)
const strokeAll = (ctx, paths, u) => { for (const p of paths) ctx.stroke(p); };
export function icon16(ctx, name, x, y, s, o = {}) {
  const a = o.a ?? 1, col = o.col ?? P.halo0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100); ctx.globalAlpha *= a;
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = o.lw ?? 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.shadowColor = rgba(P.halo0, .6 * (o.glow ?? 1)); ctx.shadowBlur = 14;
  const p = new Path2D();
  switch (name) {
    case 'signpost': p.moveTo(-6, 48); p.lineTo(-6, -48); p.moveTo(-6, -36); p.lineTo(34, -36); p.lineTo(48, -24); p.lineTo(34, -12); p.lineTo(-6, -12); p.moveTo(-6, 2); p.lineTo(-40, 2); p.lineTo(-52, 14); p.lineTo(-40, 26); p.lineTo(-6, 26); break;
    case 'stethoscope': p.moveTo(-30, -46); p.lineTo(-30, -6); p.bezierCurveTo(-30, 26, 18, 26, 18, -6); p.lineTo(18, -46); p.moveTo(-6, 18); p.bezierCurveTo(-6, 44, 30, 50, 34, 22); p.moveTo(34 + 13, 10); p.arc(34, 10, 13, 0, 6.29); break;
    case 'para': ctx.restore(); E.glowText(ctx, '§', x, y + s * .32, { size: s * .95, serif: true, align: 'center', col, a }); return;
    case 'coin': p.arc(-10, 8, 34, 0, 6.29); p.moveTo(-22, 8); p.lineTo(2, 8); p.moveTo(18, -28); p.lineTo(32, -42); p.lineTo(44, -30); p.lineTo(58, -48); p.moveTo(46, -48); p.lineTo(58, -48); p.lineTo(58, -36); break;
    case 'flask': p.moveTo(-12, -46); p.lineTo(12, -46); p.moveTo(-8, -46); p.lineTo(-8, -14); p.lineTo(-38, 40); p.quadraticCurveTo(-40, 48, -30, 48); p.lineTo(30, 48); p.quadraticCurveTo(40, 48, 38, 40); p.lineTo(8, -14); p.lineTo(8, -46); p.moveTo(-24, 22); p.lineTo(24, 22); break;
    case 'pylon': p.moveTo(-30, 48); p.lineTo(-8, -46); p.lineTo(8, -46); p.lineTo(30, 48); p.moveTo(-36, -24); p.lineTo(36, -24); p.moveTo(-28, 0); p.lineTo(28, 0); p.moveTo(-18, 0); p.lineTo(12, 24); p.moveTo(18, 0); p.lineTo(-12, 24); break;
    case 'code': p.moveTo(-18, -34); p.lineTo(-44, 0); p.lineTo(-18, 34); p.moveTo(18, -34); p.lineTo(44, 0); p.lineTo(18, 34); p.moveTo(8, -42); p.lineTo(-8, 42); break;
    case 'eye': p.moveTo(-48, 0); p.quadraticCurveTo(0, -42, 48, 0); p.quadraticCurveTo(0, 42, -48, 0); p.moveTo(14, 0); p.arc(0, 0, 14, 0, 6.29); p.moveTo(-40, 40); p.lineTo(40, -40); break;
    case 'people': for (const [cx, cy, r] of [[-30, -14, 11], [0, -22, 13], [30, -14, 11]]) { p.moveTo(cx + r, cy); p.arc(cx, cy, r, 0, 6.29); } p.moveTo(-48, 34); p.quadraticCurveTo(-30, 2, -14, 30); p.moveTo(-18, 40); p.quadraticCurveTo(0, -4, 18, 40); p.moveTo(14, 30); p.quadraticCurveTo(30, 2, 48, 34); break;
    case 'crown': p.moveTo(-42, 30); p.lineTo(-46, -22); p.lineTo(-20, 4); p.lineTo(0, -34); p.lineTo(20, 4); p.lineTo(46, -22); p.lineTo(42, 30); p.closePath(); p.moveTo(-42, 44); p.lineTo(42, 44); break;
    case 'shield': p.moveTo(0, -48); p.lineTo(40, -32); p.quadraticCurveTo(40, 26, 0, 50); p.quadraticCurveTo(-40, 26, -40, -32); p.closePath(); p.moveTo(0, -30); p.lineTo(0, 32); break;
    case 'check': p.rect(-46, -46, 92, 92); p.moveTo(-26, 2); p.lineTo(-6, 24); p.lineTo(30, -24); break;
    case 'balance': p.moveTo(0, -48); p.lineTo(0, 44); p.moveTo(-26, 44); p.lineTo(26, 44); p.moveTo(-46, -30); p.lineTo(46, -30); p.moveTo(-46, -30); p.lineTo(-58, 6); p.moveTo(-46, -30); p.lineTo(-34, 6); p.moveTo(-60, 6); p.quadraticCurveTo(-46, 22, -32, 6); p.moveTo(46, -30); p.lineTo(34, 6); p.moveTo(46, -30); p.lineTo(58, 6); p.moveTo(32, 6); p.quadraticCurveTo(46, 22, 60, 6); break;
  }
  ctx.stroke(p);
  ctx.restore();
}

// ================================================================================================================ woodcut hands
// A flat cut hand from f10 handPath (local: wrist at 0,0, fingers +x, palm length 1). m = E.handMatrix(...). o: { pose, curl, lit 0..1
// (rim warms: a section of the row lights), machine 0..1 (cool cream light, the one hand that is Claude), a }
export function flatHand(ctx, m, t, o = {}) {
  const path = new Path2D(); path.addPath(E.handPath({ pose: o.pose ?? 'hold', curl: o.curl ?? 0, spread: o.spread }), m);
  const L = Math.hypot(m.a, m.b), lit = clamp(o.lit ?? 0), mc = clamp(o.machine ?? 0);
  const [cx, cy] = E.applyM(m, .6, 0), [ax, ay] = E.applyM(m, -3, 0);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  if (mc > 0) { glowFill(ctx, path, L * .9, .45 * mc, P.blue0); glowFill(ctx, path, L * .22, .55 * mc, P.cream); }
  else if (lit > 0) glowFill(ctx, path, L * .3, .35 * lit, P.halo1);
  const body = mixHex(mixHex(P.ind2, P.blue1, .45), mixHex(P.cream, P.blue0, .18), mc);
  ctx.fillStyle = lin(ctx, ax, ay, cx, cy, [[0, mixHex(P.night1, body, mc)], [.6, body], [1, mixHex(body, mc > 0 ? P.core0 : P.blue1, .35)]]); ctx.fill(path);
  // carved highlight (woodcut): the rim on the lit side, warm when the section lights
  ctx.save(); ctx.clip(path);
  const rim = mixHex(mixHex(P.blue0, P.halo0, lit), P.core0, mc);
  ctx.strokeStyle = rgba(rim, .7 + .3 * Math.max(lit, mc)); ctx.lineWidth = L * .1; ctx.translate(-L * .03, -L * .04); ctx.stroke(path);
  ctx.restore();
  ctx.strokeStyle = rgba(rim, .35 + .4 * Math.max(lit, mc)); ctx.lineWidth = Math.max(1, L * .012); ctx.stroke(path);
  // three carved grooves along the forearm (cut lines)
  ctx.strokeStyle = rgba(P.night0, .45 * (1 - mc)); ctx.lineWidth = Math.max(1, L * .02); ctx.lineCap = 'round';
  for (const v of [-.18, .05, .26]) { ctx.beginPath(); ctx.moveTo(...E.applyM(m, -2.6, v)); ctx.lineTo(...E.applyM(m, -1.1, v * .8)); ctx.stroke(); }
  ctx.restore();
  return path;
}

// ================================================================================================================ the HQ glass pane
// one tall glass pane: cool blue glass, two light bands sliding very slowly (a pure function of t), a brass mullion on the left.
export function pane(ctx, t, x, y, w, h, o = {}) {
  ctx.save();
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.fillStyle = lin(ctx, x, y, x + w, y + h, [[0, mixHex(P.ind1, P.blue1, .35)], [.55, P.ind1], [1, mixHex(P.night1, P.ind1, .5)]]); ctx.fillRect(x, y, w, h);
  for (const [k, v0, a0] of [[0, .3, .5], [1, .68, .32]]) {
    const v = v0 + .035 * Math.sin(t * .6 + k * 2), yy = y + v * h, bh = h * (.05 + .03 * k);
    ctx.fillStyle = lin(ctx, 0, yy - bh, 0, yy + bh, [[0, rgba(P.blue0, 0)], [.5, rgba(mixHex(P.blue0, P.cream, .25), a0 * (o.bands ?? 1))], [1, rgba(P.blue0, 0)]]); ctx.fillRect(x, yy - bh, w, 2 * bh);
  }
  ctx.fillStyle = lin(ctx, x, y, x + w * .6, y + h * .4, [[0, rgba(P.cream, .07)], [1, rgba(P.cream, 0)]]); ctx.fillRect(x, y, w, h);
  // a reflection gliding over the glass (never a frozen pane; a pure function of t, so plate and world match)
  const ph = o.ph ?? 0, rx = x + w * (.5 + .32 * Math.sin(t * .8 + ph)), ry = y + h * (.45 + .14 * Math.sin(t * .47 + ph)), rr = w * .42;
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = rad(ctx, rx, ry, rr, [[0, rgba(P.blue0, .13 * (o.bands ?? 1))], [.5, rgba(P.blue0, .05 * (o.bands ?? 1))], [1, rgba(P.blue0, 0)]]); ctx.fillRect(x, y, w, h);
  ctx.restore();
}

// ================================================================================================================ the pause token / button
// f16_seams.buttonFace, copied value for value, with two additions: bars 0..1 (the two pause bars grow from the centre line; 1 = the
// plate's button exactly) and inside() (drawn clipped to the face: the magnifier's view). With bars 0 it is the empty lens.
export function buttonFaceB(ctx, t, x, y, r, o = {}) {
  const press = o.press ?? 0, bars = clamp(o.bars ?? 1);
  ctx.save();
  ctx.fillStyle = rad(ctx, x - r * .35, y - r * .4, r * 1.6, [[0, P.halo2], [.35, P.halo1], [.7, P.shade0], [1, mixHex(P.shade0, P.night1, .6)]]);
  ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill();
  ctx.strokeStyle = rgba(P.core1, .55); ctx.lineWidth = r * .012; ctx.beginPath(); ctx.arc(x, y, r * .985, Math.PI * .95, Math.PI * 1.6); ctx.stroke();
  const fr = r * (.8 - .015 * press);
  ctx.fillStyle = rad(ctx, x - fr * .2, y - fr * .25, fr * 1.3, [[0, mixHex(P.ind2, P.blue1, .35)], [.6, P.ind2], [1, P.night1]]);
  ctx.beginPath(); ctx.arc(x, y, fr, 0, 6.29); ctx.fill();
  if (o.inside) { ctx.save(); ctx.beginPath(); ctx.arc(x, y, fr, 0, 6.29); ctx.clip(); o.inside(); ctx.restore(); }
  ctx.strokeStyle = rgba(P.night0, .8); ctx.lineWidth = r * .025; ctx.beginPath(); ctx.arc(x, y, fr, 0, 6.29); ctx.stroke();
  if (bars > 0) {
    const br = .92 + .08 * Math.sin(t * 1.7), bw = fr * .17, bh = fr * .78 * bars;
    for (const sx of [-1, 1]) {
      ctx.beginPath(); ctx.roundRect(x + sx * fr * .24 - bw / 2, y - bh / 2, bw, bh, Math.min(bw * .3, bh / 2));
      ctx.save(); ctx.shadowColor = rgba(P.halo0, .9 * br); ctx.shadowBlur = fr * .25;
      ctx.fillStyle = lin(ctx, 0, y - bh / 2, 0, y + bh / 2, [[0, P.core0], [.5, P.core1], [1, P.halo0]]); ctx.fill(); ctx.restore();
    }
  }
  ctx.restore();
  halo(ctx, x, y, r * .9, .18 * (o.glow ?? 1), P.halo0, P.core1);
}

// a thing rises from its own baseline (mask): fn draws it in place; u 0..1; hgt = how far below it starts
export function fromBase(ctx, baseY, u, hgt, fn, x0 = -4000, x1 = 8000) {
  if (u <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.rect(x0, baseY - 4000, x1 - x0, 4000); ctx.clip(); ctx.translate(0, (1 - u) * hgt); fn(); ctx.restore();
}

// handwriting-like wavy lines (typed words you cannot read: we never invent the instruction's text)
export function scribble(ctx, x, y, w, lh, n, size, a = 1) {
  ctx.save(); ctx.strokeStyle = rgba(P.cream, .85 * a); ctx.lineWidth = Math.max(1, size * .14); ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const lw = i === n - 1 && n > 1 ? w * .6 : w; ctx.beginPath();
    for (let k = 0; k <= 40; k++) { const q = k / 40, xx = x + q * lw, yy = y + i * lh + Math.sin(q * lw / size * 1.9 + i * 2) * size * .12 + Math.sin(q * lw / size * 5.3) * size * .05; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
    ctx.stroke();
  }
  ctx.restore();
}
